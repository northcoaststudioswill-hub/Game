// GOT NEXT — the courts, dressed. Park courts get real asphalt (grit, resurfacing patches, worn paint, rubber scuffs,
// lane hashes, a centre logo) painted in their tier's colours, plus courtside life and a flip scoreboard on the fence.
// RUCKUS courts become an arcade: a neon floor, LED strips that chase and flash on scores, a jumbotron, and power-ups.
// Gameplay is host-side (puStep, from matchStep); everything you see runs on host and guest alike (courtFx, from matchFx).
'use strict';

// ---------------- park courts ----------------
// per tier: surface, apron, lines, key paint, accent, logo text
const TIER_PAINT = [
  { srf: '#3c4352', apr: '#30363f', line: '#f2c230', key: '#c8482c', acc: '#ffc531', tag: 'SIDE COURT' },
  { srf: '#2f4b66', apr: '#263b51', line: '#ffffff', key: '#d2492f', acc: '#33e0ff', tag: 'MAIN COURT' },
  { srf: '#2c2c35', apr: '#1f1f26', line: '#ff4fd8', key: '#41294e', acc: '#ff4fd8', tag: 'THE CAGE' },
  { srf: '#1f2c3d', apr: '#151e2a', line: '#f2c14e', key: '#6d1f2c', acc: '#f2c14e', tag: 'KINGS COURT' },
];
function tierIndex(cfg) { const T = typeof TIERS_COURT !== 'undefined' ? TIERS_COURT : []; const i = T.indexOf(cfg.tier); return i < 0 ? 0 : Math.min(3, i); }
// the canvas covers x -9..9, z -3..15 (18 m square), like courtTex
function parkCourtTex(ti) {
  const P = TIER_PAINT[ti] || TIER_PAINT[0];
  return canvasTex(1024, 1024, (x, W) => {
    const s = W / 18, X = v => (v + 9) * s, Z = v => (v + 3) * s, R = (a, b) => a + Math.random() * (b - a);
    x.fillStyle = P.apr; x.fillRect(0, 0, W, W); x.fillStyle = P.srf; x.fillRect(X(-8), Z(-1.6), 16 * s, 14.6 * s);
    // resurfacing: patches laid down over the years, a shade off the rest
    for (let i = 0; i < 6; i++) { x.save(); x.translate(R(X(-7), X(7)), R(Z(-1), Z(12))); x.rotate(R(-0.2, 0.2)); x.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.10)' : 'rgba(255,255,255,.045)'; x.fillRect(-R(40, 120), -R(30, 90), R(80, 240), R(60, 180)); x.restore(); }
    // painted key and the centre circle fill
    x.fillStyle = P.key; x.globalAlpha = 0.88; x.fillRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s); x.beginPath(); x.arc(X(0), Z(5.8), 1.8 * s, 0, 6.3); x.fill(); x.globalAlpha = 1;
    // the lines
    x.strokeStyle = P.line; x.lineWidth = 7; x.lineCap = 'butt';
    x.strokeRect(X(-8), Z(-1.6), 16 * s, 14.6 * s); x.strokeRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s);
    x.beginPath(); x.arc(X(0), Z(5.8), 1.8 * s, 0, 6.3); x.stroke();
    const a0 = Math.acos(6.6 / 6.75); x.beginPath(); x.moveTo(X(6.6), Z(-1.6)); x.lineTo(X(6.6), Z(6.75 * Math.sin(a0))); x.arc(X(0), Z(0), 6.75 * s, a0, Math.PI - a0); x.lineTo(X(-6.6), Z(-1.6)); x.stroke();
    x.beginPath(); x.arc(X(0), Z(13), 1.8 * s, Math.PI, 0); x.stroke(); x.beginPath(); x.arc(X(0), Z(0), 1.25 * s, 0, Math.PI); x.stroke();
    // lane hash marks
    x.lineWidth = 6; for (const zz of [1.75, 2.6, 3.45, 4.3]) for (const sd of [-1, 1]) { x.beginPath(); x.moveTo(X(sd * 2.45), Z(zz)); x.lineTo(X(sd * 2.85), Z(zz)); x.stroke(); }
    // centre logo: a ring, the name, the court
    x.save(); x.translate(X(0), Z(10.1)); x.strokeStyle = P.acc; x.globalAlpha = 0.55; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, 1.55 * s, 0, 6.3); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 1.3 * s, 0, 6.3); x.stroke();
    x.fillStyle = P.acc; x.globalAlpha = 0.5; x.textAlign = 'center'; x.font = '900 64px Archivo, Impact, sans-serif'; x.fillText(BRAND.name, 0, 18); x.font = '700 22px Archivo, Impact, sans-serif'; x.fillText(P.tag, 0, 52);
    if (ti === 3) { x.beginPath(); x.moveTo(-34, -40); x.lineTo(-22, -70); x.lineTo(0, -48); x.lineTo(22, -70); x.lineTo(34, -40); x.closePath(); x.fill(); }      /* Kings Court: a crown */
    x.restore(); x.globalAlpha = 1;
    // apron lettering behind the baseline
    x.fillStyle = P.acc; x.globalAlpha = 0.35; x.font = '900 34px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.fillText('WINNERS STAY · LOSERS SIT', X(0), Z(-2.15)); x.globalAlpha = 1;
    // worn paint: the court colour rubbed back over the lines and the key, worst where the feet go
    for (let i = 0; i < 900; i++) { const near = Math.random() < 0.55, px = near ? R(X(-3.2), X(3.2)) : R(X(-8.2), X(8.2)), pz = near ? R(Z(-1.7), Z(6)) : R(Z(-1.7), Z(13.2));
      x.fillStyle = Math.random() < 0.7 ? P.srf : 'rgba(0,0,0,.5)'; x.globalAlpha = R(0.08, 0.32); x.beginPath(); x.ellipse(px, pz, R(2, 9), R(1, 5), R(0, 3), 0, 6.3); x.fill(); }
    // rubber: dark scuffs under the rim and at the elbows
    x.strokeStyle = '#000'; for (let i = 0; i < 70; i++) { const cx = R(X(-3), X(3)), cz = R(Z(-0.5), Z(6.5)); x.globalAlpha = R(0.05, 0.14); x.lineWidth = R(2, 5); x.beginPath(); x.arc(cx, cz, R(8, 30), R(0, 6), R(0, 6) + R(0.4, 1.4)); x.stroke(); }
    // cracks
    x.globalAlpha = 0.3; x.lineWidth = 2; for (let i = 0; i < 8; i++) { let px = R(0, W), pz = R(0, W); x.beginPath(); x.moveTo(px, pz); for (let j = 0; j < 7; j++) { px += R(-45, 45); pz += R(-45, 45); x.lineTo(px, pz); } x.stroke(); }
    x.globalAlpha = 1;
    // grit: per-pixel noise over everything, so the asphalt reads as asphalt up close
    const img = x.getImageData(0, 0, W, W), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 26 + (Math.random() < 0.012 ? 30 : 0); d[i] += n; d[i + 1] += n; d[i + 2] += n; } x.putImageData(img, 0, 0);
  });
}
// a flip scoreboard bolted to the fence, and some courtside life outside it
function parkDressing(sc, ti) {
  const P = TIER_PAINT[ti] || TIER_PAINT[0], S = MT.courtFx = { kind: 'park', last: '' };
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const fr = M(box(1.9, 1.0, 0.08), toon('#1b1c22'), -5.6, 2.3, -2.5, sc); M(new THREE.PlaneGeometry(1.76, 0.88), new THREE.MeshBasicMaterial({ map: tex }), 0, 0, 0.045, fr);
  S.board = { cv, tex, acc: P.acc };
  // benches, a cooler, a speaker, a trash can, bags: outside the fence on both sides
  for (const sd of [-1, 1]) { const bx = sd * 9.5;
    for (const bz of [2.6, 6.4]) { M(box(0.42, 0.06, 1.9), toon('#6b4a2e'), bx, 0.46, bz, sc); for (const lz of [-0.8, 0.8]) M(box(0.36, 0.44, 0.06), toon('#2a2c33'), bx, 0.22, bz + lz, sc); }
    M(cyl(0.22, 0.2, 0.5, 10), toon(sd < 0 ? '#2f6fd6' : '#d6402f'), bx + sd * 0.1, 0.25, 4.5, sc); M(cyl(0.23, 0.23, 0.08, 10), toon('#f4f4f4'), bx + sd * 0.1, 0.54, 4.5, sc);
  }
  M(box(0.5, 0.36, 0.28), toon('#18181c'), -9.4, 0.62, 2.9, sc); for (const dx of [-0.12, 0.12]) M(cyl(0.09, 0.09, 0.02, 12), toon('#3a3a44'), -9.4 + dx, 0.64, 2.75, sc).rotation.x = Math.PI / 2;      /* a speaker on the bench */
  M(cyl(0.26, 0.22, 0.85, 10), toon('#3f5a3c'), 9.7, 0.42, 9.2, sc); M(box(0.5, 0.3, 0.3), toon('#a8322c'), 9.4, 0.62, 2.2, sc); M(box(0.45, 0.25, 0.3), toon('#232a6a'), -9.5, 0.6, 6.7, sc);
  // the tier shows in the floodlight colour a little too (warmer side court, cleaner main, magenta cage, gold kings)
  return S;
}
function drawBoard(S, M_) {
  const b = S.board, x = b.cv.getContext('2d'), sc = M_.score, me = M_.me || M_.P[0], a = sc[me ? me.team : 0], o = sc[me ? 1 - me.team : 1];
  x.fillStyle = '#0d0e12'; x.fillRect(0, 0, 256, 128); x.fillStyle = b.acc; x.font = '700 16px Archivo, sans-serif'; x.textAlign = 'center'; x.fillText('US', 64, 24); x.fillText('THEM', 192, 24);
  for (const [v, cx] of [[a, 64], [o, 192]]) { x.fillStyle = '#25262e'; x.fillRect(cx - 46, 34, 92, 80); x.fillStyle = '#f4f1e8'; x.font = '900 70px Archivo, Impact, sans-serif'; x.fillText(String(v), cx, 100); x.fillStyle = '#0d0e12'; x.fillRect(cx - 46, 73, 92, 3); }
  b.tex.needsUpdate = true;
}

