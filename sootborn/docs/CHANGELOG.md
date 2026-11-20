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

---
Older entries: v0.66 to v0.70 are in "sootborn changelog archive 3" (`docs/CHANGELOG_ARCHIVE_3.md`); v0.56 to v0.65 in "sootborn changelog archive 2" (`docs/CHANGELOG_ARCHIVE_2.md`); v0.1 to v0.55 in "sootborn changelog archive" (`docs/CHANGELOG_ARCHIVE.md`).
