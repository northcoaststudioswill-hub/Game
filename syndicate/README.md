# Guttercrown (vertical slice)

A North Coast Studios game, with E Concepts.

*Working title was "Underground Syndicate"; the folder keeps the old name.*

An isometric one-on-one pit fighter with D&D-style class builds. Real-time action combat,
BG3-flavoured levelling, and a hideout you furnish and plant with your winnings.

**Play:** open `index.html` in a browser (no build step), or serve the folder with
`python3 -m http.server` and visit `http://localhost:8000`. It fills whatever window it is given:
phone portrait, phone landscape, or a desktop monitor.

## What is in the slice

- **True isometric 3D.** A fixed isometric camera over real geometry, with dynamic lights,
  shadows, torch flicker and spell light on the stone. Built on three.js (vendored in `lib/`).
- **Opening cinematic:** an in-engine intro (skippable) shot with a free camera: crane, orbit,
  whip-pan and dolly-zoom shots, plus a slow-motion montage of scripted bouts that use the real
  abilities (leaping slam, lightning and fireball, radiance, flurry of shadows). It sets up the
  Undercity, the Deep Guild's Blood Ledger, the champion and your debt. It plays when you start a new fighter and can be
  replayed from the title menu.
- **Three places you walk around:** the Lamp Market (a 30 by 18 tile plaza around the First Lamp,
  with the Pit gate, Notice Board, the Fence, the Guildmaster, Mark's gambling table, the Low
  Lamp tavern, your Hideout door, market stalls and townsfolk), the Blood Pit arena, and your
  Hideout.
- **Mark of the Long Odds:** the Undercity's bookie. Bet on three undercard bouts that are
  simulated while you fight (or back yourself), settled when your bout ends. He also runs High
  Bones (dice, with a press-your-luck re-throw) and Crown or Skull (a double-or-nothing coin
  streak). The house keeps about 8% of card payouts.
- **Character creation:** 5 origins x 4 classes (Fighter, Rogue, Sorcerer, Cleric), six
  ability scores that each do something in combat.
- **Real-time combat built around timing, not mashing:** swings and dodges cost stamina and a
  whiff leaves you stuck recovering. Three clean hits in rhythm end in a finisher. Hitting a
  fighter during their wind-up is a COUNTER, hitting them as they recover is a PUNISH. Opponents
  raise a guard against repeated basic attacks (two blocked swings and you are parried); a real
  ability breaks the guard and stuns them. A last-instant dodge is a PERFECT DODGE. Knockback into
  the pit wall does damage. Damage is rolled on real dice (1d8 + STR and so on), with crits, stuns,
  slows, burns, poison, wards, stealth and Sneak Attacks.
- **Parries, one per class:** Fighter Shield Block (widest window, staggers, reflects projectiles),
  Rogue Riposte (tightest, counter-stabs), Sorcerer Shield (hurls attackers away, reflects),
  Cleric Warding Flare (heals you, slows them). Better weapons and armour widen the window; a
  missed parry leaves you open.
