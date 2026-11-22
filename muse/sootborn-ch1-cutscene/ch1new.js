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
  stand: { cr: .5, lean: .02, tw: 0, rp: .1, ry: .2, re: -.15, tilt: -.3, lp: .12, ly: -.15, le: -.25, hl: .12, kl: .1, hr: -.1, kr: .1, sp: .1, hx: .1 },
  ribs: { cr: 3.0, lean: .42, tw: -.1, hx: .55, lp: -.7, ly: -.8, le: -2.0, rp: .25, re: -.25, tilt: -.5, hl: .45, kl: .7, hr: -.4, kr: .55, sp: .2 },
  ribsLow: { cr: 6.0, lean: .7, tw: -.1, hx: .7, lp: -.7, ly: -.8, le: -2.0, rp: .4, re: -.3, tilt: -.4, hl: .8, kl: 1.3, hr: -.5, kr: 1.0, sp: .22 },
  taken: { cr: 2.4, lean: .3, tw: .2, hx: .5, rp: .2, re: -.4, tilt: -.5, lp: -.3, le: -.8, hl: .4, kl: .6, hr: -.3, kr: .5, sp: .2 },
  shove: { cr: 3.4, lean: .55, tw: .5, rp: -.4, ry: .3, re: -1.3, tilt: -1.2, lp: -1.3, ly: .2, le: -1.6, hl: .9, kl: 1.0, hr: -.6, kr: .7, hx: -.1 },
  spent: { cr: 4.6, lean: .5, tw: .1, hx: .55, rp: .5, re: -.3, tilt: -.2, lp: .2, le: -.5, hl: .7, kl: 1.0, hr: -.4, kr: .8, sp: .2 }
});
const VS = (va, ve, o) => Object.assign({ va, vd: ve - va, d: ve - va, sec: 1 }, o);
const L = (o) => Object.assign({ id: 'lucan', blade: 1, fx: -1, fy: .2 }, o), K = (o) => Object.assign({ id: 'kael2', blade: 1, fx: 1, fy: -.2 }, o);
// the count: blow n lands with Lucan at lx(n), Kael at kx(n); his guard is lower every time
const lx = (n) => 30 + 2.2 * n, kx = (n) => 5 + 2.2 * n, guardOf = (n) => n < 4 ? ACT.beaten1 : n < 8 ? ACT.beaten2 : ACT.beaten3;
const blow = (va, ve, n, word, camo) => VS(va, ve, Object.assign({ big: word, bigC: '#ff8a3c', tint: 'rgba(120,10,0,.16)', sfxs: [[.1, 'heart'], [.24, 'hit']], shakes: [[.24, .28]], fxs: [[.23, 'spark', (lx(n) + kx(n)) / 2 + 5, -4, '#ffe9a0', 12, 30], [.23, 'spark', (lx(n) + kx(n)) / 2 + 5, -4, '#ff8a3c', 6, 28], [.23, 'kick', .07]].concat(n === 10 ? [[.23, 'ring', lx(n), -5, '#ffe08a', 60]] : []),
  acts: [L({ a: [lx(n - 1), -5], faceTo: 'kael2', path: [[0, lx(n - 1), -5], [.24, lx(n - 1), -5], [.5, lx(n), -5]], poses: [[0, guardOf(n), 16]].concat(n === 10 ? [[.45, ACT.kneelUp, 10]] : []), sts: [[.24, 'hurt', { dur: .2, kx: 70, ky: -8 }]] }),
         K({ a: [kx(n - 1), -3], aura: 4, faceTo: 'lucan', path: [[0, kx(n - 1), -3], [.3, kx(n), -3]], poses: [[0, ACT.ready, 16]], sts: [[.08, 'atk', { dur: .36, combo: 1 + (n % 3) }]] })] }, camo));
const side = (n, h) => ({ cam: [(lx(n) + kx(n)) / 2 - 6, 138, h || 54, 182, .33], to: [(lx(n) + kx(n)) / 2 - 2, 128, (h || 54) - 2, 190, .33], lin: 1 });
// the four blows nobody counts, under the whisper
const quiet4 = (va, ve, T) => VS(va, ve, { cam: [(lx(4) + kx(4)) / 2 - 10, 170, 66, 170, .33], to: [(lx(7) + kx(7)) / 2, 140, 56, 184, .33], lin: 1, tint: 'rgba(120,10,0,.16)',
  sfxs: T.flatMap(t => [[t, 'heart'], [t + .16, 'hit']]), shakes: T.map(t => [t + .16, .22]), fxs: T.flatMap((t, i) => [[t + .15, 'spark', (lx(4 + i) + kx(4 + i)) / 2 + 5, -4, '#ffe9a0', 12, 30], [t + .15, 'kick', .05]]),
  acts: [L({ a: [lx(3), -5], faceTo: 'kael2', path: [[0, lx(3), -5]].concat(T.flatMap((t, i) => [[t + .16, lx(3 + i), -5], [t + .45, lx(4 + i), -5]])).concat([[ve - va, lx(7), -5]]), poses: [[0, ACT.beaten1, 16], [T[0] + .2, ACT.beaten2, 6]], sts: T.map(t => [t + .16, 'hurt', { dur: .2, kx: 70, ky: -8 }]) }),
         K({ a: [kx(3), -3], aura: 4, faceTo: 'lucan', path: [[0, kx(3), -3]].concat(T.flatMap((t, i) => [[t, kx(3 + i), -3], [t + .3, kx(4 + i), -3]])).concat([[ve - va, kx(7), -3]]), poses: [[0, ACT.ready, 16]], sts: T.map((t, i) => [t, 'atk', { dur: .36, combo: 1 + (i % 2) }]) })],
  caps: [[.3, 'I KNOW HOW MANY THERE WILL BE.'], [2.3, 'THERE ARE ALWAYS ELEVEN.']], mems: [[2.45, 3.05, 'furnace', 1, '255,90,30']] });
