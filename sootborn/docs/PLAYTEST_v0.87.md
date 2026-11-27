# Playtest of v0.87 — three bot teams (2026-11-27)

All three played a frozen copy of v0.87 with real key presses or real pad buttons. No page or console errors in any run. Raw bots, logs and screenshots were in the session's /tmp and are not kept.

- **Novice** (keyboard, first time, mashes, dodges late): every fight def and walk place, and New Game cold at 1280 and 640.
- **Skilled** (Xbox pad, chains, timed dodges, guard breaks, boots, ELEVEN): every fight def, twice precise, once at human reaction speed, and 11 headline fights on Brutal.
- **Comic** (a keyboard newcomer and a capable pad player): all six comic-book levels and the cold open, plus a death test in each.

## Fixed in v0.88
Default difficulty Hard → Story; heist HUD date and keys; no death screen in the vent stack and Deep Array; I AM STUCK missing there; Riser boss never returning after a death; High Docks roof door; air hook dead on the pad; early dodges dropped; Memory Arts suppressed after the first fight; "?" for brackets in the Drill tip. See CHANGELOG v0.88.

## Still open (to decide) — all built in v0.89; see CHANGELOG

**Teaching and the first five minutes (novice)**
- Any key after 0.5 s skips the whole animated intro; both cold runs saw about 2 s of it.
- Walk-place exits are often the nearest marker, with no "leave?" check. The Service Stair can be left in 2 s, missing its valve choice; the circle, square and row in 10–12 s.
- The ordinary guard is the real frustration (4–57 BLOCKED per fight, each knocks Kael back). Nothing explains it beyond "BLOCKED". A big first-time prompt would help.
- FURY fills in about 6 s, but HOLD E is only in small text. Big prompt the first time it fills.
- About two minutes of talk with no control right after the first fight.
- "Press any key" on the title is barely visible.
- The Skip scene button covers dialogue at 640×360.
- The full-bar move has three names on screen: IRON SKY, THE RECKONING, ELEVEN.
- Serenline gives no sign when a marker becomes ready.

**Balance (both fight teams — they disagree, and both are right)**
- On Story the novice wins; on Hard the novice cannot win the Ford or the Assayer.
- On Hard the skilled player wins every fight first try with 0–5 hits. Every boss from the Ford on is the same ~50 s fight. Only the Ford and the Twins push back, on Brutal.
- ELEVEN does about 11% of a boss's HP; saving fury barely matters except at the Keep's ending.
- The guard specials barely matter (wide cut 7/18, breach 10/20, roar once, parry once).
- Nothing tells you a double strike's second swing is coming.
- The 2D fights after the Drill are trivial (15–25 s).
- Riser's Warden Captain lost to the masher but killed the careful player twice.
- The anti-mash rule rarely fires, does not reset on a dodge or kick as its comment says, and counts air strikes; it punishes boots strings, not ground mashing.

**Camera and screen**
- 3D duels: the foe is off screen 44–72% of the time while Kael flies (blade, son, ember, gallery, keepEnd, keep). Pillars and foreground bodies cover Kael; Kael's body covers Lucan in the cold open.
- Bottom of the 3D screen crowds: narration, tip bar, speech bubbles, hit counter.
- ELEVEN impact frames white the whole 3D screen.

**Comic-book levels**
- The objective marker points through floors in vertical levels (vent stack climbs, Deep Array heart, High Docks office and back stairs). This is the main "where do I go?" problem.
- Wrong button letters: "A LOOK" / "A FINISH!" (A is jump on the pad, E on keyboard); "DRAG THE PICTURE" on a PC.
- The Deep Array tells you to use ELEVEN, which Kael does not have there; kill banners say "LINE STRUCK ELEVEN".
- Deep Array floor fight: the last enemy can stick near (±1.3, 0, −7.1) and never reach you (2 of 5 runs). I AM STUCK gets you out.
- Vent stack first platform: Kael can fall off mid-fight and cannot get back to the enemies. I AM STUCK gets you out.
- High Docks intro takes 19 presses before you can move (other levels 3).
- Camera clips into a bollard in the freight yard and the back-stairs rail; Riser opens looking into pine foliage.
- The pad legend is 9 px text.

**What they liked**
- The Keep cold open, the allied battles (Valley, Fall, Docks, Riser), the Fourth Ring walk.
- The core loop: dodge the wind-up, take the opening, chain, kick a guard open; dive kick and shaft drop; the ELEVEN and Memory Art cut-ins.
- The comic pages, captions and art: the rainy vent stack, the sunset Stair, the quiet Table.

**Not tested:** touch, 3D at a real 60 fps (the machine ran 4–13 fps), sound, the whole story by a playtester (the whole-story bot covers it), Riser deaths in waves two and three.
