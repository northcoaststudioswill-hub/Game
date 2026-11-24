// Side-on filmstrip of walking and running on The Block (the hub): node tests/hubstrip.mjs [tag] [file.html]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const tag = process.argv[2] || 'now', file = path.resolve(process.argv[3] || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 220, height: 280 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = (n, ms) => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); page.on('pageerror', e => console.log('ERR', e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10, 16.67));
await page.evaluate(() => { const P = __pit; P.uiClose && P.uiClose(); P.enterWorld('hub', -11, 0.5, Math.PI / 2); window.__tick(20, 16.67); const W = P.W; W.yaw = Math.PI / 2; for (const n of W.npcs) { n.rig.root.visible = false; if (n.ball) n.ball.visible = false; } document.getElementById('toasts').style.display = 'none';   // camera looks along +x, so W walks the player toward +x
  window.__camFn = cam => { const me = __pit.W.me; cam.position.set(me.x, 1.0, me.z + 4.6); if (cam.fov !== 40) { cam.fov = 40; cam.updateProjectionMatrix(); } return [me.x, 0.95, me.z]; }; });
const shots = [];
for (const [n, keys] of [[72, ['KeyW']], [24, ['KeyW', 'ShiftLeft']], [12, []]]) for (let i = 0; i < n; i++) {
  await page.evaluate(keys => { const K = __pit.keys; for (const k in K) K[k] = false; for (const k of keys) K[k] = true; __pit.W.yaw = Math.PI / 2; window.__tick(1, 16.67); }, keys);
  if (i % 3 === 0) shots.push(await page.screenshot());
}
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); shots.forEach((b, i) => fs.writeFileSync(path.join(dir, 'shots', `hub-${tag}-${String(i).padStart(2, '0')}.png`), b));
console.log(tag, shots.length); await browser.close();
