# Note for the repo organizer: the dev board (Nov 15 2026)

Hi. A session built a development board for Pocket Lantern with Will and added a frozen copy here. This note covers
what was added, where the data came from, and what was corrected along the way.

## What was added

| Path | What |
| --- | --- |
| `dev-board/README.md` | Short guide: living board vs frozen copy |
| `dev-board/2026-11-15_frozen/index.html` | The board as of version 7, standalone (runs offline) |
| `dev-board/2026-11-15_frozen/shots/` | 75 screenshots the board uses (WebP, about 1.4 MB) |
| `dev-board/NOTE_FOR_REPO_ORGANIZER.md` | This note |

Nothing else in the repo was changed. `LATEST.md` doesn't mention the board yet. Adding a line there pointing to
`dev-board/README.md` would help people find it.

**The frozen folder is a time capsule. Treat it like `backups/`: never edit it.** The living board is the artifact
https://claude.ai/artifact/HyDXhUmTsQfA6SY4RhPvvJ, and all ongoing work happens there. Future snapshots go in new
dated folders (`dev-board/YYYY-MM-DD_frozen/`).

## What the board is

One HTML page with:

- releases (v0.1, v0.2, v0.2.1, v0.3) and which cartridges were on the shelf for each
- a map with one lane per cartridge plus the console, in Eastern time; each lane shows its time in development and
  dashed links where one game fed into another
- a "By game" view with one equal row per game
- a five-chapter log of 47 passes with screenshots
- a console-style viewer to step through passes with the D-pad
- the Knockout roster, and open threads

All the data is the `EV` array (plus `RELEASES` and `PHASES`) in the page's script. To add a pass, add an entry there.

## Where the data came from

| Source | Covers |
| --- | --- |
| This repo: commits, `v0.x/CHANGELOG.md`, handoffs, `v0.2/playtest/dev-photos/` | Repo-era passes for every game |
| lil Bottie's Rootdeep timeline (Muse), also in `v0.2/handoffs/` | Rootdeep v1 to v2.9 on Muse. Times there are approximate and marked "approx." |
| Knockout dev timeline (from Will's devs, Nov 15) | Knockout passes, live versions v14, v15 and v18, the roster |
| Sprouts dev timeline (from the Pocket Lantern chat, Nov 15) | Sprouts versions 16, 17 and 19 and the frozen backup, with exact times from the version ids |
| Pocket Lantern handoff doc (Claude Doc) | Sprouts' systems, the valley projects, owner preferences |
| Will's phone capture, Nov 14 10:57 AM | The Muse-era Hearth screen |
| Knockout dev photos from Will (Nov 15) | The "Knockout v18 in action" card |

**Knockout screenshots:** the per-version Knockout screens (`ko14_*`, `ko15_*`, `ko18_*`) were captured for the board.
Each Knockout commit (`e2344a7`, `c22a279`, `b1e05bd`) was built with its own `build.py`, booted in headless Chromium,
and driven through the `window.__g.KO._` test hook.

## Corrections worth knowing

- **`v0.2/playtest/dev-photos/03_knockout_moves_on_xy/`** shows Rootdeep keepers using Knockout moves. It isn't
  Knockout itself. The board files those shots under Rootdeep's pass `48ae8f8`.
- **Version labels clash.** The Knockout timeline suggested "v0.1 / v0.2 / v0.3" for its own passes, but v0.3 is
  already the Patch & Plate release. The board labels Knockout passes by the live page's version counter
  (Artifact v14, v15, v18) instead.
- **Commit `30fd20e`** ("Bring in the Sprouts changes from the live console") is the repo catching up with Sprouts
  live versions 16 and 17. It isn't a Sprouts version of its own.
- **The live page's version numbers (v13 to v19) are a different counter from the repo's v0.x releases.** Both appear
  on the board, each marked.

## Gaps still open

- Sprouts before live version 16: the original build, the Opus audit and Fable's plan have no dates.
- Knockout before commit `e2344a7`, if anything was built earlier in its own session.
- Muse passes have approximate times only.
- The Sprouts v16, v17 and v19 cards have no screenshots from those builds yet.

## A request that would help

When a publish or commit ships, add a dated line to the version's `CHANGELOG.md` that includes the live page's version
number. The board can then be updated from the changelog without piecing things together from chats.
