# ALT test report (Nov 15 2026)

Headless Chromium at iPhone 16 Pro Max size (440x956 CSS, 240x304 logical screen). **Nothing is phone-confirmed.**
All runs are against `alt/games/pocket-lantern-alt.html`, from the repo root, after `python3 alt/build.py`.

## Originals untouched

Checked after all the work: no file outside `alt/` differs from the last pre-ALT commit (`b2ea48b`), and there are no
uncommitted or untracked files outside `alt/`. The v0.3 backup still hashes to `aafd16ac…`, as its README says.

## Knockout (`node alt/tests/ko_lab.js`)

| Check | Result |
| --- | --- |
| Neutral jump | 26 frames, 49 px apex (v0.3: 34 frames, 55 px) |
| Pose after pressing A | windup held 3 frames, strike pose in 1 frame (v0.3 eased over ~6) |
| Jab | 4-frame startup, 22 frames of hitstun, 8 px slide |
| Launcher → jump (hold Up) → air B | connects at every delay tried (0, 2, 4, 6 frames) |
| Survival | a win moves on to a new opponent with health carried (+30); a loss shows SURVIVED n and the best streak |
| Training | timer stays 99, health comes back to 100 after a rest and never drops below 1, combo damage shows, the BLOCK dummy blocks a jab |
| Text audit, 44 menu screens | clear, apart from intended ones: the title logo's shadow (drawn twice on purpose), stage signs that scroll past the edge, and the round banner under the pause menu (pause only opens after FIGHT!, so players never see that pairing) |
| Page errors | none |

Sheets in `ko/`: `moves_*.png`, `zoom_kick.png` (every frame of a heavy kick: smear, flash, burst), `fight_sheet.png`
(14 s CPU vs CPU), `stages.png`, `modes.png`, `drama.png` (VS, K.O., FINISH 'EM), `screen_*.png`, `metrics.json`.

## Sprouts

- `alt/tests/sprouts_tour.js` plays in real time from a fresh save by walking at the objective marker: cinematic, Erin,
  6 sprouts plucked in 9 s, berries, day 2, petting Louie, plucking bloomed sprouts. No page errors. (The tour bot doesn't
  path-find, so it sometimes stalls on trees; that's the bot.)
- `alt/tests/sprouts_berries.js`: on a fresh day 1, 18 of 30 berries are reachable on foot; 12 sit behind gates that open later.
- Berry marker fix, checked directly: with only a far reachable berry left (609 px) and a gated one closer (217 px), v0.3's
  marker picks the gated berry and ALT's picks the reachable one.

## Patch & Plate (`node alt/tests/pp_test.js`)

76 passed, 0 failed (v0.3's own test, unchanged apart from the paths). The code is v0.3's.

## Rootdeep and the console (`alt/tests/v02/*.js`, v0.2's tests)

console_carts, roguelite_loop, keeper_moves, saves_onboarding, lantern_menu, capsules_reset, growing_dialogue,
walkups_burrow_menus, waterworks_rule: all pass, no page errors.
One roguelite_loop run failed three death/Hearth checks while another browser test was running alongside it; run alone,
it passes on both ALT and v0.3. The known text-audit notes (the ROOTDEEP logo's shadow, a probe "z" in Sprouts settings) are
the same as v0.3.

`playtest_bot.js` (a bot playing whole Rootdeep runs):

- v0.3, for comparison: run 1 reached chamber 6 (spored out), run 2 with every Mirror upgrade reached chamber 7 (grublets).
  Chambers take 4 to 9 s each until the bosses (19 to 21 s).
- ALT: see below.

## Lantern menu (`node alt/tests/lantern_shots.js`)

With sample saves (Patch & Plate file at day 7, Knockout with a survival streak of 6): the PATCH & PLATE stats page reads
7/12 days, 19/36 stars, 84 dishes, 1320 coins, crew 3/6, hearts 9/20; STILL STANDING is awarded and 1 survival-streak ticket
paid. The HOW TO GET TICKETS page fits on screen. Shots in `lantern/`.
