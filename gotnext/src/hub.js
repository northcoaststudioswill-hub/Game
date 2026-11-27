// GOT NEXT — walking around: The Block (hub), The Cages (mode doors), My Crib (home court)
'use strict';
let W = null;
function worldPlayerRig() {
  if (W.me.rig) scene.remove(W.me.rig.root);
  W.me.rig = makeRig(myBuild()); scene.add(W.me.rig.root);
}
// a name that floats over somebody you are meant to find
function worldTag(n, name, sub) {
  if (!n || !n.rig) return; const tex = canvasTex(512, 128, (x, w, h) => { x.fillStyle = 'rgba(8,8,10,.78)'; x.fillRect(0, 10, w, h - 20); x.fillStyle = '#ff5a2a'; x.fillRect(0, 10, 10, h - 20);
    x.fillStyle = '#f4efe6'; x.font = '900 46px Arial'; x.textAlign = 'center'; x.fillText(name, w / 2 + 4, sub ? 64 : 80); if (sub) { x.fillStyle = '#b9b3a8'; x.font = '600 28px Arial'; x.fillText(sub, w / 2 + 4, 102); } });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(1.9, 0.475, 1); s.position.set(0, (n.rig.H || 1.9) + 0.5, 0); s.renderOrder = 8; n.rig.root.add(s); n.tag = s; return s;
}
function addNpc(build, x, z, face, anim, extra) {
  if (W && !build.bot && !(extra && (extra.cast || extra.still || extra.low)) && !build.keepLook && build.worn && build.worn.top) uniqLook(build, W.looks || (W.looks = new Set()), 2);
  if (W && build.name && !build.bot && !(extra && (extra.cast || extra.still)) && typeof NPC_NAMES !== 'undefined' && NPC_NAMES.includes(build.name) && W.npcs.some(m => m.name === build.name)) { const free = NPC_NAMES.filter(x => !W.npcs.some(m => m.name === x)); if (free.length) build.name = free[Math.floor(Math.random() * free.length)]; }      /* two people with the same name on one corner */
  const r = makeRig(build, !!(extra && extra.low)); r.root.position.set(x, 0, z); r.root.rotation.y = face; scene.add(r.root);
  const n = Object.assign({ rig: r, name: build.name, x, z, face, anim: anim || 'idle', ph: rnd(0, 6), hx: x, hz: z, tx: x, tz: z, wt: rnd(1, 5) }, extra || {}); if (n.anim === 'ball') { n.ball = makeBall(pick(['bl_std', 'bl_rwb', 'bl_neon'])); scene.add(n.ball); } W.npcs.push(n); return n;
}
// Nobody stands on top of anybody. Run once a place is populated: people who are free to move are eased apart until they
// are a couple of metres from each other, clear of the spots you walk up to (other than their own) and of where you come in.
// People with a fixed place (the cast, anyone seated, the dice ring) stay put; nobody is moved far, into a wall or off the lot.
function npcSpace() {
  const N = W.npcs, fixed = n => !!(n.cast || n.still || n.anim === 'sit' || n.talk === 'dice' || (typeof LADDER !== 'undefined' && LADDER.some(L => L.name === n.name))), MIN = 2.0, B = W.bounds || [-14, 14, -10.5, 11];
  const inSolid = (x, z) => W.solids.some(s => x > s[0] && x < s[1] && z > s[2] && z < s[3]), me = W.me;
  for (const n of N) { n.ox = n.x; n.oz = n.z; }
  for (let it = 0; it < 80; it++) { let moved = false;
    for (const n of N) { if (fixed(n)) continue; let px = 0, pz = 0;
      const away = (ox, oz, min, w) => { let dx = n.x - ox, dz = n.z - oz, d = Math.hypot(dx, dz); if (d >= min) return; if (d < 0.01) { dx = Math.cos(n.ph || 0); dz = Math.sin(n.ph || 0); d = 1; } px += dx / d * (min - d) * w; pz += dz / d * (min - d) * w; };
      for (const o of N) if (o !== n) away(o.x, o.z, MIN, fixed(o) ? 1 : 0.5);
      for (const s of W.spots) if (s !== n.spot) away(s.x, s.z, 1.5, 1);
      if (me) away(me.x, me.z, 2.2, 1);
      if (!px && !pz) continue; let nx = n.x + px * 0.6, nz = n.z + pz * 0.6; const od = Math.hypot(nx - n.ox, nz - n.oz); if (od > 2.8) { nx = n.ox + (nx - n.ox) / od * 2.8; nz = n.oz + (nz - n.oz) / od * 2.8; }
      nx = clamp(nx, B[0] + 0.6, B[1] - 0.6); nz = clamp(nz, B[2] + 0.6, B[3] - 0.6); if (inSolid(nx, nz) && !inSolid(n.x, n.z)) continue; if (Math.abs(nx - n.x) + Math.abs(nz - n.z) < 0.004) continue; n.x = nx; n.z = nz; moved = true; }
    if (!moved) break; }
  for (const n of N) { if (n.x !== n.ox || n.z !== n.oz) { n.hx = n.tx = n.x; n.hz = n.tz = n.z; n.rig.root.position.set(n.x, n.yFix || 0, n.z); if (n.spot) { n.spot.x = n.x; n.spot.z = n.z; } } }
}
function spot(x, z, r, label, fn) { W.spots.push({ x, z, r: r + 0.45, label, fn }); }      /* a step further out: walking past a shop should offer it */
function solid(x0, x1, z0, z1) { W.solids.push([x0, x1, z0, z1]); }
function building(x, z, w, d, h, col, label, labelCol, face) {
  ink(M(box(w, h, d), brickMat(col, Math.max(w, d), h), x, h / 2, z, scene), 1.015); solid(x - w / 2 - 0.4, x + w / 2 + 0.4, z - d / 2 - 0.4, z + d / 2 + 0.4);
  M(box(w + 0.5, 0.5, d + 0.5), toon('#16181c'), x, h + 0.25, z, scene); M(box(w + 0.1, 1.0, d + 0.1), toon('#26262c'), x, 0.5, z, scene);
  const ew = face === 'e' || face === 'w', sgn = face === 'e' || face === 's' ? 1 : -1;
  const fx = ew ? x + sgn * (w / 2 + 0.07) : x, fz = ew ? z : z + sgn * (d / 2 + 0.07), ry = { n: Math.PI, s: 0, e: Math.PI / 2, w: -Math.PI / 2 }[face];
  const s = sign(label, Math.min(ew ? d : w, 7) * 0.92, 1.7, labelCol, '#0a0a0e'); s.position.set(fx, Math.min(h - 1.4, 5.2), fz); s.rotation.y = ry; scene.add(s);
  const lc = new THREE.Color(labelCol).getHex(), gl = glow(fx + (ew ? sgn * 0.5 : 0), Math.min(h - 1.4, 5.2), fz + (ew ? 0 : sgn * 0.5), lc, 1, null, 0.75); gl.scale.set(Math.min(ew ? d : w, 7) * 1.5, 4.2, 1);
  glow(fx + (ew ? sgn * 0.6 : 0), 1.6, fz + (ew ? 0 : sgn * 0.6), lc, 5, null, 0.45);
  pool(fx + (ew ? sgn * 2.4 : 0), fz + (ew ? 0 : sgn * 2.4), lc, ew ? 4.5 : 7, ew ? 7 : 4.5, 0.4);
  // roll-up door, lit from inside, and windows above
  M(box(ew ? 0.1 : 2.6, 3.2, ew ? 2.6 : 0.1), flat(labelCol, { transparent: true, opacity: 0.9 }), fx, 1.6, fz, scene);
  M(box(ew ? 0.14 : 2.2, 2.8, ew ? 2.2 : 0.14), flat(0x0b0b0e), fx, 1.4, fz, scene);
  for (let i = 0; i < 3; i++) for (let j = 0; h > 7 && j < 1; j++) { const o = (i - 1) * 2.6; M(box(ew ? 0.1 : 1.3, 1.3, ew ? 1.3 : 0.1), flat(RNG() < 0.6 ? 0xffd28a : 0x20222a), ew ? fx : fx + o, h - 1.3 + j, ew ? fz + o : fz, scene); }
  return { fx, fz, ry, gl };
}
// thin things that stand between the camera and you go see-through (pulling the camera in for every pole would make it jump)
function fadeable(m, x, z) { if (!W) return m; m.material = m.material.clone(); m.material.transparent = true; (W.fades || (W.fades = [])).push({ m, x, z, o: 1 }); return m; }
function fadeStep(cam, me, dt) {
  if (!W.fades) return; const ax = cam.x, az = cam.z, bx = me.x, bz = me.z, vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz || 1;
  for (const f of W.fades) { const t = ((f.x - ax) * vx + (f.z - az) * vz) / l2, px = ax + vx * t, pz = az + vz * t, near = t > 0.05 && t < 0.97 && Math.hypot(f.x - px, f.z - pz) < 0.55;
    const want = near ? 0.18 : 1; f.o += (want - f.o) * (1 - Math.exp(-10 * dt)); f.m.material.opacity = f.o; f.m.material.depthWrite = f.o > 0.95; for (const c of f.m.children) c.visible = f.o > 0.6; } }
