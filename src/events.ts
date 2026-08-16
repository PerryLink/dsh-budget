/**
 * Session audit events for `dsh-budget` (declaration merging into the
 * harness `SessionEventMap`). Both events are log-only: the panel/command
 * surfaces are the model-visible projections, and these events keep the
 * alert/block trail reconstructable from the session log. Amounts are plain
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
