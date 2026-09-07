<div align="center">

# 馃挵 dsh-budget
- **1024 鍟嗗簵娓犻亾**锛氬厛 `npm i -g dsh1024`锛屽啀 `dsh1024 plugin --profile web add dsh-budget`锛堣鍏?[deepseek1024.com](https://deepseek1024.com) 瀹夎鎺掕锛夈€?

**DeepSeek Harness 鐨勬垚鏈不鐞嗭細棰勭畻銆佺⒊瓒宠抗涓庡欢杩燂紝涓€涓潰鏉垮叏瑙堛€?*

*璁╂瘡娆′細璇濈殑鎴愭湰鍦ㄨ秴鏀箣鍓嶅氨琚湅娓呫€?

> **瀹樻柟浠撳簱銆?* 鏈粨搴撴槸 dsh-budget 鐨勫敮涓€瀹樻柟浠撳簱锛岀敱 PerryLink 缁存姢銆傚叾浠栬处鍙蜂笅鐨勫悓鍚嶄粨搴撲笌鏈」鐩棤鍏炽€?

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

## 鍏煎鎬?

| 鏂归潰 | 鐘舵€?|
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.3-alpha.1`锛圙itHub tag锛?026-09-06 鏍搁獙锛沶pm 閽夊彿 `0.1.2-rc.1`锛?026-09-02 宸查€傞厤锛沺eer 鑼冨洿 `>=0.1.2-rc.1 <0.2.0`锛夛細浼氳瘽淇″皝淇濈暀 ignorable 瀛楁浣嗕粎鐢ㄤ簬瀛橀噺鏃ュ織璇诲彇鍏煎鈥斺€擲ession.append 浠嶆棤娉曠洊绔狅紝闂ㄦ帶琛屼负涓嶅彉銆傚凡浜?2026-09-06 瀵圭収 dsh-v0.1.3-alpha.1 master 妫€鍑烘牳楠岋紙瀹屾暣闂ㄧ閾?+ profile 瀹夎鍐掔儫锛夈€?|

| 瀹¤浜嬩欢 | `0.1.2-rc.1` 涔嬪墠鐨勫涓讳笂鍐欏叆锛涘湪 `0.1.2-rc.1` 鍙婁互鍚庢姂鍒跺苟璁板綍闄嶇骇鍘熷洜锛坒ail-closed 浼氳瘽浜嬩欢璇嶈〃锛屾棤澶栭儴娉ㄥ唽闈級 || Node | `^22.19.0 \|\| >=24.0.0` |
| 鐣岄潰 | Host + Web 瀹㈡埛绔紙璁剧疆椤甸绠楅〉绛撅級锛沗/budget` 鍛戒护 |

## 浣犺兘寰楀埌浠€涔?

`dsh-budget` 鎶婁細璇濅簨浠舵祦鍙樻垚鍥涘悎涓€鎴愭湰娌荤悊闂幆锛?

- **鑱氬悎璁￠噺** 鈥斺€?token锛堟湭缂撳瓨杈撳叆 / 杈撳嚭 / 缂撳瓨璇?/ 缂撳瓨鍐欙級銆佷及绠?USD 鎴愭湰涓庣⒊瓒宠抗锛屾寜妯″瀷/浼氳瘽/澶╄仛鍚堬紱鍐呯疆 USD/鐧句竾 token 浠风洰琛ㄤ笌 `config.prices` 鍚堝苟瀹氫环銆?
- **棰勭畻娌荤悊** 鈥斺€?浼氳瘽/鏃?鏈堜笁妗ｅ皝椤讹紱warnRatio 闃堝€煎憡璀︼紙webhook POST + 妗岄潰閫氱煡寮€鍏筹級涓庝笁绉嶈秴闄愮瓥鐣ワ細`alert`锛堜粎鍛婅锛夈€乣block`锛堝湪鐢ㄦ埛瑙ｉ櫎鍓嶇煭璺柊妯″瀷璇锋眰锛夈€乣degrade`锛堥樆鏂苟缁欏嚭鎸囧悜 `degradation` 鏄犲皠涓洿渚垮疁妯″瀷鐨勪慨姝ｆ彁绀猴級銆?
- **纰宠冻杩逛笌寤惰繜** 鈥斺€?token鈫掔⒊妗ユ帴锛坱okens 脳 kWh/token 脳 PUE 脳 鍖哄煙鐢电綉寮哄害锛岀Щ妞嶈嚜 AI-Carbon-Footprint-Calculator锛変笌鎸夋ā鍨嬪欢杩熺櫨鍒嗕綅銆?
- **鐣岄潰** 鈥斺€?璁剧疆椤甸绠楅〉绛撅紙鐢ㄩ噺鏉°€佹寜澶╃敤閲忔洸绾裤€佹ā鍨嬫槑缁嗐€佸憡璀︺€佷笂闄愮紪杈戙€佽В闄ら樆鏂寜閽級涓?`/budget` 鍛戒护锛坄/budget`銆乣/budget models`銆乣/budget unblock <scope>`锛夈€?

## 蹇€熷紑濮?

```sh
# 1. 鎶?bundle 瑁呰繘浣犵殑 profile
dsh plugin --profile web add "github:PerryLink/dsh-budget#main"

# 鎴栦粠 npm 瀹夎锛堟寮忓彂甯冪増锛?
dsh plugin --profile web add dsh-budget

# 2. 閲嶅惎骞舵牳瀹炶
dsh --profile web --dump-config | grep -A2 'id: budget'
```

鐒跺悗鍦ㄤ細璇濋噷杈撳叆 `/budget`锛屽苟鍦ㄨ缃〉鏌ョ湅棰勭畻椤电銆?

## 瀹夎涓庡嵏杞?

- **git 閫氶亾**锛堟渶鏂?`main`锛夛細`dsh plugin --profile web add "github:PerryLink/dsh-budget#main"` 鈥斺€?`prepare` 鑴氭湰浠呯敤鐢熶骇渚濊禆鏋勫缓銆?
- **npm 閫氶亾**锛堟寮忓彂甯冪増锛夛細`dsh plugin --profile web add dsh-budget`銆?
- **tarball 閫氶亾**锛氬湪鏈粨搴撴墽琛?`pnpm pack`锛岀劧鍚?`dsh plugin --profile web add ./dsh-budget-<version>.tgz`銆?
- **鍗歌浇**锛歚dsh plugin --profile web remove dsh-budget`銆?

> 濡傛灉 pnpm 瀵规湰鍖呮姤 `ERR_PNPM_IGNORED_BUILDS`锛坋sbuild 鐨勫钩鍙颁簩杩涘埗鏃犲鏍￠獙锛夛紝鍦ㄤ綘鐨?`pnpm-workspace.yaml` 涓姞鍏?`allowBuilds: { esbuild: true }` 鈥斺€?`dsh` CLI 浼氭墦鍗扮‘鍒囩墖娈点€?

## 閰嶇疆

鎵€鏈夊彲璋冮」閮芥槸 Schemastery `Config` 瀛楁锛堝彲鍦?cordis.yml 涓慨鏀癸級銆俙cordis.patch.yml` 鍐呰仈璇存槑姣忎釜閿€?

| 閿?| 榛樿鍊?| 鍚箟 |
|---|---|---|
| `prices` | `{}` | 姣忔ā鍨?USD/鐧句竾 token 浠锋牸锛屽悎骞惰鐩栧唴缃环鐩〃 |
| `defaultPrice` | `{input: 1.0, output: 3.0}` | 涓よ〃鍧囨棤璇ユā鍨嬫椂鐨勫洖閫€浠锋牸 |
| `budgets.session` / `daily` / `monthly` | `10` / `50` / `500` | 鍚勪綔鐢ㄥ煙 USD 棰勭畻涓婇檺锛涚己鐪佽〃绀轰笉闄?|
| `warnRatio` | `0.8` | 鐢ㄩ噺杈惧埌涓婇檺璇ユ瘮渚嬫椂鍛婅锛?..1锛?|
| `overLimit` | `alert` | 瓒呴檺鍚庣瓥鐣ワ細`alert` / `block` / `degrade` |
| `degradation` | `{}` | 妯″瀷 id 鈫?鍚屽巶鍟嗘洿渚垮疁妯″瀷 id 鐨勬槧灏?|
| `webhookUrl` | *(鏃?* | 鍙€夐槇鍊煎憡璀?webhook URL锛圥OST JSON锛?|
| `webhookTimeoutMs` | `5000` | webhook 璇锋眰瓒呮椂 |
| `alertsEnabled` | `true` | 闃堝€煎憡璀︽€诲紑鍏?|
| `alertCooldownMs` | `3600000` | 鍚屼竴浣滅敤鍩熶袱娆″憡璀︾殑鏈€灏忛棿闅旓紙ms锛?|
| `desktopNotifications` | `false` | 椤电鎵撳紑鏃剁殑娴忚鍣ㄦ闈㈤€氱煡 |
| `refreshIntervalMs` | `5000` | 璁剧疆椤电杞闂撮殧 |
| `carbon.enabled` / `region` / `pue` / `energyKwhPerToken` | `true` / `global` / `1.58` / `0.000007` | 纰虫ˉ鎺ワ紙鍖哄煙锛歡lobal, us, eu, china, india, uk, france, iceland锛?|
| `latency.enabled` / `windowSize` | `true` / `200` | 鎸夋ā鍨嬪欢杩熺櫨鍒嗕綅涓庡叾绐楀彛 |
| `currency` | `{code: USD, rate: 1.0, decimals: 2}` | 灞曠ず璐у竵锛堟垚鏈互 USD 璁＄畻锛屼粎灞曠ず鎹㈢畻锛?|
| `outputLanguage` | `en` | `/budget` 杈撳嚭璇█锛歚en` / `zh` |
| `historyDays` | `30` | 闈㈡澘蹇収淇濈暀鐨勬寜澶╃敤閲忓巻鍙插ぉ鏁?|
| `persistence.enabled` / `intervalMs` | `true` / `10000` | 鏃?鏈堢敤閲忚法閲嶅惎鎸佷箙鍖栵紙storage 鍩燂級锛涘煙缂哄け鏃堕檷绾т负杩涚▼鍐呰仛鍚?|

## 宸ュ叿涓庣晫闈?

| 鐣岄潰 | 绫诲瀷 | 璇存槑 |
|---|---|---|
| `/budget` | 鍛戒护 | 鍚勪綔鐢ㄥ煙姒傝锛堢敤閲忋€佹瘮渚嬨€佺⒊瓒宠抗銆侀樆鏂姸鎬侊級 |
| `/budget models` | 鍛戒护 | 鎸夋ā鍨嬫槑缁?+ 寤惰繜鐧惧垎浣?|
| `/budget unblock <scope>` | 鍛戒护 | 瑙ｉ櫎鏌愪綔鐢ㄥ煙闃绘柇锛坄session` / `daily` / `monthly`锛?|
| 璁剧疆 鈫?鎻掍欢 鈫?棰勭畻 | 璁剧疆椤电 | 鐢ㄩ噺鏉°€佹寜澶╃敤閲忔洸绾裤€佹ā鍨嬫槑缁嗐€佸憡璀︺€佷笂闄愮紪杈戙€佽В闄ら樆鏂寜閽?|
| `budget/status`銆乣budget/setSettings`銆乣budget/unblock` | Typert Remote | 瀹㈡埛绔€氶亾锛堥〉绛炬秷璐硅繖浜涙柟娉曪級 |

## 鏉冮檺涓庢暟鎹?

- **鏉冮檺**锛歚network:outbound`锛堜粎鍙€夊憡璀?webhook锛夈€乣session:append`锛堝璁′簨浠讹級銆乣native-code:none`銆?
- **鏁版嵁**锛氬睍绀哄唴瀹瑰叏閮ㄦ潵鑷細璇濅簨浠舵祦锛涗富鏈轰晶鍞竴缃戠粶璋冪敤鏄厤缃殑 webhook锛孶RL 鍦ㄥ姞杞芥椂鏍￠獙銆佸叆鏃ュ織鍓嶅墺绂诲嚟鎹€備换浣?prompt/杞借嵎閮戒笉浼氱寮€涓绘満銆?
- **浼氳瘽鏃ュ織**锛歚budget/alert` 涓?`budget/block` 鏄粎鏃ュ織瀹¤浜嬩欢锛屽彧鎼哄甫浣滅敤鍩熷悕涓?USD 閲戦锛堝井浠诲姟寤跺悗浠ョ粫杩囦細璇?append 閲嶅叆淇濇姢锛夈€傚湪 `0.1.2-rc.1` 鍙婁互鍚庣殑瀹夸富涓婁笉鍐嶅啓鍏モ€斺€攆ail-closed 浜嬩欢璇嶈〃浼氭嫆缁濆惈鏈敞鍐屼簨浠剁被鍨嬬殑鏃ュ織锛屼笖娌℃湁澶栭儴娉ㄥ唽闈⑩€斺€斿璁¤建杩瑰洜姝や粎闄嶇骇鍒伴绠楁棩蹇椾笌 webhook銆?

## 瀹夊叏杈圭晫

- **涓嶄吉閫犳暟鎹?*锛氶绠楅樆鏂湪 `llm/stream` 鐎戝竷涓婁骇鍑轰慨姝ｆ€ч敊璇?finish 鈥斺€?鎻掍欢缁濅笉缂栭€犳ā鍨嬭緭鍑恒€?
- **涓嶆敼鍐欒姹?*锛歭oop 鏋勫缓鐨勮姹傝鍐荤粨锛沗degrade` 鍥犳鍦ㄤ慨姝ｆ秷鎭腑鐐瑰悕鐩爣妯″瀷锛岃€岄潪鏇挎崲璇锋眰銆?
- **澶辫触澶у０**锛氶潪娉曚环鏍笺€乁RL銆佹瘮渚嬨€佸尯鍩熶笌杈圭晫鍦ㄦ寕杞芥椂鍗冲け璐ャ€?
- **濡傚疄浣滅敤鍩?*锛氶潰鏉跨殑杩愯鏃剁紪杈戜粎浼氳瘽绾х敓鏁堬紱閲嶈浇鍚庢仮澶?cordis.yml 閰嶇疆銆?

## 宸茬煡闄愬埗

- 鑱氬悎涓鸿繘绋嬫湰鍦帮細harness 閲嶅惎鍚庣敤閲忔竻闆讹紙鏃?鏈堟《浠庡綋鍓嶄細璇濇棩蹇楄鍥鹃噸寤猴級銆?
- `block`/`degrade` 渚濊禆 `llm/stream` 鐎戝竷锛涙棤姝?seam 鐨勬瀯寤烘棤娉曢樆鏂姹傦紙鍛婅浠嶆湁鏁堬級銆?
- 鍐呯疆浠风洰浼氭紓绉伙紱鐢?`config.prices` 瑕嗙洊鏉＄洰銆?

## 寮€鍙?

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc锛歴rc + tests锛屽鐓ф湰鍦?harness checkout
pnpm run typecheck:ci  # tsc锛氬鐓у凡鍙戝竷鐨?0.1.2-rc.1 绫诲瀷锛堟棤 paths锛?
pnpm test           # vitest
pnpm run build      # tsc 澹版槑 + tsdown bundles锛坙ib/锛?
pnpm run verify:self-contained  # 渚濊禆澹版槑鍏ㄩ儴鏉ヨ嚜 registry
pnpm run verify:artifacts       # 鏋勫缓浜х墿 ESM 闈?+ typert manifest + 瀹㈡埛绔?bundle
pnpm pack           # 鍙戝竷鐢?tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `budget`, `cost-tracking`, `carbon-footprint`, `latency-benchmark`, `token-usage`

## Contributors

- [@PerryLink](https://github.com/PerryLink) 鈥斺€?鍒涘缓鑰呬笌缁存姢鑰咃細鑱氬悎銆侀绠楁不鐞嗐€佺⒊瓒宠抗涓庡欢杩熺Щ妞嶃€佽缃〉绛句笌浜旇鏂囨。銆?

## PerryLink DSH Plugin Family

杩欐槸 [PerryLink](https://github.com/PerryLink) 缁存姢鐨?[37 涓?DeepSeek Harness 鎻掍欢](https://github.com/PerryLink) 涔嬩竴銆傚鏋滃畠鑳藉府鍒颁綘锛屽叾浠栫殑涔熶細锛?

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | 瀹℃壒閾句笂鐨勭浜屾ā鍨嬭嚜鍔ㄥ鏌ワ紝榛樿澶辫触鍏抽棴 | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 甯?Web UI 渚ф爮銆佹秷鎭笌涓柇鐨勬寔涔呭悗鍙板瓙浠ｇ悊 | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind 绛変环锛氬揩鐓с€佷細璇?fork銆佷竴娆℃€ф仮澶?| |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 鎶?Claude Code 浼氳瘽銆佽蹇嗐€佹妧鑳戒笌 CLAUDE.md 杩佸叆 DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | 璺ㄥ钩鍙板師鐢熸闈㈡帶鍒讹紙DeepSeek Harness锛夛紝Windows 浼樺厛銆?| |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Web 杈撳叆妗嗙殑缁堢寮忓巻鍙诧細鏂瑰悜閿€丆trl+R 鎼滅储 | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 鏁版嵁闆嗚川閲忔鏌ヤ笌寮曟枃鏍告煡锛堟湰鎻掍欢鍙€夋秷璐圭殑鏁板瓧鏍告煡妗ワ級 | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | DeepSeek Harness 鐨勬彁绀烘敞鍏ャ€佽秺鐙变笌瀵嗛挜娉勯湶闃叉姢銆?| |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | 宸ョ▼绾緥瀹堝崼锛氶渶姹傝川璇€佹祴璇曢棬绂併€佸鎵嬭瘎瀹?| |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | DeepSeek Harness 鐨勭粺涓€闈欐€佸浘鍍忕敓鎴愯矾鐢便€?| |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | DeepSeek Harness 鍙鎬ц兘璇婃柇銆?| |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | 闈㈠悜涓浗鍏嫙鍩洪噾鐨勭‘瀹氭€х爺绌舵姤鍛?| |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | 闈㈠悜 DSH 鐨?GitHub PR/issues 闆嗘垚锛屾瘡娆″啓鍏ョ粡瀹℃壒闂ㄦ帶 | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | 琛屼笟鐮旂┒缂栨帓锛岀粡鏈彃浠剁殑 `ctx.researchReport.assemble` 灏佸瓨浜や粯鐗?| |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | DeepSeek Harness 鐨勬湰鍦版枃妗ｇ煡璇嗗簱銆?| |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | DeepSeek Harness 鐨勬湰鍦版ā鍨嬶紙Ollama锛夋帴鍏ャ€?| |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | 閫氳繃璇█鏈嶅姟鍣ㄧ殑 LSP 璇婃柇銆佹牸寮忓寲銆佽ˉ鍏ㄣ€佷唬鐮佹搷浣滀笌閲嶅懡鍚?| |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII 鑴辨晱涓棿浠讹細妯″瀷杈圭晫鍖垮悕鍖栥€佸睍绀哄眰杩樺師 | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | 鍙 MCP 杩愯鏃堕潰鏉匡細/mcp 鍛戒护 + 甯︾姸鎬併€佸伐鍏蜂笌閿欒鐨?Settings 鏍囩椤?| |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 瀹℃壒闂ㄦ帶鐨勮法浼氳瘽璁板繂锛歝tx.memory 鎺ョ紳 + SQLite + 璁板繂宸ュ叿 | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | DeepSeek Harness 鐨?OpenTelemetry 涓?Langfuse 鍙娴嬪鍑哄櫒銆?| |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles 绛変环鐨勮繍琛屾椂椋庢牸鍒囨崲 | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code 椋庢牸澹版槑寮?allow/deny/ask 鏉冮檺瑙勫垯锛屽甫瀹¤ | |
| **[dsh-personal-directive](https://github.com/PerryLink/dsh-personal-directive)** | 涓汉鎸囦护娉ㄥ叆鍣細椤舵爮寮€鍏筹紙妗嗘灦鐗堬級 |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | 浣滀负鎸夐渶浠ｇ悊鎶€鑳界殑鎻掍欢寮€鍙戠煡璇嗗簱 | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 澶氭笭閬撳鎵?鎻愰棶妗ユ帴锛氬井淇?Telegram/椋炰功锛屼細璇濇帶鍒跺彴 |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | 鍙獙璇佺爺绌舵姤鍛婂紩鎿庯細鍐呭瀵诲潃璇佹嵁璐︽湰涓庡皝瀛樼増鏈?| |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | DeepSeek Harness 鎻掍欢鐨勫缁磋川閲忚瘎鍒嗐€?| |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 鍦?Web 渚ф爮缃《浼氳瘽锛屽甫鎸佷箙鎺掑簭 | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | DeepSeek Harness 鐨勮法璁惧浼氳瘽鍚屾鈥斺€斾細璇濆瓨鍌ㄧ殑涓撶敤 git 闀滃儚銆?| |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | 瀹夊叏瀹¤鎶€鑳藉寘锛氬瘑閽ユ壂鎻忋€佷緷璧栦笌渚涘簲閾惧鏌?| |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | DeepSeek Harness 鐨勮闊充紭鍏堜細璇濋棴鐜細瀵瑰畠璇达紝鍚畠绛斻€?| |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | DeepSeek Harness 鎻掍欢鐨勯殧绂昏瘯瑁呭啋鐑熴€?| |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/婊寸瓟娓呭崟浠诲姟妗ユ帴锛氫細璇濆ご闈㈡澘 + 11 涓伐鍏?|
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | DeepSeek Harness 鐨勫巶鍟嗗弬鏁扮炕璇戜笌纭畾鎬?JSON 淇銆?| |
| **[dsh-wechat](https://github.com/PerryLink/dsh-wechat)** | 寰俊 鈫?DSH 妗ユ帴锛圱encent iLink 鏈哄櫒浜猴級锛氭枃鏈?鍥剧墖/鏂囦欢/璇煶锛岃亰澶╁唴瀹℃壒鍗＄墖 |

## License

[Apache License 2.0](LICENSE) 漏 2026 dsh-budget contributors

### 浠?DSH Desktop 甯傚満瀹夎

鎵€鏈?PerryLink 鎻掍欢鍧囧彲鍦?DSH Desktop 鍐呯疆甯傚満涓祻瑙堬細**甯傚満 鈫?鏉ユ簮 鈫?娣诲姞鏉ユ簮 鈫?绮樿创** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **鈫?閫変腑**銆傚畨瑁呬粛闇€閫氳繃甯傚満鐨?npm 韬唤鏍￠獙涓庝綘鐨勭‘璁ゃ€?
