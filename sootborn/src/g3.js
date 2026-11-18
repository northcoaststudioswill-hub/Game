// ============================================================
// systems/g3 — real 3D for everything above the rock (the Assay).
// Plain WebGL, no library: flat-shaded low-poly boxes, cones and cylinders, one sun, planar shadows,
// distance fog, additive glow sprites. Cinderwell stays 2D pixel art; the surface is a different world.
// The fight logic does not change: Brawl hands over its camera and its fighters each frame, and the
// pixel HUD is drawn on the 2D canvas on top of this one.
// World: x = across, y = up, z = depth (Brawl's y). One unit is one Brawl unit. A fighter is 46 tall.
// ============================================================
const M4 = {
  id: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  mul(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o; },
  t(x, y, z) { const m = M4.id(); m[12] = x; m[13] = y; m[14] = z; return m; },
  s(k) { const m = M4.id(); m[0] = m[5] = m[10] = k; return m; },
  rx(a) { const m = M4.id(), c = Math.cos(a), s = Math.sin(a); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; },
  ry(a) { const m = M4.id(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; },
  rz(a) { const m = M4.id(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; },
  persp(fovy, asp, n, f) { const t = 1 / Math.tan(fovy / 2), m = new Float32Array(16); m[0] = t / asp; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f); return m; },
  chain(...ms) { let o = ms[0]; for (let i = 1; i < ms.length; i++) o = M4.mul(o, ms[i]); return o; }
};
const _hexc = {}; function rgb3(h) { if (Array.isArray(h)) return h; if (!_hexc[h]) { const n = parseInt(h.slice(1), 16); _hexc[h] = [(n >> 16) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; } return _hexc[h]; }
// a growable triangle soup: position, normal, colour (a zero normal means unlit)
function Batch(cap) { this.a = new Float32Array(cap * 9); this.n = 0; this.flash = 0; }
Batch.prototype = {
  v(x, y, z, nx, ny, nz, c) { if ((this.n + 1) * 9 > this.a.length) { const b = new Float32Array(this.a.length * 2); b.set(this.a); this.a = b; } const a = this.a, i = this.n * 9, f = this.flash; a[i] = x; a[i + 1] = y; a[i + 2] = z; a[i + 3] = nx; a[i + 4] = ny; a[i + 5] = nz; a[i + 6] = c[0] + f; a[i + 7] = c[1] + f; a[i + 8] = c[2] + f; this.n++; },
  // box centred at (cx,cy,cz) in the space of m
  box(m, cx, cy, cz, sx, sy, sz, col, emis) {
    const c = rgb3(col), hx = sx / 2, hy = sy / 2, hz = sz / 2, P = [];
    for (let i = 0; i < 8; i++) { const x = cx + (i & 1 ? hx : -hx), y = cy + (i & 2 ? hy : -hy), z = cz + (i & 4 ? hz : -hz); P.push(m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]); }
    const F = [[1, 3, 7, 5, 0, 1], [0, 4, 6, 2, 0, -1], [2, 6, 7, 3, 1, 1], [0, 1, 5, 4, 1, -1], [4, 5, 7, 6, 2, 1], [0, 2, 3, 1, 2, -1]];
    for (const [a, b, d, e, ax, sg] of F) { const nx = emis ? 0 : m[ax * 4] * sg, ny = emis ? 0 : m[ax * 4 + 1] * sg, nz = emis ? 0 : m[ax * 4 + 2] * sg; for (const k of [a, b, d, a, d, e]) this.v(P[k * 3], P[k * 3 + 1], P[k * 3 + 2], nx, ny, nz, c); }
  },
  // cylinder or cone standing on y = cy (r1 = 0 makes a cone)
  cyl(m, cx, cy, cz, r0, r1, h, sides, col, emis, cap) {
    const c = rgb3(col), tp = (x, y, z) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]], sl = (r0 - r1) / h;
    for (let i = 0; i < sides; i++) { const a0 = i / sides * 6.2832, a1 = (i + 1) / sides * 6.2832, am = (a0 + a1) / 2, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      let nx = Math.cos(am), ny = sl, nz = Math.sin(am); const tx = m[0] * nx + m[4] * ny + m[8] * nz, ty = m[1] * nx + m[5] * ny + m[9] * nz, tz = m[2] * nx + m[6] * ny + m[10] * nz; nx = emis ? 0 : tx; ny = emis ? 0 : ty; nz = emis ? 0 : tz;
      const p0 = tp(cx + c0 * r0, cy, cz + s0 * r0), p1 = tp(cx + c1 * r0, cy, cz + s1 * r0), p2 = tp(cx + c1 * r1, cy + h, cz + s1 * r1), p3 = tp(cx + c0 * r1, cy + h, cz + s0 * r1);
      for (const p of r1 > 0 ? [p0, p1, p2, p0, p2, p3] : [p0, p1, p2]) this.v(p[0], p[1], p[2], nx, ny, nz, c);
      if (cap && r1 > 0) { const pc = tp(cx, cy + h, cz), ux = emis ? 0 : m[4], uy = emis ? 0 : m[5], uz = emis ? 0 : m[6]; for (const p of [p3, p2, pc]) this.v(p[0], p[1], p[2], ux, uy, uz, c); } }
  },
  // ground patch with a colour at each corner, so the field shades smoothly
  gquad(x0, z0, x1, z1, y, cf) { for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z0], [x1, z1], [x0, z1]]) this.v(x, y, z, 0, 1, 0, cf(x, z)); },
  quad(x0, z0, x1, z1, y, col, emis) { const c = rgb3(col), ny = emis ? 0 : 1; for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z0], [x1, z1], [x0, z1]]) this.v(x, y, z, 0, ny, 0, c); }
};
const G3 = {
  ok: null, used: false, shown: false, rigs: new Map(), frame: 0, dt: 0, lastT: 0, CH: 46, MS: .86, HK: 46 / 67 * .86, FK: 1.43 / .86, envs: {}, t: 0,
  init() {
    if (this.ok !== null) return this.ok; this.ok = false;
    try {
      const cv = this.cv = document.createElement('canvas'); cv.id = 'gl'; cv.style.cssText = 'position:absolute;display:none'; const game = $('#game'); game.parentNode.insertBefore(cv, game);
      const gl = this.gl = cv.getContext('webgl', { antialias: true, alpha: false, stencil: true, powerPreference: 'high-performance' }); if (!gl) return false;
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = (vs, fs, names) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const o = { p }; for (const n of names) o[n] = n[0] === 'u' ? gl.getUniformLocation(p, n) : gl.getAttribLocation(p, n); return o; };
      this.P = prog(`attribute vec3 aP,aN,aC; uniform mat4 uVP; uniform vec3 uSun,uSunC,uAmb,uSky,uEye; uniform mediump float uSh; varying vec3 vC; varying float vD;
        void main(){ vec3 p=aP; if(uSh>.5){ p=vec3(aP.x-aP.y*uSun.x/uSun.y, .12, aP.z-aP.y*uSun.z/uSun.y); }
          float ln=length(aN); vec3 n=aN/max(ln,.001); float d=max(dot(n,uSun),0.); float back=max(dot(n,-uSun),0.);
          vec3 vdir=normalize(uEye-p); float rim=pow(1.-max(dot(n,vdir),0.),3.)*(.25+.75*max(dot(n,uSun),0.)); vec3 lit=aC*(uAmb+uSunC*d+uSky*(n.y*.5+.5)+uAmb*.25*back)+uSunC*rim*.22*step(.5,n.y*.0+1.)*(1.-step(.98,n.y)); vC=ln<.1?aC:lit; vD=distance(p,uEye); gl_Position=uVP*vec4(p,1.); }`,
        `precision mediump float; varying vec3 vC; varying float vD; uniform vec3 uFog; uniform vec2 uFogR; uniform float uSh; uniform float uVoid;
        void main(){ if(uSh>.5){ gl_FragColor=vec4(0.,0.,.06,.34); return; } float f=clamp((vD-uFogR.x)/(uFogR.y-uFogR.x),0.,1.); vec3 c=mix(vC,uFog,f*f*(3.-2.*f)); gl_FragColor=vec4(c,1.); }`,
        ['aP', 'aN', 'aC', 'uVP', 'uSun', 'uSunC', 'uAmb', 'uSky', 'uEye', 'uSh', 'uFog', 'uFogR', 'uVoid']);
      this.S = prog(`attribute vec3 aP; attribute vec2 aU; attribute vec4 aC; uniform mat4 uVP; varying vec2 vU; varying vec4 vC; void main(){ vU=aU; vC=aC; gl_Position=uVP*vec4(aP,1.); }`,
        `precision mediump float; varying vec2 vU; varying vec4 vC; uniform float uSolid; void main(){ float r=length(vU); float a=uSolid>.5?1.:pow(clamp(1.-r,0.,1.),1.8); gl_FragColor=vec4(vC.rgb*vC.a*a, uSolid>.5?vC.a:0.); if(uSolid>.5) gl_FragColor=vec4(vC.rgb,vC.a); }`,
        ['aP', 'aU', 'aC', 'uVP', 'uSolid']);
      this.K = prog(`attribute vec2 aP; varying vec2 vP; void main(){ vP=aP; gl_Position=vec4(aP,.9999,1.); }`,
        `precision mediump float; varying vec2 vP; uniform vec3 uTop,uBot,uSunC; uniform vec3 uSunP; uniform float uHor,uAsp;
        void main(){ float k=clamp((vP.y-uHor)*1.15,0.,1.); vec3 c=mix(uBot,uTop,pow(k,.7)); if(vP.y<uHor) c=uBot; vec2 d=(vP-uSunP.xy)*vec2(uAsp,1.); float r=length(d);
          float disc=smoothstep(.062,.05,r); float glow=exp(-r*3.2)*.75+exp(-r*11.)*.6; float ray=pow(max(0.,cos(atan(d.y,d.x)*9.)),18.)*exp(-r*2.4)*.35; c+=uSunC*(glow+ray)*uSunP.z; c=mix(c,vec3(1.,.97,.82),disc*uSunP.z); gl_FragColor=vec4(c,1.); }`,
        ['aP', 'uTop', 'uBot', 'uSunC', 'uSunP', 'uHor', 'uAsp']);
      this.dyn = new Batch(24000); this.dynBuf = gl.createBuffer(); this.spr = new Float32Array(9 * 6 * 2600); this.sprN = 0; this.dec = new Float32Array(9 * 3 * 2400); this.decN = 0; this.sprBuf = gl.createBuffer(); this.decBuf = gl.createBuffer();
      this.skyBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
      cv.addEventListener('webglcontextlost', e => { e.preventDefault(); this.ok = false; });
      this.ok = true;
    } catch (e) { console.warn('3D unavailable, using 2D', e); this.ok = false; }
    return this.ok;
  },
  want(bg) { return (bg === 'valley' || bg === 'ford' || bg === 'keep') && !NO3D && this.init(); },
  // keep the GL canvas exactly under the pixel canvas; show it only on frames that drew 3D
  sync() { if (!this.cv) return; if (this.used !== this.shown) { this.shown = this.used; this.cv.style.display = this.used ? 'block' : 'none'; document.body.classList.toggle('g3on', this.used); if (!this.used) this.cv.style.filter = ''; } },
  fit() { const g = $('#game'), cv = this.cv, st = g.style; if (cv.style.left !== st.left || cv.style.top !== st.top || cv.style.width !== st.width || cv.style.height !== st.height) Object.assign(cv.style, { left: st.left, top: st.top, width: st.width, height: st.height }); const dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.max(2, Math.round(parseFloat(st.width) * dpr)), h = Math.max(2, Math.round(parseFloat(st.height) * dpr)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } },

  // ---------------------------------------------------------- the places
  LOOK: {
    valley: { top: [.16, .42, .86], bot: [.74, .9, 1], sun: [-.42, .8, .43], sunC: [1.0, .95, .78], amb: [.34, .38, .46], sky: [.16, .2, .26], fog: [.72, .88, 1], fogR: [420, 1500], sunAt: [.55, .6, -1] },
    ford: { top: [.2, .14, .42], bot: [1, .6, .36], sun: [-.62, .4, -.3], sunC: [1.2, .7, .4], amb: [.52, .4, .46], sky: [.3, .22, .3], fog: [1, .64, .44], fogR: [330, 1300], sunAt: [-.5, .16, -1] },
    keep: { top: [.3, .44, .78], bot: [1, .8, .68], sun: [.55, .42, -.72], sunC: [1.2, .92, .7], amb: [.4, .38, .46], sky: [.2, .2, .26], fog: [1, .84, .76], fogR: [380, 1500], sunAt: [.5, .2, -1] }
  },
  env(bg) {
    if (this.envs[bg]) return this.envs[bg];
    const gl = this.gl, A = new Batch(30000), Sh = new Batch(20000), r = rng(bg.length * 131 + 17), I = M4.id(), R = (a, b) => a + r() * (b - a), hw = bg === 'keep' ? 110 : 125, hh = bg === 'keep' ? 50 : 60;
    const pine = (x, z, s) => { const m = M4.chain(M4.t(x, 0, z), M4.ry(r() * 6)); Sh.cyl(m, 0, 0, 0, 2.2 * s, 1.6 * s, 10 * s, 5, '#5a3c26'); const g = ['#1f6a34', '#27803c', '#2f9646', '#3aa850']; for (let i = 0; i < 4; i++) Sh.cyl(m, 0, (7 + i * 9) * s, 0, (15 - i * 3.2) * s, 0, 15 * s, 7, bg === 'ford' ? ['#28503a', '#2f5e40', '#386a46', '#427650'][i] : g[i]); };
    const oak = (x, z, s, c) => { const m = M4.chain(M4.t(x, 0, z), M4.ry(r() * 6)); Sh.cyl(m, 0, 0, 0, 2.6 * s, 1.8 * s, 16 * s, 5, '#6a4a30'); Sh.cyl(m, 0, 13 * s, 0, 9 * s, 13 * s, 8 * s, 6, shade(c, .86)); Sh.cyl(m, 0, 21 * s, 0, 13 * s, 10 * s, 8 * s, 6, c, 0, 1); Sh.cyl(m, 2 * s, 28 * s, 1 * s, 9 * s, 0, 9 * s, 6, shade(c, 1.12)); Sh.cyl(m, -7 * s, 17 * s, 4 * s, 6 * s, 0, 9 * s, 5, shade(c, 1.05)); };
    const rock = (x, z, s) => { const m = M4.chain(M4.t(x, 0, z), M4.ry(r() * 6), M4.rz(R(-.2, .2))); Sh.cyl(m, 0, 0, 0, 7 * s, 4.5 * s, 5 * s, 6, '#8a8a82', 0, 1); Sh.cyl(m, 1, 5 * s, 0, 4.5 * s, 0, 3 * s, 6, '#a4a49a'); };
    const peak = (x, z, rad, h, c0, snow) => { const m = M4.chain(M4.t(x, -4, z), M4.ry(r() * 6)); A.cyl(m, 0, 0, 0, rad, 0, h, 6, c0); if (snow) A.cyl(m, 0, h * .66, 0, rad * .36, 0, h * .36, 6, snow); A.cyl(M4.chain(M4.t(x + rad * .5, -4, z + rad * .3), M4.ry(r() * 6)), 0, 0, 0, rad * .7, 0, h * .55, 5, c0); };
    const cloud = (x, y, z, s, c) => { for (let i = 0; i < 4; i++) A.box(I, x + (i - 1.5) * 26 * s, y + (i % 2) * 8 * s, z + (i % 3) * 10, (46 - i * 4) * s, 16 * s, 30 * s, c, 1); };
    const tent = (x, z, c) => { const m = M4.chain(M4.t(x, 0, z), M4.ry(.4)); Sh.cyl(m, 0, 0, 0, 30, 0, 44, 6, '#f4f0e6'); Sh.cyl(m, 0, 0, 0, 30.6, 26, 6, 6, c); Sh.cyl(m, 0, 30, 0, 9.8, 0, 14.5, 6, c); Sh.cyl(m, 0, 44, 0, .8, .8, 18, 4, '#8a8478'); Sh.box(m, 5, 58, 0, 10, 6, .6, c); Sh.box(m, 0, 9, 29, 12, 18, 1, '#2a2030'); };
    const merlon = (x, z, rot) => { const m = M4.chain(M4.t(x, 0, z), M4.ry(rot)); Sh.box(m, 0, 13, 0, 26, 26, 12, '#e6e0d2'); Sh.box(m, -8, 31, 0, 9, 10, 12, '#f2ede2'); Sh.box(m, 8, 31, 0, 9, 10, 12, '#f2ede2'); Sh.box(m, 0, 25, 6.3, 26, 1.6, .6, '#e8c25a', 1); };
    if (bg === 'keep') {
      // a white platform above the clouds
      for (let ix = -8; ix < 8; ix++) for (let iz = -6; iz < 8; iz++) { const k = (ix + iz) & 1, c = k ? [.88, .85, .8] : [.8, .77, .72], j = r() * .04; A.quad(ix * 32, iz * 32, ix * 32 + 32, iz * 32 + 32, 0, [c[0] + j, c[1] + j, c[2] + j]); A.quad(ix * 32, iz * 32, ix * 32 + 32, iz * 32 + .8, .05, [.62, .6, .56]); A.quad(ix * 32, iz * 32, ix * 32 + .8, iz * 32 + 32, .05, [.62, .6, .56]); }
      for (let i = 0; i < 40; i++) { const a = i / 40 * 6.2832, m = M4.chain(M4.t(Math.cos(a) * hw * .8, .2, Math.sin(a) * hh * .8), M4.ry(-a)); A.box(m, 0, 0, 0, 1.6, .3, hw * .13, '#e8c25a', 1); }
      for (let i = 0; i < 24; i++) { const a = i / 24 * 6.2832, m = M4.chain(M4.t(Math.cos(a) * hw * .42, .2, Math.sin(a) * hh * .42), M4.ry(-a)); A.box(m, 0, 0, 0, 1.2, .3, hw * .12, '#e8c25a', 1); }
      A.box(I, 0, .2, 0, 20, .3, 5, '#e8c25a', 1); A.box(I, 0, .2, 0, 5, .3, 20, '#e8c25a', 1);
      for (let i = -9; i <= 9; i++) merlon(i * 28, -hh - 38, 0); for (let i = -3; i <= 8; i++) { merlon(-256, i * 28 - 20, 1.5708); merlon(256, i * 28 - 20, 1.5708); }
      A.box(I, 0, -60, -hh - 46, 560, 120, 6, '#d4cec0'); A.box(I, -260, -60, 80, 6, 120, 340, '#cac4b6'); A.box(I, 260, -60, 80, 6, 120, 340, '#cac4b6');
      // she watches from the dais. She does not know his face.
      { const m = M4.t(0, 0, -hh - 22); Sh.box(m, 0, 7, 0, 90, 14, 26, '#f2ede2'); A.box(m, 0, 13.4, 13.2, 90, 1.2, .5, '#e8c25a', 1); Sh.box(m, 0, 2.5, 17, 60, 5, 8, '#e6e0d2'); Sh.box(m, 0, 30, -8, 16, 34, 6, '#f6f3ec'); A.box(m, 0, 44, -4.8, 10, 10, .5, '#e8c25a', 1); A.box(m, 0, 44, -4.5, 4, 4, .5, '#2a2438', 1);
        const cm = M4.t(0, 14, -hh - 20); Sh.cyl(cm, 0, 0, 0, 7, 4, 26, 7, '#f4f2ec'); A.cyl(cm, 0, 0, 0, 7.2, 7.2, 1.4, 7, '#e8c25a', 1); Sh.box(cm, 0, 30, 0, 6.4, 7.4, 6.4, '#f4e6dc'); Sh.box(cm, 0, 31, -2.6, 8, 12, 3, '#f6eac0'); A.box(cm, 0, 34.6, 0, 7.4, 1.4, 7.4, '#e8c25a', 1); A.box(cm, -1.6, 30.6, 3.3, 1.2, 1, .3, [1, .8, .3], 1); A.box(cm, 1.6, 30.6, 3.3, 1.2, 1, .3, [1, .8, .3], 1);
        for (const sx of [-1, 1]) { const wm = M4.t(sx * 26, 14, -hh - 20); Sh.cyl(wm, 0, 0, 0, 6, 4, 24, 6, '#c8ccd8'); Sh.box(wm, 0, 28, 0, 7, 8, 7, '#d8dce4'); A.box(wm, 0, 28.6, 3.6, 5, 1.2, .3, '#1e1e28', 1); Sh.cyl(wm, sx * 7, 0, 2, .7, .7, 52, 4, '#b8bcc8'); Sh.box(wm, sx * 7, 52, 2, 1, 8, 5, '#e8ecf2'); } }
      const HC = ['#7a5ac8', '#2aa6a0', '#c8452e', '#e8c25a', '#3a6ac8', '#58b848', '#c85a9a', '#e88a3a', '#8a8a92', '#40c8e8', '#a03a3a', '#f4f0e6'];
      for (let i = 0; i < 12; i++) { const m = M4.t(-240 + i * 43.6, 36, -hh - 38); Sh.cyl(m, 0, 0, 0, 1, 1, 40, 4, '#8a8478'); Sh.box(m, 6, 30, 0, 12, 18, .7, HC[i]); A.box(m, 6, 33, .5, 5, 5, .3, '#e8c25a', 1); }
      for (const sx of [-1, 1]) { const m = M4.t(sx * 256, 0, -hh - 44); Sh.cyl(m, 0, -40, 0, 26, 22, 150, 8, '#ece6d8', 0, 1); Sh.cyl(m, 0, 110, 0, 30, 0, 52, 8, sx < 0 ? '#7a5ac8' : '#2aa6a0'); Sh.cyl(m, 0, 62, 0, 23.4, 23.4, 3, 8, '#e8c25a', 1); Sh.cyl(m, 0, 162, 0, .9, .9, 24, 4, '#8a8478'); Sh.box(m, 9, 180, 0, 18, 10, .8, sx < 0 ? '#7a5ac8' : '#2aa6a0'); }
      for (let i = 0; i < 70; i++) { const a = r() * 6.2832, d = R(330, 1500); cloud(Math.cos(a) * d, R(-150, -60), Math.sin(a) * d, R(1.5, 4), [1, R(.86, .95), R(.82, .92)]); }
      for (let i = 0; i < 9; i++) { const a = Math.PI + (i + .5) / 9 * Math.PI; peak(Math.cos(a) * R(900, 1300), Math.sin(a) * R(900, 1300), R(160, 260), R(160, 330), [.5, .52, .74], [1, .95, .92]); }
    } else {
      const ford = bg === 'ford', gcol = () => { const k = r(); return ford ? [.2 + k * .08, .36 + k * .1, .22 + k * .06] : [.24 + k * .1, .52 + k * .14, .22 + k * .08]; };
      const gn = (x, z) => { const k = hash(Math.round(x / 20) + 500, Math.round(z / 20) + 500) * .5 + (Math.sin(x * .013 + 1) * Math.sin(z * .017) * .25 + .25), w = clamp(1 - Math.hypot(x / (hw + 30), z / (hh + 30)), 0, 1) * .08; return ford ? [.2 + k * .1 + w, .36 + k * .12, .22 + k * .06] : [.22 + k * .14 + w * 1.5, .5 + k * .18 + w, .2 + k * .1]; };
      for (let ix = -44; ix < 44; ix++) for (let iz = -48; iz < 24; iz++) { const x = ix * 20, z = iz * 20; if (ford && z >= -80 && z < 0) continue; if (Math.abs(x) > 460 && (ix & 1 || iz & 1)) continue; const s2 = Math.abs(x) > 460 ? 40 : 20; A.gquad(x, z, x + s2, z + s2, 0, gn); }
      for (let i = 0; i < 46; i++) { const t0 = i / 46, x = (t0 - .5) * 620 + R(-8, 8), z = (ford ? 40 : 4) + Math.sin(t0 * 5) * 22 + R(-5, 5); A.quad(x - R(14, 26), z - R(8, 14), x + R(14, 26), z + R(8, 14), .06, ford ? [.34, .26, .2] : [.5, .38, .24]); }
      if (ford) { // the river
        for (let ix = -22; ix < 22; ix++) for (let k = 0; k < 4; k++) { const x = ix * 40, z = -80 + k * 20, d = Math.abs(k - 1.5) / 1.5; A.quad(x, z, x + 40, z + 20, -.6, [.16 + d * .1 + r() * .03, .4 + d * .1, .62 + d * .08], 1); }
        for (let i = 0; i < 90; i++) { const x = R(-800, 800), z = r() < .5 ? R(-88, -78) : R(-4, 6); Sh.cyl(M4.chain(M4.t(x, 0, z), M4.ry(r() * 6)), 0, -1, 0, R(3, 7), R(2, 4), R(2, 4), 6, '#8c8c84', 0, 1); }
        for (let i = 0; i < 70; i++) { const x = R(-500, 500), z = r() < .5 ? R(-96, -84) : R(0, 12), m = M4.chain(M4.t(x, 0, z), M4.rz(R(-.15, .15))); A.cyl(m, 0, 0, 0, .7, .4, R(14, 22), 3, '#6a8a44'); A.box(m, 0, 20, 0, 1.6, 5, 1.6, '#6a4a2a'); }
      }
      for (let i = 0; i < 420; i++) { const x = R(-420, 420), z = R(-400, 200); if (Math.abs(x) < hw + 6 && Math.abs(z) < hh + 6 && r() < .7) continue; if (ford && z > -84 && z < 2) continue; const m = M4.chain(M4.t(x, 0, z), M4.ry(r() * 6)); A.cyl(m, 0, 0, 0, 2.2, 0, R(4, 8), 3, ford ? '#3a6a40' : ['#3f9a3c', '#58b848', '#2f7a30'][i % 3]); if (i % 6 === 0 && !ford) A.box(m, 2, 3, 2, 1.5, 1.5, 1.5, i % 12 ? '#fff6d0' : '#ff9ac0', 1); }
      for (let i = 0; i < 130; i++) { const a = r() * 6.2832, d = R(0, 1), x = Math.cos(a) * (hw + 60 + d * 560), z = Math.sin(a) * (hh + 60 + d * 520) - 60; if ((z > 30 && Math.abs(x) < 260) || z > 260 || (ford && z > -110 && z < 30 && Math.abs(x) < 500)) continue; pine(x, z, R(1.2, 2.4)); }
      for (let i = 0; i < 12; i++) pine((i % 2 ? 1 : -1) * (hw + R(60, 130)), -hh + i * 7 - 30, R(1.3, 2));
      for (let i = 0; i < 34; i++) { const a = r() * 6.2832, d = R(0, 1), x = Math.cos(a) * (hw + 70 + d * 420), z = Math.sin(a) * (hh + 70 + d * 380) - 50; if ((z > 30 && Math.abs(x) < 260) || z > 240 || (ford && z > -110 && z < 30)) continue; oak(x, z, R(1.4, 2.4), ford ? ['#b8642a', '#c8862e', '#8a4a2a'][i % 3] : ['#58b848', '#7ac850', '#e8c25a', '#48a040'][i % 4]); }
      for (let i = 0; i < 16; i++) rock(R(-hw - 120, hw + 120), -hh - R(14, 90), R(.6, 1.6)); for (let i = 0; i < 6; i++) rock((i % 2 ? 1 : -1) * (hw + R(10, 40)), R(-hh, hh), R(.5, 1));
      // the Assay is graded: a dais of Proctors at the back, and the standards of the twelve Houses
      { const m = M4.t(0, 0, -hh - 150); Sh.box(m, 0, 9, 0, 150, 18, 46, '#e8e2d4'); Sh.box(m, 0, 20, -14, 150, 4, 18, '#d8d2c4'); A.box(m, 0, 18.4, 23.2, 150, 1.4, .6, '#e8c25a', 1); for (let i = -3; i <= 3; i++) { Sh.cyl(m, i * 24, 18, -20, 1.4, 1.4, 44, 5, '#e8c25a'); } Sh.box(m, 0, 64, -12, 160, 3, 30, '#f4f0e6'); A.box(m, 0, 62, 3.4, 160, 2, .6, '#e8c25a', 1);
        for (let i = -2; i <= 2; i++) { const pm = M4.t(i * 22, 18, -hh - 150); Sh.cyl(pm, 0, 0, 0, 5, 3.4, 22, 6, i ? '#b8bcc8' : '#f4f2ec'); Sh.box(pm, 0, 26, 0, 6, 7, 6, '#f0dccc'); Sh.box(pm, 0, 30, -.4, 6.8, 2.4, 6.8, i ? '#c8ccd4' : '#f6eac0'); if (!i) Sh.box(pm, 0, 31.6, 0, 7, 1, 7, '#e8c25a'); A.box(pm, 0, 20, 3.4, 1.4, 14, .5, '#e8c25a', 1); } }
      const HC = ['#7a5ac8', '#2aa6a0', '#c8452e', '#e8c25a', '#3a6ac8', '#58b848', '#c85a9a', '#e88a3a', '#8a8a92', '#40c8e8', '#a03a3a', '#f4f0e6'];
      for (let i = 0; i < 12; i++) { const m = M4.t(-286 + i * 52, 0, -hh - 205 - (i % 2) * 14); Sh.cyl(m, 0, 0, 0, 1.2, 1.2, 96, 5, '#8a8478'); Sh.box(m, 7, 80, 0, 14, 26, .8, HC[i]); A.box(m, 7, 84, .6, 6, 6, .3, '#e8c25a', 1); A.box(m, 0, 97, 0, 3, 3, 3, '#e8c25a', 1); }
      for (let i = 0; i < 9; i++) { const x = R(-hw - 90, hw + 90), z = -hh - R(16, 60), m = M4.chain(M4.t(x, 0, z), M4.ry(r() * 6), M4.rx(1.45)); Sh.box(m, 0, 10, 2.4, 13, 22, 6, i % 2 ? '#dfe6e4' : '#e8e0cc'); Sh.box(m, 0, 24, 2.6, 8, 8, 7, '#f0dccc'); Sh.box(m, 0, 8, 5.6, 14, 2.4, .6, i % 2 ? '#2aa6a0' : '#7a5ac8'); const bm = M4.chain(M4.t(x + R(-14, 14), 0, z + R(-8, 8)), M4.ry(r() * 6), M4.rz(R(-.5, .5))); Sh.box(bm, 0, 13, 0, 1.6, 26, .8, '#fff6dc'); Sh.box(bm, 0, 25, 0, 6, 1.4, 1.6, '#e8c25a'); }
      for (let i = 0; i < 26; i++) { const m = M4.chain(M4.t(R(-hw - 60, hw + 60), 0, R(-hh - 50, hh + 10)), M4.rx(R(-.5, .5)), M4.rz(R(-.4, .4))); if (Math.abs(m[12]) < hw && Math.abs(m[14]) < hh) continue; Sh.cyl(m, 0, 0, 0, .4, .4, 12, 3, '#6a5a44'); Sh.box(m, 0, 12, 0, 2.2, 3, .3, i % 2 ? '#2aa6a0' : '#7a5ac8'); }
      for (let i = 0; i <= 10; i++) for (const sd of [-1, 1]) { const x = -hw - 8 + i * (hw * 2 + 16) / 10, zz = sd * (hh + 8), m = M4.chain(M4.t(x, 0, zz), M4.rz(R(-.08, .08))); Sh.cyl(m, 0, 0, 0, 1, .8, 12, 4, '#7a6248'); A.box(m, 0, 12.6, 0, 2.4, 1.4, 2.4, '#e8c25a', 1); if (i < 10) A.box(M4.t(x + (hw * 2 + 16) / 20, 9.4, zz), 0, 0, 0, (hw * 2 + 16) / 10, .8, .5, i % 2 ? '#f4f0e6' : (x < 0 ? '#7a5ac8' : '#2aa6a0'), 1); }
      for (let i = 0; i <= 5; i++) for (const sd of [-1, 1]) { const zz = -hh - 8 + i * (hh * 2 + 16) / 5, x = sd * (hw + 8); Sh.cyl(M4.t(x, 0, zz), 0, 0, 0, 1, .8, 12, 4, '#7a6248'); if (i < 5) A.box(M4.t(x, 9.4, zz + (hh * 2 + 16) / 10), 0, 0, 0, .5, .8, (hh * 2 + 16) / 5, sd < 0 ? '#7a5ac8' : '#2aa6a0', 1); }
      for (let i = 0; i < 30; i++) { const x = R(-hw, hw), zz = R(-hh, hh); A.quad(x - R(5, 12), zz - R(3, 7), x + R(5, 12), zz + R(3, 7), .05, ford ? [.3, .3, .22] : [.36, .5, .24]); }
      tent(-hw - 44, -hh - 20, '#7a5ac8'); tent(-hw - 96, -hh + 26, '#7a5ac8'); tent(hw + 44, -hh - 20, '#2aa6a0'); tent(hw + 96, -hh + 26, '#2aa6a0');
      const mc = ford ? [[.36, .28, .5], [.26, .2, .42]] : [[.48, .6, .82], [.36, .52, .74]];
      for (let i = 0; i < 12; i++) { const a = Math.PI * 1.02 + (i + .5) / 12 * Math.PI * .96; peak(Math.cos(a) * R(950, 1250), Math.sin(a) * R(900, 1250), R(180, 300), R(220, 420), mc[0], ford ? [1, .78, .66] : [.97, .98, 1]); }
      for (let i = 0; i < 14; i++) { const a = Math.PI + (i + .5) / 14 * Math.PI; peak(Math.cos(a) * R(600, 800), Math.sin(a) * R(560, 760), R(110, 190), R(90, 190), mc[1], null); }
      // the white keep on the ridge
      { const kx = ford ? 360 : -340, kz = -560, m = M4.t(kx, 0, kz); A.cyl(m, 0, -10, 0, 150, 90, 70, 7, ford ? [.24, .3, .26] : [.3, .5, .3]); A.box(m, 0, 95, 0, 90, 70, 60, '#f0ece4'); A.box(m, -60, 85, 10, 34, 110, 34, '#e6e2d8'); A.box(m, 56, 100, -6, 30, 140, 30, '#f6f3ec'); A.cyl(m, 56, 170, -6, 22, 0, 36, 4, '#e8c25a'); A.cyl(m, -60, 140, 10, 24, 0, 30, 4, '#7a5ac8'); for (let i = 0; i < 5; i++) A.box(m, -36 + i * 18, 134, 30, 9, 8, 4, '#f0ece4'); A.box(m, 0, 128, 30.4, 90, 2, .6, '#e8c25a', 1); }
      for (let i = 0; i < 9; i++) cloud(R(-1100, 1100), R(330, 520), R(-1300, -700), R(1.4, 3), ford ? [1, .74, .62] : [1, 1, 1]);
    }
    const mk2 = B => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, B.a.subarray(0, B.n * 9), gl.STATIC_DRAW); return { b, n: B.n }; };
    return this.envs[bg] = { a: mk2(A), s: mk2(Sh), hw, hh };
  },

  // ---------------------------------------------------------- a frame
  begin(B, voidC, sx, sy) {
    this.fit(); this.used = true; this.bg = B.def.bg; this.voidC = voidC || null; this.dyn.n = 0; this.dyn.flash = 0; this.sprN = 0; this.decN = 0; this.frame++; this.dt = B.freeze > 0 ? 0 : clamp(B.t - this.lastT, 0, .05); this.lastT = B.t; this.t = B.t; if (this.frame % 240 === 0) for (const [k, r] of this.rigs) if (r.seen < this.frame - 120) this.rigs.delete(k);
    const c = B.cam, f = c.f * this.FK, pitch = Math.atan((H / 2 - c.hor) / f), fovy = 2 * Math.atan(H / 2 / f), eye = this.eye = [c.x + (sx || 0) * .25, Math.max(4, c.h * this.HK - (sy || 0) * .25), c.y];
    const roll = Settings.d.reduce ? 0 : (c.roll || 0), view = M4.chain(M4.rz(roll), M4.rx(pitch), M4.t(-eye[0], -eye[1], -eye[2])); this.rage = B.cine ? 0 : clamp(((B.p ? B.p.fury : 0) - 55) / 45, 0, 1); this.vp = M4.mul(M4.persp(fovy, W / H, 3, 4000), view); this.f3 = f; this.pitch = pitch;
    const cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll); this.right = [cr, sr * cp, -sr * sp]; this.up = [-sr, cr * cp, -cr * sp]; this.fwd = [0, -sp, -cp];
  },
  proj(x, y, h) { const m = this.vp, Y = (h || 0) * this.HK, cx = m[0] * x + m[4] * Y + m[8] * y + m[12], cy = m[1] * x + m[5] * Y + m[9] * y + m[13], cw = Math.max(1, m[3] * x + m[7] * Y + m[11] * y + m[15]); return { x: (cx / cw * .5 + .5) * W, y: (.5 - cy / cw * .5) * H, s: this.f3 / cw / this.FK * 1.0, dz: cw }; },
  glow(x, y, z, size, col, a) { if (this.sprN >= 15590) return; const s = this.spr, r = this.right, u = this.up, c = rgb3(col), Q = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]; for (const [qx, qy] of Q) { const i = this.sprN * 9; s[i] = x + (r[0] * qx + u[0] * qy) * size; s[i + 1] = y + (r[1] * qx + u[1] * qy) * size; s[i + 2] = z + (r[2] * qx + u[2] * qy) * size; s[i + 3] = qx; s[i + 4] = qy; s[i + 5] = c[0]; s[i + 6] = c[1]; s[i + 7] = c[2]; s[i + 8] = a; this.sprN++; } },
  dv(x, z, c, a, y) { if (this.decN >= 2390 * 3) return; const d = this.dec, i = this.decN * 9; d[i] = x; d[i + 1] = y || .35; d[i + 2] = z; d[i + 3] = 0; d[i + 4] = 0; d[i + 5] = c[0]; d[i + 6] = c[1]; d[i + 7] = c[2]; d[i + 8] = a; this.decN++; },
  css(col) { if (col[0] === '#') { const c = rgb3(col.slice(0, 7)); return [c, col.length > 7 ? parseInt(col.slice(7, 9), 16) / 255 : 1]; } const m = col.match(/[\d.]+/g) || [255, 255, 255, 1]; return [[m[0] / 255, m[1] / 255, m[2] / 255], m[3] === undefined ? 1 : +m[3]]; },
  poly(pts, col) { const [c, a] = this.css(col); for (let i = 1; i < pts.length - 1; i++) { this.dv(pts[0][0], pts[0][1], c, a); this.dv(pts[i][0], pts[i][1], c, a); this.dv(pts[i + 1][0], pts[i + 1][1], c, a); } },
  ring(x, z, rad, col, wd) { const [c, a] = this.css(col), w = wd || 2.2, N = 26; for (let i = 0; i < N; i++) { const a0 = i / N * 6.2832, a1 = (i + 1) / N * 6.2832, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1), r0 = Math.max(0, rad - w), r1 = rad + w; this.dv(x + c0 * r0, z + s0 * r0, c, a); this.dv(x + c0 * r1, z + s0 * r1, c, a); this.dv(x + c1 * r1, z + s1 * r1, c, a); this.dv(x + c0 * r0, z + s0 * r0, c, a); this.dv(x + c1 * r1, z + s1 * r1, c, a); this.dv(x + c1 * r0, z + s1 * r0, c, a); } },

  // ---------------------------------------------------------- a fighter
  // Animation is pose to pose: each state names a key pose (a set of joint angles), and every joint
  // chases its target on a spring. Springs give the blends between states for free, and the overshoot
  // and settle that make a swing read as heavy. Attacks have three beats: wind back, cut through, hold.
  // Cloth, hair and the head lag behind the body. The blade leaves a ribbon and stretches at speed.
  POSE0: { cr: 1.2, lean: .1, side: 0, tw: -.3, hx: 0, hy: 0, rp: -.75, ry: .25, re: -.7, tilt: -1.35, lp: -.4, ly: -.3, le: -.9, hl: .28, kl: .35, hr: -.22, kr: .3, sp: .14, lz: 0, sq: 1 },
  target(o, opt, st, blade, mv, t, idx) {
    const P = Object.assign({}, this.POSE0), an = (o.anim || 0) * 12, S = Object.assign.bind(null, P); let rate = 14, zeta = .7;
    P.tw += Math.sin(t * 1.7 + idx) * .05; P.rp += Math.sin(t * 2.1 + idx) * .04; P.cr += Math.sin(t * 2.6 + idx) * .3; P.hy = Math.sin(t * .9 + idx * 2) * .12;
    if (blade === 2) S({ rp: -.3, re: -.9, tilt: -2.5, ry: 0, tw: -.15 });
    const sweep = o.mode === 'sweep', swingT = o.swing > 0 ? .18 - o.swing : -1;
    if (mv) { const a = Math.sin(an), c = Math.cos(an); S({ lean: st === 'charge' ? .72 : .4, cr: 1 + Math.abs(c) * -.9, tw: a * .22, hl: .95 * a, kl: Math.max(0, -a) * 1.35 + .2, hr: -.95 * a, kr: Math.max(0, a) * 1.35 + .2, sp: .05, lp: a * .85, ly: 0, le: -1.0, rp: st === 'charge' ? .9 : .45 - a * .2, ry: -.15, re: -.35, tilt: st === 'charge' ? -.2 : -.75, hx: -.2 }); if (blade === 2) S({ rp: -.9, re: -.7, tilt: -.35 }); rate = 22; }
    if (st === 'atk' || swingT >= 0) {
      const tt = st === 'atk' ? o.t : swingT, cb = blade === 2 ? 4 : st === 'atk' || !o.K ? (o.combo || 1) : sweep ? 1 : 3;
      if (cb === 4) { if (tt < .03) S({ rp: -.9, re: -1.7, tilt: -.3, lz: -4, tw: -.5, cr: 2.5, lean: -.05 }); else S({ rp: -1.5, re: 0, tilt: -.08, ry: .1, lz: 10, lean: .5, tw: .55, cr: 2.2, hr: .9, kr: .7, hl: -.6, kl: .1, lp: .9, le: -.3 }); rate = 38; zeta = .6; }
      else if (cb === 3) { if (tt < .04) S({ cr: 4.5, rp: -2.6, re: -1.0, tilt: -.6, lean: -.2, hl: .5, kl: 1.0, hr: .5, kr: 1.0, lp: -2.2, le: -1.0, tw: 0, ry: 0 });
        else if (tt < .085) S({ cr: 0, rp: -3.0, re: -.4, tilt: -.3, lean: -.4, hl: .9, kl: 1.5, hr: .2, kr: 1.3, lp: -2.7, le: -.3, tw: 0, ry: 0, sq: 1.12 });
        else S({ cr: 5.5, rp: -.5, re: 0, tilt: -.62, lean: .8, hl: 1.05, kl: 1.3, hr: -.5, kr: 1.0, lp: .8, le: -.4, tw: .15, ry: .05, lz: 5, sq: tt < .16 ? .88 : 1, hx: .3 }); rate = 40; zeta = .62; }
      else { const m = cb === 2 ? -1 : 1; // forehand, then the backhand that mirrors it
        if (tt < .045) S({ tw: -.95 * m, rp: -1.5, ry: m > 0 ? -1.95 : 1.5, re: m > 0 ? -.5 : -1.3, tilt: -.3, lean: -.06, cr: 2.6, lz: -2, hl: .1, hr: -.25, lp: -.9, ly: .4 * m, hy: .5 * m });
        else if (tt < .11) S({ tw: .75 * m, rp: -1.45, ry: m > 0 ? .95 : -1.15, re: 0, tilt: -.1, lean: .38, cr: 2.2, lz: 6, [m > 0 ? 'hr' : 'hl']: .8, [m > 0 ? 'kr' : 'kl']: .75, [m > 0 ? 'hl' : 'hr']: -.6, [m > 0 ? 'kl' : 'kr']: .1, lp: 1.0, ly: -.5 * m, le: -.2, hy: -.3 * m });
        else S({ tw: 1.05 * m, rp: -1.3, ry: m > 0 ? 1.55 : -1.75, re: -.35, tilt: -.5, lean: .3, cr: 2.4, lz: 5, [m > 0 ? 'hr' : 'hl']: .7, [m > 0 ? 'kr' : 'kl']: .7, [m > 0 ? 'hl' : 'hr']: -.5, lp: .8, ly: -.4 * m, hy: -.4 * m });
        rate = tt < .045 ? 30 : tt < .11 ? 44 : 20; zeta = tt < .11 ? .8 : .5; }
    } else if (st === 'wind') { const k = Math.min(1, o.t / Math.max(.2, (o.K && o.K.wind) || .5)), tr = Math.sin(t * 60) * .03 * k; // the telegraph is a long, readable anticipation
      if (o.mode === 'charge') S({ cr: 5, lean: .75, rp: 1.0, re: -.2, tilt: -.2, hl: 1.1, kl: 1.4, hr: -.6, kr: .9, lp: -.9, le: -1.2, tw: -.3 });
      else if (blade === 2) S({ rp: -.9 + tr, re: -1.5 - k * .3, tilt: -.3, lz: -3 - k * 3, tw: -.6, cr: 2.5 + k * 1.5, lean: -.08, hl: -.3, hr: .4, kr: .5 });
      else if (sweep) S({ tw: -.8 - k * .5, rp: -1.5 + tr, ry: -1.8 - k * .5, re: -.5, tilt: -.25, cr: 2.4 + k * 1.6, lean: -.1, lp: -1.0, ly: .5, hy: .6, hl: .2, kl: .6, hr: -.3, kr: .5 });
      else S({ rp: -2.5 - k * .4 + tr, re: -.9, tilt: -.5, cr: 1.5 + k * 2.5, lean: -.14 - k * .1, lp: -2.0, le: -.9, tw: -.2, hl: .4, kl: .7, hr: -.2, kr: .5, hx: .15 });
      rate = 12; zeta = .9; }
    else if (st === 'recover' && swingT < 0) { const k = Math.max(0, 1 - Math.max(0, o.t) / .5); S({ cr: 2.2 + k * 1.2, lean: .2 + k * .25, rp: -.6, re: -.2, tilt: -.7 - k * .3, tw: .4 * k, lp: .4, hx: .25 * k }); rate = 9; } // spent: this is when to hit him
    else if (st === 'hurt') { const yw = Math.atan2(o.fx || 0, o.fy === undefined ? 1 : o.fy), f = clamp(((o.kx || 0) * Math.sin(yw) + (o.ky || 0) * Math.cos(yw)) / 90, -1, 1), sd = clamp(((o.kx || 0) * Math.cos(yw) - (o.ky || 0) * Math.sin(yw)) / 90, -1, 1);
      S({ lean: f < .2 ? -.55 : .5, side: sd * .45, tw: sd * .6 + (idx % 2 ? .3 : -.3), hx: f < .2 ? -.55 : .5, hy: sd * .5, rp: -2.3, ry: -.9, re: -.5, tilt: -1.2, lp: -2.2, ly: .8, le: -.5, cr: 2.8, kl: .7, kr: .6, hl: -.2, hr: .3, sq: .94 }); rate = 34; zeta = .5; }
    if (opt.pose === 'raise') opt.win = 2; if (opt.pose === 'kneel') { S({ cr: 9, lean: .35, hl: 1.4, kl: 1.6, hr: -.3, kr: 1.5, rp: -.2, re: -.3, tilt: -.9, lp: .1, le: -.6, hx: .45, tw: 0 }); rate = 8; }
    if (opt.win) { const k = Math.sin(t * 2) * .03; S(opt.win === 2 ? { rp: -3.0 + k, re: -.15, tilt: -.1, ry: 0, lp: -2.8, le: -.3, lean: -.12, cr: 0, tw: 0, hx: -.25, hl: .1, hr: -.1, kl: .1, kr: .1 } : { cr: 2.6, lean: .28 + k, tw: .1, rp: -.35, ry: .1, re: -.1, tilt: -.5, lp: .15, le: -.5, hx: .4, hl: .5, kl: .7, hr: -.4, kr: .5, sp: .2 }); rate = 7; zeta = .8; }
    else if (opt.rage > .9 && (st === 'idle' || st === 'move') && !mv) { const k = Math.sin(t * 5.5) * .5 + .5; S({ cr: 2.8 + k * .8, lean: .3, tw: -.15, rp: .15, ry: -.35, re: -.15, tilt: -.45, lp: .1, ly: .3, le: -1.3, hx: .32, hl: .45, kl: .7, hr: -.4, kr: .55, sp: .22 }); rate = 16; }
    else if (opt.fear && st === 'approach') { S({ rp: -1.25, ry: .85, re: -1.15, tilt: -1.85, lp: -1.2, le: -1.3, ly: -.5, cr: 2.8, lean: -.2, tw: -.25, hx: -.1 }); if (mv) S({ lean: -.28 }); rate = 18; }
    if ((o.z || 0) > 1 || st === 'down') { S({ lean: -.7, tw: Math.sin(t * 7 + idx) * .3, rp: -2.7, ry: -1.2, re: -.2, tilt: -1, lp: -2.7, ly: 1.2, le: -.2, hl: .7, kl: 1.0, hr: -.35, kr: .5, cr: 0, hx: -.4, sp: .3 }); rate = 20; }
    if (st === 'dodge') { S({ cr: 6.5, lean: 1.0, hl: 1.25, kl: 1.7, hr: 1.25, kr: 1.7, rp: -.6, re: -1.5, tilt: -.6, lp: -.6, le: -1.5, hx: .5, tw: 0 }); rate = 40; }
    if (o.guardT > 0 && st !== 'wind' && st !== 'atk' && swingT < 0 && st !== 'hurt') { S({ rp: -1.3, ry: .9, re: -1.2, tilt: -1.9, lp: -1.3, le: -1.3, ly: -.6, cr: 2.4, lean: -.06, tw: -.2 }); rate = 26; }
    return [P, rate, zeta];
  },
  char(o, opt) {
    const D = this.dyn, t = this.t, L = (CAST[opt.id] || CAST.cadv1).look(), idx = o.idx || 0, st = o.st || 'idle', sc = (o.sc || 1), fx = o.fx || 0, fy = o.fy === undefined ? 1 : o.fy, rm = Settings.d.reduce;
    if (o === Brawl.p && o.inv > 0 && st !== 'dodge' && !Brawl.sup && !Brawl.art && Math.floor(t * 20) % 2) return;
    const arm = L.armor || '#efe8d4', trim = L.trim || '#e8c25a', sash = L.sash || '#7a5ac8', skin = L.skin || '#d8a07a', hair = L.hair || '#e9cf7a', dark = shade(arm, .62), blade = opt.blade || 0;
    const z = (o.z || 0) * this.HK * 1.2;
    // the rig remembers where every joint was
    const key = opt.key || o; let R = this.rigs.get(key); const yawT = Math.atan2(fx, fy), fresh = !R;
    if (!R) { R = { p: Object.assign({}, this.POSE0), v: {}, yaw: yawT, x: o.x, y: o.y, vx: 0, vy: 0, cape: [0, 0, 0], cv: [0, 0, 0], trail: [], hop: 0, land: 0 }; this.rigs.set(key, R); }
    const rs = Math.hypot(R.vx, R.vy), mv = opt.run || st === 'charge' || ((st === 'move' || st === 'approach' || (o.ally && st !== 'hurt')) && rs > 16);
    R.seen = this.frame; const dt = fresh ? 0 : this.dt, [T, rate, zeta] = this.target(o, opt, st, blade, mv, t, idx);
    const jump = Math.hypot(o.x - R.x, o.y - R.y) > 26; // teleports (ELEVEN, the arts) snap instead of sliding
    if (dt > 0) { const n = 2, h = dt / n, k = rate * rate, d = 2 * rate * zeta; for (let s = 0; s < n; s++) for (const j in T) { const v = (R.v[j] || 0) + ((T[j] - R.p[j]) * k - (R.v[j] || 0) * d) * h; R.v[j] = v; R.p[j] += v * h; }
      let dy = yawT - R.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; R.yaw += dy * (jump ? 1 : Math.min(1, dt * 18));
      const ivx = jump ? 0 : (o.x - R.x) / dt, ivy = jump ? 0 : (o.y - R.y) / dt; R.vx += (ivx - R.vx) * Math.min(1, dt * 12); R.vy += (ivy - R.vy) * Math.min(1, dt * 12); }
    else if (fresh || jump) { Object.assign(R.p, T); R.yaw = yawT; }
    R.x = o.x; R.y = o.y; const P = R.p, yaw = R.yaw, spd = Math.hypot(R.vx, R.vy), fwdV = R.vx * Math.sin(yaw) + R.vy * Math.cos(yaw), sideV = R.vx * Math.cos(yaw) - R.vy * Math.sin(yaw);
    let hop = st === 'atk' && o.combo === 3 ? Math.sin(Math.min(1, o.t / .13) * Math.PI) * 10 : 0; if (R.hop > 2 && hop <= .5 && z <= 0) R.land = .14; R.hop = hop + z; R.land = Math.max(0, R.land - dt);
    const sq = P.sq * (1 - Math.sin(R.land / .14 * Math.PI) * .12), fall = st === 'down' ? Math.min(1, o.t * 3.5) * 1.5 + (z > 0 ? o.t * 9 : 0) : z > 1 ? t * 7 % 6.2832 * .0 - .5 : 0, roll = st === 'dodge' ? o.t / .3 * 6.2832 : 0;
    D.flash = o.flash > 0 ? .55 : 0;
    let root = M4.chain(M4.t(o.x, z + hop * this.MS, o.y), M4.ry(yaw), M4.s(sc * this.MS));
    if (fall) root = M4.chain(root, M4.t(0, 4, 0), M4.rx(-fall), M4.t(0, -2, 0));
    if (roll) { const da = Math.atan2(o.dx || 0, o.dy || 0) - yaw; root = M4.chain(root, M4.ry(da), M4.t(0, 13, 0), M4.rx(roll), M4.t(0, -13, 0), M4.ry(-da)); if (!rm) this.glow(o.x, 16, o.y, 20, [.7, .6, 1], .25); }
    if (Math.abs(sq - 1) > .005) { const m = M4.id(); m[5] = sq; m[0] = m[10] = 1 / Math.sqrt(sq); root = M4.mul(root, m); }
    root = M4.mul(root, M4.t(0, -Math.max(0, P.cr), P.lz));
    // legs: hip, knee, a planted boot
    for (const sd of [-1, 1]) { const hip = sd < 0 ? P.hl : P.hr, knee = Math.max(0, sd < 0 ? P.kl : P.kr), lm = M4.chain(root, M4.t(sd * 3.7, 18, 0), M4.rz(sd * P.sp), M4.rx(-hip)), sm = M4.chain(lm, M4.t(0, -8.5, 0), M4.rx(knee)), fm = M4.chain(sm, M4.t(0, -8.8, 0), M4.rx(Math.max(-.6, hip - knee) * .6));
      D.box(lm, 0, -4.2, 0, 5.4, 9, 6.2, dark); D.box(lm, 0, -3, 3.2, 5.6, 5, .6, arm); D.box(lm, 0, -8.4, .6, 5.8, 2.2, 6.8, trim);
      D.box(sm, 0, -4.4, 0, 4.8, 8.8, 5.4, dark); D.box(sm, 0, -4, 2.7, 5, 7, 1.2, arm); D.box(sm, 0, -1.2, 2.9, 5.2, 1.2, 1, trim, 1); D.box(fm, 0, .6, 1.4, 5.4, 3.2, 8.8, '#4a3a2a'); D.box(fm, 0, -.7, 1.4, 5.6, .8, 9, '#2e241a'); }
    const up = M4.chain(root, M4.t(0, 18, 0), M4.rx(P.lean + clamp(fwdV / 300, -.25, .25)), M4.rz(P.side - clamp(sideV / 260, -.3, .3)), M4.ry(P.tw));
    // cape: three panels on springs, dragged by how fast he is really moving
    if (L.cape) { let cm = M4.chain(up, M4.t(0, 15, -4.4)); for (let i = 0; i < 3; i++) { const want = .12 + clamp(fwdV / 110, -.2, 1.1) * (i ? .4 : 1) + clamp(spd / 200, 0, .4) + Math.sin(t * (5 + i) + i * 1.3 + idx) * (.05 + spd / 900) - P.lean * (i ? 0 : .7), k = 90, dd = 9; if (dt > 0) { R.cv[i] += ((want - R.cape[i]) * k - R.cv[i] * dd) * dt; R.cape[i] += R.cv[i] * dt; } else R.cape[i] = want; cm = M4.mul(cm, M4.rx(-clamp(R.cape[i], -.5, 1.7))); D.box(cm, 0, -5.5, -.3, 15 - i * .6, 11, .9, i === 1 ? shade(L.cape, .9) : L.cape); D.box(cm, 0, -10.6, -.3, 15 - i * .6, .8, 1, trim); cm = M4.mul(cm, M4.t(0, -11, 0)); } }
    const br = 1 + Math.sin(t * 2.6 + idx) * .025;
    D.box(up, 0, 3.6, 0, 11.4, 7.2, 7, shade(arm, .9)); D.box(up, 0, 10.6, 0, 14.4 * br, 8.4, 8.4 * br, arm); D.box(up, 0, 11, 4.3 * br, 9, 6, .5, shade(arm, 1.1)); D.box(up, 0, 14.6, 4.3 * br, 12, .9, .5, trim, 1); D.box(up, 0, 7.2, 4.3 * br, 6, .8, .5, trim, 1);
    D.box(up, 0, .8, 0, 12.4, 2, 7.8, trim); D.box(up, 0, 2.5, 0, 12.2, 1.5, 7.6, sash); D.box(up, 0, 15.6, 0, 5, 2, 5, shade(skin, .86));
    for (const sd of [-1, 1]) { const tm = M4.chain(up, M4.t(sd * 3, 1.6, -3.9), M4.rx(-.2 - clamp(fwdV / 90, -.2, 1.2) - Math.sin(t * 7 + sd + idx) * (.05 + spd / 500)), M4.rz(sd * .1 - clamp(sideV / 200, -.4, .4))); D.box(tm, 0, -5, 0, 2.6, 10, .5, sash); D.box(tm, 0, -10.4, 0, 2.6, .8, .6, trim); }
    if (blade === 1) { const sc2 = M4.chain(up, M4.t(6.6, 1, -1), M4.rx(.5 + clamp(fwdV / 300, 0, .3))); D.box(sc2, 0, -8, 0, 1.8, 16, 2.6, '#3a2a1e'); D.box(sc2, 0, -15.6, 0, 2.2, 1.6, 3, trim, 1); }
    D.box(M4.chain(up, M4.t(0, 9.4, 0), M4.rz(.74)), 0, 0, 0, 19, 2.6, 9.2, sash); D.box(up, 0, 10.6, 4.8, 3, 3, .6, trim, 1); D.box(up, 0, 10.6, 5, 1.4, 1.4, .6, [1, 1, .85], 1);
    for (const sd of [-1, 1]) { const pm = M4.chain(up, M4.t(sd * 8.4, 14.4, 0), M4.rz(-sd * .22)); D.box(pm, 0, 0, 0, 6.6, 3.4, 9.8, trim); D.box(pm, sd * .8, -2.2, 0, 5.4, 2, 8.8, shade(trim, .78)); D.box(pm, 0, 1.9, 0, 5, .6, 8, [1, .95, .7], 1); if (L.cape || opt.boss) D.box(pm, sd * 1.4, 2.6, 0, 3, 2.4, 5, trim); }
    // head: it turns late and keeps its eyes level while the body leans
    const hd = M4.chain(up, M4.t(0, 16, 0), M4.rx(-P.lean * .65 + P.hx), M4.ry(-P.tw * .7 + P.hy));
    D.box(hd, 0, 1, 0, 4, 2.5, 4, shade(skin, .82));
    if (L.helm) { D.box(hd, 0, 7, 0, 10.4, 10.4, 10.4, '#d8dce4'); D.box(hd, 0, 7.6, 5.3, 8, 1.6, .4, '#1e1e28', 1); D.box(hd, 0, 12.3, 0, 10.8, 1, 10.8, trim); const pl = M4.chain(hd, M4.t(0, 12.6, -1), M4.rx(-clamp(fwdV / 160, -.2, .7) - Math.sin(t * 6 + idx) * .06)); D.box(pl, 0, 3, -1, 2, 6.5, 9, sash); }
    else { D.box(hd, 0, 7, 0, 9, 9.4, 9, skin); D.box(hd, 0, 12, -.4, 10, 3.4, 10.2, hair); D.box(hd, 0, 7.5, -4.4, 10, 8, 1.8, hair); D.box(hd, -4.7, 8.6, -1, 1, 5.6, 6, hair); D.box(hd, 4.7, 8.6, -1, 1, 5.6, 6, hair);
      if (L.long) { let hm2 = M4.chain(hd, M4.t(0, 4, -4.6)); for (let i = 0; i < 2; i++) { hm2 = M4.mul(hm2, M4.rx(-.08 - clamp(fwdV / 150, -.2, .9) * (i ? .5 : 1) - Math.sin(t * 5 + i + idx) * .05)); D.box(hm2, 0, -3, 0, 9 - i, 6, 1.6, i ? shade(hair, .92) : hair); hm2 = M4.mul(hm2, M4.t(0, -6, 0)); } }
      if (L.spiky) for (let i = 0; i < 4; i++) D.box(M4.chain(hd, M4.t(-3.6 + i * 2.4, 13.4, -1 + (i % 2) * 2), M4.rz((i - 1.5) * .25), M4.rx(-clamp(fwdV / 300, 0, .4))), 0, 1, 0, 2, 3.4, 2.4, shade(hair, 1.08));
      { const me = o === Brawl.p && !Brawl.cine, rg = me ? this.rage : (opt.aura || 0) > 2.5 ? 1 : 0, ec = [1, .78 - rg * .46, .25 - rg * .15], es = 1 + rg * .5, ang = st === 'atk' || st === 'wind' || rg > .5 ? .5 : 0; D.box(hd, -2.1, 7.4, 4.6, 1.7 * es, 1.5 * es, .4, ec, 1); D.box(hd, 2.1, 7.4, 4.6, 1.7 * es, 1.5 * es, .4, ec, 1); if (rg > .5 && !rm) { const e1 = [hd[12] + hd[8] * 5 + hd[4] * 7.4, hd[13] + hd[9] * 5 + hd[5] * 7.4, hd[14] + hd[10] * 5 + hd[6] * 7.4]; this.glow(e1[0], e1[1], e1[2], 5 + rg * 3, [1, .3, .1], .5 * rg); }
        for (const sd of [-1, 1]) D.box(M4.chain(hd, M4.t(sd * 2.1, 9.1, 4.6), M4.rz(sd * ang)), 0, 0, 0, 2.8, .8, .4, shade(hair, .6)); }
      D.box(hd, 0, 6, 4.9, 1.4, 2.2, 1, shade(skin, .9)); D.box(hd, 0, 4.4, 4.6, st === 'atk' || st === 'hurt' ? 2.4 : 2.6, st === 'atk' || st === 'hurt' ? 1.6 : .7, .3, st === 'atk' || st === 'hurt' ? '#3a1410' : shade(skin, .7));
      if (L.smudge) { D.box(hd, 3, 5.6, 4.6, 1.8, 1.4, .3, '#5a4a44'); D.box(hd, -3.4, 4.6, 4.6, 1.2, 1, .3, '#5a4a44'); }
      if (L.circlet) { D.box(hd, 0, 11, 0, 9.8, 1.2, 9.8, trim, 1); D.box(hd, 0, 12.2, 4.9, 1.6, 2, .5, [1, 1, .9], 1); } }
    // off arm: shoulder, elbow, an open hand for balance
    { const am = M4.chain(up, M4.t(8.8, 13, 0), M4.rz(.14), M4.ry(P.ly), M4.rx(P.lp)), fm = M4.chain(am, M4.t(0, -7, 0), M4.rx(P.le)); D.box(am, 0, -3.6, 0, 4.2, 7.4, 4.6, arm); D.box(fm, 0, -3.2, 0, 3.8, 6.6, 4.2, shade(arm, .92)); D.box(fm, 0, -1, 0, 4.4, 1.2, 4.8, trim, 1); D.box(fm, 0, -7.6, 0, 3.6, 2.6, 3.8, skin); }
    // sword arm: shoulder, elbow, wrist, steel
    const am = M4.chain(up, M4.t(-8.8, 13, 0), M4.rz(-.14), M4.ry(P.ry), M4.rx(P.rp)), fm = M4.chain(am, M4.t(0, -7, 0), M4.rx(P.re));
    D.box(am, 0, -3.6, 0, 4.2, 7.4, 4.6, arm); if (L.band) D.box(am, 0, -3.4, 0, 4.7, 2.6, 5.1, '#c8281e'); D.box(fm, 0, -3.2, 0, 3.8, 6.6, 4.2, shade(arm, .92)); D.box(fm, 0, -1, 0, 4.4, 1.2, 4.8, trim, 1); D.box(fm, 0, -7.6, 0, 3.6, 2.6, 3.8, skin);
    if (blade) { const hm = M4.chain(fm, M4.t(0, -7.8, 0), M4.rx(P.tilt)), av = Math.abs(R.v.ry || 0) + Math.abs(R.v.rp || 0) + Math.abs(R.v.tw || 0) * .6, fast = av > 9, BL = (blade === 2 ? 58 : 27) * (1 + (rm ? 0 : clamp((av - 9) / 60, 0, .45))), hot = o === Brawl.p && !Brawl.cine ? this.rage : (opt.aura || 0) > 2.5 ? 1 : 0, bc = blade === 2 ? [.86, .88, .92] : [1, .97 - hot * .4, .86 - hot * .6];
      if (blade === 2) { D.box(hm, 0, -BL * .35, 0, 1.6, BL, 1.6, '#6a5a44'); D.cyl(M4.chain(hm, M4.t(0, -BL * .85, 0), M4.rx(Math.PI)), 0, 0, 0, 2.6, 0, 9, 4, bc, 1); D.box(hm, 0, -BL * .82, 0, 5, 1.2, 1.2, trim, 1); }
      else { D.box(hm, 0, 2.6, 0, 1.6, 5, 1.6, '#4a3020'); D.box(hm, 0, 5.4, 0, 2.4, 1.4, 2.4, trim, 1); D.box(hm, 0, -.4, 0, 8.6, 1.6, 2.4, trim, 1); D.box(hm, 0, -BL / 2 - 1, 0, 2.8, BL, .9, bc, 1); D.box(hm, 0, -BL / 2 - 1, 0, .8, BL, 1.3, [1, .86 - hot * .3, .5 - hot * .3], 1); D.cyl(M4.chain(hm, M4.t(0, -BL - 1, 0), M4.rx(Math.PI)), 0, 0, 0, 1.4, 0, 3.4, 4, bc, 1); if (hot > .3 && !rm) this.glow(hm[12] - hm[4] * BL * .5, hm[13] - hm[5] * BL * .5, hm[14] - hm[6] * BL * .5, 10 + hot * 6, [1, .4, .1], .35 * hot); }
      // the ribbon: every frame of a fast swing leaves a strip of light from guard to tip
      const scm = sc * this.MS, tip = [hm[12] - hm[4] * BL, hm[13] - hm[5] * BL, hm[14] - hm[6] * BL], base = [hm[12] - hm[4] * BL * .5, hm[13] - hm[5] * BL * .5, hm[14] - hm[6] * BL * .5];
      if (!rm) { if (dt > 0) for (const q of R.trail) q.life -= dt; R.trail = R.trail.filter(q => q.life > 0); const swinging = fast && (st === 'atk' || o.swing > 0 || opt.swingFx); if (swinging && dt > 0 && !jump) R.trail.push({ a: base, b: tip, life: .13 }); else if (jump) R.trail = [];
        const col = hot > .5 || (opt.aura || 0) > 1.5 ? [1, .46, .14] : blade === 2 ? [.85, .92, 1] : [1, .92, .66]; let pa = swinging ? { a: base, b: tip, life: .13 } : null;
        for (let i = R.trail.length - 1; i >= 0; i--) { const q = R.trail[i]; if (pa) { const a0 = Math.pow(pa.life / .13, 1.5), a1 = Math.pow(q.life / .13, 1.5); this.tri3(pa.a, pa.b, q.b, col, 0, a0 * .5, a1 * .5); this.tri3(pa.a, q.b, q.a, col, 0, a1 * .5, 0); } pa = q; }
        const sh = Math.sin(t * 3 + idx * 2.1); if (st === 'wind' ? Math.floor(t * 10) % 2 : sh > .9) this.glow(tip[0], tip[1], tip[2], st === 'wind' ? 10 : 6, [1, .96, .8], .9); }
    }
    D.flash = 0;
    const aura = opt.aura || 0;
    if (aura > 0 && !rm) { const n = 7 + Math.round(aura * 4), pale = !!opt.auraC; for (let i = 0; i < n; i++) { const ph = (t * (1.3 + i * .11) + i * .37) % 1, a = i * 2.4 + t * 2.2, rr = 8 + aura * 1.6; this.glow(o.x + Math.cos(a) * rr * (1 - ph * .5), z + 4 + ph * (40 + aura * 9), o.y + Math.sin(a) * rr * .7, (1 - ph) * (9 + aura * 2.4), pale ? [1, .95, .75] : [1, .36 + ph * .4, .1 + ph * .12], pale ? .28 : .55); } this.glow(o.x, z + 22, o.y, 26 + aura * 7, pale ? [1, .95, .8] : [1, .42, .12], pale ? .14 : .2 + aura * .04); }
    // dust when boots dig in
    if (!rm && z <= 0 && (R.land > .12 || (mv && spd > 60 && Math.sin((o.anim || 0) * 12) > .93))) for (let i = 0; i < (R.land > .12 ? 5 : 1); i++) Brawl.parts.push({ x: o.x + (Math.random() - .5) * 12, y: o.y + (Math.random() - .5) * 8, h: 1, vx: (Math.random() - .5) * 40, vy: (Math.random() - .5) * 20, vh: 20 + Math.random() * 30, life: .35, c: this.bg === 'keep' ? '#e8e0d0' : this.bg === 'ford' ? '#c8b89a' : '#b8c890' });
  },
  tri3(p0, p1, p2, col, a0, a1, a2) { if (this.sprN >= 15590) return; const s = this.spr, c = rgb3(col); for (const [p, a] of [[p0, a0], [p1, a1], [p2, a2]]) { const i = this.sprN * 9; s[i] = p[0]; s[i + 1] = p[1]; s[i + 2] = p[2]; s[i + 3] = 0; s[i + 4] = 0; s[i + 5] = c[0]; s[i + 6] = c[1]; s[i + 7] = c[2]; s[i + 8] = a; this.sprN++; } },

  // ---------------------------------------------------------- the things that move in a place
  life(B) {
    const D = this.dyn, t = this.t, E = this.env(this.bg), hw = E.hw, hh = E.hh, bg = this.bg, I = M4.id();
    const flag = (x, z, c, k) => { const m = M4.t(x, 0, z); D.cyl(m, 0, 0, 0, 1, 1, 78, 5, '#8a8478'); D.box(m, 0, 79, 0, 3, 3, 3, '#e8c25a', 1); let fm = M4.chain(m, M4.t(.8, 62, 0)); for (let i = 0; i < 4; i++) { fm = M4.mul(fm, M4.ry(Math.sin(t * 3.4 + i * .9 + k) * .28)); D.box(fm, 4, 0, 0, 8, 22 - i * 1.5, .6, i % 2 ? shade(c, .88) : c); if (i === 1) D.box(fm, 4, 0, .5, 6, 6, .3, '#e8c25a', 1); fm = M4.mul(fm, M4.t(8, 0, 0)); } };
    flag(-hw + 16, -hh - 8, '#7a5ac8', 1); flag(hw - 16, -hh - 8, '#2aa6a0', 2);
    if (bg === 'keep') { for (let i = 0; i < 4; i++) { const x = (i % 2 ? 1 : -1) * (hw + 16), z = i < 2 ? -hh + 4 : hh - 4, m = M4.t(x, 0, z); D.cyl(m, 0, 0, 0, 2.4, 2, 22, 6, '#7a7268'); D.cyl(m, 0, 22, 0, 7, 9, 6, 6, '#3a3430', 0, 1); D.cyl(m, 0, 27, 0, 9.2, 9.2, 1.2, 6, '#e8c25a', 1); for (let k = 0; k < 6; k++) { const ph = (t * (1.3 + k * .17) + k * .31 + i) % 1; this.glow(x + Math.sin(k * 2 + t * 4) * 3, 30 + ph * 22, z, (1 - ph) * 9, [1, .5 + ph * .4, .15], .7); } this.glow(x, 32, z, 30, [1, .6, .25], .22); } }
    else { // the rest of the war, behind
      if (!this._bgm) this._bgm = Array.from({ length: 7 }, (_, i) => ({ k: i }));
      for (const q of this._bgm) { const x = -hw - 30 + q.k * (hw * 2 + 60) / 6 + Math.sin(q.k * 7.1) * 20, z = -hh - 70 - (q.k * 53 % 90), ph = t * 2.2 + q.k * 1.7, lun = Math.max(0, Math.sin(ph)) * 4, sw = (ph % 6.2832) < 1.2 ? .18 - (ph % 6.2832) * .15 : 0;
        this.char({ x: x - 16 + lun, y: z, fx: 1, fy: 0, st: sw > 0 ? 'recover' : 'approach', t: .1, swing: sw, anim: t * .3, idx: q.k, combo: 1 + q.k % 3 }, { id: q.k % 2 ? 'cadv1' : 'cadv2', blade: 1, key: q });
        this.char({ x: x + 16 - lun, y: z + 3, fx: -1, fy: 0, st: Math.sin(ph + 2) > .7 ? 'hurt' : 'approach', t: .1, anim: t * .3 + .5, idx: q.k + 3 }, { id: q.k % 2 ? 'cadt2' : 'cadt1', blade: q.k % 3 ? 1 : 2, key: q.b || (q.b = {}) }); }
      if (bg === 'ford') { for (let ix = -16; ix < 16; ix++) for (let k = 0; k < 4; k++) { const x = ix * 40, z = -80 + k * 20, w = Math.sin(t * 1.6 + ix * .7 + k * 1.3) * .5 + .5, d = Math.abs(k - 1.5) / 1.5; D.quad(x, z, x + 40, z + 20, -.3, [.14 + d * .12 + w * .1, .36 + d * .12 + w * .12, .6 + d * .1 + w * .12], 1); }
        for (let i = 0; i < 30; i++) { const x = ((i * 61 + t * 22) % 1200) - 600, z = (i % 2 ? -79 : -3) + Math.sin(t * 2 + i) * 1.2; D.quad(x, z, x + 14 + (i % 3) * 6, z + 1.2, -.2, [.9, .96, 1], 1); } }
      if (bg === 'ford' && !Settings.d.reduce) for (let i = 0; i < 40; i++) { const wx = ((i * 47.3 + t * (16 + i % 4 * 6)) % 700) - 350, wz = -76 + (i * 13) % 70; if (Math.sin(t * 5 + i * 2.1) > .1) this.glow(wx, .4, wz, 3 + i % 3, [1, .86, .7], .5); }
    }
    if (!Settings.d.reduce) for (let i = 0; i < 7; i++) { const bx = ((i * 190 + t * (26 + i * 3)) % 1400) - 700, by = 150 + i * 14 + Math.sin(t * .7 + i) * 10, bz = -420 - i * 40, fl = Math.sin(t * 9 + i * 2) * .7, m = M4.t(bx, by, bz); D.box(m, 0, 0, 0, 2, 1.4, 5, '#2a2a34'); D.box(M4.chain(m, M4.rz(fl)), 4, 0, 0, 8, .5, 3, '#3a3a44'); D.box(M4.chain(m, M4.rz(-fl)), -4, 0, 0, 8, .5, 3, '#3a3a44'); }
    for (let i = 0; i < 5; i++) { const cx = ((i * 520 + t * (5 + i)) % 2600) - 1300, cy = (bg === 'keep' ? 240 : 360) + i * 28, cz = -900 - i * 90, cc = bg === 'ford' ? [1, .7, .58] : bg === 'keep' ? [1, .9, .86] : [1, 1, 1]; for (let k = 0; k < 4; k++) D.box(I, cx + (k - 1.5) * 60, cy + (k % 2) * 16, cz + (k % 3) * 20, 110 - k * 10, 34, 60, cc, 1); }
    // petals, embers
    if (!Settings.d.reduce) for (let i = 0; i < 46; i++) { const c = B.cam, px = c.x + ((i * 71.3 + t * (8 + i % 5 * 3)) % 400) - 200, pz = c.y - 40 - ((i * 37.7) % 320), up = bg === 'ford', py = ((i * 29.1 + t * (up ? 9 + i % 4 * 4 : -(6 + i % 4 * 3))) % 90 + 90) % 90 + 2; this.glow(px + Math.sin(t + i) * 6, py, pz, up ? 1.6 : 1.3, bg === 'keep' ? [1, 1, 1] : up ? [1, .7, .35] : [[1, .9, .95], [1, .9, .5], [.85, 1, .8]][i % 3], up ? .9 : .7); }
  },
  end(B) {
    const gl = this.gl, cv = this.cv, L = this.LOOK[this.bg], E = this.env(this.bg), P = this.P, vd = this.voidC;
    if (!vd) this.life(B);
    const rg = this.rage || 0, Lr = rg > 0 && !vd ? { top: L.top.map((v, i) => v * (1 - rg * .55) + [.3, .02, .02][i] * rg * .5), bot: L.bot.map((v, i) => v * (1 - rg * .35) + [1, .3, .12][i] * rg * .35), sunC: L.sunC.map((v, i) => v * (1 - rg * .15) + [.5, .05, 0][i] * rg), amb: L.amb.map((v, i) => v * (1 - rg * .28)), fog: L.fog.map((v, i) => v * (1 - rg * .4) + [.6, .12, .06][i] * rg * .4) } : L;
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(vd ? vd[0] : L.fog[0], vd ? vd[1] : L.fog[1], vd ? vd[2] : L.fog[2], 1); gl.clearStencil(0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    const sn = Math.hypot(...L.sun), sun = L.sun.map(v => v / sn);
    if (!vd) { // sky
      const K = this.K; gl.useProgram(K.p); gl.disable(gl.DEPTH_TEST); gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBuf); gl.enableVertexAttribArray(K.aP); gl.vertexAttribPointer(K.aP, 2, gl.FLOAT, false, 0, 0);
      const m = this.vp, e = this.eye, far = 3000, hx = e[0], hz = e[2] - far, hw4 = m[3] * hx + m[7] * e[1] + m[11] * hz + m[15], horY = (m[1] * hx + m[5] * e[1] + m[9] * hz + m[13]) / hw4, sp = [e[0] + L.sunAt[0] * far, e[1] + L.sunAt[1] * far, e[2] + L.sunAt[2] * far], sw4 = m[3] * sp[0] + m[7] * sp[1] + m[11] * sp[2] + m[15];
      gl.uniform3fv(K.uTop, Lr.top); gl.uniform3fv(K.uBot, Lr.bot); gl.uniform3fv(K.uSunC, Lr.sunC); gl.uniform1f(K.uHor, horY); gl.uniform1f(K.uAsp, W / H);
      gl.uniform3f(K.uSunP, (m[0] * sp[0] + m[4] * sp[1] + m[8] * sp[2] + m[12]) / sw4, (m[1] * sp[0] + m[5] * sp[1] + m[9] * sp[2] + m[13]) / sw4, sw4 > 0 ? 1 : 0); gl.drawArrays(gl.TRIANGLES, 0, 6); gl.disableVertexAttribArray(K.aP); }
    gl.useProgram(P.p); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    gl.uniformMatrix4fv(P.uVP, false, this.vp); gl.uniform3fv(P.uSun, sun); gl.uniform3fv(P.uSunC, vd ? [1.1, .7, .5] : Lr.sunC); gl.uniform3fv(P.uAmb, vd ? [.5, .34, .34] : Lr.amb); gl.uniform3fv(P.uSky, L.sky); gl.uniform3fv(P.uEye, this.eye); gl.uniform3fv(P.uFog, vd || Lr.fog); gl.uniform2fv(P.uFogR, vd ? [60, 420] : L.fogR); gl.uniform1f(P.uSh, 0);
    const bind = () => { gl.enableVertexAttribArray(P.aP); gl.enableVertexAttribArray(P.aN); gl.enableVertexAttribArray(P.aC); gl.vertexAttribPointer(P.aP, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribPointer(P.aN, 3, gl.FLOAT, false, 36, 12); gl.vertexAttribPointer(P.aC, 3, gl.FLOAT, false, 36, 24); };
    if (!vd) { gl.bindBuffer(gl.ARRAY_BUFFER, E.a.b); bind(); gl.drawArrays(gl.TRIANGLES, 0, E.a.n); gl.bindBuffer(gl.ARRAY_BUFFER, E.s.b); bind(); gl.drawArrays(gl.TRIANGLES, 0, E.s.n); }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf); gl.bufferData(gl.ARRAY_BUFFER, this.dyn.a.subarray(0, this.dyn.n * 9), gl.DYNAMIC_DRAW); bind(); gl.drawArrays(gl.TRIANGLES, 0, this.dyn.n);
    // shadows: flatten everything that stands onto the ground, once per pixel
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.enable(gl.STENCIL_TEST); gl.stencilFunc(gl.EQUAL, 0, 255); gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-2, -2); gl.uniform1f(P.uSh, 1);
    gl.drawArrays(gl.TRIANGLES, 0, this.dyn.n); if (!vd) { gl.bindBuffer(gl.ARRAY_BUFFER, E.s.b); bind(); gl.drawArrays(gl.TRIANGLES, 0, E.s.n); }
    gl.disable(gl.STENCIL_TEST); gl.uniform1f(P.uSh, 0); gl.disableVertexAttribArray(P.aN); gl.disableVertexAttribArray(P.aC);
    // ground marks, then light
    const S = this.S; gl.useProgram(S.p); gl.uniformMatrix4fv(S.uVP, false, this.vp); const sb = (buf, arr, n) => { gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, arr.subarray(0, n * 9), gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(S.aP); gl.enableVertexAttribArray(S.aU); gl.enableVertexAttribArray(S.aC); gl.vertexAttribPointer(S.aP, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribPointer(S.aU, 2, gl.FLOAT, false, 36, 12); gl.vertexAttribPointer(S.aC, 4, gl.FLOAT, false, 36, 20); gl.drawArrays(gl.TRIANGLES, 0, n); };
    if (this.decN) { gl.uniform1f(S.uSolid, 1); sb(this.decBuf, this.dec, this.decN); }
    gl.disable(gl.POLYGON_OFFSET_FILL); if (this.sprN) { gl.blendFunc(gl.ONE, gl.ONE); gl.uniform1f(S.uSolid, 0); sb(this.sprBuf, this.spr, this.sprN); }
    gl.disableVertexAttribArray(S.aU); gl.disableVertexAttribArray(S.aC); gl.depthMask(true); gl.disable(gl.BLEND);
    const inv = B.fin && B.fin.t < .1 && !Settings.d.reduce ? 'invert(1)' : 'saturate(1.12) contrast(1.06)'; if (cv.style.filter !== inv) cv.style.filter = inv;
  }
};
const NO3D = /no3d/.test(location.hash);
