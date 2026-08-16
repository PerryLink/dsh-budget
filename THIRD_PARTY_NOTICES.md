# Third-party notices

The following upstream projects (all by the plugin author, all Apache-2.0) were
ported into `src/estimate/` for this plugin. No upstream source files are
bundled verbatim; the ports keep the upstream data and formulas and are
annotated per module with the source file and commit:

| Upstream project | License | Ported into |
|---|---|---|
| [LLM-Cost-Estimator-CN](https://github.com/PerryLink/LLM-Cost-Estimator-CN) (commit `aa6cc2f`) | Apache-2.0 | `src/estimate/models.ts` (CNY price table, verbatim), `src/estimate/cost.ts` (cost formulas) |
| [Mode-Latency-Benchmark](https://github.com/PerryLink/Mode-Latency-Benchmark) (commit `8123838`) | Apache-2.0 | `src/estimate/latency-stats.ts` (benchmark vocabulary + percentile statistics) |
| [AI-Carbon-Footprint-Calculator](https://github.com/PerryLink/AI-Carbon-Footprint-Calculator) (commit `d8d52b5`) | Apache-2.0 | `src/estimate/carbon.ts` (GPU/region/PUE data, formulas, equivalence comparisons) |

The read-only reference checkouts live under `upstream/` (gitignored, never
shipped). The operational USD price table in `src/estimate/prices.ts` is
maintained separately; entries converted from the upstream CNY table carry
`source: 'upstream-cny'` with the fixed conversion rate captured at porting
time.

At runtime the plugin depends only on the official `@deepseek-ai/*` packages
listed as peerDependencies, plus the build-time tools (`typescript`,
`tsdown`) and `zod` declared as regular dependencies for the git-channel
`prepare` build.
