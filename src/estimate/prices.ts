/**
 * The plugin's operational price table: USD per 1M tokens, merged with
 * `config.prices` at load. Entries marked `source: 'vendor'` were authored
 * from vendor pricing pages at porting time; entries marked
 * `source: 'upstream-cny'` were converted from the ported
 * LLM-Cost-Estimator-CN table (CNY per 1k tokens) with the fixed rate
 * {@link UPSTREAM_CNY_PER_USD} captured at porting time. Prices drift — treat
 * this table as a starting point and override entries via `config.prices`.
 *
 * @module dsh-budget/estimate/prices
 */

/** Where a built-in entry's numbers came from. */
export type PriceSource = 'vendor' | 'upstream-cny'

/** USD price per 1M tokens. Cache fields follow the harness TokenUsage split. */
export interface PriceEntry {
  /** Uncached input tokens. */
  input: number
  /** Output tokens. */
  output: number
  /** Cached (hit) input tokens; defaults to `input` when absent. */
  cacheRead?: number
  /** Cache-miss (written) input tokens; defaults to `input` when absent. */
  cacheWrite?: number
  /** Provenance metadata for built-in entries. */
  source?: PriceSource
}

/**
 * Fixed CNY→USD rate used when converting the upstream CNY-per-1k table into
 * USD-per-1M entries, captured at porting time. It is a conversion constant
 * of the shipped DATA, not a runtime exchange rate; override any converted
 * entry via `config.prices` when vendor USD pricing is available.
 */
export const UPSTREAM_CNY_PER_USD = 7.2

/**
 * Convert an upstream CNY-per-1k price into USD per 1M tokens.
 *
 * @param cnyPer1k - price in CNY per 1000 tokens.
 * @returns the price in USD per 1,000,000 tokens.
 */
export function cnyPer1kToUsdPer1m(cnyPer1k: number): number {
  return (cnyPer1k * 1000) / UPSTREAM_CNY_PER_USD
}

/** The built-in price table (USD per 1M tokens). */
export const BUILTIN_PRICES: Readonly<Record<string, PriceEntry>> = Object.freeze({
  // Vendor-authored USD pricing (captured at porting time).
  'deepseek-chat': { input: 0.27, cacheRead: 0.027, cacheWrite: 0.27, output: 1.1, source: 'vendor' },
  'deepseek-reasoner': { input: 0.55, cacheRead: 0.055, cacheWrite: 0.55, output: 2.19, source: 'vendor' },
  'gpt-4o': { input: 2.5, cacheRead: 1.25, output: 10.0, source: 'vendor' },
  'gpt-4o-mini': { input: 0.15, cacheRead: 0.075, output: 0.6, source: 'vendor' },
  'gpt-4.1': { input: 2.0, cacheRead: 0.5, output: 8.0, source: 'vendor' },
  'gpt-4.1-mini': { input: 0.4, cacheRead: 0.1, output: 1.6, source: 'vendor' },
  'claude-sonnet-4-5': { input: 3.0, output: 15.0, source: 'vendor' },
  'claude-haiku-4-5': { input: 1.0, output: 5.0, source: 'vendor' },
  'gemini-2.5-pro': { input: 1.25, output: 10.0, source: 'vendor' },
  'gemini-2.5-flash': { input: 0.3, output: 2.5, source: 'vendor' },
  // Converted from the ported upstream CNY-per-1k table (see models.ts).
  'ernie-4.0': { input: cnyPer1kToUsdPer1m(0.12), output: cnyPer1kToUsdPer1m(0.12), source: 'upstream-cny' },
  'qwen-turbo': { input: cnyPer1kToUsdPer1m(0.008), output: cnyPer1kToUsdPer1m(0.008), source: 'upstream-cny' },
  'qwen-plus': { input: cnyPer1kToUsdPer1m(0.04), output: cnyPer1kToUsdPer1m(0.04), source: 'upstream-cny' },
  'glm-4': { input: cnyPer1kToUsdPer1m(0.1), output: cnyPer1kToUsdPer1m(0.1), source: 'upstream-cny' },
  'baichuan2-turbo': { input: cnyPer1kToUsdPer1m(0.008), output: cnyPer1kToUsdPer1m(0.008), source: 'upstream-cny' },
  'moonshot-v1-8k': { input: cnyPer1kToUsdPer1m(0.012), output: cnyPer1kToUsdPer1m(0.012), source: 'upstream-cny' },
})

/**
 * Merge the user table over the built-in table (per-model override).
 *
 * @param custom - `config.prices` entries.
 * @returns the merged table; custom entries win per model id.
 */
export function mergePrices(custom: Readonly<Record<string, PriceEntry>>): Record<string, PriceEntry> {
  return { ...BUILTIN_PRICES, ...custom }
}

/**
 * Resolve the price for one exact route: `${provider}/${model}` first, then
 * the bare model id, then the fallback.
 *
 * @param table - merged price table.
 * @param fallback - price for models absent from the table.
 * @param provider - registered provider route.
 * @param model - model id.
 * @returns the effective price entry (never undefined).
 */
export function priceFor(
  table: Readonly<Record<string, PriceEntry>>,
  fallback: Readonly<PriceEntry>,
  provider: string,
  model: string,
): PriceEntry {
  return table[`${provider}/${model}`] ?? table[model] ?? fallback
}

/** Cost breakdown for one usage record. */
export interface UsageCost {
  /** Uncached input cost (USD). */
  inputCost: number
  /** Output cost (USD). */
  outputCost: number
  /** Cache-hit input cost (USD). */
  cacheReadCost: number
  /** Cache-miss input cost (USD). */
  cacheWriteCost: number
  /** Sum of all four buckets (USD). */
  totalCost: number
}

/**
 * Price one disjoint token usage record.
 *
 * @param price - effective price entry.
 * @param inputTokens - uncached input tokens.
 * @param outputTokens - output tokens.
 * @param cacheReadTokens - cache-hit tokens (0 when absent).
 * @param cacheWriteTokens - cache-miss tokens (0 when absent).
 * @returns the USD cost breakdown.
 */
export function estimateUsageCost(
  price: Readonly<PriceEntry>,
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number,
): UsageCost {
  const inputCost = (inputTokens / 1_000_000) * price.input
  const outputCost = (outputTokens / 1_000_000) * price.output
  const cacheReadCost = (cacheReadTokens / 1_000_000) * (price.cacheRead ?? price.input)
  const cacheWriteCost = (cacheWriteTokens / 1_000_000) * (price.cacheWrite ?? price.input)
  return { inputCost, outputCost, cacheReadCost, cacheWriteCost, totalCost: inputCost + outputCost + cacheReadCost + cacheWriteCost }
}
