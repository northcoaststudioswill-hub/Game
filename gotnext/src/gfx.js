// GOT NEXT — graphics: renderer, cel-shading, the lanky baller rig, drip, animation, set dressing
'use strict';
let renderer, camera, scene;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3();

function gfxInit() {
  renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, IS_TOUCH ? 1.75 : 2));
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  gfxResize(); addEventListener('resize', gfxResize);
}
function gfxResize() {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = w < h ? 74 : 52; camera.updateProjectionMatrix();
}

// ---- cel shading: banded toon ramp + inverted-hull ink lines ----
let _ramp = null;
function ramp() {
  if (_ramp) return _ramp;
  const d = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
  _ramp = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); _ramp.minFilter = _ramp.magFilter = THREE.NearestFilter; _ramp.needsUpdate = true; return _ramp;
}
const _mats = {};
function toon(c, emissive) {
  const k = c + '|' + (emissive || '');
  if (!_mats[k]) { _mats[k] = new THREE.MeshToonMaterial({ color: c, gradientMap: ramp() }); if (emissive) { _mats[k].emissive = new THREE.Color(emissive); _mats[k].emissiveIntensity = 0.9; } }
  return _mats[k];
}
function flat(c, opts) { const k = 'f' + c + JSON.stringify(opts || 0); if (!_mats[k]) _mats[k] = new THREE.MeshBasicMaterial(Object.assign({ color: c }, opts || {})); return _mats[k]; }
const INK = new THREE.MeshBasicMaterial({ color: 0x0b0b12, side: THREE.BackSide });
function ink(mesh, k) { const o = new THREE.Mesh(mesh.geometry, INK); o.scale.setScalar(k || 1.08); mesh.add(o); return mesh; }
const _geo = {};
function geo(k, f) { return _geo[k] || (_geo[k] = f()); }
function capsule(r, len) { return geo('c' + r.toFixed(3) + len.toFixed(3), () => new THREE.CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 3, 8)); }
function box(w, h, d) { return geo('b' + w + ',' + h + ',' + d, () => new THREE.BoxGeometry(w, h, d)); }
function sph(r, ws, hs) { return geo('s' + r + ',' + (ws || 10), () => new THREE.SphereGeometry(r, ws || 10, hs || 8)); }
function cyl(rt, rb, h, n, open) { return geo('y' + rt + ',' + rb + ',' + h + ',' + (n || 10) + (open ? 'o' : ''), () => new THREE.CylinderGeometry(rt, rb, h, n || 10, 1, !!open)); }
function M(g, m, x, y, z, parent) { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(o); return o; }
function grp(parent, x, y, z) { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(g); return g; }

function baseLights(sc, sky, ground, sunC, amb) {
  sc.add(new THREE.HemisphereLight(sky, ground, amb || 1.5));
  const d = new THREE.DirectionalLight(sunC || 0xffffff, 2.2); d.position.set(6, 14, 8); sc.add(d);
}

