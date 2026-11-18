# Starhaven — Changelog

## v0.1.8 — the Deep goes down, lamps to light, the Ring's bow (Nov 18, 2026)
Will: the Deep could go down and be explored like a dungeon, with verticality; the rooftop jump has been weird since
the first build; do everything on the not-done list; at the training rings a bow went into the targets but there is
no bow to use; the first chapter is thin and wants something fun, not more cutscenes.

- **The Deep goes down.** It is two storeys now. The trial road is a shelf of rock; under it is a long hall of
  cells. Falling into a gap no longer hurts and resets you: you land in the cells. Down there: cages, three thorn
  sprites, Starlight, a lantern, and two things to find that each write a journal page (a mortal hunter's pack, and a
  tally scratched in the wall with a warning). Four ledges in the shaft under the long jump lead back up to the road.
  The Queen and Caelum both have something to say when you land.
- **The Deep's lanterns are visible.** They were being placed on the roof, out of sight, since the roof was added.
- **The bow in Bram's Ring.** His three rings are dagger targets, but a hit drew an arrow stuck in them and Wren
  talked about her bow, so it looked like she should have one. A cut ring now shows a clean cut and says "CLEAN CUT",
  the hint says the rings are for daggers, and the lines say plainly that she left the bow beyond the Wall and Bram
  will string her a fae one when she has earned it.
- **The rooftop climb in Ashes.** It was one ledge flush against the house wall, so you jumped straight up a wall.
  It is now three steps: crates, a balcony, then the eave level with the roof. Single jumps; no double jump needed.
- **Something to do in Ashes: light the street.** Four street lamps on balconies above the street are dark. Climb to
  each and touch it. The street brightens with every one, and the fourth brings old Mirelle (who was a lamplighter
  for forty years) out to speak. It is remembered, writes a journal page, and ties to the First Lamp in the square.
- **Iris's vision repainted:** the sisters at the cottage door on the near shore, an iron keep across the sea with
  black ships already on the water, two threads gone red and tight, and an iron hand closing over it.

Not done:
- Wren has no bow after the prologue. That is the story as written (Chapter 4 is where she learns a fae bow), but
  you expected one in the Ring. I can give her one now if you want it; it needs a button.
- The Deep's chase section is still a straight run, on purpose: you said you liked it.
- No scene in a different art style yet.

Tests: feel 59/59, menus 19/19, smoke and a 6,000-frame random-input run with no errors. A test bot falls into the
cells, finds both things, fights the sprites and climbs out; another climbs the new rooftop steps with single jumps.
Not yet played by hand or on a phone.

## v0.1.7 — Wren moves smoothly (Nov 18, 2026)
Will: the main character looks really bad when she moves; it looks choppy.

Three causes found in her drawing code, all fixed:

- **She no longer snaps between poses.** Standing, running, jumping, falling, striking and dashing used to switch
  in a single frame. Each pose now eases into the next.
- **She no longer ticks from side to side.** She and the camera were each rounded to whole pixels separately, so
  while running she jittered a pixel back and forth against the screen. She is now drawn exactly where she is.
- **She no longer blinks out after a hit.** For the safe time after a hit she vanished every few frames (and that
  time got longer in v0.1.5, so it got worse). She now shimmers and stays visible.
- **A real walk and run.** Stride, lean, arm swing and cloak scale with her speed; knees fold as a leg comes forward
  and straighten to meet the ground.
- **One continuous jump.** Rising, the top and falling were three fixed poses switched at set speeds. They are now one
  arc that follows how fast she is moving up or down.
- Standing still, she breathes and her cloak moves.

Tests: feel 58/58, menus 19/19, smoke and a 6,000-frame random-input run with no errors. Run and jump checked frame
by frame in screenshots; smoothness in motion is not something a screenshot shows. Not yet played by hand or on a
phone.

## v0.1.6 — the square in depth, people in the Deep, the ride to the Wall (Nov 18, 2026)
Will: there is stiffness in certain characters and areas; the place where you pick who to stay with needs to look
2D in a 3D space, with lore; do the not-done list; deepen the Queen's section and add things between beats; the
story scenes have to look good; art styles can mix.

- **The Lamp Square is a place now.** The evening where you choose who to spend time with is redrawn as a flat
  square seen in depth: the ground runs away to lit house fronts, houses come down each side, lantern strings cross
  overhead, and everyone is drawn larger the nearer they stand. Townsfolk walk through it. You look through an arch.
- **Three things to look at in the square**, each with Wren's words and its own journal page: the First Lamp, the
  Stone of Names, the Star Well. Looking is optional; you can still walk straight to someone.
- **The Deep has people in it.** Caelum stands in the dark near the first lantern, and Rowan is in a cage of woven
  thorn before the thorns. Both can be spoken to, both have a choice (Caelum's moves his bond; Rowan's is remembered
  and writes a journal page), and both foreshadow how the Queen keeps her word. Neither is required.
- **The first fight is in the Deep.** Two of the Queen's thorn sprites wait past the thorns, before the chase, so
  Wren has cut something before Bram's Ring. The Ring then teaches the harder moves instead of the first swing.
- **A second scene like the flight: the ride to the Wall.** After the stag, Wren rides behind Rowan on a white mare,
  into the screen, through winter pines toward a curtain of light. About 28 seconds. Steer round the pines, gather
  wisps. Rowan explains the Wall, the old war and the seven courts on the way, where a block of narration used to be.
