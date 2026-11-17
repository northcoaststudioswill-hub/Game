// Starhaven — game feel effects: particles, rings, hit-stop, shake, slow-motion, floating words.
(function (SH) {
  const fx = {
    parts: [], rings: [], words: [], ghosts: [],
    hitstop: 0, shake: 0, flash: 0, flashColor: '#fff',
    slowmo: 0,
  };

  fx.reset = function () { fx.parts.length = fx.rings.length = fx.words.length = fx.ghosts.length = 0; fx.hitstop = fx.shake = fx.flash = fx.slowmo = 0; };

  fx.stop = function (frames) { fx.hitstop = Math.max(fx.hitstop, frames); };
  fx.kick = function (amount) { if (SH.settings && SH.settings.shake === false) return; fx.shake = Math.max(fx.shake, amount); };
  fx.flashScreen = function (frames, color) { fx.flash = frames; fx.flashColor = color || '#fff'; };

  fx.burst = function (x, y, n, o) {
    o = o || {};
    for (let i = 0; i < n; i++) {
      const a = (o.angle != null ? o.angle : Math.random() * Math.PI * 2) + (Math.random() - 0.5) * (o.spread != null ? o.spread : Math.PI * 2);
      const sp = (o.speed || 2) * (0.4 + Math.random() * 0.8);
      const life = (o.life || 24) * (0.6 + Math.random() * 0.6);
      fx.parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.up || 0),
        g: o.gravity != null ? o.gravity : 0.12, drag: o.drag || 0.94,
        life, max: life, size: o.size || 2, color: o.colors ? o.colors[(Math.random() * o.colors.length) | 0] : (o.color || '#fff'),
        glow: !!o.glow, shape: o.shape || 'sq',
      });
    }
  };
  fx.dust = function (x, y, dir, n) {
    fx.burst(x, y - 2, n || 5, { angle: dir > 0 ? Math.PI : dir < 0 ? 0 : -Math.PI / 2, spread: 1.2, speed: 1.4, gravity: -0.02, life: 20, size: 3, colors: ['#8a86b8', '#6c6a99', '#b3b0d9'], drag: 0.9 });
  };
  fx.ring = function (x, y, color, r1, life, width) { fx.rings.push({ x, y, r: 2, r1: r1 || 26, life: life || 16, max: life || 16, color: color || '#fff', width: width || 2 }); };
  fx.word = function (x, y, text, color, life) { fx.words.push({ x, y, text, color: color || '#fff', life: life || 50, max: life || 50 }); };
  fx.ghost = function (snap) { fx.ghosts.push(snap); };

  fx.update = function () {
    for (const p of fx.parts) { p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.life--; }
    fx.parts = fx.parts.filter(p => p.life > 0);
    for (const r of fx.rings) { r.life--; r.r = r.r1 * (1 - Math.pow(r.life / r.max, 2)); }
    fx.rings = fx.rings.filter(r => r.life > 0);
    for (const w of fx.words) { w.life--; w.y -= 0.35; }
    fx.words = fx.words.filter(w => w.life > 0);
    for (const g of fx.ghosts) g.life--;
    fx.ghosts = fx.ghosts.filter(g => g.life > 0);
    if (fx.shake > 0) fx.shake = Math.max(0, fx.shake * 0.85 - 0.05);
    if (fx.flash > 0) fx.flash--;
  };

  SH.fx = fx;
})(window.SH = window.SH || {});
