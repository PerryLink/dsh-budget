/**
 * Carbon footprint regressions, ported from AI-Carbon-Footprint-Calculator
 * (upstream, Apache-2.0).
 *
 * @module dsh-budget/test/carbon.spec
 */

import { describe, expect, it } from 'vitest'
import { calculateCarbonFootprint, getComparisons, tokenCarbon, CARBON_INTENSITY } from '../src/estimate/carbon.ts'

describe('calculateCarbonFootprint', () => {
  it('computes the A100 reference workload', () => {
    const result = calculateCarbonFootprint('A100', 1, 1, 1.58, 'global', 1.0)
    expect(result.energyKwh).toBeCloseTo(0.4)
    expect(result.totalEnergyKwh).toBeCloseTo(0.4 * 1.58)
    expect(result.co2Kg).toBeCloseTo(0.4 * 1.58 * (CARBON_INTENSITY['global'] ?? 0))
  })

  it('rejects unknown GPUs and regions', () => {
    expect(() => calculateCarbonFootprint('nope', 1)).toThrow(/GPU/u)
    expect(() => calculateCarbonFootprint('A100', 1, 1, 1.58, 'moon')).toThrow(/region/u)
  })

  it('scales with GPU count and utilization', () => {
    const single = calculateCarbonFootprint('A100', 1, 1, 1.58, 'global', 1.0)
    const double = calculateCarbonFootprint('A100', 1, 2, 1.58, 'global', 1.0)
    expect(double.co2Kg).toBeCloseTo(single.co2Kg * 2)
  })
})

describe('tokenCarbon', () => {
  it('bridges tokens to carbon through kWh/token, PUE, and intensity', () => {
    const result = tokenCarbon(1_000_000, 0.000007, 1.58, 'global')
    expect(result.energyKwh).toBeCloseTo(7)
    expect(result.totalEnergyKwh).toBeCloseTo(7 * 1.58)
    expect(result.co2Kg).toBeCloseTo(7 * 1.58 * (CARBON_INTENSITY['global'] ?? 0))
  })
})

describe('getComparisons', () => {
  it('returns up to three equivalences ordered by closeness', () => {
    const list = getComparisons(21)
    expect(list.length).toBeLessThanOrEqual(3)
    expect(list[0]?.name).toBe('树木一年吸收的CO2')
  })
})
