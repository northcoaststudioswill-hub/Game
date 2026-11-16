// Sproutwild v2.3 suite: scrolling camera, 4-way movement, partner follower,
// intro re-derivation for existing saves.
// Usage: node test-harness-sw7.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ').slice(0, 220)); };

function boot(seedSave) {
  function ctxStub() { const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: () => {} };
    return new Proxy(t, { get(o, k) { if (k in o) return o[k]; return () => undefined; }, set(o, k, v) { o[k] = v; return true; } }); }
  function el(id) { const classes = new Set();
    return { id, hidden: false, textContent: '', clientWidth: 120, clientHeight: 60, style: { setProperty() {} },
      classList: { add: c => classes.add(c), remove: c => classes.delete(c), toggle: (c, f) => { f ? classes.add(c) : classes.delete(c); }, contains: c => classes.has(c) },
      addEventListener() {}, setPointerCapture() {}, getBoundingClientRect: () => ({ top: 100, left: 50, width: 100, height: 120, bottom: 220, right: 150 }),
      getContext: () => ctxStub(), parentNode: { clientWidth: 360, clientHeight: 300 }, querySelectorAll: () => carts }; }
  const byId = {}; const carts = [0, 1, 2].map(i => el('cart' + i));
  const store = {};
  if (seedSave) store['sproutwild-v1'] = JSON.stringify(seedSave);
  const sandbox = {
    console, Math, JSON, Object, Array, Set, Map, Date, Promise, setTimeout, clearTimeout,
    document: { getElementById: id => byId[id] || (byId[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null },
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    Image: class { constructor() { this.complete = false; } },
    addEventListener: () => {},
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  byId['shelf'] = el('shelf');
  let rafCb = null;
  sandbox.requestAnimationFrame = cb => { rafCb = cb; };
  const vm = require('vm');
  const ctx = vm.createContext(sandbox);
  for (const s of scripts) vm.runInContext(s, ctx);
  const G = sandbox.__g;
  let t = 0;
  const frames = n => { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) throw new Error('rAF broke'); } };
  const tap = (key, hold = 1) => { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); };
  frames(3); tap('right'); tap('right'); tap('a'); frames(2);
  return { G, SWF: G.SWF(), SW: G.SW(), frames, tap, store };
}

let fails = [];
function check(name, cond) { console.log((cond ? 'ok   ' : 'FAIL ') + name); if (!cond) fails.push(name); }

/* ---------- main boot: camera, movement, partner ---------- */
{
  const { G, SWF, SW, frames, tap } = boot(null);
  frames(50); tap('a'); frames(3);
  for (let i = 0; i < 14 && SWF.state() !== 'g4world'; i++) { tap('a'); frames(1); }
  SWF.giveMon('CINDERCAP', 5, false);
  check('boots into the base world', SWF.state() === 'g4world' && SW.sector === 'BASE');
  const cam0 = SWF.cam();
  check('camera starts scrolled to the spawn corner (not 0,0)', cam0 && cam0.y > 100);
  SWF.setPos(30, 40); frames(3);
  const cam1 = SWF.cam();
  check('camera follows to the far corner', cam1.x === 0 && cam1.y === 0);
  SWF.setPos(470, 330); frames(3);
  const cam2 = SWF.cam();
  check('camera clamps at the world edge', cam2.x >= 230 && cam2.y >= 150);

  /* 4-way movement: diagonal input collapses to the last-pressed axis */
  SWF.setPos(240, 180); frames(2);
  const p0 = SWF.pos();
  G.keys.down = 1; frames(2);            /* edge: lastDir = down */
  G.keys.right = 1; frames(30);          /* edge: lastDir = right, both held */
  const p1 = SWF.pos();
  check('diagonal input moves on ONE axis (last pressed wins)', Math.abs(p1.y - p0.y) < 3 && p1.x > p0.x + 20);
  G.keys.right = 0; frames(30);          /* release right, down still held */
  const p2 = SWF.pos();
  G.keys.down = 0; frames(2);
  check('releasing falls back to the still-held direction', p2.y > p1.y + 15 && Math.abs(p2.x - p1.x) < 3);

  /* partner follower trails the player */
  SWF.enter('MEADOW'); frames(3);
  const part0 = { ...SWF.part() }; /* snapshot — SWF.part() is a live reference */
  check('a partner shadow spawns with you', !!part0);
  G.keys.right = 1; frames(70); G.keys.right = 0; frames(30);
  const part1 = { ...SWF.part() }, pp = SWF.pos();
  check('partner followed across the sector', part1.x > part0.x + 30);
  check('partner settles near the player', Math.hypot(pp.x - part1.x, pp.y - part1.y) < 45);
}

/* ---------- intro re-derivation for existing saves ---------- */
{
  const base = { intro: 1, sector: 'BASE', res: { wood: 3, stone: 0, petal: 30, berry: 2, ingot: 0 },
    party: [], box: [], buildings: [], badges: [], caught: {}, seen: {}, talkN: {} };
  const a = boot(base);
  check('old save with nothing done re-enters the intro at Louie', a.SW.quest === 0);
  const b = boot({ ...base, talkN: { LOUIE: 2 }, party: [{ sp: 'CINDERCAP', lv: 5, hp: 30, xp: 0, moves: [] }],
    caught: { CINDERCAP: 1 }, buildings: [{ k: 'cottage', gx: 4, gy: 2, workers: [] }] });
  check('old save mid-intro resumes at the catch step (new order)', b.SW.quest === 2);
  const c = boot({ ...base, talkN: { LOUIE: 2 }, party: [{ sp: 'CINDERCAP', lv: 5, hp: 30, xp: 0, moves: [] }], buildings: [{ k: 'cottage', gx: 4, gy: 2, workers: [] }, { k: 'bed', gx: 5, gy: 2, workers: [] }],
    caught: { CINDERCAP: 1, PEBBLIT: 1 } });
  check('old save that finished setup keeps a finished intro', c.SW.quest === 5);
}

console.log('console.errors during run:', errors.length, errors.slice(0, 2));
if (fails.length || errors.length) { console.log('SW7_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V23_OK');