// looking straight down: he comes up at the camera and the field shrinks under him
const DOWN_SHOT = { cam: [-52, 20, 190, 110, -6], to: [-52, 20, 340, 110, -6], lin: 1, speed: 1,
  acts: [L({ a: [-10, -3], faceTo: 'kael2', poses: [[0, ACT.lookUp, 7]] }), K({ a: [-52, 12], aura: 3, zs: [[0, 60], [1.85, 94]], zease: 'out', poses: [[0, ACT.rise, 20], [1.0, ACT.hover, 5]] })],
  caps: [[.1, 'THE GROUND DROPS OFF ME.']] };
const CH1_KEEP_SHOTS = [
  // "Dawn, and banners."
  VS(0, 2.35, { bg: 'keep', music: 'dawn', cel: 'front', cam: [-24, 250, 124, 170, .64], to: [-6, 236, 112, 170, .56], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6]] })], caps: [[0, 'DAWN, AND BANNERS.']] }),
  // "A keep of grey stone on the end of a ridge."
  VS(2.35, 5.3, { cam: [0, 330, 200, 150, .16], to: [0, 200, 80, 150, .3], acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6]] })], caps: [[.3, 'A KEEP OF GREY STONE ON THE END OF A RIDGE.']] }),
  // "A boy stands under the banners with a blade held low."  he shifts his weight; the point of the blade draws a slow line on the stone
  VS(5.3, 8.95, { cam: [56, 150, 50, 180, .34], to: [48, 118, 46, 196, .35], lin: 1, acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [1.3, ACT.lowShift, 2.5], [2.7, ACT.low, 2.5]] })], caps: [[.3, 'A BOY STANDS UNDER THE BANNERS WITH A BLADE HELD LOW.']] }),
  // "He is eighteen."
  VS(8.95, 10.5, { ...cu(40, -10, 2.4, 2.9, 10), cel: 'turn', acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [.3, ACT.lowTurn, 5]] })], caps: [[.3, 'HE IS EIGHTEEN.']] }),
  // "He has never been hit by anything he could not see coming."  one lazy practice cut, and the blade goes up on his shoulder
  VS(10.5, 14.0, { cam: [30, 140, 50, 184, .34], to: [36, 124, 48, 194, .35], lin: 1, sfxs: [[.7, 'swing']], acts: [L({ a: [40, -10], fy: .3, poses: [[0, ACT.low, 6], [1.25, ACT.shoulder, 5]], sts: [[.55, 'atk', { dur: .5, combo: 1 }]] })], caps: [[.3, 'HE HAS NEVER BEEN HIT BY ANYTHING HE COULD NOT SEE COMING.']] }),
  // "On a white platform a woman sits in a chair with her hands folded,"
  VS(14.0, 18.1, { cel: 'front', cam: [16, 116, 84, 200, .5], to: [2, 84, 88, 206, .52], lin: 1, acts: [], caps: [[.3, 'ON A WHITE PLATFORM A WOMAN SITS IN A CHAIR WITH HER HANDS FOLDED,']] }),
  // "and watches him."  close: her head comes round to her son
  VS(18.1, 19.5, { cels: [[0, 'front'], [.3, 'turn']], cam: [0, 46, 94, 250, .58], to: [0, 42, 94, 262, .58], lin: 1, acts: [], caps: [[.2, 'AND WATCHES HIM.']] }),
  // "The last day."  the whole field: him under the banners; I walk out onto the far end of it
  VS(19.5, 21.05, { cel: 'turn', cam: [-14, 262, 130, 150, .3], to: [-10, 244, 120, 152, .3], lin: 1, acts: [L({ a: [40, -10], poses: [[0, ACT.shoulder, 6]] }), K({ a: [-78, 8], walk: 1, path: [[0, -78, 8], [1.55, -58, 8]], poses: [[0, ACT.stand, 6]] })], caps: [[.25, 'THE LAST DAY.']] }),
  // "Her son holds the keep."  the blade comes off his shoulder, turns once in his hand, and settles into a guard
  VS(21.05, 23.0, { cam: [52, 132, 40, 190, .4], to: [50, 116, 38, 198, .42], lin: 1, sfxs: [[.45, 'swing2']], acts: [L({ a: [40, -10], poses: [[0, ACT.shoulder, 6], [.3, ACT.ready, 8]], sts: [[.35, 'atk', { dur: .45, combo: 2 }]] })], caps: [[.25, 'HER SON HOLDS THE KEEP.']] }),
  // "I am in their plate, with a white cloak over it that is not mine."  the last steps; he looks at his own arm, then back at the cloak
  VS(23.0, 27.4, { cel: 'front', cam: [-70, 132, 50, 186, .34], to: [-62, 112, 48, 198, .35], lin: 1, acts: [K({ a: [-58, 8], fx: .75, fy: .65, aura: 1, poses: [[0, ACT.stand, 5], [.3, ACT.lookArm, 5], [1.7, ACT.lookCloak, 4], [3.7, ACT.stand, 4]] })], caps: [[.3, 'I AM IN THEIR PLATE,'], [1.8, 'WITH A WHITE CLOAK OVER IT THAT IS NOT MINE.']] }),
  // "Under it, on a cord, a brass washer."
  VS(27.4, 31.1, { ...cu(-58, 8, 2.2, 3.3, -8), mems: [[2.3, 3.3, 'hands', 0, '255,210,110']], sfxs: [[2.3, 'cutin']], acts: [K({ a: [-58, 8], fx: .35, fy: .95, aura: 1, poses: [[0, ACT.stand, 5], [.35, ACT.washerUp, 5], [2.3, ACT.washer, 4], [3.3, ACT.washerUp, 6]] })], caps: [[.3, 'UNDER IT, ON A CORD,'], [2.35, 'A BRASS WASHER.']] }),
  // "The first cut comes in out of the sun, and I am not there."
  VS(31.1, 34.25, { music: 'duel', cam: [-14, 180, 64, 164, .32], to: [-64, 142, 54, 186, .33], sfxs: [[1.65, 'swing']], shakes: [[1.75, .2]], fxs: [[1.75, 'spark', -62, 8, '#e8e4f0', 8, 4], [1.75, 'kick', .04]], cams: [[1.45, [-62, 34, 170, 120, -3], [-66, 34, 150, 124, -3], 2.35]],
    acts: [L({ a: [40, -10], faceTo: 'kael2', path: [[0, 40, -10], [.15, 40, -10], [1.55, -36, 6], [2.0, -56, 7], [3.15, -56, 7]], poses: [[0, ACT.ready, 10], [2.0, ACT.through, 10], [2.5, ACT.lowTurn, 6]], sts: [[1.55, 'atk', { dur: .4, combo: 1 }]] }),
           K({ a: [-58, 8], aura: 1, path: [[0, -58, 8], [1.58, -58, 8], [1.95, -82, 14], [3.15, -84, 14]], faceTo: 'lucan', poses: [[0, ACT.washerUp, 6], [.8, ACT.ready, 7], [1.58, ACT.slip, 30], [2.2, ACT.stand, 6]], sts: [[1.58, 'dodge', { dur: .36 }]] })],
    caps: [[.25, 'THE FIRST CUT COMES IN OUT OF THE SUN,'], [2.0, 'AND I AM NOT THERE.']] }),
  // "The second comes, and I step through it."
  VS(34.25, 36.65, { cam: [-68, 138, 52, 184, .33], to: [-56, 124, 50, 194, .33], sfxs: [[1.15, 'swing2'], [1.52, 'hit']], shakes: [[1.52, .3]], fxs: [[1.51, 'spark', -62, 8, '#fff', 8, 28], [1.51, 'kick', .06]], cams: [[1.3, [-64, 62, 120, 140, -.9], [-52, 62, 112, 146, -.9], 2.05]],
    acts: [L({ a: [-56, 7], faceTo: 'kael2', path: [[0, -56, 7], [1.5, -56, 7], [1.9, -34, 2], [2.4, -33, 2]], poses: [[0, ACT.ready, 10], [.2, ACT.brace, 6], [1.9, ACT.backStep, 10]], sts: [[1.12, 'atk', { dur: .38, combo: 1 }], [1.52, 'hurt', { dur: .3, kx: 90, ky: -20 }]] }),
           K({ a: [-84, 14], aura: 2, faceTo: 'lucan', path: [[0, -84, 14], [1.05, -84, 14], [1.52, -68, 10], [2.4, -54, 12]], poses: [[0, ACT.stand, 6], [.25, ACT.ready, 8], [1.05, ACT.through, 22], [1.44, ACT.shove, 26], [1.95, ACT.ready, 9]] })],
    caps: [[.2, 'THE SECOND COMES,'], [1.2, 'AND I STEP THROUGH IT.']] }),
  // "I hit,"
  VS(36.65, 37.5, { cam: [-42, 132, 50, 188, .33], to: [-40, 126, 49, 194, .33], lin: 1, sfxs: [[.3, 'hit']], shakes: [[.3, .35]], fxs: [[.28, 'spark', -32, 3, '#fff', 10, 30], [.28, 'kick', .07]],
    acts: [L({ a: [-30, 2], faceTo: 'kael2', path: [[0, -30, 2], [.28, -30, 2], [.55, -24, 0], [.85, -24, 0]], poses: [[0, ACT.ready, 12], [.65, ACT.taken, 10]], sts: [[.28, 'hurt', { dur: .36, kx: 90, ky: -10 }]] }),
           K({ a: [-50, 13], aura: 2, faceTo: 'lucan', path: [[0, -50, 13], [.25, -44, 9], [.85, -44, 9]], poses: [[0, ACT.ready, 12]], sts: [[.12, 'atk', { dur: .4, combo: 2 }]] })],
    caps: [[.15, 'I HIT,']] }),
  // "and he takes it."  on him: his head comes back up, and he sets his feet
  VS(37.5, 38.67, { ...cu(-24, 0, 1.9, 2.3, 8), acts: [L({ a: [-24, 0], faceTo: 'kael2', poses: [[0, ACT.taken, 10], [.55, ACT.ready, 6]] }), K({ a: [-44, 9], aura: 2, faceTo: 'lucan', poses: [[0, ACT.ready, 12]] })], caps: [[.1, 'AND HE TAKES IT.']] }),
  // "He hits,"
  VS(38.67, 39.5, { cam: [-30, 124, 44, 196, .35], to: [-34, 118, 43, 200, .35], lin: 1, sfxs: [[.3, 'hit']], shakes: [[.3, .35]], fxs: [[.29, 'spark', -42, 8, '#fff', 10, 30], [.29, 'kick', .07]],
    acts: [L({ a: [-24, 0], faceTo: 'kael2', path: [[0, -24, 0], [.26, -28, 1], [.83, -28, 1]], poses: [[0, ACT.ready, 12]], sts: [[.1, 'atk', { dur: .4, combo: 1 }]] }),
           K({ a: [-44, 9], aura: 2, faceTo: 'lucan', path: [[0, -44, 9], [.28, -44, 9], [.6, -52, 12], [.83, -52, 12]], poses: [[0, ACT.ready, 12], [.66, ACT.taken, 10]], sts: [[.29, 'hurt', { dur: .36, kx: -90, ky: 10 }]] })],
    caps: [[.15, 'HE HITS,']] }),
  // "and I take it."  on me: bent over it, straightening slowly
  VS(39.5, 40.7, { ...cu(-52, 12, 1.9, 2.3, -8), acts: [K({ a: [-52, 12], aura: 2, faceTo: 'lucan', poses: [[0, ACT.taken, 10], [.5, ACT.spent, 4]] }), L({ a: [-28, 1], faceTo: 'kael2', poses: [[0, ACT.ready, 10]] })], caps: [[.1, 'AND I TAKE IT.']] }),
  // "Under my ribs a pressure starts, low,"
  VS(40.7, 43.75, { ...cu(-52, 12, 1.9, 2.5, -12), acts: [K({ a: [-52, 12], fx: .5, fy: .9, aura: 2, poses: [[0, ACT.spent, 6], [.3, ACT.ribs, 6], [2.35, ACT.ribsLow, 6]] })], caps: [[.2, 'UNDER MY RIBS A PRESSURE STARTS,'], [2.38, 'LOW,']] }),
  // "the way a seal starts to lift before anybody hears it."
  VS(43.75, 47.05, { cam: [-44, 150, 50, 176, .34], to: [-42, 128, 48, 190, .35], lin: 1, sfx: 'fury', bolt: 1, tint: 'rgba(160,20,0,.14)', mems: [[.95, 1.3, 'furnace', 1, '255,90,30'], [2.0, 2.35, 'tin', 0, '255,210,110']], sfxs: [[.95, 'cutin'], [2.0, 'cutin']], shakes: [[1.1, .15], [2.2, .2]], fxs: [[1.1, 'ring', -52, 12, '#ff7a30', 30], [2.2, 'ring', -52, 12, '#ffb040', 50], [2.2, 'spark', -52, 12, '#ffb040', 8, 2]],
    acts: [L({ a: [-28, 1], faceTo: 'kael2', path: [[0, -28, 1], [1.3, -28, 1], [2.0, -18, -1], [3.3, -18, -1]], poses: [[0, ACT.ready, 10], [1.3, ACT.backStep, 9], [2.2, ACT.ready, 7]] }),
           K({ a: [-52, 12], fx: .8, fy: -.2, aura: 3, poses: [[0, ACT.ribsLow, 6], [.6, ACT.ribs, 3], [1.7, ACT.heave, 4], [2.5, ACT.headUp, 6]] })],
    caps: [[.15, 'THE WAY A SEAL STARTS TO LIFT BEFORE ANYBODY HEARS IT.']] }),
  // "I go up."
  VS(47.05, 48.25, { cam: [-40, 176, 56, 170, .34], to: [-40, 186, 84, 166, .42], speed: 1, sfxs: [[.42, 'dash'], [.42, 'roar']], shakes: [[.42, .4]], fxs: [[.42, 'ring', -52, 12, '#fff2c0', 90], [.44, 'ring', -52, 12, '#ff7a30', 56], [.42, 'spark', -52, 12, '#d8d4e4', 16, 0], [.42, 'kick', .08]],
    acts: [L({ a: [-18, -1], faceTo: 'kael2', path: [[0, -18, -1], [.5, -18, -1], [1.1, -10, -3], [1.2, -10, -3]], poses: [[0, ACT.ready, 10], [.5, ACT.backStep, 12]] }),
           K({ a: [-52, 12], aura: 3, zs: [[0, 0], [.42, 0], [1.2, 60]], zease: 'out', poses: [[0, ACT.coil, 20], [.42, ACT.rise, 30]] })],
    caps: [[.3, 'I GO UP.']] }),
  // "The ground drops off me."  from above: the keep turns into a square of roof
  VS(48.25, 50.1, DOWN_SHOT),
  // "The woman in the chair turns her head,"
  VS(50.1, 52.45, { cels: [[0, 'turn'], [.9, 'up']], cam: [0, 50, 94, 240, .58], to: [0, 42, 96, 262, .6], lin: 1, acts: [], caps: [[.25, 'THE WOMAN IN THE CHAIR TURNS HER HEAD,']] }),
  // "only her head, to follow."
  VS(52.45, 54.85, { cel: 'up', cam: [-34, 196, 124, 160, .54], to: [-30, 182, 136, 166, .57], lin: 1,
    acts: [L({ a: [-10, -3], faceTo: 'kael2', poses: [[0, ACT.lookUp, 8]] }), K({ a: [-52, 12], aura: 3, zs: [[0, 94], [1.2, 98], [2.4, 96]], poses: [[0, ACT.hover, 6], [.4, ACT.hoverUp, 3]] })],
    caps: [[.2, 'ONLY HER HEAD,'], [1.45, 'TO FOLLOW.']] }),
  // "Then I come down on him."  from over my shoulder, looking down: he is very small, and he has seen it
  VS(54.85, 55.5, { cel: 'front', cam: [-52, 40, 200, 120, -2], to: [-50, 40, 190, 124, -2], lin: 1, sfxs: [[.3, 'roar']],
    acts: [L({ a: [-10, -3], faceTo: 'kael2', poses: [[0, ACT.lookUp, 12], [.25, ACT.brace, 14]] }), K({ a: [-52, 12], aura: 4, zs: [[0, 96]], poses: [[0, ACT.hoverUp, 14]] })],
    caps: [[.2, 'THEN I COME DOWN ON HIM.']] }),
  VS(55.5, 56.62, { cam: [-30, 182, 136, 166, .57], to: [-22, 152, 60, 180, .34], lin: 1, speed: 1, fxs: [.15, .35, .55, .75, .95].map(t => [t, 'spark', -52 + 25 * t / 1.12, 12 - 12 * t / 1.12, '#ffb040', 5, 96 - 94 * t / 1.12]),
    acts: [L({ a: [-10, -3], faceTo: 'kael2', poses: [[0, ACT.brace, 20]] }),
           K({ a: [-52, 12], aura: 4, path: [[0, -52, 12], [1.12, -27, 0]], zs: [[0, 96], [1.12, 2]], poses: [[0, ACT.hoverUp, 14]], sts: [[0, 'plunge', { until: 1.12 }]] })],
    caps: [[0, 'THEN I COME DOWN ON HIM.']] }),
  // the landing
  VS(56.62, 57.0, { cam: [-10, 150, 56, 178, .33], to: [6, 138, 52, 186, .33], flash: 1, shake: .8, sfx: 'hit', speed: 1, fxs: [[.02, 'ring', -12, -2, '#fff2c0', 110], [.04, 'ring', -12, -2, '#ff7a30', 70], [.02, 'spark', -14, -2, '#ffe9a0', 20, 26], [.02, 'spark', -20, 0, '#d8d4e4', 14, 0], [.02, 'kick', .12], [.2, 'spark', 10, -4, '#d8d4e4', 6, 0]],
    acts: [L({ a: [-10, -3], faceTo: 'kael2', path: [[0, -10, -3], [.04, -10, -3], [.36, 30, -5]], poses: [[0, ACT.brace, 20]], sts: [[.03, 'hurt', { dur: .4, kx: 120, ky: -10 }]] }),
           K({ a: [-27, 0], aura: 4, faceTo: 'lucan', path: [[0, -27, 0], [.1, -27, 0], [.38, 5, -3]], poses: [[0, ACT.ready, 16]], sts: [[0, 'atk', { dur: .3, combo: 3, t0: .12 }]] })] }),
  // "One. Two. Three."
  blow(57.0, 57.74, 1, 'ONE', side(1)),
  blow(57.74, 58.47, 2, 'TWO', cu(lx(2), -5, 1.5, 1.8, 8)),
  blow(58.47, 59.3, 3, 'THREE', cu(kx(3), -3, 1.5, 1.8, -8)),
  // "I know how many there will be. There are always eleven."
  quiet4(59.3, 63.5, [.45, 1.4, 2.35, 3.3]),
  // "Eight. Nine. Ten."
  blow(63.5, 64.2, 8, 'EIGHT', cu(lx(8), -5, 1.5, 1.8, 8)),
  blow(64.2, 65.0, 9, 'NINE', cu(kx(9), -3, 1.5, 1.8, -8)),
  blow(65.0, 66.0, 10, 'TEN', Object.assign(side(10, 50), { bigC: '#fff6dc' })),
  // "The blade comes down."
  VS(66.0, 67.75, { cam: [40, 126, 62, 185, .4], to: [43, 108, 59, 198, .42], bolt: 2, sfx: 'cutin', tint: 'rgba(160,20,0,.2)',
    acts: [L({ a: [52, -5], faceTo: 'kael2', poses: [[0, ACT.kneelUp, 9]] }),
           K({ a: [30, -3], aura: 4, faceTo: 'lucan', poses: [[0, ACT.ready, 16], [.3, ACT.overhead, 6]] })],
    caps: [[.3, 'THE BLADE COMES DOWN.']] }),
  // her, as it falls: she has not moved
  VS(67.75, 68.5, { cel: 'turn', cam: [0, 44, 94, 256, .58], to: [0, 40, 94, 268, .58], lin: 1, acts: [], sfxs: [[.5, 'swing']], caps: [[0, 'THE BLADE COMES DOWN.']] }),
  // black. the hit; the music goes; two heartbeats; then nothing, before the card
  { d: 3.6, vd: 3.6, black: 1, flash: 1, sfx: 'hit', shake: .6, fxs: [[.05, 'fn', () => Sound.music(null)], [1.1, 'fn', () => Sound.play('heart')], [2.3, 'fn', () => Sound.play('heart')]] }
];
const MEM_AT = 40.7, MEM = 19.61, FORD = { bg: 'ford', tint: 'rgba(30,40,90,.3)', memo: '150,190,255' };
for (const sh of CH1_KEEP_SHOTS) if (sh.va !== undefined && sh.va >= MEM_AT - .01) sh.va += MEM;
{ const i = CH1_KEEP_SHOTS.findIndex(sh => sh.va !== undefined && sh.va >= MEM_AT + MEM - .01), M = (a, b, o) => VS(MEM_AT + a, MEM_AT + b, Object.assign({}, FORD, o));
  const lu = (o) => Object.assign({ id: 'lucan', a: [26, -14], fx: -1, fy: .5, blade: 0, poses: [[0, ACT.stand, 5]] }, o), open = Object.assign({}, ACT.stand, { lp: -.35, ly: .5, le: -.5, rp: -.35, ry: -.5, re: -.5, hx: -.05 }), ask = Object.assign({}, ACT.stand, { hx: -.08, hy: .35, lp: -.5, le: -.9, ly: .2 });
  CH1_KEEP_SHOTS.splice(i, 0,
    // the night before: the ford, the truce he asked for. Kael tells it; Lucan's words are from the game's truce scene.
    M(0, 4.6, { flash: 1, sfx: 'heart', cam: [0, 210, 96, 160, .3], to: [6, 156, 62, 176, .33], lin: 1,
      acts: [lu({}), K({ a: [-44, 30], fy: -.6, walk: 1, path: [[0, -48, 32], [3.6, -26, 20], [4.6, -26, 20]], poses: [[0, ACT.low, 5]] })],
      caps: [[.3, 'HE IS STANDING ON THE FAR BANK, ALONE,']] }),
    // on him: nothing in his hands
    M(4.6, 8.45, { cam: [40, 118, 46, 196, .35], to: [34, 100, 44, 206, .36], lin: 1, acts: [lu({ poses: [[0, ACT.stand, 5], [.6, open, 3], [2.6, ACT.stand, 3]] })], caps: [[0, 'WITH HIS BLADE LEFT ON THE STONES BEHIND HIM.']] }),
    // he asks it
    M(8.45, 12.0, { ...cu(26, -14, 2.0, 2.6, 10), sfxs: [[1.6, 'heart']], acts: [lu({ poses: [[0, ACT.stand, 5], [.9, ask, 3]] })], caps: [[0, 'HE SAID: YOU FIGHT AS IF YOU HATE THE GROUND YOU ARE STANDING ON.']] }),
    // the two of us and the water between
    M(12.0, 16.4, { cam: [-6, 176, 70, 168, .32], to: [2, 150, 60, 178, .33], lin: 1, acts: [lu({ poses: [[0, ask, 3]] }), K({ a: [-26, 20], fy: -.6, poses: [[0, ACT.low, 5]] })], caps: [[0, 'HE SAID: YOU FIGHT AS IF YOU HATE THE GROUND YOU ARE STANDING ON.']] }),
    // on me: I have no answer I can give him; I look at the water
    M(16.4, MEM, { ...cu(-26, 20, 2.1, 2.8, -8), sfxs: [[1.4, 'heart']], acts: [K({ a: [-26, 20], fx: .7, fy: .7, poses: [[0, ACT.stand, 5], [1.0, Object.assign({}, ACT.stand, { hx: .5, hy: -.3 }), 2.5]] })], caps: [[0, 'HE SAID: WHERE DOES ONE LEARN IT.']] }));
  CH1_KEEP_SHOTS[i + 5].flash = 1; }
