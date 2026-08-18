/**
 * Webhook transport suite: a sealed local `node:http` server exercises the
 * success, HTTP-failure, and timeout paths of `sendWebhook` without any
 * external endpoint. The timeout path proves the alert POST cannot hang the
 * hot path past `webhookTimeoutMs`.
 * @module dsh-budget/tests/webhook.spec
 */

import { createServer } from 'node:http'
import type { Server } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { sendWebhook } from '../src/governance.ts'

const servers: Server[] = []
afterEach(async () => {
  for (const server of servers.splice(0)) {
    await new Promise<void>(resolve => server.close(() => resolve()))
  }
})

/** Start a fake server, running `handler` per request; returns its base URL. */
function startServer(handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void): Promise<string> {
  const server = createServer(handler)
  servers.push(server)
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (address === null || typeof address === 'string') throw new Error('fake server bound to no port')
      resolve(`http://127.0.0.1:${address.port}`)
    })
  })
}

const logger = { warn: () => {} }

describe('sendWebhook', () => {
  it('reports success for a 2xx answer', async () => {
    const base = await startServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('{}')
    })
    const result = await sendWebhook(`${base}/hook`, { scope: 'session' }, 5_000, logger)
    expect(result).toEqual({ ok: true })
  })

  it('reports the HTTP status for a non-2xx answer', async () => {
    const base = await startServer((_req, res) => {
      res.writeHead(500)
      res.end('boom')
    })
    const result = await sendWebhook(`${base}/hook`, { scope: 'session' }, 5_000, logger)
    expect(result.ok).toBe(false)
    expect(result.error).toContain('HTTP 500')
  })

  it('aborts a slow server at the configured timeout instead of hanging', async () => {
    const base = await startServer((_req, res) => {
      // Hold the response open far beyond the timeout; the abort must win.
      setTimeout(() => { res.writeHead(200); res.end('late') }, 2_000)
    })
    const started = Date.now()
    const result = await sendWebhook(`${base}/hook`, { scope: 'session' }, 100, logger)
    expect(result.ok).toBe(false)
    expect(Date.now() - started).toBeLessThan(1_000)
  })
})
