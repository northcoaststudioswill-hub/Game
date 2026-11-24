// GOT NEXT — the run inside the cage on the Block: four hoopers actually playing 2v2, with a ball, passes, drives,
// jumpers, rebounds and possessions, and people on the bleachers reacting. Lightweight and scripted (not the match
// engine), so it costs little to draw behind you while you walk around.
'use strict';
// court-local coordinates are the match's: rim at (0, 0), the top of the key toward +z. World = local + (ox, oz).
const PARK = { ox: 0, oz: -28 };
function parkInit(sc) {
  const K = W.park = { P: [], off: 0, phase: 'setup', t: 0, fans: [], ball: { mesh: makeBall('bl_std'), st: 'held', h: null, p0: new THREE.Vector3(), p1: new THREE.Vector3(), t: 0, T: 1, apex: 1, make: false, vel: new THREE.Vector3() }, score: [0, 0] };
  sc.add(K.ball.mesh);
  for (let i = 0; i < 4; i++) { const b = aiBuild(rnd(70, 95)); b.worn = randomWorn(3); const r = makeRig(b); sc.add(r.root);
    K.P.push({ i, team: i < 2 ? 0 : 1, r, x: 0, z: 6, y: 0, vx: 0, vz: 0, face: Math.PI, tx: 0, tz: 6, st: 'run', t: 0, ph: rnd(0, 6), man: null, name: b.name }); }
  K.P[0].man = K.P[2]; K.P[1].man = K.P[3]; K.P[2].man = K.P[0]; K.P[3].man = K.P[1];
  // the bleachers behind the far baseline
  for (let i = 0; i < 7; i++) { const b = aiBuild(Math.round(rnd(55, 70))); b.name = 'PARK' + i; const r = makeRig(b, true); const x = -5 + i * 1.7, z = -31 - (i % 3) * 0.9, y = 0.5 + (i % 3) * 0.45; r.root.position.set(x, y, z); r.root.rotation.y = 0; r.shadow.visible = false; sc.add(r.root);
    K.fans.push({ r, x, z, face: 0, ph: rnd(0, 6), prof: r.prof, amb: pick(CROWD_AMBIENT), ambT: rnd(2, 8), react: null }); }
  parkReset(K);
}
const PK_SPOTS = [[0, 7.2], [-4.6, 4.4], [4.6, 4.4], [-6.2, 0.6], [6.2, 0.6], [-2.6, 2.2], [2.6, 2.2]];
function parkReset(K) {
  const o = K.P.filter(p => p.team === K.off), d = K.P.filter(p => p.team !== K.off);
  o[0].tx = 0; o[0].tz = 8.2; o[1].tx = pick([-4.6, 4.6]); o[1].tz = 4.4;
  for (const p of K.P) { p.st = 'run'; p.y = 0; }
  K.ball.st = 'held'; K.ball.h = o[0]; K.phase = 'setup'; K.t = 0; K.nextAct = rnd(1.6, 3.4);
}
function pkHandler(K) { return K.ball.st === 'held' ? K.ball.h : null; }
function parkReact(play, team) { for (const f of W.park.fans) if (Math.random() < 0.85) f.react = { kind: crowdReaction(play, undefined), t: -rnd(0, 0.3), dur: rnd(1.4, 2.4) }; }
function parkStep(dt) {
  const K = W.park; if (!K) return; K.t += dt; const B = K.ball, h = pkHandler(K);
  const off = K.P.filter(p => p.team === K.off), def = K.P.filter(p => p.team !== K.off);
  // ---- decisions ----
  if (K.phase === 'setup' && K.t > 1.2) { K.phase = 'play'; K.t = 0; }
  if (K.phase === 'play' && h && h.st === 'run') {
    K.nextAct -= dt; const d = Math.hypot(h.x, h.z);
    if (h.drive) { h.tx = 0; h.tz = 0.9; if (d < 1.9) { h.drive = false; h.st = Math.random() < 0.45 && h.r.H > 1.95 ? 'dunk' : 'layup'; h.t = 0; } }
    else if (K.nextAct <= 0) {
      const r = Math.random(), mate = off.find(p => p !== h);
      if (r < 0.38) { B.st = 'pass'; B.h = null; B.from = h; B.to = mate; B.t = 0; B.T = 0.45; handPos(h.r, 'R', B.p0); h.st = 'pass'; h.t = 0; }
      else if (r < 0.68) { h.drive = true; }
      else if (d < 7.6) { h.st = 'shoot'; h.t = 0; h.face = Math.atan2(-h.x, -h.z); }
      K.nextAct = rnd(1.4, 3.2);
    } else if (Math.random() < dt * 1.2) { const s = pick(PK_SPOTS); h.tx = lerp(h.x, s[0], 0.5); h.tz = lerp(h.z, s[1], 0.5); }      /* jab and probe */
  }
  for (const p of off) if (p !== h && p.st === 'run' && Math.random() < dt * 0.45) { const s = pick(PK_SPOTS); p.tx = s[0]; p.tz = s[1]; }      /* off the ball: relocate */
  for (const p of def) if (p.st === 'run') { const m = p.man, md = Math.hypot(m.x, m.z) || 1, k = m === h ? 1.1 : 1.7; p.tx = m.x - m.x / md * k; p.tz = m.z - m.z / md * k; }
  // ---- states ----
  for (const p of K.P) {
    p.t += dt;
    if (p.st === 'shoot') { if (p.t >= 0.6 && B.h === p) { handPos(p.r, 'R', B.p0); const d = Math.hypot(p.x, p.z); B.st = 'shot'; B.h = null; B.t = 0; B.T = 0.75 + d * 0.06; B.apex = 1.6 + d * 0.12; B.make = Math.random() < 0.5; B.from = p; for (const q of def) if (Math.hypot(q.x - p.x, q.z - p.z) < 2.2) { q.st = 'contest'; q.t = 0; } } if (p.t > 1.0) { p.st = 'run'; p.y = 0; } }
    else if (p.st === 'layup' || p.st === 'dunk') { const dur = p.st === 'dunk' ? 0.9 : 0.8, u = p.t / dur; p.tx = 0; p.tz = 0.3; if (u > 0.55 && B.h === p) { handPos(p.r, 'R', B.p0); B.st = 'shot'; B.h = null; B.t = 0; B.T = p.st === 'dunk' ? 0.12 : 0.45; B.apex = p.st === 'dunk' ? 0.05 : 0.5; B.make = Math.random() < (p.st === 'dunk' ? 0.92 : 0.72); B.from = p; B.dunk = p.st === 'dunk'; } if (u >= 1) { p.st = 'run'; p.y = 0; } }
    else if (p.st === 'pass' || p.st === 'contest') { if (p.t > (p.st === 'pass' ? 0.35 : 0.7)) { p.st = 'run'; p.y = 0; } }
  }
  // ---- the ball ----
  if (B.st === 'pass') { B.t += dt; const to = B.to, u = Math.min(1, B.t / B.T); handPos(to.r, 'R', B.p1); B.mesh.position.lerpVectors(B.p0, B.p1, u); B.mesh.position.y += Math.sin(u * Math.PI) * 0.3; if (u >= 1) { B.st = 'held'; B.h = to; } }
  else if (B.st === 'shot') { B.t += dt; const u = Math.min(1, B.t / B.T); B.p1.set(PARK.ox + (B.make ? 0 : rnd(-0.05, 0.05)), HOOP_Y + 0.1, PARK.oz + 0.05); B.mesh.position.lerpVectors(B.p0, B.p1, u); B.mesh.position.y += Math.sin(u * Math.PI) * B.apex;
    if (u >= 1) { if (B.make) { B.st = 'drop'; B.t = 0; const sc = B.from.team; K.score[sc] += 1; parkReact(B.dunk ? 'dunk' : 'score'); sfxNear('swish', PARK.ox, PARK.oz, 14); K.phase = 'made'; K.t = 0; K.madeBy = sc; }
      else { B.st = 'loose'; B.vel.set(rnd(-3.5, 3.5), rnd(2, 3.5), rnd(1.5, 4)); sfxNear('rim', PARK.ox, PARK.oz, 14); } B.dunk = false; } }
  else if (B.st === 'drop') { B.t += dt; B.mesh.position.y = Math.max(0.12, HOOP_Y - B.t * 5); if (B.mesh.position.y <= 0.12) { B.st = 'loose'; B.vel.set(rnd(-0.5, 0.5), 1.5, 1); } }
  else if (B.st === 'loose') { B.vel.y -= 9.8 * dt; B.mesh.position.addScaledVector(B.vel, dt); if (B.mesh.position.y < 0.12) { B.mesh.position.y = 0.12; B.vel.y = Math.abs(B.vel.y) * 0.55; B.vel.x *= 0.8; B.vel.z *= 0.8; }
    const lx = B.mesh.position.x - PARK.ox, lz = B.mesh.position.z - PARK.oz; if (Math.abs(lx) > 7.5 || lz > 12 || lz < -1.4) { B.vel.x *= -0.5; B.vel.z *= -0.5; B.mesh.position.x = PARK.ox + clamp(lx, -7.5, 7.5); B.mesh.position.z = PARK.oz + clamp(lz, -1.4, 12); }
    if (K.phase !== 'made') { const ns = K.P.slice().sort((a, b) => Math.hypot(a.x - lx, a.z - lz) - Math.hypot(b.x - lx, b.z - lz)); ns[0].tx = lx; ns[0].tz = lz; ns[1].tx = lx; ns[1].tz = lz;
      if (Math.hypot(ns[0].x - lx, ns[0].z - lz) < 0.6 && B.mesh.position.y < 1.6) { const g = ns[0]; B.st = 'held'; B.h = g; if (g.team !== K.off) { K.off = g.team; parkReact('steal'); } K.phase = 'clear'; K.t = 0; g.tx = rnd(-2, 2); g.tz = 8.5; for (const q of K.P) q.drive = false; } } }
  if (K.phase === 'made' && K.t > 1.4) { K.off = 1 - K.madeBy; parkReset(K); }
  if (K.phase === 'clear' && h && h.z > 7) { K.phase = 'play'; K.t = 0; K.nextAct = rnd(1, 2.5); }
  // ---- movement and animation ----
  for (const p of K.P) {
    const air = p.st === 'shoot' || p.st === 'layup' || p.st === 'dunk' || p.st === 'contest';
    if (!air || p.st === 'layup' || p.st === 'dunk') { const dx = p.tx - p.x, dz = p.tz - p.z, l = Math.hypot(dx, dz), sp = p.st === 'layup' || p.st === 'dunk' ? 3 : B.h === p ? 3.6 : 4.4, want = l > 0.25 ? Math.min(sp, l * 2.5) : 0; p.vx = lerp(p.vx, l > 0.01 ? dx / l * want : 0, 1 - Math.exp(-6 * dt)); p.vz = lerp(p.vz, l > 0.01 ? dz / l * want : 0, 1 - Math.exp(-6 * dt)); }
    else { p.vx *= 0.8; p.vz *= 0.8; }
    p.x = clamp(p.x + p.vx * dt, -7.8, 7.8); p.z = clamp(p.z + p.vz * dt, -1.2, 12.5);
    const v = Math.hypot(p.vx, p.vz), wx = p.x + PARK.ox, wz = p.z + PARK.oz;
    if (p.st === 'shoot' || p.st === 'layup' || p.st === 'dunk') p.face = lerpAng(p.face, Math.atan2(-p.x, -p.z), 0.3);
    else if (p.team !== K.off && p.man) p.face = lerpAng(p.face, Math.atan2(p.man.x - p.x, p.man.z - p.z), 0.15);
    else if (v > 0.6) p.face = lerpAng(p.face, Math.atan2(p.vx, p.vz), 0.15);
    else if (B.h !== p) { const bx = B.mesh.position.x - PARK.ox, bz = B.mesh.position.z - PARK.oz; p.face = lerpAng(p.face, Math.atan2(bx - p.x, bz - p.z), 0.08); }
    const R = p.r; p.ph += dt * (4 + v * 2);
    if (p.st === 'run' && B.h !== p && !(p.team !== K.off && v < 1.4)) { locoAnim(R, wx, wz, p.face, dt, p.vx, p.vz); continue; }      /* moving off the ball: the real walk/run */
    let an, o = { leg: R.legLen, prof: R.prof, ph: p.ph }, tt = p.t, y = 0;
    if (p.st === 'shoot') { an = 'shoot'; o.rel = 0.6; const u = p.t / 0.6; y = u > 0.62 && u < 1.42 ? 0.45 * Math.sin(Math.PI * (u - 0.62) / 0.8) : 0; }
    else if (p.st === 'layup' || p.st === 'dunk') { an = p.st; const dur = p.st === 'dunk' ? 0.9 : 0.8; o.u = p.t / dur; o.style = p.st === 'dunk' ? 'twohand' : undefined; y = Math.sin(Math.PI * clamp((o.u - 0.25) / 0.7, 0, 1)) * (p.st === 'dunk' ? 0.85 : 0.55); }
    else if (p.st === 'contest') { an = 'jump'; y = p.t < 0.6 ? 0.5 * Math.sin(Math.PI * p.t / 0.6) : 0; }
    else if (p.st === 'pass') { an = 'pass'; }
    else if (B.h === p) { an = 'dribble'; o.sp = clamp(v / 6, 0, 1); o.dr = Math.abs(Math.sin(K.t * 7 + p.ph)); o.hand = 'R'; tt = K.t; }
    else { an = 'slide'; o.up = !!(h && p.man === h && Math.hypot(h.x - p.x, h.z - p.z) < 2); tt = K.t; }
    applyPose(R, poseOf(an, tt, o), dt); R.root.position.set(wx, y, wz); R.root.rotation.y = p.face; R.gait = null; R.lock = null;
    if (an === 'dribble') { const hgt = Math.abs(Math.sin(K.t * 7 + p.ph)); B.mesh.position.set(wx + Math.sin(p.face) * 0.3 - Math.cos(p.face) * 0.27, 0.125 + hgt * 0.75, wz + Math.cos(p.face) * 0.3 + Math.sin(p.face) * 0.27); }
    else if (B.h === p) { R.root.updateMatrixWorld(true); handPos(R, 'R', B.mesh.position); }
  }
  // the bleachers
  const bx = B.mesh.position.x, bz = B.mesh.position.z;
  for (const f of K.fans) { let kind = f.amb, u = 1;
    if (f.react) { f.react.t += dt; if (f.react.t >= f.react.dur) f.react = null; else if (f.react.t >= 0) { kind = f.react.kind; u = Math.min(1, f.react.t / 0.25); } }
    else { f.ambT -= dt; if (f.ambT <= 0) { f.amb = pick(CROWD_AMBIENT); f.ambT = rnd(3, 9); } }
    const P = crowdPose(kind, W.t, { ph: f.ph, u, alert: 0.2 }, f.prof);
    if (kind !== 'phone' && kind !== 'talk') { let a = Math.atan2(bx - f.x, bz - f.z) - f.face; a = clamp(Math.atan2(Math.sin(a), Math.cos(a)), -1.1, 1.1); const n = P.neck || (P.neck = [0, 0, 0]); n[1] += a * 0.6; }
    applyPose(f.r, P, dt); }
}
// a sound from the park, quieter the further you are
function sfxNear(n, x, z, r) { if (!W || !W.me) return; const d = Math.hypot(W.me.x - x, W.me.z - z); if (d < r) sfx(n); }
