# SOOTBORN — changelog (latest v0.82 · 2026-11-20)

## v0.82 · 2026-11-20 — a picture in front of the Pairing and the Ford
Step 14 (films): the two Assay fights that started cold now open on a drawn picture, seven seconds each, any button passes it.

- **The Pairing:** the gallery's lamps and three heads keeping score, then down to the floor of the sealed room: two short blades laid apart, the door they came in by, the other door standing dark, and half a loaf on a lift ticket.
- **The Ford:** dusk over the river; eleven stones light one after another from your boots on the near bank to the far one, where Captain Vant waits under House Teal's standard with his point down.

**Checked:** a still of each (the end of the move, not the whole move); the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Not checked:** nothing by hand. Neither picture was seen moving. The start of the Pairing's picture (the gallery) was not looked at, only its end.


## v0.81 · 2026-11-20 — the High Docks: three things to find for the Codex
A small part of Step 12. **The High Docks was not rebuilt.** I looked at it first: it was already rebuilt once (every surface, v0.5x), and "from reference" needs a reference I do not have and eyes I cannot use on a whole level. So this adds the one thing on that line that could be done and checked: hidden things for the Codex.

- **Three finds on the High Docks, off the path, that go into the main Codex:**
  - **The pencil column** (the tally booth on the quay): ink for every sled, and beside it, in Sable's hand, what went back down the stair.
  - **Names under a bench** (the watch shelter): four names cut with a seat knife; one is BRAND.
  - **The signal book** (a line locker on the signal roof): no page for a barge that does not answer.
- **A comic-book level can now add to the Codex** (it could not before; its finds stayed inside the level).

**Checked:** a bot walked with the stick from the dock stair to the booth and the shelter, pressed interact at each, and both were in the Codex afterwards. The whole-story bot (see below).

**Not checked:** nothing by hand. The third find, on the signal roof, was placed by the roof's numbers and not walked to. Not done from the High Docks line: side corridors that go nowhere, more height for the boots, a new look.


## v0.80 · 2026-11-20 — the Scuffle's own ground; a picture for losing below
One thing each from Step 12 (places) and Step 14 (films).

- **The Scuffle is fought on Row K's ground** now: packed ash, a duckboard walk along the front, and Garrow's ring drawn in chalk with three tally strokes. It was the square's flagstones.
- **Losing a fight below has a drawn picture:** Kael on the flagstones seen from above, and a hand coming down for him. Five seconds, any button passes it, and it shows once per fight, not on every loss. It is for the fights below the rock that send you back (the Scuffle, Thorne, the Drill and the like), not the ones that start again by themselves.

**Checked:** a still of each; a loss shows the picture and then ends the fight as lost; a second loss of the same fight does not show it again; the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Not checked:** nothing by hand. The hand in the losing picture was moved after its last still and not looked at again.


## v0.79 · 2026-11-20 — one set of buttons everywhere; two things drawn that were only told
The start of Step 13 (controls) and the rest of Step 10 that could be done.

- **The comic-book levels now use the arena fights' buttons.** Before, the kick, the hook and the lunge sat on different buttons in the levels than in the fights.
  - **Controller:** X strike, Y kick, A jump, B dodge, LB hook, as in the fights. RB (the guard, which the levels do not have) is the lunge. Before, in the levels, Y was the hook, RB the kick and LB the lunge. **If you have played the levels on a pad, three buttons have moved.**
  - **Keyboard:** E strike, C kick, F jump, X dodge, Q hook, V lunge.
  - **Touch:** the on-screen buttons are relabelled to match, and the pad legend in the levels is corrected.
- **A Controls card in the menu** (it was folded into About): one table, every action, with its key, its controller button and its touch button, true for all three kinds of play.
- **Lucan on his stick, drawn** (if you did not befriend him): seven seconds at the white door before he speaks.
- **Hollis grounding Brand's halberd, drawn**, at the top of the Stair.
- **Not done from Step 10, and why:** "Ivo's errand below" has nothing written about it anywhere, so I have not invented one; say what it is. The hand to the washer is still only in the arena fights.

