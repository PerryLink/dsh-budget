<div align="center">

# 💰 dsh-budget

**DeepSeek Harness 的成本治理：预算、碳足迹与延迟，一个面板全览。**

*让每次会话的成本在超支之前就被看清。*

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
| Harness | DeepSeek Harness `0.1.0-rc.6` |
| Node | `^22.19.0 \|\| >=24.0.0` |
| 界面 | Host + Web 客户端（设置页预算页签）；`/budget` 命令 |

## 你能得到什么

`dsh-budget` 把会话事件流变成四合一成本治理闭环：

- **聚合计量** —— token（未缓存输入 / 输出 / 缓存读 / 缓存写）、估算 USD 成本与碳足迹，按模型/会话/天聚合；内置 USD/百万 token 价目表与 `config.prices` 合并定价。
- **预算治理** —— 会话/日/月三档封顶；warnRatio 阈值告警（webhook POST + 桌面通知开关）与三种超限策略：`alert`（仅告警）、`block`（在用户解除前短路新模型请求）、`degrade`（阻断并给出指向 `degradation` 映射中更便宜模型的修正提示）。
- **碳足迹与延迟** —— token→碳桥接（tokens × kWh/token × PUE × 区域电网强度，移植自 AI-Carbon-Footprint-Calculator）与按模型延迟百分位。
- **界面** —— 设置页预算页签（用量条、模型明细、告警、上限编辑、解除阻断按钮）与 `/budget` 命令（`/budget`、`/budget models`、`/budget unblock <scope>`）。

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

## 工具与界面

| 界面 | 类型 | 说明 |
|---|---|---|
| `/budget` | 命令 | 各作用域概览（用量、比例、碳足迹、阻断状态） |
| `/budget models` | 命令 | 按模型明细 + 延迟百分位 |
| `/budget unblock <scope>` | 命令 | 解除某作用域阻断（`session` / `daily` / `monthly`） |
| 设置 → 插件 → 预算 | 设置页签 | 用量条、模型明细、告警、上限编辑、解除阻断按钮 |
| `budget/status`、`budget/setSettings`、`budget/unblock` | Typert Remote | 客户端通道（页签消费这些方法） |

## 权限与数据

- **权限**：`network:outbound`（仅可选告警 webhook）、`session:append`（审计事件）、`native-code:none`。
- **数据**：展示内容全部来自会话事件流；主机侧唯一网络调用是配置的 webhook，URL 在加载时校验、入日志前剥离凭据。任何 prompt/载荷都不会离开主机。
- **会话日志**：`budget/alert` 与 `budget/block` 是仅日志审计事件，只携带作用域名与 USD 金额（微任务延后以绕过会话 append 重入保护）。

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
pnpm run typecheck:ci  # tsc：对照已发布的 0.1.0-rc.6 类型（无 paths）
pnpm test           # vitest：45 个测试
pnpm run build      # tsc 声明 + tsdown bundles（lib/）
pnpm run verify:self-contained  # 依赖声明全部来自 registry
pnpm run verify:artifacts       # 构建产物 ESM 面 + typert manifest + 客户端 bundle
pnpm pack           # 发布用 tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) —— 创建者与维护者：聚合、预算治理、碳足迹与延迟移植、设置页签与五语文档。

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
