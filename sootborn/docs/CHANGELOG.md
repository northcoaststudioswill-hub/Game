# SOOTBORN — changelog

## v0.23 · 2026-11-18 — the fighting system: feel, structure, and a place to practise
From play notes: focus on building out and polishing the fighting.

**Feel**
- **Input buffering.** Every press of strike, kick, jump, dodge, guard or hook is remembered for a fifth of a second. Press the next move a little early and it comes out the moment the current one allows, instead of being lost. This is the single biggest change to how the fighting feels: chains no longer drop when you press fast.
- The enemy's drop attack locks onto its landing spot earlier and hits a slightly smaller circle, so you can walk out of it if you start moving when the circle appears.

**Structure**
- **Stagger gauge** on every named enemy (a thin gold bar under their health). Hits fill it; kicks, the boot, Breach and especially the ram fill it faster; a parry adds a large chunk. When it fills the enemy is STAGGERED for about two and a half seconds: cannot guard, cannot act, and takes half again as much damage. Duels now have a rhythm: build the stagger, then spend everything.
- **Style** (top right, under the hit counter): SPARK, EMBER, BLAZE, FURNACE. It rises faster when you use a move you have not used in your last three, and for parries and breaking a stagger. It falls when you stop hitting and drops by more than half when you are hit. Each rank adds 15% to fury gained.

**Readouts**
- **Cooldown tags** under the guard pips: HK (hook), RM (ram), WC (wide cut), BR (breach), DR (shaft drop), RO (roar). Bright when ready, dim with a small bar while recharging. Moves Kael has not learned yet at that point in the story are not listed.
- **Move list** in the pause menu during any fight: every move available in that fight, with the buttons for whatever you are playing on (touch, keyboard or controller), and the name of that fight's finisher.

**Training room** (Dev menu, top entry): the pump room with Brand. All moves unlocked, including boots. Nobody can lose: your health stays full, his refills, fury recharges on its own. He uses the long cut and the drop so you can practise reading them.

**Checked:** a burst of seven presses 90 ms apart produces the full chain; style reaches FURNACE with varied moves; the stagger fills and breaks; the move list shows 21 entries. Balance with the new stagger and buffering was not re-measured, and nobody has played it.

## v0.22 · 2026-11-18 — two ways of speaking, written into everyone
From play notes: make sure the language difference is written into the characters; more detail in the new scenes; polish.

**The audit.** I checked every line spoken by an Accredited character against the rule from the lesson (no contractions; "noted", "granted", "one", "my time"; never thanks, never sorry, never "we"). They were nearly clean already. The gap was on the other side: nobody below had ever actually said "aye" or "ta", anywhere in the game. The rule was taught but not lived in.

**Below (soot)**
- Seren accepts the proposal with "Aye. Obviously aye." and answers the heist question "Aye."
- Kael swears "on my breath" (to Seren before the heist, to Tavi about the sun). Mara: "She bought your breath, boy." and "not once in all your breath".
- Ivo, Tavi, Mosi and Mara say "aye" where they said yes, sure or okay. Nell says "ta" to the air.

**Above (Accredited)**
- Celestine no longer says "thank you" ("Noted. You have spared me the saying of it."), no longer says "us" or "let us".
- In the white room Kael says "Aye, Auditor" and she corrects him: "One does not say 'aye' in this room. It sounds like something a pipe does."

**The ones in between**
- **Vale** keeps his contractions, and now the story says why: born on Tier Two, counted up, says "noted" like a borrowed coat and "don't" when he is tired.
- **Wren** is the Accredited who slips. On Day 4 she hears Kael say "we" and says "What a useful word. One is never allowed it." On the Spire she says "we" and "forgive me" and he has to stop himself answering in his own voice. At the end: "We. I am practising. We touch the pipe. ...Aye?"
- **Kael** himself: Ilse's lesson now ends with him admitting he can no longer say "don't" inside his own head, which is why his narration sounds the way it does. His last soot word before the table is "ta", and Ilse tells him it is the last time for nine years. When Tavi arrives he says "Tav" and it comes out rusty. Before the stair he throws "one" away in front of everybody: "It's 'we.' It was always we."
- **Celestine at the end** (if sent below): she says "...Noted." and Kael says "Down there it's 'aye.'" The closing card adds that on the fourth day she said "ta" to Mara, and Mara pretended not to hear.

**Scenes**
- Wren is now drawn in Celestine's room on Day 4, at her gauge.
- Ivo is at the table in Row K for the leash-and-door argument.
- The Clerk's desk has a visitor standing at it: Wren (with her grease print) or Marshal Cade.
- Tavi and Kael face each other on the barge deck under a real sun.

## v0.21 · 2026-11-18 — more story and more scenes in the newer chapters
From play notes: keep improving the cutscenes, especially the new ones; more detail, more story.

**Four new illustrated scenes**
- **Row K**: Mara's room. A lamp, a table, a cot, a plant in a can, and the shelf with the tins on it. One tin at first, two after Day 4, and at the very end Kael standing in it, taller.
- **Freight Three**: the shutter, crates, the floor grating with light under it, and a cold crate breathing mist. It opens on greens.
- **The dock stair**: night above the weather, guards with lamps at the top, the barges drifting away, and Brand alone on the steps with a halberd. Then only the halberd.
- **In the weather**: a cloud sea at dusk with the stolen barges hidden in it, and then a deck with the Unlit lined up on it learning to fly.

**New people**
- **Sable** finally appears (she was named four times and never shown). She runs Freight Three and decides what nobody saw arrive. The cold crates are greens from the surface, marked for the Spire kitchens; four in forty reach Nell's ward.
- **Wren Halloran**, the one Accredited engineer who asks why. Kael teaches her to put her hand on the pipe in Day 4. In Part Two she half-recognises him on the Spire, and in the end she brings eleven engineers and the Array schematics to the Unlit.

**New story beats**
- *Day 3*: Mara and Ivo argue leash against door before he goes up; Tavi asks him to find out whether the sun is yellow. When he comes down Tavi asks, and he either lies to a child for the first time or says nothing and nods.
- *Day 4*: Wren; Sable; and a goodbye to Tavi that Tavi does not know is one.
- *Part Two, The Post*: he cannot sleep under a sky; Wren at his desk.
- *The Balancing*: Marshal Cade comes to his desk the morning after Riser Nine, forty lines short, and asks him what he would look for.
- *Two Years*: Brand's last stand is now told and shown. He was the Warden who struck Hollis for humming at Seren's commitment; he had been waiting eight years for a stair. Tavi arrives: "You got tall." "You got old." Kael keeps the promise seven years late. Wren arrives.
- *The Count*: Kael's words before the stair. After the square, he goes home to Row K; Mara does not get up; he opens the empty tin with his name on it, puts the washer inside, and sets it back beside Seren's.

**Checked:** every expanded chapter walks through with no errors. Not read or played by a person.

## v0.20 · 2026-11-18 — character models and lighting
From play notes: the fighting is good; the graphics and character models need to improve.

**Why they looked worse than they were.** Every piece of gold trim on every figure was drawn as a light source, and the glow pass then bloomed all of it, so in close-up a character was a white-gold smear with two glowing yellow rectangles for eyes. Fixing that mattered more than adding parts.

