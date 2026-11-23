// ============================================================
// ch1new — PREVIEW ONLY. A new cutscene for Chapter One, "Before the Furnace".
// Not part of the game. Follows the Sootborn Script Rules sheet (22 Nov 2026):
// first-person narration with no contractions (S4), Tallyman not Proctor (D10), Tavi is a boy (C1),
// the clinic was cut "a month ago" (T6), no player choices (the book's version of each beat).
// New to this version: the binding at the Pillar is staged, the morning after on Row K, the fever ward
// as a place you stand in, the plan under the Pillar at night, and the heist played as a scene with lamps.
// ============================================================
const CH1_LAMP = id => ({ fx: () => { const a = Cutscene.actor(id); if (a) a.lamp = 1; } });
const CH1_NEW = [
  { music: 'mystery' }, { letter: 1 },
  // ---- the world
  { panel: 'world' }, { fade: 'in', spd: 0.7 }, { wait: 1.2 },
  { narr: 'They say the surface burned two hundred years ago. That the sky is poison, and the sun is a furnace that eats lungs.' },
  { pstage: 1 }, { wait: 2.2 },
  { narr: 'So we live below. Cinderwell. Six tiers of rock wrapped round a machine called the Deep Array, which makes the only air there is.' },
  { pstage: 2 }, { wait: 0.8 },
  { narr: 'We keep the Array running. The Array Authority keeps the count. Every breath down here is rationed, logged and owed.' },
  { narr: 'They have a word for us. Soot. The thing that is left over when something useful burns.' },
  { pstage: 3 }, { wait: 1.6 },
  { narr: 'Once in a decade they come down Lift Zero, in white, in light. We kneel. They go back up. Nobody from Cinderwell has ever gone with them.' },
  { narr: 'My name is Kael Brennick. I fixed valves on Tier Six. And eleven months before the furnace, I thought the worst thing that could happen to me was a girl saying no.' },
  { fade: 'out' }, { panel: null }, { music: 'home' },

  // ---- the proposal and the binding
  { card: 'ELEVEN MONTHS BEFORE THE FURNACE', sub: 'The Festival of the First Fire. Ashgate Square.', tr: 'furnace', min: 1.6, max: 4 },
  { scene: 'square', cam: [10, 9], dark: 'rgba(8,5,16,.32)', zoom: 1.7 },
  { add: [['seren', 12, 9, 1], ['kael', 5, 9, 3], ['c1', 6, 6, 0, 'c1'], ['c2', 18, 6, 2, 'c2'], ['c3', 17, 11, 1, 'c3'], ['ivo', 16, 10, 2], ['juno', 9, 12, 1], ['bao', 19, 9, 2], ['pell', 7, 11, 3],
    ['mara', 15, 12, 1], ['tavi', 14, 12, 1], ['orin', 5, 12, 3], ['nell', 20, 11, 2]] },
  { fade: 'in' }, { wait: 0.5 },
  { narr: 'Once a year, Cinderwell lights paper lanterns and pretends the Lumen Pillar is the sun. It is the only night anybody stays out past last bell.' },
  { move: 'juno', to: [10, 11], spd: 44 }, { move: 'pell', to: [8, 10], spd: 20 },
  { pan: [11, 9], dur: 2.4, hold: false }, { zoom: 2.2 },
  { move: 'kael', to: [11, 9], spd: 26, wait: true },
  { emote: 'seren', t: '!' }, { face: 'seren', dir: 2 },
  { say: 'seren', t: "Don't look. It's not finished." },
  { face: 'seren', dir: 1 },
  { say: 'kael', t: "It's a sun." },
  { face: 'seren', dir: 2 },
  { say: 'seren', t: "It's THE sun. The real one. Orin says it's white-gold, and you can't look straight at it, and it never needs a valve." },
  { say: 'kael', t: "I can't look straight at you either. Same problem." },
  { emote: 'seren', t: '...' },
  { say: 'seren', t: '...That was disgusting.' },
  { say: 'seren', t: 'Say it again.' },
  { say: 'kael', t: "One day I'll show you the real one." },
  { say: 'seren', t: "Don't promise me the sky, Kael Brennick. Promise me tomorrow. Tomorrow I can use." },
  { panel: 'hands' }, { sfx: 'clue' },
  { narr: 'I had been carrying it in my pocket for three weeks. A brass washer off Bank Seven, filed smooth on my lunch breaks until it shone like something that mattered.' },
  { panel: null }, { kneel: ['kael'] }, { sfx: 'step' }, { wait: 0.5 },
  { emote: 'ivo', t: '!' }, { emote: 'c1', t: '!' }, { emote: 'bao', t: '!' },
  { move: 'ivo', to: [14, 10], spd: 40 }, { move: 'c1', to: [8, 7], spd: 30 }, { move: 'c2', to: [15, 8], spd: 30 }, { move: 'bao', to: [16, 9], spd: 30 }, { move: 'c3', to: [15, 10], spd: 30 },
  { narr: 'I went down on one knee on the hot stones, which you do not do in Ashgate Square. The square went quiet, in the way a square does when it has decided this is the most interesting thing that has happened all year.' },
  { panel: 'hands' },
  { say: 'kael', t: "Seren Holloway. I can't give you the sky. But I can give you a perfectly balanced pressure seal." },
  { say: 'seren', t: '...That is the worst proposal in the history of Cinderwell.' },
  { pstage: 1 }, { sfx: 'coin' },
  { say: 'seren', t: 'Aye. Obviously aye. Put it on me before I come to my senses.' },
  { wait: 0.9 }, { panel: null }, { kneel: ['kael'], v: 0 }, { emote: 'seren', t: 'heart' }, { emote: 'kael', t: 'heart' },
  // the binding: Mara comes through the crowd, the tier closes in a ring
  { zoom: 1.9 }, { move: 'tavi', to: [10, 10], spd: 46 },
  { move: 'mara', to: [12, 10], spd: 26, wait: true }, { face: 'mara', dir: 1 },
  { face: 'kael', dir: 0 }, { face: 'seren', dir: 0 },
  { say: 'mara', t: 'Hands. Both of you. Chalk first.' },
  { sfx: 'clue' }, { flash: '#ffe9b0' }, { emote: 'juno', t: '!' }, { emote: 'tavi', t: '!' },
  { narr: 'Mara Venn bound us at the Pillar in front of the whole of Crew Three, with chalk on both our hands. She said the words, and Seren\'s voice went on the last one. Nobody ever mentioned that to her.' },
  { emote: 'ivo', t: '...' },
  { say: 'ivo', t: "I'm not crying. The square is dusty. The square is VERY dusty." },
  { face: 'seren', dir: 2 }, { face: 'kael', dir: 3 }, { zoom: 2.6 },
  { narr: 'Seren turned my wrist over and drew the last ray of her sun on the inside of it with one finger. "There," she said. "Now you\'ve seen it."' },
  { fade: 'out' },

  // ---- the morning after
  { card: 'MORNING', sub: 'Row K. The morning after the First Fire.', min: 1.2, max: 4 },
  { scene: 'apt', cam: [5, 5], dark: 'rgba(14,8,12,.16)', zoom: 1.9 },
  { add: [['seren', 5, 7, 1], ['kael', 4, 4, 0], ['tavi', 10, 6, 2]] },
  { fade: 'in' }, { wait: 0.6 },
  { narr: 'The next morning, Row K was up before us. It always was.' },
  { move: 'kael', to: [5, 5], spd: 22, wait: true },
  { say: 'seren', t: "Don't look at it like that. It's a washer. It's the only round thing you own and you gave it away, so now you own nothing round." },
  { say: 'kael', t: 'I own half of one.' },
  { say: 'seren', t: 'Aye. The inside half.' },
  { add: [['mara', 6, 8, 1]] }, { sfx: 'step' }, { emote: 'mara', t: '!' },
  { say: 'mara', t: "Bay Three at first bell, the both of you. I married you. I didn't give you the day." },
  { move: 'tavi', to: [7, 6], spd: 30, wait: true }, { emote: 'tavi', t: '...' },
  { narr: 'My brother came out in his nightshirt. Tavi was six. He looked at Seren, and at the ring, and at me, and frowned the way he frowned at sums.' },
  { say: 'tavi', t: 'Is she my sister now? Do I have to do what she says?' },
  { say: 'kael', t: 'Aye. And aye.' },
  { move: 'tavi', to: [6, 7], spd: 26, wait: true }, { face: 'tavi', dir: 1 }, { emote: 'seren', t: 'heart' },
  { narr: 'Tavi thought about that. Then he went and stood next to her, and not next to me. It stayed that way.' },
  { fade: 'out' }, { music: 'mystery' },

  // ---- the fever
  { card: 'FOUR DAYS BEFORE THE FURNACE', sub: 'The fever comes to Tier Six.', min: 1.2, max: 4 },
  { scene: 'apt', cam: [3, 3], dark: 'rgba(4,3,12,.6)', zoom: 2.2 },
  { add: [['tavi', 1.5, 2.4, 0], ['kael', 3, 3, 2], ['seren', 5.6, 3.6, 2]] },
  { fade: 'in' }, { wait: 0.8 }, { sfx: 'cough' }, { wait: 0.9 }, { sfx: 'cough' },
  { narr: 'Tavi was seven, and when he breathed it sounded like a sock being pulled over a boot.' },
  { emote: 'tavi', t: '...' },
  { say: 'tavi', t: '...Kael? Is it morning? It feels like breathing through a sock.' },
  { say: 'kael', t: "Not morning yet, Tav. Sleep. That's an order from your favorite person." },
  { say: 'tavi', t: "Seren's my favorite person." },
  { say: 'seren', t: 'Smart kid.' },
  { sfx: 'cough' }, { move: 'seren', to: [4.4, 3.2], spd: 16, wait: true },
  { say: 'seren', t: 'Kael. Get up.' },
  { fade: 'out' },

  // ---- the ward
  { scene: 'clinic', cam: [7, 4], dark: 'rgba(6,10,14,.5)', zoom: 2 },
  { add: [['nell', 7, 3, 0], ['pip', 2, 3, 0], ['mosi', 4, 3, 0], ['ada', 2, 5, 0], ['tavi', 4.4, 5, 0], ['kael', 7, 8, 1], ['seren', 8, 8, 1]] },
  { fade: 'in' }, { sfx: 'cough' },
  { move: 'seren', to: [8, 6], spd: 24 }, { move: 'kael', to: [7, 5], spd: 24, wait: true },
  { narr: 'There were forty cots, and forty children in them, six to a row. You could hear a room full of children working for every breath, and once you had heard it you could not stop.' },
  { sfx: 'cough' },
  { say: 'nell', t: "I'll be honest, because you'd know if I wasn't. The fever isn't what kills them. It's the air." },
  { panel: 'ward' },
  { say: 'nell', t: "The Authority cut the clinic to ration pressure a month ago. Forty kids, breathing each other's breath. Tavi's lungs are filling." },
  { panel: null }, { face: 'kael', dir: 2 }, { pan: [5, 5], dur: 1 }, { emote: 'kael', t: '...' },
  { narr: 'My brother lay in the cot at the end of the row with his hand flat on his chest, as if he could hold the air in.' },
  { pan: [7, 4], dur: 0.8 }, { face: 'kael', dir: 1 },
  { say: 'kael', t: 'Then we get the clinic more air.' },
  { say: 'nell', t: "From where? Every cubic meter in Cinderwell is counted. Tier 6 doesn't get one breath more than its ration." },
  { panel: 'pipe' },
  { say: 'kael', t: "Not every meter. Bank Seven has a line nobody's allowed to touch. Authority seal. Fat as my arm." },
  { say: 'kael', t: 'I read its gauge once. That one pipe carries more air than all of Tier 6 put together. Every night. Going somewhere.' },
  { say: 'seren', t: "It's Authority, Kael. If they so much as see a needle twitch—" },
  { pstage: 1 }, { sfx: 'rotate' },
  { say: 'kael', t: 'So we bleed it slow. A sliver, into the clinic line. And we balance the bank again before the morning audit. Nobody sees a thing.' },
  { narr: 'Stealing air is the one crime the Authority never forgives. They do not fine you for it. They do not jail you. They commit you to the Array, and the Array runs on fire.' },
  { panel: null }, { emote: 'nell', t: '...' }, { face: 'nell', dir: 1 }, { wait: 0.8 },
  { say: 'nell', t: "...I didn't hear any of this. I'll have the ward vents open at second bell." },
  { fade: 'out' },

  // ---- the plan, under her sun
  { scene: 'square', cam: [12, 9], dark: 'rgba(5,3,14,.62)', zoom: 2.3 },
  { add: [['seren', 10, 9, 3], ['kael', 8, 9, 3]] },
  { fade: 'in' },
  { move: 'seren', to: [12, 9], spd: 26 }, { move: 'kael', to: [11, 9], spd: 26, wait: true },
  { narr: 'We walked back through the square without talking. At the Pillar she stopped, under her own painted sun, and turned round.' },
  { face: 'seren', dir: 2 },
  { say: 'seren', t: 'Why you? Why does it always have to be you?' },
  { say: 'kael', t: "Because I won't watch Tav drown in his own bed." },
  { emote: 'seren', t: '...' },
  { say: 'seren', t: "...Aye. That's the answer I married, you idiot. That exact one." },
  { zoom: 2.7 },
  { say: 'seren', t: 'Listen. The audit relay is on the east wall, straight across the bay from the door: the grey box with the red lamp. Cut that first, or the bank logs every turn you make.' },
  { say: 'seren', t: 'Then Valve Bank Seven, on the north wall. Relay, then bank. Say it back.' },
  { say: 'kael', t: 'Relay, east wall. Then the bank.' },
  { say: 'seren', t: "Fine. I'll keep watch. The Night Tallyman walks Bay Three every hour with a lantern. If he sees you, you're a thief. If he sees me, I'm lost." },
  { say: 'kael', t: 'And if he sees both of us?' },
  { say: 'seren', t: "Then we're newlyweds looking for somewhere private. Try to look embarrassed. Shouldn't be hard." },
  { fade: 'out' },

  // ---- the heist, as a scene
  { card: 'BAY THREE', sub: 'Second bell.', min: 1.2, max: 4 },
  { scene: 'bay', cam: [6, 7], dark: 'rgba(3,2,9,.84)', zoom: 1.5 },
  { add: [['kael', 1, 7, 3], ['seren', 1, 8, 3], ['tm', 18, 6, 2, 'proctor'], ['wm', 17, 12, 0, 'watchman']] },
  CH1_LAMP('tm'), CH1_LAMP('wm'),
  { fade: 'in' }, { kneel: ['kael'] },
  { narr: 'Bay Three at night is the loudest quiet in Cinderwell. The banks breathe. The pipes knock. The heart-furnace ticks as it cools.' },
  { move: 'tm', to: [8, 6], spd: 22 }, { pan: [9, 7], dur: 3, hold: false },
  { narr: 'The Night Tallyman walked the middle of it, end to end, with his lantern held high. At each end he stopped and looked up and down, the way a man checks a stove he is not sure he turned off.' },
  { face: 'tm', dir: 0 }, { wait: 0.7 }, { face: 'tm', dir: 1 }, { wait: 0.7 },
  { face: 'wm', dir: 2 }, { wait: 0.5 }, { face: 'wm', dir: 1 }, { wait: 0.5 }, { face: 'wm', dir: 3 },
  { narr: 'The lamps swept. I counted them. Four. Six. Eight. There was always a gap, if you were patient, and nobody in Cinderwell is more patient than a valve hand.' },
  // he goes while the Tallyman walks away east; Kael follows behind the crates
  { kneel: ['kael'], v: 0 }, { move: 'tm', to: [17, 6], spd: 20 }, { pan: [15, 7], dur: 4.5, hold: false },
  { move: 'kael', to: [7, 8], spd: 30, wait: true }, { kneel: ['kael'] }, { wait: 0.6 }, { kneel: ['kael'], v: 0 },
  { move: 'kael', to: [14, 8], spd: 30, wait: true }, { kneel: ['kael'] }, { face: 'wm', dir: 0 }, { wait: 0.7 }, { kneel: ['kael'], v: 0 },
  { move: 'kael', to: [20, 8], spd: 30, wait: true }, { move: 'kael', to: [20, 7], spd: 30, wait: true }, { face: 'kael', dir: 3 }, { kneel: ['kael'] },
  { zoom: 2.2 }, { pan: [19, 7], dur: 1 },
  { sfx: 'rotate' }, { wait: 0.7 }, { sfx: 'rotate' }, { wait: 0.7 },
  { narr: 'At the east wall I put my hand on the grey box and held it there while the cutter bit into the seal. Two seconds, not breathing, the way I had been taught.' },
  { face: 'tm', dir: 3 }, { emote: 'tm', t: '?' }, { move: 'tm', to: [18, 7], spd: 14, wait: true }, { face: 'tm', dir: 3 },
  { narr: 'The lamp came round. It stopped on the crate beside my face.' },
  // Seren, at the door
  { sfx: 'rumble' }, { sfx: 'clink' }, { shake: 0.5 },
  { emote: 'tm', t: '?!' }, { emote: 'wm', t: '?!' }, { face: 'tm', dir: 2 }, { face: 'wm', dir: 2 },
  { zoom: 1.5 }, { pan: [6, 7], dur: 1.1 }, { emote: 'seren', t: '!' },
  { move: 'tm', to: [7, 7], spd: 34 }, { move: 'wm', to: [10, 11], spd: 30 },
  { narr: 'Across the bay, by the door, something heavy went over with a crash, and Seren said a word I will not write down. Every lamp turned toward her.' },
  { face: 'seren', dir: 3 },
  { narr: 'She stood in the doorway with a sack of bolts at her feet and a hand on her hip, swearing at the sack. The Night Tallyman held his light on her for a long time.' },
  { emote: 'tm', t: '...' }, { wait: 0.9 },
  { move: 'tm', to: [12, 6], spd: 20 }, { move: 'wm', to: [17, 12], spd: 20 }, { move: 'seren', to: [0, 7], spd: 26, wait: true }, { remove: 'seren' },
  { narr: 'Then he grunted, and turned, and walked on down the middle of the bay. Seren picked up her bolts and was gone.' },
  // the bank
  { sfx: 'solved' }, { kneel: ['kael'], v: 0 }, { pan: [16, 5], dur: 1.2 },
  { narr: 'The relay was dead.' },
  { move: 'tm', to: [5, 6], spd: 20 },
  { move: 'kael', to: [20, 3], spd: 34, wait: true }, { pan: [11, 3], dur: 2.6, hold: false }, { move: 'kael', to: [10, 2], spd: 34, wait: true }, { face: 'kael', dir: 1 },
  { zoom: 2.4 },
  { panel: 'pipe', stage: 1 }, { sfx: 'rotate' },
  { narr: 'Bank Seven came up under my hands with its drums singing. I found the Authority line by touch, the fat one, and the clinic branch two couplings down, and I turned the wheel a quarter. Then another eighth.' },
  { sfx: 'rotate' },
  { narr: "The forbidden line shuddered. A sliver of the Authority's air bled sideways into the clinic line and ran downhill toward forty sleeping children." },
  { panel: null }, { add: [['seren', 5, 3, 3]] }, { move: 'seren', to: [9, 2], spd: 34, wait: true }, { face: 'kael', dir: 2 },
  { say: 'seren', t: 'Kael. Did it work?' },
  { say: 'kael', t: 'Listen.' },
  { panel: 'ward', stage: 1 }, { sfx: 'solved' },
  { narr: 'Far off, through the vents: the clinic fans, spinning up. Then, thin and tired and unmistakable, a cheer, from a ward full of children who could suddenly breathe.' },
  { wait: 0.8 }, { panel: null },
  { say: 'seren', t: "You're insufferable when you're right." },
  { say: 'kael', t: 'Then I plan to be insufferable for a very long time.' },
  { say: 'seren', t: 'Balance it back before the audit. Promise me. Every night until the fever breaks, and then never again.' },
  { say: 'kael', t: 'Every night. Balanced by dawn. On my breath.' },
  { zoom: 3 }, { emote: 'seren', t: 'heart' }, { emote: 'kael', t: 'heart' },
  { narr: 'She pulled me down by the collar. For a moment, in the dark of Bay Three, with the banks breathing round us and the lamps far off, Cinderwell was warm for the right reasons.' },
  { fade: 'out' }, { music: null },
  { card: 'For three nights, we bled the line and balanced the bank by dawn.', sub: 'On the third night, the fever broke. Tavi asked for bread.', min: 1.8, max: 6 }
];

