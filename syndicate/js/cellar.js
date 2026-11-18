// Guttercrown — the Oracle's cellar: a golden throne room under the market that nobody else knows is there,
// and the light he arrives in when he comes to fetch you back
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, O = G.oracle, box = gfx.box, mesh = gfx.mesh, L = c => gfx.lambert(c);
  if (!O) return;
  const R = (a, b) => a + Math.random() * (b - a);
  // his seal: an hourglass inside a ring
  let sealTex = null;
  function seal() {
    if (sealTex) return sealTex;
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    x.strokeStyle = '#ffe9a0'; x.fillStyle = '#ffe9a0'; x.lineWidth = 9; x.beginPath(); x.arc(128, 128, 112, 0, 6.3); x.stroke(); x.lineWidth = 3; x.beginPath(); x.arc(128, 128, 96, 0, 6.3); x.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.moveTo(128 + Math.cos(a) * 98, 128 + Math.sin(a) * 98); x.lineTo(128 + Math.cos(a) * (i % 3 ? 106 : 112), 128 + Math.sin(a) * (i % 3 ? 106 : 112)); x.lineWidth = i % 3 ? 3 : 7; x.stroke(); }
    x.beginPath(); x.moveTo(82, 60); x.lineTo(174, 60); x.lineTo(128, 128); x.closePath(); x.fill(); x.beginPath(); x.moveTo(82, 196); x.lineTo(174, 196); x.lineTo(128, 128); x.closePath(); x.globalAlpha = 0.55; x.fill(); x.globalAlpha = 1;
    x.lineWidth = 8; x.beginPath(); x.moveTo(74, 56); x.lineTo(182, 56); x.moveTo(74, 200); x.lineTo(182, 200); x.stroke();
    sealTex = new T.CanvasTexture(c); return sealTex;
  }
  G.oracleSeal = seal;

  // ------------------------------------------------------------ the room
  let room = null;
  function build() {
    const s = gfx.newScene({ bg: 0x0a0604, ambient: 0.85, key: 1.5, shadowSize: 12, sky: 0xffe0a0, ground: 0x3a2408, keyColor: 0xffd890 });
    const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x5a3c08, shininess: 160, specular: 0xfff0c0, flatShading: true }), dk = new T.MeshPhongMaterial({ color: 0xb8862a, emissive: 0x3a2404, shininess: 60, flatShading: true });
    const brick = (rx, ry) => { const t = gfx.tex('brick').clone(); t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); return new T.MeshPhongMaterial({ color: 0xd8a83a, emissive: 0x2a1a04, map: t, shininess: 40, flatShading: true }); };
    for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++) box(0.96, 0.3, 0.96, (x + z) % 2 ? gold : dk, x, -0.15 + R(-0.015, 0.015), z, s).castShadow = false;
    box(11.6, 6, 0.6, brick(4, 2), 0, 3, -5.8, s); const wl = box(0.6, 6, 11.6, brick(4, 2), -5.8, 3, 0, s);
    [[-5.4, -5.4], [0, -5.5], [5.4, -5.5], [-5.5, 0], [-5.5, 5.4]].forEach(q => { box(0.7, 6, 0.7, dk, q[0], 3, q[1], s); box(0.9, 0.3, 0.9, gold, q[0], 5.9, q[1], s); });
    // the great hourglass
    const hg = new T.Group(); hg.position.set(2.6, 0, -3.5); s.add(hg);
    mesh(new T.CylinderGeometry(0.9, 1.0, 0.18, 12), gold, 0, 0.09, 0, hg); mesh(new T.CylinderGeometry(0.9, 0.9, 0.16, 12), gold, 0, 3.0, 0, hg);
    const glass = new T.MeshPhongMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.28, shininess: 120, side: T.DoubleSide });
    mesh(new T.ConeGeometry(0.75, 1.35, 12, 1, true), glass, 0, 2.25, 0, hg).rotation.x = Math.PI; mesh(new T.ConeGeometry(0.75, 1.35, 12, 1, true), glass, 0, 0.85, 0, hg);
    const sand = new T.Mesh(new T.ConeGeometry(0.55, 0.7, 10), new T.MeshBasicMaterial({ color: 0xffd36b })); sand.position.y = 0.55; hg.add(sand);
    [0, 2.09, 4.19].forEach(a => mesh(new T.CylinderGeometry(0.05, 0.05, 2.9, 6), gold, Math.cos(a) * 0.82, 1.55, Math.sin(a) * 0.82, hg));
    // clocks on both walls, all telling different times
    const clocks = [];
    const clock = (x, y, z, r, onWest) => { const g = new T.Group(); g.position.set(x, y, z); if (onWest) g.rotation.y = Math.PI / 2; s.add(g); const f = mesh(new T.CylinderGeometry(r, r, 0.1, 16), gold, 0, 0, 0, g); f.rotation.x = Math.PI / 2; const d = new T.Mesh(new T.CircleGeometry(r * 0.84, 16), new T.MeshBasicMaterial({ color: 0xfff0c8 })); d.position.z = 0.06; g.add(d);
      const hs = [0.7, 0.48].map(k => { const p = new T.Group(); p.position.z = 0.07; box(r * 0.07, r * k, 0.01, L(0x1a1024), 0, r * k / 2, 0, p).castShadow = false; g.add(p); return p; }); clocks.push({ hs, sp: R(-1.6, 1.6), ph: R(0, 6) }); };
    [[-4.6, 3.0, 0.36], [1.6, 4.9, 0.3], [2.9, 4.5, 0.34], [3.9, 3.2, 0.42], [4.7, 4.7, 0.26]].forEach(q => clock(q[0], q[1], -5.44, q[2], false));
    [[-3.4, 3.8, 0.45], [-1.2, 4.6, 0.3], [1.4, 3.5, 0.58], [3.6, 4.4, 0.34]].forEach(q => clock(-5.44, q[1], q[0], q[2], true));
    // his seal, large, on the back wall and the floor
    const sm = new T.MeshBasicMaterial({ map: seal(), transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false });
    const TX = -1.3, s1 = new T.Mesh(new T.PlaneGeometry(4.0, 4.0), sm); s1.position.set(TX, 3.2, -5.44); s.add(s1);
    // beams behind it, twelve of them, like the hours
    const rays = new T.Group(); rays.position.set(TX, 3.2, -5.47); s.add(rays);
    for (let i = 0; i < 12; i++) { const r = new T.Mesh(new T.PlaneGeometry(i % 3 ? 0.14 : 0.26, i % 3 ? 1.2 : 1.6), new T.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: i % 3 ? 0.16 : 0.26, blending: T.AdditiveBlending, depthWrite: false })); const a = i * Math.PI / 6; r.position.set(Math.sin(a) * 1.85, Math.cos(a) * 1.85, 0); r.rotation.z = -a; rays.add(r); }
    gfx.glow(0xffd880, 6, TX, 3.2, -5.2, s, 0.3);
    // the throne he keeps for somebody else, on a dais
    const th = new T.Group(); th.position.set(TX, 0, -4.3); s.add(th);
    box(3.6, 0.2, 2.2, gold, 0, 0.1, 0, th); box(2.8, 0.2, 1.7, dk, 0, 0.3, -0.15, th);
    box(1.2, 0.5, 1.0, gold, 0, 0.65, -0.3, th); box(1.0, 0.12, 0.8, L(0x1c3f9a), 0, 0.95, -0.25, th);
    box(1.3, 2.6, 0.22, gold, 0, 2.0, -0.8, th); box(1.0, 1.9, 0.06, L(0x1c3f9a), 0, 1.95, -0.67, th); mesh(new T.ConeGeometry(0.75, 0.9, 4), gold, 0, 3.72, -0.8, th).rotation.y = Math.PI / 4;
    [-0.66, 0.66].forEach(x => { box(0.2, 0.75, 1.0, gold, x, 0.95, -0.3, th); mesh(new T.SphereGeometry(0.15, 8, 6), gold, x, 1.4, 0.15, th); mesh(new T.CylinderGeometry(0.07, 0.07, 3.0, 6), gold, x * 1.05, 1.9, -0.8, th); mesh(new T.SphereGeometry(0.13, 8, 6), gold, x * 1.05, 3.45, -0.8, th); });
    // marble columns and gilded arches along the back wall, sapphire banners between
    const marble = new T.MeshPhongMaterial({ color: 0xf4eee2, emissive: 0x2a2418, shininess: 90 }), blue = () => { const c = document.createElement('canvas'); c.width = 128; c.height = 320; const x = c.getContext('2d'); x.fillStyle = '#16327e'; x.fillRect(0, 0, 128, 320); const gr = x.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, 'rgba(90,130,255,0.35)'); gr.addColorStop(1, 'rgba(0,0,30,0.35)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 320);
      x.strokeStyle = '#f0c95a'; x.lineWidth = 5; x.strokeRect(7, 7, 114, 306); x.lineWidth = 2; x.strokeRect(15, 15, 98, 290);
      for (let y = 40; y < 300; y += 44) for (let k = -1; k <= 1; k++) { const cx = 64 + k * 30, cy = y + (k ? 22 : 0); x.beginPath(); x.moveTo(cx, cy - 13); x.lineTo(cx + 11, cy); x.lineTo(cx, cy + 13); x.lineTo(cx - 11, cy); x.closePath(); x.stroke(); }
      x.lineWidth = 4; x.beginPath(); x.arc(64, 150, 30, 0, 6.3); x.fillStyle = '#16327e'; x.fill(); x.stroke(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.moveTo(64 + Math.cos(a) * 22, 150 + Math.sin(a) * 22); x.lineTo(64 + Math.cos(a) * 28, 150 + Math.sin(a) * 28); x.stroke(); }
      x.fillStyle = '#f0c95a'; x.beginPath(); x.moveTo(52, 136); x.lineTo(76, 136); x.lineTo(64, 150); x.closePath(); x.fill(); x.beginPath(); x.moveTo(52, 164); x.lineTo(76, 164); x.lineTo(64, 150); x.closePath(); x.fill(); return new T.CanvasTexture(c); };
    const bt = blue(), column = (x, z, h) => { mesh(new T.CylinderGeometry(0.3, 0.34, h, 12), marble, x, h / 2 + 0.3, z, s); box(0.9, 0.3, 0.9, gold, x, 0.15, z, s); box(0.86, 0.26, 0.86, gold, x, h + 0.43, z, s); mesh(new T.CylinderGeometry(0.4, 0.3, 0.18, 12), gold, x, h + 0.22, z, s); };
    const CX = [-4.9, TX - 2.0, TX + 2.0, 3.3]; CX.forEach(x => column(x, -5.15, 4.8)); [-3.0, 1.2].forEach(z => column(-5.15, z, 4.8));
    for (let i = 0; i < CX.length - 1; i++) { const a = CX[i], b = CX[i + 1], ar = mesh(new T.TorusGeometry((b - a) / 2, 0.11, 6, 18, Math.PI), gold, (a + b) / 2, 5.3, -5.2, s); ar.scale.y = Math.min(1, 1.4 / (b - a) * 1.2); }
    const banners = [[-3.95, 3.3, 1.0], [2.0, 3.0, 0.9]].map(q => { const m = new T.Mesh(new T.PlaneGeometry(q[2], q[2] * 2.5), new T.MeshLambertMaterial({ map: bt, emissive: 0x0a1640, side: T.DoubleSide })); m.position.set(q[0], q[1], -5.42); s.add(m); box(q[2] + 0.2, 0.07, 0.07, gold, q[0], q[1] + q[2] * 1.25, -5.4, s); return m; });
    [[-0.9, 3.3], [3.3, 3.3]].forEach(q => { const m = new T.Mesh(new T.PlaneGeometry(0.9, 2.25), new T.MeshLambertMaterial({ map: bt, emissive: 0x0a1640, side: T.DoubleSide })); m.rotation.y = Math.PI / 2; m.position.set(-5.42, q[1], q[0]); s.add(m); banners.push(m); });
    // a carved frieze of lozenges under the ceiling line
    { const c = document.createElement('canvas'); c.width = 256; c.height = 32; const x = c.getContext('2d'); x.fillStyle = '#b8862a'; x.fillRect(0, 0, 256, 32); x.strokeStyle = '#ffe9a0'; x.lineWidth = 2; for (let i = 0; i < 8; i++) { const cx = 16 + i * 32; x.beginPath(); x.moveTo(cx, 4); x.lineTo(cx + 13, 16); x.lineTo(cx, 28); x.lineTo(cx - 13, 16); x.closePath(); x.stroke(); x.strokeRect(cx - 3, 13, 6, 6); } const ft = new T.CanvasTexture(c); ft.wrapS = T.RepeatWrapping; ft.repeat.set(5, 1);
      const fm = new T.MeshPhongMaterial({ map: ft, emissive: 0x3a2404, shininess: 80 }); box(11.6, 0.36, 0.1, fm, 0, 5.75, -5.46, s); const w = box(0.1, 0.36, 11.6, fm, -5.46, 5.75, 0, s); }
    // tall ring-lamps either side of the throne
    [TX - 1.25, TX + 1.25].forEach(x => { mesh(new T.CylinderGeometry(0.06, 0.2, 2.5, 8), gold, x, 1.25, -3.5, s); mesh(new T.CylinderGeometry(0.28, 0.28, 0.05, 8), gold, x, 0.03, -3.5, s); const rg = mesh(new T.TorusGeometry(0.34, 0.035, 6, 16), gold, x, 2.55, -3.5, s); rg.rotation.x = Math.PI / 2;
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, fl = new T.Mesh(new T.SphereGeometry(0.055, 6, 5), new T.MeshBasicMaterial({ color: 0xffe0a0 })); fl.position.set(x + Math.cos(a) * 0.34, 2.68, -3.5 + Math.sin(a) * 0.34); fl.scale.y = 1.8; s.add(fl); } gfx.glow(0xffc870, 2.0, x, 2.7, -3.5, s, 0.5); });
    // scrolls: a rack of them on the west wall, and one unrolled
    { const pa = L(0xefe2bc); box(0.5, 1.9, 2.0, L(0x3a2616), -5.25, 1.1, -1.0, s); for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { const m = mesh(new T.CylinderGeometry(0.09, 0.09, 0.5, 7), pa, -5.1, 0.42 + r * 0.44, -1.8 + k * 0.4 + (r % 2) * 0.1, s); m.rotation.z = Math.PI / 2; mesh(new T.CylinderGeometry(0.1, 0.1, 0.06, 7), gold, -4.84, 0.42 + r * 0.44, -1.8 + k * 0.4 + (r % 2) * 0.1, s).rotation.z = Math.PI / 2; } }
    const s2 = new T.Mesh(new T.PlaneGeometry(5.2, 5.2), new T.MeshBasicMaterial({ map: seal(), transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false })); s2.rotation.x = -Math.PI / 2; s2.position.set(0.6, 0.02, 0.6); s.add(s2);
    // gold, everywhere
    const coinG = new T.CylinderGeometry(0.07, 0.07, 0.02, 7), coins = new T.InstancedMesh(coinG, gold, 420), d = new T.Object3D(); let ci = 0;
    const pile = (x, z, r, h) => { mesh(new T.ConeGeometry(r, h, 9), gold, x, h / 2, z, s); for (let i = 0; i < 46 && ci < 420; i++) { const a = R(0, 6.28), rr = R(0, r * 1.25), y = Math.max(0.02, h * (1 - rr / r) + R(-0.05, 0.05)); d.position.set(x + Math.cos(a) * rr, rr > r ? 0.02 : y, z + Math.sin(a) * rr); d.rotation.set(R(-0.6, 0.6), R(0, 3), R(-0.6, 0.6)); d.updateMatrix(); coins.setMatrixAt(ci++, d.matrix); } };
    pile(-4.2, -4.1, 1.3, 1.5); pile(3.9, -4.0, 1.5, 1.8); pile(-4.3, 2.2, 1.1, 1.1); pile(4.4, -1.2, 0.9, 0.9); pile(-4.4, -0.8, 0.8, 0.8); pile(1.3, -4.6, 0.8, 0.7); coins.count = ci; s.add(coins);
    [[3.9, -1.9, 0.3], [-3.6, 0.9, -0.4], [4.2, 1.4, 0.9]].forEach(q => { const c = new T.Group(); c.position.set(q[0], 0, q[1]); c.rotation.y = q[2]; s.add(c); box(1.0, 0.55, 0.66, L(0x4a2e1a), 0, 0.28, 0, c); box(1.04, 0.1, 0.7, gold, 0, 0.58, 0, c); const lid = box(1.0, 0.1, 0.66, L(0x4a2e1a), 0, 0.9, -0.3, c); lid.rotation.x = -1.0; mesh(new T.SphereGeometry(0.42, 8, 5, 0, 6.28, 0, 1.3), gold, 0, 0.52, 0, c).scale.set(1, 0.6, 0.7); });
    // a desk, a ledger of his own, and the contract under a lamp
    box(2.2, 0.12, 1.1, L(0x3a2616), 1.6, 0.95, -0.4, s); [[0.7, -0.8], [2.5, -0.8], [0.7, 0], [2.5, 0]].forEach(q => box(0.12, 0.95, 0.12, gold, q[0], 0.47, q[1], s));
    box(0.7, 0.08, 0.5, L(0x5a1f7a), 1.2, 1.05, -0.4, s); box(0.5, 0.02, 0.7, L(0xefe6cc), 2.1, 1.02, -0.4, s).rotation.y = 0.2; const lamp = new T.Mesh(new T.SphereGeometry(0.13, 8, 6), new T.MeshBasicMaterial({ color: 0xfff0c8 })); lamp.position.set(2.5, 1.5, -0.7); s.add(lamp); mesh(new T.CylinderGeometry(0.03, 0.08, 0.45, 6), gold, 2.5, 1.22, -0.7, s);
    [[-4.6, 4.2], [4.6, 3.6], [0.4, -5.0]].forEach(q => { mesh(new T.CylinderGeometry(0.05, 0.12, 1.5, 6), gold, q[0], 0.75, q[1], s); for (let k = 0; k < 3; k++) { const fl = new T.Mesh(new T.SphereGeometry(0.06, 6, 5), new T.MeshBasicMaterial({ color: 0xffd080 })); fl.position.set(q[0] + (k - 1) * 0.16, 1.62 + (k === 1 ? 0.1 : 0), q[1]); fl.scale.y = 1.7; s.add(fl); } gfx.glow(0xffc060, 1.6, q[0], 1.7, q[1], s, 0.5); });
    // the stair up, in the far corner, and the light that comes down it
    for (let k = 0; k < 6; k++) box(1.3, 0.2, 0.42, dk, 4.6, 0.1 + k * 0.2, 5.3 - k * 0.42, s);
    const pl = [[0, 3.6, 0, 0xffd080, 30, 16], [TX, 3.0, -3.4, 0xffe0a0, 22, 9], [-3.5, 2.4, -3.5, 0xffb040, 16, 9], [3.6, 2.4, -3.4, 0xffb040, 16, 9]].map(q => { const l = new T.PointLight(q[3], q[4], q[5], 1.5); l.position.set(q[0], q[1], q[2]); s.add(l); return l; });
    let david = null, key = '';
    let hidden = false;
    return { scene: s, hide: v => { hidden = !!v; if (david) david.root.visible = !hidden; }, update: (t, noCam) => {
      const lk = (G.state.hero || {}).race || 'human'; if (!david || key !== lk) { if (david) s.remove(david.root); david = G.makeChar(O.look()); david.root.position.set(-0.6, 0, 0.4); david.root.rotation.y = 0.6; s.add(david.root); key = lk; } david.root.visible = !hidden;
      david.pose({ t, act: Math.sin(t * 0.8) > 0.55 ? 'cast' : 'idle', prog: 0.3 });
      clocks.forEach(c => { c.hs[0].rotation.z = t * c.sp + c.ph; c.hs[1].rotation.z = t * c.sp * 0.09 - c.ph; });
      sand.scale.y = 0.6 + (t * 0.05 % 1) * 0.8; s1.rotation.z = t * 0.1; s2.rotation.z = -t * 0.05; rays.rotation.z = -t * 0.04; rays.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04); banners.forEach((b, i) => { b.rotation.z = Math.sin(t * 0.7 + i * 1.7) * 0.012; }); pl[0].intensity = 28 + Math.sin(t * 2.3) * 3;
      if (Math.random() < 0.35) gfx.emit(R(-5, 5), R(0.2, 3.5), R(-5, 5), R(-0.1, 0.1), R(0.1, 0.4), R(-0.1, 0.1), 1.6, 0xffd36b, 0);
      const port = gfx.portrait, a = Math.sin(t * 0.25) * 0.12;
      if (!noCam) gfx.cine = port ? { pos: [2.2 + a, 3.4, 10.4], look: [-1.0, -0.6, -2.0], fov: 60, roll: 0 } : { pos: [2.6 + a, 2.8, 9.2], look: [-2.6, 2.3, -2.2], fov: 46, roll: 0 };
    } };
  }
  // going down: the market gives way to the golden room for as long as his menu is open
  let inside = false;
  const leave = () => { if (!inside) return; inside = false; gfx.cine = null; if (G.scene === 'hub') gfx.setScene(W.get('hub').scene); document.getElementById('panel').classList.remove('cellar'); };
  const or0 = ui.oracle;
  ui.oracle = function () {
    if (G.scene === 'hub') { if (!room) room = build(); if (!inside) { inside = true; G.sfx('page'); } gfx.setScene(room.scene); room.update(performance.now() / 1000); }
    const r = or0.apply(this, arguments);
    if (inside) document.getElementById('panel').classList.add('cellar');
    return r;
  };
  const close0 = ui.close;
  ui.close = function () { const r = close0.apply(this, arguments); leave(); return r; };
  const hub0 = W.buildHub;
  W.buildHub = function () { const h = hub0.apply(this, arguments), up0 = h.update; h.update = function (t) { up0.apply(this, arguments); if (inside) { if (!ui.isOpen()) leave(); else room.update(t); } }; return h; };

  // ------------------------------------------------------------ where you wake: his room, not the sand
  let reviving = false;
  O.stageOpts = () => { if (!room) room = build(); room.hide(true); return { stage: room, npc: [-2.3, -0.2], you: [0.5, 0.9] }; };
  const rev0 = O.revive;
  O.revive = function (then) {
    if (!room) room = build(); reviving = true; G.sfx('holy'); G.sfx('bell'); gfx.setScene(room.scene); room.update(performance.now() / 1000);
    return rev0.call(this, function () { reviving = false; room.hide(false); gfx.cine = null; then(); });
  };
  // the room keeps turning while he talks, and stays on screen behind whatever card follows
  const api = G.talkApi, tu0 = api && api.update;
  if (api) api.update = function (dt, now) { if (reviving && room) room.update(now, true); return tu0.apply(this, arguments); };
  const fu0 = G.fight.update;
  G.fight.update = function (dt) { if (reviving && room && !G.fight.active) { if (gfx.scene() !== room.scene) gfx.setScene(room.scene); room.update(performance.now() / 1000); return; } return fu0.apply(this, arguments); };
})();
