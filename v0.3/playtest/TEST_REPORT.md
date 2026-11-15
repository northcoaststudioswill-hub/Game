# Patch & Plate test report (v0.3)

Run: `node v0.3/tests/pp_test.js` from the repo root, Nov 15 2026, headless Chromium at iPhone 16 Pro Max size (440x956 CSS px, 304-px-tall logical screen).
Result: **76 passed, 0 failed.** Screenshots from this run are in this folder; `UPDATE_GALLERY_v0.3.png` collects 16 of them.

The only console message is the Sprouts title music, which streams only on the claude.ai host (same as v0.1 and v0.2).
Nothing here is phone-confirmed: this is automated testing.

```
note screen height (logical): 304
ok   shelf shows 4 cartridges inside the screen: Sprouts 88x106, Knockout 88x106, Rootdeep 88x106, Patch & Plate 88x106
ok   cartridge 1 boots (state intro)
ok   cartridge 2 boots (state ko)
ok   cartridge 3 boots (state g3title)
ok   cartridge 4 boots (state pp)
ok   text audit: title (6 boxes)
ok   title PLAY opens the stand
ok   text audit: stand (new save) (18 boxes)
ok   the first day starts with the opening scene
ok   text audit: opening scene (4 boxes)
ok   the opening scene plays itself out, then day 1 opens its intro card
ok   text audit: intro day 1 (18 boxes)
ok   A opens the stand for the day
ok   text audit: day 1 playing (8 boxes)
ok   phone put down: the day pauses and saves ({"s":"pause","run":true,"coins":29,"t":23.79999999999993})
ok   text audit: pause (11 boxes)
ok   day 1 finished by the bot in 14s of game time: 3 stars, 59 coins, served 4/4
ok   day 1 pays the DEW sprout seed
ok   text audit: results (13 boxes)
ok   day 2: the bot plants the DEW seed, plucks it, and DEW joins the crew
ok   day 2: bot finished in 64s, 3 stars, 81 coins (goals 28/45/59), served 5/5
ok   day 3: bot finished in 96s, 3 stars, 91 coins (goals 33/53/69), served 5/5
ok   day 4: bot finished in 87s, 3 stars, 117 coins (goals 41/66/86), served 6/6
ok   text audit: day 4 playing (4 boxes)
ok   day 5: bot finished in 157s, 1 stars, 62 coins (goals 58/93/122), served 2/6
ok   day 6: bot finished in 113s, 3 stars, 127 coins (goals 46/74/97), served 6/6
ok   day 7: bot finished in 104s, 3 stars, 148 coins (goals 51/82/107), served 7/7
ok   day 8: bot finished in 110s, 3 stars, 194 coins (goals 82/131/172), served 6/7
ok   text audit: day 8 playing (6 boxes)
ok   day 9: bot finished in 134s, 3 stars, 182 coins (goals 83/133/174), served 5/7
ok   day 10: bot finished in 115s, 3 stars, 190 coins (goals 64/102/134), served 8/8
ok   day 11: bot finished in 122s, 3 stars, 269 coins (goals 94/150/197), served 9/9
ok   day 12: bot finished in 142s, 3 stars, 272 coins (goals 91/146/191), served 10/10
ok   text audit: day 12 playing (5 boxes)
note days 8/11/12 without the crew: {"8":"3★ 169","11":"1★ 190","12":"2★ 168"}   with all six: {"8":"3★ 179","11":"1★ 172","12":"2★ 185"}
ok   every working sprout did its job: {"EMBER":72,"DEW":78,"ZIP":52,"LEAF":43,"PEB":16}
ok   sprouts level up by working: {"EMBER":72,"DEW":78,"ZIP":52,"LEAF":43,"PEB":16}
ok   text audit: day 10 with the crew (6 boxes)
ok   text audit: sprouts page (17 boxes)
ok   a seed planted mid-day grows and ZIP joins
ok   text audit: taste scene (3 boxes)
ok   Start skips a scene and the day carries on
ok   text audit: sprout scene (3 boxes)
ok   NEXT DAY plays the night scene
ok   text audit: night scene (dusk) (4 boxes)
ok   text audit: night scene (dawn) (5 boxes)
ok   the night scene leads into the next day
ok   text audit: a quip during the day (6 boxes)
ok   Patch & Plate asks for its own song (music list: pp)
ok   the bot fed Louie 43 times across the days
ok   hearts grow for Will, Marcus and Louie: {"fed":43,"hearts":{"WILL":4,"MARCUS":4,"LOUIE":4},"pend":[]}
ok   Louie changes his mind mid-craving (seen within a few days)
ok   text audit: Louie wants a mix (5 boxes)
ok   a waiting heart scene plays after the day, before the night
ok   text audit: heart scene (4 boxes)
ok   then the night scene carries on as usual
ok   today's asks: three of them, and finishing one pays 15 coins {"n":3,"done":1,"gain":15}
ok   text audit: stand hub (19 boxes)
ok   text audit: all days (28 boxes)
ok   wardrobe: buying the SAGE dress puts it on Erin
ok   text audit: wardrobe (18 boxes)
ok   text audit: friends (17 boxes)
ok   text audit: recipe book: Louie page (15 boxes)
ok   SAVE FILES: file 2 starts a fresh game {"slot":1,"day":0,"coins":0,"s":"stand"}
ok   text audit: save files (19 boxes)
ok   file 1 is just as it was {"slot":0,"day":12,"coins":460}
ok   erasing needs more than one press
ok   three presses erase file 2, file 1 stays
ok   text audit: stand (all days) (19 boxes)
ok   upgrades: buying MORE PLOTS works
ok   text audit: upgrades (28 boxes)
ok   text audit: recipes (12 boxes)
ok   text audit: kitchen page (14 boxes)
ok   text audit: intro day 12 (18 boxes)
ok   text audit: title with CONTINUE (8 boxes)
ok   after a reload, CONTINUE DAY picks the day back up: {"mid":{"d":11,"coins":0,"t":16},"back":{"s":"pause","d":11,"coins":0,"t":16}}
ok   no page errors (all: console: Failed to load resource: net::ERR_FILE_NOT_FOUND)

76 passed, 0 failed
```
