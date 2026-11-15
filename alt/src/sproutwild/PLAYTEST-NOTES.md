# Sproutwild playtest notes (v6.10)

Notes from playing the build after v6.10, kept for the next work session.
**Update, v6.11:** items 1-7, 9-11, 13, 14 and 17 are fixed (see CHANGELOG v6.11). Item 8 needed no change, and item 15 was a misread: the intro has six slides and Erin's does address the keeper. Still open: 12, 16, 18, 19, 20, 21, 22. Played with real key presses on a
phone-shaped screen (430x932). Screenshots are in `shots/v6.10-notes-*.png`.

Run covered: Meadow from the north-west gate, the road north, KISS (first trainer),
Lantern Town, PIP's request, the Ranger gym.

## Bugs

1. **"SEND WHO?" starts on the fainted buddy.** When your buddy faints, the switch
   list puts the cursor on the fainted one. Pressing A plays an error beep and nothing
   else, so a new player thinks the game froze. Start the cursor on the first healthy
   buddy and mark fainted ones (greyed, "FAINTED").
   (`sw-module.js` battle `BT.phase==='party'`)
2. **BUDDY with nobody to swap to.** With one healthy buddy left, choosing BUDDY opens a
   list where every choice beeps; only B gets out. Grey out BUDDY, or say "Nobody else
   can fight."
3. **Gym prompt cut off.** At the Ranger gym door the line reads
   "A: BATTLE FOR THE VERDANT SIGIL · B: L…" and runs off the right edge. Shorten it
   ("A: BATTLE · B: LEAVE") or wrap it.
4. **Town top bar overlap.** In Lantern Town, "RANGER'S GYM" is drawn over the sector
   name and the resource counters in the top bar.
5. **PIP's request wording.** "Bring 7 BERRY. Gather it, chop it, mine it" uses one
   generic line for every resource; berries are not chopped or mined. Pick the verb by
   resource.
6. **Town banner wraps badly.** "Lanterns lit, doors open - welcome in" breaks with
   "in" alone on the second line.

## Balance

7. **Ranger gym is a wall.** Ranger opens with a Lv9 FERNFANG and keeps lowering
   ATTACK. A Lv6/5/5 party lost two buddies while doing about half of its HP. Options:
   open with Lv7, show "Recommended Lv8" at the door, or have Marcus warn you.
8. **KISS (first trainer) feels right.** Lv6 DRIZZLET alone beat two Lv4s with 6/58 HP
   left; +30 petals. Leave it.
9. **No nudge to switch buddies.** Both fights were played with the lead only. The first
   time a move is "not very effective", a one-line hint ("BUDDY swaps in someone else")
   would teach switching.
10. **No type hint on moves.** The move list shows power only. A small type colour or
    "good vs grass" line would help Pokemon players. Same for wild level tags (type dot).

## Feel and clarity

11. **Goal line is about home when you are far away.** In town it says "Ask the Great
    Lantern to grow". Away from Sunkeep, show the local goal (the gym, a request), or
    prefix home goals with "At Sunkeep:".
12. **Crowding on paths.** Three buddies, the squad and Louie pile onto the player on
    narrow town paths. Spread them wider or let them trail in single file on roads.
13. **Low HP after fights.** Drizzlet left the KISS fight on 6 HP with no hint; the next
    wild could finish it. After a fight with a buddy under 25%, Louie could point to the
    nearest Lantern post.

## Carried over from earlier sessions (still open)

14. Starter pick: the arrow points at the middle buddy, but the A prompt names whichever
    buddy you are nearest.
15. The three story slides never say who you are or what you will do. A short fourth
    slide could set that up.
16. A always throws at catchable wilds, so you cannot choose to battle a weak wild for
    experience while sprouts are with you. Consider SELECT+A or a "battle" ring mode.
17. The bench still has a "SPROUT JOBS: axe & pick crews" row after tools were removed.
18. Arriving in the Meadow puts tall grass right beside you; check it does not feel
    sudden.
19. Catch odds after the first catch felt generous in one run (three catches in a row).
    Needs more runs.
20. The Great Lantern still offers a free full heal ("rest"), which overlaps with
    sleeping in the cottage.
21. After the garden bed, the base goals (kiln, bench) are a long chain with little
    guidance. The bench and nook paths were not replayed after v6.8.
22. `docs/index.html` (public GitHub Pages) still holds the 4-cartridge build. Update
    only with Will's go-ahead.

## Suggested order

Quick fixes first (1-6, 11, 17), then the gym balance (7) and switching hint (9), then
the bigger feel items (12, 16).