**Checked:** a still of the card and of both pictures; the builds' key maps read back; the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Not checked:** nothing by hand. **The new button layout in the levels was not played**, on a pad or on keys; it is three lines of mapping, read and not felt.


## v0.78 · 2026-11-20 — a playthrough check: every 2.5D place walked on foot; one dead end fixed
Your aim for today: play it start to finish, in order, with every played moment finished. Every scene in the plan is built (v0.67 to v0.75), so this version looks for places a person would get stuck that the story bot cannot see, because the bot ends walks and fights as they start.

- **Fixed: the fever ward could not be left on foot.** Its way out, the ward board, sat past the edge of the floor with Mosi standing in front of it. Since v0.61 the only way out was the Skip button. Mosi has moved to a cot and the board can be reached.
- **New test: every 2.5D place walked with real key presses** (fourteen of them: the Circle, Ashgate Square, Row K, the ward, the camp by day, last bell, the three ring visits, the cloak, the service stair, the barge, Seren's bay). In each, the bot walks to every person and every thing and then the way out. All fourteen now end by walking.

**Checked:** the walk test above; the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Added after release (same build, no new version):**
- **The three newest comic-book levels walked with the stick**, not teleported: a bot pushes the stick toward each point of the route and presses the interact button where a person would. The cold open: terrace to the top of the first flight, 23 seconds, ended by itself. The vent stack: foot to crown (height 0 to 36), the collar, the edge, 109 seconds. The Deep Array: hatch, catwalk (waiting for the lamp), floor, the heart, and the run back up to the hatch, 118 seconds. None got stuck. The bot clears each fight as it starts.
- **The Count puzzle at a person's speed:** the same bot slowed to one key press every 0.4 seconds solved it in 40 seconds without being noted.

- **Every fight played with real keys by a simple bot** (walk at the nearest man, strike, kick now and then, dodge now and then, hold strike when the fury is full; three tries each; about four minutes of clock). It is a poor player and the test machine runs the 3D fights slowly. **Won outright:** the Drill (both), the three Scuffles, Thorne, Under the Floor, the Way Out, Tier Six Stands, Voss in 2D, the Ford (2D and 3D), the Pairing, the Valley (both), the Twins, the Fall, the Proctor, the Gallery, Riser Nine, and the cold open. **Reached the win as the clock ran out:** the Keep, the Keep's ending (it held strike and broke the blade), the Son. **Still fighting when the clock ran out, alive, with the enemy hurt:** the Pinning, Little Ember, the High Docks, the Stair (these two are long wave fights), the pump room (training, which does not end). **Lost by design:** the furnace, the Dock Stair. No fight stopped, froze or refused to end.

**Not checked:** nothing by hand. Whether the fights are fun or fair for a person: the bot only shows that none is broken.


## v0.77 · 2026-11-20 — the Gallery's onlookers; how each boss stands (Step 11, second part)
- **The Gallery has people watching.** The figures between its columns were the Assay's Proctors, borrowed from the pairing room. They are now clerks and ladies of the fourth ring, in four different coats and heads, standing with their hands folded.
- **Each of the three bosses in the comic-book levels stands his own way when he is not moving.** Rook: upright, the gaff grounded like a staff, one hand behind his back, looking slowly along the dock. The Warden-captain at Riser Nine: low and square with the halberd across him, breathing. The Auditor's Blade: both points down and the weight off the bad leg.
- **Looked at and left:** the three bosses already had faces, hats and weapons of their own (Rook's cap and gaff; the captain's barred helm and halberd; the Blade's half mask and two blades).

**Checked:** a still of the Gallery; the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Not checked:** nothing by hand. **The bosses' new stances were not seen at all.** I could not hold a boss still in front of the camera by script (they are either walking, striking or recovering), so the three poses are written from the engine's numbers and unseen. Look at them first; say if any limb is wrong and I will fix or remove it. Not started: Kael's ready stance in held shots; capes in motion.


## v0.76 · 2026-11-20 — the Keep's dais and the Spire Guards (Step 11, first part)
What could be done on characters without the animation library.

- **Celestine and her two Wardens on the Keep's dais are drawn in detail now**, flat, the way the Proctors are. They were three grey blocks. She stands crowned in white with her gloved hands folded; the Wardens wear grey plate, a red tabard and crest, a barred helm, and hold their halberds on the outside. They are in the cold open, the Keep, and the Pinning.
- **The Spire Guards' helm is a helmet:** a gilt brow, a nasal bar, cheek plates and a neck guard, in place of a box with a slit. Seen at the Stair and Riser Nine (the arena versions).
- **Looked at and left alone:** the guards in the comic-book levels already have their helms, crests and visors from v0.60.

**Checked:** stills of the dais and of the guards up close; the whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors.

**Not checked:** nothing by hand. The dais figures were seen from the fight's usual distance only. Not started from Step 11: the bosses' own faces, weapons and idle; Kael's ready stance; capes in motion; the crowd in other 3D rooms; and real animation, which waits for the library.


## v0.75 · 2026-11-20 — matching the writing: the coat, the gloves, the leg, the small things people do
Step 10 of the plan. Things the story says that the pictures did not show.

- **Clerk Sorrel wears a clerk's coat, and gloves.** On the fourth ring, on the service stair and in the Count hall he is a robed clerk now, not a cadet in plate. At the High Docks (the comic-book level) the plate, the pauldrons and House Violet's cape are gone: a pale coat and dark gloves. He keeps the plate where he fights in the open (the Gallery, the Son, the Stair, Little Ember).
- **The Auditor's Blade walks on a leg that does not bend** (the Stair). It is Oswin Hale's leg from night forty-nine.
- **A palm flat on the pipe.** Kestrel on the fourth ring and the valve hand on the service stair stand with a hand laid on the pipe beside them. Kestrel no longer turns away from it when you walk up.
- **The hand to the washer before ELEVEN** in the arena fights: as the count begins, his off hand goes to his collar.
- **The row sways together at a commitment** (Tier Six Stands), in time, instead of each figure bobbing by itself.
- **Hollis and Brand, one line each** (after Riser Nine): "You're the one that did my arm." / "I am. It set crooked. I have looked at it every day since. Take the hand or leave it." He takes the hand.
- **The week he blamed her has a picture of its own:** the dock log under a lamp, with one pass ringed in red. Dray, K. (Only if you met her at the pump house.)
- Already true, checked and left: Tavi walks on his left on the Stair; Lucan is "on his stick" at the door in the words.

**Checked:** by script and stills: the coat in the ring and on the service stair; Kestrel's palm; the dock log picture; the docks figure with no plate and no cape; the limp's numbers for the Blade and for nobody else. The whole-story bot (see below).

**The whole-story bot:** new game to THE END, no errors, the same order as v0.74.

**Not checked:** nothing by hand. The Blade's leg was not seen moving (only its numbers). The hand to the washer is behind the ELEVEN cut-in for most of its length and was seen only as a small figure. The sway was not seen moving. The 3D clerk's coat is the same body with the plate left off, not a new model.


## v0.74 · 2026-11-20 — the Count, the last flash, the ending
Step 9 of the plan. The last chapter is now something you do.

- **The Count, as a puzzle (new).** After the chapter card: THE BOOK / Nine years after the furnace. The Count. One page: the Spire and the six tiers, the days of air each is sent, and what each is owed (eight). Tier Four is struck through, BALANCED, with nothing. **Carry days down the page until every line breathes.** Lift up to four from one line and set them down on another; the total never changes.
  - **The eye** reads down the margin, one line at a time. Lift or set down on the line it is reading and you are NOTED and the days go back. A line that has moved by more than four since the eye last read it is NOTED too. It cannot be failed; the count of times noted is kept.
  - When every line is at eight, **one red line is left: "Brennick, K. Tier Six. Owed: nine years."** Hold to write it in black. Then his line: "I have counted eleven seconds every day for nine years."
  - Keys, a pad, a mouse or a finger on the line all work. The Skip button passes it.
- **The Stair, from the inside.** At the top of the first flight, where the cold open cut away, the level now says so. After it, Hollis carries Brand's halberd up the last flight and grounds it at the top.
- **One for forty.** Before Little Ember, Celestine's lines from the plan: "One for forty. I did that sum at twenty, with two cadets who did not wake. I have done it every day since. She did it too, little ember, when she said it was her. She only did it the other way round." And: "They called me that too, before they gave me this name."
- **The last flash.** On the last blow: LAST BELL / Bay Three. The heart-furnace, coming in on a count of eleven strokes. One drawn picture of the furnace: somebody small walks in, the doors close over fourteen seconds, and the count runs ONE to ELEVEN with a heartbeat on each, and holds. It goes out to white. It cannot be cut short with a button (the Skip button still works).
- **The ending is six pictures you turn** (the plan: played as drawn pictures, not told): Lift Zero running with its doors open; Ashgate Square looking up; the chalk sun in the old tunnel; the new Count, a list of names; a yellow barge; the shelf on Row K with two tins. **Every line that was there before is still there**, read under its picture, a press at a time. The last picture shows who is at Mara's table: a woman in a grey ration coat, or a closed book with one red line.
- **Mara's beat** (the Row K ending): "Eat it while it's hot, little ember. Nobody's counting your bowl." She calls every new mouth on the row that, and had never seen the woman before the furnace.
- **Tavi:** the two lines I added in v0.72 said "boy" and "brother". The written Part Two calls Tavi "her" twice and the Codex says "sibling", so those lines now say neither ("She says there is a child. Below, on your tier.") until you say which it is.
- **Dev menu:** the puzzle, the last flash, and the ending pictures for each ending (short captions) under Story beats.

**Engine:** the drawn-picture module can now run a game on a page (`Prelude.ledger`), turn captioned pictures (`Prelude.pages`), count on a still, and take a press from a mouse or finger; cutscene steps `{ ledger }`, `{ pages }`, and `count`, `white`, `hold` on `{ plate }`; an `eleven` card transition.

**Checked:** by script. The puzzle played with real key presses by a bot that reads the page: noted once on purpose, then solved in 37 seconds with no more notes, signed, and handed back to the story. The end of the last chapter from the last blow, once for each ending: the count reached eleven and a button did not cut it; the choice set the ending; six pictures; Mara's beat only when she is sent down, the struck line only when she is struck; both THE END texts shown. Stills of the puzzle, the flash and all six pictures.

**The whole-story bot:** new game to THE END, no errors. It reached the book (and skipped the puzzle, as it skips fights), the last flash, and the ending's six pictures with her line struck. The other ending was reached by the script above.

**Not checked:** nothing by hand. Whether the puzzle is fun, too easy, or too slow for a person (the bot is not a person). The puzzle with a mouse or a finger was not tried, only with keys. The ending's pictures were seen as stills. The Stair's new line was not seen in the level.


## v0.73 · 2026-11-20 — Part Two's flashes and new places: the cloak, the service stair, Celestine's own Assay, the barge, Seren and the line
Step 8 of the plan. Five things to play in Part Two, each set off by something that happens in front of it.

- **The cloak (new 2.5D flash; The Post).** Set off by the porter on the fourth ring stepping off his line for you. Card: FOUR YEARS AFTER THE FURNACE / The Assay. Day thirty-one, after dark. You come down the ridge into the camp in the Proctor's white cloak. **As you pass them, cadets get up and fall in behind you**, Violet and Teal both; the count is at the top of the screen. Petra, Oswin and a Teal cadet each have a line. At the far end you break the white ribbon on the cache (the one the story already said he broke that night). Ends on the plan's line: "They did not follow me because I won. They followed me because I came back."
- **The service stair (new 2.5D place; The Post).** After he learns where the kitchens keep their surplus. Card: THE SERVICE STAIR / The Sun Spire. The painted line. Dark stone behind a door no clerk uses, a line painted across the floor, the Spire's own valve bank, and three people from Tier Six working it: a valve hand at a seized wheel (help him, or keep your hands behind your back), a woman with plates who calls you "love", and a lamp trimmer who trimmed the lamps over Bank Seven. Whichever you choose, the valve hand says it, very quietly: "Brennick." Ends on the plan's line about the two sides of the paint. One find for the Codex.
- **Celestine's own Assay (new 2D flash, played as her; What She Knows).** Set off in her room: the seat he came to mend is still weeping, and she takes off one glove and closes it herself, palm flat on the pipe first. Card: FIFTY YEARS BEFORE THE FURNACE / An Assay. A cadet called Celestine Aurel, twenty, coming in on **a furnace bloom cooled to grey**. The island at night in grey; three Proctors walk the rounds with lamps; reach the pump house unseen and hold to shut the wheel. Her line at the wheel is the plan's. The other House's lamps go out one after another; at first light thirty-eight come up with their hands open and two do not wake; a Proctor: "Genius." She says nothing. Back in her room: "Whoever will turn the valve runs everything. I have run the Count that way for fifty years."
- **Gloves on Celestine everywhere:** her walking figure, the cadet she was, and the 3D figure in Little Ember.
- **A barge, in the weather (new 2.5D place; Two Years).** Card: EIGHT YEARS AFTER THE FURNACE / A barge, in the weather. A wet deck in cloud and rain, with the hooded lamps of other hulls riding in the dark. Ilse (who asks him something, which she never does), Hollis the welder, Bao at the wheel, Sable with a cold crate; Brand's halberd lashed to the rail, butt down. A seal is weeping. You put your hand on it.
- **Seren finds the line (new 2.5D flash, played as her; Two Years).** Set off by his hand going flat on the pipe. Card: THREE WEEKS BEFORE THE FURNACE / Bay Three. Seren, alone, after last bell, on the furnace bloom. Four steps in order: a hand on Bank Seven; the line under the grating to a capped tee; ask Old Orin where it goes ("They don't strike a line for that. They strike a crew."); back to the tee, and leave it shut. Her line is the plan's: "Somebody will have to answer for it. Let it be somebody who knew." Afterwards Kael: "She was not curious. She was choosing."
- **Flashes where you play somebody else are told from outside** ("She takes one glove off"), so they do not sound like Kael.
- **Her age now adds up:** twenty at fifty years before the furnace makes her seventy-six in her room (the line said seventy) and seventy-nine at the last fight (it said seventy-three).
- **Dev menu:** the four walked ones under Story beats; Celestine's Assay under Levels in 2D.

**Engine:** people can follow you in a walk place (the camp column); an exit that only opens when its `exit()` says so; a mission can be greyed (`grey`) and name its own place (`where`); an `ash` card transition; `gloves` on a look; new props (service wall bays, a valve bank, a barge rail, a deck pipe, crates).

**Checked:** by script. The cloak walked with real key presses (cadets joined as he passed; everybody is behind him at the cache). The service stair, the barge and Seren's scene walked end to end: every person, every spot, both answers at the wheel, the tee refused until she has asked Orin. Celestine's Assay: seen by a Proctor once and put back, then the wheel, the lamps out, the hand back to the story, the grey gone and the island's own lamps restored for night twenty-five. Stills of all five, and of the gloves.

**The whole-story bot:** new game to THE END, no errors. In order it passed: the ring, the card for day thirty-one, the cloak, the service stair, the ring at five years, the ring at six, the card for fifty years before and her Assay, Tavi at sixteen, the barge, the card for three weeks before and Seren's bay. (Her two ages were corrected after that run started; the build was checked again for errors, not replayed.)

**Not checked:** nothing by hand. Slipping past the Proctors on foot was not tried (their rounds are the pickets' rounds from night twenty-five, which were). Celestine's gloves are one or two pixels on the small figures and were only judged on the 3D one; the hand-painted story panels she appears in were not looked at. The cadets' column was seen at three moments, not in motion.


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

---
Older entries: v0.66 to v0.70 are in "sootborn changelog archive 3" (`docs/CHANGELOG_ARCHIVE_3.md`); v0.56 to v0.65 in "sootborn changelog archive 2" (`docs/CHANGELOG_ARCHIVE_2.md`); v0.1 to v0.55 in "sootborn changelog archive" (`docs/CHANGELOG_ARCHIVE.md`).
