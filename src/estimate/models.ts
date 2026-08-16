/**
 * Port of the LLM-Cost-Estimator-CN price table
 * (`upstream/LLM-Cost-Estimator-CN/src/llm_cost_estimator_cn/data/models.json`,
 * commit aa6cc2f, Apache-2.0). Values are kept VERBATIM: CNY per 1k tokens.
 *
 * This table is the fixture source for the ported cost formulas in
 * {@link ./cost.ts}; the plugin's operational USD-per-1M price table lives in
 * {@link ./prices.ts} and is maintained separately.
 *
 * @module dsh-budget/estimate/models
 */

/** One entry of the upstream Chinese-model price table (CNY per 1k tokens). */
export interface UpstreamCostModelEntry {
  /** Upstream provider display name. */
  provider: string
  /** Upstream model display name. */
  name: string
  /** Input price, CNY per 1000 tokens. */
  inputPricePer1k: number
  /** Output price, CNY per 1000 tokens. */
  outputPricePer1k: number
  /** Upstream price currency code. */
  currency: string
  /** Upstream free-form note. */
  notes?: string
}

/** The upstream price table, verbatim from models.json. */
export const UPSTREAM_MODELS: Readonly<Record<string, UpstreamCostModelEntry>> = Object.freeze({
  'deepseek-chat': {
    provider: 'DeepSeek',
    name: 'DeepSeek Chat',
    inputPricePer1k: 0.001,
    outputPricePer1k: 0.002,
    currency: 'CNY',
    notes: '性价比之王',
  },
  'ernie-4.0': {
    provider: '百度',
    name: '文心一言 4.0',
    inputPricePer1k: 0.12,
    outputPricePer1k: 0.12,
    currency: 'CNY',
    notes: '百度旗舰模型',
  },
  'qwen-turbo': {
    provider: '阿里云',
    name: '通义千问 Turbo',
    inputPricePer1k: 0.008,
    outputPricePer1k: 0.008,
    currency: 'CNY',
    notes: '高性价比选择',
  },
  'qwen-plus': {
    provider: '阿里云',
    name: '通义千问 Plus',
    inputPricePer1k: 0.04,
    outputPricePer1k: 0.04,
    currency: 'CNY',
    notes: '平衡性能与成本',
  },
  'glm-4': {
    provider: '智谱AI',
    name: 'GLM-4',
    inputPricePer1k: 0.1,
    outputPricePer1k: 0.1,
    currency: 'CNY',
    notes: '智谱旗舰模型',
  },
  'baichuan2-turbo': {
    provider: '百川智能',
    name: '百川2-Turbo',
    inputPricePer1k: 0.008,
    outputPricePer1k: 0.008,
    currency: 'CNY',
    notes: '快速响应',
  },
  'moonshot-v1-8k': {
    provider: '月之暗面',
    name: 'Kimi Chat 8K',
    inputPricePer1k: 0.012,
    outputPricePer1k: 0.012,
    currency: 'CNY',
    notes: '长文本处理',
  },
})
