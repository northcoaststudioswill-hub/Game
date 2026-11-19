# SOOTBORN — changelog (latest v0.39 · 2026-11-19)

## v0.39 · 2026-11-19 — loose ends: stage two is remembered, memories from below, Petra's ending, controls written down
From play notes: keep going on things not done and things to clean up. This round takes items I had listed as open in earlier notes.

- **Losing to Oswin no longer sends you back to the mask.** Once the mask has broken, a retry starts at stage two with him already unmasked: "Get up, Sorrel. One has not finished paying." "It's Kael. It was always Kael." The objective and health bar name him.
- **A memory from below at the suns that lacked one.** The docks' roof sun now ends in the fever ward (Tavi asking for bread, set against Teo's bread). The Stair's first landing now ends in Ashgate Square nine years ago, kneeling, the first time Celestine looked at him ("A thief who tidies"). Every sun in all three levels now has something from Cinderwell in it.
- **Petra Lune has an ending.** In the closing roll of where everyone went: she kept her column, and reads the names aloud each quarter, and stops at Hale, O. every time.
- **About & controls** now lists the buttons for the three third-person levels. It had nothing on them.
- **Hovering** lasts a little under two seconds, was nearly two and a half. It was the safest place in a fight.

**Checked by script:** beating stage one, dying in stage two, choosing BACK TO THE LAST SUN, and walking back up gives Oswin unmasked with his stage-two health and speed; all three levels to their endings; every chapter of Part Two still builds; title cards still fit at all four sizes. **Not checked:** played by hand.

**Still open, in the order I would take them:** Kael's model rebuilt properly (head, hands); pictures for the Island and the Dockmaster's table; the ford and the keep have nothing of their own; lock-on is not on the touch pad; the hand-off between 2D and the arena fights has not been looked at; phone frame rate has never been measured.

## v0.38 · 2026-11-19 — the Assay, lived in: boards, cairns, wagers, boots
From play notes: do the part left over from the last pass. Make the Assay and its places feel more authentic.

**Four new things you can find and read in the Assay camps** (new pixel art for each)
- **The Proctors' board.** One is hammered in at the edge of every camp and repainted from the air each dawn: twelve bars, one a House. POSITIONS ARE PROVISIONAL. DEBTS ARE NOT. Violet is eleventh on day 3, fourth on night 28 after three raids, first on the last night. Teal's faces the ford so that Violet can read it.
- **Cairns.** The heirs do not bury their dead; servants do. So they pile stones the way a picture book showed them and tie a House ribbon on. Two at Violet's camp on day 3 (BALANCED scratched in, and scratched out), four behind Teal's pump house, six on night 28, nine on the last night, and by then none of them says BALANCED.
- **The patron's drop** (the Island). A white crate on a gilt cord, lowered to House Teal: lamp oil, a second cook-pot, salve. Violet has had nothing lowered in twenty-five days. Nobody placed a sum on it.
- **On the dais:** the Proctors' **boots**, charging on a rack off the same vent stack as the lamps (he takes a pair on day 31); and an unlocked **strongbox of wagers** with a column for each Proctor: which House he is paid to find for. Voss has two names; one is Teal. "They are not grading the Assay. They are delivering it."
- Also in the Camp: a rack of four practice blades for forty cadets, and a second cadet awake, in the one cloak her House sent.

**The 3D Assay fights** (the Valley, the Ford, the Proctor, and anything else fought in the valley): the Proctors' board stands beside the dais and seven cairns with House ribbons sit near the tents.

**Checked:** each camp drawn with the new things in it (pictures of the Camp, the Island, the Dais, the Last Night and night 28); nothing new sits on a guard's route in the two stealth levels; the valley fight starts with no errors. **Not checked:** played by hand; each new thing's text was opened by script, but I did not walk up to them on foot; the board and cairns in the 3D valley were not in the one picture I took of it.

## v0.37 · 2026-11-19 — checking pass: titles in frame, cleaner hand-offs into the levels, things in the wrong place
From play notes: make sure no titles are out of frame; clean transitions between the (now three) kinds of play; look for things misplaced, wrong, or going through each other; make the Assay and its places feel more authentic.

**Titles**
- Measured every title card in the game (63) at four screen sizes, upright and sideways. Two kinds ran off the edge:
  - the **Assay calendar strip** under every Assay card was up to 228 px too wide on an upright phone. It now fits the width and its labels shrink and wrap.
  - long **big titles** ("THE DOCKMASTER'S TABLE", "TWO AND A HALF YEARS FROM NOW") ran off the sides. Big titles now wrap, centre, and size to the shorter side of the screen.
- After the fix all 63 fit at all four sizes. Captions and move names drawn inside fights (87 strings) were measured too and already fit.

**Into and out of the third-person levels**
- Going in: the level's own title card (THE HIGH DOCKS / RISER NINE / THE STAIR, with its year) holds the screen while the level wakes, then the level fades up under it. Before, the picture cut to black and then snapped on.
- Coming out: the level fades down before the story carries on.

**Wrong or in the way**
- **Brand was standing where the camera is** at the start of the High Docks, so on an upright phone the first thing on screen was the inside of his fist and halberd. He now stands to one side of the stair head.
- **The hook's tip went through the floor** when Kael stood still. He carries it point forward at rest now.
- **Opening messages in the levels named the old controls** (BOOTS, and keyboard keys on Riser Nine and the Stair). They now describe the current ones: held strike, held jump.

**Checked:** the title measurements above; the fade in and out by script in the game frame; the finisher memory still fires; the docks start in an upright window (picture). **Not done this round:** the Assay's 2D camps and the 3D valley, ford and keep were not changed. I did not want to place new objects in those maps blind; that is the next pass, and I would rather do it against your notes on what feels thin there. Nothing was played by hand.

## v0.36 · 2026-11-19 — story pass: four new scenes, Oswin's thread laid in, the blade's history settled
From play notes: give the whole game some work; more lore; check the story; add any new scenes with impact.

**What the check found, and what was done**
- **Oswin Hale came from nowhere.** v0.31 made him the man under the Auditor's Blade's mask, but nothing between the Assay and the Stair mentioned him, and the lines I wrote for the reveal did not match what he says in the Camp. Fixed both ways: two new scenes lead up to it (below), and the reveal now quotes him properly ("You said you'd carry the water yourself. You said not to tell your mother.") and uses his leg, which the Last Night already set up.
- **Petra Lune was promised and never paid.** The Last Night says she will keep a column of the Count two rows ahead of him by winter. She had no scene on the Spire. She has one now.
- **The blade had two histories.** The last duel says Celestine breaks "the blade they gave me"; v0.32 said Ilse had the bank hook made. Now one story: it is the blade pinned on him with the sun, and Brand reforged its last hand into a seat hook the night before he went up.
- I ran a check for contractions in lines spoken by Accredited characters across Part Two and the Assay levels: none found by the pattern I used.