// ============================================================
// THE KEEP — the opening of Chapter One, as a film in the Assay's own engine (shot list, 3D valley).
// It follows the chapter's first page: dawn and banners, the boy, the woman in the chair, the cuts,
// the rise, the dive, the count. It cuts before the blade lands. No play; any key moves to the next shot.
// ============================================================
// ---- acting. A film actor can carry a performance, keyed over the shot (q = 0..1 of the shot's length):
//   path: [[q, x, y], ...]   footwork, eased between marks        zs: [[q, z], ...]   height off the ground
//   poses: [[q, {joints}, rate], ...]   a held pose from q on; the rig's springs do the blend
//   sts: [[q, 'atk'|'hurt'|'wind'|'guard', { dur, combo, kx, ky }], ...]   a cut, a reaction, a guard, lasting dur seconds
//   faceTo: id   keep facing another actor        rage: n   the breathing, coiled stance
const ACT = {
  low:     { cr: .5, lean: .02, tw: -.18, rp: .08, ry: .22, re: -.12, tilt: -.22, lp: .12, ly: -.15, le: -.25, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1, hx: 0 },
  lowTurn: { cr: .5, lean: .02, tw: -.05, rp: .08, ry: .22, re: -.12, tilt: -.22, lp: .12, ly: -.15, le: -.25, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1, hx: -.05, hy: .55 },
  ready:   { cr: 2.2, lean: .12, tw: -.35, rp: -1.1, ry: .5, re: -1.0, tilt: -1.5, lp: -.7, ly: -.4, le: -1.1, hl: .5, kl: .6, hr: -.4, kr: .5, sp: .16 },
  washer:  { cr: 1.4, lean: .1, tw: -.1, lp: -1.05, ly: -.95, le: -2.25, rp: .1, re: -.2, tilt: -.5, hx: .6 },
  washerUp:{ cr: 1.0, lean: .02, tw: -.1, lp: -1.05, ly: -.95, le: -2.25, rp: .1, re: -.2, tilt: -.5, hx: -.12 },
  slip:    { cr: 3.4, lean: .2, side: -.55, tw: .75, rp: -.5, ry: .2, re: -1.2, tilt: -1.0, lp: -.9, le: -1.1, hl: .9, kl: 1.0, hr: -.5, kr: .5, hx: .1, hy: -.5 },
  through: { cr: 6.2, lean: .85, tw: -.45, rp: .6, re: -.4, tilt: -.3, lp: -1.2, le: -1.2, hl: 1.2, kl: 1.5, hr: -.7, kr: .9, hx: -.25 },
  heave:   { cr: 3.6, lean: .5, tw: -.12, hx: .6, lp: -1.05, ly: -.95, le: -2.25, rp: .25, re: -.25, tilt: -.5, hl: .45, kl: .75, hr: -.4, kr: .6, sp: .2 },
  headUp:  { cr: 1.4, lean: .05, tw: -.1, hx: -.3, lp: -.2, ly: -.3, le: -.6, rp: -.2, re: -.5, tilt: -.9, hl: .3, kl: .4, hr: -.25, kr: .35, sp: .2 },
  coil:    { cr: 8.5, lean: .55, hl: 1.25, kl: 1.95, hr: 1.25, kr: 1.95, rp: .55, re: -.6, tilt: -.5, lp: .55, le: -.6, hx: .35, tw: 0, sq: .9 },
  rise:    { cr: 0, lean: -.18, rp: .75, re: -.2, tilt: -.4, lp: .65, le: -.3, hl: .15, kl: .25, hr: -.1, kr: .55, hx: -.4, sq: 1.14, tw: 0 },
  hover:   { cr: 0, lean: .06, tw: -.2, rp: -.6, ry: .5, re: -.3, tilt: -.6, lp: -.3, ly: -.6, le: -.4, hl: .2, kl: .5, hr: -.15, kr: .7, hx: .55 },
  hoverUp: { cr: 0, lean: -.1, tw: 0, rp: -2.9, ry: 0, re: -.25, tilt: -.18, lp: -2.6, ly: 0, le: -.4, hl: .3, kl: .7, hr: .1, kr: .9, hx: .6, sq: 1.06 },
  lookUp:  { cr: 1.2, lean: -.14, tw: -.1, hx: -.65, rp: -.5, ry: .3, re: -.9, tilt: -1.2, lp: -.3, le: -.6, hl: .2, kl: .25, hr: -.25, kr: .3 },
  backStep:{ cr: 2.0, lean: -.2, tw: -.2, hx: -.6, rp: -1.2, ry: .7, re: -1.1, tilt: -1.7, lp: -1.0, le: -1.2, hl: -.3, kl: .3, hr: .5, kr: .6 },
  brace:   { cr: 3.6, lean: -.1, tw: -.15, hx: -.45, rp: -2.2, ry: .9, re: -1.0, tilt: -1.9, lp: -2.0, ly: -.7, le: -1.0, hl: .55, kl: .85, hr: -.4, kr: .7, sp: .22 },
  beaten1: { cr: 3.2, lean: -.12, tw: -.2, hx: -.2, rp: -1.6, ry: .9, re: -1.2, tilt: -1.9, lp: -1.5, ly: -.6, le: -1.3, hl: .5, kl: .8, hr: -.4, kr: .7, sp: .2 },
  beaten2: { cr: 5.6, lean: -.22, tw: -.25, hx: -.1, rp: -1.9, ry: .9, re: -1.1, tilt: -1.9, lp: -1.8, ly: -.6, le: -1.2, hl: .8, kl: 1.2, hr: -.3, kr: 1.0, sp: .24 },
  beaten3: { cr: 8.2, lean: -.05, tw: -.3, hx: .1, rp: -2.1, ry: .9, re: -1.0, tilt: -1.9, lp: -2.0, ly: -.6, le: -1.1, hl: 1.3, kl: 1.6, hr: -.3, kr: 1.5, sp: .2 },
  kneelUp: { cr: 9, lean: .08, tw: 0, hl: 1.4, kl: 1.6, hr: -.3, kr: 1.5, rp: -1.0, ry: .8, re: -1.3, tilt: -1.7, lp: -1.5, ly: -.3, le: -1.0, hx: -.55, sp: .2 },
  overhead:{ cr: 1.4, lean: -.32, tw: 0, rp: -3.05, ry: 0, re: -.3, tilt: -.22, lp: -2.75, ly: 0, le: -.3, hl: .5, kl: .6, hr: -.3, kr: .4, hx: .4, sq: 1.08 }
};
const kq = (keys, q) => { let a = keys[0], b = keys[keys.length - 1]; if (q <= a[0]) return [a, a, 0]; if (q >= b[0]) return [b, b, 0]; for (let i = 0; i < keys.length - 1; i++) if (q >= keys[i][0] && q < keys[i + 1][0]) { const u = (q - keys[i][0]) / (keys[i + 1][0] - keys[i][0]); return [keys[i], keys[i + 1], u * u * (3 - 2 * u)]; } return [b, b, 0]; };
// the count's ticks fall where the game's own counter puts them: tick k of n at .92 * (k / n) ^ .8 of the shot
const tickQ = (k, n) => .92 * Math.pow(k / n, .8);
// ---- the Keep, cut to the voice. Every shot starts at a time in the narration (va, seconds into the read) and
// everything inside it is keyed in seconds from there (sec: 1), so each phrase has its own action.
Object.assign(ACT, {
  shoulder: { cr: .6, lean: -.04, tw: -.1, rp: -1.9, ry: .35, re: -2.2, tilt: .9, lp: .1, ly: -.2, le: -.3, hl: .15, kl: .1, hr: -.12, kr: .1, sp: .12, hx: -.12, hy: .2 },
  lookArm: { cr: .8, lean: .06, tw: .15, lp: -1.2, ly: .35, le: -1.5, rp: .1, ry: .2, re: -.15, tilt: -.3, hx: .5, hy: -.35, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1 },
  lookCloak: { cr: .8, lean: 0, tw: .5, lp: .2, ly: -.5, le: -.4, rp: .1, ry: .2, re: -.15, tilt: -.3, hx: .2, hy: .8, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1 },
  lowShift: { cr: .9, lean: .03, side: .18, tw: -.3, rp: .12, ry: .45, re: -.2, tilt: -.1, lp: .15, ly: -.2, le: -.3, hl: .2, kl: .15, hr: -.05, kr: .05, sp: .12, hx: .12, hy: -.25 },
  salute: { rp: -1.3, ry: .9, re: -1.2, tilt: -1.9, lp: -1.3, le: -1.3, ly: -.6, cr: 2.0, lean: -.04, tw: -.2, hl: .4, kl: .5, hr: -.3, kr: .4, sp: .16, hx: 0 },
  stand: { cr: .5, lean: .02, tw: 0, rp: .1, ry: .2, re: -.15, tilt: -.3, lp: .12, ly: -.15, le: -.25, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1, hx: .1 },
  ribs: { cr: 3.0, lean: .42, tw: -.1, hx: .55, lp: -.7, ly: -.8, le: -2.0, rp: .25, re: -.25, tilt: -.5, hl: .45, kl: .7, hr: -.4, kr: .55, sp: .2 },
  ribsLow: { cr: 6.0, lean: .7, tw: -.1, hx: .7, lp: -.7, ly: -.8, le: -2.0, rp: .4, re: -.3, tilt: -.4, hl: .8, kl: 1.3, hr: -.5, kr: 1.0, sp: .22 },
  taken: { cr: 2.4, lean: .3, tw: .2, hx: .5, rp: .2, re: -.4, tilt: -.5, lp: -.3, le: -.8, hl: .4, kl: .6, hr: -.3, kr: .5, sp: .2 },
  shove: { cr: 3.4, lean: .55, tw: .5, rp: -.4, ry: .3, re: -1.3, tilt: -1.2, lp: -1.3, ly: .2, le: -1.6, hl: .9, kl: 1.0, hr: -.6, kr: .7, hx: -.1 },
  spent: { cr: 4.6, lean: .5, tw: .1, hx: .55, rp: .5, re: -.3, tilt: -.2, lp: .2, le: -.5, hl: .7, kl: 1.0, hr: -.4, kr: .8, sp: .2 }
});
// a close-up cut into a shot for a while: on (x, y), from scale s0 to s1, at head height h
const CC = (t0, t1, x, y, s0, s1, dx, h) => [t0, [x + (dx || 0), y + 200 / s0, h || 54, 200, .32], [x, y + 200 / s1, h || 54, 200, .32], t1];
const VS = (va, ve, o) => Object.assign({ va, vd: ve - va, d: ve - va, sec: 1 }, o);
const L = (o) => Object.assign({ id: 'lucan', blade: 1, fx: -1, fy: .2 }, o), K = (o) => Object.assign({ id: 'kael2', blade: 1, fx: 1, fy: -.2 }, o);
// the count: blow n lands with Lucan at lx(n), Kael at kx(n); his guard is lower every time
const lx = (n) => 30 + 2.2 * n, kx = (n) => 2.2 * n, guardOf = (n) => n < 4 ? ACT.beaten1 : n < 8 ? ACT.beaten2 : ACT.beaten3;
const blow = (va, ve, n, word, camo) => VS(va, ve, Object.assign({ big: word, bigC: '#ff8a3c', tint: 'rgba(120,10,0,.16)', sfxs: [[.1, 'heart'], [.24, 'hit']], shakes: [[.24, .28]], fxs: [[.23, 'spark', (lx(n) + kx(n)) / 2 + 5, -4, '#ffe9a0', 12, 30], [.23, 'spark', (lx(n) + kx(n)) / 2 + 5, -4, '#ff8a3c', 6, 28], [.23, 'kick', .07], [.23, 'fn', () => { Brawl.impact = .14; }]].concat(n === 10 ? [[.23, 'ring', lx(n), -5, '#ffe08a', 60]] : []),
  acts: [L({ a: [lx(n - 1), -5], faceTo: 'kael2', path: [[0, lx(n - 1), -5], [.24, lx(n - 1), -5], [.5, lx(n), -5]], poses: [[0, guardOf(n), 16]].concat(n === 10 ? [[.45, ACT.kneelUp, 10]] : []), sts: [[.24, 'hurt', { dur: .2, kx: 70, ky: -8 }]] }),
         K({ a: [kx(n - 1), -3], aura: 4, faceTo: 'lucan', path: [[0, kx(n - 1), -3], [.3, kx(n), -3]], poses: [[0, ACT.ready, 16]], sts: [[.08, 'atk', { dur: .36, combo: 1 + (n % 3) }]] })] }, camo));
const side = (n, h) => ({ cam: [(lx(n) + kx(n)) / 2 - 26, 142, h || 54, 180, .33], to: [(lx(n) + kx(n)) / 2 + 6, 126, (h || 54) - 2, 192, .33] });
// the four blows nobody counts, under the whisper
const quiet4 = (va, ve, T) => VS(va, ve, { cam: [(lx(4) + kx(4)) / 2 - 10, 170, 66, 170, .33], to: [(lx(7) + kx(7)) / 2, 140, 56, 184, .33], lin: 1, tint: 'rgba(120,10,0,.16)', cams: [[.95, [lx(5) + 8, -5 + 200 / 1.9, 54, 200, .32], [lx(5), -5 + 200 / 2.4, 54, 200, .32], 1.95], [3.55, [kx(7) - 8, -3 + 200 / 1.9, 54, 200, .32], [kx(7), -3 + 200 / 2.6, 54, 200, .32], 4.2]],
  sfxs: T.flatMap(t => [[t, 'heart'], [t + .16, 'hit']]), shakes: T.map(t => [t + .16, .22]), fxs: T.flatMap((t, i) => [[t + .15, 'spark', (lx(4 + i) + kx(4 + i)) / 2 + 5, -4, '#ffe9a0', 12, 30], [t + .15, 'kick', .05]]),
  acts: [L({ a: [lx(3), -5], faceTo: 'kael2', path: [[0, lx(3), -5]].concat(T.flatMap((t, i) => [[t + .16, lx(3 + i), -5], [t + .45, lx(4 + i), -5]])).concat([[ve - va, lx(7), -5]]), poses: [[0, ACT.beaten1, 16], [T[0] + .2, ACT.beaten2, 6]], sts: T.map(t => [t + .16, 'hurt', { dur: .2, kx: 70, ky: -8 }]) }),
         K({ a: [kx(3), -3], aura: 4, faceTo: 'lucan', path: [[0, kx(3), -3]].concat(T.flatMap((t, i) => [[t, kx(3 + i), -3], [t + .3, kx(4 + i), -3]])).concat([[ve - va, kx(7), -3]]), poses: [[0, ACT.ready, 16]], sts: T.map((t, i) => [t, 'atk', { dur: .36, combo: 1 + (i % 2) }]) })],
  caps: [[.3, 'I KNOW HOW MANY THERE WILL BE.'], [2.3, 'THERE ARE ALWAYS ELEVEN.']], mems: [[2.35, 3.5, 'furnace', 1, '255,90,30']] });
// looking straight down: he comes up at the camera and the field shrinks under him
const DOWN_SHOT = { cam: [-52, 20, 190, 110, -6], to: [-52, 20, 340, 110, -6], lin: 1, speed: 1,
  acts: [L({ a: [22, -8], faceTo: 'kael2', poses: [[0, ACT.lookUp, 7]] }), K({ a: [-52, 12], aura: 3, notrail: 1, zs: [[0, 60], [1.85, 94]], zease: 'out', poses: [[0, ACT.rise, 20], [1.0, ACT.hover, 5]] })],
  caps: [[.1, 'THE GROUND DROPS OFF ME.']] };
