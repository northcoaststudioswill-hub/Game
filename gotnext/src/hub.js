// GOT NEXT — walking around: The Block (hub), The Cages (mode doors), My Crib (home court)
'use strict';
let W = null;
function worldPlayerRig() {
  if (W.me.rig) scene.remove(W.me.rig.root);
  W.me.rig = makeRig(myBuild()); scene.add(W.me.rig.root);
}
function addNpc(build, x, z, face, anim, extra) {
  const r = makeRig(build, !!(extra && extra.low)); r.root.position.set(x, 0, z); r.root.rotation.y = face; scene.add(r.root);
  const n = Object.assign({ rig: r, x, z, face, anim: anim || 'idle', ph: rnd(0, 6), hx: x, hz: z, tx: x, tz: z, wt: rnd(1, 5) }, extra || {}); if (n.anim === 'ball') { n.ball = makeBall(pick(['bl_std', 'bl_rwb', 'bl_neon'])); scene.add(n.ball); } W.npcs.push(n); return n;
}
function spot(x, z, r, label, fn) { W.spots.push({ x, z, r, label, fn }); }
function solid(x0, x1, z0, z1) { W.solids.push([x0, x1, z0, z1]); }
function building(x, z, w, d, h, col, label, labelCol, face) {
  ink(M(box(w, h, d), brickMat(col, Math.max(w, d), h), x, h / 2, z, scene), 1.015); solid(x - w / 2 - 0.4, x + w / 2 + 0.4, z - d / 2 - 0.4, z + d / 2 + 0.4);
  M(box(w + 0.5, 0.5, d + 0.5), toon('#16181c'), x, h + 0.25, z, scene); M(box(w + 0.1, 1.0, d + 0.1), toon('#26262c'), x, 0.5, z, scene);
  const ew = face === 'e' || face === 'w', sgn = face === 'e' || face === 's' ? 1 : -1;
  const fx = ew ? x + sgn * (w / 2 + 0.07) : x, fz = ew ? z : z + sgn * (d / 2 + 0.07), ry = { n: Math.PI, s: 0, e: Math.PI / 2, w: -Math.PI / 2 }[face];
  const s = sign(label, Math.min(ew ? d : w, 7) * 0.92, 1.7, labelCol, '#0a0a0e'); s.position.set(fx, Math.min(h - 1.4, 5.2), fz); s.rotation.y = ry; scene.add(s);
  // roll-up door, lit from inside, and windows above
  M(box(ew ? 0.1 : 2.6, 3.2, ew ? 2.6 : 0.1), flat(labelCol, { transparent: true, opacity: 0.9 }), fx, 1.6, fz, scene);
  M(box(ew ? 0.14 : 2.2, 2.8, ew ? 2.2 : 0.14), flat(0x0b0b0e), fx, 1.4, fz, scene);
  for (let i = 0; i < 3; i++) for (let j = 0; h > 7 && j < 1; j++) { const o = (i - 1) * 2.6; M(box(ew ? 0.1 : 1.3, 1.3, ew ? 1.3 : 0.1), flat(RNG() < 0.6 ? 0xffd28a : 0x20222a), ew ? fx : fx + o, h - 1.3 + j, ew ? fz + o : fz, scene); }
  return { fx, fz, ry };
}
function lamp(x, z, col) { M(cyl(0.07, 0.09, 5, 6), toon('#20242c'), x, 2.5, z, scene); M(sph(0.28, 8, 6), flat(col || 0xffe9a8), x, 5.1, z, scene); const g = M(geo('glow', () => new THREE.CircleGeometry(2.6, 16)), flat(col || 0xffe9a8, { transparent: true, opacity: 0.1, depthWrite: false }), x, 0.03, z, scene); g.rotation.x = -Math.PI / 2; }
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
  M(cyl(0.12, 0.16, h, 6), toon('#2a2c33'), x, h / 2, z, scene); const head = M(box(1.6, 0.7, 0.3), toon('#2a2c33'), x, h + 0.2, z, scene); head.lookAt(tx, 0, tz);
  const lit = M(box(1.4, 0.5, 0.06), flat(0xfff6dc), x, h + 0.2, z, scene); lit.lookAt(tx, 0, tz); lit.translateZ(0.17);
  const cone = M(geo('cone', () => { const g = new THREE.ConeGeometry(4.2, 11, 14, 1, true); g.translate(0, -5.5, 0); return g; }), flat(0xfff2c8, { transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), x, h + 0.2, z, scene);
  cone.lookAt(tx, h + 0.2 - 9, tz); cone.rotateX(Math.PI / 2);
}
function stringLights(x0, z0, x1, z1, y, n) {
  const pts = [], cols = [0xff2d78, 0xf2c14e, 0x7de3ff, 0xece9e2];
  for (let i = 0; i <= n; i++) { const u = i / n, sag = Math.sin(u * Math.PI) * 1.1, px = lerp(x0, x1, u), pz = lerp(z0, z1, u), py = y - sag; pts.push(V3(px, py, pz)); if (i > 0 && i < n) { const b = M(sph(0.11, 6, 5), flat(cols[i % 4]), px, py - 0.14, pz, scene); (W.bulbs = W.bulbs || []).push(b); } }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x08080a })));
}
function shoeProp(col, sole, x, y, z, ry, parent) { const g = grp(parent || scene, x, y, z); g.rotation.y = ry || 0; ink(M(box(0.13, 0.11, 0.34), toon(col), 0, 0.07, 0, g), 1.12); M(box(0.14, 0.035, 0.36), toon(sole), 0, 0.015, 0, g); M(box(0.125, 0.1, 0.12), toon(col), 0, 0.15, -0.1, g); return g; }
const PIT_DOOR_Z = -5.6; function pitDoorX(i) { return -6.75 + i * 4.5; }

