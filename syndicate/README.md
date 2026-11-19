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
  with the Pit gate, Notice Board, the Fence, the Guildmaster, Marc's gambling table, the Low
  Lamp tavern, your Hideout door, market stalls and townsfolk), the Blood Pit arena, and your
  Hideout.
- **Marc of the Long Odds:** the Undercity's bookie. Bet on three undercard bouts that are
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

**First meetings and friendly duels.** The first time you walk up to Marc, the Ledger-Keeper or the Fence, and the first time you face Vexa, the game cuts to a letterboxed dialogue scene with its own camera shots (wide, close, over the shoulder). Tap, click, Space or (A) advances; Skip or (B) skips. Marc's scene ends with an offer to duel: a non-lethal bout to the yield, no fee, no mortal blow. Beating him the first time wins Marc's Lucky Laurel. He will duel again for a stake from his menu.

**More of Marc's table.** The Rat Race (four rats, odds set by hidden speed), Three Cups (faster hands at higher stakes) and High Card (higher or lower, pot grows) join the undercard, High Bones and Crown or Skull.

**Menus.** A Settings panel (sound, music, blood, screen shake, text size, erase save), an objective line that always says what to do next, "!" badges on places with something new, and a coin change that floats off the purse.

**Fight effects.** Named moves call themselves out, blasts leave scorch marks and cracks on the floor, dashes leave afterimages, casts pull motes into the hands, heals spiral, and ultimates kick the camera.

**Cosmetics.** Fourteen more: four dyes, four hats and crowns, three back pieces, two weapon finishes and three auras.

**Marc's business.** Marc always has a scheme (glowcap futures, a cart that has not fallen yet, commemorative Guild seals). Buy in with coin and he reports back after a bout or two: sometimes it pays, sometimes he pays you in **chits**, his own credit. Chits are spent before coin at every one of his games, and his Chit Rack sells five cosmetics for nothing else.

**The Wisp Table.** A dice booth on the east side of the market with five floating dice made of light. Three games: Thirteen and Twenty-One (roll one die at a time, stand, then Marc has to chase your total; a dead-on total pays triple) and Poker Bones (five dice, hold and reroll once, best hand wins).

**A livelier market and pit.** Rats, bats, washing lines, a busker, a cat, steam grates, puddle ripples, gate guards and two punters arguing about odds in the market. The pit gains a Guild box above the gate, hanging gibbets, eyes behind the bars, Marc's odds board, pennants and torches in the stands, and petals and coin thrown at high crowd hype.

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

**Intro and backdrop.** The intro now shows the market at work (Marc's table, the Wardens at the Long Stair) and a "Blood" sequence in the pit with limbs coming off. The market sits above a lower city of roofs and lit windows instead of a black void, and the whole view has a soft vignette.

**Readability and record.** Opponents carry their own weapons (flail, frost, warhammer, rapier). An enemy heavy blow is flagged with a red flash and a mark as it starts. A fighter whose posture breaks drops to one knee. The results card lists what happened in the bout (parries, limbs, postures broken), and the Notice Board keeps your running page in the Ledger.

**Kits, mastery and techniques.** The Outfitter (at the Fence) sells eight armour kits with real trade-offs, from Beggar's Rags (frail, but the crowd pays more) to Guild Plate (hard to hurt, hard to move). Every weapon gains mastery from use: five ranks, +3% damage each, and reaching rank 3 with any weapon unlocks a fourth weapon for your class (halberd, weighted chain, Acid Splash, pilgrim's staff). On your sheet, "Learn techniques" sells extra abilities: a cantrip and a trap for each class, plus the level-2 choice you passed over.

**Traps.** Caltrops, Bear Trap, Glyph of Warding and Guardian Sigil are laid where you stand, wait up to 18 seconds, and spring when the opponent steps in.

**Moments.** Scenes find you between bouts: the Ledger-Keeper strikes your first line; Ferren Voss, last season's "new name", challenges you to friendly duels; Marc gets leaned on by Guild collectors and you choose whether to pay, fight or walk; later he offers you a tenth of the Long Odds; and after Brakk falls, Vilhelm van Koheneim IV is waiting in the empty pit.

**Marc's loyalty.** Every stake counts toward a tier (Punter, Regular, High Roller, Friend of the House) that returns 4 to 10% of each stake in chits. Partners are paid a cut after every bout.

**Home.** Seven new pieces: a wardrobe (opens the Tailor), an armour stand (opens the Outfitter), a strongbox (coin inside is safe from the stretcher fee), a dice table (play the wispdice at home), a statuette of the Queen, a cave-bear skin and a washtub. The catalogue has a "Useful" page listing everything you can interact with.

