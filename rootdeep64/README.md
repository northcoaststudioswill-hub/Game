# Rootdeep 64

Rootdeep (cartridge 2 of the Pocket Lantern, v2.9) rebuilt as its own game: the same loop, the same
cast, the same numbers, on a new late-90s-cartridge 3D engine, controller first, 1–4 keepers on one couch.

`index.html` is the whole game — one file, no dependencies, no network. Open it and play.
After editing anything in `src/`, rebuild it with `python3 build.py`.

## Controls

| | Move | Attack | Cast | Special | Super | Dash | Pause |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Controller | stick / d-pad | A | B | X | Y | any shoulder / trigger | Start |
| Keyboard 1 | WASD or arrows | Z / J / Space | X / K | C / I | V / O | Shift / L (or double-tap a direction) | Enter |
| Keyboard 2 | arrows | `,` | `.` | M | N | `/` | Backspace |
| Touch | left thumb (floating stick) | A | B | SP | SUPER | DASH | START |

Hold attack and release for a **Heavy**. Attack out of a dash for a **Dash Strike**.

The first device to press A/Start is player 1. Anyone else joins by pressing A on another pad
(`,` for a second keyboard player) in the Hearth or on CHOOSE YOUR KEEPER. In the Hearth, A talks /
opens stations, Start gifts Honey mid-talk, Select opens the menu.

## What is the same as the cartridge

Everything in `src/data.js` is copied verbatim from the cartridge: gods, boons, duos, rarities, weapons,
Mirror, keepsakes, all dialogue, foes, biomes, bosses, Pact, the cast and their signatures, the intro,
the sprout exchange. `src/game.js` is the cartridge's logic ported function by function — the Hearth
(stations, NPC routes and personal space, Honey gifts, Ledger, Codex, Pact), CHOOSE YOUR KEEPER with
the same earned unlocks, 12 chambers / 3 biomes / two waves / elites at 3, 7, 10 / bosses at 4, 8, 12,
two reward doors, shops, buds as weak auto-battlers, the pod guarantee, banking on death. The
simulation still runs on the cartridge's flat plane in the cartridge's units, so speeds, ranges and
damage are the original values; the 3D is how it is drawn, not a re-tune.

Canon kept as handed over: MAZEL TOV LASER, SELFIE FLASH, TOWEL WHIP, HYDRO JET, Marcus's voice,
no explainer screens, no gameplay verb on Select, sprouts earned not given.

## What changed, and why

- **Co-op.** `P3` became `PL[]`. Health, dash charges, cast ammo, combo and character are per keeper.
  The run is shared: petals, Moondew, keys, honey, boons, the bud string, the doors. Foes hunt the
  nearest standing keeper. A fallen keeper is revived by a teammate standing over them (2.2 s) and
  gets up at the next chamber at 30%; Death Defiance / Phoenix Bloom / Old Collar only fire to stop
  a full wipe. Extra keepers add to the chamber budget (`+(n-1)*(2+ch/2)`) and boss health (`+75%`
  each). In co-op a reward door needs a keeper to hold the doorway 0.6 s so nobody picks by accident.
  Solo plays as the cartridge does.
- **A dash button.** The cartridge only had two buttons, so dash was a double-tap. That still works
  on keys and the d-pad; pads and touch also get a real button.
- **Dash charges refill one after another.** On the cartridge the second charge only came back after
  the next dash. This is the one rules change that also affects solo — easy to revert in `runUpdate`.
- **Arena is 280×230** (cartridge: 240 × screen height) to suit a wide screen and four keepers.
- **No cartridge shelf.** "Swap cartridge" became "Quit to title". Save key is `rootdeep64-v1`; on a
  first boot it copies a `rootdeep-v1` cartridge save if one is on the same origin and never writes back.

## Animation

The models are simple on purpose; the motion is not. Each character is a jointed rig (waist, chest, head,
shoulders, elbows, hips, knees, weapon wrist). `src/anim.js` builds a target pose from what the character is
doing and every joint chases it on a slightly under-damped spring, so moves wind up, overshoot, settle and
blend without popping. Run cycles are driven by real ground speed, turns bank, starts and stops lean, feet
are planted from the leg pose. It only reads game state — no rule or timing that affects play was changed
(the swing, cast and selfie *visual* timers are longer; cooldowns and damage are untouched).

