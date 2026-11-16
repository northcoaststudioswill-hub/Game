// Focused tests: boon offers (all 6 gods), shop purchases, the finale/escape,
// and a Sprouts regression pass. Usage: node test-harness-rd2.js <html> [sprouts]
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const MODE = process.argv[3] || 'boons';
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() { const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage got a sprite object (use .ol)'); } };
  return new Proxy(t, { get(o, k) { if (k in o) return o[k]; return () => undefined; }, set(o, k, v) { o[k] = v; return true; } }); }
function el(id) { const classes = new Set();
  return { id, hidden: false, textContent: '', clientWidth: 120, clientHeight: 60, style: { setProperty() {} },
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), toggle: (c, f) => { f ? classes.add(c) : classes.delete(c); }, contains: c => classes.has(c) },
    addEventListener() {}, setPointerCapture() {},
    getBoundingClientRect: () => ({ top: 100, left: 50, width: 100, height: 120, bottom: 220, right: 150 }),
    getContext: () => ctxStub(), parentNode: { clientWidth: 360, clientHeight: 300 }, querySelectorAll: () => carts }; }
const byId = {}; const carts = [0, 1, 2].map(i => el('cart' + i));
global.window = global;
global.document = { getElementById: id => byId[id] || (byId[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
byId['shelf'] = el('shelf');
const store = {};
global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.Image = class { constructor() { this.complete = false; } };
let rafCb = null; global.requestAnimationFrame = cb => { rafCb = cb; }; global.addEventListener = () => {};
for (const s of scripts) eval(s);
const G = global.window.__g;
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }

if (MODE === 'sprouts') {
  frames(3); tap('a'); frames(2);
  check('sprouts cart -> boot', G.s.state === 'boot');
  frames(50); tap('a'); frames(3);
  check('boot -> intro', G.s.state === 'intro');
  frames(80); tap('a'); frames(2);
  check('intro -> menu', G.s.state === 'menu');
  tap('a'); frames(2);
  check('PLAY -> cine', G.s.state === 'cine');
  tap('start'); frames(2);
  check('cine skip -> talk', G.s.state === 'talk');
  for (let i = 0; i < 14; i++) { tap('a'); frames(1); }
  check('dialogue -> play', G.s.state === 'play');
  hold('right', 30); frames(300);
  check('5s live play, still playing', G.s.state === 'play');
} else {
  const RDF = G.RDF(), RD = G.RD();
  const st = () => RDF.state(), state = () => st().state;
  frames(3); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
  check('boot -> g3title', state() === 'g3title');
  RDF.start(); frames(1);
  check('RDF.start -> hub', state() === 'g3hub');
  RDF.depart(); frames(2);
  check('run started', state() === 'g3run' && st().run.chamber === 1);

  /* boons from all six gods */
  const gods = ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY'];
  for (const god of gods) {
    RDF.forceBoon(god); frames(2);
    check(god + ' offer shows 3 boons', state() === 'g3boon' && RDF.offer().length === 3);
    console.log('     ' + god + ':', RDF.offer().join(' | '));
    tap('a'); frames(2);
    // accepting a door-style boon advances to the next chamber in g3run
    check(god + ' boon accepted -> run resumes', state() === 'g3run');
    // soak a few seconds with this god's kit (status effects, dash/cast paths)
    for (let i = 0; i < 12; i++) { tap('a'); frames(4); if (i % 3 === 0) tap('b'); if (i % 4 === 0) tap('sel'); }
    check(god + ' combat soak clean', state() === 'g3run' || state() === 'g3over');
    if (state() === 'g3over') { frames(60); tap('a'); frames(1); RDF.depart(); frames(1); }
    RDF.clearRoom(); frames(2);
    if (st().run && st().run.phase === 'doors') { RDF.door(0); frames(2); let g = 0; while (g++ < 6 && state() !== 'g3run') { if (state() === 'g3boon') { tap('a'); frames(1); } else if (state() === 'g3shop') { tap('b'); frames(1); } else break; } }
  }
  const finalBoons = st().run ? st().run.boons : [];
  console.log('     build after god tour:', finalBoons.join(', ') || '(run ended)');
  check('gathered several boons across the tour', finalBoons.length >= 3 || RD.stats.deaths > 0 || RD.stats.escapes > 0);

  /* shop: buy everything affordable, then leave */
  if (state() !== 'g3run') { RDF.depart(); frames(1); }
  RDF.giveRun('petals', 600);
  RDF.forceShop(); frames(2);
  check('shop opens', state() === 'g3shop');
  for (let i = 0; i < 3; i++) { tap('a'); frames(2); if (state() === 'g3boon') { tap('a'); frames(2); } if (state() !== 'g3shop') break; tap('down'); }
  check('shop purchases processed', state() === 'g3shop' || state() === 'g3run');
  if (state() === 'g3shop') { tap('b'); frames(2); }
  check('shop exit -> next chamber', state() === 'g3run');

  /* finale: chamber 12 boss -> escape */
  RDF.finale(); frames(3);
  check('finale loads chamber 12 boss', st().run && st().run.chamber === 12 && st().run.enemies >= 1);
  frames(120);
  check('Hollow Keeper AI soak clean', state() === 'g3run');
  RDF.clearRoom(); frames(3);
  check('escape -> g3win', state() === 'g3win');
  check('escape counted', RD.stats.escapes >= 1);
  frames(60); tap('a'); frames(2);
  check('win screen -> hub', state() === 'g3hub');
  // heat gate now genuinely unlocked
  RDF.open('heat'); frames(1); tap('right'); frames(1);
  check('heat adjustable after real escape', RDF.state().meta.heat >= 1);
  tap('b'); frames(1);

  /* codex pages render */
  RDF.open('codex'); frames(1); tap('right'); frames(1); tap('right'); frames(1);
  check('codex pages cycle', state() === 'g3codex');
  tap('b'); frames(1);
}
console.log('console.errors:', errors.length);
errors.slice(0, 4).forEach(e => console.log('ERR:', e.split('\n').slice(0, 3).join(' | ')));
console.log(fails.length === 0 && errors.length === 0 ? 'RD2_OK' : 'RD2_FAILS: ' + fails.join('; '));
process.exit(fails.length === 0 && errors.length === 0 ? 0 : 1);
