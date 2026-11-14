#!/usr/bin/env python3
"""Builds the v0.3 console: Pocket Lantern with Patch & Plate in cartridge slot 4.

v0.3 is made FROM v0.2 every time, so work that happens in v0.2 (Rootdeep, Sprouts,
Knockout, the console) flows into v0.3 just by running this again. Nothing in v0.2
is ever written to.

  1. Read the v0.2 build:      v0.2/games/pocket-lantern_2026-11-14_v20_wip.html
  2. Splice in the newest Rootdeep from v0.2/src/rootdeep.js (in memory, same
     markers as v0.2/build.py), so it's current even if v0.2 wasn't rebuilt.
  3. Add the Patch & Plate hooks to the console (HOOKS below). Each one must match
     exactly once, or the build stops and says which, so nothing lands in the wrong place.
  4. Add v0.3/src/patchplate.js as its own <script>.
  5. Write v0.3/games/pocket-lantern_2026-11-14_v21_wip.html

Run:  python3 v0.3/build.py
"""
import pathlib, sys

here = pathlib.Path(__file__).resolve().parent
v02 = here.parent / 'v0.2'
BASE = v02 / 'games/pocket-lantern_2026-11-14_v20_wip.html'
RD_SRC = v02 / 'src/rootdeep.js'
PP_SRC = here / 'src/patchplate.js'
OUT = here / 'games/pocket-lantern_2026-11-14_v21_wip.html'

RD_START = '/* ---------- cartridge 3: ROOTDEEP'
RD_END = '/* ---------- loop ---------- */'

PP_NEW = ("const PP=window.PP_CART?window.PP_CART({g,W,H:()=>H,r,text,tw,snd,noise,keys,pressed,mk,flip,CH,LOU,TL,"
          "will:()=>SP,meta:()=>meta,persist:()=>persist(true),eject:()=>eject(),active:()=>state==='pp'}):null;\n")

# (what's in the v0.2 console, what it becomes). Each 'old' must occur exactly once.
HOOKS = [
    # the shelf: four cartridges across
    ('.cart{ width:29%; max-width:108px;', '.cart{ width:22.5%; max-width:100px;'),
    ('<button class="cart" data-i="2"><canvas class="art" id="cartArt3" width="40" height="26"></canvas>Rootdeep</button>',
     '<button class="cart" data-i="2"><canvas class="art" id="cartArt3" width="40" height="26"></canvas>Rootdeep</button>\n'
     '          <button class="cart" data-i="3"><canvas class="art" id="cartArt4" width="40" height="26"></canvas>Patch &amp; Plate</button>'),
    # make the cartridge, give it its button labels
    ("const PAD=[['act','call','swap','pause'],['light','heavy','super','pause'],['attack','cast','swap','pause']];",
     PP_NEW + "const PAD=[['act','call','swap','pause'],['light','heavy','super','pause'],['attack','cast','swap','pause'],['use','toss','recipes','pause']];"),
    ("if(i>2||(i===1&&!KO))", "if(i>3||(i===1&&!KO)||(i===3&&!PP))"),
    ("if(pressed('right'))cartHi((cartSel+1)%3);if(pressed('left'))cartHi((cartSel+2)%3)",
     "if(pressed('right'))cartHi((cartSel+1)%4);if(pressed('left'))cartHi((cartSel+3)%4)"),
    # boot, update, draw
    ("else if(cart===2){g3StartTitle()}", "else if(cart===2){g3StartTitle()}else if(cart===3){state='pp';PP.start()}"),
    ("case 'ko':KO.update(dt);return;", "case 'ko':KO.update(dt);return;\n case 'pp':PP.update(dt);return;"),
    ("if(state==='ko'){KO.draw();return}", "if(state==='ko'){KO.draw();return}\n if(state==='pp'){PP.draw();return}"),
    # music: Sprouts' William Cohen songs (the 'game' list), quieter while paused
    ("if(state==='ko')return KO.mus();", "if(state==='ko')return KO.mus();if(state==='pp')return PP.mus();"),
    ("(state==='ko'&&KO&&KO.paused())", "(state==='ko'&&KO&&KO.paused())||(state==='pp'&&PP&&PP.paused())"),
    # the iPhone text placement (cap height), as Rootdeep has it
    ("const capN=cart===2||", "const capN=cart===2||cart===3||"),
    # test handle
    ("window.__g={KO,", "window.__g={KO,PP,"),
]
SCRIPT_AT = "<script>\n(()=>{\nconst $=id=>document.getElementById(id);"


def die(msg):
    sys.exit('build: ' + msg)


html = BASE.read_text(encoding='utf8')

# 2. newest Rootdeep
a, b = html.find(RD_START), html.find(RD_END)
if a < 0 or b < 0 or html.count(RD_START) != 1 or html.count(RD_END) != 1 or b < a:
    die('Rootdeep markers not found exactly once in ' + str(BASE))
rd = RD_SRC.read_text(encoding='utf8').rstrip('\n') + '\n'
if not rd.startswith(RD_START):
    die('v0.2/src/rootdeep.js must start with the Rootdeep START marker')
html = html[:a] + rd + html[b:]

# 3. hooks
for old, new in HOOKS:
    n = html.count(old)
    if n != 1:
        die(f'hook found {n} times (needs exactly 1): {old[:90]}')
    html = html.replace(old, new)

# 4. the cartridge
pp = PP_SRC.read_text(encoding='utf8').rstrip('\n') + '\n'
if '</script' in pp.lower():
    die('src/patchplate.js must not contain a closing script tag')
if html.count(SCRIPT_AT) != 1:
    die('console script start not found exactly once')
html = html.replace(SCRIPT_AT, '<script>\n' + pp + '</script>\n' + SCRIPT_AT)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding='utf8')
print(OUT.name, len(html.encode('utf8')), 'bytes')
