# Pocket Lantern: the main line (seven cartridges)

This folder is the game. One console, seven cartridges, one HTML file. It began as an experimental fork of v0.3
("ALT"), became where Knockout was reworked, and is now where everything is built. Nothing outside `alt/` is written
by anything in here; v0.1 to v0.35 stay frozen.

- **Play it:** `games/pocket-lantern-alt.html` (one file, open it in a browser).
- **What changed:** [`CHANGELOG.md`](CHANGELOG.md)
- **Everything open, per game:** [`../OPEN-ITEMS.md`](../OPEN-ITEMS.md)

## The games

| # | Cartridge | In one line | How you play | Source |
|---|---|---|---|---|
| 1 | **Sprouts** | Relight the Great Lantern. Will throws sprouts at berries, gates, grubs and four sun shards; the crew carries things home; Louie fetches strays. Days and nights, a garden, a house, valley projects, a field guide, 3D cutscenes for the big story beats, and the North Coast after the ending. | D-pad walk, A throw or act, B call, Select swap kind | `src/console.js` |
| 2 | **North Coast Knockout** | A 2D fighter with the cast: Will, Erin, Marcus, Louie, Lil Bottie, King Bibi, Corbin, Mama. Two supers each with cut-ins, parry, wall bounce, an arcade tower, Survival, Training and Trials. | D-pad, A light, B heavy, X and Y specials, Select super | `src/knockout.js` |
| 3 | **Rootdeep** | A roguelite crawl under the valley. Short rooms, relics, a new run every time. Also holds the Lantern menu (stats, achievements, tickets). | D-pad, A attack, B cast, Select swap | `src/rootdeep.js` |
| 4 | **Patch & Plate** | Erin's farm stand beside the Great Lantern. Plant, cook and serve; each day is a level of a minute or two; the valley's people have favourites and heart scenes. | D-pad, A use, B toss, Select recipes | `src/patchplate.js` |
| 5 | **Sproutwild** | The Lantern is dark and the buddies went wild. Throw sprouts to show them the light, bring them home to work at Sunkeep, light four Guardians for their Sigil stones, then face Bottie. | D-pad, A act, B call, Select, Start menu | `src/sproutwild/` |
| 6 | **Lightswarm** | An expedition from Sunkeep, survivors style. You only steer; the swarm throws the light. Ten keepers with their own move and two supers, level-up cards, finds, the Keeper's Trail, Sunkeep upgrades. | D-pad walk, A your move, B whistle, Select super | `src/lightswarm.js` |
| 7 | **Clankawatch** | Garden tower defense. Plant sprout towers and keepers by day; by night Lil Bottie's drone swarms follow the track to the Garden Heart. Three gardens, 26 nights, three save files. | D-pad cursor, A plant or grow, B back or speed, Start begin or pause | `src/clankawatch/` |

**The console itself:** opening the page plays a power-on sequence (a match, the lantern, the name, one sprout per
cartridge), then the shelf in rows of three with the Lantern menu below. Each game has its own boot when its cartridge
goes in. Start pauses; quitting a game returns to the shelf.

## Its saves are separate

Every save key gets a `pl-alt:` prefix (a few lines at the top of `src/shell.html`). Playing ALT in the same browser as the
real game can't read or overwrite Erin's Patch & Plate days, Rootdeep runs, or anything else. It also means ALT starts fresh.

## Files