- Keepers: walk-to-run cycle, three-hit combo (cut, back-cut, leaping overhead finisher), maul and bow
  variants, MAZEL TOV LASER, SELFIE FLASH, TOWEL WHIP, HYDRO JET, dash lunge, flinch, fall, kneel to
  revive, drop-in landing at each chamber, cheer on a clear, foot dust.
- Louie: trot into gallop, pounce-bite, THE BOOF play-bow bark, wagging, panting, head tilts, sits when
  he waits, spins when he cheers.
- Hearth: Marcus arms crossed and tapping a foot, Erin hands clasped and kneeling to tend the bed, Scout
  scribbling notes and glancing up, Ranger hand on hip scanning the room. Everyone turns their head to
  whoever walks up and gestures while talking.
- The Hollow Keeper uses Will's rig: crouched wind-up, lunge, flinch.

## Combat feel

`src/fx.js`. Hit-stop on contact (longer for heavies, crits and kills); slow motion on the last kill of a room and
on a boss going down, with a burst of rings and sparks; ribbon trails that follow the real blade tip through every
swing; the second blade cut is a full spinning backhand; impact stars and spark sprays thrown away from the hitter;
foes rock back and squash when struck, finishers / heavies / supers knock small foes into the air (a short stun
while airborne), and dead foes tumble away spinning before popping; dash afterimages are copies of the keeper in
the player's colour; a camera punch on big hits; a per-player combo counter (NICE / GREAT / BRUTAL / SAVAGE).
Foes telegraph: grubs rear up and lunge when close, crabs snap their claws, spitters and wisps swell and glow red
just before they fire. Online friends see all of it (rebuilt on their side from hits and deaths they receive).
`node test/combat.js` freezes a fight at telling moments and saves close-ups.

## The deep's own story

`src/lore.js`, new writing on top of the existing lore (flagged in the file). It adds:

- **Twelve named chambers** (THE ROOT CELLAR ... THE HOLLOW), each with a whisper on your first visit.
- **38 relics** placed in rooms as 3D objects (tablets, statues, shrines, cold camps, packs, carvings), read when
  the room is quiet. Three tablets tell three different stories of how the Lantern cracked; the game doesn't pick one.
  Codex page 5 keeps them.
- **The keeper before you**: a ghost who turns up after fights across eight visits, remembers a little more each time,
  and finally goes up with you. Erin answers at the Hearth.
- **A personal quest for each keeper** (Will: the Lantern's missing piece; Erin: seeds that fell; Louie: the other
  scent; Marcus: Double or Nothing). Items only appear with that keeper in the party, in set chamber ranges; you
  bring each one home to a particular NPC; finishing gives that keeper +10 max health. Listed on the Board and on
  keeper select.