**New scenes**
- **The Seat Knife** (opens Part Two, the night before the lift). Brand at a forge with the blade. What a seat knife is: the one edge soot are allowed, numbered, counted back onto a board at last bell; an empty hook on the board is a line struck by morning. Seren's was counted back the night they walked her: number 306, and somebody had cleaned it. Brand counted that board for eleven years and never asked what the knives were for.
- **Petra's letter** (chapter 2, +5, at the desks). Oswin's leg: the Proctors brought the salve when the Assay was over, as they said, eleven days late, and it set as it was. His father will not have him at table. The High Auditor has given him a post; something was asked in exchange, "and it was not much". Kael does not write back.
- **The fitting** (chapter 3, +6, Celestine's anteroom, before the hum). A man being measured for a half-mask kneels to a dead brazier, one leg out straight, and lays the wood base to the draught. Nobody on the Spire lays a fire. Celestine: "He had a name. One has relieved him of it." Kael does not turn round.
- **Hale, O.** (chapter 5, after the Stair, only if the third-person level was played). He comes up with the mask in two pieces and chalks the name on the wall by the white door, forty-eighth. Maren: there is no line for it; she struck it from the House rolls herself. Kael: "Then start one. That's what the book's for now."

**The Stair level:** the reveal dialogue and the caption after it are rewritten to match (the water, his mother, the leg, second place behind a man who lit a fire).

**Checked:** all five chapters build with every branch and every speaker has a portrait; each new scene's lines play through by script with no errors. **Not checked:** read by a person; the pictures behind the new scenes (they reuse the old-tunnel, desk and anteroom panels, and my test could not show me the right backdrop); nothing in Part One or the Assay levels was changed this round.

## v0.35 · 2026-11-19 — the third-person levels: kick is back, a held strike is three blows, rage cuts in, a hook you can see
From play notes: there is no kick button now; the held button should be a three-hit combo; more special rage moments mid-fight, like the other fighting scenes have (Zenless Zone Zero was the comparison); it is hard to see what the hook is doing.

**Buttons in a level now:** A strike · B dodge · HOOK · JUMP · LUNGE · **KICK** (where LOCK was; lock-on is off the touch pad again).
- **Kick:** the boot. Kick again as it lands for the Wide Cut.
- **Held strike:** tap for light cuts; keep the button down and he goes into three heavy blows one after another for as long as you hold: UP THE SHAFT, THE HAUL, LAST BELL. Let go and he stops after the one he is on.
- At full fury a held strike is still ELEVEN.

**Rage cuts in** (the fight slows, it does not stop: a slanted band across the picture with his eyes and a word)
- **LINE STRUCK** when the Count reaches eleven.
- **LAST BELL** when the third heavy blow lands.
- **THE TURN** on a late dodge.
- **BALANCED** for three kills inside a few seconds (and a little fury).
- **ON MY BREATH** the first time he drops under a third of his health: a moment where he cannot be hit, and a good piece of fury.
- They are spaced at least five seconds apart except the first two and the last, which always show.
- The full-screen memories on ELEVEN and on finishers are unchanged.

**The hook** is now thrown and seen: a gold line with a steel hook on the end flies out from his hand, bites (a flash and a ring where it lands), and then somebody moves over a fifth of a second: a guard is dragged to him, or he is hauled to a Warden, a boss, or the spot on the ground. Then the ram, as before.

**Checked by script:** the line drawn to a guard and the guard pulled in (pictures); held strike goes 6, 7, 8; kick and kick-again; the band on screen; ON MY BREATH at low health gives fury; all three levels to their endings. **Not checked:** played by hand; whether five rage cuts are too many or too few in a real fight; the hook in motion.

## v0.34 · 2026-11-19 — the third-person levels: one strike button, a hook that always does something, rounder bodies, idle habits
From play notes: the hook does nothing; there is still a heavy button when light and heavy were meant to be on the attack itself; Kael needs more idle animation; the levels need a graphics pass and the models should start to be less blocky.

**Strike is one button**
- **Tap A:** light. **Keep A held** as a cut lands and it ends the chain heavy. Which heavy depends on the cut you held: first cut UP THE SHAFT, second WIDE CUT, third (the ram) THE HAUL, fourth (the boot) LAST BELL.
- At full fury, holding A a little longer is ELEVEN instead.
- The HEAVY button is gone. That button is now **HOOK**; the old hook button is **LOCK** (lock on to an enemy).

**The hook**
- It was only working when an enemy stood inside a narrow cone ahead, and gave no sign otherwise. Now it reaches further and almost all the way round; with nobody to catch it throws anyway and pulls him five paces forward into a ram. Recharge is 2.5 seconds (was 4.5), and pressing it early says LINE OUT.

**Models**
- Every block on every figure (Kael, guards, Wardens, bosses, Tavi, Brand) now has turned edges and smooth shading, and limbs have twelve sides, not seven. Same designs, less brick.
- This is a first step. Faces are still drawn on a flat front; hands, heads and hair are still simple shapes.

**Kael, idle**
- He shifts his weight and looks about. Left alone a few seconds he does one of three things in turn: puts his hand to the washer, looks up at the sky, turns the hook over in his hand.

**Picture**
- Colour is a little richer and contrast a little higher in all three levels.
- The Stair has a setting sun with bars of cloud across it.
- The lamps at the foot of the Stair were floating squares; they are small lanterns set down on the stone now.
- I tried drifting embers and motes in the air and took them out: they drew as squares.

**Checked by script:** held strike gives the right heavy after the first and second cuts; ELEVEN still fires from a hold at full fury; the hook with and without a target; all three levels to their endings. **Not checked:** played by hand; how long a hold feels right (it is about a quarter of a second); the rounded models on a phone; the idle habits in motion. The levels' graphics pass is mostly still to do: see the question in chat.

## v0.33 · 2026-11-19 — the third-person levels: finer dots, calmer openings, more weight in the movement
From play notes: the dots are still too big on the scene; the changes are liked but the animations need more; the first clues and circles trigger too easily and the whole start is jarring.

- **Dots** are less than half the size they were.
- **Suns no longer fire when you walk across them.** Stand on one for about a second; a ring closes on him while it counts. Running over one, or fighting on one, does nothing. A one-time message says so.
- **Clues:** you have to be closer (about a pace and a half, was two). On the docks the first clue no longer appears until after the first sun, so the level does not open with two interruptions on the same spot. At Riser Nine the lintel waits until the first wave is down.
- **Animation:** the light cuts, the ram and the cleave now swing past their mark and settle back instead of stopping dead; landings from a jump, a dive or Last Bell are taken in the knees; on a run the hook trails behind him; hovering has its own pose (one knee up, off hand out, hook low).

**Checked by script:** a sun triggers after standing and not on a pass; hover and landing in stills; all three levels to their endings. **Not checked:** played by hand; the swings in motion; whether a second is the right wait on a sun.

## v0.32 · 2026-11-19 — the third-person levels: light and heavy, four chain enders, jump and hover, fury earned, the bank hook
From play notes: more combo finisher animations; a jump, so the boots can hover and not only lunge (keep the lunge); the gold flashing is distracting; the meter should be earned and ELEVEN should be a long press, not its own button; light and heavy hits; more of his own style in the animation; he should have his curved blade by now.

**Buttons in a level now**
- **A**: light. Five-beat chain as before. **Hold A at full fury: ELEVEN.**
- **HEAVY** (was KICK): on its own, the boot. After lights it ends the chain a different way each time:
  - light, heavy: **UP THE SHAFT**, a rising rip from a crouch that takes him off the ground.
  - light, light, heavy: **WIDE CUT**, the turning cut that hits all round.
  - light, light, light, heavy: **THE HAUL**, he hooks a man and drags him through to behind him.
  - heavy, heavy (or four lights then heavy): **LAST BELL**, up and down two-handed, a ring that hits everyone near.
- **JUMP** (was BOOTS): tap to jump. Hold to hover on the boots for about two and a half seconds; you can steer. Press A or HEAVY in the air to dive on whoever you are aimed at: LIFT ZERO.
- **LUNGE** (was ELEVEN): the boots lunge from the ground, unchanged.
- **HOOK**, **B** dodge: unchanged.

**Fury**
- Starts empty. The first sun gives a quarter; the suns that used to fill it give half. Light hits give less than before, heavy hits and chain enders more. No button fires it: a message says HOLD STRIKE when it is full.
- The gold on Kael is steady and faint now, no pulsing, no light on the ground; a few motes only when the bar is full.

**Kael**
- **The bank hook.** His blade now ends in a hook, edge inward: the curved knife a valve tech cuts a seized seat out with, made long in Accredited steel. It is our own design and name; the game cannot use the books' weapon or its name.
- With an enemy within a few paces he drops into a stance: weight down, off hand forward, blade drawn in.
- Light damage is a little lower and heavy higher, so the two feel different.

**Checked by script:** each of the four enders starts from its chain; jump, hover, running out of hover, and the dive (two guards knocked down); ELEVEN from a held strike; fury starts at 25 after the first sun; all three levels still run to their endings; JUMP from the game's own button in the frame (Riser Nine). **Not checked:** played by hand; how the new enders look in motion (seen in three stills); whether hovering above a fight is too safe (he cannot be hit above about waist height); on the Stair the held JUMP did not register in my slow test browser, which I believe is its frame rate and not the game, but I could not prove it there.

## v0.31 · 2026-11-19 — the third-person levels: Kael's model and movement, guards with more moves, a second stage for the last boss, lived-in places
From play notes: keep improving Kael's model and his rigging so the animation reads better; enemies need more moves; the biggest boss should have a second stage, at least on the last map; all three environments need more detail, more lore, more of a lived-in world.

**Kael**
- Model: gauntlet knuckles, a scabbard on the hip, the invoice pouch, a gorget, cape straps, boot cuffs, and the ring in one ear.
- Movement: his head and chest turn to whoever is nearest; he leans into a run and banks into a turn; his breathing gets heavier as fury builds.

**The guard**
- Any of them may follow a blow with a second one straight after. Stair Blades do it nearly half the time.
- **Stair Blades** step out of a cut ("NOTED.") and come back in.
- **Wardens** given room jump it: a red ring on the ground where he will land, 16 damage if you are in it. Same level only; not up or down a flight.

**The last boss: two stages (the Stair)**
- When the Auditor's Blade is beaten his mask breaks. He is **Oswin Hale**, the House Violet cadet Kael lit a fire for in the Camp. A short scene, then stage two: health back to 85%, a second blade, about a fifth faster, shorter wind-ups, +5 damage, bar renamed OSWIN HALE · HOUSE VIOLET.
- The ending adds a line: Kael puts "Hale, O." on Mara's list himself.
- Losing in stage two restarts the fight from stage one.

**Places**
- **High Docks:** two litters with the bearers' pads worn in the stone; the porters' tap with chained cups ("ONE CUP. NOTED."); the board of this quarter's struck lines with lamps left under it; loads left at the kneeling plates; dropped halberds and a helm; an overturned wine table by the pavilion; a torn House banner; chalk suns low on walls and on the deck.
- **Riser Nine:** what the Assay left nine years ago: tent frames, cold fire rings, the Violet standard down in the grass, nine marker stones with gilt nails, a practice blade, a ration tin. What came up the hatch tonight: bundles, a handcart, blankets, a ring of lamps round a lit fire. "SEALED BY THE COUNT" on the pylon; "NINE HOUSES. ONE STANDING." on the pump house.
- **The Stair:** torn banners on every landing, dropped halberds and helms, porters' loads, an abandoned litter and a spilled wine jar, chalk suns all the way up both walls, barge wreck on the terrace, Mara's list begun in chalk by the white door, and a table set for one.

**Checked by script:** all three levels start to finish; stage two triggers, runs and ends; double strikes, the Blades' step-back and the Wardens' jump fire without errors; both levels load in the game frame. **Not checked:** none of it played by hand; the difficulty of stage two; phone frame rate with the added props; chalk suns on walls were not confirmed in a close picture. About now says Version 0.31.

## v0.30.1 · 2026-11-19 — the third-person levels: brighter, gold instead of red, more ways to fight, and a memory at every sun
From play notes: the cel shading is a little dark; the red flare round the edge reads as dying, so let him glow gold as the rage grows; more fighting animations, a kick, and moves from his own story as in the other fights; text overlapping in the cinematics; every circle on the ground should trigger something different, with memories from below, from the Assay, and of Wren and the conflict between her and Seren in his head.

**Picture**
- Ambient light is up by about half and the key light a little, in all three levels. The ink, the dots and the night are kept; the shadows are less deep.
- The red edge is gone. As fury rises Kael himself glows gold, gold motes lift off him, and near full he lights the ground. His cuts turn gold above half fury.

**Fighting: what each button does in a level now**
- **A**: the five-beat chain (cut, backhand, ram, boot, cleave), or whatever the prompt says.
- **KICK**: the boot on its own. Press it again as it lands for the **Wide Cut**, a turning cut that hits everyone round him.
- **HOOK**: the **hook line**. It drags an ordinary guard to him; a Warden or a boss it takes him to. Either way he arrives with the ram.
- **BOOTS**: the leap and LIFT ZERO.
- **ELEVEN**: the ultimate, at full fury.
- **B**: dodge. A late dodge is the Turn, and the next cut after it is a **Riposte** for double.
- That is nine named moves from the 2D and arena fights now in the third-person levels: the chain, the ram, the boot, the Wide Cut, the hook line, the boots, the Turn, the Riposte, and the Count.

**Text**
- In the small frame, story pages show one panel at a time, filling the frame, so captions cannot sit on each other.
- Messages are held back while a dialogue, a page or a memory is up, and cleared when one starts.

**A different memory at every chalked sun**
- The first sun in each level is still the count.
- *The High Docks*: the yard sun is Wren turning his hand over at the east manifold, and the washer that did not get heavier (fury fills). The roof sun is the Pairing: Teo's bread, and "I hope she was worth it."
- *Riser Nine*: a second sun by the pump house. This is the valley where he first met Wren and she never saw his face; she put her hand on the pipe the way Seren taught him (fury fills).
- *The Stair*: the first landing is the last day of the Assay, and Celestine saying he reminded her of someone. The second landing is the rail of the barge: "I am not asking for her place." "There is not a place. There is a shelf." (fury fills).

**Checked** by script: the kick, the Wide Cut and the hook line fire and name themselves; the gold glow rises with fury; all three levels still run to their endings. **Not checked:** whether the brighter picture is right on a phone and on a big screen (I looked at one size); the Wide Cut's turn in motion; the memories' wording on screen. The memory about Wren in the valley uses the picture of her at the Clerk's desk, because there is no picture of the Island.

## v0.30 · 2026-11-19 — Riser Nine and the Stair are built, and the boots are in all three
From play notes: start building the two new third-person levels where they were placed, make sure they fit there, and give him what he has by then, the boots above all.

**The boots** (all three third-person levels)
- He has had them since the last day of the Assay, so he has them at +5, +7 and +9. One press on the JUMP button (it reads BOOTS during a level) carries him up and over on a blue burn and brings him down on whoever he was aimed at: LIFT ZERO. It knocks ordinary guards flat and has a three-second recharge. It is also the quickest way across a landing.
- The older fights already had them: every 3D arena fight from the Keep onward (the Pinning, the Gallery, Riser Nine, the Son, the Docks, the Fall, the Stair, Little Ember) lets him fly on the same button.

**Riser Nine** (chapter 2, +5): a third-person level, replacing the 2D fight there
- **Place:** the Assay valley at night in the rain. Grass, a ring of pines, the white keep on its ridge, the river, the pump house with every Assay's names in the lintel, the Authority's pylon on the hill road, and the hatch, glowing, with warm air coming out of it.
- **Kael:** in black cloth, no cape, no gilt. A clerk cannot be seen to fight.
- **What you do:** hold the hatch. Four waves come down the hill road; after each one ten more people get out and their hooded lamps go up the road. The count on screen is how many are up, out of forty.
- **Boss:** the Warden Captain. Three Wardens in all, which is the number Cade quotes at his desk the next morning.
- **Two things to find:** the lintel (his false name with a gold nail in it; the old tunnel and STILL FLOWING) and a child's shoe by the hatch (the fever ward's forty beds).
- Afterwards, the scene with the fortieth girl carrying a smaller girl now plays.

