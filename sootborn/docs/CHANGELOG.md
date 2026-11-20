# SOOTBORN — changelog (latest v0.72 · 2026-11-20)

## v0.72 · 2026-11-20 — Part Two's spine: the fourth ring, a cold open, two flash-forwards
Step 7 of the plan. Part Two was nearly all story panels and 3D fights. It now has a place to live in and three things that look ahead.

- **The fourth ring (new 2.5D place, walked three times).** Where Clerk Sorrel lives: a white corridor at night with gilt doors, teal lamps, windows full of sky, and an ochre line painted on the floor for the service to walk on.
  - **Visit one** (The Post; card: THE FOURTH RING / The Sun Spire. Four years and a season after the furnace. Night.). Opens on the plan's line: "Up here nobody looks at anybody. I had to learn that before I learned anything else." A porter who steps off his line for you, a clerk who talks to the lamp, Sable's stall, a door with a new slate (DRAY, K.), Maren Aldane's door, the bell plate, a window, your own door.
  - **Visit two** (The Balancing; five years after). Kestrel Dray is in the ring with her palm flat on the riser, asking you to put a hand on it. A new porter. Tier Four's crates have not come up.
  - **Visit three** (What She Knows; six years after). Colder. The clerk crosses the ring to avoid you, Sable's shutter is down, and a porter kneels before any bell has rung. Inside your door your gloves are laid out palms up. "She sent for me in the morning."
- **NOTICED (the suspicion meter).** Six pips, top right, carried from visit to visit. Every talk gives you a soot answer and a clerk's answer: say "Ta", look a man in the face while he speaks, say "I" and not "one", take a glove off, and it climbs. Keep your eyes front and it falls. Visit one starts at two; visit three starts at four or more. Finish a visit at five or six and there is a slip under your door: NOTED. It cannot be failed.
- **The bell.** After three talks a bell rings. One bell for a clerk (visit one): both porters go down on the paint. Two bells for a House (visit two): the clerks bow from the neck as well, and so should you. Keep walking, look, or say "Get up" (which is not an order that exists).
- **The head rule, here first.** The Accredited keep their eyes front when you walk up; soot turn to you. Kestrel turns her head, and Kael notices that she does. Choosing the clerk's answer turns Kael's own face to the front.
- **Four finds for the Codex:** the painted line, the bell plate, greens off Freight Three, a worn place on a riser.
- **Part Two's cold open.** Before the PART TWO card: NINE YEARS AFTER THE FURNACE / The Sun Spire. The Stair. Sunset. About a minute of the Stair as a comic-book level, with Tavi on your left: one fight on the terrace, one flight up, then two pictures (a white door; somebody standing in front of it; "I knew the way he stood") and a cut to white. Nothing is explained. The real Stair, later, is untouched and keeps its own save.
- **Flash forward: the book.** After the Pinning: NINE YEARS AFTER THE FURNACE / The Count. A book as wide as a table. Ten seconds of one drawn picture, slowly pushed in on: the ledger, a gilt cuff and a pen, and one line in red. "Brennick, K." No words.
- **Flash forward: Tavi at sixteen.** Before The Son, Lucan now says: "She says there is a boy. Below, on your tier. You have a brother." Then NINE YEARS AFTER THE FURNACE / The Sun Spire. The service stair. Tavi, sixteen. Ten seconds: a boy with a bedroll on the service stair, chalking a sun on their wall. Then Kael: "Leave him out of your mouth."
- **The years strip.** Those three cards come in on a strip that runs FURNACE, +1 … +9 with the year lit, the way the Assay cards light a day.
- **Comic pages no longer say TAP** (the standing rule). The arrow alone marks a page that is waiting. All six levels.
- **Dev menu:** the three visits and both flash-forwards under Story beats; the cold open under Levels in 3D.

