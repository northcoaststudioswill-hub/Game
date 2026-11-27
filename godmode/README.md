# GODMODE.EXE

A mobile-first 3D god game in one HTML file. You are the intelligence running a miniature floating island. Six
citizens look after themselves: they gather, eat, build, sleep, talk and come to believe things. You have six powers
and a budget of CYCLES. The objective chain ends at the Spire and a Singularity event; after that the island is a
sandbox.

**Play:** open [`index.html`](index.html) in a browser (phone or desktop). It is self-contained: Three.js r160 is
inlined, nothing is downloaded, and it works offline. Saves go to the browser's local storage on that device.

This is a separate game from Pocket Lantern. Nothing outside the `godmode/` folder is touched by it.

| Title | A citizen's mind | Planting an idea |
|---|---|---|
| ![Title](playtest/01-title.png) | ![Observe](playtest/03-observe.png) | ![Inspire](playtest/07-inspire-palette.png) |

| Smite | A growing village | After the Singularity |
|---|---|---|
| ![Smite](playtest/08-smite.png) | ![Village](playtest/11-village.png) | ![Sandbox](playtest/14-sandbox.png) |

Landscape, at night:

![Landscape](playtest/16-landscape.png)

## How to play

- **Drag** to orbit, **pinch** or scroll to zoom, **two fingers** (or right-drag) to pan.
- Pick a power in the dock, then **tap the island**. Tap the power again to return to Observe.
- Powers cost **CYCLES**. They refill over time, faster when citizens pray at a Shrine.
- Keyboard on desktop: `1`-`6` powers, `Space` speed, `Esc` pause, arrows orbit and zoom.

| Power | Cost | What it does |
|---|---|---|
| Observe | free | Tap a citizen to read needs, beliefs, friends and what they are doing and why. Tap a building for its status. Being watched slowly changes the watched. |
| Bless | 12 | Feeds, heals and cheers everyone within reach, regrows trees, berries and crops. Teaches Devotion. |
| Smite | 18 | Lightning. Kills a citizen, destroys a building, or shatters a rock or tree into instant materials. Witnesses flee and learn Dread; the victim's friends grieve and turn to Kinship. |
| Create | 4 to 30 | A new citizen (needs housing), a grove, rocks, or a blueprint (Hut, Farm, Shrine, Terminal, later the Spire) that the citizens build with their own materials. |
| Inspire | 15 | Plants one of the four ideas in a citizen. They become a prophet for 42 seconds and preach it to whoever is nearby. |
| Intervene | 3 | Drag a citizen through the air. Drop them on a tree, rock, bush, building site, shrine, terminal, farm or neighbour and they take the hint. |

### The four ideas

Every citizen holds four belief values. The strongest one, once past 0.4, is their creed and shows as a hat.

| Idea | Hat | Consequences |
|---|---|---|
| Devotion | halo | Prays at shrines (refills your cycles), content, works a little slower. |
| Dread | red hood | Works 40% faster and through the night, prays out of fear, miserable, panics easily. |
| Acceleration | antenna | Studies at the Terminal (makes Insight), stays up at night, eats late and risks starving. |
| Kinship | sprout | Happy, sociable, gathers food, will not pray, resists Inspire and resents being picked up. |

Ideas spread when citizens talk (a coloured spark hops between their heads), faintly by standing near each other,
and strongly around a prophet. Opposed ideas argue instead and make rivals. When half the island shares one idea an
**Age** begins and changes the rules for everybody (faster cycles, faster work, faster insight, or more births).
An idea that almost everyone already holds goes stale: word of mouth for the majority idea weakens past half the
island, holders of a small minority idea resist conversion harder, and once one idea passes about two thirds,
curious citizens start to break from it (a **schism**) toward a rival idea. Preaching is not weakened.
The ending text of the Singularity depends on the Age at the moment the Spire wakes.

Each Age also changes how the island looks and sounds. Devotion: a gold sky, motes of light rising, and the ambient
tune becomes slow organ chords. Dread: a blood-red sky, dark clouds, falling embers, dry lightning out over the
clouds, and a low, sour drone. Acceleration: a cyan sky, streams of data rising off the island, faint daytime stars,
a bright scrolling grid below, and quick square-wave arpeggios. Kinship: a soft green light, fireflies that blink
(brighter at night), and two voices answering each other. The edges of the screen take the Age's colour. After the
Singularity the island keeps the look of its ending for good; after THE COMPROMISE it shows all four, faintly.

