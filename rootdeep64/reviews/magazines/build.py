#!/usr/bin/env python3
"""Turns the four reviewers' markdown reviews into four magazine pages.
The review words are the reviewers' own; only real magazines' trademarked section names
(Power Meter, Review Crew, ProTips, Viewpoint) are renamed to fit the made-up magazines."""
import re, html, pathlib
R = pathlib.Path('/home/user/Game/rootdeep64/reviews')
OUT = pathlib.Path(__file__).parent

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    s = re.sub(r'`(.+?)`', r'<code>\1</code>', s)
    return s

def md(text):
    """Small markdown: headings, paragraphs, lists, blockquotes. Tables are skipped (rebuilt by hand)."""
    out, para, lst = [], [], None
    def flush():
        nonlocal para, lst
        if para: out.append('<p>' + inline(' '.join(para)) + '</p>'); para = []
        if lst: out.append('<%s>%s</%s>' % (lst[0], ''.join('<li>' + inline(i) + '</li>' for i in lst[1]), lst[0])); lst = None
    for raw in text.split('\n'):
        l = raw.rstrip()
        if not l.strip() or l.startswith('|'): flush(); continue
        m = re.match(r'^(#{1,4})\s+(.*)', l)
        if m: flush(); n = len(m.group(1)); out.append('<h%d>%s</h%d>' % (n + 1, inline(m.group(2)), n + 1)); continue
        if l.startswith('>'):
            flush(); out.append('<blockquote>' + inline(l.lstrip('> ').strip()) + '</blockquote>'); continue
        m = re.match(r'^\s*(?:[-*]|(\d+)\.)\s+(.*)', l)
        if m:
            kind = 'ol' if m.group(1) else 'ul'
            if para: flush()
            if lst and lst[0] != kind: flush()
            lst = lst or [kind, []]; lst[1].append(m.group(2)); continue
        if lst: lst[1][-1] += ' ' + l.strip(); continue
        para.append(l.strip())
    flush()
    return '\n'.join(out)

def blocks(name):
    return [b.strip() for b in re.split(r'\n-{3,}\n', (R / (name + '-review.md')).read_text())]

def section(md_text, head):
    """Bullet lines under a '### head' / '**head**' marker, up to the next heading."""
    m = re.search(r'(?:#+\s*|\*\*)' + re.escape(head) + r'\**\s*\n(.*?)(?=\n(?:#+\s|\*\*[A-Z])|\Z)', md_text, re.S)
    return [x.strip()[2:] for x in m.group(1).strip().split('\n') if x.strip().startswith(('-', '*'))] if m else []

def fig(src, cap, cls=''):
    return f'<figure class="shot {cls}"><img src="img/{src}" alt="{html.escape(cap)}" loading="lazy"><figcaption>{inline(cap)}</figcaption></figure>'

