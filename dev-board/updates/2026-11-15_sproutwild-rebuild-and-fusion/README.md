# Dev board update: Sproutwild rebuilt, then fused into the console (Nov 15 2026)

For the dev board team. This folder is everything needed to add this stretch of work to the living board
(https://claude.ai/artifact/HyDXhUmTsQfA6SY4RhPvvJ). Nothing here edits the board or the frozen snapshot;
it is source material: one row per pass, with the photo that goes with it. All times are Eastern, from the commits.

## The short version

- Sproutwild (lil Bottie's creature-collector, v4.7 on Muse) was rebuilt in eleven passes, v5.0 to v6.0, by Will and Claude.
- It was then fused into the console that has the reworked Knockout, as **cartridge 5**. That five-cartridge build
  is the new main line: `alt/`.
- Both builds from just before the fusion are frozen, so nothing was lost.

## Passes

| # | Time | Version | Commit | What changed | Photo |
| --- | --- | --- | --- | --- | --- |
| 1 | 09:47 | Sproutwild v5.0 | `015f962` | All 15 buddies redrawn by a new sprite renderer. Build made to run from the repo. | `photos/v5.0-buddy-lineup.png`, `photos/v5.0-battle-and-meadow.png` |
| 2 | 14:44 | v5.1 | `8dfb6ab` | New field engine: six hand-built scrolling maps replace the flat single screens. Sprouts walk with you as a squad; treasures, type gates, bridges, alphas, trainers. King Bibi becomes the villain behind the Iron Dome. | `photos/v5.1-field-meadow.png`, `photos/v5.1-field-sectors.png` |
| 3 | 15:12 | v5.2 | `54188d1` | The first hour rebuilt: title screen, animated opening story, cut-ins, one HUD, menus, Sunkeep ground. | `photos/v5.2-opening.png`, `photos/v5.2-base-and-menus.png` |
| 4 | 15:18 | v5.3 | `32145ac` | The squad works at Sunkeep too. King Bibi's lines rewritten as satire of the man. | (none) |
| 5 | 15:34 | v5.4 | `54a49d7` | Sunkeep runs like a Palworld camp: buddies and sprouts work stations by skill and haul goods. One art style: outlined cel-shaded trees, new human sprites, lighting. | `photos/v5.4-sunkeep-at-work.png`, `photos/v5.4-first-areas.png` |
| 6 | 15:58 | v5.5 | `ca62c69` | The opening is played, not read. Sprouts swarm and bloom on tired buddies instead of being thrown like a ball. Buddies fetch ore and fiber. The Great Lantern becomes the hub. Louie guides instead of opening a menu. | `photos/v5.5-opening-played.png`, `photos/v5.5-road-and-fetch.png` |
| 7 | 16:03 | v5.6 | `082fb53` | New battle screen: backdrops, attack animations, swarm-and-bloom sequence. | `photos/v5.6-battle.png` |
| 8 | 16:10 | v5.7 | `ad57174` | Mid-game fixes from a play review: Lantern rest, ore-fed kiln, climbing rope, travel only to lit posts, mission strip. | `photos/v5.7-midgame-review.png` |
| 9 | 16:25 | v5.8 | `da07126` | Three save files with new / continue / erase. Saves cleaned on load. Text boxes grow instead of clipping. | `photos/v5.8-save-files-wide-font.png` |
| 10 | 16:39 | v5.9 | `8a968be` | After Will's iPhone screenshots: Sproutwild draws its own pixel font. Erin, Marcus and Louie teach the opening in speech bubbles. | `photos/v5.9-pixel-font-and-cast.png` |
| 11 | 16:58 | v6.0 | `29a9db5` | One-button auto-aim like the original Sprouts. Buddies chop trees and rocks; sprouts pick berries and carry. Quieter speech bubbles. | `photos/v6.0-playtest-opening.png` |
| 12 | evening | Console, five cartridges | this commit | Sproutwild fused into the Knockout console as cartridge 5. `alt/` is the new main line. | `photos/v0.4-five-cartridges-fused.png` |

Full detail for every pass, including what was found in playtests and what is still open:
`alt/src/sproutwild/CHANGELOG.md` (Sproutwild) and `alt/CHANGELOG.md` (the console).

## Where things are now

| What | Where |
| --- | --- |
| The main game, five cartridges | `alt/games/pocket-lantern-alt.html` (build with `python3 alt/build.py`) |
| Sproutwild's source in the main game | `alt/src/sproutwild/` |
| Frozen: the four-cartridge Knockout console from before the fusion | `alt/backups/pocket-lantern-alt_2026-11-15_4-carts_pre-sproutwild_BACKUP.html` |
| Frozen: standalone Sproutwild v6.0 (with Sprouts and Rootdeep, as Muse shipped it) | `muse/games/Sprouts+Rootdeep+Sproutwild-v6.0_2026-11-15_BACKUP.html` |
| lil Bottie's original Sproutwild v4.7 | `muse/games/Sprouts+Rootdeep+Sproutwild.html` (untouched) |

## Lanes this touches on the board

- **Sproutwild** is a new cartridge lane: built on Muse through v4.7 (see `muse/sproutwild/TIMELINE.md`), then eleven passes here.
- **Console**: gains a fifth slot.
- Dashed links worth drawing: Sprouts to Sproutwild (throw / whistle / carry, and the one-button auto-aim, both taken from Sprouts);
  Knockout to Sproutwild (King Bibi, Kiss, Mama, Derek and the Flow Pros truck cross over as trainers and the villain).

## Not confirmed

Everything was tested in a headless browser, including at an iPhone-shaped screen. Will has played early builds on his
iPhone and sent screenshots that drove v5.8 and v5.9; v6.0 and the fused build have not been played on a phone yet.
