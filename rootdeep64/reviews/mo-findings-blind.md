# ROOTDEEP 64: Mo's blind findings (multiplayer focus)

Played blind for about 50 minutes on 2026-11-28 (02:41-03:31 UTC). Driver on port 9104 at 1280x720. Screenshots are in `reviews/shots/mo/`. Full play log: `reviews/mo-log.md`.
Cast: P1 "Keys" on keyboard, "Dee" on pad 0, "Gramps" on pad 1, "Latecomer" on pad 2. After a fresh restart, pad 3 was P1 and two people shared the keyboard.
I couldn't assess sound because the browser was headless. No console errors showed up in either `log` check.

Severity: blocker / major / minor / nit / praise.

## Join / drop

1. **major — No drop-in mid-run.** With 3 players in CH3, a fresh pad pressing A or Start does nothing: no HUD, no "joins next room" message. The same happens solo (pad A and keyboard ',' both ignored). The late player sits out the whole run. *Repro:* start a run, then press A on an unused pad. *Shots:* 064-p4join-midrun, 065-p4start-midrun, 264-solo-join-attempt.
2. **major — No clear way to leave the party.** In the hub, Select opens the title menu for everyone, holding B does nothing, and quitting to the title keeps all 4 joined. The only drop I found is B on the keeper-select screen, and nothing labels it as "leave". *Repro:* try to remove one pad player from the hub. *Shots:* 121-gramps-select, 125-holdB, 127-hearth-from-title, 135-p2-B-select.
3. **major — Dropping renumbers everyone.** P2 pressed B at select, so P3 became P2 (pink to blue) and P4 became P3 (green to pink). The returning player then became P4. Colours and HUD corners all move. By the end even the host didn't know which pad was which. *Repro:* 4 players at keeper select, P2 presses B, then A. *Shots:* 135-p2-B-select, 136-p2-rejoin-select, 493-where-p2, 535-louie.
4. **minor — Keyboard P1's X at keeper select sends the whole party back to the hub.** A pad player's B at the same screen drops only that player. The same "back" idea does two different things depending on the seat. *Shots:* 385-p1-backs-out, 135-p2-B-select.
5. **minor — The 5th device is silently ignored** (no "party full" message). Three pads joining on the same frame all work, but only the last banner ("PLAYER 4 JOINED") shows, and all three spawn stacked on P1. *Shots:* 290-4p-join-burst, 291-5th-join, 292-5th-pad.
6. **minor — The second-keyboard seat (WASD+Z) is advertised nowhere.** The hub footer only says "( , ON KEYS)". Z/WASD joining as P3 is a happy accident. *Shot:* 240-Zjoin.
7. **nit — The hub join footer is overlapped by the DESCEND label.** *Shots:* 004-hub4, 236-fresh-skip.
8. **nit — Pad numbering on keeper select ("PAD 1", "PAD 2") is 1-based slot order, not player order,** so "P2 · PAD 2" can be the controller the couch calls pad 1. *Shot:* 482-select-erin.
9. **praise — Joining at the hub is one button, with big coloured "PLAYER N JOINED" banners.** The first device to press becomes P1, and pressing a pad first switches the intro hint to "START: SKIP". Two players on one keyboard work. *Shots:* 006-pad0join, 235-fresh-pad3, 237-comma-join.

## Who's who / readability

10. **major — All players are the identical character (Will).** Only a floating P-tag and a floor ring tell them apart. Other keepers are locked, and in an hour we could not work out how to unlock any. *Shots:* 007-three, 134-select4, 465-boss2.
11. **major — Stacked players merge into one sprite with one tag.** There's no push-apart between players. *Repro:* move 3-4 players the same way. *Shots:* 436-t, 146 (147-p3super shows a "P3" super on a Will wearing P4's ring), 290-4p-join-burst, 074-revive2.
12. **major — Players disappear under the corner HUD panels.** The camera doesn't keep players clear of the 4 corner panels. *Shots:* 140-4p/141-where-p3, 492-f (P4 under P3's panel and P3 under P4's), 494-where-p2, 530-end, 078-elite.
13. **major — Players vanish behind dark foreground walls and props,** with no silhouette or outline. *Shots:* 180-elite4/181, 248-kb/249, 451-t to 455-p2-hide, 274-solo, 532-wipe8.
14. **minor — Damage numbers and barks ("SELFIE!", "STAGE DIVE!") pile onto the P-tags.** *Shots:* 030-fight, 031-fight, 144-4p, 500-special.
15. **minor — Downed bodies carry no P-tag,** only the ring colour. With 2-3 down you can't tell who's who, and the "STAND HERE" labels overlap each other and the tags. *Shots:* 167-p1revive, 198-dee-to-p1, 346-elite, 524-e.
16. **minor — Grubs swallow a player sprite entirely** (only the ring stays). The boss body covers players the same way. *Shots:* 217-2p, 470-t.
17. **minor — Before P2 joins, P1 has no ring or tag at all** in the hub. *Shot:* 004-hub4.
18. **minor — The in-run control banner sits over the top of the arena** for several seconds while enemies are already acting. *Shots:* 138-4p, 488-4p-final.

