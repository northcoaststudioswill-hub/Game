#!/usr/bin/env python3
"""Builds Sprouts TV: Sprouts on its own, widescreen, for a browser on a television.

This folder is a separate copy. Nothing outside sprouts-tv2/ is ever written, and the Pocket Lantern
builds (alt/, v0.x/) are not touched: this game was forked from alt/src on Nov 18 2026 and from then
on the two change separately.

  sprouts-tv2/src/shell.html    the television page: one full-window canvas
  sprouts-tv2/src/shell-pocket.html  the phone page: a screen, a pad and five buttons
  sprouts-tv2/src/game.js       Sprouts (forked from alt/src/console.js)
  sprouts-tv2/src/sprouts3d.js  the 3D scenes, house and title (forked from alt/src/sprouts3d.js)
  sprouts-tv2/src/buddies.js    art for the eight wild buddies (copied from the Sproutwild cartridge's files)

The songs are big (embedded mp3), so they are not copied: the build reads the two music <script> blocks
from the shipped v0.3 build, read-only, and keeps only the songs Sprouts itself plays.

Run:  python3 sprouts-tv2/build.py      -> sprouts-tv2/games/sprouts-tv2.html (television)
                                          and sprouts-tv2/games/sprouts-pocket.html (phone)
"""
import pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent
SRC = here / 'src'
V03_BUILD = here.parent / 'v0.3/games/pocket-lantern_2026-11-14_v21_wip.html'  # read-only
OUT = here / 'games/sprouts-tv2.html'
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


def sprouts_songs(blocks):
    """Only the songs Sprouts plays. The console's build carries songs for its other cartridges too (tagged "ko" and
    "pp"); this game never plays them, and they were a third of the file."""
    import json
    dec, keep, seen = json.JSONDecoder(), [], 0
    for body in blocks.values():
        i = body.find('{"title":')
        while i >= 0:
            obj, end = dec.raw_decode(body, i)
            seen += 1
            if any(u in ('menu', 'game') for u in obj.get('use', [])):
                keep.append(body[i:end])
            i = body.find('{"title":', end)
    if not keep:
        die('no Sprouts songs found in the music blocks')
    print(f'music: {len(keep)} of {seen} songs kept (the rest belong to other cartridges)')
    return '\nwindow.SPROUT_TRACKS=[' + ',\n'.join(keep) + '];\n'


songs = sprouts_songs(music)
game = code('game.js')
if game.count('/*@include sprouts3d.js*/') != 1:
    die('game.js needs exactly one /*@include sprouts3d.js*/')
game = game.replace('/*@include sprouts3d.js*/', code('sprouts3d.js'))
if game.count('/*@include buddies.js*/') != 1:
    die('game.js needs exactly one /*@include buddies.js*/')
game = game.replace('/*@include buddies.js*/', code('buddies.js'))
if game.count('/*@POCKET*/false') != 1:
    die('game.js needs exactly one /*@POCKET*/false')
# one source, two builds: the television, and a phone held upright
for shell, out, pocket in (('shell.html', OUT, False), ('shell-pocket.html', here / 'games/sprouts-pocket.html', True)):
    parts = {'@MUSIC tracks': songs, '@MUSIC pp': '/* (songs for other cartridges are left out of this build) */', 'game.js': game.replace('/*@POCKET*/false', 'true') if pocket else game}
    html = (SRC / shell).read_text(encoding='utf8')
    for slot, body in parts.items():
        tag = '/*' + slot + '*/'
        if html.count(tag) != 1:
            die(f'{shell} needs exactly one {tag}')
        html = html.replace(tag, body)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf8')
    print(out.relative_to(here.parent), len(html.encode('utf8')), 'bytes')
