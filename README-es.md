<div align="center">

# 💰 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-budget` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Gobernanza de costos para DeepSeek Harness: presupuestos, carbono y latencia en un solo panel.**

*Conoce cuánto cuesta cada sesión — antes de que te cueste a ti.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-budget)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-budget.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-budget/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-budget/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-budget?label=version)](https://github.com/PerryLink/dsh-budget/releases)
[![npm version](https://img.shields.io/npm/v/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![npm downloads](https://img.shields.io/npm/dm/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-budget?metric=downloads&lang=es)](https://dshfind.com/es/plugins/PerryLink/dsh-budget?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-budget
```


</div>

---


**📖 Base de conocimiento del ecosistema** — datos medidos, no marketing: [guía de desarrollo · datos de selección · criterios de mantenimiento](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->

## Instalación y desinstalación

- **Canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-budget` — el script `prepare` compila solo con dependencias de producción.
- **Canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-budget`.
- **Canal tarball**: `pnpm pack` en este repositorio y luego `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-budget`.

> Si pnpm informa `ERR_PNPM_IGNORED_BUILDS` para este paquete (la validación inofensiva del binario de plataforma de esbuild), añade `allowBuilds: { esbuild: true }` a tu `pnpm-workspace.yaml` — el CLI `dsh` imprime el fragmento exacto.

## What is dsh-budget?

Gobernanza de costos para DeepSeek Harness: presupuestos, carbono y latencia en un solo panel.

Conoce cuánto cuesta cada sesión — antes de que te cueste a ti.

![Demostración de terminal de dsh-budget: dsh-budget — install, then /budget and /budget models](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-hero.png)

![Animated terminal demo of dsh-budget](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-demo.gif)

*La misma ejecución, animada.*

## Estado de mantenimiento: 🧊 CONGELADO

> **Congelado el 2026-10-05. Sin nuevas funciones.** Este paquete sigue funcionando y **no está retirado**, pero ya no recibe trabajo de funciones; solo se corregirá una avería real.

Los mantenedores consideran que en esta capacidad **ya existen alternativas con mejor adopción**, así que el esfuerzo se ha trasladado. Comparativa medida el 2026-10-05:

| | paquete | descargas semanales |
|---|---|---|
| **este paquete** | `dsh-budget` | 1,079 |
| alternativa mejor adoptada | [`dsh-cost-meter`](https://github.com/Han-1413141/dsh-cost-meter) | **33,526** |
| otra alternativa | `dsh-usage-stats` | not measured |
| otra alternativa | `@dougen/dsh-deepseek-usage` | 6,019 |

👉 **Para trabajo nuevo, prefiera dsh-cost-meter.** Las instalaciones existentes siguen funcionando sin cambios.

*Evidencia completa: `dsh-plugin-supersession-review-20261005.md`. Texto completo en la sección **Maintenance status: 🧊 FROZEN** de [README.md](README.md).*

## ⭐ 如果它帮到了你

Este plugin forma parte de la [familia de plugins DSH](https://github.com/PerryLink) (más de 40, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre antes.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## Comparison

![Gráfico comparativo medido de dsh-budget](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (GitHub tag, adaptado el 2026-09-24; rango de peer `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`): los precios del catálogo alpha.2 están integrados en la tabla y los modelos sin precio aparecen como "sin precio" en lugar de una estimación inventada; la puerta de auditoría sigue suprimiendo los appends `budget/alert`/`budget/block` (vocabulario de eventos de sesión fail-closed). Verificado el 2026-09-24 mediante la cadena typecheck de dos reglas y la puerta local completa; los ítems del panel del navegador quedan 人工·未测即未完成 (checklist manual del mantenedor). |

| Eventos de auditoría | Se escriben en harness anteriores a `0.1.2-rc.1`; se suprimen con una razón de degradación registrada en `0.1.2-rc.1` y posteriores (vocabulario de eventos de sesión fail-closed, sin superficie de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
| Superficies | Host + cliente Web (pestaña Budget en Settings); comando `/budget` |

## Qué obtienes

`dsh-budget` convierte el flujo de eventos de sesión en un ciclo de gobernanza de costos cuatro en uno:

- **Medición agregada** — tokens (entrada sin caché / salida / lectura de caché / escritura de caché), costo USD estimado y huella de carbono por modelo, sesión y día, con una tabla integrada de USD por 1M tokens fusionada con tu `config.prices`.
- **Gobernanza de presupuesto** — límites de sesión/diarios/mensuales; alerta de umbral `warnRatio` (webhook POST + indicador de notificación de escritorio) y tres políticas al superar el límite: `alert` (solo notificar), `block` (cortocircuitar nuevas solicitudes de modelo hasta que el usuario levante el bloqueo), `degrade` (bloqueo con guía correctiva que nombra el modelo más barato de tu mapa `degradation`).
- **Carbono y latencia** — puente token→carbono (tokens × kWh/token × PUE × intensidad de la red regional, portado de AI-Carbon-Footprint-Calculator) y percentiles de latencia por modelo.
- **Superficies** — pestaña Budget en Settings (barras de uso, curva de uso por día, desglose por modelo, alertas, editores de límites, botones de desbloqueo) y el comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Inicio rápido

```sh
dsh plugin --profile web add github:PerryLink/dsh-budget
```

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add github:PerryLink/dsh-budget

# o desde npm (versiones publicadas)
dsh plugin --profile web add dsh-budget

# 2. reinicia y verifica la fila
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Luego pide al agente: `/budget` — y observa cómo se llena la pestaña de Settings.

## Configuración

Todos los ajustes son campos `Config` de Schemastery (modificables desde cordis.yml). `cordis.patch.yml` documenta cada clave en línea.

| Clave | Por defecto | Significado |
|---|---|---|
| `prices` | `{}` | Precios USD por 1M tokens por modelo, fusionados sobre la tabla integrada |
| `defaultPrice` | señal sin precio (`priced: false`, números en cero) | Respaldo para modelos ausentes de ambas tablas: por defecto contribuye 0 a la contabilidad y se muestra como "sin precio"; defina números con `priced: true` para fijar precios explícitos |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | Límites de presupuesto USD por ámbito; omitir para ilimitado |
| `warnRatio` | `0.8` | Alertar cuando el uso alcance esta fracción del límite (0..1) |
| `overLimit` | `alert` | `alert` / `block` / `degrade` tras cruzar un límite |
| `degradation` | `{}` | Id de modelo → id de modelo más barato del mismo proveedor |
| `webhookUrl` | *(ninguna)* | URL opcional de webhook para alertas de umbral (POST JSON) |
| `webhookTimeoutMs` | `5000` | Tiempo de espera de la solicitud webhook |
| `alertsEnabled` | `true` | Interruptor maestro de alertas de umbral |
| `alertCooldownMs` | `3600000` | Mínimo ms entre dos alertas del mismo ámbito |
| `desktopNotifications` | `false` | Notificaciones de escritorio del navegador con la pestaña abierta |
| `refreshIntervalMs` | `5000` | Intervalo de sondeo de la pestaña |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | Puente de carbono (regiones: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | Percentiles de latencia por modelo y su ventana |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | Moneda de visualización (los costos se calculan en USD) |
| `outputLanguage` | `en` | Idioma de salida de `/budget`: `en` / `zh` |
| `historyDays` | `30` | Días de historial de uso diario en la instantánea |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | Persistencia duradera diaria/mensual entre reinicios (dominio de almacenamiento); degrada a en-memoria si falta el dominio |

## Herramientas y superficies

| Superficie | Tipo | Notas |
|---|---|---|
| `/budget` | Comando | Resumen por ámbito (uso, ratio, carbono, estado bloqueado) |
| `/budget models` | Comando | Desglose por modelo con percentiles de latencia |
| `/budget unblock <scope>` | Comando | Levantar un ámbito bloqueado (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Pestaña de Settings | Barras de uso, curva de uso por día, desglose, alertas, editores de límites, desbloqueo |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | Canal del cliente (consumido por la pestaña) |

## Permisos y datos

- **Permisos**: `network:outbound` (solo el webhook de alerta opcional), `session:append` (eventos de auditoría), `native-code:none`.
- **Datos**: todo lo mostrado proviene del flujo de eventos de sesión; la única llamada de red es el webhook configurado, validado al cargar y sin credenciales en los registros. Ningún prompt o payload sale del host.
- **Registro de sesión**: `budget/alert` y `budget/block` son eventos de auditoría solo-registro con nombres de ámbito e importes USD (diferidos por microtarea ante el guard de reentrada de append). En harness `0.1.2-rc.1` y posteriores no se escriben — el vocabulario de eventos fail-closed rechaza logs con tipos de evento no registrados y no ofrece superficie de registro externa — así que el rastro de auditoría se degrada al logger de presupuesto y al webhook únicamente.

## Límites de seguridad

- **Sin fabricación**: un bloqueo de presupuesto produce un final de error correctivo en el waterfall `llm/stream` — el plugin nunca inventa salida de modelo.
- **Sin reescritura de solicitudes**: las solicitudes del loop están congeladas; `degrade` nombra el modelo objetivo en el mensaje correctivo en lugar de reemplazar la solicitud.
- **Fallo ruidoso**: precios, URLs, ratios, regiones o límites inválidos fallan el montaje.
- **Alcance honesto**: las ediciones en tiempo de ejecución del panel son por sesión; una recarga restaura los valores de cordis.yml.

## Limitaciones conocidas

- La agregación es local al proceso: el uso se reinicia al reiniciar el harness (los cubos diarios/mensuales se reconstruyen desde la vista actual del registro).
- `block`/`degrade` dependen del waterfall `llm/stream`; los builds sin ese seam no pueden bloquear solicitudes (las alertas siguen funcionando).
- Los precios integrados se desactualizan; sobrescríbelos con `config.prices`.

## Desarrollo

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra el checkout local del harness
pnpm run typecheck:ci  # tsc contra los tipos publicados 0.1.7-rc.2 (sin paths)
pnpm test           # vitest
pnpm run build      # declaraciones tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # las especificaciones de dependencias resuelven desde el registry
pnpm run verify:artifacts       # cara ESM + manifiesto typert + bundle de cliente
pnpm pack           # el tarball publicado
```

## Interoperabilidad con otros plugins de DSH

Verificado contra **DSH `0.2.0-rc.2`** (el runtime para el que se publica este README) y el conjunto de plugins con más estrellas sondeado el 2026-10-05.

Este plugin **no interfiere** con otros plugins, incluidos los de más estrellas:

- **Sin colisión de nombres de herramienta.** Todas las herramientas llevan espacio de nombres; ninguna ocupa un nombre desnudo ya perteneciente a una herramienta incluida u otro plugin.
- **Sin colisión de clave de servicio.** Solo provee `budget`; esa clave no es una costura incluida ni la provee ningún plugin de más estrellas.
- **Sin colisión de slot.** No registra ninguna clave de slot de cliente, así que no disputa un asiento `shadows-shipped-ui`.
- **Sin colisión de ruta HTTP.** No registra ningún prefijo `webServer`.
- **Sin colisión en la capa de patch.** El patch del bundle solo hace `insert` de su propia fila; nunca sobrescribe el `config` de una fila incluida.
- **Sin mutación global.** No parchea prototipos, ni reescribe `process.env`, ni reemplaza el dispatcher global de fetch.

**Los listeners de eventos compartidos no interfieren por construcción.** Observa los eventos sensibles al orden `llm/stream` con `ctx.on()` — el registro de difusión de Cordis, donde cada listener se ejecuta y ninguno puede dejar sin turno a otro. **Todos los listeners aquí delegan por `next()`**, así que la cadena nunca se cortocircuita:
  - `llm/stream` — also used by `dsh-routing-suite` (7000★).

Evidencia estática: `dsh-plugin-doctor` K10–K13 dan `pass` en todas las comprobaciones de este repositorio.

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creador y mantenedor: agregación, gobernanza de presupuesto, portes de carbono y latencia, la pestaña de Settings y la documentación en cinco idiomas.

## PerryLink DSH Plugin Family

Este proyecto es uno de los **87 plugins activamente mantenidos** de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro familiar tiene **95** plugins — **5 congelados**, **3 retirados** — y permanece plegado abajo para que cada README conserve una primera pantalla corta. Expándelo para ver cada fila, con el motivo en la columna Estado.

<details>
<summary>Expandir los 95 plugins</summary>

| Plugin | Una línea | Estado |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
