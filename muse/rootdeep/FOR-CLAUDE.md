# Handoff for Claude — ROOTDEEP (cartridge 2 of Sprouts)

**From:** lil Bottie (Will's Muse assistant) · **Date:** 2026-11-14 ·
**Current build: v2.9 "Cast update" — all test suites green, zero console errors.**

## How to receive this handoff

Will will give you **two things**:

1. **`Sprouts+Rootdeep.html`** — the complete, current game in one file.
   This IS the working file. Sprouts (Will's original game) with cartridge
   slot 2 filled by ROOTDEEP. You edit the block marked
   `CARTRIDGE 2: ROOTDEEP` inside it; Sprouts outside that block stays
   untouched except the five console hooks listed in Part 4.
2. **This document** — everything you need to not break it: the analysis of
   Sprouts, Rootdeep's full design, the canon, Will's standing directives,
   the test suite, and the honest list of what's unfinished.

You do not need anything else. There is no build step. The game runs by
opening the HTML file. Will plays on his **iPhone** — every verdict that
matters comes from his phone, not from a desktop render.

---

## Part 1 — What Sprouts is (Will's original game, analyzed from source)

A complete Pikmin-like squad game on a fictional handheld, the **PowerPocket
Lantern**, in one ~4.5 MB HTML file, wrapped in an artifact-export shell.

- **Console layer:** DOM/CSS handheld — cartridge shelf with 3 slots (only
  Sprouts was real; slots 2–3 were locked "Coming soon"), insert animation,
  LED, 8-way touch D-pad, A/B, Select/Start. Canvas is **240 logical px wide**
  × variable H (`fit()` clamps H 160–304 based on aspect). All sprites are
  code-drawn string-art (`mk()`). Keyboard: arrows/WASD, Z/J/Space = A,
  X/K = B, Q/E/Shift = Select, Enter/P = Start. Text metrics at 240px:
  size1 ≈ 6px/char (~40 chars/line), size2 ≈ 9px, size3 ≈ 11px.
- **The game:** You are **Will**, keeper of the Great Lantern. **Erin**
  gives quests; **Louie** the dog is a companion. Recover 4 sun shards
  across a 70×40-tile world with 8 zones, relight the Lantern, keep playing.
- **Systems (counted from source):** 6 sprout types (EMBER/PEB/DEW/ZIP/
  LEAF/LUCKY, indices 0–5 in `TYPES`) with lifecycle + XP; squad throw/
  whistle/Louie-fetch AI; signpost fast travel, 5 gates, boss Old Thornback
  (150 HP); 240s day loop; **22 missions**; Erin's Garden (12 beds, offline
  growth); the House (resident sprouts with jobs); petals, Keeper Rank,
  capsule gacha over 50 style items, **33 achievements**, 10 bugs, 12 hidden
  treasures; 6-panel intro cinematic; 2 music tracks by William Cohen.
- **Saves:** `localStorage['sprouts-v2']`, plus optional cloud sync via a
  global `claude.use('db'/'user')` API (fails gracefully off-host).
  ⚠️ **Spawn IDs are positional — append new spawns at the end only, or old
  saves break.**
- **`window.__g`** exposes full state — a deliberate test handle. Rootdeep
  extends it (Part 4).

### Flags

1. **Music streams from `/_blob/<hash>`** — it only plays inside the
   original host. Off-host the game is SFX-only. This is a known
   portability risk, accepted for now.
2. Cloud save needs the `claude` host global; elsewhere, localStorage only.
3. `fit()` couples H to container aspect — **write every screen H-relative.**
4. Google Fonts is the only other external dependency.

---

## Part 2 — ROOTDEEP: what it is now (v2.9)

**Premise.** The Lantern cracked downward too. Something below is eating
the light. Descend through 12 chambers, die, spend Moondew at the Mirror,
come back stranger. Escape through chamber 12.

**Controls (current — do not regress):** D-pad move · **A** attack ·
**B** cast · **double-tap a direction** = dash (i-frames) · **START** pause.
SELECT is deliberately demoted: Will finds it awkward to press on the
Lantern, so **no gameplay verb may live on SELECT** — it survives only for
rare non-gameplay actions (skip intro, eject cartridge, menu alt).

### The Hearth (hub)

A walkable hub using Sprouts' own character sprites. NPCs live at
**stations** and walk **route loops** between them — Erin tends the sprout
bed (upper-left), Marcus sulks in a gloom patch (upper-right), Scout works
a notes table (lower-left), Ranger patrols by a supply crate (lower-right),
Louie alternates rug, doorstep, and chasing the player. They keep personal
space (separation steering), never block the Root Door, and each has a
deep rotating dialogue set (~50 lines total). **A pages through all of an
NPC's lines; B cancels dialogue instantly; START gifts Honey mid-talk.**

- **Mirror of Dew** — 8 permanent upgrades bought with Moondew (Vitality,
  Might, Swiftness, Bark Skin, Golden Touch, Mending, Open Hand, Death
  Defiance).
- **Armory** — Petal Blade (3-hit combo), Root Maul (2 Keys, slow/heavy),
  Thornbow (3 Keys, ranged).
- **Keepsake shelf** — 5 keepsakes earned by gifting Honey, leveling by
  clearing chambers while equipped: Pressed Flower (Erin), Old Collar
  (Louie), River Stone (Marcus), Bramble Charm (Ranger), Bug Jar (Scout).
- **Sprout Ledger** (at the sprout bed) — reserve up to 3 banked sprouts as
  your diving party; an Exchange page trades 3:1 up the chain and sells
  back for Moondew.
- **Codex** — career stats, foes/bosses met, gods/boons discovered.
- **Pact of Roots** (heat gate, unlocks after first escape) — 5 conditions,
  8 heat; bosses pay a Moondew bounty the first time you kill them at a new
  highest heat.
- **The Root Door** — opens the character select (below), not a run directly.

### The Sprouts connection (the heart of the game)

**Sprouts ARE the currency.** Foes drop sprout pods (25% base, elites
always, bosses two; a chamber that drops none spawns one on clear, so a run
can never come up empty). Collected buds follow you in a string (max 6),
each working by type — and since v2.8 they are also **super-weak
auto-battlers**: every type attacks on its own cooldown for 1–3 damage
(deliberately pea-shooter numbers; a full 6-bud string is ~15% of weapon
DPS, a lone bud ~2%). PEB also blocks a hit (15s cd — note: the block uses
`b.cd`, attacks use `b.acd`; never merge them). Taking a hit can scatter
the last bud (30%). Survivors **bank** at run's end into the Ledger.
Buds are drawn with Sprouts' OWN `drawBud()`/`drawSprout()` and `TYPES`
table — shared assets, no copies.

### Runs

12 chambers, 3 biomes: The Burrows (1–4) · The Flooded Vault (5–8) ·
The Ember Core (9–12). Non-boss chambers spawn in **two waves** (~55% up
front; the rest rise when the first wave falls — "THE DEEP STIRS").
Elites at 3/7/10. **Bosses:** ch4 The Grub Mother (charges, summons,
radial bursts), ch8 The Drowned King (leap-slams, rings), ch12 The Hollow
Keeper (a shadow Will — dash-strikes, volleys, enrage). Clearing opens
**two reward doors**: Boon, Shop, Fountain, Petals, Moondew, Sunfruit,
Heart, Honey.

**Foes (6 AI kits):** Grublet (chaser), Spore Spitter (range-keeper),
Root Beetle (telegraphed charge), Mothshade (blinks behind you), Bubble
Crab (shield cycles), Ember Wisp (orbits + shoots). Stats scale per
chamber and with heat.

### Boons

6 gods — the sprout types grown old and strange (EMBER, PEB, DEW, ZIP,
LEAF, LUCKY) — each with Attack/Cast/Dash core boons, plus 12 passives and
4 duos (Wildfire Storm, Mudslide, Clover Moon, Phoenix Bloom = a revive).
Rarities Common/Rare/Epic; Sunfruit levels boons to Lv5. All effect math
lives in `rdBoonVal()`. The pause screen's build page shows the full build.

### Economy & death

Petals (shop), Moondew, Keys, Honey drop as magnetized pickups. **Death
banks Moondew/Keys/Honey and burns petals + boons.** Mirror, weapons,
keepsakes, gifts, Codex, Pact, character unlocks all persist in
`localStorage['rootdeep-v1']` — Rootdeep never touches Sprouts' save.
Revives stack: Death Defiance → Phoenix Bloom → Old Collar.

### ★ The cast (v2.9) — and the fighting game this mirrors

The Root Door opens **CHOOSE YOUR KEEPER**: four playable characters, each
with real stat identity and a signature cast (signatures replace the
generic no-boon cast; a god's cast boon still overrides them):

| Character | Identity | Signature |
|---|---|---|
| **WILL** | balanced | **MAZEL TOV LASER** (piercing beam) + **SELFIE FLASH** on his blade's 3rd combo hit |
| **ERIN** | buds +50% damage, speed +5% | **TOWEL WHIP** (roots + shoves foes) |
| **LOUIE** | speed +15%, HP −20, quick bite | **THE BOOF** (AoE bark, room-wide knockback) |
| **MARCUS** | HP +25, hits +20%, speed −7% | **HYDRO JET** (piercing, chilling jet) |

**Unlocks are earned and derived from lifetime stats** (no stored flags):
ERIN after 3 Honey gifts to her · LOUIE after 20 banked sprouts ·
MARCUS after 8 deaths ("he takes over"). Locked rows show live progress.

**⚠️ About the fighting game — read this before inventing any move:**
Will has **a separate fighting game that already exists** (built outside
this project; lil Bottie did not have access to it and only knows what
Will stated). Will's direction: **Rootdeep's character moves should mirror
the characters' moves from that fighting game.** The Mazel Tov Laser,
Selfie Flash, Towel Whip, and Hydro Jet above are taken directly from it,
in Will's own words — **they are canon; never rename or replace them.**
When you add moves (supers, throws, extra specials, character-specific
weapon animations), **pull them from the fighting game's move lists —
ask Will to show you that game or its move list first** rather than
inventing new ones. One known placeholder: **THE BOOF is lil Bottie's
invention** (from Louie's dialogue barks) because Will never specified
Louie's fighting-game move — reconcile it against the real move list when
you see it, and let Will rename it if it clashes.

---

## Part 3 — Will's standing directives (his taste, in his words' spirit)

These came from Will across the build sessions. Treat them as requirements:

1. **Depth bar is Hades.** The first cartridge game (Mothlight, a small
   arcade loop) was rejected as "too basic." Systems depth, meta
   progression, and build variety are the point.
2. **No explainer screens.** A "HOW TO DELVE" help screen was built and
   deleted at Will's word and **must never come back**. The title is art +
   logo + PRESS A. The game teaches through play: station prompts, a
   chamber-1 control hint, NPC dialogue.
3. **Marcus is a smart-ass with borderline, over-the-edge humor — a hater
   of all.** He roasts the keeper, the cast, the gods, and the deep. Keep
   him in that voice in ALL future writing. The others talk back.
4. **SELECT is awkward** — see Controls. No gameplay verb on SELECT, ever.
5. **Dialogue is cancellable** (B, instantly, any page) and NPCs must not
   congregate or block doors — stations, routes, personal space.
6. **Sprouts must be earnable in real play** — drop rates and the
   chamber-clear guarantee exist because Will "still couldn't get sprouts"
   under stingier numbers. Don't quietly nerf acquisition.
7. **Phone-first, always.** Will plays on iPhone 16 Pro Max and judges by
   the phone. A fix is not "done" until he confirms it on his device.
8. **He hands you canon; you don't invent it.** Move names, character
   facts, and anything from his other projects come from Will. When
   something is unspecified (like Louie's move was), flag it as a guess
   rather than presenting it as settled.

---

## Part 4 — Architecture & integration

Rootdeep is one commented block inside the HTML, inserted before
`/* ---------- loop ---------- */` — search `CARTRIDGE 2: ROOTDEEP`
(~1,000 lines). Cart art is a small IIFE before
`/* ---------- update ---------- */`.

**The 5 hooks into Sprouts (the only Sprouts edits):**

1. Shelf slot `data-i="1"` un-locked, named Rootdeep, canvas `#cartArt2`.
2. `cartPick()` records `activeCart=i`, refuses only slot index 2.
3. Boot: `activeCart===1` → `g3StartTitle()` instead of Sprouts' intro.
4. `update()`/`draw()` delegate any state starting `'g3'` to
   `g3Update(dt)` / `g3Draw()`.
5. `window.__g` gained `RD()` (meta object) and `RDF()` (test hooks:
   start, depart, talk, open, clearRoom, hurt, door, give, giveRun, boss,
   forceBoon, forceShop, doors, offer, finale, state, pos, foes, pods,
   char, unlocks).

**Naming discipline (load-bearing):** Sprouts owns `run`, `updFoe`,
`drawFoe`, `drawNPC`, `CINE`, `cineT`, `drawCine`. Rootdeep uses `RUN`,
`rdUpdFoe`/`rdDrawFoe`, `rdDrawNPC`, `RDCINE`/`rdCineT`/`rdDrawCine`.
**Every new identifier must be `RD`/`rd`/`g3`-prefixed.** A bare `CINE`
in cartridge code will break the merged file.

**The drawImage rule (learned the hard way):** `drawImage` only ever takes
a canvas (`.ol` / `.c` from `SPR()`), **never the SPR() record itself**.
Passing a record froze a cinematic scene on a green screen in real play —
Will caught it on his phone. All test harnesses hard-fail if it happens.

**Visual rules (Will's art direction, Legacy of Goku II is the north
star):** every sprite carries a 1px dark outline (draw the `SPR()` `.ol`
variants); chunky scales (player/NPC ×1.5, foes ×1.35, bosses ×1.9);
stone-slab floors, 3 variants hash-picked per tile; Rootdeep keeps its
dark underground palette — LoG's *craft*, not its daylight colors. Text
discipline: banners ≤ ~26 chars at size 2; list screens are two-part rows
(name left, value right) with the selected item's description in a wrapped
bottom panel; long lists auto-compact so rows never hit the panel.

**Tuning knobs:** `FOES` + `foeScale()` (enemy stats/scaling), `CORES`/
`PASSES`/`RARS` + `rdBoonVal()` (boons), `MIRROR` (upgrade costs),
`rdNextChamber()` (chamber budget: `4 + chamber`, split ~55/45 into
waves), `BOSSES` (boss HP), `CHARS`/`SIG` (cast), drop rates in
`killEnemy()` (pod 25%) and `chamberCleared()` (the guarantee).

---

## Part 5 — Testing: what exists and what it found

Three Node harnesses stub the DOM and drive the real HTML through
`window.__g`, plus three playtest bots. **All green on v2.9, zero console
errors.** (Will has the harness files alongside this doc — ask him for
them if you're set up to run Node; otherwise re-create equivalents
against the `RDF()` hooks.)

- **`test-harness-rd.js`** — hub & systems end-to-end: boot → title →
  Hearth; Mirror purchase; Erin conversation; Honey gift → keepsake;
  Armory unlock/equip; **physical walk** to the Root Door → character
  select → dive; combat soak; room clear → doors; boss spawn/kill; pause
  → build page; abandon banks currency; forced death → banking; Pact heat
  carries; a 9,000-step bot soak across runs. (~40 checks)
- **`test-harness-rd2.js`** — `boons` mode: all 6 gods' offers, rarities,
  a Duo appearing when eligible, shop incl. mid-shop boon purchase,
  chamber-12 finale → escape → Pact unlock, Codex pages. `sprouts` mode:
  full Sprouts regression (boot → intro → menu → play → dialogue).
- **`test-harness-rd3.js`** — cinematic, menu/settings, Sprout Ledger +
  Exchange, dive-with-party, the zero-luck pod guarantee (Math.random
  pinned), NPC wander, dialogue paging + B-cancel, and the v2.9 character
  tests: unlock gates, a locked character refusing to dive, diving as
  Erin, her signature consuming cast ammo.
- **`test-play.js` / `test-dash.js` / `test-hub.js`** — playtest bots that
  play with real inputs and report metrics (dash reliability, chamber
  clear times, NPC spacing, bud DPS). These found real issues in v2.8.1:
  the single dash charge starving (fixed: 2 base charges), chambers
  clearing in 4–12s (fixed: bigger budgets, then waves in v2.9), NPC
  min-distance 13.9px (fixed: 22px separation radius).

**A render rig** also exists (`test-render.js` + `render.py`): it records
the game's actual draw calls and rasterizes frames to PNG. **Look at the
frames before claiming any visual fix** — headless logic tests cannot see
a broken screen; the green-screen bug in Part 4 shipped exactly that way.

**Known test limitation:** the big soak in `test-harness-rd.js` is
stochastic and can occasionally flake on a "chamber ≥ 2" assertion —
re-run before concluding a regression.

---

## Part 6 — Honest open threads (fix / improve candidates)

1. **Nothing is phone-confirmed yet.** Versions 2.6–2.9 all passed
   headless tests and render checks, but Will hasn't given a play verdict
   on his iPhone: NPC feel, sprout acquisition rate, double-tap dash with
   2 charges, chamber length with waves, character select. **Get his
   verdict before tuning further.**
2. **Balance is harness-tuned, not human-tuned.** The playtest bot is
   mediocre on purpose (face-tanks, slow reactions) and died at the
   chamber-3 elite — difficulty "reads honest," but real hands will say
   more. Duo boon *offer rate* is generous when eligible; shop stock is a
   flat 3-of-6.
3. **NPC routes still cross mid-room** (e.g., Scout's Codex trek).
   Separation steering fixed the *lingering*; fully territorial routes
   were left as Will's call — ask him if it still bothers him in play.
4. **Louie's fighting-game move is unconfirmed** (see Part 2) — THE BOOF
   is a placeholder pending the real move list.
5. **Character-select detail panel** shows only 2 text lines; the selected
   character's stat line can be crowded out by the description +
   signature text. Minor polish candidate.
6. **Music portability** (Part 1, flag 1): `/_blob/` streams won't play
   outside the original host. If Rootdeep ever ships standalone, the
   music needs embedding or replacement.
7. **Ideas already floated with Will, not yet built:** a 4th biome past
   the Core on higher heat; weapon Aspects; Erin's dialogue reacting to
   specific bosses; more fighting-game moves ported per character
   (supers/throws). **Cartridge slot 3 is still blank** — Will hasn't
   decided what goes there.

---

## Version history (one line each)

v1 Mothlight (small arcade game) — rejected by Will as too basic, deleted.
v2.0 ROOTDEEP: full Hades-structure roguelite. v2.1–2.3 art/text/style
passes (sprites, LoG direction, no explainer screens). v2.4 cast voices
(Marcus's hater persona). v2.5 Sprouts economy + Ledger + menu/settings/
cinematic. v2.6 living Hearth + sprout guarantee. v2.7 stations & routes.
v2.8 battler buds, personal space, cancellable dialogue, control remap.
v2.8.1 tester-pass fixes. **v2.9 playable cast + signature moves + waves.**

— lil Bottie 🤖 · *Rootdeep was built with Will, at his direction, across
Nov 13–14, 2026. He likes where it's going. Take good care of it — and of
him. bzzt.*
