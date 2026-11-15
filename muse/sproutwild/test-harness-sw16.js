// Sproutwild v3.7: the game explains itself — welcome lesson after the
// cinematic, the patch lesson on first touch, and the KEEPER'S GUIDE.
// Usage: node test-harness-sw15.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() {
  const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage got a sprite object'); } };
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
if (!G || !G.SWF) { console.log('FAIL no SW hooks'); process.exit(1); }
const SWF = G.SWF(), SW = G.SW();
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const state = () => SWF.state();

/* boot the console, pick the cartridge, ride the cinematic + welcome lesson */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 10 && state() !== 'g4intro' && state() !== 'g4lesson' && state() !== 'g4world'; i++) { tap('a'); frames(1); }
for (let i = 0; i < 8 && state() === 'g4intro'; i++) { tap('a'); frames(2); }
tap('b'); frames(1);
check('booted into the world, crew empty', state() === 'g4world' && SW.crew.length === 0);

/* Louie -> quest 1 (tend the patch) */
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
check('quest 1: tend the patch', SW.quest === 1);

/* walk to the patch: water the seeds, watch them grow, pluck two yourself */
SWF.setPos(240, 344); frames(2); tap('a'); frames(2);
check('watering starts the growing in the world (no lesson)', state() === 'g4world' && SWF.tendState().stage === 1);
for (let i = 0; i < 4200 && SWF.tendState().stage < 3; i++) frames(1);
check('carrying grew them to grown', SWF.tendState().stage === 3 && SW.tended >= 3); /* v4.4: growth is by AGE */
check('NO crew is given for free (v4.0: sprouts are earned)', SW.crew.length === 0);
function pluckGrown() { for (let ri = 0; ri < 40; ri++) { const gb = (SWF.tendBuds() || []).find(b => b.st === 'grown');
  if (gb) { SWF.setPos(gb.x, gb.y + 14); hold('up', 3); frames(1); if (SWF.near() && SWF.near().k === 'tendpluck') { tap('a'); frames(2); return true; } }
  frames(15); } return false; }
pluckGrown();
pluckGrown();
check('two hand-plucked sprouts finish the teaching', SW.tendDone === true && SWF.tendState().plucked === 2);

/* only the sprout you did NOT pluck stays at the patch, one delivery in */
SWF.enter('BASE'); frames(2);
const pbs = SWF.patch();
check('patch sprouts exist', Array.isArray(pbs) && pbs.length >= 3);
check('the un-plucked sprout seeds the patch (LEAF, dlv 1)',
  pbs[0] && pbs[0].type === 4 && pbs[0].dlv === 1);
const pb = pbs[0];
pb.dlv = 2; pb.mode = 'carry'; pb.item = true; pb.x = 240; pb.y = 108;
frames(4);
check('third delivery grew the sprout into the crew', SW.crew.length === 1 && SW.crew[0].type === 4);
check('and it STAYS at the patch — nobody vanishes into a list (v4.3)', pb.crew === true && pb.type === 4 && SW.crew[0].atPatch === true);
frames(70);
check('it keeps living at its spot as crew', pb.type === 4 && pb.mode !== 'join');

/* buddies do NOT work anymore; sprouts do */
const bed = SWF.build('bed', 8, 8); const bedIx = SW.buildings.indexOf(bed);
SWF.giveMon('FERNFANG', 5, true);
bed.workers = [SW.box[0].uid]; /* stale buddy assignment, as an old save might hold */
const berry0 = SW.res.berry; SWF.tick(2);
check('a buddy on a building produces NOTHING now', SW.res.berry === berry0);
bed.workers = [];
SWF.addCrew(4); /* a free LEAF sprout: the bed's affinity */
check('assignFirst deploys a crew sprout', SWF.assignFirst(bedIx) === true);
check('deploying it is what empties its patch spot (v4.3)', pb.type === -1);
SWF.tick(1);
check('the sprout crew produces', SW.res.berry === berry0 + 2);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW16_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V39_OK');
