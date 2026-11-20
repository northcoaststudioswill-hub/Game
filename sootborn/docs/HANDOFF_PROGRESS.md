# SOOTBORN — handoff progress, steps 7 to 9 (v0.72 to v0.74)
The project's "sootborn handoff" and "sootborn master timeline" docs still hold their v0.71 text (steps 1 to 6 marked done). Steps 7, 8 and 9 are now done too; their build notes are below, copied from the current handoff, which is `docs/HANDOFF.md` in the repo. **Next is Step 10 (matching the writing), version 0.75.** `GAME_VER` in `src/ui.js` is 0.74.

Project docs: the changelog is `claude/sootborn-changelog.md` (v0.71 on), with v0.66 to v0.70 in `-changelog-archive-3.md`. Story additions since v0.71 are in `claude/sootborn-story-bible-additions.md`.

**Step 7 · v0.72 · Part Two's spine** — **DONE 2026-11-20**
- The fourth ring as home base (12a), with the suspicion meter, visited in the Post, the Balancing and What She Knows, with its own date card each time; Kestrel, Sable, porters; finds into the Codex. The head rule here first (soot look at whoever speaks; the Accredited don't). Porters kneel at the bell.
- Part Two's cold open (10), the book (11a), Tavi at sixteen (14a).
- Check: the bot passes through the ring each chapter; the meter climbs and falls.
- Done: `walkRing(n)` in `src/assay.js` (n = 1, 2, 3; `FF.ring1`…`FF.ring3`), a walk place on `bg: 'keep'` with `bg2: 'ring4'` (wall bays are `rwall` props: plain, door, win, lamp, pipe, bell; `stall`). The meter is `G.flags.susp`, 0 to 6, drawn by `walk.meter`; `walk.tick(k, dt, B)` rings the bell after three talks and may return steps to say; people with `acc: 1` do not turn their heads; `a.kn = 1` kneels a figure. Cards and calls are in `P2[1]`, `P2[2]`, `P2[3]` in `src/part2.js`. Finds `f_line`, `f_bellplate`, `f_greens`, `f_handpipe` in `src/rowk.js`.
- Done: the cold open is `{ issue: 'stair', cold: 1, or: [] }` before the PART TWO card (`Issue.start(key, done, cold)`; in the level `SC.cold`: no opening pages, one wave, `coldEnd()` at the top of the first flight; its save key ends `-cold`; the flag is `issue_staircold`). The stills are `PLATES` in `src/prelude.js`, played by `Prelude.plate(name, secs, done)` or a `{ plate: 'book' | 'tavi', secs }` step. The years strip is `tr: 'years'` on a card titled "<N> YEARS AFTER THE FURNACE".
- Not built, on purpose: the flash that the porter stepping aside is meant to set off (12b, the white cloak at the camp) and the service stair (12c) are Step 8. The porter and his line are in place for it.
- Tests: `ring.mjs` (N, PICK, S0), `plate.mjs`, `coldopen.mjs`.

**Step 8 · v0.73 · Part Two's flashbacks and new places** — **DONE 2026-11-20**
- The camp at night (12b). The service stair, 2.5D (12c). Celestine's own Assay, 2D, stealth then the valve (14b); gloves on her model everywhere. The barge deck as home in Two Years (15b). Seren finds the bleed (15c).
- Check: each flash's trigger fires and its transition plays; Celestine's gloves in every scene she is in.
- Done, all in `src/assay.js`: `walkCampNight()` (12b; followers are allies with `crew`, moved in `walk.tick` along a trail of the player's steps), `walkServiceStair()` (12c; `bg2: 'sstair'`, `swall` bays), `MISSIONS.ember` (14b; the `raid` map with `grey: 1`, `where`, Proctors on the pickets' rounds, the wheel at the `valve` hot), `walkBarge()` (15b; `bg2: 'barge'`), `walkSerenLine()` (15c; hero `seren`, steps gated by a counter, `exit: () => step >= 3`). Cards and calls in `P2[1]`, `P2[3]`, `P2[4]` in `src/part2.js`. Gloves: `gloves` on `celestine`, `celf`, `cel20` looks (`src/art.js` hand pixels; `L.gloves` in `src/g3.js`).
- Not done: gloves in the hand-painted story panels; the barge as a place revisited (it is walked once).
- Tests: `campn.mjs`, `walk3.mjs` (M=sstair|barge), `seren.mjs`, `ember.mjs`, `gloves.mjs`.

**Step 9 · v0.74 · the Count, the last flash, the ending** — **DONE 2026-11-20**
- The Count as a puzzle (16a); the full Stair replays the cold open's minute from inside (16b); Celestine's "one for forty" line before Little Ember; the ending choice (become her / send her home) and Mara's "little ember" beat (16c); the last flash (16d); the ending as drawn pictures (16e).
- Check: both endings reached by the bot (set `G.flags.ending`), both credits texts shown.
- Done, in `src/prelude.js`: `Prelude.ledger(done)` (the puzzle; state in `Prelude.gm`; flags `countDone`, `countNoted`), `Prelude.pages(list, done, music)` (captioned pictures turned with A or a press), plates `furnace`, `lift`, `square`, `sun`, `names`, `tbarge`, `shelf` (the last two take the ending as `arg`), and `count` / `white` / `hold` on a plate. Steps `{ ledger: 1 }` and `{ pages: () => list }` in `src/cinema.js`. In `P2[5]` (`src/part2.js`): the book after the chapter card; the last flash after `FF.ember()`; the ending's old steps wrapped in `endPages([...])` with `{ pic }` markers (every old line kept). The Stair's echo is a toast in the `stair` block of `issue/story.js`.
- Open with the owner: whether Tavi is a brother or a sister (the plan and the written lines disagree); where the puzzle happens.
- Tests: `ledger.mjs`, `ending.mjs` (E=below|struck), `plates2.mjs`. The whole-story bot skips the puzzle (`Prelude.finish()`), as it skips fights.

