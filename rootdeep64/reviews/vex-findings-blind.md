# VEX — Blind Findings (Rootdeep 64)

Play window: 02:41–03:35 UTC, 960x540, keyboard only. 8 runs: 6 solo (as Will) and 2 with a same-keyboard Player 2. All screenshot paths are relative to `reviews/shots/vex/`. Shots 001–259 are from save #1; the driver process was killed at 03:12, so shots 300+ come from a fresh save #2.

1. **[major] Solo difficulty wall at chambers 2–3.** Six solo runs all died in ch2–3. I never reached a boss solo. Repro: play Will solo with the starting Mirror ranks. Shots: 066, 119, 153, 186, 222, 252.
2. **[major] Boons arrive far too late.** In 2 full runs I was offered no boon at all. The first boon appeared on run 3, ch1. Chamber 1 rewards are often a bud, a sprout or an Echo. Repro: start a run and note the ch1–2 rewards. Shots: 044/045 (bud), 107 (Echo), 137 (first boon, run 3).
3. **[major] Same-keyboard Player 2 is a degenerate power multiplier.** Pressing Comma in the hub adds P2 on the same keyboard. P2 gets a full HP bar, a super, shared boons and revives. Enemy counts per room didn't visibly change. With P2 I beat boss 1 on the first attempt and reached ch8 (boss 2 at <10%). Solo I never passed ch3. Repro: hub, press Comma, Descend, Z + Comma to ready. Shots: 253, 256, 336, 342, 473.
4. **[major] P2 controls are undocumented.** The hub footer says only "PRESS A ON ANOTHER PAD". I found Comma, Period, M, N and RShift by trial; Slash, Quote and Semicolon did nothing. Shots: 253, 330, 334a/b, 341, 475.
5. **[major] Sprout turrets relocate when approached.** Against a melee kit with no boons, chasing them through extra waves is what kills runs. Repro: ch3 of biome 1 or any Flooded Vault room; walk toward a turret. Shots: 199a–201, 236a/236, 380–383, 434.
6. **[major] Cast ("Mazel Tov Laser") snaps to 8 directions under a tilted camera.** Off-angle targets can't be hit, and whole volleys of 3–4 casts did zero damage. Repro: stand at roughly 30° to a turret and press X. Shots: 213, 217, 233a, 470/471.
7. **[major] Contact damage spikes.** One beetle exchange took me from 60 to 17 HP. Grubs do about 9–10 per touch. Combined with #2, this is the main reason solo runs fail. Repro: ch1–3, melee a beetle. Shots: 052a/052, 118/119, 186.
8. **[major] Player character is often invisible.** Pillars, VFX or the camera hide the Keeper, and only the gold ring is visible. There's no silhouette or outline. Shots: 175, 214, 235, 244, 410/411.
9. **[minor] Boss dialogue box covers the playfield and the player mid-fight.** Shots: 335, 343, 457/458, 463.
10. **[minor] Name collision between "Dew" and "DEW".** A boon god is called Dew (DEW door), and the HUD shows the Moondew currency as "DEW". Shots: 179/180, 436.
11. **[minor] Rarity inversion.** On one Zip offer, RARE Storm Luck (+8% crit) sat next to COMMON Storm Edge (+35% attack), so the rare was strictly the weaker pick. Shot: 238.
12. **[nit] Boon numbers change between offers with no explanation.** Thorn Edge showed as COMMON +35% in one run and RARE +51% with heal in another. Rarity scaling isn't explained. Shots: 137, 322.
13. **[minor] Doors mislabel what's behind them.** A "PETALS" door led to a Root-Tooth's stall (shop) first, and so did a "LUCKY" door. Two SHOP doors chained back-to-back. Shots: 148/151, 245, 101/109.
14. **[minor] HP lost across a stall transition.** I had 52 HP entering a stall and 44 on leaving, with nothing visible hitting me. This could be an enemy getting a free hit on room entry. Shots: 245, 246.
15. **[minor] Enemy spawns on top of the player when entering a room.** Shots: 171, 172.
16. **[major] Moondew economy is lopsided.** Solo deaths paid +0 to +8 Moondew. A boss kill paid +40 by itself, and the ch8 co-op run banked +95. Mirror ranks cost 8–60 (Death Defiance 60), and costs rise per rank (Golden Touch 8→14). Solo meta progression crawls, while P2 makes it fast. Shots: 067, 120, 187, 386, 473; Mirror 022/123/224/391.
17. **[minor] Heavy attack strictly outclasses the light combo.** Heavy does about 48 (72 with Thorn Edge) against about 14 per light hit, and it has knockback. I saw no reason to use light other than to finish. Shots: 091, 127, 461.
18. **[minor] Super (Bike Lane) sometimes deals no visible damage.** It charged past or through the target with no number. Other times it critted for 136/159. Shots: 210/211, 140/141, 441, 464.
19. **[minor] Floating text clutter.** "SELFIE!", "LEAF SCATTERED!", "SUPER READY!", damage numbers and pickup text stack on top of each other over the action. Shots: 047, 441, 464.
20. **[minor] Max-HP pickups and keepsakes seemed to apply unevenly between P1 and P2.** After a HEART door, P2 showed 155 while P1 stayed at 130. After boss 1, P2 was healed to full and P1 wasn't, even though P1 was the one wearing Pressed Flower. Shots: 365–370, 351.
21. **[minor] Errands only progress after you talk to the NPC, and nothing says so up front.** After a boss kill and a ch8 run, the Board showed 1/22. Shots: 476, 017.
22. **[minor] Settings are thin.** Music, SFX and screen shake only; no keybinding, no difficulty or assist options. Shot: 088.
23. **[nit] The Sixth Sense boon says "Dash power 14".** That number means nothing to a player. Shot: 456.
24. **[nit] Petal Purse (50p shop item) seemed to return more petals than it cost.** My petal count jumped right after I bought it, so it may be free money. Not verified. Shot: 101.
25. **[praise] The hub and NPC writing are excellent.** The keepsake-for-honey trade, Marcus's bet and the Board errands give runs purpose. Shots: 008–016, 068–072, 079–082.
26. **[praise] The Drowned King's "HE LEAPS!" red ring telegraph is fair and learnable.** It's the best design in the build. Shots: 466, 468.
27. **[praise] Death Defiance and the Mirror feel meaningful.** Defiance triggered at 21 HP and restored 83, which kept the boss fight alive. Shot: 461.
28. **[praise] Art direction.** The voxel N64 look, torchlight, and two distinct biomes (rootwood, Flooded Vault) are attractive. Shots: 036, 315, 406, 457.
29. **[praise] Death screen and revive UX.** Run stats, funny subtitles ("He only sat on you for a moment") and a clear "STAND HERE" revive ring. Shots: 473, 347, 450.
30. **[praise] Boon cards are readable**, and "the whole party shares it" is clear. Shots: 181, 238, 456.
31. **[nit] Sound not evaluated.** The build ran headless, so I heard nothing.
32. **[minor] The Pact (Heat) is sealed until the first escape.** That's reasonable, but given #1 a solo player may never see it. Shot: 474.