### Two ways to play

**New world** asks which you want. **Endless**: no objectives at all. The island runs for as long as you like, people
grow old and die, and their children and grandchildren carry on. The Spire only becomes possible once they have a
Shrine, a Terminal and 80 Insight, and then it sits in your Create menu until you decide to build it, if ever. The
citizens never start it themselves. **With a goal**: the objective chain below, ending in the Spire. After that the
island keeps running as a sandbox. The pause menu switches between the two at any time (until the Spire is built).
The bar under the zeitgeist shows the day, the generation and how many are alive.

### The wider world

The home island is one of 7 or 8 in an ocean, and everything nobody has seen yet is under fog. People clear the
fog around themselves as they go about their lives (so the far side of the home island starts hidden too). Once the
island has 20 Insight, a curious person standing on the shore may realise that **wood floats**. After that:

- Every settlement of 4 or more (6 at home) stakes out a **dock** on its shore, and someone builds **boats** there
  (8 wood each; one boat, or two once a settlement has 10 people).
- Brave, curious adults take a boat out to **explore**, toward the darkest part of the map. They see far, sail around
  any island they spot, and come home with stories (and a little Insight). The first to see an island **names it**.
- When a settlement is big enough (9 at home in an endless world, 13 with the goal on, 12 in a colony) and an
  island has been found that nobody lives on, a group may **leave for good** to found a settlement of their own.
  At most 45% of a settlement goes, plus partners and small children:
  - a **faith colony**: a faction outnumbered at home, or one that just lost a war, takes its faction with it;
  - a **company town**: someone with 40+ coin takes their workers, who all work for the founder;
  - a **war host**: the bravest and angriest, who go on to **raid** other settlements by boat for food and wood;
  - a **free camp**: the unhappy, or just too many people for the island.
- Each settlement has its own hearth, stockpile, huts, farms, dock, shrine or terminal, and its own factions and
  leaders. People only meet, marry, argue and follow leaders on their own island, so the groups drift apart.
- Settlements **trade** by boat (swapping their most plentiful goods, which eases bad blood), and war hosts, or anyone
  with enough bad blood, **raid**. The defenders fight back.
- Anyone stuck on an island that is not their settlement's joins whoever lives there, or lights a fire and starts
  a camp. An island where you Create a person with nobody else there gets that person's camp. Intervene can carry
  someone across the sea to another settlement.
- The **&#9678;** button jumps the view between settlements, boats at sea, and the whole known world. The resource
  bar shows the stockpile of whichever settlement you are looking at (Insight is shared by everyone). Tap a hearth
  to read about its settlement: founder, kind, creed, people, stockpile and rivals.
- The Spire can only be built on the home island.

### Looking into a life

Tap someone with Observe, then **LIFE**. Time stops while the panel is open.

- **SOUL**: their temperament, parents and generation, creed and faction, mood, money, how long they are likely
  to live, and what they are thinking. **What they want**: their desires, strongest first, such as someone to love
  (or a particular person), a child, a home, steady work, a business of their own, to lead their faction, revenge on an
  enemy, to be remembered, or to be noticed by the Watcher. Each has a **GRANT** button. **What they hide**: unseen
  thefts, secret love (and whether it is returned), a grudge against someone who thinks they are friends, doubts about
  their faith, a leader who does not believe, resentment of a boss, hidden coin, the certainty that something in the sky
  is watching. Each has a **REVEAL** button, and revealing has consequences: thieves are shunned, crushes are
  answered or end in heartbreak, doubting leaders are thrown out.
- **STORY**: their life as they remember it, day by day: where they came from, love, children, fights, conversions,
  jobs, wars, losses, and every time you touched them.
- **PEOPLE**: how they feel about every other person, and how each feels back. Tap a name to look into that life.
- **STEER**: your hand on this one life, for CYCLES: grant their deepest wish, kindle love for someone, sow a grudge,
  make peace, reveal their secret, raise them up as a leader, shower them with coin, calm them, fill them with rage,
  plant doubt in their faith, send a prophetic dream, grant a longer life, or let them go, peacefully.

