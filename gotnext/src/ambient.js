// GOT NEXT — ambient life for every place: light glow and beams, steam and smoke, pigeons, litter in the wind,
// searchlights and a blimp, the day's weather, and people talking. One AMB per scene; ambInit() when a scene is built.
'use strict';
const AMB = { t: 0 };
const WEATHERS = [['clear', 'Clear'], ['clear', 'Clear'], ['drizzle', 'Drizzle'], ['fog', 'Smog'], ['clear', 'Clear'], ['drizzle', 'Drizzle']];
let weatherOverride = null;
function todayWeather() { return weatherOverride || WEATHERS[dayHash(dayKey(), 13) % WEATHERS.length][0]; }
function ambInit() {
  Object.assign(AMB, { t: 0, parts: [], emit: [], birds: [], papers: [], flick: [], spin: [], blimp: null, rain: null, splash: [], talk: null, talkT: 2, lines: null, npcs: null, motes: [] });
  for (const b of document.querySelectorAll('.bub')) b.remove(); AMB.bubs = [];
}
// a soft round light: additive, so overlapping glows add up like real light
function glowTex() { return geoTex('glow', () => canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); })); }
const _glowMats = {};
function glow(x, y, z, col, size, parent, op) {
  const k = col + ':' + (op || 0.8); const m = _glowMats[k] || (_glowMats[k] = new THREE.SpriteMaterial({ map: glowTex(), color: col, transparent: true, opacity: op || 0.8, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  const s = new THREE.Sprite(m); s.position.set(x, y, z); s.scale.setScalar(size || 1.5); (parent || scene).add(s); return s;
}
// light pooled on the wet ground: neon and lamps reflected in the street
function pool(x, z, col, w, d, op, ry) {
  const m = new THREE.Mesh(geo('pool', () => new THREE.PlaneGeometry(1, 1)), new THREE.MeshBasicMaterial({ map: glowTex(), color: col, transparent: true, opacity: op || 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = ry || 0; m.position.set(x, 0.035, z); m.scale.set(w, d, 1); scene.add(m); return m;
}
// a beam of light from (x,y,z) toward a point, with dust hanging in it
function beam(x, y, z, tx, ty, tz, col, r, op, dust) {
  const len = Math.hypot(tx - x, ty - y, tz - z), g = new THREE.CylinderGeometry(0.12, r, len, 18, 1, true); g.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op || 0.06, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }));
  m.position.set(x, y, z); m.lookAt(tx, ty, tz); m.rotateX(-Math.PI / 2); scene.add(m);
  if (dust) for (let i = 0; i < dust; i++) { const u = Math.random(), s = glow(lerp(x, tx, u) + rnd(-1, 1) * r * u * 0.6, lerp(y, ty, u) + rnd(-0.5, 0.5), lerp(z, tz, u) + rnd(-1, 1) * r * u * 0.6, 0xfff2c8, 0.08, null, 0.6); AMB.motes.push({ s, x: s.position.x, y: s.position.y, z: s.position.z, ph: rnd(0, 6) }); }
  return m;
}
// emitters: steam (vents, food carts), smoke (fires, grills), sparks
function emitter(kind, x, y, z, rate) { AMB.emit.push({ kind, x, y, z, rate: rate || 4, acc: 0 }); }
function _part(kind, x, y, z) {
  let p = AMB.parts.find(q => q.life <= 0);
  if (!p) { if (AMB.parts.length > 90) return; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), transparent: true, depthWrite: false, fog: true })); scene.add(s); p = { s }; AMB.parts.push(p); }
  const smoke = kind === 'smoke', spark = kind === 'spark';
  p.kind = kind; p.life = p.max = spark ? rnd(0.5, 0.9) : rnd(1.8, 3.2); p.x = x + rnd(-0.15, 0.15); p.y = y; p.z = z + rnd(-0.15, 0.15);
  p.vx = rnd(-0.15, 0.15) + (spark ? rnd(-0.6, 0.6) : 0.25); p.vy = spark ? rnd(1.5, 3) : rnd(0.5, 0.9); p.vz = rnd(-0.15, 0.15) + (spark ? rnd(-0.6, 0.6) : 0);
  p.s.material.color.setHex(spark ? 0xffb050 : smoke ? 0x2a2a30 : 0xd8dce8); p.s.material.blending = spark ? THREE.AdditiveBlending : THREE.NormalBlending; p.s0 = spark ? 0.08 : smoke ? 0.5 : 0.6; p.op = spark ? 1 : smoke ? 0.6 : 0.5; if (!spark) p.s0 *= 1.4;
}
// pigeons: peck around a spot, burst up and away when someone walks close, come back later
function pigeons(x, z, n) {
  const body = toon('#8a8f9c'), wing = toon('#6a707c');
  for (let i = 0; i < n; i++) {
    const g = grp(scene, x + rnd(-1.2, 1.2), 0, z + rnd(-1.2, 1.2)); ink(M(sph(0.09, 8, 6), body, 0, 0.1, 0, g), 1.1).scale.set(1, 0.8, 1.5); M(sph(0.05, 6, 5), toon('#4a7a6a'), 0, 0.18, 0.1, g); M(box(0.02, 0.02, 0.05), toon('#e0a040'), 0, 0.17, 0.16, g);
    const wl = M(box(0.18, 0.01, 0.1), wing, -0.09, 0.13, 0, g), wr = M(box(0.18, 0.01, 0.1), wing, 0.09, 0.13, 0, g);
    AMB.birds.push({ g, wl, wr, hx: g.position.x, hz: g.position.z, st: 'peck', t: rnd(0, 3), ph: rnd(0, 6), vx: 0, vy: 0, vz: 0 });
  }
}
// litter in the wind
function litter(n, x0, x1, z0, z1) {
  const mats = ['#ece9e2', '#f2c14e', '#d8d0c0', '#ff2d78'].map(c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  for (let i = 0; i < n; i++) { const m = M(geo('paper', () => new THREE.PlaneGeometry(0.22, 0.16)), pick(mats), rnd(x0, x1), 0.03, rnd(z0, z1), scene); AMB.papers.push({ m, x0, x1, z0, z1, ph: rnd(0, 6), v: rnd(0.4, 1.2), air: 0 }); }
}
function flicker(obj, rate) { AMB.flick.push({ obj, rate: rate || 0.3, t: rnd(0, 3), on: true }); }
// the sky: sweeping searchlights behind the skyline and a blimp selling something
function skyLife(rad, ad) {
  for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 0.9, x = Math.cos(a) * rad, z = Math.sin(a) * rad; const b = beam(x, 0, z, x, 60, z - 10, 0xbfd8ff, 3.5, 0.045); AMB.spin.push({ m: b, x, z, ph: i * 2.1, sp: 0.25 + i * 0.07 }); }
  const g = new THREE.Group(); ink(M(sph(1, 16, 10), toon('#c8d0d8'), 0, 0, 0, g), 1.03).scale.set(5.5, 1.6, 1.6);
  for (const sx of [-1, 1]) M(box(1.6, 0.06, 1.2), toon('#8a8f9c'), -4.6, 0, sx * 0.9, g).rotation.x = sx * 0.6;
  M(box(1.4, 0.5, 0.6), toon('#20242c'), 0, -1.7, 0, g); const s = sign(ad || 'BUY MORE · ASK LATER', 6, 1.2, '#ff2d78', '#0a0a14', { border: false }); s.position.set(0, 0, 1.65); g.add(s); const s2 = s.clone(); s2.position.z = -1.65; s2.rotation.y = Math.PI; g.add(s2);
  glow(-5.6, 0, 0, 0xff2d78, 1.2, g); scene.add(g); AMB.blimp = { g, r: rad * 0.8, a: rnd(0, 6), y: 26 };
}
// the day's weather: drizzle (streaks and splashes, wet ground), smog (closer, browner fog), or clear
function weather(fogCol) {
  const w = todayWeather();
  if (w === 'fog' && scene.fog) { scene.fog.near *= 0.45; scene.fog.far *= 0.5; scene.fog.color.lerp(new THREE.Color(0x4a4038), 0.5); scene.background.lerp(new THREE.Color(0x3a332c), 0.5); }
  if (w === 'drizzle') {
    const N = 700, pos = new Float32Array(N * 6); for (let i = 0; i < N; i++) { const x = rnd(-18, 18), y = rnd(0, 14), z = rnd(-18, 18); pos.set([x, y, z, x + 0.03, y - 0.45, z], i * 6); }
    const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const ln = new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0x9fb4d8, transparent: true, opacity: 0.35, depthWrite: false })); ln.frustumCulled = false; scene.add(ln); AMB.rain = { ln, N };
    for (let i = 0; i < 24; i++) { const m = M(geo('splash', () => new THREE.RingGeometry(0.05, 0.08, 12)), new THREE.MeshBasicMaterial({ color: 0xbfd0ec, transparent: true, opacity: 0, depthWrite: false }), 0, 0.02, 0, scene); m.rotation.x = -Math.PI / 2; AMB.splash.push({ m, t: rnd(0, 0.6) }); }
    if (scene.fog) { scene.fog.color.lerp(new THREE.Color(0x202838), 0.4); scene.background.lerp(new THREE.Color(0x1c2230), 0.4); }
  }
  return w;
}
// a chat bubble over someone's head (you, or a friend online)
function bubble(obj, text, dur, h, cls) {
  if (!AMB.bubs) AMB.bubs = []; for (const b of AMB.bubs.filter(b => b.obj === obj)) b.t = 0;
  const el = document.createElement('div'); el.className = 'bub ' + (cls || 'me'); el.textContent = text; document.body.appendChild(el); AMB.bubs.push({ el, obj, t: dur || 4.5, h: h || 2.35 });
}
// people talk: every few seconds somebody near you says something (a list of lines per kind of person)
function chatter(npcs, linesFor) { AMB.npcs = npcs; AMB.lines = linesFor; }
function ambientStep(dt, cam, me) {
  if (!AMB.parts) return; AMB.t += dt; const t = AMB.t;
  for (const e of AMB.emit) { e.acc += dt * e.rate; while (e.acc >= 1) { e.acc -= 1; _part(e.kind, e.x, e.y, e.z); } }
  for (const p of AMB.parts) {
    if (p.life <= 0) { p.s.visible = false; continue; } p.life -= dt; const k = 1 - p.life / p.max; p.s.visible = true;
    if (p.kind === 'spark') p.vy -= 4 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.s.position.set(p.x, p.y, p.z);
    p.s.scale.setScalar(p.s0 * (1 + k * (p.kind === 'spark' ? 0 : 2.5))); p.s.material.opacity = p.op * Math.sin(Math.PI * Math.min(1, k * 1.1));
  }
  for (const m of AMB.motes) { m.s.position.set(m.x + Math.sin(t * 0.3 + m.ph) * 0.25, m.y + Math.sin(t * 0.21 + m.ph * 2) * 0.2, m.z + Math.cos(t * 0.27 + m.ph) * 0.25); }
  for (const b of AMB.birds) {
    const d = me ? Math.hypot(me.x - b.g.position.x, me.z - b.g.position.z) : 99; b.t -= dt;
    if (b.st === 'peck') {
      b.g.rotation.x = Math.max(0, Math.sin(t * 6 + b.ph)) * 0.5; if (b.t <= 0) { b.t = rnd(0.6, 2); b.g.rotation.y = rnd(0, 6.28); b.tx = b.hx + rnd(-1, 1); b.tz = b.hz + rnd(-1, 1); }
      if (b.tx !== undefined) { b.g.position.x += (b.tx - b.g.position.x) * dt * 0.8; b.g.position.z += (b.tz - b.g.position.z) * dt * 0.8; }
      if (d < 2.6) { b.st = 'fly'; b.t = rnd(6, 11); const a = Math.atan2(b.g.position.x - me.x, b.g.position.z - me.z) + rnd(-0.6, 0.6); b.vx = Math.sin(a) * 4; b.vz = Math.cos(a) * 4; b.vy = rnd(2.5, 4); b.g.rotation.set(0, a, 0); if (typeof sfx === 'function' && d < 2.2) sfx('whoosh'); }
    } else if (b.st === 'fly') {
      const f = Math.sin(t * 28 + b.ph); b.wl.rotation.z = f * 0.9; b.wr.rotation.z = -f * 0.9; b.vy -= 0.4 * dt; b.g.position.x += b.vx * dt; b.g.position.y += Math.max(0.6, b.vy) * dt; b.g.position.z += b.vz * dt;
      if (b.t <= 0 || b.g.position.y > 18) { b.st = 'back'; b.t = rnd(4, 9); b.g.visible = false; }
    } else if (b.t <= 0 && d > 6) { b.st = 'peck'; b.g.visible = true; b.g.position.set(b.hx, 0, b.hz); b.wl.rotation.z = b.wr.rotation.z = 0; }
  }
  for (const p of AMB.papers) {
    const gust = 0.5 + 0.5 * Math.sin(t * 0.7 + p.ph) * Math.sin(t * 0.23); p.air = lerp(p.air, gust > 0.7 ? 0.5 + Math.sin(t * 3 + p.ph) * 0.3 : 0.03, dt * 2);
    p.m.position.x += p.v * gust * dt * 1.4; p.m.position.z += Math.sin(t * 0.9 + p.ph) * dt * 0.4; p.m.position.y = p.air; p.m.rotation.set(-Math.PI / 2 + Math.sin(t * 4 + p.ph) * p.air * 3, t * p.v, 0);
    if (p.m.position.x > p.x1) p.m.position.x = p.x0; if (p.m.position.z < p.z0 || p.m.position.z > p.z1) p.m.position.z = lerp(p.z0, p.z1, Math.random());
  }
  for (const f of AMB.flick) { f.t -= dt; if (f.t <= 0) { f.on = !f.on; f.t = f.on ? rnd(0.8, 6) * (1 / f.rate) * 0.3 : rnd(0.04, 0.15); f.obj.visible = f.on; } }
  for (const s of AMB.spin) { const a = Math.sin(t * s.sp + s.ph) * 0.6; s.m.rotation.set(a, 0, Math.cos(t * s.sp * 0.8 + s.ph) * 0.35); }
  if (AMB.blimp) { const b = AMB.blimp; b.a += dt * 0.02; b.g.position.set(Math.cos(b.a) * b.r, b.y + Math.sin(t * 0.3) * 0.6, Math.sin(b.a) * b.r * 0.6 - b.r * 0.4); b.g.rotation.y = -b.a + Math.PI; }
  if (AMB.rain && cam) {
    const pa = AMB.rain.ln.geometry.attributes.position, a = pa.array, cx = cam.position.x, cz = cam.position.z;
    for (let i = 0; i < AMB.rain.N; i++) { const o = i * 6; let y = a[o + 1] - dt * 15; let x = a[o], z = a[o + 2]; if (y < 0) { y += 14; x = cx + rnd(-18, 18); z = cz + rnd(-18, 18); } else { if (x - cx > 18) x -= 36; else if (cx - x > 18) x += 36; if (z - cz > 18) z -= 36; else if (cz - z > 18) z += 36; } a[o] = x; a[o + 1] = y; a[o + 2] = z; a[o + 3] = x + 0.03; a[o + 4] = y - 0.45; a[o + 5] = z; }
    pa.needsUpdate = true;
    for (const s of AMB.splash) { s.t -= dt; if (s.t <= 0) { s.t = rnd(0.3, 0.7); s.m.position.set(cx + rnd(-9, 9), 0.02, cz + rnd(-12, 2)); } const k = 1 - s.t / 0.5; s.m.scale.setScalar(0.5 + k * 2); s.m.material.opacity = Math.max(0, 0.5 * (1 - k)); }
  }
  if (AMB.bubs) AMB.bubs = AMB.bubs.filter(b => { b.t -= dt; const p = b.obj.position; _v.set(p.x, p.y + b.h, p.z).project(camera); if (b.t <= 0 || !b.obj.parent) { b.el.remove(); return false; } const [sx, sy] = project(p.x, p.y + b.h, p.z), far = me ? Math.hypot(p.x - me.x, p.z - me.z) > 11 : false; b.el.style.display = _v.z > 1 || far || sy < 30 || sx < -40 || sx > innerWidth + 40 ? 'none' : ''; b.el.style.left = clamp(sx, 118, innerWidth - 118) + 'px'; b.el.style.top = Math.max(60, sy) + 'px';      /* kept on screen; nobody is heard from across the Block */ b.el.style.opacity = b.t > 0.3 ? 1 : b.t / 0.3; return true; });
  // speech bubbles
  if (AMB.npcs && AMB.lines && me) {
    AMB.talkT -= dt;
    if (AMB.talk) { const b = AMB.talk, n = b.n; b.t -= dt; const p = n.rig.root.position, [sx, sy] = project(p.x, p.y + (n.rig.H || 1.9) + 0.45, p.z); b.el.style.left = sx + 'px'; b.el.style.top = sy + 'px'; b.el.style.opacity = b.t > 0.3 ? 1 : Math.max(0, b.t / 0.3); _v.set(p.x, p.y + 2, p.z).project(camera); if (b.t <= 0 || _v.z > 1) { b.el.remove(); AMB.talk = null; } }
    else if (AMB.talkT <= 0) {
      AMB.talkT = rnd(2.5, 5); const hush = typeof W !== 'undefined' && W && W.btLive && W.t - W.btLive < 1; const near = hush ? [] : AMB.npcs.filter(n => n.rig && Math.hypot(n.x - me.x, n.z - me.z) < 10 && Math.hypot(n.x - me.x, n.z - me.z) > 1.2);
      if (near.length) { const n = pick(near), ls = AMB.lines(n); if (ls && ls.length) { const el = document.createElement('div'); el.className = 'bub'; el.textContent = pick(ls); document.body.appendChild(el); AMB.talk = { el, n, t: 3.2 }; } }
    }
  }
}
