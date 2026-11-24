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
Build a player → walk The Block → play in The Cages → earn VC (spent) and Respect (rank, never spent) and badge XP →
spend on attributes, badges, moves, drip, the crib and one-game boosts → rank up → new courts and shelves open.

### The builder
- 6 playstyles (each a full table of 19 attribute caps), 6 origins (one perk each), and height (5'7"–7'3"), weight and
  wingspan sliders. The caps move live as you drag.
- 19 attributes in 5 groups. You start at 60% of each cap and buy the rest with VC; the price climbs steeply.
- Overall is the average of your best 12 attributes, so specialists are not punished for dump stats.

### Badges and progression
- 16 badges, 4 per skill group, 4 tiers (Bronze, Silver, Gold, Iced Out). Earned with badge XP from doing that thing
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
  a wire, a boombox with dancers, a barrel fire, the gold statue, the old head, four VC fiends, the Money Rack
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
13. **Economy is untuned.** VC and Respect rates are first guesses; JAM games pay 75%; losing pays about a third.
14. **Leftover joke voice** in badge names, attribute blurbs, origins, trophies and calls (it clashes with the slick
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
| Home, home court, unlock as you earn Respect and VC | Done: crib with 8 upgrade lines, ranks, shops |
| "Gutterborn DNA" | Built from your description. I could not find Gutterborn in the repo, so it is not compared against it |
| Lots of drip, achievements, dopamine rush | Done: 74 drip, 22 moves, 29 trophies, count-ups, toasts, rank-ups |
| 2145 America parody, bravado, sports domineering | Done in the world (ads, statue, fiends); menus are now slick on purpose |
| Bums asking VC for Basketball 2146 on PS88 | Done |
| Hub, the courts with mode doors in another room, last-minute things | Done: The Cages, Last Call |
| Builder and shops written in this world | Done |
| Not Gutterborn's graphics; 3rd-person hub cam | Done |
| Basketball minigames | **Mostly not:** only the Money Rack |
| Basketball dress, drip and lines | Drip yes; "lines" (players talking) **no** |
| Deep builder; moves on a stick; research attributes/buffs | Done; research in `docs/DESIGN.md` |
| Cel shaded, thin, built to animate, easy to dress | Done, but primitive (see section 2) |
| Badges like MyPlayer | Done |
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
| Don't earn VC too fast (no 99 in one session) | Done (0.10): upgrades past 55 get steep. Maxing a build is ~72-110k VC (about 20 hours); 80 OVR is ~32-39k. Early upgrades cost what they did |
| 5 savable builds | Done (0.10): MY PLAYER → BUILDS. Own body, attributes, badges, moves, fit and movement profile per build; VC, Respect, owned drip and moves, crib shared. Online uses the active build |
| Stomping when jogging on the court | Fixed (0.10): the running stride only kicked in above 3 m/s, so a half-pushed stick fell back to old stepping. Now the Block's walk-to-run gait runs on the court from 1.2 m/s, and a jogging ball handler turns toward where he's going |
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
- Price of +1 = `6 + (v − 30)^1.55 × 0.16` VC: about 36 at 60, 150 at 90. Maxing a build is a long goal by design.
- Badges change one named term in one formula each, so they are easy to tune.
- In-game value of an attribute = its number + drip buffs + crib buffs + boosts + Bravado.
- Full write-up: `docs/DESIGN.md`.

### 5.3 Shooting and finishing
- Jumper: base chance from attribute and distance, cut by contest (nearest defender, hands up or jumping, their
  defense). A green window around the ideal release, widened by Shot IQ, the Green Card badge, the jumpshot, the Shot
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
6. **Copy pass.** Rewrite badges, trophies, origins and calls in the street voice of the brand.
7. **Animation clips** for the signature moves and dunks.
