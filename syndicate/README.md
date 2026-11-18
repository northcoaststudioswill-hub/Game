# Underground Syndicate (vertical slice)

An isometric one-on-one pit fighter with D&D-style class builds. Real-time action combat,
BG3-flavoured levelling, and a hideout and garden you restore with your winnings.

**Play:** open `index.html` in a browser (no build step, no dependencies), or serve the folder:
`python3 -m http.server` and visit `http://localhost:8000`.

## What is in the slice

- **Character creation:** 5 origins (ability bonuses and a different look) x 4 classes
  (Fighter, Rogue, Sorcerer, Cleric), six ability scores that each do something in combat.
- **Real-time combat:** move, aim, basic attack, dodge with invulnerability frames, three
  ability slots, an ultimate, potions. Enemy attacks telegraph on the floor in red.
  Damage is rolled with real dice (1d8 + STR and so on), with crits, stuns, slows, burns,
  poison, wards, stealth and Sneak Attacks.
- **Builds:** level 2 ability choice, level 3 subclass (two per class, each a passive and an
  ability), level 4 feat, level 5 ultimate. More abilities than slots, so you choose a loadout.
- **The ladder:** five opponents ending in the Pit Champion, each a different class with its own AI.
- **Economy:** XP, coin and respect. A crowd-hype meter (land hits, dodge through attacks,
  vary your abilities) raises the respect and coin you take home. Respect sets your syndicate rank.
- **Hideout and garden:** 11 pieces to install. Each one lights up part of the pre-rendered
  plate and gives a small perk. Rank gates the better ones.
- **The Fence:** weapon and armour tiers (which change how your fighter looks) and potions.
- Keyboard and mouse, plus touch controls. Progress saves in the browser.

## Controls

| Action | Keyboard / mouse | Touch |
|---|---|---|
| Move | WASD | left thumb stick |
| Aim | mouse | locks to opponent |
| Attack | left click (hold) | ATK |
| Dodge | Space or right click | DODGE |
| Abilities | Q, E, R | ability buttons |
| Ultimate | F | ability button |
| Potion | C | potion button |
| Pause | Esc | pause button |

## How it follows the art direction doc

`docs/Art_Direction_Handoff.docx` is the source. The three concept plates from it are used
directly as the pre-rendered backgrounds (`assets/arena.jpg`, `street.jpg`, `hideout.jpg`);
characters, weapons, spells, hit effects, torch flicker and fog are drawn live on Canvas on top.
The hideout "upgrade" is a darkness layer over the plate with a light punched through for each
installed piece. Characters are procedural placeholder art, lit to sit on the plates; they are
the first thing to replace with real sprite sheets.

## Files

- `js/data.js` classes, abilities, opponents, ranks, decor, gear (all tuning lives here)
- `js/core.js` dice, save, audio synth, derived stats
- `js/fight.js` combat simulation, AI, fight rendering
- `js/draw.js` character renderer
- `js/ui.js` menus, HUD, level-up and results screens
- `js/main.js` input, hub and hideout scenes, main loop

## Not in the slice yet

Real character sprites and animation, more arenas, walking around the hub and hideout, free
placement of decorations, more classes and levels past 5, multiclassing, music, gamepad support.
