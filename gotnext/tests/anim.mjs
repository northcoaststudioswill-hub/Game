// Animation blending, profiles and the ANIM LAB. node tests/anim.mjs → tests/shots/anim-*.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
// 1. blending: pure styles differ, a 50/50 blend sits between them, the traditional style is the original jumper
let r = await p.evaluate(() => { const P = __pit, prof = w => Object.assign(JSON.parse(JSON.stringify(P.profileFromBuild({ name: 'A', build: { style: 'sniper', body: { h: 77 } } }))), { shot: w, knee: 1, elbow: 0, lean: 0, stance: 1, follow: 1, shoulder: 0, hand: 'R' });
  const T = P.shotPose(prof({ trad: 1, high: 0, quick: 0 }), 0.9), H = P.shotPose(prof({ trad: 0, high: 1, quick: 0 }), 0.9), M = P.shotPose(prof({ trad: 0.5, high: 0.5, quick: 0 }), 0.9);
  return { tSh: +T.shR[0].toFixed(2), hSh: +H.shR[0].toFixed(2), mSh: +M.shR[0].toFixed(2), tEl: +T.elR[0].toFixed(2), hEl: +H.elR[0].toFixed(2), mEl: +M.elR[0].toFixed(2) }; });
ok(Math.abs(r.tSh + 2.55) < 0.02 && r.hSh < r.tSh - 0.2 && r.mSh < r.tSh && r.mSh > r.hSh && r.mEl > Math.min(r.tEl, r.hEl) && r.mEl < Math.max(r.tEl, r.hEl), `set point: traditional shoulder ${r.tSh} (the original jumper's -2.55), high release ${r.hSh}, 50/50 blend ${r.mSh}; elbow ${r.tEl} / ${r.hEl} / ${r.mEl}`);
// 2. profiles are persistent: the same player always gets the same one; different players differ
r = await p.evaluate(() => { const P = __pit, s1 = P.aiBuild(80, 'glass'), a = JSON.stringify(P.profileFromBuild(s1)), b2 = JSON.stringify(P.profileFromBuild(JSON.parse(JSON.stringify(s1)))), c = P.profileFromBuild(P.aiBuild(80, 'slasher'));
  const g = P.profileFromBuild(s1); return { same: a === b2, gShot: g.shot, sShot: c.shot }; });
ok(r.same && r.gShot.high > r.sShot.high && r.sShot.quick > r.gShot.quick, `same player, same profile: ${r.same}; a big leans high release (${r.gShot.high.toFixed(2)}), a slasher quick (${r.sShot.quick.toFixed(2)})`);
// 3. phases are synced: every style releases at u = 1 (the arm is at its highest extension around the release)
r = await p.evaluate(() => { const P = __pit, out = {}; for (const st of ['trad', 'high', 'quick']) { const pr = Object.assign(P.profileFromBuild({ name: 'B', build: { style: 'sniper', body: { h: 77 } } }), { shot: { trad: 0, high: 0, quick: 0 }, hand: 'R' }); pr.shot[st] = 1;
  let best = 0, bu = 0; for (let u = 0.5; u <= 1.3; u += 0.02) { const q = P.shotPose(pr, u); const ext = -q.shR[0] - Math.abs(q.elR[0]) * 0.6; if (ext > best) { best = ext; bu = u; } } out[st] = +bu.toFixed(2); } return out; });
ok(Object.values(r).every(u => u >= 0.95 && u <= 1.2), `arm reaches full extension at the release beat for every style: u ${JSON.stringify(r)}`);
// 4. in a game: two players' shots look different but release at the same moment for the same jumper
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200);
  const M = P.MT, a = M.P[0], o = M.P[2]; const res = {};
  for (const [k, q, prof] of [['hi', a, { trad: 0, high: 1, quick: 0 }], ['qk', a, { trad: 0, high: 0, quick: 1 }]]) {
    M.phase = 'live'; M.needClear = false; M.clock = 14; for (const z of M.P) { z.st = 'free'; z.y = 0; if (z.ai) z.ai.tick = 999; z.x = 6; z.z = 10; } q.x = 0; q.z = 5; q.face = Math.PI; M.B.state = 'held'; M.B.holder = q; M.off = q.team; q.live = 'hold';
    q.rig.prof = Object.assign({}, q.rig.prof, { shot: prof, hand: 'R' }); window.__tick(10); P.startShot(q, 'ai'); q.shot.aiRel = q.shot.rel; let rel = -1, sh = null;
    for (let i = 0; i < 80; i++) { window.__tick(1); if (q.t > q.shot.rel * 0.9 && !sh) sh = q.rig.cur.shR[0]; if (q.shot.released && rel < 0) rel = q.t; } res[k] = { rel: +rel.toFixed(3), sh: +sh.toFixed(2) }; }
  return res; });
