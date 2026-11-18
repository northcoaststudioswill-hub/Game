# THORNWATCH v3.4 — Playtest (Nov 16, 2026)

Phase 2 of the v3.4 round: a deeper playtest of the **v3.3**
build, run before any v3.4 code was written. Drivers:
`playtest-34.js` (discovery + defeats + expert runs, real input
path where it matters), `playtest-34b.js` (eject probe), plus the
standing `playtest-sim3.js` / `playtest-soak3.js` baselines.
The v3.4 front-end verification is appended at the end once the
build lands.

## (a) Naive menu discovery — what a stranger can find

Fresh save, shelf boot, real taps only:

- Boot lands on the title. The title exposes **exactly two
  entries**: PLAY and HOW TO PLAY (up/down toggles between them;
  there is no third row to find).
- The **field guide is 9 inputs from boot** (5 to boot, DOWN,
  A, RIGHT, RIGHT) and exists only as page 3 of How to Play —
  a stranger looking for "what beats what" has to already know
  it's hiding inside the tutorial.
- **No settings exist anywhere** (source-asserted: no settings
  state, no volume/shake handling in the build), even though
  the console's shared `meta.mus`/`meta.sfx` are exactly what
  Rootdeep's settings screen edits.
- **No main menu and no intro cinematic exist** (source-asserted:
  no menu/cine states in the build). PLAY drops straight from
  the title into a live run; the premise is one line of title
  text, and the loop is never stated before night 1 except by
  the guide's first mission.
- B on the title **ejects the cartridge** to the console shelf.
  That is the family pattern (Rootdeep does the same), but on
  a 2-item title it sits one accidental press away from the
  first screen a new player sees.

## (c) Defeat paths

- **Zero towers, every night ridden out: defeat at night 3.**
  Night 1's wave leaks only ~6 heart (20 → 14) — a new player
  who plants nothing gets two full nights of warning before
  the run ends, which is the right shape.
- **Passive (3 towers, never buy again): defeat at night 3**
  with guide-spot placement (sim baseline with its own spots:
  night 4). Best-night records correctly in both.
- **mixedFork (a real mid-game comp, no heroes): defeat at
  night 8, all seeds** — the sim pattern is unchanged from
  v3.3's own verification.
- On the over screen, **A returns to the title** on the real
  input path; `best` records the loss night exactly.

## (b) Expert full-run attempt — in-game knowledge only

The scripted expert reads **only** what the game itself says:
Louie's per-night warnings ("IRONBARK! EMBER bounces off!
PEB, NOW!") and the card roles. It buys counters ahead of the
night that needs them, forks two towers, fields Erin then
Mama, and fires abilities on cooldown.

- **WIN on all 3 seeds.** Final hearts 12 / 10 / 15 of 20.
- Early pressure is real: even this line leaks 2–6 heart
  across nights 1–2 with correct guide-spot towers.
- The heart then stabilizes from night 3 — once the counter
  comp is complete, no night after N6 costs more than 1 heart
  on any seed. Night 9's two maulers are the last scare.
- **The purse floods late:** unspent petals at the win are
  ~2,000 on every seed; from night 7 the purse grows roughly
  +350–500 a night with nothing left worth buying on a full
  board. (Observation O1 below — flagged, not retuned.)

## Baselines (unchanged from v3.3)

- sim3 pattern: mixedFork LOSS@N8 ×3 · mixedFork2 WIN/LOSS@N9/
  WIN · heroMix WIN ×3 · leafEcon LOSS@N4–6 · emberSpam LOSS@N7 ·
  pebSpam LOSS@N9 · zipSpam LOSS@N5 · newbie LOSS@N5 ·
  passive LOSS@N4.
- soak3: SOAK3_OK — 3 chaotic runs all terminate, 0 errors,
  a v1/v2-shaped save loads with best/wins/plays intact.

## Probe: post-eject shelf behavior (playtest-34b.js)

