// Defending: who you face. node tests/defend.mjs → also writes tests/shots/defend.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const setup = (meX, meZ) => p.evaluate(([meX, meZ]) => { const P = __pit; if (!P.MT) { P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); }
  const M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), mate = M.P.find(q => q.team === me.team && q !== me); M.phase = 'live'; M.needClear = false; M.clock = 14;
  const h = opp[0], off = opp[1]; h.x = -3; h.z = 7; off.x = 4; off.z = 4; M.B.state = 'held'; M.B.holder = h; M.off = h.team; for (const q of opp) { q.st = 'free'; q.ai.tick = 999; q.aiLvl = 0; q.vx = q.vz = 0; q.in = { dx: 0, dz: 0 }; q.user = true; q.ctrl = 5; }
  while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  mate.x = -3; mate.z = 5.6; mate.ai.tick = 999; me.x = meX; me.z = meZ; me.vx = me.vz = 0; for (const k in P.keys) P.keys[k] = false; window.__tick(50);
  const ang = (a, b) => Math.atan2(b.x - a.x, b.z - a.z), d = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
  return { toMan: +d(me.face, ang(me, off)).toFixed(2), toBall: +d(me.face, ang(me, h)).toFixed(2), guard: me.guard && me.guard.b.name, man: off.b.name, holder: h.b.name, dMan: +Math.hypot(me.x - off.x, me.z - off.z).toFixed(1) }; }, [meX, meZ]);
let r = await setup(4, 2.9); ok(r.guard === r.man && r.toMan < 0.2 && r.toBall > 0.6, `tight on my man off the ball (${r.dMan} m): body faces him (off by ${r.toMan} rad), not the ball (${r.toBall} rad away)`);
await p.screenshot({ path: path.join(dir, 'shots', 'defend.png'), timeout: 120000 });
r = await setup(2.6, 2.6); ok(r.toMan > 0.1 && r.toBall > 0.1 && r.toMan < r.toBall + 0.9, `sagging off (${r.dMan} m): opened up between man (${r.toMan}) and ball (${r.toBall})`);
r = await setup(-3, 5.8); ok(r.guard === r.holder && r.toBall < 0.2, `on the ball handler: square to him (off by ${r.toBall} rad)`);
const tags = await p.evaluate(() => __pit.MT.P.map(q => q.rig.root.children.filter(c => c.isSprite).length)); ok(tags.every(n => n >= 1), 'every player has a name tag: ' + tags.join(','));
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
