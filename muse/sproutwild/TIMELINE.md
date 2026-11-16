# TIMELINE — one console, three cartridges (Nov 13–14, 2026)

How Sprouts became Sprouts + Rootdeep + Sproutwild in about 24 hours.
All times EST. Will's words are the steering; the full verbatim record
is in `COMMAND-LOG.md`. Screenshots referenced are in the montage
(`montage-development.jpg`) and the `shots/` folders.

## Act 0 — the original (Fri Nov 13)

- **10:12 PM** — Will hands over `Sprouts.html` + notes: *"analyze my
  game and make a game on a blank cartridge I can hand back off to
  Claude."* Sprouts is analyzed cover to cover: 6 sprout types, 22
  missions, Erin's garden, the house, 33 achievements, one economy
  where everything feeds everything else.

## Act 1 — Mothlight, rejected (Fri night)

- A 90-second moth arcade game is built for cartridge 2.
- **11:22 PM** — Will: *"That game is too basic I want it matching in
  depth think like hades."* Mothlight is deleted the same night.

## Act 2 — ROOTDEEP (Fri night → Sat afternoon)

- **v2.0** — a full Hades-style roguelite: the Hearth hub, 12 chambers,
  6 gods' boons, 3 bosses, death loop, heat.
- **v2.1** — *"A lot of the text doesn't fit"* → text-fit + sprite pass.
- **v2.2** — *"graphically unpresentable… you're making a game!!"* →
  a render rig is built so fixes can be seen, not guessed; the
  explainer screen is deleted forever.
- **v2.3** — Legacy of Goku II studied as the graphics bar; outlines,
  chunky sprites, worn floors.
- **v2.4** — Marcus gets his real voice: a smart-ass hater of all.
- **v2.5** — sprouts become the currency (pods, strings, banking,
  the Ledger); front end arrives: cinematic, main menu, settings.
- **v2.5.1** — Will's phone: *"The intro is a green screen error."*
  Root cause: a sprite record handed to drawImage. The rigs are
  hardened to fail loudly on it ever after.