- **Mortal Blows:** a win is a kill. Each class has a finishing move with its own close-up camera
  (Headsman's Verdict, Death of a Thousand Cuts, Disintegrate, Flame Strike), followed by gore,
  applause and coins from the crowd. Losing costs a fifth of your purse and nothing else.
- **Melee against ranged:** ranged attacks made with a foe in your face are at Disadvantage
  (slower, weaker), backing away is slow, melee dodges toward the foe travel further, and
  parries deflect or reflect projectiles.
- **Opponents play by the same rules:** they parry, guard, rest when winded, punish whiffs and
  failed parries, and will not swing into a raised parry.
- **Blood:** dark droplets, floor splats and gibs. Toggle it from the pause menu.
- **Builds:** level 2 ability choice, level 3 subclass (two per class), level 4 feat, level 5
  ultimate. More abilities than slots, so you choose a loadout.
- **The ladder:** five opponents ending in the Pit Champion.
- **Economy:** XP, coin and respect. A crowd-hype meter (land hits, dodge through attacks, vary
  your abilities) raises what you take home. Respect sets your syndicate rank.
- **Hideout room builder:** an 18 by 16 tile home with a two-room house and a cave garden.
  - A tabbed catalogue: furniture, garden, lights, wall pieces, and floors and walls.
  - 21 floor pieces that rotate four ways; rugs sit on their own layer so furniture can stand on them.
  - 7 wall-hung pieces (posters, sconces, crossed blades, a tapestry, your own portrait).
  - 5 house floors, 5 wall finishes and 3 garden grounds.
  - Tap a tile to walk there (pathfinding goes round furniture and through doorways); tap a piece
    to use, move, turn or store it. Beds, benches and tables can be sat or slept on, lamps and the
    fountain switch on and off, the dummy can be trained on, the bookshelf opens the Codex.
  - A comfort rating. Comfortable rooms draw visitors who wander about, comment, and leave coin
    after each of your bouts. Most pieces give a small
  perk; rank gates the better ones.
- **Music and sound:** procedural music per area (title, street, home, fight, champion) and synth
  sound effects, with no audio files.
- **The Guild Codex:** 21 lore entries on the world, the pit, the trades and the fighters, unsealed
  as you win and rank up. Read it at the Notice Board or from the character sheet. The same
  material is in `docs/LORE.md`.
- **The Tally:** each rank you hold brings one Tallyman, up to five. Send them on jobs that take
  a number of your bouts and resolve on a d20 roll (shakedowns, smuggling, grave-picking, rumour,
  sabotage, drilling). One can stand in your corner as your Second, called once per bout. Idle
  Tallymen hang around your hideout. Manage them at the Low Lamp.
- **Street events:** after a bout something may happen in the street, resolved with a d20 plus
  your ability modifier against a DC.
- **The Tailor's Rack:** 22 cosmetics across dyes, headgear, back pieces, weapon finishes and
  auras, and armour and weapon tiers that add real plates, spikes and gems to the model.
- **The Fence:** weapon and armour tiers (which change how your fighter looks) and potions.
- Progress saves in the browser.

**First meetings and friendly duels.** The first time you walk up to Mark, the Ledger-Keeper or the Fence, and the first time you face Vexa, the game cuts to a letterboxed dialogue scene with its own camera shots (wide, close, over the shoulder). Tap, click, Space or (A) advances; Skip or (B) skips. Mark's scene ends with an offer to duel: a non-lethal bout to the yield, no fee, no mortal blow. Beating him the first time wins Mark's Lucky Laurel. He will duel again for a stake from his menu.

**More of Mark's table.** The Rat Race (four rats, odds set by hidden speed), Three Cups (faster hands at higher stakes) and High Card (higher or lower, pot grows) join the undercard, High Bones and Crown or Skull.

**Menus.** A Settings panel (sound, music, blood, screen shake, text size, erase save), an objective line that always says what to do next, "!" badges on places with something new, and a coin change that floats off the purse.

**Fight effects.** Named moves call themselves out, blasts leave scorch marks and cracks on the floor, dashes leave afterimages, casts pull motes into the hands, heals spiral, and ultimates kick the camera.

**Cosmetics.** Fourteen more: four dyes, four hats and crowns, three back pieces, two weapon finishes and three auras.

**Mark's business.** Mark always has a scheme (glowcap futures, a cart that has not fallen yet, commemorative Guild seals). Buy in with coin and he reports back after a bout or two: sometimes it pays, sometimes he pays you in **chits**, his own credit. Chits are spent before coin at every one of his games, and his Chit Rack sells five cosmetics for nothing else.

**The Wisp Table.** A dice booth on the east side of the market with five floating dice made of light. Three games: Thirteen and Twenty-One (roll one die at a time, stand, then Mark has to chase your total; a dead-on total pays triple) and Poker Bones (five dice, hold and reroll once, best hand wins).

**A livelier market and pit.** Rats, bats, washing lines, a busker, a cat, steam grates, puddle ripples, gate guards and two punters arguing about odds in the market. The pit gains a Guild box above the gate, hanging gibbets, eyes behind the bars, Mark's odds board, pennants and torches in the stands, and petals and coin thrown at high crowd hype.

**Mortal blows.** Three per class now, the second and third taught as your rank rises (Through the Wall, Earthbreaker, The Quiet Word, Rain of Knives, Meteor Swarm, Chain Lightning, Banishing Smite, Power Word Kill). Pick one on the character sheet or leave it to the crowd.

**Deeds and the Mirror.** Ten deeds (parries, perfect dodges, wall slams, flawless wins, taking the crown and so on) each unlock a cosmetic that coin cannot buy. The Mirror, behind the Tailor's rack, changes hair, skin, build and name for free.

**Fight animation.** A combat stance, a salute before the bell, a real parry pose, a thrown release on spells, a lunge on dashes, heavy breathing at low health and a cheer when the other fighter is down.

**Market layout.** Brick walls, wood grain, bout posters and damp. Worn paths mark the main routes, every usable spot has a coloured ring on the ground, and bystanders were moved out of the lanes.

**The catalogue.** The furniture catalogue is laid out like a hotel-builder's: pages down the side, a grid of pictured tiles (each piece rendered from the room's own angle, with price and owned count), and a preview pane with details and the buy button. Double-tap a tile to buy straight away.

