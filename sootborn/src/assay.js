// ------------------------------------------------------------------ The Assay, on foot.
// Playable 2D missions above the rock. They run inside a cutscene script as { mission: 'key' } and hand back to it when done.
Object.assign(CAST, {
  petra: { name: 'Petra Lune, House Violet', look: () => CAST.cadv2.look() },
  oswin: { name: 'Oswin Hale, House Violet', look: () => CAST.cadv1.look() },
  maren: { name: 'Maren Aldane', look: () => ({ accredited: 1, skin: '#e8c8a8', hair: '#b08a50', style: 'long', long: 1, robe: '#e8e0cc', trim: '#e8c25a', sash: '#7a5ac8' }) }
});
Object.assign(MOUTH, { petra: 'flat', oswin: 'frown', maren: 'flat' });

MAPS.vcamp = buildMap({
  name: 'House Violet — the camp', w: 24, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(22,12,40,.5)',
  set: [[1, 7, 22, 1, ','], [3, 8, 1, 3, ','], [20, 6, 1, 1, ','], [12, 4, 1, 3, ',']],
  props: [{ t: 'vtent', x: 4, y: 4, a: '#7a5ac8', block: blk(4, 4, 2) }, { t: 'vtent', x: 8, y: 4, a: '#7a5ac8', block: blk(8, 4, 2) }, { t: 'vtent', x: 16, y: 4, a: '#7a5ac8', block: blk(16, 4, 2) },
    { t: 'standard', x: 12, y: 3, a: '#7a5ac8', block: blk(12, 3) }, { t: 'campfire', x: 12, y: 9, block: blk(12, 9) }, { t: 'woodpile', x: 20, y: 5, block: blk(20, 5) },
    { t: 'pumphouse', x: 2, y: 11, block: blk(2, 11, 2) }, { t: 'bedroll', x: 9, y: 10 }, { t: 'bedroll', x: 15, y: 11 }, { t: 'bedroll', x: 17, y: 9 }, { t: 'stakes', x: 19, y: 11, a: 3 }],
  lights: [{ x: 200, y: 60, r: 70, c: '#c8b0ff' }, { x: 60, y: 150, r: 40, c: '#8ad8b0' }],
  hot: [{ id: 'fire', tiles: blk(12, 9) }, { id: 'wood', tiles: blk(20, 5) }, { id: 'pump', tiles: blk(2, 11, 2) }, { id: 'vstd', tiles: blk(12, 3) }, { id: 'tentA', tiles: blk(4, 4, 2) }, { id: 'tentB', tiles: blk(8, 4, 2) }, { id: 'tentC', tiles: blk(16, 4, 2) }], exits: []
});
MAPS.raid = buildMap({
  name: 'House Teal — the island', w: 30, h: 15, theme: 'valley', music: 'mystery', dark: 'rgba(4,6,18,.76)',
  set: [[6, 2, 2, 12, '~'], [6, 7, 2, 2, ','], [1, 7, 5, 1, ','], [8, 7, 19, 1, ','], [14, 5, 1, 2, ','], [12, 10, 1, 1, '#'], [17, 5, 1, 1, '#'], [21, 6, 1, 1, '#'], [15, 12, 1, 1, '#'], [24, 11, 1, 1, '#'], [10, 4, 1, 1, '#'], [18, 10, 1, 1, '#'], [25, 4, 1, 1, '#']],
  props: [{ t: 'pumphouse', x: 13, y: 4, block: blk(13, 4, 2) }, { t: 'vtent', x: 10, y: 11, a: '#3aa8a0', block: blk(10, 11, 2) }, { t: 'vtent', x: 19, y: 3, a: '#3aa8a0', block: blk(19, 3, 2) }, { t: 'vtent', x: 20, y: 11, a: '#3aa8a0', block: blk(20, 11, 2) },
    { t: 'teallamp', x: 10, y: 6, block: blk(10, 6) }, { t: 'teallamp', x: 17, y: 9, block: blk(17, 9) }, { t: 'teallamp', x: 23, y: 9, block: blk(23, 9) }, { t: 'teallamp', x: 24, y: 5, block: blk(24, 5) },
    { t: 'standard', x: 27, y: 7, a: '#3aa8a0', block: blk(27, 7) }, { t: 'bedroll', x: 21, y: 9, a: '#3aa8a0' }, { t: 'bedroll', x: 19, y: 12, a: '#3aa8a0' }, { t: 'stakes', x: 26, y: 4, a: 2 }, { t: 'stakes', x: 26, y: 11, a: 2 }],
  lights: [{ x: 168, y: 96, r: 54, c: '#ffe090' }, { x: 280, y: 146, r: 54, c: '#ffe090' }, { x: 376, y: 144, r: 54, c: '#ffe090' }, { x: 392, y: 80, r: 54, c: '#ffe090' }, { x: 224, y: 60, r: 30, c: '#8ad8b0' }],
  hot: [{ id: 'valve', tiles: blk(13, 4, 2) }, { id: 'std', tiles: blk(27, 7) }, { id: 'ttA', tiles: blk(10, 11, 2) }, { id: 'ttB', tiles: blk(19, 3, 2) }, { id: 'ttC', tiles: blk(20, 11, 2) }], exits: []
});
MAPS.dais = buildMap({
  name: "The Proctors' dais", w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(6,6,20,.7)',
  set: [[8, 3, 12, 8, '='], [1, 8, 7, 1, ','], [4, 5, 1, 1, '#'], [5, 11, 1, 1, '#'], [22, 4, 1, 1, '#'], [22, 10, 1, 1, '#']],
  props: [{ t: 'canopy', x: 11, y: 4, a: 6 }, { t: 'lectern', x: 10, y: 4, a: 1, block: blk(10, 4) }, { t: 'lectern', x: 14, y: 4, a: 2, block: blk(14, 4) }, { t: 'lectern', x: 18, y: 4, a: 3, block: blk(18, 4) },
    { t: 'crate', x: 11, y: 7, block: blk(11, 7) }, { t: 'barrel', x: 16, y: 7, block: blk(16, 7) }, { t: 'crate', x: 13, y: 9, block: blk(13, 9) }, { t: 'barrel', x: 18, y: 9, block: blk(18, 9) }, { t: 'crate', x: 8, y: 6, block: blk(8, 6) },
    { t: 'teallamp', x: 8, y: 3, block: blk(8, 3) }, { t: 'teallamp', x: 19, y: 3, block: blk(19, 3) }, { t: 'standard', x: 21, y: 7, a: '#e8c25a', block: blk(21, 7) }],
  lights: [{ x: 136, y: 50, r: 50, c: '#ffe090' }, { x: 312, y: 50, r: 50, c: '#ffe090' }, { x: 232, y: 70, r: 40, c: '#4ad8e0' }],
  hot: [{ id: 'book', tiles: blk(10, 4) }, { id: 'glass', tiles: blk(14, 4) }, { id: 'roster', tiles: blk(18, 4) }, { id: 'eye', tiles: blk(21, 7) }, { id: 'cloak', tiles: blk(11, 7).concat(blk(13, 9)) }], exits: []
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
    map: 'vcamp', spawn: [2, 7, 3], toast: 'House Violet has not eaten in three days.', hint: 'Talk to the cadets · wood, water, fire',
    npcs: () => [mS('petra', 10, 8, 3), mS('oswin', 15, 9, 2), mS('cadv1', 18, 6, 0)],
    obj: () => !MF('wood') ? 'Fetch wood from the pile (east)' : !MF('pump') ? 'Raise water at the pump house (south-west)' : 'Light the fire (hold)',
    mark: () => !MF('wood') ? { x: 20.5 * 16, y: 5 * 16, lab: 'WOOD' } : !MF('pump') ? { x: 3 * 16, y: 11 * 16, lab: 'PUMP' } : { x: 12.5 * 16, y: 9 * 16, lab: 'FIRE' },
    holds: t => t.id === 'fire' && MF('wood') && MF('pump'),
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
      if (t.id === 'tentA') return Dialogue.start([narr('A campaign chest with a House crest on the lid. Eleven changes of linen, a silver comb, a book of forms. No tinder. No pot. Somebody packed this for him, and nobody who packed it had ever been cold.')]);
      if (t.id === 'tentB') return Dialogue.start([narr('A slate propped on a bedroll, in a small child\'s hand: "MOTHER SAYS YOU ARE TO FINISH FIRST OR NOT COME HOME. BRING ME A STANDARD."'), narr('There is a sun drawn in the corner. A circle, and rays. They draw them too. I do not know why that should be the thing that gets under the wire.')]);
      if (t.id === 'tentC') return Dialogue.start([narr('Not a tent. The Proctors\' cache: salve, bread, lamp oil, under a white ribbon and a card. "NOT TO BE OPENED BY CADETS. A RESULT MUST BE EARNED."'), narr('It is forty paces from thirty hungry children. Nobody has touched the ribbon. They would sooner starve than be marked down.'), fx(() => { if (!MF('cache')) rage(1); MSET('cache'); })]);
      if (t.id === 'vstd') return Dialogue.start([narr('House Violet\'s standard. A pole, a square of cloth, a gold boss. Lose it and the House is struck from the Assay. They guard it better than they feed themselves.')]);
      if (t.id === 'wood') return Dialogue.start(MF('wood') ? [narr('Enough for tonight.')] : [narr('Somebody cut this before the Assay began and stacked it where the cadets would find it. They walked past it for three days. Nobody had told them wood was for anything.'), narr('I take an armful. It smells like nothing in Cinderwell. It smells like the inside of the leaf.'), fx(() => { MSET('wood'); Sound.play('coin'); })]);
      if (t.id === 'pump') { if (MF('pump')) return Dialogue.start([narr('It is drawing. Warm, and it will stay warm.')]);
        return Dialogue.start([narr('A pump house. Dressed stone, a wheel, a gauge. It is the only thing in this valley built like home.'), narr('Names are cut into the lintel, a row for every Assay. Hundreds. A few have a small gold nail beside them. Most have a line scored through. They keep a Count even here.'), narr('My hand is flat on the pipe before I think about it.'), fx(() => Puzzle.open([CAMP_PUZZLE], () => { MSET('pump'); G.mode = 'world'; Sound.music('mystery'); Dialogue.start([
          narr('It draws. The water comes up warm.'), fx(() => Sound.play('heart')),
          narr('Warm. There is only one thing under this rock that makes water warm. I know the line. I have bled it.'),
          narr('The Assay valley is the roof of Cinderwell. Their children are playing at war on top of Tier Four, and the pump they cannot work is fed off the same Array my tier is rationed from.'),
          narr('I stand there with my hand on the pipe and listen. Eleven hundred people, forty feet down. I cannot hear one of them.'),
          fx(() => rage(2))]); }))]); }
      if (t.id === 'fire') { if (!(MF('wood') && MF('pump'))) return Dialogue.start([narr(MF('wood') ? 'Wood, and no water to cook with. The pump first.' : 'A ring of stones somebody laid for them. Cold. It wants wood.')]);
        MAPS.vcamp.props.find(p => p.t === 'campfire').a = 1; World.layer = renderMapLayer(World.map); MAPS.vcamp.lights.push({ x: 200, y: 150, r: 74, c: '#ffb050', m: 1 }); Sound.play('pillar');
        return Dialogue.start([
          narr('Flint off the pump housing, a curl of bark, and breath. Seren taught me on a valve block, with the ration fuel, when we were nine.'),
          say('petra', '...It is lit. He has lit it.'),
          say('oswin', 'How did you learn that, Sorrel?'),
          { choice: [
            { t: 'One was taught by somebody better.', then: [say('oswin', 'Then I should like to have met them.'), narr('No. You would have had her kneel.')] },
            { t: 'One was cold once.', then: [say('petra', 'Nobody is cold. It is not... Well. One supposes somebody must be.'), narr('She looked at the fire as if it had said something rude.')] }] },
          narr('They came out of the tents one at a time and sat down. Forty of them. Nobody gave an order. By morning they were asking me where to put the pickets.'),
          narr('I have thought about it since. They did not follow me because I walked out of the Pairing. They followed me because I could light a fire. It is the cheapest thing I ever sold them.')], () => Mission.finish()); }
    },
    reset() { const f = MAPS.vcamp.props.find(p => p.t === 'campfire'); if (f) f.a = 0; MAPS.vcamp.lights = MAPS.vcamp.lights.filter(l => !l.m); }
  },
  // The night before day twenty-six. House Teal's island. The first time Wren Halloran does not see his face.
  raid: {
    map: 'raid', spawn: [2, 7, 3], toast: 'Their lamps run off the vent stack. Find the valve.', hint: 'B: throw a pebble · hold A to work · watch the lamps turn',
    npcs: () => { const slow = MF('dark') ? 2.4 : 1.5, a = [
      mG('cadt1', 12, 8, 3, [[19, 8, 3, 1.4], [19, 13, 0, slow], [13, 13, 2, 1.4], [13, 8, 1, slow]]),
      mG('cadt2', 22, 4, 0, [[22, 4, 2, 2], [22, 4, 0, 1.6], [22, 11, 0, 1.5], [22, 11, 2, 2], [22, 4, 1, 1.4]]),
      mG('cadt1', 26, 9, 2, [[26, 9, 2, 2.2], [26, 9, 1, 1.7], [26, 9, 3, 1.3], [26, 9, 0, 1.7]])];
      if (MF('dark')) { a.pop(); a.push(mS('wren', 16, 5, 0)); } return a; },
    obj: () => !MF('dark') ? "Shut the lamp valve at the pump house (north), unseen" : "Take House Teal's standard (east), unseen",
    mark: () => !MF('dark') ? { x: 14 * 16, y: 4 * 16, lab: 'VALVE' } : { x: 27.5 * 16, y: 7 * 16, lab: 'STANDARD' },
    holds: t => (t.id === 'valve' && !MF('dark')) || (t.id === 'std' && MF('dark')),
    respawn: () => MF('dark') ? [14, 6, 0] : [2, 7, 3],
    caught: k => [say('cadt1', ['HOLD. WHO IS THAT?', 'VIOLET! ON THE ISLAND!', 'THERE. BY THE WATER.'][k % 3]), narr(k >= 2 ? 'I am back in the reeds before the lamp finishes turning. They are tired. They are looking less carefully than they were.' : 'I go back into the reeds and the dark, and wait for them to decide it was a deer.')],
    use(t) {
      if (t.id === 'wren') return Dialogue.start([say('wren', 'Go on. One saw nothing. One is watching a gauge.')]);
      if (t.id === 'ttA') return Dialogue.start([narr('Their captain\'s tent. He has ranked his own cadets on a board, one to forty, and hung it where all of them can read it. The bottom three names are underlined.')]);
      if (t.id === 'ttB') return Dialogue.start([narr('A cadet asleep with her boots on and a letter in her fist. "Darling. Your father and I have placed a sum on Teal. Do not embarrass it."'), fx(() => { if (!MF('letter')) rage(1); MSET('letter'); })]);
      if (t.id === 'ttC') return Dialogue.start([narr('Their cook-fire is a Proctor\'s lamp with the shade off. They never lit a real one either. They are only richer about it.')]);
      if (t.id === 'std') { if (!MF('dark')) return Dialogue.start([narr('Four lamps and a picket standing on it. Not while they can see.')]);
        return Dialogue.start([narr('I take the pole in both hands. It is lighter than a valve wheel.'), narr('Thirty cadets asleep around it who would have killed me for it at noon. In the dark they are only breathing. Everybody breathes the same in the dark.'), narr('In the morning the Sisters Vey will come across the river for it, and for me.')], () => Mission.finish()); }
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
  mark() { return this.def && this.def.mark ? this.def.mark() : null; },
  holds(t) { return !!(this.def && t && t.kind === 'hot' && this.def.holds(t)); },
  use(t) { this.def.use(t); },
  respawn() { const s = (this.def.respawn ? this.def.respawn() : this.def.spawn); return { x: s[0] * 16 + 8, y: s[1] * 16 + 4, dir: s[2] }; },
  caught(n) { const k = G.flags.mCaught = (G.flags.mCaught || 0) + 1; if (k >= 2) G.flags.heistEase = 1; Dialogue.start(this.def.caught ? this.def.caught(k, n) : [narr('Seen.')]); },
  finish() {
    if (G.heist !== 3) return; const pv = this.prev || {}, cb = this.done; this.done = null;
    G.heist = 0; G.flags.heistEase = 0; World.bolt = null; World.ripple = null; World.dynLights = []; World.npcs = []; World.work = 0; World.alert = 0; for (const k of Object.keys(G.flags)) if (k.startsWith('m_')) delete G.flags[k]; if (this.def.reset) this.def.reset();
    if (Dialogue.active) Dialogue.end(); UI.clear();
    P.sheet = pv.sheet || P.sheet; World.showPlayer = pv.show; World.darkOverride = pv.dark || null;
    if (pv.map && MAPS[pv.map]) World.load(pv.map, { x: pv.x, y: pv.y, dir: pv.dir }, true);
    Sound.play('ok'); Fade.a = 1; Fade.dir = 0; Fade.busy = false; HUD.dirty = true;
    if (cb) cb(); else Game.toTitle();
  }
};

// ------------------------------------------------------------------ Part Two on foot: the Count hall, and the square five years on.
MAPS.counthall = buildMap({
  name: 'The Count hall — fourth ring', w: 24, h: 13, theme: 'spire', music: 'spire', dark: 'rgba(8,8,26,.6)',
  set: [[1, 7, 22, 1, ',']],
  props: [{ t: 'holes', x: 1, y: 3, a: 2, block: blk(1, 3, 2) }, { t: 'countbook', x: 11, y: 3, block: blk(11, 3, 2) }, { t: 'lectern', x: 22, y: 4, a: 3, block: blk(22, 4) },
    { t: 'cdesk', x: 4, y: 4, block: blk(4, 4, 2) }, { t: 'cdesk', x: 8, y: 5, block: blk(8, 5, 2) }, { t: 'cdesk', x: 15, y: 4, a: 1, block: blk(15, 4, 2) }, { t: 'cdesk', x: 19, y: 5, block: blk(19, 5, 2) },
    { t: 'cdesk', x: 3, y: 10, a: 1, block: blk(3, 10, 2) }, { t: 'cdesk', x: 8, y: 9, block: blk(8, 9, 2) }, { t: 'cdesk', x: 14, y: 10, block: blk(14, 10, 2) }, { t: 'cdesk', x: 20, y: 9, block: blk(20, 9, 2) }],
  lights: [{ x: 72, y: 168, r: 44, c: '#ffe090' }, { x: 264, y: 72, r: 48, c: '#ffe090' }, { x: 192, y: 52, r: 40, c: '#e8c25a' }, { x: 360, y: 60, r: 34, c: '#c8d8ff' }],
  hot: [{ id: 'shelf', tiles: blk(1, 3, 2) }, { id: 'count', tiles: blk(11, 3, 2) }, { id: 'tray', tiles: blk(22, 4) }, { id: 'marendesk', tiles: blk(15, 4, 2) }, { id: 'mydesk', tiles: blk(3, 10, 2) }, { id: 'motto', tiles: blk(6, 1, 2) }, { id: 'win', tiles: blk(17, 1) }, { id: 'deskA', tiles: blk(8, 5, 2) }, { id: 'deskB', tiles: blk(20, 9, 2) }], exits: []
});
MAPS.night5 = buildMap(Object.assign({}, SQUARE_DEF, { name: 'Ashgate Square — five years on', music: 'mystery', dark: 'rgba(6,4,14,.7)', hot: [{ id: 'pillarSun', tiles: blk(13, 8) }, { id: 'lift5', tiles: blk(12, 1, 2) }, { id: 'notice5', tiles: blk(7, 1, 2) }], exits: [] }));
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
      if (t.id === 'marendesk') return Dialogue.start([narr('Maren Aldane\'s desk. Her lamp is still lit. She has left a second book open under the day\'s columns, and it is not the Count.'), narr('Sealed pairings. The Assay of four years ago. A ribbon at one page, and two names on it.'), fx(() => Sound.play('heart')), narr('"Aldane, T. Sorrel, E." She has underlined neither. She has drawn a small careful box around both, the way one marks a sum that does not come out.'), fx(() => MSET('saw'))]);
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
    obj: () => "Chalk Seren's sun back on the Pillar (hold), unseen",
    mark: () => ({ x: 13.5 * 16, y: 8 * 16, lab: 'PILLAR' }),
    holds: t => t.id === 'pillarSun',
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
        fx(() => Sound.play('heart')),
        narr("He said he'd find out if it's yellow. He never said. So I do it yellow till somebody tells me different."),
        narr("Sull will scrub it off on rest day. He takes longer over it every year. Last time he left one ray.")], () => Mission.finish());
    }
  }
});

