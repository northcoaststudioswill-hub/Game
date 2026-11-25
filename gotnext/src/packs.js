// GOT NEXT — animation packages. Instead of one dunk or one move, you wear a set and the game rotates through it by the
// situation, never the same one twice running. Six kinds: dunks, layups, dribble moves, post moves, idle dribbling, stance.
// A few show-stoppers stay as single "signature" dunks (data.js, sig: true); the one you equip joins your package's rotation.
const PACK_SLOTS = [['dunkpk', 'DUNK PACKAGES'], ['laypk', 'LAYUP PACKAGES'], ['dribpk', 'DRIBBLE PACKAGES'], ['postpk', 'POST PACKAGES'], ['swagpk', 'IDLE DRIBBLE PACKAGES'], ['stancepk', 'STANCE PACKAGES']];
const PACK_BASE = { dunkpk: 'dk_base', laypk: 'lp_base', dribpk: 'dr_base', postpk: 'po_base', swagpk: 'sw_base', stancepk: 'st_base' };
const FREE_DUNK_NEED = { cock: 68, hammer: 68 }, DUNK_NAMES = { onehand: 'one hand', lean: 'leaner', twohand: 'two hands', hangtwo: 'two hands and hang', cock: 'cocked back', hammer: 'hammer', tip: 'tip slam' };
const LAY_NAMES = { lay: 'layup', finger: 'finger roll', over: 'over the top', under: 'up and under', scoop: 'scoop', power: 'power', spin: '360', quick: 'wrong foot', hang: 'hang and adjust', switch: 'switch hands' };
const SWAG_NAMES = { rock: 'rock', tween: 'through the legs', yoyo: 'yo-yo', sizeup: 'size-up', behind: 'behind the back', wave: 'wave him up' };
const PACKS = [
  // ---- dunks: run = off a clear run, traffic = standing, hopped or with a shot-blocker there
  { id: 'dk_base', slot: 'dunkpk', n: 'Base Dunks', cost: 0, rank: 0, need: 0, attr: 'dunk', d: 'What everybody starts with.', run: ['onehand', 'lean', 'twohand', 'cock', 'hammer'], traffic: ['twohand', 'hangtwo'] },
  { id: 'dk_air', slot: 'dunkpk', n: 'Air Mail', cost: 2400, rank: 2, need: 70, attr: 'dunk', d: 'One hand, a long way from the floor.', run: ['tomahawk', 'windmill', 'cock', 'onehand'], traffic: ['tomahawk', 'hangtwo'] },
  { id: 'dk_power', slot: 'dunkpk', n: 'Rim Wreckers', cost: 3200, rank: 3, need: 76, attr: 'dunk', d: 'The rim files a complaint.', run: ['hammer', 'gavel', 'twohand', 'squat'], traffic: ['squat', 'hangtwo', 'hammer'] },
  { id: 'dk_show', slot: 'dunkpk', n: 'Showtime Reel', cost: 5500, rank: 4, need: 84, attr: 'dunk', d: 'Every one of them is for the camera.', run: ['cradle', 'clutch', 'scratch', 'windmill'], traffic: ['clutch', 'twohand'] },
  { id: 'dk_law', slot: 'dunkpk', n: 'Above The Law', cost: 9500, rank: 5, need: 90, attr: 'dunk', d: 'The whole catalogue, in rotation.', run: ['three60', 'scratch', 'cradle', 'windmill', 'tomahawk', 'gavel'], traffic: ['clutch', 'squat', 'tomahawk'] },
  // ---- layups: open = nobody there, cont = a man on you
  { id: 'lp_base', slot: 'laypk', n: 'Base Layups', cost: 0, rank: 0, need: 0, attr: 'layup', d: 'What everybody starts with.', open: ['lay', 'finger', 'over'], cont: ['under', 'over', 'scoop', 'power', 'spin', 'quick'] },
  { id: 'lp_bully', slot: 'laypk', n: 'Bully Ball', cost: 1600, rank: 1, need: 62, attr: 'layup', d: 'Through him, not round him.', open: ['lay', 'power'], cont: ['power', 'scoop', 'under', 'quick'] },
  { id: 'lp_craft', slot: 'laypk', n: 'Crafty', cost: 2200, rank: 2, need: 68, attr: 'layup', d: 'Hang in the air and change your mind.', open: ['finger', 'over', 'lay'], cont: ['hang', 'switch', 'under', 'scoop', 'quick'] },
  { id: 'lp_acro', slot: 'laypk', n: 'Acrobat', cost: 3400, rank: 3, need: 76, attr: 'layup', d: 'More spin than a campaign.', open: ['finger', 'spin', 'over'], cont: ['spin', 'switch', 'hang', 'under', 'over'] },
  // ---- dribble moves: a pool for each flick. The base package is the three moves you pick yourself, below
  { id: 'dr_base', slot: 'dribpk', n: 'Your Picks', cost: 0, rank: 0, need: 0, attr: 'handle', d: 'The side move, stepback and spin you equip one by one.' },
  { id: 'dr_shift', slot: 'dribpk', n: 'Shifty', cost: 2200, rank: 2, need: 66, attr: 'handle', d: 'Quick changes, nothing wasted.', side: ['tween', 'inout', 'cross'], back: ['hesi', 'stepback'], diag: ['spin'] },
  { id: 'dr_iso', slot: 'dribpk', n: 'Iso Tape', cost: 4200, rank: 3, need: 76, attr: 'handle', d: 'Clear out. This will take a moment.', side: ['killer', 'behind', 'tween'], back: ['snatch', 'hesi'], diag: ['halfspin', 'spin'] },
  { id: 'dr_street', slot: 'dribpk', n: 'Street Legend', cost: 7500, rank: 4, need: 86, attr: 'handle', d: 'The stuff people film.', side: ['shammgod', 'killer', 'behind', 'inout'], back: ['moonwalk', 'snatch', 'hesi'], diag: ['halfspin', 'spin'] },
  // ---- post
  { id: 'po_base', slot: 'postpk', n: 'Base Post', cost: 0, rank: 0, need: 0, attr: 'str', d: 'Drop step, hook, jump hook, fade, turnaround.', drop: ['power'] },
  { id: 'po_old', slot: 'postpk', n: 'Old School', cost: 1500, rank: 1, need: 0, attr: 'str', d: 'Adds the up-and-under off the drop step; hooks are bothered less.', drop: ['power', 'under'], hook: 0.82 },
  { id: 'po_bully', slot: 'postpk', n: 'Bully', cost: 2000, rank: 2, need: 62, attr: 'str', d: 'Backing down moves him further; the drop step finishes stronger.', drop: ['power'], push: 0.08, fin: 0.04 },
  { id: 'po_fin', slot: 'postpk', n: 'Finesse', cost: 2400, rank: 2, need: 0, attr: 'str', d: 'Adds a spin off the drop step; fades are bothered less.', drop: ['power', 'spin'], fade: 0.9 },
  // ---- idle dribbling (what the ball does while you size him up)
  { id: 'sw_base', slot: 'swagpk', n: 'Base Handle', cost: 0, rank: 0, need: 0, attr: 'handle', d: 'Rock it, size him up.', list: ['rock', 'sizeup', 'rock', 'tween'] },
  { id: 'sw_shake', slot: 'swagpk', n: 'Shake', cost: 900, rank: 1, need: 0, attr: 'handle', d: 'Through the legs and behind the back.', list: ['tween', 'behind', 'rock', 'tween', 'sizeup'] },
  { id: 'sw_yoyo', slot: 'swagpk', n: 'Yo-Yo', cost: 1200, rank: 1, need: 0, attr: 'handle', d: 'The ball on a string, and a wave to bring him closer.', list: ['yoyo', 'wave', 'sizeup', 'yoyo', 'rock'] },
  { id: 'sw_all', slot: 'swagpk', n: 'The Whole Bag', cost: 2800, rank: 3, need: 0, attr: 'handle', d: 'All of it.', list: ['rock', 'tween', 'yoyo', 'sizeup', 'behind', 'wave'] },
  // ---- stance: how you stand, walk and run. Looks only. Five of these are the personas from ON TWO, our football game
  { id: 'st_base', slot: 'stancepk', n: 'Natural', cost: 0, rank: 0, need: 0, d: 'How your build stands by itself.' },
  { id: 'st_ice', slot: 'stancepk', n: 'Ice', cost: 600, rank: 0, need: 0, d: 'Nothing moves that does not have to.', run: 'glide', anim: { idle: { relaxed: 1, athletic: 0, wide: 0 }, cadence: 0.7, intensity: 0.8, restless: 0.05, swag: 0.15, stance: 0.9, lean: -0.2, arms: -0.3 } },
  { id: 'st_show', slot: 'stancepk', n: 'Showtime', cost: 600, rank: 0, need: 0, d: 'Knows where the camera is.', run: 'highstep', anim: { idle: { relaxed: 0.3, athletic: 0, wide: 0.7 }, cadence: 1.2, intensity: 1.3, restless: 0.7, swag: 1, stance: 1.35, lean: -0.1, arms: 0.6 } },
  { id: 'st_dog', slot: 'stancepk', n: 'Dog', cost: 600, rank: 0, need: 0, d: 'Leaning forward since birth.', run: 'low', anim: { idle: { relaxed: 0, athletic: 1, wide: 0 }, cadence: 1.1, intensity: 1.35, restless: 0.5, swag: 0.35, stance: 1.15, lean: 0.6, arms: 0.2, defLow: 0.5 } },
  { id: 'st_prof', slot: 'stancepk', n: 'Professor', cost: 600, rank: 0, need: 0, d: 'Already knows the coverage. Is a little bored.', run: 'upright', anim: { idle: { relaxed: 0.8, athletic: 0.2, wide: 0 }, cadence: 0.85, intensity: 0.9, restless: 0.2, swag: 0.05, stance: 1.0, lean: -0.35, arms: -0.5 } },
  { id: 'st_wire', slot: 'stancepk', n: 'Live Wire', cost: 600, rank: 0, need: 0, d: 'Cannot stand still. Should not be asked to.', run: 'shifty', anim: { idle: { relaxed: 0, athletic: 0.7, wide: 0.3 }, cadence: 1.5, intensity: 1.25, restless: 1, swag: 0.5, stance: 1.1, lean: 0.2, arms: 0.4 } },
  { id: 'st_big', slot: 'stancepk', n: 'Big Fella', cost: 600, rank: 0, need: 0, d: 'Wide base, heavy feet, owns the space he stands in.', run: 'heavy', anim: { idle: { relaxed: 0.2, athletic: 0, wide: 0.8 }, cadence: 0.8, intensity: 1.0, restless: 0.15, swag: 0.4, stance: 1.4, lean: 0, arms: 0.5 } },
];
const PACK = {}; PACKS.forEach(p => PACK[p.id] = p);
function pk(p, slot) { const m = p && p.b && p.b.moves; return PACK[m && m[slot]] || PACK[PACK_BASE[slot]]; }
function dunkNeed(id) { return DUNK[id] ? DUNK[id].need : FREE_DUNK_NEED[id] || 0; }
// the dribble move for this flick out of the player's package (null = use the single move he equipped)
function packMove(p, slot) { if (p.noPack) return null; const P = pk(p, 'dribpk'), L0 = P[slot]; if (!L0) return null; const h = att(p, 'handle'), L = L0.filter(id => MOVE[id] && MOVE[id].need <= h); if (!L.length) return null; return MOVE[L[poolNext(p, 'dr' + slot + L.length, L.length)]]; }
// everybody else gets packages too, the same ones every time for the same name
function aiPacks(b) {
  let h = 11; for (const c of String(b.name || 'x')) h = (h * 33 + c.charCodeAt(0)) >>> 0; const nx = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; }, o = {};
  for (const [slot] of PACK_SLOTS) { if (slot === 'stancepk') continue; const L = PACKS.filter(q => q.slot === slot); o[slot] = L[Math.floor(nx() * L.length)].id; } return o;
}
function packOwned(id) { return !!PACK[id] && (!PACK[id].cost || S.moves.owned.includes(id)); }
function packContents(P) {
  const nm = (m, l) => l.map(k => m[k] || (DUNK[k] && DUNK[k].n) || (MOVE[k] && MOVE[k].n) || k).filter((v, i, a) => a.indexOf(v) === i).join(' · ');
  if (P.slot === 'dunkpk') return `<b>Off the run:</b> ${nm(DUNK_NAMES, P.run)}<br><b>In traffic:</b> ${nm(DUNK_NAMES, P.traffic)}`;
  if (P.slot === 'laypk') return `<b>Alone:</b> ${nm(LAY_NAMES, P.open)}<br><b>With a man on you:</b> ${nm(LAY_NAMES, P.cont)}`;
  if (P.slot === 'dribpk') return P.side ? `<b>← →</b> ${nm({}, P.side)}<br><b>↙ ↘</b> ${nm({}, P.back)}<br><b>↖ ↗</b> ${nm({}, P.diag)}` : '';
  if (P.slot === 'swagpk') return nm(SWAG_NAMES, P.list); return '';
}
function packEquip(P) {
  S.moves[P.slot] = P.id;
  if (P.slot === 'stancepk') {      // a stance rewrites the look of your movement profile; the shot and anything else you set stays
    const A = S.anim || (S.anim = JSON.parse(JSON.stringify(animProfile({ mine: true, name: S.name, build: S.build }))));
    if (P.anim) { for (const k in P.anim) A[k] = typeof P.anim[k] === 'object' ? Object.assign({}, P.anim[k]) : P.anim[k]; A.run = P.run || ''; }
    else { const D = profileFromBuild({ mine: true, name: S.name, build: S.build }); for (const k of ['idle', 'cadence', 'intensity', 'restless', 'swag', 'stance', 'lean', 'arms', 'defLow']) A[k] = typeof D[k] === 'object' ? Object.assign({}, D[k]) : D[k]; A.run = ''; }
  }
  save(); if (typeof W !== 'undefined' && W && W.me) worldPlayerRig();
}
function packsUI(r) {
  let h = '';
  for (const [slot, title] of PACK_SLOTS) {
    h += `<div class="cat">${title}</div><div class="grid">`;
    for (const P of PACKS.filter(q => q.slot === slot)) {
      const own = packOwned(P.id), eq = (S.moves[slot] || PACK_BASE[slot]) === P.id, price = shopPrice(P.cost), lockR = P.rank > r, lockA = P.need && P.attr && P.need > S.attrs[P.attr];
      h += `<div class="card ${eq ? 'sel' : ''} ${!own && (lockR || lockA) ? 'lock' : ''}"><h3>${P.n}</h3><p>${P.d}</p><p class="mu" style="margin-top:4px">${packContents(P)}</p><div style="margin-top:5px">` +
        (eq ? `<span class="tag on">EQUIPPED</span>` : own ? Btn('EQUIP', () => { packEquip(P); sfx('uiok'); rerender(); }, 'sm') :
          lockR ? `<span class="tag or">RANK: ${RANKS[P.rank].n}</span>` : lockA ? `<span class="tag or">NEEDS ${ATTR[P.attr].n} ${P.need}</span>` :
            Btn('BUY · ' + price + ' HC', () => { S.vc -= price; S.moves.owned.push(P.id); packEquip(P); sfx('buy'); toast('NEW PACKAGE', P.n); uiHud(); rerender(); }, 'sm', S.vc < price)) + `</div></div>`;
    }
    h += `</div>`;
  }
  return h;
}
