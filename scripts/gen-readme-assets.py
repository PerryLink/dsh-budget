#!/usr/bin/env python3
"""README visuals for dsh-budget — v5.

The plugin is a control loop around one three-scope ledger, so neither figure
is a left-to-right node chain:

* hero — the live budget panel: three concentric scope rings on a single 270°
  gauge (session r=86, daily r=122, monthly r=158), the daily ring past its
  cap and marked BLOCKED, with the real `/budget` numbers underneath.
* flow — an after-the-fact metering path (`session/event` → in-process
  conversion) feeding a three-scope gate ledger; the ledger's state hands off
  down to the disposition column, whose blocked set stops the next call on the
  `llm/stream` seam; the dashed rail on the left closes the loop (a passed
  call returns as the next usage sample).

Every label is a real seam, config key, file or measured number from `src/`,
`cordis.patch.yml` or the README example: nothing here is invented.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs', 'assets')

FONT_CJK = r'C:\Windows\Fonts\msyh.ttc'
FONT_CJK_BOLD = r'C:\Windows\Fonts\msyhbd.ttc'
FONT_MONO = r'C:\Windows\Fonts\consola.ttf'
for _p in (FONT_CJK, FONT_CJK_BOLD, FONT_MONO):
    if not os.path.exists(_p):
        raise SystemExit(f'FATAL: font missing: {_p}')

# Shapes are composited at 2x and downsampled: crisp card edges and rings.
S = 2

SKIN = {
    'light': dict(bg_from='#f9f6fd', bg_to='#e4eaf8', card='#ffffff',
                  edge='#e2dff0', text='#141419', sub='#4d5261',
                  faint='#8f94a4', accent='#4B67B4', green='#16a34a',
                  warn='#bc4c00', danger='#c02b2b', pill='#ece7f9',
                  track='#ece8f6', danger_pill='#fbe9ea', shadow=(38, 30, 72),
                  shadow_a=26),
    'dark': dict(bg_from='#131a2a', bg_to='#0c1016', card='#1b2231',
                 edge='#2e374b', text='#f0f3f9', sub='#a8b1c4',
                 faint='#737b8d', accent='#8496f5', green='#3fb950',
                 warn='#d29922', danger='#f87171', pill='#242d42',
                 track='#2b3448', danger_pill='#3a2026', shadow=(0, 0, 0),
                 shadow_a=110),
}


def font(size, kind='cjk_bold'):
    return ImageFont.truetype(
        {'cjk': FONT_CJK, 'cjk_bold': FONT_CJK_BOLD, 'mono': FONT_MONO}[kind],
        size)


def hx(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(int(x + (y - x) * t) for x, y in zip(hx(a), hx(b)))


def gradient(w, h, c1, c2):
    base = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(base)
    for y in range(h):
        t = 0.20 * (y / h) + 0.80 * (y / h) ** 1.5
        d.line([(0, y), (w, y)], fill=mix(c1, c2, t))
    return base


def glow(img, cx, cy, r, color, alpha=48):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(12, 0, -1):
        rr = r * i / 12
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                  fill=color + (int(alpha * (1 - i / 13)),))
    layer = layer.filter(ImageFilter.GaussianBlur(26))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


MEASURE = ImageDraw.Draw(Image.new('RGB', (8, 8)))


def tw(text, size, kind='cjk'):
    return MEASURE.textlength(text, font=font(size, kind))


class Layer:
    """Vector layer in design coordinates (1440x576), rasterised at 2x."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.img = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    def refresh(self):
        self.d = ImageDraw.Draw(self.img)

    def rect(self, box, radius=0, fill=None, outline=None, width=1.0):
        self.d.rounded_rectangle([v * S for v in box], radius=radius * S,
                                 fill=fill, outline=outline,
                                 width=max(1, round(width * S)))

    def line(self, p1, p2, fill, width=1.0):
        self.d.line([p1[0] * S, p1[1] * S, p2[0] * S, p2[1] * S],
                    fill=fill, width=max(1, round(width * S)))

    def shadow(self, box, radius=20, blur=14, color=(0, 0, 0), alpha=30,
               dy=10):
        sh = Image.new('RGBA', self.img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(sh)
        d.rounded_rectangle([box[0] * S, (box[1] + dy) * S, box[2] * S,
                             (box[3] + dy) * S], radius=radius * S,
                            fill=color + (alpha,))
        sh = sh.filter(ImageFilter.GaussianBlur(blur * S))
        self.img = Image.alpha_composite(self.img, sh)
        self.refresh()

    def ring(self, cx, cy, r, w, a0, a1, color, alpha=255):
        """Annular sector with round caps, drawn at 4x then downsampled."""
        if a1 <= a0:
            return
        pad = w / 2 + 2
        x0, y0 = cx - r - pad, cy - r - pad
        span = 2 * (r + pad)
        q = 4
        mask = Image.new('L', (int(round(span * q)), int(round(span * q))), 0)
        md = ImageDraw.Draw(mask)
        ro, ri = (r + w / 2) * q, (r - w / 2) * q
        ccx, ccy = (cx - x0) * q, (cy - y0) * q
        steps = max(16, int(abs(a1 - a0) * 1.5))
        outer, inner = [], []
        for i in range(steps + 1):
            a = math.radians(a0 + (a1 - a0) * i / steps)
            outer.append((ccx + ro * math.cos(a), ccy + ro * math.sin(a)))
            inner.append((ccx + ri * math.cos(a), ccy + ri * math.sin(a)))
        md.polygon(outer + inner[::-1], fill=255)
        rmid, rr = (ro + ri) / 2, (ro - ri) / 2
        for a in (a0, a1):
            px = ccx + rmid * math.cos(math.radians(a))
            py = ccy + rmid * math.sin(math.radians(a))
            md.ellipse([px - rr, py - rr, px + rr, py + rr], fill=255)
        mask = mask.resize((int(round(span * S)), int(round(span * S))),
                           Image.LANCZOS)
        if alpha < 255:
            mask = mask.point(lambda v: v * alpha // 255)
        solid = Image.new('RGBA', mask.size, color + (0,))
        solid.putalpha(mask)
        self.img.alpha_composite(solid, (int(round(x0 * S)),
                                         int(round(y0 * S))))
        self.refresh()

    def flatten(self):
        return self.img.resize((self.w, self.h), Image.LANCZOS)


def text(d, xy, s, f, fill, anchor='ls'):
    d.text(xy, s, font=f, fill=hx(fill), anchor=anchor)


def fit(d, s, kind, start, maxw, floor=11):
    size = start
    while size > floor:
        f = font(size, kind)
        if d.textlength(s, font=f) <= maxw:
            return f, size
        size -= 1
    return font(floor, kind), floor


HERO = {
    'zh': dict(
        kicker='DEEPSEEK HARNESS 插件 · 成本治理',
        title='dsh-budget',
        value=['成本、碳排、延迟，一条事件流', '越界之前就拦下'],
        sub='三档预算；warn → alert → block · degrade。',
        meta='/budget · budget/status · Settings → Budget',
        foot='Apache-2.0 · PerryLink DSH plugin family · v0.4.22',
        panel='预算面板 · 实时',
        tape='0.0200 kg CO2e · p50 20 ms',
        big='120%',
        cap='daily 已超支',
        blocked='BLOCKED',
        stats=[('session', '$5 / $10'), ('daily', '$60 / $50'),
               ('monthly', '$60 / $500')],
        note='warnRatio 0.8 · overLimit alert / block / degrade',
    ),
    'en': dict(
        kicker='DEEPSEEK HARNESS PLUGIN · COST GOVERNANCE',
        title='dsh-budget',
        value=['Cost, carbon, latency — one stream',
               'stopped before the overrun'],
        sub='Three cap scopes; warn → alert → block · degrade.',
        meta='/budget · budget/status · Settings → Budget',
        foot='Apache-2.0 · PerryLink DSH plugin family · v0.4.22',
        panel='BUDGET PANEL · LIVE',
        tape='0.0200 kg CO2e · p50 20 ms',
        big='120%',
        cap='daily over cap',
        blocked='BLOCKED',
        stats=[('session', '$5 / $10'), ('daily', '$60 / $50'),
               ('monthly', '$60 / $500')],
        note='warnRatio 0.8 · overLimit alert / block / degrade',
    ),
}


def hero(lang, skin):
    """1440x576 banner: the pitch on the left, the three-ring budget gauge right."""
    s = SKIN[skin]
    H = HERO[lang]
    W, HT = 1440, 576
    img = gradient(W, HT, s['bg_from'], s['bg_to'])
    img = glow(img, 1120, 60, 440, hx(s['accent']),
               24 if skin == 'light' else 42)
    L = Layer(W, HT)

    # ------------------------------------------------ panel card + gauge
    cb = (756, 44, 1380, 532)
    L.shadow(cb, radius=26, blur=16, color=s['shadow'], alpha=s['shadow_a'],
             dy=12)
    L.rect(cb, radius=26, fill=hx(s['card']), outline=hx(s['edge']), width=1.2)
    L.line((784, 100), (1352, 100), hx(s['edge']), 1.0)

    cx, cy = 1068, 286
    a0, sweep = 135, 270
    # monthly (12%) / daily (120% -> clamped, red) / session (50%)
    for r, frac, col, alpha in ((158, 0.12, s['accent'], 235),
                                (122, 1.0, s['danger'], 255),
                                (86, 0.50, s['accent'], 255)):
        L.ring(cx, cy, r, 14, a0, a0 + sweep, hx(s['track']), 255)
        L.ring(cx, cy, r, 14, a0, a0 + sweep * min(frac, 1.0), hx(col), alpha)

    # stat pills under the gauge
    pills = []
    x = 784
    for label, value in H['stats']:
        w = 26 + tw(label, 13, 'mono') + 10 + tw(value, 13, 'mono') + 16
        pills.append((x, 458, x + w, 490, label, value))
        x += w + 14
    for x0, y0, x1, y1, label, value in pills:
        L.rect((x0, y0, x1, y1), radius=16, fill=hx(s['pill']))

    # left column kicker pill
    kx, ky = 60, 44
    kh = 34
    kw = tw(H['kicker'], 15, 'cjk') + 34
    L.rect((kx, ky, kx + kw, ky + kh), radius=kh / 2, fill=hx(s['pill']))

    base = Image.alpha_composite(img.convert('RGBA'), L.flatten())
    d = ImageDraw.Draw(base)
    text(d, (kx + 17, ky + 22), H['kicker'], font(15, 'cjk'), s['accent'])

    tf, _ = fit(d, H['title'], 'mono', 84, 660, 72)
    text(d, (kx, 210), H['title'], tf, s['text'])

    y = 278
    for line in H['value']:
        lf, _ = fit(d, line, 'cjk_bold', 38, 660, 30)
        text(d, (kx, y), line, lf, s['text'])
        y += 50

    sf, _ = fit(d, H['sub'], 'cjk', 26, 660, 20)
    text(d, (kx, 392), H['sub'], sf, s['sub'])
    text(d, (kx, 440), H['meta'], font(20, 'mono'), s['faint'])
    d.line([kx, 462, kx + 600, 462], fill=hx(s['edge']), width=2)
    text(d, (kx, 498), H['foot'], font(16, 'cjk'), s['faint'])

    # panel texts (on top of the composited layer)
    text(d, (784, 84), H['panel'],
         font(12, 'cjk' if lang == 'zh' else 'mono'), s['accent'])
    text(d, (1352, 84), H['tape'], font(12.5, 'mono'), s['faint'],
         anchor='rs')

    text(d, (cx, cy + 4), H['big'], font(44, 'mono'), s['danger'],
         anchor='ms')
    text(d, (cx, cy + 34), H['cap'], font(13.5, 'cjk'), s['sub'], anchor='ms')
    text(d, (cx, cy + 58), H['blocked'], font(12, 'mono'), s['danger'],
         anchor='ms')

    for x0, y0, x1, y1, label, value in pills:
        dot = {'session': s['accent'], 'daily': s['danger'],
               'monthly': s['accent']}[label]
        d.ellipse([x0 + 12, (y0 + y1) // 2 - 3.5, x0 + 19,
                   (y0 + y1) // 2 + 3.5], fill=hx(dot))
        text(d, (x0 + 26, y1 - 8), label, font(13, 'mono'), s['sub'])
        text(d, (x1 - 16, y1 - 8), value, font(13, 'mono'), s['accent'],
             anchor='rs')

    text(d, (784, 514), H['note'], font(12, 'mono'), s['faint'])

    path = os.path.join(OUT, f'dsh-budget-hero-{lang}-{skin}.webp')
    base.convert('RGB').save(path, 'WEBP', quality=92)
    print(f'dsh-budget-hero-{lang}-{skin}.webp')


# --------------------------------------------------------------------------
# flow: 1100x660
# --------------------------------------------------------------------------
FLOW = {
    'light': dict(bg1='#f9f6fd', bg2='#e4eaf8', dots='#ddd6ee',
                  card='#ffffff', edge='#e2dff0', text='#141419',
                  sub='#4d5261', faint='#8f94a4', accent='#4B67B4',
                  green='#16a34a', warn='#bc4c00', danger='#c02b2b',
                  pill='#ece7f9', track='#ece8f6', grid='#e6e1f2',
                  shadow='#1b1735', shadow_op='.10'),
    'dark': dict(bg1='#131a2a', bg2='#0c1016', dots='#1c2536',
                 card='#1b2231', edge='#2e374b', text='#f0f3f9',
                 sub='#a8b1c4', faint='#737b8d', accent='#8496f5',
                 green='#3fb950', warn='#d29922', danger='#f87171',
                 pill='#242d42', track='#232c3f', grid='#1b2434',
                 shadow='#000000', shadow_op='.55'),
}

SANS = ("ui-sans-serif, system-ui, -apple-system, 'Segoe UI', "
        "'Microsoft YaHei', 'PingFang SC', sans-serif")
MONO = ("ui-monospace, SFMono-Regular, 'Cascadia Mono', Consolas, "
        "'Microsoft YaHei', monospace")


def esc(body):
    return (str(body).replace('&', '&amp;').replace('<', '&lt;')
            .replace('>', '&gt;'))


def flow_svg(skin):
    """1100x660: metering -> conversion -> three-scope ledger -> disposition ->
    interception, with the dashed return rail closing the loop."""
    s = FLOW[skin]
    W, H = 1100, 660
    lines = []
    add = lines.append

    def t(x, y, body, size=11.5, fill=None, weight='400', family=SANS,
          anchor='start', opacity=None, extra=''):
        op = f' opacity="{opacity}"' if opacity else ''
        add(f'<text x="{x}" y="{y}" fill="{fill or s["text"]}" '
            f'font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}"{op}{extra}>{esc(body)}</text>')

    def cw(body, size, mono=True):
        return len(body) * size * (0.60 if mono else 0.53)

    def box(x, y, w, h, r=18, fill=None, sw=1.2):
        add(f'<g filter="url(#soft)"><rect x="{x}" y="{y}" width="{w}" '
            f'height="{h}" rx="{r}" fill="{fill or s["card"]}" '
            f'stroke="{s["edge"]}" stroke-width="{sw}"/></g>')

    def chip(x, y, body, size=11, mono=True, fg=None, bg=None, h=20, padx=8):
        w = cw(body, size, mono) + padx * 2
        add(f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="{h}" '
            f'rx="{h / 2}" fill="{bg or s["pill"]}"/>')
        t(x + padx, y + h / 2 + size * 0.36, body, size, fg or s['accent'],
          '400', MONO if mono else SANS)
        return w

    def eyebrow(x, y, body):
        t(x, y, body, 11, s['accent'], '700', MONO,
          extra=' letter-spacing="1.2"')

    add(f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="dsh-budget structure: usage arrives after the fact on session/event, converts in-process to cost, carbon and latency, lands in a three-scope gate ledger (session / daily / monthly), hands off to the alert / block / degrade disposition, and a blocked scope short-circuits the next llm/stream call; the dashed return rail closes the loop">
<title>dsh-budget: one usage stream, three scoped gates, a pre-flight stop</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{s['bg1']}"/>
    <stop offset="1" stop-color="{s['bg2']}"/>
  </linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="180%">
    <feDropShadow dx="0" dy="7" stdDeviation="10" flood-color="{s['shadow']}" flood-opacity="{s['shadow_op']}"/>
  </filter>
  <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
    <circle cx="1.4" cy="1.4" r="1.4" fill="{s['dots']}"/>
  </pattern>
  <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" fill="{s['accent']}"/>
  </marker>
  <marker id="dn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" fill="{s['danger']}"/>
  </marker>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#dots)" opacity=".45"/>''')

    # ------------------------------------------------------------ header
    t(40, 46, 'dsh-budget', 26, s['text'], '700', MONO)
    t(40, 70, 'one usage stream · three scoped gates · one pre-flight stop',
      12.5, s['sub'])
    t(1060, 46, 'surfaces: /budget · Settings tab · budget/*', 11, s['faint'],
      '400', MONO, 'end')

    # ------------------------------------------------------------ cards
    box(40, 108, 504, 138)      # intake
    box(640, 108, 420, 138)     # conversion
    box(40, 282, 1020, 186)     # ledger
    box(40, 504, 504, 120)      # interception
    box(640, 504, 420, 120)     # disposition

    # ---------------------------------------------------------- 1 intake
    eyebrow(40, 100, 'METERING · AFTER THE FACT')
    t(60, 135, 'session/event', 14, s['text'], '700', MONO)
    t(524, 135, 'host → plugin', 11, s['faint'], '400', MONO, 'end')
    w = chip(60, 152, 'request/header', 11.5)
    t(60 + w + 12, 168, '→ attribution: provider · model', 12, s['sub'])
    w = chip(60, 188, 'assistant/message', 11.5)
    t(60 + w + 12, 204, '→ usage: in / out / cache-read / cache-write',
      12, s['sub'])
    t(60, 232, 'no usage field → nothing recorded', 11, s['faint'])
    t(524, 232, 'usage?: TokenUsage', 11, s['faint'], '400', MONO, 'end')

    # ------------------------------------------------------ 2 conversion
    eyebrow(640, 100, 'CONVERSION · IN-PROCESS')
    t(660, 133, 'cost · carbon · latency', 14, s['text'], '700', MONO)
    rows = [
        ('USD', 'Σ tokens/1M × price · config.prices'),
        ('CO2e', 'tokens × 7e-6 kWh × PUE 1.58 × 0.475'),
        ('p50/95', 'stream-wrapper clock · window 200'),
    ]
    yy = 163
    for tag, formula in rows:
        t(660, yy, tag, 11.5, s['accent'], '700', MONO)
        t(730, yy, formula, 11.5, s['text'], '400', MONO)
        yy += 29

    # ---------------------------------------------------------- 3 ledger
    eyebrow(40, 274, 'LEDGER · THREE SCOPED GATES')
    t(60, 310, 'checkBudgets()', 14, s['text'], '700', MONO)
    t(206, 310, 'one sample → three scopes', 11.5, s['sub'])
    t(1040, 310, 'warn at 0.8 of each cap · cooldown-gated',
      11, s['faint'], '400', MONO, 'end')

    # manifold: the same sample branches into all three rails
    add(f'<path d="M204 320 L204 410" stroke="{s["accent"]}" '
        f'stroke-width="1.8" opacity=".55"/>')
    for yc in (342, 376, 410):
        add(f'<path d="M204 {yc} L212 {yc}" stroke="{s["accent"]}" '
            f'stroke-width="1.8" opacity=".55" marker-end="url(#a)"/>')

    rails = [
        ('session', '$10 cap', 0.50, '$5.00 of $10 · 50%', 'ok', s['green']),
        ('daily', '$50 cap', 1.00, '$60.00 of $50 · 120%', 'over · blocked',
         s['danger']),
        ('monthly', '$500 cap', 0.12, '$60.00 of $500 · 12%', 'ok', s['green']),
    ]
    for i, (name, cap, frac, used, state, col) in enumerate(rails):
        yc = 342 + 34 * i
        t(60, yc + 5, name, 13, s['text'], '700', MONO)
        t(142, yc + 5, cap, 11, s['faint'], '400', MONO)
        add(f'<rect x="216" y="{yc - 7}" width="500" height="14" rx="7" '
            f'fill="{s["track"]}"/>')
        fill_col = s['danger'] if frac >= 1 else s['accent']
        add(f'<rect x="216" y="{yc - 7}" width="{max(14, 500 * frac):.0f}" '
            f'height="14" rx="7" fill="{fill_col}" '
            f'opacity="{1 if frac >= 1 else 0.9}"/>')
        nx = 216 + 500 * 0.8
        add(f'<line x1="{nx:.0f}" y1="{yc - 10}" x2="{nx:.0f}" y2="{yc + 10}" '
            f'stroke="{s["warn"]}" stroke-width="2" opacity=".7"/>')
        t(736, yc + 5, used, 11.5, s['text'] if frac >= 1 else s['sub'], '400',
          MONO)
        cwid = cw(state, 11) + 18
        add(f'<rect x="916" y="{yc - 10}" width="{cwid:.0f}" height="20" '
            f'rx="10" fill="{s["pill"]}"/>')
        t(916 + 9, yc + 5, state, 11, col, '700', MONO)

    t(60, 443, 'same sample charges all three scopes · overLimit picks the '
               'exit · /budget unblock <scope> lifts it', 11, s['faint'])

    # ----------------------------------------------------- 4 interception
    eyebrow(40, 496, 'INTERCEPTION · BEFORE THE CALL')
    t(60, 526, 'llm/stream · prepend', 14, s['text'], '700', MONO)

    add(f'<rect x="60" y="532" width="240" height="62" rx="12" '
        f'fill="{s["track"]}" opacity=".7"/>')
    t(72, 550, 'blockedScopes empty', 11, s['faint'], '400', MONO)
    t(72, 575, 'next()', 13, s['accent'], '700', MONO)
    t(140, 575, 'pass-through', 11, s['sub'])

    add(f'<rect x="316" y="532" width="208" height="62" rx="12" '
        f'fill="{s["danger"]}" opacity=".10"/>')
    t(328, 550, 'non-empty', 11, s['faint'], '400', MONO)
    t(328, 573, 'short-circuit', 13, s['danger'], '700', MONO)
    t(328, 590, 'error finish BUDGET_BLOCKED', 11, s['danger'], '400', MONO,
      opacity='.9')

    t(60, 614, 'a short-circuited call yields no usage — the ledger does not '
               'move', 11, s['faint'])

    # ------------------------------------------------------ 5 disposition
    eyebrow(640, 496, 'DISPOSITION · overLimit')
    t(660, 526, 'alert / block / degrade', 14, s['text'], '700', MONO)
    policy = [
        ('alert', 'webhook POST · URL credentials stripped'),
        ('block', 'blockedScopes.add → next call stopped'),
        ('degrade', 'corrective text names the cheaper model'),
    ]
    yy = 554
    for tag, note in policy:
        w = chip(660, yy - 14, tag, 11, True, s['accent'], s['pill'], 20, 8)
        t(660 + w + 12, yy, note, 11, s['sub'])
        yy += 24

    # ------------------------------------------------------------ arrows
    # intake -> conversion
    add(f'<line x1="546" y1="177" x2="632" y2="177" stroke="{s["accent"]}" '
        f'stroke-width="2.4" marker-end="url(#a)"/>')
    t(589, 168, 'usage', 11, s['faint'], '400', MONO, 'middle')
    # conversion -> ledger
    add(f'<line x1="830" y1="248" x2="830" y2="274" stroke="{s["accent"]}" '
        f'stroke-width="2.4" marker-end="url(#a)"/>')
    t(838, 266, 'priced', 11, s['faint'], '400', MONO)
    # ledger -> disposition
    add(f'<line x1="830" y1="470" x2="830" y2="496" stroke="{s["accent"]}" '
        f'stroke-width="2.4" marker-end="url(#a)"/>')
    t(838, 490, 'decisions', 11, s['faint'], '400', MONO)
    # disposition -> interception
    add(f'<line x1="638" y1="564" x2="552" y2="564" stroke="{s["danger"]}" '
        f'stroke-width="2.4" marker-end="url(#dn)"/>')
    t(595, 556, 'blocked set', 11, s['danger'], '400', MONO, 'middle')
    # return rail (dashed): a passed call becomes the next usage sample
    add(f'<path d="M40 564 H26 Q18 564 18 556 V185 Q18 177 26 177 H38" '
        f'stroke="{s["accent"]}" stroke-width="2" stroke-dasharray="7 5" '
        f'opacity=".6" fill="none" marker-end="url(#a)"/>')
    add(f'<text x="32" y="371" fill="{s["faint"]}" font-family="{MONO}" '
        f'font-size="10.5" text-anchor="middle" '
        f'transform="rotate(-90 32 371)">return</text>')

    # ------------------------------------------------------------ footer
    add(f'<line x1="40" y1="636" x2="1060" y2="636" stroke="{s["grid"]}"/>')
    t(40, 652, 'dashed return: a passed call returns as the next usage sample '
               '· audit appends only on hosts before 0.1.2-alpha.1',
      11, s['faint'])
    t(1060, 652, 'src/index.ts · governance.ts · aggregate/usage.ts', 10.5,
      s['faint'], '400', MONO, 'end')

    add('</svg>')
    path = os.path.join(OUT, f'dsh-budget-flow-v5-{skin}.svg')
    with open(path, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(lines) + '\n')
    print(f'dsh-budget-flow-v5-{skin}.svg')


def main():
    os.makedirs(OUT, exist_ok=True)
    for skin in ('light', 'dark'):
        for lang in ('zh', 'en'):
            hero(lang, skin)
        flow_svg(skin)


if __name__ == '__main__':
    main()
