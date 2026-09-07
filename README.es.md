<div align="center">

# 馃挵 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-budget` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Gobernanza de costos para DeepSeek Harness: presupuestos, carbono y latencia en un solo panel.**

*Conoce cu谩nto cuesta cada sesi贸n 鈥?antes de que te cueste a ti.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-鉁?green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-budget/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-budget/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-budget?label=version)](https://github.com/PerryLink/dsh-budget/releases)
[![npm version](https://img.shields.io/npm/v/dsh-budget)](https://www.npmjs.com/package/dsh-budget)
[![npm downloads](https://img.shields.io/npm/dm/dsh-budget)](https://www.npmjs.com/package/dsh-budget)

[English](README.md) 路 [绠€浣撲腑鏂嘳(README.zh.md) 路 [Espa帽ol](README.es.md) 路 [Portugu锚s](README.pt.md) 路 [啶灌た啶ㄠ啶︵](README.hi.md)

</div>

---

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.3-alpha.1` (GitHub tag, verificado el 2026-09-06; pin de npm `0.1.2-rc.1` adaptado el 2026-09-02; rango de peer `>=0.1.2-rc.1 <0.2.0`): el sobre de sesi贸n conserva su campo ignorable solo para compatibilidad de lectura de logs almacenados - Session.append a煤n no puede estamparlo, por lo que el comportamiento de la puerta no cambia. Verificado el 2026-09-06 contra el master checkout dsh-v0.1.3-alpha.1 (cadena completa de puertas + smoke de instalaci贸n de perfil). |

| Eventos de auditor铆a | Se escriben en harness anteriores a `0.1.2-rc.1`; se suprimen con una raz贸n de degradaci贸n registrada en `0.1.2-rc.1` y posteriores (vocabulario de eventos de sesi贸n fail-closed, sin superficie de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
| Superficies | Host + cliente Web (pesta帽a Budget en Settings); comando `/budget` |

## Qu茅 obtienes

`dsh-budget` convierte el flujo de eventos de sesi贸n en un ciclo de gobernanza de costos cuatro en uno:

- **Medici贸n agregada** 鈥?tokens (entrada sin cach茅 / salida / lectura de cach茅 / escritura de cach茅), costo USD estimado y huella de carbono por modelo, sesi贸n y d铆a, con una tabla integrada de USD por 1M tokens fusionada con tu `config.prices`.
- **Gobernanza de presupuesto** 鈥?l铆mites de sesi贸n/diarios/mensuales; alerta de umbral `warnRatio` (webhook POST + indicador de notificaci贸n de escritorio) y tres pol铆ticas al superar el l铆mite: `alert` (solo notificar), `block` (cortocircuitar nuevas solicitudes de modelo hasta que el usuario levante el bloqueo), `degrade` (bloqueo con gu铆a correctiva que nombra el modelo m谩s barato de tu mapa `degradation`).
- **Carbono y latencia** 鈥?puente token鈫抍arbono (tokens 脳 kWh/token 脳 PUE 脳 intensidad de la red regional, portado de AI-Carbon-Footprint-Calculator) y percentiles de latencia por modelo.
- **Superficies** 鈥?pesta帽a Budget en Settings (barras de uso, curva de uso por d铆a, desglose por modelo, alertas, editores de l铆mites, botones de desbloqueo) y el comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Inicio r谩pido

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# o desde npm (versiones publicadas)
dsh plugin --profile web add dsh-budget

# 2. reinicia y verifica la fila
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Luego pide al agente: `/budget` 鈥?y observa c贸mo se llena la pesta帽a de Settings.

## Instalaci贸n y desinstalaci贸n

- **Canal git** (煤ltimo `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` 鈥?el script `prepare` compila solo con dependencias de producci贸n.
- **Canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-budget`.
- **Canal tarball**: `pnpm pack` en este repositorio y luego `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-budget`.

> Si pnpm informa `ERR_PNPM_IGNORED_BUILDS` para este paquete (la validaci贸n inofensiva del binario de plataforma de esbuild), a帽ade `allowBuilds: { esbuild: true }` a tu `pnpm-workspace.yaml` 鈥?el CLI `dsh` imprime el fragmento exacto.

## Configuraci贸n

Todos los ajustes son campos `Config` de Schemastery (modificables desde cordis.yml). `cordis.patch.yml` documenta cada clave en l铆nea.

| Clave | Por defecto | Significado |
|---|---|---|
| `prices` | `{}` | Precios USD por 1M tokens por modelo, fusionados sobre la tabla integrada |
| `defaultPrice` | `{input: 1.0, output: 3.0}` | Respaldo para modelos ausentes de ambas tablas |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | L铆mites de presupuesto USD por 谩mbito; omitir para ilimitado |
| `warnRatio` | `0.8` | Alertar cuando el uso alcance esta fracci贸n del l铆mite (0..1) |
| `overLimit` | `alert` | `alert` / `block` / `degrade` tras cruzar un l铆mite |
| `degradation` | `{}` | Id de modelo 鈫?id de modelo m谩s barato del mismo proveedor |
| `webhookUrl` | *(ninguna)* | URL opcional de webhook para alertas de umbral (POST JSON) |
| `webhookTimeoutMs` | `5000` | Tiempo de espera de la solicitud webhook |
| `alertsEnabled` | `true` | Interruptor maestro de alertas de umbral |
| `alertCooldownMs` | `3600000` | M铆nimo ms entre dos alertas del mismo 谩mbito |
| `desktopNotifications` | `false` | Notificaciones de escritorio del navegador con la pesta帽a abierta |
| `refreshIntervalMs` | `5000` | Intervalo de sondeo de la pesta帽a |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | Puente de carbono (regiones: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | Percentiles de latencia por modelo y su ventana |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | Moneda de visualizaci贸n (los costos se calculan en USD) |
| `outputLanguage` | `en` | Idioma de salida de `/budget`: `en` / `zh` |
| `historyDays` | `30` | D铆as de historial de uso diario en la instant谩nea |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | Persistencia duradera diaria/mensual entre reinicios (dominio de almacenamiento); degrada a en-memoria si falta el dominio |

## Herramientas y superficies

| Superficie | Tipo | Notas |
|---|---|---|
| `/budget` | Comando | Resumen por 谩mbito (uso, ratio, carbono, estado bloqueado) |
| `/budget models` | Comando | Desglose por modelo con percentiles de latencia |
| `/budget unblock <scope>` | Comando | Levantar un 谩mbito bloqueado (`session` / `daily` / `monthly`) |
| Settings 鈫?Plugins 鈫?Budget | Pesta帽a de Settings | Barras de uso, curva de uso por d铆a, desglose, alertas, editores de l铆mites, desbloqueo |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | Canal del cliente (consumido por la pesta帽a) |

## Permisos y datos

- **Permisos**: `network:outbound` (solo el webhook de alerta opcional), `session:append` (eventos de auditor铆a), `native-code:none`.
- **Datos**: todo lo mostrado proviene del flujo de eventos de sesi贸n; la 煤nica llamada de red es el webhook configurado, validado al cargar y sin credenciales en los registros. Ning煤n prompt o payload sale del host.
- **Registro de sesi贸n**: `budget/alert` y `budget/block` son eventos de auditor铆a solo-registro con nombres de 谩mbito e importes USD (diferidos por microtarea ante el guard de reentrada de append). En harness `0.1.2-rc.1` y posteriores no se escriben 鈥?el vocabulario de eventos fail-closed rechaza logs con tipos de evento no registrados y no ofrece superficie de registro externa 鈥?as铆 que el rastro de auditor铆a se degrada al logger de presupuesto y al webhook 煤nicamente.

## L铆mites de seguridad

- **Sin fabricaci贸n**: un bloqueo de presupuesto produce un final de error correctivo en el waterfall `llm/stream` 鈥?el plugin nunca inventa salida de modelo.
- **Sin reescritura de solicitudes**: las solicitudes del loop est谩n congeladas; `degrade` nombra el modelo objetivo en el mensaje correctivo en lugar de reemplazar la solicitud.
- **Fallo ruidoso**: precios, URLs, ratios, regiones o l铆mites inv谩lidos fallan el montaje.
- **Alcance honesto**: las ediciones en tiempo de ejecuci贸n del panel son por sesi贸n; una recarga restaura los valores de cordis.yml.

## Limitaciones conocidas

- La agregaci贸n es local al proceso: el uso se reinicia al reiniciar el harness (los cubos diarios/mensuales se reconstruyen desde la vista actual del registro).
- `block`/`degrade` dependen del waterfall `llm/stream`; los builds sin ese seam no pueden bloquear solicitudes (las alertas siguen funcionando).
- Los precios integrados se desactualizan; sobrescr铆belos con `config.prices`.

## Desarrollo

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra el checkout local del harness
pnpm run typecheck:ci  # tsc contra los tipos publicados 0.1.2-rc.1 (sin paths)
pnpm test           # vitest
pnpm run build      # declaraciones tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # las especificaciones de dependencias resuelven desde el registry
pnpm run verify:artifacts       # cara ESM + manifiesto typert + bundle de cliente
pnpm pack           # el tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) 鈥?creador y mantenedor: agregaci贸n, gobernanza de presupuesto, portes de carbono y latencia, la pesta帽a de Settings y la documentaci贸n en cinco idiomas.

## PerryLink DSH Plugin Family

Este proyecto es uno de los [37 complementos de DeepSeek Harness](https://github.com/PerryLink) mantenidos por [PerryLink](https://github.com/PerryLink). Si este te ayuda, probablemente los dem谩s tambi茅n:

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Auto-revisi贸n de segundo modelo en la cadena de aprobaci贸n, con cierre en fallo por defecto | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Agentes hijos en segundo plano durables con barra lateral de UI web, mensajer铆a e interrupci贸n | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Equivalente a /rewind de Claude Code: instant谩neas, bifurcaciones de sesi贸n, restauraci贸n de un solo uso | |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migra sesiones, memoria, habilidades y CLAUDE.md de Claude Code a DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Control de escritorio nativo multiplataforma para DeepSeek Harness 鈥?Windows primero. | |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Historial de entrada estilo terminal para el compositor web: flechas, b煤squeda Ctrl+R | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Comprobaciones de calidad de datasets y verificaci贸n de citas (el puente num茅rico opcional consumido aqu铆) | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Defensa contra inyecci贸n de prompts, jailbreak y fuga de secretos para DeepSeek Harness. | |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Guardi谩n de disciplina de ingenier铆a: interrogatorio de requisitos, puertas de pruebas, revisi贸n adversaria | |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Enrutamiento unificado de generaci贸n de im谩genes est谩ticas para DeepSeek Harness. | |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Diagn贸stico de rendimiento de solo lectura para DeepSeek Harness. | |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Informes de investigaci贸n deterministas para fondos mutuos p煤blicos chinos | |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | Integraci贸n de PR/issues de GitHub para DSH, cada escritura controlada por aprobaci贸n | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Orquestaci贸n de investigaci贸n sectorial que sella sus entregables mediante el `ctx.researchReport.assemble` de este plugin | |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Base de conocimiento documental local para DeepSeek Harness. | |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Integraci贸n de modelos locales (Ollama) para DeepSeek Harness. | |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | Diagn贸sticos, formato, autocompletado, acciones de c贸digo y renombrado LSP sobre servidores de lenguaje | |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | Middleware de enmascaramiento de PII: anonimiza en el l铆mite del modelo, restaura en la capa de visualizaci贸n | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Panel de tiempo de ejecuci贸n MCP de solo lectura: comando /mcp + pesta帽a Settings con estado, herramientas y errores | |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Memoria entre sesiones controlada por aprobaci贸n: costura ctx.memory + SQLite + herramienta de memoria | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | Exportador de observabilidad OpenTelemetry y Langfuse para DeepSeek Harness. | |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Cambio de estilo en tiempo de ejecuci贸n equivalente a outputStyles de Claude Code | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Reglas de permisos declarativas allow/deny/ask estilo Claude Code con auditor铆a | |
| **[dsh-personal-directive](https://github.com/PerryLink/dsh-personal-directive)** | Inyector de directivas personales con interruptor en la barra superior (edici贸n framework) |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Base de conocimiento de desarrollo de plugins como habilidad de agente bajo demanda | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Puente multicanal de aprobaci贸n/preguntas: WeChat/Telegram/Feishu, consola de sesi贸n |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Motor de informes de investigaci贸n verificables con evidencia direccionada por contenido | |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Puntuaci贸n de calidad multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Fija sesiones en la barra lateral web con orden durable | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Sincronizaci贸n de sesiones entre dispositivos para DeepSeek Harness 鈥?un espejo git dedicado de tu almac茅n de sesiones. | |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Paquete de habilidades de auditor铆a de seguridad: escaneo de secretos, revisi贸n de dependencias y cadena de suministro | |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Bucle de sesi贸n con voz para DeepSeek Harness: h谩blale y escucha su respuesta. | |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Pruebas de instalaci贸n y humo aisladas para plugins de DeepSeek Harness. | |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | Puente de tareas TickTick/Dida365: panel de cabecera de sesi贸n + 11 herramientas |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Traducci贸n de par谩metros entre proveedores y reparaci贸n determinista de JSON para DeepSeek Harness. | |
| **[dsh-wechat](https://github.com/PerryLink/dsh-wechat)** | Puente WeChat 鈫?DSH (bot Tencent iLink): texto/imagen/archivo/voz, aprobaciones en el chat |

## License

[Apache License 2.0](LICENSE) 漏 2026 dsh-budget contributors

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market 鈫?Sources 鈫?add source 鈫?pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **鈫?seleccionarlo**. La instalaci贸n sigue pasando por la verificaci贸n de identidad npm del mercado y tu confirmaci贸n.
