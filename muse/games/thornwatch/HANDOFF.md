# THORNWATCH — Handoff

*Original handoff: lil Bottie, Nov 16, 2026. Cleaned up Nov 17, 2026 at Will's
request: stale workdir paths moved to one place, duplicate process notes
merged, the v4 direction added. No standing direction or open item was
dropped. Read this first, then CHANGELOG.md, then the latest PLAYTEST report.*

---

## 1. What this is

**Thornwatch** is a garden tower-defense cartridge in the Sprouts universe.
By day you plant sprout towers in Erin's Garden. By night Old Thornback's
bramble creeps march the dirt track toward the Garden Heart. Louie the dog
is the lookout and narrator.

It is **cartridge slot 4** of the four-game console file
`Sprouts+Rootdeep+Sproutwild+Thornwatch.html`. The other cartridges are not
changed from here:
- **Rootdeep:** finished and handed off. Do not resume it.
- **Sproutwild:** Pocket Lantern. A separate project with its own branch.
- **Sprouts:** the read-only reference original.

## 2. Current state

- **Build:** v3.7 (Nov 16, 2026). 4,837,466 bytes,
  md5 `9b879390975751c7426542bee1b1e11f`.
- **GitHub:** docs commit `c623acc`, game commit `9d216c9`.
- **Will's phone verdict on v3.7:** PENDING.
- **v3.7 regression tails (Rootdeep 6/6, Sproutwild 23/23):** UNVERIFIED.
  Re-run them on the next update and log in `regressions-v37.log`.
- **v4 direction:** set Nov 17 (section 3a). No v4 build exists yet.

## 3. Where things live

| Thing | Place |
|---|---|
| Handoff, game, docs (GitHub) | `muse/games/thornwatch/` on `claude/2d-fighter-game-characters-r9oir7` |
| Builder's source and tests | Bottie's workdir (`~/workspace/thornwatch/`): `tw-module.js`, `build.py`, patch scripts, test harnesses, `out/`, `backup-v*/`. Not in the repo. |
| Deliverables with screenshots | Bottie's `~/workspace/your_files/thornwatch/`. Screenshots are binary and stay out of GitHub. |
| Sync ledger | Bottie's `muse-section-src.muse-github-snapshot-sync.json`. Append a record after each confirmed push. |

Push rules are in section 7.

## 3a. v4 direction (Will, Nov 17)

Will's words, in short. Treat these as the brief for v4.0.

- **Inspired by Bloons TD6**, and best-in-genre patterns for the Sprouts universe.
- **The current game is too small.** It is close to a vertical slice. It is
  not yet a game you'd play for minutes before wanting to change something.
- **The art needs a full rework.** The current look is ugly.
- **The feel needs work.** It isn't fun or addictive yet.
- **Story and cut-scenes are missing.** There should be real cut-scenes with
  our characters, and lore.
- **Menus and text are weak.** They need a proper pass.
- **Playability and replay are thin.** It needs more reasons to come back.
- **Pocket Lantern Easter eggs**, plus nods to the other console games.
- **Tower defense as a whole game, not a side game.** The v3 build plays like
  a mini-game hidden inside Rootdeep. Thornwatch should stand alone in the same
  universe, the way every other cartridge does.
- **The whole game gets updated.** The research round comes first
  (`RESEARCH-v4.0.md`), then the rebuild plan.

## 4. What v3.7 has (for reference)

- **Front door (v3.4):** living title, main menu (PLAY / NIGHTS / UPGRADES /
  INTRO / HOW TO PLAY / FIELD GUIDE / SETTINGS / SWAP CARTRIDGE), a 4-scene
  intro cinematic (plays once, START skips), and a Louie-led first run.
- **3 gardens, 26 nights:**
  - Erin's Garden: 10 nights, S-bend track, boss OLD THORNBACK 780 HP.
  - The Long Beds: 8 nights, 624px snake track, boss THE BRAMBLE MAW 950.
  - The Crossroads: 8 nights, two entrances alternating, boss OLD THORNBACK
    PRIME 1,600 HP, enrage and mite-shed.
  - Maps unlock in sequence.