### Generations

A life is about 25 to 37 minutes at 1x (shown in years: childhood takes 160 seconds and counts as 18 years, then about
25 seconds a year, so most live into their 70s to 90s). Past about three quarters of it they grow old: grey hair, a
stoop, slower steps. They no longer fight or go to war, and they tell the children stories, which earns a little
Insight. Then they die in their sleep, and the log says what they leave behind. Their name is freed for a future
child. Only couples aged 20 or more, and not old, have children. The island holds up to 30 people (8 huts).

### Their lives

The citizens have lives of their own, and you can read all of it in the inspector (tap someone with Observe).

- **Opinions.** Everyone has a private opinion of everyone else. Talking, working and dancing together raise it;
  arguments, theft, fights and jealousy lower it. Every pair also has a fixed chemistry, so some people just click and
  some just grate. Gossip passes opinions on ("Bip says Momo cannot be trusted"). The poor resent the rich they stand
  next to. The inspector lists partner, parents, children, best friends, friends, rivals and enemies.
- **Love and families.** Good friends can become a couple, move in together, go for walks by the pond, and have
  children. Babies are born to couples only; a couple has at most one small child at a time and three in all.
  Children are small, play tag, follow their parents around and learn their beliefs, and grow up after
  about 160 seconds. Couples who stop liking each other split up. Losing a partner hits hard.
- **Faith leaders and factions.** When three or more adults share an idea, the most devoted and charismatic one becomes
  its voice (a gold crown). The believers form a named faction (the Golden Choir, the Red Order, the Bright Signal,
  the Green Table, and so on) and fly its flag. The leader calls sermons, and followers gather round. Afterwards
  the leader sets a decree (build, feed each other, pray, study, bring wood) that the whole faction leans toward.
  Followers trail their leader around. Leaders are hard to convert. Kill one and the faithful call it martyrdom.
  Inspire a leader and the whole faction hears it.
- **Money and business.** Hauling to the stockpile and building earn a coin. Once the Shrine and Terminal stand,
  an enterprising citizen can open a **Bakery**, a **Tavern** or a **Workshop**. They own it, hire up to two people,
  and pay them per shift. Bread costs a coin. A drink costs a coin. Tools from the workshop make everyone work
  faster for a while. Unpaid workers quit. If an owner dies, a worker inherits the shop.
- **Chill.** Fishing at the pond (sometimes a fish for the stockpile), naps in the sun, stargazing at night (a little
  Insight), evening dancing at the hearth, nights at the tavern, and a **festival** when something good happens and
  the island is happy.
- **Extreme.** Tantrums. Theft from the rich, which ends in a fight if someone sees. Fistfights over grudges,
  insults, jealousy, or one drink too many: the loser is knocked out for a few seconds. A citizen who is miserable
  for long enough walks off to live alone at the edge of the island for a while. When two **opposed factions**
  build up enough grudges (arguments, fights, thefts, standing too close), they go to **war**: both sides line up
  under their flags and charge. Most fighters are only knocked out, but the badly hurt can die. The winners gloat,
  some of the losers change sides, and a beaten leader may be thrown out. A truce holds for a while afterwards.
- **Your hand in it.** Bless a fistfight to stop it (and the two like each other more for it). Bless the battlefield to
  force a truce by miracle. Smite still scatters everyone, and is remembered.

### Objectives

Wake (observe a citizen) → Nurture (8 citizens) → Seed an idea (4 share a belief) → Infrastructure (a Shrine and a
Terminal) → Compile (80 Insight) → The Spire → Sandbox. Left entirely alone the citizens get there in roughly
13 to 17 minutes at 1x; an engaged player in about 10 to 12 (they have lives to lead now). If you do not place the Spire, they start it without you.

## How it is put together

