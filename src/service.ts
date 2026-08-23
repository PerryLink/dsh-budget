/**
 * The budget host service: assembles the `BudgetStatus` snapshot and serves
 * it under the `budget` Typert Remote namespace (`budget/status`), plus the
 * two runtime actions — `setSettings` (session-scoped runtime caps and alert
 * switches, never a config-file write) and `unblock` (lift one blocked scope
 * after user confirmation). All data comes from the runtime aggregator; the
 * service performs no I/O of its own.
 *
 * @module dsh-budget/service
 */

import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { ResolvedConfig } from './config.ts'
import { BudgetAggregator } from './aggregate/usage.ts'
import type { BudgetScope } from './wire.ts'
import { BUDGET_SETTINGS_SCHEMA, type BudgetStatus, type DayLine, type ModelLine, type ScopeLine } from './wire.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Budget snapshot + runtime actions service (this package). */
    budget: BudgetService
  }
}

/** Runtime-editable settings (session-scoped; a reload restores cordis.yml). */
export interface RuntimeSettings {
  sessionCapUsd: number | null
  dailyCapUsd: number | null
  monthlyCapUsd: number | null
  alertsEnabled: boolean
  desktopNotifications: boolean
}

/** Effective cap lookup: runtime override first, then the config. */
export function effectiveCap(settings: RuntimeSettings, config: ResolvedConfig, scope: BudgetScope): number | null {
  if (scope === 'session') return settings.sessionCapUsd ?? (config.budgets.session ?? null)
  if (scope === 'daily') return settings.dailyCapUsd ?? (config.budgets.daily ?? null)
  return settings.monthlyCapUsd ?? (config.budgets.monthly ?? null)
}

/** One latency window's percentile summary. */
function latencySummary(samples: readonly number[]): ModelLine['latency'] {
  if (samples.length === 0) return { min: null, p50: null, p95: null, max: null, samples: 0 }
  const sorted = [...samples].sort((a, b) => a - b)
  const at = (p: number): number => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0
  return { min: sorted[0] ?? null, p50: at(0.5), p95: at(0.95), max: sorted[sorted.length - 1] ?? null, samples: sorted.length }
}

/**
 * The `budget` Typert Remote service. Constructed by `src/index.ts` with the
 * shared aggregator, the resolved config, and the runtime settings object;
 * mounted through `ctx.plugin`.
 */
export class BudgetService extends TypertRemoteService {
  /** No service dependencies: pure status surface over injected bindings. */
  static inject = []

  /**
   * @param ctx - the mounting context.
   * @param bindings - aggregator, resolved config, runtime settings, and the degraded-model probe.
   */
  constructor(
    ctx: Context,
    private readonly bindings: {
      aggregator: BudgetAggregator
      config: ResolvedConfig
      settings: RuntimeSettings
      /** Current session id the panel/command attribute usage to. */
      sessionId: () => string
      /** Degradation pair in force (when a cap blocked under degrade). */
      degradation: () => { from: string; to: string } | undefined
      /** Audit hook called after a block is lifted. */
      onUnblock?: (scope: BudgetScope) => void
    },
  ) {
    super(ctx, 'budget')
  }

  /** Assemble the wire snapshot for one session. */
  status(sessionId?: string): BudgetStatus {
    const { aggregator, config, settings } = this.bindings
    const id = sessionId ?? this.bindings.sessionId()
    const snapshot = aggregator.snapshotFor(id === '' ? sessionId ?? '' : id)

    const scopes: ScopeLine[] = (['session', 'daily', 'monthly'] as const).map(scope => {
      const used = scope === 'session' ? snapshot.session : scope === 'daily' ? snapshot.today : snapshot.thisMonth
      const cap = effectiveCap(settings, config, scope)
      return {
        scope,
        capUsd: cap,
        usedUsd: used.costUsd,
        ratio: cap === null || cap <= 0 ? 0 : used.costUsd / cap,
        tokens: used.inputTokens + used.outputTokens + used.cacheReadTokens + used.cacheWriteTokens,
        carbonKg: used.carbonKg,
      }
    })

    const models: ModelLine[] = snapshot.models.map(entry => ({
      provider: entry.provider,
      model: entry.model,
      inputTokens: entry.inputTokens + entry.cacheReadTokens + entry.cacheWriteTokens,
      outputTokens: entry.outputTokens,
      costUsd: entry.costUsd,
      carbonKg: entry.carbonKg,
      latency: latencySummary(entry.latencyMs),
    }))

    const degraded = this.bindings.degradation()
    const days: DayLine[] = snapshot.days.map(entry => ({
      day: entry.day,
      costUsd: entry.usage.costUsd,
      tokens: entry.usage.inputTokens + entry.usage.outputTokens + entry.usage.cacheReadTokens + entry.usage.cacheWriteTokens,
      carbonKg: entry.usage.carbonKg,
    }))
    return {
      scopes,
      models,
      alerts: snapshot.alerts.map(alert => ({ ...alert })),
      blockedScopes: [...snapshot.blockedScopes],
      currency: { code: config.currency.code, rate: config.currency.rate, decimals: config.currency.decimals },
      alertsEnabled: settings.alertsEnabled,
      desktopNotifications: settings.desktopNotifications,
      degradedModel: degraded === undefined ? null : degraded.to,
      days,
      warnRatio: config.warnRatio,
      refreshIntervalMs: config.refreshIntervalMs,
    }
  }

  /** Apply the panel's runtime settings and return the refreshed snapshot. */
  setSettings(settingsJson: string): BudgetStatus {
    let parsed: unknown
    try {
      parsed = JSON.parse(settingsJson)
    } catch (error) {
      throw new TypeError(`budget.setSettings requires a JSON payload: ${error instanceof Error ? error.message : 'invalid JSON'}`)
    }
    const validated = BUDGET_SETTINGS_SCHEMA.parse(parsed)
    const settings = this.bindings.settings
    settings.sessionCapUsd = validated.sessionCapUsd
    settings.dailyCapUsd = validated.dailyCapUsd
    settings.monthlyCapUsd = validated.monthlyCapUsd
    settings.alertsEnabled = validated.alertsEnabled
    settings.desktopNotifications = validated.desktopNotifications
    return this.status()
  }

  /** Lift one blocked scope and return the refreshed snapshot. */
  unblock(scope: BudgetScope): BudgetStatus {
    this.bindings.aggregator.unblockScope(scope)
    this.bindings.onUnblock?.(scope)
    return this.status()
  }
}
