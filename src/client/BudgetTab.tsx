/** The budget settings tab: usage bars, model breakdown, alerts, cap editors, and unblock actions. */

import { useEffect, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { formatAlertTime, formatMoney, scopePercent, scopeTone } from './present.ts'
import type { BudgetStatus } from '../wire.ts'

/** Registration-side injected face: the budget RPCs (RemoteResult already unwrapped). */
export interface BudgetTabInjected {
  /** Read the current Host snapshot. */
  status: () => Promise<BudgetStatus>
  /** Apply runtime budget caps and alert switches. */
  setSettings: (settingsJson: string) => Promise<BudgetStatus>
  /** Lift one blocked scope after user confirmation. */
  unblock: (scope: string) => Promise<BudgetStatus>
}

/** Full component props assembled by the Settings slot renderer. */
export type BudgetTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'settings.budget'>
  & InjectFace<BudgetTabInjected>

type ViewState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly message: string }
  | { readonly status: 'ready'; readonly snapshot: BudgetStatus }

/** The budget tab body. */
export function BudgetTab({ status, setSettings, unblock, t }: BudgetTabProps): ReactNode {
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [sessionCap, setSessionCap] = useState('')
  const [dailyCap, setDailyCap] = useState('')
  const [monthlyCap, setMonthlyCap] = useState('')
  const [alertsOn, setAlertsOn] = useState(true)
  const [desktopOn, setDesktopOn] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [refreshMs, setRefreshMs] = useState(5_000)

  const load = async (): Promise<void> => {
    try {
      const snapshot = await status()
      setState({ status: 'ready', snapshot })
      setSessionCap(snapshot.scopes.find(scope => scope.scope === 'session')?.capUsd?.toString() ?? '')
      setDailyCap(snapshot.scopes.find(scope => scope.scope === 'daily')?.capUsd?.toString() ?? '')
      setMonthlyCap(snapshot.scopes.find(scope => scope.scope === 'monthly')?.capUsd?.toString() ?? '')
      setAlertsOn(snapshot.alertsEnabled)
      setDesktopOn(snapshot.desktopNotifications)
      setRefreshMs(snapshot.refreshIntervalMs)
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    }
  }

  // Initial load, then poll at the host's configured refresh interval. The
  // interval arrives with the first snapshot, so the timer reschedules once
  // without an extra status round-trip.
  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    if (refreshMs <= 0) return
    const timer = setInterval(() => { void load() }, refreshMs)
    return () => { clearInterval(timer) }
  }, [refreshMs])

  const parseCap = (text: string): number | null => {
    if (text.trim() === '') return null
    const value = Number(text)
    return Number.isFinite(value) && value >= 0 ? value : null
  }

  const onSave = async (): Promise<void> => {
    setBusy(true)
    setSaved(null)
    try {
      const snapshot = await setSettings(JSON.stringify({
        sessionCapUsd: parseCap(sessionCap),
        dailyCapUsd: parseCap(dailyCap),
        monthlyCapUsd: parseCap(monthlyCap),
        alertsEnabled: alertsOn,
        desktopNotifications: desktopOn,
      }))
      setState({ status: 'ready', snapshot })
      setSaved(t('saved'))
    } catch (error) {
      setSaved(error instanceof Error ? error.message : String(error))
    } finally {
      setBusy(false)
    }
  }

  const onUnblock = async (scope: string): Promise<void> => {
    setBusy(true)
    try {
      const snapshot = await unblock(scope)
      setState({ status: 'ready', snapshot })
    } catch (error) {
      setSaved(error instanceof Error ? error.message : String(error))
    } finally {
      setBusy(false)
    }
  }

  if (state.status === 'loading') return <p className="dbud-status">{t('loading')}</p>
  if (state.status === 'error') {
    return (
      <div className="dbud-failure" data-dsh-budget>
        <p className="dbud-failure-detail">{t('error')} {state.message}</p>
        <button type="button" onClick={() => { setState({ status: 'loading' }); void load() }}>{t('retry')}</button>
      </div>
    )
  }

  const snapshot = state.snapshot
  const maxDayCost = Math.max(0, ...snapshot.days.map(day => day.costUsd))
  return (
    <div className="dbud-section" data-dsh-budget>
      <div className="dbud-rows">
        <h3 className="dbud-heading">{t('scopes')}</h3>
        {snapshot.scopes.map(scope => {
          const blocked = snapshot.blockedScopes.includes(scope.scope)
          const tone = scopeTone(scope, snapshot.warnRatio, blocked)
          return (
            <div className="dbud-row" key={scope.scope}>
              <div className="dbud-row-head">
                <span className="dbud-row-title">{t(scope.scope as 'session')}</span>
                {blocked
                  ? (
                    <span>
                      <span className="dbud-badge">{t('blocked')}</span>
                      {' '}
                      <button type="button" className="dbud-action" disabled={busy} onClick={() => void onUnblock(scope.scope)}>{t('unblock')}</button>
                    </span>
                  )
                  : null}
              </div>
              <span className="dbud-row-meta">
                {`${formatMoney(snapshot, scope.usedUsd)} / ${scope.capUsd === null ? t('unlimited') : formatMoney(snapshot, scope.capUsd)}`
                + ` · ${scope.tokens} ${t('tokens')} · ${scope.carbonKg.toFixed(4)} kg CO2e`}
              </span>
              <div className="dbud-bar">
                <div className="dbud-bar-fill" data-tone={tone} style={{ width: `${scopePercent(scope)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="dbud-rows">
        <h3 className="dbud-heading">{t('usageCurve')}</h3>
        {snapshot.days.length === 0
          ? <p className="dbud-status">—</p>
          : (
            <div className="dbud-curve">
              {snapshot.days.map(day => {
                const height = maxDayCost === 0 ? 0 : Math.round((day.costUsd / maxDayCost) * 100)
                return (
                  <div
                    className="dbud-curve-col"
                    key={day.day}
                    title={`${day.day}: ${formatMoney(snapshot, day.costUsd)}`}
                  >
                    <div className="dbud-curve-bar" style={{ height: `${height}%` }} data-empty={day.costUsd === 0 ? '' : undefined} />
                    <span className="dbud-curve-label">{day.day.slice(5)}</span>
                  </div>
                )
              })}
            </div>
          )
          }
      </div>

      {snapshot.degradedModel !== null
        ? <p className="dbud-notice">{t('degraded')}: {snapshot.degradedModel}</p>
        : null}

      <div className="dbud-rows">
        <h3 className="dbud-heading">{t('models')}</h3>
        {snapshot.models.length === 0
          ? <p className="dbud-status">—</p>
          : (
            <ul className="dbud-models">
              {snapshot.models.map(model => (
                <li key={model.model}>
                  <span className="dbud-model-name">{model.provider}/{model.model}</span>
                  <span className="dbud-model-meta">
                    {`${formatMoney(snapshot, model.costUsd)} · ${model.inputTokens} in / ${model.outputTokens} out · ${t('latency')} ${model.latency.p50 === null ? '-' : `${model.latency.p50}ms`}`}
                  </span>
                </li>
              ))}
            </ul>
          )
          }
      </div>

      <div className="dbud-rows">
        <h3 className="dbud-heading">{t('history')}</h3>
        {snapshot.alerts.length === 0
          ? <p className="dbud-status">{t('noAlerts')}</p>
          : (
            <ul className="dbud-alerts">
              {snapshot.alerts.map((alert, index) => (
                <li className="dbud-alert" data-kind={alert.kind} key={index}>
                  <span>{formatAlertTime(alert.at)}</span>
                  <span>{alert.kind === 'warn' ? t('warnAlert') : t('overAlert')}</span>
                  <span>{`${alert.scope}: ${formatMoney(snapshot, alert.usedUsd)} / ${formatMoney(snapshot, alert.capUsd)}`}</span>
                </li>
              ))}
            </ul>
          )
          }
      </div>

      <div className="dbud-form">
        <h3 className="dbud-heading">{t('caps')}</h3>
        <div className="dbud-field">
          <label>{t('sessionCap')}</label>
          <input type="number" min="0" step="1" value={sessionCap} onChange={event => { setSessionCap(event.target.value) }} />
        </div>
        <div className="dbud-field">
          <label>{t('dailyCap')}</label>
          <input type="number" min="0" step="1" value={dailyCap} onChange={event => { setDailyCap(event.target.value) }} />
        </div>
        <div className="dbud-field">
          <label>{t('monthlyCap')}</label>
          <input type="number" min="0" step="1" value={monthlyCap} onChange={event => { setMonthlyCap(event.target.value) }} />
        </div>
        <label className="dbud-check">
          <input type="checkbox" checked={alertsOn} onChange={event => { setAlertsOn(event.target.checked) }} />
          {t('alertsEnabled')}
        </label>
        <label className="dbud-check">
          <input type="checkbox" checked={desktopOn} onChange={event => { setDesktopOn(event.target.checked) }} />
          {t('desktopNotifications')}
        </label>
        <p className="dbud-notice">{t('capUnlimited')}</p>
        <button type="button" className="dbud-action" disabled={busy} onClick={() => void onSave()}>{t('save')}</button>
        {saved !== null ? <p className="dbud-notice">{saved}</p> : null}
      </div>
    </div>
  )
}
