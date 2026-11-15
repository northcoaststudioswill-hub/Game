// Sproutwild soak + balance: a long chaotic play session (error hunt)
// and Monte Carlo gym pacing with fair parties.
// Usage: node test-harness-sw5.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() {
  const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage sprite'); } };
  return new Proxy(t, { get(o, k) { if (k in o) return o[k]; return () => undefined; }, set(o, k, v) { o[k] = v; return true; } });
}
function el(id) {
  const classes = new Set();
  return { id, hidden: false, textContent: '', clientWidth: 120, clientHeight: 60,
    style: { setProperty() {} },
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), toggle: (c, f) => { f ? classes.add(c) : classes.delete(c); }, contains: c => classes.has(c) },
    addEventListener() {}, setPointerCapture() {},
    getBoundingClientRect: () => ({ top: 100, left: 50, width: 100, height: 120, bottom: 220, right: 150 }),
    getContext: () => ctxStub(), parentNode: { clientWidth: 360, clientHeight: 300 },
    querySelectorAll: () => carts };
}
const byId = {}; const carts = [0, 1, 2].map(i => el('cart' + i));
global.window = global;
global.document = { getElementById: id => byId[id] || (byId[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
byId['shelf'] = el('shelf');
const store = {};
global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.Image = class { constructor() { this.complete = false; } };
let rafCb = null;
global.requestAnimationFrame = cb => { rafCb = cb; };
global.addEventListener = () => {};
for (const s of scripts) eval(s);
const G = global.window.__g;
const SWF = G.SWF(), SW = G.SW();
let t = 0;
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) throw new Error('rAF chain broke'); } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
const state = () => SWF.state();
const WMOVES = SWF.moves();

function battleDriver(maxFrames) {
  let n = 0;
  while (state() === 'g4battle' && n < maxFrames) {
    const bt = SWF.bt(); if (!bt) break;
    if (bt.phase === 'menu') { let guard2 = 0;
      while (SWF.sel() !== 0 && guard2++ < 8) tap('down');
      tap('a'); }
    else if (bt.phase === 'moves') {
      const me = SW.party[bt.aiIx];
      let best = 0, bp = -1;
      me.moves.forEach((mid, i) => { const mv = WMOVES[mid]; if (mv && mv.p > bp) { bp = mv.p; best = i; } });
      for (let d = 0; d < best; d++) tap('right'); /* grid nav: right = +1 */
      tap('a');
    } else if (bt.phase === 'party') {
      let ix = SW.party.findIndex(m => m.hp > 0 && SW.party.indexOf(m) !== bt.aiIx);
      if (ix < 0) ix = SW.party.findIndex(m => m.hp > 0);
      if (ix < 0) { tap('b'); }
      else { let guard2 = 0; while (SWF.sel() !== ix && guard2++ < 8) tap('down'); tap('a'); }
    } else tap('a');
    frames(2); n += 3;
  }
  return state() !== 'g4battle';
}

/* ---------------- SOAK ---------------- */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 7 && state() !== 'g4world'; i++) { tap('a'); frames(1); } /* title + story beats -> world */
SWF.giveMon('CINDERCAP', 12, false); /* trained starter for the soak */
SW.quest = 5;
SWF.give('wood', 60); SWF.give('stone', 40); SWF.give('petal', 200); SWF.orbs(10);
SWF.build('cottage', 4, 1); SWF.build('bed', 6, 2); SWF.build('kiln', 3, 3); SWF.build('pen', 8, 1);
SWF.giveMon('FERNFANG', 8, true); SWF.giveMon('MAGMOSS', 9, true);
SWF.assignFirst(1); SWF.assignFirst(2);
SW.badges.push('VERDANT SIGIL', 'EMBER SIGIL'); /* unlock shore/hollow for wandering */
let rng = 12345;
const rnd = () => (rng = (rng * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const sectors = ['BASE', 'MEADOW', 'WASTES', 'SHORE'];
const seenStates = {};
let battleStuck = 0;
for (let round = 0; round < 40; round++) {
  SWF.enter(sectors[round % sectors.length]); frames(2);
  for (let step = 0; step < 300; step++) {
    const dir = ['left', 'right', 'up', 'down'][(rnd() * 4) | 0];
    G.keys[dir] = 1; frames(6); G.keys[dir] = 0;
    if (rnd() < 0.3) tap('a');
    if (rnd() < 0.08) tap('start');
    if (state() !== 'g4world' && state() !== 'g4battle') { tap('b'); frames(1); tap('b'); frames(1); }
    if (state() === 'g4battle') { if (!battleDriver(900)) battleStuck++; }
    seenStates[state()] = (seenStates[state()] || 0) + 1;
    if (errors.length) break;
  }
  if (errors.length) break;
}
console.log('SOAK states visited:', JSON.stringify(seenStates));
console.log('SOAK battles stuck:', battleStuck, 'errors:', errors.length, errors.slice(0, 2));

/* ---------------- GYM BALANCE ---------------- */
function simGym(gi, partySpec, sims) {
  let wins = 0;
  for (let s = 0; s < sims; s++) {
    SW.party.length = 0; SW.box.length = SW.box.length; /* keep box */
    for (const [sp, lv] of partySpec) SWF.giveMon(sp, lv, false);
    SWF.gym(gi, SW.gymDone[gi] ? true : false);
    frames(2);
    const badgesBefore = SW.badges.length;
    battleDriver(3000);
    if (SW.badges.length > badgesBefore || SW.gymDone[gi]) wins++;
    /* reset for next sim: clear done flag if this sim set it, restore party hp via fresh mons next loop */
    if (!SW.gymDone[gi]) { /* lost: nothing to reset */ }
  }
  return wins;
}
const plans = [
  [0, [['CINDERCAP', 8], ['PEBBLIT', 7], ['DRIZZLET', 7]]],
  [1, [['DRIZZLET', 12], ['TIDEBUD', 12], ['BOULDERHOUND', 11]]],
  [2, [['VOLTHARE', 16], ['FERNFANG', 16], ['ZIPWIG', 15]]],
  [3, [['BOULDERHOUND', 21], ['MAGMOSS', 21], ['VOLTHARE', 20]]],
  [4, [['BOULDERHOUND', 30], ['VOLTHARE', 30], ['MAGMOSS', 30]]], /* the Champion */
];
for (const [gi, spec] of plans) {
  SW.gymDone = {};
  const wins = simGym(gi, spec, 8);
  console.log('GYM' + gi + ' fair-party win rate: ' + wins + '/8');
  SW.gymDone = {};
  const dog = spec.slice(0, 2).map(([sp, lv]) => [sp, lv - 2]);
  const dwins = simGym(gi, dog, 8);
  console.log('GYM' + gi + ' underdog (2 partners, -2 lv) win rate: ' + dwins + '/8');
}
console.log('total errors:', errors.length, errors.slice(0, 2));
console.log(errors.length || battleStuck ? 'SW5_ISSUES' : 'SPROUTWILD_SOAK_OK');
