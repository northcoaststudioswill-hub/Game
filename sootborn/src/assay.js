// ------------------------------------------------------------------ The Assay, on foot.
// Playable 2D missions above the rock. They run inside a cutscene script as { mission: 'key' } and hand back to it when done.
Object.assign(CAST, {
  petra: { name: 'Petra Lune, House Violet', look: () => CAST.cadv2.look() },
  oswin: { name: 'Oswin Hale, House Violet', look: () => CAST.cadv1.look() },
  maren: { name: 'Maren Aldane', look: () => ({ accredited: 1, skin: '#e8c8a8', hair: '#b08a50', style: 'long', long: 1, robe: '#e8e0cc', trim: '#e8c25a', sash: '#7a5ac8' }) }
});
Object.assign(CAST, {
  thorne: { name: 'Cassel Thorne, House Violet', look: () => CAST.cadv1.look() },
  corin: { name: 'Corin Ashby, House Violet', look: () => CAST.cadv2.look() },
  merrow: { name: 'Merrow, late of House Teal', look: () => CAST.cadt1.look() }
});
Object.assign(MOUTH, { petra: 'flat', oswin: 'frown', maren: 'flat', thorne: 'smirk', corin: 'flat', merrow: 'frown' });
// 2D fights that happen inside the levels, and one after a 3D fight
FF.thorne = () => ({ era: 0, d2: 1, title: 'THE CAPTAIN\'S WOOD', sub: 'CASSEL THORNE - NO BLADES IN CAMP', bg: 'valley', arena: { kind: 'ring', rx: 96, ry: 44 }, music: 'work', legend: 1, skip: 1, winText: 'HE STAYS DOWN',
  hero: { id: 'kael2', hp: 9, pow: 1, blade: 0, fury0: 30 }, taunt: { 0: ['A MINOR HOUSE. A NOBODY.', 'ONE DOES NOT TAKE ORDERS FROM A CLERK\'S SON.', 'STAND STILL.'] },
  foes: [{ id: 'thorne', name: 'Cassel Thorne', kind: 'heavy', hp: 30 }],
  voice: { at: [[1, 'HE HAS HAD A FENCING MASTER SINCE HE WAS SIX. NOBODY HAS EVER HIT HIM IN THE MOUTH.'], [10, 'BANK HANDS. THE GILDING DID NOT TAKE THOSE. I ASKED IT NOT TO.'], [20, 'FORTY OF THEM WATCHING. NOT ONE STEPS IN. THEY WANT TO SEE WHO FEEDS THEM.']], hurt: 'HE HITS LIKE A LESSON. NEAT. NOTHING BEHIND IT.', fury: 'NOT ALL OF IT. HE IS A BOY WITH A WOODPILE.', half: 'HE HAS JUST LEARNED WHAT HIS OWN BLOOD TASTES LIKE. HE DOES NOT CARE FOR IT.', eleven: 'ELEVEN. FOR A WOODPILE. I SHOULD BE ASHAMED. I AM NOT.' },
  arts: [{ at: .5, name: 'THE EMBER RING', line: 'A CHALK CIRCLE IN ASHGATE SQUARE. SEREN HELD THE BELT. THIS IS THE SAME CIRCLE WITH GRASS IN IT.', panel: 'hands', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }] });
FF.corin = () => ({ era: 3, d2: 1, title: 'THE LAMP', sub: 'CORIN ASHBY - IT IS ONLY ARITHMETIC', bg: 'storm', arena: { kind: 'ring', rx: 100, ry: 46 }, music: 'duel', legend: 1, skip: 1, winText: 'THE LAMP IS OUT',
  hero: { id: 'kael2', hp: 9, pow: 2, blade: 1, fury0: 60 }, taunt: { 0: ['IT IS ONLY ARITHMETIC.', 'YOU WOULD HAVE DONE THE SAME.', 'MY FATHER OWES THEM.'] },
  foes: [{ id: 'corin', name: 'Corin Ashby', kind: 'duelist', hp: 52 }],
  voice: { at: [[1, 'HE ATE AT MY FIRE FOR TWENTY-FIVE DAYS AND COUNTED MY PICKETS WHILE HE CHEWED.'], [10, 'MARA HELD ME DOWN. DACE WENT UNDER THE FLOOR. I HAD THOUGHT I WAS DONE BEING SURPRISED BY WHO.'], [20, 'HE IS GOOD. HE IS BETTER THAN THORNE. FEAR IS A BETTER MASTER THAN A FENCING MASTER.']], hurt: 'THAT ONE WAS FOR HIS FATHER. I CAN TELL.', fury: 'THREE NIGHTS. THREE RAIDS. OSWIN\'S LEG.', half: 'HE IS CRYING. HE HAS NOT STOPPED CUTTING. I KNOW THAT ONE TOO.', eleven: 'ELEVEN. HE COUNTED OUR PICKETS. I COUNT THIS.' },
  arts: [{ at: .5, name: 'HELD DOWN', line: 'THE PEOPLE WHO LOVED ME HELD ME DOWN WHILE THE DOORS CLOSED. THAT WAS LOVE. THIS IS ONLY A DEBT.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28' }] });
