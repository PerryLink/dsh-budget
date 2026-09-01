/**
 * `dsh-budget` 鈥?cost governance for DeepSeek Harness. Aggregated
 * token/cost/carbon metering per model, session and day; session/daily/monthly
 * budget caps with threshold alerts (webhook + desktop notification flag) and
 * alert/block/degrade over-limit policies; per-model latency statistics; the
 * `budget` Typert Remote (`budget/status`, `budget/setSettings`,
 * `budget/unblock`) that the browser half's Settings tab consumes; the
 * `/budget` command; and `budget/alert` + `budget/block` session audit events
 * (suppressed on hosts whose fail-closed event vocabulary rejects them).
 *
 * Function plugin 鈥?no default export (the Loader unwraps
 * `exports.default ?? exports`).
 *
 * Seam notes (verified against 0.1.1-rc.2 and the local checkout):
 * - Usage arrives as `assistant/message` events (`usage?: TokenUsage`);
 *   provider/model attribution comes from the latest `request/header`
 *   (`header.config.provider` / `header.config.model`).
 * - Blocking happens on the `llm/stream` waterfall: when a scope is blocked
 *   the listener short-circuits (no `next()`) and yields a text block plus an
 *   error finish that names the budget breach 鈥?loop-built requests are
 *   deep-frozen and may NOT be rewritten, so `degrade` manifests the same way
 *   with corrective text naming the degraded model (plus the alert). A
 *   waterfall listener short-circuit is a deliberate claim, not a passthrough
 *   bug: pass-through paths always call `next()`.
 * - Session audit appends use the two-argument `Session.append` form (the
 *   pinned rc.2 peers have no append-envelope option).
 *
 * @module dsh-budget
 */

import type { Context } from '@deepseek-ai/cordis'
import type { FinishReason, StreamChunk } from '@deepseek-ai/dsh-llm'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-tools'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { Config, resolveConfig } from './config.ts'
import { BudgetAggregator } from './aggregate/usage.ts'
import type { PersistedBudgetState } from './aggregate/usage.ts'
import { checkBudgets, sendWebhook, type Degradation, type GovernanceHooks, type ScopeDecision } from './governance.ts'
import { ALERT_EVENT, auditAppendsAllowed, BLOCK_EVENT, type BudgetAlertEvent, type BudgetBlockEvent } from './events.ts'
import { BudgetService, effectiveCap, type RuntimeSettings } from './service.ts'
import { budgetCommand } from './command.ts'
import { budgetDomainSpec } from './store.ts'

/**
 * The installed `@deepseek-ai/dsh-session` version: the session package
 * ships with the harness, so its version names the harness line. Read from
 * the package manifest next to the resolved entry.
 *
 * @returns the harness-line version, or undefined when the peer cannot be
 * resolved or the manifest cannot be read.
 */
function installedSessionVersion(): string | undefined {
  try {
    const entry = createRequire(import.meta.url).resolve('@deepseek-ai/dsh-session')
    let dir = dirname(entry)
    for (let depth = 0; depth < 6; depth++) {
      try {
        const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { name?: unknown; version?: unknown }
        if (manifest.name === '@deepseek-ai/dsh-session' && typeof manifest.version === 'string') return manifest.version
      } catch (error) {
        // No manifest at this level (or unreadable): walk toward the root.
      }
      const parent = dirname(dir)
      if (parent === dir) return undefined
      dir = parent
    }
    return undefined
  } catch (error) {
    // The peer failed to resolve: treat the line as unknown (legacy write
    // behavior); the append guard below still surfaces write failures.
    return undefined
  }
}

export const name = 'dsh-budget'

/** Hard services: the session store every aggregation keys off. */
export const inject = ['sessions']

export { Config, resolveConfig } from './config.ts'
export type { ResolvedConfig } from './config.ts'
export { BudgetAggregator } from './aggregate/usage.ts'
export type { PersistedBudgetState, PersistedBucket, PersistedModelUsage } from './aggregate/usage.ts'
export { checkBudgets, degradationFor } from './governance.ts'
export { BudgetService, effectiveCap } from './service.ts'
export { budgetCommand, parseBudgetArgs, renderBudgetModels, renderBudgetOverview } from './command.ts'
export { ALERT_EVENT, auditAppendsAllowed, BLOCK_EVENT } from './events.ts'
export { budgetDomainSpec, budgetStateSchema } from './store.ts'

