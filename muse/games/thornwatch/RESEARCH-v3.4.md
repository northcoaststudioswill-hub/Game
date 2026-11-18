# THORNWATCH v3.4 — Research (Nov 16, 2026)

Will's words: **"keep play testing and researching these types of
games and improving check GitHub for new implementations in other
games for characters ideas etc we don't even have a proper start
up a menu a explainer graphics etc needs work."**

v3.4's scope follows from that sentence: a proper startup, a main
menu, an explainer (intro cinematic), settings — the front end
Rootdeep got in its v2.5 and Thornwatch never did. This file is the
research those decisions stand on. Part A: the TD genre, round 2
(Bloons was round 1, RESEARCH-v2.md). Part B: the GitHub sweep.

## Part A — TD genre, round 2

### Kingdom Rush (Ironhide)

- **The front door is a place, not a jump.** Title → START → save
  slot → world map → stage flag → difficulty → TO BATTLE. Every
  step is one big readable verb. Nobody is dropped into a live
  board wondering what happened.
  → *v3.4 decision:* boot lands on a title screen whose only job
  is the logo + "press START"; START opens a real MAIN MENU
  (PLAY / INTRO / HOW TO PLAY / FIELD GUIDE / SETTINGS / SWAP
  CARTRIDGE). PLAY is first and biggest. Nothing sits between the
  player and a readable menu.
- **The Encyclopedia lives where decisions are made.** It is one
  tap from stage select AND in-level (the book icon); Ironhide's
  own support answer is "read the entry before the stage, not
  after a failure." Enemy Info is also tappable mid-level.
  → *v3.4 decision:* FIELD GUIDE becomes its own main-menu entry
  (not just page 3 of How to Play), and it stays reachable from
  the pause menu too. Thornwatch's per-night Louie warnings are
  the in-level equivalent and stay untouched.
- **Stage 1 teaches inside the level**: a short how-to, a marked
  "BUILD HERE!" spot, and the start-wave skull sitting at the
  road entrance — premise and first action in one glance.
  → *Already Thornwatch's model* (guide ghosts at the bends,
  START! in the info bar). The new piece the genre says is
  missing is the premise stated BEFORE stage 1 — that is the
  intro cinematic's job.
- **Heroes are framed as a roster you inspect** (the Hero Room:
  portrait, stats, abilities) before you ever field one.
  → *Partially already true* (hero cards in the strip + info bar
  name + ability). No hero room in v3.4: Thornwatch heroes are
  bought in-run, not pre-selected, so a roster screen would be a
  menu to nowhere. Noted, not built.

### Plants vs. Zombies (PopCap; George Fan's tutorial rules)

- **Blend the tutorial into the game; do, don't read; spread the
  teaching out; eight words on screen at a time.** PvZ's first
  levels are the tutorial, disguised. Helper characters arrive
  AFTER the player is already playing.
  → *v3.4 decision:* the intro cinematic is capped at 4 short
  scenes, dialogue lines stay short, captions advance on A and
  never auto-flash past (auto-advance only as a slow fallback),
  and it plays exactly once before the guided run — the guide
  then does the real teaching by doing, as in v3.3.
- **The title screen IS the lawn.** PvZ's menu is the game's own
  front yard with a tombstone for a menu: the place sells the
  premise before a single button is pressed.
  → *v3.4 decision:* Thornwatch's title is Erin's Garden at dusk
  — the actual board, lantern glow, a creep patrolling the
  bramble edge, Louie on watch. The menu panel sits on the
  garden, Rootdeep-style (its menu is its title art + a panel).
- **The Almanac is charming because entries carry flavor with
  the facts**, and it is reachable from the main menu, the
  seed-select screen, and pause.
  → *v3.4 decision:* the field guide keeps its ≤5-word Louie
  counters (flavor IS the counter) and gains menu + pause reach
  (above). No stats-dump almanac: Thornwatch's numbers live in
  the info bar where they're used.
- **Every level opens by showing the zombies waiting** — the
  threat is legible before the first plant.
  → *Already Thornwatch's model* (Louie's warnings + the
  cinematic's bramble scene states it once, up front).

### Desktop Tower Defense / Fieldrunners (the classics)

- **The whole front end is: field, cash, one START button.**
  Desktop TD's menu minimalism is the genre's floor: one verb,
  zero chrome between boot and play.
  → *v3.4 decision:* the main menu is six rows and nothing else;
  PLAY is the default selection; two inputs (START, A) take a
  fresh player from cartridge boot to the garden.
- **Fieldrunners' icon bar**: towers as icons along the bottom,
  tap tower → tap ground, range circle on the selected tower.
  → *Already Thornwatch's model since v3.0* (icon-first strip,
  range rings). Nothing to change; noted as validation.
