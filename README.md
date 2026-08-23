<div align="center">

# 💰 dsh-budget
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-budget)

**Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel.**

*Know what every session costs — before it costs you.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-budget/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-budget/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-budget?label=version)](https://github.com/PerryLink/dsh-budget/releases)
[![npm version](https://img.shields.io/npm/v/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![npm downloads](https://img.shields.io/npm/dm/dsh-budget)](https://www.npmjs.com/package/dsh-budget)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Surfaces | Host + Web client (Settings budget tab); `/budget` command |

## What you get

`dsh-budget` turns the session event stream into a four-in-one cost governance loop:

- **Aggregated metering** — tokens (uncached input / output / cache read / cache write), estimated USD cost, and carbon footprint per model, session, and day, priced through a built-in USD-per-1M table merged with your `config.prices`.
- **Budget governance** — session/daily/monthly caps; a warn-ratio threshold alert (webhook POST + desktop-notification flag) and three over-limit policies: `alert` (notify only), `block` (short-circuit new model requests until the user lifts the block), `degrade` (block with corrective guidance naming the cheaper model from your `degradation` map).
- **Carbon & latency** — token→carbon bridge (tokens × kWh/token × PUE × regional grid intensity, ported from AI-Carbon-Footprint-Calculator) and per-model latency percentiles.
- **Surfaces** — the Settings budget tab (usage bars, per-day usage curve, model breakdown, alerts, cap editors, unblock buttons) and the `/budget` command (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-budget

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Then ask the agent: `/budget` — and watch the Settings tab fill in.

## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-budget`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-budget`.

> If pnpm reports `ERR_PNPM_IGNORED_BUILDS` for this package (esbuild's harmless platform-binary validation), add `allowBuilds: { esbuild: true }` to your `pnpm-workspace.yaml` — the `dsh` CLI prints the exact snippet.

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). `cordis.patch.yml` documents each key inline.

| Key | Default | Meaning |
|---|---|---|
| `prices` | `{}` | Per-model USD prices per 1M tokens, merged over the built-in table |
| `defaultPrice` | `{input: 1.0, output: 3.0}` | Fallback for models absent from both tables |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | Budget caps in USD per scope; omit for unlimited |
| `warnRatio` | `0.8` | Alert once usage reaches this fraction of a cap (0..1) |
| `overLimit` | `alert` | `alert` / `block` / `degrade` after a cap is crossed |
| `degradation` | `{}` | Model id → cheaper model id of the same provider |
| `webhookUrl` | *(none)* | Optional webhook URL for threshold alerts (POST JSON) |
| `webhookTimeoutMs` | `5000` | Webhook request timeout |
| `alertsEnabled` | `true` | Master switch for threshold alerts |
| `alertCooldownMs` | `3600000` | Minimum ms between two alerts of the same scope |
| `desktopNotifications` | `false` | Browser desktop notifications while the tab is open |
| `refreshIntervalMs` | `5000` | Settings tab polling interval |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | Carbon bridge (regions: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | Per-model latency percentiles and their window |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | Display currency (costs are computed in USD) |
| `outputLanguage` | `en` | `/budget` output language: `en` / `zh` |
| `historyDays` | `30` | Per-day usage history kept in the panel snapshot |

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `/budget` | Command | Per-scope overview (usage, ratio, carbon, blocked state) |
| `/budget models` | Command | Per-model breakdown with latency percentiles |
| `/budget unblock <scope>` | Command | Lift a blocked scope (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Settings tab | Usage bars, per-day usage curve, model breakdown, alerts, cap editors, unblock buttons |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | The client channel (the tab consumes these) |

## Permissions & data

- **Permissions**: `network:outbound` (the optional alert webhook only), `session:append` (audit events), `native-code:none`.
- **Data**: everything displayed comes from the session event stream; the only host-side network call is the configured webhook, whose URL is validated at load and credential-stripped before any log. No prompts or payloads ever leave the host.
- **Session log**: `budget/alert` and `budget/block` are log-only audit events carrying scope names and USD amounts (microtask-deferred past the session-append reentrancy guard).

## Security boundaries

- **No fabrication**: a budget block yields a corrective error finish on the `llm/stream` waterfall — the plugin never invents model output.
- **No request rewriting**: loop-built requests are frozen; `degrade` therefore names the target model in the corrective message instead of swapping the request.
- **Fail loud**: invalid prices, URLs, ratios, regions, and bounds fail the mount.
- **Honest scope**: runtime edits from the panel are session-scoped; a reload restores the cordis.yml values.

## Known limitations

- Aggregation is process-local: usage resets when the harness restarts (per-day/per-month buckets rebuild from the current session log view).
- `block`/`degrade` rely on the `llm/stream` waterfall; harness builds without that seam cannot block requests (alerts still work).
- Built-in prices drift; override entries via `config.prices`.

## Development

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests against the local harness checkout
pnpm run typecheck:ci  # tsc against the published 0.1.1-rc.2 types (no paths)
pnpm test           # vitest
pnpm run build      # tsc declarations + tsdown bundles (lib/)
pnpm run verify:self-contained  # dependency specs resolve from the registry
pnpm run verify:artifacts       # built ESM face + typert manifest + client bundle
pnpm pack           # the published tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creator and maintainer: aggregation, budget governance, carbon and latency ports, the Settings tab, and the five-language docs.

## PerryLink DSH Plugin Family

This project is one of the [29 DeepSeek Harness plugins](https://github.com/PerryLink) maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

| Plugin | One-liner |
|---|---|
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | Second-model auto-review on the approval chain, fail-closed by default |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Durable background child agents with a Web UI sidebar, messaging and interrupt |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH |
| [dsh-click](https://github.com/PerryLink/dsh-click) | Cross-platform native desktop control for DeepSeek Harness — Windows first. |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Terminal-style input history for the web composer: arrows, Ctrl+R search |
| [dsh-defend](https://github.com/PerryLink/dsh-defend) | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | Engineering-discipline guard: requirements grill, test gates, adversary review |
| [dsh-draw](https://github.com/PerryLink/dsh-draw) | Unified static-image generation routing for DeepSeek Harness. |
| [dsh-fast](https://github.com/PerryLink/dsh-fast) | Read-only performance diagnostics for DeepSeek Harness. |
| [dsh-github](https://github.com/PerryLink/dsh-github) | GitHub PR/issues integration for DSH, every write gated by approval |
| [dsh-library](https://github.com/PerryLink/dsh-library) | Local document knowledge base for DeepSeek Harness. |
| [dsh-local-ai](https://github.com/PerryLink/dsh-local-ai) | Local-model (Ollama) integration for DeepSeek Harness. |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | LSP diagnostics, formatting, completion, code actions and rename over language servers |
| [dsh-mask](https://github.com/PerryLink/dsh-mask) | PII masking middleware for DeepSeek Harness — anonymize personal data before it reaches the model, restore it at the display layer. |
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |
| [dsh-observe](https://github.com/PerryLink/dsh-observe) | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-equivalent runtime style switching |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-style declarative allow/deny/ask permission rules with audit |
| [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) | Plugin-development knowledge base as an on-demand agent skill |
| [dsh-score](https://github.com/PerryLink/dsh-score) | Multi-dimensional quality scoring for DeepSeek Harness plugins. |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Pin sessions in the Web sidebar with durable ordering |
| [dsh-session-sync](https://github.com/PerryLink/dsh-session-sync) | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | Security-audit skill pack: secret scan, dependency and supply-chain review |
| [dsh-talk](https://github.com/PerryLink/dsh-talk) | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |
| [dsh-test-drive](https://github.com/PerryLink/dsh-test-drive) | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |
| [dsh-translate](https://github.com/PerryLink/dsh-translate) | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
