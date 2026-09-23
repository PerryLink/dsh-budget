# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.10] - 2026-09-23

### Fixed

- Add the alpha.2 catalog prices to the built-in table (`deepseek-flash` / `deepseek-v4-flash` / `deepseek-v4-flash-vision-exp` at 0.15/0.60/0.003/0.15 USD per 1M and `deepseek-v4-pro` at 0.66/1.98/0.022/0.66, off-peak, verified against the official pricing page on 2026-09-18). Before this release the table had ZERO overlap with the alpha.2 model catalog, so every catalog model fell back to the silent 1.0/3.0 default and was overestimated by 23.7×–64.4× on a session basis and 87×–213× on a monthly basis (both figures are correct; the ~100% gap comes from the load mix), which made `overLimit: 'block'` with a $10 session cap kill a session after ~$0.05 of real flash spend.
- Replace the silent fallback estimate with an unpriced signal: a model with no price entry and no explicitly priced `defaultPrice` now contributes 0 to budget accounting (its cost is no longer a fabricated number), warns once per provider/model in the budget logger, and surfaces as "unpriced" in `/budget` and the settings panel. Third-party model costs change from a fabricated number to explicitly unknown; set `defaultPrice` with `priced: true` to price them.
- Hold the persistence storage domain in one effect: the bare `await storageDomain.open(...)` before every registration could leave the plugin half-mounted when an unload landed during the async open (A02). The effect registers first and owns the open promise in its closure; the disposer flushes and closes the domain exactly once it resolves.
- Derive the client's current session from `retainedBy.mainView` instead of the deleted `SessionListState.current` leaf (B5): session-scope attribution no longer silently degrades to unbound, and the panel shows a visible "no current session bound" notice when the face is absent.
- Own the injected style node across reload races: the duplicate-found branch previously returned a no-op disposer and stranded the tab stylesheet.

### Changed

- Carry both Typert strict-codec faces on the wire descriptors: the published `schema` field (0.1.5-rc.2 line) and the `create` factory the 0.1.6-alpha.1 checkout materializes lazily on first use. Both typecheck rulers stay green.
- Move the `@deepseek-ai/dsh-*` dev/test pins to the published `0.1.7-alpha.2` line and record `0.1.7-alpha.2` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now installs the `0.1.7-alpha.2` host (`dsh-base` + `dsh-headless`) instead of `0.1.6-alpha.2`, and the five READMEs state that line as the verified one.
- Append the fourth host clause `|| >=0.1.7-0 <0.2.0` to `engines.dsh` and to all eleven `@deepseek-ai/dsh-*` peer ranges. Under semver's prerelease rule a range whose only prerelease comparators sit on earlier tuples cannot admit a later alpha, so the three-clause band excluded the very host line this release targets. No previously supported host line is dropped.
- Raise the `@deepseek-ai/cordis` dev/test pin to `^4.0.4`.
- Declare `dsh.manifestVersion: 1` and the four-clause `engines.dsh` range (G-3).

### Docs

- Correct `AGENTS.md`: the `tests/` layout entry and the `Checks` ruler note still named `0.1.5-rc.2` as the line this repo's installed peers and `typecheck:ci` measure against.

## [0.4.9] - 2026-09-12

### Changed

- Rename the four translated READMEs to `README-<lang>.md`. npm selects the package-page readme as the first markdown file matching its `{README,README.*}` glob (`@npmcli/package-json`, publish path), and that glob order puts `README.<lang>.md` ahead of `README.md` — so npm was serving the Simplified-Chinese file for this package too (measured on 15/15 sampled packages of the family). The new names sit outside the glob, so the English source is served again. No content changed apart from the language-switcher link each translation holds to its siblings, and the repo readme gate still passes. Takes effect with the next release; an already-published version cannot gain a corrected readme retroactively.
- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.2` line and record `0.1.5-rc.2` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.2`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

## [0.4.8] - 2026-09-10

### Changed

- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.1` line and record `0.1.5-rc.1` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.1`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-rc.1` (verified 2026-09-10).

## [0.4.7] - 2026-09-09

### Changed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` and pin the dev/test dependencies to the published `0.1.5-alpha.1` line: adaptation to DeepSeek Harness `dsh-v0.1.5-alpha.1` (session format V3, `ctx.agent` removal, `Inbox` type-only interface); runtime behavior is unchanged for every supported host line.
- Record `0.1.5-alpha.1` in `dshWorkshop.compatibility.dshVersions`.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-alpha.1` (verified 2026-09-09).

## [0.4.6] - 2026-09-07

### Fixed

- Restore the five-language READMEs from the GBK mojibake introduced by the family-section refresh, rebuild the family table to the 37-plugin state, and fix the DSH plugin badge URL; no behavior change.

### Docs

- Fix the DSH plugin badge URL: shields.io rejects the four-segment static badge form with "404 badge not found"; the label now uses the documented double-dash form (`dsh--plugin`), rendering identically; no behavior change.

## [0.4.5] - 2026-09-07

### Fixed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0`: the older `>=0.1.0-rc.8 <0.2.0` band resolved to only the `0.1.0-rc.8` prerelease under registry-driven resolution and broke fresh tarball installs; no behavior change.

### Docs

- Refresh the five-language README support-version wording: the verified GitHub tag `dsh-v0.1.3-alpha.1` now leads the compatibility claim, while npm `0.1.2-rc.1` stays the published dependency-pin line (peers `>=0.1.2-rc.1 <0.2.0`); no behavior change.


## [0.4.4] - 2026-09-04

### Changed

- Align the devDependency pins to the published dsh `0.1.2-rc.1` line (14 `@deepseek-ai/dsh-*` packages) and the `dshWorkshop` compatibility list; the compat CI probes and the `typecheck:ci` step label move from `0.1.1-rc.2` to `0.1.2-rc.1`. Peer ranges stay unchanged; the audit-event suppression keeps applying on `0.1.2-rc.1` (`Session.append` still cannot stamp the `ignorable` marker). No behavior change.
- The assembly test fixture carries the v2 `assistant/message` `stream` field so the checkout-ruler `typecheck` (paths against dsh 0.1.3-alpha.1, where the field is mandatory) and the published-ruler `typecheck:ci` both pass; test-only, no behavior change.

## [0.4.3] - 2026-09-02

### Docs

- Sync the five-language READMEs to the 0.1.2-alpha.5 facts; no behavior change.

## [0.4.2] - 2026-09-02

### Changed

- Align the devDependency pins to the published dsh 0.1.2-alpha.5 line and re-verify the adaptation claims; no behavior change.

## [0.4.1] - 2026-09-01

### Changed

- Align the devDependency pins to the published dsh `0.1.2-alpha.3` line (13 `@deepseek-ai/dsh-*` packages) and align `cordis`/`schemastery` to `^4.0.2`/`^3.18.2`. The audit-event suppression keeps applying on `0.1.2-alpha.3` (`Session.append` still cannot stamp the `ignorable` marker); the five-language READMEs record the alpha.3 fact.

## [0.4.0] - 2026-08-30

### Fixed

- On DeepSeek Harness `0.1.2-alpha.1` and later, `budget/alert` and `budget/block` audit events are no longer appended to the session log: the fail-closed session event vocabulary rejects logs containing event types it does not know, and the host exposes no external registration surface. Harnesses before `0.1.2-alpha.1` keep the previous behavior; the suppression is logged once at mount with the degradation reason.

### Changed

- The browser half types its root context as the `@deepseek-ai/cordis` `Context` (matching current harness client plugins); the removed `@deepseek-ai/dsh-client-runtime` entry was dropped from `dsh.client.inject`, the peer/optional-peer and dev dependencies, the tsconfig paths, and the tsdown platform-externals list.

## [0.3.1] - 2026-08-27

### Fixed

- Declare the web-client inject packages (`@deepseek-ai/dsh-client-connection`,
  `@deepseek-ai/dsh-client-locale`, `@deepseek-ai/dsh-client-runtime`,
  `@deepseek-ai/dsh-client-ui-settings`) as optional peerDependencies so the
  bundle composition is explicit and standalone installs stay clean.

## [0.3.0] - 2026-08-26

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
