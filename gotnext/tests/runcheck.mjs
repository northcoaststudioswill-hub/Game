// The run on The Block, measured against a real runner: node tests/runcheck.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + file); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.enterWorld('hub', -12, 0, Math.PI / 2); window.__tick(20); const V = new THREE.Vector3(), rows = [];
  for (let i = 0; i < 220; i++) { const K = P.keys; for (const k in K) K[k] = false; K.KeyW = true; K.ShiftLeft = true; P.W.yaw = Math.PI / 2; window.__tick(1); if (Math.abs(P.W.me.x) > 13.2) { P.W.me.x = -Math.sign(P.W.me.x) * 12; P.W.me.rig.lock = null; } if (i < 60) continue; const me = P.W.me, J = me.rig.joints, f = {}; for (const s of ['R', 'L']) { J['an' + s].getWorldPosition(V); f[s] = [V.x, V.y, V.z]; } J.hips.getWorldPosition(V); rows.push({ f, y: V.y, x: me.x, z: me.z, kn: Math.max(J.knR.rotation.x, 0), psi: me.rig.loco.psi }); }
  return rows; });
const dt = 1 / 60, G = 0.085, D = 0.28; let air = 0, strikes = 0, slide = [];
// stance by the stride clock: each foot is on the ground for the first 29% of its cycle at a sprint (flat part: 10-80% of that)
for (let i = 1; i < r.length; i++) { const a = r[i], q = r[i - 1]; if (a.psi < q.psi) strikes += 2; let st = 0; for (const [s, off] of [['R', 0], ['L', 0.5]]) { const u = (a.psi + off) % 1; if (u < D) st++; if (u > D * 0.1 && u < D * 0.8 && Math.abs(a.x - q.x) < 1) slide.push(Math.hypot(a.f[s][0] - q.f[s][0], a.f[s][2] - q.f[s][2]) / dt); } if (!st) air++; }
slide.sort((x, y) => x - y); const secs = r.length / 60, ys = r.map(x => x.y), kn = Math.max(...r.map(x => x.kn)) * 180 / Math.PI, v = r.filter((x, i) => i && Math.abs(x.x - r[i - 1].x) < 1).reduce((s, x, i, arr) => s, 0);
let dist = 0; for (let i = 1; i < r.length; i++) { const d = Math.hypot(r[i].x - r[i - 1].x, r[i].z - r[i - 1].z); if (d < 1) dist += d; }
console.log(`sprint ${(dist / secs).toFixed(1)} m/s: ${(strikes / secs).toFixed(1)} steps/s, both feet off the ground ${(air / r.length * 100).toFixed(0)}% of the time, peak knee bend ${kn.toFixed(0)}°, body bounce ${((Math.max(...ys) - Math.min(...ys)) * 100).toFixed(1)} cm, planted foot slide median ${slide[slide.length >> 1].toFixed(2)} / p90 ${slide[Math.floor(slide.length * 0.9)].toFixed(2)} m/s`);
await b.close();
