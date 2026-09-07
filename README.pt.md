<div align="center">

# 馃挵 dsh-budget
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-budget` (conta para o ranking de instala莽玫es do [deepseek1024.com](https://deepseek1024.com)).

**Governan莽a de custos para o DeepSeek Harness: or莽amentos, carbono e lat锚ncia em um s贸 painel.**

*Saiba quanto cada sess茫o custa 鈥?antes que custe a voc锚.*

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

## Compatibilidade

| Superf铆cie | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.3-alpha.1` (GitHub tag, verificado em 2026-09-06; pin npm `0.1.2-rc.1` adaptado em 2026-09-02; faixa de peer `>=0.1.2-rc.1 <0.2.0`): o envelope de sess茫o mant茅m seu campo ignorable apenas para compatibilidade de leitura de logs armazenados - o Session.append ainda n茫o consegue estamp谩-lo, ent茫o o comportamento da porta n茫o muda. Verificado em 2026-09-06 contra o checkout master dsh-v0.1.3-alpha.1 (cadeia completa de portas + smoke de instala莽茫o de perfil). |

| Eventos de auditoria | Gravados em harness anteriores a `0.1.2-rc.1`; suprimidos com uma raz茫o de degrada莽茫o registrada em `0.1.2-rc.1` e posteriores (vocabul谩rio de eventos de sess茫o fail-closed, sem superf铆cie de registro externa) || Node | `^22.19.0 \|\| >=24.0.0` |
| Superf铆cies | Host + cliente Web (aba Budget em Settings); comando `/budget` |

## O que voc锚 ganha

O `dsh-budget` transforma o fluxo de eventos da sess茫o em um ciclo de governan莽a de custos quatro em um:

- **Medi莽茫o agregada** 鈥?tokens (entrada sem cache / sa铆da / leitura de cache / escrita de cache), custo USD estimado e pegada de carbono por modelo, sess茫o e dia, precificados por uma tabela integrada de USD por 1M de tokens mesclada com `config.prices`.
- **Governan莽a de or莽amento** 鈥?tetos de sess茫o/di谩rios/mensais; alerta de limiar `warnRatio` (webhook POST + indicador de notifica莽茫o de desktop) e tr锚s pol铆ticas ao estourar: `alert` (apenas notificar), `block` (curto-circuitar novas requisi莽玫es at茅 o usu谩rio liberar), `degrade` (bloqueio com orienta莽茫o corretiva nomeando o modelo mais barato do seu mapa `degradation`).
- **Carbono e lat锚ncia** 鈥?ponte token鈫抍arbono (tokens 脳 kWh/token 脳 PUE 脳 intensidade da rede regional, portado do AI-Carbon-Footprint-Calculator) e percentis de lat锚ncia por modelo.
- **Superf铆cies** 鈥?a aba Budget em Settings (barras de uso, curva de uso por dia, detalhamento por modelo, alertas, editores de teto, bot玫es de desbloqueio) e o comando `/budget` (`/budget`, `/budget models`, `/budget unblock <scope>`).

## In铆cio r谩pido

```sh
# 1. instale o bundle no seu perfil
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# ou pelo npm (vers玫es publicadas)
dsh plugin --profile web add dsh-budget

# 2. reinicie e verifique a linha
dsh --profile web --dump-config | grep -A2 'id: budget'
```

Ent茫o pe莽a ao agente: `/budget` 鈥?e veja a aba de Settings se preencher.

## Instala莽茫o e desinstala莽茫o

