// Underground Syndicate — 3D isometric renderer: camera, lights helpers, procedural textures, particles, floating text
(function () {
  const G = window.G, T = THREE;
  const gfx = G.gfx = { S: 32 };          // S: sim units per world unit
  let renderer, camera, scene = null;
  const ELEV = Math.PI / 6, YAW = Math.PI / 4;      // 30° elevation gives the classic 2:1 isometric look
  const DIR = new T.Vector3(Math.cos(ELEV) * Math.sin(YAW), Math.sin(ELEV), Math.cos(ELEV) * Math.cos(YAW));
  const cam = gfx.cam = { x: 0, z: 0, y: 0.8, vh: 12, fx: 0.5, fy: 0.5, shake: 0 };
  gfx.W = 1; gfx.H = 1;

  gfx.init = function (canvas) {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
    camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
    gfx.renderer = renderer; gfx.camera = camera;
    gfx.resize();
  };
  gfx.resize = function () {
    gfx.W = window.innerWidth; gfx.H = window.innerHeight;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(gfx.W, gfx.H, false);
    gfx.portrait = gfx.H > gfx.W;
  };
  gfx.setScene = s => { scene = s; };
  gfx.scene = () => scene;

  gfx.render = function () {
    if (!scene) return;
    const vw = cam.vh * gfx.W / gfx.H;
    camera.left = -vw * cam.fx; camera.right = vw * (1 - cam.fx); camera.top = cam.vh * cam.fy; camera.bottom = -cam.vh * (1 - cam.fy);
    camera.updateProjectionMatrix();
    const sx = cam.shake ? (Math.random() - 0.5) * cam.shake : 0, sz = cam.shake ? (Math.random() - 0.5) * cam.shake : 0;
    camera.position.set(cam.x + sx + DIR.x * 80, cam.y + DIR.y * 80, cam.z + sz + DIR.z * 80);
    camera.lookAt(cam.x + sx, cam.y, cam.z + sz);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
  };
  const v3 = new T.Vector3();
  gfx.project = (x, y, z) => { v3.set(x, y, z).project(camera); return { x: (v3.x * 0.5 + 0.5) * gfx.W, y: (-v3.y * 0.5 + 0.5) * gfx.H }; };
  const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitP = new T.Vector3();
  gfx.groundAt = (cx, cy) => {
    ndc.set(cx / gfx.W * 2 - 1, -(cy / gfx.H) * 2 + 1); ray.setFromCamera(ndc, camera);
    return ray.ray.intersectPlane(plane, hitP) ? { x: hitP.x, z: hitP.z } : { x: cam.x, z: cam.z };
  };
  // screen-space input (right, down) to world ground direction
  gfx.screenToWorld = (ix, iy) => ({ x: (ix + iy) * 0.7071, z: (-ix + iy) * 0.7071 });
  gfx.pxPerUnit = () => gfx.H / cam.vh;

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
  };

  // ------------------------------------------------------------ floating text (DOM, projected)
  const floats = [];
  gfx.floatText = function (x, y, z, str, color, big) {
    const host = document.getElementById('floaters'); if (!host) return;
    const el = document.createElement('div'); el.className = 'ft' + (big ? ' big' : ''); el.textContent = str; el.style.color = color || '#fff'; host.appendChild(el);
    floats.push({ el, x: x + (Math.random() - 0.5) * 0.5, y, z, t: 0, life: big ? 1.3 : 0.9 });
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
