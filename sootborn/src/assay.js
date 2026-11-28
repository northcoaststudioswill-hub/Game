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
  voice: { at: [[1, 'HE ATE AT MY FIRE FOR TWENTY-FIVE DAYS AND COUNTED MY PICKETS WHILE HE CHEWED.'], [10, 'MARA HELD ME DOWN. HARL WENT UNDER THE FLOOR. I HAD THOUGHT I WAS DONE BEING SURPRISED BY WHO.'], [20, 'HE IS GOOD. HE IS BETTER THAN THORNE. FEAR IS A BETTER MASTER THAN A FENCING MASTER.']], hurt: 'THAT ONE WAS FOR HIS FATHER. I CAN TELL.', fury: 'THREE NIGHTS. THREE RAIDS. OSWIN\'S LEG.', half: 'HE IS CRYING. HE HAS NOT STOPPED CUTTING. I KNOW THAT ONE TOO.', eleven: 'ELEVEN. HE COUNTED OUR PICKETS. I COUNT THIS.' },
  arts: [{ at: .5, name: 'HELD DOWN', line: 'THE PEOPLE WHO LOVED ME HELD ME DOWN WHILE THE DOORS CLOSED. THAT WAS LOVE. THIS IS ONLY A DEBT.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28' }] });
FF.voss2d = () => ({ era: 3, d2: 1, title: 'ON THE GROUND', sub: 'HALDEN VOSS - HIS BOOTS ARE CUT', bg: 'storm', arena: { kind: 'ring', rx: 104, ry: 46 }, music: 'duel', legend: 1, skip: 1, rage: 3, winText: 'NOBODY TOUCHES AN ASSAYER',
  hero: { id: 'kael2', hp: 9, pow: 2, blade: 1, fury0: 80 }, taunt: { 0: ['THERE IS NO COLUMN FOR THIS.', 'YOU WILL BE STRUCK FROM EVERY BOOK.', 'I AM AN ASSAYER.'] },
  foes: [{ id: 'voss', name: 'Assayer Voss', kind: 'baton', hp: 60, sc: 1.1, k2: { triple: 1 } }],
  voice: { at: [[1, 'HE IS ON THE GROUND WITH THE REST OF US. THE STRAPS ARE CUT. HE DOES NOT KNOW HOW TO STAND IN MUD.'], [9, 'THIRTY DAYS HE HOVERED UP THERE AND WROTE. NOW HE HAS TO LOOK UP TO SEE ME.'], [18, 'HE SWINGS LIKE BRAND. OF COURSE HE DOES. BRAND WAS TAUGHT BY MEN LIKE THIS.']], hurt: 'A HALBERD BUTT. BETWEEN THE SHOULDERS. THE SAME PLACE. EVERY TIME.', fury: 'RECOMMEND REMOVAL. HE WROTE THAT. ABOUT ME.', half: 'HE HAS STOPPED SAYING ASSAYER. HE IS SAYING PLEASE. THEY DO HAVE THE WORD.', eleven: 'ELEVEN. ONE FOR EVERY SECOND HE WOULD HAVE GIVEN ME.' },
  arts: [{ at: .6, name: 'THE PAGE', line: 'ORIGIN UNVERIFIED. FIGHTS LIKE A LABOURER. LIT A FIRE ON THE THIRD DAY. HE HAD IT ALL, AND COULD NOT READ IT.', panel: 'kael', kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { at: .25, name: 'HOLLIS', line: 'A HALBERD IN THE ARM FOR HUMMING. HE FINISHED THE BAR HE WAS ON. THIS IS THE BAR.', panel: 'pipe', kind: 'rise', rgb: '255,120,60', hex: '#ff783c' }] });


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
  name: "The Assayers' dais", w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(6,6,20,.5)',
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
        say('petra', 'No. Nobody could. ...There are forty in this House and a valley full of deer, and not one has ever lit a fire. At home one rings.'),
        say('petra', 'The Assayers will not come down. They hover up there on their boots and write. A House that cannot feed itself is a result, to them. They note it and price it.'),
        narr('Forty heirs of the people who ration my tier\'s air, and they are three days from starving beside a river. I ought to enjoy it more than I do.'),
        fx(() => MSET('petra'))]);
      if (t.id === 'oswin') return Dialogue.start(MF('oswin') ? [say('oswin', 'If you get that pump to draw, I shall carry the water myself. Do not tell my mother.')] : [
        say('oswin', 'You know what this is for? The Assay. My father told me the night before the lift.'),
        say('oswin', 'Twelve Houses send their heirs the year they come of age. One wins. The winner is given a post on the Spire. The rest go home and are told for the rest of their time exactly where they finished.'),
        say('oswin', 'He finished ninth. He has been ninth for thirty years. He signs things a man who finished eighth hands him.'),
        say('kael', 'And the ones who do not walk out of the Pairing?'),
        say('oswin', '...One does not ask. Their lines are closed. There is a word for it. Balanced.'),
        fx(() => Sound.play('heart')), narr('The same word. They use it on their own children. I had thought it was only ours.'),
        fx(() => { MSET('oswin'); rage(1); })]);
      if (t.id === 'cadv1') return Dialogue.start([narr('He is asleep sitting up, with a blade across his knees that he has never had to clean.')]);
      if (t.id === 'cadv2') return Dialogue.start([say('cadv2', 'One was told there would be servants. One was told a great many things. One was told the Assay is where a House learns what its heir is worth.'), say('cadv2', 'It is where the heir learns what the House is worth. Mine sent one cloak. It has the crest on it.'), narr('She is wearing it. She has not taken it off in three days. It is very fine, and it is not warm.')]);
      if (t.id === 'cairn') return Dialogue.start([narr('Two cairns. The heirs do not bury their dead; servants bury. So they piled stones the way a picture book once showed them, and tied a ribbon on.'), narr('Somebody has scratched BALANCED into the top stone. Somebody else has scratched it out with a knife, and then given up halfway.')]);
      if (t.id === 'board') return Dialogue.start([narr('The Assayers\' board. One is hammered in at the edge of every camp and repainted from the air each dawn. Twelve bars, one a House. Violet is eleventh.'), narr('Under the bars, in small clean script: POSITIONS ARE PROVISIONAL. DEBTS ARE NOT.'), narr('Below, the board is the shift rota, and the bars are us.')]);
      if (t.id === 'rack') return Dialogue.start([narr('Practice blades, issued blunt. On the first day an Assayer came down on his boots and showed them where the edge is kept, and which of them it was for.'), narr('Four blades, forty cadets. Somebody decided that before the lift came up.')]);
      if (t.id === 'tentA') return Dialogue.start([narr('A campaign chest with a House crest on the lid. Eleven changes of linen, a silver comb, a book of forms. No tinder. No pot. Somebody packed this for him, and nobody who packed it had ever been cold.')]);
      if (t.id === 'tentB') return Dialogue.start([narr('A slate propped on a bedroll, in a small child\'s hand: "MOTHER SAYS YOU ARE TO FINISH FIRST OR NOT COME HOME. BRING ME A STANDARD."'), narr('There is a sun drawn in the corner. A circle, and rays. They draw them too. I do not know why that should be the thing that gets under the wire.')]);
      if (t.id === 'tentC') return Dialogue.start([narr('Not a tent. The Assayers\' cache: salve, bread, lamp oil, under a white ribbon and a card. "NOT TO BE OPENED BY CADETS. A RESULT MUST BE EARNED."'), narr('It is forty paces from forty hungry children. Nobody has touched the ribbon. They would sooner starve than be marked down.'), fx(() => { if (!MF('cache')) rage(1); MSET('cache'); })]);
      if (t.id === 'vstd') return Dialogue.start([narr('House Violet\'s standard. A pole, a square of cloth, a gold boss. Lose it and the House is struck from the Assay. They guard it better than they feed themselves.')]);
      if (t.id === 'thorne') return Dialogue.start(MF('wood') ? [say('thorne', '...Where does one put the pickets, Sorrel.'), narr('He asks it to the ground. It is the bravest thing he has done in three days.')] : [say('thorne', 'That is the captain\'s wood. One was elected captain on the lift. By acclaim.'), say('thorne', 'One is keeping it dry until one has decided what it is for.')]);
      if (t.id === 'wood') return Dialogue.start(MF('wood') ? [narr('Enough for tonight.')] : [narr('Somebody cut this before the Assay began and stacked it where the cadets would find it. They have walked past it for three days. One of them is sitting on it.'), say('thorne', 'Hands off, Sorrel. A minor House does not help itself. One was elected captain. One will say when there is to be a fire.'), say('kael', 'You do not know how to make one.'), say('thorne', '...Blades down. The Assayers mark a drawn blade inside one\'s own camp. I shall do this the other way.'), narr('Forty of them have come out to watch. He takes off his cloak and folds it. He has had a fencing master since he was six. Nobody has ever hit him in the mouth.'), fx(() => Mission.fight(FF.thorne(), () => { MSET('wood'); Mission.resetNPCs(); Dialogue.start([narr('He stays down. Not because he has to. Because nobody he knows has ever been knocked down, and he does not know what one does next.'), say('petra', 'House Violet appears to have a new captain. He is the one bleeding less.'), narr('I take an armful of the wood. It smells like nothing in Cinderwell. It smells like the inside of the leaf.')]); }))]);
      if (t.id === 'pump') { if (MF('pump')) return Dialogue.start([narr('It is drawing. Warm, and it will stay warm.')]);
        return Dialogue.start([narr('A pump house. Dressed stone, a wheel, a gauge. It is the only thing in this valley built like home.'), narr('Names are cut into the lintel, a row for every Assay. Hundreds. A few have a small gold nail beside them. Most have a line scored through. They keep a Count even here.'), narr('My hand is flat on the pipe before I think about it.'), fx(() => Puzzle.open([CAMP_PUZZLE], () => { MSET('pump'); G.mode = 'world'; Sound.music('mystery'); Dialogue.start([
          narr('It draws. The water comes up warm.'), fx(() => Sound.play('heart')),
          narr('Warm. There is only one thing under this rock that makes water warm. I know the line. I have bled it.'),
          narr('The Assay valley is the roof of Cinderwell. Their children are playing at war on top of Tier Four, and the pump they cannot work is fed off the same Array my tier is rationed from.'),
          narr('I stand there with my hand on the pipe and listen. Eleven hundred people, nine floors down. I cannot hear one of them.'),
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
      if (t.id === 'tboard') return Dialogue.start([narr('Their board faces the ford, so that we can read it. Teal second. Violet eleventh. It is repainted before either camp is awake.'), narr('The Assayers want this crossing. A House that will not raid is not a result.')]);
      if (t.id === 'ttA') return Dialogue.start([narr('Their captain\'s tent. He has ranked his own cadets on a board, one to forty, and hung it where all of them can read it. The bottom three names are underlined.')]);
      if (t.id === 'ttB') return Dialogue.start([narr('A cadet asleep with her boots on and a letter in her fist. "Darling. Your father and I have placed a sum on Teal. Do not embarrass it."'), fx(() => { if (!MF('letter')) rage(1); MSET('letter'); })]);
      if (t.id === 'ttC') return Dialogue.start([narr('Their cook-fire is an Assayer\'s lamp with the shade off. They never lit a real one either. They are only richer about it.')]);
      if (t.id === 'std') { if (MF('run')) return; if (!MF('dark')) return Dialogue.start([narr('Four lamps and a picket standing on it. Not while they can see.')]);
        return Dialogue.start([narr('I take the pole in both hands. It is lighter than a valve wheel.'), narr('Thirty cadets asleep around it who would have killed me for it at noon. In the dark they are only breathing. Everybody breathes the same in the dark.'), narr('A low whistle from the pump house, twice. The gauge is climbing. A quarter of a minute, perhaps, before the stack relights them.')], () => { MSET('run'); G.flags.m_clock = 15; Mission.resetNPCs(); World.grace = 99; HUD.toast('RUN. The ford, west.'); Sound.play('alarm'); }); }
      if (t.id === 'valve') { if (MF('dark')) return Dialogue.start([narr('Shut, and holding at two.')]);
        return Dialogue.start([
          narr('The vent stack comes up out of the rock here and they have run a gas line off it for their lamps. Somebody who knew what they were doing set this wheel.'),
          say('wren', 'Do not turn round.'),
          fx(() => Sound.play('heart')), narr('A voice behind me. Young. Not a cadet\'s. It did not have a blade in it.'),
          say('wren', 'One is not supposed to be here either. Junior on the Array board. They give the stack to whoever is newest, while the heirs are playing.'),
          say('wren', 'You put your hand on the pipe first. Before the wheel. I have only ever seen one person do that.'),
          say('kael', 'One was taught by a careful man.'),
          say('wren', 'He was a technician from below. He fell in a furnace, they said. ...Forgive me. One does not say that. One does not say any of this.'),
          narr('She said "forgive me." Nobody up here says it. I kept my face to the wall. It was a new face, and I did not yet trust it not to answer her.'),
          say('wren', 'If you close that valve their lamps go out for an hour. I ought to call an Assayer. I find I should like to see whether it works.'),
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
    map: 'dais', spawn: [2, 8, 3], toast: 'The Assayers sleep on the ground like anybody. Read what they write.', hint: 'B: throw a pebble · hold A to work · watch the lamps turn',
    npcs: () => [mG('warden', 9, 10, 3, [[19, 10, 3, 1.6], [19, 6, 1, 1.8], [9, 6, 2, 1.6], [9, 10, 0, 1.8]]), mG('warden', 20, 11, 2, [[20, 11, 2, 2], [20, 11, 1, 1.5], [20, 5, 1, 1.6], [20, 5, 2, 2.2], [20, 11, 0, 1.2]])],
    obj: () => !MF('book') ? 'Read the grading book (north-west lectern), unseen' : !MF('glass') ? 'Look in the viewing glass (north lectern)' : 'Find your own page in the roster (hold)',
    mark: () => !MF('book') ? { x: 10.5 * 16, y: 4 * 16, lab: 'BOOK' } : !MF('glass') ? { x: 14.5 * 16, y: 4 * 16, lab: 'GLASS' } : { x: 18.5 * 16, y: 4 * 16, lab: 'ROSTER' },
    holds: t => t.id === 'roster' && MF('book') && MF('glass'),
    respawn: () => [2, 8, 3],
    caught: k => [say('warden', ['A CADET. ON THE DAIS.', 'YOU. BACK TO YOUR HOUSE.', 'NOTED.'][k % 3]), narr(k >= 2 ? 'They walk me to the edge of the marble and let go. A cadet out of bounds is a line in a book to them, not a threat. They do not even take my name. I go round again.' : 'A halberd butt between the shoulders, and the grass. Wardens above the rock hit exactly the way they do below it.')],
    use(t) {
      if (t.id === 'boots') return Dialogue.start([narr('Four pairs of boots on a rack, humming, set to charge off the same vent stack as the lamps. The Assayers do not walk to their work.'), narr('Thirty days they have hung over us on these and written. I look at the straps for a while. They are only straps.')]);
      if (t.id === 'wagers') return Dialogue.start([narr('A strongbox, not locked. Nobody up here locks anything; who would there be to lock it against.'), narr('A column for each Assayer: which House he is paid to find for, by whom, and how much. Voss has two names against his. One of them is Teal.'), narr('They are not grading the Assay. They are delivering it.')]);
      if (t.id === 'eye') return Dialogue.start([narr('The Assayers\' own standard. A gold sun with an open eye. It hangs over my tier\'s square as well. The same cloth. The same eye. I had half believed it would be a different one up here.')]);
      if (t.id === 'cloak') return Dialogue.start([narr('Crates, counted and sealed. Salve. Lamp oil. One is marked FOR THE VICTOR: a winter cloak, white, lined with gold.'), narr('Four hundred and eighty cadets came out of the first night. They packed one cloak.')]);
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
    if (d.reset) d.reset(); $('#game').style.filter = d.grey ? 'grayscale(.82) contrast(1.08) brightness(1.05)' : '';
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
    if (Dialogue.active) Dialogue.end(); UI.clear(); $('#game').style.filter = '';
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
MAPS.night5 = buildMap(Object.assign({}, SQUARE_DEF, { name: 'Ashgate Square · five years after the furnace', music: 'mystery', dark: 'rgba(6,4,14,.5)', hot: [{ id: 'pillarSun', tiles: blk(13, 8) }, { id: 'lift5', tiles: blk(12, 1, 2) }, { id: 'notice5', tiles: blk(7, 1, 2) }], exits: [] }));
Object.assign(MISSIONS, {
  // +5. "Lose it. Buy a day." Played.
  count: {
    map: 'counthall', sheet: 'kaelc', spawn: [5, 11, 1], where: 'The Sun Spire · five years after the furnace', toast: 'After the bell. The order is in the Marshal\'s tray.', hint: 'B: drop a pen · hold A to work · stay out of the lamps',
    npcs: () => [mG('warden', 6, 7, 3, [[18, 7, 3, 1.6], [18, 11, 0, 1.8], [6, 11, 2, 1.6], [6, 7, 1, 1.8]]), mG('maren', 17, 5, 0, [[17, 5, 0, 3], [17, 5, 2, 1.8], [17, 5, 0, 3.4], [17, 5, 3, 1.6]]), mG('warden', 22, 9, 2, [[22, 9, 2, 2.2], [22, 9, 1, 1.8], [22, 9, 2, 2], [22, 9, 0, 1.4]])],
    obj: () => !MF('order') ? "Take the Tier Four order from the Marshal's tray (north-east), unseen" : 'Misfile it in the dead letters (north-west), unseen',
    mark: () => !MF('order') ? { x: 22.5 * 16, y: 4 * 16, lab: 'TRAY' } : { x: 2 * 16, y: 3 * 16, lab: 'DEAD LETTERS' },
    holds: t => (t.id === 'tray' && !MF('order')) || (t.id === 'shelf' && MF('order')),
    respawn: () => [5, 11, 1],
    caught: (k, n) => n && n.id === 'maren' ? [say('maren', 'Sorrel. One is working late. So, it appears, is one\'s colleague.'), narr(MF('order') ? 'She looked at my hands. They were empty. The order had gone inside my coat a breath before. She looked at the coat, too.' : 'She looked at my hands. They were empty. She went back to her column, and I went back to my chair, and we both pretended to count.'), fx(() => { G.flags.marenSaw = 1; })]
      : [say('warden', ['CLERK. THE HALL IS CLOSED.', 'YOUR DESK, CLERK.', 'NOTED.'][k % 3]), narr('A clerk out of his chair after the bell is not a crime up here. It is a note. I let him walk me back to my desk, and wait for his lamp to turn.')],
    use(t) {
      if (t.id === 'motto') return Dialogue.start([narr('Cut into the stone over the first row, and gilded: A BALANCED LINE IS A QUIET LINE.'), narr('Under it, smaller, older, half polished away: EVERY LINE IS A PERSON. Somebody had the first one cut over it. Somebody else, once, had cut the second.')]);
      if (t.id === 'win') return Dialogue.start([narr('A window. Night, and the weather under it like a floor. Under that, rock. Under that, a square with a Pillar in it, and a boy of twelve with chalk on his fingers.')]);
      if (t.id === 'deskA') return Dialogue.start([narr('Clerk Third\'s desk. A dish of surface greens, half eaten, going soft. Nell skims four crates in forty for a ward of forty children. He has left more than that on the plate.'), fx(() => { if (!MF('greens')) rage(1); MSET('greens'); })]);
      if (t.id === 'deskB') return Dialogue.start([narr('A child\'s drawing, pinned inside the kneehole where no auditor would look. A house. A tall person. A small person. A yellow circle.'), narr('So they draw it yellow as well.')]);
      if (t.id === 'mydesk') return Dialogue.start([narr('My desk. Fourth ring, third row. Eleven hundred lines waiting in the morning tray, and a pen I have worn a groove in.')]);
      if (t.id === 'count') return Dialogue.start([narr('The Count. Open, always. They do not lock it. Who up here would want to change it?'), narr('I know the page without looking. "Holloway, S. Tier Six. Air owed: balanced." The ink of the strike is browner than the rest. It was done with a different pen.'), fx(() => Sound.play('heart')), narr('Below it, in my own hand, a hundred and forty lines I have struck since. I learned every one. It does not help them. It is the only thing I have that is not a lie.'), fx(() => { if (!MF('count')) rage(2); MSET('count'); })]);
      if (t.id === 'marendesk') return Dialogue.start([narr('Maren Aldane\'s desk. Her lamp is still lit. She has left a second book open under the day\'s columns, and it is not the Count.'), narr('Sealed pairings. Last year\'s Assay. A ribbon at one page, and two names on it.'), fx(() => Sound.play('heart')), narr('"Aldane, D. Sorrel, E." She has underlined neither. She has drawn a small careful box around both, the way one marks a sum that does not come out.'), fx(() => MSET('saw'))]);
      if (t.id === 'tray') { if (MF('order')) return Dialogue.start([narr('Empty. He will ask in the morning where it went.')]);
        return Dialogue.start([narr('Marshal Cade\'s tray. One order, eleven hundred lines, sanded and sealed and waiting for a clerk.'), narr('It weighs nothing. I had thought it would weigh something.'), fx(() => { MSET('order'); Sound.play('coin'); Mission.resetNPCs(); World.grace = 2.5; HUD.toast('Now lose it. The dead letters, north-west.'); })]); }
      if (t.id === 'shelf') { if (!MF('order')) return Dialogue.start([narr('The dead letters. Everything the Spire has ever written to somebody it had already struck. Nobody has opened a slot in years.')]);
        return Dialogue.start([narr('Row nine, slot four. Behind a petition from Tier Five that somebody answered eleven years late.'), narr('One day. They will find it by tomorrow evening and call it clerical. Harl has until then to get as many as he can up a nine-floor riser.'), narr('It is the first thing I have done in this hall that Seren would have recognised.')], () => Mission.finish()); }
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
      if (t.id === 'notice5') return Dialogue.start([narr('"COMMITTED: K. BRENNICK. FAILED SEAL, FURNACE LINE. LET THE ACCOUNT BALANCE." Near five years old and they have never taken it down.'), narr("Mara says there's nothing in his tin. She says it like it's good news and won't say why.")]);
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
    calm: 1, map: 'vcamp2', spawn: [2, 7, 3], sheet: 'kael3', toast: 'Tomorrow, the keep. Nobody is sleeping.', hint: 'Walk the camp · talk to whoever is awake',
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
        say('oswin', 'Do not look at the leg. The Assayers have a salve. They will bring it down when the Assay is over and not before. It would not be a result otherwise.'),
        say('oswin', 'My father finished ninth. If you take the keep tomorrow I shall have finished second, behind a man who lit a fire. He will never recover from it.'),
        say('oswin', '...Noted, Sorrel. That is the word, is it not. I have said it all my time. I do not think I ever meant it before.'),
        narr('It is their only word for thanks, and it means: I have written down what you owe me. He meant the other thing. He did not have a word for it. None of them do.'), fx(() => { MSET('e_oswin'); rage(1); })]);
      if (t.id === 'cadt1') return Dialogue.start([
        say('cadt1', 'You are wondering why thirty of Teal sleep under a Violet standard. One\'s House was bought before the first day. Three standards credited. The captain said so, to hearten one.'),
        say('cadt1', 'One found one did not want to win something already paid for. Yours was only hungry. Hungry is at least one\'s own.'),
        narr('He has no idea how close that is to something Mara would say. I do not tell him. He would have to be told who Mara is, and then what a tier is, and then why.'), fx(() => MSET('e_teal'))]);
      if (t.id === 'cadv1' || t.id === 'cadv2') return Dialogue.start([narr(t.id === 'cadv1' ? 'He is oiling a blade she will use tomorrow on somebody she sat beside at lessons. She is humming. I know it. It is the shift song, in a bright key, with a turn on the end I have never heard. She says it is the Count-Out, a nursery game. One, two, the line is true. Her nurse sang it, and her nurse before. They took it up the lift with them when they left us down there, and forgot whose it was.' : 'He is writing a letter by the fire. The Assayers read them all. He knows. He is writing it anyway.')]);
      if (t.id === 'cairns') return Dialogue.start([narr('Nine of ours now, and the row has been started again behind it for the thirty who came over from Teal. They build them properly. Petra showed them; I showed Petra.'), narr('Not one has BALANCED on it. I did not ask for that. They stopped by themselves around day thirty.')]);
      if (t.id === 'board2') return Dialogue.start([narr('The board. Violet is first. It has been repainted so many times the wood has swollen.'), narr('POSITIONS ARE PROVISIONAL. After tomorrow they are not. Oswin\'s father has looked at a board like this one for thirty years.')]);
      if (t.id === 'wnote') return Dialogue.start([narr('Tucked under the top log, where only somebody who builds the fire would look: a strip of gauge paper, in an engineer\'s square hand.'), narr('"Stack pressure, two. It has held twenty-four days. Whoever you are: why did you care whether it would? K.D."'), narr('I put it in my collar with the page and the washer. It is getting crowded in there.')]);
      if (t.id === 'stds') return Dialogue.start([narr('Three standards now. Violet, Teal, and Amber, who came in on day thirty-four without a blade drawn. Each of them is a House that stopped existing because I picked up a pole.'), narr('It is exactly how the Count works. I am learning their trade by doing it to their children.')]);
      if (t.id === 'lucan') return Dialogue.start(MF('e_lucan') ? [say('lucan', 'Until the morning, Sorrel.')] : [
        narr('He is standing on the far bank under a white cloth, alone, with his blade left on the stones behind him. Lucan Aurel. The High Auditor\'s son.'),
        say('lucan', 'I asked for the truce. The Assayers are annoyed. They cannot grade a conversation.'),
        say('lucan', 'Tomorrow I hold the keep and you come up the ridge, and my mother watches. I should like, once, to have spoken to you where it does not count.'),
        say('lucan', 'You fight as if you hate the ground you are standing on. Nobody taught one that. Where does one learn it?'),
        { choice: [
          { t: 'One learns it by being under it.', fx: () => { rage(1); }, then: [say('lucan', '...I do not understand that.'), say('kael', 'No.'), say('lucan', 'I should like to. I think that is the difference between you and me, and I think it is not to my credit.'), narr('He is eighteen and he meant it. It is the most dangerous thing anybody said to me in fifty days. It is very hard to hate somebody who would like to understand.')] },
          { t: 'One had a good teacher.', then: [say('lucan', 'Mine told me the first cut is a question and the second is the answer. Yours seems to have skipped the question.'), narr('He smiled. He has his mother\'s mouth, and none of what she does with it.')] }] },
        say('lucan', 'She says I am kind. She says it the way one reports a fault in a casting. Until the morning, Sorrel.'), fx(() => MSET('e_lucan'))]);
      if (t.id === 'fire2') { if (EVE_N() < 3) return Dialogue.start([narr('The fire I taught them. Somebody has kept it in for forty-six days. Not yet. Walk the lines first.')]);
        return Dialogue.start([
          narr('I sit down. The pack is under my knees. I know what is at the bottom of it.'),
          fx(() => Sound.play('heart')),
          narr('Dorian Aldane\'s bread. Half a heel, fifty days old. He broke it on the lift and gave me the larger piece, and said: one ought to go up on something.'),
          narr('It is a stone. I eat it. All of it. It takes most of an hour, and it is the worst thing I have ever done slowly.'),
          narr('Tomorrow I take the keep, and they pin the sun on me, and I go to work for the woman who burned my wife. That was always the plan. Tonight it is only a fire, and I am the one who knows how.'),
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
        say('merrow', 'You will want it to be one of the Teal. Thirty of them asleep under a Violet standard. Who else? One would think it too.'),
        say('merrow', 'I stood the ford with Lune from dusk to the second watch. Ask her. Then ask yourself who gains if Violet turns on its Teal three weeks before the keep.'),
        narr('He is right, and he knows I know it. That is the cleverest part of the whole thing. Whoever lit that lamp lit it knowing where everybody would look.'), L('merrow')]);
      if (t.id === 'oswin') return Dialogue.start([
        say('oswin', 'If you are looking at prints, it is not my leg you want. The Vey girl opened the right one, two days ago. I have been dragging the right ever since, and I should be obliged if you did not stare.'),
        say('oswin', 'I was on the council when the pickets were set. I know how that sounds. I have known you twenty-five days and it has been the best-fed month of my time. One does not sell that.'), L('oswin')]);
      if (t.id === 'corin') return Dialogue.start([
        say('corin', 'Stores are in order. One counts them twice a day. Lamp oil, eleven flasks. Salve, none. Bread, four days. Write it down if you like.'),
        say('corin', 'It will be one of the Teal. It is always the ones who came over. A man who changes his House once has learned how.'),
        narr('He does not look up from his slate. He has a clerk\'s hand. Neat sevens.'), L('corin')]);
      if (t.id === 'cadv1') return Dialogue.start([narr('She was on the ridge picket the first night. She saw a light, she says, and thought it was an Assayer. Everybody thinks everything is an Assayer.')]);
      if (t.id === 'cairns') return Dialogue.start([narr('Six cairns. Two of them are from this week, from raids that came where the pickets were not.'), narr('Whoever is selling the watch has walked past these every night to do it.')]);
      if (t.id === 'board2') return Dialogue.start([narr('Violet: fourth. Three raids in three nights and we have dropped two places.'), narr('Somebody is reading this board from the other side of the river and being paid by the bar.')]);
      if (t.id === 'wnote') return Dialogue.start([narr('The stores, under an oilcloth beside the woodpile. Bread. Rope. Lamp oil.'), narr('I count nine flasks. Corin\'s tally says eleven.'), L('stores')]);
      if (t.id === 'ridge') return Dialogue.start([narr('The top of the ridge path, where it looks down on Teal\'s old allies across the valley. Bootprints in the wet. Narrow. The left heel drags a groove.'), narr('Beside them, a ring in the grass where a lamp stood, and three burnt matches. Three nights.'), L('ridge')]);
      if (t.id === 'tentQ') return Dialogue.start([narr('The quartermaster\'s tent. Everything squared. Under the bedroll, a second slate: three strokes, and beside each a number in a neat hand.'), narr('They are our picket counts. Ford, ridge, river. All three nights.'), fx(() => Sound.play('heart')), narr('And a boot, set to dry by the pole. The left heel is worn through on the outside.'), L('tent')]);
      if (t.id === 'stds') return Dialogue.start([narr('Two standards, and a gap where the third will go if we live. Violet. Teal. Whoever is on the ridge at night would like there to be one.')]);
      if (t.id === 'fire2') { if (!LAMP_READY()) return Dialogue.start([narr('Not yet. If I name somebody at this fire and I am wrong, forty people will remember it longer than they remember the raids.')]);
        // the right name is fought at the fire, in the same place, in front of all of them, and what follows is said there too; the wrong name is fought on the ridge in the dark, as it is told
        const aft = wrong => [
          narr(wrong ? 'It took the three of them down to do it, and it was up on the ridge in the dark, where nobody saw. That is what the wrong name cost: nobody saw.' : 'In front of all of them, at their own fire. That is what the right name bought.'),
          narr('He is on his knees in the wet with his blade a yard from his hand. Nobody has moved. Forty of them, and the fire, and the rain starting.'),
          say('corin', 'It is not a betrayal. One wishes you would stop looking at it as one. A debt was called. One paid it with what one had. You were what one had.'),
          narr('It is the most honest thing an Accredited has said to me. That is what I am going to be to all of them. What they had.'),
          { choice: [
            ...(wrong ? [] : [0]).map(() => ({ t: 'Keep him. Let him light the lamp, and say what one tells him.', fx: () => { G.flags.corin = 'kept'; rage(1); }, then: [narr('I gave him back his slate and told him what to write on it. Three false picket counts, three more nights. He wrote them in his neat hand. He was grateful. That was the worst of it.'), narr('It is what Celestine would have done. I noticed that, and did it anyway.')] })),
            { t: wrong ? 'Turn him out of the valley. Barefoot. (There is nothing else left to do with him.)' : 'Turn him out of the valley. Barefoot.', fx: () => { G.flags.corin = 'out'; }, then: [...(wrong ? [narr('I could not keep him to write lies for me. Forty people had watched me name the wrong man; nobody would have believed a lamp I vouched for.')] : []), narr('I took his boots and sent him up the ridge path he liked so well. A cadet who leaves the valley is struck from the Assay. His father\'s debt will stand. I did not ask what that means for his father.')] },
            ] },
          narr(wrong ? 'I had named the wrong one first. Nobody has said so since. They only looked at each other, that night, a little longer than they used to.' : 'They only looked at each other, that night, a little longer than they used to. I had done that as well, by being right.'),
          narr('Somebody paid for that lamp. A cadet\'s father does not owe a debt that size to another cadet. He owes it to somebody who can write in the grading book.')];
        const duel = wrong => fx(() => { if (wrong || !(Brawl.active && Brawl.def.walk)) return Mission.fight(Object.assign(FF.corin(), wrong ? { title: 'THE RIDGE', sub: 'CORIN ASHBY, AND THE PICKETS HE SOLD US TO', foes: FF.corin().foes.concat([{ id: 'cadt1', name: 'Teal picket', kind: 'cadet', hp: 14 }, { id: 'cadt2', name: 'Teal picket', kind: 'lancer', hp: 14 }]) } : {}), () => Dialogue.start(aft(wrong), () => Mission.finish()));
          Mission.fight(Object.assign(FF.corin(), { stage: Brawl.stageOf(['corin']), title: 'THE CIRCLE', sub: 'CORIN ASHBY - IT IS ONLY ARITHMETIC', afterWin: aft(0) }), () => Mission.finish()); });
        const nameIt = [
          narr('Forty of them round the fire. Thirty Teal at the edge of the light, not sitting. Everybody knows why I have called them.'),
          narr('I get one name. If it is the right one, he is caught here in the light with nowhere to go. If it is the wrong one, the right one will be over the ridge before I can say a second.'),
          { choice: [
            { t: 'Corin Ashby. The oil, the slate, the left heel.', then: [say('corin', '...Nine flasks. You counted. Nobody counts.'), say('corin', 'My father owes an Assayer. One does not say which. The debt is struck if Violet finishes below Teal\'s patron. It is only arithmetic, Sorrel.'), say('kael', 'It is always only arithmetic.'), narr('He stood up, and he drew. I had not thought he would. He had been afraid for twenty-five days, and it had made him quick.'), fx(() => { HUD.toast('The right name. He is caught at the fire: single combat.'); Sound.play('clue'); }), duel(0)] },
            { t: 'Merrow. It is always the ones who came over.', fx: () => { G.flags.lampWrong = 1; rage(1); }, then: [say('merrow', 'There it is. One wondered how long a Violet standard would stay kind.'), say('petra', 'He was on the ford with me, Sorrel. From dusk. One said so.'), narr('I had said Corin\'s own words back to forty people, in my own mouth. Corin was looking at his slate. Then he was not. Then he was running for the ridge, and that was all the answer anybody needed.'), narr('Merrow took nine of the thirty and walked out before dawn. I did not stop them. I had no right left to.'), fx(() => { HUD.toast('The wrong name. Corin reaches his pickets: three to fight, and he cannot be kept.'); Sound.play('deny'); }), duel(1)] },
            { t: 'Oswin Hale. The prints drag.', fx: () => { G.flags.lampWrong = 1; rage(1); }, then: [say('oswin', 'The right, Sorrel. I told you. The right.'), narr('He said it quietly. He pulled the dressing off in front of all of them, and it was the right, and I have not forgotten his face.'), narr('In the quiet, somebody behind the stores put down a slate and began to walk, and then to run. Corin Ashby. That was all the answer anybody needed.'), narr('Oswin did not carry water for me again. He carried it. Not for me.'), fx(() => { HUD.toast('The wrong name. Corin reaches his pickets: three to fight, and he cannot be kept.'); Sound.play('deny'); }), duel(1)] }] }];
        MSET('circle'); return Mission.fight(walkCircle(nameIt), () => {}); }
    }
  }
});

// what a thing is called, shown over it as he comes up to it: several of these were hard to tell from the grass
const HOTN = { fire: 'THE FIRE', wood: 'WOODPILE', pump: 'PUMP HOUSE', vstd: 'VIOLET STANDARD', tentA: 'TENT', tentB: 'TENT', tentC: 'TENT', cairn: 'CAIRNS', board: "ASSAYERS' BOARD", rack: 'BLADE RACK', valve: 'LAMP VALVE', std: "TEAL'S STANDARD", ttA: 'TENT', ttB: 'TENT', ttC: 'TENT', tcairn: 'CAIRNS', drop: "PATRON'S DROP", tboard: "TEAL'S BOARD",
  book: 'GRADING BOOK', glass: 'VIEWING GLASS', roster: 'ROSTER', eye: 'THE WATCHER', cloak: 'WHITE CLOAK', boots: 'BOOT RACK', wagers: 'STRONGBOX', fire2: 'THE FIRE', stds: 'STANDARDS', wnote: 'STORES', ridge: 'RIDGE PATH', tentQ: "QUARTERMASTER'S TENT", cairns: 'CAIRNS', board2: "ASSAYERS' BOARD",
  shelf: 'DEAD LETTERS', count: 'THE COUNT', tray: "MARSHAL'S TRAY", marendesk: "MAREN'S DESK", mydesk: 'MY DESK', motto: 'THE MOTTO', win: 'WINDOW', pillarSun: 'THE PILLAR', lift5: 'LIFT ZERO', notice5: 'NOTICES',
  kwash: 'WASH-HOUSE', kdoor5: 'K-5', kdoorM: "K-9 · MARA'S", kdoor11: 'K-11', kdoor13: 'K-13 · SEALED', ksuns: 'THE LEDGE', kwall: "MARA'S WALL", ktap: 'RATION TAP', kbarrel: 'BARRELS', kpost: 'THE POST', khop: 'THE SQUARES', ktub: 'WASH TUB', kbench: 'THE BENCH' };

/* ---------- places you walk in depth: flat figures, a camp round you. They add to the story and change none of it. ---------- */
/* A way out that asks first. While somebody or something here has not been gone to yet, a marker that ends the walk asks
   "Leave?" with the names still waiting, and Stay is the first answer (a held E does not walk him out by accident).
   Also: nothing here can be picked out, and no marker label shows, while the place's title card is still up. */
function walkGuard(d) {
  const w = d && d.walk; if (!w) return d;
  const keyOf = n => n.key || n.id, waiting = k => { const seen = {}, out = [];
    for (const n of (w.npcs || []).concat(w.spots || [])) { if (!n.talk || !n.name || n.exit) continue; const id = keyOf(n); if (seen[id]) continue; seen[id] = 1; if (!k.said[id]) out.push(n.name); }
    return out; };
  for (const s of w.spots || []) {
    const r0 = s.reach || 30; Object.defineProperty(s, 'reach', { configurable: true, enumerable: true, get: () => (d.title && Brawl.active && Brawl.def && Brawl.def.walk === w && Brawl.t < 3.2 ? -1 : r0)   /* -1, not 0: a reach of 0 would fall back to the default */, set: v => { /* fixed */ } });
    if (!s.exit || w.guard === false) continue;
    const ex = s.exit, tk = s.talk, isOut = k => (typeof ex === 'function' ? ex(k) : ex);
    s.exit = k => k._ask === s ? false : isOut(k);
    s.talk = k => { k._ask = null; const left = isOut(k) ? waiting(k) : [];
      if (!left.length) return tk(k);
      k._ask = s; const id = keyOf(s); if (!k.said[id]) { k.said[id] = 1; k._unsay = id; }
      const names = left.length > 3 ? left.slice(0, 2).join(', ') + ' AND ' + (left.length - 2) + ' MORE' : left.join(', ');
      return [{ s: 'narr', t: 'LEAVE NOW? NOT SEEN YET: ' + names + '.' }, { choice: [
        { t: 'Not yet. Stay a while.' },
        { t: 'Leave now (' + String(s.verb || 'go').toLowerCase() + ').', fx: () => { k._ask = null; Dialogue.stack.push({ a: tk(k) || [], i: 0 }); Dialogue.onEnd = () => Brawl.end(true); } }] }]; };
  }
  const t0 = w.tick; w.tick = function (k, dt, B) { if (k._unsay) { delete k.said[k._unsay]; k._unsay = null; } if (k._ask && k.near !== k._ask) k._ask = null; return t0 ? t0.call(this, k, dt, B) : null; };
  return d;
}
function walkCircle(atFire) {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 3, d2: 1, title: 'THE CIRCLE', sub: 'THE ASSAY. NIGHT TWENTY-EIGHT', bg: 'storm', arena: { kind: 'ring', rx: 190, ry: 72 }, music: 'mystery', hero: { id: 'kael2', hp: 9, pow: 2, blade: 0, fury0: 0 },
    walk: { id: 'circle', spawn: [-150, 34], clear: 200, block: [{ x: 0, y: 0, r: 15 }],
      obj: k => k.n ? 'THEY ARE WAITING. THE FIRE, WHEN I AM READY.' : 'FORTY OF THEM, AND NOBODY SITTING. WALK THE CIRCLE, OR GO TO THE FIRE.',
      floor(g) { g.fillStyle = 'rgba(70,50,34,.55)'; g.beginPath(); g.ellipse(256, 256, 112, 54, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(40,28,22,.6)'; g.beginPath(); g.ellipse(256, 256, 30, 15, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(20,14,12,.7)'; g.beginPath(); g.ellipse(256, 256, 14, 7, 0, 0, 6.3); g.fill();
        g.fillStyle = 'rgba(70,50,34,.4)'; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(256 - 112 - i * 6, 256 + 12 + Math.sin(i * .5) * 6, 9, 4, 0, 0, 6.3); g.fill(); } },
      props: [{ t: 'fire', x: 0, y: 0, k: 1 },
        { t: 'tent', x: -196, y: -62, c: '#7a5ac8', k: 1 }, { t: 'tent', x: -120, y: -88, c: '#7a5ac8', k: 2 }, { t: 'tent', x: 30, y: -96, c: '#7a5ac8', k: 3 }, { t: 'tent', x: 150, y: -84, c: '#2aa6a0', k: 4 }, ...Array.from({ length: 14 }, (_, i) => ({ t: 'tree', x: -260 + i * 40 + (i * 13) % 17, y: -120 - (i * 7) % 30, k: i, h: 64 + (i * 11) % 24 })),
        { t: 'banner', x: -50, y: -78, c: '#7a5ac8', k: 1 }, { t: 'banner', x: -30, y: -80, c: '#2aa6a0', k: 2 },
        ...[[150, 4], [164, -14], [170, 22], [182, 2], [156, 36], [144, -30]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(i % 2 ? 'cadt2' : 'cadt1'), k: i + 20 }))],
      npcs: [
        ...Array.from({ length: 13 }, (_, i) => { const a = (-30 + i * 20) * Math.PI / 180, j = (i * 7) % 5 - 2; return { id: i % 3 === 2 ? 'cadv2' : 'cadv1', x: Math.cos(a) * (92 + j * 3), y: -Math.sin(a) * (46 + j * 2), r: 9 }; }),
        N('petra', -50, -16, 'PETRA LUNE', [...(G.flags.campSat === 'petra' ? [narr('She shifts her slate so that I can read it over her shoulder. She has not done that for anybody else in twenty-five days.')] : []), say('petra', 'Forty of Violet, and nobody has sat down. One has seen that once before: the morning they read the pairings.'), narr('She has her slate under her arm. She is the only one here who looked at the fire before she looked at me.')]),
        N('oswin', 52, -14, 'OSWIN HALE', [...(G.flags.campSat === 'oswin' ? [narr('He gives me the smallest nod there is. I showed him where the grain runs, on day three.')] : []), say('oswin', 'One brought the water up before anybody asked. It seemed the night for it.'), narr('He is standing on the leg. He will not let any of them see him favour it.')]),
        N('corin', -58, 10, 'CORIN ASHBY', [...(G.flags.campSat === 'corin' ? [narr('He does not quite look at me. On day three I did his sum for him and he wrote it down as his own.')] : []), say('corin', 'One has the tally here, should it be wanted. Eleven flasks.'), narr('Eleven. He says it the way a man says his own name.')]),
        N('merrow', 128, 12, 'MERROW', [say('merrow', 'Thirty of Teal at the edge of your light, Sorrel. Notice that nobody has asked us to come nearer.'), narr('Nobody has. That is mine to mend, and it will not be mended tonight.')]),
        N('cadv1', 34, 28, 'A CADET IN A BORROWED CLOAK', [say('cadv1', 'Is it true that below the rock they burn their dead? One heard it from a porter. One did not believe it.'), narr('They burn more than their dead. I told her I had heard the same.')])],
      spots: [
        atFire ? { id: 'fire', x: 0, y: 2, r: 15, reach: 34, ph: 30, name: 'THE FIRE', verb: 'SAY THE NAME', talk: () => atFire } : { id: 'fire', x: 0, y: 2, r: 15, reach: 34, ph: 30, name: 'THE FIRE', verb: 'SAY THE NAME', exit: 1, talk: () => [] },
        { id: 'stds', x: -40, y: -70, r: 8, reach: 28, ph: 60, name: 'THE STANDARDS', verb: 'LOOK', talk: () => [narr('Two standards, and a gap for a third. Below, nobody ever called forty people to a fire. They called us to a furnace. We stood in rows there as well, and nobody sat.'), narr('It is the same silence. I did not expect to find it up here. I had thought it was ours.')] }] } };
}
function walkSquare() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 0, title: 'ASHGATE SQUARE', sub: 'AN ORDINARY NIGHT, A YEAR BEFORE THE FURNACE', bg: 'ring', arena: { kind: 'ring', rx: 150, ry: 66 }, music: 'home',
    walk: { id: 'square', spawn: [-96, 30], keep: q => q.t === 'lamp',
      obj: k => k.n >= 3 ? 'NOTHING HAPPENED THAT NIGHT. THE CHALK SUN, WHEN I CAN LET IT GO.' : 'LAST BELL JUST GONE. EVERYBODY IS WHERE THEY ALWAYS WERE.',
      props: [...[[-128, -18], [118, 34], [-40, 52], [140, -8]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(['pell', 'juno', 'marrow', 'kit'][i]), k: i + 1 }))],
      npcs: [
        N('seren', -18, -8, 'SEREN', [say('seren', "Hold the lamp steady, valve man. A sun wants all its rays or it's just a spider."), say('you', 'How many is all?'), say('seren', "More than they've got brushes for."), narr('She had chalk to the elbow. The Authority scrubbed it off every week, and every week she said that was only them making room.')]),
        N('tavi', 44, 12, 'TAVI', [say('tavi', "Kael! Bao's doing the broth with the green in it. Real green. I saw."), say('you', "That's onion top, Tav."), say('tavi', "It's GREEN."), narr('Tavi was six and had never seen a leaf. Neither had I. I stood there and told a child what was and was not green.')]),
        N('bao', -86, -22, 'BAO', [say('bao', "Two bowls and one for the small one. Put the stamp away, I know your face."), narr('He stamped the card anyway, afterwards, when he thought I was not looking. Everybody on Tier Six kept their accounts straight. It was the only thing we were ever praised for.')]),
        N('hollis', 84, -16, 'HOLLIS', [narr('Hollis, on the bench by the east lamp, humming the shift song through his teeth to keep time on nothing at all.'), say('hollis', "Habit. Twelve hours on the wheel and the tune won't get out of your jaw. Your Seren hums it a third high. Tell her it's wrong and I like it.")]),
        N('mara', -8, 38, 'MARA', [say('mara', "Last bell's gone, the pair of you. Tallyman walks at the quarter. If he finds chalk on her hands it's a week's air for both, and I'll not sign for it."), say('you', 'Aye, Mara.'), narr('She said it every night. Every night she stood between us and the east arch until the chalk was dry.')]),
        N('ivo', 108, 22, 'IVO', [say('ivo', "Cart's got a wheel going. Hear that? That's the sound of me pushing it uphill tomorrow. Give us a hand, Kael."), narr('I gave him a hand. I had a great many evenings, then, and I spent them like a man who thinks the meter is broken in his favour.')])],
      spots: [{ id: 'sun', x: 0, y: 4, r: 6, reach: 22, ph: 14, name: 'THE CHALK SUN', verb: 'LET IT GO', exit: 1, talk: () => [narr('That is all of it. Nothing happened that night. I have gone back to it more often than to the wedding.')] }] } };
}
function walkRowMorning() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 0, bg2: 'rowk', title: 'ROW K', sub: 'ELEVEN MONTHS BEFORE THE FURNACE. THE MORNING AFTER THE FIRST FIRE', bg: 'ring', arena: { kind: 'ring', rx: 150, ry: 60 }, music: 'home',
    walk: { id: 'rowmorn', spawn: [10, 8], keep: () => false,
      obj: k => k.n >= 3 ? 'FIRST BELL IN A MINUTE. THE DOOR, WHEN I CAN.' : 'THE ROW IS UP BEFORE US. IT ALWAYS WAS.',
      npcs: [
        N('seren', -12, -4, 'SEREN', [say('seren', "Don't look at it like that. It's a washer. It's the only round thing you own and you gave it away, so now you own nothing round."), say('you', 'I own half of one.'), say('seren', 'Aye. The inside half.'), narr('She wore it eleven months. That was the first morning of them.')]),
        N('orla', -92, -16, 'NAN ORLA', [say('orla', "Married on a festival night. Means the whole tier was drunk at your wedding and not one of them brought a thing. I've done your sheets. That's mine brought."), narr('She had done them in ration water, out of her own count. I did not know that then. I would not have known how to say ta for it.')]),
        N('garrow', 104, -12, 'GARROW', [say('garrow', "Your wife bit a man in my ring when she was fourteen. I'd keep your hands where she can see them."), say('you', 'She told me. She said he had it coming.'), say('garrow', "He did. Cost her the knot, mind. Rules are rules.")]),
        N('mara', 40, 30, 'MARA', [say('mara', "Bay Three at first bell, the both of you. I married you. I didn't give you the day."), narr('She had stood up in front of the whole of Crew Three the night before and said the words, and her voice had gone on the last one. Nobody ever mentioned it to her.')]),
        N('tavi', -44, 28, 'TAVI', [say('tavi', 'Is she my sister now? Do I have to do what she says?'), say('you', 'Aye. And aye.'), narr('Tavi thought about that, and then went and stood next to her and not next to me. It stayed that way.')]),
        N('bryn', 128, 20, 'BRYN', [say('bryn', "Don't mind me, I'm only hauling. Go on and be happy. Somebody on this row ought to try it.")])],
      spots: [{ id: 'door', x: -12, y: -50, r: 8, reach: 30, ph: 40, name: 'THE DOOR OF K-7', verb: 'GO IN', exit: 1, talk: () => [narr('I went in. There was tea. I have told myself since that I knew what I had that morning. I did not. Nobody does, on the morning.')] }] } };
}
function walkWard() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines });
  return { era: 0, bg2: 'ward', title: 'THE FEVER WARD', sub: 'FOUR NIGHTS BEFORE THE FURNACE. THE FANS COME UP', bg: 'pit', arena: { kind: 'ring', rx: 140, ry: 56 }, music: 'home',
    walk: { id: 'ward', spawn: [-100, 24], keep: () => false,
      obj: k => k.n >= 3 ? 'FORTY, BREATHING. THE BOARD, WHEN I CAN LEAVE THEM.' : 'LISTEN TO THAT. EVERY FAN ON THE BRANCH.',
      npcs: [
        N('nell', 30, -18, 'NELL', [say('nell', "Don't tell me how. I've forty of them breathing and a meter that says I should have twelve. I'm not going to ask it why."), narr('She did not ask. She chalked 40 on the board and underlined it, and then she sat down on the floor, which I had never seen her do.')]),
        N('seren', -30, -6, 'SEREN', [say('seren', "Listen to that. That's not a fan, that's a gale. You've given them weather, valve man."), say('you', 'Eleven in the hundred, off a line nobody reads. It balances by dawn.'), say('seren', "It'd better. I'm not married to a thief. I'm married to a man who tidies."), narr('The High Auditor used almost the same words three nights later, in the square. I have never been able to hear the one without the other.')]),
        N('tavi', -78, -22, 'TAVI', [say('tavi', 'I can breathe right down to the bottom. Kael. Right to the bottom. Is it always like this?'), narr('It had not been like that for anybody on Tier Six in his lifetime. I said aye.')]),
        N('pip', 84, 14, 'PIP', [say('pip', 'Is the sky blue? Nell says nobody knows.'), say('you', "Seren says it is. She's got a bet on it.")]),
        N('ada', 4, 30, 'ADA', [say('ada', "The fan's fixed! Did she fix the fan? Tell her it's too loud. Tell her don't make it quieter.")]),
        N('mosi', 66, -30, 'MOSI', [narr('Mosi, cross-legged on a cot with a stub of chalk, drawing somebody with a sun where the head should be.'), say('mosi', "It's not finished. Don't look till it's finished.")])],
      spots: [{ id: 'board', x: 124, y: -48, r: 8, reach: 46, ph: 44, name: 'THE WARD BOARD', verb: 'LEAVE THEM SLEEPING', exit: 1, talk: () => [narr('Three nights. That was all it ever was. I would do the sum the same way again, and I know what it comes to.')] }] } };
}
FF.circle = walkCircle; FF.square = walkSquare; FF.rowmorn = walkRowMorning; FF.ward = walkWard;

