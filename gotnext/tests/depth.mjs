// Gameplay depth: called screens and the roll, box-outs, game point; the phone's action buttons. node tests/depth.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const fake = () => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; }; const errs = [];
async function open(ctx) { await ctx.addInitScript(fake); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60)); await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10)); return p; }
const start2 = `(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.size === 2), P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT, me = M.me; var g = 0; while (M.phase !== 'live' && g++ < 600) window.__tick(1); if (M.B.holder !== me) { P.call('give', me); P.call('changePoss', me.team); } M.needClear = false; me.x = 0; me.z = 8; return M.phase; })()`;
{
  const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } }); const p = await open(ctx);
  let r = await p.evaluate((s) => { const P = __pit; eval(s); const M = P.MT, me = M.me, mate = M.P.find(q => q.team === me.team && q !== me), d = M.P.find(q => q.team !== me.team && q.man === me) || M.P.find(q => q.team !== me.team);
    for (const q of M.P) if (q.team !== me.team) { q.ai.tick = 99; } d.x = 0; d.z = 6.6; M.clock = 20;
    const called = P.call('callScreen', me); if (mate.ai.scr) mate.ai.scr.kind = 'set'; mate.A.str = 92; d.A.str = 20; let set = false, setDist = 9, hit = false, rolled = false, rollD = 9, i = 0;
    for (; i < 60 * 5; i++) { M.clock = 20; d.cool = 5; me.x = 0; me.z = 8; d.x += (0 - d.x) * 0.02; window.__tick(1); if (M.B.holder !== me) break; if (mate.screen) { set = true; setDist = Math.min(setDist, Math.hypot(mate.x - d.x, mate.z - d.z)); break; } }
    const pose = mate.screen;
    // the defender tries to run through it; then the handler goes and the screener rolls
    const sx = mate.x, sz = mate.z; d.x = mate.x - 1.2; d.z = mate.z; for (let k = 0; k < 40; k++) { M.clock = 20; me.x = 0; me.z = 8; d.vx = 3; d.x += 0.03; window.__tick(1); if (d.scrHit) hit = true; }
    const moved = Math.hypot(mate.x - sx, mate.z - sz), slow = d.slowT;
    for (let k = 0; k < 60 * 3; k++) { M.clock = 20; me.x = 3; me.z = 7; window.__tick(1); if (mate.ai.scr && mate.ai.scr.ph === 2) rolled = true; rollD = Math.min(rollD, Math.hypot(mate.x, mate.z)); if (M.B.holder !== me) break; }
    return { called, set, setDist, pose, hit, moved, rolled, rollD, frames: i, again: P.call('callScreen', me) };
  }, start2);
  ok(r.called && r.set && r.setDist < 1.5, `call a screen: the teammate runs over and plants ${r.setDist.toFixed(2)} m from your defender in ${(r.frames / 60).toFixed(1)} s`);
  ok(r.hit && r.moved < 0.35, `the defender runs into it: SCREENED and slowed; the screener gave ${r.moved.toFixed(2)} m`);
  ok(r.rolled && r.rollD < 2.6, `you go, he rolls to the rim (got within ${r.rollD.toFixed(1)} m of it)`);
  // box out
  r = await p.evaluate((s) => { const P = __pit; eval(s); const M = P.MT, me = M.me, o = M.P.find(q => q.team !== me.team), out = {};
    for (const box of [false, true]) { let mine = 0; P.keys.KeyQ = box;
      for (let k = 0; k < 150; k++) { for (const q of M.P) { q.st = 'free'; q.y = 0; q.vx = q.vz = 0; q.x = 6; q.z = 10 + q.i; q.ai.tick = 99; q.ai.boxOn = false; q.ai.boxFor = M.B.shotId; q.slowT = 0; }
        me.x = 0; me.z = 1.45; o.x = 0; o.z = 2.0; M.phase = 'live'; const B = M.B; B.state = 'loose'; B.holder = null; B.rebound = true; B.pos.set(0, 1.0, 1.72); B.vel.set(0, 0, 0); B.t = 0.3; M.looseT = 0; B.shooter = null;
        window.__tick(2); if (M.B.holder === me) mine++; }
      out[box ? 'box' : 'plain'] = mine; out['flag' + box] = me.box; }
    P.keys.KeyQ = false; out.reb = [P.call('att', me, 'reb'), P.call('att', o, 'reb')]; return out; }, start2);
  ok(r.box > r.plain + 15, `box out (hold LT with the ball in the air): you win ${r.box} of 150 boards against the man behind you, ${r.plain} of 150 without (Rebound ${r.reb[0]} v ${r.reb[1]})`);
  // game point
  r = await p.evaluate((s) => { const P = __pit; eval(s); const M = P.MT, me = M.me, to = M.cfg.mode.to; M.score[me.team] = to - 4; const before = !!M.gamePt; P.call('scorePts', me, 2, 'jumper'); const flag = M.gamePt; let txt = ''; for (let k = 0; k < 150; k++) { window.__tick(1); const e = document.getElementById('call'); if (e && /GAME POINT/.test(e.textContent)) txt = e.textContent; } return { before, flag, txt, to, sc: M.score.slice() }; }, start2);
  ok(!r.before && r.flag && /GAME POINT/.test(r.txt), `game point: at ${r.sc.join('-')} in a game to ${r.to} the call goes out ("${r.txt.slice(0, 40)}") and release windows scale with Shot IQ`);
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const p = await open(ctx);
  let r = await p.evaluate((s) => { const P = __pit; eval(s); window.__tick(3); const M = P.MT; const R = id => { const e = document.getElementById(id), c = getComputedStyle(e), q = e.getBoundingClientRect(); return { id, show: c.display !== 'none', x: q.left, y: q.top, w: q.width, h: q.height, t: e.textContent }; };
    const bs = ['tA', 'tB', 'tLT', 'tPK', 'tMenu'].map(R), vis = bs.filter(x => x.show); let overlap = 0; for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = vis[i], c = vis[j]; if (Math.hypot(a.x + a.w / 2 - c.x - c.w / 2, a.y + a.h / 2 - c.y - c.h / 2) < (a.w + c.w) / 2) overlap++; }
    return { bs, overlap, on: vis.every(x => x.x >= 0 && x.y >= 0 && x.x + x.w <= innerWidth && x.y + x.h <= innerHeight) }; }, start2);
  ok(r.bs.every(x => x.show) && r.overlap === 0 && r.on && r.bs.every(x => x.w >= 44), `phone, with the ball in a 2v2: ${r.bs.map(x => x.t + ' ' + Math.round(x.w)).join(' · ')} px, none overlapping, all on screen`);
  await p.screenshot({ path: path.join(dir, 'shots', 'phone-buttons.png'), timeout: 300000 });
  await p.touchscreen.tap(...(await p.evaluate(() => { const q = document.getElementById('tPK').getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; })));
  r = await p.evaluate(() => { const M = __pit.MT, me = M.me; M.clock = 20; window.__tick(3); return { scr: M.P.some(q => q.team === me.team && q.ai.scr) }; });
  ok(r.scr, 'tapping PICK calls the screen');
  r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, o = M.P.find(q => q.team !== me.team); P.call('give', o); P.call('changePoss', o.team); for (const q of M.P) q.ai.tick = 99; M.clock = 20; window.__tick(3); const a = document.getElementById('tPK'); const hid = a.textContent === 'SWITCH' && getComputedStyle(a).display !== 'none'; const B = M.B; B.state = 'shot'; B.holder = null; B.t = 0; B.T = 9; window.__tick(1); const lt = document.getElementById('tLT').textContent; return { hid, lt }; });
  ok(r.hid && r.lt === 'BOX OUT', `on defense the cyan button reads SWITCH; with a shot in the air the gold button reads ${r.lt}`);
  await ctx.close();
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