const CH1_KEEP_SHOTS = [
  // "Dawn, and banners."
  VS(0, 2.35, { bg: 'keep', music: 'dawn', cel: 'front', cam: [-24, 250, 124, 170, .64], to: [-6, 236, 112, 170, .56], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6]] })], caps: [[0, 'DAWN, AND BANNERS.']] }),
  // "A keep of grey stone on the end of a ridge."  out wide: the keep on its rock, the road up to the gate, the valley under it
  VS(2.35, 4.2, { fog: [1400, 7000], cam: [150, 1320, 250, 162, .47], to: [90, 1040, 190, 164, .46], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6]] })], caps: [[.3, 'A KEEP OF GREY STONE ON THE END OF A RIDGE.']] }),
  // then up close: over the wall, onto the field, the boy small under the banners
  VS(4.2, 5.3, { fog: [700, 3000], cam: [30, 420, 96, 150, .34], to: [20, 300, 74, 150, .32], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6]] })], caps: [[0, 'A KEEP OF GREY STONE ON THE END OF A RIDGE.']] }),
  // "A boy stands under the banners with a blade held low."  he shifts his weight; the point of the blade draws a slow line on the stone
  VS(5.3, 8.95, { cam: [50, 46, 9, 230, .4], to: [44, 78, 52, 205, .34], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [1.3, ACT.lowShift, 2.5], [2.7, ACT.low, 2.5]] })], caps: [[.3, 'A BOY STANDS UNDER THE BANNERS WITH A BLADE HELD LOW.']] }),
  // "He is eighteen."
  VS(8.95, 10.5, { ...cu(40, -10, 2.2, 2.6, 10), zooms: [[.2, 1.4, .45]], cel: 'turn', acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [.3, ACT.lowTurn, 5]] })], caps: [[.3, 'HE IS EIGHTEEN.']] }),
  // "He has never been hit by anything he could not see coming."  one lazy practice cut, and the blade goes up on his shoulder
  VS(10.5, 14.0, { cam: [30, 140, 50, 184, .34], to: [36, 124, 48, 194, .35], lin: 1, cams: [CC(2.45, 3.51, 40, -10, 2.3, 2.9, 8)], sfxs: [[.7, 'swing']], acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [1.3, ACT.lowShift, 3], [2.6, ACT.low, 3]], sts: [[.55, 'atk', { dur: .5, combo: 1 }]] })], caps: [[.3, 'HE HAS NEVER BEEN HIT BY ANYTHING HE COULD NOT SEE COMING.']] }),
  // "On a white platform a woman sits in a chair with her hands folded,"
  VS(14.0, 18.1, { zooms: [[2.3, 4.0, .55]], cel: 'front', cam: [16, 116, 84, 200, .5], to: [2, 84, 88, 206, .52], lin: 1, acts: [], caps: [[.3, 'ON A WHITE PLATFORM A WOMAN SITS IN A CHAIR WITH HER HANDS FOLDED,']] }),
  // "and watches him."  close: her head comes round to her son
  VS(18.1, 19.5, { zooms: [[.3, 1.3, .3]], cels: [[0, 'front'], [.3, 'turn']], cam: [0, 46, 94, 250, .58], to: [0, 42, 94, 262, .58], lin: 1, acts: [], caps: [[.2, 'AND WATCHES HIM.']] }),
  // "The last day."  the whole field: him under the banners; I walk out onto the far end of it
  VS(19.5, 21.05, { cel: 'turn', cam: [-14, 262, 130, 150, .3], to: [-10, 244, 120, 152, .3], lin: 1, acts: [L({ a: [40, -10], poses: [[0, ACT.low, 6]] }), K({ a: [-78, 8], walk: 1, path: [[0, -78, 8], [1.55, -58, 8]], poses: [[0, ACT.stand, 6]] })], caps: [[.25, 'THE LAST DAY.']] }),
  // "Her son holds the keep."  the blade comes off his shoulder, turns once in his hand, and settles into a guard
  VS(21.05, 23.0, { cam: [52, 132, 40, 190, .4], to: [50, 116, 38, 198, .42], lin: 1, zooms: [[.9, 1.8, .3]], acts: [L({ a: [40, -10], poses: [[0, ACT.low, 6], [.4, ACT.salute, 5]] })], caps: [[.25, 'HER SON HOLDS THE KEEP.']] }),
  // "I am in their plate, with a white cloak over it that is not mine."  the last steps; he looks at his own arm, then back at the cloak
  VS(23.0, 27.4, { mems: [[.5, 1.75, 'gild', 1, '120,180,255']], sfxs: [[.5, 'cutin']], cel: 'front', cam: [-70, 132, 50, 186, .34], to: [-62, 112, 48, 198, .35], lin: 1, zooms: [[.2, 1.5, .28]], acts: [K({ a: [-58, 8], fx: .75, fy: .65, faces: [[0, .75, .65], [1.6, .5, -.85], [3.75, .9, .3]], aura: 1, poses: [[0, ACT.lookArm, 6], [1.7, ACT.lookCloak, 4], [3.7, ACT.stand, 4]] })], caps: [[.3, 'I AM IN THEIR PLATE,'], [1.8, 'WITH A WHITE CLOAK OVER IT THAT IS NOT MINE.']] }),
  // "Under it, on a cord, a brass washer."
  VS(27.4, 31.1, { ...cu(-58, 8, 2.2, 3.3, -8), mems: [[1.35, 3.4, 'hands', 0, '255,210,110']], sfxs: [[1.35, 'cutin']], acts: [K({ a: [-58, 8], fx: .35, fy: .95, aura: 1, poses: [[0, ACT.stand, 5], [.35, ACT.washerUp, 5], [2.3, ACT.washer, 4], [3.3, ACT.washerUp, 6]] })], caps: [[.3, 'UNDER IT, ON A CORD,'], [2.35, 'A BRASS WASHER.']] }),
  // "The first cut comes in out of the sun, and I am not there."
  VS(31.1, 34.25, { music: 'duel', cam: [-4, 184, 66, 162, .32], to: [-72, 144, 54, 184, .33], sfxs: [[1.65, 'swing']], shakes: [[1.75, .2]], fxs: [[1.75, 'spark', -52, 8, '#e8e4f0', 8, 4], [1.75, 'kick', .04]], cams: [[1.45, [-66, 36, 180, 116, -3], [-70, 36, 160, 120, -3], 2.35], CC(2.45, 3.16, -90, 8, 2.0, 2.6, -8)],
    acts: [L({ a: [40, -10], faceTo: 'kael2', path: [[0, 40, -10], [.15, 40, -10], [1.55, -30, 6], [2.0, -44, 6], [3.15, -44, 6]], poses: [[0, ACT.ready, 10], [2.0, ACT.through, 10], [2.5, ACT.lowTurn, 6]], sts: [[1.55, 'atk', { dur: .4, combo: 1 }]] }),
           K({ a: [-58, 8], aura: 1, path: [[0, -58, 8], [1.58, -58, 8], [1.95, -88, 8], [3.15, -90, 8]], faceTo: 'lucan', poses: [[0, ACT.washerUp, 6], [.8, ACT.ready, 7], [1.58, ACT.slip, 30], [2.2, ACT.stand, 6]], sts: [[1.58, 'dodge', { dur: .36 }]] })],
    caps: [[.25, 'THE FIRST CUT COMES IN OUT OF THE SUN,'], [2.0, 'AND I AM NOT THERE.']] }),
  // "The second comes, and I step through it."  the one place they touch: a shoulder, under a flash and a cut to above
  VS(34.25, 36.65, { cam: [-80, 140, 52, 182, .33], to: [-40, 124, 50, 194, .33], sfxs: [[1.15, 'swing2'], [1.52, 'hit']], shakes: [[1.52, .4]], fxs: [[1.5, 'spark', -54, 7, '#fff', 14, 28], [1.5, 'ring', -54, 7, '#fff2c0', 40], [1.5, 'kick', .08], [1.5, 'fn', () => { Brawl.impact = .2; }]], cams: [CC(0, .95, -44, 6, 1.9, 2.4, 8), [1.3, [-60, 64, 124, 136, -.9], [-40, 64, 116, 144, -.9], 2.05]],
    acts: [L({ a: [-44, 6], faceTo: 'kael2', path: [[0, -44, 6], [1.5, -44, 6], [1.95, -14, 3], [2.4, -14, 3]], poses: [[0, ACT.ready, 10], [.2, ACT.brace, 6], [1.9, ACT.backStep, 10]], sts: [[1.12, 'atk', { dur: .38, combo: 1 }], [1.52, 'hurt', { dur: .3, kx: 90, ky: -20 }]] }),
           K({ a: [-90, 8], aura: 2, faceTo: 'lucan', path: [[0, -90, 8], [1.05, -90, 8], [1.52, -63, 7], [1.75, -60, 7], [2.4, -50, 6]], poses: [[0, ACT.stand, 6], [.25, ACT.ready, 8], [1.05, ACT.through, 22], [1.44, ACT.shove, 26], [1.95, ACT.ready, 9]] })],
    caps: [[.2, 'THE SECOND COMES,'], [1.2, 'AND I STEP THROUGH IT.']] }),
  // "I hit,"  the camera swings with the blow
  VS(36.65, 37.5, { cam: [-58, 136, 50, 186, .33], to: [-18, 124, 48, 196, .33], sfxs: [[.3, 'hit']], shakes: [[.3, .35]], fxs: [[.28, 'spark', -22, 3, '#fff', 12, 30], [.28, 'kick', .07], [.28, 'fn', () => { Brawl.impact = .14; }]],
    acts: [L({ a: [-14, 3], faceTo: 'kael2', path: [[0, -14, 3], [.28, -14, 3], [.55, -6, 2], [.85, -6, 2]], poses: [[0, ACT.ready, 12], [.65, ACT.taken, 10]], sts: [[.28, 'hurt', { dur: .36, kx: 90, ky: -10 }]] }),
           K({ a: [-50, 6], aura: 2, faceTo: 'lucan', path: [[0, -50, 6], [.25, -44, 5], [.85, -44, 5]], poses: [[0, ACT.ready, 12]], sts: [[.12, 'atk', { dur: .4, combo: 2 }]] })],
    caps: [[.15, 'I HIT,']] }),
  // "and he takes it."  on him
  VS(37.5, 38.67, { zooms: [[0, .9, .35]], ...cu(-6, 2, 1.9, 2.3, 10), acts: [L({ a: [-6, 2], faceTo: 'kael2', poses: [[0, ACT.taken, 10], [.55, ACT.ready, 6]] }), K({ a: [-44, 5], aura: 2, faceTo: 'lucan', poses: [[0, ACT.ready, 12]] })], caps: [[.1, 'AND HE TAKES IT.']] }),
  // "He hits,"  and back the other way
  VS(38.67, 39.5, { cam: [0, 126, 44, 194, .35], to: [-44, 118, 43, 200, .35], sfxs: [[.3, 'hit']], shakes: [[.3, .35]], fxs: [[.29, 'spark', -40, 6, '#fff', 12, 30], [.29, 'kick', .07], [.29, 'fn', () => { Brawl.impact = .14; }]],
    acts: [L({ a: [-6, 2], faceTo: 'kael2', path: [[0, -6, 2], [.26, -13, 3], [.83, -13, 3]], poses: [[0, ACT.ready, 12]], sts: [[.1, 'atk', { dur: .4, combo: 1 }]] }),
           K({ a: [-44, 5], aura: 2, faceTo: 'lucan', path: [[0, -44, 5], [.28, -44, 5], [.6, -52, 12], [.83, -52, 12]], poses: [[0, ACT.ready, 12], [.66, ACT.taken, 10]], sts: [[.29, 'hurt', { dur: .36, kx: -90, ky: 10 }]] })],
    caps: [[.15, 'HE HITS,']] }),
  // "and I take it."  on me
  VS(39.5, 40.7, { zooms: [[0, 1.0, .35]], ...cu(-52, 12, 1.9, 2.3, -8), acts: [K({ a: [-52, 12], aura: 2, faceTo: 'lucan', poses: [[0, ACT.taken, 10], [.5, ACT.spent, 4]] }), L({ a: [-13, 3], faceTo: 'kael2', poses: [[0, ACT.ready, 10]] })], caps: [[.1, 'AND I TAKE IT.']] }),
  // "Under my ribs a pressure starts, low,"
  VS(40.7, 43.75, { ...cu(-52, 12, 1.9, 2.4, -12), zooms: [[2.3, 2.75, .4]], acts: [K({ a: [-52, 12], fx: .5, fy: .9, aura: 2, poses: [[0, ACT.spent, 6], [.3, ACT.ribs, 6], [2.35, ACT.ribsLow, 6]] })], caps: [[.2, 'UNDER MY RIBS A PRESSURE STARTS,'], [2.38, 'LOW,']] }),
  // "the way a seal starts to lift before anybody hears it."
  VS(43.75, 47.05, { cam: [-74, 152, 50, 176, .34], to: [-24, 128, 48, 190, .35], cams: [[2.55, [-58, 12 + 200 / 2.3, 54, 200, .32], [-52, 12 + 200 / 3.1, 54, 200, .32], 3.31]], sfx: 'fury', bolt: 1, tint: 'rgba(160,20,0,.14)', mems: [[.35, 1.3, 'furnace', 1, '255,90,30'], [1.75, 2.7, 'tin', 0, '255,210,110']], sfxs: [[.35, 'cutin'], [1.75, 'cutin']], shakes: [[1.1, .15], [2.2, .2]], fxs: [[1.1, 'ring', -52, 12, '#ff7a30', 30], [2.2, 'ring', -52, 12, '#ffb040', 50], [2.2, 'spark', -52, 12, '#ffb040', 8, 2]],
    acts: [L({ a: [-13, 3], faceTo: 'kael2', path: [[0, -13, 3], [1.3, -13, 3], [2.3, 0, -1], [3.3, 0, -1]], poses: [[0, ACT.ready, 10], [1.3, ACT.backStep, 9], [2.2, ACT.ready, 7]] }),
           K({ a: [-52, 12], fx: .8, fy: -.2, aura: 3, poses: [[0, ACT.ribsLow, 6], [.6, ACT.ribs, 3], [1.7, ACT.heave, 4], [2.5, ACT.headUp, 6]] })],
    caps: [[.15, 'THE WAY A SEAL STARTS TO LIFT BEFORE ANYBODY HEARS IT.']] }),
  // "I go up."
  VS(47.05, 48.25, { cam: [-40, 176, 56, 170, .34], to: [-40, 186, 84, 166, .42], speed: 1, cams: [CC(0, .42, -52, 12, 2.0, 2.6, -6, 40), [.78, [14, -3 + 200 / 2.2, 56, 200, .36], [8, -3 + 200 / 2.8, 58, 200, .38], 1.21]], sfxs: [[.42, 'dash'], [.42, 'roar']], shakes: [[.42, .4]], fxs: [[.42, 'ring', -52, 12, '#fff2c0', 90], [.44, 'ring', -52, 12, '#ff7a30', 56], [.42, 'spark', -52, 12, '#d8d4e4', 16, 0], [.42, 'kick', .08]],
    acts: [L({ a: [0, -1], faceTo: 'kael2', path: [[0, 0, -1], [.5, 0, -1], [1.1, 8, -3], [1.2, 8, -3]], poses: [[0, ACT.ready, 10], [.5, ACT.backStep, 12]] }),
           K({ a: [-52, 12], aura: 3, notrail: 1, zs: [[0, 0], [.42, 0], [1.2, 60]], zease: 'out', poses: [[0, ACT.coil, 20], [.42, ACT.rise, 30]] })],
    caps: [[.3, 'I GO UP.']] }),
  // "The ground drops off me."  from above: the keep turns into a square of roof
  VS(48.25, 50.1, DOWN_SHOT),
  // "The woman in the chair turns her head,"
  VS(50.1, 52.45, { cels: [[0, 'turn'], [.9, 'up']], cam: [0, 50, 94, 240, .58], to: [0, 42, 96, 262, .6], lin: 1, acts: [], caps: [[.25, 'THE WOMAN IN THE CHAIR TURNS HER HEAD,']] }),
  // "only her head, to follow."
  VS(52.45, 54.85, { cams: [[0, [-44, 12 + 96, 172, 200, .36], [-52, 12 + 74, 174, 200, .36], 1.15]], cel: 'up', cam: [-34, 198, 128, 158, .62], to: [-32, 186, 140, 162, .68], lin: 1,
    acts: [L({ a: [8, -3], faceTo: 'kael2', poses: [[0, ACT.lookUp, 8]] }), K({ a: [-52, 12], aura: 3, notrail: 1, glint: [1.45, .7], zs: [[0, 94], [1.2, 98], [2.4, 96]], poses: [[0, ACT.hover, 6], [.3, ACT.hoverUp, 6]] })],
    sfxs: [[1.5, 'steel']], fxs: [[1.5, 'fn', () => { Brawl.impact = .1; }]], caps: [[.2, 'ONLY HER HEAD,'], [1.45, 'TO FOLLOW.']] }),
  // "Then I come down on him."  from over my shoulder, looking down: he is very small, and he has seen it
  VS(54.85, 55.5, { cel: 'front', cam: [-52, 40, 200, 120, -2], to: [-50, 40, 190, 124, -2], lin: 1, sfxs: [[.3, 'roar']],
    acts: [L({ a: [8, -3], faceTo: 'kael2', poses: [[0, ACT.lookUp, 12], [.25, ACT.brace, 14]] }), K({ a: [-52, 12], aura: 4, notrail: 1, zs: [[0, 96]], poses: [[0, ACT.hoverUp, 14]] })],
    caps: [[.2, 'THEN I COME DOWN ON HIM.']] }),
  VS(55.5, 56.62, { cam: [-30, 182, 136, 166, .57], to: [-10, 152, 60, 180, .34], lin: 1, speed: 1, fxs: [.15, .35, .55, .75, .95].map(t => [t, 'spark', -52 + 28 * t / 1.12, 12 - 12 * t / 1.12, '#ffb040', 5, 96 - 94 * t / 1.12]),
    acts: [L({ a: [8, -3], faceTo: 'kael2', poses: [[0, ACT.brace, 20]] }),
           K({ a: [-52, 12], aura: 4, path: [[0, -52, 12], [1.12, -24, 0]], zs: [[0, 96], [1.12, 2]], poses: [[0, ACT.hoverUp, 14]], sts: [[0, 'plunge', { until: 1.12 }]] })],
    caps: [[0, 'THEN I COME DOWN ON HIM.']] }),
  // the landing
  VS(56.62, 57.0, { cam: [0, 150, 56, 178, .33], to: [6, 138, 52, 186, .33], flash: 1, shake: .8, sfx: 'hit', speed: 1, fxs: [[.02, 'ring', 4, -2, '#fff2c0', 110], [.04, 'ring', 4, -2, '#ff7a30', 70], [.02, 'spark', 2, -2, '#ffe9a0', 20, 26], [.02, 'spark', -6, 0, '#d8d4e4', 14, 0], [.02, 'kick', .12], [.2, 'spark', 10, -4, '#d8d4e4', 6, 0]],
    acts: [L({ a: [8, -3], faceTo: 'kael2', path: [[0, 8, -3], [.04, 8, -3], [.36, 30, -5]], poses: [[0, ACT.brace, 20]], sts: [[.03, 'hurt', { dur: .4, kx: 120, ky: -10 }]] }),
           K({ a: [-24, 0], aura: 4, faceTo: 'lucan', path: [[0, -24, 0], [.1, -24, 0], [.38, 0, -3]], poses: [[0, ACT.ready, 16]], sts: [[0, 'atk', { dur: .3, combo: 3, t0: .12 }]] })] }),
  // "One. Two. Three."
  blow(57.0, 57.74, 1, 'ONE', side(1)),
  blow(57.74, 58.47, 2, 'TWO', cu(lx(2), -5, 1.5, 1.8, 8)),
  blow(58.47, 59.3, 3, 'THREE', cu(kx(3), -3, 1.5, 1.8, -8)),
  // "I know how many there will be. There are always eleven."
  quiet4(59.3, 63.5, [.45, 1.4, 2.35, 3.3]),
  // "Eight. Nine. Ten."
  blow(63.5, 64.2, 8, 'EIGHT', cu(lx(8), -5, 1.5, 1.8, 8)),
  blow(64.2, 65.0, 9, 'NINE', cu(kx(9), -3, 1.5, 1.8, -8)),
  blow(65.0, 66.0, 10, 'TEN', Object.assign(side(10, 50), { bigC: '#fff6dc', zooms: [[.24, .6, .3]], cams: [CC(.55, 1.01, lx(10), -5, 1.8, 2.3, 6, 40)] })),
  // "The blade comes down."
  VS(66.0, 67.75, { zooms: [[.9, 1.7, .3]], cam: [28, 136, 64, 178, .4], to: [40, 106, 58, 198, .42], cams: [[0, [58, -5 + 200 / 2.3, 44, 200, .36], [52, -5 + 200 / 2.9, 42, 200, .38], .82], CC(1.25, 1.76, 22, -3, 2.1, 2.7, -6, 80)], bolt: 2, sfx: 'cutin', tint: 'rgba(160,20,0,.2)',
    acts: [L({ a: [52, -5], faceTo: 'kael2', poses: [[0, ACT.kneelUp, 9]] }),
           K({ a: [22, -3], aura: 4, glint: [.95, .6], faceTo: 'lucan', poses: [[0, ACT.ready, 16], [.3, ACT.overhead, 6]] })],
    caps: [[.3, 'THE BLADE COMES DOWN.']] }),
  // her, as it falls: she has not moved
  VS(67.75, 68.5, { zooms: [[0, .7, .35]], cel: 'turn', cam: [0, 44, 94, 256, .58], to: [0, 40, 94, 268, .58], lin: 1, acts: [], sfxs: [[.5, 'swing']], caps: [[0, 'THE BLADE COMES DOWN.']] }),
  // black. the hit; the music goes; two heartbeats; then nothing, before the card
  { d: 3.6, vd: 3.6, black: 1, flash: 1, sfx: 'hit', shake: .6, fxs: [[.05, 'fn', () => Sound.music(null)], [1.1, 'fn', () => Sound.play('heart')], [2.3, 'fn', () => Sound.play('heart')]] }
];
const MEM_AT = 40.7, MEM = 14.01, FORD = { bg: 'ford', tint: 'rgba(30,40,90,.3)', memo: '150,190,255' };
for (const sh of CH1_KEEP_SHOTS) if (sh.va !== undefined && sh.va >= MEM_AT - .01) sh.va += MEM;
{ const i = CH1_KEEP_SHOTS.findIndex(sh => sh.va !== undefined && sh.va >= MEM_AT + MEM - .01), M = (a, b, o) => VS(MEM_AT + a, MEM_AT + b, Object.assign({}, FORD, o));
  const lu = (o) => Object.assign({ id: 'lucan', a: [30, -14], fx: -1, fy: .5, blade: 0, poses: [[0, ACT.stand, 5]] }, o), open = Object.assign({}, ACT.stand, { lp: -.35, ly: .5, le: -.5, rp: -.35, ry: -.5, re: -.5, hx: -.05 }), ask = Object.assign({}, ACT.stand, { hx: -.08, hy: .35, lp: -.5, le: -.9, ly: .2 });
  CH1_KEEP_SHOTS.splice(i, 0,
    // the night before: the ford, the truce he asked for. Kael tells it; Lucan's words are from the game's truce scene.
    M(0, 2.4, { flash: 1, sfx: 'heart', cam: [-30, 214, 96, 158, .3], to: [10, 166, 66, 174, .33],
      acts: [lu({}), K({ a: [-44, 26], fy: -.6, walk: 1, path: [[0, -48, 28], [2.4, -36, 22]], poses: [[0, ACT.low, 5]] })], caps: [[.35, 'HE IS STANDING ON THE FAR BANK,']] }),
    M(2.4, 3.5, { ...cu(30, -14, 2.2, 2.6, 8), zooms: [[0, 1.0, .3]], acts: [lu({})], caps: [[.12, 'ALONE,']] }),
    // his hands: nothing in them
    M(3.5, 6.25, { cam: [40, 96, 30, 214, .4], to: [32, 86, 40, 220, .38], lin: 1, acts: [lu({ poses: [[0, ACT.stand, 5], [.3, open, 3.5], [2.0, ACT.stand, 3]] })], caps: [[.12, 'WITH HIS BLADE LEFT ON THE STONES BEHIND HIM.']] }),
    // he asks it: on him, then the two of us and the water between
    M(6.25, 10.85, { ...cu(30, -14, 2.0, 2.5, 10), sfxs: [[1.3, 'heart']], cams: [[2.9, [-22, 176, 70, 168, .32], [14, 150, 60, 178, .33], 4.6]],
      acts: [lu({ poses: [[0, ACT.stand, 5], [1.2, ask, 3]] }), K({ a: [-32, 20], fy: -.6, poses: [[0, ACT.low, 5]] })], caps: [[.2, 'HE SAID:'], [1.3, 'YOU FIGHT AS IF YOU HATE THE GROUND YOU ARE STANDING ON.']] }),
    // on me: I have no answer I can give him; I look at the water
    M(10.85, MEM, { ...cu(-32, 20, 2.1, 2.6, -8), zooms: [[1.3, 3.0, .4]], sfxs: [[1.4, 'heart']], acts: [K({ a: [-32, 20], fx: .7, fy: .7, poses: [[0, ACT.stand, 5], [1.5, Object.assign({}, ACT.stand, { hx: .5, hy: -.3 }), 2.5]] })], caps: [[.2, 'HE SAID:'], [1.42, 'WHERE DOES ONE LEARN IT.']] }));
  CH1_KEEP_SHOTS[i + 5].flash = 1; }
// ---- the voice. The read is the clock: while it plays, the film's time is the audio's time, so picture and voice cannot drift.
const VO = { a: null, on: false, off: false,
  start(src) { if (this.off) return; src = src || CH1_VO_SRC; try { if (!this.a || this.src !== src) { this.a = new Audio(src); this.a.preload = 'auto'; this.src = src; } this.a.currentTime = 0; this.a.volume = 1; this.vt = 0; this.last = -1; this.still = 0; const p = this.a.play(); if (p && p.catch) p.catch(() => { }); this.on = true; if (Sound.mus) Sound.mus.gain.value = (Settings.d.music / 10) * .5; } catch (e) { } },
  stop() { SUB.hide(); if (!this.on) return; this.on = false; try { this.a.pause(); } catch (e) { } Sound.setVol(); },
  live() { return this.on && this.a && !this.a.paused && !this.a.ended && this.a.currentTime > 0; } };
{ const n1 = Brawl.nextShot; Brawl.nextShot = function () { n1.call(this); const c = this.cine, s = c && c.shots[c.i]; if (s && s.vd) c.dur = s.vd; if (c) c._fx = 0; };
  const u0 = Brawl.updCine; Brawl.updCine = function (dt) { const c = this.cine, s = c.shots[c.i], i0 = c.i;
    if (s.va === 0 && !VO.on && c.t === 0) VO.start(this.def && this.def.voSrc);
    if (s.va !== undefined && VO.on) { VO.vt += dt; const a = VO.a; if (a && !a.paused && !a.ended) { const ct = a.currentTime; if (ct !== VO.last) { VO.last = ct; if (VO.still > .6 && VO.vt - ct > .35) { try { a.currentTime = VO.vt; } catch (e) { } } else VO.vt = ct; VO.still = 0; } else VO.still = (VO.still || 0) + dt; } c.t = Math.max(0, VO.vt - s.va - dt); }
    const tA = c.t; u0.call(this, dt);
    if (!this.cine) return VO.stop();
    const c2 = this.cine; if (c2.i === i0) { const tB = c2.t; if (s.sfxs) for (const e of s.sfxs) if (e[0] > tA && e[0] <= tB || (tA === 0 && e[0] === 0)) Sound.play(e[1]); if (s.shakes) for (const e of s.shakes) if (e[0] > tA && e[0] <= tB) this.shake = e[1]; if (s.fxs) for (const e of s.fxs) if (e[0] > tA && e[0] <= tB) { const a = e.slice(2); if (e[1] === 'spark') this.spark(...a); else if (e[1] === 'ring') this.ring(...a); else if (e[1] === 'kick') c2._kick = a[0]; else if (e[1] === 'fn') a[0](); } }
    else { const s2 = c2.shots[c2.i]; if (s2 && s2.va !== undefined && VO.on && Math.abs(VO.vt - s2.va) > .2) { VO.vt = s2.va; try { VO.a.currentTime = s2.va; } catch (e) { } } }
    if (c2.shots[c2.i] && c2.shots[c2.i].va !== undefined) { const w = VO.vt || 0; this.cam.x += Math.sin(w * .7) * .9 + Math.sin(w * 1.9) * .25; this.cam.h += Math.sin(w * .93 + 1) * .6; this.cam.y += Math.sin(w * .41 + 2) * 1.2; }
    { const s3 = c2.shots[c2.i]; if (s3 && s3.cams) for (const e of s3.cams) if (c2.t >= e[0] && c2.t < e[3]) { const u = (c2.t - e[0]) / (e[3] - e[0]), A = e[1], B = e[2], cm = this.cam; cm.x = A[0] + (B[0] - A[0]) * u; cm.y = A[1] + (B[1] - A[1]) * u; cm.h = A[2] + (B[2] - A[2]) * u; cm.f = A[3] + (B[3] - A[3]) * u; cm.hor = Math.round(H * (A[4] + (B[4] - A[4]) * u)); } }
    { const s3 = c2.shots[c2.i]; if (s3 && s3.zooms) for (const e of s3.zooms) if (c2.t >= e[0]) { const u = Math.min(1, (c2.t - e[0]) / (e[1] - e[0])); this.cam.f *= 1 + e[2] * u * u * (3 - 2 * u); } }
    if (c2._kick > .002) { this.cam.f *= 1 + c2._kick; c2._kick *= Math.pow(.0008, dt); } };
  const e0 = Brawl.end; Brawl.end = function () { VO.stop(); return e0.apply(this, arguments); }; }