// ---- the camp by day (plan 4f): House Violet on day three, before the fighting piles up. Nothing here is needed; one choice is remembered.
function walkCampDay() {
  const N = (id, x, y, name, lines, key) => ({ id, x, y, name, key, talk: () => lines });
  const vey = [narr('Two cadets in teal, come up from the river to read our bar. Nobody stops them. A board is there to be read.'), say('cadt1', 'Eleventh.'), say('cadt2', 'One had heard twelfth. One is almost disappointed.'), narr('They have the same face and the same way of standing, a hand apart. They do not look at me. They look at where I would have to put my feet to reach them both.')];
  const sit = (who, lines) => ({ t: who, fx: () => { G.flags.campSat = lines[0]; }, then: lines.slice(1) });
  return { era: 2, d2: 1, title: 'THE CAMP', sub: 'THE ASSAY. DAY THREE', bg: 'valley', arena: { kind: 'ring', rx: 190, ry: 72 }, music: 'dusk', hero: { id: 'kael2', hp: 9, pow: 1, blade: 0, fury0: 0 },
    walk: { id: 'campday', spawn: [-150, 30], clear: 200,
      open: () => [narr('I wake with my hand on half a loaf of bread, and for a moment he is still holding out the other half.'), narr('Forty of us in one House, and every one of them was sent by somebody.')],
      obj: k => k.n >= 3 ? 'THE FIRE RING IS COLD. SIT DOWN WITH SOMEBODY.' : 'DAY THREE. HOUSE VIOLET, BY DAYLIGHT. WALK THE CAMP.',
      floor(g) { g.fillStyle = 'rgba(90,70,44,.5)'; g.beginPath(); g.ellipse(256, 256, 104, 50, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(40,34,30,.75)'; g.beginPath(); g.ellipse(256, 256, 20, 10, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(150,146,140,.6)'; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; g.beginPath(); g.ellipse(256 + Math.cos(a) * 21, 256 + Math.sin(a) * 10.5, 4, 2.4, 0, 0, 6.3); g.fill(); }
        g.fillStyle = 'rgba(90,70,44,.36)'; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(256 - 104 - i * 6, 256 + 12 + Math.sin(i * .5) * 6, 9, 4, 0, 0, 6.3); g.fill(); } },
      props: [{ t: 'tent', x: -196, y: -62, c: '#7a5ac8', k: 1 }, { t: 'tent', x: -120, y: -88, c: '#7a5ac8', k: 2 }, { t: 'tent', x: 30, y: -96, c: '#7a5ac8', k: 3 }, { t: 'tent', x: 110, y: -90, c: '#7a5ac8', k: 4 },
        ...Array.from({ length: 14 }, (_, i) => ({ t: 'tree', x: -260 + i * 40 + (i * 13) % 17, y: -120 - (i * 7) % 30, k: i, h: 64 + (i * 11) % 24 })),
        { t: 'banner', x: -44, y: -78, c: '#7a5ac8', k: 1 }, { t: 'rank', x: 150, y: -36, at: 10, k: 1 },
        ...[[-170, -58], [-120, -64], [170, -50], [130, -62], [-40, -66], [60, -66]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(i % 2 ? 'cadv2' : 'cadv1'), k: i + 20 }))],
      npcs: [
        N('petra', -83, -14, 'PETRA LUNE', [say('petra', 'Forty on the roll. One keeps the column because nobody else will, and because sooner or later somebody will ask.'), narr('At the foot of her slate, apart from the forty, one more name with a box drawn round it. Aldane, D. She has not written what became of him. Nobody has told her. Nobody has told me, and I was in the room.')]),
        N('oswin', 70, -10, 'OSWIN HALE', [say('oswin', 'Father finished ninth at his Assay. He has been ninth for thirty years. One is not to finish ninth. That was the whole of the advice.'), narr('He is trying to split wet wood with a practice blade. They are issued blunt, four for forty, on purpose. He has not worked out yet that it is on purpose.')]),
        N('corin', -102, 16, 'CORIN ASHBY', [say('corin', 'One has counted the lamp oil. Twelve flasks, for forty, for a season. It is only arithmetic, Sorrel, but somebody ought to be doing it.'), narr('He is right. He is also pleased to be right. I do not know yet which of those is going to matter.')]),
        N('cadt1', 132, 4, 'THE SISTERS VEY', vey, 'vey'), N('cadt2', 170, 17, 'THE SISTERS VEY', vey, 'vey'),
        N('cadv2', 22, 30, 'A CADET WHO HAS NOT SLEPT', [say('cadv2', 'They took the losers out by the other door. One watched for it to open again. It has not opened again.'), narr('Nobody up here says where that door goes. They say a pairing "balanced". I have heard the word used that way before.')])],
      spots: [
        { id: 'pack', x: -170, y: 6, r: 7, reach: 26, ph: 14, name: 'MY PACK', verb: 'LOOK', talk: () => [narr('Half a loaf, wrapped in a lift ticket. He tore it down the middle on the way up and held this half out before I had said a word to him.'), narr('Dorian Aldane. Sixteen. I have not eaten it. I am not going to think about why.')] },
        { id: 'rank', x: 170, y: -30, r: 8, reach: 26, ph: 60, name: "THE ASSAYERS' BOARD", verb: 'READ', talk: () => [narr('Twelve bars, repainted from the air each dawn. Violet is eleventh. Under the bars, in small clean letters: POSITIONS ARE PROVISIONAL. DEBTS ARE NOT.'), narr('It is the shift rota. I would know it anywhere. They have only put Houses where we put hands.')] },
        { id: 'ring', x: 0, y: 2, r: 12, reach: 32, ph: 16, name: 'THE COLD FIRE RING', verb: 'SIT DOWN', exit: 1, talk: () => [narr('Nine stones and no ash. Nobody here has ever had to light anything.'), { choice: [
          sit('Sit by Oswin and the wet wood.', ['oswin', say('oswin', 'One had rather hoped nobody would.'), narr('We do not talk. I take the blunt blade off him and show him where the grain runs. Below, a child knows that. He watches my hands and not the wood, and says nothing about what he sees on them.')]),
          sit('Sit by Petra and her slate.', ['petra', say('petra', 'You may sit. You may not read over one\'s shoulder.'), narr('I read over her shoulder. Forty names, a column for bread, a column for water, and a third she has not headed yet. Below we would have headed it OWED.')]),
          sit('Sit by Corin and his count.', ['corin', say('corin', 'Sit, then. Tell one whether twelve is enough.'), narr('It is not enough. A flask every four days is twelve, and the season is fifty. I say so. He writes it down as if it had been his.')])] }] }] } };
}
// ---- Bay Three at last bell (plan 5b): the seat knives go back on the board and are counted. Hook 306 has been empty for forty-two days.
function walkLastBell() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines }); let mine = 0;
  return { era: 0, title: 'LAST BELL', sub: 'BAY THREE. FORTY-TWO DAYS AFTER THE FURNACE', bg: 'furnace', arena: { kind: 'rect', w: 230, h: 84 }, music: 'work',
    walk: { id: 'lastbell', spawn: [-92, 24], keep: () => false,
      open: () => [narr('Last bell. Every valve hand on the tier walks their knife back to the board before they walk anywhere else.')],
      obj: k => k.n >= 2 ? 'THE BOARD. HANG IT WHERE IT GOES.' : 'CREW THREE IS COUNTING ITS KNIVES BACK. THE BOARD IS BY THE FURNACE DOORS.',
      props: [{ t: 'kboard', x: 58, y: -44, own: () => mine, k: 1 }, ...[[-30, -30], [-12, -34], [8, -30], [-48, -22]].map(([x, y], i) => ({ t: 'crowd', x, y, s: World.sheetFor(['c2', 'c3', 'pell', 'c4'][i]), k: i + 20 }))],
      npcs: [
        N('mara', 26, -22, 'MARA VENN', [say('mara', 'Crew Three, by number. Three-oh-one. Three-oh-two.'), narr('She calls it in the same voice at every number. I have listened for the place where it changes. It does not change. That is how I know what it costs her.')]),
        N('warden', 92, -26, 'THE WARDEN AT THE BOARD', [say('warden', 'Hang it and step back.'), narr('He has the sheet and a stub of pencil. He does not look at faces. He looks at hooks. An empty one at first bell is a line struck by morning, and he would be the one to strike it.')]),
        N('ivo', -24, 10, 'IVO', [say('ivo', "Mine's the one with the bent tip. Don't look at it like that. It cuts."), narr('He hangs it and his eyes go one row down and four along, and come away again. Everybody on the crew does it. Nobody on the crew has said so.')]),
        N('orin', -70, -14, 'OLD ORIN', [say('orin', "Forty years I've hung mine on that board. Couldn't tell you what wood it is. Could tell you every number that's gone quiet."), narr('He does not tell me. He never has, to anybody, and it is the kindest thing about him.')])],
      spots: [{ id: 'board', x: 58, y: -36, r: 9, reach: 30, ph: 62, name: 'THE SEAT BOARD', verb: 'HANG YOUR KNIFE', exit: 1, talk: () => { mine = 1; return [
        narr('Three hundred and six. Nobody has hung anything on it. Nobody has taken the hook down either.'),
        narr('Mine is the next one along. I hang it. It swings a little and touches nothing.'),
        say('mara', 'Three-oh-seven.'), say('you', 'Aye.'),
        say('warden', 'Tier Six, Crew Three. All seats in. Balanced.'),
        narr('He says it of a board of knives. Forty-two days ago, in this bay, somebody said it of her.')]; } }] } };
}
// ---- the fourth ring of the Spire, at night: where Clerk Sorrel lives, among people who do not know what he is.
// Walked three times (the Post, the Balancing, What She Knows). What they have noticed is kept in G.flags.susp and carried from visit to visit.
Object.assign(CAST, {
  porter1: { name: 'A porter', look: () => ({ skin: '#9a6448', hair: '#2a1a14', style: 'short', shirt: '#8a8478', pants: '#4a463e', scarf: '#c9a23a' }) },
  porter2: { name: 'A porter', look: () => ({ skin: '#c08a6a', hair: '#8a8a8a', style: 'bald', shirt: '#8a8478', pants: '#4a463e', scarf: '#c9a23a' }) },
  clerk4: { name: 'A clerk of the fourth ring', look: () => ({ accredited: 1, skin: '#e0c0a0', hair: '#5a4a3a', style: 'short', robe: '#e8e0cc', trim: '#e8c25a', sash: '#9aa0aa' }) }
});
function walkRing(n) {
  const F = G.flags, MAX = 6; if (n === 1) F.susp = 2; if (n === 3) F.susp = Math.max(F.susp || 0, 4); F.susp = clamp(F.susp || 0, 0, MAX);
  const S = d => fx(() => { const v = clamp((F.susp || 0) + d, 0, MAX); if (v !== F.susp) Sound.play(d > 0 ? 'heart' : 'clue'); F.susp = v; if (d > 0) F.suspUp = (F.suspUp || 0) + 1; else F.suspDn = (F.suspDn || 0) + 1; });
  const front = fx(() => { Brawl.p.fx = 0; Brawl.p.fy = 1; });
  const once = {}, one = (id, first, again) => () => { if (once[id]) return again; once[id] = 1; return first; };
  const N = (id, x, y, name, talk, o) => Object.assign({ id, x, y, name, talk }, o || {});
  const pick = (t, d, then, f) => ({ t, fx: () => { f && f(); }, then: [...(d > 0 ? [] : [front]), S(d), ...then] });
  let ringT = 0, belled = 0;
  const kneel = v => fx(() => { for (const a of Brawl.allies) if (/^porter/.test(a.id)) a.kn = v; });
  const sub = ['', 'THE SUN SPIRE. FOUR YEARS AND A SEASON AFTER THE FURNACE. NIGHT', 'THE SUN SPIRE. FIVE YEARS AFTER THE FURNACE. NIGHT', 'THE SUN SPIRE. SIX YEARS AFTER THE FURNACE. NIGHT'][n];
  const wall = ['plain', 'win', 'lamp', 'door', 'win', 'win', 'plain', 'lamp', 'win', 'door', 'bell', 'lamp', 'door', 'pipe', 'win', 'lamp', 'door', 'win', 'door', 'lamp', 'win', 'plain', 'door', 'lamp', 'win', 'win', 'plain'], W0 = 13;   /* the length of ring he walks is the middle of it; it goes on round either way */
  const props = wall.map((v, j) => { const i = j - W0 + 8; return { t: 'rwall', v, x: (j - W0) * 40, y: -40, k: j, nm: i === 4 ? 7 : i === 7 ? 8 : i === 11 ? 9 : i === 13 ? 10 : 6, lit: i === 11 ? n < 3 : i === 7 ? n === 2 : i === 13 ? 0 : i !== 17, mark: i === 7, ring: v === 'bell' ? () => ringT : null }; });
  props.push({ t: 'stall', x: 40, y: -27, k: 1, shut: () => n === 3 });
  const door = F.susp;   /* read again at the door */
  // ---- who is on the ring
  const porter = n === 1 ? N('porter1', -108, 24, 'A PORTER ON THE LINE', one('porter', [
      narr('He has stepped off his line to let me by. I had not asked. I had not even slowed.'),
      narr('He is looking at the floor a pace in front of my boots. That is where the service looks. Below, a man who would not meet your eye was a man about to rob you.'),
      { choice: [
        pick('Look him in the face. "Ta."', 1, [say('you', 'Ta.'), say('porter1', '...Clerk.'), narr('His eyes came up before he could stop them. Then they went along the ring, to see who had heard me. I had cost him that. I walked on.')]),
        pick('Eyes front. Walk through the space he has made.', -1, [narr('I walked through the space he had made as if it had always been there. It is the hardest thing I do in a day. Behind me I heard him step back onto the paint.')])] }],
      [narr('He is back on the paint, with his eyes where they belong. I have done enough to him for one night.')]))
    : n === 2 ? N('porter1', -108, 24, 'A PORTER ON THE LINE', one('porter', [
      narr('He does not step off the line for me. The one who did is gone from this ring. Somebody saw a porter leave the paint for a clerk who had not asked, and wrote it down.'),
      { choice: [
        pick('Ask him where the other porter went.', 1, [say('you', 'There was another man on this length.'), say('porter1', "Don't know any other, Clerk."), narr('He knew. He said it to the floor, quickly, and his hand closed. A clerk does not notice which porter. I had just told him that I count them.')]),
        pick('Walk on. A clerk does not notice which porter.', -1, [narr('I walked on. I looked him up the same night, in the Count. He is breathing. They have moved him to the kitchens, and docked him the day.')])] }],
      [narr('He keeps to the paint. He has learned it from what happened to the last man. So have I.')]))
    : N('porter1', -108, 24, 'A PORTER, KNEELING', one('porter', [
      narr('He went down before I reached him. No bell had rung.'),
      narr('They kneel when a bell rings. One for a clerk. Two for a House. For the High Auditor nobody rings anything. People simply know.'),
      narr('He was not kneeling to a clerk. Somebody above me had looked at me, and the service had felt it come down the stair like a draught.'),
      { choice: [
        pick('Walk past him.', -1, [narr('I walked past him. I did not look down. I have been on that paint, and I know how long a pair of boots takes to go by.')]),
        pick('"Who told you to kneel?"', 1, [say('you', 'Who told you to kneel?'), say('porter1', 'Nobody, Clerk.'), narr('It was true. That was the worst of it.')])] }],
      [narr('He has not got up. I do not think he will until I am behind a door.')]));
  const clerk = n === 1 ? N('clerk4', -150, -12, 'A CLERK OF THE FOURTH RING', one('clerk', [
      say('clerk4', 'Sorrel. One hears the Count has a new hand. One hears the hand is quick.'),
      narr('He says it to the lamp across the ring. He has not turned his head. Nobody up here turns their head. A voice is enough to know a rank by, so a face is a thing one does not spend.'),
      { choice: [
        pick('Turn and look at him while he speaks.', 1, [narr('I turned to him. It is what you do. Somebody speaks and you give them your face, so that they know the air was not wasted.'), say('clerk4', '...Is something the matter with one\'s collar, Sorrel?'), narr('He wrote nothing down. He did not need to. Up here everybody keeps a column.')]),
        pick('Eyes front. Answer the lamp.', -1, [say('you', 'One is told so.'), say('clerk4', 'Noted.'), narr('Two men talking to a lamp. I have known furnace crews say more to each other through a wall.')])] }],
      [say('clerk4', 'Noted, Sorrel.'), narr('It is what they say for goodnight. It is also what they say for everything else.')]), { acc: 1, fx: 0, fy: 1 })
    : n === 2 ? N('clerk4', -150, -12, 'A CLERK OF THE FOURTH RING', one('clerk', [
      say('clerk4', 'Sorrel. One hears Tier Four is to be balanced. One hears it will be your pen.'),
      { choice: [
        pick('Look at him. "Eleven hundred people."', 1, [say('you', 'Eleven hundred people.'), narr('I said it to his face. He looked at my mouth as though it had done something in public.'), say('clerk4', 'Eleven hundred lines, Sorrel. One says lines.')]),
        pick('Eyes front. "One has not seen the order."', -1, [say('you', 'One has not seen the order.'), say('clerk4', 'No. One never has, until it is on the desk.'), narr('He sounded almost kind. He has signed them too.')])] }],
      [say('clerk4', 'One says lines, Sorrel.'), narr('He says it to the lamp.')]), { acc: 1, fx: 0, fy: 1 })
    : N('clerk4', -150, 20, 'A CLERK OF THE FOURTH RING', one('clerk', [
      say('clerk4', 'Sorrel.'),
      narr('Only the name. For two years he has had something to say to the lamp about me. Tonight he has nothing, and he has crossed to the far side of the ring to say it.'),
      { choice: [
        pick('Eyes front. "One bids you good evening."', -1, [say('you', 'One bids you good evening.'), say('clerk4', '...Noted.'), narr('He let his breath go. I had given him nothing to carry.')]),
        pick('Look at him. Ask what he has heard.', 1, [say('you', 'What has one heard?'), say('clerk4', 'One hears nothing, Sorrel. One is on the fourth ring.'), narr('He was afraid. Not of me. Of standing beside me when it came.')])] }],
      [narr('He has found something to read on the wall.')]), { acc: 1, fx: 0, fy: -1 });
  const sable = N('sable', 62, -16, "SABLE'S STALL", n === 1 ? one('sable', [
      say('sable', "Chard, kale, and a thing the kitchens call sorrel. I thought you'd want that one."),
      narr('Cold crates off Freight Three, chalked in her hand. The kitchens send down what the third ring leaves. She sells half of it to clerks at a mark-up, and the other half does not appear in anybody\'s book.'), find('f_greens'),
      narr('She is the only person on this ring who knows what I am. She has never once looked as though she did.'),
      { choice: [
        pick('"Ta, Sable."', 1, [say('you', 'Ta, Sable.'), say('sable', 'Clerk will want it wrapped.'), narr('She said it loudly, for the ring, and under it she gave me a look that would have stripped paint. Ta is a Tier Six word. I had said it with a sun on my collar.')]),
        pick('"One will take the sorrel."', -1, [say('you', 'One will take the sorrel.'), say('sable', 'Noted, Clerk.'), narr('She wrapped it in a page off a dock manifest. Inside, in chalk, a four and a nine. Crates that went down this week, and the tier they went to. I ate the greens and burned the paper.')])] }],
      [say('sable', "That's the lot, Clerk. Unless you're buying the crate.")])
    : n === 2 ? one('sable', [
      say('sable', "Thin tonight. Tier Four's crates didn't come up. Don't ask me why. I only read the chalk."),
      narr('She was asking me why. I am the Count. If a tier stops sending crates up, it is because somebody on my floor has stopped sending air down.'),
      { choice: [
        pick('"I\'ll find out."', 1, [say('you', "I'll find out."), say('sable', 'Clerk will want the kale, then.'), narr('Loudly. I had said I, and not one. Four years of practice, and it fell out of my mouth over a crate of kale.')]),
        pick('"One will take what there is."', -1, [say('you', 'One will take what there is.'), say('sable', 'Noted.'), narr('She put a stalk of something in with it that I had not paid for. It is the nearest she comes to saying anything.')])] }],
      [say('sable', 'Come back when there are crates, Clerk.')])
    : one('sable', [
      say('sable', "Don't buy tonight. Two men have been reading my slate since first bell, and they aren't hungry."),
      narr('She said it without moving her mouth much. Then, for the ring:'),
      say('sable', 'Nothing fit for a clerk, Clerk. Come back when the crates are in.'),
      { choice: [
        pick('Walk on.', -1, [narr('I walked on. It was the only kindness I could do her, and it looked like the opposite of one.')]),
        pick('"Go down tonight, Sable. Take the stair."', 1, [say('you', 'Go down tonight, Sable. Take the stair.'), say('sable', 'I know where the stair is.'), narr('I had warned her out loud, on the ring. She pulled the shutter the rest of the way and did not look at me again. I do not blame her for the look.')])] }],
      [narr('The shutter is down. There is chalk on it. I do not stop to read it.')]));
  const npcs = [porter, clerk, sable,
    N('porter2', 150, 24, 'A PORTER WITH LINEN', () => n === 3 ? [narr('He does not say Clerk. He does not say anything. He has put the linen down so that both his hands are empty.')] : [say('porter2', 'Clerk.'), narr('That is the whole of what the service is allowed to say to me. One word, to the floor. I have been called worse by people who liked me.')])];
  if (n === 2) npcs.push(N('wren', -8, -20, 'KESTREL DRAY', one('wren', [
      say('wren', 'Sorrel. Come and put a hand on this. Tell me one is not imagining it.'),
      narr('She was standing in the ring with her palm flat on the riser, in front of every door on it. Engineers do not touch pipes. They read the board and send for somebody.'),
      narr('And she had turned her head to say it. She looks at people. Somebody must have told her not to. She cannot have seen the use of it.'),
      { choice: [
        { t: 'Take the glove off. Put your hand on the pipe.', fx: () => { F.wrenPipe = 1; }, then: [S(1), narr('It was running a breath short. Four beats and a catch. Four beats and a catch. Seren could have told you the valve by the catch. I could tell you the tier.'), say('you', 'East manifold. A seat is lifting.'), say('wren', '...Yes. That is what one thought. You did not look at the board.'), narr('She was not looking at the pipe any more. She was looking at my palm, and I put the glove back on it too slowly.')] },
        { t: '"One reads the board, Engineer."', fx: () => { F.wrenPipe = 0; }, then: [front, S(-1), say('you', 'One reads the board, Engineer.'), say('wren', 'The board says it is well. The board has said so for a year. Noted, Sorrel.'), narr('She kept her hand where it was. Walking away from that pipe was harder than walking past the bell.')] }] }],
      [say('wren', 'Four beats and a catch. One is not imagining it.')]), { palm: 1, fx: 1, fy: 0, still: 1 }));
  // ---- things on the wall
  const spots = [
    { id: 'window', x: -200, y: -32, r: 8, reach: 26, ph: 96, name: 'A WINDOW', verb: 'LOOK', talk: () => n === 1 ? [narr('The sky. It goes up and does not stop. I counted four hundred lights in it before I understood that they were not lamps, and that nobody trims them.'), narr('I did not sleep the first month. I still stand with my back to these when I can.')] : n === 2 ? [narr('I can look at it now for the length of a count. One. Two. At eleven I look away. It is not the sky\'s fault.')] : [narr('I looked at it for the whole of a count. There is no ceiling. There was never going to be one. I have stopped waiting.')] },
    { id: 'bellp', x: -120, y: -32, r: 8, reach: 26, ph: 104, name: 'THE BELL PLATE', verb: 'READ', talk: () => [narr('A gilt plate under the bell. ONE: A CLERK. TWO: A HOUSE. THREE: A MARSHAL. Below that the metal has been left bare. Nobody rings for the High Auditor.'), find('f_bellplate'), narr('Below we had one bell, and it meant get up. Nobody had to be told what to do with their knees.')] },
    { id: 'aldane', x: 120, y: -32, r: 8, reach: 24, ph: 104, name: 'A DOOR: ALDANE, M.', verb: 'READ', talk: () => n < 3 ? [narr("ALDANE, M. SECOND CLERK. Her lamp is lit under the door. She is checking somebody's columns. I know whose."), narr('She has not found a wrong one yet. It is the only thing on this ring I am proud of, and it is done under a dead boy\'s name.')] : [narr('ALDANE, M. Her lamp is out. It has never been out.')] },
    { id: 'line', x: 30, y: 24, r: 5, reach: 22, ph: 6, name: 'THE PAINTED LINE', verb: 'LOOK', talk: () => [narr('A hand wide, ochre, and repainted every rest day by the people who have to walk it. It runs from the service stair to every lamp and every door, and nowhere else.'), find('f_line'), narr('A porter who steps off it loses a day of air. Clerks are taught not to see it. I see nothing else.')] },
    { id: 'mine', x: 200, y: -32, r: 8, reach: 26, ph: 104, name: 'A DOOR: SORREL, E.', verb: 'GO IN', exit: 1, talk: () => { F['ring' + n] = 1; const v = F.susp || 0;
      if (n === 3) return [narr('SORREL, E. The door was not quite shut. I had shut it.'), narr('Nothing had been taken. On the desk lay my gloves, which I had left in the drawer. Side by side, with the palms up.'), { s: 'narr', t: 'She sent for me in the morning.' }];
      return v >= 5 ? [narr('SORREL, E. CLERK OF THE COUNT. Somebody has pushed a slip under the door. One word, in a clerk\'s hand. NOTED.'), fx(() => { F.fury = (F.fury || 0) + 1; }), narr('I had been noticed. Up here that is the first of three things. I did not know yet what the other two were.')]
        : v <= 1 ? [narr('SORREL, E. CLERK OF THE COUNT. A dead boy\'s name, in gilt.'), narr('Nobody looked at me the whole length of the ring. I have never worked so hard to be given nothing.')]
        : [narr('SORREL, E. CLERK OF THE COUNT. A dead boy\'s name, in gilt.'), narr('I shut it behind me and stood with my back against it, and took my gloves off, and looked at my hands until they were mine again.')]; } }];
  if (n !== 2) spots.push({ id: 'dray', x: -40, y: -32, r: 8, reach: 24, ph: 104, name: n === 1 ? 'A DOOR WITH A NEW SLATE' : 'A DOOR: DRAY, K.', verb: 'READ', talk: () => n === 1
    ? [narr('DRAY, K. ENGINEER. EAST MANIFOLD. The slate is new. I do not know the name. There is a thumbprint of grease on the handle that the porters have polished round and not over.'), find('f_handpipe'), narr('The riser runs up the wall beside the door. The paint is worn off it at the height of a hand.')]
    : [narr('DRAY, K. No lamp. She is on the Array board until the manifold is mended, and the manifold is not going to be mended.'), narr(F.wrenPipe ? 'The paint is worn off the riser beside her door at the height of a hand. There is a second worn place now, a little higher. That one is mine.' : 'The paint is worn off the riser beside her door at the height of a hand. I have never put mine there. I have wanted to every night for a year.')] });
  // ---- the bell
  const bell = n === 1 ? [fx(() => { Sound.play('bell'); ringT = 1; }), kneel(1),
      narr('One bell. Somewhere along the ring a clerk has come out of his door.'),
      narr('Both porters go down on the paint where they stand. One knee, head low, as if somebody had cut a string. The clerk walks between them without altering his step.'),
      { choice: [
        pick('Keep walking. Eyes front.', -1, [narr('I kept walking. My knees did not want to. They had a lifetime of bells in them and they wanted the floor. I got them past it.')]),
        pick('Look at them.', 1, [narr('I looked. The older one had put his hand flat on the floor to get down, and I knew the knuckles. Every valve hand on Tier Six has them.'), narr('Somebody across the ring was looking at me looking.')]),
        pick('Say it. "Get up."', 2, [say('you', 'Get up.'), narr('Neither of them moved. A clerk has no bell that means get up. I had given an order that does not exist, in a voice from six tiers down.'), narr('Ilse had warned me about that. She said it was how the last one was caught.')])] },
      kneel(0), narr('The bell stopped. They got up and stepped back onto the line, and the ring went on as if nothing had knelt.')]
    : n === 2 ? [fx(() => { Sound.play('bell'); ringT = 1; setTimeout(() => { if (Brawl.active) { Sound.play('bell'); ringT = 1; } }, 700); }), kneel(1),
      narr('Two bells. A House is on the ring.'),
      narr('The porters go down. So do the clerks, this time, from the neck. Every head on the ring drops the width of a hand. I am a clerk. Mine is supposed to drop with them.'),
      { choice: [
        pick('Bow from the neck, with the rest.', -1, [narr('I bowed. A boy in House colours went by at a stroll. I had put better than him on the grass in the valley. I looked at the floor until his boots were gone.')]),
        pick('Stay upright.', 2, [narr('I did not bow. I had won their Assay, and for the length of two bells I thought it had bought me a neck.'), narr('It had not. The boy in House colours noticed. Then every clerk on the ring noticed him noticing.')])] },
      kneel(0), narr('They got up. Nobody had looked at anybody. Everybody knew exactly who had done what.')]
    : null;
  return { era: 5, d2: 1, title: 'THE FOURTH RING', sub, bg: 'keep', bg2: 'ring4', arena: { kind: 'rect', w: 448, h: 60 }, music: 'spire', hero: { id: 'kaelc', hp: 10, pow: 1, blade: 0, fury0: 0 },
    walk: { id: 'ring' + n, spawn: [-206, 6], keep: () => false, props, npcs, spots, guard: n !== 3,
      open: () => n === 1 ? [narr('Up here nobody looks at anybody. I had to learn that before I learned anything else.'), narr('The fourth ring, at night. Eleven doors, a lamp between each, and a line painted on the floor that I am not supposed to see.')]
        : n === 2 ? [narr('The fourth ring. A year of it. I can walk it now without counting the doors.'), narr('That is the danger. The ones they catch are never caught in their first month.')]
        : [narr('The fourth ring was colder that season. Nobody had said anything. That was how I knew.')],
      obj: k => n === 3 ? 'GO HOME. GIVE THEM NOTHING ELSE.' : k.n >= 3 ? 'YOUR DOOR IS THE LAST ON THIS LENGTH. SORREL, E.' : 'THE FOURTH RING. WALK HOME LIKE A CLERK.',
      meter: () => ({ label: 'NOTICED', v: F.susp || 0, max: MAX }),
      tick(k, dt, B) { if (ringT > 0) ringT = Math.max(0, ringT - dt * .8);
        if (n === 3) { const a = B.allies.find(q => q.id === 'porter1'); if (a && !a.kn && Math.hypot(B.p.x - a.x, B.p.y - a.y) < 64) a.kn = 1; return null; }
        if (bell && !belled && k.n >= 3 && !Dialogue.active) { belled = 1; return bell; } return null; },
      floor(g) { for (let y = 0; y < 512; y += 32) for (let x = (y / 32 % 2) * 16 - 16; x < 512; x += 32) { const q = ((x * 7 + y * 13) % 5), c0 = ['#d9d3c6', '#d2ccbe', '#e0dbd0', '#d6d0c2', '#dcd6ca'][q < 0 ? 0 : q]; g.fillStyle = '#b4ad9e'; g.fillRect(x, y, 32, 32); g.fillStyle = c0; g.fillRect(x, y, 31, 31); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y, 31, 2); }
        g.fillStyle = '#c9963a'; g.fillRect(0, 256 + 21, 512, 5); g.fillStyle = '#e0b04c'; g.fillRect(0, 256 + 21, 512, 1); g.fillStyle = '#a87a2a'; g.fillRect(0, 256 + 25, 512, 1);
        for (let i = 0; i < wall.length; i++) { const v = wall[i]; if (v !== 'lamp' && v !== 'door') continue; const x = ((256 + (i - W0) * 40) % 512 + 512) % 512; g.fillStyle = '#c9963a'; g.fillRect(x - 2, 256 - 34, 4, 56); g.fillStyle = '#e0b04c'; g.fillRect(x - 2, 256 - 34, 1, 56); }
        g.fillStyle = 'rgba(20,26,58,.20)'; g.fillRect(0, 0, 512, 512); } } };
}
// ---- the Assay, day thirty-one, after dark: he comes back down the ridge in the Proctor's cloak, and the camp gets up behind him.
// A flash out of the fourth ring (a porter stepped aside for him, and he knows where he first saw that)
function walkCampNight() {
  const spots0 = [[-128, -18, 0], [-112, 30, 1], [-84, -40, 0], [-58, 26, 1], [-36, -30, 0], [-6, 34, 0], [22, -34, 1], [44, 14, 0], [70, -26, 2], [92, 30, 2], [112, -8, 3], [132, 22, 2], [146, -34, 3], [60, 40, 0]];
  const trail = []; let joined = 0, lastX = 1e9, lastY = 1e9;
  const N = (id, x, y, name, lines) => ({ id, x, y, name, crew: 1, talk: () => lines });
  const npcs = [
    N('petra', -70, -12, 'PETRA LUNE', [say('petra', 'One had you down as lost. One had ruled the line and everything.'), narr('She rubbed something off her slate with her thumb. Then she put the slate under her arm and fell in a pace behind me, without being asked.')]),
    N('oswin', 6, 8, 'OSWIN HALE', [say('oswin', 'Is that... one is not permitted to touch them. It is the only rule they have.'), say('you', 'One added a line.'), narr('He looked at the hem, and at the blood on it, and then he got up off his log. He had not stood up for anybody in thirty-one days. I do not think he knew he had done it.')]),
    N('cadt1', 104, 8, 'A CADET OF HOUSE TEAL', [say('cadt1', 'You are on Teal\'s side of the fire, Violet.'), narr('Then she saw the white, and the rest of it went out of her mouth unfinished. She had been told since she could walk what to do when that colour came toward her. Nobody had told her what to do about who was inside it.')]),
    ...spots0.map(([x, y, c], i) => ({ id: ['cadv1', 'cadv2', 'cadt1', 'cadt2'][c], x, y, r: 8, crew: 1, key: 'c' + i }))];
  return { era: 4, d2: 1, title: 'THE CLOAK', sub: 'THE ASSAY. DAY THIRTY-ONE, AFTER DARK', bg: 'storm', arena: { kind: 'ring', rx: 196, ry: 72 }, music: 'mystery', hero: { id: 'kael3', hp: 9, pow: 2, blade: 0, fury0: 0 },
    walk: { id: 'campnight', spawn: [-176, 30], clear: 220, npcs,
      open: () => [narr("I came down the ridge after dark in an Assayer's cloak, with his blood on the hem and his boots on my feet."), narr('Nobody on the dais came down to take it off me. So I walked into the camp to see what it was.')],
      obj: () => joined ? Math.min(70, Math.round(joined / npcs.length * 70)) + ' BEHIND YOU. THE CACHE IS AT THE FAR END OF THE CAMP.' : 'WALK INTO THE CAMP.',
      floor(g) { g.fillStyle = 'rgba(70,50,34,.5)'; g.beginPath(); g.ellipse(256, 256, 150, 40, 0, 0, 6.3); g.fill(); g.fillStyle = 'rgba(40,28,22,.6)'; g.beginPath(); g.ellipse(256 + 20, 256 - 6, 22, 11, 0, 0, 6.3); g.fill(); },
      props: [{ t: 'fire', x: 20, y: -6, k: 1 },
        { t: 'tent', x: -196, y: -62, c: '#7a5ac8', k: 1 }, { t: 'tent', x: -120, y: -88, c: '#7a5ac8', k: 2 }, { t: 'tent', x: -30, y: -96, c: '#7a5ac8', k: 3 }, { t: 'tent', x: 96, y: -92, c: '#2aa6a0', k: 4 }, { t: 'tent', x: 150, y: -84, c: '#2aa6a0', k: 5 },
        ...Array.from({ length: 14 }, (_, i) => ({ t: 'tree', x: -260 + i * 40 + (i * 13) % 17, y: -120 - (i * 7) % 30, k: i, h: 64 + (i * 11) % 24 })),
        { t: 'banner', x: -50, y: -78, c: '#7a5ac8', k: 1 }, { t: 'banner', x: 124, y: -80, c: '#2aa6a0', k: 2 }, { t: 'rank', x: -150, y: -40, at: 10, k: 1 }],
      spots: [
        { id: 'lamps', x: -30, y: -44, r: 6, reach: 24, ph: 70, name: "THE ASSAYERS' LAMPS", verb: 'LOOK UP', talk: () => [narr('Six lamps on the dais. Not one of them has moved. They are waiting to be told what a cadet in an Assayer\'s cloak is. There is no line for it.'), narr('Below, when there is no line for a thing, somebody burns. Up here, it seems, they wait.')] },
        { id: 'cache', x: 176, y: -22, r: 9, reach: 30, ph: 30, name: 'THE CACHE', verb: 'BREAK THE RIBBON', exit: 1, talk: () => [
          fx(() => { for (const a of Brawl.allies) if (a.crew && !a.fol) { a.fol = ++joined; a.r = 1; } }),
          narr('The cache. A white ribbon across the lid, and a seal that the collar in my hand opens. It has sat forty paces from seventy hungry people for a month, and not one of them has touched it. That is what the white is for.'),
          fx(() => Sound.play('clue')), narr('I broke it. Bread. Salve. Lamp oil. I gave it out by hand, Violet and Teal, in the order they were standing.'),
          narr('When I turned round they were all behind me. I had not called anybody.'),
          { s: 'narr', t: 'They did not follow me because I won. They followed me because I came back.' }] }],
      tick(k, dt, B) { const p = B.p; if (Math.hypot(p.x - lastX, p.y - lastY) > 7) { trail.push([p.x, p.y]); lastX = p.x; lastY = p.y; if (trail.length > 400) trail.shift(); }
        let slot = 0; for (const a of B.allies) { if (!a.crew) continue;
          if (!a.fol && (Math.hypot(p.x - a.x, (p.y - a.y) * .8) < 66 || (a.talk && k.said[a.key || a.id]))) { a.fol = ++joined; a.r = 1; if (!Settings.d.reduce) a.bark = { t: joined === 1 ? '...' : ['', '', 'HIM?', '', 'THE CLOAK.', '', '', 'VIOLET.', '', '', 'GET UP.'][joined % 11] || '', life: 1.1 }; if (a.bark && !a.bark.t) a.bark = null; HUD.dirty = true; }
          if (a.bark) { a.bark.life -= dt; if (a.bark.life <= 0) a.bark = null; }
          if (!a.fol) continue; slot++; const row = Math.ceil(a.fol / 2), side = a.fol % 2 ? -1 : 1, t = trail[Math.max(0, trail.length - 1 - row * 3)] || [p.x, p.y], dxp = p.fx || 1, tx = t[0] - (trail.length < row * 3 + 1 ? dxp * row * 18 : 0), ty = clamp(t[1] + side * (12 + (a.fol % 3) * 3), -64, 64), dx = tx - a.x, dy = ty - a.y, d = Math.hypot(dx, dy);
          if (d > 3) { const sp = Math.min(78, 20 + d * 3) * dt; a.x += dx / d * Math.min(sp, d); a.y += dy / d * Math.min(sp, d); a.anim = (a.anim || 0) + dt; a.fx = dx / d; a.fy = dy / d; } else { a.anim = 0; const q = Math.hypot(p.x - a.x, p.y - a.y) || 1; a.fx = (p.x - a.x) / q; a.fy = (p.y - a.y) / q; } }
        return null; } } };
}
FF.campnight = walkCampNight;
// ---- the service stair: behind a painted line no clerk crosses. Tier Six people, working the Spire's own valves
Object.assign(CAST, {
  svc1: { name: 'A valve hand', look: () => ({ knife: 1, skin: '#8a5a3e', hair: '#1a1014', style: 'short', shirt: '#5a5248', pants: '#2a2420', scarf: '#c9a23a' }) },
  svc2: { name: 'A woman with plates', look: () => ({ skin: '#c08a6a', hair: '#6a3a1a', style: 'bun', shirt: '#8a8478', pants: '#4a463e', scarf: '#c9a23a' }) },
  svc3: { name: 'A lamp trimmer', look: () => ({ skin: '#b07a5a', hair: '#d8d0c0', style: 'bald', shirt: '#6a5a48', pants: '#2a2420', scarf: '#c9a23a' }) }
});
function walkServiceStair() {
  const F = G.flags, once = {}, one = (id, first, again) => () => { if (once[id]) return again; once[id] = 1; return first; };
  const N = (id, x, y, name, talk, o) => Object.assign({ id, x, y, name, talk }, o || {}); let turn = 0, heard = 0;
  const wall = ['plain', 'lamp', 'plain', 'plain', 'door', 'lamp', 'valve', 'valve', 'plain', 'lamp', 'arch', 'plain', 'lamp', 'plain', 'plain'], W0 = 7;
  return { era: 5, d2: 1, title: 'THE SERVICE STAIR', sub: 'THE SUN SPIRE. THE PAINTED LINE', bg: 'keep', bg2: 'sstair', arena: { kind: 'rect', w: 300, h: 60 }, music: 'mystery', hero: { id: 'kaelc', hp: 10, pow: 1, blade: 0, fury0: 0 },
    walk: { id: 'sstair', spawn: [-44, 26], keep: () => false,   /* he starts just over the line, by the wheel; the door back is behind him, past the woman with plates */
      props: wall.map((v, j) => ({ t: 'swall', v, x: (j - W0) * 40, y: -40, k: j, turn: () => turn })),
      open: () => [narr('Behind the kitchens there is a door no clerk uses, and behind the door a line painted across the floor. I had looked at it every morning for a season.'), narr('That night I stepped over it.')],
      obj: k => heard ? 'GO BACK OVER THE LINE BEFORE YOU ARE MISSED.' : k.n ? 'THEY ARE WORKING. SO COULD YOU.' : 'THE SERVICE SIDE. NOBODY HERE IS LOOKING AT THE FLOOR.',
      npcs: [
        N('svc1', -6, -18, 'A VALVE HAND AT A SEIZED WHEEL', one('svc1', [
          say('svc1', "Seat's lifting on this one. Has been since first bell. They've sent for an engineer."),
          narr('He had his palm flat on the pipe beside it. He did not know he was doing it. Nobody from Tier Six does.'),
          { choice: [
            { t: '"It\'s not the seat. Back it a quarter, let it settle, then close."', fx: () => { F.svcValve = 1; }, then: [say('you', "It's not the seat. Back it a quarter, let it settle, then close."), fx(() => { turn = 1; Sound.play('clue'); }), narr('He did it. The wheel sighed, and came home.'), say('svc1', '...Who taught you that, Clerk?'), say('you', 'A careful woman.'), say('svc1', 'Aye. She would have been.'), narr('He did not look at my collar again. He looked at my hands, in their gloves. Then he went back to his work, and after a moment he said it. Very quietly.'), fx(() => { heard = 1; Sound.play('heart'); }), say('svc1', 'Brennick.')] },
            { t: 'Say nothing. A clerk does not know valves.', fx: () => { F.svcValve = 0; }, then: [narr('I said nothing. I stood and watched a man fight a wheel I could have closed with two fingers, and I kept my hands behind my back.'), say('svc1', "Don't trouble yourself, Clerk. It's only a valve."), narr('He waited until I had turned away. Then he said it to the pipe. Very quietly.'), fx(() => { heard = 1; Sound.play('heart'); }), say('svc1', 'Brennick.')] }] }],
          [say('svc1', "Mind how you go. The line's wet.")]), { palm: -1 }),
        N('svc2', -74, 16, 'A WOMAN WITH PLATES', () => [say('svc2', "Don't stand in the light, love. They can see this door from the ring."), narr('Love. Nobody has called me anything but Clerk and Sorrel for a season. I stood out of the light.')]),
        N('svc3', 84, -16, 'A LAMP TRIMMER', () => [say('svc3', "Crew Three, wasn't it. I trimmed the lamps over Bank Seven nine years before they brought me up."), narr('He said it to the wick he was cutting. Then he turned his head and looked at me, the way you look at somebody who has spoken. I had not spoken.'), say('svc3', "We hummed for her. Up here. They can't hear it through the stone.")])],
      spots: [
        { id: 'bank', x: -20, y: -32, r: 7, reach: 22, ph: 90, name: "THE SPIRE'S OWN VALVES", verb: 'LOOK', talk: () => [narr('The Spire breathes through valves like anybody. Twelve wheels on this landing, a gauge over each, and on every body the same foundry mark as Bank Seven.'), find('f_spirebank'), narr('The Accredited do not know that they have them. Somebody else has always turned them.')] },
        { id: 'stairs', x: 120, y: -32, r: 7, reach: 24, ph: 90, name: 'THE SERVICE STAIR', verb: 'LOOK DOWN', talk: () => [narr('Nine hundred steps down the outside of the Spire, with the line down the middle of every one. The wind comes up it. It smells of the kitchens, and under that, a long way under, of hot iron.')] },
        { id: 'back', x: -120, y: -32, r: 8, reach: 26, ph: 100, name: 'THE DOOR TO THE RING', verb: 'GO BACK', exit: 1, talk: () => { F.sstair = 1; return [narr('There is a line painted on the floor. On one side they call me Clerk.'), { s: 'narr', t: heard ? 'On the other they call me Brennick, very quietly.' : 'On the other they know exactly what I am, and have told nobody. I have never been so safe as I was on the wrong side of that paint.' }]; } }],
      tick() { return null; },
      floor(g) { for (let y = 0; y < 512; y += 24) for (let x = (y / 24 % 2) * 20 - 20; x < 512; x += 40) { const q = ((x * 7 + y * 13) % 4 + 4) % 4; g.fillStyle = '#1e1c22'; g.fillRect(x, y, 40, 24); g.fillStyle = ['#3a3840', '#34323a', '#403e46', '#373540'][q]; g.fillRect(x, y, 39, 23); }
        g.fillStyle = '#c9963a'; g.fillRect(0, 256 + 10, 512, 5); g.fillStyle = '#e0b04c'; g.fillRect(0, 256 + 10, 512, 1);
        const lx = 256 - 104; g.fillStyle = '#e8dcc0'; g.fillRect(lx, 0, 6, 512); g.fillStyle = '#c9963a'; g.fillRect(lx + 6, 0, 3, 512);   /* the line across: the clerk's side is west of it */
        g.fillStyle = 'rgba(8,6,10,.28)'; g.fillRect(0, 0, 512, 512); } } };
}
FF.sstair = walkServiceStair;
// ---- fifty years before the furnace: Celestine Aurel's own Assay, played as her. The island at night, and one wheel.
// It is the island mission's map (night twenty-five), cooled to grey; the Proctors walk the pickets' rounds
Object.assign(CAST, {
  cel20: { name: 'Celestine Aurel, a cadet', look: () => ({ accredited: 1, cadet: 1, gloves: '#a8905c', skin: '#f4e6dc', hair: '#f6eac0', style: 'long', long: 1, robe: '#f4f2ec', armor: '#f4f2ec', trim: '#e8c25a', sash: '#e8c25a' }) },
  proc50: { name: 'An Assayer', look: () => CAST.voss.look() }
});
Object.assign(MOUTH, { cel20: 'flat', proc50: 'flat' });
MISSIONS.ember = {
  map: 'raid', sheet: 'cel20', grey: 1, where: 'An Assay · forty-four years before the furnace', spawn: [2, 7, 3], toast: 'The pump house is north. Nobody is to see her.', hint: 'B: throw a pebble · hold A to work · watch the lamps turn',
  npcs: () => MF('shut') ? [] : [
    mG('proc50', 12, 8, 3, [[19, 8, 3, 1.4], [19, 13, 0, 1.6], [13, 13, 2, 1.4], [13, 8, 1, 1.6]]),
    mG('proc50', 22, 4, 0, [[22, 4, 2, 2], [22, 4, 0, 1.6], [22, 11, 0, 1.5], [22, 11, 2, 2], [22, 4, 1, 1.4]]),
    mG('proc50', 26, 9, 2, [[26, 9, 2, 2.2], [26, 9, 1, 1.7], [26, 9, 3, 1.3], [26, 9, 0, 1.7]])],
  obj: () => MF('shut') ? 'It is done. Walk.' : 'The pump house (north), unseen. Then the wheel: hold A.',
  mark: () => ({ x: 14 * 16, y: 4 * 16, lab: 'VALVE' }),
  holds: t => t.id === 'valve' && !MF('shut'),
  respawn: () => [2, 7, 3],
  caught: k => [say('proc50', ['CADET. THE ISLAND IS NOT YOURS TONIGHT.', 'BACK ACROSS THE FORD, CADET.', 'ONE SEES YOU. ONE IS WRITING IT DOWN.'][k % 3]), narr(k >= 2 ? 'She goes back to the reeds and waits. She has waited in worse places than reeds.' : 'Back to the reeds. An Assayer does not punish a cadet for trying. He only writes it down.')],
  use(t) {
    if (t.id === 'tcairn') return Dialogue.start([narr('Cairns. Every House builds them. She has not yet added to anybody\'s.')]);
    if (t.id === 'drop') return Dialogue.start([narr('A patron\'s crate on a gilt cord. Nothing has ever been lowered for her. The family that took her up placed its sum once, and is waiting to see.')]);
    if (t.id === 'tboard') return Dialogue.start([narr('The Assayers\' board. Her House is in the lower half of it. It will not be in the morning.')]);
    if (t.id === 'ttA' || t.id === 'ttB' || t.id === 'ttC') return Dialogue.start([narr('Canvas, for the look of the thing. That year the other House slept below, in the stack\'s undercroft, out of the storms. Forty of them on one draught. She has counted them in.')]);
    if (t.id === 'std') return Dialogue.start([narr('Their standard. Everybody comes for the standard. That is why there are four lamps on it, and none on the pump house.')]);
    if (t.id === 'valve') { if (MF('shut')) return Dialogue.start([narr('Shut. Holding.')]);
      return Dialogue.start([
        narr('The pump house. One wheel, and a line off the stack that feeds the undercroft: their lamps, and their air.'),
        narr('She takes one glove off. They took the burns off that palm when they took her up, and it still knows a wheel. Flat on the pipe first. Then the quarter turn.'),
        fx(() => Sound.play('heart')),
        say('cel20', 'It is only a valve. On Tier Six every child can turn one. Up here, nobody else would.'),
        fx(() => { MSET('shut'); G.flags.heistEase = 1; const m = MAPS.raid; m.lights = m.lights.filter(l => l.c !== '#ffe090'); for (const p of m.props) if (p.t === 'teallamp') p.a = 1; World.layer = renderMapLayer(World.map); Mission.resetNPCs(); World.grace = 99; Sound.play('rotate'); }),
        narr('The needle falls, and holds. Across the island their lamps go amber, and then out, one after another, like a tier at last bell.'),
        narr('She puts the glove back on and walks to her own fire. She does not run. Nobody is going to look for a cadet at a valve.'),
        narr('First light. They come up out of the undercroft with their hands open. Thirty-eight of them.'), fx(() => Sound.play('heart')), narr('Two do not wake.'),
        say('proc50', 'Genius.'), narr('He writes it in the book in the one word. She says nothing.'),
        fx(() => { G.flags.emberSeen = 1; })], () => Mission.finish()); }
  },
  reset() { const m = MAPS.raid; if (!m.lights0) m.lights0 = m.lights.slice(); if (!MF('shut')) { m.lights = m.lights0.slice(); for (const p of m.props) if (p.t === 'teallamp') p.a = 0; } }
};
// ---- a barge in the weather, eight years after the furnace: where he sat for a month and counted nothing, and what got him up
function walkBarge() {
  const N = (id, x, y, name, lines) => ({ id, x, y, name, talk: () => lines }); let weep = 1;
  return { era: 5, d2: 1, title: 'A BARGE, IN THE WEATHER', sub: 'EIGHT YEARS AFTER THE FURNACE', bg: 'storm', bg2: 'barge', arena: { kind: 'rect', w: 300, h: 56 }, music: 'mystery', hero: { id: 'kael2', hp: 10, pow: 1, blade: 0, fury0: 0 },
    walk: { id: 'barge', spawn: [-120, 14], keep: () => false,
      props: [...Array.from({ length: 13 }, (_, i) => ({ t: 'brail', x: (i - 6) * 40, y: -36, k: i, v: i === 7 ? 'halberd' : i % 4 === 1 ? 'lamp' : '' })), { t: 'bpipe', x: 112, y: -22, k: 1, weep: () => weep }, { t: 'bcrate', x: -40, y: -26, k: 1 }, { t: 'bcrate', x: -22, y: -28, k: 2 }, { t: 'bcrate', x: 44, y: 24, k: 3 }],
      open: () => [narr('I had not lost anything since the furnace. I had forgotten how it is done.'), narr('I sat on a barge in the weather for most of a month and did not count anything at all.')],
      obj: k => k.n >= 2 ? 'SOMETHING ON THIS DECK IS MAKING A NOISE.' : 'A MONTH ON THIS DECK. GET UP.',
      npcs: [
        N('ilse', -64, -4, 'ILSE MARRIN', [say('ilse', 'You have sat there a month, soot. I have said nothing. I am saying it now. This hull is making a noise, and I do not know what it means.'), narr('She has a table\'s worth of knives and has never once laid a hand on a pipe. She was asking me. Ilse does not ask.')]),
        N('hollis', 8, -4, 'HOLLIS THE WELDER', [say('hollis', "He put a halberd butt in my arm once. For humming. I'd have liked to tell him it mended."), narr('He was looking at the halberd on the rail. Somebody had brought it off the dock stair. Nobody has said who.')]),
        N('bao', 70, 16, 'BAO, AT THE WHEEL', [say('bao', "It's a cart with no road under it. I keep telling myself that. Sit, Kael. Eat."), narr('A noodle seller is flying a barge. Four hundred hulls in this weather, and every one of them has somebody like him on the wheel, telling themselves something.')]),
        N('sable', -8, 20, 'SABLE', [say('sable', "Eat something. I didn't skim it for the gulls."), narr('Greens. She has kept a cold crate going through a month of cloud for a man who would not look at it.')])],
      spots: [
        { id: 'halberd', x: 44, y: -30, r: 5, reach: 28, ph: 70, name: "BRAND'S HALBERD", verb: 'LOOK', talk: () => [narr('Lashed to the rail, butt down, the way he grounded it. Eleven minutes. Somebody timed it. I asked them to.'), narr('I have not touched it. I am not the one it should go to.')] },
        { id: 'rail', x: -110, y: -30, r: 5, reach: 28, ph: 24, name: 'THE RAIL', verb: 'LOOK OUT', talk: () => [narr('Cloud, and in the cloud the hooded lamps of the others, rising and falling. Four hundred barges, hidden in the weather. From below we must look like nothing at all.'), narr('There is no ceiling. I have stopped minding. I had not noticed that I had stopped.')] },
        { id: 'seal', x: 112, y: -14, r: 8, reach: 26, ph: 18, name: 'A WEEPING SEAL', verb: 'PUT A HAND ON IT', exit: 1, talk: () => [
          narr('It was a valve that got me up. A seal weeping on the third barge, and four hundred hulls, and nobody else aboard who knew what the sound meant.'),
          fx(() => { Sound.play('heart'); }), { s: 'narr', t: 'I went and put my hand flat on the pipe, the way she taught me.' }] }],
      floor(g) { g.fillStyle = '#141826'; g.fillRect(0, 0, 512, 512); for (let y = 256 - 40; y < 256 + 40; y += 8) { for (let x = ((y / 8) % 2) * 32 - 32; x < 512; x += 64) { const q = ((x * 5 + y * 3) % 4 + 4) % 4; g.fillStyle = '#2a2018'; g.fillRect(x, y, 64, 8); g.fillStyle = ['#5a4634', '#54402e', '#604c38', '#574331'][q]; g.fillRect(x, y, 63, 7); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x, y, 63, 1); g.fillStyle = '#2a2018'; g.fillRect(x + 2, y + 3, 1, 1); g.fillRect(x + 60, y + 3, 1, 1); } }
        g.fillStyle = '#2a2018'; g.fillRect(0, 256 - 42, 512, 3); g.fillRect(0, 256 + 39, 512, 4); g.fillStyle = 'rgba(120,150,190,.10)'; g.fillRect(0, 256 - 40, 512, 80); } } };
}
// ---- three weeks before the furnace: Seren, alone in Bay Three after last bell, tracing the line under Bank Seven. Played as her; told from outside
function walkSerenLine() {
  let step = 0, drawn = -1; const OBJ = ['BANK SEVEN IS TELLING HER SOMETHING. PUT A HAND ON IT.', 'FOLLOW THE LINE UNDER THE GRATING.', 'OLD ORIN IS STILL HERE. ASK HIM.', 'BACK TO THE TEE.'];
  /* each marker says plainly when it is not the one yet, and which one is; the one that is ready has a ring of lamplight on the floor */
  const notYet = () => ({ s: 'narr', t: 'NOT YET. FIRST: ' + OBJ[Math.min(3, step)] });
  const need = (n, lines, other) => () => { if (step < n) return other.concat([notYet()]); if (step === n) step = n + 1; return lines; };
  const AT = [[-30, -34], [-68, -8], [30, 14], [-100, 22]], verb = (n, v) => () => step >= n ? v : 'LOOK';
  return { era: 0, title: 'BAY THREE', sub: 'THREE WEEKS BEFORE THE FURNACE. AFTER LAST BELL', bg: 'furnace', arena: { kind: 'rect', w: 230, h: 84 }, music: 'hum', hero: { id: 'seren', hp: 6, pow: 1, blade: 0, fury0: 0 },
    walk: { id: 'serenline', spawn: [-86, 22], keep: () => false, guard: false,
      props: [{ t: 'kboard', x: 58, y: -44, own: () => 1, k: 1 }, { t: 'vbank', x: -30, y: -46, n: 7, k: 1 }, { t: 'vbank', x: -96, y: -46, n: 6, k: 2 }, ...[-150, 0, 120].map((x, i) => ({ t: 'lamp', x, y: -52, k: i }))],
      floor(g) { const X = x => 256 + x, Y = y => 256 + y; g.fillStyle = 'rgba(20,12,10,.55)'; g.fillRect(X(-78), Y(-14), 22, 14); g.strokeStyle = 'rgba(160,150,140,.7)'; g.lineWidth = 1; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(X(-78) + i * 4 + .5, Y(-14)); g.lineTo(X(-78) + i * 4 + .5, Y(0)); g.stroke(); } g.strokeRect(X(-78) + .5, Y(-14) + .5, 22, 14);
        g.fillStyle = 'rgba(40,24,18,.5)'; g.fillRect(X(-34), Y(-40), 5, 30); g.fillRect(X(-66), Y(-12), 36, 5); g.fillRect(X(-100), Y(-2), 5, 24); g.fillRect(X(-100), Y(-2), 26, 5);
        g.fillStyle = 'rgba(20,12,10,.7)'; g.beginPath(); g.arc(X(-98), Y(24), 6, 0, 6.3); g.fill(); g.strokeStyle = 'rgba(170,60,40,.9)'; g.lineWidth = 2; g.beginPath(); g.arc(X(-98), Y(24), 4, 0, 6.3); g.stroke();
        { const a = AT[Math.min(3, step)], cx = X(a[0]), cy = Y(a[1] + (step === 0 || step === 2 ? 8 : 0)); const gr = g.createRadialGradient(cx, cy, 2, cx, cy, 26); gr.addColorStop(0, 'rgba(255,200,110,.75)'); gr.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, 26, 13, 0, 0, 6.3); g.fill();
          g.strokeStyle = '#ffe08a'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, cy, 15, 7.5, 0, 0, 6.3); g.stroke(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,224,138,.6)'; g.beginPath(); g.ellipse(cx, cy, 20, 10, 0, 0, 6.3); g.stroke(); } },
      tick(k, dt, B) { const n = Math.min(3, step); if (n !== drawn) { drawn = n; if (B._wtex) { delete B.tex[B._wtex]; delete B.pat[B._wtex]; } } return null; },
      open: () => [narr('Last bell is an hour gone and the bay is hers. She has told Kael she is checking a gauge. It is nearly true.')],
      obj: () => ['BANK SEVEN IS TELLING HER SOMETHING. PUT A HAND ON IT.', 'FOLLOW THE LINE UNDER THE GRATING.', 'OLD ORIN IS STILL HERE. ASK HIM.', 'BACK TO THE TEE.'][Math.min(3, step)],
      npcs: [{ id: 'orin', x: 30, y: 14, name: 'OLD ORIN', talk: need(2, [
        say('seren', 'Orin. The capped tee under Seven. Where does it go?'),
        say('orin', "Forty years I've hung my knife on that board. Don't ask me that one, girl."),
        say('seren', "I'm asking."),
        say('orin', "The ward. It fed the fever ward, before the Count shut the fans. Open it and forty beds breathe. And the audit shows a bled line with Crew Three's number on it."),
        say('orin', "They don't strike a line for that. They strike a crew."),
        narr('He does not look at her while he says it. He looks at the board, and the hooks.')],
        [say('orin', 'The pipes are talking tonight. Hm.'), narr('He talks to pipes. She has always thought he was the only one on the tier who listened to the answers.')]) }],
      spots: [
        { id: 'bank', x: -30, y: -34, r: 8, reach: 26, ph: 50, name: 'BANK SEVEN', get verb() { return verb(0, 'PUT A HAND ON IT')(); }, talk: need(0, [
          narr('Her palm flat on the pipe, first. Then her ear. It is telling her something it has never told the gauge.'),
          narr('There is more going into this bank than comes out of it at the rack. Not much. A breath in every forty.')],
          [narr('Bank Seven. Four beats, and four beats. It keeps time better than the bell.')]) },
        { id: 'grate', x: -68, y: -8, r: 6, reach: 22, ph: 6, name: 'THE GRATING', get verb() { return verb(1, 'TRACE THE LINE')(); }, talk: need(1, [
          narr('She follows it with her hand, under the grating, to where the main splits. A blind tee, capped, with a wheel nobody has painted a number on.'),
          narr('Somebody built a way round the meter into Bank Seven when the bank was built. Nobody on Crew Three has ever said so. Everybody on Crew Three walks round this grating.')],
          [narr('A grating like the others. Everybody walks round it. She had never asked herself why.')]) },
        { id: 'board', x: 58, y: -36, r: 9, reach: 26, ph: 62, name: 'THE SEAT BOARD', verb: 'LOOK', talk: () => [narr('Her knife is on its hook. Three hundred and six. His is on the next one along.'), narr('She touches his with one finger, so that it swings, and stops it again.')] },
        { id: 'tee', x: -100, y: 22, r: 5, reach: 20, ph: 6, name: 'THE CAPPED TEE', get verb() { return verb(3, 'LEAVE IT SHUT')(); }, exit: () => step >= 3, talk: () => step < 3 ? [narr('She does not know yet what it is.'), notYet()] : [
          narr('She does not open it. There is nobody in the ward tonight.'),
          narr('But she knows where it is now, and what it costs. And that on the day somebody opens it, there will have to be a name.'),
          fx(() => Sound.play('heart')), say('seren', 'Somebody will have to answer for it. Let it be somebody who knew.'), fx(() => { G.flags.serenLine = 1; })] }] } };
}
FF.barge = walkBarge; FF.serenline = walkSerenLine;
FF.ring = walkRing; FF.ring1 = () => walkRing(1); FF.ring2 = () => walkRing(2); FF.ring3 = () => walkRing(3);
FF.campday = walkCampDay; FF.lastbell = walkLastBell;
/* every walk place asks before it lets him out early (see walkGuard). Reassigned here so that direct calls (part2, story, rowk) get it too */
{ const G0 = f => function () { return walkGuard(f.apply(this, arguments)); };
  walkCircle = G0(walkCircle); walkSquare = G0(walkSquare); walkRowMorning = G0(walkRowMorning); walkWard = G0(walkWard); walkCampDay = G0(walkCampDay); walkLastBell = G0(walkLastBell);
  walkRing = G0(walkRing); walkCampNight = G0(walkCampNight); walkServiceStair = G0(walkServiceStair); walkBarge = G0(walkBarge); walkSerenLine = G0(walkSerenLine);
  FF.circle = walkCircle; FF.square = walkSquare; FF.rowmorn = walkRowMorning; FF.ward = walkWard; FF.campnight = walkCampNight; FF.sstair = walkServiceStair; FF.barge = walkBarge; FF.serenline = walkSerenLine;
  FF.ring = walkRing; FF.ring1 = () => walkRing(1); FF.ring2 = () => walkRing(2); FF.ring3 = () => walkRing(3); FF.campday = walkCampDay; FF.lastbell = walkLastBell; }
