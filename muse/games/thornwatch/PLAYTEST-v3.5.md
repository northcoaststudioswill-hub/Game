# THORNWATCH v3.5 — Playtest & Audit Report

Build: `Sprouts+Rootdeep+Sproutwild+Thornwatch.html`, 4,831,981 bytes.
Suites: THORNWATCH35_OK (50 checks) · FRONT35_OK · MIGRATE35_OK ×6 ·
SOAK35_OK · PLAYTEST35_OK · render rig: all assertions green, 0 errors.
516 function names file-wide, zero duplicates; `node --check` clean.
All verification is headless-rig; **nothing here is "fixed" until Will
confirms on his phone.**

---

## FIX 1 — the aimer circle is gone

Will: *"I don't like the circle around the aimer."*

- The free aimer is now the square bracket cursor alone. Op-level
  proof from the render rig: dawn shot with the cursor on empty
  grass contains **0 circle ops of r ≥ 20** (v3.4 drew the ZIP's
  range ring there).
- A placed tower's range shows **only while the cursor rests on
  that tower**, drawn by a new `twRangeDash`: 12 dashed arc
  segments at alpha .55. Op proof: inspecting the LV1 ZIP produces
  exactly **12 arc ops at r39** (ZIP's true range) and nothing else.
- The placement ghost (guide steps) lost its ring too — sprite at
  half alpha + pulsing corner brackets.
- Note on the tw-inspect screenshot: the test rig fills arc paths,
  so the dashed ring renders as a pale disc in the capture. On the
  device it is 12 thin dashes. The op log above is the evidence.

## FIX 2 — black-text audit (Will: "some of the text you made black
so it's really hard to read")

Every state was re-captured and read at capture size. Rule applied:
dark surface → light text; light plate → dark text. Offenders found
and fixed:

| Where | Was | Now |
|---|---|---|
| Fork panel, unselected path name | `#8f86c8` on near-black | `#c8c0d8` |
| Fork panel, unselected effect line | `#6a6480` (the worst offender) | `#a49cc0` |
| Info bar, locked keeper name (strip + field) | `#8f86c8` | `#b8b0d8` |
| Info bar, locked keeper lore / "NOT YET" | `#6a6480` | `#a49cc0` |
| Settings, "SHARED WITH THE CONSOLE" + footer | `#6a6480` | `#b8b0d8` |
| Settings, screen-shake OFF state | `#e8384f` on dark red-brown | `#ff6a5e` |
| Main menu + pause menu footers | `#6a6480` | `#b8b0d8` |
| How to Play, page count + footer | `#6a6480` | `#b8b0d8` |
| Ability/boss cut-ins, "A: SKIP" | `#6a6480` | `#b8b0d8` |
| Boss cut-in name | `#e8384f` | `#ff6a5e` (+ per-kind sprite) |
| Shop strip, unaffordable price | `#e8384f` | `#ff6a5e` |
| Boss HUD label | red text, no backing | dark plate + `#ff8a7a` |
| Floating combat text (+1, POP!, etc.) | flat color, washes out on grass | dark offset shadow pass under every float |
| Tower label over cursor | plain text | HEART-style dark plate behind it |
| Victory stats line | `#c8c0d8` on bright day board | `#e8e4f8` |
| Defeat title | `#e8384f` | `#ff6a5e`; lines are map/endless-aware |
| Intro cinematic "z" glyphs (day scene) | light on bright board | `#241b30` (dark on light — the rule cuts both ways) |

Checked and already correct (no change): HUD chips, say bar,
title/menu body text, settings values, How body text, the
cinematic parchment plate (`#f4ead2` + `#241b30` — dark on light,
sanctioned), the info bar's cream name plate (`#181020` on
`#fff8e0`-family — dark on light, sanctioned).

Two more text defects found by eyeballing the new captures, both
fixed in this build:
- **Map screen cards clipped their own text**: card names/subs are
  wider than the 76px cards ('THE CROSSROADS' ≈84px ran off the
  screen edge). Cards now use short labels (LONG BEDS / CROSSROADS
  / FIRST WATCH / LONGER DARK / TWO GATES); full names live on
  chapter cards and win screens.
- **Map screen footer collided with itself**: 'A: PLAY · B: BACK'
  (left) and the centered STARS/DROPS line overlapped mid-string.
  Stars/drops are now right-aligned on the same line, no overlap.
- **Info-bar hint overflow (v3.5 regression, caught in captures)**:
  the new in-round hint '… B: SPD 2X · SEL: POWERS' ran off the
  right edge. The HUD already carries the speed chip, so the round
  hint is now just 'SEL: POWERS'; dawn keeps 'A: PLANT'.

