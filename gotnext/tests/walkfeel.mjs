// The walk on The Block, measured: node tests/walkfeel.mjs [file.html]
// cadence (steps/s), step length, how far the standing foot slides, how much the body bobs, and the trunk lean
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + file); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const r = await p.evaluate(() => {
  const P = __pit; P.uiClose(); P.enterWorld('hub', 0, 10, Math.PI); window.__tick(20); const V = new THREE.Vector3(), rows = [];
  for (let i = 0; i < 240; i++) { P.keys.KeyW = true; window.__tick(1); if (i < 60) continue; const R = P.W.me.rig, J = R.joints; const f = {}; for (const s of ['R', 'L']) { J['an' + s].getWorldPosition(V); f[s] = [V.x, V.y, V.z]; } J.neck.getWorldPosition(V); const nk = [V.x, V.y, V.z]; J.hips.getWorldPosition(V); rows.push({ f, hip: [V.x, V.y, V.z], nk, x: P.W.me.x, z: P.W.me.z, psi: R.loco ? R.loco.psi : -1 }); }
  P.keys.KeyW = false; return rows;
});
const dt = 1 / 60; let slip = [], strikes = 0, last = null, stepLens = [], prevLow = null;
for (let i = 1; i < r.length; i++) {
  const low = r[i].f.R[1] < r[i].f.L[1] ? 'R' : 'L';
  if (low === (r[i - 1].f.R[1] < r[i - 1].f.L[1] ? 'R' : 'L')) { const a = r[i].f[low], b = r[i - 1].f[low]; slip.push(Math.hypot(a[0] - b[0], a[2] - b[2]) / dt); }
  else { strikes++; if (prevLow) stepLens.push(Math.hypot(r[i].f[low][0] - prevLow[0], r[i].f[low][2] - prevLow[2])); prevLow = r[i].f[low]; }
}
const flat = []; if (r[0].psi >= 0) for (let i = 1; i < r.length; i++) for (const [s, off] of [['R', 0], ['L', 0.5]]) { const u = ((r[i].psi + off) % 1 + 1) % 1; if (u > 0.1 && u < 0.45) { const a = r[i].f[s], b = r[i - 1].f[s]; flat.push(Math.hypot(a[0] - b[0], a[2] - b[2]) / dt); } }
flat.sort((a, b) => a - b);
slip.sort((a, b) => a - b); const q = k => slip[Math.floor(slip.length * k)];
const ys = r.map(s => s.hip[1]), bob = Math.max(...ys) - Math.min(...ys), secs = r.length / 60, speed = Math.hypot(r[r.length - 1].x - r[0].x, r[r.length - 1].z - r[0].z) / secs;
const lean = r.reduce((a, s) => a + Math.atan2(Math.hypot(s.nk[0] - s.hip[0], s.nk[2] - s.hip[2]) * Math.sign((s.nk[2] - s.hip[2]) * -1 || 1), s.nk[1] - s.hip[1]), 0) / r.length * 180 / Math.PI;
stepLens.sort((a, b) => a - b);
console.log(`walking at ${speed.toFixed(2)} m/s: ${(strikes / secs).toFixed(2)} steps/s, step ${stepLens[stepLens.length >> 1].toFixed(2)} m, standing-foot slide median ${q(0.5).toFixed(2)} / p90 ${q(0.9).toFixed(2)} m/s${flat.length ? `, flat-foot slide median ${flat[flat.length >> 1].toFixed(2)} m/s` : ''}, body bob ${(bob * 100).toFixed(1)} cm, trunk lean ${lean.toFixed(1)}° (+ = forward)`);
await b.close();
