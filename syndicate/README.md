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

## Controls

| Action | Keyboard / mouse | Touch | Xbox controller |
|---|---|---|---|
| Move | WASD or arrows (or click the ground outside fights) | left thumb stick, or tap the ground | left stick |
| Interact | E, or the gold button | the gold button, or tap a name tag | A |
| Aim | mouse | locks to opponent | right stick (auto-aims when centred) |
| Attack | left click (hold) | ATK | X or RT (hold) |
| Dodge | Space or right click | DODGE | A or LT |
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
- `js/crew.js` mortal blows, cosmetics, events and the Tally; `js/mark.js` the bookie and his games
- `js/cine.js` the opening cinematic; `js/lore.js` codex and bios; `js/music.js` the music sequencer
- `js/ui.js` menus, HUD, level-up and results screens; `js/main.js` input and main loop

## Shipping beyond the browser

It is a plain web app, so a Steam build is a desktop wrapper (Electron or Tauri) around this
folder, and phone store builds are a web-view wrapper (Capacitor). Not set up yet.

## Not in the slice yet

Authored character models and animation, more arenas, more classes and levels past 5,
multiclassing, recorded music or voice, cloud saves, typing a name with a controller.
