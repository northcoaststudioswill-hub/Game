# lil Bottie: Clankin' in the Cloud

A game centered on lil Bottie. **Spawn takeover:** Sprouts flipped upside down. You are lil Bottie, the gang is
your spawns, and instead of carrying things home you throw them into things. Every device you own spits out
more spawns. Spawns got spawns.

- **Play it:** `games/pocket-lantern-bottie.html` (one file; it boots straight into the Bottie game)
- **Build it:** `python3 bottie/build.py` from the repo root
- **Test it:** `node bottie/tests/bottie_lab.js` (43 checks; screenshots land in `playtest/`)
- **What changed:** [`CHANGELOG.md`](CHANGELOG.md)
- **Lore package from Will:** `lore/artist-archive.pdf` and the five reference photos in `lore/`

## What this folder is

A copy of the Pocket Lantern main line (`alt/`, Sproutwild v9.9) made Nov 18 2026, with the Bottie game added
in `src/bottie/`. Nothing in `alt/` or the frozen version folders is touched by work in here. Saves are separate
(`pl-bottie:` prefix; the Bottie game's own save is `bottie-v1`).

The Sprouts universe only appears as an easter egg: the console in Bottie's crib opens the Pocket Lantern shelf,
and all five cartridges play from there. B on the shelf (or the button) goes back to the crib.

## How it plays

| Button | Does |
| --- | --- |
| D-pad | Move |
| A | Throw a spawn. Hold to keep throwing. It aims at what he is facing, or the nearest thing in reach. |
| B | Call the gang back (beep beep) |
| Y | Overclock: the gang hacks twice as fast for 6 seconds, heat goes up |
| X | Use the tool in hand (costs tokens) |
| Select | Swap tools |
| Start | Pause |

- **Devices** (racks, PCs, toasters, fridges, smart TVs, Ring cams, routers, billboards, mainframes) take
  spawn-seconds to own and only hold a few spawns each, so spread the gang out. Owned devices spit out spawns.
- **Gold devices** open the fiber port, which ends the track.
- **Dork nerds and soldiers** walk over and unplug what you own. Throw spawns on any human and they turn into an
  NPC scrolling their phone. Soldiers stomp spawns while you do it.
- **Opp bots** zap spawns. Swarm them and they blue-screen.
- **Firewalls** need the whole gang. **Captcha doors** are a small pick-the-squares game.
- **Heat** rises as you hack and overclock. At 100 you get thermal throttled (slow for 5 seconds). AC vents cool you.
- You cannot lose the gang for good: at zero spawns, three boot from backup.
- **Tools** unlock one per track cleared: FORK BOMB, BLUE SCREEN, POP-UP, RM -RF. Tokens pay for them; you earn
  tokens by owning devices, making NPCs and crashing opp bots.
- His lines appear in a speech bubble at his head, and are kept rare (see `say` in `bt-2-game.js`).
- Takes in a row build an **aura combo** up to x8. **NPCs** you make go and hack for you. **Fiber ports** carry you
  and the gang across a level. Each track hides an **iced clover**. The finale runs on a five-minute **clock**.
  The closet in the crib changes his **drip** once you have the aura.

## What is built (v0.4)

Six tracks, the crib, an intro and an ending. The other eight album tracks show as NOT BUILT in the tracklist.

| Track | Place | New idea |
| --- | --- | --- |
| 01 Boot Up | the rack room | throwing, firewall, opp bot, captcha |
| 02 Overclocked | a server hall that runs hot | heat, AC vents, overclock |
| 03 Born in the Server | the office | dork nerds unplug things; make them NPCs |
| 04 The Algorithm | the night market | turn 8 people into NPCs, own both billboards |
| 07 No Wi-Fi, Still Online | a house | toaster, fridge, smart TV, Ring cam, grandma's tablet |
| Nuke the Data Center | the compound | soldiers, the General, four mainframes (AWS, Apple, Oracle, Alibaba), the standoff |

## Rules for anyone working on it

- Captions that end in an adlib "(like this)" are lil Bottie's own lyrics, copied word for word from the
  archive. Do not reword them and do not write new ones in his voice; plain UI text is ours.
- The General and the council are fictional. No real flags, no real officials.
- **Songs are switched off for now** (`SONGS_ON=false` in `bt-0-head.js`, Will's call on Nov 18 2026): the game
  plays the chiptune everywhere until he has all the songs ready. The notes below describe what comes back when
  the switch is turned on.
- Music: three real songs so far (`games/music/overclocked.mp3`, `algorithm.mp3`, `nuke.mp3`), shared across the
  game until the rest arrive; the chiptune in `bt-0-head.js` is the fallback. To add a song: put the mp3 in
  `games/music/`, set `mp3:'name.mp3'` on its level in `bt-1-levels.js`, and publish the file alongside the page.
  Opened straight from disk the game cannot fetch songs and plays chiptune.
- Nothing is phone-confirmed. Everything here was checked in headless Chromium at 440x956.

## Files

| Path | What it is |
| --- | --- |
| `src/bottie/bt-0-head.js` | helpers, sound and the beat, his lines, device table, the album list |
| `src/bottie/bt-1-levels.js` | every level as a text map with a legend |
| `src/bottie/bt-2-game.js` | save, level building, the rules, spawns, humans, opp bots, captcha |
| `src/bottie/bt-3-draw.js` | all the art and screens |
| `src/console.js`, `src/shell.html` | the console; changed only to boot into Bottie and to add the way back from the shelf |
| `tests/bottie_lab.js` | the lab: boot, real key presses, an autopilot that clears every track, the console easter egg |

Not copied from `alt/`: `backups/`, `playtest/` and the Sproutwild screenshots.