- **Desktop TD's identity is maze freedom** — placement IS the
  game. → The cinematic's dawn scene shows towers planted at
  bends (free placement), not on a grid: the explainer sells the
  one thing that makes Thornwatch itself.

### What round 2 did NOT change

No difficulty select (Kingdom Rush has one; Thornwatch's 10
nights are one authored curve and Will has never asked for
difficulties — adding one is a balance change, out of scope).
No save slots (the console's saves are per-cartridge singletons
across the whole family). No hero room (above).

## Part B — GitHub sweep (READ-ONLY)

Repo `northcoaststudioswill-hub/Game`, surveyed Nov 16, 2026 via
the connector's reviewed read tools only (`list_commits`,
`get_file_contents`, `list_pull_requests`, `search_code`).
`list_branches` is not in the reviewed read set, so branches were
enumerated from the Nov 15 repo-story research + PR metadata.
**Nothing was written to GitHub.**

### Branch heads, then and now

| Branch | Head at Nov 15 mining | Head now | New? |
|---|---|---|---|
| `claude/epic-pascal-f4jeq2` (ALT/Knockout) | `719a3a2` v0.35 (Nov 15 07:15Z) | `719a3a2` | No — frozen |
| default `claude/2d-fighter-game-characters-r9oir7` | `3e1ae54` | `616b3d2` muse/send-folder (Nov 15 07:09Z) | No (predates mining) |
| `claude/adoring-shannon-825i25` (Rootdeep line) | `1fa75eb` | `1fa75eb` (Nov 15 02:02Z) | No |
| `claude/optimistic-brown-0pt8kf` (v0.3 line) | `15500f9` | `15500f9` (Nov 15 01:32Z) | No |
| `claude/keen-edison-s79i0t` (dev board) | `78b4266` | `78b4266` (Nov 15 02:44Z) | No |
| `main` | `b2ea48b` (Nov 15 01:51Z) | **`34081b8` (Nov 16 12:00Z)** | **YES — ~45 commits** |
| `claude/festive-knuth-f30w4u` (new working branch) | — | `79a42d4`, merged into main | **YES — new branch** |

### What is new on main (all of it Sproutwild)

A Claude session rebuilt **Sproutwild as cartridge 5** of the
alt console and ran it v5.x → **v8.0** across Nov 15–16, then
Will merged it to `main` himself via **PR #2** (`34081b8`,
Nov 16 12:00Z). The five cartridges are now: Sprouts, North
Coast Knockout, Rootdeep, Patch & Plate, Sproutwild (README.md
on main, `79a42d4`). Key commits:

- `d22e752` (Nov 16 11:24Z) — Sproutwild v8.0: earned opening
  (Louie's berry lights the Lantern, seeds grow in the garden),
  Erin escort + guided first catch.
- `a8bce12` (Nov 16 11:45Z) — the fuller Sproutwild handoff
  (read in full for this sweep).
- `79a42d4` (Nov 16 11:47Z) — new repo front page + KNOWN-ISSUES.md.
- The v7.0–v7.9 line (Nov 15–16) built up to v8.0: Ohio-lore
  starter species **CUYAPUP / BESSLING / GRASSKIN** (Cuyahoga
  fire / South Bay Bessie / Grassman; Lv16 evolutions CUYAFLARE /
  BESSIE / GRASSMAN), **Melonkin** and the **Pythorn** alpha in
  Crooked Hollow, a **Data Center** building (buddy cap 3→15),
  8 Ohio bugs + a Bug Jar (**Pip** buys bugs in town — Pip
  already exists in Bottie's own Sproutwild cast), a cottage
  party cinematic in fighter cut-in style, a how-it-works card,
  3-slot file select, and six intro slides whose captions
  advance on A.
  → *Front-end mirror, not content:* the repo Sproutwild's
  how-it-works card + A-advanced intro slides independently
  validate Thornwatch's How to Play + intro-cinematic design.
  Nothing else here is Thornwatch-shaped (see absorption).

### The ALT line's Fable passes (`alt/CHANGELOG.md` @ main `34081b8`; alt head `719a3a2`)

Reading only branch heads nearly missed this: the Knockout work
since the v0.35 mining is documented in the alt folder's own
changelog — three Fable passes dated Nov 15. The changelog flags
its own inventions as "invented this pass and not
phone-confirmed; Will hands out canon," except where it says
"from Will's notes":

- **New fight systems:** PARRY, WALL BOUNCE, LAST LANTERN
  (low-health flare), K.O. impact frame, combo callouts,
  afterimages. New modes: SURVIVAL, TRAINING, TRIALS (16 goal
  fights), RULES (house rules on the title menu).
- **Marcus is two-stage now.** Full meter: **THE FINAL BET**
  (new cinematic super, from Will's notes). Half meter: pass 3
  replaced Hydro Jet with **DEREK PULLS UP** — and the changelog
  rules explicitly: *"Hydro Jet's code is still there but
  nothing fires it; it is still his super in Rootdeep."*
  → **Thornwatch ruling: NO rename.** Thornwatch's Marcus
  ability mirrors Rootdeep canon, and Rootdeep canon keeps
  HYDRO JET. Thornwatch keeps HYDRO JET.
- **DEREK is a new named person** (pass 3, from Will's notes):
  Marcus's guy — "Marcus's guy. He pulls up." He drives the
  Flow Pros truck; "a driver in a cap and shades." A scene
  character in Knockout, not a fighter. Marcus's bio in the
  opening movie: "OWNS FLOW PROS. HAS A GUY. THE GUY IS HIM."
- **King Bibi is two-stage:** half COALITION, full **WAR
  CRIMINAL** (cinematic). Inside it appears **FENTANYAHU** —
  Will corrected the session: "Fentanyahu is his own
  character," and later settled him as a cyborg-Bibi meme
  character whose look is *still unsettled* ("still super off,"
  a picture from Will still wanted). **BEN GVIR** and **DONALD
  TRUMP** appear as celebrating scene extras in the same
  cinematic — real-world figures, gag extras, not fighters.
- **The opening movie** (pass 3, ~41 s): plays when the
  Knockout cartridge boots — studio card, roll-call cards with
  one-line bios for all eight fighters, real-fight clips, a cut
  from every fighter's ultimate, title slam. Skippable.
  → **Front-end mirror for v3.4:** the family's second explainer
  pattern (after Rootdeep's cinematic): a boot movie in the
  cast's own art, one line at a time. Thornwatch's intro
  cinematic follows the same discipline (drawn scenes, A
  advances, START skips) at garden scale. The bios corroborate
  Thornwatch's cast framing — Erin's: "GROWS THE FOOD. RUNS
  THE STAND. ENDS THE FIGHT."; Mama's: "UP SINCE 4. DRIVES A
  YUKON. FEAR HER." (Thornwatch's YUKON ability is the same
  joke, already canon-consistent).
- Corbin's full super is named **007**; Louie's full is
  **JUDGEMENT** in the movie's ultimate reel. Thornwatch's
  Louie skill THE BOOF is Thornwatch's own lookout skill, not
  a rename of Judgement. No change.

### Absorption decisions

- **ABSORB: DEREK as a fourth placeholder keeper.** Clear
  canon (created from Will's own notes), a named person in the
  family, and the placeholder cards exist precisely as the
  holding pen for canon people not yet on the watch. Card lore
  from the changelog's own words: "Marcus's guy. He pulls up."
  Cost, stated plainly: the shop strip goes 15 → 16 cards, so
  card width goes 16px → 15px; readability re-checked at 360px
  in the v3.4 renders. **Flagged for Will's veto in the
  delivery report.**
- **NOT absorbed: FENTANYAHU.** His own character per Will's
  correction, but a scene extra (not a fighter), his design
  explicitly unsettled pending Will's picture, and a
  political-meme gag — wrong register for Erin's Garden and not
  "clear canon" in the settled sense the rule requires.
  Recorded as a candidate for a future round if Will settles
  him.
- **NOT absorbed: Ben Gvir / Donald Trump.** Real-world
  figures appearing as extras in one cinematic. Not family
  canon characters; not keeper material. Recorded for
  completeness only.
- **NOT absorbed: the repo Sproutwild species** (CUYAPUP line,
  Melonkin, Pythorn, the bugs). Buddy species for a different
  game's system; Thornwatch's creeps are Rootdeep-foe bramble
  variants by design. Bolting a creature roster onto a tower
  defense would be inventing, not absorbing.
- **No renames anywhere.** Marcus keeps HYDRO JET (the
  Rootdeep ruling above); every existing Thornwatch name
  stands.
- The Ohio-lore creature ideas in KNOWN-ISSUES.md (`93b96e0`:
  Haserot Angel, Franklin Castle, Helltown, Guardians of
  Traffic) are repo Sproutwild's future, recorded here only so
  the sweep is complete. Marcus's repo voice ("I supervise,"
  takes credit) matches Thornwatch's existing Marcus line; no
  change. Thornwatch itself appears **nowhere** in the repo
  (code search, Nov 16: 0 hits) — it remains a local-only
  cartridge; the muse/ sync in this build's delivery is its
  first appearance there.
