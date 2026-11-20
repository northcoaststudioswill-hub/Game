// a comic-book level walked with the stick, not teleported: node stickrun.mjs  (L=stack|array|cold)
import { chromium } from 'playwright';
const L = process.env.L || 'stack', m = 6.7;
const ROUTES = {
  stack: { issue: 'stack', pts: [[-6.5, 17.6], [-6.5, 9], [-6.5, m], ...[0, 1, 2].flatMap(t => [[m, m], [m, -m], [-m, -m], [-m, m], ...(t < 2 ? [[-9.6, 9.6], [-m, m]] : [])]), [-2, m], [0, 6.4], [0, 5.2, 'use'], [0, 7.9]] },
  array: { issue: 'array', pts: [[-14, 26], [-14, 23.6], [-14, 22], [-16.3, 20.5], [-16.3, 3], [-16.3, 2], [15.6, 2, 'lamp'], [16.3, 2], [16.3, 0.5], [16.3, -21], [9, -22], [3, -11.6], [0.6, -12.2, 'use'], [3, -11.6], [9, -22], [16.3, -21], [16.3, 0.5], [16.3, 2], [-16.3, 2], [-16.3, 3], [-16.3, 20.5], [-14, 22], [-14, 24]] },
  cold: { issue: 'stair', cold: 1, pts: [[0, 33.4], [0, 28], [0, 22], [0, 16.2]] } };
const R = ROUTES[L];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(r => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; window.__done = 0; BTS.Cutscene.play([{ issue: r.issue, cold: r.cold, or: [] }], () => { window.__done = 1; }); }, R);
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && (SC.state === 'play' || SC.state === 'page')).catch(() => 0)) break; }
let wp = 0, stuckAt = null, t0 = Date.now(), lastProg = Date.now(), lastD = 1e9, fights = 0, log = [];
while (wp < R.pts.length && Date.now() - t0 < 400000) {
  if (await ev(() => !Issue.on).catch(() => true)) break;
  const s = await fr.evaluate(([tx, tz, act]) => { const pl = SC.player, S = SC.story, U = SC.ui; SC.manual = true; let note = '';
    for (let i = 0; i < 12; i++) { if (SC.state !== 'play' || U.dlg || U.pg || !pl.control) { SC.input.ext = { x: 0, y: 0 }; if (!U.key('interact')) SC.input.press('interact'); note = 'page'; SC.tick(1 / 30); continue; }
      if (S.enc) { SC.clearEnemies(); note = 'fight:' + S.enc.id; SC.input.ext = { x: 0, y: 0 }; SC.tick(1 / 30); continue; }
      pl.hp = pl.maxHp || pl.hp; if (act === 'lamp' && S.lampX !== undefined && Math.abs(S.lampX - pl.pos.x) < 7 && pl.pos.x > -15.5) { SC.input.ext = { x: 0, y: 0 }; SC.tick(1 / 30); note = 'waiting for the lamp'; continue; }
      const dx = tx - pl.pos.x, dz = tz - pl.pos.z; SC.cam.yaw = Math.atan2(dx, dz); SC.cam.lock = null; SC.input.ext = { x: 0, y: 1 }; SC.tick(1 / 30); }
    SC.input.ext = { x: 0, y: 0 }; const d = Math.hypot(tx - pl.pos.x, tz - pl.pos.z); if (act === 'use' && d < 1.3 && SC.state === 'play' && !U.dlg && !U.pg) { SC.input.press('interact'); SC.tick(1 / 30); note = 'used'; }
    return { d, x: +pl.pos.x.toFixed(1), y: +pl.pos.y.toFixed(1), z: +pl.pos.z.toFixed(1), note, flags: Object.keys(S.flags || {}).join(','), runT: S.runT }; }, R.pts[wp]).catch(e => ({ err: String(e).slice(0, 80) }));
  if (s.err) { await wait(300); continue; }
  if (/fight/.test(s.note)) { fights++; lastProg = Date.now(); }
  if (s.note) lastProg = Date.now();
  if (s.d < lastD - 0.05) { lastD = s.d; lastProg = Date.now(); }
  const need = R.pts[wp][2] === 'use' ? (s.note === 'used') : s.d < 0.9;
  if (need) { log.push(wp + ':' + s.y); wp++; lastD = 1e9; lastProg = Date.now(); continue; }
  if (Date.now() - lastProg > 14000) { stuckAt = { wp, target: R.pts[wp], at: [s.x, s.y, s.z], flags: s.flags }; break; }
}
await fr.evaluate(() => { SC.manual = false; }).catch(() => 0); await wait(600);
// let the ending pages turn
for (let i = 0; i < 60 && !(await ev(() => !Issue.on).catch(() => true)); i++) { await fr.evaluate(() => { if (SC.ui && !SC.ui.key('interact')) SC.input.press('interact'); }).catch(() => 0); await wait(350); }
console.log(L, stuckAt ? 'STUCK ' + JSON.stringify(stuckAt) : 'walked every point (' + wp + ' of ' + R.pts.length + ')', '| heights', log.join(' '), '| fight ticks', fights, '| level ended:', await ev(() => !Issue.on), 'flag', await ev(r => BTS.G.flags['issue_' + r.issue + (r.cold ? 'cold' : '')], R), '| secs', Math.round((Date.now() - t0) / 1000), '| errors', errors);
await browser.close();