After B-eject, the standard shelf boot sequence (RIGHT ×3, A)
lands on **Sproutwild**, not Thornwatch — the shelf cursor
does not return to the slot you ejected from. This is
console-level behavior, identical for every cartridge
(Rootdeep's eject is the same `eject()`), so it is recorded
here and **not** treated as a Thornwatch defect.

## Ranked findings

1. **F1 — No main menu.** Title → straight into a run; nothing
   to browse, no place for settings or replayable help to live.
   → Fixed in v3.4 (real menu, Rootdeep pattern).
2. **F2 — Field guide buried** at How-to-Play page 3, 9 inputs
   from boot. → Fixed in v3.4 (own menu entry; stays in pause).
3. **F3 — No explainer.** The premise/loop is never stated
   before the first night. → Fixed in v3.4 (intro cinematic,
   once on a fresh save's first PLAY, replayable from menu).
4. **F4 — No settings.** The console's shared music/SFX/shake
   settings exist (Rootdeep edits them) but Thornwatch exposes
   none. → Fixed in v3.4 (menu + pause, writes shared meta).
5. **F5 — B ejects from the first screen.** Family pattern,
   kept on the title, but v3.4's menu makes SWAP CARTRIDGE an
   explicit chosen row and gives B a harmless job (back)
   everywhere past the title.
6. **O1 — Late petal flood (observation, NOT retuned).**
   Winning runs finish ~2,000 petals rich; income outruns the
   sinks (forks + heroes) once the board fills around night 7.
   Not provably broken — the sim spends optimally, five of
   nine strategy families still lose, and two distinct
   informed lines win — so per the brief this is **flagged
   for Will**, not silently retuned. If he wants a sink, a
   third upgrade tier or a Heart-mend price rise are the
   levers; no numbers were touched.
7. **O2 — Difficulty shape is healthy.** Zero-tower N3,
   passive N3–4, spam lines die to their counters N5–9,
   mixedFork N8, two informed lines win with 10–15 heart.
   No certain-win or certain-loss line exists. No changes.

## v3.4 front-end verification (after the build)

- **FRONT34_OK** — 41 checks on the real input path: boot →
  living title → menu; navigation wraps to every entry; How
  to Play opens at page 0 and Field Guide at page 2 from the
  menu; settings from the menu raise/lower music + SFX and
  toggle shake, each change persisted (TW.set) and applied to
  the shared meta path; INTRO walks all 4 scenes by A and
  lands back at the menu; PLAY on a fresh save auto-plays the
  cinematic once (skip → run), sets introSeen, and the Louie
  guide still fires at step 1; PLAY with introSeen goes
  straight in; pause-menu SETTINGS opens with the world
  frozen (creep count unchanged) and returns to the open
  pause menu.
- **THORNWATCH3_OK** — the core suite with its boot flow
  updated to title → menu → PLAY → skip-cine → game; strip
  length assertion updated 15 → 16 for Derek (logged here,
  per the v3.3 precedent of logging control-assertion
  updates). Everything else unchanged and green.
- **Migrations 4/4** — v3.3 played save (introSeen → true,
  guideDone + best/wins/plays intact, migration persisted),
  v3.3 untouched save (both flags stay false), v3.2 save
  (both flags migrate true), no save (sane defaults).
- **SOAK3_OK** — 3 chaotic runs terminate, 0 errors, on a
  v1/v2-shaped save. **Sim pattern identical to v3.3** —
  the front end changed no balance.
- **Captures:** 17 frames rendered and eyeballed full-size
  and at 360px (tw-title, tw-menu, tw-cine-dusk,
  tw-cine-night, tw-settings, tw-howto-loop, tw-howto,
  tw-fieldguide, tw-guide, tw-dawn, tw-hero, tw-strip,
  tw-fork, tw-pause, tw-night, tw-boss, tw-victory,
  tw-defeat). Two real bugs were caught by the captures and
  fixed before delivery: the settings SCREEN SHAKE row first
  rendered as a one-pip volume bar (now ON/OFF text), and the
  cinematic's actors stood behind the dialogue plate (raised;
  Louie and the sleeping sprouts are visible in the re-shots).
  The 15px strip cards stay readable at 360px; Derek's
  silhouette is the 16th card.
- All of this is the headless rig. **Will's phone verdict on
  v3.4 is still the one that counts.**