FF.voss2d = () => ({ era: 3, d2: 1, title: 'ON THE GROUND', sub: 'HALDEN VOSS - HIS BOOTS ARE CUT', bg: 'storm', arena: { kind: 'ring', rx: 104, ry: 46 }, music: 'duel', legend: 1, skip: 1, rage: 3, winText: 'NOBODY TOUCHES A PROCTOR',
  hero: { id: 'kael2', hp: 9, pow: 2, blade: 1, fury0: 80 }, taunt: { 0: ['THERE IS NO COLUMN FOR THIS.', 'YOU WILL BE STRUCK FROM EVERY BOOK.', 'I AM A PROCTOR.'] },
  foes: [{ id: 'voss', name: 'Proctor Voss', kind: 'baton', hp: 60, sc: 1.1, k2: { triple: 1 } }],
  voice: { at: [[1, 'HE IS ON THE GROUND WITH THE REST OF US. THE STRAPS ARE CUT. HE DOES NOT KNOW HOW TO STAND IN MUD.'], [9, 'THIRTY DAYS HE HOVERED UP THERE AND WROTE. NOW HE HAS TO LOOK UP TO SEE ME.'], [18, 'HE SWINGS LIKE BRAND. OF COURSE HE DOES. BRAND WAS TAUGHT BY MEN LIKE THIS.']], hurt: 'A HALBERD BUTT. BETWEEN THE SHOULDERS. THE SAME PLACE. EVERY TIME.', fury: 'RECOMMEND REMOVAL. HE WROTE THAT. ABOUT ME.', half: 'HE HAS STOPPED SAYING PROCTOR. HE IS SAYING PLEASE. THEY DO HAVE THE WORD.', eleven: 'ELEVEN. ONE FOR EVERY SECOND HE WOULD HAVE GIVEN ME.' },
  arts: [{ at: .6, name: 'THE PAGE', line: 'ORIGIN UNVERIFIED. FIGHTS LIKE A LABOURER. LIT A FIRE ON THE THIRD DAY. HE HAD IT ALL, AND COULD NOT READ IT.', panel: 'kael', kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { at: .25, name: 'HOLLIS', line: 'A HALBERD IN THE BACK FOR HUMMING. HE FINISHED THE BAR HE WAS ON. THIS IS THE BAR.', panel: 'pipe', kind: 'rise', rgb: '255,120,60', hex: '#ff783c' }] });


MAPS.vcamp = buildMap({
  name: 'House Violet — the camp', w: 24, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(22,12,40,.38)',
  set: [[1, 7, 22, 1, ','], [3, 8, 1, 3, ','], [20, 6, 1, 1, ','], [12, 4, 1, 3, ',']],
  props: [{ t: 'vtent', x: 4, y: 4, a: '#7a5ac8', block: blk(4, 4, 2) }, { t: 'vtent', x: 8, y: 4, a: '#7a5ac8', block: blk(8, 4, 2) }, { t: 'vtent', x: 16, y: 4, a: '#7a5ac8', block: blk(16, 4, 2) },
    { t: 'standard', x: 12, y: 3, a: '#7a5ac8', block: blk(12, 3) }, { t: 'campfire', x: 12, y: 9, block: blk(12, 9) }, { t: 'woodpile', x: 20, y: 5, block: blk(20, 5) },
    { t: 'pumphouse', x: 2, y: 11, block: blk(2, 11, 2) }, { t: 'bedroll', x: 9, y: 10 }, { t: 'bedroll', x: 15, y: 11 }, { t: 'bedroll', x: 17, y: 9 }, { t: 'stakes', x: 19, y: 11, a: 3 }, { t: 'cairn', x: 22, y: 10, block: blk(22, 10) }, { t: 'cairn', x: 22, y: 11, block: blk(22, 11) }, { t: 'rankboard', x: 22, y: 4, a: 3, block: blk(22, 4) }, { t: 'rack', x: 6, y: 4, block: blk(6, 4) }],
  lights: [{ x: 200, y: 60, r: 70, c: '#c8b0ff' }, { x: 60, y: 150, r: 40, c: '#8ad8b0' }],
  hot: [{ id: 'fire', tiles: blk(12, 9) }, { id: 'wood', tiles: blk(20, 5) }, { id: 'pump', tiles: blk(2, 11, 2) }, { id: 'vstd', tiles: blk(12, 3) }, { id: 'tentA', tiles: blk(4, 4, 2) }, { id: 'tentB', tiles: blk(8, 4, 2) }, { id: 'tentC', tiles: blk(16, 4, 2) }, { id: 'cairn', tiles: blk(22, 10).concat(blk(22, 11)) }, { id: 'board', tiles: blk(22, 4) }, { id: 'rack', tiles: blk(6, 4) }], exits: []
});
MAPS.raid = buildMap({
  name: 'House Teal — the island', w: 30, h: 15, theme: 'valley', music: 'mystery', dark: 'rgba(4,6,18,.52)',
  set: [[6, 2, 2, 12, '~'], [6, 7, 2, 2, ','], [1, 7, 5, 1, ','], [8, 7, 19, 1, ','], [14, 5, 1, 2, ','], [12, 10, 1, 1, '#'], [17, 5, 1, 1, '#'], [21, 6, 1, 1, '#'], [15, 12, 1, 1, '#'], [24, 11, 1, 1, '#'], [10, 4, 1, 1, '#'], [18, 10, 1, 1, '#'], [25, 4, 1, 1, '#']],
  props: [{ t: 'pumphouse', x: 13, y: 4, block: blk(13, 4, 2) }, { t: 'vtent', x: 10, y: 11, a: '#3aa8a0', block: blk(10, 11, 2) }, { t: 'vtent', x: 19, y: 3, a: '#3aa8a0', block: blk(19, 3, 2) }, { t: 'vtent', x: 20, y: 11, a: '#3aa8a0', block: blk(20, 11, 2) },
    { t: 'teallamp', x: 10, y: 6, block: blk(10, 6) }, { t: 'teallamp', x: 17, y: 9, block: blk(17, 9) }, { t: 'teallamp', x: 23, y: 9, block: blk(23, 9) }, { t: 'teallamp', x: 24, y: 5, block: blk(24, 5) },
    { t: 'standard', x: 27, y: 7, a: '#3aa8a0', block: blk(27, 7) }, { t: 'bedroll', x: 21, y: 9, a: '#3aa8a0' }, { t: 'bedroll', x: 19, y: 12, a: '#3aa8a0' }, { t: 'stakes', x: 26, y: 4, a: 2 }, { t: 'stakes', x: 26, y: 11, a: 2 }, { t: 'cairn', x: 16, y: 3, a: '#3aa8a0', block: blk(16, 3) }, { t: 'cairn', x: 15, y: 2, a: '#3aa8a0', block: blk(15, 2) }, { t: 'strongbox', x: 28, y: 3, a: 1, block: blk(28, 3) }, { t: 'rankboard', x: 3, y: 5, a: 7, block: blk(3, 5) }],
  lights: [{ x: 168, y: 96, r: 54, c: '#ffe090' }, { x: 280, y: 146, r: 54, c: '#ffe090' }, { x: 376, y: 144, r: 54, c: '#ffe090' }, { x: 392, y: 80, r: 54, c: '#ffe090' }, { x: 224, y: 60, r: 30, c: '#8ad8b0' }],
  hot: [{ id: 'valve', tiles: blk(13, 4, 2) }, { id: 'std', tiles: blk(27, 7) }, { id: 'ttA', tiles: blk(10, 11, 2) }, { id: 'ttB', tiles: blk(19, 3, 2) }, { id: 'ttC', tiles: blk(20, 11, 2) }, { id: 'tcairn', tiles: blk(16, 3).concat(blk(15, 2)) }, { id: 'drop', tiles: blk(28, 3) }, { id: 'tboard', tiles: blk(3, 5) }], exits: []
});
MAPS.dais = buildMap({
  name: "The Proctors' dais", w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(6,6,20,.5)',
  set: [[8, 3, 12, 8, '='], [1, 8, 7, 1, ','], [4, 5, 1, 1, '#'], [5, 11, 1, 1, '#'], [22, 4, 1, 1, '#'], [22, 10, 1, 1, '#']],
  props: [{ t: 'canopy', x: 11, y: 4, a: 6 }, { t: 'lectern', x: 10, y: 4, a: 1, block: blk(10, 4) }, { t: 'lectern', x: 14, y: 4, a: 2, block: blk(14, 4) }, { t: 'lectern', x: 18, y: 4, a: 3, block: blk(18, 4) },
    { t: 'crate', x: 11, y: 7, block: blk(11, 7) }, { t: 'barrel', x: 16, y: 7, block: blk(16, 7) }, { t: 'crate', x: 13, y: 9, block: blk(13, 9) }, { t: 'barrel', x: 18, y: 9, block: blk(18, 9) }, { t: 'crate', x: 8, y: 6, block: blk(8, 6) },
    { t: 'teallamp', x: 8, y: 3, block: blk(8, 3) }, { t: 'teallamp', x: 19, y: 3, block: blk(19, 3) }, { t: 'standard', x: 21, y: 7, a: '#e8c25a', block: blk(21, 7) }, { t: 'rack', x: 14, y: 8, a: 1, block: blk(14, 8) }, { t: 'strongbox', x: 12, y: 5, block: blk(12, 5) }],
  lights: [{ x: 136, y: 50, r: 50, c: '#ffe090' }, { x: 312, y: 50, r: 50, c: '#ffe090' }, { x: 232, y: 70, r: 40, c: '#4ad8e0' }],
  hot: [{ id: 'book', tiles: blk(10, 4) }, { id: 'glass', tiles: blk(14, 4) }, { id: 'roster', tiles: blk(18, 4) }, { id: 'eye', tiles: blk(21, 7) }, { id: 'cloak', tiles: blk(11, 7).concat(blk(13, 9)) }, { id: 'boots', tiles: blk(14, 8) }, { id: 'wagers', tiles: blk(12, 5) }], exits: []
});
const CAMP_PUZZLE = { name: 'VIOLET CAMP · PUMP', tip: 'The heirs have water under their feet and no idea how to raise it. Feed every pipe, leave no open ends.', cols: 5, rows: 3, cells: [
  ['SRC:E:WELL', 'EW', 'SW', '', ''],
  ['', '', 'NS', '', ''],
  ['', '', 'NE', 'EW', 'OUT:W:CAMP']] };

const MF = k => G.flags['m_' + k], MSET = (k, v) => { G.flags['m_' + k] = v === undefined ? 1 : v; HUD.dirty = true; };
const mG = (id, x, y, dir, wander) => ({ id, patrol: 1, x: x * 16 + 8, y: y * 16 + 12, dir, home: dir, wander, wi: 0, wait: 1.2, anim: 0, moving: false, face: 0, barkCd: 99 });
const mS = (id, x, y, dir) => ({ id, x: x * 16 + 8, y: y * 16 + 12, dir, home: dir, anim: 0, moving: false, face: 0, barkCd: 99 });
const rage = n => { G.flags.fury = (G.flags.fury || 0) + (n || 1); };

const MISSIONS = {
  // Day three. Why House Violet follows him: not the Pairing. A fire.
  camp: {
    map: 'vcamp', spawn: [2, 7, 3], toast: 'House Violet has not eaten in three days.', hint: 'Talk to the cadets · a fight, a pump, a fire',
    calm: 1, npcs: () => [mS('petra', 10, 8, 3), mS('oswin', 15, 9, 2), mS('cadv1', 18, 8, 0), mS('cadv2', 7, 9, 1)].concat(MF('wood') ? [mS('thorne', 6, 9, 3)] : [mS('thorne', 21, 5, 2)]),
    obj: () => !MF('wood') ? 'Fetch wood from the pile (east). Somebody is sitting on it' : !MF('pump') ? 'Raise water at the pump house (south-west)' : 'Light the fire',
    mark: () => !MF('wood') ? { x: 20.5 * 16, y: 5 * 16, lab: 'WOOD' } : !MF('pump') ? { x: 3 * 16, y: 11 * 16, lab: 'PUMP' } : { x: 12.5 * 16, y: 9 * 16, lab: 'FIRE' },
    holds: t => false,
    use(t) {
      if (t.id === 'petra') return Dialogue.start(MF('petra') ? [say('petra', 'One is watching you do it. One is not too proud to watch.')] : [
        say('petra', 'Sorrel. You are the one who walked out of the Pairing with bread in your pack. Aldane\'s bread.'),
        say('kael', 'One has not eaten it.'),
        say('petra', 'No. Nobody could. ...There are forty of us and a valley full of deer and not one of us has ever lit a fire. At home one rings.'),
        say('petra', 'The Proctors will not come down. They hover up there on their boots and write. A House that cannot feed itself is a result, to them. They note it and price it.'),
        narr('Forty heirs of the people who ration my tier\'s air, and they are three days from starving beside a river. I ought to enjoy it more than I do.'),
        fx(() => MSET('petra'))]);
      if (t.id === 'oswin') return Dialogue.start(MF('oswin') ? [say('oswin', 'If you get that pump to draw, I shall carry the water myself. Do not tell my mother.')] : [
        say('oswin', 'You know what this is for? The Assay. My father told me the night before the lift.'),
        say('oswin', 'Twelve Houses send their heirs the year they come of age. One wins. The winner is given a post on the Spire. The rest of us go home and are told for the rest of our time exactly where we finished.'),
        say('oswin', 'He finished ninth. He has been ninth for thirty years. He signs things a man who finished eighth hands him.'),
        say('kael', 'And the ones who do not walk out of the Pairing?'),
        say('oswin', '...One does not ask. Their lines are closed. There is a word for it. Balanced.'),
        fx(() => Sound.play('heart')), narr('The same word. They use it on their own children. I had thought it was only ours.'),
        fx(() => { MSET('oswin'); rage(1); })]);
      if (t.id === 'cadv1') return Dialogue.start([narr('He is asleep sitting up, with a blade across his knees that he has never had to clean.')]);
      if (t.id === 'cadv2') return Dialogue.start([say('cadv2', 'One was told there would be servants. One was told a great many things. One was told the Assay is where a House learns what its heir is worth.'), say('cadv2', 'It is where the heir learns what the House is worth. Mine sent one cloak. It has the crest on it.'), narr('She is wearing it. She has not taken it off in three days. It is very fine, and it is not warm.')]);
      if (t.id === 'cairn') return Dialogue.start([narr('Two cairns. The heirs do not bury their dead; servants bury. So they piled stones the way a picture book once showed them, and tied a ribbon on.'), narr('Somebody has scratched BALANCED into the top stone. Somebody else has scratched it out with a knife, and then given up halfway.')]);
      if (t.id === 'board') return Dialogue.start([narr('The Proctors\' board. One is hammered in at the edge of every camp and repainted from the air each dawn. Twelve bars, one a House. Violet is eleventh.'), narr('Under the bars, in small clean script: POSITIONS ARE PROVISIONAL. DEBTS ARE NOT.'), narr('Below, the board is the shift rota, and the bars are us.')]);
      if (t.id === 'rack') return Dialogue.start([narr('Practice blades, issued blunt. On the first day a Proctor came down on his boots and showed them where the edge is kept, and which of them it was for.'), narr('Four blades, forty cadets. Somebody decided that before the lift came up.')]);
      if (t.id === 'tentA') return Dialogue.start([narr('A campaign chest with a House crest on the lid. Eleven changes of linen, a silver comb, a book of forms. No tinder. No pot. Somebody packed this for him, and nobody who packed it had ever been cold.')]);
      if (t.id === 'tentB') return Dialogue.start([narr('A slate propped on a bedroll, in a small child\'s hand: "MOTHER SAYS YOU ARE TO FINISH FIRST OR NOT COME HOME. BRING ME A STANDARD."'), narr('There is a sun drawn in the corner. A circle, and rays. They draw them too. I do not know why that should be the thing that gets under the wire.')]);
      if (t.id === 'tentC') return Dialogue.start([narr('Not a tent. The Proctors\' cache: salve, bread, lamp oil, under a white ribbon and a card. "NOT TO BE OPENED BY CADETS. A RESULT MUST BE EARNED."'), narr('It is forty paces from thirty hungry children. Nobody has touched the ribbon. They would sooner starve than be marked down.'), fx(() => { if (!MF('cache')) rage(1); MSET('cache'); })]);
      if (t.id === 'vstd') return Dialogue.start([narr('House Violet\'s standard. A pole, a square of cloth, a gold boss. Lose it and the House is struck from the Assay. They guard it better than they feed themselves.')]);
      if (t.id === 'thorne') return Dialogue.start(MF('wood') ? [say('thorne', '...Where does one put the pickets, Sorrel.'), narr('He asks it to the ground. It is the bravest thing he has done in three days.')] : [say('thorne', 'That is the captain\'s wood. One was elected captain on the lift. By acclaim.'), say('thorne', 'One is keeping it dry until one has decided what it is for.')]);
      if (t.id === 'wood') return Dialogue.start(MF('wood') ? [narr('Enough for tonight.')] : [narr('Somebody cut this before the Assay began and stacked it where the cadets would find it. They have walked past it for three days. One of them is sitting on it.'), say('thorne', 'Hands off, Sorrel. A minor House does not help itself. One was elected captain. One will say when there is to be a fire.'), say('kael', 'You do not know how to make one.'), say('thorne', '...Blades down. The Proctors mark a drawn blade inside one\'s own camp. I shall do this the other way.'), narr('Forty of them have come out to watch. He takes off his cloak and folds it. He has had a fencing master since he was six. Nobody has ever hit him in the mouth.'), fx(() => Mission.fight(FF.thorne(), () => { MSET('wood'); Mission.resetNPCs(); Dialogue.start([narr('He stays down. Not because he has to. Because nobody he knows has ever been knocked down, and he does not know what one does next.'), say('petra', 'House Violet appears to have a new captain. He is the one bleeding less.'), narr('I take an armful of the wood. It smells like nothing in Cinderwell. It smells like the inside of the leaf.')]); }))]);
      if (t.id === 'pump') { if (MF('pump')) return Dialogue.start([narr('It is drawing. Warm, and it will stay warm.')]);
        return Dialogue.start([narr('A pump house. Dressed stone, a wheel, a gauge. It is the only thing in this valley built like home.'), narr('Names are cut into the lintel, a row for every Assay. Hundreds. A few have a small gold nail beside them. Most have a line scored through. They keep a Count even here.'), narr('My hand is flat on the pipe before I think about it.'), fx(() => Puzzle.open([CAMP_PUZZLE], () => { MSET('pump'); G.mode = 'world'; Sound.music('mystery'); Dialogue.start([
          narr('It draws. The water comes up warm.'), fx(() => Sound.play('heart')),
          narr('Warm. There is only one thing under this rock that makes water warm. I know the line. I have bled it.'),
          narr('The Assay valley is the roof of Cinderwell. Their children are playing at war on top of Tier Four, and the pump they cannot work is fed off the same Array my tier is rationed from.'),
          narr('I stand there with my hand on the pipe and listen. Eleven hundred people, forty feet down. I cannot hear one of them.'),
          fx(() => rage(2))]); }))]); }
      if (t.id === 'fire') { if (!(MF('wood') && MF('pump'))) return Dialogue.start([narr(MF('wood') ? 'Wood, and no water to cook with. The pump first.' : 'A ring of stones somebody laid for them. Cold. It wants wood.')]);
        return Dialogue.start([narr('Flint off the pump housing. A curl of bark. Strike, strike, and breathe.')], () => World.seqStart('AABAAB', 'STRIKE  -  BREATHE', () => { MAPS.vcamp.props.find(p => p.t === 'campfire').a = 1; World.layer = renderMapLayer(World.map); MAPS.vcamp.lights.push({ x: 200, y: 150, r: 74, c: '#ffb050', m: 1 }); Sound.play('pillar'); Dialogue.start([
          narr('It catches. Seren taught me on a valve block, with ration fuel, when we were nine.'),
          say('petra', '...It is lit. He has lit it.'),
          say('oswin', 'How did you learn that, Sorrel?'),
          { choice: [
            { t: 'One was taught by somebody better.', then: [say('oswin', 'Then I should like to have met them.'), narr('No. You would have had her kneel.')] },
            { t: 'One was cold once.', then: [say('petra', 'Nobody is cold. It is not... Well. One supposes somebody must be.'), narr('She looked at the fire as if it had said something rude.')] }] },
          narr('They came out of the tents one at a time and sat down. Forty of them. Nobody gave an order. By morning they were asking me where to put the pickets.'),
          narr('I have thought about it since. They did not follow me because I walked out of the Pairing, or because I put Thorne on the grass. They followed me because I could light a fire. It is the cheapest thing I ever sold them.')], () => Mission.finish()); })); }
    },
    reset() { const f = MAPS.vcamp.props.find(p => p.t === 'campfire'); if (f) f.a = 0; MAPS.vcamp.lights = MAPS.vcamp.lights.filter(l => !l.m); }
  },
  // The night before day twenty-six. House Teal's island. The first time Kestrel Dray does not see his face.
  raid: {
    map: 'raid', spawn: [2, 7, 3], toast: 'Their lamps run off the vent stack. Find the valve.', hint: 'B: throw a pebble · hold A to work · watch the lamps turn',
    npcs: () => { const slow = MF('dark') ? 2.4 : 1.5, a = [
      mG('cadt1', 12, 8, 3, [[19, 8, 3, 1.4], [19, 13, 0, slow], [13, 13, 2, 1.4], [13, 8, 1, slow]]),
      mG('cadt2', 22, 4, 0, [[22, 4, 2, 2], [22, 4, 0, 1.6], [22, 11, 0, 1.5], [22, 11, 2, 2], [22, 4, 1, 1.4]]),
      mG('cadt1', 26, 9, 2, [[26, 9, 2, 2.2], [26, 9, 1, 1.7], [26, 9, 3, 1.3], [26, 9, 0, 1.7]])];
      if (MF('run')) return [mS('wren', 16, 5, 0)]; if (MF('dark')) { a.pop(); a.push(mS('wren', 16, 5, 0)); } return a; },
    obj: () => MF('run') ? 'RUN. Back across the ford (west) before the lamps come up: ' + Math.max(0, Math.ceil(MF('clock'))) : !MF('dark') ? "Shut the lamp valve at the pump house (north), unseen" : "Take House Teal's standard (east), unseen",
    mark: () => MF('run') ? { x: 4 * 16, y: 7.5 * 16, lab: 'FORD' } : !MF('dark') ? { x: 14 * 16, y: 4 * 16, lab: 'VALVE' } : { x: 27.5 * 16, y: 7 * 16, lab: 'STANDARD' },
    tick(dt) { if (!MF('run')) return; const c = MF('clock') - dt; if (Math.ceil(c) !== Math.ceil(MF('clock'))) { HUD.dirty = true; if (c < 6) Sound.play('heart'); } G.flags.m_clock = c;
      if (P.x < 5 * 16) { G.flags.m_run = 0; return Dialogue.start([narr('The ford. Cold to the knee. Behind me the first lamp comes up amber, and then a shout, and then all of them.'), narr('Thirty cadets awake around an empty socket in the ground. In the morning the Sisters Vey will come across the river for it, and for me.')], () => Mission.finish()); }
      if (c <= 0) { const n = G.flags.m_tries = (MF('tries') | 0) + 1; Sound.play('alarm'); World.fxFlash('#ffb040', .4); P.x = 26 * 16 + 8; P.y = 7 * 16 + 4; P.dir = 2; G.flags.m_clock = 15 + Math.min(8, n * 3); Dialogue.start([narr('The lamps come up while I am still among the tents, with their standard in my hands and nowhere to put it.'), narr(n > 1 ? 'Again. Straighter. Do not look at the tents.' : 'No. I was slow at the turn. Again, from the pole.')]); } },
    holds: t => (t.id === 'valve' && !MF('dark')) || (t.id === 'std' && MF('dark') && !MF('run')),
    respawn: () => MF('dark') ? [14, 6, 0] : [2, 7, 3],
    caught: k => [say('cadt1', ['HOLD. WHO IS THAT?', 'VIOLET! ON THE ISLAND!', 'THERE. BY THE WATER.'][k % 3]), narr(k >= 2 ? 'I am back in the reeds before the lamp finishes turning. They are tired. They are looking less carefully than they were.' : 'I go back into the reeds and the dark, and wait for them to decide it was a deer.')],
    use(t) {
      if (t.id === 'wren') return Dialogue.start([say('wren', 'Go on. One saw nothing. One is watching a gauge.')]);
      if (t.id === 'tcairn') return Dialogue.start([narr('House Teal\'s dead, behind the pump house where the lamps do not reach. Four cairns to our two. They are second on the board.'), narr('It is the same sum below. The tier that loses the most hands has the best figures.')]);
      if (t.id === 'drop') return Dialogue.start([narr('A white crate on a gilt cord, lowered from the air and not yet unhooked. PATRON\'S CREDIT, and a seal.'), narr('Lamp oil. A second cook-pot. Salve. House Violet has had nothing lowered to it in twenty-five days. Nobody placed a sum on us.')]);
      if (t.id === 'tboard') return Dialogue.start([narr('Their board faces the ford, so that we can read it. Teal second. Violet eleventh. It is repainted before either camp is awake.'), narr('The Proctors want this crossing. A House that will not raid is not a result.')]);
      if (t.id === 'ttA') return Dialogue.start([narr('Their captain\'s tent. He has ranked his own cadets on a board, one to forty, and hung it where all of them can read it. The bottom three names are underlined.')]);
      if (t.id === 'ttB') return Dialogue.start([narr('A cadet asleep with her boots on and a letter in her fist. "Darling. Your father and I have placed a sum on Teal. Do not embarrass it."'), fx(() => { if (!MF('letter')) rage(1); MSET('letter'); })]);
      if (t.id === 'ttC') return Dialogue.start([narr('Their cook-fire is a Proctor\'s lamp with the shade off. They never lit a real one either. They are only richer about it.')]);
      if (t.id === 'std') { if (MF('run')) return; if (!MF('dark')) return Dialogue.start([narr('Four lamps and a picket standing on it. Not while they can see.')]);
        return Dialogue.start([narr('I take the pole in both hands. It is lighter than a valve wheel.'), narr('Thirty cadets asleep around it who would have killed me for it at noon. In the dark they are only breathing. Everybody breathes the same in the dark.'), narr('A low whistle from the pump house, twice. The gauge is climbing. A quarter of a minute, perhaps, before the stack relights them.')], () => { MSET('run'); G.flags.m_clock = 15; Mission.resetNPCs(); World.grace = 99; HUD.toast('RUN. The ford, west.'); Sound.play('alarm'); }); }
      if (t.id === 'valve') { if (MF('dark')) return Dialogue.start([narr('Shut, and holding at two.')]);
        return Dialogue.start([
          narr('The vent stack comes up out of the rock here and they have run a gas line off it for their lamps. Somebody who knew what they were doing set this wheel.'),
          say('wren', 'Do not turn round.'),
          fx(() => Sound.play('heart')), narr('A voice behind me. Young. Not a cadet\'s. It did not have a blade in it.'),
          say('wren', 'One is not supposed to be here either. Apprentice to the Array board. I keep the stack while the heirs are playing.'),
          say('wren', 'You put your hand on the pipe first. Before the wheel. I have only ever seen one person do that.'),
          say('kael', 'One was taught by a careful man.'),
          say('wren', 'He was a technician from below. He fell in a furnace, they said. ...Forgive me. One does not say that. One does not say any of this.'),
          narr('She said "forgive me." Nobody up here says it. I kept my face to the wall. It was a new face, and I did not yet trust it not to answer her.'),
          say('wren', 'If you close that valve their lamps go out for an hour. I ought to call a Proctor. I find I should like to see whether it works.'),
          { choice: [
            { t: 'Then watch the gauge. It will drop to two and hold.', fx: () => { G.flags.wrenMet = 2; }, then: [narr('I close it. The needle falls to two, shivers, and holds.'), say('wren', '...Two. It held. How did you know it would hold?'), say('kael', 'Somebody has to care whether it does.'), narr('I heard her write that down.')] },
            { t: 'One saw nothing. Neither did you.', fx: () => { G.flags.wrenMet = 1; }, then: [narr('I close it. The needle falls to two and holds.'), say('wren', 'Granted. One is very good at seeing nothing. It is most of the training.')] }] },
          narr('Across the island House Teal\'s lamps go amber, and then out, one after another, like a tier at last bell.'),
          fx(() => { MSET('dark'); G.flags.heistEase = 1; const m = MAPS.raid; m.lights = m.lights.filter(l => l.c !== '#ffe090'); for (const p of m.props) if (p.t === 'teallamp') p.a = 1; World.layer = renderMapLayer(World.map); Mission.resetNPCs(); World.grace = 3; Sound.play('rotate'); HUD.toast('The lamps are out. The standard is east.'); })]); }
    },
    reset() { const m = MAPS.raid; if (!MF('dark')) { if (!m.lights0) m.lights0 = m.lights.slice(); m.lights = m.lights0.slice(); for (const p of m.props) if (p.t === 'teallamp') p.a = 0; } }
  },
  // The night before day thirty-one. What the Proctors are for, who is watching, and why Voss comes down in the morning.
  dais: {
    map: 'dais', spawn: [2, 8, 3], toast: 'The Proctors sleep on the ground like anybody. Read what they write.', hint: 'B: throw a pebble · hold A to work · watch the lamps turn',
    npcs: () => [mG('warden', 9, 10, 3, [[19, 10, 3, 1.6], [19, 6, 1, 1.8], [9, 6, 2, 1.6], [9, 10, 0, 1.8]]), mG('warden', 20, 11, 2, [[20, 11, 2, 2], [20, 11, 1, 1.5], [20, 5, 1, 1.6], [20, 5, 2, 2.2], [20, 11, 0, 1.2]])],
    obj: () => !MF('book') ? 'Read the grading book (north-west lectern), unseen' : !MF('glass') ? 'Look in the viewing glass (north lectern)' : 'Find your own page in the roster (hold)',
    mark: () => !MF('book') ? { x: 10.5 * 16, y: 4 * 16, lab: 'BOOK' } : !MF('glass') ? { x: 14.5 * 16, y: 4 * 16, lab: 'GLASS' } : { x: 18.5 * 16, y: 4 * 16, lab: 'ROSTER' },
    holds: t => t.id === 'roster' && MF('book') && MF('glass'),
    respawn: () => [2, 8, 3],
    caught: k => [say('warden', ['A CADET. ON THE DAIS.', 'YOU. BACK TO YOUR HOUSE.', 'NOTED.'][k % 3]), narr(k >= 2 ? 'They walk me to the edge of the marble and let go. A cadet out of bounds is a line in a book to them, not a threat. They do not even take my name. I go round again.' : 'A halberd butt between the shoulders, and the grass. Wardens above the rock hit exactly the way they do below it.')],
    use(t) {
      if (t.id === 'boots') return Dialogue.start([narr('Four pairs of boots on a rack, humming, set to charge off the same vent stack as the lamps. The Proctors do not walk to their work.'), narr('Thirty days they have hung over us on these and written. I look at the straps for a while. They are only straps.')]);
      if (t.id === 'wagers') return Dialogue.start([narr('A strongbox, not locked. Nobody up here locks anything; who would there be to lock it against.'), narr('A column for each Proctor: which House he is paid to find for, by whom, and how much. Voss has two names against his. One of them is Teal.'), narr('They are not grading the Assay. They are delivering it.')]);
      if (t.id === 'eye') return Dialogue.start([narr('The Proctors\' own standard. A gold sun with an open eye. It hangs over my tier\'s square as well. The same cloth. The same eye. I had half believed it would be a different one up here.')]);
      if (t.id === 'cloak') return Dialogue.start([narr('Crates, counted and sealed. Salve. Lamp oil. One is marked FOR THE VICTOR: a winter cloak, white, lined with gold.'), narr('Four hundred and eighty cadets came into this valley. They packed one cloak.')]);
      if (t.id === 'book') return Dialogue.start([
        narr('The grading book. Every cut in the valley has a line, and a price beside it. They do not grade the Assay. They invoice it.'),
        narr('House Teal: three standards credited before the first day. In the margin a patron\'s seal, and a sum.'),
        narr('House Violet: nothing. Nobody paid for us. I find I am proud of that, which is a stupid thing to be proud of.'),
        fx(() => Sound.play('heart')), narr('It is the Count. A smaller book and a greener valley, and the same columns. This is where they teach their children to keep it.'),
        fx(() => { if (!MF('book')) rage(1); MSET('book'); })]);
      if (t.id === 'glass') return Dialogue.start([
        narr('A viewing glass, warm from use. The valley from above, half a day old, with the dull parts cut out. The Spire watches its heirs the way my tier watches a festival.'),
        narr('There is a note pinned to the frame, in a hand I know. I have a tin at home with that hand on an invoice inside it.'),
        fx(() => Sound.play('heart')), narr('"My son is to reach the last day. No further than he can walk. C.A."'),
        narr('So she is watching. She watched the furnace the same way: from a little above, with the dull parts cut out.'),
        fx(() => { if (!MF('glass')) rage(2); MSET('glass'); })]);
      if (t.id === 'roster') { if (!(MF('book') && MF('glass'))) return Dialogue.start([narr('The roster. Four hundred and eighty names. I should know what I am looking for before I look for mine.')]);
        return Dialogue.start([
          narr('SORREL, E. House Violet.'),
          narr('"Origin unverified. Fights like a labourer. Lit a fire on the third day; no heir can. Recommend removal before the last day. H. Voss."'),
          narr('Removal. They have a furnace word for everything.'),
          narr('I tear the page out and fold it into my collar, next to the washer. He will notice by morning. Good. Let him come down off his dais and ask for it.')], () => Mission.finish()); }
    }
  }
};

const Mission = {
  def: null, key: null, done: null, prev: null,
  start(key, done) {
    const d = this.def = MISSIONS[key]; this.key = key; this.done = done || null;
    this.prev = { map: G.mapId, x: P.x, y: P.y, dir: P.dir, sheet: P.sheet, show: World.showPlayer, dark: World.darkOverride };
    G.flags = G.flags || {}; for (const k of Object.keys(G.flags)) if (k.startsWith('m_')) delete G.flags[k];
    G.heist = 3; G.flags.heistEase = 0; G.flags.mCaught = 0; UI.clear(); P.sheet = World.sheetFor(d.sheet || 'kael2'); World.showPlayer = true; World.darkOverride = null;
    if (d.reset) d.reset();
    World.load(d.map, { x: d.spawn[0] * 16 + 8, y: d.spawn[1] * 16 + 4, dir: d.spawn[2] }, true); G.mode = 'world'; this.reset(); Sound.music(MAPS[d.map].music);
    Fade.a = 1; Fade.dir = -1; Fade.sp = 1; Fade.busy = true; HUD.dirty = true;
    setTimeout(() => { if (G.heist === 3) HUD.toast(d.toast); }, 900);
  },
  resetNPCs() { World.npcs = this.def.npcs(); },
  reset() { if (this.def.reset) this.def.reset(); this.resetNPCs(); World.caughtT = 0; World.alert = 0; World.alertPeak = 0; World.work = 0; World.seenBy = null; World.grace = 2.2; },
  obj() { return this.def ? this.def.obj() : ''; },
  tick(dt) { if (this.def && this.def.tick && !Dialogue.active && !UI.stack.length) this.def.tick(dt); },
  fight(def, after) { Brawl.start(def, win => { G.mode = 'world'; HUD.dirty = true; after && after(win); }); },
  mark() { return this.def && this.def.mark ? this.def.mark() : null; },
  holds(t) { return !!(this.def && t && t.kind === 'hot' && this.def.holds(t)); },
  use(t) { this.def.use(t); },
  respawn() { const s = (this.def.respawn ? this.def.respawn() : this.def.spawn); return { x: s[0] * 16 + 8, y: s[1] * 16 + 4, dir: s[2] }; },
  caught(n) { const k = G.flags.mCaught = (G.flags.mCaught || 0) + 1; if (k >= 2) G.flags.heistEase = 1; Dialogue.start(this.def.caught ? this.def.caught(k, n) : [narr('Seen.')]); },
  finish() {
    if (G.heist !== 3) return; const pv = this.prev || {}, cb = this.done; this.done = null;
    G.heist = 0; G.flags.heistEase = 0; World.seq = null; World.bolt = null; World.ripple = null; World.dynLights = []; World.npcs = []; World.work = 0; World.alert = 0; for (const k of Object.keys(G.flags)) if (k.startsWith('m_')) delete G.flags[k]; if (this.def.reset) this.def.reset();
    if (Dialogue.active) Dialogue.end(); UI.clear();
    P.sheet = pv.sheet || P.sheet; World.showPlayer = pv.show; World.darkOverride = pv.dark || null;
    if (pv.map && MAPS[pv.map]) World.load(pv.map, { x: pv.x, y: pv.y, dir: pv.dir }, true);
    Sound.play('ok'); Fade.a = 1; Fade.dir = 0; Fade.busy = false; HUD.dirty = true;
    if (cb) cb(); else Game.toTitle();
  }
};

// ------------------------------------------------------------------ Part Two on foot: the Count hall, and the square five years on.
MAPS.counthall = buildMap({
  name: 'The Count hall — fourth ring', w: 24, h: 13, theme: 'spire', music: 'spire', dark: 'rgba(8,8,26,.42)',
  set: [[1, 7, 22, 1, ',']],
  props: [{ t: 'holes', x: 1, y: 3, a: 2, block: blk(1, 3, 2) }, { t: 'countbook', x: 11, y: 3, block: blk(11, 3, 2) }, { t: 'lectern', x: 22, y: 4, a: 3, block: blk(22, 4) },
    { t: 'cdesk', x: 4, y: 4, block: blk(4, 4, 2) }, { t: 'cdesk', x: 8, y: 5, block: blk(8, 5, 2) }, { t: 'cdesk', x: 15, y: 4, a: 1, block: blk(15, 4, 2) }, { t: 'cdesk', x: 19, y: 5, block: blk(19, 5, 2) },
    { t: 'cdesk', x: 3, y: 10, a: 1, block: blk(3, 10, 2) }, { t: 'cdesk', x: 8, y: 9, block: blk(8, 9, 2) }, { t: 'cdesk', x: 14, y: 10, block: blk(14, 10, 2) }, { t: 'cdesk', x: 20, y: 9, block: blk(20, 9, 2) }],
  lights: [{ x: 72, y: 168, r: 44, c: '#ffe090' }, { x: 264, y: 72, r: 48, c: '#ffe090' }, { x: 192, y: 52, r: 40, c: '#e8c25a' }, { x: 360, y: 60, r: 34, c: '#c8d8ff' }],
  hot: [{ id: 'shelf', tiles: blk(1, 3, 2) }, { id: 'count', tiles: blk(11, 3, 2) }, { id: 'tray', tiles: blk(22, 4) }, { id: 'marendesk', tiles: blk(15, 4, 2) }, { id: 'mydesk', tiles: blk(3, 10, 2) }, { id: 'motto', tiles: blk(6, 1, 2) }, { id: 'win', tiles: blk(17, 1) }, { id: 'deskA', tiles: blk(8, 5, 2) }, { id: 'deskB', tiles: blk(20, 9, 2) }], exits: []
});
MAPS.night5 = buildMap(Object.assign({}, SQUARE_DEF, { name: 'Ashgate Square — five years on', music: 'mystery', dark: 'rgba(6,4,14,.5)', hot: [{ id: 'pillarSun', tiles: blk(13, 8) }, { id: 'lift5', tiles: blk(12, 1, 2) }, { id: 'notice5', tiles: blk(7, 1, 2) }], exits: [] }));
Object.assign(MISSIONS, {
  // +5. "Lose it. Buy a day." Played.
  count: {
    map: 'counthall', spawn: [5, 11, 1], where: 'The Sun Spire · five years on', toast: 'After the bell. The order is in the Marshal\'s tray.', hint: 'B: drop a pen · hold A to work · stay out of the lamps',
    npcs: () => [mG('warden', 6, 7, 3, [[18, 7, 3, 1.6], [18, 11, 0, 1.8], [6, 11, 2, 1.6], [6, 7, 1, 1.8]]), mG('maren', 17, 5, 0, [[17, 5, 0, 3], [17, 5, 2, 1.8], [17, 5, 0, 3.4], [17, 5, 3, 1.6]]), mG('warden', 22, 9, 2, [[22, 9, 2, 2.2], [22, 9, 1, 1.8], [22, 9, 2, 2], [22, 9, 0, 1.4]])],
    obj: () => !MF('order') ? "Take the Tier Four order from the Marshal's tray (north-east), unseen" : 'Misfile it in the dead letters (north-west), unseen',
    mark: () => !MF('order') ? { x: 22.5 * 16, y: 4 * 16, lab: 'TRAY' } : { x: 2 * 16, y: 3 * 16, lab: 'DEAD LETTERS' },
    holds: t => (t.id === 'tray' && !MF('order')) || (t.id === 'shelf' && MF('order')),
    respawn: () => [5, 11, 1],
    caught: (k, n) => n && n.id === 'maren' ? [say('maren', 'Sorrel. One is working late. So, it appears, is one\'s colleague.'), narr(MF('order') ? 'She looked at my hands. They were empty. The order had gone inside my coat a breath before. She looked at the coat, too.' : 'She looked at my hands. They were empty. She went back to her column, and I went back to my chair, and we both pretended to count.'), fx(() => { G.flags.marenSaw = 1; })]
      : [say('warden', ['CLERK. THE HALL IS CLOSED.', 'YOUR DESK, CLERK.', 'NOTED.'][k % 3]), narr('A clerk out of his chair after the bell is not a crime up here. It is a note. I let him walk me back to my desk, and wait for his lamp to turn.')],
    use(t) {
      if (t.id === 'motto') return Dialogue.start([narr('Cut into the stone over the first row, and gilded: A BALANCED LINE IS A QUIET LINE.'), narr('Under it, smaller, older, half polished away: EVERY LINE IS A PERSON. Somebody had the first one cut over it. Somebody else, once, had cut the second.')]);
      if (t.id === 'win') return Dialogue.start([narr('A window. Night, and the weather under it like a floor. Under that, rock. Under that, a square with a Pillar in it, and a girl of twelve with chalk on her fingers.')]);
      if (t.id === 'deskA') return Dialogue.start([narr('Clerk Third\'s desk. A dish of surface greens, half eaten, going soft. Nell skims four crates in forty for a ward of forty children. He has left more than that on the plate.'), fx(() => { if (!MF('greens')) rage(1); MSET('greens'); })]);
      if (t.id === 'deskB') return Dialogue.start([narr('A child\'s drawing, pinned inside the kneehole where no auditor would look. A house. A tall person. A small person. A yellow circle.'), narr('So they draw it yellow as well.')]);
      if (t.id === 'mydesk') return Dialogue.start([narr('My desk. Fourth ring, third row. Eleven hundred lines waiting in the morning tray, and a pen I have worn a groove in.')]);
      if (t.id === 'count') return Dialogue.start([narr('The Count. Open, always. They do not lock it. Who up here would want to change it?'), narr('I know the page without looking. "Holloway, S. Tier Six. Air owed: balanced." The ink of the strike is browner than the rest. It was done with a different pen.'), fx(() => Sound.play('heart')), narr('Below it, in my own hand, four hundred and six lines I have struck since. I learned every one. It does not help them. It is the only thing I have that is not a lie.'), fx(() => { if (!MF('count')) rage(2); MSET('count'); })]);
      if (t.id === 'marendesk') return Dialogue.start([narr('Maren Aldane\'s desk. Her lamp is still lit. She has left a second book open under the day\'s columns, and it is not the Count.'), narr('Sealed pairings. The Assay of four years ago. A ribbon at one page, and two names on it.'), fx(() => Sound.play('heart')), narr('"Aldane, D. Sorrel, E." She has underlined neither. She has drawn a small careful box around both, the way one marks a sum that does not come out.'), fx(() => MSET('saw'))]);
      if (t.id === 'tray') { if (MF('order')) return Dialogue.start([narr('Empty. He will ask in the morning where it went.')]);
        return Dialogue.start([narr('Marshal Cade\'s tray. One order, eleven hundred lines, sanded and sealed and waiting for a clerk.'), narr('It weighs nothing. I had thought it would weigh something.'), fx(() => { MSET('order'); Sound.play('coin'); Mission.resetNPCs(); World.grace = 2.5; HUD.toast('Now lose it. The dead letters, north-west.'); })]); }
      if (t.id === 'shelf') { if (!MF('order')) return Dialogue.start([narr('The dead letters. Everything the Spire has ever written to somebody it had already struck. Nobody has opened a slot in years.')]);
        return Dialogue.start([narr('Row nine, slot four. Behind a petition from Tier Five that somebody answered eleven years late.'), narr('One day. They will find it by tomorrow evening and call it clerical. Dace has until then to get as many as he can up a nine-floor riser.'), narr('It is the first thing I have done in this hall that Seren would have recognised.')], () => Mission.finish()); }
    }
  },
  // +5, below. Tavi is twelve. Somebody still puts the sun back.
  sun: {
    map: 'night5', spawn: [6, 13, 1], sheet: 'tavi', where: 'Cinderwell · five years after the furnace', toast: 'Sull scrubs it off every rest day. Put it back.', hint: 'B: throw a bolt · hold A to work · watch the lamps turn',
    npcs: () => { const slow = G.flags.heistEase ? 2.6 : 1.6; return [mG('proctor', 9, 6, 3, [[17, 6, 0, 1.4], [17, 11, 2, slow], [9, 11, 1, slow], [9, 6, 3, 1.4]]), mG('watchman', 13, 12, 2, [[13, 12, 2, 2], [13, 12, 1, 1.6], [13, 12, 3, 2], [13, 12, 1, 1.6]]), mS('fen', 20, 14, 1), mS('kit', 24, 10, 2)]; },
    obj: () => "Chalk Seren's sun back on the Pillar, unseen",
    mark: () => ({ x: 13.5 * 16, y: 8 * 16, lab: 'PILLAR' }),
    holds: t => false,
    respawn: () => [6, 13, 1],
    caught: k => k >= 2 ? [say('proctor', "Brennick. The small one. ...Go home. I didn't see you. I'm seeing less every year."), narr("He's been on this beat since before I could reach the wheel. He turned his lamp the other way and kept it there.")] : [say('proctor', ['YOU. STOP THERE.', 'WHO IS THAT?'][k % 2]), narr("Back behind the stall. He never checks the stall. Kael told me that when I was seven.")],
    use(t) {
      if (t.id === 'fen') return Dialogue.start([say('fen', "Go on, little one. I'm only coughing. Coughing's not a report.")]);
      if (t.id === 'kit') return Dialogue.start([say('kit', "Freight Three goes up nine floors. Sign still says six. Tell your brother, if he's anywhere.")]);
      if (t.id === 'lift5') return Dialogue.start([narr("Lift Zero. It came down empty once, with a leaf in it. I've still got the leaf. It's gone brown and I've still got it.")]);
      if (t.id === 'notice5') return Dialogue.start([narr('"COMMITTED: K. BRENNICK. FAILED SEAL, FURNACE LINE. LET THE ACCOUNT BALANCE." Five years old and they have never taken it down.'), narr("Mara says there's nothing in his tin. She says it like it's good news and won't say why.")]);
      if (t.id === 'pillarSun') return Dialogue.start([
        narr("Orin's chalk. Engineer's gold. You're not supposed to have it, which is how you know it's the right colour."),
        narr("Round first. Then the rays. She did seventeen. I counted them on our wall every night till Kael went, and then I counted them for him."),
        narr("You do them to the shift song or they come out crooked. Seven notes. Everybody knows that.")], () => World.seqStart('ABAABBA', 'SEVEN RAYS', () => Dialogue.start([
        fx(() => Sound.play('heart')),
        narr("He said he'd find out if it's yellow. He never said. So I do it yellow till somebody tells me different."),
        narr("Sull will scrub it off on rest day. He takes longer over it every year. Last time he left one ray.")], () => Mission.finish())));
    }
  }
});

// ------------------------------------------------------------------ The night before the last day. Nobody to hide from.
const VC2 = {
  name: 'House Violet — the last night', w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(8,8,24,.44)',
  set: [[1, 7, 20, 1, ','], [12, 4, 1, 3, ','], [22, 2, 2, 11, '~'], [21, 7, 1, 1, ',']],
  props: [{ t: 'vtent', x: 3, y: 4, a: '#7a5ac8', block: blk(3, 4, 2) }, { t: 'vtent', x: 7, y: 4, a: '#7a5ac8', block: blk(7, 4, 2) }, { t: 'vtent', x: 16, y: 4, a: '#3aa8a0', block: blk(16, 4, 2) }, { t: 'vtent', x: 4, y: 11, a: '#7a5ac8', block: blk(4, 11, 2) }, { t: 'vtent', x: 16, y: 11, a: '#3aa8a0', block: blk(16, 11, 2) },
    { t: 'standard', x: 11, y: 3, a: '#7a5ac8', block: blk(11, 3) }, { t: 'standard', x: 13, y: 3, a: '#3aa8a0', block: blk(13, 3) }, { t: 'standard', x: 14, y: 3, a: '#c8782a', block: blk(14, 3) },
    { t: 'campfire', x: 12, y: 9, a: 1, block: blk(12, 9) }, { t: 'woodpile', x: 9, y: 10, block: blk(9, 10) }, { t: 'bedroll', x: 14, y: 10 }, { t: 'bedroll', x: 8, y: 8 }, { t: 'bedroll', x: 18, y: 9, a: '#3aa8a0' }, { t: 'bluff', x: 18, y: 2, w: 4, h: 1, block: blk(18, 2, 4, 2) }, { t: 'stakes', x: 19, y: 11, a: 2 }, { t: 'cairn', x: 9, y: 12, block: blk(9, 12) }, { t: 'cairn', x: 10, y: 12, block: blk(10, 12) }, { t: 'cairn', x: 11, y: 12, a: '#3aa8a0', block: blk(11, 12) }, { t: 'rankboard', x: 20, y: 9, a: 0, block: blk(20, 9) }],
  lights: [{ x: 200, y: 150, r: 80, c: '#ffb050' }, { x: 200, y: 50, r: 46, c: '#c8b0ff' }, { x: 350, y: 110, r: 44, c: '#a8c8ff' }, { x: 64, y: 70, r: 20, c: '#ffc880' }, { x: 272, y: 70, r: 20, c: '#ffc880' }, { x: 80, y: 182, r: 20, c: '#ffc880' }],   // three tents with somebody awake in them
  hot: [{ id: 'fire2', tiles: blk(12, 9) }, { id: 'stds', tiles: blk(11, 3).concat(blk(13, 3, 2)) }, { id: 'wnote', tiles: blk(9, 10) }, { id: 'ridge', tiles: blk(19, 4, 2) }, { id: 'tentQ', tiles: blk(4, 11, 2) }, { id: 'cairns', tiles: blk(9, 12, 3) }, { id: 'board2', tiles: blk(20, 9) }], exits: []
};
MAPS.vcamp2 = buildMap(VC2);
MAPS.vcamp3 = buildMap(Object.assign({}, VC2, { name: 'House Violet — night twenty-eight', dark: 'rgba(6,6,22,.48)' }));
const EVE_N = () => ['petra', 'oswin', 'teal', 'lucan'].filter(k => MF('e_' + k)).length;
Object.assign(MISSIONS, {
  eve: {
    calm: 1, map: 'vcamp2', spawn: [2, 7, 3], toast: 'Tomorrow, the keep. Nobody is sleeping.', hint: 'Walk the camp · talk to whoever is awake',
    npcs: () => [mS('petra', 10, 6, 0), mS('oswin', 14, 11, 1), mS('cadt1', 18, 8, 2), mS('lucan', 21, 7, 2), mS('cadv1', 6, 9, 3), mS('cadv2', 9, 12, 1)],
    obj: () => EVE_N() < 3 ? 'Walk the camp. Speak to those who are awake (' + EVE_N() + '/4)' : 'Sit down at the fire (hold)',
    mark: () => EVE_N() < 3 ? null : { x: 12.5 * 16, y: 9 * 16, lab: 'FIRE' },
    holds: t => t.id === 'fire2' && EVE_N() >= 3,
    use(t) {
      if (t.id === 'petra') return Dialogue.start([
        say('petra', 'Pickets are set. Two on the ford, four on the ridge path. One checked them oneself.'),
        say('petra', 'Forty-six days ago I could not light a fire. I have killed two people since. One notes the order in which one learned things.'),
        say('kael', 'Which do you wish you had learned first?'),
        say('petra', '...The fire. One could have stopped there, and been somebody who knew how to make a fire.'),
        narr('She is eighteen. By winter she will keep a column of the Count, and she will be good at it, and I will sit two rows behind her and never once say I remember this.'), fx(() => MSET('e_petra'))]);
      if (t.id === 'oswin') return Dialogue.start([
        say('oswin', 'Do not look at the leg. The Proctors have a salve. They will bring it down when the Assay is over and not before. It would not be a result otherwise.'),
        say('oswin', 'My father finished ninth. If you take the keep tomorrow I shall have finished second, behind a man who lit a fire. He will never recover from it.'),
        say('oswin', '...Noted, Sorrel. That is the word, is it not. I have said it all my time. I do not think I ever meant it before.'),
        narr('It is their only word for thanks, and it means: I have written down what you owe me. He meant the other thing. He did not have a word for it. None of them do.'), fx(() => { MSET('e_oswin'); rage(1); })]);
      if (t.id === 'cadt1') return Dialogue.start([
        say('cadt1', 'You are wondering why thirty of Teal sleep under a Violet standard. Our House was bought before the first day. Three standards credited. Our captain told us so, to hearten us.'),
        say('cadt1', 'One found one did not want to win something already paid for. Yours was only hungry. Hungry is at least one\'s own.'),
        narr('He has no idea how close that is to something Mara would say. I do not tell him. He would have to be told who Mara is, and then what a tier is, and then why.'), fx(() => MSET('e_teal'))]);
      if (t.id === 'cadv1' || t.id === 'cadv2') return Dialogue.start([narr(t.id === 'cadv1' ? 'She is oiling a blade she will use tomorrow on somebody she sat beside at lessons. She is humming. I know it. It is the shift song, in a bright key, with a turn on the end I have never heard. She says it is the Count-Out, a nursery game. One, two, the line is true. Her nurse sang it, and her nurse before. They took it up the lift with them when they left us down there, and forgot whose it was.' : 'He is writing a letter by the fire. The Proctors read them all. He knows. He is writing it anyway.')]);
      if (t.id === 'cairns') return Dialogue.start([narr('Nine of ours now, and the row has been started again behind it for the thirty who came over from Teal. They build them properly. Petra showed them; I showed Petra.'), narr('Not one has BALANCED on it. I did not ask for that. They stopped by themselves around day thirty.')]);
      if (t.id === 'board2') return Dialogue.start([narr('The board. Violet is first. It has been repainted so many times the wood has swollen.'), narr('POSITIONS ARE PROVISIONAL. After tomorrow they are not. Oswin\'s father has looked at a board like this one for thirty years.')]);
      if (t.id === 'wnote') return Dialogue.start([narr('Tucked under the top log, where only somebody who builds the fire would look: a strip of gauge paper, in an engineer\'s square hand.'), narr('"Stack pressure, two. It has held twenty-four days. Whoever you are: why did you care whether it would? W.H."'), narr('I put it in my collar with the page and the washer. It is getting crowded in there.')]);
      if (t.id === 'stds') return Dialogue.start([narr('Three standards now. Violet, Teal, and Amber, who came in on day thirty-four without a blade drawn. Each of them is a House that stopped existing because I picked up a pole.'), narr('It is exactly how the Count works. I am learning their trade by doing it to their children.')]);
      if (t.id === 'lucan') return Dialogue.start(MF('e_lucan') ? [say('lucan', 'Until the morning, Sorrel.')] : [
        narr('He is standing on the far bank under a white cloth, alone, with his blade left on the stones behind him. Lucan Aurel. The High Auditor\'s son.'),
        say('lucan', 'I asked for the truce. The Proctors are annoyed. They cannot grade a conversation.'),
        say('lucan', 'Tomorrow I hold the keep and you come up the ridge, and my mother watches. I should like, once, to have spoken to you where it does not count.'),
        say('lucan', 'You fight as if you hate the ground you are standing on. Nobody taught us that. Where does one learn it?'),
        { choice: [
          { t: 'One learns it by being under it.', fx: () => { rage(1); }, then: [say('lucan', '...I do not understand that.'), say('kael', 'No.'), say('lucan', 'I should like to. I think that is the difference between us, and I think it is not to my credit.'), narr('He is eighteen and he meant it. It is the most dangerous thing anybody said to me in fifty days. It is very hard to hate somebody who would like to understand.')] },
          { t: 'One had a good teacher.', then: [say('lucan', 'Mine told me the first cut is a question and the second is the answer. Yours seems to have skipped the question.'), narr('He smiled. He has his mother\'s mouth, and none of what she does with it.')] }] },
        say('lucan', 'She says I am kind. She says it the way one reports a fault in a casting. Until the morning, Sorrel.'), fx(() => MSET('e_lucan'))]);
      if (t.id === 'fire2') { if (EVE_N() < 3) return Dialogue.start([narr('The fire I taught them. Somebody has kept it in for forty-six days. Not yet. Walk the lines first.')]);
        return Dialogue.start([
          narr('I sit down. The pack is under my knees. I know what is at the bottom of it.'),
          fx(() => Sound.play('heart')),
          narr('Dorian Aldane\'s bread. Half a heel, forty days old. He broke it on the lift and gave me the larger piece, and said: one ought to go up on something.'),
          narr('It is a stone. I eat it. All of it. It takes most of an hour, and it is the worst thing I have ever done slowly.'),
          narr('Tomorrow I take the keep, and they pin gold on me, and I go to work for the woman who burned my wife. That was always the plan. Tonight it is only a fire, and I am the one who knows how.'),
          narr('Hands, Kael. Everything is hands.')], () => Mission.finish()); }
    }
  }
});

// ------------------------------------------------------------------ Night twenty-eight. Somebody in the camp is lighting a lamp on the ridge.
const LAMP_N = () => ['petra', 'merrow', 'oswin', 'corin', 'stores', 'ridge', 'tent'].filter(k => MF('l_' + k)).length;
const LAMP_READY = () => MF('l_stores') && MF('l_ridge') && MF('l_tent');
Object.assign(MISSIONS, {
  lamp: {
    calm: 1, map: 'vcamp3', spawn: [2, 7, 3], toast: 'Three raids in three nights. Each one came where the pickets were not.', hint: 'Ask questions · look at things · then name somebody at the fire',
    npcs: () => [mS('petra', 10, 6, 0), mS('oswin', 14, 11, 1), mS('merrow', 18, 8, 2), mS('corin', 6, 9, 3), mS('cadv1', 9, 12, 1)],
    obj: () => LAMP_READY() ? 'You have seen enough. Name them at the fire' : 'Somebody is signalling from the ridge. Ask, and look (' + LAMP_N() + '/7)',
    mark: () => LAMP_READY() ? { x: 12.5 * 16, y: 9 * 16, lab: 'FIRE' } : null,
    holds: t => false,
    use(t) {
      const L = k => fx(() => MSET('l_' + k));
      if (t.id === 'petra') return Dialogue.start([
        say('petra', 'Three nights. Each time they came where the line was thinnest. One set those pickets oneself, and told nobody but the council. That is four people, Sorrel. You are one of them.'),
        say('petra', 'I stood the ford with Merrow from dusk until the second watch. He will say so. One dislikes needing a Teal to say so.'),
        narr('Four people. Petra, Oswin, Corin who keeps the stores, and me. And thirty of House Teal under our standard, who were told nothing and hear everything.'), L('petra')]);
      if (t.id === 'merrow') return Dialogue.start([
        say('merrow', 'You will want it to be one of us. Thirty of Teal asleep under a Violet standard. Who else? One would think it too.'),
        say('merrow', 'I stood the ford with Lune from dusk to the second watch. Ask her. Then ask yourself who gains if Violet turns on its Teal the week before the keep.'),
        narr('He is right, and he knows I know it. That is the cleverest part of the whole thing. Whoever lit that lamp lit it knowing where everybody would look.'), L('merrow')]);
      if (t.id === 'oswin') return Dialogue.start([
        say('oswin', 'If you are looking at prints, it is not my leg you want. The Vey girl opened the right one, two days ago. I have been dragging the right ever since, and I should be obliged if you did not stare.'),
        say('oswin', 'I was on the council when the pickets were set. I know how that sounds. I have known you twenty-five days and it has been the best-fed month of my time. One does not sell that.'), L('oswin')]);
      if (t.id === 'corin') return Dialogue.start([
        say('corin', 'Stores are in order. One counts them twice a day. Lamp oil, eleven flasks. Salve, none. Bread, four days. Write it down if you like.'),
        say('corin', 'It will be one of the Teal. It is always the ones who came over. A man who changes his House once has learned how.'),
        narr('He does not look up from his slate. He has a clerk\'s hand. Neat sevens.'), L('corin')]);
      if (t.id === 'cadv1') return Dialogue.start([narr('She was on the ridge picket the first night. She saw a light, she says, and thought it was a Proctor. Everybody thinks everything is a Proctor.')]);
      if (t.id === 'cairns') return Dialogue.start([narr('Six cairns. Two of them are from this week, from raids that came where the pickets were not.'), narr('Whoever is selling the watch has walked past these every night to do it.')]);
      if (t.id === 'board2') return Dialogue.start([narr('Violet: fourth. Three raids in three nights and we have dropped two places.'), narr('Somebody is reading this board from the other side of the river and being paid by the bar.')]);
      if (t.id === 'wnote') return Dialogue.start([narr('The stores, under an oilcloth beside the woodpile. Bread. Rope. Lamp oil.'), narr('I count nine flasks. Corin\'s tally says eleven.'), L('stores')]);
      if (t.id === 'ridge') return Dialogue.start([narr('The top of the ridge path, where it looks down on Teal\'s old allies across the valley. Bootprints in the wet. Narrow. The left heel drags a groove.'), narr('Beside them, a ring in the grass where a lamp stood, and three burnt matches. Three nights.'), L('ridge')]);
      if (t.id === 'tentQ') return Dialogue.start([narr('The quartermaster\'s tent. Everything squared. Under the bedroll, a second slate: three strokes, and beside each a number in a neat hand.'), narr('They are our picket counts. Ford, ridge, river. All three nights.'), fx(() => Sound.play('heart')), narr('And a boot, set to dry by the pole. The left heel is worn through on the outside.'), L('tent')]);
      if (t.id === 'stds') return Dialogue.start([narr('Two standards, and a gap where the third will go if we live. Violet. Teal. Whoever is on the ridge at night would like there to be one.')]);
      if (t.id === 'fire2') { if (!LAMP_READY()) return Dialogue.start([narr('Not yet. If I name somebody at this fire and I am wrong, forty people will remember it longer than they remember the raids.')]);
        const duel = wrong => fx(() => Mission.fight(wrong ? Object.assign(FF.corin(), { sub: 'CORIN ASHBY, AND THE PICKETS HE SOLD US TO', foes: FF.corin().foes.concat([{ id: 'cadt1', name: 'Teal picket', kind: 'cadet', hp: 14 }, { id: 'cadt2', name: 'Teal picket', kind: 'lancer', hp: 14 }]) }) : FF.corin(), () => Dialogue.start([
          narr(wrong ? 'It took the three of them down to do it, and it was up on the ridge in the dark, where nobody saw. That is what the wrong name cost: nobody saw.' : 'In front of all of them, at their own fire. That is what the right name bought.'),
          narr('He is on his knees in the wet with his blade a yard from his hand. Nobody has moved. Forty of them, and the fire, and the rain starting.'),
          say('corin', 'It is not a betrayal. One wishes you would stop looking at it as one. A debt was called. One paid it with what one had. You were what one had.'),
          narr('It is the most honest thing an Accredited has said to me. That is what I am going to be to all of them. What they had.'),
          { choice: [
            ...(wrong ? [] : [0]).map(() => ({ t: 'Keep him. Let him light the lamp, and say what one tells him.', fx: () => { G.flags.corin = 'kept'; rage(1); }, then: [narr('I gave him back his slate and told him what to write on it. Three false picket counts, three more nights. He wrote them in his neat hand. He was grateful. That was the worst of it.'), narr('It is what Celestine would have done. I noticed that, and did it anyway.')] })),
            { t: wrong ? 'Turn him out of the valley. Barefoot. (There is nothing else left to do with him.)' : 'Turn him out of the valley. Barefoot.', fx: () => { G.flags.corin = 'out'; }, then: [...(wrong ? [narr('I could not keep him to write lies for me. Forty people had watched me name the wrong man; nobody would have believed a lamp I vouched for.')] : []), narr('I took his boots and sent him up the ridge path he liked so well. A cadet who leaves the valley is struck from the Assay. His father\'s debt will stand. I did not ask what that means for his father.')] },
            ] },
          narr(wrong ? 'I had named the wrong one first. Nobody has said so since. They only looked at each other, that night, a little longer than they used to.' : 'They only looked at each other, that night, a little longer than they used to. I had done that as well, by being right.'),
          narr('Somebody paid for that lamp. A cadet\'s father does not owe a debt that size to another cadet. He owes it to somebody who can write in the grading book.')], () => Mission.finish())));
        const nameIt = () => Dialogue.start([
          narr('Forty of them round the fire. Thirty Teal at the edge of the light, not sitting. Everybody knows why I have called them.'),
          narr('I get one name. If it is the right one, he is caught here in the light with nowhere to go. If it is the wrong one, the right one will be over the ridge before I can say a second.'),
          { choice: [
            { t: 'Corin Ashby. The oil, the slate, the left heel.', then: [say('corin', '...Nine flasks. You counted. Nobody counts.'), say('corin', 'My father owes a Proctor. One does not say which. The debt is struck if Violet finishes below Teal\'s patron. It is only arithmetic, Sorrel.'), say('kael', 'It is always only arithmetic.'), narr('He stood up, and he drew. I had not thought he would. He had been afraid for twenty-five days, and it had made him quick.'), fx(() => { HUD.toast('The right name. He is caught at the fire: single combat.'); Sound.play('clue'); }), duel(0)] },
            { t: 'Merrow. It is always the ones who came over.', fx: () => { G.flags.lampWrong = 1; rage(1); }, then: [say('merrow', 'There it is. One wondered how long a Violet standard would stay kind.'), say('petra', 'He was on the ford with me, Sorrel. From dusk. One said so.'), narr('I had said Corin\'s own words back to forty people, in my own mouth. Corin was looking at his slate. Then he was not. Then he was running for the ridge, and that was all the answer anybody needed.'), narr('Merrow took nine of the thirty and walked out before dawn. I did not stop them. I had no right left to.'), fx(() => { HUD.toast('The wrong name. Corin reaches his pickets: three to fight, and he cannot be kept.'); Sound.play('deny'); }), duel(1)] },
            { t: 'Oswin Hale. The prints drag.', fx: () => { G.flags.lampWrong = 1; rage(1); }, then: [say('oswin', 'The right, Sorrel. I told you. The right.'), narr('He said it quietly. He pulled the dressing off in front of all of them, and it was the right, and I have not forgotten his face.'), narr('In the quiet, somebody behind the stores put down a slate and began to walk, and then to run. Corin Ashby. That was all the answer anybody needed.'), narr('Oswin did not carry water for me again. He carried it. Not for me.'), fx(() => { HUD.toast('The wrong name. Corin reaches his pickets: three to fight, and he cannot be kept.'); Sound.play('deny'); }), duel(1)] }] }]);
        if (MF('circle')) return nameIt(); MSET('circle'); return Mission.fight(walkCircle(), () => nameIt()); }
    }
  }
});

// what a thing is called, shown over it as he comes up to it: several of these were hard to tell from the grass
const HOTN = { fire: 'THE FIRE', wood: 'WOODPILE', pump: 'PUMP HOUSE', vstd: 'VIOLET STANDARD', tentA: 'TENT', tentB: 'TENT', tentC: 'TENT', cairn: 'CAIRNS', board: "PROCTORS' BOARD", rack: 'BLADE RACK', valve: 'LAMP VALVE', std: "TEAL'S STANDARD", ttA: 'TENT', ttB: 'TENT', ttC: 'TENT', tcairn: 'CAIRNS', drop: "PATRON'S DROP", tboard: "TEAL'S BOARD",
  book: 'GRADING BOOK', glass: 'VIEWING GLASS', roster: 'ROSTER', eye: 'THE WATCHER', cloak: 'WHITE CLOAK', boots: 'BOOT RACK', wagers: 'STRONGBOX', fire2: 'THE FIRE', stds: 'STANDARDS', wnote: 'STORES', ridge: 'RIDGE PATH', tentQ: "QUARTERMASTER'S TENT", cairns: 'CAIRNS', board2: "PROCTORS' BOARD",
  shelf: 'DEAD LETTERS', count: 'THE COUNT', tray: "MARSHAL'S TRAY", marendesk: "MAREN'S DESK", mydesk: 'MY DESK', motto: 'THE MOTTO', win: 'WINDOW', pillarSun: 'THE PILLAR', lift5: 'LIFT ZERO', notice5: 'NOTICES',
  kwash: 'WASH-HOUSE', kdoor5: 'K-5', kdoorM: "K-9 · MARA'S", kdoor11: 'K-11', kdoor13: 'K-13 · SEALED', ksuns: 'THE LEDGE', kwall: "MARA'S WALL", ktap: 'RATION TAP', kbarrel: 'BARRELS', kpost: 'THE POST', khop: 'THE SQUARES', ktub: 'WASH TUB', kbench: 'THE BENCH' };

/* ---------- places you walk in depth: flat figures, a camp round you. They add to the story and change none of it. ---------- */
function walkCircle() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 3, d2: 1, title: 'THE CIRCLE', sub: 'NIGHT TWENTY-EIGHT', bg: 'storm', arena: { kind: 'ring', rx: 190, ry: 72 }, music: 'mystery', hero: { id: 'kael2', hp: 9, pow: 2, blade: 0, fury0: 0 },
    walk: { id: 'circle', spawn: [-150, 34], clear: 200,
      obj: k => k.n ? 'THEY ARE WAITING. THE FIRE, WHEN I AM READY.' : 'FORTY OF THEM, AND NOBODY SITTING. WALK THE CIRCLE, OR GO TO THE FIRE.',
      floor(g) { g.fillStyle = 'rgba(70,50,34,.55)'; g.beginPath(); g.ellipse(256, 256, 112, 54, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(40,28,22,.6)'; g.beginPath(); g.ellipse(256, 256, 30, 15, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(20,14,12,.7)'; g.beginPath(); g.ellipse(256, 256, 14, 7, 0, 0, 6.3); g.fill();
        g.fillStyle = 'rgba(70,50,34,.4)'; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(256 - 112 - i * 6, 256 + 12 + Math.sin(i * .5) * 6, 9, 4, 0, 0, 6.3); g.fill(); } },
      props: [{ t: 'fire', x: 0, y: 0, k: 1 },
        { t: 'tent', x: -196, y: -62, c: '#7a5ac8', k: 1 }, { t: 'tent', x: -120, y: -88, c: '#7a5ac8', k: 2 }, { t: 'tent', x: 30, y: -96, c: '#7a5ac8', k: 3 }, { t: 'tent', x: 150, y: -84, c: '#2aa6a0', k: 4 }, ...Array.from({ length: 14 }, (_, i) => ({ t: 'tree', x: -260 + i * 40 + (i * 13) % 17, y: -120 - (i * 7) % 30, k: i, h: 64 + (i * 11) % 24 })),
        { t: 'banner', x: -50, y: -78, c: '#7a5ac8', k: 1 }, { t: 'banner', x: -30, y: -80, c: '#2aa6a0', k: 2 },
        ...[[150, 4], [164, -14], [170, 22], [182, 2], [156, 36], [144, -30]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(i % 2 ? 'cadt2' : 'cadt1'), k: i + 20 }))],
      npcs: [
        ...Array.from({ length: 13 }, (_, i) => { const a = (-30 + i * 20) * Math.PI / 180, j = (i * 7) % 5 - 2; return { id: i % 3 === 2 ? 'cadv2' : 'cadv1', x: Math.cos(a) * (92 + j * 3), y: -Math.sin(a) * (46 + j * 2), r: 9 }; }),
        N('petra', -50, -16, 'PETRA LUNE', [say('petra', 'Forty of us, and nobody has sat down. One has seen that once before: the morning they read the pairings.'), narr('She has her slate under her arm. She is the only one here who looked at the fire before she looked at me.')]),
        N('oswin', 52, -14, 'OSWIN HALE', [say('oswin', 'One brought the water up before anybody asked. It seemed the night for it.'), narr('He is standing on the leg. He will not let any of them see him favour it.')]),
        N('corin', -58, 10, 'CORIN ASHBY', [say('corin', 'One has the tally here, should it be wanted. Eleven flasks.'), narr('Eleven. He says it the way a man says his own name.')]),
        N('merrow', 128, 12, 'MERROW', [say('merrow', 'Thirty of us at the edge of your light, Sorrel. Notice that nobody has asked us to come nearer.'), narr('Nobody has. That is mine to mend, and it will not be mended tonight.')]),
        N('cadv1', 34, 28, 'A CADET IN A BORROWED CLOAK', [say('cadv1', 'Is it true that below the rock they burn their dead? One heard it from a porter. One did not believe it.'), narr('They burn more than their dead. I told her I had heard the same.')])],
      spots: [
        { id: 'fire', x: 0, y: 2, r: 15, reach: 34, ph: 30, name: 'THE FIRE', verb: 'SAY THE NAME', exit: 1, talk: () => [] },
        { id: 'stds', x: -40, y: -70, r: 8, reach: 28, ph: 60, name: 'THE STANDARDS', verb: 'LOOK', talk: () => [narr('Two standards, and a gap for a third. Below, nobody ever called forty people to a fire. They called us to a furnace. We stood in rows there as well, and nobody sat.'), narr('It is the same silence. I did not expect to find it up here. I had thought it was ours.')] }] } };
}
function walkSquare() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 0, title: 'ASHGATE SQUARE', sub: 'AN ORDINARY NIGHT, A YEAR AND MORE AGO', bg: 'ring', arena: { kind: 'ring', rx: 150, ry: 66 }, music: 'home',
    walk: { id: 'square', spawn: [-96, 30], keep: q => q.t === 'lamp',
      obj: k => k.n >= 3 ? 'NOTHING HAPPENED THAT NIGHT. THE CHALK SUN, WHEN I CAN LET IT GO.' : 'LAST BELL JUST GONE. EVERYBODY IS WHERE THEY ALWAYS WERE.',
      props: [...[[-128, -18], [118, 34], [-40, 52], [140, -8]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(['pell', 'juno', 'marrow', 'kit'][i]), k: i + 1 }))],
      npcs: [
        N('seren', -18, -8, 'SEREN', [say('seren', "Hold the lamp steady, valve man. A sun wants all its rays or it's just a spider."), say('you', 'How many is all?'), say('seren', "More than they've got brushes for."), narr('She had chalk to the elbow. The Authority scrubbed it off every week, and every week she said that was only them making room.')]),
        N('tavi', 44, 12, 'TAVI', [say('tavi', "Kael! Bao's doing the broth with the green in it. Real green. I saw."), say('you', "That's onion top, Tav."), say('tavi', "It's GREEN."), narr('Tavi was six and had never seen a leaf. Neither had I. I stood there and told a child what was and was not green.')]),
        N('bao', -86, -22, 'BAO', [say('bao', "Two bowls and one for the small one. Put the stamp away, I know your face."), narr('He stamped the card anyway, afterwards, when he thought I was not looking. Everybody on Tier Six kept their accounts straight. It was the only thing we were ever praised for.')]),
        N('hollis', 84, -16, 'HOLLIS', [narr('Hollis, on the bench by the east lamp, humming the shift song through his teeth to keep time on nothing at all.'), say('hollis', "Habit. Twelve hours on the wheel and the tune won't get out of your jaw. Your Seren hums it a third high. Tell her it's wrong and I like it.")]),
        N('mara', -8, 38, 'MARA', [say('mara', "Last bell's gone, the pair of you. Proctor walks at the quarter. If he finds chalk on her hands it's a week's air for both, and I'll not sign for it."), say('you', 'Aye, Mara.'), narr('She said it every night. Every night she stood between us and the east arch until the chalk was dry.')]),
        N('ivo', 108, 22, 'IVO', [say('ivo', "Cart's got a wheel going. Hear that? That's the sound of me pushing it uphill tomorrow. Give us a hand, Kael."), narr('I gave him a hand. I had a great many evenings, then, and I spent them like a man who thinks the meter is broken in his favour.')])],
      spots: [{ id: 'sun', x: 0, y: 4, r: 6, reach: 22, ph: 14, name: 'THE CHALK SUN', verb: 'LET IT GO', exit: 1, talk: () => [narr('That is all of it. Nothing happened that night. I have gone back to it more often than to the wedding.')] }] } };
}
FF.circle = walkCircle; FF.square = walkSquare;
