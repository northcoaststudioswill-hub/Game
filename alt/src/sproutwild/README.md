# Sproutwild (cartridge 5)

A creature collector in the Sprouts universe: grow and throw sprouts, catch buddies, build Sunkeep.
Started by lil Bottie on Muse (through v4.7), rebuilt here in v5.0 to v6.0. History: [`CHANGELOG.md`](CHANGELOG.md).

This folder is the live source. `python3 alt/build.py` splices these files into `console.js`, in this order:

| File | What |
| --- | --- |
| `sw-cartart.js` | The shelf picture |
| `sw-module.js` | The original module: data (buddies, moves, gyms, buildings), Sunkeep's walker, battle rules, menus |
| `sw-field.js` | The field engine: maps, squad, throwing, carrying, gates, trainers |
| `sw-front.js` | HUD, title, opening story, cut-ins, menu chrome, Sunkeep ground |
| `sw-base.js` | Sunkeep at work: workers, skills, buildings, the Tinker Bench queue |
| `sw-art.js` | Human sprites, trees, lighting |
| `sw-story.js` | The opening, Louie, the Great Lantern, swarming, buddy fetching and chopping, gear |
| `sw-battle.js` | The battle screen |
| `sw-save.js` | Save files and safe loading |
| `sw-text.js` | The built-in pixel font |
| `sw-cast.js` | Erin, Marcus and Louie at home, and their speech bubbles |

Later files replace functions in earlier ones by declaring them again; the earlier bodies are kept for reference.

Tests (from the repo root, after building):

```
node alt/tests/sproutwild/field-lab.js alt/games/pocket-lantern-alt.html        # 76 pass/fail checks
node alt/tests/sproutwild/playtest-realtime.js alt/games/pocket-lantern-alt.html <out dir>   # plays the opening, screenshots
node alt/tests/sproutwild/render-phone.js alt/games/pocket-lantern-alt.html <out dir>        # iPhone-shaped screenshots
```

Saves are `sproutwild-v1`, `sproutwild-s2`, `sproutwild-s3` (three files), stored with ALT's `pl-alt:` prefix like every other key.

`muse/sproutwild/` is the archive of the standalone version this came from. Do not develop there any more.
