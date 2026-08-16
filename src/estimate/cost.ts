/**
 * Port of the LLM-Cost-Estimator-CN cost formulas
 * (`upstream/LLM-Cost-Estimator-CN/src/llm_cost_estimator_cn/core.py` +
 * `utils.py`, commit aa6cc2f, Apache-2.0): per-1k-token pricing, cheapest-first
 * sorting, the ¥ currency formatter and the percentage-diff helper.
 *
 * @module dsh-budget/estimate/cost
 */

import { UPSTREAM_MODELS } from './models.ts'

/** A price entry used by {@link calculateCosts}. */
export interface CostPriceEntry {
  /** Input price per 1000 tokens. */
  inputPricePer1k: number
  /** Output price per 1000 tokens. */
  outputPricePer1k: number
}

/** One model's cost estimate, as produced by the upstream calculator. */
export interface CostEstimate {
  /** Model table key. */
  modelId: string
  /** Provider display name. */
  provider: string
  /** Model display name. */
  modelName: string
  /** Input cost for the requested tokens. */
  inputCost: number
  /** Output cost for the requested tokens. */
  outputCost: number
  /** `inputCost + outputCost`. */
  totalCost: number
}

/** Entry shape the upstream calculator iterates (id → price + display fields). */
export interface CostTableEntry extends CostPriceEntry {
  /** Provider display name. */
  provider: string
  /** Model display name. */
  name: string
}

/**
 * Calculate every model's cost for the given token counts, cheapest first.
 *
 * @param models - id → price/display entry table.
 * @param inputTokens - number of input tokens.
 * @param outputTokens - number of output tokens.
 * @returns the estimates sorted by ascending `totalCost`.
 */
export function calculateCosts(
  models: Readonly<Record<string, CostTableEntry>>,
  inputTokens: number,
  outputTokens: number,
): CostEstimate[] {
  const results: CostEstimate[] = []
  for (const [modelId, info] of Object.entries(models)) {
    const inputCost = (inputTokens / 1000) * info.inputPricePer1k
    const outputCost = (outputTokens / 1000) * info.outputPricePer1k
    results.push({
      modelId,
      provider: info.provider,
      modelName: info.name,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
    })
  }
  results.sort((a, b) => a.totalCost - b.totalCost)
  return results
}

/**
 * Estimate every built-in upstream model's cost, cheapest first.
 *
 * @param inputTokens - number of input tokens.
 * @param outputTokens - number of output tokens.
 * @returns the estimates sorted by ascending `totalCost`.
 */
export function calculateUpstreamCosts(inputTokens: number, outputTokens: number): CostEstimate[] {
  return calculateCosts(UPSTREAM_MODELS, inputTokens, outputTokens)
}

/**
 * Format an amount with the upstream ¥ style (4 decimal places).
 *
 * @param amount - numeric amount.
 * @returns `¥` plus the amount fixed to 4 decimals.
 */
export function formatCurrencyCny(amount: number): string {
  return `¥${amount.toFixed(4)}`
}

/**
 * Compute the percentage difference against a baseline, upstream style.
 *
 * @param value - the value to compare.
 * @param baseline - the reference value.
 * @returns `N/A` for a zero baseline, a literal `基准` marker when equal,
 *   otherwise a signed percentage with one decimal.
 */
export function percentageDiff(value: number, baseline: number): string {
  if (baseline === 0) return 'N/A'
  if (value === baseline) return '基准'
  const diffPercent = ((value - baseline) / baseline) * 100
  return `+${diffPercent.toFixed(1)}%`
}
