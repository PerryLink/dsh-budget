/**
 * The usage aggregator: turns the session event stream into per-session,
 * per-day, and per-month token/cost/carbon buckets plus per-model latency
 * windows. Pure state and pure accounting — the caller feeds events and the
 * aggregator owns no I/O, no timers, and no Cordis services, so every policy
 * path is unit-testable without a harness.
 *
 * @module dsh-budget/aggregate
 */

import type { TokenUsage } from '@deepseek-ai/dsh-llm'
import { estimateUsageCost, mergePrices, priceFor, type PriceEntry } from '../estimate/prices.ts'
import { tokenCarbon } from '../estimate/carbon.ts'
import type { ResolvedConfig } from '../config.ts'

/** One scope's token buckets (disjoint, mirroring TokenUsage). */
export interface TokenBuckets {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

/** One scope's aggregated usage. */
export interface ScopeUsage extends TokenBuckets {
  costUsd: number
  carbonKg: number
}

/** Empty usage record. */
export function emptyUsage(): ScopeUsage {
  return { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0, carbonKg: 0 }
}

/** One model's aggregated usage plus latency statistics. */
export interface ModelUsage extends ScopeUsage {
  provider: string
  model: string
  /** Latency samples kept for this model (ms). */
  latencyMs: readonly number[]
}

/** One recorded threshold alert. */
export interface AlertRecord {
  scope: 'session' | 'daily' | 'monthly'
  kind: 'warn' | 'over'
  at: number
  usedUsd: number
  capUsd: number
}

/** One day's aggregated usage in the per-day history. */
export interface DayUsage {
  /** UTC day key, `YYYY-MM-DD`. */
  day: string
  usage: ScopeUsage
}

/** UTC day key, e.g. `2026-08-16`. */
export function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}

/** UTC month key, e.g. `2026-08`. */
export function monthKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 7)
}

/** Internal aggregation state. */
interface AggregatorState {
  sessions: Map<string, ScopeUsage>
  days: Map<string, { total: ScopeUsage; models: Map<string, ModelUsage> }>
  months: Map<string, { total: ScopeUsage; models: Map<string, ModelUsage> }>
  latency: Map<string, number[]>
  blockedScopes: Set<'session' | 'daily' | 'monthly'>
  alerts: AlertRecord[]
  lastAlertAt: Map<string, number>
  /** Current provider/model attribution (latest request/header). */
  provider: string
  model: string
}

/** Everything the panel and the /budget command read (session-attributed via {@link BudgetAggregator.snapshotFor}). */
export interface BudgetSnapshot {
  session: ScopeUsage
  today: ScopeUsage
  thisMonth: ScopeUsage
  models: readonly ModelUsage[]
  /** Alerts in reverse chronological order. */
  alerts: readonly AlertRecord[]
  blockedScopes: readonly ('session' | 'daily' | 'monthly')[]
  /** Per-day usage over the last `historyDays` days, oldest first. */
  days: readonly DayUsage[]
}

/**
 * The runtime aggregator. All methods are synchronous; the caller invokes
 * them from the session-event listener (the event hot path).
 */
export class BudgetAggregator {
  private readonly state: AggregatorState
  private readonly table: Record<string, PriceEntry>

  /** @param config - resolved plugin config. @param now - clock (defaults to Date.now). */
  constructor(private readonly config: ResolvedConfig, private readonly now: () => number = Date.now) {
    this.table = mergePrices(config.prices)
    this.state = {
      sessions: new Map(),
      days: new Map(),
      months: new Map(),
      latency: new Map(),
      blockedScopes: new Set(),
      alerts: [],
      lastAlertAt: new Map(),
      provider: '',
      model: '',
    }
  }

  /** Update the current provider/model attribution from a request header. */
  setAttribution(provider: string, model: string): void {
    this.state.provider = provider
    this.state.model = model
  }

  /** The current provider/model attribution (latest request header). */
  attribution(): { provider: string; model: string } {
    return { provider: this.state.provider, model: this.state.model }
  }

  /**
   * Record one usage payload against the current attribution. Unknown or
   * zero usage is a no-op.
   *
   * @param sessionId - owning session id (string form).
   * @param usage - the token usage payload.
   */
  recordUsage(sessionId: string, usage: TokenUsage): void {
    const input = usage.inputTokens
    const output = usage.outputTokens
    const cacheRead = usage.cacheReadTokens ?? 0
    const cacheWrite = usage.cacheWriteTokens ?? 0
    if (input + output + cacheRead + cacheWrite <= 0) return

    const price = priceFor(this.table, this.config.defaultPrice, this.state.provider, this.state.model)
    const cost = estimateUsageCost(price, input, output, cacheRead, cacheWrite)
    const tokens = input + output + cacheRead + cacheWrite
    const carbon = this.config.carbon.enabled
      ? tokenCarbon(tokens, this.config.carbon.energyKwhPerToken, this.config.carbon.pue, this.config.carbon.region).co2Kg
      : 0

    const add = (target: ScopeUsage): void => {
      target.inputTokens += input
      target.outputTokens += output
      target.cacheReadTokens += cacheRead
      target.cacheWriteTokens += cacheWrite
      target.costUsd += cost.totalCost
      target.carbonKg += carbon
    }

    const session = this.state.sessions.get(sessionId) ?? emptyUsage()
    add(session)
    this.state.sessions.set(sessionId, session)

    const at = this.now()
    const day = this.state.days.get(dayKey(at)) ?? { total: emptyUsage(), models: new Map() }
    add(day.total)
    this.addModel(day.models, input, output, cacheRead, cacheWrite, cost.totalCost, carbon)
    this.state.days.set(dayKey(at), day)

    const month = this.state.months.get(monthKey(at)) ?? { total: emptyUsage(), models: new Map() }
    add(month.total)
    this.addModel(month.models, input, output, cacheRead, cacheWrite, cost.totalCost, carbon)
    this.state.months.set(monthKey(at), month)
  }

