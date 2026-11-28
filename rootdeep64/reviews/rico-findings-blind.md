# Rico: Blind Findings (no source read)

Shots are in `reviews/shots/rico/NNN.png`. Resolution was 960x540, played mostly on virtual pad 0, with keyboard for run 2 and pad 1 for co-op. The driver restarted at about 03:11 (my harness time limit), which wiped the save. Shots 552 and later are on a fresh save.

Severity key: blocker / major / minor / nit / praise

## Bugs
1. **major: Reward door blocked by a pillar.** In CH2 (Burrows, run 6) the DEW door spawned directly behind a rock pillar. I approached it from the front, the right and the far left and slid off every time, so the door was unreachable and one of the two reward choices did nothing. Repro: seen once; look at CH2 layouts for exit doors placed behind pillars. Shots: 748, 750-756.
2. **major: Attack input skips the death screen.** If you press A/attack while dying (normal during a combo), the death screen ("THE DEEP KEEPS YOU", stats, dew banked) is dismissed instantly and you land in the hub, so you never see the run summary. Repro: die while mashing A. Shots: 646/647 (run 4), 871/872 (run 7).
3. **minor: Mission completes on the first frame of a run.** "MISSION DONE - TELL RANGER" showed on the first frame of the next run after accepting "Take the Elite Doors" (439). "MISSION DONE - TELL LOUIE" also showed at CH1 frame 1 (844). Missions look like they count earlier progress or stock you already hold. Shots: 436, 439, 844.
4. **minor: Boon text doesn't match its effect.** Kindled Heart says "+25 max health", but max HP went 100->136 in co-op (694). The BUILD screen shows "Attack +51%" for Fortune Edge but "DMG x1.00" in the stats (605). Shots: 694, 605.
5. **minor: Dash boon text reads like debug output.** "SIXTH SENSE - DASH BOON: Cast +14%. Dash power 14." and "ASHEN WAKE: Cast +14%. Dash power 14. Dash leaves a flame trail." A dash boon that boosts Cast, plus a raw "Dash power 14" stat. Shots: 494, 864.
6. **minor: The super button opens the echo card.** Pressing Y (super) as the last enemy dies opens the "ECHO" lore modal instead of firing, because the echo drops under the player. The super stays charged, but the input is lost. Seen twice. Shots: 524, 765/766.
7. **minor: Door label doesn't match the boon giver.** I entered a door marked with Peb's icon/label and got "EMBER SPEAKS" with a duo boon. Shot: 388.
8. **minor: Simultaneous super only fires for one player.** In co-op, both pads pressed Y on the same frame, but only one super fired, and P2 had to press again. Shots: 695/696.
9. **minor: Super sometimes needs a second press.** After "SUPER READY!" the first Y press sometimes did nothing. Shots: 804/805.
10. **minor: The first A press on some modals is eaten.** First A on the boon screen did nothing (113). The echo card's "A: KEEP IT" prompt appears about 0.5s late and the first A is swallowed (146/147, 690/691). Descend sometimes needed a second A (437).
11. **nit: Death screen shows the wrong biome.** I died in the Flooded Vault, but the death screen background showed the Burrows' pink floor. Shot: 829.
12. **nit: Run starts with a projectile already in flight.** Several chapter starts open with an enemy shot already on its way to the spawn point, and I took damage before acting. Shots: 185/186, 300, 507, 562.
13. **nit: Inconsistent heal after the Grub Mother.** Run 2 seemed to leave me at full HP after the boss (292), but runs 4 and 6 didn't heal at all (621, 794). Possibly a boon effect; unclear. Shots: 292, 621, 794.

