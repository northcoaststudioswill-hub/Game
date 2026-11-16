# Known issues and what is not done yet

Updated Nov 16 2026. Newest game first. "Not confirmed on iPhone" applies to everything until Will plays it there.

## Sproutwild (cartridge 5, v8.1)

### Known bugs
- Garden plots (v8.1): the growing sprouts now share the opening's look in code, but in real-time frames I could not
  confirm the stalk and head on a planted plot (only the soil mound). Check on the phone.
- The lab check "a sprout thrown at a bug catches it" fails now and then (2 of 7 runs on v8.1; 0 of 4 on main after
  its first run). Its bug position is random. Not explained yet; rerun the lab 3 to 4 times before trusting a single run.
- One real-time bug catch missed during testing (a step-by-step run caught 4 of 4). Watch for throws at bugs that
  miss.

### Fixed in v8.1
- Louie fetching lost sprouts: he started too late for the sprout's 3.5 s return. Re-checked stepped (70 to 240 px) and
  in real time.
- Returning sprouts pinned against a wall never came home. Now they fly home after 0.8 s.
- Louie's "FOUND ONE!" bubble ran off the right edge; now it stays on screen.
- Garden sprouts and the opening seeds had two growing looks; now one (see the garden item above for what is unconfirmed).

### Not tested in play yet
- Night-only bugs (lightning bug, luna moth), selling bugs to Pip, turning bugs into resources.
- Watching a starter evolve at Lv16 in a battle.
- Petting Louie at Sunkeep in real time (checked by the automated test only).

### Balance to check in a long session
- Crop timers (berries 60 s, fiber 90 s), building times, catch odds after the first catch, starter strength.
- About 40% of the first three minutes is watching scenes rather than playing.

### Not built yet
- A second new area (the Meadow's south end is a dead end).
- More Ohio-lore creatures (ideas: the Haserot Angel, Franklin Castle, Helltown, the Guardians of Traffic).
- Sorting or searching the Data Center's buddy box.

Full history and fixes: [`alt/src/sproutwild/CHANGELOG.md`](alt/src/sproutwild/CHANGELOG.md).

## North Coast Knockout (cartridge 2)

- Paused between Fable passes. Open items are in [`alt/CHANGELOG.md`](alt/CHANGELOG.md).

## Rootdeep (cartridge 3)

From [`v0.2/CHANGELOG.md`](v0.2/CHANGELOG.md), still open:
- The Mothshade caused every death in the bot playtest; its blink-behind may feel unfair.
- Rooms are short (4 to 10 seconds); difficulty untouched until Will has played more.
- The music is a placeholder synth loop; it needs a William Cohen track.

## Sprouts and Patch & Plate (cartridges 1 and 4)

- Their William Cohen songs only play on claude.ai; the GitHub Pages copy and downloads are silent for them.
  Plan in [`NEEDS_UPDATE.md`](NEEDS_UPDATE.md).

## The whole console

- `docs/index.html` (the public GitHub Pages copy) still has the 4-cartridge build. It is updated only when Will says so.
- The five-cartridge build has not been cut as a numbered release (no share zip yet).
