// Basketball IQ: help-side defence, help the helper, drive reactions off the ball, give and go, punishing a reach. node tests/iq.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
// a 3 v 3 with nobody at the controls; everything frozen except the men being measured
await p.evaluate(() => { const P = __pit; P.uiClose(); P.ev('renderer.render = function () { }');
  window.G3 = (lvl) => { P.uiClose(); if (P.MT) { P.call('quitMatch'); window.__tick(5); P.uiClose(); } P.launchGame(P.MODES.find(m => m.size === 3 && !m.arcade), P.TIERS_COURT[1], { mates: [-1, -1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; let g = 0; while (M.phase !== 'live' && g++ < 900) window.__tick(1);
    for (const q of M.P) { q.aiLvl = lvl; q.stam = 100; } const O = M.P.filter(q => q.team === M.off), D = M.P.filter(q => q.team !== M.off); O.forEach((q, i) => { D[i].man = q; }); return { M, O, D }; };
  // hold the attackers where they are put, keep the clock alive, let the defence think
  window.HOLD = (M, O, pos, n, each) => { for (let i = 0; i < n; i++) { M.clock = 12; M.needClear = false; O.forEach((q, k) => { q.x = pos[k][0]; q.z = pos[k][1]; q.vx = q.vz = 0; q.st = 'free'; q.ai.tick = 9; q.ai.spotT = 9; q.ai.spot = pos[k]; q.ai.mode = ''; q.ai.scr = null; }); for (const q of M.P) { q.cool = 9; q.stam = 100; } if (M.B.holder !== O[0]) { P.call('give', O[0]); } if (each) each(i); window.__tick(1); if (P.MT !== M || M.phase !== 'live') return false; } return true; }; });
let r = await p.evaluate(() => { const out = {}; for (const lvl of [0.9, 0.2]) { const { M, O, D } = G3(lvl); const pos = [[0, 7.6], [5.4, 5.2], [-6.8, 0.8]]; const okRun = HOLD(M, O, pos, 240);
    const d = (a, c) => Math.hypot(a.x - c.x, a.z - c.z), dh = q => Math.hypot(q.x, q.z); out[lvl] = { okRun, one: d(D[1], O[1]), two: d(D[2], O[2]), twoHoop: dh(D[2]), onBall: d(D[0], O[0]) }; } return out; });
ok(r[0.9].okRun && r[0.9].one < 2.0 && r[0.9].two > r[0.9].one + 0.6 && r[0.9].twoHoop < 5.6 && r[0.9].onBall < 1.7, `a good defence: on the ball at ${r[0.9].onBall.toFixed(1)} m, one pass away ${r[0.9].one.toFixed(1)} m off his man, two passes away sunk ${r[0.9].two.toFixed(1)} m off and ${r[0.9].twoHoop.toFixed(1)} m from the rim`);
ok(Math.abs(r[0.2].two - r[0.2].one) < r[0.9].two - r[0.9].one, `a poor defence does not tell the two apart: ${r[0.2].one.toFixed(1)} m and ${r[0.2].two.toFixed(1)} m`);
// help the helper: the ball gets into the paint past its man; one helps, the last man splits the two left open
r = await p.evaluate(() => { const { M, O, D } = G3(0.9); const pos = [[0.6, 2.6], [2.6, 1.6], [-6.4, 4.6]]; D[0].x = 0.5; D[0].z = 6.5; const d = (a, c) => Math.hypot(a.x - c.x, a.z - c.z);
  const okRun = HOLD(M, O, pos, 150, () => { D[0].x = 0.5; D[0].z = 6.5; D[0].vx = D[0].vz = 0; }); const helper = D[1], last = D[2];
  return { okRun, helping: !!helper.ai.helping, helperToBall: d(helper, O[0]), lastToOwn: d(last, O[2]), lastToOther: d(last, O[1]), between: last.x > O[2].x + 1.2 }; });
ok(r.okRun && r.helping && r.helperToBall < 2.0 && r.between && r.lastToOwn > 1.6, `help the helper: one defender steps to the ball (${r.helperToBall.toFixed(1)} m), the last man leaves his own by ${r.lastToOwn.toFixed(1)} m to sit between the two left open`);
// the ball drives: the men off the ball clear out to a window the driver can see
r = await p.evaluate(() => { const P = __pit, { M, O, D } = G3(0.8); const h = O[0]; let seen = 0, n = 0, clog = 0;
  for (let t = 0; t < 12; t++) { h.x = (t % 2 ? 2 : -2); h.z = 7.2; h.vx = h.vz = 0; h.st = 'free'; O[1].x = 2.2; O[1].z = 3.2; O[2].x = -2.4; O[2].z = 3.0; for (const q of O) q.ai.spotT = 0.01; if (M.B.holder !== h) P.call('give', h);
    for (let i = 0; i < 45; i++) { M.clock = 12; M.needClear = false; h.ai.mode = 'drive'; h.ai.tick = 9; h.st = 'free'; h.x += (0 - h.x) * 0.02; h.z += (4.4 - h.z) * 0.03; for (const q of M.P) q.cool = 9; if (M.B.holder !== h) P.call('give', h); window.__tick(1); if (P.MT !== M) return { dead: 1 }; }
    for (const q of [O[1], O[2]]) { n++; if (P.call('passLane', h, { x: q.ai.spot[0], z: q.ai.spot[1] })) seen++; if (Math.hypot(q.ai.spot[0], q.ai.spot[1]) < 3.4 && !q.ai.cut) clog++; } }
  return { seen, n, clog }; });
ok(!r.dead && r.seen / r.n > 0.7 && r.clog === 0, `on a drive the others pick a spot the driver can pass to ${r.seen} times in ${r.n}, and nobody stands in the lane`);
// give and go, and it never happens when the game says clear it first
r = await p.evaluate(() => { const P = __pit, { M, O, D } = G3(0.9); let cuts = 0, n = 0, calls = 0;
  for (let t = 0; t < 60; t++) { const a = O[0], c = O[1]; a.x = 0; a.z = 7.4; c.x = 5.6; c.z = 5.2; O[2].x = -6.8; O[2].z = 0.8; for (const q of D) { q.x = q.man.x * 1.25 + 2.5; q.z = q.man.z + 1; } for (const q of O) { q.st = 'free'; q.ai.cut = false; q.callT = 0; } M.phase = 'live'; M.needClear = false; P.call('give', a); P.call('doPass', a, c); n++; if (a.ai.cut) cuts++; if (a.callT > 0) calls++; M.B.state = 'held'; }
  M.needClear = true; let bad = 0; for (let t = 0; t < 30; t++) { const a = O[0], c = O[1]; a.x = 0; a.z = 7.4; a.st = 'free'; a.ai.cut = false; P.call('give', a); P.call('doPass', a, c); if (a.ai.cut) bad++; M.B.state = 'held'; } return { cuts, n, calls, bad }; });
ok(r.cuts > 8 && r.cuts < 40 && r.bad === 0, `give and go: a good passer cuts behind his pass ${r.cuts} times in ${r.n} when the lane is there, never before the ball is cleared`);
// reach and miss on an AI handler: he goes
r = await p.evaluate(() => { const P = __pit; let went = 0, n = 0; const { M, O, D } = G3(0.9);
  for (let t = 0; t < 30; t++) { const h = O[0], d = D[0]; h.x = 0; h.z = 7.2; h.vx = h.vz = 0; h.st = 'free'; h.live = 'drib'; h.ai.mode = ''; h.ai.postT = 0; h.ai.hold = 0; d.x = 0; d.z = 6.2; d.st = 'free'; d.cool = 0; O[1].x = 6.6; O[1].z = 1; O[2].x = -6.6; O[2].z = 1; D[1].x = 6; D[1].z = 1; D[2].x = -6; D[2].z = 1; M.clock = 12; M.needClear = false; M.phase = 'live'; if (M.B.holder !== h) P.call('give', h);
    h.reachBy = d; h.reachAt = M.time + t; h.reachSaw = true; d.st = 'steal'; d.t = 0.05; d.stealDone = true; h.ai.tick = 0; n++; P.call('aiThink', h, 1 / 60); if (h.ai.mode === 'drive') went++; d.st = 'free'; }
  return { went, n }; });
ok(r.went / r.n > 0.5, `a missed reach gets punished: the handler attacks ${r.went} times in ${r.n}`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