// ---------------- RUCKUS: the arcade ----------------
function arcadeCourtTex() {
  return canvasTex(1024, 1024, (x, W) => {
    const s = W / 18, X = v => (v + 9) * s, Z = v => (v + 3) * s;
    x.fillStyle = '#0b0618'; x.fillRect(0, 0, W, W);
    const g = x.createRadialGradient(X(0), Z(4), 20, X(0), Z(4), 11 * s); g.addColorStop(0, '#2a0f4a'); g.addColorStop(1, '#120826'); x.fillStyle = g; x.fillRect(X(-8), Z(-1.6), 16 * s, 14.6 * s);
    // the grid
    x.strokeStyle = 'rgba(51,224,255,.13)'; x.lineWidth = 2; for (let v = -8; v <= 8; v++) { x.beginPath(); x.moveTo(X(v), Z(-1.6)); x.lineTo(X(v), Z(13)); x.stroke(); } for (let v = -1; v <= 13; v++) { x.beginPath(); x.moveTo(X(-8), Z(v)); x.lineTo(X(8), Z(v)); x.stroke(); }
    // a starburst out of the rim
    x.save(); x.translate(X(0), Z(0)); for (let i = 0; i < 18; i++) { const a = Math.PI * (i + 0.5) / 18; x.fillStyle = i % 2 ? 'rgba(255,79,216,.10)' : 'rgba(51,224,255,.07)'; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a - 0.08) * 9 * s, Math.sin(a - 0.08) * 9 * s); x.lineTo(Math.cos(a + 0.08) * 9 * s, Math.sin(a + 0.08) * 9 * s); x.fill(); } x.restore();
    // the key: a pink-to-purple gradient
    const kg = x.createLinearGradient(0, Z(-1.6), 0, Z(5.8)); kg.addColorStop(0, 'rgba(255,79,216,.55)'); kg.addColorStop(1, 'rgba(120,40,200,.35)'); x.fillStyle = kg; x.fillRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s);
    // glowing lines, drawn twice: a wide soft pass and a sharp core
    const lines = () => { x.strokeRect(X(-8), Z(-1.6), 16 * s, 14.6 * s); x.strokeRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s); x.beginPath(); x.arc(X(0), Z(5.8), 1.8 * s, 0, 6.3); x.stroke();
      const a0 = Math.acos(6.6 / 6.75); x.beginPath(); x.moveTo(X(6.6), Z(-1.6)); x.lineTo(X(6.6), Z(6.75 * Math.sin(a0))); x.arc(X(0), Z(0), 6.75 * s, a0, Math.PI - a0); x.lineTo(X(-6.6), Z(-1.6)); x.stroke(); x.beginPath(); x.arc(X(0), Z(13), 1.8 * s, Math.PI, 0); x.stroke(); };
    x.shadowBlur = 26; x.shadowColor = '#33e0ff'; x.strokeStyle = 'rgba(51,224,255,.5)'; x.lineWidth = 14; lines(); x.shadowBlur = 8; x.strokeStyle = '#bff6ff'; x.lineWidth = 5; lines(); x.shadowBlur = 0;
    // the big logo at centre court
    x.save(); x.translate(X(0), Z(10.1)); const lg = x.createLinearGradient(-200, 0, 200, 0); lg.addColorStop(0, '#ff4fd8'); lg.addColorStop(0.5, '#ffc531'); lg.addColorStop(1, '#33e0ff');
    x.font = '900 112px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.shadowColor = '#ff4fd8'; x.shadowBlur = 30; x.fillStyle = lg; x.fillText('RUCKUS', 0, 50); x.shadowBlur = 0; x.lineWidth = 4; x.strokeStyle = '#fff'; x.strokeText('RUCKUS', 0, 50);
    x.font = '700 26px Archivo, sans-serif'; x.fillStyle = '#ffc531'; x.fillText('NO RULES · NO REFUNDS', 0, 92); x.restore();
    // arrows painted toward the rim in the lane
    x.fillStyle = 'rgba(255,197,49,.35)'; for (const zz of [7.2, 8.2]) { x.beginPath(); x.moveTo(X(0), Z(zz - 0.6)); x.lineTo(X(0.5), Z(zz)); x.lineTo(X(-0.5), Z(zz)); x.closePath(); x.fill(); }
  });
}
function arcadeDressing(sc) {
  const S = MT.courtFx = { kind: 'arcade', last: '', flash: 0, flashC: new THREE.Color(), t: 0 };
  // LED strips just outside the lines: both sidelines and the far end
  const pts = []; for (let i = 0; i < 30; i++) { const z = -1.4 + i * 0.49; pts.push([-8.25, z], [8.25, z]); } for (let i = 0; i < 32; i++) pts.push([-7.75 + i * 0.5, 13.3]);
  const im = new THREE.InstancedMesh(box(0.16, 0.05, 0.34), new THREE.MeshBasicMaterial({ color: 0xffffff }), pts.length), mt = new THREE.Matrix4(), c = new THREE.Color();
  pts.forEach(([px, pz], i) => { mt.makeTranslation(px, 0.03, pz); if (Math.abs(px) < 8) mt.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2)); im.setMatrixAt(i, mt); im.setColorAt(i, c.set(0x33e0ff)); });
  sc.add(im); S.led = im; S.pts = pts;
  // a glow ring on the floor under the rim that breathes
  S.rimRing = M(new THREE.RingGeometry(1.0, 1.35, 40), new THREE.MeshBasicMaterial({ color: 0xff4fd8, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 0.02, 0, sc); S.rimRing.rotation.x = -Math.PI / 2;
  // the jumbotron over the baseline
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 192; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const jb = M(box(5.4, 2.1, 0.3), toon('#14101e'), 0, 6.1, -3.4, sc);      /* under the score bug, above the backboard */ M(new THREE.PlaneGeometry(5.1, 1.9), new THREE.MeshBasicMaterial({ map: tex }), 0, 0, 0.16, jb);
  for (const sd of [-1, 1]) M(cyl(0.03, 0.03, 4.2, 5), toon('#2a2c33'), sd * 2.2, 9.2, -3.4, sc);
  S.jumbo = { cv, tex }; S.icons = []; return S;
}
function drawJumbo(S, M_) {
  const j = S.jumbo, x = j.cv.getContext('2d'), sc = M_.score, me = M_.me || M_.P[0], t0 = me ? me.team : 0;
  const g = x.createLinearGradient(0, 0, 512, 0); g.addColorStop(0, '#2a0f4a'); g.addColorStop(1, '#0d1a3a'); x.fillStyle = g; x.fillRect(0, 0, 512, 192);
  x.strokeStyle = '#ff4fd8'; x.lineWidth = 6; x.strokeRect(4, 4, 504, 184); x.textAlign = 'center';
  x.font = '900 104px Archivo, Impact, sans-serif'; x.fillStyle = '#33e0ff'; x.fillText(String(sc[t0]), 120, 128); x.fillStyle = '#ff4fd8'; x.fillText(String(sc[1 - t0]), 392, 128);
  x.font = '900 34px Archivo, Impact, sans-serif'; x.fillStyle = '#ffc531'; x.fillText(M_.hotTeam >= 0 ? 'ON FIRE' : 'RUCKUS', 256, 92); x.font = '700 18px Archivo, sans-serif'; x.fillStyle = '#fff'; x.fillText('FIRST TO ' + M_.cfg.mode.to, 256, 128);
  x.font = '700 20px Archivo, sans-serif'; x.fillStyle = '#bff6ff'; x.fillText('US', 120, 168); x.fillText('THEM', 392, 168);
  j.tex.needsUpdate = true;
}

// ---------------- power-ups (RUCKUS) ----------------
// a power-up drops somewhere on the floor every so often; run over it to take it. All cosmetic beyond what is listed:
// attribute bonuses while it lasts, and DOUBLE UP doubles your next bucket.
const POWERUPS = [
  { id: 'turbo', n: 'TURBO', c: '#33e0ff', dur: 6, a: { speed: 22, accel: 22 }, d: 'Faster, and sprinting costs no stamina' },
  { id: 'hot', n: 'HOT HAND', c: '#ff7a1f', dur: 10, a: { three: 16, mid: 16, close: 10, iq: 20 }, d: 'Better shooting, a wider green window' },
  { id: 'sky', n: 'SKY WALK', c: '#3dffa0', dur: 8, a: { vert: 25, dunk: 25, layup: 12 }, d: 'Higher, and dunks from further out' },
  { id: 'sticky', n: 'STICKY HANDS', c: '#ffc531', dur: 8, a: { steal: 25, block: 20, perd: 15 }, d: 'Steals and blocks' },
  { id: 'double', n: 'DOUBLE UP', c: '#ff4fd8', dur: 12, a: {}, d: 'Your next bucket counts double' },
];
function puIconTex(k) {
  return geoTex('pu_' + k, () => canvasTex(128, 128, (x) => {
    const P = POWERUPS[k]; x.fillStyle = P.c; x.shadowColor = P.c; x.shadowBlur = 18; x.beginPath(); x.arc(64, 64, 50, 0, 6.3); x.fill(); x.shadowBlur = 0; x.fillStyle = '#120826'; x.beginPath(); x.arc(64, 64, 42, 0, 6.3); x.fill();
    x.fillStyle = P.c; x.strokeStyle = P.c; x.lineWidth = 7; x.lineJoin = 'round'; x.beginPath();
    if (P.id === 'turbo') { x.moveTo(72, 26); x.lineTo(44, 70); x.lineTo(62, 70); x.lineTo(54, 102); x.lineTo(86, 54); x.lineTo(67, 54); x.closePath(); x.fill(); }
    else if (P.id === 'hot') { x.moveTo(64, 24); x.bezierCurveTo(92, 52, 92, 84, 64, 102); x.bezierCurveTo(36, 84, 40, 58, 56, 46); x.bezierCurveTo(56, 62, 66, 66, 70, 60); x.bezierCurveTo(74, 48, 66, 36, 64, 24); x.fill(); }
    else if (P.id === 'sky') { for (const y of [40, 64]) { x.moveTo(40, y + 20); x.lineTo(64, y); x.lineTo(88, y + 20); } x.stroke(); }
    else if (P.id === 'sticky') { x.lineWidth = 9; x.arc(64, 58, 20, Math.PI, 0); x.moveTo(44, 58); x.lineTo(44, 88); x.moveTo(84, 58); x.lineTo(84, 88); x.stroke(); }
    else { x.font = '900 46px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.fillText('×2', 64, 80); }
  }));
}
function puInit() { MT.pu = { list: [], t: rnd(6, 9), n: 0 }; }
function puMesh(it) {
  const g = new THREE.Group(); g.position.set(it.x, 0, it.z); scene.add(g);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puIconTex(it.k), transparent: true, depthWrite: false })); sp.scale.setScalar(0.72); sp.position.y = 0.9; g.add(sp);
  const ring = M(new THREE.RingGeometry(0.42, 0.55, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(POWERUPS[it.k].c), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 0.03, 0, g); ring.rotation.x = -Math.PI / 2;
  const col = M(cyl(0.34, 0.34, 1.6, 16, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(POWERUPS[it.k].c), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 0.8, 0, g);
  it.g = g; it.sp = sp; it.ring = ring; it.col = col; it.age = 0; return it;
}
function puDrop(it) { if (it.g) { scene.remove(it.g); it.g = null; } }
// host: spawn, pick up, expire
function puStep(dt) {
  const M_ = MT; if (!M_.arcade || M_.practice || !M_.pu) return; const U = M_.pu;
  for (const p of M_.P) if (p.pu) { p.pu.t -= dt; if (p.pu.t <= 0) { p.pu = null; p.puA = null; } }
  if (M_.phase !== 'live') return;
  const cap = M_.P.length > 4 ? 2 : 1;
  U.t -= dt; if (U.t <= 0 && U.list.length < cap) {
    U.t = rnd(9, 15); let x = 0, z = 5, ok = false;
    for (let k = 0; k < 20 && !ok; k++) { x = rnd(-5.5, 5.5); z = rnd(1.5, 10.5); ok = M_.P.every(q => Math.hypot(q.x - x, q.z - z) > 2.2); }
    if (ok) { const it = puMesh({ id: ++U.n, k: Math.floor(Math.random() * POWERUPS.length), x, z, life: 10 }); U.list.push(it); sfxM('bounce'); if (M_.net === 'host') netEv({ k: 'pu', a: 's', id: it.id, u: it.k, x: +x.toFixed(2), z: +z.toFixed(2) }); }
  }
  for (const it of U.list.slice()) {
    it.life -= dt; let taker = null;
    for (const q of M_.P) if (q.st !== 'stagger' && q.y < 0.6 && Math.hypot(q.x - it.x, q.z - it.z) < 0.75) { taker = q; break; }
    if (taker) { puTake(taker, it.k, it.id); if (M_.net === 'host') netEv({ k: 'pu', a: 't', id: it.id, u: it.k, i: taker.i }); }
    else if (it.life <= 0) { puGone(it.id); if (M_.net === 'host') netEv({ k: 'pu', a: 'g', id: it.id }); }
  }
}
function puGone(id) { const U = MT.pu; if (!U) return; const i = U.list.findIndex(x => x.id === id); if (i >= 0) { puDrop(U.list[i]); U.list.splice(i, 1); } }
function puTake(p, k, id) {
  const P = POWERUPS[k]; p.pu = { id: P.id, k, t: P.dur, dur: P.dur }; p.puA = P.a; puGone(id);
  call(P.n + '!', p.b.name + ' · ' + P.d, P.c, 1.2); sfx('unlock'); burst(p.x, 1.2, p.z, new THREE.Color(P.c).getHex(), 14);
}
// guest: mirror what the host says
function puNet(e) {
  if (!MT || !MT.pu) return; const k = clamp(e.u | 0, 0, POWERUPS.length - 1);
  if (e.a === 's') { if (!MT.pu.list.some(x => x.id === e.id)) MT.pu.list.push(puMesh({ id: e.id, k, x: clamp(+e.x || 0, -8, 8), z: clamp(+e.z || 0, -2, 13), life: 10 })); }
  else if (e.a === 't') { const p = MT.P[e.i | 0]; if (p) { const P = POWERUPS[k]; p.pu = { id: P.id, k, t: P.dur, dur: P.dur }; burst(p.x, 1.2, p.z, new THREE.Color(P.c).getHex(), 14); } puGone(e.id); }
  else if (e.a === 'g') puGone(e.id);
  else if (e.a === 'x') { const p = MT.P[e.i | 0]; if (p) p.pu = null; }
}

// ---------------- every frame, host and guest: the things that move and light up ----------------
const _koV = new THREE.Vector3(), _ledC = new THREE.Color(), _ledA = new THREE.Color(), _ledB = new THREE.Color();
function courtFx(dt) {
  const M_ = MT, S = M_.courtFx; if (!S) return; S.t = (S.t || 0) + dt;
  const key = M_.score.join('-') + (M_.hotTeam >= 0 ? 'f' : '');
  if (key !== S.last) { const prev = S.last; S.last = key;
    if (S.kind === 'park') drawBoard(S, M_);
    else { drawJumbo(S, M_); if (prev) { const ps = prev.split('-').map(v => parseInt(v, 10)), me = M_.me || M_.P[0], t0 = me ? me.team : 0; const scorer = M_.score[0] > (ps[0] || 0) ? 0 : 1; S.flash = 1; S.flashC.set(scorer === t0 ? 0x33e0ff : 0xff4fd8); } } }
  if (S.kind === 'arcade') {
    S.flash = Math.max(0, S.flash - dt * 0.8); const fire = M_.hotTeam >= 0;
    for (let i = 0; i < S.pts.length; i++) { const [px, pz] = S.pts[i], ph = (pz + Math.abs(px) * 0.3) * 0.6 - S.t * 4;
      if (fire) _ledC.setHSL(0.04 + 0.05 * (0.5 + 0.5 * Math.sin(ph * 2)), 1, 0.45 + 0.2 * Math.sin(ph * 3));
      else { _ledA.set(0x33e0ff); _ledB.set(0xff4fd8); _ledC.copy(_ledA).lerp(_ledB, 0.5 + 0.5 * Math.sin(ph)); _ledC.multiplyScalar(0.55 + 0.45 * Math.max(0, Math.sin(ph * 1.7))); }
      if (S.flash > 0) _ledC.lerp(S.flashC, Math.min(1, S.flash * (0.6 + 0.4 * Math.sin(S.t * 30))));
      S.led.setColorAt(i, _ledC); }
    S.led.instanceColor.needsUpdate = true;
    S.rimRing.material.opacity = 0.22 + 0.15 * Math.sin(S.t * 2.4) + S.flash * 0.4; S.rimRing.material.color.set(fire ? 0xff7a1f : 0xff4fd8); const rs = 1 + 0.06 * Math.sin(S.t * 2.4); S.rimRing.scale.set(rs, rs, rs);
  }
  // knocked out: stars circling the head
  for (const p of M_.P) if (p.ko > 0) { p.ko -= dt; if (Math.random() < 0.6) { const h = p.rig.joints.head.getWorldPosition(_koV), a = S.t * 6 + Math.random() * 6.3; burst(h.x + Math.cos(a) * 0.22, h.y + 0.22, h.z + Math.sin(a) * 0.22, 0xffe14a, 1); } }
  // power-ups on the floor bob and spin; a player carrying one glows its colour and wears its icon
  if (M_.pu) {
    for (const it of M_.pu.list) { if (!it.g) continue; it.age += dt; it.sp.position.y = 0.95 + Math.sin(it.age * 3) * 0.1; it.sp.material.rotation = Math.sin(it.age * 2) * 0.25; it.ring.scale.setScalar(1 + 0.12 * Math.sin(it.age * 5)); it.col.material.opacity = 0.1 + 0.05 * Math.sin(it.age * 4);
      if (it.life !== undefined && it.life < 2.5) it.g.visible = Math.sin(it.age * 18) > -0.3; }
    for (const p of M_.P) {
      if (!p.puIcon) { p.puIcon = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false })); p.puIcon.scale.setScalar(0.4); p.puIcon.visible = false; p.rig.root.add(p.puIcon); }
      if (p.pu && !M_.net) { /* host / solo: expiry is counted in puStep */ } else if (p.pu && M_.net === 'guest') { p.pu.t -= dt; if (p.pu.t <= 0) p.pu = null; }
      const on = !!p.pu; p.puIcon.visible = on;
      if (on) { const P = POWERUPS[p.pu.k]; p.puIcon.material.map = puIconTex(p.pu.k); p.puIcon.position.y = p.H + 0.55 + Math.sin(S.t * 4) * 0.04; p.ring.material.color.set(P.c); p.ring.scale.setScalar(1.15 + 0.15 * Math.sin(S.t * 8)); p._puRing = true;
        if (Math.random() < 0.25) burst(p.x + rnd(-0.25, 0.25), rnd(0.2, 1.6) + p.y, p.z + rnd(-0.25, 0.25), new THREE.Color(P.c).getHex(), 1); }
      else if (p._puRing) { p._puRing = false; p.ring.scale.setScalar(1); p.ring.material.color.setHex(p.teamCol || 0x33a0ff); }
    }
  }
}
// set the court up for a match (called from startMatch); returns the hoop
function dressCourt(sc, cfg, style) {
  const hoopTier = cfg.hoopTier === undefined ? 2 : cfg.hoopTier;
  if (style === 'arcade') { const fl = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshBasicMaterial({ map: arcadeCourtTex() })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 6); sc.add(fl);
    const h = hoopMesh(hoopTier, 'arcade'); sc.add(h); arcadeDressing(sc); if (!cfg.practice) puInit(); return h; }
  if (style === 'street' && !cfg.practice) { const ti = tierIndex(cfg); const fl = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshToonMaterial({ map: parkCourtTex(ti), gradientMap: ramp() })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 6); sc.add(fl);
    const h = hoopMesh(hoopTier, 'street'); sc.add(h); parkDressing(sc, ti); return h; }
  return addCourt(sc, style, hoopTier);
}

