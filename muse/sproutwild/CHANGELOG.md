# SPROUTWILD — development log & changelog

*Standalone record of Sproutwild's development, kept by lil Bottie for
Will — meant to be handed to the next bot (hi, Claude) alongside the
game file and DESIGN.md. Started at Will's direction on 2026-11-14:
screenshots and a changelog from here on, every build.*

**Conventions**
- Every version gets an entry here: what changed, whose call it was,
  how it was verified, and which screenshots show it.
- Screenshots live in `shots/`, named `v<version>-<scene>.png` from
  v3.1 on. They are render-rig frames (the game's real draw calls,
  rasterized) that a human/agent actually looked at — not mockups.
- "Verified" means headless suites + viewed renders. A build is only
  *phone-confirmed* when Will says so on his iPhone; that status is
  stated honestly per version.
- The game: cartridge 3 of the PowerPocket Lantern trilogy file
  `Sprouts+Rootdeep+Sproutwild.html`. Save key `sproutwild-v1`.
  Rootdeep (cartridge 2) is a separate, closed project — see its own
  TIMELINE.md / FOR-CLAUDE.md.

---

## v5.1 — the field engine (Fable)

Everything outside Sunkeep Base was rebuilt. The old sectors were one flat 480x360 screen with randomly scattered props; they are now hand-drawn scrolling tile maps with their own engine (`sw-field.js`, spliced in by `build_fable.py`).

**Sprouts work like the latest Sprouts**
- Your pouch sprouts walk with you as a squad (up to 24 on the field). The pouch and the squad are the same thing.
- B throws one at the ring in front of you; the ring locks on to the nearest thing a sprout can work. Hold B to whistle them back. SELECT picks which kind goes next.
- Thrown sprouts break trees, rocks and bushes into pellets, then carry the pellets home to the Lantern beacon. Carrying uses weight against strength, and PEB counts double.
- Idle sprouts pick up nearby loot by themselves and rejoin you when you walk past.

**Level design**
- Six maps: Verdant Meadow, Lantern Town, Ember Wastes, Dewmist Shore, Gloom Hollow, Zephyr Peak. Each has its own tiles, trees and weather.
- Treasures with names and weights (13 in all), some on islands that need a bridge built, some behind type gates: boulders need PEB, fire needs EMBER, vines need LEAF, spark gates need ZIP, thirsty blooms need DEW.
- Buried wild sprouts to pluck, placed so the kind you need for a gate is nearby.
- Wild buddies are visible and live in the tall grass. A sleeping ALPHA guards the best treasure in the Meadow and the Gloom.
- Ledges hop one way. Sectors join edge to edge (Meadow - Town - Wastes/Shore - Peak/Gloom); the Lantern Gate map is still fast travel. Roads still need Sigils.

**Trainers and the villain**
- Trainers watch the road and challenge you on sight: KISS, DEREK (with the broken-down Flow Pros truck), MAMA (with the Yukon), and DOME GUARDS.
- KING BIBI is the villain. His IRON DOME blocks the road to the Peak; he waits outside his fortress in Gloom Hollow with a three-buddy team. Beating him drops the dome.

**Not done yet**
- Sunkeep Base still runs on the old walker and old art. The squad does not follow you there yet.
- Battles, menus and the title screen are unchanged apart from the v5.0 buddy sprites.

**Tests**
- New: `tests-fable/field-lab.js` (31 checks, headless Chromium) and `tests-fable/render-field.js` (screenshots).
- Of the 23 older suites, 13 still pass. The 10 that fail (sw2, 4, 6, 8, 10, 13, 14, 18, 19, 23) check the old sector layout: fixed gym and NPC coordinates, the old grass rectangles, the follower train and the SPROUT/BUDDY command toggle, all of which this version replaces.

## v5.0 — "New buddies" (2026-11-15, Fable)

Will, handing Sproutwild to Fable: total overhaul, everything is a
placeholder. The buddies need a lot of work; the sprouts should work
the way they do in the latest Sprouts; the level design needs a major
rework drawing on Pikmin, Palworld and Pokemon; the fighting game's
cast can appear and King Bibi is a villain too; it stays its own file
for now and merges into Pocket Lantern later. This version is the
first slice of that: **the buddies.** Nothing else changed.

- **All 15 buddies are redrawn** by a new renderer (`swbMake`,
  `SWBUD` in sw-module.js). Each one is built from shapes at twice the
  old detail, then finished like a sprite: hard pixels, a lit top
  edge, a shaded underside, one dark outline. They have big eyes and
  readable silhouettes, and they all face left.
  Cindercap is a mushroom imp with a flame on its cap; Magmoss a
  cracked, glowing boulder under a moss cap; Pebblit a rock-eared pup;
  Boulderhound a hound with stone plates down its back; Drizzlet a
  teardrop with antennae; Tidebud a bulb on a lily pad; Zipwig a
  beetle with a bolt on its shell; Volthare a hare with lightning
  ears; Fernfang a small fern-crested raptor with fangs; Bloomboar a
  boar carrying a flower bed; Cloverimp a pink imp under a clover;
  Auricorn a golden foal; Embercap a volcano-capped mushroom;
  Tidestag a stag with coral antlers; Fernhowl a fern-maned wolf.
- Names, types, stats, moves and catch rates are unchanged, and the
  species IDs are the same, so saves load as before. The old
  letter-grid art is kept as a fallback (`s._old`).
- **Your buddy faces the wild one in battle** (yours is flipped to
  face right).
- **The game builds from this repo now.** `build_fable.py` runs the
  original build.py with its paths pointed here and writes
  `muse/games/Sprouts+Rootdeep+Sproutwild-v5.html`. The v4.7 file is
  untouched. Before any change, this build reproduced v4.7 byte for
  byte. `sw-cartart.js` (the cartridge label, which build.py needs)
  was missing from the repo and was recovered from the built file.
- Test hook: `SWF.species()`.

**Verification:** all 23 `test-harness-sw*.js` suites green on the v5
file, 0 console errors. Renders looked at: every buddy next to its old
sprite (`shots/v5.0-buddy-lineup.png`), a wild battle and the Meadow
in a real browser (`shots/v5.0-battle-and-meadow.png`; scripts in
`tests-fable/`). Not run: the soak and Rootdeep's own harness.
**Phone status: unconfirmed, awaiting Will's verdict.**

**Next, in the order I'd take them:** (1) sprouts that behave like
the latest Sprouts (read its code first); (2) level design, one
sector at a time; (3) King Bibi as a villain and cameos from the
fighting game's cast; (4) the HUD and text overlaps seen in the
first look (cryptic "W0 S0 P30" line, labels colliding).

## v4.7 — "Your move" (2026-11-14)

