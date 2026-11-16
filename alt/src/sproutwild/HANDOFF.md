# Sproutwild handoff (2026-11-16, after v8.0)

Read this first in a new session. Details live in `CHANGELOG.md` (newest at top),
`DESIGN-v7.md` (research and system decisions) and `PLAYTEST-NOTES*.md`.

## Ground rules from Will
- Branch `claude/festive-knuth-f30w4u`. Commit locally; **push only when Will says "push"**
  (plain push, never force). 16 commits are unpushed as of v8.0.
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
  (111 checks; lab turns off scenes, the buddy cap, bugs and Louie's digging so results are steady).
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
- Louie's stray-fetch not re-checked after v7.8; real-time bug catch had one miss (stepped run 4/4).
- Garden has two growth looks (first seeds vs later patch sprouts); unify if Will notices.
- Night-only bugs, bug selling, and turning bugs into resources not tried in play.
- Balance needing a long session: crop timing, build time, catch odds after the first, starters.
- A second new area (Meadow's south end is a dead end); more Ohio lore (Haserot Angel, Franklin Castle...).
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
