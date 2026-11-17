# SOOTBORN — changelog

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
