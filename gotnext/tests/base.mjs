// The starter's base package with a brand-new rookie: varied layups, both hands, reachable dunks; the phone's gold button as a switch. node tests/base.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; }; const errs = [];
const fake = () => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; };
async function open(ctx) { await ctx.addInitScript(fake); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60)); await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
  await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.size === 2 && !m.arcade), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT; var g = 0; while (M.phase !== 'live' && g++ < 600) window.__tick(1);
    window.T = { set() { const M = P.MT, me = M.me; P.call('give', me); P.call('changePoss', me.team); M.needClear = false; M.phase = 'live'; M.clock = 20; me.st = 'free'; me.y = 0; me.live = 'drib'; me.putT = 0; me.slowT = 0; for (const q of M.P) { q.ai.tick = 99; q.cool = 9; if (q !== me) { q.st = 'free'; q.x = 7.5; q.z = 11 + q.i * 0.4; q.vx = q.vz = 0; } } return me; } }; }); return p; }
{
  const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } }); const p = await open(ctx);
  let r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team), out = { A: { layup: me.A.layup, dunk: me.A.dunk, vert: me.A.vert, h: +me.H.toFixed(2) }, style: me.b.build.style, open: {}, cont: {}, hands: { L: 0, R: 0 }, leftSide: 0, mid: 0, rep: 0, dunks: {}, traffic: {} };
    let last = ''; for (let i = 0; i < 120; i++) { const m2 = T.set(); const side = i % 3; m2.x = side === 0 ? -1.6 : side === 1 ? 1.6 : 0.1; m2.z = 2.2; m2.vx = 0; m2.vz = -2.6; P.call('startFinish', m2, 0, false, 0, { layup: 1 }); const f = m2.finish; out.open[f.kind] = (out.open[f.kind] || 0) + 1; out.hands[f.lh ? 'L' : 'R']++; if (side === 0 && f.lh) out.leftSide++; if (f.kind === last) out.rep++; last = f.kind; }
    last = ''; for (let i = 0; i < 120; i++) { const m2 = T.set(); m2.x = 0.1; m2.z = 3.0; m2.vx = 0; m2.vz = -4.2; d.x = i % 2 ? 0.7 : -0.6; d.z = 2.1; if (!P.call('startFinish', m2, 0, false, 0, { layup: 1 }) || m2.st !== 'finish') { out.chg = (out.chg || 0) + 1; continue; } const f = m2.finish; out.cont[f.kind] = (out.cont[f.kind] || 0) + 1; if (i % 2 && f.lh) out.mid++; if (f.kind === last) out.rep++; last = f.kind; }
    for (let i = 0; i < 90; i++) { const m2 = T.set(); m2.x = 0.3; m2.z = 2.3; m2.vx = -0.3; m2.vz = -4.4; m2.in.dx = 0; m2.in.dz = -1; P.call('startFinish', m2, 0); const f = m2.finish, k = f.type === 'dunk' ? f.style : 'layup'; out.dunks[k] = (out.dunks[k] || 0) + 1; }
    for (let i = 0; i < 60; i++) { const m2 = T.set(); m2.x = 0.3; m2.z = 2.3; m2.vx = 0; m2.vz = -4.4; m2.in.dx = 0; m2.in.dz = -1; d.x = 0.2; d.z = 1.0; P.call('startFinish', m2, 0); const f = m2.finish, k = f.type === 'dunk' ? f.style : 'layup'; out.traffic[k] = (out.traffic[k] || 0) + 1; }
    const stand = (() => { const m2 = T.set(); m2.x = 0.3; m2.z = 1.9; m2.vx = 0; m2.vz = 0; P.call('startFinish', m2, 0); return m2.finish.type; })(); out.stand = stand; return out; });
  const dk = Object.keys(r.dunks).filter(k => k !== 'layup');
  ok(Object.keys(r.open).length >= 3 && Object.keys(r.cont).length >= 5 && r.rep === 0, `a brand-new ${r.style} (Layup ${r.A.layup}, Dunk ${r.A.dunk}): alone ${JSON.stringify(r.open)}; with a man on him ${JSON.stringify(r.cont)}; the same finish twice running ${r.rep} times (${r.chg || 0} drives were called charges)`);
  ok(r.leftSide === 40 && r.hands.L >= 40 && r.hands.R >= 40 && r.mid >= 20, `hands: left side goes up left-handed ${r.leftSide}/40; down the middle with the defender on the right, left-handed ${r.mid} times; overall ${r.hands.L} left, ${r.hands.R} right`);
  ok(dk.length >= 3 && !r.dunks.layup, `with a clear run the rookie dunks, from the free set: ${JSON.stringify(r.dunks)}; into a shot-blocker ${JSON.stringify(r.traffic)}`);
  r = await p.evaluate(() => { const P = __pit; P.call('quitMatch'); window.__tick(5); P.ev("uiClose(); uiPlayer('moves')"); window.__tick(3); const c = [...document.querySelectorAll('#panel .cat')].map(e => e.textContent.split('—')[0].trim()); return c.slice(0, 2); });
  ok(r[0] === 'BASE PACKAGE', `MOVES opens with the ${r[0]} card, then ${r[1]}`);
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }); const p = await open(ctx);
  const tapLT = async () => { const q = await p.evaluate(() => { const e = document.getElementById('tLT').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; }); await p.touchscreen.tap(q[0], q[1]); };
  await p.evaluate(() => { const me = T.set(); me.x = 0; me.z = 5; window.__tick(3); }); await tapLT();
  let r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; const a = []; for (let i = 0; i < 40; i++) { M.clock = 20; for (const q of M.P) { q.ai.tick = 99; q.cool = 9; } window.__tick(1); if (i === 5 || i === 39) a.push(me.post); } return { a, on: document.getElementById('tLT').classList.contains('on'), lbl: document.getElementById('tLT').textContent, has: M.B.holder === me }; });
  ok(r.has && r.a[0] && r.a[1] && r.on, `phone: one tap on the gold ${r.lbl} button and you are posting up, and still are 40 frames after letting go (button lit: ${r.on})`);
  await tapLT(); r = await p.evaluate(() => { const M = __pit.MT, me = M.me; for (let i = 0; i < 5; i++) { M.clock = 20; window.__tick(1); } return { post: me.post, on: document.getElementById('tLT').classList.contains('on') }; });
  ok(!r.post && !r.on, `a second tap lets go`);
  await tapLT(); r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; for (let i = 0; i < 6; i++) { M.clock = 20; window.__tick(1); } const was = me.post; P.keys.Space = true; window.__tick(14); P.keys.Space = false; for (let i = 0; i < 8; i++) window.__tick(1); return { was, st: me.st, lt: P.ev('touch.lt'), on: document.getElementById('tLT').classList.contains('on') }; });
  ok(r.was && !r.lt && !r.on, `shooting out of the post (${r.st}) switches it off by itself`);
  await p.screenshot({ path: path.join(dir, 'shots', 'phone-post.png'), timeout: 300000 });
  await ctx.close();
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
