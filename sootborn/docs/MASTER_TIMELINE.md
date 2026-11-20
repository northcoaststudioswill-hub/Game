# SOOTBORN — MASTER TIMELINE AND BUILD PLAN
Version 2 · written 2026-11-19, on top of game build v0.65 · for the next build session (Fable) to execute

**This is the one document to work from.** It holds the whole game in play order: every card, every jump in time with the context for it, every transition and what triggers it, the bugs to fix first, what to build in what order, and how to build, test and release. The other SOOTBORN docs are reference only: `STORY_BIBLE.md` (lore and people), `CHANGELOG.md` (history), `OPEN_LIST.md` (everything ever asked for). Where they disagree with this document, this document wins; then update them.

---

## Part A. Before you touch anything

### A1. What SOOTBORN is
An original story game, inspired by Red Rising but legally distinct. **No Red Rising names, emblems, weapons or characters may appear.** A valve tech in an underground city (Cinderwell) loses his wife Seren to the heart-furnace, is remade into one of the ruling class (the Gilding), fights through their trial (the Assay), and climbs their tower (the Sun Spire) to end the count of who gets to breathe. Tagline: *Every breath is hers.* Studio line: North Coast Studios × E Concepts.

The owner plays on an **iPhone in the Claude app**, often with a **controller**. Nobody uses touch controls except the on-screen pad, or plays on a computer. Replies to the owner: short, mobile-sized, lead with the outcome, and say plainly what was not checked.

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
- **Version string:** `src/ui.js`, "Version 0.65." Next is 0.66.
- **Publish:** the game is the Claude artifact with slug `2a8a025c-511d-454c-861c-d9bc7a4565f5`; publish `index.html` with `publish_files` and the live version as `base_version` (get it with `get_artifact`). The illustrated progress report is `be5babce-6d5d-4c6e-9668-9b2185959f6c`.
- **Project docs** (claude.ai project "Rr Game Idea"): `claude/sootborn-changelog.md`, `-story-bible.md`, `-open-list.md`, `-script-and-plan.md`, `-progress-report-v0.65.md`, `-cards-and-transitions.md`, and this one, `claude/sootborn-master-timeline.md`. Read a doc with `project_read` before writing it.
- **Commits** end with the attribution lines your session gives you. Push with `git -c push.negotiate=true push origin sootborn` (it prints "repository moved" and still succeeds). If the push is rejected, fetch and rebase first: other sessions also push here.

### A4. How the code is put together (what you need for this plan)
- Scripts are concatenated in this order: core, art, content, story, systems, cinema, panels, brawl, g3, ff, day2, day3, part2, rowk, assay, issue, checkpoints, ui, main. Top-level `const`s (Mission, DEV, Cutscene, Brawl, Issue, HUD, G3, FF…) are globals; `window.BTS` exposes G, UI, Game, Brawl, Dialogue, Puzzle, FF, World, P, Cutscene. A global called `STEP` exists; don't define `window.STEP`.
- **Cutscenes** are step lists: `{ card, sub }`, `{ narr }`, `{ say }`, `{ panel }`, `{ fade }`, `{ brawl: () => FF.x() }`, `{ mission: 'id' }`, `{ fx }`. `Cutscene.play(steps, done)`.
- **The calendar strip** (`assayCal` in `src/cinema.js`) lights the Assay day by reading the card's **sub** text with regexes such as `/day thirty-one/i`. Assay days must stay in subs.
- **Time helpers** `WHEN`, `whenS(d)`, `whenN(d)` at the top of `src/systems.js`.
- **Fights:** `src/brawl.js` is both the 2D fights and the 3D arena fights (the arena is drawn by `src/g3.js`, plain WebGL). A fight is a def from `FF` in `src/ff.js` (and `assay.js`, `rowk.js`), started with `Brawl.start(def, cb)` or `Mission.fight(def, after)`. `def.era` gates moves; `hookEra()` gives the hook only if `def.hook` or era ≥ 5.
- **2.5D places** are Brawl's walk mode: a def with `walk: { id, spawn, npcs, spots, props, floor, obj, keep|clear }` (see `walkCircle`, `walkSquare`, `walkRowMorning`, `walkWard` in `src/assay.js`).
- **2D levels** (top-down missions): `Mission.start(id, done)`; defs in `src/assay.js` and elsewhere.
- **Comic-book levels** (third person, three.js, `SC` namespace) are chosen by the key replaced into `issue: 'docks'`; existing keys: `gild` (the Table), `riser`, `docks`, `stair`. Started from the game with `Issue.start(key, ok => …)`. Hosted in an iframe; input arrives by postMessage.
- **The opening:** the opening film and its caption "ONE SEASON" are in `src/ff.js`; the cold open is currently `FF.valley`. The Keep is `FF.keep` (src/ff.js, around line 60).

