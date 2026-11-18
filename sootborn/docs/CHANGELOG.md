# SOOTBORN — changelog

## v0.12.4 · 2026-11-18 — sound, music and better figures
- **Battle music, generated in the game and built on the shift song** (the crew's hummed tune, D F A G | F E D):
  - *The valley*: war drums and horn chords, with the shift song as a march in the second half.
  - *The ford*: lower and slower, hand drums over a drone, the tune in the cellos.
  - *The keep*: a ticking ostinato; the tune first high and clean (Seren), then the same notes an octave down in iron (Kael).
  - **Rage layer**: as the fury bar passes half, a low sawing pedal and an extra drum come in under whichever track is playing; at full, a high dissonant shimmer and a roar of air.
- **Combat sounds**: blade swings (a heavier one for the overhead and for big enemies), steel on steel for blocks, cuts and heavy cuts, a clash ring, a dash, bodies hitting the ground, fury igniting, the memory cut-in, a rising hit for each count of ELEVEN, the fire pillar, a war horn at the start of each Assay battle and in the opening, and a short fanfare on a win.
- **Figures**: limbs and torsos are tapered instead of brick-shaped (shoulders wider than the waist, thighs and shins that narrow, a jaw), with hip plates that move with the legs, a neck guard, curved crossguards and a pommel stone in House colour.
- Sound was checked by rendering every track and effect offline for errors and clipping. Nobody has listened to it yet.

## v0.12.3 · 2026-11-18 — light, and more rage
- **Bloom**: the 3D scenes now render through a glow pass. Anything that gives off light (blades, gold trim, fire, the sun, sword ribbons, sparks) bleeds into the picture around it, with a soft vignette at the edges. Rendered slightly above screen resolution to keep edges clean. `#nopost` in the URL turns it off.
- **Rage you can see on the ground**: from about half fury the earth under Kael scorches and splits into glowing cracks that grow with the bar; the hem of his cape catches; the whole picture tints red and the vignette closes in.
- **Rage kills**: finishing an enemy with fury at 60 or more drops into slow motion, tilts the camera and throws the body further.
- Kael wears Seren's washer on a cord at his chest.

## v0.12.2 · 2026-11-18 — more polish above ground
- **Animation**: Kael stands hunched and breathing hard at full fury, blade low; enemies facing him then raise their guard and back off. On a win he sinks over his sword while his allies raise theirs. The dodge rolls in the direction of travel. Cutscene figures can raise a blade or kneel (the cadets chanting after the valley; Lucan on one knee after the duel).
- **Fighting**: press strike during a dodge for a dash strike that closes distance and hits hard. Damage numbers pop off every hit. Clash now needs a deliberate, well-timed strike: a mashing bot was triggering it constantly and winning the last Ember Ring bout without taking a hit, which the test run caught.
- **Look**: the field shades smoothly instead of in flat tiles; broadleaf trees in green and gold (russet at dusk) among the pines; the river moves and carries foam; clouds drift; sparks and the fire pillar are now light in the 3D scene instead of pixels laid over it; the victory camera sits further back.

## v0.12.1 · 2026-11-18 — 3D animation rebuilt from research
Read up on how action animation is done in this kind of game before touching it. What I took from it:
- Wolfire's David Rosen (GDC 2014, "An Indie Approach to Procedural Animation"): author a few strong key poses and let curves and springs do the motion between them; add drag to anything that hangs.
- Fighting-game and melee animation practice: every attack has three beats (anticipation, a very fast strike, a held follow-through); speed up the strike and slow the wind-up and recovery; stretch at speed and squash on contact; freeze briefly on a hit; match the victim's reaction to the direction of the blow.

What changed:
- **Pose to pose on springs.** Each state names a key pose (twenty joint values). Every joint chases its target on a spring, so states blend into each other instead of popping, and swings overshoot and settle.
- **Attacks in three beats.** Forehand: wound back with the torso turned away, cut through with a lunging step, hold past the target. Backhand mirrors it. The third is a crouch, a leap with the blade behind the head, and a slam into a deep crouch with a squash on landing. Lancers pull back and thrust.
- **Enemy tells are poses**, not just a red shape: a sweep winds the whole body round, an overhead raises the blade and sinks, a charge drops into a sprinter's crouch. After a swing they slump, spent, which is the moment to hit them.
- **Hit reactions follow the blow**: the body folds away from where it was struck, the head snaps, arms fling; launched fighters go limp and tumble.
- **Secondary motion**: capes, sash tails, long hair and helmet plumes are driven by how fast the fighter is really moving; the body leans into its own acceleration and turns smoothly; the run cycle only plays when the feet are actually covering ground; boots kick up dust on landings.
- **The blade** stretches at speed and leaves a ribbon of light from mid-blade to tip.
- **Clash** (new move): strike an enemy in the last instant of his wind-up and the blades meet. He staggers, time slows, fury jumps.
- Rim lighting on every figure, visible arena bounds (stakes and ribbon in House colours), light bursts at each impact, slightly richer colour.
- Figures are a little smaller relative to the field so fighters no longer stand inside each other.
- `tests/anim.mjs` captures any move frame by frame in slow motion (A=combo|foe|run|hurt|lance).

## v0.12 · 2026-11-18 — the surface in real 3D
- **Everything above the rock is now real 3D**, in the flat-shaded low-poly look used in Guttercrown: lit by one sun, with shadows on the ground, distance fog, a drawn sky and glow for fire and steel. Cinderwell stays 2D pixel art, so the two halves of the story no longer look like the same game.
  - Guttercrown uses three.js from a CDN. That could not be loaded or tested in the build workspace, so this renderer is plain WebGL with no library (`src/g3.js`). It needs no download and works offline. Without WebGL, or with `#no3d` in the URL, the game falls back to the earlier 2.5D scenes.
  - Fighters are built from boxes every frame: jointed legs with knees, a chest and waist, shoulder plates, a two-part off arm, a sword arm that swings from the shoulder, capes and sash tails that stream, hair, helms, circlets. Run, three different cuts, a leaping overhead, wind-up, stagger, roll, fall and tumble are all posed in code.
  - Places: the valley (pines, pavilions, rocks, the white keep on its ridge, snow peaks), the ford at dusk (a river, reeds, long shadows), the keep at dawn (a marble platform above a sea of cloud, towers, braziers).
  - **They are being watched.** A dais of Proctors grades the valley; the standards of all twelve Houses fly behind every field; fallen cadets and dropped blades lie where the lines met; a second battle goes on in the background. On the keep, Celestine watches the duel from a dais with two Wardens. Kael says so.
- **Camera**: flies in at the start of a fight, tilts on heavy hits, cuts from side to side during ELEVEN, looks up for launches, and circles Kael on the last blow.
- **Fury you can see**: from about half a bar the sky, sun and fog bleed toward red; at full his eyes burn, his blade runs hot, the nearest enemies recoil ("WHAT IS HE?"), and the camera punches in.
- **Fight readability**: a violet ring marks Kael and a red ring marks who he will hit; strikes close the gap to a target that is just out of reach; a flashing arrow at the screen edge warns of an attack coming from off screen; the fight camera sits a little higher.
- Checked in a software-rendered test browser only. Frame rate on a real phone GPU is not measured.

## v0.11 · 2026-11-18 — the Assay: 3D fights, rage, flash-forwards
- **Fights are rebuilt as a pseudo-3D arena brawler.** A perspective floor, big fighters, and a camera that follows the action, pushes in on heavy hits and drops low for the big moments. Impact frames, speed lines, shockwaves, launches, portrait health bars.
  - Three different cuts in the chain; the third is a leaping overhead. Sword arms swing from the shoulder with a crescent trail; fists jab, cross and uppercut.
  - **Fury.** Kael's fury bar fills as he hits and is hit. When it is full, hold A: **ELEVEN**, an eleven-hit rush, one for every second the furnace doors stood open. Cut-in on his eyes, a rage-red void with the count called out, an inverted impact frame and a pillar of fire on the last blow.
  - Foes: cadets, lancers, a captain, a duelist who blinks behind you, Wardens. Allies fight beside you. Waves.
  - **Memory Arts.** At set points in a fight (an enemy's health, a new wave) a memory cuts in as two slanted panels: the memory itself, drawn from the story panels (the washer, the fever ward, Lift Zero, the furnace), and Kael's face. It names the blow, says its line, and becomes a choreographed attack: a launch with three cuts in the air and a slam, or six passes straight through the enemy that all go off at once. This is how the fights carry the story.
  - Fury shows on screen as it builds: the edges of the picture redden from 40 percent, and at full there is a heartbeat, embers up both sides, and every strike hits harder.
  - **Kael narrates during fights**, on a clock and on events (first hit taken, fury, ELEVEN, the enemy at half). It never pauses the fight.
- **The Assay** (our own proving war, four years on: Kael gilded and passing as an Accredited cadet). Told the opposite way from Cinderwell: daylight, hard cuts, a moving camera, captions that do not wait.
  - **Opening**: a film-style sequence before the title menu, after the two studio logos. Credits over picture (North Coast Studios presents, in association with E Concepts). It starts below, in the dark: Seren walked to the furnace, the eleven seconds counted out loud, the doors closing. Then "SO I WENT UP", lightning, and the Assay in daylight at full speed, ending on the title. About 40 seconds; any button skips.
  - **The Valley**: New Game now opens on a playable battle with two allies and two waves, then cuts four years back to the world panel.
  - **The Ford**: plays between Day 1 and Day 2. Captain Vant; first sight of Lucan Aurel, the High Auditor's son.
  - **The Keep**: plays at the end of Day 2. The duel with Lucan.
  - His aura grows from one battle to the next. These fights cannot be lost and can be skipped from the pause menu.
- **Present day**: the Ember Ring bouts use the new fights. If Kael runs for Seren at the furnace he now gets his three steps: a short fight against a Warden that cannot be won.
- **Saves**: an autosave plus three slots with day, place, play time and date; overwrite confirmation, delete, and the existing text export and import. The game says so plainly when the browser cannot keep saves.
- **Checkpoints (dev)** on the title menu: twelve jump points across the slice.
- Assay scenery: pavilions, swaying grass and reeds, cloud shadows crossing the field, a background melee behind every battle, glints on the river and ripples round anyone standing in it, braziers and reflections on the keep's stone, petals and embers in the air, capes that stream when fighters move.
- New music track for battles. New 16×28 armoured cadet sprites.
- The final Ember Ring bout has more health (now 39) because the new attacks hit harder; a mashing bot still loses it and a dodging bot wins.
- Tests: `ff.mjs` (plays each battle with a bot), `sup.mjs` (the super), `flow.mjs` (opening, new game, furnace fight), `dev.mjs` (every checkpoint, save slots), `arts.mjs` (the Memory Arts). Add `#noff` to the URL to skip the opening and flash-forwards.

## v0.10 · 2026-11-17 — playtest round: bugs, the heist, animation
Found by stepping through every cutscene frame, walking the heist with a bot on real inputs, and profiling on a throttled CPU.
- **Bugs fixed**
  - Cutscenes froze while a line of dialogue was up: actors stopped walking, story panels stopped animating, and screen flashes hung on screen (the furnace panel stayed washed orange). Everything now keeps moving under the text.
  - The Lift Zero panel was blown out to white; the three figures are visible now.
  - Dialogue covered the actors in most scenes. The camera now frames cutscene action above the dialogue box.
  - The opening world panel dropped to about 17 fps on a slow phone (it redrew 14,000 rectangles a frame). Backgrounds are cached; every area and panel now holds 60 fps at 6x CPU throttle.
  - Story panels were unreadable in portrait. They now keep their focus in the middle of the frame.
  - Portrait stealth hint overlapped the objective.
- **The heist was not a challenge**: a cautious bot walked straight down the middle of the bay to the relay in under seven seconds without ever waiting. Patrols are redesigned so their lanes interlock:
  - the Night Proctor walks the middle of the bay end to end and looks up and down at each end
  - a second lamp walks the centre column and looks left and right at each end
  - the Watchman stands by the relay and turns all the way round, so the relay hold has to be timed
  - cutting the relay sends the Night Proctor to the north lane, right past Bank Seven
  - a short grace period after each reset; after three catches Seren knocks something over and every lamp goes to look
  - the same bot now needs 14 seconds and two close calls by the north route, and gets caught three times going down the middle
- **Animation**
  - Characters blink.
  - Portraits move their mouths while a line types out.
  - Cutscene acting: characters turn to each other, kneel (the audit, the festival), hop, and show emote bubbles (!, ?, ..., hearts at the proposal).
  - Footstep dust, pipes that drip, steam off the noodle pot, lamps that breathe and occasionally gutter, and a rat along the south wall now and then.

## v0.9 · 2026-11-17 — cinematics and stealth (from playtest notes on the prologue)
- **Story panels**: cutscenes can now cut to full-screen illustrated panels and back, so the story is not told only with pans and zooms. Eight panels so far, all animated:
  - the world as Cinderwell is told it (burning surface, six tiers, the Deep Array, rations, Lift Zero)
  - the washer on Kael's palm, and on her finger
  - the fever ward on ration air, and later with the fans up
  - the crime drawn plainly: the sealed Authority line, the starving clinic branch, the bleed between them
  - Lift Zero opening on a kneeling tier
  - the heart-furnace: Seren before it, walking in, the doors closing
  - Kael's face afterwards, ash in his hair
  - the tin, the washer and the invoice
- **More exposition**: the game now opens on the world panel with Kael narrating what Cinderwell is, who the Authority are, and what the punishment for stealing air is. The tin is now a scene, not a text card.
- **Guards sweep**: every lamp turns smoothly through its arc instead of snapping between four directions. A guard who hears a bolt does a full, slow look around.
- **Detection meter**: being caught is no longer instant. An eye meter fills while a lamp is on you (faster up close), the cone turns red, a heartbeat plays, and it drains when you break line of sight. Surviving a near miss gets a line from Seren (or Ivo and Tavi at the festival).
- **Hold to work**: cutting the audit relay and hanging the lantern now take about two seconds of holding A while standing still, with a progress bar. You can let go, hide, and come back.
- Dialogue shrinks to a slim caption strip over story panels.

## v0.8 · 2026-11-17 — art pass (no new content)
- Tiles redrawn: hand-laid flagstones in the square, riveted deck plates in the bays, floorboards with grain at home, packed dirt in the tunnel, steel grating with frames. Every surface has a lit top-left edge and a dark bottom-right edge.
- Walls: dressed stone courses with timber props, iron panels with girders and rust in the bays, lumped cave rock with ore glints around every room. Walls now cast contact shadows on the floor.
- Characters: all workers redrawn at 16×20 with three-tone shading, real faces, hands, boots, hair highlights and soot. The Accredited are now 16×28 so they still tower.
- Props redrawn with lit tops, dark sides and hardware: crates, barrels, benches, the noodle stall, lamp posts, Ivo's cart, pipes, doors, the clinic door, the heart-furnace, the Pillar plinth, conveyor, cots. Blocking props cast shadows.
- Lift Zero's gate is now white steel with gold trim and the sun-eye emblem: the one clean thing in the square.
- Old tunnel: brighter, with rails, an ore cart, a proper rockfall and more lamps.
- Menus, dialogue box, objective and toasts are framed like engraved brass plates.
- The Ember Ring is fought on the square's flagstones.
- Second polish round (v0.8.1):
  - Bay floors are now large deck plates with seams and corner rivets instead of a busy per-tile grid.
  - More props redrawn: Bank Seven (gauges, wheels), Freight Three's shutter, the shift board, bed, table, floor hatch, vents, air canisters, the noodle awning and sign.
  - The pipe puzzle has a brass frame, plated cells and shaded pipes.
  - Camera eases after the player instead of snapping; a soft vignette darkens the screen edges; rounder shadows and a small step bob on walking characters.
  - Fights show the punch: a fist on every strike, for Kael and for foes.
  - Wardens have a visor; the glow on the Accredited is toned down so their detail survives the light beam.

## v0.7 · 2026-11-17 — "First Fire"
- **Day 2 is playable**: the Festival of the First Fire, one year to the night after the wedding. Roughly 30–40 more minutes.
  - Seren left a list in her lantern frame. Kael gathers wire (Ivo), gold (Orin) and a wick (Nell), and collects paper "rays" from up to ten people who loved her. The ray count decides who stands in front of the lantern at the end.
  - Fuse Room C (new map, off Bay 3): Crew Three's lockers, Dace's sealed informant envelope, and a new breaker-balancing puzzle. The "standby" bus turns out to be Lift Zero, charging on Tier 6's lights.
  - Vale's follow-up: what he wrote down about the bleed, and why he struck it.
  - Sull's consequence scene, in three versions (threatened / charmed / ignored on Day 1).
  - The ceremony: Celestine brings the First Fire, drawn from the furnace that burned Seren. Kael chooses how the lantern is lit. Celestine lets slip that she has seen the sun.
  - Stealth finale: hang the lantern on the Pillar past three Proctors. Then the sun on the square, the row, and Lift Zero opening by itself.
  - Dace is alive: new chalk in the old tunnel.
  - End-of-day summary for Day 2, and a short Day 3 epilogue roam.
- **Combat foundation** (`src/brawl.js`): real-time melee for every future fight.
  - A strikes (three-hit chain), B dodges with brief invulnerability.
  - Foes telegraph on the ground. Dodge through a swing and time slows: an "opening" where hits land harder and break guards.
  - Foes guard after a full chain and counter; mashing loses to anyone past the first bout.
  - Handles any number of foes; five foe kinds so far (jab, quick, heavy, baton with sweep and charge, boss with a double strike).
  - First use: the Ember Ring, a three-bout festival fight ring. Bout two is Proctor Sull if Kael threatened him. The last bout is Mara.
- **Map of Cinderwell** in the pause menu: a cutaway that fills in as Kael learns things (Riser 9, Freight 3, the tunnel, what is above).
- **World dressing**: gold-edged sign plates over doors and machines, Authority banners (white, gold sun-eye), a chalk ring and unlit lantern strings in the square on festival day.
- Engine: doors can be locked behind story flags; puzzles can be breaker boards (`kind: 'breaker'`); stealth is reusable (`G.heist = 2`); day-2 scripts wrap day-1 scripts in `src/day2.js`.
- Day 1 text now says the festival is "tomorrow."

## v0.6 · 2026-11-17
- Dialogue portraits:
  - Every speaker gets a 32×32 bust built from their look: soot on the Belowborn; a gold halo, gold eyes and a crown for the Accredited; masked Wardens; goggles, beard and hats as on their sprites.
  - Each character has their own expression (`MOUTH` table in `story.js`).
  - Kael gains a cheek scar if he ran for Seren or spat at Celestine.
  - Accredited names show in pale gold. The portrait is now 72px.
- Idle life: standing characters breathe (a 1px settle every couple of seconds).
- New choice after Bank Seven ("Bleed again"): with Vale pacing nearby, Kael can bleed AUX-9 into the clinic branch again.
  - It's a timed pipe puzzle: 28 seconds, a heartbeat in the last 6, and a red pulse on screen.
  - Success: Vale grows suspicious. The ward fan spins "like a storm," Ada and Nell react, Mara warns him, and the day-end summary records it.
  - Failure: Vale nearly catches him.
  - Refusing: flag `heldBack`.
- Puzzles support `timer` and `onFail`.
- Portrait-mode HUD: objective and stats no longer overlap.

## v0.5
- Cinematic zoom in cutscenes.
- Furnace scene rebuilt: humming, Hollis struck, heartbeat and vignette, 11 memory cards, the Celestine confrontation.
- Heist v2: audit relay checkpoint, Watchman, bolt distraction.
- World dressing: screens, posters, laundry and chains, steam, soot.
- Ashgate citizens; the Fever Ward clinic.

## v0.4
- Leads renamed to Kael Brennick and Seren Holloway.
- Proposal scene, playable heist, public furnace execution, the tin, the fury count, Proctor Sull.

## v0.3
- Renamed from "Below the Sun" to SOOTBORN.
- Defined hero, first cinematic prologue, the Accredited (tall, luminous sprites), Inspector Vale.

## v0.2
- Old Service Tunnel and Riser 9; NPC speech bubbles; time of day; footsteps.

## v0.1
- First vertical slice: one shift in Cinderwell, valve puzzle, crate clue, journal, saves, touch/keyboard/controller.
