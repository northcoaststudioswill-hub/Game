# SOOTBORN — Story bible
Book One · The First Shift. Current build: v0.6 (see CHANGELOG.md).

## Direction
- Standalone game; not a Pocket Lantern cartridge.
- Spiritually Red Rising, legally distinct (original names, no color castes), so a Steam release stays possible.
- Keep refining the slice: richer maps, lore, characters, grit and polish.
- Cinematics that read clearly; the hero's pain and anger must land; the play itself must feel fun.
- The superiors are glorious, pristine and majestic. We are filth.

## Title
SOOTBORN ("soot" is the Authority's slur; the title reclaims it). A card game called "SootBound" is in development on itch.io, so run a trademark check before selling.

## Core cast
- Kael Brennick: valve tech, Crew Three. Charming, cocky, brilliant, hungry.
  - Drive set in the prologue: Heart / Pride / Hunger.
  - A hidden fury count grows with angry choices.
- Seren Holloway: Kael's wife ("pressure-bound" with a brass washer ring). Crew Three runner who paints suns.
  - She took the blame and was walked into the heart-furnace.
  - At the door: "Be too much for THEM. Balance the bank. And don't you DARE stop breathing."
- Tavi: Kael's younger sibling. Saved by the stolen air; forced to watch the commitment.
- Mara Venn (foreperson; married them) and Ivo (best friend): both held Kael down.
- Nell: runs the Tier 6 fever ward. Forty kids breathing because of Seren.
- Ward kids:
  - Pip: "Is the sky blue?"
  - Mosi: drew Seren with a sun for a head; Kael can keep the drawing.
  - Ada: "Is she coming back to fix the fan?"
- Ashgate citizens:
  - Hollis the welder: struck by a halberd for humming at the commitment.
  - Marrow: air rations docked for humming.
  - Old Fen: a coughing beggar.
  - Kit: a runner ("Freight Three goes up nine floors. The sign says six.").
- Dace Morrow: Seren's partner; kept investigating, then vanished.
- Inspector Vale: Cinderwell-born, raised to grey and a silver pin; writes everything down.
- Proctor Sull: scrubs Seren's sun off the Pillar.
- Night Proctor and Night Watchman: the heist guards.
- High Auditor Celestine Aurel: luminous contempt.
  - "Anger is for equals."
  - "Balanced."
  - "Grief is a luxury item. You will be invoiced."
  - "Everyone does, eventually. From below."

## Lore and world dressing
- Cinderwell (Tiers 4–9) runs the Deep Array. The Authority calls it "the Cinders." Slogan: "Gratitude is breath."
- Authority screens loop GRATITUDE IS BREATH / THE SURFACE BURNS / REPORT AIR THEFT / THE AUTHORITY PROVIDES, with the Watcher emblem (a gold sun with an open eye) between messages.
- Posters:
  - "COMMITTED: S. HOLLOWAY — LET THE ACCOUNT BALANCE" (Kael can tear it down)
  - "REPORT AIR THEFT: 50 SCRIP"
  - "THE SURFACE BURNS"
  - "WORK IS WORSHIP" (with "THEN WHO'S THE GOD?" scrawled underneath)
- Ambience: laundry lines and hanging chains, steam vents, puddles and oil, falling soot.
- Executions are public commitments at the heart-furnace. Families receive a tin with the ash, the ring and an invoice for the fuel. Eleven seconds is a recurring motif.
- Secrets so far: AUX-9 / Riser 9 send air up and warm green air comes down; chilled greens ship to "Meridian Terrace, Tier 1"; Seren asked Orin about the line weeks before Kael touched it; Dace's chalk "STILL FLOWING."

## The crime (playable)
- The clinic was cut to ration air; forty kids were suffocating.
- An Authority-sealed line on Bank Seven carries more air than all of Tier 6. Kael bleeds about 11% of it into the clinic each night and balances it back by dawn.
- Heist, at night in Bay Three:
  1. Cut the audit relay (east wall). This sets a checkpoint.
  2. Reach Bank Seven and solve the "Bleed" puzzle (AUTH line → CLINIC).
- Guards:
  - The Night Proctor walks a lantern loop and looks around at each corner.
  - The Night Watchman stands in place and sweeps his lantern.
  - Their vision cones are drawn on screen; crates and walls block line of sight.
- B throws a bolt: guards within earshot walk over to investigate (shown with "?!"), then return to their routes. Getting seen sends you back to the checkpoint. Seren's distraction helps after three catches.

## Slice flow (~40–50 min)
1. Prologue A: festival proposal → fever, Nell, the plan, Kael's drive.
2. The heist.
3. Prologue B:
   - Clinic fans spin up; three nights pass.
   - Lift 0 audit in the square: Celestine admires "a thief who tidies"; Seren confesses.
   - LAST BELL at the furnace, zoomed in:
     - Tavi made to watch; Crew Three hums the shift song; Hollis struck.
     - Heartbeat and red vignette as the doors open; Seren's last words.
     - Kael's choice: scream / run (halberd) / hold her eyes.
     - The doors close, then 11 black memory cards counted ONE to ELEVEN.
   - Aftermath: falling ash; "Balanced."; Celestine confronts Kael (spit / memorize her / "I'll see you again").
   - Kael: "Every breath I take now is hers. And every breath THEY take is mine."
   - The tin, then the SOOTBORN title.
4. Present day:
   - Home: the tin, Seren's 17 painted suns, Tavi's cot.
   - Square: citizens with lore, Proctor Sull, the commitment poster, the screen.
   - Fever Ward clinic (through the clinic door): Nell, the kids, the ward board "40/40," Seren's handwriting on a canister.
   - Bay: Vale, Bank Seven (then the optional timed "bleed again"), the fuel deduction, furnace flashback.
   - Optional tunnel, crate, Ivo, Tavi, sleep, summary, Day 2 roam.

## Tech notes
- Cinematic zoom: `Cutscene.zoom` renders a smaller window scaled up, so `W` and `H` are `let`.
- `renderOverlay`: letterbox, flash, heartbeat vignette.
- Cutscene step types include `{zoom}`, `{heart}`, `{vignette}`.
- Heist: `World.throwBolt` / `boltLand` / investigate logic in `updateNPCs`.
- Maps carry `overhead` and `screens` arrays.
- Saves are schema v2; v1 saves migrate. No saving during the prologue or heist.

## Not yet tested
Real devices, sound by ear, heist difficulty with a human player.

## Next steps
- Art: the procedural 16px characters are the main limit on "selling the universe." The next big leap is an art pass: 24–32px characters, hand-authored tilesets and more portrait expressions, or commissioned or user-supplied art.
- Fun: the heist is the core "play" moment. Tune it from playtest notes before adding more systems.
- Content: Day 2 (Festival of the First Fire / Seren's lantern), Vale's follow-up on what he wrote down, a Sull consequence scene, Fuse Room C.
