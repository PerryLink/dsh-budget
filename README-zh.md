<div align="center">

# 💰 dsh-budget
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-budget`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**DeepSeek Harness 的成本治理：预算、碳足迹与延迟，一个面板全览。**

*让每次会话的成本在超支之前就被看清。*

> **官方仓库。** 本仓库是 dsh-budget 的唯一官方仓库，由 PerryLink 维护。其他账号下的同名仓库与本项目无关。

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-budget)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-budget.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-zh.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-budget/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-budget/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-budget?label=version)](https://github.com/PerryLink/dsh-budget/releases)
[![npm version](https://img.shields.io/npm/v/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![npm downloads](https://img.shields.io/npm/dm/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-budget?metric=downloads&lang=zh)](https://dshfind.com/zh/plugins/PerryLink/dsh-budget?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

---

## 兼容性

| 方面 | 状态 |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.7-alpha.1`（GitHub tag，2026-09-18 已适配；peer 范围 `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`）：alpha.2 目录价已内置进价目表，未定价模型以「未定价」呈现而非虚构估算；审计门继续抑制 `budget/alert`/`budget/block` 落盘（fail-closed 会话事件词表）。已于 2026-09-18 通过双尺子 typecheck 链与完整本地门禁核验；浏览器面板项为 人工·未测即未完成（维护者人工清单）。 |

| 审计事件 | `0.1.2-rc.1` 之前的宿主上写入；在 `0.1.2-rc.1` 及以后抑制并记录降级原因（fail-closed 会话事件词表，无外部注册面） || Node | `^22.19.0 \|\| >=24.0.0` |
| 界面 | Host + Web 客户端（设置页预算页签）；`/budget` 命令 |

## 你能得到什么

`dsh-budget` 把会话事件流变成四合一成本治理闭环：

- **聚合计量** —— token（未缓存输入 / 输出 / 缓存读 / 缓存写）、估算 USD 成本与碳足迹，按模型/会话/天聚合；内置 USD/百万 token 价目表与 `config.prices` 合并定价。
- **预算治理** —— 会话/日/月三档封顶；warnRatio 阈值告警（webhook POST + 桌面通知开关）与三种超限策略：`alert`（仅告警）、`block`（在用户解除前短路新模型请求）、`degrade`（阻断并给出指向 `degradation` 映射中更便宜模型的修正提示）。
- **碳足迹与延迟** —— token→碳桥接（tokens × kWh/token × PUE × 区域电网强度，移植自 AI-Carbon-Footprint-Calculator）与按模型延迟百分位。
- **界面** —— 设置页预算页签（用量条、按天用量曲线、模型明细、告警、上限编辑、解除阻断按钮）与 `/budget` 命令（`/budget`、`/budget models`、`/budget unblock <scope>`）。

## 快速开始

```sh
# 1. 把 bundle 装进你的 profile
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# 或从 npm 安装（正式发布版）
dsh plugin --profile web add dsh-budget

# 2. 重启并核实行
dsh --profile web --dump-config | grep -A2 'id: budget'
```

然后在会话里输入 `/budget`，并在设置页查看预算页签。

## 安装与卸载

- **git 通道**（最新 `main`）：`dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` —— `prepare` 脚本仅用生产依赖构建。
- **npm 通道**（正式发布版）：`dsh plugin --profile web add dsh-budget`。
- **tarball 通道**：在本仓库执行 `pnpm pack`，然后 `dsh plugin --profile web add ./dsh-budget-<version>.tgz`。
- **卸载**：`dsh plugin --profile web remove dsh-budget`。

> 如果 pnpm 对本包报 `ERR_PNPM_IGNORED_BUILDS`（esbuild 的平台二进制无害校验），在你的 `pnpm-workspace.yaml` 中加入 `allowBuilds: { esbuild: true }` —— `dsh` CLI 会打印确切片段。

## 配置

所有可调项都是 Schemastery `Config` 字段（可在 cordis.yml 中修改）。`cordis.patch.yml` 内联说明每个键。

| 键 | 默认值 | 含义 |
|---|---|---|
| `prices` | `{}` | 每模型 USD/百万 token 价格，合并覆盖内置价目表 |
| `defaultPrice` | 未定价信号（`priced: false`，数字为零） | 两表均无该模型时的回退：默认对记账贡献 0 并显示「未定价」；设置数字并加 `priced: true` 可为未知模型显式定价 |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | 各作用域 USD 预算上限；缺省表示不限 |
| `warnRatio` | `0.8` | 用量达到上限该比例时告警（0..1） |
| `overLimit` | `alert` | 超限后策略：`alert` / `block` / `degrade` |
| `degradation` | `{}` | 模型 id → 同厂商更便宜模型 id 的映射 |
| `webhookUrl` | *(无)* | 可选阈值告警 webhook URL（POST JSON） |
| `webhookTimeoutMs` | `5000` | webhook 请求超时 |
| `alertsEnabled` | `true` | 阈值告警总开关 |
| `alertCooldownMs` | `3600000` | 同一作用域两次告警的最小间隔（ms） |
| `desktopNotifications` | `false` | 页签打开时的浏览器桌面通知 |
| `refreshIntervalMs` | `5000` | 设置页签轮询间隔 |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | 碳桥接（区域：global, us, eu, china, india, uk, france, iceland） |
| `latency.enabled` / `windowSize` | `true` / `200` | 按模型延迟百分位与其窗口 |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | 展示货币（成本以 USD 计算，仅展示换算） |
| `outputLanguage` | `en` | `/budget` 输出语言：`en` / `zh` |
| `historyDays` | `30` | 面板快照保留的按天用量历史天数 |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | 日/月用量跨重启持久化（storage 域）；域缺失时降级为进程内聚合 |

