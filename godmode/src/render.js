'use strict';
/* GODMODE.EXE: rendering. Reads the sim state, never writes to it.
   Low-poly, flat-shaded, vertex-coloured, no shadow maps, no external assets. */

const R = { ready: false, time: 0, shake: 0, viewShift: 0, viewShiftT: 0, retro: true, singT: -1, flashL: 0, night: 0 };

/* ------------------------------------------------------- geometry helpers */

const _m4 = new THREE.Matrix4(), _q4 = new THREE.Quaternion(), _eu = new THREE.Euler();
const _v3 = new THREE.Vector3(), _s3 = new THREE.Vector3(), _c3 = new THREE.Color();

/* a flat-shaded, vertex-coloured copy of geo, moved into place */
function P(geo, hex, x, y, z, sx, sy, sz, rx, ry, rz) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  _eu.set(rx || 0, ry || 0, rz || 0); _q4.setFromEuler(_eu);
  _m4.compose(_v3.set(x || 0, y || 0, z || 0), _q4, _s3.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz));
  g.applyMatrix4(_m4);
  g.computeVertexNormals();
  const n = g.attributes.position.count, col = new Float32Array(n * 3);
  _c3.set(hex);
  for (let i = 0; i < n; i++) { col[i * 3] = _c3.r; col[i * 3 + 1] = _c3.g; col[i * 3 + 2] = _c3.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
function merge(list) {
  let n = 0;
  for (const g of list) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, o); nor.set(g.attributes.normal.array, o); col.set(g.attributes.color.array, o);
    o += g.attributes.position.count * 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return out;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg) => new THREE.CylinderGeometry(rt, rb, h, seg || 6);
const cone = (r, h, seg) => new THREE.ConeGeometry(r, h, seg || 6);
const ico = (r, d) => new THREE.IcosahedronGeometry(r, d || 0);
const octa = r => new THREE.OctahedronGeometry(r, 0);
const dode = r => new THREE.DodecahedronGeometry(r, 0);

/* --------------------------------------------------------- pixel atlases */

const FACE_ART = [
  // 0 neutral
  ['................', '................', '................', '................', '................', '...##.....##....', '...##.....##....', '...##.....##....', '................', '................', '......####......', '................', '................', '................', '................', '................'],
  // 1 happy
  ['................', '................', '................', '................', '...##.....##....', '..#..#...#..#...', '..#..#...#..#...', '................', '................', '.....#....#.....', '......####......', '................', '................', '................', '................', '................'],
  // 2 sad
  ['................', '................', '................', '....#......#....', '...#........#...', '...##.....##....', '...##.....##....', '................', '................', '......####......', '.....#....#.....', '................', '................', '................', '................', '................'],
  // 3 scared
  ['................', '................', '................', '..ooo....ooo....', '..o#o....o#o....', '..o#o....o#o....', '..ooo....ooo....', '................', '......####......', '......#rr#......', '......#rr#......', '......####......', '................', '................', '................', '................'],
  // 4 asleep / blink
  ['................', '................', '................', '................', '................', '................', '..####...####...', '................', '................', '................', '.......##.......', '................', '................', '................', '................', '................'],
  // 5 talking
  ['................', '................', '................', '................', '................', '...##.....##....', '...##.....##....', '...##.....##....', '................', '......####......', '......#rr#......', '......####......', '................', '................', '................', '................'],
  // 6 angry
  ['................', '................', '................', '..#..........#..', '...#........#...', '...##.....##....', '...##.....##....', '................', '................', '................', '.....######.....', '................', '................', '................', '................', '................'],
  // 7 awe
  ['................', '................', '................', '..ooo....ooo....', '..o#o....o#o....', '..ooo....ooo....', '................', '................', '....#......#....', '.....######.....', '.....#rrrr#.....', '......####......', '................', '................', '................', '................']
];
const ICON_PAL = { r: '#ff4f6e', y: '#ffd447', c: '#3fe8ff', g: '#4fd65a', k: '#1a1830', w: '#ffffff', p: '#ff8ad8', b: '#6f8cff', o: '#ff9d3c', s: '#9aa0b8' };
const ICON_ART = [
  /* heart */ ['.rr..rr.', 'rrrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '...rr...', '........'],
  /* bang  */ ['...oo...', '...oo...', '...oo...', '...oo...', '...oo...', '........', '...oo...', '...oo...'],
  /* what  */ ['..bbbb..', '.bb..bb.', '.....bb.', '....bb..', '...bb...', '........', '...bb...', '...bb...'],
  /* zzz   */ ['bbbb....', '..b.....', '.b..bbbb', 'bbbb..b.', '.....b..', '....bbbb', '........', '........'],
  /* food  */ ['....g...', '...gg...', '..rrrr..', '.rrrrrr.', '.rwrrrr.', '.rrrrrr.', '..rrrr..', '........'],
  /* bolt  */ ['....yy..', '...yy...', '..yy....', '.yyyyy..', '...yy...', '..yy....', '.yy.....', '........'],
  /* eye   */ ['........', '..kkkk..', '.kwwwwk.', 'kwwkkwwk', 'kwwkkwwk', '.kwwwwk.', '..kkkk..', '........'],
  /* spark */ ['...y....', '...y....', '..yyy...', 'yyyyyyy.', '..yyy...', '...y....', '...y....', '........'],
  /* note  */ ['...ppp..', '...p.pp.', '...p..p.', '...p....', '.ppp....', 'pppp....', '.pp.....', '........'],
  /* skull */ ['.ssssss.', 'ssssssss', 'skksskks', 'skksskks', 'ssssssss', '.ss..ss.', '.sksksk.', '........'],
  /* dots  */ ['........', '........', '........', 'kk.kk.kk', 'kk.kk.kk', '........', '........', '........'],
  /* bulb  */ ['..yyyy..', '.yyyyyy.', '.yywyyy.', '.yyyyyy.', '..yyyy..', '..ssss..', '..ssss..', '...ss...'],
  /* anger */ ['r......r', '.r....r.', '..rr.r..', '...rr...', '..r.rr..', '.r....r.', 'r......r', '........'],
  /* halo  */ ['........', '.yyyyyy.', 'yy....yy', 'yy....yy', '.yyyyyy.', '........', '........', '........'],
  /* chip  */ ['.c.cc.c.', 'cccccccc', '.cc..cc.', 'ccc..ccc', '.cc..cc.', 'cccccccc', '.c.cc.c.', '........'],
  /* leaf  */ ['.....gg.', '...gggg.', '..ggggg.', '.ggggg..', '.gggg...', '.gg.....', 'g.......', '........'],
  /* coin  */ ['..yyyy..', '.yoooyy.', 'yoyyyoyy', 'yoyyyyyy', 'yoyyyoyy', '.yoooyy.', '..yyyy..', '........'],
  /* fist  */ ['........', '.oooooo.', 'oowowowo', 'oooooooo', 'oooooooo', '.oooooo.', '..oooo..', '........'],
  /* baby  */ ['...pp...', '..pwwp..', '..pkkp..', '..pwwp..', '.pppppp.', 'pwwwwwwp', '.pppppp.', '........'],
  /* crown */ ['........', 'y..y..y.', 'yy.yy.yy', 'yyyyyyyy', 'yryycyyy', 'yyyyyyyy', '........', '........'],
  /* fish  */ ['........', '.....bb.', 'b..bbbbb', 'bbbbbwkb', 'b..bbbbb', '.....bb.', '........', '........'],
  /* dizzy */ ['.y....y.', 'yyy..yyy', '.y....y.', '...y....', '..yyy...', '...y....', '........', '........'],
  /* cup   */ ['.wwwww..', '.yyyyyo.', '.yyyyy.o', '.yyyyy.o', '.yyyyyo.', '.yyyyy..', '..yyy...', '........'],
  /* flag  */ ['.krrrr..', '.krrrrr.', '.krrrr..', '.k......', '.k......', '.k......', '.k......', '........']
];

function makeFaceAtlas() {
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 32;
  const g = cv.getContext('2d');
  FACE_ART.forEach((art, i) => {
    const ox = (i % 4) * 16, oy = ((i / 4) | 0) * 16;
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const ch = art[y][x];
      if (ch === '.') continue;
      g.fillStyle = ch === '#' ? '#1a1830' : ch === 'o' ? '#ffffff' : '#ff5f7a';
      g.fillRect(ox + x, oy + y, 1, 1);
    }
  });
  const t = new THREE.CanvasTexture(cv);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function makeIconAtlas() {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64;
  const g = cv.getContext('2d');
  ICON_ART.forEach((art, i) => {
    const ox = (i % 8) * 16, oy = ((i / 8) | 0) * 16;
    // speech bubble
    g.fillStyle = '#1a1830'; g.fillRect(ox + 1, oy, 14, 14); g.fillRect(ox, oy + 1, 16, 12); g.fillRect(ox + 6, oy + 14, 4, 1); g.fillRect(ox + 7, oy + 15, 2, 1);
    g.fillStyle = '#ffffff'; g.fillRect(ox + 2, oy + 1, 12, 12); g.fillRect(ox + 1, oy + 2, 14, 10); g.fillRect(ox + 7, oy + 13, 2, 1);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const ch = art[y][x];
      if (ch === '.') continue;
      g.fillStyle = ICON_PAL[ch]; g.fillRect(ox + 4 + x, oy + 3 + y, 1, 1);
    }
  });
  const t = new THREE.CanvasTexture(cv);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function setCellUV(geo, idx, cols, rows) {
  const u0 = (idx % cols) / cols, v1 = 1 - ((idx / cols) | 0) / rows, u1 = u0 + 1 / cols, v0 = v1 - 1 / rows;
  const uv = geo.attributes.uv;
  uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
  uv.needsUpdate = true;
}

/* ------------------------------------------------------------------ init */

const SHIRTS = ['#ff7a59', '#ffd166', '#5ad1ff', '#b08cff', '#ff8ad8', '#7be0a0', '#f2f2f2', '#ffa63d'];
const SKINS = ['#ffd9b8', '#f0b890', '#c98e62', '#8d5f43'];
const HAIRS = ['#3a2a20', '#6b4226', '#e0aa3e', '#1f1a2e', '#b5532f', '#ece6d6', '#8a3fbf'];
const SKY_KEYS = [
  { t: 0.00, top: '#5a6fd6', bot: '#ffc9a0', sun: '#ffd9b0', si: 1.7, hi: 1.25 },
  { t: 0.09, top: '#2f7df2', bot: '#bfeaff', sun: '#fff6e0', si: 2.5, hi: 1.5 },
  { t: 0.62, top: '#2f7df2', bot: '#bfeaff', sun: '#fff6e0', si: 2.5, hi: 1.5 },
  { t: 0.73, top: '#4b3a9c', bot: '#ff9d6e', sun: '#ffb37a', si: 1.6, hi: 1.2 },
  { t: 0.80, top: '#070a2a', bot: '#27306e', sun: '#8fa8ff', si: 0.85, hi: 1.05 },
  { t: 0.96, top: '#070a2a', bot: '#27306e', sun: '#8fa8ff', si: 0.85, hi: 1.05 },
  { t: 1.00, top: '#5a6fd6', bot: '#ffc9a0', sun: '#ffd9b0', si: 1.7, hi: 1.25 }
];

function initRender(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false });
  R.renderer = renderer; R.canvas = canvas;
  R.scene = new THREE.Scene();
  R.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 600);
  R.cam = { yaw: 0.7, pitch: 0.82, dist: 30, tx: 0, ty: 1.4, tz: 0, follow: 0, auto: false };
  R.ray = new THREE.Raycaster();

  R.mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  R.matGlow = new THREE.MeshBasicMaterial({ vertexColors: true });
  R.matShirt = SHIRTS.map(h => new THREE.MeshLambertMaterial({ color: h }));
  R.matSkin = SKINS.map(h => new THREE.MeshLambertMaterial({ color: h }));
  R.matLeg = new THREE.MeshLambertMaterial({ color: '#3a3550' });
  R.matHair = HAIRS.map(h => new THREE.MeshLambertMaterial({ color: h }));
  R.matShadow = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false });
  R.matCarry = { wood: new THREE.MeshLambertMaterial({ color: '#a8703f' }), stone: new THREE.MeshLambertMaterial({ color: '#a4a7bd' }), food: new THREE.MeshLambertMaterial({ color: '#ff4f6e' }) };
  R.faceTex = makeFaceAtlas();
  R.iconTex = makeIconAtlas();
  R.matHairGrey = new THREE.MeshLambertMaterial({ color: '#d8d8e0' });
  R.matFace = new THREE.MeshBasicMaterial({ map: R.faceTex, alphaTest: 0.5 });
  R.matIcon = new THREE.MeshBasicMaterial({ map: R.iconTex, transparent: true, alphaTest: 0.5, depthTest: false });
  R.matWire = new THREE.LineBasicMaterial({ color: 0x3fe8ff, transparent: true, opacity: 0.85 });

  // shared citizen geometry
  const G = R.geo = {};
  G.body = P(cyl(0.2, 0.3, 0.5, 6), '#ffffff'); G.body.deleteAttribute('color');
  G.head = ico(0.34, 1); G.head.computeVertexNormals();
  G.hair = ico(0.36, 1); G.hair.scale(1, 0.8, 0.96); G.hair.translate(0, 0.1, -0.11); G.hair.computeVertexNormals();
  G.arm = box(0.11, 0.3, 0.11); G.arm.translate(0, -0.13, 0);
  G.leg = box(0.13, 0.24, 0.14); G.leg.translate(0, -0.12, 0);
  G.carry = box(0.34, 0.26, 0.34);
  G.shadow = new THREE.CircleGeometry(0.4, 8); G.shadow.rotateX(-Math.PI / 2);
  G.hat = [
    merge([P(new THREE.TorusGeometry(0.24, 0.045, 4, 8), '#ffd447', 0, 0.5, 0, 1, 1, 1, Math.PI / 2)]),
    merge([P(cone(0.33, 0.46, 5), '#d92a4c', 0, 0.4, 0), P(cone(0.36, 0.1, 5), '#8f1730', 0, 0.2, 0)]),
    merge([P(cyl(0.025, 0.025, 0.3, 4), '#d8f8ff', 0, 0.45, 0), P(octa(0.1), '#3fe8ff', 0, 0.66, 0)]),
    merge([P(cyl(0.025, 0.025, 0.16, 4), '#3f9d4a', 0, 0.38, 0), P(octa(0.14), '#8dff7a', 0.12, 0.5, 0, 1, 0.3, 0.6, 0, 0, 0.5), P(octa(0.14), '#5fe060', -0.12, 0.5, 0, 1, 0.3, 0.6, 0, 0, -0.5)])
  ];
  R.hatMat = [R.matGlow, R.mat, R.matGlow, R.mat];
  G.crown = merge([P(cyl(0.2, 0.17, 0.12, 6), '#ffd447', 0, 0, 0), P(cone(0.05, 0.14, 4), '#ffd447', 0.16, 0.12, 0), P(cone(0.05, 0.14, 4), '#ffd447', -0.16, 0.12, 0),
    P(cone(0.05, 0.14, 4), '#ffd447', 0, 0.12, 0.16), P(cone(0.05, 0.14, 4), '#ffd447', 0, 0.12, -0.16), P(octa(0.05), '#ff4f6e', 0, 0.02, 0.19)]);
  G.pole = merge([P(cyl(0.05, 0.06, 3.2, 5), '#d9d2c0', 0, 1.6, 0), P(octa(0.1), '#ffffff', 0, 3.25, 0)]);
  G.cloth = merge([P(box(1.1, 0.7, 0.04), '#ffffff', 0.58, 2.75, 0)]);
  G.grave = merge([P(box(0.34, 0.5, 0.12), '#b9bccf', 0, 0.25, 0), P(box(0.5, 0.1, 0.4), '#8e91a8', 0, 0.05, 0)]);
  G.ring = new THREE.RingGeometry(0.82, 1, 20); G.ring.rotateX(-Math.PI / 2);

  buildSky();
  buildFx();
  R.root = new THREE.Group(); R.scene.add(R.root);
  R.ready = true;
  resizeRender();
}

