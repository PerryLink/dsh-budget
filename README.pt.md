<div align="center">

# 💰 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-budget` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**Governança de custos para o DeepSeek Harness: orçamentos, carbono e latência em um só painel.**

*Saiba quanto cada sessão custa — antes que custe a você.*

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

## Compatibilidade

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.5` (adaptado em 2026-09-02): o envelope de sessão mantém seu campo ignorable apenas para compatibilidade de leitura de logs armazenados - o Session.append ainda não consegue estampá-lo, então o comportamento da porta não muda. |

| Eventos de auditoria | Gravados em harness anteriores a `0.1.2-alpha.5`; suprimidos com uma razão de degradação registrada em `0.1.2-alpha.5` e posteriores (vocabulário de eventos de sessão fail-closed, sem superfície de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
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
| `defaultPrice` | `{input: 1.0, output: 3.0}` | Reserva para modelos ausentes de ambas as tabelas |
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
- **Registro de sessão**: `budget/alert` e `budget/block` são eventos de auditoria somente-registro com nomes de escopo e valores USD (adiados por microtarefa ante o guard de reentrância do append). Em harness `0.1.2-alpha.5` e posteriores eles não são gravados — o vocabulário de eventos fail-closed rejeita logs com tipos de evento não registrados e não oferece superfície de registro externa — então o rastro de auditoria degrada apenas para o logger de orçamento e o webhook.

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
pnpm run typecheck:ci  # tsc contra os tipos publicados 0.1.2-alpha.5 (sem paths)
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

Este projeto é um dos [33 plugins de DeepSeek Harness](https://github.com/PerryLink) mantidos por [PerryLink](https://github.com/PerryLink). Se este ajuda você, os outros provavelmente também:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | Auto-revisão de segundo modelo na cadeia de aprovação, com falha fechada por padrão | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | Agentes filhos em segundo plano duráveis com barra lateral de UI web, mensagens e interrupção | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Equivalente ao /rewind do Claude Code: instantâneos, bifurcações de sessão, restauração de uso único | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Migre sessões, memória, habilidades e CLAUDE.md do Claude Code para o DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | Controle de desktop nativo multiplataforma para DeepSeek Harness — Windows primeiro. | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Histórico de entrada estilo terminal para o compositor web: setas, busca Ctrl+R | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | Verificações de qualidade de datasets e verificação de citações (a ponte numérica opcional consumida aqui) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | Defesa contra injeção de prompt, jailbreak e vazamento de segredos para DeepSeek Harness. | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | Guardião de disciplina de engenharia: sabatina de requisitos, portões de teste, revisão adversária | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | Roteamento unificado de geração de imagens estáticas para DeepSeek Harness. | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | Diagnóstico de desempenho só de leitura para DeepSeek Harness. | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | Relatórios de pesquisa deterministas para fundos mútuos públicos chineses | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | Integração de PR/issues do GitHub para o DSH, cada escrita controlada por aprovação | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | Orquestração de pesquisa setorial que sela as suas entregas através do `ctx.researchReport.assemble` deste plugin | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | Base de conhecimento documental local para DeepSeek Harness. | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | Integração de modelos locais (Ollama) para DeepSeek Harness. | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | Diagnósticos, formatação, autocompletar, ações de código e renomeação LSP sobre servidores de linguagem | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | Middleware de mascaramento de PII: anonimiza no limite do modelo, restaura na camada de exibição | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | Painel de tempo de execução MCP somente leitura: comando /mcp + aba Settings com status, ferramentas e erros | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | Memória entre sessões controlada por aprovação: costura ctx.memory + SQLite + ferramenta de memória | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | Exportador de observabilidade OpenTelemetry e Langfuse para DeepSeek Harness. | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Troca de estilo em tempo de execução equivalente ao outputStyles do Claude Code | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Regras de permissão declarativas allow/deny/ask estilo Claude Code com auditoria | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | Base de conhecimento de desenvolvimento de plugins como habilidade de agente sob demanda | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | Motor de relatórios de pesquisa verificáveis com evidência endereçada por conteúdo | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | Pontuação de qualidade multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | Fixe sessões na barra lateral web com ordenação durável | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | Sincronização de sessões entre dispositivos para DeepSeek Harness — um espelho git dedicado do seu armazenamento de sessões. | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | Pacote de habilidades de auditoria de segurança: varredura de segredos, revisão de dependências e cadeia de suprimentos | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | Loop de sessão com voz para DeepSeek Harness: fale e ouça a resposta. | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | Test drives isolados de instalação e smoke para plugins de DeepSeek Harness. | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | Tradução de parâmetros entre fornecedores e reparo determinístico de JSON para DeepSeek Harness. | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
