/**
 * The `/budget` command: per-scope overview with aggregated tokens, cost,
 * carbon and latency, plus `unblock <scope>` and `models` subcommands.
 * Output is model-readable and reconstructable from the session log (the
 * `command/run` + `command/done` events record the invocation; the
 * `budget/alert`/`budget/block` events record every threshold transition).
 *
 * @module dsh-budget/command
 */

import type { CommandDefinition } from '@deepseek-ai/dsh-commands'
import { sanitizeText } from './estimate/sanitize.ts'
import type { BudgetService } from './service.ts'
import type { BudgetStatus, BudgetScope } from './wire.ts'

/** Command output language. */
export type BudgetCommandLanguage = 'en' | 'zh'

/** Message bundle per language. */
interface Messages {
  hint: string
  unlimited: string
  blocked: string
  usage: string
  unknownScope: (scope: string) => string
  unblocked: (scope: string) => string
  noModels: string
}

const EN_MESSAGES: Messages = {
  hint: '[unblock <scope> | models]',
  unlimited: 'unlimited',
  blocked: 'BLOCKED',
  usage: 'usage: /budget [unblock session|daily|monthly | models]',
  unknownScope: (scope: string) => `unknown scope "${scope}" (session | daily | monthly)`,
  unblocked: (scope: string) => `budget scope "${scope}" unblocked`,
  noModels: 'no model usage recorded yet',
}

const ZH_MESSAGES: Messages = {
  hint: '[unblock <scope> | models]',
  unlimited: '不限',
  blocked: '已阻断',
  usage: '用法：/budget [unblock session|daily|monthly | models]',
  unknownScope: (scope: string) => `未知作用域 "${scope}"（session | daily | monthly）`,
  unblocked: (scope: string) => `预算作用域 "${scope}" 已解除阻断`,
  noModels: '尚未记录到任何模型用量',
}

/** Format one USD amount through the display currency. */
function money(status: BudgetStatus, usd: number): string {
  const converted = usd * status.currency.rate
  return `${converted.toFixed(status.currency.decimals)} ${status.currency.code}`
}

/** Render the overview body for one snapshot. */
export function renderBudgetOverview(status: BudgetStatus, messages: Messages): string {
  const lines: string[] = []
  for (const scope of status.scopes) {
    const capText = scope.capUsd === null ? messages.unlimited : money(status, scope.capUsd)
    const blocked = status.blockedScopes.includes(scope.scope) ? ` ${messages.blocked}` : ''
    lines.push(
      `${scope.scope}: ${money(status, scope.usedUsd)} / ${capText}`
      + ` (${Math.round(scope.ratio * 100)}% · ${scope.tokens} tokens · ${scope.carbonKg.toFixed(4)} kg CO2e)${blocked}`,
    )
  }
  if (status.models.length === 0) {
    lines.push(messages.noModels)
  } else {
    for (const model of status.models.slice(0, 8)) {
      const p50 = model.latency.p50 === null ? '-' : `${model.latency.p50}ms`
      lines.push(
        `${model.provider}/${model.model}: ${money(status, model.costUsd)}`
        + ` (${model.inputTokens} in / ${model.outputTokens} out · p50 ${p50} · ${model.carbonKg.toFixed(4)} kg CO2e)`,
      )
    }
  }
  if (status.degradedModel !== null) lines.push(`degraded model: ${status.degradedModel}`)
  return lines.join('\n')
}

/** Parse the raw input after `/budget`. */
export function parseBudgetArgs(rawInput: string):
  | { kind: 'overview' }
  | { kind: 'unblock'; scope: BudgetScope }
  | { kind: 'models' }
  | { kind: 'usage' } {
  const text = rawInput.trim()
  if (text === '') return { kind: 'overview' }
  if (text === 'models') return { kind: 'models' }
  const unblock = /^unblock\s+(session|daily|monthly)$/u.exec(text)
  if (unblock !== null) return { kind: 'unblock', scope: unblock[1] as BudgetScope }
  return { kind: 'usage' }
}

/** Render the per-model breakdown body. */
export function renderBudgetModels(status: BudgetStatus, _messages: Messages): string {
  if (status.models.length === 0) return _messages.noModels
  return status.models.map(model =>
    `${model.provider}/${model.model}: ${money(status, model.costUsd)}`
    + ` (${model.inputTokens} in / ${model.outputTokens} out · p50 ${model.latency.p50 === null ? '-' : `${model.latency.p50}ms`})`,
  ).join('\n')
}

/**
 * Build the `/budget` command definition.
 *
 * @param service - the budget service (snapshot + unblock).
 * @param language - output language.
 * @returns the command definition.
 */
export function budgetCommand(service: BudgetService, language: BudgetCommandLanguage = 'en'): CommandDefinition {
  const messages = language === 'zh' ? ZH_MESSAGES : EN_MESSAGES
  return {
    name: 'budget',
    description: 'Show per-scope budget usage (tokens, cost, carbon, latency) and lift a blocked scope with "unblock session|daily|monthly"',
    input: { hint: messages.hint },
    handler: ({ rawInput, agent }) => {
      const parsed = parseBudgetArgs(rawInput)
      if (parsed.kind === 'usage') return { kind: 'error', text: messages.usage }
      const sessionId = String(agent.session.id)
      if (parsed.kind === 'unblock') {
        const scope = parsed.scope as BudgetScope
        if (scope !== 'session' && scope !== 'daily' && scope !== 'monthly') {
          return { kind: 'error', text: messages.unknownScope(scope) }
        }
        const status = service.unblock(scope)
        return { kind: 'success', text: `${messages.unblocked(scope)}\n${renderBudgetOverview(status, messages)}` }
      }
      const status = service.status(sessionId)
      const body = parsed.kind === 'models'
        ? renderBudgetModels(status, messages)
        : renderBudgetOverview(status, messages)
      return { kind: 'success', text: body }
    },
  }
}

/** Sanitize helper re-export for display callers. */
export { sanitizeText }