function resizeRender() {
  if (!R.ready) return;
  const w = Math.max(1, R.canvas.clientWidth), h = Math.max(1, R.canvas.clientHeight);
  const dpr = window.devicePixelRatio || 1;
  let pr = R.retro ? clamp(540 / Math.min(w, h), 0.5, Math.min(dpr, 2)) : Math.min(dpr, 2);
  const maxPx = R.retro ? 1.1e6 : 2.6e6;
  if (w * h * pr * pr > maxPx) pr = Math.sqrt(maxPx / (w * h));
  R.renderer.setPixelRatio(pr);
  R.renderer.setSize(w, h, false);
  R.canvas.style.imageRendering = R.retro ? 'pixelated' : 'auto';
  R.w = w; R.h = h;
  const aspect = w / h;
  R.camera.aspect = aspect;
  R.camera.fov = aspect < 1 ? Math.min(72, 2 * Math.atan(Math.tan(0.33) / aspect) * 180 / Math.PI) : 40;
  R.camera.updateProjectionMatrix();
}

/* ------------------------------------------------------------------- sky */

function buildSky() {
  const sc = R.scene;
  R.skyU = { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, glow: { value: new THREE.Color(0, 0, 0) } };
  R.sky = new THREE.Mesh(new THREE.SphereGeometry(300, 16, 10), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: R.skyU,
    vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bot; uniform vec3 glow; varying float h; void main(){ float t = smoothstep(-0.35, 0.55, h); vec3 c = mix(bot, top, t) + glow * (1.0 - abs(h)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'
  }));
  R.sky.renderOrder = -10; R.sky.frustumCulled = false;
  sc.add(R.sky);

  const rnd = mulberry32(77), sp = new Float32Array(220 * 3);
  for (let i = 0; i < 220; i++) {
    const a = rnd() * TAU, y = rnd() * 1.6 - 0.6, r = Math.sqrt(Math.max(0.05, 1 - y * y * 0.4));
    sp[i * 3] = Math.sin(a) * r * 240; sp[i * 3 + 1] = y * 200; sp[i * 3 + 2] = Math.cos(a) * r * 240;
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  R.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
  R.stars.frustumCulled = false;
  sc.add(R.stars);

  // the grid under everything: this is a simulation and it does not hide it
  R.grid = new THREE.GridHelper(520, 52, 0x3fe8ff, 0x2a5fd0);
  R.grid.position.y = SEA_Y - 0.9;
  R.grid.material.transparent = true; R.grid.material.opacity = 0.32; R.grid.material.depthWrite = false;
  sc.add(R.grid);

  R.hemi = new THREE.HemisphereLight(0xcfe8ff, 0x6a5a8a, 1.5);
  R.sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sc.add(R.hemi); sc.add(R.sun); sc.add(R.sun.target);
  R.fireLight = new THREE.PointLight(0xff9a3c, 0, 13, 1.6);
  R.fireLight.position.set(0, 2.2, 0);
  sc.add(R.fireLight);

  // clouds drift around and below the island
  R.clouds = new THREE.Group();
  const cr = mulberry32(5);
  for (let i = 0; i < 9; i++) {
    const parts = [];
    const n = 3 + ((cr() * 3) | 0);
    for (let k = 0; k < n; k++) parts.push(P(ico(1.6 + cr() * 1.6, 0), k % 2 ? '#ffffff' : '#e6f1ff', (k - n / 2) * 2.1, cr() * 0.8, cr() * 1.6 - 0.8, 1, 0.55, 1, 0, cr() * 3, 0));
    const m = new THREE.Mesh(merge(parts), R.mat);
    const a = i / 9 * TAU + cr() * 0.5, rad = 30 + cr() * 22;
    m.position.set(Math.sin(a) * rad * 2.2, 22 + cr() * 8, Math.cos(a) * rad * 2.2);
    m.rotation.y = cr() * TAU; m.scale.setScalar(0.9 + cr() * 0.9);
    R.clouds.add(m);
  }
  sc.add(R.clouds);
}

const _ca = new THREE.Color(), _cb = new THREE.Color();
function updateSky(S, dt) {
  const d = S.day;
  let i = 0;
  while (i < SKY_KEYS.length - 2 && SKY_KEYS[i + 1].t <= d) i++;
  const a = SKY_KEYS[i], b = SKY_KEYS[i + 1], f = clamp((d - a.t) / (b.t - a.t), 0, 1);
  R.skyU.top.value.copy(_ca.set(a.top)).lerp(_cb.set(b.top), f);
  R.skyU.bot.value.copy(_ca.set(a.bot)).lerp(_cb.set(b.bot), f);
  R.sun.color.copy(_ca.set(a.sun)).lerp(_cb.set(b.sun), f);
  R.sun.intensity = lerp(a.si, b.si, f) + R.flashL * 6;
  R.hemi.intensity = lerp(a.hi, b.hi, f) + R.flashL * 3;
  // the ruling idea colours the whole world
  for (let k = 0; k < 4; k++) {
    const w = R.ageW[k], T = AGE_LOOK[k];
    if (w < 0.002) continue;
    const day = 1 - 0.6 * smooth(0.74, 0.8, d) * (1 - smooth(0.96, 1, d));
    R.skyU.top.value.lerp(_ca.set(T.top), w * T.mix * day);
    R.skyU.bot.value.lerp(_ca.set(T.bot), w * T.mix * day);
    R.sun.color.lerp(_ca.set(T.sun), w * 0.85);
    R.sun.intensity *= 1 + w * T.light;
    R.hemi.intensity *= 1 + w * T.light * 0.6;
  }
  R.hemi.color.copy(R.skyU.bot.value).lerp(_ca.set('#ffffff'), 0.5);
  R.hemi.groundColor.set('#6a5a8a');
  for (let k = 0; k < 4; k++) if (R.ageW[k] > 0.002) R.hemi.groundColor.lerp(_ca.set(AGE_LOOK[k].top), R.ageW[k] * 0.6);
  const night = smooth(0.74, 0.8, d) * (1 - smooth(0.96, 1, d));
  R.night = night;
  R.stars.material.opacity = night * 0.9;
  R.fireLight.intensity = 6 + night * 26 + Math.sin(R.time * 11) * 2;
  const sa = d / NIGHT_FROM * Math.PI;
  if (d < NIGHT_FROM) R.sun.position.set(Math.cos(sa) * 30, 14 + Math.sin(sa) * 30, 18);
  else R.sun.position.set(-12, 30, -16);
  R.clouds.rotation.y += dt * 0.012;
  R.grid.material.opacity = 0.22 + night * 0.3 + (R.singT >= 0 ? 0.3 : 0) + R.ageW[ACCEL] * (0.25 + 0.2 * Math.sin(R.time * 3));
  R.grid.position.z = (R.grid.position.z + dt * 6 * R.ageW[ACCEL]) % 10;
  R.stars.material.opacity = Math.max(R.stars.material.opacity, R.ageW[ACCEL] * 0.35);
  for (const m of R.clouds.children) m.material = R.ageW[DREAD] > 0.5 ? R.matCloudDark : R.mat;
  // after the singularity the sky keeps a faint tint of whatever they built it for
  if (R.singT >= 0) {
    R.singT += dt;
    const k = Math.max(0.08, 1 - R.singT / 14);
    R.skyU.glow.value.set(R.singHex || '#ff5fd2').multiplyScalar(0.5 * k);
  } else R.skyU.glow.value.setScalar(0);
  R.flashL = Math.max(0, R.flashL - dt * 4);
}

/* ------------------------------------------------------------ atmosphere
   Each Age has its own look: a sky tint, a light level, a particle field and one
   signature event. Weights fade in and out over a few seconds. After the Singularity
   the island keeps the look of the idea it was built for (all four, faintly, for the
   Compromise). Render only: nothing here touches the sim. */
const AGE_LOOK = [
  { top: '#c48a2a', bot: '#fff0b8', sun: '#ffe2a0', mix: 0.5, light: 0.12, col: '#ffd447', n: 90 },   // devotion: gold, rising motes
  { top: '#3a0614', bot: '#d8452e', sun: '#ff7a5c', mix: 0.5, light: -0.28, col: '#ff5a3c', n: 110 },  // dread: blood sky, falling embers, lightning
  { top: '#03384e', bot: '#7ff6ff', sun: '#bff8ff', mix: 0.42, light: 0.05, col: '#3fe8ff', n: 130 },  // acceleration: data rain upward, live grid
  { top: '#2f7f4a', bot: '#eaffc8', sun: '#fff3c8', mix: 0.3, light: 0.08, col: '#b6ff6a', n: 70 }    // kinship: fireflies
];
function initAtmos() {
  R.ageW = [0, 0, 0, 0];
  R.boltT = 6;
  R.matCloudDark = new THREE.MeshLambertMaterial({ vertexColors: true, color: '#5a4650' });
  R.atm = AGE_LOOK.map((L, k) => {
    const pos = new Float32Array(L.n * 3), g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.Points(g, new THREE.PointsMaterial({ color: L.col, size: [0.5, 0.42, 0.34, 0.55][k], transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false }));
    m.frustumCulled = false; m.visible = false;
    R.scene.add(m);
    const P = []; const rr = mulberry32(31 + k);
    for (let i = 0; i < L.n; i++) P.push({ x: 0, y: 0, z: 0, h: 0, ph: rr() * TAU, sp: 0.6 + rr() * 0.8, live: false });
    return { m, pos, P, rr };
  });
}
function atmSpawn(S, k, p, fresh) {
  const r = Math.sqrt(Math.random()) * 15, a = Math.random() * TAU;
  p.x = Math.sin(a) * r; p.z = Math.cos(a) * r;
  const gy = groundY(S.world, p.x, p.z);
  p.h = gy;
  if (k === DEV) p.y = gy + (fresh ? Math.random() * 7 : 0);
  else if (k === DREAD) p.y = gy + (fresh ? Math.random() * 12 : 12 + Math.random() * 3);
  else if (k === ACCEL) p.y = gy + (fresh ? Math.random() * 14 : 0);
  else p.y = gy + 0.4 + Math.random() * 1.6;
  p.live = true;
}
function updateAtmos(S, dt) {
  if (!R.atm) initAtmos();
  for (let k = 0; k < 4; k++) {
    let tgt;
    if (S.sandbox) tgt = S.ending >= 0 ? (S.ending === k ? 1 : 0) : 0.4;
    else tgt = S.age === k ? 1 : 0;
    R.ageW[k] += (tgt - R.ageW[k]) * Math.min(1, dt * 0.45);
    const A = R.atm[k], w = R.ageW[k];
    A.m.visible = w > 0.01;
    if (!A.m.visible) { for (const p of A.P) p.live = false; continue; }
    const night = R.night || 0;
    A.m.material.opacity = w * (k === KIN ? 0.35 + 0.65 * night : k === DEV ? 0.8 : 0.9);
    const T = R.time;
    for (let i = 0; i < A.P.length; i++) {
      const p = A.P[i];
      if (!p.live) atmSpawn(S, k, p, true);
      if (k === DEV) {            // motes drift up and sway, like dust in a cathedral
        p.y += dt * 0.55 * p.sp; p.x += Math.sin(T * 0.8 + p.ph) * dt * 0.25;
        if (p.y > p.h + 8) atmSpawn(S, k, p, false);
      } else if (k === DREAD) {   // embers fall, slanting in a hot wind
        p.y -= dt * 0.9 * p.sp; p.x += dt * 0.7; p.z += Math.sin(T + p.ph) * dt * 0.3;
        if (p.y < p.h) atmSpawn(S, k, p, false);
      } else if (k === ACCEL) {   // the island uploads itself: straight fast streams
        p.y += dt * 3.2 * p.sp;
        if (p.y > p.h + 16) atmSpawn(S, k, p, false);
      } else {                    // fireflies wander and blink
        p.x += Math.sin(T * 0.6 * p.sp + p.ph) * dt * 0.5; p.z += Math.cos(T * 0.5 * p.sp + p.ph * 1.7) * dt * 0.5;
        p.y = p.h + 0.9 + Math.sin(T * 0.9 + p.ph) * 0.6;
      }
      // a firefly that is between blinks sits far below the world
      const off = k === KIN && Math.sin(T * 2.2 * p.sp + p.ph * 5) < -0.3 ? -999 : 0;
      A.pos[i * 3] = p.x; A.pos[i * 3 + 1] = p.y + off; A.pos[i * 3 + 2] = p.z;
    }
    A.m.geometry.attributes.position.needsUpdate = true;
  }
  // the edges of the view take the colour of the ruling idea
  if (!R.tintEl) R.tintEl = document.getElementById('ageTint');
  if (R.tintEl) {
    let best = -1, bw = 0;
    for (let k = 0; k < 4; k++) if (R.ageW[k] > bw) { bw = R.ageW[k]; best = k; }
    const key = best < 0 || bw < 0.02 ? -1 : best;
    if (key !== R.tintK) {
      R.tintK = key;
      if (key >= 0) R.tintEl.style.background = 'radial-gradient(ellipse at center, transparent 40%, ' + AGE_LOOK[key].col + ' 135%)';
    }
    // only touch the DOM when the value moves a visible step
    const op = key < 0 ? 0 : Math.round(bw * (key === DREAD ? 0.55 : 0.4) * 50) / 50;
    if (op !== R.tintOp) { R.tintOp = op; R.tintEl.style.opacity = op; R.tintEl.hidden = op === 0; }
  }
  // dread's signature: dry lightning over the island
  if (R.ageW[DREAD] > 0.6) {
    R.boltT -= dt;
    if (R.boltT <= 0) {
      R.boltT = 9 + Math.random() * 12;
      R.flashL = Math.max(R.flashL, 0.55);
      { const a = Math.random() * TAU, r = 26 + Math.random() * 14; fxBeam(Math.sin(a) * r, -14, Math.cos(a) * r, '#ffd0c0'); }
      if (typeof sfx === 'function') sfx('thunder');
    }
  }
}

/* ----------------------------------------------------------------- world */

function disposeTree(o) {
  o.traverse(n => { if (n.geometry && !n.userData.shared) n.geometry.dispose(); });
}

function resetRender(S) {
  const W = S.world;
  if (R.world) { R.root.remove(R.world); disposeTree(R.world); }
  for (const k of ['cit', 'bld', 'grv']) if (R[k]) R[k].forEach(o => { R.root.remove(o.g); if (o.icon) R.root.remove(o.icon); });
  if (R.flags) R.flags.forEach(o => { R.root.remove(o.g); o.cloth.material.dispose(); });
  if (R.boats) R.boats.forEach(g => R.root.remove(g));
  R.flags = new Map();
  R.cit = new Map(); R.bld = new Map(); R.grv = new Map();
  R.world = new THREE.Group(); R.root.add(R.world);
  R.singT = S.sandbox ? 30 : -1;
  if (R.ageW) R.ageW.fill(0);   // a new or loaded island starts from a neutral sky and fades into its idea
  R.singHex = S.sandbox && S.ending >= 0 ? BELIEFS[S.ending].hex : '#ff5fd2';
  R.flashL = 0;

  // ---- every isle in the archipelago (hidden until someone has seen it)
  R.isles = []; R.terrains = [];
  for (const I of W.isles) {
    const g = buildIsle(W, I);
    R.world.add(g); R.isles.push(g);
  }
  R.water = R.isles[0].userData.pond;

  // ---- the sea, and the fog over everything nobody has seen
  buildSea();
  buildFog();
  R.boats = new Map();
  R.fogV = -1;

  // ---- instanced resource nodes
  const CAP = 700;
  const treeG = merge([P(cyl(0.12, 0.17, 0.7, 5), '#8a5a35', 0, 0.35, 0), P(cone(0.8, 1.15, 6), '#2f9e4f', 0, 1.15, 0),
    P(cone(0.6, 0.95, 6), '#3fb95a', 0, 1.75, 0, 1, 1, 1, 0, 0.5, 0), P(cone(0.38, 0.75, 6), '#62d672', 0, 2.3, 0)]);
  const rockG = merge([P(dode(0.6), '#9a9db3', 0, 0.3, 0, 1, 0.75, 1), P(dode(0.36), '#7f829a', 0.45, 0.2, 0.2, 1, 0.8, 1, 0.4, 0.8, 0)]);
  const bushG = merge([P(ico(0.48), '#2f9e4f', 0, 0.3, 0, 1, 0.78, 1), P(ico(0.3), '#3fb95a', 0.3, 0.25, 0.15)]);
  const berryG = merge([P(octa(0.11), '#ff4f6e', 0.2, 0.62, 0.15), P(octa(0.11), '#ff4f6e', -0.22, 0.5, 0.2), P(octa(0.11), '#ff7a8f', 0.05, 0.55, -0.3), P(octa(0.1), '#ff4f6e', 0.45, 0.42, -0.05)]);
  R.inst = {};
  const mk = (name, geo) => { const m = new THREE.InstancedMesh(geo, R.mat, CAP); m.count = 0; m.frustumCulled = false; R.world.add(m); R.inst[name] = m; };
  mk('tree', treeG); mk('rock', rockG); mk('bush', bushG); mk('berry', berryG);
  R.nodeT = 0;
  syncNodes(S, true);
}

/* one isle: terrain from its grid, a rocky skirt down into the sea, and its pond */
function buildIsle(W, I) {
  const G = new THREE.Group(), cx = I.cx || 0, cz = I.cz || 0;
  const N = I.gn, n1 = N + 1, cnt = n1 * n1;
  const VX = new Float32Array(cnt), VY = new Float32Array(cnt), VZ = new Float32Array(cnt), IN = new Uint8Array(cnt);
  for (let j = 0; j < n1; j++) for (let i = 0; i < n1; i++) {
    const k = j * n1 + i, x = -I.gh + i * I.gc, z = -I.gh + j * I.gc;
    const r = hyp(x, z), ang = Math.atan2(x, z), rim = rimR(I, ang);
    if (r <= rim) { IN[k] = 1; VX[k] = x; VZ[k] = z; VY[k] = I.grid[k]; }
    else { VX[k] = Math.sin(ang) * rim; VZ[k] = Math.cos(ang) * rim; VY[k] = heightRaw(I, VX[k] * 0.98, VZ[k] * 0.98) - 0.12; }
  }
  const pos = [], col = [];
  const cr = mulberry32(W.seed + 5 + I.id * 31);
  const tri = (a, b, c) => {
    if (!IN[a] && !IN[b] && !IN[c]) return;
    pos.push(VX[a] + cx, VY[a], VZ[a] + cz, VX[b] + cx, VY[b], VZ[b] + cz, VX[c] + cx, VY[c], VZ[c] + cz);
    terrainColor(I, (VX[a] + VX[b] + VX[c]) / 3, (VY[a] + VY[b] + VY[c]) / 3, (VZ[a] + VZ[b] + VZ[c]) / 3, cr, _c3);
    for (let q = 0; q < 3; q++) col.push(_c3.r, _c3.g, _c3.b);
  };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * n1 + i, b = a + 1, c = a + n1, d = c + 1; tri(a, c, b); tri(d, b, c); }
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  tg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
  tg.computeVertexNormals();
  const terrain = new THREE.Mesh(tg, R.mat);
  G.add(terrain); R.terrains.push(terrain);
  if (!I.id) R.terrain = terrain;
  // the rock underneath, going down into the sea
  const M = 32, layers = [[0.99, 0.2, '#c9b07a'], [0.97, -0.6, '#9a7a55'], [0.86, -2.4, '#6f5673'], [0.6, -4.8, '#4a3d6a']];
  const up = [], uc = [];
  const ring = (L, k) => {
    const ang = k / M * TAU, lay = layers[L];
    const jit = L === 0 ? 1 : 0.9 + 0.2 * I.noise(k * 0.9 + L * 7, L * 3.3);
    const rr = rimR(I, ang) * lay[0] * jit;
    return [cx + Math.sin(ang) * rr, lay[1] + (L === 0 ? 0 : (I.noise(k * 1.3, L * 9.1) - 0.5) * 0.6), cz + Math.cos(ang) * rr];
  };
  const push3 = (p, hex, shade) => { up.push(p[0], p[1], p[2]); _c3.set(hex).multiplyScalar(shade); uc.push(_c3.r, _c3.g, _c3.b); };
  for (let k = 0; k < M; k++) {
    for (let L = 0; L < layers.length - 1; L++) {
      const a = ring(L, k), b = ring(L, k + 1), c = ring(L + 1, k), d = ring(L + 1, k + 1);
      const hex = layers[L + 1][2], sh = 0.9 + cr() * 0.2;
      push3(a, hex, sh); push3(b, hex, sh); push3(c, hex, sh);
      push3(b, hex, sh); push3(d, hex, sh); push3(c, hex, sh);
    }
  }
  const ug = new THREE.BufferGeometry();
  ug.setAttribute('position', new THREE.BufferAttribute(new Float32Array(up), 3));
  ug.setAttribute('color', new THREE.BufferAttribute(new Float32Array(uc), 3));
  ug.computeVertexNormals();
  G.add(new THREE.Mesh(ug, R.mat));
  if (I.pond) {
    const wg = new THREE.CircleGeometry(I.pond.r + (I.id ? 1.1 : 1.5), 12); wg.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(wg, new THREE.MeshBasicMaterial({ color: '#3bb9ff', transparent: true, opacity: 0.84 }));
    water.position.set(cx + I.pond.x, I.waterY, cz + I.pond.z);
    G.add(water); G.userData.pond = water;
  }
  return G;
}
function buildSea() {
  if (R.sea) return;
  const g = new THREE.PlaneGeometry(WORLD_HALF * 2 + 260, WORLD_HALF * 2 + 260, 56, 56); g.rotateX(-Math.PI / 2);
  R.seaBase = Float32Array.from(g.attributes.position.array);
  R.sea = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: '#2b86d6', transparent: true, opacity: 0.86, flatShading: true }));
  R.sea.position.y = SEA_Y; R.sea.renderOrder = 1;
  R.scene.add(R.sea);
}
function updateSea(dt) {
  const a = R.sea.geometry.attributes.position, b = R.seaBase, t = R.time;
  for (let i = 0; i < a.count; i++) {
    const x = b[i * 3], z = b[i * 3 + 2];
    a.array[i * 3 + 1] = Math.sin(x * 0.11 + t * 0.9) * 0.12 + Math.cos(z * 0.13 + t * 0.7) * 0.1;
  }
  a.needsUpdate = true;
  R.sea.geometry.computeVertexNormals();
  R.sea.material.color.set('#2b86d6').lerp(_ca.set('#0c1c4a'), (R.night || 0) * 0.7);
}
/* fog: a mesh that exists only over places nobody has seen, with soft edges
   (vertex alpha) where it meets the known world. Two lumpy layers. */
