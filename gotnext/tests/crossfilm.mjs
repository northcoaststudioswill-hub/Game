// Close-up film of quick crossovers with left-right stick, from behind and above. node tests/crossfilm.mjs <outdir>
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || path.join(dir, 'shots', 'crossfilm'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(40); const M = P.MT, me = M.me; M.phase = 'live'; M.clock = 99; M.needClear = false; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.x = 0; me.z = 9; for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; } window.__tick(20); document.querySelectorAll('#hud, #keys').forEach(e => e.style.display = 'none'); });
const seq = []; for (let i = 0; i < 6; i++) { const L = i % 2 === 0; if (process.env.SEQ === 'run') seq.push([12, ['KeyW', 'ShiftLeft']], [3, ['KeyW', 'ShiftLeft', L ? 'KeyL' : 'KeyJ']], [7, ['KeyW', 'ShiftLeft']]); else seq.push([10, ['KeyW', L ? 'KeyA' : 'KeyD']], [3, ['KeyW', L ? 'KeyA' : 'KeyD', L ? 'KeyL' : 'KeyJ']], [7, ['KeyW', L ? 'KeyA' : 'KeyD']]); }
let n = 0; for (const [frames, keys] of seq) for (let f = 0; f < frames; f++) {
  await p.evaluate((keys) => { const P = __pit, M = P.MT, me = M.me, K = P.keys; for (const c of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyL', 'ShiftLeft']) K[c] = keys.includes(c); window.__tick(1); for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; } if (me.z < 3) me.z = 9;
    const cam = P.ev('camera'); cam.position.set(me.x, 2.6, me.z + 2.6); cam.lookAt(me.x, 0.5, me.z - 0.4); cam.updateProjectionMatrix(); P.ev('renderer.render(scene, camera)'); }, keys);
  if (f % 2 === 0) await p.screenshot({ path: path.join(out, String(++n).padStart(3, '0') + '.png'), clip: { x: 170, y: 60, width: 300, height: 360 } });
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors · ' + n + ' frames'); await b.close();