## Combat feel / fairness
14. **major: The player character vanishes.** Hit-flicker lasts long enough that only the yellow ring shows for a long stretch. The super makes Will disappear. Grubs, bats and armadillos draw on top of him. Boulderfall's dust cloud whites out the player and the boss. Repro: take any hit or fire a super. Shots: 096, 099, 106, 245/246, 465, 525, 595, 675, 725, 728, 781, 787, 820.
15. **major: Enemy projectiles look like pickups.** Spitter shots are glowing pink orbs on a pink floor, the same look as heal/heart pickups. Grub Mother's floor adds look the same. In the Vault, crab and wisp shots are pale blue or white on a pale floor. Shots: 128/129, 281, 303-306, 376/377.
16. **major: Body-contact damage is large and not telegraphed.** Grub Mother ~16/touch, Drowned King 20+ (killed me mid-combo twice), flame wisps ~22-26 per melee exchange. The leap attack has a great ring telegraph, but body contact has none. Three of my deaths had no hit I could identify. Shots: 159, 166, 172, 339, 409/410, 530/531, 537, 828/829.
17. **major: No warning before a boss, and no heal before it.** CH4 and CH8 are bosses, but nothing in the door preview says so. In runs 1, 2, 3, 4 (co-op) and 6, the doors before the boss offered boons or petals and no Fountain, so I entered at 5-20% HP. Shots: 153-155, 387/388, 526/527, 609, 693, 769/770.
18. **minor: Sprout-spitters kite at the player's walk speed.** Normal 3-hit combos whiff repeatedly because the spitter retreats or relocates. The answer is the dash strike, which only the pause menu explains. Shots: 074-079, 322-331, 740-746.
19. **minor: Melee reach and facing are unclear.** On keyboard, aim is the last move direction, so I swung at air while an armadillo chewed on me (192). Petal Blade reach felt short. Shots: 192, 207-213.
20. **minor: Cast aim-assist overrides the stick.** Aiming up-right sent the cast at a crab far to the left. Shot: 803.
21. **minor: Bolt Step auto-redirects the dash.** "Dash strikes the nearest foe" pulls the dash, your defensive tool, toward enemies. Shot: 828.
22. **minor: Thornbow is underpowered.** Arrows are 8-11 damage, enemies walk through the stream, and hold-A heavy shows no distinct effect. 120->1 HP in room 1. Shots: 845-858, 867-870.
23. **minor: Root Maul swings lock you in place.** I could not cancel a swing into a dash, so contact damage piles up. Shots: 442/443, 451/452.
24. **minor: The shield bubble gives no feedback.** The bubbled crab took 1-2 per hit, and nothing on screen says "shielded" or "immune". Shots: 498, 806.
25. **minor: Damage numbers overlap.** Numbers stack into unreadable glyphs ("4'9", "?4)", "8!0", "16 16" over banners). Shots: 207, 289/290, 592, 597.
26. **nit: Bud scatter/rejoin is unexplained.** "PEB/LEAF/DEW/ZIP SCATTERED!" on hit, then the BUDS HUD line disappears and comes back. Unclear whether buds are lost. Shots: 102, 249-251, 368.
27. **nit: Co-op isn't easier.** Two players still wiped at the first boss with HP pools of 19 and 8. Elites seem to scale up. Shots: 683, 699-701.

