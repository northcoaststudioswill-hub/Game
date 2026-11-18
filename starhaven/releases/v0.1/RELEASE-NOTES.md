# Starhaven v0.1 — the first slice (Nov 18, 2026)

A North Coast Studios game, with E Concepts. A fae-court romance told as a 2D action game: Prologue (two parts) and
Chapters 1 to 3 of a planned nine. About 45 to 70 minutes for a first play, longer if you gather everything.

**Play:** open `starhaven-v0.1.html` in a browser (one file, nothing to install), or use the shared Claude link.
Phone upright or sideways, touch or a Bluetooth controller, or a keyboard. Three save slots, saved on your device.

**This folder is frozen. Never edit it.** The working copy is `starhaven/game/`.

## What is in it

| | Chapter | What you do |
|---|---|---|
| P1 | The Winter Woods | A mortal hunt: firewood, snares, your father's targets, a starving wolf, a white stag. Lord Rowan at the door. |
| P2 | Under the Mountain | The Thorn Queen's three trials. Death. Caelum's blood. The bond. |
| 1 | Ashes | A flight out of the Spring Court on Caelum's wings. The dark street. The first mural. The rooftop. |
| 2 | The Five | Bram's question and his three rings, the thorn pit, the Iron King's thorn sprites, Iris's vision. |
| 3 | First Light | The Flame, the queen's thorns, wyrmlings, the three-phase Old Wyrm, Rowan on the peak. |

Between chapters: evenings with Caelum, Bram, Iris or Thane, chosen by walking the Lamp Square.

**Systems:** dagger combos with a dash strike, rising strike and down strike; the Flame and its charged wave; Bond Arts
(STARFALL, FIRST LIGHT); perfect-dodge openings; bonds that rise and fall with a stated reason; decisions the story
remembers and answers; residents' errands; Starlight and Wren's Constellation; experience and six levels; a journal;
first-time explanations of every system.

## How it was tested

Only by scripts, in headless Chromium at phone size:
- 50 play checks (`tests/feel.js`): every chapter played start to finish by a bot, every system exercised.
- 19 menu and save checks (`tests/front.js`).
- A random-input run (`tests/fuzz.js`): 9,000 frames a chapter, sideways and upright, no errors.
- A screenshot run of every story screen (`tests/smoke.js`).
- Speed (`tests/perf.js`): 60 pictures a second at full speed; 31 to 38 a second with the processor slowed fourfold
  and no graphics chip.

## Known limits, stated plainly

- **Nobody has played it by hand, and it has not been run on a phone.** Every feel number (jump, dash, damage, how
  long the Old Wyrm takes) is a guess checked by bots.
- The Old Wyrm is long for a player who never uses a Bond Art (about two minutes for the test bot).
- Held upright, the picture is about a third of the screen.
- The story and world fonts load from Google Fonts; offline they fall back to plainer ones.
- The wyrms and the wolf are drawn more simply than Wren and the cast. Four prologue scenes (the garden, the thorns,
  the cell, the trials) are older drawings than the rest.
- Music and sound are synthesized placeholders.
- Chapters 4 to 9 are not started. The game ends on a teaser for Chapter 4.
