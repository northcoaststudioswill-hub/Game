# THORNWATCH — Research round v4.0 (Nov 17, 2026)

**Source caveat:** written from memory of these games, not checked against
live sources or fresh playthroughs. Treat specific numbers as approximate
and verify before a sim or a design decision depends on one.

**Question:** What makes tower defense great, and how does it fit the
Sprouts universe? Thornwatch v3.7 plays like a mini-game inside Rootdeep. It
needs to stand alone, be wide, and be worth coming back to.

---

## 1. Reference games

| Game | What to learn | What to leave |
|---|---|---|
| **Bloons TD6** (Will's reference) | Upgrade paths with 3 tiers each, two paths per tower, tiers that unlock a new behaviour, not just a bigger number. A hero that plays like a tower. Round-calling (send the next wave early) for players who want speed. Many maps and modes, Odyssey-style chained runs, challenges. Real meta progression and a clear sense of the next goal. | Subscription and ad pressure. Some menus with too many layers. |
| **Kingdom Rush** | Several towers with real branching choices. Hero units that matter in every wave. Enemy abilities that force a response, not just stat checks. Strong art direction with readable silhouettes. Campaign-level progression with a reason to replay each level for stars. | Very large maps that slow the start. |
| **Plants vs. Zombies** | Lane defence that is quick to read. A sun economy that the player feels every second, so the first minute is easy and fun. Plant variety with a clear role for each. Character and humour in every screen. Cut-scenes that are short and funny. | Fewer layers of depth than BTD6. |
| **Defense Grid** (secondary) | Clean, readable enemy waves and a strong sense of pressure. | Minimal art and story, so no help for us here. |

## 2. What makes these games good (the common core)

1. **The first 60 seconds teach one verb at a time.** Place, upgrade, call a
   wave. Each verb arrives when it is needed. (Matches Will's rule: the guide
   and Louie's tips teach the thing you are about to do.)
2. **Every tower has a reason to exist.** Each one covers a weakness: armour,
   camo, flying, groups. The player's real skill is matching counters.
3. **Upgrades change behaviour.** A tier that adds a new trick is worth more
   than a tier that adds +5 damage. This is BTD6's clearest lesson.
4. **Money has sinks with tension.** A player should always have a choice to
   make: save for the big upgrade, or spend on a tower now. Will's rule "money
   must never become useless" matches this.
5. **Speed is a choice.** Calling waves early, fast-forward, and a clear
   "make it harder" option keep experts engaged without slowing newcomers.
6. **Replay comes from modes and goals, not just more levels.** Star ratings,
   challenges with odd rules, a harder mode, and an endless or chained mode
   each give a different reason to return.
7. **Readability is part of the game.** Each enemy must be readable at a
   glance. Each range and target indicator must be obvious. On a 240px screen
   this is harder, so it matters more.
8. **Personality sells the loop.** PvZ's characters and short cut-scenes are
   why people remember it. Thornwatch's cast (Erin, Marcus, Louie, Bottie) can
   do this job directly.

## 3. Adopt / adapt / reject

**Adopt**
- BTD6-style upgrade paths: two paths, three tiers each, behaviour changes at
  tier 3. Replaces the current 2-variant LV2 fork plus one GRAND LV3.
- Round-calling for speed. Early sends pay a bonus, so money stays meaningful.
- Heroes that act like towers (already in v3.x, keep and make them the stars of
  their own cut-scenes).
- Star ratings per level plus at least one challenge per map, with odd rules.
- A visible "next goal" on the map screen, as PvZ and BTD6 both do.

**Adapt**
- PvZ's sun economy, rebuilt as the Sprouts garden: sprouts drop from the
  Lantern and the garden plots, and the player taps them to collect. Gives the
  first minute a satisfying loop.
- BTD6's Odyssey (chained maps with a shared rule set) becomes "The Long Night":
  three gardens in one run, each with carry-over rules. This is the width
  Will asked for.
- Kingdom Rush's enemy abilities: bramble creeps that do something the player
  must answer (sprout-kin counter, burn, mulch). Each one teaches a counter.

**Reject**
- Subscription, ad or energy systems. None fit a console cartridge.
- Very long campaigns before the first fun moment. Keep each map short.
- Dozens of towers with no clear role. Six sprout types, each with a job, beats
  a long list.

## 4. Fit with the Sprouts universe

Thornwatch should stand alone, with its own world and cast, and still be
clearly part of the console. Proposed:

- **World:** Erin's Garden at the edge of Sunkeep, a walled back garden
  behind the Great Lantern. The dark there is "the bramble": what grows in the
  dark when no sprout tends the soil. Old Thornback is its oldest root, which
  links the cartridge to Pocket Lantern's dark alphas without making Thornwatch
  a side quest of it.
- **Cast in cut-scenes:**
  - Erin, the gardener: calm, practical, gives the mission.
  - Marcus, the hype man: cheers, builds, "see one, send one" energy.
  - Louie, the lookout: warnings, barks, the Shiba who stops things.
  - Bottie, who appears from far off on the bramble edge with his button, and
    stays a voice until the final night (a Sproutwild tie-in).
  - King Bibi, who sends a letter, not a visit (a Pocket Lantern tie-in).
- **Cut-scenes:** a short cinematic at each garden's start and at each boss,
  done with the existing sprite art (ported from Sprouts and Rootdeep, not drawn
  new). Three to four drawn scenes per garden, each one voice at a time, with
  the "A to continue" pattern of Pocket Lantern.
- **Easter eggs to plant:**
  - the Wending Lake monster as a rare wild on the Long Beds
  - a Squire's castle stone as a hidden tower skin
  - MOSSMAN (formerly the Grassman) as a hero skin or a sightseer in the background
  - a ladybug that rides a creep and takes one hit from the player if missed
  - Bottie's "bzzt" as the boss-enrage line
  - the Lantern as a sun-drop source, a nod to Pocket Lantern's light economy
  - the Data Center's glitch as a "simulation error" screen on a secret night
- **Replay:** stars per night, a challenge per garden with odd rules, a HARD
  mode, and The Long Night (endless) with carry-over. Plus a sprout collection
  book (every creep and sprout seen).

## 5. Graphics and readability

- **Current problem:** the art doesn't read at phone size and has no clear
  palette. The v3.4 to v3.7 contrast and size audits passed on text, but the
  sprites still blur together.
- **Direction:** a warm garden palette per garden, a readable silhouette for
  each creep (checked at 240px), and a single outline style across the cast.
  Reuse Sprouts and Rootdeep sprites where they exist, so the console looks
  like one world.
- **Test:** screenshot every new screen at 360px and at full size, and compare
  it with a Pocket Lantern screen. If Thornwatch looks like a different game
  next to them, it isn't finished.

## 6. Menus and text

- Front door stays (Will's rule 7). Upgrade the look to match the console's
  other menus: the pause and build menus in Pocket Lantern are a good model.
- Every screen states what to do next. Defeat screens teach the counter
  (rule 11).
- Text audit stays a standing check (rule 6).

## 7. What to measure before v4.0 is built

- Time to first fun (first kill with a tower the player chose).
- Number of decisions per minute in the first garden.
- Whether money is still unspent at the end of a winning Long Night run (rule 4).
- How many nights a naive player plays before quitting, and why.
- A readability check of each creep silhouette at 240px.

## 8. Open questions for Will

1. **Derek.** Still the placeholder veto from the handoff. Keep, cut, or
   promote?
2. **Canon.** Are the move names (MAZEL TOV LASER, TOWEL WHIP, and so on) fixed
   for v4, or may the new upgrade paths use new names? Rule 12 says ask first.
3. **Bottie and Bibi.** Okay to have them in Thornwatch's cut-scenes, given they
   belong to Pocket Lantern's story?
4. **Standalone or inside the console.** Should Thornwatch keep the four-game
   file, or move to its own cartridge file when it's ready? The user said later.
5. **Length.** Three gardens with a Long Night is roughly the width Will asked
   for. Is that the target, or is a fourth garden wanted?

## 9. Recommendation

Rebuild Thornwatch as v4.0 with: BTD6-style upgrade paths; a sun-drop economy
from the Lantern; round-calling; three gardens with cut-scenes and a cast; the
Easter eggs in section 4; a Long Night mode; and a redrawn look that matches the
console. Build in this order, with a playtest after each step: the core loop and
first garden, then the upgrade paths, then the cut-scenes, then the rest.

Each step is a delivery, awaiting Will's verdict. Nothing is called fixed until
he confirms on his phone.
