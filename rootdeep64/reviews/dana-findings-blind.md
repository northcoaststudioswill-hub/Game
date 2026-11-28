# Dana — blind findings (phone, touch, 932x430 landscape + 430x932 portrait)

All screenshots are in `reviews/shots/dana/`. "Repro" is written from a player's point of view.

1. **Enemies spawn on or right next to the player's entry point.** Severity: **major.** Repro: enter a chamber (especially ch2 and the ch3 elite room); a beetle or grub sits on the arrival spot and hits before you can act. Shots: 133, 153, 341, 350, 421, 430, 452/453 ("PEB BLOCKED!" on the first frame).
2. **The difficulty curve is a wall for a newcomer.** Severity: **major.** Repro: play 16 runs with Mirror upgrades. Best result was CH 3/12 (7 times); two deaths in CH 1. A single beetle charge does 25-36 damage; 120 -> 4 HP in chamber 1 (465). Shots: 057, 099, 134, 156, 345, 418, 454, 467.
3. **The player character disappears, leaving only the gold ring.** Severity: **major.** Repro: get hit, or use SUPER / Selfie, or start a chamber; Will is invisible for ~1 s. Shots: 120, 148, 236/237, 272, 372/373, 378, 423, 428, 466.
4. **Hard to tell when and from what you take damage.** Grubs overlap the hero sprite and HP just drains. Severity: **major.** Shots: 099, 195, 216, 411, 446.
5. **Hub interaction prompt targets the wrong thing.** Wandering NPCs (Louie, Scout) and the planter steal the A prompt. Severity: **major** (phone). Repro: walk toward Erin and press A: you get Louie (401) or the Sprout Ledger planter (402); Scout follows you and takes the prompt (017, 062); Louie takes the DESCEND prompt (141); Marcus is blocked by Louie (197/198); BOARD opens instead of DESCEND (108).
6. **Keeper select text overlaps until it can't be read.** Severity: **major** (UI). Repro: Descend -> choose keeper. Description lines print over each other, the keeper name sits under the NEW MISSION banner, and "CHOOSE YOUR KEEPER" sits under the START pill. Shots: 023, 024, 025, 083, 084, p05.
7. **"NEW MISSION" banner covers the hub labels (MIRROR / ARMORY).** Severity: minor. Shots: 020, 022.
8. **Several floating messages stack in the same spot.** "THE DEEP STIRS - MORE RISE", "SUPER READY", "SELFIE!" and the "SELFIE FLASH!" text pile on top of each other. Severity: minor. Shots: 210, 271.
9. **NPC name tags collide** ("MARCUS" over "RANGER" reads as "MARCUS ANGER"; "LOUIE" and "SCOUT"). Severity: minor. Shots: 014, 106/107, 434, 455.
10. **Hub footer text is broken:** "MORE KEEPERS: PRESS A ON ANOTHER PAD ( , ON KEYS)", with an empty key name in the parentheses. Severity: minor. Shots: 012, 420, p03 (where it also overprints "1/4 KEEPERS").
11. **Portrait mode is barely playable.** Title "ROOTDEEP64" is cut off at both edges; the game is a strip in the top ~45% of the screen with empty black below; chamber sides are off-screen, so enemies shoot you from outside view. Severity: **major** (phone). Shots: p01, p03, p06, p08, p09.
12. **Boon cards can't be tapped.** Tapping a card does nothing; you have to use stick + A. Severity: minor (touch). Shot: 053.
13. **Boon menu opens with the cursor on whatever the held stick points at** (still holding stick while walking in -> bottom card highlighted). Risk of picking the wrong boon. Severity: minor. Shots: 190, 116/117.
14. **"A: ACCEPT" overlaps the "CH 2/12" footer** on the boon screen. Severity: nit. Shots: 052, 416.
15. **Pause menu is hard to find on a phone.** Only the small START pill at the top opens it, and only during a run; in the hub START gifts honey or does nothing. Severity: minor. Shots: 159, 458.
16. **Pause menu shows keyboard/gamepad controls to a touch player** ("PAD: A HIT ... KEYS: Z · X · C · V · SHIFT") and is the only place "Dash Strike" is mentioned. Severity: minor. Shot: 458.
17. **B doesn't back out of the pause menu / resume**; I had to tap START again. Severity: nit. Shot: 461.
18. **No difficulty or assist option.** Settings has only music, SFX and screen shake. Severity: minor (design). Shot: 459.
19. **SP (Selfie Flash) heal is unexplained and inconsistent:** +10 heal sometimes (228), nothing other times (233). Severity: minor. Shots: 228, 233.
20. **First SUPER press sometimes ignored**, with no feedback when the bar isn't full. Severity: minor. Shots: 413/414, 345.
21. **The camera turns as you move around crates, so stick directions change meaning**; lining up with doors takes several tries. Severity: minor. Shots: 188, 189, 307-310, 362-364.
22. **Crates parked directly in front of reward doors.** Severity: minor. Shots: 355, 361-363, 415, 213/214.
23. **Room stalls when an enemy is hidden behind a crate or off-screen**: no doors, no arrow, I didn't know what to do. Severity: minor. Shots: 206, 425.
24. **Player can walk onto the dark ledge outside the room floor** near a torch. Severity: minor. Shot: 266.
25. **Thumbstick and SP/B buttons cover parts of the playfield**; enemies hide under the stick at bottom-left. Severity: minor (phone). Shots: 015, 038, 381.
26. **Moondew numbers look inconsistent.** The death screen said "MOONDEW BANKED +0", but the hub then showed DEW 30 (that was the starting stash, which isn't explained). Severity: minor (confusing). Shots: 057, 058.
27. **Codex stats disagree with the death screen** (Codex "CHAMBERS 2" after a death screen saying 3; "BOONS DISCOVERED 3" when I had taken 1). Severity: minor. Shots: 057, 071.
28. **Keys count disagrees:** hub HUD shows KEYS 1, pause menu shows KEYS 0. Severity: minor. Shots: 420, 458.
29. **Erin's dialogue says "three times" after four deaths.** Severity: nit. Shot: 165.
30. **The Board says "Go and talk to them" about Erin.** Severity: nit. Shot: 398.
31. **"A ROOT-TOOTHS STALL" is missing an apostrophe.** Severity: nit. Shot: 257.
32. **Shop "Petal Purse" (pay 50, get 90) is always free profit.** Severity: minor (balance). Shots: 257/258, 268.
33. **Shop cursor starts on an item, not on LEAVE**; easy to buy by accident. Severity: nit. Shot: 364.
34. **Shop boon says "Random god, chosen now"**, but gods are never introduced. Same for "The gods watch" on the Build screen. Severity: nit. Shots: 257, 460.
35. **"Verdant Step: Dash power 14"** is a number with no meaning to a player. Severity: nit. Shot: 409.
36. **Buddies/sprouts system is opaque.** "PEB SCATTERED", "LEAF JOINED", but the BUDS counter didn't change (132); the Sprout Ledger is the planter, not Scout; "< > EXCHANGE" is never explained; pressing A twice toggles "DIVING x1" back off (337/338). Severity: minor. Shots: 044, 132, 219, 336-339.
37. **"THE BURROWS" title card shows again on every chamber**, which makes it look like a new area. Severity: nit. Shots: 234, 382, 452.
38. **Death screen "A: THE HEARTH" appears after a delay**, so the first A press is ignored. Severity: nit. Shots: 277, 396.
39. **Lore note popups take A while you're walking up to them** (first A ignored once; another time the note opened from an A press meant as an attack). Severity: nit. Shots: 050, 354.
40. **Dialog box on a 1/1 page shows "A: DONE · B: SKIP"**; "skip" means nothing there. Severity: nit. Shot: 401.
41. **Mashing A sometimes fires the heavy "SNEAKER KICK!"** without me holding. Severity: nit. Shots: 306, 309, 442.
42. **Controls hint stays painted over the first room for a long time** and overlaps enemies. Severity: nit. Shots: 421, 462.
43. **Heart door gives no popup** saying what you gained (max HP 140 -> 165 silently). Severity: nit. Shot: 214.
44. **Mirror upgrades are weak and climb in price fast** (Bark Skin -3%/rank; Mending +3; Might 10 -> 22). Severity: minor (balance). Shots: 249, 328, 419.
45. **Interaction buttons need you to stand still**: pressing A right after moving often does nothing at the Mirror/Armory. Severity: minor. Shots: 170, 172.
46. **Sound could not be evaluated** (headless browser). Not a bug.
47. **No console errors** were logged when I checked mid-session. Praise.
48. **Praise:** charming writing and characters (Erin, Marcus, lore notes, death quips like "Erin will come digging"). Shots: 060, 094, 443, 467.
49. **Praise:** chunky voxel/clay art style reads well on a phone; lighting and the hub look cozy. Shots: 001, 012, 435.
50. **Praise:** two-thumb touch works: moving and pressing A/B at the same time is reliable, and the A button is big. Shot: 031.
51. **Praise:** door rewards shown by icon above each door make the choice easy to understand. Shots: 041, 313.
52. **Praise:** SUPER moves (Bike Lane) feel powerful and fun. Shots: 044, 185, 428.
