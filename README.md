<div align="center">

# 💰 dsh-budget
- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-budget` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-budget)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-budget?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-budget?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-budget/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-budget)

**Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel.**

*Know what every session costs — before it costs you.*

> **Official repository.** This is the only official repository of dsh-budget, maintained by PerryLink. Same-name repositories under other accounts are not affiliated.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-budget.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-budget/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-budget/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-budget?label=version)](https://github.com/PerryLink/dsh-budget/releases)
[![npm version](https://img.shields.io/npm/v/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![npm downloads](https://img.shields.io/npm/dm/dsh-budget)](https://www.npmjs.com/package/dsh-budget)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-budget
```


</div>

---

**📖 Ecosystem knowledge base** — measured data, not marketing: [plugin development guide · plugin-selection data · maintenance criteria](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add github:PerryLink/dsh-budget` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-budget`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-budget`.

> If pnpm reports `ERR_PNPM_IGNORED_BUILDS` for this package (esbuild's harmless platform-binary validation), add `allowBuilds: { esbuild: true }` to your `pnpm-workspace.yaml` — the `dsh` CLI prints the exact snippet.

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（95 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.


## What is dsh-budget?

Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel.

Know what every session costs — before it costs you.

![Terminal demo of dsh-budget: dsh-budget — install, then /budget and /budget models](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-hero.png)

![Animated terminal demo of dsh-budget](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-demo.gif)

*The same run, animated.*

## Maintenance status: 🧊 FROZEN

> **Frozen on 2026-10-05. No new features.** This package still works, and it is not retired — but it no longer receives feature work. Only a genuine breakage will be fixed.

Maintainers treat this capability as one where **better-adopted alternatives now exist**, so effort has moved elsewhere. The comparison below was measured on 2026-10-05 and is recorded so nobody has to redo it.

| | package | weekly downloads |
|---|---|---|
| **this package** | `dsh-budget` | 1,079 |
| better-adopted alternative | [`dsh-cost-meter`](https://github.com/Han-1413141/dsh-cost-meter) | **33,526** |
| another alternative | `dsh-usage-stats` | not measured |
| another alternative | `@dougen/dsh-deepseek-usage` | 6,019 |

**Why the alternative leads.** `dsh-cost-meter` provides a 170+ model price catalog with automatic matching, and Coding-Plan quota lookup for 11 providers.

**Compatibility.** Its declared dsh peer range admits the 0.2.x line, so it loads on current hosts.

👉 **For new work, prefer dsh-cost-meter.** Existing installs keep working unchanged; nothing is being removed.

*Full evidence, including the host-version compatibility matrix: `dsh-plugin-supersession-review-20261005.md`.*

## Comparison

![Measured comparison chart for dsh-budget](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (GitHub tag, adapted 2026-09-24; peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`): the alpha.2 catalog prices are built into the price table and unknown models surface as unpriced instead of a fabricated estimate; the audit gate keeps suppressing `budget/alert`/`budget/block` appends (fail-closed session event vocabulary). Verified 2026-09-24 by the two-ruler typecheck chain and the full local gate; the browser-panel items stay 人工·未测即未完成 (maintainer manual checklist). |

| Audit events | Written on harnesses before `0.1.2-rc.1`; suppressed with a logged degradation reason on `0.1.2-rc.1` and later (fail-closed session event vocabulary, no external registration surface) || Node | `^22.19.0 \|\| >=24.0.0` |
| Surfaces | Host + Web client (Settings budget tab); `/budget` command |

## What you get

`dsh-budget` turns the session event stream into a four-in-one cost governance loop:

