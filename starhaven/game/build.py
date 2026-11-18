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
    'sfx.js',        # synthesized sound effects
    'save.js',       # 3 save slots
    'physics.js',    # tile collision
    'fx.js',         # particles, hit-stop, shake
    'player.js',     # Wren
    'enemies.js',    # thorn sprite, dummy, thorn buds
    'art.js',        # portraits, intro panels, people
    'cine.js',       # animated cinematics
    'stars.js',      # the Constellation: Starlight upgrades
    'arts.js',       # Bond Arts, finisher bands, openings, whispers, pixel font
    'people.js',     # the cast as shaded, outlined pixel sprites with blinks and emotes
    'modes.js',      # other perspectives: flight (into the screen), mural (face-on), city (from above)
    'wren.js',       # Wren's jointed figure, poses and slash crescents
    'draw.js',       # world drawing
    'game.js',       # loop, camera, checkpoints
    'hud.js',        # HTML HUD and menus
    'front.js',      # boot splashes, title, main menu, settings
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
