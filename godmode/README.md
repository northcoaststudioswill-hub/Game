# GODMODE.EXE

A mobile-first 3D god game in one HTML file. You are the intelligence running a miniature floating island. Six
citizens look after themselves: they gather, eat, build, sleep, talk and come to believe things. You have six powers
and a budget of CYCLES. The objective chain ends at the Spire and a Singularity event; after that the island is a
sandbox.

**Play:** open [`index.html`](index.html) in a browser (phone or desktop). It is self-contained: Three.js r160 is
inlined, nothing is downloaded, and it works offline. Saves go to the browser's local storage on that device.

This is a separate game from Pocket Lantern. Nothing outside the `godmode/` folder is touched by it.

| Title | A citizen's mind | Planting an idea |
|---|---|---|
| ![Title](playtest/01-title.png) | ![Observe](playtest/03-observe.png) | ![Inspire](playtest/07-inspire-palette.png) |

| Smite | A growing village | After the Singularity |
|---|---|---|
| ![Smite](playtest/08-smite.png) | ![Village](playtest/11-village.png) | ![Sandbox](playtest/14-sandbox.png) |

Landscape, at night:

![Landscape](playtest/16-landscape.png)

## How to play

- **Drag** to orbit, **pinch** or scroll to zoom, **two fingers** (or right-drag) to pan.
- Pick a power in the dock, then **tap the island**. Tap the power again to return to Observe.
- Powers cost **CYCLES**. They refill over time, faster when citizens pray at a Shrine.
- Keyboard on desktop: `1`-`6` powers, `Space` speed, `Esc` pause, arrows orbit and zoom.

| Power | Cost | What it does |
|---|---|---|
| Observe | free | Tap a citizen to read needs, beliefs, friends and what they are doing and why. Tap a building for its status. Being watched slowly changes the watched. |
| Bless | 12 | Feeds, heals and cheers everyone within reach, regrows trees, berries and crops. Teaches Devotion. |
| Smite | 18 | Lightning. Kills a citizen, destroys a building, or shatters a rock or tree into instant materials. Witnesses flee and learn Dread; the victim's friends grieve and turn to Kinship. |
| Create | 4 to 30 | A new citizen (needs housing), a grove, rocks, or a blueprint (Hut, Farm, Shrine, Terminal, later the Spire) that the citizens build with their own materials. |
| Inspire | 15 | Plants one of the four ideas in a citizen. They become a prophet for 42 seconds and preach it to whoever is nearby. |
| Intervene | 3 | Drag a citizen through the air. Drop them on a tree, rock, bush, building site, shrine, terminal, farm or neighbour and they take the hint. |

### The four ideas

Every citizen holds four belief values. The strongest one, once past 0.4, is their creed and shows as a hat.

| Idea | Hat | Consequences |
|---|---|---|
| Devotion | halo | Prays at shrines (refills your cycles), content, works a little slower. |
| Dread | red hood | Works 40% faster and through the night, prays out of fear, miserable, panics easily. |
| Acceleration | antenna | Studies at the Terminal (makes Insight), stays up at night, eats late and risks starving. |
| Kinship | sprout | Happy, sociable, gathers food, will not pray, resists Inspire and resents being picked up. |

Ideas spread when citizens talk (a coloured spark hops between their heads), faintly by standing near each other,
and strongly around a prophet. Opposed ideas argue instead and make rivals. When half the island shares one idea an
**Age** begins and changes the rules for everybody (faster cycles, faster work, faster insight, or more births).
The ending text of the Singularity depends on the Age at the moment the Spire wakes.

### Objectives

Wake (observe a citizen) → Nurture (8 citizens) → Seed an idea (4 share a belief) → Infrastructure (a Shrine and a
Terminal) → Compile (80 Insight) → The Spire → Sandbox. Left entirely alone the citizens get there in roughly
11 to 16 minutes at 1x; an engaged player in about 8. If you do not place the Spire, they start it without you.

## How it is put together

