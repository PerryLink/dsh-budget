<div align="center">

# 💰 dsh-budget

**DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और लेटेंसी एक ही पैनल में।**

*हर सत्र की लागत जानें — उससे पहले कि वह आप पर भारी पड़े।*

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

## संगतता

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `0.1.0-rc.6` |
| Node | `^22.19.0 \|\| >=24.0.0` |
| सतहें | Host + वेब क्लाइंट (Settings में Budget टैब); `/budget` कमांड |

## आपको क्या मिलता है

`dsh-budget` सत्र इवेंट स्ट्रीम को चार-में-एक लागत प्रशासन लूप में बदल देता है:

- **समग्र मीटरिंग** — टोकन (बिना-कैश इनपुट / आउटपुट / कैश-रीड / कैश-राइट), अनुमानित USD लागत और कार्बन पदचिह्न प्रति मॉडल, सत्र और दिन; बिल्ट-इन USD-प्रति-1M तालिका आपके `config.prices` से मर्ज होती है।
- **बजट प्रशासन** — सत्र/दैनिक/मासिक सीमाएँ; `warnRatio` थ्रेशोल्ड अलर्ट (वेबहुक POST + डेस्कटॉप-सूचना फ़्लैग) और सीमा पार होने पर तीन नीतियाँ: `alert` (केवल सूचित), `block` (उपयोगकर्ता द्वारा अनब्लॉक तक नए मॉडल अनुरोध रोकना), `degrade` (आपके `degradation` मैप के सस्ते मॉडल का नाम लेकर सुधारात्मक मार्गदर्शन सहित ब्लॉक)।
- **कार्बन और लेटेंसी** — टोकन→कार्बन पुल (टोकन × kWh/टोकन × PUE × क्षेत्रीय ग्रिड तीव्रता, AI-Carbon-Footprint-Calculator से पोर्टेड) और प्रति-मॉडल लेटेंसी प्रतिशतक।
- **सतहें** — Settings का Budget टैब (उपयोग बार, मॉडल विवरण, अलर्ट, सीमा संपादक, अनब्लॉक बटन) और `/budget` कमांड (`/budget`, `/budget models`, `/budget unblock <scope>`)।

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
| `defaultPrice` | `{input: 1.0, output: 3.0}` | दोनों तालिकाओं से अनुपस्थित मॉडलों का फ़ॉलबैक |
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

## टूल और सतहें

| सतह | प्रकार | टिप्पणियाँ |
|---|---|---|
| `/budget` | कमांड | प्रति-स्कोप अवलोकन (उपयोग, अनुपात, कार्बन, ब्लॉक स्थिति) |
| `/budget models` | कमांड | लेटेंसी प्रतिशतक सहित प्रति-मॉडल विवरण |
| `/budget unblock <scope>` | कमांड | ब्लॉक किए गए स्कोप को हटाना (`session` / `daily` / `monthly`) |
| Settings → Plugins → Budget | Settings टैब | उपयोग बार, मॉडल विवरण, अलर्ट, सीमा संपादक, अनब्लॉक बटन |
| `budget/status`, `budget/setSettings`, `budget/unblock` | Typert Remote | क्लाइंट चैनल (टैब इन्हें उपभोग करता है) |

## अनुमतियाँ और डेटा

