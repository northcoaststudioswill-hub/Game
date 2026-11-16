# Sproutwild handoff (2026-11-16, after v8.0)

Read this first in a new session. Details live in `CHANGELOG.md` (newest at top),
`DESIGN-v7.md` (research and system decisions) and `PLAYTEST-NOTES*.md`.

## The story (Will, v9.0)
- BOTTIE is the villain: he nuked the DATA CENTER, the Sproutwild simulation glitched and the Great Lantern cracked.
- KING BIBI is the king: when the light went out he raised the IRON DOME ("temporarily") and shut the roads.
- In the dark the buddies went wild. Sprouts carry the light that calms them and restores order.
- Goal: bring the light back, restore order among the buddies, win four Sigils to restore order in the kingdom;
  then the King drops the dome and the Peak road opens to Bottie. Tone: warm Erin, Marcus "bro", Bottie "bzzt, clank, gang".

## Ground rules from Will
- Branch for v8.1: `claude/sproutwild-v8.1`, made from `main` (earlier rounds used `claude/festive-knuth-f30w4u`).
  Commit locally; **push only when Will says "push"** (plain push, never force). Merge to main only when asked.
- No PRs unless asked. Never delete or overwrite `backups/` or older version folders.
- Do not touch `docs/index.html` (public Pages, still the 4-cart build) without his go-ahead.
- The playable build is published at https://claude.ai/artifact/KqmxEmur2YMFoFLYjp7MNx
  (republish the same file path to keep the URL).
- No model names in commits or files. Will plays on iPhone; nothing is "phone-confirmed" until he does.

## Build and test
- Source: `alt/src/sproutwild/*.js` spliced into `alt/src/console.js` scope by `alt/build.py`
  (order listed in `SPROUTWILD=[...]`; later files override earlier functions by redeclaring them;
  `const` names must be unique). Output: `alt/games/pocket-lantern-alt.html` (~14.5 MB, limit 16).