function lamp(x, z, col) { fadeable(M(cyl(0.07, 0.09, 5, 6), toon('#20242c'), x, 2.5, z, scene), x, z); M(sph(0.28, 8, 6), flat(col || 0xffe9a8), x, 5.1, z, scene); const g = M(geo('glow', () => new THREE.CircleGeometry(2.6, 16)), flat(col || 0xffe9a8, { transparent: true, opacity: 0.1, depthWrite: false }), x, 0.03, z, scene); g.rotation.x = -Math.PI / 2; glow(x, 5.1, z, col || 0xffe9a8, 2.6); pool(x, z, col || 0xffe9a8, 5, 5, 0.3); beam(x, 5.0, z, x, 0, z, col || 0xffe9a8, 2.2, 0.05, 5); }
// spray-paint piece: big leaning letters, outline, shine, drips
function mural(text, w, h, cols, x, y, z, ry) {
  const tex = canvasTex(1024, Math.round(1024 * h / w), (c, W_, H_) => {
    c.fillStyle = cols[0]; c.fillRect(0, 0, W_, H_);
    for (let i = 0; i < 14; i++) { const g = c.createRadialGradient(rnd(0, W_), rnd(0, H_), 5, rnd(0, W_), rnd(0, H_), rnd(120, 320)); g.addColorStop(0, cols[1 + i % 2] + 'cc'); g.addColorStop(1, cols[1 + i % 2] + '00'); c.fillStyle = g; c.fillRect(0, 0, W_, H_); }
    const lines = text.split('\n'); let fs = Math.min(H_ / (lines.length * 1.05), 300); c.font = `900 expanded ${fs}px Archivo, Impact, sans-serif`;
    let mw = 0; for (const l of lines) mw = Math.max(mw, c.measureText(l).width); if (mw > W_ * 0.86) { fs *= W_ * 0.86 / mw; c.font = `900 expanded ${fs}px Archivo, Impact, sans-serif`; }
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    lines.forEach((l, i) => {
      const cy = H_ / 2 + (i - (lines.length - 1) / 2) * fs * 0.98;
      c.save(); c.translate(W_ / 2, cy); c.transform(1, -0.06, -0.18, 1, 0, 0);
      c.strokeStyle = '#08080a'; c.lineWidth = fs * 0.2; c.strokeText(l, 8, 10); c.strokeStyle = cols[4] || '#ffffff'; c.lineWidth = fs * 0.09; c.strokeText(l, 0, 0);
      const g = c.createLinearGradient(0, -fs / 2, 0, fs / 2); g.addColorStop(0, cols[3]); g.addColorStop(1, cols[1]); c.fillStyle = g; c.fillText(l, 0, 0);
      c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(-mw * 0.3, -fs * 0.3, fs * 0.12, fs * 0.05); c.restore();
    });
    for (let i = 0; i < 16; i++) { const dx = rnd(W_ * 0.1, W_ * 0.9), dy = rnd(H_ * 0.55, H_ * 0.8), dl = rnd(20, 110); c.fillStyle = cols[1 + i % 3]; c.fillRect(dx, dy, 7, dl); c.beginPath(); c.arc(dx + 3.5, dy + dl, 6, 0, 6.3); c.fill(); }
    for (let i = 0; i < 9; i++) { const sx = rnd(30, W_ - 30), sy = rnd(20, H_ - 20), r = rnd(8, 22); c.fillStyle = '#fff'; c.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * 0.3 : r; c.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } c.fill(); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(x, y, z); m.rotation.y = ry; scene.add(m); return m;
}
function floodlight(x, z, h, tx, tz) {
  fadeable(M(cyl(0.12, 0.16, h, 6), toon('#2a2c33'), x, h / 2, z, scene), x, z); const head = M(box(1.6, 0.7, 0.3), toon('#2a2c33'), x, h + 0.2, z, scene); head.lookAt(tx, 0, tz);
  const lit = M(box(1.4, 0.5, 0.06), flat(0xfff6dc), x, h + 0.2, z, scene); lit.lookAt(tx, 0, tz); lit.translateZ(0.17);
  const cone = M(geo('cone', () => { const g = new THREE.ConeGeometry(4.2, 11, 14, 1, true); g.translate(0, -5.5, 0); return g; }), flat(0xfff2c8, { transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), x, h + 0.2, z, scene);
  cone.lookAt(tx, h + 0.2 - 9, tz); cone.rotateX(Math.PI / 2);
  const gp = lit.position.clone(); glow(gp.x, gp.y, gp.z, 0xfff6dc, 5, null, 0.9);
  for (let i = 0; i < 10; i++) { const u = rnd(0.2, 0.9), s = glow(lerp(x, tx, u) + rnd(-1.4, 1.4), lerp(h, 0.5, u) + rnd(-0.5, 0.5), lerp(z, tz, u) + rnd(-1.4, 1.4), 0xfff2c8, 0.07, null, 0.7); AMB.motes.push({ s, x: s.position.x, y: s.position.y, z: s.position.z, ph: rnd(0, 6) }); }
}
function stringLights(x0, z0, x1, z1, y, n) {
  const pts = [], cols = [0xff2d78, 0xf2c14e, 0x7de3ff, 0xece9e2];
  for (let i = 0; i <= n; i++) { const u = i / n, sag = Math.sin(u * Math.PI) * 1.1, px = lerp(x0, x1, u), pz = lerp(z0, z1, u), py = y - sag; pts.push(V3(px, py, pz)); if (i > 0 && i < n) { const b = M(sph(0.11, 6, 5), flat(cols[i % 4]), px, py - 0.14, pz, scene); (W.bulbs = W.bulbs || []).push(b); glow(0, 0, 0, cols[i % 4], 0.9, b, 0.55); } }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x08080a })));
}
function shoeProp(col, sole, x, y, z, ry, parent) { const g = grp(parent || scene, x, y, z); g.rotation.y = ry || 0; ink(M(box(0.13, 0.11, 0.34), toon(col), 0, 0.07, 0, g), 1.12); M(box(0.14, 0.035, 0.36), toon(sole), 0, 0.015, 0, g); M(box(0.125, 0.1, 0.12), toon(col), 0, 0.15, -0.1, g); return g; }
const PIT_DOOR_Z = -5.6; function pitDoorX(i) { return -6.75 + i * 4.5; }

// walking around off the court: speed measured from actual movement drives the walk/jog/sprint blend, the hips and
// shoulders, a lean into speeding up and slowing down, and the planted-feet layer
function locoAnim(R, x, z, face, dt, vx, vz, swag) {
  const L = R.loco || (R.loco = { x, z, vx: 0, vz: 0, lean: 0 });
  if (vx === undefined) { vx = (x - L.x) / Math.max(dt, 1e-3); vz = (z - L.z) / Math.max(dt, 1e-3); if (Math.hypot(x - L.x, z - L.z) > 1) vx = vz = 0; }
  const ax = (vx - L.vx) / Math.max(dt, 1e-3), az = (vz - L.vz) / Math.max(dt, 1e-3); L.x = x; L.z = z; L.vx = vx; L.vz = vz;
  const v = Math.hypot(vx, vz), fwdA = ax * Math.sin(face) + az * Math.cos(face);
  L.lean = lerp(L.lean, clamp(fwdA * 0.014, -0.18, 0.2), 1 - Math.exp(-8 * dt));
  let hipYaw = 0; if (v > 0.6) { let a = Math.atan2(vx, vz) - face; a = Math.atan2(Math.sin(a), Math.cos(a)); if (Math.abs(a) < 2.3) hipYaw = clamp(a, -0.5, 0.5) * Math.min(1, v / 2.5) * 0.6; }
  // one stride clock for walking and running: it advances with distance covered, so feet do not skate. Up to a brisk
  // walk the legs follow walking gait curves; above it, running curves (knee drive, heel recovery, a flight phase).
  const sg = swag === undefined ? (R.prof ? 0.35 + R.prof.swag * 0.8 : 0.6) : swag, wWalk = 1 - clamp((v - 2.2) / 0.9, 0, 1), k = clamp((v - 2.6) / 3.6, 0, 1);
  const stepW = R.legLen * 0.74 * clamp(Math.sqrt(Math.max(v, 0.01) / 1.35), 0.45, 1.3), amp = clamp(v / 0.5, 0, 1) * clamp(Math.sqrt(v / 1.35), 0.45, 1.3);
  const cad = 2.7 + 1.1 * k, stepR = Math.max(v, 0.5) / cad, duty = 0.4 - 0.14 * k, step = lerp(stepR, stepW, wWalk);     /* running: 2.65 steps/s at a jog to 3.5 at a sprint */
  L.psi = ((L.psi || 0) + v * dt / (2 * step)) % 1;
  // the hip swing that carries the body one step over the standing foot (walk), or the stance distance (run)
  const solve = need => { let lo = 0.2, hi = 2.4; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2, sweep = R.legLen * (Math.sin((11 + 19 * m) * D2R) + Math.sin((20 * m - 11) * D2R)); if (sweep < need) lo = m; else hi = m; } return lo; };
  const hipA = Math.min(solve(1.2 * stepW - 0.12), 1.6) * clamp(v / 0.5, 0, 1);
  const solveR = need => { let lo = 0.3, hi = 2.2; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2, sweep = R.legLen * 0.92 * (Math.sin((3 + 20 * m) * D2R) + Math.sin((20 * m - 3) * D2R)); if (sweep < need) lo = m; else hi = m; } return lo; };
  const stanceDist = v * duty * 2 / cad, hipR = Math.min(solveR(stanceDist - 0.1), 1.5), flight = (0.5 - duty) * 2 / cad;
  let P = wWalk > 0 ? poseOf('gait', W.t, { psi: L.psi, amp, hipA, swag: sg * 0.6, thigh: R.thigh, shin: R.shin, leg: R.legLen }) : null;
  if (P && v < 0.12) P = blendPose(P, poseOf('idle', W.t, { prof: R.prof }), clamp(1 - v / 0.12, 0, 1));
  if (wWalk < 1) { const Pr = poseOf('sprint', W.t, { psi: L.psi, duty, k, hipA: hipR, flight, thigh: R.thigh, shin: R.shin, rs: R.prof && R.prof.run }); P = P ? blendPose(Pr, P, wWalk) : Pr; }
  { const sp = P.spine; sp[0] += L.lean * 0.5; const h = P.hips; h[1] += hipYaw * 0.5; }
  applyPose(R, P, dt);
  R.root.position.set(x, 0, z); R.root.rotation.y = face;
  if (v > 0.25) gaitLock(R, L.psi, face, 1, lerp(duty, 0.6, wWalk)); else R.lock = null;
  R.gait = null;
}
// foot lock for the walk: while a foot is in stance, nudge that hip so the ankle stays where the foot landed (the curve
// shape stays; only the hip angle is corrected, and the ankle keeps the foot flat). Released through push-off.
const _gl = new THREE.Vector3(), _gh = new THREE.Vector3();
function gaitLock(R, psi, face, w, stEnd) {
  const J = R.joints, fx = Math.sin(face), fz = Math.cos(face), Lg = R.thigh + R.shin; R.lock = R.lock || {}; R.root.updateMatrixWorld(true);
  for (const [s, off] of [['R', 0], ['L', 0.5]]) {
    const u = ((psi + off) % 1 + 1) % 1, an = J['an' + s]; an.getWorldPosition(_gl);
    if (u > stEnd) { R.lock[s] = null; continue; }
    if (!R.lock[s]) { R.lock[s] = { x: _gl.x, z: _gl.z }; continue; }
    const k = w * (u < stEnd * 0.8 ? 1 : 1 - (u - stEnd * 0.8) / (stEnd * 0.2));
    // two passes: with the knee bent the leg is shorter than its full length, so one pass under-corrects
    for (let it = 0; it < 2; it++) {
      if (it) an.getWorldPosition(_gl);
      const dx = R.lock[s].x - _gl.x, dz = R.lock[s].z - _gl.z, e = dx * fx + dz * fz, el = dx * fz - dz * fx;
      J['hp' + s].getWorldPosition(_gh); const lever = Math.max(0.35, _gh.y - _gl.y);
      const d = clamp(-e / lever, -0.4, 0.4) * k, dl = clamp(el / lever, -0.12, 0.12) * k;
      J['hp' + s].rotation.x += d; J['hp' + s].rotation.z += dl; an.rotation.x -= d; J['hp' + s].updateMatrixWorld(true);
    }
  }
}
function enterWorld(kind, sx, sz, face, opts) {
  disposeScene(scene); scene = new THREE.Scene(); MT = null; hudShow(false);
  W = { kind, me: { x: sx || 0, z: sz || 0, face: face === undefined ? Math.PI : face, vx: 0, vz: 0, rig: null, ph: 0 }, yaw: face === undefined ? Math.PI : face, npcs: [], spots: [], solids: [], cars: [], near: null, t: 0, bounds: [-30, 30, -30, 30] }; if (opts) Object.assign(W, opts);
  musicMode = 'hub'; ostRoom(kind); $('prompt').style.display = 'none'; ambInit();
  if (kind === 'hub') buildHub(); else if (kind === 'pit') buildPit(); else if (kind === 'room') buildRoom(); else buildCrib();
  worldPlayerRig(); W.camInit = false; $('wtag').textContent = (kind === 'hub' ? 'THE BLOCK · USA 2145' : kind === 'pit' ? 'THE CAGES' : kind === 'room' ? (W.visit ? W.visit.name + "'S ROOM" : 'MY ROOM') : W.visit ? W.visit.name + "'S CRIB" : 'MY CRIB') + ' · TODAY: ' + todayEvent().n;
  if (S.created && S.seenEventDay !== dayKey()) { S.seenEventDay = dayKey(); daily(); setTimeout(() => toast('TODAY · ' + todayEvent().n, todayEvent().d + ' The old head has new contracts.', 'rank'), 800); }
  document.body.dataset.state = 'world'; uiHud();
}

