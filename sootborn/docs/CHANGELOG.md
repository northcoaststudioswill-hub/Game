# SOOTBORN — changelog (latest v0.67 · 2026-11-19)

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

## v0.65 · 2026-11-19 — the reorder: the Assay and the training years now run forward
You approved the proposed timeline. Nothing was cut and nothing was rewritten except one line; pieces moved.

**What moved**
- **Ashgate, that night:** the Table, the lesson, the Drill, then **No Gloves** (it used to be dreamed a night later), "three years of that", and then **the Camp** (Assay day 3). The Ford is no longer here.
- **First Fire, before the ceremony:** **the Ford** (day 19) only. The Lamp, the Dais and the Proctor no longer interrupt the festival.
- **First Fire, that night:** what the Assay is, then **the Island** (night 25) and **the Standard** (day 26).
- **The Ledger, that night:** **the Lamp** (28), **the Dais** (30), **the Proctor** and **On the Ground** (31), and the dream still ends on the white room and "I wake before I see what she does".
- **The Way Out:** after Ilse, one last dream: **the Last Night** (49) and **the Keep**. Then END OF PART ONE, and the Pinning follows the Keep directly.
- So after the cold open in the Valley, the order is: made (½, 2, 2½ years) → Assay day 3 → 19 → 25 → 26 → 28 → 30 → 31 → 49 → the last day → the Pinning → the Spire.
- One line changed to fit: the dream that explains the Assay said "for forty days"; it is now told on day twenty-five and says so.

**Going back**
- The game as it was is kept as a separate playable copy in your artifacts, **"SOOTBORN — v0.64, before the reorder"**, as the branch `sootborn-v0.64-before-reorder` in the repo, and the old order is written down in the plan.

**The plan document, rewritten** ("the master plan: order, people, gaps, cutscenes, grades, budget")
- The order as it now plays, and as it was.
- **People:** every named character with a short bio, what is told, what is not, and what they are for in play (a fight, a level, or somebody standing in the world).
- **Where the game does not match its own writing:** nobody below carries the seat knife the story is built on; Kael never wears the Proctor's white cloak; he has the boots nine days before he can fly; as a clerk he is still in Assay plate; Oswin's leg; Lucan's stick.
- **Eight deliberate animations** that would tell the story cheaply (hand flat on the pipe; counting the knives back; who turns their head).
- **Cutscenes graded** one by one for writing and art, with what I would want to see. Overall: writing A−, art B−.
- The game graded part by part with cost, and a revised split of where to spend.

**Checked:** the whole-story bot from New Game to THE END in the new order, no errors; the page loads clean. **Not checked:** by hand; whether any line elsewhere still talks about a dream as though it came in the old order (I changed the one I found and did not read every line for it); the Dev menu's dream entries were relabelled but not each played.

## v0.64 · 2026-11-19 — one clock: every card counts from the furnace; the days below have names
From your notes: the time cards do not make sense ("four years later", "two years before") because the point they count from keeps moving; the little menus still say Day 1, Day 2 from when there were going to be four days; run a bot through the whole story to see how it flows, then lay it out, propose a better timeline, and grade the game.

**Time cards**
- **Everything is dated from the furnace now.** No card says "from now", "later", "earlier" or "ago". About sixty cards, captions, level titles and memory captions changed. Examples: "FOUR YEARS FROM NOW" → "FOUR YEARS AFTER THE FURNACE"; "ONE YEAR AGO" → "ELEVEN MONTHS BEFORE THE FURNACE"; "FORTY-ONE DAYS AGO: the fever" → "FOUR DAYS BEFORE THE FURNACE" (it was never forty-one days before anything); "FOUR YEARS EARLIER" → the real date of the scene it returns to; memories inside the comic levels ("TWO YEARS AGO. THE DOCK STAIR.") → "SEVEN YEARS AFTER THE FURNACE. THE DOCK STAIR."
- Two that were simply wrong: the Count hall called last year's Assay "the Assay of four years ago"; the Drill had no date at all (it is two years after).
- People still say "nine years ago" in their own voice. Only cards are held to the rule.