function buildFog() {
  if (R.fog) return;
  R.fogMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  R.fog = [];
}
function paintFog(S) {
  for (const m of R.fog) { R.scene.remove(m); m.geometry.dispose(); }
  R.fog = [];
  const N = FOG_N, n1 = N + 1, cell = FOG_CELL, H = WORLD_HALF;
  const unk = (i, j) => (i < 0 || j < 0 || i >= N || j >= N) ? 1 : (S.fog[j * N + i] ? 0 : 1);
  // corner opacity: how many of the four cells around a corner are unknown
  const A = new Float32Array(n1 * n1);
  for (let j = 0; j < n1; j++) for (let i = 0; i < n1; i++) A[j * n1 + i] = (unk(i - 1, j - 1) + unk(i, j - 1) + unk(i - 1, j) + unk(i, j)) / 4;
  const rr = mulberry32(11);
  const jitter = new Float32Array(n1 * n1).map(() => rr());
  for (const [y0, amp, op] of [[2.4, 0.9, 0.96], [7.5, 1.6, 0.55]]) {
    const pos = [], col = [];
    const v = (i, j) => {
      const k = j * n1 + i, a = A[k] * A[k] * (3 - 2 * A[k]);
      pos.push(-H + i * cell, y0 + (jitter[k] - 0.5) * amp + a * 0.6, -H + j * cell);
      const sh = 0.9 + jitter[k] * 0.1;
      col.push(sh, sh, Math.min(1, sh + 0.04), a * op);
    };
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      if (A[j * n1 + i] + A[j * n1 + i + 1] + A[(j + 1) * n1 + i] + A[(j + 1) * n1 + i + 1] === 0) continue;
      v(i, j); v(i, j + 1); v(i + 1, j); v(i + 1, j); v(i, j + 1); v(i + 1, j + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 4));
    const m = new THREE.Mesh(g, R.fogMat);
    m.renderOrder = 5 + R.fog.length; m.frustumCulled = false;
    R.scene.add(m); R.fog.push(m);
  }
}