// walking around off the court: speed measured from actual movement drives the walk/jog/sprint blend, the hips and
// shoulders, a lean into speeding up and slowing down, and the planted-feet layer
function locoAnim(R, x, z, face, dt, vx, vz) {
  const L = R.loco || (R.loco = { x, z, vx: 0, vz: 0, lean: 0 });
  if (vx === undefined) { vx = (x - L.x) / Math.max(dt, 1e-3); vz = (z - L.z) / Math.max(dt, 1e-3); if (Math.hypot(x - L.x, z - L.z) > 1) vx = vz = 0; }
  const ax = (vx - L.vx) / Math.max(dt, 1e-3), az = (vz - L.vz) / Math.max(dt, 1e-3); L.x = x; L.z = z; L.vx = vx; L.vz = vz;
  const v = Math.hypot(vx, vz), fwdA = ax * Math.sin(face) + az * Math.cos(face);
  L.lean = lerp(L.lean, clamp(fwdA * 0.014, -0.18, 0.2), 1 - Math.exp(-8 * dt));
  let hipYaw = 0; if (v > 0.6) { let a = Math.atan2(vx, vz) - face; a = Math.atan2(Math.sin(a), Math.cos(a)); if (Math.abs(a) < 2.3) hipYaw = clamp(a, -0.5, 0.5) * Math.min(1, v / 2.5) * 0.6; }
  applyPose(R, poseOf(v > 0.15 || (R.gait && (R.gait.ft.R.sw || R.gait.ft.L.sw)) ? 'loco' : 'idle', W.t, { v, ph: R.gait ? R.gait.ph : 0, leanF: L.lean, hipYaw }), dt);
  R.root.position.set(x, 0, z); R.root.rotation.y = face;
  gaitStep(R, { x, z, yaw: face, vx, vz, grounded: true, wide: v < 0.3 ? 0.22 : 0, want: 1, dt }); legIK(R, dt);
}
function enterWorld(kind, sx, sz, face) {
  disposeScene(scene); scene = new THREE.Scene(); MT = null; hudShow(false);
  W = { kind, me: { x: sx || 0, z: sz || 0, face: face === undefined ? Math.PI : face, vx: 0, vz: 0, rig: null, ph: 0 }, yaw: face === undefined ? Math.PI : face, npcs: [], spots: [], solids: [], cars: [], near: null, t: 0, bounds: [-30, 30, -30, 30] };
  musicMode = 'hub'; $('prompt').style.display = 'none';
  if (kind === 'hub') buildHub(); else if (kind === 'pit') buildPit(); else buildCrib();
  worldPlayerRig(); W.camInit = false; $('wtag').textContent = kind === 'hub' ? 'THE BLOCK · USA 2145' : kind === 'pit' ? 'THE CAGES' : 'MY CRIB';
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
  });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), new THREE.MeshToonMaterial({ map: gt, gradientMap: ramp() })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const g2 = M(new THREE.PlaneGeometry(400, 400), toon('#17181d'), 0, -0.05, 0, scene); g2.rotation.x = -Math.PI / 2;
  skyline(scene, 54, 58, ['#f2c14e', '#ffe9a8', '#ffe9a8', '#7de3ff', '#ff2d78']);

  // ---- THE CAGES: a floodlit cage across the whole north side ----
  const ft = () => { const t = fenceTex(); return t; };
  const fenceSeg = (x0, x1, z, h) => { const w = x1 - x0, t = ft(); t.repeat.set(w / 1.1, h / 1.1); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set((x0 + x1) / 2, h / 2, z); scene.add(m); M(box(w, 0.1, 0.1), toon('#6a707c'), (x0 + x1) / 2, h, z, scene); M(box(w, 0.1, 0.1), toon('#6a707c'), (x0 + x1) / 2, 0.05, z, scene); };
  fenceSeg(-16, -2.2, -12, 6.5); fenceSeg(2.2, 16, -12, 6.5); solid(-16.5, -2.2, -12.6, -11.6); solid(2.2, 16.5, -12.6, -11.6);
  for (const x of [-16, -11.4, -6.8, -2.2, 2.2, 6.8, 11.4, 16]) ink(M(cyl(0.09, 0.09, 6.5, 6), toon('#6a707c'), x, 3.25, -12, scene), 1.2);
  for (const sx of [-1, 1]) { const t = ft(); t.repeat.set(18, 6); const m = new THREE.Mesh(new THREE.PlaneGeometry(20, 6.5), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set(sx * 16, 3.25, -22); m.rotation.y = Math.PI / 2; scene.add(m); }
  // gate: steel truss with the name on it
  for (const sx of [-1, 1]) ink(M(box(0.35, 8.4, 0.35), toon('#1c1d22'), sx * 2.4, 4.2, -12, scene), 1.06);
  ink(M(box(9.6, 1.9, 0.5), toon('#1c1d22'), 0, 8.2, -12, scene), 1.03);
  const ps = sign('THE CAGES', 9, 1.6, '#ece9e2', '#0a0a0e'); ps.position.set(0, 8.2, -11.72); scene.add(ps);
  M(box(9.6, 0.14, 0.52), flat(0xff2d78), 0, 7.2, -12, scene);
  const ps2 = sign('CALL NEXT  //  WINNERS STAY', 4.4, 0.42, '#ff2d78', '#0a0a0e', { border: false }); ps2.position.set(0, 6.85, -11.72); scene.add(ps2);
  // the show court inside the cage
  const ct = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshToonMaterial({ map: courtTex('street'), gradientMap: ramp() })); ct.rotation.x = -Math.PI / 2; ct.position.set(0, 0.012, -22); scene.add(ct);
  const hp = hoopMesh(2, 'street'); hp.position.set(0, 0, -28); scene.add(hp);
  floodlight(-15, -13, 10, -4, -22); floodlight(15, -13, 10, 4, -22); floodlight(-15, -31, 10, -3, -23); floodlight(15, -31, 10, 3, -23);
  for (let i = 0; i < 4; i++) { const b = aiBuild(rnd(70, 95)); b.worn = randomWorn(3); addNpc(b, rnd(-5, 5), rnd(-25.5, -17), rnd(0, 6), i === 0 ? 'cheer' : 'ball', { cage: true }); }
  for (let r = 0; r < 3; r++) ink(M(box(12, 0.4, 0.9), toon('#3a3c44'), 0, 0.3 + r * 0.45, -31 - r * 0.9, scene), 1.02);
  for (let i = 0; i < 7; i++) { const b = aiBuild(60); const n = addNpc(b, -5 + i * 1.7, -31 - (i % 3) * 0.9, 0, 'cheer', { low: true }); n.rig.root.position.y = 0.5 + (i % 3) * 0.45; n.yFix = n.rig.root.position.y; }
  spot(0, -10.3, 2.4, 'ENTER THE CAGES', () => enterWorld('pit', 0, 3.4, Math.PI));
  // elevated train behind it all
  M(box(120, 0.6, 3), toon('#23242a'), 0, 9.2, -37, scene); for (let x = -50; x <= 50; x += 10) M(box(0.8, 9, 0.8), toon('#23242a'), x, 4.5, -37, scene);
  W.train = new THREE.Group(); for (let i = 0; i < 4; i++) { ink(M(box(8.6, 2.6, 2.4), toon('#b9bec7'), i * 9, 0, 0, W.train), 1.02); M(box(8.2, 0.9, 2.44), flat(0xffe9a8), i * 9, 0.35, 0, W.train); M(box(8.6, 0.3, 2.44), flat(0xff2d78), i * 9, -0.8, 0, W.train); } W.train.position.set(-90, 11, -37); scene.add(W.train);

  // ---- the block: four fronts, close enough to hear each other ----
  building(-21.5, -5.6, 12, 8.6, 9, '#7a4034', 'THE LAB', '#3dffa0', 'e'); spot(-13.6, -5.6, 2.2, 'THE LAB (attributes)', () => uiPlayer('attrs'));
  building(-21.5, 5.8, 12, 9.6, 11, '#5a4640', 'MY CRIB', '#7de3ff', 'e'); spot(-13.4, 5.8, 2.2, 'GO HOME', () => enterWorld('crib', 0, 13.5, Math.PI));
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
  M(box(2.6, 0.04, 3.4), flat(0x050506), -6.4, 0.03, 10.2, scene); for (const [rx, rz, rw, rd] of [[-7.75, 10.2, 0.1, 3.4], [-5.05, 10.2, 0.1, 3.4], [-6.4, 11.9, 2.8, 0.1]]) ink(M(box(rw, 1.0, rd), toon('#3dffa0'), rx, 0.5, rz, scene), 1.06); for (let i = 0; i < 5; i++) M(box(2.5, 0.05, 0.3), toon('#3a3c44'), -6.4, -0.02 - i * 0.02, 9.0 + i * 0.5, scene);
  M(cyl(0.06, 0.06, 3.2, 6), toon('#1c1d22'), -7.75, 1.6, 8.5, scene); const sb = sign('UPTOWN LINE', 2.4, 0.5, '#3dffa0', '#0a0a0e'); sb.position.set(-6.6, 3.0, 8.5); scene.add(sb); for (let i = 0; i < 5; i++) M(box(0.06, 1.4, 0.06), toon('#6a707c'), -7.4 + i * 0.5, 0.7, 8.55, scene); M(box(2.4, 0.06, 0.06), toon('#6a707c'), -6.4, 0.9, 8.55, scene); solid(-8, -4.8, 8.4, 12.2);
  spot(-6.4, 7.6, 1.8, 'UPTOWN LINE', () => uiDialog('UPTOWN LINE', 'Gate is chained. A sticker on it says: MORE CITY SOON. Somebody wrote "that\'s what they said in 2139" under it.', [['Aight.', null]]));
  mural('NO\nREFS', 5.4, 3.4, ['#2a1408', '#ff6a3d', '#f2c14e', '#fff3b0', '#ffffff'], -15.42, 2.4, -0.4, Math.PI / 2);
  mural('KINGS\nSTAY', 5.4, 3.0, ['#081a2a', '#7de3ff', '#a78bff', '#ffffff', '#08080a'], 15.42, 2.3, 0.2, -Math.PI / 2);
  for (let i = 0; i < 2; i++) { poster(scene, -15.42, 2.1, -10.9 + i * 1.55, Math.PI / 2, i % 2); poster(scene, 15.42, 2.1, 10.2 + i * 1.55 * -1, -Math.PI / 2, (i + 1) % 2); poster(scene, -15.42, 2.1, 10.9 - i * 1.55, Math.PI / 2, (i + 1) % 2); }
  // centrepiece: the Freedom Eagle, gold, mid-dunk
  ink(M(cyl(1.3, 1.6, 0.9, 8), toon('#3a3c44'), 0, 0.45, 1.6, scene), 1.03); solid(-1.6, 1.6, 0, 3.2);
  const stb = aiBuild(99, 'slasher'); stb.worn = { hair: 'h_bald', head: 'hd_eagle', face: 'f_none', top: 't_jersey', arm: 'a_none', bottom: 'b_basic', socks: 's_high', shoes: 'k_gold', back: 'bk_wings', ball: 'bl_gold' };
  const stt = makeRig(stb, true); const gold = toon('#f2c14e'); stt.root.traverse(o => { if (o.isMesh && o.material !== INK) o.material = gold; }); stt.shadow.visible = false;
  stt.root.position.set(0, 1.35, 1.6); stt.root.scale.setScalar(1.25); stt.root.rotation.y = 0.5; scene.add(stt.root); applyPose(stt, poseOf('dunk', 0, { u: 0.5, style: 'tomahawk' }), 10);
  const pl = sign('THE FREEDOM EAGLE · "HE DUNKED SO YOU COULD SCROLL"', 2.6, 0.28, '#f2c14e', '#16181c', { border: false }); pl.position.set(0, 0.5, 3.12); scene.add(pl);
  // Money Rack: a side hoop and a man with a marker
  const h2 = hoopMesh(1, 'street'); h2.position.set(8.2, 0, 10.6); h2.rotation.y = Math.PI; scene.add(h2); solid(7.6, 8.8, 11.6, 12.4);
  const hb = aiBuild(75, 'sniper'); hb.name = 'Sharpie'; addNpc(hb, 6.3, 9.6, 2.4, 'idle'); spot(7.2, 8.4, 2.0, 'MONEY RACK (shootout)', () => uiRack());
  ink(M(box(1.3, 0.9, 0.5), toon('#8a8378'), 5.2, 0.45, 11.6, scene), 1.04); for (let i = 0; i < 4; i++) { const b = makeBall(['bl_std', 'bl_rwb', 'bl_neon', 'bl_gold'][i]); b.position.set(4.75 + i * 0.3, 1.03, 11.6); scene.add(b); }
  // the old head, his bench, his crates
  ink(M(box(2.4, 0.12, 0.6), toon('#7a5a3a'), -8, 0.5, -3.2, scene), 1.05); M(box(0.12, 0.5, 0.5), toon('#20242c'), -9, 0.25, -3.2, scene); M(box(0.12, 0.5, 0.5), toon('#20242c'), -7, 0.25, -3.2, scene); solid(-9.4, -6.6, -3.7, -2.7);
  const ob = aiBuild(60, 'general'); ob.worn.hair = 'h_bald'; ob.worn.head = 'hd_band'; ob.worn.face = 'f_goggles'; addNpc(ob, -8, -3.12, 0.5, 'sit');
  spot(-8, -1.9, 2.0, 'TALK TO THE OLD HEAD', () => uiDialog('OLD HEAD', pick(OLDHEAD), [['Respect.', null]]));
  for (const [cx, cy, cz, cc] of [[-10.2, 0.2, -3.4, '#e04848'], [-10.2, 0.6, -3.35, '#2f5bff'], [-10.75, 0.2, -3.0, '#f2c14e']]) ink(M(box(0.5, 0.4, 0.5), toon(cc), cx, cy, cz, scene), 1.05);
  // fiends
  [[5, -7.4], [-5.5, -8.6], [-3.4, 8.8], [10.4, 1.4]].forEach((b, i) => { const bb = aiBuild(50); bb.worn = randomWorn(0, true); bb.name = BUM_NAMES[i % BUM_NAMES.length]; const n = addNpc(bb, b[0], b[1], rnd(0, 6), 'beg', { bum: true, wander: true, name: bb.name, range: 1.4 }); spot(b[0], b[1], 1.9, 'TALK', () => uiBum(n)); n.spot = W.spots[W.spots.length - 1]; });
  for (let i = 0; i < 3; i++) { const b = aiBuild(rnd(65, 92)); b.worn = randomWorn(2); addNpc(b, rnd(-9, 9), rnd(-7, -4), rnd(0, 6), i ? 'idle' : 'ball', { wander: i > 0, range: 2 }); }
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
  const fl = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); x.fillStyle = '#ffc531'; x.font = '900 60px Archivo, Impact'; x.textAlign = 'center'; x.fillText('$', w * 0.21, hh * 0.42); });
  W.flag = new THREE.Mesh(new THREE.PlaneGeometry(5, 3, 10, 1), new THREE.MeshBasicMaterial({ map: fl, side: THREE.DoubleSide })); W.flag.position.set(-12.6, 13.3, -11.2); scene.add(W.flag);
  for (let i = 0; i < 5; i++) { const c = new THREE.Group(); ink(M(box(2.6, 0.6, 1.2), toon(pick(['#ff2d78', '#7de3ff', '#f2c14e', '#ece9e2', '#a78bff'])), 0, 0, 0, c), 1.05); M(box(1.3, 0.45, 1.0), toon('#16181c'), -0.1, 0.45, 0, c); M(box(2.2, 0.08, 1.0), flat(0x7de3ff), 0, -0.34, 0, c); scene.add(c); W.cars.push({ c, a: rnd(0, 6.28), r: rnd(30, 48), y: rnd(16, 30), s: rnd(0.08, 0.2) * (i % 2 ? 1 : -1) }); }
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
    spot(x, PIT_DOOR_Z + 1.2, 1.9, m.n, () => uiMode(m));
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
  spot(0, 8.9, 1.9, 'BACK TO THE BLOCK', () => enterWorld('hub', 0, -8.4, 0));
  stringLights(-10, -1, 10, -1.4, 6.4, 14); stringLights(-10, 5.5, 10, 5.2, 6.2, 14);
  for (let i = 0; i < 4; i++) { poster(scene, -9.96, 2.2, -4.6 + i * 1.55, Math.PI / 2, i % 2); poster(scene, 9.96, 2.2, 4.4 + (i > 1 ? 1.55 * (i - 2) : -9 + i * 1.55), -Math.PI / 2, (i + 1) % 2); }
  for (let i = 0; i < 4; i++) { const b = aiBuild(rnd(62, 92)); b.worn = randomWorn(2); addNpc(b, rnd(-5.5, 5.5), rnd(-1.5, 4.5), rnd(0, 6), ['ball', 'idle', 'cheer', 'dance'][i], { wander: i === 1, range: 1.5 }); }
  W.bounds = [-9.2, 9.2, -4.6, 9.6]; W.camBox = [-9.7, 9.7, -5.4, 10.2];
}

