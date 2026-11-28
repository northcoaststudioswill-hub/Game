# SOOTBORN Dev Suite

A dev machine for the game, published as a claude.ai artifact. It runs the real game build, jumps anywhere in it,
shows the characters, their animations and bones, the comic levels' props and collision, and lets the owner change
them. Every change is an **override** kept in the artifact's shared database, so Claude can read it and bake it
into the source.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The suite page (artifact page content: no doctype/html/head/body). |
| `game.html` | A copy of the game build (`sootborn/index.html`), published beside the page as a supporting file. Generated; do not edit. |
| `build.mjs` | Copies `../index.html` to `game.html`. `sootborn/build.mjs` runs it at the end of every game build. |
| `README.md` | This. |

No game source was changed for the suite. The only change outside this folder is two lines at the end of
`sootborn/build.mjs` that run `devsuite/build.mjs`.

## Publishing (the lead)

1. `node build.mjs` in `sootborn/` (it refreshes `devsuite/game.html`).
2. Publish `devsuite/index.html` with `files: { "game.html": "devsuite/game.html" }` and
   `capabilities: { db: {}, user: {} }`. Republish to the same URL after every game build: open viewers reload
   and get the new build. The header shows the build's `GAME_VER`.

Size: the page is about 150 KB; `game.html` about 2.5 MB.

## How it works

- **Game frame.** The suite fetches `game.html` and runs it in a same-origin `srcdoc` iframe. Two small scripts are
  added to that copy (never to the source): one at the top that forwards errors and `console.error/warn` to the
  suite log (and, if "Skip opening films" is on, sets `#noff`), and one at the end that hands the game's top-level
  names to the suite (`CAST`, `MAPS`, `NPCS`, `FF`, `Brawl`, `Issue`, `Settings`, `GAME_VER`, … — top-level `const`s
  are not `window` properties, so a script inside the document reads them). The suite wraps the game's global
  `step()` for pause, frame step, time scale and god mode.
- **Comic-level frames.** The game makes a nested iframe for a comic level from `window.ISSUE_HTML.docks`. The suite
  adds three things to that string once per load: an error forwarder, one export after
  `const S = SC.story = …` (`SC.__dev = { S, CROSS, ENC }`, so suns and encounters can be drawn), and a script after
  the engine and before its boot that calls the suite. From there the suite: puts rig overrides into `SC.SPECS`
  before any model is built; wraps `G.Batch.prototype.add/build`, `W.solids.push` and `W.build` to index every prop
  (below); and wraps `G.render` for overlays, the dev camera, time scale and god mode.
- **Character preview.** A second comic-engine frame with its boot switched off. The suite calls the engine's own
  `G.init`, `SC.makeHumanoid` and `SC.pose.*` to draw one person on a turntable, with the skeleton drawn over it.
  The 2D cast is drawn with the game's own `makeChar` / `makeAccredited` / `makeCadet` (via `World.sheetFor`).

### How props are found again (comic levels)

Most of a comic level is merged into a handful of batched meshes, so a "prop" is not an object. While `W.build`
runs, every `Batch.add` and every solid is recorded with the call stack. One **call statement** in the level
builder (`DOCKS_A`, `DOCKS_B`, `RISER`, `STAIR`, `GILD`, `STACK`, `ARRAY`) is one *site*; inside a site, pieces whose
boxes touch are one prop. So `car(-15, 9.6, true, 0x9c2f3f)` is one prop (its picture and its solid together), and
a `forEach` that places ten bollards is ten props.

- **Key:** `<FN>.<site order within FN>.<cluster order within site>`, e.g. `DOCKS_A.37.0`. Deterministic for a
  given build.
