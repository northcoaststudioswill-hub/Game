# Pocket Lantern

A pocket game console in one HTML file, by North Coast Studios. Five game cartridges on one shelf.

**Play the newest build:** [`alt/games/pocket-lantern-alt.html`](alt/games/pocket-lantern-alt.html)
(download it and open it in a browser, or use the shared Claude link Will has).

> **New here? Start with this page, then [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md).**
> Everything new is built in the [`alt/`](alt/README.md) folder. The other folders are frozen older versions,
> kept on purpose so nothing is ever lost.

## The five games (cartridges)

| # | Game | What it is | Status | Changelog |
|---|------|-----------|--------|-----------|
| 1 | **Sprouts** | Pikmin-style garden game: throw sprouts, grow the garden, Louie the dog helps | Stable | [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (Sprouts section) and [`v0.35/CHANGELOG.md`](v0.35/CHANGELOG.md) |
| 2 | **North Coast Knockout** | 2D fighter with Will, Marcus, Erin, King Bibi and friends; supers, cinematics, arcade tower | Paused (between Fable passes) | [`alt/CHANGELOG.md`](alt/CHANGELOG.md) |
| 3 | **Rootdeep** | Roguelite dungeon crawler | Stable | [`v0.2/CHANGELOG.md`](v0.2/CHANGELOG.md) |
| 4 | **Patch & Plate** | Erin's cooking and garden life game, set at Sunkeep in Sproutwild's valley | v0.4 (Nov 17 2026) | [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (v0.4), before that [`v0.3/CHANGELOG.md`](v0.3/CHANGELOG.md) |
| 5 | **Sproutwild** | Creature collector: Pikmin + Palworld + Pokemon, set in an Ohio-lore valley | **In active development (v8.0)** | [`alt/src/sproutwild/CHANGELOG.md`](alt/src/sproutwild/CHANGELOG.md) |

## Latest updates

- **Patch & Plate v0.4, the Sunkeep update (Nov 17 2026):** the stand is in Sproutwild's valley now (same universe,
  separate saves): the Great Lantern on screen, the Elder and Pip as customers, a 13th day (LANTERN NIGHT), valley talk in
  the lines. Details: [`alt/CHANGELOG.md`](alt/CHANGELOG.md).
- **Sproutwild v8.0 (Nov 16 2026):** an opening you earn (Louie's berry lights the Lantern, seeds grow in the
  garden), Erin walks you out and guides your first catch, Ohio-lore starters with a reveal, garden plot crops,
  Data Center, bug collecting, Crooked Hollow, cottage party cinematic.
  Full history: [`alt/src/sproutwild/CHANGELOG.md`](alt/src/sproutwild/CHANGELOG.md).
  Handoff for the next work session: [`alt/src/sproutwild/HANDOFF.md`](alt/src/sproutwild/HANDOFF.md).
- **Sproutwild joined the console as cartridge 5 (Nov 15 2026):** [`alt/CHANGELOG.md`](alt/CHANGELOG.md).
- **Last numbered release: v0.35 (Nov 15 2026),** four cartridges with the reworked Knockout. See [`LATEST.md`](LATEST.md).

## Where things are

| You want... | Go to |
|---|---|
| The newest playable game | [`alt/games/pocket-lantern-alt.html`](alt/games/pocket-lantern-alt.html) |
| What changed, game by game | the Changelog column above |
| Bugs we know about and what is not done yet | [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md) |
| Sproutwild design notes and research | [`alt/src/sproutwild/DESIGN-v7.md`](alt/src/sproutwild/DESIGN-v7.md) |
| Sproutwild playtest notes | [`alt/src/sproutwild/PLAYTEST-NOTES-v7.md`](alt/src/sproutwild/PLAYTEST-NOTES-v7.md) |
| Screenshots of each Sproutwild version | [`alt/src/sproutwild/shots/`](alt/src/sproutwild/shots/) |
| The dev board (visual timeline for the team) | [`dev-board/README.md`](dev-board/README.md) |
| Every older version (frozen, never edited) | [`LATEST.md`](LATEST.md) has the table: `v0.1/`, `v0.2/`, `v0.3/`, `v0.35/` |
| The public web copy (GitHub Pages) | [`docs/`](docs/) (still the 4-cartridge build; updated only when Will says so) |
| The old front page from before v0.2 | [`README-old-pre-v0.2.md`](README-old-pre-v0.2.md) |

## A note on GitHub branches (why things can look out of date)

GitHub keeps work on **branches**, like separate copies of the project. The page you see first on GitHub shows the
**`main`** branch. Recent work happens on a working branch (right now `claude/festive-knuth-f30w4u`) and only
shows on the front page after it is **merged** into `main`. If this page looks old, use the branch dropdown near the
top left of the GitHub page and pick the working branch, or merge it into `main`.

## For developers

- Build the newest version: `python3 alt/build.py` (writes `alt/games/pocket-lantern-alt.html`).
- Sproutwild tests: `node alt/tests/sproutwild/field-lab.js alt/games/pocket-lantern-alt.html`.
- Rules: never edit or delete the frozen version folders or `backups/`; every change gets a changelog entry.