def weave(body_html, figs):
    """Drop figures in between paragraphs at even intervals."""
    parts = re.split(r'(?=<p>|<h[3-5]>|<ul>|<ol>)', body_html)
    parts = [p for p in parts if p.strip()]
    step = max(1, len(parts) // (len(figs) + 1))
    for i, f in enumerate(figs):
        at = min(len(parts), (i + 1) * step + i)
        parts.insert(at, f)
    return '\n'.join(parts)

def errata(items, who):
    lis = ''.join(f'<li>{inline(i)}</li>' for i in items)
    return f'<aside class="errata"><h4>Errata</h4><p class="eh">{who} read the game\'s code after filing this review. These claims did not hold up:</p><ul>{lis}</ul></aside>'

def page(path, title, desc, fonts, css, body):
    (OUT / path).write_text(f'''<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="{html.escape(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<style>
*,*::before,*::after{{box-sizing:border-box}}
img{{display:block;max-width:100%;height:auto}}
.shot{{margin:0}}
.wrap{{max-width:1080px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}}
h1,h2,h3{{text-wrap:balance}}
:focus-visible{{outline:3px solid currentColor;outline-offset:2px}}
{css}
</style>
{body}
''')

# ======================================================================
# DANA — CARTRIDGE CLUB (family monthly)
# ======================================================================
b = blocks('dana')
dana_body = md(b[1])
dana_body = dana_body.replace('<p><strong>Down in the Burrows</strong></p>', '<h3>Down in the Burrows</h3>') \
    .replace('<p><strong>The problem is the floor I couldn\'t get past</strong></p>', '<h3>The floor I couldn\'t get past</h3>') \
    .replace('<p><strong>Touch controls: almost there</strong></p>', '<h3>Touch controls: almost there</h3>') \
    .replace('<p><strong>Sound</strong></p>', '<h3>Sound</h3>').replace('<p><strong>Bottom line</strong></p>', '<h3>Bottom line</h3>')
dana_figs = [
 fig('012.jpg', 'The Hearth, where the family hangs out between trips. Those yellow **!** marks mean somebody has a job for you.'),
 fig('120.jpg', 'Where\'s Will? For a moment after a hit, only his gold ring is left on the floor.'),
 fig('355.jpg', 'Pick a door by the prize on it. Here: Petals or a Heart.'),
 fig('024.jpg', 'The keeper select screen, where the words pile up on each other.'),
 fig('210.jpg', '"SUPER READY!", "SELFIE!" and "THE DEEP STIRS" all land in one spot.'),
]
dana_tips = md(b[5].split('\n', 1)[1])
meter = [('Graphics &amp; Sound', 3.5, 'Lovely clay-block look and cozy lighting; messy overlapping text; sound not heard'),
         ('Play Control', 2.5, 'Stick and A button feel good; hub targeting, camera turning and crowded doorways fight you'),
         ('Challenge', 1.5, 'Far too steep for beginners; spawns land on you; never got past room 3 of 12'),
         ('Theme &amp; Fun', 3.5, 'Charming family, great writing, the Bike Lane super is a blast')]
def stars(v):
    return ''.join('<span class="st %s"></span>' % ('f' if v >= i + 1 else 'h' if v >= i + .5 else 'e') for i in range(5))
meter_html = ''.join(f'<div class="mrow"><div class="ml"><b>{n}</b><span>{d}</span></div><div class="mv">{stars(v)}<em>{v}</em></div></div>' for n, v, d in meter)
pros, cons = section(b[3], 'PROS'), section(b[3], 'CONS')
page('dana/index.html', 'Cartridge Club: Rootdeep 64', "Dana's phone review of Rootdeep 64",
 'family=Luckiest+Guy&family=Nunito:ital,wght@0,400;0,700;0,800;1,400',
 '''
:root{--paper:#fffaf0;--ink:#24203a;--sky:#1f6fd6;--sun:#ffc626;--berry:#e8314f;--leaf:#2f9e4f;--soft:#f1e9d8;--mute:#6c6580;color-scheme:light}
body{background:var(--paper);color:var(--ink);font:17px/1.6 "Nunito",system-ui,sans-serif}
.mast{background:var(--sky);color:#fff;border-bottom:6px solid var(--sun)}
.mast .wrap{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;justify-content:space-between;padding-block:14px}
.logo{font:400 clamp(30px,6vw,52px)/1 "Luckiest Guy",cursive;letter-spacing:1px;color:var(--sun);text-shadow:3px 3px 0 var(--berry)}
.issue{font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase}
.kicker{display:inline-block;background:var(--berry);color:#fff;font:400 18px/1 "Luckiest Guy",cursive;letter-spacing:1px;padding:8px 14px 5px;border-radius:999px;transform:rotate(-2deg);margin-top:28px}
.hero h1{font:400 clamp(44px,9vw,96px)/.95 "Luckiest Guy",cursive;margin:14px 0 6px;color:var(--sky);text-shadow:4px 4px 0 var(--sun)}
.hero h2{font:800 clamp(22px,3.4vw,32px)/1.2 "Nunito",sans-serif;margin:0 0 10px}
.deck{font-size:19px;font-style:italic;color:var(--mute);max-width:62ch;margin:0}
.by{display:flex;gap:12px;align-items:center;margin:18px 0 26px;font-weight:700}
.av{width:46px;height:46px;border-radius:50%;background:var(--sun);display:grid;place-items:center;font:400 24px "Luckiest Guy",cursive;color:var(--berry);border:3px solid var(--ink)}
.by small{display:block;font-weight:400;color:var(--mute)}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:40px;align-items:start;padding-bottom:40px}
.body p{margin:0 0 1em;max-width:66ch}
.body p:first-of-type::first-letter{font:400 64px/.8 "Luckiest Guy",cursive;float:left;margin:8px 8px 0 0;color:var(--berry)}
.body h3{font:400 26px/1.1 "Luckiest Guy",cursive;color:var(--berry);letter-spacing:.5px;margin:28px 0 10px}
.shot{background:#fff;border:3px solid var(--ink);border-radius:14px;padding:8px;margin:22px 0;box-shadow:6px 6px 0 var(--sun);transform:rotate(-.6deg)}
.shot:nth-of-type(even){transform:rotate(.6deg);box-shadow:-6px 6px 0 var(--sky)}
.shot img{border-radius:8px}
.shot figcaption{font-size:14px;padding:8px 4px 2px;color:var(--mute)}
.side{display:flex;flex-direction:column;gap:22px;position:sticky;top:16px}
.box{border:3px solid var(--ink);border-radius:16px;background:#fff;overflow:hidden}
.box h4{margin:0;background:var(--ink);color:var(--sun);font:400 22px/1 "Luckiest Guy",cursive;letter-spacing:1px;padding:12px 16px 9px}
.mrow{display:flex;gap:10px;justify-content:space-between;padding:10px 16px;border-top:2px dashed var(--soft)}
.ml b{display:block;font-size:15px}.ml span{display:block;font-size:12.5px;color:var(--mute);line-height:1.35}
.mv{text-align:right;white-space:nowrap}.mv em{display:block;font-style:normal;font-weight:800}
.st{display:inline-block;width:15px;height:15px;margin-left:2px;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:var(--soft)}
.st.f{background:var(--sun)}.st.h{background:linear-gradient(90deg,var(--sun) 50%,var(--soft) 50%)}
.overall{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--sun);font-weight:800}
.overall big{font:400 38px/1 "Luckiest Guy",cursive;color:var(--berry)}
.verdict{padding:14px 16px;font-size:15px;margin:0}
.pc{display:grid;grid-template-columns:1fr 1fr;gap:0}.pc div{padding:12px 16px}.pc h5{margin:0 0 6px;font:400 18px "Luckiest Guy",cursive}
.pc ul{margin:0;padding-left:18px;font-size:14px;line-height:1.45}.pc li{margin-bottom:6px}
.pro h5{color:var(--leaf)}.con h5{color:var(--berry)}.con{border-left:2px dashed var(--soft)}
.pull{margin:30px 0;padding:22px 24px;background:var(--berry);color:#fff;border-radius:20px;font:400 clamp(24px,3.6vw,34px)/1.15 "Luckiest Guy",cursive;letter-spacing:.5px;position:relative}
.pull::after{content:"";position:absolute;left:40px;bottom:-18px;border:18px solid transparent;border-top-color:var(--berry);border-bottom:0}
.pull cite{display:block;font:700 14px "Nunito",sans-serif;margin-top:10px;letter-spacing:.06em;text-transform:uppercase}
.tips{background:var(--leaf);color:#fff;border-radius:18px;padding:18px 20px 8px;border:3px solid var(--ink)}
.tips h4{font:400 24px "Luckiest Guy",cursive;margin:0 0 8px;color:var(--sun)}
.tips ol{padding-left:20px;margin:0;font-size:15px}.tips li{margin-bottom:10px}
.phone{display:grid;grid-template-columns:140px 1fr;gap:14px;align-items:center;background:#fff;border:3px solid var(--ink);border-radius:16px;padding:12px}
.phone img{border-radius:12px;border:4px solid var(--ink)}.phone p{margin:0;font-size:14px;color:var(--mute)}
.errata{border:3px dashed var(--mute);border-radius:14px;padding:14px 18px;background:var(--soft);font-size:14.5px}
.errata h4{margin:0 0 4px;font:400 20px "Luckiest Guy",cursive;color:var(--ink)}.errata .eh{margin:0 0 6px;color:var(--mute)}.errata ul{margin:0;padding-left:18px}
footer{border-top:6px solid var(--sun);background:var(--ink);color:var(--soft);font-size:13px}footer .wrap{padding-block:16px}
@media (max-width:860px){.grid{grid-template-columns:1fr}.side{position:static}}
@media (max-width:420px){.pc{grid-template-columns:1fr}.con{border-left:0;border-top:2px dashed var(--soft)}.phone{grid-template-columns:100px 1fr}}
@media (prefers-reduced-motion:reduce){.shot,.kicker{transform:none!important}}
''',
f'''<header class="mast"><div class="wrap"><span class="logo">CARTRIDGE CLUB</span><span class="issue">The family game monthly · Phone edition</span></div></header>
<main class="wrap">
<section class="hero"><span class="kicker">NOW PLAYING</span>
<h1>Rootdeep 64</h1><h2>Cozy on the Surface, Brutal Underneath</h2>
<p class="deck">A family digs into the dark under their house to rescue a lantern, and the grubs down there play for keeps. We took it into the basement on a phone, died sixteen times, and came back up with plenty to say.</p>
<div class="by"><span class="av" aria-hidden="true">D</span><div>Review by Dana<small>Plays Mario Kart and Animal Crossing. Played on a phone, with her thumbs.</small></div></div></section>
<div class="grid"><article class="body">
{weave(dana_body, dana_figs)}
<blockquote class="pull">There's a sweet, funny game in here. On a phone, its first three rooms are a wall.<cite>Dana</cite></blockquote>
</article>
<aside class="side">
<div class="box"><h4>Play-O-Meter</h4>{meter_html}<div class="overall"><span>Overall</span><big>2.8 / 5</big></div>
<p class="verdict"><strong>Verdict:</strong> A cozy, clever little world with a mean streak. Worth a peek for the story and the style. Casual players will bounce off chamber 3 until it gets an easier mode and clearer screens.</p></div>
<div class="box pc"><div class="pro"><h5>Thumbs up</h5><ul>{''.join('<li>'+inline(x)+'</li>' for x in pros)}</ul></div><div class="con"><h5>Thumbs down</h5><ul>{''.join('<li>'+inline(x)+'</li>' for x in cons)}</ul></div></div>
<div class="phone"><img src="img/p01.jpg" alt="The title screen in portrait, cut off at both edges" loading="lazy"><p><strong>Hold it sideways.</strong> Upright, the game shrinks to a strip across the top and the title gets cut off.</p></div>
<div class="tips"><h4>Dana's Dirt-Digging Tips</h4>{dana_tips}</div>
{errata(["Tip #2 is wrong: the SP button (Selfie Flash) doesn't heal. The +10s were heart pickups that enemies drop.","A beetle hit is about 12 damage, not 25 to 35. Several enemies were landing hits at once.","The camera doesn't turn; it slides and leans toward you.","\"( , ON KEYS)\" isn't missing a key. It's the comma key, for a second keyboard player."], 'Dana')}
</aside></div></main>
<footer><div class="wrap">Cartridge Club is a made-up magazine for this playtest. Dana is a reviewer persona who played the real build, blind, for about 50 minutes on a simulated phone. Sound wasn't heard.</div></footer>''')

# ======================================================================
# RICO — BUTTON BASH MONTHLY (four-person review squad)
# ======================================================================
b = blocks('rico')
crew = '\n'.join(l[1:].strip() for l in b[1].split('\n') if l.startswith('>'))
crew_html = md(crew)
feat = b[2].split('**By Rico**', 1)[1]
feat_html = md(feat)
for h in ['THE SETUP.', 'THE FIGHTING.', 'THE PROBLEMS.', 'THE HUB AND THE HEART.', 'CO-OP.', 'SOUND.']:
    feat_html = feat_html.replace('<strong>' + h + '</strong>', '<span class="run">' + h + '</span>')
rico_figs = [
 fig('159.jpg', 'Chamber 4: the Grub Mother arrives. No warning on the doors before it.'),
 fig('750.jpg', 'The DEW door, behind a pillar. Rico couldn\'t get to it from any side.'),
 fig('388.jpg', 'Firebloom + Storm Edge = a Wildfire Storm duo offer by chamber 8.'),
 fig('525.jpg', 'The Flooded Vault. Blue crabs, blue shots, blue floor.'),
]
pros, cons = section(b[4], 'PROS'), section(b[4], 'CONS')
page('rico/index.html', 'Button Bash: Rootdeep 64', "Rico's controller review of Rootdeep 64",
 'family=Anton&family=Archivo:ital,wght@0,400;0,600;0,800;1,400&family=Archivo+Narrow:wght@500;700',
 '''
:root{--bg:#f3f1ec;--ink:#141317;--red:#d7261e;--yel:#ffd400;--gray:#8a8691;--rule:#d8d4cc;--card:#ffffff;color-scheme:light}
body{background:var(--bg);color:var(--ink);font:16.5px/1.6 "Archivo",system-ui,sans-serif}
.mast{background:var(--ink);color:#fff}
.mast .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 20px;padding-block:12px}
.logo{font:400 clamp(30px,6vw,56px)/1 "Anton",Impact,sans-serif;letter-spacing:.02em;text-transform:uppercase}
.logo span{color:var(--red)}
.mast nav{font:700 13px "Archivo Narrow",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--yel)}
.spec{border-bottom:4px solid var(--ink);background:var(--yel)}
.spec .wrap{display:flex;flex-wrap:wrap;gap:4px 22px;padding-block:8px;font:700 13px "Archivo Narrow",sans-serif;letter-spacing:.08em;text-transform:uppercase}
.squad{display:grid;grid-template-columns:1fr;gap:0;border:4px solid var(--ink);background:var(--card);margin:28px 0}
.squad h2{grid-column:1/-1;margin:0;background:var(--red);color:#fff;font:400 26px/1 "Anton",sans-serif;letter-spacing:.05em;padding:12px 16px 10px;text-transform:uppercase;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.squad h2 small{font:700 13px "Archivo Narrow",sans-serif;letter-spacing:.1em;align-self:center}
.mem{padding:16px;border-right:2px solid var(--rule);min-width:0}
.mem:last-child{border-right:0}
.mem .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;border-bottom:3px solid var(--ink);padding-bottom:8px;margin-bottom:10px}
.mem .nm{font:400 26px/1 "Anton",sans-serif;text-transform:uppercase}
.mem .nm small{display:block;font:500 12px/1.3 "Archivo Narrow",sans-serif;color:var(--gray);letter-spacing:.06em;margin-top:4px}
.mem .sc{font:400 46px/1 "Anton",sans-serif;color:var(--red)}
.mem p{margin:0 0 .8em;font-size:15.5px;max-width:80ch}
.mem.empty{display:grid;place-items:center;text-align:center;color:var(--gray);font:600 13px/1.4 "Archivo Narrow",sans-serif;letter-spacing:.06em;text-transform:uppercase;background:repeating-linear-gradient(135deg,transparent 0 10px,#00000008 10px 20px)}
.mem.lead{grid-column:1/-1}
.best{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
.best div{font-size:13.5px;padding:8px 10px;background:var(--bg);border-left:4px solid var(--ink)}
.best b{display:block;font:700 12px "Archivo Narrow",sans-serif;letter-spacing:.1em;text-transform:uppercase}
.feat{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:40px;align-items:start;padding-bottom:40px}
.feat header h1{font:400 clamp(52px,10vw,120px)/1 "Anton",sans-serif;text-transform:uppercase;margin:6px 0 10px;letter-spacing:-.005em}
.feat header h1 span{background:var(--yel);padding:0 .08em;display:inline-block;line-height:1}
.feat header .dk{font:italic 400 20px/1.4 "Archivo",sans-serif;max-width:58ch;margin:0 0 6px}
.feat header .by{font:700 13px "Archivo Narrow",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--red);margin:0 0 20px}
.col{columns:2 300px;column-gap:32px;column-rule:1px solid var(--rule)}
.col p{margin:0 0 1em}.col ul{margin:0 0 1em;padding-left:18px}.col li{margin-bottom:.5em}
.col .shot{break-inside:avoid;margin:4px 0 18px;background:var(--ink);padding:6px 6px 0}
.col .shot figcaption{color:#fff;font:600 13px/1.35 "Archivo Narrow",sans-serif;padding:8px 4px 10px}
.run{font:400 18px "Anton",sans-serif;letter-spacing:.04em;color:var(--red)}
.side{display:flex;flex-direction:column;gap:20px;position:sticky;top:16px}
.scores{border:4px solid var(--ink);background:var(--card)}
.scores h3{margin:0;background:var(--ink);color:var(--yel);font:400 22px "Anton",sans-serif;letter-spacing:.06em;padding:10px 14px 8px;text-transform:uppercase}
.sr{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-top:2px solid var(--rule)}
.sr b{font:700 14px "Archivo Narrow",sans-serif;letter-spacing:.1em;text-transform:uppercase}
.sr .bar{flex:1;height:10px;background:var(--rule);margin:0 8px;position:relative}.sr .bar i{position:absolute;inset:0 auto 0 0;background:var(--red)}
.sr span{font:400 28px "Anton",sans-serif;min-width:2ch;text-align:right}
.sr.na span{font-size:16px;color:var(--gray)}
.pl{border:4px solid var(--ink);background:var(--card);padding:14px 16px}
.pl h4{margin:0 0 6px;font:400 20px "Anton",sans-serif;letter-spacing:.06em;text-transform:uppercase}
.pl ul{margin:0 0 12px;padding-left:18px;font-size:14px;line-height:1.45}.pl li{margin-bottom:5px}
.pl h4.c{color:var(--red)}
.pull{border-block:6px solid var(--ink);padding:18px 4px;font:400 clamp(26px,3.6vw,38px)/1.08 "Anton",sans-serif;text-transform:uppercase;margin:26px 0}
.pull em{font-style:normal;color:var(--red)}
.bottom{background:var(--red);color:#fff;padding:18px 20px;font:700 19px/1.35 "Archivo",sans-serif;margin:0 0 28px}
.bottom b{font:400 22px "Anton",sans-serif;letter-spacing:.06em;margin-right:8px}
.errata{border:2px dashed var(--gray);padding:12px 16px;font-size:14px;background:var(--card)}
.errata h4{margin:0 0 4px;font:400 18px "Anton",sans-serif;letter-spacing:.06em;text-transform:uppercase}.errata .eh{margin:0 0 6px;color:var(--gray)}.errata ul{margin:0;padding-left:18px}
footer{background:var(--ink);color:#c9c5cf;font-size:13px}footer .wrap{padding-block:16px}
@media (max-width:900px){.feat{grid-template-columns:1fr}.side{position:static}.squad{grid-template-columns:1fr 1fr}.mem.lead{grid-column:1/-1}.mem{border-right:0;border-top:2px solid var(--rule)}}
@media (max-width:460px){.squad{grid-template-columns:1fr}.best{grid-template-columns:1fr}}
''',
f'''<header class="mast"><div class="wrap"><span class="logo">Button<span>Bash</span> Monthly</span><nav>Reviews · Previews · Codes</nav></div></header>
<div class="spec"><div class="wrap"><span>Rootdeep 64</span><span>Publisher: TBA</span><span>Players: 1-4 simultaneous</span><span>Action roguelite</span><span>Browser · pad / keys</span></div></div>
<main class="wrap">
<section class="squad" aria-label="Review squad"><h2>The Bash Squad <small>Rico's crew score</small></h2>
<div class="mem lead"><div class="hd"><div class="nm">Rico<small>Zelda, Diablo, Smash kid. Some Hades, never finished it.</small></div><div class="sc">7.0</div></div>
{crew_html.replace('<p><em>Best part:</em>', '<p hidden><em>Best part:</em>')}
<div class="best"><div><b>Best part</b>Dodging the Drowned King's leap.</div><div><b>Worst part</b>Not finding my own guy on the screen.</div></div></div>
</section>
<div class="feat"><article>
<header><p class="by" style="margin:0">Feature review</p><h1>Dig deep, <span>die often</span></h1>
<p class="dk">ROOTDEEP 64 wears its Hades influence on its sleeve, and mostly earns it. But you'll have to squint.</p><p class="by">By Rico</p></header>
<div class="col">{weave(feat_html, rico_figs)}</div>
<blockquote class="pull">"The first time a sprout-spitter kited me around a pillar I swore at it. <em>The first time I learned to dash-strike it, I grinned.</em>"</blockquote>
<p class="bottom"><b>BOTTOM LINE</b>A great loop with real heart that's tripping over its own visuals. Fix the readability and it's a 9.</p>
</article>
<aside class="side">
<div class="scores"><h3>Scores</h3>
<div class="sr"><b>Graphics</b><span class="bar"><i style="width:80%"></i></span><span>8</span></div>
<div class="sr na"><b>Sound</b><span class="bar"></span><span>N/A</span></div>
<div class="sr"><b>Control</b><span class="bar"><i style="width:60%"></i></span><span>6</span></div>
<div class="sr"><b>Fun factor</b><span class="bar"><i style="width:70%"></i></span><span>7</span></div>
<div class="sr"><b>Crew score</b><span class="bar"><i style="width:70%"></i></span><span>7.0</span></div></div>
<figure class="shot" style="background:var(--ink);padding:6px 6px 0"><img src="img/829.jpg" alt="The death screen: THE DEEP KEEPS YOU" loading="lazy"><figcaption style="color:#fff;font:600 13px/1.35 Archivo Narrow,sans-serif;padding:8px 4px 10px">Rico died in the Flooded Vault. The death screen shows the Burrows.</figcaption></figure>
<div class="pl"><h4>Pros</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in pros)}</ul><h4 class="c">Cons</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in cons)}</ul></div>
{errata(["The \"( , ON KEYS)\" hint isn't missing a key. Comma is how a second keyboard player joins.","Bolt Step doesn't pull your dash toward enemies; it only zaps the nearest one.","The Root Maul doesn't lock you in place. Holding attack to charge a heavy slows you to 55%.","Spitters are slower than you. Most of the whiffs came from aim, not their speed."], 'Rico')}
</aside></div></main>
<footer><div class="wrap">Button Bash Monthly is a made-up magazine for this playtest. Rico is a reviewer persona who played the real build, blind, for about 50 minutes on a simulated controller and keyboard. Sound wasn't heard.</div></footer>''')

# ======================================================================
# VEX — HARD MODE (expert's magazine)
# ======================================================================
b = blocks('vex')
vex_body = md(b[1]).replace('<h4>', '<h3>').replace('</h4>', '</h3>')
vex_figs = [
 fig('238.jpg', 'A RARE Storm Luck (+8% crit) next to a COMMON Storm Edge (+35% attack).'),
 fig('315.jpg', 'Two Wills, one player. Same keyboard, Comma to join.'),
 fig('210.jpg', 'BIKE LANE. When it connects, it crits for 136.'),
 fig('466.jpg', '"HE LEAPS!" Dash out of the red ring, punish the landing.'),
]
tips_md = b[4].split('\n', 1)[1]
pros, cons = section(b[5], 'PROS'), section(b[5], 'CONS')
def lanterns(v):
    return ''.join('<i class="ln %s"></i>' % ('f' if v >= i + 1 else 'h' if v >= i + .5 else 'e') for i in range(5))
page('vex/index.html', 'Hard Mode: Rootdeep 64', "Vex's expert review of Rootdeep 64",
 'family=Russo+One&family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@500',
 '''
:root{--bg:#12101c;--panel:#1c1930;--ink:#ece8ff;--mute:#a49dc4;--acid:#b4f03c;--hot:#ff4fa3;--line:#352f55;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:17px/1.6 "IBM Plex Sans Condensed",system-ui,sans-serif}
.mast{border-bottom:2px solid var(--line);background:linear-gradient(90deg,#1a1430,#12101c)}
.mast .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 18px;padding-block:14px}
.logo{font:400 clamp(28px,5.5vw,48px)/1 "Russo One",sans-serif;letter-spacing:.06em;color:var(--acid)}
.logo b{color:var(--hot);font-weight:400}
.mast span:last-child{font:500 12px "IBM Plex Mono",monospace;letter-spacing:.1em;color:var(--mute);text-transform:uppercase}
.hero{padding-block:34px 10px}
.tag{font:500 12px "IBM Plex Mono",monospace;letter-spacing:.14em;color:var(--hot);text-transform:uppercase}
.hero h1{font:400 clamp(54px,11vw,128px)/.9 "Russo One",sans-serif;margin:8px 0 12px;letter-spacing:.01em;
 background:linear-gradient(180deg,var(--ink) 55%,var(--acid));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero h2{font:700 clamp(20px,3vw,30px)/1.2 "IBM Plex Sans Condensed",sans-serif;margin:0 0 10px;color:var(--acid)}
.hero .dk{max-width:64ch;color:var(--mute);font-style:italic;margin:0 0 6px}
.hero .by{font:500 13px "IBM Plex Mono",monospace;letter-spacing:.1em;margin:14px 0 0;color:var(--ink)}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:44px;align-items:start;padding-block:24px 44px}
.body p{margin:0 0 1em;max-width:68ch}
.body h3{font:400 24px/1.15 "Russo One",sans-serif;color:var(--hot);margin:30px 0 10px;letter-spacing:.02em}
.shot{margin:24px 0;border:2px solid var(--line);background:var(--panel)}
.shot figcaption{font:500 13px/1.4 "IBM Plex Mono",monospace;color:var(--mute);padding:10px 12px}
.shot figcaption::before{content:"▶ ";color:var(--acid)}
.pull{margin:30px 0;padding:6px 0 6px 22px;border-left:6px solid var(--acid);font:400 clamp(22px,3.2vw,32px)/1.25 "Russo One",sans-serif}
.side{display:flex;flex-direction:column;gap:22px;position:sticky;top:16px}
.rate{background:var(--panel);border:2px solid var(--line)}
.rate h3{margin:0;padding:12px 16px;font:400 18px "Russo One",sans-serif;letter-spacing:.08em;border-bottom:2px solid var(--line);color:var(--acid)}
.rr{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:12px 16px;border-bottom:1px solid var(--line)}
.rr b{font:700 15px "IBM Plex Sans Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase}
.rr .v{font:400 20px "Russo One",sans-serif;text-align:right}
.rr .lns{grid-column:1/-1}.rr p{grid-column:1/-1;margin:0;font-size:13.5px;color:var(--mute);line-height:1.4}
.ln{display:inline-block;width:16px;height:22px;margin-right:5px;border-radius:5px 5px 3px 3px;background:var(--line);position:relative}
.ln.f{background:var(--acid);box-shadow:0 0 10px #b4f03c88}.ln.h{background:linear-gradient(90deg,var(--acid) 50%,var(--line) 50%)}
.ln::before{content:"";position:absolute;left:4px;right:4px;top:-4px;height:4px;border-radius:2px 2px 0 0;background:inherit}
.ov{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:var(--hot);color:#12101c}
.ov b{font:400 16px "Russo One",sans-serif;letter-spacing:.08em}.ov big{font:400 34px "Russo One",sans-serif}
.tips{background:#0c1a06;border:2px solid var(--acid);padding:16px 18px 6px}
.tips h3{margin:0 0 8px;font:400 22px "Russo One",sans-serif;color:var(--acid);letter-spacing:.04em}
.tips ul{margin:0;padding-left:18px;font-size:15px}.tips li{margin-bottom:10px}
.pc{background:var(--panel);border:2px solid var(--line);padding:14px 16px}
.pc h4{margin:0 0 6px;font:400 16px "Russo One",sans-serif;letter-spacing:.08em}.pc h4.p{color:var(--acid)}.pc h4.c{color:var(--hot)}
.pc ul{margin:0 0 12px;padding-left:18px;font-size:14.5px;line-height:1.45}.pc li{margin-bottom:5px}
.errata{border:2px dashed var(--mute);padding:12px 16px;font-size:14.5px}
.errata h4{margin:0 0 4px;font:400 16px "Russo One",sans-serif;letter-spacing:.08em}.errata .eh{margin:0 0 6px;color:var(--mute)}.errata ul{margin:0;padding-left:18px}
footer{border-top:2px solid var(--line);color:var(--mute);font-size:13px}footer .wrap{padding-block:16px}
code{font:500 .9em "IBM Plex Mono",monospace}
@media (max-width:900px){.grid{grid-template-columns:1fr}.side{position:static}}
''',
f'''<header class="mast"><div class="wrap"><span class="logo">HARD<b>/</b>MODE</span><span>For players who finished it twice</span></div></header>
<main class="wrap">
<section class="hero"><span class="tag">Review · Action roguelite · 1-4 players</span>
<h1>Rootdeep 64</h1><h2>The Deep Keeps You. Then It Keeps You Again. And Again.</h2>
<p class="dk">Rootdeep 64 dresses itself up like an N64 cartridge. Underneath is a Hades-style boon roguelite with a tight dash and some real charm. The solo game is a brick wall, and the second controller tears it down. VEX dug in for an hour and came back with mud under the nails.</p>
<p class="by">BY VEX · 32 HEAT IN HADES · ISAAC · DEAD CELLS · SPELUNKY</p></section>
<div class="grid"><article class="body">
{weave(vex_body, vex_figs)}
<blockquote class="pull">With two Wills under my two hands I killed the Grub Mother on my first try. Same player, same skill. My clear rate went from zero to two bosses.</blockquote>
</article>
<aside class="side">
<div class="rate"><h3>THE RATINGS</h3>
<div class="rr"><b>Graphics</b><span class="v">4.0</span><span class="lns">{lanterns(4)}</span><p>Voxel N64 charm, gorgeous rooms; occlusion and HUD clutter hurt</p></div>
<div class="rr"><b>Sound</b><span class="v">N/A</span><p>Headless build, nothing heard. Not scored</p></div>
<div class="rr"><b>Control</b><span class="v">3.0</span><span class="lns">{lanterns(3)}</span><p>Dash and heavy feel great; 8-way cast and hidden P2 binds don't</p></div>
<div class="rr"><b>FunFactor</b><span class="v">3.0</span><span class="lns">{lanterns(3)}</span><p>Brilliant hub, fair bosses, a solo wall at chamber 3</p></div>
<div class="ov"><b>OVERALL</b><big>3.0 / 5.0</big></div></div>
<div class="tips"><h3>HARD TIPS from Vex</h3>{md(tips_md)}</div>
<figure class="shot"><img src="img/473.jpg" alt="Death screen: HE ONLY SAT ON YOU FOR A MOMENT" loading="lazy"><figcaption>"He only sat on you for a moment." Vex laughed at a game that had just killed them.</figcaption></figure>
<div class="pc"><h4 class="p">PROS</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in pros)}</ul><h4 class="c">CONS</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in cons)}</ul></div>
{errata(["Co-op scaling does exist: each extra keeper adds foes to every chamber and +75% boss health. The unlimited revives just outweigh it.","Sprout turrets don't teleport. They back away (kite) when you close in.","Doors don't mislabel. Solo doors fire the moment you touch one, so Vex was brushing the neighbouring door.","Nothing took HP in the shop. Errand progress also counts things done before you accept; the Board just hides the names until you ask."], 'Vex')}
</aside></div></main>
<footer><div class="wrap">Hard/Mode is a made-up magazine for this playtest. Vex is a reviewer persona who played the real build, blind, for about 55 minutes on a simulated keyboard. Sound wasn't heard.</div></footer>''')

# ======================================================================
# MO — PLAYER FOUR (multiplayer magazine)
# ======================================================================
b = blocks('mo')
mo_body = md(b[2])
mo_figs = [
 fig('146-4p.jpg', 'Four players, four identical Wills. Only the floating P-tags and floor rings tell them apart.'),
 fig('198-dee-to-p1.jpg', 'The revive ring: "STAND HERE." The best thing in the game, and it reads perfectly.'),
 fig('429-mirror-buys.jpg', 'The Mirror of Dew. Any controller can buy here, including Gramps.'),
 fig('482-select-erin.jpg', 'Choosing keepers together. Erin is locked: "Give Erin honey at the Hearth: 0/3".'),
 fig('182-4supers.jpg', 'Four players pressed super on the same frame. Only P1\'s BIKE LANE went off.'),
]
pros, cons = section(b[5], 'PROS'), section(b[5], 'CONS')
def dial(label, pct, note):
    if pct is None:
        return f'<div class="dl"><div class="ring na"><span>N/A</span></div><b>{label}</b><p>{note}</p></div>'
    return f'<div class="dl"><div class="ring" style="--p:{pct}"><span>{pct}%</span></div><b>{label}</b><p>{note}</p></div>'
page('mo/index.html', 'Player Four: Rootdeep 64', "Mo's couch co-op review of Rootdeep 64",
 'family=Bungee&family=Barlow:ital,wght@0,400;0,600;0,800;1,400&family=Barlow+Condensed:wght@600;800',
 '''
:root{--bg:#fff3e2;--ink:#1d1430;--p1:#f2b400;--p2:#1e9be0;--p3:#e8418f;--p4:#45b649;--card:#ffffff;--mute:#6b5f7d;--line:#ead9c0;color-scheme:light}
body{background:var(--bg);color:var(--ink);font:17px/1.6 "Barlow",system-ui,sans-serif}
.mast{background:var(--ink);color:#fff}
.mast .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 18px;padding-block:12px}
.logo{font:400 clamp(28px,5.6vw,50px)/1 "Bungee",sans-serif;letter-spacing:.02em}
.logo i{font-style:normal;display:inline-block;padding:0 .14em;margin-left:.1em;background:var(--p3);transform:rotate(-4deg)}
.dots{display:flex;gap:6px}.dots span{width:16px;height:16px;border-radius:50%}
.stripe{height:10px;background:linear-gradient(90deg,var(--p1) 0 25%,var(--p2) 25% 50%,var(--p3) 50% 75%,var(--p4) 75%)}
.hero{padding-block:30px 6px}
.col-tag{font:800 14px "Barlow Condensed",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--p3)}
.hero h1{font:400 clamp(48px,10vw,116px)/.92 "Bungee",sans-serif;margin:6px 0 8px}
.hero h2{font:800 clamp(22px,3.4vw,34px)/1.15 "Barlow Condensed",sans-serif;margin:0 0 10px;text-transform:uppercase;letter-spacing:.02em}
.hero .dk{font-size:19px;font-style:italic;color:var(--mute);max-width:62ch;margin:0}
.info{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 6px}
.info span{font:800 13px "Barlow Condensed",sans-serif;letter-spacing:.1em;text-transform:uppercase;background:var(--card);border:2px solid var(--ink);padding:4px 10px;border-radius:999px}
.cast{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0 4px}
.cast div{background:var(--card);border:3px solid var(--ink);border-radius:12px;padding:10px 12px;border-top-width:10px}
.cast b{display:block;font:400 17px "Bungee",sans-serif}.cast span{font-size:14px;color:var(--mute);line-height:1.35;display:block}
.cast div:nth-child(1){border-top-color:var(--p1)}.cast div:nth-child(2){border-top-color:var(--p2)}.cast div:nth-child(3){border-top-color:var(--p3)}.cast div:nth-child(4){border-top-color:var(--p4)}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:40px;align-items:start;padding-block:26px 44px}
.body p{margin:0 0 1em;max-width:66ch}
.shot{margin:24px 0;background:var(--ink);border-radius:14px;overflow:hidden}
.shot figcaption{color:#fff;font:600 15px/1.4 "Barlow Condensed",sans-serif;padding:10px 14px;letter-spacing:.02em}
.shot:nth-of-type(4n+1){box-shadow:8px 8px 0 var(--p1)}.shot:nth-of-type(4n+2){box-shadow:8px 8px 0 var(--p2)}.shot:nth-of-type(4n+3){box-shadow:8px 8px 0 var(--p3)}.shot:nth-of-type(4n){box-shadow:8px 8px 0 var(--p4)}
.side{display:flex;flex-direction:column;gap:22px;position:sticky;top:16px}
.dials{background:var(--card);border:3px solid var(--ink);border-radius:16px;padding:14px}
.dials h3{margin:0 0 10px;font:400 20px "Bungee",sans-serif}
.dl{display:grid;grid-template-columns:64px 1fr;gap:2px 12px;align-items:center;padding:8px 0;border-top:2px solid var(--line)}
.dl b{font:800 16px "Barlow Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase}
.dl p{grid-column:2;margin:0;font-size:13.5px;color:var(--mute);line-height:1.35}
.ring{grid-row:span 2;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--p3) calc(var(--p)*1%),var(--line) 0)}
.ring span{width:48px;height:48px;border-radius:50%;background:var(--card);display:grid;place-items:center;font:800 17px "Barlow Condensed",sans-serif}
.ring.na{background:var(--line)}
.dl.big{grid-template-columns:86px 1fr}.dl.big .ring{width:86px;height:86px;background:conic-gradient(var(--ink) calc(var(--p)*1%),var(--line) 0)}.dl.big .ring span{width:66px;height:66px;font:400 22px "Bungee",sans-serif}
.says{background:var(--ink);color:#fff;border-radius:16px;padding:18px 20px;position:relative}
.says h3{margin:0 0 8px;font:400 20px "Bungee",sans-serif;color:var(--p1)}
.says p{margin:0 0 .6em;font-size:15.5px}
.says .sc{font:400 28px "Bungee",sans-serif;color:var(--p1)}
.pc{background:var(--card);border:3px solid var(--ink);border-radius:16px;padding:14px 16px}
.pc h4{margin:0 0 6px;font:400 16px "Bungee",sans-serif}.pc h4.p{color:var(--p4)}.pc h4.c{color:var(--p3)}
.pc ul{margin:0 0 12px;padding-left:18px;font-size:14.5px;line-height:1.45}.pc li{margin-bottom:5px}
.pull{margin:30px 0;font:400 clamp(26px,4vw,40px)/1.12 "Bungee",sans-serif;padding:20px 22px;border-radius:18px;background:var(--p1);border:3px solid var(--ink)}
.errata{border:3px dashed var(--mute);border-radius:14px;padding:12px 16px;font-size:14.5px;background:var(--card)}
.errata h4{margin:0 0 4px;font:400 16px "Bungee",sans-serif}.errata .eh{margin:0 0 6px;color:var(--mute)}.errata ul{margin:0;padding-left:18px}
footer{background:var(--ink);color:#d9d0e8;font-size:13px}footer .wrap{padding-block:16px}
@media (max-width:900px){.grid{grid-template-columns:1fr}.side{position:static}.cast{grid-template-columns:1fr 1fr}}
@media (max-width:420px){.cast{grid-template-columns:1fr}}
''',
f'''<header class="mast"><div class="wrap"><span class="logo">PLAYER<i>FOUR</i></span><span class="dots" aria-hidden="true"><span style="background:var(--p1)"></span><span style="background:var(--p2)"></span><span style="background:var(--p3)"></span><span style="background:var(--p4)"></span></span></div></header>
<div class="stripe" aria-hidden="true"></div>
<main class="wrap">
<section class="hero"><span class="col-tag">Mo's Multiplayer Mayhem</span>
<h1>Rootdeep 64</h1><h2>Four Keepers, One Face, Zero Bosses Beaten</h2>
<p class="dk">A cozy voxel dungeon-crawler that says "1-4 KEEPERS" on the title screen and means it — right up until your friends want to tell themselves apart, leave, or arrive late.</p>
<div class="info"><span>Co-op roguelite</span><span>1-4 simultaneous</span><span>Pad · keyboard (two can share) · touch</span><span>Tested: one game night, ~50 min, 8 party wipes</span></div>
<div class="cast" aria-label="Game night line-up"><div><b>Keys</b><span>Mo, on keyboard. Carries.</span></div><div><b>Dee</b><span>On pad. Solid.</span></div><div><b>Gramps</b><span>Thinks the shoulder buttons are decorative.</span></div><div><b>Latecomer</b><span>Shows up when the pizza's half gone.</span></div></div></section>
<div class="grid"><article class="body">
{weave(mo_body, mo_figs)}
<blockquote class="pull">"ROOTDEEP treats four people like one person with four controllers."</blockquote>
</article>
<aside class="side">
<div class="dials"><h3>The scores</h3>
{dial('Graphics', 80, 'Lovely chunky voxel rooms and clean bold UI. Four identical heroes is a real problem.')}
{dial('Play control', 64, "Combat feels tight, but menus with several controllers are chaos and hints only follow P1's device.")}
{dial('Music &amp; sound', None, "Our test rig was silent. I'm not going to make it up.")}
{dial('Originality', 72, 'Hades-style runs on a cozy couch; the stand-to-revive ring and per-colour prompts are fresh.')}
<div class="dl big"><div class="ring" style="--p:66"><span>66%</span></div><b>Overall</b></div></div>
<div class="says"><h3>Mo says</h3><p>I wanted to love it, and for about ten minutes I did. The revive ring is genius and dropping in at the Hearth takes one button. But game night is about <em>people</em>, and ROOTDEEP treats four people like one person with four controllers: one face, one cursor, one wallet, one door picked by whoever's thumb slipped.</p><p>Give each keeper a colour or a hat, give each player their own cursor in menus, let my late friend in at the next door, and let Gramps go to bed without renumbering the couch. Do that and this jumps to 85. Today it's a rental for two, not a party for four.</p><span class="sc">66%</span></div>
<div class="pc"><h4 class="p">Pros</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in pros)}</ul><h4 class="c">Cons</h4><ul>{''.join('<li>'+inline(x)+'</li>' for x in cons)}</ul></div>
{errata(["BIG HEAL does heal every standing player. Gramps' partner missed it because they were down.","Four players isn't harder by the numbers: foes per player go down as the party grows.","The revive radius matches the ring. Slow revives came from enemy knockback pushing the helper out.","Escape doesn't close the pause menu; it was the X press that resumed."], 'Mo')}
</aside></div></main>
<footer><div class="wrap">Player Four is a made-up magazine for this playtest. Mo is a reviewer persona who played the real build, blind, for about 50 minutes, driving up to four simulated controllers and a keyboard. Sound wasn't heard.</div></footer>''')
print('built')
