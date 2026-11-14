# Pocket Lantern v0.2 (pre-alpha)

v0.1 plus **Rootdeep** in cartridge slot 3, overhauled. v0.1 is untouched and is still the rollback.

| Folder | What it is |
| --- | --- |
| `games/` | The working build: `pocket-lantern_2026-11-14_v20_wip.html`. Rootdeep's code is spliced in from `src/` by `build.py`. |
| `src/` | `rootdeep.js`, Rootdeep's source. Edit this, then run `python3 v0.2/build.py`. |
| `backups/` | Frozen snapshot of this version. Never edit; add new dated copies instead. |
| `share/` | What you send to other people: the game and its how-to. The zip is ready to send. |
| `handoffs/` | Notes for the next session: the v0.2 handoff, the Rootdeep design doc, the art manifesto. |
| `playtest/` | The v0.2 playtest report, the development snapshot, and screenshots from the playtest. |

v0.2 backup SHA-256: `9c44454c3cc5a3c2e7096d2a418b1138dd537960ef013307813dc569b32fe1ab`
Playable test page (claude.ai artifact): https://claude.ai/artifact/TtWoCTcCU9ZZfkrWkyUZtQ

## v0.2.1 (Nov 14 2026)

Rootdeep: the Burrow descent and a scene between every chamber (rescued sprouts climbing home), characters who walk over to explain
things, capsule pages per cartridge with how to get tickets, and a Hearth menu on Start (save, settings, capsules, new game, quit).

- Send this: `share/pocket-lantern-v0.2.1-share.zip` (the game plus HOW-TO-PLAY).
- Frozen copy: `backups/pocket-lantern_2026-11-14_v0.2.1_BACKUP.html`, SHA-256 `c28ea95bcaf4045d89351a982eb91e4fd5a0fc9c18fa46d1bf642a4769335591`
- The v0.2 backup, share folder and zip are kept as they were.

## Audit note (after v0.2.1)

- The v0.2 share folder and zip had been overwritten with later builds. They're restored to v0.2 and match the v0.2 backup above.
- `v0.1/music/` (the songs as .mp3 files) is now on this branch too. The two William Cohen songs are not embedded in the game file;
  they stream only on claude.ai, so these files are their only full copies.