/* boats: a hull, a mast and a sail in the colour of the settlement's creed */
function makeBoatMesh() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(merge([P(box(1.2, 0.36, 2.6), '#8a5a35', 0, 0.12, 0), P(box(1.0, 0.1, 2.3), '#b98a52', 0, 0.32, 0), P(cone(0.6, 0.9, 4), '#7a4a2a', 0, 0.12, 1.6, 1, 0.4, 1, Math.PI / 2, Math.PI / 4, 0),
    P(cyl(0.05, 0.06, 2.6, 4), '#d9d2c0', 0, 1.5, -0.1)]), R.mat));
  const sail = new THREE.Mesh(merge([P(box(1.3, 1.5, 0.04), '#ffffff', 0, 1.75, -0.05)]), new THREE.MeshLambertMaterial({ color: '#f4efe0', side: THREE.DoubleSide }));
  g.add(sail); g.userData.sail = sail;
  return g;
}
function syncBoats(S, alpha, dt) {
  const seen = new Set();
  for (const b of S.boats || []) {
    seen.add(b.id);
    let g = R.boats.get(b.id);
    if (!g) { g = makeBoatMesh(); R.root.add(g); R.boats.set(b.id, g); }
    const x = lerp(b.px === undefined ? b.x : b.px, b.x, alpha), z = lerp(b.pz === undefined ? b.z : b.pz, b.z, alpha);
    g.position.set(x, SEA_Y + Math.sin(R.time * 2 + b.id) * 0.07, z);
    g.rotation.set(Math.sin(R.time * 1.6 + b.id) * 0.05, b.ang, Math.sin(R.time * 1.3 + b.id) * 0.06);
    const t = setById(S, b.set), hex = t.k >= 0 ? BELIEFS[t.k].hex : '#f4efe0';
    g.userData.sail.material.color.set(hex).lerp(_ca.set('#ffffff'), 0.45);
    g.userData.sail.scale.set(1, b.st === 'docked' ? 0.35 : 1, 1);
    const rows = Math.ceil((b.crew ? b.crew.length : 0) / 2);
    g.scale.set(1, 1, Math.max(1, rows * 0.62 / 2.0 + 0.35));
  }
  R.boats.forEach((g, id) => { if (!seen.has(id)) { R.root.remove(g); R.boats.delete(id); } });
}

function terrainColor(W, x, y, z, rnd, out) {
  const dm = W.mountain ? hyp(x - W.mountain.x, z - W.mountain.z) : 99, dp = W.pond ? hyp(x - W.pond.x, z - W.pond.z) : 99, r = hyp(x, z);
  const d = r / rimR(W, Math.atan2(x, z));
  let hex;
  if (y > 6.1) hex = rnd() < 0.5 ? '#f6f9ff' : '#dfe8ff';
  else if (W.mountain && dm < W.mountain.r + 0.9 && y > 2.5) hex = rnd() < 0.5 ? '#8f91a8' : '#7c7e97';
  else if (W.pond && dp < W.pond.r + 1.2) hex = rnd() < 0.5 ? '#ecd9a0' : '#e2cc8c';
  else if (!W.id && r < 3.4) hex = rnd() < 0.5 ? '#d6b47c' : '#cba86e';
  else if (d > 0.9) hex = rnd() < 0.5 ? '#f0dca0' : '#e6cf8c';
  else if (d > 0.84) hex = rnd() < 0.5 ? '#b9e06a' : '#a6d65e';
  else {
    const n = W.noise(x * 0.22 + 20, z * 0.22 + 20);
    hex = W.kind === 'stone' ? (n < 0.5 ? '#8fa36a' : '#9aa080') : n < 0.38 ? '#4fc04f' : n < 0.62 ? '#63d35a' : '#86e267';
  }
  out.set(hex).multiplyScalar(0.93 + rnd() * 0.14);
  return out;
}

const _dummy = new THREE.Object3D();
function syncNodes(S, force) {
  const W = S.world, idx = { tree: 0, rock: 0, bush: 0 };
  const I = R.inst;
  for (let i = 0; i < W.nodes.length; i++) {
    const n = W.nodes[i], k = idx[n.type]++;
    if (k >= 700) continue;
    let s = 0;
    if (!n.dead && (!S.found || S.found[n.isle || 0])) {
      if (n.type === 'tree') s = n.amount > 0 ? n.scale * (0.72 + 0.28 * n.amount / n.max) : n.scale * (0.18 + 0.4 * (1 - clamp(n.regrow / 80, 0, 1)));
      else if (n.type === 'rock') s = n.scale * (n.amount > 0 ? 0.5 + 0.5 * n.amount / n.max : 0.28);
      else s = n.scale * 0.95;
    }
    _dummy.position.set(n.x, groundY(W, n.x, n.z) - 0.05, n.z);
    _dummy.rotation.set(0, n.rot, 0); _dummy.scale.setScalar(s);
    _dummy.updateMatrix();
    I[n.type].setMatrixAt(k, _dummy.matrix);
    if (n.type === 'bush') {
      _dummy.scale.setScalar(n.dead || n.amount <= 0 || (S.found && !S.found[n.isle || 0]) ? 0 : n.scale * (0.6 + 0.4 * n.amount / n.max));
      _dummy.updateMatrix();
      I.berry.setMatrixAt(k, _dummy.matrix);
    }
  }
  for (const t of ['tree', 'rock', 'bush']) {
    if (I[t].count !== idx[t]) force = true;
    I[t].count = Math.min(700, idx[t]); I[t].instanceMatrix.needsUpdate = true;
    if (force) {
      for (let k = 0; k < I[t].count; k++) { _c3.setScalar(1).offsetHSL(0, 0, (((k * 37) % 10) - 5) * 0.012); I[t].setColorAt(k, _c3); }
      if (I[t].instanceColor) I[t].instanceColor.needsUpdate = true;
    }
  }
  I.berry.count = I.bush.count; I.berry.instanceMatrix.needsUpdate = true;
}

