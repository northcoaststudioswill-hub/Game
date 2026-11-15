# ALT songs

Put mp3s here and list them in `tracks.json`, then run `python3 alt/build.py`. Example:

```json
[
  {"file": "bottie-stage.mp3", "title": "Bottie Theme", "artist": "lil Bottie", "use": ["ko-bottie"]}
]
```

`use` tags:

| Tag | Plays in Knockout |
| --- | --- |
| `ko-bottie` | fights against (or as) Lil Bottie, plus his VS screen and tower |
| `ko-<id>` | same for another fighter: `ko-will`, `ko-erin`, `ko-louie`, `ko-marcus`, `ko-mama`, `ko-bibi`, `ko-kiss` |
| `ko-stage-<n>` | fights on stage n (0 = The Living Room ... 8 = The Podium) |
| `ko` | every Knockout fight (replaces the built-in chiptune) |

The opponent's tag wins, then yours, then the stage's. Several songs with the same tag shuffle.

**Size:** the build is one HTML file and the published page caps at 16 MB. The game is about 14 MB, so there's room for
roughly one 2 MB song (a 2-3 minute track at 96-128 kbps). The build warns when it's over.
