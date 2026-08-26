# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Persist daily and monthly budget buckets across restarts.

## [0.2.0] - 2026-08-23

### Changed

- The Settings budget tab now honors `config.refreshIntervalMs` for its polling interval and `config.warnRatio` for its bar tone (both were previously hardcoded), and renders a per-day usage curve over `config.historyDays`, which is now actually consumed (it previously declared a limit no code read).

## [0.1.2] - 2026-08-22

- Compatibility release for DeepSeek Harness `0.1.1-rc.2`: all `@deepseek-ai/dsh-*` devDependencies moved to rc.2 (peers unchanged at `>=0.1.0-rc.8 <0.2.0`); `dshWorkshop.compatibility.dshVersions` set to `0.1.1-rc.2`; the READMEs, AGENTS notes, and CI `compat`/`typecheck` pins synced to rc.2. No source changes required — the session/llm/typert/commands/client seams used here are unchanged in rc.2.

## [0.1.1] - 2026-08-21

- Compatibility release for DeepSeek Harness `0.1.0-rc.8`: all `@deepseek-ai/dsh-*` peers and devDependencies moved to rc.8 (peers declared as `>=0.1.0-rc.8 <0.2.0`); verified against the rc.8 harness checkout and the npm-published rc.8 type faces. No source changes required — the session/llm/typert/commands/client seams used here are unchanged in rc.8.

## [0.1.0] - 2026-08-16

- Initial release: aggregated token/cost metering, budget caps with threshold alerts and over-limit policies, carbon footprint estimation, per-model latency benchmarks, and the /budget command.

### Added

- Aggregated token/cost metering per model, session, and day from the `session/event` stream (`assistant/message` usage with `request/header` provider/model attribution), priced through the built-in USD-per-1M table merged with `config.prices`.
- Session/daily/monthly budget caps with warn-ratio threshold alerts (webhook POST + desktop-notification flag) and alert/block/degrade over-limit policies; `block`/`degrade` short-circuit the `llm/stream` waterfall with a corrective error finish (loop-built requests are frozen and cannot be rewritten, so `degrade` names the target model instead).
- Carbon footprint estimation via the token→carbon bridge (tokens × kWh/token × PUE × regional intensity).
- Per-model latency statistics with p50/p95 aggregation over a bounded window.
- `budget` Typert Remote namespace (`budget/status`, `budget/setSettings`, `budget/unblock`) + the browser Settings tab (usage bars, model breakdown, alerts, cap editors, unblock).
- `/budget` command (overview, `models`, `unblock <scope>`).
- `budget/alert` and `budget/block` session audit events (microtask-deferred past the session-append reentrancy guard).

### Ported (upstream assets, Apache-2.0 — see THIRD_PARTY_NOTICES.md)

- LLM-Cost-Estimator-CN: price table (CNY per 1k, verbatim) and cost formulas → `src/estimate/models.ts`, `src/estimate/cost.ts`; operational USD table in `src/estimate/prices.ts`.
- Mode-Latency-Benchmark: benchmark vocabulary and percentile statistics → `src/estimate/latency-stats.ts`.
- AI-Carbon-Footprint-Calculator: GPU/region/PUE data and formulas + equivalences → `src/estimate/carbon.ts`.
