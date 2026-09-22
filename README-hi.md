<div align="center">

# 💰 dsh-budget
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-budget` ([deepseek1024.com](https://deepseek1024.com) इंस्टॉल रैंकिंग में गिना जाता है)।

**DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और लेटेंसी एक ही पैनल में।**

*हर सत्र की लागत जानें — उससे पहले कि वह आप पर भारी पड़े।*

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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-budget?metric=downloads&lang=hi)](https://dshfind.com/hi/plugins/PerryLink/dsh-budget?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

---

## संगतता

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.7-alpha.1` (GitHub tag, 2026-09-18 को अनुकूलित; peer रेंज `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0`): alpha.2 कैटलॉग कीमतें तालिका में अंतर्निहित हैं और अज्ञात मॉडल मनगढ़ंत अनुमान के बजाय "unpriced" के रूप में दिखते हैं; ऑडिट गेट `budget/alert`/`budget/block` appends को दबाना जारी रखता है (fail-closed सत्र इवेंट शब्दावली)। 2026-09-18 को दो-रूलर typecheck श्रृंखला और पूर्ण स्थानीय गेट द्वारा सत्यापित; ब्राउज़र पैनल आइटम 人工·未测即未完成 (अनुरक्षक मैनुअल चेकलिस्ट) रहते हैं। |

| ऑडिट इवेंट | `0.1.2-rc.1` से पहले के harness पर लिखे जाते हैं; `0.1.2-rc.1` और बाद में दबाए जाते हैं और डिग्रेडेशन कारण लॉग होता है (fail-closed सत्र इवेंट शब्दावली, कोई बाहरी पंजीकरण सतह नहीं) || Node | `^22.19.0 \|\| >=24.0.0` |
| सतहें | Host + वेब क्लाइंट (Settings में Budget टैब); `/budget` कमांड |

## आपको क्या मिलता है

`dsh-budget` सत्र इवेंट स्ट्रीम को चार-में-एक लागत प्रशासन लूप में बदल देता है:

- **समग्र मीटरिंग** — टोकन (बिना-कैश इनपुट / आउटपुट / कैश-रीड / कैश-राइट), अनुमानित USD लागत और कार्बन पदचिह्न प्रति मॉडल, सत्र और दिन; बिल्ट-इन USD-प्रति-1M तालिका आपके `config.prices` से मर्ज होती है।
- **बजट प्रशासन** — सत्र/दैनिक/मासिक सीमाएँ; `warnRatio` थ्रेशोल्ड अलर्ट (वेबहुक POST + डेस्कटॉप-सूचना फ़्लैग) और सीमा पार होने पर तीन नीतियाँ: `alert` (केवल सूचित), `block` (उपयोगकर्ता द्वारा अनब्लॉक तक नए मॉडल अनुरोध रोकना), `degrade` (आपके `degradation` मैप के सस्ते मॉडल का नाम लेकर सुधारात्मक मार्गदर्शन सहित ब्लॉक)।
- **कार्बन और लेटेंसी** — टोकन→कार्बन पुल (टोकन × kWh/टोकन × PUE × क्षेत्रीय ग्रिड तीव्रता, AI-Carbon-Footprint-Calculator से पोर्टेड) और प्रति-मॉडल लेटेंसी प्रतिशतक।
- **सतहें** — Settings का Budget टैब (उपयोग बार, दैनिक उपयोग वक्र, मॉडल विवरण, अलर्ट, सीमा संपादक, अनब्लॉक बटन) और `/budget` कमांड (`/budget`, `/budget models`, `/budget unblock <scope>`)।

## त्वरित शुरुआत

```sh
# 1. बंडल को अपने प्रोफ़ाइल में इंस्टॉल करें
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# या npm से (प्रकाशित रिलीज़)
dsh plugin --profile web add dsh-budget

# 2. पुनः आरंभ करें और पंक्ति सत्यापित करें
dsh --profile web --dump-config | grep -A2 'id: budget'
```

फिर एजेंट से कहें: `/budget` — और Settings टैब को भरते देखें।

## इंस्टॉल और अनइंस्टॉल

