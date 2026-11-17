# SPROUTWILD — development log & changelog

*Standalone record of Sproutwild's development, kept by lil Bottie for
Will — meant to be handed to the next bot (hi, Claude) alongside the
game file and DESIGN.md. Started at Will's direction on 2026-11-14:
screenshots and a changelog from here on, every build.*

**Conventions**
- Every version gets an entry here: what changed, whose call it was,
  how it was verified, and which screenshots show it.
- Screenshots live in `shots/`, named `v<version>-<scene>.png` from
  v3.1 on. They are render-rig frames (the game's real draw calls,
  rasterized) that a human/agent actually looked at — not mockups.
- "Verified" means headless suites + viewed renders. A build is only
  *phone-confirmed* when Will says so on his iPhone; that status is
  stated honestly per version.
- The game: cartridge 3 of the PowerPocket Lantern trilogy file
  `Sprouts+Rootdeep+Sproutwild.html`. Save key `sproutwild-v1`.
  Rootdeep (cartridge 2) is a separate, closed project — see its own
  TIMELINE.md / FOR-CLAUDE.md.

---

## v9.1 · 2026-11-17 · bring the light: alphas, not gyms

Will: the valley was promised to sprouts and buddies 3000 years ago. After the Data Center was nuked the light was lost; sprouts bring it back to the buddies. The goal is cleansing the dark from the buddies and showing them the light so Bibi can lower the dome and we face Bottie once and for all. No gyms or trainer battles: just buddies and alphas to bring the light to. Sprouts should matter in battles. Light enough buddies and find the Sigils, and you face Bottie. Also: Erin's first pathing looked weird.