```
godmode/
  index.html          the built game (commit this; it is what people open)
  build.py            src/shell.html + /*@include*/ scripts -> index.html
  src/
    shell.html        page, styles, HUD markup
    core.js           constants: beliefs, buildings, costs
    world.js          island height field, walkability, resource nodes   (no DOM, no THREE)
    sim.js            citizens, needs, beliefs, memetics, economy, powers, progression, save format (no DOM, no THREE)
    society.js        families, romance, opinions, gossip, leaders and factions, shops and coin, pastimes, fights, war
    life.js           ageing, generations, memories, secrets, desires, the god's steering actions
    voyage.js         fog, boats and docks, exploration, settlements founded by emigrants, raids and trade
    render.js         Three.js scene: terrain, instanced nodes, buildings, citizens, effects, camera
    audio.js          WebAudio effects and a sparse generative tune (no audio files)
    ui.js             HUD, inspector, palettes, tutorial, menus, dialogs
    input.js          pointer, touch, wheel and keyboard
    main.js           boot, fixed-timestep loop, autosave, sim events -> feedback
    vendor/three.min.js   Three.js r160 (MIT)
  tests/
    sim_balance.js    headless runs of the sim across seeds and play styles
    play_phone.js     Playwright run of the built file at 390x844 with touch
  playtest/           screenshots from the last test run
```

- **Fixed timestep.** The sim runs at 20 steps a second regardless of frame rate; the renderer interpolates
  positions. Speed (1x, 2x, 4x) only changes how many steps run per frame.
- **Sim and render are separate.** `sim.js` never touches the DOM or Three.js; it emits events (`bless`, `smite`,
  `meme`, `convert`, `built`, ...) that `main.js` turns into particles, sound and log lines.
- **Citizens** are a small state machine (idle, wander, gather, eat, build, farm, worship, study, talk, preach,
  flee, sleep, mourn, cheer, held). Each time one finishes a task it scores the options against its needs, beliefs
  and the village's stock, picks the best, and records the reason as its `thought`, which the inspector shows.
- **Performance.** One Lambert material with vertex colours for nearly everything, instanced trees, rocks and
  bushes, no shadow maps, no textures beyond two tiny pixel atlases. Pixel ratio is capped (the default "retro"
  mode renders at about 540 pixels on the short side and scales up with hard pixels). The loop stops simulating
  when the tab is hidden and does not fast-forward on return.
- **Saving.** Autosaves every 12 seconds, on pause-to-title, and when the page is hidden. "Erase and restart" is
  in the pause menu. If storage is unavailable the game still runs, it just cannot continue later.

## Build and test

```
python3 godmode/build.py            # writes godmode/index.html
node godmode/tests/sim_balance.js   # sim only; prints when each objective falls for 4 seeds x 3 play styles
node godmode/tests/play_phone.js    # needs Playwright + Chromium; screenshots go to a temp folder (or pass a folder)
```

## Changelog

### 0.6, Nov 27 2026: an archipelago in the fog, boats, and settlements that break away

- **World** (`world.js`): `makeIsles()` adds 6 or 7 islands at 50 to 105 units from home, each with its own height
  grid, shoreline, optional peak and pond, and a character (forest, stone or meadow) that sets its trees, rocks and
  bushes. `groundY`, `walkable`, `clampWalk` and `heightRaw` work on any isle; the home isle is still `W` itself.
  Sea level `SEA_Y`, fog grid 70x70 cells of 4 units (`fogIdx`, `fogKnown`).