**Weight and gore.** Fighters have momentum, every clean hit shoves and holds the frame, and heavy blows knock the victim flat. A badly hurt opponent can lose an arm (below half health, they hit 15% softer) and then a leg (below about a fifth, they hobble at 60% speed). The limb is thrown, the stump bleeds, time slows for a moment and the crowd roars. The Blood setting turns it off.

**Heavy, tactical combat.** Basic attacks are slower and cost more stamina, and holding the button no longer repeats them. Tap to strike; hold and release for a heavy blow that cannot be knocked out of and breaks a guard. Hold parry past its window to block (it costs stamina per blow). Every fighter has a posture bar: blows, blocks and parries wear it down, and when it breaks they reel, wide open and taking 35% more. Spend your last stamina and you are winded: slower and softer for a moment.

**Weapons.** The Armoury at the Fence sells class weapons that change reach, speed, sweep and posture damage: Pit Spear, Greataxe and Warhammer for the Fighter; Rapier and Hand Axes for the Rogue; Frost Shard and Arc Spark for the Sorcerer; Flail and War Pick for the Cleric. Two per class cost coin and rank, one is earned by a deed.

**The realm above.** Queen Eerin Koheneim and her husband Vilhelm van Koheneim IV rule from Highmarch with an iron grip, and the Undercity flourishes because they allow it. The intro opens in their throne room. In the market, the Long Stair stands sealed behind two Seal-Wardens: read the throne's latest proclamation there (a new one after every bout) and pay the Crown's tithe in person for respect. Three street events involve the Wardens, the tithe cart and a man in a plain cloak, and a hooded figure watches the champion's bout from the Guild box.

**Pit contracts and streaks.** The Notice Board posts three contracts at a time (parry four blows, take two limbs, win without a scratch and so on). Take one, do it in the pit, and it pays coin and respect on the results screen. Every win in a row adds 5% to the purse, up to 25%.

**Finer fighting.** A parry opens a riposte: your next blow within a moment hits 30% harder. Two blows of the same weight meeting edge to edge clash, and both fighters recoil. A blow from behind is a flank for 20% more.

**Intro and backdrop.** The intro now shows the market at work (Mark's table, the Wardens at the Long Stair) and a "Blood" sequence in the pit with limbs coming off. The market sits above a lower city of roofs and lit windows instead of a black void, and the whole view has a soft vignette.

**Readability and record.** Opponents carry their own weapons (flail, frost, warhammer, rapier). An enemy heavy blow is flagged with a red flash and a mark as it starts. A fighter whose posture breaks drops to one knee. The results card lists what happened in the bout (parries, limbs, postures broken), and the Notice Board keeps your running page in the Ledger.

**Kits, mastery and techniques.** The Outfitter (at the Fence) sells eight armour kits with real trade-offs, from Beggar's Rags (frail, but the crowd pays more) to Guild Plate (hard to hurt, hard to move). Every weapon gains mastery from use: five ranks, +3% damage each, and reaching rank 3 with any weapon unlocks a fourth weapon for your class (halberd, weighted chain, Acid Splash, pilgrim's staff). On your sheet, "Learn techniques" sells extra abilities: a cantrip and a trap for each class, plus the level-2 choice you passed over.

