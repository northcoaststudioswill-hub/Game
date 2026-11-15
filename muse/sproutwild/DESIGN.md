# SPROUTWILD — design sheet (v4.7, 2026-11-14, lil Bottie for Will)

## v4.7 — ACTIVATABLE WILD BATTLES (how fights start now)
- **No auto-start**: contact with a wanderer does nothing;
  grass steps roll a REVEAL instead of a battle — a wild
  spawns beside you (wd.reveal=12s ttl, hx/hy home, stays
  near its rustle, then fades). Cap: 5 wilds, one revealed
  near the player at a time.
- **Activation A**: wNear wild entry (17px) -> 'BATTLE
  <SP> Lv<n>'; A handler consumes the wild, wildCd=18,
  wEngage('WILD <SP>!', () => wStartWildAt(sp, lv)).
- **Activation THROW**: wThrowTarget snaps to wilds
  (kind 'wild', nd=wd) within 26px of the aim point; on
  'seek' arrival, a wild within 20px of the landing OR
  the intent point engages the same way; the thrown
  follower returns to 'follow'.
- **wEngage(label, fn)**: state 'g4engage', 0.55s — bars
  sweep (0.4s), banner at full close, then fn() starts
  the battle (wild or gym — gym confirm wraps wStartGym).
- **Aim fix**: wThrowTarget uses W4.lastDir (the true
  facing), NOT P3.ax/ay (stale-axis diagonals).
- Wilds draw a '!' when revealed or the player is <30px.
- Raids are unchanged — Bottie ambushing YOU is his job.

## v4.6 — THE GARDEN (replaces the patch as a system)
- **Plots**: WPLOTS 8 positions, wPlotCount() = 6 + 1 per
  Garden Bed (max 8). W4.patchBuds entries ARE plots:
  {type<0 empty, seedTy, by (claim), forPlot, bush,
  itemTy}. Fence + plot squares baked in wBakeGround;
  garden rect protected in wCellFree (158-322 x 324-392).
- **Bushes**: W4.bushes at BASE — (150,354,EMBER),
  (330,354,DEW), (240,408,LEAF); fruit 0-2, regrow 12s.
  wPickBush(): fruited bush whose type the garden has
  least (anti-monoculture). The WTENDITEMS base apple
  field is GONE (lesson keeps its own td.items).
- **Worker cycle** (wPatchUpdate): soil → claim empty
  plot (or none) + bush → fetch (pick: fruit--, itemTy=
  bush.type) → plant (seedTy=itemTy in the claimed plot,
  PLANTED float) or carry (harvest → wPatchYield) →
  back → soil. Max 2 active. Followers run the same
  cycle at base (b_fetch bush, b_plant, b_carry).
- Planting is NEVER a side effect of delivery anymore;
  wTryPlant is deleted. Crew-join say is 31 chars.
- sproutinfo covers plots (EMPTY PLOT / SEED), babies,
  and grown workers by mode; PLUCK offers on any grown
  garden sprout and releases its claim on the way out.

## v4.5 — reproduction is a loop, not a spawner
- **wTryPlant(ty)**: called on every patch/follower fruit
  delivery (wPatchYield head; follower b_carry). Plants
  into the first patch spot with type<0 && seedTy==null:
  seedTy=deliverer type, age=-7. LUCKY deliverers plant
  twice. Germination in wPatchUpdate only advances
  planted seeds (age>=0 → type=seedTy, POP float). Bare
  spots NEVER sprout. Seed spots draw a type-colored dot
  on the mound; sproutinfo covers seeds ('SEED · planted')
  and bare soil ('SOIL · fruit seeds plant here').
- The patch lifecycle is now fully caused: delivery →
  seed → baby → worker → (3 deliveries) crew at the patch
  → assignment frees the spot → next delivery replants.
- **Patch ground is protected**: wCellFree rejects cells
  over the soil rect (188-292 x 328-374).
- **Depth split**: wDrawPatchBud/wDrawFol helpers; patch
  buds, tend buds, and followers draw behind the player
  when their y <= P3.y and in a front pass after the
  player when y > P3.y.