const CH1_KEEP_FILM = () => ({ bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'dawn', cineOnly: 1, film: 1, hero: { id: 'kael2', cape: CLOAK }, intro: CH1_KEEP_SHOTS, foes: [] });
const CH1_KEEP = [
  { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } },
  { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. The last day.', big: 1, min: 1.5, max: 4.5 },
  { brawl: () => CH1_KEEP_FILM() },
  { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { music: null },
  { card: 'BEFORE THE FURNACE', sub: 'Cinderwell. Six tiers under the rock. Before any of it.', big: 1, tr: 'furnace', min: 1.6, max: 5 }
];
// ============================================================
// THE KEEP AND ITS SURROUNDINGS. The game's set is a white platform above cloud. This adds what the book describes and a far
// shot needs: a keep of grey stone behind the field with gold and white banners down its face, front towers and a gate,
// the rock of the ridge under it running back to the mountains, and the valley below with its river.
// (x right, y up, z toward the camera; the field is y = 0, x -256..256, z -192..256.)
const KEEPSET = (A, S) => {
  const I = M4.id(), G1 = '#b6b2a9', G2 = '#a5a198', G3c = '#c8c4ba', DK = '#2a2438', LIT = '#ffd98a', GOLD = '#e8c25a', WHT = '#f4f0e6', SLATE = '#4c4860', WALLC = '#d2cbbd', ROCK = [.92, .86, .78], ROCK2 = [.82, .76, .69], ROCK3 = [1, .95, .88], GR = [.45, .62, .36];
  let sd = 9173; const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296, R = (a, b) => a + rnd() * (b - a), pick = (L) => L[Math.floor(rnd() * L.length)];
  const banner = (x, y, z, h, c, alongZ) => { const o = c === GOLD ? WHT : GOLD; if (alongZ) { S.box(I, x, y, z, .9, h, 18, c); S.box(I, x, y - h / 2 - 5, z - 4.5, .9, 12, 9, c); S.box(I, x, y - h / 2 - 3, z + 4.5, .9, 8, 9, c); A.box(I, x + .6, y + h * .15, z, .4, 7, 7, o, 1); A.box(I, x + .2, y + h / 2 + 1, z, 1.2, 2, 22, '#8a8478', 1); } else { S.box(I, x, y, z, 18, h, .9, c); S.box(I, x - 4.5, y - h / 2 - 5, z, 9, 12, .9, c); S.box(I, x + 4.5, y - h / 2 - 3, z, 9, 8, .9, c); A.box(I, x, y + h * .15, z + .6, 7, 7, .4, o, 1); A.box(I, x, y + h / 2 + 1, z + .2, 22, 2, 1.2, '#8a8478', 1); } };
  // ---- THE KEEP stands along the left side of the field, so the dais and the fight keep the open sky behind them.
  const KX = -380;
  // the great hall: long, pitched slate roof, buttressed, two rows of windows facing the field
  S.box(I, KX, 75, -70, 150, 150, 300, G1);
  S.box(M4.chain(M4.t(KX, 150, -70), M4.rz(.785)), 0, 0, 0, 104, 104, 296, SLATE);
  for (const k of [38, 76, 114]) S.box(I, -304.4, k, -70, 1.6, 3, 302, G3c);
  for (let i = 0; i < 6; i++) { S.box(I, -301, 60, -205 + i * 54, 9, 120, 10, G2); S.box(I, -300, 124, -205 + i * 54, 12, 8, 13, G3c); }
  for (let i = 0; i < 15; i++) S.box(I, -308, 157, -213 + i * 21, 8, 13, 11, G3c);
  for (let k = 0; k < 2; k++) for (let i = 0; i < 5; i++) { const z = -178 + i * 54; A.box(I, -304.3, 54 + k * 46, z, 1, 22, 8, (i + k * 2) % 3 === 1 ? LIT : DK, 1); A.box(I, -303.9, 41.5 + k * 46, z, 1.6, 2.5, 11, G3c, 1); A.box(I, -303.9, 66.5 + k * 46, z, 1.6, 2.5, 11, G3c, 1); }
  for (const [z, c] of [[-151, GOLD], [-97, WHT], [11, WHT], [65, GOLD]]) banner(-303.4, 100, z, 56, c, 1);
  // its gable end, toward us: a tall window and two banners
  A.box(I, KX, 74, 80.6, 28, 64, 1, DK, 1); for (const dx of [-7, 0, 7]) A.box(I, KX + dx, 74, 81, 1.2, 64, 1, G3c, 1); A.box(I, KX, 108, 81, 32, 3, 1.4, G3c, 1); A.box(I, KX, 86, 81, 28, 1.4, 1, G3c, 1);
  banner(KX - 48, 100, 80.8, 64, GOLD); banner(KX + 48, 100, 80.8, 64, WHT);
  for (const k of [38, 76, 114]) S.box(I, KX, k, 80.4, 152, 3, 1.6, G3c);
  // the great tower, at the back: string courses, a crown of merlons, four turrets, a slate spire, a balcony over the field
  const TX = -380, TZ = -250;
  S.box(I, TX, 175, TZ, 116, 350, 116, G2);
  for (let k = 60; k <= 310; k += 50) S.box(I, TX, k, TZ, 119, 3, 119, G3c);
  S.box(I, TX, 354, TZ, 132, 10, 132, G3c);
  for (let q = -2; q <= 2; q++) { S.box(I, TX + q * 27, 366, TZ + 62, 12, 14, 9, G3c); S.box(I, TX + q * 27, 366, TZ - 62, 12, 14, 9, G3c); S.box(I, TX + 62, 366, TZ + q * 27, 9, 14, 12, G3c); S.box(I, TX - 62, 366, TZ + q * 27, 9, 14, 12, G3c); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { S.cyl(I, TX + sx * 60, 296, TZ + sz * 60, 13, 13, 78, 6, G1, 0, 1); S.cyl(I, TX + sx * 60, 374, TZ + sz * 60, 18, 0, 38, 6, SLATE); A.box(I, TX + sx * 60 + (sx > 0 ? 13.4 : -13.4), 340, TZ + sz * 60, 1, 12, 5, DK, 1); }
  S.cyl(M4.chain(M4.t(TX, 359, TZ), M4.ry(.785)), 0, 0, 0, 72, 0, 104, 4, SLATE); S.cyl(I, TX, 463, TZ, 1.1, 1.1, 40, 4, '#8a8478'); S.box(I, TX + 14, 494, TZ, 28, 15, .9, GOLD); A.box(I, TX + 14, 494, TZ + .6, 8, 8, .4, WHT, 1);
  for (let k = 0; k < 5; k++) { A.box(I, TX, 88 + k * 52, TZ + 58.6, 9, 22, 1, k === 2 || k === 4 ? LIT : DK, 1); A.box(I, TX + 58.6, 88 + k * 52, TZ, 1, 22, 9, k === 1 ? LIT : DK, 1); A.box(I, TX + 58.6, 88 + k * 52, TZ - 34, 1, 14, 5, DK, 1); A.box(I, TX + 58.6, 88 + k * 52, TZ + 34, 1, 14, 5, DK, 1); }
  banner(TX - 34, 250, TZ + 59, 128, WHT); banner(TX + 34, 250, TZ + 59, 128, GOLD); banner(TX + 59, 250, TZ - 0, 128, GOLD, 1);
  S.box(I, TX + 68, 150, TZ, 20, 3, 56, G3c); A.box(I, TX + 77.4, 157, TZ, 1, 1.6, 56, GOLD, 1); for (const dz of [-26, -13, 0, 13, 26]) S.box(I, TX + 77, 154, TZ + dz, 1.6, 8, 1.6, G3c); S.box(I, TX + 64, 142, TZ - 20, 12, 14, 5, G2); S.box(I, TX + 64, 142, TZ + 20, 12, 14, 5, G2);
  // a round tower on the near end of the hall
  S.cyl(I, KX, 0, 118, 46, 40, 238, 10, G1, 0, 1); S.cyl(I, KX, 80, 118, 43.5, 43.5, 3, 10, G3c, 0, 1); S.cyl(I, KX, 160, 118, 41.5, 41.5, 3, 10, G3c, 0, 1); S.cyl(I, KX, 238, 118, 52, 52, 6, 10, G3c, 0, 1);
  for (let q = 0; q < 10; q++) { const a = q / 10 * 6.2832; S.box(M4.chain(M4.t(KX + Math.cos(a) * 48, 250, 118 + Math.sin(a) * 48), M4.ry(-a)), 0, 0, 0, 9, 12, 13, G3c); }
  S.cyl(I, KX, 244, 118, 42, 0, 78, 10, '#7a5ac8'); S.cyl(I, KX, 322, 118, 1, 1, 30, 4, '#8a8478'); S.box(I, KX + 11, 344, 118, 22, 12, .9, '#7a5ac8');
  for (let k = 0; k < 3; k++) { A.box(I, KX, 60 + k * 60, 118 + 43.4, 7, 18, 1, k === 1 ? LIT : DK, 1); A.box(I, KX + 42.6, 60 + k * 60, 118, 1, 18, 7, DK, 1); }
  // a covered bridge from the hall onto the wall of the field
  S.box(I, -283, 46, -43, 44, 22, 24, G1); S.box(M4.chain(M4.t(-283, 57, -43), M4.rx(.785)), 0, 0, 0, 46, 19, 19, SLATE); S.box(I, -283, 17, -43, 10, 36, 18, G2); for (const dx of [-12, 0, 12]) A.box(I, -283 + dx, 47, -30.8, 6, 10, .6, DK, 1);
  // ---- the front of the field: a tower on each corner, a low parapet
  for (const sx of [-1, 1]) { const m = M4.t(sx * 256, 0, 256); S.cyl(m, 0, -80, 0, 26, 22, 190, 8, '#ece6d8', 0, 1); S.cyl(m, 0, 110, 0, 30, 0, 52, 8, sx < 0 ? '#2aa6a0' : '#7a5ac8'); S.cyl(m, 0, 62, 0, 23.4, 23.4, 3, 8, GOLD, 1); S.cyl(m, 0, 162, 0, .9, .9, 24, 4, '#8a8478'); S.box(m, 9, 180, 0, 18, 10, .8, sx < 0 ? '#2aa6a0' : '#7a5ac8'); A.box(m, 0, 40, 23, 5, 14, 1, DK, 1); A.box(m, 0, 84, 23.6, 5, 14, 1, DK, 1);
    S.box(I, sx * 150, 4, 258, 200, 8, 6, WALLC); A.box(I, sx * 150, 8.3, 258, 200, .8, 6.4, GOLD, 1); S.box(I, sx * 44, 9, 258, 10, 18, 10, '#e6e0d2'); A.box(I, sx * 44, 18.6, 258, 12, 1.4, 12, GOLD, 1); }
  // ---- under the field: a wall of dressed stone with buttresses and the gate in it, and the road up to that gate
  S.box(I, 0, -42, 259, 524, 84, 8, WALLC);
  for (const k of [-14, -36, -58]) A.box(I, 0, k, 263.2, 524, 1.6, .6, '#b3ab9b', 1);
  for (let q = -4; q <= 4; q++) if (q) { S.box(I, q * 58, -44, 265, 15, 88, 12, '#c6beb0'); S.box(I, q * 58, 2, 265, 19, 6, 15, '#dbd4c6'); }
  A.box(I, 0, -52, 263.7, 40, 60, 1, DK, 1); A.box(I, 0, -20, 264, 46, 5, 1.4, GOLD, 1); for (const dx of [-12, -4, 4, 12]) A.box(I, dx, -54, 264.1, 1.2, 56, .6, '#6a6470', 1); for (const sx of [-1, 1]) { S.box(I, sx * 26, -46, 266, 9, 76, 12, '#dbd4c6'); A.box(I, sx * 26, -4, 272.4, 7, 7, .6, GOLD, 1); }
  for (let k = 0; k < 20; k++) { const y = -84 - k * 13, z = 280 + k * 24; S.box(I, 0, y, z, 64, 7, 24, k % 2 ? '#ddd6c8' : '#cfc8ba'); for (const sx of [-1, 1]) { S.box(I, sx * 34, y + 8, z, 5, 14, 24, '#c2baac'); if (k % 3 === 0) { S.box(I, sx * 34, y + 28, z, 3, 26, 3, G2); A.box(I, sx * 34, y + 42, z, 5, 3, 5, GOLD, 1); S.box(I, sx * 34 + sx * 6, y + 34, z, 10, 12, .8, (k / 3 + (sx > 0 ? 1 : 0)) % 2 ? GOLD : WHT); } } }
  A.cyl(M4.chain(M4.t(0, 0, 520), M4.ry(.4)), 0, -640, 0, 300, 70, 420, 7, ROCK2, 0, 1); A.cyl(M4.chain(M4.t(40, 0, 700), M4.ry(1.4)), 0, -640, 0, 260, 60, 300, 7, ROCK, 0, 1);
  // ---- the ridge: pale rock under all of it, broken into outcrops, grass on the ledges; the spine of it runs back to the mountains
  A.box(I, 0, -384, 30, 500, 600, 430, ROCK2); A.box(I, KX, -330, -70, 200, 660, 420, ROCK2);
  for (let q = 0; q < 34; q++) { const a = q / 34 * 6.2832 + R(-.06, .06), px = Math.cos(a) * R(262, 300) * (Math.cos(a) < -.2 ? 1.5 : 1), pz = 30 + Math.sin(a) * R(232, 268), m = M4.chain(M4.t(px, 0, pz), M4.ry(R(0, 6))), top = R(-128, -88), r0 = R(120, 200); A.cyl(m, 0, -640, 0, r0, R(44, 86), 640 + top, 6, pick([ROCK, ROCK2, ROCK3]), 0, 1); if (q % 2) A.cyl(m, R(-20, 20), top - 2, R(-20, 20), R(30, 50), 0, R(14, 26), 6, GR); if (q % 3 === 0) A.cyl(M4.chain(M4.t(px * 1.25, 0, pz * 1.2), M4.ry(R(0, 6))), 0, -640, 0, R(100, 170), R(20, 50), R(260, 440), 6, pick([ROCK, ROCK2]), 0, 1); }
  for (let k = 0; k < 8; k++) { const z = -360 - k * 130, x = -120 + Math.sin(k * 1.3) * 80, top = -20 - k * 30, rad = 340 - k * 16, m = M4.chain(M4.t(x, 0, z), M4.ry(k)); A.cyl(m, 0, -640, 0, rad + 220, rad * .5, 640 + top, 7, k % 2 ? ROCK : ROCK2, 0, 1); A.cyl(m, 0, top - 1, 0, rad * .5, rad * .2, 24, 7, GR, 0, 1); }
  // ---- the valley: grass, the river, woods, and the twelve camps
  A.quad(-6000, -6000, 6000, 3200, -640, [.5, .72, .44]);
  for (let q = 0; q < 60; q++) { const x = R(-2600, 2600), z = R(-2400, 1400), w = R(120, 320); A.quad(x, z, x + w, z + w * R(.5, 1.2), -636, pick([[.56, .78, .46], [.44, .66, .4], [.62, .76, .42]])); }
  for (let q = 0; q < 46; q++) { const z = -2600 + q * 80, x = 760 + Math.sin(q * .33) * 150 + Math.sin(q * .11) * 200 - Math.max(0, q - 34) * 70; A.quad(x - 56, z, x + 56, z + 84, -628, [.5, .74, 1], 1); A.quad(x - 68, z, x - 56, z + 84, -630, [.8, .78, .6], 1); A.quad(x + 56, z, x + 68, z + 84, -630, [.8, .78, .6], 1); }
  for (let q = 0; q < 30; q++) { const x = 40 - q * 110, z = 1060 + Math.sin(q * .4) * 60; A.quad(x - 110, z - 50, x + 4, z + 50, -628, [.5, .74, 1], 1); }
  for (let q = 0; q < 320; q++) { const a = R(0, 6.2832), d = R(820, 3000), x = Math.cos(a) * d, z = Math.sin(a) * d * .8 + 300, sz = R(.8, 1.8); A.cyl(M4.t(x, -640, z), 0, 0, 0, 22 * sz, 0, 62 * sz, 5, [.2 + rnd() * .06, .44 + rnd() * .1, .24]); }
  for (let q = 0; q < 26; q++) { const a = R(0, 6.2832), d = R(900, 2600); A.cyl(M4.chain(M4.t(Math.cos(a) * d, -640, Math.sin(a) * d * .8 + 300), M4.ry(R(0, 6))), 0, 0, 0, R(60, 140), R(10, 40), R(40, 110), 6, ROCK2, 0, 1); }
  for (let q = 0; q < 16; q++) { const a = Math.PI + (q + .5) / 16 * Math.PI, d = R(1000, 1350); A.cyl(M4.chain(M4.t(Math.cos(a) * d, -640, Math.sin(a) * d), M4.ry(R(0, 6))), 0, 0, 0, R(560, 760), R(160, 260), 640, 7, [.56, .74, .5], 0, 1); }
  for (let q = 0; q < 9; q++) { const a = Math.PI + (q + .5) / 9 * Math.PI, d = R(1500, 1900); A.cyl(M4.chain(M4.t(Math.cos(a) * d, -640, Math.sin(a) * d), M4.ry(R(0, 6))), 0, 0, 0, R(500, 700), 0, R(900, 1250), 6, [.52, .55, .76]); }
  for (let q = 0; q < 9; q++) { const a = Math.PI + R(0, 3.1416), d = R(1500, 2800), x = Math.cos(a) * d, z = Math.sin(a) * d * .8 + 200, sc = R(1.6, 3.6); for (let t = 0; t < 3; t++) A.box(I, x + (t - 1) * 30 * sc, R(-600, -520), z + t * 8, 50 * sc, 9 * sc, 30 * sc, [1, .95, .92], 1); }
  { const HC = ['#7a5ac8', '#2aa6a0', '#c8452e', '#e8c25a', '#3a6ac8', '#58b848', '#c85a9a', '#e88a3a', '#8a8a92', '#40c8e8', '#a03a3a', '#f4f0e6']; for (let q = 0; q < 12; q++) { const x = 420 + (q % 4) * 170 + R(-30, 30), z = -200 + Math.floor(q / 4) * 260 + R(-40, 40); for (let t = 0; t < 4; t++) A.cyl(M4.t(x + (t % 2) * 46 - 23, -640, z + (t > 1 ? 40 : 0)), 0, 0, 0, 20, 0, 26, 6, WHT); A.cyl(M4.t(x, -640, z + 20), 0, 0, 0, 1.6, 1.6, 70, 4, '#8a8478'); A.box(I, x + 16, -578, z + 20, 32, 20, 1, HC[q], 1); } } };
{ const env0 = G3.env; G3.env = function (bg) { if (bg !== 'keep' || this.envs[bg] || !this.gl) return env0.call(this, bg);
    const XA = new Batch(30000), XS = new Batch(30000); try { KEEPSET(XA, XS); } catch (e) { return env0.call(this, bg); }
    const gl = this.gl, bd = gl.bufferData; let n = 0, cut0 = 0;
    gl.bufferData = function (t, data, u) { if (u === gl.STATIC_DRAW && data instanceof Float32Array && n < 2) { const first = !n, X = n++ ? XS : XA; let src = data; if (first) { const keep = new Float32Array(data.length); let w = 0; for (let i = 0; i + 27 <= data.length; i += 27) { let cloud = true; for (let v = 0; v < 3 && cloud; v++) { const o = i + v * 9; if (!(data[o + 1] < 90 && data[o + 1] > -300 && data[o + 3] === 0 && data[o + 4] === 0 && data[o + 5] === 0 && data[o + 6] > .98 && data[o + 8] > .8 && data[o + 8] < .94 && Math.hypot(data[o], data[o + 2]) > 300)) cloud = false; } if (!cloud) { keep.set(data.subarray(i, i + 27), w); w += 27; } } cut0 = (data.length - w) / 9; src = keep.subarray(0, w); } const out = new Float32Array(src.length + X.n * 9); out.set(src); out.set(X.a.subarray(0, X.n * 9), src.length); return bd.call(gl, t, out, u); } return bd.apply(gl, arguments); };
    let E; try { E = env0.call(this, bg); } finally { delete gl.bufferData; }
    if (n === 2 && E) { E.a.n += XA.n - cut0; E.s.n += XS.n; } return E; }; }
const STAB = {};
// memories, the way the fights do them: a painted panel slides in under a MEMORY tag with scan lines (mems: [[from, to, panel, stage, rgb]]);
// and the same dress for a whole 3D shot that is a memory (memo: 'r,g,b')
const MEMFX = (B, g, c, s) => {
  if (s.mems) for (const m of s.mems) if (c.t >= m[0] && c.t < m[1]) { const keep = B.art; B.art = { a: { panel: m[2], stage: m[3] || 0, line: '', rgb: m[4], name: '' }, t: c.t - m[0], C: 99 }; try { B.renderArt(g); } catch (e) { } B.art = keep; const out = m[1] - c.t; if (out < .1) { g.fillStyle = `rgba(255,255,255,${(1 - out * 10) * .8})`; g.fillRect(0, 0, W, H); } }
  if (s.memo) { const rgb = s.memo, t = c.t; g.fillStyle = `rgba(${rgb},.10)`; g.fillRect(0, 14, W, H - 28); for (let y = 14 + ((VO.vt * 30) % 4 | 0); y < H - 14; y += 4) { g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect(0, y, W, 1); }
    const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.72)'); g.fillStyle = vg; g.fillRect(0, 14, W, H - 28);
    const tag = 'M E M O R Y'; g.fillStyle = `rgb(${rgb})`; g.fillRect(8, 2, ptextW(tag) + 8, 10); ptext(g, tag, 12, 5, '#07050a'); } };
// subtitles for the voiced film: a serif italic set over the picture, no box; the counted numbers in the same face
const SUB = { el: null, big: null, key: null, t0: 0,
  sent(t) { if (/[a-z]/.test(t)) return t; t = t.toLowerCase().replace(/(^[\u201c]?|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\bi\b/g, 'I'); return t; },
  make() { if (this.el) return; const st = document.createElement('style'); st.textContent = '.ch1sub{position:fixed;z-index:50;pointer-events:none;text-align:center;font-family:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;font-style:italic;font-weight:600;color:#fff6e2;letter-spacing:.012em;line-height:1.32;-webkit-text-stroke:.14em rgba(8,4,10,.7);paint-order:stroke fill;filter:drop-shadow(0 .05em .05em rgba(0,0,0,.95)) drop-shadow(0 0 .3em rgba(0,0,0,.8));opacity:0;transition:opacity .22s ease}.ch1sub.mem{font-style:normal;font-weight:500;color:#dfe6ff;letter-spacing:.03em}.ch1num{position:fixed;z-index:50;pointer-events:none;text-align:center;font-family:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;font-weight:700;letter-spacing:.3em;text-indent:.3em;color:#ff8a3c;-webkit-text-stroke:.1em rgba(20,6,2,.7);paint-order:stroke fill;text-shadow:0 .05em .08em #000,0 0 .3em rgba(0,0,0,.9),0 0 1em rgba(255,90,20,.6);opacity:0}'; document.head.appendChild(st);
    this.el = document.createElement('div'); this.el.className = 'ch1sub'; this.big = document.createElement('div'); this.big.className = 'ch1num'; document.body.appendChild(this.el); document.body.appendChild(this.big); setInterval(() => { if (!Brawl.cine) this.hide(); }, 250); },
  place() { const r = document.getElementById('game').getBoundingClientRect(); const e = this.el.style, b = this.big.style; e.left = (r.left + r.width * .08) + 'px'; e.width = (r.width * .84) + 'px'; e.bottom = (window.innerHeight - r.bottom + r.height * .125) + 'px'; e.fontSize = Math.max(15, r.width * .043) + 'px'; b.left = r.left + 'px'; b.width = r.width + 'px'; b.top = (r.top + r.height * .13) + 'px'; b.fontSize = Math.max(26, r.width * .09) + 'px'; },
  show(text, key, mem) { this.make(); this.el.className = mem ? 'ch1sub mem' : 'ch1sub'; if (key === this.key) return; this.key = key; this.place(); if (!text) { this.el.style.opacity = 0; return; } this.el.style.transition = 'none'; this.el.style.opacity = 0; this.el.textContent = this.sent(text); void this.el.offsetWidth; this.el.style.transition = ''; this.el.style.opacity = 1; },
  num(word, col, t) { this.make(); if (!word) { if (this._n) { this._n = ''; this.big.style.opacity = 0; } return; } if (this._n !== word) { this._n = word; this.place(); this.big.textContent = word; this.big.style.color = col || '#ff8a3c'; } const k = Math.min(1, Math.max(0, (t - .08) / .1)); this.big.style.opacity = k; this.big.style.transform = 'scale(' + (1.35 - .35 * k) + ')'; },
  hide() { if (!this.el) return; this.key = null; this._n = ''; this.el.style.opacity = 0; this.big.style.opacity = 0; } };
// the acting layer: reads an actor's performance each frame and sets what the game's own rig then draws
{ const f0 = Brawl.fighter; Brawl.fighter = function (g, o, opt) {
    const k = opt && opt.key, c = this.cine;
    if (k && c && (k.path || k.zs || k.poses || k.sts || k.faceTo || k.za !== undefined)) {
      const S = c.shots[c.i] || {}, U = S.sec ? 1 : c.dur, q = S.sec ? c.t : Math.min(1, c.t / c.dur), now = c.t;
      if (k.path) { const [A, B, u] = kq(k.path, q); const x = A[1] + (B[1] - A[1]) * u, y = A[2] + (B[2] - A[2]) * u; k._sp = k._lt !== undefined && now > k._lt ? Math.hypot(x - k._x, y - k._y) / (now - k._lt) : 0; k._x = x; k._y = y; k._lt = now; k.x = x; k.y = y; o.x = x; o.y = y; if (k._sp > 8) { k._an = (k._an || 0) + Math.min(.05, Math.max(0, now - (k._la || now))) * (k.walk ? .55 : 1); opt.run = true; } else opt.run = false; k._la = now; o.anim = k._an || 0; }
      if (k.zs) { const [A, B, u0] = kq(k.zs, q), u = k.zease === 'in' ? u0 * u0 : k.zease === 'out' ? 1 - Math.pow(1 - u0, 2) : u0; o.z = A[1] + (B[1] - A[1]) * u; o.vz = B[1] >= A[1] ? 1 : -1; if (o.z > 1) opt.run = false; }
      else if (k.za !== undefined) { const e = k.zease === 'in' ? q * q : 1 - Math.pow(1 - q, 2), zb = k.zb === undefined ? k.za : k.zb; o.z = k.za + (zb - k.za) * e; o.vz = zb > k.za ? 1 : -1; }
      if (k.faces) { let f = k.faces[0]; for (const e of k.faces) if (q >= e[0]) f = e; o.fx = f[1]; o.fy = f[2]; }
      if (k.faceTo) { const other = c.acts.find(a => a.id === k.faceTo); if (other) { const dx = other.x - o.x, dy = other.y - o.y, d = Math.hypot(dx, dy) || 1; o.fx = dx / d; o.fy = dy / d; o.ax = o.fx; o.ay = o.fy; } }
      k._pose = null; if (k.poses) { let cur = k.poses[0]; for (const e of k.poses) if (q >= e[0]) cur = e; k._pose = cur[1]; k._rate = cur[2] || 10; }
      o.swing = 0; o.guardT = 0;
      if (k.sts) for (const e of k.sts) { const t0 = e[0] * U, m = e[2] || {}, end = m.until !== undefined ? m.until * U : t0 + (m.dur || .3); if (now >= t0 && now < end) { if (e[1] === 'guard') o.guardT = 1; else { o.st = e[1]; o.t = now - t0 + (m.t0 || 0); if (m.combo) o.combo = m.combo; if (m.kx !== undefined) { o.kx = m.kx; o.ky = m.ky || 0; } } } }
      if (k.rage) opt.rage = k.rage;
      if ((S.va !== undefined || S.sec) && k.id) { const sk = STAB[k.id] || (STAB[k.id] = {}); sk.act = k; opt.key = sk; if (!k._init) { k._init = 1; const R = G3.rigs && G3.rigs.get(sk); if (R) { R.x = o.x; R.y = o.y; R.vx = 0; R.vy = 0; R.trail = []; R.yaw = Math.atan2(o.fx, o.fy); } } }
    }
    if (k && k.notrail && G3.rigs) { const R = G3.rigs.get(opt.key); if (R) R.trail = []; }
    const gk = k && c && k.glint ? k.glint : null; if (gk) G3._cap = [];
    const rr = f0.call(this, g, o, opt); const cp = G3._cap; G3._cap = null;
    if (gk && cp && cp.length && c.t >= gk[0] && c.t < gk[0] + gk[1]) { const u = (c.t - gk[0]) / gk[1], a = Math.sin(Math.PI * u), P = cp[0], up = gk[2] === undefined ? 17 : gk[2]; G3.glow(P[0], P[1] + up, P[2], 5 + 24 * a, [1, .96, .8], .9 * a); G3.glow(P[0], P[1] + up, P[2], 2 + 9 * a, [1, 1, 1], a); }
    return rr; }; }
// the sun on the hook: the rig lights the blade when it is hot, so that light tells us where the blade is
{ const g0 = G3.glow; G3.glow = function (x, y, z) { if (this._cap) this._cap.push([x, y, z]); return g0.apply(this, arguments); }; }
// a held pose lies over whatever the rig would have done, except while a cut or a blow is playing
{ const t0 = G3.target; G3.target = function (o, opt, st, blade, mv, t, idx) { const r = t0.call(this, o, opt, st, blade, mv, t, idx), k0 = opt && opt.key, k = k0 && (k0.act || k0); if (k && k._pose && st !== 'atk' && st !== 'hurt' && st !== 'plunge' && st !== 'wind' && st !== 'dodge' && !mv) { Object.assign(r[0], k._pose); r[1] = k._rate || 10; r[2] = .8; const br = Math.sin(t * 1.7 + (idx || 0) * 2.1); r[0].cr = (r[0].cr || 0) + br * .2 + .2; r[0].lean = (r[0].lean || 0) + br * .012; r[0].hx = (r[0].hx || 0) + Math.sin(t * .83 + (idx || 0)) * .035; r[0].lp = (r[0].lp || 0) + br * .02; const ph = (idx || 0) * 1.7; r[0].side = (r[0].side || 0) + Math.sin(t * .9 + ph) * .05; r[0].tw = (r[0].tw || 0) + Math.sin(t * .7 + ph) * .06; r[0].tilt = (r[0].tilt || 0) + Math.sin(t * 1.3 + ph) * .06; r[0].ry = (r[0].ry || 0) + Math.sin(t * 1.1 + ph) * .04; r[0].hy = (r[0].hy || 0) + Math.sin(t * .5 + ph) * .09; r[0].re = (r[0].re || 0) + Math.sin(t * 1.5 + ph) * .04; } return r; }; }
// she is drawn flat on the dais; three drawings of her let her look at her son, and up
const CEL = { cache: {}, draw(kind) { if (this.cache[kind]) return this.cache[kind]; const base = daisSprite('cel'); if (kind === 'front') return (this.cache[kind] = base); const c = document.createElement('canvas'); c.width = base.width; c.height = base.height; const g = c.getContext('2d'); g.drawImage(base, 0, 0);
    const HR = '#f6eac0', SK = '#f4e6dc', SK2 = '#d2c6bd';
    if (kind === 'turn') { g.fillStyle = HR; g.fillRect(18, 13, 8, 12); g.drawImage(base, 18, 13, 8, 11, 20, 13, 8, 11); g.fillStyle = SK2; g.fillRect(20, 24, 6, 2); g.fillStyle = HR; g.fillRect(15, 12, 5, 12); }
    else if (kind === 'up') { g.fillStyle = HR; g.fillRect(15, 1, 14, 10); g.drawImage(base, 14, 3, 16, 9, 14, 1, 16, 9); g.fillStyle = HR; g.fillRect(18, 10, 8, 3); g.drawImage(base, 18, 13, 8, 9, 18, 11, 8, 9); g.fillStyle = SK; g.fillRect(18, 20, 8, 4); g.fillStyle = SK2; g.fillRect(19, 23, 6, 3); g.fillStyle = '#8a5a4a'; g.fillRect(20, 20, 4, 1); }
    return (this.cache[kind] = c); },
  set(kind) { const L = G3.bbs && G3.bbs.keep; if (!L) return; const i = L.findIndex(b => b.tag === 'dais' && b.x === 0); if (i < 0 || L[i]._kind === kind) return; this.ent = this.ent || {}; if (!this.ent[kind]) this.ent[kind] = Object.assign({}, L[i], { cv: this.draw(kind), tex: null, _kind: kind }); if (!L[i]._kind) { L[i]._kind = 'front'; this.ent.front = L[i]; } L[i] = this.ent[kind]; } };
{ const r0 = Brawl.renderCine; Brawl.renderCine = function (g) { { const c8 = this.cine, s8 = c8 && c8.shots[c8.i], Lk = G3.LOOK && G3.LOOK.keep; if (Lk) { Lk._f0 = Lk._f0 || Lk.fogR; Lk.fogR = s8 && s8.fog ? s8.fog : Lk._f0; } } const rr = this._rc0(g), c9 = this.cine, s9 = c9 && c9.shots[c9.i]; if (s9) MEMFX(this, g, c9, s9); return rr; }; Brawl._rc0 = function (g) { const c = this.cine, s = c && c.shots[c.i]; if (s && this.def.bg === 'keep') { let kind = s.cel; if (s.cels) for (const e of s.cels) if (c.t >= e[0]) kind = e[1]; if (kind) CEL.set(kind); } if (s && s.caps) { let cp = ''; for (const e of s.caps) if (c.t >= e[0]) cp = e[1]; s.cap = undefined; SUB.show(cp, s.va + '|' + cp, s.mem); } else if (s && (s.va !== undefined || c.shots === CH1_KEEP_SHOTS)) SUB.show('', ''); if (s && s.va !== undefined && s.big) { s._big = s.big; s._bigC = s.bigC; s.big = undefined; } SUB.num(s && s._big ? s._big : '', s && s._bigC, c ? c.t : 0); return r0.call(this, g); }; }

// ============================================================
// CHAPTER ONE, BELOW — the same story as CH1_NEW, told the way the Assay is told: a film.
// Hard cuts, a camera that moves, captions that do not wait for a button, on the game's own 2.5D sets
// (the square, Row K, the fever ward, Bay Three). Dialogue is carried in the captions, in quotes.
// CH1_FILM_A runs from the world to the plan under the Pillar. CH1_FILM_HEIST is the heist as film.
// In the game the heist is a level you play, so the game would use CH1_FILM_A, then the level.
// ============================================================
const SQ = { bg: 'ring', bg2: null }, ROW = { bg: 'ring', bg2: 'rowk' }, WARD = { bg: 'pit', bg2: 'ward' }, BAY = { bg: 'furnace', bg2: null };
const NIGHT = 'rgba(6,8,30,.5)', WARM = 'rgba(255,214,140,.12)';
const two = (x, y) => ({ cam: [x - 6, y + 150, 56, 170], to: [x + 4, y + 132, 52, 186] });
const cuH = (x, y, s0, s1, dx) => ({ cam: [x + (dx || 0), y + 200 / (s0 * .68), 30, 200, .34], to: [x, y + 200 / (s1 * .68), 27, 200, .34], _cu: 1 });
const CH1_FILM_A = [
  { d: 3.0, black: 1, music: 'mystery', cap: 'THEY SAY THE SURFACE BURNED TWO HUNDRED YEARS AGO. THAT THE SKY IS POISON, AND THE SUN IS A FURNACE THAT EATS LUNGS.' },
  { d: 3.2, ...BAY, cam: [0, 300, 170, 150, .16], to: [0, 170, 70, 150, .3], lin: 1, acts: [{ id: 'mara', a: [-60, -6], fx: 1 }, { id: 'ivo', a: [58, 8], fx: -1 }, { id: 'hollis', a: [-24, 20], fy: -1 }, { id: 'dace', a: [30, -14], fx: -1 }, { id: 'kael', a: [0, 0], fy: -1 }], cap: 'SO WE LIVE BELOW. CINDERWELL. SIX TIERS OF ROCK WRAPPED ROUND A MACHINE CALLED THE DEEP ARRAY, WHICH MAKES THE ONLY AIR THERE IS.' },
  { d: 2.6, ...BAY, cam: [-30, 170, 60, 160], to: [30, 160, 58, 168], lin: 1, acts: [{ id: 'mara', a: [-60, -6], fx: 1 }, { id: 'ivo', a: [58, 8], fx: -1 }, { id: 'hollis', a: [-24, 20], fy: -1 }, { id: 'dace', a: [30, -14], fx: -1 }, { id: 'kael', a: [0, 0], fy: -1 }], cap: 'WE KEEP THE ARRAY RUNNING. THE ARRAY AUTHORITY KEEPS THE COUNT. THEY HAVE A WORD FOR US. SOOT.' },
  { d: 2.6, ...BAY, ...cuH(0, 0, 1.8, 2.6, -14), acts: [{ id: 'kael', a: [0, 0], fx: .4, fy: .9 }], cap: 'MY NAME IS KAEL BRENNICK. I FIXED VALVES ON TIER SIX.' },
  { d: 2.4, black: 1, cap: 'ELEVEN MONTHS BEFORE THE FURNACE, I THOUGHT THE WORST THING THAT COULD HAPPEN TO ME WAS A GIRL SAYING NO.' },
  // ---- the festival
  { d: 2.2, black: 1, music: 'home', big: 'ELEVEN MONTHS BEFORE THE FURNACE', sub2: 'THE FESTIVAL OF THE FIRST FIRE. ASHGATE SQUARE.' },
  { d: 3.2, ...SQ, flash: 1, cam: [0, 330, 200, 150, .14], to: [0, 176, 72, 150, .32], acts: [{ id: 'seren', a: [0, -30], fy: -1 }], cap: 'ONCE A YEAR, CINDERWELL LIGHTS PAPER LANTERNS AND PRETENDS THE LUMEN PILLAR IS THE SUN.' },
  { d: 2.6, ...SQ, cam: [-50, 150, 56, 170], to: [-8, 130, 52, 186], lin: 1, acts: [{ id: 'seren', a: [0, -30], fy: -1 }, { id: 'kael', a: [-96, 6], b: [-20, -24], fx: 1, fy: -.3 }], cap: 'SEREN: DON\'T LOOK. IT\'S NOT FINISHED.' },
  { d: 2.8, ...SQ, ...two(-10, -27), acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .2 }, { id: 'kael', a: [-20, -24], fx: 1, fy: -.2 }], cap: 'KAEL: IT\'S A SUN. SEREN: IT\'S THE SUN. THE REAL ONE. YOU CAN\'T LOOK STRAIGHT AT IT, AND IT NEVER NEEDS A VALVE.' },
  { d: 2.4, ...SQ, ...cuH(-20, -24, 1.9, 2.6, -12), acts: [{ id: 'kael', a: [-20, -24], fx: 1, fy: .3 }], cap: 'KAEL: I CAN\'T LOOK STRAIGHT AT YOU EITHER. SAME PROBLEM.' },
  { d: 2.6, ...SQ, ...cuH(0, -30, 1.9, 2.7, 12), acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .4 }], cap: 'SEREN: THAT WAS DISGUSTING. SAY IT AGAIN. ... DON\'T PROMISE ME THE SKY. PROMISE ME TOMORROW. TOMORROW I CAN USE.' },
  { d: 2.8, ...SQ, ...cuH(-20, -24, 2.2, 3.0, -8), sfx: 'clue', acts: [{ id: 'kael', a: [-20, -24], fx: .6, fy: .8 }], cap: 'I HAD CARRIED IT IN MY POCKET FOR THREE WEEKS. A BRASS WASHER OFF BANK SEVEN, FILED SMOOTH ON MY LUNCH BREAKS.' },
  { d: 2.8, ...SQ, cam: [-10, 126, 52, 186], to: [-10, 112, 48, 200], acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .2 }, { id: 'kael', a: [-20, -24], fx: 1, fy: -.2 }], cap: 'KAEL: SEREN HOLLOWAY. I CAN\'T GIVE YOU THE SKY. BUT I CAN GIVE YOU A PERFECTLY BALANCED PRESSURE SEAL.' },
  { d: 2.6, ...SQ, ...cuH(0, -30, 2.0, 2.9, 10), sfx: 'coin', flash: 1, tint: WARM, acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .4 }], cap: 'SEREN: THAT IS THE WORST PROPOSAL IN THE HISTORY OF CINDERWELL. ... AYE. OBVIOUSLY AYE.' },
  { d: 3.0, ...SQ, cam: [-10, 190, 80, 150, .3], to: [-10, 150, 60, 165, .32], flash: 1, tint: WARM, acts: [{ id: 'seren', a: [0, -30], fy: 1 }, { id: 'kael', a: [-20, -24], fy: 1 }, { id: 'mara', a: [-10, 40], b: [-10, -6], fy: -1 }, { id: 'ivo', a: [60, 20], b: [26, -14], fx: -1 }, { id: 'tavi', a: [-70, 26], b: [-40, -14], fx: 1 }], cap: 'MARA VENN BOUND US AT THE PILLAR IN FRONT OF THE WHOLE OF CREW THREE, WITH CHALK ON BOTH OUR HANDS.' },
  { d: 2.2, ...SQ, ...cuH(26, -14, 2.0, 2.8, 12), acts: [{ id: 'ivo', a: [26, -14], fx: -.6, fy: .8 }], cap: 'IVO: I\'M NOT CRYING. THE SQUARE IS DUSTY. THE SQUARE IS VERY DUSTY.' },
  { d: 3.0, ...SQ, cam: [-10, 118, 50, 196, .32], to: [-10, 150, 70, 180, .5], tint: WARM, acts: [{ id: 'seren', a: [-4, -28], fx: -1, fy: .2 }, { id: 'kael', a: [-18, -25], fx: 1, fy: -.2 }], cap: 'SHE DREW THE LAST RAY OF HER SUN ON MY WRIST WITH ONE FINGER. SEREN: THERE. NOW YOU\'VE SEEN IT.' },
  // ---- the morning after
  { d: 2.0, black: 1, big: 'MORNING', sub2: 'ROW K. THE MORNING AFTER THE FIRST FIRE.' },
  { d: 2.8, ...ROW, flash: 1, ...two(-6, -10), acts: [{ id: 'seren', a: [4, -12], fx: -1, fy: .2 }, { id: 'kael', a: [-16, -8], fx: 1, fy: -.2 }], cap: 'SEREN: IT\'S THE ONLY ROUND THING YOU OWN AND YOU GAVE IT AWAY. KAEL: I OWN HALF OF ONE. SEREN: AYE. THE INSIDE HALF.' },
  { d: 2.6, ...ROW, cam: [20, 160, 58, 165], to: [0, 146, 54, 176], lin: 1, acts: [{ id: 'seren', a: [4, -12], fx: 1, fy: .4 }, { id: 'kael', a: [-16, -8], fx: 1, fy: .4 }, { id: 'mara', a: [96, 14], b: [40, 2], fx: -1 }], cap: 'MARA: BAY THREE AT FIRST BELL, THE BOTH OF YOU. I MARRIED YOU. I DIDN\'T GIVE YOU THE DAY.' },
  { d: 2.8, ...ROW, ...cuH(-44, 6, 2.0, 2.8, -12), acts: [{ id: 'tavi', a: [-44, 6], fx: .7, fy: -.5 }], cap: 'MY BROTHER TAVI WAS SIX. TAVI: IS SHE MY SISTER NOW? DO I HAVE TO DO WHAT SHE SAYS? KAEL: AYE. AND AYE.' },
  { d: 3.0, ...ROW, cam: [-14, 150, 56, 170], to: [-4, 134, 52, 184], acts: [{ id: 'seren', a: [4, -12], fx: -1, fy: .3 }, { id: 'kael', a: [-16, -8], fx: -1, fy: .5 }, { id: 'tavi', a: [-44, 6], b: [16, -6], fx: 1 }], cap: 'HE THOUGHT ABOUT THAT. THEN HE WENT AND STOOD NEXT TO HER, AND NOT NEXT TO ME. IT STAYED THAT WAY.' },
  // ---- the fever
  { d: 2.2, black: 1, music: 'mystery', big: 'FOUR DAYS BEFORE THE FURNACE', sub2: 'THE FEVER COMES TO TIER SIX.' },
  { d: 3.0, ...WARD, sfx: 'cough', cam: [0, 250, 130, 150, .2], to: [0, 164, 66, 156, .32], tint: 'rgba(6,14,26,.2)', acts: [{ id: 'nell', a: [8, -22], fy: 1 }, { id: 'tavi', a: [44, -6], fx: -1, fy: .4 }, { id: 'kael', a: [-10, 60], b: [-12, 2], fy: -1 }, { id: 'seren', a: [8, 66], b: [8, 10], fy: -1 }], cap: 'TAVI WAS SEVEN, AND WHEN HE BREATHED IT SOUNDED LIKE A SOCK BEING PULLED OVER A BOOT.' },
  { d: 3.0, ...WARD, sfx: 'cough', ...cuH(8, -22, 1.9, 2.6, 12), tint: 'rgba(6,14,26,.2)', acts: [{ id: 'nell', a: [8, -22], fx: -.4, fy: .9 }], cap: 'NELL: THE FEVER ISN\'T WHAT KILLS THEM. IT\'S THE AIR. THE AUTHORITY CUT THE CLINIC A MONTH AGO. FORTY KIDS, BREATHING EACH OTHER\'S BREATH.' },
  { d: 2.8, ...WARD, ...cuH(44, -6, 1.8, 2.5, 10), tint: 'rgba(6,14,26,.2)', acts: [{ id: 'tavi', a: [44, -6], fx: -1, fy: .4 }], cap: 'MY BROTHER LAY WITH HIS HAND FLAT ON HIS CHEST, AS IF HE COULD HOLD THE AIR IN.' },
  { d: 3.2, ...WARD, ...cuH(-12, 2, 1.9, 2.7, -12), tint: 'rgba(6,14,26,.2)', acts: [{ id: 'kael', a: [-12, 2], fx: .6, fy: -.6 }], cap: 'KAEL: BANK SEVEN HAS A LINE NOBODY\'S ALLOWED TO TOUCH. SO WE BLEED IT SLOW, AND BALANCE THE BANK BEFORE THE MORNING AUDIT.' },
  { d: 3.0, ...WARD, cam: [0, 150, 56, 170], to: [0, 136, 52, 182], tint: 'rgba(90,10,0,.22)', acts: [{ id: 'nell', a: [8, -22], fy: 1 }, { id: 'kael', a: [-12, 2], fy: -1 }, { id: 'seren', a: [8, 10], fx: -1, fy: -.6 }], cap: 'STEALING AIR IS THE ONE CRIME THE AUTHORITY NEVER FORGIVES. THEY COMMIT YOU TO THE ARRAY, AND THE ARRAY RUNS ON FIRE.' },
  { d: 2.6, ...WARD, cam: [10, 140, 54, 178], to: [30, 140, 54, 178], lin: 1, tint: 'rgba(6,14,26,.2)', acts: [{ id: 'nell', a: [8, -22], b: [60, -30], fx: 1 }, { id: 'kael', a: [-12, 2], fx: 1, fy: -.4 }, { id: 'seren', a: [8, 10], fx: 1, fy: -.4 }], cap: 'NELL: I DIDN\'T HEAR ANY OF THIS. I\'LL HAVE THE WARD VENTS OPEN AT SECOND BELL.' },
  // ---- the plan, under her sun
  { d: 2.8, ...SQ, nocrowd: 1, tint: NIGHT, cam: [-40, 160, 58, 168], to: [-6, 140, 54, 182], lin: 1, acts: [{ id: 'seren', a: [-60, -10], b: [0, -30], fx: 1 }, { id: 'kael', a: [-84, -4], b: [-20, -24], fx: 1 }], cap: 'WE WALKED BACK THROUGH THE SQUARE WITHOUT TALKING. AT THE PILLAR SHE STOPPED, UNDER HER OWN PAINTED SUN.' },
  { d: 2.2, ...SQ, nocrowd: 1, tint: NIGHT, ...cuH(0, -30, 1.9, 2.6, 12), acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .4 }], cap: 'SEREN: WHY YOU? WHY DOES IT ALWAYS HAVE TO BE YOU?' },
  { d: 2.4, ...SQ, nocrowd: 1, tint: NIGHT, ...cuH(-20, -24, 1.9, 2.7, -12), acts: [{ id: 'kael', a: [-20, -24], fx: 1, fy: .3 }], cap: 'KAEL: BECAUSE I WON\'T WATCH TAV DROWN IN HIS OWN BED.' },
  { d: 2.6, ...SQ, nocrowd: 1, tint: NIGHT, ...cuH(0, -30, 2.2, 3.0, 8), acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .4 }], cap: 'SEREN: AYE. THAT\'S THE ANSWER I MARRIED, YOU IDIOT. THAT EXACT ONE.' },
  { d: 3.2, ...SQ, nocrowd: 1, tint: NIGHT, ...two(-10, -27), acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .2 }, { id: 'kael', a: [-20, -24], fx: 1, fy: -.2 }], cap: 'SEREN: RELAY, EAST WALL. THEN BANK SEVEN. I\'LL KEEP WATCH. THE NIGHT TALLYMAN WALKS BAY THREE EVERY HOUR WITH A LANTERN.' },
  { d: 3.0, ...SQ, nocrowd: 1, tint: NIGHT, cam: [-10, 126, 52, 186], to: [-10, 112, 48, 200], acts: [{ id: 'seren', a: [0, -30], fx: -1, fy: .2 }, { id: 'kael', a: [-20, -24], fx: 1, fy: -.2 }], cap: 'KAEL: AND IF HE SEES BOTH OF US? SEREN: THEN WE\'RE NEWLYWEDS LOOKING FOR SOMEWHERE PRIVATE. TRY TO LOOK EMBARRASSED.' }
];
const DARK = 'rgba(4,5,22,.62)';
const CH1_FILM_HEIST = [
  { d: 2.0, black: 1, big: 'BAY THREE', sub2: 'SECOND BELL.' },
  { d: 3.2, ...BAY, tint: DARK, cam: [-60, 190, 80, 150, .3], to: [40, 170, 70, 156, .32], lin: 1, acts: [{ id: 'proctor', a: [90, -8], b: [-70, -8], fx: -1 }, { id: 'watchman', a: [96, 26], fx: -1 }], cap: 'THE NIGHT TALLYMAN WALKED THE MIDDLE OF IT, END TO END, WITH HIS LANTERN HELD HIGH.' },
  { d: 3.0, ...BAY, tint: DARK, cam: [-70, 150, 54, 176], to: [10, 150, 54, 176], lin: 1, acts: [{ id: 'proctor', a: [-70, -8], b: [60, -8], fx: 1 }, { id: 'kael', a: [-104, 30], b: [-10, 30], fx: 1 }, { id: 'watchman', a: [96, 26], fx: 1 }], cap: 'THE LAMPS SWEPT. I COUNTED THEM. FOUR. SIX. EIGHT. THERE WAS ALWAYS A GAP, IF YOU WERE PATIENT.' },
  { d: 3.0, ...BAY, tint: DARK, sfx: 'rotate', ...cuH(100, 4, 1.9, 2.8, 12), acts: [{ id: 'kael', a: [100, 4], fx: 1, fy: -.2 }], cap: 'AT THE EAST WALL I HELD MY HAND ON THE GREY BOX WHILE THE CUTTER BIT INTO THE SEAL. TWO SECONDS, NOT BREATHING.' },
  { d: 2.4, ...BAY, tint: 'rgba(255,200,80,.14)', flash: 1, cam: [60, 150, 56, 170], to: [80, 132, 52, 186], acts: [{ id: 'proctor', a: [40, -8], b: [66, -2], fx: 1, fy: .2 }, { id: 'kael', a: [100, 4], fx: 1, fy: -.2 }], cap: 'THE LAMP CAME ROUND. IT STOPPED ON THE CRATE BESIDE MY FACE.' },
  { d: 3.2, ...BAY, tint: DARK, sfx: 'rumble', shake: .5, cam: [-110, 150, 56, 170], to: [-96, 134, 52, 184], acts: [{ id: 'seren', a: [-104, 8], fx: 1, fy: .3 }, { id: 'proctor', a: [40, -6], b: [-40, 0], fx: -1 }, { id: 'watchman', a: [96, 26], b: [20, 20], fx: -1 }], cap: 'ACROSS THE BAY SOMETHING HEAVY WENT OVER WITH A CRASH. EVERY LAMP TURNED TOWARD HER.' },
  { d: 2.6, ...BAY, tint: DARK, sfx: 'clink', ...cuH(-104, 8, 1.9, 2.6, -12), acts: [{ id: 'seren', a: [-104, 8], fx: 1, fy: .5 }], cap: 'SEREN STOOD IN THE DOORWAY WITH A SACK OF BOLTS AT HER FEET, SWEARING AT THE SACK.' },
  { d: 3.0, ...BAY, tint: 'rgba(8,6,20,.45)', sfx: 'rotate', cam: [0, 150, 56, 170], to: [0, 120, 50, 196], acts: [{ id: 'kael', a: [0, -34], fy: -1 }], cap: 'BANK SEVEN CAME UP UNDER MY HANDS. I FOUND THE AUTHORITY LINE BY TOUCH, AND TURNED THE WHEEL A QUARTER. THEN ANOTHER EIGHTH.' },
  { d: 3.2, ...WARD, flash: 1, sfx: 'solved', cam: [0, 220, 110, 150, .22], to: [0, 160, 64, 158, .32], acts: [{ id: 'nell', a: [0, -18], fy: 1 }, { id: 'pip', a: [-40, -4], fx: 1 }, { id: 'mosi', a: [36, 0], fx: -1 }, { id: 'ada', a: [-14, 12], fy: -1 }, { id: 'tavi', a: [18, 14], fy: -1 }], cap: 'FAR OFF, THROUGH THE VENTS: THE CLINIC FANS, SPINNING UP. THEN A CHEER, FROM A WARD FULL OF CHILDREN WHO COULD SUDDENLY BREATHE.' },
  { d: 2.8, ...BAY, tint: 'rgba(8,6,20,.4)', ...two(-6, -32), acts: [{ id: 'seren', a: [-14, -32], fx: 1, fy: .2 }, { id: 'kael', a: [2, -34], fx: -1, fy: .2 }], cap: 'SEREN: YOU\'RE INSUFFERABLE WHEN YOU\'RE RIGHT. KAEL: THEN I PLAN TO BE INSUFFERABLE FOR A VERY LONG TIME.' },
  { d: 2.8, ...BAY, tint: 'rgba(8,6,20,.4)', cam: [-6, 122, 52, 188], to: [-6, 108, 48, 202], acts: [{ id: 'seren', a: [-14, -32], fx: 1, fy: .2 }, { id: 'kael', a: [2, -34], fx: -1, fy: .2 }], cap: 'SEREN: BALANCE IT BACK BEFORE THE AUDIT. PROMISE ME. KAEL: EVERY NIGHT. BALANCED BY DAWN. ON MY BREATH.' },
  { d: 3.2, ...BAY, tint: WARM, ...cuH(-6, -33, 2.2, 3.2, 0), acts: [{ id: 'seren', a: [-10, -32], fx: 1, fy: .2 }, { id: 'kael', a: [-2, -34], fx: -1, fy: .2 }], cap: 'SHE PULLED ME DOWN BY THE COLLAR. FOR A MOMENT, CINDERWELL WAS WARM FOR THE RIGHT REASONS.' },
  { d: 3.4, black: 1, music: null, cap: 'FOR THREE NIGHTS, WE BLED THE LINE AND BALANCED THE BANK BY DAWN. ON THE THIRD NIGHT, THE FEVER BROKE. TAVI ASKED FOR BREAD.' }
];
for (const sh of CH1_FILM_A.concat(CH1_FILM_HEIST)) if (!sh.black && !sh._cu && sh.cam) { sh.cam = sh.cam.slice(); sh.cam[2] = Math.round(sh.cam[2] * .7); if (sh.to) { sh.to = sh.to.slice(); sh.to[2] = Math.round(sh.to[2] * .7); } }
const CH1_FILM_DEF = shots => () => ({ bg: 'ring', arena: { kind: 'ring', rx: 150, ry: 66 }, music: 'mystery', cineOnly: 1, film: 1, intro: shots, foes: [] });
const CH1_FILM = [{ fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { brawl: CH1_FILM_DEF(CH1_FILM_A.concat(CH1_FILM_HEIST)) }, { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }];
// a film shot may name its own set (bg2) and ask for an empty square (nocrowd); the game's films never changed sets below
{ const n0 = Brawl.nextShot; Brawl.nextShot = function () { const c = this.cine, s = c && c.shots[c.i + 1]; if (s && s.bg2 !== undefined) this.def = Object.assign({}, this.def, { bg2: s.bg2 || undefined }); n0.call(this); if (s && s.nocrowd && this.props) this.props = this.props.filter(q => q.t !== 'crowd'); if (s && s.noprops) this.props = []; }; }

// a lantern for any actor marked with one: the light sits a little ahead of the way he is facing
{ const a0 = Cutscene.anim, e0 = Cutscene.end;
  Cutscene.anim = function (dt) { a0.call(this, dt); const L = this.actors.filter(a => a.lamp); if (L.length) World.dynLights = L.map(a => { const an = DIRA[a.dir]; return { x: a.x + Math.cos(an) * 14, y: a.y - 6 + Math.sin(an) * 14, r: 60, c: '#ffd070' }; }); else if (this._lamps) World.dynLights = []; this._lamps = L.length; };
  Cutscene.end = function () { if (this._lamps) { World.dynLights = []; this._lamps = 0; } return e0.call(this); }; }

// ============================================================
// SCENE 30, REBUILT: TAVI AT SIXTEEN. The game holds one drawing for ten seconds. Here it is a 3D film on a set built for it:
// the service side of the Sun Spire, where the soot work behind a painted line. No words are spoken; the place card is the only text.
// the 3D figure is built for plate; a work coat in place of it: brown leather, dark seams, the scarf where a House sash would be
CAST.tavi16 = { name: 'Tavi', look: () => ({ skin: KAEL_LOOK.skin, hair: KAEL_LOOK.hair, style: 'short', armor: '#6a5236', trim: '#3a2a20', sash: '#b8682a', shirt: '#6a5236', pants: '#3a2e28' }) };
G3.LOOK.svc = Object.assign({}, G3.LOOK.hall, { amb: [.4, .37, .4], sunC: [1.1, .95, .8], fog: [.08, .07, .08], fogR: [320, 900] });
// (x across, y up, z toward the camera.) A landing, a stair coming up to it from below, a stair going on up along the back wall,
// a wall of dressed grey block with pipes, valves and lamps, a door with kitchen light, a slit of sky, and the painted line.
const SVCSET = (A, S) => {
  const I = M4.id(), GOLD = '#e2b84a', DK = '#1a1418', LIT = '#ffd98a';
  let sd = 4711; const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let ix = -7; ix < 7; ix++) for (let iz = -2; iz < 2; iz++) { const k = (ix + iz) & 1, j = rnd() * .03; A.quad(ix * 32, iz * 31, ix * 32 + 32, iz * 31 + 31, 0, k ? [.44 + j, .43 + j, .46 + j] : [.39 + j, .38 + j, .41 + j]); }
  S.box(I, 0, -40, 0, 460, 80, 124, '#3a3840');
  // the painted line, across the head of the stair: the clerks' side stops here
  A.box(I, 60, .15, 57, 74, .3, 3, GOLD, 1);
  // the stair up from below, toward the camera
  for (let k = 1; k <= 10; k++) { S.box(I, 60, -7 * k - 40, 60 + 16 * k - 8, 70, 80, 16, k & 1 ? '#4e4c56' : '#46444e'); A.box(I, 60, -7 * k + .2, 60 + 16 * k - 15.4, 70, .5, 1.2, GOLD, 1); }
  for (const bx of [22, 98]) { S.box(I, bx, -30, 135, 4, 50, 160, '#4a4852'); A.box(I, bx, -4.6, 135, 5, 1, 160, '#6a6672', 1); }
  // the back wall: dressed block, string course, block faces set a hair proud
  S.box(I, 0, 100, -66, 470, 220, 6, '#5a5862');
  for (let r = 0; r < 16; r++) for (let c = 0; c < 15; c++) { const w = 30, x = -232 + c * 31 + (r & 1) * 15, y = 6 + r * 13, t = rnd(); if (x > 132 && x < 170 && y < 70) continue; S.box(I, x, y, -62.3, w, 12, 1.2, t > .66 ? '#686670' : t > .33 ? '#62606a' : '#6e6c76'); }
  S.box(I, 0, 92, -61, 470, 3, 2, '#7a7882');
  // a door on the service side, kitchen light behind it
  A.box(I, 150, 34, -61, 32, 66, 1, [1, .78, .48], 1); S.box(I, 132, 36, -60, 4, 72, 4, '#3a3038'); S.box(I, 168, 36, -60, 4, 72, 4, '#3a3038'); S.box(I, 150, 72, -60, 40, 4, 4, '#3a3038');
  // a slit of sky
  A.box(I, -150, 128, -61, 12, 52, 1, [.78, .88, 1], 1); S.box(I, -150, 101, -60, 18, 3, 4, '#7a7882'); S.box(I, -150, 155, -60, 18, 3, 4, '#7a7882');
  // the pipes: one along the wall, two down it, a valve wheel on each
  S.cyl(M4.chain(M4.t(-230, 150, -55), M4.rz(-Math.PI / 2)), 0, 0, 0, 3.6, 3.6, 460, 7, '#7a6450');
  for (const px of [96, -96]) { S.cyl(M4.t(px, 0, -55), 0, 0, 0, 3.2, 3.2, 150, 7, '#7a6450'); const wm = M4.chain(M4.t(px, 84, -50), M4.rx(Math.PI / 2)); S.cyl(wm, 0, 0, 0, 9, 9, 1.6, 12, '#a8452a'); S.cyl(wm, 0, -.2, 0, 2.4, 2.4, 2.4, 6, '#3a2a24'); for (let q = 0; q < 3; q++) S.box(M4.chain(M4.t(px, 84, -49.6), M4.rz(q * 1.047)), 0, 0, 0, 17, 1.4, 1.2, '#a8452a'); }
  // lamps
  for (const lx of [-120, 30, 190]) { S.box(I, lx, 104, -58, 3, 3, 7, '#3a3038'); A.box(I, lx, 98, -55, 6, 9, 6, LIT, 1); S.box(I, lx, 104.5, -55, 8, 1.5, 8, '#3a3038'); }
  // the stair on up, along the back wall, to the left
  for (let k = 1; k <= 12; k++) { const xk = -50 - 14 * k, h = 7 * k; S.box(I, xk, h / 2 - .5, -42, 14, h + 1, 40, k & 1 ? '#4e4c56' : '#46444e'); A.box(I, xk + 6.4, h + .2, -42, 1.2, .5, 40, GOLD, 1); }
  S.box(I, -130, 62, -21, 170, 4, 2, '#6a6672');
  // the ceiling, so it is inside
  S.box(I, 0, 214, 0, 470, 6, 280, '#2a2830');
};
{ const env1 = G3.env; G3.env = function (bg) { if (bg !== 'svc' || !this.gl) return env1.call(this, bg); if (this.envs.svc) return this.envs.svc;
    const A = new Batch(20000), S = new Batch(20000); SVCSET(A, S); const gl = this.gl;
    const mk = B => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, B.a.subarray(0, B.n * 9), gl.STATIC_DRAW); return { b, n: B.n }; };
    return this.envs.svc = { a: mk(A), s: mk(S), hw: 110, hh: 76 }; }; }   // hh puts the game's two field flags behind the back wall

