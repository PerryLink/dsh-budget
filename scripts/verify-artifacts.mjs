// Verify the built artifacts after `pnpm run build`: syntax-check the host
// bundle, import it under plain Node, and assert the shipped files. Guards
// against TypeScript-only syntax leaking into shipped output and against a
// tarball missing a declared face.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const required = [
  'lib/index.js',
  'lib/typert.host.js',
  'lib/client.js',
  'lib/types/index.d.ts',
  'cordis.patch.yml',
]
for (const rel of required) {
  if (!existsSync(path.join(root, rel))) throw new Error(`missing artifact: ${rel}`)
}

// 1. Syntax-check the host bundle (plain Node parse; no execution).
execFileSync(process.execPath, ['--check', path.join(root, 'lib/index.js')], { stdio: 'inherit' })

// 2. The ESM host face must import under plain Node (no tsx, no checkout paths).
const index = await import(pathToFileURL(path.join(root, 'lib/index.js')).href)
if (typeof index.apply !== 'function' || index.name !== 'dsh-budget') {
  throw new Error('lib/index.js exports an unexpected plugin face')
}

// 3. The typert manifest must carry the budget invocations.
const typert = await import(pathToFileURL(path.join(root, 'lib/typert.host.js')).href)
if (typert.TYPERT?.package !== 'dsh-budget' || !Array.isArray(typert.TYPERT?.invocations) || typert.TYPERT.invocations.length < 3) {
  throw new Error('lib/typert.host.js exports an unexpected TYPERT manifest')
}

console.log('artifacts OK: syntax + ESM import + typert manifest + shipped faces present')