- **git चैनल** (नवीनतम `main`): `dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` — `prepare` स्क्रिप्ट केवल प्रोडक्शन निर्भरताओं से बिल्ड करती है।
- **npm चैनल** (प्रकाशित रिलीज़): `dsh plugin --profile web add dsh-budget`।
- **tarball चैनल**: इस रेपो में `pnpm pack`, फिर `dsh plugin --profile web add ./dsh-budget-<version>.tgz`।
- **अनइंस्टॉल**: `dsh plugin --profile web remove dsh-budget`।

> यदि pnpm इस पैकेज के लिए `ERR_PNPM_IGNORED_BUILDS` दिखाता है (esbuild का हानिरहित प्लेटफ़ॉर्म-बाइनरी सत्यापन), तो अपने `pnpm-workspace.yaml` में `allowBuilds: { esbuild: true }` जोड़ें — `dsh` CLI सटीक स्निपेट प्रिंट करता है।

## कॉन्फ़िगरेशन

सभी समायोजन Schemastery `Config` फ़ील्ड हैं (cordis.yml से बदले जा सकते हैं)। `cordis.patch.yml` हर कुंजी को इनलाइन समझाता है।

| कुंजी | डिफ़ॉल्ट | अर्थ |
|---|---|---|
| `prices` | `{}` | प्रति मॉडल USD प्रति 1M टोकन, बिल्ट-इन तालिका पर मर्ज |
| `defaultPrice` | unpriced संकेत (`priced: false`, शून्य संख्याएँ) | दोनों तालिकाओं से अनुपस्थित मॉडलों का फ़ॉलबैक: डिफ़ॉल्ट लेखांकन में 0 योगदान देता है और "unpriced" के रूप में दिखता है; अज्ञात मॉडलों को स्पष्ट रूप से मूल्य देने के लिए `priced: true` के साथ संख्याएँ सेट करें |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | प्रति स्कोप USD बजट सीमा; असीमित के लिए हटाएँ |
| `warnRatio` | `0.8` | उपयोग सीमा के इस अंश तक पहुँचने पर अलर्ट (0..1) |
| `overLimit` | `alert` | सीमा पार होने पर: `alert` / `block` / `degrade` |
| `degradation` | `{}` | मॉडल id → उसी प्रदाता के सस्ते मॉडल id |
| `webhookUrl` | *(कोई नहीं)* | थ्रेशोल्ड अलर्ट के लिए वैकल्पिक वेबहुक URL (POST JSON) |
| `webhookTimeoutMs` | `5000` | वेबहुक अनुरोध टाइमआउट |
| `alertsEnabled` | `true` | थ्रेशोल्ड अलर्ट का मास्टर स्विच |
| `alertCooldownMs` | `3600000` | एक ही स्कोप के दो अलर्ट के बीच न्यूनतम ms |
| `desktopNotifications` | `false` | टैब खुला होने पर ब्राउज़र डेस्कटॉप सूचनाएँ |
| `refreshIntervalMs` | `5000` | Settings टैब पोलिंग अंतराल |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | कार्बन पुल (क्षेत्र: global, us, eu, china, india, uk, france, iceland) |
| `latency.enabled` / `windowSize` | `true` / `200` | प्रति-मॉडल लेटेंसी प्रतिशतक और उनकी विंडो |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | प्रदर्शन मुद्रा (लागत USD में गणित) |
| `outputLanguage` | `en` | `/budget` आउटपुट भाषा: `en` / `zh` |
| `historyDays` | `30` | स्नैपशॉट में रखे प्रति-दिन उपयोग इतिहास के दिन |
| `persistence.enabled` / `intervalMs` | `true` / `10000` | पुनरारंभ के बीच टिकाऊ दैनिक/मासिक संग्रहण (स्टोरेज डोमेन); डोमेन अनुपस्थित होने पर इन-मेमोरी में पतन |

## टूल और सतहें

