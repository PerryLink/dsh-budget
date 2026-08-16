/**
 * Sanitization and formatting pure functions. Every display/log surface of
 * dsh-budget goes through these: webhook URLs, alert text, token counts and
 * money amounts. Never log or render a raw config or wire value.
 *
 * @module dsh-budget/estimate/sanitize
 */

/** Control characters plus zero-width and bidi-override code points. */
const CONTROL_OR_INVISIBLE = /[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u2064\ufeff]/gu

/**
 * Make arbitrary text safe for one-line display and logs: strip control and
 * invisible characters, collapse whitespace runs, truncate with an ellipsis.
 *
 * @param input - raw text (possibly hostile).
 * @param maxLength - output length cap (default 200).
 * @returns the sanitized text.
 */
export function sanitizeText(input: string, maxLength = 200): string {
  const text = input.replace(CONTROL_OR_INVISIBLE, '').replace(/\s+/gu, ' ').trim()
  if (text.length <= maxLength) return text
  const cut = maxLength - 1
  return cut > 0 ? `${text.slice(0, cut)}…` : ''
}

/**
 * Redact credentials from a URL for display and logs: the userinfo component
 * (`user:pass@`) is replaced, the rest is kept, and overlong URLs are cut.
 * Query parameters are preserved verbatim — a webhook URL's own secret query
 * tokens are the operator's responsibility to rotate, but the userinfo is
 * always redacted.
 *
 * @param input - raw URL (possibly hostile).
 * @param maxLength - output length cap (default 512).
 * @returns the redacted URL, or '' when it cannot be parsed.
 */
export function sanitizeUrl(input: string, maxLength = 512): string {
  let parsed: URL
  try {
    parsed = new URL(input)
  } catch {
    return ''
  }
  if (parsed.username !== '' || parsed.password !== '') {
    parsed.username = '***'
    parsed.password = ''
  }
  const out = parsed.toString()
  if (out.length <= maxLength) return out
  return `${out.slice(0, maxLength - 1)}…`
}

/** Display-currency options for {@link formatMoney}. */
export interface MoneyFormat {
  /** Currency code placed before the amount (display only). */
  code: string
  /** Display-currency units per 1 USD (1 = USD). */
  rate: number
  /** Decimal places. */
  decimals: number
}

/** Insert grouping separators into the integer part of a decimal string. */
function groupInteger(integer: string): string {
  let out = ''
  let count = 0
  for (let i = integer.length - 1; i >= 0; i -= 1) {
    out = integer[i] + out
    count += 1
    if (count % 3 === 0 && i > 0) out = `,${out}`
  }
  return out
}

/**
 * Format a USD amount in the configured display currency, deterministically
 * (no locale-dependent grouping): converted by `rate`, rounded to `decimals`
 * places, grouped with commas, prefixed with the currency code.
 *
 * @param usd - amount in USD.
 * @param format - display options.
 * @returns e.g. `USD 1,234.57`; non-finite input renders as `USD 0.00`.
 */
export function formatMoney(usd: number, format: Readonly<MoneyFormat>): string {
  const decimals = Math.max(0, Math.trunc(format.decimals))
  if (!Number.isFinite(usd) || !Number.isFinite(format.rate)) {
    return `${format.code} ${(0).toFixed(decimals)}`
  }
  const converted = usd * format.rate
  const fixed = converted.toFixed(decimals)
  const [integer, fraction = ''] = fixed.split('.') as [string, string?]
  const sign = integer.startsWith('-') ? '-' : ''
  const digits = sign === '-' ? integer.slice(1) : integer
  return `${format.code} ${sign}${groupInteger(digits)}${fraction === '' ? '' : `.${fraction}`}`
}

/**
 * Format a token count compactly: `999` stays as-is, `1234` → `1.23k`,
 * `4_500_000` → `4.50M`.
 *
 * @param tokens - non-negative token count.
 * @returns the compact string.
 */
export function formatTokens(tokens: number): string {
  if (!Number.isFinite(tokens) || tokens < 0) return '0'
  if (tokens < 1000) return String(Math.round(tokens))
  if (tokens < 1_000_000) return `${(tokens / 1000).toFixed(tokens < 10_000 ? 2 : 1)}k`
  return `${(tokens / 1_000_000).toFixed(tokens < 10_000_000 ? 2 : 1)}M`
}
