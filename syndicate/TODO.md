# Guttercrown — what has not been done yet

Kept current as work lands. Newest section first.

## From the first blind playtest (26 Nov)

A bot played about 40 minutes without reading the code: mouse and keyboard, a simulated controller, and touch on phone-sized windows. Fixed straight away: a reload mid-bout erasing a death; controller focus lost on the builder's cards (and LB/RB now change tabs); walking stuck on guards and counters; E doing nothing a few steps from a stall; the corner pillar hiding the fight; ability names running together on the fight bar; Escape closing a whole page instead of stepping back; Fire Bolt listed twice for sorcerers; a Ledger line printed twice; the unreadable line on the Open Sand card; pre-fight quotes with no speaker; market names cut off at the screen edge; blade wording on casters' upgrades at the Fence.

Not done, to look at:

- **First bout feels like a stunlock** (Hesper chains Shield Bash, stun, posture break and wall hits). The test machine ran in slow motion, which made it worse, but nothing tells you that you are stunned or why your clicks do nothing. Show it.
- **Too much to read before the first fight**: How to Play is 17 bullets; Pip's tour says "tap" on desktop; the Finisher list shows 12 entries locked behind ranks nobody has explained; the Guildmaster's "You have something to choose" does not point at anything.
- **Builder**: the panel changes height per tab so Next moves under the pointer; picking a third art silently drops the first; the name field only appears on the last tab (a controller player is named automatically); a Fighter starts with Fire Bolt before the cantrip is explained.
- **Halberd** looks squashed in the builder preview, and the blade fills the corner of dialogue close-ups.
- **Phone, landscape**: the logo covers Continue and the lower title buttons fall off screen. Check on a real phone first (the bot's copy of the game lacked the phone viewport setting the published page has).
- **Phone crowding**: health bars full width with Pause squeezed between; small Parry/Dodge/Taunt labels; Erase sits right under Continue on the save list.
- **Market**: some names still overlap each other (the Sergeant and Pip); two street lines can run together; the player can stand hidden behind the lamp post.
- **Controller**: dialogue Skip shows no button and B skips Pip's whole tour without asking; on the title Continue is gold while the focus ring is on New Fighter.
- **Bodies pass through the Sergeant, Old Marrow Tibb and the Guildmaster's counter** (they are not obstacles).
- **No message if three.js fails to load**: the title is a plain black screen.

## The Guest List (Easter egg roster)

Done so far:

- Hidden roster page: tap the crown five times, type `louie`, or hold both shoulder buttons on the title.
- Nine guests, exactly the ones Will named, each with their own race, title, moves, ultimate and finisher: David Roseinbeirg, Lil Bottie, Marcus, Will, Erin, Louie, King Bibi, a Sprout, Kael Brennick. (Mama, Corbin and Gas Guy were added by mistake and removed. Do not add anyone Will has not asked for.)
- Starting a career as a guest: one big button on their card; if all three pages are in use it asks which page they take. The crown opens the list by mouse or touch.
- Their own body style (round, smooth, big heads, cartoon eyes; Lil Bottie square and chrome; Louie a Shiba; only David keeps the pit's body) and their own clothes and props.
- Current starters, on the sand when called: Cuyapup, Bessling, Grasskin for Erin; Cuyaflare, Bessie, Mossman for Will.
- Knockout cinematics as ultimates: Hasbara (Will), Louie Airlines (Erin), The Final Bet (Marcus), Nuke the Data Center (Lil Bottie), War Criminal (King Bibi, the data-centre half only), Judgement's side-eye (Louie).
- An effect of its own on every guest move.
- A staged finisher for every guest (Derek Pulls Up, Latte-ality, Selfie-ality, Garden-ality, Bork-ality, Filibuster-ality, Compost-ality, Your Hour Is Up, and Kael's own set).
- King Bibi comes back once per bout: below 30% health he returns to 75%.
- A career of titles for every guest (a new one each level) and their own level-up card instead of the Guild's lessons.
- The market reacts to whoever you brought: lines from Marc, Pip, the Guildmaster, Big Hobb and David about each guest.
- Spar any guest with your own fighter from their card on the Guest List; nobody is hurt.

Not done:

- **Kael Brennick** is built from Sootborn (the `sootborn` branch: docs/STORY_BIBLE.md, and the 3D cadet `kael2` in src/g3.js and src/story.js). Model after the 3D reference: cream plate with gold rims, flared gold pauldrons, violet sash and three-panel cape, the leather band with her washer, tassets, greaves with knee points, pale-gold spiked hair, soot on the cheek, gold in the eyes; the blade Brand reforged with a hook at its tip, the seat knife (a palm-long hooked blade) at the hip, and the rigging hook coiled at the belt. Moves: Hook Line (pulls them in), Reaping Hook (the hooked blade drags them past him), Sling Blade (the seat knife slung out and back), Wide Cut, Breach, Kick, Headbutt and Throw, Shaft Drop, The Turn, The Measure, The Roar, The Boots; ELEVEN as ultimate; On My Breath once a bout. Finishers from Sootborn with its cut-ins: ELEVEN, Last Bell, The Turn, Struck Through, Her Name, Nine Floors, Lift Zero, and On My Breath when he is nearly gone. Not done: The Weather (needs allies), Memory Arts, the fury bar, the per-fight names for ELEVEN. Sootborn has no weapon called a sling blade; the seat knife on its cord is used for it.
- **War Criminal, second half** — the Knockout version goes on to a cyborg Bibi levelling a city while two other real politicians celebrate. Left out on purpose: it shows real people cheering a city being destroyed.
- **Finisher polish** — every guest now has their own staged finisher, but they are built from text, particles and existing poses. None has bespoke body animation, and the kill camera hides parts of some.
- **Derek Pulls Up polish** — Marcus is off camera when he says "NOT AGAIN"; no engine or horn sound of its own; Derek does not walk back to the van.
- **Flow Pros colours** — blue and white are the placeholder from Knockout until the real logo or a photo of the truck is supplied.
- **Louie** — on the wolf's skeleton and animations; no airplane ears.
- **Guest bodies** — share the pit skeleton and its animations. Fully separate rigs (the Sprout as a seed with stub legs, Bottie with jointed robot limbs) are not built.
- **Cinematic art** — the screens are flat shapes and type, far simpler than the Knockout pixel scenes.
- **Guest endings** — a one-line card after the normal ending; not seen in a real run.
- **Attack animations** — each guest now has their own idle, walk and cast poses laid over the frame (Bottie's stiff march and both arms out to fire, Bibi's wagging finger, Kael's low stance with the blade out), but melee swings are still the frame's: Marcus swings the wrench like a hammer.
- **Guest careers are titles only** — no new moves unlocked by level, no story scenes, no guest-specific ending; the normal ending plays.
- **Guest dialogue is one-liners** — passing remarks in the market only. Talking to Marc, Pip, the Guildmaster or David as a guest still plays the normal conversation, and guests have no lines about each other.
- **Guests only appear as opponents when you choose to spar them** — never on the ladder, and sparring guests do not use their cinematic ultimates.
- **The computer never picks the cinematic ultimates** — they fire from a real button press only.
- **Balance** — deliberately broken. Not tuned at all.

## Fighting

Done: caster weapon finishers (fire bolt, eldritch blast, frost, spark, acid, caster staves) and a second finisher for every melee weapon family (sword, axe, mace and hammer, spear, daggers, rapier), picked half the time. A late finisher for every class at Underboss rank (Bent the Wrong Way, Every String Cut, Boiled in the Skin, Made to Pray, Grown Through, Danced to Death), bending joints past where they go. Every weapon has a temper of its own, shown in the Armoury (Riposte, Tip of the Spear, Hewing, Bonebreaker, Over the Guard, Flurry, Point Control, Chop and Hook, Gutter Reach, Blessed Iron, Armour Piercer, The Toll, Snare, Rooted, Stalactite Cold, Thornwood Sweep, Bone Sickles, Kindling, Brittle, Arc, Ember Burst, Repelling Blast, Grave Cold, Tether, Gnaw, Pact Drain). Druids in a beast shape have the beast's own temper instead (The Pack, The Weight, Venom, Blood Drinker, The Old Thing). Every third basic bolt is the calling's own: a fan of three (sorcerer), a heavy shoving blast (warlock), a pair (cleric, druid). When the crowd loves you (hype 70+), now and then a flask is thrown into the pit: whoever reaches it first heals 12%, and a hurt opponent will race you for it. Random finisher events: A Gift From the Stands (the crowd throws you a blade), The Gibbet Comes Down, and Something Under the Grate (hands from a floor grate drag them below). New third blows for the longsword (spinning backhand), mace (leaping smash) and halberd (low hooking sweep); left idle, every fighter shows off their weapon. Critical hits can now take the off hand, crack the skull (blunt) or open the belly (blades). Heavy hits now snap the head round and throw the hands for a moment. The stamping finisher and the own-arm finisher were filmed on a crawling and a one-armed opponent and play correctly. The kill camera now stays side-on for the whole finisher and rises over the killer if they would block the view.


- Rework the older finishers to use the new joints: every body that goes down now falls into its own sprawl (arms, elbows, wrists, knees, neck), which applies to every old finisher and every knockout. The older finishers' own choreography has not been rewritten joint by joint.
- Deeper class mechanics and upgrade trees: each class now has an edge meter (Momentum, Openings, Overcharge, Devotion, Wild Bond, Debt) with five pips on the bout HUD and a note on the Character page. Each class also has a move that spends the whole edge at once (Overrun, Exploit, Release, Sanctify, Call of the Wild, Foreclose) and one more trick from the trainer (Pommel Strike, Caltrops, Shatter, Bane, Moonbeam, Hex). Two upgrades for it on the Character page: Ready (level 3, 150 coin: start every bout with two pips) and Deep (level 6, 400 coin: every payout half again as big). Opponents of level 7 and up start with two pips.
- Stances in motion: six stances ran through real bouts with no errors (tests/stances-in-bout.js), but the bout camera is too far out to judge how each one looks moving; still worth a look in play.

## Story and menus

Done: once signed, the top line says how many souls you owe David; the intro's spike shot shows bodies hung on the spikes.


- Balance: after the edge was added the simulated careers ran with no deaths; the edge bonuses were trimmed (Momentum 4% a pip, Debt 3%, Overcharge +45%) and a cracked skull no longer cuts their damage. After the weapon tempers: fighter 1 death in 36 bouts, rogue 1 in 37, sorcerer 1 in 41, warlock 4 in 42 (the warlock may now be a little hard). Latest run: fighter 0 in 34, rogue 2 in 41, sorcerer 1 in 39, warlock 2 in 41. Worth a real play.

## Devices

- iPhone Safari: menu size slider and zoom behaviour unverified on a real phone.
- Physical controller: shoulder buttons in the Tailor, and the Guest List shoulder-hold, unverified on real hardware.
