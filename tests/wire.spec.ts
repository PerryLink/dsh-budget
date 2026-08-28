/**
 * Wire contract: the `budget/status` schema round-trips a full snapshot and
 * rejects malformed values for the fields the panel reads (per-day curve,
 * warn ratio, refresh interval). The strict schema is the single codec both
 * Typert faces carry, so a drift here breaks the client channel.
 *
 * @module dsh-budget/test/wire.spec
 */

import { describe, expect, it } from 'vitest'
import {
  BUDGET_SET_SETTINGS_DESCRIPTOR,
  BUDGET_STATUS_DESCRIPTOR,
  BUDGET_STATUS_SCHEMA,
  BUDGET_UNBLOCK_DESCRIPTOR,
  type BudgetStatus,
} from '../src/wire.ts'

function fullStatus(): BudgetStatus {
  return {
    scopes: [{ scope: 'session', capUsd: 10, usedUsd: 3, ratio: 0.3, tokens: 100, carbonKg: 0.001 }],
    models: [{ provider: 'deepseek', model: 'deepseek-chat', inputTokens: 100, outputTokens: 50, costUsd: 0.05, carbonKg: 0.0001, latency: { min: 10, p50: 20, p95: 30, max: 40, samples: 3 } }],
    alerts: [{ scope: 'daily', kind: 'warn', at: 1_700_000_000_000, usedUsd: 1, capUsd: 2 }],
    blockedScopes: [],
    currency: { code: 'USD', rate: 1.0, decimals: 2 },
    alertsEnabled: true,
    desktopNotifications: false,
    degradedModel: null,
    days: [
      { day: '2026-08-14', costUsd: 0, tokens: 0, carbonKg: 0 },
      { day: '2026-08-15', costUsd: 0.27, tokens: 1_000_000, carbonKg: 0.005 },
    ],
    warnRatio: 0.8,
    refreshIntervalMs: 5_000,
  }
}

describe('BUDGET_STATUS_SCHEMA', () => {
  it('round-trips a full snapshot including the per-day curve and panel fields', () => {
    const parsed = BUDGET_STATUS_SCHEMA.parse(fullStatus())
    expect(parsed.days).toHaveLength(2)
    expect(parsed.days[1]?.costUsd).toBeCloseTo(0.27)
    expect(parsed.warnRatio).toBe(0.8)
    expect(parsed.refreshIntervalMs).toBe(5_000)
  })

  it('rejects an out-of-range warn ratio', () => {
    expect(() => BUDGET_STATUS_SCHEMA.parse({ ...fullStatus(), warnRatio: 1.5 })).toThrow()
  })

  it('rejects a sub-minimum refresh interval', () => {
    expect(() => BUDGET_STATUS_SCHEMA.parse({ ...fullStatus(), refreshIntervalMs: 0 })).toThrow()
  })

  it('rejects a non-integer token count in the per-day curve', () => {
    expect(() => BUDGET_STATUS_SCHEMA.parse({ ...fullStatus(), days: [{ day: '2026-08-14', costUsd: 0, tokens: 1.5, carbonKg: 0 }] })).toThrow()
  })
})

describe('budget invocation descriptors', () => {
  it('declares the optional sessionId parameter on budget/status', () => {
    expect(BUDGET_STATUS_DESCRIPTOR.parameters).toHaveLength(1)
    const parameter = BUDGET_STATUS_DESCRIPTOR.parameters[0]
    expect(parameter).toBeDefined()
    if (parameter === undefined) return
    expect(parameter.name).toBe('sessionId')
    expect(parameter.wire).toBe('sessionId')
    expect(parameter.acceptsUndefined).toBe(true)
    // A missing/undefined session id and a real id both decode; a non-string is rejected.
    expect(() => parameter.codec.schema.parse(undefined)).not.toThrow()
    expect(parameter.codec.schema.parse('s1')).toBe('s1')
    expect(() => parameter.codec.schema.parse(7)).toThrow()
  })

  it('keeps budget/setSettings and budget/unblock single-parameter and required', () => {
    expect(BUDGET_SET_SETTINGS_DESCRIPTOR.parameters).toHaveLength(1)
    expect(BUDGET_SET_SETTINGS_DESCRIPTOR.parameters[0]?.name).toBe('settingsJson')
    expect(() => BUDGET_SET_SETTINGS_DESCRIPTOR.parameters[0]?.codec.schema.parse(undefined)).toThrow()
    expect(BUDGET_UNBLOCK_DESCRIPTOR.parameters).toHaveLength(1)
    expect(BUDGET_UNBLOCK_DESCRIPTOR.parameters[0]?.name).toBe('scope')
    expect(() => BUDGET_UNBLOCK_DESCRIPTOR.parameters[0]?.codec.schema.parse(undefined)).toThrow()
  })
})