**Tighter controls.** Quicker player acceleration, a shorter heavy charge (0.28s), a light blow can be cancelled into a dodge during the first half of its wind-up, and the mouse aim snaps to a close opponent on a near miss. Thrusting weapons thrust; heavy weapons swing overhead.

**A working market.** The stalls sell an edge for your next bout: Ysolde Quill's tonics (less damage, more speed, more damage, more posture), Big Hobb's meals (health, stamina, stronger potions), Maelis Vane's charms (permanent, wear one), and Whisper, who scouts your next opponent for 10% more damage against them. The busker puts your name in a song so the crowd starts warm, and the beggars' fire gives a small gift once per bout. 

**Casters against steel.** A Fighter moves at near full speed behind a raised shield, and a bolt on the shield costs little stamina and no posture. Enemy casters give ground more slowly, stop retreating when spent, and are at a disadvantage from further out. Sorcerers start with Shocking Grasp and have a wider parry.

**The Ledger never closes.** After you take the crown, challengers keep coming in order, generated by class, weapon and technique, each tougher than the last (every fifth is an elite). Three more ranks sit above Pit Legend, and kits are priced for that longer career: Guild Plate needs Pit Legend and 750 coin, the Warden's Harness needs Crownbearer and 1,300.

**A short dodge.** The long roll is now a heavy sidestep: about 2 to 3 strides in a quarter of a second, with a shorter untouchable window and a lower stamina cost.

**A bigger market.** The Lamp Market is four tiles wider and deeper, with the stalls, well, cart, fire and Wisp Table spread into the new space. Stall roofs and Marc's awning are lean-tos set behind the keeper, so the people and tables stand in the open. Nothing turns transparent.

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
- `js/crew.js` mortal blows, cosmetics, events and the Tally; `js/mark.js`, `js/mark2.js`, `js/mark3.js` the bookie, his games, schemes, chits and the Wisp Table; `js/meet.js` cutscenes and duels; `js/life.js` ambient detail for the market and pit; `js/deeds.js` extra mortal blows, deeds and the Mirror; `js/arms.js` combat tempo, heavy blows, weapons and the Armoury; `js/realm.js` the Long Stair, proclamations, tithe and throne events; `js/board.js` pit contracts and win streaks; `js/kits.js` kits, mastery, extra weapons and techniques; `js/story.js` story scenes, Marc's loyalty and partnership, the strongbox; `js/home.js` new hideout pieces; `js/market.js` stalls, boons and charms; `js/ledger.js` endless challengers, extra ranks and kit pricing
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
- **Doors open as you earn them.** First win: Notice Board, Big Hobb's Pot. Scrapper: the Tally, the Apothecary. Bloodied: Marc, the Wisp Table, the Armoury, the Tailor. Enforcer: the Outfitter, charms, Whisper, teachers. Underboss: the Crown's tithe. A shut door says what it needs; the first visit explains the system and writes it into the Codex.
- **Old saves** keep everything their rank already opens, and pick the ladder up at the undercard of their next unbeaten name.

## The Oracle's work (`js/raid.js`)

- **Expeditions.** Once you have signed David's contract (or been bound by your third death), three gold-marked jobs appear at the Low Lamp: rob a wizard-gold caravan, harry the tribes for ransom, burn a village. They resolve like other Tally jobs, by bouts and a d20.
- **Wizard gold** clears one soul each in his cellar. Owing nothing while his work goes on earns his favour: +8% damage and +8% coin.
- **Heat** (0 to 10) is the cost. Stalls charge more, the Seal-Wardens fine you on the road home, and somebody you wronged can buy a line on the Ledger: a grudge bout you must answer before the next named fighter. Heat cools by one every three bouts.

## Frame rate (`js/gfx.js`, `js/perf.js`)

The renderer caps resolution at 1.5x, redraws the shadow map every other frame, and lowers its resolution by itself if frames stay slow (and raises it again if they recover). Small props do not cast shadows, menus have no backdrop blur, and the world behind a full menu is drawn at half rate. Settings has a **Performance mode** that forces the low tier.

## Gear, sets and builds (`js/gear.js`)

- **Rungs.** Kits run Junk, Common, Good, Fine, Awesome. Each kit adds its own pieces to the character model (straps, mail skirt, pauldrons, cloak, crown) as well as its colours.
- **Sets.** Each kit names a weapon (per class) and a charm. Wear all three for the set bonus; the Outfitter shows what is missing.
- **Earned pieces.** Raider's Ashcloak (three expeditions), Hourglass Regalia and the Roseinbeirg Sandglass (wizard gold, from David), Crownbearer's Mail and the Shard of the Guttercrown (after the crown).
- **Builds.** The Guildmaster's sheet has three pages to save and recall weapon, kit, charm and technique loadout.
- **Bodies.** Dwarves are short and broad, elves slim, half-orcs wide, tieflings have a tail.

