// Films the Dev Room reel (every dunk, layup, jumper variation and dribble move) through the real game:
// node tests/reel.mjs <dunks|layups|jumpers|handles> [file.html]. Writes tests/shots/reel-<group>-<n>-<frame>.png and prints what each entry did.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const grp = process.argv[2] || 'dunks', file = path.resolve(process.argv[3] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 300, height: 340 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = (n, ms) => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERR', e.message); });
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10, 16.67));
const n = await page.evaluate(([g, back]) => { window.__back = back; const P = __pit; for (const k in P.keys) P.keys[k] = false; P.devMax(); P.devReel(g); window.__tick(10, 16.67); const st = document.createElement('style'); st.textContent = '#call,#toasts,#hud,#fb,.flt,#prompt,#hint{display:none!important}'; document.head.appendChild(st);
  window.__camFn = cam => { const me = __pit.MT.me; if (window.__back) { cam.position.set(me.x * 0.6 + 1.2, 2.2, me.z + 3.6); if (cam.fov !== 50) { cam.fov = 50; cam.updateProjectionMatrix(); } return [me.x * 0.5, 1.7, me.z * 0.4]; } cam.position.set(me.x + 4.4, 1.7 + me.y * 0.6, me.z + 0.3); if (cam.fov !== 42) { cam.fov = 42; cam.updateProjectionMatrix(); } return [me.x, 1.25 + me.y * 0.8, me.z - 0.2]; };
  return P.MT.reel.list.length; }, [grp, !!process.env.BACK]);
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const log = [];
for (let e = 0; e < n; e++) {
  // wait for this entry's action, then film it
  let info = null;
  for (let i = 0; i < 600; i++) { info = await page.evaluate(() => { window.__tick(1, 16.67); const M = __pit.MT, R = M.reel; return { i: R.i, ph: R.ph }; }); if (info.i === e && info.ph === 'act') break; }
  let f = 0, maxY = 0; const seen = new Set(); let what = ''; const res0 = await page.evaluate(() => { const st = __pit.MT.me.stats; return st.fgm + '/' + st.fga + '/' + (__pit.MT.P[1] ? __pit.MT.P[1].stats.blk : 0); });
  for (let k = 0; k < 96; k++) {
    const s = await page.evaluate(() => { window.__tick(1, 16.67); const M = __pit.MT, me = M.me, R = M.reel, df = R.def; return { dj: df ? df.st : '', blk: M.B.state,  st: me.st, y: me.y, an: me.an, kind: me.finish ? (me.finish.type === 'dunk' ? me.finish.style : me.finish.kind) : '', fade: me.shot ? me.shot.fade : 0, side: me.shot ? me.shot.side : 0, mv: me.mv ? me.mv.mv.id : '', i: R.i, B: M.B.state, ex: +(me.rig.extraYaw || 0).toFixed(2) }; });
    if (s.i !== e) break; maxY = Math.max(maxY, s.y); if (s.dj === 'jump') seen.add('D:jump'); seen.add(s.st + (s.st === 'finish' ? ':' + s.kind : s.st === 'shoot' ? (s.fade ? ':fade' : s.side ? ':side' : '') : s.st === 'move' ? ':' + s.mv : '')); what = s.B;
    if (k % 4 === 0 && f < 24) fs.writeFileSync(path.join(dir, 'shots', `reel-${grp}${process.env.BACK ? 'B' : ''}-${String(e).padStart(2, '0')}-${String(f++).padStart(2, '0')}.png`), await page.screenshot());
  }
  const name = await page.evaluate(e => __pit.MT.reel.list[e].n, e);
  const res1 = await page.evaluate(() => { const st = __pit.MT.me.stats; return st.fgm + '/' + st.fga + '/' + (__pit.MT.P[1] ? __pit.MT.P[1].stats.blk : 0); });
  log.push(`${String(e + 1).padStart(2)} ${name.padEnd(22)} fgm/fga/blk ${res0}->${res1} states ${[...seen].join(' > ')} · top ${maxY.toFixed(2)} m`);
}
console.log(log.join('\n')); console.log(errs.length ? errs.length + ' ERRORS' : 'NO ERRORS'); await browser.close();