// the chalk sun, drawn stroke by stroke on the wall (centre -20, 52): a rough ring three times round, then ten rays
const SUN_AT = [-20, 44, -60.1];
const drawSun = (ring, rays) => { const D = G3.dyn, [cx, cy, cz] = SUN_AT, col = [1, .96, .82], seg = (x1, y1, x2, y2, w) => { const L = Math.hypot(x2 - x1, y2 - y1); D.box(M4.chain(M4.t((x1 + x2) / 2, (y1 + y2) / 2, cz), M4.rz(Math.atan2(y2 - y1, x2 - x1))), 0, 0, 0, L + .4, w, .3, col, 1); };
  let jit = 11; const J = () => ((jit = (jit * 9301 + 49297) % 233280) / 233280 - .5);
  const N = 30, tot = ring * 3 * N; for (let p = 0; p < 3; p++) for (let i = 0; i < N; i++) { if (p * N + i >= tot) break; const a0 = i / N * 6.2832 + p * .2, a1 = (i + 1) / N * 6.2832 + p * .2, r0 = 10 + J() * 1.2 + p * .25, r1 = 10 + J() * 1.2 + p * .25; seg(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, .9 - p * .15); }
  for (let i = 0; i < 10; i++) { const k = Math.min(1, Math.max(0, rays * 10 - i)); if (k <= 0) break; const a = Math.PI / 2 - i / 10 * 6.2832, r1 = 13.5, r2 = 13.5 + (i & 1 ? 6 : 10) * k; seg(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, 1); } };
{ const f1 = Brawl.fighter; Brawl.fighter = function (g, o, opt) { const r = f1.call(this, g, o, opt), k = opt && (opt.key && (opt.key.act || opt.key)), c = this.cine, s = c && c.shots[c.i];
    if (k && k.id === 'tavi16' && s && s.tavi) { const T = s.tavi, t = c.t, p = (a) => !a ? 1 : Math.min(1, Math.max(0, (t - a[0]) / (a[1] - a[0])));
      if (T.sun) drawSun(T.sun === 'done' ? 1 : p(T.sun[0]), T.sun === 'done' ? 1 : p(T.sun[1]));
      if (k.lamp) { const tt = this.t, sw = Math.sin(tt * 3.2) * 1.6; G3.glow(o.x + (o.fx || 0) * 3 + 5 * (o.fy || 0), (o.z || 0) + 17 + sw * .3, o.y - 2 * (o.fx || 0), 16, [1, .78, .42], .55); }
      for (const lx of [-120, 30, 190]) G3.glow(lx, 98, -54, 22, [1, .8, .5], .35 + Math.sin(this.t * 7 + lx) * .03); G3.glow(150, 34, -58, 40, [1, .7, .4], .25); }
    return r; }; }