### A5. Tests (in `tests/`)
Playwright with Chrome and the software renderer (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`). Paths inside older tests may point at another machine's folders: point them at the repo's `index.html` and `issue/`.
- `godrun.mjs`: **the whole-story bot.** Plays New Game to THE END without being able to lose and logs every card, fight and level (`SECS=570`). **Run it every release.** Its log is how you check the order of cards against Part B.
- `walk.mjs` (M=circle|square|rowmorn|ward): the 2.5D places. `iss.mjs` + `lv.js` (via `tests/runlv.sh riser|stair`; `lv.cjs` writes `issue/lv-<key>.html`, don't commit those): comic levels standalone. `ff.mjs`: fights (M=name, BOT=mash). `mis.mjs`: 2D levels. `cap65.mjs`, `cap65b.mjs`: screenshots.

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
Each beat: **Card** (exact text: TITLE / sub) · **In** (transition) · **Trigger** (what calls it up) · **Context** (what the player knows going in, and why it is here) · **Plays** · **Build** (EXISTS / CHANGE / NEW, with where).

### OPENING

**0a. The animated intro**
- Card: none. In: from the title (New game).
- Context: the player knows nothing. The intro promises three things: a man underground, a woman, and gold. It ends on the number the whole game is built round.
- Plays: about 25 seconds of drawn stills that move (pans, pushes, cuts), in the Table's comic style. Black; one voice humming the shift song. A hand flat on a pipe → a gauntlet closing on a hilt. A chalk sun on a wall → the real sun over the valley. Faces in the Assay's ring: cadets watching, a Proctor's pen. The count runs under it, one to eleven, cuts getting faster.
- Out: ELEVEN. Build: **NEW** (replaces the opening film and its "ONE SEASON" caption, `src/ff.js`).

**0b. The Keep (cold open)**
- Card: **FOUR YEARS AFTER THE FURNACE** / *The Assay. The last day.* In: STRIP. Trigger: the count reaches eleven.
- Context: a flash forward to the end of Part One. The player sees what Kael becomes before seeing what he was: gold plate, open sky, flying. The question "how does a valve hand get here" carries all of Part One.
- Plays: `FF.keep` as a cold open. One duel at dawn under banners against Lucan Aurel. Teach three things: strike, dodge, fly. The camera follows him up and pushes in on the dive. Cannot be lost. At full fury ELEVEN lights; the blade comes down.
- Out: CUT, **before the blow lands**. Build: **CHANGE** (the cold open is `FF.valley` now; the Valley moves to 10b).

**1. Cinderwell**
- Card: **BEFORE THE FURNACE** / *Cinderwell. Six tiers under the rock. Before any of it.* In: CUT to dark. Trigger: the humming carries over the cut.
- Context: straight from gold to the dark. The world panel.
- Then: **ELEVEN MONTHS BEFORE THE FURNACE** / *The Festival of the First Fire · Ashgate Square* (In: FURNACE) — the festival and the wedding.
- Then: **FOUR DAYS BEFORE THE FURNACE** / *The fever comes to Tier Six* — the fever; **the heist** (stealth).
- Then the two prose cards (unchanged): *For three nights, you bled the line and balanced the bank by dawn. / On the third night, the fever broke. Tavi asked for bread.* — *On the fourth morning, the audit came early. / It did not come by gauge. It came down Lift Zero.*
- Build: EXISTS (only the In transition is new).

**2. Last Bell**
- Card: **LAST BELL** / *Bay Three · The heart-furnace.* In: CUT.
- Context: the loss the game is about. Seren takes the blame and goes into the furnace; the count ONE to ELEVEN are her eleven memories.
- Plays: the audit, the furnace, ONE. to ELEVEN. (unchanged text), the tin. Out: ELEVEN. Build: EXISTS.

**3. The Pairing**
- Card: **FOUR YEARS AFTER THE FURNACE** / *The Assay. The first night.* In: STRIP. Trigger: eleven again; his hand closes, and it is gloved.
- Context: a second flash forward, to the first night of the Assay: two go in, one comes out a cadet. Against Dorian Aldane, sixteen, who shared his bread.
- Plays: **The Pairing** (3D). Then **SOOTBORN** / *What they call us. What they will remember.* (the title). Build: EXISTS.

### PART ONE: BELOW (the present)

**4. Ashgate (day one)**
- Card: **ASHGATE** / *Forty-one days after the furnace. Kael still fixes valves.* In: WAKE.
- Context: the present begins. Six weeks after Seren. He has seen two dreams of a future he doesn't understand.
- Plays: free play on Tier Six: Row K, the square, the ward, Bay Three; three memories you walk in 2.5D (the square, Row K at morning, the fever ward). Build: EXISTS (card wording CHANGE: chapter-card form).

**5. That night: the Gilding and training**
- Card: **THAT NIGHT** / *He does not dream of the furnace. For once it runs forward.* In: CUT. Trigger: he lies down in the bunk Seren painted.
- Context: the dreams now run in order, a little further each night. This night covers his remaking and his training.
- 5a: **HALF A YEAR AFTER THE FURNACE** / *A sealed pump room under Tier Six. The Table.* (In: PAGE) — the Table, the Gilding as a drawn sequence (comic, `gild`). Out: PAGE.
- 5b: **TWO YEARS AFTER THE FURNACE** / *A sealed pump room. Brand.* — the lesson with the slate; **the Drill** (2D).
- 5c: **TWO AND A HALF YEARS AFTER THE FURNACE** / *The pit. Brand. No gloves.* — **No Gloves** (2D).
- 5d: *Three years of that.* / *Then they sent him up Lift Zero under a dead boy's name, into the Assay.* Out: STRIP.
- 5e: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day three.* — **the Camp** (2D level).
- Build: EXISTS.

**5f. NEW — the Assay camp by day (2.5D, story)**
- Card: **MORNING** / *The Assay. Day three. The camp by daylight.* In: CUT. Trigger: Dorian holds out half a loaf.
- Context: the Assay mattered and its people mattered. Before the fights pile up, the player meets the cadets as people: Dorian's bread, Oswin Hale's crooked leg, Petra Lune keeping her column, the Sisters Vey, Corin. Their later fights and betrayals (the Lamp, the Keep, the last level) land because of this.
- Plays: a walk (Brawl walk mode) through the camp by day; talk to each; one small choice (who you sit with) that a later line remembers. No fight.
- Out: WAKE. Build: **NEW** (`src/assay.js`, a `walkCampDay()` like `walkCircle()`; one of the five approved 2.5D places).

**6. First Fire**
- Card: **FIRST FIRE** / *Forty-two days after the furnace.* In: WAKE.
- Context: the festival where Seren's lantern should hang. The second day of the present.
- Plays: free play.
- 6a: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day nineteen.* — In: STRIP. Trigger: the sound of water in the cistern at Bay Three. Context: a daytime flash, the only one; the river crossing at the Assay. Plays: **the Ford** (3D). Out: WAKE. Build: CHANGE (card title was "THE ASSAY").
- 6b: **NEW — Bay Three at last bell (2.5D, story).** Card: **LAST BELL** / *Bay Three. Forty-two days after the furnace.* In: WAKE. Context: the writing says every valve hand carries a seat knife and counts it back onto a board at last bell. Crew Three counts theirs; seat knife 306, Seren's, is still missing from the board. Plays: the crew around the board; you count the knives back. Out: CUT. Build: **NEW** (walk mode; the knife board also goes into Bay Three in free play).
- 6c: **LAST BELL** / *The Festival of the First Fire.* — the ceremony; **the lantern climb** (stealth). Build: EXISTS.

**7. That night: the island and the fire**
- Card: **THAT NIGHT** / *The dream again. It is getting longer.* In: CUT. Trigger: the lantern he hung, burning.
- 7a: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Night twenty-five.* (In: STRIP) — what the Assay is (the map); **the Island** (2D level). Context: the island holds the valley's only pump house; its vent stack charges the lamps and the Proctors' boots (sets up 9c).
- 7b: **MORNING** / *The Assay. Day twenty-six. They have come for it.* — **the Standard** (3D, the Sisters Vey).
- 7c: **NIGHT TWENTY-EIGHT** / *The Assay. Forty of them, and nobody sitting.* — Trigger: fire answers fire (the festival lantern → the camp fire). **The Lamp**: the Circle (2.5D), where Kael names the traitor (Corin, Merrow or Oswin). **BUG FIX: the naming and the fight that follows must happen inside the 2.5D Circle and stay there until the fight ends** (now `Mission.fight(walkCircle(), () => nameIt())` in `src/assay.js` ends the walk, then hands off).
- 7d: **FIRST FIRE** / *One candle-hour. It burned for three.* In: WAKE.
- Build: EXISTS except the bug fix and card 7c's wording.

**8. The Ledger**
- Card: **THE LEDGER** / *Forty-three days after the furnace.* In: WAKE.
- Context: the day he learns who keeps the book. Celestine Aurel comes down Lift Zero; this is where she first sees him (it sets up her knowing him at the Pinning).
- Plays: Lift Zero, Celestine, the window ("the sky is blue").
- 8a: *He came down at second bell* / *with a pass stamped in gold, and four hundred people watching the light to see if he would.* — **Under the Floor** (2D fight, a Warden at the hatch).
- 8b: **NEW — the Deep Array (comic-book level).** Card: **UNDER THE FLOOR** / *Forty-three days after the furnace. Dace.* In: CUT, then PAGE. Trigger: Dace: "You want to see what they're counting?" Context: the Deep Array is named all through the game and never shown. Kael is still untrained (the Drill is two years off), so **no boots, no ELEVEN, no Assay moves**: a climb, a hide, a scramble; any fight is a brawl with a wrench. What he sees here (what the Array is, and why it is failing) is what Part Two is about. Build: **NEW** (`issue/`: a new level key, e.g. `array`; its own world in `world.js`, story in `story.js`; a long first stretch, as with every level).

**9. That night: the Dais, the Proctor, the boots**
- Card: **THAT NIGHT** / *Further in than it has gone before.* In: CUT. Trigger: the Array's hum still in his ears.
- 9a: **NIGHT THIRTY** / *The Assay. The night before day thirty-one.* (In: STRIP) — **the Dais** (2D level).
- 9b: **MORNING** / *The Assay. Day thirty-one. He has noticed the page.* — **the Proctor** (3D, Halden Voss), then **On the Ground** (2D): he cuts the boots off Voss.
- 9c: **NEW — the vent stack (comic-book level).** Card: **DAY THIRTY-ONE** / *The Assay. The island's vent stack.* In: PAGE. Trigger: the cut boots, dead in his hands. Context: this settles the boots. The Proctors' boots run off the island's vent stack. He climbs the stack with them, charges them at the top, and jumps. **He can fly from here on** (the Valley, the Keep). Build: **NEW** (`issue/`, key e.g. `stack`; vertical; the boots become live at the top).
- 9d: no card. CUT. Trigger: a white cloak over his arm. The Proctor's white cloak goes on Kael from here, and the cadets follow him into camp. Build: CHANGE (white cape from day 31: the Valley, the Last Night, the Keep).
- 9e: **THE LEDGER** / *Forty-three days after the furnace. The day ends.* In: WAKE. The hum slip: a book as wide as a table, a pen in his hand, gold on his cuff. Build: EXISTS.

**10. The Way Out**
- Card: **THE WAY OUT** / *One hundred and sixty days after the furnace.* In: WAKE.
- Context: four months on. He leaves Cinderwell; that is how the Gilding (half a year after) can happen.
- Plays: the months, Mara, **the Way Out** (2D, Proctor Sull and the night watch), Ilse.
- 10a: **THAT NIGHT** / *The last dream below. It runs to the end.* Trigger: the lift's light going up. Out: STRIP.
- 10b: **FOUR YEARS AFTER THE FURNACE** / *The Assay. Day forty.* — **the Valley** (3D; now with the boots and the white cloak). Build: CHANGE (moved from the cold open).
- 10c: **NIGHT FORTY-NINE** / *The Assay. The night before the last day.* — **the Last Night** (2D level).
- 10d: **MORNING** / *The Assay. The last day.* — **the Keep again, the same fight as the cold open.** This time ELEVEN lands: **Lucan's blade breaks and he goes to his knees in front of his mother.** He lives (he returns at +6). Out: ELEVEN, then black. Build: CHANGE.
- 10e: **END OF PART ONE** / *B E L O W*.

### PART TWO: ABOVE (the present moves up; all 3D, with 2D and 2.5D flashbacks)
Each chapter gets one flashback, each deeper than the last; the last chapter has none until the final blow.

**11. The Pinning**
- Cards: **PART TWO** / *A B O V E*, then **THE PINNING** / *Four years after the furnace. The last day, after the keep.* (moved: PART TWO now comes first).
- Context: the present jumps up to the Spire and stays there. Celestine pins the gold on him herself and knows him (from the Ledger, and the white room).
- Plays: **the Pinning** (3D). Then **THE SEAT KNIFE** / *Four years after the furnace. The night before the lift.* Build: CHANGE (order).

**12. The Post**
- Card: **THE POST** / *The Sun Spire. Four years and a season after the furnace.*
- Plays: the desk; **the Gallery** (3D, Severin Cade).
- 12a: **NEW flash (2.5D).** Card: **FOUR YEARS AFTER THE FURNACE** / *The Assay. The night of day thirty-one.* In: STRIP. Trigger: a porter steps aside for him without being asked. Context: why the Spire defers to a clerk: the white cloak, and forty cadets falling in behind him in camp. Build: **NEW** (walk mode in the camp at night; reuse the Circle's camp).

**13. The Balancing**
- Card: **THE BALANCING** / *Five years after the furnace.* Plays: Tier Four.
- 13a: **MEANWHILE** / *Cinderwell. Five years after the furnace. Tavi.* In: CHALK. Trigger: a chalk sun on a Spire wall. **The Sun** (2D; you play Tavi, twelve). Out: CHALK. Build: EXISTS (card CHANGE: was "BELOW").
- 13b: **RISER NINE** / *Five years after the furnace. The Assay valley, at night.* (PAGE) — **Riser Nine** (comic).
- 13c: **THE DOCKMASTER'S TABLE** / *Five years after the furnace. The High Docks.*

**14. What She Knows**
- Card: **WHAT SHE KNOWS** / *Six years after the furnace.* Plays: the hum; **the Son** (3D, Lucan; his mother has told him).
- 14a: **NEW flash (2D).** Card: **FIFTY YEARS BEFORE THE FURNACE** / *An Assay. Celestine Aurel, twenty.* In: FURNACE, cooled to grey. Trigger: Celestine's hand on a valve wheel she shouldn't know how to turn. Context: you play her, once, at her own Assay, so you understand her before you fight her. Build: **NEW**.
- 14b: **THE HIGH DOCKS** / *Seven years after the furnace. The second bell.* (PAGE) — **the High Docks** (comic). **One card only** (it shows twice now).

**15. Two Years**
- Card: **TWO YEARS** / *Seven to nine years after the furnace.*
- 15a: **THE DOCK STAIR** / *Seven years after the furnace. Brand.* — **the Dock Stair** (2D; you play Brand; eleven minutes; cannot be won). **One card only** (it shows twice now).
- 15b: **MEANWHILE** / *Six tiers down. Bay Three. A commitment.* In: CHALK. Trigger: Brand's halberd grounded. **Tier Six Stands** (2D; you play Mara).
- 15c: **NEW flash (2.5D).** Card: **THREE WEEKS BEFORE THE FURNACE** / *Bay Three. Seren, alone, after last bell.* In: FURNACE. Trigger: Kestrel lays her hand flat on a pipe the way Seren did. Context: **the biggest reveal in the game: Seren found the bleed first.** She asked Orin about the line weeks before Kael touched it. Build: **NEW** (walk mode in Bay Three; you play Seren tracing the line).
- 15d: **NEW (2.5D).** Card: **EIGHT YEARS AFTER THE FURNACE** / *A barge, in the weather.* — the barge deck. Build: **NEW** (one of the five approved 2.5D places).
- 15e: **THE NIGHT BEFORE** / *Nine years after the furnace. Four hundred hulls, in the weather.* — **the Fall** (3D).

**16. The Count (no flashes until the last blow)**
- Card: **THE COUNT** / *Nine years after the furnace. The Sun Spire.*
- 16a: **THE STAIR** / *Nine years after the furnace. Sunset.* (PAGE) — **the Stair** (comic).
- 16b: **Little Ember** (3D, Celestine Aurel).
- 16c: **the last flash.** Card: **LAST BELL** / *Bay Three. The heart-furnace.* In: ELEVEN. Trigger: the last blow. The furnace, the count reaching eleven, held. Out: WAKE. Build: **NEW** (reuses the furnace).
- 16d: **the ending, played** as a sequence of drawn pictures like the Table, not told. Build: **NEW** (`gild`-style comic sequence).
- 16e: **SOOTBORN** / *E V E R Y   B R E A T H   I S   H E R S* — **THE END** / *North Coast Studios × E Concepts*.

### Count after this plan
- Comic-book levels: 3 → 5 (the Deep Array, the vent stack).
- 2.5D places: 4 → 8 (the camp by day, Bay Three at last bell, the camp at night, Seren in Bay Three, the barge; the Spire's fourth ring is still on the list).
- Part Two flashbacks: 2 → 6.
- New cards: 0b, 5f, 6b, 8b, 9c, 10b, 10c, 12a, 14a, 15c, 15d, 16c.

---

## Part D. Story check (done; keep it true)
1. **Day one = Ashgate.** The owner wrote that the present should start "after he is officially gold"; this plan reads day one as Ashgate. **Confirm with the owner before building Part C.** If he meant the Gilding, the Assay becomes its own act and Part C changes.
2. **Lucan lives.** The Keep ends with his blade broken and him on his knees, not dead.
3. **The boots** come from Voss on day 31 and are charged at the vent stack; he flies from then on.
4. **Tavi is seven at the furnace** (twelve at +5, sixteen at +9). Fix the story bible, which says six.
5. **The Deep Array happens while Kael is untrained:** no Assay moves.
6. **One card each** for the High Docks and the Dock Stair; the PART TWO card before the Pinning.
7. Holds already: the furnace at zero; the four days below; the Gilding at half a year; training at two and two and a half; the Assay at four years; Celestine at Lift Zero setting up the Pinning; Brand dead at +7 and his halberd at +9; Seren and Orin and the bleed.

---

## Part E. Fix these first (bugs from the owner's play)
1. **The fire pit (7c).** The Circle's 2.5D scene ends, then the fight happens elsewhere. Keep the naming and the fight inside the 2.5D scene until the fight ends (walk mode with foes added when the choice is made). Test: `walk.mjs` M=circle, through the choice, to the end of the fight, without leaving the scene.
2. **Too floaty.** A man can be kept in the air without the boots. Add weight: stronger gravity on the way down, no re-launch of an airborne man unless the player has the boots on, a hard landing with a bounce and a pause on the ground. Look at launchers and `f.air` in `src/brawl.js` (the knockdown rules from v0.58 are the place). Test: `ff.mjs` with BOT=mash on the Drill, the Ford and the Keep; log time in the air per foe before and after.
3. **Deaths spin.** Heavy hits use the reaction `'spin'` (`src/brawl.js`, around lines 160 and 628), which reads as spinning on death. A death is a fall: knees, then forward or back, then still. Check the comic levels' death too (`die(` in `issue/`). Test: stills of a death in 2D, the arena and a comic level.
4. **The hook shot in the 3D arena fights** where it fits. `hookEra()` gives it only when `def.hook` or era ≥ 5. Turn it on for every arena fight from the Assay on, and make sure it reads: a line out, a pull, the man arriving. Test: the Ford, the Proctor, the Valley and the Keep, with the hook used on purpose.

---

## Part F. Build order
Release after each phase (Part A2, rule 6). Run the whole-story bot each time and check its card log against Part C.

1. **v0.66: the four bugs (Part E).**
2. **v0.67: the transitions** (B3: WAKE, FURNACE, STRIP's slide, CHALK, PAGE, ELEVEN) and **every card in Part C** (wording, order, the duplicate cards, PART TWO before the Pinning). No new scenes yet.
3. **v0.68: the opening:** the animated intro (0a), the Keep as the cold open (0b), the Valley moved to 10b, the Keep's ending (10d), the white cloak from day 31 (9d).
4. **v0.69: the two new 2.5D parts in Part One:** the camp by day (5f), Bay Three at last bell with the knife board (6b).
5. **v0.70: the vent stack** (9c, comic level). **v0.71: the Deep Array** (8b, comic level).
6. **v0.72: Part Two flashbacks:** the camp at night (12a), Celestine's Assay (14a), Seren in Bay Three (15c), the barge (15d).
7. **v0.73: the last flash and the played ending** (16c, 16d).
8. Then the open list as before: matching the writing (Part G), real animation once the owner attaches the free Quaternius "Universal Animation Library [Standard]" zip (CC0, it can't be downloaded from the workspace), the High Docks rebuilt, Part Two play, controls card.

---

## Part G. Matching the writing (from the master plan)
| The writing says | On screen now | Fix | Cost |
|---|---|---|---|
| Every valve hand carries a **seat knife**, counted back onto a board at last bell | Nobody carries one; no board | Knife on Crew Three's belts; the board in Bay Three; counting back (6b) | Low |
| Kael wears **the Proctor's white cloak** from day 31 | Violet cape to the end | White cape from 9d on | Very low |
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
- **Celestine Aurel:** High Auditor, seventy; the final fight; played once in 14a.
- **Lucan Aurel:** her son; kind; the Keep and the Son. Lives.
- **Dorian Aldane:** sixteen; shared bread; the Pairing. **Maren Aldane:** his sister; sold the hour of the raid.
- **Dace Morrow:** Seren's partner at work; under the floor; takes Kael to the Deep Array (8b).
- **Kestrel Dray:** an Accredited engineer who asks why; triggers 15c.
- **Oswin Hale, Petra Lune, Corin, Merrow, the Sisters Vey:** Assay cadets; met as people in 5f.
- **Halden Voss:** the Proctor whose boots Kael takes. **Proctor Sull:** the night watch below.
- Also: Ivo, Nell, Hollis, Inspector Vale, Ilse Marrin, Severin and Marshal Cade, Vant, Ansel Rook, Sable, Row K, the square.

---

## Part I. Waiting on the owner (defaults if no answer)
- **Day one** = Ashgate or the Gilding (Part D1). **Default: ask before Part C; do Part E meanwhile.**
- **A new name for the Assay** (candidates: the Proving, the Weighing, the Crucible, the Tithe, the Long Count, the Season of Knives). Default: keep "the Assay".
- **Names:** Kestrel Dray, Severin Cade. Default: keep.
- **Celestine knew him at the Pinning.** Default: yes (this plan builds on it).
- **The budget split** (30% animation, 25% matching the writing, 20% High Docks, 15% Part Two play, 10% controls). This plan comes before it.
- **"The expression"** in the intro art: read as the faces in the ring. Confirm.
- **The animation library zip** and **the owner's notes from playing to the Stair.**
