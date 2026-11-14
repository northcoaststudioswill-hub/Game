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

Controls (direction + button, no motion inputs): d-pad to walk / jump / crouch, double-tap to dash,
hold back to block, **A** punch (A,A,A combo), **B** kick, down+A uppercut, down+B sweep,
forward+A up close to throw, **Select** special 1, forward+Select special 2,
down+Select (or A+B) for the super when the meter is full. Win two rounds, then press Select to finish.

Everything is drawn in code, so it is all editable in `src/knockout.js`:

- `CH` – the roster: names, colours, stats, special / super / finisher names, win quotes
- `HD` – the pixel-art heads
- `ST` – the stages
- `MV`, `S1`, `S2`, `SUP` – normal moves, the two specials per fighter, and supers
- `SONG` – the chiptune. Any track in `src/tracks.js` tagged `"use":["ko-menu"]` or `["ko-fight"]` plays instead.