## Menus with several controllers / input

19. **blocker (for a shared wallet) — Any controller drives any menu, including purchases.** Gramps' A bought Vitality in P1's Mirror. P1 bought Swiftness inside Gramps' Mirror. Other pads move P1's Armory cursor, and B on another pad closes it. Nothing on screen says who bought what. *Shots:* 013-mirror to 014-mirror-p3buys, 009 to 011, 203-gramps-mirror to 205-p3-buys-too.
20. **major — The boon screen is one shared cursor that any player can confirm.** Gramps accepted a boon for all 4 while others were still moving the cursor. *Shots:* 097-boon-p3down to 099-boon-gramps-accepts, 228-ember.
21. **major — Button hints follow P1's device, not the acting player.** Pad players get "Z/X" in Mirror, Armory and dialogs, and keyboard players get "A/B" when a pad is P1. The in-run control banner only shows P1's device. Keeper select is the exception: its per-column hints are correct (praise). *Shots:* 018-p3-ranger, 028-start, 203-gramps-mirror, 241-Spacejoin, 244-kb-run, 353-dee-armory, 542-dialog-move; correct: 356-select-2p.
22. **major (bug) — Two players pressing interact on the same frame at two different stations: neither opens.** It reproduced twice. Pressed alone, it opens. *Repro:* P1 at the Mirror and another player at the Codex both press on the same frame. *Shots:* 425-two-prompts, 426-two-open, 427-two-open-b, 428-kb-only.
23. **major (bug) — Simultaneous supers: only P1's fires.** P2-P4's meters stay full. Fired one at a time, they all work. *Repro:* all four press super on the same frame. *Shots:* 182-4supers, 184-4supers, 185-p4super.
24. **minor — An NPC dialog opened by one player freezes everyone.** *Shot:* 542-dialog-move.
25. **minor — The attack button is also confirm,** so mashing skips the death summary (there's a short lockout, but sustained mashing gets through) and can open NPC dialogs in the hub. *Shots:* 231-2p, 289-solo-death, 347-pile/348-pile.
26. **minor — Pause has no "who paused" label and no per-player options** (leave or swap seat). Escape in the pause menu didn't visibly close it. *Shots:* 294-midrun-start, 296-esc, 297-esc2.
27. **minor — The Echo / lore note has no close prompt** and ignores the first press for about 1 s. Pad A didn't close it, keyboard Z did. (Correction from mid-session: the Echo opens on walk-over, not with E.) *Shots:* 088-echoE, 089-note-close, 279-echo-Z, 281-echo-Z2.
28. **minor — Mirror purchases have no confirm,** so rapid presses buy several ranks from the shared dew. *Shot:* 429-mirror-buys.

## Shared resources / fairness

29. **major — Doors are first-touch-wins for the whole party.** There's no vote and no "gather at door", and drifting sticks pick routes. *Shots:* 041-doors/042-doors, 143-4p/144-4p, 464-door.
30. **minor — A shop heal bought with shared petals heals only the buyer.** The downed partner stays down. *Shot:* 373-bigheal.
31. **minor — The strong player tanks and bleeds, and there's no way to share health** or hand a pickup to a weaker friend. *Shots:* 229-after-boon, 502-f.
32. **minor — Door labels don't say what they give.** "FRUIT" with no boon became petals. "DEW" appears both as a god (boon) and as a currency door. "PEB" and "LEAF" are sprout names. *Shots:* 401-fruit, 441-dew, 514-f, 516-dew-door, 464-door.
33. **minor — Honey unlock is unclear.** We had HONEY 3-4, but Erin never offers a hand-in and select still says "GIVE ERIN HONEY: 0/3". Louie says "three honeys" while the bar shows 4. *Shots:* 478-erin, 482-select-erin, 485-gramps-Y, 536-louie.
34. **minor — End-of-run stats are party totals only** (no per-player line or MVP). The codex said CHAMBERS 3 while the wipe screen said 4. *Shots:* 118-gramps-alone, 130-codex.
35. **praise — Shared run rewards (Heart +25 max, Fountain heal, boons) apply to every player,** which keeps a weak player alive. *Shots:* 063-heart, 308-door-race, 331-fountain4.

## Revive / wipe

36. **praise — The revive UX is excellent.** "P3 IS DOWN — STAND OVER THEM!", the green STAND HERE ring, "P3 IS BACK UP!", and red DOWN on the HUD. Revive chains between players work. *Shots:* 068-elite to 074-revive2, 324-revive.
37. **minor — The effective revive radius is smaller than the drawn ring.** Standing inside the ring did nothing until the player stepped onto the body. The progress sweep is faint. One revive took about 12 s with two reviving (unclear why). *Shots:* 321-revive-arc, 322-revive-arc, 167-p1revive to 172-revive-E.
38. **minor — Downed players revive free when the party changes rooms,** and the leader can take a door while friends are down. *Shots:* 177-door-with-downed, 178-door-with-downed, 374-after-shop.
39. **minor — The downed HUD panel blinks to empty,** so in some frames it shows just "P1 WILL" with no bar or DOWN. *Shots:* 415-3p, 472-t.
40. **praise — The wipe screen lands well** (flavour lines vary, Moondew banked) and pad A dismisses it fine. *Shots:* 118-gramps-alone, 384-wipe5, 533-end.

## Camera

41. **major — The camera frames only living players.** Downed bodies end up off-screen with no edge marker. *Shots:* 376-2p, 377-find-downed, 415-3p, 416-3p.
42. **major — With most players down, the camera zooms in on the last survivor** even when they're behind a wall. The downed pile gets cropped. *Shots:* 346-elite, 532-wipe8.
43. **minor — Every super does a letterbox and zoom on its caster for about 1.5 s,** cropping the other players. *Shots:* 047-p2-Y2, 109-p1super, 185-p4super.
44. **praise — 2P framing is roomy and readable.** Party line-up at room start is neat. *Shots:* 212-2p, 302-rescue-gramps, 465-boss2.

## Scaling / difficulty

45. **minor (feel) — 4P felt harder than 3P.** More enemies per room, everyone bleeds at once, and supers steal the camera. 8 wipes, never past CH4, and the first boss never beaten. Room-start damage happened before anyone moved. *Shots:* 138-4p, 488-4p-final, 474-boss.
46. **minor — HP doesn't visibly scale with party size** (110 or 120 each regardless). Solo CH1 had 2 foes compared with 4-6 in 3-4P. *Shots:* 260-solo-run, 137-run2-start.

## World / hub / misc

47. **minor — Hub interaction prompts can sit on top of the player at the Root Door** (another player's "A: ERIN" box). The first Z there sometimes did nothing. *Shots:* 021-p1-descend, 354/355-descend-prompt, 487-4-again.
48. **minor — NPCs wander through the player crowd** and overlap name tags, so you talk to the wrong NPC. *Shots:* 017-hub, 386-heat, 541-erin-p2.
49. **minor — The locked HEAT station gives no prompt or reason.** *Shot:* 387-heat.
50. **minor — Doors need a dead-centre straight push.** Brushing the frame doesn't trigger them, and boulders sometimes block doors. *Shots:* 093-race, 226-ember to 228-ember, 269-fountain, 400-fruit.
51. **minor — The green turret "buds" look like the friendly sprouts on the title screen.** *Shots:* 052-ch2, 055-hitbud.
52. **nit — Text issues.** "A ROOT-TOOTHS STALL" is missing an apostrophe. "+10 max health / rank Bought with Moondew" is missing a full stop. The boon footer overlaps the chapter label. *Shots:* 254-shop, 429-mirror-buys, 228-ember.
53. **nit — An Echo pickup spawned hidden behind a boulder.** *Shot:* 408-3p.
54. **praise — Hub interact prompts stack per player in that player's colour.** *Shots:* 352-dee-armory, 480-erin3.
55. **praise — Charming writing and a cozy art direction.** *Shots:* 003-intro*, 384-wipe5, 536-louie.
