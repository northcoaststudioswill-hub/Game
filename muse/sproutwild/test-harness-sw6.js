// Sproutwild v2.2: Lantern Shop, locked plans, sawmill, statue hearts,
// starter evolution, the Champion trial, and the battle tutorial.
// Usage: node test-harness-sw6.js <htmlPath>
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
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const state = () => SWF.state();
const WMOVES = SWF.moves();
function driveBattle(maxSteps) {
  let n = 0;
  while (state() === 'g4battle' && n++ < maxSteps) {
    const bt = SWF.bt(); if (!bt) break;
    if (bt.phase === 'menu') { let g2 = 0; while (SWF.sel() !== 0 && g2++ < 8) tap('down'); tap('a'); }
    else if (bt.phase === 'moves') {
      const me = SW.party[bt.aiIx];
      let best = 0, bp = -1;
      me.moves.forEach((mid, i) => { const mv = WMOVES[mid]; if (mv && mv.p > bp) { bp = mv.p; best = i; } });
      let g2 = 0; while (SWF.sel() !== best && g2++ < 10) tap('right'); /* grid nav */
      tap('a');
    } else if (bt.phase === 'party') {
      let ix = SW.party.findIndex(m => m.hp > 0 && SW.party.indexOf(m) !== bt.aiIx);
      if (ix < 0) ix = SW.party.findIndex(m => m.hp > 0);
      if (ix < 0) tap('b'); else { let g2 = 0; while (SWF.sel() !== ix && g2++ < 8) tap('down'); tap('a'); }
    } else tap('a');
    frames(2);
  }
}

/* boot */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 7 && state() !== 'g4world'; i++) { tap('a'); frames(1); } /* title + story beats -> world */
SWF.giveMon('CINDERCAP', 5, false); /* starter seeded — the walk-up choice is covered in sw4 */
SW.quest = 5;
check('Field Guide now holds 15 species', SWF.species().length === 15);

/* tutorial lines ride the first wild battle only */
SWF.forceWild('PEBBLIT', 2); frames(6); /* read the log before it drains */
check('first battle teaches the bud toss', SWF.bt() && SWF.bt().log.some(l => l.txt.includes('toss a sprout')));
tap('down'); tap('down'); tap('a'); frames(30); /* RUN (idx 4) via grid nav: 0 -> 2 -> 4 */
if (state() === 'g4battle') driveBattle(300);
SWF.forceWild('PEBBLIT', 2); frames(6);
check('tutorial does not repeat', SWF.bt() && !SWF.bt().log.some(l => l.txt.includes('Sun Orb')));
driveBattle(300);

/* locked plans refuse in the build menu */
SWF.give('wood', 40); SWF.give('stone', 30); SWF.give('ingot', 6);
tap('start'); frames(1); tap('down'); tap('down'); tap('a'); frames(1); /* BUILD is pause row 2 */
check('build menu opens', state() === 'g4build');
for (let i = 0; i < 7; i++) tap('down'); /* v3.0: NURSERY row inserted at index 2 */
tap('a'); frames(1);
check('sawmill is locked before the Lantern sells plans', state() === 'g4build' && !SW.buildings.some(b => b.k === 'sawmill'));
tap('b'); frames(1);

/* the Lantern Shop */
SW.hearts = 40;
SWF.setPos(240, 74); hold('up', 2); frames(1);
tap('a'); frames(2);
check('lantern opens the shop menu', state() === 'g4lamp');
tap('down'); tap('a'); frames(1); /* SAWMILL PLANS (row 1; board is row 0) */
check('sawmill plans bought for 15 hearts', SW.unlocked.sawmill === 1 && SW.hearts === 25 && state() === 'g4lamp');
tap('down'); tap('a'); frames(1); /* rows reset: STATUE is row 1 now */
check('statue plans bought for 25 hearts', SW.unlocked.statue === 1 && SW.hearts === 0);
tap('b'); frames(1);

/* sawmill builds and mills wood */
tap('start'); frames(1); tap('down'); tap('down'); tap('a'); frames(1); /* BUILD is pause row 2 */
for (let i = 0; i < 7; i++) tap('down'); /* v3.0: NURSERY row inserted at index 2 */
tap('a'); frames(1);
check('unlocked sawmill enters placement', state() === 'g4place');
tap('a'); frames(2);
check('sawmill stands', SW.buildings.some(b => b.k === 'sawmill') && state() === 'g4world');
SWF.giveMon('FERNFANG', 8, true);
const millIx = SW.buildings.findIndex(b => b.k === 'sawmill');
SWF.assignFirst(millIx);
const wood0 = SW.res.wood;
SWF.tick(1); frames(2);
check('sawmill worker mills wood', SW.res.wood > wood0);

/* statue: hearts fall at 0.6 luck with it, not without it */
SWF.build('bed', 2, 2); SWF.build('statue', 7, 3);
SWF.giveMon('FERNFANG', 8, true);
SWF.assignFirst(SW.buildings.findIndex(b => b.k === 'bed'));
const realRandom = Math.random;
Math.random = () => 0.6;
SWF.tick(1); frames(2);
check('statue lifts the heart drop rate', SWF.groundHearts().length >= 1);
SW.buildings = SW.buildings.filter(b => b.k !== 'statue');
SWF.groundHearts().length = 0;
SWF.tick(1); frames(2);
check('without the statue, 0.6 luck drops no heart', SWF.groundHearts().length === 0);
Math.random = realRandom;

/* evolution at 16 */
SW.party.length = 0;
SWF.giveMon('CINDERCAP', 15, false);
SW.party[0].xp = 100000;
SWF.forceWild('PEBBLIT', 2); frames(90);
driveBattle(400);
check('CINDERCAP evolved into EMBERCAP', SW.party[0].sp === 'EMBERCAP');
check('evolved partner knows MAGMA BURST', SW.party[0].moves.includes('magmaburst'));
check('evolution filed in the Field Guide', SW.caught.EMBERCAP === 1);

/* the Champion trial at the Peak */
SW.party.length = 0;
SWF.giveMon('BOULDERHOUND', 40, false); SWF.giveMon('VOLTHARE', 40, false); SWF.giveMon('TIDEBUD', 40, false); /* capability run w/ type coverage — balance lives in sw5 */
SW.badges.push('VERDANT SIGIL', 'EMBER SIGIL', 'TIDE SIGIL', 'VOLT SIGIL');
SW.gymDone[3] = 1;
SWF.enter('PEAK'); frames(2);
SWF.setPos(240, 92); hold('up', 2); frames(1);
check('at the Peak gym', SWF.near() && SWF.near().k === 'gym');
tap('a'); frames(2);
let g2 = 0;
while ((state() === 'g4gym' || state() === 'g4confirm' || state() === 'g4engage') && g2++ < 40) { tap('a'); frames(2); } frames(40);
check('the First Keeper leads with AURICORN', state() === 'g4battle' && SWF.bt() && SWF.bt().foe.sp === 'AURICORN');
driveBattle(1500);
check('champion crowned, sigils untouched', state() === 'g4world' && SW.champion === 1 && SW.badges.length === 4);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW6_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V22_OK');