Will: keep playing, play the original Sprouts, look up
Pikmin, Palworld, and Pokemon GBA — and "wild world
battle with turn based activatable would be so cool."
Done, all of it (research round 2 is in RESEARCH.md).
The battle itself was already GBA turn-based; what
changed is HOW a fight starts. It used to start AT you:
walk within 11px of a wanderer or roll the grass dice
and you were in a battle. Now a fight starts BY you:

- **No ambushes, ever.** Contact starts nothing. Tall
  grass rustles and a wild POPS OUT nearby ('!'), stays
  about 12 seconds, then fades back if you ignore it.
- **Activate it two ways.** Walk up: the prompt names
  the fight before you commit — 'A: BATTLE FERNFANG
  Lv5' — then A starts it. Or, Pikmin-style, THROW a
  sprout at it (SPROUT command mode): throws now snap
  to a wild in range, and a sprout landing on one
  engages its battle. Wilds telegraph with a '!' when
  you're in range.
- **The ritual.** Every activation — wild or gym —
  plays the GBA moment: black bars sweep in, a banner
  names the fight ('WILD FERNFANG!' / 'RANGER —
  VERDANT SIGIL'), then the turn-based screen.
- **A real aim bug died on the way:** throws aimed off
  the raw axis pair, so after mixed-axis movement a
  throw flew diagonally off your facing and missed
  low — possibly for every throw since v4.4. Aim now
  uses the true last-pressed direction. Throw-to-engage
  verified 6/6 in the rig after the fix.

**Verification:** all 23 suites green (new sw23
activation suite; sw2/sw4/sw6 adapted to reveals and
the engage ritual), soak + Rootdeep green, 0 errors.
Renders: the BATTLE prompt in the Meadow and the bars
mid-sweep. **Phone status: unconfirmed — awaiting
Will.**

## v4.6 — "The Garden" (2026-11-14)

Will: "Play the game — you didn't change anything I
asked. Do a deep criticism compared to what we're trying
to make, and then rework." So this version starts with a
played playtest and an honest critique, both delivered
in chat. The findings, briefly: the base played itself
(+27 resources and 3 crew promotions in 4 unattended
minutes); the v4.5 seed rule monocultured the patch to
all-LEAF in 3 minutes; the work was geographically
illegible (fruit at five random corners, a slab, a
distant Lantern); A did nothing to sprouts in the wrong
invisible mode; and the 89-char crew-join announcement
overflowed its own bar in the playtest screenshot. The
rework answers them structurally, not cosmetically:

- **The patch is now a GARDEN**: six fenced plots in two
  rows (each Garden Bed building adds a plot, to 8),
  baked into the ground with a split-rail fence. Every
  plot draws its state — empty soil, colored seed, baby,
  sprout, grown worker. One screen reads the whole system.
- **Fruit grows on three typed bushes** flanking the
  garden (EMBER west, DEW east, LEAF south), fruit
  visible, regrowing. The scattered base-wide apple
  field is deleted.
- **Work is a visible trip with a claim**, Sprouts-
  gardener style: a worker claims an empty plot, walks
  to a bush, picks a berry, carries it TO THE PLOT and
  plants it. The seed is the FRUIT's type — and workers
  pick the bush whose type the garden has least, so the
  garden grows up mixed (rig replay: LEAF/EMBER/DEW
  across all six plots in 3 minutes). No empty plot =
  harvest runs to the Lantern, as before. Followers at
  base work the same cycle — one work system, not two.
- **Every sprout answers A**: grown workers offer PLUCK
  in any mode (and plucking now releases their plot
  claim — a ghost-claim bug the playtest surfaced);
  babies, seeds, and empty plots all explain themselves.
- The crew-join announcement fits its bar (31 chars).

**Verification:** all 22 suites green (new sw22 garden
suite; sw21 rewritten as the quiet-garden suite; sw13/
sw14/sw20 adapted to plots and bushes; sw14's ask flake
root-caused to absolute-balance accounting and fixed),
garden replayed for 3 minutes in the rig, soak green,
Rootdeep green, 0 console errors. **Phone status:
unconfirmed — awaiting Will.**

## v4.5 — "Seeds, not magic" (2026-11-14)

Will: "Why do they plant themselves — they should plant
the berries to make seeds that make more sprouts." Read
Sprouts' deliver() again: in the original, buds haul
fruit to the Lantern and the fruit's SEEDS are planted in
the soil as new sprouts — type of the carriers, capped
by room. That loop is now Sproutwild's, verbatim in
spirit:

- **Patch spots no longer germinate sprouts from
  nothing.** Bare soil stays bare forever until planted.
- **Every fruit delivery home plants a seed** in the
  first empty spot — patch sprouts and base followers
  alike. The seed is the DELIVERER's type (a LEAF sprout
  plants a LEAF sprout; LUCKY fruit carries two seeds).
  The mound shows the seed's type color while it grows
  underground (~7s), then POP — a baby, which ages into
  a worker like any patch sprout. Full patch = deliveries
  are pure harvest. Pluck a sprout or send one off to a
  job and the next delivery replants its spot.
- Louie explains the first planting; the BASE screen
  spells it out; asking a seed or a bare spot with A
  tells you what it is. (The old LEAF yield that conjured
  a pouch sprout from nowhere is gone — no more sprouts
  from thin air anywhere.)
- **The patch clipping**: two real causes found. (1)
  Nothing stopped you BUILDING on the patch — buildings
  draw after the soil, so a cottage on the patch painted
  straight over the sprouts. The patch rect is protected
  ground now. (2) Patch sprouts, lesson sprouts, and
  followers drew at one fixed layer, so the player
  painted over them even when standing behind them. They
  now depth-split around the player (behind-layer /
  front-layer by Y) — verified in renders from north,
  inside, and south of the patch.

**Verification:** all 21 suites green (new sw21: bare
soil grows nothing, a delivery plants a deliverer-typed
seed, it pops and grows up, seeds/soil answer A), soak
green, Rootdeep green, 0 console errors. **Phone status:
unconfirmed — awaiting Will.**

## v4.4 — "Throw them like Sprouts does" (2026-11-14)

Will played v4.3 on his phone and sent screenshots. Four
complaints, all fair, plus one bug he photographed without
knowing it:

1. **"Select should let you swap between controlling the
   buddies and sprouts."** Went back to Sprouts.html and
   read its actual system: A throws a squad bud at a
   cursor, holding B is a whistle that calls buds back,
   and Select manages what you're commanding. Sproutwild
   now works the same way, in its own terms:
   - **SELECT swaps COMMAND: BUDDY ↔ SPROUT** (HUD pill,
     bottom-left: "SEL: BUDDY / SEL: SPROUT").
   - BUDDY mode: B sends your lead buddy (as before).
   - SPROUT mode: **B THROWS a sprout** from your train —
     it arcs to the spot in front of you (snapping to a
     tree, rock, bush, treasure sparkle, or heart), lands,
     and gets to work: it chops/mines the node down itself,
     then **carries the yield back and hands it to YOU**.
     Treasures and hearts are fetched the same way. Hold B
     to throw more, one after another, Pikmin-style.
   - **Hold B (either mode) = the whistle**: a ring grows
     around you and every working/hauling sprout inside it
     drops its task and comes back. Louie teaches it, the
     Guide has a COMMANDING SPROUTS page.