| सतह | प्रकार | टिप्पणियाँ |
|---|---|---|
| `/budget` | कमांड | प्रति-स्कोप अवलोकन (उपयोग, अनुपात, कार्बन, ब्लॉक स्थिति) |
| `/budget models` | कमांड | लेटेंसी प्रतिशतक सहित प्रति-मॉडल विवरण |
| `/budget unblock <scope>` | कमांड | ब्लॉक किए गए स्कोप को हटाना (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Settings टैब | उपयोग बार, दैनिक उपयोग वक्र, मॉडल विवरण, अलर्ट, सीमा संपादक, अनब्लॉक बटन |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | क्लाइंट चैनल (टैब इन्हें उपभोग करता है) |

## अनुमतियाँ और डेटा

- **अनुमतियाँ**: `network:outbound` (केवल वैकल्पिक अलर्ट वेबहुक), `session:append` (ऑडिट इवेंट), `native-code:none`।
- **डेटा**: दिखाई गई हर चीज़ सत्र इवेंट स्ट्रीम से आती है; होस्ट की एकमात्र नेटवर्क कॉल कॉन्फ़िगर किया वेबहुक है, जिसका URL लोड पर सत्यापित होता है और लॉग से पहले क्रेडेंशियल-रहित किया जाता है। कोई prompt या payload होस्ट से बाहर नहीं जाता।
- **सत्र लॉग**: `budget/alert` और `budget/block` केवल-लॉग ऑडिट इवेंट हैं जिनमें स्कोप नाम और USD राशियाँ होती हैं (session-append पुनर्प्रवेश गार्ड से बचने हेतु माइक्रोटास्क-विलंबित)। `0.1.2-rc.1` और बाद के harness पर ये नहीं लिखे जाते — fail-closed इवेंट शब्दावली अपंजीकृत इवेंट प्रकार वाले लॉग को अस्वीकार करती है और कोई बाहरी पंजीकरण सतह नहीं देती — इसलिए ऑडिट ट्रेल केवल बजट लॉगर और webhook तक सीमित रहता है।

## सुरक्षा सीमाएँ

- **कोई मनगढ़ंत आउटपुट नहीं**: बजट ब्लॉक `llm/stream` वॉटरफॉल पर सुधारात्मक त्रुटि finish उत्पन्न करता है — प्लगइन कभी मॉडल आउटपुट गढ़ता नहीं।
- **अनुरोध पुनर्लेखन नहीं**: लूप-निर्मित अनुरोध फ़्रीज़ होते हैं; `degrade` अनुरोध बदलने के बजाय सुधारात्मक संदेश में लक्ष्य मॉडल का नाम देता है।
- **तेज़ विफलता**: अमान्य कीमतें, URL, अनुपात, क्षेत्र और सीमाएँ माउंट पर विफल होती हैं।
- **ईमानदार दायरा**: पैनल के रनटाइम संपादन केवल सत्र-स्तरीय हैं; रीलोड cordis.yml मान पुनर्स्थापित करता है।

## ज्ञात सीमाएँ

- एग्रीगेशन प्रोसेस-लोकल है: हार्नेस पुनः आरंभ पर उपयोग शून्य होता है (दैनिक/मासिक बकेट वर्तमान लॉग दृश्य से पुनर्निर्मित होते हैं)।
- `block`/`degrade` `llm/stream` वॉटरफॉल पर निर्भर हैं; इस seam के बिना बिल्ड अनुरोध नहीं रोक सकते (अलर्ट फिर भी काम करते हैं)।
- बिल्ट-इन कीमतें पुरानी पड़ जाती हैं; `config.prices` से प्रविष्टियाँ ओवरराइड करें।

## विकास

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests स्थानीय हार्नेस चेकआउट के विरुद्ध
pnpm run typecheck:ci  # tsc प्रकाशित 0.1.5-rc.2 प्रकारों के विरुद्ध (बिना paths)
pnpm test           # vitest
pnpm run build      # tsc घोषणाएँ + tsdown बंडल (lib/)
pnpm run verify:self-contained  # निर्भरता स्पेक registry से हल होती हैं
pnpm run verify:artifacts       # ESM फ़ेस + typert मैनिफ़ेस्ट + क्लाइंट बंडल
pnpm pack           # प्रकाशित tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — निर्माता और मेंटेनर: एग्रीगेशन, बजट प्रशासन, कार्बन और लेटेंसी पोर्ट, Settings टैब और पाँच-भाषा दस्तावेज़।

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

### DSH Desktop मार्केट से इंस्टॉल करें

सभी PerryLink प्लगइन DSH Desktop के बिल्ट-इन मार्केट में देखे जा सकते हैं: **Market → Sources → add source → पेस्ट करें** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ चुनें**। इंस्टॉलेशन मार्केट के npm-identity सत्यापन और आपकी पुष्टि से ही होता है।