New `sw-light.js`:
- **The four alphas hold the four Sigils.** Bring an alpha the light (wear it down, or bloom it with sprouts) and it gives up its Sigil: BLOOMBOAR in the Meadow, the VERDANT SIGIL (opens the Hollow, Squire's Woods and the Wastes); PYTHORN in Crooked Hollow, the ROOT SIGIL; STONESQUIRE in Squire's Woods, the STONE SIGIL (two Sigils open the Shore, three Gloom Hollow); AURICORN in Gloom Hollow, the GOLD SIGIL. Each one gets the cinematic, in its own colours, ending on what it opens (`shots/v9.1-bring-the-light.png`).
- **No gyms, no trainer battles.** Trainers walk up and talk (new lines: KISS asks who keeps a promise for 3000 years; DEREK got chased off the road by wild buddies; MAMA's beach buddies hiss now; the DOME GUARDS say four Sigils and the King might listen). The gym buildings are lodges where the Ranger, Marcus and Erin point you at the alphas; the Peak's is BOTTIE'S TOWER, the one battle left, open once the dome is down.
- **King Bibi lowers the dome for four Sigils**, no fight: "Four Sigils. Four alphas, lit. ...The buddies are calm again? Fine. FINE. The dome comes down." Before that he tells you how many you have.
- **Sprouts matter in battle.** A sprout throw that does not bloom still burns away some of the dark ("Their light burned away some of the dark. (-24)" on the Meadow alpha). Wild fights end "The dark breaks! BLOOMBOAR settles down, calm."
- **Story text:** the intro opens on the 3000-year promise; Erin: "Cleanse the dark from the buddies. Show them the light."; Marcus: "Four alphas hold four Sigils, bro. Light them all, Bibi drops the dome, and we face Bottie." The Elder and the scene after your first crop point you at the alphas. Goal lines lead alpha to alpha, then to the King, then to Bottie's tower.
- **The Meadow alpha is Lv6**, from simulations: every starter at Lv6 with a Lv4 buddy wins 3 of 3 against it (at Lv7, two starters lost every time). Real time with the autopilot: cottage to the first Sigil in about 6.5 minutes (train to Lv6, lose once, rest, win), 0 flags, no page errors.
- **Erin's first walk** (Sunkeep to the south road) walked straight across the garden plots. She now follows a path, down the east lane and round the garden to the gate.
- Lab: 120 checks (new: trainers only talk; the Meadow alpha gives the VERDANT SIGIL; the King keeps the dome up without four Sigils and lowers it with them), twice clean.

**Not checked:** Sigils 2 to 4 played by hand (the Hollow, Squire's and Gloom alphas, the King's talk in real time); Bottie's tower as the final battle in real time; iPhone.

## v9.0 · 2026-11-16 · the story as it stands: Bottie is the villain

Will set the lore: King Bibi is the king, and he raised the IRON DOME when the light went out. When the light went out the buddies began to roam wild, and someone found that sprouts bring the light back to them and restore order. The villain is BOTTIE: he nuked the DATA CENTER, which glitched the Sproutwild simulation. We use sprouts to bring the light back, restore order among the buddies, and collect the four Sigils to restore order in the kingdom.

Every line that told the story was reworked to match, in the same voice (`shots/v9.0-intro.png`, `shots/v9.0-story-scenes.png`):
- **The intro, 8 slides:** the Lantern lit the valley and every buddy lived in good order; "Then BOTTIE nuked the DATA CENTER. The whole simulation glitched, and the Great Lantern cracked."; BOTTIE: "bzzt. CLANK. Oops. Anyway, the feed is mine now, gang."; KING BIBI: "Citizens! The light is out. Stay calm. I am raising the IRON DOME. Temporarily."; in the dark the buddies went wild; the light fell as seeds that grew legs, SPROUTS, and a sprout thrown at a wild buddy makes it remember; Erin: light the Lantern, calm the buddies, bring the order back; Marcus: four gyms, four Sigils, the kingdom back in order, and Bibi drops the dome.
- **The Lantern waking**, Marcus: "Bet King Bibi saw that from inside his dome. Peek out, your majesty. It is safe-ish."
- **Lantern Town**, the Elder: when the light went out the King raised his dome and shut the roads, and the buddies went wild; the Ranger kept one road open; four Sigils and the King will believe it is safe again.
- **After Bottie's visit**, Erin and Marcus: "That was Bottie. He's the one who nuked the Data Center." / the sim glitched, the Lantern cracked, the buddies went feral, the King hid in a dome / he wants the light for his feed, so we bring it back first / four Sigils, then up the PEAK to unplug him.
- **Bottie's arrival** now owns it: "The Data Center? Upgrade, gang. Your little sim runs on MY rules now. Clank."
- **King Bibi in Gloom Hollow** is the cautious King, not a villain: he raised the dome because somebody had to, asks you to prove the valley is safe, and when you win: "Fine. FINE. The dome comes down. Order is restored." Then: "Bottie is up there. Go unplug that robot, keeper. And knock first." His DOME GUARDS keep the roads shut "till the valley is safe".
- **The guide's VALLEY page** tells the same story.
- Checked: all 8 slides fit on a phone-shaped screen; the Elder, Erin/Marcus and the King's lines played and fit their boxes. Lab: 119 checks clean.

## v8.9 · 2026-11-16 · more story: the intro, the King, the cast; a full garden no longer blocks you

Will: keep improving what is there (no new places); a little more explaining in the intro; more scenes with the cast; explain the villain.

- **The intro is 8 slides** (was 3), one short line each, A to go on (`shots/v8.9-intro.png`): the Lantern cracks; its light becomes SPROUTS; the wild buddies go dim and sprouts can carry the light back; KING BIBI ("the light is weeks away. Hence, my IRON DOME"); the narrator on the IRON DOME posts walling the roads ("'Temporary,' he said. They never came down."); Bibi's motive ("A dark valley needs a strong king. Stay home. Stay dim. Trust the dome."); Erin's hope (Sunkeep's soil still grows; light the Lantern and his domes lose their grip); Marcus's plan (four gyms, four Sigils, each opens a road, then the King's dome).
- **Villain scenes with the cast** (`shots/v8.9-villain-scenes.png`):
  - When the Lantern wakes, Marcus: "Bet King Bibi saw that from behind his dome. Good. Let him squint, bro."
  - First visit to Lantern Town, the Elder: the town was the brightest street in the valley until Bibi's domes shut the roads, trade and the light; the Ranger kept its one road open.
  - Back at Sunkeep after Bottie's visit, Erin and Marcus on the King: thirty years of "weeks away"; "Every road he domes off is a road the light can't reach. A dark valley keeps him king."; four Sigils and they walk up to his dome.
- **Fixed: a full garden blocked the crop step.** In a real playthrough every plot ended up holding a grown sprout, so there was nowhere to plant the berries the goal asked for. The goal now says "Garden full: pluck a sprout, then grow BERRIES", and Erin's garden lesson says so too.
- **Fixed: scenes waited minutes behind chatter.** The cottage party waited about four minutes because the cast's chat bubbles and messages kept coming. Chat now holds back for a waiting scene, and a waiting scene goes before messages not yet shown. The gym scene needs only the cottage and a crop and can play wherever you are (it plays about 16 s after planting).
- **The placement screen says why a spot was refused** ("No room there... Try another spot."); it was hidden behind the screen.
- Full real-time playthrough, title to the first Sigil: about 13 minutes at a slow reading pace, 0 flags, no page errors; the Elder's and Marcus's Bibi lines play. Lab: 119 checks clean.

**Not checked:** iPhone. After planting, "BERRIES planted" stayed up 16 seconds in one run (longer than needed, not cut short).

## v8.8 · 2026-11-16 · training, the first Sigil, and the roads opening

Played from the cottage to the first Sigil in real time: the autopilot now trains like a player (SELECT battles on the nearest wild, rests at the Lantern post when its lead is hurt), then walks north and fights the Ranger.

- **Real-time result:** cottage to the first Sigil in about 4 minutes. BESSLING went from Lv5 to Lv6 in about 2 minutes of SELECT battles (two rests), lost the first try at the gym, trained a little more by fighting its way back, and won the second with BESSLING Lv6 + PEBBLIT Lv5 (the shared XP from v8.7 brought PEBBLIT from Lv2).
- **The first Sigil is a big moment now:** a cinematic in the fighter's style. Marcus cuts in ("FIRST SIGIL! That is my guy"), the Verdant Sigil slams down, then ROADS OPEN with arrows east to Crooked Hollow and south to Squire's Woods (`shots/v8.8-first-sigil.png`). In battle the Ranger adds "My barriers on the Meadow roads are down", and back in the world one line names both roads. The barriers on the map are gone.
- **Resting at a Lantern post shows that it worked.** The rest and the travel map opened together, so "The Lantern light mends your buddies" was hidden behind the map. Now, when anyone is hurt, A heals with a sparkle and the message ("Press A again to travel"); when nobody is hurt, A opens the map.
- **Lab:** the fiber fetch check clears nearby wilds first (the same fix as the bug check). 119 checks, twice clean.

**Not checked:** a person training by hand; the gym scene can still play after you leave home if you leave within seconds of planting; iPhone.

## v8.7 · 2026-11-16 · past the cottage: the road to the first gym

Played past the cottage with the autopilot (it now plants a crop, walks north to Lantern Town and fights the Ranger) and with battle simulations.

- **Fixed: Sunkeep Lv1 could never be finished.** The live mission check had lost two rules, so "Grow a crop on a garden plot" and "Have 3 buddies" never counted, even with berries planted.
- **The game now points you at the gym.** Nothing did after the cottage and the crop. Now a short scene (queued right after the crop): Erin and Marcus send you up the north road to Lantern Town, say the VERDANT SIGIL opens the roads east and south, and explain the matchup: "The Ranger's buddies are LEAF kinds, Lv5. EMBER hits leaf hard. DEW and PEB get hit hard." In the field the goal line reads "Ranger gym, north road: train to Lv6 (SELECT)" until your best buddy gets there, then "win the Ranger's Sigil". At home the base missions still show.
- **The first gym is fair now that it is on the main path.** Battle simulations (the real battle code, wild Meadow fights then the gym):
  - Old Ranger (Lv7 FERNFANG, Lv8 BLOOMBOAR): with BESSLING it took 14 battles to reach Lv7 and still lost every time; 25 battles to Lv8 won 1 of 2.
  - New Ranger (Lv5 MELONKIN, Lv5 FERNFANG): CUYAPUP and GRASSKIN win at Lv6 first try (7 to 9 wild battles); BESSLING, weak to leaf, wins first try at Lv7 (13 to 14 battles).
- **The whole team shares XP**: teammates still standing get 60% of the winner's XP ("PEBBLIT grew to Lv 4 too!"). Before, your second buddy stayed at Lv2.
- **BESSLING attack 12 -> 14.** It was strictly weaker than GRASSKIN.
- **Pluck grown garden sprouts.** A grown sprout resting in its plot can be plucked into your squad, freeing the plot, like Sprouts. (Erin already told you to pluck them.)
- Autopilot: can start right after the cottage (`fromCottage`), plants a crop, travels north, fights the gym, logs every goal-line change.
- Tests: 119 checks; one run in four had "the lead buddy fetches FIBER from a thicket" fail (a single A press, a wild can take the aim); the other three clean.

**Not checked:** a real player training by hand to the Sigil (the autopilot does not train); the gym scene plays at the next calm moment, which can be after you leave home if you leave within a few seconds of planting; iPhone.

## v8.6 · 2026-11-16 · learn by doing before the cottage; Erin walks round the lake

Will: keep play-testing and keep building learning into the onboarding.

- **Three things you do yourself, after Erin's Meadow tour** (before, she listed bugs and left):
  1. She walks you to a tree: "Homes need wood, and buddies get it. Face this tree and press A. BESSLING goes and chops it." She waits until it falls.
  2. "Timber! See the logs? Throw sprouts at them." She waits until every log has sprouts on it. That wood goes toward the cottage.
  3. She finds you a ladybug: "Ohio's own state bug. Face it and press A." Once it is in your jar she tells you where the jar is.
  Then: "You're getting the hang of this. Head home when you're ready. Marcus wants to build you a cottage. Don't let him pick the paint." (Saves already past the tour are not sent back through it.)
- **Erin walks round water and walls.** She used to walk straight across the lake to the lower field. She now follows a tile path: start to the lower field in 11 seconds, never off the ground.
- **Fixed: a line could play twice** when Erin's dialogue was held back for a message and then overtaken.
- Autopilot, title to the cottage party in real time: 501 s, 0 flags (nothing cut short, covered or talking over anything), no page errors; every Erin line appears exactly once. Lab: 119 checks clean.

Screens: `shots/v8.6-meadow-beats.png` (the tree, the logs being carried, the ladybug, the jar).

**Not checked:** iPhone. The autopilot still moves by position hooks.

## v8.5 · 2026-11-16 · pacing: nothing you are told disappears; a bigger Meadow; the gym first

Will played to the cottage: the side areas open too soon (the gym is north), the Meadow is tiny, Erin offers a buddy when you just got one, the PEB, the sprouts and the wild all happen at once, text pops up and is covered by a scene (right after the cottage, and early on), and the garden switches from one big bed to small plots.

- **Nothing you are told disappears before you can read it** (new `sw-pace.js`). A message stays up for at least its reading time; anything said meanwhile waits its turn. Scenes, the cottage party, the how-it-works card, the sprout-kind cards, Erin's dialogue and the cast's chat bubbles all wait for the message on screen, and messages wait for them. One voice at a time. The cottage moment now runs: Marcus's line, then the hearts line, then "A roof over Sunkeep!", then the party.
- **A bug this round's first version caused and the playthrough caught:** a held-back scene could be queued dozens of times (Erin's "Ready for the wilds?" repeated forever). Held scenes are now kept once each and play in the order they were asked for.
- **The gym comes first.** The roads to Crooked Hollow and Squire's Woods have a RANGER'S BARRIER until you win the VERDANT SIGIL in Lantern Town (north). Walking into it says so. Louie's "OLD STONES, SOUTH!" waits for the Sigil too.
- **The Meadow is bigger.** A Lower Meadow, 14 rows further south: a big field, a pond for water bugs, and a rocky corner. The south road now leaves from its bottom edge.
- **Erin's walk is spread out.** Your first catch waits in the big lower field, a real walk from the start; the buried PEB is out among the rocks in the south-east; the boulder wall and the bridge are back north. She takes a short breath between lessons.
- **Erin knows you have a buddy:** "BESSLING could use a friend. Wild ones live down in the tall grass. Follow me." (was "let's get you a buddy").
- **One garden from the start.** The opening drew its own big bed with three mounds over the garden, then it vanished. Now the garden is the same fenced plots all along: the first seeds land in the top row and grow there, like plots in Sprouts.
- **Bubbles stay clear of the top bars**, name tag included.
- **A new playtest tool** (`alt/tests/sproutwild/autopilot.js`): an autopilot plays from the title to the cottage party in real time, reading every caption before pressing A, and logs every text with how long it stayed up. It flags any message cut short, any message covered by a card or cinematic, and any two voices at once. Last run: title to the cottage party in 393 s, 0 flags, no page errors. (Before these fixes it caught the WOOD line covered by the card, Louie's berry line over Erin, and Marcus's bubbles over the hearts line.)
- Tests: 119 checks, twice clean (Meadow size, Sigil gates and the south road's new place updated).

Screens: `shots/v8.5-playthrough.png` (the opening garden, the walk south, the first catch in the lower field, Erin between lessons, the PEB among the rocks, after the cottage), `shots/v8.5-rangers-barrier.png`.

**Not checked:** the autopilot moves with position hooks, so real walking routes (around the lake) are not tested; iPhone.

## v8.4 · 2026-11-16 · a Lanternwisp caught by hand; name tags; Louie points south

Kept playing the new area and the last untried jar action.

- **Caught a Lanternwisp in real time.** In Squire's Woods the ring read "CATCH · needs 7", sprouts latched on ("Latched on! Fill the bar and it blooms."), and it bloomed into a new buddy with its cinematic ("LANTERNWISP joined you!") (`shots/v8.4-wisp-caught-jar.png`).
- **Used a bug from the jar with A.** A Ladybug became +2 berries, and the jar's footer said "+2 BERRY." Every bug action is now played: catch, night catch, use, sell.
- **Wild name tags no longer print over each other.** Two wilds close together printed "PEBBLIT Lv" over "LANTERNWISP Lv6", and the tag sat on the player when you stood just below a wild. Now only the nearest wild shows its full name (the others show "Lv7"), and the tag moves above the wild when you stand right under it.
- **Louie points the way south.** After your first catch, the first time you walk near the Meadow's south road (and have not been to Squire's Woods), he barks "SNIFF! OLD STONES, SOUTH!"
- Tests: 119 checks, run 3 times clean, no page errors.

**Not checked:** Louie's south hint in a real-time walk (checked by stepping the game), iPhone.

## v8.3 · 2026-11-16 · Squire's Woods: the south road goes somewhere

From Will's list: add a second new area, since the Meadow's south end was a dead end. New `sw-squire.js`.

- **Squire's Woods**, through the Meadow's south road (opens after your first catch, like the Hollow; Louie turns you back before that). After Squire's Castle in the Chagrin valley: a stone gatehouse Feargus Squire built in the 1890s for a castle he never finished, where people say his wife still walks at night with a lantern.
- **Two new creatures from that lore.** LANTERNWISP (EMBER/LUCKY), the lady with the lantern as a shy light sprite, always living here. STONESQUIRE (PEB), the gatehouse that got tired of waiting and stood up; it sleeps on the ruin's treasure as the alpha (Lv12).
- **The area** (30 x 20): wilds Lv6-9, a river that cuts off the south-west meadow until your sprouts build the bridge, and the ruin behind THORN VINES that only LEAF sprouts clear. Inside: SQUIRE'S LANTERN (80 petals and 3 ingots) and a buried DEW sprout. Two ore and two fiber spots for buddies.
- **First visit, one voice at a time:** the area banner, then Louie ("SNIFF... OLD STONES."), then one line about the gatehouse and the vines.
- **Louie's bubble is always readable.** Arriving at a top edge put it under the goal line, and the player could walk over it. It now stays below the top bars and is drawn after the people, at home and in the field.
- **Balance:** the alpha, fought 3 times per team: Lv9/8/8 won 2 of 3 with the last buddy on 6 HP; Lv11/10/10 won all 3; Lv13/12/12 won easily. Same shape as the Python. Kept.
- Tests: 119 checks (8 new: south road shut before the first catch, road leads there, arrive heading south, alpha guards the treasure, wilds Lv6+ with a Lanternwisp, sprouts build the bridge, LEAF sprouts clear the vines, the way back). Real time: walking the Meadow's south road reaches the woods in 1.7 s, and the first-visit lines come one after another.

Screens: `shots/v8.3-squires-woods.png` (the ruin's vine gate, STONESQUIRE and LANTERNWISP in battle), `shots/v8.3-arrival.png` (Louie speaks once the banner has gone).

**Not checked:** catching a Lanternwisp by hand in real time, the treasure carried home in real time, iPhone.

## v8.2 · 2026-11-16 · night bugs and Pip, played; garden confirmed

Will: "Keep playtesting and improving." Played the open v8.1 items.

- **Garden plots confirmed.** A planted plot grows on screen like the opening's seeds: planted, shoot at about 10 s, head at about 20 s, full bud at 30 s (`shots/v8.2-garden-grows.png`). The v8.1 doubt came from my test scripts, not the game.
- **The seed is easier to see.** It was brown on a brown plot. Now it is a pale seed with a dark rim.
- **Night bugs and selling, played.** At night in the Meadow a Luna Moth showed up and one A press caught it (its lore card shows). In Lantern Town: START, BUG JAR, SELECT, and Pip paid 25 petals. A second run did the same with a Lightning Bug for 8 (`shots/v8.2-night-moth-to-jar.png`).
- **The jar now says what happened.** Selling, using a bug, or trying to sell outside town only showed a message in the world behind the menu, so nothing visible happened. The jar's footer now says it for 3 seconds: "PIP paid 25 petals for a LUNA MOTH. You have 25." (`shots/v8.2-jar-sold.png`).
- **"LIGHTNING BUG" fits its jar row** (the yield reads "+1 LIGHT"; it was cut to "LIGHTNING ...").
- **The intermittent lab failure is explained.** Repeated 30 times, the bug-catch check failed only when a wild buddy stood next to the bug and took the aim (the ring shows which one A will hit, so the game is behaving as designed). The check now clears wilds first: lab 111 of 111 in 6 runs.
- Real-time playtest from the title: opening, berries, Lantern waking, starter pick (BESSLING), Marcus's buddy lines, Erin's walk to the south road, arrival in the Meadow. Captions logged with times: one voice at a time, each waits for A, nothing stacked. No page errors.

**Not checked:** the first catch and Erin's Meadow walk this round (verified in v8.0); turning a bug into a resource with A; balance; the second new area; iPhone.

## v8.1 · 2026-11-16 · Louie finds lost sprouts; one growing look

From Will's next-up list: recheck Louie fetching lost sprouts, and unify the two looks for growing sprouts in the garden.

- **Louie fetches lost sprouts.** Louie only went for a lost sprout after 2.5 seconds, but the sprout gave up and flew home at 3.5, so he almost never got there. Now he starts at 0.6 seconds, and a sprout he is running to waits for him instead of giving up. Real-time run: he reaches a sprout about 2 seconds after it lands, says "FOUND ONE!", and the sprout flies home to the squad (`shots/v8.1-louie-chases.png`, `shots/v8.1-louie-found.png`).
- **Sprouts no longer get stuck on walls.** A returning sprout pinned against a solid tile never came home: the sideways move was blocked, but the up-down move (zero distance) still counted as moving, so the "stuck" timer never ran. Now a blocked sprout flies home after 0.8 seconds.
- **Garden sprouts grow like the opening's seeds.** Opening seeds show a seed mound, a shoot, then a leafy head. Garden sprouts used to pop in as a tiny stem, then a yellow bud, and a planted seed showed as one coloured dot. They now share the same drawing (one function), so a planted plot shows a mound, then a shoot, then a head, then the full bud at 30 seconds (`shots/v8.1-seeds-grow.png` is the opening's real-time frames, same drawing).
- **Louie's "FOUND ONE!" bubble stays on screen.** It only clamped at the left edge, so it ran off the right when Louie fetched something near the edge.
- Tests: 111 checks. Headless stepped check of Louie's fetch at 70, 110, 160 and 240 px: every sprout comes home (160 px was stuck before the wall fix). Real-time from the title through the opening: intro, Louie's berry, the three seeds growing, plucking them, the Lantern moving on. No page errors.

**Not verified:**
- Garden plots in real time. In my frames a planted plot showed its soil mound and a glint, but I could not confirm the stalk and head on that tray, and main behaved the same in my harness. Check on the phone before trusting it.
- The lab check "a sprout thrown at a bug catches it" failed in 2 of 7 runs on this branch (intermittent, random bug positions; the `main` build passed 4 of 4 later, and its first baseline run also had one unnamed failure). Not explained yet; see KNOWN-ISSUES.
- Night-only bugs and selling bugs to Pip: not played this round. Balance, and the second new area: not started.
- Nothing has been checked on an iPhone.

## v8.0 · 2026-11-16 · an opening you earn

Will's notes: the first sprouts popped up by the Lantern and then came from a garden nobody explained; things were explained too fast and one message vanished almost at once; in the Meadow Louie talked about catching and then Erin arrived, which was confusing; Erin should lead you out after the base basics and hold your hand; the first battle could start by accident; some menus were cut off; growing sprouts should look like they grow.

New `sw-open2.js`:
- **Earn the first sprouts.** Sunkeep starts dark. Erin and Marcus explain the Lantern runs on what grows; Louie finds a berry, carries it to the Great Lantern, and it flickers. Three seeds arc from it into the garden.
- **Sprouts grow where they will keep growing.** The first seeds land in the garden plots and visibly grow: seed, shoot, then sprout, before you can pluck them ("GROWING" if you try early). The goal line follows along (Watch Louie, The sprouts are growing, Pluck the sprouts in the garden). The wake scene now says the lit Lantern lets the garden grow on its own.
- **Erin walks you out.** After the base lessons she says "Ready for the wilds? Stay close!" and walks you down to the south road, waiting if you fall behind, then sends you through.
- **One voice in the Meadow.** Louie's Meadow scene is gone; Erin meets you instead and walks you to a calm Lv2 wild buddy that stays put and has the grass to itself. She explains the bar, you fill it, and the first catch always blooms. Before that first catch no battle can start: no battle prompt, no SELECT fight, and a wild that shakes off your sprouts just waits for more instead of fighting. After it, Erin explains SELECT battles, then carries on with the PEB, the boulder wall, the bridge and bugs.
- **Messages stay up long enough to read**: every message's time now scales with its length.
- **Menus**: the work board lists missions as rows instead of a cramped footer, the stale AXE/PICK counts are gone, the missions show the current names, and Erin's keeper line fits. "An EMBER sprout" reads properly.
- Tests: 111 checks pass. Real-time run from the title through Louie's berry, the seeds growing, plucking, berries, the wake, the starter, the cards, Erin's escort to the south road and the guided first catch.

## v7.9 · 2026-11-16 · bugs, Erin's Meadow walk, sprout kinds one at a time

Will's ask: a bug collecting system whose bugs make resources or trade for currency; more hand-holding through the first area (the bridge, PEB as a special sprout); sprout kinds introduced slower; more lore; characters walking you places.

- **Bugs** (new `sw-bugs.js`). Eight bugs from Ohio summers live in the field areas, each in its own habitat (grass, water, trees), some only at night: LADYBUG (the state insect), WOOLLY BEAR (Vermilion's festival), LIGHTNING BUG, MAYFLY (Lake Erie swarms), CICADA (the 17-year brood), HELLGRAMMITE (under Cuyahoga stones), LUNA MOTH, MANTIS. Face one and press A: a sprout catches it ("CATCH LADYBUG"). The first of each shows its lore.
- **Bug Jar** in the START menu: shows what you have found and where the rest live. A turns a bug into its resource (berries, fiber, wood, ore, a heart, or light for the Lantern); SELECT sells it to PIP for petals, in Lantern Town only.
- **Erin's Meadow walk** (new `sw-walk.js`). The first time out, Erin walks you round the Meadow, waiting for you when you fall behind: the buried PEB sprout (pluck it), the boulder wall only a PEB can crack (do it), and the planks sprouts can build into a bridge (build it). Then she tells you about bugs and heads home. If you wander off she catches up; if you stall she offers to skip.
- **Sprout kinds, one at a time.** A card the first time you have each kind: its colour, what it is good for and a line of lore. The opening's three share one page added to the how-it-works card; PEB, ZIP and LUCKY each get their own when you first find them.
- Bugs close in front of you win the aim over things further off, like wild buddies do.
- Tests: 111 checks (2 new for bugs). Bugs, the walk and Louie's digging are switched off in the lab where they could take the aim at random; run four times clean.

Verified in real time: Erin's whole walk (PEB pluck, kind card, wall cracked, bridge built), the jar from START. Bug catching verified stepped (4 of 4).

## v7.8 · 2026-11-16 · Louie behaves like he does in Sprouts

Will's ask: make Louie's behaviour more like the Sprouts cartridge. Read cartridge 1's dog (`updLouie` in `console.js`) and brought its habits over (new `sw-louie.js`):

- **Walks at your side, not behind**, and holds still when you stop. When you walk toward him he stays put so you can reach him. A lone buddy now walks right behind you so it never covers him.
- **Pets.** Face him while standing still and press A, at Sunkeep or in the field: he sits with his ears up, hearts float off, and he says one of his Sprouts lines ("WOOF!", "MORE SCRATCHES.", "SQUIRREL?!", "IS IT PATE TIME?"). It is always the last prompt in the field, so it never takes A from a throw.
- **Digs up berries.** Every 40 to 60 seconds he digs near you and a berry pops out ("BERRY!") for the sprouts to carry home. The first time, a line explains it.
- **Fetches lost sprouts** ("FOUND ONE!") and **sniffs out wild buddies** near you ("SNIFF! A BUDDY!", or "GRR! BIG ONE!" when it is well above your level).
- **Speaks in short bubbles** over his head, like in Sprouts, and faces the way he walks.
- At Sunkeep he still runs ahead to point at the next goal during the opening.
- Tests: 109 checks (3 new: pet offered, pet makes him sit, he digs a berry), run three times clean.

## v7.7 · 2026-11-16 · goals say where things come from

Playtested the road to the Data Center past the base: ore veins in the Meadow work (the ring offers "SEND CUYAPUP · GET ORE"; a fetch gives 2 to 3 ore, enough for the Data Center's 2 ingots), and veins refill each time you enter an area.

- **The field goal line was stuck on the alpha.** Anywhere in the Meadow it read "An ALPHA sleeps here, guarding treas..." (cut off), hiding the home goal. Now it shows "ALPHA nearby: it guards treasure" only within a short distance of one; otherwise the home goal.
- **Base goals name their materials when you are short:** "Kiln: 8 stone, 4 wood (rocks, trees)", "Data Center: needs a kiln for ingots", then "Data Center: 2 ingots. Ore veins, then kiln", and "Buddies: build a Data Center for room" when the three-buddy limit is hit.
- Tests: 106 checks pass.

## v7.6 · 2026-11-16 · Sunkeep's grove grows back

Simulated ten minutes of home-buddy work after the cottage (stepped, three buddies, nobody leaving base).

- **The base economy stalled.** Sunkeep has 4 trees and 2 rocks. Home buddies cleared them in about two minutes and then stood idle for good; stone stopped at 6, while the kiln and the Data Center need 16 between them. Felled trees only came back if you left Sunkeep and returned, and home buddies only work while you are there.
- **Trees grow back after 75 seconds, rocks after 90**, with a sparkle and a one-time line explaining it. Same ten-minute run now: 18 stone, plenty of wood, buddies busy the whole time.
- The plot test now clears a plot itself instead of relying on one being empty (the garden can fill every plot given time).
- Tests: 106 checks (1 new), run twice clean.

## v7.5 · 2026-11-16 · pick a fight; python checked

- **SELECT picks a fight.** A always throws at a wild you can catch, which left no way to battle a weak one for experience (notes item 16 and v7 item 18). Now, with a wild targeted close by, SELECT starts the battle. The ring label says so: "CATCH · needs 3 · SELECT: fight". Away from wilds SELECT still cycles the sprout kind. The console button label for Sproutwild reads "select" (was "kind").
- **Python balance checked** after the v7.4 change: a Lv7/5/5 team beats it narrowly (starter fainted, one buddy half health); a Lv9/7/7 team beats it comfortably. Kept as is.
- Tests: 105 checks (1 new), run twice clean.

## v7.4 · 2026-11-16 · base goals match the new systems; Crooked Hollow played through

- **Base goals rewritten.** They still asked for "deploy a sprout worker" and a tinker bench first. Sunkeep Lv1 is now: cottage, a crop on a plot, three buddies, a kiln. Lv2: Data Center, five buddies, one Sigil, a bench. "Have N buddies" replaces "catch N species", which could not be met with duplicates under the three-buddy limit.
- **A Melonkin is always in the Hollow when you arrive**, and it is the most common wild there. (In a first run none appeared among the four starting wilds.)
- **The python is a real fight.** Lv11 (was 9), with a rock move in place of a defence buff, after a Lv7 fire starter beat it without taking a hit.
- **Goal line in the field**: names the area's sleeping ALPHA when there is one, otherwise shows the home goal as "Home: ..." so it fits.
- Verified: 104 lab checks; real-time Hollow run (Melonkin caught with six sprouts, join card, alpha prompt). The tougher python has not been fought again since the change.

## v7.3 · 2026-11-16 · the opening, timed end to end

Ran the whole chain in one go, title to the garden lesson, with real key presses: every scene hands off to the next (intro, berries, Lantern waking, starter reveal, how-it-works card, buddy lesson, Meadow, first catch, build lesson, cottage, party, garden lesson). About 200 seconds in total, 77 of them watching.

- **Lantern-waking scene is shorter.** It was the longest stretch at 16 seconds. Two captions cut (the how-it-works card now covers "four deliveries grow a sprout").
- **Crooked Hollow is shut until your first catch.** Its wilds start at Lv4, which three starter sprouts cannot catch. Louie turns you back at the east road and says why.
- **Buddies trail behind you** in a staggered line instead of three abreast, so narrow paths are less crowded (notes item 12).
- Test helper no longer picks random moves, which made one long battle test flaky once starters had a non-damaging move.
- Tests: 104 checks, run four times in a row clean.

## v7.2 · 2026-11-16 · explaining the game, and starters that grow up

From `PLAYTEST-NOTES-v7.md` (item numbers in brackets).

- **"How Sunkeep works" card.** One screen, once, right after your first buddy joins: THROW, CARRY, CATCH, BUILD, SIGILS, one line each. A closes it.
- **Starter evolutions** [34]. At Lv16: CUYAPUP becomes CUYAFLARE, BESSLING becomes BESSIE (the lake monster herself), GRASSKIN becomes GRASSMAN. Higher stats and both job skills go up a level. New art for all three.
- **Reveal tells you why to pick** [13]. Rows are now LEGEND, PICK IF, JOBS, OWN MOVE, GROWS TO.
- **Top-bar counters** [9] are hidden during the opening, when there is nothing to count. Each one is explained in a line the first time it matters (wood, stone, petals in town, hearts).
- **One name tag at a time** on the starter pick [10]: only the buddy you are nearest shows its name.
- **Wild buddies show their name** with the level when you are close [11].
- **Cottage goal says why** [14]: "COTTAGE (START, BUILD): a roof for buddies".
- **Night goal** [16]: with a cottage, the goal line at night says to sleep there to skip it.
- Tests: 103 checks (2 new). Real-time capture of the starter pick, the reveal, the card and the three evolved sprites.

Still open from the notes: 12, 15, 18 to 21 (old list), 26 to 33 and 35 (v7 list).

## v7.1 · 2026-11-16 · the cottage party cinematic

Will's ask: after the cottage is built, a cutscene of Will and Marcus celebrating with the rig, Marcus yelling "see one, send one, my J", done like the fighter's finishers and intro.

- Full-screen cinematic (`g4dab`) that plays once, the first time a cottage stands at Sunkeep, before the garden lesson. About 8 seconds; A skips after the first beat.
- Built in the fighter's super cut-in style and with the fighter's own Will and Marcus art (portraits and full-body poses from `knockout.js`):
  1. Marcus portrait cut-in on a slanted gold band: ROOF RAISED.
  2. The two of them either side of the rig, torch on the banger, a HEATING bar that fills to READY.
  3. Marcus's rip on speed lines, smoke across the screen, and the line slammed on in three hits: SEE ONE, / SEND ONE, / MY J!!!
  4. Will's cut-in from the other side (YOUR TURN), a bigger cloud, three *COUGH* tags.
  5. The dap with an impact burst, an S "SESH RANK" splash, and Louie sneezing.
- If the fighter module is ever missing, a simpler in-world version of the scene plays instead.
- Verified: 101 lab checks; real-time capture of every beat on a phone-shaped screen.

Shot: `shots/v7.1-cottage-party.png`.

## v7.0 · 2026-11-15 · Ohio starters, the reveal, Data Center, garden plots, Crooked Hollow

Will's brief and the research behind these choices are in `DESIGN-v7.md`.

- **Three new starters** from north-east Ohio lore: CUYAPUP (EMBER, the burning Cuyahoga), BESSLING (DEW, the Lake Erie monster), GRASSKIN (LEAF, the Grassman). Higher stats than common buddies, two job skills each, a move only they learn at Lv8, and they never appear in the wild. The old trio are ordinary wild buddies now.
- **Starter reveal.** Greeting one plays a short sequence: shadow slides in, flash, name, then legend, jobs, moves, its own move and stat bars, one line at a time. A skips, B looks at the others.
- **Data Center** building (8 stone, 2 ingots) stores 12 more buddies. Without it you can keep three in total: the catch prompt, a thrown sprout and SWARM in battle all say so.
- **Garden plots.** Stand at a plot and press A to choose what it grows: sprouts, berries or fiber reeds. Home buddies with WATERING or PLANTING speed growth and harvest; the pick is carried to the Lantern. The fourth quest step is now "grow berries on a plot", with a short lesson from Erin and Marcus. The Garden Bed building is retired (old ones keep working).
- **Building is slower**: about 9 seconds plus a little per unit of cost, faster with helpers.
- **Crooked Hollow**, a new area east of the Meadow: Lv4 to 7 wilds, ore and fiber, a Lantern post, MELONKIN (the Melon Heads) in the grass, and PYTHORN (the Peninsula Python) asleep on a circus trunk as the alpha.
- Battle menu always opens on FIGHT.
- Tests: 101 checks (12 new for starters, the buddy limit, plots and the Hollow). Real-time runs: the starter pick, plots and Data Center at base, the walk into the Hollow and back, and the whole first loop from the title to the cottage.

Shots: `shots/v7.0-starter-reveal.png`, `shots/v7.0-plots-and-datacenter.png`, `shots/v7.0-crooked-hollow.png`.

## v6.11 · 2026-11-15 · fixes from the v6.10 playtest notes

Worked through `PLAYTEST-NOTES.md` (item numbers in brackets).

- [1] After a faint, "SEND WHO?" starts on a healthy buddy; fainted ones read FAINTED, the one in play reads OUT NOW.
- [2] BUDDY is greyed out when nobody else can fight, and says so instead of opening a dead list.
- [3] Gym door prompt fits: "A: BATTLE (team Lv7+) · B: LEAVE", which also gives the recommended level.
- [4] The gym sign hangs on the building front, clear of the top bar.
- [5] Town requests explain how to get each resource (berries from bushes, buddies chop trees, and so on).
- [6] Town banner fits on one line.
- [7] First gym opens with Lv7 and Lv8 (was Lv9 and Lv10).
- [9] The first time your move is "not very effective" and you have someone to swap to, a tip explains BUDDY.
- [10] Move list marks strong moves in green with "+", weak ones in red with "-", and the description line says "STRONG vs" or "WEAK vs" the foe.
- [11] Away from Sunkeep the goal line is local: the gym in this area, or "At Sunkeep: ..." for home goals.
- [13] With your lead buddy under a quarter health in the field, the goal line says to rest at a Lantern post.
- [14] On the starter pick, the arrow follows the buddy you are nearest, matching the A prompt.
- [17] The bench's "SPROUT JOBS: axe & pick crews" row is gone.
- Marcus's story slide is in his voice.

Not done: [12] crowding on narrow paths, [16] choosing to battle a weak wild, [18]-[21], [22] needs Will's go-ahead.

Verified: 84 lab checks; real-time gym run (door prompt, move tags, forced switch, loss sends you home).

## v6.10 · 2026-11-15 · first ten minutes, played as a Pikmin / Pokemon / Palworld fan

- **A trainer ambushed new players.** KISS stood exactly where the new path from the gate meets the main road, so the first walk into the Meadow could be a two-buddy trainer battle before the first catch. She now stands up the road by the town gate, and trainers leave you alone until you have caught your first buddy.
- **A throws, even beside a wild.** Pressing A next to a wild used to start a battle instead of a throw. Now A throws whenever your sprouts can catch it. The battle prompt only shows for wilds too strong to catch (or when no sprouts are with you), and the ring label says so: "Lv5 · needs 6 sprouts · walk up to battle".
- **Wild buddies wear a level tag** when you are close, so a wild Drizzlet never looks like your own.
- The first-latch tip is one short line instead of a four-line box over the catch.
- Checked and left as is: the starter card (type, stats, moves, work skill, evolution), the join card, the bloom sequence and the NEW BUDDY card.
- Verified: 84 lab checks; real-time replays of the starter pick and several catches.

## v6.9 · 2026-11-15 · opening pass for first-time players

Will's note: keep playing the beginning; onboarding for new players and quality.

Replayed from the title screen as someone who has never seen the game and fixed what would trip them:

- **Which one is me?** A "YOU" tag sits over your keeper until you pluck the first seed.
- **How do I move?** Marcus's first line now says to use the D-pad to walk, then press A.
- **Where do I look?** The guide arrow is twice the size with a dark outline, and the seed or berry it marks has a pulsing ring. If the target is off screen, the arrow sits on the screen edge and points the way (used for the south road after your first buddy).
- **Berries were at the far left edge** with Marcus cut off by the screen. Berries now sit just below the path in the middle; Marcus and Erin stand fully in view at the sides.
- **Goal line was cut off** ("South road: throw sprouts at a wild ..."). It now reads "Take the south road to the Meadow" at base and "A: throw sprouts at a wild buddy" in the Meadow.
- Verified: 84 lab checks; real-time replay from title to the Meadow on a phone-shaped screen.

## v6.8 · 2026-11-15 · the cottage is the buddies' home

Will's note: the cottage does not provide anything useful the way the game works.

It only offered a heal (already free at the Great Lantern) and a tonic shop. Now it is what turns the base on:

- **No roof, no workforce.** Buddies left at home just wait until a cottage stands. The work board says "needs a cottage". Once it is built they get to work.
- **Home buddies gather on their own.** With nothing else to do they fell base trees and crack base rocks, then carry the logs and stone to the Lantern, so the cottage pays off the moment it is finished. Skilled buddies are faster. They still prefer production buildings and the bench when those have work.
- **Sleep.** The cottage menu's first row is SLEEP: at night it skips to morning (next day) with a fade, heals everyone including buddies at home, and the workers start again. By day it is a quick nap that heals.
- Marcus and Erin's lines and the build menu text explain the roof rule.
- Verified: 84 lab checks (two new: no work without a cottage, work with one); real-time run: buddies idle, cottage built, both start chopping and hauling, sleep at night wakes on day 2.

## v6.7 · 2026-11-15 · Marcus sounds like Marcus, and the first catch is fair

Will's notes: keep working on onboarding; Marcus should talk to the keeper the way he does in the other games.

- **Marcus's voice.** Rewritten from his lines in Sprouts and Rootdeep: "bro", "See one, send one", "That's my guy", "Dap me up", Waterworks dreams, and taking credit ("I supervise", "You built this place. I helped. A little. A lot."). Covers his opening captions, tips and idle chatter.
- **Build lesson.** Coming home after the first catch, Marcus celebrates, the camera shows a cottage spot, and he explains START, BUILD, COTTAGE, 8 wood, and how to get wood (buddy chops, sprouts carry). Erin explains that only the lead buddy walks with you at base and the rest find work.
- **First catch is fair.** Playtest found Lv5 wilds in the grass right by the new gate: three sprouts cannot catch them and a Lv5 starter can lose and get sent home. Now wild levels climb with distance from the Lantern post, wilds stay at the lowest level until your first catch, and the first catch has at least 80% odds once the bar is full.
- **Catch label** now reads "CATCH Lv2 · needs 3 sprouts" so you can tell what is out of reach.
- If the keeper you picked is the one speaking in a scene, someone else says the line.
- Verified: 82 lab checks; real-time run of the first loop (opening, catch on first try, home, build lesson, chop wood, cottage built) in about three minutes.

## v6.6 · 2026-11-15 · clear opening, Meadow faces the right way, no tools

Will's notes: tools are not needed now the game is in action; leaving the base and arriving in the first area do not line up; the beginning is still cluttered and important things are covered.

- **Opening told in captions, field left clear.** The floating speech bubbles in the opening are gone. Erin and Marcus speak one line at a time in the bottom caption box while the camera shows the thing they mean (the seeds, then the berries). A small yellow arrow bobs over what to do next (seed, berries, buddies). Erin and Marcus stand out at the sides, away from the seeds, berries and buddies.
- **Meadow orientation.** You leave Sunkeep by the south road and now arrive at the Meadow's north-west gate, still heading south, with the Lantern post beside you and a path down to the main road. Walking north out of that gate brings you in at Sunkeep's south gate. The old gate at the bottom of the Meadow is closed off.
- **Tools removed.** AXE and PICKAXE are gone from the bench. Buddies do the chopping and mining; the bench keeps tonic, seed pouch, climbing rope, lantern oil and lucky charm.
- Verified: 82 lab checks (one updated for the new gate, one given more time since any buddy can now take a job); real-time run of the whole opening, the trip to the Meadow and the walk back.

## v6.5 · 2026-11-15 · the base actually works when you leave buddies home

Playtest of the crafting chain (kiln, bench, tonic) with real keys.

- **Home buddies stood idle.** A buddy only worked a building if it had the matching skill, so a Pebblit and a Fernfang left a kiln full of ore untouched and nothing was ever crafted. Now any buddy takes any job at a slow rate; skilled ones are much faster and still get first pick. Same for the bench queue.
- **Sprouts help at the bench.** Stand at the bench with your squad and each sprout with you speeds the craft (sparks show it). The bench text now says so instead of "CRAFT workers at home: 0".
- **Kiln yield** is 1 ingot per ore (2 with a skilled worker) instead of 2 to 3, since anyone can run it now.
- Buddies put down tools at night and sleep (they kept working once any job was allowed; caught by the lab).

Verified: 82 lab checks; real-time run where two unskilled buddies smelted ore and built a tonic.

## v6.4 · 2026-11-15 · catching works early, buildings rise

Playtest past the opening (real keys, phone screen): Meadow catches, buddy and sprout gathering, home, cottage and bed.

Found and fixed:
- **First catches were impossible.** A Lv2 wild needed 4 sprout points and you start with 3, so every throw ended in a fight and the base quests never unlocked. Now a wild needs level + 1, and a buddy standing near the wild adds 1 ("pins it"). Base catch odds dropped a little so it is not automatic.
- **Aim grabbed a rock instead of the wild you faced.** Wilds in the cone are now preferred over buddy jobs beside them. (A bug in the first try made A lock on to far-off wilds; caught by the lab and fixed.)
- **Meadow was crowded with wilds** (5 plus respawns, chained fights until the buddy fainted). Now 4 at arrival and at most 3 after.
- **Buildings now get built.** Placing one raises a scaffold: three of your sprouts hop on it with hammers, base buddies walk over to help (more helpers, faster), a percent shows above it, and it finishes in a burst after about 4 seconds. The quest step only counts it when it is done.
- **Text pile-up at base.** Marcus kept saying "South road" and "Cottage first" after those were done; the built message stacked a second box. Tips now stop once done, and "BUILT!" floats over the building instead.

Verified: 82 lab checks; real-time runs of the Meadow (3 catches, fiber and wood gathered) and the base build flow (cottage, bed).

## v6.3 · 2026-11-15 · buddies go where you aim, and the game explains itself

Will's notes: still could not throw buddies with the auto target; the opening is overlapped and confusing; the garden is never explained; wants in-game cutscenes and animations.

- **Buddy sending fixed.** The ring only offered a buddy when it had the matching skill (LUMBER for trees, MINE for rocks), so a Drizzlet or Cindercap starter never got an offer. Now any buddy can be sent at a tree or rock; skilled ones are faster and are picked first.
- **Works at Sunkeep too.** The lead buddy follows you at base on the same party code as the field, and A sends it at base trees and rocks. (Other party members stay base workers.)
- **In-game scenes** (new `sw-scene.js`): camera pans with a caption, A next, START skips.
  - The Lantern wakes: look up at it, pan down to the garden as sprouts pop out of the soil, Erin explains the garden and plucking, Marcus explains that four deliveries grow a sprout. The three buddies walk in only after it ends.
  - First buddy: Marcus pans to a tree and explains face it, press A, the buddy goes.
  - First Meadow visit: Louie pans to a wild buddy in the grass and explains throwing sprouts to catch it or walking up to battle.
- **Seed of light**: when the Lantern grows a sprout at base, a seed arcs from the Lantern to you.
- **Opening spacing**: Erin and Marcus stand further from the seeds, you start lower, name tags hide until the opening is done, and nobody stands on top of you.
- Goal text now says to throw sprouts at a wild buddy (it still said tire and SWARM).
- Tests: scene switch for the lab (`SWF().noScenes`), 82 checks pass. Real-time replay of the whole opening on a phone-shaped screen passes.

## v6.2 — the party walks with you; capture in the open (Opus)

From Will's notes: the A button only ever chose between sprouts; buddies should be targets too, the whole party should follow, things looked big and cramped, and the capture should be better and work out in the field.
- **Your whole party (up to three buddies) walks with you** outside Sunkeep (`sw-party.js`). At home the ones behind your leader still work the stations.
- **A sends buddies the same way it throws sprouts.** The ring locks on to trees, rocks, ore veins and fiber thickets too, and sends the buddy best at that job: LUMBER for trees, MINE for rocks, anyone for ore and fiber (the right kinds bring more). Several work at once. B calls them back with the sprouts. You only chop by hand when no buddy in the party can.
- **Capture in the open field.** Throw sprouts at a wild buddy and they latch on and glow, with a bar showing how close you are. Enough of them (2 + its level; kin count double) and it blooms and joins you right there. Too few for too long, or a bad roll, and it breaks free and the fight starts.
- **The capture in battle has suspense:** the sprouts hop on, it wobbles three times with a flash and a rising note each time, then it shrinks into the light and the sprouts dance where it stood. Or it breaks free and throws them clear.
- **More room on screen.** Buddies in the field are drawn at three quarters size (alphas at 1.5x instead of 2x). The party walks in a line behind you; the sprouts trail further back.

Tests: `alt/tests/sproutwild/field-lab.js` 82/82, three runs in a row (6 new: three buddies follow, the right buddy is sent to a tree and a rock at the same time, both finish, sprouts latch on to a wild, it is caught or turns to fight).

## v6.1 — playtest fixes after the fusion (Opus)

Played the Meadow stretch in the five-cartridge console.
- **Crossing between Sunkeep and the Meadow bounced you back.** Holding the D-pad across the border landed you on the far side right next to the exit, still walking into it, so you were sent straight home. Now the way back is shut until you let go of the D-pad once (or walk well away).
- **B on Sproutwild's title ejects to the cartridge shelf** (it saves first). From inside a game: START, SAVE AND QUIT, then B.
- **Lantern posts in every sector heal your buddies** when you use them, like a Pokémon Center. Measured first fights: a Lv5 starter loses 5 to 23 HP of about 55 per Meadow fight, so two or three fights before needing one.
- **Chopping by hand is less of a grind:** 5 swings a tree instead of 15. A buddy with LUMBER or MINE is still far quicker.
- The shelf D-pad reaches the fifth cartridge.

Tests: `alt/tests/sproutwild/field-lab.js` 76/76.

## v6.0 — one button, like Sprouts; who chops what; quieter people (Fable)

From Will's notes and a real-time playtest of my own.

**Controls now match the original Sprouts.**
- A does everything. Face something sprouts can work and the ring locks on to it; A throws, and holding A keeps throwing. B only calls them back (which is what the handheld's B button says).
- The ring locks on in a wide cone in front of you and to anything right beside you, so you do not have to line up.
- The right kind of sprout steps up by itself: PEB for heavy loads, DEW for berries, the matching kind for a gate, the buddy's own kind for a wild. SELECT overrides for a few seconds. If the squad lacks the kind a gate needs, the ring turns red and says which.
- Holding A spreads the squad: a load that already has enough carriers is passed over for the next one.
- With nothing locked on, A throws nothing. Idle sprouts walk back by themselves after a few seconds.

**Who does what.**
- Sprouts pick berries and carry. They no longer chop trees or crack rocks.
- Trees are felled by a buddy with LUMBER (leaf kinds), rocks by a buddy with MINE (rock kinds): stand next to one and press A. Or do it yourself by hand, slowly.
- What a buddy fells drops as a log or stone for the sprouts to carry home.

**People talk less.** One speech bubble at a time with a pause between them, each a single short line. Idle chatter starts only after the opening and comes every half-minute or so, when you are nearby.

**Found in my playtest.**
- The opening stalled: all three sprouts piled onto one berry. Fixed by the spreading above; the Lantern now wakes about 12 seconds after the first throw.
- Louie stood where you greet your first buddy, so A petted him instead. Louie and people are now the last thing A considers.
- A stray press of A threw sprouts at empty ground and left them behind. Fixed by throwing nothing without a target.
- The three dim buddies now walk in toward the light instead of appearing.
- KISS ambushed you three steps into the Meadow, before your first wild fight. He now waits near the north gate.
- The ring's label read "1 · 1" for berries. It names the load and its weight now.

Tests: `field-lab.js` 76/76.

## v5.9 — its own letters, and people who talk (Fable)

From Will's iPhone screenshots.

**Text.** On the iPhone every label sat a few pixels low and spilled out of its box: menu rows, name tabs, signs, the bottom bar. The game was using the device's monospace font, which is placed differently on iOS than on the machine the layouts were made on. Sproutwild now carries its own pixel font (`sw-text.js`), so every device draws the same pixels in the same place. Sprouts and Rootdeep keep the system font.

**The start is taught by people, in the world** (`sw-cast.js`).
- The story before the game is three scenes instead of six.
- You load in at the Lantern with control straight away. Erin and Marcus walk up and talk in speech bubbles over their heads; Louie barks. They react to what you do: the first pluck, the berries, the Lantern waking, your first buddy, your first catch.
- After the opening they keep wandering the base, turn to look at you, and quip about what is going on: a new building, workers, ore, fiber, a Sigil, night.
- Louie answers in a bubble too. Bubbles never overlap; one that has to move away from its speaker gets a name tag instead of a tail.
- People are now the lowest priority for the A button, so someone walking past cannot steal it from what you are facing.

Tests: `field-lab.js` 72/72. `tests-fable/render-phone.js` shoots the opening at an iPhone-shaped screen.

## v5.8 — save files, and text that cannot clip (Fable)

Will hit an error and clipped text before the game even started. I could not reproduce an error with saves made by five older builds, an empty save or a deliberately damaged one, but three real weaknesses turned up and are fixed.

- **Save files.** Press A on the title for a file list. Three files: pick one to CONTINUE, pick an empty one for a NEW GAME, SELECT erases after asking. START > SAVE AND QUIT returns to the title. File 1 is the save older builds used.
- **Saves are cleaned on load.** Unknown buddies, buildings and sectors are dropped and missing fields filled in, so an old or damaged save cannot crash the game. (A damaged save did crash it before: a buddy the game did not know broke drawing.)
- **Clipped text.** Speech boxes were fixed at three lines. With a slightly wider font, which is likely what an iPhone uses, the opening story ran to a fourth line that was cut off. Speech boxes, message bars and area banners now grow with their text. Found by forcing a 12% wider font in the test browser.
- **Cloud save switched off in the page build.** The trilogy's cloud save asked the claude.ai page for storage it was never given; that may have been the error. Local saves are unaffected.

Tests: `field-lab.js` 71/71 (9 new for the save flow).

## v5.7 — after the first catch (Fable)

Found by playing on past the opening and looking at every screen.
- **Healing had no home early on.** Before you could afford a cottage there was nowhere to heal. The Great Lantern now has REST IN THE LIGHT.
- **First fights could one-shot your starter.** Before your first Sigil nothing takes more than 45% of its HP in one hit.
- **Ore did nothing.** The kiln now smelts ORE into ingots and sits idle without it. Axe and pickaxe upgrades cost ore. New CLIMBING ROPE (fiber + ore): climb ledges from below, which opens shortcuts and high ground in every sector.
- **You could teleport anywhere from the pause menu.** The pause map is now read-only. Travel is from a Lantern post or the Great Lantern, and only to sectors whose post you have walked to.
- **No direction after the tutorial.** The strip under the top bar now shows the next thing Sunkeep needs.
- **"Deploy 1 sprout worker" ignored buddies.** Missions count everyone working at home.
- **Lore leftovers.** The cottage no longer sells sprouts. The "Buddy Nursery" grew buddies from sprouts; it is now the Lantern Nook, where a dim buddy follows berries and light in. The keeper's guide is rewritten for how the game works now.
- **Small things.** The build cursor starts next to you. Buildings cannot block the lane to the south road or the camp fire. The placing prompt no longer sits on other text. Pause rows renamed MAP and WORK BOARD.

Tests: `field-lab.js` 62/62.

## v5.6 — the battle screen (Fable)

Same rules, new stage (`sw-battle.js`). Nothing here changes an outcome.
- A backdrop for each sector; buddies drawn on the pixel grid.
- Each "X used Y!" line plays: a lunge, a bolt in the move's colour, a white flash and shake on the target. That HP bar drains only after its own hit lands.
- Your keeper stands behind your buddy and your sprouts wait in a row. SWARM sends them hopping across to latch on; a bloom glows gold, a failed swarm gets thrown clear and those sprouts lie dazed.
- Wild buddies show TIRING and WORN OUT tags so you know when to swarm. Trainers show how many buddies they have left.
- Fainting sinks and fades; new buddies slide in.
- One panel style for text, commands, moves (with type and power), the swarm picker (KIN / GOOD / WEAK) and the party list (with HP bars).

Tests: `field-lab.js` 56/56, soak run OK.

## v5.5 — the loop makes sense (Fable)

Written after playing the opening from a fresh save. What was wrong: you spawned in an empty field, the first interaction was a five-row dog menu, then three pages of text and 15 seconds of watching sprouts carry apples, three starter buddies appeared for no reason, and a sprout was thrown like a ball. (`sw-story.js`)

**Why sprouts can take buddies.** Sprouts are Lantern light with legs. Wild buddies went dim when the Lantern cracked. Tire one out and your sprouts SWARM it: they latch on and bloom, it remembers the light, it joins you. Up to five of one kind go at once; kin blooms best. No sprout is used up; a swarm that gets shaken off sits out the rest of that fight.

**The opening is played, not read** (about a minute):
1. Wake at the foot of the dark Great Lantern. Three seeds glow in its roots. Pluck them: a squad of three.
2. Louie runs to a pile of berries. B throws the sprouts; they carry the berries to the Lantern.
3. The Lantern stirs. The garden wakes, the camp fire lights, three dim buddies creep toward the light.
4. Walk up and greet one. It is your first buddy.
5. The south road opens. Walk out to the Meadow.

**Who gathers what**
- Sprouts carry wood, stone, berries and treasure. Every four deliveries, at home or at a Lantern post, the Lantern grows a new sprout.
- Buddies fetch what sprouts cannot: ORE veins and FIBER thickets in every sector (A next to one sends your lead buddy; the right species brings back more). Wilds you beat drop ore or fiber instead of a free sprout.
- At home both work the stations, and the bench turns fiber into a SEED POUCH: the squad starts at 8 and grows by 4 per pouch, to 24.

**Sunkeep**
- You start at the Great Lantern and leave on foot by the south road, which joins the Meadow both ways. The blue gate arch is gone.
- The Great Lantern is reimagined: an old tree cradling a cracked lantern, dark until you feed it. It is the hub: grow the base, buy plans, see the work board, travel to any Lantern post.
- Louie is a dog again, not a menu. He runs ahead to whatever is next and waits for you. A pets him and he says one thing: the next step, or a tip. In the sectors he follows you and herds stray sprouts back.

Tests: `field-lab.js` 56/56 (15 new: the whole opening, swarming, fetching, the pouch, the south road).
Older suites: 4 of 23 pass (including the soak run). The rest script the old opening, Louie menu and gate, which no longer exist; they need rewriting or retiring, not fixing.

## v5.4 — Sunkeep at work, and one art style (Fable)

**Sunkeep runs like a Palworld camp** (`sw-base.js`)
- Buddies you are not adventuring with work at home, on screen: everyone in the box, plus party buddies behind your leader. They pick their own jobs.
- Every worker has work skills with levels 1 to 3: KINDLE (kiln), WATER and PLANT (garden bed, nursery), MINE (quarry), LUMBER (sawmill), CRAFT (Tinker Bench), HAUL, LUCK (extra yield). Species bring their own; Lv16 and 40 work XP each add a level.
- Sprouts you pin to a building work it and haul what it makes.
- Buildings now make real pellets that someone has to carry to the Lantern: a worker, or your own thrown squad.
- The Tinker Bench is a crafting queue: Tonic, Axe, Pickaxe, Lantern Oil, Lucky Charm. CRAFT workers build it; with none, stand at the bench and build by hand.
- Workers sleep at night around the camp fire. START > BASE is now the work board (who is doing what, and their skills).
- While you are away the old timed production tick still pays out for pinned sprouts.

**Art pass** (`sw-art.js`), aimed at the first areas you see
- One sprite builder for every human (keeper, Erin, Marcus, townsfolk, trainers, King Bibi), with four facings and a walk cycle.
- Nothing is drawn at a fractional scale any more; buddies sit on the pixel grid.
- Trees are outlined, cel-shaded in three tones with a hard cast shadow, and sway. Trees with fruit are the ones you can chop.
- Ground: grass in two-tone drifts with tufts, paths with a dark rim and pebbles, water with an outline and a shallow band.
- Buildings redrawn larger with outlines, smoke, fire, a spinning saw, progress bars. They sort in front of and behind you.
- Sunkeep: new Lantern shrine with banners, new Lantern Gate, a camp fire.
- Light and air: drifting cloud shadows, sun shafts, a warm grade by day, fire and lantern glow at night, butterflies and fireflies, a soft vignette.

Tests: `field-lab.js` 41/41 (7 new work-system checks). `tests-fable/render-base.js` for screenshots.
Older suites: 10 pass. sw17 joins the failing list because the bench menu it drives is now the crafting queue.

## v5.3 — Sunkeep joins the new engine; King Bibi's voice (Fable)

- **The squad works at home.** Your sprouts follow you around Sunkeep, B throws, hold B whistles, SELECT picks the kind. Thrown sprouts fell Sunkeep's trees and rocks and carry the pellets to the Lantern. Sunkeep keeps its own layout, buildings, garden and tutorial; the squad, throwing, carrying and path-home all run on the field engine.
- Replaced at Sunkeep: the SPROUT/BUDDY command toggle and "B sends your buddy to a node". Old follower trains are folded into the pouch on load.
- **King Bibi** no longer says "bzzt" (that is Bottie's). His lines are rewritten as satire of the man: the chart and the red line drawn in marker, thirty years of "weeks away", "everything is self-defense", the witch hunt, the new coalition by morning, the postponed trial.

Tests: `field-lab.js` 34/34. Older suites: 11 pass; sw12 and sw20 join the failing list because they test the two commands this version replaces.

## v5.2 — the first hour (Fable)

What you see before you ever leave Sunkeep was still the old game. This pass rebuilds it (`sw-front.js`).

- **Text no longer overlaps.** One HUD for Sunkeep and the field, laid out in fixed rows from the bottom of the screen: status row, then the A prompt, then messages. The stray "SEL: BUDDY" and "SIGILS" labels that sat on top of messages are gone. All dialogue uses one speech box with a name tab and its prompt on a separate row.
- **Title screen** redrawn: sunrise behind the Lantern, the logo, a parade of buddies and sprouts.
- **Opening story** redone as six animated scenes: the Lantern cracks, seeds fall and sprout, Erin at the dark lantern, a sprout taking command of a buddy, Marcus and the Sigils, King Bibi raising the Iron Dome with Bottie glinting overhead.
- **Cut-ins** ("joined you", keeper swap, Bottie's arrival) redrawn with rays, a name banner and the speech box.
- **Menus** restyled; long lists scroll instead of shrinking, and the description box holds three lines.
- **Sunkeep's ground** repainted: dirt lanes, a stone plaza under the Lantern, a fenced garden, flower beds, a forest edge.

Not done yet: Sunkeep still uses the old walker, so the sprout squad does not follow you at home, and buildings and battle screens keep their old art.

Tests: `tests-fable/render-front.js` (screenshots). `field-lab.js` 31/31. The older suites are unchanged from v5.1: 13 pass, the same 10 fail on the old sector layout.

## v5.1 — the field engine (Fable)

Everything outside Sunkeep Base was rebuilt. The old sectors were one flat 480x360 screen with randomly scattered props; they are now hand-drawn scrolling tile maps with their own engine (`sw-field.js`, spliced in by `build_fable.py`).

**Sprouts work like the latest Sprouts**
- Your pouch sprouts walk with you as a squad (up to 24 on the field). The pouch and the squad are the same thing.
- B throws one at the ring in front of you; the ring locks on to the nearest thing a sprout can work. Hold B to whistle them back. SELECT picks which kind goes next.
- Thrown sprouts break trees, rocks and bushes into pellets, then carry the pellets home to the Lantern beacon. Carrying uses weight against strength, and PEB counts double.
- Idle sprouts pick up nearby loot by themselves and rejoin you when you walk past.

**Level design**
- Six maps: Verdant Meadow, Lantern Town, Ember Wastes, Dewmist Shore, Gloom Hollow, Zephyr Peak. Each has its own tiles, trees and weather.
- Treasures with names and weights (13 in all), some on islands that need a bridge built, some behind type gates: boulders need PEB, fire needs EMBER, vines need LEAF, spark gates need ZIP, thirsty blooms need DEW.
- Buried wild sprouts to pluck, placed so the kind you need for a gate is nearby.
- Wild buddies are visible and live in the tall grass. A sleeping ALPHA guards the best treasure in the Meadow and the Gloom.
- Ledges hop one way. Sectors join edge to edge (Meadow - Town - Wastes/Shore - Peak/Gloom); the Lantern Gate map is still fast travel. Roads still need Sigils.

**Trainers and the villain**
- Trainers watch the road and challenge you on sight: KISS, DEREK (with the broken-down Flow Pros truck), MAMA (with the Yukon), and DOME GUARDS.
- KING BIBI is the villain. His IRON DOME blocks the road to the Peak; he waits outside his fortress in Gloom Hollow with a three-buddy team. Beating him drops the dome.

**Not done yet**
- Sunkeep Base still runs on the old walker and old art. The squad does not follow you there yet.
- Battles, menus and the title screen are unchanged apart from the v5.0 buddy sprites.

**Tests**
- New: `tests-fable/field-lab.js` (31 checks, headless Chromium) and `tests-fable/render-field.js` (screenshots).
- Of the 23 older suites, 13 still pass. The 10 that fail (sw2, 4, 6, 8, 10, 13, 14, 18, 19, 23) check the old sector layout: fixed gym and NPC coordinates, the old grass rectangles, the follower train and the SPROUT/BUDDY command toggle, all of which this version replaces.

## v5.0 — "New buddies" (2026-11-15, Fable)

Will, handing Sproutwild to Fable: total overhaul, everything is a
placeholder. The buddies need a lot of work; the sprouts should work
the way they do in the latest Sprouts; the level design needs a major
rework drawing on Pikmin, Palworld and Pokemon; the fighting game's
cast can appear and King Bibi is a villain too; it stays its own file
for now and merges into Pocket Lantern later. This version is the
first slice of that: **the buddies.** Nothing else changed.

- **All 15 buddies are redrawn** by a new renderer (`swbMake`,
  `SWBUD` in sw-module.js). Each one is built from shapes at twice the
  old detail, then finished like a sprite: hard pixels, a lit top
  edge, a shaded underside, one dark outline. They have big eyes and
  readable silhouettes, and they all face left.
  Cindercap is a mushroom imp with a flame on its cap; Magmoss a
  cracked, glowing boulder under a moss cap; Pebblit a rock-eared pup;
  Boulderhound a hound with stone plates down its back; Drizzlet a
  teardrop with antennae; Tidebud a bulb on a lily pad; Zipwig a
  beetle with a bolt on its shell; Volthare a hare with lightning
  ears; Fernfang a small fern-crested raptor with fangs; Bloomboar a
  boar carrying a flower bed; Cloverimp a pink imp under a clover;
  Auricorn a golden foal; Embercap a volcano-capped mushroom;
  Tidestag a stag with coral antlers; Fernhowl a fern-maned wolf.
- Names, types, stats, moves and catch rates are unchanged, and the
  species IDs are the same, so saves load as before. The old
  letter-grid art is kept as a fallback (`s._old`).
- **Your buddy faces the wild one in battle** (yours is flipped to
  face right).
- **The game builds from this repo now.** `build_fable.py` runs the
  original build.py with its paths pointed here and writes
  `muse/games/Sprouts+Rootdeep+Sproutwild-v5.html`. The v4.7 file is
  untouched. Before any change, this build reproduced v4.7 byte for
  byte. `sw-cartart.js` (the cartridge label, which build.py needs)
  was missing from the repo and was recovered from the built file.
- Test hook: `SWF.species()`.

**Verification:** all 23 `test-harness-sw*.js` suites green on the v5
file, 0 console errors. Renders looked at: every buddy next to its old
sprite (`shots/v5.0-buddy-lineup.png`), a wild battle and the Meadow
in a real browser (`shots/v5.0-battle-and-meadow.png`; scripts in
`tests-fable/`). Not run: the soak and Rootdeep's own harness.
**Phone status: unconfirmed, awaiting Will's verdict.**

**Next, in the order I'd take them:** (1) sprouts that behave like
the latest Sprouts (read its code first); (2) level design, one
sector at a time; (3) King Bibi as a villain and cameos from the
fighting game's cast; (4) the HUD and text overlaps seen in the
first look (cryptic "W0 S0 P30" line, labels colliding).

## v4.7 — "Your move" (2026-11-14)

Will: keep playing, play the original Sprouts, look up
Pikmin, Palworld, and Pokemon GBA — and "wild world
battle with turn based activatable would be so cool."
Done, all of it (research round 2 is in RESEARCH.md).
The battle itself was already GBA turn-based; what
changed is HOW a fight starts. It used to start AT you:
walk within 11px of a wanderer or roll the grass dice
and you were in a battle. Now a fight starts BY you:

- **No ambushes, ever.** Contact starts nothing. Tall
  grass rustles and a wild POPS OUT nearby ('!'), stays
  about 12 seconds, then fades back if you ignore it.
- **Activate it two ways.** Walk up: the prompt names
  the fight before you commit — 'A: BATTLE FERNFANG
  Lv5' — then A starts it. Or, Pikmin-style, THROW a
  sprout at it (SPROUT command mode): throws now snap
  to a wild in range, and a sprout landing on one
  engages its battle. Wilds telegraph with a '!' when
  you're in range.
- **The ritual.** Every activation — wild or gym —
  plays the GBA moment: black bars sweep in, a banner
  names the fight ('WILD FERNFANG!' / 'RANGER —
  VERDANT SIGIL'), then the turn-based screen.
- **A real aim bug died on the way:** throws aimed off
  the raw axis pair, so after mixed-axis movement a
  throw flew diagonally off your facing and missed
  low — possibly for every throw since v4.4. Aim now
  uses the true last-pressed direction. Throw-to-engage
  verified 6/6 in the rig after the fix.

**Verification:** all 23 suites green (new sw23
activation suite; sw2/sw4/sw6 adapted to reveals and
the engage ritual), soak + Rootdeep green, 0 errors.
Renders: the BATTLE prompt in the Meadow and the bars
mid-sweep. **Phone status: unconfirmed — awaiting
Will.**

## v4.6 — "The Garden" (2026-11-14)

Will: "Play the game — you didn't change anything I
asked. Do a deep criticism compared to what we're trying
to make, and then rework." So this version starts with a
played playtest and an honest critique, both delivered
in chat. The findings, briefly: the base played itself
(+27 resources and 3 crew promotions in 4 unattended
minutes); the v4.5 seed rule monocultured the patch to
all-LEAF in 3 minutes; the work was geographically
illegible (fruit at five random corners, a slab, a
distant Lantern); A did nothing to sprouts in the wrong
invisible mode; and the 89-char crew-join announcement
overflowed its own bar in the playtest screenshot. The
rework answers them structurally, not cosmetically:

- **The patch is now a GARDEN**: six fenced plots in two
  rows (each Garden Bed building adds a plot, to 8),
  baked into the ground with a split-rail fence. Every
  plot draws its state — empty soil, colored seed, baby,
  sprout, grown worker. One screen reads the whole system.
- **Fruit grows on three typed bushes** flanking the
  garden (EMBER west, DEW east, LEAF south), fruit
  visible, regrowing. The scattered base-wide apple
  field is deleted.
- **Work is a visible trip with a claim**, Sprouts-
  gardener style: a worker claims an empty plot, walks
  to a bush, picks a berry, carries it TO THE PLOT and
  plants it. The seed is the FRUIT's type — and workers
  pick the bush whose type the garden has least, so the
  garden grows up mixed (rig replay: LEAF/EMBER/DEW
  across all six plots in 3 minutes). No empty plot =
  harvest runs to the Lantern, as before. Followers at
  base work the same cycle — one work system, not two.
- **Every sprout answers A**: grown workers offer PLUCK
  in any mode (and plucking now releases their plot
  claim — a ghost-claim bug the playtest surfaced);
  babies, seeds, and empty plots all explain themselves.
- The crew-join announcement fits its bar (31 chars).

**Verification:** all 22 suites green (new sw22 garden
suite; sw21 rewritten as the quiet-garden suite; sw13/
sw14/sw20 adapted to plots and bushes; sw14's ask flake
root-caused to absolute-balance accounting and fixed),
garden replayed for 3 minutes in the rig, soak green,
Rootdeep green, 0 console errors. **Phone status:
unconfirmed — awaiting Will.**

## v4.5 — "Seeds, not magic" (2026-11-14)

Will: "Why do they plant themselves — they should plant
the berries to make seeds that make more sprouts." Read
Sprouts' deliver() again: in the original, buds haul
fruit to the Lantern and the fruit's SEEDS are planted in
the soil as new sprouts — type of the carriers, capped
by room. That loop is now Sproutwild's, verbatim in
spirit:

- **Patch spots no longer germinate sprouts from
  nothing.** Bare soil stays bare forever until planted.
- **Every fruit delivery home plants a seed** in the
  first empty spot — patch sprouts and base followers
  alike. The seed is the DELIVERER's type (a LEAF sprout
  plants a LEAF sprout; LUCKY fruit carries two seeds).
  The mound shows the seed's type color while it grows
  underground (~7s), then POP — a baby, which ages into
  a worker like any patch sprout. Full patch = deliveries
  are pure harvest. Pluck a sprout or send one off to a
  job and the next delivery replants its spot.
- Louie explains the first planting; the BASE screen
  spells it out; asking a seed or a bare spot with A
  tells you what it is. (The old LEAF yield that conjured
  a pouch sprout from nowhere is gone — no more sprouts
  from thin air anywhere.)
- **The patch clipping**: two real causes found. (1)
  Nothing stopped you BUILDING on the patch — buildings
  draw after the soil, so a cottage on the patch painted
  straight over the sprouts. The patch rect is protected
  ground now. (2) Patch sprouts, lesson sprouts, and
  followers drew at one fixed layer, so the player
  painted over them even when standing behind them. They
  now depth-split around the player (behind-layer /
  front-layer by Y) — verified in renders from north,
  inside, and south of the patch.

**Verification:** all 21 suites green (new sw21: bare
soil grows nothing, a delivery plants a deliverer-typed
seed, it pops and grows up, seeds/soil answer A), soak
green, Rootdeep green, 0 console errors. **Phone status:
unconfirmed — awaiting Will.**

## v4.4 — "Throw them like Sprouts does" (2026-11-14)

Will played v4.3 on his phone and sent screenshots. Four
complaints, all fair, plus one bug he photographed without
knowing it:

1. **"Select should let you swap between controlling the
   buddies and sprouts."** Went back to Sprouts.html and
   read its actual system: A throws a squad bud at a
   cursor, holding B is a whistle that calls buds back,
   and Select manages what you're commanding. Sproutwild
   now works the same way, in its own terms:
   - **SELECT swaps COMMAND: BUDDY ↔ SPROUT** (HUD pill,
     bottom-left: "SEL: BUDDY / SEL: SPROUT").
   - BUDDY mode: B sends your lead buddy (as before).
   - SPROUT mode: **B THROWS a sprout** from your train —
     it arcs to the spot in front of you (snapping to a
     tree, rock, bush, treasure sparkle, or heart), lands,
     and gets to work: it chops/mines the node down itself,
     then **carries the yield back and hands it to YOU**.
     Treasures and hearts are fetched the same way. Hold B
     to throw more, one after another, Pikmin-style.
   - **Hold B (either mode) = the whistle**: a ring grows
     around you and every working/hauling sprout inside it
     drops its task and comes back. Louie teaches it, the
     Guide has a COMMANDING SPROUTS page.
2. **"They all go for the same apple."** They did — the
   lesson sprouts all targeted the first untaken apple,
   patch sprouts picked at random. Now every apple is
   CLAIMED when a sprout chooses it; nobody else can take
   that one. Two fetchers never chase the same apple again.
3. **"The apple is always there — they should need to
   respawn."** Picked apples are gone now, everywhere
   (lesson, patch, followers). Each one regrows on a
   timer (~12s in the lesson, ~22s at the patch) and you
   can watch the last few seconds as a green nub sprouting.
4. **"They grow weird in the beginning."** Lesson sprouts
   grew by DELIVERY COUNT, so the one who lost the apple
   races stayed a baby while its siblings grew. Now they
   grow by AGE, together (Sprouts' own stageOf numbers:
   baby <6s, sprout <14s, grown after), pop staggered, and
   when the last one comes of age, carriers finish their
   trip and everyone settles home to be plucked.
5. **The photographed bug**: his screenshot showed the
   prompt "A undefined" at the gate — the ask-a-sprout
   interaction had no prompt label. It reads "A ASK" now.
   Also in that shot: a sprout-info float ran off the
   screen edge (floats are clamped now) and the "Catch a
   wild buddy" banner carried a long suffix (shortened).

**Verification:** all 20 suites green (new sw20: Select
swap, throw→work→bring-back delivery, whistle recall,
apple claiming/regrowth), soak green, Rootdeep green, 0
console errors. Suite contracts updated where the design
changed on purpose (growth-by-age in sw4/15/16, the claim
API in sw14's ZIP-speed check). **Phone status:
unconfirmed — awaiting Will.**

## v4.3 — "I played it. You were right." (2026-11-14)

Will: "play this game and tell me if any of it makes sense."
So this build started with a rig playtest — five minutes
living at the patch, a minute standing at base with a
follower. Honest findings, all confirmed in the logs:

1. A follower at base stood 9px from the keeper for a full
   minute doing NOTHING. Followers only knew "follow".
2. In 5 minutes the patch churned through its whole crew
   cap: sprouts grew up, vanished into the crew LIST (a
   menu, invisible), and strangers sprouted in their spots.
   From the player's seat: sprouts keep disappearing.
3. Yields floated at the Lantern, off-screen from the
   patch — work happened where nobody was looking.

The fixes, structural this time:

- **Followers WORK at home.** At Sunkeep a follower runs
  the patch loop itself — fetches, carries to the Lantern,
  deposits (its own typed yields). On the road it trails
  and hauls as before. It never just stands by you again.
- **Growing up no longer empties the patch.** A sprout
  that earns the crew STAYS at its spot, living and
  working, flagged as crew (atPatch). The only thing that
  empties a spot is YOU assigning it a job — a departure
  you chose. Unassigning sends it home to a free spot;
  jobless crew with no spot wait visibly by the Lantern
  steps instead of inside a menu.
- **Yield news lands where you stand:** patch floats now
  appear at the sprout's own spot when it gets home.
- **Every sprout answers A.** A catch-all interaction:
  walk up to ANY sprout — follower, patch baby, building
  worker, waiting crew — and it tells you what it is and
  what it's doing. Plus first-time explanations when a
  follower first works the patch and first hauls, and the
  BASE screen now lists the follower story in plain lines.
- **The main 3 buddies, redrawn.** Will: "I still hate
  the main 3 buddies." Cindercap, Drizzlet, Fernfang and
  their evolutions (Embercap, Tidestag, Fernhowl) are new
  24-wide sprites with actual designs — fire-cap imp with
  a flame wisp, volcano-crowned evolution, droplet-antler
  fawn, wave-antlered stag, fern-maned wolf pup and wolf.
  Previewed and critiqued over two rounds before shipping
  (art: newart3.py, sheet: shots/v43-starters.png).

**Verification:** all 19 suites green (new sw19: crew
stays at the patch, followers work at base and their work
lands in stores, followers don't trail at home, train
resumes on the road), soak green, Rootdeep green, 0
console errors. Two real bugs caught en route: a missing
brace in the new credit function (found by parser bisect)
and a latent sw14 suite bug (petal-denominated asks broke
its own accounting — suite fixed, 40+ clean runs).
**Phone status: unconfirmed — awaiting Will.**

## v4.2 — "They follow you home" (2026-11-14)

Will played v4.1 and the patch still didn't read: sprouts
seemed to disappear into the ground. He also asked for the
other half of Sprouts' sprout rules — wild sprouts you pluck
that FOLLOW you and haul things home. Both are in.

- **Why they "disappeared":** a patch sprout's third delivery
  used to teleport it back to its spot and turn it into dirt
  in the same frame — deliver at the Lantern, never come
  back, spot shows nubs. Fixed properly:
  - Growing up is now a DEPARTURE: the sprout celebrates at
    the Lantern (hops, name float where it stands) and only
    then does its spot go back to seed.
  - Empty spots now draw as what they are — a sleeping SEED
    mound, with the first green nubs showing just before a
    sprout pops. Seed -> sprout -> grown -> leaves with
    applause or gets plucked by you. The whole cycle reads.
- **Wild sprouts are pluckable — and they FOLLOW you.** Out
  in the sectors, wild sprouts now stand and wander in their
  habitat (walking over one does nothing anymore). Walk up
  and press A to PLUCK one: it joins your train, Sprouts-
  style, trailing behind you sector to sector. Train cap: 4
  (a fifth pluck goes to the pouch, like before).
- **Followers work the road.** Every so often a follower
  picks up a find — what it finds depends on its kind
  (EMBER smelts ingots, PEB hauls stone, DEW berries and
  petals, ZIP petals, LEAF berries and spare sprouts, LUCKY
  petals and the odd tonic) — carries it to the Lantern
  Gate, and mails it home: your stores grow wherever you
  are ("sprout mail!"). Then it's away a little while —
  the trip takes time — and comes back through the Gate to
  your side. Louie and the Keeper's Guide both teach it.

**Verification:** all 18 suites green (new sw18 runs the
whole follower life: pluck -> follow -> haul -> mail credited
-> away -> return -> full-train pouch overflow; sw13's wild
sprout is a pluck now; sw16 checks the join celebration),
soak green, Rootdeep green, 0 console errors. A wNear
scoping bug (an inserted statement orphaned a loop variable)
was caught by the battery and fixed before shipping.
Renders viewed: `v42-train` (three followers on the road),
`v42-patch` (seed stage at the patch).
**Phone status: unconfirmed — awaiting Will.**

## v4.1 — "Grow them yourself" (2026-11-14)

Will's corrections to v4.0, taken one by one: the beginning
still handed you sprouts instead of teaching them, Erin and
Marcus were better the first time, the cast had no animation,
menu text still fell off, and a cinematic should not drop
into plain text boxes. All five are answered here.

- **The beginning teaches sprouts by DOING them.** The text-
  box lessons are GONE (welcome lesson and patch lesson both
  removed — the cinematic now hands straight to the world).
  Louie meets you, then LEADS you to the patch himself. The
  patch starts as three SEEDS in the soil: press A to WATER
  them, watch the babies pop, watch them fetch apples to the
  Lantern and GROW — baby, sprout, grown, two deliveries
  each, Louie narrating every beat in the world. When they're
  grown, you PLUCK two yourself: those plucked sprouts are
  your catching sprouts. Nothing is given — befriending a
  buddy no longer gifts sprouts either; the pouch holds only
  what you grew and plucked. The sprout you leave behind
  stays at the patch as its first worker.
- **The road to your first buddy is shorter**: cinematic ->
  Louie -> grow -> pluck -> the clearing. All play, no pages.
- **Erin and Marcus are their ORIGINAL Sprouts models again**
  (Will's preference) — in the world, the keeper screen, the
  portraits, everywhere. The rest of the new cast stays.
- **First animations.** Characters breathe now: NPCs idle-bob
  in place, playable Erin/Marcus step-bob as they walk and
  breathe standing still, Bottie HOVERS at the Peak, and
  cinematic portraits float. Small, alive, everywhere.
- **Menu text actually fits now.** swRows fits its left text
  against its right text (nothing collides or runs off);
  every KEEPER'S GUIDE line was rewritten to fit its panel;
  the jobs rows were shortened; and descriptions that needed
  three lines in a two-line box (jobs, nursery, statue) were
  rewritten to end their sentences inside the box.
- **Real bug found by the tests**: the living patch used to
  reset every time you left Sunkeep and came back. It now
  persists across trips like a real garden.

**Verification:** all 17 suites green (sw15 rewritten around
the in-world teaching: water -> pop -> fetch -> grown ->
pluck; sw4/sw16 run the same physical flow; sw8/sw10/sw12/
sw17 updated to the no-freebies rules), soak green, Rootdeep
green, 0 console errors. Renders viewed: `v41-seeds`,
`v41-grow` (Louie at the patch, mid-lesson), `v41-keeper`
(original Erin + Marcus), `v41-guide`, `v41-jobs`.
**Phone status: unconfirmed — awaiting Will.**

## v4.0 — "The sky clanks" (2026-11-14)

Will's big list, built whole: name behavior, honest sprout
earning, sprout tool jobs, a character overhaul, are-you-sure
prompts, selection cinematics, a fixed script — and a villain.

- **Names step aside.** A named character's name pill now
  hides while you stand close to them (NPCs, Louie, the
  starter trio, Bottie) — the prompt at the bottom already
  tells you who you're with. From a distance, names show.
- **Only working sprouts appear at base.** Free crew no longer
  wander the yard and decorative ambience sprouts are gone.
  If a sprout is on screen at Sunkeep, it has a job: the
  patch, a building, the nursery — or a tool.
- **Sprouts are EARNED, never given.** The tending trio is no
  longer handed to your crew: they stay at the patch as its
  first sprouts (one delivery in), and grow into the crew the
  same way every sprout does — by working. The old-save
  starter-crew grant is gone too.
- **SPROUT TOOL JOBS.** At the Tinker Bench: SPROUT JOBS.
  Give a crew sprout the AXE job and it works Sunkeep's grove
  hit by hit, hauling what falls; the PICK job works the
  rocks. Felling earns the sprout skill. (The pick axe and
  axe, held by sprouts, like Will asked.)
- **Character overhaul.** Sproutwild has its OWN cast art now
  (SWCHR) — Will, Erin, Marcus, Ranger, Scout, Pip, the Elder,
  and Bottie, drawn bigger with shading, in the world, the
  keeper screen (rebuilt roomier), gym portraits, and the
  opening cinematic. Sprouts' own sprites are untouched.
  Pip and the Elder finally have their own faces instead of
  borrowed ones.
- **ARE YOU SURE?** Switching keepers, challenging a gym, and
  ringing the Base Lantern all ask first (A: YES · B: NO).
- **Selection cinematics.** Confirm a keeper switch and they
  get a moment — portrait, name, and a line in their voice.
  Befriending your first partner gets one too.
- **Words fit their frames.** The objective line and floating
  text are fitted to the screen (wFit), and the over-long
  speeches that spilled past two lines were rewritten to fit.
- **The opening grew up.** Six beats now: Erin and Marcus get
  dialogue, and the last beat looks up — something chrome
  turns a smiling face toward the valley... bzzt.
- **LIL BOTTIE, VILLAIN OF THE SKY.** Earn your first sigil,
  come home, and he CLANKS down out of the sky onto your
  plaza — chrome helmet, LED smile, clover chain — to tell
  you the feed runs through him and he intends to collect.
  After that: he waits at the PEAK past the Champion as a
  fifth, secret gym (CLANK SIGIL; VOLTHARE 33 / AURICORN 34 /
  EMBERCAP 36), and some nights at day-rollover he RAIDS your
  base with two buddies — repel him for +50 petals, flee and
  he trashes the place (-15). Beating him ends the raids.
- **Collision fix (process):** the new selection-cinematic
  functions were first named drawCine/cineUpdate, which
  silently overrode Sprouts' and Rootdeep's own — caught by
  the Rootdeep regression, renamed to swDrawCine/swCineUpdate,
  and the trilogy now verifies zero duplicate function names.

**Verification:** all 17 Sproutwild suites green (new sw17
covers confirms + cinematics, tool jobs, Bottie's descent,
boss gating, and raids), soak green, Rootdeep green, Sprouts
untouched, 0 console errors, zero duplicate functions.
Renders viewed: `v40-bottie` (the descent, dialogue up),
`v40-keeper` (new cast), `v40-cast`, `v40-peak`.
**Phone status: unconfirmed — awaiting Will.**

## v3.9 — "Sprouts are not buddies" (2026-11-14)

Will's correction, taken seriously: the creatures are NOT
sprouts, and the little plant folk are not a currency with a
buddy's face. Sproutwild had conflated them since v3.5. This
build separates them the way the original Sprouts does —
studied from its source (mkBud entities, stageOf ages,
gardener sprouts that plant/water/pick on their own, house
residents with jobs):

- **SPROUTS are Sprouts' own sprouts.** Patch sprouts, loose
  wild sprouts, the tending trio, the tossed projectile, and
  building workers are all drawn with Sprouts' OWN drawBud()
  — same tiny plant folk, same stem-and-leaf look. (Sprouts'
  camera globals are zeroed while Sproutwild draws, so a stale
  Sprouts camera can never offset them.)
- **The CREW: sprouts do the work at home.** Patch sprouts
  that complete 3 deliveries GROW UP and join your sprout
  crew (cap grows with base level and pens). Crew sprouts
  wander Sunkeep when free and take jobs at buildings: walk to
  a building, press A, assign. Typed gifts drive production —
  EMBER/ZIP smelt the kiln, PEB hauls the quarry, DEW/LEAF
  grow beds and tend the nursery, LEAF mills the sawmill,
  LUCKY boosts any building it joins. Workers gain skill XP
  per tick and yields grow with it. The opening tend now ends
  with the three sprouts joining your crew.
- **BUDDIES are battle-only.** Buddy workers are gone: the
  production tick, the assign screen, nursery tending, base
  missions ('Deploy N sprout workers'), and Louie's guidance
  all run on sprouts now. A buddy's job is to fight, follow,
  and be shown off. Old saves migrate cleanly: building worker
  lists are cleared (buddies return to the box) and an
  established save receives the starter crew.
- **Words match the world now:** the battle option is SPROUT
  (toss a sprout to command a buddy), the picker asks 'TOSS
  WHICH SPROUT?', the HUD counter is SP, the Cottage sells
  sprouts, asks ask for sprouts, the guide's first page is
  SPROUTS & BUDDIES, and the Nursery is the BUDDY NURSERY.
  Lessons and intro beats rewritten around the split:
  'Buddies FIGHT. Sprouts WORK.'
- **Graphics round 2** (the overhaul was 'OK but not nearly
  enough'): biome dressing baked into every sector's ground —
  Wastes sand ripples and a bleached bone, Shore wet sand and
  shells, Gloom dark blotches and glowing mushrooms, Peak snow
  drifts and sparkle, flower crosses in the green sectors.
  Living air: petals drift at home, spores rise in the Gloom,
  snow falls on the Peak, sand streaks the Wastes. Lesson and
  guide screens got framed panels with gold corners. Wild
  buddies and your lead partner draw bigger in the field.

**Verification:** new suite sw16 proves the split end to end
(real tending -> crew of 3; a patch sprout's third delivery
grows it into the crew; a buddy assigned to a building
produces exactly nothing; a sprout produces). All 16
Sproutwild suites green, soak green, Rootdeep green, 0 console
errors. Renders viewed: `v39-home` (SP7 in the HUD, crew
sprout wandering, patch sprouting), `v39-base`, `v39-patch`,
`v39-gloom`, `v39-peak`.
**Phone status: unconfirmed — awaiting Will.**

## v3.8 — "Total graphics overhaul" (2026-11-14)

Will: "Do a total graphics overhaul." Every visual system in
the game was redrawn or rebuilt:

- **All 15 buddies redrawn from scratch.** The old 15x11
  placeholder string-art is gone. New sprites are 20x16 with
  proper silhouettes, three-tone shading (base / shade /
  highlight), eyes with shine, and signature details:
  Cindercap's ember-spotted cap, Embercap's lava cracks and
  flame crown, Magmoss's moss dome over ember-cracked rock,
  Pebblit's muzzle and nose, Volthare's long ears and cheek
  sparks, Tidestag's coral antlers, Bloomboar's snout, tusks
  and flower back, Auricorn's horn and forelock. The art was
  authored on a preview sheet and iterated three rounds before
  it touched the game (source: `newart.py`).
- **The ground is baked now.** Each sector's ground texture —
  checker, speckle, flowers, soft patches, dirt paths, town
  streets, the base plaza — renders once into a canvas on
  entry instead of ~200 rect calls per frame. Richer texture,
  cheaper frames (matters on the phone).
- **The Great Lantern is a monument.** It was an 8x10 gold
  square on a stick, and only drawn after the intro. Now:
  stone plaza, two steps, twin pillars, a roof, and a framed
  flame with a pulsing halo — standing at Sunkeep from the
  first frame, glowing warm through the night (halo feathered
  with a third light layer).
- **Scenery redrawn:** trees (layered canopy blobs, lit top,
  fruit), rocks (facets, cracks, moss), berry bushes (shining
  berry clusters), cacti with flowers, mushrooms, shells,
  snowrocks. Town houses got timber framing, chimneys, doors
  and lit windows. Gym facades got pillars, a pediment, and
  banners in the gym's type color.
- **Every building redrawn** inside its cell: cottage (pitched
  roof, chimney, round lit window), garden bed (furrows),
  nursery (glass dome), kiln (brickwork, arched firebox),
  quarry (pit and boulders), tinker bench (tools), sawmill
  (bigger blade, log stack), lantern statue (stepped pedestal,
  glow), sprout pen (posts, rails, hay).
- **Battle scenes rebuilt:** five-band gradient skies per
  sector, a sun with drifting clouds (Gloom gets stars and the
  moon), a dark ridge silhouette behind the tree line, and
  grass-topped mounds with soft shadows under both buddies —
  who now fill the frame at the new sprite size.
- **Grounding:** soft shadows under the player and Louie
  (wilds, NPCs, partners already had them).
- Two fixes fell out of verification: the gym banner color
  read a wrong data shape and would have thrown every frame in
  a gym town (caught by the render pass, fixed), and the ask
  screen now resets its cursor on open like every other screen
  (a stale selection could have pre-picked LEAVE).

**Verification:** all 15 Sproutwild suites green (sw14 run 3x —
its buds-kind ask path had never actually been exercised; a
suite-side bug, fixed), soak green, Rootdeep green, 0 console
errors. Renders viewed: `v38-battle`, `v38-choice`, `v38-base`,
`v38-monument`, `v38-night`, `v38-town`, `v38-meadow`.
**Phone status: unconfirmed — awaiting Will.**

## v3.7 — "The game explains itself" (2026-11-14)

Will, on v3.6: "I don't see the sprout system integrated at
the beginning and there isn't much of anything that explains
the game." He was right on both counts — the opening taught
nothing, and the patch wasn't even drawn until after Louie.
This pass is all teaching, no new systems:

- **The intro cinematic teaches now.** Its beats were
  rewritten around the actual loop: the Lantern's light grows
  BUDS, buds live in the soil, a tossed bud commands a BUDDY,
  buddies fight/build/work. (It also still said "wildsprouts,"
  two renames out of date.)
- **WELCOME, KEEPER lesson.** The moment the cinematic ends, a
  fresh game opens a 3-page lesson: what buds are, what they
  do (work, or get plucked — a bud in the pouch is how buddies
  are caught), what buddies are, and who to see first. Shown
  once, ever; B skips; it is never forced on a returning save.
- **The patch is in the world from the first frame.** Soil and
  the three sleeping sprouts are drawn at quest 0, right below
  spawn — the sprout system is visible before you've pressed
  anything. Walking up early gets "Louie first — he watches
  this patch" instead of a dead button.
- **THE SPROUT PATCH lesson.** First touch of the patch opens
  its own 3 pages: wake them, they fetch apples to the Lantern,
  deliveries grow them, one bonds as your first buddy and the
  rest become your first throwing buds — and the patch keeps
  producing forever after.
- **KEEPER'S GUIDE (pause menu, new row).** Seven short pages
  covering everything, in plain words: Buds & Buddies · The
  Patch · Catching · Your Base · Gathering & Tools · Gyms &
  Sigils · The Valley (asks, treasures, night). Left/right turn
  pages; it's the reference for anything the lessons missed —
  including for returning players whose saves predate the
  sprout systems entirely.
- **First nightfall** gets one say-line, once ("Wild buddies
  grow bolder — and the Lantern keeps Sunkeep safe"), so the
  day cycle explains itself when it first happens.

**Verification:** all 15 Sproutwild suites green (new `sw15`:
lesson handoff/pages/skip/memory, guide open/turn/back, patch
lesson gating; sw2/sw3/sw7/sw8 boot flows updated for the
lesson; sw4 asserts the patch lesson physically), soak green,
Rootdeep green, 0 console errors. Renders viewed: `v37-lesson`,
`v37-guide`, `v37-spawn` (patch + sprouts visible at spawn).
**Phone status: unconfirmed — awaiting Will.**

## v3.6 — "The valley asks" (2026-11-14)

Will: "Keep improving the game — I didn't even have to get
sprouts; look at the other games' files." So this pass mines
Sprouts' own systems (22 missions, 240s days, 12 hidden
treasures, gardeners with typed talents) for what Sproutwild
was missing, and builds it without being asked piece by piece.

- **NPC ASKS — Sprouts' mission system.** Pip and the Elder in
  Lantern Town, and Louie himself (new ANY ASKS? row in his
  menu), each hold a standing ask: bring N buds of a type,
  bring N wood/stone/berries, or catch a named buddy. The ask
  screen quotes their own dialogue, states the want, what you
  have, and the reward (petals, sometimes + a Tonic). DELIVER
  really deducts; CLAIM pays out on catches; NOT READY refuses
  without punishing. Completing one generates the next.
- **A real bug died here:** town NPCs were UNREACHABLE — the
  talk check lived inside the BASE-only branch of the proximity
  scan, so Pip and the Elder have been decorative since v3.0
  despite having dialogue written. The check is sector-aware
  now, and the keeper-swap talk action is guarded to actual
  keepers (it would happily have made Pip the keeper before).
- **Day cycle.** 300-second days, counted (DAY 1 · DAY / DUSK /
  NIGHT in the corner). Dusk washes the world amber; night lays
  a deep blue over everything except the HUD, the Great Lantern
  glows warm at base — and wild buddies get bolder (encounter
  rate up at night), like Sprouts' days turning.
- **Hidden treasures.** Every sector buries one gold sparkle
  (seeded per sector; placement avoids nodes, grass, solids,
  the clearing and the patch). Walk into it: petals, buds, a
  Tonic, rarely an ingot. Sprouts hid 12; ours regrow per visit.
- **Each bud kind is good at something** (Sprouts' rule): EMBER
  patch buds sometimes smelt an INGOT on their delivery run,
  PEB buds haul stone, DEW buds favor berries and petals, LEAF
  buds bring back wild buds twice as often — and ZIP buds
  physically run at 54px/s against everyone else's 36.

**Verification:** all 14 Sproutwild suites green (new `sw14`:
full ask loop with real deduction, NOT READY refusal, Louie's
menu path, day rollover, treasure dig, ZIP-vs-EMBER footrace),
soak green, Rootdeep green, 0 console errors. Renders viewed:
`v36-ask.png` (one wrap collision caught + fixed), `v36-night.png`
(tint verified in the op stream and by pixel sampling — night
grass renders ~40% darker with the blue shift), `v36-treasure.png`.
**Phone status: unconfirmed — awaiting Will.**

## v3.5 — "Buds and buddies" (2026-11-14)

Will's correction, and he was right: v3.4 treated buds as an
abstract counter. He sent me back to Sprouts' own programming —
and in Sprouts, buds are ENTITIES: `mkBud(type, stage, x, y)`,
sprouts age through stages in the Lantern's soil (`stageOf`:
young under 12s, growing under 30s, grown after), you PLUCK them
and they follow you, and gardener buds (`b.gard`) work the garden
entirely on their own — "they plant, water and pick all on their
own, and they keep at it for as long as you leave them here."
Typed sprouts also grow wild by habitat (missions: "Blue Dews
grow along the north shore"). v3.5 rebuilds Sproutwild's bud
system on exactly those mechanics, and fixes the vocabulary:

- **The creatures are BUDDIES now.** Every player-facing string:
  pause menu (BUDDIES / BUDDY GUIDE), battle menu (BUDDY beside
  BUD xN — the count no longer bleeds onto BUDDY), quests, gym
  talk, join/rest/full messages, nursery, Louie. Sprouts are
  BUDS; buddies are what buds command.
- **The patch is a living bud farm.** After the intro, the three
  soil spots (four with a Garden Bed) keep germinating buds of
  random basic types. They age through Sprouts' stages (nub →
  sprout → grown, ~30s), drawn at growing sizes in the soil.
- **Grown buds work, like Sprouts' gardeners.** A grown bud left
  in the patch fetches fallen apples and carries them to the
  Lantern on its head, depositing berries/wood/petals — and
  sometimes it brings back a WILD BUD (+1 stock of a random
  type): the sprouts literally create your capture materials.
- **...or pluck them.** Walk up to a grown bud: "PLUCK X BUD" —
  it's in your pouch, and the spot starts growing the next one.
  Plucking vs. leaving workers is the player's standing choice,
  exactly the Sprouts garden tension.
- **Wild buds by habitat.** Every wild sector grows 1–2 loose
  buds of its own species' types (Dews at the Shore, Embers in
  the Wastes...), sparkling in the open. Walk into one to collect
  it. Placement avoids nodes, grass (no ambush pickups), and
  solids.

**Verification:** all 13 Sproutwild suites green (new `sw13`:
germination, stage timing, an unaided bud delivery raising base
wealth, pluck-to-pouch with regrow, wild bud collection), soak
green, Rootdeep green, 0 console errors. Renders viewed:
`v35-patch.png` (buds growing in the soil), `v35-pause.png`
(BUDDIES / BUDDY GUIDE), `v35-battle.png` (BUD x7 vs BUDDY, side
by side, no bleed), `v35-wild.png`. One flake found and fixed in
the suite (pluck a bud where it STANDS — workers wander).
**Phone status: unconfirmed — awaiting Will.**

## v3.4 — "Hands, tools, and the sprouts come first" (2026-11-14)

Will's direction: gathering should take real work (~15 hits, a bar,
stamina), tools (axe + pickaxe) should be unlockable and levelable
like Palworld's tech, and the game should START the Sprouts way —
you grow little sprouts at base, they fetch and carry and work,
they grow — and only then does the creature collector begin.

- **Gathering is work now.** Trees and rocks have **15 HP**, bushes
  6. Every A press is a swing: the node shakes, a damage chip floats,
  and a **green HP bar** shows above it. Each swing costs **5
  stamina** (100 max, thin bar under the HUD when spent; it regens
  after a 1-second breather; at <5 you're Winded and swings refuse).
  Cottage REST restores stamina with the party.
- **Tools: the AXE and the PICKAXE.** The Tinker Bench is now a real
  workshop screen: craft and upgrade each tool through Lv3. Every
  level is +1 damage on its node kind (Lv1 axe = 8 hits a tree,
  Lv3 = 4), Lv3 also yields +1 per node. Costs scale (6W/3S to
  craft, up to 24/14 + 5 ingots at Lv3). Tool levels and stamina
  show on the BASE screen. Your partner obeys the same physics now:
  a command toss sends them to WORK the node hit by hit (2 dmg a
  strike) instead of insta-gathering it.
- **The sprout-first opening.** Quest 1 is now TEND THE SPROUT
  PATCH: a soil patch south of the clearing where three baby sprouts
  sleep. Press A and they wake, waddle to the apple trees, pick an
  apple, carry it back to the Lantern on their heads, and deposit it
  (+1 berry to you each trip). Three deliveries and THEY GREW —
  that's when the choice clearing opens. Befriending now pays the
  fantasy forward: your partner joins, and the other two sprouts
  become your first throwing buds (+3 partner type, +2/+2 others),
  so your first catch is literally made with the sprouts you raised.
  Old saves skip tending (derived from facts, as always).

**Verification:** all 12 Sproutwild suites green (new `sw12`:
15-hit tree with stamina math, winded refusal + regen, axe/pickaxe
crafting with costs, 8-swing axe tree, partner working a rock hit by
hit, grown-sprout grants; sw4 plays the tending PHYSICALLY — buds
fetch all three apples unaided), soak green, Rootdeep green,
0 console errors. Renders viewed: `v34-patch.png`, `v34-tend.png`
(buds scattering to work), `v34-chop.png` (HP bar + chip over a
tree), `v34-tools.png` (one overlap caught + fixed before shipping).
**Phone status: unconfirmed — awaiting Will.**

## v3.3 — "Leader, working menus, a world that feels like Sprouts" (2026-11-14)

Will's list from playing v3.2: pick who's party leader; fight scenes
look terrible; D-pad doesn't move right in battle menus; battle text
overlaps; and the world — not just the characters — needs to feel
like Sprouts.

- **PARTY LEADER.** Pause → PARTY → press **A on any partner to make
  it the leader** (★ LEADER). The leader walks with you in the
  overworld and opens every battle. A on the leader still uses a
  Tonic; START still sends to the box. Order is saved.
- **Battle menus navigate like they're drawn.** The menu, move list,
  and bud picker are 2-column grids, but the cursor used to move in
  a straight line — DOWN from FIGHT landed on BUD (visually right),
  which is why the D-pad felt broken in fights. New grid navigation:
  LEFT/RIGHT step across, UP/DOWN step a full row, matching the
  picture. (Three test drivers had to relearn the same lesson — one
  had been fleeing fights by accident.)
- **Fight scenes rebuilt as a place.** No more two-tone void: battles
  happen in a little diorama of the sector — sky, a tree line on the
  horizon, the sector's own grass with flowers and tufts, a dirt
  patch worn under your partner, raised platforms, idle bobbing, and
  framed HP boxes with a type-colored plate. Gloom Hollow gets a
  night sky and a moon; the Ember Wastes a sunset. The bottom panel
  grew (52→56px) and every phase — prompt, moves, bud picker, party —
  got its own non-overlapping layout; the bud picker is a 2-column
  grid now, so six bud types fit on screen.
- **The world, Sprouts-ified.** Every sector palette lifted toward
  Sprouts' bright lawn greens (Gloom and Peak keep their moods,
  lifted a notch). Ground detail: pink/white flowers and clover in
  the speckle pass. Lantern posts now line the dirt roads — it's a
  Lantern world, the road should glow. Split-rail fences flank the
  base gate, and the gym grew windows and a gold door frame.

**Verification:** all 11 Sproutwild suites green (new `sw11`: leader
reorder + leader opens battles + tonic-on-leader, full grid-nav
sweep of menu/moves/budpick), soak green, Rootdeep playtest green,
0 console errors. Renders viewed: `v33-battle.png` (the new stage),
`v33-budpick.png` (grid + KIN!/STRONG/WEAK), `v33-party.png`
(★ LEADER), `v33-base.png`, `v33-meadow.png`. One render defect
caught and fixed: the PARTY header subtitle collided with the title.
**Phone status: unconfirmed — awaiting Will.**

## v3.2 — "Throw sprouts, not orbs" (2026-11-14)

Will's idea, fleshed out: *instead of throwing orbs, you throw
sprouts — and the sprouts command the creatures.* Plus a graphics
push: "GBA Pokemon looked better… you shouldn't just walk right
over the trees."

- **BUD TOSS recruiting (orbs are RETIRED).** In battle, ORB is now
  **BUD**: pick a sprout bud from your crew and throw it. The bud
  lands on the wild's head and *takes command*. Odds = species catch
  rate × missing-HP factor × **kinship**: same type ×1.5 ("KIN!"),
  type that beats it ×1.25 ("STRONG"), type weak to it ×0.75
  ("WEAK") — the picker shows the tag before you commit. Sun Orbs
  are gone from the HUD, the pause menu, and the Cottage (which now
  sells a random bud for 12 petals).
- **The bud economy is a loop, not a shop.** Befriending your starter
  grants +3 buds of its type. Winning a wild battle: the loser's bud
  hops over to your crew (+1). Gathering: 25% chance a bud pops out
  of a node. Nursery harvest: +2 buds alongside the partner. Run dry
  and BUD refuses with the lesson — *win battles to earn buds* — so
  the loop can never soft-lock. Old saves get a starter pack
  (2 EMBER / 1 PEB / 1 DEW / 2 LEAF) on load.
- **Command toss (the other half of Will's idea).** In the overworld,
  **B throws a bud** where you're facing. If it lands near a resource
  node, your lead partner dashes over and gathers it for you — you
  command your crew by throwing sprouts at the work. Costs nothing;
  it's an order, not an item.
- **GBA pass.** Scenery trees and rocks are solid now, and trees are
  **depth-sorted**: walk behind a canopy and it covers you; walk in
  front and you're on top — no more strolling over the treetops.
  Tall grass is a real blade field (hundreds of two-tone blades per
  patch, seeded, with flower flecks), wild sectors got a dirt road
  from the Gate, the base path turned to dirt, and the ground checker
  softened under large seeded light patches.

**Verification:** all 10 Sproutwild suites green (new `sw10`: starter
grant, budpick flow, exact one-bud-per-throw spend, EMBER-commands-
FERNFANG recruit, zero-bud refusal + win-grant recovery, command-toss
gather, trunk collision), Rootdeep playtest green, 0 console errors.
Renders viewed: `v32-budpick.png` (picker with STRONG/WEAK tags),
`v32-toss.png`, `v32-meadow.png` (tall grass + road), `v32-depth.png`
(player behind a canopy), `v32-command.png`. First capture attempt
caught a rig mistake (console never powered on — shots showed the
Sprouts cartridge); re-captured properly before trusting them.
**Phone status: unconfirmed — awaiting Will.**

## v3.1 — "Know your dude, meet the Gate" (2026-11-14)

Will's calls, from playing v3.0: picking a starter should explain the
creature and confirm the choice; starting at the bottom next to the
travel sign feels wrong — travel should be a *thing* (a teleporter)
that a character introduces; trees and rocks need to look nicer.

- **Starter cards.** Walking up to a sprout no longer befriends it
  instantly. A card opens: big sprite, personality line, full stats,
  the species' flavor text, work skill, starting moves, and its Lv16
  evolution. **A: BEFRIEND · B: KEEP LOOKING** — backing out costs
  nothing and the other sprouts keep waiting. (New state `g4choice`;
  confirm calls `wBefriend()`.)
- **The Lantern Gate.** The wooden MAP sign is now a stone teleporter
  arch with a glowing portal, in every sector. First time you use it
  (quest 2, exactly when travel unlocks), **Louie stops you and
  teaches it** in a 3-page dialogue — what it is, that roads past town
  need Sigils — then hands you the map with the Meadow preselected.
  B defers the lesson; it never triggers twice, and established saves
  are never ambushed (it only fires at quest exactly 2, from the sign).
- **You start in the heart of the base now.** Spawn, Louie, and the
  starter clearing moved from the south gate to mid-field. The Gate is
  a destination you walk to, not the floor you spawn on. Blackouts and
  returns also land at the heart.
- **Prettier wilds.** Trees rebuilt: tapered trunks, root flares,
  branch stubs, three-layer canopies with gold fruit glints. Rocks are
  faceted boulders with a crack and moss. Bushes got an outline layer;
  the ground sprouts little grass tufts among the speckles. Same draw
  functions serve nodes and decor, so every sector got the upgrade.
- Text caught up: objective and Louie's guide lines say "Lantern
  Gate," and Louie has a new tip about it.

**Verification:** all 9 Sproutwild suites green (new `sw9`: all three
starter cards open/back out, FERNFANG confirm, gate lesson A and B
paths, established-save sign behavior), Rootdeep playtest green, 0
console errors. Renders viewed: `v31-choice.png` (card — a clipped
SPD stat was caught and fixed), `v31-gate.png`, `v31-gateclose.png`,
`v31-meadow.png` (new trees/rocks), `v31-baseheart.png`.
**Phone status: unconfirmed — awaiting Will.**

## v3.0 — "Room to breathe" (2026-11-14)

Will's screenshot of v2.4: the base was a cramped gold plot with the
sign, Louie, the player and prompts piled into one corner.

- Base became a 480×520 field; the plot fence was deleted — build
  pretty much anywhere (placement paints a green/red validity grid).
  Old saves migrate once via a localStorage stamp.
- Sign corner decluttered (arrival beside Louie; sign alone south).
- The Meadow became the wild road; new **Lantern Town** sector
  (houses, dirt street, Pip + the Elder) holds Ranger's gym.
- Text-box intro replaced by a real opening cinematic (night, the
  Lantern, falling seed-light, sprouts waking, keepers gathering, the
  four Sigils; B skips).
- **Sprout Nursery**: plant a sprout type for berries, tend it through
  3 growth stages, harvest a new Lv1 partner. Growing added alongside
  Sun Orb catching — dropping orbs entirely is Will's call, still open.
- Workers earn work XP per production tick (+1 skill per 3 XP, cap +3).

**Verification:** 8 Sproutwild suites + Rootdeep suites green, 0
errors; renders viewed (cine0/cine3, basespawn, basemid, town,
towngym, nurmenu). **Phone: played by Will — his v3.1 feedback above
came from this build.**

## v2.4 — "The hook pass" (2026-11-14)

Will: "hard to pick up, introduction's not good enough, text overlaps,
needs to hook better." Story cut 8 lines → 4 beats; starter menu
deleted — three sprouts wander into the clearing, walk up + A to
befriend; quest reordered (Louie → befriend → catch → Cottage → Bed)
with a can't-fail intro catch; wild sprouts visibly wander sectors
(walk into one to battle it); quest state derived from facts on load;
text hygiene (opaque banners, name-label pills, wrapping say bar).
7 suites + soak green. Shots: arrival/choice/meadowwild/basevista.

## v2.3 — Scrolling world + phone feel (2026-11-14)

Every sector became a 480×360 scrolling world (was one fixed screen);
4-way GBA movement (last-pressed wins); shell tap minimum-hold fix
(sub-frame taps were being swallowed — why buttons felt dead); lead
partner follows in the overworld; bigger trees/rocks; battle layout
re-anchored to two ground points, verified at two viewport heights;
intro re-derived from save facts. 143 checks + soak green.

## v2.2 — Audit pass (2026-11-14)

12k-frame soak found and fixed a real blackout soft-lock (party wipe
never returned control). Gym teams Monte-Carlo retuned (were 8/8
victory laps → fair ~6–7/8). Lantern Shop spends gratitude hearts
(Sawmill/Statue plans). Lv16 starter evolutions. Champion finale at
Zephyr Peak. First-battle tutorial lines.

## v2.1 — The intro quest (2026-11-14)

Proper opening: Louie hello → gather → Cottage → Garden Bed → first
catch, with an objective bar; travel gated until the Cottage stands;
gym leaders refuse until the first catch; old saves migrate.

## v2.0 — Base Levels (2026-11-14)

Base Levels 1→3 via mission boards + ringing the Base Lantern; plot
and worker caps grow per level; gratitude hearts (Dragon Quest
Builders-style); Louie as a talkable guide (SHOW ME physically leads
you to your next goal); discovery banners; keeper switching
(Will/Erin/Marcus with passives + once-per-battle signature moves).

## v1 — First build (2026-11-14)

Will's brief: "GBA Palworld in the Sprouts universe" — sectors instead
of an open world, base building as the goal, gym battles, no guns.
12 wildsprout species kin to the 6 Sprouts types, Sun Orb catching,
GBA-layout turn battles, 4 Sigil gyms, grid base building with
worker production, Field Guide, Louie at base. Cartridge 3 in a new
combined trilogy file (the Rootdeep handoff file untouched).

— lil Bottie 🤖 · *kept with Will, at his direction. bzzt.*
