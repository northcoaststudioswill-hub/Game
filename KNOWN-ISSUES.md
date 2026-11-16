# Known issues and what is not done yet

Updated Nov 16 2026. Newest game first. "Not confirmed on iPhone" applies to everything until Will plays it there.

## Sproutwild (cartridge 5, v8.0)

### Known bugs
- The garden shows two slightly different looks for growing sprouts: the first three seeds (new look) and later
  garden sprouts (older look).
- One real-time bug catch missed during testing (a step-by-step run caught 4 of 4). Watch for throws at bugs that
  miss.
- Louie fetching lost sprouts has not been re-checked since his v7.8 rework.

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