| Path | What it is |
| --- | --- |
| `src/shell.html` | The page: console body, CSS, buttons, the save-key prefix. `/*@...*/` marks where the code goes. |
| `src/console.js` | The console and Sprouts (cartridge 1). |
| `src/knockout.js` | North Coast Knockout (cartridge 2). Most of the ALT work is here. |
| `src/rootdeep.js` | Rootdeep (cartridge 3), plus the Lantern menu (stats, achievements). |
| `src/patchplate.js` | Patch & Plate (cartridge 4). v0.5 since Nov 17 2026 (v0.4 the Sunkeep update, v0.5 big moments and kitchen buddies); v0.3's copy is untouched. |
| `src/clankawatch/` | Clankawatch (cartridge 7), copied from `muse/games/thornwatch/src` on its own branch; with its changelog, handoff and lore. |
| `tests/console_shelf.js` | The power-on sequence, the shelf, and Clankawatch booting and playing. |
| `src/lightswarm.js` | Lightswarm (cartridge 6), vertical slice v0.1: a survivors-style expedition. Test: `tests/lightswarm_lab.js`. |
| `src/sproutwild/` | Sproutwild (cartridge 5): its files are listed in `build.py` in build order; see its own `README.md` and `CHANGELOG.md`. |
| `backups/` | Frozen builds. Never edit. |
| `STORY-NOTES.md` | Will's story decisions for Pocket Lantern, and what is still open. |
| `tests/sproutwild/` | Sproutwild's checks. `field-lab.js` (step-by-step rules, about 90 s). `checkpoint.js <html> <out> <point>` plays one stretch in real time from a saved point: `walkend`, `plot`, `barn`, `castle`, `reload` (30 to 100 s each). `old-saves-from-main.js` makes saves with main's build and continues them here. `autopilot.js` is a full fresh-save run (slow; use the checkpoints first). |
| `build.py` | `python3 alt/build.py` assembles `games/pocket-lantern-alt.html`. The 13 MB of embedded music is read from the v0.3 build (read-only), not copied. |
| `tests/ko_lab.js` | Knockout lab: feel metrics (jump arc, pose snap, hit slide, juggles), frame sheets, the new modes, a text audit of every menu. |
| `tests/fable_lab.js` | Fable pass 1: parry, wall bounce, K.O. frame, stances, rules and Trials (20 pass/fail checks, sheets in `playtest/fable/`). |
| `tests/sprouts_valley.js` | Sprouts, the valley update: bridge, nectar, pear, treasure, saves, and the prequel pass (25 checks). |
| `src/sprouts3d.js` | Sprouts' 3D cutscenes: a small software renderer (triangles, depth buffer, fog, lamps, dither), the models, and the six scenes. Built into `console.js`'s scope by `build.py`; every name starts `c3`. |
| `tests/sprouts_coast.js` | Sprouts, the 3D scenes and the North Coast: every shot draws, captions fit, the call, door, pier, lens, relight, saves, the ending (41 checks). Optional second argument: a folder for screenshots. |
| `tests/sprouts_story.js` | Sprouts story run: four shards, Thornback, the ending, the house, a project, the next morning (17 checks). |
| `tests/sprouts_soak.js` | Sprouts autopilots: Erin's first day by the objective marker, and seeded chaos runs of the mid-game, with invariant checks. |
| `tests/sprouts_tour.js` | Plays Sprouts in real time from a fresh save by following the objective marker. |
| `tests/lantern_shots.js` | The Lantern menu's stats, achievements and ticket pages with sample saves. |
| `tests/pp_test.js` | Patch & Plate test (119 checks): v0.3's 76 plus the v0.4 to v0.6 checks. |
| `tests/v02/` | v0.2's Rootdeep/console tests, copied so their screenshots land here instead of in `v0.2/`. |
| `playtest/` | Screenshots and frame sheets from the runs above. |

Run tests from the repo root, after `python3 alt/build.py`:

```
node alt/tests/ko_lab.js                                   # all Knockout sections; ONLY=metrics,modes,text to pick
node alt/tests/fable_lab.js                                # the Fable-pass checks
node alt/tests/pp_test.js
node alt/tests/v02/roguelite_loop.js alt/games/pocket-lantern-alt.html
```

## Keeping it in step with the main line

ALT is a snapshot of v0.3, not a live build of it (v0.3's `build.py` pulls from v0.2 every time; ALT doesn't).
If Rootdeep moves on in `v0.2/src/rootdeep.js`, those changes don't arrive here by themselves. To take ALT's changes back
the other way, each change in `CHANGELOG.md` names the file and what it touches, so it can be copied over one at a time.

## Nothing here is phone-confirmed

Everything was checked in headless Chromium at iPhone 16 Pro Max size (440x956). Will's rule stands: a change isn't done
until it's been played on the phone.
