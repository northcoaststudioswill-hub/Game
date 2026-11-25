// Bodies inside bodies: AI games, every frame measures how close the drawn chests and heads come, against how close the players stand.
// Counts overlaps by what the two were doing. node tests/overlap.mjs [plan]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const PLAN = (process.argv[2] || 's2,s3,j3').split(',');
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 360 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const tot = { frames: 0, over: 0, byPair: {}, simGap: [], worst: [] };
for (const mode of PLAN) {
  const r = await p.evaluate((mode) => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === mode); P.launchGame(m, P.TIERS_COURT[1], { mates: Array(m.size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) q.aiLvl = 0.75;
    const V = new THREE.Vector3(), W = new THREE.Vector3(), o = { frames: 0, over: 0, byPair: {}, simGap: [], worst: [] }; const lbl = q => q.screen ? 'screen' : q.post ? 'post' : q.box ? 'box' : q.st === 'celeb' ? 'celeb' : q.st;
    for (let f = 0; f < 60 * 240 && P.MT && P.MT.phase !== 'over'; f++) { window.__tick(1); const MM = P.MT; if (!MM) break; o.frames++; P.ev('scene.updateMatrixWorld()');
      for (let i = 0; i < MM.P.length; i++) for (let j = i + 1; j < MM.P.length; j++) { const a = MM.P[i], c = MM.P[j]; if (a.y > 0.3 || c.y > 0.3) continue;
        a.rig.joints.chest.getWorldPosition(V); c.rig.joints.chest.getWorldPosition(W); const dc = Math.hypot(V.x - W.x, V.z - W.z), dy = Math.abs(V.y - W.y); if (dc > 0.42 || dy > 0.5) continue;
        o.over++; const k = [lbl(a), lbl(c)].sort().join('+') + (a.team === c.team ? ' (mates)' : '') + ' ' + MM.phase; o.byPair[k] = (o.byPair[k] || 0) + 1; const ds = Math.hypot(a.x - c.x, a.z - c.z); o.simGap.push(+ds.toFixed(2)); if (o.worst.length < 12 && dc < 0.34) o.worst.push(k + ' chest ' + dc.toFixed(2) + ' m, standing ' + ds.toFixed(2) + ' m'); } }
    P.call('quitMatch'); window.__tick(5); P.uiClose(); return o; }, mode);
  tot.frames += r.frames; tot.over += r.over; for (const k in r.byPair) tot.byPair[k] = (tot.byPair[k] || 0) + r.byPair[k]; tot.simGap.push(...r.simGap); tot.worst.push(...r.worst); console.log(mode + ': ' + r.frames + ' frames, ' + r.over + ' pair-frames with chests inside 42 cm');
}
const g = tot.simGap.sort((a, c) => a - c), q = f => g.length ? g[Math.floor(g.length * f)] : '-';
console.log('\nOVERLAPS ' + tot.over + ' pair-frames in ' + tot.frames + ' frames (' + (tot.over / Math.max(1, tot.frames) * 60).toFixed(1) + ' per second)');
console.log('while standing apart (sim): median ' + q(0.5) + ' m, 10% ' + q(0.1) + ' m, 90% ' + q(0.9) + ' m');
console.log('by what they were doing: ' + Object.entries(tot.byPair).sort((a, c) => c[1] - a[1]).slice(0, 14).map(([k, v]) => k + ' ' + v).join(' · '));
console.log('worst: ' + tot.worst.slice(0, 10).join(' | ')); console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