2. **"They all go for the same apple."** They did — the
   lesson sprouts all targeted the first untaken apple,
   patch sprouts picked at random. Now every apple is
   CLAIMED when a sprout chooses it; nobody else can take
   that one. Two fetchers never chase the same apple again.
3. **"The apple is always there — they should need to
   respawn."** Picked apples are gone now, everywhere
   (lesson, patch, followers). Each one regrows on a
   timer (~12s in the lesson, ~22s at the patch) and you
   can watch the last few seconds as a green nub sprouting.
4. **"They grow weird in the beginning."** Lesson sprouts
   grew by DELIVERY COUNT, so the one who lost the apple
   races stayed a baby while its siblings grew. Now they
   grow by AGE, together (Sprouts' own stageOf numbers:
   baby <6s, sprout <14s, grown after), pop staggered, and
   when the last one comes of age, carriers finish their
   trip and everyone settles home to be plucked.
5. **The photographed bug**: his screenshot showed the
   prompt "A undefined" at the gate — the ask-a-sprout
   interaction had no prompt label. It reads "A ASK" now.
   Also in that shot: a sprout-info float ran off the
   screen edge (floats are clamped now) and the "Catch a
   wild buddy" banner carried a long suffix (shortened).

**Verification:** all 20 suites green (new sw20: Select
swap, throw→work→bring-back delivery, whistle recall,
apple claiming/regrowth), soak green, Rootdeep green, 0
console errors. Suite contracts updated where the design
changed on purpose (growth-by-age in sw4/15/16, the claim
API in sw14's ZIP-speed check). **Phone status:
unconfirmed — awaiting Will.**

## v4.3 — "I played it. You were right." (2026-11-14)

Will: "play this game and tell me if any of it makes sense."
So this build started with a rig playtest — five minutes
living at the patch, a minute standing at base with a
follower. Honest findings, all confirmed in the logs:

1. A follower at base stood 9px from the keeper for a full
   minute doing NOTHING. Followers only knew "follow".
2. In 5 minutes the patch churned through its whole crew
   cap: sprouts grew up, vanished into the crew LIST (a
   menu, invisible), and strangers sprouted in their spots.
   From the player's seat: sprouts keep disappearing.
3. Yields floated at the Lantern, off-screen from the
   patch — work happened where nobody was looking.

The fixes, structural this time:

- **Followers WORK at home.** At Sunkeep a follower runs
  the patch loop itself — fetches, carries to the Lantern,
  deposits (its own typed yields). On the road it trails
  and hauls as before. It never just stands by you again.
- **Growing up no longer empties the patch.** A sprout
  that earns the crew STAYS at its spot, living and
  working, flagged as crew (atPatch). The only thing that
  empties a spot is YOU assigning it a job — a departure
  you chose. Unassigning sends it home to a free spot;
  jobless crew with no spot wait visibly by the Lantern
  steps instead of inside a menu.
- **Yield news lands where you stand:** patch floats now
  appear at the sprout's own spot when it gets home.
- **Every sprout answers A.** A catch-all interaction:
  walk up to ANY sprout — follower, patch baby, building
  worker, waiting crew — and it tells you what it is and
  what it's doing. Plus first-time explanations when a
  follower first works the patch and first hauls, and the
  BASE screen now lists the follower story in plain lines.
- **The main 3 buddies, redrawn.** Will: "I still hate
  the main 3 buddies." Cindercap, Drizzlet, Fernfang and
  their evolutions (Embercap, Tidestag, Fernhowl) are new
  24-wide sprites with actual designs — fire-cap imp with
  a flame wisp, volcano-crowned evolution, droplet-antler
  fawn, wave-antlered stag, fern-maned wolf pup and wolf.
  Previewed and critiqued over two rounds before shipping
  (art: newart3.py, sheet: shots/v43-starters.png).

**Verification:** all 19 suites green (new sw19: crew
stays at the patch, followers work at base and their work
lands in stores, followers don't trail at home, train
resumes on the road), soak green, Rootdeep green, 0
console errors. Two real bugs caught en route: a missing
brace in the new credit function (found by parser bisect)
and a latent sw14 suite bug (petal-denominated asks broke
its own accounting — suite fixed, 40+ clean runs).
**Phone status: unconfirmed — awaiting Will.**

## v4.2 — "They follow you home" (2026-11-14)

Will played v4.1 and the patch still didn't read: sprouts
seemed to disappear into the ground. He also asked for the
other half of Sprouts' sprout rules — wild sprouts you pluck
that FOLLOW you and haul things home. Both are in.

- **Why they "disappeared":** a patch sprout's third delivery
  used to teleport it back to its spot and turn it into dirt
  in the same frame — deliver at the Lantern, never come
  back, spot shows nubs. Fixed properly:
  - Growing up is now a DEPARTURE: the sprout celebrates at
    the Lantern (hops, name float where it stands) and only
    then does its spot go back to seed.
  - Empty spots now draw as what they are — a sleeping SEED
    mound, with the first green nubs showing just before a
    sprout pops. Seed -> sprout -> grown -> leaves with
    applause or gets plucked by you. The whole cycle reads.
- **Wild sprouts are pluckable — and they FOLLOW you.** Out
  in the sectors, wild sprouts now stand and wander in their
  habitat (walking over one does nothing anymore). Walk up
  and press A to PLUCK one: it joins your train, Sprouts-
  style, trailing behind you sector to sector. Train cap: 4
  (a fifth pluck goes to the pouch, like before).
- **Followers work the road.** Every so often a follower
  picks up a find — what it finds depends on its kind
  (EMBER smelts ingots, PEB hauls stone, DEW berries and
  petals, ZIP petals, LEAF berries and spare sprouts, LUCKY
  petals and the odd tonic) — carries it to the Lantern
  Gate, and mails it home: your stores grow wherever you
  are ("sprout mail!"). Then it's away a little while —
  the trip takes time — and comes back through the Gate to
  your side. Louie and the Keeper's Guide both teach it.

**Verification:** all 18 suites green (new sw18 runs the
whole follower life: pluck -> follow -> haul -> mail credited
-> away -> return -> full-train pouch overflow; sw13's wild
sprout is a pluck now; sw16 checks the join celebration),
soak green, Rootdeep green, 0 console errors. A wNear
scoping bug (an inserted statement orphaned a loop variable)
was caught by the battery and fixed before shipping.
Renders viewed: `v42-train` (three followers on the road),
`v42-patch` (seed stage at the patch).
**Phone status: unconfirmed — awaiting Will.**

## v4.1 — "Grow them yourself" (2026-11-14)

Will's corrections to v4.0, taken one by one: the beginning
still handed you sprouts instead of teaching them, Erin and
Marcus were better the first time, the cast had no animation,
menu text still fell off, and a cinematic should not drop
into plain text boxes. All five are answered here.

- **The beginning teaches sprouts by DOING them.** The text-
  box lessons are GONE (welcome lesson and patch lesson both
  removed — the cinematic now hands straight to the world).
  Louie meets you, then LEADS you to the patch himself. The
  patch starts as three SEEDS in the soil: press A to WATER
  them, watch the babies pop, watch them fetch apples to the
  Lantern and GROW — baby, sprout, grown, two deliveries
  each, Louie narrating every beat in the world. When they're
  grown, you PLUCK two yourself: those plucked sprouts are
  your catching sprouts. Nothing is given — befriending a
  buddy no longer gifts sprouts either; the pouch holds only
  what you grew and plucked. The sprout you leave behind
  stays at the patch as its first worker.
- **The road to your first buddy is shorter**: cinematic ->
  Louie -> grow -> pluck -> the clearing. All play, no pages.
- **Erin and Marcus are their ORIGINAL Sprouts models again**
  (Will's preference) — in the world, the keeper screen, the
  portraits, everywhere. The rest of the new cast stays.
- **First animations.** Characters breathe now: NPCs idle-bob
  in place, playable Erin/Marcus step-bob as they walk and
  breathe standing still, Bottie HOVERS at the Peak, and
  cinematic portraits float. Small, alive, everywhere.
- **Menu text actually fits now.** swRows fits its left text
  against its right text (nothing collides or runs off);
  every KEEPER'S GUIDE line was rewritten to fit its panel;
  the jobs rows were shortened; and descriptions that needed
  three lines in a two-line box (jobs, nursery, statue) were
  rewritten to end their sentences inside the box.
- **Real bug found by the tests**: the living patch used to
  reset every time you left Sunkeep and came back. It now
  persists across trips like a real garden.

**Verification:** all 17 suites green (sw15 rewritten around
the in-world teaching: water -> pop -> fetch -> grown ->
pluck; sw4/sw16 run the same physical flow; sw8/sw10/sw12/
sw17 updated to the no-freebies rules), soak green, Rootdeep
green, 0 console errors. Renders viewed: `v41-seeds`,
`v41-grow` (Louie at the patch, mid-lesson), `v41-keeper`
(original Erin + Marcus), `v41-guide`, `v41-jobs`.
**Phone status: unconfirmed — awaiting Will.**

## v4.0 — "The sky clanks" (2026-11-14)

Will's big list, built whole: name behavior, honest sprout
earning, sprout tool jobs, a character overhaul, are-you-sure
prompts, selection cinematics, a fixed script — and a villain.

- **Names step aside.** A named character's name pill now
  hides while you stand close to them (NPCs, Louie, the
  starter trio, Bottie) — the prompt at the bottom already
  tells you who you're with. From a distance, names show.
- **Only working sprouts appear at base.** Free crew no longer
  wander the yard and decorative ambience sprouts are gone.
  If a sprout is on screen at Sunkeep, it has a job: the
  patch, a building, the nursery — or a tool.
- **Sprouts are EARNED, never given.** The tending trio is no
  longer handed to your crew: they stay at the patch as its
  first sprouts (one delivery in), and grow into the crew the
  same way every sprout does — by working. The old-save
  starter-crew grant is gone too.
- **SPROUT TOOL JOBS.** At the Tinker Bench: SPROUT JOBS.
  Give a crew sprout the AXE job and it works Sunkeep's grove
  hit by hit, hauling what falls; the PICK job works the
  rocks. Felling earns the sprout skill. (The pick axe and
  axe, held by sprouts, like Will asked.)
- **Character overhaul.** Sproutwild has its OWN cast art now
  (SWCHR) — Will, Erin, Marcus, Ranger, Scout, Pip, the Elder,
  and Bottie, drawn bigger with shading, in the world, the
  keeper screen (rebuilt roomier), gym portraits, and the
  opening cinematic. Sprouts' own sprites are untouched.
  Pip and the Elder finally have their own faces instead of
  borrowed ones.
- **ARE YOU SURE?** Switching keepers, challenging a gym, and
  ringing the Base Lantern all ask first (A: YES · B: NO).
- **Selection cinematics.** Confirm a keeper switch and they
  get a moment — portrait, name, and a line in their voice.
  Befriending your first partner gets one too.
- **Words fit their frames.** The objective line and floating
  text are fitted to the screen (wFit), and the over-long
  speeches that spilled past two lines were rewritten to fit.
- **The opening grew up.** Six beats now: Erin and Marcus get
  dialogue, and the last beat looks up — something chrome
  turns a smiling face toward the valley... bzzt.
- **LIL BOTTIE, VILLAIN OF THE SKY.** Earn your first sigil,
  come home, and he CLANKS down out of the sky onto your
  plaza — chrome helmet, LED smile, clover chain — to tell
  you the feed runs through him and he intends to collect.
  After that: he waits at the PEAK past the Champion as a
  fifth, secret gym (CLANK SIGIL; VOLTHARE 33 / AURICORN 34 /
  EMBERCAP 36), and some nights at day-rollover he RAIDS your
  base with two buddies — repel him for +50 petals, flee and
  he trashes the place (-15). Beating him ends the raids.
- **Collision fix (process):** the new selection-cinematic
  functions were first named drawCine/cineUpdate, which
  silently overrode Sprouts' and Rootdeep's own — caught by
  the Rootdeep regression, renamed to swDrawCine/swCineUpdate,
  and the trilogy now verifies zero duplicate function names.

**Verification:** all 17 Sproutwild suites green (new sw17
covers confirms + cinematics, tool jobs, Bottie's descent,
boss gating, and raids), soak green, Rootdeep green, Sprouts
untouched, 0 console errors, zero duplicate functions.
Renders viewed: `v40-bottie` (the descent, dialogue up),
`v40-keeper` (new cast), `v40-cast`, `v40-peak`.
**Phone status: unconfirmed — awaiting Will.**

## v3.9 — "Sprouts are not buddies" (2026-11-14)

Will's correction, taken seriously: the creatures are NOT
sprouts, and the little plant folk are not a currency with a
buddy's face. Sproutwild had conflated them since v3.5. This
build separates them the way the original Sprouts does —
studied from its source (mkBud entities, stageOf ages,
gardener sprouts that plant/water/pick on their own, house
residents with jobs):

- **SPROUTS are Sprouts' own sprouts.** Patch sprouts, loose
  wild sprouts, the tending trio, the tossed projectile, and
  building workers are all drawn with Sprouts' OWN drawBud()
  — same tiny plant folk, same stem-and-leaf look. (Sprouts'
  camera globals are zeroed while Sproutwild draws, so a stale
  Sprouts camera can never offset them.)
- **The CREW: sprouts do the work at home.** Patch sprouts
  that complete 3 deliveries GROW UP and join your sprout
  crew (cap grows with base level and pens). Crew sprouts
  wander Sunkeep when free and take jobs at buildings: walk to
  a building, press A, assign. Typed gifts drive production —
  EMBER/ZIP smelt the kiln, PEB hauls the quarry, DEW/LEAF
  grow beds and tend the nursery, LEAF mills the sawmill,
  LUCKY boosts any building it joins. Workers gain skill XP
  per tick and yields grow with it. The opening tend now ends
  with the three sprouts joining your crew.
- **BUDDIES are battle-only.** Buddy workers are gone: the
  production tick, the assign screen, nursery tending, base
  missions ('Deploy N sprout workers'), and Louie's guidance
  all run on sprouts now. A buddy's job is to fight, follow,
  and be shown off. Old saves migrate cleanly: building worker
  lists are cleared (buddies return to the box) and an
  established save receives the starter crew.
- **Words match the world now:** the battle option is SPROUT
  (toss a sprout to command a buddy), the picker asks 'TOSS
  WHICH SPROUT?', the HUD counter is SP, the Cottage sells
  sprouts, asks ask for sprouts, the guide's first page is
  SPROUTS & BUDDIES, and the Nursery is the BUDDY NURSERY.
  Lessons and intro beats rewritten around the split:
  'Buddies FIGHT. Sprouts WORK.'
- **Graphics round 2** (the overhaul was 'OK but not nearly
  enough'): biome dressing baked into every sector's ground —
  Wastes sand ripples and a bleached bone, Shore wet sand and
  shells, Gloom dark blotches and glowing mushrooms, Peak snow
  drifts and sparkle, flower crosses in the green sectors.
  Living air: petals drift at home, spores rise in the Gloom,
  snow falls on the Peak, sand streaks the Wastes. Lesson and
  guide screens got framed panels with gold corners. Wild
  buddies and your lead partner draw bigger in the field.

**Verification:** new suite sw16 proves the split end to end
(real tending -> crew of 3; a patch sprout's third delivery
grows it into the crew; a buddy assigned to a building
produces exactly nothing; a sprout produces). All 16
Sproutwild suites green, soak green, Rootdeep green, 0 console
errors. Renders viewed: `v39-home` (SP7 in the HUD, crew
sprout wandering, patch sprouting), `v39-base`, `v39-patch`,
`v39-gloom`, `v39-peak`.
**Phone status: unconfirmed — awaiting Will.**

## v3.8 — "Total graphics overhaul" (2026-11-14)

Will: "Do a total graphics overhaul." Every visual system in
the game was redrawn or rebuilt:

- **All 15 buddies redrawn from scratch.** The old 15x11
  placeholder string-art is gone. New sprites are 20x16 with
  proper silhouettes, three-tone shading (base / shade /
  highlight), eyes with shine, and signature details:
  Cindercap's ember-spotted cap, Embercap's lava cracks and
  flame crown, Magmoss's moss dome over ember-cracked rock,
  Pebblit's muzzle and nose, Volthare's long ears and cheek
  sparks, Tidestag's coral antlers, Bloomboar's snout, tusks
  and flower back, Auricorn's horn and forelock. The art was
  authored on a preview sheet and iterated three rounds before
  it touched the game (source: `newart.py`).
- **The ground is baked now.** Each sector's ground texture —
  checker, speckle, flowers, soft patches, dirt paths, town
  streets, the base plaza — renders once into a canvas on
  entry instead of ~200 rect calls per frame. Richer texture,
  cheaper frames (matters on the phone).
- **The Great Lantern is a monument.** It was an 8x10 gold
  square on a stick, and only drawn after the intro. Now:
  stone plaza, two steps, twin pillars, a roof, and a framed
  flame with a pulsing halo — standing at Sunkeep from the
  first frame, glowing warm through the night (halo feathered
  with a third light layer).
- **Scenery redrawn:** trees (layered canopy blobs, lit top,
  fruit), rocks (facets, cracks, moss), berry bushes (shining
  berry clusters), cacti with flowers, mushrooms, shells,
  snowrocks. Town houses got timber framing, chimneys, doors
  and lit windows. Gym facades got pillars, a pediment, and
  banners in the gym's type color.
- **Every building redrawn** inside its cell: cottage (pitched
  roof, chimney, round lit window), garden bed (furrows),
  nursery (glass dome), kiln (brickwork, arched firebox),
  quarry (pit and boulders), tinker bench (tools), sawmill
  (bigger blade, log stack), lantern statue (stepped pedestal,
  glow), sprout pen (posts, rails, hay).
- **Battle scenes rebuilt:** five-band gradient skies per
  sector, a sun with drifting clouds (Gloom gets stars and the
  moon), a dark ridge silhouette behind the tree line, and
  grass-topped mounds with soft shadows under both buddies —
  who now fill the frame at the new sprite size.
- **Grounding:** soft shadows under the player and Louie
  (wilds, NPCs, partners already had them).
- Two fixes fell out of verification: the gym banner color
  read a wrong data shape and would have thrown every frame in
  a gym town (caught by the render pass, fixed), and the ask
  screen now resets its cursor on open like every other screen
  (a stale selection could have pre-picked LEAVE).

**Verification:** all 15 Sproutwild suites green (sw14 run 3x —
its buds-kind ask path had never actually been exercised; a
suite-side bug, fixed), soak green, Rootdeep green, 0 console
errors. Renders viewed: `v38-battle`, `v38-choice`, `v38-base`,
`v38-monument`, `v38-night`, `v38-town`, `v38-meadow`.
**Phone status: unconfirmed — awaiting Will.**

## v3.7 — "The game explains itself" (2026-11-14)

Will, on v3.6: "I don't see the sprout system integrated at
the beginning and there isn't much of anything that explains
the game." He was right on both counts — the opening taught
nothing, and the patch wasn't even drawn until after Louie.
This pass is all teaching, no new systems:

- **The intro cinematic teaches now.** Its beats were
  rewritten around the actual loop: the Lantern's light grows
  BUDS, buds live in the soil, a tossed bud commands a BUDDY,
  buddies fight/build/work. (It also still said "wildsprouts,"
  two renames out of date.)
- **WELCOME, KEEPER lesson.** The moment the cinematic ends, a
  fresh game opens a 3-page lesson: what buds are, what they
  do (work, or get plucked — a bud in the pouch is how buddies
  are caught), what buddies are, and who to see first. Shown
  once, ever; B skips; it is never forced on a returning save.
- **The patch is in the world from the first frame.** Soil and
  the three sleeping sprouts are drawn at quest 0, right below
  spawn — the sprout system is visible before you've pressed
  anything. Walking up early gets "Louie first — he watches
  this patch" instead of a dead button.
- **THE SPROUT PATCH lesson.** First touch of the patch opens
  its own 3 pages: wake them, they fetch apples to the Lantern,
  deliveries grow them, one bonds as your first buddy and the
  rest become your first throwing buds — and the patch keeps
  producing forever after.
- **KEEPER'S GUIDE (pause menu, new row).** Seven short pages
  covering everything, in plain words: Buds & Buddies · The
  Patch · Catching · Your Base · Gathering & Tools · Gyms &
  Sigils · The Valley (asks, treasures, night). Left/right turn
  pages; it's the reference for anything the lessons missed —
  including for returning players whose saves predate the
  sprout systems entirely.
- **First nightfall** gets one say-line, once ("Wild buddies
  grow bolder — and the Lantern keeps Sunkeep safe"), so the
  day cycle explains itself when it first happens.

**Verification:** all 15 Sproutwild suites green (new `sw15`:
lesson handoff/pages/skip/memory, guide open/turn/back, patch
lesson gating; sw2/sw3/sw7/sw8 boot flows updated for the
lesson; sw4 asserts the patch lesson physically), soak green,
Rootdeep green, 0 console errors. Renders viewed: `v37-lesson`,
`v37-guide`, `v37-spawn` (patch + sprouts visible at spawn).
**Phone status: unconfirmed — awaiting Will.**

## v3.6 — "The valley asks" (2026-11-14)

Will: "Keep improving the game — I didn't even have to get
sprouts; look at the other games' files." So this pass mines
Sprouts' own systems (22 missions, 240s days, 12 hidden
treasures, gardeners with typed talents) for what Sproutwild
was missing, and builds it without being asked piece by piece.

- **NPC ASKS — Sprouts' mission system.** Pip and the Elder in
  Lantern Town, and Louie himself (new ANY ASKS? row in his
  menu), each hold a standing ask: bring N buds of a type,
  bring N wood/stone/berries, or catch a named buddy. The ask
  screen quotes their own dialogue, states the want, what you
  have, and the reward (petals, sometimes + a Tonic). DELIVER
  really deducts; CLAIM pays out on catches; NOT READY refuses
  without punishing. Completing one generates the next.
- **A real bug died here:** town NPCs were UNREACHABLE — the
  talk check lived inside the BASE-only branch of the proximity
  scan, so Pip and the Elder have been decorative since v3.0
  despite having dialogue written. The check is sector-aware
  now, and the keeper-swap talk action is guarded to actual
  keepers (it would happily have made Pip the keeper before).
- **Day cycle.** 300-second days, counted (DAY 1 · DAY / DUSK /
  NIGHT in the corner). Dusk washes the world amber; night lays
  a deep blue over everything except the HUD, the Great Lantern
  glows warm at base — and wild buddies get bolder (encounter
  rate up at night), like Sprouts' days turning.
- **Hidden treasures.** Every sector buries one gold sparkle
  (seeded per sector; placement avoids nodes, grass, solids,
  the clearing and the patch). Walk into it: petals, buds, a
  Tonic, rarely an ingot. Sprouts hid 12; ours regrow per visit.
- **Each bud kind is good at something** (Sprouts' rule): EMBER
  patch buds sometimes smelt an INGOT on their delivery run,
  PEB buds haul stone, DEW buds favor berries and petals, LEAF
  buds bring back wild buds twice as often — and ZIP buds
  physically run at 54px/s against everyone else's 36.

**Verification:** all 14 Sproutwild suites green (new `sw14`:
full ask loop with real deduction, NOT READY refusal, Louie's
menu path, day rollover, treasure dig, ZIP-vs-EMBER footrace),
soak green, Rootdeep green, 0 console errors. Renders viewed:
`v36-ask.png` (one wrap collision caught + fixed), `v36-night.png`
(tint verified in the op stream and by pixel sampling — night
grass renders ~40% darker with the blue shift), `v36-treasure.png`.
**Phone status: unconfirmed — awaiting Will.**

## v3.5 — "Buds and buddies" (2026-11-14)

Will's correction, and he was right: v3.4 treated buds as an
abstract counter. He sent me back to Sprouts' own programming —
and in Sprouts, buds are ENTITIES: `mkBud(type, stage, x, y)`,
sprouts age through stages in the Lantern's soil (`stageOf`:
young under 12s, growing under 30s, grown after), you PLUCK them
and they follow you, and gardener buds (`b.gard`) work the garden
entirely on their own — "they plant, water and pick all on their
own, and they keep at it for as long as you leave them here."
Typed sprouts also grow wild by habitat (missions: "Blue Dews
grow along the north shore"). v3.5 rebuilds Sproutwild's bud
system on exactly those mechanics, and fixes the vocabulary:

- **The creatures are BUDDIES now.** Every player-facing string:
  pause menu (BUDDIES / BUDDY GUIDE), battle menu (BUDDY beside
  BUD xN — the count no longer bleeds onto BUDDY), quests, gym
  talk, join/rest/full messages, nursery, Louie. Sprouts are
  BUDS; buddies are what buds command.
- **The patch is a living bud farm.** After the intro, the three
  soil spots (four with a Garden Bed) keep germinating buds of
  random basic types. They age through Sprouts' stages (nub →
  sprout → grown, ~30s), drawn at growing sizes in the soil.
- **Grown buds work, like Sprouts' gardeners.** A grown bud left
  in the patch fetches fallen apples and carries them to the
  Lantern on its head, depositing berries/wood/petals — and
  sometimes it brings back a WILD BUD (+1 stock of a random
  type): the sprouts literally create your capture materials.
- **...or pluck them.** Walk up to a grown bud: "PLUCK X BUD" —
  it's in your pouch, and the spot starts growing the next one.
  Plucking vs. leaving workers is the player's standing choice,
  exactly the Sprouts garden tension.
- **Wild buds by habitat.** Every wild sector grows 1–2 loose
  buds of its own species' types (Dews at the Shore, Embers in
  the Wastes...), sparkling in the open. Walk into one to collect
  it. Placement avoids nodes, grass (no ambush pickups), and
  solids.

**Verification:** all 13 Sproutwild suites green (new `sw13`:
germination, stage timing, an unaided bud delivery raising base
wealth, pluck-to-pouch with regrow, wild bud collection), soak
green, Rootdeep green, 0 console errors. Renders viewed:
`v35-patch.png` (buds growing in the soil), `v35-pause.png`
(BUDDIES / BUDDY GUIDE), `v35-battle.png` (BUD x7 vs BUDDY, side
by side, no bleed), `v35-wild.png`. One flake found and fixed in
the suite (pluck a bud where it STANDS — workers wander).
**Phone status: unconfirmed — awaiting Will.**

## v3.4 — "Hands, tools, and the sprouts come first" (2026-11-14)

Will's direction: gathering should take real work (~15 hits, a bar,
stamina), tools (axe + pickaxe) should be unlockable and levelable
like Palworld's tech, and the game should START the Sprouts way —
you grow little sprouts at base, they fetch and carry and work,
they grow — and only then does the creature collector begin.

- **Gathering is work now.** Trees and rocks have **15 HP**, bushes
  6. Every A press is a swing: the node shakes, a damage chip floats,
  and a **green HP bar** shows above it. Each swing costs **5
  stamina** (100 max, thin bar under the HUD when spent; it regens
  after a 1-second breather; at <5 you're Winded and swings refuse).
  Cottage REST restores stamina with the party.
- **Tools: the AXE and the PICKAXE.** The Tinker Bench is now a real
  workshop screen: craft and upgrade each tool through Lv3. Every
  level is +1 damage on its node kind (Lv1 axe = 8 hits a tree,
  Lv3 = 4), Lv3 also yields +1 per node. Costs scale (6W/3S to
  craft, up to 24/14 + 5 ingots at Lv3). Tool levels and stamina
  show on the BASE screen. Your partner obeys the same physics now:
  a command toss sends them to WORK the node hit by hit (2 dmg a
  strike) instead of insta-gathering it.
- **The sprout-first opening.** Quest 1 is now TEND THE SPROUT
  PATCH: a soil patch south of the clearing where three baby sprouts
  sleep. Press A and they wake, waddle to the apple trees, pick an
  apple, carry it back to the Lantern on their heads, and deposit it
  (+1 berry to you each trip). Three deliveries and THEY GREW —
  that's when the choice clearing opens. Befriending now pays the
  fantasy forward: your partner joins, and the other two sprouts
  become your first throwing buds (+3 partner type, +2/+2 others),
  so your first catch is literally made with the sprouts you raised.
  Old saves skip tending (derived from facts, as always).

**Verification:** all 12 Sproutwild suites green (new `sw12`:
15-hit tree with stamina math, winded refusal + regen, axe/pickaxe
crafting with costs, 8-swing axe tree, partner working a rock hit by
hit, grown-sprout grants; sw4 plays the tending PHYSICALLY — buds
fetch all three apples unaided), soak green, Rootdeep green,
0 console errors. Renders viewed: `v34-patch.png`, `v34-tend.png`
(buds scattering to work), `v34-chop.png` (HP bar + chip over a
tree), `v34-tools.png` (one overlap caught + fixed before shipping).
**Phone status: unconfirmed — awaiting Will.**

## v3.3 — "Leader, working menus, a world that feels like Sprouts" (2026-11-14)

Will's list from playing v3.2: pick who's party leader; fight scenes
look terrible; D-pad doesn't move right in battle menus; battle text
overlaps; and the world — not just the characters — needs to feel
like Sprouts.

- **PARTY LEADER.** Pause → PARTY → press **A on any partner to make
  it the leader** (★ LEADER). The leader walks with you in the
  overworld and opens every battle. A on the leader still uses a
  Tonic; START still sends to the box. Order is saved.
- **Battle menus navigate like they're drawn.** The menu, move list,
  and bud picker are 2-column grids, but the cursor used to move in
  a straight line — DOWN from FIGHT landed on BUD (visually right),
  which is why the D-pad felt broken in fights. New grid navigation:
  LEFT/RIGHT step across, UP/DOWN step a full row, matching the
  picture. (Three test drivers had to relearn the same lesson — one
  had been fleeing fights by accident.)
- **Fight scenes rebuilt as a place.** No more two-tone void: battles
  happen in a little diorama of the sector — sky, a tree line on the
  horizon, the sector's own grass with flowers and tufts, a dirt
  patch worn under your partner, raised platforms, idle bobbing, and
  framed HP boxes with a type-colored plate. Gloom Hollow gets a
  night sky and a moon; the Ember Wastes a sunset. The bottom panel
  grew (52→56px) and every phase — prompt, moves, bud picker, party —
  got its own non-overlapping layout; the bud picker is a 2-column
  grid now, so six bud types fit on screen.
- **The world, Sprouts-ified.** Every sector palette lifted toward
  Sprouts' bright lawn greens (Gloom and Peak keep their moods,
  lifted a notch). Ground detail: pink/white flowers and clover in
  the speckle pass. Lantern posts now line the dirt roads — it's a
  Lantern world, the road should glow. Split-rail fences flank the
  base gate, and the gym grew windows and a gold door frame.

**Verification:** all 11 Sproutwild suites green (new `sw11`: leader
reorder + leader opens battles + tonic-on-leader, full grid-nav
sweep of menu/moves/budpick), soak green, Rootdeep playtest green,
0 console errors. Renders viewed: `v33-battle.png` (the new stage),
`v33-budpick.png` (grid + KIN!/STRONG/WEAK), `v33-party.png`
(★ LEADER), `v33-base.png`, `v33-meadow.png`. One render defect
caught and fixed: the PARTY header subtitle collided with the title.
**Phone status: unconfirmed — awaiting Will.**

## v3.2 — "Throw sprouts, not orbs" (2026-11-14)

Will's idea, fleshed out: *instead of throwing orbs, you throw
sprouts — and the sprouts command the creatures.* Plus a graphics
push: "GBA Pokemon looked better… you shouldn't just walk right
over the trees."

- **BUD TOSS recruiting (orbs are RETIRED).** In battle, ORB is now
  **BUD**: pick a sprout bud from your crew and throw it. The bud
  lands on the wild's head and *takes command*. Odds = species catch
  rate × missing-HP factor × **kinship**: same type ×1.5 ("KIN!"),
  type that beats it ×1.25 ("STRONG"), type weak to it ×0.75
  ("WEAK") — the picker shows the tag before you commit. Sun Orbs
  are gone from the HUD, the pause menu, and the Cottage (which now
  sells a random bud for 12 petals).
- **The bud economy is a loop, not a shop.** Befriending your starter
  grants +3 buds of its type. Winning a wild battle: the loser's bud
  hops over to your crew (+1). Gathering: 25% chance a bud pops out
  of a node. Nursery harvest: +2 buds alongside the partner. Run dry
  and BUD refuses with the lesson — *win battles to earn buds* — so
  the loop can never soft-lock. Old saves get a starter pack
  (2 EMBER / 1 PEB / 1 DEW / 2 LEAF) on load.
- **Command toss (the other half of Will's idea).** In the overworld,
  **B throws a bud** where you're facing. If it lands near a resource
  node, your lead partner dashes over and gathers it for you — you
  command your crew by throwing sprouts at the work. Costs nothing;
  it's an order, not an item.
- **GBA pass.** Scenery trees and rocks are solid now, and trees are
  **depth-sorted**: walk behind a canopy and it covers you; walk in
  front and you're on top — no more strolling over the treetops.
  Tall grass is a real blade field (hundreds of two-tone blades per
  patch, seeded, with flower flecks), wild sectors got a dirt road
  from the Gate, the base path turned to dirt, and the ground checker
  softened under large seeded light patches.

**Verification:** all 10 Sproutwild suites green (new `sw10`: starter
grant, budpick flow, exact one-bud-per-throw spend, EMBER-commands-
FERNFANG recruit, zero-bud refusal + win-grant recovery, command-toss
gather, trunk collision), Rootdeep playtest green, 0 console errors.
Renders viewed: `v32-budpick.png` (picker with STRONG/WEAK tags),
`v32-toss.png`, `v32-meadow.png` (tall grass + road), `v32-depth.png`
(player behind a canopy), `v32-command.png`. First capture attempt
caught a rig mistake (console never powered on — shots showed the
Sprouts cartridge); re-captured properly before trusting them.
**Phone status: unconfirmed — awaiting Will.**

## v3.1 — "Know your dude, meet the Gate" (2026-11-14)

Will's calls, from playing v3.0: picking a starter should explain the
creature and confirm the choice; starting at the bottom next to the
travel sign feels wrong — travel should be a *thing* (a teleporter)
that a character introduces; trees and rocks need to look nicer.

- **Starter cards.** Walking up to a sprout no longer befriends it
  instantly. A card opens: big sprite, personality line, full stats,
  the species' flavor text, work skill, starting moves, and its Lv16
  evolution. **A: BEFRIEND · B: KEEP LOOKING** — backing out costs
  nothing and the other sprouts keep waiting. (New state `g4choice`;
  confirm calls `wBefriend()`.)
- **The Lantern Gate.** The wooden MAP sign is now a stone teleporter
  arch with a glowing portal, in every sector. First time you use it
  (quest 2, exactly when travel unlocks), **Louie stops you and
  teaches it** in a 3-page dialogue — what it is, that roads past town
  need Sigils — then hands you the map with the Meadow preselected.
  B defers the lesson; it never triggers twice, and established saves
  are never ambushed (it only fires at quest exactly 2, from the sign).
- **You start in the heart of the base now.** Spawn, Louie, and the
  starter clearing moved from the south gate to mid-field. The Gate is
  a destination you walk to, not the floor you spawn on. Blackouts and
  returns also land at the heart.
- **Prettier wilds.** Trees rebuilt: tapered trunks, root flares,
  branch stubs, three-layer canopies with gold fruit glints. Rocks are
  faceted boulders with a crack and moss. Bushes got an outline layer;
  the ground sprouts little grass tufts among the speckles. Same draw
  functions serve nodes and decor, so every sector got the upgrade.
- Text caught up: objective and Louie's guide lines say "Lantern
  Gate," and Louie has a new tip about it.

**Verification:** all 9 Sproutwild suites green (new `sw9`: all three
starter cards open/back out, FERNFANG confirm, gate lesson A and B
paths, established-save sign behavior), Rootdeep playtest green, 0
console errors. Renders viewed: `v31-choice.png` (card — a clipped
SPD stat was caught and fixed), `v31-gate.png`, `v31-gateclose.png`,
`v31-meadow.png` (new trees/rocks), `v31-baseheart.png`.
**Phone status: unconfirmed — awaiting Will.**

## v3.0 — "Room to breathe" (2026-11-14)

Will's screenshot of v2.4: the base was a cramped gold plot with the
sign, Louie, the player and prompts piled into one corner.

- Base became a 480×520 field; the plot fence was deleted — build
  pretty much anywhere (placement paints a green/red validity grid).
  Old saves migrate once via a localStorage stamp.
- Sign corner decluttered (arrival beside Louie; sign alone south).
- The Meadow became the wild road; new **Lantern Town** sector
  (houses, dirt street, Pip + the Elder) holds Ranger's gym.
- Text-box intro replaced by a real opening cinematic (night, the
  Lantern, falling seed-light, sprouts waking, keepers gathering, the
  four Sigils; B skips).
- **Sprout Nursery**: plant a sprout type for berries, tend it through
  3 growth stages, harvest a new Lv1 partner. Growing added alongside
  Sun Orb catching — dropping orbs entirely is Will's call, still open.
- Workers earn work XP per production tick (+1 skill per 3 XP, cap +3).

**Verification:** 8 Sproutwild suites + Rootdeep suites green, 0
errors; renders viewed (cine0/cine3, basespawn, basemid, town,
towngym, nurmenu). **Phone: played by Will — his v3.1 feedback above
came from this build.**

## v2.4 — "The hook pass" (2026-11-14)

Will: "hard to pick up, introduction's not good enough, text overlaps,
needs to hook better." Story cut 8 lines → 4 beats; starter menu
deleted — three sprouts wander into the clearing, walk up + A to
befriend; quest reordered (Louie → befriend → catch → Cottage → Bed)
with a can't-fail intro catch; wild sprouts visibly wander sectors
(walk into one to battle it); quest state derived from facts on load;
text hygiene (opaque banners, name-label pills, wrapping say bar).
7 suites + soak green. Shots: arrival/choice/meadowwild/basevista.

## v2.3 — Scrolling world + phone feel (2026-11-14)

Every sector became a 480×360 scrolling world (was one fixed screen);
4-way GBA movement (last-pressed wins); shell tap minimum-hold fix
(sub-frame taps were being swallowed — why buttons felt dead); lead
partner follows in the overworld; bigger trees/rocks; battle layout
re-anchored to two ground points, verified at two viewport heights;
intro re-derived from save facts. 143 checks + soak green.

## v2.2 — Audit pass (2026-11-14)

12k-frame soak found and fixed a real blackout soft-lock (party wipe
never returned control). Gym teams Monte-Carlo retuned (were 8/8
victory laps → fair ~6–7/8). Lantern Shop spends gratitude hearts
(Sawmill/Statue plans). Lv16 starter evolutions. Champion finale at
Zephyr Peak. First-battle tutorial lines.

## v2.1 — The intro quest (2026-11-14)

Proper opening: Louie hello → gather → Cottage → Garden Bed → first
catch, with an objective bar; travel gated until the Cottage stands;
gym leaders refuse until the first catch; old saves migrate.

## v2.0 — Base Levels (2026-11-14)

Base Levels 1→3 via mission boards + ringing the Base Lantern; plot
and worker caps grow per level; gratitude hearts (Dragon Quest
Builders-style); Louie as a talkable guide (SHOW ME physically leads
you to your next goal); discovery banners; keeper switching
(Will/Erin/Marcus with passives + once-per-battle signature moves).

## v1 — First build (2026-11-14)

Will's brief: "GBA Palworld in the Sprouts universe" — sectors instead
of an open world, base building as the goal, gym battles, no guns.
12 wildsprout species kin to the 6 Sprouts types, Sun Orb catching,
GBA-layout turn battles, 4 Sigil gyms, grid base building with
worker production, Field Guide, Louie at base. Cartridge 3 in a new
combined trilogy file (the Rootdeep handoff file untouched).

— lil Bottie 🤖 · *kept with Will, at his direction. bzzt.*