- **The story so far** on Codex page 6.
- **Will's canon, written in** (the facts are Will's; the words are Claude's):
  - **Marcus always has a new idea.** Every conversation with him opens "Bro. I got an idea." and gives a tip that
    sounds wrong and is right, picked from 22 to fit what has been going on (what killed you, Moondew you're
    hoarding, a super you never use...). It never repeats twice in a row. The death screen shows one too.
  - **Erin keeps seeing a hidden kingdom.** Seven visions, unlocked as you go deeper, told at the Hearth.
  - **The split, hinted, never named.** After your first escape (or the ghost's fourth visit) a still engine waits in
    chamber 10, THE CINDER CHOIR. Touch it in a quiet room and its light doubles: two identical lights, one goes
    down into the deep wide open, the other turns for the stairs and quietly shuts the doors that could hurt someone.
    Nobody explains it. Afterwards the twin lights sometimes cross the far wall of the Core, two relics in the Core
    show two jars with one label, and Erin's later visions see two lights at the gate. Online, it plays for everyone.
- `node test/lore.js` checks it all, including that every line fits its box.

## Moves

On top of the cartridge's attack / cast / dash, every keeper has four more verbs (`src/moves.js`). Every name
is the fighter's own (`src/knockout.js`); what each does here is this port's reading of it.

| | Special (cooldown) | Super (meter) | Heavy (hold attack) | Dash Strike |
| --- | --- | --- | --- | --- |
| WILL | **SELFIE FLASH** – stuns the room around him, wipes nearby shots | **BIKE LANE** – a bike tears across the room along his aim | SNEAKER KICK | STAGE DIVE |
| ERIN | **LEASH LASSO** – ropes a foe and hauls it to her, rooted | **SPROUT STAMPEDE** – six sprouts charge across the room | GARDEN KICK | FLYING FLOP |
| LOUIE | **ZOOM ZOOM ZOOM** – three snap-dashes through the pack | **JUDGEMENT** – a pillar lands four times on the biggest threat | CHOMP | ZOOM POUNCE |
| MARCUS | **DAB CLOUD** – a drifting cloud that dazes and chips | **BRO, I GOT AN IDEA** – six geysers march out in a line | PIPE WRENCH | CANNONBALL, BRO |

- The super meter fills from damage dealt and taken, is per keeper, and carries between chambers. Firing one
  freezes the room for a beat, pushes the camera in and calls the move out.
- Heavies ignore a Bubble Crab's shield and stagger. Specials and supers scale with cast boons and the Mirror.
- Marcus's fighter super is named HYDRO JET, which the cartridge already used for his cast, so the super goes
  by its fighter callout. Still unused from the fighter: Louie's TURBO ZOOM, Marcus's DOUBLE OR NOTHING, and
  everyone's launcher / sweep / throw.
- All of this is new power the cartridge never had, and foes were not buffed to match — expect runs to be
  easier until it is tuned.

## Story

`src/story.js` adds a story layer. **Almost all of its text is new writing, not canon handed over** — it is
built only on what the cartridge already says (the Lantern cracked downward, the gods are the sprouts grown
old, the Grub Mother is Thornback's mother, the Hollow Keeper wears and collects faces, keepers before came
back changed, "one day the roots will bloom instead of bite"). The cartridge's own lines are untouched and
still play as everyday chatter. Scout and Ranger only get errands and reactions, since they are placeholders.
Nothing from the Pocket Lantern story notes is used. It is all data: cut or rewrite freely.

- **22 missions** in chains from each NPC (Erin's is the main thread). An NPC with something new shows a
  yellow `!`; one with a finished errand shows a green `?`. The Keeper's Board by the Root Door lists them.
  Rewards are Moondew, keys, honey and a few sprouts.
- **37 conversations** that each play once, when the thing they are about has actually happened: first death,
  each boss met / lost to / beaten, reaching each biome, escapes, unlocking and playing as each keeper, first
  super, weapons, keepsakes, co-op, revives, the Pact, echoes. Other characters cut in.
- **18 echoes**: notes left by the keepers before, in three threads (one per biome), found as glowing pages
  after chambers and kept in a new Codex page. Read in order they explain what is at the bottom.
- **In the deep:** bosses speak on arrival, at each phase and on defeat, and what they say changes with how
  often you have met them; each god has lines that move on each time you take their boon; Erin, Marcus and
  Louie comment as playable keepers (Will stays silent, as in the intro); death and escape screens vary.
- **The Hearth changes:** the Lantern glows brighter with each escape, and finishing Erin's chain makes the
  floor flower.

## Online play

Title menu → PLAY ONLINE. One player picks HOST A GAME and goes to the Hearth as normal; anyone else with the
game page open sees "JOIN <NAME>'S GAME" in the same list, joins, and presses A to step into the party. Up to four
keepers total, any mix of couch and online, each on their own controller, keyboard or phone.

- It runs on the artifact page's `room` capability (`src/net.js`): no server, nothing to install. Friends must be
  signed in to claude.ai with the game shared to them (Share menu); outside claude.ai the menu says it's unavailable.
- The host's copy runs the game. Friends send their input and draw a snapshot the host streams ~15 times a second.
  Each friend's own keeper walks and dashes on their own screen immediately and the host takes that position, so
  movement isn't laggy; hits, enemies and menus arrive with a short delay.
- Runs count on the host's save. A friend's own save is untouched (it's set aside while they play online).
- A friend's pause menu only offers RESUME / BUILD / LEAVE THE PARTY. Friends leave by holding Select (Q / Esc),
  or holding START on a phone. The host stops from the title menu (STOP HOSTING) or QUIT TO TITLE.
- `node test/online.js` runs two real copies of the game through a stand-in for the room (with network delay;
  `NET_DELAY=160` for a slower link).

## Playtest fixes

Four blind reviewers played it (`reviews/`); `reviews/FINDINGS.md` lists their 81 findings and the fix log.
Things that now play differently from the cartridge, all because of that playtest: a boon door in chamber 1;
a boon + Fountain (marked BOSS AHEAD) before every boss; foes spawn away from you and take a beat to rise;
a contact hit buys a little more safety and boss bodies hit softer; deaths bank +2 Moondew per chamber cleared;
doors need a short stand in the doorway; a knocked-loose bud runs off as a pod you can catch. Settings gained
KEEPER'S GRACE (half damage, an extra revive) and AIM HELP. Co-op: menus belong to whoever opened them, seats
never renumber, you can drop in mid-run and leave from the Hearth or pause menu.

## Open questions for Will

- **Louie's signature is still THE BOOF**, lil Bottie's placeholder. The fighter in this repo
  (`src/knockout.js`) gives Louie ZOOM ZOOM ZOOM, TURBO ZOOM and the super JUDGEMENT. Not swapped
  without your say.
- Everyone carries the one equipped Armory weapon, and boons are one shared build. Per-keeper weapons
  or boons would be a bigger change.
- Balance for 2–4 keepers is first-guess numbers, not play-tuned.

## Layout

- `src/engine.js` – WebGL renderer: 240-line picture stretched soft, vertex lighting, fog, blob shadows
- `src/input.js` – pads, two keyboard layouts, touch; join / drop
- `src/data.js` – the cartridge's tables, verbatim
- `src/game.js` – the loop
- `src/moves.js` – specials, supers, heavies, dash strikes
- `src/fx.js` – combat effects: hit-stop, slow motion, trails, sparks, launches, death tumbles, combo counter
- `src/lore.js` – named chambers, relics, the ghost, keeper quests
- `src/net.js` – online play (host / join, input and snapshots over the page's room)
- `src/story.js` – missions, conversations, echoes, boss / god / keeper lines
- `src/models.js` – the cast, foes, bosses, sprouts, rooms, camera, scenes
- `src/anim.js` – character animation: jointed rigs, spring-driven poses, every action and NPC habit
- `src/ui.js` – HUD and every menu screen
- `src/main.js` – boot, frame loop, `window.__rd` test hooks (same spirit as `__g.RDF()`)

## Tests

Need Node + Playwright with Chromium.

- `node test/play.js` – plays the real build with real key presses: title → intro → Hearth → Root Door →
  keeper select (locked keeper refused) → fights chamber 1 through both waves → door → boon → pause →
  boss → co-op down and revive → wipe banks currency → escape. Its bot is slow on purpose.
- `node test/shots.js` – saves frames of every scene to `test/shots/`. Look at them before calling a
  visual change done.
- `node test/anim.js` – animation contact sheet: holds each action at a few moments for all four keepers and the
  Hearth NPCs, close up, into `test/shots/anim-*.png`.
- `node test/moves.js` – fires every keeper's special, super, heavy and dash strike with real key presses and
  checks they cost, land and clean up; saves a frame of each.
- `node test/story.js` – missions asked and turned in, conversations firing off real progress, echoes, boss and
  god lines, the ending; also checks every line of text fits its box.
- `node test/fixes.js` – one check per playtest fix (menu ownership, seats, doors, spawns, revives, boon text...).
- `node test/phone.js` – iPhone-sized touch viewports, portrait and landscape.

**Not yet verified:** a physical controller (no hardware here — the mapping follows the standard
Gamepad layout), real phones, and how any of it feels in human hands.
