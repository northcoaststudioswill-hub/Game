# Pocket Lantern — where everything is (Nov 17, 2026)

Estimates: Sproutwild is Claude's, Rootdeep and the note on the others are Will's. Sprouts, Knockout and Patch & Plate are Claude's guesses kept inside Will's "less than 40%" range. They measure how far each game is from the version you'd call finished. Change any number freely.

## Progress by game

| Game | Where it lives | Version | Estimate | Basis |
| --- | --- | --- | --- | --- |
| Sprouts (cart 1) | `src/sprouts.js` | original, to be expanded | 30% | Will: "definitely not done". Playable and a good base, but it gets more content next. |
| North Coast Knockout (cart 2) | `alt/src/knockout.js` | v0.35 reworked + Fable passes | 25% | Will: less than 40%. Roster and supers in; balance and a phone check not done. |
| Rootdeep | `v0.2/` and `alt/src/rootdeep.js` | v2.9 "Cast update" | 40% | Will's estimate. Its handoff lists the open threads. |
| Patch & Plate (cart 4), the cooking game | `alt/src/patchplate.js` | v0.3 pre-alpha | 35% | Will: maybe further along than the others, but bug fixes and polish are needed. Erin's farm stand: plant, cook, serve. |
| **Sproutwild / Pocket Lantern (cart 5)** | `alt/src/sproutwild/` | v9.9 | **35%** | The castle path works end to end, and the Meadow and Sunkeep are playable. Sigils 2 to 4, Bottie's final tower and the post-game are not played by hand. About 4 hours of content is the target. |
| **Thornwatch** (slot 4 of the Thornwatch file) | `muse/games/thornwatch/` on `claude/2d-fighter-game-characters-r9oir7` | v3.7 (v4.0 not started) | **30%** | A working tower defense with three gardens, but it reads as a mini-game. v4 research is done; no v4 build yet. |
| Starhaven (separate project) | `starhaven` branch | outline | 10% | Design outline only. Not part of Pocket Lantern. |
| Sootborn (standalone, not Pocket Lantern) | `sootborn/` on the `sootborn` branch | v0.6 vertical slice | 15% | Claude's guess. A playable prologue and one shift in the present day. Will loves the story. |

## How we work (notes from Will)

- Spreading across several projects is how Will is learning; the games get better together. Focus can come later, as the lessons settle.
- Starting new projects inside this repo (Starhaven and Sootborn, then Sprouts fully here) went better than editing the Muse copies. Muse-first took longer to reach a game Will liked.

## Open questions for Will

1. **Derek.** Keep as a placeholder, cut, or promote to a full hero in Thornwatch?
2. **Canon move names.** Can v4 upgrade paths use new names, or are MAZEL TOV LASER, TOWEL WHIP and the rest fixed?
3. **Bottie and Bibi in Thornwatch.** Okay to appear in its cut-scenes, given they belong to Pocket Lantern's story?
4. **Thornwatch's home.** Keep it in the four-game console file, or give it its own cartridge file once v4 is ready?
5. **Thornwatch's width.** Three gardens with a Long Night is the target. Want a fourth?
6. **Sprout names.** Cuyapup and Bessling still point at the Cuyahoga River and Lake Erie's "Bessie". Keep or rename?
7. **Starhaven.** Its outline draws on a published fantasy series. Confirm it will be an original world before it's sold or shared publicly?
8. **Repo visibility.** Make the repo private now, or once Pocket Lantern is finished?

## Backlog: known things to address at some point

Not a queue. Nothing here has to happen first or all at once. Pick what Will wants when he wants it.

- **Pending pushes** (only after Will says "push"): the progress doc, universe notes and cleanup report are local on `thornwatch-v4-work`.
- **Cleanup, per game** (see `CLEANUP.md`):
   - Rootdeep: delete `cineActor`, `godCore`, `rdVig`.
   - Thornwatch: delete `twHeart`, `twRangeCirc` when next rebuilt.
   - Sproutwild: delete the 12 unused functions and the 2 dead branches. Ask Will before removing the 74 duplicate copies.
   - Verify each with its own check (Sproutwild: `field-lab.js`, 124 checks). No behaviour change expected.
- **Thornwatch v4.0 build**, after Will answers the open questions. Order: core loop and first garden, upgrade paths, cut-scenes, then the rest. Playtest after each step.
- **Sproutwild**: play Sigils 2 to 4 by hand, test Bottie's tower, check the Lantern rings in a long run.
- **Sprouts**: expand the original (Will: "definitely not done").
- **Rootdeep**: the open threads in its handoff (about 40% done).
- **Patch & Plate** (the cooking game): bug fixes and polish.
- **Knockout**: balance pass on a phone.
- **Sootborn**: read the code next, after the cleanup, if Will wants it.
- **Starhaven**: only if Will chooses it; its outline needs an original-world decision first.

## Ideas (add yours here)

- ...

## Ideas (add yours here)

- ...
