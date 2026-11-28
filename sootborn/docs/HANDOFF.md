# SOOTBORN — HANDOFF (comprehensive)
Written 2026-11-19 on top of build v0.65 · everything needed to carry on, in working order · approved by the owner

**Read in this order:** A (set-up and rules) → I (decisions and what is still open) → E (bugs, fix first) → F (the work, step by step) → then the reference parts as each step needs them: B (time rules and transitions), C (every card in play order, with what is happening and what to say), D (the story check), G (matching the writing), H (people), J (things built but never seen by a person), K (index of jumps in time).

This is the same plan as `claude/sootborn-master-timeline.md` / `docs/MASTER_TIMELINE.md`, put in working order with the open list folded in. If they ever differ, the newer file wins; then update the other.

## Part A. Before you touch anything

### A1. What SOOTBORN is
An original story game, inspired by Red Rising but legally distinct. **No Red Rising names, emblems, weapons or characters may appear.** A valve tech in an underground city (Cinderwell) loses his wife Seren to the heart-furnace, is remade into one of the ruling class (the Gilding), fights through their trial (the Assay), and climbs their tower (the Sun Spire) to end the count of who gets to breathe. Tagline: *Every breath is hers.* Studio line: North Coast Studios × E Concepts.

**PC is the main platform** (owner, 2026-11-19): keyboard and a controller on a computer come first. The owner also plays on an **iPhone in the Claude app**, often with a **controller**. Nobody uses touch controls except the on-screen pad. Replies to the owner: short, mobile-sized, lead with the outcome, and say plainly what was not checked.

### A2. The owner's standing rules
1. **Everything the owner asks for goes on the open list** and stays there until done or the owner says drop it. Never let a request get lost.
2. **"Keep going"** means: work down the list.
3. **Dimensions:** never move an existing area to another dimension (2D, 2.5D, 3D) unless the owner names the area and the dimension. New 2.5D places carry story or flavour; this plan's new 2.5D parts are approved.
4. **The fire scene on night 28 stays 2.5D.**
5. **No tap prompt** in the levels. Touch exists only as the on-screen pad.
6. **Release pattern every round:** build → test by script → fix → bump version → changelog, story bible and open list entries → commit and push → publish the artifact → update the project docs → report back briefly with what was not checked.

### A3. Where things are
- **Repo:** `https://github.com/northcoaststudioswill-hub/game`, branch **`sootborn`**. The pre-reorder game is kept on branch `sootborn-v0.64-before-reorder`.
- **Layout:** `src/*.js` (the game), `src/shell.html`, `issue/` (the comic-book levels), `build.mjs`, `index.html` (built), `tests/`, `docs/`.
- **Build:** `node build.mjs` → `index.html` (one self-contained file, about 2.2 MB). It runs `issue/patch.mjs` itself, which turns `issue/base.html` + `rig.js` + `world.js` + `story.js` into `issue/issue.html`. Never edit `issue/base.html`; add patches in `issue/patch.mjs` (each `rep(a, b)` must match exactly once; new blocks go before the marker `\nif (/Calloway|Tally|Deacon`).
- **Version:** `GAME_VER` in `src/ui.js` (0.90; next is 0.91). Update `DEV_NEW` and `DEV_VER` beside it in the same edit.
- **Dev Suite:** https://claude.ai/artifact/PAT2JUeadCh5gqYhtrp383 (source `devsuite/`, see devsuite/README.md). Every `node build.mjs` refreshes `devsuite/game.html`; republish `devsuite/index.html` with `files: {"game.html": "devsuite/game.html"}` after each game release (capabilities db + user are kept). The owner's edits are in its db: `overrides` (bake into source, then delete) and `notes` (read and act on); set `meta/suite.bakedVersion` after baking.
- **Publish:** from v0.90 the game is the artifact https://claude.ai/artifact/5FLLk6Xzn97gkhYE9KtxgV (the old slug `2a8a025c-511d-454c-861c-d9bc7a4565f5` could not be updated from this account). Earlier note:; publish `index.html` with `publish_files` and the live version as `base_version` (get it with `get_artifact`). The illustrated progress report is `be5babce-6d5d-4c6e-9668-9b2185959f6c`.
- **Project docs** (claude.ai project "Rr Game Idea"): `claude/sootborn-changelog.md` (v0.71 on; v0.66 to v0.70 in `-changelog-archive-3.md`, v0.56 to v0.65 in `-changelog-archive-2.md`, v0.1 to v0.55 in `-changelog-archive.md`, so the live one stays cheap to read), `-story-bible.md`, `-open-list.md`, `-script-and-plan.md`, `-progress-report-v0.65.md`, `-cards-and-transitions.md`, and this one, `claude/sootborn-master-timeline.md`. Read a doc with `project_read` before writing it.
- **Commits** end with the attribution lines your session gives you. Push with `git -c push.negotiate=true push origin sootborn` (it prints "repository moved" and still succeeds). If the push is rejected, fetch and rebase first: other sessions also push here.

### A4. How the code is put together (what you need for this plan)
- Scripts are concatenated in this order: core, art, content, story, systems, cinema, panels, brawl, g3, ff, day2, day3, part2, rowk, assay, issue, prelude, checkpoints, ui, main. Top-level `const`s (Mission, DEV, Cutscene, Brawl, Issue, HUD, G3, FF…) are globals; `window.BTS` exposes G, UI, Game, Brawl, Dialogue, Puzzle, FF, World, P, Cutscene. A global called `STEP` exists; don't define `window.STEP`.
- **Cutscenes** are step lists: `{ card, sub }`, `{ narr }`, `{ say }`, `{ panel }`, `{ fade }`, `{ brawl: () => FF.x() }`, `{ mission: 'id' }`, `{ fx }`. `Cutscene.play(steps, done)`.
- **The calendar strip** (`assayCal` in `src/cinema.js`) lights the Assay day by reading the card's **sub** text with regexes such as `/day thirty-one/i`. Assay days must stay in subs.
- **Time helpers** `WHEN`, `whenS(d)`, `whenN(d)` at the top of `src/systems.js`.
- **Fights:** `src/brawl.js` is both the 2D fights and the 3D arena fights (the arena is drawn by `src/g3.js`, plain WebGL). A fight is a def from `FF` in `src/ff.js` (and `assay.js`, `rowk.js`), started with `Brawl.start(def, cb)` or `Mission.fight(def, after)`. `def.era` gates moves; `hookEra()` gives the hook only if `def.hook` or era ≥ 5.
- **2.5D places** are Brawl's walk mode: a def with `walk: { id, spawn, npcs, spots, props, floor, obj, keep|clear }` (see `walkCircle`, `walkSquare`, `walkRowMorning`, `walkWard` in `src/assay.js`).
- **2D levels** (top-down missions): `Mission.start(id, done)`; defs in `src/assay.js` and elsewhere.
- **Comic-book levels** (third person, three.js, `SC` namespace) are chosen by the key replaced into `issue: 'docks'`; existing keys: `gild` (the Table), `riser`, `docks`, `stair`, `stack` (the vent stack, v0.70), `array` (the Deep Array, v0.71). Started from the game with `Issue.start(key, ok => …)`. Hosted in an iframe; input arrives by postMessage.
- **The opening:** the animated intro is `src/prelude.js` (v0.68); the old film is still in `src/ff.js` (`OPENING`) for the Dev menu only; the cold open is `FF.keepCold`. The Keep is `FF.keep` (src/ff.js, around line 60).

