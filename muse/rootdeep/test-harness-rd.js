// Headless playtest for Rootdeep (cartridge 2) + Sprouts regression.
// Usage: node test-harness-rd.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 2) { console.log('FAIL script blocks', scripts.length); process.exit(1); }
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() {
  const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage got a sprite object (use .ol)'); } };
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
if (!G || !G.RDF) { console.log('FAIL no RD hooks'); process.exit(1); }
const RDF = G.RDF(), RD = G.RD();
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const st = () => RDF.state();
const state = () => st().state;

/* ---- boot cartridge 2 ---- */
frames(3);
tap('right'); tap('a'); frames(2);
check('cart inserted -> boot', state() === 'boot');
frames(50); tap('a'); frames(3);
check('boot -> g3title', state() === 'g3title');
tap('a'); frames(2);
check('title -> g3cine (first boot plays the intro)', state() === 'g3cine');
tap('start'); frames(2);
check('cine skip -> g3hub', state() === 'g3hub' && RDF.cineSeen());

/* ---- mirror purchase ---- */
RDF.open('mirror'); frames(2);
check('mirror opens', state() === 'g3mirror');
const dew0 = RD.dew; tap('a'); frames(1);
check('bought Vitality rank 1', (RD.mirror.vit || 0) === 1 && RD.dew === dew0 - 10);
tap('b'); frames(1); check('mirror exit -> hub', state() === 'g3hub');

/* ---- talk + gift keepsake ---- */
RDF.talk('ERIN'); frames(1);
check('talk opens', state() === 'g3talk');
tap('start'); frames(1);
check('gift (START) -> Pressed Flower keepsake', !!RD.keeps.flower && RD.honey === 0);
for (let i = 0; i < 14 && state() !== 'g3hub'; i++) tap('a');
check('talk pages through lines -> hub', state() === 'g3hub');
RDF.open('keep'); frames(1); tap('a'); frames(1);
check('keepsake equipped', RD.keepEq === 'flower');
tap('b'); frames(1);

/* ---- armory ---- */
RDF.give('keys', 3);
RDF.open('arm'); frames(1); tap('down'); tap('a'); frames(1);
check('unlocked + equipped Root Maul', RD.weapon === 'maul' && RD.weapons.includes('maul'));
tap('up'); tap('a'); frames(1);
check('re-equipped Petal Blade', RD.weapon === 'blade');
tap('b'); frames(1);

/* ---- physical hub walk: descend through the Root Door ---- */
hold('down', 70); tap('a'); frames(3);
check('walked to Root Door -> character select', state() === 'g3chars');
tap('a'); frames(3);
check('picked Will -> run starts', state() === 'g3run' && st().run && st().run.chamber === 1);
check('chamber 1 has foes', st().run.enemies > 0);
check('Pressed Flower + Vitality max HP applied', st().run.hp >= 130);

/* ---- combat soak + clear + door ---- */
const dirs = ['right', 'down', 'left', 'up'];
for (let i = 0; i < 40; i++) { G.keys[dirs[i % 4]] = 1; frames(6); G.keys[dirs[i % 4]] = 0; if (i % 3 === 0) tap('a'); if (i % 7 === 0) tap('b'); if (i % 11 === 0) tap('sel'); }
check('combat soak: still in run (or died trying)', ['g3run', 'g3over', 'g3pause'].includes(state()));
if (state() === 'g3run') {
  RDF.clearRoom(); frames(3);
  check('room cleared -> doors', st().run && st().run.phase === 'doors');
  RDF.door(0); frames(2);
  let guard = 0;
  while (guard++ < 8 && state() !== 'g3run') {
    if (state() === 'g3boon') { tap('a'); frames(2); }
    else if (state() === 'g3shop') { tap('b'); frames(2); }
    else break;
  }
  check('door reward resolved -> chamber 2', state() === 'g3run' && st().run.chamber === 2);
  const boonsAfterDoor = st().run.boons;
  console.log('     boons now:', boonsAfterDoor.join(', ') || '(none — door was not a boon)');

  /* ---- boss ---- */
  const keysBefore = RD.keys + (st().run ? 0 : 0);
  RDF.boss(); frames(90);
  check('boss AI soak: alive in run', state() === 'g3run');
  RDF.clearRoom(); frames(3);
  check('boss down counted', RD.stats.bosses >= 1);
  // take whatever door back into the run
  if (st().run && st().run.phase === 'doors') { RDF.door(0); frames(2); let g2 = 0; while (g2++ < 8 && state() !== 'g3run') { if (state() === 'g3boon') { tap('a'); frames(2); } else if (state() === 'g3shop') { tap('b'); frames(2); } else break; } }

  /* ---- pause / build / abandon ---- */
  tap('start'); frames(2);
  check('pause opens', state() === 'g3pause');
  tap('down'); tap('a'); frames(2);
  check('build page draws', state() === 'g3pause');
  tap('b'); frames(1); tap('b'); frames(2);
  check('pause resume -> run', state() === 'g3run');
  tap('start'); frames(1); tap('down'); tap('down'); tap('down'); tap('a'); frames(2);
  check('abandon -> hub, run banked', state() === 'g3hub' && st().run === null);
}

/* ---- death & banking ---- */
RDF.depart(); frames(2);
check('second run starts', state() === 'g3run');
const dewBefore = RD.dew;
let guard = 0;
while (state() === 'g3run' && guard++ < 6) { RDF.hurt(60); frames(4); }
check('death -> g3over', state() === 'g3over');
check('death counted', RD.stats.deaths >= 1);
frames(60); tap('a'); frames(2);
check('death screen -> hub', state() === 'g3hub');

/* ---- heat gate ---- */
RD.stats.escapes = 1;
RDF.open('heat'); frames(1); tap('right'); frames(1);
check('heat raised to 1', RDF.state().meta.heat === 1);
tap('b'); frames(1);
RDF.depart(); frames(2);
check('run carries heat', st().run && RD.stats.runs >= 3);
tap('start'); frames(1); tap('down'); tap('down'); tap('down'); tap('a'); frames(1); // abandon back out

/* ---- long bot soak: play until death or 150 sim-seconds ---- */
RDF.depart(); frames(2);
let step = 0, maxChamber = 1;
while (step++ < 9000) {
  const s = state();
  if (s === 'g3over' || s === 'g3win') break;
  if (s === 'g3boon') { tap('a'); continue; }
  if (s === 'g3shop') { tap('b'); continue; }
  if (s === 'g3pause') { tap('start'); continue; }
  if (s !== 'g3run') break;
  const run = st().run; if (run) maxChamber = Math.max(maxChamber, run.chamber);
  if (run && run.phase === 'doors') { RDF.door(Math.random() < .5 ? 0 : 1); frames(2); continue; }
  const d = dirs[(step >> 4) % 4];
  G.keys[d] = 1; frames(3); G.keys[d] = 0;
  if (step % 5 === 0) tap('a');
  if (step % 17 === 0) tap('b');
  if (step % 23 === 0) tap('sel');
}
console.log('     soak ended in state', state(), '· max chamber reached', maxChamber, '· runs', RD.stats.runs, '· kills', RD.stats.kills);
check('bot soak survived the state machine', ['g3run', 'g3over', 'g3win', 'g3boon', 'g3shop'].includes(state()));
check('bot soak made progress (chamber >= 2 or died trying)', maxChamber >= 2 || state() === 'g3over');

console.log('console.errors during run:', errors.length);
errors.slice(0, 4).forEach(e => console.log('ERR:', e.split('\n').slice(0, 3).join(' | ')));
console.log(fails.length === 0 && errors.length === 0 ? 'ROOTDEEP_PLAYTEST_OK' : 'ROOTDEEP_PLAYTEST_FAILS: ' + fails.join('; '));
process.exit(fails.length === 0 && errors.length === 0 ? 0 : 1);
