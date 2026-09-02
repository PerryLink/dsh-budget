<div align="center">

# 💰 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-budget` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Gobernanza de costos para DeepSeek Harness: presupuestos, carbono y latencia en un solo panel.**

*Conoce cuánto cuesta cada sesión — antes de que te cueste a ti.*

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

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.5` (adaptado el 2026-09-02): el sobre de sesión conserva su campo ignorable solo para compatibilidad de lectura de logs almacenados - Session.append aún no puede estamparlo, por lo que el comportamiento de la puerta no cambia. |

| Eventos de auditoría | Se escriben en harness anteriores a `0.1.2-alpha.5`; se suprimen con una razón de degradación registrada en `0.1.2-alpha.5` y posteriores (vocabulario de eventos de sesión fail-closed, sin superficie de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
| Superficies | Host + cliente Web (pestaña Budget en Settings); comando `/budget` |

## Qué obtienes

`dsh-budget` convierte el flujo de eventos de sesión en un ciclo de gobernanza de costos cuatro en uno:

- **Medición agregada** — tokens (entrada sin caché / salida / lectura de caché / escritura de caché), costo USD estimado y huella de carbono por modelo, sesión y día, con una tabla integrada de USD por 1M tokens fusionada con tu `config.prices`.
- **Gobernanza de presupuesto** — límites de sesión/diarios/mensuales; alerta de umbral `warnRatio` (webhook POST + indicador de notificación de escritorio) y tres políticas al superar el límite: `alert` (solo notificar), `block` (cortocircuitar nuevas solicitudes de modelo hasta que el usuario levante el bloqueo), `degrade` (bloqueo con guía correctiva que nombra el modelo más barato de tu mapa `degradation`).
- **Carbono y latencia** — puente token→carbono (tokens × kWh/token × PUE × intensidad de la red regional, portado de AI-Carbon-Footprint-Calculator) y percentiles de latencia por modelo.
- **Superficies** — pestaña Budget en Settings (barras de uso, curva de uso por día, desglose por modelo, alertas, editores de límites, botones de desbloqueo) y el comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Inicio rápido

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# o desde npm (versiones publicadas)
dsh plugin --profile web add dsh-budget

# 2. reinicia y verifica la fila
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Luego pide al agente: `/budget` — y observa cómo se llena la pestaña de Settings.

## Instalación y desinstalación

- **Canal git** (último `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` — el script `prepare` compila solo con dependencias de producción.
- **Canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-budget`.
- **Canal tarball**: `pnpm pack` en este repositorio y luego `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-budget`.

> Si pnpm informa `ERR_PNPM_IGNORED_BUILDS` para este paquete (la validación inofensiva del binario de plataforma de esbuild), añade `allowBuilds: { esbuild: true }` a tu `pnpm-workspace.yaml` — el CLI `dsh` imprime el fragmento exacto.

## Configuración

Todos los ajustes son campos `Config` de Schemastery (modificables desde cordis.yml). `cordis.patch.yml` documenta cada clave en línea.

| Clave | Por defecto | Significado |
|---|---|---|
| `prices` | `{}` | Precios USD por 1M tokens por modelo, fusionados sobre la tabla integrada |
| `defaultPrice` | `{input: 1.0, output: 3.0}` | Respaldo para modelos ausentes de ambas tablas |
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
- **Registro de sesión**: `budget/alert` y `budget/block` son eventos de auditoría solo-registro con nombres de ámbito e importes USD (diferidos por microtarea ante el guard de reentrada de append). En harness `0.1.2-alpha.5` y posteriores no se escriben — el vocabulario de eventos fail-closed rechaza logs con tipos de evento no registrados y no ofrece superficie de registro externa — así que el rastro de auditoría se degrada al logger de presupuesto y al webhook únicamente.

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
pnpm run typecheck:ci  # tsc contra los tipos publicados 0.1.2-alpha.5 (sin paths)
pnpm test           # vitest
pnpm run build      # declaraciones tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # las especificaciones de dependencias resuelven desde el registry
pnpm run verify:artifacts       # cara ESM + manifiesto typert + bundle de cliente
pnpm pack           # el tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creador y mantenedor: agregación, gobernanza de presupuesto, portes de carbono y latencia, la pestaña de Settings y la documentación en cinco idiomas.

## PerryLink DSH Plugin Family

Este proyecto es uno de los [33 complementos de DeepSeek Harness](https://github.com/PerryLink) mantenidos por [PerryLink](https://github.com/PerryLink). Si este te ayuda, probablemente los demás también:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | Auto-revisión de segundo modelo en la cadena de aprobación, con cierre en fallo por defecto | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | Agentes hijos en segundo plano durables con barra lateral de UI web, mensajería e interrupción | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Equivalente a /rewind de Claude Code: instantáneas, bifurcaciones de sesión, restauración de un solo uso | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Migra sesiones, memoria, habilidades y CLAUDE.md de Claude Code a DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | Control de escritorio nativo multiplataforma para DeepSeek Harness — Windows primero. | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Historial de entrada estilo terminal para el compositor web: flechas, búsqueda Ctrl+R | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | Comprobaciones de calidad de datasets y verificación de citas (el puente numérico opcional consumido aquí) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | Defensa contra inyección de prompts, jailbreak y fuga de secretos para DeepSeek Harness. | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | Guardián de disciplina de ingeniería: interrogatorio de requisitos, puertas de pruebas, revisión adversaria | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | Enrutamiento unificado de generación de imágenes estáticas para DeepSeek Harness. | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | Diagnóstico de rendimiento de solo lectura para DeepSeek Harness. | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | Informes de investigación deterministas para fondos mutuos públicos chinos | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | Integración de PR/issues de GitHub para DSH, cada escritura controlada por aprobación | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | Orquestación de investigación sectorial que sella sus entregables mediante el `ctx.researchReport.assemble` de este plugin | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | Base de conocimiento documental local para DeepSeek Harness. | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | Integración de modelos locales (Ollama) para DeepSeek Harness. | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | Diagnósticos, formato, autocompletado, acciones de código y renombrado LSP sobre servidores de lenguaje | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | Middleware de enmascaramiento de PII: anonimiza en el límite del modelo, restaura en la capa de visualización | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | Panel de tiempo de ejecución MCP de solo lectura: comando /mcp + pestaña Settings con estado, herramientas y errores | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | Memoria entre sesiones controlada por aprobación: costura ctx.memory + SQLite + herramienta de memoria | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | Exportador de observabilidad OpenTelemetry y Langfuse para DeepSeek Harness. | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Cambio de estilo en tiempo de ejecución equivalente a outputStyles de Claude Code | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Reglas de permisos declarativas allow/deny/ask estilo Claude Code con auditoría | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | Base de conocimiento de desarrollo de plugins como habilidad de agente bajo demanda | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | Motor de informes de investigación verificables con evidencia direccionada por contenido | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | Puntuación de calidad multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | Fija sesiones en la barra lateral web con orden durable | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | Sincronización de sesiones entre dispositivos para DeepSeek Harness — un espejo git dedicado de tu almacén de sesiones. | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | Paquete de habilidades de auditoría de seguridad: escaneo de secretos, revisión de dependencias y cadena de suministro | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | Bucle de sesión con voz para DeepSeek Harness: háblale y escucha su respuesta. | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | Pruebas de instalación y humo aisladas para plugins de DeepSeek Harness. | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | Traducción de parámetros entre proveedores y reparación determinista de JSON para DeepSeek Harness. | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
