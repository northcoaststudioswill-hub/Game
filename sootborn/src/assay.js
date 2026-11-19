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
  hot: [{ id: 'fire', tiles: blk(12, 9) }, { id: 'wood', tiles: blk(20, 5) }, { id: 'pump', tiles: blk(2, 11, 2) }, { id: 'vstd', tiles: blk(12, 3) }], exits: []
});
MAPS.raid = buildMap({
  name: 'House Teal — the island', w: 30, h: 15, theme: 'valley', music: 'mystery', dark: 'rgba(4,6,18,.76)',
  set: [[6, 2, 2, 12, '~'], [6, 7, 2, 2, ','], [1, 7, 5, 1, ','], [8, 7, 19, 1, ','], [14, 5, 1, 2, ','], [12, 10, 1, 1, '#'], [17, 5, 1, 1, '#'], [21, 6, 1, 1, '#'], [15, 12, 1, 1, '#'], [24, 11, 1, 1, '#'], [10, 4, 1, 1, '#'], [18, 10, 1, 1, '#'], [25, 4, 1, 1, '#']],
  props: [{ t: 'pumphouse', x: 13, y: 4, block: blk(13, 4, 2) }, { t: 'vtent', x: 10, y: 11, a: '#3aa8a0', block: blk(10, 11, 2) }, { t: 'vtent', x: 19, y: 3, a: '#3aa8a0', block: blk(19, 3, 2) }, { t: 'vtent', x: 20, y: 11, a: '#3aa8a0', block: blk(20, 11, 2) },
    { t: 'teallamp', x: 10, y: 6, block: blk(10, 6) }, { t: 'teallamp', x: 17, y: 9, block: blk(17, 9) }, { t: 'teallamp', x: 23, y: 9, block: blk(23, 9) }, { t: 'teallamp', x: 24, y: 5, block: blk(24, 5) },
    { t: 'standard', x: 27, y: 7, a: '#3aa8a0', block: blk(27, 7) }, { t: 'bedroll', x: 21, y: 9, a: '#3aa8a0' }, { t: 'bedroll', x: 19, y: 12, a: '#3aa8a0' }, { t: 'stakes', x: 26, y: 4, a: 2 }, { t: 'stakes', x: 26, y: 11, a: 2 }],
  lights: [{ x: 168, y: 96, r: 54, c: '#ffe090' }, { x: 280, y: 146, r: 54, c: '#ffe090' }, { x: 376, y: 144, r: 54, c: '#ffe090' }, { x: 392, y: 80, r: 54, c: '#ffe090' }, { x: 224, y: 60, r: 30, c: '#8ad8b0' }],
  hot: [{ id: 'valve', tiles: blk(13, 4, 2) }, { id: 'std', tiles: blk(27, 7) }], exits: []
});
MAPS.dais = buildMap({
  name: "The Proctors' dais", w: 26, h: 14, theme: 'valley', music: 'mystery', dark: 'rgba(6,6,20,.7)',
  set: [[8, 3, 12, 8, '='], [1, 8, 7, 1, ','], [4, 5, 1, 1, '#'], [5, 11, 1, 1, '#'], [22, 4, 1, 1, '#'], [22, 10, 1, 1, '#']],
  props: [{ t: 'canopy', x: 11, y: 4, a: 6 }, { t: 'lectern', x: 10, y: 4, a: 1, block: blk(10, 4) }, { t: 'lectern', x: 14, y: 4, a: 2, block: blk(14, 4) }, { t: 'lectern', x: 18, y: 4, a: 3, block: blk(18, 4) },
    { t: 'crate', x: 11, y: 7, block: blk(11, 7) }, { t: 'barrel', x: 16, y: 7, block: blk(16, 7) }, { t: 'crate', x: 13, y: 9, block: blk(13, 9) }, { t: 'barrel', x: 18, y: 9, block: blk(18, 9) }, { t: 'crate', x: 8, y: 6, block: blk(8, 6) },
    { t: 'teallamp', x: 8, y: 3, block: blk(8, 3) }, { t: 'teallamp', x: 19, y: 3, block: blk(19, 3) }, { t: 'standard', x: 21, y: 7, a: '#e8c25a', block: blk(21, 7) }],
  lights: [{ x: 136, y: 50, r: 50, c: '#ffe090' }, { x: 312, y: 50, r: 50, c: '#ffe090' }, { x: 232, y: 70, r: 40, c: '#4ad8e0' }],
  hot: [{ id: 'book', tiles: blk(10, 4) }, { id: 'glass', tiles: blk(14, 4) }, { id: 'roster', tiles: blk(18, 4) }], exits: []
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
      if (t.id === 'vstd') return Dialogue.start([narr('House Violet\'s standard. A pole, a square of cloth, a gold boss. Lose it and the House is struck from the Assay. They guard it better than they feed themselves.')]);
      if (t.id === 'wood') return Dialogue.start(MF('wood') ? [narr('Enough for tonight.')] : [narr('Somebody cut this before the Assay began and stacked it where the cadets would find it. They walked past it for three days. Nobody had told them wood was for anything.'), narr('I take an armful. It smells like nothing in Cinderwell. It smells like the inside of the leaf.'), fx(() => { MSET('wood'); Sound.play('coin'); })]);
      if (t.id === 'pump') { if (MF('pump')) return Dialogue.start([narr('It is drawing. Warm, and it will stay warm.')]);
        return Dialogue.start([narr('A pump house. Dressed stone, a wheel, a gauge. It is the only thing in this valley built like home.'), narr('My hand is flat on the pipe before I think about it.'), fx(() => Puzzle.open([CAMP_PUZZLE], () => { MSET('pump'); G.mode = 'world'; Sound.music('mystery'); Dialogue.start([
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
    G.heist = 3; G.flags.heistEase = 0; G.flags.mCaught = 0; UI.clear(); P.sheet = World.sheetFor('kael2'); World.showPlayer = true; World.darkOverride = null;
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
  caught(n) { const k = G.flags.mCaught = (G.flags.mCaught || 0) + 1; if (k >= 2) G.flags.heistEase = 1; Dialogue.start(this.def.caught ? this.def.caught(k) : [narr('Seen.')]); },
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
