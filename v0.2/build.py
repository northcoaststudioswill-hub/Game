#!/usr/bin/env python3
"""Splices src/rootdeep.js into the single-file console.

The playable build is games/pocket-lantern_2026-11-14_v20_wip.html. Rootdeep's code
lives in src/rootdeep.js and sits in the page between START and END below.
Run:  python3 v0.2/build.py   (then open the games/ file)"""
import pathlib, sys
root = pathlib.Path(__file__).parent
page = root / 'games/pocket-lantern_2026-11-14_v20_wip.html'
START = '/* ---------- cartridge 3: ROOTDEEP'
END = '/* ---------- loop ---------- */'
html = page.read_text(encoding='utf8')
a, b = html.find(START), html.find(END)
if a < 0 or b < 0 or html.count(START) != 1 or html.count(END) != 1 or b < a:
    sys.exit('build: markers not found exactly once in ' + str(page))
js = (root / 'src/rootdeep.js').read_text(encoding='utf8').rstrip('\n') + '\n'
if not js.startswith(START):
    sys.exit('build: src/rootdeep.js must start with the START marker line')
if js.count('</script') or js.count('</SCRIPT'):
    sys.exit('build: src/rootdeep.js must not contain a closing script tag')
page.write_text(html[:a] + js + html[b:], encoding='utf8')
print(page.name, len(html[:a] + js + html[b:]), 'bytes')