// ---- the voice. The read is the clock: while it plays, the film's time is the audio's time, so picture and voice cannot drift.
const VO = { a: null, on: false, off: false,
  start() { if (this.off) return; try { if (!this.a) { this.a = new Audio(CH1_VO_SRC); this.a.preload = 'auto'; } this.a.currentTime = 0; this.a.volume = 1; this.vt = 0; this.last = -1; this.still = 0; const p = this.a.play(); if (p && p.catch) p.catch(() => { }); this.on = true; if (Sound.mus) Sound.mus.gain.value = (Settings.d.music / 10) * .5; } catch (e) { } },
  stop() { SUB.hide(); if (!this.on) return; this.on = false; try { this.a.pause(); } catch (e) { } Sound.setVol(); },
  live() { return this.on && this.a && !this.a.paused && !this.a.ended && this.a.currentTime > 0; } };
{ const n1 = Brawl.nextShot; Brawl.nextShot = function () { n1.call(this); const c = this.cine, s = c && c.shots[c.i]; if (s && s.vd) c.dur = s.vd; if (c) c._fx = 0; };
  const u0 = Brawl.updCine; Brawl.updCine = function (dt) { const c = this.cine, s = c.shots[c.i], i0 = c.i;
    if (s.va === 0 && !VO.on && c.t === 0) VO.start();
    if (s.va !== undefined && VO.on) { VO.vt += dt; const a = VO.a; if (a && !a.paused && !a.ended) { const ct = a.currentTime; if (ct !== VO.last) { VO.last = ct; if (VO.still > .6 && VO.vt - ct > .35) { try { a.currentTime = VO.vt; } catch (e) { } } else VO.vt = ct; VO.still = 0; } else VO.still = (VO.still || 0) + dt; } c.t = Math.max(0, VO.vt - s.va - dt); }
    const tA = c.t; u0.call(this, dt);
    if (!this.cine) return VO.stop();
    const c2 = this.cine; if (c2.i === i0) { const tB = c2.t; if (s.sfxs) for (const e of s.sfxs) if (e[0] > tA && e[0] <= tB || (tA === 0 && e[0] === 0)) Sound.play(e[1]); if (s.shakes) for (const e of s.shakes) if (e[0] > tA && e[0] <= tB) this.shake = e[1]; if (s.fxs) for (const e of s.fxs) if (e[0] > tA && e[0] <= tB) { const a = e.slice(2); if (e[1] === 'spark') this.spark(...a); else if (e[1] === 'ring') this.ring(...a); else if (e[1] === 'kick') c2._kick = a[0]; else if (e[1] === 'fn') a[0](); } }
    else { const s2 = c2.shots[c2.i]; if (s2 && s2.va !== undefined && VO.on && Math.abs(VO.vt - s2.va) > .2) { VO.vt = s2.va; try { VO.a.currentTime = s2.va; } catch (e) { } } }
    if (c2.shots[c2.i] && c2.shots[c2.i].va !== undefined) { const w = VO.vt || 0; this.cam.x += Math.sin(w * .7) * .5; this.cam.h += Math.sin(w * .93 + 1) * .35; }
    { const s3 = c2.shots[c2.i]; if (s3 && s3.cams) for (const e of s3.cams) if (c2.t >= e[0] && c2.t < e[3]) { const u = (c2.t - e[0]) / (e[3] - e[0]), A = e[1], B = e[2], cm = this.cam; cm.x = A[0] + (B[0] - A[0]) * u; cm.y = A[1] + (B[1] - A[1]) * u; cm.h = A[2] + (B[2] - A[2]) * u; cm.f = A[3] + (B[3] - A[3]) * u; cm.hor = Math.round(H * (A[4] + (B[4] - A[4]) * u)); } }
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
  sent(t) { t = t.toLowerCase().replace(/(^[\u201c]?|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\bi\b/g, 'I'); return t; },
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
      if (k.faceTo) { const other = c.acts.find(a => a.id === k.faceTo); if (other) { const dx = other.x - o.x, dy = other.y - o.y, d = Math.hypot(dx, dy) || 1; o.fx = dx / d; o.fy = dy / d; o.ax = o.fx; o.ay = o.fy; } }
      k._pose = null; if (k.poses) { let cur = k.poses[0]; for (const e of k.poses) if (q >= e[0]) cur = e; k._pose = cur[1]; k._rate = cur[2] || 10; }
      o.swing = 0; o.guardT = 0;
      if (k.sts) for (const e of k.sts) { const t0 = e[0] * U, m = e[2] || {}, end = m.until !== undefined ? m.until * U : t0 + (m.dur || .3); if (now >= t0 && now < end) { if (e[1] === 'guard') o.guardT = 1; else { o.st = e[1]; o.t = now - t0 + (m.t0 || 0); if (m.combo) o.combo = m.combo; if (m.kx !== undefined) { o.kx = m.kx; o.ky = m.ky || 0; } } } }
      if (k.rage) opt.rage = k.rage;
      if (S.va !== undefined && k.id) { const sk = STAB[k.id] || (STAB[k.id] = {}); sk.act = k; opt.key = sk; if (!k._init) { k._init = 1; const R = G3.rigs && G3.rigs.get(sk); if (R) { R.x = o.x; R.y = o.y; R.vx = 0; R.vy = 0; R.trail = []; R.yaw = Math.atan2(o.fx, o.fy); } } }
    }
    return f0.call(this, g, o, opt); }; }
