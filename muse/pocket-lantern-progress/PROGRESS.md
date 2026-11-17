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

## Decisions from Will (Nov 17)

- **Derek is a recurring character, not a placeholder.** He's Marcus's friend, coworker and business partner. Will likes every use so far. Keep him, and use him in more games.
- **Reuse is fine.** Characters and scenes can recur across games. Only the placeholder characters are open: Kiss, Scout, Ranger, Elder and similar. They can be renamed or become something else later, so don't build meaningful stories around them yet.
- **Fighting game (Knockout):** its characters and moves fed the other games. Later, things can feed back into it. It's not the main project.
- **Lore:** Sproutwild has the most developed story so far. Easter eggs can cross games. Thornwatch sits in the same Pocket Lantern universe.
- **Bessie:** the lake monster is named BESSIE, not BESSLING.
- **Sproutwild monsters:** they'll need an art overhaul eventually. Several look good from afar, but close up some sprites and eyes are messy. Don't rip them up now. Names and art can change later, and the Minecraft-style look has grown on Will.

## Open questions for Will

1. ~~Derek.~~ **Answered:** recurring character, keep.
2. **Canon move names.** Can v4 upgrade paths use new names, or are MAZEL TOV LASER, TOWEL WHIP and the rest fixed?
3. **Bottie and Bibi in Thornwatch.** Reuse is fine, so this is only a yes or no on the cut-scenes.
4. **Thornwatch's home.** Keep it in the four-game console file, or give it its own cartridge file once v4 is ready?
5. **Thornwatch's width.** Three gardens with a Long Night is the target. Want a fourth?
6. ~~Sprout names.~~ **Answered:** the lake monster is BESSIE.
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

### Expeditions (idea, Will, Nov 17)

Inspired by Pikmin Bloom: send a buddy or sprout out for a while and collect what comes back. Sketch, not decided:

- **Overflow goes out.** When the base has more sprouts or buddies than it can hold, the extras leave on an expedition to far regions instead of sitting in the Barn. In the story, the Lantern sends them out to give the light to buddies in faraway places. It manages growth without a delete button.
- **Timed trips.** Each expedition has a length (minutes to hours, not real time that punishes closing the game) and a region. A bigger region gives better rewards and needs a stronger buddy.
- **Returns.** They come back with resources (ore, fiber, rare bugs) or a calmed buddy. The LIGHT SHOWN count goes up when they light a far-off wild.
- **Slots.** A few expedition slots at first, one more per Sunkeep level. That keeps it a choice, not busywork.
- **Keep it readable.** One line at home: "Two sprouts are out east, back in about an hour." No pop-up interrupts play.
- **Balance rule.** Expeditions must not replace the base or make it brain-dead. The base stays the main game: the trips are a side income, and the player still chooses who to send.

- ...

## Ideas (add yours here)

- ...
