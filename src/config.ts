/**
 * Config schema and resolution for `dsh-budget`. Every tunable is a validated
 * {@link Config} field changeable from cordis.yml; `resolveConfig` re-judges
 * every default and bound so programmatic construction that bypasses
 * Schemastery normalization still fails loud (the explicit-resolve contract).
 *
 * @module dsh-budget/config
 */

import z from '@deepseek-ai/schemastery'

/** Display currency: code, units per USD, and decimal places. */
export interface CurrencyConfig {
  code?: string
  rate?: number
  decimals?: number
}

/** Carbon footprint estimation. */
export interface CarbonConfig {
  enabled?: boolean
  region?: 'global' | 'us' | 'eu' | 'china' | 'india' | 'uk' | 'france' | 'iceland'
  pue?: number
  energyKwhPerToken?: number
}

/** Per-model latency statistics. */
export interface LatencyConfig {
  enabled?: boolean
  windowSize?: number
}

/** Budget caps per scope; undefined = unlimited. */
export interface BudgetsConfig {
  session?: number
  daily?: number
  monthly?: number
}

/** Durable persistence of the daily/monthly buckets across restarts. */
export interface PersistenceConfig {
  /** Persist day/month usage to the storage domain (default true). */
  enabled?: boolean
  /** Milliseconds between persistence snapshots (default 10000). */
  intervalMs?: number
}

/** Raw plugin config — every field optional; {@link resolveConfig} supplies the defaults. */
export interface Config {
  /** Per-model USD prices per 1M tokens, merged over the built-in table. */
  prices?: Record<string, { input: number; output: number; cacheRead?: number; cacheWrite?: number }>
  /** Fallback price for models absent from both tables. */
  defaultPrice?: { input: number; output: number; cacheRead?: number; cacheWrite?: number }
  /** Budget caps in USD per scope; omit a scope for unlimited. */
  budgets?: BudgetsConfig
  /** Alert once usage reaches this fraction of a cap (0..1). */
  warnRatio?: number
  /** Behavior after a cap is crossed: alert | block | degrade. */
  overLimit?: 'alert' | 'block' | 'degrade'
  /** Degradation map: model id -> cheaper model id of the SAME provider. */
  degradation?: Record<string, string>
  /** Optional webhook URL for threshold alerts (POST JSON). */
  webhookUrl?: string
  /** Webhook request timeout in milliseconds. */
  webhookTimeoutMs?: number
  /** Master switch for threshold alerts. */
  alertsEnabled?: boolean
  /** Minimum milliseconds between two alerts of the same scope. */
  alertCooldownMs?: number
  /** Browser desktop notifications for new alerts. */
  desktopNotifications?: boolean
  /** Settings budget tab polling interval in milliseconds. */
  refreshIntervalMs?: number
  /** Carbon footprint estimation. */
  carbon?: CarbonConfig
  /** Per-model latency statistics. */
  latency?: LatencyConfig
  /** Display currency. */
  currency?: CurrencyConfig
  /** /budget command output language: en | zh. */
  outputLanguage?: 'en' | 'zh'
  /** Days of per-day usage history kept in the panel snapshot. */
  historyDays?: number
  /** Durable daily/monthly persistence across restarts. */
  persistence?: PersistenceConfig
}

/** Fully resolved config. */
export interface ResolvedConfig {
  readonly prices: Record<string, { input: number; output: number; cacheRead?: number; cacheWrite?: number }>
  readonly defaultPrice: { input: number; output: number; cacheRead?: number; cacheWrite?: number }
  readonly budgets: BudgetsConfig
  readonly warnRatio: number
  readonly overLimit: 'alert' | 'block' | 'degrade'
  readonly degradation: Record<string, string>
  readonly webhookUrl: string | undefined
  readonly webhookTimeoutMs: number
  readonly alertsEnabled: boolean
  readonly alertCooldownMs: number
  readonly desktopNotifications: boolean
  readonly refreshIntervalMs: number
  readonly carbon: { enabled: boolean; region: string; pue: number; energyKwhPerToken: number }
  readonly latency: { enabled: boolean; windowSize: number }
  readonly currency: { code: string; rate: number; decimals: number }
  readonly outputLanguage: 'en' | 'zh'
  readonly historyDays: number
  readonly persistence: { enabled: boolean; intervalMs: number }
}

/** Known electricity region keys (upstream carbon table). */
const REGIONS = ['global', 'us', 'eu', 'china', 'india', 'uk', 'france', 'iceland'] as const

