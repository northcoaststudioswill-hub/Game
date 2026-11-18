# Pocket Lantern v0.3 handoff: Patch & Plate (cartridge 4)

Read `v0.2/handoffs/HANDOFF_2026-11-14_v0.2.md` first for the console, the cast and Will's preferences. This file
is only about cartridge 4. Add a new section at the end for each pass; don't rewrite.

## What Erin asked for

In her words (paraphrased): a phone game she can play for a couple of minutes at a time, between texts. Simple, like
growing a farm and filling orders: plant things, then "go here and make a burger". Levels, so she can finish one and
put the phone down. No story to remember. It should save on its own; she shouldn't have to think about saving.

## What Patch & Plate is

Erin runs a farm stand: a garden on the left, a kitchen on the right, a counter along the top with three serving windows.
Customers (Will, Marcus, Scout, Ranger, and Louie) walk up to a window with an order card above them.

- **Controls:** D-pad walks one tile at a time. **A** uses whatever Erin is facing (the yellow corners show what; the bar
  under the stand says what A will do). **B** tosses what she's holding. **Select** opens the recipe book (the day waits).
  **Start** pauses.
- **The loop:** seed crates → plant in a plot (a bag plants 3) → A on a growing plot waters it (1.8x faster) → pick it
  → chop board (tap A) / oven / grill / fryer / juicer → put it on a plate spot → pick up the plate → serve at the window.
  A one-thing order (a smoothie, a pup patty) can be handed over as is. Carrying a plate to a station drops the food straight on.
- **Days are levels:** 12 days, each 4 to 10 customers, about one to three minutes. No timer; customers wait (patience bar)
  and leave if it runs out ("maybe next time", no other penalty). Coins = dish value + a tip for speed. Stars by coins
  (1 star opens the next day). First 3 stars on a day pays 1 capsule ticket into the shared machine.
- **Teaching:** each day opens with a card: one character says one line about what's new, plus the star goals. Days 1 to 3
  show a bouncing arrow over the next thing to do. Everything else is the A-hint bar. No explainer screens.
- **Growing the farm:** coins buy upgrades between days at the stand (more plots, sprinklers, sharp knife, hot stove,
  comfy bench, garden boots, big seed bags, third plate).
- **Saving:** `localStorage['patchplate-v1']`. Progress saves after every day and every upgrade. The day in progress saves
  every 4 seconds, on Start, on Swap Cartridge, and when the phone is put down (the day also pauses itself). Title shows
  CONTINUE DAY N after a reload.
- **Music:** Sprouts' William Cohen songs (the `game` list), quieter while paused. They only stream on claude.ai, so a
  downloaded copy is silent (same as Sprouts).

| Day | Name | New |
| --- | --- | --- |
| 1 | First Sprouts | lettuce, chop board, salad |
| 2 | Tomato Time | tomato, big salad |
| 3 | Bread Day | wheat, oven, fresh bread |
| 4 | Burger Time | pantry patties, grill, burger, pup patty (Louie) |
| 5 | Leafy Greens | leaf burger |
| 6 | Berry Good | berries, juicer, smoothie |
| 7 | Fry Day | potato, fryer, fries |
| 8 | The Deluxe | deluxe (bun, patty, lettuce, tomato) |
| 9 | Combo Meals | combo meal (burger + fries) |
| 10 to 12 | Lunch Rush, Market Day, Harvest Fest | busier mixes |

## Invented this pass (flag to Will; he hands out canon)

- The name **Patch & Plate** and "Erin's farm stand" as a place.
- Every line: the day-card lines and the customers' thank-yous and goodbyes. Marcus keeps his voice (bro, brags, "dap me up",
  calls Will a J once) and never mentions Waterworks.
- Erin's apron and her back and side sprites (drawn from her Sprouts sprite).
- Louie as a customer who orders a "pup patty".

## How it's wired in

`v0.3/build.py` takes the v0.2 build and adds 12 hooks (listed in the script): the fourth shelf slot and its label,
`PP` created next to `KO` with what it needs from the console, `cartPick` / shelf arrows for 4, boot → `PP.start()`,
`update`/`draw` hand state `pp` to it, `musWant`/`musLevel`, Rootdeep's iPhone text placement (cap height) for cart 3,
`PAD[3]` button labels, and `window.__g.PP`. The cartridge is one closure, `window.PP_CART`, like Knockout's.

## Checked (headless Chromium, 440x956)

`node v0.3/tests/pp_test.js`: 39 checks, all pass. All four cartridges boot; a bot plays all 12 days through the real
controls (3 stars on 9 of them, 1 star on days 8, 11 and 12 with no upgrades bought); text audit of every screen
(nothing off-screen, overlapping or squeezed); the phone-down pause and save; CONTINUE after a reload; buying an upgrade.
The only console errors are the Sprouts songs that stream only on claude.ai. **Nothing is phone-confirmed.**

