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

```sh
dsh plugin --profile <name> add dsh-budget
```


</div>

---


**📖 इकोसिस्टम नॉलेज बेस** — मापे गए आँकड़े, मार्केटिंग नहीं: [डेवलपमेंट गाइड · चयन डेटा · रखरखाव मानदंड](https://perrylink.github.io/dsh-plugin-guide/)।

<!-- star-cta -->

## इंस्टॉल और अनइंस्टॉल

- **git चैनल** (नवीनतम `main`): `dsh plugin --profile web add github:PerryLink/dsh-budget` — `prepare` स्क्रिप्ट केवल प्रोडक्शन निर्भरताओं से बिल्ड करती है।
- **npm चैनल** (प्रकाशित रिलीज़): `dsh plugin --profile web add dsh-budget`।
- **tarball चैनल**: इस रेपो में `pnpm pack`, फिर `dsh plugin --profile web add ./dsh-budget-<version>.tgz`।
- **अनइंस्टॉल**: `dsh plugin --profile web remove dsh-budget`।

> यदि pnpm इस पैकेज के लिए `ERR_PNPM_IGNORED_BUILDS` दिखाता है (esbuild का हानिरहित प्लेटफ़ॉर्म-बाइनरी सत्यापन), तो अपने `pnpm-workspace.yaml` में `allowBuilds: { esbuild: true }` जोड़ें — `dsh` CLI सटीक स्निपेट प्रिंट करता है।

## What is dsh-budget?

DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और लेटेंसी एक ही पैनल में।

हर सत्र की लागत जानें — उससे पहले कि वह आप पर भारी पड़े।

![dsh-budget का टर्मिनल डेमो: dsh-budget — install, then /budget and /budget models](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-hero.png)

![Animated terminal demo of dsh-budget](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-demo.gif)

*वही रन, एनिमेटेड।*

## रखरखाव स्थिति: 🧊 फ़्रीज़

> **2026-10-05 से फ़्रीज़। कोई नई सुविधा नहीं।** यह पैकेज अभी भी काम करता है और **सेवानिवृत्त नहीं है**, पर अब इसमें नई सुविधाओं का काम नहीं होगा; केवल वास्तविक खराबी ठीक की जाएगी।

रखरखावकर्ताओं का मानना है कि इस क्षमता में **अधिक अपनाए गए विकल्प अब मौजूद हैं**, इसलिए प्रयास अन्यत्र स्थानांतरित किया गया। 2026-10-05 को मापी गई तुलना:

| | पैकेज | साप्ताहिक डाउनलोड |
|---|---|---|
| **यह पैकेज** | `dsh-budget` | 1,079 |
| अधिक अपनाया गया विकल्प | [`dsh-cost-meter`](https://github.com/Han-1413141/dsh-cost-meter) | **33,526** |
| अन्य विकल्प | `dsh-usage-stats` | not measured |
| अन्य विकल्प | `@dougen/dsh-deepseek-usage` | 6,019 |

👉 **नए काम के लिए dsh-cost-meter को प्राथमिकता दें।** मौजूदा इंस्टॉल बिना किसी बदलाव के काम करते रहेंगे।

*पूर्ण प्रमाण: `dsh-plugin-supersession-review-20261005.md`। पूरा पाठ [README.md](README.md) के **Maintenance status: 🧊 FROZEN** अनुभाग में।*

## ⭐ 如果它帮到了你

यह प्लगइन [DSH प्लगइन परिवार](https://github.com/PerryLink) का हिस्सा है (95 प्लगइन, सभी Apache-2.0)। अगर यह उपयोगी लगे, तो **एक स्टार दें** — इससे कोई सुविधा अनलॉक नहीं होती, पर अगला व्यक्ति इसे खोज में आसानी से पा लेता है।

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## Comparison

![dsh-budget का मापा गया तुलना चार्ट](https://raw.githubusercontent.com/PerryLink/dsh-budget/main/docs/assets/dsh-budget-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## संगतता

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (GitHub tag, 2026-09-25 को अनुकूलित; peer रेंज `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`): alpha.2 कैटलॉग कीमतें तालिका में अंतर्निहित हैं और अज्ञात मॉडल मनगढ़ंत अनुमान के बजाय "unpriced" के रूप में दिखते हैं; ऑडिट गेट `budget/alert`/`budget/block` appends को दबाना जारी रखता है (fail-closed सत्र इवेंट शब्दावली)। 2026-09-25 को दो-रूलर typecheck श्रृंखला और पूर्ण स्थानीय गेट द्वारा सत्यापित; ब्राउज़र पैनल आइटम 人工·未测即未完成 (अनुरक्षक मैनुअल चेकलिस्ट) रहते हैं। |

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
dsh plugin --profile web add github:PerryLink/dsh-budget
```

```sh
# 1. बंडल को अपने प्रोफ़ाइल में इंस्टॉल करें
dsh plugin --profile web add github:PerryLink/dsh-budget

# या npm से (प्रकाशित रिलीज़)
dsh plugin --profile web add dsh-budget

# 2. पुनः आरंभ करें और पंक्ति सत्यापित करें
dsh --profile web --dump-config | grep -A2 'id: budget'
```

फिर एजेंट से कहें: `/budget` — और Settings टैब को भरते देखें।

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
pnpm run typecheck:ci  # tsc प्रकाशित 0.1.7-rc.2 प्रकारों के विरुद्ध (बिना paths)
pnpm test           # vitest
pnpm run build      # tsc घोषणाएँ + tsdown बंडल (lib/)
pnpm run verify:self-contained  # निर्भरता स्पेक registry से हल होती हैं
pnpm run verify:artifacts       # ESM फ़ेस + typert मैनिफ़ेस्ट + क्लाइंट बंडल
pnpm pack           # प्रकाशित tarball
```

## अन्य DSH प्लगइनों के साथ अंतर-संचालनीयता

**DSH `0.2.0-rc.2`** (वह रनटाइम जिसके लिए यह README प्रकाशित है) और 2026-10-05 को सर्वे किए गए उच्च-स्टार प्लगइन सेट के विरुद्ध सत्यापित।

यह प्लगइन अन्य प्लगइनों में **हस्तक्षेप नहीं करता**, उन उच्च-स्टार प्लगइनों सहित जो व्यापक रूप से इंस्टॉल हैं:

- **कोई टूल-नाम टकराव नहीं।** सभी टूल नेमस्पेस युक्त हैं; कोई भी ऐसा नंगा नाम नहीं लेता जो पहले से किसी अंतर्निहित टूल या अन्य प्लगइन का हो।
- **कोई सर्विस-की टकराव नहीं।** यह केवल `budget` प्रदान करता है; यह key न अंतर्निहित सीम है और न किसी सर्वे किए गए उच्च-स्टार प्लगइन द्वारा प्रदान की जाती है।
- **कोई स्लॉट टकराव नहीं।** यह कोई क्लाइंट slot key पंजीकृत नहीं करता, इसलिए `shadows-shipped-ui` सीट के लिए प्रतिस्पर्धा नहीं करता।
- **कोई HTTP रूट टकराव नहीं।** यह कोई `webServer` प्रीफ़िक्स पंजीकृत नहीं करता।
- **कोई patch-लेयर टकराव नहीं।** बंडल patch केवल अपनी पंक्ति `insert` करता है; कभी किसी अंतर्निहित पंक्ति का `config` ओवरराइड नहीं करता।
- **कोई वैश्विक परिवर्तन नहीं।** यह प्रोटोटाइप नहीं बदलता, `process.env` नहीं लिखता, और वैश्विक fetch dispatcher प्रतिस्थापित नहीं करता।

**साझा ईवेंट लिसनर रचना से ही अहस्तक्षेपी हैं।** यह क्रम-संवेदनशील ईवेंट `llm/stream` को `ctx.on()` से देखता है — Cordis का **ब्रॉडकास्ट** पंजीकरण, जहाँ हर लिसनर चलता है और कोई किसी दूसरे को वंचित नहीं कर सकता। **यहाँ प्रत्येक लिसनर `next()` से डेलिगेट करता है**, इसलिए श्रृंखला कभी शॉर्ट-सर्किट नहीं होती:
  - `llm/stream` — also used by `dsh-routing-suite` (7000★).

स्थैतिक प्रमाण: इस रिपॉज़िटरी पर `dsh-plugin-doctor` के K10–K13 सभी `pass` हैं।

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — निर्माता और मेंटेनर: एग्रीगेशन, बजट प्रशासन, कार्बन और लेटेंसी पोर्ट, Settings टैब और पाँच-भाषा दस्तावेज़।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) के **87 सक्रिय रूप से अनुरक्षित** DeepSeek Harness प्लगइन में से एक है। पूरा परिवार **95** प्लगइन है — **5 फ़्रोज़न**, **3 सेवानिवृत्त** — और नीचे संक्षिप्त रखा गया है ताकि हर README की पहली स्क्रीन छोटी रहे। हर पंक्ति देखने के लिए इसे खोलें; कारण स्थिति कॉलम में है।

<details>
<summary>सभी 95 प्लगइन खोलें</summary>

| प्लगइन | एक पंक्ति | स्थिति |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## License

[Apache License 2.0](LICENSE) © 2026 dsh-budget contributors

### DSH Desktop मार्केट से इंस्टॉल करें

सभी PerryLink प्लगइन DSH Desktop के बिल्ट-इन मार्केट में देखे जा सकते हैं: **Market → Sources → add source → पेस्ट करें** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ चुनें**। इंस्टॉलेशन मार्केट के npm-identity सत्यापन और आपकी पुष्टि से ही होता है।
