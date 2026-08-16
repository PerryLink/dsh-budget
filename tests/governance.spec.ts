/**
 * Budget governance: warn/over transitions, cooldown gating, and the
 * block/degrade policies. Pure decision logic with injected clock.
 *
 * @module dsh-budget/test/governance.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { BudgetAggregator } from '../src/aggregate/usage.ts'
import { checkBudgets, degradationFor, webhookDisplay } from '../src/governance.ts'
import type { ScopeDecision } from '../src/governance.ts'

const FIXED_NOW = Date.parse('2026-08-16T12:00:00Z')

interface Sink {
  alerts: ScopeDecision[]
  blocks: Array<{ scope: 'session' | 'daily' | 'monthly'; degradation: { from: string; to: string } | undefined }>
}

function run(config: Record<string, unknown>, usage: { inputTokens: number; outputTokens?: number }, sessionId = 's1'): { aggregator: BudgetAggregator; sink: Sink; decisions: ScopeDecision[] } {
  const resolved = resolveConfig({ budgets: { session: 10, daily: 50, monthly: 500 }, ...config } as never)
  const aggregator = new BudgetAggregator(resolved, () => FIXED_NOW)
  const sink: Sink = { alerts: [], blocks: [] }
  aggregator.setAttribution('deepseek', 'deepseek-chat')
  aggregator.recordUsage(sessionId, { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens ?? 0 })
  const decisions = checkBudgets(resolved, aggregator, sessionId, {
    onAlert: decision => { sink.alerts.push(decision) },
    onBlock: (scope, degradation) => { sink.blocks.push({ scope, degradation }) },
  }, FIXED_NOW)
  return { aggregator, sink, decisions }
}

describe('checkBudgets', () => {
  it('stays ok below the warn ratio', () => {
    const { decisions } = run({ warnRatio: 0.8 }, { inputTokens: 1_000_000 }) // 0.27 USD
    expect(decisions.map(decision => decision.state)).toEqual(['ok', 'ok', 'ok'])
  })

  it('warns at the warn ratio (0.8 of the session cap = 8 USD)', () => {
    const { decisions, sink } = run({ warnRatio: 0.8 }, { inputTokens: 32_000_000 }) // ~8.64 USD
    const session = decisions[0]
    expect(session?.state).toBe('warn')
    expect(sink.alerts.length).toBe(1)
    expect(sink.alerts[0]?.state).toBe('warn')
  })

  it('blocks under the block policy once a cap is crossed', () => {
    const { decisions, sink, aggregator } = run({ overLimit: 'block', warnRatio: 0.8 }, { inputTokens: 40_000_000 }) // ~10.8 USD
    expect(decisions[0]?.state).toBe('over')
    expect(sink.blocks.length).toBe(1)
    expect(sink.blocks[0]?.scope).toBe('session')
    expect(aggregator.blockedScopes).toContain('session')
  })

  it('resolves the degradation pair under the degrade policy', () => {
    const { sink, aggregator } = run(
      { overLimit: 'degrade', warnRatio: 0.8, degradation: { 'deepseek-chat': 'deepseek-chat-lite' } },
      { inputTokens: 40_000_000 },
    )
    expect(sink.blocks[0]?.degradation).toEqual({ from: 'deepseek-chat', to: 'deepseek-chat-lite' })
    expect(degradationFor(resolveConfig({ degradation: { 'deepseek-chat': 'x' } }), aggregator, 'session')).toEqual({ from: 'deepseek-chat', to: 'x' })
  })

  it('suppresses repeat alerts inside the cooldown window', () => {
    const resolved = resolveConfig({ budgets: { session: 100 }, warnRatio: 0.05, alertCooldownMs: 60_000 } as never)
    const aggregator = new BudgetAggregator(resolved, () => FIXED_NOW)
    const sink: Sink = { alerts: [], blocks: [] }
    aggregator.setAttribution('deepseek', 'deepseek-chat')
    aggregator.recordUsage('s1', { inputTokens: 32_000_000, outputTokens: 0 })
    checkBudgets(resolved, aggregator, 's1', { onAlert: decision => { sink.alerts.push(decision) }, onBlock: () => {} }, FIXED_NOW)
    aggregator.recordUsage('s1', { inputTokens: 32_000_000, outputTokens: 0 })
    checkBudgets(resolved, aggregator, 's1', { onAlert: decision => { sink.alerts.push(decision) }, onBlock: () => {} }, FIXED_NOW + 30_000)
    expect(sink.alerts.length).toBe(1)
  })

  it('does not alert when alerts are disabled', () => {
    const { sink } = run({ alertsEnabled: false, warnRatio: 0.01 }, { inputTokens: 32_000_000 })
    expect(sink.alerts.length).toBe(0)
  })
})

describe('webhookDisplay', () => {
  it('drops credentials from the URL', () => {
    expect(webhookDisplay('https://user:secret@example.com/hook')).toBe('https://example.com/hook')
  })
})