  /** Record one measured call duration for one model. */
  recordLatency(model: string, durationMs: number): void {
    if (!this.config.latency.enabled || !Number.isFinite(durationMs) || durationMs < 0) return
    const window = this.state.latency.get(model) ?? []
    window.push(durationMs)
    if (window.length > this.config.latency.windowSize) window.shift()
    this.state.latency.set(model, window)
  }

  /** Merge one usage record into a per-model map. */
  private addModel(
    models: Map<string, ModelUsage>,
    input: number,
    output: number,
    cacheRead: number,
    cacheWrite: number,
    costUsd: number,
    carbonKg: number,
  ): void {
    const model = this.state.model || 'unknown'
    const entry = models.get(model) ?? {
      provider: this.state.provider || 'unknown',
      model,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      costUsd: 0,
      carbonKg: 0,
      latencyMs: [],
    }
    entry.inputTokens += input
    entry.outputTokens += output
    entry.cacheReadTokens += cacheRead
    entry.cacheWriteTokens += cacheWrite
    entry.costUsd += costUsd
    entry.carbonKg += carbonKg
    models.set(model, entry)
  }

  /** Read one session's usage (empty when unknown). */
  sessionUsage(sessionId: string): ScopeUsage {
    return this.state.sessions.get(sessionId) ?? emptyUsage()
  }

  /** Read today's usage. */
  todayUsage(): ScopeUsage {
    return this.state.days.get(dayKey(this.now()))?.total ?? emptyUsage()
  }

  /** Read this month's usage. */
  monthUsage(): ScopeUsage {
    return this.state.months.get(monthKey(this.now()))?.total ?? emptyUsage()
  }

  /**
   * Per-day usage over the last `limit` days, oldest first, zero-filled for
   * days with no recorded usage. Days are UTC keys derived from the injected
   * clock, so a fixed test clock yields a stable series.
   *
   * @param limit - number of trailing days to return.
   */
  dayHistory(limit: number): DayUsage[] {
    const now = this.now()
    const result: DayUsage[] = []
    for (let offset = limit - 1; offset >= 0; offset -= 1) {
      const key = dayKey(now - offset * 86_400_000)
      result.push({ day: key, usage: this.state.days.get(key)?.total ?? emptyUsage() })
    }
    return result
  }

  /** Per-model usage (today) with latency percentiles, sorted by cost. */
  modelUsage(): ModelUsage[] {
    const day = this.state.days.get(dayKey(this.now()))
    const list = [...(day?.models.values() ?? [])]
    for (const entry of list) {
      const window = this.state.latency.get(entry.model) ?? []
      entry.latencyMs = [...window]
    }
    list.sort((a, b) => b.costUsd - a.costUsd)
    return list
  }

  /** Record one threshold alert (bounded to the most recent 50). */
  recordAlert(alert: AlertRecord): void {
    this.state.alerts.unshift(alert)
    if (this.state.alerts.length > 50) this.state.alerts.length = 50
    this.state.lastAlertAt.set(`${alert.scope}:${alert.kind}`, alert.at)
  }

  /** Milliseconds since the last alert of the same scope+kind (Infinity when none). */
  lastAlertAge(scope: 'session' | 'daily' | 'monthly', kind: 'warn' | 'over', at: number): number {
    const last = this.state.lastAlertAt.get(`${scope}:${kind}`)
    return last === undefined ? Number.POSITIVE_INFINITY : at - last
  }

  /** The current blocked scopes (budget crosses that the user has not lifted). */
  get blockedScopes(): readonly ('session' | 'daily' | 'monthly')[] {
    return [...this.state.blockedScopes]
  }

  /** Mark one scope blocked (over-limit with block/degrade policy). */
  blockScope(scope: 'session' | 'daily' | 'monthly'): void {
    this.state.blockedScopes.add(scope)
  }

  /** Lift a block (user confirmation through /budget unblock or the panel). */
  unblockScope(scope: 'session' | 'daily' | 'monthly'): void {
    this.state.blockedScopes.delete(scope)
  }

  /**
   * The per-scope snapshot for one session (the panel and the command
   * attribute usage to the session that owns the view).
   *
   * @param sessionId - owning session id.
   * @returns the session-attributed snapshot.
   */
  snapshotFor(sessionId: string): BudgetSnapshot {
    return {
      session: this.sessionUsage(sessionId),
      today: this.todayUsage(),
      thisMonth: this.monthUsage(),
      models: this.modelUsage(),
      alerts: [...this.state.alerts],
      blockedScopes: this.blockedScopes,
      days: this.dayHistory(this.config.historyDays),
    }
  }
}
