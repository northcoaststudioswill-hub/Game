# Rootdeep 64

Rootdeep (cartridge 2 of the Pocket Lantern, v2.9) rebuilt as its own game: the same loop, the same
cast, the same numbers, on a new late-90s-cartridge 3D engine, controller first, 1–4 keepers on one couch.

`index.html` is the whole game — one file, no dependencies, no network. Open it and play.
After editing anything in `src/`, rebuild it with `python3 build.py`.

## Controls

| | Move | Attack | Cast | Dash | Pause |
| --- | --- | --- | --- | --- | --- |
| Controller | stick / d-pad | A | B or X | any shoulder / trigger (or Y) | Start |
| Keyboard 1 | WASD or arrows | Z / J / Space | X / K | Shift / L (or double-tap a direction) | Enter |
| Keyboard 2 | arrows | `,` | `.` | `/` | Backspace |
| Touch | left thumb (floating stick) | A | B | DASH | START |

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
- `node test/phone.js` – iPhone-sized touch viewports, portrait and landscape.

**Not yet verified:** a physical controller (no hardware here — the mapping follows the standard
Gamepad layout), real phones, and how any of it feels in human hands.