- **Canal git** (煤ltimo `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` 鈥?o script `prepare` compila apenas com depend锚ncias de produ莽茫o.
- **Canal npm** (vers玫es publicadas): `dsh plugin --profile web add dsh-budget`.
- **Canal tarball**: `pnpm pack` neste reposit贸rio e ent茫o `dsh plugin --profile web add ./dsh-budget-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-budget`.

> Se o pnpm reportar `ERR_PNPM_IGNORED_BUILDS` para este pacote (a valida莽茫o inofensiva do bin谩rio de plataforma do esbuild), adicione `allowBuilds: { esbuild: true }` ao seu `pnpm-workspace.yaml` 鈥?o CLI `dsh` imprime o trecho exato.

## Configura莽茫o

Todos os ajustes s茫o campos `Config` do Schemastery (alter谩veis pelo cordis.yml). O `cordis.patch.yml` documenta cada chave em linha.

| Chave | Padr茫o | Significado |
|---|---|---|
| `prices` | `{}` | Pre莽os USD por 1M de tokens por modelo, mesclados sobre a tabela integrada |
| `defaultPrice` | `{input: 1.0, output: 3.0}` | Reserva para modelos ausentes de ambas as tabelas |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | Tetos de or莽amento USD por escopo; omitir para ilimitado |
| `warnRatio` | `0.8` | Alertar quando o uso atingir esta fra莽茫o do teto (0..1) |
| `overLimit` | `alert` | `alert` / `block` / `degrade` ap贸s cruzar um teto |
| `degradation` | `{}` | Id de modelo 鈫?id de modelo mais barato do mesmo provedor |
| `webhookUrl` | *(nenhuma)* | URL opcional de webhook para alertas de limiar (POST JSON) |
| `webhookTimeoutMs` | `5000` | Timeout da requisi莽茫o webhook |
| `alertsEnabled` | `true` | Interruptor mestre dos alertas de limiar |
| `alertCooldownMs` | `3600000` | M铆nimo em ms entre dois alertas do mesmo escopo |
| `desktopNotifications` | `false` | Notifica莽玫es de desktop do navegador com a aba aberta |
| `refreshIntervalMs` | `5000` | Intervalo de sondagem da aba |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | Ponte de carbono (regi玫es: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | Percentis de lat锚ncia por modelo e sua janela |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | Moeda de exibi莽茫o (custos calculados em USD) |
| `outputLanguage` | `en` | Idioma de sa铆da do `/budget`: `en` / `zh` |
| `historyDays` | `30` | Dias de hist贸rico de uso di谩rio no snapshot |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | Persist锚ncia dur谩vel di谩ria/mensal entre rein铆cios (dom铆nio de armazenamento); degrada para em-mem贸ria se o dom铆nio estiver ausente |

## Ferramentas e superf铆cies

| Superf铆cie | Tipo | Notas |
|---|---|---|
| `/budget` | Comando | Vis茫o geral por escopo (uso, propor莽茫o, carbono, estado bloqueado) |
| `/budget models` | Comando | Detalhamento por modelo com percentis de lat锚ncia |
| `/budget unblock <scope>` | Comando | Liberar um escopo bloqueado (`session` / `daily` / `monthly`) |
| Settings 鈫?Plugins 鈫?Budget | Aba de Settings | Barras de uso, curva de uso por dia, detalhamento, alertas, editores de teto, desbloqueio |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | Canal do cliente (consumido pela aba) |

## Permiss玫es e dados

- **Permiss玫es**: `network:outbound` (apenas o webhook de alerta opcional), `session:append` (eventos de auditoria), `native-code:none`.
- **Dados**: tudo exibido vem do fluxo de eventos da sess茫o; a 煤nica chamada de rede 茅 o webhook configurado, validado ao carregar e sem credenciais nos registros. Nenhum prompt ou payload sai do host.
- **Registro de sess茫o**: `budget/alert` e `budget/block` s茫o eventos de auditoria somente-registro com nomes de escopo e valores USD (adiados por microtarefa ante o guard de reentr芒ncia do append). Em harness `0.1.2-rc.1` e posteriores eles n茫o s茫o gravados 鈥?o vocabul谩rio de eventos fail-closed rejeita logs com tipos de evento n茫o registrados e n茫o oferece superf铆cie de registro externa 鈥?ent茫o o rastro de auditoria degrada apenas para o logger de or莽amento e o webhook.

## Limites de seguran莽a

- **Sem fabrica莽茫o**: um bloqueio de or莽amento produz um final de erro corretivo no waterfall `llm/stream` 鈥?o plugin nunca inventa sa铆da de modelo.
- **Sem reescrita de requisi莽玫es**: requisi莽玫es do loop s茫o congeladas; `degrade` nomeia o modelo alvo na mensagem corretiva em vez de substituir a requisi莽茫o.
- **Falha ruidosa**: pre莽os, URLs, propor莽玫es, regi玫es ou limites inv谩lidos falham o mount.
- **Escopo honesto**: edi莽玫es em tempo de execu莽茫o do painel valem por sess茫o; uma recarga restaura os valores do cordis.yml.

## Limita莽玫es conhecidas

- A agrega莽茫o 茅 local ao processo: o uso zera ao reiniciar o harness (os buckets di谩rios/mensais se reconstroem da vis茫o atual do log).
- `block`/`degrade` dependem do waterfall `llm/stream`; builds sem esse seam n茫o podem bloquear requisi莽玫es (alertas continuam funcionando).
- Os pre莽os integrados ficam defasados; sobrescreva entradas via `config.prices`.

## Desenvolvimento

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra o checkout local do harness
pnpm run typecheck:ci  # tsc contra os tipos publicados 0.1.2-rc.1 (sem paths)
pnpm test           # vitest
pnpm run build      # declara莽玫es tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # especifica莽玫es de depend锚ncias resolvem pelo registry
pnpm run verify:artifacts       # face ESM + manifesto typert + bundle de cliente
pnpm pack           # o tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) 鈥?criador e mantenedor: agrega莽茫o, governan莽a de or莽amento, portes de carbono e lat锚ncia, a aba de Settings e a documenta莽茫o em cinco idiomas.

## PerryLink DSH Plugin Family

Este projeto 茅 um dos [37 plugins de DeepSeek Harness](https://github.com/PerryLink) mantidos por [PerryLink](https://github.com/PerryLink). Se este ajuda voc锚, os outros provavelmente tamb茅m:

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Auto-revis茫o de segundo modelo na cadeia de aprova莽茫o, com falha fechada por padr茫o | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Agentes filhos em segundo plano dur谩veis com barra lateral de UI web, mensagens e interrup莽茫o | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Equivalente ao /rewind do Claude Code: instant芒neos, bifurca莽玫es de sess茫o, restaura莽茫o de uso 煤nico | |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migre sess玫es, mem贸ria, habilidades e CLAUDE.md do Claude Code para o DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Controle de desktop nativo multiplataforma para DeepSeek Harness 鈥?Windows primeiro. | |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Hist贸rico de entrada estilo terminal para o compositor web: setas, busca Ctrl+R | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Verifica莽玫es de qualidade de datasets e verifica莽茫o de cita莽玫es (a ponte num茅rica opcional consumida aqui) | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Defesa contra inje莽茫o de prompt, jailbreak e vazamento de segredos para DeepSeek Harness. | |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Guardi茫o de disciplina de engenharia: sabatina de requisitos, port玫es de teste, revis茫o advers谩ria | |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Roteamento unificado de gera莽茫o de imagens est谩ticas para DeepSeek Harness. | |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Diagn贸stico de desempenho s贸 de leitura para DeepSeek Harness. | |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Relat贸rios de pesquisa deterministas para fundos m煤tuos p煤blicos chineses | |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | Integra莽茫o de PR/issues do GitHub para o DSH, cada escrita controlada por aprova莽茫o | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Orquestra莽茫o de pesquisa setorial que sela as suas entregas atrav茅s do `ctx.researchReport.assemble` deste plugin | |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Base de conhecimento documental local para DeepSeek Harness. | |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Integra莽茫o de modelos locais (Ollama) para DeepSeek Harness. | |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | Diagn贸sticos, formata莽茫o, autocompletar, a莽玫es de c贸digo e renomea莽茫o LSP sobre servidores de linguagem | |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | Middleware de mascaramento de PII: anonimiza no limite do modelo, restaura na camada de exibi莽茫o | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Painel de tempo de execu莽茫o MCP somente leitura: comando /mcp + aba Settings com status, ferramentas e erros | |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Mem贸ria entre sess玫es controlada por aprova莽茫o: costura ctx.memory + SQLite + ferramenta de mem贸ria | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | Exportador de observabilidade OpenTelemetry e Langfuse para DeepSeek Harness. | |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Troca de estilo em tempo de execu莽茫o equivalente ao outputStyles do Claude Code | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Regras de permiss茫o declarativas allow/deny/ask estilo Claude Code com auditoria | |
| **[dsh-personal-directive](https://github.com/PerryLink/dsh-personal-directive)** | Injetor de diretivas pessoais com altern芒ncia na barra superior (edi莽茫o framework) |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Base de conhecimento de desenvolvimento de plugins como habilidade de agente sob demanda | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Ponte multicanal de aprova莽茫o/perguntas: WeChat/Telegram/Feishu, console de sess茫o |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Motor de relat贸rios de pesquisa verific谩veis com evid锚ncia endere莽ada por conte煤do | |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Pontua莽茫o de qualidade multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Fixe sess玫es na barra lateral web com ordena莽茫o dur谩vel | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Sincroniza莽茫o de sess玫es entre dispositivos para DeepSeek Harness 鈥?um espelho git dedicado do seu armazenamento de sess玫es. | |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Pacote de habilidades de auditoria de seguran莽a: varredura de segredos, revis茫o de depend锚ncias e cadeia de suprimentos | |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Loop de sess茫o com voz para DeepSeek Harness: fale e ou莽a a resposta. | |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Test drives isolados de instala莽茫o e smoke para plugins de DeepSeek Harness. | |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | Ponte de tarefas TickTick/Dida365: painel no cabe莽alho da sess茫o + 11 ferramentas |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Tradu莽茫o de par芒metros entre fornecedores e reparo determin铆stico de JSON para DeepSeek Harness. | |
| **[dsh-wechat](https://github.com/PerryLink/dsh-wechat)** | Ponte WeChat 鈫?DSH (bot Tencent iLink): texto/imagem/arquivo/voz, aprova莽玫es no chat |

## License

[Apache License 2.0](LICENSE) 漏 2026 dsh-budget contributors

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market 鈫?Sources 鈫?add source 鈫?colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **鈫?selecionar**. A instala莽茫o continua passando pela verifica莽茫o de identidade npm do mercado e pela sua confirma莽茫o.