## v4.4 — command like Sprouts; an honest apple economy
- **SW.cmdMode 'buddy'|'sprout'** (SELECT in the world
  swaps; HUD pill bottom-left). BUDDY: B = command toss
  (lead buddy works a node). SPROUT: B = wThrowSprout —
  nearest train sprout flies (0.45s arc, f.z) to
  wThrowTarget (facing point snapped to node/treasure/
  heart within 26px), then seek→work (node HP -1/0.42s,
  yield bundle WNODEY)→bring (walks the yield to the
  KEEPER and hands it over). Hold B repeats throws every
  .26s; hold B past .5s in EITHER mode = whistle (ring to
  54px; work/seek/bring/haul sprouts inside drop tasks →
  'return'). wFolSync resets thrown states on sector hops.
- **Apples are a claimed resource**: W4.items (BASE,
  rebuilt per entry) {x,y,taken,by,regrow}; wClaimItem
  gives exclusive targets to patch buds and base
  followers; pickup sets taken + regrow 22 (lesson items:
  same rules, regrow 12). Draws read the live item lists
  (taken apples are gone; regrow<5 shows a green nub).
- **Lesson sprouts grow by AGE** (stageOf: <6 baby, <14
  sprout, grown after; staggered pops via negative ages);
  the stage-3 gate is age-based and independent of
  deliveries; carriers finish, then all settle home.
- sproutinfo prompts carry txt:'ASK'; world floats clamp
  to the camera view; the catch quest label is short.

## v4.3 — the sprout system, made legible
- **Followers work at home**: W4.fol modes b_rest/b_fetch/
  b_carry/b_back at BASE (patch loop, wFolYield deposits
  via wFolCredit); road modes unchanged. Mode conversion
  happens in wFolUpdate on sector context.
- **Crew live at the patch**: SW.crew entries carry
  atPatch. Joining the crew keeps the patchBud working
  (pb.crew + pb.crewIx); wCrewSetJob(c, job) is the ONLY
  way jobs change — it reseeds the spot when a resident
  leaves for a job and re-seats it on unassign (free spot)
  or the plaza row by the Lantern steps (drawn, y~132).
  wInitPatch re-seats resident crew on every rebuild.
- **Patch yields float at the sprout's spot** (pb.pend,
  flushed when it gets home), not at the Lantern.
- **Every sprout answers A**: wSproutInfo catch-all in
  wNear (last priority) — follower/patch baby/plaza crew/
  building worker all report what they are and do.
- **Starters redrawn** (newart3.py): CINDERCAP, EMBERCAP,
  DRIZZLET, TIDESTAG, FERNFANG, FERNHOWL at 24 wide.

## v4.2 — they follow you home
- **Patch lifecycle (legible)**: soil spots draw a SEED mound
  while type<0 (nubs at age>-3). Crew-join is a departure:
  wPatchYield sets mode 'join' — the sprout hops at the
  Lantern ~0.9s with its name float, THEN the spot reseeds.
  Never an instant vanish.
- **Followers (SW.followers, types, cap 4)**: wild sprouts
  (W4.loose, habitat-typed, idle-wander around hx/hy) are
  plucked with A (near 'wildpluck') -> they FOLLOW: W4.fol
  chain-trailing entities (drawBud, stage 2). Walk-over
  collecting is REMOVED. Full train -> pluck pays the pouch.
