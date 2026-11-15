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