- `python3 alt/build.py` then `node alt/tests/sproutwild/field-lab.js alt/games/pocket-lantern-alt.html`
  (119 checks; lab turns off scenes, the buddy cap, bugs and Louie's digging so results are steady).
- Test hooks: `window.__g.SWF()` (state, meta, enter, travel, setPos, pos, near, fld, bf, wilds,
  bugs, plots, cast, walk, lst, scene, noScenes, noCap, noBugs, ...).
- Real-time playtests: Playwright scripts in the session scratchpad (`play31.js` = title to first
  catch). Phone-shaped viewport 430x932; wait ~4.4 s after picking the cart before pressing keys.

## How the game flows now (v8.0)
1. Title, file select, six intro slides.
2. Sunkeep dark. Louie carries a berry to the Great Lantern; it flickers and drops 3 seeds into the
   garden plots; they visibly grow (seed, shoot, sprout); you pluck them. (`sw-open2.js`)
3. Throw sprouts at berries; they carry them to the Lantern; it wakes (wake scene).
4. Three starters walk in: CUYAPUP / BESSLING / GRASSKIN (Ohio lore; reveal sequence; evolve at Lv16).
5. How-it-works card (2 pages), buddy-sending lesson, then Erin walks you to the south road.
6. Meadow: Erin walks you to a calm Lv2 wild; first catch always blooms; no battles before it.
   Then she shows the PEB sprout, the boulder wall, the bridge, bugs. (`sw-open2.js` overrides `sw-walk.js`)
7. Home: build lesson, cottage (buddies only work with a roof), cottage party cinematic
   (`g4dab`, fighter cut-in style), garden plot lesson (plots grow sprouts, berries or fiber).
8. Mid-game: kiln (ore from field veins) -> ingots -> Data Center (needed for more than 3 buddies).
   Crooked Hollow (east of Meadow, opens after first catch; Melonkin, Pythorn alpha), Lantern Town gym.

## Systems by file
- `sw-starters.js` starters, reveal, Data Center, evolutions, how-it-works card
- `sw-plots.js` garden plot crops; `sw-hollow.js` Crooked Hollow; `sw-louie.js` Louie (Sprouts-style)
- `sw-bugs.js` 8 Ohio bugs + Bug Jar (START menu; A converts, SELECT sells to Pip in town)
- `sw-scene.js` scenes, arrow, cottage cinematic, Marcus lines; `sw-open2.js` v8.0 opening and walks
- Live pause menu is in `sw-save.js` (not sw-module.js).

## Open items / ideas not done
- v8.2 confirmed the garden look in play, played night bugs and selling to Pip, and fixed the lab flake.
- Real-time bug catch had one miss in v7.9; a nearby wild buddy takes the aim (ring shows it).
- Balance needing a long session: crop timing, build time, catch odds after the first, starters.
- More areas and Ohio lore (Haserot Angel, Franklin Castle...).
- Narrow-path crowding mostly addressed (buddies trail in a line), not confirmed on phone.

## Will's taste (learned over the sessions; keep doing this)
- Playtest like a first-time player, from the title, phone-shaped screen, before calling anything done.
  Look at the screenshots; say plainly what was and was not checked.
- One voice at a time. Never stack messages; never a wall of text. Hand-holding beats explaining:
  characters walk you to things and let you do them.
- Explain slowly; nothing should flash by. Captions advance on A.
- Marcus: "bro", "See one, send one", "That's my guy", "Dap me up", Waterworks dreams, takes credit
  ("I supervise"). Erin: warm guide. Louie: a dog, short caps barks, like the Sprouts cartridge.
- Big moments get cinematics in the fighter's style (cut-in on a slanted band, speed lines, slammed text).
- Creatures and bugs come from north-east Ohio lore (Cuyahoga fire, South Bay Bessie, Grassman,
  Melon Heads, Peninsula Python, Woollybear, Lake Erie mayflies...).
- Inspirations: Pikmin (sprouts carry), Palworld (buddies work the base), Pokemon (catch, battle),
  simple mobile base management (short timers, real choices like plot space).
- Prefers working builds he can play at the artifact link after each round, plus a changelog entry
  and screenshots for the dev board team.

## Architecture details (for whoever edits the code next)

### How the code fits together
- Everything runs in ONE scope: `console.js` (the Pocket Lantern shell) with all `sw-*.js` files spliced
  in by `alt/build.py` ahead of the module's `DISPATCH + TEST HOOKS` marker. A function declared in a
  later file replaces the earlier one everywhere (function declarations hoist; last one wins). `const`
  and `let` names must be unique across all files, or the page fails to load.
- Build order (see `SPROUTWILD=[...]` in `alt/build.py`): sw-cartart, sw-module, sw-field, sw-front,
  sw-base, sw-art, sw-story, sw-battle, sw-save, sw-text, sw-cast, sw-party, sw-scene, sw-starters,
  sw-plots, sw-hollow, sw-squire, sw-louie, sw-bugs, sw-walk, sw-open2, sw-meadow2, sw-pace, sw-sigil, sw-lore.
- Several functions exist in more than one file on purpose (the later one is live). Known pairs:
  `swPauseUpdate/drawPause` (live: sw-save.js), `cotUpdate/drawCot` (live: sw-story.js),
  `wQuestText` (two copies in sw-story.js; the second is live), `wBaseArrive`, `scIntro`, `scWake`,
  `ewTick/ewTarget/ewDraw`, `fBudDraw`, `wNearExtra`, `swSay` (live: sw-open2.js), `wLouTick/fLouTick/
  fLouDraw` (live: sw-louie.js), `choiceUpdate/drawChoice` (live: sw-starters.js), `wBuildDef/wPlotCount`
  (live: sw-plots.js). When an edit "does nothing", grep for a second definition first.
- Patching style used so far: small Python scripts doing exact string replacement with an assert
  that the old text occurs exactly once, then rebuild and run the lab. Do not use sed for multi-part
  edits. Careful when replacing the `const SWF={` hook line: keep every existing hook.

### Key state
- `state` strings: `g4title g4intro g4world g4battle g4engage g4cine g4pause g4party g4dex g4build g4place
  g4map g4base g4keeper g4guide g4cot g4nur g4tools g4assign g4jobs g4lamp g4gym g4confirm g4ask g4plot
  g4dab g4loop g4jar g4kind g4choice g4bottie`.
- `SW` is the save (localStorage key `sproutwild-v1`, `-s2`, `-s3` for files 2 and 3). Notable fields:
  quest (0..5; 2 = has first buddy, 3 = first catch done, 5 = cottage+crop done), seeds, louFed, lit,
  buds{EMBER,PEB,DEW,ZIP,LEAF,LUCKY}, party[], box[], buildings[], res{wood,stone,petal,berry,ingot,
  fiber,ore}, hearts, light, plotCrop{plotIndex:'berry'|'fiber'}, bugs{}, bugSeen{}, kinds{}, lessons{},
  beats{}, walk2 (Meadow walk stage 0..10), bwalk (base escort 0..2), keeper, day, baseLv.
- `W4` is runtime only (not saved): fld (field area), bf (base field), scene, cast, wk (home workers),
  patchBuds (garden), wilds, bugs, ew (Erin in the Meadow), lst (Louie state), cons (buildings going up).
- Opening stage `wOp()`: 0 seeds left to pluck, 1 berries to deliver, 2 Lantern lit/choose a starter,
  3 done. Goal line text comes from `wQuestText()`, Louie's hint target from `wNextGoal()`.

### Systems and their numbers (so balance changes start from facts)
- Catch: wild needs `level + 1` sprout points (kin sprouts count 2, a buddy next to it adds 1).
  First catch always blooms. Wild level grows with distance from the area's Lantern post.
- Buddy cap: 3 total (party + box) until a Data Center (8 stone, 2 ingots) raises it to 15.
- Building time: about 9 s + 0.45 s per unit of cost, faster with helpers nearby.
- Base trees regrow after 75 s, rocks after 90 s. Kiln: 1 ore -> 1 ingot (2 with a skilled worker).
- Plots: berries ripen in 60 s, fiber in 90 s (faster with WATERING or PLANTING buddies at home).
- Lantern: every 4 deliveries grows a sprout. Lightning bugs add light.
- Starters: CUYAPUP 34hp/14atk, BESSLING 38/14 (was 12), GRASSKIN 40/14; evolve at Lv16. First gym (Ranger, Lantern
  Town) is MELONKIN Lv5 + FERNFANG Lv5 since v8.7 (was Lv7/8); the team shares 60% XP. Python alpha Lv11.

### Tests and playtests
- `alt/tests/sproutwild/field-lab.js` steps the real game with `G.update(1/30)` in headless Chromium.
  At the top it calls `noScenes(true)`, `noCap(true)`, `noBugs(true)` and sets Louie's dig timer huge,
  because scenes, the buddy cap, bugs and Louie's dug berries all change what A aims at. Individual
  checks switch them back on when they test them.
- If a menu row is added to the pause menu, the save/quit tests count rows with `tap('down')` and must
  be updated (they use 8 downs as of v7.9).
- Flaky failures so far always came from something random taking the aim (a bug, a dug berry, an
  island treasure) or from a fight helper picking a non-damaging move. Run the lab 2 to 4 times.
- Real-time playtest pattern (scripts lived in the session scratchpad and are gone; rebuild as needed):
  open the built file in Playwright at 430x932, `dispatchEvent(new PointerEvent('pointerdown'))` on
  `.cart[data-i="4"]`, wait about 4.4 s, then press keys by setting `window.__g.keys[k]=1` for ~70 ms.
  Screenshot `#screen`. Use `window.__g.SWF()` hooks to read state, find targets and setPos.
- Publishing: the Artifact tool, file `/home/user/Game/alt/games/pocket-lantern-alt.html`, url
  https://claude.ai/artifact/KqmxEmur2YMFoFLYjp7MNx. The build is about 14.5 MB of the 16 MB limit.

### Timeline (short)
- v5.x to v6.x (2026-11-14/15): Sproutwild rebuilt as a fifth cartridge in the fighter console (`alt/`),
  field engine, base, party, open-field capture, then many onboarding passes.
- v6.6: tools removed, Meadow home gate moved north. v6.8: cottage gives buddies a roof.
- v7.0: Ohio starters, reveal, Data Center, garden plot crops, Crooked Hollow. v7.1: cottage cinematic.
- v7.2 to v7.7: evolutions, how-it-works card, base goals, regrowth, SELECT battles, goal hints.
- v7.8: Louie like Sprouts. v7.9: bugs and jar, Erin's Meadow walk, kind cards.
- v8.0: earned opening (Louie's berry, seeds grow in the garden), Erin escort, guided first catch.
- v8.1: Louie fetches lost sprouts (timing, sprouts stuck on walls), one growing look for garden and seeds,
  "FOUND ONE!" bubble stays on screen.
- v9.0: the story reworked to Will's lore (Bottie the villain, Bibi the king behind his dome) across the intro,
  scenes, Bottie, the King's fight, his guards and the guide.
- v8.9: sw-lore.js (8-slide intro, Elder and Erin/Marcus scenes about KING BIBI), full-garden hint, scenes no
  longer wait behind chatter, gym scene anywhere after the crop.
- v8.8: first Sigil cinematic (sw-sigil.js, state g4sigil), Ranger's roads-open line, rest/travel split at posts,
  autopilot trains (SELECT + rest) and plays cottage -> Sigil in ~4 min.
- v8.7: gym guidance (scGymCheck, wGymGoal), first gym rebalanced, XP share, crop/buddies missions fixed,
  pluck grown garden sprouts. Autopilot `fromCottage` start.
- v8.6: Erin's hands-on beats after the Meadow tour (SW.walk3: chop, carry, ladybug), tile pathing (ewGo).
- v8.5: sw-pace.js (message queue; scenes, cards, dialogue and bubbles wait their turn), Ranger's barrier until the
  first Sigil, Lower Meadow (sw-meadow2.js), one garden from the start. Autopilot playtest: `alt/tests/sproutwild/autopilot.js`.
- v8.4: Lanternwisp caught by hand, jar use played, one wild name tag at a time, Louie points south.
- v8.3: Squire's Woods south of the Meadow (`sw-squire.js`), LANTERNWISP and STONESQUIRE.
- v8.2: garden look confirmed, visible seed, night bugs and Pip played, jar shows results, lab flake fixed.
- Playtest tip: build with `?dev` in the URL and `window.__g.ev(code)` runs code inside the game scope
  (read W4, wrap functions, set dayT for night). Wait 4.4 s after picking the cart before driving it.
