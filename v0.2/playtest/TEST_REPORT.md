# Pocket Lantern v0.2.1 test report

Run: every script in `v0.2/tests/`, from the repo root, Nov 15 2026, headless Chromium at iPhone 16 Pro Max size
(440x956 CSS px, a 240x304 logical screen), against `v0.2/games/pocket-lantern_2026-11-14_v20_wip.html` (the same file as the v0.2.1 backup).
Result: **100 checks passed, 0 failed, no page errors.** The text audit checked 257 screens.
Nothing here is phone-confirmed: this is automated testing. `playtest_bot.js` (a 13-minute scripted player) wasn't re-run;
its last results are in `PLAYTEST_REPORT.md`.

| Script | What it checks | Passed |
| --- | --- | --- |
| `console_carts.js` | All cartridges boot, swap and eject cleanly | report |
| `keeper_moves.js` | Each keeper's X, Y and super | report |
| `roguelite_loop.js` | Swarm, interactables, death, the Digs, a full run to the escape, heat, saves | 18 |
| `growing_dialogue.js` | Intro, welcome, door, tips, new talk topics after milestones | 11 |
| `waterworks_rule.js` | Marcus only mentions Waterworks once it exists in Sprouts | 3 |
| `capsules_reset.js` | Capsule pulls and RESET PULLS | 6 |
| `lantern_menu.js` | Lantern menu, capsules, stats, achievements, tickets, Burrow and drop scenes | 19 |
| `saves_onboarding.js` | Title menu, objective bar, saves and Continue, capsules, death cinematic, swarm leaps | 15 |
| `walkups_burrow_menus.js` | v0.2.1: walk-ups, descent and drop scenes, Hearth menu, capsule pages | 28 |
| `text_audit.js` | 257 screens for overlapping, squashed or off-screen text | report |

## Text audit notes

Two kinds of flags remain, and neither comes from Rootdeep's text:
- `ROOTDEEP` overlapping `ROOTDEEP` on the title menu is the logo's drop shadow, on purpose.
- A small "z" drifting off the bottom on some Sprouts screens is Sprouts' own animation, not something added in v0.2.

Scripts that print their own lines instead of PASS/FAIL (console_carts, keeper_moves) are checked by reading them: every line shows the
expected state and no errors.

## Full output

### console_carts
```
build sprouts after cinematic -> talk
build rootdeep title+intro -> g3hub
build rootdeep Select in hub -> off | shelf visible: true
build sprouts after ejecting rootdeep -> menu
build PAGE ERRORS: none
```

### keeper_moves
```
X button display while Rootdeep is in: block
WILL start foe hp 46 -> {"state":"g3run","hp":93,"sup":20,"xCd":1.5,"yCd":1.7,"kills":3,"foeHp":0}
ERIN start foe hp 84 -> {"state":"g3run","hp":92,"sup":18,"xCd":0.5,"yCd":2.6,"kills":3,"foeHp":0}
LOUIE start foe hp 84 -> {"state":"g3run","hp":60,"sup":38,"xCd":1.7,"yCd":2.7,"kills":3,"foeHp":0}
MARCUS start foe hp 84 -> {"state":"g3run","hp":125,"sup":50,"xCd":0.6,"yCd":0.8,"kills":3,"foeHp":0}
final g3boon | errors: none
```

### roguelite_loop
```
PASS Hearth: NPCs spread through the room [["ERIN",113],["LOUIE",158],["RANGER",213],["MARCUS",116],["SCOUT",213]]
PASS buds swarm: up to 4 latched at once, 103px from the keeper
PASS room clear: buds come home [13,31,22,35]
PASS A plucks a buried sprout into the string
PASS A eats a berry bush (heals)
PASS A opens a root chest
PASS an attack smashes a pot
PASS a boom bulb fizzes, then blows up the foe next to it
PASS death banks Moondew (45), keys and honey, counts the death
PASS A returns to the Hearth
PASS Mirror: Vitality rank bought (max HP 100 -> 110, dew left 35)
PASS next run starts with the upgraded health
PASS pushed to chamber 12: 9 boons kept, 2 bosses felled, 2 keys
PASS chamber 12 cleared: escape
PASS Pact of Roots opens after the escape
PASS heat can be raised (1)
PASS the next run carries the heat
PASS everything is saved
ERRORS: none
```

### growing_dialogue
```
PASS the intro hands straight into Erin's welcome
PASS then Marcus: "door's RIGHT there, bro"
PASS with only Will, the Root Door goes straight down
PASS tips arrive one at a time: ["MOVE WITH THE D-PAD","A: ATTACK. IT AIMS ITSELF"]
PASS Will's log counts the run
PASS after the fall, back in the Hearth
PASS new things to say after the first fall: ["LOUIE","RANGER","MARCUS","SCOUT"]
PASS Marcus opens with the new topic: "Bro. BRO. You died in like a minute. I timed it."
PASS next time, his usual lines: "Bro. BRO. The keeper's here. Everybody act natural..."
PASS unlock topics queue up
PASS unlocking Erin gives her a new topic
ERRORS: none
```

