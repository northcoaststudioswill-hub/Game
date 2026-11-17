# THORNWATCH — Handoff

*Written Nov 16, 2026 by lil Bottie (Will's Muse) at Will's request, so any
future session updating this game starts from the real state: what's built,
what Will has asked for, what's still open, and how the work is done here.
Read this first, then the CHANGELOG, then the latest PLAYTEST report.*

---

## 1. What this is

**Thornwatch** is a garden tower-defense game for the Pocket Lantern
handheld, built by Bottie at Will's commission (Nov 15, 2026) as a NEW
cartridge in the Sprouts universe — Bottie's own idea, Will-approved
concept: by day you plant sprout towers in Erin's Garden; by night Old
Thornback's bramble creeps march the dirt track toward the Garden Heart;
Louie the dog is the lookout and narrator.

It lives in **cartridge slot 4** of a four-game file (Sprouts + Rootdeep +
Sproutwild + Thornwatch). The other three games are NOT yours to change —
Rootdeep is finished and handed off (do not resume it), Sproutwild is a
separate ongoing project, Sprouts is the read-only reference original.

**The one file that matters:**
`Sprouts+Rootdeep+Sproutwild+Thornwatch.html` — the whole console + all
four cartridges in a single HTML file.

## 2. Where everything lives

| Thing | Place |
|---|---|
| This handoff + game + docs (GitHub) | `muse/games/thornwatch/` on branch `claude/2d-fighter-game-characters-r9oir7` of `northcoaststudioswill-hub/Game` |
| Deliverable copy (Will's files) | `~/workspace/your_files/thornwatch/` (game + CHANGELOG.md + 43 files incl. ~30 screenshots) |
| Workdir | `~/workspace/thornwatch/` — `tw-module.js` (the cartridge source), `build.py`, `patch*.py`, test harnesses, `PLAYTEST-v*.md`, `RESEARCH-v*.md`, `backup-v*/` snapshots, `out/` build output |
| Sync ledger | `~/workspace/muse-section-src.muse-github-snapshot-sync.json` (append a record after every confirmed push) |
| Staging for pushes | `~/workspace/muse-section-src/muse/games/thornwatch/` |

**Current build: v3.7** (Nov 16, 2026) — 4,837,466 bytes,
md5 `9b879390975751c7426542bee1b1e11f`.
GitHub sync: docs commit `c623acc267121ad8a4040ca68ac84c49ce9853b8`,
game commit `9d216c92a14a79b5efb65395d9bc7ea893d24411`
(9 records in the sync ledger; this handoff pushes separately).

## 3. The game at v3.7

- **Front door** (v3.4): living title screen → main menu (PLAY / NIGHTS /
  UPGRADES / INTRO / HOW TO PLAY / FIELD GUIDE / SETTINGS / SWAP
  CARTRIDGE) → 4-scene drawn intro cinematic (plays once on a fresh
  save, START skips, replayable) → Louie-led guided first run.
- **3 gardens, 26 nights:** Erin's Garden (10 nights, S-bend track, boss
  OLD THORNBACK 780 HP) · The Long Beds (8 nights, 624px snake track,
  boss THE BRAMBLE MAW 950) · The Crossroads (8 nights, two entrances
  alternating, boss OLD THORNBACK PRIME 1,600, enrage + mite-shed).
  Maps unlock in sequence.
- **Towers:** the 6 canonical Sprouts types as tower classes (EMBER burns,
  PEB heavy/armor-shred, DEW slow/camo-reveal, ZIP chain-zap, LEAF
  economy, LUCKY crits) — each with a 2-variant LV2 fork and a GRAND LV3
  upgrade (340–480 petals). LEAF's SUNFARM fork is the farm (pays petals
  in visible bursts all night, no attack).
- **Creeps:** standard, DART, BULWARK (armor), MOSS (camo), IRONBARK
  (lead-class), REGROW, SPLITTER→MITES, BRAMBLE MAULER, BUBBLEBRAM
  (shield bubble), BURROWER (underground 40% of track).
