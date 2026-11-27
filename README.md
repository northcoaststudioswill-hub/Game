# Pocket Lantern

A pocket console in one HTML file, with swappable game cartridges.

| Slot | Cartridge | Source |
| --- | --- | --- |
| 1 | **Sprouts** | `src/sprouts.js` (also holds the console itself: shelf, input, sound, boot) |
| 2 | **North Coast Knockout** – 2D fighter | `src/knockout.js` |
| 3 | empty | |

`index.html` is the playable build. After editing anything in `src/`, rebuild it:

```
python3 build.py
```

`src/shell.html` is the page (console body, shelf, CSS); `src/tracks.js` is the embedded music.

## North Coast Knockout

Controls (no two-button presses). Knockout shows four face buttons (A, B, X, Y); Sprouts keeps its two.
D-pad to walk / jump / crouch, double-tap to dash, hold back to block, **A** light (A,A,A combo), **B** heavy,
down+A launcher, down+B low, forward+A up close to throw, **X** special 1, **Y** special 2,
**Select** super when the meter is full (it glows). Win two rounds, then press X, Y or Select to finish.
Keyboard: arrows/WASD, Z/J = A, X/K = B, C/L = X, V/I = Y, Q = Select, Enter = Start.

Music: the cartridge plays only tracks tagged `"use":["ko"]` in `src/tracks.js` (currently Retro Battle Theme);
with none tagged it falls back to its built-in chiptune.

Everything is drawn in code, so it is all editable in `src/knockout.js`:

- `CH` – the roster: names, colours, stats, special / super / finisher names, win quotes
- `HD` – the pixel-art heads
- `ST` – the stages
- `MV`, `MVO`, `MN` – shared normal moves, each fighter's tweaks to them, and their move names
- `S1`, `S2`, `SUP` – the two specials per fighter (X, Y) and supers
- `SONG` – the chiptune. Any track in `src/tracks.js` tagged `"use":["ko-menu"]` or `["ko-fight"]` plays instead.

## Also in this repo: GODMODE.EXE

A separate game, not a cartridge: a mobile-first 3D god game in one HTML file, in its own folder. Play
[`godmode/index.html`](godmode/index.html); details and changelog in [`godmode/README.md`](godmode/README.md).
