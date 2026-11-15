#!/usr/bin/env python3
"""Builds Pocket Lantern v0.35: v0.3 with the reworked North Coast Knockout (cartridge 2).

v0.35 is made FROM the frozen v0.3 backup every time (read-only), so v0.3 is never touched:
  1. Read  v0.3/backups/pocket-lantern_2026-11-15_v0.3_BACKUP.html
  2. Swap Knockout's script block (from its header comment to the end of that <script>) for v0.35/src/knockout.js.
     The header must be found exactly once, or the build stops.
  3. Add any songs listed in v0.35/music/tracks.json (see v0.35/music/README.md), just before Knockout's script.
  4. Write v0.35/games/pocket-lantern_2026-11-15_v22.html

Run:  python3 v0.35/build.py
Sprouts, Rootdeep, Patch & Plate, the console and the Lantern menu are exactly v0.3's.
"""
import base64, json, pathlib, sys

here = pathlib.Path(__file__).resolve().parent
BASE = here.parent / 'v0.3/backups/pocket-lantern_2026-11-15_v0.3_BACKUP.html'
KO_SRC = here / 'src/knockout.js'
OUT = here / 'games/pocket-lantern_2026-11-15_v22.html'
KO_HEAD = '\n/* ============================================================\n   NORTH COAST KNOCKOUT'


def die(msg):
    sys.exit('build: ' + msg)


html = BASE.read_text(encoding='utf8')
if html.count(KO_HEAD) != 1:
    die('Knockout header not found exactly once in ' + str(BASE))
a = html.index(KO_HEAD)
b = html.index('</script>', a)
ko = KO_SRC.read_text(encoding='utf8')
if '</script' in ko.lower():
    die('src/knockout.js must not contain a closing script tag')
if not ko.startswith(KO_HEAD):
    die('src/knockout.js must start with the Knockout header comment')
html = html[:a] + ko + html[b:]

# songs (optional): pushed into the shared track list before Knockout's script runs
lst = here / 'music' / 'tracks.json'
if lst.exists():
    pushes = []
    for t in json.loads(lst.read_text(encoding='utf8')):
        f = here / 'music' / t['file']
        if not f.exists():
            die('music: ' + t['file'] + ' is listed in tracks.json but missing')
        tr = {'title': t.get('title', f.stem), 'artist': t.get('artist', ''), 'use': t['use'], 'data': base64.b64encode(f.read_bytes()).decode()}
        pushes.append('window.SPROUT_TRACKS.push(' + json.dumps(tr, separators=(',', ':')) + ');')
    if pushes:
        s = html.rindex('<script>', 0, a)
        html = html[:s] + '<script>\n' + '\n'.join(pushes) + '\n</script>\n' + html[s:]

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding='utf8')
size = len(html.encode('utf8'))
print(OUT.name, size, 'bytes')
if size > 16_000_000:
    print('build: WARNING over 16 MB, too big to publish as a claude.ai page')
