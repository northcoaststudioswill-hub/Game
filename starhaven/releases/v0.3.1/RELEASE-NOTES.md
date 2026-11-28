# Starhaven v0.3.1 — Fixes from the review (Nov 28, 2026)

The Prologue through Chapter 4, in the Fallen Sky world, with the top problems from the playtest review fixed.

**Play:** open `starhaven-v0.3.1.html` in a browser, or use the shared Claude link. **This folder is frozen. Never edit it.**

## What changed

- **Touch buttons no longer overlap.** BOW sat on top of STARFALL, and TALK on top of both, on every phone. BOW now
  sits left of GIFT, and TALK above DASH (sideways) or above everything (upright). A new test shows every button at
  four phone sizes, in both orientations, and fails if any two touch or one leaves the screen.
- **No more bond farming.** Bonds, XP and journal pages won in a chapter were saved at once, but loading restarts the
  chapter, so you could win them again and again. Saves now hold the game as it was at the chapter's start (or its end,
  before the evening), and **Restart chapter** undoes what was won in it. Starlight you spend in the Constellation is
  still kept.
- **Saves are safe to read.** A damaged slot no longer crashes the menu: wrong values become defaults. A slot saved by
  a newer version is shown as such and is not loaded. The slot menu now shows level 7 correctly (it used a second,
  shorter XP table).
- **Leaving the app pauses the game.** Switching apps, locking the phone or closing the tab now pauses, drops held
  buttons and saves playtime.
- **Story continuity.** If Wren refused to believe Rowan wrote the letter, she no longer says on the rooftop that he
  wrote it because of her. The Shadow has its own opening line ("It is only a shadow. Shadows can be shot.") instead
  of the wyrm's. Each evening's +20 bond card now shows during the evening, not over the next chapter's card.
- **Fights.** Hits on the Shadow while it is still rising hurt it but no longer count toward knocking it down
  early. Glasslings you have beaten stay beaten after a knockout, the same rule as the spies.

## Not yet checked

Tested by automated checks and a full bot playthrough only. Not yet played by hand or on a real phone.