// non-voiced films keep the same moving hand on the camera, on the game's own clock
{ const u2 = Brawl.updCine; Brawl.updCine = function (dt) { u2.call(this, dt); const c = this.cine, s = c && c.shots[c.i]; if (s && s.drift && s.va === undefined) { const w = this.t; this.cam.x += Math.sin(w * .7) * .7 + Math.sin(w * 1.9) * .2; this.cam.h += Math.sin(w * .93 + 1) * .5; this.cam.y += Math.sin(w * .41 + 2) * .9; } }; }

const TS30 = (d, o) => Object.assign({ d, vd: d, sec: 1, drift: 1, noprops: 1, caps: [[0, '']], tavi: { sun: 0 } }, o);
const TV = (o) => Object.assign({ id: 'tavi16', blade: 0, fx: 0, fy: -1, sc: .96 }, o);
// heights on the two stairs
const upA = (zz) => -Math.max(0, zz - 60) * 7 / 16, upB = (x) => Math.max(0, -50 - x) / 2;
Object.assign(ACT, {
  climb: { cr: .7, lean: .1, tw: 0, hx: .25, rp: .4, re: -.6, lp: -.3, ly: -.2, le: -1.2, hl: .5, kl: .7, hr: -.2, kr: .5, sp: .12 },
  lookWall: { cr: .4, lean: -.06, tw: 0, hx: -.42, hy: 0, rp: .1, re: -.3, lp: -.25, ly: -.25, le: -1.1, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .1 },
  chalkIn: { cr: .6, lean: .02, tw: .15, hx: .2, hy: .2, rp: .35, ry: -.35, re: -1.9, lp: -.25, ly: -.25, le: -1.1, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .1 },
  chalkUp: { cr: .2, lean: .1, tw: -.1, hx: -.25, rp: -1.95, ry: .15, re: -.5, lp: -.25, ly: -.25, le: -1.1, hl: .05, kl: .05, hr: -.1, kr: .1, sp: .1 },
  chalkL: { cr: .2, lean: .1, tw: -.18, hx: -.36, hy: .1, rp: -1.8, ry: .55, re: -.7, lp: -.25, ly: -.25, le: -1.1, hl: .05, kl: .05, hr: -.1, kr: .1, sp: .1 },
  chalkR: { cr: .2, lean: .1, tw: 0, hx: -.4, hy: -.1, rp: -2.1, ry: .3, re: -.35, lp: -.25, ly: -.25, le: -1.1, hl: .05, kl: .05, hr: -.1, kr: .1, sp: .1 },
  stepBack: { cr: .5, lean: -.08, tw: 0, hx: -.34, rp: .05, re: -.25, lp: -.25, ly: -.25, le: -1.1, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .12 }
});
const drawing = (t0, t1, n) => Array.from({ length: n }, (_, i) => [t0 + (t1 - t0) * i / n, [ACT.chalkUp, ACT.chalkL, ACT.chalkR][i % 3], 9]);
const chalkDust = (t0, t1, n, rays) => Array.from({ length: n }, (_, i) => { const t = t0 + (t1 - t0) * i / n, a = rays ? Math.PI / 2 - i / n * 6.28 : i / n * 6.28 * 3, r = rays ? 18 : 10; return [t, 'spark', SUN_AT[0] + Math.cos(a) * r, SUN_AT[2] + 1.5, '#fff6d8', 2, SUN_AT[1] + Math.sin(a) * r - 1]; });
const TAVI16_SHOTS = [
  // the service stair, from above the landing: a lamp coming up out of the dark
  TS30(5.2, { bg: 'svc', music: 'hum', cam: [110, 300, 100, 168, .46], to: [76, 236, 62, 176, .42], sfxs: [[.2, 'heart'], [3.0, 'heart']],
    caps: [[.5, 'NINE YEARS AFTER THE FURNACE.'], [2.7, 'The Sun Spire. The service stair.']],
    acts: [TV({ a: [60, 200], fy: -1, lamp: 1, walk: 1, path: [[0, 60, 200], [5.2, 62, 118]], zs: [[0, upA(200)], [5.2, upA(118)]], poses: [[0, ACT.climb, 6]] })] }),
  // low on the steps: his boots on the gold edges, the lamp swinging
  TS30(3.2, { cam: [40, 150, -20, 205, .5], to: [46, 116, 0, 212, .46], caps: [[.3, 'Tavi, sixteen.']],
    acts: [TV({ a: [62, 118], lamp: 1, walk: 1, path: [[0, 62, 118], [3.2, 60, 72]], zs: [[0, upA(118)], [3.2, upA(72)]], poses: [[0, ACT.climb, 6]] })] }),
  // the head of the stair: over the painted line, onto their side; he stops
  TS30(3.6, { cam: [-40, 160, 60, 176, .34], to: [-20, 130, 54, 186, .34],
    acts: [TV({ a: [60, 72], lamp: 1, walk: 1, path: [[0, 60, 72], [.8, 60, 56], [2.4, -14, -30], [3.6, -18, -36]], zs: [[0, upA(72)], [.8, 0]], poses: [[0, ACT.climb, 6], [.9, ACT.stand, 5], [2.6, ACT.lookWall, 3]] })] }),
  // his face, at the blank wall. Row K, when he was small
  TS30(3.4, { ...cu(-18, -36, 2.3, 3.0, 8), zooms: [[.3, 3.2, .35]], mems: [[1.1, 2.6, 'row', 0, '255,210,110']], sfxs: [[1.1, 'cutin']],
    acts: [TV({ a: [-18, -36], lamp: 1, fx: -.25, fy: -1, poses: [[0, ACT.lookWall, 3], [2.7, Object.assign({}, ACT.lookWall, { hx: -.3 }), 2]] })] }),
  // the chalk, out of the satchel
  TS30(2.8, { cam: [14, 70, 58, 196, .36], to: [8, 54, 56, 206, .37],
    acts: [TV({ a: [-18, -36], lamp: 1, fx: -.1, fy: -1, path: [[0, -18, -36], [1.8, 2, -44]], poses: [[0, ACT.lookWall, 4], [.5, ACT.chalkIn, 6], [1.8, ACT.chalkUp, 5]] })] }),
  // the ring, three times round. Ashgate Square: the Pillar, where she painted the first one
  TS30(5.2, { tavi: { sun: [[.4, 3.6], [99, 100]] }, cam: [-40, -60 + 200 / 1.7, 46, 200, .55], to: [-34, -60 + 200 / 2.2, 46, 200, .55], mems: [[1.8, 3.3, 'dawn', 0, '255,210,140']], sfxs: [[.5, 'page'], [1.2, 'page'], [3.4, 'page'], [1.8, 'cutin']], fxs: chalkDust(.4, 3.6, 22),
    acts: [TV({ a: [2, -44], lamp: 1, fx: -.35, fy: -1, poses: drawing(.3, 3.7, 10).concat([[3.8, ACT.chalkUp, 4]]) })] }),
  // the rays, one by one; we come off the wall
  TS30(4.4, { tavi: { sun: ['done', [.3, 3.6]] }, cam: [-34, -60 + 200 / 2.6, 46, 200, .55], to: [-26, -60 + 200 / 1.6, 48, 200, .52], sfxs: [[.4, 'page'], [1.5, 'page'], [2.6, 'page']], fxs: chalkDust(.3, 3.6, 10, 1),
    acts: [TV({ a: [2, -44], lamp: 1, fx: -.35, fy: -1, poses: drawing(.2, 3.6, 10).concat([[3.7, ACT.stepBack, 4]]) })] }),
  // he steps back from it, and looks
  TS30(3.4, { tavi: { sun: 'done' }, cam: [-30, -30 + 200 / 1.9, 46, 200, .55], to: [-22, -30 + 200 / 2.6, 47, 200, .55], zooms: [[1.2, 3.3, .4]], sfxs: [[1.6, 'heart']],
    acts: [TV({ a: [2, -44], lamp: 1, fx: -.25, fy: -1, path: [[0, 2, -44], [1.0, 4, -30]], poses: [[0, ACT.stepBack, 5], [1.2, ACT.lookWall, 3]] })] }),
  // and goes on up. The sun stays
  TS30(5.6, { tavi: { sun: 'done' }, cam: [-10, 150, 70, 172, .36], to: [-24, 118, 76, 186, .44], sfxs: [[4.2, 'heart']],
    acts: [TV({ a: [-4, -30], lamp: 1, walk: 1, faceTo: null, path: [[0, -4, -30], [1.0, -46, -42], [5.6, -190, -42]], zs: [[0, 0], [1.0, 0], [5.6, upB(-190)]], faces: [[0, -1, -.1]], poses: [[0, ACT.climb, 5]] })] }),
  { d: 1.4, vd: 1.4, black: 1, caps: [[0, '']] }
];
const TAVI16_FILM = () => ({ bg: 'svc', arena: { kind: 'rect', w: 220, h: 100 }, music: 'hum', cineOnly: 1, film: 1, hero: { id: 'tavi16' }, intro: TAVI16_SHOTS, foes: [] });
const TAVI16 = [{ fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { brawl: () => TAVI16_FILM() }];
const TAVI16_OLD = [{ card: 'NINE YEARS AFTER THE FURNACE', sub: 'The Sun Spire. The service stair. Tavi, sixteen.', big: 1, tr: 'years', min: 1.6, max: 4.5 }, { plate: 'tavi', secs: 10 }];

// ============================================================
// SCENE 25, REBUILT: THE BOOK. At the Pinning the pin closes on his collar and for ten seconds he is somewhere else, nine years on:
// the Count, a book as wide as a table, and one line in it. The game holds one drawing. Here it is a 3D film on a set built for it.
G3.LOOK.count = Object.assign({}, G3.LOOK.hall, { amb: [.44, .4, .4], sunC: [1.25, 1.05, .85], fog: [.1, .08, .07], fogR: [320, 900] });
// (x across, y up, z toward the camera.) A long table under lamps with the book open on it, ledgers to the ceiling behind,
// two tall windows with the sky in them (every room on the fourth ring has a window), a white floor with a gold border.
const BOOK = { y: 26.35, row: (i) => -24 + i * 2.7, x0: 6, x1: 62, red: 8 };
const COUNTSET = (A, S) => {
  const I = M4.id(), GOLD = '#e8c25a', WOOD = '#4a3024', WOOD2 = '#3a241a';
  let sd = 2718; const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296, pick = (L) => L[Math.floor(rnd() * L.length)];
  for (let ix = -8; ix < 8; ix++) for (let iz = -4; iz < 5; iz++) { const k = (ix + iz) & 1; A.quad(ix * 30, iz * 30, ix * 30 + 30, iz * 30 + 30, 0, k ? [.9, .88, .84] : [.84, .82, .78]); }
  A.box(I, 0, .1, -60, 400, .2, 2, GOLD, 1); A.box(I, 0, .1, 90, 400, .2, 2, GOLD, 1);
  // the table, and the book on it
  S.box(I, 0, 24, -8, 150, 3, 50, WOOD); for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.box(I, sx * 68, 11.5, -8 + sz * 20, 4, 23, 4, WOOD2); A.box(I, 0, 25.6, 17.2, 150, .8, .6, GOLD, 1);
  S.box(I, 0, 26, -8, 134, .8, 43, '#5a1e18'); A.box(I, 0, 28.2, -8, .8, .3, 40, [.5, .42, .3], 1); // the binding, and the gutter
  for (const side of [-1, 1]) S.box(I, side * 33, 27.4, -8, 62, 1.4, 38, side > 0 ? '#f4ead0' : '#efe4c8');
  // the ruled lines, a name and two figures on each; struck lines in black; the red line left blank for the hand to find
  for (const side of [-1, 1]) for (let i = 0; i < 14; i++) { const z = BOOK.row(i), y = BOOK.y + (side > 0 ? 1.9 : 1.9) + .02; const xa = side > 0 ? BOOK.x0 : -62, xb = side > 0 ? BOOK.x1 : -6;
    A.box(I, (xa + xb) / 2, y - .05, z + 1, xb - xa, .05, .12, [.8, .74, .6], 1);
    if (side > 0 && i === BOOK.red) continue;
    const n = 2 + ((i * 7 + side * 3 + 9) % 3); let x = xa + 1.5; for (let j = 0; j < n; j++) { const len = 3 + rnd() * 6; A.box(I, x + len / 2, y, z, len, .06, .5, [.24, .2, .22], 1); x += len + 1.4; }
    for (const c of [.66, .84]) A.box(I, xa + (xb - xa) * c + 2, y, z, 4, .06, .5, [.24, .2, .22], 1);
    if ((i * 5 + (side > 0 ? 2 : 0)) % 6 === 0) A.box(I, (xa + xb) / 2 - 6, y + .03, z - .1, (xb - xa) * .6, .05, .22, [.06, .04, .05], 1); }
  // the red line: his own name. Nobody has struck it
  { const z = BOOK.row(BOOK.red), y = BOOK.y + 1.95; A.box(I, BOOK.x0 + 10, y, z, 17, .07, .7, [.75, .12, .1], 1); A.box(I, BOOK.x0 + 10, y, z + 1.1, 20, .06, .18, [.75, .12, .1], 1); }
  // an inkwell, a blotter, a lamp on the table
  S.cyl(I, 56, 26, 8, 2.6, 2.2, 4, 8, '#1e1a22'); S.box(I, -50, 26, 10, 20, .6, 12, '#2a3a2e'); S.cyl(I, -64, 26, -24, 4, 3, 2, 8, '#6a5a40'); S.cyl(I, -64, 28, -24, 1, 1, 16, 6, '#6a5a40'); A.box(I, -64, 46, -24, 7, 7, 7, [1, .86, .55], 1);
  // the back wall: ledgers from floor to ceiling, a ladder, two windows
  S.box(I, 0, 100, -102, 420, 220, 4, '#e8e2d4');
  for (let sh = 0; sh < 11; sh++) { const y = 6 + sh * 18; S.box(I, 0, y - 1, -96, 400, 1.6, 10, WOOD); for (let x = -196; x < 196;) { const w = 2.4 + rnd() * 2.2, h = 11 + rnd() * 4; if (Math.abs(x + 80) < 26 && y > 40 || Math.abs(x - 80) < 26 && y > 40) { x += w; continue; } S.box(I, x + w / 2, y + h / 2, -96, w, h, 8, pick(['#5a1e18', '#3a2a22', '#4a3a24', '#22303a', '#5a4a2a', '#6a2a1e'])); if (rnd() < .3) A.box(I, x + w / 2, y + h * .7, -91.9, w * .8, .6, .2, GOLD, 1); x += w + .2; } }
  for (const wx of [-80, 80]) { A.box(I, wx, 120, -99.5, 46, 150, 1, [.72, .84, 1], 1); for (const dx of [-11.5, 11.5]) S.box(I, wx + dx, 120, -98, 1.4, 150, 2, '#e8e2d4'); S.box(I, wx, 120, -98, 46, 1.4, 2, '#e8e2d4'); S.box(I, wx, 45, -98, 52, 4, 6, GOLD); S.box(I, wx, 196, -98, 52, 4, 6, GOLD);
    A.box(I, wx - 4, 160, -99.2, 18, 4, .4, [1, 1, 1], 1); A.box(I, wx + 8, 150, -99.2, 12, 3, .4, [1, 1, 1], 1); }
  { const lm = M4.chain(M4.t(150, 0, -88), M4.rz(-.18)); for (const dx of [-6, 6]) S.box(lm, dx, 90, 0, 1.6, 180, 1.6, WOOD); for (let k = 0; k < 14; k++) S.box(lm, 0, 8 + k * 12, 0, 12, 1.2, 1.2, WOOD); }
  // side walls and the ceiling, with two hanging lamps over the book
  for (const sx of [-1, 1]) S.box(I, sx * 210, 100, 0, 4, 220, 210, '#e2dccc');
  S.box(I, 0, 214, 0, 430, 6, 220, '#d8d2c2');
  for (const lx of [-30, 30]) { S.cyl(I, lx, 150, -8, .4, .4, 64, 4, '#3a3a40'); S.cyl(I, lx, 140, -8, 9, 3, 10, 8, '#2a2a30'); A.box(I, lx, 138, -8, 8, 2, 8, [1, .9, .66], 1); }
};
{ const env2 = G3.env; G3.env = function (bg) { if (bg !== 'count' || !this.gl) return env2.call(this, bg); if (this.envs.count) return this.envs.count;
    const A = new Batch(30000), S = new Batch(30000); COUNTSET(A, S); const gl = this.gl;
    const mk = B => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, B.a.subarray(0, B.n * 9), gl.STATIC_DRAW); return { b, n: B.n }; };
    return this.envs.count = { a: mk(A), s: mk(S), hw: 110, hh: 200 }; }; }   // hh puts the game's two field flags behind the shelves