One leftover, flagged not fixed: on a hero, the info-bar line
('WILL LV1 · A: FIRE MAZEL TOV LASER · B: UPROOT +110P') is longer
than 240px and its tail can run off the right edge. The A-action —
the part that matters — is always fully visible. Pre-existing
layout; changing the info-bar's one-line rule is a design call for
Will, not a contrast fix.

---

## What the research changed (RESEARCH-v3.5.md, BTD6-first)

Adopted: multiple maps with different tracks · banana farm →
SUNFARM · tier-5s → GRAND upgrades · per-map modes (standard /
hard / alt rounds) · one-time Powers · hero leveling → hero
training · Sun Drops as the meta currency (Kingdom Rush stars +
Bloons medals, one currency). Rejected: 100+ rounds per map and
CHIMPS-style modes (length again — Will ruled width first),
XP-gated tower unlocks (fights the guided onboarding), IAP-shaped
consumables, co-op, cross-run hero XP (would blur into Lantern
Upgrades). Repo re-check: nothing new from the other sessions
since the v3.4 sweep (newest commit is our own v3.4 sync).

## The flesh-out, with tuning numbers

**Three gardens (26 nights through width).** Map 1 Erin's Garden —
unchanged S-bend, 10 nights, Old Thornback (780 HP). Map 2 **The
Long Beds** — a 624px three-row snake, 8 nights, deep-dusk grade,
**Bramble Maw** finale (950 HP, armor 3, sheds a mite every 12 s).
Map 3 **The Crossroads** — two entrances alternating onto one
Heart leg (263px per path), 8 nights, deepest grade, **Thornback
Prime** finale (1,600 HP, armor 5, enrage at half + mite-shed).
Maps unlock in sequence. Chapter title cards at each map's Night 1
(drawn cards, A skips, world frozen).

**Two new creeps.** BUBBLEBRAM (HP 16 + a 26-point shield bubble
that absorbs raw damage before armor; POP! burst on break; sprite
from Rootdeep's crab) debuts Map 2 Night 2. BURROWER (HP 24;
underground and untargetable for the first 40% of the track, dust
trail showing; DEW mist or Ranger's flare forces it up early)
debuts Map 2 Night 4. Both are all over Map 3 and the endless
pool, both have Louie counter-barks and field-guide entries.

**Economy (the money fix).**
- **SUNFARM** — LEAF's second fork is a true farm now: no attack,
  banks +4 petals every 6 s all night in visible bursts with a
  petal-fruit tell. SUNLEAF's +1 Heart mend is **gone** (flagged
  generous since v2.0 — this is its removal, logged).
- **GRAND upgrades** — every fork grows once more (Lv3, one per
  tower): 340–480 petals by type, damage ×2.6, cooldown ×0.7,
  range +8, plus per-type spikes (ZIP chains +3, LUCKY crit +0.15,
  DEW slow ×0.7, EMBER burn ×2.5, LEAF economy ×2.5). Gold star
  tell above Grand towers. Names from the fork families: GRAND
  TESLA STORM, GRAND WILDFIRE HEART, GRAND SUNFARM, etc.
- **POWERS** — SELECT mid-round opens the panel: SUNBURST 150p
  (90 damage to everything on screen), RAIN OF DEW 80p (all creeps
  slowed to 0.35× for 10 s), LOUIE'S HOWL 100p (stun all 2 s +
  reveal camo 8 s). One use each per purchase.
- **HERO TRAINING** — A on a placed hero at dawn: Lv1→2 for 120p,
  Lv2→3 for 220p; +35% damage per level, abilities cool down 10%
  faster per level (stacks with WARM LANTERN), gold pips under the
  hero.

**Modes + stars.** Per map: STANDARD; HARD (creep HP ×1.35,
40 starting petals, double star drops) and ALT NIGHTS (authored
remixes — later kinds arrive early) unlock on a standard clear.
Stars per map×mode×night: clear 1★, Heart ≥10 → 2★, zero leaks
→ 3★. NIGHTS is now the **MAP SELECT** screen (map cards, mode
row, night pips with earned stars). PLAY still jumps straight to
the frontier night.

**Sun Drops + Lantern Upgrades.** First-time stars pay 1 drop
each (2 in Hard); endless pays +1 per 5 nights survived, capped
+4 per run. 8 permanent perks, 3–6 drops each, 37 total — a full
clear (78 stars ≈ 78+ drops before endless) affords most, not
all: DEEP PURSE 3 · SECOND HEART 4 · KEEPER'S DISCOUNT 5 · RICH
SOIL 4 · DOUBLE BOOF 5 · GARDENER'S EYE 6 · FORKED PATHS 4 ·
WARM LANTERN 6.

