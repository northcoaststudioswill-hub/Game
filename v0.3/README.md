# Pocket Lantern v0.3 (work in progress)

v0.2 plus **Patch & Plate** in cartridge slot 4: Erin's farm stand. v0.2 and v0.1 are untouched.

| Folder | What it is |
| --- | --- |
| `games/` | The working build: `pocket-lantern_2026-11-14_v21_wip.html`. Made by `build.py`; don't hand-edit it. |
| `src/` | `patchplate.js`, Patch & Plate's source. Edit this, then run `python3 v0.3/build.py`. |
| `build.py` | Builds `games/` from the **current v0.2 build** + `v0.2/src/rootdeep.js` + the slot-4 hooks + `src/patchplate.js`. |
| `tests/` | `pp_test.js`: boots all four cartridges, a bot plays all 12 days, a text audit of every screen, save and resume. `node v0.3/tests/pp_test.js` |
| `playtest/` | Screenshots from the test run (iPhone 16 Pro Max size). |
| `handoffs/` | `HANDOFF_v0.3.md`: what Patch & Plate is, how it's wired in, what's invented, what's open. |

## Why v0.3 is built from v0.2 instead of copied

Another session is still working on Rootdeep in `v0.2/`. A copy would freeze v0.3 at today's Rootdeep and
the two would drift apart. `build.py` reads v0.2 fresh every time, so their work arrives here by running it again,
and nothing in `v0.2/` is ever written. Each console hook must match exactly once; if v0.2 changes one of those
lines, the build stops and names it instead of guessing.

When v0.2 is done for good, v0.3 can switch to its own copy (point `BASE` and `RD_SRC` at files inside `v0.3/`).

No frozen backup or share package yet: this is a work in progress until Will and Erin have played it.
