# Pocket Lantern ALT — the main line (five cartridges)

> **As of Nov 15 2026 this folder is the main version of the game to build on.** It started as an experimental fork of
> v0.3, became where Knockout was reworked, and now also holds Sproutwild as cartridge 5. Shelf: Sprouts, Knockout,
> Rootdeep, Patch & Plate, Sproutwild. The paragraphs below about being a fork are still true of how it is built and saved.

An alternate version of the whole console for trying bigger changes **without touching anything outside `alt/`**.
v0.1, v0.2 and v0.3 are not edited, rebuilt, or overwritten by anything in here. Keep what works, throw away what doesn't,
or lift single changes back into the main line (each one is listed in `CHANGELOG.md`).

- **Play it:** `games/pocket-lantern-alt.html` (one file, open it in a browser).
- **What's different:** [`CHANGELOG.md`](CHANGELOG.md)
- **Starting point:** v0.3 exactly. Before any ALT change, `build.py` produced a file byte-for-byte identical to
  `v0.3/games/pocket-lantern_2026-11-14_v21_wip.html`.

## Its saves are separate

Every save key gets a `pl-alt:` prefix (a few lines at the top of `src/shell.html`). Playing ALT in the same browser as the
real game can't read or overwrite Erin's Patch & Plate days, Rootdeep runs, or anything else. It also means ALT starts fresh.

## Files

| Path | What it is |
| --- | --- |
| `src/shell.html` | The page: console body, CSS, buttons, the save-key prefix. `/*@...*/` marks where the code goes. |
| `src/console.js` | The console and Sprouts (cartridge 1). |
| `src/knockout.js` | North Coast Knockout (cartridge 2). Most of the ALT work is here. |
| `src/rootdeep.js` | Rootdeep (cartridge 3), plus the Lantern menu (stats, achievements). |
| `src/patchplate.js` | Patch & Plate (cartridge 4). v0.5 since Nov 17 2026 (v0.4 the Sunkeep update, v0.5 big moments and kitchen buddies); v0.3's copy is untouched. |
| `src/sproutwild/` | Sproutwild (cartridge 5): eleven files, see its own `README.md` and `CHANGELOG.md`. |
| `backups/` | Frozen builds. Never edit. |
| `tests/sproutwild/` | Sproutwild's checks and playtest scripts. |
| `build.py` | `python3 alt/build.py` assembles `games/pocket-lantern-alt.html`. The 13 MB of embedded music is read from the v0.3 build (read-only), not copied. |
| `tests/ko_lab.js` | Knockout lab: feel metrics (jump arc, pose snap, hit slide, juggles), frame sheets, the new modes, a text audit of every menu. |
| `tests/fable_lab.js` | Fable pass 1: parry, wall bounce, K.O. frame, stances, rules and Trials (20 pass/fail checks, sheets in `playtest/fable/`). |
| `tests/sprouts_tour.js` | Plays Sprouts in real time from a fresh save by following the objective marker. |
| `tests/lantern_shots.js` | The Lantern menu's stats, achievements and ticket pages with sample saves. |
| `tests/pp_test.js` | Patch & Plate test (107 checks): v0.3's 76 plus the v0.4 and v0.5 checks. |
| `tests/v02/` | v0.2's Rootdeep/console tests, copied so their screenshots land here instead of in `v0.2/`. |
| `playtest/` | Screenshots and frame sheets from the runs above. |

Run tests from the repo root, after `python3 alt/build.py`:

```
node alt/tests/ko_lab.js                                   # all Knockout sections; ONLY=metrics,modes,text to pick
node alt/tests/fable_lab.js                                # the Fable-pass checks
node alt/tests/pp_test.js
node alt/tests/v02/roguelite_loop.js alt/games/pocket-lantern-alt.html
```

## Keeping it in step with the main line

ALT is a snapshot of v0.3, not a live build of it (v0.3's `build.py` pulls from v0.2 every time; ALT doesn't).
If Rootdeep moves on in `v0.2/src/rootdeep.js`, those changes don't arrive here by themselves. To take ALT's changes back
the other way, each change in `CHANGELOG.md` names the file and what it touches, so it can be copied over one at a time.

## Nothing here is phone-confirmed

Everything was checked in headless Chromium at iPhone 16 Pro Max size (440x956). Will's rule stands: a change isn't done
until it's been played on the phone.