**Endless — THE LONG NIGHT.** Unlocks on clearing Map 3's finale.
Fresh garden each run, compounding scaling (HP ×1.13/night past
15, MAW every 10th night), score = nights survived, best saved;
the defeat screen shows the score and drops earned.

## Balance defects the playtest caught (fixed, logged)

1. **Global-night HP offset.** The first build scaled Map 2/3
   creeps as if they were campaign nights 8–22 (Map 2 Night 1
   stds at 3.17× HP) while the player starts each map fresh with
   60 petals — unwinnable openings. Removed: every map scales
   from its own Night 1 (hpM = 1+(n−1)×.31); difficulty comes
   from compositions and track shape, BTD6-style.
2. **Maps 2–3 opened at mid-game intensity** (24–28-creep first
   nights). Both composition tables rewritten with fresh-map
   ramps (10-creep openers, debuts kept: bubble M2·N2, digger
   M2·N4), finales as drafted.

## Playtest results (playtest-35.js, real input paths + sims)

- **Naive discovery:** title → MAP SELECT in **3 inputs**, title →
  LANTERN UPGRADES in **6 inputs**, unaided, menu labels only.
- **Expert clears all 3 maps on standard, 2 seeds each** — with
  in-game knowledge only (warnings + field guide), mid-night
  buying, Grands and training in the line:
  Map 1: ♥14 / ♥16 · Map 2: ♥14 / ♥17 · Map 3: ♥11 / ♥13.
  Threatened everywhere, walked nowhere. (Map 3 needed a map-
  aware opening — two damage towers on the merge shoulders; the
  generic ZIP+DEW opening bleeds on two fronts. That's the width
  thesis working: different map, different good play.)
- **Economy proofs:**
  (a) No-farm line still wins Map 1 — and ends with **1,578**
      petals: the flood is what happens when you *don't* spend.
  (b) Over-greed (4 SUNFARMs before real defense) **dies Night 3**.
  (c) Grand-buying line, same seed: **695 petals** at the win vs
      **1,976** with Grands off — the sinks convert ~65% of the
      old flood into power, and the line still has to play.
  (d) One GRAND TESLA + one DEW and nothing else **dies Night 4**
      — Grands are strong, not free wins.
  (e) Powers at the margin: Map 2 finale, thin board — no powers
      ♥9, with powers ♥10. Same outcome class, real difference:
      an emergency job for money, not a win button.
  **O1 verdict:** the ~2,000-petal flood is answered. It still
  exists for a player who refuses every sink; a player using the
  systems ends winning runs at 166–695 petals with the money
  visibly converted into Grands, training and powers.
- **Hard mode:** the expert wins Map 1 Hard at **♥6 of 20** — and
  a dawn-only buying pattern (no mid-night buys) dies on Night 4.
  Hard is a real wall, flagged for Will's feel check.
- **Endless:** expert lines survive **9 and 15 nights** (death
  range **9–15**); the Night-10 MAW is the first gate. Scaling
  kills every line eventually, as designed.
- **Soak:** front-end tour (menu/map/upgrades/settings/how) +
  full runs on Map 2 standard, Map 3 ALT, and endless — all reach
  terminal states, zero console errors.

## Save migration (test-migrate35.js, 6/6)

- **v3.4 win** (the old 10-night campaign): Map 1 standard stars
  backfilled at **1★ each** (clear star only — no gifted 2★/3★),
  +10 drops granted once, Map 2 unlocked by the map rule,
  **endless stays locked** — a v3.4 win was a different campaign;
  endless is earned at the new Map 3 finale. Logged choice.
- **v3.4 mid** (best 6): 5 cleared nights at 1★, +5 drops,
  frontier stays Map 1 Night 6.
- **v3.3 / v3.2 shapes:** introSeen/guideDone migrate, stars
  backfill from best, drops match.
- **Brand new:** pure defaults. **v3.5 shape:** untouched.

## Honest leftovers

- Hero info-bar tail truncation (above) — flagged for Will.
- Derek's placeholder card still awaits Will's veto (from v3.4).
- Mama's Yukon travels path 0 only on the two-path map
  (simplification, invisible in practice — it hits what it hits).
- SUNFARM banks instantly per burst rather than at night end —
  the readable choice of the two the brief offered.
- Balance is sim-tuned, not hand-tuned; Hard's wall and the
  powers' margin are the two things to feel-check on the phone.
