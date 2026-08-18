/**
 * Real Loader composition + built-artifact suite (community five-layer model,
 * layer 4). An independent process mounts the vendored Loader over a
 * cordis.yml with the real session service row + the plugin row + config,
 * proving module unwrapping, inject resolution, and config schema application.
 * It also carries the invalid-config regressions against the built
 * `lib/index.js`.
 * @module dsh-budget/tests/composition.spec
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runner = join(repositoryRoot, 'scripts', 'loader-runner.mjs')
const builtEntry = join(repositoryRoot, 'lib', 'index.js')

/** One cordis.yml: the real session row, then the plugin row with config. */
function configFor(pluginRow: string, configLines: string[] = []): string {
  return [
    "- name: '@deepseek-ai/dsh-session'",
    `- name: ${JSON.stringify(pluginRow)}`,
    ...(configLines.length > 0 ? ['  config:', ...configLines.map(line => `    ${line}`)] : []),
    '',
  ].join('\n')
}

function run(command: string, args: string[], cwd: string, shell = false, timeout = 120_000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env },
    timeout,
    shell,
  })
  if (result.error !== undefined) throw result.error
  return { status: result.status, stdout: result.stdout, stderr: result.stderr }
}

const temporaryRoot = mkdtempSync(join(tmpdir(), 'dsh-budget-loader-'))

beforeAll(() => {
  const build = run('pnpm', ['run', 'build'], repositoryRoot, process.platform === 'win32')
  if (build.status !== 0) {
    throw new Error(`pnpm run build failed (${String(build.status)})\nstdout:\n${build.stdout}\nstderr:\n${build.stderr}`)
  }
}, 180_000)

afterAll(() => {
  rmSync(temporaryRoot, { recursive: true, force: true })
})

describe('real Loader composition', () => {
  it('mounts the budget service and applies the currency config through the Loader', () => {
    const configPath = join(temporaryRoot, 'valid.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, [
      'currency:',
      '  code: EUR',
      '  rate: 2.0',
      '  decimals: 3',
    ]))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `stdout:\n${evidence.stdout}\nstderr:\n${evidence.stderr}`).toBe(0)
    expect(evidence.stdout).toMatch(/DSH_LOADER_RESULT/u)
    const marker = evidence.stdout.match(/DSH_LOADER_RESULT (.+)$/mu)
    expect((JSON.parse(marker![1]!) as { currency: string }).currency).toBe('EUR')
  })

  it('rejects a negative price input through the Loader schema', () => {
    const configPath = join(temporaryRoot, 'invalid-prices.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, [
      'prices:',
      '  gpt-4o:',
      '    input: -1',
      '    output: 1',
    ]))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `invalid config unexpectedly mounted:\n${evidence.stderr}`).not.toBe(0)
  })

  it('rejects an out-of-range warnRatio through the Loader schema', () => {
    const configPath = join(temporaryRoot, 'invalid-warn-ratio.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, ['warnRatio: 1.5']))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `invalid config unexpectedly mounted:\n${evidence.stderr}`).not.toBe(0)
  })
})