ok(Math.abs(r.hi.rel - r.qk.rel) < 0.02 && Math.abs(r.hi.sh - r.qk.sh) > 0.15, `in a game: high-release shoulder ${r.hi.sh}, quick-release ${r.qk.sh}; both released at ${r.hi.rel} / ${r.qk.rel} s (gameplay timing untouched)`);
// 5. a lefty shoots out of the left hand: the ball goes up in it
r = await p.evaluate(() => { const P = __pit, M = P.MT, q = M.P[0]; M.phase = 'live'; for (const z of M.P) z.st = 'free'; q.st = 'free'; M.B.state = 'held'; M.B.holder = q; q.live = 'hold'; q.rig.prof = Object.assign({}, q.rig.prof, { hand: 'L' }); window.__tick(5); P.startShot(q, 'ai'); q.shot.aiRel = 9;
  for (let i = 0; i < Math.round(q.shot.rel * 0.9 * 60); i++) window.__tick(1); const V = M.B.pos.constructor, hl = q.rig.handL.getWorldPosition(new V()), hr = q.rig.handR.getWorldPosition(new V()); const dl = hl.distanceTo(M.B.pos), dr = hr.distanceTo(M.B.pos); q.st = 'free'; q.rig.prof.hand = 'R'; return { dl: +dl.toFixed(2), dr: +dr.toFixed(2), lh: +hl.y.toFixed(2), rh: +hr.y.toFixed(2) }; });
ok(r.dl < r.dr && r.lh > r.rh, `lefty at the set point: ball ${r.dl} m from the left hand, ${r.dr} m from the right; left hand higher (${r.lh} vs ${r.rh})`);
// 5b. a saved profile travels: build code and online packing keep it (clamped)
r = await p.evaluate(() => { const P = __pit, S = P.S; S.anim = Object.assign(P.profileFromBuild(P.myBuild()), { hand: 'L', knee: 1.3, shot: { trad: 0.1, high: 0.2, quick: 0.7 } }); const back = P.unpackBuild(JSON.parse(JSON.stringify(P.packBuild(P.myBuild())))); S.anim = null;
  return { hand: back.anim && back.anim.hand, knee: back.anim && back.anim.knee, q: back.anim && +back.anim.shot.quick.toFixed(2), bytes: JSON.stringify(P.packBuild(P.myBuild())).length }; });
ok(r.hand === 'L' && r.knee === 1.3 && r.q === 0.7, `profile survives online packing: hand ${r.hand}, knee ${r.knee}, quick ${r.q}`);
// 6. cost: animating a 2v2 for 300 frames
r = await p.evaluate(() => { const t0 = performance.now(); window.__tick(300); return +((performance.now() - t0) / 300).toFixed(2); }); ok(r < 40, `a frame of a 2v2 (sim + animation + render, software GL) takes ${r} ms`);
// 7. ANIM LAB: opens, two players side by side; screenshots at four phases of the shot
await p.evaluate(() => { const P = __pit; if (P.MT) { P.MT.cfg.onEnd = () => {}; } document.querySelectorAll('#hud, .hud').forEach(e => e.style.display = 'none'); window.__tick(2); P.uiDev('title'); window.__tick(3); P.alabOpen(); window.__tick(3);
  const A = P.ALAB; A.ai = A.cast.findIndex(c => c.n.startsWith('Glass')); A.bi = A.cast.findIndex(c => c.n.startsWith('Slasher')); window.alabPick && 0; });
await p.evaluate(() => { const A = __pit.ALAB; window.alabPick ? 0 : 0; });
await p.evaluate(() => { const A = __pit.ALAB; A.act = 'shoot'; A.paused = true; A.ball = true; });
await p.evaluate(() => alabPick('ai', __pit.ALAB.ai));
for (const [n, u] of [['dip', 0.4], ['set', 0.9], ['follow', 1.12], ['land', 1.45]]) { await p.evaluate(u => { const A = __pit.ALAB; A.t = u * 0.6 - 0.25; for (let i = 0; i < 15; i++) { A.step = 1 / 60; window.__tick(1); } }, u); await p.screenshot({ path: path.join(dir, 'shots', `anim-${n}.png`) }); }
r = await p.evaluate(() => { const A = __pit.ALAB; return { a: A.a.c.n, b: A.b.c.n, an: A.a.an, panel: !!document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent }; });
ok(r.panel === 'ANIM LAB' && r.an === 'shoot', `ANIM LAB open: ${r.a} vs ${r.b}, showing ${r.an}`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