### A5. Tests (in `tests/`)
Playwright (run `npm i playwright` inside `tests/` once; it drives the Chrome already on the machine, no browser download) with Chrome and the software renderer (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`). Paths inside older tests may point at another machine's folders: point them at the repo's `index.html` and `issue/`.
- New in v0.68: `prel.mjs` (stills of the animated intro; VW, VH, TIMES, TAG), `prel2.mjs` (the intro from New Game in real time; SKIP=1), `keepend.mjs` (the Keep's ending, stepped), `ilse.mjs` (the Table callback). Boot note: the opening film is gone, so a test should press Enter until `G.mode === 'title'` and not wait a fixed time.
- New in v0.67: `cold.mjs` (New Game by real key presses through the cold open), `trans.mjs` (each transition in two pictures).
- New in v0.66: `circ.mjs` (the Lamp's fire end to end, PICK=0|1|2, LOSE=1), `air.mjs` (how long a man can be kept in the air; BOOTS=1), `death.mjs` (stills of a death; M=fight, BIG=1), `hook.mjs` (the hook used on purpose in four arena fights). `Brawl.stageOf()` + `stage` on a fight def keep a fight in a walk scene; `afterWin` keeps the talk there too.
- `godrun.mjs`: **the whole-story bot.** Plays New Game to THE END without being able to lose and logs every card, fight and level (`SECS=570`). **Run it every release.** Its log is how you check the order of cards against Part B.
- `walk.mjs` (M=circle|square|rowmorn|ward): the 2.5D places. `iss.mjs` + `lv.js` (via `tests/runlv.sh riser|stair`; `lv.cjs` writes `issue/lv-<key>.html`, don't commit those): comic levels standalone. `ff.mjs`: fights (M=name, BOT=mash). `mis.mjs`: 2D levels. `cap65.mjs`, `cap65b.mjs`: screenshots.

---

## Part I. Decisions
**Approved by the owner, 2026-11-19 ("I approve all your suggestions"; "I trust you" for the cards):**
- Day one = Ashgate; the whole of Part C as written, including Part Two's additions and the Pairing moved into the first dream.
- Lucan lives (his blade breaks at the Keep); the boots come from Voss and are charged at the vent stack, and he flies from day 31; Tavi is seven at the furnace (fix the story bible); the Deep Array with no Assay moves; one card each for the High Docks and the Dock Stair; PART TWO before the Pinning.
- Celestine knew him at the Pinning: yes.
- "The expression" in the intro = the faces in the ring.
- The budget split stands (30% animation, 25% matching the writing, 20% High Docks, 15% Part Two play, 10% controls), after this plan.
- Keep the names Kestrel Dray and Severin Cade, and "the Assay", until the owner picks a new name.
- **The service stair is 2.5D** (owner, 2026-11-19).
- **Celestine's secret** (14b) and **why she still sent Seren into the furnace**: decided by Claude at the owner's request ("just make it make sense").
- **The ending choice stays:** strike her line, or send her down to Row K. Either way she is finished; only whether she lives is the player's.

**Still open:**
- **A new name for the Assay.** The owner is weighing **Universalis** (a spin on university). Other candidates: the Proving, the Weighing, the Crucible, the Tithe, the Long Count, the Season of Knives. Cautions given: it leans toward Red Rising's school-as-war idea, it is long to say, and the word is used by other products. One way to keep it: the Universalis is the institution, the Assay its final trial.
- **Offered, not answered:** in the Row K ending, Celestine knows the Array's numbers better than anyone alive and ends up on a valve wheel, so fewer die the first winter.
- **The animation library zip** (Quaternius, CC0) and **the owner's notes from playing to the Stair.** The zip is optional; without it, keep hand-making animation.
## Part E. Fix these first (bugs from the owner's play)
1. **The fire pit (6c).** The Circle's 2.5D scene ends, then the fight happens elsewhere. Keep the naming and the fight inside the 2.5D scene until the fight ends (walk mode with foes added when the choice is made). Test: `walk.mjs` M=circle, through the choice, to the end of the fight, without leaving the scene.
2. **Too floaty.** A man can be kept in the air without the boots. Add weight: stronger gravity on the way down, no re-launch of an airborne man unless the player has the boots on, a hard landing with a bounce and a pause on the ground. Look at launchers and `f.air` in `src/brawl.js` (the knockdown rules from v0.58 are the place). Test: `ff.mjs` with BOT=mash on the Drill, the Ford and the Keep; log time in the air per foe before and after.
3. **Deaths spin.** Heavy hits use the reaction `'spin'` (`src/brawl.js`, around lines 160 and 628), which reads as spinning on death. A death is a fall: knees, then forward or back, then still. Check the comic levels' death too (`die(` in `issue/`). Test: stills of a death in 2D, the arena and a comic level.
4. **The hook shot in the 3D arena fights** where it fits. `hookEra()` gives it only when `def.hook` or era ≥ 5. Turn it on for every arena fight from the Assay on, and make sure it reads: a line out, a pull, the man arriving. Test: the Ford, the Assayer, the Valley and the Keep, with the hook used on purpose.

---

## Part F. The work, in order
Release after every step (Part A2, rule 6). Each step lists what is in it, why it comes here, and how to check it. Run the whole-story bot every release and check its card log against Part C. Keep the open list in step: tick items off, never drop one the owner hasn't dropped.

**Why this order:** fix how the game feels first (every later scene is played with it); then lay the cards and transitions, which are cheap and are the frame every new scene hangs on; then the opening and Part One, front to back, cheap pieces before expensive ones; then Part Two, spine before content; then the ending. Matching the writing goes in with the scene it belongs to, not as a separate pass. Expensive art (the animation library, the High Docks rebuild) comes after the story is whole.

**Step 1 · v0.66 · the four bugs (Part E)** — **DONE 2026-11-19** (see the changelog; needs the owner's hand). The wrong-name fight at the Lamp is still on the ridge, as its lines say.
- The fire pit stays 2.5D through its fight (6c). Weight in the fights (no juggling without boots). Deaths fall instead of spinning (2D, arena, comic levels). The hook shot in every arena fight from the Assay on.
- Check: `walk.mjs` M=circle through the choice and the fight; `ff.mjs` BOT=mash on the Drill, Ford and Keep with time-in-air logged before and after; stills of a death in each engine; the hook used on purpose in the Ford, the Assayer, the Valley and the Keep.

**Step 2 · v0.67 · the rearranging, its cards, and the transitions** — **DONE 2026-11-19** (the owner asked for the rearranging first)
- Done: the Keep as the cold open (`FF.keepCold`: cannot be lost, cuts as ELEVEN comes down); the Pairing into the first dream; the Lamp to First Fire's night; the Valley (`FF.valley40`) to the last dream; PART TWO before the Pinning; every card in Part C that belongs to an existing scene; five transitions as ways a card arrives (`tr:` on a card step, or automatic for Assay cards): wake, furnace, strip/step, chalk, page.
- Left for the scenes that need them: the ELEVEN transition (with the animated intro), the grey furnace (Celestine's flash), the strip running on into years (Part Two's flash-forwards).
- The story bible already had Tavi right (six a year before the furnace is seven at it). Celestine's secret is in the bible's cast entry.

**Step 3 · v0.68 · the new things in the opening** — **DONE 2026-11-20**
- Done: the animated intro (`src/prelude.js`, `Prelude.run`; eleven drawn pictures counted to ELEVEN; called from `Game.newGame`; the old film is no longer shown at boot and survives only in the Dev menu). The Keep's ending (`FF.keepEnd`, `breaks: 1` on the fight: Lucan stops at a fifth of his health, and an ELEVEN begun at half or less breaks his blade and puts him on his knees; two new film pictures). The white cloak (`hero.cape` on a fight, `cape` on a film actor, the `kael3` walking sheet; `CLOAK` in `src/ff.js`): the Assayer's last two pictures, the Valley, the Last Night, the Keep and its cold open, the Pinning. The Ilse callback (two blank PAGE cards round the `gild` panel in `DAY4`).
- Tests added: `prel.mjs` (stills of the intro; VW, VH, TIMES, TAG), `prel2.mjs` (the intro from New Game in real time; SKIP=1), `keepend.mjs` (the Keep's ending, stepped), `ilse.mjs` (the callback).
- Not done here and still wanted: the intro has only been seen as stills. If the owner finds Kael and Lucan hard to tell apart in white, give Kael's cloak a violet lining.

**Step 4 · v0.69 · Part One's two new 2.5D places, with the seat knives** — **DONE 2026-11-20**
- Done: the camp by day (`walkCampDay` in `src/assay.js`, `FF.campday`; card MORNING in `DREAM1` after the Pairing; the choice sets `G.flags.campSat` = oswin|petra|corin and the Circle on night 28 reads it). Bay Three at last bell (`walkLastBell`, `FF.lastbell`; card LAST BELL in `festA` after the Ford). The seat board on the Bay Three map (`PROPS.knives`, hotspot `knifeboard`). Knives on Kael's, Seren's, Mara's and Ivo's belts (`knife: 1` on a look; drawn in `makeChar`). A walk can speak on arrival (`walk.open`). Walk props `rank` and `kboard`. Test: `walk2.mjs` (M=campday|lastbell, PICK=0|1|2).
- **Departures from Part C, waiting on the owner:** Dorian is not in the camp (the written story has him carried out by the other door and on the wall of names; his bread and a boxed name stand in for him). Oswin's leg is not hurt until night 49, as written. The Sisters Vey are Teal and only visit the board. Kael's hook is 307.
- Not done: the knife count at the end of the other days below.

**Step 5 · v0.70 · the vent stack (comic-book level, 8c)** — **DONE 2026-11-20**
- Done: level key `stack` (`STACK` in `issue/world.js`; the `SC.issue === 'stack'` block in `issue/story.js`; three reps at the end of `issue/patch.mjs`; `LEVELS`/`TT` in `src/issue.js`). No boss: encounters `alley`, `l1`, `l2`; the collar (`F.charged`); the edge calls `ending()`, which is three pictures and `done()`. `S.noBoots()` switches the leap and hover off (any level can use it). In the story: `DREAM3` in `src/day3.js`, after the boots narration. `FF.valley40` has `boots: 1`.
- Also in v0.70, from the owner: the Dev menu shows the version that last changed each scene (`DEV_VER`, `GAME_VER`, `DEV_NEW` in `src/ui.js`; **bring all three up to date every release**), and scenes started from it come back to it (`DEV.from`, `Game.abort()`, `Game.devBack()`, `#devback`, F2).
- Tests: `stack.mjs` (the level by teleport), `devm.mjs` (the Dev menu).

**Step 6 · v0.71 · the Deep Array (comic-book level, 7b)** — **DONE 2026-11-20**
- Done: level key `array` (`ARRAY` in `issue/world.js`; the `SC.issue === 'array'` block in `issue/story.js`; six reps at the end of `issue/patch.mjs`; the hero re-skin, Harl in the clerk slot and a wrench in `issue/rig.js`). `S.plain()` switches off the hook and ELEVEN; `S.noBoots()` the boots. No first fight (a level without `ENC.alley` skips it). Flags: `across`, `down`, `heart`, `e_w1` (only if seen by the lamp), `e_l1`, then a 60-second run (`S.runT`) to the hatch and `ending()`. In the story: `DAY3` in `src/day3.js`, before Harl's "Go home".
- Kept out on purpose: Seren finding the bleed first (15c).
- Test: `array.mjs`.

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
- Done, all in `src/assay.js`: `walkCampNight()` (12b; followers are allies with `crew`, moved in `walk.tick` along a trail of the player's steps), `walkServiceStair()` (12c; `bg2: 'sstair'`, `swall` bays), `MISSIONS.ember` (14b; the `raid` map with `grey: 1`, `where`, Assayers on the pickets' rounds, the wheel at the `valve` hot), `walkBarge()` (15b; `bg2: 'barge'`), `walkSerenLine()` (15c; hero `seren`, steps gated by a counter, `exit: () => step >= 3`). Cards and calls in `P2[1]`, `P2[3]`, `P2[4]` in `src/part2.js`. Gloves: `gloves` on `celestine`, `celf`, `cel20` looks (`src/art.js` hand pixels; `L.gloves` in `src/g3.js`).
- Not done: gloves in the hand-painted story panels; the barge as a place revisited (it is walked once).
- Tests: `campn.mjs`, `walk3.mjs` (M=sstair|barge), `seren.mjs`, `ember.mjs`, `gloves.mjs`.

**Step 9 · v0.74 · the Count, the last flash, the ending** — **DONE 2026-11-20**
- The Count as a puzzle (16a); the full Stair replays the cold open's minute from inside (16b); Celestine's "one for forty" line before Little Ember; the ending choice (become her / send her home) and Mara's "little ember" beat (16c); the last flash (16d); the ending as drawn pictures (16e).
- Check: both endings reached by the bot (set `G.flags.ending`), both credits texts shown.
- Done, in `src/prelude.js`: `Prelude.ledger(done)` (the puzzle; state in `Prelude.gm`; flags `countDone`, `countNoted`), `Prelude.pages(list, done, music)` (captioned pictures turned with A or a press), plates `furnace`, `lift`, `square`, `sun`, `names`, `tbarge`, `shelf` (the last two take the ending as `arg`), and `count` / `white` / `hold` on a plate. Steps `{ ledger: 1 }` and `{ pages: () => list }` in `src/cinema.js`. In `P2[5]` (`src/part2.js`): the book after the chapter card; the last flash after `FF.ember()`; the ending's old steps wrapped in `endPages([...])` with `{ pic }` markers (every old line kept). The Stair's echo is a toast in the `stair` block of `issue/story.js`.
- Open with the owner: whether Tavi is a brother or a sister (the plan and the written lines disagree); where the puzzle happens.
- Tests: `ledger.mjs`, `ending.mjs` (E=below|struck), `plates2.mjs`. The whole-story bot skips the puzzle (`Prelude.finish()`), as it skips fights.

**Step 10 · matching the writing (what is left after steps 3 to 9)** — **MOSTLY DONE in v0.75, 2026-11-20**
- Done: cast `kaelc` (the clerk's coat; hero of `walkRing`, `walkServiceStair`, mission `count`); the docks hero re-skin and `SC.limp` in `issue/rig.js` (one rep in `issue/patch.mjs`); `palm` and `still` on walk people; `pose: 'washer'` in `src/g3.js` during the ELEVEN wind-up; `hum: 1` on a fight sways its crowd; Hollis and Brand after `{ issue: 'riser' }`; plate `docklog`.
- Left: Lucan's stick and Brand's halberd drawn; the washer gesture in the 2D fights and the comic levels; Ivo's errand below; a valve job with Kestrel.
- A clerk's coat for Kael on the Spire and at the High Docks; plate only where he fights openly; gloves on the clerk. Oswin's stiff leg as the Auditor's Blade. Lucan's stick in his last scene (if not befriended).
- The rest of the eight deliberate animations: hand flat on the pipe (Seren, Kael, Kestrel); the kneel at the bell; Kael's hand to the washer before ELEVEN in every engine; a humming sway at a commitment; Brand and then Hollis grounding the halberd; Tavi on Seren's left, then on Kael's left.
- Unexplored scenes worth one each: Hollis and Brand, one line each; a valve job done with Kestrel; Ivo's errand below; Kestrel and the week he blamed her (a memory picture).

**Step 11 · characters and animation** — **STARTED in v0.76, 2026-11-20**
- Done: `daisSprite('cel' | 'wl' | 'wr')` in `src/g3.js`, placed as tagged flat figures (`tag: 'dais'`) beside the Assayers' list; the Spire Guard helm parts in the `L.helm` branch. v0.77: `SC.bossIdle` in `issue/rig.js` (one rep in `issue/patch.mjs`; unseen, could not be held still by script); the Gallery's onlookers are `daisSprite('o' + i)` when `real === 'hall'`. Left: Kael's stance, capes in motion, and the library (the owner has the link).
- Real animation once the owner attaches the free Quaternius "Universal Animation Library [Standard]" zip (CC0): run, jog, deaths, sword combos on Kael and the guards. If it never comes, keep hand-making moves.
- Guards: faces and helms; the same rigs in cutscenes. Rook and the other bosses: faces, weapons, their own idle. Kael's own ready stance in held shots. Capes: the owner's rule, it kicks up with momentum then falls, never floats; check in motion. Celestine and her Wardens on the Keep's dais as flat detailed figures, like the Assayers; the crowd in other 3D rooms.

**Step 12 · places**
- The High Docks rebuilt from reference: a real dock, dressed as where the Accredited live, side corridors that go nowhere, height for the boots, hidden things for the Codex.
- Riser Nine: more character. The Stair: crew on the near hulls; the three near wrecks and the smoke move. 2D valley maps: readable terrain (rises, banks, cover). The Scuffle's floor (still the square's flagstones). The whole of Ashgate Square walkable in the present, not only as a memory. Every new comic level gets a long first stretch.

**Step 13 · fighting and controls** — **STARTED in v0.79**
- Done: one button layout (the host's press names in `Issue.tick` in `src/issue.js`; the hosted key map and pad legend by reps in `issue/patch.mjs`); `Menus.controls()` in `src/ui.js`. Left: thinning group fights, re-fighting for difficulty, a look zone for touch.
- One controls card across 2D, arena and comic levels. Group fights read as busy: thin them. Difficulty: re-fight the Ember Ring, the Drill and the group fights with the two bots, as was done for the Scuffle in v0.58. A second stick or a look zone for the on-screen pad (the camera still turns by dragging).

**Step 14 · films and hand-offs**
- A drawn scene for losing below, not only a line. More short 2D memory scenes. More 2D films from stills in the comic style; the Pairing's and the Ford's own intro shots. The comic levels' opening and memory pages to the Table's standard. A last pass over every hand-off (card, fade, music) from the opening to THE END.

**Step 15 · housekeeping**
- Measure the frame rate on the owner's phone (Settings → Show frame time). A trademark check on SOOTBORN, and on Universalis if the owner picks it.

---

## Part B. The rules of time

### B1. One clock, and the present
- **The furnace is zero.** Every date counts from it: "Four years after the furnace", "Eleven months before the furnace".
- **The present starts on day one, Ashgate** (41 days after the furnace). From there, the present only moves forward: Ashgate → First Fire → The Ledger → The Way Out → (Part Two) the Sun Spire, four to nine years after.
- **Everything else is a flash**, back or forward. Each flash needs (1) **a trigger** in the present: an object, a sound, a line; and (2) **a signpost**: its transition and its card.
- **Reordering is the point.** The order is chosen for pacing and a short game with play in it. Flashes are placed by echo (what the present calls up), not by date.
- **In Part One the Assay is only ever a flash** (Kael dreams forward). In Part Two the present is on the Spire and is all 3D; it gets **2D and 2.5D flashbacks**.

### B2. Cards
- **Chapter card:** NAME big, then its date. *THE LEDGER / Forty-three days after the furnace.*
- **Time card:** the date big, then the place and one short line. *FOUR YEARS AFTER THE FURNACE / The Assay. Day three.*
- **Assay cards always say the day in the second line.** The calendar strip reads it.
- **Never on a card:** later, earlier, from now, ago. **Allowed:** THAT NIGHT, MORNING, MEANWHILE, NIGHT THIRTY (where you are, not how far you moved). People may speak from their own present.
- **Prose cards** only at the furnace count and the end.

### B3. Transitions (build once, use everywhere)
| Name | Use | Look and sound |
|---|---|---|
| **CUT** | Same time | Hard cut to black, under half a second (exists) |
| **WAKE** | Back to the present below | White fades out, a valve hiss, Kael's breath, then the day's card |
| **FURNACE** | Back to before the furnace | Orange bloom from the bottom of the frame, the heart sound; warm grade inside the scene. Cooled to grey for Celestine's flash |
| **STRIP** | To the Assay | The calendar strip slides in and runs to the day; a gold wash; the Assay card |
| **CHALK** | Same time, elsewhere | A chalk sun drawn over the frame, wiping to the new place |
| **PAGE** | Into or out of a comic-book level | A page turns; panel borders close in, then open out |
| **ELEVEN** | Three times only: opening, furnace, last flash | The count one to eleven, cuts getting faster |

---

## Part C. The master timeline
Every beat in play order. For each:
- **Card**: the exact text, TITLE / sub. "none" means no card.
- **In**: the transition into it (Part B3). **Trigger**: what in the present calls it up.
- **Happening**: what is going on and what the player knows at this point. Cutscenes and narration must say what this says and nothing that contradicts it.
- **Say**: the lines. "Existing lines stand" means the scene is written; keep its text. For new scenes, a first line in Kael's voice (first person, plain, short) and the gist of the rest.
- **Plays** and **Build**: EXISTS / CHANGE / NEW, and where.

Kael's names: **Kael Brennick** below; **Edric Sorrel** (a dead boy's name) from the Assay on. Cadets call him Sorrel; Spire people call him Clerk Sorrel; soot who know call him Brennick.

---

### OPENING

**0a. The animated intro**
- Card: none. In: from the title screen (New game).
- Happening: the player knows nothing yet. Three promises: a man underground, a woman, gold. It ends on the number the game is built round.
- Say: no words. One voice humming the shift song; the count, one to eleven, under the pictures.
- Plays: about 25 seconds of drawn stills that move (pans, pushes, cuts), in the Table's comic style. A hand flat on a pipe → a gauntlet closing on a hilt. A chalk sun on a wall → the real sun over a valley. Faces in the Assay's ring: cadets, an Assayer writing. Cuts getting faster on each number.
- Out: ELEVEN. Build: **BUILT v0.68** (`src/prelude.js`; replaced the opening film). Pictures as built: hand on a pipe / gauntlet on a hilt; chalk sun and the woman drawing it / the real sun; her eye through the washer / the eye in the gold sun; three cadets; an Assayer writing tallies; his eyes below / his eyes in gold; the blade.

**0b. The Keep (cold open)**
- Card: **FOUR YEARS AFTER THE FURNACE** / *The Assay. The last day.* In: STRIP. Trigger: the count reaches eleven.
- Happening: a flash forward to the end of Part One. Edric Sorrel, a cadet in gold plate, attacks the keep on the last day of the Assay. Lucan Aurel holds it. Lucan's mother, the High Auditor, watches from the dais. The player is not told who anyone is.
- Say: one line before the fight, Kael: *"The last day. Her son holds the keep."* Nothing after.
- Plays: `FF.keep` as a cold open: one duel at dawn under banners. Teach strike, dodge, fly. The camera follows him up and pushes in on the dive. Cannot be lost. At full fury ELEVEN lights; the blade comes down.
- Out: CUT, **before the blow lands**. Build: **CHANGE** (the cold open is `FF.valley` now).

**1. Cinderwell**
- Card: **BEFORE THE FURNACE** / *Cinderwell. Six tiers under the rock. Before any of it.* In: CUT to dark. Trigger: the humming carries over the cut.
- Happening: from gold under the sky straight to the dark. Cinderwell: six tiers of valve hands keeping the air moving for the people above, who count who gets to breathe.
- Say: the world panel; existing lines stand.
- 1a: **ELEVEN MONTHS BEFORE THE FURNACE** / *The Festival of the First Fire. Ashgate Square.* In: FURNACE. Happening: Kael and Seren are pressure-bound (married) at the Pillar by Mara; Ivo cries; chalk on both their hands. Existing lines stand.
- 1b: **FOUR DAYS BEFORE THE FURNACE** / *The fever comes to Tier Six.* In: CUT. Happening: Tavi, seven, has the fever; the clinic needs air the count won't give; Kael and Seren bleed an extra line off Valve Bank Seven so the ward can breathe. Plays: **the heist** (stealth). Existing lines stand.
- 1c, two prose cards, unchanged: *For three nights, you bled the line and balanced the bank by dawn. / On the third night, the fever broke. Tavi asked for bread.* — *On the fourth morning, the audit came early. / It did not come by gauge. It came down Lift Zero.*
- Build: EXISTS (In transitions new).

**2. Last Bell**
- Card: **LAST BELL** / *Bay Three. The heart-furnace.* In: CUT.
- Happening: the audit finds the bled line. Someone has to answer for it. Seren says it was her, and goes into the heart-furnace. It takes eleven seconds; the count ONE to ELEVEN is her eleven memories.
- Say: existing lines stand (ONE. … ELEVEN.); the tin.
- Out: ELEVEN, then black, then the title: **SOOTBORN** / *What they call us. What they will remember.* Build: EXISTS. **CHANGE: the Pairing no longer comes before the title** (it moves to 4e).

### PART ONE: BELOW (the present)

**3. Ashgate (day one)**
- Card: **ASHGATE** / *Forty-one days after the furnace. Kael still fixes valves.* In: WAKE (he wakes in the bunk Seren painted).
- Happening: **the present begins.** Six weeks after Seren. Kael still works the valves on Tier Six; Tavi is well; Mara watches him; the tier is careful with him. He has seen the Keep and doesn't know what it was.
- Say: existing lines stand.
- Plays: free play: Row K, the square, the ward, Bay Three. Three memories you walk in 2.5D (the square at the Pillar, Row K at morning, the fever ward). Build: EXISTS (card CHANGE to chapter form).

**4. That night: the remaking, training, the first days of the Assay**
- Card: **THAT NIGHT** / *He does not dream of the furnace. For once it runs forward.* In: CUT. Trigger: he lies down in the bunk.
- Happening: the dreams run forward in order, a little further each night. Tonight: what is done to him, how he is trained, how he gets in.
- 4a: **HALF A YEAR AFTER THE FURNACE** / *A sealed pump room under Tier Six. The Table.* In: PAGE. Happening: Ilse Marrin remakes him as one of the Accredited: bones, throat, eyes; he refuses to let her take the burns off his palms. **This is the only time the Gilding is shown.** Plays: the Table (comic, `gild`). Existing lines stand. Out: PAGE.
- 4b: **TWO YEARS AFTER THE FURNACE** / *A sealed pump room. Brand.* In: CUT. Happening: Brand, a Warden who deserted, teaches him to fight like them; the lesson with the slate. Plays: **the Drill** (2D). Existing lines stand.
- 4c: **TWO AND A HALF YEARS AFTER THE FURNACE** / *The pit. Brand. No gloves.* In: CUT. Happening: Brand makes him take the gloves off; he fights with the palms he kept. Plays: **No Gloves** (2D).
- 4d: prose card *Three years of that.* / *Then they sent him up Lift Zero under a dead boy's name, into the Assay.* Out: STRIP.
- 4e: **FOUR YEARS AFTER THE FURNACE** / *The Assay. The first night.* In: STRIP. Happening: the Assay starts with the Pairing: two cadets go into a room, one comes out. His is Dorian Aldane, sixteen, who shared his bread on the lift. Assayers watch from the gallery. Say: existing lines stand. Plays: **the Pairing** (3D). Build: **CHANGE (moved here from before the title)**; this puts the dream in exact date order.
- 4f: **NEW — the camp by day (2.5D, story).** Card: **MORNING** / *The Assay. Day three. The camp by daylight.* In: CUT. Trigger: Dorian holds out half a loaf (he lived; the Pairing only decides who is a cadet). Happening: House Violet's camp. The player meets the cadets as people before the fighting piles up: Dorian and his bread; Oswin Hale and the leg that was set crooked; Petra Lune keeping her column; the Sisters Vey; Corin Ashby with his slate. Say: Kael: *"Forty of us in one House, and every one of them was sent by somebody."* Then each cadet in a line or two of their own. One choice (who you sit with) that a later line remembers. No fight. Build: **NEW** (`walkCampDay()` in `src/assay.js`).
- 4g: **NIGHT THREE** / *The Assay. Day three, after dark.* In: CUT. Happening: the camp at night; wood, water, a cadet sitting on the woodpile who hasn't eaten in three days. Plays: **the Camp** (2D level). Existing lines stand. Out: WAKE.

**5. First Fire**
- Card: **FIRST FIRE** / *Forty-two days after the furnace.* In: WAKE.
- Happening: the festival of the First Fire, the day a year ago they were married. Seren's lantern should hang on the Pillar tonight. The tier half expects him not to come.
- Plays: free play.
- 5a: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day nineteen.* In: STRIP. Trigger: the sound of running water in the cistern at Bay Three. Happening: the one daytime flash: Violet must take the river crossing from House Teal in single combat; Vant captains Teal. Say: existing lines stand. Plays: **the Ford** (3D). Out: WAKE. Build: CHANGE (card title was "THE ASSAY").
- 5b: **NEW — Bay Three at last bell (2.5D, story).** Card: **LAST BELL** / *Bay Three. Forty-two days after the furnace.* In: WAKE. Happening: at last bell every valve hand hangs their seat knife back on the board in Bay Three and the foreperson counts them. Crew Three counts theirs. Hook 306 is Seren's; it has been empty for forty-two days and nobody has taken it down. Say: Mara counting; Kael: *"Three hundred and six. Nobody has hung anything on it. Nobody has taken the hook down either."* You hang your own knife. Build: **NEW** (walk mode; the knife board also goes into Bay Three in free play; knives on Crew Three's belts).
- 5c: **THE FIRST FIRE** / *Ashgate Square. After last bell.* In: CUT. Happening: the ceremony; then he climbs the Pillar to hang her lantern, out of the Tallymen's lamplight. Plays: the ceremony; **the lantern climb** (stealth). Existing lines stand. Build: CHANGE (card was a second LAST BELL).
- 5d: **FIRST FIRE** / *One candle-hour. It burned for three.* In: CUT. Happening: the lantern burns three times as long as it should; the square stays to watch it. Build: CHANGE (moved here, before the night, from after it).

**6. That night: the island, the Standard, the fire**
- Card: **THAT NIGHT** / *The dream again. It is getting longer.* In: CUT. Trigger: he can still see the lantern from his bunk.
- 6a: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Night twenty-five.* In: STRIP. Happening: what the Assay is: Houses hold ground, Assayers write it down, the winner is given a post on the Spire. House Teal holds the island in the river; its pump house and **vent stack** power the valley's lamps and the Assayers' boots. Violet raids it. Say: existing lines stand ("For twenty-five days we have been taking each other apart."). Plays: **the Island** (2D level).
- 6b: **MORNING** / *The Assay. Day twenty-six. They have come for it.* Happening: Teal comes for Violet's standard; the Sisters Vey, two blades. Plays: **the Standard** (3D).
- 6c: **NIGHT TWENTY-EIGHT** / *The Assay. Forty of them, and nobody sitting.* In: CUT. Trigger: fire answers fire (the lantern → the camp fire). Happening: someone in Violet sold the lamp oil; Kael calls the whole House round the fire and gets one name. Right (Corin) or wrong (Merrow, Oswin); the wrong name costs him. Say: existing lines stand. Plays: **the Lamp**: the Circle in 2.5D. **BUG FIX: the naming and the fight that follows stay inside the 2.5D Circle until the fight ends** (now `Mission.fight(walkCircle(), () => nameIt())` in `src/assay.js` leaves the walk first). Out: WAKE.

**7. The Ledger**
- Card: **THE LEDGER** / *Forty-three days after the furnace.* In: WAKE.
- Happening: the High Auditor, Celestine Aurel, comes down Lift Zero to Tier Six, the first time in years. She looks at Kael; this is where she first sees him. The window: someone tells him the sky is blue.
- Say: existing lines stand.
- 7a: prose card *He came down at second bell* / *with a pass stamped in gold, and four hundred people watching the light to see if he would.* Happening: trouble at the hatch; a Warden; Kael goes under the floor. Plays: **Under the Floor** (2D).
- 7b: **NEW — the Deep Array (comic-book level).** Card: **THE DEEP ARRAY** / *Forty-three days after the furnace. Under the floor, with Harl.* In: PAGE. Trigger: Harl: *"You want to see what they're counting?"* Happening: Harl Morrow, who worked beside Seren and now lives under the floor with the Unlit, takes him down to the Deep Array, the machine all the air comes from, named all through the game and never shown. Kael sees what it is and that it is failing. He is untrained: **no boots, no ELEVEN, no Assay moves**; a climb, a hide, a scramble; any fight is a brawl with a wrench. Say: Kael: *"I had been keeping it alive for ten years, one valve at a time, and nobody had ever let me see it."* What he sees here is what Part Two is about. Out: PAGE. Build: **BUILT v0.71** (`issue/`, key `array`).

**8. That night: the Dais, the Assayer, the boots**
- Card: **THAT NIGHT** / *Further in than it has gone before.* In: CUT. Trigger: he falls asleep under the floor with the Array's hum in his ears.
- 8a: **NIGHT THIRTY** / *The Assay. The night before day thirty-one.* In: STRIP. Happening: Violet gets onto the Assayers' dais and sees the grading book; Kael notices a page that shouldn't be there. Plays: **the Dais** (2D level).
- 8b: **MORNING** / *The Assay. Day thirty-one. He has noticed the page.* Happening: Halden Voss, the Assayer paid by two Houses, comes for him. Nobody touches an Assayer. Kael does, in the air and then on the ground, and cuts the boots off him. Plays: **the Assayer** (3D), **On the Ground** (2D).
- 8c: **NEW — the vent stack (comic-book level).** Card: **THE VENT STACK** / *The Assay. Day thirty-one. The island.* In: PAGE. Trigger: Voss's boots, dead in his hands. Happening: the Assayers' boots charge off the island's vent stack (6a told us). Kael climbs it with them, charges them at the top and jumps. **He can fly from here on.** Say: Kael: *"They had told us the boots were what made an Assayer. They are a battery, and a stack, and a man who isn't afraid of the height."* Out: PAGE. Build: **BUILT v0.70** (`issue/`, key `stack`).
- 8d: no card. CUT. Happening: he comes back into camp in Voss's white cloak; the cadets get up from the fire and follow him. Build: **BUILT v0.68** (white cloak on Kael from here: the Valley, the Last Night, the Keep and its cold open, the Pinning).
- 8e: the hum slip: a book as wide as a table, a pen in his hand, gold on his cuff, a red line he doesn't understand. Existing lines stand. Then **FORTY-THREE DAYS AFTER THE FURNACE** / *Cinderwell. Under the floor.* In: WAKE. Build: CHANGE (drop the second card "THE LEDGER / … The day ends.").

**9. The Way Out**
- Card: **THE WAY OUT** / *One hundred and sixty days after the furnace.* In: WAKE.
- Happening: four months on. Kael has decided. Mara knows. Tallyman Sull's night watch stands between him and Lift Zero. Ilse Marrin comes for him at the end: *"Come along, soot. One does not keep the table waiting."* **Callback:** as she says it, one beat of the Table's first picture (PAGE in and out). That is the only time the Gilding touches the present; the present stops at that door. (**BUILT v0.68**, with the 2D picture of the Table.)
- Plays: the months, Mara, **the Way Out** (2D), Ilse. Existing lines stand.
- 9a: **THAT NIGHT** / *The last dream below. It runs to the end.* In: CUT. Trigger: the lift's light going up the shaft.
- 9b: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day forty.* In: STRIP. Happening: Violet holds the valley against two Houses; he flies now. Plays: **the Valley** (3D, with the boots and the white cloak). Build: CHANGE (moved from the cold open).
- 9c: **NIGHT FORTY-NINE** / *The Assay. The night before the last day.* Happening: the night before the end; no enemies; the cadets who are left. Plays: **the Last Night** (2D level).
- 9d: **MORNING** / *The Assay. The last day.* Happening: **the cold open again, the whole way through.** This time ELEVEN lands: **Lucan's blade breaks and he goes to his knees in front of his mother.** He lives. Say: Kael's line from the cold open, then the one he says in the dream: *"If I put him on his knees in front of her, she will have to pin the gold on me herself."* Plays: **the Keep**. Out: ELEVEN, then black. Build: **BUILT v0.68** (`FF.keepEnd`).
- 9e: **END OF PART ONE** / *B E L O W*.

### PART TWO: ABOVE
The present jumps from Lift Zero (160 days after) to the Pinning (four years after) and stays above. Part Two is all 3D in the present; the past comes back as **2D and 2.5D flashbacks**, one per chapter, each deeper than the last; three short **flash-forwards** point at the end; the last chapter has no cuts until the final blow. **The fourth ring** is home between chapters, the way Ashgate is in Part One; in Two Years the home is **the barge deck**.

**10. Part Two's cold open (flash forward)**
- Card: **NINE YEARS AFTER THE FURNACE** / *The Sun Spire. The Stair. Sunset.* In: STRIP (the strip runs past the end of the Assay and becomes a count of years). Trigger: the white of END OF PART ONE burns into sunset.
- Happening: the same move as the Keep: show where Part Two ends before it begins. Kael in a clerk's coat on the outside stair of the Spire, nine hundred steps, the fleet in the sky, a halberd standing at the top. Nobody is named.
- Say: no narration.
- Plays: about a minute of **the Stair** (comic level): a short climb and one fight; cut when he reaches the top and sees who is waiting. Out: CUT to white. Build: **NEW** (an opening slice of `stair` with its own end trigger).
- Then: **PART TWO** / *A B O V E*.

**11. The Pinning**
- Card: **THE PINNING** / *Four years after the furnace. The last day, after the keep.* In: CUT.
- Happening: hours after the Keep. Celestine Aurel pins the gold on Edric Sorrel herself and gives him the post. She knows him, from the white room during the Gilding and from Lift Zero. She does not say so. Her champion, the Auditor's Blade, tests him first.
- Say: existing lines stand. Plays: **the Pinning** (3D). Build: CHANGE (now after the PART TWO card).
- 11a: **NEW flash forward: the book.** Card: **NINE YEARS AFTER THE FURNACE** / *The Count. A book as wide as a table.* In: STRIP (years). Trigger: the pin closing on his collar. Happening: ten seconds: the book from the hum slip, open; one line in red; it is his name. No explanation. Pays off in 16a. Say: no words. Build: **NEW** (a drawn still, slow push).
- 11b: **THE SEAT KNIFE** / *Four years after the furnace. The night before the lift.* Existing lines stand.

**12. The Post**
- Card: **THE POST** / *The Sun Spire. Four years and a season after the furnace.*
- Happening: Clerk Sorrel at his desk in the Count, the office that decides who breathes. He hides his palms. Severin Cade wants satisfaction for his uncle's honour.
- 12a: **NEW — the fourth ring, first visit (2.5D, home).** Card: **THE FOURTH RING** / *The Sun Spire. Four years and a season after the furnace. Night.* Happening: where Clerk Sorrel lives, among people who don't know what he is: Kestrel Dray's door, Sable's stall, porters who kneel at the bell. **The suspicion meter** lives here: the wrong word, a look at the wrong person (soot look at whoever speaks; the Accredited don't), bare palms, and it climbs. Finds feed the Codex. Say: Kael: *"Up here nobody looks at anybody. I had to learn that before I learned anything else."* Build: **NEW** (walk mode; the approved "Spire's fourth ring at night").
- 12b: **NEW flash (2.5D).** Card: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day thirty-one, after dark.* In: STRIP. Trigger: in the fourth ring, a porter steps aside for him without being asked. Happening: why the Spire defers to a clerk: the night he came back in the white cloak and forty cadets fell in behind him. You walk the camp at the head of them. Say: Kael: *"They did not follow me because I won. They followed me because I came back."* Build: **NEW** (walk mode in the camp at night; reuse the Circle's camp).
- 12c: **NEW — the service stair (2.5D).** Card: **THE SERVICE STAIR** / *The Sun Spire. The painted line.* Happening: inside the Spire, behind a painted line no clerk crosses, the stair the soot who work above use. Kael crosses it and finds Tier Six people working the Spire's own valves. Say: Kael: *"There is a line painted on the floor. On one side they call me Clerk. On the other they call me Brennick, very quietly."* Build: **NEW** (walk mode; owner chose 2.5D).
- 12d: **the Gallery** (3D, Severin Cade). Existing lines stand.

**13. The Balancing**
- Card: **THE BALANCING** / *Five years after the furnace.*
- Happening: the Marshal "balances" the tiers: when the Array falls short, a tier goes without. Tier Four is chosen. Kael has to sign it.
- Plays: the fourth ring (visit two, card *THE FOURTH RING / Five years after the furnace.*); Tier Four.
- 13a: **MEANWHILE** / *Cinderwell. Five years after the furnace. Tavi.* In: CHALK. Trigger: a chalk sun on a Spire wall that someone keeps putting back. Happening: below, Tavi (twelve) puts Seren's sun back on the Pillar every rest day; Tallyman Sull scrubs it off. Plays: **the Sun** (2D; you play Tavi). Out: CHALK. Build: CHANGE (card was "BELOW").
- 13b: **RISER NINE** / *Five years after the furnace. The Assay valley, at night.* In: PAGE. Happening: the Unlit start coming up through Riser Nine; Kael holds it while forty climb. Plays: **Riser Nine** (comic).
- 13c: **THE DOCKMASTER'S TABLE** / *Five years after the furnace. The High Docks.* Happening: dinner with Vant, now Dockmaster. Existing lines stand.

**14. What She Knows**
- Card: **WHAT SHE KNOWS** / *Six years after the furnace.*
- Happening: Celestine has known all along. She tells her son. Lucan comes for him. The fourth ring (visit three) is colder: the suspicion meter starts higher.
- Plays: the hum; **the Son** (3D, Lucan).
- 14a: **NEW flash forward: Tavi at sixteen.** Card: **NINE YEARS AFTER THE FURNACE** / *The Sun Spire. The service stair. Tavi, sixteen.* In: STRIP (years). Trigger: Lucan: *"You have a brother."* Happening: ten seconds: Tavi grown, on the service stair, a chalk sun in his hand. Pays off in 15 ("Tavi is coming up. Sixteen."). Say: no words. Build: **NEW** (a drawn still).
- 14b: **NEW flash (2D).** Card: **FIFTY YEARS BEFORE THE FURNACE** / *An Assay. A cadet called Celestine Aurel, twenty.* In: FURNACE, cooled to grey. Trigger: in her rooms Celestine takes off one glove and turns a valve wheel the way only a valve hand would; Kael sees it.
  - **Happening, her secret (decided 2026-11-19):** Celestine was born on Tier Six. Below, they called her **Little Ember**. An Accredited family took her up as an heir and had her gilded; unlike Kael, **she let them take the burns off her palms**, and she has worn gloves ever since. At her own Assay, at twenty, she won by sneaking to the island's pump house at night and **shutting the valve** on the enemy House's camp. They woke short of air and surrendered; two of them did not wake. The Assayers wrote it down as genius. She learned that whoever will turn the valve runs everything, and she has run the Count that way for fifty years.
  - **Why it makes sense of everything:** she calls Seren "little ember" at the furnace because Seren was what she had been; "I do not usually remember them" is true, except for that one. She knew Kael at the Ledger for the same reason: a valve hand who could do the arithmetic. She let him up Lift Zero and **sent for a successor** (her existing line). She recognised the Gilding on him because it was done to her. **The mirror:** she turned a valve so people stopped breathing; Kael turned one so a ward could. The final fight is called LITTLE EMBER because it is her name. The ending choice gains weight: sending her down Lift Zero to a bunk on Row K is sending her home.
  - **Why she still sent Seren into the furnace:** because that is what she became. (1) **The arithmetic:** a bled line on the audit means the whole of Crew Three answers for it; Seren's confession let her balance it with one. One for forty is the same sum she did at twenty, and she has done it every day since. (2) **Her own cover:** a High Auditor born on Tier Six is watched closer than anyone up there. Sparing a soot thief, in front of four hundred people and her own Assayers, is the one thing she can never be seen to do. She has to be colder to soot than any born Accredited. (3) **Seeing herself:** she remembers Seren because Seren looked at her the way she once looked up from Tier Six. She did it anyway. That is the horror of her, and why she is the last fight and not a villain who didn't know. (4) **Kael next:** she sent for him as a successor because he is the only other person she has met who can do the arithmetic. Her mistake is thinking he will do it her way.
  - **Her line about it, at Little Ember (16c):** *"One for forty. I did that sum at twenty, with two cadets who did not wake. I have done it every day since. She did it too, little ember, when she said it was her. She only did it the other way round."* (Seren gave one to save forty; Celestine took one to keep forty quiet.)
  - **Plays:** you play her, in 2D: stealth across the island at night (it mirrors the heist), then the valve: hold to shut it. The Assayers' lamps, the camp going quiet.
  - **Say:** Celestine, at the wheel: *"It is only a valve. On Tier Six every child can turn one. Up here, nobody else would."* Then, at the Pinning-style ceremony after: an Assayer: *"Genius."* Her: nothing.
  - **Payoff (16c, Little Ember):** before the fight she says: *"They called me that too, before they gave me this name."* Keep her existing lines.
  - **Build:** NEW. Update the story bible's Celestine entry, and give her model gloves everywhere.
- 14c: **THE DOCK STAIR** / *Seven years after the furnace. Before the second bell.* Happening: the raid on the High Docks: cut four hundred barges loose. Ilse plans it; Brand and Kael take the top of the dock stair; somebody has told the Wardens the hour (Maren Aldane). Existing lines stand.
- 14d: **THE HIGH DOCKS** / *Seven years after the furnace. The second bell.* In: PAGE. Plays: **the High Docks** (comic). **One card only** (it shows twice now).

**15. Two Years**
- Card: **TWO YEARS** / *Seven to nine years after the furnace.*
- Happening: the same night: the Wardens come up the dock stair; Brand holds it so the others can cut the last moorings.
- 15a: **ELEVEN MINUTES** / *Seven years after the furnace. Brand holds the dock stair.* Plays: **the Dock Stair** (2D; you play Brand; cannot be won; he dies). Build: CHANGE (card was a second THE DOCK STAIR).
- 15b: **NEW — the barge deck (2.5D, home for this chapter).** Card: **EIGHT YEARS AFTER THE FURNACE** / *A barge, in the weather.* Happening: four hundred barges hidden in the weather; the Unlit learn to fly them. Kael sat for a month and counted nothing; a weeping seal got him up. Say: existing lines ("It was a valve that got me up…"). Build: **NEW** (walk mode; the approved barge deck).
- 15c: **NEW flash (2.5D).** Card: **THREE WEEKS BEFORE THE FURNACE** / *Bay Three. Seren, alone, after last bell.* In: FURNACE. Trigger: on the barge, Kael lays his hand flat on the weeping seal, the way she taught him. Happening: **the biggest reveal in the game: Seren found the bleed first.** You play her tracing the line on Bank Seven weeks before Kael touched it; she asks Orin about it. She knew what it would cost. Say: Seren: *"Somebody will have to answer for it. Let it be somebody who knew."* Build: **NEW** (walk mode in Bay Three).
- 15d: **EIGHT YEARS AFTER THE FURNACE** / *Six tiers down. Bay Three. A commitment.* In: CHALK. Trigger: Harl: *"I was not there. I am told it went like this."* Happening: Tier Six stops kneeling: at a commitment, Mara stands up and the row stands behind her. Plays: **Tier Six Stands** (2D; you play Mara). Then Harl: *"Tavi is coming up. Sixteen."* Build: CHANGE (card was MEANWHILE).
- 15e: **THE NIGHT BEFORE** / *Nine years after the furnace. Four hundred hulls, in the weather.* Then **the Fall** (3D). Existing lines stand.

**16. The Count (no flashes until the last blow)**
- Card: **THE COUNT** / *Nine years after the furnace. The Sun Spire.*
- 16a: **NEW — the Count as a puzzle.** Card: **THE BOOK** / *Nine years after the furnace. The Count.* Happening: the book from 11a, open in front of him. He rebalances the columns so every tier breathes, without the Spire noticing until it is too late; the last red line is his own name. Say: Kael: *"I have counted eleven seconds every day for nine years."* (existing line). Build: **NEW**.
- 16b: **THE STAIR** / *Nine years after the furnace. Sunset.* In: PAGE. Plays: **the Stair** (comic), the whole level; the cold open's minute plays again from the inside. Hollis carries Brand's halberd to the top.
- 16c: **Little Ember** (3D, Celestine Aurel). Existing lines stand. The fight ends with her beaten, not dead (BALANCED), then **the choice, which already exists:** *Strike her line* (she dies: Kael does her sum, one for forty, and writes "Balanced" after her name) or *Send her down Lift Zero* (a bunk on Row K and a ration book). **With her secret, the choice now means: become her, or send her home.** Neither is marked right. Keep both endings' existing lines; the Row K ending gains one beat: Mara, who never met her before the furnace, calls her "little ember" without knowing why it lands.
- 16d: **NEW — the last flash.** Card: **LAST BELL** / *Bay Three. The heart-furnace.* In: ELEVEN. Trigger: the last blow. The furnace, the count reaching eleven, held. Out: WAKE.
- 16e: **NEW — the ending, played** as drawn pictures like the Table, not told.
- 16f: **SOOTBORN** / *E V E R Y   B R E A T H   I S   H E R S* — **THE END** / *North Coast Studios × E Concepts*.

### Count after this plan
- Comic-book levels: 3 → 5 (the Deep Array, the vent stack).
- 2.5D places: 4 → 10 (the camp by day, Bay Three at last bell, the fourth ring, the camp at night, the service stair, the barge deck, Seren in Bay Three; with the existing fire, square, Row K, ward).
- Part Two: flashbacks 2 → 6; flash-forwards 0 → 3 (the cold open, the book, Tavi); a home base in every chapter.
- Things to play: Part One about 30; Part Two about 16 → about 25.
- New cards: 4f, 4g, 5b, 7b, 8c, 10, 11a, 12a, 12b, 12c, 14a, 14b, 15b, 15c, 16a, 16d.
- Changed cards: ASHGATE, the Pairing moved to 4e, THE FIRST FIRE (5c), FIRST FIRE closing card moved to 5d, the Ford's title, the Valley moved, the Keep's ending, PART TWO before the Pinning, ELEVEN MINUTES, MEANWHILE → dated, the Sun's card; removed: the second THE LEDGER card, the second THE HIGH DOCKS card.

## Part D. Story check (done; keep it true)
1. **Day one = Ashgate.** Approved. The present starts at Ashgate; the Assay is a flash in Part One.
2. **Lucan lives.** The Keep ends with his blade broken and him on his knees, not dead.
3. **The boots** come from Voss on day 31 and are charged at the vent stack; he flies from then on.
4. **Tavi is seven at the furnace** (twelve at +5, sixteen at +9). Fix the story bible, which says six.
5. **The Deep Array happens while Kael is untrained:** no Assay moves.
6. **One card each** for the High Docks and the Dock Stair; the PART TWO card before the Pinning.
7. **The Pairing moved into the first dream (4e)**, so the present (Ashgate) comes straight after the furnace and the title, and the first dream runs in exact date order: half a year, two years, two and a half, the Assay's first night, day three.
8. **Card fixes from the check:** two LAST BELL cards in a row on First Fire (the ceremony is now THE FIRST FIRE); the First Fire closing card moved before the night; the vent stack's sub names day thirty-one (the calendar strip reads it); the Deep Array card no longer repeats UNDER THE FLOOR; the second "THE LEDGER / The day ends" card dropped (he wakes under the floor); the Brand fight card is ELEVEN MINUTES; Tier Six is dated, not MEANWHILE, because Harl tells it afterwards.
9. **Two Years happens off the Spire:** after the docks Kael hides with the barges, so that chapter's home is the barge deck, not the fourth ring.
10. **Celestine's secret is decided** (14b): born on Tier Six, called Little Ember, gilded, won her Assay by shutting a valve. It fits every line she already has.
11. Holds already: the furnace at zero; the four days below; the Gilding at half a year; training at two and two and a half; the Assay at four years; Celestine at Lift Zero setting up the Pinning; Brand dead at +7 and his halberd at +9; Seren and Orin and the bleed.

---

## Part G. Matching the writing (from the master plan)
| The writing says | On screen now | Fix | Cost |
|---|---|---|---|
| Every valve hand carries a **seat knife**, counted back onto a board at last bell | Nobody carries one; no board | Knife on Crew Three's belts; the board in Bay Three; counting back (5b) | Low |
| Kael wears **the Assayer's white cloak** from day 31 | Violet cape to the end | White cape from 8d on | Very low |
| As **Edric Sorrel he is a clerk** with a sun on his collar | Assay plate in every Part Two scene | A clerk's coat on the Spire and at the High Docks; plate only where he fights openly | Medium |
| He **wore gloves for a year** and hides his palms | Never shown | Gloves on the clerk; Kestrel turns his hand over once | Low |
| **Oswin's leg** set crooked | Moves like any boss | A stiff leg in his stance and walk | Low |
| **Lucan walks with a stick** if not befriended | Told only | The stick in his last scene | Low |
| The Accredited **don't look at each other**; soot do | Everybody the same | The head rule (below) | Low |

**Eight deliberate animations:** hand flat on the pipe (Seren, Kael, Kestrel); counting the knives back; heads (soot turn to whoever speaks, the Accredited keep eyes front); the kneel at the bell; Kael's hand to the washer before ELEVEN everywhere; a humming sway at a commitment; Brand and then Hollis grounding the halberd; Tavi on Seren's left, then on Kael's left.

---

## Part H. People, in brief (full table in `SCRIPT_AND_PLAN.md`)
- **Kael Brennick:** valve tech, Crew Three; gilded; becomes Edric Sorrel, Clerk of the Count. The player.
- **Seren Holloway:** his wife; runner; paints suns; took the blame and went into the furnace. Memory, and in 15c the player.
- **Tavi:** Kael's younger brother; seven at the furnace. Played in the Sun.
- **Mara Venn:** foreperson; married them; keeps the list. Played at Tier Six.
- **Brand:** the Warden who deserted and trained Kael; dies at +7 (eleven minutes). Played at the Dock Stair.
- **Celestine Aurel:** High Auditor, seventy; born on Tier Six as "Little Ember", gilded, won her Assay by shutting a valve; the final fight; played once in 14b.
- **Lucan Aurel:** her son; kind; the Keep and the Son. Lives.
- **Dorian Aldane:** sixteen; shared bread; the Pairing. **Maren Aldane:** his sister; sold the hour of the raid.
- **Harl Morrow:** Seren's partner at work; under the floor; takes Kael to the Deep Array (7b).
- **Kestrel Dray:** an Accredited engineer who asks why; lives on the fourth ring (12a).
- **Oswin Hale, Petra Lune, Corin, Merrow, the Sisters Vey:** Assay cadets; met as people in 4f.
- **Halden Voss:** the Assayer whose boots Kael takes. **Tallyman Sull:** the night watch below.
- Also: Ivo, Nell, Hollis, Inspector Vale, Ilse Marrin, Severin and Marshal Cade, Vant, Ansel Rook, Sable, Row K, the square.

---


## Part J. Built but never seen by a person (the owner should check these when playing)
- **v0.63: arena figures.** Torso plate, baldric, scabbard, and a blade that is a sword.
- **v0.62: the Assayers** behind the Dorian fight (low balcony, in the dark) and on the valley dais.
- **v0.61: two more memories to walk in.** Row K (the ledge of suns by your door) and the fever ward (the ward board in the clinic).
- **v0.60: arena boots.** The camera follows you up and closes in on dives; hook in the air hauls a man up, strike cuts him down.
- **v0.60: new kit** on Dock Guards, Stair Blades, Wardens, Rook, the other two bosses and Tavi.
- **v0.59: the comic levels' HUD on your phone.** Cause found from your screenshot (the level was leaving room for the notch). Check the health bar is top-left and the objective top-right in all three levels.
- **v0.59: the two 2.5D places.** The fire on night 28 (the Lamp) and the square memory at the Pillar on Day 1.
- **v0.58: fights below are harder to mash.** A man who is down takes one blow and gets up guarding. Say if the Scuffle or the Ember Ring is now too much.
- Air hook, air cut and thrown weapons (v0.51).
- Death animation, down-but-not-out, Tavi following (v0.50).
- The Lamp's wrong-name fight (v0.50).
- Controller in the comic levels: both sticks and lock-on now reach the level (v0.55); legend and pause menu on the stick (v0.49). Never tried with a real pad.
- The second wind's furnace scene in arena fights (v0.54). Levels from the Dev menu starting at their opening (v0.55).
- v0.56: guards' three blows and their guard (TURNED.); the run's arms; the ring of ships over the Stair; the Scuffle on Row K; the second wind's memory by era; the controller legend in arena fights.


## Part K. Index of jumps in time
**Flash forwards (about twenty).** Part One: every dream (the Table, the Drill, No Gloves, the Pairing, the camp by day, the Camp, the Ford, the Island, the Standard, the Lamp, the Dais, the Assayer, On the Ground, the vent stack, the white cloak, the hum slip, the Valley, the Last Night, the Keep), plus the cold open (the Keep). Part Two: the cold open (the Stair), the book, Tavi at sixteen.
**Flashbacks.** Part One: the prologue and the furnace (before day one); the three walked memories in Ashgate (the square, Row K, the ward). Part Two: the camp at night, Celestine's own Assay, Seren finds the bleed, the last flash (the furnace).
**Same time, elsewhere.** The Sun (Tavi, +5); Tier Six Stands (Mara, told by Harl, +8).
**Shown once only:** the Gilding (the Table, 4a), as a flash forward. The present stops at its door (Ilse at the Way Out).

