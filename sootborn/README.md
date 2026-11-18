# SOOTBORN — Book One

A North Coast Studios × E Concepts game. A 16-bit story RPG set in Cinderwell, an undercity
that runs the air for a gleaming upper world it is told does not exist.

Forty-one days ago, the Array Authority burned Seren Holloway in the heart-furnace for a crime
her husband, Kael Brennick, committed. Today Kael goes back to work on the same valve bank.

This is a **standalone game** (not a Pocket Lantern cartridge). It is the current vertical slice:
a playable prologue (proposal, fever, stealth heist, execution), then two full days in the present:
the first shift back, and the Festival of the First Fire.

## Play

Open `index.html` in a browser. It is a single self-contained file.

- **Touch:** on-screen pad, A to interact, B to go back (throws a bolt during stealth), ☰ for the menu.
- **Fights:** A strikes (three-hit chain), B dodges. Dodge through a swing to open the foe up.
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
| `src/content.js` | Story helpers and maps (apartment, Ashgate Square, Bay 3, Fuse Room C, clinic, old tunnel, festival night) |
| `src/story.js` | Cast, journal, dialogue, hotspots, puzzles, ambient barks |
| `src/systems.js` | State, saves, dialogue runner, pipe puzzle, world, heist stealth, lighting, fades |
| `src/cinema.js` | Cutscene engine and the prologue scripts |
| `src/panels.js` | Illustrated story panels that cutscenes cut to |
| `src/brawl.js` | Pseudo-3D arena fights: fury, ELEVEN, Memory Arts, the shot player used by the opening |
| `src/g3.js` | Real 3D for the surface: a small WebGL renderer (no library) |
| `src/ff.js` | The Assay: opening sequence and the three flash-forward battles |
| `src/checkpoints.js` | Captured saves for the dev checkpoint menu |
| `src/day2.js` | Day 2 "First Fire": dialogue, hotspots, the Ember Ring, festival cutscenes |
| `src/ui.js` | HUD, menus, cutaway map, splash, title, day-end |
| `src/main.js` | Game flow and the fixed-timestep loop |

All art and music are generated in code. There are no external assets.

## Tests

Scripted Playwright runs (they need Node and Playwright; set `CHROME_PATH` if Chromium isn't bundled):

```
cd tests
node play.mjs     # full run: prologue, heist, furnace, whole shift, save/reload
node mobile.mjs   # portrait phone, landscape phone, 1280x800 layouts
node clinic.mjs   # clinic visit
node day2.mjs     # all of Day 2 from a synthetic Day 1 save (VAR=b for the other branch, PORTRAIT=1 for phone)
node fight.mjs    # every bout against a mashing bot and a dodging bot
node sneak.mjs    # walks the festival stealth for real
node heist.mjs    # walks the prologue heist with a cautious bot (ROUTE=north or south for other routes)
node ff.mjs       # opening shots; M=valley|ford|keep plays that battle with a bot
node arts.mjs     # Memory Art cut-ins and attacks
node flow.mjs     # opening, New Game battle, furnace fight
node dev.mjs      # every dev checkpoint, save slots
```

Screenshots go to `tests/shots/`.

## Docs

- `docs/STORY_BIBLE.md` — cast, lore, the crime, scene-by-scene flow, tech notes
- `docs/CHANGELOG.md` — version history
