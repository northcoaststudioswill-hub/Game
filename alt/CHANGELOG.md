# Pocket Lantern ALT changelog

ALT = v0.3 plus the changes below. Names and likenesses are unchanged everywhere. Patch & Plate's code is untouched.
Everything here is **invented this pass and not phone-confirmed**; flag anything to Will (he hands out canon).

## Safety

- **Separate saves.** Every `localStorage` key is stored as `pl-alt:<key>` (`src/shell.html`, top script). ALT can't
  read or overwrite the real game's saves, even in the same browser or from a downloaded copy.
- **Page title** is "Pocket Lantern ALT", so the two are easy to tell apart in tabs.

## North Coast Knockout (`src/knockout.js`)

### Feel: less floaty

Measured with `tests/ko_lab.js` at 60 fps, before → after:

| | v0.3 | ALT |
| --- | --- | --- |
| Neutral jump | 34 frames, 55 px high | 26 frames, 49 px high |
| Strike pose reached | eased in over ~6 frames (never fully lands inside a 9-frame jab) | snaps in 1 frame after the windup |
| Hit flash on the victim | 6 frames white | 2 (light) / 4 (heavy) frames |
| Knockdown → standing | 0.83 s | 0.64 s |
| Round intro | 1.75 s | 1.5 s |

- Gravity 1250 → 2100, jump speed 380 → 470, a lighter fall multiplier (1.3 → 1.15), wider jump arcs (forward 1.35x → 1.6x walk speed).
- Launches keep their shape but play faster (launch speed scaled 1.22x to the new gravity; bounce and dizzy-fall speeds scaled too).
- **Poses snap like sprite frames** for attacks, hits, blocks, dashes, specials, throws, supers. Idle and walk cycles step at 8 frames
  per cycle instead of tweening every frame. Only jumps and crouches still blend (fast).
- A 4-frame landing squat after every jump.
- **Launcher chase (new):** down+A that connects can be cancelled into a jump by holding Up, so launcher → jump → air attack is a real
  juggle (the v0.3 launcher's recovery outlasted the victim's air time, so the follow-up never connected at any timing).
  The CPU uses it too (25% / 60% / 90% by difficulty). HOW TO PLAY says `DOWN + A  LAUNCHER (+UP: CHASE)`.

### Graphics: GBA direction

- **Pixel font.** A 5x7 bitmap font (outline + drop shadow, bold at size 2) replaces the phone's system monospace in every Knockout
  screen. Character widths match the old font, so no layout moved. (`PFC`/`PFB` glyph table; `text()`, `tw()`.)
- **Motion smears** on the active frames: a tapered white streak from the windup spot to the fist or foot (gold on heavy hits).
- **Hit bursts:** an 8-ray starburst with a shrinking white core (bigger on heavy hits) replaces the small plus-shaped spark.
- **Closer camera:** fighters fill more of the tall phone screen (zoom up to 1.75x, was 1.5x; tighter framing at mid range).
- **Stage grade:** stepped dark bands at the top of each stage and a darker floor band, so fighters read against the background.
  (A canvas colour filter was tried and removed: it made each frame many times slower.)

### New modes (title menu)

- **SURVIVAL:** one-round fights against random opponents, back to back. Your health carries over (+30 after each win). The CPU
  steps up a difficulty level every 4 wins. Best streak is saved (`SV.surv` in `ncko-v1`) and shown on the title and results screens.
- **TRAINING:** pick a fighter and a dummy. No clock; health refills when you leave the dummy alone; your meter refills; nobody
  goes below 1 HP. Combo damage shows under the hit counter. Pause has **DUMMY: STAND / BLOCK / CPU** (Block holds a standing guard,
  so lows and overheads still get through).
- The title menu now acts on labels, not positions. The pause menu is built from a list (`pauseItems()`).

### Test hooks

- `KO._.tb` records text boxes (the hook existed but nothing switched it on), `KO._.nextSurv`, and a `dummy` flag on fighters
  (a dummy takes no input).

## Sprouts (`src/console.js`)

- **The berry marker points at a berry you can reach.** "BRING HOME 3 BERRIES" used to aim at the nearest berry even when it was
  behind a gate that's still shut (12 of the 30 berries on a fresh day 1), which is where a test run stalled for the rest of the
  day. Now walkable tiles are flood-filled from the player about once a second and the marker prefers a berry within 2 tiles of
  them (sprouts are thrown). If none is reachable it falls back to the old choice. Checked: with only a far reachable berry left
  (609 px) and a gated one at 217 px, v0.3 points at the gated one, ALT at the reachable one.

## The Lantern menu (in `src/rootdeep.js`)