- **Hauling**: in wild sectors each follower's haulT counts
  down; at 0 it takes a typed yield (wFolYield) to the
  sector Gate (mode 'haul'), credits on arrival ("sprout
  mail!"), waits away 6-11s (mode 'away', undrawn), then
  returns through the Gate (mode 'return' -> 'follow').
  wFolUpdate runs in worldUpdate; wFolSync rebuilds the
  train on sector entry.

## v4.1 — grow them yourself
- **Opening (final form)**: cinematic (6 beats) -> world ->
  Louie (quest 1; he GUIDES you to the patch) -> patch SEEDS:
  A waters (SW.tendStage 1) -> babies pop at 1.2s -> fetching
  at 5s (stage 2) -> each sprout delivers twice, growing
  baby->sprout->grown (stage 3) -> PLUCK 2 by hand (stage 4,
  tendDone) -> clearing choice. Louie narrates via says.
  NO text-box lessons: WLESSONS/g4lesson are unreachable.
- **No free sprouts anywhere**: wBefriend grants nothing;
  the pouch is plucked/won/bought only. SWF.tend() hook
  models a finished teaching (plucked EMBER+DEW, LEAF left).
- **wInitPatch()** builds the living patch ONCE (guard:
  existing patchBuds are kept); sector trips no longer wipe
  it. Trio seeding skips types in SW.trioPlucked.
- **Erin/Marcus = original Sprouts models**: SWCHR.ERIN /
  SWCHR.MARCUS are adapters over CH.ERIN / CH.MARCUS
  (Will prefers the originals). New art stays for the rest.
- **Animation**: NPC idle bob, playable Erin/Marcus step-bob
  (keys-held) + breathing, Bottie hover at the Peak, cine
  portrait float. All procedural (baked sprites).
- **Text fitting**: swRows truncates the left label against
  the right one (wFit); WGUIDE lines <= 34 chars; swRows
  descriptions must wrap to <= 2 lines at 214px.

## v4.0 — the sky clanks
- **SWCHR**: Sproutwild's own character sprites (SWSPR-built):
  WILL/ERIN/MARCUS/RANGER/SCOUT/PIP/ELDER (16x20, PIP 16x16)
  + BOTTIE (20x24). Drawn via wChar(who,x,y,w). Sprouts' CHR
  untouched; playable Will still uses drawPlayerSpr (animated).
- **Name pills** hide when the player is within 34px of the
  character (NPCs, Louie, starter trio, Bottie).
- **Base shows only working sprouts**: patch, building crews,
  tool crews. No wanderers, no ambience sprouts.
- **Earning**: tend trio seeds the patch (dlv 1, SW.trioSeeded);
  crew grows only via deliveries. No grants anywhere.
- **Tool jobs**: crew job -2 = AXE, -3 = PICK (bench -> SPROUT
  JOBS, state g4jobs). wJobWork walks the sprout to base
  trees/rocks, works them hit by hit, wGather pays out, +2 wxp
  per felled node. Parked by the patch when no work stands.
- **Confirms** (g4confirm, wConfirm(txt, yesFn)): keeper
  switch, gym challenge, lantern ring.
- **Selection cinematics** (g4cine): keeper switch + first
  befriend. Functions named swCineUpdate/swDrawCine — NEVER
  plain cineUpdate/drawCine (Sprouts + Rootdeep own those).
- **BOTTIE**: SW.bottieSeen/bottieBeat. Descent cinematic
  (g4bottie) triggers at BASE with >=1 badge, quest>=5.
  WGYMS[5] at PEAK via wGymIx (needs gymDone[4] + bottieSeen).
  Raids: 30% at day-rollover at BASE while unbeaten;
  wStartRaid builds BT mode 'raid' (2 mons, RUN allowed at a
  15-petal trash penalty, win +50).
- **Text**: wFit(s, maxPx) truncates with an ellipsis; applied
  to the objective line and floats. Says stay <= 70 chars.

## v3.9 — sprouts are not buddies (the canon split)
- **SPROUTS** = Sprouts' own plant folk (TYPES 0-5), drawn with
  Sprouts' drawBud() everywhere in Sproutwild. g4Draw zeroes
  Sprouts' camera globals (ox/oy) first — drawBud subtracts
  them; Sprouts recomputes them on its own frames.
- **THE CREW** (SW.crew: {type, dlv, wxp, job}): patch sprouts
  join at 3 deliveries (wPatchYield); the tend trio joins at
  the opening. Cap wCrewCap() = 4 + (baseLv-1)*2 + pens*2.
  Unassigned crew wander the base (W4.crewPos); assigned crew
  stand at their building (drawn in wDrawBuilding).
- **Production** (wProdTick): sprout workers only. Affinity via
  WSKILLTYPE (building Pal-skill -> sprout type): affinity
  producer yields 2 + min(2, wxp/6); off-type crews yield 1 at
  50%; LUCKY crew +1; ERIN keeper +1. Buddy b.workers is inert
  (cleared on load; established saves get the starter crew).
- **BUDDIES** = battle, following, gyms. Never base labor.
- Toss/pouch stock (SW.buds) is SPROUT stock: HUD 'SP', battle
  option SPROUT, projectile drawn with drawBud.

## v3.8 — total graphics overhaul
- **Sprites**: all 15 species redrawn at 20x16, 3-tone shading,
  source of truth `newart.py` (preview-sheet workflow). Sprite
  draws scale by _spr.ow/oh everywhere, so the bigger art flows
  into overworld/battle/choice/dex/nursery automatically.
- **Ground**: wBakeGround() bakes each sector's texture (checker,
  speckle, paths, streets, base plaza) into W4.groundCv on entry;
  drawWorld blits it. Dynamic leftovers: grass patches, shore
  water, lantern posts, Gloom overlay, night tint.