- **The flight has speed streaks**, and its caption boxes (and the square's) now grow to fit their words.
- **Characters are less stiff.** Everyone drawn as a sprite breathes, sways a little, shifts their weight now and
  then, and moves their mouth and nods while their line is being typed.

Not done:
- The Deep is richer but not longer: I added people and a fight inside the existing layout rather than new rooms.
- Ashes (Chapter 1) is unchanged: still a walk, a mural and one errand. It is the thinnest chapter now.
- Iris's vision scene is still the old plain one.
- Moving the whole combat tutorial under the Queen: I moved the first swing only. Bram still teaches combo, rising
  strike, dash strike and guard, because by then Wren is fae and the story has a reason for her to be trained.
- The bow bug from the start of the game is still not found.

Tests: feel 58/58 (two runs), menus 19/19, smoke and a 6,000-frame random-input run with no errors. The square, the
ride and the cage checked in screenshots. Not yet played by hand or on a phone.

## v0.1.5 — guard, lessons for every move, sunken thorns, a victory (Nov 18, 2026)
Will, after playing v0.1.4: needs an up hit, a dash hit and a block; italic text is hard to read; scenes that are
nothing and blobs; thorns should be recessed; more time after a hit; a success sequence after the wyrm.

- **Guard and parry (new).** Hold down on the ground (the down-arrow button on touch) and Wren crosses her blades.
  A blow from the front stops. Raise the guard at the last moment and it is a parry: the enemy is left open and her
  next cut bites deeper. She cannot guard a fall or a blow from behind, and a plain block drops her guard for a moment.
- **Up strike has its own button.** A new up-arrow button on touch (up and strike on keys or a controller). From the
  ground it is the rising strike; in the air it is now a cut straight up.
- **Bram teaches every move, one at a time.** The up strike and dash strike already existed but were one line in a
  hint, and you never found them. The Ring now has four short lessons on the dummy: three-cut combo, rising strike,
  dash strike, guard. The goal line and the hint name the move and the button each time, and "Wren's blades" is added
  to How it works.
- **Thorns are sunk into the floor.** In the Deep and in Bram's pit they sit in a recess, so you can stand at the
  edge and cannot walk into them by accident. You are only hurt by going in.
- **Longer safety after a hit:** about 1.9 seconds, up from 1.2 (and longer after a fall or thorns).
- **Beating the Old Wyrm is a moment now.** Five seconds before the story moves: time slows, its light pours into
  Wren, her hearts fill, the words "THE HOLLOW IS QUIET", a word from Caelum, 40 experience, then a fade.
- **Narration is easier to read.** It was italic; it is upright, a little larger, and types faster than speech.
  Whispers and film captions are upright too.
- **Four story scenes repainted** in the layered style with the real cast: the Spring Court garden, the Blight and
  the Thorn Queen, the cell in the Deep, and the Queen's throne. They were flat shapes and stick figures.

Not done or not found:
- The bow bug before the jump lesson: I could not make it happen. The bow fired at every spot I tried in the Winter
  Woods, by key and by the real SHOOT button, sideways and upright. I need to know what you pressed and what was on
  screen (a conversation, a hint, the sisters nearby).
- Not done this round: longer levels and slower story beats in the Deep and Ashes, work on the flying scene, and
  more flying-style scenes for exposition.
- The Iris vision scene is still plain.

Tests: feel 55/55 (two runs), menus 19/19, smoke and an 8,000-frame random-input run with no errors. New scenes,
the guard, the pit and the victory checked in screenshots. Not yet played by hand or on a phone.

## v0.1.4 — what the bonds are for, and a journal that fills (Nov 18, 2026)
Will, after talking with Aaron: the game tracks relationships, but it is not clear what we are working toward or what
effect they have; maybe the journal fills with more lore and things to read as we do more.

- **Every heart now gives something you can feel, and the journal says what.** At heart 2: Caelum fills the Bond Art
  bar a quarter faster; Bram's shield takes the first blow in each place; Iris draws Starlight in from much further
  away; Thane gives a fifth more experience. At Caelum's heart 3, the Bond Art bar fills at once when Wren is down to
  her last heart (once in each place). Before, every bond perk said "later chapters" and did nothing.
- **Each bond shows where it is heading.** The journal's Bonds tab lists, for each person, the thing the bond is
  building toward and a ladder of hearts 2 to 5: earned ones in green and marked "Active now", the next one flagged,
  the rest marked as chapters to come.
- **Earning a heart tells you what you got**, in a line on screen: the name of the boon and what it does.
- **The journal fills with pages as you play.** 40 pages of lore in Wren's voice, in five parts: the mortal lands,
  the courts, the war, people, and things she chose. Pages are written by reaching chapters, meeting people, growing
  closer to them, and making choices (sparing the wolf and killing it write different pages). Unwritten pages show
  as blank with a hint of how to fill them. A line on screen says when a page is written, and the pause menu counts
  unread pages.
- **The journal has four tabs:** Today (goals, what Wren is working toward, the road through the chapters, the story
  so far, things she did), Bonds, Pages, People.
- **The end of the slice sums up** where Wren stands with each person, pages written and choices remembered.

Honest limits: hearts 4 and 5 and the endings they point at are not built; they are labelled "chapters to come".
The sisters cannot reach heart 2 in this slice (30 points on offer, 40 needed), so their second pages stay blank.

Tests: feel 52/52 (two runs), menus 19/19, smoke and an 8,000-frame random-input run with no errors. Journal checked
in screenshots at phone size, upright and sideways. Not yet played by hand or on a phone.

## v0.1.3 — after the first playtest by people (Nov 18, 2026)
Will, after playing with a second tester: the Queen's first trial is lame; three down hits in a row is too big a
move too early; the boss is too strong with too little combat before it, a hit that did nothing, the down hit did not
bounce off it, and its jump could not be escaped.

- **The Queen's first trial is a thing you do, not a menu.** She asks her riddle, then three stone altars stand in
  the Deep: a secret, a grief, a seed. Walk to one and press up. A wrong altar cracks and she mocks you; the seed
  opens the gate to the maze. (It used to be a three-button dialogue choice.)
- **The thorn pit in the Ring no longer needs three perfect down strikes.** Two wooden planks sit between the buds,
  so each bounce has somewhere to land and rest. Buds bounce you on any input, with a wider catch.
- **The Old Wyrm is fairer.** Health 46 to 32. Every hit takes one heart, never two. Longer wind-ups. Longer daze when
  it hits the cliff, and a missed charge now leaves it winded and open.
- **Its leap can be read and escaped.** The landing spot is fixed the moment it crouches and marked with a shadow on
  the ground; it no longer tracks you in the air. It cannot hurt you on the way up, only where it lands.
- **The down strike works on it.** Striking down onto its back bounces you off, hurts it, and it cannot hurt you
  while you do. Touching it while it is dazed no longer hurts either.
- **No more "hit that did nothing".** A blade on its armoured head still does 1 damage and the words say
  "ARMORED HEAD: hit its back". Before, a front hit did nothing and said so only with a clink.
- **The fight tells you what is coming.** The hint line names each move as it starts and what to do: jump or dash
  through the charge (nothing can touch you mid-dash), leave the shadow, throw fire while it breathes in.
- **Its roar gives Wren one heart back**, so each new phase starts with a breath.
- **More fighting before the boss.** Four more thorn sprites on the mountain road, so the blade, the dash and the
  flame get used before the hollow.

Tests: feel 50/50 (three runs), menus 19/19, smoke and an 8,000-frame random-input run with no errors. Not yet played
by hand or on a phone.

## v0.1.2 — slower pacing (Nov 18, 2026)
Will: the pacing of the text prompts is too fast; space out some of the first location; keep improving the graphics
and the menus.

- **Explanation cards are spaced out:** none in the first twelve seconds of a new place, none straight after a
  conversation, at least forty seconds of play between cards. In the Winter Woods that turns three cards in the first
  minute into one every forty seconds or so. They wait in a queue, so none is lost.
- **Text types at a reading pace** (normal is about two thirds of what it was), and a hurried tap cannot skip a line
  the instant it appears.
- **Things read on the move stay up longer:** floating words (at least a second and a third), toasts, whispers,
  consequence cards, level-up and finisher bands.
- **Hints hold** for five seconds before another can replace them, so walking briskly no longer flips through them.
- **Save slots** read like journals on a shelf: chapter, level, Starlight, choices remembered, hearts with Caelum,
  time played.
- **Wyrms** have overlapping scales, spines down the tail and pale claws.

Release: [`releases/v0.1.2/`](releases/v0.1.2/RELEASE-NOTES.md). This is the build for tonight. Tests: 50 play checks,
19 menu checks, the fuzz run, the screenshot run. **Not yet played by a person.**

## v0.1.1 — the playtest build (Nov 18, 2026)
Will: another playthrough, a big search and fix, and tightening, for tonight's playtest by people.

Played the opening minutes and the boss **with real taps** (not test hooks) on a phone-sized screen, sideways and
upright, and looked at every screen. Found and fixed:
- Consequence cards covering explanation cards, the pause menu and the journal (including the "Got it" button).
- A garbled, doubled version line on the title.
- The title and pause menus not fitting a sideways phone.
- STARFALL spending the bond bar and doing nothing when the Old Wyrm was just off-screen.
- Stale names for the journal in the goal line and two explanation cards.

Release: [`releases/v0.1.1/`](releases/v0.1.1/RELEASE-NOTES.md), with five questions for the people playing.
`releases/v0.1/` is left as it was. All suites pass; **tonight is the first time a person plays it.**

## After v0.1 — tighter dialogue, menus of the courts (Nov 18, 2026)
Will: the Skip button covers too much text and the boxes have too much dead space; redesign the menus to look more
unique and in the realm of the courts.

- **Skip no longer covers anything.** It is a small tab hanging under the corner of the box, in the speaker's colour.
  The words use the full width.
- **No dead space.** The box is as tall as its words: a one-line narration is a one-line box. The portrait is a
  little smaller, and the padding under the text is gone.
- **Menus are writs under a court's seal.** Every panel (pause, chapter cards, the Constellation, How it works,
  explanations, the ending) carries a crest medallion (a crescent over the four-point star), a doubled border, gold
  rules, and buttons like engraved tablets, each with its own mark.
- **The court changes with where you are.** In Starhaven the panels are Dusk's violet and silver and the pause screen
  reads "By the Court of Dusk, in Starhaven". Under the Mountain they turn blood-red, "by the Thorn Queen's leave".
  In the Winter Woods they are grey and frost, "in the mortal lands, south of the Wall".
- Pause-menu wording: "Wren's journal", "Restart chapter", "Leave for the title".

The frozen v0.1 in `releases/v0.1/` is unchanged; these are in the working copy and the live link. Tests: 50 play
checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by hand or on a phone.**

## v0.1 — the first release of the slice (Nov 18, 2026)
Will: keep running playtests and improving it to be a quality slice, and release.

**Release.** `releases/v0.1/` holds the frozen game file, release notes, a how-to-play sheet and a share zip
(`starhaven-v0.1-share.zip`). The title screen says v0.1. Notes: [`releases/v0.1/RELEASE-NOTES.md`](releases/v0.1/RELEASE-NOTES.md).

**Found by playtesting for the release: the game was drawing too slowly.** A new speed test (`tests/perf.js`) runs
the real game loop on a processor slowed fourfold. Fixed:
- The haze between background layers was painted as a fresh full-screen gradient three times a frame (six in levels
  that change place). It is now painted once per place and reused. This was the largest single cost.
- Levels that change place (the Ring into the thornwood, the Library into the mountain) drew two whole backdrops all
  the time; now only in the stretch where one turns into the other.
- The darkness-and-light layer is painted at half size and stretched (it is soft anyway).
- Foreground strips were built on the first frame that needed them, mid-level; they are built when the level loads.
- Result: 60 pictures a second at full speed, 31 to 38 with the processor slowed fourfold and no graphics chip.
  (I do not have a like-for-like figure from before the fixes with this test; the earlier, cruder timing showed the
  thornwood and the boss arena costing about twice what the other levels did, and they are now level with them.)

**Also in this release:** floating words appear over Wren's head and clear of the cards; a toast never covers the
speaker's name.

**Playtest for the release.** 50 play checks, 19 menu checks, the random-input run at 9,000 frames a chapter in both
orientations (no errors), the screenshot run, the speed run. **Still not played by hand or on a phone:** that is the
one test this release has not had, and the release notes say so first.

## Reimagined 16 — no text over text, three voices, portraits with a world behind them (Nov 18, 2026)
Will: some text pops up over other text; keep designing the characters; keep beautifying the game and the text and
give it an identity.

**Text over text, cleaned up.** Found by putting every kind of message on screen at once:
- Floating words stacked on the same spot ("+4 XP" on "BULLSEYE" on "Firewood 2/3"). Each new one now sits above the
  last, over Wren's head.
- The speaker's name ribbon sat on top of the goal line. The goal hides while someone is talking.
- Toasts and hints shared the top of the screen. A toast now takes the hint's place while it is up, and during
  conversation it drops to the bottom so it never covers the speaker's name.
- Level-up and finisher bands ran across hints and consequence cards. Those fade while a band is up.
- Consequence cards overlapped the corner of the hint plate; they start lower.

**An identity for the text: three voices.**
- *The story* (what people say, narration, choices, whispers, the reasons on consequence cards, the journal): an old
  book face (IM Fell English).
- *The world's own lettering* (names, the goal, toasts, buttons, counts, plaques): Cinzel capitals, in gold, with the
  four-point star as the mark.
- *How to play* (hints): plain Nunito, so instructions never look like story.

