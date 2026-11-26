// The between-the-big-moves animations from coaching sources: deny and help stances off the ball, closeouts, chinning a
// rebound, showing a target, pointing at the passer, hands on knees. AI games: how often each one shows, and a close-up of each.
// node tests/reallife.mjs [--shots]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), shots = process.argv.includes('--shots'), out = path.join(dir, 'shots', 'real'); if (shots) fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
const KINDS = ['deny', 'help', 'close', 'chin', 'target', 'point', 'knees'];
const kindOf = (o, an) => an === 'knees' ? 'knees' : o.offD || (o.close > 0.4 ? 'close' : o.chin ? 'chin' : o.target > 0.5 ? 'target' : o.point !== undefined && o.pointW > 0.6 ? 'point' : null);
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's3'), P.TIERS_COURT[2], { mates: [-1, -1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) { q.aiLvl = 0.8; q.stam = q.stam === undefined ? 100 : q.stam; } window.__kindOf = null; });
const count = {}, got = {}; let frames = 0;
for (let chunk = 0; chunk < 150; chunk++) {
  const r = await p.evaluate((KINDS) => { const P = __pit, M = P.MT; if (!M || M.phase === 'over') return null; const c = {}, hits = []; if (M.phase === 'scored' && Math.random() < 0.5) for (const q of M.P) q.stam = 30;      /* make some gassed players to see */
    for (let f = 0; f < 30; f++) { window.__tick(1); for (const q of M.P) { const o = q.anO || {}, an = q.an; const k = an === 'knees' ? 'knees' : o.offD || (o.close > 0.4 ? 'close' : o.chin ? 'chin' : o.target > 0.5 ? 'target' : o.point !== undefined && o.pointW > 0.6 ? 'point' : null); if (k) { c[k] = (c[k] || 0) + 1; if (f === 29) hits.push([k, q.i]); } } }
    return { c, hits }; }, KINDS);
  if (!r) break; frames += 30; for (const k in r.c) count[k] = (count[k] || 0) + r.c[k];
  if (shots) for (const [k, i] of r.hits) if (!got[k]) { got[k] = 1;
    const box = await p.evaluate((i) => { const P = __pit, q = P.MT.P[i]; P.ev('scene.updateMatrixWorld()'); const [x, y] = P.ev('project')(q.x, q.H * 0.5, q.z); return [x, y]; }, i);
    await p.waitForTimeout(400); const w = 190, h = 190; await p.screenshot({ path: path.join(out, k + '.png'), clip: { x: Math.max(0, Math.min(1280 - w, box[0] - w / 2)), y: Math.max(0, Math.min(720 - h, box[1] - h / 2)), width: w, height: h } }); }
}
const pl = await p.evaluate(() => __pit.MT ? __pit.MT.P.length : 6);
console.log(`${frames} frames, ${pl} players. Share of player-frames in each:`);
for (const k of KINDS) console.log('  ' + k.padEnd(7) + ' ' + ((count[k] || 0) / (frames * pl) * 100).toFixed(1) + '%' + (shots ? (got[k] ? '  (photographed)' : '  (no photo)') : ''));
const missing = KINDS.filter(k => !count[k]); console.log(missing.length ? 'NEVER SEEN: ' + missing.join(', ') : 'all seen'); console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
