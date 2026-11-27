# GOT NEXT — where it stands (v0.4, with the v0.5 animation pass noted)

Written at the end of the v0.4 pass: animation and gameplay, crews online (up to six people, 3v3), local two-player
on one keyboard, The Pit renamed The Cages. It covers what is in the game, what is missing, the bugs and risks I know
of, every request so far and where it stands, and a deep dive into how the main systems work.

**One caveat over everything below:** nothing has been played by a person. All checks are scripted (headless Chromium,
software rendering). Online play has only run in a simulated room on one machine, never on the real claude.ai platform
with real people on real phones.

---

**v0.5 (animation and controls):** feet plant and step with leg IK, the dribble is a ball-in-hand state machine, a fixed 60 Hz
simulation with latched and buffered input, cancel windows, braking, steering in moves, pass types, catch arms, box-outs.
All eight acceptance scenarios pass. See [`ANIMATION.md`](ANIMATION.md). The items below "Feet slide" and "the ball can clip"
in section 3 are fixed by it.

## 1. What is in the game

### The loop
Build a player → walk The Block → play in The Cages → earn HC (spent) and Respect (rank, never spent) and smarts XP →
spend on attributes, street smarts, moves, drip, the crib and one-game boosts → rank up → new courts and shelves open.

### The builder
- 6 playstyles (each a full table of 19 attribute caps), 6 origins (one perk each), and height (5'7"–7'3"), weight and
  wingspan sliders. The caps move live as you drag.
- 19 attributes in 5 groups. You start at 60% of each cap and buy the rest with HC; the price climbs steeply.
- Overall is the average of your best 12 attributes, so specialists are not punished for dump stats.

### Street Smarts and progression
- 22 street smarts, 4 per skill group, 4 tiers (Bronze, Silver, Gold, Iced Out). Earned with smarts XP from doing that thing
  in games; each tier also needs an attribute to be high enough.
- 8 Respect ranks; 4 court tiers that open with rank and pay more.
- 29 trophies, 5 of which give drip you cannot buy.
- Bravado meter: big plays fill it; full = +8 to everything for 20 seconds.

### Unlocks
- 74 pieces of drip in 10 slots, some with small attribute buffs, with sneaker-style rarity.
- 22 animations: 9 dribble moves, 5 jumpshots, 4 dunk packages, 4 celebrations.
- 8 crib upgrade lines (court, hoop, shot machine, food printer, trophy wall, couch, sign, flag), each a passive buff,
  and each shows up as a prop at your crib.
- 6 one-game boosts at Last Call.

### Places
- **The Block:** one tight street corner. The Cages (a floodlit chain-link cage with a show court and a crowd) across
  the north side; The Lab, My Crib, The Plug and Tape Deck facing each other; murals, posters, string lights, kicks on
  a wire, a boombox with dancers, a barrel fire, the gold statue, the old head, four HC fiends, the Money Rack
  shootout, a chained UPTOWN LINE gate held for later, an elevated train.
- **The Cages:** four gates (Street 2v2, Street 3v3, JAM 2v2, JAM 3v3), Last Call (boosts), The Link (build codes).
- **My Crib:** home court for shooting around; closet; upgrade bench.

### Basketball
- Half court, camera behind your player. Street rules: 1s and 2s to 11, take it back past the arc, 14-second clock.
  JAM rules: 2s and 3s to 21, shoving, logo dunks, three in a row sets you on fire.
- **Two sticks on every device.** Right stick with the ball: hold ↓ shoot, ↑ attack the rim (layup or dunk; a floater
  from mid-range), ← → side move, ↙ ↘ stepback, ↖ ↗ spin. Without it: ↑ hands up, ↓ steal (JAM: shove).
- **Added in v0.4:**
  - Pump fake: let go of the shot early. AI defenders can bite and jump.
  - Floater: stick ↑ from 2.6–5.4 m. A high, soft shot that a contest affects half as much.
  - Euro step: push sideways as you go up for a layup or dunk. You swing round the defender, and contests and blocks count less.
  - Alley-oop: pass to a teammate cutting at the rim (or calling for it) with space and the dunk rating.
  - Putback dunk: an offensive board caught in the air near the rim can go straight back up.
  - Poster: a dunk on someone standing at the rim knocks them down.
  - Rim hang, and the hoop shakes on dunks, blocks and rim-outs.
  - The camera punches in on slow-motion moments.
  - Swat pose on blocks. Flashy passes for Showmen.
  - Every dribble move moves the ball: across the front, through the legs, round the back.
  - Players look at the ball and lean into turns. Losers sulk after a bucket. Callers wave for the ball.
  - Name tags over everyone but you.
- AI: spacing spots by playstyle, drives when the lane is open, kick-outs, feeds open humans, man-to-man with help at
  the rim, contests, steals, blocks, rebounds; floaters and pump fakes too. Four difficulty levels.

### The player model (rig)
Thin, long-limbed, cel shaded with ink outlines. **v0.4 joints:** hips, lower spine, chest, neck, head; per side
shoulder, elbow, wrist, hip, knee, ankle. 17 joints (was 12). Every pose was rewritten to use them: a shooting wrist
that cocks and goosenecks, a dribbling wrist that snaps the ball down, ankle push-off when running, chest counter-
rotating against the hips, the head kept level. Drip is attached to the bones, so new clothing is cheap to add.

### Two players
- **Local, on a computer:** pick PLAYER 2 at a cage gate. With a controller, P2 uses it. With **no controller the
  keyboard splits** (new): P1 WASD / Shift / Space / E / IJKL, P2 arrows / right Shift / `/` / `.` / numpad 8-4-5-6.
  Co-op or versus. Not on phones.
- **Online (claude.ai link only):** see section 5.

### Friends without being online
- Every person you meet online is kept as a **homie**: their player, as they built it. Import codes still work too.
- **Homies now fill your squad by default** when you run solo, so a 3v3 with your friends' built players works with
  nobody else online. You can also put a homie on the other team as the rival.

---

## 2. What is not in the game

- **Flashy players.** The biggest gap against what you asked for. The bodies are still capsules and boxes. No chains,
  watches, rings, tattoos, glowing gear, sleeves with print, headbands with logos, logo'd jerseys, numbers, signature
  shoes with detail, hair beyond a handful of shapes, facial hair, faces beyond eyes and brows.
- **Hand-made animation.** All movement is pose-to-pose blending in code, no keyframed clips and no foot locking.
  It reads, but feet slide and transitions are generic.
- **Basketball minigames** beyond the Money Rack shootout (no 21, no H-O-R-S-E, no dunk contest, no skills course).
- **Trash talk / lines.** Only the announcer's calls. Players do not talk.
- **Fouls, out of bounds, screens, post moves, inbounding, a full court.**
- **More of the city.** One block; Uptown is a locked gate.
- **Seasons, events, daily contracts.** The slots exist (title, ticker, BRAND.season); nothing fills them.
- **Voice or text chat online.**
- **A host that can hand off.** If the person who started an online game leaves, the game ends for the rest.
- **Sound design.** All synthesised; nothing has been listened to.
- **Settings:** no camera options, no sensitivity, no left-handed layout, no colour-blind options.

---

## 3. Bugs and risks I know about

Ranked by how badly they would hurt a first real session.

1. **Online has never run for real.** The room calls follow the platform's published contract and work against a
   faithful stand-in, but message timing, the presence size limit (4 KiB) and the send budget (~40/s) on the real
   service are untested. Expect the first session to find something.
2. **The online host must keep the game on screen.** Their device runs the game. If their phone locks or they switch
   apps, the browser pauses the page and the game freezes for everyone; after 9 seconds the others are dropped.
3. **Joining players feel a delay** on their own movement and moves (their input goes to the host and the result comes
   back). Their shot timing is judged on their own device, so the meter is fair, but cuts and dribble moves will feel
   a beat late. How much depends on the real network.
4. **Performance on phones is unmeasured.** The Block has 5 coloured lights, string lights, ink outlines (every mesh
   drawn twice) and many separate objects. A mid-range phone may drop frames. Nothing is merged or instanced yet.
5. **Two tabs in one browser share one save.** The second tab's saves overwrite the first's. Same for two people on one
   computer using two tabs. (Two devices are fine.)
6. **Account save is untested.** The newer save wins, by timestamp. Playing offline on one device and online on
   another can overwrite progress.
7. **Local two-player shares one camera.** If the two players split up, one can leave the screen.
8. **Pump fake can eat quick shots.** Letting go before 30% of the release time is a fake, not a shot. For the
   Quick Trigger jumpshot that is about 0.13 s, which should be fine, but a nervous tap fakes.
9. **Feet slide** on direction changes and spins; the ball can clip through a hand or hip during moves.
10. **People in the world walk through things.** NPCs and other online players have no collision.
11. **Homies are matched by name.** Two different friends named the same overwrite each other.
12. **Online games fill empty spots with random AI**, not with homies, and the joining players' crib bonuses and
    boosts do not apply (only the host's).
13. **Economy is untuned.** HC and Respect rates are first guesses; JAM games pay 75%; losing pays about a third.
14. **Leftover joke voice** in street smarts names, attribute blurbs, origins, trophies and calls (it clashes with the slick
    brand in the menus).
15. **Phone layout** of the long menus (attributes, drip) has only been looked at in a 390×844 screenshot.

Fixed in this pass: an online player who stops touching the controls for 6 s is now played by the AI until they move
again (found by the three-player test: idle players took every check and the game never ended); an online member busy
when a run starts no longer leaves a frozen player (the AI takes over after 8 s); online menus no longer redraw ten times a second while people walk (they could eat taps); the crew invite and
COPY CODE buttons had invisible labels.

---

## 4. Everything you have asked for, and where it stands

| Ask | Status |
|---|---|
| A MyPlayer-style park game, 2v2 and 3v3 | Done |
| Phone first, playable on PC | Done (touch twin-stick, keyboard, controller). Not tested on a real phone. |
| Single player on phone, up to 2 players on a computer | Done: controller or split keyboard |
| Export builds, play friends in the modes | Done: build codes; and now online |
| Regular courts, NBA Jam-style arcade courts | Done: Street and JAM rules |
| MyPlayer camera focused on your player | Partly: the camera follows you from behind and above; not a true over-the-shoulder 2K cam |
| Home, home court, unlock as you earn Respect and HC | Done: crib with 8 upgrade lines, ranks, shops |
| "Gutterborn DNA" | Built from your description. I could not find Gutterborn in the repo, so it is not compared against it |
| Lots of drip, achievements, dopamine rush | Done: 74 drip, 22 moves, 29 trophies, count-ups, toasts, rank-ups |
| 2145 America parody, bravado, sports domineering | Done in the world (ads, statue, fiends); menus are now slick on purpose |
| Bums asking HC for Basketball 2146 on PS88 | Done |
| Hub, the courts with mode doors in another room, last-minute things | Done: The Cages, Last Call |
| Builder and shops written in this world | Done |
| Not Gutterborn's graphics; 3rd-person hub cam | Done |
| Basketball minigames | **Mostly not:** only the Money Rack |
| Basketball dress, drip and lines | Drip yes; "lines" (players talking) **no** |
| Deep builder; moves on a stick; research attributes/buffs | Done; research in `docs/DESIGN.md` |
| Cel shaded, thin, built to animate, easy to dress | Done, but primitive (see section 2) |
| Street smarts (street smarts) like MyPlayer | Done |
| Total rebrand, slick, save space for more | Done: GOT NEXT, `docs/BRAND.md` |
| Way more urban, players dripping in swag and flash | World: yes. **Players: not yet.** The biggest open item. |
| "Cage" and "born" not in the title | Done |
| The Pit becomes The Cages | Done in v0.4 |
| Online multiplayer in the artifact | Done (untested live) |
| Carry the player you made into multiplayer and back | Done; plus account save |
| Smaller lobby, closer buildings, turnt up | Done |
| More joints, more moves, better animation | Done this pass (17 joints, 9 new plays); still procedural |
| Better looking gameplay | Partly: camera punch-in, hoop shake, name tags, posters. No new court art or lighting |
| 3v3 with friends online, invite them to me | Done: crews up to 6, they follow you, you call teams |
| 3v3 with friends' built players when playing solo | Done: homies fill your squad |
| Local 2 player | Done: controller or split keyboard |
| A detailed breakdown | This file |
| Fouls to stop steal spam | Done (0.9.4): reach-ins, hand checks on repeat swipes, shooting and blocking fouls, and-ones; offense keeps the ball. Not in JAM. Balance is a first pass |
| Out of bounds, not too easy to run out | Done (0.9.4): ball handler over a line is a turnover; outward drift near a line is damped unless you sprint at it on purpose. Loose balls are not called out yet |
| Ring pointer to your man | Done (0.9.4): magenta arrow on your ring on defense |
| Don't earn HC too fast (no 99 in one session) | Done (0.10): upgrades past 55 get steep. Maxing a build is ~72-110k HC (about 20 hours); 80 OVR is ~32-39k. Early upgrades cost what they did |
| 5 savable builds | Done (0.10): MY PLAYER → BUILDS. Own body, attributes, street smarts, moves, fit and movement profile per build; HC, Respect, owned drip and moves, crib shared. Online uses the active build |
| Stomping when jogging on the court | Fixed (0.10): the running stride only kicked in above 3 m/s, so a half-pushed stick fell back to old stepping. Now the Block's walk-to-run gait runs on the court from 1.2 m/s, and a jogging ball handler turns toward where he's going |
| Controller on every menu; home builder with a pad | Done: tests/padmenus.mjs opens 38 menus and checks every control is reachable; builder mapped (A place, X rotate, Y store, LT sell, d-pad catalog, LB/RB category) with a hint strip |
| Phone controls | Done: 38 menus pass in portrait and landscape (no sideways scroll, every button 30 px or more); on-screen LT button |
| Watch the holodice, not a menu | Done: games at Trey's are played on sixteen holodice with the camera on the table; only a slim bar for buttons. Bones at home keeps the panel |
| Backs, bumps, falls, celebrations | Done: torso geometry and a rest curve; momentum exchange on collisions by strength, weight and height; falls: sit, face, flat, spin, knee; celebrations chosen by the play, air flex off a dunk, finger wag after a block |
| HC, Street Smarts, more to unlock | Done (0.11): VC is now HC (Hooper Coins) and badges are Street Smarts in every menu (save fields unchanged). 22 street smarts (new: The Postman, Heat Check, Showtime, Hard Hat, Clamps, Iron Chin), 19 celebrations (new: Green Bean, Green Giant, Ice In My Veins, Fent Lean, Pour Out The 40), 17 branded home pieces (46k HC). tests/hc.mjs |
| Screens, box-outs, game point | Done (0.11): LB / R / PICK with the ball calls the nearest AI teammate to screen your defender, then he rolls to the rim; AI handlers call them too. LT with a shot in the air boxes out (wider body, slower feet, better odds on the board). One bucket from the win is GAME POINT: release windows scale with Shot IQ. Guests online cannot call screens yet. tests/depth.mjs |
| Phone buttons | Done (0.11): glass discs in the colour of the action (pass green, shoot pink, LT gold, PICK cyan), bigger, lit when pressed; PICK only shows when it can be used |
| Reach reactions, coverage fades, basic package, lobs | Done (0.12): a handler who sees the reach (Handles) moves the ball to the far hand and the swipe finds less; fades read the coverage (lean back, drift left/right); the basic package dunks one-handed or cocked off the run, lays it up left-handed on the left side, goes early off the wrong foot or spins; a euro into the shot-blocker is punished, a hop can freeze a defender; AI rates passes, kicks out of drives, cuts backdoor and throws lobs on both teams. tests/flair.mjs |
| Highlights and CAGE magazine | Done (0.12): posters, alley-oops, putback slams, show dunks, ankle-breakers, swats and game winners get slow motion, a push-in camera (can be turned off in OPTIONS), a banner and the fit; yours are photographed into CAGE covers under MY PLAYER → CAGE MAG. 24 covers kept, the newest 8 with photos; first of each kind pays 150 HC, the set 2,500. Not shown to online guests |
| Personality engine | Done (0.12): 40 traits (7 free in the builder, 33 at Tape Deck for 600–3,200 HC), three worn per build. They pick the trash talk (320 lines in six situations: scored, got a stop, the other man whiffed, blowout, going badly, won) shown as small speech bubbles that never pause play, rate-limited, can be turned off in OPTIONS. Each gives a small perk; none is net negative. AI players carry three each, fixed by name. Guests online see the host's bubbles. tests/pers.mjs |
| Screen kinds | Done (0.12): set, hard (sprint held when you call it: holds longer, can lay the defender out) and soft (a brush and an early slip). The defender fights over the top by holding LT (strength decides) or is caught and goes under; a much stronger defender can blow the screener up. New poses for each, in the Anim Lab |
| Free animation set | Done (0.13): jump shots can be put together from 8 lower bases (square, tall, compact, hop, wide, staggered, sway, set shot) and 8 upper bases (textbook, high, quick, two-hand push, over the head, slingshot, one-hand flick, cocked by the ear), picked free in MOVES; AI players are spread across them. Free layups add up-and-under, over the top, 360, wrong foot and a baseline reverse; free dunks add hammer, leaner, two hands and hang, and a tip slam on putbacks. All in the Anim Lab. tests/basics.mjs |
| Defense: charges and switches | Done (0.14): a driver who runs through a set defender outside the circle is called for a charge (hold LT with your feet still to take one; a euro step gets round it); AI defenders caught on a screen switch; LB / R / SWITCH on defense takes the ball handler. tests/defense.mjs |
| Off the ball | Done (0.14): LT with your feet still sets a screen yourself and your AI handler comes off it; flick the skill stick for a cut burst that can lose your man. tests/slices.mjs |
| Runs and streaks | Done (0.14): three unanswered buckets is ON A RUN (release window +5% for them, -3% for you) until the other team scores; three makes in a row HEATING UP (+8%), three misses ICE COLD (-10%) |
| Loose balls | Done (0.14): the pass/steal button near a loose ball dives on it; a rebound in a crowd can be tipped out to a teammate; two men on it at once is a TIE UP and the arrow alternates |
| Passing | Done (0.14): press pass while the ball is on its way to you for a touch pass (shooter gets a small bonus); AI makes the extra pass to an open man |
| Dribble combos, scouting | Done (0.14): mixing moves builds a combo and breaks more ankles; the same move repeated gets READ and costs you a beat. After four shots AI defenders play what you keep doing: up on shooters, off drivers |
| Hustle | Done (0.14): teammate grade A–F from assists, screens, charges, dives, touch passes, box-outs (A +60 HC, B +35, C +15); AI plays its personality (thieves reach, glass men box out, the cold-blooded want the last shot); buzzer beaters are an eighth CAGE highlight; three stops in a row is LOCKED IN (+8% contest, +10% steals) |
| Run styles and variant pools | Done (0.15): 8 run styles (natural, upright, forward lean, arm pumper, glider, heavy, bouncy, low and tight) that change the trunk, head and arms and leave the measured stride alone; picked free in MOVES, spread across AI players. Pools that never repeat twice running: 4 shot gathers, 4 follow-throughs, 3 landings (the release pose itself is untouched), 4 contests, 3 steal reaches, 3 catches, 4 sets of off-ball defensive hands, off-ball gestures (hand up, clapping, pointing) and alternating jab steps in triple threat. tests/pools.mjs |
| Rim, breathers, crowd voices, post-ups | Done (0.16): early misses come off short, late ones long, way off is an AIRBALL; about 3 in 10 non-green makes rattle in; a check-up gives everyone 16 stamina back and GASSED shows when a player is spent; people at the fence speak in bubbles on big plays; opponents' rating and personality show at the first check; strong, taller AI posts up a smaller defender. tests/slices2.mjs |
| Play-test pass (0.16.1) | 27 full games in tests/soak.mjs (AI-only and scripted input; 2v2, 3v3, RUCKUS): no page errors, bad numbers or stuck states. Fixed from it: called screens were nearly always the soft kind and the AI handler did not use them (contact 28% → 61%); AI dunked almost everything (now lays some up, street FG% about 45–55%); steals had nearly vanished; extra pass impossible in 2v2; tip slams and ankle highlights too frequent; bubble squeezed at the screen edge. Still rare in AI games: charges (1 in 13), tie-ups (0 in 27 games) |
| Base package for the starter (0.16.2) | A new player's own layups now come from pools that never repeat (alone: lay, finger roll, over the top; with a man on him: up-and-under, over, scoop, power, 360, wrong foot); the left hand is used on the left side and, down the middle, away from the nearest defender, with no rating needed; a clear run lets Dunk 45+ throw down a basic dunk (one hand, leaner, two hands; cocked and hammer from 68). MOVES opens with a BASE PACKAGE card listing it. On a phone the gold LT button is a switch: tap on, tap off, and it lets go by itself when the ball changes hands or a shot goes up. tests/base.mjs |
| Animation packages (0.17) | src/packs.js. You wear one package of each kind and the game rotates through it by the situation, never the same one twice running: 5 dunk packages (Base, Air Mail, Rim Wreckers, Showtime Reel, Above The Law), 4 layup (Base, Bully Ball, Crafty, Acrobat), 4 dribble (Your Picks, Shifty, Iso Tape, Street Legend), 4 post (Base, Old School, Bully, Finesse), 4 idle dribble, 7 stance. A package only uses what the player's rating allows and is filled out from the base set below that. Three dunks stay as single SIGNATURE dunks (360 No-Scope, The Loophole, Back Scratcher); the one equipped joins the rotation. Singles bought earlier still work as a signature. AI players wear packages fixed by name. Stances Ice, Showtime, Dog, Professor and Live Wire, and the High Stepper and Shifty run styles, come from ON TWO (the football game; its engine had no new poses to take). tests/packs.mjs |
| Hair (0.17) | 13 more: 360 Waves, Straight-Backs and Curly Top free in the builder; twists, flat top, ponytail, shoulder locs, afro puffs, pineapple locs, mullet and three colour variants at The Plug |
| Hit layer on falls; shoulders (0.17.1) | Stumbles and falls are driven by the hit: the chest turns with the push, the head lags, the hips follow a beat later, each leg goes its own way, and a fallen player bounces once, settles differently every time and breathes until he gets up (tests/falls.mjs; the Anim Lab plays a different hit each loop). The neck-to-shoulder slope is drawn as shirt under tees, jerseys and hoodies, so skin no longer pokes through at the shoulders |
| People on the Block spaced out (0.17.2) | A spacing pass runs once the Block (and the Cages lobby) is populated: anyone free to move is eased at least 2 m from everyone else, 1.5 m clear of the spots you walk up to and away from where you come in; the cast, seated people and the dice ring stay put. Wanderers pick empty places and do not walk through each other. Two people on one corner no longer share a name. The three wandering hoopers and one fiend moved to the middle of the lot. Closest pair 1.05 m → 1.99 m; north / middle / south 14 / 4 / 7 → 10 / 8 / 7 |
| First ten minutes (0.18) | src/guide.js. Walk-On meets a new player where they come in and walks them to Coach Overtime. Coach's board has three tabs: DRILLS, HOW IT WORKS (11 explanations, 7 with a TRY IT drill) and LESSON PLAN (six first steps, 60 HC each, 300 for all). Walk-On stays by Coach to ask again |
| Turbo and stamina (0.18) | Squeezing sprint with the ball gives a 0.6 s burst (+16% on top of the sprint, 9 stamina), can beat a tight defender off the first step, 1.4 s between bursts, none under 18 stamina. A stamina bar sits under your player while it is not full. AI gets the burst when it starts a drive |
| Sound (0.18) | Sneaker squeaks on hard cuts, dribble moves and bursts; makes vary (swish, softer net, rattle); crowd swell on dunks, twos and runs; a groan on an airball; a thud when a player hits the floor |
| Contact, AI (0.18) | A hard bump or a screen jolts the trunk and head of both bodies (the hit layer, small). AI help defenders plant for charges on a straight-line driver; AI teammates come to screen for you when you are held up |
| Save safety (0.18) | A copy of the last good save is kept once a day and is used if the save will not read; OPTIONS has COPY SAVE CODE, LOAD A SAVE CODE and RESTORE YESTERDAY. If storage is full the CAGE photos are dropped first and you are told |
| Copy pass (0.18) | Street smarts renamed to say what they do (Through Traffic, Air Time, Soft Touch, Second Chance, Parking Lot Range, Leave Him Open, Hand Down Man Down, Green Light, Ankle Breaker, Dime Dropper, Tight Handle, Sit Down Defense, Long Arms, Pickpocket); attribute blurbs, announcer calls and five trophies rewritten. Ids unchanged, so saves carry over. The 2145 world jokes (origins, billboards, fiends) are kept on purpose |
| Replays and the wall (0.19) | src/replay.js. A highlight of yours keeps a 5 s recording of every body and the ball (about 25 KB) with its CAGE cover; WATCH THE REPLAY plays it back in the court with pause, slow motion (0.35×) and three camera angles, looping. SAVE VIDEO records it to a webm through the artifact's downloads (a plain download outside Claude). POST TO THE WALL puts it in a shared collection everybody the game is shared with can watch; you keep your last three up. Replays and photos stay on the device: the cloud copy, backups and save codes leave them out. Names on the wall are shown as text; a replay that fails its checks is refused |
| Basketball IQ (0.19) | Off the ball the defence plays by passes away: one pass away sits in the lane at about 1.3 m, two away sinks toward the paint (less off a shooter, none off a man on fire). Help the helper: when one defender steps up to a driver, the last man splits the two left open. On a drive the men off the ball move to a spot the driver can see, out of his lane. Give and go: an AI passer with a lane cuts behind his pass (calls it to you). A defender who reaches and misses gets attacked. A poor AI defender ball-watches instead |
| Shooting honesty (0.19) | Perfect timing beats an open look every time, but a hand in the face now costs it (smothered, about two in three; 'Perfect release · too much hand'). The AI used to keep a sure make whenever its release landed in the window; now it gets the window half the time, as it always said. The AI waits for a clean look instead of firing over a hand. Mid-range nudged up. Measured over 14 AI games: threes 37%, mid-range about 40%, layups 54%, open jumpers well above contested ones |
| Chat bubbles fixed (0.19) | Typed chat on The Block and at the crib, a friend's chat online, the cast's lines, the Lex's ZOOMIES and the crib-like message had stopped showing since the personality engine: its trash-talk bubble had the same name as the world bubble and replaced it. Renamed; the fans at the fence use the trash-talk bubble as they were written to |
| Smoothness (0.19) | Measured with tests/packlab.mjs (every dunk, layup, dribble move, post finish and idle dribble from every package, frame by frame) and tests/overlap.mjs. Joints now have a top speed (about 1,150°/s; trunk slower, wrists faster): arms used to fall from over the rim to the sides in one frame at the end of every layup (43–66° in a frame), now at most 23°. Hips, knees and ankles are capped after foot planting too (dribble moves folded a knee up to 52° in one frame). The ball rides the hand that has it at the gather and is carried into the rim on a dunk instead of jumping there. Capes hang from the shoulders. Reaching and staggering bodies get more room. Menu backdrop darker and blurred so signs do not show through |
| Playtest fixes (0.19) | RUCKUS: after any shoving the game could not end and the shot clock stopped (brawl heat sat in an else chain) — fixed, tests/ruckus.mjs. Betting moved to Trey's table (TREY'S BOOK); Mark and D are off the Block; no van jokes. Controls strip shows the device you last touched (controller glyphs in colour) and only what the buttons do right now. Shoulders: the joint sits inside the chest edge, no balls on the outside of every shirt; jersey stripe wraps the chest. Movement: jog 2.7-4.3 m/s, sprint 4.2-7.4, and the run pose leans and pumps with speed; plant-and-go on hard cuts; on-ball defenders slide, sprint with a sprinting handler and cut off the angle by level (tests/blowby.mjs: a pure turbo drive gets clean to the rim ~31/40 on Side Court, ~9/40 Main, ~0 The Cage and Kings). Contests by spacing: verticality, one hand, closeout. Catch hands come up as the ball arrives. Defender's hand up only at a shooter or a dead dribble. Post backdown has a beat; body up holds ground and stops a walk-through |
| Blind reviews (0.19) | Two playtesters who never saw the code; their reviews became magazine pages, then they read the code. Fixed: results screen skipped by a held E, greens ignore range, meter drew a fixed band, square statue collider, tiny gate prompts, beggar stealing the prompt, no goal after the tour, unnamed streak banners, +5 with no price, AI shooting before feeding an open human, free repeat pump fakes. tests/reviewfix.mjs |
| Real-game animations | From coaching sources: deny stance (hand and foot in the lane) and help stance (ball-you-man, pistols) off the ball; chop-step closeouts with a high hand and a low hand; chinning a rebound; showing the passer a target; pointing at the passer after an assist; hands on knees when gassed at a dead ball. tests/reallife.mjs counts and photographs them |
| Dribble rhythm | The ball rides the footsteps: a bounce every step when slow, every other step running, landing as the far foot comes down; it goes round a leg instead of through it; resets glide into the hand; drops capped at a real push speed; wide stances bounce it further out. High Stepper lifts the knees in the swing. tests/dribscan.mjs (11 runs plus AI games, PACK= and --run= for styles), tests/sideview.mjs |
| Team play | AI handlers come off a teammate's screen (they only used yours) and a locked-up handler calls for a pick and roll; every run style has its own swing leg; Coach Overtime has a name over his head. tests/teamplay.mjs: screens 0.3–0.5 a trip, rolls fed 17 of 18, assisted makes 54–70% |
| Ball-handler motion | From film notes on Luka, Ja, Rose, LeBron, Mitchell (movement only, no extra ability): AI probes in first gear with room then changes pace; a low long-lean first step out of a slow dribble; lead shoulder into the defender on a drive with the off arm up; lower near a defender, taller when probing. tests/reallife.mjs counts them |
| Online and body up | The host checks a guest's reported shot hold against its own clock (within 70 ms, room for jitter); a doctored client claiming perfect holds gets its real one (tests/netcheat.mjs). The body-up check in tests/post.mjs now takes the median of five runs each way: without it the handler gains 1.72 m in a second, with it about 1.06 m |
| Crossovers and stick work | A move pressed while the ball is in the air waits for the catch (the ball never turns in mid-air); the whole bounce travels with the body and re-aims at where he is going, within ~0.9 m of the hips; working side to side the chest stays to the rim (easing off at a full sprint); shuffling sideways the ball goes out in front of the lead leg. tests/dribfeel.mjs, tests/crossfilm.mjs |
| Jump shot form | From shooting references (Curry mechanics, arc diagrams): off the floor as the legs finish extending, a few inches of lift from real gravity, released on the way up, arc about 47 degrees (moonball 51, quick 46), follow-through held. tests/shotform.mjs |
| Standing dribble | From dribble references (Curry, Harden, street low dribble): standing still the ball goes straight down under the hand, outside and a little ahead of the front foot (was 27 cm of slant each bounce, now about 12). tests/dribscan.mjs "standing bounce sideways travel" |
| Contests at the rim | From rim photos: every contested layup puts the off forearm up as a shield, leans away, and finishes one arm long on the far side; the rim defender decides to contest the moment a finish is in reach (it waited for a think tick and often just watched). tests/rimfilm.mjs films it side-on |
| Controller playtest fixes | A bot played a fresh save on a virtual controller (playkit harness pad commands). Fixed: on-screen keyboard for the player name, builder starts on the name and asks once before ROOKIE, clear focus ring, START closes pause and My Player, menus keep buttons clear of the pad hint, one hint bar on the Block, no keyboard keys in the music pop-up or P2 note, Talk to Coach stays until a drill |
| Camera and crowding | Match camera looks down more steeply so a defender between you and the camera no longer hides you and the ball, and stays on your player near the top of the key; overlapping name tags fade (yours stays); on the Block the camera pulls in over the statue and small props to shoulder height; interact prompts reach about 0.45 m further. tests/driveclip.mjs showed the bodies never actually overlap on drives (closest chests 57 cm) |
| Crowd grows with the game | Done (0.11): five watchers at tip; big plays and a tight late score bring named Block people walking to the fence, up to a full cage. Online guests get the same arrivals |
| Wearables from the other games; no twin bots | Done: 36 crossover pieces (94k HC), 3 earned; AI looks made unique per game and on the Block |
| Post moves by direction; auto dribble hand; JAM slugfest | Done (0.10): LT + X with the stick picks drop step / hook / fade / jump hook / turnaround. Ball goes to the hand of travel or away from a defender within 1.7 m (manual crossovers hold 1.5 s). JAM: haymaker, clothesline, KO, called foul with ball reset. No new animation for the hand switch beyond the crossover dribble |
| Nicer courts; arcade JAM courts with power-ups | Done (0.10): courts.js. Park courts: asphalt grit, resurfacing, worn paint, scuffs, lane hashes, centre logo, tier paint, benches and a flip scoreboard. JAM: neon floor, LED strips (score flash, fire), jumbotron, five power-ups, synced online. AI doesn't go after power-ups on purpose |
| Post game (LT on offense) and body up (LT on defense) | Done (0.10): first pass. Back-down by strength, turnaround fade, hook, drop step, face up. AI offense doesn't post up yet; there is no touch button for LT yet |
| Animation blending and player individuality | Done (0.10): see docs/ANIMATION.md §15. Three blended shot styles and three idles, persistent profiles, transition table, layers, ANIM LAB in the Dev Room |
| Game crashed spamming steal | Not reproduced: about 6 minutes of random steal spam (2v2, JAM, 3v3) gave no page errors or freezes. Need details: phone or PC, online or solo, froze or error |

---

## 5. Deep dive

### 5.1 Online: how it works
- **Transport.** The claude.ai artifact *room*: everyone with the page open shares a lobby; each person publishes a
  small "presence" object (≤4 KiB) that everyone else receives. A game uses its own named room so lobby traffic and
  game traffic stay apart.
- **What each person publishes in the lobby:** their packed build (~400 bytes), where they are (Block / Cages / crib /
  in a game) and their position, plus short-lived fields for calls (`inv`), answers (`acc`), crew membership (`cr` for
  a leader, `in` for a member) and a game start (`go`).
- **Crews.** A leader invites from My Player → CREW (or from a gate). A member who says Pull up is teleported next to
  the leader and from then on follows them between The Block and The Cages. At a gate the leader sees the crew at the
  top, sets each person to MY TEAM or THEIR TEAM, and presses RUN IT WITH THE CREW. Teams are capped at the mode size;
  the AI fills the rest.
- **The game itself is host-authoritative.** The leader's device runs the full simulation. Each guest sends only its
  sticks and button presses (~30 times a second, only when they change) and draws what the host sends back (~20
  snapshots a second, about 1.2 KB each: every player's position, state and timers, the ball, and recent events like
  calls, sounds and floating text). Guests smooth between snapshots.
- **Shot timing is fair to guests.** A guest's device measures how long they held the shot and sends that number; the
  host judges the release with it. The guest's own meter is drawn from their thumb, not from the lagged snapshot.
- **Rosters are not sent.** Every device rebuilds the same teams from the same random seed and the human builds, so
  AI players have the same names, bodies and drip everywhere.
- **Leaving and going idle.** A guest who leaves is handed to the AI. A guest who never arrives is handed to the AI
  after 8 s. A guest who stops touching the controls for 6 s plays as AUTO until they move again. If the
  host leaves or stops sending for 9 s, guests are sent back with no pay.
- **Rewards.** Each device pays its own player from its own box score.
- **What would make it better:** host hand-off (any guest can take over from the last snapshot); client-side
  prediction of the guest's own movement (removes most of the felt delay); homies as online AI fill (send their
  builds in `go`); a "ready" check before tip-off; quick chat (preset callouts).