- **v2.6** — NPCs wander with multi-page dialogue; sprout drops
  guaranteed (Will couldn't get any).
- **v2.7** — stations and routes; nobody starts at the bottom.
- **v2.8** — buds as super-weak auto-battlers; NPC spacing; B cancels
  dialogue; SELECT demoted (awkward to press — Will's call).
- **v2.8.1** — a played tester pass: the "broken dash" was really one
  dash charge starving; chambers lengthened.
- **v2.9** — the Cast update: Will, Erin, Louie, Marcus playable with
  fighting-game signature moves (MAZEL TOV LASER, TOWEL WHIP,
  HYDRO JET, THE BOOF) and earned unlocks.
- **1:04 PM Sat** — Will asks how to hand it off. FOR-CLAUDE.md is
  rewritten fresh; the fighting game is flagged in it (moves mirror
  a game Bottie has never seen — ask Will, never invent).
- **3:44 PM** — a Rootdeep TIMELINE.md + snaps are made for export.
- **Rootdeep is closed by Will's word.** It is not resumed.

## Act 3 — SPROUTWILD (Sat, 1:09 PM → 10:07 PM)

- **1:09 PM — v1.** Will commissions it: *"make GBA Pal World but in
  the Sprouts universe… sectors… base building… let's see what you
  come up with for the first try."* Cartridge 3: 12 species, GBA
  battles, grid base building, 4 gyms.
- **v1.1** — *"The game broke."* A physical playtest finds wild
  encounters nearly unreachable (a grace timer that only ticked in
  grass). Fixed; the lesson (test like a player) sticks.
- **v2.0** — Palworld + Dragon Quest research: Base Levels via a
  mission board, Louie the talkable guide, discovery banners,
  keeper switching (Will/Erin/Marcus).
- **v2.1** — no gym at the start; proper intro; the Will-disappears
  portrait bug (Sprouts has no CH.WILL) found and fixed.
- **v2.2** — audit pass: asks vs build, tested, ideas, grown.
- **v2.3** — scrolling 480×360 worlds ("it should move around like
  Sprouts"), bigger trees/rocks, partners in the overworld.
- **v2.4 — the hook pass.** *"It needs to hook better."* 4-beat story,
  walk-up starter choice, visible wandering wilds.
- **v3.0** — base rebuilt tall, build pretty much anywhere; the
  Meadow becomes a wild road; Lantern Town added; real cinematic.
- **v3.1** — starter detail cards with confirmation; the Lantern Gate
  teleporter, taught by Louie; **standing process set: screenshots
  every build + a standalone CHANGELOG.md every version.**
- **v3.2** — *"instead of throwing orbs, you throw sprouts."* Sun Orbs
  retired; the Sprout Toss is born. Trees become solid; depth sorting.
- **v3.3** — party leader; grid menus; battle scenes rebuilt as
  sector dioramas; the world re-paletted toward Sprouts' lawns.
- **v3.4** — node HP (15 hits), stamina, tools (axe/pickaxe tiers);
  the game starts with sprouts tending, Sprouts-style.
- **v3.5** — the vocabulary lands: creatures are **buddies**, sprouts
  are **buds** (later just "sprouts"); the living patch farm.
- **v3.6** — autonomous pass ("I didn't even have to get sprouts"):
  NPC asks, day cycle, hidden treasures, typed patch yields.
- **v3.7** — the game explains itself: lessons + the Keeper's Guide.
- **v3.8** — *"Do a total graphics overhaul."* All 15 species redrawn
  at 20×16; baked ground; the Great Lantern monument.
- **v3.9** — *"The creatures are NOT sprouts."* The split rebuilt from
  Sprouts' source: sprout CREW with jobs staffs production; buddies
  only fight. Patch sprouts drawn by Sprouts' own drawBud.
- **v4.0 — the sky clanks.** Bottie becomes the villain (descends
  after the first sigil, raids, secret gym 5); sprout tool jobs;
  name pills hide up close; are-you-sure prompts; selection
  cinematics; character overhaul.
- **v4.1** — *"you still give them for free."* The opening becomes a
  staged tending lesson (water → grow → pluck); Erin/Marcus back to
  their original models; text fitted line by line; cinematics stay
  cinematics. (Lessons-as-text-boxes are later removed by this same
  logic — teaching by doing wins.)
- **v4.2** — *"see how they go in the ground?"* The crew-join teleport
  is found and made a visible departure; wild sprouts become
  pluckable followers that haul finds home.
- **v4.3** — Will orders a played verdict ("how about you play this
  game"). Playtest receipts published with the build; followers work
  at base; crew lives at the patch; every sprout answers A; the
  three starters redrawn at 24×20.
- **v4.4** — Sprouts' own throw/call system adopted: SELECT swaps
  command (BUDDY/SPROUT), B throws sprouts that fetch and bring,
  hold B whistles; apples get claims + respawns; growth by age.
- **v4.5** — *"Why do they plant themselves?"* Sprouts' deliver()
  loop adopted: fruit deliveries plant seeds; the patch is
  build-protected; depth split kills the clipping.
- **v4.6 — the Garden.** Will: *"you didn't change anything I asked —
  do a deep criticism… and then rework."* Playtest + 8-point
  criticism published (base plays itself, seed rule monocultures to
  LEAF, work illegible, A dead on wrong modes, text off its bar).
  The patch is rebuilt as a fenced garden: 6 plots with drawn
  states, 3 typed bushes, visible plant trips, fruit-typed seeds.
- **v4.7 — your move.** Sprouts played again; Pikmin, Palworld, and
  Pokemon GBA researched. Battles become **activatable**: no
  ambushes, grass reveals wilds, A challenges by name and level, a
  thrown sprout engages, and every fight opens with the GBA bars +
  banner. A stale-axis throw-aim bug (throws flying diagonally
  since v4.4) is found by the playtest and fixed.

## Act 4 — the export (Sat night)

- **10:06 PM** — Will: *"create a handoff and a timeline and make a
  big one photo montage of all the photos you shared in development
  with timestamps."*
- **10:07 PM** — *"and a big log of commands I sent and a breakdown
  of by the word things I said."*
- This package is the result: FOR-CLAUDE.md, this TIMELINE.md,
  COMMAND-LOG.md (47 messages, 3,492 words, counted), and
  montage-development.jpg.

**State at export:** Sproutwild v4.7, trilogy file 4,727,570 bytes,
23 Sproutwild suites + soak + Rootdeep green, 0 console errors.
Nothing in Sproutwild is phone-confirmed past Will's v4.5 play;
v4.6 and v4.7 await his verdict. Sprouts was never modified.
Rootdeep is closed. The shelf is full: Sprouts · Rootdeep · Sproutwild.