/* ------------------------------------------------------------- buildings */

function makeBuilding(b) {
  const g = new THREE.Group(), o = { g, type: b.type, built: b.built, pop: b.built ? 1 : 0, parts: {} };
  const body = new THREE.Group(); g.add(body); o.body = body;
  const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat || R.mat); body.add(m); return m; };
  const rnd = mulberry32(b.id * 131 + 7);
  let h = 2;
  if (b.type === 'fire') {
    const parts = [];
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; parts.push(P(dode(0.2), i % 2 ? '#9a9db3' : '#7f829a', Math.sin(a) * 0.62, 0.1, Math.cos(a) * 0.62, 1, 0.8, 1, 0, a, 0)); }
    parts.push(P(box(0.9, 0.14, 0.16), '#7a4a2a', 0, 0.16, 0, 1, 1, 1, 0, 0.6, 0.12), P(box(0.9, 0.14, 0.16), '#8a5a35', 0, 0.2, 0, 1, 1, 1, 0, -0.7, -0.12));
    parts.push(P(box(0.6, 0.5, 0.6), '#b98a52', 1.25, 0.25, 0.5, 1, 1, 1, 0, 0.3, 0), P(box(0.5, 0.4, 0.5), '#a8793f', 1.3, 0.7, 0.45, 1, 1, 1, 0, 0.8, 0), P(box(0.55, 0.45, 0.55), '#c79a62', 0.75, 0.22, 1.15, 1, 1, 1, 0, 1.1, 0));
    parts.push(P(cyl(0.035, 0.035, 2.3, 4), '#d9d2c0', -1.15, 1.15, 0.6), P(box(0.62, 0.36, 0.04), '#ff5fd2', -0.82, 2.08, 0.6));
    add(merge(parts));
    o.parts.flame = add(merge([P(cone(0.3, 0.8, 5), '#ff9d3c', 0, 0.6, 0), P(cone(0.17, 0.5, 4), '#ffe36e', 0, 0.55, 0)]), R.matGlow);
    h = 1.4;
  } else if (b.type === 'hut') {
    const roof = ['#e8554e', '#e98b3a', '#4e8fe8', '#b565d9', '#e8c53a'][(rnd() * 5) | 0];
    add(merge([P(cyl(0.95, 1.02, 1.0, 6), '#f4e4bc', 0, 0.5, 0), P(cone(1.38, 1.05, 6), roof, 0, 1.52, 0), P(cone(0.5, 0.4, 6), '#fff3d6', 0, 2.1, 0, 0.4, 1, 0.4),
      P(box(0.42, 0.62, 0.1), '#6b4226', 0, 0.31, 0.93), P(box(1.9, 0.12, 1.9), '#c9b48a', 0, 0.03, 0, 1, 1, 1, 0, 0.5, 0)]));
    o.parts.window = add(merge([P(box(0.3, 0.3, 0.06), '#ffe98a', 0.62, 0.62, 0.72, 1, 1, 1, 0, 0.72, 0), P(box(0.3, 0.3, 0.06), '#ffe98a', -0.62, 0.62, 0.72, 1, 1, 1, 0, -0.72, 0)]), R.matGlow);
    h = 2.2;
  } else if (b.type === 'farm') {
    const parts = [P(box(2.9, 0.14, 2.9), '#8a5c38', 0, 0.05, 0)];
    for (let i = 0; i < 4; i++) parts.push(P(box(2.6, 0.1, 0.34), '#6f4526', 0, 0.14, -1.05 + i * 0.7));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) parts.push(P(box(0.12, 0.6, 0.12), '#d9c7a0', sx * 1.45, 0.3, sz * 1.45));
    parts.push(P(box(2.9, 0.07, 0.07), '#d9c7a0', 0, 0.45, 1.45), P(box(2.9, 0.07, 0.07), '#d9c7a0', 0, 0.45, -1.45), P(box(0.07, 0.07, 2.9), '#d9c7a0', -1.45, 0.45, 0));
    add(merge(parts));
    const crops = [], ripe = [];
    for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) {
      crops.push(P(cone(0.16, 0.55, 4), '#57cf5a', -0.98 + k * 0.65, 0.42, -1.05 + i * 0.7));
      ripe.push(P(octa(0.13), (i + k) % 2 ? '#ffb23d' : '#ff6a4a', -0.98 + k * 0.65, 0.66, -1.05 + i * 0.7));
    }
    o.parts.crops = add(merge(crops));
    o.parts.ripe = add(merge(ripe));
    h = 0.9;
  } else if (b.type === 'shrine') {
    add(merge([P(cyl(1.35, 1.45, 0.25, 8), '#c9ccdc', 0, 0.12, 0), P(cyl(1.0, 1.1, 0.25, 8), '#e4e6f2', 0, 0.37, 0),
      P(cyl(0.2, 0.42, 1.9, 4), '#f4f1e4', 0, 1.45, 0, 1, 1, 1, 0, 0.78, 0),
      P(box(0.2, 0.8, 0.2), '#e4e6f2', 0.9, 0.8, 0), P(box(0.2, 0.8, 0.2), '#e4e6f2', -0.9, 0.8, 0), P(box(0.2, 0.8, 0.2), '#e4e6f2', 0, 0.8, 0.9), P(box(0.2, 0.8, 0.2), '#e4e6f2', 0, 0.8, -0.9)]));
    o.parts.gem = add(merge([P(octa(0.34), '#ffd447', 0, 0, 0, 1, 1.35, 1), P(new THREE.TorusGeometry(0.55, 0.035, 4, 10), '#fff1a8', 0, 0, 0, 1, 1, 1, Math.PI / 2)]), R.matGlow);
    o.parts.gem.position.y = 2.95;
    h = 3.2;
  } else if (b.type === 'lab') {
    add(merge([P(box(2.0, 1.25, 1.6), '#5f7896', 0, 0.62, 0), P(box(2.2, 0.16, 1.8), '#3d5270', 0, 1.33, 0), P(box(0.9, 0.5, 0.9), '#4a6384', -0.4, 1.65, 0),
      P(cyl(0.035, 0.035, 1.5, 4), '#d8f8ff', 0.65, 2.1, -0.3), P(cone(0.42, 0.3, 6), '#d8e2f0', 0.65, 2.75, -0.3, 1, 1, 1, Math.PI + 0.5, 0, 0),
      P(box(0.5, 0.75, 0.1), '#2a3a52', 0.55, 0.38, 0.81)]));
    o.parts.screen = add(merge([P(box(0.8, 0.55, 0.06), '#3fe8ff', -0.4, 0.75, 0.82), P(octa(0.09), '#ff5fd2', 0.65, 2.92, -0.3)]), R.matGlow);
    h = 2.9;
  } else if (b.type === 'shop') {
    const biz = b.biz || 'bakery';
    const awn = biz === 'bakery' ? ['#ff6a6a', '#fff2e0'] : biz === 'tavern' ? ['#8a4fd6', '#ffd447'] : ['#3f7fd6', '#d8e2f0'];
    const parts = [P(box(1.9, 1.05, 1.5), biz === 'tavern' ? '#a8703f' : '#f0e0c0', 0, 0.52, 0), P(box(2.1, 0.14, 1.7), '#6b4226', 0, 1.1, 0),
      P(cone(1.35, 0.7, 4), biz === 'tavern' ? '#5a3a24' : '#c9b48a', 0, 1.5, 0, 1, 1, 0.8, 0, Math.PI / 4, 0), P(box(0.42, 0.65, 0.08), '#5a3a24', -0.45, 0.33, 0.76)];
    for (let i = 0; i < 5; i++) parts.push(P(box(0.4, 0.08, 0.6), awn[i % 2], -0.8 + i * 0.4, 0.98, 1.0, 1, 1, 1, 0.45, 0, 0));
    if (biz === 'bakery') parts.push(P(box(0.36, 0.16, 0.2), '#d9933f', 0.45, 0.62, 0.86), P(box(0.3, 0.14, 0.18), '#e8a84f', 0.62, 0.78, 0.84), P(cyl(0.12, 0.14, 0.6, 5), '#b9bccf', 0.6, 1.85, -0.35));
    else if (biz === 'tavern') parts.push(P(cyl(0.22, 0.22, 0.42, 6), '#8a5a35', 1.15, 0.21, 0.5), P(cyl(0.22, 0.22, 0.42, 6), '#7a4a2a', 1.15, 0.21, -0.05),
      P(cyl(0.025, 0.025, 1.4, 4), '#d9d2c0', 1.05, 0.7, 0.85), P(box(0.5, 0.36, 0.05), '#ffd447', 1.05, 1.25, 0.85));
    else parts.push(P(box(0.5, 0.18, 0.3), '#5f6378', 0.6, 0.36, 1.0), P(box(0.2, 0.3, 0.2), '#4a4d60', 0.6, 0.15, 1.0),
      P(new THREE.TorusGeometry(0.22, 0.07, 4, 8), '#9aa0b8', 0.75, 1.9, 0, 1, 1, 1, 0, 0, 0));
    add(merge(parts));
    o.parts.sign = add(merge([P(box(0.3, 0.3, 0.06), '#ffe98a', 0.45, 0.62, 0.76)]), R.matGlow);
    h = 2.0;
  } else if (b.type === 'dock') {
    // a pier reaching out over the water (local +z points out to sea)
    const parts = [];
    for (let i = 0; i < 6; i++) parts.push(P(box(1.5, 0.12, 0.5), i % 2 ? '#a8793f' : '#b98a52', 0, 0.2 - i * 0.04, 0.2 + i * 0.55));
    for (const sx of [-0.7, 0.7]) for (const zz of [0.6, 1.9, 3.2]) parts.push(P(cyl(0.08, 0.08, 1.6, 4), '#6b4226', sx, -0.4 - zz * 0.08, zz));
    parts.push(P(box(0.5, 0.4, 0.5), '#c79a62', -0.5, 0.35, -0.2), P(cyl(0.18, 0.18, 0.5, 6), '#8a5a35', 0.5, 0.35, -0.2));
    add(merge(parts));
    h = 0.8;
  } else if (b.type === 'spire') {
    add(merge([P(cyl(1.9, 2.25, 0.5, 8), '#4a4070', 0, 0.25, 0), P(cyl(1.35, 1.7, 0.6, 8), '#5a4f86', 0, 0.8, 0),
      P(cyl(0.55, 1.15, 4.2, 6), '#2a2550', 0, 3.2, 0), P(cyl(0.3, 0.55, 3.2, 6), '#3a3370', 0, 6.9, 0), P(cone(0.3, 1.4, 6), '#55499a', 0, 9.2, 0),
      P(box(0.14, 3.6, 0.14), '#3fe8ff', 0.6, 3.1, 0.6, 1, 1, 1, 0.1, 0, -0.1), P(box(0.14, 3.6, 0.14), '#ff5fd2', -0.6, 3.1, -0.6, 1, 1, 1, -0.1, 0, 0.1)]));
    const ringG = k => merge([P(new THREE.TorusGeometry(1, 0.07, 4, 12), k ? '#ff5fd2' : '#3fe8ff', 0, 0, 0, 1, 1, 1, Math.PI / 2)]);
    o.parts.r1 = add(ringG(0), R.matGlow); o.parts.r1.position.y = 3.2; o.parts.r1.scale.setScalar(1.5);
    o.parts.r2 = add(ringG(1), R.matGlow); o.parts.r2.position.y = 5.6; o.parts.r2.scale.setScalar(1.1);
    o.parts.r3 = add(ringG(0), R.matGlow); o.parts.r3.position.y = 7.7; o.parts.r3.scale.setScalar(0.8);
    o.parts.orb = add(merge([P(ico(0.42), '#ffffff')]), R.matGlow); o.parts.orb.position.y = 10.3;
    const beamM = new THREE.MeshBasicMaterial({ color: '#ff5fd2', transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    o.parts.beam = add(new THREE.CylinderGeometry(0.22, 0.4, 120, 6, 1, true), beamM); o.parts.beam.position.y = 70; o.parts.beam.visible = false;
    h = 10;
  }
  o.h = h;
  if (b.type !== 'fire') {
    const r = BUILD[b.type].r, eg = new THREE.EdgesGeometry(new THREE.BoxGeometry(r * 2, h, r * 2));
    o.wire = new THREE.LineSegments(eg, R.matWire);
    o.wire.position.y = h / 2;
    g.add(o.wire);
  }
  g.rotation.y = b.rot || 0;
  return o;
}

function syncBuildings(S, dt) {
  const W = S.world, seen = new Set();
  for (const b of S.buildings) {
    seen.add(b.id);
    let o = R.bld.get(b.id);
    if (!o) {
      o = makeBuilding(b);
      o.g.position.set(b.x, groundY(W, b.x, b.z) - 0.08, b.z);
      R.root.add(o.g); R.bld.set(b.id, o);
    }
    if (b.built && !o.built) { o.built = true; o.pop = 0; }
    if (o.pop < 1) o.pop = Math.min(1, o.pop + dt * 2.5);
    const t = R.time;
    if (!b.built) {
      const p = clamp(b.progress, 0, 1);
      o.body.scale.set(1, Math.max(0.04, p), 1);
      if (o.wire) { o.wire.visible = true; o.wire.material.opacity = 0.55 + Math.sin(t * 4) * 0.3; }
    } else {
      const s = 1 + Math.sin(o.pop * Math.PI) * 0.18;
      o.body.scale.set(s, s, s);
      if (o.wire) o.wire.visible = false;
    }
    const q = o.parts;
    if (q.flame) { const f = 1 + Math.sin(t * 13) * 0.12 + Math.sin(t * 7.3) * 0.1; q.flame.scale.set(f, 1 + Math.sin(t * 9) * 0.22, f); q.flame.rotation.y = t * 2; }
    if (q.window) q.window.visible = b.built && R.night > 0.3;
    if (q.sign) q.sign.visible = b.built && (R.night > 0.2 || b.biz === 'tavern');
    if (q.crops) {
      const gr = b.built ? clamp(b.food > 0 ? 1 : b.growth, 0, 1) : 0;
      q.crops.scale.set(1, 0.15 + gr * 0.85, 1); q.crops.visible = b.built;
      q.ripe.visible = b.built && b.food > 0;
    }
    if (q.gem) { q.gem.visible = b.built; q.gem.rotation.y = t * 1.3; q.gem.position.y = 2.95 + Math.sin(t * 2) * 0.12; }
    if (q.screen) q.screen.visible = b.built && (Math.sin(t * 17) > -0.92);
    if (q.r1) {
      const on = b.built, sp = on ? 1.6 : 0.4;
      q.r1.rotation.y = t * sp; q.r2.rotation.y = -t * sp * 1.4; q.r3.rotation.y = t * sp * 2;
      q.r1.rotation.z = Math.sin(t * 0.7) * 0.25; q.r2.rotation.x = Math.sin(t * 0.9) * 0.3; q.r3.rotation.z = Math.cos(t * 1.1) * 0.35;
      q.r1.visible = b.progress > 0.3; q.r2.visible = b.progress > 0.55; q.r3.visible = b.progress > 0.75;
      q.orb.visible = on; q.orb.scale.setScalar(1 + Math.sin(t * 5) * 0.15);
      q.beam.visible = on; q.beam.material.opacity = on ? 0.28 + Math.sin(t * 3) * 0.1 : 0;
      q.beam.material.color.set(R.singHex || '#ff5fd2');
    }
  }
  R.bld.forEach((o, id) => { if (!seen.has(id)) { R.root.remove(o.g); disposeTree(o.g); R.bld.delete(id); } });
}

/* -------------------------------------------------------------- citizens */

function makeCitizen(c) {
  const G = R.geo, g = new THREE.Group();
  const o = { g, face: c.face, ph: (c.id * 1.618) % TAU, expr: -1, hat: -2, icon: null, iconIdx: -1, born: 0, x: c.x, z: c.z };
  const mk = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.userData.shared = true; return m; };
  o.rig = new THREE.Group(); g.add(o.rig);
  o.body = mk(G.body, R.matShirt[(c.hue * SHIRTS.length) | 0], 0, 0.47, 0); o.rig.add(o.body);
  o.legL = mk(G.leg, R.matLeg, -0.11, 0.24, 0); o.legR = mk(G.leg, R.matLeg, 0.11, 0.24, 0); o.rig.add(o.legL, o.legR);
  const skin = R.matSkin[c.skin % SKINS.length];
  o.armL = mk(G.arm, skin, -0.31, 0.66, 0); o.armR = mk(G.arm, skin, 0.31, 0.66, 0); o.rig.add(o.armL, o.armR);
  o.head = new THREE.Group(); o.head.position.y = 1.0; o.rig.add(o.head);
  o.head.add(mk(G.head, skin, 0, 0, 0));
  o.hairM = mk(G.hair, R.matHair[(c.id * 7 + c.skin) % HAIRS.length], 0, 0, 0); o.head.add(o.hairM); o.elder = false;
  o.faceGeo = new THREE.PlaneGeometry(0.5, 0.5);
  o.faceM = new THREE.Mesh(o.faceGeo, R.matFace); o.faceM.position.set(0, -0.02, 0.325); o.head.add(o.faceM);
  o.hatM = mk(G.hat[0], R.matGlow, 0, 0, 0); o.hatM.visible = false; o.head.add(o.hatM);
  o.carry = mk(G.carry, R.matCarry.wood, 0, 1.58, 0); o.carry.visible = false; o.rig.add(o.carry);
  o.crown = mk(G.crown, R.matGlow, 0, 0.5, 0); o.crown.visible = false; o.head.add(o.crown);
  o.shadow = mk(G.shadow, R.matShadow, 0, 0.04, 0); g.add(o.shadow);
  o.iconGeo = new THREE.PlaneGeometry(1, 1);
  o.icon = new THREE.Mesh(o.iconGeo, R.matIcon); o.icon.visible = false; o.icon.renderOrder = 20;
  o.aura = mk(G.ring, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthWrite: false }), 0, 0.06, 0);
  o.aura.userData.shared = false; o.aura.visible = false; g.add(o.aura);
  return o;
}

