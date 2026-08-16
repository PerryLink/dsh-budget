<div align="center">

# 💰 dsh-budget

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
| Harness | DeepSeek Harness `0.1.0-rc.6` |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Superficies | Host + cliente Web (pestaña Budget en Settings); comando `/budget` |

## Qué obtienes

`dsh-budget` convierte el flujo de eventos de sesión en un ciclo de gobernanza de costos cuatro en uno:

- **Medición agregada** — tokens (entrada sin caché / salida / lectura de caché / escritura de caché), costo USD estimado y huella de carbono por modelo, sesión y día, con una tabla integrada de USD por 1M tokens fusionada con tu `config.prices`.
- **Gobernanza de presupuesto** — límites de sesión/diarios/mensuales; alerta de umbral `warnRatio` (webhook POST + indicador de notificación de escritorio) y tres políticas al superar el límite: `alert` (solo notificar), `block` (cortocircuitar nuevas solicitudes de modelo hasta que el usuario levante el bloqueo), `degrade` (bloqueo con guía correctiva que nombra el modelo más barato de tu mapa `degradation`).
- **Carbono y latencia** — puente token→carbono (tokens × kWh/token × PUE × intensidad de la red regional, portado de AI-Carbon-Footprint-Calculator) y percentiles de latencia por modelo.
- **Superficies** — pestaña Budget en Settings (barras de uso, desglose por modelo, alertas, editores de límites, botones de desbloqueo) y el comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

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

## Herramientas y superficies

| Superficie | Tipo | Notas |
|---|---|---|
| `/budget` | Comando | Resumen por ámbito (uso, ratio, carbono, estado bloqueado) |
| `/budget models` | Comando | Desglose por modelo con percentiles de latencia |
| `/budget unblock <scope>` | Comando | Levantar un ámbito bloqueado (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Pestaña de Settings | Barras de uso, desglose, alertas, editores de límites, desbloqueo |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | Canal del cliente (consumido por la pestaña) |

## Permisos y datos

- **Permisos**: `network:outbound` (solo el webhook de alerta opcional), `session:append` (eventos de auditoría), `native-code:none`.
- **Datos**: todo lo mostrado proviene del flujo de eventos de sesión; la única llamada de red es el webhook configurado, validado al cargar y sin credenciales en los registros. Ningún prompt o payload sale del host.
- **Registro de sesión**: `budget/alert` y `budget/block` son eventos de auditoría solo-registro con nombres de ámbito e importes USD (diferidos por microtarea ante el guard de reentrada de append).

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
pnpm run typecheck:ci  # tsc contra los tipos publicados 0.1.0-rc.6 (sin paths)
pnpm test           # vitest: 45 tests
pnpm run build      # declaraciones tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # las especificaciones de dependencias resuelven desde el registry
pnpm run verify:artifacts       # cara ESM + manifiesto typert + bundle de cliente
pnpm pack           # el tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creador y mantenedor: agregación, gobernanza de presupuesto, portes de carbono y latencia, la pestaña de Settings y la documentación en cinco idiomas.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