**Traps.** Caltrops, Bear Trap, Glyph of Warding and Guardian Sigil are laid where you stand, wait up to 18 seconds, and spring when the opponent steps in.

**Moments.** Scenes find you between bouts: the Ledger-Keeper strikes your first line; Ferren Voss, last season's "new name", challenges you to friendly duels; Mark gets leaned on by Guild collectors and you choose whether to pay, fight or walk; later he offers you a tenth of the Long Odds; and after Brakk falls, Vilhelm van Koheneim IV is waiting in the empty pit.

**Mark's loyalty.** Every stake counts toward a tier (Punter, Regular, High Roller, Friend of the House) that returns 4 to 10% of each stake in chits. Partners are paid a cut after every bout.

**Home.** Seven new pieces: a wardrobe (opens the Tailor), an armour stand (opens the Outfitter), a strongbox (coin inside is safe from the stretcher fee), a dice table (play the wispdice at home), a statuette of the Queen, a cave-bear skin and a washtub. The catalogue has a "Useful" page listing everything you can interact with.

**Tighter controls.** Quicker player acceleration, a shorter heavy charge (0.28s), a light blow can be cancelled into a dodge during the first half of its wind-up, and the mouse aim snaps to a close opponent on a near miss. Thrusting weapons thrust; heavy weapons swing overhead.

**A working market.** The stalls sell an edge for your next bout: Ysolde Quill's tonics (less damage, more speed, more damage, more posture), Big Hobb's meals (health, stamina, stronger potions), Maelis Vane's charms (permanent, wear one), and Whisper, who scouts your next opponent for 10% more damage against them. The busker puts your name in a song so the crowd starts warm, and the beggars' fire gives a small gift once per bout. 

**Casters against steel.** A Fighter moves at near full speed behind a raised shield, and a bolt on the shield costs little stamina and no posture. Enemy casters give ground more slowly, stop retreating when spent, and are at a disadvantage from further out. Sorcerers start with Shocking Grasp and have a wider parry.

**The Ledger never closes.** After you take the crown, challengers keep coming in order, generated by class, weapon and technique, each tougher than the last (every fifth is an elite). Three more ranks sit above Pit Legend, and kits are priced for that longer career: Guild Plate needs Pit Legend and 750 coin, the Warden's Harness needs Crownbearer and 1,300.

**A short dodge.** The long roll is now a heavy sidestep: about 2 to 3 strides in a quarter of a second, with a shorter untouchable window and a lower stamina cost.

**A bigger market.** The Lamp Market is four tiles wider and deeper, with the stalls, well, cart, fire and Wisp Table spread into the new space. Stall roofs and Mark's awning are lean-tos set behind the keeper, so the people and tables stand in the open. Nothing turns transparent.

## Next work

Planning for the next round (fight-to-death with the Oracle of Time, Druid and Tiefling, more finishers, gear sets, progression, animation, controller testing) is in `docs/NEXT.md`. Nothing in it is built yet.

**Death and the Oracle of Time.** A lost bout is a death: your purse, your streak and some respect go with you, and coin in a strongbox is safe. David Roseinbeirg, the Oracle of Time, brings you back every time and adds a soul to your debt. He offers a contract at your first death, and has not told you everything about it. While you owe him three souls or more he takes a cut of every purse; his cellar in the market sells souls back and grants favours, starting with Borrowed Time (survive one killing blow per bout, on account).

**The golden cellar.** David's cellar is a real room now: gold floor and walls, coin piles, a great hourglass, clocks that all tell different times, and his seal (an hourglass in a ring) on the wall and floor. It is hidden under the market and opens only for you. When he comes to bring you back, he arrives in a shaft of gold light with the seal turning on the sand.

## Controls

