/**
 * Config contract: the Schemastery schema fails loud on invalid values, and
 * `resolveConfig` re-judges every default and bound for programmatic
 * construction that bypasses the Loader.
 *
 * @module dsh-budget/test/config.spec
 */

import { describe, expect, it } from 'vitest'
import { Config, resolveConfig } from '../src/config.ts'

describe('Config schema', () => {
  it('applies every default on an empty input', () => {
    const resolved = Config({})
    expect(resolved.budgets).toEqual({ session: 10, daily: 50, monthly: 500 })
    expect(resolved.overLimit).toBe('alert')
    expect(resolved.carbon).toEqual({ enabled: true, region: 'global', pue: 1.58, energyKwhPerToken: 0.000007 })
    expect(resolved.currency).toEqual({ code: 'USD', rate: 1.0, decimals: 2 })
    expect(resolved.outputLanguage).toBe('en')
  })

  it('rejects an unknown over-limit policy', () => {
    expect(() => Config({ overLimit: 'explode' as 'alert' })).toThrow()
  })

  it('rejects an unknown carbon region', () => {
    expect(() => Config({ carbon: { region: 'moon' as 'global' } })).toThrow()
  })
})

describe('resolveConfig', () => {
  it('fills defaults and freezes the result', () => {
    const resolved = resolveConfig({})
    expect(resolved.budgets.session).toBe(10)
    expect(resolved.overLimit).toBe('alert')
    expect(resolved.carbon.region).toBe('global')
    expect(Object.isFrozen(resolved)).toBe(true)
  })

  it('fails loud on an invalid webhook URL', () => {
    expect(() => resolveConfig({ webhookUrl: 'ftp://example.com/hook' })).toThrow(/webhookUrl/u)
  })

  it('fails loud on an out-of-range warn ratio', () => {
    expect(() => resolveConfig({ warnRatio: 1.5 })).toThrow(/warnRatio/u)
  })

  it('normalizes the webhook URL', () => {
    const resolved = resolveConfig({ webhookUrl: 'https://example.com/hook' })
    expect(resolved.webhookUrl).toBe('https://example.com/hook')
  })

  it('compiles user price overrides', () => {
    const resolved = resolveConfig({ prices: { 'my-model': { input: 2, output: 4 } } })
    expect(resolved.prices['my-model']).toEqual({ input: 2, output: 4 })
  })
})
