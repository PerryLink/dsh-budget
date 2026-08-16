/**
 * The client-side Remote face of the `budget` namespace: the hand-written
 * `TypertRemoteContribution` mounted through `ctx.remote.$mount`, plus the
 * declaration merging that types `ctx.remote.budget`. The descriptor list is
 * shared with the host `./typert` manifest (`../wire.ts`), so the two faces
 * can never drift.
 *
 * @module dsh-budget/client/remote
 */

import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import { BUDGET_INVOCATIONS } from '../wire.ts'
import type { BudgetStatus } from '../wire.ts'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$budget {
    /** Read the current budget snapshot (session-attributed). */
    status: (sessionId?: string) => Promise<RemoteResult<BudgetStatus>>
    /** Apply runtime budget caps and alert switches (panel). */
    setSettings: (settingsJson: string) => Promise<RemoteResult<BudgetStatus>>
    /** Lift one blocked scope after user confirmation. */
    unblock: (scope: string) => Promise<RemoteResult<BudgetStatus>>
  }
  interface TypertRemoteMap {
    'budget/status': (sessionId?: string) => Promise<RemoteResult<BudgetStatus>>
    'budget/setSettings': (settingsJson: string) => Promise<RemoteResult<BudgetStatus>>
    'budget/unblock': (scope: string) => Promise<RemoteResult<BudgetStatus>>
  }
  interface TypertRemoteNamespaceMap {
    budget: TypertRemoteNamespace$budget
  }
}

/** The client Remote contribution for the `budget` namespace. */
export const BUDGET_REMOTE = Object.freeze({
  package: 'dsh-budget',
  descriptors: BUDGET_INVOCATIONS,
} satisfies TypertRemoteContribution)
