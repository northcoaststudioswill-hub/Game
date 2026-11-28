# GOT NEXT · open bug list

Real bugs only (things that behave wrong), not design wishes. Newest review first. When one is fixed, move it to
"Fixed" with the version and the test that covers it.

Source: four blind reviews, 0.19.34 (Couch Co-Op, Pixel Press, FullCourt Press, Coin-Op Courtside). The reviewers
got 4 to 20 minutes each, mostly menus and drills, so games themselves are still lightly covered.

## Open

| # | Severity | Area | Bug | Where | Seen by |
|---|---|---|---|---|---|
| B1 | minor | Drills / camera | Finishing drills use a side-on camera, so "stick up" no longer points at the rim. | drill camera setup | FullCourt Press |
| B2 | minor | Results | TEAMMATE GRADE shows a letter (often F for beginners) with no reason given. | main.js:104 | Couch Co-Op |
| B3 | minor | Onboarding | "PERFECT RELEASE · TOO MUCH HAND" and "TAKE IT BACK PAST THE ARC" are never explained. | ball.js:291 | Couch Co-Op, Pixel Press |
| B4 | minor | Check-up | From the camera behind you, the on-ball defender (about 0.85 m away) hides your player, so it looks like he is standing inside you. | camera / check-up spacing | Pixel Press |
| B5 | polish | Hub | "Nobody" next to the HC reads like a missing name; it is the rank. | data.js:193, HUD | Pixel Press |
| B6 | polish | Builder | Nepo Baby's starting total (600 + 400) is never shown. | core.js:16, data.js:62 | Couch Co-Op |
| B7 | polish | HOW IT WORKS | Lists keyboard, pad and phone buttons in one sentence. | guide.js HOWTO | Couch Co-Op |

Design questions from the same reviews (not bugs, waiting on a decision): the 7'3" slasher keeps 99 Dunk and the dunk
threshold also drops with height; OVR counts only the best 12 of 19 ratings; games to 11 take a beginner 5+ minutes;
the path from the builder to a first real game is long.

## Fixed (0.19.35)

| # | Bug | Fix | Test |
|---|---|---|---|
| F1 | Name keyboard: RIGHT from DONE went to N on the next row; brisk taps typed "OQS" for ACE | Menu moves prefer the same row / column; the keyboard is a fixed 10-wide grid (RANDOM greys out instead of vanishing) | tests/kbnav.mjs |
| F2 | DOWN at the bottom of a menu wrapped to the top / bounced between sliders and HIT THE BLOCK | The pinned footer is the end of the page: DOWN reaches it, UP leaves it, nothing wraps | tests/kbnav.mjs, tests/padmenus.mjs |
| F3 | START did nothing in the builder | START is HIT THE BLOCK (shown on the button) | tests/kbnav.mjs |
| F4 | A pressed soon after a menu opened was dropped (450 ms of real time) | The guard is 200 ms counted in game frames (1.1 s on the results screen, as before) | tests/kbnav.mjs |
| F5 | Drill results ignored A; Walk-On's OPEN THE BOARD did nothing | Same cause as F4; both open now | manual run |
| F6 | DOWN from the coach board tabs went to the last drill | Same row/column rule as F1 | tests/kbnav.mjs |
| F7 | The UPTOWN LINE gate took the A prompt from Coach standing next to it | Smaller, low-priority spot | |
| F8 | Brennick (88 OVR) offered Ones on THE CAGE court to a brand-new player; spent your boosts | Ones with him unlocks at Certified (he says so); his challenge never takes boosts | |
| F9 | A perfect release under a heavy contest went in 18% of the time | About half at worst (max(0.45, 1 − (c − 0.12) × 0.9)) | tests/contest.mjs |
| F10 | Jumping near a shooter fouled 30–75% of the time | Straight up is clean; only flying in or lunging fouls (2–45%, closer than 0.62 m) | tests/fouls.mjs |
| F11 | Drills paid for scoring 0 and kept paying 35% forever; Spot Shooting printed ~840 HC a minute | Base pay needs half of bronze; points past gold pay nothing; runs 4–6 pay 60/35/15%, then nothing that day | tests/grind.mjs |
| F12 | Defensive Slides: the first touch only counted on the right line; bronze 11 was out of reach | Either line first; medals 8 / 11 / 14 | tests/grind.mjs |
| F13 | Layup Lines tip said "push up to attack" from the cone, which shoots a jumper | Tip says drive in first, then push up | |
| F14 | "5-0 RUN · YOUR TEAM" banner in solo drills | The follow-up run banner is skipped in practice too | |
| F15 | Coach board header showed the old HC after a lesson paid | Lessons pay before the header is drawn | |
| F16 | Builder said "you can wear three" personalities but allows one | Copy: pick one now, two more slots at Tape Deck | |
| F17 | Hint bar said X jumps and "A X" steals; the manual says Y and X | Hints match the manual | |
| F18 | Walk-On's greeting replayed on every load until you reached Coach | It plays once | |