## Open

1. **Erin's verdict on her phone.** Pace, how hard the later days are, whether the arrow and hints are enough.
2. The Lantern menu (in Rootdeep's code, `v0.2/src/rootdeep.js`) still counts 3 cartridges: CARTRIDGES PLAYED, the
   TRIPLE THREAT achievement, the capsule pages' HOW TO GET TICKETS. Patch & Plate's tickets do land in the shared
   machine. Updating those screens belongs to whoever is working on Rootdeep, or to a pass after it's merged.
3. Patch & Plate has no capsule items of its own yet (styles for Erin, a stand awning colour...).
4. Music: its own William Cohen track would be nicer than sharing Sprouts'.
5. No frozen backup or share package for v0.3 yet; make them once it's been played (README rule 3 layout).

## The sprout crew (second pass, Nov 15)

Will's idea: sprouts that help around the kitchen, and a way to grow them. Uses Sprouts' six canon types and colours;
their kitchen jobs are new (flag to Will).

- **Earning a seed:** the first star on days 1, 2, 4, 5, 7 and 9 pays DEW, PEB, EMBER, ZIP, LEAF and LUCKY seeds (`SEEDDAY`).
  Saves from before this pass get the seeds their stars already earned.
- **Growing one:** the seed waits in the **sprout pot** (tile `N`, end of the garden row). Take it, plant it in any plot (16 s,
  watering helps), and **pluck** the sprout when it peeks out. It joins the crew for good (`SV.crew`). The helper arrow points
  at the pot and the ripe sprout on any day, so it teaches itself. A tossed seed goes back in the pot.
- **The jobs (automatic, nothing to manage):** DEW waters growing plots; PEB chops whatever is on the board; EMBER sits on
  whatever is cooking (1.5x faster); ZIP carries finished food from a station to the plate that needs it; LEAF replants a
  picked plot, but only with a crop the next orders need; LUCKY stands by a waiting customer: bigger tips, 10 s more patience.
- **Growing them:** every job is work (`SV.cxp`); level 2 at 20, level 3 at 60, each level 30% faster. A level-up pops a label.
- **SPROUTS page** at the stand: the crew, their jobs, level stars and progress, seeds waiting, and which day earns the rest.
- Once a sprout is on the crew, the helper arrow leaves its job to it (Erin isn't sent to chop when PEB will).
- Tests: 46 checks pass. Every working sprout does its job; with all six the bot gets 3 stars on days 8, 11 and 12, where it
  gets 0 to 3 without them.

## Scenes, quips and its own music (third pass, Nov 15)

Will asked for cinematics between levels, after orders and at good moments, with good quips, and sent a song for the game.

- **Music:** "Cook E" by dreamliketextures752 (the file's tags; made with Suno), in `v0.3/music/` with checksums and its
  24px cover art. `build.py` embeds it tagged `pp`, so it plays in a downloaded copy too. The game file is now ~14 MB
  (the claude.ai page limit is 16 MB). The console passes `hasTracks`; without the song it falls back to Sprouts' songs.
- **Scenes** (`cine()`, Sprouts' cutscene look: sky bands, hills, ground strip, the speaker drawn big, a typed text box):
  - *Opening* (first day 1 only, `SV.opened`): Will hands Erin the stand; Erin and Louie answer.
  - *Night* (NEXT DAY on the results): dusk with a quip about how the day went (by stars), night with Louie and the crew
    asleep, dawn with the sign flipping to OPEN and "DAY N", then the next day's card.
  - *Taste* (`SV.tasted`): the first time each dish is ever served, the customer holds it up with a line for that dish;
    Marcus has his own. *New helper*: a sprout pops out of the soil when plucked.
  - Short (1.6 to 4.6 s), auto-advancing; A skips a line, Start skips the scene. During a day the day waits. Putting the
    phone down mid-scene drops the scene and pauses the day as usual.
- **Quips** (`quip()`): a portrait line under the hint bar that doesn't stop play. First plate (sometimes), a clutch serve
  (under 20% patience), a streak of 4 and 8, a rush (three waiting at once, day 4 on), the first customer who leaves, the
  last plate, a sprout levelling up. At most one every 10 s unless it's one of those moments.
- **Results:** confetti on a 3-star day.
- All lines are new (flag to Will). Marcus: bro, brags, roasts, no Waterworks.
- **Fix found by the bot:** holding food that fits no plate while both plates were finished orders stalled the helper arrow
  (and a day). The planner now tosses it. 40 runs of the hardest days: no stalls, every run at least 1 star.
- Tests: 57 checks pass (scenes, skipping, the night leading into the next day, quips, the song, text audits of each scene).

## Engagement pass: save files, Louie, friends, asks, wardrobe, more lines (Nov 15)

Will asked for more dialogue (Will, Erin, Louie, Marcus), to look at how games like this keep people coming back, a save
system with NEW GAME, nicer menus, more Erin customization, and feeding Louie: loaf, dry kibble and fresh lettuce,
sometimes a mix, and sometimes he changes his mind mid-order. ("Fresh let" read as fresh lettuce; check with Will.)

**What the research says** (short web search; sources are mostly blog-level, so treat as direction, not proof):
small goals you can finish keep people longest; short daily visits suit this genre; friendship that grows through
repeated small interactions (Stardew's hearts); a daily care chore such as feeding an animal; and no guilt or
lost streaks for skipping days, which undercuts the cozy feel. All five shaped this pass.

- **Save files** (`SLOTKEY`): three files. File 1 keeps the original key `patchplate-v1`, so older saves carry on;
  files 2 and 3 are `patchplate-v1-s2` / `-s3`; `patchplate-meta` remembers the last one. Title: CONTINUE / NEW GAME,
  SAVE FILES, SWAP CARTRIDGE. The files page shows each file's day, stars, coins, crew and hearts, with PLAY and ERASE
  (ERASE needs three presses). Everything still autosaves.
- **The stand is a hub now:** PLAY DAY N (or CONTINUE DAY N) on top, so one press starts the next day; ALL DAYS,
  UPGRADES, WARDROBE, SPROUTS, FRIENDS, RECIPES, SAVE FILES. Lists have a bouncing cursor; screens fade into each other.
- **Today's asks:** three small goals a day from a pool (serve, feed Louie, pet Louie, a streak, stars, plant,
  burgers, finish days). 15 coins each; all three pay a capsule ticket. Skipping a day costs nothing.
- **Louie lives at the stand** (from day 2): a bed and bowl at the kitchen's top-left, a kibble bag and a loaf tin on
  the bottom counter. He naps, then wants kibble, a loaf or fresh (chopped) lettuce; from day 3 sometimes two of them.
  About a third of the time he changes his mind while he waits ("?!", and Erin: "LOUIE. YOU SAID KIBBLE.").
  Wrong food gets a "*SNIFF* NOPE"; A on the bowl takes the last thing back. Feeding fills his mood; a happy Louie
  (60+) adds 10% to tips. A on Louie pets him. He no longer orders at a window (the PUP PATTY recipe is retired).
- **Friends and hearts:** serving someone grows their hearts (more for fast service); feeding and petting grow
  Louie's. Four hearts each (4/12/24/40 points). Each new heart with Will, Marcus or Louie plays a short scene after the
  day (before the night scene). Gifts: Will's 2nd heart unlocks the FLOWER CROWN, Marcus's 3rd the BRO CAP. FRIENDS page
  shows everyone's hearts and what's next.
- **Wardrobe:** dress (6), apron (4, including none), hat (6), and the stand's awning colour (4), which repaints the
  counter, title and scenes. Bought with coins, or unlocked by hearts or total stars (CHEF HAT: 18 stars). Live preview.
- **More lines:** customers' thank-yous (Will and Marcus have many more), arrival lines and impatience lines, Erin
  answering in quips, two-line night conversations, Louie's cravings and mind changes, heart scenes. Marcus keeps his
  voice ("I've got a guy. The guy is me." and "See one, send one" are reused from Sprouts), calls Will a J, and never
  mentions Waterworks. Everything else is new: flag to Will.
- Tests: 76 checks pass, including save files (fresh file 2, file 1 untouched, three-press erase), Louie fed and
  changing his mind, hearts and the heart scene, asks paying out, the wardrobe, and text audits of every new screen.

## Release: v0.3 frozen and pushed (Nov 15)

- Frozen copy `backups/pocket-lantern_2026-11-15_v0.3_BACKUP.html`, share folder `share/pocket-lantern-v0.3/` with a
  four-cartridge HOW-TO-PLAY, and `share/pocket-lantern-v0.3-share.zip`. SHA-256s in `v0.3/README.md`.
- `CHANGELOG.md` (patch log by commit), `VERSION.md`, `playtest/TEST_REPORT.md` (76/76), `playtest/UPDATE_GALLERY_v0.3.png`.
- `LATEST.md` at the repo root points here (a new file; the old root setup is untouched).
- Pushed to `claude/optimistic-brown-0pt8kf`. The Rootdeep line is still `claude/adoring-shannon-825i25`; nothing on it changed.
  When Will wants one line again: merge this branch into it (or open a PR). It only adds `v0.3/`, `LATEST.md`, the v0.1
  music backup, the v0.2 share repair and appended notes, so it should merge cleanly.
- Next version: new files only (`backups/..._v0.3.X_BACKUP.html`, `share/pocket-lantern-v0.3.X/` + zip), hashes in the README.