- **Towers:** the 6 Sprouts types (EMBER burns, PEB heavy/armour-shred, DEW
  slow and camo-reveal, ZIP chain-zap, LEAF economy, LUCKY crits). Each has a
  2-variant LV2 fork and a GRAND LV3 upgrade (340 to 480 petals). LEAF's
  SUNFARM fork pays petals all night and does not attack.
- **Creeps:** standard, DART, BULWARK (armour), MOSS (camo), IRONBARK
  (lead-class), REGROW, SPLITTER (splits into MITES), BRAMBLE MAULER, BUBBLEBRAM
  (shield bubble), BURROWER (underground for 40% of the track).
- **Heroes:** 6 placeable keepers, one of each: WILL (MAZEL TOV LASER), ERIN
  (TOWEL WHIP), MARCUS (HYDRO JET), RANGER (LANTERN FLARE), SCOUT (FORAGER'S
  FIND), MAMA (YUKON). Each has a cooldown ability and trains to Lv3 with
  petals. LOUIE: THE BOOF auto-stuns once a night and gives all warning barks.
  Four placeholder keepers appear as silhouettes: KING BIBI, CORBIN, LIL BOTTIE,
  DEREK (see section 6).
- **Systems:** pop-drip economy and bounties that fly to the counter. POWERS on
  SELECT mid-round: SUNBURST, RAIN OF DEW, LOUIE'S HOWL. Stars per map, mode and
  night. HARD and ALT NIGHTS modes per map. Sun Drops meta-currency buys 8
  permanent Lantern Upgrades. Endless mode, THE LONG NIGHT, unlocks at Prime.
  Save key `thornwatch-v1`. Older save shapes migrate honestly.
- **Controls:** D-pad moves a grid-snapped cursor. A is the context action,
  labelled in the info bar. B is back, uproot or speed. START begins a night or
  pauses. **SELECT is for rare actions only.** Will finds it awkward on the
  Lantern, so nothing core may move there.

## 5. Will's standing directions

These are Will's verdicts. They outrank taste. Most were learned the hard way.
Don't make him name a missing layer again.

1. **Playtest like a stranger, every version.** Fresh save, phone-realistic
   inputs, time the core loop, play the defeat paths, check old saves load.
2. **Research the genre before building.** Bloons TD6 is the reference. Kingdom
   Rush and Plants vs. Zombies are also mined. Name adoptions and rejections
   honestly. Rounds live in `RESEARCH-v*.md`.
3. **Width before length.** New maps, systems and modes beat more nights on the
   same board. A 20-nights-on-one-map plan was cancelled mid-build. Don't bring
   it back.
4. **Money must never become useless.** A winning run that ends rich is a design
   bug. Sinks need real tension. Sims must prove end-of-run petal counts.
5. **No circle around the aimer.** The cursor is a clean square. Range shows
   only while inspecting a tower, as a thin dashed ring.
6. **Text must be readable.** Contrast and size-fit audits are standing checks.
   No dark text on dark ground, no string wider than 240px, and every screen is
   checked at phone size.
7. **A proper front door.** A game that boots straight into gameplay reads as a
   mini-game to him.
8. **It must not feel like a mini-game.** Fleshed out, wide scope, systems that
   build on each other (stars, drops, perks, modes).
9. **Screenshots every build, a CHANGELOG entry every version.** Look at the
   screenshots at full size and at 360px.
10. **Never call it fixed until Will confirms on his phone.** All checks so far
    are headless. Say "delivered, awaiting your verdict." His iPhone 16 Pro Max
    is the only real test.
11. **Louie lines are 43 characters or fewer.** Field-guide counters are the
    game's teaching voice. Defeat screens must teach: name the biggest leaker and
    its counter.
12. **Canon is canon.** Fighting-game move names (MAZEL TOV LASER, TOWEL WHIP,
    HYDRO JET, THE BOOF, YUKON) come from Will's fighting game and the Knockout
    canon. Never rename them or invent new ones. Ask Will. Sprout types, order
    and colours are Sprouts canon. Art is ported from Sprouts or Rootdeep sprite
    data, not invented, wherever a family asset exists.

## 6. Open items: Will's call

- **Will's phone verdict on v3.7** (and on v3.5 and v3.6 as separate builds).
  v3.7 supersedes them. His next play is the gate.
