// Courts: tier-painted park courts, the RUCKUS arcade and its power-ups. node tests/courts.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const launch = (mi, ti) => p.evaluate(([mi, ti]) => { const P = __pit; if (P.MT) P.MT.cfg.onEnd = () => {}; P.uiClose(); P.launchGame(P.MODES[mi], P.TIERS_COURT[ti], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(220); const M = P.MT; return { kind: M.courtFx && M.courtFx.kind, pu: !!M.pu }; }, [mi, ti]);
let r = await launch(0, 3); ok(r.kind === 'park' && !r.pu, `street game: dressed park court (${r.kind}), no power-ups`);
r = await launch(2, 1); ok(r.kind === 'arcade' && r.pu, `RUCKUS game: arcade court (${r.kind}) with power-ups`);
// spawn, take, effects
const set = `var P = __pit, M = P.MT, me = M.me; M.phase = 'live'; M.needClear = false; M.clock = 20; for (const q of M.P) { q.st = 'free'; q.pu = null; q.puA = null; if (q.ai) q.ai.tick = 999; } for (const it of M.pu.list.slice()) { }`;
r = await p.evaluate(s => { eval(s); for (const q of M.P) { q.x = 7.5; q.z = 12.5; } M.pu.t = 0; P.puStep(1 / 60); const it = M.pu.list[M.pu.list.length - 1]; if (!it) return { spawned: false };
  const sp0 = __pit.MT.me.A.speed; me.x = it.x; me.z = it.z; window.__tick(2); return { spawned: true, took: me.pu && me.pu.id, left: M.pu.list.indexOf(it) }; }, set);
ok(r.spawned && r.took && r.left === -1, `a power-up drops on the floor; running over it takes it (${r.took})`);
r = await p.evaluate(s => { eval(s); const PU = P.POWERUPS(), k = PU.findIndex(x => x.id === 'turbo'); me.pu = { id: 'turbo', k, t: 6, dur: 6 }; me.puA = PU[k].a; me.stam = 50; me.x = -6; me.z = 1;
  M.B.state = 'held'; M.B.holder = M.P.find(q => q.team === me.team && q !== me); M.off = me.team; for (let i = 0; i < 60; i++) { P.keys.KeyD = P.keys.KeyW = P.keys.ShiftLeft = true; window.__tick(1); } P.keys.KeyD = P.keys.KeyW = P.keys.ShiftLeft = false;
  const st = me.stam, sp = Math.hypot(me.vx, me.vz); for (let i = 0; i < 400; i++) window.__tick(1); return { st: +st.toFixed(1), sp: +sp.toFixed(2), after: me.pu }; }, set);
ok(r.st >= 50 && r.after === null, `TURBO: a second of sprinting costs no stamina (${r.st}), and it wears off (${r.after})`);
r = await p.evaluate(s => { eval(s); const PU = P.POWERUPS(), k = PU.findIndex(x => x.id === 'double'); me.pu = { id: 'double', k, t: 12, dur: 12 }; me.puA = {}; const s0 = M.score[me.team]; P.scorePts(me, 1, 'shot'); const a = M.score[me.team] - s0; P.scorePts(me, 1, 'shot'); return { first: a, second: M.score[me.team] - s0 - a }; }, set);
ok(r.first === 2 && r.second === 1, `DOUBLE UP: the next bucket counts ${r.first}, the one after ${r.second}`);
r = await p.evaluate(s => { eval(s); const PU = P.POWERUPS(), k = PU.findIndex(x => x.id === 'sticky'); const before = P.stealChance ? 0 : 0; me.puA = PU[k].a; const a = me.A.steal; return { boost: PU[k].a.steal }; }, set);
r = await p.evaluate(s => { eval(s); for (const q of M.P) { q.x = 7.5; q.z = 12.5; } M.pu.list.forEach(it => it.life = 0.01); P.puStep(1 / 60); P.puStep(1 / 60); return M.pu.list.length; }, set);
ok(r === 0, `an untaken power-up fades away after a while (${r} left)`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
