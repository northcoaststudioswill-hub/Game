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


/* ================= PLAYTEST (tester pass, not a gate) ================= */
const L = (...a) => console.log('PLAY|', ...a);
const NPCS5 = ['ERIN', 'LOUIE', 'RANGER', 'MARCUS', 'SCOUT'];
function clearKeys() { for (const k of ['left', 'right', 'up', 'down', 'a', 'b']) G.keys[k] = 0; }
function steer(x, y, dead = 5) { const p = RDF.pos(); clearKeys();
  if (x - p.x > dead) G.keys.right = 1; else if (p.x - x > dead) G.keys.left = 1;
  if (y - p.y > dead) G.keys.down = 1; else if (p.y - y > dead) G.keys.up = 1; }
function dtap(dir) { G.keys[dir] = 1; frames(1); G.keys[dir] = 0; frames(2); G.keys[dir] = 1; frames(1); G.keys[dir] = 0; frames(1); }
const simT = () => Math.round(t / 1000 * 10) / 10;

/* boot -> hub */
frames(3); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
tap('a'); frames(2); tap('start'); frames(2);
L('boot state:', state());

/* ---- PHASE 1: hub observation, 45 sim-seconds, player idle ---- */
{
  let minPair = 1e9, doorViol = 0, samples = 0, closeTime = 0;
  const seen = {}; NPCS5.forEach(w => seen[w] = new Set());
  for (let i = 0; i < 90; i++) { frames(30); samples++;
    const pos = {}; NPCS5.forEach(w => { pos[w] = RDF.npcPos(w); if (pos[w]) seen[w].add(pos[w][0] + ',' + pos[w][1]); });
    let close = false;
    for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) { const A = pos[NPCS5[a]], B = pos[NPCS5[b]]; if (!A || !B) continue;
      const d = Math.hypot(A[0] - B[0], A[1] - B[1]); if (d < minPair) minPair = d; if (d < 20) close = true; }
    if (close) closeTime++;
    NPCS5.forEach(w => { if (pos[w] && pos[w][1] > 166) doorViol++; });
  }
  L('HUB min pairwise NPC distance over 45s:', minPair, '| samples with a pair <20px:', closeTime + '/' + samples, '| door-zone samples:', doorViol);
  NPCS5.forEach(w => L('HUB distinct spots visited by', w, ':', seen[w].size));
}

/* ---- PHASE 2: the run (combat bot, real inputs) ---- */
RD.bank[0] = 2; RD.bank[1] = 2; RD.bank[3] = 2;
RD.party = [0, 1, 3];
RDF.depart(); frames(5);
L('run start, state:', state(), 'party buds:', RDF.buds());
const runLog = [];
{
  let tick = 0, lastHp = 100, atkT = 0, casts = 0, dashEvades = 0, podsSpawned = 0, podsGot = 0, prevPods = 0, prevStr = RDF.buds().length;
  let ch = 1, chStart = t, chHp = 100, chPetals = 0, outcome = 'cap';
  while (tick++ < 60000) { frames(2);
    const s = st();
    if (s.state === 'g3boon') { tap('a'); frames(2); continue; }
    if (s.state === 'g3shop') { tap('b'); frames(2); continue; }
    if (s.state === 'g3over' || s.state === 'g3win') { outcome = s.state; for (let i = 0; i < 200 && state() !== 'g3hub'; i++) { tap('a'); frames(10); } break; }
    if (s.state !== 'g3run' || !s.run) break;
    const r = s.run, p = RDF.pos(), foes = RDF.foes(), pods = RDF.pods();
    if (pods.length > prevPods) podsSpawned += pods.length - prevPods;
    if (RDF.buds().length > prevStr) podsGot += RDF.buds().length - prevStr;
    prevPods = pods.length; prevStr = RDF.buds().length;
    if (r.chamber !== ch) { runLog.push({ ch, secs: Math.round((t - chStart) / 1000 * 10) / 10, hpLost: chHp - r.hp, petals: r.petals - chPetals });
      ch = r.chamber; chStart = t; chHp = r.hp; chPetals = r.petals; }
    if (r.hp < lastHp - 5) { lastHp = r.hp;
      if (foes.length && Math.random() < .6) { const f = foes[0], away = Math.abs(f.x - p.x) > Math.abs(f.y - p.y) ? (f.x > p.x ? 'left' : 'right') : (f.y > p.y ? 'up' : 'down'); dtap(away); dashEvades++; } }
    if (r.hp > lastHp) lastHp = r.hp;
    if (r.phase === 'doors') { clearKeys();
      if (pods.length && RDF.buds().length < 6) { steer(pods[0].x, pods[0].y, 3); continue; }
      const ds = RDF.doors(); let di = ds.findIndex(d => d.startsWith('boon')); if (di < 0) di = 0;
      RDF.door(di); frames(3); continue; }
    if (!foes.length) { clearKeys(); continue; }
    let f = foes[0], fd = 1e9; for (const e of foes) { const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < fd) { fd = d; f = e; } }
    if (pods.length && foes.length <= 1 && fd > 40) { steer(pods[0].x, pods[0].y, 3); continue; }
    if (fd > 17) steer(f.x, f.y, 4);
    else { clearKeys(); if (t - atkT > 300) { tap('a'); atkT = t; } }
    if (p.ammo > 0 && fd < 78 && tick % 45 === 0) { tap('b'); casts++; }
  }
  runLog.push({ ch, secs: Math.round((t - chStart) / 1000 * 10) / 10, hpLost: 'end', petals: st().run ? st().run.petals : 0 });
  L('RUN outcome:', outcome, '| chambers logged:', JSON.stringify(runLog));
  L('RUN pods spawned:', podsSpawned, 'collected(string growth):', podsGot, '| casts:', casts, '| dash-evades:', dashEvades, '| final state:', state());
}

