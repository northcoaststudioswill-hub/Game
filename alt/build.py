#!/usr/bin/env python3
"""Builds the ALT console: an experimental fork of Pocket Lantern v0.3.

Nothing outside alt/ is ever written. The code lives here as plain files:

  alt/src/shell.html     the page (CSS, console body, buttons) with /*@...*/ slots
  alt/src/console.js     the console + Sprouts (cartridge 1)
  alt/src/rootdeep.js    Rootdeep (cartridge 3), spliced into console.js
  alt/src/knockout.js    the fighter (cartridge 2)
  alt/src/patchplate.js  the farm stand (cartridge 4)
  alt/src/sproutwild/    Sproutwild (cartridge 5), eleven files spliced into console.js

The music is big (13 MB of embedded mp3), so it is not copied: the build reads the
two music <script> blocks from the shipped v0.3 build, read-only.

Run:  python3 alt/build.py      -> alt/games/pocket-lantern-alt.html
"""
import base64, json, pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent
SRC = here / 'src'
V03_BUILD = here.parent / 'v0.3/games/pocket-lantern_2026-11-14_v21_wip.html'  # read-only
OUT = here / 'games/pocket-lantern-alt.html'

MUSIC_PREFIX = {
    'tracks': '\nwindow.SPROUT_TRACKS=[',
    'pp': '\n/* Patch & Plate plays only tracks tagged "pp" */',
}


def die(msg):
    sys.exit('build: ' + msg)


def music_blocks():
    h = V03_BUILD.read_text(encoding='utf8')
    found = {}
    for m in re.finditer(r'<script[^>]*>', h):
        s = m.end(); body = h[s:h.find('</script>', s)]
        for k, p in MUSIC_PREFIX.items():
            if body.startswith(p):
                found[k] = body
    for k in MUSIC_PREFIX:
        if k not in found:
            die(f'music block "{k}" not found in {V03_BUILD}')
    return found


def alt_music():
    """ALT's own songs: alt/music/tracks.json lists them, e.g.
    [{"file": "bottie-1.mp3", "title": "Song", "artist": "lil Bottie", "use": ["ko-bottie"]}]
    'ko-bottie' plays in Knockout fights against Lil Bottie; 'ko-<fighter id>' or 'ko-stage-<n>' work the same way."""
    lst = here / 'music' / 'tracks.json'
    if not lst.exists():
        return '/* no ALT songs yet: see alt/music/README.md */'
    out = []
    for t in json.loads(lst.read_text(encoding='utf8')):
        f = here / 'music' / t['file']
        if not f.exists():
            die('music: ' + t['file'] + ' is listed in tracks.json but missing')
        tr = {'title': t.get('title', f.stem), 'artist': t.get('artist', ''), 'use': t['use'],
              'data': base64.b64encode(f.read_bytes()).decode()}
        out.append('window.SPROUT_TRACKS.push(' + json.dumps(tr, separators=(',', ':')) + ');')
    return '\n'.join(out)


def code(name):
    js = (SRC / name).read_text(encoding='utf8')
    if '</script' in js.lower():
        die(f'src/{name} must not contain a closing script tag')
    return js


music = music_blocks()
console = code('console.js')
if console.count('/*@include rootdeep.js*/') != 1:
    die('console.js needs exactly one /*@include rootdeep.js*/')
console = console.replace('/*@include rootdeep.js*/', code('rootdeep.js'))
# cartridge 5, Sproutwild: its files share the console's scope, in this order
SPROUTWILD = ['sw-cartart', 'sw-module', 'sw-field', 'sw-front', 'sw-base', 'sw-art', 'sw-story', 'sw-battle', 'sw-save', 'sw-text', 'sw-cast', 'sw-party', 'sw-scene', 'sw-starters', 'sw-plots', 'sw-hollow', 'sw-squire', 'sw-louie', 'sw-bugs', 'sw-walk', 'sw-open2', 'sw-meadow2', 'sw-pace']
if console.count('/*@include sproutwild*/') != 1:
    die('console.js needs exactly one /*@include sproutwild*/')
swmod = code('sproutwild/sw-module.js')
SWMARK = '/* ================================================================\n   DISPATCH + TEST HOOKS'
if swmod.count(SWMARK) != 1:
    die('sproutwild/sw-module.js: dispatch marker not found')
# the later files replace functions the module's dispatch block calls, so they go in just ahead of it
swmod = swmod.replace(SWMARK, '\n'.join(code('sproutwild/' + f + '.js').rstrip() for f in SPROUTWILD[2:]) + '\n' + SWMARK)
console = console.replace('/*@include sproutwild*/', code('sproutwild/sw-cartart.js').rstrip() + '\n' + swmod.rstrip() + '\n')

parts = {
    '@MUSIC tracks': music['tracks'],
    '@MUSIC pp': music['pp'],
    '@MUSIC alt': alt_music(),
    'knockout.js': code('knockout.js'),
    'patchplate.js': code('patchplate.js'),
    'console.js': console,
}
html = (SRC / 'shell.html').read_text(encoding='utf8')
for slot, body in parts.items():
    tag = '/*' + slot + '*/'
    if html.count(tag) != 1:
        die(f'shell.html needs exactly one {tag}')
    html = html.replace(tag, body)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding='utf8')
size = len(html.encode('utf8'))
print(OUT.relative_to(here.parent), size, 'bytes')
if size > 16_000_000:
    print('build: WARNING over 16 MB, too big to publish as a claude.ai page (songs are the heavy part)')