**Day 1, Day 2, Day 3, Day 4 are gone**
- The four days below are **Ashgate** (41 days after the furnace), **First Fire** (42), **The Ledger** (43) and **The Way Out** (160). The top-of-screen line, the pause menu, save slots, Continue, the wake-up buttons, the end-of-day sheets, chapter cards and the Dev menu all use the name and the date.
- "Day three" now only ever means a day of the Assay.

**The whole story, played by a bot**
- A new bot starts a new game and goes to THE END, unable to lose, logging every card, fight, level and menu in order. It ran clean in eight minutes. It jumps the four free-play stretches.
- What it showed is in a new project document, **"SOOTBORN — the script in order, a proposed timeline, and where to spend"**: the full order as built, what is wrong with it (the Assay plays day 40, 1, 19, 28–31, 49, last, 3, 25, 26), a proposed order that moves pieces without cutting any, grades for each part of the game, and how I would split the budget.
- **Nothing has been reordered.** That waits for your yes.

**Checked:** the bot's full run; all five Part Two chapters build; no contractions in Accredited lines; the Assay calendar strip still lights the right day; the page loads clean. **Not checked:** by hand; whether any card now runs off a small screen (the new ones are longer; the big ones wrap).

## v0.63 · 2026-11-19 — the torso and the blade in the arena
From your note: do the torso and blade in the arena.

- **Torso** (Kael and everybody on the same body): gilt rims down both sides of the breastplate and along the collar; a rim on each of the two lames below it; a leather baldric across the chest with a buckle; a back plate with a rim and two shoulder-blade ridges; a pouch on the right hip; and for anybody who carries a sword, a scabbard hanging off the left hip with a gilt locket and chape.
- **Blade:** it was a flat glowing bar. It is now a sword: a dark ricasso with a gilt band above the guard, three lengths that narrow toward the point, a bright edge down each side, and a gilt fuller that stops two-thirds of the way up. The grip has three dark bindings. The hook at +5 and after, and the plain point before it, sit on the end as they did.
- With v0.60's arms and legs, that is the whole figure gone over.
- Seen in two close pictures of the Pairing: the plate, gauntlets, scabbard and tapering blades all read.

**Checked:** two close pictures; the opening film; bots won the Pairing and the last duel; the page loads clean. **Not checked:** in motion or by hand; the extra pieces on a phone (about forty more small shapes per fighter; Low graphics draws them too).

## v0.62 · 2026-11-19 — the Proctors
From your note: do the Proctors (the watchers behind the fights, as detailed flat figures).

- **The 3D fights can now stand a drawn figure in the scene.** That was the missing piece: the renderer could only draw shapes and glows. A flat figure is drawn with depth like everything else, so a fighter who crosses in front of it is in front of it.
- **The Proctors are drawn, not built.** Five of them, each about twice the detail of anybody else on screen: a tall white hood with a gilt band and a stone in it, gold eyes, a mantle with a gilt edge, a robe with folds and a gilt hem, a stole in their own colour down the front with the Watcher at the chest and tally marks below, and boots burning blue under the hem, because they do not stand on anything. Three carry the Watcher on a staff; two hold the grading book open. The senior one is in ivory with a violet stole and a small crown on the hood.
- **Where:**
  - **The Assay valley** (the opening battle, the Ford, and the films that use them): five on the dais, in place of the five white cones. They ride up and down a little on their boots.
  - **The Pairing room** (Dorian): the gallery was a ledge too high to see, with grey cones on it. It is now a low balcony with a gilt rail between the pillars, and the Proctors stand on it in the dark, eyes lit. These are the ones behind your fight with Dorian.
- The valley at night and the ford at dusk tint them to the light; lightning shows them white.

