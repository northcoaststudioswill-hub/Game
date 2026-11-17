# Starhaven — Changelog

## Rebuild 3 — Relationships, cutscenes, and an easier down-strike (Nov 17, 2026)
Will's notes: the strike down is hard on mobile; can a Bluetooth controller be used; more relationship development,
more story, more cutscenes.

- **Down-strike on touch:** in the air, STRIKE now aims down by itself when a bud, an enemy or thorns are right below
  Wren (the design doc's "auto-aim on phones"). Holding the stick down still works, and a down-diagonal now counts.
  Bram's line and the hint are reworded for each input type.
- **Bluetooth controllers:** already supported (standard mapping: A jump, X strike, B dash, Y talk/paint, Start menu).
  New: a "Controller connected" message, the touch buttons hide while a controller is in use, and the Controls page
  says how to pair one.
- **Cutscenes:** full-screen illustrated scenes with portrait dialogue at the big beats: waking at the Spring Court,
  Caelum at Wren's window at midnight, the rooftop, Iris's vision, evenings at the fire and the tower, and a Chapter 3
  teaser (Wren's palm glowing with fire). Narrator lines for scene-setting.
- **Bonds (design doc "Bonds" and "Bond pacing"):** 5 hearts each for Caelum, Bram and Iris. Heart 1 when you meet;
  then hearts at 40 / 120 / 240 / 400 points. Points come from evenings (+20), gifts they love (+15), and choices.
  Every heart has a scene: Caelum heart 2 (what he saw in the Deep), Caelum heart 3 (flying over the city), Bram heart 2,
  Iris heart 2. Toasts say when someone loved what you did or will remember it.
- **Dialogue choices** in 9 places. Each changes what the other person says and how much they warm to Wren.
- **Evenings between chapters:** after Chapter 1, a night on the rooftop with Caelum (show him your sketchbook, toast,
  or ask about his nightmares). After Chapter 2, choose who to spend the evening with: Caelum, Bram or Iris, each with
  their own scene, gift and choices.
- **More story:** the Spring Court (safe, smothered, a letter from her sisters she hasn't answered); Caelum's midnight
  arrival; the bargain released ("I'm staying anyway"); Iris's vision that the Iron King knows Wren's name and his iron is
  reaching for her sisters; Bram's brother lost on the north wall; Iris's secret about Caelum's thread.
- **Journal:** a Bonds section with hearts, points to the next heart, and what each person loves.
- New game resets bonds; the finale leads into the end screen.

Verified (`game/tests/feel.js`, 23/23): everything from Rebuild 2, plus touch auto-aim crossing the thorn pit without
holding down; Chapter 1 + first evening reaching Caelum heart 2 with its heart scene; Chapter 2 + vision + second evening
+ finale ending on the end screen; each evening choice going to the right person. A simulated Bluetooth controller
started the game, went through the intro and dialogue, and moved Wren. Phone screenshots of every new scene checked.
NOT tested: a real controller paired to a real phone (and whether the Claude app passes controllers through; Safari and
Chrome do); human play.


## Rebuild 2 — Story-led concept: Prologue through Chapter 2 (Nov 17, 2026)
Will's notes on Rebuild 1 and on Muse's slice: no outline of the story, no idea what to do or what was going on. This build
is a phone-playable concept (no Godot for now) of the design doc's first playable: **the Prologue through Chapter 2**,
told as a story from the first screen. Full outline of what the player sees: [`STORY.md`](STORY.md).

- **Intro:** 5 painted panels (placeholder art) tell who Wren is, the Deep, the High Lords' sparks, the bargain with
  Caelum, and the Iron King. Skippable.
- **Prologue, The Deep:** a nightmare that teaches movement only (design doc: no enemies until controls are taught).
  The Thorn Queen speaks as you run. Ends with the Deep Wyrm chasing you to the light (the doc's dodge-only escape).
- **Chapter 1, Ashes:** Caelum calls in the bargain and walks Wren to Starhaven, winnowing ahead in starlight. Paint the
  first mural (hold PAINT) and the dark street lights up house by house. Rooftop talk, Caelum bond heart 1. No enemies.
- **Chapter 2, The Five:** Bram's Training Ring (dummy combo), his thorn pit (pogo), Iris (optional talk), then three
  thorn sprites past the north gate. Gates open as Bram's lessons are passed. Caelum closes the chapter.
- **Always knowing what to do:** chapter cards with goals at the start and a "what changed" card at the end; a GOAL line
  showing chapter + current goal (with a counter for the sprites); dialogue with portraits for every story beat;
  control hints exactly where a move is first needed; **Menu > Story & goals** with the goal checklist, the story so far,
  and everyone you've met.
- **Places have their own palettes** (design doc): the Deep in pale greens and roses, the road at dusk in violet and rose,
  Starhaven in night blues and gold, the Thornwood in cold blue.
- **Controls:** more than 2 buttons, as asked: move stick, JUMP, STRIKE, DASH, plus a TALK / PAINT button that appears
  only when there's someone to talk to or a wall to paint. Keyboard W and gamepad Y do the same.
- **Saves** which chapter you reached (Continue on the title screen). All chapters are open from the title in this concept.
- Kept from Rebuild 1: all movement and combat feel, the TUNE panel, hit-stop, perfect dodge, checkpoints.
- Fixes found while testing: lanterns restore hearts only when first lit (thorns next to a lantern were free);
  thorn sprites stay within 5 tiles of home (one walked back through an open gate into town); the first thorn patch in the
  Deep is 3 tiles, not 4; the dialogue box sits at the top so it never covers the people talking.

Verified (`game/tests/feel.js`, 20/20): all 17 movement and combat checks still pass in the new rooms, plus an autopilot
that plays **each chapter start to finish with its dialogue clicked through**: Prologue (story, Wyrm chase, wake-up,
never caught), Chapter 1 (walk, mural, rooftop, the street lights up, Caelum heart saved), Chapter 2 (combo, thorn pit,
3 sprites, ends on the concept end screen). `game/tests/smoke.js` screenshots every story screen on a landscape phone
with no errors.
NOT tested: Will playing it on his phone; real iPhone Safari; a real gamepad; sound (there is none yet). Placeholder art.


## Rebuild 1 — The Training Grove: movement and combat feel (Nov 17, 2026)
A fresh start in this repo (`game/`), built from `DESIGN.md` and `BUILD-PLAN.md`. Muse's browser slice (v1 to v5 below) was
never committed here and was not reused. This build covers **Milestone 1 (movement feel)** and **Milestone 2 (combat feel)** only.

- **Play it:** open `game/starhaven.html` in a browser (phone held sideways, keyboard or gamepad). Rebuild with `python3 starhaven/game/build.py`.
- **The Training Grove:** one level, left to right. Each section teaches one move on a sign before it is needed:
  move, jump (3- and 4-tile gaps, a 2-tile step), double jump (a 5-tile wall), dash (a 10-tile gap that takes jump + jump + dash),
  daggers (a training dummy that counts your combo), pogo (a floor of thorns crossed by striking down on floating thorn buds),
  then the first enemy, thorn sprites. Lanterns are checkpoints. The far lantern ends the run with your time and stats.
- **Movement:** acceleration model (full speed in 3 frames, stop in 3), firmer fall than rise, a soft float at the top of a
  held jump, tap for a hop and hold for a full jump, coyote time (6 frames), jump buffering (7 frames), double jump,
  dash with 0.3 s invincibility and 0.5 s cooldown (from the design doc), jump out of a ground dash to keep its speed.
- **Combat:** 3-hit ground combo (third hit knocks back), 2-hit air combo, down-strike pogo that gives back your double jump
  and dash, hit-stop and screen shake on every hit, a small recoil when your blade connects. Thorn sprite: HP 4, dies in
  exactly 2 dagger hits (design doc), glows orange before it lunges. Dashing through a lunge is a **perfect dodge**: no damage,
  time slows for a second (design doc).
- **Getting hurt:** 5 hearts. Thorns and pits cost a heart and put you back on safe ground. At 0 hearts you are knocked out
  and return to the last lantern with full hearts, no other penalty (design doc: chill, not punishing).
- **Readability (the v1 lesson):** near-black play layer with moonlit edges, gold marks on every ledge that drops into a pit,
  crimson thorns, bright Wren with a gold scarf and a soft halo, sharp HTML text for the HUD and signs, an always-on GOAL line.
  Starhaven glows on the far horizon the whole way, so the goal is always in sight.
- **Phone:** landscape, floating stick on the left half, JUMP / STRIKE / DASH on the right, "turn your phone sideways" screen in portrait.
  Signs name the right buttons for touch, keyboard or gamepad.
- **TUNE panel** (menu > Tune the feel): live sliders for run speed, start-up, stopping, air control, jump and double jump
  height, rise and fall gravity, dash speed and length, pogo bounce. Saved on the device. "Copy numbers" copies them so Will
  can send exact feedback.
- **Placeholder art.** Shapes drawn in code, in the direction the design doc sets (Hollow Knight mood, pixel crispness).
  Real art waits for an art direction Will approves (BUILD-PLAN rule).

Verified (`game/tests/feel.js`, real input and physics, 18/18 pass): each gap needs exactly the move its sign teaches
(running falls into the 3-tile gap; one jump clears the 3- and 4-tile gaps; one jump can't top the wall, a double jump can;
jump + double and jump + dash both fall short of the 10-tile gap, jump + double + dash clears it); a scripted pogo run
crosses the thorn floor on the 3 buds without a scratch; thorns cost 1 heart and return you to safe ground; 3 presses = 3
hits with the finisher on the third; thorn sprite alive after 1 hit, gone after 2; its lunge costs a heart; dashing through
it is a perfect dodge with no damage; knockout returns you to the last lantern with full hearts; coyote time and jump
buffer work; an autopilot runs the whole grove start to end lantern (23.5 s). `game/tests/smoke.js` loads it on desktop and a
landscape phone with no errors. A real-time check moved Wren with real key presses and real touch drags.
NOT tested: how it feels in Will's hands on his phone, real gamepad hardware, iPhone Safari specifically, sound (there is none yet).

---
*Entries below are Muse's browser slice (v1 to v5). Its code is not in this repo.*

## v5 — Flame, the first court gift (Nov 16, 2026)
BUILD-PLAN Milestone 6. After mission 1, Caelum grants Flame (story: Wren carries a spark of every court's power, Flame first to stir). Cast: F/Q keyboard, Y gamepad, flame touch button (appears only after unlock). 3 moon-pips by the hearts after unlock; fireball costs 1 pip; pips refill slowly, faster on dagger hits. Fireball: 2 damage + burn, lights braziers in both scenes. Thorn wall deep in Thornwood blocks a raised alcove (5 bonus motes + brazier): daggers spark off with an "only flame can burn this away" hint; Flame burns it permanently (thornWallBurned saved). GOAL bar points to Caelum, then the wall, ahead of the paint goal. Save extended additively (flame + thornWallBurned flags, safe defaults) — old v1-v4 saves migrate forward, verified with a real v1 save.
Verified: autopilot ran the extended loop TWICE, 23/23 steps both runs, identical totals — all 13 v4 steps plus migration, unlock, cast (exactly 1 pip), dagger-hint, burn, alcove motes, brazier, second mission clear, real reload restoring flame + burned wall. Fixes during verification: removed a ground block at tx200 shadowed by the wall; moved a thorn sprite spawn out of the pillar steps (tx54 -> tx68); GOAL priority fixed so the unburned wall outranks painting.
NOT tested: flame touch/Y-button hardware feel, fireball feel at phone size, human alcove climb (bot proved reachability by run-jump).

## v4 — Complete the loop (Nov 16, 2026)
The full loop is now PROVEN by an in-game autopilot playing with real input/physics/combat (no teleports): fresh save -> intro -> Caelum -> gate -> full Thornwood (gaps, pillar, both enemy types, all 4 checkpoints) -> portal (+60, missionsDone=1) -> hub -> Mural 1 (exactly -50 starlight, celebration) -> real page reload -> Continue restored identical state. 13/13 steps passed (run: 22 motes, starlight 127 -> 77 after mural). Added: per-run mission tracking + mission-complete summary on return (starlight, motes, kills by type, lanterns), mural celebration (staged color bursts, banner, warmer street), mural-aware GOAL text for every state, clean mission replay (verified reset: motes/enemies/checkpoints/hearts/stats). v3 feel + v2 readability/story untouched; zero forbidden-universe references.
NOT tested: touch/gamepad hardware feel, human play at phone size. Will's play is the verdict.

## v3 — Feel pass (Nov 16, 2026)
BUILD-PLAN Milestones 1+2. Movement rebuilt on an acceleration model: full speed in 3 frames, stop in 3 frames (~2px slide), 4-frame turns with skid puff, new gravity curve (soft apex, firm fall, no float), tap hop 1.8 tiles vs hold jump 4.2 tiles, buffered dash, denser afterimages, momentum kept out of dash. Combat: 11-frame swings with near-instant hit start, attack buffering for the 3-hit combo, forward lunge, hit-stop ladder (3 normal / 5 finisher & pogo / 6 kill) with matching shake, stronger knockback. Pogo: -8.4 bounce, refunds double jump AND air dash, ring burst + readout. Landing squash, run dust, double-jump ring.
Verified by physics simulation: 4- and 5-tile gaps by run-jump; 6-tile gap needs double jump (145px) or jump+dash (128px) vs 96px gap; HP4 enemies die in exactly 2 dagger hits, matching the on-screen label.
Standalone check: full-file grep — zero lil Bottie / Sprouts / Pocket Lantern references. Starhaven is its own project.
NOT tested: real touch/gamepad hardware feel, full human Thornwood run, phone-size feel. Will's play is the verdict.

## v2 — Readability + story (Nov 16, 2026)
Answered Will's verdict on v1 ("really ugly, hard to see what's happening, no story explanation of what to do"). Quieter backgrounds, lit ground edges + gold pit warnings, bigger/bolder Wren and enemies with outlines/labels/health bars, pulsing motes, readable HUD pill, big gold prompts. Story: premise on title, HOW TO PLAY strip, 4-card intro, expanded Caelum dialogue, name tags on landmarks, always-on GOAL bar with objective arrow, location banners, plain-language event messages, pause screen restates quest + controls.

## v1 — Test slice (Nov 16, 2026)
Title, Starhaven hub (house rest/save, signpost, Caelum's 5 dialogue states, 3-panel mural wall at 50 starlight that brightens the city, gate), Thornwood mission (tutorial signs, 4/5/6-tile gaps, pillar, 4 lantern checkpoints, 40 motes, thorn sprites + winged spies, +60 end portal). Save: {v:1, starlight, murals, missionsDone, metCaelum} in local storage.
