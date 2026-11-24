// No double dribble: node tests/dribble.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.startPractice('free'); window.__tick(170); P.MT.phase = 'live'; });
const keys = (ks, n) => p.evaluate(([ks, n]) => { const P = __pit, K = P.keys, M = P.MT, me = M.me; const o = []; for (let i = 0; i < n; i++) { for (const k in K) K[k] = false; for (const k of ks) K[k] = true; window.__tick(1); o.push({ live: me.live, st: me.st, x: me.x, z: me.z, an: me.an, hold: M.B.holder === me }); } for (const k in K) K[k] = false; return o; }, [ks, n]);
const fresh = () => p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; me.x = 0; me.z = 7; me.vx = me.vz = 0; me.st = 'free'; M.B.state = 'loose'; P.MT.B.holder = null; const B = M.B; B.state = 'held'; B.holder = me; me.drib = null; me.live = 'hold'; window.__tick(2); return me.live; });
let r; await p.evaluate(() => { const M = __pit.MT, me = M.me; me.vx = me.vz = 0; M.B.holder = null; M.B.state = 'loose'; M.looseT = 0; M.B.pos.set(me.x, 1, me.z); window.__tick(1); });   // a shoot-around hands the ball back to a player standing still
// 1. ball in hand standing still: held, dribble alive; pushing the stick starts the dribble
let L = await keys([], 10); const r1 = L[L.length - 1]; L = await keys(['KeyD'], 20); const r2 = L[L.length - 1];
ok(r2.live === 'drib' && r2.x > L[0].x + 0.3, `held at first (${r1.live}, ${r1.an}); push the stick and he dribbles off (${r2.live})`);
// 2. stop: the ball is picked up; the stick only pivots; moves are refused
L = await keys([], 35); const r3 = L[L.length - 1]; const x0 = r3.x;
L = await keys(['KeyA'], 30); const r4 = L[L.length - 1];
L = await keys(['KeyA', 'KeyL'], 2); L = L.concat(await keys(['KeyA'], 10)); const moved = L.some(s => s.st === 'move');
ok(r3.live === 'dead' && r3.an === 'hold' && Math.abs(r4.x - x0) < 0.12 && !moved, `stopped: picked up (${r3.live}, ${r3.an}); pushing the stick does not move him (${Math.abs(r4.x - x0).toFixed(2)} m); a dribble move is refused`);
// 3. dead ball: he can still shoot
L = await keys(['Space'], 20); ok(L.some(s => s.st === 'shoot'), 'picked up: he can still shoot');
await keys([], 90);
// 4. a hesi on the move keeps the dribble alive
await fresh(); await keys(['KeyD'], 20); L = await keys(['KeyD', 'KeyK', 'KeyL'], 2); L = L.concat(await keys(['KeyD'], 40));
ok(L.some(s => s.st === 'move') && L[L.length - 1].live === 'drib', `a hesi / move on the move keeps the dribble alive (${L[L.length - 1].live})`);
// 5. a quick tap stop (under 0.4 s) does not pick it up
L = await keys([], 15); L = L.concat(await keys(['KeyD'], 20)); ok(L[L.length - 1].live === 'drib', `a quick stop-and-go (0.25 s) keeps the dribble (${L[L.length - 1].live})`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
