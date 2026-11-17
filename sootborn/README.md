# SOOTBORN — Book One: The First Shift

A North Coast Studios × E Concepts game. A 16-bit story RPG set in Cinderwell, an undercity
that runs the air for a gleaming upper world it is told does not exist.

Forty-one days ago, the Array Authority burned Seren Holloway in the heart-furnace for a crime
her husband, Kael Brennick, committed. Today Kael goes back to work on the same valve bank.

This is a **standalone game** (not a Pocket Lantern cartridge). It is the current vertical slice:
a playable prologue (proposal, fever, stealth heist, execution), then one full shift in the present day.

## Play

Open `index.html` in a browser. It is a single self-contained file.

- **Touch:** on-screen pad, A to interact, B to go back (throws a bolt during the heist), ☰ for the menu.
- **Keyboard:** WASD/arrows, E or Enter, Esc or X, M for the menu, Q/R for journal tabs, H for a puzzle hint.
- **Controller:** stick or D-pad, Ⓐ, Ⓑ, Start, shoulder buttons.

## Build

The source is modular and lives in `src/`. `index.html` is generated from it — edit `src/`, then run:

```
node build.mjs
```

| File | What it holds |
| --- | --- |
| `src/shell.html` | Page, CSS, DOM overlays (dialogue, menus, touch controls) |
| `src/core.js` | Constants, storage, settings, input (touch/keyboard/gamepad), WebAudio synth and music, layout |
| `src/art.js` | Palette, 3×5 pixel font, character / Accredited / portrait generators, tiles and props |
| `src/content.js` | Story helpers and maps (apartment, Ashgate Square, Bay 3, clinic, old tunnel) |
| `src/story.js` | Cast, journal, dialogue, hotspots, puzzles, ambient barks |
| `src/systems.js` | State, saves, dialogue runner, pipe puzzle, world, heist stealth, lighting, fades |
| `src/cinema.js` | Cutscene engine and the prologue scripts |
| `src/ui.js` | HUD, menus, splash, title, day-end |
| `src/main.js` | Game flow and the fixed-timestep loop |

All art and music are generated in code. There are no external assets.

## Tests

Scripted Playwright runs (they need Node and Playwright; set `CHROME_PATH` if Chromium isn't bundled):

```
cd tests
node play.mjs     # full run: prologue, heist, furnace, whole shift, save/reload
node mobile.mjs   # portrait phone, landscape phone, 1280x800 layouts
node clinic.mjs   # clinic visit
```

Screenshots go to `tests/shots/`.

## Docs

- `docs/STORY_BIBLE.md` — cast, lore, the crime, scene-by-scene flow, tech notes
- `docs/CHANGELOG.md` — version history