Open item 2 of the v0.3 handoff ("the Lantern menu still counts 3 cartridges"), plus links to the new Knockout modes:

- **CARTRIDGES PLAYED** counts four.
- **TRIPLE THREAT** is now "play three cartridges"; new **FULL SHELF**: play all four (+2 tickets).
- New **STILL STANDING**: win 5 in a row in Knockout Survival (+2). New **FARM TO TABLE**: bring home 50 berries in Sprouts and
  reach day 6 at Patch & Plate (+2). LANTERN KEEPER still needs every other achievement.
- **Tickets:** Knockout Survival pays 1 for every 5 of your best streak (counted when you're back at the shelf, like the 10-win tickets).
- **STATS** gets a fifth page, **PATCH & PLATE** (read-only from its saves, best of the three files): days open, stars /36,
  dishes served, coins earned, sprout crew /6, friend hearts /20. The Knockout page adds BEST SURVIVAL STREAK.
- **HOW TO GET TICKETS** (capsule machine) lists Patch & Plate's "first 3 stars on a day" and Survival streaks.

## Pass 2: HASBARA, King Bibi, likenesses (from Will's photos and notes)

All names, lines and move names below are **invented this pass** unless Will gave them; flag anything to change.

### Will's supers are two-tier
- **Half meter: BIKE LANE** (Select at 50+). A green bike lane paints itself along the floor and Will rides through it,
  pedals turning, Louie in a front basket. 14 damage, costs 50. (It used to be a riderless bike with Louie on the back.)
  The meter has a half-way tick for Will and shows `BIKE LANE (SELECT)` at half.
- **Full meter: HASBARA** (Will's idea; the cinematic is my staging of it). A ZZZ-style super, about 3.8 s, clock stopped:
  1. **Cut-in:** S-rank badge, Will's portrait on yellow and blue diagonal bands, halftone dots, light sweep, `HASBARA` slams in.
  2. **The desk:** Will in a headset at the keyboard; monitors read `IDF / HASBARA / DESK`, the opponent's face under a target
     ring, and a feed that fills (`THREAD`, `TALKING PTS`, `POSTING...`, `SHIFTING`) until `SENT!`.
  3. **The mind flip:** the opponent's face fills the screen, eyes turn to spirals: `WAIT...`, `WHO IS THE BAD GUY?`,
     `MIND: RECALIBRATED`.
  4. **Self-hits:** back on the stage, the opponent punches themselves four times (4.5 each) and once more for 12, launching
     themselves away: `SELF OWN!`. 30 total, can't be blocked. Will tweets through it on his phone.
- The move list shows `SEL 1/2  BIKE LANE` and `SEL FULL  HASBARA`; the select screen shows both.
- The CPU Will uses Bike Lane at half meter now and then, and HASBARA at full.

### King Bibi replaces Gas Guy (slot 5)
- Caricature: silver hair, navy suit, white shirt, blue tie. Tag `PRIME MINISTER. AGAIN.` Slower and hits a bit harder.
- **X: RED LINE** holds up the diagram, then a red line sweeps along the floor (a low: block crouching).
- **Y: IRON DOME** brief invulnerability, a dome that destroys incoming projectiles, and a shove.
- **Super: COALITION** five suited partners run across the stage (5 each).
- **Finisher: FILIBUSTER-ALITY** the speech runs so long the opponent falls asleep.
- Normals: TALKING POINTS, PODIUM KICK, POLL BUMP, SWEEPING REFORM, COALITION DEAL, COMEBACK TOUR.
- Win quotes: I ALWAYS COME BACK. / NEXT QUESTION. / THE COALITION HOLDS.
- **New stage, THE PODIUM:** a green-and-gold assembly hall, a rostrum with a lectern and mic, spotlights, delegate desks.
- Gas Guy's code (thumbs, wind) is gone from the roster.

### Likenesses (from the photos)
- **Will:** new 16x16 head: wild curls with lighter tips, round dark glasses with blue eyes, ginger-brown beard.
- **Louie:** red buffalo-check collar with a gold tag.
- **Lil Bottie:** chrome helmet with a dot texture, LED face with `^ ^` eyes and a smile, headphones, longer dreads,
  quilted silver puffer, silver chain with a cloud pendant.
- **Erin:** blue-grey eyes (hair and outfit unchanged).
- Waiting on more photos of Will, Erin, Bottie and Louie for the next pass.

## Not changed

- Patch & Plate (`src/patchplate.js` is v0.3's file as built). Its 76 checks pass on the ALT build.
- Rootdeep gameplay. Its loop, keeper moves, saves and Lantern tests pass on the ALT build.
- Names, faces, lines, music.