### waterworks_rule
```
PASS before Waterworks: Marcus never mentions it (20 lines checked)
PASS paging all 15 lines in the talk box: clean
PASS after MAKING WAVES: Waterworks comes up (3 lines)
ERRORS: none
```

### capsules_reset
```
PASS machine emptied in 54 real pulls; Rootdeep items 11/11; tickets left 27
PASS capsule keepers unlock in Rootdeep
PASS capsule weapons owned in the Armory
PASS all lantern colours selectable
PASS reset returned 54 items, tickets 27 -> 81
PASS every item is back in the machine
ERRORS: none
```

### lantern_menu
```
PASS down on the shelf highlights the Lantern menu
PASS A opens the Lantern menu
PASS CAPSULES: the unified machine
PASS a pull from the console spends a ticket
PASS B returns to the Lantern menu
PASS STATS opens
PASS ACHIEVEMENTS opens
PASS B twice: back to the shelf
PASS TRIPLE THREAT + a Knockout arcade clear + 10 wins pay 4 tickets
  shelf says: ✦ TRIPLE THREAT +2 MORE  +4 TICKETS
PASS Sprouts' CAPSULES opens the unified machine
PASS and B returns to the Sprouts menu
PASS Rootdeep's CAPSULES opens the same machine
PASS and B returns to the Rootdeep menu
PASS first visit to the Burrow plays its scene
PASS then the Burrow upgrades
PASS a full string: two found sprouts wait for the surface
PASS next door: the drop scene plays, sprouts climbing up
PASS and the two sprouts are banked in the Ledger
PASS then back to the run, chamber 2
ERRORS: none
```

### saves_onboarding
```
PASS first start: A goes straight into a new game (the intro)
PASS intro ends in the Hearth
PASS Erin walks over
PASS Erin's welcome plays
PASS objective moves on: GO DOWN THE BURROW
PASS with a save, the title opens the menu with CONTINUE
PASS NEW GAME asks first
PASS checkpoint written at chamber 2
PASS SAVE & QUIT returns to the menu
PASS CONTINUE resumes chamber 2 with the same petals
PASS CAPSULES opens from the menu
PASS a pull from Rootdeep spends a ticket and reveals the item
PASS dying plays a cinematic first
PASS then the death screen
death line: MARCUS SAW THAT. HE'S TELLING EVERYONE | msgs: ["FIRST FALL. EVERYONE HAS ONE."] | banked 3
PASS buds leap at foes (4 mid-air at once)
ERRORS: none
```

### walkups_burrow_menus
```
PASS new game plays the intro
PASS skip lands in the Hearth
PASS Erin walks over (approach)
PASS Erin starts the welcome
PASS welcome over, back in the Hearth
PASS no other approach yet: g3hub
PASS bottom door reads A: THE BURROW — GO DOWN
PASS going down plays the descend scene
PASS then chamber 1
PASS next chamber plays the drop scene
PASS rescued sprouts banked {} -> {"1":1,"2":1,"4":1}
PASS then chamber 2
PASS a plain drop has no dialogue
PASS plain drop ends on its own
PASS CONTINUE resumes without a drop scene
PASS back in the Hearth after the fall
PASS Erin walks up after the first fall
PASS Erin explains the Ledger: Will! The sprouts you saved are in the Ledger. That's the bed by the wall, look.
PASS Marcus explains tickets
PASS walk-ups mark topics heard
PASS START opens the Hearth menu
PASS SAVE GAME shows SAVED
PASS CAPSULES from the Hearth menu
PASS Erin explains the machine once
PASS B goes back to the Hearth menu
PASS NEW GAME arms once
PASS twice
PASS third press starts over
ERRORS: none
```

### text_audit
```
logical screen 240 x 304
screens checked: 257

## sprouts_menu [menu]
   OFF-SCREEN "z" x87 w10 y419
   SQUASHED "z"

## caps_idle [caps]
   OFF-SCREEN "z" x89 w10 y423
   SQUASHED "z"

## caps_show_rd_king [caps]
   OFF-SCREEN "z" x89 w10 y422
   SQUASHED "z"

## caps_show_rd_marcus [caps]
   OFF-SCREEN "z" x89 w10 y420
   SQUASHED "z"

## caps_show_rd_lantern [caps]
   OFF-SCREEN "z" x89 w10 y419
   SQUASHED "z"

## caps_show_style [caps]
   OFF-SCREEN "z" x89 w10 y417
   SQUASHED "z"

## sprouts_settings_reset [settings]
   OFF-SCREEN "z" x89 w10 y423
   SQUASHED "z"

## sprouts_settings_armed [settings]
   OFF-SCREEN "z" x89 w10 y420
   SQUASHED "z"

## sprouts_settings_done [settings]
   OFF-SCREEN "z" x89 w10 y417
   SQUASHED "z"

## rd_menu [g3menu]
   OVERLAP "ROOTDEEP" / "ROOTDEEP" (120x17)

## menu_full [g3menu]
   OVERLAP "ROOTDEEP" / "ROOTDEEP" (120x17)

## menu_newarm [g3menu]
   OVERLAP "ROOTDEEP" / "ROOTDEEP" (120x17)

ERRORS: none
```
