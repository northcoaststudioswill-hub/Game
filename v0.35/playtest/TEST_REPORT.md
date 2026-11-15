# v0.35 test report

Run Nov 15 2026 from the repo root, headless Chromium at iPhone 16 Pro Max size (440x956 CSS px, 304-px-tall logical screen),
against `games/pocket-lantern_2026-11-15_v22.html` (identical to the frozen backup and the share copy).
**Nothing is phone-confirmed.** The only console message anywhere is the Sprouts title music, which streams only on the claude.ai host.

## Knockout (`node v0.35/tests/ko_lab.js`)

| Check | Result |
| --- | --- |
| Neutral jump | 26 frames, 49 px apex (v0.3: 34 frames, 55 px) |
| Strike pose | windup 3 frames, strike in 1 (v0.3 eased over about 6) |
| Jab | 4-frame startup, 22 frames hitstun, 8 px slide |
| Launcher, hold Up, air B | connects at every delay tried (0, 2, 4, 6 frames) |
| HASBARA / RUBY TEMPER TANTRUM / LOUIE AIRLINES / NUKE THE DATA CENTER | 30 each, cinematic ends and play resumes |
| Bike Lane / Yukon / Sprout Stampede | 14 / 15 / 24 (Sprout Stampede unchanged from v0.3) |
| Erin: Towel Whip / Hide and Seek | 4 hits, 19 / 11 from behind |
| King Bibi: Red Line / Coalition | 10 / 20+ |
| Survival | win moves on with health carried; loss shows the streak |
| Training | timer 99, health returns, never below 1, combo damage shown, BLOCK dummy blocks |
| Arcade tower | plays, then the VS screen with banter |
| Music tags | a `ko-bottie` song is picked for fights with Lil Bottie, `ko` otherwise |
| Text audit, 45 menu screens | clear apart from intended overlaps (the title logo's shadow, stage signs that scroll off-screen) |
| Frame cost | about 2.1 ms a frame (of 16), CPU vs CPU |
| Page errors | none |

The fighting matches the version Will approved: the same scripted inputs (walk, jab chain, forward+B, jump, launcher combo;
Will, Erin, Marcus, Lil Bottie) give identical positions, states and damage on all 1,088 frames compared.

Frame sheets and screenshots are in `ko/` (see the update gallery for 15 of them).

## The other cartridges (v0.3's code, run against the v0.35 build)

| Suite | Result |
| --- | --- |
| Patch & Plate (`alt/tests/pp_test.js`, v0.3's test) | 76 passed, 0 failed |
| Console carts (all four boot, eject, swap) | no page errors |
| Lantern menu | all pass |
| Rootdeep roguelite loop | all pass |
| Rootdeep keeper moves | all pass |
| Rootdeep saves and onboarding | all pass |