- **Aggregated metering** — tokens (uncached input / output / cache read / cache write), estimated USD cost, and carbon footprint per model, session, and day, priced through a built-in USD-per-1M table merged with your `config.prices`.
- **Budget governance** — session/daily/monthly caps; a warn-ratio threshold alert (webhook POST + desktop-notification flag) and three over-limit policies: `alert` (notify only), `block` (short-circuit new model requests until the user lifts the block), `degrade` (block with corrective guidance naming the cheaper model from your `degradation` map).
- **Carbon & latency** — token→carbon bridge (tokens × kWh/token × PUE × regional grid intensity, ported from AI-Carbon-Footprint-Calculator) and per-model latency percentiles.
- **Surfaces** — the Settings budget tab (usage bars, per-day usage curve, model breakdown, alerts, cap editors, unblock buttons) and the `/budget` command (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-budget
```

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add github:PerryLink/dsh-budget

# or from npm (published releases)
dsh plugin --profile web add dsh-budget

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Then ask the agent: `/budget` — and watch the Settings tab fill in.

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). `cordis.patch.yml` documents each key inline.

| Key | Default | Meaning |
|---|---|---|
| `prices` | `{}` | Per-model USD prices per 1M tokens, merged over the built-in table |
| `defaultPrice` | unpriced signal (`priced: false`, zero numbers) | Fallback for models absent from both tables: the default contributes 0 to accounting and surfaces as "unpriced"; set numbers with `priced: true` to price unknown models explicitly |
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
| `persistence.enabled` / `intervalMs` | `true` / `10000` | Durable day/month persistence across restarts (storage domain); degrades to in-memory when the domain is absent |

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
- **Session log**: `budget/alert` and `budget/block` are log-only audit events carrying scope names and USD amounts (microtask-deferred past the session-append reentrancy guard). On harnesses `0.1.2-rc.1` and later they are not written — the fail-closed event vocabulary rejects logs with unregistered event types and offers no external registration surface — so the audit trail degrades to the budget logger and webhook only.

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
pnpm run typecheck:ci  # tsc against the published types (no paths)
pnpm test           # vitest
pnpm run build      # tsc declarations + tsdown bundles (lib/)
pnpm run verify:self-contained  # dependency specs resolve from the registry
pnpm run verify:artifacts       # built ESM face + typert manifest + client bundle
pnpm pack           # the published tarball
```

## Interoperability with other DSH plugins

Verified against **DSH `0.2.0-rc.2`** (the runtime this README ships for) and the high-star plugin set surveyed on 2026-10-05.

This plugin **does not interfere** with other plugins, including the widely installed high-star ones:

- **No tool-name collision.** Every tool is namespaced; no bare name owned by a shipped tool or another plugin is registered.
- **No service-key collision.** It provides `budget`; that key is not a built-in seam and is not provided by any surveyed high-star plugin.
- **No slot collision.** It registers no client slot key, so it cannot contend for a `shadows-shipped-ui` seat.
- **No HTTP route collision.** It registers no `webServer` prefix.
- **No patch-layer collision.** The bundle patch only `insert`s its own row; it never overrides a built-in row's `config`.
- **No global mutation.** It does not patch prototypes, rewrite `process.env`, or replace the global fetch dispatcher.

**Shared event listeners are non-interfering by construction.** It observes the ordering-sensitive event `llm/stream` with `ctx.on()` — Cordis's broadcast registration, where every listener runs and none can starve another. **Every listener here delegates through `next()`**, so the chain is never short-circuited, and a mutation is applied to the value `next()` produced rather than returned in its place:
  - `llm/stream` — also used by `dsh-routing-suite` (7000★).

Static evidence: `dsh-plugin-doctor` K10–K13 report `pass` for every check on this repository.

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creator and maintainer: aggregation, budget governance, carbon and latency ports, the Settings tab, and the five-language docs.

## PerryLink DSH Plugin Family

This project is part of the DeepSeek Harness plugin family from [PerryLink](https://github.com/PerryLink). The roster stays collapsed below so every README keeps a short first screen; expand it to see every row and its status.

<details>
<summary>Expand all plugins</summary>

| Plugin | Status |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 FROZEN — see the repo README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 FROZEN — see the repo README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 FROZEN — see the repo README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 FROZEN — see the repo README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 FROZEN — see the repo README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRED — see the repo README |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRED — see the repo README |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRED — see the repo README |

</details>## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
