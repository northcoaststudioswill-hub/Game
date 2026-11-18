# Starhaven v0.1.7 — Wren moves smoothly (Nov 18, 2026)

Same content as v0.1.6. One fix: how Wren looks when she moves.

**Play:** open `starhaven-v0.1.7.html` in a browser, or use the shared Claude link. **This folder is frozen. Never edit it.**

## Changed

- **She no longer snaps between poses.** Standing, running, jumping, falling, striking and dashing used to switch
  in a single frame. Each pose now eases into the next.
- **She no longer ticks from side to side.** She and the camera were each rounded to whole pixels separately, so
  while running she jittered a pixel back and forth against the screen. She is now drawn exactly where she is.
- **She no longer blinks out after a hit.** For the safe time after a hit she vanished every few frames (and that
  time got longer in v0.1.5, so it got worse). She now shimmers and stays visible.
- **A real walk and run.** Stride, lean, arm swing and cloak scale with her speed; knees fold as a leg comes forward
  and straighten to meet the ground.
- **One continuous jump.** Rising, the top and falling were three fixed poses switched at set speeds. They are now one
  arc that follows how fast she is moving up or down.
- Standing still, she breathes and her cloak moves.

## Checked

Automated: 58 play checks, 19 menu checks, smoke and random input, no errors. Her run and jump looked at frame by
frame. **Not played by hand or on a phone**, and smoothness is exactly the thing that needs a person's eye.

## Questions for the next play

1. Does she still look choppy? If so, when: running, jumping, turning, striking, or after being hit?
2. Is the shimmer after a hit clear enough that you know you are safe?
