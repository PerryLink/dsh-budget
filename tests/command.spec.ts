/**
 * Command surface: argument parsing and the overview/model renderers. Pure
 * text functions — no harness needed for the parse/render paths.
 *
 * @module dsh-budget/test/command.spec
 */

import { describe, expect, it } from 'vitest'
import { parseBudgetArgs, renderBudgetModels, renderBudgetOverview } from '../src/command.ts'
import type { BudgetStatus } from '../src/wire.ts'

const STATUS: BudgetStatus = {
  scopes: [
    { scope: 'session', capUsd: 10, usedUsd: 5, ratio: 0.5, tokens: 1_000, carbonKg: 0.001 },
    { scope: 'daily', capUsd: 50, usedUsd: 60, ratio: 1.2, tokens: 20_000, carbonKg: 0.02 },
    { scope: 'monthly', capUsd: null, usedUsd: 60, ratio: 0, tokens: 20_000, carbonKg: 0.02 },
  ],
  models: [{ provider: 'deepseek', model: 'deepseek-chat', inputTokens: 100, outputTokens: 50, costUsd: 0.05, carbonKg: 0.0001, latency: { min: 10, p50: 20, p95: 30, max: 40, samples: 3 } }],
  alerts: [],
  blockedScopes: ['daily'],
  currency: { code: 'USD', rate: 1.0, decimals: 2 },
  alertsEnabled: true,
  desktopNotifications: false,
  degradedModel: null,
}

const EN = {
  unlimited: 'unlimited',
  blocked: 'BLOCKED',
  noModels: 'no model usage recorded yet',
}

describe('parseBudgetArgs', () => {
  it('parses the bare command as an overview', () => {
    expect(parseBudgetArgs('')).toEqual({ kind: 'overview' })
  })

  it('parses the unblock subcommand', () => {
    expect(parseBudgetArgs('unblock daily')).toEqual({ kind: 'unblock', scope: 'daily' })
  })

  it('parses the models subcommand', () => {
    expect(parseBudgetArgs('models')).toEqual({ kind: 'models' })
  })

  it('rejects unknown input', () => {
    expect(parseBudgetArgs('unblock yearly').kind).toBe('usage')
  })
})

describe('renderBudgetOverview', () => {
  it('renders every scope with usage, ratio, and block markers', () => {
    const text = renderBudgetOverview(STATUS, EN as never)
    expect(text).toContain('session')
    expect(text).toContain('daily')
    expect(text).toContain('monthly')
    expect(text).toContain('BLOCKED')
    expect(text).toContain('deepseek/deepseek-chat')
  })
})

describe('renderBudgetModels', () => {
  it('renders the model breakdown', () => {
    const text = renderBudgetModels(STATUS, EN as never)
    expect(text).toContain('deepseek/deepseek-chat')
    expect(text).toContain('p50 20ms')
  })
})