function buildCrib() {
  const fl = cribTier('floor'), hp = cribTier('hoop');
  scene.background = new THREE.Color(0x3a3558); scene.fog = new THREE.Fog(0x3a3558, 40, 150);
  baseLights(scene, 0xffe0c8, 0x3a3050, 0xffd0a0, 1.5);
  const g2 = M(new THREE.PlaneGeometry(300, 300), toon('#2a2d34'), 0, -0.03, 0, scene); g2.rotation.x = -Math.PI / 2;
  addCourt(scene, ['drive', 'black', 'show', 'wood'][fl], hp);
  addFence(scene, -11, 11, -3.4, 16, 3, 0xffffff);
  skyline(scene, 30, 62, ['#ffc531', '#ffe9a8', '#33e0ff'], 34);
  // the shack you call home
  ink(M(box(5, 3.6, 6), toon('#59606c'), 11.2, 1.8, 5, scene), 1.02); M(box(5.6, 0.3, 6.6), toon('#c8482c'), 11.2, 3.75, 5, scene); M(box(0.1, 2.2, 1.2), toon('#3a2a1c'), 8.66, 1.1, 5, scene); solid(8.6, 14, 1.8, 8.2);
  spot(7.7, 5, 2.0, 'CLOSET (drip)', () => uiShop(true));
  // workbench: upgrades
  ink(M(box(1.6, 0.9, 0.8), toon('#7a5a3a'), 8.6, 0.45, 10.5, scene), 1.04); const ws = sign('CRIB UPGRADES', 2, 0.5, '#ffc531', '#20242c'); ws.position.set(8.6, 1.5, 10.5); ws.rotation.y = -0.6; scene.add(ws); solid(7.7, 9.5, 10, 11);
  spot(7.5, 10.9, 2.0, 'CRIB UPGRADES', () => uiCrib());
  spot(0, 6.5, 2.2, 'SHOOT AROUND', () => startPractice('free'));
  spot(0, 14.6, 1.8, 'BACK TO THE BLOCK', () => enterWorld('hub', -12.4, 5.8, Math.PI / 2));
  const ex = sign('THE BLOCK ↓', 3, 0.7, '#ffe9a8', '#0a0a14'); ex.position.set(0, 3.4, 16); ex.rotation.y = Math.PI; scene.add(ex);
  // upgrade props
  const t = id => cribTier(id);
  if (t('couch') === 0) ink(M(box(0.5, 0.45, 0.5), toon('#e04848'), -9.3, 0.23, 6, scene), 1.05);
  else { const c = toon(t('couch') === 2 ? '#7a2a8a' : '#2a6a4a'); ink(M(box(1.0, 0.5, 2.6), c, -9.6, 0.35, 6, scene), 1.03); ink(M(box(0.3, 1.0, 2.6), c, -10.1, 0.6, 6, scene), 1.03); if (t('couch') === 2) M(box(0.1, 1.4, 2.6), flat(0xff4fd8), -10.3, 0.8, 6, scene); }
  solid(-10.6, -8.9, 4.6, 7.4);
  if (t('trophy')) { ink(M(box(0.4, 2.4, 3.2), toon('#3a2a1c'), -10.4, 1.2, 10.5, scene), 1.02); const n = [0, 3, 7, 12][t('trophy')]; for (let i = 0; i < n; i++) { const tx = -10.1, ty = 0.75 + Math.floor(i / 4) * 0.7, tz = 9.3 + (i % 4) * 0.8; M(cyl(0.1, 0.05, 0.22, 8), toon('#ffc531'), tx, ty + 0.11, tz, scene); M(box(0.14, 0.06, 0.14), toon('#20242c'), tx, ty - 0.02, tz, scene); } solid(-10.8, -9.8, 8.8, 12.2); }
  if (t('printer')) { ink(M(box(0.9, 1.5, 0.9), toon(t('printer') === 2 ? '#c8482c' : '#c8d0d8'), 6, 0.75, 14.6, scene), 1.03); M(box(0.6, 0.4, 0.05), flat(0x33ff88), 6, 1.1, 14.14, scene); const s = sign(t('printer') === 2 ? 'STEAK\nFABRICATOR' : 'PROTEIN\nPRINTER', 1.2, 0.6, '#33ff88', '#0a0a14'); s.position.set(6, 2, 14.6); s.rotation.y = Math.PI; scene.add(s); solid(5.4, 6.6, 14, 15.2); }
  if (t('shotdoc')) { ink(M(box(1.2, 1.8, 1.0), toon('#2440a8'), -6, 0.9, 14.6, scene), 1.03); M(cyl(0.3, 0.3, 0.6, 10), toon('#ff7a1f'), -6, 2.1, 14.4, scene).rotation.x = 1.1; const s = sign(t('shotdoc') === 2 ? 'SHOT SURGEON 9000' : 'SHOT DOCTOR 3000', 2, 0.4, '#33e0ff', '#0a0a14'); s.position.set(-6, 2.9, 14.6); s.rotation.y = Math.PI; scene.add(s); solid(-6.8, -5.2, 14, 15.2); }
  if (t('sign') === 1) { const s = sign('LIVE LAUGH LAYUP', 4, 0.9, '#ff4fd8', '#0a0a14'); s.position.set(8.64, 3.0, 5); s.rotation.y = -Math.PI / 2; scene.add(s); }
  if (t('sign') === 2) { const s = sign('★ ' + S.name + ' ★\nGREATEST EVER (SELF-REPORTED)', 8, 4, '#ffc531', '#0a0a14'); s.position.set(0, 7, -5); scene.add(s); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), -3, 2.5, -5.2, scene); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), 3, 2.5, -5.2, scene); }
  if (t('flag')) { const big = t('flag') === 2, hgt = big ? 22 : 7; M(cyl(0.1, 0.14, hgt, 8), toon('#c8d0d8'), -10, hgt / 2, -2.6, scene); const ft = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); }); W.flag = new THREE.Mesh(new THREE.PlaneGeometry(big ? 26 : 3, big ? 15 : 1.8, 10, 1), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide })); W.flag.position.set(-10 + (big ? 13.1 : 1.6), hgt - (big ? 7.6 : 1), -2.6); scene.add(W.flag); }
  W.bounds = [-10.4, 8.2, -1.2, 15.2];
}