// the hand on the page: a white cuff with gold at the wrist, a brown glove, the pen. It travels down the right-hand column
const drawHand = (x, z, lift, tilt) => { const D = G3.dyn, y = BOOK.y + 2 + lift, m = M4.chain(M4.t(x, y, z), M4.ry(.5), M4.rx(-.5 + (tilt || 0)), M4.s(.72));
  D.box(m, 0, 0, -11, 4.2, 4.2, 9, '#f3ead4'); D.box(m, 0, 0, -6.4, 4.5, 4.5, 1.2, '#e2b84a', 1); D.box(m, 0, .2, -3.2, 3.6, 3, 5, '#6a5a44'); D.box(m, .9, -.6, -.2, 1.2, 1.2, 3, '#6a5a44');
  D.box(M4.chain(m, M4.rx(.9)), .6, 3.2, 1.6, .6, 9, .6, '#1a1016'); D.box(M4.chain(m, M4.rx(.9)), .6, -1.2, 1.6, .5, 1.2, .5, '#e2b84a', 1); };
{ const f2 = Brawl.fighter; Brawl.fighter = function (g, o, opt) { const r = f2.call(this, g, o, opt), k = opt && (opt.key && (opt.key.act || opt.key)), c = this.cine, s = c && c.shots[c.i];
    if (k && k.id === 'kaelc' && s && s.pen) { const P = s.pen, t = c.t; let [A, B, u] = kq(P, t); const row = A[1] + (B[1] - A[1]) * u, x = A[2] + (B[2] - A[2]) * u, lift = A[3] + (B[3] - A[3]) * u; drawHand(x, BOOK.row(row) + 1.2, lift, Math.sin(t * 9) * .05 * (lift < 1 ? 1 : 0));
      if (s.redGlow) G3.glow(BOOK.x0 + 10, BOOK.y + 2.4, BOOK.row(BOOK.red), 10 + s.redGlow * Math.sin(t * 3) * 2, [1, .3, .2], .3 * s.redGlow); }
    if (k && k.id === 'kaelc' && s && s.bg0 === 'count') { for (const lx of [-30, 30]) G3.glow(lx, 136, -8, 30, [1, .86, .6], .35); G3.glow(-64, 46, -24, 16, [1, .8, .5], .5); }
    return r; }; }
const KC = (o) => Object.assign({ id: 'kaelc', blade: 0, fx: 0, fy: 1 }, o);
const TB = (d, o) => Object.assign({ d, vd: d, sec: 1, drift: 1, noprops: 1, bg0: 'count', caps: [[0, '']] }, o);
Object.assign(ACT, {
  read: { cr: 1.6, lean: .38, tw: 0, hx: .62, hy: 0, rp: -.55, ry: .25, re: -1.05, lp: -.4, ly: -.2, le: -1.0, hl: .2, kl: .2, hr: -.1, kr: .15, sp: .1 },
  readStill: { cr: 1.8, lean: .42, tw: .04, hx: .72, hy: .06, rp: -.55, ry: .25, re: -1.05, lp: -.35, ly: -.25, le: -1.1, hl: .2, kl: .22, hr: -.1, kr: .15, sp: .1 },
  upright: { cr: .6, lean: .02, tw: 0, hx: -.05, rp: -.2, ry: .2, re: -1.3, lp: -.2, ly: -.2, le: -.9, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .1 }
});
// the pen: [t, row, x, lift]
const PEN = [[0, 1.2, 22, 3], [1.0, 1.4, 20, .6], [2.2, 3, 18, .6], [3.4, 4.6, 16, .7], [4.6, 6.2, 16, .6], [5.6, 7.6, 14, .8], [6.4, 8, 13, .9]];
const BOOK25_SHOTS = [
  // the Count hall: the book, the lamps, the shelves to the ceiling; a man bent over the page
  TB(5.4, { bg: 'count', music: 'hum', cam: [-20, 210, 96, 160, .4], to: [6, 110, 62, 176, .42], sfxs: [[.2, 'heart'], [3.2, 'heart']],
    caps: [[.5, 'NINE YEARS AFTER THE FURNACE.'], [2.8, 'The Count. A book as wide as a table.']],
    acts: [KC({ a: [16, -44], poses: [[0, ACT.read, 4], [3, ACT.readStill, 2]] })] }),
  // across the page, low: the ruled lines, the names, the figures, the lines that have been struck
  TB(4.6, { cam: [-44, 2, 96, 120, -4], to: [4, -2, 84, 126, -4], pen: [[0, 1.2, 22, 3], [4.6, 2.4, 20, .6]],
    acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3]] })] }),
  // from above, the hand going down the column. The Count, as it was: balanced, balanced, balanced
  TB(6.6, { cam: [30, 2, 120, 120, -4], to: [24, -2, 96, 126, -4], pen: PEN, mems: [[2.2, 3.9, 'ledger', 1, '255,120,90']], sfxs: [[1.0, 'page'], [2.2, 'cutin'], [4.6, 'page']],
    acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3]] })] }),
  // the red line. His own name. Nobody has struck it
  TB(4.0, { cam: [22, 4, 76, 130, -4], to: [20, 2, 64, 140, -4], redGlow: 1, pen: [[0, 8, 13, .9], [1.6, 8, 12, .5], [4, 8, 12, 1.4]], sfxs: [[.4, 'heart'], [2.4, 'heart']],
    caps: [[.6, 'Brennick, K.']], acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3]] })] }),
  // his face over it. The furnace door, for a breath
  TB(3.6, { ...cu(16, -44, 2.4, 3.2, -6), zooms: [[.4, 3.4, .35]], mems: [[1.4, 2.4, 'furnace', 1, '255,90,30']], sfxs: [[1.4, 'cutin']], redGlow: 1,
    acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3], [2.5, Object.assign({}, ACT.readStill, { hx: .5 }), 2]] })] }),
  // the pen over the line, not moving
  TB(3.4, { cam: [34, 34, 50, 210, .7], to: [28, 28, 48, 216, .72], pen: [[0, 8, 12, 1.4], [3.4, 8, 12, 1.6]], redGlow: 1, sfxs: [[1.6, 'heart']],
    acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3]] })] }),
  // and back, high: the hall, the book, the man who has not moved
  TB(5.2, { cam: [6, 110, 62, 176, .42], to: [0, 230, 110, 162, .4], pen: [[0, 8, 12, 1.6]], redGlow: .6, sfxs: [[3.6, 'heart']],
    acts: [KC({ a: [16, -44], poses: [[0, ACT.readStill, 3], [2.6, ACT.upright, 1.5]] })] }),
  { d: 1.2, vd: 1.2, black: 1, caps: [[0, '']] }
];
const BOOK25_FILM = () => ({ bg: 'count', arena: { kind: 'rect', w: 220, h: 100 }, music: 'hum', cineOnly: 1, film: 1, hero: { id: 'kaelc' }, intro: BOOK25_SHOTS, foes: [] });
const BOOK25 = [{ fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { brawl: () => BOOK25_FILM() }];
const BOOK25_OLD = [{ card: 'NINE YEARS AFTER THE FURNACE', sub: 'The Count. A book as wide as a table.', big: 1, tr: 'years', min: 1.6, max: 4.5 }, { plate: 'book', secs: 10 }];

// ============================================================
// SCENE 23, REBUILT: THE SEAT KNIFE. Four years after the furnace, the night before the lift. Brand puts the end of the
// Auditor's blade in a forge and turns it into a valve hand's hook. A 3D film on a set built for it: Brand's sealed pump room.
CAST.kaelg = { name: 'Kael', look: () => ({ skin: KAEL_LOOK.skin, hair: '#e9cf7a', style: 'spiky', armor: '#3d5a6a', trim: '#24323c', sash: '#b8682a', shirt: '#3d5a6a', pants: '#2a3440' }) };
CAST.brand3 = { name: 'Brand', look: () => ({ skin: '#b88a6a', hair: '#8a8a8a', style: 'short', armor: '#6a4a32', trim: '#3a2a1e', sash: '#2a2c34', shirt: '#4a4e58', pants: '#2a2c34' }) };
G3.LOOK.forge = Object.assign({}, G3.LOOK.hall, { amb: [.3, .26, .28], sunC: [1.0, .7, .5], fog: [.05, .03, .03], fogR: [260, 700] });
const ANV = { x: 0, y: 19, z: 0 }, HEARTH = { x: -62, y: 21, z: -46 }, TROUGH = { x: 48, y: 11.5, z: -20 };
const FORGESET = (A, S) => {
  const I = M4.id(); let sd = 1306; const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let ix = -6; ix < 6; ix++) for (let iz = -4; iz < 3; iz++) { const j = rnd() * .04; A.quad(ix * 28, iz * 28, ix * 28 + 28, iz * 28 + 28, 0, [.26 + j, .23 + j, .22 + j]); }
  // the room: old stone, a sealed pump the size of a lift car, pipes, a valve wheel
  S.box(I, 0, 90, -104, 360, 180, 4, '#2e2a2a'); for (let r = 0; r < 13; r++) for (let c = 0; c < 12; c++) { const x = -170 + c * 30 + (r & 1) * 15, y = 6 + r * 13, t = rnd(); S.box(I, x, y, -101.6, 29, 12, 1, t > .6 ? '#3e3836' : t > .3 ? '#38322f' : '#433c39'); }
  for (const sx of [-1, 1]) S.box(I, sx * 170, 90, -10, 4, 180, 190, '#2a2626');
  S.box(I, 0, 178, -10, 360, 4, 190, '#1e1a1a');
  S.cyl(I, 104, 0, -70, 24, 24, 96, 12, '#5a4a3c', 0, 1); S.cyl(I, 104, 96, -70, 27, 20, 8, 12, '#4a3c30', 0, 1); for (const h of [20, 50, 80]) S.cyl(I, 104, h, -70, 25, 25, 2.4, 12, '#8a6a40', 0, 1);
  S.cyl(M4.chain(M4.t(80, 130, -86), M4.rz(Math.PI / 2)), 0, 0, 0, 4, 4, 240, 7, '#6a5240'); S.cyl(I, 128, 96, -70, 4, 4, 40, 7, '#6a5240');
  { const wm = M4.chain(M4.t(104, 60, -45), M4.rx(Math.PI / 2)); S.cyl(wm, 0, 0, 0, 11, 11, 1.8, 12, '#a8452a'); for (let q = 0; q < 3; q++) S.box(M4.chain(M4.t(104, 60, -44.6), M4.rz(q * 1.047)), 0, 0, 0, 21, 1.6, 1.4, '#a8452a'); }
  A.box(I, 104, 44, -45.6, 30, 5, .4, [.9, .8, .5], 1);   // the old stencil on the pump: SEALED
  // the forge: a brick hearth, a coal bed, a hood and its flue
  S.box(I, HEARTH.x, 9, HEARTH.z, 44, 18, 30, '#5a3026'); for (let k = 0; k < 4; k++) S.box(I, HEARTH.x, 3 + k * 4.4, HEARTH.z + 15.2, 44, .5, .4, '#3a1e18');
  A.box(I, HEARTH.x, 18.6, HEARTH.z, 30, 1.2, 20, [1, .46, .14], 1); for (let k = 0; k < 14; k++) A.box(I, HEARTH.x - 13 + rnd() * 26, 19.6, HEARTH.z - 8 + rnd() * 16, 3, 1.2, 3, [1, .7 + rnd() * .2, .3], 1);
  S.box(I, HEARTH.x, 52, HEARTH.z - 4, 40, 4, 26, '#3a3232'); S.box(I, HEARTH.x, 44, HEARTH.z + 8, 40, 14, 2, '#3a3232'); S.cyl(I, HEARTH.x, 54, HEARTH.z - 6, 6, 6, 130, 8, '#3a3232');
  // the anvil, its horn pointing at the trough; the trough of water; tongs on a nail; a hammer on the block
  S.box(I, ANV.x, 5, ANV.z, 16, 10, 14, '#4a3a2e'); S.box(I, ANV.x, 12.5, ANV.z, 8, 5, 8, '#3a3a40'); S.box(I, ANV.x, 17, ANV.z, 22, 4, 8, '#4a4a52'); A.box(I, ANV.x - 1, 19.05, ANV.z, 20, .1, 7.6, [.62, .62, .66], 1);
  S.cyl(M4.chain(M4.t(ANV.x + 11, 17.5, ANV.z), M4.rz(-Math.PI / 2)), 0, 0, 0, 3.4, .3, 12, 8, '#4a4a52');
  S.box(I, TROUGH.x, 6, TROUGH.z, 32, 12, 16, '#3a2e24'); A.box(I, TROUGH.x, TROUGH.y, TROUGH.z, 29, .3, 13, [.1, .2, .3], 1);
  S.box(I, -100, 50, -98, 2, 26, 2, '#2a2a30'); S.box(I, -104, 38, -98, 2, 26, 2, '#2a2a30');
  // a lamp on a chain over the anvil
  S.cyl(I, 0, 100, 0, .4, .4, 78, 4, '#3a3a40'); S.cyl(I, 0, 92, 0, 6, 2, 8, 8, '#2a2a30'); A.box(I, 0, 91, 0, 5, 2, 5, [1, .86, .58], 1);
};
{ const env3 = G3.env; G3.env = function (bg) { if (bg !== 'forge' || !this.gl) return env3.call(this, bg); if (this.envs.forge) return this.envs.forge;
    const A = new Batch(20000), S = new Batch(20000); FORGESET(A, S); const gl = this.gl;
    const mk = B => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, B.a.subarray(0, B.n * 9), gl.STATIC_DRAW); return { b, n: B.n }; };
    return this.envs.forge = { a: mk(A), s: mk(S), hw: 110, hh: 200 }; }; }