function buildHub() {
  scene.background = new THREE.Color(0x14151c); scene.fog = new THREE.Fog(0x14151c, 38, 150);
  baseLights(scene, 0xffe2c8, 0x34343c, 0xffc890, 1.35);
  for (const [x, z, c] of [[13, 5.6, 0xff2d78], [13, -5.5, 0xf2c14e], [-13, -5.5, 0x3dffa0], [0, -11, 0xfff2c8], [-11, 9.5, 0xff8a3c]]) { const l = new THREE.PointLight(c, 16, 15, 1.4); l.position.set(x, 3.4, z); scene.add(l); if (c === 0xff8a3c) W.fireLight = l; }
  // ---- ground: wet asphalt, court paint, the wordmark ----
  const gt = canvasTex(1024, 1024, (x, S_) => {
    const u = S_ / 34, X = v => (v + 17) * u, Z = v => (v + 17) * u;
    x.fillStyle = '#2b2c31'; x.fillRect(0, 0, S_, S_);
    for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(${RNG() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.02, 0.06)})`; x.fillRect(rnd(0, S_), rnd(0, S_), rnd(2, 22), rnd(2, 5)); }
    for (let i = 0; i < 9; i++) { const g = x.createRadialGradient(0, 0, 2, 0, 0, 1); x.save(); x.translate(rnd(80, S_ - 80), rnd(80, S_ - 80)); x.scale(rnd(40, 110), rnd(18, 40)); g.addColorStop(0, 'rgba(120,140,190,.28)'); g.addColorStop(1, 'rgba(120,140,190,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, 1, 0, 6.3); x.fill(); x.restore(); }
    x.strokeStyle = 'rgba(0,0,0,.4)'; x.lineWidth = 2; for (let i = 0; i < 10; i++) { let px = rnd(0, S_), pz = rnd(0, S_); x.beginPath(); x.moveTo(px, pz); for (let j = 0; j < 6; j++) { px += rnd(-50, 50); pz += rnd(-50, 50); x.lineTo(px, pz); } x.stroke(); }
    // the key and arc run out of the cage gate, like the court spilled onto the block
    x.fillStyle = 'rgba(255,45,120,.5)'; x.fillRect(X(-2.45), Z(-12), 4.9 * u, 6.2 * u);
    x.strokeStyle = '#ece9e2'; x.lineWidth = 6; x.strokeRect(X(-2.45), Z(-12), 4.9 * u, 6.2 * u); x.beginPath(); x.arc(X(0), Z(-5.8), 1.8 * u, 0, 6.3); x.stroke(); x.beginPath(); x.arc(X(0), Z(-12), 9 * u, 0.12, Math.PI - 0.12); x.stroke();
    x.save(); x.translate(X(0), Z(6.4)); x.transform(1, 0, -0.14, 1, 0, 0); x.textAlign = 'center'; x.font = '900 expanded 84px Archivo, Impact, sans-serif'; x.fillStyle = 'rgba(236,233,226,.8)'; x.fillText(BRAND.a, -14, -6); x.fillStyle = 'rgba(255,45,120,.85)'; x.fillText(BRAND.b, 20, 68); x.restore();
    x.fillStyle = 'rgba(236,233,226,.75)'; for (let i = 0; i < 12; i++) x.fillRect(X(-9 + i * 1.6), Z(11.2), 0.8 * u, 2.2 * u);
    x.font = '500 22px "JetBrains Mono", monospace'; x.fillStyle = 'rgba(242,193,78,.8)'; x.save(); x.translate(X(-9), Z(-1)); x.rotate(-0.3); x.fillText('WINNERS STAY →', 0, 0); x.restore(); x.save(); x.translate(X(6), Z(-2.5)); x.rotate(0.2); x.fillText('NO REFS. NO MERCY.', 0, 0); x.restore();
    for (const [mx, mz] of [[-6, 3], [8, -8], [3, 10]]) { x.fillStyle = '#1c1d21'; x.beginPath(); x.arc(X(mx), Z(mz), 0.55 * u, 0, 6.3); x.fill(); x.strokeStyle = '#3a3b42'; x.lineWidth = 3; x.stroke(); }
    // grit: per-pixel noise so the asphalt reads as asphalt up close, and a few dark gum spots
    for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(0,0,0,${rnd(0.15, 0.35)})`; x.beginPath(); x.arc(rnd(0, S_), rnd(0, S_), rnd(1.5, 4), 0, 6.3); x.fill(); }
    const img = x.getImageData(0, 0, S_, S_), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 22; d[i] += n; d[i + 1] += n; d[i + 2] += n; } x.putImageData(img, 0, 0);
  });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), new THREE.MeshToonMaterial({ map: gt, gradientMap: ramp() })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const g2 = M(new THREE.PlaneGeometry(400, 400), toon('#17181d'), 0, -0.05, 0, scene); g2.rotation.x = -Math.PI / 2;
  skyline(scene, 54, 58, ['#f2c14e', '#ffe9a8', '#ffe9a8', '#7de3ff', '#ff2d78']);

  // ---- THE CAGES: a floodlit cage across the whole north side ----
  const ft = () => { const t = fenceTex(); return t; };
  const fenceSeg = (x0, x1, z, h) => { const w = x1 - x0, t = ft(); t.repeat.set(w / 1.1, h / 1.1); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set((x0 + x1) / 2, h / 2, z); scene.add(m); M(box(w, 0.1, 0.1), toon('#6a707c'), (x0 + x1) / 2, h, z, scene); M(box(w, 0.1, 0.1), toon('#6a707c'), (x0 + x1) / 2, 0.05, z, scene); };
  fenceSeg(-16, -2.2, -12, 6.5); fenceSeg(2.2, 16, -12, 6.5); solid(-16.5, -2.2, -12.6, -11.6); solid(2.2, 16.5, -12.6, -11.6);
  for (const x of [-16, -11.4, -6.8, -2.2, 2.2, 6.8, 11.4, 16]) fadeable(ink(M(cyl(0.09, 0.09, 6.5, 6), toon('#6a707c'), x, 3.25, -12, scene), 1.2), x, -12);
  for (const sx of [-1, 1]) { const t = ft(); t.repeat.set(18, 6); const m = new THREE.Mesh(new THREE.PlaneGeometry(20, 6.5), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set(sx * 16, 3.25, -22); m.rotation.y = Math.PI / 2; scene.add(m); }
  // gate: steel truss with the name on it
  for (const sx of [-1, 1]) ink(M(box(0.35, 8.4, 0.35), toon('#1c1d22'), sx * 2.4, 4.2, -12, scene), 1.06);
  ink(M(box(9.6, 1.9, 0.5), toon('#1c1d22'), 0, 8.2, -12, scene), 1.03);
  const ps = sign('THE CAGES', 9, 1.6, '#ece9e2', '#0a0a0e'); ps.position.set(0, 8.2, -11.72); scene.add(ps);
  M(box(9.6, 0.14, 0.52), flat(0xff2d78), 0, 7.2, -12, scene);
  const ps2 = sign('CALL NEXT  //  WINNERS STAY', 4.4, 0.42, '#ff2d78', '#0a0a0e', { border: false }); ps2.position.set(0, 6.85, -11.72); scene.add(ps2);
  // the show court inside the cage
  const ct = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshToonMaterial({ map: parkCourtTex(1), gradientMap: ramp() })); ct.rotation.x = -Math.PI / 2; ct.position.set(0, 0.012, -22); scene.add(ct);
  const hp = hoopMesh(2, 'street'); hp.position.set(0, 0, -28); scene.add(hp);
  floodlight(-15, -13, 10, -4, -22); floodlight(15, -13, 10, 4, -22); floodlight(-15, -31, 10, -3, -23); floodlight(15, -31, 10, 3, -23);
  for (let r = 0; r < 3; r++) ink(M(box(12, 0.4, 0.9), toon('#3a3c44'), 0, 0.3 + r * 0.45, -31 - r * 0.9, scene), 1.02);
  parkInit(scene);      /* park.js: a real 2v2 run on the show court, and the bleachers watching it */
  castInit();      /* cast.js: Nexx, Aaron's stand, Bottie, Louie */
  viceInit();      /* vice.js: Trey's Bones */
  spot(0, -10.3, 2.4, 'ENTER THE CAGES', () => enterWorld('pit', 0, 3.4, Math.PI));
  // elevated train behind it all
  M(box(120, 0.6, 3), toon('#23242a'), 0, 9.2, -37, scene); for (let x = -50; x <= 50; x += 10) M(box(0.8, 9, 0.8), toon('#23242a'), x, 4.5, -37, scene);
  W.train = new THREE.Group(); for (let i = 0; i < 4; i++) { ink(M(box(8.6, 2.6, 2.4), toon('#b9bec7'), i * 9, 0, 0, W.train), 1.02); M(box(8.2, 0.9, 2.44), flat(0xffe9a8), i * 9, 0.35, 0, W.train); M(box(8.6, 0.3, 2.44), flat(0xff2d78), i * 9, -0.8, 0, W.train); } W.train.position.set(-90, 11, -37); scene.add(W.train);

  // ---- the block: four fronts, close enough to hear each other ----
  building(-21.5, -5.6, 12, 8.6, 9, '#7a4034', 'THE LAB', '#3dffa0', 'e'); spot(-13.6, -5.6, 2.2, 'THE LAB (attributes)', () => uiPlayer('attrs'));
  building(-21.5, 5.8, 12, 9.6, 11, '#5a4640', 'MY CRIB', '#7de3ff', 'e'); spot(-13.4, 5.8, 2.2, 'GO HOME', () => enterWorld('crib', 0, 19.2, Math.PI));
  for (let i = 0; i < 3; i++) ink(M(box(1.5 - i * 0.45, 0.25, 3.2), toon('#8a8378'), -15.3 + (1.5 - i * 0.45) / 2, 0.125 + i * 0.25, 5.8, scene), 1.03);
  building(21.5, -5.6, 12, 8.6, 8, '#8a8378', 'THE PLUG', '#f2c14e', 'w'); spot(13.6, -5.6, 2.2, 'THE PLUG (drip)', () => uiShop(false));
  building(21.5, 5.8, 12, 9.6, 7, '#4a4f5c', 'TAPE DECK', '#ff2d78', 'w'); spot(13.6, 5.8, 2.2, 'TAPE DECK (moves)', () => uiPlayer('moves'));
  // The Plug's window: grails under glass
  M(box(0.1, 2.0, 3.0), flat(0xfff2c8), 15.42, 1.9, -8.2, scene); M(box(0.2, 2.2, 3.2), toon('#16181c'), 15.46, 1.9, -8.2, scene);
  const kicks = DRIP.filter(d => d.slot === 'shoes' && d.r >= 1); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const k = kicks[(r * 4 + c) % kicks.length]; shoeProp(k.c, k.c2 || '#fff', 15.3, 1.0 + r * 0.6, -9.3 + c * 0.72, Math.PI / 2 + 0.5); M(box(0.3, 0.03, 3.0), toon('#16181c'), 15.3, 0.98 + r * 0.6, -8.2, scene); }
  // Tape Deck's boombox, with a level meter that bounces, and two people who cannot stand still
  const bx = grp(scene, 14.2, 0, 9.6); bx.rotation.y = -Math.PI / 2 - 0.35; ink(M(box(2.6, 1.4, 0.7), toon('#1c1d22'), 0, 0.7, 0, bx), 1.03); for (const sx of [-1, 1]) { const sp = M(cyl(0.48, 0.48, 0.1, 16), toon('#b9bec7'), sx * 0.8, 0.62, 0.36, bx); sp.rotation.x = Math.PI / 2; const c2 = M(cyl(0.2, 0.2, 0.12, 12), flat(0xff2d78), sx * 0.8, 0.62, 0.38, bx); c2.rotation.x = Math.PI / 2; (W.speakers = W.speakers || []).push(sp); }
  M(box(2.2, 0.08, 0.3), toon('#b9bec7'), 0, 1.55, 0, bx); W.eq = []; for (let i = 0; i < 7; i++) W.eq.push(M(box(0.08, 0.3, 0.02), flat([0x3dffa0, 0xf2c14e, 0xff2d78][i % 3]), -0.3 + i * 0.1, 1.15, 0.36, bx)); solid(13.2, 15, 8.4, 10.8);
  for (let i = 0; i < 2; i++) { const b = aiBuild(80, 'showman'); b.worn = randomWorn(3); addNpc(b, 11.6 + i * 1.3, 9.2 - i * 1.4, -1.6 - i * 0.6, 'dance'); }
  // south wall: murals, and the way to the rest of the city (not open yet)
  ink(M(box(40, 6, 0.6), brickMat('#55413a', 40, 6), 0, 3, 19.4, scene), 1.01); M(box(34, 0.22, 0.5), toon('#8a8378'), 0, 0.11, 12.1, scene);
  for (const [cx, cz, cc, cr] of [[-5, 15.6, '#ff2d78', 0.08], [7.5, 16.2, '#ece9e2', -0.05]]) { const c = grp(scene, cx, 0.75, cz); c.rotation.y = cr; ink(M(box(4.4, 0.8, 1.9), toon(cc), 0, 0, 0, c), 1.04); ink(M(box(2.3, 0.6, 1.7), toon('#16181c'), -0.2, 0.65, 0, c), 1.04); M(box(4.0, 0.1, 1.7), flat(0x7de3ff), 0, -0.5, 0, c); M(box(0.1, 0.25, 1.5), flat(0xff2d78), -2.22, 0.1, 0, c); M(box(0.1, 0.25, 1.5), flat(0xfff2c8), 2.22, 0.1, 0, c); }
  mural('BALL\nIS LIFE', 8.5, 4.4, ['#1a1030', '#ff2d78', '#7de3ff', '#fff3b0', '#ffffff'], -10, 3.1, 19.05, Math.PI);
  mural('RUN IT\nBACK', 8.5, 4.4, ['#0e2a2a', '#f2c14e', '#ff6a3d', '#ffffff', '#08080a'], 1, 3.1, 19.05, Math.PI);
  mural('WHO GOT\nNEXT', 8.5, 4.6, ['#141418', '#ff2d78', '#a78bff', '#ece9e2', '#08080a'], 12, 3.1, 19.05, Math.PI);
  M(box(2.6, 0.04, 3.4), flat(0x050506), -6.4, 0.03, 10.2, scene); for (const [rx, rz, rw, rd] of [[-7.75, 10.2, 0.1, 3.4], [-5.05, 10.2, 0.1, 3.4], [-6.4, 11.9, 2.8, 0.1]]) ink(M(box(rw, 1.0, rd), toon('#3dffa0'), rx, 0.5, rz, scene), 1.06); solid(-7.85, -4.95, 8.45, 12.0);      /* the subway stairwell rail is solid (legs sank into it: the bot called it the green dumpster) */ for (let i = 0; i < 5; i++) M(box(2.5, 0.05, 0.3), toon('#3a3c44'), -6.4, -0.02 - i * 0.02, 9.0 + i * 0.5, scene);
  fadeable(M(cyl(0.06, 0.06, 3.2, 6), toon('#1c1d22'), -7.75, 1.6, 8.5, scene), -7.75, 8.5); const sb = sign('UPTOWN LINE', 2.4, 0.5, '#3dffa0', '#0a0a0e'); sb.position.set(-6.6, 3.0, 8.5); scene.add(sb); for (let i = 0; i < 5; i++) M(box(0.06, 1.4, 0.06), toon('#6a707c'), -7.4 + i * 0.5, 0.7, 8.55, scene); M(box(2.4, 0.06, 0.06), toon('#6a707c'), -6.4, 0.9, 8.55, scene); solid(-8, -4.8, 8.4, 12.2);
  spot(-6.4, 7.6, 1.8, 'UPTOWN LINE', () => uiDialog('UPTOWN LINE', 'Gate is chained. A sticker on it says: MORE CITY SOON. Somebody wrote "that\'s what they said in 2139" under it.', [['Aight.', null]]));
  mural('NO\nREFS', 5.4, 3.4, ['#2a1408', '#ff6a3d', '#f2c14e', '#fff3b0', '#ffffff'], -15.42, 2.4, -0.4, Math.PI / 2);
  mural('KINGS\nSTAY', 5.4, 3.0, ['#081a2a', '#7de3ff', '#a78bff', '#ffffff', '#08080a'], 15.42, 2.3, 0.2, -Math.PI / 2);
  for (let i = 0; i < 2; i++) { poster(scene, -15.42, 2.1, -10.9 + i * 1.55, Math.PI / 2, i % 2); poster(scene, 15.42, 2.1, 10.2 + i * 1.55 * -1, -Math.PI / 2, (i + 1) % 2); poster(scene, -15.42, 2.1, 10.9 - i * 1.55, Math.PI / 2, (i + 1) % 2); }
  // centrepiece: the Freedom Eagle, gold, mid-dunk
  ink(M(cyl(1.3, 1.6, 0.9, 8), toon('#3a3c44'), 0, 0.45, 1.6, scene), 1.03); W.rounds = [[0, 1.6, 1.72]];      /* round, so you slide around it (the square box stopped you dead on the walk to the Cages) */
  const stb = aiBuild(99, 'slasher'); stb.worn = { hair: 'h_bald', head: 'hd_eagle', face: 'f_none', top: 't_jersey', arm: 'a_none', bottom: 'b_basic', socks: 's_high', shoes: 'k_gold', back: 'bk_wings', ball: 'bl_gold' };
  const stt = makeRig(stb, true); const gold = toon('#f2c14e'); stt.root.traverse(o => { if (o.isMesh && o.material !== INK) o.material = gold; }); stt.shadow.visible = false;
  stt.root.position.set(0, 1.35, 1.6); stt.root.scale.setScalar(1.25); stt.root.rotation.y = 0.5; scene.add(stt.root); applyPose(stt, poseOf('dunk', 0, { u: 0.5, style: 'tomahawk' }), 10);
  const pl = sign('THE FREEDOM EAGLE · "HE DUNKED SO YOU COULD SCROLL"', 2.6, 0.28, '#f2c14e', '#16181c', { border: false }); pl.position.set(0, 0.5, 3.12); scene.add(pl);
  // Money Rack: a side hoop and a man with a marker
  const h2 = hoopMesh(1, 'street'); h2.position.set(8.2, 0, 10.6); h2.rotation.y = Math.PI; scene.add(h2); solid(7.6, 8.8, 11.6, 12.4);
  const hb = aiBuild(75, 'sniper'); hb.name = 'Sharpie'; addNpc(hb, 6.3, 9.6, 2.4, 'idle'); spot(7.2, 8.4, 2.0, 'SHARPIE (Money Rack · H-O-R-S-E)', () => uiRack());
  ink(M(box(1.3, 0.9, 0.5), toon('#8a8378'), 5.2, 0.45, 11.6, scene), 1.04); for (let i = 0; i < 4; i++) { const b = makeBall(['bl_std', 'bl_rwb', 'bl_neon', 'bl_gold'][i]); b.position.set(4.75 + i * 0.3, 1.03, 11.6); scene.add(b); }
  // the old head, his bench, his crates
  ink(M(box(2.4, 0.12, 0.6), toon('#7a5a3a'), -8, 0.5, -3.2, scene), 1.05); M(box(0.12, 0.5, 0.5), toon('#20242c'), -9, 0.25, -3.2, scene); M(box(0.12, 0.5, 0.5), toon('#20242c'), -7, 0.25, -3.2, scene); solid(-9.4, -6.6, -3.7, -2.7);
  const ob = aiBuild(60, 'general'); ob.worn.hair = 'h_bald'; ob.worn.head = 'hd_band'; ob.worn.face = 'f_goggles'; addNpc(ob, -8, -3.12, 0.5, 'sit');
  spot(-8, -1.9, 2.0, 'OLD HEAD (daily contracts)', () => uiContracts());
  // the coach and his board: every drill on the block pays
  const cb = aiBuild(70, 'general'); cb.name = 'Coach Overtime'; cb.worn = Object.assign(cb.worn, { hair: 'h_bald', head: 'hd_cap', face: 'f_none', top: 't_hoodie', bottom: 'b_long', shoes: 'k_white', back: 'bk_towel' });
  { const n = addNpc(cb, -3.6, 5.0, Math.PI * 0.85, 'idle'); worldTag(n, 'COACH OVERTIME', 'drills'); }      /* a new player has to be able to find him (the blind playtest never did) */
  { const g = grp(scene, -4.9, 0, 6.3); g.rotation.y = Math.PI * 0.8; ink(M(box(2.2, 1.4, 0.08), toon('#1f3a2c'), 0, 1.5, 0, g), 1.03); M(box(2.36, 0.1, 0.12), toon('#7a5a3a'), 0, 0.78, 0, g); for (const sx of [-1, 1]) M(cyl(0.04, 0.04, 1.5, 5), toon('#3a3c44'), sx * 0.95, 0.75, -0.05, g);
    const t = sign('DRILLS\nLAYUPS · THREES · SPOTS\nHANDLES · DEFENSE', 2.0, 1.2, '#ece9e2', '#1f3a2c', { border: false }); t.position.set(0, 1.5, 0.05); g.add(t); solid(-6.2, -3.6, 5.6, 7.0); }
  spot(-3.4, 4.0, 2.0, 'COACH OVERTIME (drills)', () => uiDrills('hub'));
  for (const [cx, cy, cz, cc] of [[-10.2, 0.2, -3.4, '#e04848'], [-10.2, 0.6, -3.35, '#2f5bff'], [-10.75, 0.2, -3.0, '#f2c14e']]) ink(M(box(0.5, 0.4, 0.5), toon(cc), cx, cy, cz, scene), 1.05);
  // fiends
  [[5, -7.4], [-9.4, 3.4], [-3.4, 8.8], [10.4, 1.4]].forEach((b, i) => { const bb = aiBuild(50); bb.worn = randomWorn(0, true); bb.name = BUM_NAMES[i % BUM_NAMES.length]; const n = addNpc(bb, b[0], b[1], rnd(0, 6), 'beg', { bum: true, wander: true, name: bb.name, range: 1.4 }); spot(b[0], b[1], 1.6, 'TALK', () => uiBum(n)); n.spot = W.spots[W.spots.length - 1]; n.spot.low = 1; });
  for (let i = 0; i < 3; i++) { const b = aiBuild(rnd(65, 92)); b.worn = randomWorn(2); addNpc(b, [-6.5, 0.5, 6.5][i] + rnd(-1.5, 1.5), rnd(-3.5, 3), rnd(0, 6), i ? 'idle' : 'ball', { wander: i > 0, range: 2.5 }); }      /* spread across the middle of the lot, not bunched by the cage */
  // barrel fire, hydrant, cans
  ink(M(cyl(0.42, 0.38, 0.95, 10), toon('#3a2a22'), -11, 0.48, 9.6, scene), 1.05); W.flames = []; for (let i = 0; i < 4; i++) W.flames.push(M(geo('flame', () => new THREE.ConeGeometry(0.2, 0.7, 5)), flat([0xff8a3c, 0xf2c14e, 0xff2d78, 0xffd28a][i]), -11 + rnd(-0.15, 0.15), 1.2, 9.6 + rnd(-0.15, 0.15), scene)); solid(-11.6, -10.4, 9, 10.2);
  for (let i = 0; i < 2; i++) { const b = aiBuild(55); b.worn = randomWorn(1, true); addNpc(b, -12.2 + i * 2.3, 10.4 - i * 1.7, i ? -1.2 : 0.9, 'warm'); }
  ink(M(cyl(0.16, 0.2, 0.7, 8), toon('#e04848'), 11.8, 0.35, -10.6, scene), 1.08); M(sph(0.18, 8, 6), toon('#e04848'), 11.8, 0.72, -10.6, scene);
  for (const [x, z] of [[-13.6, -10.4], [13.4, 1.2]]) ink(M(cyl(0.34, 0.28, 0.9, 8), toon('#3a3c44'), x, 0.45, z, scene), 1.05);
  // overhead: string lights, and somebody's kicks on the wire
  stringLights(-15.2, -9, 15.2, -8.4, 7.4, 16); stringLights(-15.2, -1.2, 15.2, -0.6, 7.2, 16); stringLights(-15.2, 9.6, 15.2, 9.2, 6.6, 16); stringLights(-15.2, -9, 15.2, 9.2, 7.6, 22);
  const wire = [V3(-15.3, 6.6, 3.4), V3(15.3, 6.9, 3.0)]; scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wire), new THREE.LineBasicMaterial({ color: 0x08080a })));
  W.hang = []; for (const [u, k] of [[0.3, 'k_red'], [0.48, 'k_volt'], [0.7, 'k_flag']]) { const d = DRIPS[k], gx = lerp(-15.3, 15.3, u), gy = lerp(6.6, 6.9, u), gg = grp(scene, gx, gy, lerp(3.4, 3.0, u)); M(cyl(0.008, 0.008, 0.7, 4), flat(0xece9e2), 0, -0.35, 0, gg); shoeProp(d.c, d.c2, -0.08, -0.95, 0, 0.4, gg).rotation.x = 1.2; shoeProp(d.c, d.c2, 0.1, -0.8, 0.05, -0.6, gg).rotation.x = 1.4; W.hang.push(gg); }
  // rooftop boards, the flag, air traffic
  billboard(scene, ADS[0], -21.5, 13, -5.6, Math.PI / 2, 8, 4); billboard(scene, ADS[2], 21.5, 12, -5.6, -Math.PI / 2, 8, 4); billboard(scene, ADS[3], 21.5, 11, 5.8, -Math.PI / 2, 8, 4); billboard(scene, ADS[5], -9, 10.5, 20.5, Math.PI, 9, 4.4); billboard(scene, ADS[1], 8, 11, 20.5, Math.PI, 9, 4.4);
  M(cyl(0.1, 0.14, 15, 8), toon('#c8d0d8'), -15.2, 7.5, -11.2, scene);
  if (S.home && homeLevel().lvl >= 10) billboard(scene, S.name + "'S CRIB\nA LANDMARK", -21.5, 19, 5.8, Math.PI / 2, 8, 4, '#7de3ff');
  const fl = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); x.fillStyle = '#ffc531'; x.font = '900 60px Archivo, Impact'; x.textAlign = 'center'; x.fillText('$', w * 0.21, hh * 0.42); });
  W.flag = new THREE.Mesh(new THREE.PlaneGeometry(5, 3, 10, 1), new THREE.MeshBasicMaterial({ map: fl, side: THREE.DoubleSide })); W.flag.position.set(-12.6, 13.3, -11.2); scene.add(W.flag);
  for (let i = 0; i < 5; i++) { const c = new THREE.Group(); ink(M(box(2.6, 0.6, 1.2), toon(pick(['#ff2d78', '#7de3ff', '#f2c14e', '#ece9e2', '#a78bff'])), 0, 0, 0, c), 1.05); M(box(1.3, 0.45, 1.0), toon('#16181c'), -0.1, 0.45, 0, c); M(box(2.2, 0.08, 1.0), flat(0x7de3ff), 0, -0.34, 0, c); scene.add(c); W.cars.push({ c, a: rnd(0, 6.28), r: rnd(30, 48), y: rnd(16, 30), s: rnd(0.08, 0.2) * (i % 2 ? 1 : -1) }); }
  // ---- life: steam from the manholes, smoke off the barrel, pigeons, paper in the wind, the sky, the weather ----
  for (const [mx, mz] of [[-6, 3], [8, -8], [3, 10]]) emitter('steam', mx, 0.05, mz, 3);
  emitter('smoke', -11, 1.2, 9.6, 3); emitter('spark', -11, 1.0, 9.6, 3); glow(-11, 1.3, 9.6, 0xff8a3c, 3.2, null, 0.6);
  pigeons(3.2, 4.4, 6); pigeons(-7.4, -5.2, 5); pigeons(9.5, -4.2, 4); litter(14, -14, 14, -10, 11);
  skyLife(64, 'BASKETBALL 2146 · PRE-ORDER YOUR KNEES'); W.weather = weather();
  for (const [x, z] of [[-14.6, -9.6], [14.6, -9.6], [-14.6, 10.6], [14.6, 10.6], [-14.6, 0.4], [14.6, 0.4]]) lamp(x, z, 0xffd9a0);
  // the soy dog cart: steam, an umbrella, a man who has seen things
  { const c = grp(scene, 11.4, 0, -2.6); c.rotation.y = -Math.PI / 2; ink(M(box(1.8, 0.9, 0.9), toon('#c8d0d8'), 0, 0.75, 0, c), 1.03); M(box(1.82, 0.12, 0.92), toon('#e04848'), 0, 1.25, 0, c);
    for (const sx of [-0.7, 0.7]) M(cyl(0.18, 0.18, 0.08, 10), toon('#20242c'), sx, 0.2, 0.47, c).rotation.x = Math.PI / 2; M(cyl(0.03, 0.03, 1.8, 5), toon('#6a707c'), 0, 2.0, 0, c);
    const um = M(geo('umb', () => new THREE.ConeGeometry(1.3, 0.5, 10, 1, true)), new THREE.MeshToonMaterial({ color: '#f2c14e', gradientMap: ramp(), side: THREE.DoubleSide }), 0, 2.9, 0, c); ink(um, 1.02);
    const s = sign('SOY DOGS · 15', 1.6, 0.36, '#f2c14e', '#0a0a0e', { border: false }); s.position.set(0, 1.0, 0.47); c.add(s); solid(10.8, 12, -3.6, -1.6);
    const vb = aiBuild(55, 'glass'); vb.worn = Object.assign(randomWorn(1), { head: 'hd_cap', top: 't_tee' }); vb.name = 'Soy Dog Sal'; addNpc(vb, 12.4, -2.6, -Math.PI / 2, 'idle', { talk: 'vendor' }); emitter('steam', 11.4, 1.35, -2.4, 2.5);
    spot(10.2, -2.6, 1.8, 'SOY DOG SAL (15 HC)', () => uiDialog('SOY DOG SAL', 'Soy dog, extra relish, 15 HC. Legally I have to say it is "dog-adjacent". +4 Stamina next game.', [['One dog (15)', () => { S.vc -= 15; S.boosts.push('dog'); save(); uiHud(); toast('SOY DOG', '+4 Stamina next game. Do not ask.'); sfx('coin'); }, '', S.vc < 15], ['Nah', null, 'alt']])); }
  // the dice crew by the hydrant
  for (let i = 0; i < 3; i++) { const a = i / 3 * 6.283, b = aiBuild(60); b.worn = randomWorn(1); addNpc(b, 11.4 + Math.cos(a) * 0.9, -8.6 + Math.sin(a) * 0.9, Math.atan2(-Math.cos(a), -Math.sin(a)), 'beg', { talk: 'dice' }); }
  for (let i = 0; i < 2; i++) { const d = M(box(0.07, 0.07, 0.07), toon('#ece9e2'), 11.3 + i * 0.12, 0.04, -8.6 + i * 0.05, scene); d.rotation.y = i; }
  solid(10.3, 12.5, -9.7, -7.5);
  guideInit();      /* guide.js: Walk-On meets a new player and takes them to Coach */
  npcSpace();
  chatter(W.npcs, n => n.bum ? CHAT.fiend : n.talk ? CHAT[n.talk] : n.anim === 'dance' ? CHAT.dance : n.anim === 'warm' ? CHAT.fire : n.anim === 'sit' ? CHAT.oldhead : n.cage ? CHAT.cage : CHAT.block);
  W.bounds = [-14.3, 14.3, -10.9, 11.5]; W.camBox = [-15.1, 15.1, -11.7, 18.6];
}