**Checked:** the five figures on their own in a picture; in the valley and in the Pairing room in pictures, with fighters in front of them; the opening film still plays; bots won the Pairing and the Valley; the page loads clean. **Not checked:** by hand; on a phone (it is one more small draw per figure, five in the valley and fifteen in the Pairing room); the Keep, where Celestine and two Wardens on the dais are still built from shapes.

## v0.61 · 2026-11-19 — two early memories to walk in; held cuts strain; the air moves written down
From your note: early story beats from the list, animation, and the fight moves.

**Two early memories, in 2.5D** (optional, once per save, they set nothing the story reads)
- **Row K, the morning after the First Fire.** Offered at the ledge of painted suns by your own door on Row K. The row is up before you: Seren on the step with the washer on her finger ("the inside half"), Nan Orla who has done your sheets in her own ration water, Garrow on the man Seren bit at fourteen and the knot it cost her, Mara giving you first bell and not the day, Tavi working out that he has a sister, Bryn hauling. Leave by the door of K-7.
- **The fever ward, the first night the fans came up.** Offered at the ward board in the clinic. Every fan on the branch turning, a row of cots along the wall, the board at 40/40. Nell will not ask how. Seren: "I'm not married to a thief. I'm married to a man who tidies", which Celestine will say almost word for word three nights later. Tavi can breathe right to the bottom. Pip asks about the sky; Ada wants the fan left loud; Mosi is drawing somebody with a sun for a head. Leave by the board.
- With the square (v0.59) that is three walkable memories in the first days below, each hung on something you already look at.

**Animation**
- **Held cuts in the films are no longer dead still.** A blade frozen at the hardest point of a swing now strains a little, the way a held blade does.
- (From v0.60, for the record: guards, bosses and Tavi re-kitted; arm and leg plate in the arena.)

**Fight moves**
- The air hook and the cut-down (v0.60) are now in the pause menu's move list in any fight with boots, and in the opening tips for keyboard and controller.
- They work in the 2D fights that have boots as well as the arena ones; it is the same code.

**Not done, and why**
- **The Proctors as detailed flat figures in the 3D valley:** the 3D renderer cannot draw a picture standing in the scene yet, only shapes and glows. That is a renderer job, not a drawing job; it stays on the list.
- **A real run and sword combos from the free library:** still waiting on the file (see v0.60).
- **A drawn scene for losing below:** still a line.

**Checked by script:** both new places walked (move, talk, leave) with a picture of each; the opening film still plays; a bot won the Pairing; the page loads clean. **Not checked:** by hand; held cuts in motion. (All three memory offers were driven through the dialogue system by script: each opens its place, closes the dialogue under it, returns to the world with its closing line, and is not offered a second time.)

## v0.60 · 2026-11-19 — characters first: guards, Rook and Tavi re-kitted; arms and legs in the arena; the boots in the arena follow you up
From your notes: do characters and animations first and use good free resources if there are any; in arena fights the camera should follow you up on the boots, with a zoom on the big dives, and the arena needs the boots-hook-hit combo.

**Comic levels: everybody but Kael was wearing a coat and nothing else**
- **Dock Guard:** white enamel shoulder plates with gilt rims, a breastplate and back plate, bracers, greaves, knee and ankle rims, a belt with a pouch and a teal lamp on it, hands with a thumb. His stick is now a dock bill: a long boat hook with an edge and a back spike.
- **Stair Blade:** a short mantle with a gilt edge over the cowl, bracers, a belt with a second sheath, knee and ankle wraps, hands.
- **Warden:** steel plate with red rims on chest, back, arms, thighs and shins.
- **Stair Captain Rook:** coat buttons, a ribbon bar on the chest, a red belt with a buckle and a sheath, gilt cuffs, bracers, hands. The Warden Captain and the Auditor's Blade get the officer's version of the same.
- **Tavi:** a bedroll across his back, a strap and a satchel, a scarf, patched cuffs, a lamp on his belt.
- Seen in a line-up picture beside Kael, before and after.

