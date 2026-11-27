// Side-on film of a contested finish at the rim: a driver from the wing, a defender waiting at the rim who jumps.
// node tests/rimfilm.mjs <outdir> [run index]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || path.join(dir, 'shots', 'rimfilm'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
const info = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[2], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team);
  for (const q of M.P) if (q !== me && q !== d) { q.x = q.team === me.team ? -7 : 7; q.z = 12; q.ai.react = 99; }
  M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.x = 1.9; me.z = 2.6; me.face = Math.atan2(-me.x, -me.z); d.x = 0.35; d.z = 0.9; d.aiLvl = 0.9; d.man = me; window.__tick(2);
  document.querySelectorAll('#hud, #keys').forEach(e => e.style.display = 'none'); const K = P.keys; K.KeyW = true; K.ShiftLeft = true; window.__tick(8); K.KeyW = false; K.ShiftLeft = false; P.call('startFinish', me, 0); return { st: me.st, kind: me.finish && (me.finish.type + '/' + me.finish.style) }; });
let jumped = false; for (let i = 0; i < 20; i++) { jumped = (await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; window.__tick(3); window.__j = window.__j || M.P.some(q => q.team !== me.team && q.st === 'jump'); const cam = P.ev('camera'); cam.position.set(4.6, 1.7, 1.2); cam.lookAt(0.3, 1.7, 1.0); cam.updateProjectionMatrix(); P.ev('renderer.render(scene, camera)'); return window.__j; })) || jumped; await p.screenshot({ path: path.join(out, String(i).padStart(2, '0') + '.png'), clip: { x: 120, y: 20, width: 400, height: 440 } }); }
console.log(JSON.stringify(info), 'defender jumped: ' + jumped, errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
