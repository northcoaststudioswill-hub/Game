# Starhaven

An original 2D side-scrolling action RPG. Fae-court romantasy, all original characters.

- **Wren** — a mortal huntress, reborn fae, who paints murals to bring a hidden city back to life
- **Lord Caelum** — High Lord of the Court of Dusk
- **Starhaven** — the hidden city of starlight, your home base
- **The Iron King** — the villain across the sea, whose spies creep through Thornwood

**Core loop:** missions earn Starlight → Starlight rebuilds the city → the city and your bonds make you stronger → the next chapter opens.

**This branch is Starhaven's own home.** It is unrelated to Pocket Lantern and to the fighter. Nothing from those projects lives here, and nothing here touches them.

## Status
**Concept build (Rebuild 2): the Prologue through Chapter 2, story-led, playable on a phone.** Waiting for Will's verdict.
- What the player sees, chapter by chapter: [`STORY.md`](STORY.md)
- What changed: [`CHANGELOG.md`](CHANGELOG.md)
- The design (source of truth): [`DESIGN.md`](DESIGN.md). Build plan and quality bar: [`BUILD-PLAN.md`](BUILD-PLAN.md).

## Play it
Open `game/starhaven.html` in a browser. On a phone, hold it sideways. Keyboard: A/D move, Space jump, J strike, Shift dash,
W talk/paint, S + J in the air strikes down, Esc menu. Gamepad: A jump, X strike, B dash, Y talk/paint.
The menu has **Story & goals** (what to do, the story so far, who's who) and **Tune the feel** (live sliders).

## For developers
- Source: `game/src/`, small files with one job each. Content is data: every line of story, the chapters and goals in
  `story.js`; the three levels in `rooms.js`; feel numbers in `tuning.js`. Code: `input.js`, `physics.js`, `fx.js`,
  `player.js` (Wren), `enemies.js`, `art.js` (portraits, intro panels, people), `draw.js`, `game.js` (chapters, story
  runner, loop), `hud.js` (dialogue, cards, journal, menus).
- Build: `python3 starhaven/game/build.py` writes `game/starhaven.html` (one file, no dependencies).
- Tests: `node starhaven/game/tests/feel.js` (gaps, combat numbers, checkpoints, and each chapter played start to finish
  with its story) and `node starhaven/game/tests/smoke.js [outDir]` (every story screen on a landscape phone, screenshots).

## Engine note
Godot 4 is still the long-term target in `DESIGN.md`, but for now Starhaven is a browser concept so Will can play it on
his phone. If the concept is good, it gets expanded. The code is set up to port cleanly either way: story, levels and feel
numbers are data files, and each code file has one job (player, enemies, rooms, story runner, drawing, HUD).
Muse's earlier browser slice was a separate prototype and is not in this repo.