/* ---- PHASE 3: buds-only trial (full string, player never attacks) ---- */
{
  RD.bank[0] = 1; RD.bank[1] = 1; RD.bank[2] = 1; RD.bank[3] = 1; RD.bank[4] = 1; RD.bank[5] = 1;
  RD.party = [0, 1, 2]; RDF.depart(); frames(5);
  RDF.giveRun('hp', 400); /* tester scaffolding: survive long enough to measure */
  const podsWanted = [3, 4, 5]; for (const ty of podsWanted) RDF.pod(ty);
  frames(30); /* collect the three pods at feet */
  L('BUDS trial string:', RDF.buds());
  let f0 = RDF.foes().reduce((a, e) => a + e.hp, 0), n0 = RDF.foes().length, t0 = t, firstKill = -1, strMin = 6;
  for (let i = 0; i < 5400; i++) { frames(2);
    if (state() !== 'g3run') break;
    const foes = RDF.foes(), p = RDF.pos(); strMin = Math.min(strMin, RDF.buds().length);
    if (foes.length < n0 && firstKill < 0) { firstKill = Math.round((t - t0) / 100) / 10; }
    if (!foes.length) break;
    let f = foes[0], fd = 1e9; for (const e of foes) { const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < fd) { fd = d; f = e; } }
    if (fd > 30) steer(f.x, f.y, 4); else if (fd < 15) { clearKeys(); G.keys[f.x > p.x ? 'left' : 'right'] = 1; } else clearKeys();
  }
  clearKeys();
  const f1 = RDF.foes().reduce((a, e) => a + e.hp, 0), secs = Math.round((t - t0) / 100) / 10;
  L('BUDS foe HP', f0, '->', f1, 'in', secs, 's | bud DPS ~', secs ? Math.round((f0 - f1) / secs * 10) / 10 : 0, '| first bud kill at (s):', firstKill, '| string min size:', strMin, '| player hp:', st().run ? st().run.hp : 'dead');
  RDF.hurt(99999); frames(30); for (let i = 0; i < 200 && state() !== 'g3hub'; i++) { tap('a'); frames(10); }
  L('after buds trial, state:', state());
}

/* ---- PHASE 4: dash + cast control trials ---- */
{
  RDF.depart(); frames(5); RDF.clearRoom(); frames(5);
  let okD = 0; const dirs = ['left', 'right', 'up', 'down'];
  for (let i = 0; i < 12; i++) { const d = dirs[i % 4]; dtap(d); let dashed = false;
    for (let j = 0; j < 8; j++) { frames(1); if (RDF.pos().dashT > 0) { dashed = true; break; } }
    if (dashed) okD++; frames(20); }
  L('DASH deliberate double-taps that dashed:', okD + '/12');
  let acc = 0, wasD = false;
  for (let i = 0; i < 40; i++) { tap(dirs[i % 2], 1); frames(11); const dNow = RDF.pos().dashT > 0; if (dNow && !wasD) acc++; wasD = dNow; }
  L('DASH accidental dashes while strafing L/R:', acc);
  let slow = 0;
  for (let i = 0; i < 10; i++) { tap('right', 1); frames(20); tap('right', 1); let dashed = false;
    for (let j = 0; j < 6; j++) { frames(1); if (RDF.pos().dashT > 0) { dashed = true; break; } } if (dashed) slow++; frames(15); }
  L('DASH re-taps at 0.33s gap that (wrongly) dashed:', slow + '/10');
  const a0 = RDF.pos().ammo; tap('b'); frames(3);
  L('CAST tap B: ammo', a0, '->', RDF.pos().ammo, '(drop = cast fired)');
  RDF.hurt(99999); frames(30); for (let i = 0; i < 200 && state() !== 'g3hub'; i++) { tap('a'); frames(10); }
}
console.log('PLAY| console.errors during playtest:', errors.length, errors.slice(0, 2));
console.log('PLAYTEST_DONE');
