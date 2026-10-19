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

## Familia de plugins DSH de PerryLink

Este proyecto forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro permanece plegado abajo para que cada README conserve una primera pantalla corta; expándelo para ver cada fila y su estado.

<details>
<summary>Expandir todos los plugins</summary>

| Plugin | Estado |
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
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver el README del repositorio |

</details>

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