### 5.2 The builder, by the numbers
- Cap = playstyle base + height × h + weight × w + wingspan × s, per attribute (`BODY_MOD`), plus origin perks,
  clamped 35–99. Height buys rebounding, blocks and inside play and costs speed, handles and the deep ball; weight
  buys strength and costs quickness; wingspan buys steals, blocks and boards and costs shooting.
- Price of +1 = `6 + (v − 30)^1.55 × 0.16` HC: about 36 at 60, 150 at 90. Maxing a build is a long goal by design.
- Street Smarts change one named term in one formula each, so they are easy to tune.
- In-game value of an attribute = its number + drip buffs + crib buffs + boosts + Bravado.
- Full write-up: `docs/DESIGN.md`.

### 5.3 Shooting and finishing
- Jumper: base chance from attribute and distance, cut by contest (nearest defender, hands up or jumping, their
  defense). A green window around the ideal release, widened by Shot IQ, the Green Card street smart, the jumpshot, the Shot
  Doctor; narrowed by a hand in your face. Green = in (80% if smothered); outside it, the chance falls with how early
  or late.
- Floater: fixed quick release, half the contest, falls off past 2.2 m.
- Finishing: dunk if close enough and rated (always in JAM), else layup; euro step and alley-oop soften contests and
  blocks; posters and putbacks are dunks with extra effects.

