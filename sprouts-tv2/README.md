# Sprouts TV 2

Sprouts, finished: the standalone widescreen game, reworked from the review of Nov 18 ("Sprouts: State of the Game").
Also builds as a phone version from the same source.

**Play on a television:** open `games/sprouts-tv2.html` in Chrome or Edge on the PC, press **F** for full screen.
**Play on a phone:** open `games/sprouts-pocket.html`.

![Title](playtest/title.png)

## This is a separate copy

`sprouts-tv2/` started as a copy of `sprouts-tv/` on Nov 19 2026. `sprouts-tv/`, `alt/` and the frozen folders were not
changed. Its saves are stored under `sprouts-tv2:`. Settings has IMPORT A SAVE, which reads (never writes) a Sprouts
TV or Pocket Lantern save in the same browser.

## What changed from Sprouts TV

- **The story has one ending, after the second light.** Four shards make the Lantern whole, and it still skips: that
  is the midpoint. Then the call, the coast, the pier, a flooded lamp room, the Flow Pros job, the lens, and the
  relight at night with everyone there.
- **Marcus on day one.** Flow Pros are locked out of their own job site, so the van is by the west path.
- **Ranger and Scout are people.** Each has a story ask, a line for every turn of the story, and Scout's notebook is a
  page of the Collection that fills in with what the valley finds out.
- **Every story scene is 3D.** 25 scenes, 116 shots (16 story, 9 hidden).
- **Calmer.** Rank-ups, baskets, daily asks and rewards are read out in the evening report, not popped up all day.
- **Things to do after the ending.** The wedding book, expeditions, the notebook, night grubs, rain days.
- **New ways to play.** Photo mode, a second controller as Louie, Louie's morning.
- **Small fixes.** Hints stay in a bottom strip, Erase Everything is in Settings, a VIEW setting, gardeners capped.

The full list, set against the review item by item, is in [CHANGELOG.md](CHANGELOG.md). Everything invented for the
story is in [STORY-NOTES.md](STORY-NOTES.md), marked as Claude's.

## Controls

| | Controller | Keyboard | Phone |
|---|---|---|---|
| Move | left stick or d-pad | arrows or WASD | pad |
| Act (pluck, throw, talk) | A | Z, J or Space | A |
| Call the crew back | B | X or K | B |
| Swap sprout kind | X, shoulders, Back | Shift, Q or E | Select |
| Photo mode | Y | V or I | Photo |
| Pause | Start | Enter or P | Start |
| Louie (player two) | a second controller: stick, A barks, B digs | number pad: 8 4 2 6, 0 barks, + digs | |
| Full screen | (keyboard) | F, or double click | |

## Files

- `build.py` writes both builds. `src/game.js` is the game, `src/sprouts3d.js` the 3D scenes, house, title and photo
  mode, `src/buddies.js` the wild buddies' art. `src/shell.html` is the television page, `src/shell-pocket.html` the
  phone page. One line in `game.js` (`POCKET`) is the only difference between the builds.
- `tests/tv2.js` (48 checks) covers what this copy adds. `tests/tv.js` (34) the television screen and controller.
  `tests/pocket.js` (16) the phone build. `tests/sprouts_coast.js` (183), `sprouts_valley.js` (50) and
  `sprouts_story.js` (17) the game itself. `tests/sprouts_playthrough.js` plays the whole story and prints it in order;
  the last run is `playtest/story-run.txt`.

## Not done, and not tested

- Not played by hand, on a television, on a phone, with a real controller, or listened to. Controllers and touch were
  simulated in the tests.
- `sprouts_story.js` is driven by an autopilot and fails about one run in ten when a stray card cuts in.
- The older copies (`alt/` and `sprouts-tv/`) still exist and do not get these changes.