## Controls / UI
28. **major: Dash strike is only taught in the pause menu.** The CH1 hint line ("A HIT · B CAST · R: DASH · HOLD A HEAVY · X SPECIAL · Y SUPER") never mentions dash strike. The pause menu does ("ATTACK OUT OF A DASH: DASH STRIKE"). Shots: 064, 604.
29. **minor: Hub hint is missing the keyboard key.** It reads "MORE KEEPERS: PRESS A ON ANOTHER PAD ( , ON KEYS)". The key is Enter. Shots: 010, 183, 839.
30. **minor: Keyboard is ignored while a pad is player 1.** WASD/Z/J did nothing until Enter joined the keyboard as P2. Shots: 089-091, 176.
31. **minor: Keeper Select text overlaps itself.** The description and flavor line print on top of each other at 960x540, and "A: READY" sits under the "MORE KEEPERS" line. Shots: 055, 057/058, 062, 184.
32. **minor: The CH1 control hint covers the fight.** It sits at the top-middle for the whole room and overlaps enemies, numbers and room-clear banners. Shots: 064-072, 193/194.
33. **minor: Station prompts need precise standing.** Armory, Mirror, Codex and Descend need precise positioning to show their prompts. NPCs and the dog body-block you or sit on top of the player. Shots: 040, 052, 415-425, 553-556, 711-718, 721.
34. **minor: Sprout pods aren't explained.** A pod doesn't collect by walking over it or pressing A; you have to hit it. No prompt says so. Shots: 141, 150-152, 222.
35. **minor: Banners linger over the arena.** "AN ELITE GUARDS THIS CHAMBER" stays for seconds while enemies act. The boss subtitle box sits bottom-centre through the whole fight and afterwards. Shots: 114-116, 228-230, 622.
36. **minor: Honey's purpose is unclear until the shop.** "+1 HONEY" drops mid-run look like a consumable. Only the shop description says "For gifts at the Hearth". I wasted time trying every button. Shots: 528/529, 600-603, 668.
37. **nit: Escape quits to the title with no confirm.** Shot: 178.
38. **nit: Settings are minimal.** Music, SFX and screen shake only: no remap and no readability or colour options. Shot: 179.
39. **nit: Bottom-bar prompts overlap the CH label.** "A: ACCEPT" and "AN ECHO" overlap the "CH x/12" label. Shots: 298, 622, 693.
40. **nit: P1/P2 tags overlap when co-op players stack.** They merge into "PI P2". Shots: 656-660.
41. **nit: Pillars snag the player on the way to doors.** Burrows pillars often sit between the spawn and the exit doors. Shots: 447-449, 484-486.
42. **nit: Camera drifts at walls.** Hugging a wall pans toward the void edge, which then fills about a third of the screen. Shots: 678, 857-860.
43. **nit: No locked feedback.** Pressing A on a locked keepsake does nothing visible. Shot: 020.
44. **nit: Fountain heal amount isn't shown.** The fountain gives partial heals (+50, or +58 from 67->125) and the door doesn't say how much. Shots: 468, 810/811.
45. **nit: Typo in shop name.** "A ROOT-TOOTHS STALL" is missing an apostrophe. Shot: 087.

## Sound
46. **n/a: Sound.** The headless browser produces no audio, so I could not evaluate it.

## Praise
47. **praise: Drowned King leap telegraph.** "HE LEAPS!" plus a red ring under the player is clear and fair; I dodged it 4 out of 4 times. Shots: 393-395, 405-407, 532.
48. **praise: Door previews.** Door reward previews and the boon cards are clean and readable, and duo boons (Wildfire Storm) emerge naturally. Shots: 080, 112, 226, 388.
49. **praise: Supers are fun.** "BIKE LANE" bicycle super, "SELFIE!" finisher, "STAGE DIVE!" dash: big, funny and satisfying. Shots: 097, 459, 073, 332.
50. **praise: Writing and reactivity.** Death quips ("HE ONLY SAT ON YOU FOR A MOMENT"), boss lines that change between runs, Erin reacting to the Grub Mother, echo notes. Shots: 145, 172, 410, 701, 872.
51. **praise: Co-op drop-in and revive.** One button joins, each player gets their own HUD corner, and "P2 IS DOWN - STAND OVER THEM!" uses a green ring. Shots: 540, 648-650, 700.
52. **praise: Mercy mechanics.** Death Defiance gives clear "DEATH DEFIED!" feedback, and Peb's block saves you. Shots: 777, 859, 273.
53. **praise: Hub progression is visible.** Banked sprouts appear as potted plants around the Hearth, and NPC missions, the Board and the Codex give long-term goals. Shots: 704, 708, 556.
54. **praise: Art direction.** The chunky low-poly N64 look is distinct, and each biome has its own palette. Shots: 001, 300, 388.
