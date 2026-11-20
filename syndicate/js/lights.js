// Guttercrown — a light budget for the Lamp Market. The market had seventeen point lights burning at once, and every pixel
// on screen paid for all of them. Now a small pool of real lights follows the fighter: each moment the pool copies the
// brightest lights near them (place, colour, flicker and all) and the rest wait their turn. Lamps keep their glow either way.
// The number of lights in the scene never changes, so nothing is ever rebuilt as you walk.
(function () {
  'use strict';
  const G = window.G, T = THREE, W = G.world, gfx = G.gfx;
  const N = 7, N_LOW = 4, FADE = 3.2;                 // pool size, pool size in Performance mode, fades per second
  const v = new T.Vector3();
  const bh0 = W.buildHub;
  W.buildHub = function () {
    const h = bh0.apply(this, arguments), sc = h.scene, src = [], seen = new WeakSet();
    const pool = []; for (let i = 0; i < N; i++) { const l = new T.PointLight(0xffffff, 0, 16, 1.6); l.userData.pool = 1; sc.add(l); pool.push({ l, s: null, w: 0, next: null }); }
    // take over every point light in the market, now and whenever something adds one later (the first-steps beam, a summons)
    const adopt = () => sc.traverse(o => { if (!o.isPointLight || o.userData.pool || seen.has(o)) return; seen.add(o); o.visible = false; src.push(o); });
    adopt(); let scanT = 0, pickT = 0, last = 0;
    const up0 = h.update;
    h.update = function (t, dt) {
      up0.apply(this, arguments); const d = Math.min(0.1, Math.max(0.001, dt || (last ? t - last : 1 / 60))); last = t;
      if ((scanT -= d) <= 0) { scanT = 1; adopt(); }
      const n = gfx.low ? N_LOW : N, w = W.walker, fx = gfx.cine ? gfx.cine.look[0] : w.x, fz = gfx.cine ? gfx.cine.look[2] : w.z;
      if ((pickT -= d) <= 0) { pickT = 0.2;
        // how much each light matters where the fighter stands: its strength, fading with distance
        const sco = src.map(o => { o.getWorldPosition(v); o.userData.wx = v.x; o.userData.wy = v.y; o.userData.wz = v.z; const dd = Math.hypot(v.x - fx, v.z - fz); let vis = o.parent; while (vis && vis.visible) vis = vis.parent; return { o, k: vis || o.intensity <= 0 ? 0 : (o.intensity + 6) / (1 + dd * dd * 0.05) * (dd < (o.distance || 16) + 9 ? 1 : 0) }; }).filter(q => q.k > 0).sort((a, b) => b.k - a.k).slice(0, n).map(q => q.o);
        pool.forEach((p, i) => { if (i >= n) { p.next = null; if (p.s) p.out = 1; return; } p.out = p.s && sco.indexOf(p.s) < 0 ? 1 : 0; });
        const free = sco.filter(o => !pool.some(p => p.s === o && !p.out));
        pool.forEach((p, i) => { if (i < n && (!p.s || p.out) && free.length) p.next = free.shift(); }); }
      pool.forEach(p => {
        if (p.out || (!p.s && p.next)) { p.w = Math.max(0, p.w - d * FADE); if (p.w <= 0) { p.s = p.next || null; p.next = null; p.out = 0; } }
        else if (p.s) p.w = Math.min(1, p.w + d * FADE);
        const o = p.s; if (!o) { p.l.intensity = 0; return; }
        if (o.userData.wx == null) { o.getWorldPosition(v); o.userData.wx = v.x; o.userData.wy = v.y; o.userData.wz = v.z; }
        p.l.position.set(o.userData.wx, o.userData.wy, o.userData.wz); p.l.color.copy(o.color); p.l.distance = o.distance; p.l.decay = o.decay; p.l.intensity = o.intensity * p.w; });
    };
    h.lightBudget = { pool, src };
    return h;
  };
})();
