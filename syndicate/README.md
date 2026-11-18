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
- **Three places you walk around:** the Undercity street (the Pit gate, the Fence, the
  Guildmaster, your Hideout door), the Blood Pit arena, and your Hideout.
- **Character creation:** 5 origins x 4 classes (Fighter, Rogue, Sorcerer, Cleric), six
  ability scores that each do something in combat.
- **Real-time combat:** move, aim, attack, dodge with invulnerability frames, three ability
  slots, an ultimate, potions. Enemy attacks telegraph on the floor in red. Damage is rolled on
  real dice (1d8 + STR and so on), with crits, stuns, slows, burns, poison, wards, stealth and
  Sneak Attacks.
- **Builds:** level 2 ability choice, level 3 subclass (two per class), level 4 feat, level 5
  ultimate. More abilities than slots, so you choose a loadout.
- **The ladder:** five opponents ending in the Pit Champion.
- **Economy:** XP, coin and respect. A crowd-hype meter (land hits, dodge through attacks, vary
  your abilities) raises what you take home. Respect sets your syndicate rank.
- **Hideout and garden:** buy furniture, lights, plants and trophies and place them yourself on
  the grid, indoors or in the garden. Move, rotate or store anything. Most pieces give a small
  perk; rank gates the better ones.
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
- `js/ui.js` menus, HUD, level-up and results screens; `js/main.js` input and main loop

## Shipping beyond the browser

It is a plain web app, so a Steam build is a desktop wrapper (Electron or Tauri) around this
folder, and phone store builds are a web-view wrapper (Capacitor). Not set up yet.

## Not in the slice yet

Authored character models and animation, more arenas, more classes and levels past 5,
multiclassing, music, cloud saves, typing a name with a controller.
