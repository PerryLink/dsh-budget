/**
 * Durable budget persistence: the `dsh_budget` domain schema accepts a valid
 * persisted state and rejects malformed records at the durable boundary.
 * @module dsh-budget/test/store.spec
 */

import { describe, expect, it } from 'vitest'
import { budgetStateSchema } from '../src/store.ts'

function validState() {
  return {
    days: {
      '2026-08-16': {
        total: { inputTokens: 1_000_000, outputTokens: 100_000, cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0.38, carbonKg: 0.001 },
        models: {
          'deepseek-chat': { provider: 'deepseek', model: 'deepseek-chat', inputTokens: 1_000_000, outputTokens: 100_000, cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0.38, carbonKg: 0.001 },
        },
      },
    },
    months: {
      '2026-08': {
        total: { inputTokens: 1_000_000, outputTokens: 100_000, cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0.38, carbonKg: 0.001 },
        models: {
          'deepseek-chat': { provider: 'deepseek', model: 'deepseek-chat', inputTokens: 1_000_000, outputTokens: 100_000, cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0.38, carbonKg: 0.001 },
        },
      },
    },
  }
}

describe('budgetStateSchema', () => {
  it('accepts a valid persisted state', () => {
    expect(budgetStateSchema.parse(validState()).days['2026-08-16']?.total.inputTokens).toBe(1_000_000)
  })

  it('rejects a malformed state at the durable boundary', () => {
    expect(() => budgetStateSchema.parse({ days: 'nope', months: {} })).toThrow()
    expect(() => budgetStateSchema.parse({ days: { d: { total: { inputTokens: -1 } } }, months: {} })).toThrow()
  })

  it('accepts an empty state (first-ever persist)', () => {
    expect(budgetStateSchema.parse({ days: {}, months: {} })).toEqual({ days: {}, months: {} })
  })
})
