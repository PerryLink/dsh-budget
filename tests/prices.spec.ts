/**
 * Price table and cost formula regressions, ported from
 * LLM-Cost-Estimator-CN (upstream, Apache-2.0) plus the operational USD table.
 *
 * @module dsh-budget/test/prices.spec
 */

import { describe, expect, it } from 'vitest'
import {
  BUILTIN_PRICES,
  cnyPer1kToUsdPer1m,
  estimateUsageCost,
  mergePrices,
  priceFor,
  UPSTREAM_CNY_PER_USD,
} from '../src/estimate/prices.ts'
import { UPSTREAM_MODELS } from '../src/estimate/models.ts'

describe('upstream CNY table', () => {
  it('keeps the upstream deepseek-chat prices verbatim', () => {
    const entry = UPSTREAM_MODELS['deepseek-chat']
    expect(entry).toBeDefined()
    expect(entry?.inputPricePer1k).toBe(0.001)
    expect(entry?.outputPricePer1k).toBe(0.002)
    expect(entry?.currency).toBe('CNY')
  })

  it('converts CNY per 1k into USD per 1M with the fixed porting rate', () => {
    expect(UPSTREAM_CNY_PER_USD).toBe(7.2)
    expect(cnyPer1kToUsdPer1m(0.12)).toBeCloseTo((0.12 * 1000) / 7.2)
  })
})

describe('operational price table', () => {
  it('carries the vendor deepseek-chat pricing', () => {
    expect(BUILTIN_PRICES['deepseek-chat']).toMatchObject({ input: 0.27, cacheRead: 0.027, cacheWrite: 0.27, output: 1.1 })
  })

  it('merges user entries over the built-in table', () => {
    const merged = mergePrices({ 'deepseek-chat': { input: 9, output: 9 } })
    expect(merged['deepseek-chat']?.input).toBe(9)
    expect(merged['gpt-4o']?.input).toBe(2.5)
  })

  it('resolves provider/model routes first, then the bare model, then the fallback', () => {
    const fallback = { input: 7, output: 7 }
    const table = { 'acme/gpt-4o': { input: 1, output: 1 } }
    expect(priceFor(table, fallback, 'acme', 'gpt-4o').input).toBe(1)
    expect(priceFor(table, fallback, 'other', 'unknown').input).toBe(7)
  })
})

describe('estimateUsageCost', () => {
  it('prices disjoint token buckets per 1M tokens', () => {
    const cost = estimateUsageCost({ input: 2, output: 6, cacheRead: 1, cacheWrite: 3 }, 500_000, 100_000, 200_000, 0)
    expect(cost.inputCost).toBeCloseTo(1)
    expect(cost.outputCost).toBeCloseTo(0.6)
    expect(cost.cacheReadCost).toBeCloseTo(0.2)
    expect(cost.cacheWriteCost).toBeCloseTo(0)
    expect(cost.totalCost).toBeCloseTo(1.8)
  })

  it('falls cache prices back to the input price when absent', () => {
    const cost = estimateUsageCost({ input: 2, output: 2 }, 0, 0, 100_000, 0)
    expect(cost.cacheReadCost).toBeCloseTo(0.2)
  })
})