## A home that works (`js/home2.js`)

- **Once between bouts:** sleep in the bed (+4% to +15% XP next bout, by comfort), train on the dummy (+10 weapon mastery), cook on the stove (+6% health next bout). The cauldron gives a free potion every second bout.
- **Always on:** desk and map table each add +1 to Tally rolls; the trophy case adds +2% respect per named fighter beaten; the Hourglass Shrine takes a quarter off buying back a soul.
- **Regulars.** The Apothecary and Big Hobb count your purchases: 3 for 10% off, 8 for 20% off, 15 for a free one after every bout.

## Preparation (`js/prep.js`)

- **The card before a bout** lists what you are walking in with: tonic, meal, song, scouted, rested, set, charm, contract, Second, potions, Borrowed Time. Empty lines name the stall or room that fills them. The controls reminder drops off the card after three bouts.
- **Whisper** scouts whoever you will actually meet next (undercard, named fighter or challenger). Five purchases and a scouted fighter takes 15% more from you instead of 10%.
- **The Busker:** five requests and your song starts the crowd hotter.
- **Wizard gold** also buys Gilded Edge (+4% damage for good, three times) and takes three heat off your name.
- **If you never die,** David sends for you at Enforcer: a clock starts ticking over the hatch, and he makes his offer in person.
- The five named fighters hit harder and last longer than their undercards; they are meant to be met prepared.

## Druid, Warlock and Drow (`js/classes.js`)

- **Druid** (Wisdom, resource Wild). Shapes are abilities: Tunnel Wolf to start; Cave Bear or Pit Spider at level 2; Great Bat with Circle of the Fang; The Old Bear Wakes as the ultimate. A shape replaces your model and basic attack for 8 to 12 seconds, then you change back winded. Weapons: Thornwood Staff, Stalactite Spear, Thorn Whip, Root Maul.
- **Warlock** (Charisma, resource Pact). Hex, Step Through the Dark, Arms of the Deep, Cause Fear; Pact of the Fiend or of the Deep Dweller; The Bargain Called In. Weapons: Eldritch Blast, Grave Chill, Gnawing Dark, Witch Bolt.
- **Drow** race: +2 Dexterity, +1 Charisma.
- New kits Moss-Hide Mantle and Robes of the Low Pact, each with a set. Every existing set accepts the new classes' weapons.
- **Loadout.** You carry three techniques and one ultimate. Everything else you learn stays on your list; the Guildmaster's sheet swaps what is in the three slots. Feats and subclass passives are always on and take no slot.

## The crowd and the arsenal (`js/crowd.js`, fight engine)

- **Taunt** (G, D-pad down, or the TAUNT touch button): 0.9s of showing off for crowd hype, more if the opponent is staggered. Get hit during it and you take 25% more and the crowd turns. Opponents taunt too; hitting them mid-taunt pays you.
- **Frenzy.** Fill the crowd meter and the pit erupts for 6 seconds: +15% damage, faster resource recovery, coin thrown from the stands. The meter then settles and can be filled again.
- **More ways to raise it:** severing a limb, four different moves inside eight seconds (Showman), landing blows under 20% health (Last Breath).
- **Mortal blows:** five per class, earned at ranks 0 to 4. Some behead, some leave nothing.
- **Weapons:** five per class (30). Fifth weapons cost 480 at Underboss.

## Balance pass (`js/tune.js`, `docs/BALANCE.md`)

Weapons, classes and level-up choices were simulated and the outliers adjusted; the details are in `docs/BALANCE.md`. Also added: a **third technique to choose from at level 2** for every class, and **signature blows**: at mastery 5 a weapon's heavy blow gains an effect by family (stun, throw, double strike, slow, overcharge). The Armoury shows each one.

## The Long Stair and the ending (`js/ascent.js`)

- With the crown and two challengers turned away (five if you never dealt with David), the gate at the Long Stair opens: the Warden Captain, then Vilhelm van Koheneim IV, then Queen Eerin Koheneim.
- Four endings depending on soul debt, burned villages and whether you ever signed. You keep playing afterwards.
- **Tiefling spirits:** taunting calls a hellhound (damage), ember cat (speed and a moment untouchable) or carrion crow (marks the foe). Choose on the Guildmaster's sheet.
- The Outfitter's set box now has buttons that take you to the missing weapon or charm.