// a held pose lies over whatever the rig would have done, except while a cut or a blow is playing
{ const t0 = G3.target; G3.target = function (o, opt, st, blade, mv, t, idx) { const r = t0.call(this, o, opt, st, blade, mv, t, idx), k0 = opt && opt.key, k = k0 && (k0.act || k0); if (k && k._pose && st !== 'atk' && st !== 'hurt' && st !== 'plunge' && st !== 'wind' && st !== 'dodge' && !mv) { Object.assign(r[0], k._pose); r[1] = k._rate || 10; r[2] = .8; const br = Math.sin(t * 1.7 + (idx || 0) * 2.1); r[0].cr = (r[0].cr || 0) + br * .2 + .2; r[0].lean = (r[0].lean || 0) + br * .012; r[0].hx = (r[0].hx || 0) + Math.sin(t * .83 + (idx || 0)) * .035; r[0].lp = (r[0].lp || 0) + br * .02; } return r; }; }
// she is drawn flat on the dais; three drawings of her let her look at her son, and up
const CEL = { cache: {}, draw(kind) { if (this.cache[kind]) return this.cache[kind]; const base = daisSprite('cel'); if (kind === 'front') return (this.cache[kind] = base); const c = document.createElement('canvas'); c.width = base.width; c.height = base.height; const g = c.getContext('2d'); g.drawImage(base, 0, 0);
    const HR = '#f6eac0', SK = '#f4e6dc', SK2 = '#d2c6bd';
    if (kind === 'turn') { g.fillStyle = HR; g.fillRect(18, 13, 8, 12); g.drawImage(base, 18, 13, 8, 11, 20, 13, 8, 11); g.fillStyle = SK2; g.fillRect(20, 24, 6, 2); g.fillStyle = HR; g.fillRect(15, 12, 5, 12); }
    else if (kind === 'up') { g.fillStyle = HR; g.fillRect(15, 1, 14, 10); g.drawImage(base, 14, 3, 16, 9, 14, 1, 16, 9); g.fillStyle = HR; g.fillRect(18, 10, 8, 3); g.drawImage(base, 18, 13, 8, 9, 18, 11, 8, 9); g.fillStyle = SK; g.fillRect(18, 20, 8, 4); g.fillStyle = SK2; g.fillRect(19, 23, 6, 3); g.fillStyle = '#8a5a4a'; g.fillRect(20, 20, 4, 1); }
    return (this.cache[kind] = c); },
  set(kind) { const L = G3.bbs && G3.bbs.keep; if (!L) return; const i = L.findIndex(b => b.tag === 'dais' && b.x === 0); if (i < 0 || L[i]._kind === kind) return; this.ent = this.ent || {}; if (!this.ent[kind]) this.ent[kind] = Object.assign({}, L[i], { cv: this.draw(kind), tex: null, _kind: kind }); if (!L[i]._kind) { L[i]._kind = 'front'; this.ent.front = L[i]; } L[i] = this.ent[kind]; } };
{ const r0 = Brawl.renderCine; Brawl.renderCine = function (g) { const rr = this._rc0(g), c9 = this.cine, s9 = c9 && c9.shots[c9.i]; if (s9) MEMFX(this, g, c9, s9); return rr; }; Brawl._rc0 = function (g) { const c = this.cine, s = c && c.shots[c.i]; if (s && this.def.bg === 'keep') { let kind = s.cel; if (s.cels) for (const e of s.cels) if (c.t >= e[0]) kind = e[1]; if (kind) CEL.set(kind); } if (s && s.caps) { let cp = ''; for (const e of s.caps) if (c.t >= e[0]) cp = e[1]; s.cap = undefined; SUB.show(cp, s.va + '|' + cp, s.mem); } else if (s && (s.va !== undefined || c.shots === CH1_KEEP_SHOTS)) SUB.show('', ''); if (s && s.va !== undefined && s.big) { s._big = s.big; s._bigC = s.bigC; s.big = undefined; } SUB.num(s && s._big ? s._big : '', s && s._bigC, c ? c.t : 0); return r0.call(this, g); }; }

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
{ const n0 = Brawl.nextShot; Brawl.nextShot = function () { const c = this.cine, s = c && c.shots[c.i + 1]; if (s && s.bg2 !== undefined) this.def = Object.assign({}, this.def, { bg2: s.bg2 || undefined }); n0.call(this); if (s && s.nocrowd && this.props) this.props = this.props.filter(q => q.t !== 'crowd'); }; }

// a lantern for any actor marked with one: the light sits a little ahead of the way he is facing
{ const a0 = Cutscene.anim, e0 = Cutscene.end;
  Cutscene.anim = function (dt) { a0.call(this, dt); const L = this.actors.filter(a => a.lamp); if (L.length) World.dynLights = L.map(a => { const an = DIRA[a.dir]; return { x: a.x + Math.cos(an) * 14, y: a.y - 6 + Math.sin(an) * 14, r: 60, c: '#ffd070' }; }); else if (this._lamps) World.dynLights = []; this._lamps = L.length; };
  Cutscene.end = function () { if (this._lamps) { World.dynLights = []; this._lamps = 0; } return e0.call(this); }; }

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
    { label: 'Settings', act: () => Menus.settings() }
  ] }));
};