| Action | Keyboard / mouse | Touch | Xbox controller |
|---|---|---|---|
| Move | WASD or arrows (or click the ground outside fights) | left thumb stick, or tap the ground | left stick |
| Interact | E, or the gold button | the gold button, or tap a name tag | A |
| Aim | mouse | locks to opponent | right stick (auto-aims when centred) |
| Strike | left click (tap) | ATK (tap) | X or RT (tap) |
| Heavy blow | hold left click, release | hold ATK, release | hold X or RT, release |
| Parry, then block | Shift, X or right click (hold to keep blocking) | PARRY (hold) | LT (hold) |
| Dodge | Space | DODGE | A |
| Abilities | Q, E, R | ability buttons | LB, RB, Y |
| Ultimate | F | ability button | B |
| Potion | C | potion button | D-pad up |
| Pause | Esc | Pause | Menu |

With a controller, menus use the D-pad or left stick to move, A to select and B to go back. In the hideout, Y opens Decorate; while placing, the D-pad moves the piece, X rotates, A places and B cancels. Any pad the browser reports with the standard layout works the same way.

## Art direction

`docs/Art_Direction_Handoff.docx` is the brief and `docs/concept/` holds its concept images
(mood reference only; the game does not draw them). Characters are chunky low-poly "tabletop
miniature" models built in code from primitives and animated procedurally. They are the first
thing a 3D artist would replace: swap `G.makeChar` in `js/models.js` for loaded rigged models
and the rest of the game does not change.

## Files

- `js/data.js` classes, abilities, opponents, ranks, decor, gear (all tuning lives here)
- `js/core.js` dice, save, audio synth, derived stats
- `js/gfx.js` renderer, isometric camera, procedural textures, particles
- `js/models.js` character models and animation
- `js/world.js` the arena; `js/places.js` the street, the hideout, decor pieces, walking
- `js/fight.js` combat simulation, AI, and its 3D effects
- `js/crew.js` mortal blows, cosmetics, events and the Tally; `js/mark.js`, `js/mark2.js`, `js/mark3.js` the bookie, his games, schemes, chits and the Wisp Table; `js/meet.js` cutscenes and duels; `js/life.js` ambient detail for the market and pit; `js/deeds.js` extra mortal blows, deeds and the Mirror; `js/arms.js` combat tempo, heavy blows, weapons and the Armoury; `js/realm.js` the Long Stair, proclamations, tithe and throne events; `js/board.js` pit contracts and win streaks; `js/kits.js` kits, mastery, extra weapons and techniques; `js/story.js` story scenes, Mark's loyalty and partnership, the strongbox; `js/home.js` new hideout pieces; `js/market.js` stalls, boons and charms; `js/ledger.js` endless challengers, extra ranks and kit pricing
- `js/cine.js` the opening cinematic; `js/lore.js` codex and bios; `js/music.js` the music sequencer
- `js/ui.js` menus, HUD, level-up and results screens; `js/main.js` input and main loop

## Shipping beyond the browser

It is a plain web app, so a Steam build is a desktop wrapper (Electron or Tauri) around this
folder, and phone store builds are a web-view wrapper (Capacitor). Not set up yet.

## Not in the slice yet

Authored character models and animation, more arenas, more classes and levels past 5,
multiclassing, recorded music or voice, cloud saves, typing a name with a controller.

## The long climb (`js/climb.js`)

- **Undercard.** Each of the five named fighters must be earned by winning undercard bouts first: 2, 3, 3, 4 and 4. Undercard fighters are generated, a little weaker than the name they lead to, and can be fought again for smaller purses.
- **Ten levels.** Levels 1 to 5 as before. Level 6 and 9: two ability points to place. Level 7: a technique. Level 8: a second feat. Level 10: a capstone.
- **Doors open as you earn them.** First win: Notice Board, Big Hobb's Pot. Scrapper: the Tally, the Apothecary. Bloodied: Mark, the Wisp Table, the Armoury, the Tailor. Enforcer: the Outfitter, charms, Whisper, teachers. Underboss: the Crown's tithe. A shut door says what it needs; the first visit explains the system and writes it into the Codex.
- **Old saves** keep everything their rank already opens, and pick the ladder up at the undercard of their next unbeaten name.
