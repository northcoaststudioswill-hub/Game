# Main line: `alt/` — five cartridges (updated Nov 16 2026)

**Newest:** Sproutwild v8.0. Front page with every game, its changelog and status: [`README.md`](README.md). Known bugs: [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md).

**Build on this:** [`alt/`](alt/README.md). Sprouts, North Coast Knockout (with the later Fable passes), Rootdeep,
Patch & Plate and **Sproutwild** in one console. Play `alt/games/pocket-lantern-alt.html`; rebuild with `python3 alt/build.py`.

- **What changed:** [`alt/CHANGELOG.md`](alt/CHANGELOG.md) (console and Knockout), [`alt/src/sproutwild/CHANGELOG.md`](alt/src/sproutwild/CHANGELOG.md) (Sproutwild)
- **Saved before Sproutwild went in:** `alt/backups/pocket-lantern-alt_2026-11-15_4-carts_pre-sproutwild_BACKUP.html`
- **Saved standalone Sproutwild v6.0:** `muse/games/Sprouts+Rootdeep+Sproutwild-v6.0_2026-11-15_BACKUP.html`
- **For the dev board team:** [`dev-board/updates/2026-11-15_sproutwild-rebuild-and-fusion/`](dev-board/updates/2026-11-15_sproutwild-rebuild-and-fusion/README.md)

![Five cartridges](alt/playtest/five-cartridges-fused.png)

It has not been cut as a numbered release yet (no `share/` zip). The last numbered release is still v0.35, below.

# Last release: Pocket Lantern v0.35 (Nov 15 2026)

Four cartridges: Sprouts, **North Coast Knockout (reworked)**, Rootdeep, Patch & Plate.
v0.35 is v0.3 with a new Knockout: snappier feel, GBA-style sprite bodies, King Bibi, two-stage supers with full-meter
cinematics (HASBARA, Ruby Temper Tantrum, Louie Airlines, Nuke the Data Center), Survival and Training, the arcade tower,
level select and banter. Everything else is exactly v0.3.

- **What's new:** [`v0.35/CHANGELOG.md`](v0.35/CHANGELOG.md)
- **Send this:** [`v0.35/share/pocket-lantern-v0.35-share.zip`](v0.35/share/pocket-lantern-v0.35-share.zip)
- **Start here if you're working on it:** [`v0.35/README.md`](v0.35/README.md), then [`v0.35/handoffs/HANDOFF_v0.35.md`](v0.35/handoffs/HANDOFF_v0.35.md)

![The v0.35 update](v0.35/playtest/UPDATE_GALLERY_v0.35.png)

| Version | Folder | What |
| --- | --- | --- |
| v0.35 | `v0.35/` | Knockout reworked (this release). Built from the frozen v0.3 backup. |
| v0.3 | `v0.3/` | The previous main version: Patch & Plate in slot 4. Kept as is. Changelog: [`v0.3/CHANGELOG.md`](v0.3/CHANGELOG.md), send: [`v0.3/share/pocket-lantern-v0.3-share.zip`](v0.3/share/pocket-lantern-v0.3-share.zip) |
| v0.2.1 | `v0.2/` | Rootdeep in slot 3; still where Rootdeep work happens. Changelog: [`v0.2/CHANGELOG.md`](v0.2/CHANGELOG.md) |
| v0.1 | `v0.1/` | Sprouts + Knockout; the rollback. Never edit. |
| ALT | `alt/` | **The main line.** Began as the experimental fork where v0.35's Knockout was made; now five cartridges with Sproutwild. Separate saves. Not yet a numbered release. |
| Sproutwild (standalone) | `muse/` | lil Bottie's Muse files and the standalone Sproutwild through v6.0. Archive; live source moved to `alt/src/sproutwild/`. |

The files at the repo root (`README.md`, `build.py`, `index.html`, `src/`) are the old pre-v0.2 setup.

## Finding old versions

Every version stays in its own folder, so all of them are always on the same branch:
`v0.1/`, `v0.2/` (v0.2 and v0.2.1), `v0.3/`, `v0.35/`. Each has `backups/` (frozen game files, never edited) and `share/`
(the zip to send). Nothing is deleted when a new version is made. Git history also keeps every earlier state of every file.
If v0.35 has a problem, v0.3 is still there to send and play: `v0.3/share/pocket-lantern-v0.3-share.zip`.
