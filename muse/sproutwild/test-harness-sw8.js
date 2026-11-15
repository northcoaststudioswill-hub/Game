// Sproutwild v3.0: build-anywhere, Lantern Town, nursery growing, worker skill XP, cinematic skip.
// Usage: node test-harness-sw8.js <htmlPath>
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

/* boot: title -> cinematic (B skips it) -> base */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(2); tap('a'); frames(3); /* boot cine -> title -> intro */
check('opening cinematic plays', state() === 'g4intro');
tap('a'); frames(2);
check('cinematic pages forward', state() === 'g4intro');
tap('b'); frames(2);
check('B skips the cinematic straight into the world (v4.1: no lesson)', state() === 'g4world');
SWF.giveMon('CINDERCAP', 12, false);
SW.quest = 5; /* post-intro systems suite */
SWF.give('wood', 60); SWF.give('stone', 30); SWF.give('berry', 12);

/* the sign corner is decluttered: Louie and the player spawn apart */
const lou = SWF.louie(), pp = SWF.pos();
check('Louie spawns clear of the MAP sign', Math.hypot(lou.x - 240, lou.y - 498) > 30);
check('player spawns clear of Louie', Math.hypot(pp.x - lou.x, pp.y - lou.y) > 30);

/* build pretty much anywhere — but not on the Lantern */
tap('start'); frames(1); tap('down'); tap('down'); tap('a'); frames(1);
check('pause -> build list', state() === 'g4build');
tap('a'); frames(1);
check('cottage -> placement', state() === 'g4place');
tap('up'); for (let i = 0; i < 6; i++) tap('right'); frames(1); /* cursor (5,2) -> (11,1): the Lantern cell */
tap('a'); frames(1);
check('the Lantern cell refuses building', state() === 'g4place' && !SW.buildings.some(b => b.k === 'cottage'));
for (let i = 0; i < 9; i++) tap('right');
for (let i = 0; i < 19; i++) tap('down');
frames(1);
tap('a'); frames(2);
check('a far corner of the base accepts building', state() === 'g4world' && SW.buildings.some(b => b.k === 'cottage' && b.gx === 20 && b.gy === 20));
tap('b'); frames(1);

/* Lantern Town: townsfolk + gym 1; the Meadow is just the road now */
SWF.enter('TOWN'); frames(2);
const tn = SWF.npcs().map(n => n.who);
check('town has townsfolk (Pip + the Elder)', tn.includes('PIP') && tn.includes('ELDER'));
SWF.setPos(240, 92); hold('up', 2); frames(1);
check('gym 1 stands in town', SWF.near() && SWF.near().k === 'gym');
SWF.enter('MEADOW'); frames(2);
SWF.setPos(240, 92); hold('up', 2); frames(1);
check('no gym on the Meadow road anymore', !(SWF.near() && SWF.near().k === 'gym'));

/* the Sprout Nursery: plant -> tend -> harvest a partner */
SWF.enter('BASE'); frames(2);
const nur = SWF.build('nursery', 8, 8);
SWF.setPos(180, 234); hold('up', 6); frames(1);
check('nursery offers its menu', SWF.near() && SWF.near().k === 'bld');
tap('a'); frames(2);
check('nursery menu opens', state() === 'g4nur');
const berry0 = SW.res.berry;
tap('a'); frames(2); /* PLANT EMBER */
check('planted an EMBER sprout for 3 berries', !!nur.crop && nur.crop.sp === 'CINDERCAP' && nur.crop.stage === 1 && SW.res.berry === berry0 - 3);
tap('b'); frames(1);
nur.crop.t = 49.9; frames(40);
check('the sprout grew to stage 3', nur.crop.stage === 3);
SWF.setPos(180, 234); hold('up', 6); frames(1);
tap('a'); frames(2);
check('nursery menu reopens', state() === 'g4nur');
tap('down'); frames(1); /* HARVEST */
tap('a'); frames(2);
check('harvested a homegrown CINDERCAP', !nur.crop && (SW.party.some(m => m.sp === 'CINDERCAP' && m.lv === 1) || SW.box.some(m => m.sp === 'CINDERCAP')));
tap('b'); frames(1);

/* sprouts level their skill by working: bed crew gains work XP, yield grows (v3.9) */
const bed = SWF.build('bed', 10, 8);
const bedIx = SW.buildings.indexOf(bed);
check('assigned a sprout worker to the bed', SWF.assignFirst(bedIx) === true);
const worker = SWF.crew().find(c => c.job === bedIx);
check('the worker is a sprout, not a buddy', !!worker && typeof worker.type === 'number');
const berryBefore = SW.res.berry;
SWF.tick(3);
check('sprout gained work XP from ticks', (worker.wxp || 0) === 3);
check('affinity sprout yields steadily (2+2+2 berries)', SW.res.berry - berryBefore === 6);
worker.wxp = 12; const berry2 = SW.res.berry; SWF.tick(1);
check('skilled sprout yields more (4 berries)', SW.res.berry - berry2 === 4);

frames(30);
console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW8_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V30_OK');