**Arena fights: arms and legs** (Kael and everybody built on the same body)
- A band on the upper arm, a cop on the elbow, a vambrace with a rim, a gauntlet plate, and three fingers on each hand where there was a mitten.
- A tasset at each hip, a point on the knee, a plate behind the calf, a second rim at the ankle.
- These are small at fighting distance; they show in the films' close shots.

**Arena fights: the boots**
- **The camera goes up with you.** It rises as he rises, so a dive is seen from where it starts.
- **It closes in on a dive.** While he is coming down (the slam, Shaft Drop, a dive kick) the picture pushes in by about a quarter, and a slam started from high up gets a beat of slow motion.
- **Hook from the air** hauls an ordinary man up to him (UP HERE), and gives a little lift and boot fuel back. **Strike** while he is up there cuts him down (STRUCK DOWN): three times the blow, and he goes into the ground. Against captains and duellists the hook still takes Kael to them, as before.
- By script in the High Docks arena fight: the camera rose from 89 to 174 as he climbed; the hook put a guard at his height; the cut took 19 health to 12 and floored him; the picture pushed in from 150 to 184 on the dive.

**Free resources: one found, not used yet**
- Quaternius's Universal Animation Library is CC0 (public domain; fine to sell with) and has a sprint, a jog, deaths and three- and four-hit sword combos. I could not download it from here (this workspace cannot reach that site), and it is made for a different skeleton, so it has to be converted to the game's joints.
- **If you attach "Universal Animation Library [Standard].zip" (about 14 MB, free from quaternius.com), I can take the run, the jog, a death and the sword combos from it and put them on Kael and the guards.** That is the real fix for a run that I have only ever adjusted from stills.

**Checked by script:** line-up pictures of all the re-kitted figures; all three levels start to end; the arena boots camera, air hook and cut-down measured as above; a bot won the Pairing; the page loads clean. **Not checked:** any of it by hand or in motion; the arena arm and leg detail was seen only at fighting distance, where it is a few pixels; the Stair's and Riser Nine's figures were rendered but half hidden by scenery in my pictures.

## v0.59 · 2026-11-19 — the HUD in the comic levels, found from your screenshot; the fire scene in 2.5D; a memory to walk in
From your screenshot of Riser Nine on the phone, and your notes: the tap prompt can go; keep the fire scene in 2.5D; when a 2.5D space is made, use it for story that adds flavour and changes nothing.

**The HUD in the middle of the comic levels: the real cause**
- Your screenshot showed the health bar missing and the objective a third of the way down the picture. That was not where I had put them.
- The level's page was asking the phone how tall the notch is, and moving its health bar and objective down by that much. That is right for a page that fills the phone. The level is a small frame in the middle of the screen, and your phone was answering with about a hundred points, so everything slid down into the picture and the health bar ended up under the message strip.
- The level no longer asks. Health and fury are back in the top-left corner, the objective in the top-right.
- I reproduced it here by forcing the same answer (health bar and objective move down by forty points; with the fix they stay at the top). My two earlier attempts moved things that were never the problem; the smaller message strip and the fainter marker from v0.58 stay, since they are still better.

**Tap prompt**
- "TAP TO CUT. HOLD THE SAME BUTTON…" is gone from the comic levels, with the older "ATTACK THREE TIMES" one.

**The fire, night twenty-eight, in 2.5D (the Lamp)**
- When you have seen enough and go to the fire, the camp is now a place with depth: flat figures standing in it, tents and the two standards behind, pines, rain. Forty of House Violet in a ring round the fire, nobody sitting; thirty of Teal at the edge of the light, darker.
- You walk the circle. Petra, Oswin, Corin, Merrow and a cadet in a borrowed cloak each have something to say; the standards can be looked at. None of it is needed and none of it changes anything.
- Go to the fire and SAY THE NAME: the scene you already know follows exactly as before (the one name, the right and wrong outcomes, the duel).
- It plays once per attempt at the mission.