- **अनुमतियाँ**: `network:outbound` (केवल वैकल्पिक अलर्ट वेबहुक), `session:append` (ऑडिट इवेंट), `native-code:none`।
- **डेटा**: दिखाई गई हर चीज़ सत्र इवेंट स्ट्रीम से आती है; होस्ट की एकमात्र नेटवर्क कॉल कॉन्फ़िगर किया वेबहुक है, जिसका URL लोड पर सत्यापित होता है और लॉग से पहले क्रेडेंशियल-रहित किया जाता है। कोई prompt या payload होस्ट से बाहर नहीं जाता।
- **सत्र लॉग**: `budget/alert` और `budget/block` केवल-लॉग ऑडिट इवेंट हैं जिनमें स्कोप नाम और USD राशियाँ होती हैं (session-append पुनर्प्रवेश गार्ड से बचने हेतु माइक्रोटास्क-विलंबित)।

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
pnpm run typecheck:ci  # tsc प्रकाशित 0.1.0-rc.6 प्रकारों के विरुद्ध (बिना paths)
pnpm test           # vitest: 45 टेस्ट
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

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित [29 DeepSeek Harness प्लगइनों](https://github.com/PerryLink) में से एक है। अगर यह आपकी मदद करता है, तो बाकी भी करेंगे:

| Plugin | One-liner |
|---|---|
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | अनुमोदन श्रृंखला पर दूसरे मॉडल से स्वतः-समीक्षा, डिफ़ॉल्ट रूप से असफल-बंद |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Web UI साइडबार, संदेश और रुकावट के साथ स्थायी पृष्ठभूमि चाइल्ड एजेंट |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और विलंबता एक पैनल में। |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-समतुल्य: स्नैपशॉट, सत्र फोर्क, एक-बार पुनर्स्थापन |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Claude Code सत्र, स्मृति, skills और CLAUDE.md को DSH में स्थानांतरित करें |
| [dsh-click](https://github.com/PerryLink/dsh-click) | DeepSeek Harness के लिए क्रॉस-प्लेटफ़ॉर्म नेटिव डेस्कटॉप नियंत्रण — Windows पहले। |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Web कंपोज़र के लिए टर्मिनल-शैली इनपुट इतिहास: तीर, Ctrl+R खोज |
| [dsh-defend](https://github.com/PerryLink/dsh-defend) | DeepSeek Harness के लिए प्रॉम्प्ट-इंजेक्शन, जेलब्रेक और सीक्रेट-लीक रक्षा। |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | इंजीनियरिंग-अनुशासन गार्ड: आवश्यकताएँ पूछताछ, परीक्षण द्वार, विरोधी समीक्षा |
| [dsh-draw](https://github.com/PerryLink/dsh-draw) | DeepSeek Harness के लिए एकीकृत स्थैतिक-छवि निर्माण रूटिंग। |
| [dsh-fast](https://github.com/PerryLink/dsh-fast) | DeepSeek Harness के लिए केवल-पठन प्रदर्शन निदान। |
| [dsh-github](https://github.com/PerryLink/dsh-github) | DSH के लिए GitHub PR/issues एकीकरण, हर लेखन अनुमोदन-द्वारित |
| [dsh-library](https://github.com/PerryLink/dsh-library) | DeepSeek Harness के लिए स्थानीय दस्तावेज़ ज्ञानकोश। |
| [dsh-local-ai](https://github.com/PerryLink/dsh-local-ai) | DeepSeek Harness के लिए स्थानीय-मॉडल (Ollama) एकीकरण। |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | भाषा सर्वरों पर LSP निदान, फ़ॉर्मेटिंग, पूर्णता, कोड क्रियाएँ और नाम बदलना |
| [dsh-mask](https://github.com/PerryLink/dsh-mask) | DeepSeek Harness के लिए PII मास्किंग मिडलवेयर — मॉडल तक पहुँचने से पहले व्यक्तिगत डेटा अनाम करता है, प्रदर्शन परत पर बहाल करता है। |
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | केवल-पठन MCP रनटाइम पैनल: /mcp कमांड + स्थिति, टूल और त्रुटियों वाला सेटिंग टैब |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | अनुमोदन-द्वारित क्रॉस-सत्र स्मृति: ctx.memory seam + SQLite + memory टूल |
| [dsh-observe](https://github.com/PerryLink/dsh-observe) | DeepSeek Harness के लिए OpenTelemetry और Langfuse अवलोकनीयता निर्यातक। |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-समतुल्य रनटाइम शैली स्विचिंग |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-शैली घोषणात्मक allow/deny/ask अनुमति नियम, ऑडिट के साथ |
| [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) | माँग-पर एजेंट स्किल के रूप में प्लगइन-विकास ज्ञानकोश |
| [dsh-score](https://github.com/PerryLink/dsh-score) | DeepSeek Harness प्लगइनों के लिए बहु-आयामी गुणवत्ता स्कोरिंग। |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Web साइडबार में सत्र पिन करें, स्थायी क्रम के साथ |
| [dsh-session-sync](https://github.com/PerryLink/dsh-session-sync) | DeepSeek Harness के लिए क्रॉस-डिवाइस सत्र सिंक — आपके सत्र स्टोर का एक समर्पित git मिरर। |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | सुरक्षा-ऑडिट स्किल पैक: सीक्रेट स्कैन, निर्भरता और आपूर्ति-श्रृंखला समीक्षा |
| [dsh-talk](https://github.com/PerryLink/dsh-talk) | DeepSeek Harness के लिए आवाज़-प्रथम सत्र लूप: बोलें और उत्तर सुनें। |
| [dsh-test-drive](https://github.com/PerryLink/dsh-test-drive) | DeepSeek Harness प्लगइनों के लिए पृथक इंस्टॉल-और-स्मोक परीक्षण। |
| [dsh-translate](https://github.com/PerryLink/dsh-translate) | DeepSeek Harness के लिए वेंडर पैरामीटर अनुवाद और नियतात्मक JSON मरम्मत। |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors
