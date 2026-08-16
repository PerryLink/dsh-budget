/**
 * Budget governance: the per-scope cap checks, threshold alerts, and the
 * over-limit policy (alert / block / degrade). Pure decision logic — the only
 * side effect is the optional webhook POST, which is fire-and-forget and
 * sanitized. The actual request blocking happens in the `llm/stream`
 * waterfall short-circuit owned by `src/index.ts`; this module only decides.
 *
 * @module dsh-budget/governance
 */

import type { ResolvedConfig } from './config.ts'
import { BudgetAggregator, type ScopeUsage } from './aggregate/usage.ts'
import { sanitizeText } from './estimate/sanitize.ts'

/** One scope's budget check outcome. */
export interface ScopeDecision {
  scope: 'session' | 'daily' | 'monthly'
  /** Cap in USD; undefined = unlimited. */
  capUsd: number | undefined
  usedUsd: number
  /** usedUsd / capUsd; 0 when unlimited. */
  ratio: number
  /** `warn` (threshold reached), `over` (cap crossed), or `ok`. */
  state: 'ok' | 'warn' | 'over'
}

/** The degradation target for the current model, when configured. */
export interface Degradation {
  from: string
  to: string
}

/** Governance wiring: a decision sink plus the webhook notifier. */
export interface GovernanceHooks {
  /** Called for every warn/over decision worth alerting (cooldown-gated). */
  onAlert: (decision: ScopeDecision) => void
  /** Called when a scope becomes blocked under block/degrade policy. */
  onBlock: (scope: 'session' | 'daily' | 'monthly', degradation: Degradation | undefined) => void
}

/**
 * Check every budget scope for one session after new usage landed.
 *
 * @param config - resolved plugin config.
 * @param aggregator - the runtime aggregator.
 * @param sessionId - owning session id.
 * @param hooks - alert/block sinks.
 * @param at - current timestamp (injected for tests).
 * @returns the per-scope decisions, in scope order.
 */
export function checkBudgets(
  config: ResolvedConfig,
  aggregator: BudgetAggregator,
  sessionId: string,
  hooks: GovernanceHooks,
  at: number,
): ScopeDecision[] {
  const scopes: Array<{ scope: 'session' | 'daily' | 'monthly'; used: ScopeUsage; cap: number | undefined }> = [
    { scope: 'session', used: aggregator.sessionUsage(sessionId), cap: config.budgets.session },
    { scope: 'daily', used: aggregator.todayUsage(), cap: config.budgets.daily },
    { scope: 'monthly', used: aggregator.monthUsage(), cap: config.budgets.monthly },
  ]

  const decisions: ScopeDecision[] = []
  for (const { scope, used, cap } of scopes) {
    if (cap === undefined || cap <= 0) {
      decisions.push({ scope, capUsd: undefined, usedUsd: used.costUsd, ratio: 0, state: 'ok' })
      continue
    }
    const ratio = used.costUsd / cap
    const state: ScopeDecision['state'] = used.costUsd >= cap ? 'over' : used.costUsd >= cap * config.warnRatio ? 'warn' : 'ok'
    decisions.push({ scope, capUsd: cap, usedUsd: used.costUsd, ratio, state })

    if (state === 'ok' || !config.alertsEnabled) continue
    const age = aggregator.lastAlertAge(scope, state, at)
    if (age < config.alertCooldownMs) continue
    aggregator.recordAlert({ scope, kind: state, at, usedUsd: used.costUsd, capUsd: cap })
    hooks.onAlert(decisions[decisions.length - 1]!)

    if (state === 'over') {
      if (config.overLimit === 'block' || config.overLimit === 'degrade') {
        aggregator.blockScope(scope)
        hooks.onBlock(scope, degradationFor(config, aggregator, scope))
      }
    }
  }
  return decisions
}

/** The degradation pair for the current attribution, when configured. */
export function degradationFor(
  config: ResolvedConfig,
  aggregator: BudgetAggregator,
  _scope: 'session' | 'daily' | 'monthly',
): Degradation | undefined {
  const model = aggregator.attribution().model
  if (model === '') return undefined
  const to = config.degradation[model]
  if (to === undefined || to === '') return undefined
  return { from: model, to }
}

/** Sanitize a webhook URL for logs: scheme + host only, credentials dropped. */
export function webhookDisplay(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`
  } catch {
    return sanitizeText(url, 80)
  }
}

/**
 * Fire one threshold-alert webhook POST (JSON body). Failures are swallowed
 * and returned — alerts must never crash the hot path. The URL itself is
 * never logged with credentials attached.
 *
 * @param url - validated webhook URL.
 * @param payload - JSON-serializable payload.
 * @param timeoutMs - request timeout.
 * @param logger - warn sink for failures.
 * @returns the outcome (ok or the error message).
 */
export async function sendWebhook(
  url: string,
  payload: Record<string, unknown>,
  timeoutMs: number,
  logger: { warn: (message: string) => void },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (response.status < 200 || response.status >= 300) {
        return { ok: false, error: `webhook answered HTTP ${response.status}` }
      }
      return { ok: true }
    } finally {
      clearTimeout(timer)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.warn(`budget webhook alert failed (${webhookDisplay(url)}): ${message}`)
    return { ok: false, error: message }
  }
}
