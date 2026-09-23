<div align="center">

# 💰 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-budget` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**Governança de custos para o DeepSeek Harness: orçamentos, carbono e latência em um só painel.**

*Saiba quanto cada sessão custa — antes que custe a você.*

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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-budget?metric=downloads&lang=pt)](https://dshfind.com/pt/plugins/PerryLink/dsh-budget?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

---

## Compatibilidade

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.7-alpha.2` (GitHub tag, adaptado em 2026-09-18; faixa de peer `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`): os preços do catálogo alpha.2 estão embutidos na tabela e modelos sem preço aparecem como "sem preço" em vez de uma estimativa inventada; a porta de auditoria continua suprimindo os appends `budget/alert`/`budget/block` (vocabulário de eventos de sessão fail-closed). Verificado em 2026-09-18 pela cadeia typecheck de duas réguas e pela porta local completa; os itens do painel no navegador ficam 人工·未测即未完成 (checklist manual do mantenedor). |

| Eventos de auditoria | Gravados em harness anteriores a `0.1.2-rc.1`; suprimidos com uma razão de degradação registrada em `0.1.2-rc.1` e posteriores (vocabulário de eventos de sessão fail-closed, sem superfície de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
| Superfícies | Host + cliente Web (aba Budget em Settings); comando `/budget` |

## O que você ganha

O `dsh-budget` transforma o fluxo de eventos da sessão em um ciclo de governança de custos quatro em um:

- **Medição agregada** — tokens (entrada sem cache / saída / leitura de cache / escrita de cache), custo USD estimado e pegada de carbono por modelo, sessão e dia, precificados por uma tabela integrada de USD por 1M de tokens mesclada com `config.prices`.
- **Governança de orçamento** — tetos de sessão/diários/mensais; alerta de limiar `warnRatio` (webhook POST + indicador de notificação de desktop) e três políticas ao estourar: `alert` (apenas notificar), `block` (curto-circuitar novas requisições até o usuário liberar), `degrade` (bloqueio com orientação corretiva nomeando o modelo mais barato do seu mapa `degradation`).
- **Carbono e latência** — ponte token→carbono (tokens × kWh/token × PUE × intensidade da rede regional, portado do AI-Carbon-Footprint-Calculator) e percentis de latência por modelo.
- **Superfícies** — a aba Budget em Settings (barras de uso, curva de uso por dia, detalhamento por modelo, alertas, editores de teto, botões de desbloqueio) e o comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

## Início rápido

```sh
# 1. instale o bundle no seu perfil
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# ou pelo npm (versões publicadas)
dsh plugin --profile web add dsh-budget

# 2. reinicie e verifique a linha
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Então peça ao agente: `/budget` — e veja a aba de Settings se preencher.

## Instalação e desinstalação

- **Canal git** (último `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` — o script `prepare` compila apenas com dependências de produção.
- **Canal npm** (versões publicadas): `dsh plugin --profile web add dsh-budget`.
- **Canal tarball**: `pnpm pack` neste repositório e então `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-budget`.

> Se o pnpm reportar `ERR_PNPM_IGNORED_BUILDS` para este pacote (a validação inofensiva do binário de plataforma do esbuild), adicione `allowBuilds: { esbuild: true }` ao seu `pnpm-workspace.yaml` — o CLI `dsh` imprime o trecho exato.

## Configuração

Todos os ajustes são campos `Config` do Schemastery (alteráveis pelo cordis.yml). O `cordis.patch.yml` documenta cada chave em linha.

| Chave | Padrão | Significado |
|---|---|---|
| `prices` | `{}` | Preços USD por 1M de tokens por modelo, mesclados sobre a tabela integrada |
| `defaultPrice` | sinal sem preço (`priced: false`, números zerados) | Reserva para modelos ausentes de ambas as tabelas: por padrão contribui 0 para a contabilidade e aparece como "sem preço"; defina números com `priced: true` para precificar explicitamente |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | Tetos de orçamento USD por escopo; omitir para ilimitado |
| `warnRatio` | `0.8` | Alertar quando o uso atingir esta fração do teto (0..1) |
| `overLimit` | `alert` | `alert` / `block` / `degrade` após cruzar um teto |
| `degradation` | `{}` | Id de modelo → id de modelo mais barato do mesmo provedor |
| `webhookUrl` | *(nenhuma)* | URL opcional de webhook para alertas de limiar (POST JSON) |
| `webhookTimeoutMs` | `5000` | Timeout da requisição webhook |
| `alertsEnabled` | `true` | Interruptor mestre dos alertas de limiar |
| `alertCooldownMs` | `3600000` | Mínimo em ms entre dois alertas do mesmo escopo |
| `desktopNotifications` | `false` | Notificações de desktop do navegador com a aba aberta |
| `refreshIntervalMs` | `5000` | Intervalo de sondagem da aba |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | Ponte de carbono (regiões: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | Percentis de latência por modelo e sua janela |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | Moeda de exibição (custos calculados em USD) |
| `outputLanguage` | `en` | Idioma de saída do `/budget`: `en` / `zh` |
| `historyDays` | `30` | Dias de histórico de uso diário no snapshot |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | Persistência durável diária/mensal entre reinícios (domínio de armazenamento); degrada para em-memória se o domínio estiver ausente |

## Ferramentas e superfícies

| Superfície | Tipo | Notas |
|---|---|---|
| `/budget` | Comando | Visão geral por escopo (uso, proporção, carbono, estado bloqueado) |
| `/budget models` | Comando | Detalhamento por modelo com percentis de latência |
| `/budget unblock <scope>` | Comando | Liberar um escopo bloqueado (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Aba de Settings | Barras de uso, curva de uso por dia, detalhamento, alertas, editores de teto, desbloqueio |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | Canal do cliente (consumido pela aba) |

## Permissões e dados

- **Permissões**: `network:outbound` (apenas o webhook de alerta opcional), `session:append` (eventos de auditoria), `native-code:none`.
- **Dados**: tudo exibido vem do fluxo de eventos da sessão; a única chamada de rede é o webhook configurado, validado ao carregar e sem credenciais nos registros. Nenhum prompt ou payload sai do host.
- **Registro de sessão**: `budget/alert` e `budget/block` são eventos de auditoria somente-registro com nomes de escopo e valores USD (adiados por microtarefa ante o guard de reentrância do append). Em harness `0.1.2-rc.1` e posteriores eles não são gravados — o vocabulário de eventos fail-closed rejeita logs com tipos de evento não registrados e não oferece superfície de registro externa — então o rastro de auditoria degrada apenas para o logger de orçamento e o webhook.

## Limites de segurança

- **Sem fabricação**: um bloqueio de orçamento produz um final de erro corretivo no waterfall `llm/stream` — o plugin nunca inventa saída de modelo.
- **Sem reescrita de requisições**: requisições do loop são congeladas; `degrade` nomeia o modelo alvo na mensagem corretiva em vez de substituir a requisição.
- **Falha ruidosa**: preços, URLs, proporções, regiões ou limites inválidos falham o mount.
- **Escopo honesto**: edições em tempo de execução do painel valem por sessão; uma recarga restaura os valores do cordis.yml.

## Limitações conhecidas

- A agregação é local ao processo: o uso zera ao reiniciar o harness (os buckets diários/mensais se reconstroem da visão atual do log).
- `block`/`degrade` dependem do waterfall `llm/stream`; builds sem esse seam não podem bloquear requisições (alertas continuam funcionando).
- Os preços integrados ficam defasados; sobrescreva entradas via `config.prices`.

## Desenvolvimento

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra o checkout local do harness
pnpm run typecheck:ci  # tsc contra os tipos publicados 0.1.7-alpha.2 (sem paths)
pnpm test           # vitest
pnpm run build      # declarações tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # especificações de dependências resolvem pelo registry
pnpm run verify:artifacts       # face ESM + manifesto typert + bundle de cliente
pnpm pack           # o tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — criador e mantenedor: agregação, governança de orçamento, portes de carbono e latência, a aba de Settings e a documentação em cinco idiomas.

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

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
