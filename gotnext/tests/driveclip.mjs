// Drives with turbo and skill-stick moves straight at a defender: how close do the DRAWN bodies get (chest to chest,
// hips to hips), against how far apart the players stand? Counts frames where the torsos are inside each other.
// node tests/driveclip.mjs [trials]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), N = +(process.argv[2] || 24);
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 400, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const r = await p.evaluate((N) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[2], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team && q.man === me) || M.P.find(q => q.team !== me.team), K = P.keys;
  const V = new THREE.Vector3(), W = new THREE.Vector3(), st = { frames: 0, chestIn: 0, hipIn: 0, worst: 9, byState: {} };
  for (let t = 0; t < N; t++) { for (const q of M.P) if (q !== me && q !== d) { q.x = q.team === me.team ? -7 : 7; q.z = 12; }
    M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.st = 'free'; me.x = (t % 3 - 1) * 0.8; me.z = 8.5; me.vx = me.vz = 0; d.st = 'free'; d.x = me.x * 0.3; d.z = 5.6; d.vx = d.vz = 0; d.man = me; d.aiLvl = 0.8; window.__tick(10);
    const mv = ['KeyJ', 'KeyL', 'KeyK', 'KeyI'][t % 4];
    for (let f = 0; f < 70 && M.B.holder === me; f++) { K.KeyW = true; K.ShiftLeft = true; K.KeyA = f > 20 && t % 2 === 0; K[mv] = f >= 18 && f < 22; window.__tick(1); if (me.y > 0.3 || d.y > 0.3) continue;
      P.ev('scene.updateMatrixWorld()'); st.frames++;
      me.rig.joints.chest.getWorldPosition(V); d.rig.joints.chest.getWorldPosition(W); const dc = Math.hypot(V.x - W.x, V.z - W.z);
      me.rig.joints.hpR.parent.getWorldPosition(V); d.rig.joints.hpR.parent.getWorldPosition(W); const dh = Math.hypot(V.x - W.x, V.z - W.z);
      if (dc < st.worst) st.worst = dc; if (dc < 0.36) { st.chestIn++; const k = me.st + '/' + (me.an || '') + ' vs ' + d.st + '/' + (d.an || ''); st.byState[k] = (st.byState[k] || 0) + 1; } if (dh < 0.3) st.hipIn++; }
    for (const k of ['KeyW', 'KeyA', 'ShiftLeft', mv]) K[k] = false; window.__tick(5); }
  return st; }, N);
console.log(`${N} drives, ${r.frames} frames near the defender: torsos inside each other (chests < 36 cm apart) ${(r.chestIn / Math.max(1, r.frames) * 100).toFixed(1)}% of frames, hips < 30 cm ${(r.hipIn / Math.max(1, r.frames) * 100).toFixed(1)}%, closest chests ${(r.worst * 100).toFixed(0)} cm`);
console.log('when: ' + Object.entries(r.byState).sort((a, c) => c[1] - a[1]).slice(0, 8).map(e => e.join(' ')).join(' · '));
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
