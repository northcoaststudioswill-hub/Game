# Starhaven

An original 2D side-scrolling action RPG. Fae-court romantasy, all original characters.

- **Wren** — a mortal huntress, reborn fae, who paints murals to bring a hidden city back to life
- **Lord Caelum** — High Lord of the Court of Dusk
- **Starhaven** — the hidden city of starlight, your home base
- **The Iron King** — the villain across the sea, whose spies creep through Thornwood

**Core loop:** missions earn Starlight → Starlight rebuilds the city → the city and your bonds make you stronger → the next chapter opens.

**This branch is Starhaven's own home.** It is unrelated to Pocket Lantern and to the fighter. Nothing from those projects lives here, and nothing here touches them.

## Status
**Milestones 1 and 2 built (movement and combat feel), waiting for Will's verdict.** See `CHANGELOG.md`.
The full design outline is in `DESIGN.md`. The build plan and quality bar are in `BUILD-PLAN.md`.

## Play it
Open `game/starhaven.html` in a browser. On a phone, hold it sideways. Keyboard: A/D move, Space jump, J strike, Shift dash,
S + J in the air strikes down, Esc menu. Gamepad: A jump, X strike, B dash. The menu has **Tune the feel** with live sliders.

## For developers
- Source: `game/src/`, small files with one job each (tuning numbers, level data, input, collision, effects, Wren, enemies,
  drawing, game loop, HUD). Content is data: feel numbers live in `tuning.js`, the level in `room-grove.js`.
- Build: `python3 starhaven/game/build.py` writes `game/starhaven.html` (one file, no dependencies).
- Tests: `node starhaven/game/tests/feel.js` (gaps, combat numbers, checkpoints, full autopilot run) and
  `node starhaven/game/tests/smoke.js [outDir]` (loads on desktop and a landscape phone, takes screenshots).

## Engine note
Target is still Godot 4 for Steam and app stores. This first build is a browser build on purpose: the build plan says Will
plays every milestone on his phone, and a browser file is the only thing that reaches his phone from here today. It is
written to port cleanly: every number and level is data, and each file maps to one Godot script (player, enemy, room, save).
Muse's browser slice was a separate prototype and is not in this repo.
