// The hit layer on stumbles and falls: twist with the push, hips lag the chest, legs independent, a bounce and a settle. node tests/falls.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); });
let r = await p.evaluate(() => { const P = __pit, kinds = ['sit', 'face', 'flat', 'spin', 'knee'], D = 1.6, out = { bad: 0 }; const pose = (kind, t, hit, fall) => P.call('poseOf', 'stagger', t, { kind, fall: fall !== false, dur: D, side: 1, hit, leg: 0.95 });
  const y = (A, k) => (A[k] || [0, 0, 0])[1], x = (A, k) => (A[k] || [0, 0, 0])[0]; let twOK = 0, lagOK = 0, backOK = 0, legOK = 0, bounceOK = 0, endOK = 0, n = 0;
  for (const k of kinds) for (const fall of [true, false]) { if (!fall && k !== 'sit') continue; n++;
    const L = { tw: 0.9, fb: 0, pw: 1, s1: 0.7, s2: 0.6 }, R = { tw: -0.9, fb: 0, pw: 1, s1: 0.7, s2: 0.6 }, base = t => pose(k, t, { tw: 0, fb: 0, pw: 1, s1: 0, s2: 0 }, fall);
    const a = pose(k, 0.14, L, fall), c = pose(k, 0.14, R, fall), b0 = base(0.14); if (y(a, 'chest') - y(b0, 'chest') > 0.3 && y(c, 'chest') - y(b0, 'chest') < -0.3) twOK++;
    const e = pose(k, 0.08, L, fall), e0 = base(0.08), l8 = pose(k, 0.3, L, fall), l0 = base(0.3); if (Math.abs(y(e, 'chest') - y(e0, 'chest')) > Math.abs(y(e, 'hips') - y(e0, 'hips')) * 3 && Math.abs(y(l8, 'hips') - y(l0, 'hips')) > 0.2) lagOK++;
    const fwd = pose(k, 0.14, { tw: 0, fb: 0.9, pw: 1, s1: 0, s2: 0 }, fall), bk = pose(k, 0.14, { tw: 0, fb: -0.9, pw: 1, s1: 0, s2: 0 }, fall); if (x(fwd, 'chest') > x(b0, 'chest') + 0.15 && x(bk, 'chest') < x(b0, 'chest') - 0.15) backOK++;
    const g1 = pose(k, 0.28, L, fall); if (Math.abs(x(g1, 'hpL') - x(g1, 'hpR') - (x(l0, 'hpL') - x(l0, 'hpR'))) > 0.15 || Math.abs(x(g1, 'knL') - x(g1, 'knR') - (x(l0, 'knL') - x(l0, 'knR'))) > 0.15) legOK++;
    if (fall) { const up = pose(k, 0.32 + 0.12, L, true).y - pose(k, 0.44, undefined, true).y; if (up > 0.01) bounceOK++; const s1 = pose(k, 0.9, { tw: 0.9, fb: 0, pw: 1, s1: 0.8, s2: 0.8 }, true), s2 = pose(k, 0.9, { tw: 0.9, fb: 0, pw: 1, s1: -0.8, s2: -0.8 }, true); if (Math.abs(x(s1, 'knR') - x(s2, 'knR')) + Math.abs(y(s1, 'neck') - y(s2, 'neck')) > 0.2) out.settle = (out.settle || 0) + 1; }
    const end = pose(k, D - 0.001, L, fall), end0 = base(D - 0.001); let dd = 0; for (const j in end) if (Array.isArray(end[j])) dd += Math.abs(end[j][0] - (end0[j] || [0])[0]) + Math.abs(end[j][1] - (end0[j] || [0, 0])[1]); if (dd < 0.05) endOK++;
    for (let t = 0; t <= D; t += 0.05) { const A = pose(k, t, L, fall); for (const j in A) if (Array.isArray(A[j]) && A[j].some(v => !isFinite(v))) out.bad++; if (!isFinite(A.y)) out.bad++; } }
  return Object.assign(out, { n, twOK, lagOK, backOK, legOK, bounceOK, endOK }); });
ok(r.twOK === r.n && r.backOK === r.n && r.bad === 0, `all ${r.n} stumbles and falls: the chest turns with a push from either side (${r.twOK}/${r.n}) and pitches with one from the front or behind (${r.backOK}/${r.n}); no bad numbers`);
ok(r.lagOK === r.n && r.legOK === r.n, `the hips follow the chest a beat later (${r.lagOK}/${r.n}) and the two legs do different things (${r.legOK}/${r.n})`);
ok(r.bounceOK === 5 && r.settle === 5 && r.endOK === r.n, `on the floor: one bounce (${r.bounceOK}/5), a different settle each time (${r.settle}/5), and he is back in the normal pose when he gets up (${r.endOK}/${r.n})`);
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 'j2'), P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team); var g = 0; while (M.phase !== 'live' && g++ < 600) window.__tick(1); const res = [];
  for (const side of [1, -1]) { for (const q of M.P) { q.ai.tick = 99; q.st = 'free'; q.y = 0; q.x = 7; q.z = 11 + q.i; } M.phase = 'live'; M.brawl = null; d.x = 0; d.z = 6; d.face = 0; me.x = side * 0.8; me.z = 6; me.face = Math.atan2(d.x - me.x, d.z - me.z); d.st = 'free'; d.stg = null; P.call('applyHit', me, d, 'punch'); window.__tick(3); res.push(d.stg && d.stg.hit ? +d.stg.hit.tw.toFixed(2) : null); }
  return res; });
ok(r[0] !== null && r[1] !== null && Math.sign(r[0]) === -Math.sign(r[1]) && Math.abs(r[0]) > 0.5, `in a game, a punch from his left and from his right twist him opposite ways (${r.join(' and ')})`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