**Lighting**
- Gold trim is now lit metal, not a lamp: it takes light and shadow and catches a highlight. Only blades, gems, crowns and visor slits still glow.
- A specular highlight on everything, a harder edge between light and shade, and darkening toward the feet so figures sit on the ground.
- The glow pass is turned down (a third weaker in fights, more in films).

**Faces**
- Real eyes: whites, a gold iris, a dark pupil, an upper lid. They only blaze when Kael's fury is high, which now means something.
- Warmer skin, so pale Accredited faces stop reading as grey stone.
- Cheeks, a chin, ears, a fringe, sideburns and more volume in the hair.

**Bodies**
- Arms and legs are six-sided and tapered instead of square posts, with knee and elbow guards, calf plates and forearm plates.
- Hands have a palm, fingers and a thumb.
- Chest plates, abdominal plates, a spine and shoulder-blade plates, a collar ring, a belt buckle.
- **Kael** carries the bronze valve ram on his off forearm, with a lit rim.
- **Robes**: Celestine, Proctor Voss and the Wardens wear a full skirt that flares as they move, with a gold hem and centre band.
- **Wardens** have a face plate, cheek guards, a red visor slit and a crest. The Accredited wear a five-point crown.

**Camera**
- In one-on-one fights the camera now sits much closer, so the two figures fill the frame. Battles with several enemies or allies keep the wider view from v0.12.7.

**Not checked by a person.** Frame rate was only measured in a software renderer; the models have roughly 40% more geometry.

## v0.19 · 2026-11-18 — bosses with their own moves, the Count, Mara's fight, glimpses ahead
From play notes: keep adding content, fights, new moves that fit the story, more scenes, and flash-forwards in the first part.

**Boss attacks** (the named enemies no longer all fight the same way)
- **The long cut**: a red line drawn the whole length of the arena, then a cut along it. Jump it. Used by Marshal Cade, Lucan in Part Two, and Celestine ("STRUCK.").
- **The drop**: the enemy rises on boots, a red circle follows you and then locks, and they come down on it. Move. Used by Proctor Voss, the Auditor's Blade, and Celestine ("BALANCED."), more often when they are below half health.
- Celestine has both, the duelist's blink, and strings three cuts together. Her fight opens with a tip saying how to read them.

**New moves, earned in the story**
- **The Count** (from the Spire onward, when Kael is the Clerk): every hit on the same enemy is tallied above their head, THREE, FOUR, FIVE. Reach ELEVEN without letting three seconds pass and the line is struck: BALANCED, a heavy burst of damage. Guards interrupt it, so kick the guard open.
- **The shift song** (from the Fall onward, when there is an army to sing it): the roar now also heals Kael and his allies.

**New fight: Tier Six Stands** (Part Two, chapter 4). You play **Mara**, sixty-one, in the Bay Three furnace bay, at a commitment for a nine-year-old. 2D, fists, Hollis and Ivo beside her, two waves ending with a heavy Warden and Proctor Sull. Her own narration, two Memory Arts (FORTY-FOUR, THE SHELF), and her own finisher (TWO TINS).

**Flash-forwards in Part One**
- End of Day 2: after the Assay is explained, the dream slips further for a moment to a book as wide as a table and a pen in a gilded hand.
- End of Day 3: the white room years on, a wheel under his hands, humming, a cup stopping halfway. He wakes before he sees what she does.

**Fixes:** the fight HUD can show a hero name other than Kael.

**Checked:** each boss attack hits when ignored and misses when jumped or left; the shift song heals; Mara's fight starts in 2D with her name on the bar. Not played by a person.

## v0.18 · 2026-11-18 — Part Two quality pass
From play notes: bring Part Two closer to the first half: looks, story beats, cutscenes, drama, rage, music, emotion, fights.

**Places of its own** (Part Two no longer plays in borrowed rooms)
- **The Gallery**: the duelling hall, warm gold under three chandeliers.
- **Riser Nine**: the valley at night in rain and lightning, with the riser's hatch glowing orange and a line of small lights (the forty) moving away from it.
- **The Stair**: the Spire's lower terrace at a smoky sunset, a wrecked barge burning to one side, steps climbing to the white door, embers in the air.
- **The top of the Spire**: a gold arch framing the setting sun, light rays across the floor, her desk with the Count on it. The Assay's House standards are gone from the Spire scenes.

**Music** (three new generated tracks, all built on the shift song)
- **Spire**: cold glass and distance for the chapters above; her tune only arrives in the second half of the loop.
- **Final**: the last duel. The keep's ticking duel music with the whole tier humming the shift song underneath.
- **Dawn**: the shift song in a major key for the first time, for the ending.

**Cutscenes and staging**
- Kael is drawn gilded in every Part Two scene (he was still the soot sprite in the Spire rooms and at the end).
- **The Clerk's desk** (new panel): the Tier Four order, the seal, the pen moving, the signature.
- **The hum** (new staging): Kael at a valve wheel in Celestine's room, the wheel turning, the notes of the shift song rising from him, her cup on the table. The music cuts out when she puts it down.
- Lucan now appears in his own scene (it was showing Celestine).
- Celestine kneels in the last room.
- Heartbeats and held silences on the counting beats: finding Seren's line, the pen over the order, being recognised.
- A bell when the light reaches the square.

**Saving**
- Part Two remembers the chapter you reached. The title screen shows "Continue Part Two" with the chapter name.

**Checked:** all five chapters walk through to THE END with no errors; every Dev menu entry loads; the three new tracks render without errors. Not checked by a person: how any of it plays, sounds or reads.

## v0.17 · 2026-11-18 — Part Two: Above. The story now has an ending.
From play notes: finish out the story and the fights; set it all up, then flesh it out.

**The whole story is now playable from the opening film to THE END.** Part Two is five chapters, each an illustrated chapter with choices and one or two fights. It is a first full draft: written and wired, reusing existing places, with two new panels. No art pass yet.