function syncCitizens(S, alpha, dt) {
  const W = S.world, seen = new Set(), t = R.time, camDist = R.cam.dist;
  for (const c of S.citizens) {
    seen.add(c.id);
    let o = R.cit.get(c.id);
    if (!o) { o = makeCitizen(c); R.root.add(o.g); R.root.add(o.icon); R.cit.set(c.id, o); }
    if (o.born < 1) o.born = Math.min(1, o.born + dt * 2.2);
    const held = c.state === 'held';
    const x = held ? lerp(o.x, c.x, Math.min(1, dt * 18)) : lerp(c.px, c.x, alpha), z = held ? lerp(o.z, c.z, Math.min(1, dt * 18)) : lerp(c.pz, c.z, alpha);
    o.x = x; o.z = z;
    const gy = groundY(W, x, z);
    o.face += angDiff(o.face, c.face) * Math.min(1, dt * 12);

    // ---- pose
    let yOff = 0, lean = 0, legL = 0, legR = 0, aL = 0, aR = 0, az = 0.16, hx = 0, hy = 0, hz = 0, roll = 0, lie = 0, expr = 0;
    const p = o.ph, st = c.state, working = c.ph === 1;
    if (c.fear > 0.5) expr = 3; else if (c.hunger > 0.88) expr = 2; else if (c.happy > 0.72) expr = 1; else if (c.happy < 0.28) expr = 2;
    if (c.moving) {
      const f = st === 'flee' ? 17 : 11, sw = Math.sin(t * f + p) * 0.85;
      legL = sw; legR = -sw; aL = -sw * 0.7; aR = sw * 0.7;
      yOff = Math.abs(Math.sin(t * f + p)) * 0.07; lean = st === 'flee' ? 0.25 : 0.08;
    } else if (st === 'idle' || st === 'wander') {
      hy = Math.sin(t * 0.8 + p) * 0.45;
      if (S.selected === c.id) hx = -0.45;
    }
    if (c.carry) { aL = -2.85; aR = -2.85; az = 0.05; }
    if (!c.moving) {
      if ((st === 'gather' || st === 'build' || st === 'farm') && working) {
        aR = -1.3 + Math.sin(t * 10 + p) * 1.0; aL = -0.5; lean = 0.2 + Math.sin(t * 10 + p) * 0.08;
      } else if (st === 'eat' && working) { aL = aR = -2.0 + Math.sin(t * 12) * 0.15; hx = 0.2 + Math.sin(t * 12) * 0.1; expr = 5; }
      else if (st === 'talk' && working) {
        yOff = Math.max(0, Math.sin(t * 6 + (c.lead ? 0 : Math.PI))) * 0.1;
        aR = -0.9 + Math.sin(t * 5 + p) * 0.5; hz = Math.sin(t * 3 + p) * 0.12;
        expr = Math.sin(t * 9 + p) > 0 ? 5 : (c.happy > 0.6 ? 1 : 0);
      } else if (st === 'worship' && working) { lean = 0.55 + Math.sin(t * 2.2 + p) * 0.4; aL = aR = -2.7; expr = c.b[DREAD] > c.b[DEV] ? 3 : 4; }
      else if (st === 'study' && working) { aR = -2.1; hz = Math.sin(t * 1.4 + p) * 0.22; hx = -0.1; expr = Math.sin(t * 0.9 + p) > 0.6 ? 7 : 0; }
      else if (st === 'preach') { aL = -2.9 + Math.sin(t * 6) * 0.3; aR = -2.9 - Math.sin(t * 6) * 0.3; az = 0.5; yOff = 0.12 + Math.sin(t * 4) * 0.08; expr = 7; }
      else if (st === 'sleep' && working) { lie = 1; expr = 4; }
      else if (st === 'cheer') { yOff = Math.abs(Math.sin(t * 9 + p)) * 0.4; aL = aR = -2.9; az = 0.45; expr = 1; }
      else if (st === 'mourn' && working) { hx = 0.5; expr = 2; }
      else if (st === 'idle' && c.happy < 0.2) { hx = 0.45; expr = 2; }
      else if ((st === 'fight' || st === 'battle') && !c.moving) {
        const k = Math.sin(t * 14 + p);
        aL = -1.5 + Math.max(0, k) * -0.2; aR = -1.5 + Math.max(0, -k) * -0.2; az = 0.05; lean = 0.18 + Math.abs(k) * 0.12; expr = 6;
        legL = 0.3; legR = -0.3; yOff = Math.abs(Math.sin(t * 7 + p)) * 0.08;
      }
      else if (st === 'ko') { lie = 1; expr = 3; }
      else if (st === 'dance' && working) { yOff = Math.abs(Math.sin(t * 7 + p)) * 0.25; aL = -2.6 + Math.sin(t * 7 + p) * 0.6; aR = -2.6 - Math.sin(t * 7 + p) * 0.6; az = 0.4; roll = Math.sin(t * 3.5 + p) * 0.2; expr = 1; }
      else if (st === 'fish' && working) { yOff = -0.22; legL = legR = -1.4; aR = -1.1 + Math.sin(t * 1.2 + p) * 0.08; aL = -0.9; expr = (t + p) % 6 < 3 ? 0 : 4; }
      else if ((st === 'nap' || st === 'stargaze') && working) { lie = 1; expr = st === 'nap' ? 4 : 7; }
      else if (st === 'date' && working) { yOff = -0.22; legL = legR = -1.4; hz = 0.25; expr = 1; }
      else if (st === 'assemble' && working) { aL = aR = Math.sin(t * 2 + p) > 0.7 ? -2.8 : -0.2; expr = 7; }
      else if (st === 'sermon' && working) { aL = -2.9 + Math.sin(t * 5) * 0.3; aR = -1.4 + Math.sin(t * 3) * 0.5; az = 0.4; yOff = 0.1; expr = 5; }
      else if (st === 'tantrum') { yOff = Math.abs(Math.sin(t * 16)) * 0.2; aL = -2.9 + Math.sin(t * 18) * 0.6; aR = -2.9 - Math.sin(t * 18) * 0.6; legL = Math.sin(t * 16) * 0.6; expr = 6; }
      else if (st === 'visit' && working) { aR = -1.9 + Math.sin(t * 2 + p) * 0.3; expr = 1; }
      else if (st === 'shift' && working) { aR = -1.3 + Math.sin(t * 8 + p) * 0.8; aL = -1.0 + Math.sin(t * 8 + p + 1) * 0.5; lean = 0.15; }
      else if (st === 'hermit' && working) { hx = 0.35; expr = 0; }
    }
    if (st === 'play' && c.moving) { aL = aR = -2.6; az = 0.4; expr = 1; }
    if (st === 'flee') { aL = -2.8 + Math.sin(t * 20) * 0.4; aR = -2.8 - Math.sin(t * 20) * 0.4; az = 0.4; expr = 3; }
    if (st === 'preach' && c.moving) { aL = aR = -2.9; az = 0.5; expr = 7; }
    if (held) {
      yOff = 2.7 + Math.sin(t * 5) * 0.1; legL = Math.sin(t * 16) * 0.9; legR = -legL; aL = aR = -2.9 + Math.sin(t * 14) * 0.3; az = 0.5;
      roll = Math.sin(t * 6) * 0.25; expr = c.b[DEV] > 0.5 ? 7 : 3;
    }
    if ((expr === 0 || expr === 1) && ((t + p * 2) % 3.7) < 0.13) expr = 4;

    const rig = o.rig;
    o.g.position.set(x, gy, z);
    o.g.rotation.y = o.face + (st === 'dance' && working ? Math.sin(t * 2 + p) * 1.2 : 0);
    const kid = c.grow < 1 ? 0.55 + 0.45 * c.grow : 1;
    const sc = (0.3 + 0.7 * o.born + Math.sin(o.born * Math.PI) * 0.25) * kid;
    if (kid < 1) o.head.scale.setScalar(1.25 - 0.25 * c.grow); else if (o.head.scale.x !== 1) o.head.scale.setScalar(1);
    o.g.scale.setScalar(sc);
    rig.position.y = yOff + (lie ? 0.22 : 0);
    rig.rotation.set(lie ? -Math.PI / 2 : lean, 0, roll);
    o.legL.rotation.x = legL; o.legR.rotation.x = legR;
    o.armL.rotation.set(aL, 0, -az); o.armR.rotation.set(aR, 0, az);
    o.head.rotation.set(hx, hy, hz);
    o.shadow.scale.setScalar(held ? 0.6 : 1 - Math.min(0.4, yOff));
    if (expr !== o.expr) { o.expr = expr; setCellUV(o.faceGeo, expr, 4, 2); }
    if (c.dom !== o.hat) {
      o.hat = c.dom; o.hatM.visible = c.dom >= 0;
      if (c.dom >= 0) { o.hatM.geometry = R.geo.hat[c.dom]; o.hatM.material = R.hatMat[c.dom]; }
    }
    if (c.dom === DEV) o.hatM.position.y = Math.sin(t * 3 + p) * 0.03;
    // a faith leader wears a crown above the creed's hat
    o.crown.visible = c.title === 'leader';
    if (!!c.elder !== o.elder) { o.elder = !!c.elder; o.hairM.material = o.elder ? R.matHairGrey : R.matHair[(c.id * 7 + c.skin) % HAIRS.length]; }
    if (o.elder && !lie) o.rig.rotation.x += 0.16;
    if (o.crown.visible) { o.crown.position.y = (c.dom >= 0 ? 0.78 : 0.42) + Math.sin(t * 2.5 + p) * 0.04; o.crown.rotation.y = t * 0.8; }
    o.carry.visible = !!c.carry;
    if (c.carry) o.carry.material = R.matCarry[c.carry.type] || R.matCarry.wood;
    // prophet aura
    if (c.inspired) {
      o.aura.visible = true; o.aura.material.color.set(BELIEFS[c.inspired.k].hex);
      const s = 0.9 + ((t * 1.2 + p) % 1) * 0.9; o.aura.scale.setScalar(s); o.aura.material.opacity = 0.9 - (s - 0.9);
    } else o.aura.visible = false;
    // emote bubble
    if (c.emoteT > 0 && c.emote >= 0) {
      if (o.iconIdx !== c.emote) { o.iconIdx = c.emote; setCellUV(o.iconGeo, c.emote, 8, 4); }
      const k = clamp(camDist * 0.034, 0.6, 1.9), pop = Math.min(1, c.emoteT * 4);
      o.icon.visible = true;
      o.icon.position.set(x, gy + yOff + 1.55 * sc + k * 0.55, z);
      o.icon.scale.setScalar(k * pop);
      o.icon.quaternion.copy(R.camera.quaternion);
    } else o.icon.visible = false;
  }
  R.cit.forEach((o, id) => {
    if (!seen.has(id)) { R.root.remove(o.g); R.root.remove(o.icon); o.faceGeo.dispose(); o.iconGeo.dispose(); o.aura.material.dispose(); R.cit.delete(id); }
  });

  // faction banners: each faction flies its colour where it last gathered, and on the battle line in a war
  if (!R.flags) R.flags = new Map();
  const fseen = new Set();
  for (const f of S.factions || []) {
    fseen.add(f.id);
    let o = R.flags.get(f.id);
    if (!o) {
      const g = new THREE.Group();
      const pole = new THREE.Mesh(R.geo.pole, R.mat); pole.userData.shared = true;
      const cloth = new THREE.Mesh(R.geo.cloth, new THREE.MeshBasicMaterial({ color: BELIEFS[f.k].hex, side: THREE.DoubleSide }));
      cloth.userData.shared = true;
      g.add(pole, cloth); R.root.add(g);
      o = { g, cloth, x: f.x, z: f.z };
      R.flags.set(f.id, o);
    }
    let fx = f.x, fz = f.z;
    if (S.war && S.war.a === f.id) { fx = S.war.ax; fz = S.war.az; } else if (S.war && S.war.b === f.id) { fx = S.war.bx; fz = S.war.bz; }
    o.x = lerp(o.x, fx, Math.min(1, dt * 2)); o.z = lerp(o.z, fz, Math.min(1, dt * 2));
    o.g.position.set(o.x, groundY(W, o.x, o.z), o.z);
    o.cloth.rotation.y = Math.sin(t * 2.4 + f.id) * 0.35;
    o.cloth.scale.set(1, 1 + Math.sin(t * 5 + f.id) * 0.06, 1);
  }
  R.flags.forEach((o, id) => { if (!fseen.has(id)) { R.root.remove(o.g); o.cloth.material.dispose(); R.flags.delete(id); } });

  // graves
  const live = new Set(S.graves);
  for (const gr of S.graves) {
    if (R.grv.has(gr)) { R.grv.get(gr).g.scale.setScalar(Math.min(1, gr.t / 6)); continue; }
    const m = new THREE.Mesh(R.geo.grave, R.mat); m.userData.shared = true;
    m.position.set(gr.x, groundY(W, gr.x, gr.z), gr.z); m.rotation.y = (gr.x * 7 + gr.z * 3) % 1;
    R.root.add(m); R.grv.set(gr, { g: m });
  }
  R.grv.forEach((o, gr) => { if (!live.has(gr)) { R.root.remove(o.g); R.grv.delete(gr); } });
}

