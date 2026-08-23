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
import SessionStore, { SessionId, type Session } from '@deepseek-ai/dsh-session'
import type { AssistantMessage, StreamChunk, TokenUsage } from '@deepseek-ai/dsh-llm'
import type { Plugin } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { apply } from '../src/index.ts'
import type { BudgetService } from '../src/service.ts'

async function mount(config: Record<string, unknown> = {}): Promise<{ ctx: Context; session: Session; service: BudgetService; commands: Array<{ name: string }> }> {
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
  ctx.provide('llm', {} as never)
  await ctx.plugin(apply as unknown as Plugin, config)
  const service = ctx.get('budget') as BudgetService
  return { ctx, session, service, commands }
}

/** One assistant/message payload with the required surface intent. */
function appendMessage(session: Session, usage: TokenUsage): void {
  const message = {
    role: 'assistant',
    content: [{ type: 'text', text: 'ok' }],
    source: { kind: 'model', provider: 'deepseek', model: 'deepseek-chat' },
    id: 'test-message-id',
  } as unknown as AssistantMessage
  session.append('assistant/message', { turn: 1, step: 1, message, usage }, { surfaceOp: 'append' })
}

describe('dsh-budget assembly', () => {
  it('aggregates real session events and serves the snapshot', async () => {
    const { session, service } = await mount()
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-chat' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 100_000 })
    const status = service.status()
    const sessionScope = status.scopes.find(scope => scope.scope === 'session')
    expect(sessionScope?.usedUsd).toBeCloseTo(0.27 + 0.11)
    expect(status.models[0]?.model).toBe('deepseek-chat')
    expect(status.warnRatio).toBe(0.8)
    expect(status.refreshIntervalMs).toBe(5_000)
    expect(status.days).toHaveLength(30)
    expect(status.days[status.days.length - 1]?.costUsd).toBeCloseTo(0.27 + 0.11)
  })

  it('registers the /budget command', async () => {
    const { commands } = await mount()
    expect(commands.some(command => command.name === 'budget')).toBe(true)
  })

  it('blocks the llm stream once a cap is crossed', async () => {
    const { ctx, session } = await mount({ budgets: { session: 0.1, daily: 100, monthly: 1000 }, overLimit: 'block', warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-chat' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 0 }) // 0.27 USD > 0.1 cap
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', { provider: 'deepseek', model: 'deepseek-chat' } as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) {
      chunks.push(chunk)
    }
    const finish = chunks.find((chunk): chunk is Extract<StreamChunk, { type: 'finish' }> => chunk.type === 'finish')
    expect(finish?.reason.kind).toBe('error')
    expect((finish?.reason as { failure?: { code?: string } }).failure?.code).toBe('BUDGET_BLOCKED')
    const text = chunks.filter((chunk): chunk is Extract<StreamChunk, { type: 'text-delta' }> => chunk.type === 'text-delta').map(chunk => chunk.text).join('')
    expect(text).toContain('budget blocked')
  })

  it('passes the stream through when nothing is blocked', async () => {
    const { ctx, session } = await mount({ budgets: { session: 100 }, warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-chat' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 100, outputTokens: 0 })
    const chunks: StreamChunk[] = []
    for await (const chunk of ctx.waterfall('llm/stream', { provider: 'deepseek', model: 'deepseek-chat' } as never, () => (async function* (): AsyncGenerator<StreamChunk> {
      yield { type: 'finish', reason: { kind: 'stop' } }
    })())) {
      chunks.push(chunk)
    }
    expect(chunks.some(chunk => chunk.type === 'finish' && chunk.reason.kind === 'stop')).toBe(true)
  })

  it('audits alerts and blocks into the session log', async () => {
    const { session } = await mount({ budgets: { session: 0.1, daily: 100, monthly: 1000 }, overLimit: 'block', warnRatio: 0.8 })
    session.append('request/header', { header: { config: { provider: 'deepseek', model: 'deepseek-chat' } }, reason: 'initial' })
    appendMessage(session, { inputTokens: 1_000_000, outputTokens: 0 })
    // The audit append is microtask-deferred past the reentrancy guard.
    await new Promise(resolve => setTimeout(resolve, 0))
    const types = session.events.map(event => event.type)
    expect(types).toContain('budget/alert')
    expect(types).toContain('budget/block')
  })
})
