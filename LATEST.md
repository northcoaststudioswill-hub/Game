# Latest: Pocket Lantern v0.35 (Nov 15 2026)

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
| ALT | `alt/` | The experimental fork where v0.35's Knockout was made (separate saves). Not a release. |

The files at the repo root (`README.md`, `build.py`, `index.html`, `src/`) are the old pre-v0.2 setup.

## Finding old versions

Every version stays in its own folder, so all of them are always on the same branch:
`v0.1/`, `v0.2/` (v0.2 and v0.2.1), `v0.3/`, `v0.35/`. Each has `backups/` (frozen game files, never edited) and `share/`
(the zip to send). Nothing is deleted when a new version is made. Git history also keeps every earlier state of every file.
If v0.35 has a problem, v0.3 is still there to send and play: `v0.3/share/pocket-lantern-v0.3-share.zip`.
