# Sproutwild playtest notes: v7.0, first-time player and systems reader

Two passes, kept separate on purpose:
- **Part A** is what a new player sees and feels, from the title screen on.
- **Part B** is what someone reading the systems would notice.

Method and limits: the game was played with scripted key presses on a phone-shaped screen
(430x932), with screenshots at each step. Those are the eyes here, not a person's hands, so
feel, timing and thumb reach are NOT verified. Anything about how it feels in the hand needs
Will's playtest on the iPhone.

Screenshots reviewed: title, file select, Great Lantern intro slide, opening (YOU tag, seeds,
berries), starter pick, Meadow arrival, first wild, goal line back at base.

---

## Part A: first-time player

### Clear and working
1. The title screen says what the game is: GROW, THROW, CATCH, BUILD under the logo.
2. The file select is plain: three files, "A NEW GAME", "B BACK".
3. The intro slides are short. The first one is about the Lantern and the crack.
4. The "YOU" tag over the keeper makes it obvious which character is you.
5. The guide arrow over the seeds, then the berries, is easy to follow.
6. Erin's and Marcus's captions are short enough to read in one go.
7. The starter reveal (v7.0) is the strongest moment so far. The shadow, the flash, the name,
   then the facts one line at a time. It reads as an event.
8. The goal line tells you the next step at each point ("Take the south road to the Meadow").

### Confusing or unclear
9. **The top-bar counters are a code nobody explains.** "♣1 ◆0 ⊗30" appears from the first
   screen. A new player cannot tell wood, stone and petals apart, or what the value after
   the icon means. Add a one-time legend, or write the names when a number changes.
10. **The starter name labels collide with the scenery.** In the opening, CUYAPUP, BESSLING
    and GRASSKIN sit on a bush and a path edge, and their labels run into the sprites.
    Move the labels up, or hide them once you have picked.
11. **"Lv2" floats over the first wild with no name.** A new player sees a red shape and a
    number. Show the species name too, at least for the first few wilds.
12. **Nothing says what a wild buddy is.** Louie says "A wild buddy. They live in the tall
    grass," but not that you can catch it, or what catching gives you.
13. **The starter choice does not say why you would pick one.** The reveal shows jobs and
    moves, but there is no line like "pick the one that suits your plan." A new player will
    choose by colour or looks.
14. **"Build a COTTAGE" comes before the player knows what a buddy is for.** The reason is
    in Marcus's lesson, but the goal line alone is not enough. Consider one sentence on the
    goal line: "A roof lets home buddies work."
15. **Plots and crops are explained once, in the middle of a quest.** The garden lesson
    comes after the cottage, which is good, but the plot menu's three choices do not say
    what each one costs you in sprouts.
16. **Sleep is in the cottage menu with no hint that it skips a day.** The menu says "until
    morning" only when it is night. In daylight it just says "a quick nap" and a new player
    may never learn it skips the night.

### Frustrating
17. **The reveal is 4 seconds before you can act.** A is skip, but the first press only
    jumps to the end. Let a second press go straight into the game.
18. **Pressing A next to a wild throws, not battles.** This was a v6.10 choice. A new player
    who wants a fight cannot easily get one. Note it, since it is the reverse of what
    most monster games teach.
19. **Walking into the Meadow's first wild with nothing thrown still takes a turn to
    register.** Not confirmed on screen; needs a real-time look.

### Delight
20. Opening with the starter as a small creature near the Lantern, then the three starters
    greeting you as a group, is a good first image.
21. Lantern Town's gate pages and Louie's tips give the place a voice.

---

## Part B: systems reader

### Sound and coherent
22. **One clear loop:** throw sprouts, gather, bring home to the Lantern, grow more
    sprouts, build. Each step names the next.
23. **Starters are the right kind of valuable:** two jobs each, a move only they learn,
    never in the wild. Ties the Ohio lore into the systems, not just the names.
24. **Plots force a choice** between sprouts, berries and fiber. This is the management
    decision the research pointed to.
25. **The Data Center is a clean gate.** Three buddies by default, twelve more behind a
    building. Catching and SWARM both explain why they are blocked.

### Needs a decision
26. **How many plots?** Six, plus one with a roof, plus one more at base level 2. That is
    eight at most. Enough to choose, but nothing tells the player that more plots are
    coming. Decide whether plots should be buildable.
27. **Crop balance is untested.** Berries take 60 seconds of growth, fiber 90, with a
    waterer at level 1 speeding that up. Whether that competes with sprouts for space
    depends on how many sprouts a player needs, which is not measured yet.
28. **Building time is unverified.** The new 9-second base is meant to feel right, but I did
    not time it in this pass. Check the cottage and the Data Center in a real session.
29. **Starter balance is unverified.** Starters are stronger on paper (for example BESSLING
    38 HP, GRASSKIN 40). Test whether they beat the first trainer without help.
30. **Catch rates are not checked against the new cap.** With the Data Center, a player at
    12 extra buddies may have no reason to catch more. Decide whether catching should stay
    worth doing after the cap.

### Missing or thin
31. **No way to rename or reorder the box.** The Data Center holds up to twelve, but the
    list has no sort or search. Fine at 3 to 6; a problem at 12 to 15.
32. **Crooked Hollow is one area.** The Meadow's south end is still a dead end. The Hollow
    needs a reason to come back after the first visit.
33. **PYTHORN (alpha) and MELONKIN (wild)** are in the data, but I did not meet either in
    this run. Confirm they appear, and that PYTHORN's fight can be won at the level shown.
34. **The starters have no evolutions.** WEVO still only has the old trio. A new player
    will reach Lv16 with a starter and nothing happens.
35. **Plot harvest is one picked item per cycle.** Check whether that is too slow once a
    player has four or more plots.

---

## Carried over (still open from earlier notes)

- Item 12, 16, 18 to 22 in PLAYTEST-NOTES.md (narrow path crowding, choosing to battle a weak
  wild, Meadow arrival feel, catch odds, the Lantern's free heal overlapping sleep, kiln and
  bench guidance).
- The v7.0 DESIGN-v7.md open questions (names, evolutions, where the next area goes, which
  other crops compete for plots, whether plots unlock past eight).
- docs/index.html still holds the 4-cartridge build. Update only with Will's go-ahead.

## Priority for the next session (suggested)

1. Items 9, 10, 11, 16: first-screen clarity (counters legend, labels, wild names, sleep hint).
2. Items 13, 14: starter choice and the cottage goal line.
3. Items 17, 18: reveal skip and the throw-vs-battle question (a design call for Will).
4. Items 27 to 30: measure crops, building time, starters and catch odds in a longer session.