// the blade: their straight steel with a grip; the end turns over into our hook as `hook` goes 0 to 1; `heat` 0 to 1 colours the end
const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const drawBlade = (x, y, z, ry, rz, heat, hook) => { const D = G3.dyn, m = M4.chain(M4.t(x, y, z), M4.ry(ry), M4.rz(rz || 0)), steel = [.9, .88, .82], hot = [1, .5, .16];
  D.box(m, -4.5, 0, 0, 8, 1.5, 1.4, '#2a1e18'); D.box(m, -.3, 0, 0, 1.2, 3.6, 1.6, '#e2b84a', 1);
  const L = 26 - 6 * hook; D.box(m, L / 2, 0, 0, L, 2, .45, mixc(steel, hot, heat * .6), heat > .4 ? 1 : 0);
  let px = L, py = 0, a = 0; for (let i = 0; i < 5; i++) { const seg = 1.9, na = a + hook * .62; const cx = px + Math.cos(na) * seg / 2, cy = py + Math.sin(na) * seg / 2; D.box(M4.chain(m, M4.t(cx, cy, 0), M4.rz(na)), 0, 0, 0, seg + .3, 2 - i * .2, .45, mixc(steel, hot, heat), heat > .2 ? 1 : 0); px += Math.cos(na) * seg; py += Math.sin(na) * seg; a = na; }
  if (heat > .05) { const w = M4.chain(m, M4.t(px - 3, py / 2, 0)); G3.glow(w[12], w[13], w[14], 5 + 8 * heat, [1, .5, .15], .7 * heat); }
  return [px, py]; };
const drawTongs = (x, y, z) => { const D = G3.dyn; for (const s of [-1, 1]) D.box(M4.chain(M4.t(x - 10, y + s * .6, z + s * .3), M4.rz(s * .04)), 0, 0, 0, 18, .7, .7, '#2a2a30'); };
const drawHammer = (x, y, z) => { const D = G3.dyn; D.box(M4.t(x, y + 2, z), 0, 0, 0, 6, 4, 4, '#3a3a42'); D.box(M4.chain(M4.t(x + 2, y + 9, z), M4.rz(-.35)), 0, 0, 0, 1.1, 14, 1.1, '#6a4a30'); };
const hamLift = (t, S) => { let best = 9; for (const s of S) { const d = t - s; if (Math.abs(d) < Math.abs(best)) best = d; } const d = best; return d < 0 && d > -.45 ? 15 * Math.sin(Math.PI * (-d) / .45 * .5 + .0) * (1 - Math.max(0, (-d - .3) / .15)) : d >= 0 && d < .18 ? 1.5 * (1 - d / .18) : 5; };
{ const f3 = Brawl.fighter; Brawl.fighter = function (g, o, opt) { const r = f3.call(this, g, o, opt), k = opt && (opt.key && (opt.key.act || opt.key)), c = this.cine, s = c && c.shots[c.i];
    if (k && k.id === 'kaelg' && s && s.forge) { const F = s.forge, t = c.t, tt = this.t;
      if (F.blade) { const [A, B, u] = kq(F.blade, t), V = (i) => A[i] + (B[i] - A[i]) * u, tip = drawBlade(V(1), V(2), V(3), V(4), V(5), V(6), V(7)); if (F.tongs) drawTongs(V(1), V(2), V(3));
        if (F.glintAt !== undefined && t > F.glintAt && t < F.glintAt + .8) { const a = Math.sin(Math.PI * (t - F.glintAt) / .8), m = M4.chain(M4.t(V(1), V(2), V(3)), M4.ry(V(4)), M4.rz(V(5))), w = M4.chain(m, M4.t(tip[0], tip[1], 0)); G3.glow(w[12], w[13], w[14], 4 + 16 * a, [1, .95, .8], .9 * a); G3.glow(w[12], w[13], w[14], 2 + 6 * a, [1, 1, 1], a); } }
      if (F.strikes && F.hammer) drawHammer(ANV.x + 4, ANV.y + .8 + hamLift(t, F.strikes), ANV.z);
      G3.glow(HEARTH.x, HEARTH.y + 2, HEARTH.z, 34 + Math.sin(tt * 6) * 3, [1, .45, .12], .55); G3.glow(HEARTH.x, HEARTH.y + 14, HEARTH.z, 50, [1, .5, .2], .18); G3.glow(0, 90, 0, 26, [1, .84, .56], .3); }
    return r; }; }
const KG = (o) => Object.assign({ id: 'kaelg', blade: 0, a: [-20, -4], fx: 1, fy: .15 }, o), BR = (o) => Object.assign({ id: 'brand3', blade: 0, a: [20, -6], fx: -1, fy: .15 }, o);
const TK = (d, o) => Object.assign({ d, vd: d, sec: 1, drift: 1, noprops: 1, caps: [[0, '']] }, o);
Object.assign(ACT, {
  tongs: { cr: 1.6, lean: .3, tw: 0, hx: .45, rp: -1.0, ry: .1, re: -.7, lp: -1.0, ly: -.1, le: -.7, hl: .3, kl: .4, hr: -.2, kr: .3, sp: .14 },
  hamUp: { cr: 1.4, lean: .1, tw: -.25, hx: .35, rp: -2.7, ry: .2, re: -1.6, lp: -.5, ly: -.3, le: -1.0, hl: .3, kl: .4, hr: -.3, kr: .4, sp: .16 },
  hamDown: { cr: 2.0, lean: .4, tw: .15, hx: .5, rp: -.5, ry: .1, re: -.3, lp: -.5, ly: -.3, le: -1.0, hl: .4, kl: .5, hr: -.3, kr: .5, sp: .16 },
  arms: { cr: .5, lean: 0, tw: 0, hx: .05, lp: -.9, ly: .7, le: -1.6, rp: -.9, ry: -.7, re: -1.6, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .12 },
  holdUp: { cr: .4, lean: -.05, tw: 0, hx: -.1, rp: -1.5, ry: .25, re: -1.3, lp: -.4, ly: -.2, le: -.9, hl: .1, kl: .1, hr: -.1, kr: .1, sp: .1 }
});
const hammerPoses = (S) => S.flatMap(s => [[s - .45, ACT.hamUp, 22], [s - .08, ACT.hamDown, 40]]);
const strikeFx = (S) => S.flatMap(s => [[s, 'spark', ANV.x + 8, ANV.z, '#ffd27a', 12, ANV.y + 1], [s, 'kick', .03]]);
const AB = (h, heat) => [ANV.x - 6, ANV.y + 1, ANV.z, 0, 0, heat, h];   // the blade lying on the anvil, its end over the horn
const S9 = [.9, 1.8, 2.7, 3.6, 4.5, 5.4, 6.3], S10 = [.4, 1.2, 2.0, 2.8];
// cut to Kael's read: every shot starts where its words start in the audio (va, seconds). The take stops at 100.4 s, after
// "It is still their steel."; the shots after that keep the same clock and show their words as captions until it is re-recorded.
const TV2 = (va, ve, o) => VS(va, ve, Object.assign({ noprops: 1, caps: [[0, '']] }, o));
const FB = [HEARTH.x + 8, HEARTH.y + 1.2, HEARTH.z, 0, 0];   // the blade lying in the coals
const S9v = [1.0, 2.1, 3.2, 4.3, 5.4, 6.5, 7.6, 8.7, 9.8], S10v = [.5, 1.4, 2.3, 3.2];
const KNIFE23_SHOTS = [
  TV2(0, 4.4, { bg: 'forge', music: 'mystery', forge: { blade: [[0, ...AB(0, 0)]] }, cam: [-10, 170, 78, 170, .36], to: [0, 120, 56, 178, .36], sfxs: [[.2, 'heart']],
    caps: [[0, 'Four years after the furnace.'], [2.5, 'The night before the lift.']], acts: [KG({ poses: [[0, ACT.stand, 5]] }), BR({ poses: [[0, ACT.arms, 5]] })] }),
  TV2(4.4, 10.4, { forge: { blade: [[0, ...AB(0, 0)]] }, cam: [-6, 66, 32, 200, .46], to: [2, 54, 30, 206, .46],
    caps: [[.1, 'The night before I went up as Edric Sorrel, Brand took the blade the High Auditor had pinned on me with the sun,']], acts: [KG({ poses: [[0, ACT.stand, 5]] }), BR({ poses: [[0, ACT.arms, 5]] })] }),
  TV2(10.4, 12.9, { forge: { blade: [[0, ...AB(0, 0)], [.8, -30, 30, -20, 0, .2, 0, 0], [1.6, ...FB, .3, 0], [2.5, ...FB, .9, 0]] }, cam: [-40, 40, 46, 200, .4], to: [-54, 20, 44, 206, .42], sfxs: [[1.6, 'clink']],
    caps: [[.1, 'and put the last hand of it in a forge.']], acts: [KG({ path: [[0, -20, -4], [1.6, 6, -10]], faceTo: null, faces: [[0, 1, -.3], [1.6, -.6, -.4]], walk: 1, poses: [[0, ACT.stand, 5]] }), BR({ path: [[0, 20, -6], [1.5, -26, -24]], faceTo: null, faces: [[0, -1, -.4]], walk: 1, poses: [[0, ACT.stand, 5], [1.6, ACT.tongs, 6]] })] }),
  TV2(12.9, 20.9, { forge: { blade: [[0, ...FB, .9, 0]] }, ...cu(-26, -24, 2.4, 3.0, 10), zooms: [[5.6, 7.8, .3]],
    caps: [[.1, 'Brand said: “They gave you a ruler. Straight, so that it can be counted.”'], [6.1, '“What did you carry below?”']], acts: [KG({ a: [6, -10], fx: -.6, fy: -.4, poses: [[0, ACT.stand, 5]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.tongs, 5], [5.8, Object.assign({}, ACT.stand, { hx: -.05, hy: -.3 }), 3]] })] }),
  TV2(20.9, 31.6, { forge: { blade: [[0, ...FB, 1, 0]] }, ...cu(6, -10, 2.3, 3.0, 10), zooms: [[5.5, 10.4, .3]],
    caps: [[.5, 'I said: “A seat knife. Every valve hand is issued one.”'], [5.7, '“A hooked blade the length of your palm, for cutting a seized seat out of a valve body.”']], acts: [KG({ a: [6, -10], fx: -.3, fy: .9, poses: [[0, ACT.stand, 5], [5.7, Object.assign({}, ACT.stand, { rp: -1.0, re: -1.4, ry: -.3 }), 4], [9.2, ACT.stand, 3]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5]] })] }),
  TV2(31.6, 35.9, { forge: { blade: [[0, ...FB, 1, 0]] }, mems: [[.4, 3.9, 'pipe', 0, '255,170,70']], sfxs: [[.4, 'cutin']], cam: [-20, 90, 48, 200, .4], to: [-16, 80, 46, 204, .4],
    caps: [[.3, 'It is the only edge soot are allowed. They are numbered.']], acts: [KG({ a: [6, -10], fx: -.6, fy: -.4, poses: [[0, ACT.stand, 5]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5]] })] }),
  TV2(35.9, 44.8, { forge: { blade: [[0, ...FB, 1, 0]] }, cam: [-58, 30, 40, 200, .42], to: [-50, 4, 40, 214, .44],
    caps: [[.3, 'At last bell the knives are counted back onto a board, and a hook left empty on that board is a line struck by morning.']], acts: [KG({ a: [6, -10], fx: -.6, fy: -.4, poses: [[0, ACT.stand, 5]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5]] })] }),
  TV2(44.8, 53.6, { forge: { blade: [[0, ...FB, 1, 0]] }, ...cu(6, -10, 2.0, 2.6, 8), mems: [[3.0, 5.2, 'furnace', 1, '255,90,30']], sfxs: [[3.0, 'cutin']],
    caps: [[1.3, 'Seren’s was taken off her the night they walked her.'], [5.4, 'I saw it afterwards, in the Warden’s tray.']], acts: [KG({ a: [6, -10], fx: -.3, fy: .9, poses: [[0, ACT.stand, 5], [5.6, Object.assign({}, ACT.stand, { hx: .3 }), 3]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5]] })] }),
  TV2(53.6, 62.5, { forge: { blade: [[0, ...FB, 1, 0]] }, ...cu(6, -10, 2.6, 3.3, 8), zooms: [[3.6, 8.6, .4]], sfxs: [[.6, 'heart'], [6.8, 'heart']],
    caps: [[.8, 'Number three hundred and six.'], [3.8, 'Somebody had cleaned it.'], [6.9, 'Nobody hung it back.']], acts: [KG({ a: [6, -10], fx: -.3, fy: .9, poses: [[0, ACT.stand, 5], [3.6, ACT.washerUp, 4], [6.6, ACT.washer, 3]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5]] })] }),
  TV2(62.5, 73.0, { forge: { blade: [[0, ...FB, 1, 0]] }, ...cu(-26, -24, 2.3, 2.9, 10), zooms: [[6.8, 10.4, .3]],
    caps: [[1.4, 'Brand said: “I counted that board for eleven years.”'], [7.7, '“I never once asked what the knives were for.”']], acts: [KG({ a: [6, -10], fx: -.6, fy: -.4, poses: [[0, ACT.stand, 5]] }), BR({ a: [-26, -24], fx: .7, fy: .7, poses: [[0, ACT.stand, 5], [7.5, Object.assign({}, ACT.stand, { hx: .35 }), 3]] })] }),
  TV2(73.0, 76.8, { forge: { blade: [[0, ...FB, 1, 0], [2.0, ...FB, 1, 0], [2.9, -20, 30, -14, 0, .2, 1, 0], [3.8, ...AB(0, 1)]] }, cam: [-24, 130, 60, 176, .36], to: [-10, 110, 54, 184, .36], sfxs: [[3.6, 'clink']],
    caps: [[1.8, '“Hold the tongs.”']], acts: [KG({ a: [6, -10], path: [[0, 6, -10], [1.4, -14, -2]], faceTo: null, faces: [[0, -1, .2], [1.4, 1, .1]], walk: 1, poses: [[0, ACT.stand, 5], [3.2, ACT.tongs, 6]] }),
           BR({ a: [-26, -24], path: [[0, -26, -24], [1.6, -26, -24], [2.6, 0, -30], [3.8, 16, -6]], faceTo: null, faces: [[0, 1, -.2], [3.0, -1, .15]], walk: 1, poses: [[0, ACT.tongs, 6], [3.6, ACT.arms, 5]] })] }),
  TV2(76.8, 87.3, { forge: { blade: [[0, ...AB(0, 1)], [10.5, ...AB(.7, .9)]], tongs: 1, strikes: S9v, hammer: 1 }, cam: [4, 40, 30, 200, .5], to: [8, 34, 28, 206, .5], sfxs: S9v.map(s => [s, 'steel']), fxs: strikeFx(S9v),
    caps: [[.5, 'He drew the point out and turned it over the horn until their blade ended in our hook.']], acts: [KG({ a: [-14, -2], poses: [[0, ACT.tongs, 6]] }), BR({ a: [16, -6], poses: hammerPoses(S9v) })] }),
  TV2(87.3, 90.9, { forge: { blade: [[0, ...AB(.7, .9)], [3.6, ...AB(1, .8)]], tongs: 1, strikes: S10v }, cam: [10, 120, 56, 180, .38], to: [4, 104, 52, 186, .38], sfxs: S10v.map(s => [s, 'steel']), fxs: strikeFx(S10v),
    caps: [[.3, 'It took most of the night.']], acts: [KG({ a: [-14, -2], poses: [[0, ACT.tongs, 6]] }), BR({ a: [16, -6], poses: hammerPoses(S10v).concat([[3.3, ACT.arms, 4]]) })] }),
  TV2(90.9, 94.9, { forge: { blade: [[0, ...AB(1, .8)], [1.2, 20, 30, -12, 0, 0, .8, 1], [2.0, TROUGH.x - 6, TROUGH.y + 1, TROUGH.z, 0, -.4, .8, 1], [2.4, TROUGH.x - 6, TROUGH.y - 3, TROUGH.z, 0, -.4, 0, 1], [4, TROUGH.x - 6, TROUGH.y - 3, TROUGH.z, 0, -.4, 0, 1]], tongs: 1 },
    cam: [40, 60, 36, 200, .44], to: [46, 50, 34, 206, .44], sfxs: [[2.1, 'splash']], fxs: Array.from({ length: 10 }, (_, i) => [2.1 + i * .12, 'spark', TROUGH.x - 4 + (i % 3) * 3, TROUGH.z, '#e8eef4', 4, TROUGH.y + 2]),
    caps: [[.3, 'He did not speak again until it was in the water.']], acts: [KG({ path: [[0, -14, -2], [1.6, 34, -4]], faceTo: null, faces: [[0, 1, .1]], walk: 1, poses: [[0, ACT.tongs, 6]] }), BR({ a: [16, -6], poses: [[0, ACT.arms, 5]] })] }),
  TV2(94.9, 103.4, { forge: { blade: [[0, TROUGH.x - 6, TROUGH.y - 3, TROUGH.z, 0, -.4, 0, 1]] }, ...cu(12, -8, 2.4, 3.0, -10), zooms: [[5.4, 8.4, .3]],
    caps: [[.3, 'Brand said: “It is still their steel.”'], [5.6, '“It will pass any inspection on that Spire.”']], acts: [KG({ a: [40, -2], fx: -.7, fy: .3, poses: [[0, ACT.tongs, 5]] }), BR({ a: [12, -8], fx: .2, fy: 1, poses: [[0, ACT.arms, 5], [5.4, Object.assign({}, ACT.arms, { hx: -.15 }), 3]] })] }),
  TV2(103.4, 107.4, { forge: { blade: [[0, TROUGH.x - 6, TROUGH.y - 3, TROUGH.z, 0, -.4, 0, 1]] }, ...cu(12, -8, 2.8, 3.3, -10),
    caps: [[.2, '“And every time you draw it, you will know which end is yours.”']], acts: [KG({ a: [40, -2], fx: -.7, fy: .3, poses: [[0, ACT.tongs, 5]] }), BR({ a: [12, -8], fx: .2, fy: 1, poses: [[0, Object.assign({}, ACT.arms, { hx: -.15 }), 3]] })] }),
  TV2(107.4, 115.4, { forge: { blade: [[0, TROUGH.x - 6, TROUGH.y - 3, TROUGH.z, 0, -.4, 0, 1], [1.4, 24, 33, 3, -.15, .4, 0, 1], [8, 24, 34, 3, -.15, .5, 0, 1]], glintAt: 3.0 }, ...cu(38, -2, 1.7, 2.2, -12), sfxs: [[3.0, 'clink']],
    caps: [[.6, 'I called it the bank hook, because nobody up there would know what a bank was.'], [4.6, 'I carried it five years. It is the blade she broke.']], acts: [KG({ a: [40, -2], fx: -.4, fy: .9, poses: [[0, ACT.tongs, 5], [1.2, ACT.holdUp, 4]] }), BR({ a: [-6, -16], fx: 1, fy: .3, poses: [[0, ACT.arms, 5]] })] }),
  { d: 1.6, vd: 1.6, black: 1, caps: [[0, '']] }
];
const KNIFE23_FILM = () => ({ voSrc: CH23_VO_SRC, bg: 'forge', arena: { kind: 'rect', w: 220, h: 100 }, music: 'mystery', cineOnly: 1, film: 1, hero: { id: 'kaelg' }, intro: KNIFE23_SHOTS, foes: [] });
const KNIFE23 = [{ fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { brawl: () => KNIFE23_FILM() }];
const KNIFE23_OLD = P2[1]().slice(P2[1]().findIndex(s => s.card === 'THE SEAT KNIFE'), P2[1]().findIndex(s => s.card === 'THE SEAT KNIFE') + 13);

// the preview's own front page: this build exists only to show the cutscene
const CH1_PREVIEW = {
  play(steps) { UI.clear(); freshState('Kael', 0); World.resetSheets(); World.showPlayer = true; Cutscene.play(steps, () => Game.toTitle()); },
  old() { return PROLOGUE_A.filter(s => !s.brawl && !s.noskip && !/^FOUR YEARS AFTER/.test(s.card || '') && !/^Bay Three/.test(s.card || '') && !(s.fx && /Fade\.a = 1/.test(String(s.fx)))); }
};
Menus.title = function () {
  UI.push(modal({ clear: true, onBack: null, build(b) {
    b.innerHTML = '<h1 class="logo">SOOTBORN</h1><div class="sub">Chapter One · Before the Furnace</div><p style="opacity:.75;margin-top:10px">A preview of a new cutscene. This is not the game, and the game has not been changed.</p>';
    b.parentNode.style.background = 'rgba(16,10,13,.82)'; b.parentNode.style.textAlign = 'center';
  }, items: [
    { label: 'Play Chapter One (the Keep, then below, all as film)', act: () => CH1_PREVIEW.play(CH1_KEEP.concat(CH1_FILM)) },
    { label: 'Only the opening: the Keep', act: () => CH1_PREVIEW.play(CH1_KEEP) },
    { label: 'Only the scenes below, as film', act: () => CH1_PREVIEW.play(CH1_FILM) },
    { label: 'Earlier version: the scenes below as a 2D cutscene', act: () => CH1_PREVIEW.play(CH1_NEW) },
    { label: "Compare: the game's current scenes below", act: () => CH1_PREVIEW.play(CH1_PREVIEW.old()) },
    { label: 'Scene 30, rebuilt: Tavi at sixteen (3D film)', act: () => CH1_PREVIEW.play(TAVI16) },
    { label: "Compare: the game's Tavi at sixteen (a drawn still)", act: () => CH1_PREVIEW.play(TAVI16_OLD) },
    { label: 'Scene 25, rebuilt: the book (3D film)', act: () => CH1_PREVIEW.play(BOOK25) },
    { label: "Compare: the game's book (a drawn still)", act: () => CH1_PREVIEW.play(BOOK25_OLD) },
    { label: 'Scene 23, rebuilt: the seat knife (3D film)', act: () => CH1_PREVIEW.play(KNIFE23) },
    { label: "Compare: the game's seat knife (panels)", act: () => CH1_PREVIEW.play(KNIFE23_OLD) },
    { label: 'Settings', act: () => Menus.settings() }
  ] }));
};
