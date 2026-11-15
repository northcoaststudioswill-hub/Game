# Pocket Lantern v0.35 handoff: North Coast Knockout reworked (cartridge 2)

Read `../../v0.3/handoffs/HANDOFF_v0.3.md` and `../../v0.2/handoffs/HANDOFF_2026-11-14_v0.2.md` first for the console, the cast
and Will's standing preferences. This file is only about Knockout. Add a new section at the end for each pass; don't rewrite.

## Where it came from

Knockout was reworked in `alt/`, an experimental fork of v0.3 with separate saves (`pl-alt:` key prefix), so the real game was
never at risk. Every pass, including the ones Will rejected and that were rolled back, is in `alt/CHANGELOG.md`. Will asked for
the fighter (only) to come into the main line as v0.35. `src/knockout.js` here is `alt/src/knockout.js` at that point.

## What Will has said (keep to these)

- **Snappy matters most.** He liked the feel after the first pass and noticed immediately when a later pass slowed it down
  (that pass made forward+B fire slower moves, slowed Marcus's and Bottie's jabs and enlarged the bodies). Don't change frame
  data, gravity or hitboxes without asking. Check feel changes with the frame trace (below).
- **GBA look.** His references: Dragon Ball Z Supersonic Warriors, Tekken Advance, Zatch Bell (GBA). Clean sprite silhouettes,
  big readable fists, no clipping. He called the earlier stroke-drawn bodies "goofy and clippy", and the 3/4 heads from one pass
  "ugly" (rolled back). Judge art from close-ups of real fight frames next to his references, not from far-away sheets.
- **Two-stage supers, ZZZ style.** Half meter: a smaller super. Full meter: a gacha-style cinematic with a big hit. He'll add
  more of these per character as we go.
- **He hands out canon.** Names and lines marked invented below are placeholders.
- **One fighter at a time** for big art changes, so he can approve before the rest.

## How it's built

- `build.py` reads `v0.3/backups/pocket-lantern_2026-11-15_v0.3_BACKUP.html` (read-only), swaps Knockout's script block (from
  its header comment to the end of that `<script>`) for `src/knockout.js`, adds any songs from `music/tracks.json`, and writes
  `games/pocket-lantern_2026-11-15_v22.html`. Everything else in the page is v0.3 byte for byte.
- The cartridge is still one closure, `window.KO_CART`, created by the console with the same arguments as v0.3; the console's
  hooks are unchanged. `KO.mus()` now returns a tag (see Music).
- Test handle: `__g.KO._` exposes `G, CH, ST, SV, PS, CN, RBY, HSB, poser, startMatch, startSuper, startSpecial, tryHit, nextSurv, tb`
  (text-box recorder), and fighters take a `dummy` flag (no input). Open the page with `?dev` for `__g.ev(code)`.

## The code, by section (`src/knockout.js`)

