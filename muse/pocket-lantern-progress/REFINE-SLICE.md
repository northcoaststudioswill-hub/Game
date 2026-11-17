# Pocket Lantern: refinement list for the slice (up to the cottage)

Will, Nov 17. The Sigil 2 to 4 playthrough waits. This is the work on the slice we're in now: start, Sunkeep, the Meadow, the first alpha, and the cottage. Nothing here has been changed yet. Items are grouped, and each one points at where the code lives.

## Visual bugs and quirks

- **Things walking over water.** Louie, the buddies and the sprouts can cross ponds in the Meadow. Check `fWalkTile` and `fBlocked` in `sw-field.js`, and the pond tiles in `sw-meadow2.js`.
- **The weird path on the left of the first area after Sunkeep.** The west lane and the road to Lantern Town. It was reworked in v9.8; it still looks odd. Check the Meadow map rows in `sw-meadow2.js` and the path rules in `sw-castle.js`.
- **The new map entrance and exit design.** The top road from Sunkeep, the edge exits and the arrival spot (v9.8). Check `sw-castle.js` (entrance swap) and the arrival in `sw-open2.js`.

## The tutorial flow

- Erin's walk: the order of lessons and the "Hang on!" gating (v9.8, v9.9). Check `sw-open2.js` (her lessons) and `sw-louie2.js` (the gating).
- The start: how much to walk before she starts (v9.8 made her wait down the road). Check the first-visit wait in `sw-open2.js`.

## Battles: defeat vs. calm, and the tutorial fight (Will, Nov 17)

- **Bug (found in the code):** Erin says "Stand next to a wild one and press SELECT to battle it." But the v9.8 tutorial gating blocks SELECT battles for the whole of her walk (`sw-field.js`, the `sel` handler checks `wTutStage()`). So the lesson tells you to do something the game won't let you do. Fix first: let SELECT battle the lesson's wild during its step.
- **The fight is skipped in the tutorial.** Every other lesson makes you do the thing before she moves on. The battle lesson doesn't. Make it a required step in her walk, like the catch, the PEB and the bridge, with the gating open for that one wild.
- **Defeat has a story reason, and Erin explains it.** Will's point: if you can't show a darkened buddy the light, it stays dark, and a dark buddy keeps the valley dark. So defeating one is sometimes the only way to clear it. After the first defeat, Erin says why, in one or two lines. Right now `wFoeDown` says "The dark breaks... settles down, calm", which is the cleanse wording (v9.1 chose "we cleanse, we do not knock out"). **Decided (Will, Nov 17):** a defeat kills the buddy, with no penalty. See STORY-NOTES.md.

## Battles

- **Keep the tap.** The timed strike (v9.5) is well liked. Make it better: a clearer ring, a clear miss state, and a way to read the window on a phone. Check `aimUpdate` and `aimDraw` in `sw-dark.js`.
- **The battle system itself still needs refining.** Pace, the menus and what each choice does. Check `battleUpdate` in `sw-module.js` and `sw-battle.js`.

## The base: what's happening, and the pop-ups

- **Players can't tell what's going on at the base.** Workers, crafting and growth all happen, but the player doesn't see the current job. Show a short status line per worker, not a pop-up.
- **Reward and text pop-ups get in the way.** Floating `+2 WOOD`, `LIGHT SHOWN`, `NEW PLOT` and hearts are on top of the play. Make them smaller, fewer and calmer, and send the important ones to one status line. The floats are `W4.floats` in several files; the messages are `swSay`.

## The bottom HUD and creatures

- **The bottom bar shows sprouts but not the creatures** you can throw or send to work. Add the buddies (the party and the crew) to the bottom bar, the same way sprouts appear. Check `wHud` in `sw-front.js`, the bottom row.

## Levelling creatures

- **Two kinds of experience.** Work grade (for base jobs, `wxp` in `sw-base.js`) and battle grade (for fights, `xp` in `sw-module.js`) already exist separately. Make them clearly visible and separate in the party screen, with a rank for each.
- **Keep the catch and light XP.** Creatures still gain XP for catching, showing the light and LIGHT SHOWN, as decided.

## Selling and releasing creatures

- **Creatures and sprouts pile up.** Eventually there will be too many. Add a way to sell or release a creature or sprout at the base (the Buddy Barn stores them, per v9.2). Bugs already sell to Pip, so reuse that pattern. Check `pfSend` and the box in `sw-party.js`, and the Buddy Barn in `sw-sunkeep.js`.
- **Name it for players.** "Sell" or "release" is Will's call. Ask before choosing the word.

## Castle puzzle and the storage gate (Will, Nov 17)

- **A small puzzle before the first alpha.** Right now the castle is one boulder wall (PEB) and one thorn gate (LEAF). Make the approach a few steps, each using a different sprout's job: LEAF clears the thorns, PEB cracks a rock, and sprouts or buddies build a plank bridge over the moat (the same bridge idea as Erin's Meadow lesson). Each step is small and teaches one thing. Check `sw-castle.js` (the castle map) and the gate and wall code in `sw-field.js`.
- **Build a Buddy Barn before the first fight.** The first alpha won't take a challenge until the player has a Buddy Barn (the extra-storage building, `datacenter` in code). Without it you're capped at three buddies, and the player found out too late. Gate it in the alpha interaction (`fNear`, the `alpha` case, in `sw-field.js`) with `wHasDC()` (in `sw-starters.js`).
- **Marcus explains it at the castle.** Something like: "Bro, are you kidding? We need to see one, send one, and get you a box made. Lots of purifying to do." His line plays when the player reaches the castle before the Barn exists. Put it in the castle reveal in `sw-castle.js` (`sqArrive`), so it's a teaching beat, not a wall of text.

## Not now

- The Sigil 2 to 4 playthrough (Will says he usually stops around the cottage).
- Monster art overhaul (later, see PROGRESS.md).
- The Bessie rename in code (later, see PROGRESS.md).
