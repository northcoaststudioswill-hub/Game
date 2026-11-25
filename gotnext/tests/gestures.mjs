// The move stick picks the finish and the jumper: checks each one from real key presses, plus the Dev Room's max / restore.
// node tests/gestures.mjs [file.html]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 300, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10));
// a strong player so dunks and euro-steps are all available
const before = await page.evaluate(() => { const P = __pit; const o = JSON.stringify({ a: P.S.attrs, vc: P.S.vc, m: P.S.moves }); P.devMax(); return o; });
const cases = [
  // name, start x,z, steps [[ticks, keys]], what to look for
  ['dunk toward the rim', 1.0, 6.5, [[30, ['KeyW', 'ShiftLeft']], [1, ['KeyW', 'ShiftLeft', 'KeyI']], [8, ['KeyW']]], s => s.st === 'finish' && s.type === 'dunk'],
  ['euro step: sideways as you go up', 1.0, 6.5, [[30, ['KeyW', 'ShiftLeft']], [1, ['KeyD', 'ShiftLeft', 'KeyI']], [8, ['KeyD']]], s => s.st === 'finish' && s.euro !== 0],
  ['reverse: away from the rim on the baseline', 5.5, 0.9, [[22, ['KeyA', 'ShiftLeft']], [1, ['KeyD', 'KeyI']], [8, ['KeyD']]], s => s.st === 'finish' && s.turn !== 0],
  ['hop step: let go at speed', 1.0, 7.0, [[30, ['KeyW', 'ShiftLeft']], [1, ['KeyI']], [4, []]], s => s.st === 'hop'],
  ['fadeaway: away from the rim, shoot', 2.0, 4.6, [[10, []], [1, ['KeyS', 'Space']], [12, ['KeyS', 'Space']]], s => s.st === 'shoot' && s.fade],
  ['side-step: sideways from a stand, shoot', 2.0, 4.6, [[10, []], [1, ['KeyD', 'Space']], [12, ['KeyD', 'Space']]], s => s.st === 'shoot' && s.side],
  ['pull-up: let go, shoot', 0.5, 9.0, [[30, ['KeyW', 'ShiftLeft']], [1, ['Space']], [10, ['Space']]], s => s.st === 'shoot' && !s.fade && !s.side],
  ['hop-step jumper: drive from mid-range', 0.5, 6.9, [[6, ['KeyW']], [1, ['KeyW', 'KeyI']], [4, []]], s => s.st === 'hop' && s.next === 'shot'],
];
let fails = 0;
for (const [name, x, z, steps, ok] of cases) {
  await page.evaluate(([x, z]) => { const P = __pit; for (const k in P.keys) P.keys[k] = false; if (!P.MT) P.startPractice('free'); window.__tick(150); const M = P.MT, me = M.me; M.phase = 'live'; M.needClear = false; me.st = 'free'; me.y = 0; me.x = x; me.z = z; me.vx = me.vz = 0; me.lx = x; me.lz = z; me.reset = true; if (M.B.holder !== me) { M.B.state = 'held'; M.B.holder = me; } window.__tick(10); }, [x, z]);
  const seen = [];
  for (const [n, keys] of steps) for (let i = 0; i < n; i++) seen.push(await page.evaluate(keys => { const K = __pit.keys; for (const k in K) K[k] = false; for (const k of keys) K[k] = true; window.__tick(1); const me = __pit.MT.me; return { st: me.st, type: me.finish && me.finish.type, euro: me.finish ? me.finish.euro : 0, turn: me.finish ? me.finish.turn : 0, fade: me.shot && me.shot.fade, side: me.shot && me.shot.side, next: me.hop && me.hop.next, kind: me.finish && (me.finish.type === 'dunk' ? me.finish.style : me.finish.kind) }; }, keys));
  const hit = seen.find(ok); if (!hit) fails++;
  console.log(hit ? 'PASS' : 'FAIL', name.padEnd(44), hit ? JSON.stringify(hit) : 'states: ' + [...new Set(seen.map(s => s.st))].join(','));
  await page.evaluate(() => { const P = __pit; for (const k in P.keys) P.keys[k] = false; window.__tick(90); });
}
const after = await page.evaluate(() => { const P = __pit; P.devRestore(); return JSON.stringify({ a: P.S.attrs, vc: P.S.vc, m: P.S.moves }); });
const rs = after === before; if (!rs) fails++;
console.log(rs ? 'PASS' : 'FAIL', 'Dev Room: max out, then restore gives back the exact player');
console.log(errs.length ? errs.join('\n') + '\n' + errs.length + ' PAGE ERRORS' : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await browser.close();
