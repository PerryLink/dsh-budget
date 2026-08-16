/**
 * Pure presentation helpers for the budget tab: money formatting and one
 * scope row's tone. Pure functions of the wire payload — replay-safe and
 * unit-testable without a browser.
 *
 * @module dsh-budget/client/present
 */

import type { BudgetStatus, ScopeLine } from '../wire.ts'

/** One scope row's bar tone. */
export type BudgetTone = 'ok' | 'warn' | 'over'

/** Format one USD amount through the snapshot's display currency. */
export function formatMoney(status: BudgetStatus, usd: number): string {
  const converted = usd * status.currency.rate
  return `${converted.toFixed(status.currency.decimals)} ${status.currency.code}`
}

/** The tone for one scope line. */
export function scopeTone(line: ScopeLine, warnRatio: number, blocked: boolean): BudgetTone {
  if (blocked || (line.capUsd !== null && line.capUsd > 0 && line.ratio >= 1)) return 'over'
  if (line.capUsd !== null && line.capUsd > 0 && line.ratio >= warnRatio) return 'warn'
  return 'ok'
}

/** The bar width (percent, 0..100) for one scope line. */
export function scopePercent(line: ScopeLine): number {
  if (line.capUsd === null || line.capUsd <= 0) return 0
  return Math.min(100, Math.round(line.ratio * 100))
}

/** Local wall-clock time for one alert timestamp. */
export function formatAlertTime(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, { hour12: false })
}
