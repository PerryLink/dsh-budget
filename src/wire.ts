/**
 * The `budget` Remote wire vocabulary: the status/setSettings/unblock
 * payload types, their zod v4 validation schemas (the strict codecs both
 * Typert faces carry), and the invocation descriptors shared verbatim by the
 * host `./typert` manifest (`src/typert.host.ts`) and the client Remote
 * contribution (`src/client/remote.ts`). One canonical source keeps the two
 * codecs from ever drifting apart.
 *
 * @module dsh-budget/wire
 */

import { z } from 'zod'
import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'

/** The scopes a budget cap applies to. */
export const BUDGET_SCOPES = ['session', 'daily', 'monthly'] as const
export type BudgetScope = (typeof BUDGET_SCOPES)[number]

/** One scope's usage line in the panel snapshot. */
export interface ScopeLine {
  scope: BudgetScope
  /** Cap in USD; null = unlimited. */
  capUsd: number | null
  usedUsd: number
  /** usedUsd / capUsd; 0 when unlimited. */
  ratio: number
  tokens: number
  carbonKg: number
}

/** One model's usage line (today), cost-sorted. */
export interface ModelLine {
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
  carbonKg: number
  /** Latency percentiles over the kept window (ms). */
  latency: { min: number | null; p50: number | null; p95: number | null; max: number | null; samples: number }
}

/** One recent threshold alert (newest first). */
export interface AlertLine {
  scope: BudgetScope
  kind: 'warn' | 'over'
  at: number
  usedUsd: number
  capUsd: number
}

/** The full panel snapshot served by `budget/status`. */
export interface BudgetStatus {
  scopes: ScopeLine[]
  models: ModelLine[]
  alerts: AlertLine[]
  blockedScopes: BudgetScope[]
  currency: { code: string; rate: number; decimals: number }
  alertsEnabled: boolean
  desktopNotifications: boolean
  /** Degradation target for the current model, when a cap blocked it. */
  degradedModel: string | null
}

/** Strict wire schema for {@link BudgetStatus} (zod v4, both Typert faces). */
export const BUDGET_STATUS_SCHEMA = z.object({
  scopes: z.array(z.object({
    scope: z.enum(BUDGET_SCOPES),
    capUsd: z.number().nullable(),
    usedUsd: z.number(),
    ratio: z.number(),
    tokens: z.number().int(),
    carbonKg: z.number(),
  })),
  models: z.array(z.object({
    provider: z.string(),
    model: z.string(),
    inputTokens: z.number().int(),
    outputTokens: z.number().int(),
    costUsd: z.number(),
    carbonKg: z.number(),
    latency: z.object({
      min: z.number().int().nullable(),
      p50: z.number().int().nullable(),
      p95: z.number().int().nullable(),
      max: z.number().int().nullable(),
      samples: z.number().int(),
    }),
  })),
  alerts: z.array(z.object({
    scope: z.enum(BUDGET_SCOPES),
    kind: z.union([z.literal('warn'), z.literal('over')]),
    at: z.number().int(),
    usedUsd: z.number(),
    capUsd: z.number(),
  })),
  blockedScopes: z.array(z.enum(BUDGET_SCOPES)),
  currency: z.object({ code: z.string(), rate: z.number(), decimals: z.number().int() }),
  alertsEnabled: z.boolean(),
  desktopNotifications: z.boolean(),
  degradedModel: z.string().nullable(),
})

/**
 * The `budget/status` invocation descriptor, shared verbatim by the host
 * `TYPERT` manifest and the client `TypertRemoteContribution`. Hand-written
 * in the exact shape the Typert generator emits; validated by the typert
 * loader and the client registry at mount time.
 */
export const BUDGET_STATUS_DESCRIPTOR = Object.freeze({
  id: 'dsh-budget#budget/status',
  service: 'budget',
  namespace: 'budget',
  method: 'status',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-budget/types#BudgetStatus',
    schema: BUDGET_STATUS_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/** Strict wire schema for the runtime settings payload. */
export const BUDGET_SETTINGS_SCHEMA = z.object({
  sessionCapUsd: z.number().min(0).nullable(),
  dailyCapUsd: z.number().min(0).nullable(),
  monthlyCapUsd: z.number().min(0).nullable(),
  alertsEnabled: z.boolean(),
  desktopNotifications: z.boolean(),
})

/**
 * The `budget/setSettings` invocation descriptor: the panel edits the
 * runtime budget caps and alert switches (session-scoped runtime state, not
 * a config-file write — a reload restores the cordis.yml values).
 */
export const BUDGET_SET_SETTINGS_DESCRIPTOR = Object.freeze({
  id: 'dsh-budget#budget/setSettings',
  service: 'budget',
  namespace: 'budget',
  method: 'setSettings',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([Object.freeze({
    name: 'settingsJson',
    wire: 'settingsJson',
    source: 'json',
    codec: Object.freeze({
      mode: 'strict',
      typeSymbol: 'dsh-budget/types#BudgetSettingsJson',
      schema: z.string(),
    }),
  } satisfies InvocationDescriptor['parameters'][number])]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-budget/types#BudgetStatus',
    schema: BUDGET_STATUS_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/** Strict wire schema for the unblock request scope. */
export const BUDGET_UNBLOCK_SCOPE_SCHEMA = z.enum(BUDGET_SCOPES)

/**
 * The `budget/unblock` invocation descriptor: lift one blocked scope after
 * the user confirms (panel or `/budget unblock <scope>`).
 */
export const BUDGET_UNBLOCK_DESCRIPTOR = Object.freeze({
  id: 'dsh-budget#budget/unblock',
  service: 'budget',
  namespace: 'budget',
  method: 'unblock',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([Object.freeze({
    name: 'scope',
    wire: 'scope',
    source: 'json',
    codec: Object.freeze({
      mode: 'strict',
      typeSymbol: 'dsh-budget/types#BudgetUnblockScope',
      schema: BUDGET_UNBLOCK_SCOPE_SCHEMA,
    }),
  } satisfies InvocationDescriptor['parameters'][number])]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-budget/types#BudgetStatus',
    schema: BUDGET_STATUS_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/**
 * The canonical invocation list both Typert faces register — the host
 * manifest and the client contribution share these exact descriptor objects,
 * so the two wire codecs can never drift apart.
 */
export const BUDGET_INVOCATIONS = Object.freeze([
  BUDGET_STATUS_DESCRIPTOR,
  BUDGET_SET_SETTINGS_DESCRIPTOR,
  BUDGET_UNBLOCK_DESCRIPTOR,
])
