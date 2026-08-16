/**
 * Port of the AI-Carbon-Footprint-Calculator data and formulas
 * (`upstream/AI-Carbon-Footprint-Calculator/src/ai_carbon_footprint/data.py`
 * + `core.py` + `comparisons.py`, commit d8d52b5, Apache-2.0): GPU TDP table,
 * regional grid carbon intensity (kg CO2e/kWh), PUE constants, the
 * GPU-hours → energy → CO2 formula, and the equivalence comparisons.
 *
 * The plugin bridges LLM tokens onto this model through
 * {@link tokenCarbon}: IT energy = tokens × kWh/token, total energy = IT × PUE,
 * CO2 = total energy × regional intensity. `energyKwhPerToken` is configurable
 * (`config.carbon.energyKwhPerToken`); its default derivation is documented in
 * cordis.patch.yml.
 *
 * @module dsh-budget/estimate/carbon
 */

/** GPU TDP specifications, verbatim from upstream data.py. */
export interface GpuSpec {
  /** Thermal design power in watts. */
  tdp: number
  /** Display name. */
  name: string
  /** Upstream category tag. */
  category: string
}

/** The upstream GPU table (17 entries), verbatim. */
export const GPU_SPECS: Readonly<Record<string, GpuSpec>> = Object.freeze({
  'A100': { tdp: 400, name: 'NVIDIA A100', category: 'datacenter' },
  'A100-80GB': { tdp: 400, name: 'NVIDIA A100 80GB', category: 'datacenter' },
  'H100': { tdp: 700, name: 'NVIDIA H100', category: 'datacenter' },
  'H100-80GB': { tdp: 700, name: 'NVIDIA H100 80GB', category: 'datacenter' },
  'V100': { tdp: 300, name: 'NVIDIA V100', category: 'datacenter' },
  'A40': { tdp: 300, name: 'NVIDIA A40', category: 'datacenter' },
  'A30': { tdp: 165, name: 'NVIDIA A30', category: 'datacenter' },
  'A10': { tdp: 150, name: 'NVIDIA A10', category: 'datacenter' },
  'RTX-4090': { tdp: 450, name: 'NVIDIA RTX 4090', category: 'consumer' },
  'RTX-4080': { tdp: 320, name: 'NVIDIA RTX 4080', category: 'consumer' },
  'RTX-3090': { tdp: 350, name: 'NVIDIA RTX 3090', category: 'consumer' },
  'RTX-3080': { tdp: 320, name: 'NVIDIA RTX 3080', category: 'consumer' },
  'MI250X': { tdp: 560, name: 'AMD MI250X', category: 'datacenter' },
  'MI210': { tdp: 300, name: 'AMD MI210', category: 'datacenter' },
  'MI100': { tdp: 300, name: 'AMD MI100', category: 'datacenter' },
  'TPU-v4': { tdp: 450, name: 'Google TPU v4', category: 'tpu' },
  'TPU-v3': { tdp: 450, name: 'Google TPU v3', category: 'tpu' },
})

/** Regional grid carbon intensity in kg CO2e per kWh, verbatim from upstream. */
export const CARBON_INTENSITY: Readonly<Record<string, number>> = Object.freeze({
  global: 0.475,
  us: 0.386,
  eu: 0.276,
  china: 0.555,
  india: 0.708,
  uk: 0.233,
  france: 0.056,
  iceland: 0.01,
})

/** Upstream default power usage effectiveness. */
export const DEFAULT_PUE = 1.58
/** Upstream "efficient" PUE reference. */
export const EFFICIENT_PUE = 1.2
/** Upstream "hyperscale" PUE reference. */
export const HYPERSCALE_PUE = 1.1

/** One GPU-hours workload's carbon result. */
export interface CarbonResult {
  /** GPU display name. */
  gpuName: string
  /** GPU table key. */
  gpuModel: string
  /** GPU count. */
  numGpus: number
  /** Runtime in hours. */
  hours: number
  /** Utilization factor (0..1]. */
  utilization: number
  /** Effective PUE. */
  pue: number
  /** Electricity region key. */
  region: string
  /** IT energy in kWh (before PUE). */
  energyKwh: number
  /** Total energy in kWh (after PUE). */
  totalEnergyKwh: number
  /** Emissions in kg CO2e. */
  co2Kg: number
  /** Regional intensity used, kg CO2e/kWh. */
  carbonIntensity: number
}

/**
 * Compute the carbon footprint of a GPU-hours workload.
 *
 * @param gpuModel - GPU table key.
 * @param hours - runtime in hours.
 * @param numGpus - GPU count (default 1).
 * @param pue - power usage effectiveness (default {@link DEFAULT_PUE}).
 * @param region - electricity region key (default `global`).
 * @param utilization - GPU utilization in (0, 1] (default 1).
 * @returns the calculation result.
 * @throws on an unknown GPU, an unknown region, or an out-of-range utilization.
 */