- **DEREK placeholder keeper: Will's veto is pending.** Derek was taken in at
  v3.4 from Will's own Knockout notes ("Marcus's guy. He pulls up."). Do not
  promote him to a full hero. Do not remove him. This is Will's call.
  FENTANYAHU was deliberately not taken in, since Will hasn't settled his look.
- **v3.7 regression tails are still owed** (section 2).
- **Feel leftovers:** watch-only stretches up to about 15 seconds on late nights
  for entrance-campers. A mid-path event would be a feature, not a fix, and needs
  Will's appetite. Heroes, powers, training and farm discovery lean on guide
  step 7 and Louie's tips. LOUIE'S HOWL is deliberately the weakest power, a
  panic button. The Crossroads gate-glow tell is 13x18px; enlarging it is Will's
  call. Hard seed 99 beats the standard script line but loses to one that obeys
  Louie's warnings. That was judged fair-hard.
- **Old flags, still Will's to settle:** Thornback at 780 HP (cut from 900 in
  v3.0 for the longer track, never re-confirmed). SUNLEAF's old Heart-mend was
  removed in v3.5 when SUNFARM arrived. That was logged, not put to Will.
- **MESSAGE-TO-CLAUDE.md** (muse/ root) does not list Thornwatch. It's a shared
  file, so it stays hands-off unless Will says otherwise.

## 7. How updates are done

- **Delivery first.** Build, then the Thornwatch suites and soak must be green.
  Copy the deliverable, screenshots and CHANGELOG to Will's files. Then sync to
  `muse/`. Then run the Rootdeep and Sproutwild regression tails. Never let the
  tails hold up a delivery (a v3.1 delivery once stalled about 100 minutes that
  way).
- **Patch discipline.** Exact-string replacements with count asserts, all or
  nothing. Grep the live source before patching, since anchors drift. Run
  `node --check` on the extracted module. After every build, check for zero
  duplicate function names across the file. Duplicates silently override each
  other across cartridges, and this has bitten before. Every identifier is
  `TW`/`tw`-prefixed. States are `g5`-prefixed.
- **Balance changes need sim evidence,** with before-and-after numbers in the
  PLAYTEST report. Judgment calls are flagged for Will, not decided silently.
- **Saves.** Any new field needs an honest migration from every older shape
  (v3.2 to v3.7 is the test set). Never grant unearned progress in a migration.

## 8. GitHub rules (Will's, amended Nov 16, 2026)

- **The `muse/` section is Bottie's home.** Thornwatch's own work (game file,
  CHANGELOG, research and playtest reports, this handoff, text only) syncs there
  as builds land.
- **Additive only.** Never overwrite anything authored by another Claude
  session, anywhere in the repo, `muse/` included. Updating Thornwatch's own
  files is the work. Shared files are hands-off.
- **Everything outside `muse/` is ask-first or read-only.** Reading other
  sessions' material for context is fine.
- **Push mechanics:** `github push-files` with a NUL-delimited paths manifest,
  text only. Never pass file contents as arguments. The git-data API sometimes
  returns 500 at the ref update on big pushes. Verify the branch head, then retry
  the identical push. Log each confirmed push in the sync ledger.
- **Pushes wait for Will's "push."** Nothing goes up on an automatic reminder.

## 9. Docs index and version arc

- `CHANGELOG.md`: every version, v1.0 to v3.7, with the reasons.
- `PLAYTEST-v3.4.md` to `PLAYTEST-v3.7.md`: per-round playtest records.
- `RESEARCH-v3.4.md`, `RESEARCH-v3.5.md`, `RESEARCH-v3.7.md`: genre research
  (front-end patterns, BTD6 width and economy, early-game fun and juice).
- `RESEARCH-v4.0.md`: the v4 research round (see the same folder).
- **Version arc in one breath:** v1.0 lanes-and-grid TD. v2.0 heroes, forks and
  counters. v3.0 Bloons rebuild (one track, build anytime, fast-forward). v3.1
  real sprites. v3.2 ported family art. v3.3 controls and guided onboarding. v3.4
  the front door (title, menu, cinematic, settings). v3.5 width (3 gardens,
  economy sinks, modes, meta). v3.6 playtest fixes (standalone starts, fit audit,
  the Yukon path bug). v3.7 the noob round (juice, reward cadence, teaching
  defeats, mash protection). Full detail is in CHANGELOG.md.