// ---------------- the crowd ----------------
// People along the baseline fence and both sidelines. Each has their own body, movement profile and habits, follows
// the ball with their head, and reacts to big plays by their kind and by whose side they are on.
function crowdInit() {
  // a handful to start with. The better the game gets (big plays, a tight score late), the more of the Block walks
  // over to watch: the people from the main area, by name, in the fits they wear there.
  const M_ = MT, spots = []; for (let i = 0; i < 9; i++) spots.push([-8 + i * 2 + rnd(-0.35, 0.35), -3.3 - rnd(0, 0.5)]);
  for (const sd of [-1, 1]) for (const z of [1.2, 4.8, 8.6]) spots.push([sd * (9.9 + rnd(0, 0.5)), z + rnd(-0.6, 0.6)]);
  for (let i = 0; i < 8; i++) spots.push([-7 + i * 2 + rnd(-0.3, 0.3), -4.7 - rnd(0, 0.5)]); for (const sd of [-1, 1]) for (const z of [3, 6.8, 10.4]) spots.push([sd * (11.1 + rnd(0, 0.4)), z]);
  const myT = Math.max(0, M_.cfg.teams.findIndex(t => t.some(x => x.mine === true)));
  M_.crowd = { spots, used: 0, heat: 0, myT, pool: [] };
  const playing = new Set(M_.cfg.teams.flat().map(x => x.b.name)); try { M_.crowd.pool = blockRoster().filter(b => !playing.has(b.name)).sort(() => Math.random() - 0.5); } catch (e) { M_.crowd.pool = []; }
  for (let k = 0; k < 5; k++) crowdAdd(null, true);
}
function crowdAdd(build, instant) {
  const M_ = MT, K = M_.crowd; if (!K || K.used >= K.spots.length) return null; const order = instant ? [0, 2, 4, 6, 8, 9, 12][K.used] : null; let si = K.used; if (instant && order !== undefined) si = order;
  const free = K.spots.map((s, i) => i).filter(i => !M_.fans.some(f => f.si === i)); if (!free.length) return null; if (!free.includes(si)) si = free[0];
  const [x, z] = K.spots[si], b = build || (() => { const q = aiBuild(Math.round(rnd(50, 75))); q.name = ''; return q; })(), r = makeRig(b, true), face = Math.atan2(0 - x, 5 - z); r.shadow.visible = false; scene.add(r.root);
  const f = { r, si, x, z, face, tx: x, tz: z, ph: rnd(0, 6), prof: r.prof, amb: pick(CROWD_AMBIENT), ambT: rnd(2, 8), react: null, team: Math.random() < 0.6 ? K.myT : 1 - K.myT, hype: 0, name: b.name || '' };
  if (!instant) { f.x = x < -9 ? -17 : x > 9 ? 17 : x + rnd(-3, 3); f.z = Math.abs(x) > 9 ? z + rnd(-2, 2) : -11; f.walk = true; f.psi = 0; }
  if (f.name && typeof nameTag === 'function') { const tg = nameTag(f.name, 'from the block', r.H, '#ece9e2'); tg.scale.multiplyScalar(0.62); r.root.add(tg); }
  r.root.position.set(f.x, 0, f.z); r.root.rotation.y = face; K.used++; M_.fans.push(f); return f;
}
// the game got better: somebody else comes over
function crowdHeat(v, fromNet) {
  const M_ = MT, K = M_ && M_.crowd; if (!K) return; K.heat += v;
  while (K.heat >= 1 && M_.net !== 'guest') { K.heat -= 1; const b = K.pool.shift() || null, f = crowdAdd(b, false); if (!f) { K.heat = 0; break; } if (f.name) hudFb(f.name + ' pulled up to watch', '#ece9e2'); if (M_.net === 'host') netEv({ k: 'ca', n: f.name }); }
}
function crowdReact(play, team, fromNet) {
  const M_ = MT; if (!M_ || !M_.fans) return; if (!fromNet && M_.net === 'host') netEv({ k: 'cr', p: play, t: team });
  if (!fromNet) crowdHeat({ dunk: 0.55, ankles: 0.6, block: 0.4, three: 0.3, ko: 0.8, hit: 0.3, steal: 0.15, score: 0.1, win: 0 }[play] || 0);
  const ch = play === 'score' ? 0.35 : play === 'steal' ? 0.6 : 0.9;
  for (const f of M_.fans) { if (Math.random() > ch) continue; f.react = { kind: crowdReaction(play, team === undefined ? undefined : f.team === team), t: -rnd(0, 0.35), dur: rnd(1.5, 2.7) }; f.hype = f.react.dur; }
}
function crowdStep(dt) {
  const M_ = MT, B = M_.B, bx = B.pos.x, bz = B.pos.z;
  { const K = M_.crowd, to = M_.cfg.mode.to; if (K && M_.phase === 'live' && M_.net !== 'guest' && Math.min(M_.score[0], M_.score[1]) >= to * 0.55 && Math.abs(M_.score[0] - M_.score[1]) <= 2) crowdHeat(dt * 0.07); }      /* tight and late: word gets round */
  for (const f of M_.fans) {
    if (f.walk) { const dx = f.tx - f.x, dz = f.tz - f.z, l = Math.hypot(dx, dz); if (l < 0.15) { f.walk = false; f.r.root.rotation.y = f.face; } else { const v = 1.7; f.x += dx / l * v * dt; f.z += dz / l * v * dt; f.psi = (f.psi + v * dt / 1.5) % 1; f.r.root.position.set(f.x, 0, f.z); f.r.root.rotation.y = Math.atan2(dx, dz); applyPose(f.r, poseOf('gait', 0, { psi: f.psi, amp: 1, hipA: 1, swag: 0.4, thigh: f.r.thigh, shin: f.r.shin, leg: f.r.legLen }), dt); continue; } }
    let kind = f.amb, u = 1;
    if (f.react) { f.react.t += dt; if (f.react.t >= f.react.dur) f.react = null; else if (f.react.t >= 0) { kind = f.react.kind; u = Math.min(1, f.react.t / 0.25); } }
    else { f.ambT -= dt; if (f.ambT <= 0) { f.amb = pick(CROWD_AMBIENT); f.ambT = rnd(3, 9); } }
    const P = crowdPose(kind, M_.time, { ph: f.ph, u, alert: M_.phase === 'live' ? 0.3 : 0 }, f.prof);
    if (kind !== 'phone' && kind !== 'talk') { let a = Math.atan2(bx - f.x, bz - f.z) - f.face; a = Math.atan2(Math.sin(a), Math.cos(a)); a = clamp(a, -1.1, 1.1); const n = P.neck || (P.neck = [0, 0, 0]); n[1] += a * 0.6; const c = P.chest || (P.chest = [0, 0, 0]); c[1] += a * 0.25; }      /* eyes on the ball */
    applyPose(f.r, P, dt);
  }
}
