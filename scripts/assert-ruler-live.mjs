#!/usr/bin/env node
// Assert the dual rulers are live: compiling scripts/ruler-canary.ts against
// the current type line must FAIL (the canary references alpha.1-only
// symbols). A green compile means a ruler measures a stale alpha.1 face.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const tsc = join(root, 'node_modules', 'typescript', 'lib', 'tsc.js')
const r = spawnSync(process.execPath, [tsc, '-p', 'tsconfig.canary.json', '--noEmit'], {
  cwd: root,
  encoding: 'utf8',
})
const out = `${r.stdout ?? ''}\n${r.stderr ?? ''}`
const symbolHits =
  (out.match(/DEFAULT_PROFILE_PATCH_RELOAD/g) ?? []).length +
  (out.match(/watchUserPatches/g) ?? []).length
if (r.status !== 0 && symbolHits >= 2) {
  console.log('ruler-live: canary correctly fails against the current type line')
  process.exit(0)
}
console.error('ruler-stale: canary compiled (stale alpha.1 face) or failed unexpectedly')
console.error(out)
process.exit(1)
