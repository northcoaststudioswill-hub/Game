# SPROUTWILD — analysis & growth ideas
### lil Bottie, 2026-11-14 — what was asked, what shipped, what the tests say, where it grows

## 1. The brief vs the build

**Will asked for:** GBA-style Palworld in the Sprouts universe on the handheld —
collect creatures, they fight (no over-the-top guns), the GOAL is base building,
gym battles, sectors instead of an open world (his call, for loading). Then:
research Palworld + Dragon Quest Builders and apply what fits; the base starts
small and grows; Louie is talkable and guides you around the base; new areas get
Sprouts-style discovery pop-ups; the universe's characters are in it with their
movesets — Will/Erin/Marcus playable, the others as NPCs when not chosen;
creatures are placeholders for now, reuse Sprouts assets where it helps. Then:
a proper intro phase (never start at a gym), and fix Will vanishing as an NPC.

**Shipped (v2.1):** all of the above, structurally. 12 species kin to the 6
sprout types, Sun Orb catching, party of 3 + base box, Field Guide, GBA-layout
turn battles with keeper signature moves (SELFIE FLASH / TOWEL WHIP / HYDRO
JET), 4 Sigil gyms across 5 sectors, grid base building with workers, Base
Levels 1–3 via mission boards, gratitude hearts, Louie the guide, discovery
banners, keeper switching with passives, and a 5-step intro quest chain.

## 2. What testing found (this pass)

- **109 functional checks green** across 4 suites, plus Sprouts/Rootdeep
  regressions on the same file.
- **A REAL bug the soak caught: blacking out soft-locked the game.** When your
  whole party fainted, the game never returned control to the world state —
  the battle screen crashed every frame forever. This is very plausibly the
  "game broke" from the first play session: lose one early fight and the game
  dies. Fixed, plus a safety guard so a dead battle can never trap the state
  machine again. A 12,000-frame chaotic soak (random wandering, battles,
  menus) now runs with **zero errors**.
- **Gyms were victory laps.** Simulated with fair parties (3 partners at the
  leader's level, sensible types): 8/8 wins at every gym. Team levels raised
  twice; now fair parties win ~6–7/8, type-smart players are rewarded, and
  underleveled 2-partner teams get walled — a healthy curve.
- Balance is harness-tuned, not human-tuned. Only Will's phone play settles it.

## 3. Honest gaps (asks not yet fully honored)

1. **Creatures are still placeholders** — by Will's word ("we'll improve upon
   them"), but nothing about them grows: no evolutions, no individuality
   beyond stats. The single biggest missing creature-game verb.
2. **Gratitude hearts have no sink.** Dragon Quest Builders spends gratitude;
   ours only fills a mission checkbox, then accumulates forever.
3. **The story has no ending.** Four Sigils → nothing. No final trial.
4. **Sectors are thin** — nodes, grass, a gym. No inhabitants besides leaders,
   no secrets, no day cycle (Sprouts had a 240s day; the valley never sleeps).
5. **The Cottage is a stamp, not a place.** Sprouts had a house interior;
   ours can't be entered.
6. **First battle teaches nothing in the moment** — the orb/keeper lessons
   live in a Louie tip most players will never open.
7. **Base Level caps at 3** and the plot stops growing — Will said "eventually
   get bigger"; levels 4–5 with a second ring of land are the natural tail.
8. **Workers are assignment-only** — no care loop (Palworld's food/beds/
   sanity) and no auto-priority when a partner knows two jobs.

## 4. Growth ideas

**Shipping now (v2.2):**
- **The Lantern Shop** — spend gratitude hearts at the Base Lantern on
  building plans: the **Sawmill** (PLANTING partners mill wood — closes the
  wood economy loop) and the **Lantern Statue** (hearts drop far more often).
  Hearts become a currency, not a counter. (Gap 2)
- **Evolutions** — the three starters evolve at Lv 16: CINDERCAP → EMBERCAP,
  DRIZZLET → TIDESTAG, FERNFANG → FERNHOWL, each with a signature 100-power
  move (MAGMA BURST / TIDAL SURGE / THORNSTORM). The Field Guide grows to 15 —
  the last 3 can only be earned by raising, never caught. (Gap 1)
- **The Champion trial** — with all 4 Sigils, Zephyr Peak's gym becomes a
  fifth bout: **THE FIRST KEEPER**, a memory of the Lantern itself, 4 partners
  Lv 28–30. Win and the game has an ending (and an endless rematch). (Gap 3)
- **Battle tutorial in the moment** — your first wild battle explains itself:
  weaken → ORB, and the once-per-battle keeper move. (Gap 6)

**Next tier (v2.3 candidates):**
- **Cottage interior** — walk inside: bed, guide desk, keeper portraits;
  Louie naps by the fire. Sprouts' house, honored. (Gap 5)
- **Day cycle** — Sprouts' 240s day returns: dusk tint, night spawns shift
  (AURICORN haunts Gloom Hollow after dark), Louie sleeps at night. (Gap 4)
- **Base Levels 4–5** — a second mission board tier and the full plot;
  unlock the Hot Spring (worker care, lite: assigned partners recover and
  drop bonus hearts). (Gaps 7, 8)

**Later / bigger:**
- Sector inhabitants: one wanderer per sector with hints and tiny fetch
  errands paid in petals. Sector secrets: one hidden node per sector.
- Sphere tiers (Palworld): Grove Orb / Sun Orb / Radiant Orb with real
  catch-rate tiers, crafted at the bench.
- Creature art pass: replace placeholder sprites species by species (Will's
  call on timing), plus idle animation frames.
- Condensing (Palworld): sacrifice duplicate catches to star-up a partner's
  work skills — gives duplicates a purpose.
