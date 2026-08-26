/**
 * Durable budget persistence over the harness storage domain. The `dsh_budget`
 * domain keeps the day/month buckets across restarts, so a restart restores
 * cumulative daily and monthly usage instead of rebuilding it from the current
 * session view alone. Session buckets, alerts, and block state stay
 * process-local (they are session- or runtime-scoped by design).
 * @module dsh-budget/store
 */

import z from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import type { PersistedBudgetState } from './aggregate/usage.ts'

/** Zod schema for one scope usage record. */
const scopeUsageSchema = z.object({
  inputTokens: z.number().nonnegative(),
  outputTokens: z.number().nonnegative(),
  cacheReadTokens: z.number().nonnegative(),
  cacheWriteTokens: z.number().nonnegative(),
  costUsd: z.number(),
  carbonKg: z.number(),
})

/** Zod schema for one persisted model usage entry. */
const modelUsageSchema = z.object({
  provider: z.string(),
  model: z.string(),
  inputTokens: z.number().nonnegative(),
  outputTokens: z.number().nonnegative(),
  cacheReadTokens: z.number().nonnegative(),
  cacheWriteTokens: z.number().nonnegative(),
  costUsd: z.number(),
  carbonKg: z.number(),
})

/** Zod schema for one persisted day/month bucket. */
const bucketSchema = z.object({
  total: scopeUsageSchema,
  models: z.record(z.string(), modelUsageSchema),
})

/** Zod schema for the persisted state (re-validated at the durable boundary). */
export const budgetStateSchema = z.object({
  days: z.record(z.string(), bucketSchema),
  months: z.record(z.string(), bucketSchema),
})

/** The `dsh_budget` storage-domain declaration. */
export const budgetDomainSpec = defineDomain({
  name: 'dsh_budget',
  version: 1,
  tables: {
    state: domainTable<string, PersistedBudgetState>(budgetStateSchema),
  },
})