/** The short-circuit stream the blocker yields when a scope is blocked. */
function blockedStream(message: string, code: string): AsyncIterable<StreamChunk> {
  const finish: FinishReason = { kind: 'error', failure: { message, code } }
  return (async function* (): AsyncGenerator<StreamChunk> {
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: message }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: message } }
    yield { type: 'finish', reason: finish }
  })()
}

/** The structural surface of the optional `ctx.storageDomain` service (persistence). */
interface StorageDomainService {
  open(spec: unknown): Promise<{
    table(name: string): { get(key: string): PersistedBudgetState | undefined; put(key: string, value: PersistedBudgetState): Promise<unknown> }
    close(): Promise<void>
  }>
}

/**
 * Mount the plugin: resolve config, build the aggregator, restore any durable
 * day/month buckets, wire the session event feed, the budget checks, the
 * `llm/stream` blocker, the webhook alerts, the `budget` Remote service, and
 * the `/budget` command. Persistence is optional and degrades to in-memory
 * when the storage domain is absent.
 *
 * @param ctx - the plugin context (host).
 * @param config - raw plugin config.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const resolved = resolveConfig(config)
  const logger = ctx.logger('budget')
  const aggregator = new BudgetAggregator(resolved)

  // Durable day/month persistence: restore once at mount and snapshot on a
  // timer. The storage domain is optional — when absent, aggregation stays
  // process-local (the pre-persistence behavior) and the plugin keeps working.
  if (resolved.persistence.enabled) {
    const storageDomain = ctx.get('storageDomain') as StorageDomainService | undefined
    if (storageDomain !== undefined) {
      try {
        const domain = await storageDomain.open(budgetDomainSpec)
        const table = domain.table('state')
        const persisted = table.get('usage')
        if (persisted !== undefined) aggregator.restoreState(persisted)
        ctx.effect(() => {
          const timer = setInterval(() => {
            void table.put('usage', aggregator.exportState()).catch(error => {
              logger.warn(`budget persistence write failed: ${error instanceof Error ? error.message : String(error)}`)
            })
          }, resolved.persistence.intervalMs)
          return async () => {
            clearInterval(timer)
            try {
              await table.put('usage', aggregator.exportState())
            } catch (error) {
              logger.warn(`final budget persistence write failed: ${error instanceof Error ? error.message : String(error)}`)
            }
            await domain.close()
          }
        })
      } catch (error) {
        logger.warn(`budget persistence unavailable (degrading to in-memory): ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  const settings: RuntimeSettings = {
    sessionCapUsd: resolved.budgets.session ?? null,
    dailyCapUsd: resolved.budgets.daily ?? null,
    monthlyCapUsd: resolved.budgets.monthly ?? null,
    alertsEnabled: resolved.alertsEnabled,
    desktopNotifications: resolved.desktopNotifications,
  }
  let degradation: Degradation | undefined

  // Host event-vocabulary gate: from 0.1.2-alpha.1 the session read path
  // refuses logs containing event types outside the harness-known vocabulary
  // and no external registration surface exists, so appending
  // budget/alert + budget/block would poison the log. 0.1.2-alpha.3 keeps
  // the suppression: its envelope field is retained for stored-log read
  // compatibility only and Session.append still cannot stamp the marker.
  // The installed
  // @deepseek-ai/dsh-session package carries the harness line version, so
  // this probe distinguishes legacy lines (keep writing) from fail-closed
  // lines (suppress and log the degradation reason).
  const auditWritable = auditAppendsAllowed(installedSessionVersion())
  if (!auditWritable) {
    logger.warn('budget audit events suppressed on this harness (>= 0.1.2-alpha.1): the fail-closed session event vocabulary rejects logs containing unregistered event types and exposes no external registration surface; the alert/block trail degrades to the budget logger and webhook only')
  }

  const append = (session: Session, type: 'budget/alert' | 'budget/block', event: BudgetAlertEvent | BudgetBlockEvent): void => {
    if (!auditWritable) return
    // Session appends are reentrancy-guarded: the budget checks run inside the
    // `session/event` callback (during the publish of the triggering event),
    // so the audit append is deferred to a microtask that lands after publish.
    queueMicrotask(() => {
      try {
        session.append(type, event)
      } catch (error) {
        logger.warn(`audit append failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    })
  }

  const hooks: GovernanceHooks = {
    onAlert: (decision: ScopeDecision): void => {
      if (decision.capUsd === undefined || decision.state === 'ok') return
      logger.warn(`budget ${decision.scope} ${decision.state}: ${decision.usedUsd.toFixed(4)} USD of ${decision.capUsd} USD`)
      const session = currentSession()
      if (session !== undefined) {
        append(session, ALERT_EVENT, { scope: decision.scope, kind: decision.state, usedUsd: decision.usedUsd, capUsd: decision.capUsd })
      }
      if (resolved.webhookUrl !== undefined && settings.alertsEnabled) {
        void sendWebhook(resolved.webhookUrl, {
          plugin: 'dsh-budget',
          scope: decision.scope,
          kind: decision.state,
          usedUsd: decision.usedUsd,
          capUsd: decision.capUsd,
        }, resolved.webhookTimeoutMs, logger)
      }
    },
    onBlock: (scope: 'session' | 'daily' | 'monthly', pair: Degradation | undefined): void => {
      degradation = pair
      const session = currentSession()
      if (session !== undefined) {
        append(session, BLOCK_EVENT, { scope, blocked: true, ...(pair === undefined ? {} : { degradation: pair }) })
      }
    },
  }

  /** The session that the plugin attributes audits to (the latest observed). */
  let lastSession: Session | undefined
  const currentSession = (): Session | undefined => lastSession

  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    try {
      lastSession = session
      if (event.type === 'request/header') {
        aggregator.setAttribution(event.data.header.config.provider, event.data.header.config.model)
        return
      }
      if (event.type === 'assistant/message') {
        const usage = event.data.usage
        if (usage === undefined) return
        const sessionId = String(session.id)
        aggregator.recordUsage(sessionId, usage)
        checkBudgets(resolved, aggregator, sessionId, hooks, Date.now())
      }
    } catch (error) {
      logger.warn(`session "${session.id}": budget event handling failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  })

  // The blocking seam: when a scope is blocked the model stream is
  // short-circuited with a corrective error finish instead of reaching the
  // provider. Pass-through paths always call next().
  const llm = ctx.get('llm')
  if (llm !== undefined) {
    ctx.on('llm/stream', function (_options, next) {
      const blocked = aggregator.blockedScopes
      if (blocked.length === 0) return next()
      const caps = blocked.map(scope => {
        const cap = effectiveCap(settings, resolved, scope)
        return { scope, cap }
      })
      const capText = caps.map(entry => `${entry.scope} (${entry.cap === null ? 'unlimited' : `${entry.cap} USD`})`).join(', ')
      const guidance = degradation === undefined
        ? `budget blocked for ${capText}. Ask the user to lift the block with "/budget unblock <scope>" before continuing.`
        : `budget blocked for ${capText}. Continue with the degraded model "${degradation.to}" (or ask the user to lift the block with "/budget unblock <scope>").`
      logger.warn(`blocking llm stream: ${guidance}`)
      return blockedStream(guidance, 'BUDGET_BLOCKED')
    }, { prepend: true })
  }

  // Latency sampling: measure every model call around the stream wrapper.
  if (resolved.latency.enabled) {
    ctx.on('llm/stream', async function* (options, next) {
      const started = Date.now()
      const model = String(options.model ?? '')
      try {
        yield* await next()
      } finally {
        if (model !== '') aggregator.recordLatency(model, Date.now() - started)
      }
    })
  }

  // The Remote service (panel + client channel). The unblock audit hook keeps
  // the transition reconstructable from the session log.
  await ctx.plugin(BudgetService, {
    aggregator,
    config: resolved,
    settings,
    sessionId: () => (lastSession === undefined ? '' : String(lastSession.id)),
    degradation: () => degradation,
    onUnblock: (scope: 'session' | 'daily' | 'monthly') => {
      const session = currentSession()
      if (session !== undefined) append(session, BLOCK_EVENT, { scope, blocked: false })
    },
  } satisfies ConstructorParameters<typeof BudgetService>[1])

  // The /budget command (optional service, fail closed).
  const commands = ctx.get('commands')
  if (commands !== undefined) {
    ctx.effect(() => commands.register(budgetCommand(ctx.get('budget') as BudgetService, resolved.outputLanguage)), 'dsh-budget: /budget command')
  }
}

