# Research notes — Palworld × Dragon Quest Builders → Sproutwild v2

Researched 2026-11-14 at Will's direction. What each game does, and the
call on whether it belongs in a one-screen-sector GBA collector.

## Palworld — the base as a workforce

- **Base Level is a mission checklist, not XP.** The Palbox lists Base
  Missions (deploy N workers, build specific structures). Completing the
  board is the ONLY way to level the base; each level adds **+1 deployable
  worker**, and milestone levels unlock extra bases.
  → **ADOPTED, almost 1:1.** Sproutwild v2: Base Level 1→3, mission board
  on the BASE screen, worker cap grows per level, level-up is a ritual
  (ring the Base Lantern) once the board is clear.
- **Work Suitability drives everything.** Each Pal has job levels
  (Kindling, Watering, Planting, Mining, …); suitability level = output;
  workers auto-pick jobs by an internal priority and only work inside the
  base radius. → **Already in v1** (work skills + assignment); v2 keeps
  skill level = yield and adds FORTUNE-style boosting.
- **Care systems (food, beds, sanity, hot spring)** keep workers
  productive; neglect collapses output. → **DEFERRED.** A light version
  (Pen = beds, berry upkeep) is a v3 candidate; v1/v2 keep production
  unconditional so the loop stays kind.
- **Sphere tiers** (better catch items), **raids**, **breeding/condensing**
  → deferred; sphere tiers are the most likely next add.

## Dragon Quest Builders (1 & 2) — the base as a community

- **Gratitude hearts:** residents drop hearts when happy — using rooms
  you built, eating, and especially when a **room type is built for the
  first time**. Collect hearts → **ring the town bell** → base level up,
  unlocking recipes and more residents.
  → **ADOPTED with a Sprouts twist.** Workers drop gratitude hearts as
  they produce; first-of-a-kind buildings burst gratitude; hearts are
  collected by walking over them; the level-up happens by ringing the
  **Base Lantern** at Sunkeep once the mission board is done.
- **Rooms are recognized, not just placed** (a kitchen is a kitchen
  because of what's inside it) and residents visibly live their jobs.
  → **PARTIALLY ADOPTED.** Our buildings are single objects, but workers
  stand at them and hearts make their labor visible. Full room
  recognition needs a block-building layer — out of scope for this cart.
- **Tablet Targets / quest-givers with "!" markers** — clear checklist
  goals with NPCs pointing at them. → **ADOPTED via Louie**: the guide
  dog computes your actual next step, and SHOW ME has him physically
  lead you to it — the DQB quest marker, as a dog.

## What this means for Sproutwild's shape

Palworld supplies the *economy* (missions → levels → worker caps),
Builders supplies the *feeling* (gratitude, first-of-type rewards, the
bell ritual, residents with visible jobs), and Sprouts supplies the
world and cast. The base plot literally growing at each level is the
Palworld base-radius idea made visible on one screen.

## Round 2 (v4.7): Pikmin / Palworld / Pokemon GBA — engagement research

Played Sprouts itself in the rig (title lineup + menu-over-world)
and read the Pikmin 1/2 manuals, Palworld guides, and Gen-3
Pokemon mechanics references. What transferred:

- **Pikmin**: the captain's verbs are throw / whistle / pluck.
  Thrown Pikmin "react to anything near them that's interactive
  (item, enemy, wall)" — engagement happens BY THROWING, in the
  world. Pellets show the carrier count; color-matching a delivery
  to its Onion pays bonus seeds (typed synergy — our kinship).
- **Palworld**: catch odds are tiny at full HP — weaken first,
  then throw. Work suitability is shown on the creature and
  staffing is a roster decision. Fights start by YOUR choice of
  engagement in the open world.
- **Pokemon GBA**: the battle is a RITUAL — screen transition
  into a dedicated turn-based screen; grass is where wilds live
  and is avoidable ("when you don't want to fight, avoid the
  grassy areas"); the ball shakes as the catch resolves.
- **Applied in v4.7**: wilds never ambush (contact + grass
  insta-battles removed); grass rustles REVEAL a wild; battles
  are ACTIVATED by A (prompt names species + level first) or by
  a sprout thrown at the wild; every battle opens with the
  engage transition (bars + banner); gym battles use it too.
  Debugging also found throws aimed off a stale axis pair —
  aim now uses the true last-pressed facing.
