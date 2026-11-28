// Controller menus the way the reviewers used them: type a name on the on-screen keyboard with the d-pad, walk to the
// bottom of the builder and stop on HIT THE BLOCK (no wrap to the top), START builds.   node tests/kbnav.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } };
  window.__pad = { id: 'Xbox Wireless Controller (STANDARD GAMEPAD)', index: 0, mapping: 'standard', connected: true, timestamp: 0, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [window.__pad, null, null, null]; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m, d) => { console.log((c ? 'PASS ' : 'FAIL ') + m + (d ? '  ' + d : '')); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
const BTN = { A: 0, B: 1, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };
// a brisk tap: 4 frames down, 4 frames up (about 0.13 s a press, faster than the reviewers' "normal pace")
const tap = (k, n = 1) => p.evaluate(([i, n]) => { for (let j = 0; j < n; j++) { window.__pad.buttons[i].pressed = true; window.__pad.buttons[i].value = 1; window.__pad.timestamp++; window.__tick(4); window.__pad.buttons[i].pressed = false; window.__pad.buttons[i].value = 0; window.__pad.timestamp++; window.__tick(4); } }, [BTN[k], n]);
const focusTxt = () => p.evaluate(() => { const f = __pit.call('focusables'); const e = f[__pit.UI.focus]; return e ? String(e.textContent || e.id || e.type || e.className).trim().slice(0, 24) : null; });
await tap('A'); await p.evaluate(() => window.__tick(20));      // title: START A NEW PLAYER (or Continue)
ok(await p.evaluate(() => !!document.getElementById('bname')), 'builder open');
await tap('A'); await p.evaluate(() => window.__tick(6));        // A on the name opens the keyboard
const f0 = await focusTxt(); ok(/DONE/.test(f0), 'keyboard starts on DONE', f0);
await tap('RIGHT'); const f1 = await focusTxt(); ok(/DELETE/.test(f1), 'RIGHT from DONE is DELETE (was N)', f1);
// type DUKE from the grid: rows of 10 under DONE/DELETE/SPACE/RANDOM: A-J, K-T, U-3, 4-9
const typeChar = async ch => { const g = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k = g.indexOf(ch); await p.evaluate(() => { const f = __pit.call('focusables'); __pit.UI.focus = f.findIndex(e => e.textContent.trim() === 'A' && e.closest('.padkb')); });
  const r = Math.floor(k / 10), c = k % 10; await tap('DOWN', r); await tap('RIGHT', c); const t = await focusTxt(); await tap('A'); return t; };
const got = []; for (const ch of 'DUKE') got.push(await typeChar(ch));
const nm = await p.evaluate(() => document.getElementById('bname') ? document.getElementById('bname').value : '');
ok(got.join('') === 'DUKE', 'd-pad lands on D, U, K, E', got.join(','));
await tap('START'); await p.evaluate(() => window.__tick(6));
ok(await p.evaluate(() => !document.querySelector('.padkb')), 'START closes the keyboard');
// walk DOWN the whole builder: it must end on HIT THE BLOCK and stay there, never wrap to the top
const seen = []; for (let i = 0; i < 60; i++) { await tap('DOWN'); seen.push(await focusTxt()); }
const last = seen.slice(-5); ok(last.every(t => /HIT THE BLOCK/.test(t)), 'DOWN stops on HIT THE BLOCK', last[0]);
ok(!seen.slice(seen.findIndex(t => /HIT THE BLOCK/.test(t))).some(t => !/HIT THE BLOCK/.test(t)), 'no bounce or wrap after reaching it');
await tap('UP'); const up = await focusTxt(); ok(!/HIT THE BLOCK|NAME|bname/.test(up), 'UP leaves the footer for the page', up);
await tap('START'); await p.evaluate(() => window.__tick(40));
ok(await p.evaluate(() => !!__pit.W && __pit.W.kind === 'hub'), 'START hits the Block', await p.evaluate(() => __pit.S.name));
const dn = await p.evaluate(() => { __pit.uiClose(); __pit.ev("uiDrills('hub')"); window.__tick(3); const f = __pit.call('focusables'); const t = f.findIndex(e => e.closest('.tabs')); const j = __pit.call('navDir', f, t, 'D'); const c = f[j].closest('.card'); return (c && c.querySelector('h3') ? c.querySelector('h3').textContent : '') + ' / ' + f[j].textContent.trim(); });
ok(/LAYUP|Layup/.test(dn), 'DOWN from the coach board tabs lands on the first drill', dn);
ok(!errs.length, 'no page errors', errs.join(' | ')); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); await b.close();
