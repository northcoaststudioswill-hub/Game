#!/usr/bin/env python3
"""Builds Sprouts TV: Sprouts on its own, widescreen, for a browser on a television.

This folder is a separate copy. Nothing outside sprouts-tv/ is ever written, and the Pocket Lantern
builds (alt/, v0.x/) are not touched: this game was forked from alt/src on Nov 18 2026 and from then
on the two change separately.

  sprouts-tv/src/shell.html    the page: one full-window canvas, no console body
  sprouts-tv/src/game.js       Sprouts (forked from alt/src/console.js)
  sprouts-tv/src/sprouts3d.js  the 3D scenes, house and title (forked from alt/src/sprouts3d.js)
  sprouts-tv/src/buddies.js    art for the eight wild buddies (copied from the Sproutwild cartridge's files)

The songs are big (13 MB of embedded mp3), so they are not copied: the build reads the two music
<script> blocks from the shipped v0.3 build, read-only, exactly as alt/build.py does.

Run:  python3 sprouts-tv/build.py      -> sprouts-tv/games/sprouts-tv.html
"""
import pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent
SRC = here / 'src'
V03_BUILD = here.parent / 'v0.3/games/pocket-lantern_2026-11-14_v21_wip.html'  # read-only
OUT = here / 'games/sprouts-tv.html'
MUSIC_PREFIX = {'tracks': '\nwindow.SPROUT_TRACKS=[', 'pp': '\n/* Patch & Plate plays only tracks tagged "pp" */'}


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
game = code('game.js')
if game.count('/*@include sprouts3d.js*/') != 1:
    die('game.js needs exactly one /*@include sprouts3d.js*/')
game = game.replace('/*@include sprouts3d.js*/', code('sprouts3d.js'))
if game.count('/*@include buddies.js*/') != 1:
    die('game.js needs exactly one /*@include buddies.js*/')
game = game.replace('/*@include buddies.js*/', code('buddies.js'))
parts = {'@MUSIC tracks': music['tracks'], '@MUSIC pp': music['pp'], 'game.js': game}
html = (SRC / 'shell.html').read_text(encoding='utf8')
for slot, body in parts.items():
    tag = '/*' + slot + '*/'
    if html.count(tag) != 1:
        die(f'shell.html needs exactly one {tag}')
    html = html.replace(tag, body)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding='utf8')
print(OUT.relative_to(here.parent), len(html.encode('utf8')), 'bytes')
