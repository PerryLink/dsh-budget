/**
 * Aggregator accounting: per-session/day/month buckets, model attribution,
 * latency windows, and the blocked-scope registry. Pure logic — no harness.
 *
 * @module dsh-budget/test/aggregate.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { BudgetAggregator, dayKey, monthKey } from '../src/aggregate/usage.ts'

/** A fixed clock so day/month keys are stable across runs. */
const FIXED_NOW = Date.parse('2026-08-16T12:00:00Z')

function makeAggregator(): BudgetAggregator {
  return new BudgetAggregator(resolveConfig({}), () => FIXED_NOW)
}

describe('BudgetAggregator', () => {
  it('accumulates one usage record into session/day/month buckets', () => {
    const aggregator = makeAggregator()
    aggregator.setAttribution('deepseek', 'deepseek-chat')
    aggregator.recordUsage('s1', { inputTokens: 500_000, outputTokens: 100_000 })
    expect(aggregator.sessionUsage('s1').inputTokens).toBe(500_000)
    expect(aggregator.todayUsage().outputTokens).toBe(100_000)
    expect(aggregator.monthUsage().inputTokens).toBe(500_000)
  })

  it('prices usage through the built-in table', () => {
    const aggregator = makeAggregator()
    aggregator.setAttribution('deepseek', 'deepseek-chat')
    aggregator.recordUsage('s1', { inputTokens: 1_000_000, outputTokens: 0 })
    expect(aggregator.sessionUsage('s1').costUsd).toBeCloseTo(0.27)
  })

  it('uses the fallback price for unknown models', () => {
    const aggregator = makeAggregator()
    aggregator.setAttribution('acme', 'unknown-model')
    aggregator.recordUsage('s1', { inputTokens: 1_000_000, outputTokens: 0 })
    expect(aggregator.sessionUsage('s1').costUsd).toBeCloseTo(1.0)
  })

  it('keys today by the injected clock', () => {
    expect(dayKey(FIXED_NOW)).toBe('2026-08-16')
    expect(monthKey(FIXED_NOW)).toBe('2026-08')
  })

  it('caps the latency window per model', () => {
    const aggregator = makeAggregator()
    for (let index = 0; index < 250; index++) aggregator.recordLatency('m1', index)
    const models = aggregator.modelUsage()
    expect(models.length).toBe(0) // no usage recorded yet
    aggregator.setAttribution('acme', 'm1')
    aggregator.recordUsage('s1', { inputTokens: 1, outputTokens: 0 })
    const usage = aggregator.modelUsage().find(entry => entry.model === 'm1')
    expect(usage?.latencyMs.length).toBe(200)
  })

  it('tracks and lifts blocked scopes', () => {
    const aggregator = makeAggregator()
    expect(aggregator.blockedScopes).toEqual([])
    aggregator.blockScope('daily')
    expect(aggregator.blockedScopes).toEqual(['daily'])
    aggregator.unblockScope('daily')
    expect(aggregator.blockedScopes).toEqual([])
  })

  it('records alerts newest-first and bounded', () => {
    const aggregator = makeAggregator()
    for (let index = 0; index < 60; index++) {
      aggregator.recordAlert({ scope: 'daily', kind: 'warn', at: FIXED_NOW - index, usedUsd: 1, capUsd: 2 })
    }
    const snapshot = aggregator.snapshotFor('s1')
    expect(snapshot.alerts.length).toBe(50)
    expect(snapshot.alerts[0]?.at).toBe(FIXED_NOW - 59)
    expect(snapshot.alerts[49]?.at).toBe(FIXED_NOW - 10)
  })

  it('returns a zero-filled per-day history, oldest first', () => {
    const aggregator = makeAggregator()
    aggregator.setAttribution('deepseek', 'deepseek-chat')
    aggregator.recordUsage('s1', { inputTokens: 1_000_000, outputTokens: 0 })
    const days = aggregator.dayHistory(3)
    expect(days.map(day => day.day)).toEqual(['2026-08-14', '2026-08-15', '2026-08-16'])
    expect(days[2]?.usage.costUsd).toBeCloseTo(0.27)
    expect(days[0]?.usage.costUsd).toBe(0)
    expect(days[1]?.usage.costUsd).toBe(0)
  })

  it('exposes historyDays entries in the snapshot', () => {
    const aggregator = new BudgetAggregator(resolveConfig({ historyDays: 5 }), () => FIXED_NOW)
    expect(aggregator.snapshotFor('s1').days.length).toBe(5)
  })

  it('round-trips day/month buckets through export/restore (cross-restart accumulation)', () => {
    const source = makeAggregator()
    source.setAttribution('deepseek', 'deepseek-chat')
    source.recordUsage('s1', { inputTokens: 1_000_000, outputTokens: 100_000 })
    const persisted = source.exportState()

    const restored = makeAggregator()
    restored.restoreState(persisted)
    // The restored aggregator reflects the persisted day/month usage.
    expect(restored.todayUsage().inputTokens).toBe(1_000_000)
    expect(restored.monthUsage().outputTokens).toBe(100_000)

    // Accumulating a new record on top keeps the restored totals.
    restored.setAttribution('deepseek', 'deepseek-chat')
    restored.recordUsage('s2', { inputTokens: 500_000, outputTokens: 0 })
    expect(restored.todayUsage().inputTokens).toBe(1_500_000)
  })

  it('restore accumulates over an already-populated bucket instead of replacing it', () => {
    const target = makeAggregator()
    target.setAttribution('deepseek', 'deepseek-chat')
    target.recordUsage('s1', { inputTokens: 1_000_000, outputTokens: 0 })

    const extra = makeAggregator()
    extra.setAttribution('deepseek', 'deepseek-chat')
    extra.recordUsage('s2', { inputTokens: 500_000, outputTokens: 0 })

    target.restoreState(extra.exportState())
    expect(target.todayUsage().inputTokens).toBe(1_500_000)
  })
})