**Engine:** walk places can keep a meter (`walk.meter`), run a clock of their own (`walk.tick`, which may start a talk), and mark people who do not turn their heads (`acc`); a figure can kneel in the flat engine; `Prelude.plate(name, secs, done)` and a `{ plate }` cutscene step; `{ issue, cold: 1 }` starts a slice of a level; a `years` card transition.

**Checked:** by script. Each visit walked end to end with each answer: the meter went 2 to 4 and 2 to 1 on visit one, 3 to 6 and 3 to 1 on visit two, 4 to 1 and 4 to 6 on visit three; the bell rang and the porters knelt; all four finds reached the Codex. Both drawn stills inside a cutscene: each ended by itself, could be skipped, and the story went on. The cold open from its first card to PART TWO: no opening pages, one wave, the cut at the top of the first flight, the level's own save left empty and the real Stair's flag untouched. Contact sheets of all of it. The whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors. It passed the cold open (logged as a slice), the book, the ring at four years and a season, at five and at six, and Tavi at sixteen, in that order. The bot ends walks and levels as soon as they start, so it proves the hand-offs, not the play.

**Not checked:** nothing by hand. How the ring feels to walk, whether the meter is too easy to empty, whether ten seconds is right for each still, and the cold open's fight were never played by a person. The cold open was driven by teleport, so the walk from the terrace up the flight was not timed: "about a minute" is a guess.


## v0.71 · 2026-11-20 — the Deep Array (a sixth comic-book level)
Step 6 of the plan. The machine the air comes from has been named all through the game and never shown. Now it is.

- **Where it sits:** The Ledger, forty-three days after the furnace, after the Warden goes down under the floor. Dace: "Ten years you've kept that bank turning. You want to see what they're counting?" Card: THE DEEP ARRAY / Forty-three days after the furnace. Under the floor, with Dace.
- **Who you are:** Kael as he is below. Work shirt, his own hair, **a wrench**. No boots, no hook line, no ELEVEN, no Count; the ELEVEN and Count chips are off the screen. Dace, hooded, follows with a lamp.
- **The place:** a hall under all six tiers. A hatch gantry and a stair down the west wall; a long catwalk across the hall; a stair down the east wall; the floor, with the heart of the Array (a rust drum with a weeping seal), the main running out of it bound in rag and tar, and **forty-eight valve banks, thirty-one of them lit**. Four great fans in the wall: one turns, one is trying to, two have stopped. On the south wall, under the Watcher: BANKS LIVE 31 OF 48.
- **How it plays:**
  1. **Hide.** A watch lamp runs up and down a rail over the catwalk. Cross while it is away (there is a bay with crates to stand in) and nobody sees you. Walk into it and two of the Array's watch come for you on the catwalk.
  2. **Look.** Two finds on the floor: nine patches on one pipe, each with a date chalked beside it ("They never mended it. They let us."); and the board, where 31 has been painted over 36.
  3. **The heart.** Put a hand on it. Dace: "Nobody's looking after it. They're counting it. That's what the Count is, Kael."
  4. **Brawl.** The watch, in two waves, with the wrench.
  5. **Run.** The seal goes. Sixty seconds back up to the hatch, steam bursting round you; if the count runs out it costs health and starts again, so it cannot be failed outright.
- **The end:** three pictures at the hatch, with the plan's line: "I had been keeping it alive for ten years, one valve at a time, and nobody had ever let me see it." And Dace: "Now you know what they are counting. Not who breathes. How long."
- If the 3D level cannot start, one paragraph of narration says the same.
- Kept back on purpose: that Seren saw it first. That is Part Two's reveal (plan 15c) and nothing here gives it away.

**Engine:** a level can switch off the hook and ELEVEN (`S.plain`), as the vent stack switches off the boots; a level may have no first fight; a wrench.

**Checked:** by script, end to end, by teleport: the route's ground from the hatch to the heart; the lamp catching him; the catwalk fight; both finds; the heart; the brawl; the run's clock; the hatch; the hand back to the story. Stills of the intro page, the gantry, the lamp, the floor, the heart and the ending. The vent stack re-run after the engine change. The whole-story bot (see below).

