# Pocket Lantern: everything open, in one place

Updated Nov 18 2026. One list per project: known bugs, things not tested, what is waiting on Will, and what is wanted
next. Pulled from each project's latest changelog, handoff, playtest notes and story notes; the source is named under
each heading so nothing here has to be taken on trust. Fix history stays in [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md) and
the changelogs.

**True of everything below:** nothing has been confirmed on an iPhone. Every check was a script in headless Chromium
at phone size. Will's rule stands: a change is not done until it has been played on the phone.

| Project | Where it is | Version | State |
|---|---|---|---|
| [The console](#the-console-pocket-lantern) | `alt/` on `main` | seven cartridges | Current |
| [1. Sprouts](#1-sprouts) | `alt/src/console.js` | valley update, Nov 18 | Stable, being refined |
| [2. North Coast Knockout](#2-north-coast-knockout) | `alt/src/knockout.js` | Fable pass 3 | Paused |
| [3. Rootdeep](#3-rootdeep) | `alt/src/rootdeep.js` | v0.2.1 | Finished, handed off |
| [4. Patch & Plate](#4-patch--plate) | `alt/src/patchplate.js` | v0.7 | Stable |
| [5. Sproutwild](#5-sproutwild) | `alt/src/sproutwild/` | v12.10 | In active development |
| [6. Lightswarm](#6-lightswarm) | `alt/src/lightswarm.js` | vertical slice v0.3 | For evaluation |
| [7. Clankawatch](#7-clankawatch) | `alt/src/clankawatch/` (copy) | v4.0 alpha 3 | In active development on its own branch |
| [The story](#the-story-open-questions-for-will) | `alt/STORY-NOTES.md` | | Open questions |
| [Other games](#other-games-not-pocket-lantern-cartridges) | their own branches | | Separate projects |

---

## The console (Pocket Lantern)

Sources: [`alt/CHANGELOG.md`](alt/CHANGELOG.md), [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md), [`NEEDS_UPDATE.md`](NEEDS_UPDATE.md).

**Known issues**
- The Lantern menu (stats, achievements, played count) only knows the first cartridges. Lightswarm and Clankawatch are not counted.
- The power-on chime is silent until the page has been touched (a browser rule, not a bug that can be fixed).
- Clankawatch in the console is a copy of its branch. Changes there do not arrive by themselves, and saves from its old standalone file do not carry over.
- The Sprouts and Patch & Plate songs by William Cohen only play on claude.ai. Downloads and the GitHub Pages copy are silent for them.
- The published claude.ai page refers to cloud saves that are not switched on for that link, so saves there stay in the browser.
- The build is 15.0 MB. The limit for a claude.ai page is 16 MB, and the songs are most of it.

**Not done**
- `docs/index.html`, the public GitHub Pages copy, still holds the old four-cartridge build. It is only updated when Will says so.
- The seven-cartridge build has not been cut as a numbered release (no share zip). The last numbered release is v0.35.
- The power-on sequence and the new shelf have not been seen on a phone.

**Wanted**
- Music: copy the mp3s into `docs/music/`, point the tracks at same-site paths, rebuild and redeploy (about 7 MB more in the repo). Plan in `NEEDS_UPDATE.md`.
- lil Bottie's game folded into the shelf, if Will wants it (it lives in its own console fork today).
- Room is left on the shelf for two more cartridges before a fourth row is needed.

---

## 1. Sprouts

Sources: [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (the Sprouts sections, Nov 17 and 18), [`v0.35/CHANGELOG.md`](v0.35/CHANGELOG.md).

**Not tested**
- Nothing from the valley update, the prequel pass, the menus and field guide, the Collection, or nature's balance has been played by hand or on a phone. All of it was stepped by script (`sprouts_valley.js` 48 checks, `sprouts_story.js`, `sprouts_soak.js`).
- Nature's balance (a wild buddy quietly eats a stranded sprout) is rare by design. Two three-day autopilot runs saw none. Whether a player ever notices it is unknown.
- The objective-marker bot got through four asks in four of five runs and two in the other.

- The 3D cutscenes and the North Coast (Nov 18) were stepped by script only (`sprouts_coast.js`, 84 checks). Not played by hand, not seen on a phone, no sound listened to. Frame time on a real phone is unknown.
- The soak test's first-day bot used to finish only one of Erin's asks about 1 run in 10. Not seen in 16 runs since sprouts stopped being thrown over shut gates; probably that, not proven.
- Speed was measured in headless Chromium slowed four times, never on a phone. The 3D scenes have a slow-device mode that has only been triggered by a test.

**Waiting on Will (canon these updates assumed)**
- Buddies live on the light that sprouts carry, here as in Sproutwild, and nobody in Sprouts knows that yet.
- The North Coast lore, all of it proposed: the skip is a call, two lights ("one to keep, one to call"), the North Light and SUN CALL, the Lanternwisp as its last flame, Bessie in the lake, Thornback's "third thing under the mountain". See the Nov 18 section of [`alt/STORY-NOTES.md`](alt/STORY-NOTES.md).
- Whether the North Light is what called Will, Erin and Marcus to Sunkeep (the game leaves it unsaid).
- The prequel pass's canon: the old stones call the Lantern Field "Sun Keep", somebody kept this light before, and Thornback was set to guard a light and has forgotten who asked.
- The Lanternwisp's line for this valley ("some say she is waiting for someone").
- The field guide's lines for people (Marcus as the plumbing boss, Louie the evolved shiba).

**Wanted (Will, Nov 18: "keep working on the game")**
- More refining of gameplay, characters, lore, world building, the Pikmin-like play and the menus.
- The lake monster renamed BESSIE in Sproutwild's code (story notes: still to do). Sprouts now has her as BESSIE.
- More on the North Coast: it now has the pier, the lens and the Marcus Lakefront project. Still no person living there and no buddy of its own.

---

## 2. North Coast Knockout

Sources: [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (Knockout and the Fable passes), [`v0.35/CHANGELOG.md`](v0.35/CHANGELOG.md).

**State:** paused between Fable passes.

**Not done (the rest of the graphics overhaul)**
- Repainting the nine stage drawings. They are the same sparse compositions, now colour graded.
- Heads that turn to face the opponent.
- The menus and the character select screen.
- Hit sparks and projectiles.

**Not tested**
- The stage treatment costs about 3.1 to 3.5 ms a frame on a desktop (was 2.1). It has not been timed on a phone.
- Nothing from the Fable passes is phone-confirmed.

**Waiting on Will**
- More photos of Will, Erin, Bottie and Louie for the next likeness pass.
- Move names, lines and scenes invented in passes 2 and 3 (everything except TIME TO REMOVE THE J) are flagged for him.
- Flow Pros colours are a placeholder until he sends the real logo or a photo of the truck.
- FENTANYAHU is not in any game yet, because his look is not settled.

---

## 3. Rootdeep

Source: [`v0.2/CHANGELOG.md`](v0.2/CHANGELOG.md). Finished and handed off; do not resume without Will asking.

**Known issues**
- The Mothshade caused every death in the bot playtest. Its blink-behind may feel unfair.
- Rooms are short (4 to 10 seconds). Difficulty is untouched on purpose until Will has played more.
- The "three little auto balls" Will dislikes are still unidentified.
- Not confirmed on an iPhone: text placement, touch feel, frame rate.

**Wanted**
- A William Cohen track. The music is a placeholder synth loop.

---

## 4. Patch & Plate

Source: [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (v0.4 to v0.7), [`v0.3/CHANGELOG.md`](v0.3/CHANGELOG.md).

**Not tested**
- Days 5 to 13 in real time.
- BOTTIE IS IN LINE!, EIGHT IN A ROW! and THE VALLEY IS FED! firing in real time. The test put the big moments on screen and the bot's days ran through them, but nobody has watched them play.
- One check ("Louie changes his mind mid-craving") fails now and then because it depends on chance.
- Not played on a phone.

**Waiting on Will**
- Every line added in v0.4 to v0.6, the kitchen buddy perks, and Bottie being allowed to queue for lunch.
- Buddy numbers (6, 15 and 27 stars, 15%, +8) are guesses.
- Whether PERFECT DAY is now rare enough (v0.7 made it rarer).

**Wanted**
- Its William Cohen song playing outside claude.ai (see the console's music item).

---

## 5. Sproutwild

Sources: [`alt/src/sproutwild/CHANGELOG.md`](alt/src/sproutwild/CHANGELOG.md), [`HANDOFF.md`](alt/src/sproutwild/HANDOFF.md), [`DESIGN-v7.md`](alt/src/sproutwild/DESIGN-v7.md), [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md).

**Known bugs and gaps**
- The buddy set to tend a plot does not walk over and stand at it. The bonus applies wherever it is.
- A crop plot cannot be removed or moved once placed.
- Old saves lose any crop that was set on a soil plot. A building an old save put where a street now runs stays there.
- A buddy sent to a job past a pond or a wall hops straight to it instead of walking round.
- The three town houses are rooms to look at only.
- The travel scene has its own landmark for five areas. The rest show plain trees.
- One real-time bug catch missed in v7.9 (a wild buddy next to a bug takes the aim). Not seen since.
- "BERRIES planted" stayed on screen 16 seconds in one run. Not looked into.

**Not tested**
- Nobody has played v10 to v12 by hand on a phone.
- The first Guardian fight was tested with real turns for three starter teams, once each.
- Sigils 2 to 4, the King lowering the dome, Bottie's tower as the final battle, and the post-game are unplayed.
- The timed strike with a real thumb (the GREAT window is about 0.2 s).
- Watching a starter evolve at Lv16 in a battle. Petting Louie at Sunkeep in real time. The Lantern ring gifts at 10, 20 and 30 LIGHT SHOWN.
- Balance that needs a long session: crop timers, building times, catch odds after the first catch, starter strength. About 40% of the first three minutes is scenes.

**Waiting on Will**
- CUYAPUP, the fire starter, loses to the stone Guardian at the level the game asks for. The game warns the player now. Should the numbers change?
- Expedition numbers, recipe levels and the Buddy Barn's price (8 stone, 6 wood) are first guesses.
- Names: CUYAPUP, BESSLING, GRASSKIN, MELONKIN, PYTHORN are first passes.
- Whether 20 calmed buddies before the dome feels right.
- More crops to compete for plots (ore blooms, tonic herbs, lantern oil)? Plots beyond the current number?
- Where the next area goes.

**Wanted**
- More creatures from local lore: the Haserot Angel, Franklin Castle, Helltown, Gore Orphanage, the Guardians of Traffic.
- Sorting or searching the Data Center's buddy box.
- Will's taste, to keep doing: playtest like a first-time player from the title on a phone-shaped screen; one voice at a time, never a wall of text; characters walk you to things and let you do them; explain slowly, captions advance on A.

---

## 6. Lightswarm

Source: [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (v0.1 to v0.3). A vertical slice for Will to evaluate.

**Known issues**
- With many items and finds, the icon row under the light bar runs off the right edge. Finds past the edge are not drawn.
- Keepers other than Will have one facing on the field.
- The keeper screen's text is sized for a phone-height screen. On a short window the last lines are cut.
- Starting with DEW is the weakest start: the ring only lights what comes close.
- The Lantern menu does not count this cartridge.

**Not tested**
- Never played by hand or on a phone. Whether the D-pad feels good for eight-way walking is the first thing to check.
- Balance comes from a simple bot, and its results swing a lot between batches (about one win in three in the last one).
- Corbin's and Bottie's first supers may be too strong. Scout's may be too quiet. THE FINAL BET can cost Marcus light by design.
- The sprout pile-up fix assumed the pile was the swarm stacking behind the keeper. Will has not confirmed that was it.

**Waiting on Will**
- Derek's look (beanie, Flow Pros blue) is new. He has no face in any other cartridge.
- Bibi's first super is THE COALITION, his second Knockout super, not his first.
- The SOUL LAMP here gives your light back once. Its real name and use are open in the story notes.
- CUYAPUP, BESSLING and GRASSKIN as things you find mid-run. The DATA CENTER KEY is a new item.
- The radio lines from Sunkeep are new wording of existing story, not quotes.
- Scout and Ranger are placeholder characters with light kits and no story. Elder and Pip are not playable.
- New game words: CHARGE, WHISTLE, SEEDS, the weapon names, the finds.

**Wanted (Will's asks so far, all in; and what a full game would still need)**
- In: every favourite character playable, Louie as an item, a deeper unlock track, powers from lore, quips, supers with cutscenes, more lore, pop-ups and animations, rewards and levels, more and unlockable power-ups.
- Not built: more expeditions than Crooked Hollow, a second Guardian, obstacles on the field, sounds and music of its own, the testing unlock removed before release.

---

## 7. Clankawatch

Sources: [`alt/src/clankawatch/CHANGELOG.md`](alt/src/clankawatch/CHANGELOG.md), [`HANDOFF.md`](alt/src/clankawatch/HANDOFF.md), [`LORE.md`](alt/src/clankawatch/LORE.md). The live work is on branch `claude/tender-darwin-0r4toe`, folder `muse/games/thornwatch/`. The folder, file and save key still say Thornwatch.

**Not tested**
- v4.0 alpha 1 to 3 are headless checks only. Not phone-verified.
- Will's phone verdict on v3.7 is still pending (and on v3.5 and v3.6 as separate builds).
- v3.7's regression runs for the other cartridges in its own console (Rootdeep 6 of 6, Sproutwild 23 of 23) were never re-run.
- Alpha 2's balance changes (each sprout planted makes the next 10% dearer; 1X runs 40% quicker) were not simulated at the new price.
- Its own test suites were not run against the seven-cartridge console. There it was checked to its title, files, menu, story and thirty seconds of a night.

**Waiting on Will**
- Every story line in `tw-story.js`. Bottie's reason for the drones ("training data") is new.
- The new garden art was drawn new on purpose, against the old "ported, not drawn" rule, because the brief asked for a full rework.
- Thornback at 780 HP (cut from 900 in v3.0, never re-confirmed). SUNLEAF's old Heart-mend, removed in v3.5.
- Whether to enlarge the Crossroads gate-glow tell (13 x 18 px). Whether a mid-path event is wanted for the watch-only stretches of up to 15 seconds on late nights.
- LOUIE'S HOWL is deliberately the weakest power, a panic button.

**Wanted next, in the brief's order**
- Two upgrade paths with three tiers for each sprout (a balance sim has to be written first).
- Calling the next night early for a bonus.
- The menu and HUD pass. Replay goals and Easter eggs.

---

## The story: open questions for Will

Source: [`alt/STORY-NOTES.md`](alt/STORY-NOTES.md).

- Why Sunkeep exists, and who or what called Will, Erin and Marcus there.
- The lamp's real name ("SOUL LAMP" is a placeholder) and what the souls do later. "Release" is a placeholder word too.
- Is the keeper locked to Will? Sproutwild still lets a player pick Erin or Marcus.
- Kiss (Corbin in Knockout), Scout, Ranger and Elder are placeholder characters. No big stories on them yet.
- FENTANYAHU's look.

---

## Other games (not Pocket Lantern cartridges)

These live on their own branches and are not in the console. Their notes are on those branches; this is the short version.

| Game | Branch and folder | Latest | Open, from its own notes |
|---|---|---|---|
| lil Bottie | `claude/modest-ride-rgjg4r`, `bottie/` | v0.4.1 | Not played by a person or on a phone. Eight tracks not built. Real songs set aside behind a switch; chiptune everywhere. The crib is plain. Songs only load from a web server, not from a file opened off disk. |
| Starhaven | `claude/cool-davinci-c0m3nl`, `starhaven/` | Rebuild 8 | Chapter 3 not played by a person: its difficulty, and Flame on a real controller. Music not heard on a phone speaker. A real controller inside the Claude app on a phone is untested. Next in the design: Wren's first court gift, a new enemy, a monster hunt, Caelum's next heart; then chapter 4, The Spy in the Library. |
| Sootborn | `sootborn`, `sootborn/` | v0.10 | Playtest fixes, the heist patrol redesign and animation went in. It has no known-issues list of its own yet. |
| Underground Syndicate | `claude/wonderful-euler-4hchee`, `syndicate/` | Xbox controller support | No known-issues list of its own yet. |
