/**
 * Thinking-share formatting shared by the `/budget` command and the Settings
 * tab. `reasoningTokens / outputTokens` is only meaningful when the host
 * actually reported reasoning tokens: an omitted field must render `n/a`, not
 * a fabricated 0%.
 *
 * @module dsh-budget/thinking
 */

/**
 * The reasoning share of one model's output.
 *
 * @param reasoningTokens - reported reasoning tokens; null = host omitted them.
 * @param outputTokens - total output tokens (including reasoning).
 * @returns the 0..1 share, or null when the host omitted the reading or no
 *   output was recorded.
 */
export function thinkingShare(reasoningTokens: number | null, outputTokens: number): number | null {
  if (reasoningTokens === null || outputTokens <= 0) return null
  return reasoningTokens / outputTokens
}

/**
 * One-line thinking-share text: a whole percent, or `n/a` when unknown.
 *
 * @param reasoningTokens - reported reasoning tokens; null = host omitted them.
 * @param outputTokens - total output tokens.
 * @returns e.g. `42%` or `n/a`.
 */
export function thinkingShareText(reasoningTokens: number | null, outputTokens: number): string {
  const share = thinkingShare(reasoningTokens, outputTokens)
  return share === null ? 'n/a' : `${Math.round(share * 100)}%`
}
