#!/usr/bin/env node
/**
 * Release automation for dsh-budget.
 *
 * Usage: node scripts/release.mjs <version> [--skip-gate]
 *
 * Steps: validate <version> and a clean tree; write the version into
 * package.json; stamp the `## [Unreleased]` CHANGELOG section into
 * `## [<version>] - <UTC date>`; run the full gate; commit
 * `chore(release): <version>` and tag `v<version>`. Never pushes.
 *
 * @module dsh-budget/scripts/release
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

const version = process.argv[2]
const skipGate = process.argv.includes('--skip-gate')
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) {
  console.error(`usage: node scripts/release.mjs <x.y.z> [--skip-gate] (got: ${version ?? 'none'})`)
  process.exit(1)
}

/** Run one command with inherited stdio; throws on non-zero exit. */
function run(command, args) {
  console.error(`\n> ${command} ${args.join(' ')}`)
  execFileSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
}

function git(...args) {
  return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim()
}

if (git('status', '--porcelain') !== '') {
  console.error('working tree is not clean; commit or stash before releasing')
  process.exit(1)
}

const packagePath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
if (pkg.version === version) {
  console.error(`package.json already at ${version}; nothing to do`)
  process.exit(1)
}
pkg.version = version
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)

const changelogPath = resolve(root, 'CHANGELOG.md')
let changelog = readFileSync(changelogPath, 'utf8')
const unreleased = '## [Unreleased]'
if (!changelog.includes(unreleased)) {
  console.error(`CHANGELOG.md has no ${unreleased} section; add one with the release entries first`)
  process.exit(1)
}
const date = new Date().toISOString().slice(0, 10)
changelog = changelog.replace(unreleased, `## [${version}] - ${date}`)
writeFileSync(changelogPath, changelog)

try {
  if (!skipGate) {
    run('pnpm', ['run', 'typecheck'])
    run('pnpm', ['run', 'typecheck:ci'])
    run('pnpm', ['test'])
    run('pnpm', ['run', 'build'])
    run('pnpm', ['run', 'verify:self-contained'])
    run('pnpm', ['run', 'verify:artifacts'])
  } else {
    console.error('--skip-gate: skipping the gate suite (not recommended)')
  }
} catch (error) {
  console.error(`gate failed: ${error instanceof Error ? error.message : String(error)}`)
  console.error('reverting the version bump and changelog stamp')
  git('checkout', '--', 'package.json', 'CHANGELOG.md')
  process.exit(1)
}

git('add', 'package.json', 'CHANGELOG.md')
git('commit', '-m', `chore(release): ${version}`)
git('tag', '-a', `v${version}`, '-m', `dsh-budget v${version}`)

console.error(`
released locally: commit + tag v${version}
next: git push origin main --follow-tags
`)