## Race and class flavour (`js/flavor.js`)

The Fence, Marc, the Apothecary, Big Hobb, the charm seller, Whisper and the Busker each have a line for every race and every class, shown about half the time you visit. The Ledger-Keeper comments on your trade or blood on the character sheet, opponents remark on what you are before a bout (the five named fighters have their own lines for particular classes and races), the crowd's reaction after a win depends on your class, David has a line for each class, and the Queen has extra words for elves, drow and druids.

## World and voice (`js/flavor2.js`)

- **Your page.** Every race and class pairing has an origin written on the character sheet and in the Codex; twelve pairings have an extra line of their own.
- **First meetings** with the Fence, the Ledger-Keeper and Marc now include an exchange about your class, your reply in your class's voice, and a remark on your race.
- **Your voice.** A retort by class on the card before each bout.
- **David** insults your trade or your people when it gets you killed.
- **Rumours** at the Beggars' Fire start to be about you, and the Wardens at the Long Stair react to your race.
- **Codex:** a new section, The Nine Levels, with where each people lives and where each trade comes from, plus Eireania, the Seal-Wardens and the First Lamp.

## Cleanup and more voice (`js/flavor3.js`)

- **Removed dead code:** the original ladder, catalogue and placement functions in `ui.js` and the ladder wrapper in `ledger.js`, all fully replaced by later files (about 70 lines). The crowd meter label is looked up once instead of every frame.
- **More personalised dialogue:** your Tally addresses you by a title for your class; each named fighter has last words (with special ones for some classes and races); the Ledger-Keeper notes your level-ups by class; the Outfitter and Tailor fit you by race; a death gets an epitaph by class or race; the Warden Captain, the King and the Queen each remark on your trade or people.

## Guidance, conversations and readability (`js/guide.js`)

- **The line at the top** now leads with what is new (a stall that has just opened, with where it is and what it is for), then tips (empty hideout, people to talk to, souls owed, what the next rank opens), then the next fight.
- **Pip Tallow's tour:** offered on first arrival; five stops covering the pit, the Fence and Guildmaster, your hideout and how respect opens the market. Pip stays in the market to ask again.
- **People to talk to:** Old Marrow Tibb, Sergeant Ysolde Carr, Ilvaren of the Hanging Markets and Pip, each with topics and a greeting that depends on your race or class. David has a **Talk to him** button in his cellar with seven topics.
- **What your home does:** tap the Comfort sign in your hideout for a list of every working piece, whether it is ready, and what is worth buying.
- **Keys and pad:** ability names sit under the buttons, with a legend for strike, heavy blow, taunt and aim. The phone layout is unchanged.
- **Gore and animation:** wounds appear on a fighter's body as health drops and stay; a badly hurt fighter drips and leaves a trail, holds the wound and limps; heavy critical hits knock chunks loose; each class has its own victory pose.

## Hold to skip, and flashier endings

- **The intro is skipped by holding:** hold the Skip button on a phone, hold (A) or Start on a controller, or hold Space, Enter or Esc, for about a second. A progress bar fills on the button; letting go resets it. A single tap or click no longer skips.
- **Seven mortal blows per class (42).** The twelve new ones use the fighters' bodies: a beheading where the headless body stands, and you boot it across the sand; a trip and a stomp; a body thrown the width of the pit; cut in two halves; taken apart limb by limb in the air; frozen and shattered; folded down to nothing. New poses: kick, stomp, hoist.
- Existing beheadings now leave the body standing for a moment before it topples. The finisher camera is closer, with a flash on the killing blow.

## Crawling, and the gear race (`js/armsrace.js`, fight engine)

- **Dismemberment goes further.** Heavy blows take the off-hand arm under half health, one leg under a third, and the other leg under a fifth. With both legs gone an opponent crawls: slow, unable to dodge, hitting for less, leaving a trail. Only opponents can be dismembered.
- **Five grades of steel and armour** at the Fence, and every opponent is equipped for their place on the Ledger. The pre-fight card compares theirs with yours; fall two grades behind and the top line tells you what to buy.

## Marc, a home that earns, and a third balance pass (`js/tune2.js`)

- **Marc.** The gambler is now Marc; cutscenes give his full name, Marc dé Fleuprau.
- **Furniture that earns:** Copper Still (12 coin a bout), Lodger's Cot (20 coin a bout), Marc's Rat Cages (10 chits a bout for his table). The results card shows what your home earned.
- **Mashing no longer works:** see `docs/BALANCE.md`.

