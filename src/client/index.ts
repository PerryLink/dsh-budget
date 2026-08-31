/**
 * `dsh-budget`, browser half: mounts the `budget` Remote contribution, then
 * registers the budget tab into the Plugins settings section
 * (`settings.plugins.tab`, id `budget`). All data arrives through the
 * `remote.budget` namespace 鈥?the tab issues no other RPC and holds no state
 * of its own beyond the edit form and the last loaded snapshot.
 *
 * @module dsh-budget/client
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the 'settings.plugins.tab' SlotMap declaration into this
// program so the tab registration typechecks against the real declaration.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

// The slots service face is read structurally: the published rc.2 client
// faces type Context.slots, the current checkout does not (the deleted
// dsh-client-runtime face used to carry that merge).
interface BudgetSlotsService {
  inject(slot: 'settings.plugins.tab', factory: () => void): void
  register(entry: object, component: unknown): void
}
import { BudgetTab, type BudgetTabInjected } from './BudgetTab.tsx'
import { en, zh, type BudgetLocaleKey } from './locales.ts'
import { BUDGET_REMOTE } from './remote.ts'
import { installBudgetStyles } from './styles.ts'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { BudgetStatus } from '../wire.ts'

export type { BudgetTabInjected, BudgetTabProps } from './BudgetTab.tsx'
export type { BudgetLocaleKey } from './locales.ts'
export { formatAlertTime, formatMoney, scopePercent, scopeTone } from './present.ts'
export type { BudgetTone } from './present.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Budget settings tab copy. */
    'settings.budget': BudgetLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.budget'

/** Plugin name: matches the package name, the graph row id, and the bundle id. */
export const name = 'dsh-budget'

/** Services the tab reads; `remote.budget` appears once this plugin mounts its contribution. */
export const inject = ['slots', 'locale', 'remote', 'sessions']

/**
 * Browser plugin body: dictionaries, the scoped stylesheet, the Remote
 * contribution mount, and the settings tab registration.
 *
 * @param ctx - client root context.
 */
export async function apply(ctx: ClientContext): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-budget: dictionaries')
  ctx.effect(() => installBudgetStyles(), 'dsh-budget: stylesheet')

  // $mount registers the 'remote.budget' namespace service and owns its
  // removal for this fiber's lifetime.
  await ctx.remote.$mount(BUDGET_REMOTE)

  ctx.inject(['remote.budget'], (scope) => {
    const t = scope.locale.bind(NS)
    const unwrap = <T,>(result: RemoteResult<T>, method: string): T => {
      if (!result.ok) {
        throw new Error(`budget.${method} failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value
    }
    const status: BudgetTabInjected['status'] = async () =>
      unwrap<BudgetStatus>(await scope.remote.budget.status(currentSessionId(scope.get('sessions'))), 'status')
    const setSettings: BudgetTabInjected['setSettings'] = async (settingsJson) =>
      unwrap<BudgetStatus>(await scope.remote.budget.setSettings(settingsJson), 'setSettings')
    const unblock: BudgetTabInjected['unblock'] = async (scopeName) =>
      unwrap<BudgetStatus>(await scope.remote.budget.unblock(scopeName), 'unblock')
    const slots = scope.get('slots') as unknown as BudgetSlotsService
    slots.inject('settings.plugins.tab', () => slots.register({
      name: 'settings.plugins.tab',
      id: 'budget',
      order: 40,
      label: () => t('tab'),
      locale: NS,
      inject: (): BudgetTabInjected => ({ status, setSettings, unblock }),
    }, BudgetTab))
  })
}

/**
 * Read the current session id from the sessions store face (structural:
 * the store shape differs across harness lines, so only the leaf is read).
 */
function currentSessionId(sessions: unknown): string | undefined {
  try {
    const list = (sessions as { list?: unknown } | null)?.list
    if (typeof list !== 'object' || list === null) return undefined
    const getSnapshot = (list as { getSnapshot?: unknown }).getSnapshot
    if (typeof getSnapshot !== 'function') return undefined
    const current = (getSnapshot as () => { current?: unknown })().current
    return typeof current === 'string' ? current : undefined
  } catch {
    return undefined
  }
}