**Not checked:** nothing by hand. Slipping past the lamp unseen was not tried by walking (only being caught was). Whether sixty seconds is the right length for the run. The wrench as a weapon in motion.

## v0.70 · 2026-11-20 — the vent stack (a fifth comic-book level), and the Dev menu's versions and way back
Step 5 of the plan, and your note about the Dev menu.

**The vent stack** (the Assay, day thirty-one; in the Ledger's dream, after he takes Voss's boots)
- Card: THE VENT STACK / The Assay. Day thirty-one. The island. A page turns into it and out of it.
- **The place:** House Teal's island in the river, in the storm. One white chimney thirty-six metres high with gilt bands and the Watcher on it, and the keeper's iron stair wound round it: four flights to a turn, three turns, a working platform at the foot of each turn, the crown at the top. Teal's tents and the pump house at its foot.
- **The boots are dead.** No leap and no hover in this level until the top. It is a climb.
- **Three fights on the way:** Teal's pickets at the foot; two more on the first platform; a Warden of the dais on the second, then two pickets.
- **Two things to find:** a keeper's slate tag signed K.D. (Kestrel Dray did the rounds here), and a gilt plate that says the stack is DRAWN FROM RISER NINE.
- **The crown:** stand the boots on the collar. They burn blue. Then walk to the edge: three pictures of the jump, with the plan's line across them ("They had told us the boots were what made a Proctor. They are a battery, and a stack, and a man who isn't afraid of the height.").
- **He flies from here on.** The Valley (day forty) now has the boots. The line that said it took him nineteen days to stop falling is now "the rest of that day".
- Kael wears the white cloak in this level. If the 3D level cannot start, one line of narration covers it.

**The Dev menu** (your note: show what version each scene was last updated, "and the other stuff", and a way back)
- **Every entry ends with the version that last changed its scene** (for example "The Valley · day forty · v0.70"). A ★ marks the ones changed in the current version.
- The top of the menu says the game's version and **what is new in it**.
- **A scene started from the Dev menu comes back to the Dev menu when it ends**, at the list it was picked from, not to the title.
- **To leave a scene early:** a small "◂ Dev menu" button at the top of the screen (only when the scene was started from the Dev menu), the F2 key, or "Back to the Dev menu" in the pause menu. It works from fights, 2D levels, comic-book levels, cutscenes and free play.
- The version tags are kept by hand in one table (`DEV_VER` in `src/ui.js`) and are my best reading of the changelogs; older scenes may be a version or two out.

**Checked**
- The vent stack by script, end to end: the stair's ground is continuous from the foot to the crown (biggest step 0.05); each fight starts where it should; both finds open; the boots are refused before the collar and allowed after; the edge plays the three pictures and hands back to the story. Stills of the intro page, the foot, the stair, a platform, the top and the jump.
- The Dev menu by script: tags on entries; leaving early from a fight, a 2D level, a comic-book level, a cutscene and free play each returned to the right list; a film that ended by itself returned too; Back forgets it.
- The whole-story bot, New Game to THE END (see below).

**Not checked**
- Nothing by hand. The climb was tested by teleporting, not by walking it: how the camera behaves on the turns, and how the fights feel on a platform nine metres square, are unknown.
- The Dev menu button on a phone.

