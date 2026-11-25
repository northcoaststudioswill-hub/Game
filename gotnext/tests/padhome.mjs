// The home builder and the rest of the crib with a controller only. node tests/padhome.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } };
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false })) }; window.__usePad = false;
  navigator.getGamepads = () => window.__usePad ? [window.__pad] : [];
  window.__press = (n, hold) => { window.__pad.buttons[n].pressed = true; window.__tick(hold || 2); window.__pad.buttons[n].pressed = false; window.__tick(2); }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.S.vc = 30000; P.S.rep = 9000; P.uiClose(); P.enterWorld('crib', -17, 8, Math.PI); window.__tick(30); window.__usePad = true; window.__tick(3); });
let r = await p.evaluate(() => { const h = document.getElementById('padhint'); return h && h.style.display !== 'none' ? h.textContent : ''; });
ok(/BUILD/.test(r), `controller hint at the crib: "${r}"`);
r = await p.evaluate(() => { const P = __pit; __press(3); const on = !!P.W.build; const h = document.getElementById('padhint').textContent; return { on, h }; });
ok(r.on && /CATALOG/.test(r.h), `Ⓨ opens the builder; the hint strip lists the builder controls ("${r.h.slice(0, 60)}…")`);
r = await p.evaluate(() => { const P = __pit, B = P.W.build, c0 = P.ev('BLD.cat'); __press(5); const c1 = P.ev('BLD.cat'); __press(4); const c2 = P.ev('BLD.cat'); __press(15); const s1 = B.sel; __press(15); const s2 = B.sel; __press(14); const s3 = B.sel; return { c0, c1, c2, s1, s2, s3 }; });
ok(r.c1 !== r.c0 && r.c2 === r.c0 && r.s1 && r.s2 !== r.s1 && r.s3 === r.s1, `RB/LB change category (${r.c0} → ${r.c1} → ${r.c2}); d-pad → picks ${r.s1}, → ${r.s2}, ← back to ${r.s3}`);
r = await p.evaluate(() => { const P = __pit, B = P.W.build, n0 = P.S.home.items.length, vc = P.S.vc, x0 = B.x; __pad.axes = [1, 0, 0, 0]; window.__tick(20); __pad.axes = [0, 0, 0, 0]; window.__tick(2); const moved = B.x - x0; const rot0 = B.rot; __press(2); const rot = B.rot !== rot0;
  let placed = false; for (let k = 0; k < 30 && !placed; k++) { __press(0); placed = P.S.home.items.length > n0; if (!placed) { __pad.axes = [0, 1, 0, 0]; window.__tick(8); __pad.axes = [0, 0, 0, 0]; window.__tick(2); } }
  return { moved: +moved.toFixed(1), rot, placed, spent: vc - P.S.vc, n: P.S.home.items.length }; });
ok(r.moved !== 0 && r.rot && r.placed && r.spent > 0, `stick moves the cursor (${r.moved} m), Ⓧ rotates, Ⓐ places it (${r.spent} VC, ${r.n} piece on the lot)`);
r = await p.evaluate(() => { const P = __pit, B = P.W.build; if (B.sel) __press(1); const n0 = P.S.home.items.length, it = P.S.home.items[n0 - 1]; B.fx = it.x; B.fz = it.z; window.__tick(3); __press(0); const picked = !!B.pick; const vc = P.S.vc; __press(6); return { picked, sold: P.S.vc - vc, n: P.S.home.items.length, n0 }; });
ok(r.picked && r.sold > 0 && r.n === r.n0 - 1, `Ⓐ picks a placed piece up, LT sells it (+${r.sold} VC)`);
r = await p.evaluate(() => { const P = __pit; __press(12); const lot = document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent; __press(13, 6); const f1 = document.querySelector('#panel .focus'); __press(1); const closed = !P.UI.cur; __press(13); const sets = document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent; __press(1); __press(1); return { lot, focus: !!f1, closed, sets, out: !P.W.build }; });
ok(r.lot && r.focus && r.closed && r.sets && r.out, `d-pad ↑ opens "${r.lot}" (navigable, Ⓑ closes), ↓ opens "${r.sets}", Ⓑ leaves the builder`);
// a dropdown and a text box in menus
r = await p.evaluate(() => { const P = __pit; P.ev("uiClose(); alabOpen()"); window.__tick(3); const f = P.call('focusables'), i = f.findIndex(e => e.tagName === 'SELECT'); P.UI.focus = i; const v0 = f[i].value; __press(15, 6); const f2 = P.call('focusables'); const v1 = f2[f2.findIndex(e => e.tagName === 'SELECT')].value; P.ev("uiClose(); uiDev('hub')"); return { i, v0, v1 }; });
ok(r.i >= 0 && r.v1 !== r.v0, `a dropdown (ANIM LAB cast picker) changes with d-pad → (${r.v0} → ${r.v1})`);
// pause menu in a game
r = await p.evaluate(() => { const P = __pit; P.uiClose(); window.__usePad = false; P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); window.__usePad = true; __press(9); const btns = Array.from(document.querySelectorAll('#panel .btn')).map(b => b.textContent); const foc = !!document.querySelector('#panel .focus'); __press(0); return { btns, foc, resumed: !P.UI.cur && !!P.MT, cur: !!P.UI.cur, mt: !!P.MT, paused: P.MT && P.MT.paused }; });
ok(r.btns.length >= 2 && r.foc && r.resumed, `START pauses a game (${r.btns.join(' · ')}), Ⓐ on RESUME resumes`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
