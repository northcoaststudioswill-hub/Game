# SOOTBORN — changelog

## v0.8 · 2026-11-17 — art pass (no new content)
- Tiles redrawn: hand-laid flagstones in the square, riveted deck plates in the bays, floorboards with grain at home, packed dirt in the tunnel, steel grating with frames. Every surface has a lit top-left edge and a dark bottom-right edge.
- Walls: dressed stone courses with timber props, iron panels with girders and rust in the bays, lumped cave rock with ore glints around every room. Walls now cast contact shadows on the floor.
- Characters: all workers redrawn at 16×20 with three-tone shading, real faces, hands, boots, hair highlights and soot. The Accredited are now 16×28 so they still tower.
- Props redrawn with lit tops, dark sides and hardware: crates, barrels, benches, the noodle stall, lamp posts, Ivo's cart, pipes, doors, the clinic door, the heart-furnace, the Pillar plinth, conveyor, cots. Blocking props cast shadows.
- Lift Zero's gate is now white steel with gold trim and the sun-eye emblem: the one clean thing in the square.
- Old tunnel: brighter, with rails, an ore cart, a proper rockfall and more lamps.
- Menus, dialogue box, objective and toasts are framed like engraved brass plates.
- The Ember Ring is fought on the square's flagstones.

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