function worldStep(dt) {
  if (!W) return; W.t += dt; const me = W.me, I = IN[0], busy = uiBusy();
  let mx = busy ? 0 : I.mx, my = busy ? 0 : I.my;
  if (!busy) W.yaw -= (I.rx * 2.4 + mx * 0.9 * Math.min(1, Math.abs(my) + 0.4)) * dt;
  // camera looks along (sin yaw, cos yaw)
  const fx = Math.sin(W.yaw), fz = Math.cos(W.yaw), rx = -fz, rz = fx;
  const sp = I.sprint ? 6.6 : 3.3;          // a jog around the block; sprint when you mean it
  const tvx = (fx * -my + rx * mx) * sp, tvz = (fz * -my + rz * mx) * sp, ddx = tvx - me.vx, ddz = tvz - me.vz, dl = Math.hypot(ddx, ddz);
  const brake = me.vx * tvx + me.vz * tvz < 0 || Math.hypot(tvx, tvz) < 0.1, acc = (brake ? 34 : 17) * dt;
  if (dl <= acc) { me.vx = tvx; me.vz = tvz; } else { me.vx += ddx / dl * acc; me.vz += ddz / dl * acc; }
  let nx = me.x + me.vx * dt, nz = me.z + me.vz * dt;
  for (const s of W.solids) { if (nx > s[0] && nx < s[1] && nz > s[2] && nz < s[3]) { const px = Math.min(nx - s[0], s[1] - nx), pz = Math.min(nz - s[2], s[3] - nz); if (px < pz) nx = nx - s[0] < s[1] - nx ? s[0] : s[1]; else nz = nz - s[2] < s[3] - nz ? s[2] : s[3]; } }
  me.x = clamp(nx, W.bounds[0], W.bounds[1]); me.z = clamp(nz, W.bounds[2], W.bounds[3]);
  const v = Math.hypot(me.vx, me.vz); if (v > 0.5) me.face = lerpAng(me.face, Math.atan2(me.vx, me.vz), 1 - Math.exp(-12 * dt));
  me.ph += dt * (4 + v * 1.6);
  const R = me.rig; locoAnim(R, me.x, me.z, me.face, dt, me.vx, me.vz); R.capeSwing = v / 8;
  // npcs
  for (const n of W.npcs) {
    let an = n.anim === 'ball' ? 'dribble' : n.anim, o = { ph: n.ph, leg: n.rig.legLen, sp: 0, dr: Math.abs(Math.sin(W.t * 7 + n.ph)) };
    if (n.wander && !(n.bum && W.talk === n)) {
      n.wt -= dt; if (n.wt <= 0) { n.wt = rnd(3, 9); const rg = n.range || 2.5; n.tx = n.hx + rnd(-rg, rg); n.tz = n.hz + rnd(-rg, rg); }
      const dx = n.tx - n.x, dz = n.tz - n.z, l = Math.hypot(dx, dz);
      if (l > 0.3) { n.x += dx / l * 1.1 * dt; n.z += dz / l * 1.1 * dt; n.face = lerpAng(n.face, Math.atan2(dx, dz), 0.1); an = 'loco'; if (n.spot) { n.spot.x = n.x; n.spot.z = n.z; } }
      else if (Math.hypot(me.x - n.x, me.z - n.z) < 5 && n.bum) n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.08);
    }
    if (an === 'loco' || (n.wander && an === n.anim && (an === 'idle' || an === 'beg'))) { if (an === 'loco') locoAnim(n.rig, n.x, n.z, n.face, dt); else { n.rig.root.position.set(n.x, n.yFix || 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, poseOf(an, W.t, o), dt); gaitStep(n.rig, { x: n.x, z: n.z, yaw: n.face, vx: 0, vz: 0, grounded: true, wide: 0.2, want: 1, dt }); legIK(n.rig, dt); } }
    else { n.rig.root.position.set(n.x, n.yFix || 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, poseOf(an, W.t, o), dt); }
    if (n.anim === 'ball' && n.ball) { const hgt = Math.abs(Math.sin(W.t * 7 + n.ph)); n.ball.position.set(n.x + Math.sin(n.face) * 0.3 - Math.cos(n.face) * 0.27, 0.125 + hgt * 0.75, n.z + Math.cos(n.face) * 0.3 + Math.sin(n.face) * 0.27); o.dr = hgt; }
  }
  for (const c of W.cars) { c.a += c.s * dt; c.c.position.set(Math.cos(c.a) * c.r, c.y, Math.sin(c.a) * c.r); c.c.rotation.y = -c.a + (c.s > 0 ? -Math.PI / 2 : Math.PI / 2); }
  if (W.train) { W.train.position.x += dt * 16; if (W.train.position.x > 95) W.train.position.x = -140 - rnd(0, 120); }
  if (W.eq) { W.eq.forEach((e, i) => { const v = 0.2 + Math.abs(Math.sin(W.t * (6 + i * 1.3) + i)) * (0.5 + 0.5 * Math.abs(Math.sin(W.t * 1.9))); e.scale.y = v * 2; e.position.y = 1.02 + v * 0.3; }); const pu = 1 + Math.max(0, Math.sin(W.t * 11.4)) * 0.08; for (const sp of W.speakers) sp.scale.set(pu, 1, pu); }
  if (W.flames) { W.flames.forEach((f, i) => { f.scale.set(1, 0.7 + Math.abs(Math.sin(W.t * (9 + i * 2) + i)) * 0.8, 1); f.position.y = 1.1 + f.scale.y * 0.2; }); if (W.fireLight) W.fireLight.intensity = 16 + Math.sin(W.t * 13) * 5 + Math.sin(W.t * 7.3) * 3; }
  if (W.hang) W.hang.forEach((g, i) => { g.rotation.z = Math.sin(W.t * 1.3 + i * 2) * 0.12; });
  if (W.bulbs && (W.bt = (W.bt || 0) + dt) > 0.4) { W.bt = 0; const k = Math.floor(W.t * 2.5); W.bulbs.forEach((b, i) => b.scale.setScalar((i + k) % 3 === 0 ? 1.35 : 0.9)); }
  if (W.flag) { const pa = W.flag.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 1.2 + W.t * 3) * 0.25 * (pa.getX(i) / 3 + 1)); pa.needsUpdate = true; }
  // nearest interactable
  let near = null, nd = 99; for (const s of W.spots) { const d = Math.hypot(s.x - me.x, s.z - me.z); if (d < s.r && d < nd) { nd = d; near = s; } }
  if (near !== W.near) { W.near = near; const p = $('prompt'); if (near) { p.textContent = near.label; p.style.display = 'block'; } else p.style.display = 'none'; }
  if (busy) $('prompt').style.display = 'none'; else if (W.near) $('prompt').style.display = 'block';
  if (!busy && W.near && I.aP) { sfx('uiok'); W.near.fn(); }
  else if (!busy && I.start) uiPlayer('attrs');
  // camera
  const portrait = innerWidth < innerHeight, back = portrait ? 7.5 : 6.2, up = portrait ? 3.8 : 3.1;
  let cx = me.x - fx * back, cz = me.z - fz * back, lift = 0;
  // keep the camera inside the place and the player in sight: pull it in (and up) until the line to them is clear
  const cb = W.camBox, blocked = (x, z) => (cb && (x < cb[0] || x > cb[1] || z < cb[2] || z > cb[3])) || W.solids.some(s => x > s[0] + 0.25 && x < s[1] - 0.25 && z > s[2] + 0.25 && z < s[3] - 0.25);
  for (let b = back; b > 0.9; b -= 0.4) { cx = me.x - fx * b; cz = me.z - fz * b; lift = (back - b) * 0.42; let ok = true; for (let t = 1.0; t <= b; t += 0.6) if (blocked(me.x - fx * t, me.z - fz * t)) { ok = false; break; } if (ok && !blocked(cx, cz)) break; }
  if (W.kind === 'crib') { cx = clamp(cx, W.bounds[0] - 6, W.bounds[1] + 6); cz = clamp(cz, W.bounds[2] - 1, W.bounds[3] + 6); }
  if (W.look) {   // shop / closet: swing round to look at your drip
    const mfx = Math.sin(me.face), mfz = Math.cos(me.face), sx = mfz, sz = -mfx;
    if (portrait) { _v.set(me.x + mfx * 5.6, 0.6, me.z + mfz * 5.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(me.x, -0.6, me.z); }
    else { _v.set(me.x + mfx * 4.2 + sx * 1.6, 1.3, me.z + mfz * 4.2 + sz * 1.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(me.x + sx * 1.6, 1.0, me.z + sz * 1.6); }
    return;
  }
  _v.set(cx, up + lift, cz); if (!W.camInit) { camera.position.copy(_v); W.camInit = true; } else camera.position.lerp(_v, 1 - Math.exp(-7 * dt));
  camera.lookAt(me.x + fx * 2, 1.7, me.z + fz * 2);
}

function startPractice(kind) {
  const fl = cribTier('floor'), back = W.kind;
  uiClose(); document.body.dataset.state = 'match';
  startMatch({ mode: { n: kind === 'rack' ? 'MONEY RACK' : 'SHOOT AROUND', size: 1, arcade: false, to: 999 }, tier: TIERS_COURT[0], practice: kind, court: kind === 'rack' ? 'street' : ['drive', 'black', 'show', 'wood'][fl], hoopTier: kind === 'rack' ? 1 : cribTier('hoop'), ball: S.worn.ball,
    teams: [[{ b: myBuild(), ctrl: 0, mine: true }], []], onEnd: res => afterPractice(res, back) });
}
