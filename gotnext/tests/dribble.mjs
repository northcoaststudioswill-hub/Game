// No double dribble: node tests/dribble.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.startPractice('free'); window.__tick(170); P.MT.phase = 'live'; });
const keys = (ks, n) => p.evaluate(([ks, n]) => { const P = __pit, K = P.keys, M = P.MT, me = M.me; const o = []; for (let i = 0; i < n; i++) { for (const k in K) K[k] = false; for (const k of ks) K[k] = true; window.__tick(1); o.push({ live: me.live, st: me.st, x: me.x, z: me.z, an: me.an, hold: M.B.holder === me }); } for (const k in K) K[k] = false; return o; }, [ks, n]);
const fresh = () => p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; me.x = 0; me.z = 7; me.vx = me.vz = 0; me.st = 'free'; M.B.state = 'loose'; P.MT.B.holder = null; const B = M.B; B.state = 'held'; B.holder = me; me.drib = null; me.live = 'hold'; window.__tick(2); return me.live; });
let r; await p.evaluate(() => { const M = __pit.MT, me = M.me; me.vx = me.vz = 0; M.B.holder = null; M.B.state = 'loose'; M.looseT = 0; M.B.pos.set(me.x, 1, me.z); window.__tick(1); });   // a shoot-around hands the ball back to a player standing still
// 1. ball in hand standing still: held, dribble alive; pushing the stick starts the dribble
let L = await keys([], 10); const r1 = L[L.length - 1]; L = await keys(['KeyD'], 20); const r2 = L[L.length - 1];
ok(r2.live === 'drib' && r2.x > L[0].x + 0.3, `held at first (${r1.live}, ${r1.an}); push the stick and he dribbles off (${r2.live})`);
// 2. stopping keeps the dribble alive
L = await keys([], 60); const r3 = L[L.length - 1];
ok(r3.live === 'drib' && r3.an === 'dribble', `stop for a second: still dribbling (${r3.live}, ${r3.an})`);
// 3. pump fake standing after dribbling: picked up; the stick only pivots; moves are refused; he can still shoot
L = await keys(['Space'], 4); L = L.concat(await keys([], 30)); const r4 = L[L.length - 1]; const x0 = r4.x;
L = await keys(['KeyA'], 30); const r5 = L[L.length - 1]; L = await keys(['KeyA', 'KeyL'], 2); L = L.concat(await keys(['KeyA'], 10)); const moved = L.some(s => s.st === 'move');
ok(r4.live === 'dead' && r4.an === 'hold' && Math.abs(r5.x - x0) < 0.12 && !moved, `pump fake standing: picked up (${r4.live}, ${r4.an}); the stick does not move him (${Math.abs(r5.x - x0).toFixed(2)} m); a dribble move is refused`);
L = await keys(['Space'], 20); ok(L.some(s => s.st === 'shoot'), 'picked up: he can still shoot');
await keys([], 90);
// 4. pump while driving: a hesi, and the dribble stays alive
await fresh(); await keys(['KeyD', 'ShiftLeft'], 40); L = await keys(['KeyD', 'ShiftLeft', 'Space'], 4); L = L.concat(await keys(['KeyD', 'ShiftLeft'], 40));
const mv = await p.evaluate(() => __pit.MT.me.mv && __pit.MT.me.mv.mv.id);
ok(L.some(s => s.st === 'move') && mv === 'hesi' && L[L.length - 1].live === 'drib' && !L.some(s => s.st === 'fake'), `pump on the drive: a hesi (${mv}), still dribbling (${L[L.length - 1].live})`);
// 5. a dribble move on the move keeps the dribble alive
L = await keys(['KeyD', 'KeyL'], 2); L = L.concat(await keys(['KeyD'], 40)); ok(L.some(s => s.st === 'move') && L[L.length - 1].live === 'drib', `a crossover on the move keeps the dribble (${L[L.length - 1].live})`);
// 6. a defender up in your chest can force a pickup (dice loaded so the test is quick)
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(220);
  const M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), d = opp[0]; M.phase = 'live'; M.needClear = false; M.clock = 14; for (const q of M.P) if (q !== me && q !== d) { q.x = 7.5; q.z = 12.5; q.st = 'stagger'; q.stg = { dur: 99, fall: false }; q.t = 0; }
  me.x = 0; me.z = 7; me.vx = me.vz = 0; me.face = Math.PI; M.B.state = 'held'; M.B.holder = me; M.off = me.team; me.live = 'drib'; d.x = 0; d.z = 6.25; d.ai.tick = 999; d.aiLvl = 0; d.user = true; d.ctrl = 5;
  while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  const rnd = Math.random; Math.random = () => 0.01; let t = -1, dbg = []; for (let i = 0; i < 120; i++) { window.__tick(1); if (i % 20 === 0) dbg.push([M.phase, me.st, me.live, +(Math.hypot(d.x - me.x, d.z - me.z)).toFixed(2), +(me.pressT || 0).toFixed(2), d.st, M.B.holder === me, +me.face.toFixed(2)].join(' ')); if (me.live === 'dead') { t = i; break; } } Math.random = rnd; return { live: me.live, secs: +(t / 60).toFixed(2), dbg }; });
ok(r.live === 'dead', `a defender up in your chest forces a pickup (after ${r.secs} s of pressure)`);
// 7. an AI ball handler with a dead ball gets rid of it instead of dribbling
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), h = opp[0], mate = opp[1]; for (const q of M.P) { q.st = 'free'; q.stg = null; }
  me.x = 6; me.z = 11; h.user = false; h.ctrl = -1; h.x = -2; h.z = 7; h.vx = h.vz = 0; mate.x = 3; mate.z = 8; M.B.state = 'held'; M.B.holder = h; M.off = h.team; M.needClear = false; h.live = 'dead'; h.ai.tick = 0; h.ai.hold = 0; h.aiLvl = 0.8; const x0 = h.x, z0 = h.z;
  let got = '', moved = 0; for (let i = 0; i < 90; i++) { window.__tick(1); moved = Math.max(moved, Math.hypot(h.x - x0, h.z - z0)); if (M.B.holder !== h) { got = M.B.state; break; } if (h.st === 'move') { got = 'MOVED'; break; } } return { got, moved: +moved.toFixed(2) }; });
ok((r.got === 'pass' || r.got === 'shot' || r.got === 'held') && r.moved < 0.3, `AI with a dead ball: ${r.got || 'kept it'} without dribbling (moved ${r.moved} m)`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