| Section | What it is |
| --- | --- |
| `PFC`/`PFB`, `text()`, `tw()` | the 5x7 pixel font (same advance widths as the old system font) |
| `HD`, `CH` | heads (pixel strings) and the roster: colours, stats, specials, supers (`su1` half meter, `su` full), win quotes |
| `PS`, `MV`, `MVO`, `MN` | poses, shared normals, per-fighter tweaks and move names. `MV.fk` and the `MN.*.fk` names are dormant (see below) |
| `INTRO`, `PAIR`, `BARK`, `banter()` | dialogue: VS banter (set pairs, else intros), barks on 4-hit combos and when low |
| `rig()` (rig v3) + `OUT` | the sprite renderer: shaped parts, 3 layers, pixel snap, one outline per layer, cached by pose; `OUT` is each fighter's outfit |
| `S1`, `S2`, `castUpd` | specials. `seq` specials (Erin's Towel Whip) are a list of timed steps with their own hitbox, step speed and pose; `hide` is Hide and Seek |
| `SUP`, `SUP1`, `startSuper`, `superUpd` | supers. Fighters with `su1` use half meter for `SUP1` and full meter for a cinematic in `CINE` |
| `HSB` / `startHasbara` / `hsbDraw` | HASBARA (Will) |
| `RBY` / `startTantrum` / `rbyDraw` / `rbyWorld` / `drawRuby` | RUBY TEMPER TANTRUM (Mama) and the Ruby sprite |
| `CN`, `cnStart`, `cnUpd`, `cnCutIn`, `cnHud` | the shared cinematic frame used by LOUIE AIRLINES (`CN.lou`) and NUKE THE DATA CENTER (`CN.nuk`). New full supers should be a `CN` entry: `{T, hits:[[t,dmg,line]], full(t), draw(C), world(C), sfx}` |
| `ST` | stages (9; THE PODIUM is new) |
| `koMus()` | which song tag to ask the console for |
| `towerDraw`, `stageGrid`, `pauseItems`, `titleItems` | arcade tower, level select, menus |

## The roster now

| Fighter | X | Y | Half meter | Full meter |
| --- | --- | --- | --- | --- |
| Will | Selfie Flash | Mazel Tov Laser | BIKE LANE (14) | HASBARA (30) |
| Erin | TOWEL WHIP, 4 hits (~19) | HIDE AND SEEK (11) | SPROUT STAMPEDE | LOUIE AIRLINES (30) |
| Louie | Zoom Zoom Zoom | Turbo Zoom | | Judgement |
| Lil Bottie | Clanker Guns | Chain Stun | AIR SUPPORT | NUKE THE DATA CENTER (30) |
| King Bibi (new) | RED LINE | IRON DOME | | COALITION |
| Corbin | Can I Get A Kiss | Sneaky Kiss | | 007 |
| Marcus | Dab Cloud | Double or Nothing | | Hydro Jet |
| Mama | Bottle Toss | Mom Voice | YUKON (15) | RUBY TEMPER TANTRUM (30) |

Louie, Corbin, Marcus and King Bibi still have one super (full meter). Will said more two-stage supers will come.

## Invented this pass (flag to Will; he hands out canon)

King Bibi's whole kit and lines; the names SURVIVAL, TRAINING, LOUIE AIRLINES; the staging details of HASBARA, RUBY and NUKE
(the ideas are Will's); every banter line, bark, extra win quote and tower scene line; the Yukon's other quips (MOTHERFUCKER!!!
is Will's).

## Dormant code (left in, does nothing)

- Forward+B command normals (`MV.fk`, `MN.*.fk` = FORCE PUSH, TRELLIS SPIN, ZOOMIE TACKLE, ROCKET FIST, DAP UP): built in the
  rejected pass, rolled back. `ctl` only uses `fk` when a fighter's move has `own:1`, and none do. Delete or revive on Will's word.
- Erin's old Leash Lasso drawing (`sp.leash`) and Gas Guy's `thumb`/`wind` effects: unreachable now.

## Music

`music/tracks.json` lists mp3s in `music/`; `build.py` embeds them. `KO.mus()` asks for, in order, `ko-<opponent>`, `ko-<you>`,
`ko-stage-<n>`, else `ko` (Lil Bottie's tag is `ko-bottie`). Will is making songs for Lil Bottie's levels. The page limit is
16 MB and the build is 14.04 MB: about one 2 MB song fits. More needs another plan (stream from the claude.ai host like the
Sprouts songs, or a lower bitrate).

## Checked (headless Chromium, 440x956)

See `../playtest/TEST_REPORT.md`. All Knockout checks and every v0.2/v0.3 suite pass on the v0.35 build. The feel trace (in the
ALT session) matched Will's approved version on all 1,088 frames. **Nothing is phone-confirmed.**

## Open

1. Will plays it on his phone.
2. Heads face the camera while bodies face the side. Next art step: turn heads toward the opponent, one fighter first for Will to approve
   (an earlier 3/4 attempt was rejected as ugly; do it with his photos and close-ups).
3. Per-fighter idle and walk (Marcus's swagger, Bottie's robot step), visual only, one at a time.
4. More two-stage supers (Louie, Marcus, Corbin, King Bibi), and Will's next photos for Erin, Will, Lil Bottie and Louie.
5. The Lantern menu is v0.3's: no Survival streak, no Patch & Plate stats page. The ALT fork has both in `alt/src/rootdeep.js`
   if Will wants them in the main line (that would touch Rootdeep's block, so coordinate with whoever is on Rootdeep).
6. Rootdeep still uses BIKE LANE as Will's super and LEASH LASSO for Erin (separate game; decide whether to sync).
