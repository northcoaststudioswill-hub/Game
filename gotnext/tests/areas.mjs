// Screenshots of every area from the player's camera and a few wide views: node tests/areas.mjs [tag] [file.html]
// Writes tests/shots/area-<tag>-<view>.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), tag = process.argv[2] || 'now', file = path.resolve(process.argv[3] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 960, height: 560 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = n => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(30));
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#toasts{display:none!important}'; document.head.appendChild(st); __pit.S.homies = __pit.S.homies || []; });
// [name, area, player x, z, yaw, wide camera [x,y,z, lx,ly,lz] or null]
const V = [
  ['hub-walk', 'hub', 0, 9, Math.PI, null], ['hub-north', 'hub', 0, 2, Math.PI, null], ['hub-east', 'hub', 6, 4, -Math.PI / 2, null], ['hub-west', 'hub', -6, 0, Math.PI / 2, null],
  ['hub-wide', 'hub', 0, 9, Math.PI, [14, 14, 22, 0, 1, -2]], ['cages', 'pit', 0, 3.4, Math.PI, null], ['cages-wide', 'pit', 0, 3.4, Math.PI, [12, 10, 12, 0, 1, -4]],
  ['crib', 'crib', 0, 13.5, Math.PI, null], ['crib-wide', 'crib', 0, 13.5, Math.PI, [-16, 14, 26, -4, 0, 6]],
];
for (const [n, area, x, z, yaw, wide] of V) {
  await page.evaluate(([area, x, z, yaw, wide]) => { const P = __pit; P.uiClose(); P.enterWorld(area, x, z, yaw); P.W.yaw = yaw; window.__camFn = wide ? cam => { cam.position.set(wide[0], wide[1], wide[2]); return [wide[3], wide[4], wide[5]]; } : null; window.__tick(90); }, [area, x, z, yaw, wide]);
  fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); await page.screenshot({ path: path.join(dir, 'shots', `area-${tag}-${n}.png`) });
}
console.log(V.length, 'views ·', errs.length ? errs.length + ' ERRORS ' + errs[0] : 'NO ERRORS'); await browser.close();