/* --------------------------------------------------------------- effects */

const FXN = 420;
function buildFx() {
  const F = R.fx = { n: FXN, i: 0, life: new Float32Array(FXN), max: new Float32Array(FXN), vel: new Float32Array(FXN * 3), base: new Float32Array(FXN * 3), grav: new Float32Array(FXN) };
  const g = new THREE.BufferGeometry();
  F.pos = new Float32Array(FXN * 3).fill(-999); F.col = new Float32Array(FXN * 3);
  g.setAttribute('position', new THREE.BufferAttribute(F.pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(F.col, 3));
  F.pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.34, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  F.pts.frustumCulled = false;
  R.scene.add(F.pts);
  // expanding ground rings
  F.rings = [];
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(R.geo.ring, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.visible = false; R.scene.add(m); F.rings.push({ m, t: 0, dur: 1, r: 1 });
  }
  // lightning: a chain of thin boxes
  F.bolt = [];
  const bm = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.22), bm); m.visible = false; R.scene.add(m); F.bolt.push(m); }
  F.boltT = 0; F.boltX = 0; F.boltY = 0; F.boltZ = 0;
  // light shafts (inspire, create)
  F.beams = [];
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 30, 6, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.visible = false; R.scene.add(m); F.beams.push({ m, t: 0 });
  }
  // idea pulses hopping from head to head
  F.memes = [];
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
    m.visible = false; m.renderOrder = 15; R.scene.add(m); F.memes.push({ m, t: 0, a: 0, b: 0 });
  }
  // selection ring and scorch marks
  F.sel = new THREE.Mesh(R.geo.ring, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false, depthTest: false }));
  F.sel.visible = false; F.sel.renderOrder = 12; R.scene.add(F.sel);
  F.scorch = [];
  const sg = new THREE.CircleGeometry(1, 9); sg.rotateX(-Math.PI / 2);
  for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false })); m.visible = false; R.scene.add(m); F.scorch.push({ m, t: 0 }); }
  F.scorchI = 0;
  F.drop = new THREE.Mesh(R.geo.ring, new THREE.MeshBasicMaterial({ color: 0x3fe8ff, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false }));
  F.drop.visible = false; F.drop.renderOrder = 12; R.scene.add(F.drop);
}
function fxSpark(x, y, z, hex, n, spread, up, grav, life) {
  const F = R.fx; _c3.set(hex);
  for (let k = 0; k < n; k++) {
    const i = F.i; F.i = (F.i + 1) % F.n;
    const a = Math.random() * TAU, s = Math.random() * spread;
    F.pos[i * 3] = x; F.pos[i * 3 + 1] = y; F.pos[i * 3 + 2] = z;
    F.vel[i * 3] = Math.sin(a) * s; F.vel[i * 3 + 1] = up * (0.4 + Math.random() * 0.8); F.vel[i * 3 + 2] = Math.cos(a) * s;
    F.base[i * 3] = _c3.r; F.base[i * 3 + 1] = _c3.g; F.base[i * 3 + 2] = _c3.b;
    F.grav[i] = grav; F.life[i] = F.max[i] = (life || 0.9) * (0.6 + Math.random() * 0.7);
  }
}
function fxRing(x, y, z, hex, r, dur) {
  const F = R.fx;
  let best = F.rings[0];
  for (const q of F.rings) if (q.t <= 0) { best = q; break; }
  best.t = best.dur = dur || 0.8; best.r = r; best.m.position.set(x, y + 0.12, z); best.m.material.color.set(hex); best.m.visible = true;
}
function fxBeam(x, y, z, hex) {
  const F = R.fx;
  let b = F.beams[0];
  for (const q of F.beams) if (q.t <= 0) { b = q; break; }
  b.t = 1.1; b.m.position.set(x, y + 15, z); b.m.material.color.set(hex); b.m.visible = true;
}
function fxBolt(x, y, z) {
  const F = R.fx;
  F.boltT = 0.32; F.boltX = x; F.boltY = y; F.boltZ = z;
  R.flashL = 1; R.shake = 0.55;
  const s = F.scorch[F.scorchI]; F.scorchI = (F.scorchI + 1) % F.scorch.length;
  s.t = 26; s.m.position.set(x, y + 0.07, z); s.m.scale.setScalar(1.3); s.m.visible = true;
  fxSpark(x, y + 0.3, z, '#ffffff', 26, 4.5, 5, -9, 0.8);
  fxSpark(x, y + 0.3, z, '#3fe8ff', 16, 3, 7, -9, 0.9);
  fxRing(x, y, z, '#bfe9ff', 5, 0.5);
}
function fxMeme(a, b, k) {
  const F = R.fx;
  let q = F.memes[0];
  for (const m of F.memes) if (m.t <= 0) { q = m; break; }
  q.t = 0.75; q.a = a; q.b = b; q.m.material.color.set(BELIEFS[k].hex); q.m.visible = true;
}
function updateFx(S, dt) {
  const F = R.fx, W = S.world;
  for (let i = 0; i < F.n; i++) {
    if (F.life[i] <= 0) continue;
    F.life[i] -= dt;
    const k = Math.max(0, F.life[i] / F.max[i]);
    if (F.life[i] <= 0) { F.pos[i * 3 + 1] = -999; continue; }
    F.vel[i * 3 + 1] += F.grav[i] * dt;
    F.pos[i * 3] += F.vel[i * 3] * dt; F.pos[i * 3 + 1] += F.vel[i * 3 + 1] * dt; F.pos[i * 3 + 2] += F.vel[i * 3 + 2] * dt;
    F.col[i * 3] = F.base[i * 3] * k; F.col[i * 3 + 1] = F.base[i * 3 + 1] * k; F.col[i * 3 + 2] = F.base[i * 3 + 2] * k;
  }
  F.pts.geometry.attributes.position.needsUpdate = true; F.pts.geometry.attributes.color.needsUpdate = true;
  for (const q of F.rings) {
    if (q.t <= 0) continue;
    q.t -= dt;
    const k = 1 - Math.max(0, q.t) / q.dur;
    q.m.scale.setScalar(0.3 + k * q.r); q.m.material.opacity = (1 - k) * 0.9;
    if (q.t <= 0) q.m.visible = false;
  }
  for (const b of F.beams) {
    if (b.t <= 0) continue;
    b.t -= dt; b.m.material.opacity = Math.max(0, b.t) * 0.5; b.m.rotation.y += dt * 3;
    if (b.t <= 0) b.m.visible = false;
  }
  if (F.boltT > 0) {
    F.boltT -= dt;
    let px = F.boltX, py = F.boltY, pz = F.boltZ;
    const segH = 3.2;
    for (let i = 0; i < F.bolt.length; i++) {
      const m = F.bolt[i];
      const nx = F.boltX + (Math.random() - 0.5) * (i + 1) * 0.55, ny = F.boltY + (i + 1) * segH, nz = F.boltZ + (Math.random() - 0.5) * (i + 1) * 0.55;
      m.visible = F.boltT > 0;
      m.position.set((px + nx) / 2, (py + ny) / 2, (pz + nz) / 2);
      const len = hyp(nx - px, ny - py, nz - pz);
      m.scale.set(1.2 - i * 0.07, len, 1.2 - i * 0.07);
      _v3.set(nx - px, ny - py, nz - pz).normalize();
      m.quaternion.setFromUnitVectors(_s3.set(0, 1, 0), _v3);
      px = nx; py = ny; pz = nz;
    }
  }
  for (const s of F.scorch) {
    if (s.t <= 0) continue;
    s.t -= dt; s.m.material.opacity = Math.min(0.55, s.t * 0.08);
    if (s.t <= 0) s.m.visible = false;
  }
  for (const q of F.memes) {
    if (q.t <= 0) continue;
    q.t -= dt;
    const a = R.cit.get(q.a), b = R.cit.get(q.b);
    if (!a || !b || q.t <= 0) { q.m.visible = false; q.t = 0; continue; }
    const k = 1 - q.t / 0.75;
    q.m.position.set(lerp(a.x, b.x, k), lerp(a.g.position.y, b.g.position.y, k) + 1.25 + Math.sin(k * Math.PI) * 1.1, lerp(a.z, b.z, k));
    q.m.rotation.y += dt * 9; q.m.scale.setScalar(1 + Math.sin(k * Math.PI) * 0.7);
  }
  // selection ring
  const so = S.selected ? R.cit.get(S.selected) : null;
  if (so) {
    const c = getC(S, S.selected);
    F.sel.visible = true;
    F.sel.position.set(so.x, so.g.position.y + 0.1, so.z);
    F.sel.scale.setScalar(0.72 + Math.sin(R.time * 5) * 0.06);
    F.sel.rotation.y = R.time;
    F.sel.material.color.set(c && c.dom >= 0 ? BELIEFS[c.dom].hex : '#ffffff');
  } else F.sel.visible = false;
  // where a held citizen will land
  const hc = S.held ? getC(S, S.held) : null;
  if (hc) {
    clampWalk(W, hc.x, hc.z, _pt);
    F.drop.visible = true; F.drop.position.set(_pt.x, groundY(W, _pt.x, _pt.z) + 0.1, _pt.z);
    F.drop.scale.setScalar(0.8 + Math.sin(R.time * 8) * 0.1);
  } else F.drop.visible = false;
}

