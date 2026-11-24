# lil Bottie

Everything for lil Bottie in one place: how he looks, his 3D model, his songs, his lyrics and the music video work.

lil Bottie is a fictional rapper, born in the server and raised by code. The look is locked: chrome helmet with a
blue LED smiley screen for a face, long black braids, silver puffer jacket over a black hoodie, iced clover chain,
chrome hands, iced watch.

## What is in here

| Folder | What it holds |
| --- | --- |
| `index.html` | Open this. The model on a stage with a row of menus along the bottom: **Songs** (pick any of the 13; three have recordings, or load one from your device), **Puffer** (12 jacket colours, or each song's own), **Poses**, **Faces**, **Tap** (tap in the lyric timing for the chosen song) and **Lines** (jump to a line, nudge it by a tenth of a second). |
| `asset/` | `lil-bottie.js`, the 3D model (needs only three.js r128), and a sheet of ten views. |
| `refs/` | The thirteen reference photos the model was built from. |
| `songs/` | `algorithm.mp3` (3:20), `overclocked.mp3` (3:17) and `nuke.mp3` (3:50), copied unchanged from the studio's music. |
| `lyrics/` | *The Algorithm*, word for word from the archive, and its timing file. |
| `lore/` | `artist-archive.pdf`: tracklist, persona rules, visual lock, lore and every saved lyric. |
| `music-video/` | The plan for the music video in the Grok Fable Astra world. Not built yet. |

There is an older lil Bottie game, *Clankin' in the Cloud*, in the `bottie/` folder on the branch
`claude/modest-ride-rgjg4r`. Nothing here changes it.

## The model

`asset/lil-bottie.js` builds him in the Grok Fable Astra style: blocky, low-poly, flat shaded. He is **not in the
game yet**. To use him:

```js
const b = LilBottie.build(THREE);       // b.group is about 1.5 units tall, feet at y = 0
scene.add(b.group);
b.group.scale.setScalar(2.2);           // the size the game uses for people
b.setPose('rap');                       // idle, walk, dance, rap, shake, point, thumbs, arms, chain, wave, sit
b.setFace('hype');                      // smile, talk1, talk2, wink, hype, dead, btv
b.setMouth(0.7);                        // lip sync, 0 to 1
b.update(time, dt, songSeconds);        // every frame; songSeconds (optional) locks the moves to the beat
```

![twelve views of the model](asset/lil-bottie-sheet.png)

How he moves (v0.4):

- Shoulders, elbows, wrists, hips, knees and ankles are all joints. Each hand has four fingers with two joints
  each and a thumb, and nine hand shapes: open, relax, fist, point, thumb, peace, grip, spread, horns.
- Every joint is a spring chasing its target, so a move overshoots a little and settles, and the pinky lags the
  index when a hand opens or closes. The braids and the clover swing behind his turns and bounces.
- Each of his 25 dreads is a simulated chain: five points with weight and momentum, joined by four segments.
  The points are pushed out of his head, jacket, hood, shoulders, arms and thighs, so the dreads drape over him
  and cannot pass through him. `shake` is the move that throws them: head side to side on the beat, then a headbang.
- Arms are kept out of the jacket: after every pose is set, any forearm or hand point found inside the torso
  swings the arm out or forward by that much. The `chain` pose was solved so the palm sits on the clover.
- Clipping is measured, not eyeballed: over 7 seconds of every pose, the deepest an arm goes into the jacket is
  0.5 cm (it was up to 24 cm) and no dread point sits inside it (there were up to 15 a frame).
- His knees never lock straight: there is a kneecap, creases and stacked cuffs, and they bend in every pose.
- `dance`, `rap`, `shake` and `walk` are locked to the beat (137.2 bpm; `setTempo` changes it). `rap` chops one hand on
  every beat, changes the hand shape each bar, grabs the chain on the third bar and swaps hands every four bars.

## Faces, icons and lyric poses (v0.5)

- **Faces** are built from eyes and a mouth, so he can hold an expression and lip-sync at once. 15 eyes
  (happy, open, wide, angry, sad, side, sleepy, closed, heart, dollar, spiral, x, dot, hype, wink) and 8 mouths.
  18 presets combine them: smile, angry, mad, sad, shock, love, money, sleepy, hypno, smug, blank, laugh, stare …
- **Icons** fill the whole screen: npc, heart, bars, lock, bell, crown, skull, scroll, battery, cash, btv and more.
- **22 poses written for lines of The Algorithm:** scroll (with his phone), phone, loser, think, me, prison, npc,
  nope, watch, flex, write, eat, harvest, money, one, pray, boss, stop, run, lead, mad, shrug.

![the lyric poses, each with one of the new faces](asset/lil-bottie-lyric-poses.png)

## v0.6: taller, better hair, and moves for every song

- **Taller:** longer thighs and shins (about 1.63 units, was 1.5) and a slightly smaller head.
- **Helmet and hair (v0.7, from a closer look at the photos):** the helmet is hammered chrome with small dark
  **dimples** pressed into it, not raised studs. It is a front shell: behind a hairline over the crown the back
  of his head is hair. 38 dreads are rooted there in four rows that run over the top from ear to ear. Each has
  a combed path down over the head; the part lying on the head follows the head and the rest hangs and swings.
- **15 more poses** from his other songs: boot, shiver, hot, crash, glitch, key, wait, boom, mic, wrist, hear, see,
  sleep, swipe, gang. **More faces:** cold, overheat, glitch, cry, grit, cheeky, starry, zeroed, lookup.
  **More icons:** power, fire, snow, key, wifi, nuke, ghost, load, check, 100, ZZZ, ERR, GM, OK, :(.
- **`LilBottie.suggest(line)`** picks a pose, eyes, mouth and icon for any lyric line from the words in it.
- **`lyrics/all-songs.json`** holds every saved lyric from the archive (13 songs, word for word). `index.html` has
  a song picker: The Algorithm plays with its recording; the other 12 are silent run-throughs at one line a bar,
  because their recordings are not in this repo, with moves chosen by `suggest`.

![hair and helmet from six angles](asset/lil-bottie-hair.png)
![the newer poses and faces](asset/lil-bottie-more-poses.png)

## v0.8: action moves, grounded feet, a phone with a feed

- **12 action moves, all on the beat:** jump, bodyroll, spin, kick, punch, dab, robot, armwave, drop, slide,
  backflip, stomp. His body can now pitch (about the hips) and travel, which the flip and the slide use.
- **Scroll:** he holds his phone out at you, screen first, and flicks the feed with his other hand. The screen is
  live: a feed that never stops scrolling, deep fried, with grain, crushed colour and tearing.
- **Feet on the floor.** An audit found his soles 4 to 14 cm through the floor in every pose. The lowest point
  of either sole is now put on the floor every frame, unless the move says he is in the air.
- **Arms:** the fix pass now also keeps arms out of the helmet, the face, the hips and the other hand, and may
  bend the elbow as well as move the shoulder. It tries small moves and keeps whichever clears the most.
- **Hair:** combing no longer pumps energy into the dreads, and they have a top speed, so they move with weight.
- **Audit** (`arms / head / hips / hands / legs / floor / dreads / phone`, 8 simulated seconds of each of 60
  poses): nothing is more than 2 cm into anything. Worst cases: an arm 0.4 cm into the jacket, a dread 1 cm.
- **The page:** one slim row of controls; the rest is behind ⋯, and **hide** clears the screen to just him and
  the lyric. The view shifts up so he stands clear of the controls.

![the action moves](asset/lil-bottie-action-moves.png)

## v0.9: a clean face, a slimmer jacket, jacket colours

- **Face:** the helmet's rim ring was wider than the screen is deep, so its front poked through the glass as a
  grey wedge under his mouth, and the dome grazed the glass at its centre. The rim is now open at the front and
  the screen sits forward of the dome. An invisible guard in front of the glass sends hair round his face.
- **Jacket:** 10% slimmer in the body, 12 to 14% in the sleeves, with the arms set closer in.
- **Jacket colours:** `b.setJacket(name)` with silver (his own), black, white, gold, rose, red, blue, ice, purple,
  slime, orange, camo. The quilting and shine stay; only the shell colour changes. On the page each song has its
  own (Blue Screen is blue, Overclocked red, Run the Bank gold …) and there is a jacket picker under ⋯.

![twelve jackets, and the face in the shake](asset/lil-bottie-jackets.png)
![the face from twelve angles and poses](asset/lil-bottie-face.png)

## The Algorithm, line by line

`lyrics/the-algorithm.choreo.json` gives every one of the 52 lines a pose, eyes, a resting mouth and (for some)
an icon that flashes on his screen for the first 0.9 seconds. `index.html` plays it: each line shows its
**number, start time, pose and face**, with previous / next line buttons, a list of all 52 lines to jump from,
half speed, and "lyrics −¼s / +¼s". To correct it, say the line number and what is off (timing, pose or face).

## The Algorithm: lyrics and timing

- `lyrics/the-algorithm.md` is copied word for word from the archive. **Do not reword his lyrics and do not write
  new ones in his voice** (the rule from the archive and from the `bottie/` README).
- `lyrics/the-algorithm.timing.json` gives a start time for each of the 52 lines.

How the timing was made: the song runs at about 137 beats a minute and the lyric sheet has one line per 8-beat
bar (3.50 seconds). The grid is anchored where the bass comes back in at 28.45 s, and the sheet's section
boundaries then land on the track's own breaks at 14.4, 56.4, 126.4 and 168.3 seconds.

**The Algorithm is timed.** Will tapped in all 52 line starts against the recording (24 Nov 2026); they are saved in `the-algorithm.timing.json` and `the-algorithm.choreo.json` and are the page's defaults. The music video itself lives in the game (`grok-fable-astra/index.html`, ACT 64): title menu → Unlocks → THE ALGORITHM.

**Not checked by ear.** Nobody has listened to it against the track, and it was not transcribed from the vocal, so
a line could sit early or late inside its bar, and the last 17 seconds (after 3:02) have no lines on the sheet.
The **Tap** menu in `index.html` has −¼s / +¼s buttons for checking it. Timings are kept per song.

## Rules

- His lyrics are his: copy them, never rewrite them.
- The General and the council in his story are fictional. No real flags, no real officials.
- The visual lock is in `lore/artist-archive.pdf`, section 6.
