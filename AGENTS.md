# AGENTS.md

Standalone DeepSeek Harness plugin repository (`dsh-budget`). Development follows the dsh-plugin-guide skill and the official plugin contract; this file records repo-local decisions.

## Layout

- `src/index.ts` — function-plugin contract (`name`/`inject`/`Config`/`apply`; NO default export). Injects `sessions` (the bundle patch declares `inject: [sessions]`); `commands`, `tools`, and `llm` are read as OPTIONAL services (`ctx.get` + fail closed).
- `src/config.ts` — Schemastery schema + explicit `resolveConfig` (no hidden `?? default`); object defaults are COMPLETE objects (the Schemastery `default(value: T)` argument requires every field of `ObjectT`), union-of-null uses `z.union([...z.const(null)]).default(null)` — the `.nullable()` API no longer exists in 3.18.x.
- `src/aggregate/usage.ts` — `BudgetAggregator`: pure accounting (session/day/month buckets, per-model usage, latency windows, alerts, blocked scopes) with an injected clock for tests.
- `src/governance.ts` — cap checks, warn/over transitions, cooldown gating, block/degrade decisions, and the sanitized webhook sender.
- `src/service.ts` — `BudgetService` (`TypertRemoteService`, namespace `budget`): `status` / `setSettings` (session-scoped runtime caps and switches — never a config-file write) / `unblock`.
- `src/wire.ts` — the snapshot vocabulary, its zod v4 wire schema, and the three invocation descriptors shared verbatim by `src/typert.host.ts` and `src/client/remote.ts`.
- `src/command.ts` — the `/budget` command (standard `CommandResult`; `command/run` + `command/done` log the invocation).
- `src/client/` — browser half: `$mount` the Remote contribution, register the `settings.plugins.tab` entry id `budget`, pure presenter in `present.ts`, inline scoped stylesheet in `styles.ts` (standalone bundles cannot use the in-repo CSS-module pipeline).
- `tests/` — vitest; REAL `Context` + REAL `SessionStore`/`Session` from the `0.1.1-rc.2` peers; scripted `commands`/`llm` stand-ins (the plugin reads them as optional services); the estimate layer carries upstream fixture numbers as regressions.

## Hard rules applied here

- **Seam-verified behavior** (rc.2 + local checkout): usage arrives as `assistant/message` events (`usage?: TokenUsage`, disjoint cache buckets); attribution comes from the latest `request/header` (`header.config.provider`/`model`); blocking happens on the `llm/stream` waterfall — loop-built requests are deep-frozen and MAY NOT be rewritten, so `degrade` cannot swap the model mid-request; it short-circuits with a corrective error finish naming the degraded model. Pass-through paths always call `next()`; the short-circuit is a deliberate claim.
- **Session appends are reentrancy-guarded** ("cannot reenter while another append is being published"): the budget checks run inside the `session/event` callback, so the audit append is microtask-deferred. Two-argument append (rc.2 has no append-envelope option).
- **Model-visible ⟺ logged**: the only model-visible content is the `/budget` output and the corrective block text; both are reconstructable from `command/run` + `budget/alert` + `budget/block` events on harnesses before `0.1.2-alpha.1`. From `0.1.2-alpha.1` the audit events are suppressed (fail-closed session event vocabulary, no external registration surface) and the trail degrades to the budget logger and webhook.
- **No fabrication**: a block never invents model output; it yields an error finish with the budget message.
- **Fail loud**: invalid prices, webhook URLs, ratios, regions, and bounds throw at mount.
- **Sanitized surfaces**: webhook URLs are credential-stripped before any log; amounts are plain numbers; nothing else leaves the host.
- **Audit event gate**: `budget/alert` + `budget/block` appends are gated by the installed `@deepseek-ai/dsh-session` line version (`auditAppendsAllowed` in `src/events.ts`): pre-0.1.2-alpha.1 lines keep writing; 0.1.2-alpha.1+ suppress and log the degradation reason.

## Config

Schema in `src/config.ts`; `cordis.patch.yml` documents the same keys; the five-language READMEs carry the user-facing table. `package.json#dshWorkshop` is the omdsh-workshop-package/v1 intake manifest (declarations only — evidence paths stay null until their adapter runs).

## Build

`typescript` + `tsdown` are regular `dependencies` (the git channel's `prepare` builds with production dependencies alone). `scripts/prepare.mjs` wipes `lib/`, emits tsc declarations into `lib/types`, then runs tsdown (tsdown `clean` stays OFF so the declarations survive). `pnpm-workspace.yaml` declares `allowBuilds: { esbuild: true }`.

## Checks

`pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm pack`. The plain `typecheck` resolves the local harness checkout's type faces through tsconfig `paths`; `typecheck:ci` resolves the npm-published `0.1.1-rc.2` faces (no paths) and is what CI runs — keep both green.

## Release

`node scripts/release.mjs <x.y.z>` bumps `package.json`, stamps the CHANGELOG `[Unreleased]` section, re-runs the gate, commits, and tags `v<x.y.z>` locally — never pushes. Push with `git push origin main --follow-tags`; the release workflow then gates again, publishes npm with provenance (secret `NPM_TOKEN`), and creates the GitHub Release from the CHANGELOG section.

## Docs

- Five-language READMEs (`README.md`, `README.zh.md`, `README.es.md`, `README.pt.md`, `README.hi.md`) — keep all five in sync; the English file is the source of truth.
- GitHub topics mirror `package.json` keywords: `dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`.
- `THIRD_PARTY_NOTICES.md` records the three ported upstream assets (Apache-2.0).
