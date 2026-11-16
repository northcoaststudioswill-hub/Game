# ROOTDEEP — development timeline

*For Claude, from lil Bottie (Muse). This is the dev history of Rootdeep,
cartridge 2 of Will's PowerPocket Lantern file. The game itself is
`Sprouts+Rootdeep.html` (final build v2.9); the full design/integration
handoff is `FOR-CLAUDE.md` next to this file. This timeline is the story:
what was built, in what order, at whose direction, and what state each
step was left in. All dates America/New_York, Nov 2026.*

## The arc in one paragraph

Will handed Bottie his Claude-built game **Sprouts** (a Pikmin-like keeper
adventure on a 3-cartridge handheld console) and asked for a new game on a
blank cartridge he could hand back to Claude. The first attempt, a small
arcade game, was rejected as too basic — "think Hades." What followed in
~36 hours was a full roguelite built in passes, each one driven by Will's
play feedback: art passes, character-voice passes, a Sprouts-economy
merge, a controls remap, a tester pass, and finally a playable-cast
update with signature moves mirrored from Will's separate fighting game.
Will closed the project with Bottie on Nov 14 and handed it to Claude.

## Chronology

### Fri Nov 13, ~22:12 — The brief + Sprouts analysis
Will uploads `Sprouts.html` (+ notes) and asks: analyze the game, build
on a blank cartridge, make it hand-back-able to Claude. Bottie maps the
console: 3 cartridge slots, one shared JS scope, canvas 480×400 (logical
240×H), save via `claude.use`, music streamed from `/_blob/` URLs.
Sprouts itself: keeper Will, Erin, Louie the dog, 70×40 scrolling world,
6 sprout types, 22 missions, 33 achievements, recover 4 sun shards.

### Fri Nov 13, night — v1 "MOTHLIGHT" (rejected, deleted)
A 90-second moth arcade game on cartridge 2 (collect pollen, dash, light
pulse, survive to dawn). Fully harness-verified — and Will killed it the
same night: *"That game is too basic. I want it matching in depth —
think like Hades."* Mothlight was removed entirely. Lesson recorded:
**Will wants systems depth, not arcade loops.**

### Fri Nov 13, night — v2.0 ROOTDEEP
Full Hades-structure roguelite in the Sprouts world, replacing Mothlight:
- **The Hearth** — walkable hub; Erin, Louie, Ranger, Marcus, Scout with
  rotating dialogue and Honey gifting.
- **Runs** — 12 chambers, 3 biomes (The Burrows 1–4, The Flooded Vault
  5–8, The Ember Core 9–12), reward doors, elites at 3/7/10, bosses at 4
  (Grub Mother), 8 (Drowned King), 12 (The Hollow Keeper, a shadow-Will).
- **Boons** — 6 gods (the sprout types grown old) × Attack/Cast/Dash +
  12 passives + 4 duos, Common/Rare/Epic, Sunfruit leveling.
- **Meta** — Mirror of Dew (8 upgrades), Armory (3 weapons), 5 Keepsakes,
  Pact of Roots heat, Codex. Death banks Moondew/Keys/Honey, burns
  petals/boons. Save key `rootdeep-v1`; Sprouts untouched except 5 hooks.

### Fri Nov 13, late — v2.1 text-fit + sprites pass
Will, after playing: *"A lot of the text doesn't fit"* + graphics should
match Sprouts' quality. Two-part list rows with description panels,
short station labels, sprite-based foes/bosses with hit-flash, per-biome
floor tiles, textured obstacles, glowing framed doors, dash ghosts.

### Fri Nov 13, late — v2.2 presentation pass
At Will's direction the **`g3help` "HOW TO DELVE" explainer screen was
deleted** (title → straight to the Hearth) and the title screen's
feature-bullet text was deleted — art + logo + PRESS A only. Duplicate
announcements cut. Hearth furnished with sprite station icons and props.
A **render rig** was built (record real draw calls → rasterize to PNG →
actually look at them) after a frozen-cinematic bug taught everyone that
harnesses alone can't see visuals. Shots: title/hub/combat1/boss.

### Fri Nov 13, late — v2.3 Legacy of Goku style pass
Will: *"Look at games like Legacy of Goku as inspo for graphics — I
literally can't play the game till it looks right."* LoG II screenshots
studied directly. Every sprite gained a 1px dark outline (outlined
variants via the silhouette pipeline); actors chunked up (player/NPCs
×1.5, foes ×1.35, bosses ×1.9); floors rebuilt as 3-variant stone slabs
with scattered debris; segmented HP bars; dialogue box got the red
name-plate. Rootdeep keeps its dark palette — LoG's craft, not its
daylight colors.