## 工具与界面

| 界面 | 类型 | 说明 |
|---|---|---|
| `/budget` | 命令 | 各作用域概览（用量、比例、碳足迹、阻断状态） |
| `/budget models` | 命令 | 按模型明细 + 延迟百分位 |
| `/budget unblock <scope>` | 命令 | 解除某作用域阻断（`session` / `daily` / `monthly`） |
| 设置 → 插件 → 预算 | 设置页签 | 用量条、按天用量曲线、模型明细、告警、上限编辑、解除阻断按钮 |
| `budget/status`、`budget/setSettings`、`budget/unblock` | Typert Remote | 客户端通道（页签消费这些方法） |

## 权限与数据

- **权限**：`network:outbound`（仅可选告警 webhook）、`session:append`（审计事件）、`native-code:none`。
- **数据**：展示内容全部来自会话事件流；主机侧唯一网络调用是配置的 webhook，URL 在加载时校验、入日志前剥离凭据。任何 prompt/载荷都不会离开主机。
- **会话日志**：`budget/alert` 与 `budget/block` 是仅日志审计事件，只携带作用域名与 USD 金额（微任务延后以绕过会话 append 重入保护）。在 `0.1.2-rc.1` 及以后的宿主上不再写入——fail-closed 事件词表会拒绝含未注册事件类型的日志，且没有外部注册面——审计轨迹因此仅降级到预算日志与 webhook。

## 安全边界

- **不伪造数据**：预算阻断在 `llm/stream` 瀑布上产出修正性错误 finish —— 插件绝不编造模型输出。
- **不改写请求**：loop 构建的请求被冻结；`degrade` 因此在修正消息中点名目标模型，而非替换请求。
- **失败大声**：非法价格、URL、比例、区域与边界在挂载时即失败。
- **如实作用域**：面板的运行时编辑仅会话级生效；重载后恢复 cordis.yml 配置。

## 已知限制

- 聚合为进程本地：harness 重启后用量清零（日/月桶从当前会话日志视图重建）。
- `block`/`degrade` 依赖 `llm/stream` 瀑布；无此 seam 的构建无法阻断请求（告警仍有效）。
- 内置价目会漂移；用 `config.prices` 覆盖条目。

## 开发

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc：src + tests，对照本地 harness checkout
pnpm run typecheck:ci  # tsc：对照已发布的 0.1.7-alpha.2 类型（无 paths）
pnpm test           # vitest
pnpm run build      # tsc 声明 + tsdown bundles（lib/）
pnpm run verify:self-contained  # 依赖声明全部来自 registry
pnpm run verify:artifacts       # 构建产物 ESM 面 + typert manifest + 客户端 bundle
pnpm pack           # 发布用 tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) —— 创建者与维护者：聚合、预算治理、碳足迹与延迟移植、设置页签与五语文档。

## PerryLink DSH Plugin Family

This project is one of the **45 DeepSeek Harness plugins** maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default | |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | |
| **[dsh-catalog](https://github.com/PerryLink/dsh-catalog)** | DSH Desktop Market standard catalog source for the PerryLink family | |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore | |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. | |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review | |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. | |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds | |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` | |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools | |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. | |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. | |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers | |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors | |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. | |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit | |
| **[dsh-plugin-certification](https://github.com/PerryLink/dsh-plugin-certification)** | Community certification registry with repro-checkable grades and badges | |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins | |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill | |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins | |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card | |
| **[dsh-plugin-upgrade-015](https://github.com/PerryLink/dsh-plugin-upgrade-015)** | Merged `0.1.3-alpha.1` → `0.1.5-rc.1` upgrade corridor card plus a zero-dependency seam scanner | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions | |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. | |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. | |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review | |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. | |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. | |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools | |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. | |


## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors

### 从 DSH Desktop 市场安装

所有 PerryLink 插件均可在 DSH Desktop 内置市场中浏览：**市场 → 来源 → 添加来源 → 粘贴** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ 选中**。安装仍需通过市场的 npm 身份校验与你的确认。