/** Schemastery schema: the loader validates and fills defaults before `apply`. */
export const Config: z<Config> = z.object({
  prices: z.dict(z.object({
    input: z.number().min(0).required(),
    output: z.number().min(0).required(),
    cacheRead: z.number().min(0),
    cacheWrite: z.number().min(0),
  })).default({}),
  defaultPrice: z.object({
    input: z.number().min(0).default(1.0),
    output: z.number().min(0).default(3.0),
    cacheRead: z.number().min(0).default(1.0),
    cacheWrite: z.number().min(0).default(1.0),
  }).default({ input: 1.0, output: 3.0, cacheRead: 1.0, cacheWrite: 1.0 }),
  budgets: z.object({
    session: z.number().min(0),
    daily: z.number().min(0),
    monthly: z.number().min(0),
  }).default({ session: 10, daily: 50, monthly: 500 }),
  warnRatio: z.number().min(0).max(1).default(0.8),
  overLimit: z.union(['alert', 'block', 'degrade']).default('alert'),
  degradation: z.dict(z.string()).default({}),
  webhookUrl: z.string().default(''),
  webhookTimeoutMs: z.number().min(100).max(120_000).default(5_000),
  alertsEnabled: z.boolean().default(true),
  alertCooldownMs: z.number().min(0).default(3_600_000),
  desktopNotifications: z.boolean().default(false),
  refreshIntervalMs: z.number().min(1_000).max(300_000).default(5_000),
  carbon: z.object({
    enabled: z.boolean().default(true),
    region: z.union([...REGIONS]).default('global'),
    pue: z.number().min(1).max(3).default(1.58),
    energyKwhPerToken: z.number().min(0).default(0.000007),
  }).default({ enabled: true, region: 'global', pue: 1.58, energyKwhPerToken: 0.000007 }),
  latency: z.object({
    enabled: z.boolean().default(true),
    windowSize: z.number().min(1).max(10_000).default(200),
  }).default({ enabled: true, windowSize: 200 }),
  currency: z.object({
    code: z.string().default('USD'),
    rate: z.number().min(0.000001).default(1.0),
    decimals: z.number().min(0).max(6).default(2),
  }).default({ code: 'USD', rate: 1.0, decimals: 2 }),
  outputLanguage: z.union(['en', 'zh']).default('en'),
  historyDays: z.number().min(1).max(365).default(30),
  persistence: z.object({
    enabled: z.boolean().default(true),
    intervalMs: z.number().min(1_000).max(300_000).default(10_000),
  }).default({ enabled: true, intervalMs: 10_000 }),
})

/** Throw the standard fail-loud config error for one invalid field. */
function invalid(field: string, detail: string): never {
  throw new Error(`dsh-budget: config.${field} ${detail}`)
}

/**
 * Resolve raw config to the runtime policy, re-validating defaults and bounds.
 *
 * @param config - raw loader config; `undefined` for a bare row.
 * @returns the frozen resolved config.
 */
