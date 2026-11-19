// Underground Syndicate — 3D isometric renderer: camera, lights helpers, procedural textures, particles, floating text
(function () {
  const G = window.G, T = THREE;
  const gfx = G.gfx = { S: 32 };          // S: sim units per world unit
  let renderer, camera, scene = null;
  const ELEV = Math.PI / 6, YAW = Math.PI / 4;      // 30° elevation gives the classic 2:1 isometric look
  const DIR = new T.Vector3(Math.cos(ELEV) * Math.sin(YAW), Math.sin(ELEV), Math.cos(ELEV) * Math.cos(YAW));
  const cam = gfx.cam = { x: 0, z: 0, y: 0.8, vh: 12, fx: 0.5, fy: 0.5, shake: 0 };
  gfx.W = 1; gfx.H = 1;
  // quality: scale is the share of the screen's own resolution we draw at; shadows are redrawn every `shadowEvery` frames
  gfx.scale = 1; gfx.shadowEvery = 2; gfx.low = false;
  let fc = 0, lastSc = null, slow = 0, fast = 0, lastT = 0, avg = 16;
  const shadowTick = () => { fc++; if (scene !== lastSc || fc % gfx.shadowEvery === 0) renderer.shadowMap.needsUpdate = true; lastSc = scene; };
  // watch the frame time; if the machine cannot keep up, draw fewer pixels rather than drop frames
  gfx.pace = function (now) {
    const d = now - lastT; lastT = now; if (d <= 0 || d > 250) return;             // tab was away, or the very first frame
    avg += (d - avg) * 0.05;
    if (gfx.fixed) return;
    if (avg > 30) { slow += d; fast = 0; } else if (avg < 17.5) { fast += d; slow = 0; } else { slow = Math.max(0, slow - d); fast = 0; }
    if (slow > 3000 && gfx.scale > (gfx.low ? 0.6 : 0.8)) { gfx.scale = Math.max(gfx.low ? 0.6 : 0.8, gfx.scale - 0.1); gfx.shadowEvery = gfx.scale < 0.8 ? 3 : 2; slow = 0; avg = 18; gfx.resize(); document.body.classList.toggle('lowq', gfx.scale < 0.8); }
    else if (fast > 6000 && gfx.scale < 1 && !gfx.low) { gfx.scale = Math.min(1, gfx.scale + 0.1); fast = 0; avg = 18; gfx.resize(); document.body.classList.toggle('lowq', gfx.scale < 0.8); }
  };
  gfx.frameMs = () => avg;
  gfx.setLow = function (on) { gfx.low = !!on; gfx.fixed = false; gfx.scale = on ? 0.7 : 1; gfx.shadowEvery = on ? 3 : 2; slow = fast = 0; if (renderer) gfx.resize(); document.body.classList.toggle('lowq', !!on); };

  gfx.init = function (canvas) {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
    camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
    gfx.renderer = renderer; gfx.camera = camera;
    gfx.resize();
  };
  gfx.resize = function () {
    gfx.W = window.innerWidth; gfx.H = window.innerHeight;
    renderer.setPixelRatio(Math.max(0.6, Math.min(2, window.devicePixelRatio || 1) * gfx.scale));
    renderer.setSize(gfx.W, gfx.H, false);
    gfx.portrait = gfx.H > gfx.W;
  };
  // a short dip to black hides the frame where a scene is swapped and its actors are still settling
  let veilEl = null;
  gfx.veil = sec => { if (!veilEl) { veilEl = document.createElement('div'); veilEl.id = 'veil'; document.body.appendChild(veilEl); } veilEl.style.transition = 'none'; veilEl.style.opacity = 1; void veilEl.offsetWidth; veilEl.style.transition = 'opacity ' + (sec || 0.35) + 's ease-out'; veilEl.style.opacity = 0; };
  gfx.setScene = s => { if (scene && s !== scene) gfx.veil(0.35); scene = s; };
  gfx.scene = () => scene;

  // gfx.cine = {pos:[x,y,z], look:[x,y,z], fov, roll} switches to a free perspective camera (used by the cinematic)
  let pcam = null, active = null;
  gfx.render = function () {
    if (!scene) return;
    const sx = cam.shake ? (Math.random() - 0.5) * cam.shake : 0, sz = cam.shake ? (Math.random() - 0.5) * cam.shake : 0;
    if (gfx.cine) {
      const k = gfx.cine; if (!pcam) pcam = new T.PerspectiveCamera(50, 1, 0.1, 400);
      pcam.fov = k.fov || 50; pcam.aspect = gfx.W / gfx.H; pcam.updateProjectionMatrix();
      pcam.position.set(k.pos[0] + sx, k.pos[1] + sx * 0.5, k.pos[2] + sz);
      pcam.up.set(Math.sin(k.roll || 0), Math.cos(k.roll || 0), 0);
      pcam.lookAt(k.look[0] + sx * 0.6, k.look[1], k.look[2] + sz * 0.6); pcam.updateMatrixWorld();
      active = pcam; shadowTick(); renderer.render(scene, pcam); return;
    }
    const vw = cam.vh * gfx.W / gfx.H;
    camera.left = -vw * cam.fx; camera.right = vw * (1 - cam.fx); camera.top = cam.vh * cam.fy; camera.bottom = -cam.vh * (1 - cam.fy);
    camera.updateProjectionMatrix();
    camera.position.set(cam.x + sx + DIR.x * 80, cam.y + DIR.y * 80, cam.z + sz + DIR.z * 80);
    camera.lookAt(cam.x + sx, cam.y, cam.z + sz);
    camera.updateMatrixWorld();
    active = camera; shadowTick(); renderer.render(scene, camera);
  };
  const v3 = new T.Vector3();
  gfx.project = (x, y, z) => { v3.set(x, y, z).project(active || camera); return { x: (v3.x * 0.5 + 0.5) * gfx.W, y: (-v3.y * 0.5 + 0.5) * gfx.H }; };
  const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitP = new T.Vector3();
  gfx.groundAt = (cx, cy) => {
    ndc.set(cx / gfx.W * 2 - 1, -(cy / gfx.H) * 2 + 1); ray.setFromCamera(ndc, camera);
    return ray.ray.intersectPlane(plane, hitP) ? { x: hitP.x, z: hitP.z } : { x: cam.x, z: cam.z };
  };
  // screen-space input (right, down) to world ground direction
  gfx.screenToWorld = (ix, iy) => ({ x: (ix + iy) * 0.7071, z: (-ix + iy) * 0.7071 });
  gfx.pxPerUnit = () => gfx.cine ? gfx.H / 11 : gfx.H / cam.vh;

  // ------------------------------------------------------------ procedural textures
  function canvasTex(w, h, fn, repeat) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; }
    return t;
  }
  const R = (a, b) => a + Math.random() * (b - a);
  const cache = {};
  gfx.tex = function (name) {
    if (cache[name]) return cache[name];
    let t;
    if (name === 'stone' || name === 'cobble' || name === 'moss' || name === 'rock') t = canvasTex(256, 256, (c, w, h) => {
      const base = { stone: [150, 146, 142], cobble: [120, 118, 125], moss: [90, 120, 80], rock: [110, 100, 105] }[name];
      c.fillStyle = 'rgb(' + base + ')'; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) { const v = R(-24, 24); c.fillStyle = 'rgba(' + (base[0] + v | 0) + ',' + (base[1] + v | 0) + ',' + (base[2] + v | 0) + ',0.5)'; const s = R(1, 5); c.fillRect(R(0, w), R(0, h), s, s); }
      for (let i = 0; i < 10; i++) { c.fillStyle = 'rgba(0,0,0,' + R(0.03, 0.08) + ')'; c.beginPath(); c.ellipse(R(0, w), R(0, h), R(10, 46), R(8, 30), R(0, 3), 0, 6.3); c.fill(); }
      c.strokeStyle = 'rgba(20,14,12,0.55)'; c.lineWidth = 1.2;
      for (let i = 0; i < (name === 'moss' ? 0 : 9); i++) { let x = R(0, w), y = R(0, h); c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += R(-22, 22); y += R(-22, 22); c.lineTo(x, y); } c.stroke(); }
      if (name === 'moss') for (let i = 0; i < 500; i++) { c.fillStyle = 'rgba(' + (R(60, 130) | 0) + ',' + (R(130, 190) | 0) + ',' + (R(60, 110) | 0) + ',0.5)'; c.fillRect(R(0, w), R(0, h), 2, R(2, 5)); }
    }, true);
    if (name === 'glow') t = canvasTex(128, 128, (c, w) => { const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); });
    if (name === 'brick') t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#4a4448'; c.fillRect(0, 0, w, h); const bh = 16, bw = 42; for (let r = 0; r < h / bh; r++) for (let q = -1; q < w / bw + 1; q++) { const x = q * bw + (r % 2 ? bw / 2 : 0), y = r * bh, v = R(-22, 22), miss = Math.random() < 0.04; c.fillStyle = miss ? '#2a2628' : 'rgb(' + (168 + v | 0) + ',' + (158 + v + R(-6, 6) | 0) + ',' + (160 + v | 0) + ')'; c.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3); c.fillStyle = 'rgba(255,255,255,0.10)'; c.fillRect(x + 1.5, y + 1.5, bw - 3, 2); c.fillStyle = 'rgba(0,0,0,0.16)'; c.fillRect(x + 1.5, y + bh - 4, bw - 3, 2.5); } for (let i = 0; i < 900; i++) { c.fillStyle = 'rgba(0,0,0,' + R(0.04, 0.14) + ')'; c.fillRect(R(0, w), R(0, h), R(1, 3), R(1, 3)); } for (let i = 0; i < 7; i++) { const g = c.createLinearGradient(0, 0, 0, h), x = R(0, w); g.addColorStop(0, 'rgba(10,8,10,0.28)'); g.addColorStop(1, 'rgba(10,8,10,0)'); c.fillStyle = g; c.fillRect(x, 0, R(4, 12), R(60, 200)); } }, true);
    if (name === 'wood') t = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#d2cdc6'; c.fillRect(0, 0, w, h); const pw = 32; for (let q = 0; q < w / pw; q++) { const v = R(-18, 14); c.fillStyle = 'rgb(' + (205 + v | 0) + ',' + (198 + v | 0) + ',' + (190 + v | 0) + ')'; c.fillRect(q * pw, 0, pw, h); for (let i = 0; i < 16; i++) { c.strokeStyle = 'rgba(40,26,14,' + R(0.08, 0.28) + ')'; c.lineWidth = R(0.5, 1.6); const x = q * pw + R(2, pw - 2); c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + R(-4, 4), h * 0.3, x + R(-4, 4), h * 0.7, x + R(-3, 3), h); c.stroke(); } if (Math.random() < 0.6) { const kx = q * pw + R(8, pw - 8), ky = R(10, h - 10); c.fillStyle = 'rgba(40,26,14,0.5)'; c.beginPath(); c.ellipse(kx, ky, 3, 5, 0, 0, 6.3); c.fill(); c.strokeStyle = 'rgba(40,26,14,0.3)'; c.beginPath(); c.ellipse(kx, ky, 6, 9, 0, 0, 6.3); c.stroke(); } c.fillStyle = 'rgba(20,12,6,0.55)'; c.fillRect(q * pw, 0, 1.5, h); } }, true);
    if (name === 'poster') t = canvasTex(128, 176, (c, w, h) => { c.fillStyle = '#d8c8a0'; c.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { c.fillStyle = 'rgba(90,60,30,' + R(0.03, 0.12) + ')'; c.fillRect(R(0, w), R(0, h), R(1, 6), R(1, 6)); } c.fillStyle = '#5e120f'; c.fillRect(10, 10, w - 20, 22); c.fillStyle = '#2a1c14'; c.beginPath(); c.arc(w / 2, 70, 15, 0, 6.3); c.fill(); c.beginPath(); c.moveTo(w / 2 - 28, 126); c.lineTo(w / 2 - 20, 88); c.lineTo(w / 2 + 20, 88); c.lineTo(w / 2 + 28, 126); c.fill(); c.strokeStyle = '#2a1c14'; c.lineWidth = 3; c.beginPath(); c.moveTo(w / 2 + 26, 60); c.lineTo(w / 2 + 44, 118); c.stroke(); c.fillStyle = 'rgba(42,28,20,0.75)'; for (let i = 0; i < 3; i++) c.fillRect(16 + i * 4, 136 + i * 11, w - 32 - i * 14, 4); c.strokeStyle = 'rgba(60,40,20,0.5)'; c.lineWidth = 2; c.strokeRect(3, 3, w - 6, h - 6); });
    if (name === 'scorch') t = canvasTex(128, 128, (c, w) => { const g = c.createRadialGradient(w / 2, w / 2, 4, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(8,6,6,0.9)'); g.addColorStop(0.5, 'rgba(14,10,8,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); for (let i = 0; i < 26; i++) { const a = R(0, 6.28), r1 = R(10, 30), r2 = R(34, 62); c.strokeStyle = 'rgba(10,8,6,' + R(0.2, 0.6) + ')'; c.lineWidth = R(1, 3); c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * r1, w / 2 + Math.sin(a) * r1); c.lineTo(w / 2 + Math.cos(a) * r2, w / 2 + Math.sin(a) * r2); c.stroke(); } });
    if (name === 'crack') t = canvasTex(128, 128, (c, w) => { c.strokeStyle = 'rgba(6,5,5,0.85)'; c.lineCap = 'round'; for (let i = 0; i < 9; i++) { let a = i * 0.7 + R(-0.2, 0.2), x = w / 2, y = w / 2; c.lineWidth = 3.2; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { a += R(-0.5, 0.5); x += Math.cos(a) * R(6, 14); y += Math.sin(a) * R(6, 14); c.lineTo(x, y); c.lineWidth *= 0.8; } c.stroke(); } const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, 22); g.addColorStop(0, 'rgba(0,0,0,0.7)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); });
    if (name === 'blood') t = canvasTex(128, 128, (c, w) => { for (let i = 0; i < 16; i++) { c.fillStyle = 'rgba(' + (R(60, 100) | 0) + ',6,6,' + R(0.25, 0.6) + ')'; c.beginPath(); c.ellipse(w / 2 + R(-30, 30), w / 2 + R(-30, 30), R(6, 26), R(5, 20), R(0, 3), 0, 6.3); c.fill(); } });
    if (name === 'sigil') t = canvasTex(512, 512, (c, w) => {
      c.translate(w / 2, w / 2); c.strokeStyle = '#fff'; c.fillStyle = '#fff';
      [236, 214, 150, 96].forEach((r, i) => { c.lineWidth = i === 0 ? 7 : 3; c.beginPath(); c.arc(0, 0, r, 0, 6.3); c.stroke(); });
      c.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(a) * 96, Math.sin(a) * 96); c.lineTo(Math.cos(a + 0.39) * 150, Math.sin(a + 0.39) * 150); c.lineTo(Math.cos(a + 0.785) * 96, Math.sin(a + 0.785) * 96); c.stroke(); }
      c.font = '700 30px Georgia'; c.textAlign = 'center';
      for (let i = 0; i < 16; i++) { c.save(); c.rotate(i * Math.PI / 8); c.fillText('ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ'[i], 0, -172); c.restore(); }
      c.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2.513; c.lineTo(Math.cos(a) * 90, Math.sin(a) * 90); } c.closePath(); c.stroke();
    });
    cache[name] = t; return t;
  };
  gfx.bannerTex = function (bg, fg) {
    const k = 'ban' + bg + fg; if (cache[k]) return cache[k];
    return cache[k] = canvasTex(128, 256, (c, w, h) => {
      c.fillStyle = bg; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, h - 40); c.lineTo(w / 2, h); c.lineTo(0, h - 40); c.closePath(); c.fill();
      c.strokeStyle = fg; c.lineWidth = 6; c.stroke();
      c.translate(w / 2, 100); c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 34, 0, 6.3); c.stroke();
      c.beginPath(); c.moveTo(0, -48); c.lineTo(0, 60); c.moveTo(-26, -10); c.lineTo(26, -10); c.moveTo(-18, 46); c.lineTo(0, 62); c.lineTo(18, 46); c.stroke();
    });
  };

  // ------------------------------------------------------------ small builders
  gfx.lambert = (color, opts) => new T.MeshLambertMaterial(Object.assign({ color, flatShading: true }, opts || {}));
  gfx.box = (w, h, d, mat, x, y, z, parent) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; if (parent) parent.add(m); return m; };
  gfx.mesh = (geo, mat, x, y, z, parent) => { const m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; if (parent) parent.add(m); return m; };
  gfx.glow = (color, size, x, y, z, parent, opacity) => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: gfx.tex('glow'), color, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: opacity == null ? 1 : opacity }));
    s.scale.set(size, size, 1); s.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(s); return s;
  };
  gfx.decal = (tex, size, color, opacity, additive) => {
    const m = new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: tex, color: color || 0xffffff, transparent: true, opacity: opacity == null ? 1 : opacity, depthWrite: false, blending: additive ? T.AdditiveBlending : T.NormalBlending }));
    m.rotation.x = -Math.PI / 2; return m;
  };
  // flickering fire: sprites + optional point light. Returns {group, update(t)}
  const fires = gfx.fires = [];
  gfx.fire = (parent, x, y, z, color, size, light) => {
    const g = new T.Group(); g.position.set(x, y, z); parent.add(g);
    const a = gfx.glow(color, size * 2.6, 0, size * 0.3, 0, g, 0.55), b = gfx.glow(0xfff0c0, size * 0.9, 0, size * 0.2, 0, g, 0.95), c = gfx.glow(color, size * 1.3, 0, size * 0.7, 0, g, 0.7);
    let L = null; if (light) { L = new T.PointLight(color, light, 16, 1.6); L.position.y = size * 0.5; g.add(L); }
    const f = { g, a, b, c, L, base: light, size, seed: Math.random() * 10 }; fires.push(f); return f;
  };
  gfx.updateFires = t => {
    for (const f of fires) {
      if (!f.g.parent) continue;
      const k = 0.85 + Math.sin(t * 11 + f.seed) * 0.08 + Math.sin(t * 27 + f.seed * 3) * 0.07;
      f.b.scale.setScalar(f.size * 0.9 * k); f.c.scale.setScalar(f.size * 1.3 * (2 - k)); f.c.position.y = f.size * (0.6 + Math.sin(t * 9 + f.seed) * 0.12); f.a.material.opacity = 0.5 * k;
      if (f.L) f.L.intensity = f.base * k;
    }
  };

  // ------------------------------------------------------------ particles (one additive point cloud per scene)
  const PN = 600;
  gfx.makeParticles = function (sc) {
    const geo = new T.BufferGeometry(), pos = new Float32Array(PN * 3), col = new Float32Array(PN * 3);
    geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
    const mat = new T.PointsMaterial({ size: 10, map: gfx.tex('glow'), vertexColors: true, blending: T.AdditiveBlending, depthWrite: false, transparent: true, sizeAttenuation: false });
    const pts = new T.Points(geo, mat); pts.frustumCulled = false; sc.add(pts);
    const P = { pts, pos, col, list: [], next: 0 };
    for (let i = 0; i < PN; i++) { P.list.push({ life: 0, t: 0 }); pos[i * 3 + 1] = -999; }
    sc.userData.particles = P; return P;
  };
  const tc = new T.Color();
  gfx.emit = function (x, y, z, vx, vy, vz, life, color, grav) {
    const P = scene && scene.userData.particles; if (!P) return;
    const i = P.next; P.next = (i + 1) % PN; const p = P.list[i];
    p.x = x; p.y = y; p.z = z; p.vx = vx; p.vy = vy; p.vz = vz; p.life = life; p.t = 0; p.g = grav == null ? 9 : grav;
    tc.set(color); p.r = tc.r; p.gc = tc.g; p.b = tc.b;
  };
  gfx.burst = function (x, y, z, color, n, speed, up) {
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = (0.3 + Math.random() * 0.7) * speed; gfx.emit(x, y, z, Math.cos(a) * v, (up || 2) * (0.3 + Math.random()), Math.sin(a) * v, 0.3 + Math.random() * 0.4, color); }
  };
  gfx.updateParticles = function (dt) {
    const P = scene && scene.userData.particles; if (!P) return;
    P.pts.material.size = Math.max(4, 0.3 * gfx.pxPerUnit() * renderer.getPixelRatio());
    for (let i = 0; i < PN; i++) {
      const p = P.list[i]; if (p.life <= 0) continue;
      p.t += dt; const k = 1 - p.t / p.life;
      if (k <= 0) { p.life = 0; P.pos[i * 3 + 1] = -999; continue; }
      p.vy -= p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y < 0.03) { p.y = 0.03; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; }
      P.pos[i * 3] = p.x; P.pos[i * 3 + 1] = p.y; P.pos[i * 3 + 2] = p.z;
      P.col[i * 3] = p.r * k; P.col[i * 3 + 1] = p.gc * k; P.col[i * 3 + 2] = p.b * k;
    }
    P.pts.geometry.attributes.position.needsUpdate = true; P.pts.geometry.attributes.color.needsUpdate = true;
    updateBlood(dt);
  };

  // ------------------------------------------------------------ blood: dark droplets that leave splats on the floor
  const BN = 260, SN = 70;
  function bloodSys(sc) {
    if (sc.userData.blood) return sc.userData.blood;
    const geo = new T.BufferGeometry(), pos = new Float32Array(BN * 3); for (let i = 0; i < BN; i++) pos[i * 3 + 1] = -999;
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    const pts = new T.Points(geo, new T.PointsMaterial({ size: 8, map: gfx.tex('glow'), color: 0x8a0d0d, transparent: true, opacity: 0.95, depthWrite: false, sizeAttenuation: false })); pts.frustumCulled = false; sc.add(pts);
    const splats = []; const mat = () => new T.MeshBasicMaterial({ map: gfx.tex('blood'), transparent: true, opacity: 0.85, depthWrite: false });
    for (let i = 0; i < SN; i++) { const m = new T.Mesh(new T.PlaneGeometry(1, 1), mat()); m.rotation.x = -Math.PI / 2; m.visible = false; sc.add(m); splats.push(m); }
    return sc.userData.blood = { pts, pos, list: Array.from({ length: BN }, () => ({ life: 0 })), next: 0, splats, sn: 0 };
  }
  gfx.blood = function (x, y, z, n, speed, dir) {
    if (!scene) return; const B = bloodSys(scene);
    for (let k = 0; k < n; k++) {
      const p = B.list[B.next]; B.next = (B.next + 1) % BN;
      const a = dir == null ? Math.random() * 6.283 : dir + (Math.random() - 0.5) * 1.6, v = (0.25 + Math.random() * 0.75) * speed;
      p.x = x; p.y = y + Math.random() * 0.4; p.z = z; p.vx = Math.cos(a) * v; p.vz = Math.sin(a) * v; p.vy = 1.5 + Math.random() * 4; p.life = 1.6;
    }
  };
  gfx.splat = function (x, z, size) {
    if (!scene) return; const B = bloodSys(scene), m = B.splats[B.sn % SN]; B.sn++;
    m.position.set(x, 0.014 + (B.sn % SN) * 0.0004, z); m.scale.setScalar(size); m.rotation.z = Math.random() * 6.283; m.material.opacity = 0.55 + Math.random() * 0.35; m.visible = true;
  };
  gfx.clearBlood = function (sc) { const B = sc && sc.userData.blood; if (!B) return; B.splats.forEach(m => m.visible = false); B.sn = 0; B.list.forEach((p, i) => { p.life = 0; B.pos[i * 3 + 1] = -999; }); B.pts.geometry.attributes.position.needsUpdate = true; };
  function updateBlood(dt) {
    const B = scene && scene.userData.blood; if (!B) return;
    B.pts.material.size = Math.max(3, 0.16 * gfx.pxPerUnit() * renderer.getPixelRatio());
    for (let i = 0; i < BN; i++) {
      const p = B.list[i]; if (p.life <= 0) continue;
      p.life -= dt; p.vy -= 16 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y <= 0.03 || p.life <= 0) { if (p.y <= 0.03 && Math.random() < 0.55) gfx.splat(p.x, p.z, 0.35 + Math.random() * 0.75); p.life = 0; B.pos[i * 3 + 1] = -999; continue; }
      B.pos[i * 3] = p.x; B.pos[i * 3 + 1] = p.y; B.pos[i * 3 + 2] = p.z;
    }
    B.pts.geometry.attributes.position.needsUpdate = true;
  }

  // ------------------------------------------------------------ floating text (DOM, projected)
  const floats = [];
  gfx.floatText = function (x, y, z, str, color, big) {
    const host = document.getElementById('floaters'); if (!host) return;
    const el = document.createElement('div'); el.className = 'ft' + (big ? ' big' : ''); el.textContent = str; el.style.color = color || '#fff'; host.appendChild(el);
    let lift = 0; for (const o of floats) if (o.t < 0.5 && Math.abs(o.x - x) < 1.3 && Math.abs(o.z - z) < 1.3) lift += 0.62;       // words that land together stack instead of printing over each other
    if (floats.length > 9) { const old = floats.shift(); old.el.remove(); }
    const f = { el, x: x + (Math.random() - 0.5) * 0.5, y: y + Math.min(2.6, lift), z, t: 0, life: big ? 1.3 : 0.9 }; floats.push(f);
    const p0 = gfx.project(f.x, f.y, f.z); el.style.transform = 'translate(' + p0.x.toFixed(1) + 'px,' + p0.y.toFixed(1) + 'px) translate(-50%,-50%)';       // start where it belongs, not in the corner
  };
  gfx.updateFloats = function (dt) {
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i]; f.t += dt; f.y += dt * 1.3;
      if (f.t >= f.life) { f.el.remove(); floats.splice(i, 1); continue; }
      const p = gfx.project(f.x, f.y, f.z), pop = f.t < 0.1 ? 1 + (0.1 - f.t) * 6 : 1;
      f.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + pop.toFixed(2) + ')';
      f.el.style.opacity = Math.min(1, (f.life - f.t) * 3);
    }
  };
  gfx.clearFloats = () => { floats.forEach(f => f.el.remove()); floats.length = 0; };

  // ------------------------------------------------------------ base scene with standard lighting
  gfx.newScene = function (opts) {
    opts = opts || {};
    const s = new T.Scene();
    s.background = new T.Color(opts.bg || 0x07060a);
    s.add(new T.HemisphereLight(opts.sky || 0x6a6088, opts.ground || 0x1c140e, opts.ambient == null ? 0.9 : opts.ambient));
    const key = new T.DirectionalLight(opts.keyColor || 0xffd8b0, opts.key == null ? 1.6 : opts.key);
    key.position.set(5, 16, 10); key.castShadow = true;
    const r = opts.shadowSize || 14, sc = key.shadow.camera; sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 50;
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0015; key.shadow.normalBias = 0.03;
    s.add(key); s.add(key.target); s.userData.key = key;
    gfx.makeParticles(s);
    return s;
  };
})();