- **Heroes:** 6 placeable keepers, one of each — WILL (MAZEL TOV LASER),
  ERIN (TOWEL WHIP), MARCUS (HYDRO JET), RANGER (LANTERN FLARE), SCOUT
  (FORAGER'S FIND), MAMA (YUKON) — cooldown abilities, trainable to Lv3
  with petals. LOUIE: THE BOOF auto-stun once a night + all warning
  barks. 4 placeholder keepers shown as silhouettes (KING BIBI, CORBIN,
  LIL BOTTIE, DEREK — see §6, Derek is flagged).
- **Systems:** pop-drip economy + bounties that fly to the counter;
  POWERS on SELECT mid-round (SUNBURST / RAIN OF DEW / LOUIE'S HOWL);
  stars per map×mode×night; HARD + ALT NIGHTS modes per map; Sun Drops
  meta-currency → 8 permanent Lantern Upgrades; endless mode THE LONG
  NIGHT (unlocks at Prime); standalone-night purse grants so map-select
  starts are fair; save key `thornwatch-v1` (stars/drops/perks/endless
  migrate honestly from every older shape).
- **Controls canon:** D-pad cursor (grid-snapped), A = context action
  (always labeled in the info bar), B = back/uproot/speed, START =
  begin night/pause. **SELECT is demoted to rare actions only** (Will
  finds it awkward on the Lantern) — powers live there by his current
  design, nothing core may move to SELECT.

## 4. What Will has asked for (his standing directions)

These are Will's own verdicts and rules, accumulated over v1.0→v3.7.
They outrank your taste. Most were learned the hard way — he had to
name each missing layer himself; don't make him name them again.

1. **Playtest like a stranger, every version.** Naive-player runs from a
   fresh save with phone-realistic inputs; time the core loop; play the
   defeat paths; check old saves load honestly. (Skill:
   `~/workspace/custom-skills/game_build_playtest/SKILL.md`.)
2. **Research the genre before building.** Bloons TD6 is the reference
   (his friends love it; he has never played it) — Kingdom Rush and
   Plants vs. Zombies patterns also mined. Map adoptions honestly;
   name rejections. Rounds live in `RESEARCH-v*.md`.
3. **Width before length.** "I don't think the scope is wide enough
   before we make it longer" — new maps/systems/modes beat more nights
   on the same board. 20-nights-on-one-map was planned and cancelled
   by Will mid-build; don't resurrect it.
4. **Money must never become useless.** If a winning run ends rich,
   that's a design bug: the game needs sinks with real tension (farm,
   Grands, powers, training are the current answer; sims must prove
   end-of-run petal counts, not assert them).
5. **No circle around the aimer.** (v3.4 verdict.) The cursor is a clean
   square; a tower's range shows only while inspecting that tower,
   as a thin dashed ring.
6. **Text must be readable, always.** A contrast audit (v3.4/v3.5) and
   a size-fit audit (v3.6) are standing checks: no dark text on dark
   ground, no string wider than the 240px screen, every screen
   re-captured and eyeballed at phone size.
7. **A proper front door.** Title, menu, explainer, settings — a game
   that boots straight into gameplay reads as a minigame to him.
8. **It must not feel like a minigame.** His words: fleshed out, wide
   scope, systems that accumulate (stars, drops, perks, modes).
9. **Screenshots every build, CHANGELOG every version.** Capture, look
   at them yourself at full size and at 360px, file them with the
   deliverable. The changelog is a standalone file, kept current.
10. **Never call it fixed until Will confirms on his phone.** All
    verification here is headless-rig. Say "delivered, awaiting your
    verdict" — his iPhone 16 Pro Max is the only real test.
11. **Louie lines ≤43 chars**, field-guide counters are the game's own
    teaching voice; defeat screens must teach (name the biggest leaker
    + its counter).
12. **Canon is canon.** Fighting-game move names (MAZEL TOV LASER,
    TOWEL WHIP, HYDRO JET, THE BOOF, YUKON…) come from Will's fighting
    game and the repo's Knockout canon — never rename, never invent
    moves; ask Will. Sprout types/order/colors are Sprouts canon.
    Art is PORTED from Sprouts/Rootdeep sprite data, not invented,
    wherever a family asset exists.

## 5. How updates are done here (process)

- **Delivery-first:** build → Thornwatch suites + soak green → copy
  deliverable + screenshots + CHANGELOG into
  `~/workspace/your_files/thornwatch/` → THEN the muse/ sync → THEN the
  Rootdeep 6/6 + Sproutwild 23/23 regression tails. Never let the
  tails hold the deliverable hostage (a v3.1 delivery once stalled
  ~100 min that way).
- **Patch discipline:** exact-string replacements with count asserts,
  atomic (a failed assert writes nothing); grep the live module before
  patching (anchors drift); `node --check` the extracted module;
  **zero duplicate function names file-wide** after every build
  (duplicate declarations across cartridges silently override — this
  has bitten before); every identifier in this cartridge is
  `TW`/`tw`-prefixed, states are `g5`-prefixed.
- **Balance changes need sim evidence** (before/after numbers in the
  PLAYTEST report); judgment calls get flagged for Will, not silently
  decided.
- **Saves:** any new field ships with an honest migration for every
  prior shape (v3.2→v3.7 shapes are the test set). Never gift unearned
  progress in a migration.

## 6. Open items — read before building

- **Will's phone verdict on v3.7 is pending** (and on v3.5/v3.6 as
  distinct builds — v3.7 supersedes them; his next play is the gate).