**The Stair** (chapter 5, +9): a third-person level, replacing the 2D fight there
- **Place:** the last three flights up the outside of the Sun Spire at sunset. The Spire wall on one side, open air and the cloud sea on the other, a hull still burning on the terrace below, the lamps of everyone who came up with him at the foot. Gold Auditors on each landing, the porters' kneeling plates, and at the top the white door under the Watcher.
- **Tavi** is on his left from the first panel and moves up a landing each time one is cleared.
- **What you do:** clear the terrace, two landings, and the first ring.
- **Boss:** the Auditor's Blade, on the eye inlaid in their own floor. "One had another name. She took it when she gave one the post." "We've got names for everybody. Mara has a list."
- **Two things to find:** the kneeling plates (Mara's forty-four commitments) and Brand's halberd, stood upright in a crack on the second landing. Somebody carried it up nine hundred steps and did not tell him.
- It ends on the white door, which is where the next scene already was.

**How it is built:** one engine and one copy of it in the file; the game tells it which of the three levels to be. The file grew by about 40 KB for both.

**Checked** by script: each level from first panel to hand-back, every wave, both finds, the boss intro and ending, with no errors; started from the game itself in its frame with BOOTS on the button; the boots carry, land and hurt. The High Docks still runs start to end. **Not checked:** played by hand, any of it; whether four waves is too long for Riser Nine; whether enemies path sensibly on the flights of the Stair; how the sunset level looks on a phone.

## v0.29.8 · 2026-11-19 — the second half: the rings, the Dockmaster's table, word of Lucan, the night before the Fall
From play notes: work on the chapters' cutscenes, lore and story; keep the placeholders; decide where the third-person combat fits the story best.

**Where the third-person levels go (decided)**
- **Riser Nine** (+5), **the High Docks** (+7), **the Stair** (+9): one in each of chapters 2, 3 and 5, and each a different kind of fight. Riser Nine is holding a place so other people can get out. The docks is a raid that goes wrong. The Stair is going up. Chapters 1 and 4 stay without one on purpose: in 1 he is a clerk and cannot be seen to fight; 4 belongs to Brand and Mara, and you play them.
- Riser Nine and the Stair are still placeholders (the 2D fight plays). After Riser Nine there is now a short scene that only shows once its level exists.

**New scenes**
- **The rings** (chapter 1, opening): how the Spire is laid out and who sleeps where; "the service", who are soot and are never called it; the porters' stair with a line painted down it; the bells people kneel to; the first time a porter knelt to him.
- **The Dockmaster's Table** (end of chapter 2, new): the last night of the quarter. Vant, who remembers the Assay as the summer he lost a river. Eleven kinds of greens nobody finishes. **Rook**, two years before the docks: he walks Kael along the moorings with a lamp and tells him about the nine minutes himself. Kael likes him. This is what Rook means at the end by "one sat at table with you".
- **Word of Lucan** (chapter 4): if Kael taught him, a letter with no name on it; he has been made Captain of the Door and will not be where she puts him. If not, he walks with a stick, has the same post, and Ilse tells Kael not to hope.
- **The Night Before** (chapter 4, new, before the Fall): the only time the Unlit are an army at rest. Hollis, Nell (Pip is sixteen and tells everyone the sky is blue), Ivo finally says he held him down, Dace, Sable with a crate of greens "for after". Mara's list of forty-four names and Brand's, to be read aloud when it is done. Kael adds Teo, and then Rook, and leaves it in.

**Lore fixed in place by these:** the Spire has rings in rank order; the service class above the rock is soot under another name; Vant is Dockmaster from at least +5; Rook's nine minutes are Rook's own figure; Lucan is Captain of the Door at +9 either way; the names are read aloud at the end because Mara asked for it.

**Checked:** every chapter builds with either Lucan branch and every speaker has a portrait; each new scene played through on screen by script with no errors; a bot played from chapter 2 into the Fall's opening before its time ran out. **Not checked:** read through by a person. The new scenes reuse existing pictures: the Table opens on the Spire from outside and then the moorings; there is no picture of the table itself yet.

## v0.29.7 · 2026-11-19 — two more third-person levels have their places held
From play notes: two more stretches of play like the High Docks are wanted, in different places at different points of the story; a placeholder is fine for now while the second half is refined.

- **Riser Nine** (+5, chapter 2) and **The Stair** (+9, chapter 5) are wired as third-person levels that do not exist yet. Each plays its existing 2D fight until its level is built, and remembers which one you played so the scenes after can differ, the way chapter 4 already does for the docks.
- Both are listed under Dev menu → Levels in 3D as PLANNED.
- The story bible has a map of Part Two (every scene, fight and playable stretch in order) and a note on what each of the two levels would be. These two are my proposal, not a decision; moving a slot is a one-line change.

Nothing else changed in this version. The High Docks has still not been played by hand.

## v0.29.6 · 2026-11-19 — the High Docks: steadier ground, what leads in and out of it
From play notes: some glitchy ground textures; tighten it up, then work out how it fits the game, the lore and the story, and build what leads in and out; then keep polishing, the new sections most.

**Ground**
- No two surfaces sit at the same height any more: the hall runner was level with the bond-house floor, the causeway overlapped the quay, and a slab under the crane overlapped the deck. Painted layers (lane lines, puddles, kneeling plates, the Watcher inlay) are now stacked with clear gaps.
- More depth precision close to the camera, sharper textures at a slant, and a wider shadow bias so the deck does not stripe.
- I could not see the glitch you saw in my own renders, so these are the likely causes fixed, not a confirmed one. If it is still there, tell me where on the level and what it looks like.

**What leads in** (Part Two, chapter 3, after Freight Three)
- **The Dock Stair**, told below-style: what the stair is (nine hundred steps on the outside of the Spire; porters use it, the Accredited have a lift); who has which part of the night (Ilse and forty Unlit on the lower basins, Sable aboard the lead hull, Brand and Kael at the top); who keeps the docks (Dockmaster Vant, at table with the Marshal tonight; his Stair Captain, Rook, has the watch); what Kael sees at the gate (statues, trees, a running fountain, six tiers over Nell counting water by the cup); then the second bell.

**What leads out**
- From Mooring One he watches the fleet go into the weather, takes the Count's sun off his collar and lets it go over the rail. "Edric Sorrel went over the rail with it. What was left ran for the stair."
- Chapter 4 now opens from there if you played the level: he comes down to an empty quay, and everything Rook had left is on the dock stair. (If the 2D fight played instead, chapter 4 opens as before.)

**Fit**
- Rook now sits under Vant, who was the dock's commander in the older 2D version, so both are true. The dock log says so.
- The level's music is the shift song, like every other track in the game, not the city bass it came with.
- The story bible now describes the level's fighting: the five beats, the Count, the memories.

**Not done:** the wider polish pass on the rest of the game. This round went on the level and the scenes around it.

## v0.29.5 · 2026-11-19 — the High Docks: a five-beat chain, the Count in a fight, words that are ours
From play notes: the comic pop-ups on hits should say things from the lore, and there should be combos; keep improving the fighting animations and make sure every limb is rigged.

- **Five beats instead of three**, each its own animation using a different limb: the cut (blade, from the shoulder), the backhand (blade, rising), **the ram** (off hand, straight from the hip), **the boot** (knee up, then through him; it knocks ordinary guards down), and the cleave (both hands, from the air).
- **The Count.** Every swing that lands is tallied over his head: THREE, FOUR ... TEN. Land ELEVEN without a gap of about three seconds and the line is struck: a burst that hits everyone near him, LINE STRUCK over each, and a third of a fury bar. Being hit resets it.
- **Words on the page are from the story.** Heavy hits: AIR OWED, COUNTED, SOOT, BREATHE; above half fury they change to FOR HER, EVERY BREATH, LAST BELL, HER NAME. THE RAM and THE BOOT name themselves. A late dodge is THE TURN. An enemy open to a finisher is HIS LINE IS OPEN. When a guard lands one he says NOTED, BALANCED, KNEEL or STRUCK. The Warden's slam is KNEEL; Rook's leap is BALANCED.
- **Rig check.** All ten key poses of the chain were rendered from two sides: shoulders, elbows, hips, knees and the cape all move in every beat.

**Checked** by script: the chain reaches its fifth beat, the count reaches ELEVEN and strikes, guards answer back, no errors. **Not checked:** how it feels to play, and whether five beats with the higher damage make ordinary guards too easy.

## v0.29.4 · 2026-11-19 — the High Docks: HUD out of the way, suns that work, a blade that lands, a place that looks like theirs
From play notes on a phone: the HUD sat in the middle of the action; walking onto the circles did nothing; with finishers in, the finisher and the fighting need to hit like the other fights do ("he's hitting like a sponge"); the place should feel like the Accredited and their society.

- **HUD.** Scaled to the size of the frame and kept to the corners: health and fury top left, the objective top right, messages low. The portrait is dropped in the small frame.
- **Chalked suns** now work when you walk onto them. Nothing to press. The first one is still the count.
- **Fighting.** The three punches are three cuts with the blade: a diagonal from the shoulder, a rising backhand, and a leaping two-handed cleave. About half again as much damage per hit, more again as fury rises, longer hit-stop, harder shake, bigger knock-back, two slashes on a heavy blow, and the cuts burn orange above half fury. The edges of the screen redden and pulse as the bar fills.
- **Finisher** rebuilt: two cuts counted aloud (ONE, TWO; on Rook NINE, TEN), then he goes up and brings the third down (STRUCK THROUGH; on Rook, ELEVEN), after the memory cut-in.
- **The Accredited's docks.**
  - The Watcher (the gold sun with an eye) inlaid in the deck where the causeway meets the quay, so everyone who comes up the stair walks across it; again over the freight yard above GRATITUDE IS BREATH; again over the Spire gate.
  - Gold Auditors twice life size on the quay rail, at the bond house door and on Mooring One, each with a lit halo, a raised lamp and the Count under one arm.
  - The twelve House standards along the open rail.
  - Trees in gilt tubs, and a running fountain, on a shelf whose tiers below are rationed by the cup.
  - A viewing pavilion with a couch and a bowl of greens, for watching the barges come in.
  - And what is there for us: a painted line (SOOT WALK THE LINE), brass plates before the Spire gate where porters kneel (KNEEL AT THE BELL), a breath meter at the yard gate (AIR OWED).
  - A colonnade on the east edge of Mooring One.

**Checked** in an upright phone-sized window with the on-screen buttons: A opens a question mark; walking onto the sun starts the count; A on a dazed Warden runs the memory and the three-beat finisher. **Not checked:** how the new cuts look in motion at speed (seen in stills), fight balance with the higher damage (fights will be shorter and Rook easier), and all of it on a real phone.

## v0.29.2 · 2026-11-19 — the High Docks plays in the game's own frame, with memories in place of powers
From play notes: it played in its own vertical window; it should sit in the same frame and use the same controls as the rest of the game; no start button and no "turn your phone"; drop the roguelite abilities for story beats; question marks should show memories from the future section; finishers and ultimates should cut to memories that show his rage; the fighter should look more like Kael.

- **Same frame, same controls.** The level is placed exactly over the game screen, upright or sideways, under SOOTBORN's own d-pad and buttons. A strikes, or uses whatever the prompt says; B dodges; ELEVEN (the hook button) is the ultimate; LOCK and LOOK are on the guard and jump buttons; Menu pauses. Drag the picture to turn the camera. Its own stick, buttons, pause icon and rotate notice are gone.
- **No title, no start.** It begins on its first panel straight from the chapter card and hands back without an end card. It keeps its place if you leave mid-level.
- **No paths.** The three-way choice and its powers are removed. One fury bar; when it is full, ELEVEN.
- **Memories at the question marks.** Each of the five finds now opens the memory it stirs, drawn with the game's own story panels: Maren taking the rota for copying; Brand in Freight Three; the Warden at the furnace; Cade at the desk the morning after Riser Nine; Celestine's room.
- **Memory cut-ins in fights.** Every ELEVEN, the finisher on a Warden and the finisher on Rook stop the fight for a memory: the picture, his eyes, its name, one line, on a red field. Five rotate on the ultimate (ELEVEN, HER LINE, A RING, BALANCED, THE INVOICE). The first chalked sun is the count itself.
- **Kael's model rebuilt** to match the rest of the game: Accredited plate (collar, tassets, greaves, big pauldrons), House Violet's cape, the blade in his right hand, the bronze valve ram lit on his off arm, the pinned sun on his chest. The trench coat is gone.
- Sound uses the game's own audio channel, so it does not need a second tap to start.

- **v0.29.3 fix.** The touch pad and buttons were hidden during the level (they only showed in the walking and fighting parts). They now stay up for the whole level. Checked by pressing the on-screen A and holding the on-screen d-pad in an upright phone-sized window.

**Not checked:** played by hand; whether the d-pad's four directions feel right for a third-person camera (there is no analogue stick on the touch pad); the blade with the old punch animations was only looked at in still poses.

## v0.29 · 2026-11-19 — The High Docks in third person, drawn like Second Chance; more to do in 2D than hide; the thought of betrayal
From play notes: a level or two in the future sequences that looks like Second Chance, in our universe, with a model for Kael, the enemies and the boss; more 2D mission types than stealth and pipes; another 2D fight; Kael striking the Proctor down in 2D and what he gets from it; the Wren arc and the thought of betrayal.

**The High Docks: a third-person level in the Second Chance art style** (Part Two, end of chapter 3; Dev menu → Levels in 3D)
- It is the Second Chance engine itself: cel shading with halftone dots, ink outlines, drawn faces, comic captions, story pages and SFX lettering. `issue/patch.mjs` re-casts and re-dresses it at build time; `issue/base.html` is Second Chance, untouched.
- **New character models:** Kael, gilded (ivory coat, gilt trim, gold hair with the one streak the Gilding never took, the band, the soot smudge, gold-leaf eyes, Seren's washer on a cord, the rigging line wound on his left arm); the **Dock Guard** (white enamel helm with one slit, dock teal); the **Stair Blade** (violet cowl, gilt half-mask, long knife); the **Warden** (steel helm with a red comb, halberd held short); the boss, **Stair Captain Ansel Rook** (white coat, gilt pauldrons, peaked cap and plume, a mooring gaff); and **Brand** (grey cloak, beard, halberd grounded), who keeps the head of the dock stair for the whole level.
- **The place (rebuilt in v0.29.1):** not a street. A shelf of white stone hung off the flank of the Sun Spire, above the weather. The dock stair comes up through a gate onto a causeway with a mooring basin on either side, eight lift-barges made fast in pairs. The causeway meets the quay: the Spire gate at one end, a cargo crane over the drop at the other. Then the freight yard, the bond house (the dock office is on its gallery), the signal roof, and the gangway up to Mooring One. The Spire wall, lit, rises over all of it; the cloud sea is under it; more pairs ride off the north and east edges. The route, floor heights and fights are the ones from Second Chance's level; every surface you see is new.
- **How he fights:** the three paths are his three forms. BANK HANDS (Shaft Drop), THE TURN, THE LINE (the hook line). The revive is ON MY BREATH. Checkpoints are chalked suns where he counts eleven.
- **Story:** the lamps are already lit. Five things to find on the way (a trimmed lamp, the watch board with FIRST chalked over SECOND, forty halberds to a crate, the dock log initialled by Cade, a signal lamp still warm). Rook at Mooring One, then **cut the last mooring yourself**; the level ends on Brand's halberd striking stone at the foot of the stair, which is where chapter 4 picks up.
- It runs in its own frame inside the same single file (the file is now about 1.8 MB). If the device cannot start it, or you choose "Skip this level" from its pause menu, the story carries on; if it cannot start at all the old 2D docks fight plays instead.

**2D levels: more to do than hide**
- **The Camp** now has a fistfight in the lane (Thorne), flint to strike and a sun to chalk as button sequences.
- **The Island** ends in a timed run with the standard.
- **The Lamp** (new, night 28): somebody is selling the House's watch. Question the camp, read what does not fit, accuse one of them. Get it right and it is a 2D duel with Corin Ashby in the rain, and a choice about what to do with him.
- **On the Ground** (new 2D fight): after the 3D fight with Proctor Voss, Kael finishes it on foot. Then a 2D cinematic of what he takes: the boots, the Proctors' seal and the cache it opens, the note of who owes the Proctors, and the white cloak.
- 2D fights set in the storm are now at night, in rain, with lightning.

**Wren, and the thought of betrayal** (Part Two, chapter 4; only if he met her on the Island)
- For a week after the docks Kael believes it was Wren: an engineer's pass is entered against the lamp gallery at the first bell. Ilse tells him a pass in a book is not a person. He goes on believing it, because Brand is a week dead and he needs it to be somebody he can reach. Then Sable brings Maren's note.
- When Wren comes up with eleven engineers she tells him what happened: she went to shut the valve, they held her and lit the lamps with her hand on the wheel. The eleven are the ones who held her. "You thought it was me." "For a week."

**Not checked:** nobody has played the High Docks by hand yet. It was driven by script from the title to the end card, and through the hand-off back into the story; fights inside it were not fought by hand in this version of the cast. Frame rate on a phone is unknown (it drops to its "FAST" picture by itself if it cannot hold the rate). Whether the level starts inside the Claude app is unknown until it is tried there; the fallback is the 2D fight.

## v0.28 · 2026-11-19 — Part Two on foot, a fourth Assay level, a second training bout, nicer flash-forwards, a lived-in world above
From play notes: keep fleshing out where the game is thin; more detail, more cutscenes.

**Two more playable 2D levels** (Dev menu → Assay missions, and in the story)
- **The Count hall** (Part Two, chapter 2): if you choose "Lose it. Buy a day", you now do it. After the bell, take the Tier Four order from the Marshal's tray and misfile it in the dead letters, past two Wardens and Maren Aldane working late. The Count itself and Maren's desk can be read. New white-and-gold Spire tiles, desks, pigeonholes, the Count on its stand.
- **The Sun** (below, five years on): you play Tavi, twelve, putting Seren's chalk sun back on the Pillar past Sull's night watch. This is the first time Part Two goes back below between chapters.
- That makes six playable 2D levels outside Days 1 and 2.

**Training years**
- **No Gloves** (2D, start of Day 2's dream): a second bout with Brand in the second year. It teaches the Turn. Two new Memory Arts (NOT THOSE, THE BAR), and scenes with Brand before and after.

**Chapter 3 (What She Knows) had two fights and nothing between them**
- Before The Son: Lucan and Kael on the keep. Kael says "aye" to him. If you read the viewing glass on the dais, Lucan learns what his mother wrote about him.
- Before the High Docks: the night in Freight Three. Dace comes up for the first time in seven years. The rota, and who took it for copying. Brand says Hollis's name.

**A fourth Assay level: The Last Night** (night 49, before the Keep)
- No enemies. Walk the camp the night before the last day. Petra, Oswin, a Teal cadet who came over, and Lucan under a truce cloth on the far bank. Then sit at the fire and eat Teo's bread.

**The flash-forward scenes look better**
- Every illustrated panel gets a finishing pass: a closing vignette, drifting motes (gold rising for the years ahead, ash falling for memories), a slow sweep of light and a little grain. Panels set in the future carry a thin gilt plate line. "Reduce motion & flicker" turns the moving parts off.
- The weather panel gains a sun with rays, stars, a far line of moored barges with lamps, and a flock.

**A world that is lived in, above the rock** (the way Cinderwell already is)
- Things to read in every level: what the heirs packed and did not pack; a child's slate with a sun drawn on it; the Proctors' sealed cache forty paces from hungry cadets; names cut into the pump-house lintel, most scored through; House Teal's ranking board; a mother's letter about the sum placed on her daughter's House; the one cloak packed for 480 cadets; the Watcher's eye, the same cloth above as below; the two mottos over the Count hall, one cut over the other; a clerk's uneaten greens; a child's drawing hidden in a kneehole.
- **The Count-Out.** A cadet hums the shift song in a bright key. It is an Accredited nursery game. They took the tune up the lift with them and forgot whose it was. (From research: in the source the hero finds the rulers' traditional dances resemble his own people's; this is our version, with a song.)
- More endings: Lucan, Ilse, Tavi.

**Engine**
- Cutscene steps can be conditional (`when`). Missions can use another hero sprite and place name.

**Checked:** every new level completes by script and its patrols run their routes; one bot run from the start of Day 3 through Day 4 and all five Part Two chapters to THE END, clicking the real "Wake up" and "Continue" buttons, with no errors. **Not checked:** nobody has played them; stealth difficulty is a guess.

## v0.27 · 2026-11-19 — the Assay on foot, the second arc, a fall, and the Gilding in full
From play notes: make the call on the open canon and finish the doc; more scenes, better content, more polish; a playable 2D mission in the Assay, and more than one; the other romance arc; more scenes that feed Kael's rage; new memories of Seren; more of Ilse and the transformation; use these moments to fill lore gaps.

**Canon decided** (story bible, "Decisions"): the Assay is one season; the High Docks are at +7; Brand dies at +7 and his line is now "seven years"; Vale was born on Tier Four; the Accredited bear late and live long (Celestine says so); the Assay keeps its shown order with the calendar strip; Ilse sent the leaf.

**Three playable 2D levels in the Assay** (Dev menu → Assay missions; they also play in the story)
- **The Camp** (day 3, in Day 3's dream): wood, a pump puzzle, a fire. No enemies. Talk to Petra and Oswin.
- **The Island** (night 25, before the Standard): stealth through House Teal's camp. Shut the lamp valve and their lamps go out, then take the standard. Wren Halloran is at the pump house.
- **The Dais** (night 30, before the Proctor): stealth past two Wardens. Read the grading book, the viewing glass and the roster.
- New night-valley tiles and props (pines, river, ford, tents, standards, pump house, lamps that go dark, marble dais, lecterns). A marker points at the current objective. "Skip this mission" is in the pause menu.

**Part Two**
- **Maren Aldane**, Teo's sister, across four chapters: the desk, the forty, the betrayal, the white door.
- **The Dock Stair**: a new fight. You play Brand. It cannot be won.
- **The low point** after Brand, and what gets Kael up.
- **Wren's arc**: three new scenes and an ending at Row K.
- Tavi before the stair; Ilse and the leaf; where Vale, Sull, Nell, Ivo, Sable, Dace and the other Houses ended up.
- Drive, rays and the Part Two choices are remembered between chapters and sessions.

**Part One**
- The Gilding dream is about twice as long: Ilse's own story, the bones, the throat, the hands he refuses to give up, the eyes, the glass.
- New memories of Seren: the fire at nine, the bet about the sky, the night of the washer.
- New rage scenes: at the window on Day 3, and the furnace doors on Day 4 (a choice).

**Fights and menus**
- Three new Memory Arts (WARM THING, A RING, ELEVEN MONTHS).
- **Memories** on the title screen and pause menu lists every Memory Art you have seen.
- Fights can be endless (`endless`) and doomed-but-fought (`doomedFight`).

**Checked:** each mission completes by script and hands back; every chapter from the Day 1 dream to THE END walks through with a bot (results below). **Not checked:** nobody has played any of it. Stealth difficulty in the two night levels is a guess; patrol timings were not tuned by hand. All new story is new canon.

## v0.26 · 2026-11-18 — acting on the State of the Game review: bug table, readability, onboarding
From the State of the Game review (written against v0.24). This round takes its bug table and its "readability and onboarding" phase. New story content (a fall, Teo's family, a rival, a companion above) is not started; it needs decisions first.

**Bugs from the review**
- **Tier Six Stands:** Mara no longer wears Kael's violet cape, and Hollis and Ivo no longer carry swords. Allies carry a blade only when the hero does.
- **Gold smear at high fury:** the fury flames on a 3D fighter are fewer and dimmer, and much dimmer in a one-on-one duel, so the body stays readable at full fury.
- **Finding Kael in a crowd:** in 3D fights with more than two other fighters, the marker over him carries his name.
- **About screen** rewritten (it still described two days and five fights). **"Below the Sun"** removed from the save-import message and the screen label.
- Already fixed before this round: braziers in front of fighters (v0.24). Not reproduced: the Valley hit counter and enemy bar running off the right edge; at 960x540 and 844x390 both sit inside the frame.

**Readability and onboarding**
- **Training room** is on the title screen and in the pause menu (it returns you to where you were). Its pause entry reads "Leave the training room".
- **Cooldown tags** (HK, RM, WC, BR, DR, RO) are hidden until that move is cooling down.
- **Assay calendar:** every flash-forward card for the Assay shows a strip of its seven beats in story order (Night 1, Day 19, Day 26, Day 31, Day 40, Last day, the Pinning) with the current one lit. The opening card now says "Day forty".
- **Chapter select** appears on the title screen after THE END.
- Text size and "Reduce motion & flicker" were already in Settings; the review missed them. Defaults unchanged.

**Documents**
- Story bible: a canon timeline with one date per event, and a list of six open conflicts with a proposed answer each. No game text was changed for these.

**Not done from the review**
- Reordering the Assay (the Standard before the Proctor), the Memories shelf, a HUD trim beyond cooldown tags, world dialogue size defaults.
- Everything in its phases 3 and 4: suspicion meter, the Count as a puzzle, a walkable Spire, training-year 2D bouts, a Row K interlude, the Part Two story additions.

**Not tested**
- Nobody has played this build. The fury glow was judged from two still frames. Phone frame rate is still unmeasured.

## v0.25 · 2026-11-18 — graphics plan, stages A to C: presets, cel shading, and one duel rebuilt
From play notes and the art-direction handoff: move toward anime-style characters; do one duel so both fighters look their best; mark it in the Dev menu; make a second version on 2D backgrounds; update or remove anyone in its background.

**Stage A: measurement and presets**
- Settings has **Graphics (3D fights): Low / Medium / High** (default High) and **Show frame time**.
- The frame-time readout (bottom left) shows average frame time, the worst frame, how many of the last 120 frames were slow, triangle count, scene build time and the preset.
- Low: lower render resolution, no glow pass, no outlines. Medium: full resolution and glow. High: adds ink outlines on rebuilt fighters.

**Stage B: cel shading**
- Lighting moved from per-vertex to per-pixel. Fighters get two hard light bands, a hard rim light and a hard highlight, with shadows pushed cool. Scenery gets the same treatment at about a third strength so it stays soft.
- Add `#nocel` to the address to see the old lighting.

**Stage C: one duel rebuilt, The Ford (Kael and Captain Vant)**
- Both fighters are rebuilt on the same joints and animations at about six heads tall instead of four and a half: long legs, a shaped torso and waist, tapered arms, knee and elbow joints, smaller hands and boots, a small shaped head, spiked hair for Kael and swept hair for Vant, hanging bangs, larger eyes with a highlight, slimmer cape and pauldrons.
- Bodies are lofted from rounded cross-sections with smooth normals, so the cel bands follow the form.
- **Ink outlines** on the rebuilt fighters (High only).
- Everyone else in the game still uses the old build. Add `#oldbody` to compare.

**Two versions in the Dev menu, both marked with a star**
- **The Ford (3D valley)**: the rebuilt fighters in the existing low-poly arena.
- **The Ford (painted 2D valley)**: the same fight and fighters in front of the pixel-art valley (sky, mountains, the keep, pines, tents, House banners, the river), with the side-on camera of the 2D fights.

**Background figures at the Ford**
- 3D version: the duelling pairs in the background are removed. The Ford is single combat; a war behind it was noise.
- Painted version: the cadets of both Houses watching from the tree line are kept as part of the painting, because the duel is public and Lucan sees it.

**Measured (software renderer; only the comparisons mean anything)**
- Outlines add about 2,000 triangles for two fighters and no measurable frame time.
- Low is about 35% faster than Medium in the 3D Ford.
- The painted version draws about 3,700 triangles against 25,700 and runs in roughly half the frame time.
- Nothing here says how it runs on a phone. Turn on Show frame time and read the numbers there.

**Not done:** face textures (faces are still built from small shapes); the other fighters; effects and arena polish (stage F). Nobody has played this build.

## v0.24 · 2026-11-18 — how he fights changes with the story; four finishers; a clipping pass on film
From play notes: research how the reference hero's fighting changes through the books so moves and flashbacks fit each fight; more quips; more finishers than ELEVEN; then watch the fights on camera, check clipping, and polish.

**Research, and what we took from it (in our own names)**
The reference hero starts as a miner with fast hands and a stolen tool for a weapon, is later taught a named formal school whose rule is never to back up and to turn an enemy's force round, becomes a master duellist, and late on has his signature blade broken. SOOTBORN now has the same arc with its own words:
- **Bank Hands** (below): fast and dirty, soot speech.
- **The Turn** (training and the Assay): Ilse's rule, never give ground, turn it. A parry now puts Kael behind the man he parried.
- **The Measure** (the Spire years): their own form used against them. A parry also answers with a free cut by itself.
- **We** (the Fall onward): everything, with the tier behind him.
- **The blade breaks.** In the last duel Celestine breaks the blade the Accredited gave him at 45% of her health. He finishes it with his hands (harder fists, no blade moves): "I had hands before I had any of this."

**Four finishers instead of one**
- **The eleven** (hold strike at full fury), named per fight as before.
- **One cut** (the same, on a STAGGERED enemy): a single pass straight through him. LAST BELL below, THE TURN in the Assay, STRUCK THROUGH on the Spire, HER NAME at the end.
- **From the air** (full fury while airborne, from the late Assay on): NINE FLOORS, then LIFT ZERO, then THE WEATHER. Hits everyone near the landing.
- **Last breath** (half fury when nearly down, once per fight): three blows, ON MY BREATH.
- The prompt under the fury bar names whichever one is available right now, and the pause-menu move list shows all four plus the current form.

**Quips and flashbacks by era**
- Kael now talks on kills, parries, breaking a stagger, low health and reaching FURNACE, from a different set of lines for each of the four periods (soot contractions below; no contractions once trained; "we" at the end).
- Enemies answer back when they land a hit: townsfolk apologise, Wardens bark orders, the Accredited say "Noted."
- Two new short memory flashes per period: one the first time he breaks an enemy's stagger, one when the second wind brings him back.
- Memories are spaced at least five seconds apart so they do not stack.

**Clipping and camera, found by filming the fights frame by frame**
- **Fighters no longer walk through each other.** Standing bodies are eased apart; named enemies hold their ground more than cadets.
- In a duel the camera rises when the enemy is between it and Kael, so he is not hidden behind the other man's back.
- Memory Art close-ups in 3D sat inside the fighters; the camera now stays back.
- The two braziers at the front of the keep, the stair and the Spire top stood in front of the action; they are moved out and hidden when the camera is near.
- Enemy speech bubbles no longer cover the health bars; the hit counter and style no longer sit on the STAGGERED label; the MEMORY tag no longer covers a panel's own labels; fight call-outs are hidden during a memory.

**Checked:** all four finishers fire and do damage in eight different fights; the parry turn moves him behind the enemy; the blade breaks and fists land afterwards. The later-book fighting details were researched from fan wiki and study-guide summaries, not the books themselves. Nobody has played this build.

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
