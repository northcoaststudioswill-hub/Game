// Filmstrips of real gameplay from a fixed side camera: node tests/strip.mjs <name> [file.html]
// Writes tests/shots/strip-<name>.png. Scenarios: run (sprint, reverse), drib (dribble + crossover), shot (pull-up), def (slide + contest)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const name = process.argv[2] || 'run', file = path.resolve(process.argv[3] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 260, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = (n, ms) => {
    // works on any build, old ones included: the game aims its camera with lookAt every frame; while __camFn is set,
    // that call is redirected to our side-on view, and the game then renders its own frame from there
    if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); page.on('pageerror', e => console.log('ERR', e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10, 16.67));
const SC = {
  run: { setup: 'free', frames: [[24, ['KeyD', 'ShiftLeft']], [30, ['KeyA', 'ShiftLeft']]], every: 3 },
  sprint: { setup: 'free', frames: [[76, ['KeyD', 'ShiftLeft']]], every: 2 },
  drib: { setup: 'free', frames: [[18, ['KeyD']], [2, ['KeyD', 'KeyJ']], [22, ['KeyD']], [2, ['KeyD', 'KeyL']], [16, ['KeyD']]], every: 3 },
  shot: { setup: 'free', frames: [[16, ['KeyD', 'ShiftLeft']], [34, ['Space']], [24, []]], every: 3 },
  def: { setup: 'game', frames: [[20, ['KeyD']], [20, ['KeyA']], [14, ['KeyA', 'KeyI']]], every: 3 },
};
const sc = SC[name]; const shots = [];
await page.evaluate(n => { if (n === 'sprint') window.__sx = -7.5; const st = document.createElement('style'); st.textContent = '#toasts,#call,#fb{display:none!important}'; document.head.appendChild(st); }, name);
await page.evaluate(setup => {
  const P = __pit; for (const k in P.keys) P.keys[k] = false;
  if (setup === 'free') P.startPractice('free'); else P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' });
  window.__tick(170, 16.67); const M = P.MT, me = M.me; me.x = (window.__sx === undefined ? -3 : window.__sx); me.z = 7; me.face = Math.PI / 2; me.vx = me.vz = 0; M.phase = 'live';
  if (setup === 'game') { const o = M.P.find(p => p.team !== me.team); M.B.holder = o; M.B.state = 'held'; M.off = o.team; o.x = -1; o.z = 4.4; o.face = Math.PI; o.ai.tick = 99; o.aiLvl = 0; M.P.forEach(p => { if (p !== me && p !== o) { p.x = 7; p.z = 12; } }); }
  window.__tick(20, 16.67);
  // a side-on camera that follows the player, instead of the game camera
  window.__camFn = cam => { const me = __pit.MT.me; cam.position.set(me.x, 1.1, me.z + 5.2); if (cam.fov !== 40) { cam.fov = 40; cam.updateProjectionMatrix(); } return [me.x, 0.95, me.z]; };
}, sc.setup);
let fi = 0;
for (const [n, keys] of sc.frames) {
  for (let i = 0; i < n; i++) {
    await page.evaluate(keys => { const K = __pit.keys; for (const k in K) K[k] = false; for (const k of keys) K[k] = true; window.__tick(1, 16.67); }, keys);
    if (fi++ % sc.every === 0) shots.push(await page.screenshot());
  }
}
const sharp = (await import('module')).createRequire(import.meta.url);
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); shots.forEach((b, i) => fs.writeFileSync(path.join(dir, 'shots', `strip-${name}${process.env.TAG || ''}-${String(i).padStart(2, '0')}.png`), b));
console.log(name, shots.length, 'frames'); await browser.close();
