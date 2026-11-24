// How smooth is a sprint? Same measure on The Block and on a court: node tests/runfeel.mjs [file.html]
// jitter = mean |second difference| per frame of hip and knee angles (rad) and body height (cm); slide = planted foot speed
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + file); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const measure = where => p.evaluate(where => {
  const P = __pit; P.uiClose(); const V = new THREE.Vector3(), rows = [];
  if (where === 'block') { P.enterWorld('hub', -10, 0, Math.PI / 2); window.__tick(20); } else { P.startPractice('free'); window.__tick(150); const M = P.MT; M.phase = 'live'; M.me.x = -7; M.me.z = 9; M.B.holder = null; M.B.state = 'loose'; M.B.pos.set(7, 0.2, 12); }
  for (let i = 0; i < 150; i++) {
    const K = P.keys; for (const k in K) K[k] = false; K.KeyD = true; K.ShiftLeft = true; if (where === 'block') P.W.yaw = Math.PI / 2; window.__tick(1);
    const R = where === 'block' ? P.W.me.rig : P.MT.me.rig, J = R.joints; if (i < 40) continue; const f = {}; for (const s of ['R', 'L']) { J['an' + s].getWorldPosition(V); f[s] = [V.x, V.y, V.z]; }
    J.hips.getWorldPosition(V); rows.push({ h: J.hpR.rotation.x, k: J.knR.rotation.x, y: V.y, x: V.x, z: V.z, f });
  }
  return rows;
}, where);
for (const w of ['block', 'court']) {
  const r = await measure(w), j = key => { let s = 0; for (let i = 2; i < r.length; i++) s += Math.abs(r[i][key] - 2 * r[i - 1][key] + r[i - 2][key]); return s / (r.length - 2); };
  const sl = []; for (let i = 1; i < r.length; i++) { const lo = r[i].f.R[1] < r[i].f.L[1] ? 'R' : 'L'; if (r[i].f[lo][1] < 0.09) sl.push(Math.hypot(r[i].f[lo][0] - r[i - 1].f[lo][0], r[i].f[lo][2] - r[i - 1].f[lo][2]) * 60); }
  sl.sort((a, b) => a - b); const sp = Math.hypot(r[r.length - 1].x - r[0].x, r[r.length - 1].z - r[0].z) / (r.length / 60);
  console.log(`${w.padEnd(6)} sprint ${sp.toFixed(1)} m/s · jitter hip ${j('h').toFixed(3)} knee ${j('k').toFixed(3)} rad, body ${(j('y') * 100).toFixed(2)} cm · planted foot p50 ${sl[sl.length >> 1].toFixed(2)} m/s`);
}
await b.close();
