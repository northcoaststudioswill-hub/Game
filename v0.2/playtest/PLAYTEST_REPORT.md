# Rootdeep v0.2 playtest report

**Build:** `v0.2/games/pocket-lantern_2026-11-14_v20_wip.html` (backup SHA-256 in `v0.2/README.md`)
**Date:** Nov 14 2026
**Device:** headless Chromium sized as an iPhone 16 Pro Max (440 x 956, a 240 x 304 game screen)
**Tester:** Claude, driving the game with real button presses through a scripted player, plus targeted checks

## How it was played

A fresh save, started from the title screen. The intro and Erin's welcome were watched in full, not skipped.
Then the bot walked to the Root Door and played runs the way a player would:

- It chased the nearest foe and attacked.
- It used X, Y and the super, and dashed away when its health was low.
- It walked over sprouts, smashed pots, took boons and left shops, and alternated which door it chose.

Between runs it spent all its Moondew at the Mirror. It never talked to anyone in the Hearth and has no pathfinding (it walks in straight lines), so treat its difficulty readings as a floor, not a verdict.

## Results

| Run | Mirror ranks going in | How far | Ended by | Hits taken | Moondew home | Best sprout string |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | none | chamber 5 | Mothshade | 8 | 42 | 1 |
| 2 | 1 in six upgrades | chamber 6 | the bot got stuck (see below) | 11 | n/a | 3 |
| 3 | 1 in six upgrades | chamber 9 | Mothshade | 13 | 98 | 5 |
| 4 | 2 in six, 1 Luck | **escaped (12)** | n/a | 13 | 142 | 5 |
| 5 | 3 in five, 2 Mending, 1 Luck | chamber 10 | Mothshade | 16 | 137 | 6 |

Lifetime after the session: 139 foes felled, 9 bosses, 27 sprouts found, 12 sprouts banked, 1 escape, deepest chamber 12.
The Sprout King unlocked along the way (a full string of 6 buds).

**Chamber pace:** most chambers cleared in 4 to 10 seconds; the slowest regular chamber took about 16; boss chambers took 7 to 20.
**Frame time:** median 16.7 ms, 95th percentile 16.8 ms, worst 16.8 ms (a locked 60 fps on desktop Chromium; the iPhone is untested).
**Errors:** none in the whole session.
**Intro:** about 22 seconds watched end to end, then straight into Erin.

## What worked

- **The first five minutes.** The intro, Erin's welcome the moment it ends, Marcus's "door's RIGHT there, bro" bubble, the objective bar and arrow, then straight down the Root Door. Nothing to hunt for.
- **Tips in chamber 1** arrive one at a time and read cleanly ("MOVE WITH THE D-PAD", then "A: ATTACK. IT AIMS ITSELF").
- **The death cinematic and screen.** The rope rescue reads instantly. The screen named the killer ("THE MOTHSHADE GOT BEHIND YOU") and the milestones landed at the right moments ("FIRST FALL", "NEW DEEPEST: CHAMBER 9", "50 FOES FELLED, EVER", "10 SPROUTS FOUND, EVER +5 DEW").
- **Progression you can feel.** Each run went deeper as Mirror ranks stacked up, and the escape on run 4 played its dawn screen.
- **The Hearth after a fall:** the objective moved to "SPEND MOONDEW AT THE MIRROR" and the cast had their yellow "!" marks.
- **Stability:** five runs, about 13 minutes, no errors, steady frame time.

## Bugs

| # | What | Status |
| --- | --- | --- |
| 1 | **Boon cards cut descriptions to one line** ("Cast +14%. Dash power 14.…") whenever another card's text was short. The card sizing took the shortest description instead of the longest. | **Fixed** in this build |
| 2 | Run 2 sat in chamber 6 (the Flooded Vault) for 3.5 minutes without dying or clearing. | **Not reproduced.** 40 replays of chambers 5 to 7 with a perfect fighter all cleared, and no foe was ever stuck inside a prop. Most likely the bot's straight-line walking got hung up on a prop. Worth watching for in real play. |

## Balance and feel (observations only: difficulty is unchanged, as asked)

1. **The Mothshade did all three killings.** It blinks behind you, and the shimmer warning comes very late. For a player it's the foe most likely to feel unfair. Options for later: a longer shimmer, or a short freeze after it lands.
2. **Rooms are short.** Most chambers last 4 to 10 seconds, so a winning run is only about 2 minutes of fighting. The design goal (Hades-level depth) suggests longer, denser rooms in later areas.
3. **The Mirror is generous.** 42 Moondew from the first fall bought a rank in six different upgrades, and two ranks each were enough for a scripted player to escape. Real hands will tell, but the curve may flatten fast.
4. **Busy moments:** entering the Vault after the Grub Mother showed the area banner, "GRUB MOTHER FALLEN!" and a tip at the same time. Readable, but a lot at once.

## Not covered by this playtest

- The bot didn't talk to the cast, so the growing dialogue was checked by a separate script: topics unlock, play once and mark "heard".
- It also didn't use the Ledger, Exchange, Keepsakes, Armory, Pact or Capsules. Those have their own scripted checks, which all pass (see the handoff).
- **iPhone Safari.** The text-placement fix, touch controls and frame rate need your phone to confirm.

## Screenshots in this folder

`01_intro`, `02_erin_welcome`, `03_hearth_first`, `04_chamber1`, `05_boon` (taken before bug 1 was fixed: it shows the cut-off card), `06_shop`, `07_vault`, `08_death_cinematic`, `09_death_screen`, `10_escape`, `11_hearth_after_fall`