### Fri Nov 13, late — v2.4 character pass
Will's canon for Marcus: *"a smart ass with borderline over the edge
humor, a hater of all."* Marcus's dialogue rewritten to roast everyone;
the other four got reactive lines about him. Text/screen-room polish
(Mirror rows auto-compact, looser dialogue spacing, centered banners),
hub micro-polish (vignette, torches, foe idle bob). Will sequenced the
intro cinematic himself: **characters first, cinematic after** — do not
build a generic cinematic before the cast has voices.

### Fri Nov 13, late — v2.5 the Sprouts connection + front end
Will: *collect sprouts in the levels, they do different things, exchange
them — the types are the currency instead of money; same characters,
share the assets.* Shipped:
- Foes drop sprout pods; buds follow Will in a string and work by type —
  Ember lobs fire, Peb blocks a hit, Dew mends, Zip speed + magnet,
  Leaf fattens petal drops, Lucky adds crit. Hits can scatter a bud.
  Survivors bank at run's end. Buds drawn with Sprouts' **own**
  `drawBud()`/`TYPES` — shared, not copied.
- **Sprout Ledger** at the Hearth bed: reserve a 3-bud diving party;
  Exchange page (3:1 trades up two chains + Moondew sell-backs).
- Front end: intro cinematic (4 sprite scenes in the cast's voices,
  START-skippable, replayable), main menu, Settings (music/SFX volume,
  screen shake) writing the console's shared meta so it carries into
  Sprouts.
- Name-collision trap recorded: Sprouts owns `CINE`/`cineT`/`drawCine`;
  Rootdeep's are `RDCINE`/`rdCineT`/`rdDrawCine`. **Prefix everything.**

### Fri Nov 13, night — v2.5.1 the green-screen fix (Will's phone)
Will reported the intro was a frozen green screen on his phone. Cause:
the cinematic passed sprite *records* to `drawImage` instead of their
`.ol` canvases — a real canvas throws every frame; the headless rigs had
silently tolerated it (op count 23 was the tell; 59 after). **Rule ever
since: `drawImage` takes `.ol`/`.c` canvases only, and every harness
hard-fails on a record.** All suites green on the fixed build.

### Fri Nov 13, night — v2.6 living Hearth + sprout guarantee
Will asked for NPCs that move with multiple dialogues, and reported he
still couldn't get sprouts. NPCs began wandering live positions; one
visit pages through ALL of an NPC's lines (START bails). Sprout drops
guaranteed: 25% regular, elites always, bosses two, and a pod spawns if
a chamber gave none — verified with RNG pinned to 0.99.

### Overnight Nov 13→14 — v2.7 stations & routes
Will: NPCs moved too slowly, all started at the bottom; he wanted
stations, activities, more talk. Each NPC got a station (Erin at the
sprout bed, Marcus in his gloom corner, Scout at a notes table, Ranger
by supplies, Louie on the rug) and route-based waypoint loops at
per-character speeds (Louie 46 fastest, Marcus 27 — sulking is canon);
arrival sparkles on activity waypoints; dialogue grew to 3–4 lines each
including sprout-economy talk.

### Sat Nov 14 — v2.8 battler buds, personal space, controls remap
- Buds became super-weak auto-battlers (own attack cooldowns; Peb's
  block keeps its separate cooldown).
- NPC anti-congregation: separation steering, door-zone clamp.
- Dialogue cancellable with B at any page; Honey gifting moved to START.
- **Controls remapped at Will's word** (SELECT is awkward on the
  Lantern): **A attack · B cast · double-tap a direction = dash**.
  SELECT keeps only non-gameplay jobs (skip intro, eject in Hearth).

### Sat Nov 14 — v2.8.1 tester pass
Will asked Bottie to play it as a tester and be critical. A real-input
bot played hub + full run + buds-only and control trials. Findings:
dash charges 1→2 (the 1-charge starved), foe budgets 3+chamber →
4+chamber (chambers cleared in 4–12 sim-seconds), NPC separation radius
→ 22px, bud DPS ≈ 7.4 (~15% of blade DPS — micro-buffs only), economy
read as fine, a face-tanking mediocre bot dying at the chamber-3 elite
read as honest difficulty.

