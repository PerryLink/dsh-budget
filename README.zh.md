<div align="center">

# 💰 dsh-budget
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-budget`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**DeepSeek Harness 的成本治理：预算、碳足迹与延迟，一个面板全览。**

*让每次会话的成本在超支之前就被看清。*

> **官方仓库。** 本仓库是 dsh-budget 的唯一官方仓库，由 PerryLink 维护。其他账号下的同名仓库与本项目无关。

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

## 兼容性

| 方面 | 状态 |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` 0.1.2-alpha.3（2026-09-01 已适配）：会话信封保留 ignorable 字段但仅用于存量日志读取兼容——Session.append 仍无法盖章，门控行为不变。 |

| 审计事件 | `0.1.2-alpha.3` 之前的宿主上写入；在 `0.1.2-alpha.3` 及以后抑制并记录降级原因（fail-closed 会话事件词表，无外部注册面） || Node | `^22.19.0 \|\| >=24.0.0` |
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
| `defaultPrice` | `{input: 1.0, output: 3.0}` | 两表均无该模型时的回退价格 |
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
- **会话日志**：`budget/alert` 与 `budget/block` 是仅日志审计事件，只携带作用域名与 USD 金额（微任务延后以绕过会话 append 重入保护）。在 `0.1.2-alpha.3` 及以后的宿主上不再写入——fail-closed 事件词表会拒绝含未注册事件类型的日志，且没有外部注册面——审计轨迹因此仅降级到预算日志与 webhook。

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
pnpm run typecheck:ci  # tsc：对照已发布的 0.1.1-rc.2 类型（无 paths）
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

这是 [PerryLink](https://github.com/PerryLink) 维护的 [33 个 DeepSeek Harness 插件](https://github.com/PerryLink) 之一。如果它能帮到你，其他的也会：

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | 审批链上的第二模型自动审查，默认失败关闭 | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | 带 Web UI 侧栏、消息与中断的持久后台子代理 | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Claude Code /rewind 等价：快照、会话 fork、一次性恢复 | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | 把 Claude Code 会话、记忆、技能与 CLAUDE.md 迁入 DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | 跨平台原生桌面控制（DeepSeek Harness），Windows 优先。 | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Web 输入框的终端式历史：方向键、Ctrl+R 搜索 | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | 数据集质量检查与引文核查（本插件可选消费的数字核查桥） | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | DeepSeek Harness 的提示注入、越狱与密钥泄露防护。 | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | 工程纪律守卫：需求质询、测试门禁、对手评审 | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | DeepSeek Harness 的统一静态图像生成路由。 | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | DeepSeek Harness 只读性能诊断。 | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | 面向中国公募基金的确定性研究报告 | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | 面向 DSH 的 GitHub PR/issues 集成，每次写入经审批门控 | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | 行业研究编排，经本插件的 `ctx.researchReport.assemble` 封存交付物 | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | DeepSeek Harness 的本地文档知识库。 | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | DeepSeek Harness 的本地模型（Ollama）接入。 | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | 通过语言服务器的 LSP 诊断、格式化、补全、代码操作与重命名 | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | PII 脱敏中间件：模型边界匿名化、展示层还原 | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | 只读 MCP 运行时面板：/mcp 命令 + 带状态、工具与错误的 Settings 标签页 | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | 审批门控的跨会话记忆：ctx.memory 接缝 + SQLite + 记忆工具 | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | DeepSeek Harness 的 OpenTelemetry 与 Langfuse 可观测导出器。 | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Claude Code outputStyles 等价的运行时风格切换 | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Claude Code 风格声明式 allow/deny/ask 权限规则，带审计 | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | 作为按需代理技能的插件开发知识库 | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | 可验证研究报告引擎：内容寻址证据账本与封存版本 | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | DeepSeek Harness 插件的多维质量评分。 | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | 在 Web 侧栏置顶会话，带持久排序 | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | DeepSeek Harness 的跨设备会话同步——会话存储的专用 git 镜像。 | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | 安全审计技能包：密钥扫描、依赖与供应链审查 | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | DeepSeek Harness 的语音优先会话闭环：对它说，听它答。 | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | DeepSeek Harness 插件的隔离试装冒烟。 | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | DeepSeek Harness 的厂商参数翻译与确定性 JSON 修复。 | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