export function resolveConfig(config: Config | undefined): ResolvedConfig {
  const prices = { ...(config?.prices ?? {}) }
  for (const [model, entry] of Object.entries(prices)) {
    if (!Number.isFinite(entry.input) || entry.input < 0) invalid(`prices.${model}.input`, 'must be a non-negative number')
    if (!Number.isFinite(entry.output) || entry.output < 0) invalid(`prices.${model}.output`, 'must be a non-negative number')
  }
  const defaultPrice = config?.defaultPrice ?? { input: 1.0, output: 3.0 }
  if (!Number.isFinite(defaultPrice.input) || defaultPrice.input < 0) invalid('defaultPrice.input', 'must be a non-negative number')
  if (!Number.isFinite(defaultPrice.output) || defaultPrice.output < 0) invalid('defaultPrice.output', 'must be a non-negative number')

  const budgets = { ...(config?.budgets ?? { session: 10, daily: 50, monthly: 500 }) }
  for (const [scope, cap] of Object.entries(budgets)) {
    if (cap !== undefined && (!Number.isFinite(cap) || cap < 0)) invalid(`budgets.${scope}`, 'must be a non-negative number')
  }

  const warnRatio = config?.warnRatio ?? 0.8
  if (!Number.isFinite(warnRatio) || warnRatio < 0 || warnRatio > 1) invalid('warnRatio', 'must be a number in [0, 1]')

  const overLimit = config?.overLimit ?? 'alert'
  if (overLimit !== 'alert' && overLimit !== 'block' && overLimit !== 'degrade') invalid('overLimit', 'must be alert, block, or degrade')

  const degradation = { ...(config?.degradation ?? {}) }

  const rawWebhook = config?.webhookUrl ?? ''
  let webhookUrl: string | undefined
  if (rawWebhook.trim() !== '') {
    try {
      const parsed = new URL(rawWebhook.trim())
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('scheme')
      webhookUrl = parsed.href
    } catch {
      invalid('webhookUrl', 'must be a valid http(s) URL')
    }
  }

  const webhookTimeoutMs = config?.webhookTimeoutMs ?? 5_000
  if (!Number.isFinite(webhookTimeoutMs) || webhookTimeoutMs < 100 || webhookTimeoutMs > 120_000) {
    invalid('webhookTimeoutMs', 'must be a finite number in [100, 120000]')
  }

  const alertsEnabled = config?.alertsEnabled ?? true
  if (typeof alertsEnabled !== 'boolean') invalid('alertsEnabled', 'must be a boolean')

  const alertCooldownMs = config?.alertCooldownMs ?? 3_600_000
  if (!Number.isFinite(alertCooldownMs) || alertCooldownMs < 0) invalid('alertCooldownMs', 'must be a non-negative number')

  const desktopNotifications = config?.desktopNotifications ?? false
  const refreshIntervalMs = config?.refreshIntervalMs ?? 5_000
  if (!Number.isFinite(refreshIntervalMs) || refreshIntervalMs < 1_000 || refreshIntervalMs > 300_000) {
    invalid('refreshIntervalMs', 'must be a finite number in [1000, 300000]')
  }

  const carbonEnabled = config?.carbon?.enabled ?? true
  const carbonRegion = config?.carbon?.region ?? 'global'
  if (!(REGIONS as readonly string[]).includes(carbonRegion)) invalid('carbon.region', `must be one of ${REGIONS.join(', ')}`)
  const carbonPue = config?.carbon?.pue ?? 1.58
  if (!Number.isFinite(carbonPue) || carbonPue < 1 || carbonPue > 3) invalid('carbon.pue', 'must be a finite number in [1, 3]')
  const energyKwhPerToken = config?.carbon?.energyKwhPerToken ?? 0.000007
  if (!Number.isFinite(energyKwhPerToken) || energyKwhPerToken < 0) invalid('carbon.energyKwhPerToken', 'must be a non-negative number')

  const latencyEnabled = config?.latency?.enabled ?? true
  const windowSize = config?.latency?.windowSize ?? 200
  if (!Number.isInteger(windowSize) || windowSize < 1 || windowSize > 10_000) invalid('latency.windowSize', 'must be an integer in [1, 10000]')

  const currencyCode = (config?.currency?.code ?? 'USD').toUpperCase()
  if (!/^[A-Z]{3}$/u.test(currencyCode)) invalid('currency.code', 'must be a 3-letter code')
  const currencyRate = config?.currency?.rate ?? 1.0
  if (!Number.isFinite(currencyRate) || currencyRate <= 0) invalid('currency.rate', 'must be a positive number')
  const currencyDecimals = config?.currency?.decimals ?? 2
  if (!Number.isInteger(currencyDecimals) || currencyDecimals < 0 || currencyDecimals > 6) invalid('currency.decimals', 'must be an integer in [0, 6]')

  const outputLanguage = config?.outputLanguage ?? 'en'
  if (outputLanguage !== 'en' && outputLanguage !== 'zh') invalid('outputLanguage', 'must be en or zh')

  const historyDays = config?.historyDays ?? 30
  if (!Number.isInteger(historyDays) || historyDays < 1 || historyDays > 365) invalid('historyDays', 'must be an integer in [1, 365]')

  const persistenceEnabled = config?.persistence?.enabled ?? true
  if (typeof persistenceEnabled !== 'boolean') invalid('persistence.enabled', 'must be a boolean')
  const persistenceIntervalMs = config?.persistence?.intervalMs ?? 10_000
  if (!Number.isInteger(persistenceIntervalMs) || persistenceIntervalMs < 1_000 || persistenceIntervalMs > 300_000) {
    invalid('persistence.intervalMs', 'must be an integer in [1000, 300000]')
  }

  return Object.freeze({
    prices: Object.freeze(prices),
    defaultPrice: Object.freeze(defaultPrice),
    budgets: Object.freeze(budgets),
    warnRatio,
    overLimit,
    degradation: Object.freeze(degradation),
    webhookUrl,
    webhookTimeoutMs,
    alertsEnabled,
    alertCooldownMs,
    desktopNotifications,
    refreshIntervalMs,
    carbon: Object.freeze({ enabled: carbonEnabled, region: carbonRegion, pue: carbonPue, energyKwhPerToken }),
    latency: Object.freeze({ enabled: latencyEnabled, windowSize }),
    currency: Object.freeze({ code: currencyCode, rate: currencyRate, decimals: currencyDecimals }),
    outputLanguage,
    historyDays,
    persistence: Object.freeze({ enabled: persistenceEnabled, intervalMs: persistenceIntervalMs }),
  })
}
