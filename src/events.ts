/**
 * Session audit events for `dsh-budget` (declaration merging into the
 * harness `SessionEventMap`). Both events are log-only: the panel/command
 * surfaces are the model-visible projections; on legacy harnesses these
 * events keep the alert/block trail reconstructable from the session log
 * (see auditAppendsAllowed for the fail-closed gate). Amounts are plain
 * numbers, webhook URLs are sanitized before they ever reach a payload.
 *
 * @module dsh-budget/events
 */

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /**
     * A threshold alert fired (warn ratio reached or a cap crossed). Log-only
     * audit — the panel/command render the same facts for the user.
     */
    'budget/alert': {
      scope: 'session' | 'daily' | 'monthly'
      kind: 'warn' | 'over'
      usedUsd: number
      capUsd: number
    }
    /**
     * A budget cap crossed and the over-limit policy blocked the scope (or
     * a user lifted a block). `blocked` records the current state after the
     * transition.
     */
    'budget/block': {
      scope: 'session' | 'daily' | 'monthly'
      blocked: boolean
      degradation?: { from: string; to: string }
    }
  }
}

/** The alert audit event type. */
export const ALERT_EVENT = 'budget/alert' as const

/** The block audit event type. */
export const BLOCK_EVENT = 'budget/block' as const

/**
 * Decide whether `budget/alert` and `budget/block` appends are safe on this
 * host line. From 0.1.2-alpha.1 the session read path refuses logs
 * containing event types outside the harness-known vocabulary and exposes no
 * external registration surface, so appends would poison the log.
 * 0.1.2-alpha.3 retains the `ignorable?: true` envelope field, but only for
 * stored-log read compatibility: its `Session.append` third argument is a
 * `SurfaceIntent` for surface events and still cannot stamp the marker, so
 * the same suppression applies there. Earlier lines accept any event type
 * and keep the legacy write behavior; an undefined or unparseable version
 * is treated as legacy.
 *
 * @param sessionVersion - the installed @deepseek-ai/dsh-session version
 * (the session package ships with the harness and carries its line version).
 * @returns true when audit appends are safe on the host.
 */
export function auditAppendsAllowed(sessionVersion: string | undefined): boolean {
  if (sessionVersion === undefined) return true
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(sessionVersion)
  if (match === null) return true
  const major = Number(match[1])
  const minor = Number(match[2])
  const patch = Number(match[3])
  return major * 1_000_000 + minor * 1_000 + patch < 1_002
}

/** Alert payload type. */
export type BudgetAlertEvent = {
  scope: 'session' | 'daily' | 'monthly'
  kind: 'warn' | 'over'
  usedUsd: number
  capUsd: number
}

/** Block payload type. */
export type BudgetBlockEvent = {
  scope: 'session' | 'daily' | 'monthly'
  blocked: boolean
  degradation?: { from: string; to: string }
}