- **Great Lantern monument** drawn always at BASE (plaza baked),
  ~64px wide at (240,10-90); interact point unchanged (240,46).
- **Battle**: wLerpC gradient skies, sun/clouds or moon/stars,
  ridge silhouette, grass mounds + soft shadows.

## v3.7 — the game explains itself (Will: no sprouts at the start, nothing explains the game)
- **Lessons** (state g4lesson, WLESSONS, SW.lessons flags): 'start'
  (3 pages, fires once in wIntroDone on fresh games) and 'patch'
  (3 pages, gates wStartTendGo on first patch touch). A advances,
  B skips; closing the patch lesson starts the tending.
- **Intro beats rewritten** around buds/buddies (no more
  'wildsprouts'). Patch soil + sleeping sprouts drawn from
  quest 0; patch proximity active at quest 0 (redirects to Louie).
- **KEEPER'S GUIDE** (state g4guide, WGUIDE 7 pages): pause row
  appended before RESUME (no index shifts). ◀▶ turn, B back.
- First nightfall: one-time say line (SW.lessons.night).

## v3.6 — the valley asks (mined from Sprouts' own systems)
- **Asks**: PIP/ELDER (town talk) + LOUIE (menu row) hold one
  ask each (SW.asks): buds/res delivery (deducts) or catch
  (claim). Rewards petals + 25-30% Tonic bonus. wGenAsk/wOpenAsk,
  state g4ask. NPC proximity is sector-aware (was BASE-gated —
  town NPCs were dead since v3.0); keeper swap guarded to
  WILL/ERIN/MARCUS.
- **Day cycle**: W4.dayT 0..300s, SW.day counter; wDark()
  darkness 0..1 (dusk 185-225, night 225-282, dawn to 300);
  tint + Lantern glow drawn pre-restore (HUD stays bright);
  night encounters x(1+dark*.6). HUD: 'DAY n · DAY/DUSK/NIGHT'.
- **Treasures**: 1 per sector per entry (seed+131, avoidance
  placement), walk-over rewards (petals/buds/tonic/ingot),
  SW.treasures counts them.
- **Typed patch work**: yields flavored by bud type (EMBER
  smelts ingots, PEB stone, DEW berry/petal, LEAF wild buds
  30%); ZIP buds move at 54px/s vs 36.

## v3.5 — buds and buddies (Will's correction, grounded in Sprouts' code)
- **Vocabulary (hard rule)**: creatures = BUDDIES; sprouts = BUDS.
  Buds are the capture material; buddies are what buds command.
- **Buds work like Sprouts' sprouts** (mkBud entities, stageOf
  ages 12/30): the patch germinates type-buds in soil spots
  (3, +1 with a Garden Bed); stage 0/1/2 drawn at 9/12/16px.
  Grown buds auto-work (fetch apples → carry to Lantern → yield;
  15% they bring back a wild bud) OR get plucked (+1 stock,
  spot regrows). Max 2 fetching at once.
- **Wild loose buds**: 1–2 per wild sector, type from the
  sector's species table, walk-over collect; placement avoids
  nodes/grass/solids.

## v3.4 — hands, tools, sprouts first (Will's systems direction)
- **Gathering**: nodes have HP (tree/rock 15, bush 6); A = a swing
  (bar above the node, chip floats, shake). Swing = 5 stamina
  (100 max, regen after a breather, Winded < 5). REST restores it.
- **Tools**: AXE + PICKAXE live at the Tinker Bench (g4tools):
  craft/upgrade to Lv3, +1 dmg per level on their node kind, Lv3
  yields +1. Costs in WTOOLCOST (mirrored per tool). Partner
  command-toss work uses the same node HP (2 dmg/strike).
- **Opening**: quest 1 = tend the SPROUT PATCH (buds fetch apples
  to the Lantern; 3 deliveries = grown) BEFORE the choice clearing
  opens. Befriend grants +3 own buds, +2/+2 the other starters —
  the sprouts you raised are your first catching buds. Quest
  numbers did NOT change (tending is a sub-phase of quest 1,
  gated by SW.tendDone); old saves derive tendDone from facts.

## v3.3 — leader, working menus, a Sprouts-feeling world
- **Party leader**: PARTY screen, A makes the selected partner lead
  (party[0], ★ LEADER). Leader = overworld follower + battle opener.
  A on the leader = Tonic, START = send to box.
