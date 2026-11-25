// Build slots and upgrade pricing. node tests/builds.mjs → tests/shots/builds.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
// pricing: cheap early, steep near the top
let r = await p.evaluate(() => { const P = __pit; return [50, 70, 90].map(v => P.attrCost(v)); });
ok(r[0] < 40 && r[2] > r[0] * 20, `upgrade cost +1 at 50 / 70 / 90: ${r.join(' / ')} HC`);
// slots
r = await p.evaluate(() => { const P = __pit, S = P.S; S.vc = 5000; S.attrs.three = 70; S.badges.lobby = 2; S.moves.jumper = 'textbook'; const first = S.name; P.save();
  const i = P.slotNew(); S.slot = i; P.slotLoad(S.slots[i]); S.name = 'BIGMAN'; S.build.style = 'glass'; S.build.body.h = 84; P.save();
  const two = { n: S.slots.length, name: S.name, three: S.attrs.three, badge: S.badges.lobby || 0, vc: S.vc };
  P.slotSwitch(0); const back = { name: S.name, three: S.attrs.three, badge: S.badges.lobby, vc: S.vc };
  const ks = JSON.parse(localStorage.getItem('gotnext_v1')); for (let k = 0; k < 6; k++) P.slotNew();
  return { first, two, back, saved: ks.slots.length, cap: S.slots.length }; });
ok(r.two.n === 2 && r.two.name === 'BIGMAN' && r.two.three !== 70 && !r.two.badge && r.two.vc === 5000, `new build starts fresh (3PT ${r.two.three}, no badges) and shares the wallet (${r.two.vc} HC)`);
ok(r.back.name === r.first && r.back.three === 70 && r.back.badge === 2, `switching back restores ${r.back.name}: 3PT ${r.back.three}, badge tier ${r.back.badge}`);
ok(r.saved === 2 && r.cap === 5, `slots persist (${r.saved} saved) and cap at five (${r.cap})`);
await p.evaluate(() => { __pit.uiPlayer('builds'); window.__tick(3); }); await p.screenshot({ path: path.join(dir, 'shots', 'builds.png') });
r = await p.evaluate(() => document.querySelectorAll('#panel .card').length); ok(r >= 5, `BUILDS tab lists ${r} builds`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
