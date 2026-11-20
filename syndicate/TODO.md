# Guttercrown — what has not been done yet

Kept current as work lands. Newest section first.

## The Guest List (Easter egg roster)

Done so far:

- Hidden roster page: tap the crown five times, type `louie`, or hold both shoulder buttons on the title.
- Nine guests, exactly the ones Will named, each with their own race, title, moves, ultimate and finisher: David Roseinbeirg, Lil Bottie, Marcus, Will, Erin, Louie, King Bibi, a Sprout, Kael Brennick. (Mama, Corbin and Gas Guy were added by mistake and removed. Do not add anyone Will has not asked for.)
- Starting a career as a guest: one big button on their card; if all three pages are in use it asks which page they take. The crown opens the list by mouse or touch.
- Their own body style (round, smooth, big heads, cartoon eyes; Lil Bottie square and chrome; Louie a Shiba; only David keeps the pit's body) and their own clothes and props.
- Current starters, on the sand when called: Cuyapup, Bessling, Grasskin for Erin; Cuyaflare, Bessie, Mossman for Will.
- Knockout cinematics as ultimates: Hasbara (Will), Louie Airlines (Erin), The Final Bet (Marcus), Nuke the Data Center (Lil Bottie), War Criminal (King Bibi, the data-centre half only), Judgement's side-eye (Louie).
- An effect of its own on every guest move.
- A staged finisher for every guest (Derek Pulls Up, Latte-ality, Selfie-ality, Garden-ality, Bork-ality, Filibuster-ality, Compost-ality, Escape Velocity, Eleven Pieces, Your Hour Is Up).
- King Bibi comes back once per bout: below 30% health he returns to 75%.
- A career of titles for every guest (a new one each level) and their own level-up card instead of the Guild's lessons.
- The market reacts to whoever you brought: lines from Marc, Pip, the Guildmaster, Big Hobb and David about each guest.
- Spar any guest with your own fighter from their card on the Guest List; nobody is hurt.

Not done:

- **Kael Brennick** is built from Sootborn (the `sootborn` branch: docs/STORY_BIBLE.md): Sootborn race, gilded House Violet look with the washer, the rigging hook line, his blade, the Proctor boots, The Turn, Breach, Shaft Drop, Wide Cut, and ELEVEN as his ultimate; career titles follow his eras (Valve Tech to Edric Sorrel to We). Eleven was his special move, not a separate person, and has been folded into him. Not done: his other Sootborn finishers (Last Bell, Struck Through, Her Name, Nine Floors, On My Breath), Memory Arts, the fury bar.
- **War Criminal, second half** — the Knockout version goes on to a cyborg Bibi levelling a city while two other real politicians celebrate. Left out on purpose: it shows real people cheering a city being destroyed.
- **Finisher polish** — every guest now has their own staged finisher, but they are built from text, particles and existing poses. None has bespoke body animation, and the kill camera hides parts of some.
- **Derek Pulls Up polish** — Marcus is off camera when he says "NOT AGAIN"; no engine or horn sound of its own; Derek does not walk back to the van.
- **Flow Pros colours** — blue and white are the placeholder from Knockout until the real logo or a photo of the truck is supplied.
- **Louie** — on the wolf's skeleton and animations; no airplane ears.
- **Guest bodies** — share the pit skeleton and its animations. Fully separate rigs (the Sprout as a seed with stub legs, Bottie with jointed robot limbs) are not built.
- **Cinematic art** — the screens are flat shapes and type, far simpler than the Knockout pixel scenes.
- **Guest endings** — a one-line card after the normal ending; not seen in a real run.
- **Attack animations** — each guest now has their own idle, walk and cast poses laid over the frame (Bottie's stiff march and both arms out to fire, Mama carrying the baby, Bibi's wagging finger, Kael's skating lean), but melee swings are still the frame's: Marcus swings the wrench like a hammer, Eleven's blade like an axe.
- **Guest careers are titles only** — no new moves unlocked by level, no story scenes, no guest-specific ending; the normal ending plays.
- **Guest dialogue is one-liners** — passing remarks in the market only. Talking to Marc, Pip, the Guildmaster or David as a guest still plays the normal conversation, and guests have no lines about each other.
- **Guests only appear as opponents when you choose to spar them** — never on the ladder, and sparring guests do not use their cinematic ultimates.
- **The computer never picks the cinematic ultimates** — they fire from a real button press only.
- **Balance** — deliberately broken. Not tuned at all.

## Fighting

Done: caster weapon finishers (fire bolt, eldritch blast, frost, spark, acid, caster staves) and a second finisher for every melee weapon family (sword, axe, mace and hammer, spear, daggers, rapier), picked half the time. A late finisher for every class at Underboss rank (Bent the Wrong Way, Every String Cut, Boiled in the Skin, Made to Pray, Grown Through, Danced to Death), bending joints past where they go. Random finisher events: A Gift From the Stands (the crowd throws you a blade) and The Gibbet Comes Down. New third blows for the longsword (spinning backhand), mace (leaping smash) and halberd (low hooking sweep); left idle, every fighter shows off their weapon. Critical hits can now take the off hand, crack the skull (blunt) or open the belly (blades). Heavy hits now snap the head round and throw the hands for a moment. The stamping finisher and the own-arm finisher were filmed on a crawling and a one-armed opponent and play correctly. The kill camera now stays side-on for the whole finisher and rises over the killer if they would block the view.


- Rework the older finishers to use the new joints: every body that goes down now falls into its own sprawl (arms, elbows, wrists, knees, neck), which applies to every old finisher and every knockout. The older finishers' own choreography has not been rewritten joint by joint.
- Deeper class mechanics and upgrade trees: each class now has an edge meter (Momentum, Openings, Overcharge, Devotion, Wild Bond, Debt) with five pips on the bout HUD and a note on the Character page. Each class also has a move that spends the whole edge at once (Overrun, Exploit, Release, Sanctify, Call of the Wild, Foreclose) and one more trick from the trainer (Pommel Strike, Caltrops, Shatter, Bane, Moonbeam, Hex). Two upgrades for it on the Character page: Ready (level 3, 150 coin: start every bout with two pips) and Deep (level 6, 400 coin: every payout half again as big). Opponents of level 7 and up start with two pips.
- Stances in motion: six stances ran through real bouts with no errors (tests/stances-in-bout.js), but the bout camera is too far out to judge how each one looks moving; still worth a look in play.

## Story and menus

Done: once signed, the top line says how many souls you owe David; the intro's spike shot shows bodies hung on the spikes.


- Balance: after the edge was added the simulated careers ran with no deaths; the edge bonuses were trimmed (Momentum 4% a pip, Debt 3%, Overcharge +45%) and a cracked skull no longer cuts their damage. Now: fighter and rogue 0 deaths in 34 bouts, sorcerer 1 in 38, warlock 2 in 42. Worth a real play.

## Devices

- iPhone Safari: menu size slider and zoom behaviour unverified on a real phone.
- Physical controller: shoulder buttons in the Tailor, and the Guest List shoulder-hold, unverified on real hardware.
