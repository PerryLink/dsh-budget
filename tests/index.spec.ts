/**
 * Assembly-level test: the REAL SessionStore + REAL session events feed the
 * aggregator, the governance checks fire, the `/budget` command registers,
 * and the `llm/stream` blocker short-circuits when a scope is blocked. The
 * llm/commands services are scripted stand-ins (the plugin reads them as
 * optional services); everything else runs for real.
 *
 * @module dsh-budget/test/index.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { SessionId, type Session, type SessionEventMap } from '@deepseek-ai/dsh-session'
import type { AssistantMessage, GenerateOptions, StreamChunk, TokenUsage } from '@deepseek-ai/dsh-llm'
import type { Plugin } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { apply } from '../src/index.ts'
import type { BudgetService } from '../src/service.ts'

async function mount(
  config: Record<string, unknown> = {},
  makeLlm: (ctx: Context) => unknown = () => ({}),
): Promise<{ ctx: Context; session: Session; service: BudgetService; commands: Array<{ name: string }> }> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const session = ctx.sessions.create(SessionId('budget-harness'))
  session.append('turn/start', { turn: 1 })
  const commands: Array<{ name: string }> = []
  ctx.provide('commands', {
    register: (definition: { name: string }) => { commands.push({ name: definition.name }); return () => {} },
    list: () => [],
    resolve: () => undefined,
  } as never)
  ctx.provide('llm', makeLlm(ctx) as never)
  await ctx.plugin(apply as unknown as Plugin, config)
  const service = ctx.get('budget') as BudgetService
  return { ctx, session, service, commands }
}

/** Config whose session cap is 10 USD with the default 0.8 warn ratio. */
const WARN_CONFIG = { budgets: { session: 10, daily: 100, monthly: 1000 }, overLimit: 'block', warnRatio: 0.8 }

/** Record 9.00 USD of deepseek-flash usage: above the warn ratio, below the hard cap. */
function reachWarn(session: Session): void {
  session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
  appendMessage(session, { inputTokens: 60_000_000, outputTokens: 0 })
}

/** One assistant/message payload with the required surface intent. */
function appendMessage(session: Session, usage: TokenUsage): void {
  const message = {
    role: 'assistant',
    content: [{ type: 'text', text: 'ok' }],
    source: { kind: 'model', provider: 'deepseek', model: 'deepseek-flash' },
    id: 'test-message-id',
  } as unknown as AssistantMessage
  session.append(
    'assistant/message',
    { turn: 1, step: 1, message, usage, stream: [] } as unknown as SessionEventMap['assistant/message'],
    { surfaceOp: 'append' },
  )
}