## Latest pass: a tidier market and cleaner scenes

- Market names only appear when you walk near something. Far-off places show a small marker only if they need you, and the place your objective points at pulses.
- Locked places show nothing until you earn them.
- Pip Tallow runs up to you the moment you arrive and starts the tour himself. The objective no longer sends you to the pit first.
- Opening film: tap (A / Space / touch) for the next shot, hold to skip the whole film.
- Dialogue scenes: cameras keep clear of shoulders and helmets, the pit has a proper wall behind you in close-ups, and scene changes dip through black instead of popping.

## Latest pass: moves with their own shape

- Named techniques no longer share one swing. Shield Bash drives in shield-first, Sweeping Cleave is a full-body spin, Holy Strike is a leaping smite that lands on one knee, Death Mark is a reverse-grip stab, Poisoned Blade is a low crouching cut, Riposte is a fencer's thrust.
- Heavy blows are overhead chops (or a deep driving lunge for pointed weapons); signature blows are a rising uppercut, a spin or a drive depending on the weapon.
- Castings have eight stances: a burst from the chest, a call from above, a blessing, a two-handed cone, a breath, a planted trap, a throw, and a bracing flex.
- Blade wakes follow the cut: diagonal for combo strokes, vertical for chops and smites, a full ring for spins, low for low cuts, a hard line for thrusts.

## Latest pass: a nine-name ladder, the dead stay dead, and bouts you can watch

- **Nine names** stand between you and the crown. Four are new: Dolly Two-Teeth, Ansel Vane, Old Sallow and Iron Beatrix. Purses are a little smaller each so the climb ends at about the same level as before. Old saves keep their place.
- **Nobody you kill fights again.** Rematches are gone. The undercard and the challengers after the crown are generated fresh, so there is always somebody new.
- **The undercard is explained** on the Ledger, with tonight's card listed by name: who you have put down, who is next, who is waiting.
- **Watch your bets.** Put money on a bout on Marc's card and you can go to the rail and watch it fought. The result of the fight you watch settles the bet.
- **Exhibitions.** After a real bout somebody may find you in the market with an offer: a bout to the yield, for respect, coin or XP. Eight kinds. Nobody dies and nothing goes in the Ledger.
- Market names are back on at all times, small from a distance and full size up close. Shut shops are shown with a lock and still turn you away with a line.
- Dice-roll results are readable now. New lore in the codex and new things for the townsfolk to say.

## Latest pass: the pit joins in

- **Spike walls.** The four racks on the pit walls now point into the sand. Knock someone into one and they are impaled: more damage and a longer stagger than bare stone. It works on you too.
- **The pit itself.** Now and then somebody in the stands throws a bottle, or a floor grate vents fire. Both are telegraphed by a ring on the ground, both can be dodged, and neither can land the killing blow. Rowdiest on the low cards, rare near the top, never on the Long Stair.
- **Bodies keep their distance.** Fighters hold a shoulder's width apart and ease out of each other instead of popping; lunges stop at contact; an interrupted spin unwinds instead of snapping.
- **The lower cards never close.** Every name you have killed leaves a "Lower card" button: a fresh fighter from that tier, at that tier's level, for a small purse.
- **The Fallen.** The Guildmaster keeps a tally of every name you have put in the sand, newest first.

## Latest pass: fight polish

Found with a frame-by-frame detector that flags any joint, facing or position that jumps between two frames of a real bout.

- Joints move at a capped speed and ease by time, so nothing snaps when a blow is interrupted, a hit lands or a dodge ends. Dodge and the fall use the same joints as everything else.
- A missed blow no longer replays its swing during the longer recovery. Blows hold where they landed for a beat before coming back. Quick blows draw back less.
- Spins turn through the whole blow. Facing turns at a real rate. A fighter killed while already down stays down.
- The kill is filmed from the side, with a smoothed camera and a wall behind it on the open side. From range, the killer crosses the sand instead of appearing beside the body.
- Fighters stay off the kerbs and braziers. The open side of the pit has a floor instead of a void.
- Hit flash is a warm tint, not a white silhouette. Dash trails are a thin line and wake. The kill flash is dimmer. Combat words stack instead of overprinting.

## Latest pass: the Hour Garden

Refusing David's contract now has teeth. Die unsigned and he does not carry you back: he opens a door on a walled garden in blossom and puts you in with ten souls. They come one at a time, your wounds carry over, and you get a little breath back between them. Survive all ten and you wake in the pit. Die in the garden and the game is over: the save is erased. You can still sign at the garden door instead. He no longer binds you automatically on a third death.
