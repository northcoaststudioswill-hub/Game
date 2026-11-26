// The ball on every kind of run: the user dribbles through scripted runs on an empty court and, frame by frame, we measure
// the ball against the body: hits on a leg, bounces on a foot, gap to the hand at the catch, ball speed, ball behind the
// runner, bounce rate against step rate. Then AI dribblers in real games. --shots saves a strip of frames per run.
// node tests/dribscan.mjs [--shots] [--only=name]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const RUNSTYLE = (process.argv.find(a => a.startsWith('--run=')) || '').slice(6); const dir = path.dirname(fileURLToPath(import.meta.url)), shots = process.argv.includes('--shots'), only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7), out = path.join(dir, 'shots', 'drib'); if (shots) fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
// a run: list of [seconds, keys held]
const RUNS = {
  stand: [[2.5, []]],
  jog: [[3, ['KeyW']]],
  sprint: [[3, ['KeyW', 'ShiftLeft']]],
  start: [[0.6, []], [2, ['KeyW', 'ShiftLeft']]],
  stop: [[1.6, ['KeyW', 'ShiftLeft']], [1.4, []]],
  curve: [[3, ['KeyW', 'KeyD', 'ShiftLeft']]],
  zigzag: [[0.5, ['KeyW', 'KeyA', 'ShiftLeft']], [0.5, ['KeyW', 'KeyD', 'ShiftLeft']], [0.5, ['KeyW', 'KeyA', 'ShiftLeft']], [0.5, ['KeyW', 'KeyD', 'ShiftLeft']], [0.5, ['KeyW', 'KeyA', 'ShiftLeft']]],
  sideways: [[2.5, ['KeyD']]],
  backpedal: [[1, ['KeyW']], [2, ['KeyS']]],
  uturn: [[1.2, ['KeyW', 'ShiftLeft']], [1.6, ['KeyS', 'ShiftLeft']]],
  stickzig: [[0.3, ['KeyA']], [0.3, ['KeyD']], [0.3, ['KeyA']], [0.3, ['KeyD']], [0.3, ['KeyA']], [0.3, ['KeyD']], [0.3, ['KeyA']], [0.3, ['KeyD']]],
  crosszig: [[0.25, ['KeyW', 'KeyA']], [0.08, ['KeyW', 'KeyA', 'KeyL']], [0.27, ['KeyW', 'KeyD']], [0.08, ['KeyW', 'KeyD', 'KeyJ']], [0.27, ['KeyW', 'KeyA']], [0.08, ['KeyW', 'KeyA', 'KeyL']], [0.27, ['KeyW', 'KeyD']], [0.08, ['KeyW', 'KeyD', 'KeyJ']], [0.27, ['KeyW', 'KeyA']], [0.08, ['KeyW', 'KeyA', 'KeyL']], [0.3, ['KeyW']]],
  flickrun: [[0.5, ['KeyW', 'ShiftLeft']], [0.07, ['KeyW', 'ShiftLeft', 'KeyL']], [0.5, ['KeyW', 'ShiftLeft']], [0.07, ['KeyW', 'ShiftLeft', 'KeyJ']], [0.5, ['KeyW', 'ShiftLeft']], [0.07, ['KeyW', 'ShiftLeft', 'KeyK']], [0.5, ['KeyW']], [0.07, ['KeyW', 'KeyI']], [0.5, ['KeyW']], [0.07, ['KeyW', 'KeyL']], [0.5, ['KeyW']]],
  flickjog: [[0.4, ['KeyW', 'KeyD']], [0.07, ['KeyW', 'KeyD', 'KeyJ']], [0.4, ['KeyW', 'KeyA']], [0.07, ['KeyW', 'KeyA', 'KeyL']], [0.4, ['KeyW', 'KeyD']], [0.07, ['KeyW', 'KeyD', 'KeyJ']], [0.4, ['KeyW', 'KeyA']], [0.07, ['KeyW', 'KeyA', 'KeyL']], [0.5, ['KeyW']]],
  crossrun: [[0.8, ['KeyW', 'ShiftLeft']], [0.1, ['KeyW', 'ShiftLeft', 'KeyL']], [0.9, ['KeyW', 'ShiftLeft']], [0.1, ['KeyW', 'ShiftLeft', 'KeyJ']], [0.9, ['KeyW', 'ShiftLeft']]],
};
const names = Object.keys(RUNS).filter(n => !only || only.split(',').includes(n)); const rows = [];
await p.evaluate((rs) => { if (rs) window.__rs = rs; }, RUNSTYLE); if (process.env.PACK) await p.evaluate((pk) => __pit.ev(`packEquip(PACKS.find(q => q.id === '${pk}'))`), process.env.PACK); await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(40); });
for (const name of names) {
  const segs = RUNS[name]; let frames = [];
  await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me; M.phase = 'live'; M.clock = 99; M.needClear = false; for (const q of M.P) if (q !== me) { q.x = q.team === me.team ? -7 : 7; q.z = 12; q.ai.react = 99; q.cool = 99; q.st = 'free'; q.vx = q.vz = 0; q.frozen = true; } M.B.state = 'held'; M.B.holder = me; me.x = 0; me.z = 9.5; me.face = Math.PI; me.vx = me.vz = 0; me.st = 'free'; me.live = 'drib'; me.drib = null; me.stam = 100; M.off = me.team; if (window.__rs !== undefined && me.rig.prof) me.rig.prof.run = window.__rs; window.__tick(20); for (const q of M.P) if (q !== me) { q.x = q.team === me.team ? -7 : 7; q.z = 12; } });
  for (const [secs, keys] of segs) {
    const n = Math.round(secs * 60);
    for (let f0 = 0; f0 < n; f0 += 10) { const k = Math.min(10, n - f0);
      const r = await p.evaluate(([keys, k, grab]) => { const P = __pit, M = P.MT, me = M.me, K = P.keys; for (const c of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'KeyI', 'KeyJ', 'KeyK', 'KeyL']) K[c] = keys.includes(c); const V = new THREE.Vector3(), A = new THREE.Vector3(), Bv = new THREE.Vector3(), rows = [];
        for (let i = 0; i < k; i++) { window.__tick(1); for (const q of M.P) if (q !== me && M.B.holder === me) { q.x = q.team === me.team ? -7 : 7; q.z = 12; q.vx = q.vz = 0; } if (M.phase !== 'live') { M.phase = 'live'; } let tp = false; if (me.x * me.x + me.z * me.z > 150 || me.z < 1.5) { me.x *= 0.5; me.z = 9; tp = true; window.__tpN = 40; } window.__tpN = Math.max(0, (window.__tpN || 0) - 1);
          P.ev('scene.updateMatrixWorld()'); const R = me.rig, D = me.drib || {}, ball = M.B.mesh.position.clone(), row = { ph: D.ph || '-', hold: M.B.holder === me, st: me.st, bx: ball.x, by: ball.y, bz: ball.z, x: me.x, z: me.z, face: me.face, vx: me.avx || 0, vz: me.avz || 0, hand: D.hand, kind: D.kind || '', tp: window.__tpN > 0, sR: !!me.stR, sL: !!me.stL, sw: me.strideW || 0 };
          const hd = R['hand' + (D.hand || 'R')].getWorldPosition(V); row.hx = hd.x; row.hy = hd.y; row.hz = hd.z;
          // closest distance from the ball centre to each leg bone (hip-knee, knee-ankle) and the feet
          let legMin = 9, footMin = 9, which = ''; for (const s of ['R', 'L']) { const h = R.joints['hp' + s].getWorldPosition(new THREE.Vector3()), kn = R.joints['kn' + s].getWorldPosition(new THREE.Vector3()), an = R.joints['an' + s].getWorldPosition(new THREE.Vector3());
            for (const [a, c, nm] of [[h, kn, 'thigh'], [kn, an, 'shin']]) { const ab = c.clone().sub(a), t = Math.max(0, Math.min(1, ball.clone().sub(a).dot(ab) / ab.lengthSq())), d = ball.distanceTo(a.clone().add(ab.multiplyScalar(t))); if (d < legMin) { legMin = d; which = nm + s; } }
            footMin = Math.min(footMin, Math.hypot(ball.x - an.x, ball.z - an.z) + (ball.y > 0.3 ? 9 : 0)); }
          row.leg = legMin; row.legW = which; row.foot = footMin; rows.push(row); }
        let shot = null; if (grab) { const [sx, sy] = P.ev('project')(me.x, 0.8, me.z); shot = [sx, sy]; } return { rows, shot }; }, [keys, k, shots && (f0 % 20 === 0)]);
      for (const rr of r.rows) rr.n = frames.length + r.rows.indexOf(rr); frames.push(...r.rows);
      if (r.shot && shots) { const w = 200, h = 240, cx = Math.max(0, Math.min(1280 - w, r.shot[0] - w / 2)), cy = Math.max(0, Math.min(720 - h, r.shot[1] - h * 0.55)); await p.screenshot({ path: path.join(out, `${RUNSTYLE ? RUNSTYLE + '-' : ''}${name}-${String(frames.length).padStart(3, '0')}.png`), clip: { x: cx, y: cy, width: w, height: h } }); }
    }
  }
  // analysis
  const row0 = {}; const dt = 1 / 60, held = frames.filter(f => f.hold && (f.st === 'free' || f.st === 'move') && !f.tp); let midTurns = 0; for (let i = 2; i < held.length; i++) { const a = held[i - 2], m = held[i - 1], f = held[i]; if (f.n !== m.n + 1 || m.n !== a.n + 1 || !['up', 'down'].includes(m.ph) || m.ph !== f.ph || a.ph !== m.ph) continue; const W_ = process.env.WORLD ? 0 : 1, v1x = (m.bx - a.bx) - W_ * (m.x - a.x), v1z = (m.bz - a.bz) - W_ * (m.z - a.z), v2x = (f.bx - m.bx) - W_ * (f.x - m.x), v2z = (f.bz - m.bz) - W_ * (f.z - m.z), s1 = Math.hypot(v1x, v1z) * 60, s2 = Math.hypot(v2x, v2z) * 60; if (s1 > 1.5 && s2 > 1.5 && (v1x * v2x + v1z * v2z) / (s1 * s2 / 3600) < 0) { midTurns++; (globalThis.__mt = globalThis.__mt || []).push(name + ':' + m.ph + '/' + (m.kind || 'plain') + '/' + m.st + ' y' + m.by.toFixed(2) + ' ' + s1.toFixed(1) + '→' + s2.toFixed(1)); } }
  let legHits = 0, footBounces = 0, bounces = 0, catchGaps = [], vmax = 0, behind = 0, ahead = 0, jumps = 0, worst = [];
  for (let i = 1; i < held.length; i++) { const a = held[i - 1], f = held[i]; if (f.n !== a.n + 1) continue; const v = Math.hypot(f.bx - a.bx, f.by - a.by, f.bz - a.bz) / dt; if (v > vmax) vmax = v; if (v > 14) { jumps++; if (worst.length < 4) worst.push(`ball ${v.toFixed(1)} m/s (${a.ph}→${f.ph}, ${a.st}→${f.st}, player moved ${Math.hypot(f.x - a.x, f.z - a.z).toFixed(2)} m, ball from hand ${Math.hypot(a.bx - a.hx, a.bz - a.hz).toFixed(2)}→${Math.hypot(f.bx - f.hx, f.bz - f.hz).toFixed(2)})`); }
    if (f.leg < 0.15) { legHits++; if (worst.length < 8 && f.leg < 0.11) worst.push(`ball through the ${f.legW} (${(f.leg * 100).toFixed(0)} cm, ${f.ph})`); }
    if (a.ph === 'down' && f.ph === 'up') { bounces++; if (f.foot < 0.14) footBounces++; }
    if (f.ph === 'hand' || f.ph === 'carry') (row0.hg = row0.hg || []).push(Math.hypot(f.bx - f.hx, f.by + 0.115 - f.hy, f.bz - f.hz)); if (a.ph === 'up' && f.ph === 'hand') catchGaps.push(Math.hypot(f.bx - f.hx, f.by + 0.115 - f.hy, f.bz - f.hz));
    const sp = Math.hypot(f.vx, f.vz); if (sp > 2.5) { const fx = Math.sin(f.face), fz = Math.cos(f.face), fw = (f.bx - f.x) * fx + (f.bz - f.z) * fz; if (fw < -0.05) behind++; if (fw > 1.0) ahead++; } }
  { const strikes = { R: [], L: [] }; for (let i = 1; i < frames.length; i++) { if (frames[i].sR && !frames[i - 1].sR) strikes.R.push(frames[i].n); if (frames[i].sL && !frames[i - 1].sL) strikes.L.push(frames[i].n); }
    let rb = 0, onBeat = 0; for (let i = 1; i < held.length; i++) { const a = held[i - 1], f = held[i]; if (a.ph === 'down' && f.ph === 'up' && f.sw > 0.6 && Math.hypot(f.vx, f.vz) > 2.5) { rb++; const far = (f.hand === 'R' ? strikes.L : strikes.R).concat(Math.hypot(f.vx, f.vz) < 4.5 ? (f.hand === 'R' ? strikes.R : strikes.L) : []); if (far.some(n => Math.abs(n - f.n) <= 4)) onBeat++; } }
    row0.beat = rb ? Math.round(onBeat / rb * 100) + '% of ' + rb : '-'; }
  const secs = held.length / 60, run = held.filter(f => Math.hypot(f.vx, f.vz) > 2.5).length;
  const row = { midTurns, name, secs: +secs.toFixed(1), bounces, perSec: +(bounces / Math.max(0.1, secs)).toFixed(2), legHits, legPct: +(legHits / Math.max(1, held.length) * 100).toFixed(1), footBounces, behindPct: run ? +(behind / run * 100).toFixed(0) : 0, aheadPct: run ? +(ahead / run * 100).toFixed(0) : 0, catchMax: catchGaps.length ? +(Math.max(...catchGaps) * 100).toFixed(0) : 0, vmax: +vmax.toFixed(1), jumps, worst };
  rows.push(row); console.log(`${name.padEnd(9)} ${row.secs}s  bounces ${row.bounces} (${row.perSec}/s)  ball in a leg ${row.legPct}% of frames  bounced on a foot ${row.footBounces}  ball behind the runner ${row.behindPct}%  >1m ahead ${row.aheadPct}%  catch gap max ${row.catchMax} cm  top ball speed ${row.vmax} m/s  speed spikes ${row.jumps}  mid-air turns ${midTurns}  running bounces on a footstep (far foot when fast) ${row0.beat}  hand-to-ball while in hand: median ${row0.hg ? (row0.hg.sort((x, y) => x - y)[row0.hg.length >> 1] * 100).toFixed(0) : '-'} cm, max ${row0.hg ? (Math.max(...row0.hg) * 100).toFixed(0) : '-'} cm${worst.length ? '\n          ' + worst.join(' | ') : ''}`);
}
// AI ball handlers in real 3v3 games
if (!only || only.includes('ai')) {
  const ai = await p.evaluate(() => { const P = __pit; P.call('quitMatch'); window.__tick(5); P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's3'), P.TIERS_COURT[2], { mates: [-1, -1], rival: -1, p2: 'off' }); window.__tick(30); let M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) q.aiLvl = 0.8;
    const st = { frames: 0, leg: 0, spikes: 0, vmax: 0, gapMax: 0, worst: [], hold: 0, runHold: 0 }; let prev = null, prevH = null; const A = new THREE.Vector3(), C = new THREE.Vector3(), Dv = new THREE.Vector3();
    for (let f = 0; f < 60 * 120 && P.MT && P.MT.phase !== 'over'; f++) { window.__tick(1); M = P.MT; const B = M.B, h = B.holder; if (!h || B.state !== 'held' || (h.st !== 'free' && h.st !== 'move') || M.phase !== 'live') { prev = null; continue; }
      for (const q of M.P) { q.__str = q.__str || { R: [], L: [] }; if (q.stR && !q.__pR) q.__str.R.push(f); if (q.stL && !q.__pL) q.__str.L.push(f); q.__pR = !!q.stR; q.__pL = !!q.stL; }
      { const ph = h.drib && h.drib.ph; if (h.__lph === 'down' && ph === 'up' && (h.strideW || 0) > 0.6 && Math.hypot(h.avx || 0, h.avz || 0) > 2.5) (st.bn = st.bn || []).push({ h, f, hand: h.drib.hand, fast: Math.hypot(h.avx || 0, h.avz || 0) >= 4.5 }); h.__lph = ph; }
      P.ev('scene.updateMatrixWorld()'); st.frames++; const ball = B.mesh.position.clone(), R = h.rig;
      if (prev && prevH === h) { const v = ball.distanceTo(prev) * 60; st.vmax = Math.max(st.vmax, v); if (v > 14) { st.spikes++; if (st.worst.length < 5) st.worst.push(`${v.toFixed(0)} m/s ${h.drib && h.drib.ph} ${h.st}`); } }
      prev = ball; prevH = h; let lm = 9; for (const s of ['R', 'L']) { R.joints['hp' + s].getWorldPosition(A); R.joints['kn' + s].getWorldPosition(C); R.joints['an' + s].getWorldPosition(Dv);
        for (const [a, c] of [[A, C], [C, Dv]]) { const ab = c.clone().sub(a), t = Math.max(0, Math.min(1, ball.clone().sub(a).dot(ab) / ab.lengthSq())); lm = Math.min(lm, ball.distanceTo(a.clone().add(ab.multiplyScalar(t)))); } }
      if (lm < 0.15) { st.leg++; const k = (h.drib && h.drib.kind || 'plain') + '/' + (h.drib && h.drib.ph) + (h.protect ? '/protect' : '') + (h.swag ? '/' + h.swag : '') + '/' + h.st + (Math.hypot(h.avx || 0, h.avz || 0) > 2 ? '/moving' : '/still'); st.by = st.by || {}; st.by[k] = (st.by[k] || 0) + 1; } const sp = Math.hypot(h.avx || 0, h.avz || 0); if (h.an === 'hold') { st.hold++; if (sp > 1.6) st.runHold++; } }
    let ok = 0; for (const b of st.bn || []) { const S = b.h.__str || { R: [], L: [] }, far = b.hand === 'R' ? S.L : S.R, near = b.hand === 'R' ? S.R : S.L, cand = b.fast ? far : far.concat(near); if (cand.some(n => Math.abs(n - b.f) <= 4)) ok++; } st.beat = (st.bn || []).length ? Math.round(ok / st.bn.length * 100) + '% of ' + st.bn.length : '-'; delete st.bn;
    return st; });
  console.log(`AI games   ${(ai.frames / 60).toFixed(0)} s of dribbling  ball in a leg ${(ai.leg / Math.max(1, ai.frames) * 100).toFixed(1)}%  top ball speed ${ai.vmax.toFixed(1)} m/s  speed spikes ${ai.spikes}${ai.worst.length ? ' (' + ai.worst.join(', ') + ')' : ''}  running bounces on a footstep ${ai.beat}  holding (not dribbling) ${(ai.hold / Math.max(1, ai.frames) * 100).toFixed(0)}%, of that moving over 1.6 m/s ${ai.runHold} frames\n           leg touches by situation: ${Object.entries(ai.by || {}).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e.join(' ')).join(' · ')}`);
}
if (globalThis.__mt) console.log('mid-air turns: ' + globalThis.__mt.join(' | ')); console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
