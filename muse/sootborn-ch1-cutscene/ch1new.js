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
const CH1_KEEP_SHOTS = [
  { d: 3.4, bg: 'keep', music: 'dawn', cam: [0, 340, 210, 150, .14], to: [0, 180, 74, 150, .3], acts: [{ id: 'lucan', a: [40, -10], blade: 1, fx: -1, fy: .3 }], cap: 'DAWN, AND BANNERS. A KEEP OF GREY STONE ON THE END OF A RIDGE.' },
  { d: 2.6, ...cu(40, -10, 1.8, 2.5, 18), acts: [{ id: 'lucan', a: [40, -10], blade: 1, fx: -1, fy: .3 }], cap: 'A BOY STANDS UNDER THE BANNERS WITH A BLADE HELD LOW. HE IS EIGHTEEN. HE HAS NEVER BEEN HIT BY ANYTHING HE COULD NOT SEE COMING.' },
  { d: 3.0, cam: [14, 110, 84, 200, .5], to: [0, 84, 88, 200, .52], lin: 1, acts: [], cap: 'ON A WHITE PLATFORM A WOMAN SITS IN A CHAIR WITH HER HANDS FOLDED, AND WATCHES HIM.' },
  { d: 2.2, cam: [0, 84, 88, 200, .52], to: [0, 52, 92, 200, .56], lin: 1, acts: [], cap: 'THE LAST DAY. HER SON HOLDS THE KEEP.' },
  { d: 3.0, ...cu(-40, 4, 1.9, 2.8, -16), music: 'duel', acts: [{ id: 'kael2', a: [-40, 4], blade: 1, fx: 1, fy: -.2, aura: 1, pose: 'washer' }], cap: 'I AM IN THEIR PLATE, WITH A WHITE CLOAK OVER IT THAT IS NOT MINE. UNDER IT, ON A CORD, A BRASS WASHER.' },
  { d: 1.8, cam: [-10, 150, 56, 170], to: [6, 132, 52, 186], flash: 1, sfx: 'clash', shake: .3, acts: [{ id: 'lucan', a: [30, -6], b: [12, -2], blade: 1, fx: -1, fy: .2, swing: 1 }, { id: 'kael2', a: [-12, 4], b: [-26, 14], blade: 1, fx: 1, fy: -.2, aura: 1 }], cap: 'THE FIRST CUT COMES IN OUT OF THE SUN, AND I AM NOT THERE.' },
  { d: 1.8, cam: [6, 132, 52, 186], to: [-4, 124, 50, 196], flash: 1, sfx: 'steel', shake: .3, acts: [{ id: 'lucan', a: [12, -2], blade: 1, fx: -1, fy: .2, swing: 1 }, { id: 'kael2', a: [-26, 14], b: [-4, 2], blade: 1, fx: 1, fy: -.2, aura: 2 }], cap: 'THE SECOND COMES, AND I STEP THROUGH IT.' },
  { d: 2.0, cam: [-4, 124, 50, 196], to: [4, 118, 48, 204], flash: 1, sfx: 'clash', shake: .5, acts: [{ id: 'lucan', a: [14, -2], blade: 1, fx: -1, fy: .2, guard: 1 }, { id: 'kael2', a: [-6, 2], blade: 1, fx: 1, fy: -.2, aura: 2, swing: 1 }], cap: 'I HIT, AND HE TAKES IT. HE HITS, AND I TAKE IT.' },
  { d: 2.6, ...cu(-6, 2, 1.9, 3.0, -14), sfx: 'fury', bolt: 1, tint: 'rgba(160,20,0,.14)', acts: [{ id: 'kael2', a: [-6, 2], blade: 1, fx: .5, fy: .9, aura: 3 }], cap: 'UNDER MY RIBS A PRESSURE STARTS, LOW, THE WAY A SEAL STARTS TO LIFT BEFORE ANYBODY HEARS IT.' },
  { d: 2.0, cam: [0, 170, 60, 170, .34], to: [0, 190, 120, 160, .52], speed: 1, sfx: 'dash', acts: [{ id: 'lucan', a: [14, -2], blade: 1, fx: -1, fy: .2 }, { id: 'kael2', a: [-6, 2], blade: 1, fx: 1, fy: -.2, aura: 3, za: 0, zb: 90 }], cap: 'I GO UP. THE GROUND DROPS OFF ME.' },
  { d: 3.0, cam: [4, 176, 150, 160, .6], to: [10, 156, 142, 176, .62], lin: 1, acts: [{ id: 'lucan', a: [14, -2], blade: 1, fx: -1, fy: .2 }, { id: 'kael2', a: [-6, 2], blade: 1, fx: 1, fy: -.2, aura: 3, za: 90, zb: 96 }], cap: 'THE WOMAN IN THE CHAIR TURNS HER HEAD, ONLY HER HEAD, TO FOLLOW.' },
  { d: 1.3, cam: [0, 200, 130, 160, .5], to: [6, 150, 58, 180, .34], speed: 1, sfx: 'roar', shake: .6, flash: 1, acts: [{ id: 'lucan', a: [14, -2], blade: 1, fx: -1, fy: .2, guard: 1 }, { id: 'kael2', a: [-6, 2], b: [4, 0], blade: 1, fx: 1, fy: -.2, aura: 4, za: 96, zb: 4, st: 'plunge', zease: 'in' }], cap: 'THEN I COME DOWN ON HIM.' },
  { d: 6.4, cam: [4, 150, 56, 176, .33], to: [8, 118, 48, 200, .34], lin: 1, count: 10, tint: 'rgba(120,10,0,.16)', acts: [{ id: 'lucan', a: [14, -2], b: [22, -4], blade: 1, fx: -1, fy: .2, guard: 1 }, { id: 'kael2', a: [2, 0], b: [10, -2], blade: 1, fx: 1, fy: -.2, aura: 4, swing: 1 }], cap: 'I KNOW HOW MANY THERE WILL BE. THERE ARE ALWAYS ELEVEN.' },
  { d: 1.5, ...cu(10, -2, 2.0, 3.2, -8), bolt: 2, sfx: 'cutin', tint: 'rgba(160,20,0,.2)', acts: [{ id: 'lucan', a: [22, -4], blade: 1, fx: -1, fy: .2, pose: 'kneel' }, { id: 'kael2', a: [10, -2], blade: 1, fx: 1, fy: -.2, aura: 4, hold: 2 }], cap: 'THE BLADE COMES DOWN.' },
  { d: 0.5, black: 1, flash: 1, sfx: 'hit', shake: .6 }
];
const CH1_KEEP_FILM = () => ({ bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'dawn', cineOnly: 1, film: 1, hero: { id: 'kael2', cape: CLOAK }, intro: CH1_KEEP_SHOTS, foes: [] });
const CH1_KEEP = [
  { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } },
  { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. The last day.', big: 1, min: 1.5, max: 4.5 },
  { brawl: () => CH1_KEEP_FILM() },
  { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { music: null },
  { card: 'BEFORE THE FURNACE', sub: 'Cinderwell. Six tiers under the rock. Before any of it.', big: 1, tr: 'furnace', min: 1.6, max: 5 }
];
// a film actor can leave the ground: za -> zb over the shot (the game's films never needed it; the chapter does)
{ const f0 = Brawl.fighter; Brawl.fighter = function (g, o, opt) { const k = opt && opt.key, c = this.cine; if (k && k.za !== undefined && c) { const q = Math.min(1, c.t / c.dur), e = k.zease === 'in' ? q * q : 1 - Math.pow(1 - q, 2), zb = k.zb === undefined ? k.za : k.zb; o.z = k.za + (zb - k.za) * e; o.vz = zb > k.za ? 1 : -1; } return f0.call(this, g, o, opt); }; }

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
    { label: 'Play the opening: the Keep (new film)', act: () => CH1_PREVIEW.play(CH1_KEEP) },
    { label: 'Play all of Chapter One (the Keep, then below)', act: () => CH1_PREVIEW.play(CH1_KEEP.concat(CH1_NEW)) },
    { label: 'Play only the scenes below (new cutscene)', act: () => CH1_PREVIEW.play(CH1_NEW) },
    { label: "Compare: the game's current scenes below", act: () => CH1_PREVIEW.play(CH1_PREVIEW.old()) },
    { label: 'Settings', act: () => Menus.settings() },
    { label: 'Controls', act: () => Menus.controls() }
  ] }));
};
