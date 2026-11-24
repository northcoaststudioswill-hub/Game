# GOT NEXT

*Half court. Winners stay.*

A park-basketball career game in one HTML file. Phone first, plays on a computer, two players with a controller.
You build a player, walk The Block, take games in The Cages, and spend what you earn on your player, your drip and your
crib. A North Coast Studios game. **Version 0.10: players move like themselves. Every jump shot is a blend of three foundations (traditional, high release, quick release) and every idle a blend of three stances, set by a persistent per-player movement profile (posture, timing, dominant hand); smoother transitions, landings that absorb, and an ANIM LAB in the Dev Room to compare players side by side and tune profiles. Controller: X steals and Y blocks on defense, LB/RB switch menu tabs, the stick moves through menus by direction. Hop jumpers and floaters (auto-timed) rarely green now. Also: up to 5 builds per account, and upgrades get steep near the top (maxing a build is weeks, not a night).** v0.9.4: fouls (spamming steal draws reach-ins and hand checks; jumping into a shooter or sliding into a finisher is a foul, with and-ones on makes; the fouled team keeps the ball; not in JAM), out of bounds (step over a line with the ball and it's a turnover, but you have to mean it: drifting near a line is slowed), and an arrow on your ring pointing at the man you're guarding.** v0.9.3: no more double dribble. Stopping keeps your dribble. A pump fake after dribbling picks the ball up (on a drive it is a hesi instead), and a defender up in your chest can force you to pick it up.** v0.9: walk inside your house. A room you decorate (Habbo-style) with its own walls and floor, built with the same builder, counted in your crib's Vibe, and visitable by friends online.** v0.8.8: defense controls (defense assist, timed contests with closeouts, steals that go for the ball, jumping the passing lane) and real ankle-break and fall reactions.** v0.8.7: crossovers reworked. v0.8.6: team-coloured name tags in games (you gold, your squad blue, them red), and defenders guard their man: face him when tight, open up between man and ball when sagging, square up on the ball.** v0.8.4: a real run (running-lab joint angles: knee drive, heel recovery, a flight phase), on The Block and on game courts.** v0.8.3: volume sliders. v0.8.2: the soundtrack (11 tracks, streamed from `gotnext/music/`, in-world reverb), and running off the court uses the court's run with a smooth walk-to-run ramp on sticks.** v0.8.1: a real walk (from gait-lab joint angles, planted feet that stay put), plus a little Habbo in the crib: things stack on tables, a rare of the day, emotes, chat bubbles, and visiting friends' cribs online with likes.** v0.8: the places come alive (light, steam, pigeons, weather, people talking) and My Crib becomes a home you build: a house, a street, three yards, 50 pieces to place, crib levels and sets.** v0.7.1: contested finishes: real contact in the air, and the better the finisher, the smarter the finish (measured: 38% → 74% made against the same rim protector); three more dunks and the Posterizer.** v0.7: more finishes (four new dunks, five layups, hop steps), fadeaways and side-steps, three new dribble moves, and a Dev Room with a maxed-out player.** v0.6 added the grind: nine drills that pay, H-O-R-S-E, a 1v1 ladder, daily contracts and events. Details and measurements: [`docs/ANIMATION.md`](docs/ANIMATION.md).

**Where it stands, bugs, and everything asked so far:** [`docs/STATUS.md`](docs/STATUS.md). It is a standalone game, not a Pocket Lantern cartridge.

**Play:** open [`index.html`](index.html) in a browser. That one file is the whole game; send it to a friend and they
have it too.

![Title](docs/img/title.jpg)

The brand, its rules and the names reserved for later are in [`docs/BRAND.md`](docs/BRAND.md).

| The Block (hub) | The Cages | A crew online | On a phone |
|---|---|---|---|
| ![hub](docs/img/hub.jpg) | ![pit](docs/img/pit.jpg) | ![crew](docs/img/crew.jpg) | ![phone](docs/img/phone.jpg) |

## What is in it

- **The builder.** Six playstyles, six origins, height / weight / wingspan sliders that move the caps of 19 attributes
  live. See [`docs/DESIGN.md`](docs/DESIGN.md) for how the numbers work.
- **Online, crews of up to six (v0.4).** Open the shared link at the same time and you see each other walking The
  Block and The Cages, each with the player they built. Call people into your crew: they pull up next to you and
  follow you around, and at any cage gate you put each of them on your team or the other and run it, 2v2 or 3v3.
  Details and limits are under *Online* below.
- **Your friends' players, solo.** Everyone you meet online is kept as a homie, and homies fill your squad by default,
  so a 3v3 with your friends' builds works with nobody else online.
- **The Block.** One tight street corner; The Cages is a floodlit chain-link cage across the north side. Third-person hub: The Cages, The Plug (drip), The Lab (attributes and badges), the Tape Deck (moves), your crib, the Money Rack
  shootout, the old head, and six build fiends who need VC for their Basketball 2146 builds on PS88.
- **The Cages.** Four doors: Street 2v2, Street 3v3, JAM 2v2, JAM 3v3. A side kiosk (Last Call) for one-game boosts and
  The Link for build codes. Four court tiers, opened by Respect.
- **The basketball.** Half court, camera on your player. Street: 1s and 2s to 11, take it back past the arc, 14-second
  clock. JAM: 2s and 3s to 21, shoving is legal, dunks from the logo, three makes in a row sets you on fire.
- **Two-stick control,** on a phone too: left stick moves, right stick is the skill stick (shoot, drive, side move,
  stepback, spin; hands up and steal on defense).
- **16 badges** in four tiers, earned with badge XP from real games. **Bravado** meter: big plays fill it, a full bar is
  +8 to everything for 20 seconds.
- **Unlocks:** 74 pieces of drip in ten slots (some carry small buffs), 22 animations (dribble moves, jumpshots, dunk
  packages, celebrations), 8 crib upgrade lines with passive buffs, 29 trophies, 8 Respect ranks.
- **Friends.** Export your build as a code; a friend imports it and your player is in their park as a teammate or the
  rival. On a computer a second player joins with a controller or on a split keyboard, co-op or versus.

## Living places (v0.8)

![The Block and The Cages, before and after](docs/img/areas-block.png)

Every place got an atmosphere pass. It uses no new libraries, and all of it is light enough for a phone:
- **Light:**
  - Neon signs glow and spill onto the wet street.
  - Lamps throw beams with dust hanging in them.
  - String-light bulbs glow, and floodlights have halos.
  - A soft vignette frames the screen.
- **Things moving:**
  - Steam from the manholes, and smoke and sparks off the barrel fire.
  - Pigeons that burst up and away when you walk into them, then come back.
  - Paper blowing in gusts.
  - Searchlights sweeping behind the skyline, and a blimp selling something.
- **Weather by the day:** clear, drizzle (rain streaks and splashes) or smog. It is the same for everyone, and the Dev
  Room can force it.
- **People talk:** walk near someone and they say something that suits who they are. Fiends ask about the PS88, the old
  head talks about 2129, the dice crew argues, homies at your crib compliment the couch.
- **New on The Block:**
  - Soy Dog Sal's cart (15 VC, +4 Stamina next game)
  - a dice crew by the hydrant
  - more lamps
- **Game courts** get light poles with beams, light on the ground, the weather and the sky.

## Soundtrack (v0.8.2)

Eleven tracks in `gotnext/music/` (see `music/README.md`). They belong to this game only. They stream next to
`index.html`, shuffled, and keep playing across places.

**The reverb:** a soft room around the music, sized by where you are:
- the widest on The Block
- the chain-link of The Cages
- a little in your yard
- a light touch in games, with the music lower

The reverb tail is darker than the sound itself (distance), and a gentle top-end roll-off smooths the compressed files.
The music sits under the game's sounds.

**Controls:** **N** skips a track, as does OPTIONS → SKIP TRACK. Options and the in-game pause menu have separate
**music** and **effects** volume sliders (0–100, default 80); the on/off switches are in Options.

**Opened straight from disk (file://):** the browser won't route the tracks through the reverb, so they play dry. The
published game has the reverb. If no track loads, the old synth loop plays instead.

## Running off the court (v0.8.2)

- **Keys:** walking is the gait-lab walk (Shift runs).
- **The run itself:** the same pose and planted-feet layer as running in a game.
- **Sticks and phone thumbs** set speed by how far you push: a walk up to about 80%, then a smooth ramp into the run at
  full push.
- **The fix:** before, a phone thumb held at full push flickered sprint on and off at 93%. The speed swung between 1.3
  and 2.5 m/s, right across the walk/run blend, and the body jerked. Now it holds a steady run.
- **On the court**, the phone's sprint turns on at 93% and only off below 85%.

## Inside the house (v0.9)

![Inside the house](docs/img/room.png)

- **Getting in:** the front door of your house (GO INSIDE) leads to a room, about 15 by 12 metres, with three windows
  onto the city at night, a pendant light, and your wardrobe (the closet now lives here). BACK OUTSIDE leaves.
- **Building:** build mode (**B**, or the BUILD MODE spot by the wardrobe) works inside the same way as in the yard,
  with the same catalogue.
- **What can't go inside:** big outdoor pieces (project car, kiddie pool, gate arch, fence panel, satellite dish, turf,
  hedge).
- **Size:** the room holds 60 pieces, on top of the yard's 90.
- **New pieces:** King Bed, Record Shelf (things stack on it), Arc Floor Lamp, Framed Poster.
- **Room look** (in build mode):
  - walls: 8 styles, 350 VC each (plaster, brick, midnight, hot pink, pinstripe, neon grid, gold, mint)
  - floor: 6 styles, 450 VC each (boards, checker tile, shag carpet, concrete, hardwood court, marble)
- **Vibe and sets:** everything in the room counts toward crib level and sets.
- **Homies** come inside and sit on your furniture.
- **The camera:** the same third-person camera as outside. The wall between you and the camera fades out. From above
  in build mode, the near wall fades.
- **Online:** your room travels with your crib. A friend visiting can walk in the front door and sees your room exactly
  as you built it.
- **Music:** a smaller, darker reverb indoors.

## A little Habbo in the crib (v0.8.1)

- **Stacking:** small things go on table tops. Trophy, game console, house plant, snack bowl, pocket radio and candles
  stand on the coffee table, spool table, yard bar, picnic table, crate or cooler. Small things snap to a quarter-metre
  grid. Picking up a table puts what was on it into storage.
- **★ Rares:** six collectibles, one on sale each day and only that day:
  - Ice Cream Machine
  - Neon Dragon Lamp
  - Golden Hoop Lamp
  - Holo Throne
  - Soda Fountain
  - Aquarium
- **Emotes:** keys 1–5, or the buttons on the right: wave, dance, sit, hype, your celebration. Moving cancels them.
- **Chat:** T (or 💬) opens a chat line. Your words appear in a bubble over your head. Online friends in the same place
  see your bubbles and emotes.
- **Visiting friends' cribs:**
  - My Player → CREW → VISIT CRIB on anyone online. Your crib travels with your presence (about 550 bytes) and is
    checked on arrival: known pieces only, inside the lot.
  - You see their house, their pieces, their looks, and anyone else there.
  - You can sit, chat, emote and spin their DJ booth. You can't build there or take their daily freebies.
  - L leaves a like (one a day per crib). Likes show on their gate.
  - Spending a minute at a crib with someone online gives each of you +15 Respect, once a day.

## My Crib and the home builder (v0.8)

![My Crib, before and after](docs/img/areas-crib.png)

**The lot:**
- The crib is a real lot now:
  - a two-storey house with a stoop, a porch light and lit windows (the closet is at the front door)
  - the court
  - three yards
  - a fence with your name over the gate
  - a street out front with parked cars and lamps
  - neighbours' rowhouses all around
- **The Side Yard** is yours from the start. **The East Yard** (2,500 VC) and **The Front Yard** (7,500 VC) are for sale
  until you buy them.
- **Lot & look:**
  - house paint (6)
  - trim (5)
  - fence (chain link, wood slat, neon rail)
  - yard ground (dirt, concrete, grass, pavers, court turf)

**Build mode:** the BLUEPRINTS table by the house, the Crib Upgrades bench, or **B** at the crib.

![Building](docs/img/home-builder.png)

- **The pieces:** 50, in 8 categories: seating, food & drink, tech & games, hoops & gym, display, lights, yard, walls &
  art. Each one is built from shapes in code, like everything else, and costs VC. Some unlock with rank.
- **Placing:**
  - Snap to a half-metre grid and turn in quarter steps.
  - A green ghost means it fits; red says why not (outside your yards, something in the way, overlaps something).
  - Rugs and turf are a floor layer, and things stand on them.
- **Changing your mind:** point at anything you placed to pick it up and move it, store it (free, place it again later
  at no cost) or sell it for half.
- **Controls:**
  - Keyboard: WASD or the mouse moves the cursor, a click or E places, R turns, X sells, F stores, C turns the view,
    Tab changes category, Esc or B leaves.
  - Phone: tap the ground, then the buttons.
  - Controller: stick, A to place, X to turn.
- **Vibe:** every piece adds Vibe in five kinds: comfort, drip, hoops, tech, party. A third copy of the same piece
  counts half, a fifth a fifth.
- **Crib levels:** total Vibe sets the crib level (1–10). Each level adds a perk that follows you into games:
  - +VC and +Respect from games
  - Stamina
  - starting Bravado
  - +1 to every attribute
  - Tour Stop: tourists pay 60 VC a day
  - Kingdom: your crib goes on The Block's billboard
- **Sets:** 8 themed sets, each with its own bonus when every piece is placed:
  - Cookout
  - Arcade Night
  - Sneaker Museum (the wall shows the kicks you own)
  - Iron Paradise
  - Barbershop Saturday
  - Garden of Eden
  - Block Party
  - Hoop Heaven
- **Pieces that do something:**
  - Sit on any seat.
  - The yard fridge gives a free soy dog boost once a day.
  - The weight rack and bench press give badge XP once a day.
  - The big screen shows your career highlights.
  - The DJ booth starts a party: everyone on the lot dances.
  - The mirror opens the closet, and the trophy case opens your trophies.
  - The Gold Statue of You is your own player, in gold, mid-dunk.
- **Company:**
  - From crib level 3 your homies come over and sit on your furniture.
  - From level 4, neighbours drop in.
  - From level 6, they dance if there is music.

`node tests/home.mjs` builds, moves, stores and sells pieces, buys land, checks every piece of a furnished sample crib
is in a legal spot, and checks the visitors, sitting and the fridge.

## The grind (v0.6)

Ways to earn VC and Respect away from the gates.

- **Drills.** Coach Overtime's board on The Block, or DRILLS at your crib:

  | Drill | Badge XP |
  |---|---|
  | Layup Lines, Mikan Drill | Finishing |
  | Free Throws, Spot Shooting, Around the World, 3-Point Contest (money balls), Catch & Shoot (quick-release bonus) | Shooting |
  | Cone Weave (style points for moves at the cones) | Playmaking |
  | Defensive Slides (sprinting does not count) | Defense |

  Each drill keeps a personal best and has bronze, silver and gold scores. The first time to each medal pays a bonus
  (100 / 250 / 600 VC). The same drill pays less after three runs in a day.
- **H-O-R-S-E with Sharpie.** 50 VC to play, 250 if you spell him out. He shoots too, and you match his makes from his
  spot.
- **The Money Rack.** Unchanged: 40 seconds of deep balls, 5 VC a point.
- **The ladder.** Six people in The Cages play you one on one to 7, in order:
  1. Lil Kickstand
  2. Two-Ply
  3. Deacon Gains
  4. Mini Mortgage
  5. Static
  6. The Commissioner

  A first win pays 160–960 VC and Respect, and they become a homie who can run on your squad. Rematches pay 30%.
- **Daily contracts.** The old head has three a day, drawn from a pool of 14 (win games, assists, greens, finish
  drills, beat Sharpie, climb the ladder, help a fiend and so on). Progress counts from the start of the day.
- **The daily event.** One a day, the same for everyone:
  - Grind Day: drills +50%
  - Green Day: greens double in drills
  - Ladder Night: ladder pays double
  - Horse Derby: H-O-R-S-E pays double
  - Bucket Bonanza: games +25%
  - Fiend Appreciation Day: helping a fiend earns 10 Respect

  It shows in the corner of the screen and on the boards.
- **Trophies:** Clocked In, Gym Rat (25 drills), Gold Standard (gold in all nine), Spelling Bee, On the Ladder,
  Top Rung.

| Coach's board | 3-Point Contest | The ladder in The Cages |
|---|---|---|
| ![board](docs/img/grind-board.jpg) | ![three](docs/img/grind-three.jpg) | ![ladder](docs/img/grind-ladder.jpg) |

## Model lab

[`lab.html`](lab.html) is the game's own player model on a model sheet, for designing bodies and drip. It has:
- views: a turnaround (front, ¾, side, back), a six-pose sheet, lineups (playstyles at their usual heights,
  5'9" to 7'3", weight and wingspan) and an orbit view
- every pose in the game, playing or paused
- every drip slot, a skeleton overlay and height lines in feet
- **proportion sliders** for leg length, thigh/shin split, torso, arms, shoulders, hips, head, neck, limb thickness,
  hands and feet

**Copy proportions** gives numbers that go into `PROP` in `src/gfx.js`. **Copy build code** brings a look into the
game through The Link. Built by `python3 build.py` alongside the game; source in `src/lab.html` and `src/lab.js`.

![Model lab](docs/img/lab.jpg)

## Controls

| | Phone | Keyboard | Controller |
|---|---|---|---|
| Move (full push = sprint on a phone) | left thumb | WASD, Shift to sprint | left stick, RT |
| Skill stick | right thumb | I J K L | right stick |
| Pass / steal / call for ball / interact | PASS button | E | A |
| Shoot / jump (hold, release in the green) | SHOOT button | Space | X |
| Pause / My Player | ☰ | P | Start |

Skill stick with the ball: **↓ hold** shoot, **↑** drive (layup or dunk), **← →** side move, **↙ ↘** stepback,
**↖ ↗** spin. Without it: **↑** hands up, **↓** steal (JAM: shove).

**Dribble rules** (your player; the AI and online guests follow the host's game):
- **Ball in hand, not dribbled yet** (after a catch, a check, a rebound): you hold it in triple threat. Moving or any
  dribble move starts the dribble. A pump fake here keeps the dribble available.
- **Dribbling:** stop as long as you like and you keep dribbling.
- **Pump fake after dribbling** (let go of shoot early):
  - standing: a real pump fake, and the ball is picked up
  - driving (above a jog): a hesitation dribble instead (HESI), and you keep dribbling
- **Forced pickups:** a defender up in your chest can force you to pick it up. That means within about 1.2 m, in front
  of you, while you are standing or barely moving. Every 0.6 s of that pressure is a check of his Perimeter D against
  your Handles, with badges: Stand Your Ground helps him, Non-Disclosure helps you. Hands up helps a little. You see
  FORCED PICKUP; he gets LOCKED UP and a little Bravado. Your defense can force the AI to pick up too: a picked-up AI
  passes, shoots or powers up.
- **A picked-up ball** can be passed, shot or pump-faked. The stick pivots you (the feet stay put).
- **Refused once picked up:** dribble moves and drives (DRIBBLE'S DEAD). Exception: a power layup within about 2.5 m
  of the rim.

The **move stick** (left) picks the finish or the jumper as you go up:

| Move stick as you go up | Near the rim (↑ or shoot) | Jumper (shoot) |
|---|---|---|
| Toward the rim | lay-in, finger roll at full speed, scoop or power layup when someone is on you, or your dunk | pull-up |
| Sideways | euro step | side-step (from a stand) |
| Away from the rim | reverse layup / reverse dunk | fadeaway |
| Let go, at speed | hop step, then up strong | — |

**↑** from mid-range (outside floater range) is a hop-step jumper with automatic timing.

## Dev Room (v0.7)

From the title screen, the OPTIONS tab of My Player, or **F2** on The Block.

- **Profile:** MAX ME OUT (every attribute 99, every badge iced out, everything owned, top rank, 250,000 VC), RESTORE MY
  PLAYER (the real one is kept inside the save the moment the Dev Room first changes anything), build codes in and out.
- **Build:** any style, height, weight and wingspan, every attribute 25–99 (caps ignored, the style's cap is shown), every
  badge tier, and one-tap archetypes (each style capped out).
- **Moves:** equip anything, owned or not, and preview the pose.
- **Play:** shoot-around, 1v1 to 11, Street 3v3, JAM 2v2 and 3v3, against maxed-out players of any style or a chosen OVR.
  Nothing played here pays VC or Respect.
- **Reel:** plays every dunk, layup, jumper variation and dribble move with your build, on a court, through the same code
  as a game.

![New dunks](docs/img/finishes-dunks.png)
![New layups and the hop step](docs/img/finishes-layups.png)
![Fadeaway, side-step and the new moves](docs/img/finishes-jumpers.png)

## Build

Source is in `src/`. After editing, run:

```
python3 build.py        # writes index.html
```

| File | What it holds |
|---|---|
| `src/data.js` | Every table: attributes, playstyles, origins, badges, moves, drip, crib, boosts, modes, trophies, all the writing |
| `src/core.js` | Save, build codes, input (touch sticks, keyboard, gamepads), synthesised sound and music |
| `src/gfx.js` | Renderer, cel shading and ink lines, the player rig and its drip, poses, courts, signs |
| `src/ball.js` | The basketball: rules, shooting, finishing, dribble moves, steals, blocks, rebounds, AI, camera |
| `src/hub.js` | The Block, The Cages, My Crib, walking and talking |
| `src/ui.js` | HUD and every menu |
| `src/gfx.js` (end) | Locomotion layer: planted feet, stepping, two-bone leg IK |
| `src/net.js` | Online: who is here, invites, the shared game, your player saved to your account |
| `src/main.js` | Boot, the loop, rewards, ranks, trophies |
| `src/shell.html` | Page and CSS |
| `vendor/three.min.js` | three.js r160 (MIT), inlined by the build so the game stays one file |
| `vendor/archivo.woff2`, `vendor/jbmono.woff2` | The two brand typefaces, Archivo and JetBrains Mono (both SIL Open Font License), embedded by the build |

## Tests

Scripted Chromium runs (Node and Playwright; set `PLAYWRIGHT` to the module path if it is not found):

```
node tests/smoke.mjs              # title → builder → hub → a game → results → shops, crib, menus (PORTRAIT=1 for a phone, MODE=j2 for JAM)
node tests/input.mjs              # real touch events on both sticks; a fake second controller
tests/sim.sh                      # an all-AI game in each mode, printed as box scores
node tests/online.mjs             # two pages in one simulated live room: meet, invite, play a shared game, both get paid
node tests/crew.mjs               # three pages: form a crew, follow the leader, run a 3v3 with a member on each side
node tests/poses.mjs              # renders every pose to tests/shots/pose-NN.png
node tests/grind.mjs              # every drill, H-O-R-S-E, a ladder match and a contract, played by a bot; each must pay
node tests/accept.mjs             # the eight animation/control acceptance scenarios, with numbers
node tests/feel.mjs [file.html]   # movement metrics for any build (reversal time, foot slip, ball in hand, FPS drift)
node tests/strip.mjs run|drib|shot|def [file.html]   # side-on filmstrips of real gameplay
node tests/reel.mjs dunks|layups|jumpers|handles      # films every move in a Dev Room reel and lists what each one did
node tests/gestures.mjs           # each finish and jumper variation from real key presses; Dev Room max and restore
node tests/devroom.mjs            # clicks through every Dev Room tab, a reel and a 1v1 against a maxed player
node tests/contest.mjs [N]        # N drives per finisher quality at a rim protector: made %, blocked %, finishes picked
node tests/home.mjs               # the home builder end to end (place, move, stack, store, sell, rares, land, sets, visitors)
node tests/visit.mjs              # two players online: visit a crib and walk into the house, chat, emote, like, hang out
node tests/dribble.mjs            # no double dribble: hold, dribble, stopping keeps it, standing pump picks up, pump on a drive is a hesi, defender-forced pickups, AI with a dead ball
node tests/quit.mjs               # leave a shoot-around from the pause menu on desktop and on a phone
node tests/room.mjs               # inside the house: walk in, build, refusals, walls fading, room look, Vibe, walk out
node tests/walkfeel.mjs [file]    # the walk measured: cadence, step length, foot slide, bob, lean
node tests/runfeel.mjs [file]     # sprint smoothness on The Block vs a court
node tests/defend.mjs             # defender facing, defense assist, timed contests, closeouts, steal odds, lane jumps, name tags
node tests/react.mjs              # films the ankle-break, fall and poster reactions
node tests/movelook.mjs <move>    # any dribble move filmed in gameplay with a maxed player
node tests/runcheck.mjs           # the run measured: cadence, flight share, knee bend, bounce, foot slide
node tests/stickrun.mjs [file]    # a phone thumb wobbling at full push: speed swing and leg jitter
node tests/music.mjs              # the soundtrack over HTTP: plays, reverb per place, N skips
node tests/areas.mjs [tag]        # screenshots of every place from the player's camera and wide
```

## Online

It runs on the claude.ai artifact's live room, so it only works from the published link, not from the file on disk.

- **Who can connect:** people signed in to Claude that the link has been shared with. A public link does not connect.
- **Being there:** everyone with the game open shows up on The Block and in The Cages with a name tag. The top-left chip
  says how many are online with you.
- **Crews:** My Player → CREW, or any cage gate: press + CREW next to someone. They choose Pull up or Nah. A crew is
  up to six; members follow the leader between The Block and The Cages.
- **Playing together:** at a gate the leader sets each crew member to MY TEAM or THEIR TEAM and presses RUN IT WITH THE
  CREW; AI fills the empty spots. Without a crew, SAME TEAM or VERSUS next to a name calls a one-off game. Each of you
  earns your own VC, Respect and badge XP.
- **Your player travels:** each person plays with the player they built, on every screen. When the game is opened from
  the link, the save is also kept on your account, so the same player is there on your phone and your computer.
- **How it works:** the caller's device runs the game and the other one sends its sticks and draws what it is told.
  Rosters are rebuilt from a shared seed, so only the two human builds cross the wire. The caller must keep the game on
  screen; if either side drops, the other is told and the AI takes over or the game ends.
- **Limits today:** up to the mode's size per team (3v3 = six people). The joining player's crib bonuses and Last Call boosts do not apply in a shared
  game. Their moves feel a little late (their own shot timing does not: the meter is judged on their device).

## What was and was not tested

- **Online, checked by script only, in a simulated room:** three pages form a crew and play a 3v3 with a member on each
  side; two pages see each other, invite, play one shared Street 2v2
  to a finish, the joining player's movement and shot reach the host, and both get paid. **It has not been run on the
  real platform by two real people.** The account save has not been exercised at all outside the code.
- **Checked by script:** the whole loop above with no page errors, landscape and portrait; all four modes play to a
  finish with AI on both sides (about four minutes a game, no stalls, no shot-clock stalls); touch sticks walk, shoot
  and do a move; a simulated controller drives player 2; build codes export and import.
- **Not checked:** nothing has been played by a person, on a phone or anywhere else. Feel, difficulty and the economy
  are first guesses. A real controller has not been plugged in. Sound has not been heard.

## Known gaps

- Animation is procedural poses, not keyframed. It reads, but it is stiff.
- No fouls, no out of bounds (the cage keeps the ball in), no alley-oops, no screens.
- Two players share one camera, so they can drift apart on screen.
- Court tiers change opponents and pay, not the look of the court.
- The rebrand in v0.2 covers the name, the mark, type, colour, every menu, the HUD, signs, shop names, ranks and rarity names. Still in the old joke voice: badge names, attribute blurbs, origins, trophies, the announcer calls. The 3D world got brick, concrete and posters but not a full art pass.
