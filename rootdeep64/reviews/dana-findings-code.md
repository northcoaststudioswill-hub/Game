# Dana: findings checked against the code (phase 2)

I read `README.md` and all of `src/` after the blind session. Line numbers refer to `src/`. Verdicts:
**CONFIRMED** (cause found), **DESIGN** (the code does this on purpose; the player problem is still real),
**PARTLY WRONG** / **WRONG** (I misread the screen), **UNCONFIRMED** (no cause found in the code).

Two claims in my blind review are wrong, and I have left the review unedited as instructed:
- Tip #2 ("press SP when hurt, it heals +10") is **wrong**. Selfie Flash never heals (moves.js:43-46). The green +10 I saw came from heart pickups dropped by kills (game.js:390).
- "A single beetle charge does 25-36 damage" is **wrong**. A beetle hit is 12 base, +9% per chamber (data.js:83, game.js:134). I was seeing two or three hits from several foes, 0.55 s apart (game.js:398). Even so, the overall lethality I reported stands.

---

## Blind findings, one by one

1. **Enemies on the entry point.** CONFIRMED, major. Wave 1 spawns in the top band, y 36-139 (game.js:155). Keepers always start at y=H-26 (game.js:132). Nothing enforces a safe radius or a grace period: `zoneT` only draws the biome title (game.js:157, ui.js:122). A beetle starts its charge whenever it is within 74 units (game.js:477) and covers 73 units (175 × 0.42 s). Its first cooldown is 1-2 s (game.js:137), so it can land a hit within about 2 s of arrival. Spitters fire at under 125 units on the same timer (game.js:470). Wave 2 spawns anywhere in that band with no distance check, even right next to the keeper (game.js:599).
2. **Difficulty wall.** DESIGN/balance, major. Foe damage rises 9% and HP 30% per chamber (game.js:134). Elites get 2.6× HP (game.js:136), and chamber 3 is always an elite room (game.js:150). The README (line 92-93) says "expect runs to be easier until it is tuned". For a newcomer on touch it was the opposite. Moondew income is roughly 2-6 per run (25% drop chance at 2 Dew, game.js:389), against Mirror ranks costing 10-45 (data.js:57-65), so meta progress is slow.
3. **Hero disappears, only the ring stays.** CONFIRMED, major. The i-frame flicker sets `ko.hide=true` on every other 1/14 s while `p.inv>0` (models.js:265), so the whole model vanishes, not just fades. A Super grants 1.4 s of `inv` (moves.js:50), and every hit grants 0.55 s (game.js:398). The ring is drawn separately (models.js:263), which is why it stays.
4. **Can't tell when you're hit.** CONFIRMED, major. `damagePlayer` (game.js:394-398) gives only a red particle burst, a 0.25 s tint and screen shake. There is no damage number on the keeper (`ftext` is only used for foes, game.js:371), and the model flickers away (see #3). Contact damage repeats every 0.55 s while a grub overlaps you (game.js:460-461).
5. **Hub A-prompt grabs the wrong target.** CONFIRMED, major. `hubTarget` picks whatever is nearest within 17 units (game.js:240-246). Louie's route includes `'P3'`, which means "walk to the nearest keeper" (game.js:224, 254), so he is nearly always closest. The Sprout Ledger bed (BED, game.js:207) sits on Erin's route (game.js:223). DOOR and BOARD are about 58 units apart, so standing between them picks the nearer one (game.js:207).
6. **Keeper select text overlaps.** CONFIRMED, major. Per-keeper text is written downward from the model's feet, up to 3 strings × 3 lines (ui.js:231-232). The solo description is fixed at VH-40 (ui.js:234-235) and the footer at VH-13 (ui.js:236), so they collide at 932×430. The "NEW MISSION" toast is also drawn at y=30 over the keeper label (ui.js:238), and the title at y=5 sits under the DOM START pill (shell.html:37).
7. **NEW MISSION banner over the station labels.** CONFIRMED, minor. `storyFinish` puts it in `joinMsg` for 4 s (story.js:164), drawn at y=32 (ui.js:75). Station labels sit at y≥23 (ui.js:60).
8. **Floating messages stack.** CONFIRMED, minor. `say2` is always at VH*.44 (ui.js:123). `ftext` floats at the entity (ui.js:108). "SUPER READY!" (moves.js:30), "SELFIE!" (game.js:415) and the special's name (moves.js:35) all spawn at p.y-24..28 with no stacking logic.
9. **NPC name tags collide.** CONFIRMED, minor. Names are drawn at the projected NPC position with no overlap avoidance (ui.js:63). NPCs only push apart at under 22 units (game.js:260-261), which is closer than the label width.
10. **"( , ON KEYS)".** PARTLY WRONG, minor. The key name isn't missing: it is a literal comma, the second-keyboard join key (ui.js:73). Unreadable as written, and it's shown to touch players who can't use it.
11. **Portrait barely playable.** CONFIRMED (layout choice), major. In portrait the stage is `min(width, 0.56·height)`, so 430×430 on this phone (engine.js:158). The title uses fixed offsets for "ROOTDEEP" at 50 px and "64" at VW/2+146 (ui.js:242-243), which overflow the 300-wide virtual space. The camera frames only 56% of the room when solo (models.js:236, fill .56), so foes at the sides are off-screen.
12. **Boon cards not tappable.** DESIGN, minor. Touch input is only the stick plus the six DOM buttons (input.js:25-36). Menus have no tap targets anywhere.
13. **Boon cursor moves by itself.** CONFIRMED, minor. Menu nav auto-repeats on a held direction after 0.38 s (input.js:65-68, `pressed()` line 68). You walk into the door with the stick held, and `boonUpdate` → `nav` scrolls (game.js:308). The 0.35 s A-guard (game.js:309) doesn't cover the cursor.
14. **"A: ACCEPT" over "CH 2/12".** CONFIRMED, nit. ui.js:187 (VH-22) is drawn over hudRun's chamber line at VH-14 (ui.js:117, drawn first via ui.js:274).
15. **Pause hard to find.** CONFIRMED, minor. Pause only opens from `runUpdate` on Start (game.js:515). In the Hearth, `hubUpdate` ignores Start (game.js:247 only checks `sel`). The pill is 64×26 at 55% opacity (shell.html:37).
16. **Pause lists keyboard and pad controls.** CONFIRMED, minor. Unconditional (ui.js:200-201). Dash Strike is explained only there and in the README.
17. **B didn't resume from pause.** UNCONFIRMED; probably my input. `pauseUpdate` resumes on B when on the main page and closes Build on B (game.js:315). I couldn't reproduce the cause from the code.
18. **No difficulty or assist option.** DESIGN, minor. Settings has three rows only (ui.js:136, game.js:620-626).
19. **Selfie Flash heals sometimes.** WRONG. SELFIE FLASH stuns, chips 8 damage and clears shots within 82 units (moves.js:43-46). It has no heal. The heals were heart pickups (game.js:390, 593). My review tip #2 is wrong.
20. **First SUPER press ignored.** PARTLY. `doSuper` returns silently when the meter isn't full or a freeze is active (moves.js:49), and `movesInput` skips all buttons during a dash-strike dive or a zoom (moves.js:88-97). There's no "not ready" feedback. I couldn't confirm that a press was dropped with a full meter.
21. **Stick directions change as the camera moves.** PARTLY WRONG. The camera never rotates: fixed pitch, translate only (models.js:233-244), and input is world-aligned (game.js:232-234). What I read as rotation is the pan and zoom-lean toward the keeper (models.js:237) plus the strong perspective. Door alignment was still fiddly, because of #22.
22. **Crates in front of reward doors.** CONFIRMED, minor. `rdArena` places 2-4 crates anywhere with y≥38. It only keeps them away from the centre and the bottom (game.js:129-131), not from the doors at (W/2±38, 26) (game.js:169).
23. **Room stalls on a hidden foe.** CONFIRMED (design gap), minor. Doors appear only when `RUN.enemies.length===0` (game.js:597). There's no off-screen or remaining-foe indicator, and HP bars only show once a foe is damaged (ui.js:104). Spitters deliberately back away when closer than 70 (game.js:468), which pulls them to the edges of a cropped view.
24. **Walked onto the dark ledge.** UNCONFIRMED. The keeper is clamped to x 13..W-13, y 32..H-11 (game.js:237). It's probably a mismatch between the room mesh and these bounds, but I didn't find the mesh dimensions to prove it.
25. **Stick and buttons cover the playfield.** DESIGN, minor. Fixed DOM overlay (shell.html:24-37) on top of a full-bleed stage. Nothing keeps the camera framing clear of the bottom-left and right corners.
26. **Moondew +0 vs hub DEW 30.** WRONG (not a bug). New saves start with 30 Dew (game.js:44). The death screen shows only this run's haul (ui.js:262). The starting stash isn't explained.
27. **Codex disagrees with the death screen.** PARTLY WRONG. Codex CHAMBERS counts cleared chambers (`stats.chambers++` in chamberCleared, game.js:158). The death screen shows chamber reached (ui.js:260). Same word, two stats. BOONS DISCOVERED counts boons *offered*: `boonSeen` is set in `mkBoon` (game.js:95), not in `takeBoon`.
28. **Keys disagree.** CONFIRMED (labelling). The hub shows banked `RD.keys` (ui.js:69). The pause shows this run's `RUN.keys` (ui.js:199). Same "KEYS" label.
29. **Erin says "three times" after 4 deaths.** CONFIRMED, nit. The event fires on `deaths>=3` with fixed text (story.js:111), so it's wrong whenever you first talk to her later.
30. **"talk to them".** CONFIRMED, nit. ui.js:168.
31. **"A ROOT-TOOTHS STALL".** CONFIRMED, nit. ui.js:188.
32. **Petal Purse is free money.** CONFIRMED, minor. Costs 50, gives 90 (game.js:193).
33. **Shop cursor on the first item.** CONFIRMED, nit. `uiSel=0` (game.js:179). Related: **B leaves the shop immediately and advances the run** (game.js:314). A player pressing B for "back" loses the shop.
34. **"Random god" / "The gods watch" unexplained.** CONFIRMED, nit. game.js:188, ui.js:194. The gods are only listed on Codex page 3 (ui.js:153).
35. **"Dash power 14" meaningless.** CONFIRMED, and **worse than I thought.** `boonDesc` prefixes every non-attack core boon with "Cast +v%", so dash boons read "Cast +14%. Dash power 14." (game.js:86; screenshot 409). A dash boon doesn't raise cast damage: `castMul` reads only `b.cast` (game.js:73). The tooltip is false.
36. **Buddy system opaque.** CONFIRMED, plus a bug. Every hit has a 30% chance to scatter a bud (game.js:399), which isn't explained. Buds sent from the bank are spent at run start (game.js:127) and are only returned if they survive. Bug: the Ledger toggle can never send two of the same sprout. The remove condition `RD.party.length<=inP` (game.js:344) is true whenever the party holds only that type, so a second A on PEB removes the first instead of adding another (screenshots 337/338). "< > EXCHANGE" switches to a second page (game.js:340) that is never introduced.
37. **"THE BURROWS" title every chamber.** CONFIRMED, nit. `zoneT=2` is set in every `rdNextChamber` (game.js:157), and the logo draws while `zoneT>0` (ui.js:122).
38. **Death-screen prompt late.** CONFIRMED (two causes). An 0.8 s input lock (game.js:654), plus the "A: THE HEARTH" prompt blinks on and off at 1 Hz (ui.js:266), so screenshots and glances catch it hidden.
39. **Echo notes and A.** CONFIRMED. Echoes open by walking over them, not by pressing A (game.js:519). Dismissing has a 0.5 s guard that eats early presses (story.js:196).
40. **"A: DONE · B: SKIP" on a 1/1 page.** CONFIRMED, nit. ui.js:81. Also, for ordinary chat on its last line both buttons read "BYE" (ui.js:84, "A: BYE · B: BYE").
41. **Mashing A fires SNEAKER KICK.** UNCONFIRMED; probably my touch tool. A heavy needs A held for at least 0.45 s (moves.js:26, 100-102). A lost `touchend` on the A element would hold `TS.btn.a` true (input.js:34), but I couldn't show that happens on a real phone.
42. **Controls hint lingers.** CONFIRMED, nit. Shown for the first 7 s of chamber 1 (ui.js:118), right over the top of the room.
43. **Heart door gives no popup.** PARTLY WRONG. `say2('+25 MAX HEALTH (RUN)')` does fire and also heals 25 (game.js:183). It lasts 2 s under the biome title card, and in elite rooms it's immediately replaced by "AN ELITE GUARDS THIS CHAMBER" (game.js:157).
44. **Mirror ranks weak and pricey.** DESIGN. data.js:57-65 (Bark Skin -3%/rank, Mending +3, costs 10→45).
45. **A after walking does nothing at stations.** UNCONFIRMED. Stations are matched at a fixed y=38 within 17 units (game.js:241), and the keeper can stand as high as y=32 (game.js:237). Most likely I was just out of range. There's no "near but not quite" hint.
46. **Sound not evaluated.** N/A. Sound is generated with WebAudio oscillators (game.js:27-40).
47. **No console errors.** Praise, confirmed at runtime.
48-52. **Praise items** (writing, art, two-thumb touch, door icons, supers): these stand. The door icons are drawn as shapes on purpose so phones don't miss glyphs (ui.js:24).

## New, found in the code (a player like Dana would hit these)

53. **Touch players can't open the Hearth menu.** Minor. The touch device hard-codes `sel:false` (input.js:52), and the Hearth menu opens only on `sel` (game.js:247). README line 22 says "Select opens the menu". The menu holds Intro and Settings, and from the Hearth on a phone there's no way back to the title or settings.
54. **Tapping START while talking silently gives away Honey.** Minor. In a conversation, Start gifts Honey with no confirmation (game.js:280-282). START is also the pause button everywhere else, so a phone player hunting for a menu spends their Honey.
55. **Accidental door pick while fighting near the top wall.** Major. Solo players take a door the instant they step within 13 units (game.js:602-604). Co-op gets a 0.6 s hold to prevent exactly this. Chasing a spitter to the top edge after the last kill drops you into the next chamber with no choice. This explains my run-7 "jump" to CH 3 at 4 HP (screenshot 244).
56. **The START pill covers every screen title.** Minor. A DOM button at top:8px centre (shell.html:37) sits over CHOOSE YOUR KEEPER (ui.js:226), MIRROR OF DEW / CODEX / SETTINGS (screenShell, ui.js:45), "<GOD> SPEAKS" (ui.js:181) and PAUSED (ui.js:197). Screenshots 409, 419, 432, 458.
57. **The Mirror description runs into the boilerplate.** Nit. `d + ' Bought with Moondew, kept forever.'`, where `d` has no full stop, so it reads "+10 max health / rank Bought with Moondew…" (ui.js:140; screenshot 419).
58. **Will's attack combo also shouts "SELFIE!"**, which is easy to confuse with the SP move SELFIE FLASH. The third combo hit triggers a white flash and "SELFIE!" text (game.js:415; keeper card "COMBO 3 ENDS IN A SELFIE FLASH", data.js:100). This is probably why I thought SP was firing or healing at random.
59. **Losing buds on hit is silent in the meta loop.** Minor. Buds you chose to "DIVE" with are already removed from the bank at run start (game.js:127). A 30%-per-hit scatter (game.js:399) means a newcomer who brings buddies usually loses them permanently. The Ledger warns "They are at risk down there" (ui.js:209), but only in small footer text.
60. **Camera crops the arena when solo.** Minor (phone). The solo fill factor of 0.56 (models.js:236) frames about half the room around the keeper, so on a small screen spitters shoot from off-screen. This makes #23 and #11 worse.
61. **Two DEW doors look alike.** Minor. A boon door from the god DEW is labelled with the god's name, "DEW" (ui.js:102). The plain Moondew reward door is labelled `d.kind.toUpperCase()`, also "DEW". They differ only by icon (star vs droplet). Screenshot 313.

---

### Short form

1. major: spawns with no safe radius or grace; beetle charge or wave 2 lands within about 2 s (game.js:155, 477, 599)
2. major: chamber-3 elite wall; slow Moondew income (game.js:134-136, 150, 389; data.js:57-65)
3. major: i-frame flicker hides the whole hero, including the 1.4 s super i-frames (models.js:265; moves.js:50)
4. major: no damage number or clear hit feedback on the keeper (game.js:394-398)
5. major: hub A-prompt stolen by Louie, who follows the player, and by the ledger bed on Erin's route (game.js:224, 240-246, 254)
6. major: keeper-select text collides; toast and START pill over the labels (ui.js:226-238; shell.html:37)
7. minor: NEW MISSION toast over station labels (story.js:164; ui.js:60, 75)
8. minor: floating texts stack (ui.js:108, 123; moves.js:30, 35; game.js:415)
9. minor: NPC name tags overlap (ui.js:63; game.js:260)
10. minor, partly wrong: "( , ON KEYS)" is the comma key, shown to touch players (ui.js:73)
11. major: portrait squashes to a square, title clipped, room cropped (engine.js:158; ui.js:242-243; models.js:236)
12. minor/design: menus not tappable (input.js:25-36)
13. minor: held stick auto-scrolls the boon cursor (input.js:65-68; game.js:308)
14. nit: "A: ACCEPT" over the chamber label (ui.js:117, 187)
15. minor: pause only in runs, tiny pill (game.js:247, 515; shell.html:37)
16. minor: pause shows pad and keyboard hints to touch players (ui.js:200-201)
17. unconfirmed: B-to-resume works in code (game.js:315)
18. design: no difficulty option (ui.js:136)
19. **wrong**: Selfie Flash doesn't heal; the heals were heart pickups (moves.js:43-46; game.js:390)
20. partly: SUPER fails silently when not ready or during dive (moves.js:49, 88-97)
21. partly wrong: camera doesn't rotate, it pans and leans (models.js:233-244)
22. minor: crates spawn in front of doors (game.js:129-131, 169)
23. minor: no remaining-foe indicator; spitters retreat off-view (game.js:468, 597; ui.js:104)
24. unconfirmed: walking onto the ledge (game.js:237)
25. design: overlay covers the playfield corners (shell.html:24-37)
26. wrong (not a bug): 30 starting Dew (game.js:44)
27. partly wrong: CHAMBERS = cleared vs reached; BOONS DISCOVERED = offered (game.js:95, 158; ui.js:150, 260)
28. minor: KEYS means banked in the hub, this-run in pause (ui.js:69, 199)
29. nit: "Three times" hard-coded (story.js:111)
30. nit: "talk to them" (ui.js:168)
31. nit: "ROOT-TOOTHS" apostrophe (ui.js:188)
32. minor: Petal Purse always profit (game.js:193)
33. nit: shop cursor on the first item; B exits the shop instantly (game.js:179, 314)
34. nit: gods unexplained (game.js:188; ui.js:194)
35. minor bug: dash boons claim "Cast +X%" they don't give (game.js:86 vs 73)
36. minor bug: Ledger can't send two of one sprout (game.js:344); 30% bud loss per hit (game.js:399)
37. nit: biome title on every chamber (game.js:157; ui.js:122)
38. nit: death prompt 0.8 s lock and blinking (game.js:654; ui.js:266)
39. nit: echoes open on walk-over; 0.5 s dismiss guard (game.js:519; story.js:196)
40. nit: "B: SKIP" on a single page; "A: BYE · B: BYE" (ui.js:81, 84)
41. unconfirmed: mash-to-heavy needs a 0.45 s hold (moves.js:26, 100-102)
42. nit: controls hint covers the room for 7 s (ui.js:118)
43. partly wrong: the heart message exists but is buried or overwritten (game.js:157, 183)
44. design: weak Mirror ranks (data.js:57-65)
45. unconfirmed: station range 17 at y=38 (game.js:237, 241)
46. n/a: sound (game.js:27-40)
47. praise: no console errors
48-52. praise: writing, art, two-thumb touch, door icons (ui.js:24), supers
53. minor: touch can't open the Hearth menu, `sel:false` (input.js:52; game.js:247)
54. minor: START during a talk gifts Honey with no confirm (game.js:280-282)
55. major: solo door pick is instant, so you enter doors by accident (game.js:602-604)
56. minor: START pill over every screen title (shell.html:37; ui.js:45, 181, 197, 226)
57. nit: Mirror description missing a full stop (ui.js:140)
58. minor: combo finisher also called "SELFIE!" (game.js:415; data.js:100)
59. minor: buds you bring are spent up front and often lost (game.js:127, 399; ui.js:209)
60. minor: solo camera crops half the arena (models.js:236)
61. minor: god DEW door and Moondew door both labelled "DEW" (ui.js:102)
