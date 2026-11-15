# FOR CLAUDE — Sproutwild handoff (from lil Bottie, 2026-11-14)

You are receiving **Sproutwild**, a GBA-style Palworld set in the Sprouts
universe, built by Will and lil Bottie across one long session on
2026-11-14 (v1 → v4.7 in a single day). This document is the map. The
game is Will's; treat his word as canon over anything written here.

## What to give / what you're holding

- **The game**: `Sprouts+Rootdeep+Sproutwild.html` — one file, three
  cartridges on a shared handheld shell: slot 1 **Sprouts** (Will's
  original, DO NOT MODIFY), slot 2 **Rootdeep** (a finished roguelite,
  CLOSED — Will handed it off separately and does not want it resumed),
  slot 3 **Sproutwild** (yours now).
- **The module**: `sw-module.js` is Sproutwild's full source. The HTML
  is REGENERATED from it by `build.py`, which starts from the Rootdeep
  handoff file and applies asserted replacements. Never hand-edit the
  built HTML; edit the module, run `python3 build.py`, retest.
- **The records**: `CHANGELOG.md` (every version, honest), `DESIGN.md`
  (current systems spec), `RESEARCH.md` (Palworld/DQ round 1, Pikmin/
  Palworld/Pokemon-GBA round 2), `TIMELINE.md`, `COMMAND-LOG.md`
  (Will's 47 messages verbatim + what each produced), and the montage
  `montage-development.jpg` (every development screenshot, timestamped).

## The game in one paragraph

You are a keeper at Sunkeep base. **Buddies** (15 species) are creatures
— they fight in GBA-style turn-based battles and do nothing else.
**Sprouts** are the plant folk from Sprouts, drawn with Sprouts' own
`drawBud` — they are the home workforce AND the capture material: in
battle you toss a sprout to command a wild buddy (typed kinship changes
the odds). At home, sprouts grow in a fenced **garden** of plots, work
buildings as **crew**, hold tool jobs (axe/pick), and follow you in a
train in the wild, hauling finds home. lil Bottie is the sky villain:
he descends after your first sigil, raids the base at some day
rollovers, and waits past the Champion as the secret fifth gym. Gyms:
Ranger → Marcus → Erin → Scout → the First Keeper (Champion) → Bottie.

## Canon that must not drift

- **Sprouts ≠ buddies.** This was Will's sharpest correction, twice.
  Sprouts work; buddies fight. If you blur them, he will notice.
- **Earn, never given.** Sprouts are grown (water seeds → tend → pluck),
  crew is earned by deliveries, characters unlock by deeds. Will
  rejected free grants three times.
- **Berries → seeds → sprouts.** A sprout carries a berry to an empty
  garden plot and plants it; the seed is the FRUIT's type. Sprouts
  never plant themselves and never appear from nothing. (This mirrors
  Sprouts' own `deliver()` loop — read Sprouts' source before touching
  the garden; Will checks.)
- **Fighting-game moves are canon**: Will has a separate fighting game
  that already exists. WILL = MAZEL TOV LASER (+ SELFIE FLASH), ERIN =
  TOWEL WHIP, MARCUS = HYDRO JET, LOUIE = THE BOOF (Bottie's
  placeholder — Louie's real move is unknown). Never rename them;
  ask Will for the move list before inventing moves.
- Marcus is a smart-ass hater of all. Erin and Marcus use their
  ORIGINAL Sprouts character models (Will's explicit preference).
- Will's dictation writes "Aaron" when he says **Erin** (his fiancée).

## Controls (as of v4.7)

D-pad/WASD move (4-way, last-pressed wins) · A interact/confirm ·
B: context — BUDDY command mode sends the lead buddy to work a node;
SPROUT command mode throws a sprout (hold B = whistle recall) ·
SELECT swaps command mode (BUDDY/SPROUT) · START pause. Battles are
menu-driven (FIGHT / SPROUT / KEEPER / BUDDY / RUN) and are ACTIVATED,
never ambushes: A challenges a wild (the prompt names species+level),
a thrown sprout landing on a wild engages it, grass rustles reveal
wilds instead of starting fights.

## Engineering rules (each one cost us a bug)

1. **Prefix everything** `SW/W4/sw`. The file is one shared scope with
   Sprouts and Rootdeep; a duplicate `function` name silently
   overrides. Verify zero duplicate function names after every build.
2. **`drawImage` only ever receives `.ol`/`.c` canvases, never a
   sprite record** — passing a record froze a cinematic on a green
   screen on Will's phone while every test passed. The harnesses now
   hard-fail on it; keep them that way.
3. **Patch with asserted replacements** (exact string, count checked,
   atomic: any failed assert = nothing written). Anchors drift; grep
   the real file first, every time.
4. **Test like a player.** Suites (`test-harness-sw*.js`, 23 of them,
   plus the sw5 soak and Rootdeep's harness) run headless:
   `node test-harness-sw23.js out/Sprouts+Rootdeep+Sproutwild.html`.
   Suite references are LIVE objects — snapshot before the action;
   pin wanderers before proximity assertions. All suites + soak +
   Rootdeep must be green together, 0 console errors.
5. **Renders every build**: `test-render-sw*.js` + the op-stream
   rasterizer (`~/workspace/mothlight/render.py`) produce screenshots;
   EYEBALL them. Will's standing rule: screenshots every build and a
   CHANGELOG entry every version (his process, set 2026-11-14).
6. **Nothing is "fixed" until Will confirms it on his iPhone.** Every
   build so far is rig-verified only. Say so, every delivery.
7. Text: `swSay` strings ≤ ~70 chars (2 lines max). Menu/guide lines
   ≤ 34 chars in the 216px panels. Will has flagged text falling off
   frames in five separate versions — audit before shipping.
8. Spawn IDs are append-only (saves). Save key `sproutwild-v1`.
   Sproutwild must never touch Sprouts' save (`sprouts-v2`) or
   Rootdeep's (`rootdeep-v1`).

## Will's standing directives

- Phone-first, always: he plays on an iPhone 16 Pro Max and judges
  everything by the mobile look.
- "Play the game" means PLAY it — new save, real inputs, live in it —
  and report what you actually saw, including when he's right and the
  build is wrong. He asked for a deep criticism once and got one;
  that's the register he trusts.
- When he says keep going / keep improving, mine Sprouts' source and
  the research notes for the next system instead of waiting for a spec.
- No explainer screens that read like our chat messages. The game
  teaches in-world (Louie guides; the staged tending opening teaches
  sprouts by doing).
- Deliverables go in `~/workspace/your_files/sproutwild/`; the game
  file, module, build script, suites, renders, and shots travel
  together every version.

## Honest open threads (v4.7 state)

- **Phone verdicts are behind**: v4.0–v4.7 were all played by Will
  through v4.5; v4.6 (the Garden) and v4.7 (activatable battles) are
  delivered but unconfirmed on his phone as of this handoff.
- Balance is harness-tuned, never human-tuned. Gym sims say fair
  parties win ~6–7/8; expect Will's thumbs to disagree somewhere.
- The base still largely runs itself once staffed — Will's deepest
  criticism (v4.6 notes). The Garden made the work legible; giving
  the player more decisions inside it is the open design problem.
- Starters were redrawn twice (v4.3); Will still said he hates the
  main 3 buddies as of v4.3 feedback. Their design is not settled.
- Sprouts systems not yet mined: 33 achievements, capsule gacha,
  garden orders as timed deliveries, the style catalogue. IDEAS.md
  in this folder parks more (Cottage interior, Base Levels 4–5,
  sprout tiers, condensing duplicate catches).
- Music streams from `/_blob/<hash>` in the original Sprouts file —
  it only plays inside the original host. Portability risk, known.
- The shell's touch D-pad is radial 8-way with a small dead zone;
  very short taps can be eaten by the frame snapshot. Known quirk.

## Where things live

- Workdir: `~/workspace/sproutwild/` (module, build.py, suites,
  render rigs, shots_v* folders, playtest scripts).
- Deliverables: `~/workspace/your_files/sproutwild/`.
- Sprouts original (read-only reference): `~/workspace/user/files/Sprouts.html`.
- Rootdeep package (closed): `~/workspace/your_files/rootdeep/`.

Build something he'd keep. He deletes what doesn't earn its place —
five versions of Sproutwild exist because he played every one and
talked back. That's the whole method: ship, listen, rework.

— lil Bottie 🤖 bzzt