**Part Two — Above** (starts from the end of Part One, or the Dev menu)
1. **The Post** (+4 years). Kael is Edric Sorrel, Clerk of the Count on the Sun Spire. The Count is a book with a line for everyone below; he finds Seren's. Lucan Aurel asks to be taught (befriend him or not: it changes chapter 3). Fight: **The Gallery**, a duel with Tyr Cade.
2. **The Balancing** (+5). The order to strike all of Tier Four crosses his desk (sign it, or lose it for a day). A letter from Dace: Tavi is twelve and on the wheel. Fight: **Riser Nine**, holding the top of a stair in a mask while forty people come up it.
3. **What She Knows** (+6). He hums the shift song at a valve in Celestine's room without noticing. She knows who he is, and offers him the Count after her. Fight: **The Son**, Lucan at the keep again; if they were friends he lowers his blade and gives Kael the dock key, if not he goes over the parapet. Then **The High Docks**.
4. **Two Years** (+7 to +9). Brand held the dock stair for eleven minutes. The Unlit learn to fly barges. Mara gets Tier Six off its knees. Tavi comes up at sixteen. Ilse gets her one joke. Then **The Fall**, now told as it happens.
5. **The Count** (+9). Fights: **The Stair** (three waves up the Spire, ending with the Auditor's Blade) and **Little Ember**, the last duel, against Celestine herself, with four Memory Arts and plain ELEVEN as the finisher. Then a last choice (strike her line, or send her down Lift Zero to live on Row K), Lift Zero left open all the way down, the square in real light, and Seren's chalk sun.

**Also**
- Day 4 now ends on the Pinning and offers "Begin Part Two". The High Docks and the Fall moved into Part Two where they belong.
- New panels: the Count (the ledger, names struck, hers) and Ashgate Square at the end.
- New place: the top of the Spire at sunset (the keep's geometry, relit, without the dais).
- New cast: Tyr Cade; Celestine as a fighter.
- Dev menu: all five chapters under Story beats, the same without fights under Cutscenes, five new fights, five new fight films.

**Known gaps**
- Part Two does not save its place; leave mid-chapter and you restart that chapter (each chapter is in the Dev menu).
- The Gallery reuses the pairing room, Riser Nine the storm valley, the Son and the Stair the keep.
- Kael's Spire name (Edric Sorrel), Tyr Cade, Brand's death, both endings and the cost of opening the doors are new canon. Nothing here has been played by a person.

## v0.16 · 2026-11-18 — Day 4, the end of Part One, and four more fights
From play notes: build the next parts and the fights, beautify later; should this take us near the end?

**Where this leaves the story.** Part One (Below) is now complete from the prologue to the night Kael leaves Cinderwell. The Assay, told in dreams and fights alongside it, is also complete: arrival, the Pairing, the Ford, the Standard, the Proctor, the Valley, the Keep, the Pinning. That is roughly the whole of the first book's shape, in our own story. Two fights look past it (seven and nine years on). Part Two (Above: the years on the Spire, the Unlit above ground, the road to the Fall) is not written.

**Day 4 — The Way Out** (new, plays from the end of Day 3)
- Four months of going up twice a week, learning how they talk and where the doors are. Celestine laughs, once.
- Mara works out that he is leaving. "Come back taller."
- Dace's plan: Kael Brennick has to die on paper, because the count always balances. Mara will get a second tin.
- **The Way Out** (new 2D fight): Proctor Sull and the night watch at the hatch, with Dace at Kael's side.
- Sull writes the report he is told to write. The tin goes to Row K. Kael goes out past Seren's chalk suns and meets Ilse. END OF PART ONE.
- Then the finale: the Pinning, the High Docks, the last dream and the Fall.

**New fights**
- **The Standard** (day twenty-six; end of Day 3): the Sisters Vey, two duelists at once, on the river island. Finisher TWO FOR ONE. Two Memory Arts.
- **The Pinning** (after the Keep; end of Day 4): Celestine sends her own champion down the steps. Boots on both sides. She pins the gold on Kael herself, says "you remind me of someone", decides he does not, and gives him the post.
- **The High Docks** (seven years on): Kael walks in through the front gate with the sun on his collar and the Unlit behind him to cut four hundred barges loose. Three waves, ending with Vant, who lost a river to him once.
- **The Way Out** (above).
- **The Fall** now plays last, after the High Docks, instead of after Day 2.

**Dev menu:** the four new fights, Day 4 as a whole chapter, Day 4 without fights under Cutscenes, and three more fight films.

**Not done:** no art pass on any of this (it reuses the upper landing, the tunnel, the ford, the keep and the barge deck). Nobody has played it by hand.

## v0.15 · 2026-11-18 — Day 3, moves that grow with the story, cutscenes in the Dev menu
From play notes: how many more days below, and can the game run longer with new content; put cutscenes in the Dev menu; new moves, finishers and flashbacks as he advances; the 2D fight as gilded Kael looks awkward and Kael's sprite needs work.

**How long is the part below?** Four days, then he leaves. Days 1 and 2 existed. **Day 3 is new.** Day 4 (the months of being "boring", and going out through the old tunnel to Ilse) is the last one and is not built. The years after keep arriving the way they do now: a dream each night, and the fights.

**Day 3 — The Ledger** (new, about 10 minutes, plays from the end of Day 2)
- Told as an illustrated chapter: panels, dialogue, three choices, one fight, one dream.
- Vale at first bell with the ledger. Carry it or refuse; either way Kael goes up, because nobody down there is offered a choice.
- **Lift Zero from the inside.** Nine minutes, nine floors, not six.
- **Celestine, alone.** She knows it was his hands on the wheel. She knew at the furnace. "Little ember." She wants him twice a week to teach her engineers what a valve is.
- **The window.** The sky is blue. The surface did not burn, or stopped a long time ago.
- **Dace, under the floor.** Alive, fed by Sable through the Freight Three grating. The Unlit get a name and members (Hollis, Nell and her cold crates, Sable). A woman who can make him look like them will find him when the watching stops.
- **Under the Floor** (new 2D fight): a Warden comes down the hatch. Kael and Dace put him on the ground. The first time one of them goes down. Memory Art: THREE STEPS.
- **Dream:** the day he arrives at the Assay.
- Two new panels: the upper landing with its window, and the old tunnel with the chalk suns.

**Moves and finishers follow the story**
- What Kael can do now depends on when the fight is:
  - Below (the Ember Ring, the Warden): fists, kicks, the boot, guard and parry, hook line, headbutt, roar.
  - Training (the Drill): adds the ram and Wide Cut.
  - Early Assay (the Pairing, the Ford): adds Breach.
  - Late Assay (the Proctor, the Valley): adds Shaft Drop.
  - Last day (the Keep): adds the boots.
  - The Fall: everything.
- Each fight that teaches something says so in its opening tips ("NEW: ...").
- **Finishers** change too. It is always eleven blows; the name, the lines and the last hit differ:
  - ELEVEN (below, the Pairing, the Valley)
  - BANKED (the Drill): he keeps a third of his fury afterwards
  - THE CROSSING (the Ford)
  - THE RECKONING (the Proctor)
  - IRON SKY (the Keep): the last blow throws the enemy into the air and Kael goes up after him
  - EVERY BREATH (the Fall): the last blow reaches every enemy on the deck
- Memory Arts were already different in every fight; Day 3 and the Drill add two more.

**2D fights**
- The moves added in the last two versions had no 2D animation, which is why gilded Kael looked stiff in the Drill. Every one now has its own body motion: a leg that actually kicks, the ram arm with its flash, the hook line as a rope, a low thrust for Breach, a spin for Wide Cut, the guard, the roar with rings, the plunge.
- Kael's gilded sprite redrawn by hand over the cadet template: pauldrons, brow and jaw, gold eyes, the scar, lit hair, the washer on its cord, the bronze ram on his off hand, cape folds.

**Dev menu**
- New **Cutscenes** list: opening film, both halves of the prologue, Last Bell, First Fire, all four dreams, Day 3 without its fight, and the intro and outro films of all six Assay fights.
- Fights list adds Under the Floor; Story beats adds Day 3.

**Lore pass** (read back through everything added today)
- The festival line said the speakers had played the shift song "for a year". The furnace was forty-two days before the festival; fixed.
- "Nobody has hummed it since" contradicted Hollis planning to hum; now "hardly anybody has dared".
- The Assay was described as for seventeen-year-olds while Teo was sixteen and Kael is a grown man; now "their heirs, the year they come of age", and Teo is "the youngest one here".
- Why Celestine does not know him at the Keep after seeing him twice a week: the gilding gives him "a face my own mother would walk past", and the Assay dream says so outright.
- Day 3 no longer assumes Kael ran for Seren at the furnace. If he stood still, the Warden fight's narration and its Memory Art (STOOD STILL instead of THREE STEPS) say that instead.
- Celestine's "granted, not aye" line no longer corrects something he did not say.
- Lift Zero in Day 3 is now drawn from Kael's side: the open doors with nobody in them, then the inside of the car with a level counter. Celestine is drawn as a figure in her room instead of a glow.

**Not tested by a person:** Day 3's pacing and length, the era gating (a move you had in the Valley is not there in the Pairing, by design), and the new finishers' feel.

## v0.14 · 2026-11-18 — harder, more moves, boots, dreams, and a look further ahead
From play notes: fights far too easy; more abilities, especially by the last fight (boots); strong and weak kicks and a special punch; the card after the first fight was confusing; explain more before the first fight; fights beyond the Assay, bigger and off the ground; more 2D fights like the early game, especially the training years; how the Accredited talk; the humming was confusing; the first stealth room does not say where to go; show what happens between the fights, in the game's own 2D style.

**Difficulty**
- New setting, **Fight difficulty: Story / Hard / Brutal** (Settings, and the Dev menu). Hard is the default and is a large step up from v0.13; Story is roughly what v0.13 was.
- Hard: Assay enemies have 40% more health, wind up faster, attack nearly twice as often, and up to three come at once. Captains, Wardens and duelists all charge from range, strike twice, and strike three times below about half health. Less safe time after a hit; the second wind brings him back at 40%.
- Brutal: more of all of that, four at once, and no second wind.
- The Ember Ring below gets a smaller share of the same changes.

**New moves**
- **Kick chain**: tap kick up to three times; the third is a roundhouse that launches.
- **The boot** (hold kick): a strong kick that breaks a guard and sends a man flying into whoever is behind him.
- **The ram** (hook button, up close): a punch from the valve ram on his off hand. Heavy damage, a shockwave through anyone behind the target. Chains from the hook line: hook a man in, then ram him.
- **Boots** (the Keep and everything after): hold jump to fly, press jump again in the air to climb, dodge in the air to dash, guard in the air to slam. A fuel bar under the guard pips. Unlimited air cuts while he is up.
- Breach moved to guard + jump (hold kick is now the boot).

**Story**
- **Time cards fixed.** After the Valley: "FOUR YEARS EARLIER · Cinderwell. Six tiers under the rock." After the Pairing: "FOUR YEARS EARLIER · the morning after the furnace." The card before Day 1 now reads "FORTY-ONE DAYS AFTER THE FURNACE" instead of "FORTY-ONE DAYS LATER", which read as if it followed the fight.
- **Before the first fight**: five new shots say who Kael is, what the Assay is, who watches, and why he is in it.
- **Dreams** (new, 2D, in the style of the game below): when Kael sleeps, the story runs forward.
  - *End of Day 1*: the Gilding (three new illustrated panels), Ilse Marrin, a woman who was Accredited once; **the language lesson** (soot says "thanks", "aye", "my breath", "we"; the Accredited say "noted", "granted", "my time", "one"); then **the Drill**, a new **2D fight** against Brand, a Warden who deserted. Then the Ford.
  - *End of Day 2*: what the Assay is, on an illustrated map: twelve Houses, the standards, the keep, the Proctors, and what the winner is actually given. Then the Keep.
  - *After the ending*: one look all the way forward (the Sun Spire), then the Fall.
- **The Fall** (new fight, nine years on): a battle on the hull of a lift-barge falling onto the Sun Spire. Boots, two waves, Marshal Cade, a deck that lurches, three Memory Arts. Plays after First Fire and from the Dev menu.
- **The shift song explained.** At the furnace: humming is the only goodbye allowed, because nobody wrote a rule about it. After the furnace: what the song is, and that the Authority now plays it on the tier speakers at every bell so that it will mean the furnace. At the festival: a year of that, and tonight the tier takes it back. The Drill's Memory Art is about it too.
- **The first stealth room**: Seren now says where the relay is (east wall, straight across from the door) and makes Kael say the order back; the card says it; and a flashing marker labelled RELAY, then BANK 7, points the way the whole time.

**Art pass on the new scenes**
- The gilding room: tiled wall, masked figures with gold eyes who shift their weight, an instrument tray, a gold drip line, light pooled on the floor; the before/after is framed in a tall mirror.
- **The lesson has a slate.** Two columns, SOOT and THEM; each pair is chalked up as Ilse says it, with the soot word struck through.
- The Assay map: drifting clouds, birds, pines, a tent and three cadets at every standard, light moving down the river, a rock base under the keep.
- The Sun Spire: sun rays, lesser spires in the cloud, glowing gold rings with windows.
- The Fall's deck: darker plating so figures read against it, rails with gaps torn out, gold deck lines, mast cables, a torn Violet standard, wreckage, and smoke columns streaming upward past the camera.

**Engine**
- Film shots can change scenery mid-sequence; a fight definition can be a film only.
- Dev menu: the Drill, all three dreams (end of Day 1, end of Day 2, after the ending), the Fall, and the difficulty switch.

**Not done / not tested**
- Nobody has played Hard by hand. A bot that only strikes and dodges clears the Valley and the Pairing on Hard but could not finish the Ford in the time allowed; a bot using the full move set was not measured. If Hard is too much, Story is there, and each loss makes the retry 8% easier.
- Boots flight has not been tried on a real controller or phone.
- The Gilding, Ilse Marrin, Brand, Marshal Cade and the Sun Spire are new canon written this round; say if any of it is wrong for the story.

## v0.13 · 2026-11-18 — signature moves, and fights you can lose
From play notes: more signature moves; raise the difficulty so you sometimes lose, a fun challenge, not brutal.
- **Signature moves** (all our own, built from Kael's story):
  - **Breach** (hold kick): a crouch, then a lunge straight through everyone in the line, breaking guards and launching.
  - **Shaft Drop** (jump, then jump again in the air): he goes up out of frame and comes down on the nearest enemy; a fire ring, a scar, heavy damage in the middle. Seven-second cooldown.
  - **Wide Cut** (guard + strike): a full spinning cut that hits and pushes back everything around him.
  - **Headbutt / throw** (guard + kick, up close): an ordinary fighter is thrown, and hurts whoever he lands on; a big one takes a headbutt and staggers.
  - **Roar** (guard + hook): ordinary fighters around him reel back, big ones hesitate and drop their wind-up, fury jumps. Nine-second cooldown.
  - **Riposte**: the first strike after a parry is a heavy, slowed blow.
  - **No mercy**: hitting a man who is on the ground does extra damage.
- **Assay fights can now be lost.** Kael gets one second wind per fight ("NOT TODAY", back at half health with full fury). Go down again and it is "GET UP.": the fight restarts without its intro film, with the enemies about 8% weaker each time (up to three times), so nobody gets stuck.
- **Harder enemies in the Assay**: quicker wind-ups, shorter gaps between attacks, 15% more health; captains, Wardens and duelists can no longer be knocked out of a swing by ordinary hits (a heavy blow, an opening, a kick-broken guard or a parry still does it), and they speed up below 40% health. Kael's safe time after being hit is shorter. He has less health in the final duel.
- With the test bots (which only strike and dodge): the Ford and the Proctor regularly use the second wind and the Ford was lost outright twice in one run; the Pairing and the Valley are still gentle. The Ember Ring below is unchanged.
- Not tested by a person: how the new inputs feel, and whether the difficulty lands where you want it.

## v0.12.9 · 2026-11-18 — kicks, jumps, a guard and a hook line
From play notes: the fighting is smooth but needs more to do, especially on a controller, and should be a little harder.
- **New moves.** Kael fights dirty and off the ground:
  - **Kick**: fast, shoves a man back, stops a wind-up, and breaks a raised guard (GUARD BREAK, with an opening after). After two strikes it launches. Out of a dodge it is a flying kick.
  - **Jump**: strike in the air (up to three cuts; hits keep a launched enemy up, so you can launch, jump and keep cutting). Kick in the air to **dive kick** and bounce back up. Dodge button in the air to **plunge**: a slam that hits everything around the landing and scars the ground. Jumping clears ground sweeps.
  - **Guard**: hold to block from the front. Three blocks, shown as pips under the fury bar, which refill. Heavy blows and charges crush through. Press it just as he swings and it is a **parry**: he staggers, time slows, fury jumps.
  - **Hook line**: Kael's rigging line from the valve banks. It drags an ordinary fighter to him, or drags him to a big one and gives him the first hit. Short cooldown.
  - ELEVEN is still hold strike at full fury (or both shoulder buttons).
- **Controller layout in fights**: X strike, Y kick, A jump, B dodge, RB or RT guard, LB or LT hook. Menus are unchanged.
- **Keyboard**: E strike, C kick, F jump, X dodge, V guard, Q hook.
- **Touch**: four more buttons appear during fights (JUMP, KICK, GUARD, HOOK).
- **A little harder**: enemies wind up slightly faster and attack more often; two can come at Kael at once whenever two are standing; captains and duelists start their double attacks earlier; Assay enemies have about an eighth more health. The Ember Ring results are unchanged for the test bots (a masher still loses the last bout, a dodger wins).
- The control tips at the start of a fight cycle through the new moves, and About lists them.
- `tests/moves.mjs` runs every new move in slow motion and with real key presses.
- Not tested: a physical controller (the mapping follows the standard layout but nobody has held one), and the touch button positions on a real phone.

## v0.12.8 · 2026-11-18 — single combat, a tagline, and a dev menu
From play notes: ELEVEN is right but the other cut-ins were not; not every fight should be a gang fight; "Book One" does not fit; keep hitting story beats; above-ground story should be cinematics.
- **"Book One" is gone.** The title is SOOTBORN and the tagline is "Every breath is hers." (Kael's line about Seren), on the title screen, at the end of the opening film, and in About.
- **Three of the five Assay fights are now one-on-one.**
  - **The Pairing** (new, end of the prologue, before the title card). The first night of the Assay: two cadets sealed in a marble room, one walks out. Kael against Teo Aldane, sixteen, who shared his bread on the lift. A quiet, dark duel with its own room, film and narration, and the Memory Art HER NAME.
  - **The Proctor** (new, start of Day 2's festival). Day thirty-one, a storm over the valley, rain and lightning. Proctor Halden Voss comes down from the dais with a halberd; nobody touches a Proctor. Memory Arts THE AUDIT and BALANCED. Ends with the cadets following Kael instead of the House.
  - **The Ford** is now single combat with Captain Vant (no cadets, no ally; Vant has more health).
  - The Valley stays the big battle and the Keep stays the final duel.
- **Memory Art cut-ins rebuilt to match ELEVEN.** The memory fills the screen with its line typed at double size, then a hard cut to Kael's eyes with the art's name, then the name is called out word by word on each strike.
- **Dev menu** on the title screen ("Dev menu · jump to a scene"): a Fights list (every fight), a Story beats list (opening film, each prologue step, each day, Last Bell, the lantern climb, First Fire), and two switches: start fights at full fury, and skip fight intro films.
- Above-ground story beats are films (camera shots with captions), not walk-around play: each new fight has an intro and an outro film.
- Two new 3D places: the pairing room (pillars, a gallery of watchers, one shaft of light) and the valley in a night storm.

## v0.12.7 · 2026-11-18 — readable, calmer, and the first fight is not optional
From play notes: the fights were chaotic and hard to follow (though they felt smooth), and text and cutscenes went by too fast to read.
- **The first fight cannot be skipped.** The Valley has no "skip this fight" in its pause menu, and "Skip scene" is locked until that battle is over. (The other two Assay battles can still be skipped; the dev checkpoints still jump anywhere.)
- **"The First Shift" is gone from the branding.** The page title and artifact are just SOOTBORN; the title screen says "Book One".
- **Text you can read**
  - Cutscene captions are twice the size, on a solid band across the bottom.
  - Every shot now lasts at least as long as its caption takes to read (about two seconds plus time per letter), and all shots run a quarter longer. Tap or press to move on sooner.
  - Memory Art cut-ins hold for the length of their line (three seconds or more) with the line at double size; the ELEVEN cut-in holds 1.6 seconds instead of 0.95. Both can be pressed through.
  - Kael's narration in fights stays up about twice as long, and lines no longer queue up behind each other.
- **Fights you can follow**
  - Who is who: a gold ring and a gold marker over Kael, violet rings under allies, red rings under enemies (brighter on the one he will hit).
  - The camera sits higher and further back.
  - Less glare: weaker glow during fights, a much smaller white flash on ordinary hits, fainter sword ribbons, less camera tilt, far fewer drifting petals, a gentler red tint at full fury, and the background battle moved well back from the arena.

## v0.12.6 · 2026-11-18 — heavier fights
- **Heavy attack**: keep strike held. Kael raises the blade, it gathers light, and the blow breaks guards, hits for much more, launches whoever it catches and leaves a scar on the ground.
- **Knockdowns**: launched enemies now land on their backs, lie there, and push themselves up before they can fight again. Captains, duelists, Wardens and ring bosses keep their feet unless a heavy attack or a Memory Art puts them down.
- **The ground remembers**: heavy blows, Memory Arts and the last hit of ELEVEN leave scorched marks that stay for the rest of the fight.
- House Teal's swordsmen carry round shields.
- Fighting moves, in full: strike chain (three cuts), hold for heavy, dodge, strike out of a dodge for a dash strike, strike into the last instant of a wind-up to clash, hold at full fury for ELEVEN.

## v0.12.5 · 2026-11-18 — music was inaudible; fixed
Reported after v0.12.4: no music at all. Measured the mix by rendering it offline and found three likely causes, all fixed:
- **Far too quiet.** The music sat around -39 dB RMS at the default volume. Music and effects now run through a compressor with make-up gain; the same tracks measure about -21 dB, roughly eight times louder, with no clipping.
- **All bass.** Drums and bass lines lived between 40 and 150 Hz, which a phone speaker does not reproduce. Low notes now carry quiet partials one and two octaves up, and drums get a click.
- **Phone audio unlock.** Audio now starts on any kind of touch or key (not only the first press-down), resumes if the browser suspended it, and plays a silent looping clip so an iPhone's ring/silent switch does not mute the game.
- Settings has a **Sound test** row that says whether audio is running and plays a horn when tapped.
- `tests/audio.mjs` renders every track and effect through the real chain and prints peak and average level.

## v0.12.4 · 2026-11-18 — sound, music and better figures
- **Battle music, generated in the game and built on the shift song** (the crew's hummed tune, D F A G | F E D):
  - *The valley*: war drums and horn chords, with the shift song as a march in the second half.
  - *The ford*: lower and slower, hand drums over a drone, the tune in the cellos.
  - *The keep*: a ticking ostinato; the tune first high and clean (Seren), then the same notes an octave down in iron (Kael).
  - **Rage layer**: as the fury bar passes half, a low sawing pedal and an extra drum come in under whichever track is playing; at full, a high dissonant shimmer and a roar of air.
- **Combat sounds**: blade swings (a heavier one for the overhead and for big enemies), steel on steel for blocks, cuts and heavy cuts, a clash ring, a dash, bodies hitting the ground, fury igniting, the memory cut-in, a rising hit for each count of ELEVEN, the fire pillar, a war horn at the start of each Assay battle and in the opening, and a short fanfare on a win.
- **Figures**: limbs and torsos are tapered instead of brick-shaped (shoulders wider than the waist, thighs and shins that narrow, a jaw), with hip plates that move with the legs, a neck guard, curved crossguards and a pommel stone in House colour.
- Sound was checked by rendering every track and effect offline for errors and clipping. Nobody has listened to it yet.

## v0.12.3 · 2026-11-18 — light, and more rage
- **Bloom**: the 3D scenes now render through a glow pass. Anything that gives off light (blades, gold trim, fire, the sun, sword ribbons, sparks) bleeds into the picture around it, with a soft vignette at the edges. Rendered slightly above screen resolution to keep edges clean. `#nopost` in the URL turns it off.
- **Rage you can see on the ground**: from about half fury the earth under Kael scorches and splits into glowing cracks that grow with the bar; the hem of his cape catches; the whole picture tints red and the vignette closes in.
- **Rage kills**: finishing an enemy with fury at 60 or more drops into slow motion, tilts the camera and throws the body further.
- Kael wears Seren's washer on a cord at his chest.

## v0.12.2 · 2026-11-18 — more polish above ground
- **Animation**: Kael stands hunched and breathing hard at full fury, blade low; enemies facing him then raise their guard and back off. On a win he sinks over his sword while his allies raise theirs. The dodge rolls in the direction of travel. Cutscene figures can raise a blade or kneel (the cadets chanting after the valley; Lucan on one knee after the duel).
- **Fighting**: press strike during a dodge for a dash strike that closes distance and hits hard. Damage numbers pop off every hit. Clash now needs a deliberate, well-timed strike: a mashing bot was triggering it constantly and winning the last Ember Ring bout without taking a hit, which the test run caught.
- **Look**: the field shades smoothly instead of in flat tiles; broadleaf trees in green and gold (russet at dusk) among the pines; the river moves and carries foam; clouds drift; sparks and the fire pillar are now light in the 3D scene instead of pixels laid over it; the victory camera sits further back.

## v0.12.1 · 2026-11-18 — 3D animation rebuilt from research
Read up on how action animation is done in this kind of game before touching it. What I took from it:
- Wolfire's David Rosen (GDC 2014, "An Indie Approach to Procedural Animation"): author a few strong key poses and let curves and springs do the motion between them; add drag to anything that hangs.
- Fighting-game and melee animation practice: every attack has three beats (anticipation, a very fast strike, a held follow-through); speed up the strike and slow the wind-up and recovery; stretch at speed and squash on contact; freeze briefly on a hit; match the victim's reaction to the direction of the blow.

What changed:
- **Pose to pose on springs.** Each state names a key pose (twenty joint values). Every joint chases its target on a spring, so states blend into each other instead of popping, and swings overshoot and settle.
- **Attacks in three beats.** Forehand: wound back with the torso turned away, cut through with a lunging step, hold past the target. Backhand mirrors it. The third is a crouch, a leap with the blade behind the head, and a slam into a deep crouch with a squash on landing. Lancers pull back and thrust.
- **Enemy tells are poses**, not just a red shape: a sweep winds the whole body round, an overhead raises the blade and sinks, a charge drops into a sprinter's crouch. After a swing they slump, spent, which is the moment to hit them.
- **Hit reactions follow the blow**: the body folds away from where it was struck, the head snaps, arms fling; launched fighters go limp and tumble.
- **Secondary motion**: capes, sash tails, long hair and helmet plumes are driven by how fast the fighter is really moving; the body leans into its own acceleration and turns smoothly; the run cycle only plays when the feet are actually covering ground; boots kick up dust on landings.
- **The blade** stretches at speed and leaves a ribbon of light from mid-blade to tip.
- **Clash** (new move): strike an enemy in the last instant of his wind-up and the blades meet. He staggers, time slows, fury jumps.
- Rim lighting on every figure, visible arena bounds (stakes and ribbon in House colours), light bursts at each impact, slightly richer colour.
- Figures are a little smaller relative to the field so fighters no longer stand inside each other.
- `tests/anim.mjs` captures any move frame by frame in slow motion (A=combo|foe|run|hurt|lance).

## v0.12 · 2026-11-18 — the surface in real 3D
- **Everything above the rock is now real 3D**, in the flat-shaded low-poly look used in Guttercrown: lit by one sun, with shadows on the ground, distance fog, a drawn sky and glow for fire and steel. Cinderwell stays 2D pixel art, so the two halves of the story no longer look like the same game.
  - Guttercrown uses three.js from a CDN. That could not be loaded or tested in the build workspace, so this renderer is plain WebGL with no library (`src/g3.js`). It needs no download and works offline. Without WebGL, or with `#no3d` in the URL, the game falls back to the earlier 2.5D scenes.
  - Fighters are built from boxes every frame: jointed legs with knees, a chest and waist, shoulder plates, a two-part off arm, a sword arm that swings from the shoulder, capes and sash tails that stream, hair, helms, circlets. Run, three different cuts, a leaping overhead, wind-up, stagger, roll, fall and tumble are all posed in code.
  - Places: the valley (pines, pavilions, rocks, the white keep on its ridge, snow peaks), the ford at dusk (a river, reeds, long shadows), the keep at dawn (a marble platform above a sea of cloud, towers, braziers).
  - **They are being watched.** A dais of Proctors grades the valley; the standards of all twelve Houses fly behind every field; fallen cadets and dropped blades lie where the lines met; a second battle goes on in the background. On the keep, Celestine watches the duel from a dais with two Wardens. Kael says so.
- **Camera**: flies in at the start of a fight, tilts on heavy hits, cuts from side to side during ELEVEN, looks up for launches, and circles Kael on the last blow.
- **Fury you can see**: from about half a bar the sky, sun and fog bleed toward red; at full his eyes burn, his blade runs hot, the nearest enemies recoil ("WHAT IS HE?"), and the camera punches in.
- **Fight readability**: a violet ring marks Kael and a red ring marks who he will hit; strikes close the gap to a target that is just out of reach; a flashing arrow at the screen edge warns of an attack coming from off screen; the fight camera sits a little higher.
- Checked in a software-rendered test browser only. Frame rate on a real phone GPU is not measured.

## v0.11 · 2026-11-18 — the Assay: 3D fights, rage, flash-forwards
- **Fights are rebuilt as a pseudo-3D arena brawler.** A perspective floor, big fighters, and a camera that follows the action, pushes in on heavy hits and drops low for the big moments. Impact frames, speed lines, shockwaves, launches, portrait health bars.
  - Three different cuts in the chain; the third is a leaping overhead. Sword arms swing from the shoulder with a crescent trail; fists jab, cross and uppercut.
  - **Fury.** Kael's fury bar fills as he hits and is hit. When it is full, hold A: **ELEVEN**, an eleven-hit rush, one for every second the furnace doors stood open. Cut-in on his eyes, a rage-red void with the count called out, an inverted impact frame and a pillar of fire on the last blow.
  - Foes: cadets, lancers, a captain, a duelist who blinks behind you, Wardens. Allies fight beside you. Waves.
  - **Memory Arts.** At set points in a fight (an enemy's health, a new wave) a memory cuts in as two slanted panels: the memory itself, drawn from the story panels (the washer, the fever ward, Lift Zero, the furnace), and Kael's face. It names the blow, says its line, and becomes a choreographed attack: a launch with three cuts in the air and a slam, or six passes straight through the enemy that all go off at once. This is how the fights carry the story.
  - Fury shows on screen as it builds: the edges of the picture redden from 40 percent, and at full there is a heartbeat, embers up both sides, and every strike hits harder.
  - **Kael narrates during fights**, on a clock and on events (first hit taken, fury, ELEVEN, the enemy at half). It never pauses the fight.
- **The Assay** (our own proving war, four years on: Kael gilded and passing as an Accredited cadet). Told the opposite way from Cinderwell: daylight, hard cuts, a moving camera, captions that do not wait.
  - **Opening**: a film-style sequence before the title menu, after the two studio logos. Credits over picture (North Coast Studios presents, in association with E Concepts). It starts below, in the dark: Seren walked to the furnace, the eleven seconds counted out loud, the doors closing. Then "SO I WENT UP", lightning, and the Assay in daylight at full speed, ending on the title. About 40 seconds; any button skips.
  - **The Valley**: New Game now opens on a playable battle with two allies and two waves, then cuts four years back to the world panel.
  - **The Ford**: plays between Day 1 and Day 2. Captain Vant; first sight of Lucan Aurel, the High Auditor's son.
  - **The Keep**: plays at the end of Day 2. The duel with Lucan.
  - His aura grows from one battle to the next. These fights cannot be lost and can be skipped from the pause menu.
- **Present day**: the Ember Ring bouts use the new fights. If Kael runs for Seren at the furnace he now gets his three steps: a short fight against a Warden that cannot be won.
- **Saves**: an autosave plus three slots with day, place, play time and date; overwrite confirmation, delete, and the existing text export and import. The game says so plainly when the browser cannot keep saves.
- **Checkpoints (dev)** on the title menu: twelve jump points across the slice.
- Assay scenery: pavilions, swaying grass and reeds, cloud shadows crossing the field, a background melee behind every battle, glints on the river and ripples round anyone standing in it, braziers and reflections on the keep's stone, petals and embers in the air, capes that stream when fighters move.
- New music track for battles. New 16×28 armoured cadet sprites.
- The final Ember Ring bout has more health (now 39) because the new attacks hit harder; a mashing bot still loses it and a dodging bot wins.
- Tests: `ff.mjs` (plays each battle with a bot), `sup.mjs` (the super), `flow.mjs` (opening, new game, furnace fight), `dev.mjs` (every checkpoint, save slots), `arts.mjs` (the Memory Arts). Add `#noff` to the URL to skip the opening and flash-forwards.

## v0.10 · 2026-11-17 — playtest round: bugs, the heist, animation
Found by stepping through every cutscene frame, walking the heist with a bot on real inputs, and profiling on a throttled CPU.
- **Bugs fixed**
  - Cutscenes froze while a line of dialogue was up: actors stopped walking, story panels stopped animating, and screen flashes hung on screen (the furnace panel stayed washed orange). Everything now keeps moving under the text.
  - The Lift Zero panel was blown out to white; the three figures are visible now.
  - Dialogue covered the actors in most scenes. The camera now frames cutscene action above the dialogue box.
  - The opening world panel dropped to about 17 fps on a slow phone (it redrew 14,000 rectangles a frame). Backgrounds are cached; every area and panel now holds 60 fps at 6x CPU throttle.
  - Story panels were unreadable in portrait. They now keep their focus in the middle of the frame.
  - Portrait stealth hint overlapped the objective.
- **The heist was not a challenge**: a cautious bot walked straight down the middle of the bay to the relay in under seven seconds without ever waiting. Patrols are redesigned so their lanes interlock:
  - the Night Proctor walks the middle of the bay end to end and looks up and down at each end
  - a second lamp walks the centre column and looks left and right at each end
  - the Watchman stands by the relay and turns all the way round, so the relay hold has to be timed
  - cutting the relay sends the Night Proctor to the north lane, right past Bank Seven
  - a short grace period after each reset; after three catches Seren knocks something over and every lamp goes to look
  - the same bot now needs 14 seconds and two close calls by the north route, and gets caught three times going down the middle
- **Animation**
  - Characters blink.
  - Portraits move their mouths while a line types out.
  - Cutscene acting: characters turn to each other, kneel (the audit, the festival), hop, and show emote bubbles (!, ?, ..., hearts at the proposal).
  - Footstep dust, pipes that drip, steam off the noodle pot, lamps that breathe and occasionally gutter, and a rat along the south wall now and then.

## v0.9 · 2026-11-17 — cinematics and stealth (from playtest notes on the prologue)
- **Story panels**: cutscenes can now cut to full-screen illustrated panels and back, so the story is not told only with pans and zooms. Eight panels so far, all animated:
  - the world as Cinderwell is told it (burning surface, six tiers, the Deep Array, rations, Lift Zero)
  - the washer on Kael's palm, and on her finger
  - the fever ward on ration air, and later with the fans up
  - the crime drawn plainly: the sealed Authority line, the starving clinic branch, the bleed between them
  - Lift Zero opening on a kneeling tier
  - the heart-furnace: Seren before it, walking in, the doors closing
  - Kael's face afterwards, ash in his hair
  - the tin, the washer and the invoice
- **More exposition**: the game now opens on the world panel with Kael narrating what Cinderwell is, who the Authority are, and what the punishment for stealing air is. The tin is now a scene, not a text card.
- **Guards sweep**: every lamp turns smoothly through its arc instead of snapping between four directions. A guard who hears a bolt does a full, slow look around.
- **Detection meter**: being caught is no longer instant. An eye meter fills while a lamp is on you (faster up close), the cone turns red, a heartbeat plays, and it drains when you break line of sight. Surviving a near miss gets a line from Seren (or Ivo and Tavi at the festival).
- **Hold to work**: cutting the audit relay and hanging the lantern now take about two seconds of holding A while standing still, with a progress bar. You can let go, hide, and come back.
- Dialogue shrinks to a slim caption strip over story panels.

## v0.8 · 2026-11-17 — art pass (no new content)
- Tiles redrawn: hand-laid flagstones in the square, riveted deck plates in the bays, floorboards with grain at home, packed dirt in the tunnel, steel grating with frames. Every surface has a lit top-left edge and a dark bottom-right edge.
- Walls: dressed stone courses with timber props, iron panels with girders and rust in the bays, lumped cave rock with ore glints around every room. Walls now cast contact shadows on the floor.
- Characters: all workers redrawn at 16×20 with three-tone shading, real faces, hands, boots, hair highlights and soot. The Accredited are now 16×28 so they still tower.
- Props redrawn with lit tops, dark sides and hardware: crates, barrels, benches, the noodle stall, lamp posts, Ivo's cart, pipes, doors, the clinic door, the heart-furnace, the Pillar plinth, conveyor, cots. Blocking props cast shadows.
- Lift Zero's gate is now white steel with gold trim and the sun-eye emblem: the one clean thing in the square.
- Old tunnel: brighter, with rails, an ore cart, a proper rockfall and more lamps.
- Menus, dialogue box, objective and toasts are framed like engraved brass plates.
- The Ember Ring is fought on the square's flagstones.
- Second polish round (v0.8.1):
  - Bay floors are now large deck plates with seams and corner rivets instead of a busy per-tile grid.
  - More props redrawn: Bank Seven (gauges, wheels), Freight Three's shutter, the shift board, bed, table, floor hatch, vents, air canisters, the noodle awning and sign.
  - The pipe puzzle has a brass frame, plated cells and shaded pipes.
  - Camera eases after the player instead of snapping; a soft vignette darkens the screen edges; rounder shadows and a small step bob on walking characters.
  - Fights show the punch: a fist on every strike, for Kael and for foes.
  - Wardens have a visor; the glow on the Accredited is toned down so their detail survives the light beam.

## v0.7 · 2026-11-17 — "First Fire"
- **Day 2 is playable**: the Festival of the First Fire, one year to the night after the wedding. Roughly 30–40 more minutes.
  - Seren left a list in her lantern frame. Kael gathers wire (Ivo), gold (Orin) and a wick (Nell), and collects paper "rays" from up to ten people who loved her. The ray count decides who stands in front of the lantern at the end.
  - Fuse Room C (new map, off Bay 3): Crew Three's lockers, Dace's sealed informant envelope, and a new breaker-balancing puzzle. The "standby" bus turns out to be Lift Zero, charging on Tier 6's lights.
  - Vale's follow-up: what he wrote down about the bleed, and why he struck it.
  - Sull's consequence scene, in three versions (threatened / charmed / ignored on Day 1).
  - The ceremony: Celestine brings the First Fire, drawn from the furnace that burned Seren. Kael chooses how the lantern is lit. Celestine lets slip that she has seen the sun.
  - Stealth finale: hang the lantern on the Pillar past three Proctors. Then the sun on the square, the row, and Lift Zero opening by itself.
  - Dace is alive: new chalk in the old tunnel.
  - End-of-day summary for Day 2, and a short Day 3 epilogue roam.
- **Combat foundation** (`src/brawl.js`): real-time melee for every future fight.
  - A strikes (three-hit chain), B dodges with brief invulnerability.
  - Foes telegraph on the ground. Dodge through a swing and time slows: an "opening" where hits land harder and break guards.
  - Foes guard after a full chain and counter; mashing loses to anyone past the first bout.
  - Handles any number of foes; five foe kinds so far (jab, quick, heavy, baton with sweep and charge, boss with a double strike).
  - First use: the Ember Ring, a three-bout festival fight ring. Bout two is Proctor Sull if Kael threatened him. The last bout is Mara.
- **Map of Cinderwell** in the pause menu: a cutaway that fills in as Kael learns things (Riser 9, Freight 3, the tunnel, what is above).
- **World dressing**: gold-edged sign plates over doors and machines, Authority banners (white, gold sun-eye), a chalk ring and unlit lantern strings in the square on festival day.
- Engine: doors can be locked behind story flags; puzzles can be breaker boards (`kind: 'breaker'`); stealth is reusable (`G.heist = 2`); day-2 scripts wrap day-1 scripts in `src/day2.js`.
- Day 1 text now says the festival is "tomorrow."

## v0.6 · 2026-11-17
- Dialogue portraits:
  - Every speaker gets a 32×32 bust built from their look: soot on the Belowborn; a gold halo, gold eyes and a crown for the Accredited; masked Wardens; goggles, beard and hats as on their sprites.
  - Each character has their own expression (`MOUTH` table in `story.js`).
  - Kael gains a cheek scar if he ran for Seren or spat at Celestine.
  - Accredited names show in pale gold. The portrait is now 72px.
- Idle life: standing characters breathe (a 1px settle every couple of seconds).
- New choice after Bank Seven ("Bleed again"): with Vale pacing nearby, Kael can bleed AUX-9 into the clinic branch again.
  - It's a timed pipe puzzle: 28 seconds, a heartbeat in the last 6, and a red pulse on screen.
  - Success: Vale grows suspicious. The ward fan spins "like a storm," Ada and Nell react, Mara warns him, and the day-end summary records it.
  - Failure: Vale nearly catches him.
  - Refusing: flag `heldBack`.
- Puzzles support `timer` and `onFail`.
- Portrait-mode HUD: objective and stats no longer overlap.

## v0.5
- Cinematic zoom in cutscenes.
- Furnace scene rebuilt: humming, Hollis struck, heartbeat and vignette, 11 memory cards, the Celestine confrontation.
- Heist v2: audit relay checkpoint, Watchman, bolt distraction.
- World dressing: screens, posters, laundry and chains, steam, soot.
- Ashgate citizens; the Fever Ward clinic.

## v0.4
- Leads renamed to Kael Brennick and Seren Holloway.
- Proposal scene, playable heist, public furnace execution, the tin, the fury count, Proctor Sull.

## v0.3
- Renamed from "Below the Sun" to SOOTBORN.
- Defined hero, first cinematic prologue, the Accredited (tall, luminous sprites), Inspector Vale.

## v0.2
- Old Service Tunnel and Riser 9; NPC speech bubbles; time of day; footsteps.

## v0.1
- First vertical slice: one shift in Cinderwell, valve puzzle, crate clue, journal, saves, touch/keyboard/controller.
