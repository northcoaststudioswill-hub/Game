// The defensive right stick picks the hands. For each stick direction: what the defender holds, and which contest a jump
// (B) gives. Saves a strip of stills to shots/defstick.png.  node tests/defstick.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; performance.now = () => window.__now;
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [window.__pad]; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.evaluate(() => { const P = __pit; P.S.tut = 1; P.uiClose && P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(400); });
await p.addStyleTag({ content: 'body > *:not(canvas) { visibility: hidden !important } canvas { visibility: visible !important }' });
const cases = [['none', 0, 0], ['U', 0, -1], ['UL', -0.75, -0.75], ['UR', 0.75, -0.75], ['DL', -0.75, 0.75], ['DR', 0.75, 0.75]];
const shots = [];
for (const [nm, ax, ay] of cases) {
  const r = await p.evaluate(([ax, ay]) => { let out0; const P = __pit, M = P.MT, me = M.me, sh = M.P.find(q => q.team !== me.team);
    for (const q of M.P) if (q !== me && q !== sh) { q.x = 6; q.z = 12; } for (const q of M.P) if (q.ai) { q.ai.react = 99; q.cool = 99; }
    const set = () => { M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = sh; M.off = sh.team; sh.st = 'free'; sh.live = 'drib'; sh.x = 0; sh.z = 6.6; sh.vx = sh.vz = 0; me.x = 0; me.z = 5.6; me.vx = me.vz = 0; me.face = 0; };
    set(); me.st = 'free'; me.y = 0; window.__pad.axes = [0, 0, ax, ay]; for (let i = 0; i < 30; i++) { set(); window.__tick(1); } out0 = [M.phase, me.st, M.B.holder === sh, me.def];
    const out = { hs: me.handSel || null, up: !!me.handsUp, ctx: out0 };
    // a jump with the stick held
    P.startShot(sh, 'ai'); window.__tick(8); window.__pad.buttons[3].pressed = true; window.__tick(2); window.__pad.buttons[3].pressed = false; window.__tick(10);
    out.jv = me.jv; out.st = me.st; out.jh = me.jHand; return out; }, [ax, ay]);
  // a still of the held hands
  await p.evaluate(([ax, ay]) => { const P = __pit, M = P.MT, me = M.me, sh = M.P.find(q => q.team !== me.team); window.__tick(60);
    for (let i = 0; i < 20; i++) { M.phase = 'live'; M.B.state = 'held'; M.B.holder = sh; M.off = sh.team; sh.st = 'free'; sh.x = 0; sh.z = 6.6; me.st = 'free'; me.x = 0; me.z = 5.6; me.face = 0; me.vx = me.vz = 0; window.__pad.axes = [0, 0, ax, ay]; window.__tick(1); } }, [ax, ay]);
  const buf = await p.screenshot({ clip: { x: 200, y: 250, width: 240, height: 230 }, scale: 'css' }); shots.push([nm, buf.toString('base64')]);
  console.log(nm.padEnd(5), JSON.stringify(r));
  const want = { none: [null, false], U: ['B', true], UL: [null, true], UR: [null, true], DL: [null, false], DR: [null, false] }[nm];
  if (nm === 'U') ok(r.hs === 'B' && r.jv === 0, 'U: both hands, two-hand jump');
  if (nm === 'UL' || nm === 'UR') ok((r.hs === 'L' || r.hs === 'R') && r.up && (r.jh === r.hs), nm + ': one hand ' + r.hs + ', jump uses it');
  if (nm === 'DL' || nm === 'DR') ok(r.hs && r.hs.startsWith('low') && !r.up, nm + ': low hands ' + r.hs);
  if (nm === 'none') ok(!r.hs, 'no stick: nothing held, jump by spacing (jv ' + r.jv + ')');
}
const ul = (await Promise.resolve(0)), html = '<body style="margin:0;background:#111;display:flex">' + shots.map(([n, s]) => `<div style="color:#fff;font:14px sans-serif;text-align:center"><img style="width:290px" src="data:image/png;base64,${s}"><br>${n}</div>`).join('') + '</body>';
const q = await ctx.newPage(); await q.setViewportSize({ width: 1800, height: 360 }); await q.setContent(html); await q.screenshot({ path: path.resolve(dir, 'shots', 'defstick.png') });
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); console.log(fails ? fails + ' FAIL' : 'ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
