// A thumb held at full push on the phone stick, wobbling a little (88–98%): does the body jerk between walk and run?
// node tests/stickrun.mjs [file.html] → speed swing and leg jitter on The Block
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + file); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const r = await p.evaluate(() => {
  const P = __pit; P.uiClose(); P.enterWorld('hub', -10, 0, Math.PI / 2); window.__tick(20); const rows = []; 
  for (let i = 0; i < 200; i++) { const m = 0.93 + 0.05 * Math.sin(i * 1.7); P.touch.L = { x: 0, y: -m, ox: 0, oy: 0 }; P.W.yaw = Math.PI / 2; window.__tick(1); const me = P.W.me, J = me.rig.joints; if (i > 40) rows.push({ v: Math.hypot(me.vx, me.vz), k: J.knR.rotation.x, h: J.hpR.rotation.x }); }
  P.touch.L = null; return rows;
});
const vs = r.map(x => x.v), j = key => { let s = 0; for (let i = 2; i < r.length; i++) s += Math.abs(r[i][key] - 2 * r[i - 1][key] + r[i - 2][key]); return s / (r.length - 2); };
let flips = 0; for (let i = 1; i < vs.length; i++) if (Math.abs(vs[i] - vs[i - 1]) > 0.3) flips++;
console.log(`thumb at 88–98%: speed ${Math.min(...vs).toFixed(1)}–${Math.max(...vs).toFixed(1)} m/s, big speed jumps ${flips} in ${vs.length} frames, leg jitter hip ${j('h').toFixed(3)} knee ${j('k').toFixed(3)} rad`);
await b.close();
