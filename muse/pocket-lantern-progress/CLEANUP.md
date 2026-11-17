# Pocket Lantern — easy code cleanup (static read, Nov 17, 2026)

Found by reading the code on `main`, without opening or playing any game. Nothing has been changed yet.

## Safe to remove (no behaviour change)

1. **12 functions nothing calls.** Each name appears once in the whole console file: `btSay`, `cineActor`, `fFetchTick`, `godCore`, `rdVig`, `wClaimItem`, `wDrawFol`, `wGateArt`, `wLesson`, `wStartWild`, `wThrowSprout`, `wWorkerCap`.
2. **74 dead copies of Pocket Lantern functions.** 65 names are declared more than once in Sproutwild's build. Only the last declaration runs, so the earlier ones are unreachable. The biggest block is in `sw-module.js` (37 dead copies). Others are in `sw-story.js` (9), `sw-field.js` (5), `sw-scene.js` (5), `sw-front.js` (3), `sw-walk.js` (3), and a few more. The Sproutwild README says earlier bodies are kept "for reference", so this needs Will's yes before removing.
3. **Two dead branches.** `sw-pace.js:25` is `if(false){...}`, and `sw-module.js:531` begins `if(false&&...)`. Both can be deleted.

## Needs a decision

- **Keep or drop the "for reference" copies** (item 2). Removing them is safe for the game, but it deletes history that the author wanted to keep. A git log already has them.
- **Cross-cartridge names.** Several function names repeat across cartridges (for example `draw`, `update`, `text`). They're probably scoped per cartridge, so they're not a bug, but they're worth checking before any rename.

## How it would be checked

After any removal: rebuild with `python3 alt/build.py`, run `node alt/tests/sproutwild/field-lab.js` (124 checks), and confirm the game still loads with no page errors. Nothing here changes what the player sees, so a clean lab run is enough to show it.

## Not checked

- Knockout, Rootdeep and Patch & Plate for dead code (their names were in the whole-bundle scan, but duplicates weren't checked per cartridge).
- Sootborn and Thornwatch.

## All games (static read, checked against each game's full file)

| Game | Dead functions | Duplicate copies | Dead branches | Notes |
| --- | --- | --- | --- | --- |
| Sproutwild (Pocket Lantern) | 12 | 74 (65 names) | 2 | Sections above. |
| Rootdeep (`alt/src/rootdeep.js`) | 3: `cineActor`, `godCore`, `rdVig` | 0 | 0 | Each appears once in the whole console. |
| Thornwatch (built file, its `tw` functions) | 2: `twHeart`, `twRangeCirc` | 0 | not checked | Only the built file is in the repo, so this is the built code, not its source. |
| Knockout (`alt/src/knockout.js`) | 0 | 0 | 0 | |
| Patch & Plate (`alt/src/patchplate.js`) | 0 | 0 | 0 | |
| Console shell (`alt/src/console.js`) | 0 | 0 | 0 | |
| Sprouts original (`src/sprouts.js`) | 0 | 0 | 0 | Read-only reference. |
| Knockout original (`src/knockout.js`) | 0 | 0 | 0 | |
| Sootborn (`sootborn/src/`) | 0 | 0 | 0 | |
| Starhaven | n/a | n/a | n/a | Only design docs in the repo, no code. |

**Checked and cleared as false alarms:** `setF`, `g3Draw`, `g3Update`, `lanDraw`, `lanUpdate`, `lanPlayed`, `ctext0`, `text0`. They're used elsewhere in the console, or called once.

**Fix list, per game (none applied yet):**
- Sproutwild: the 12 dead functions, the 2 dead branches, and (with your yes) the 74 dead copies.
- Rootdeep: delete `cineActor`, `godCore`, `rdVig`.
- Thornwatch: delete `twHeart`, `twRangeCirc` in its source, when it's next rebuilt.