- **DEREK placeholder keeper: Will's veto still pending.** Derek was
  absorbed in v3.4 from Will's own Knockout notes ("Marcus's guy. He
  pulls up.") and flagged in every report since. Do not promote him to
  a full hero, do not remove him — it's Will's call, still unanswered.
  (FENTANYAHU was deliberately NOT absorbed: Will hasn't settled his
  look.)
- **v3.7 regression tails are UNVERIFIED.** The builder went quiet
  after delivering v3.7; its Rootdeep/Sproutwild tail runs were
  sigtermed mid-run when it was closed. Thornwatch's own suites were
  green (PLAYTEST-v3.7.md). Re-running the tails on the v3.7 file is
  OWED — do it on the next update round and log it in
  `regressions-v37.log`.
- **Known feel leftovers (v3.7):** watch-only stretches up to ~15s on
  late nights for entrance-campers (a mid-path event system would be
  a feature, not a fix — needs Will's appetite); heroes/powers/train/
  farm discovery still leans on guide step 7 + Louie tips; LOUIE'S
  HOWL is deliberately the weakest power (panic button); the
  Crossroads gate-glow tell is small (13×18) — enlarging is Will's
  call; Hard seed 99 beats the standard script line but loses to a
  line that obeys Louie's warnings (judged fair-hard).
- **Old flags, still Will's to settle:** Thornback at 780 HP (retuned
  from 900 in v3.0 for the longer track) — never re-confirmed;
  SUNLEAF's old Heart-mend was removed in v3.5 when SUNFARM arrived
  (logged, not announced as a question).
- **MESSAGE-TO-CLAUDE.md** (repo root of muse/) does not list
  Thornwatch — it's a shared file authored across sessions; per the
  hands-off rule it stays untouched unless Will says otherwise.

## 7. GitHub rules for this repo (Will's, amended Nov 16, 2026)

- The `muse/` section is Bottie's home: Thornwatch's work product
  (game file, CHANGELOG, RESEARCH/PLAYTEST reports, this handoff —
  text only) syncs there as builds land, without asking each time.
- **Additive-only: never overwrite anything authored by the other
  Claude sessions, anywhere in the repo, muse/ included.** Updating
  Thornwatch's own files is the work. Shared files are hands-off.
- Everything outside `muse/` is ask-first / read-only. Reading the
  other sessions' material for context is explicitly fine.
- Push mechanics: use `github push-files` with `--source-dir
  ~/workspace/muse-section-src` and a NUL-delimited `--paths-file`
  manifest (paths relative to the repo root). Never pass file contents
  via `--arguments-json` (argv limit ~4.8 MB). The git-data API
  intermittently 500s at the ref-update on big pushes — verify the
  branch head, then retry the identical push. Append a record to the
  sync ledger after each CONFIRMED push (format: see the v3.7 entry).
  The connector pushes TEXT only — no binaries (screenshots stay in
  Will's files).

## 8. Docs index (all in this folder on GitHub, full set in the workdir)

- `CHANGELOG.md` — every version, v1.0→v3.7, with the why.
- `PLAYTEST-v3.4.md` … `PLAYTEST-v3.7.md` — per-round playtest records
  (earlier rounds v2–v3.3 live in the workdir only).
- `RESEARCH-v3.4.md`, `RESEARCH-v3.5.md`, `RESEARCH-v3.7.md` — genre
  research (front-end patterns; BTD6 width/economy; noob fun/juice).
- `HANDOFF.md` — this file. Update it when the state changes
  materially; it is the first thing the next builder reads.

## 9. Version arc in one breath

v1.0 lanes-and-grid TD → v2.0 heroes + forks + counters → v3.0 Bloons
rebuild (one track, build anytime, fast-forward) → v3.1 real sprites →
v3.2 ported family art → v3.3 controls + guided onboarding → v3.4 the
front door (title/menu/cinematic/settings) → v3.5 width (3 gardens,
economy sinks, modes, meta) → v3.6 playtest fixes (standalone starts,
fit audit, Yukon path bug) → v3.7 the noob round (juice, reward
cadence, teaching defeats, mash protection). Full detail: CHANGELOG.