**Portraits.** Every face now has something of its world behind it: stars and a crescent for Caelum, forge-light and
racked blades for Bram, threads of fate for Iris, shelves for Thane and Mirelle, cottage boards for the sisters (and
Lissa's sprig), blossom for Rowan, thorns for the Queen, snow and pines for mortal Wren, starlight once she is fae.
Each bust is lit from the upper left with a cool shadow, and the corners are darkened.

**Honest notes.** The three faces come from Google Fonts and fall back to plainer ones offline. The faces themselves
(the drawing of eyes, hair and so on) are as they were last round; this adds setting and light. Tests: 50 play
checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by hand or on a phone.**

## Reimagined 15 — Wren herself (Nov 18, 2026)
Will: keep improving the slice, playtesting, and the graphics, animations and character models.

**Wren's in-level figure is redrawn.** She was the oldest drawing in the game: a box head, bare stick forearms, flat
feet. Same skeleton and the same animation, so every pose and attack still works, but the figure on it is new:
- **Head:** a soft jaw instead of a box, a full crown of hair swept back with a fringe and one bright strand, a
  **braid in knots that swings behind her** and is tied in gold, a brow, an eye with an iris (green as a mortal, teal
  once she is fae) and a catch-light, a nose, a mouth, colour in the cheek, and the pointed ear after the Deep.
- **Body:** an open collar, a leather strap across the chest, a belt pouch, and the tunic flaring into a skirt with
  a gold hem.
- **Arms and legs:** rounded shoulders, elbows, hips and knees (the joints used to show as corners), leather bracers
  with a pale cuff, real hands, and tall cuffed boots with soles.

**Playtest.** 50 play checks, 19 menu checks, the random-input run at 6,000 frames a chapter in both orientations (no
errors), and the screenshot run. Checked in close-up frames of standing, running, jumping, both cuts, the finisher and
the rising strike.

**Honest notes.** The wyrms and the wolf keep their earlier drawings. No new animation frames were added: this is a
better figure on the existing motion. **Not played by hand or on a phone.**

## Reimagined 14 — the story's pages: cutscenes, the journal, the title (Nov 18, 2026)
Will: the animated scenes still look ugly and this is a story game at heart; the journal should look like a journal;
the menus should live in the world and draw you in; the text boxes should reflect that.

**Cutscenes.** The ugliest scenes were the ones the game opens on: the prologue was still drawn with stick figures
and a stag made of rectangles. Rebuilt in layers with the real cast (`src/cine3.js`):
- **The white stag:** dawn over three depths of snowy pines with haze between them, glittering tracks, the stag's
  breath on the air, Wren at full draw behind a snow-laden bough. The arrow flies; the stag falls; light pours out
  of it in rays.
- **That night:** the cottage by firelight, the pot steaming, herbs drying, snow at the window, all three sisters
  at the table. Then the door: cold blue light across the floor, snow blowing in, the candle flame bending, and
  Rowan in the doorway.
- **Beyond the Wall:** the Wall as a standing curtain of coloured light with a bright door in it, the cottage one
  small lamp far behind, two sets of footprints going one way. Wren looks back once.
- **Under the Mountain:** his blood falling a drop at a time; then she rises upright in a bloom of light, the thorns
  burn back, and the bond pulls taut between them.
- **The Library:** three depths of shelves, ladders, a round window with moonlight and dust in it, floating candles.
- **Iris's tower:** the dome's slit open to the stars, a brass telescope, star maps, threads of starlight hanging and
  swaying.
- **Every scene** (these, the seven from before, and the remaining stills) now gets the same finish: a vignette,
  darkened top and bottom, and a little film grain.

**The journal is a journal.** A leather-bound book open on ruled parchment, written in ink: handwritten headings in
Wren's voice ("How I got here", "Things I did", "The people I am tied to"), goals struck through as they are done,
faces taped in at an angle like small photographs, a ribbon bookmark to close it.

**The title menu is an object in the world:** a night-stone plaque with a crescent crest, engraved rows divided by
gold rules, a diamond that lights on the row you are on, and a line under each in the book's italic ("Begin Wren's
story, in the winter woods", "Three journals are kept on the shelf").

**Honest notes.** The fonts for the journal and menu (a handwriting face and an old book face) come from Google
Fonts; without a connection they fall back to plainer ones. The garden, thorns, cell and trials scenes, and the
stills for the mountain, the ships and the morning-after, are not rebuilt (they do get the finish). The pause, save
slot and settings screens are restyled only as far as they share the title menu's rows. Checked as single frames,
not in motion. Tests: 50 play checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by hand or on a
phone.**

## Reimagined 13 — dialogue with character, and two graphics glitches (Nov 18, 2026)
Will: some goofy stuff happens with the graphics; the text boxes and the picture frames for the characters need more
character and design; keep making the slice better.

**Glitches found by looking at frames mid-jump in every level, and fixed**
- **Grass and trees floating in mid-air.** The dark foreground strip was pinned to the bottom of the screen, so when
  the camera rose (a jump onto a ledge, a high platform) it hung in the sky with no ground under it. It now belongs to
  the bottom of the world and drops out of sight as the camera rises.
- **Consequence cards covering the speaker.** After moving them to the left last round, they landed exactly on top of
  the dialogue box's portrait and first words. While someone is talking they now sit below the box.
- The level chip no longer tucks under the Starlight count.

**Dialogue redesigned**
- The **speaker's colour** runs through the box: its border, a stripe down the left edge, and the name.
- The **name sits on a ribbon** over the top edge of the box, with a small star.
- The **portrait hangs in a gilded frame**, slightly tilted, with a drop shadow and the speaker's colour round it. The
  same frame is used wherever a face appears (whispers, consequence cards, the journal, the pause screen).
- **Narration is set apart** like a line from a book: centred, in the serif face, under a small star, with no portrait.
- **Choices** are plates with a diamond marker that fills and glows on the one you are on, and slides a little.
- The "tap anywhere" text is now a small bouncing arrow.

**Enemies.** Thorn sprites have a shadow, root-legs that scuttle when they move, spines that spin up as they wind
up, and they burst into leaves and thorns when they die.

**Honest notes.** I could not tell which "goofy" things Will saw, so I went looking; the two above are what I found.
If it was something else, a word about where (which level, what was on screen) will find it. The portraits inside the
new frames are the same drawings. Wren's figure and the wyrms are unchanged. Tests: 50 play checks, 19 menu checks,
the fuzz run, the screenshot run. **Not played by hand or on a phone.**

## Reimagined 12 — pop-ups out of the way (Nov 18, 2026)
Will: word pop-ups block the direction you're going.

- **Consequence cards** (bond changes, "this will be remembered") slide in on the **left**, under the hearts, and are
  narrower. They used to cover the right side of the screen, which is where Wren is usually heading. Held upright they
  sit in the control deck, off the picture.
- **Words that pop up by Wren** ("Firewood 2/3", "+4 XP", "BULLSEYE") appear **behind** her, are smaller, and never
  stay longer than about a second.
- **Level-up and finisher bands** moved from the middle of the screen to the top fifth.
- **Hints and toasts** are smaller and narrower, and the hint plate is slightly see-through.

Tests: 50 play checks, 19 menu checks. Checked in one screenshot with every kind of pop-up on screen at once: the
ground ahead of Wren is clear. **Not played by hand or on a phone.**

## Reimagined 11 — graphics, from research (Nov 18, 2026)
Will: the graphics need serious work; do some research and refinement.

**What the research said** (pixel-art and 2D-depth guides; links at the end):
1. Depth needs at least three of four things working together: things in front hiding things behind, air between
   layers (far things lose contrast and take the sky's colour), a detail gradient (near things detailed, far things
   plain), and parallax. Parallax alone "may not be convincing if your scene doesn't already convey depth when static".
2. Colour ramps should shift hue as well as brightness: shadows cooler, highlights warmer.
3. Characters read by silhouette and by contrast against a quieter world; shade them with a three or four step ramp.

**What Starhaven was doing wrong:** it had parallax and little else. The far mountains and the trees were the same
flat darkness with no air between them, nothing in the background had detail, every shadow in the game was just the
same colour multiplied darker, and the ground was nearly as bright as the people standing on it.

**What changed**
- **Air between the layers.** Behind every level there are now five depths instead of two: the far ridge, a distant
  wood, the wood, a detailed near layer, then the level. A haze in the sky's own colour sits between each pair, so
  each one further away is paler and bluer.
- **A detail gradient.** The new near layer is the only background layer with real drawing in it: pines with trunks,
  tiers of boughs and snow on each tier; twisted, thorned trunks in the thornwood; lit rock pillars and hanging roots
  Under the Mountain.
- **Hue-shifted colour everywhere.** The one function that makes a colour darker or lighter now also pulls shadows
  toward cool violet and highlights toward warm cream. The whole cast, the stonework and the ground changed with it.
- **Form light on characters.** Wren and every person are lit warm from above and shaded cool toward their feet, and
  Wren has a pale rim on her leading edge.
- **A quieter ground.** The surface stones are a step darker, so the people on them are the brightest things again.

**Honest notes.** This is light, colour and layering applied to the art that exists. It is not new drawings: Wren's
figure and the wyrms have the same shapes as before. Tests: 50 play checks, 19 menu checks, the fuzz run, the
screenshot run. **Not played by hand or on a phone.**

Sources: [Return devlog, creating visual depth in a 2D pixel world](https://jesseeisenbart.itch.io/return-alpha/devlog/384936/return-devlog-02-creating-visual-depth-in-a-2d-pixel-world) ·
[Pixel art scene depth composition tricks](https://freegamesprites.com/de/news/pixel-art-scene-depth-composition-tricks) ·
[Slynyrd Pixelblog 23, parallax scrolling](https://www.slynyrd.com/blog/2019/11/12/pixelblog-23-parallax-scrolling) ·
[Slynyrd Pixelblog 1, colour palettes](https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes) ·
[Pixel Parmesan, anti-aliasing fundamentals](https://pixelparmesan.com/anti-aliasing-fundamentals-for-pixel-artists) ·
[How to paint in the Hollow Knight style](https://cypaint.com/article/how-to-paint-in-the-hollow-knight-style)

## Reimagined 10 — Chapter 2 filled out, and a full retest (Nov 18, 2026)
Will: make the current slice more content rich and developed, and retest for bugs.

**Chapter 2, The Five,** was the one chapter with nothing new since before the reimagining. Now:
- **Bram asks why she is still here** before she swings at anything (walk up and TALK). Three answers: one he
  respects, one he understands, one that costs her with him. Two are remembered, and he comes back to the first one at
  the fire that evening.
- **Bram's three rings,** hung past the dummy: the low one falls to a cut from the ground, the middle one wants a
  rising strike, the high one a strike from a jump. Cutting all three is remembered, earns XP and +10 with Bram, and
  he mentions it that evening.
- **Sugared plums for Iris:** a burst market crate in the thornwood. Spend the evening with Iris and she gets them
  (+15: they are the thing she loves).

**Retest.**
- All suites: 50 play checks, 19 menu checks, the screenshot run.
- The random-input run at 9,000 frames a chapter, sideways and upright: no errors. It had a blind spot: it gave the
  same answer to the riddle forever and never left the first room Under the Mountain. It now varies its answers and
  runs that whole level (to tile 143 of 150).
- A save and reload carrying every kind of progress at once (level, remembered choices, a bond pushed below zero and
  held at zero, Starlight from people, a lit star, explanations seen): identical before and after.
- No new bugs were found in this pass.

**Honest notes.** "No errors" means no crashes and no broken numbers under random play; it does not mean nothing looks
or feels wrong. **Not played by hand or on a phone.**

## Reimagined 9 — levels, tighter controls (Nov 18, 2026)
Will: analyze what matters; refine the gameplay and tighten the controls; add more experience progression and build it
out; improve the quality overall.

**What matters, in order** (my reading of where this slice stands):
1. *It has never been played by a person.* Every number in it (jump, dash, damage, how long the Old Wyrm takes) is a
   guess checked by bots. Ten minutes of Will's thumbs is worth more than any further change.
2. *The controls on a phone.* It is an action game on a touch screen: if the stick and buttons fight the player,
   nothing else is seen. This pass is mostly here.
3. *Reasons to keep going.* Starlight buys things and bonds grow, but nothing rewarded simply playing well. Levels do.
4. *Wren herself* is still the oldest drawing in the game. Not done in this pass.

**Controls**
- **The touch stick follows your thumb.** Drag past its edge and the base comes with you, so reversing direction is a
  small movement back, not a long drag across the screen.
- **Aim assist.** Strike (or shoot) without holding a direction and Wren turns to the nearest enemy in reach, so a
  thumb on STRIKE alone never cuts empty air with something at her back.
- **Touch buttons have a larger touch area** than they look (12 px all round).

**Experience and levels** (`src/xp.js`)
- XP from: every enemy (10, 25 for a wyrmling, 80 for the Old Wyrm), targets, snares, the wolf either way, each
  Starlight mote, perfect dodges, residents' errands, and finishing a chapter. Bigger gains pop a "+N XP".
- Six levels so far, each with one perk for good: **2 Quick hands** (bow and Flame recover faster), **3 Light feet**
  (dash ready sooner), **4 Hard to kill** (+1 heart), **5 Bonded** (the bond bar starts a third full),
  **6 Hunter's patience** (Starlight drifts to you from further away).
- A level chip and bar sit under the Starlight count. Levelling up gets a band across the screen, a line saying what
  you got, and (the first time) an explanation card. The pause screen shows your level, XP to the next and its perk,
  and the perks you hold. Levels are in the save.
- Levels are earned; the Constellation is where you choose. The explanation says so.

**Honest notes.**
- The Old Wyrm test showed the fight is long for a bot that only cuts in the openings and never uses a Bond Art: about
  114 seconds, and once it ran past the old 150-second limit (the test now allows 240). That is a balance question for
  a human to feel, not something I have tuned.
- Aim assist has only been checked by a test (an enemy placed behind her), not felt.
- Tests: 49 play checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by hand or on a phone.**

## Reimagined 8 — seven cutscenes rebuilt in layers (Nov 18, 2026)
Will: make the graphics even better; more pretty animated cutscenes and depth in the existing slice.

Seven story scenes that were still pictures with a slow zoom are now animated cinematics built in parallax layers
(`src/cine2.js`). The camera drifts sideways and pushes in, and each layer moves by a different amount, so the picture
has depth. The cast in them are the same shaded sprites as in the levels, so they blink and breathe.

- **The Rooftop House** (the mates scene, and every evening with Caelum): moon and shooting stars, three depths of
  city with windows that flicker, the river catching the lights, chimney smoke, a swinging lantern, the table and the
  wine, and a gold thread between Wren and Caelum that pulses: the bond, drawn.
- **Midnight at the Spring Court:** curtains breathing with the night air, moonlight on the floor, petals outside, a
  candle; then wings fill the window, then the man, then his eyes open.
- **The Spring Court:** a turning sun, rose hills, marble columns, a fountain that runs, blossom close to the eye, and
  two guards who never look at her and never look away.
- **Starhaven at night** (evenings, the final scene, the title screen): four depths of city, the Library's tower and
  its light, a lantern-lit bridge, a boat crossing the river, strings of lanterns swaying.
- **The peak:** an aurora, wind-driven snow from one side meeting Rowan's petals from the other, flowers coming up
  through the snow where he stands, the Old Wyrm already snowing over.
- **By the fire** (Bram's evenings): a hearth with real flames, its light breathing on the floor and wall.
- **Iris's vision:** threads of light over a dark sea, an iron crown turning, and two threads pulled taut to two small
  figures in a cottage doorway.

The opening film and the title backdrop pick these up automatically.

**Honest notes.** Still panels remain for the Library, the observatory, the morning-after spark, the mountain and the
ships. The memory half of a Bond Art cut-in still uses the old still of the rooftop. Checked as screenshots of single
frames, not watched in motion. Tests: 48 play checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by
hand or on a phone.**

## Reimagined 7 — errands, callbacks, a bug hunt (Nov 18, 2026)
Will: keep improving the graphics, the systems and the content; make it more content rich; fix bugs.

- **Bug hunt.** New `tests/fuzz.js` plays all five chapters with random inputs, sideways and upright, with the story,
  the other perspectives and the explanation cards all on, and reports any error. It found no crashes. Reading the
  code alongside it found and fixed one real bug: when two systems needed explaining in the same moment (a bond change
  and a remembered decision from one choice), only the last card was ever shown. They now queue.
- **Residents' requests** (the design doc's small errands, paid in Starlight):
  - **Chapter 1: Old Mirelle's cat.** A new resident at the top of the dark street asks after her cat, Ember. It is on
    an awning further up. Bringing it down is remembered, pays 10 Starlight, changes what Mirelle says, and earns a
    line in the last scene.
  - **Chapter 3: Thane's lost page,** frozen to the mountain. Pays 5 Starlight; give it to him that evening and he is
    moved (+10 with Thane).
  - Starlight earned from people counts toward the Constellation along with the motes.
- **More decisions are remembered.** The first evening with Caelum now says why each choice landed, and two of them
  come back in the final scene (the sketchbook; the nightmares).
- **Thorn sprites** have the dark outline and a glint, like the rest of the redrawn creatures.

**Honest notes.** The fuzz test catches crashes and broken numbers, not things that merely look or feel wrong. Wren's
own figure and the wyrms are still not redrawn. Chapter 2 has had no new content since Rebuild 8. Tests: 48 play
checks, 19 menu checks, the fuzz run, the screenshot run. **Not played by hand or on a phone.**

## Reimagined 6 — play it upright, depth in the picture, systems that explain themselves (Nov 18, 2026)
Will: keep beautifying (characters, animation, menus, graphics); you shouldn't have to turn your phone to play, Sootborn
works upright; make the systems more understandable.

- **You can hold the phone upright.** The "turn your phone sideways" screen is gone. Upright, the picture sits at the
  top of the screen and a control deck sits below it: the goal and hints, dialogue with its portrait, the stick on the
  left and the buttons on the right, so thumbs never cover the action. Cutscenes and the opening film fit the width
  with their text underneath. Sideways still works as before. Turning the phone switches between the two at once.
- **Depth in every level.** Shafts of light slant down through the air (moonlight outdoors, a rose glow Under the
  Mountain, lamplight in the city), and a dark foreground of grass, boughs, rock teeth or railings slides past faster
  than the world along the bottom edge.
- **Systems explain themselves the first time they matter,** once per save, on a card that holds the game until you
  close it: Starlight, lanterns, bonds, "this will be remembered", the bond bar and Bond Arts, moons and the Flame,
  and the perfect dodge. All seven are also listed any time under **How it works** in the pause menu.
- The paint hint now matches the mural ("Use PAINT at the wall").

**Honest notes.**
- Upright, the picture is about a third of the screen (the game's view is wider than it is tall). It is readable in
  screenshots at 390 by 844; whether it feels too small in the hand is for Will to say. Making the view itself taller
  when upright is possible but touches the whole renderer.
- "Character models and animations" in this pass means the depth and light around them. Wren's own figure, the thorn
  sprites and the wyrms are still drawn as before; they are the next thing to redraw.
- Tests: 47 play checks, 19 menu checks, the screenshot run, plus upright screenshots. **Not played by hand or on a
  phone.**

## Reimagined 5 — decisions that matter, a fuller hunt, menus and faces (Nov 18, 2026)
Will: we have to know why our decisions matter, whether they help or hurt. The slice needs more content and a slower
pace, with more to do before the deer is shot. Better menus, better design, updated characters.

**Decisions now show their weight.**
- Every choice that touches someone slides in a card: their face, **+10 &hearts; or &minus;5 &hearts;**, the reason in a
  sentence ("True, and it landed like a slap."), and their heart bar moving. Bonds can now go **down**.
- Choices the story will come back to are marked **"This will be remembered"**, green if someone is better for it, red
  if it will cost her, gold if it could go either way. They are listed in Story & goals under "What Wren has done", and
  counted on the pause screen.
- The story does come back to them. So far: the cottage that night changes with what you did in the woods (the
  wintergreen, the firewood, the wolf pelt, the rabbit you ate alone); Nessa's "take me instead" lands differently if
  you told her she couldn't be carried forever; painting the first mural answers what you told Lissa about painting;
  Rowan on the peak remembers whether you told him the truth or reached for a knife.
- **Nessa and Lissa have bonds of their own** (the design doc's sisters' track), earned in the prologue.

**The Winter Woods is a real hunt now** (the level is 60% longer; about four to six minutes before the stag):
- **Firewood for Nessa:** three bundles of deadfall along the path.
- **Three snares to check** (the goal counts them): one empty, one chewed through, one with a rabbit and a three-way
  decision.
- **Father's targets:** three old archery rings. Two are flat shots; the high one needs a shot from the top of a jump
  (Wren can now shoot in the air).
- **Wintergreen for Lissa,** up on a rock shelf.
- **A starving wolf** guarding the last snare. One arrow and it backs off, hurt. Then the decision is made with the
  bow, not a menu: shoot again for the pelt, or lower the bow and it slinks away. Each sister feels differently about
  which you chose.
- New talk options with both sisters, including ones that hurt.

**Menus.** The title sits over a living picture (the rooftop, the city, the observatory) with a new logo treatment and
buttons that slide when chosen. The pause screen opens with where you stand: chapter and goal, Starlight here and to
spend, choices remembered, and your bonds as faces and hearts. Its buttons are in two columns.

**Faces.** Every portrait gains lid lines and catch-lights in the eyes, a blush, a two-tone mouth, a softer jaw, a
chin shadow and a highlight through the hair. The wolf, the snares, the targets and the pickups are drawn in the
outlined style.

**Honest notes.**
- Callbacks exist for the prologue decisions only. The choices in Chapters 1 to 3 show their bond effect and reason
  through the same card, but most are not yet "remembered" by later scenes.
- Wren's own in-level figure and the thorn sprites and wyrms are still not redrawn.
- A test bot plays the whole new hunt (firewood, snares, targets, wintergreen, sparing the wolf, the rabbit) and it
  takes it about two minutes without reading; a person will be slower. Tests: 46 play checks, 18 menu checks, the
  screenshot run. **Not played by hand or on a phone.**

## Reimagined 4 — polish and design pass (Nov 18, 2026)
Will: the game needs more polish and design. Done from a full-resolution tour of every level, fixing what looked wrong.

- **The ground belongs to its place.** It was the same laid brick everywhere, including the snowy woods and the cave.
  Now: packed earth with buried stones and roots in the Winter Woods, on the mountain road and in the thornwood;
  boulders with moss Under the Mountain; tilted layers of rock on the mountain; brick only in Starhaven's streets.
  Snowy places get a thick, uneven cap of snow.
- **The HUD is one tidy cluster.** Hearts (smaller), moons and the bond bar sit in three clean rows top-left. The
  Starlight count moved beside MENU. Hints are narrower and no longer run into either.
- **The "hold and slide to move" hint fades** the first time you use the stick.
- **Under the Mountain can be read.** Less darkness and lighter rock; it is still the darkest place in the game.
- **The white stag is redrawn:** slender, long-necked, a crown of antlers, an outline, a glow and drifting motes. It is
  the image the whole story starts from and it was five rectangles.

**Not done in this pass:** Wren, the thorn sprites and wyrms, the trees and far backdrops, and the touch buttons are as
they were. Tests: 44 play checks, 18 menu checks, the screenshot run. **Not played by hand or on a phone.**

## Reimagined 3 — other ways of seeing (Nov 18, 2026)
Will: we can be a side scroller sometimes and other things other times. Try multiple perspectives; keep the gameplay
fresh and the look nice; tell the story and the relationships; stick to the source material.

Three moments that were a cutscene, a held button and a menu are now played, each from its own point of view
(`src/modes.js`). The missions stay side-on.

- **Flight, into the screen (Chapter 1).** Caelum no longer winnows Wren out of the Spring Court: he opens the window
  and his wings. You steer the two of them from behind, over the sea, for about 45 seconds: gather Starlight, lean away
  from Rowan's archers' arrows, thread the gaps in a storm on the border, and watch Starhaven's lights come up on the
  horizon. They talk the whole way (nine lines, none of which stop the flight). Fourteen or more Starlight is worth a
  little extra with Caelum. Being hit costs nothing but the moment: he has her.
- **The mural, face to the wall (Chapter 1).** PAINT at the wall now opens the wall itself. You move the brush along the
  chalk from point to point (eleven of them) and the star of Dusk fills in behind it; when the last point closes, the
  night sky and rooftops bloom out round it. Caelum watches and says three things. This is the design doc's
  "trace-and-fill" mural, replacing "hold the button".
- **The city, from above (the evenings after Chapters 2 and 3).** Choosing who to spend the evening with was a list.
  Now it is the Lamp Square at night, seen from above: Caelum by the Rooftop House door, Bram at his stall by the Ring,
  Iris (or Thane) across the square. Walk up to someone and that is who the evening is with. It is the first piece of
  the design doc's city.
- A scripted scene can now start any of these with `{ do: 'mode', name: ... }` and carries on when it ends. The pause
  button skips the flight and the mural. Skipping a scene stops at one, as it stops at a choice.
- Wren has a sprite in the same style as the rest of the cast (used in the square).
- The pixel font has a comma.

**Story change to flag:** Wren's first arrival used to be a winnow; it is now a flight, then a walk "because the wards
will not let me fly you in". Winnowing is still explained in the same line.

**Honest notes.** All three are first versions, played only by test bots (a pilot, a tracer, a walker). The flight's
difficulty is a guess. The mural brush is steered with the stick, not by dragging a finger on the wall, which is what
a phone player may expect. Tests: 44 play checks, 18 menu checks, the screenshot run. **Not played by hand or on a
phone.**

## Reimagined 2 — a camera, weight, memories in the fights, an opening (Nov 18, 2026)
Will, after looking at Guttercrown and Sootborn v0.11 together: don't copy those titles, but see how far those ideas
have been taken, and build Starhaven's own concept up to that level.

What those two do that Starhaven did not: they shoot their fights (a camera that pushes in, cuts and frames), every hit
has weight, the story is carried inside the fight (Sootborn's Memory Arts), and they open like a film. Starhaven's own
version of each:

- **The camera acts** (`G.direct` in `game.js`). It zooms about the point it is looking at. It frames Wren and whoever
  she is talking to, closes on a Bond Art, goes to the Old Wyrm when it wakes and each time it roars, and pushes in and
  slows down on the killing blow.
- **Weight.** Every clean hit punches the camera in by how hard it was (more for finishers and kills); being hit
  punches it too; the Old Wyrm's slam lands with it.
- **A hit counter.** Unbroken hits count up on screen (called out at 5, 10 and 20, each with a bond bonus). Being hit
  drops it.
- **Bond Arts are choreographed, and each one is a memory.** The cut-in is now two slanted panels: the memory the art
  comes from (the rooftop where she learned what the bond was; the morning the fire first sat in her palm), and the
  face, with the name of the blow and a line.
  - **STARFALL:** Caelum lends her the night. She winnows through her target five times, the cuts hang in the air,
    then all land at once (10 to the target, 6 to everything else in sight) and the stars come down.
  - **FIRST LIGHT:** she rises on a pillar of her own fire, then the ring of dawn bursts out (as before: 10 nearby,
    lights braziers, burns thorns, mends a heart).
  - Nothing can hurt her during a Bond Art. A button skips the cut-in after half a second.
- **The bond answers the boss.** Each time the Old Wyrm roars into a new phase, the bond bar fills, so the story beat
  and the big attack arrive together.
- **Wren thinks out loud in the boss fight** (the same slide-in as Caelum's whispers, under her own name).
- **An opening film** before the title: six shots from the prologue cinematics with the credits over picture (North
  Coast Studios presents, in association with E Concepts) and five captions that tell the premise. About 25 seconds.
  Any button skips it; "Watch the opening" on the main menu replays it.
- **Fixed:** Wren flickered or vanished during her own Bond Art (she was being drawn as "just hit"). The HUD and touch
  buttons no longer sit on top of the cut-in.

**Honest notes.** Still 2D and still the same levels. Wren, the enemies and the backdrops are not redrawn. The camera
zoom is new machinery over the whole renderer: it has been looked at in screenshots, not felt in motion. Tests: 41 play
checks, 18 menu checks (two new, for the film), the screenshot run. **Not played by hand or on a phone.**

## Reimagined 1 (Rebuild 9) — the studio's newer techniques, applied to Starhaven (Nov 18, 2026)
Will: study how the new games in the repo work, save what we have as a duplicate, and reimagine Starhaven with the
techniques we have been using.

**The duplicate.** Rebuild 8 is frozen in [`backups/rebuild-8/`](backups/rebuild-8/README.md) (the playable file and its
full source) and is still live, unchanged, at its old link. Nothing in that folder is ever edited.

**What was studied** (source and changelogs, and Sootborn run in a browser): Sootborn v0.10, Lightswarm v0.3, lil Bottie
v0.5, Knockout, Sproutwild v12.10, Clankawatch v4.0 alpha 3. What they do that Starhaven did not:

| Technique | Where it comes from | In Starhaven now |
|---|---|---|
| Characters built from parts, shaded in three tones, outlined, cached as sprite sheets | Sootborn `art.js` | The whole cast redrawn (`src/people.js`): Caelum, Bram, Iris, Thane, Nessa, Lissa, Rowan, the Queen |
| Blinking, breathing, emote bubbles, turning to the speaker | Sootborn v0.10 | People blink and breathe, turn to whoever is talking, hop on "!", show ! ? ... and a heart when a choice lands |
| Portraits that move their mouths | Sootborn v0.10 | Portraits talk while a line types, and blink |
| Supers with a cut-in and a scene | Knockout, Lightswarm | **Bond Arts** (`src/arts.js`): a bond meter fills from hits; STARFALL (Caelum) and FIRST LIGHT (Wren, once the Flame wakes) |
| Finisher bands with a freeze and a shake | lil Bottie v0.5 | RUN THROUGH, SKYBOUND, FROM ABOVE, ASHES, CHOKED, WYRMSLAYER |
| An "opening" after dodging through a swing | Sootborn `brawl.js` | A perfect dodge opens the foe for a moment: cuts do 1 more and get past armor |
| The radio: a face and a line that slide in during play | Lightswarm v0.3 | **Whispers down the bond**: Caelum (and Bram, Thane) comment as you play, once each per save |
| An unlock track that gives the collectible a use | Lightswarm's Keeper's Trail | **Wren's Constellation** (`src/stars.js`): spend Starlight on a heart, a faster bond, sharper finishers, a fourth moon |
| A pixel font for anything lettered on the canvas | Sootborn | `SH.ptext` (name plates, bands, cut-ins) |
| Tiles with a lit top-left edge and dark bottom-right; contact shadows | Sootborn v0.8 | The ground is laid stone, lighter near open air, with a shadow under every ledge; people cast shadows |
| Menus framed like engraved plates | Sootborn v0.8 | Every frame is a night-steel plate with a starlight edge and gold pins |
| Cinema framing | Sootborn | Black bars slide in while people talk |

**How to use the new things.** Bond Art: the BOND ART button appears when the bar under your hearts is full (R or V on
a keyboard, right trigger on a controller). Constellation: pause, then Constellation.

**Honest notes.**
- This is the same game underneath: the same levels, story, physics and saves. The reimagining so far is the cast, the
  ground, the frames, and five new systems. Wren herself, the enemies and the backdrops are not yet redrawn to the
  same standard, and the cutscene panels are unchanged.
- The bond exists from Chapter 1 on (after Caelum's blood). The two prologue chapters have no bond meter.
- Balance is a first guess: about 17 hits fill the meter; STARFALL does 9 to everything on screen; FIRST LIGHT does 10
  nearby and mends a heart. With both, the Old Wyrm is easier than it was in Rebuild 8.
- Tests: 41 play checks, 16 menu checks, the screenshot run, all passing in headless Chromium. **Not played by hand or
  on a phone.**

## Rebuild 8 — Fighting, the Old Wyrm, light (Nov 17, 2026)
Will: the slice needs polish before moving on. Better fighting animations, the boss is "super basic" (a hit move and a
fire move), Starlight gets cut off when sections end too fast, dialogue runs over the Skip button, and it should look
nicer overall.

- **Wren is redrawn** (`src/wren.js`): a jointed figure with a dark outline so she reads on any background, two daggers,
  and real key poses for every attack (wind-up then strike), with a crescent of light following each cut.
- **Three new moves.** *Dash strike:* press STRIKE during a dash for a lunging thrust (3 damage). *Rising strike:* hold
  up and STRIKE for an uppercut that carries Wren into the air and launches thorn sprites. *Flame wave:* hold FLAME and
  let go: two moons, 8 damage, burns through everything in its path. A tap is still a fireball.
- **Hits feel like hits:** sparks and a slash mark on every hit, bigger on finishers.
- **The Old Wyrm is a real fight now.** 46 health, three phases (it roars and brings rocks down at each change, and
  gets faster). Moves: the charge (still dazes itself on the cliff), a **leap slam** with shockwaves to jump, and
  **frost breath** along the ground. Fire down its throat while it breathes in chokes it and leaves it wide open. Cuts
  do extra damage while it's dazed. Phase 3 charges twice. Two ledges in the hollow give you somewhere to go, but camp
  there and the roof comes down. Caelum explains the tells before the fight.
- **Starlight is no longer cut off.** Chapter 2 doesn't end when the last sprite dies: Caelum arrives and waits until
  you talk to him. The rooftop scene in Chapter 1 now starts past the roof's Starlight. Before the two points of no
  return (the Wyrm chase, the Old Wyrm's hollow) a note says how much Starlight is still behind you.
- **Dialogue no longer runs under Skip:** the text wraps around the button.
- **Light.** Every place now has darkness and light: Wren, lanterns, braziers, fire, Starlight, the stag and the exit
  all light up what's around them. Under the Mountain is properly dark. Fireballs have a flame shape and warm glow.
  Wyrms are redrawn with an outline, back plates, a jaw, and a pose for each move.
- Tests: 36 play checks (new: the boss's phases and moves, the three new moves, Chapter 2 waiting for you).

## Rebuild 7 — Polish round on what's there (Nov 17, 2026)
Will asked for a round on the existing content. Started from an audit (close-ups of Wren's poses, every portrait, every
level) and fixed what it showed.

- **Levels are dressed.** Props in every level, placed from data: a real snow-capped fallen log, a boulder, bushes,
  snowdrifts and saplings in the Winter Woods; bones, chains, stalactites and glowing mushrooms Under the Mountain;
  banners, crates and barrels in Starhaven; weapon racks and a fence at the Training Ring; dead trees, cairns and the Old
  Wyrm's bone pile on the mountain.
- **The mountain has its own ground.** A level that changes place (city to mountain, city to Thornwood) now changes its
  ground with it: snow on the mountain road instead of the city's purple.
- **Starlight motes** (DESIGN.md: missions earn Starlight). Every level has them (29 / 61 / 43 / 20 / 38), laid along
  the jump arcs so they also show the way: over the log, up the double-jump wall, across the dash gap, above each thorn
  bud. A counter under the hearts; your best per chapter is saved; the total is in Story & goals.
- **Chapter results.** The "chapter complete" card now shows time, hits taken and Starlight gathered.
- **Music.** Five synthesized placeholder themes: the Winter Woods (cold and sparse), Under the Mountain (a drone and
  things dripping), Starhaven (warm chords and a motif of its own), the mountain (open fifths and wind), and a tense
  pulse for the Wyrm chase and the Old Wyrm. Settings has a Music volume. Will's own tracks replace these later.
- **Skip.** A Skip button on every conversation and cinematic (Start or Esc on a controller or keyboard). It runs the
  scene to its end, or to the next choice, and still applies everything the scene does.
- **Wren:** a casting pose with fire in her open palm; she blinks when idle.
- Toasts sit at the bottom so they never cover a control hint.

Verified: `feel.js` 34/34 (new: Skip ends a scene and keeps its effects, and stops at choices; motes collect and every
level has them), `front.js` 16/16 (settings list updated for Music), `smoke.js` no errors. Music checked by counting
notes scheduled in a browser on the menu and after a chapter starts. NOT tested: how the music sounds on a phone speaker;
human play.


## Rebuild 6 — Chapter 3, First Light (Nov 17, 2026)
The next chapter in `DESIGN.md`: Wren's first court gift, a new enemy, a monster hunt, and Caelum's next heart.

- **Where the gifts come from (Will's open question, answered in the story):** the Thorn Queen drained the power of all
  seven courts for fifty years. When she fell it broke loose, and some of it went into the only heart that had just
  stopped: Wren's. Caelum's blood made her fae; the queen's stolen power is the seven gifts. Flame wakes first.
- **Thane** joins the cast (the Five's scholar): portrait, sprite, journal entry, bond, heart scene.
- **Flame:** FLAME button / LB / F. Fireballs cost one moon pip; 3 pips beside the hearts, refilling over time and
  faster from dagger hits (design doc). Fireballs burn wyrms over time, light braziers, and burn the Thorn Queen's
  thorn walls (steel can't).
- **The level (`mountain`):** the Library courtyard (light three braziers), the thorn-choked mountain road, two
  **mountain wyrmlings** (armored heads: a strike at a charging head clangs off; jump the charge and hit from behind or
  while dazed), and the Old Wyrm's hollow, which seals behind you.
- **Boss: the Old Wyrm** (the same creature from data, bigger): 30 HP, a health bar, and when it charges into the cliff
  the mountain shakes and rocks fall (with a shadow first).
- **Story:** the fire dream; Thane's theory; the braziers; the thorns burning; the hunt; on the peak, Rowan comes for Wren
  and she tells him no (choose how). Evening 3 with Caelum or Thane. A new finale teases Chapter 4 (a winged spy lands
  on the Library roof).
- Fixes: Flame presses during hit-stop were dropped; the Old Wyrm could stay asleep-eyed at the far end of its hollow.

Verified (`game/tests/feel.js` 31/31, `front.js` 16/16, `smoke.js` no errors): three casts cost three moons and light all
three braziers; the thorns burn and the road opens; a strike at a charging wyrmling's head clangs off and a strike while
it's dazed lands; the hollow seals, rocks fall, the Old Wyrm can be beaten, and the peak, evening and finale follow.
NOT tested: human play of Chapter 3, its difficulty, and Flame on a real controller.


## Rebuild 5 — Boots like a game: studio splashes, menus, save slots, sound (Nov 17, 2026)
Will's notes: the controller connects but needs a touch first; it should boot like a game with a menu and a save system;
North Coast Studios watermark; E Concepts as another screen; keep improving what's there.

- **Boot sequence:** North Coast Studios splash (star over waves) → E Concepts splash → STARHAVEN "Press any button"
  → main menu. Any button, key or tap skips a splash. The game tries to take focus on load so a controller works
  straight away; if the phone's app still wants a tap first, the start screen says so (tap once, or open in Safari/Chrome).
- **Main menu:** Continue (your latest save), New game, Load game, Chapter select (any chapter, no saving), Settings,
  Credits. North Coast Studios watermark on the menus and the pause screen. Works with a controller (D-pad/stick, A,
  B back), keyboard (arrows, Space, Esc) and touch.
- **Save system (DESIGN.md: 3 slots):** each slot shows its chapter, playtime, Caelum's hearts and date. Autosaves when a
  chapter starts and ends, and on every bond change ("Saved" star in the corner). Quitting during an evening replays
  that evening on load. Overwrite and erase ask first. An older save carries over into slot 1.
- **Settings (remembered):** sound effects volume, text speed (slow / normal / fast / instant), touch "strike down for
  me", screen shake, and the movement Tune panel.
- **Sound effects** (synthesized, placeholder): jumps, dash, dagger swings and hits, pogo, the bow, getting hurt,
  landing, lanterns, hearts, painting and the finished mural, the Wyrm's rumble, the door slamming, menu sounds, text blips.
- **Dialogue types out** letter by letter; a tap or button press finishes the line first.
- **Controller in game:** the pause menu, Story & goals, Tune and the end screen can all be driven with the D-pad and A/B.
- **Mortal Wren's portrait** has round ears in the prologue.
- Fix: holding a button while a menu opened counted as a new press (holding Start flipped pause on and off).

Verified: `game/tests/front.js` (new, 16/16) drives the boot and menus with only a simulated Bluetooth controller
(splashes, press start, new game in a slot, chapter card, Continue, quitting mid-evening and resuming, settings remembered,
erase with confirm, pause menu with Start / D-pad / A / B); `game/tests/feel.js` 27/27; `game/tests/smoke.js` screenshots
with no errors. NOT tested: a real controller in the Claude app on a real phone.


## Rebuild 4 — The prologue: the stag, the Wall, the trials, the blood bond (Nov 17, 2026)
Will's notes: the down-strike is still hard; build a real prologue (how Wren ends up in the fae world: the deer, the
lord, the kidnapping), the three trials, dying on the last one, Caelum's blood, the mate bond, the war with Spring;
more cinematics, animation and character building.

- **Down-strike on touch, three ways:** a dedicated **\u25BC button** (one tap in the air = down-strike); **springy buds**
  (on touch, landing on an open bud bounces you even without striking); and a bigger down-strike hit area plus a wider
  auto-aim window.
- **Prologue, part 1: The Winter Woods (new, playable):** mortal Wren (round ears, one jump, no dash, a hunting bow),
  the sisters' cottage, Nessa and Lissa to talk to (with choices), glittering tracks, and a white stag that bolts if
  you get too close.
- **Animated cinematics (new engine, `cine.js`):** the shot (arrow, the stag falling, fae light pouring out); the cottage
  at night (fire, the door bursting in, snow blowing, Rowan's silhouette); the Wall (a curtain of light, spring on the
  other side); the Spring Court garden (Wren painting, the canvas filling in, petals); the Thorn Queen's blight (thorns
  growing); the cell (Caelum appearing out of starlight); the trials (riddle runes, the maze drawing itself, the beast,
  the killing thorn); Caelum's blood (drops falling, Wren rising, the gold thread of the bond). Cinematics react to cues
  in the dialogue. Every other scene now slowly pushes in, with snow, petals, embers or stars drifting.
- **Prologue, part 2: Under the Mountain** (the old Deep level, now the real trials): the riddle (wrong answers get asked
  again), the maze (Caelum talks to her through the bargain and lends her the double jump and dash), the beast (the
  Wyrm chase), then death, Caelum's blood, and the bond.
- **Chapter 1:** opens three months later in Rowan's locked court; Caelum steals her; on the rooftop he tells her they
  are mates; Rowan declares war. **Chapter 2:** the war on the southern border and the Iron King to the north.
- **New characters:** Nessa, Lissa, Lord Rowan (portraits, world sprites for the sisters, journal entries).
- Per-chapter abilities (mortal Wren in the woods); touch buttons show only what Wren can do (SHOOT instead of STRIKE,
  no DASH or \u25BC while mortal). The old intro panels are gone: the prologue now plays the story instead of telling it.
- `DESIGN.md` has a "Story changes since this outline" section with Will's new plot.
- Fixes: the bow's cooldown didn't start at zero (no first shot); scene titles get a dark backing so they read on bright
  scenes.

Verified (`game/tests/feel.js`, 27/27): all earlier checks, plus mortal Wren has one jump and no dash; an autopilot plays
the Winter Woods (walk, jumps, shoot the stag) through the stag, Rowan and Beyond the Wall cinematics into part 2; a
wrong riddle answer is asked again and "A seed" starts the maze; Under the Mountain plays through the riddle, maze,
Wyrm chase, death and Caelum's blood; the \u25BC button strikes down in the air. Phone screenshots of every new cinematic
checked. NOT tested: human play; a real controller on a real phone.


## Rebuild 3 — Relationships, cutscenes, and an easier down-strike (Nov 17, 2026)
Will's notes: the strike down is hard on mobile; can a Bluetooth controller be used; more relationship development,
more story, more cutscenes.

- **Down-strike on touch:** in the air, STRIKE now aims down by itself when a bud, an enemy or thorns are right below
  Wren (the design doc's "auto-aim on phones"). Holding the stick down still works, and a down-diagonal now counts.
  Bram's line and the hint are reworded for each input type.
- **Bluetooth controllers:** already supported (standard mapping: A jump, X strike, B dash, Y talk/paint, Start menu).
  New: a "Controller connected" message, the touch buttons hide while a controller is in use, and the Controls page
  says how to pair one.
- **Cutscenes:** full-screen illustrated scenes with portrait dialogue at the big beats: waking at the Spring Court,
  Caelum at Wren's window at midnight, the rooftop, Iris's vision, evenings at the fire and the tower, and a Chapter 3
  teaser (Wren's palm glowing with fire). Narrator lines for scene-setting.
- **Bonds (design doc "Bonds" and "Bond pacing"):** 5 hearts each for Caelum, Bram and Iris. Heart 1 when you meet;
  then hearts at 40 / 120 / 240 / 400 points. Points come from evenings (+20), gifts they love (+15), and choices.
  Every heart has a scene: Caelum heart 2 (what he saw in the Deep), Caelum heart 3 (flying over the city), Bram heart 2,
  Iris heart 2. Toasts say when someone loved what you did or will remember it.
- **Dialogue choices** in 9 places. Each changes what the other person says and how much they warm to Wren.
- **Evenings between chapters:** after Chapter 1, a night on the rooftop with Caelum (show him your sketchbook, toast,
  or ask about his nightmares). After Chapter 2, choose who to spend the evening with: Caelum, Bram or Iris, each with
  their own scene, gift and choices.
- **More story:** the Spring Court (safe, smothered, a letter from her sisters she hasn't answered); Caelum's midnight
  arrival; the bargain released ("I'm staying anyway"); Iris's vision that the Iron King knows Wren's name and his iron is
  reaching for her sisters; Bram's brother lost on the north wall; Iris's secret about Caelum's thread.
- **Journal:** a Bonds section with hearts, points to the next heart, and what each person loves.
- New game resets bonds; the finale leads into the end screen.

Verified (`game/tests/feel.js`, 23/23): everything from Rebuild 2, plus touch auto-aim crossing the thorn pit without
holding down; Chapter 1 + first evening reaching Caelum heart 2 with its heart scene; Chapter 2 + vision + second evening
+ finale ending on the end screen; each evening choice going to the right person. A simulated Bluetooth controller
started the game, went through the intro and dialogue, and moved Wren. Phone screenshots of every new scene checked.
NOT tested: a real controller paired to a real phone (and whether the Claude app passes controllers through; Safari and
Chrome do); human play.


## Rebuild 2 — Story-led concept: Prologue through Chapter 2 (Nov 17, 2026)
Will's notes on Rebuild 1 and on Muse's slice: no outline of the story, no idea what to do or what was going on. This build
is a phone-playable concept (no Godot for now) of the design doc's first playable: **the Prologue through Chapter 2**,
told as a story from the first screen. Full outline of what the player sees: [`STORY.md`](STORY.md).

- **Intro:** 5 painted panels (placeholder art) tell who Wren is, the Deep, the High Lords' sparks, the bargain with
  Caelum, and the Iron King. Skippable.
- **Prologue, The Deep:** a nightmare that teaches movement only (design doc: no enemies until controls are taught).
  The Thorn Queen speaks as you run. Ends with the Deep Wyrm chasing you to the light (the doc's dodge-only escape).
- **Chapter 1, Ashes:** Caelum calls in the bargain and walks Wren to Starhaven, winnowing ahead in starlight. Paint the
  first mural (hold PAINT) and the dark street lights up house by house. Rooftop talk, Caelum bond heart 1. No enemies.
- **Chapter 2, The Five:** Bram's Training Ring (dummy combo), his thorn pit (pogo), Iris (optional talk), then three
  thorn sprites past the north gate. Gates open as Bram's lessons are passed. Caelum closes the chapter.
- **Always knowing what to do:** chapter cards with goals at the start and a "what changed" card at the end; a GOAL line
  showing chapter + current goal (with a counter for the sprites); dialogue with portraits for every story beat;
  control hints exactly where a move is first needed; **Menu > Story & goals** with the goal checklist, the story so far,
  and everyone you've met.
- **Places have their own palettes** (design doc): the Deep in pale greens and roses, the road at dusk in violet and rose,
  Starhaven in night blues and gold, the Thornwood in cold blue.
- **Controls:** more than 2 buttons, as asked: move stick, JUMP, STRIKE, DASH, plus a TALK / PAINT button that appears
  only when there's someone to talk to or a wall to paint. Keyboard W and gamepad Y do the same.
- **Saves** which chapter you reached (Continue on the title screen). All chapters are open from the title in this concept.
- Kept from Rebuild 1: all movement and combat feel, the TUNE panel, hit-stop, perfect dodge, checkpoints.
- Fixes found while testing: lanterns restore hearts only when first lit (thorns next to a lantern were free);
  thorn sprites stay within 5 tiles of home (one walked back through an open gate into town); the first thorn patch in the
  Deep is 3 tiles, not 4; the dialogue box sits at the top so it never covers the people talking.

Verified (`game/tests/feel.js`, 20/20): all 17 movement and combat checks still pass in the new rooms, plus an autopilot
that plays **each chapter start to finish with its dialogue clicked through**: Prologue (story, Wyrm chase, wake-up,
never caught), Chapter 1 (walk, mural, rooftop, the street lights up, Caelum heart saved), Chapter 2 (combo, thorn pit,
3 sprites, ends on the concept end screen). `game/tests/smoke.js` screenshots every story screen on a landscape phone
with no errors.
NOT tested: Will playing it on his phone; real iPhone Safari; a real gamepad; sound (there is none yet). Placeholder art.


## Rebuild 1 — The Training Grove: movement and combat feel (Nov 17, 2026)
A fresh start in this repo (`game/`), built from `DESIGN.md` and `BUILD-PLAN.md`. Muse's browser slice (v1 to v5 below) was
never committed here and was not reused. This build covers **Milestone 1 (movement feel)** and **Milestone 2 (combat feel)** only.

- **Play it:** open `game/starhaven.html` in a browser (phone held sideways, keyboard or gamepad). Rebuild with `python3 starhaven/game/build.py`.
- **The Training Grove:** one level, left to right. Each section teaches one move on a sign before it is needed:
  move, jump (3- and 4-tile gaps, a 2-tile step), double jump (a 5-tile wall), dash (a 10-tile gap that takes jump + jump + dash),
  daggers (a training dummy that counts your combo), pogo (a floor of thorns crossed by striking down on floating thorn buds),
  then the first enemy, thorn sprites. Lanterns are checkpoints. The far lantern ends the run with your time and stats.
- **Movement:** acceleration model (full speed in 3 frames, stop in 3), firmer fall than rise, a soft float at the top of a
  held jump, tap for a hop and hold for a full jump, coyote time (6 frames), jump buffering (7 frames), double jump,
  dash with 0.3 s invincibility and 0.5 s cooldown (from the design doc), jump out of a ground dash to keep its speed.
- **Combat:** 3-hit ground combo (third hit knocks back), 2-hit air combo, down-strike pogo that gives back your double jump
  and dash, hit-stop and screen shake on every hit, a small recoil when your blade connects. Thorn sprite: HP 4, dies in
  exactly 2 dagger hits (design doc), glows orange before it lunges. Dashing through a lunge is a **perfect dodge**: no damage,
  time slows for a second (design doc).
- **Getting hurt:** 5 hearts. Thorns and pits cost a heart and put you back on safe ground. At 0 hearts you are knocked out
  and return to the last lantern with full hearts, no other penalty (design doc: chill, not punishing).
- **Readability (the v1 lesson):** near-black play layer with moonlit edges, gold marks on every ledge that drops into a pit,
  crimson thorns, bright Wren with a gold scarf and a soft halo, sharp HTML text for the HUD and signs, an always-on GOAL line.
  Starhaven glows on the far horizon the whole way, so the goal is always in sight.
- **Phone:** landscape, floating stick on the left half, JUMP / STRIKE / DASH on the right, "turn your phone sideways" screen in portrait.
  Signs name the right buttons for touch, keyboard or gamepad.
- **TUNE panel** (menu > Tune the feel): live sliders for run speed, start-up, stopping, air control, jump and double jump
  height, rise and fall gravity, dash speed and length, pogo bounce. Saved on the device. "Copy numbers" copies them so Will
  can send exact feedback.
- **Placeholder art.** Shapes drawn in code, in the direction the design doc sets (Hollow Knight mood, pixel crispness).
  Real art waits for an art direction Will approves (BUILD-PLAN rule).

Verified (`game/tests/feel.js`, real input and physics, 18/18 pass): each gap needs exactly the move its sign teaches
(running falls into the 3-tile gap; one jump clears the 3- and 4-tile gaps; one jump can't top the wall, a double jump can;
jump + double and jump + dash both fall short of the 10-tile gap, jump + double + dash clears it); a scripted pogo run
crosses the thorn floor on the 3 buds without a scratch; thorns cost 1 heart and return you to safe ground; 3 presses = 3
hits with the finisher on the third; thorn sprite alive after 1 hit, gone after 2; its lunge costs a heart; dashing through
it is a perfect dodge with no damage; knockout returns you to the last lantern with full hearts; coyote time and jump
buffer work; an autopilot runs the whole grove start to end lantern (23.5 s). `game/tests/smoke.js` loads it on desktop and a
landscape phone with no errors. A real-time check moved Wren with real key presses and real touch drags.
NOT tested: how it feels in Will's hands on his phone, real gamepad hardware, iPhone Safari specifically, sound (there is none yet).

---
*Entries below are Muse's browser slice (v1 to v5). Its code is not in this repo.*

## v5 — Flame, the first court gift (Nov 16, 2026)
BUILD-PLAN Milestone 6. After mission 1, Caelum grants Flame (story: Wren carries a spark of every court's power, Flame first to stir). Cast: F/Q keyboard, Y gamepad, flame touch button (appears only after unlock). 3 moon-pips by the hearts after unlock; fireball costs 1 pip; pips refill slowly, faster on dagger hits. Fireball: 2 damage + burn, lights braziers in both scenes. Thorn wall deep in Thornwood blocks a raised alcove (5 bonus motes + brazier): daggers spark off with an "only flame can burn this away" hint; Flame burns it permanently (thornWallBurned saved). GOAL bar points to Caelum, then the wall, ahead of the paint goal. Save extended additively (flame + thornWallBurned flags, safe defaults) — old v1-v4 saves migrate forward, verified with a real v1 save.
Verified: autopilot ran the extended loop TWICE, 23/23 steps both runs, identical totals — all 13 v4 steps plus migration, unlock, cast (exactly 1 pip), dagger-hint, burn, alcove motes, brazier, second mission clear, real reload restoring flame + burned wall. Fixes during verification: removed a ground block at tx200 shadowed by the wall; moved a thorn sprite spawn out of the pillar steps (tx54 -> tx68); GOAL priority fixed so the unburned wall outranks painting.
NOT tested: flame touch/Y-button hardware feel, fireball feel at phone size, human alcove climb (bot proved reachability by run-jump).

## v4 — Complete the loop (Nov 16, 2026)
The full loop is now PROVEN by an in-game autopilot playing with real input/physics/combat (no teleports): fresh save -> intro -> Caelum -> gate -> full Thornwood (gaps, pillar, both enemy types, all 4 checkpoints) -> portal (+60, missionsDone=1) -> hub -> Mural 1 (exactly -50 starlight, celebration) -> real page reload -> Continue restored identical state. 13/13 steps passed (run: 22 motes, starlight 127 -> 77 after mural). Added: per-run mission tracking + mission-complete summary on return (starlight, motes, kills by type, lanterns), mural celebration (staged color bursts, banner, warmer street), mural-aware GOAL text for every state, clean mission replay (verified reset: motes/enemies/checkpoints/hearts/stats). v3 feel + v2 readability/story untouched; zero forbidden-universe references.
NOT tested: touch/gamepad hardware feel, human play at phone size. Will's play is the verdict.

## v3 — Feel pass (Nov 16, 2026)
BUILD-PLAN Milestones 1+2. Movement rebuilt on an acceleration model: full speed in 3 frames, stop in 3 frames (~2px slide), 4-frame turns with skid puff, new gravity curve (soft apex, firm fall, no float), tap hop 1.8 tiles vs hold jump 4.2 tiles, buffered dash, denser afterimages, momentum kept out of dash. Combat: 11-frame swings with near-instant hit start, attack buffering for the 3-hit combo, forward lunge, hit-stop ladder (3 normal / 5 finisher & pogo / 6 kill) with matching shake, stronger knockback. Pogo: -8.4 bounce, refunds double jump AND air dash, ring burst + readout. Landing squash, run dust, double-jump ring.
Verified by physics simulation: 4- and 5-tile gaps by run-jump; 6-tile gap needs double jump (145px) or jump+dash (128px) vs 96px gap; HP4 enemies die in exactly 2 dagger hits, matching the on-screen label.
Standalone check: full-file grep — zero lil Bottie / Sprouts / Pocket Lantern references. Starhaven is its own project.
NOT tested: real touch/gamepad hardware feel, full human Thornwood run, phone-size feel. Will's play is the verdict.

## v2 — Readability + story (Nov 16, 2026)
Answered Will's verdict on v1 ("really ugly, hard to see what's happening, no story explanation of what to do"). Quieter backgrounds, lit ground edges + gold pit warnings, bigger/bolder Wren and enemies with outlines/labels/health bars, pulsing motes, readable HUD pill, big gold prompts. Story: premise on title, HOW TO PLAY strip, 4-card intro, expanded Caelum dialogue, name tags on landmarks, always-on GOAL bar with objective arrow, location banners, plain-language event messages, pause screen restates quest + controls.

## v1 — Test slice (Nov 16, 2026)
Title, Starhaven hub (house rest/save, signpost, Caelum's 5 dialogue states, 3-panel mural wall at 50 starlight that brightens the city, gate), Thornwood mission (tutorial signs, 4/5/6-tile gaps, pillar, 4 lantern checkpoints, 40 motes, thorn sprites + winged spies, +60 end portal). Save: {v:1, starlight, murals, missionsDone, metCaelum} in local storage.
