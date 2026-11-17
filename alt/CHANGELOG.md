# Pocket Lantern ALT changelog

ALT = v0.3 plus the changes below. Names and likenesses are unchanged everywhere. Patch & Plate's code is untouched.
Everything here is **invented this pass and not phone-confirmed**; flag anything to Will (he hands out canon).

## v12.1: Guardians of the Light, and why they are at Sunkeep (Will, Nov 17)
- Every "alpha" the player can read is now a GUARDIAN. In story terms they are the Guardians of the Light: every place has one, they went dim when the Lantern did, and a dim Guardian spells peril for the kingdom. (The code still calls them `alpha` inside.)
- When you bring one the light, its Sigil stone goes home to the Lantern. The Sigil scene, the Elder, Marcus, the guide page and the opening story all say so.
- The opening story has one new page: three people were called to Sunkeep and none of them knows why. Marcus left a Flow Pros job with Derek. Erin and Will left their wedding plans on the table. Erin: "You got here last, Will, so we will fill you in."
- Two early lines at Sunkeep from Marcus and Erin about being called, and four new idle lines.
- New file `alt/STORY-NOTES.md`: Will's story decisions in one place, with what is still open (why Sunkeep exists, who called them, the lamp's name).
- Also in this build: a street-following fix. Workers walking to a building site restarted their route every frame and never arrived, so a cottage placed away from the avenue was never built. Found by the fresh-save run.

Checked: field lab; the castle label and prompt on screen. The fresh-save run on this build is still going.

## v12.0: Sunkeep, redesigned (Will, Nov 17)
Will: cluttered, hard to build at, characters ignore the paths, weird plots; grow sprouts in one big bed like Sprouts, then placeable plots, buddies working them, level-gated recipes; keep the furniture; more lore; clean it up.

Layout
- One avenue from the Lantern to the south gate, and three streets off it: Lantern Row, Field Lane, Gate Lane. The old web of lanes is gone.
- The land between the streets is open for building.

Building
- The build screen tints every free spot green, and the cursor starts on the nearest free spot to you.
- Streets and furniture can't be built on.

People
- Erin, Marcus and the home workers walk along the avenue and the streets and step off only at the end. Measured: Erin was on a road in 36 of 38 samples while crossing the whole base.

The Lantern's soil
- One big bed with a stone edge and stepping stones where the avenue crosses it. Sprouts come up in it as before (6 spots, 8 with the cottage, 12 at Sunkeep Lv2). No stakes or little frames.
- It grows sprouts only now. Old saves: any crop set on a soil plot is cleared.

Crop plots
- CROP PLOT is a new thing to build (2 wood, needs the cottage). You place it where you like. It starts with BERRIES; A on it changes the crop or harvests.
- FIBER REEDS need Sunkeep Lv2.
- 2 plots at Sunkeep Lv1, 4 at Lv2, 6 at Lv3.
- The best home waterer or planter tends them, and the plot's label names who ("BERRIES · 40% · DRIZZLET tends it"). Picking a buddy per plot by hand is not built yet.
- The tutorial step "grow berries on a garden plot" is now "build a CROP PLOT". Erin's garden talk and the hints say so.

Recipes
- Gated by Sunkeep's level: TONIC and ROPE at Lv1, SEED POUCH and LANTERN OIL at Lv2, LUCKY CHARM at Lv3. First guesses.

Lore to read (A)
- The Lantern plaque, the founders' stone, the sign at the soil, the waystone at the gate. Two lines each.

Pacing (found by the v11 fresh-save run): Erin's "why" talk fired at home while the cottage was going up. It now only plays out in the field.

Checked: field lab (plot checks rewritten for the new rules); real-time at 430x932: the whole base, placing a plot through the menus, growth, a buddy's harvest, the fiber gate, a plaque.

## v11.0: Will's notes after playing to the Bibi scene (Nov 17)
Pacing
- Erin's "why" talk now waits until her tutorial is over. It used to land in the middle of it, right after the battle lesson.
- The King Bibi beam waits for a quiet minute out in the field after that talk. It no longer fires at home, on top of "build the cottage".
- The lamp scene with Marcus still waits for the cottage and its party.

Kiss
- He does not appear until the tutorial is done, and he has moved from the Meadow's north gate to the south road, by the way to the castle. His tip is now about LEAF sprouts and the thorn gate.