function buildPit() {
  scene.background = new THREE.Color(0x0e0f14); scene.fog = new THREE.Fog(0x0e0f14, 30, 120);
  baseLights(scene, 0xfff0e0, 0x2a2a32, 0xffe0c0, 1.5);
  for (const [x, z, c] of [[7.6, 2, 0x3dffa0], [-7.6, 2, 0x7de3ff], [0, -5, 0xfff2c8]]) { const l = new THREE.PointLight(c, 14, 13, 1.4); l.position.set(x, 3.2, z); scene.add(l); }
  const ft = canvasTex(1024, 768, (x, W_, H_) => {
    x.fillStyle = '#26272c'; x.fillRect(0, 0, W_, H_); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${RNG() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.02, 0.06)})`; x.fillRect(rnd(0, W_), rnd(0, H_), rnd(2, 22), rnd(2, 5)); }
    const cols = ['#ece9e2', '#f2c14e', '#7de3ff', '#ff2d78']; for (let i = 0; i < 4; i++) { const cx = (pitDoorX(i) + 10) / 20 * W_; x.strokeStyle = cols[i]; x.lineWidth = 8; x.beginPath(); x.moveTo(cx, H_ * 0.62); x.lineTo(cx, H_ * 0.12); x.stroke(); x.beginPath(); x.moveTo(cx - 22, H_ * 0.2); x.lineTo(cx, H_ * 0.1); x.lineTo(cx + 22, H_ * 0.2); x.stroke(); }
    x.save(); x.translate(W_ / 2, H_ * 0.78); x.transform(1, 0, -0.14, 1, 0, 0); x.textAlign = 'center'; x.font = '900 expanded 88px Archivo, Impact, sans-serif'; x.fillStyle = 'rgba(236,233,226,.5)'; x.fillText('WHO GOT NEXT', 0, 0); x.restore();
  });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(20, 16.5), new THREE.MeshToonMaterial({ map: ft, gradientMap: ramp() })); g.rotation.x = -Math.PI / 2; g.position.z = 2.25; scene.add(g);
  const g2 = M(new THREE.PlaneGeometry(300, 300), toon('#17181d'), 0, -0.05, 0, scene); g2.rotation.x = -Math.PI / 2;
  skyline(scene, 40, 52, ['#f2c14e', '#ffe9a8', '#7de3ff', '#ff2d78']);
  // the cage: chain link on every side, courts glowing behind the gates
  addFence(scene, -10, 10, -6, 10.5, 6); { const t = fenceTex(); t.repeat.set(18, 5.5); const m = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set(0, 3, 10.5); scene.add(m); }
  floodlight(-10, -6, 9, -3, 0); floodlight(10, -6, 9, 3, 0); floodlight(-10, 10.5, 9, -3, 2); floodlight(10, 10.5, 9, 3, 2);
  const cols = ['#ece9e2', '#f2c14e', '#7de3ff', '#ff2d78'];
  MODES.forEach((m, i) => {
    const x = pitDoorX(i);
    for (const sx of [-1, 1]) ink(M(box(0.22, 4.6, 0.22), toon('#1c1d22'), x + sx * 1.5, 2.3, PIT_DOOR_Z - 0.4, scene), 1.08);
    M(box(3.2, 0.12, 0.26), flat(cols[i]), x, 3.5, PIT_DOOR_Z - 0.4, scene); M(box(0.08, 3.5, 0.1), flat(cols[i]), x - 1.36, 1.75, PIT_DOOR_Z - 0.3, scene); M(box(0.08, 3.5, 0.1), flat(cols[i]), x + 1.36, 1.75, PIT_DOOR_Z - 0.3, scene);
    const s = sign(m.n.replace(' ', '\n'), 3.0, 1.35, cols[i], '#0a0a0e'); s.position.set(x, 4.4, PIT_DOOR_Z - 0.3); scene.add(s);
    const ic = sign(m.arcade ? 'TO 21 · NO RULES' : 'TO 11 · ONES & TWOS', 2.6, 0.34, cols[i], '#0a0a0e', { border: false }); ic.position.set(x, 3.2, PIT_DOOR_Z - 0.26); scene.add(ic);
    // the court behind this gate
    const ct = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 9), new THREE.MeshBasicMaterial({ color: m.arcade ? 0x2a1450 : 0x3b4252 })); ct.rotation.x = -Math.PI / 2; ct.position.set(x, 0.01, PIT_DOOR_Z - 5.4); scene.add(ct);
    M(box(4.3, 0.02, 0.1), flat(cols[i]), x, 0.03, PIT_DOOR_Z - 1.0, scene);
    const hp = hoopMesh(2, m.arcade ? 'arcade' : 'street'); hp.position.set(x, 0, PIT_DOOR_Z - 9); hp.scale.setScalar(0.9); scene.add(hp);
    spot(x, PIT_DOOR_Z + 1.4, 2.5, m.n, () => uiMode(m));
  });
  // Last Call: a cart with a light on, east side
  ink(M(box(1.3, 1.1, 2.6), toon('#1c1d22'), 8.6, 0.55, 2, scene), 1.03); ink(M(box(1.6, 0.12, 3.0), toon('#3dffa0', '#3dffa0'), 8.6, 2.5, 2, scene), 1.03); for (const sz of [-1.3, 1.3]) M(cyl(0.04, 0.04, 1.4, 5), toon('#6a707c'), 8.1, 1.8, 2 + sz, scene); solid(7.8, 10, 0.6, 3.4);
  const k = sign('LAST CALL', 2.6, 0.6, '#3dffa0', '#0a0a0e'); k.position.set(7.93, 0.62, 2); k.rotation.y = -Math.PI / 2; scene.add(k);
  for (let i = 0; i < 6; i++) M(cyl(0.09, 0.09, 0.3, 8), toon(pick(['#ff2d78', '#f2c14e', '#3dffa0', '#a78bff'])), 8.3, 1.26, 1.0 + i * 0.4, scene);
  const vb = aiBuild(70, 'glass'); vb.worn.face = 'f_mask'; addNpc(vb, 9.3, 2, -Math.PI / 2, 'idle'); spot(7.0, 2, 1.9, 'LAST CALL (boosts)', () => uiKiosk());
  // The Link: a phone booth that still works, west side
  ink(M(box(1.1, 2.6, 1.1), toon('#1c1d22'), -8.8, 1.3, 2, scene), 1.03); M(box(0.06, 1.2, 0.8), flat(0x7de3ff), -8.22, 1.7, 2, scene); solid(-10, -8, 1.2, 2.8);
  const ls = sign('THE LINK', 1.0, 0.36, '#7de3ff', '#0a0a0e'); ls.position.set(-8.23, 2.7, 2); ls.rotation.y = Math.PI / 2; scene.add(ls);
  const ls2 = sign('SEND YOUR BUILD · PULL UP A FRIEND', 3.6, 0.36, '#7de3ff', '#0a0a0e', { border: false }); ls2.position.set(-9.9, 3.6, 2); ls2.rotation.y = Math.PI / 2; scene.add(ls2);
  spot(-7.2, 2, 1.9, 'THE LINK (friends)', () => uiHomie());
  // out
  for (const sx of [-1, 1]) ink(M(box(0.22, 4.4, 0.22), toon('#1c1d22'), sx * 1.7, 2.2, 10.5, scene), 1.08); const ex = sign('THE BLOCK', 3.2, 0.6, '#ece9e2', '#0a0a0e'); ex.position.set(0, 3.9, 10.4); ex.rotation.y = Math.PI; scene.add(ex);
  // the ladder: six people who will play you one on one, in order
  { const b = sign('THE LADDER\nONES · TO 7', 2.6, 1.0, '#ff2d78', '#0a0a0e'); b.position.set(9.92, 3.6, 7.2); b.rotation.y = -Math.PI / 2; scene.add(b); }
  LADDER.forEach((L, i) => { const x = [-6.4, -4.3, -2.2, 2.2, 4.3, 6.4][i], z = [6.2, 7.1, 7.6, 7.6, 7.1, 6.2][i], n = addNpc(ladderBuild(i), x, z, Math.atan2(-x, -z + 2), (S.ladder || 0) > i ? 'cheer' : i === 6 ? 'idle' : 'idle');
    n.rig.root.add(nameTag(L.name, (S.ladder || 0) > i ? 'beaten' : (S.ladder || 0) === i ? 'ladder · next up' : 'ladder · ' + (i + 1), n.rig.H)); spot(x, z - 0.8, 1.2, 'CHALLENGE ' + L.name.toUpperCase(), () => uiLadder(i)); });
  spot(0, 8.9, 1.9, 'BACK TO THE BLOCK', () => enterWorld('hub', 0, -8.4, 0));
  stringLights(-10, -1, 10, -1.4, 6.4, 14); stringLights(-10, 5.5, 10, 5.2, 6.2, 14);
  for (let i = 0; i < 4; i++) { poster(scene, -9.96, 2.2, -4.6 + i * 1.55, Math.PI / 2, i % 2); poster(scene, 9.96, 2.2, 4.4 + (i > 1 ? 1.55 * (i - 2) : -9 + i * 1.55), -Math.PI / 2, (i + 1) % 2); }
  for (let i = 0; i < 4; i++) { const b = aiBuild(rnd(62, 92)); b.worn = randomWorn(2); addNpc(b, rnd(-5.5, 5.5), rnd(-1.5, 4.5), rnd(0, 6), ['ball', 'idle', 'cheer', 'dance'][i], { wander: i === 1, range: 1.5 }); }
  MODES.forEach((m, i) => { glow(pitDoorX(i), 1.8, PIT_DOOR_Z - 0.6, new THREE.Color(cols[i]).getHex(), 4.2, null, 0.35); glow(pitDoorX(i), 4.4, PIT_DOOR_Z - 0.1, new THREE.Color(cols[i]).getHex(), 3.4, null, 0.4); });
  glow(8.6, 2.4, 2, 0x3dffa0, 3, null, 0.5); glow(-8.3, 1.8, 2, 0x7de3ff, 2.4, null, 0.5); litter(8, -9, 9, -4, 9); skyLife(56, 'THE CAGES · WINNERS STAY'); W.weather = weather();
  npcSpace();
  chatter(W.npcs, n => n.name && LADDER.some(L => L.name === n.name) ? CHAT.ladder : CHAT.cage);
  W.bounds = [-9.2, 9.2, -4.6, 9.6]; W.camBox = [-9.7, 9.7, -5.4, 10.2];
}

// emotes: show the block how you feel (keys 1-5, or the buttons). Online friends nearby see them too.
const EMOTES = { wave: { an: 'call', n: 'WAVE', k: '1' }, dance: { an: 'dance', n: 'DANCE', k: '2' }, sit: { an: 'sit', n: 'SIT', k: '3', y: -0.4 }, cheer: { an: 'cheer', n: 'HYPE', k: '4' }, celeb: { an: 'celeb', n: 'CELEBRATE', k: '5' } };
function emote(k) { if (!W || W.build || !EMOTES[k]) return; W.me.emote = W.me.emote === k ? null : k; W.me.sit = null; NET.em = W.me.emote; sfx('ui'); }
// chat: T (or the chat button), type, Enter. A bubble over your head; online friends in the same place see it.
function chatOpen() {
  if (!W || W.build || UI.cur) return; let el = $('chatbox'); if (!el) { el = document.createElement('input'); el.id = 'chatbox'; el.maxLength = 60; el.placeholder = 'Say something (Enter)'; el.autocomplete = 'off'; document.body.appendChild(el);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { chatSend(el.value); el.value = ''; el.blur(); el.style.display = 'none'; } else if (e.key === 'Escape') { el.blur(); el.style.display = 'none'; } e.stopPropagation(); }); el.addEventListener('blur', () => { el.style.display = 'none'; }); }
  for (const k in keys) keys[k] = false; el.style.display = 'block'; setTimeout(() => el.focus(), 0);
}
function chatSend(t) { t = String(t || '').replace(/[<>]/g, '').trim().slice(0, 60); if (!t || !W) return; bubble(W.me.rig.root, t, 5); NET.say = { i: (NET.say ? NET.say.i : 0) + 1, t }; sfx('ui'); }
addEventListener('keydown', e => {
  if (!W || UI.cur || W.build || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.code === 'KeyT') { e.preventDefault(); chatOpen(); } else { const k = Object.keys(EMOTES).find(x => 'Digit' + EMOTES[x].k === e.code); if (k) emote(k); }
});

// buildCrib lives in home.js (the lot, the house and the home builder)

// first days on the Block: one line under the HC chip saying what to do next, with an arrow that points there.
// It stays until it is done (the welcome toast was gone in 3.5 s and never came back)
function goalStep(me) {
  const g = $('goal'); if (!g) return; let G = null;
  if (W.kind === 'hub' && !W.visit && !MT) {
    const drilled = Object.values(S.drills || {}).some(d => (d.medal || 0) >= 1), games = (S.life && S.life.games) || 0;
    if (!drilled && !S.coachMet && games < 3) G = { t: 'Talk to Coach Overtime', s: 'by the DRILLS board · drills pay you to learn', x: -3.4, z: 4.0 };
    else if (games < 1) G = { t: 'Call next at THE CAGES', s: 'walk up to a court gate and press ' + (I.hasPad && I.padAt >= (window.__kbAt || 0) ? 'A' : 'E'), x: 0, z: -10.3 };
  }
  if (!G) { if (g.style.display !== 'none') g.style.display = 'none'; return; }
  if (g.dataset.t !== G.t) { g.dataset.t = G.t; g.lastElementChild.innerHTML = esc(G.t) + '<small>' + esc(G.s) + '</small>'; }
  g.style.display = 'flex';
  const a = Math.atan2(G.x - me.x, G.z - me.z) - W.yaw, here = Math.hypot(G.x - me.x, G.z - me.z) < 2.5;      /* screen-up is the way the camera looks */
  g.firstElementChild.style.transform = here ? 'rotate(90deg)' : `rotate(${(-a * 180 / Math.PI - 90).toFixed(0)}deg)`;
}
function worldStep(dt) {
  if (!W) return; W.t += dt; const me = W.me, I = IN[0], building = !!W.build, busy = uiBusy() || building;
  let mx = busy ? 0 : I.mx, my = busy ? 0 : I.my;
  if (me.emote && (Math.hypot(mx, my) > 0.3 || building)) me.emote = null;
  if (me.sit && (Math.hypot(mx, my) > 0.3 || building)) { me.sit = null; me.x += Math.sin(me.face) * 0.9; me.z += Math.cos(me.face) * 0.9; }
  if (W.cursor && !building) W.cursor.visible = false; if (W.hoverBox && !building) { scene.remove(W.hoverBox); W.hoverBox = null; }
  if (!busy) W.yaw -= (I.rx * 2.4 + mx * (I.analog ? 0.4 : 0.45) * Math.min(1, Math.abs(my) + 0.4)) * dt;      /* on keys A/D mostly strafe; the camera follows less */
  // camera looks along (sin yaw, cos yaw)
  const fx = Math.sin(W.yaw), fz = Math.cos(W.yaw), rx = -fz, rz = fx;
  // speed off the court: keys walk (Shift runs). A stick or thumb sets it by how far you push: a walk up to about 80%,
  // then a smooth ramp into the run at full push (no on/off flip at a threshold, which made the body jerk between gaits)
  const RUNV = 5.6, sm = Math.min(1, Math.hypot(mx, my)), ramp = (u => u * u * (3 - 2 * u))(clamp((sm - 0.8) / 0.18, 0, 1));
  const sp = I.analog ? (I.sprintBtn ? RUNV : (1.5 + (RUNV - 1.5) * ramp) / Math.max(sm, 0.01) * Math.min(1, sm / 0.75)) : (I.sprint ? RUNV : 2.4);      /* keys jog: walking pace made the Block feel huge */
  const tvx = (fx * -my + rx * mx) * sp, tvz = (fz * -my + rz * mx) * sp, ddx = tvx - me.vx, ddz = tvz - me.vz, dl = Math.hypot(ddx, ddz);
  const brake = me.vx * tvx + me.vz * tvz < 0 || Math.hypot(tvx, tvz) < 0.1, acc = (brake ? 34 : 17) * dt;
  if (dl <= acc) { me.vx = tvx; me.vz = tvz; } else { me.vx += ddx / dl * acc; me.vz += ddz / dl * acc; }
  if (me.sit) { me.vx = me.vz = 0; }
  let nx = me.sit ? me.x : me.x + me.vx * dt, nz = me.sit ? me.z : me.z + me.vz * dt;
  if (!me.sit) for (const s of W.solids) { if (nx > s[0] && nx < s[1] && nz > s[2] && nz < s[3]) { const px = Math.min(nx - s[0], s[1] - nx), pz = Math.min(nz - s[2], s[3] - nz); if (px < pz) nx = nx - s[0] < s[1] - nx ? s[0] : s[1]; else nz = nz - s[2] < s[3] - nz ? s[2] : s[3]; } }
  if (!me.sit && W.rounds) for (const [cx, cz, cr] of W.rounds) { const ex = nx - cx, ez = nz - cz, ed = Math.hypot(ex, ez); if (ed < cr && ed > 1e-4) { let ux = ex / ed, uz = ez / ed; const tx = -uz, tz = ux, tv = me.vx * tx + me.vz * tz, nv = me.vx * ux + me.vz * uz; if (nv < 0) { const side = Math.abs(tv) > 0.4 ? Math.sign(tv) : (me.x - cx >= 0 ? 1 : -1), k = Math.min(0.12, -nv * dt * 1.2); const ax = ux + tx * side * k * 4, az = uz + tz * side * k * 4, al = Math.hypot(ax, az); ux = ax / al; uz = az / al; } nx = cx + ux * cr; nz = cz + uz * cr; } }      /* head-on you are eased round it, never pinned */
  me.x = clamp(nx, W.bounds[0], W.bounds[1]); me.z = clamp(nz, W.bounds[2], W.bounds[3]);
  const v = Math.hypot(me.vx, me.vz); if (v > 0.5) me.face = lerpAng(me.face, Math.atan2(me.vx, me.vz), 1 - Math.exp(-12 * dt));
  me.ph += dt * (4 + v * 1.6);
  const R = me.rig;
  if (me.sit) { const st = me.sit; me.x = st.x; me.z = st.z; me.face = st.face; R.root.position.set(st.x, st.y, st.z); R.root.rotation.y = st.face; applyPose(R, poseOf('sit', W.t, { leg: R.legLen }), dt); R.gait = null; }
  else if (me.emote && v < 0.3) { const e = EMOTES[me.emote]; R.root.position.set(me.x, e.y || 0, me.z); R.root.rotation.y = me.face; applyPose(R, poseOf(e.an, W.t, Object.assign({ leg: R.legLen, style: S.moves.celeb, ph: 0 }, e.o || {})), dt); R.gait = null; }
  else locoAnim(R, me.x, me.z, me.face, dt, me.vx, me.vz); R.capeSwing = v / 8;
  // npcs
  for (const n of W.npcs) {
    if (n.cast) continue;      /* cast.js animates its own people */
    let an = n.anim === 'ball' ? 'dribble' : n.anim, o = { ph: n.ph, leg: n.rig.legLen, sp: 0, dr: Math.abs(Math.sin(W.t * 7 + n.ph)) };
    if (n.wander && !(n.bum && W.talk === n)) {
      n.wt -= dt; if (n.wt <= 0) { n.wt = rnd(3, 9); const rg = n.range || 2.5; for (let k = 0; k < 8; k++) { const tx = n.hx + rnd(-rg, rg), tz = n.hz + rnd(-rg, rg); if (W.npcs.some(o => o !== n && Math.hypot(o.x - tx, o.z - tz) < 1.8) || W.spots.some(s => s !== n.spot && Math.hypot(s.x - tx, s.z - tz) < 1.4) || W.solids.some(s => tx > s[0] && tx < s[1] && tz > s[2] && tz < s[3])) continue; n.tx = tx; n.tz = tz; break; } }      /* somewhere nobody is standing */
      const dx = n.tx - n.x, dz = n.tz - n.z, l = Math.hypot(dx, dz);
      for (const o of W.npcs) { if (o === n) continue; const ex = n.x - o.x, ez = n.z - o.z, ed = Math.hypot(ex, ez); if (ed < 1.3 && ed > 0.01) { n.x += ex / ed * (1.3 - ed) * 2 * dt; n.z += ez / ed * (1.3 - ed) * 2 * dt; } }      /* and never through each other on the way */
      if (l > 0.3) { n.x += dx / l * 1.1 * dt; n.z += dz / l * 1.1 * dt; n.face = lerpAng(n.face, Math.atan2(dx, dz), 0.1); an = 'loco'; if (n.spot) { n.spot.x = n.x; n.spot.z = n.z; } }
      else if (Math.hypot(me.x - n.x, me.z - n.z) < 5 && n.bum) n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.08);
    }
    if (an === 'loco' || (n.wander && an === n.anim && (an === 'idle' || an === 'beg'))) { if (an === 'loco') locoAnim(n.rig, n.x, n.z, n.face, dt, undefined, undefined, n.swag === undefined ? (n.swag = 0.4 + RNG() * 0.6) : n.swag); else { n.rig.root.position.set(n.x, n.yFix || 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, poseOf(an, W.t, o), dt); gaitStep(n.rig, { x: n.x, z: n.z, yaw: n.face, vx: 0, vz: 0, grounded: true, wide: 0.2, want: 1, dt }); legIK(n.rig, dt); } }
    else { n.rig.root.position.set(n.x, n.yFix || 0, n.z); n.rig.root.rotation.y = n.face;
      if (an === 'idle' && !n.bum && !n.still) { n.ambT = (n.ambT || rnd(1, 6)) - dt; if (n.ambT <= 0 || !n.amb) { n.amb = pick(CROWD_AMBIENT.filter(k => k !== 'film')); n.ambT = rnd(4, 11); } applyPose(n.rig, crowdPose(n.amb, W.t, { ph: n.ph }, n.rig.prof), dt); }      /* people standing around have habits: phone, talking, bobbing, arms crossed */
      else applyPose(n.rig, poseOf(an, W.t, an === 'idle' ? Object.assign({ prof: n.rig.prof, ph: n.ph }, o) : o), dt); }
    if (n.anim === 'ball' && n.ball) { const hgt = Math.abs(Math.sin(W.t * 7 + n.ph)); n.ball.position.set(n.x + Math.sin(n.face) * 0.3 - Math.cos(n.face) * 0.27, 0.125 + hgt * 0.75, n.z + Math.cos(n.face) * 0.3 + Math.sin(n.face) * 0.27); o.dr = hgt; }
  }
  if (W.guide) guideStep(dt); if (W.park) parkStep(dt); if (W.cast) castStep(dt); holoStep(dt);
  for (const c of W.cars) { c.a += c.s * dt; c.c.position.set(Math.cos(c.a) * c.r, c.y, Math.sin(c.a) * c.r); c.c.rotation.y = -c.a + (c.s > 0 ? -Math.PI / 2 : Math.PI / 2); }
  if (W.train) { W.train.position.x += dt * 16; if (W.train.position.x > 95) W.train.position.x = -140 - rnd(0, 120); }
  if (W.eq) { W.eq.forEach((e, i) => { const v = 0.2 + Math.abs(Math.sin(W.t * (6 + i * 1.3) + i)) * (0.5 + 0.5 * Math.abs(Math.sin(W.t * 1.9))); e.scale.y = v * 2; e.position.y = 1.02 + v * 0.3; }); const pu = 1 + Math.max(0, Math.sin(W.t * 11.4)) * 0.08; for (const sp of W.speakers) sp.scale.set(pu, 1, pu); }
  if (W.flames) { W.flames.forEach((f, i) => { f.scale.set(1, 0.7 + Math.abs(Math.sin(W.t * (9 + i * 2) + i)) * 0.8, 1); f.position.y = 1.1 + f.scale.y * 0.2; }); if (W.fireLight) W.fireLight.intensity = 16 + Math.sin(W.t * 13) * 5 + Math.sin(W.t * 7.3) * 3; }
  if (W.hang) W.hang.forEach((g, i) => { g.rotation.z = Math.sin(W.t * 1.3 + i * 2) * 0.12; });
  if (W.bulbs && (W.bt = (W.bt || 0) + dt) > 0.4) { W.bt = 0; const k = Math.floor(W.t * 2.5); W.bulbs.forEach((b, i) => b.scale.setScalar((i + k) % 3 === 0 ? 1.35 : 0.9)); }
  ambientStep(dt, camera, me); homeAnimStep(dt);
  if (W.flag) { const pa = W.flag.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 1.2 + W.t * 3) * 0.25 * (pa.getX(i) / 3 + 1)); pa.needsUpdate = true; }
  // nearest interactable
  let near = null, nd = 99; for (const s of W.spots) { const d = Math.hypot(s.x - me.x, s.z - me.z); if (d >= s.r) continue; const fc = d > 0.2 ? ((s.x - me.x) * Math.sin(me.face) + (s.z - me.z) * Math.cos(me.face)) / d : 1, sc = d + (s.low ? 1.2 : 0) - fc * 0.9; if (sc < nd) { nd = sc; near = s; } }      /* the one you face wins over one passing behind you */      /* a wandering beggar never takes the prompt off somebody you came to see */
  if (near !== W.near) { W.near = near; const p = $('prompt'); if (near) { p.textContent = near.label; p.style.display = 'block'; } else p.style.display = 'none'; }
  if (busy) $('prompt').style.display = 'none'; else if (W.near) $('prompt').style.display = 'block';
  goalStep(me);
  if (building) { buildStep(dt); return; }
  if (!busy && W.near && I.aP) { sfx('uiok'); W.near.fn(); }
  else if (!busy && I.start) uiPlayer('attrs');
  else if (!busy && I.pe && I.pe.y && (W.kind === 'crib' || W.kind === 'room') && !W.visit && !W.build && typeof buildEnter === 'function') buildEnter();
  // camera
  if (!W.cf || Math.hypot(me.x - W.cf.x, me.z - W.cf.z) > 3) W.cf = { x: me.x, z: me.z }; { const kf = 1 - Math.exp(-14 * dt); W.cf.x += (me.x - W.cf.x) * kf; W.cf.z += (me.z - W.cf.z) * kf; } const cm = W.cf;      /* the camera follows a smoothed you: sliding round the statue nudged the body every frame and the camera copied the wobble */
  const portrait = innerWidth < innerHeight, back = portrait ? 7.5 : 6.2, up = portrait ? 3.8 : 3.1;
  let cx = cm.x - fx * back, cz = cm.z - fz * back, lift = 0;
  // keep the camera inside the place and the player in sight: pull it in (and up) until the line to them is clear
  const cb = W.camBox, blocked = (x, z) => (cb && (x < cb[0] || x > cb[1] || z < cb[2] || z > cb[3])) || W.solids.some(s => x > s[0] + 0.06 && x < s[1] - 0.06 && z > s[2] + 0.06 && z < s[3] - 0.06) || (W.rounds || []).some(([rx, rz, rr]) => Math.hypot(x - rx, z - rz) < rr - 0.05);      /* the statue is round now; it blocked the view because only boxes counted */
  let bT = back; for (let b = back; b > 0.9; b -= 0.2) { bT = b; let ok = true; for (let t = 1.0; t <= b; t += 0.3) if (blocked(cm.x - fx * t, cm.z - fz * t)) { ok = false; break; } if (ok && !blocked(cm.x - fx * b, cm.z - fz * b)) break; }
  { const cur = W.camPull === undefined ? bT : W.camPull; W.camPull = cur + (bT - cur) * (1 - Math.exp(-(bT < cur ? 10 : 2.5) * dt)); }      /* glide in quickly when something gets in the way, ease back out slowly: no hitch passing a pole */
  { const b = W.camPull; cx = cm.x - fx * b; cz = cm.z - fz * b; lift = -Math.min(up - 2.0, (back - b) * 0.3); }      /* pushed in close it drops toward shoulder height, a third-person camera */
  if (W.kind === 'crib') { cx = clamp(cx, W.bounds[0] - 6, W.bounds[1] + 6); cz = clamp(cz, W.bounds[2] - 1, W.bounds[3] + 6); }
  if (W.camO) { camera.position.lerp(W.camO.p, 1 - Math.exp(-5 * dt)); camera.lookAt(W.camO.l); return; }      /* watching the bones */
  if (W.look) {   // shop / closet: swing round to look at your drip
    const mfx = Math.sin(me.face), mfz = Math.cos(me.face), sx = mfz, sz = -mfx;
    if (portrait) { _v.set(cm.x + mfx * 5.6, 0.6, cm.z + mfz * 5.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(cm.x, -0.6, cm.z); }
    else { _v.set(cm.x + mfx * 4.2 + sx * 1.6, 1.3, cm.z + mfz * 4.2 + sz * 1.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(cm.x + sx * 1.6, 1.0, cm.z + sz * 1.6); }
    return;
  }
  _v.set(cx, up + lift, cz); if (!W.camInit) { camera.position.copy(_v); W.camInit = true; } else camera.position.lerp(_v, 1 - Math.exp(-7 * dt));
  fadeStep(camera.position, me, dt);
  { const k = clamp(-lift / 1.1, 0, 1) * 0.6; camera.lookAt(cm.x + fx * 2 * (1 - k), 1.7 - 0.6 * k, cm.z + fz * 2 * (1 - k)); }      /* pulled in close past something: look at him, not over his head */
}

function startPractice(kind) {
  const fl = cribTier('floor'), back = W.kind;
  uiClose(); document.body.dataset.state = 'match';
  startMatch({ mode: { n: kind === 'rack' ? 'MONEY RACK' : 'SHOOT AROUND', size: 1, arcade: false, to: 999 }, tier: TIERS_COURT[0], practice: kind, court: kind === 'rack' ? 'street' : ['drive', 'black', 'show', 'wood'][fl], hoopTier: kind === 'rack' ? 1 : cribTier('hoop'), ball: S.worn.ball,
    teams: [[{ b: myBuild(), ctrl: 0, mine: true }], []], onEnd: res => afterPractice(res, back) });
}
