/**
 * Presenter pure-function suite: the Settings tab's money formatting and
 * scope-tone/bar-width math are pure functions of the wire payload (no I/O,
 * no clock, no randomness), so they replay deterministically.
 * @module dsh-budget/tests/present.spec
 */

import { describe, expect, it } from 'vitest'
import { formatMoney, scopePercent, scopeTone } from '../src/client/present.ts'
import type { BudgetStatus, ScopeLine } from '../src/wire.ts'

function status(over: Partial<BudgetStatus['currency']> = {}): BudgetStatus {
  return {
    scopes: [],
    models: [],
    alerts: [],
    blockedScopes: [],
    currency: { code: 'USD', rate: 1.0, decimals: 2, ...over },
    alertsEnabled: true,
    desktopNotifications: false,
    degradedModel: null,
    days: [],
    warnRatio: 0.8,
    refreshIntervalMs: 5_000,
  }
}

function line(over: Partial<ScopeLine> = {}): ScopeLine {
  return { scope: 'session', capUsd: 10, usedUsd: 3, ratio: 0.3, tokens: 0, carbonKg: 0, ...over }
}

describe('budget tab presenter', () => {
  it('formats money through the snapshot currency', () => {
    expect(formatMoney(status(), 3.456)).toBe('3.46 USD')
    expect(formatMoney(status({ code: 'EUR', rate: 2, decimals: 1 }), 1.25)).toBe('2.5 EUR')
  })

  it('resolves the scope tone across ok/warn/over and blocked', () => {
    expect(scopeTone(line({ ratio: 0.3 }), 0.8, false)).toBe('ok')
    expect(scopeTone(line({ ratio: 0.8 }), 0.8, false)).toBe('warn')
    expect(scopeTone(line({ ratio: 1.0 }), 0.8, false)).toBe('over')
    expect(scopeTone(line({ ratio: 0.3 }), 0.8, true)).toBe('over')
  })

  it('bounds the bar width to 0..100 and zeroes unlimited scopes', () => {
    expect(scopePercent(line({ ratio: 0.3 }))).toBe(30)
    expect(scopePercent(line({ ratio: 1.5 }))).toBe(100)
    expect(scopePercent(line({ capUsd: null }))).toBe(0)
  })
})
