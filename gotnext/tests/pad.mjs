// Controller: X steals / Y blocks on defense, LB/RB tabs, directional menus; auto-timed jumpers rarely green. node tests/pad.mjs
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
// menus: RB / LB flip the tabs; the d-pad moves by direction on screen
await p.evaluate(() => { __pit.uiPlayer('attrs'); window.__tick(3); window.__usePad = true; window.__tick(2); });
const tab = () => p.evaluate(() => { const s = document.querySelector('#panel .tabs .btn.sel'); return s && s.textContent; });
const t0 = await tab(); await p.evaluate(() => __press(5)); const t1 = await tab(); await p.evaluate(() => __press(5)); const t2 = await tab(); await p.evaluate(() => { __press(4); __press(4); }); const t3 = await tab();
ok(t1 !== t0 && t2 !== t1 && t3 === t0, `RB: ${t0} → ${t1} → ${t2}; LB twice → ${t3}`);
let r = await p.evaluate(() => { const f = () => document.querySelector('#panel .focus'), rect = e => e.getBoundingClientRect(); const out = {};
  for (let i = 0; i < 30 && f() && !/^\+1/.test(f().textContent); i++) __press(13, 6); const a = f(), ra = rect(a); out.start = a.textContent;
  __press(15, 6); const bR = f(), rr = rect(bR); out.right = bR.textContent; out.sameRow = Math.abs((rr.top + rr.bottom) / 2 - (ra.top + ra.bottom) / 2) < 6;
  __press(13, 6); const c = f(), rc = rect(c); out.down = c.textContent; out.below = rc.top > rr.bottom - 2; out.downAligned = Math.abs((rc.left + rc.right) / 2 - (rr.left + rr.right) / 2) < 30;
  __press(14, 6); const d = f(), rd = rect(d); out.left = d.textContent; out.leftSameRow = Math.abs((rd.top + rd.bottom) / 2 - (rc.top + rc.bottom) / 2) < 6; return out; });
ok(/^\+1/.test(r.start) && r.right === '+5' && r.sameRow && r.below && r.downAligned && r.leftSameRow && /^\+1/.test(r.left), `d-pad: on "${r.start}", → goes to "${r.right}" on the same row, ↓ to "${r.down}" right below, ← back to "${r.left}"`);
await p.screenshot({ path: path.join(dir, 'shots', 'pad-menu.png') });
// a game: X steals and Y jumps on defense; X shoots with the ball
await p.evaluate(() => { window.__usePad = false; const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); window.__usePad = true; });
const setDef = `var P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), h = opp[0]; M.phase = 'live'; M.needClear = false; M.clock = 14; for (const q of M.P) { q.st = 'free'; q.y = 0; q.cool = 0; q.reach = []; if (q.ai) q.ai.tick = 999; } h.x = 0; h.z = 6; me.x = 0; me.z = 5; M.B.state = 'held'; M.B.holder = h; M.off = h.team; window.__tick(2);`;
r = await p.evaluate(s => { eval(s); __pad.buttons[2].pressed = true; window.__tick(1); const st = me.st, cool = me.cool; __pad.buttons[2].pressed = false; window.__tick(30); return { st, cool: +cool.toFixed(2) }; }, setDef);
ok(r.st === 'steal' || r.cool > 0, `defense, X: ${r.st} (steal cooldown ${r.cool})`);
r = await p.evaluate(s => { eval(s); __pad.buttons[3].pressed = true; window.__tick(1); const st = me.st; __pad.buttons[3].pressed = false; window.__tick(40); return st; }, setDef);
ok(r === 'jump', `defense, Y: ${r}`);
r = await p.evaluate(s => { eval(s); M.B.holder = me; M.off = me.team; me.live = 'drib'; window.__tick(3); __pad.buttons[2].pressed = true; window.__tick(3); const st = me.st; __pad.buttons[2].pressed = false; window.__tick(60); return st; }, setDef);
ok(r === 'shoot', `offense, X: ${r}`);
// auto-timed jumpers (the up-flick hop jumper, floaters) by a maxed shooter: good looks, rarely green
r = await p.evaluate(s => { window.__usePad = false; let g = 0, n = 0; for (let k = 0; k < 60; k++) { eval(s); for (const a in me.b.attrs) me.b.attrs[a] = 99; M.B.holder = me; M.off = me.team; me.x = 0; me.z = 5.5; for (const q of opp) { q.x = 6; q.z = 11; } me.live = 'drib'; window.__tick(2);
    P.startShot(me, 'stick', false, { hopped: true }); for (let i = 0; i < 90 && !me.shot.released; i++) window.__tick(1); if (me.shot.released) { n++; if (M.B.green) g++; } window.__tick(120); } return { g, n }; }, setDef);
ok(r.n >= 50 && r.g / r.n < 0.4, `hop jumpers by a 99 shooter: ${r.g} greens in ${r.n} `);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