**A memory to walk in: Ashgate Square, an ordinary night** (Day 1, optional)
- At the Pillar, after the chalk sun, there is a new choice: stand here a moment. It opens the square a year and more ago, just after last bell, in the same 2.5D: Seren chalking a sun, Tavi and the green in the broth, Bao and the stamp, Hollis humming, Mara standing between them and the east arch, Ivo and his cart.
- Nothing happens in it. That is the point of it. Leave by the chalk sun.
- Once per save. It sets nothing the story reads.

**How the 2.5D places are built** (so more can be added quickly)
- They use the 2D fights' own floor and figures with nobody to fight: a painted floor in perspective, people and props standing on it as flat figures sorted by depth, a camera that follows. A place is a short list: who stands where, what each says, what is behind them, and where you leave.

**Checked by script:** the notch reproduced and fixed, by measurement; both places walked (move, talk, leave) with pictures; the Lamp hands off into the circle and on to the accusation; a second visit to the fire goes straight to the name; bots still win the Scuffle and the Pairing; Part Two builds; the page loads clean. **Not checked:** on an iPhone (the fix is by reasoning from your screenshot plus a forced test, not a real notch); either place by hand; how the circle feels with forty figures on a small screen (it is crowded near the fire).

## v0.58 · 2026-11-19 — nothing in the middle of the screen in the comic levels; mashing no longer pins a man to the floor
From your note on v0.57 (the UI in the comic levels is still in the middle of the screen), and from the open list.

**Comic levels: the middle of the picture is clear**
- I took pictures of the first level in a phone-sized frame, sideways and upright, and two things sat in the middle:
  - **Messages** ("TAP TO CUT. HOLD THE SAME BUTTON…", SAVED, REMEMBER and the rest) came up as a wide cream box across the upper middle. They are now a small dark strip in the top-left corner, under the health bar.
  - **The objective marker** (the yellow diamond with the distance) sits on whatever it marks, which is usually straight ahead, on top of Kael. When the thing it marks is on screen it is now half the size and faint. It goes back to full size at the edge of the screen when the way is behind you or off to one side.
- Health and fury stay top-left, the objective top-right, prompts at the bottom.
- The red band across the screen on rage moments (LINE STRUCK, LAST BELL, ON MY BREATH) and the count on ELEVEN are meant to cross the picture and are unchanged. If one of those is what you mean, say so.
- **If it is still wrong, a screenshot would settle it**: I cannot see your phone, and this is the second time I have guessed at it.

**Fights: why mashing still won below**
- A bot that only presses strike beat Tam and Bryn in the Scuffle without being touched. The reason: the third blow of the chain knocks an ordinary man down, every blow on a man who is down did extra damage and reset the time he stays down, and if he did get up he was knocked down again before his swing finished. He spent the whole fight on the floor.
- Now: one extra blow on a man who is down, and after that he gets up. He gets up with his guard raised, and for two seconds after getting up (or after blocking) he cannot be knocked off his feet or out of his swing by anything but a heavy blow. A light hit no longer shoves a man who is mid-swing out of his own reach.
- This applies to every 2D and arena fight, not only the Scuffle.
- The same mashing bot now: beats Tam with two health left of six (untouched before), beats Bryn with one, loses to Dov. A bot that dodges wins all three with three, two and five left. At the Pairing both bots win, and both need the second wind.

**The Scuffle**
- The people round the chalk are Row K's (Nan Orla, Garrow, Wick, Sela, whoever is not fighting), and the square's lamp posts are gone from it.

**Checked by script:** the level's HUD in pictures, sideways and upright, before and after; the bot results above; the page loads clean. **Not checked:** by hand; the marker when the goal is off screen (not pictured); whether the harder fights below are now too hard for you (they are tuned to bots).

## v0.57 · 2026-11-19 — more from the list: memories that fit the year, figures that breathe in the films
Still working down the open list. Nothing here was played by hand.