describe('dsh-budget assembly', () => {
  it('aggregates real session events and serves the snapshot', async () => {
    const { session, service } = await mount()
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 100_000 })
    const status = service.status()
    const sessionScope = status.scopes.find(scope => scope.scope === 'session')
    expect(sessionScope?.usedUsd).toBeCloseTo(0.15 + 0.06)
    expect(status.models[0]?.model).toBe('deepseek-flash')
    expect(status.warnRatio).toBe(0.8)
    expect(status.refreshIntervalMs).toBe(5_000)
    expect(status.days).toHaveLength(30)
    expect(status.days[status.days.length - 1]?.costUsd).toBeCloseTo(0.15 + 0.06)
  })

  it('registers the /budget command', async () => {
    const { commands } = await mount()
    expect(commands.some(command => command.name === 'budget')).toBe(true)
  })

  it('blocks the llm stream once a cap is crossed (hard block wins over the thinking rewrite)', async () => {
    const { ctx, session } = await mount({ budgets: { session: 0.1, daily: 100, monthly: 1000 }, overLimit: 'block', warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 0 }) // 0.15 USD > 0.1 cap
    const options = { provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'high' }
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', options as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) {
      chunks.push(chunk)
    }
    const finish = chunks.find((chunk): chunk is Extract<StreamChunk, { type: 'finish' }> => chunk.type === 'finish')
    expect(finish?.reason.kind).toBe('error')
    expect((finish?.reason as { failure?: { code?: string } }).failure?.code).toBe('BUDGET_BLOCKED')
    const text = chunks.filter((chunk): chunk is Extract<StreamChunk, { type: 'text-delta' }> => chunk.type === 'text-delta').map(chunk => chunk.text).join('')
    expect(text).toContain('budget blocked')
    // The hard block is unchanged: it claims the stream without rewriting the request.
    expect(options.reasoningEffort).toBe('high')
  })

  it('turns thinking off for DeepSeek requests once the warn ratio is reached', async () => {
    const { ctx, session } = await mount(WARN_CONFIG)
    reachWarn(session)
    const options = { provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'high' }
    let reached = false
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', options as never, () => {
      reached = true
      return (async function* (): AsyncGenerator<StreamChunk> {
        yield { type: 'finish', reason: { kind: 'stop' } }
      })()
    })) {
      chunks.push(chunk)
    }
    expect(reached).toBe(true)
    expect(options.reasoningEffort).toBe('off')
    expect(chunks.some(chunk => chunk.type === 'finish' && chunk.reason.kind === 'stop')).toBe(true)
  })

  it('leaves an explicit reasoningEffort "off" untouched', async () => {
    const { ctx, session } = await mount(WARN_CONFIG)
    reachWarn(session)
    let writes = 0
    const options: { provider: string; model: string; reasoningEffort: string } = { provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'off' }
    Object.defineProperty(options, 'reasoningEffort', {
      get: () => 'off',
      set: () => { writes += 1 },
      configurable: true,
    })
    for await (const _chunk of ctx.waterfall('llm/stream', options as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) { /* drain */ }
    expect(writes).toBe(0)
  })

  it('never rewrites thinking when degradeThinking is false', async () => {
    const { ctx, session } = await mount({ ...WARN_CONFIG, degradeThinking: false })
    reachWarn(session)
    const options = { provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'high' }
    for await (const _chunk of ctx.waterfall('llm/stream', options as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) { /* drain */ }
    expect(options.reasoningEffort).toBe('high')
  })

  it('leaves non-DeepSeek routes alone', async () => {
    const { ctx, session } = await mount(WARN_CONFIG)
    reachWarn(session)
    const options = { provider: 'anthropic', model: 'claude', reasoningEffort: 'high' }
    for await (const _chunk of ctx.waterfall('llm/stream', options as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) { /* drain */ }
    expect(options.reasoningEffort).toBe('high')
  })

  it('re-dispatches a frozen loop-built request with thinking off instead of mutating it', async () => {
    let seen: GenerateOptions | undefined
    const { ctx, session } = await mount(WARN_CONFIG, inner => ({
      stream: (options: GenerateOptions) => {
        seen = options
        return inner.waterfall('llm/stream', options, () => (async function* (): AsyncGenerator<StreamChunk> {
          yield { type: 'finish', reason: { kind: 'stop' } }
        })())
      },
    }))
    reachWarn(session)
    const options = Object.freeze({ provider: 'deepseek-official', model: 'deepseek-flash', messages: [], reasoningEffort: 'high' }) as unknown as GenerateOptions
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', options, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) {
      chunks.push(chunk)
    }
    expect(seen).toBeDefined()
    if (seen === undefined) return
    expect(seen).not.toBe(options)
    expect(seen.reasoningEffort).toBe('off')
    expect(chunks.some(chunk => chunk.type === 'finish' && chunk.reason.kind === 'stop')).toBe(true)
  })

  it('reports the reasoning share per model and null when the host omitted it', async () => {
    const withReasoning = await mount()
    withReasoning.session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(withReasoning.session, { inputTokens: 1_000_000, outputTokens: 100_000, reasoningTokens: 40_000 })
    const reported = withReasoning.service.status().models[0]
    expect(reported?.reasoningTokens).toBe(40_000)
    expect(reported?.outputTokens).toBe(100_000)

    const withoutReasoning = await mount()
    withoutReasoning.session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(withoutReasoning.session, { inputTokens: 1_000_000, outputTokens: 100_000 })
    expect(withoutReasoning.service.status().models[0]?.reasoningTokens).toBeNull()
  })

  it('passes the stream through when nothing is blocked', async () => {
    const { ctx, session } = await mount({ budgets: { session: 100 }, warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 100, outputTokens: 0 })
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', { provider: 'deepseek', model: 'deepseek-flash' } as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) {
      chunks.push(chunk)
    }
    expect(chunks.some(chunk => chunk.type === 'finish' && chunk.reason.kind === 'stop')).toBe(true)
  })

  it('keeps the session log free of budget audit events on fail-closed host lines', async () => {
    const { session } = await mount({ budgets: { session: 0.1, daily: 100, monthly: 1000 }, overLimit: 'block', warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-flash' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 0 })
    // The audit append is microtask-deferred past the reentrancy guard.
    await new Promise(resolve => setTimeout(resolve, 0))
    const types = session.snapshotEvents().map(event => event.type)
    // The pinned 0.1.2-alpha.2 peer line fails closed on unknown event types
    // and exposes no external registration surface, so budget/alert and
    // budget/block appends are suppressed and the alert/block trail stays in
    // the budget logger and webhook channel.
    expect(types).not.toContain('budget/alert')
    expect(types).not.toContain('budget/block')
    expect(types).not.toContain('budget/degrade')
  })
})
