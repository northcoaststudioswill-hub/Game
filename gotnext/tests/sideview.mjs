// Side-on close-up of a dribbling run, frame by frame, for a run style: node tests/sideview.mjs <runstyle|natural> [keys] [out]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), rs = process.argv[2] === 'natural' ? '' : (process.argv[2] || ''), keys = (process.argv[3] || 'KeyW,ShiftLeft').split(','), out = process.argv[4] || path.join(dir, 'shots', 'side-' + (process.argv[2] || 'natural')); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
await p.evaluate((pk) => { if (pk) __pit.ev(`packEquip(PACKS.find(q => q.id === '${pk}'))`); }, process.env.PACK || ''); await p.evaluate((rs) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(40); const M = P.MT, me = M.me; M.phase = 'live'; M.clock = 99; M.needClear = false; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.x = -6; me.z = 6; me.face = Math.PI / 2; if (me.rig.prof && rs !== 'pack') me.rig.prof.run = rs; for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; } window.__tick(10); document.querySelectorAll('#hud, #keys, .tag, #names').forEach(e => e.style.display = 'none'); }, rs);
// run across the court (camera-relative D = to the right on screen)
await p.evaluate((keys) => { const K = __pit.keys; for (const k of keys) K[k] = true; window.__tick(40); }, keys.map(k => k === 'KeyW' ? 'KeyD' : k));
for (let i = 0; i < 16; i++) {
  await p.evaluate(() => { window.__tick(3); const P = __pit, M = P.MT, me = M.me; for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; } if (me.x > 5) me.x = -6; const cam = P.ev('camera'); cam.position.set(me.x, 1.05, me.z + 3.6); cam.lookAt(me.x, 0.75, me.z); cam.updateProjectionMatrix(); P.ev('renderer.render(scene, camera)'); });
  await p.screenshot({ path: path.join(out, String(i).padStart(2, '0') + '.png'), clip: { x: 170, y: 40, width: 300, height: 400 } });
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors · ' + out); await b.close();
