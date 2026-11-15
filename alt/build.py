#!/usr/bin/env python3
"""Builds the ALT console: an experimental fork of Pocket Lantern v0.3.

Nothing outside alt/ is ever written. The code lives here as plain files:

  alt/src/shell.html     the page (CSS, console body, buttons) with /*@...*/ slots
  alt/src/console.js     the console + Sprouts (cartridge 1)
  alt/src/rootdeep.js    Rootdeep (cartridge 3), spliced into console.js
  alt/src/knockout.js    the fighter (cartridge 2)
  alt/src/patchplate.js  the farm stand (cartridge 4)

The music is big (13 MB of embedded mp3), so it is not copied: the build reads the
two music <script> blocks from the shipped v0.3 build, read-only.

Run:  python3 alt/build.py      -> alt/games/pocket-lantern-alt.html
"""
import pathlib, re, sys

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

parts = {
    '@MUSIC tracks': music['tracks'],
    '@MUSIC pp': music['pp'],
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
print(OUT.relative_to(here.parent), len(html.encode('utf8')), 'bytes')