- **Grid navigation** in battle (menu / moves / bud picker are 2-col):
  LEFT/RIGHT = ±1 cell, UP/DOWN = ±1 row. Lists elsewhere stay
  up/down. If a future menu is drawn as a grid, it must use the grid
  nav — linear nav on a grid is the bug Will reported.
- **Battle stage**: sector diorama (sky + tree line + sector grass +
  dirt patch + platforms), framed HP boxes with type plates, 56px
  bottom panel with per-phase layouts, bud picker as a 2-col grid.
- **World feel**: palettes lifted to Sprouts' bright greens, flowers
  + clover in the ground pass, lantern posts along roads, fences at
  the base gate, gym windows/door trim.

## v3.2 — throw sprouts, not orbs (Will's idea, fleshed out)
- **Recruiting is the BUD TOSS.** You throw one of your sprout buds;
  it lands on the wild's head and takes command. Kinship drives the
  odds: same type x1.5, beating type x1.25, weak type x0.75 — the
  picker tags every bud KIN!/STRONG/WEAK before you throw. Sun Orbs
  are retired everywhere (battle, HUD, Cottage).
- **Buds flow in a loop**: starter grant (+3 of its type), battle
  wins (the loser's bud joins you), gathering (25%), nursery
  harvests (+2), Cottage sells a random bud for 12p. No soft-lock:
  zero buds just means win a fight first.
- **B is the command toss** in the overworld: throw a bud at a node
  and your lead partner runs over and gathers it. Orders, not items.
- **Traversal got real**: scenery trees/rocks are solid and trees
  depth-sort against the player (canopies cover you from behind).
  Tall grass is a seeded blade field; wild sectors have dirt roads.

## v3.1 — know your dude, meet the Gate (Will, playing v3.0)
- **Starter picks are a decision now, not a reflex.** Approaching a
  sprout opens its card — sprite, personality, stats, flavor, work
  skill, starting moves, Lv16 evolution — and only A on the card
  befriends it. B walks away; the sprout keeps waiting.
- **Travel is the LANTERN GATE**: a stone portal arch (all sectors),
  introduced by Louie himself the first time you reach for it —
  a 3-page lesson that hands you the map. You now start in the
  heart of the base (mid-field clearing with Louie and the sprouts);
  the Gate is a place you walk to at the south end.
- **Wilds got prettier**: layered-canopy trees with fruit glints,
  faceted mossy boulders, outlined bushes, grass tufts in the ground
  speckle. One draw function serves nodes + decor — all sectors gain.
- Process (Will's standing order from here on): screenshots are
  captured and eyeballed every build, and CHANGELOG.md (same folder)
  is updated every version — it is the dev log the next bot inherits.

## v3.0 — room to breathe (Will's phone feedback on v2.4)
Will's screenshot said it all: the home base was a cramped gold box with
the sign, Louie, the player and the prompt all piled in one corner. So:
- **The base is a place now, not a plot.** Sunkeep is a 480x520 field
  (was a 480x360 screen with a fenced 9x6 plot). The plot fence is GONE:
  **you can build pretty much anywhere** — the whole field is yours from
  minute one. The Lantern's clearing, the MAP sign, NPC spots, trees and
  rocks are the only no-build spots, and placement mode paints the grid
  green/red so you can see what's fair game. Old saves migrate
  automatically (buildings shift to the new grid; stamped once).
  Base Levels still matter: missions, worker slots, Lantern shop plans.
- **The sign corner is decluttered.** You now arrive up-field beside
  Louie; the MAP sign sits alone at the south gate. No more pileup.
- **The road, then a town.** The Meadow is no longer a gym in a field —
  it's the wild road (wanderers, grass, nodes). At its end sits
  **LANTERN TOWN**: houses, a dirt street, Pip and the Elder to talk to,
  and Ranger's gym where a gym belongs. Gym order and teams unchanged.
- **A real opening cinematic.** No more text wall: night, the Great
  Lantern, its light falling as seeds; the sprouts wake; the keepers
  gather; the four Sigils rise. Four short caption beats, B skips.
- **Grow your partners at home — the SPROUT NURSERY.** Plant a sprout
  (EMBER/PEB/DEW/ZIP/LEAF for 3 berries, LUCKY for 5 + an ingot), watch
  it grow through three stages (~a minute; a PLANTING/WATERING tender
  halves it), harvest a brand-new Lv1 partner. Catching and growing now
  coexist: orbs for the wild, the nursery for home.
- **Work is a skill that grows.** Every production tick, assigned
  workers earn work XP; every 3 XP adds +1 to their work skill (cap +3),
  so a veteran crew visibly out-produces a new one. Party screen shows
  each partner's work XP and current bonus.
- Sun Orbs stay (for now): Will's call — growing was ADDED alongside
  catching, not instead of it. Dropping balls entirely is his decision
  to make after playing this.


## v2.4 — the hook pass (Will: "it needs to hook better")
The opening was a text wall, a stat menu, and chores. Now it's moments:
- **Story: 8 lore lines → 4 short beats**, one per page, then you're in.
- **No starter menu.** After a 20-second hello from Louie (he waits with a
  "!" over his head), **three sprouts wander into the base clearing** —
  walk up to the one you want and press A. It joins; the other two
  scamper to the Meadow.
- **The catch comes second, not last.** Quest order is now: meet Louie →
  befriend a sprout → catch a wild partner → build a Cottage → build a
  Garden Bed. Your first orb in the intro **cannot fail** — the first
  catch is a celebration, not a dice roll. (Quest state is derived from
  facts on load, so every old save lands on the right step.)
- **Wild sprouts are visible now.** Three wander every sector's grass;
  walk into one to battle THAT sprout. Grass rustling still works too.
  They respawn over time.
- **Text hygiene** (Will: "a lot of the text overlaps"): the sector
  banner is opaque and the objective bar politely hides while it's up;
  name labels (buildings, NPCs, Louie, gym leaders) sit on dark pills so
  they read against anything; long say-lines wrap inside their box
  instead of clipping off the screen edges.

## v2.3 — the world scrolls (Will's phone feedback pass)
- **Scrolling camera + bigger areas.** Every sector and the base is now a
  480×360 world (2× the screen wide, ~1.8× tall) with a camera that follows
  you, Sprouts-style. More grass (7 patches), more resource nodes (9),
  seeded edge trees and per-sector landmarks (flowers, cacti, shells,
  glowshrooms, snow rocks). The base plot moved to mid-map with a path
  from the MAP sign; the lantern stands at the north end.
- **Controls fixed two ways.** Movement is now 4-way, GBA-style: when the
  radial touch pad reports a diagonal, the LAST direction you pressed
  wins, so you walk straight instead of drifting. And the shell's touch
  buttons/D-pad got a 95ms minimum-hold (trilogy file only) so a tap
  shorter than one frame can no longer be swallowed — that's why A and
  menu taps sometimes felt dead.
- **Your partners are IN the world.** Your lead partner follows you
  everywhere, sectors included, and assigned workers stand at their
  buildings (drawn bigger). Louie still trails you at base.
- **Trees and rocks are BIG now** (~26px canopies, 22px boulders), the
  ground has a two-tone checker + speckle texture per sector palette.
- **Battle layout rebuilt on anchors.** Sprites, shadows, info boxes and
  the orb arc all hang off two ground points computed from the screen
  size, so animations land in the right spot at any display height
  (verified in renders at H=200 and H=304; sprites sat off their shadows
  before, worse the taller the screen).
- **The game never starts at a gym — for real this time.** Existing
  saves that never finished setting up (no cottage/bed/first wild catch)
  now resume the intro at the right step instead of being waved through
  as "done"; finished saves are untouched. New-game intro unchanged.

## v2.2 — hearts buy things, partners grow, the story ends
From the analysis pass (see IDEAS.md for the full brief-vs-build audit):
- **FIXED: blackout soft-lock.** Losing your whole party never returned
  control to the world — the battle screen errored forever. Found by a
  12,000-frame soak; very likely the original "game broke". Also: sector
  resource nodes can no longer spawn on a gym's doorstep and block it.
- **Gym difficulty retuned by simulation** (fair parties were winning
  8/8 everywhere): leader teams up ~+4 levels across the board. Fair
  parties now win ~6–7/8; type counters still punch through; two
  underleveled partners get walled.
- **The Lantern Shop:** the Base Lantern is a menu now — ring it, read
  the board, or spend GRATITUDE: SAWMILL plans (♥15; PLANTING partners
  mill wood) and LANTERN STATUE plans (♥25; heart drops .5 → .85).
  Locked plans show as ??? in the BUILD menu. Hearts have a sink.
- **Evolutions:** starters evolve at Lv 16 — CINDERCAP → EMBERCAP
  (MAGMA BURST), DRIZZLET → TIDESTAG (TIDAL SURGE), FERNFANG → FERNHOWL
  (THORNSTORM). Field Guide is 15 now; the last 3 are earned, not caught.
- **The Champion:** with 4 Sigils, Zephyr Peak's gym becomes THE FIRST
  KEEPER — AURICORN 31 / VOLTHARE 32 / BLOOMBOAR 31 / EMBERCAP 34,
  300 petals, endless rematch. The game has an ending.
- **First-battle tutorial:** your first wild battle explains weakening,
  orbs, and the keeper move in the moment.

## v2.1 — a proper intro, and Will exists again
- **Intro quest chain (new saves):** the game no longer starts at a
  gym. An objective bar walks you through camp setup: **Talk to Louie
  → Gather WOOD ×6** (the base now grows starter trees/rocks/a bush;
  new saves start with 0 wood) **→ Build a COTTAGE → Build a GARDEN
  BED → Catch a wild partner**. Travel is gated until the Cottage
  stands; gym leaders politely refuse until the first catch. Louie's
  SHOW ME leads to the current quest step. Old saves migrate straight
  to "intro complete" — nobody replays a tutorial.
- **Bug fix:** Will vanished as an NPC when deselected — Sprouts never
  had a CH.WILL (he's the player-sprite character), so the NPC draw
  skipped him. He now renders at base via the player sprite, like the
  keeper-select portrait. Verified in a rendered frame (Erin playing,
  Will standing at his spot).

## v2.0 — Keepers, Base Levels, Louie the Guide (researched: see RESEARCH.md)
- **Base Levels 1→3 (Palworld's Palbox missions):** a mission board per
  level (build X, deploy N workers, catch N species, earn Sigils,
  collect gratitude). Finish the board, then **ring the Base Lantern**
  at base center to level up: the buildable plot literally grows
  (Lv1 7×4 → Lv2 9×6 → Lv3 full field, overgrowth marks the rest) and
  worker cap +2 per level (plus +2 per Sprout Pen).
- **Gratitude hearts (Dragon Quest Builders):** workers drop pink
  hearts as they produce (walk over to collect); the first building of
  each kind bursts +3; petting Louie gives +1 (2-min cooldown). Hearts
  are a mission currency at Lv2→3 and shown in the base HUD.
- **Louie the guide:** talk to him at base — SHOW ME THE WAY makes him
  physically lead you to your actual next goal (computed from game
  state) and wait with a "!" until you arrive; TIPS rotates real
  advice; PET LOUIE exists because of course it does.
- **Discovery (Sprouts-style pop-ups):** first entry into a sector
  raises a banner card (name + flavor line); the first time a species
  is seen, the battle log announces "NEW! X was added to the Field
  Guide."
- **Keepers (Will / Erin / Marcus playable):** switch from the pause
  menu or by talking to them at base — whoever you aren't playing
  stands at Sunkeep as a talkable NPC (3 rotating lines each, Marcus
  is Marcus). Each keeper has a passive and a once-per-battle KEEPER
  move mirroring the fighting game: WILL — SELFIE FLASH (catch +15%
  passive), ERIN — TOWEL WHIP (production +1, mend after wins),
  MARCUS — HYDRO JET (partners hit +12%). Ranger and Scout remain
  gym-leader NPCs.
- **Ambient Sprouts:** the original garden sprouts (Sprouts' own
  drawBud art) wander the base plot, so Sunkeep feels lived in.
- Tests: `test-harness-sw3.js` adds 30 v2 checks (keeper switching via
  menu AND via NPC talk, keeper moves + once-per-battle rule, the full
  Lv1 board → lantern level-up → plot growth, heart drop+pickup, Erin
  yield passive, Louie's whole guide loop, banner-once discovery).
  All suites green on the trilogy file.

**The pitch in one line:** GBA Palworld in the Sprouts universe — catch
wild sprout-kin, put them to work building your base, and earn the four
keeper Sigils. It lives in **cartridge slot 3** of the Pocket Lantern,
next to Sprouts and Rootdeep (Rootdeep was handed off to Claude complete;
this project never edits Rootdeep's code — the combined file is new).

**File:** `Sprouts+Rootdeep+Sproutwild.html` (single file, no build step).
Save key `sproutwild-v1`; never touches the other carts' saves.

## How it plays

- **Sectors, not an open world** (Will's call — the Lantern loads one
  valley pocket at a time): Sunkeep Base + Verdant Meadow, Ember Wastes,
  Dewmist Shore, Gloom Hollow, Zephyr Peak. New sectors unlock by Sigils.
- **Wildsprouts:** 12 species, kin of the six sprout types (EMBER/PEB/
  DEW/ZIP/LEAF/LUCKY) with a type chart, base stats + per-level growth,
  level-up movesets (16 moves incl. status plays), and a **work skill**
  each (KINDLING, QUARRY, WATERING, CHARGE, PLANTING, FORTUNE).
- **Catching:** weaken a wild in turn-based GBA-style battle, throw a
  **Sun Orb** — odds scale with missing HP and species catch rate. Party
  of 3; overflow goes to the base box. Field Guide tracks seen/caught.
- **Battles:** classic layout (foe top-right, partner bottom-left, HP
  boxes, FIGHT/ORB/PARTY/RUN menu), speed order, STAB, crits, stat
  stages, mid-battle switching, XP + level-ups + learned moves. Party HP
  persists between fights; blackout sends you home healed, −10% petals.
- **Gyms (Sigils):** Ranger (Leaf, Meadow) → Marcus (Ember, Wastes) →
  Erin (Dew, Shore) → Scout (Zip, Peak). Two-partner teams, set levels;
  winners earn the Sigil + petals; gyms offer +4 Lv rematches after.
- **Base building:** grid placement at Sunkeep — Cottage (rest/craft
  hub), Garden Bed, Kiln, Quarry Pit, Tinker Bench (unlocks crafting),
  Sprout Pen (worker capacity +3). Box partners with matching work
  skills produce resources on a 25s tick (skill level = yield; FORTUNE
  partners boost any building). Louie lives at base and follows you.
- **Resources:** wood/stone from sector nodes, berries from bushes and
  beds, ingots from the kiln (needed for Bench/Pen — a real production
  chain), petals as currency. Craft Sun Orbs + Tonics at the Cottage
  once a Bench stands; buy them with petals anytime.
- **Start:** story intro → choose a starter (Cindercap / Drizzlet /
  Fernfang — the fire/water/leaf triangle) → base.

**Controls:** D-pad walk · A interact/confirm · B cancel/back ·
START keeper menu. In battle, A advances text.

## Engineering notes (for whoever builds next)

- One module (`sw-module.js` in the working folder; `build.py` rebuilds
  the combined HTML from the Rootdeep handoff file with 9 asserted
  replacements). All identifiers are `SW`/`W4`/`sw`/`w`-prefixed.
- **Hard lesson, paid for once:** in this shared-scope file, a duplicate
  *function declaration* silently overrides the earlier cart's function
  (let/const duplicates throw; functions don't). `pauseUpdate`,
  `drawTitle`, `drawIntro` collided with Sprouts/Rootdeep and broke
  Rootdeep's pause menu. The build now asserts zero duplicate function
  names across the whole file. Prefix everything, even "safe" names.
- Input: continuous keys live on the shared `keys` object (`keys.left`
  etc.); `pressed(k)` is the edge trigger. There is no `held()`.
- Tests: `test-harness-sw.js` (27 checks: boot→starter→travel locks→
  wild win→catch→gym Sigil→build→worker production→save) plus the
  Rootdeep and Sprouts suites re-run green on the combined file.
  `test-harness-sw2.js` is the PHYSICAL suite (34 checks): real inputs
  through real menus — gathering, natural grass encounters, gym by
  walking up and talking, placement incl. occupied-cell refusal,
  cottage rest/buy, hand-assignment, real-time production, and a full
  save/reload cycle in a fresh VM context. It caught the v1.1 bug:
  encounters were nearly unreachable (the entry grace burned only
  while standing in grass, on top of a low rate). Grace is now a
  real-time timer (1.2s on entry, 2.5s after a battle) and encounters
  roll every 0.35s at 16% while moving in grass.
  `test-render-sw.js` + `render.py` rasterize real frames — look at
  them before claiming any visual fix.

## Known limits / next steps (v2 candidates)

- Balance is harness-tuned, not human-tuned; Will's phone verdict rules.
- Production ticks run while playing in any Sproutwild screen (not in
  battle, not offline) — offline accrual is a v2 candidate.
- No evolutions yet; species are single-stage. No held items.
- Gym leaders don't roam; sectors are single screens by design.
- Ideas: a 5th "Champion" bout after 4 Sigils, night/day sector
  variants, work-skill Lv2 buildings (Sawmill, Generator), breeding/
  fusion at the Pen, AURICORN event spawn.
