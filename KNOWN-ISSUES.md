# Known issues and what is not done yet

Updated Nov 16 2026. Newest game first. "Not confirmed on iPhone" applies to everything until Will plays it there.

## Sproutwild (cartridge 5, v9.2)

### Known bugs
- "BERRIES planted" stayed up 16 s in one run (too long, not too short). Not looked into yet.
- One real-time bug catch missed during testing in v7.9 (a step-by-step run caught 4 of 4). Not seen since; a wild
  buddy next to a bug takes the aim, which may be what happened.

### Fixed in v9.2
- Erin led you off the road through the trees to your first wild buddy; she now keeps to dirt paths (new paths to the big field and the rocks).
- Erin vanished when she left the Meadow; she now walks to the gate and fades out.
- The three starters bunched up in front of the Lantern steps, under the banner, with labels on top of each other.
- The top row of each wild area (and its exits) sat under the HUD bars; the view now scrolls them clear.
- "How Sunkeep works" still said "win the four gyms"; Town and townsfolk lines still talked about the gym.
- The garden lesson, the cottage party and the alpha scene could start while you were elsewhere; they now wait till you are at the garden, the cottage, or home.
- Real-world names (Ohio, Lake Erie, the Cuyahoga, Grassman) replaced with names from the valley.

### Fixed in v8.9
- A full garden blocked the crop step (no empty plot, no hint).
- Scenes (the cottage party) waited minutes behind chat bubbles and messages.
- The placement screen hid why a spot was refused.

### Fixed in v8.8
- Resting at a Lantern post: the heal message was hidden behind the travel map.
- Lab: the fiber fetch check was flaky (a wild could take the aim).

### Fixed in v8.7
- Sunkeep Lv1 could never finish (crop and buddies missions never counted).
- Nothing pointed you to the first gym after the cottage; the first gym was out of reach for a new team.

### Fixed in v8.6
- Erin walked across the lake; she now walks round water and walls.
- A dialogue line could play twice after being held for a message.

### Fixed in v8.5
- Text covered by scenes, cards or other voices (message queue; one voice at a time). Checked by a real-time autopilot run to the cottage: 0 flags.
- Side areas opened before the gym: now behind a Ranger's barrier until the first Sigil.
- The Meadow was small and Erin's lessons were bunched up: Lower Meadow added, lessons spread out.
- The opening garden bed that vanished: one garden from the start.

### Fixed in v8.4
- Wild name tags overlapped when two wilds were close; only the nearest shows its full name now.

### Added in v8.3
- Squire's Woods south of the Meadow (Lv6-9, LANTERNWISP, STONESQUIRE alpha). Caught a LANTERNWISP by hand in v8.4; the alpha fight checked stepped only.
- Louie's bubble now stays below the top bars and draws over the people.

### Fixed in v8.2
- Garden plots: confirmed growing on screen (seed, shoot, head, bud). The seed is now visible on the brown plot.
- Bug Jar: selling or using a bug now shows the result in the jar itself.
- The lab's intermittent bug-catch failure (a wild buddy beside the bug took the aim in the test).

### Fixed in v8.1
- Louie fetching lost sprouts: he started too late for the sprout's 3.5 s return. Re-checked stepped (70 to 240 px) and
  in real time.
- Returning sprouts pinned against a wall never came home. Now they fly home after 0.8 s.
- Louie's "FOUND ONE!" bubble ran off the right edge; now it stays on screen.
- Garden sprouts and the opening seeds had two growing looks; now one (confirmed on screen in v8.2).

### Not tested in play yet
- Since v9.1 (alphas instead of gyms): Sigils 2 to 4 by hand, the King lowering the dome in real time, Bottie's tower as the final battle.
- Watching a starter evolve at Lv16 in a battle.
- Petting Louie at Sunkeep in real time (checked by the automated test only).

### Balance to check in a long session
- Crop timers (berries 60 s, fiber 90 s), building times, catch odds after the first catch, starter strength.
- About 40% of the first three minutes is watching scenes rather than playing. Title to cottage takes about 6.5 minutes at a slow reading pace (v8.5 autopilot).

### Not built yet
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