/* ---------------------------------------------------------------- camera */

function updateCamera(S, dt) {
  const C = R.cam, cam = R.camera;
  if (C.follow) {
    const o = R.cit.get(C.follow);
    if (o) { C.tx = lerp(C.tx, o.x, Math.min(1, dt * 4)); C.tz = lerp(C.tz, o.z, Math.min(1, dt * 4)); C.ty = lerp(C.ty, o.g.position.y + 0.8, Math.min(1, dt * 4)); }
    else C.follow = 0;
  } else if (typeof UI !== 'undefined' && UI.goBoat) {
    const b = boatOf(S, UI.goBoat);
    if (b && b.st !== 'docked') { C.tx = lerp(C.tx, b.x, Math.min(1, dt * 3)); C.tz = lerp(C.tz, b.z, Math.min(1, dt * 3)); C.ty = lerp(C.ty, SEA_Y + 0.6, Math.min(1, dt * 3)); }
    else UI.goBoat = 0;
  } else C.ty = lerp(C.ty, groundY(S.world, C.tx, C.tz) + 0.6, Math.min(1, dt * 3));
  if (C.auto) C.yaw += dt * 0.12;
  C.pitch = clamp(C.pitch, 0.28, 1.45); C.dist = clamp(C.dist, 8, 140);
  const cp = Math.cos(C.pitch);
  let sx = 0, sy = 0;
  if (R.shake > 0) { R.shake = Math.max(0, R.shake - dt * 1.6); sx = (Math.random() - 0.5) * R.shake; sy = (Math.random() - 0.5) * R.shake; }
  cam.position.set(C.tx + Math.sin(C.yaw) * cp * C.dist + sx, C.ty + Math.sin(C.pitch) * C.dist + sy, C.tz + Math.cos(C.yaw) * cp * C.dist);
  cam.lookAt(C.tx, C.ty, C.tz);
  R.viewShift = lerp(R.viewShift, R.viewShiftT, Math.min(1, dt * 6));
  if (Math.abs(R.viewShift) > 0.5) cam.setViewOffset(R.w, R.h, 0, R.viewShift, R.w, R.h); else if (cam.view) cam.clearViewOffset();
  R.sky.position.copy(cam.position);
  R.stars.position.copy(cam.position);
}

/* screen -> world helpers used by the controls */
const _ndc = new THREE.Vector2(), _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2), _hit = new THREE.Vector3();
function screenRay(sx, sy) {
  const shift = R.camera.view ? R.viewShift : 0;
  _ndc.set(sx / R.w * 2 - 1, -((sy + shift) / R.h) * 2 + 1);
  if (R.camera.view) R.camera.clearViewOffset();
  R.camera.updateMatrixWorld();
  R.ray.setFromCamera(_ndc, R.camera);
  if (shift) R.camera.setViewOffset(R.w, R.h, 0, R.viewShift, R.w, R.h);
}
function groundPoint(sx, sy) {
  screenRay(sx, sy);
  const hits = R.ray.intersectObjects(R.terrains.filter((m, i) => R.isles[i].visible), false);
  if (hits.length) return { x: hits[0].point.x, z: hits[0].point.z, on: true };
  if (R.ray.ray.intersectPlane(_plane, _hit)) return { x: _hit.x, z: _hit.z, on: false };
  return null;
}
function toScreen(x, y, z, out) {
  _v3.set(x, y, z).project(R.camera);
  out.x = (_v3.x + 1) / 2 * R.w; out.y = (1 - _v3.y) / 2 * R.h; out.ok = _v3.z < 1;
  return out;
}
const _scr = { x: 0, y: 0, ok: false };
function pickCitizen(S, sx, sy, radius) {
  let best = 0, bd = radius;
  R.cit.forEach((o, id) => {
    toScreen(o.x, o.g.position.y + 0.75, o.z, _scr);
    if (!_scr.ok) return;
    const d = hyp(_scr.x - sx, _scr.y - sy);
    if (d < bd) { bd = d; best = id; }
  });
  return best;
}
function pickBuilding(S, x, z) {
  for (const b of S.buildings) if (hyp(b.x - x, b.z - z) < BUILD[b.type].r + 0.3) return b;
  return null;
}

/* ----------------------------------------------------------------- frame */

function renderFrame(S, alpha, dt) {
  R.time += dt;
  updateAtmos(S, dt);
  updateSky(S, dt);
  R.nodeT -= dt;
  if (R.nodeT <= 0) { R.nodeT = 0.25; syncNodes(S, false); }
  syncBuildings(S, dt);
  syncCitizens(S, alpha, dt);
  syncBoats(S, alpha, dt);
  if (R.sea) updateSea(dt);
  if (R.fog && S.fog) {
    if (R.fogV !== S.fogV && (R.time - (R.fogPaintT || -9) > 0.8 || R.fogV < 0)) { R.fogV = S.fogV; R.fogPaintT = R.time; paintFog(S); }
    R.fogMat.color.set('#ffffff').lerp(_cb.set('#3a4470'), (R.night || 0) * 0.8);
  }
  if (R.isles && S.found) for (let i = 0; i < R.isles.length; i++) R.isles[i].visible = !!S.found[i];
  updateFx(S, dt);
  updateCamera(S, dt);
  if (R.water) R.water.position.y = S.world.waterY + Math.sin(R.time * 1.3) * 0.04;
  R.renderer.render(R.scene, R.camera);
}