- **Voyages** (new `voyage.js`): settlements (`S.sets`, each with its own stockpile; home's is still `S.res`),
  fog reveal and discovery and naming, the invention of boats, docks (`BUILD.dock`), shipwrights, boats (`S.boats`)
  that steer around land, exploring crews, exodus to found faith colonies, company towns, war hosts and free camps,
  raids, trade, a planner for each colony, and the rescue of anyone stranded. New states `shipwright embark aboard
  ashore reboard`. Hunger runs at 40% at sea.
- **Everything local**: gathering, eating, building, stockpiles, homes, farms, shrines, terminals, shops, customers,
  theft, fights, dates, play and fishing now use the person's own settlement and island. Factions are per settlement
  (`f.set`). Births need food in the couple's own settlement. People fish the sea for food when their island has
  nothing to forage, and only try to gather what their island has (`isleHas`).
- `POP_MAX` is 40, and `popCap` grows by 4 for each living colony.
- **Render**: every isle gets terrain, a beach and a rocky skirt into the sea; an animated low-poly ocean; two lumpy
  fog layers built only over unexplored cells, with soft edges; boats with sails in their settlement's creed colour;
  dock piers. Isles stay hidden until found. Clouds are higher; the old grid now lies just under the sea. The camera
  can zoom to 140 and pan as far as anyone has seen.
- **UI**: the &#9678; jump button, the resource bar for the settlement in view, day/generation/settlements/isles in the
  endless bar, hearth and dock inspectors, where someone lives on their LIFE page. Banners for boats, land,
  exodus, new settlements and raids.
- **Save v3**: adds `fog` (a string of 0s and 1s), `sets`, `boats`, `tech`, `found`, `isleNames`, `rival`, and the isle
  of each node. A v2 save loads with its island fully explored and the new isles' resources generated.
- Tests: the endless runs in `sim_balance.js` now also require boats, at least 2 islands found and at least 1
  settlement founded. `play_phone.js` checks that the fog exists, that unseen islands are hidden, and that the jump
  button moves the view.

**Results by script (75 min endless, seeds 1 and 2):** boats invented and built (9 and 6 boats); 6 and 4 islands
found; 6 and 4 settlements founded, of all four kinds across the seeds; raids and trade happened; at the end there
were 39 to 40 people. A third seed (not in the test) ended with the First Village itself empty: everyone had left
or died. **Starvation** still happens in some worlds: 8 deaths in seed 1 and 0 in seed 2 (down from 27 before the
fixes). Goal runs: passive Singularity 15:14 and 17:43 (seeds 1, 2), assisted 11:31 to 11:38.
**Tested:** both scripts pass; a v2 save loads and runs 30 more minutes; screenshots of the fogged start, the
archipelago from above, a colony with a dock, a boat at sea and a colony's hearth.
**Not tested / known:** on a phone. The software-rendered test browser now runs at about 31 to 48 fps
(was about 50). The sea is redrawn every frame. The zeitgeist, the Ages, Insight and cycles are still shared by the
whole world, not per settlement.


### 0.5, Nov 27 2026: endless play, generations, and a god's view of every life

- **Endless or with a goal.** `newSim(seed, goal)`; `S.goal`. With no goal, `objectives()` only unlocks the Spire (once
  there is a Shrine, a Terminal and 80 Insight) and the planner never places it. The title screen asks, and the pause
  menu has a goal switch (`mGoal`). The quest bar shows ENDLESS or SANDBOX with day, generation and population.
- **Generations.** New `src/life.js`. Every citizen has a lifespan (`c.life`, 1500 to 2200 s of age), grows old at
  78% of it (`c.elder`), and dies of old age (`kill(S, c, 'age')`, counted in `S.stats.oldAge`). Founders start
  18 to 34 years old. `c.gen` counts generations. Names are freed on death; `S.dead` remembers them for memories.
  `POP_MAX` is 30 (huts max 8, farms max 6, the planner wants up to 5 farms).
- **Memories** (`c.mem`, the last 40, always keeping the first): written at every life event in sim.js and society.js.
- **Secrets**: stored (`c.sec`: unseen theft, jealousy, having seen the sky) plus derived ones (secret love, hidden
  grudge, doubt, a faithless leader, resenting the boss, hoarding) from `lifeSecrets()`.
- **Desires** from `lifeDesires()`, and **steering** from `steer(S, c, act, who, key)`: 13 acts, 6 to 25 cycles each,
  including granting a specific desire and revealing a specific secret.
- **Life panel** (`#life`, `openLife()` and `renderLife()` in ui.js) with SOUL, STORY, PEOPLE and STEER tabs; LIFE
  button in the inspector, which now also shows age. Elders render with grey hair and a stoop.
- Saves stay at v2: the new fields are filled in on load (`fillLife`), and an old save gets `goal: true`.
- Tests: `sim_balance.js` adds two 75-minute endless runs (seeds 1, 2): no extinction, at least 3 generations, at
  least 4 old-age deaths, no Spire, and a save round trip. Passive runs now count only deaths that are not old age.
  `play_phone.js` chooses a mode on a new world, opens LIFE (soul, story, people), checks time stops, steers two
  acts through taps, and starts an endless world, checking that nobody starts a Spire in 12 minutes and the goal
  switch works.

**Results:** endless, 75 minutes: about 30 alive at the end, generation 11, 49 to 54 old-age deaths, 75 to 78 births,
0 to 3 other deaths, never extinct. Goal runs (seeds 1 to 4): passive Singularity 13:46 to 16:54, assisted 10:38
to 11:53. **Tested:** both scripts pass, and screenshots of the mode choice, the three LIFE tabs and an endless island.
**Not tested:** on a phone; how the life panel reads after an hour of play; whether generations turning over every few
minutes feels too fast (a child can be a parent about five minutes after being born).


### 0.4, Nov 27 2026: the citizens have lives

- New `src/society.js` (pure sim, included after `sim.js`): everything under "Their lives" above. It joins `sim.js`
  through four hooks: `kidThink()` and `societyOptions()` from `think()`, `updateSocial()` for 16 new states
  (`sermon assemble shift visit steal fight ko battle dance fish nap stargaze date play hermit tantrum`), and
  `societyTick()` once a second. `converse()` now ends with gossip, romance and jealousy (`socialTalk`), and a hot
  argument can turn into a fistfight. Births go through `couplesBirth()` and `makeChild()`. Deaths call `onDeath()`.
- New building type `shop` (bakery, tavern or workshop; `b.biz`, `b.owner`, `b.till`), placed by citizens, not the
  player. `S.tools` gives up to +20% work speed.
- **Save format v2.** New citizen fields `grow mate par coin boss job title fac actCd sermCd unpaid sadT` and new state
  `factions war party partyCd tools tension truceT facId`. `deserialize` accepts v1 and fills in defaults
  (`fillSociety`); checked by loading a v1 save made with the previous code and running 8 more minutes on it.
- Render: children are smaller with bigger heads, leaders wear a spinning crown, each faction flies a flag in its
  colour (which moves to the battle line in a war), shop models with awnings, and poses for fighting, knocked out,
  dancing, fishing, napping, stargazing, dates, sermons, tantrums and shop work. Eight new emotes (coin, fist, baby,
  crown, fish, dizzy stars, cup, flag); the icon atlas is now 8x4.
- Events, banners and sounds for love, leaders, fights, war, peace, theft, coins and festivals. Sounds `love`, `punch`,
  `coin` and `war` are new.
- The inspector now shows faction and role, employer or shop, coin, home, and up to five relationships. The building
  inspector shows hut residents by name, and a shop's owner, staff and takings.
- Balance: the society costs time. Seeds 1 to 12: passive Singularity 13:20 to 16:33 (was 10:26 to 14:38), assisted
  10:01 to 12:03 (was 7:56 to 9:32). Across the 12 passive runs, every one formed couples, a faith leader and a
  shop. Left alone: 10 of 12 had a war (12 wars in all), 9 had fistfights (61 in all, unevenly: one run had 17),
4 had thefts, and nobody died. With the scripted player, who keeps inspiring one idea, the island stays more united:
3 runs had a war and 2 had fights. No deaths in any of the 24 runs this time; an earlier tuning pass had one war death.
- Tests: `sim_balance.js` prints a society line per run and fails a passive run with no couple, leader or shop.
  `play_phone.js` checks faction flags, leader crowns, child size, and the relationships in the inspector.

**Tested:** `sim_balance.js` seeds 1 to 12 OK; `play_phone.js` ALL OK; v1 save loads; screenshots of a war, a
leader's inspector and a shop. **Not tested:** on a phone; the new sounds have not been listened to. Whether this much
going on is fun or just busy needs a person to play it. Fights and wars are tuned by script.


### 0.3, Nov 27 2026: the Ages look and sound different

- `src/render.js` atmosphere: per-Age sky tint (also tints the sun and the ground bounce light), a particle field
  (gold motes, embers, data streams, fireflies), and one signature for Dread (lightning beams off the island
  every 9 to 21 s, with a thunder sound) and Acceleration (live grid, daytime stars). Weights fade over a few
  seconds when the Age changes. A new `#ageTint` layer tints the screen edges. Render only; the sim is unchanged.
- Endings: in the sandbox the atmosphere locks to the ending's idea; THE COMPROMISE shows all four at 40%.
- `src/audio.js`: the ambient tune has a voicing per Age (and per ending in the sandbox); new `thunder` sound.
- The zeitgeist panel's border takes the Age's colour.
- `play_phone.js` checks that the ending's atmosphere settles over the sandbox.

**Tested:** `play_phone.js` ALL OK, `sim_balance.js` OK; screenshots of all four Ages by day and night in headless
Chromium. **Cost:** in the software-rendered test browser the full ending look costs a few fps (about 61 to 52 at
the end of the test run; in a separate run, roughly 41 to 49 with versus without the edge tint, but those numbers
swing by about 4). Not measured on a phone. **Not tested:** the new sounds have not been listened to.


### 0.2, Nov 27 2026: counter-pressure against one-idea islands, pinch test

- **Balance:** left alone, the island used to settle on one idea held by 90 to 100% of citizens for almost the whole
  run. Three changes in `src/sim.js`: `staleness()` weakens talk and proximity spread of the majority idea once it
  passes 50% (down to 0.35x at 100%); a citizen holding an idea shared by under 30% resists conversion harder; and
  `heresy()` lets at most one curious holder of a 65%+ majority idea break toward a rival each second
  (Devotion to Kinship or Acceleration, Dread to Kinship, Acceleration to Devotion, Kinship to Devotion or Dread).
  No new saved fields, so old saves still load (`v` stays 1).
- **Effect, seeds 1 to 12 by script:** time spent at 90%+ one idea after the "seed an idea" objective dropped from
  90 to 97% of the run (seeds 1 to 4 before) to 0 to 48% in passive runs (0% in 7 of the 12). Passive runs end with
  2 or 3 ideas alive, e.g. 12/0/5/3. All passive and assisted runs still reach the Singularity with no deaths.
  Passive Singularity: 10:26 to 14:38 (was 11:07 to 15:58). Assisted runs got a little slower, 7:56 to 9:32
  (was 7:17 to 7:46), because an Acceleration majority now sheds doubters to Devotion. In one assisted run
  (seed 10) Devotion overtook Acceleration and that run got the Devotion ending.
- `sim_balance.js` now prints `mono N%` and fails if a passive run spends more than half its time at 90%+ one idea.
- `play_phone.js` now drives two real touch points through CDP: pinch out zooms in, pinch in zooms out, a
  two-finger drag pans without zooming, and lifting the fingers one at a time does not fire the armed power.
- `play_phone.js` "the saved island comes back" was flaky: the snapshot was taken in a separate call after the save,
  so a sim step could land in between. It now snapshots in the same call and allows the one second of play after
  Continue to add at most one birth or building.

**Tested:** `sim_balance.js` seeds 1 to 12 (OK), `play_phone.js` (ALL OK).
**Not tested:** still not played on a real phone; the pinch test is synthetic CDP touch in headless Chromium, not
iOS Safari. Whether schisms are fun to watch, or just noisy, needs a person to play it.


### 0.1, Nov 19 2026: first playable slice

Everything above is new: the island, six starting citizens growing to twenty, four building types plus the Spire,
six powers, four beliefs with transmission and Ages, a wood/stone/food/insight economy, the inspector, a day and
night cycle, the objective chain, five ending texts, sandbox mode with an unlimited-cycles switch, title screen,
eight-step tutorial, pause menu, event log, autosave and reset.

**Tested by script:**
- `sim_balance.js`: seeds 1 to 6. Passive and assisted runs all reach the Singularity with no starvation deaths;
  a run that smites someone every 30 seconds does not crash; the save format survives a round trip.
- `play_phone.js` (headless Chromium, 390x844, touch): title, new world, orbit, zoom, each of the six powers through
  real pointer input, pause freezes the sim, save and reload, hidden tab holds the sim, the Spire and Singularity
  dialog, sandbox, landscape and desktop layouts, a 30 second random-power soak at 4x, extinction and restore,
  and no console errors.

**Not tested:**
- Not played on a real phone. Touch input, safe areas, audio unlock and frame rate on iPhone Safari are built to
  the platform's rules but unverified on hardware.
- Pinch zoom and two-finger pan are implemented but the script only drives one pointer. (Covered from 0.2.)
- Sound has not been listened to (the test browser has no audio output).
- Balance is checked for reachability and pacing by script, not for fun by a person.
