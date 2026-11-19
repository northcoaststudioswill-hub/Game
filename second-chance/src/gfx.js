'use strict';
/* SECOND CHANCE - gfx: renderer, cel shading with ink outlines, drawn textures, static batching, effects. */
(function () {
  const G = SC.gfx = {};
  const INK = 0x07070d;
  G.INK = INK;
  G.uDot = { value: 5 };
  G.uKey = { value: new THREE.Vector3(0.80, 0.76, 0.56) };
  const AMBIENT = [0.27, 0.30, 0.50];

  G.init = function (canvas) {
    const r = G.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    G.quality = 1;
    const s = G.scene = new THREE.Scene();
    s.background = new THREE.Color(0x10163a);
    s.fog = new THREE.Fog(0x1b2350, 38, 150);
    G.camera = new THREE.PerspectiveCamera(SC.T.camFov, 1, 0.25, 500);
    s.add(G.camera);

    G.amb = new THREE.AmbientLight(new THREE.Color(AMBIENT[0], AMBIENT[1], AMBIENT[2]), Math.PI);
    s.add(G.amb);
    const k = G.uKey.value;
    const sun = G.sun = new THREE.DirectionalLight(new THREE.Color(k.x, k.y, k.z), Math.PI);
    G.sunDir = new THREE.Vector3(0.553, 0.754, 0.352).normalize();
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const c = sun.shadow.camera; c.left = -30; c.right = 30; c.top = 30; c.bottom = -30; c.near = 1; c.far = 160;
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04;
    s.add(sun); s.add(sun.target);

    // one moving light that the powers flash
    G.flash = new THREE.PointLight(0xffffff, 0, 16, 2);
    s.add(G.flash);
    G.flashT = 0;

    G.gradient = (function () {
      const d = new Uint8Array([0, 0, 0, 255, 0, 0, 0, 255, 184, 184, 184, 255, 255, 255, 255, 255]);
      const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
      t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
    })();

    G.outlineMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide, fog: true });
    buildTextures();
    buildMaterials();
    buildSky();
    buildRain();
    G.resize();
  };

  /* Toon material: three flat tones, the middle one printed with halftone dots. */
  G.toon = function (opts) {
    const m = new THREE.MeshToonMaterial(Object.assign({ gradientMap: G.gradient }, opts));
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uDot = G.uDot; sh.uniforms.uKey = G.uKey;
      sh.fragmentShader = 'uniform float uDot;\nuniform vec3 uKey;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', [
        '{',
        '  float scL = dot(reflectedLight.directDiffuse, vec3(0.3333)) / (dot(uKey * diffuseColor.rgb, vec3(0.3333)) + 0.0005);',
        '  if (scL > 0.12 && scL < 0.86) {',
        '    vec2 scP = mat2(0.7071, -0.7071, 0.7071, 0.7071) * gl_FragCoord.xy / uDot;',
        '    float scD = length(fract(scP) - 0.5);',
        '    float scM = 1.0 - smoothstep(0.30, 0.36, scD);',
        '    outgoingLight = mix(outgoingLight, reflectedLight.indirectDiffuse * 0.9, scM);',
        '  }',
        '}',
        '#include <opaque_fragment>'
      ].join('\n'));
    };
    return m;
  };

  /* ---------- drawn textures ---------- */
  const TEX = G.tex = {};
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    t.anisotropy = 4;
    return t;
  }
  G.canvasTex = canvasTex;
  function inkLine(g, rnd, x0, y0, x1, y1, w) {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 14));
    g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0);
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      g.lineTo(x0 + (x1 - x0) * t + (rnd() - 0.5) * 1.6, y0 + (y1 - y0) * t + (rnd() - 0.5) * 1.6);
    }
    g.stroke();
  }
  function hatch(g, x, y, w, h, gap, lw) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.lineWidth = lw; g.beginPath();
    for (let i = -h; i < w; i += gap) { g.moveTo(x + i, y + h); g.lineTo(x + i + h, y); }
    g.stroke(); g.restore();
  }

  function buildTextures() {
    const ink = '#07070d';
    TEX.brick = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(7);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      const rows = 8, rh = h / rows;
      for (let r = 0; r < rows; r++) {
        if (rnd() < 0.8) inkLine(g, rnd, 0, r * rh, w, r * rh, 2.2);
        const off = (r % 2) * 32;
        for (let x = off; x < w + 1; x += 64) if (rnd() < 0.72) inkLine(g, rnd, x, r * rh, x, (r + 1) * rh, 2);
        for (let x = off; x < w; x += 64) if (rnd() < 0.13) { g.fillStyle = 'rgba(7,7,13,0.22)'; g.fillRect(x + 2, r * rh + 2, 60, rh - 3); }
        for (let x = off; x < w; x += 64) if (rnd() < 0.1) { g.lineWidth = 1.5; hatch(g, x + 3, r * rh + 3, 58, rh - 5, 7, 1.4); }
      }
    }, true);
    TEX.win = canvasTex(512, 512, (g, w, h) => {
      const rnd = SC.seeded(21);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
      g.strokeStyle = ink; g.lineCap = 'round';
      for (let i = 0; i < 26; i++) { const y = rnd() * h, x = rnd() * w; inkLine(g, rnd, x, y, x + 20 + rnd() * 60, y, 1.6); }
      const cols = 4, rows = 3, cw = w / cols, ch = h / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = c * cw + cw * 0.22, y = r * ch + ch * 0.2, ww = cw * 0.56, hh = ch * 0.58;
        const lit = rnd() < 0.3;
        g.fillStyle = ink; g.fillRect(x - 5, y - 5, ww + 10, hh + 10);
        g.fillStyle = lit ? '#ffd76a' : '#19224a'; g.fillRect(x, y, ww, hh);
        if (lit && rnd() < 0.6) { g.fillStyle = '#e08a2a'; g.fillRect(x, y + hh * 0.55, ww, hh * 0.45); }
        if (!lit) { g.fillStyle = '#2c3a78'; g.beginPath(); g.moveTo(x, y + hh); g.lineTo(x + ww * 0.55, y); g.lineTo(x + ww * 0.8, y); g.lineTo(x + ww * 0.25, y + hh); g.fill(); }
        g.fillStyle = ink; g.fillRect(x + ww / 2 - 2, y, 4, hh); g.fillRect(x, y + hh * 0.5 - 2, ww, 4);
        g.fillRect(x - 10, y + hh + 5, ww + 20, 7);
      }
      g.lineWidth = 4; g.beginPath(); for (let r = 0; r <= rows; r++) { g.moveTo(0, r * ch); g.lineTo(w, r * ch); } g.stroke();
    }, true);
    TEX.asphalt = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(3);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(7,7,13,0.5)';
      for (let i = 0; i < 150; i++) g.fillRect(rnd() * w, rnd() * h, 1.5 + rnd() * 2.5, 1.5 + rnd() * 2);
      g.strokeStyle = 'rgba(7,7,13,0.75)'; g.lineCap = 'round';
      for (let i = 0; i < 5; i++) { let x = rnd() * w, y = rnd() * h; for (let k = 0; k < 4; k++) { const nx = x + (rnd() - 0.5) * 60, ny = y + (rnd() - 0.5) * 60; inkLine(g, rnd, x, y, nx, ny, 1.6); x = nx; y = ny; } }
    }, true);
    TEX.concrete = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(11);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      inkLine(g, rnd, 0, 1, w, 1, 3); inkLine(g, rnd, 1, 0, 1, h, 3);
      for (let i = 0; i < 4; i++) { const x = rnd() * w, y = rnd() * h; inkLine(g, rnd, x, y, x + (rnd() - 0.5) * 70, y + rnd() * 50, 1.5); }
      g.fillStyle = 'rgba(7,7,13,0.4)'; for (let i = 0; i < 40; i++) g.fillRect(rnd() * w, rnd() * h, 2, 2);
    }, true);
    TEX.crate = canvasTex(128, 128, (g, w, h) => {
      const rnd = SC.seeded(5);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      for (let x = 26; x < w; x += 26) inkLine(g, rnd, x, 12, x, h - 12, 2);
      g.lineWidth = 9; g.beginPath(); g.moveTo(14, 14); g.lineTo(w - 14, h - 14); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(16, 16); g.lineTo(w - 16, h - 16); g.stroke();
      g.strokeStyle = ink; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
      g.lineWidth = 2; g.strokeRect(17, 17, w - 34, h - 34);
    }, true);
    TEX.container = canvasTex(256, 128, (g, w, h) => {
      const rnd = SC.seeded(9);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      for (let x = 16; x < w; x += 16) { g.globalAlpha = 0.8; inkLine(g, rnd, x, 8, x, h - 8, x % 32 ? 1.5 : 3); }
      g.globalAlpha = 1; g.lineWidth = 12; g.strokeRect(4, 4, w - 8, h - 8);
      g.fillStyle = 'rgba(7,7,13,0.25)'; g.fillRect(8, h - 30, w - 16, 22);
    }, true);
    TEX.metal = canvasTex(128, 128, (g, w, h) => {
      const rnd = SC.seeded(13);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      for (let y = 8; y < h; y += 16) inkLine(g, rnd, 0, y, w, y, 2.2);
      g.fillStyle = 'rgba(7,7,13,0.18)'; for (let y = 8; y < h; y += 32) g.fillRect(0, y, w, 8);
    }, true);
    TEX.roof = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(17);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(7,7,13,0.55)';
      for (let i = 0; i < 260; i++) { g.beginPath(); g.arc(rnd() * w, rnd() * h, 0.8 + rnd() * 1.6, 0, 7); g.fill(); }
      g.strokeStyle = ink; inkLine(g, rnd, 0, 2, w, 2, 3);
    }, true);
    TEX.wood = canvasTex(128, 128, (g, w, h) => {
      const rnd = SC.seeded(19);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = ink; g.lineCap = 'round';
      for (let y = 0; y <= h; y += 32) inkLine(g, rnd, 0, y, w, y, 3.5);
      for (let i = 0; i < 12; i++) { const x = rnd() * w, y = rnd() * h; inkLine(g, rnd, x, y, x + 20 + rnd() * 30, y, 1.2); }
    }, true);
    TEX.sky = canvasTex(256, 256, (g, w, h) => {
      const bands = ['#0a0d2a', '#10163a', '#1a2156', '#2a2a70', '#48358a', '#7a4690'];
      const bh = h / bands.length;
      bands.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, i * bh, w, bh + 1); });
      for (let i = 1; i < bands.length; i++) {
        g.fillStyle = bands[i];
        for (let r = 0; r < 3; r++) for (let x = 0; x < w; x += 8) {
          g.beginPath(); g.arc(x + (r % 2) * 4, i * bh - 4 - r * 7, 3 - r * 0.9, 0, 7); g.fill();
        }
      }
    }, true);
    TEX.skyline = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(31);
      g.fillStyle = '#0b0d24'; g.fillRect(0, 0, w, h);
      for (let y = 6; y < h; y += 14) for (let x = 6; x < w; x += 12) {
        if (rnd() < 0.24) { g.fillStyle = rnd() < 0.8 ? '#f2c14e' : '#7ad9ff'; g.fillRect(x, y, 6, 8); }
      }
    }, true);

    // effect sheets
    TEX.burst = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(41); g.translate(w / 2, h / 2);
      const star = (r0, r1, n, fill) => {
        g.beginPath();
        for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, r = (i % 2 ? r0 : r1) * (0.85 + rnd() * 0.3); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        g.closePath(); g.fillStyle = fill; g.fill();
      };
      star(62, 124, 11, '#07070d'); star(56, 112, 11, '#ffffff'); star(30, 70, 9, '#ffe14a');
    });
    TEX.puff = canvasTex(128, 128, (g, w, h) => {
      const blobs = [[64, 70, 34], [40, 76, 24], [88, 76, 26], [54, 50, 24], [78, 48, 22]];
      g.fillStyle = '#07070d'; blobs.forEach(b => { g.beginPath(); g.arc(b[0], b[1], b[2] + 5, 0, 7); g.fill(); });
      g.fillStyle = '#ffffff'; blobs.forEach(b => { g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
      g.strokeStyle = '#07070d'; g.lineWidth = 3; g.beginPath(); g.arc(60, 72, 16, 0.3, 2.2); g.stroke();
    });
    TEX.ink = canvasTex(128, 128, (g, w, h) => {
      const rnd = SC.seeded(43); g.fillStyle = '#07070d'; g.translate(64, 64);
      g.beginPath(); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r = 30 + rnd() * 30 * (i % 2 ? 1 : 0.35); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill();
      for (let i = 0; i < 9; i++) { const a = rnd() * 7, r = 48 + rnd() * 12; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 2 + rnd() * 4, 0, 7); g.fill(); }
    });
    TEX.ring = canvasTex(256, 256, (g, w, h) => {
      const rnd = SC.seeded(47); g.translate(128, 128);
      const flame = (r0, r1, fill) => {
        g.beginPath(); const n = 36;
        for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2; g.lineTo(Math.cos(a) * (i % 2 ? r0 : r1 * (0.9 + rnd() * 0.1)), Math.sin(a) * (i % 2 ? r0 : r1 * (0.9 + rnd() * 0.1))); }
        g.closePath(); g.fillStyle = fill; g.fill();
      };
      flame(104, 126, '#07070d'); flame(100, 120, '#ffffff');
      g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 84, 0, 7); g.fill();
      g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#07070d'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 84, 0, 7); g.stroke();
    });
    TEX.slash = canvasTex(256, 128, (g, w, h) => {
      const arc = (pad, fill) => {
        g.beginPath(); g.moveTo(6 - pad, 110); g.quadraticCurveTo(128, -40 - pad * 2, 250 + pad, 110);
        g.quadraticCurveTo(128, 34 + pad, 6 - pad, 110); g.closePath(); g.fillStyle = fill; g.fill();
      };
      arc(5, '#07070d'); arc(0, '#ffffff');
    });
    TEX.disc = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.fill();
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; g.beginPath(); g.arc(64 + Math.cos(a) * 56, 64 + Math.sin(a) * 56, 2.6, 0, 7); g.fill(); }
      for (let i = 0; i < 32; i++) { const a = (i + 0.5) / 32 * Math.PI * 2; g.beginPath(); g.arc(64 + Math.cos(a) * 61, 64 + Math.sin(a) * 61, 1.4, 0, 7); g.fill(); }
    });
    TEX.shadowBlob = canvasTex(64, 64, (g) => { g.fillStyle = '#07070d'; g.beginPath(); g.arc(32, 32, 28, 0, 7); g.fill(); });
    TEX.mark = canvasTex(128, 128, (g) => {
      g.font = '900 110px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineJoin = 'round'; g.lineWidth = 16; g.strokeStyle = '#07070d'; g.strokeText('?', 64, 70);
      g.fillStyle = '#ffe14a'; g.fillText('?', 64, 70);
    });
    TEX.alert = canvasTex(128, 128, (g) => {
      g.font = '900 116px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineJoin = 'round'; g.lineWidth = 16; g.strokeStyle = '#07070d'; g.strokeText('!', 64, 68);
      g.fillStyle = '#ff3b30'; g.fillText('!', 64, 68);
    });
    TEX.lock = canvasTex(128, 128, (g) => {
      g.translate(64, 64); g.lineCap = 'butt';
      [['#07070d', 13], ['#ffffff', 6]].forEach(s => {
        g.strokeStyle = s[0]; g.lineWidth = s[1];
        for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(0, 0, 44, i * Math.PI / 2 + 0.35, i * Math.PI / 2 + 1.22); g.stroke(); }
      });
      g.fillStyle = '#07070d'; g.beginPath(); g.moveTo(0, -20); g.lineTo(14, -38); g.lineTo(-14, -38); g.fill();
      g.fillStyle = '#ff3b30'; g.beginPath(); g.moveTo(0, -24); g.lineTo(9, -36); g.lineTo(-9, -36); g.fill();
    });
    TEX.chain = canvasTex(64, 32, (g) => {
      g.strokeStyle = '#07070d'; g.lineWidth = 11; g.strokeRect(9, 8, 46, 16);
      g.strokeStyle = '#ffffff'; g.lineWidth = 5; g.strokeRect(9, 8, 46, 16);
    });
    TEX.sigil = {};
    Object.keys(SC.PATHS).forEach(id => { TEX.sigil[id] = canvasTex(256, 256, g => SC.drawSigil(g, id, 256, true)); });
  }

  /* The three path marks. Also used by the menus, so it draws on any 2D context. */
  SC.drawSigil = function (g, id, size, ring) {
    const s = size / 256; g.save(); g.scale(s, s); g.translate(128, 128); g.lineJoin = 'round'; g.lineCap = 'round';
    const pass = (col, extra) => {
      g.strokeStyle = col; g.fillStyle = col;
      if (ring) { g.lineWidth = 8 + extra; g.beginPath(); g.arc(0, 0, 108, 0, 7); g.stroke(); g.lineWidth = 3 + extra; g.beginPath(); g.arc(0, 0, 92, 0, 7); g.stroke(); }
      g.lineWidth = 13 + extra;
      if (id === 'ember') {
        g.beginPath(); g.moveTo(0, -74); g.bezierCurveTo(54, -20, 60, 36, 0, 70); g.bezierCurveTo(-60, 36, -30, -6, -22, -30); g.bezierCurveTo(-10, -10, 4, -20, 0, -74); g.stroke();
        g.beginPath(); g.moveTo(0, 6); g.lineTo(0, 44); g.stroke();
      } else if (id === 'shade') {
        g.beginPath(); g.arc(-6, 0, 62, 0.9, 5.4); g.stroke();
        g.beginPath(); g.arc(22, 0, 44, 2.1, 4.2); g.stroke();
        g.beginPath(); g.moveTo(34, -14); g.lineTo(34, 14); g.stroke();
      } else {
        g.beginPath(); g.ellipse(0, -40, 22, 30, 0, 0, 7); g.stroke();
        g.beginPath(); g.ellipse(0, 40, 22, 30, 0, 0, 7); g.stroke();
        g.beginPath(); g.moveTo(0, -18); g.lineTo(0, 18); g.stroke();
        g.beginPath(); g.moveTo(-50, 0); g.lineTo(50, 0); g.stroke();
      }
    };
    pass('#07070d', 12); pass('#ffffff', 0);
    g.restore();
  };

  /* ---------- materials for the static world ---------- */
  const MATS = G.mats = {};
  function buildMaterials() {
    const def = (name, tex, tile, o) => {
      o = o || {};
      MATS[name] = {
        mat: o.mat || G.toon({ vertexColors: true, map: tex || null, transparent: !!o.alpha, opacity: o.alpha || 1 }),
        tile: tile || [1, 1], fit: !!o.fit, cast: o.cast !== false, receive: o.receive !== false
      };
    };
    def('flat');
    def('brick', TEX.brick, [4, 3.2]);
    def('win', TEX.win, [12, 10.2]);
    def('asphalt', TEX.asphalt, [8, 8]);
    def('concrete', TEX.concrete, [4, 4]);
    def('crate', TEX.crate, [1, 1], { fit: true });
    def('container', TEX.container, [1, 1], { fit: true });
    def('metal', TEX.metal, [2, 2]);
    def('roof', TEX.roof, [6, 6]);
    def('wood', TEX.wood, [1.6, 1.6]);
    def('glass', null, [1, 1], { cast: false, mat: new THREE.MeshBasicMaterial({ color: 0x9fd7ff, transparent: true, opacity: 0.28, depthWrite: false }) });
    def('glow', null, [1, 1], { cast: false, receive: false, mat: new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }) });
  }

  /* ---------- static batcher: the whole level becomes a handful of draw calls ---------- */
  G.Batch = function () { this.groups = {}; this.ol = { pos: [], idx: [] }; };
  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _m3 = new THREE.Matrix3(), _c = new THREE.Color();
  G.Batch.prototype.add = function (matName, geo, matrix, color, outline) {
    const g = this.groups[matName] || (this.groups[matName] = { pos: [], nor: [], uv: [], col: [], idx: [] });
    const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    const base = g.pos.length / 3;
    _m3.getNormalMatrix(matrix); _c.set(color);
    for (let i = 0; i < p.count; i++) {
      _v.fromBufferAttribute(p, i).applyMatrix4(matrix); g.pos.push(_v.x, _v.y, _v.z);
      _n.fromBufferAttribute(n, i).applyMatrix3(_m3).normalize(); g.nor.push(_n.x, _n.y, _n.z);
      g.uv.push(uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
      g.col.push(_c.r, _c.g, _c.b);
    }
    const ix = geo.index;
    if (ix) for (let i = 0; i < ix.count; i++) g.idx.push(base + ix.getX(i)); else for (let i = 0; i < p.count; i++) g.idx.push(base + i);
    if (outline) {
      geo.computeBoundingBox(); const bb = geo.boundingBox, o = this.ol, ob = o.pos.length / 3;
      const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
      const sx = 1 + 2 * outline / Math.max(0.01, bb.max.x - bb.min.x), sy = 1 + 2 * outline / Math.max(0.01, bb.max.y - bb.min.y), sz = 1 + 2 * outline / Math.max(0.01, bb.max.z - bb.min.z);
      for (let i = 0; i < p.count; i++) {
        _v.fromBufferAttribute(p, i); _v.set(cx + (_v.x - cx) * sx, cy + (_v.y - cy) * sy, cz + (_v.z - cz) * sz).applyMatrix4(matrix);
        o.pos.push(_v.x, _v.y, _v.z);
      }
      if (ix) for (let i = 0; i < ix.count; i++) o.idx.push(ob + ix.getX(i)); else for (let i = 0; i < p.count; i++) o.idx.push(ob + i);
    }
  };
  const _mx = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(1, 1, 1), _p = new THREE.Vector3();
  G.mx = function (x, y, z, ry, rx, rz) { _e.set(rx || 0, ry || 0, rz || 0, 'YXZ'); _q.setFromEuler(_e); return _mx.compose(_p.set(x, y, z), _q, _s).clone(); };
  /* A box whose texture is laid out in world metres, so bricks stay brick-sized on any wall. */
  G.Batch.prototype.box = function (matName, cx, cy, cz, w, h, d, color, o) {
    o = o || {};
    const geo = new THREE.BoxGeometry(w, h, d), md = MATS[matName], uv = geo.attributes.uv;
    if (md.tile && !md.fit) {
      const tu = md.tile[0], tv = md.tile[1];
      const rep = [[d / tu, h / tv], [d / tu, h / tv], [w / tu, d / tu], [w / tu, d / tu], [w / tu, h / tv], [w / tu, h / tv]];
      for (let f = 0; f < 6; f++) {
        let ru = rep[f][0], rv = rep[f][1];
        if (o.snap) { ru = Math.max(1, Math.round(ru * 4) / 4); rv = Math.max(1 / 3, Math.round(rv * 3) / 3); }
        for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv); }
      }
    }
    this.add(matName, geo, G.mx(cx, cy, cz, o.ry, o.rx, o.rz), color, o.outline === undefined ? 0.06 : o.outline);
    geo.dispose();
  };
  G.Batch.prototype.build = function (parent) {
    const out = [];
    Object.keys(this.groups).forEach(name => {
      const g = this.groups[name], md = MATS[name], geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(g.nor, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(g.uv, 2));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(g.col, 3));
      geo.setIndex(g.idx);
      const m = new THREE.Mesh(geo, md.mat); m.castShadow = md.cast; m.receiveShadow = md.receive;
      if (name === 'glass') m.renderOrder = 5;
      parent.add(m); out.push(m);
    });
    if (this.ol.pos.length) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(this.ol.pos, 3)); geo.setIndex(this.ol.idx);
      const m = new THREE.Mesh(geo, G.outlineMat); parent.add(m); out.push(m);
    }
    return out;
  };

  /* A loose mesh with its own ink shell, for things that move (doors, pickups, props that break). */
  G.inked = function (geo, mat, t) {
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
    geo.computeBoundingBox(); const bb = geo.boundingBox; t = t === undefined ? 0.05 : t;
    if (t > 0) {
      const o = new THREE.Mesh(geo, G.outlineMat);
      o.scale.set(1 + 2 * t / Math.max(0.01, bb.max.x - bb.min.x), 1 + 2 * t / Math.max(0.01, bb.max.y - bb.min.y), 1 + 2 * t / Math.max(0.01, bb.max.z - bb.min.z));
      o.position.set((bb.min.x + bb.max.x) / 2 * (1 - o.scale.x), (bb.min.y + bb.max.y) / 2 * (1 - o.scale.y), (bb.min.z + bb.max.z) / 2 * (1 - o.scale.z));
      m.add(o); m.userData.outline = o;
    }
    return m;
  };

  /* ---------- sky ---------- */
  function buildSky() {
    const s = G.scene, sky = new THREE.Group(); G.sky = sky; s.add(sky);
    const t = TEX.sky.clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(24, 1); t.needsUpdate = true;
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(300, 300, 260, 32, 1, true), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: false }));
    dome.position.y = 100; dome.renderOrder = -10; sky.add(dome);
    const moon = new THREE.Group();
    const mk = (r, c, z) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: c, fog: false, depthWrite: false })); m.position.z = z; m.renderOrder = -9; return m; };
    moon.add(mk(33, INK, 0), mk(30, 0xfff2c4, 0.5), mk(6, 0xe8d49a, 1), mk(3.4, 0xe8d49a, 1));
    moon.children[2].position.set(-9, 8, 1); moon.children[3].position.set(10, -6, 1);
    moon.position.set(-150, 120, -210); moon.lookAt(0, 20, 0); sky.add(moon);
    // far skyline, flat black with lit windows
    const rnd = SC.seeded(99), mat = new THREE.MeshBasicMaterial({ map: TEX.skyline, fog: false });
    for (let i = 0; i < 46; i++) {
      const a = i / 46 * Math.PI * 2 + rnd() * 0.08, r = 150 + rnd() * 60, w = 14 + rnd() * 22, h = 22 + rnd() * 60;
      const geo = new THREE.BoxGeometry(w, h, w), uv = geo.attributes.uv;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * w / 18, uv.getY(k) * h / 18);
      const b = new THREE.Mesh(geo, mat); b.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r); b.rotation.y = rnd() * 3; sky.add(b);
    }
  }

  /* ---------- rain: flat white strokes, comic style ---------- */
  let rain;
  function buildRain() {
    const N = 360, pos = new Float32Array(N * 6), d = [];
    for (let i = 0; i < N; i++) d.push({ x: SC.rand(-18, 18), y: SC.rand(0, 16), z: SC.rand(-18, 18), s: SC.rand(22, 30) });
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.55, fog: false }));
    m.frustumCulled = false; G.scene.add(m); rain = { m, pos, d, N };
  }
  function updateRain(dt) {
    const c = G.camera.position, p = rain.pos;
    for (let i = 0; i < rain.N; i++) {
      const d = rain.d[i]; d.y -= d.s * dt; d.x -= d.s * 0.16 * dt;
      if (d.y < -1) { d.y = 15 + Math.random() * 3; d.x = SC.rand(-18, 18); d.z = SC.rand(-18, 18); }
      const x = c.x + d.x, y = c.y - 4 + d.y, z = c.z + d.z, hide = SC.world && SC.world.underRoof(x, y, z), j = i * 6;
      p[j] = x; p[j + 1] = hide ? -50 : y; p[j + 2] = z; p[j + 3] = x + 0.11; p[j + 4] = hide ? -50 : y + 0.7; p[j + 5] = z;
    }
    rain.m.geometry.attributes.position.needsUpdate = true;
  }

  /* ---------- effects: pooled sprites and ground decals ---------- */
  const FX = G.fx = { live: [], pool: { s: [], g: [] } };
  const wordTex = {};
  function wordTexture(text, fill) {
    const key = text + fill; if (wordTex[key]) return wordTex[key];
    return (wordTex[key] = canvasTex(512, 256, (g, w, h) => {
      g.translate(w / 2, h / 2); g.rotate(-0.08);
      g.font = 'italic 900 150px Impact, "Arial Black", "Helvetica Neue", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      let tw = g.measureText(text).width; const sc = Math.min(1, 440 / tw); g.scale(sc, 1);
      g.lineJoin = 'round'; g.lineWidth = 34; g.strokeStyle = '#07070d'; g.strokeText(text, 0, 8);
      g.lineWidth = 16; g.strokeStyle = '#ffffff'; g.strokeText(text, 0, 8);
      g.fillStyle = '#07070d'; g.fillText(text, 7, 15);
      g.fillStyle = fill; g.fillText(text, 0, 8);
    }));
  }
  const groundGeo = new THREE.PlaneGeometry(1, 1); groundGeo.rotateX(-Math.PI / 2);
  FX.spawn = function (o) {
    const ground = !!o.ground, pool = FX.pool[ground ? 'g' : 's'];
    let m = pool.pop();
    if (!m) {
      m = ground ? new THREE.Mesh(groundGeo, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false }))
        : new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, fog: false }));
    }
    const mat = m.material; mat.map = o.tex; mat.color.set(o.color === undefined ? 0xffffff : o.color);
    mat.depthTest = o.depthTest !== false; mat.opacity = o.alpha === undefined ? 1 : o.alpha;
    mat.blending = o.add ? THREE.AdditiveBlending : THREE.NormalBlending; mat.needsUpdate = true;
    if (ground) m.rotation.y = o.rot || 0; else mat.rotation = o.rot || 0;
    m.position.copy(o.pos); m.renderOrder = o.order || (ground ? 2 : 20);
    const f = { m, ground, t: 0, life: o.life || 0.5, s0: o.size || 1, s1: o.grow === undefined ? (o.size || 1) : o.grow, ax: o.aspect || 1,
      vel: o.vel || null, spin: o.spin || 0, a0: mat.opacity, pop: !!o.pop, hold: o.hold === undefined ? 0.55 : o.hold, follow: o.follow || null, real: !!o.real };
    scaleFx(f, 0); G.scene.add(m); FX.live.push(f); return f;
  };
  function scaleFx(f, k) {
    let s = SC.lerp(f.s0, f.s1, SC.easeOut(k));
    if (f.pop) { const u = Math.min(1, k * 5); s = f.s0 * (u < 1 ? 0.4 + 0.85 * u : 1.25 - 0.25 * Math.min(1, (k - 0.2) * 5)); if (k > 0.4) s = f.s0 * (1 + (k - 0.4) * 0.15); }
    if (f.ground) f.m.scale.set(s * f.ax, 1, s); else f.m.scale.set(s * f.ax, s, 1);
  }
  FX.update = function (dt, rdt) {
    for (let i = FX.live.length - 1; i >= 0; i--) {
      const f = FX.live[i]; f.t += f.real ? rdt : dt; const k = f.t / f.life;
      if (k >= 1) { G.scene.remove(f.m); FX.pool[f.ground ? 'g' : 's'].push(f.m); FX.live.splice(i, 1); continue; }
      scaleFx(f, k);
      if (f.vel) f.m.position.addScaledVector(f.vel, dt);
      if (f.follow) f.m.position.copy(f.follow);
      if (f.spin) { if (f.ground) f.m.rotation.y += f.spin * dt; else f.m.material.rotation += f.spin * dt; }
      f.m.material.opacity = f.a0 * (k < f.hold ? 1 : 1 - (k - f.hold) / (1 - f.hold));
    }
  };
  const _fp = new THREE.Vector3();
  /* The comic lettering that pops out of a hit. */
  FX.word = function (text, pos, fill, size) {
    _fp.copy(pos); _fp.x += SC.rand(-0.3, 0.3); _fp.y += SC.rand(0.2, 0.5);
    FX.spawn({ tex: TEX.burst, pos: _fp, size: (size || 1.6) * 1.35, life: 0.22, grow: (size || 1.6) * 1.9, depthTest: false, order: 30, rot: SC.rand(0, 3), hold: 0.3, real: true });
    return FX.spawn({ tex: wordTexture(text, fill || '#ffe14a'), pos: _fp, size: size || 1.6, aspect: 2, life: 0.75, pop: true, depthTest: false, order: 31, rot: SC.rand(-0.15, 0.15), vel: new THREE.Vector3(0, 0.6, 0), hold: 0.7, real: true });
  };
  FX.burst = function (pos, color, size) {
    return FX.spawn({ tex: TEX.burst, pos, size: (size || 1) * 0.6, grow: (size || 1) * 1.5, life: 0.18, color: color === undefined ? 0xffffff : color, depthTest: false, order: 29, rot: SC.rand(0, 3), hold: 0.4 });
  };
  FX.puff = function (pos, n, size, color) {
    for (let i = 0; i < (n || 3); i++) {
      _fp.copy(pos); _fp.x += SC.rand(-0.4, 0.4); _fp.z += SC.rand(-0.4, 0.4); _fp.y += SC.rand(0.1, 0.35);
      FX.spawn({ tex: TEX.puff, pos: _fp, size: (size || 0.7) * SC.rand(0.6, 1), grow: (size || 0.7) * 1.7, life: SC.rand(0.35, 0.6), color: color === undefined ? 0xffffff : color, vel: new THREE.Vector3(SC.rand(-0.8, 0.8), SC.rand(0.4, 1.2), SC.rand(-0.8, 0.8)), rot: SC.rand(0, 6), hold: 0.4 });
    }
  };
  FX.ink = function (pos, n, size) {
    for (let i = 0; i < (n || 4); i++) {
      _fp.copy(pos); _fp.x += SC.rand(-0.5, 0.5); _fp.z += SC.rand(-0.5, 0.5); _fp.y += SC.rand(0.2, 1.5);
      FX.spawn({ tex: TEX.ink, pos: _fp, size: (size || 1) * SC.rand(0.5, 1), grow: (size || 1) * 1.8, life: SC.rand(0.3, 0.55), vel: new THREE.Vector3(SC.rand(-1, 1), SC.rand(0, 1.6), SC.rand(-1, 1)), rot: SC.rand(0, 6), spin: SC.rand(-3, 3), hold: 0.5 });
    }
  };
  FX.ring = function (pos, color, r0, r1, life) {
    _fp.copy(pos); _fp.y += 0.06;
    return FX.spawn({ tex: TEX.ring, pos: _fp, ground: true, size: r0 * 2, grow: r1 * 2, life: life || 0.5, color, rot: SC.rand(0, 6), spin: 1.5, hold: 0.5 });
  };
  FX.slash = function (pos, yaw, color, size, tilt) {
    _fp.copy(pos);
    const f = FX.spawn({ tex: TEX.slash, pos: _fp, ground: true, size: (size || 2) * 0.7, grow: (size || 2) * 1.1, aspect: 1.9, life: 0.2, color, rot: yaw, hold: 0.35 });
    f.m.rotation.set(tilt || 0, yaw, 0, 'YXZ'); return f;
  };
  FX.light = function (pos, color, intensity, time) {
    G.flash.position.copy(pos); G.flash.position.y += 1.2; G.flash.color.set(color); G.flashI = intensity; G.flashT = G.flashT0 = time || 0.35;
  };

  /* ---------- per-frame and housekeeping ---------- */
  const _sp = new THREE.Vector3();
  G.update = function (dt, rdt, focus) {
    FX.update(dt, rdt);
    updateRain(rdt);
    if (G.flashT > 0) { G.flashT -= rdt; G.flash.intensity = Math.max(0, G.flashI * G.flashT / G.flashT0); } else G.flash.intensity = 0;
    // shadow box follows the action, snapped so the edges do not crawl
    const snap = 60 / 2048 * 4; _sp.set(Math.round(focus.x / snap) * snap, 0, Math.round(focus.z / snap) * snap);
    G.sun.target.position.copy(_sp); G.sun.position.copy(_sp).addScaledVector(G.sunDir, 80);
    G.sky.position.set(G.camera.position.x, 0, G.camera.position.z);
  };
  G.render = function () { G.renderer.render(G.scene, G.camera); };
  G.resize = function () {
    const w = window.innerWidth, h = window.innerHeight, pr = Math.min(window.devicePixelRatio || 1, G.quality >= 1 ? 2 : 1.25);
    G.renderer.setPixelRatio(pr); G.renderer.setSize(w, h, false);
    G.camera.aspect = w / h; G.portrait = h > w; G.camera.updateProjectionMatrix();
    G.uDot.value = Math.max(4, Math.min(w, h) * pr / 150);
  };
  G.setQuality = function (q) {
    G.quality = q; const n = q >= 1 ? 2048 : 1024;
    if (G.sun.shadow.mapSize.x !== n) { G.sun.shadow.mapSize.set(n, n); if (G.sun.shadow.map) { G.sun.shadow.map.dispose(); G.sun.shadow.map = null; } }
    G.resize();
  };
  /* Copies what the camera sees right now into a picture. The story panels are made with this. */
  G.snap = function (w, h) {
    G.render();
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const src = G.renderer.domElement, sa = src.width / src.height, da = w / h;
    let sw = src.width, sh = src.height; if (sa > da) sw = sh * da; else sh = sw / da;
    c.getContext('2d').drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.86);
  };
})();