### 5.4 Animation
- 17 joints. Each frame picks a pose from the player's state (about 30 poses: idle, run, dribble, defensive slide,
  shot dip / set / release, floater, layup with euro, three dunk styles with windup and slam, swat, steal, shove,
  passes, catch, call for ball, nine dribble moves, stagger and fall, four celebrations, sulk, dance, sit, beg, warm
  hands) and every joint eases toward it at a pose-specific rate. Look-at and lean are layered on top.
- To go further: real clips (keyframes per move), foot planting, and the ball parented to the hand bone during moves.

### 5.5 Files
`src/data.js` tables, `src/core.js` save/input/sound, `src/gfx.js` rendering/rig/poses, `src/ball.js` the
basketball, `src/hub.js` places, `src/ui.js` menus/HUD, `src/net.js` online, `src/main.js` loop/rewards.

---

## 6. What I would do next, in order

1. **Play it.** One real session on a phone, one with a friend online. Everything above is a guess until then.
2. **Players that drip.** A body and face pass (proportions, hands, faces, hairstyles), then flash cosmetics: chains,
   watches, rings, tattoos, numbered jerseys, logo socks, glowing and animated gear, signature shoes, plus a
   "fit check" camera in the closet.
3. **Phone performance.** Measure first, then merge static meshes, cap lights, cheaper outlines.
4. **Online polish.** Host hand-off, guest prediction, homies as AI fill, quick chat.
5. **Minigames.** 21, H-O-R-S-E, a dunk contest at the cage, a skills course: short, repeatable, with their own rewards.
6. **Copy pass.** Rewrite street smarts, trophies, origins and calls in the street voice of the brand.
7. **Animation clips** for the signature moves and dunks.