Travel
- Going from one area to another plays a short side-on scene (under 3 seconds, A skips): the place you are going, its name, and the keeper walking in with up to four of your sprouts. No buddies in it, on purpose.
- Landmarks so far: the Lantern tree (Sunkeep), houses (Lantern Town), the castle (Squire's Woods), crooked trees (the Hollow), the pond and tall grass (the Meadow). Other areas get plain trees for now.

Rooms
- The three houses in Lantern Town open: the baker's, the gym goer's, the sprout lover's. Walk in, look at things with A, leave by the mat or B. They do nothing else yet. This replaces the "KNOCK" one-liners.

Sunkeep
- The well, notice board, benches, flower beds and pond are solid. You used to walk straight through all of them.
- The road from the Lantern to the south gate is wider with a paved middle, lamp posts that light at dusk, and stone gate posts where it leaves for the Meadow.

Checked: field lab; real-time at 430x932: five travel scenes, all three rooms, Kiss's new spot, Sunkeep top to bottom.
Not checked yet: the new pacing from a fresh save (a run is going), and old saves.

## v10.6: King Bibi beams it in (Will, Nov 17)
The soul story is now two beats, spaced apart, so it no longer lands on top of "build the cottage".
- Beat 1, right after your first kill and Erin's "why": a cut-in in the style of the HASBARA super in Knockout. Here it is KING BIBI at the desk inside the Iron Dome, and the target on his screen is the keeper. "The little keeper is asking why. Give him an answer. Make it feel like his own." A beam crosses the night into the keeper's head: AN IDEA! Then the keeper: "What if their light isn't lost? What if somebody could keep it?" Erin: "Where did that come from?" "My own head. Obviously." About 7 seconds; START skips it.
- Beat 2, at home after the cottage is built and its party is over (plus a short quiet gap): the keeper finds the lamp while unpacking and tells Marcus the idea. "Bro. You're J-lighting again. Making up a story and calling it yours. You're way too beholden to King Bibi." "It is MY idea." Erin says keep it. You get the SOUL LAMP.
- The keeper now speaks these lines under their own name (WILL by default).
- The v10.5 version (one long scene on your first return home) is gone.

Checked: field lab; both beats played in real time at 430x932, frames looked at.

## v10.5: expeditions and the Soul Lamp (Will's ideas, Nov 17)
Expeditions
- New EXPEDITION tile in the pause menu (the grid is now five shorter rows). Open after the cottage.
- Send a party of 3 sprouts of one kind. They are gone about 3 minutes of play and come home on their own with what their kind finds (PEB stone, LEAF wood, DEW berries, EMBER ore, ZIP fiber, LUCKY petals) and one gratitude heart for the light they carried.
- One party at a time; a Buddy Barn lets you send two.
- If you own more sprouts than your pouch holds, one of the party stays out there "to carry the light on". That is the gentle trim on a crowd.
- All numbers are first guesses, not tuned.

The Soul Lamp
- After your first defeat and Erin's talk, the next time you are home a word drifts through the keeper's head ("Hasbara"), then an idea that feels like the keeper's own. The game does not say it is King Bibi.
- The keeper finds a lamp holding the lights of the lost. Erin tells Marcus. Marcus: "Bro. You're J-lighting again. Making up a story and calling it yours. You're way too beholden to King Bibi."
- From then on a defeat adds "Its light drifts into your SOUL LAMP", and the pause menu shows SOULS next to LIGHT.
- "SOUL LAMP" is a placeholder name. What the lamp does later is Will's call; this only sets it up and keeps count.

Also: Erin's "castle time" line tells you to build the Buddy Barn first if you have none.

Checked: field lab; real-time at 430x932: the whole soul scene, the menu, sending a party, the second-party refusal, and the return with one sprout staying out.

## v10.4: quieter screen, clearer battle menu
- Battle menu: the left box now says what the highlighted choice does (FIGHT, SWARM, KEEPER, BUDDY, RUN), not "What will X do?".
- A plain pickup like "+2 WOOD" is a small float over your head now, not a message box across the screen.
- Louie barks "SNIFF! A BUDDY!" once per wild buddy, not every 22 seconds while one is near.

Checked: field lab passes, no page errors; battle menu seen at 430x932.

## v10.3: a freeze at the Meadow's Lantern post
- Old bug, found by the fresh-save run: if any message was on screen when a trainer (Kiss) walked up to you, his dialogue never opened and he spotted you again, forever. Nothing near you worked, the Lantern post included. It hit hardest when your buddy was hurt, because the "rest at a Lantern post" hint is exactly such a message. The challenge now clears the message and always opens.

Checked: reproduced the freeze on the old build, and the same steps pass on this one. Field lab not rerun for this one-line change.

## v10.2: fixes from the first fresh-save run
- Bug from v10.1: Erin's battle lesson only counted a battle you started with SELECT. A wild that broke free and attacked did not count, so she kept asking. Any wild battle counts now.
- The Meadow's west lane (the "weird path on the left"): it was two tiles wide going down, one wide going east, and stopped one tile short of the main road. It is two wide all the way and joins the road.
- Test scripts: the autopilot knows the battle lesson and walks home by the north road (it still used a pre-v9.8 route).

Checked: field lab passes, no page errors. A real-time fresh-save autopilot run plays the whole of Erin's walk, the new battle step included.

## v10.1: the slice refinements (Will's list, Nov 17)
Tutorial
- Erin's walk now has a real battle step. After your first catch she points at a second wild one and waits until you press SELECT on it. Before, she told you about SELECT and the game blocked it.
- After your first defeat Erin explains it: a buddy you can't show the light stays dark, so a battle is sometimes the only way. No blame, no penalty.
- Defeat wording changed to "The dark breaks. X is gone." (Will: a defeat kills the buddy.) The game quietly counts these for the soul story later.

Castle
- The castle is a three-step puzzle: sprouts build a bridge over a moat, LEAF clears the thorn gate, PEB cracks a boulder wall inside. A PEB grows in the courtyard so nobody is stuck.
- Louie's castle reveal names the three steps. If you have no Buddy Barn, Marcus says his line there too.
- **The Buddy Barn now costs 8 stone and 6 wood, not 2 ingots.** Ingots needed a kiln, ore and smelting time, which is too long a chain in front of the first alpha. Will: say if you want ingots back.

Battles
- The timed strike is easier to read: a white band shows the window, the closing ring turns green inside it, and a slide bar under it shows the same timing.
- A miss now says TOO EARLY or TOO LATE, with a low sound.

Field and base
- Louie and your buddies no longer walk on water. Blocked by a pond, they hop to your side.
- The bottom bar shows your buddies: face, health line, and a gold dot while one is off working.
- Pop-ups are calmer: the same pickup merges into one count, they fade out, and at most four show at once.
- At Sunkeep one line under the goal says what each worker is doing, one at a time.

Buddies
- Two grades on the Buddies screen: BATTLE (the level) and WORK (from jobs done), with what's left to the next of each.
- You can release a boxed buddy: START, then START again. The word "release" is a placeholder until Will picks one.

Checked: field lab passes with no page errors. Real-time at 430x932: tutorial fight step, castle puzzle start to end, battle ring, water, party and box screens, crew line.
Not checked: a full fresh-save playthrough by hand; old-save test could not run (its old builds are not in this checkout).

## v10.0: Buddy Barn before the first alpha
- Pressing A on the castle alpha with no Buddy Barn and no sigil now stops the fight. Marcus says: "Bro, are you kidding? We need to go see one, send one, and get you a box made. Because we have lots of purifying to do." He then names the cost: 8 stone, 2 ingots, at Sunkeep.
- The goal line says to build the Buddy Barn first until it's built. After that it's back to "Light the castle ALPHA".
- Checked in the lab at 430x932: the gate stops the fight without a barn and the battle starts with one, with no page errors. Not yet played by hand from a fresh save.

## Cartridge 5: Sproutwild fused in (Nov 15 2026)

ALT is now the main line of the game, with five cartridges: Sprouts, Knockout, Rootdeep, Patch & Plate, **Sproutwild**.

- **What was added.** `src/sproutwild/` (eleven files, about 330 KB) holds Sproutwild v6.0, moved in from `muse/sproutwild/`.
  `build.py` splices it into `console.js` after Rootdeep. Its own history is in `src/sproutwild/CHANGELOG.md`.
- **What changed in the console to make room** (`src/console.js`, `src/shell.html`):
  - a fifth shelf slot; shelf labels are a point smaller so five fit
  - boot, update and draw hand `g4...` states to Sproutwild, the same way `g3...` goes to Rootdeep
  - button labels for slot 5: act / call / kind / menu
  - the console's `tw`, `text` and `ctext` keep their bodies under the names `tw0`, `text0`, `ctext0`. Sproutwild's
    `sw-text.js` owns the public names and passes straight through to them unless a Sproutwild screen is showing, where it
    draws its own pixel font. The other four cartridges draw exactly as before.
  - the console's screen-width variable `SW` is renamed `SCW` (seven uses), because Sproutwild's save object is `SW`
  - `window.__g` gains `SW` and `SWF` for tests
- **Nothing was removed.** Knockout, Rootdeep, Patch & Plate and Sprouts source files are otherwise untouched.
- **Frozen before the fusion:** `backups/pocket-lantern-alt_2026-11-15_4-carts_pre-sproutwild_BACKUP.html` (the four-cartridge
  build exactly as it was) and `muse/games/Sprouts+Rootdeep+Sproutwild-v6.0_2026-11-15_BACKUP.html` (standalone Sproutwild).
- **Tests on the fused build:** Sproutwild `tests/sproutwild/field-lab.js` 76/76; Knockout `tests/fable_lab.js` all pass;
  Patch & Plate `tests/pp_test.js` 76/76 on the final build, three runs in a row (its shelf check now expects five
  cartridges). Two earlier runs during the work each failed one check with a random outcome (a text-squeeze audit on day 12,
  and Louie changing his craving "within a few days"). The one run on the build from before the fusion was clean, so whether
  those two are flaky from before is not established. Console and Rootdeep `tests/v02/` suites report no errors.
- **Size:** 14.4 MB. The claude.ai page limit is 16 MB, so there is room for about 1.5 MB more before songs have to move out.
- **Not done:** `docs/index.html` (the public GitHub Pages copy) still holds the four-cartridge build. It was not updated
  because that publishes Sproutwild publicly; that is Will's call.

![Five cartridges](playtest/five-cartridges-fused.png)

## Safety

- **Separate saves.** Every `localStorage` key is stored as `pl-alt:<key>` (`src/shell.html`, top script). ALT can't
  read or overwrite the real game's saves, even in the same browser or from a downloaded copy.
- **Page title** is "Pocket Lantern ALT", so the two are easy to tell apart in tabs.

## North Coast Knockout (`src/knockout.js`)

### Feel: less floaty

Measured with `tests/ko_lab.js` at 60 fps, before → after:

| | v0.3 | ALT |
| --- | --- | --- |
| Neutral jump | 34 frames, 55 px high | 26 frames, 49 px high |
| Strike pose reached | eased in over ~6 frames (never fully lands inside a 9-frame jab) | snaps in 1 frame after the windup |
| Hit flash on the victim | 6 frames white | 2 (light) / 4 (heavy) frames |
| Knockdown → standing | 0.83 s | 0.64 s |
| Round intro | 1.75 s | 1.5 s |

- Gravity 1250 → 2100, jump speed 380 → 470, a lighter fall multiplier (1.3 → 1.15), wider jump arcs (forward 1.35x → 1.6x walk speed).
- Launches keep their shape but play faster (launch speed scaled 1.22x to the new gravity; bounce and dizzy-fall speeds scaled too).
- **Poses snap like sprite frames** for attacks, hits, blocks, dashes, specials, throws, supers. Idle and walk cycles step at 8 frames
  per cycle instead of tweening every frame. Only jumps and crouches still blend (fast).
- A 4-frame landing squat after every jump.
- **Launcher chase (new):** down+A that connects can be cancelled into a jump by holding Up, so launcher → jump → air attack is a real
  juggle (the v0.3 launcher's recovery outlasted the victim's air time, so the follow-up never connected at any timing).
  The CPU uses it too (25% / 60% / 90% by difficulty). HOW TO PLAY says `DOWN + A  LAUNCHER (+UP: CHASE)`.

### Graphics: GBA direction

- **Pixel font.** A 5x7 bitmap font (outline + drop shadow, bold at size 2) replaces the phone's system monospace in every Knockout
  screen. Character widths match the old font, so no layout moved. (`PFC`/`PFB` glyph table; `text()`, `tw()`.)
- **Motion smears** on the active frames: a tapered white streak from the windup spot to the fist or foot (gold on heavy hits).
- **Hit bursts:** an 8-ray starburst with a shrinking white core (bigger on heavy hits) replaces the small plus-shaped spark.
- **Closer camera:** fighters fill more of the tall phone screen (zoom up to 1.75x, was 1.5x; tighter framing at mid range).
- **Stage grade:** stepped dark bands at the top of each stage and a darker floor band, so fighters read against the background.
  (A canvas colour filter was tried and removed: it made each frame many times slower.)

### New modes (title menu)

- **SURVIVAL:** one-round fights against random opponents, back to back. Your health carries over (+30 after each win). The CPU
  steps up a difficulty level every 4 wins. Best streak is saved (`SV.surv` in `ncko-v1`) and shown on the title and results screens.
- **TRAINING:** pick a fighter and a dummy. No clock; health refills when you leave the dummy alone; your meter refills; nobody
  goes below 1 HP. Combo damage shows under the hit counter. Pause has **DUMMY: STAND / BLOCK / CPU** (Block holds a standing guard,
  so lows and overheads still get through).
- The title menu now acts on labels, not positions. The pause menu is built from a list (`pauseItems()`).

### Test hooks

- `KO._.tb` records text boxes (the hook existed but nothing switched it on), `KO._.nextSurv`, and a `dummy` flag on fighters
  (a dummy takes no input).

## Sprouts (`src/console.js`)

- **The berry marker points at a berry you can reach.** "BRING HOME 3 BERRIES" used to aim at the nearest berry even when it was
  behind a gate that's still shut (12 of the 30 berries on a fresh day 1), which is where a test run stalled for the rest of the
  day. Now walkable tiles are flood-filled from the player about once a second and the marker prefers a berry within 2 tiles of
  them (sprouts are thrown). If none is reachable it falls back to the old choice. Checked: with only a far reachable berry left
  (609 px) and a gated one at 217 px, v0.3 points at the gated one, ALT at the reachable one.

## The Lantern menu (in `src/rootdeep.js`)

Open item 2 of the v0.3 handoff ("the Lantern menu still counts 3 cartridges"), plus links to the new Knockout modes:

- **CARTRIDGES PLAYED** counts four.
- **TRIPLE THREAT** is now "play three cartridges"; new **FULL SHELF**: play all four (+2 tickets).
- New **STILL STANDING**: win 5 in a row in Knockout Survival (+2). New **FARM TO TABLE**: bring home 50 berries in Sprouts and
  reach day 6 at Patch & Plate (+2). LANTERN KEEPER still needs every other achievement.
- **Tickets:** Knockout Survival pays 1 for every 5 of your best streak (counted when you're back at the shelf, like the 10-win tickets).
- **STATS** gets a fifth page, **PATCH & PLATE** (read-only from its saves, best of the three files): days open, stars /36,
  dishes served, coins earned, sprout crew /6, friend hearts /20. The Knockout page adds BEST SURVIVAL STREAK.
- **HOW TO GET TICKETS** (capsule machine) lists Patch & Plate's "first 3 stars on a day" and Survival streaks.

## Pass 2: HASBARA, King Bibi, likenesses (from Will's photos and notes)

All names, lines and move names below are **invented this pass** unless Will gave them; flag anything to change.

### Will's supers are two-tier
- **Half meter: BIKE LANE** (Select at 50+). A green bike lane paints itself along the floor and Will rides through it,
  pedals turning, Louie in a front basket. 14 damage, costs 50. (It used to be a riderless bike with Louie on the back.)
  The meter has a half-way tick for Will and shows `BIKE LANE (SELECT)` at half.
- **Full meter: HASBARA** (Will's idea; the cinematic is my staging of it). A ZZZ-style super, about 3.8 s, clock stopped:
  1. **Cut-in:** S-rank badge, Will's portrait on yellow and blue diagonal bands, halftone dots, light sweep, `HASBARA` slams in.
  2. **The desk:** Will in a headset at the keyboard; monitors read `IDF / HASBARA / DESK`, the opponent's face under a target
     ring, and a feed that fills (`THREAD`, `TALKING PTS`, `POSTING...`, `SHIFTING`) until `SENT!`.
  3. **The mind flip:** the opponent's face fills the screen, eyes turn to spirals: `WAIT...`, `WHO IS THE BAD GUY?`,
     `MIND: RECALIBRATED`.
  4. **Self-hits:** back on the stage, the opponent punches themselves four times (4.5 each) and once more for 12, launching
     themselves away: `SELF OWN!`. 30 total, can't be blocked. Will tweets through it on his phone.
- The move list shows `SEL 1/2  BIKE LANE` and `SEL FULL  HASBARA`; the select screen shows both.
- The CPU Will uses Bike Lane at half meter now and then, and HASBARA at full.

### King Bibi replaces Gas Guy (slot 5)
- Caricature: silver hair, navy suit, white shirt, blue tie. Tag `PRIME MINISTER. AGAIN.` Slower and hits a bit harder.
- **X: RED LINE** holds up the diagram, then a red line sweeps along the floor (a low: block crouching).
- **Y: IRON DOME** brief invulnerability, a dome that destroys incoming projectiles, and a shove.
- **Super: COALITION** five suited partners run across the stage (5 each).
- **Finisher: FILIBUSTER-ALITY** the speech runs so long the opponent falls asleep.
- Normals: TALKING POINTS, PODIUM KICK, POLL BUMP, SWEEPING REFORM, COALITION DEAL, COMEBACK TOUR.
- Win quotes: I ALWAYS COME BACK. / NEXT QUESTION. / THE COALITION HOLDS.
- **New stage, THE PODIUM:** a green-and-gold assembly hall, a rostrum with a lectern and mic, spotlights, delegate desks.
- Gas Guy's code (thumbs, wind) is gone from the roster.

### Likenesses (from the photos)
- **Will:** new 16x16 head: wild curls with lighter tips, round dark glasses with blue eyes, ginger-brown beard.
- **Louie:** red buffalo-check collar with a gold tag.
- **Lil Bottie:** chrome helmet with a dot texture, LED face with `^ ^` eyes and a smile, headphones, longer dreads,
  quilted silver puffer, silver chain with a cloud pendant.
- **Erin:** blue-grey eyes (hair and outfit unchanged).
- Waiting on more photos of Will, Erin, Bottie and Louie for the next pass.

## Pass 3: character rigs, Mama's supers, dialogue, arcade tower, level select, music slot

Invented this pass unless Will gave it: move names, lines, scenes. Flag anything to change.

### Character rigs (rig v2)
- **Heads redrawn in 3/4 view** (18x18, turned toward the opponent, shaded) for all eight fighters, and each head now sits on a
  **neck** at its jaw (an anchor point per head) instead of floating on the shoulder by its centre.
- **Bodies have builds** (`RG` in `knockout.js`): a tapered torso with real shoulders, shaded on the back side, and per-fighter
  proportions. Will is tall with a slouch; Marcus is broad and stocky; Erin is slighter with hair that sways in locks; Louie is low
  and long with a wagging tail; Lil Bottie is a blocky robot with joint plates at elbows and knees. Others share a default build.
- **Own stances and walks** (`PSO`): Will's loose guard, Marcus's wide chest-out swagger, Erin's boxer guard, Louie's crouch,
  Bottie's stiff right-angle arms. Their jabs and specials keep the same names and effects.
- **Own frame data and a forward+B for each of the five** (`MVO`): Erin is quickest, Marcus slow and heavy, Louie short and fast,
  Bottie slow with long reach.
  - Will: **FORCE PUSH** (`GIT PUSH --FORCE`), a lunging shoulder charge. 10.
  - Erin: **TRELLIS SPIN**, a high spinning kick. 9.
  - Louie: **ZOOMIE TACKLE**, a low diving tackle that knocks down. 9.
  - Lil Bottie: **ROCKET FIST** (`ROCKET_FIST.EXE`), the fist flies out on a chain. 12.
  - Marcus: **DAP UP**, a step-in handshake that can't be blocked. 12.
- Specials, supers and finishers are unchanged.

### Mama: two supers
- **Half meter: YUKON.** A big white Yukon reverses in, reverse beeper going, Mama at the wheel yelling (I DID NOT SEE YOU!!,
  WHO PARKS LIKE THAT?!, MOVE!!! MOVE!!!...) and MOTHERFUCKER!!! on impact. 15.
- **Full meter: RUBY TEMPER TANTRUM** (Will's idea), a cinematic like HASBARA: S-rank cut-in with Ruby; Ruby says NO. and grows
  into a giant, flickering Hulk-green (`RUBY SMASH!!`); on the stage she stomps twice (NO NAP!, MINE!), throws a red toy car,
  and lets out a WAAAAAAH! shockwave: 5 + 5 + 6 + 14 = 30, can't be blocked. Then she shrinks back: `hehe.`
  Ruby is drawn from Will's photos: curls, pigtails with green bows, pink hoodie, black leggings, white sneakers.

### Dialogue
- **VS screen banter:** each fighter gets a bubble before the fight. Set exchanges for Marcus/Will (he calls Will a J), Will/Bottie
  (the handoff), Marcus/Bottie, Marcus/Louie, Will/Louie, Will/King Bibi, Bottie/King Bibi, Marcus/King Bibi, Will/Mama. Otherwise
  each fighter's intro lines (Will, Marcus, Bottie, Mama have their own; others use their win quotes).
- **More win quotes** for Will, Marcus and Bottie; the results screen now cycles through all of them.
- **Barks:** Will, Marcus and Bottie call out on a 4-hit combo, and once when they drop low.
- Marcus's lines follow his canon voice from Sprouts and Rootdeep (bro, see one send one, dap me up, I've got a guy).

### Arcade tower and level select
- **Arcade tower** (Mortal Kombat style) before every arcade fight: a brick tower of the ladder with the boss on top, beaten
  opponents crossed out, torches, and your portrait climbing to the next fight. Then a short scene for the opponent
  (Louie's ball, Marcus's spinning wrench, Erin's flowers, Bottie's loading bar, King Bibi's podium with camera flashes, Corbin's
  hearts, Mama's Yukon driving past, Will's commit log) with a line. A skips.
- **Level select:** Quick Fight's stage screen is now a 3x3 grid of stage thumbnails over the live preview (left/right, up/down).

### Music slot for Bottie's songs
- Songs in `alt/music/` listed in `alt/music/tracks.json` are embedded by `build.py` (see `alt/music/README.md`).
- Tag a song `ko-bottie` and it plays in fights with Lil Bottie (and on his VS screen and tower). `ko-<fighter>` and
  `ko-stage-<n>` work the same way; `ko` replaces the default chiptune everywhere. Opponent first, then you, then the stage.
- The build warns past 16 MB (the claude.ai page limit). There's about 2 MB of room now: roughly one song.

## Pass 3 rollback (Will: the new heads were ugly and the fighting lost its snap)

Rolled back to pass 2: the 3/4 heads, the rig v2 bodies and builds, the per-fighter stances, the frame-data changes and the
forward+B moves. Knockout's fighting now matches pass 2 exactly: the same scripted inputs (walk, jab chain, forward+B, jump,
launcher combo; Will, Erin, Marcus, Bottie) give identical positions, states and damage on all 1,088 frames compared, and the
rig, move and physics code is the same as pass 2.

Kept from pass 3 (none of it touches how fights play): Mama's YUKON and RUBY TEMPER TANTRUM supers, the VS banter, win quotes and
barks, the arcade tower, the level select, and the music slot. The VS screen is longer to fit the banter (A skips after half a
second), and arcade fights now start with the tower (A skips).

What the measurements said about "slower": not the frame rate (2.1 vs 2.3 ms a frame, either way far under the 16 ms budget).
It was the moves: holding forward and pressing B fired the new forward+B moves (slower to come out than the heavy kick), Marcus and
Bottie's jabs got slower, and the bodies got bigger.

## Character models and head fix (Will: heads clip into bodies; the five need their own rigs)

Visual only: same skeleton, poses, timing and hitboxes. The pass-2 trace (scripted inputs for Will, Erin, Marcus, Bottie)
still matches on all 1,088 frames, and frame cost is unchanged (about 2.5 ms of a 16 ms frame).

- **Heads no longer clip.** Torsos were a thick line whose square ends poked about 6 px above the shoulders, while heads were
  pinned at a fixed height (Will's taller head sank the most). Now a torso is a shape that ends at the shoulders and every head
  sits on a short neck, placed by its real height. All eight fighters. Heads are the pass-2 ones.
- **Own models** (`MODEL` in `knockout.js`) on the shared skeleton:
  - **Will:** black tee with a little belly, collar and logo, short sleeves, red basketball shorts with a white stripe, socks, sneakers.
  - **Erin:** fitted green top with a waist and hem, jeans, long wavy hair down her back (three locks that sway, lighter ends) and a lock over her shoulder.
  - **Marcus:** bulky orange hoodie (hood bunched behind his neck, drawstrings, kangaroo pocket, ribbed hem and cuffs), dark joggers with cuffs, boots.
  - **Louie:** a dog body: furry barrel chest with a cream belly, fur tufts, thick legs, paws instead of shoes and hands, a big curled tail that wags, the plaid collar.
  - **Lil Bottie:** quilted silver puffer with a zip and the black hoodie under it, chain and cloud pendant, robot elbow and knee plates, dreads, headphones.
- King Bibi, Corbin and Mama keep their pass-2 bodies, with the head fix.

## Erin pass (and Bottie's full super)

Normals, timing and hitboxes for everyone are unchanged (the pass-2 trace still matches on all 1,088 frames). Names marked
(invented) are placeholders for Will to rename.

- **Erin's hair** no longer clips: one hair mass falls from the back of her head to her shoulder blades, behind her body, with
  a little sway and lighter ends (the separate locks and the lock over her shoulder are gone).
- **X: TOWEL WHIP** is a four-hit string now, moving in and out: step in with a horizontal lash, step back and raise the towel,
  crack it overhead (an overhead: block standing), step in with a low snap along the floor (a low: block crouching), then a final
  big crack that launches (`SNAP!`). 5 + 6 + 5 + 10, about 19 after combo scaling (was a single 8). The towel is drawn per pattern.
- **Y: HIDE AND SEEK** replaces Leash Lasso. Erin ducks into a bush and vanishes (can't be hit), `1... 2... 3...` counts over the
  opponent, then she pops out behind them (`FOUND YOU!`) with a tag that can't be blocked: 11 and a launch.
- **Erin's supers:** half meter **SPROUT STAMPEDE** (the old super); full meter **LOUIE AIRLINES** (invented name), a cinematic:
  S-rank cut-in; `PREPARE FOR TAKEOFF`, Louie folded into a paper airplane with his ears as the wings; Erin throws him
  (`WHEEEEE!`); he loops the opponent trailing hearts, three passes and a dive (`ZOOM!`, `ZOOM ZOOM!`, `BORK!!`): 5+5+5+15 = 30;
  then he sits by them: `GOOD BOY.`
- **Lil Bottie's supers:** half meter **AIR SUPPORT** (the old super); full meter **NUKE THE DATA CENTER**, staged from Will's
  three images: the bodega with his cup and the TV reading `I MIGHT JUST HIT MY RATE LIMIT`, then `RATE LIMIT REACHED`, his face
  goes red and angry (`...OKAY.`); the data center on fire at night, him waving on the roof in a spotlight, fire truck below
  (`DELETING...`, `rm -rf /data`); him walking away from the exploding tower without looking back; then the blast wave and debris
  hit the opponent on the stage: 5+5+20 = 30 (`DELETED.`).
- All full supers (HASBARA, RUBY TEMPER TANTRUM, LOUIE AIRLINES, NUKE THE DATA CENTER) now share one cut-in and hit system (`CN`).

## Rig v3: GBA-style sprite renderer (Will: the models look goofy and clippy next to real GBA fighters)

What was wrong, seen in close-ups of real fights next to Supersonic Warriors / Tekken Advance: limbs were one-width "pipes"
with stair-step edges and kinked elbows and knees; every stroke had its own black outline, so arms crossing bodies stacked
outlines into blocks (the clipping look); hands and feet were tiny squares and bricks; shading was flat bands.

Now (`rig` in `knockout.js`, "rig v3"):
- Every part is a shaped piece: tapered limbs with rounded joints (thick at the shoulder and thigh), a torso with chest and
  shoulders, round fists, shaped shoes, three tones lit from the front and above.
- Each figure is drawn at 1x into three layers (back arm and leg / body / front arm), snapped to whole pixels, and each layer
  gets one outline around its silhouette, the way a sprite artist draws it. Overlaps read as one limb in front of another.
- Outfits per fighter on the same figure (Will's tee and shorts, Erin's top, jeans and hair, Marcus's hoodie and boots, Louie's
  fur, belly, paws and tail, Bottie's puffer, robot joints and dreads, King Bibi's suit and tie, Corbin's cape, Mama's hair).
- The guard is up at the chin in idle and walk (visual only).
- Finished sprites are cached by pose: frame cost stays about 2.1 ms (of 16).
- Same skeleton, poses and timing: the pass-2 trace still matches on all 1,088 frames. Heads are unchanged.

## Fable pass 1: parry, wall bounce, Last Lantern, K.O. impact frame, stances, house rules, Trials (Nov 15)

Knockout only, plus three small Lantern-menu hooks. **All names here are invented this pass and nothing is phone-confirmed.**
Unlike the earlier passes, this one changes how fights play on purpose (Will: put your own touches on it). The basic numbers
did not move: `ko_lab.js` metrics are identical to before (jump 26 frames / 49 px, jab 4-frame startup / 22 stun / 8 px slide,
launcher, juggle at every delay, walk 87, every special and super damage figure). What is new sits on top of them.
Each new system has one switch or constant in `src/knockout.js`, named below, so any of them can be turned off alone.

### New in a fight
- **PARRY.** Tap back just before a hit lands (inside 0.13 s) and any blockable hit is turned away: no damage, no chip, no
  pushback, +12 meter, a blue burst and `PARRY!`. An attacker who is up close is left stunned for 0.44 s (a free punish);
  projectiles are just swatted. Holding back early is still an ordinary block; unblockables (throws, Hide and Seek, Judgement,
  the full-meter cinematics) can't be parried. The CPU parries now and then: never on Easy, 10% of its blocks on Normal,
  25% on Hard. HOW TO PLAY has a line for it. (In `tryHit`; delete the `FABLE: PARRY` block to remove.)
- **WALL BOUNCE.** A hard launch (throws, the big specials, supers) that carries someone into the edge of the stage bounces
  them back off it, once per combo, still juggle-able under the same 3-hit juggle limit. `WALL!`. (In `sim`.)
- **LAST LANTERN.** Under 25 health a fighter's lantern flares: embers rise off them, their hits do 15% more, and their meter
  creeps up (6 a second). Announced once a round. Off in Training and Sudden Death. (`LAST=0` switches it off.)
- **K.O. impact frame.** On the final hit the stage is replaced for half a second by speed lines in the winner's colour,
  bursting from the loser, with a longer freeze and `K.O.` slamming in. (`koLines`, `G.koF`.)
- **Combo callouts:** NICE! at 3 hits, SWEET! at 5, SAVAGE! at 7, UNREAL!! at 9, under the hit counter (`RK`).
- **Afterimages** trail behind dashes and every dashing special (Louie's zooms, Corbin's Sneaky Kiss, Double or Nothing).

### Each fighter stands their own way (visual only)
Idle and walk only; attacks, timing, reach and hitboxes are shared and unchanged (`STN` table; `STANCES=0` puts everyone
back in the shared stance). Will is loose with his hands low; Erin is an upright boxer, light on her feet; Louie is low and
coiled; Lil Bottie is stiff with level forearms and barely moves; King Bibi keeps one hand behind his back; Corbin leans in
with an arm reaching; Marcus is chest-out on a wide base with his fists low; Mama has a hand on her hip.
Note for Will: per-fighter stances were part of the pass he rolled back. That rollback was about the heads and the slower
moves; these touch neither. Sheet: `playtest/fable/stances.png`.

### RULES (title menu; applies to Quick Fight and Training only)
NORMAL, TURBO (1.3x speed), MOON GRAVITY, BIG HEADS, GLASS CANNON (double damage), METER MADNESS (meter fills by itself),
SUDDEN DEATH (everyone on 1 health), CHAOS (turbo + moon + big heads + meter). Saved as `SV.rule`. Arcade and Survival always
play NORMAL, so clears and streaks stay comparable.

### TRIALS (new mode on the title menu)
Sixteen one-round fights with a goal, each with a set fighter, opponent, difficulty and sometimes a rule. Winning with the
goal met earns a star; GOLD (a second star) is finishing on 70+ health, or the trial's own rule. The goal and a live tally
show under the health bars; pause has RESTART TRIAL. Stars save in `SV.tr`.

| # | Trial | You vs | Goal |
| --- | --- | --- | --- |
| 1 | FIRST COMMIT | Will vs Louie, Easy | win the round |
| 2 | COMBO CLASS | Erin vs Corbin, Easy | land a 4-hit combo |
| 3 | PARRY SCHOOL | Will vs Lil Bottie, Easy | parry 2 hits |
| 4 | ALL BITE | Louie vs Marcus, Easy | win using only B attacks |
| 5 | WALL STREET | Marcus vs King Bibi, Easy | bounce them off the wall |
| 6 | HUG IT OUT | Erin vs Mama, Normal | land 3 throws |
| 7 | SPEED RUN | Louie vs Corbin, Normal | win with 40 on the clock |
| 8 | UNTOUCHABLE | Lil Bottie vs Will, Normal | win on 80+ health |
| 9 | FULL SEND | Mama vs Marcus, Normal, meter madness | land a full-meter super |
| 10 | MOON LANDING | Will vs Lil Bottie, Normal, moon gravity | land 3 air attacks |
| 11 | HEAD GAMES | King Bibi vs Corbin, Normal, big heads + turbo | win |
| 12 | JUGGLER | Marcus vs Louie, Normal | land a 6-hit combo |
| 13 | GLASS JAW | Corbin vs King Bibi, Hard, glass cannon | win |
| 14 | SUDDEN DEATH | Mama vs Marcus, Hard, sudden death | first hit wins (gold: 52 on the clock) |
| 15 | PARRY MASTER | Erin vs Lil Bottie, Hard | parry 5 hits |
| 16 | FINAL EXAM | Will vs Louie, Hard, turbo | win |

Not checked: whether each trial is the right difficulty for a person. The tests prove each one can be started, cleared,
failed and saved; none has been played by hand.

### The Lantern menu (`src/rootdeep.js`)
- **Tickets:** Knockout Trials pay 1 capsule ticket for every 4 stars (up to 8), counted when you're back at the shelf.
- **STATS**, Knockout page: adds TRIAL STARS n / 32.
- **HOW TO GET TICKETS** lists it (the Knockout capsule page, and the all-games page as `SURVIVAL x5, TRIAL STARS x4`).
- No new Lantern achievement: a seventeenth row runs into the footer on the achievements page.

### Title screen
Nine items now (TRIALS and RULES are new), so the list is one pixel tighter per row and the win/loss line moved down
between the two fighters, with STREAK and STARS under it.

### Saves
`ncko-v1` gains `rule` (number) and `tr` (stars per trial). Old saves load unchanged; both default when missing.

## Fable graphics pass 1: new sprite renderer, stage colour treatment, new HUD, closer camera (Nov 15)

Will: a total graphics overhaul of the fighter, still GBA style, keeping the cutscenes. This is the first slice of that: the
parts that change every fight at once. **Visual only**: `ko_lab.js` metrics and every damage figure are unchanged, and the
cinematics, tower, VS screen and finishers are the same scenes. One switch, `GFX` at the top of `src/knockout.js`: `GFX=0`
draws everything the way it was. Nothing is phone-confirmed.

- **Sprites (all eight fighters, through the shared `rig`):** chunkier builds (thicker arms and legs, a broader torso, bigger
  fists, bigger shoes with a highlight), hard cel shading in place of the soft rim, cool-tinted shadows and warm highlights
  (`dk` / `lt` now shift hue, they don't just darken), and a rim light: the top edge of every sprite layer is lit and the
  underside is darkened when the sprite is baked (`spBake`). Heads are unchanged (still Will's approved ones, still facing
  the camera). Same skeleton, poses and hitboxes.
- **Stages (all nine, through `stageLayer`):** each stage is drawn into its own layer and given a GBA colour treatment: more
  contrast and saturation, a 15-bit palette with a 4x4 ordered dither, and depth shading (the wall or sky darkens and cools
  the higher it is above the fighters' heads, and the floor strip is dimmed) so the fighters stand out. The stage select
  thumbnails and preview use it too. The stage drawings themselves are not repainted yet.
- **HUD:** slanted health bars with a gradient, quarter marks and a red damage trail; framed portraits; a gold timer plate;
  diamond round marks; a segmented super meter; a framed special-cooldown light. Same positions, so no text moved.
- **Camera:** zooms in to 2.05x when the fighters are close (was 1.75x).
- **Shadows under fighters** are a rounded, darker shape.
- **Fix:** floating callouts (LAST LANTERN!, PARRY!, WALL!) no longer show through the K.O. impact frame.

Cost: about 3.1 to 3.5 ms a frame in headless Chromium on a desktop (was about 2.1), of a 16 ms budget. The stage treatment
is the extra; it has not been timed on a phone.

**Not done yet (the rest of the overhaul):** repainting the nine stage drawings (they are the same sparse compositions,
now graded), heads that face the opponent, the menus and select screen, hit sparks and projectiles.

## Fable pass 2: Erin's hair, THE FINAL BET, King Bibi's face, IRON DOME as a counter, WAR CRIMINAL (Nov 15)

From Will's notes after the graphics pass. The ideas are his; the staging and every line except TIME TO REMOVE THE J are
invented and flagged for him. Nothing is phone-confirmed.

- **Erin's hair no longer clips.** Her head sprite carried long hair that hung below her chin and was drawn on top of her
  shoulders, arms and back in every pose. The head's hair now stops at the jaw (13 rows, was 16), and the long hair is the
  mass behind her body, moved back so it falls down behind her shoulder blades where it can be seen and never crosses her
  arms or torso. Mama's hair moves with it (same code).
- **Marcus is two-stage now.** Half meter: **HYDRO JET** (the old super). Full meter: **THE FINAL BET**, a cinematic.
  S-rank cut-in; Marcus on his phone with a 12-leg UFC parlay, stake THE RENT, pays $4,800,000, the legs ticking over to HIT
  one at a time; leg 12 in the octagon, COME ON. COME ON., then a one-punch KNOCKOUT!!; PARLAY HITS! with the number
  rolling up and cash raining, CASHED OUT, BRO.; then the winnings land on the opponent: CHA- / CHING! / PAID., 5 + 5 + 20 = 30,
  can't be blocked. **Against Will he says TIME TO REMOVE THE J.** Against anyone else, one of: I DON'T GAMBLE, BRO. I INVEST. /
  TWELVE LEGS. I'VE GOT A GUY FOR EACH. / THE HOUSE ALWAYS WINS. I'M THE HOUSE. / BRO. YOUR WHOLE CAREER IS THE UNDER. (`BETQ`).
- **King Bibi looks more like him.** New 16x16 head: swept silver hair, a high forehead, heavy dark brows, a long nose with
  the lines beside it, jowls, a flat wide mouth. It is still drawn from memory, not from a photo; send one if it's off.
- **IRON DOME (Y) is a counter.** It used to make him briefly untouchable and shove. Now, while the dome is up (0.1 to 0.56 s
  of the cast), any blockable hit that touches him is INTERCEPTED!: no damage, +10 meter, and an attacker within reach is hit
  back for 8 and launched. It still eats projectiles. Whiff it and he is open for the rest of the move. Unblockables go through.
  It counts as a parry in Trials.
- **King Bibi is two-stage now.** Half meter: **COALITION** (the old super). Full meter: **WAR CRIMINAL**, a cinematic.
  S-rank cut-in; THE SECRET DATA CENTER, where his SUPER SOLDIER LIL BOTTIE stands in a tube, the racks go red and it comes
  ONLINE.; HE BECOMES FENTANYAHU, growing; THE WHOLE ENTIRE CITY: a skyline at dusk coming down building by building while
  Bottie flies over it firing and Fentanyahu walks through it (buildings only, no people); then the blast and a red beam
  reach the stage: NO COMMENT., 5 + 5 + 20 = 30, can't be blocked. I read "Fentanyahu" as the name of his powered-up form;
  say if it should be a separate character.
- **More cinematic:** while a full super plays over the stage, the health bars give way to letterbox bars. New cinematics get
  an optional `init(C)` (used to pick Marcus's line).
- Move lists, the select screen and the half-way tick on the meter pick up both new two-stage supers on their own. The CPU
  uses them the same way it uses the others.

Still single-stage: Louie (Judgement) and Corbin (007).

### Pass 2 follow-up: Fentanyahu is his own character, Ben Gvir celebrates (Nov 15)

- **FENTANYAHU** is now a separate character in WAR CRIMINAL, not Bibi's powered-up form (Will's correction). After the data
  center, Bibi points and he pops up from below: green, eyes shut, folded over at the waist with his arms hanging, swaying,
  snoring Zs (`FENTY`, `foldP`). In the city scene he is the giant shuffling through the skyline.
  What I could find about the name: almost nothing. One user-made character page spells it "Fentenyahu" and describes a
  parody name joining fentanyl and Netanyahu; there is no Know Your Meme entry or news coverage. So his look is built from
  the pun (the bent-over "fold"), not from a reference. If Will has an image in mind, send it.
- **BEN GVIR and DONALD TRUMP** celebrate in the city scene, in the foreground next to Bibi under confetti: Ben Gvir jumping
  with his arms up (`GVIR`: white kippah, glasses, short beard, white shirt), Trump beside him pumping a fist (`TRUMP`: blond
  swoop, navy suit, long red tie). No name tags (Will's note). Each has a speech bubble, one after the other.
  Ben Gvir says things he has really said, in English as reported (`GVIRQ`, one picked each time): "WE'RE THE LANDLORDS
  HERE. REMEMBER THAT." (Sheikh Jarrah, October 2022) or "WE ARE IN CHARGE HERE." (a Temple Mount visit). English wordings of
  the first vary a little between reports. Trump says "BEAUTIFUL. WE'LL BUILD A RESORT." (invented; Will likes it).
  Both are drawn from memory, not from photos.
- The city scene is 0.8 s longer so the lines can be read; the whole super is now 5.5 s (was 4.7). Damage is still 30.
- All three are scene extras drawn with the shared rig (`mkX`, `drawX`), not fighters.
- **Open:** Will says Fentanyahu is "still super off" and I don't know in what way. Needs his description or a picture.


## Fable pass 3: Marcus in Flow Pros, DEREK PULLS UP, the opening movie (Nov 15)

From Will's notes. Invented unless he gave it; nothing is phone-confirmed.

### Marcus
- **All Flow Pros, and thinner.** His hoodie and cap are Flow Pros blue with a white drop logo on the chest, over navy work
  pants; his build is slimmer (no extra bulk, a narrower torso). **The colours and logo are a placeholder**: I searched for
  Flow Pros in Cleveland and could not find the company's site, logo or truck (the Ohio results were other businesses in
  Canton). One table, `FP` in `src/knockout.js`, sets the colours for his clothes and the truck; a photo from Will fixes it.
- **Half meter is now DEREK PULLS UP** (replaces Hydro Jet in that slot). Marcus says DEREK. PULL UP., a horn sounds, and
  Derek drives the Flow Pros truck through whoever is in front of him: 15, launches, ON TIME. EVERY TIME. Beer cans, a
  lighter, a dab pen, a glass piece spill out of the back the whole way across. Derek is a driver in a cap and shades; I
  don't know what he looks like. Hydro Jet's code is still there (`SUP.marcus`) but nothing fires it; it is still his super
  in Rootdeep.
- **His kit as it stands:** A, A, A Bro Jab; B Pipe Wrench; down+A Plunger Pop; down+B Snake the Drain; X Dab Cloud (rips
  the pen, the cloud dazes); Y Double or Nothing; half meter Derek Pulls Up; full meter The Final Bet.
- **The J line.** It did fire in every test (as the player and as the CPU), so my best explanation for Will not seeing it is
  that the super went off at half meter, which was Hydro Jet, or that the CPU spent its meter early. Changed so it is hard
  to miss: the line is in the bubble on the parlay screen, again in big text when the parlay hits, and Marcus says it once
  more in a bubble on the stage while the cash lands. And the CPU now saves for the full-meter super far more often
  (it fired the half-meter one 20% of the times it could; now 7%), so every fighter's cinematic shows up more.

### The opening movie
Plays when the Knockout cartridge boots, to the menu song; A, B or Start skips it. About 24 seconds:
1. **NORTH COAST STUDIOS PRESENTS**, with a lantern.
2. **Roll call:** each of the eight fighters gets a card in their colour: their face slides in, they throw a punch, and their
   name, tag line and two specials are shown.
3. **Four clips of real fights**, played by the engine itself (two CPUs on Hard) with moves fired on cue: Will's Mazel Tov
   Laser and Louie's Zoom Zoom Zoom; Erin's Towel Whip and Bottie's Clanker Guns; Bibi's Red Line and Marcus's Derek Pulls Up;
   Corbin's kiss and Mama's Yukon. Letterboxed, no health bars. Because they are real fights, they play out a little
   differently each time.
4. **The finale:** the eight faces rush together, a flash, and NORTH COAST KNOCKOUT slams in over the whole cast lined up
   and cheering. Then the title menu.
Nothing in it is saved or counted. (`opUpd`, `opDraw`, `OPC` is the clip list.)

### Pass 3 follow-up: cyborg Fentanyahu, the longer opening movie (Nov 15)

- **FENTANYAHU is a cyborg Bibi now** (Will: he's based on his own meme, in the same family as the android memes). Half his
  face is a metal plate with a red eye and a grille, there is a green reactor in his chest, his hands and shins are metal, and
  he stands bolt upright and marches. In WAR CRIMINAL he pops up, sweeps a red scan beam (FENT REACTOR: ONLINE), and in the
  city he is the giant firing his eye at the skyline. The green, folded-over version is gone.
  I still could not find a picture of the meme itself (searched four times; only a chatbot page with no image), so this is
  the android family's look applied to Bibi. A screenshot from Will would let me match the real one.
- **The opening movie is the whole roster now, about 41 seconds** (was 24):
  - Roll-call cards are a little longer, each fighter throws a punch and a kick, and the list of specials is replaced by a
    short **bio** (`OPBIO`, invented for Will to rewrite): Will BUILT THIS GAME. STILL LOSES AT IT. / Erin GROWS THE FOOD.
    RUNS THE STAND. ENDS THE FIGHT. / Louie EVOLVED SHIBA, EST 2018. GOOD BOY. BAD NEWS. / Lil Bottie RAPPER. ROBOT. ONE BAD
    DAY FROM A DATA CENTER. / Marcus OWNS FLOW PROS. HAS A GUY. THE GUY IS HIM. / King Bibi PRIME MINISTER. AGAIN. AND AGAIN. /
    Corbin ONE QUESTION. EVERY SINGLE TIME. / Mama UP SINCE 4. DRIVES A YUKON. FEAR HER.
  - After the four fight clips, **a cut from every fighter's ultimate**, with its name on a bar: HASBARA, LOUIE AIRLINES,
    JUDGEMENT, NUKE THE DATA CENTER, THE FINAL BET, WAR CRIMINAL (the city, with the lines), 007, RUBY TEMPER TANTRUM.
    They are the real supers started part-way in, not recordings.

## Not changed

- Patch & Plate (`src/patchplate.js` is v0.3's file as built). Its 76 checks pass on the ALT build.
- Rootdeep gameplay. Its loop, keeper moves, saves and Lantern tests pass on the ALT build.
- Names, faces, lines, music.
