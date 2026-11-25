// Movement / animation feel, measured. Drives the real game loop frame by frame at a chosen frame rate with real key
// presses, and reports numbers that can be compared between builds:
//   node tests/feel.mjs [file.html]          (default: ../index.html)
// Metrics
//   reverse.flipMs    time from pressing the opposite way at full sprint until the player is moving that way
//   reverse.fullMs    ... until back at 90% of top speed
//   footSlide         how fast the planted foot moves over the ground, as a share of body speed (0 = perfectly planted)
//   ballHand.contact  share of dribble frames where the ball is in the dribbling hand (within 0.16 m) or in clean flight
//   ballHand.jump     largest ball jump between two frames, m/s (anything over ~14 is a teleport)
//   moveSteer         how far the player can still steer during a crossover (m of lateral change; 0 = locked)
//   spam.longestLock  longest time stuck in one action while mashing everything, ms
//   fps.drift         spread in where the same 2.4 s of input ends up at 30, 60 and 120 FPS, m
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const file = path.resolve(process.argv[2] || process.env.GN_HTML || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 640, height: 360 } });
// take the frame loop away from the browser: the test calls it with exact timestamps
await ctx.addInitScript(() => { window.__raf = null; window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = (n, ms) => { for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10, 16.67));
const run = (fps, script) => page.evaluate(([fps, script]) => {
  const P = __pit, K = P.keys, ms = 1000 / fps, log = [];
  const foot = (R, s) => { const kn = R.joints['kn' + s]; const f = R.joints['an' + s] || kn.children.find(c => c.isGroup); return f.getWorldPosition(new THREE.Vector3()); };
  // a fresh practice court, everyone else gone; the player stands still at the top of the key with the ball
  for (const k in K) K[k] = false; P.startPractice('free'); window.__tick(Math.round(2.6 * fps), ms);
  const M = P.MT, me = M.me; me.x = -4; me.z = 6; me.vx = me.vz = 0; me.face = Math.PI / 2; me.stam = 100; M.phase = 'live'; M.B.state = 'held'; M.B.holder = me; me.st = 'free';
  window.__tick(Math.round(0.5 * fps), ms);
  let t = 0;
  for (const [dur, keys] of script) {
    for (const k in K) K[k] = false; for (const k of keys) K[k] = true;
    const n = Math.round(dur * fps);
    for (let i = 0; i < n; i++) {
      window.__tick(1, ms); t += ms / 1000; const R = me.rig;
      const fR = foot(R, 'R'), fL = foot(R, 'L'), hR = R.handR.getWorldPosition(new THREE.Vector3()), hL = R.handL.getWorldPosition(new THREE.Vector3());
      log.push({ t, keys: keys.join('+'), x: me.x, z: me.z, vx: me.vx, vz: me.vz, st: me.st, fR: [fR.x, fR.y, fR.z], fL: [fL.x, fL.y, fL.z], hR: [hR.x, hR.y, hR.z], hL: [hL.x, hL.y, hL.z], b: [M.B.pos.x, M.B.pos.y, M.B.pos.z], bs: M.B.state, hold: M.B.holder === me, ds: me.drib ? me.drib.ph : '', dT: me.drib ? [me.drib.t, me.drib.T, me.drib.F && me.drib.F.x, me.drib.P0 && me.drib.P0.x, me.avx] : null });
    }
  }
  return log;
}, [fps, script]);
const R = {};
// 1. sprint right, reverse, sprint left
const rev = [[0.3, []], [1.2, ['KeyD', 'ShiftLeft']], [1.2, ['KeyA', 'ShiftLeft']]];
const L60 = await run(60, rev);
const flip = L60.findIndex(f => f.keys === 'KeyA+ShiftLeft'), top = Math.max(...L60.slice(0, flip).map(f => f.vx));
const tNeg = L60.slice(flip).find(f => f.vx < -0.2), t90 = L60.slice(flip).find(f => f.vx < -0.9 * top);
R.reverse = { topSpeed: +top.toFixed(2), flipMs: tNeg ? Math.round((tNeg.t - L60[flip].t) * 1000) : null, fullMs: t90 ? Math.round((t90.t - L60[flip].t) * 1000) : null };
// 2. foot slide: the lower foot is the planted one; measure its ground speed against the body's
const slide = log => { let s = 0, b = 0; for (let i = 1; i < log.length; i++) { const a = log[i - 1], c = log[i], dt = c.t - a.t, body = Math.hypot(c.x - a.x, c.z - a.z) / dt; if (body < 1) continue; const k = c.fR[1] < c.fL[1] ? 'fR' : 'fL'; if (Math.min(c.fR[1], c.fL[1]) > 0.12) continue; const fv = Math.hypot(c[k][0] - a[k][0], c[k][2] - a[k][2]) / dt; s += fv; b += body; } return b ? +(s / b).toFixed(3) : null; };
R.footSlide = slide(L60);
// 3. dribbling diagonally, then a crossover (skill stick left) while still holding the diagonal
const drib = [[0.2, []], [1.6, ['KeyW', 'KeyD']], [0.08, ['KeyW', 'KeyD', 'KeyJ']], [0.9, ['KeyW', 'KeyD']], [0.08, ['KeyW', 'KeyD', 'KeyL']], [0.9, ['KeyW', 'KeyD']]];
const D = await run(60, drib);
let inHand = 0, flight = 0, n = 0, jump = 0;
for (let i = 1; i < D.length; i++) { const c = D[i], a = D[i - 1]; if (!c.hold) continue; n++; const dh = Math.min(Math.hypot(c.b[0] - c.hR[0], c.b[1] - c.hR[1], c.b[2] - c.hR[2]), Math.hypot(c.b[0] - c.hL[0], c.b[1] - c.hL[1], c.b[2] - c.hL[2])); if (dh < 0.16) inHand++; else if (c.ds === 'down' || c.ds === 'up') flight++; const j = Math.hypot(c.b[0] - a.b[0], c.b[1] - a.b[1], c.b[2] - a.b[2]) / (c.t - a.t); if (j > jump) { jump = j; R.jumpAt = a.ds + '>' + c.ds + ' ' + c.st; } }
R.ballHand = { contact: +((inHand + flight) / n).toFixed(2), inHandOnly: +(inHand / n).toFixed(2), jump: +jump.toFixed(1) };
// how much a held diagonal still steers during the crossover
const ci = D.findIndex(f => f.keys.includes('KeyJ')), during = D.slice(ci, ci + 18).filter(f => f.st === 'move');
R.moveSteer = during.length ? +Math.abs((during[during.length - 1].z - during[0].z)).toFixed(2) : 0;
// 4. mash everything for 4 s
const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyE', 'KeyI', 'KeyJ', 'KeyK', 'KeyL', 'ShiftLeft']; const mash = [];
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 100; i++) mash.push([0.04, keys.filter(() => rnd() < 0.3)]);
const S = await run(60, mash); let longest = 0, cur = 0, prev = '';
for (const f of S) { if (f.st !== 'free' && f.st === prev) cur += 1000 / 60; else cur = 0; prev = f.st; longest = Math.max(longest, cur); }
R.spam = { longestLockMs: Math.round(longest), statesSeen: [...new Set(S.map(f => f.st))].join(',') };
// 5. the same input at 30, 60 and 120 FPS
const fpsRun = [[0.2, []], [0.8, ['KeyD', 'ShiftLeft']], [0.6, ['KeyW']], [0.8, ['KeyA']]]; const ends = [];
for (const fps of [30, 60, 120]) { const L = await run(fps, fpsRun); const e = L[L.length - 1]; ends.push([+e.x.toFixed(3), +e.z.toFixed(3)]); }
R.fps = { ends, drift: +Math.max(Math.hypot(ends[0][0] - ends[1][0], ends[0][1] - ends[1][1]), Math.hypot(ends[2][0] - ends[1][0], ends[2][1] - ends[1][1])).toFixed(3) };
console.log(JSON.stringify(R, null, 1)); await browser.close();
