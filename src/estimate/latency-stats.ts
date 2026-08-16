/**
 * Port of the Mode-Latency-Benchmark provider table and request builders
 * (`upstream/Mode-Latency-Benchmark/src/model_latency_benchmark/core.py`,
 * commit 8123838, Apache-2.0), plus the percentile statistics the plugin
 * aggregates from measured call durations.
 *
 * The upstream tool probes providers over HTTP; the plugin reuses its
 * `BenchmarkResult` vocabulary (ttft / total time / tokens / error) and adds
 * `latencyStats` for per-model percentile aggregation over the llm/stream
 * wrapper.
 *
 * @module dsh-budget/estimate/latency-stats
 */

/** Authentication style of one upstream provider config. */
export type ProviderAuthType = 'bearer' | 'query_param'

/** One provider config entry, verbatim from upstream core.py. */
export interface ProviderSpec {
  /** Display name. */
  name: string
  /** HTTP endpoint. */
  endpoint: string
  /** Environment variable carrying the API key. */
  envKey: string
  /** Default model id. */
  model: string
  /** Authentication style. */
  authType: ProviderAuthType
  /** Terminal color tag. */
  color: string
  /** Terminal icon. */
  icon: string
}

/** The upstream provider table (4 entries), verbatim. */
export const PROVIDERS: Readonly<Record<string, ProviderSpec>> = Object.freeze({
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    envKey: 'DEEPSEEK_API_KEY',
    model: 'deepseek-chat',
    authType: 'bearer',
    color: 'green',
    icon: '🟢',
  },
  baidu: {
    name: '百度文心',
    endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    envKey: 'BAIDU_API_KEY',
    model: 'ernie-4.0-turbo-8k',
    authType: 'query_param',
    color: 'blue',
    icon: '🔵',
  },
  alibaba: {
    name: '阿里通义',
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    envKey: 'ALIBABA_API_KEY',
    model: 'qwen-turbo',
    authType: 'bearer',
    color: 'orange',
    icon: '🟠',
  },
  bytedance: {
    name: '字节豆包',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    envKey: 'BYTEDANCE_API_KEY',
    model: 'doubao-pro-4k',
    authType: 'bearer',
    color: 'magenta',
    icon: '🟣',
  },
})

/** One benchmark outcome (upstream BenchmarkResult vocabulary). */
export interface BenchmarkResult {
  /** Provider table key. */
  providerId: string
  /** Provider display name. */
  providerName: string
  /** Time to first token in seconds; null when never reached. */
  ttft: number | null
  /** Total response time in seconds; null on failure. */
  totalTime: number | null
  /** Chunk/token count observed. */
  tokens: number
  /** Failure detail; null on success. */
  error: string | null
  /** Whether the run completed. */
  success: boolean
}

/**
 * Build the request headers for one provider, upstream style.
 *
 * @param provider - provider config (reads `authType` only).
 * @param apiKey - provider API key (used only for bearer auth).
 * @returns the header map.
 */
export function buildRequestHeaders(provider: Readonly<ProviderSpec>, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (provider.authType === 'bearer') headers['Authorization'] = `Bearer ${apiKey}`
  return headers
}

/**
 * Build the request body for one provider, upstream style.
 *
 * @param provider - provider config.
 * @param prompt - the user prompt.
 * @returns the JSON body object.
 */
export function buildRequestBody(provider: Readonly<ProviderSpec>, prompt: string): Record<string, unknown> {
  if (provider.authType === 'query_param') {
    return { messages: [{ role: 'user', content: prompt }], stream: true }
  }
  return { model: provider.model, messages: [{ role: 'user', content: prompt }], stream: true }
}

/**
 * Build the request URL for one provider, upstream style (query-param auth
 * appends the key).
 *
 * @param provider - provider config.
 * @param apiKey - provider API key (used only for query-param auth).
 * @returns the request URL.
 */
export function buildRequestUrl(provider: Readonly<ProviderSpec>, apiKey: string): string {
  const url = provider.endpoint
  return provider.authType === 'query_param' ? `${url}?access_token=${apiKey}` : url
}

/** Percentile statistics over one duration sample window (milliseconds). */
export interface LatencyStats {
  /** Sample count. */
  count: number
  /** Arithmetic mean (ms). */
  mean: number
  /** Minimum (ms). */
  min: number
  /** Maximum (ms). */
  max: number
  /** 50th percentile (ms). */
  p50: number
  /** 95th percentile (ms). */
  p95: number
  /** 99th percentile (ms). */
  p99: number
  /** Population standard deviation (ms). */
  stdev: number
}

/**
 * One percentile via linear interpolation between order statistics (R-7,
 * numpy.percentile default).
 *
 * @param sorted - samples sorted ascending.
 * @param q - quantile in [0, 1].
 * @returns the interpolated percentile value.
 */
function percentile(sorted: readonly number[], q: number): number {
  if (sorted.length === 0) return 0
  if (sorted.length === 1) return sorted[0]!
  const position = (sorted.length - 1) * q
  const lo = Math.floor(position)
  const hi = Math.ceil(position)
  const lower = sorted[lo]!
  return lo === hi ? lower : lower + (sorted[hi]! - lower) * (position - lo)
}

/**
 * Aggregate latency statistics over a sample window. Deterministic and pure:
 * callers own the sample retention policy.
 *
 * @param samples - durations in milliseconds (any order, may be empty).
 * @returns the statistics; every field is 0 for an empty window.
 */
export function latencyStats(samples: readonly number[]): LatencyStats {
  if (samples.length === 0) {
    return { count: 0, mean: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0, stdev: 0 }
  }
  const sorted = [...samples].sort((a, b) => a - b)
  const count = sorted.length
  const mean = sorted.reduce((sum, value) => sum + value, 0) / count
  const variance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count
  return {
    count,
    mean,
    min: sorted[0]!,
    max: sorted[count - 1]!,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
    stdev: Math.sqrt(variance),
  }
}

/**
 * Format a millisecond duration the way the upstream tool displays it.
 *
 * @param ms - duration in milliseconds.
 * @returns `123ms` for sub-second values, `1.23s` otherwise.
 */
export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}
