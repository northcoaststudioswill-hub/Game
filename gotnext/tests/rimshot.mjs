// Close-up of the rim from the side: a made jumper, a rattle-in and a miss, frame by frame. node tests/rimshot.mjs <outdir>
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || path.join(dir, 'shots', 'rimshot'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.uiClose(); });
await p.evaluate(() => { const P = __pit; P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); document.querySelectorAll('#hud, #keys').forEach(e => e.style.display = 'none'); });
for (const [kind, make, rattle] of [['make', true, false], ['rattle', true, true], ['miss', false, false]]) {
  await p.evaluate(([make, rattle]) => { const P = __pit, M = P.MT, me = M.me; for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; } M.phase = 'live'; M.B.state = 'held'; M.B.holder = me; me.x = 0.6; me.z = 6.2; me.st = 'free'; window.__tick(5);
    const B = M.B; B.pos.set(me.x, 2.6, me.z); B.sx = me.x; B.sz = me.z; B.err = make ? 0 : -0.2; P.ev('Math.__r = Math.random'); if (rattle) P.ev('Math.random = () => 0.1'); else if (make) P.ev('Math.random = () => 0.9');
    P.call('launch', me, make, 1, false, 1, 'mid'); B.green = false; window.__lt = B.T; P.ev('Math.random = Math.__r'); }, [make, rattle]);
  const T = await p.evaluate(() => window.__lt);
  for (let i = 0; i < 22; i++) { await p.evaluate(([i, T]) => { const P = __pit; window.__tick(i === 0 ? Math.round((T - 0.25) * 60) : 2); const cam = P.ev('camera'); cam.position.set(2.2, 3.1, 0.6); cam.lookAt(0, 2.95, 0); cam.fov = 40; cam.updateProjectionMatrix(); P.ev('renderer.render(scene, camera)'); }, [i, T]); await p.screenshot({ path: path.join(out, `${kind}-${String(i).padStart(2, '0')}.png`), clip: { x: 170, y: 90, width: 300, height: 300 } }); }
  await p.evaluate(() => window.__tick(90));
}
await b.close();