```
godmode/
  index.html          the built game (commit this; it is what people open)
  build.py            src/shell.html + /*@include*/ scripts -> index.html
  src/
    shell.html        page, styles, HUD markup
    core.js           constants: beliefs, buildings, costs
    world.js          island height field, walkability, resource nodes   (no DOM, no THREE)
    sim.js            citizens, needs, beliefs, memetics, economy, powers, progression, save format (no DOM, no THREE)
    render.js         Three.js scene: terrain, instanced nodes, buildings, citizens, effects, camera
    audio.js          WebAudio effects and a sparse generative tune (no audio files)
    ui.js             HUD, inspector, palettes, tutorial, menus, dialogs
    input.js          pointer, touch, wheel and keyboard
    main.js           boot, fixed-timestep loop, autosave, sim events -> feedback
    vendor/three.min.js   Three.js r160 (MIT)
  tests/
    sim_balance.js    headless runs of the sim across seeds and play styles
    play_phone.js     Playwright run of the built file at 390x844 with touch
  playtest/           screenshots from the last test run
```

- **Fixed timestep.** The sim runs at 20 steps a second regardless of frame rate; the renderer interpolates
  positions. Speed (1x, 2x, 4x) only changes how many steps run per frame.
- **Sim and render are separate.** `sim.js` never touches the DOM or Three.js; it emits events (`bless`, `smite`,
  `meme`, `convert`, `built`, ...) that `main.js` turns into particles, sound and log lines.
- **Citizens** are a small state machine (idle, wander, gather, eat, build, farm, worship, study, talk, preach,
  flee, sleep, mourn, cheer, held). Each time one finishes a task it scores the options against its needs, beliefs
  and the village's stock, picks the best, and records the reason as its `thought`, which the inspector shows.
- **Performance.** One Lambert material with vertex colours for nearly everything, instanced trees, rocks and
  bushes, no shadow maps, no textures beyond two tiny pixel atlases. Pixel ratio is capped (the default "retro"
  mode renders at about 540 pixels on the short side and scales up with hard pixels). The loop stops simulating
  when the tab is hidden and does not fast-forward on return.
- **Saving.** Autosaves every 12 seconds, on pause-to-title, and when the page is hidden. "Erase and restart" is
  in the pause menu. If storage is unavailable the game still runs, it just cannot continue later.

## Build and test

```
python3 godmode/build.py            # writes godmode/index.html
node godmode/tests/sim_balance.js   # sim only; prints when each objective falls for 4 seeds x 3 play styles
node godmode/tests/play_phone.js    # needs Playwright + Chromium; screenshots go to a temp folder (or pass a folder)
```

## Changelog

### 0.1, Nov 19 2026: first playable slice

Everything above is new: the island, six starting citizens growing to twenty, four building types plus the Spire,
six powers, four beliefs with transmission and Ages, a wood/stone/food/insight economy, the inspector, a day and
night cycle, the objective chain, five ending texts, sandbox mode with an unlimited-cycles switch, title screen,
eight-step tutorial, pause menu, event log, autosave and reset.

**Tested by script:**
- `sim_balance.js`: seeds 1 to 6. Passive and assisted runs all reach the Singularity with no starvation deaths;
  a run that smites someone every 30 seconds does not crash; the save format survives a round trip.
- `play_phone.js` (headless Chromium, 390x844, touch): title, new world, orbit, zoom, each of the six powers through
  real pointer input, pause freezes the sim, save and reload, hidden tab holds the sim, the Spire and Singularity
  dialog, sandbox, landscape and desktop layouts, a 30 second random-power soak at 4x, extinction and restore,
  and no console errors.

**Not tested:**
- Not played on a real phone. Touch input, safe areas, audio unlock and frame rate on iPhone Safari are built to
  the platform's rules but unverified on hardware.
- Pinch zoom and two-finger pan are implemented but the script only drives one pointer.
- Sound has not been listened to (the test browser has no audio output).
- Balance is checked for reachability and pacing by script, not for fun by a person.
