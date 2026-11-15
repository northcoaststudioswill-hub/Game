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
- ALT, run alone: 6 runs. Depth grows with the Mirror upgrades: chamber 8, 7, then chamber 11 to 12 on runs 5 and 6 (best 12,
  7 bosses felled, 19 sprouts found, 155 kills). Frames: median, p95 and worst all 16.7 to 16.8 ms (steady 60 fps). No page errors.
  One run of the six (run 3) never started a dive. The bot does this now and then; an earlier ALT run and the v0.3 comparison
  each had or avoided it at random. It isn't something a player meets: the run after it played normally.

## Lantern menu (`node alt/tests/lantern_shots.js`)

With sample saves (Patch & Plate file at day 7, Knockout with a survival streak of 6): the PATCH & PLATE stats page reads
7/12 days, 19/36 stars, 84 dishes, 1320 coins, crew 3/6, hearts 9/20; STILL STANDING is awarded and 1 survival-streak ticket
paid. The HOW TO GET TICKETS page fits on screen. Shots in `lantern/`.

## Fable pass 1 (Nov 15 2026): `node alt/tests/fable_lab.js`

20 checks, all pass, no page errors. Sheets in `fable/`. **Nothing is phone-confirmed, and no trial has been played by hand.**

| Check | Result |
| --- | --- |
| Stances | all eight idle stances differ (`fable/stances.png`) |
| Parry | back tapped 3 frames before a hit: no damage, +12 meter, attacker stunned 0.44 s. Back held for half a second first: an ordinary block. Not holding back: hit for 8.6. An unblockable: still lands |
| Wall bounce | a 230-speed launch 39 px from the wall bounces back once (17 frames later, heading away at 108) and ends in a normal knockdown |
| K.O. impact frame | starts on the killing frame and the round carries on (`fable/ko.png`) |
| Rules | moon gravity jump 57 frames (normal 26); sudden death starts on 1 health; a glass-cannon jab does 8 (normal 4); meter madness adds 22 a second; Arcade ignores the rule |
| Trials | trial 1 won on full health = GOLD, saved as 2 stars; trial 2 won without its 4-hit combo = not cleared; a later loss keeps the stars; stars are in the save |
| Text audit of the new screens | title, all 16 trial rows, trial VS, trial HUD, both result screens, trial pause, HOW TO PLAY: nothing off-screen or overlapping (the title logo's shadow and the banner under the pause menu are the known intended ones) |
| CPU vs CPU soak | 4 full fights on Hard (normal, turbo, moon, chaos rules) finish with no errors; in the last run the CPUs parried 12 times and wall-bounced 7 (it varies run to run) |

Re-run on the same build, unchanged from before this pass:
- `ko_lab.js`: metrics identical (jump 26 frames / 48.8 px, jab 4 / 22 / 7.8, launch 35 / 35 / 22, juggle HIT at 0, 2, 4, 6,
  walk 87); supers, Mama, Erin, arcade and forward+B figures identical; the same known text notes; no errors.
- `pp_test.js`: 76 passed. (One earlier run failed "Louie changes his mind mid-craving", a chance-based check; it passed on
  the re-run and Patch & Plate's code is untouched.)
- `tests/v02/`: console_carts, roguelite_loop, keeper_moves, saves_onboarding, lantern_menu, capsules_reset,
  growing_dialogue, walkups_burrow_menus, waterworks_rule: all pass, no errors. (growing_dialogue threw once and passed
  on the re-run.) `text_audit.js` reports the same 7 overlaps as the build before this pass, compared side by side.
- `lantern_shots.js`: same figures as before.