- **Signature:** `<helper>@<x>,<y>,<z>#<pieces>/<solids>`, e.g. `crateStatic@2.7,0,39.4#2/1`. If the build changes
  and the key no longer matches, the suite looks the prop up by signature instead (and marks the override "not
  found in this build" if neither works).
- **Collision:** solids made in the same call as the picture (`B()`, `car()`, `building()`, `crateStatic()`, …) are
  tied to the prop and move, turn and scale with it ("move its collision with it", on by default). Turned solids
  stay axis-aligned boxes (the box around the turned shape); ramps turn in quarter turns.
- Loose objects the builder adds to the scene (signs, lamp cones, crates, doors) are listed as `obj.<type>.<n>`;
  crates and doors carry their solid.

## Sync

- **App → Claude:** each edit writes one document to the artifact's shared db; open viewers re-apply it live
  (`onSnapshot`), and it is applied again on every game load and every comic-level start.
- **Claude → app:** Claude rebuilds and republishes; viewers reload.
- **No db** (opened locally, signed out, or not granted): the suite works the same in memory, the header says
  "Not syncing — changes stay in this tab", and Overrides → Export / Import moves the overrides as JSON text.

### db layout

`overrides/<id>` — one document per override:

```
{ kind: 'cast' | 'spec' | 'prop' | 'map',
  target,            // what it changes: cast id, rig kind, prop key, or map id
  level,             // comic level key for spec and prop, else null
  key,               // cast id | rig kind | prop key | 'prop.<i>' 'npc.<j>' 'hot.<i>' 'light.<i>'
  patch: { … },      // the change (below)
  label,             // human words for the list
  updatedAt, by,     // ms since epoch; the editor's user id (opaque; never shown)
  ref: { … } }       // where it lives in the source (below)
```

| kind | id | patch | ref |
| --- | --- | --- | --- |
| `cast` | `cast__<castId>` | look fields to set (`null` removes one), e.g. `{ shirt: '#1565c0' }` | `{ file }` |
| `spec` | `spec__<level>__<kind>` | deep patch of `SC.SPECS[kind]` as dressed for that level: `h`, `b`, `face`, `hair`, `hat`, `helm`, `weapon`, part flags, `pal.<slot>` and `kit.<slot>` (colours are numbers `0xRRGGBB`); `null` removes a key | `{ file: 'issue/rig.js', level }` |
| `prop` | `prop__<level>__<key>` | `{ dx, dy, dz, ry (radians), s (scale), hidden, moveSolids }`, applied about the prop's pivot (centre of its footprint, at its lowest point) | `{ sig, src (the call text), fn, line (of the built issue.html), pivot, now, solids }` |
| `map` | `map__<mapId>__<objKey>` | prop `{ x, y }` (tiles); person `{ at: [x, y] }`; hotspot `{ dx, dy }`; light `{ x, y }` (pixels) | `{ map, t, i, name, from }` |

`notes/<auto id>` — `{ text, at, by, done, game }`: free text the owner leaves for Claude.

`meta/suite` — `{ bakedVersion, bakedAt }`: Claude writes it after baking; the Overrides panel shows it.

## Baking overrides into the source (Claude)

1. Read them: `ArtifactData` list `overrides` (and `notes`) on the suite's URL.
2. Change the source, per kind:
   - **cast** — the look in `CAST.<id>.look()` (`src/story.js`, or the file that adds that id to `CAST`:
     `src/assay.js`, `src/day2.js`, `src/rowk.js`, …). `cast__kael` is `KAEL_LOOK` in `src/story.js`.
   - **spec** — `issue/rig.js`: the base `SPECS` table, or the `if (SC.issue === '<level>')` block when the person is
     re-dressed there (the patch is per level on purpose: `boss` is Rook at the docks and the Auditor's Blade on the
     stair).
   - **prop** — find the call in `issue/world.js` by `ref.src` (the call text) inside `ref.fn`. Add `dx/dz/dy` to its
     position arguments (turn and scale where the helper takes them; otherwise wrap it). `hidden: true` means remove
     the call. If `moveSolids` is false the owner wanted the picture moved but not the collision: split the solid out.
   - **map** — the map def in `src/content.js` / `src/assay.js` / `src/rowk.js` (`props[i].x/y`, the prop's `block`,
     the matching `hot` tiles), `NPCS[j].at` in `src/story.js`, `lights[i]`.
3. Rebuild, test, publish the game and the suite (same URL).
4. Clear what was baked (`ArtifactData` batch delete of those `overrides/<id>`), mark or delete handled notes, and
   set `meta/suite` to `{ bakedVersion: GAME_VER, bakedAt: Date.now() }`.

Clear only what was baked: an override written after the read stays.

## Panels

- **Play** — the build's own Dev menu lists (read live from `Menus.checkpoints()`), every `FF` fight by key
  (`Cutscene → Brawl.start`), the six comic levels and the Stair's cold open; difficulty, skip intro films, full
  fury, `#noff`; pause, frame step, time scale, god mode, back to title; the event and error log (game, comic level,
  preview, suite).
- **Characters** — the comic rig per level (`SC.SPECS`: height, build, face, hair, hat, helm, weapon, parts, `pal`,
  `kit`) on a turntable, and the cast (`CAST` looks: colours, sash, style, extras, flags) as their 2D sprite sheet and
  bust, with a button to see the look as the 3D arena fight model (training room).
- **Animations** — every `SC.pose.*` (loops, cycles, strikes, held poses) on the preview, with play, speed, time
  scrub and frame step; the 2D sprite cycles; the arena fight states from `src/g3.js`, held on the live fight's player.
- **Bones** — the procedural humanoid's 24 bones as a tree and drawn over the preview; a picked joint shows its local
  position and rotation and its world position; "pose by hand" sets joints with sliders. For the cast: the g3 fight
  rig's joint angles.
- **Areas** — for a running comic level: a scene browser (by builder function, then helper), pick and drag in the
  view (snap 0.1–1 m), numeric fields and nudges, hide, collision that follows; overlays for solids, camera-only
  boxes, invisible walls, interact spots, suns, encounter arenas and spawns, waypoint links, enemy paths; an orbit or
  fly dev camera. For the 2D maps: the tile map with props, people, hotspots and lights to drag.
- **Inspector** — `G` (mode, map, day, scrip, flags), the fight (phase, player and foe HP), the comic level (state,
  checkpoint with teleport, encounter, player, enemies, flags `F`), with editable values and flags.
- **Overrides** — every override with who and when, revert one or all, export and import JSON, and notes to Claude.

## Testing it locally

Serve the folder (`python3 -m http.server` in `devsuite/`) so `fetch('game.html')` works; the page content needs a
document skeleton around it when opened outside the platform. `window.claude` does not exist locally, so the suite runs
in its "Not syncing" mode; to test the synced path, inject a fake `window.claude.use('db' | 'user')` from the test
(never from the page).

## Known limits

- Rig edits show at once on the preview; in a running level the player and enemy models of that kind are rebuilt in
  place, which keeps their pose but not every effect state (glow colour is kept). Restarting the level always applies
  them fully.
- Prop turns: collision stays axis-aligned; ramps turn in quarter turns only.
- The 2.5D walk places (Brawl walk mode) are not editable in Areas yet; their people are, as cast looks.
- Arena fight states are played on the live fight's player (the game is held paused), not on the preview.