// ------------------------------------------------------------------ The night before the last day. Nobody to hide from.
MAPS.vcamp2 = buildMap({
  name: 'House Violet — the last night', w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(8,8,24,.62)',
  set: [[1, 7, 20, 1, ','], [12, 4, 1, 3, ','], [22, 2, 2, 11, '~'], [21, 7, 1, 1, ',']],
  props: [{ t: 'vtent', x: 3, y: 4, a: '#7a5ac8', block: blk(3, 4, 2) }, { t: 'vtent', x: 7, y: 4, a: '#7a5ac8', block: blk(7, 4, 2) }, { t: 'vtent', x: 16, y: 4, a: '#3aa8a0', block: blk(16, 4, 2) }, { t: 'vtent', x: 4, y: 11, a: '#7a5ac8', block: blk(4, 11, 2) }, { t: 'vtent', x: 16, y: 11, a: '#3aa8a0', block: blk(16, 11, 2) },
    { t: 'standard', x: 11, y: 3, a: '#7a5ac8', block: blk(11, 3) }, { t: 'standard', x: 13, y: 3, a: '#3aa8a0', block: blk(13, 3) }, { t: 'standard', x: 14, y: 3, a: '#c8782a', block: blk(14, 3) },
    { t: 'campfire', x: 12, y: 9, a: 1, block: blk(12, 9) }, { t: 'woodpile', x: 9, y: 10, block: blk(9, 10) }, { t: 'bedroll', x: 14, y: 10 }, { t: 'bedroll', x: 8, y: 8 }, { t: 'bedroll', x: 18, y: 9, a: '#3aa8a0' }, { t: 'stakes', x: 19, y: 4, a: 2 }, { t: 'stakes', x: 19, y: 11, a: 2 }],
  lights: [{ x: 200, y: 150, r: 80, c: '#ffb050' }, { x: 200, y: 50, r: 46, c: '#c8b0ff' }, { x: 350, y: 110, r: 44, c: '#a8c8ff' }],
  hot: [{ id: 'fire2', tiles: blk(12, 9) }, { id: 'stds', tiles: blk(11, 3).concat(blk(13, 3, 2)) }], exits: []
});
const EVE_N = () => ['petra', 'oswin', 'teal', 'lucan'].filter(k => MF('e_' + k)).length;
Object.assign(MISSIONS, {
  eve: {
    map: 'vcamp2', spawn: [2, 7, 3], toast: 'Tomorrow, the keep. Nobody is sleeping.', hint: 'Walk the camp · talk to whoever is awake',
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
          narr('Teo Aldane\'s bread. Half a heel, forty days old. He broke it on the lift and gave me the larger piece, and said: one ought to go up on something.'),
          narr('It is a stone. I eat it. All of it. It takes most of an hour, and it is the worst thing I have ever done slowly.'),
          narr('Tomorrow I take the keep, and they pin gold on me, and I go to work for the woman who burned my wife. That was always the plan. Tonight it is only a fire, and I am the one who knows how.'),
          narr('Hands, Kael. Everything is hands.')], () => Mission.finish()); }
    }
  }
});