- **Memories in the comic levels now fit when the level happens.** All three levels shared the docks' set, so Riser Nine (five years after the furnace) said "seven years". Riser Nine has its own five: the count, the order for Tier Four, the forty beds, this valley, the ring. The Stair has its own five: Brand's eleven minutes, the count ("nine years; today we stop counting"), two years in the weather, the shelf, her line.
- **Figures in the films breathe.** Anybody standing in a film shot was a statue, because the clock that drives the idle sway was stopped for them. They shift their weight and look about now. Held cuts stay held.
- **Stair Blades have a second blow**: the lunge, or a straight thrust.
- **Opening film:** "One valley. Twelve Houses. One year." said the wrong length. The Assay is one season; the caption says so.

**Checked by script:** the opening film captured shot by shot; Riser Nine and the Stair start to end; all five Part Two chapters build; the 2D missions complete; no contractions in Accredited lines; the page loads clean. **Not checked:** the new memories on screen (they appear on every fifth kill, which my script does not reach by fighting); the breathing in motion.

## v0.56 · 2026-11-19 — down the open list: a run with arms, guards with three blows and a guard, the fleet, the Scuffle's own row
Worked from the open list while you were away. Nothing here was played by hand.

**Found: why story beats stopped showing from the Dev menu**
- Opening the **Training room** from the Dev menu switched on "Skip fight intro films" and never switched it off. From then until the page was reloaded, every fight skipped its opening film and its memory cut-ins. Leaving the training room, by any route, now puts the switch back the way you had it.
- If beats are still missing after this, tell me which entry.

**Comic levels**
- **The run has arms.** Both arms hung in front of him with the elbows locked. Now one drives forward as the other goes back past the hip, elbow opening on the back swing, and the hook trails low behind on its side. Checked on an eight-frame side-on sheet.
- **Guards have three blows.** A Dock Guard picks one each time: the cross cut he always had, an overhead chop, or a straight thrust from the hip. If he follows with a second blow it is a different one. Wardens mix their overhead with a wide sweep.
- **Guards guard.** A Dock Guard who is facing you and not mid-swing will sometimes turn a light cut on his weapon (TURNED.): steel up across the body, a fifth of the damage, pushed back a step. He cannot do it again for about two and a half seconds, and never against a heavy blow, the hook, the boots or ELEVEN. Sixty light cuts by script: three turned.
- **The fleet over the Stair** (and the docks). The far ships were scattered at random and some sat inside each other. They now ride in two rings, one behind the other, spaced so no two can touch; the rings turn slowly against each other and rise and fall a little, and each hull has a riding lamp that winks.
- **Riser Nine: room at the start.** The first sun was three metres from where he stands up. It is eight metres up the road now, so there is a walk before the Wardens come.

**Fights**
- **The second wind remembers where the story is.** In the Assay it alternates the furnace with the Table ("They opened my bones so that I could stand here. So I stand."); on the Spire, Seren's line in the Count ("Holloway, S. The line is still struck. So I get up."); from the Fall onward, Brand ("Brand held a stair for eleven minutes. We can hold a floor.").
- **Losing a fight that can be lost** (the Scuffle, the Ember Ring, the Drill) now says something under KAEL IS DOWN: "I've been on this floor before. I know the way up."
- **The Scuffle is fought on Row K.** Behind the chalk: the doors with their lamps, the sun on K-7, the washing line, Garrow's post with its knots, the row watching.
- **Controller legend in arena fights.** With a pad in hand, one dim line in the bottom corner: X cut, Y kick, A jump, B dodge, RB guard, LB hook (no hook shown below the rock).

**Checked by script:** all three levels start to end after the changes; the run sheet; the guard's new blows forced one after another with no errors; the block counted; the Scuffle's backdrop and the losing line in a picture; a bot won the Pairing; the page loads clean. **Not checked:** anything in motion or by hand; how often a guard turning a cut feels right; the ring of ships seen in one still; the controller legend (no pad here); the new second-wind memories were not triggered, only written.

---
Older entries (v0.1 to v0.55) are in **the changelog archive**: `claude/sootborn-changelog-archive.md` in the project, `docs/CHANGELOG_ARCHIVE.md` in the repo.
