#!/usr/bin/env python3
"""Builds Starhaven into one HTML file: starhaven/game/starhaven.html

The source is small files with one job each (src/*.js). This inlines them into index.src.html
so the game is a single file you can open on a phone or share as a link.
Run from anywhere:  python3 starhaven/game/build.py
"""
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
ORDER = [
    'tuning.js',     # every feel number
    'story.js',      # intro, chapters, goals, dialogue, journal
    'rooms.js',      # level data
    'input.js',      # keyboard, gamepad, touch
    'physics.js',    # tile collision
    'fx.js',         # particles, hit-stop, shake
    'player.js',     # Wren
    'enemies.js',    # thorn sprite, dummy, thorn buds
    'art.js',        # portraits, intro panels, people
    'draw.js',       # world drawing
    'game.js',       # loop, camera, checkpoints
    'hud.js',        # HTML HUD and menus
]

def main():
    shell = (HERE / 'index.src.html').read_text()
    parts = []
    for name in ORDER:
        code = (HERE / 'src' / name).read_text()
        parts.append(f'<script>\n// ---- src/{name}\n{code}\n</script>')
    out = shell.replace('<!--SCRIPTS-->', '\n'.join(parts))
    dest = HERE / 'starhaven.html'
    dest.write_text(out)
    print(f'wrote {dest} ({len(out) // 1024} KB)')

if __name__ == '__main__':
    main()
