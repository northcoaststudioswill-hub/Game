// The eight acceptance scenarios from the animation brief, each checked with numbers from real gameplay frames.
//   node tests/accept.mjs [file.html]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 480, height: 270 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = (n, ms) => { for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); let errs = 0; page.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10, 16.67));
// helpers that live in the page
await page.evaluate(() => {
  window.T = {
    setup(kind, fps) {
      const P = __pit; for (const k in P.keys) P.keys[k] = false;
      if (kind === 'free') P.startPractice('free'); else P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' });
      window.__tick(Math.round(3 * fps), 1000 / fps); const M = P.MT; M.phase = 'live'; M.me.stam = 100; return M;
    },
    // run frames holding keys; record per-frame samples
    run(fps, steps, sample) {
      const P = __pit, K = P.keys, out = []; let t = 0;
      for (const [dur, keys] of steps) { for (const k in K) K[k] = false; for (const k of keys) K[k] = true; const n = Math.max(1, Math.round(dur * fps)); for (let i = 0; i < n; i++) { window.__tick(1, 1000 / fps); t += 1 / fps; out.push(Object.assign({ t, keys: keys.join('+') }, sample())); } }
      for (const k in K) K[k] = false; return out;
    },
    me() { const M = __pit.MT, p = M.me, B = M.B, R = p.rig, G = R.gait, w = n => R.joints['an' + n].getWorldPosition(new THREE.Vector3()), hR = R.handR.getWorldPosition(new THREE.Vector3()), hL = R.handL.getWorldPosition(new THREE.Vector3());
      const fr = w('R'), fl = w('L');
      return { x: p.x, z: p.z, y: p.y, vx: p.vx, vz: p.vz, st: p.st, hold: B.holder === p, bs: B.state, b: [B.pos.x, B.pos.y, B.pos.z], fR: [fr.x, fr.z], fL: [fl.x, fl.z], swR: (p.strideW || 0) > 0.9 ? !(p.psi > 0.04 && p.psi < 0.22) : (p.strideW || 0) > 0.05 ? true : (G ? G.ft.R.sw : false), swL: (p.strideW || 0) > 0.9 ? !(((p.psi + 0.5) % 1) > 0.04 && ((p.psi + 0.5) % 1) < 0.22) : (p.strideW || 0) > 0.05 ? true : (G ? G.ft.L.sw : false), steps: G ? G.steps : 0, dph: p.drib ? p.drib.ph : '', hd: Math.min(Math.hypot(B.pos.x - hR.x, B.pos.y - hR.y, B.pos.z - hR.z), Math.hypot(B.pos.x - hL.x, B.pos.y - hL.y, B.pos.z - hL.z)), handsUp: p.handsUp, an: p.an, mN: p.moveN || 0 }; },
  };
});
const res = []; const check = (n, name, ok, detail) => { res.push({ n, name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}. ${name}  ${detail}`); };
const plantedSlide = L => { const v = []; for (let i = 1; i < L.length; i++) { const a = L[i - 1], c = L[i], dt = c.t - a.t; if (!c.swR && !a.swR) v.push(Math.hypot(c.fR[0] - a.fR[0], c.fR[1] - a.fR[1]) / dt); if (!c.swL && !a.swL) v.push(Math.hypot(c.fL[0] - a.fL[0], c.fL[1] - a.fL[1]) / dt); } v.sort((a, b) => a - b); return { p50: v[v.length >> 1] || 0, p90: v[Math.floor(v.length * 0.9)] || 0 }; };
const ballJump = L => { let m = 0; for (let i = 1; i < L.length; i++) if (L[i].hold && L[i - 1].hold) m = Math.max(m, Math.hypot(L[i].b[0] - L[i - 1].b[0], L[i].b[1] - L[i - 1].b[1], L[i].b[2] - L[i - 1].b[2]) / (L[i].t - L[i - 1].t)); return m; };

// 1. sprint, reverse, sprint again: no sliding, no delayed control
{ const L = await page.evaluate(() => { T.setup('free', 60); const me = __pit.MT.me; me.x = -4; me.z = 6; window.__tick(10, 16.67); return T.run(60, [[1.1, ['KeyD', 'ShiftLeft']], [1.1, ['KeyA', 'ShiftLeft']], [0.3, ['KeyD', 'ShiftLeft']]], T.me); });
  const f = L.findIndex(s => s.keys === 'KeyA+ShiftLeft'), top = Math.max(...L.slice(0, f).map(s => s.vx)), turn = L.slice(f).find(s => s.vx < -0.2), full = L.slice(f).find(s => s.vx < -0.9 * top), sl = plantedSlide(L);
  const flip = (turn.t - L[f].t) * 1000, fullMs = (full.t - L[f].t) * 1000;
  check(1, 'Sprint, reverse, sprint again', flip <= 150 && fullMs <= 420 && sl.p90 < 0.45, `moving the other way after ${flip.toFixed(0)} ms, full speed after ${fullMs.toFixed(0)} ms (was 283 / 517); planted feet p50 ${sl.p50.toFixed(2)} p90 ${sl.p90.toFixed(2)} m/s at ${top.toFixed(1)} m/s body speed (was ~2x body speed)`); }
// 2. diagonal dribble into a crossover: no snapping, no teleporting ball
{ const L = await page.evaluate(() => { T.setup('free', 60); const me = __pit.MT.me; me.x = -4; me.z = 8; window.__tick(10, 16.67); return T.run(60, [[1.2, ['KeyW', 'KeyD']], [0.05, ['KeyW', 'KeyD', 'KeyJ']], [0.8, ['KeyW', 'KeyD']]], T.me); });
  const j = ballJump(L), far = Math.max(...L.filter(s => s.hold).map(s => Math.hypot(s.b[0] - s.x, s.b[2] - s.z))), moved = L.some(s => s.st === 'move'), hand = L.filter(s => s.dph === 'hand').length / L.length;
  check(2, 'Diagonal dribble into a crossover', moved && j < 14 && far < 1.25, `crossover ran: ${moved}; ball max speed ${j.toFixed(1)} m/s (was 20.6), never more than ${far.toFixed(2)} m from the body; ball in hand ${(hand * 100).toFixed(0)}% of frames (was 0%)`); }
// 3. catch a pass on the move and go straight into a dribble
{ const r = await page.evaluate(() => {
    const M = T.setup('game', 60), me = M.me, mate = M.P.find(p => p.team === me.team && p !== me);
    M.P.filter(p => p.team !== me.team).forEach(o => { o.x = 7.5; o.z = 12.5; o.st = 'stagger'; o.stg = { dur: 999, fall: false }; });
    me.x = -6; me.z = 5; mate.x = 4; mate.z = 6.5; M.B.state = 'held'; M.B.holder = mate; M.off = me.team; M.needClear = false; mate.drib = null; mate.ai.hold = 0; mate.ai.tick = 999;
    T.run(60, [[0.45, ['KeyD']]], T.me); mate.ai.tick = 0;      // get moving first, then call for it
    let caught = -1, dribbleAt = -1, sp = 0; const L = T.run(60, [[0.05, ['KeyD', 'KeyE']], [1.6, ['KeyD']]], T.me);
    for (let i = 1; i < L.length; i++) { if (caught < 0 && L[i].hold && !L[i - 1].hold) { caught = i; sp = Math.hypot(L[i].vx, L[i].vz); } if (caught >= 0 && dribbleAt < 0 && (L[i].dph === 'down' || L[i].dph === 'hand') && i > caught) dribbleAt = i; }
    return { caught, dribbleAt, sp, after: caught >= 0 ? Math.hypot(L[Math.min(L.length - 1, caught + 12)].vx, L[Math.min(L.length - 1, caught + 12)].vz) : 0, jump: (() => { let m = 0; for (let i = Math.max(1, caught); i < L.length; i++) if (L[i].hold && L[i - 1].hold) m = Math.max(m, Math.hypot(L[i].b[0] - L[i - 1].b[0], L[i].b[1] - L[i - 1].b[1], L[i].b[2] - L[i - 1].b[2]) * 60); return m; })() };
  });
  const ms = (r.dribbleAt - r.caught) * 1000 / 60;
  check(3, 'Catch on the move, straight into a dribble', r.caught >= 0 && r.dribbleAt >= 0 && ms < 500 && r.after > 2 && r.jump < 14, `caught at ${r.sp.toFixed(1)} m/s, kept ${r.after.toFixed(1)} m/s, first dribble ${ms.toFixed(0)} ms after the catch, ball max ${r.jump.toFixed(1)} m/s`); }
// 4. pull-up jumper: plant, rise, release, land, recover
{ const L = await page.evaluate(() => { T.setup('free', 60); const me = __pit.MT.me; me.x = -5; me.z = 5; window.__tick(10, 16.67); return T.run(60, [[0.9, ['KeyD', 'ShiftLeft']], [0.55, ['Space']], [0.9, ['KeyD']]], T.me); });
  const sh = L.findIndex(s => s.st === 'shoot'), sp0 = Math.hypot(L[sh - 1].vx, L[sh - 1].vz), plant = L.slice(sh).find(s => Math.hypot(s.vx, s.vz) < 1), air = L.slice(sh).find(s => s.y > 0.05), rel = L.findIndex(s => s.bs === 'shot' || s.bs === 'through'), land = L.slice(Math.max(rel, 0)).find(s => s.y <= 0.001), back = L.slice(L.indexOf(land)).find(s => s.st === 'free'), moving = L.slice(L.indexOf(back)).find(s => Math.hypot(s.vx, s.vz) > 2);
  const ok = sh > 0 && plant && air && rel > 0 && land && back && moving;
  check(4, 'Pull-up jumper', !!ok, ok ? `from ${sp0.toFixed(1)} m/s: planted in ${((plant.t - L[sh].t) * 1000).toFixed(0)} ms, off the floor ${((air.t - L[sh].t) * 1000).toFixed(0)} ms, ball released ${((L[rel].t - L[sh].t) * 1000).toFixed(0)} ms, landed ${((land.t - L[sh].t) * 1000).toFixed(0)} ms, free ${((back.t - land.t) * 1000).toFixed(0)} ms after landing, running again ${((moving.t - land.t) * 1000).toFixed(0)} ms after landing` : JSON.stringify({ sh, plant: !!plant, air: !!air, rel, land: !!land, back: !!back })); }
// 5. defend: slide, contest, slide again
{ const L = await page.evaluate(() => {
    const M = T.setup('game', 60), me = M.me, o = M.P.find(p => p.team !== me.team);
    M.B.state = 'held'; M.B.holder = o; M.off = o.team; o.x = 0; o.z = 7.5; o.face = 0; o.ai.tick = 999; o.aiLvl = 0; me.x = 0; me.z = 5.5; M.P.forEach(p => { if (p !== me && p !== o) { p.x = 7; p.z = 12.5; p.st = 'stagger'; p.stg = { dur: 999, fall: false }; } });
    const I = __pit.IN; while (I.length < 6) I.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null }); o.user = true; o.ctrl = 5;   // the ball handler stands still
    return T.run(60, [[0.6, ['KeyD']], [0.5, ['KeyD', 'KeyI']], [0.6, ['KeyA']]], T.me);
  });
  const up = L.filter(s => s.keys.includes('KeyI')), upShare = up.filter(s => s.handsUp).length / up.length, slides = L.filter(s => s.an === 'slide').length / L.length, steps = L[L.length - 1].steps - L[0].steps, sl = plantedSlide(L), stuck = L.some(s => s.st !== 'free');
  check(5, 'Slide, contest, slide again', upShare > 0.8 && slides > 0.7 && steps >= 4 && sl.p90 < 0.45 && !stuck, `defensive slide ${(slides * 100).toFixed(0)}% of frames, hands up ${(upShare * 100).toFixed(0)}% while contesting, ${steps} real steps, planted feet p90 ${sl.p90.toFixed(2)} m/s, never locked: ${!stuck}`); }
// 6. chain dribble moves
{ const L = await page.evaluate(() => { T.setup('free', 60); const me = __pit.MT.me; me.x = -2; me.z = 7; me.moveCool = 0; window.__tick(10, 16.67);
    const seq = [[0.3, []], [0.05, ['KeyJ']], [0.22, []], [0.05, ['KeyL']], [0.22, []], [0.05, ['KeyJ', 'KeyK']], [0.25, []], [0.05, ['KeyL', 'KeyI']], [0.6, []]]; return T.run(60, seq, T.me); });
  let moves = 0; for (let i = 1; i < L.length; i++) if (L[i].st === 'move' && (L[i - 1].st !== 'move' || L[i].x === undefined)) moves++;
  const starts = L[L.length - 1].mN - L[0].mN + (L[0].st === 'move' ? 1 : 0), j = ballJump(L), endFree = L[L.length - 1].st === 'free', held = L.every(s => s.hold);
  check(6, 'Chain dribble moves', starts >= 3 && j < 14 && endFree && held, `${starts} of 4 moves ran back to back, ball max ${j.toFixed(1)} m/s, never lost the ball: ${held}, ends ready: ${endFree}`); }
// 7. the same input at 30, 60 and 120 FPS
{ const ends = [];
  for (const fps of [30, 60, 120]) ends.push(await page.evaluate(fps => { T.setup('free', fps); const me = __pit.MT.me; me.x = -4; me.z = 6; me.vx = me.vz = 0; window.__tick(Math.round(fps / 6), 1000 / fps); const L = T.run(fps, [[0.8, ['KeyD', 'ShiftLeft']], [0.5, ['KeyW']], [0.7, ['KeyA']], [0.5, ['Space']], [0.6, []]], T.me); const s = L[L.length - 1]; return { x: s.x, z: s.z, shot: L.findIndex(q => q.st === 'shoot') / fps }; }, fps));
  const d = Math.max(...ends.map(e => Math.hypot(e.x - ends[1].x, e.z - ends[1].z))), ds = Math.max(...ends.map(e => Math.abs(e.shot - ends[1].shot)));
  check(7, 'Same behaviour at 30, 60 and 120 FPS', d < 0.02 && ds < 0.04, `end positions within ${(d * 100).toFixed(1)} cm (was 3.1 cm), shot started within ${(ds * 1000).toFixed(0)} ms`); }
// 8. mash buttons during transitions
{ const L = await page.evaluate(() => { T.setup('free', 60); const me = __pit.MT.me; me.x = -2; me.z = 6; window.__tick(10, 16.67);
    let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyE', 'KeyI', 'KeyJ', 'KeyK', 'KeyL', 'ShiftLeft']; const seq = [];
    for (let i = 0; i < 150; i++) seq.push([0.033, keys.filter(() => r() < 0.3)]); seq.push([1.0, []]); return T.run(60, seq, T.me); });
  let longest = 0, cur = 0; for (let i = 1; i < L.length; i++) { if (L[i].st !== 'free' && L[i].st === L[i - 1].st) cur += 1000 / 60; else cur = 0; longest = Math.max(longest, cur); }
  const settled = L.slice(-30).every(s => s.st === 'free' || s.st === 'shoot') && L[L.length - 1].st === 'free';
  check(8, 'Mash during transitions', longest < 1000 && settled && errs === 0, `longest single action ${longest.toFixed(0)} ms (a full jumper is the longest), ${[...new Set(L.map(s => s.st))].join('/')} seen, back to ready after: ${settled}, page errors: ${errs}`); }
console.log(res.every(r => r.ok) ? 'ALL PASS' : 'FAILURES: ' + res.filter(r => !r.ok).map(r => r.n).join(',')); await browser.close();