export function calculateCarbonFootprint(
  gpuModel: string,
  hours: number,
  numGpus = 1,
  pue: number = DEFAULT_PUE,
  region = 'global',
  utilization = 1.0,
): CarbonResult {
  const gpuSpec = GPU_SPECS[gpuModel]
  if (gpuSpec === undefined) throw new Error(`Unknown GPU model: ${gpuModel}`)
  if (CARBON_INTENSITY[region] === undefined) throw new Error(`Unknown region: ${region}`)
  if (!(utilization > 0 && utilization <= 1)) throw new Error('Utilization must be between 0 and 1')

  const energyKwh = (gpuSpec.tdp * hours * numGpus * utilization) / 1000
  const totalEnergyKwh = energyKwh * pue
  const carbonIntensity = CARBON_INTENSITY[region]!
  return {
    gpuName: gpuSpec.name,
    gpuModel,
    numGpus,
    hours,
    utilization,
    pue,
    region,
    energyKwh,
    totalEnergyKwh,
    co2Kg: totalEnergyKwh * carbonIntensity,
    carbonIntensity,
  }
}

/** One real-world equivalence reference (upstream `co2_kg` comparison table). */
export interface CarbonComparison {
  /** Human-readable name. */
  name: string
  /** Emoji marker from the upstream table. */
  emoji: string
  /** Reference emissions in kg CO2e. */
  co2Kg: number
}

/** The upstream comparison references, verbatim from comparisons.py. */
export const COMPARISONS: Readonly<Record<string, CarbonComparison>> = Object.freeze({
  car_year: { name: '燃油车行驶一年', co2Kg: 4600, emoji: '🚗' },
  flight_nyc_london: { name: '纽约-伦敦往返航班', co2Kg: 1100, emoji: '✈️' },
  tree_year: { name: '树木一年吸收的CO2', co2Kg: 21, emoji: '🌲' },
  smartphone_charge: { name: '智能手机充电', co2Kg: 0.008, emoji: '📱' },
  home_electricity_month: { name: '家庭一个月用电', co2Kg: 400, emoji: '🏠' },
})

/** One computed equivalence: how many reference units a CO2 amount equals. */
export interface CarbonEquivalence {
  /** Reference name. */
  name: string
  /** Reference emoji. */
  emoji: string
  /** `co2Kg / reference`. */
  equivalent: number
  /** Reference emissions in kg CO2e. */
  unitCo2: number
}

/**
 * Pick the top-3 most relevant real-world equivalences for an emissions
 * amount, upstream style: only references within 0.1×–10× qualify, sorted by
 * closeness to 1×.
 *
 * @param co2Kg - emissions in kg CO2e.
 * @returns up to three equivalences, closest first.
 */
export function getComparisons(co2Kg: number): CarbonEquivalence[] {
  const results: CarbonEquivalence[] = []
  for (const comp of Object.values(COMPARISONS)) {
    const ratio = co2Kg / comp.co2Kg
    if (ratio >= 0.1 && ratio <= 10) {
      results.push({ name: comp.name, emoji: comp.emoji, equivalent: ratio, unitCo2: comp.co2Kg })
    }
  }
  results.sort((a, b) => Math.abs(1 - a.equivalent) - Math.abs(1 - b.equivalent))
  return results.slice(0, 3)
}

/** Token-bridge carbon result for one token volume. */
export interface TokenCarbonResult {
  /** IT energy in kWh (tokens × kWh/token). */
  energyKwh: number
  /** Total energy in kWh (IT × PUE). */
  totalEnergyKwh: number
  /** Emissions in kg CO2e. */
  co2Kg: number
  /** Regional intensity used, kg CO2e/kWh. */
  carbonIntensity: number
}

/**
 * Estimate the carbon footprint of a token volume (the plugin's token→carbon
 * bridge): energy = tokens × kWh/token, total = energy × PUE,
 * CO2 = total × regional intensity.
 *
 * @param tokens - total tokens processed (all buckets).
 * @param energyKwhPerToken - IT energy per token in kWh.
 * @param pue - power usage effectiveness.
 * @param region - electricity region key.
 * @returns the estimation result.
 * @throws on an unknown region.
 */
export function tokenCarbon(
  tokens: number,
  energyKwhPerToken: number,
  pue: number,
  region: string,
): TokenCarbonResult {
  const carbonIntensity = CARBON_INTENSITY[region]
  if (carbonIntensity === undefined) throw new Error(`Unknown region: ${region}`)
  const energyKwh = tokens * energyKwhPerToken
  const totalEnergyKwh = energyKwh * pue
  return { energyKwh, totalEnergyKwh, co2Kg: totalEnergyKwh * carbonIntensity, carbonIntensity }
}