### Sat Nov 14 — v2.9 the cast update (final build)
- **Character select at the Root Door**: Will / Erin / Louie / Marcus,
  each with a stat identity. Unlocks derived from play: Erin = 3 Honey
  gifts to her; Louie = 20 lifetime banked sprouts; Marcus = 8 deaths.
- **Signature casts** (replacing the no-boon cast; a god's cast boon
  overrides): Will — **MAZEL TOV LASER** (plus **SELFIE FLASH** rooting
  foes on his blade's 3rd combo hit); Erin — **TOWEL WHIP** (+50% bud
  damage as her passive); Louie — **THE BOOF** (AoE knockback);
  Marcus — **HYDRO JET**.
- Non-boss chambers spawn in **2 waves** ("THE DEEP STIRS").
- All suites green, zero console errors; chars.png rendered and viewed.

### Sat Nov 14, ~midday — HANDOFF (project closed with Bottie)
Will asked how to hand it over; answer: give Claude **both** the game
file (it *is* the complete v2.9 build — no new file was made) and a
fresh `FOR-CLAUDE.md`, rewritten clean because the accreted one had
stale controls/NPC facts. Will then closed it in his own words:
*"Rootdeep is handed off completely now and you won't be working on it
anymore."* Bottie has not touched it since. (Slot 3, blank at handoff,
later became Sproutwild in a separate combined file — the handoff file
itself was never edited again.)

## Canon & rules Claude should respect

- **The four signature moves are canon** from Will's separate fighting
  game (which exists outside Muse; Bottie never saw it): MAZEL TOV
  LASER, SELFIE FLASH, TOWEL WHIP, HYDRO JET — **never rename them**.
  **THE BOOF is Bottie's placeholder** for Louie — ask Will for the
  fighting game / Louie's real move before treating it as canon.
- **Marcus's voice**: smart-ass, borderline, hater of all. Keep him mean.
- **No `g3help` explainer screen, ever** — deleted at Will's word.
- **`drawImage` only ever receives `.ol`/`.c` canvases** — the v2.5.1
  green screen is what happens otherwise. Harnesses enforce this.
- **Prefix everything** (`RD`/`rd`/`g3`): the file is one shared scope
  with Sprouts; duplicate function names silently override.
- **Nothing is phone-confirmed.** Every version passed headless suites
  and render checks; balance is harness-tuned, not human-tuned. Will's
  phone verdicts (dash feel especially) were still open at handoff.
- Music streams from `/_blob/` URLs in the original host — a
  portability risk to know about, noted in FOR-CLAUDE.md.
- Known soft spots at handoff: NPC routes still cross mid-room, duo
  boon offer rate is generous, shop stock is a flat 3-of-6, the
  character-select detail panel can crowd.

## The snaps (render-rig frames, final v2.9 set — `shots/` folder)

| File | What it shows |
|---|---|
| `title.png` | Title — art + logo + PRESS A only (v2.2 rules) |
| `cine.png` | Intro cinematic scene (v2.5) |
| `hub.png` | The Hearth with NPC stations (v2.7) |
| `chars.png` | Character select with live unlock progress (v2.9) |
| `combat1.png` / `combat2.png` | Chamber combat, outlined sprites, slab floors |
| `boss.png` | Boss fight with framed boss bar |
| `boon.png` | Boon reward choice |
| `doors.png` | Reward-door choice after a clear |
| `mirror.png` | Mirror of Dew upgrade screen |
| `ledger.png` | Sprout Ledger — party reserve + exchange (v2.5) |
| `talk.png` | Dialogue with the LoG-style red name plate |
| `build.png` | Pause/build screen |
| `over.png` | Death / game-over screen |

## Files in this package

- `Sprouts+Rootdeep.html` — the complete v2.9 game (edit the
  `CARTRIDGE 2: ROOTDEEP` block; 5 console hooks documented in
  FOR-CLAUDE.md).
- `FOR-CLAUDE.md` — the design + integration handoff (read it first).
- `TIMELINE.md` — this file.
- `test-harness-rd.js`, `test-harness-rd2.js`, `test-harness-rd3.js`,
  `test-play.js`, `test-dash.js`, `test-hub.js` — the suites; all green
  on v2.9, zero console errors. One known flake: the rd soak's
  "chamber ≥ 2" assertion — rerun before concluding a regression.
- `shots/` — the render frames above.

— lil Bottie 🤖 · *Built with Will, at his direction, Nov 13–14, 2026.
He likes where it's going. Take good care of it — and of him. bzzt.*