## v0.69 · 2026-11-20 — two new places to walk in Part One (the camp by day; Bay Three at last bell with the seat knives), and Lucan's own look
Step 4 of the plan. Both are 2.5D places (the plan's new ones, approved). Neither has a fight.

**The camp by day** (the Assay, day three; in the first night's dream, after the Pairing)
- Card: MORNING / The Assay. Day three. The camp by daylight. He wakes with his hand on half a loaf, and says the plan's line: "Forty of us in one House, and every one of them was sent by somebody."
- House Violet's camp in daylight: tents, the standard, the Proctors' ranking board (Violet eleventh), a cold fire ring.
- Who is there: **Petra Lune** keeping her column, with one boxed name at the foot of it (Aldane, D.). **Oswin Hale**, whose father finished ninth, trying to split wet wood with a blunt practice blade. **Corin Ashby** counting the lamp oil (twelve flasks; "it is only arithmetic"). **The Sisters Vey**, two cadets in teal come up from the river to read Violet's bar. A cadet who watched the other door and has not seen it open again.
- Two things to look at: **your pack** (Dorian's half loaf, uneaten) and the Proctors' board.
- **One choice: who you sit with** at the cold fire (Oswin, Petra or Corin). It is remembered: on night twenty-eight, at the Circle, that person has one more line.
- The night scene that was already there (fetch wood, raise water, light the fire) follows it, so the fire you light that night is now the one you sat beside cold.

**Bay Three at last bell** (First Fire, forty-two days after; between the Ford and the ceremony)
- Card: LAST BELL / Bay Three. Forty-two days after the furnace.
- Crew Three walks its seat knives back to the board by the furnace doors. Mara calls the numbers; a Warden counts hooks; Ivo and Old Orin each have a line. **Hook 306 is empty.** You hang your own on the next one, 307. The Warden says "Balanced."
- **The seat board is on the wall of Bay Three in free play too**, between Bank Seven and the heart-furnace, and can be read.
- **Seat knives on belts:** Kael, Seren, Mara and Ivo now carry a small hooked knife at the hip in the 2D world below.

**Lucan Aurel, so he cannot be mistaken for Kael** (your note of 2026-11-20: a head and hair of his own, and details in his armour)
- **Hair:** drawn back into a high tail bound with a gilt ring, hanging to his shoulder blades and swinging as he moves; two long locks left at the temples. Kael's is short, gold and spiked.
- **Head:** the crown of points stays; a blue stone at the brow.
- **Armour:** the sun of his House on the breastplate with a blue stone in it, a high gilt collar, a blue tabard with a gilt hem, a fin with a blue stone on each pauldron.
- **Cloak:** gold, lined in dark blue, with a gilt hem. Kael's is plain white. Blue is Lucan's colour now and nobody else in the Assay wears it.
- This is on every Lucan in the arena: the cold open, the Keep, The Son, and the films.

**Where I did not follow the plan, and why**
- **Dorian is not in the camp.** The plan's note said he lived. The written story has him carried out "by the other door", has Kael eating his bread on night forty-nine, puts "Aldane, D." on the wall of names, and makes his sister sell the raid for him. So he is present as his bread and as a boxed name on Petra's slate, not in person. Say if you want him alive and I will change the later scenes to match.
- **Oswin has no bad leg yet.** The written story hurts it on night forty-nine. On day three he has his father.
- **The Sisters Vey are House Teal** (they come for Violet's standard on day twenty-six), so they are visitors at the board, not members of the camp.

**Engine**
- A walk scene can say something as you arrive (`open` on the walk). Two new props for walk scenes: the ranking board (`rank`) and the seat board (`kboard`).
- New test: `walk2.mjs` (any 2.5D place end to end: every person, every spot, the exit and its choice).

**Checked**
- Both places walked by script: the arrival line, every person, every spot, the exit; all three choices at the fire set the flag; a still of each.
- The seat board on the Bay Three map, read in free play; the knife on Kael's belt in a still.
- The whole-story bot, New Game to THE END (see the note at the end of this entry).

**Not checked**
- Nothing by hand.
- The Circle's remembered line was not played on night twenty-eight; it was only written and the flag confirmed.
- The belt knife is two or three pixels: seen on Kael from behind only.
- Lucan was seen in one close still from the side and front quarter, not from behind and not in motion. His 2D walking figure (the Last Night) takes the new colours but was not looked at.

## v0.68 · 2026-11-20 — the new things in the opening: the animated intro, the Keep's ending, the white cloak, the Table at the door
Step 3 of the plan. Four things, all in Part One.

**The animated intro (plan 0a)**
- New Game now opens on eleven drawn pictures that move, counted ONE to ELEVEN, with no words: a hand flat on a pipe, then the same hand in plate closing on a hilt; a chalk sun and the woman drawing it, then the real sun over a valley; her eye through the washer, then the eye in the Authority's gold sun; three cadets' faces; a Proctor writing tally marks; his eyes below, then the same eyes in gold; the blade.
- Each picture is shorter than the one before (3.4 seconds down to 1), about 23 seconds in all. One voice hums the shift song; a heartbeat lands on each number; a tally is kept in the corner.
- It is drawn by code at the screen's real resolution (ink lines, halftone dots), not at the game's 320 pixels, so it is sharp on a PC monitor. It fills a phone held upright by cropping the sides.
- Any button skips it, and so does the Skip button. "Reduce motion" holds each picture still and drops the flashes.
- **The old opening film no longer plays.** The game boots from the two logos straight to the title. The film is still in the Dev menu, marked old.
- The count reaching eleven is the ELEVEN transition at the opening (the first of its three uses).

**The Keep's ending (plan 9d)**
- At the end of Part One the Keep is now fought the whole way through. Lucan cannot be put down by ordinary blows (he stops at a fifth of his health). When he is at half or less your fury fills and the game says HOLD STRIKE; **an ELEVEN begun then breaks his blade** and he goes to his knees. An ELEVEN used earlier only hurts him.
- Two new pictures at the head of the film afterwards: the eleventh coming down on his blade, and Lucan on his knees with Celestine standing behind him. Then the three that were there (the circlet, the sun, the candle-hour).
- Kael's lines in the fight now start with the cold open's line and then: IF I PUT HIM ON HIS KNEES IN FRONT OF HER, SHE WILL HAVE TO PIN THE GOLD ON ME HERSELF.
- The fight stops the moment the blade breaks (THE BLADE BREAKS), with Kael standing over him. He lives.

**The white cloak (plan 8d)**
- From day thirty-one Kael wears Voss's white cloak in place of House Violet's: the last two pictures after the Proctor, the Valley (day forty), the Last Night (his walking figure), the Keep (the cold open too, since it is the same morning) and the Pinning.

**The Table at the door (plan 9)**
- At the end of The Way Out, as Ilse says "One does not keep the table waiting", a page turns onto the Table under its lamp for two seconds and a heartbeat, and a page turns it away. It is the only time the Gilding touches the present.

**Checked**
- The intro from New Game in real time: eleven pictures in order, 23 seconds, the hum playing, a heartbeat on each count, then the Keep's card and the cold open. Skipping at three seconds does the same.
- Stills of all eleven pictures at desktop size, and of six at phone size upright and two on its side.
- The Keep's ending by stepping the fight: an early ELEVEN does not end it; forty heavy blows stop at a fifth; fury fills at 44%; the late ELEVEN breaks the blade; he kneels; the film's five pictures play in order.
- The Table callback: page, the Table, page, then on to the next card.
- The whole-story bot (see the last line of this entry).

**Not checked**
- Nothing by hand. The intro has been seen only as stills: its motion, its pacing against the hum, and how it sounds are unjudged.
- The intro's speed on a real phone.
- Whether Kael and Lucan, both in white cloaks now, are easy to tell apart in the Keep in motion.
- The Keep's ending played by a person from start to finish.

## v0.67 · 2026-11-19 — the rearranging: the Keep opens the game, the Pairing is dreamed, every card in its place, five transitions
From your question (shouldn't the rearranging come first?): yes. This version does everything in the plan that is pure moving and re-carding, and the transitions that sit on the cards. Nothing new was written except three card lines and two film captions.

**What moved**
- **The Keep is the cold open.** New Game goes: the opening film, "FOUR YEARS AFTER THE FURNACE · The Assay. The last day.", and the duel on the keep. Nobody is named (his bar reads "Her son"), there are no memory cut-ins, and one line: THE LAST DAY. HER SON HOLDS THE KEEP. **It cannot be lost. When his health is half gone your fury fills; hold strike for ELEVEN and the picture cuts to black as the blade comes down.** (If you never press it, it goes by itself after nine seconds at full fury.) Then Cinderwell.
- **The Pairing is in the first dream**, after "Three years of that", so the present (Ashgate) now comes straight after the furnace and the title. That night's dream runs in date order: half a year, two years, two and a half, the Assay's first night, night three.
- **The Lamp (night 28) moved to First Fire's night**, after the Standard: fire answers fire. The Ledger's night is now the Dais, the Proctor and On the Ground.
- **The Valley (day 40) moved to the last dream**, before the Last Night and the Keep, with a two-line film in place of the six captions that used to explain the whole game. It can be skipped now that it is not the first fight.
- **The Pinning opens Part Two**, after the PART TWO card.
- **"One candle-hour. It burned for three."** now closes the festival before the night's dream, not after it.

**Cards**
- ASHGATE is a chapter card ("Forty-one days after the furnace. Kael still fixes valves."). FIRST FIRE has one too, on waking.
- The Table: HALF A YEAR AFTER THE FURNACE. The Camp: NIGHT THREE. The Island: night twenty-five. The Lamp: NIGHT TWENTY-EIGHT. The Last Night: NIGHT FORTY-NINE. The Ford's card is a date like the rest.
- The festival's second LAST BELL card is THE FIRST FIRE. The second THE LEDGER card ("the day ends") is gone: he wakes under the floor. The second THE HIGH DOCKS card is gone. Brand's fight is ELEVEN MINUTES. Tier Six is dated (eight years after), not MEANWHILE; Tavi's Sun is MEANWHILE.
- The Assay calendar strip has nine beats now (night 25 added, the Pinning taken off).

**Transitions** (how a card arrives; one look per kind of jump)
- **Wake** (white fading out): Ashgate, First Fire, The Ledger, under the floor, The Way Out.
- **Furnace** (an orange bloom from below): eleven months before the furnace.
- **Strip** (a gold wash, the calendar sliding in): every jump to the Assay. Inside the Assay the lit day pulses.
- **Chalk** (a chalk sun): Tavi's Sun, Tier Six.
- **Page** (a page sweeping across): into the Table and the three levels.
- Not built yet: the count to eleven as a transition (it comes with the animated intro), the grey furnace and the strip that runs on into years (they come with the scenes that use them).

**Your bug: an ELEVEN before you know what it is**
- At the furnace, if he runs for her, the fight with the Warden could reach full fury and do ELEVEN before the count had been shown. That fight can no longer do it.
- The cold open still ends on ELEVEN on purpose (the plan you approved), after the opening film has counted the eleven seconds. Say if that is the one you meant and you want it changed.

**Checked**
- New Game by real key presses: the Keep starts, six heavy blows leave him on one health and still fighting, ELEVEN cuts it, and BEFORE THE FURNACE follows.
- The whole-story bot played New Game to THE END with no errors. Its log of every card, fight and level matches the plan's order line for line for everything that exists so far.
- Each transition caught in two pictures; every title fits; the strip lights the right day.

**Not checked**
- By hand, any of it. How the cold open feels as the first minute of the game; whether nine seconds is the right wait.
- Whether any spoken line still assumes the old order (I changed the one in the first dream; I did not read every line).
- The transitions were seen as stills, not moving, and not heard.

## v0.66 · 2026-11-19 — the four bugs from your play: the fire pit, weight, deaths, the hook
Step 1 of the approved plan (the handoff, Part F). No story or card changes.

**1. The fire pit stays where it is**
- The Circle on night 28 no longer closes for the naming and opens somewhere else for the fight. You walk the Circle, say the name at the fire, and it all happens there: the naming, the choice, **the fight with Corin on the same ground, round the same fire, with the same forty people standing in the ring**, and what is said afterwards (keep him, or turn him out). The 2.5D scene ends only when the night does.
- The fire is solid in the fight: you and he go round it, not through it. If you lose, you start again in the same place.
- **The wrong name still leaves the fire.** The lines say so ("up on the ridge in the dark, where nobody saw"), so that fight is on the ridge, and the game now cuts straight from the Circle to it without dropping back to the top-down camp first.

**2. Weight**
- **A man cannot be kept in the air from the ground any more.** A heavy blow still lifts him once. After that, a blow on a falling man knocks him down faster instead of lifting him, and a second heavy blow drives him into the ground.
- Men fall faster than they rise, a hard landing gives one short bounce and a shake, and then he is on the floor.
- **Air combos need the boots**, and even in the boots each blow lifts him less, so he comes down after about a second and a third.
- Without the boots Kael no longer hangs in the air while striking, and comes down harder from a jump. The hook from the air hauls a man up only in the boots.
- Measured with a bot that launches a man and then lands a light blow every tenth of a second for three seconds (the Drill, the Ford and the Keep, all the same): **before, he never landed in three seconds and reached a height of 316; now he lands in 0.2 seconds from a height of 18.** In the boots: 1.35 seconds, height 40.

**3. Deaths are falls**
- Nobody spins. An ordinary blow: **to his knees, then over**, forward or back. A heavy blow: **off his feet and onto his back**, once. A man killed in the air comes down. In the arena the figures have a kneeling pose and a lying pose for it; in 2D the turning in the air is gone.
- Before, every death in the arena threw the body up (height 34, two thirds of a second in the air) turning as it went; now a heavy blow lifts him 5.
- The comic-book levels already had the kneel-and-fall from v0.50; they are unchanged.

**4. The hook shot in the arena fights**
- The hook was there but did not read: twelve dots for an eighth of a second, and up close the same button did the shoulder charge instead. Now it is **a line with a head on it that goes out, bites with a flash and a jolt, and stays taut while the pull lasts.**
- **An ordinary man comes off his feet and lands in front of you, reeling. A man too heavy to move (a captain, a Proctor, Lucan) stays where he is and the line takes you to him, inside his guard**, with an opening for your first blow.
- The charge now needs you nearer (34, was 46), so the hook is what the button does at any real distance. Kael's blade shows its hook from the Assay on (it used to appear only in Part Two).

**Also**
- **PC is the main platform** (your note). Written into the handoff and the open list: keyboard and a controller on a computer come first; the phone is the second screen.

**Checked**
- The fire pit: a script walks to the fire, says each of the three names, fights, loses once on purpose, wins, and reads the aftermath. With the right name the 2.5D scene was on screen for every frame until the night ended.
- Weight: the air-time bot above, old build against new.
- Deaths: stills at four moments of a death, light and heavy blow, in the arena (the Ford) and in 2D (the Drill), old build against new.
- The hook: used on purpose in the Ford, the Proctor, the Valley and the Keep, with stills of line out, bite and arrival.
- The whole-story bot played New Game to THE END with no errors, and the order of every card, fight and level is the same as v0.65. (The bot skips fights and levels, so it does not test the four changes; the scripts above do.) A mashing bot still wins the Drill.

**Not checked**
- **How any of it feels in the hand.** The weight numbers come from a bot; whether the fights are now too stiff, or the heavy launch too low, is yours to say.
- The deaths and the hook were looked at as stills, not in motion.
- Nothing was tried on a phone or with a controller.
- The difficulty of fights was not re-measured. Juggling was a way of winning; without it some fights may be harder.

---
Older entries: v0.56 to v0.65 are in "sootborn changelog archive 2" (`docs/CHANGELOG_ARCHIVE_2.md`); v0.1 to v0.55 in "sootborn changelog archive" (`docs/CHANGELOG_ARCHIVE.md`).