// ---- text / signs ----
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function sign(text, w, h, fg, bg, opts) {
  opts = opts || {};
  const tex = canvasTex(512, Math.round(512 * h / w), (x, W, H) => {
    x.fillStyle = bg || '#0c0c16'; x.fillRect(0, 0, W, H);
    if (opts.border !== false) { x.strokeStyle = fg; x.lineWidth = 10; x.strokeRect(9, 9, W - 18, H - 18); }
    const lines = text.split('\n'); let fs = Math.min(H / (lines.length * 1.25), 120);
    x.font = `900 expanded ${fs}px Archivo, Impact, 'Arial Black', sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    let mw = 0; for (const l of lines) mw = Math.max(mw, x.measureText(l).width);
    if (mw > W - 50) { fs *= (W - 50) / mw; x.font = `900 expanded ${fs}px Archivo, Impact, 'Arial Black', sans-serif`; }
    x.shadowColor = fg; x.shadowBlur = 18; x.fillStyle = fg;
    lines.forEach((l, i) => x.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.1));
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
  return m;
}

// Body proportions, all 1 (or the default share) in the game. The model lab edits these live; numbers that look right
// there get copied back here. leg/torso/arm scale lengths; thighShare/upperArm split a limb between its two bones.
const PROP_DEFAULT = { leg: 1, thighShare: 0.5, torso: 1, arm: 1, upperArm: 0.5, shoulder: 1, hips: 1, head: 1, neck: 1, limb: 1, hand: 1, foot: 1 };
const PROP = Object.assign({}, PROP_DEFAULT);
// =====================================================================
//  THE RIG — thin, long-limbed, built out of joints so drip snaps on
// =====================================================================
function makeRig(spec, lowDetail) {
  const b = spec.build.body, worn = spec.worn || {};
  const P = PROP, H = b.h * 0.0254, wS = 1 + b.w * 0.2, aS = 1 + b.s * 0.07, lW = wS * P.limb;
  const skin = toon(SKINS[spec.build.skin || 0]);
  const D = s => DRIPS[worn[s]] || null;
  const R = { H, joints: {}, cur: {}, spec, extraYaw: 0 };
  const legLen = H * 0.5 * P.leg, thigh = legLen * P.thighShare, shin = legLen * (1 - P.thighShare), torso = H * 0.29 * P.torso, armLen = H * 0.39 * aS * P.arm, up = armLen * P.upperArm, fore = armLen * (1 - P.upperArm);
  const shW = 0.21 * (0.92 + 0.08 * wS) * (H / 1.95) * P.shoulder, hipW = 0.095 * wS * P.hips;
  const root = new THREE.Group(); R.root = root;
  const out = lowDetail ? (m => m) : ink;
  const hips = grp(root, 0, legLen, 0); R.legLen = legLen;
  const spine = grp(hips, 0, 0, 0);
  const top = D('top') || DRIPS.t_tank, bot = D('bottom') || DRIPS.b_basic;
  // torso: shoulders wider than waist, flattened front to back
  const loH = torso * 0.46, upH = torso * 0.54, midR = lerp(0.115 * wS, shW * 0.98, 0.42);
  const tgLo = geo('torsoLo' + shW.toFixed(3) + wS.toFixed(2) + torso.toFixed(3), () => { const g = new THREE.CylinderGeometry(midR, 0.115 * wS, loH + 0.03, 10); g.scale(1, 1, 0.6); return g; });
  const tgUp = geo('torsoUp' + shW.toFixed(3) + wS.toFixed(2) + torso.toFixed(3), () => { const g = new THREE.CylinderGeometry(shW * 0.98, midR, upH + 0.02, 10); g.scale(1, 1, 0.58); return g; });
  out(M(tgLo, toon(top.c), 0, loH / 2, 0, spine), 1.06);
  const chestJ = grp(spine, 0, loH, 0); out(M(tgUp, toon(top.c), 0, upH / 2, 0, chestJ), 1.06);
  M(cyl(0.118 * wS, 0.118 * wS, 0.03, 10), toon(top.c2 || top.c), 0, 0.03, 0, spine).scale.z = 0.62;       // hem
  if (top.kind === 'jersey') { const st = M(box(shW * 1.5, 0.05, 0.02), toon(top.c2), 0, upH * 0.3, 0.105 * wS, chestJ); st.rotation.x = -0.12; }
  const chest = grp(chestJ, 0, upH, 0);
  // neck + head
  const neck = grp(chest, 0, 0, 0); M(cyl(0.045 * P.limb, 0.05 * P.limb, 0.1 * P.neck, 8), skin, 0, 0.04 * P.neck, 0, neck);
  const head = grp(neck, 0, 0.09 * P.neck, 0);
  const hr = 0.108 * P.head;
  const hm = out(M(sph(hr, 12, 10), skin, 0, hr * 1.05, 0.01, head), 1.07); hm.scale.set(0.92, 1.12, 0.98);
  if (!lowDetail) { for (const sx of [-1, 1]) { M(box(0.026, 0.034, 0.01), flat(0x101014), sx * 0.04, hr * 1.12, hr * 0.96, head); M(box(0.042, 0.012, 0.01), flat(0x101014), sx * 0.04, hr * 1.42, hr * 0.93, head).rotation.z = sx * -0.15; } }
  // hair
  const hair = D('hair'), hc = hair ? toon(hair.c) : null, hy = hr * 1.05;
  if (hair) switch (hair.kind) {
    case 'buzz': { const m = M(geo('buzz', () => new THREE.SphereGeometry(hr * 1.03, 12, 8, 0, 6.3, 0, 1.35)), hc, 0, hy + 0.012, 0, head); m.scale.set(0.93, 1.1, 1); m.rotation.x = -0.25; break; }
    case 'fro': out(M(sph(hr * 1.42, 12, 10), hc, 0, hy + 0.07, -0.02, head), 1.05); break;
    case 'hightop': out(M(cyl(hr * 0.98, hr * 0.9, 0.15, 10), hc, 0, hy + 0.14, -0.005, head), 1.06); break;
    case 'mohawk': out(M(box(0.035, 0.11, 0.2), hc, 0, hy + 0.13, -0.02, head), 1.1); break;
    case 'bun': M(geo('buzz', () => new THREE.SphereGeometry(hr * 1.03, 12, 8, 0, 6.3, 0, 1.35)), hc, 0, hy + 0.012, 0, head).rotation.x = -0.3; out(M(sph(0.05), hc, 0, hy + 0.12, -0.07, head)); break;
    case 'braids': {
      M(geo('buzz', () => new THREE.SphereGeometry(hr * 1.03, 12, 8, 0, 6.3, 0, 1.35)), hc, 0, hy + 0.012, 0, head).rotation.x = -0.3;
      for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + 0.7 * i / 6) + Math.PI / 2 * 0; const br = M(capsule(0.014, 0.2), i % 2 ? toon(hair.c2 || hair.c, hair.c2) : hc, Math.cos(a + Math.PI) * hr * 0.9 * (i < 3.5 ? 1 : 1), hy - 0.07, -Math.abs(Math.sin(a)) * hr * 0.85, head); br.position.x = (i - 3) * 0.03; }
      break;
    }
  }
  // headwear
  const hd = D('head');
  if (hd && hd.kind !== 'none') {
    const c = toon(hd.c, hd.kind === 'halo' ? hd.c : null), c2 = toon(hd.c2 || hd.c);
    switch (hd.kind) {
      case 'band': { const m = M(geo('band', () => new THREE.TorusGeometry(hr * 0.97, 0.016, 6, 16)), c, 0, hy + 0.055, 0.005, head); m.rotation.x = Math.PI / 2 - 0.12; break; }
      case 'cap': { const m = out(M(geo('cap', () => new THREE.SphereGeometry(hr * 1.1, 12, 8, 0, 6.3, 0, 1.5)), c, 0, hy + 0.03, 0, head), 1.05); m.scale.set(0.95, 1.05, 1.02); M(box(0.15, 0.012, 0.11), c2, 0, hy + 0.045, -hr - 0.03, head); break; }
      case 'halo': { const m = M(geo('halo', () => new THREE.TorusGeometry(0.1, 0.012, 6, 20)), flat(hd.c), 0, hy + 0.24, 0, head); m.rotation.x = Math.PI / 2; break; }
      case 'crown': { M(cyl(hr * 0.9, hr * 0.85, 0.05, 10, true), c, 0, hy + 0.11, 0, head).material.side = THREE.DoubleSide; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; M(geo('cpt', () => new THREE.ConeGeometry(0.025, 0.07, 4)), i % 2 ? c2 : c, Math.cos(a) * hr * 0.86, hy + 0.165, Math.sin(a) * hr * 0.86, head); } break; }
      case 'antenna': { M(cyl(0.006, 0.006, 0.26, 5), c, 0.05, hy + 0.2, -0.02, head); M(sph(0.022), flat(hd.c2), 0.05, hy + 0.34, -0.02, head); break; }
      case 'eagle': { out(M(sph(hr * 1.22, 12, 10), c, 0, hy + 0.03, -0.01, head), 1.05); const bk = M(geo('beak', () => new THREE.ConeGeometry(0.045, 0.14, 6)), c2, 0, hy + 0.0, hr + 0.07, head); bk.rotation.x = Math.PI / 2 + 0.25; for (const sx of [-1, 1]) M(sph(0.02), flat(0x101014), sx * 0.06, hy + 0.07, hr * 1.02, head); break; }
    }
  }
  const fc = D('face');
  if (fc && fc.kind !== 'none' && !(hd && hd.kind === 'eagle')) {
    const ey = hr * 1.12, fz = hr + 0.008;
    switch (fc.kind) {
      case 'shades': for (const sx of [-1, 1]) M(box(0.058, 0.036, 0.016), toon(fc.c), sx * 0.042, ey, fz, head); M(box(0.03, 0.008, 0.012), toon(fc.c), 0, ey + 0.008, fz, head); break;
      case 'visor': M(box(0.17, 0.04, 0.03), flat(fc.c, { transparent: true, opacity: 0.85 }), 0, ey, fz - 0.004, head); break;
      case 'mask': M(box(0.13, 0.065, 0.045), toon(fc.c), 0, ey - 0.065, fz - 0.018, head); break;
      case 'goggles': for (const sx of [-1, 1]) M(cyl(0.03, 0.03, 0.02, 10), toon(fc.c), sx * 0.042, ey, fz, head).rotation.x = Math.PI / 2; M(box(0.2, 0.014, 0.19), toon(fc.c2 || fc.c), 0, ey, 0, head); break;
    }
  }
  if (top.kind === 'hoodie') out(M(sph(0.1), toon(top.c), 0, 0.03, -0.09, chest), 1.06).scale.set(1.2, 0.8, 0.8);
  // arms. character faces +z, so its right arm is on -x
  const arm = D('arm');
  for (const side of ['R', 'L']) {
    const sx = side === 'R' ? -1 : 1;
    const sh = grp(chest, sx * (shW + 0.015), -0.035, 0);
    out(M(capsule(0.043 * lW, up), skin, 0, -up / 2 + 0.03, 0, sh), 1.12);
    M(sph(0.055 * lW), top.kind === 'tank' ? skin : toon(top.c), 0, 0, 0, sh);
    if (top.kind === 'tee' || top.kind === 'jersey') M(capsule(0.052 * lW, up * (top.kind === 'tee' ? 0.55 : 0.3)), toon(top.c), 0, -up * 0.16, 0, sh);
    const el = grp(sh, 0, -up + 0.03, 0);
    out(M(capsule(0.036 * lW, fore), skin, 0, -fore / 2 + 0.02, 0, el), 1.13);
    const wr = grp(el, 0, -fore + 0.045, 0); const hand = out(M(sph(0.046), skin, 0, -0.045, 0, wr), 1.1); hand.scale.set(0.85 * P.hand, 1.35 * P.hand, 0.5 * P.hand); R.joints['wr' + side] = wr;
    if (arm && arm.kind !== 'none') {
      const ac = toon(arm.c);
      if (arm.kind === 'wrist') M(cyl(0.041 * lW, 0.041 * lW, 0.045, 8), ac, 0, -fore + 0.09, 0, el);
      if ((arm.kind === 'sleeve' && side === 'R') || arm.kind === 'sleeves') { M(capsule(0.041 * lW, fore * 0.85), ac, 0, -fore / 2 + 0.04, 0, el); M(capsule(0.048 * lW, up * 0.5), ac, 0, -up * 0.7, 0, sh); if (arm.c2) M(cyl(0.043 * lW, 0.043 * lW, 0.02, 8), flat(arm.c2), 0, -fore * 0.5, 0, el); }
    }
    R.joints['sh' + side] = sh; R.joints['el' + side] = el; R['hand' + side] = hand;
  }
  // shorts
  const sc = toon(bot.c), baggy = bot.kind === 'baggy';
  const pg = geo('pelvis' + wS.toFixed(2), () => { const g = new THREE.CylinderGeometry(0.122 * wS, 0.14 * wS, 0.16, 10); g.scale(1, 1, 0.66); return g; });
  out(M(pg, sc, 0, -0.045, 0, hips), 1.06);
  M(cyl(0.124 * wS, 0.124 * wS, 0.025, 10), toon(bot.c2 || bot.c), 0, 0.03, 0, hips).scale.z = 0.66;
  // legs
  const socks = D('socks') || DRIPS.s_low, shoes = D('shoes') || DRIPS.k_beat;
  for (const side of ['R', 'L']) {
    const sx = side === 'R' ? -1 : 1;
    const hp = grp(hips, sx * hipW, -0.04, 0);
    out(M(capsule(0.062 * lW, thigh), skin, 0, -thigh / 2 + 0.03, 0, hp), 1.1);
    const sl = thigh * (baggy ? 0.98 : 0.62);
    out(M(geo('short' + wS.toFixed(2) + sl.toFixed(3), () => new THREE.CylinderGeometry(0.074 * lW, 0.086 * lW, sl, 8)), sc, 0, -sl / 2 + 0.03, 0, hp), 1.07);
    const kn = grp(hp, 0, -thigh + 0.03, 0);
    out(M(capsule(0.045 * lW, shin), skin, 0, -shin / 2 + 0.02, 0, kn), 1.12);
    const sockH = socks.kind === 'high' ? shin * 0.62 : shin * 0.2;
    M(cyl(0.047 * lW, 0.043 * lW, sockH, 8), toon(socks.c), 0, -shin + 0.06 + sockH / 2, 0, kn);
    if (socks.c2 && socks.kind === 'high') M(cyl(0.049 * lW, 0.049 * lW, 0.025, 8), toon(socks.c2), 0, -shin + 0.04 + sockH, 0, kn);
    const foot = grp(kn, 0, -shin + 0.05, 0); R.joints['an' + side] = foot; foot.scale.setScalar(P.foot);
    out(M(box(0.095, 0.075, 0.25), toon(shoes.c), 0, -0.01, 0.055, foot), 1.1);
    M(box(0.1, 0.022, 0.26), toon(shoes.c2 || '#fff'), 0, -0.045, 0.055, foot);
    if (shoes.kind === 'high') M(cyl(0.052, 0.05, 0.08, 8), toon(shoes.c), 0, 0.045, 0, foot);
    R.joints['hp' + side] = hp; R.joints['kn' + side] = kn; R.thigh = thigh; R.shin = shin; R.hipW = hipW;
  }
  // back
  const bk = D('back');
  if (bk && bk.kind !== 'none') {
    const c = toon(bk.c), c2 = toon(bk.c2 || bk.c);
    switch (bk.kind) {
      case 'towel': M(box(0.09, 0.2, 0.03), c, -0.07, -0.13, 0.11, hips).rotation.z = 0.1; break;
      case 'cape': { const g = grp(chest, 0, -0.02, -0.09); const m = M(box(shW * 1.9, torso * 1.6, 0.012), c, 0, -torso * 0.8, 0, g); M(box(shW * 1.9, 0.08, 0.016), c2, 0, -0.06, 0, g); g.rotation.x = 0.12; R.cape = g; m.material.side = THREE.DoubleSide; break; }
      case 'pack': out(M(box(0.2, 0.26, 0.09), c, 0, -0.16, -0.14, chest), 1.06); for (const sx of [-1, 1]) { M(cyl(0.035, 0.045, 0.12, 8), c2, sx * 0.06, -0.33, -0.14, chest); } break;
      case 'wings': for (const sx of [-1, 1]) { const g = grp(chest, sx * 0.06, -0.08, -0.1); const w = M(geo('wing', () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.55, 0.3); s.lineTo(0.5, 0.05); s.lineTo(0.42, -0.1); s.lineTo(0.28, -0.22); s.lineTo(0.1, -0.3); s.lineTo(0, -0.12); return new THREE.ShapeGeometry(s); }), toon(bk.c), 0, 0, 0, g); w.material.side = THREE.DoubleSide; g.scale.x = sx; g.rotation.y = sx * 0.5; (R.wings = R.wings || []).push(g); } break;
    }
  }
  Object.assign(R.joints, { hips, spine, chest: chestJ, neck, head });
  for (const k in R.joints) R.cur[k] = [0, 0, 0];
  R.yOff = 0;
  // blob shadow
  R.shadow = M(geo('blob', () => new THREE.CircleGeometry(0.34, 14)), flat(0x000000, { transparent: true, opacity: 0.32, depthWrite: false }), 0, 0.015, 0, root); R.shadow.rotation.x = -Math.PI / 2;
  return R;
}
function handPos(R, side, out) { return R['hand' + (side || 'R')].getWorldPosition(out); }

// ---- poses. Angles in radians; x<0 swings a limb forward. Unlisted joints relax to zero. ----
const POSE = {};
function setP(p, k, x, y, z) { p[k] = [x || 0, y || 0, z || 0]; }
// ---- a real walk: joint angles through one stride, from normative gait-lab data (sagittal plane, degrees) ----
// 0 = heel strike, 0.6 = toe off (stance 60%, swing 40%). Hip: + flexion (leg in front). Knee: + flexion. Ankle: + dorsiflexion.
const GAIT_HIP = [[0, 30], [0.1, 27], [0.3, 11], [0.5, -9], [0.6, -3], [0.7, 14], [0.85, 32], [1, 30]];
const GAIT_KNEE = [[0, 4], [0.12, 17], [0.3, 8], [0.42, 5], [0.55, 22], [0.62, 40], [0.72, 60], [0.82, 46], [0.92, 14], [1, 4]];
const GAIT_ANKLE = [[0, 0], [0.08, -6], [0.3, 6], [0.45, 10], [0.55, 0], [0.62, -17], [0.72, -6], [0.85, 2], [1, 0]];
function gcurve(K, u) {           // smooth (Catmull-Rom) through the keyframes, wrapping round the cycle
  u = ((u % 1) + 1) % 1; let i = 0; while (i < K.length - 2 && K[i + 1][0] <= u) i++;
  const a = K[i], b = K[i + 1], p0 = K[i - 1] || [K[K.length - 2][0] - 1, K[K.length - 2][1]], p3 = K[i + 2] || [1 + K[1][0], K[1][1]];
  const t = (u - a[0]) / (b[0] - a[0]), t2 = t * t, t3 = t2 * t, m1 = (b[1] - p0[1]) / (b[0] - p0[0]) * (b[0] - a[0]) * 0.5, m2 = (p3[1] - a[1]) / (p3[0] - a[0]) * (b[0] - a[0]) * 0.5;
  return (2 * t3 - 3 * t2 + 1) * a[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * b[1] + (t3 - t2) * m2;
}
const D2R = Math.PI / 180;
function walkPose(p, o) {
  const S_ = (k, x, y, z) => { p[k] = [x || 0, y || 0, z || 0]; };
  const a = o.amp === undefined ? 1 : o.amp, ah = o.hipA === undefined ? a : o.hipA, ps = o.psi || 0, sw = o.swag || 0, th = o.thigh || 0.48, sh = o.shin || 0.48;
  let lowest = 0;
  for (const [side, off] of [['R', 0], ['L', 0.5]]) {
    const u = ps + off, hip = (11 + (gcurve(GAIT_HIP, u) - 11) * ah) * D2R, kn = (4 + (gcurve(GAIT_KNEE, u) - 4) * (0.45 + 0.55 * a)) * D2R, an = gcurve(GAIT_ANKLE, u) * a * D2R;
    S_('hp' + side, -hip, 0, side === 'R' ? -0.03 : 0.03); S_('kn' + side, kn); S_('an' + side, -(-hip + kn) - an);
    lowest = Math.max(lowest, th * Math.cos(hip) + sh * Math.cos(-hip + kn));           // the standing leg reaches the ground
  }
  p.y = (lowest - (th + sh)) * 0.78;                 /* a real walker's knees and ankles smooth the bob a little more */
  // pelvis: turns with the forward leg, the swing side drops a little; trunk counter-turns; head steady
  const c = Math.cos(2 * Math.PI * ps), s2 = Math.sin(4 * Math.PI * ps), pz = -0.04 * Math.sin(2 * Math.PI * ps) * a, py = 0.07 * c * a;
  S_('hips', 0.02, py, pz);
  for (const s of ['R', 'L']) { const h = p['hp' + s]; h[1] -= py; h[2] -= pz; }       /* the hips turn and tilt; the legs (and feet) do not go with them */
  S_('spine', 0.04, -0.03 * c * a, 0.015 * sw);
  S_('chest', 0.01 + 0.01 * s2 * a, -0.06 * c * a - 0.02 * sw, -0.03 * Math.sin(2 * Math.PI * ps) * sw * a);
  S_('neck', -0.05, 0.08 * c * a, 0); S_('head', -0.02 + 0.015 * sw * Math.abs(s2));
  // arms swing opposite the legs: the right arm is furthest forward when the left heel strikes
  for (const [side, off, k] of [['R', 0.5, 1 + 0.12 * sw], ['L', 0, 1 - 0.18 * sw]]) {
    const f = Math.cos(2 * Math.PI * (ps - off)), flex = (6 + 16 * f * k) * a * D2R, lag = Math.cos(2 * Math.PI * (ps - off) - 0.6);
    S_('sh' + side, -flex, 0, side === 'R' ? -0.09 : 0.09); S_('el' + side, -(0.28 + 0.22 * Math.max(0, lag) * a)); S_('wr' + side, -0.12 - 0.05 * sw);
  }
  p.rate = 32;
}
// ---- a real run: joint angles through one running stride (degrees), from running-biomechanics data ----
// 0 = foot strike, toe-off at 0.38 in these reference curves (re-timed below: the faster the run, the shorter the
// stance and the longer the flight). The knee folds to ~95-125 degrees in the swing; the hip drives to ~45-60.
const RUN_HIP = [[0, 28], [0.1, 22], [0.25, 6], [0.38, -12], [0.46, -8], [0.6, 20], [0.75, 44], [0.86, 48], [0.95, 36], [1, 28]];
const RUN_KNEE = [[0, 18], [0.12, 34], [0.2, 36], [0.38, 20], [0.5, 62], [0.62, 96], [0.7, 100], [0.82, 62], [0.93, 24], [1, 18]];
const RUN_ANKLE = [[0, 6], [0.12, 20], [0.2, 22], [0.38, -24], [0.5, -14], [0.7, 0], [1, 6]];
// o.psi stride phase, o.duty stance share of the stride (0.42 jog .. 0.28 sprint), o.k 0 jog .. 1 sprint,
// o.flight seconds in the air between steps, o.hipA stance hip-swing scale
function runPose(p, o) {
  const S_ = (k, x, y, z) => { p[k] = [x || 0, y || 0, z || 0]; };
  const ps = ((o.psi || 0) % 1 + 1) % 1, d = o.duty || 0.38, k = o.k || 0, ah = o.hipA === undefined ? 1 : o.hipA, th = o.thigh || 0.48, sh = o.shin || 0.48, full = th + sh;
  const warp = u => u < d ? u / d * 0.38 : 0.38 + (u - d) / (1 - d) * 0.62;       // stance and swing re-timed for this speed
  const leg = u => { const w = warp(((u % 1) + 1) % 1), st = w < 0.38; const sw = st ? 0 : (w - 0.38) / 0.62, land = clamp((sw - 0.8) / 0.2, 0, 1), c0 = 3 + 20 * ah;       /* the swing ends where the stance begins: no snap at foot strike */
    const hipS = gcurve(RUN_HIP, w) * (1 + 0.1 * k), hip = (st ? 3 + (gcurve(RUN_HIP, w) - 8) * ah : lerp(hipS, c0, land * land)) * D2R, kn = gcurve(RUN_KNEE, w) * (st ? 1 : 1 + 0.22 * k) * D2R, an = gcurve(RUN_ANKLE, w) * (st && w < 0.1 ? 0.4 : 1) * D2R; return { hip, kn, an, reach: th * Math.cos(hip) + sh * Math.cos(-hip + kn) }; };
  let low = 0, stance = false;
  for (const [side, off] of [['R', 0], ['L', 0.5]]) {
    const u = ((ps + off) % 1 + 1) % 1, L = leg(u);
    S_('hp' + side, -L.hip, 0, side === 'R' ? -0.02 : 0.02); S_('kn' + side, L.kn); S_('an' + side, -(-L.hip + L.kn) - L.an);
    if (u < d) { stance = true; low = Math.max(low, L.reach); }
  }
  if (stance) p.y = low - full;
  else {      // both feet off: a short ballistic hop from the toe-off height to the next foot-strike height
    const u = ps < 0.5 ? ps : ps - 0.5, a = clamp((u - d) / (0.5 - d), 0, 1), y0 = leg(d - 0.001).reach, y1 = leg(0).reach, tf = o.flight || 0.1;
    p.y = lerp(y0, y1, a) - full + 4 * (9.8 * tf * tf / 8) * a * (1 - a);
  }
  p.y *= 0.72;          /* a runner's joints soak up some of the rise and fall: a glide, not a pogo */
  // trunk leans into the run; pelvis and shoulders counter-rotate; the head stays level
  const c = Math.cos(2 * Math.PI * ps), lean = 0.06 + 0.07 * k, py = 0.08 * c, pz = -0.05 * Math.sin(2 * Math.PI * ps);
  S_('hips', lean * 0.35, py, pz); for (const s of ['R', 'L']) { const h = p['hp' + s]; h[0] += lean * 0.35; h[1] -= py; h[2] -= pz; }
  S_('spine', lean * 0.4, -0.05 * c, 0); S_('chest', lean * 0.25, -0.13 * c, 0); S_('neck', -lean * 0.8, 0.12 * c, 0); S_('head', -0.03);
  // arms: elbows near a right angle, driven from the shoulder, opposite the legs; the hand comes up toward the chin
  for (const [side, off] of [['R', 0.5], ['L', 0]]) {
    // the upper arm swings mostly BEHIND the body (about 40 degrees back, 15-20 forward); the elbow closes as the hand
    // comes up in front and opens as it passes the hip going back
    const f = Math.cos(2 * Math.PI * (ps - off) + 0.5), fl = (-11 + (27 + 8 * k) * f) * D2R;
    S_('sh' + side, -fl, 0, side === 'R' ? -0.07 : 0.07); S_('el' + side, -(1.3 + 0.35 * Math.max(0, f) - 0.3 * Math.max(0, -f))); S_('wr' + side, -0.05);
  }
  p.rate = 40;
}
function blendPose(A, B, t) { const o = { y: lerp(A.y || 0, B.y || 0, t), rate: Math.max(A.rate || 16, B.rate || 16) }; const z = POSE.zero; for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) { if (k === 'y' || k === 'rate') continue; const a = A[k] || z, b = B[k] || z; o[k] = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; } return o; }
function poseOf(anim, t, o) {
  const p = { y: 0, rate: 16 }; o = o || {};
  const S_ = (k, x, y, z) => { p[k] = [x || 0, y || 0, z || 0]; };
  const armsDown = () => { S_('shR', 0.05, 0, -0.1); S_('shL', 0.05, 0, 0.1); S_('elR', -0.25); S_('elL', -0.25); S_('wrR', -0.1); S_('wrL', -0.1); };
  const legs = (hr, kr, hl, kl, spread) => { S_('hpR', hr, 0, -(spread || 0)); S_('knR', kr); S_('hpL', hl, 0, spread || 0); S_('knL', kl); S_('anR', -(hr + kr) * 0.55); S_('anL', -(hl + kl) * 0.55); };
  switch (anim) {
    case 'idle': { const b = Math.sin(t * 2); armsDown(); p.y = b * 0.006; S_('spine', 0.03); S_('chest', 0.02 + b * 0.02); S_('neck', -0.03); S_('hips', 0, 0, 0.03); S_('hpR', 0, 0, -0.06); S_('hpL', 0, 0, 0.1); break; }
    case 'walk': case 'run': case 'dribble': case 'slide': {
      const a = clamp(o.sp || 0, 0, 1), ph = o.ph || 0, s = Math.sin(ph), c = Math.cos(ph), amp = anim === 'slide' ? 0.35 : 0.25 + a * 0.75;
      // legs: thigh swings, knee folds on the recovery, ankle pushes off behind and dorsiflexes in front
      S_('hpR', -s * amp); S_('hpL', s * amp); S_('knR', 0.15 + amp * 1.25 * Math.max(0, -c)); S_('knL', 0.15 + amp * 1.25 * Math.max(0, c));
      S_('anR', s * amp * 0.55 + 0.1); S_('anL', -s * amp * 0.55 + 0.1);
      // trunk: lean, counter-rotate chest against hips, keep the head level
      S_('hips', 0, -s * 0.1 * amp, 0); S_('spine', 0.05 + a * 0.14); S_('chest', 0.03 + a * 0.08, s * 0.24 * amp, 0); S_('neck', -0.06 - a * 0.14, -s * 0.12 * amp, 0);
      p.y = -0.02 + 0.04 * Math.abs(s) * amp;
      S_('shR', s * amp * 0.85, 0, -0.12); S_('shL', -s * amp * 0.85, 0, 0.12); S_('elR', -0.5 - a * 1.0 - Math.max(0, -s) * 0.3); S_('elL', -0.5 - a * 1.0 - Math.max(0, s) * 0.3); S_('wrR', -0.15); S_('wrL', -0.15);
      if (anim === 'dribble') {
        const d = o.dr || 0, hand = o.hand === 'L' ? 'L' : 'R', sg = hand === 'R' ? -1 : 1, off = hand === 'R' ? 'L' : 'R';
        p.y -= 0.08; S_('spine', 0.2 + a * 0.1); S_('chest', 0.1, s * 0.12 * amp + sg * -0.12, 0); S_('neck', -0.28, 0, 0); p.knR[0] += 0.28; p.knL[0] += 0.28; p.hpR[0] -= 0.24; p.hpL[0] -= 0.24;
        S_('sh' + hand, -0.5 - d * 0.22, 0, sg * 0.28); S_('el' + hand, -0.55 - d * 0.75); S_('wr' + hand, 0.5 - d * 1.0);     // the wrist snaps the ball down
        S_('sh' + off, -0.35, 0, -sg * 0.55); S_('el' + off, -1.25); S_('wr' + off, -0.3); p.rate = 22;                     // off arm up, shielding
      }
      if (anim === 'slide') { const up = o.up ? 1 : 0; p.y = -0.16; S_('hips', 0.05, 0, 0); legs(-0.6 - s * 0.16, 1.0, -0.6 + s * 0.16, 1.0, 0.36); S_('spine', 0.14); S_('chest', 0.1); S_('neck', -0.22);
        S_('shR', up ? -2.9 : -0.35, 0, up ? -0.15 : -1.05); S_('shL', -0.35, 0, 1.05); S_('elR', up ? -0.2 : -0.45); S_('elL', -0.55); S_('wrR', up ? 0.3 : -0.4); S_('wrL', -0.4); }
      break;
    }
    case 'shoot': case 'fake': {
      const u = clamp(t / (o.rel || 0.6), 0, 1.6), k = o.kick ? 1 : 0;
      if (u < 0.45) { p.y = -0.13 * (u / 0.45); legs(-0.45, 0.7, -0.45, 0.7, 0.06); S_('spine', 0.12); S_('chest', 0.08); S_('neck', -0.12); S_('shR', -1.0, 0, 0.1); S_('shL', -0.95, 0, -0.3); S_('elR', -2.2); S_('elL', -2.0); S_('wrR', 0.7); S_('wrL', 0.2); }       // dip: ball to the pocket
      else if (u < 1) { legs(-0.05, 0.12, -k * 0.9, 0.12 + k * 0.5, 0.04); S_('anR', 0.7); S_('anL', 0.7); S_('spine', -0.03); S_('chest', -0.06); S_('neck', -0.05); S_('shR', -2.55, 0, 0.05); S_('shL', -2.35, 0, -0.32); S_('elR', -1.55); S_('elL', -1.25); S_('wrR', 0.95); S_('wrL', 0.3); }   // set point: wrist cocked
      else { legs(0.05, 0.05, -k * 1.1, k * 0.3, 0.03); S_('anR', 0.9); S_('anL', 0.9); S_('spine', -0.05); S_('chest', -0.04); S_('neck', -0.1); S_('shR', -2.95, 0, 0); S_('elR', -0.08); S_('wrR', -1.25); S_('shL', -2.1, 0, -0.4); S_('elL', -0.95); S_('wrL', -0.1); }                                          // follow-through: gooseneck
      if (o.fadeA && u >= 0.45) {        // fadeaway: hips back, shoulders back, the off leg kicks out front for balance
        const a = o.fadeA; S_('hips', -0.14 * a); S_('spine', -0.24 * a); S_('chest', -0.2 * a); S_('neck', 0.16 * a); S_('hpR', 0.12, 0, -0.04); S_('knR', 0.12); S_('hpL', -1.0 * a, 0, 0.08); S_('knL', 0.75 * a); S_('anL', 0.45); S_('anR', 0.85);
      }
      if (o.sideS && u < 0.45) { const d = o.sideS; S_('hips', 0, 0, -d * 0.18); S_('spine', 0.1, 0, d * 0.12); legs(-0.45, 0.8, -0.45, 0.8, 0.26); }   // side-step: wide and low, the body follows the hips
      p.rate = anim === 'fake' ? 30 : 20; break;
    }
    case 'floater': legs(-1.2, 1.4, 0.25, 0.25); S_('anL', 0.8); S_('spine', 0.05); S_('chest', -0.08); S_('neck', -0.15); S_('shR', -2.7, 0, 0.1); S_('elR', -0.5); S_('wrR', t > 0.2 ? -1.1 : 0.8); S_('shL', -0.5, 0, 0.5); S_('elL', -1.1); p.rate = 22; break;
    case 'layup': {
      const eu = o.euro || 0, u = o.u || 0, k = o.kind || 'lay', rel = u > 0.7;
      legs(0.3, 0.3, -1.3, 1.5); S_('anR', 0.9); S_('hips', 0, 0, -eu * 0.25); S_('spine', 0.08, 0, -eu * 0.15); S_('chest', -0.05, -eu * 0.3, 0); S_('neck', -0.2); S_('shR', -2.95, 0, 0.1 + eu * 0.2); S_('elR', -0.18); S_('wrR', rel ? -0.9 : 0.6); S_('shL', -0.5, 0, 0.45); S_('elL', -1.1); p.rate = 18;
      if (k === 'finger') {          // long reach out in front, the ball rolls off the fingertips, palm up
        legs(0.35, 0.2, -1.45, 1.2); S_('spine', -0.02); S_('chest', -0.1); S_('neck', -0.3); S_('shR', -2.35, 0, 0.05); S_('elR', -0.04); S_('wrR', rel ? 1.1 : 0.2, rel ? 1.2 : 0, 0); S_('shL', -0.3, 0, 0.6); S_('elL', -0.7);
      } else if (k === 'reverse') {  // back to the rim: arch, look up over the shoulder, reach back over the head
        legs(0.2, 0.45, -1.15, 1.45); S_('spine', -0.12); S_('chest', -0.28, 0.25, 0); S_('neck', -0.6, 0.35, 0); S_('shR', -3.45, 0, -0.15); S_('elR', -0.25); S_('wrR', rel ? -1.0 : 0.3); S_('shL', -0.7, 0, 0.7); S_('elL', -0.9);
      } else if (k === 'scoop') {    // underhand from low, under the shot-blocker's arm
        const sw = clamp((u - 0.25) / 0.5, 0, 1); legs(0.3, 0.35, -1.2, 1.55); S_('spine', 0.28); S_('chest', 0.12); S_('neck', -0.35); S_('shR', -0.25 - sw * 1.95, 0, 0.15); S_('elR', -0.12); S_('wrR', 1.25); S_('shL', -0.9, 0, 0.75); S_('elL', -1.35); p.rate = 22;
      } else if (k === 'hang') {     // hang and adjust: up, tuck, pull the ball down while the blocker goes by, then reach and release late
        if (u < 0.28) { legs(0.2, 0.4, -1.2, 1.5); S_('shR', -1.9, 0, 0.15); S_('shL', -1.7, 0, -0.15); S_('elR', -1.0); S_('elL', -1.0); }
        else if (u < 0.68) { legs(-1.3, 1.85, -1.15, 1.75, 0.1); S_('spine', 0.28); S_('chest', 0.12); S_('neck', -0.45); S_('shR', -0.45, 0, 0.2); S_('shL', -0.5, 0, -0.2); S_('elR', -1.6); S_('elL', -1.6); S_('wrR', 0.5); S_('wrL', 0.5); }
        else { legs(-0.2, 0.35, -0.5, 0.6); S_('spine', -0.05); S_('chest', -0.15); S_('neck', -0.35); S_('shR', -2.85, 0, 0.1); S_('elR', -0.12); S_('wrR', u > 0.86 ? -0.9 : 0.5); S_('shL', -1.2, 0, 0.7); S_('elL', -1.5); }
        p.rate = 22;
      } else if (k === 'switch') {   // switch hands in the air: right hand high, both meet in front, the left finishes away from the defender
        legs(0.25, 0.35, -1.25, 1.5);
        if (u < 0.42) { S_('shR', -2.3, 0, -0.35); S_('elR', -0.4); S_('wrR', 0.4); S_('shL', -0.8, 0, 0.5); S_('elL', -1.2); S_('chest', -0.05, 0.25, 0); }
        else if (u < 0.6) { S_('shR', -1.4, 0, 0.2); S_('shL', -1.4, 0, -0.2); S_('elR', -1.3); S_('elL', -1.3); S_('chest', 0, 0, 0); }
        else { S_('shL', -2.95, 0, 0.1); S_('elL', -0.15); S_('wrL', u > 0.8 ? -0.9 : 0.5); S_('shR', -1.35, 0, -0.85); S_('elR', -1.6); S_('chest', -0.08, -0.35, 0); S_('hips', 0, -0.15, 0); }
        S_('neck', -0.3); p.rate = 24;
      } else if (k === 'power') {    // two feet, two hands, square to the glass
        legs(-0.35, 0.75, -0.35, 0.75, 0.1); S_('anR', 0.7); S_('anL', 0.7); S_('spine', 0.04); S_('chest', -0.12); S_('neck', -0.3); S_('shR', -2.85, 0, 0.18); S_('shL', -2.85, 0, -0.18); S_('elR', -0.35); S_('elL', -0.35); S_('wrR', rel ? -0.7 : 0.5); S_('wrL', rel ? -0.7 : 0.5); p.rate = 20;
      }
      // contested: the off arm comes up and out to keep the defender off the ball (one-handed finishes only)
      if (o.cont && (k === 'lay' || k === 'finger' || k === 'euro' || k === 'reverse') && u > 0.15) { S_('shL', -1.3, 0, 0.75); S_('elL', -1.7); S_('wrL', 0.2); }
      if (o.blocked) { S_('shR', -1.5, 0, -0.55); S_('elR', -0.5); S_('wrR', 0.6); S_('spine', -0.2); S_('chest', -0.25); S_('neck', 0.15); p.rate = 30; }
      break;
    }
    case 'hop': {                    // the hop step: gather to the chest, both feet off, land together low
      const u = clamp(o.u || 0, 0, 1);
      if (u < 0.72) { const e = Math.sin(Math.PI * u / 0.72); legs(-0.5 - e * 0.25, 0.75 + e * 0.35, -0.4 - e * 0.2, 0.7 + e * 0.3, 0.1); S_('anR', 0.6); S_('anL', 0.6); }
      else { p.y = -0.09; legs(-0.62, 1.05, -0.62, 1.05, 0.16); }
      S_('spine', 0.32); S_('chest', 0.14); S_('neck', -0.4); S_('shR', -0.85, 0, 0.25); S_('shL', -0.85, 0, -0.25); S_('elR', -1.65); S_('elL', -1.65); S_('wrR', 0.45); S_('wrL', 0.45); p.rate = 26; break;
    }
    case 'dunk': {
      const u = o.u || 0, st = o.style || 'twohand', slam = u > 0.72, hang = u > 0.8 || !!o.onRim;
      // one-hand dunks leave off one foot: the drive knee comes up, the take-off leg trails straight with the toe pointed.
      // two-hand dunks jump off both, knees tucked. Hanging after the slam, the legs dangle.
      const oneFoot = st !== 'twohand' && st !== 'clutch' && st !== 'reverse' && st !== 'squat';
      if (hang && st === 'squat') legs(-1.45, 1.7, -1.35, 1.65, 0.15);
      else if (hang) legs(-0.3, 0.45, -0.12, 0.3, 0.06);
      else if (st === 'contact') { legs(0.15, 0.35, -1.75, 2.0, 0.06); S_('anR', 0.65); }        // the knee goes up into the defender
      else if (st === 'scratch') { legs(0.35, 1.5, 0.2, 1.35, 0.1); S_('anR', 0.6); S_('anL', 0.6); }   // feet kicked up behind
      else if (oneFoot) { legs(0.18, 0.4, -1.35, 1.75, 0.06); S_('anR', 0.65); }
      else legs(-0.75, 1.1, -0.6, 1.0, 0.12);
      S_('spine', slam ? 0.22 : -0.2); S_('chest', slam ? 0.3 : -0.35); S_('neck', slam ? 0.2 : -0.3);
      if (st === 'twohand') { const a = slam ? -1.95 : -3.3; S_('shR', a, 0, 0.12); S_('shL', a, 0, -0.12); S_('elR', slam ? -0.2 : -0.95); S_('elL', slam ? -0.2 : -0.95); S_('wrR', slam ? -0.9 : 0.5); S_('wrL', slam ? -0.9 : 0.5); }
      else if (st === 'windmill') { const a = slam ? -1.95 : (0.4 - u / 0.72 * 4.4); S_('shR', a, 0, -0.1); S_('elR', -0.1); S_('wrR', slam ? -0.9 : 0); S_('shL', -0.6, 0, 0.75); S_('elL', -0.8); p.rate = 30; }
      else if (st === 'contact') {   // posterizer: ball cocked way back, forearm into the defender's chest, then through
        S_('shR', slam ? -1.8 : -3.7, 0, -0.08); S_('elR', slam ? -0.1 : -1.45); S_('wrR', slam ? -1.0 : 0.6); S_('shL', -1.35, 0, 0.45); S_('elL', -1.85); S_('wrL', 0.2);
        S_('spine', slam ? 0.38 : 0.1); S_('chest', slam ? 0.4 : 0.08); S_('neck', slam ? 0.1 : -0.45); p.rate = 26;
      }
      else if (st === 'scratch') {   // back scratcher: the ball goes behind the head until it touches the back, body arched
        S_('shR', slam ? -1.95 : -3.95, 0, -0.05); S_('elR', slam ? -0.15 : -2.45); S_('wrR', slam ? -1.0 : 0.9); S_('shL', -0.7, 0, 0.9); S_('elL', -0.8);
        if (!slam) { S_('spine', -0.3); S_('chest', -0.4); S_('neck', -0.25); }
      }
      else if (st === 'gavel') {     // the gavel: arm straight out to the side, swung up and over like a hammer
        const w = clamp(u / 0.72, 0, 1); S_('shR', slam ? -1.95 : lerp(-1.25, -3.35, w), 0, slam ? -0.1 : lerp(-1.35, -0.2, w)); S_('elR', slam ? -0.15 : -0.05); S_('wrR', slam ? -1.0 : 0.2);
        S_('shL', -0.5, 0, 0.9); S_('elL', -0.7); S_('chest', slam ? 0.3 : -0.2, 0, slam ? 0 : 0.18); S_('spine', slam ? 0.22 : -0.15, 0, slam ? 0 : 0.12); p.rate = 24;
      }
      else if (st === 'squat') {     // rim squatter: two hands, then hang on with the knees up
        const a = slam ? (hang ? -2.95 : -2.0) : -3.3; S_('shR', a, 0, 0.14); S_('shL', a, 0, -0.14); S_('elR', slam ? -0.25 : -0.95); S_('elL', slam ? -0.25 : -0.95); S_('wrR', slam ? -0.6 : 0.5); S_('wrL', slam ? -0.6 : 0.5);
        if (hang) { S_('spine', 0.15); S_('chest', 0.1); S_('neck', -0.4); }
      }
      else if (st === 'reverse') {   // back to the rim, both hands go up and back over the head, then down behind
        const a = slam ? -3.75 : -2.9; S_('shR', a, 0, 0.15); S_('shL', a, 0, -0.15); S_('elR', slam ? -0.1 : -0.7); S_('elL', slam ? -0.1 : -0.7); S_('wrR', slam ? -0.8 : 0.4); S_('wrL', slam ? -0.8 : 0.4); S_('spine', slam ? -0.3 : -0.12); S_('chest', slam ? -0.35 : -0.15); S_('neck', -0.55);
      }
      else if (st === 'cradle') {    // ball rocked on the forearm by the hip, swung up behind and over, thrown down
        const w = clamp((u - 0.42) / 0.3, 0, 1), a = slam ? -1.95 : u < 0.42 ? 0.35 : lerp(0.35, -3.7, w);
        S_('shR', a, 0, u < 0.42 ? -0.25 : -0.05); S_('elR', slam ? -0.15 : u < 0.42 ? -1.7 : -0.4); S_('wrR', slam ? -1.0 : 0.6); S_('shL', -0.7, 0, 0.8); S_('elL', -0.8); S_('chest', slam ? 0.3 : -0.25, u < 0.42 ? -0.35 : 0.1, 0); p.rate = 26;
      }
      else if (st === 'clutch') {    // up, down to the waist with the knees tucked, back up, through
        const down = u > 0.3 && u < 0.52, a = slam ? -1.95 : down ? -0.55 : -3.1;
        if (down) legs(-1.35, 1.9, -1.2, 1.8, 0.12);
        S_('shR', a, 0, 0.12); S_('shL', a, 0, -0.12); S_('elR', slam ? -0.2 : down ? -1.5 : -0.6); S_('elL', slam ? -0.2 : down ? -1.5 : -0.6); S_('wrR', slam ? -0.9 : 0.5); S_('wrL', slam ? -0.9 : 0.5); if (down) { S_('spine', 0.25); S_('chest', 0.15); S_('neck', -0.4); } p.rate = 30;
      }
      else if (st === 'legs') {      // between the legs in the air: right hand under the right thigh, left hand takes it and finishes
        const under = u > 0.22 && u < 0.56;
        if (under) { legs(-1.55, 1.25, 0.35, 1.1, 0.18); S_('spine', 0.3); S_('chest', 0.2); S_('neck', -0.35); S_('shR', -0.15, 0, 0.35); S_('elR', -0.35); S_('wrR', 0.4); S_('shL', 0.05, 0, -0.5); S_('elL', -0.3); S_('wrL', 0.5); }
        else if (u <= 0.22) { S_('shR', -1.4, 0, 0.1); S_('shL', -1.4, 0, -0.1); S_('elR', -1.1); S_('elL', -1.1); }
        else { S_('shL', slam ? -1.95 : -3.6, 0, 0.1); S_('elL', slam ? -0.15 : -1.0); S_('wrL', slam ? -1.0 : 0.6); S_('shR', -0.5, 0, -0.85); S_('elR', -0.9); }
        p.rate = 32;
      }
      else { S_('shR', slam ? -1.95 : -3.75, 0, -0.1); S_('elR', slam ? -0.15 : -1.25); S_('wrR', slam ? -1.0 : 0.6); S_('shL', -0.5, 0, 0.85); S_('elL', -0.9); }
      if (o.blocked) { S_('shR', -1.4, 0, -0.6); S_('elR', -0.6); S_('wrR', 0.6); S_('spine', -0.25); S_('chest', -0.3); S_('neck', 0.15); legs(-0.4, 0.7, -0.2, 0.5, 0.1); }   // stuffed
      p.rate = Math.max(p.rate, 22); break;
    }
    case 'jump': legs(0.05, 0.25, 0.02, 0.15, 0.05); S_('anR', 0.8); S_('anL', 0.8); S_('spine', -0.04); S_('chest', -0.1); S_('neck', -0.25); S_('shR', -3.0, 0, 0.12); S_('shL', -2.9, 0, -0.12); S_('elR', -0.1); S_('elL', -0.15); S_('wrR', 0.4); S_('wrL', 0.4); p.rate = 22; break;
    case 'swat': legs(0.1, 0.3, -0.3, 0.5, 0.08); S_('anR', 0.8); S_('spine', 0.1); S_('chest', 0.15, 0.5, 0); S_('neck', -0.1); S_('shR', -1.7, 0, 0.5); S_('elR', -0.05); S_('wrR', -0.9); S_('shL', -0.4, 0, 0.6); S_('elL', -0.8); p.rate = 34; break;
    case 'steal': { const u = clamp(t / 0.3, 0, 1); p.y = -0.17; legs(-0.95, 1.05, 0.2, 0.5, 0.1); S_('spine', 0.38); S_('chest', 0.18, 0.5 - u * 1.0, 0); S_('neck', -0.4); S_('shR', -1.3, 0, -0.9 + u * 1.6); S_('elR', -0.2); S_('wrR', -0.5); S_('shL', 0.4, 0, 0.5); p.rate = 28; break; }
    case 'shove': p.y = -0.08; legs(-0.75, 0.75, 0.4, 0.2); S_('spine', 0.3); S_('chest', 0.15); S_('neck', -0.3); S_('shR', -1.5, 0, 0.1); S_('shL', -1.5, 0, -0.1); S_('elR', -0.1); S_('elL', -0.1); S_('wrR', 0.9); S_('wrL', 0.9); p.rate = 30; break;
    case 'pass': { const f = o.flashy; legs(-0.55, 0.55, 0.1, 0.2); S_('spine', 0.14); S_('chest', 0.1, f ? 0.6 : 0, 0); S_('neck', -0.1, f ? -0.7 : 0, 0);
      const k = o.pk || 'chest', u = clamp(t / 0.2, 0, 1), snap = u < 0.35 ? 0 : 1;     // load, then snap the wrists through
      if (f) { S_('shR', 0.7, 0, -0.3); S_('elR', -1.3); S_('wrR', -0.8); S_('shL', -0.4, 0, 0.5); S_('elL', -0.9); }
      else if (k === 'overhead' || k === 'lob') { S_('shR', snap ? -2.3 : -2.9, 0, 0.2); S_('shL', snap ? -2.3 : -2.9, 0, -0.2); S_('elR', snap ? -0.2 : -1.3); S_('elL', snap ? -0.2 : -1.3); S_('wrR', snap ? -0.9 : 0.6); S_('wrL', snap ? -0.9 : 0.6); S_('chest', snap ? 0.15 : -0.2); }
      else if (k === 'bounce') { S_('shR', snap ? -0.9 : -0.5, 0, 0.2); S_('shL', snap ? -0.9 : -0.5, 0, -0.2); S_('elR', snap ? -0.1 : -1.4); S_('elL', snap ? -0.1 : -1.4); S_('wrR', snap ? -1.0 : 0.5); S_('wrL', snap ? -1.0 : 0.5); S_('spine', 0.3); }
      else if (k === 'one') { S_('shR', snap ? -1.4 : -0.6, 0, 0.1); S_('elR', snap ? -0.1 : -1.6); S_('wrR', snap ? -0.9 : 0.6); S_('shL', -0.5, 0, 0.4); S_('elL', -1.0); }
      else if (!snap) { S_('shR', -0.9, 0, 0.3); S_('shL', -0.9, 0, -0.3); S_('elR', -1.8); S_('elL', -1.8); S_('wrR', 0.5); S_('wrL', 0.5); }
      else { S_('shR', -1.5, 0, 0.2); S_('shL', -1.5, 0, -0.2); S_('elR', -0.12); S_('elL', -0.12); S_('wrR', -0.7); S_('wrL', -0.7); } p.rate = 30; break; }
    case 'boxout': legs(-0.55, 0.75, -0.55, 0.75, 0.45); p.y = -0.14; S_('hips', 0.25); S_('spine', 0.22); S_('chest', 0.05); S_('neck', -0.35); S_('shR', -0.4, 0, -1.2); S_('shL', -0.4, 0, 1.2); S_('elR', -1.2); S_('elL', -1.2); S_('wrR', 0.3); S_('wrL', 0.3); p.rate = 18; break;
    case 'catch': S_('shR', -1.2, 0, 0.2); S_('shL', -1.2, 0, -0.2); S_('elR', -1.2); S_('elL', -1.2); S_('wrR', 0.5); S_('wrL', 0.5); S_('neck', -0.1); break;
    case 'call': armsDown(); S_('shR', -2.85, 0, -0.2); S_('elR', -0.3); S_('wrR', 0.4 + Math.sin(t * 14) * 0.4); S_('neck', -0.1); break;
    case 'move': {   // each dribble move has its own shape
      const s = o.side || 0, k = o.kind || 'cross', u = clamp(o.u || 0, 0, 1), e = Math.sin(u * Math.PI);
      // a crossover in two beats. SET (first 30%): stay over the feet, dip a shoulder toward the ball side to sell it while
      // the ball hand pushes the ball low across the front. GO: the shoulders turn and the body leans into the new
      // direction, the receiving hand waits low by the lead knee, the other arm comes up to shield.
      const dS = s < 0 ? -1 : 1, set = u < 0.3, a = clamp(u / 0.3, 0, 1), b0 = clamp((u - 0.3) / 0.4, 0, 1), bb = b0 * b0 * (3 - 2 * b0);
      const hz = dS * (set ? 0.08 * a : lerp(0.08, -0.16, bb)), cy = dS * (set ? 0.22 * a : lerp(0.22, -0.32, bb)), out = h => h === 'L' ? 1 : -1, recv = dS > 0 ? 'L' : 'R', old = dS > 0 ? 'R' : 'L';
      p.y = -0.06 - 0.07 * Math.sin(Math.PI * Math.min(1, u * 1.3)); S_('hips', 0.06, 0, hz); S_('spine', 0.26, 0, hz * 0.5); S_('chest', 0.1, cy, 0); S_('neck', -0.3, -cy * 0.6, 0); legs(-0.6, 0.95, -0.6, 0.95, 0.28);
      S_('sh' + recv, -0.55, 0, out(recv) * 0.3); S_('el' + recv, -0.8); S_('wr' + recv, -0.35);
      S_('sh' + old, set ? -0.55 : -0.85, 0, -out(old) * (set ? 0.35 * a : 0.1)); S_('el' + old, set ? -0.6 : -1.3); S_('wr' + old, -0.3);
      if (k === 'tween') { legs(s > 0 ? -1.15 : -0.3, 1.0, s > 0 ? -0.3 : -1.15, 1.0, 0.3); p.y = -0.2; S_('spine', 0.4); }
      else if (k === 'behind') { S_('spine', 0.12); S_('chest', -0.05, -s * 0.5, 0); S_('shR', 0.75 * (s > 0 ? 1 : 0.2), 0, -0.35); S_('elR', -1.2); S_('shL', 0.75 * (s < 0 ? 1 : 0.2), 0, 0.35); S_('elL', -1.2); }
      else if (k === 'shammgod') {     // push the ball out with one hand (a long reach, selling that side), then the other hand rakes it back across
        p.y -= 0.04; if (set) { S_('sh' + old, -1.15, 0, out(old) * 0.45 * a); S_('el' + old, -0.25); S_('hips', 0.06, 0, dS * 0.14 * a); S_('spine', 0.3, 0, dS * 0.08 * a); }
        else S_('sh' + recv, -0.9 + 0.35 * bb, 0, out(recv) * lerp(-0.35, 0.3, bb));
      }
      else if (k === 'stepback' || k === 'moonwalk') { p.y = -0.1 + e * 0.12; legs(-0.3 - e * 0.5, 0.5 + e * 0.7, 0.35, 0.4, 0.18); S_('spine', -0.08); S_('chest', -0.1); S_('neck', -0.05); S_('hips', -0.12, 0, 0); }
      else if (k === 'hesi') { p.y = -0.04 + e * 0.05; legs(-0.2, 0.3, 0.1, 0.25, 0.14); S_('spine', 0.0); S_('chest', -0.05); S_('neck', 0.05); S_('shR', -1.3, 0, 0.1); S_('elR', -1.7); S_('shL', -1.1, 0, -0.2); S_('elL', -1.6); }
      else if (k === 'inout') {        // shoulders and the ball hand sell the cross, then come straight back
        const d = s > 0 ? 1 : -1; p.y = -0.15; legs(-0.7, 1.1, -0.7, 1.1, 0.3 + e * 0.1); S_('hips', 0.06, 0, -d * 0.2 * e); S_('chest', 0.12, -d * 0.55 * e, 0); S_('neck', -0.3, -d * 0.3 * e, 0); const h = o.hand === 'L' ? 'L' : 'R'; S_('sh' + h, -0.75, 0, -d * 0.7 * e); S_('el' + h, -0.9);
      }
      else if (k === 'killer') {       // the killer: low and wide, the whole upper body dips the wrong way first, then swings through
        const sw = set ? -a : lerp(-1, 1, bb); p.y = -0.15; legs(-0.8, 1.2, -0.8, 1.2, 0.4); S_('hips', 0.1, 0, -dS * 0.2 * sw); S_('spine', 0.34, 0, -dS * 0.1 * sw); S_('chest', 0.14, -dS * 0.35 * sw, 0); S_('neck', -0.4, dS * 0.2, 0);
      }
      else if (k === 'snatch') {       // snatch-back: a hop away while one arm yanks the ball home to the hip
        p.y = -0.08 + e * 0.15; legs(-0.25 - e * 0.35, 0.5 + e * 0.5, 0.25 + e * 0.15, 0.5 + e * 0.4, 0.16); S_('spine', -0.1); S_('chest', -0.12); S_('hips', -0.1); const h = o.hand === 'L' ? 'L' : 'R'; S_('sh' + h, 0.55 * e - 0.4 * (1 - e), 0, 0); S_('el' + h, -1.6);
      }
      else if (k === 'spin' || k === 'halfspin') { p.y = -0.15; legs(-0.6, 1.0, -0.2, 0.6, 0.15); S_('shR', -0.5, 0, 0.3); S_('elR', -1.8); S_('shL', -0.5, 0, -0.3); S_('elL', -1.8); S_('spine', 0.25); }
      p.rate = 26; break;
    }
    case 'stagger': {
      // sd: which way he bit (+1 his right, -1 his left), from the move that beat him; 0 = straight back (posterized, shoved)
      const D = o.dur || 1, sd = o.side === undefined ? 1 : o.side, sm = x => x * x * (3 - 2 * x), L = o.leg || 0.95;
      if (!o.fall) {
        // ANKLES, kept his feet: the weight goes to the outside leg, the inside knee buckles, the arms go out for balance,
        // then he turns back and scrambles to recover
        const e = sm(clamp(t / 0.18, 0, 1)) * (1 - sm(clamp((t - 0.3) / Math.max(0.2, D - 0.35), 0, 1))), r = sm(clamp((t - 0.2) / 0.35, 0, 1)) * (1 - sm(clamp((t - D + 0.25) / 0.25, 0, 1)));
        const out = sd > 0 ? 'R' : 'L', inn = sd > 0 ? 'L' : 'R', so = sd > 0 ? -1 : 1;
        p.y = -0.05 - 0.27 * e;
        S_('hips', 0.15 * e, -sd * 0.35 * r, -sd * 0.3 * e);
        S_('hp' + out, -0.3 * e, 0, so * 0.55 * e); S_('kn' + out, 0.35 * e + 0.2); S_('an' + out, 0.25 * e);
        S_('hp' + inn, -0.95 * e, 0, -so * 0.3 * e); S_('kn' + inn, 1.75 * e + 0.2); S_('an' + inn, 0.6 * e);    /* the inside knee caves in toward the other leg */
        S_('spine', 0.3 * e, 0, sd * 0.32 * e); S_('chest', 0.05, -sd * 0.45 * r, sd * 0.1 * e); S_('neck', -0.2, -sd * 0.55 * r, 0);
        S_('sh' + out, -0.5 * e, 0, so * 1.25 * e); S_('el' + out, -0.3); S_('wr' + out, 0.3 * e);
        S_('sh' + inn, -1.6 * e, 0, -so * 0.5 * e); S_('el' + inn, -0.6 * e - 0.2); S_('wr' + inn, 0.4 * e);
        p.rate = 24; break;
      }
      // DOWN: legs go, he sits down hard on the side he bit to, posts a hand behind, watches the play, then gets up
      const fT = 0.3, gT = Math.min(0.55, D * 0.42), f = sm(clamp(t / fT, 0, 1)), g = sm(clamp((t - (D - gT)) / gT, 0, 1)), floor = -(L - 0.13);
      const post = sd === 0 ? 'both' : sd > 0 ? 'R' : 'L', other = sd > 0 ? 'L' : 'R';
      const sit = {}; const Z = (k, x, y, z) => { sit[k] = [x || 0, y || 0, z || 0]; };
      sit.y = floor; Z('hips', -0.05, 0, sd * 0.16); Z('hpR', -1.35, 0, -0.18); Z('hpL', -1.25, 0, 0.18); Z('knR', sd > 0 ? 0.35 : 0.9); Z('knL', sd > 0 ? 0.9 : 0.35); Z('anR', 0.35); Z('anL', 0.35);
      Z('spine', -0.3); Z('chest', -0.12, -sd * 0.3, 0); Z('neck', 0.15, sd * 0.6, 0);
      if (post === 'both') { Z('shR', 0.95, 0, -0.35); Z('shL', 0.95, 0, 0.35); Z('elR', -0.15); Z('elL', -0.15); Z('wrR', 1.0); Z('wrL', 1.0); }
      else { const so = post === 'R' ? -1 : 1; Z('sh' + post, 1.0, 0, so * 0.4); Z('el' + post, -0.12); Z('wr' + post, 1.0); Z('sh' + other, -0.65, 0, -so * 0.25); Z('el' + other, -1.0); Z('wr' + other, 0.2); }
      sit.rate = 22;
      // falling: the knees give first, the body goes down and back, the arms reach for the floor
      const drop = {}; for (const k in sit) drop[k] = Array.isArray(sit[k]) ? sit[k].map(v => v * f) : sit[k];
      drop.y = floor * f * f + (-0.12 * Math.sin(Math.PI * clamp(t / fT, 0, 1))); drop.knR = [1.3 * Math.sin(Math.PI * clamp(t / fT, 0, 1)) + sit.knR[0] * f]; drop.knL = [1.3 * Math.sin(Math.PI * clamp(t / fT, 0, 1)) + sit.knL[0] * f];
      // getting up: roll forward onto the feet into a crouch, then stand
      const crouch = { y: -0.38, rate: 22, hips: [0.2, 0, 0], hpR: [-1.3, 0, -0.1], hpL: [-1.3, 0, 0.1], knR: [1.9], knL: [1.9], anR: [-0.6], anL: [-0.6], spine: [0.45], chest: [0.15], neck: [-0.4], shR: [-0.6, 0, -0.2], shL: [-0.6, 0, 0.2], elR: [-0.8], elL: [-0.8] };
      for (const Q of [drop, crouch]) for (const k in Q) if (Array.isArray(Q[k])) Q[k] = [Q[k][0] || 0, Q[k][1] || 0, Q[k][2] || 0];
      const P0 = t < fT ? drop : sit, P1 = g < 0.5 ? blendPose(P0, crouch, g * 2) : blendPose(crouch, poseOf('idle', t, {}), (g - 0.5) * 2);
      for (const k in P1) p[k] = P1[k]; p.rate = 22; break;
    }
    case 'celeb': {
      const s = Math.sin(t * 9);
      switch (o.style) {
        case 'salute': S_('shR', -0.7, 0, -1.25); S_('elR', -2.3); S_('wrR', 0.2); S_('shL', 0.05, 0, 0.08); S_('spine', -0.05); S_('chest', -0.08); S_('neck', -0.05); break;
        case 'count': S_('shR', -1.0, 0, 0.3); S_('elR', -1.4 + s * 0.3); S_('wrR', s * 0.8); S_('shL', -1.0, 0, -0.3); S_('elL', -1.4 - s * 0.3); S_('wrL', -s * 0.8); S_('chest', -0.1); S_('neck', 0.25); break;
        case 'eagle': S_('shR', 0, 0, -1.4 + s * 0.5); S_('shL', 0, 0, 1.4 - s * 0.5); S_('wrR', s * 0.5); S_('wrL', s * 0.5); S_('hpL', -1.2); S_('knL', 1.6); S_('chest', -0.2); S_('neck', -0.3); p.y = 0.03 * s; break;
        default: S_('shR', -0.2, 0, -1.55); S_('elR', -2.2 + s * 0.15); S_('wrR', -0.6); S_('shL', -0.2, 0, 1.55); S_('elL', -2.2 - s * 0.15); S_('wrL', -0.6); S_('spine', -0.08); S_('chest', -0.15); S_('neck', -0.3);
      }
      break;
    }
    case 'sulk': armsDown(); S_('spine', 0.12); S_('chest', 0.18); S_('neck', 0.55); S_('shR', 0.1, 0, -0.05); S_('shL', 0.1, 0, 0.05); S_('hpR', 0, 0, -0.05); break;
    case 'cheer': { const s = Math.sin(t * 8 + (o.ph || 0)); S_('shR', -2.7, 0, -0.3 + s * 0.2); S_('shL', -2.7, 0, 0.3 - s * 0.2); S_('elR', -0.5); S_('elL', -0.5); S_('wrR', s * 0.6); S_('wrL', -s * 0.6); S_('chest', -0.1); S_('neck', -0.2); p.y = 0.04 * Math.max(0, s); S_('anR', Math.max(0, s) * 0.6); S_('anL', Math.max(0, s) * 0.6); break; }
    case 'beg': { const s = Math.sin(t * 3 + (o.ph || 0)); S_('shR', -1.1, 0, 0.1); S_('elR', -0.9 + s * 0.15); S_('wrR', 1.0); S_('shL', 0.1, 0, 0.15); S_('spine', 0.2); S_('chest', 0.15); S_('neck', -0.05 + s * 0.05); p.y = -0.05; legs(-0.25, 0.3, -0.25, 0.3); break; }
    case 'dance': { const b = t * 5.7 + (o.ph || 0), s = Math.sin(b), c = Math.cos(b), s2 = Math.sin(b * 2); p.y = -0.07 + 0.05 * Math.abs(s2); S_('hips', 0, s * 0.35, s * 0.14); S_('spine', 0.05, -s * 0.15, -s * 0.06); S_('chest', 0.06, -s * 0.3, -s * 0.1); S_('neck', 0.1 * s2, s * 0.25, 0);
      S_('shR', -1.2 - c * 0.9, 0, -0.5 + s * 0.3); S_('elR', -1.3 + s * 0.5); S_('wrR', s2 * 0.6); S_('shL', -1.2 + c * 0.9, 0, 0.5 + s * 0.3); S_('elL', -1.3 - s * 0.5); S_('wrL', -s2 * 0.6);
      S_('hpR', -0.25 - Math.max(0, s) * 0.5, 0, -0.15); S_('knR', 0.4 + Math.max(0, s) * 0.8); S_('anR', Math.max(0, s) * 0.5); S_('hpL', -0.25 - Math.max(0, -s) * 0.5, 0, 0.15); S_('knL', 0.4 + Math.max(0, -s) * 0.8); S_('anL', Math.max(0, -s) * 0.5); p.rate = 20; break; }
    case 'warm': { const s = Math.sin(t * 2 + (o.ph || 0)); S_('shR', -1.25, 0, 0.15); S_('shL', -1.25, 0, -0.15); S_('elR', -0.5 + s * 0.08); S_('elL', -0.5 - s * 0.08); S_('wrR', 0.9); S_('wrL', 0.9); S_('spine', 0.1); S_('chest', 0.1); p.y = -0.03; legs(-0.15, 0.2, -0.15, 0.2); break; }
    case 'loco': {
      // walking around: one motion that blends walk → jog → sprint by real speed (o.v, m/s); legs come from the IK layer.
      // o.swag (0..1) turns the walk into a street walk: laid back with a slight constant side lean, shoulders that roll,
      // a head that leads and nods on the beat, loose arms that drag (shoulder → elbow → wrist), low bounce, hips that drop
      const v = o.v || 0, k = clamp((v - 1.4) / 4.6, 0, 1), still = clamp(v / 1.0, 0, 1), ph = o.ph || 0, s = Math.sin(ph), c = Math.cos(ph);
      const sw = (o.swag || 0) * (1 - clamp((v - 2.6) / 1.6, 0, 1)) * still;            // swag fades out as he breaks into a run
      const amp = (0.32 + 0.7 * k) * still * (1 - 0.35 * sw), lag1 = Math.sin(ph - 0.45 * sw), lag2 = Math.sin(ph - 0.9 * sw);
      const armR = 1 + 0.25 * sw, armL = 1 - 0.4 * sw;                                    // one arm swings, the other mostly hangs
      S_('shR', s * amp * armR, 0, -(0.07 + 0.06 * k) - 0.12 * sw); S_('shL', -s * amp * armL, 0, 0.07 + 0.06 * k + 0.1 * sw);
      S_('elR', -(0.18 + 1.25 * k) - 0.2 * sw - Math.max(0, -lag1) * (0.15 + 0.3 * k + 0.25 * sw) * still); S_('elL', -(0.18 + 1.25 * k) - 0.3 * sw - Math.max(0, lag1) * (0.15 + 0.3 * k) * still);
      S_('wrR', -0.12 - 0.15 * k - 0.25 * sw + lag2 * 0.3 * sw, 0, 0); S_('wrL', -0.12 - 0.15 * k - 0.35 * sw);
      const lean = (0.03 + 0.24 * k) * still - 0.09 * sw, tw = s * (0.1 + 0.12 * k + 0.12 * sw) * still, nod = Math.max(0, Math.cos(2 * ph)) * 0.07 * sw;
      S_('hips', 0, -tw * (0.7 + 0.4 * sw), s * 0.07 * sw);                              // hips turn more and drop on the swinging side
      S_('spine', lean * 0.6, 0, -0.035 * sw);                                            // a little back, a little to one side, the whole time
      S_('chest', lean * 0.4, tw, -s * 0.06 * sw);                                        // shoulders roll with the step
      S_('neck', -lean * 0.9 - 0.06 * sw + nod, -tw * 0.8, 0.03 * sw); S_('head', -0.02 - 0.05 * sw);
      p.y = (-0.012 - 0.03 * k + (0.028 * (1 - 0.6 * sw)) * Math.abs(c) * (0.5 + 0.5 * k)) * still;
      S_('hpR', -s * 0.5 * still); S_('hpL', s * 0.5 * still); S_('knR', 0.2 + 0.6 * Math.max(0, -c) * still); S_('knL', 0.2 + 0.6 * Math.max(0, c) * still);
      p.rate = 14; break;
    }
    case 'gait': walkPose(p, o); break;
    case 'sprint': runPose(p, o); break;
    case 'sit': p.y = -0.42 * (o.leg || 1); S_('hpR', -1.5, 0, -0.1); S_('hpL', -1.5, 0, 0.1); S_('knR', 1.5); S_('knL', 1.5); S_('shR', -0.4); S_('shL', -0.4); S_('elR', -0.9); S_('elL', -0.9); S_('spine', 0.05); S_('chest', 0.06); break;
  }
  // layered on top of every pose: eyes on the ball, lean into the turn
  if (o.look) { const n = p.neck || (p.neck = [0, 0, 0]); n[1] += clamp(o.look, -1.1, 1.1) * 0.7; const c = p.chest || (p.chest = [0, 0, 0]); c[1] += clamp(o.look, -1.1, 1.1) * 0.2; }
  if (o.bank) { const h = p.hips || (p.hips = [0, 0, 0]); h[2] += clamp(o.bank, -0.35, 0.35); }
  // lean into acceleration and braking; hips turn toward where the body is going while the shoulders stay square
  if (o.leanF) { const sp = p.spine || (p.spine = [0, 0, 0]); sp[0] += o.leanF; }
  if (o.hipYaw) { const h = p.hips || (p.hips = [0, 0, 0]); h[1] += o.hipYaw; const c = p.chest || (p.chest = [0, 0, 0]); c[1] -= o.hipYaw * 0.8; }
  if (o.bump) { const c = p.chest || (p.chest = [0, 0, 0]); c[0] += o.bump[0]; c[2] += o.bump[1]; }
  // a contested or moving shot fades back / drifts; a pass on its way in gets the hands up whatever the feet are doing
  if (o.fade) { const c = p.chest || (p.chest = [0, 0, 0]); c[0] -= o.fade * 0.35; const sp = p.spine || (p.spine = [0, 0, 0]); sp[0] -= o.fade * 0.15; }
  if (o.drift) { const h = p.hips || (p.hips = [0, 0, 0]); h[2] += clamp(o.drift, -0.3, 0.3); }
  if (o.catchArms) { p.shR = [-1.25, 0, 0.2]; p.shL = [-1.25, 0, -0.2]; p.elR = [-1.15, 0, 0]; p.elL = [-1.15, 0, 0]; p.wrR = [0.5, 0, 0]; p.wrL = [0.5, 0, 0]; p.rate = Math.max(p.rate, 20); }
  return p;
}
function R_fallY(o) { return (o.leg || 0.95) * 0.82; }
function applyPose(R, p, dt) {
  const k = 1 - Math.exp(-(p.rate || 16) * dt), J = R.joints, C = R.cur;
  for (const n in J) {
    const tg = p[n] || POSE.zero, c = C[n];
    c[0] += (tg[0] - c[0]) * k; c[1] += (tg[1] - c[1]) * k; c[2] += (tg[2] - c[2]) * k;
    J[n].rotation.set(c[0], c[1], c[2]);
  }
  R.yOff += ((p.y || 0) - R.yOff) * k; J.hips.position.y = R.legLen + R.yOff;
  if (R.cape) R.cape.rotation.x = 0.12 + (R.capeSwing || 0);
  if (R.wings) { const f = Math.sin(performance.now() / 180) * 0.25; R.wings[0].rotation.y = -0.5 - f; R.wings[1].rotation.y = 0.5 + f; }
}
POSE.zero = [0, 0, 0];

// random streetballer for AI / hub NPCs
function randomWorn(tier, ragged) {
  const pool = s => DRIP.filter(d => d.slot === s && d.r <= tier && d.kind !== 'eagle');
  const w = {}; for (const [s] of SLOTS) { const p = pool(s); w[s] = p.length ? pick(p).id : null; }
  if (ragged) { w.top = 't_tank'; w.bottom = 'b_camo'; w.shoes = 'k_beat'; w.head = RNG() < 0.3 ? 'hd_crown' : 'hd_none'; w.back = 'bk_none'; w.arm = 'a_none'; }
  return w;
}
function aiBuild(ovr, role) {
  const styles = ['sniper', 'slasher', 'general', 'lockdown', 'glass', 'showman'];
  const style = role || pick(styles);
  const hBase = { sniper: 77, slasher: 78, general: 74, lockdown: 78, glass: 83, showman: 76 }[style];
  const build = { style, origin: 'rustbelt', body: { h: clamp(Math.round(hBase + rnd(-2, 2)), H_MIN, H_MAX), w: style === 'glass' ? rnd(0.2, 0.9) : rnd(-0.6, 0.3), s: rnd(-0.3, 0.8) }, skin: Math.floor(RNG() * SKINS.length) };
  const caps = capsFor(build), attrs = {};
  for (const a of ATTRS) attrs[a.id] = clamp(Math.round(caps[a.id] * (0.52 + (ovr - 55) / 45 * 0.48) + rnd(-3, 3)), 30, 99);
  const badges = {}; const bt = ovr > 88 ? 3 : ovr > 78 ? 2 : ovr > 66 ? 1 : 0;
  if (bt) for (const b of BADGES) if (attrs[b.req[0]] >= b.req[bt] - 6 && RNG() < 0.6) badges[b.id] = bt;
  const mv = { side: pick(MOVES.filter(m => m.slot === 'side' && m.need <= attrs.handle)).id, back: 'stepback', diag: 'spin', jumper: pick(JUMPERS).id, dunk: pick(DUNKS.filter(d => d.need <= attrs.dunk)).id, celeb: pick(CELEBS).id };
  return { name: pick(NPC_NAMES), build, attrs, badges, worn: randomWorn(ovr > 85 ? 3 : ovr > 72 ? 2 : ovr > 62 ? 1 : 0), moves: mv };
}

// ---- the ball ----
function makeBall(id) {
  const d = DRIPS[id] || DRIPS.bl_std;
  const tex = canvasTex(256, 128, (x, W, H) => {
    x.fillStyle = d.c; x.fillRect(0, 0, W, H); x.strokeStyle = d.c2; x.lineWidth = 5;
    x.beginPath(); x.moveTo(0, H / 2); x.lineTo(W, H / 2); x.stroke();
    for (const u of [0, 0.5, 1]) { x.beginPath(); x.moveTo(W * u, 0); x.lineTo(W * u, H); x.stroke(); }
    for (const u of [0.25, 0.75]) { x.beginPath(); x.ellipse(W * u, H / 2, W * 0.13, H * 0.5, 0, 0, 6.3); x.stroke(); }
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 10), new THREE.MeshToonMaterial({ map: tex, gradientMap: ramp() }));
  ink(m, 1.1); return m;
}

// ---- set pieces ----
function hoopMesh(tier, style) {
  // rim centre is at local (0,3.05,0); backboard sits behind it at z=-0.38
  const g = new THREE.Group(), neon = style === 'arcade';
  const poleC = toon(neon ? '#2a1a4a' : '#3a3f4a');
  ink(M(cyl(0.09, 0.11, 3.6, 8), poleC, 0, 1.8, -1.9, g), 1.15);
  const armM = M(box(0.12, 0.12, 1.5), poleC, 0, 3.45, -1.15, g); ink(armM, 1.1);
  if (tier === 0) {   // milk crate
    ink(M(box(0.9, 0.7, 0.06), toon('#7a5a3a'), 0, 3.4, -0.4, g), 1.05);
    const cr = M(cyl(0.26, 0.2, 0.3, 4, true), new THREE.MeshToonMaterial({ color: '#e04848', gradientMap: ramp(), side: THREE.DoubleSide, wireframe: false }), 0, 2.95, 0, g); cr.rotation.y = Math.PI / 4;
  } else {
    const glass = tier >= 2;
    const bb = M(box(1.8, 1.08, 0.05), glass ? flat(neon ? 0x66ffff : 0xcfe8ff, { transparent: true, opacity: 0.35 }) : toon('#e8e8e8'), 0, 3.5, -0.4, g);
    const fr = M(box(1.86, 1.14, 0.04), toon(neon ? '#ff4fd8' : '#20242c', neon ? '#ff4fd8' : null), 0, 3.5, -0.43, g); ink(fr, 1.03);
    M(box(0.62, 0.05, 0.02), flat(neon ? 0xff4fd8 : 0xff5a1f), 0, 3.52, -0.365, g); M(box(0.62, 0.05, 0.02), flat(neon ? 0xff4fd8 : 0xff5a1f), 0, 3.08, -0.365, g);
    for (const sx of [-1, 1]) M(box(0.05, 0.49, 0.02), flat(neon ? 0xff4fd8 : 0xff5a1f), sx * 0.31, 3.3, -0.365, g);
    void bb;
  }
  const rimC = tier >= 3 || neon ? flat(0x66ffff) : toon('#ff5a1f');
  const rim = M(geo('rim', () => new THREE.TorusGeometry(0.235, 0.022, 6, 20)), rimC, 0, 3.05, 0, g); rim.rotation.x = Math.PI / 2;
  M(box(0.1, 0.03, 0.18), toon('#ff5a1f'), 0, 3.04, -0.31, g);
  if (tier > 0) { const net = M(geo('net', () => new THREE.CylinderGeometry(0.23, 0.14, 0.42, 12, 3, true)), new THREE.MeshBasicMaterial({ color: tier === 1 && !neon ? 0xb0b6c0 : 0xffffff, wireframe: true }), 0, 2.84, 0, g); g.userData.net = net; }
  return g;
}
function courtTex(style) {
  // canvas covers x -9..9 (18m), z -3..15 (18m)
  return canvasTex(1024, 1024, (x, W) => {
    const s = W / 18, X = v => (v + 9) * s, Z = v => (v + 3) * s;
    const P = { street: ['#3b4252', '#333a48', '#f2c230', '#c8482c'], arcade: ['#1a1030', '#140a26', '#33e0ff', '#ff4fd8'], drive: ['#6a6a66', '#5c5c58', '#d8d8d0', '#888880'], black: ['#2a2d34', '#25282e', '#f4f4f4', '#3a6ea8'], show: ['#2a5a8a', '#244e78', '#ffffff', '#e0452c'], wood: ['#c8915a', '#b9834e', '#ffffff', '#33e0ff'] }[style] || [];
    x.fillStyle = P[1]; x.fillRect(0, 0, W, W); x.fillStyle = P[0]; x.fillRect(X(-8), Z(-1.6), 16 * s, 14.6 * s);
    if (style === 'wood') { x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 1; for (let i = 0; i < 60; i++) { x.beginPath(); x.moveTo(X(-8), Z(-1.6) + i * 14.6 * s / 60); x.lineTo(X(8), Z(-1.6) + i * 14.6 * s / 60); x.stroke(); } }
    if (style === 'street' || style === 'drive' || style === 'black') { x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; for (let i = 0; i < (style === 'drive' ? 16 : 7); i++) { let px = rnd(0, W), pz = rnd(0, W); x.beginPath(); x.moveTo(px, pz); for (let j = 0; j < 6; j++) { px += rnd(-50, 50); pz += rnd(-50, 50); x.lineTo(px, pz); } x.stroke(); } }
    x.fillStyle = P[3]; x.globalAlpha = style === 'arcade' ? 0.35 : 0.85; x.fillRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s); x.globalAlpha = 1;
    if (style !== 'drive') {
      x.strokeStyle = P[2]; x.lineWidth = 7; if (style === 'arcade') { x.shadowColor = P[2]; x.shadowBlur = 16; }
      x.strokeRect(X(-8), Z(-1.6), 16 * s, 14.6 * s); x.strokeRect(X(-2.45), Z(-1.6), 4.9 * s, 7.4 * s);
      x.beginPath(); x.arc(X(0), Z(5.8), 1.8 * s, 0, 6.3); x.stroke();
      // arc: radius 6.75 around the rim, straight in the corners at x=±6.6
      const a0 = Math.acos(6.6 / 6.75);
      x.beginPath(); x.moveTo(X(6.6), Z(-1.6)); x.lineTo(X(6.6), Z(6.75 * Math.sin(a0))); x.arc(X(0), Z(0), 6.75 * s, a0, Math.PI - a0); x.lineTo(X(-6.6), Z(-1.6)); x.stroke();
      x.beginPath(); x.arc(X(0), Z(13), 1.8 * s, Math.PI, 0); x.stroke();
      x.beginPath(); x.arc(X(0), Z(0), 1.25 * s, 0, Math.PI); x.stroke();
    } else { x.strokeStyle = P[2]; x.lineWidth = 5; x.setLineDash([18, 14]); x.beginPath(); x.arc(X(0), Z(0), 6.75 * s, 0.2, Math.PI - 0.2); x.stroke(); x.setLineDash([]); }
    x.shadowBlur = 0; x.fillStyle = style === 'arcade' ? 'rgba(255,79,216,.5)' : 'rgba(255,255,255,.16)'; x.font = '900 expanded 84px Archivo, Impact, sans-serif'; x.textAlign = 'center';
    x.save(); x.translate(X(0), Z(10.2)); x.fillText(style === 'arcade' ? 'JAM' : style === 'street' ? BRAND.name : 'HOME', 0, 0); x.restore();
  });
}
function addCourt(sc, style, hoopTier) {
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), style === 'arcade' ? new THREE.MeshBasicMaterial({ map: courtTex(style) }) : new THREE.MeshToonMaterial({ map: courtTex(style), gradientMap: ramp() }));
  fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 6); sc.add(fl);
  const h = hoopMesh(hoopTier, style === 'arcade' ? 'arcade' : 'street'); sc.add(h); return h;
}
function fenceTex() {
  const t = canvasTex(128, 128, (x, W) => { x.clearRect(0, 0, W, W); x.strokeStyle = 'rgba(170,180,195,.85)'; x.lineWidth = 3; for (let i = -W; i < W * 2; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + W, W); x.stroke(); x.beginPath(); x.moveTo(i + W, 0); x.lineTo(i, W); x.stroke(); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function addFence(sc, x0, x1, z0, z1, h, col) {
  const mk = (w) => { const t = fenceTex(); t.repeat.set(w / 1.2, h / 1.2); return new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false, color: col || 0xffffff }); };
  const add = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mk(w)); m.position.set(x, h / 2, z); m.rotation.y = ry; sc.add(m); M(box(w, 0.08, 0.08), toon('#59606c'), x, h, z, sc).rotation.y = ry; };
  add(x1 - x0, (x0 + x1) / 2, z0, 0); add(z1 - z0, x0, (z0 + z1) / 2, Math.PI / 2); add(z1 - z0, x1, (z0 + z1) / 2, Math.PI / 2);
  for (const x of [x0, x1]) for (let z = z0; z <= z1 + 0.1; z += (z1 - z0) / 3) M(cyl(0.05, 0.05, h, 6), toon('#59606c'), x, h / 2, z, sc);
}
function skyline(sc, n, rad, pal, zMin) {
  const winTex = canvasTex(64, 128, (x, W, H) => { x.fillStyle = '#0e1020'; x.fillRect(0, 0, W, H); for (let i = 0; i < 6; i++) for (let j = 0; j < 14; j++) if (Math.random() < 0.45) { x.fillStyle = pick(pal); x.fillRect(4 + i * 10, 4 + j * 9, 6, 5); } });
  const mat = new THREE.MeshBasicMaterial({ map: winTex });
  for (let i = 0; i < n; i++) {
    const a = i / n * 6.283 + rnd(-0.1, 0.1), r = rad + rnd(0, 25), h = rnd(14, 60), w = rnd(7, 14);
    const z = Math.sin(a) * r, x = Math.cos(a) * r; if (zMin !== undefined && z > zMin) continue;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat); m.position.set(x, h / 2 - 1, z); sc.add(m);
  }
}
function billboard(sc, text, x, y, z, ry, w, h, fg) {
  const s = sign(text, w, h, fg || pick(['#ff4fd8', '#33e0ff', '#ffc531', '#33ff88', '#ff5a3c']), '#0a0a14'); s.position.set(x, y, z); s.rotation.y = ry; sc.add(s);
  const back = M(box(w + 0.3, h + 0.3, 0.2), toon('#20242c'), x, y, z, sc); back.rotation.y = ry; back.translateZ(-0.12);
  const post = M(cyl(0.12, 0.12, y, 6), toon('#20242c'), x, y / 2 - h / 2, z, sc); post.translateZ(-0.2); return s;
}
// brick and concrete for the block: one tinted, tiling texture each
let _brick = null;
function brickMat(col, w, h) {
  if (!_brick) _brick = canvasTex(256, 256, (x, S_) => {
    x.fillStyle = '#b9b9b9'; x.fillRect(0, 0, S_, S_);
    for (let r = 0; r < 16; r++) for (let c = -1; c < 8; c++) { const v = 150 + Math.floor(Math.random() * 90); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(c * 32 + (r % 2 ? 16 : 0) + 1, r * 16 + 1, 30, 14); }
  });
  const t = _brick.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 4, h / 4);
  return new THREE.MeshToonMaterial({ map: t, color: col, gradientMap: ramp() });
}
// wheat-pasted brand posters
function poster(sc, x, y, z, ry, inv) {
  const tex = geoTex('poster' + (inv ? 1 : 0), () => canvasTex(256, 360, (c, W, H) => {
    c.fillStyle = inv ? '#08080a' : '#ece9e2'; c.fillRect(0, 0, W, H); c.fillStyle = inv ? '#ece9e2' : '#08080a';
    c.save(); c.transform(1, 0, -0.12, 1, 20, 0); c.font = '900 expanded 62px Archivo, Impact, sans-serif'; c.fillText(BRAND.a, 14, 210); c.fillStyle = '#ff2d78'; c.fillText(BRAND.b, 14, 268); c.restore();
    c.fillStyle = inv ? '#ece9e2' : '#08080a'; c.font = '500 13px "JetBrains Mono", monospace'; c.fillText('HALF COURT // WINNERS STAY', 16, 320); c.fillText('RUN ' + String(BRAND.season.no).padStart(2, '0'), 16, 34); c.fillRect(16, 44, 224, 3);
  }));
  const m = new THREE.Mesh(geo('posterG', () => new THREE.PlaneGeometry(1.5, 2.1)), flat(0xffffff, { map: tex })); m.position.set(x, y, z); m.rotation.y = ry; m.rotation.z = rnd(-0.03, 0.03); sc.add(m);
}
const _texCache = {};
function geoTex(k, f) { return _texCache[k] || (_texCache[k] = f()); }
// =====================================================================
//  LOCOMOTION LAYER — feet are planted on the court in world space and step when the body has moved on;
//  each leg is then solved with two-bone IK to reach its foot. The pose layer still drives everything above
//  the hips (and the legs whenever the player is in the air).
// =====================================================================
const _g1 = new THREE.Vector3(), _g2 = new THREE.Vector3();
function gaitFoot() { return { p: new THREE.Vector3(), a: new THREE.Vector3(), sw: false, t: 0, T: 0.2, lift: 0 }; }
// c: { x, z, yaw, vx, vz, grounded, wide 0..1, want 0..1, dt }
function gaitStep(R, c) {
  const G = R.gait || (R.gait = { w: 0, ph: 0, drop: 0, land: 0, air: true, ft: { R: gaitFoot(), L: gaitFoot() }, steps: 0 });
  const dt = c.dt, v = Math.hypot(c.vx, c.vz), vn = clamp(v / 7, 0, 1);
  G.w += ((c.grounded ? c.want : 0) - G.w) * (1 - Math.exp(-16 * dt));
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), wide = c.wide || 0;
  const home = (s, out) => { const lx = (s === 'R' ? -1 : 1) * (R.hipW + 0.045 + 0.15 * wide + 0.035 * (G.sw || 0)); return out.set(c.x + lx * cy, 0, c.z - lx * sy); };
  if (!c.grounded) {                       // airborne: the pose owns the legs; remember where the feet are for the landing
    G.air = true; for (const s of ['R', 'L']) { const f = G.ft[s]; R.joints['an' + s].getWorldPosition(f.p); f.lift = Math.max(0, f.p.y - 0.04); f.p.y = 0; f.sw = false; }   /* the fading IK aims where the pose has the foot, not at the floor */
  } else {
    if (G.air) { G.air = false; G.land = 0.17; G.ft.R.lift = G.ft.L.lift = 0; }
    // a wide, low stance (defense) takes short quick steps instead of long strides
    // stride grows with speed; a foot lands a reachable distance ahead (never further than the leg can reach), and
    // the swing takes as long as a real one (~0.3 s), so a sprint gets a short flight phase instead of frantic steps
    const q = c.quick || 0, reach = (0.42 + 0.2 * q) * (R.thigh + R.shin); G.maxDrop = q ? 0.09 : 0.22;       /* an explosive move: quicker, longer steps, and no sitting down to reach */
    const sw = (c.swag || 0) * (1 - clamp((v - 2.6) / 1.6, 0, 1));    // the street walk: fewer, longer, lower, softer steps
    const thr = Math.min(0.85 * (R.thigh + R.shin), 0.08 + 0.12 * v * (1 - 0.55 * wide) + 0.08 * sw * Math.min(1, v)), T = clamp(0.36 - 0.013 * v, 0.24, 0.36) * (1 - 0.35 * wide) * (1 + 0.3 * sw) * (1 - 0.42 * q), lead = Math.min(T * 0.55, reach / Math.max(v, 0.01));
    G.sw = sw;
    for (const s of ['R', 'L']) {
      const f = G.ft[s], o = G.ft[s === 'R' ? 'L' : 'R']; home(s, _g1);
      if (f.sw) {
        f.t += dt; const u = Math.min(1, f.t / f.T), rem = f.T * (1 - u) + lead;
        _g2.set(_g1.x + c.vx * rem, 0, _g1.z + c.vz * rem);
        const e = u * u * u * (u * (u * 6 - 15) + 10); f.p.set(lerp(f.a.x, _g2.x, e), 0, lerp(f.a.z, _g2.z, e)); f.lift = Math.sin(Math.PI * Math.pow(u, 0.8)) * (0.045 + 0.1 * vn) * (1 - 0.55 * (G.sw || 0));   /* glide the foot down, don't drop it */
        if (u >= 1) { f.sw = false; f.lift = 0; G.steps++; }
      } else {
        const ex = _g1.x + c.vx * lead - f.p.x, ez = _g1.z + c.vz * lead - f.p.z, err = Math.hypot(ex, ez);
        if (err > 1.8) f.p.copy(_g1);
        else if ((err > thr || f.over > 0.015) && (!o.sw || o.t > o.T * 0.6 || err > thr * 1.8 || f.over > 0.06)) { f.sw = true; f.off = true; f.t = 0; f.T = T; f.a.copy(f.p); f.over = 0; }     // also step when the leg can no longer reach it
      }
    }
  }
  // a continuous phase for the arms and trunk (right foot swinging = 0..π, left = π..2π). It runs at the measured
  // step rate and is nudged toward the swinging foot, so the arms never freeze while both feet are down
  const fr = G.ft.R, fl = G.ft.L; G.clock = (G.clock || 0) + dt;
  for (const s of ['R', 'L']) { const f = G.ft[s]; if (f.off) { f.off = false; if (G.lastOff) G.rate = lerp(G.rate || 0, Math.PI / clamp(G.clock - G.lastOff, 0.12, 0.8), 0.5); G.lastOff = G.clock; } }
  if (v < 0.25 && !fr.sw && !fl.sw) G.rate = (G.rate || 0) * Math.exp(-4 * dt);
  G.ph = (G.ph || 0) + (G.rate || 0) * dt;
  const want = fr.sw ? Math.PI * fr.t / fr.T : fl.sw ? Math.PI + Math.PI * fl.t / fl.T : null;
  if (want !== null) { let e = want - G.ph; e = Math.atan2(Math.sin(e), Math.cos(e)); G.ph += e * Math.min(1, 10 * dt); }
  if (G.land > 0) G.land -= dt;
  return G;
}
// solve both legs to their feet; blend with the pose by the gait weight; drop the hips when a foot is out of reach
function legIK(R, dt) {
  const G = R.gait; if (!G || G.w < 0.01) return;
  const J = R.joints, hips = J.hips, L1 = R.thigh - 0.03, L2 = R.shin - 0.05, maxL = (L1 + L2) * 0.995, w = G.w;
  // pass 1: how far is the farther foot out of reach? Lower the hips first (at once going down, eased coming up),
  // so the legs never have to stretch past what they can reach and the planted foot stays put
  R.root.updateMatrixWorld(true); let need = 0;
  for (const s of ['R', 'L']) { const f = G.ft[s]; _g1.set(f.p.x, 0.04 + f.lift, f.p.z); hips.worldToLocal(_g1); _g1.sub(J['hp' + s].position); need = Math.max(need, _g1.length() - maxL); }
  const tgt = clamp(need + 0.008, 0, G.maxDrop || 0.22); G.drop += (tgt - G.drop) * (1 - Math.exp(-(tgt > G.drop ? (G.sw ? 18 : 60) : 10) * dt));
  const landDip = G.land > 0 ? Math.sin(Math.PI * (1 - G.land / 0.17)) * 0.075 : 0;        // soak up the landing
  hips.position.y -= (G.drop + landDip) * w; hips.updateMatrixWorld(true);
  // pass 2: two-bone IK for each leg, blended with the pose by the gait weight
  for (const s of ['R', 'L']) {
    const f = G.ft[s], hp = J['hp' + s];
    _g1.set(f.p.x, 0.04 + f.lift, f.p.z); hips.worldToLocal(_g1); _g1.sub(hp.position);
    const D0 = Math.max(0.05, _g1.length()); f.over = D0 - maxL;
    const D = Math.min(D0, maxL);
    const k = Math.PI - Math.acos(clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1));
    // exact for the rig's Euler order (X·Y·Z): the bent leg lies in the hip's YZ plane, is rolled by Z, then pitched by X
    const A = L1 + L2 * Math.cos(k), hz = Math.asin(clamp(_g1.x / A, -1, 1)), y0 = -A * Math.cos(hz), z0 = -L2 * Math.sin(k);
    let hx = Math.atan2(_g1.z, _g1.y) - Math.atan2(z0, y0);
    const h = hp.rotation;
    // the difference of two angles can land a full turn away (5.77 instead of -0.51): blended with the pose that swings the
    // leg the long way round, a backward kick through the floor while the IK fades out on take-off. Keep it the near way.
    while (hx - h.x > Math.PI) hx -= 6.283185307; while (hx - h.x < -Math.PI) hx += 6.283185307;
    const kn = J['kn' + s].rotation, an = J['an' + s].rotation;
    h.x = lerp(h.x, hx, w); h.y = lerp(h.y, 0, w); h.z = lerp(h.z, hz, w); kn.x = lerp(kn.x, k, w); kn.y = lerp(kn.y, 0, w); kn.z = lerp(kn.z, 0, w);
    const toe = f.sw ? 0.35 * Math.sin(Math.PI * Math.min(1, f.t / f.T)) : 0;              // toe-off during the swing, flat foot when planted
    an.x = lerp(an.x, -(hips.rotation.x + hx + k) + toe * (1 - 0.5 * (G.sw || 0)), w); an.y = lerp(an.y, (s === 'R' ? -1 : 1) * 0.16 * (G.sw || 0), w);
  }
}
function disposeScene(sc) {
  if (!sc) return;
  sc.traverse(o => { if (o.isMesh) { const g = o.geometry; if (g && !Object.values(_geo).includes(g)) g.dispose(); const m = o.material; if (m && m.map && !Object.values(_mats).includes(m) && !Object.values(_texCache).includes(m.map)) { if (m.map.source !== (_brick && _brick.source)) m.map.dispose(); m.dispose(); } } });
}
