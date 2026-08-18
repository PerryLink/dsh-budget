/**
 * Fiber-disposal / HMR-safety + export-contract suite: mounting the plugin
 * over the REAL commands runtime, disposing its contributing fiber, and
 * re-querying the authoritative registries to prove the `/budget` command and
 * the `budget` service disappear; plus the function-plugin namespace contract
 * (no default export, Loader unwrap round-trip).
 * @module dsh-budget/tests/lifecycle.spec
 */

import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import CommandRuntime from '@deepseek-ai/dsh-commands'
import SessionStore, { SessionId } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'

/** Mount the plugin over a real session store and command runtime with a faked optional llm. */
async function mount() {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const session = ctx.sessions.create(SessionId('budget-lifecycle'))
  await ctx.plugin(CommandRuntime)
  ctx.provide('llm', {} as never)
  const fiber = await ctx.plugin(plugin as unknown as import('@deepseek-ai/cordis').Plugin, {})
  const agent = {
    id: session.id,
    session,
    options: {},
    inbox: {},
    status: 'idle',
    ctx,
    cancel: () => undefined,
    whenIdle: async () => undefined,
    runMaintenance: async (task: (signal: AbortSignal) => Promise<unknown>) => task(new AbortController().signal),
    send: () => undefined,
    followup: () => undefined,
    steer: () => undefined,
    inject: () => undefined,
  } as unknown as import('@deepseek-ai/dsh-agent').Agent
  return { ctx, session, agent, fiber }
}

describe('function-plugin contract', () => {
  it('carries no default export and the Loader unwrap round-trips the namespace', () => {
    expect('default' in plugin).toBe(false)
    expect(plugin.name).toBe('dsh-budget')
    expect(plugin.inject).toEqual(['sessions'])
    expect(typeof plugin.apply).toBe('function')
    expect(plugin.Config).toBeDefined()
    const loader = Object.create(Loader.prototype)
    const unwrapped = loader.unwrapExports(plugin)
    expect(unwrapped).toBe(plugin)
    expect(unwrapped.name).toBe('dsh-budget')
  })
})

describe('fiber disposal', () => {
  it('removes the /budget command and the budget service when the fiber is disposed', async () => {
    const harness = await mount()
    try {
      expect(harness.ctx.commands.list(harness.agent).find(entry => entry.name === 'budget')).toBeDefined()
      expect(harness.ctx.get('budget')).toBeDefined()

      await harness.fiber.dispose()

      expect(harness.ctx.commands.list(harness.agent).find(entry => entry.name === 'budget')).toBeUndefined()
      expect(harness.ctx.get('budget')).toBeUndefined()
    } finally {
      await harness.ctx.fiber.dispose()
    }
  })
})
