// Guttercrown — the opening cinematic. A free perspective camera (crane, orbit, dolly-zoom, whip-pan) films the
// three places and a montage of scripted exhibition bouts that use the real combat abilities and effects.
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, F = G.fight, S = gfx.S;
  const C = G.cine = { active: false };
  let el, sub, fade, logo, card, flashEl, shots, idx, t, now, onDone, savedItems, lastLine, fired, ex, crown, arena, camPos;
  const lerp = G.lerp, ease = p => p * p * (3 - 2 * p), easeIn = p => p * p * p, easeOut = p => 1 - Math.pow(1 - p, 3), cl = p => Math.max(0, Math.min(1, p));
  const V = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)];
  const opp = id => { const o = G.OPPONENTS.find(q => q.id === id); return { cls: o.cls, race: o.race, tint: o.tint, scale: o.scale }; };
  const wp = (e, h) => [e.x / S, e.z / S + (h == null ? 1.1 : h), e.y / S];

  // Place the camera. A little handheld drift keeps even the slow shots alive.
  function shoot(pos, look, fov, roll) {
    const j = 0.035; camPos = pos;
    if (ex && F.ex) [ex.A, ex.B].forEach(e => { const dx = pos[0] - e.x / S, dz = pos[2] - e.y / S, d = Math.hypot(dx, dz) || 0.01, min = 2.7; if (d < min) { pos[0] = e.x / S + dx / d * min; pos[2] = e.y / S + dz / d * min; } });
    gfx.cine = { pos, look: [look[0] + Math.sin(now * 1.3) * j, look[1] + Math.sin(now * 1.9 + 1) * j, look[2] + Math.cos(now * 1.1) * j], fov: gfx.portrait ? Math.min(92, fov * 1.5) : fov, roll: roll || 0 };
  }
  const at = (key, time, fn) => { if (t >= time && !fired[key]) { fired[key] = 1; fn(); } };
  function slam(word) { card.textContent = word; card.classList.remove('slam'); void card.offsetWidth; card.classList.add('slam'); }
  function flash(a) { flashEl.style.transition = 'none'; flashEl.style.opacity = a; void flashEl.offsetWidth; flashEl.style.transition = 'opacity 0.45s'; flashEl.style.opacity = 0; }
  function hideRegulars() {
    if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false);
    if (W.walker.char) W.walker.char.root.visible = false;
  }
  function toArena(hype) { arena = W.get('arena'); gfx.setScene(arena.scene); hideRegulars(); arena.setHype(hype); }
  function bout(a, b, pa, pb) { ex = F.exStart(a, b, pa, pb); return ex; }
  function giveCrown(e) {
    crown = new T.Group(); const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x7a5408, shininess: 90, flatShading: true });
    crown.add(new T.Mesh(new T.CylinderGeometry(0.25, 0.23, 0.12, 8, 1, true), gold));
    for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.ConeGeometry(0.055, 0.2, 4), gold); s.position.set(Math.cos(i * 1.047) * 0.24, 0.14, Math.sin(i * 1.047) * 0.24); crown.add(s); }
    crown.position.y = 1.86; e.vis.c.root.add(crown); gfx.glow(0xffd36b, 1.5, 0, 1.95, 0, e.vis.c.root, 0.55);
  }
  const FIGHTER = Object.assign(opp('brakk'), {}), ROGUE = opp('grubb'), SORC = opp('kessa'), CLERIC = opp('maul'), QUEEN = opp('vexa');

  function build() {
    const hub = () => W.get('hub'), GM = [15.6, 1.35, -0.2];
    return [
      { dur: 2.8, black: true, text: 'Highmarch. The city above sleeps soundly.' },

      // crane down out of the dark, then a fast low dolly along the street
      {
        dur: 7, text: 'Beneath it lies the Undercity. No sun. No law. Only what you owe.',
        setup: () => { gfx.setScene(hub().scene); hideRegulars(); },
        update: (p, dt) => {
          const a = cl(p / 0.42), b = cl((p - 0.42) / 0.58);
          const pos = p < 0.42 ? V([18, 13, 14], [16.5, 1.5, 5.2], ease(a)) : V([16.5, 1.5, 5.2], [4.5, 1.25, 4.4], easeIn(b) * 0.55 + b * 0.45);
          const look = p < 0.42 ? V([9, 0, 1], [8, 1.3, 3.2], ease(a)) : V([8, 1.3, 3.2], [-3, 1.6, 4.6], ease(b));
          shoot(pos, look, lerp(42, 62, b), Math.sin(p * 3.1) * 0.05); hub().update(now, dt);
        }
      },
      // low orbit around the Guildmaster
      {
        dur: 5.2, cut: true, text: 'The Deep Guild writes every debt in the Blood Ledger. The Guild always collects.',
        update: (p, dt) => { const th = lerp(0.15, 1.35, ease(p)), r = lerp(3.6, 2.3, p); shoot([GM[0] + Math.cos(th) * r, lerp(0.55, 1.5, p), GM[2] + Math.sin(th) * r], [GM[0], lerp(1.5, 1.35, p), GM[2]], lerp(46, 34, p), -0.07); hub().update(now, dt); }
      },
      // smash cut: the crowd, then whip down into the pit
      {
        dur: 4.2, cut: true, text: 'Cannot pay in coin? You pay in the pit.',
        setup: () => { toArena(1); G.sfx('bell'); G.sfx('crowd'); flash(0.8); },
        update: (p) => {
          const w = easeOut(cl((p - 0.38) / 0.4));
          shoot(V([2, 4.6, -5.2], [6.5, 2.4, 6.5], w), V([1.2, 4.2, -11], [0, 0.9, 0], w), lerp(38, 50, w), (1 - w) * 0.12);
          gfx.cam.shake = p > 0.38 && p < 0.55 ? 0.05 : 0;
        }
      },

      // ---- montage: STEEL — a leaping slam straight at the lens
      {
        dur: 4.8, cut: true, card: 'Steel',
        setup: () => { bout(FIGHTER, ROGUE, [-4.6, -4.6], [1.3, 1.3]); flash(0.5); },
        update: () => {
          const A = ex.A, B = ex.B;
          at('leap', 0.3, () => { F.exCast(A, 'leap_slam'); F.speed = 0.42; });
          at('slow', 1.22, () => { F.speed = 0.1; }); at('norm', 1.85, () => { F.speed = 1; });
          at('cleave', 2.15, () => F.exCast(A, 'cleave')); at('knives', 2.75, () => F.exCast(B, 'fan_knives')); at('bash', 3.5, () => F.exCast(A, 'shield_bash'));
          const a = wp(A, 1.3), b = wp(B, 1), k = cl(t / 4.8);
          shoot([b[0] + lerp(5.2, 4.4, k), lerp(0.4, 1.5, ease(k)), b[2] + lerp(0.6, 2.4, k)], [(a[0] + b[0] * 2) / 3, (a[1] * 2 + b[1]) / 3, (a[2] + b[2] * 2) / 3], lerp(60, 46, k), -0.09 + k * 0.05);
        }
      },
      // ---- FLAME — lightning, then the camera rides back as the fireball lands
      {
        dur: 5.4, cut: true, card: 'Flame',
        setup: () => { bout(SORC, CLERIC, [-4.2, 0.6], [3.4, -1.2]); flash(0.5); },
        update: () => {
          const A = ex.A, B = ex.B;
          at('bolt', 0.25, () => F.exCast(A, 'lightning_bolt')); at('guide', 0.9, () => F.exCast(B, 'guiding_bolt')); at('hands', 1.2, () => F.exCast(B, 'sacred_flame'));
          at('fb', 1.7, () => F.exCast(A, 'fireball')); at('slow', 2.3, () => { F.speed = 0.14; }); at('norm', 3.35, () => { F.speed = 1; });
          at('chaos', 3.7, () => F.exCast(A, 'chaos_bolt')); at('frost', 4.3, () => F.exCast(A, 'ray_frost')); at('bolt2', 4.9, () => F.exCast(A, 'lightning_bolt'));
          const k = cl(t / 5.4), a = wp(A), b = wp(B), m = ease(cl((t - 0.2) / 2.6));
          shoot(V([-6.2, 1.0, 3.6], [1.5, 3.4, 7.4], ease(k)), V(a, b, m), lerp(40, 54, k), 0.06 - k * 0.1);
        }
      },
      // ---- FAITH — spiral crane above the dawn-burst
      {
        dur: 4.8, cut: true, card: 'Faith',
        setup: () => { bout(CLERIC, FIGHTER, [0, 0], [2.1, 1.5]); flash(0.5); },
        update: () => {
          const A = ex.A, B = ex.B;
          at('guard', 0.15, () => F.exCast(A, 'spirit_guardians')); at('hitme', 0.7, () => F.exCast(B, 'cleave'));
          at('dawn', 1.15, () => F.exCast(A, 'radiance')); at('slow', 1.5, () => { F.speed = 0.16; }); at('norm', 2.3, () => { F.speed = 1; });
          at('smite', 2.7, () => F.exCast(A, 'holy_strike')); at('flame', 3.6, () => F.exCast(A, 'sacred_flame'));
          const k = cl(t / 4.8), th = 0.5 + ease(k) * 2.0, c = wp(A, 0.6);
          shoot([c[0] + Math.cos(th) * 3.2, lerp(4.2, 10, ease(k)), c[2] + Math.sin(th) * 3.2], c, lerp(62, 48, k), lerp(-0.3, 0.3, k));
        }
      },
      // ---- SHADOW — orbit a flurry of shadows in slow motion; the last one standing wears the crown
      {
        dur: 5.6, cut: true, card: 'Shadow',
        setup: () => { bout(QUEEN, FIGHTER, [4.4, 3.6], [0, 0]); giveCrown(ex.A); flash(0.5); },
        update: () => {
          const A = ex.A, B = ex.B;
          at('knives', 0.2, () => F.exCast(A, 'fan_knives')); at('swing', 0.5, () => F.exCast(B, 'cleave'));
          at('flurry', 0.95, () => { F.exCast(A, 'flurry'); F.speed = 0.3; }); at('norm', 3.5, () => { F.speed = 1; });
          at('mark', 3.75, () => F.exCast(A, 'death_mark')); at('slow2', 4.0, () => { F.speed = 0.2; }); at('down', 4.5, () => { F.exDown(B); F.speed = 0.5; G.sfx('crit'); gfx.cam.shake = 0.3; });
          const k = cl(t / 5.6), th = lerp(0.1, 1.45, ease(k)), r = lerp(6.2, 4, k), c = wp(B, 1.0);
          shoot([c[0] + Math.cos(th) * r, lerp(0.7, 1.7, k), c[2] + Math.sin(th) * r], c, lerp(52, 40, k), Math.sin(k * 6) * 0.05);
        }
      },

      // hero shot: ground-level dolly zoom up at the champion
      {
        dur: 7, cut: true, text: 'Seven years. One champion. Vexa, the Pale Queen. She wears the Guttercrown.',
        setup: () => { F.speed = 1; arena.setHype(0.2); G.sfx('bell'); },
        update: (p) => {
          const A = ex.A, v = wp(A, 0), d = lerp(5.2, 2.7, ease(p));
          A.faceAt = { x: (v[0] + 3) * S, y: (v[2] + 3) * S };
          arena.flash.color.set(0xb070ff); arena.flash.position.set(v[0] + 1.2, 2.6, v[2] + 1.2); arena.flash.intensity = 9 + Math.sin(now * 2) * 2;
          shoot([v[0] + d * 0.7071, lerp(0.3, 0.55, p), v[2] + d * 0.7071], [v[0], lerp(1.25, 1.55, p), v[2]], lerp(28, 60, ease(p)), 0.04);
        }
      },
      // rocket crane out over the roaring pit
      {
        dur: 5.2, text: 'Take it from her and your debt is struck. Lose, and you are forgotten by morning.',
        setup: () => { arena.setHype(1); G.sfx('crowd'); },
        update: (p) => {
          const A = ex.A, v = wp(A, 1.2), k = easeIn(cl(p * 1.15));
          at('pose', 1.2, () => F.exCast(A, 'smoke_bomb'));
          arena.flash.intensity = 9;
          shoot(V([v[0] + 1.6, 0.6, v[2] + 1.6], [11.5, 11, 11.5], k), V(v, [0, 0.5, 0], k), lerp(56, 46, k), (1 - k) * 0.05);
        }
      },
      // the quiet beat: pulling back out of the bare house
      {
        dur: 5.6, text: 'The Guild lent you a cave, a rusted blade, and a debt you will never pay in coin.',
        setup: () => { F.exStop(); arena.setHype(0); savedItems = G.state.items; G.state.items = []; const h = W.get('hideout'); gfx.setScene(h.scene); h.refresh(); hideRegulars(); },
        update: (p, dt) => { shoot(V([3.2, 1.3, 2.4], [9.5, 3.4, 8.8], ease(p)), V([0.6, 1.4, 0.2], [2.5, 0.8, 1.5], p), lerp(50, 40, p), 0); W.get('hideout').update(now, dt); }
      },
      // the rush: sprint down the street and into the black of the gate
      {
        dur: 4.3, cut: true, text: 'Tonight, your name was entered.',
        setup: () => { restoreItems(); gfx.setScene(hub().scene); hideRegulars(); },
        update: (p, dt) => { const k = easeIn(p); shoot(V([9.5, 1.5, 8.2], [3.6, 1.45, -0.7], k), [3.6, lerp(1.9, 1.5, p), -1.6], lerp(38, 86, k), Math.sin(p * 9) * 0.02 * (1 - p)); gfx.cam.shake = k * 0.12; hub().update(now, dt); }
      },
      { dur: 4.4, black: true, logo: true, cut: true, setup: () => { gfx.cam.shake = 0; G.sfx('boom'); G.sfx('bell'); flash(0.9); } }
    ];
  }
  function restoreItems() { if (savedItems) { G.state.items = savedItems; savedItems = null; if (W.cache.hideout) W.cache.hideout.refresh(); } }

  C.play = function (done) {
    G.ui.close(); onDone = done; idx = -1; t = 0; now = 0; lastLine = null; ex = null;
    G.scene = 'cine'; G.ui.topbar(); C.active = true;
    el = document.createElement('div'); el.id = 'cine';
    el.innerHTML = '<div class="c-fade"></div><div class="c-flash"></div><div class="c-bar top"></div><div class="c-card"></div><div class="c-bar bot"><p class="c-sub"></p></div>' +
      '<div class="c-logo"><h1>Gutter<span>crown</span></h1><small>Pit-fighters of the Undercity</small></div><button class="c-skip mini">Skip intro</button>';
    document.getElementById('ui').appendChild(el);
    sub = el.querySelector('.c-sub'); fade = el.querySelector('.c-fade'); logo = el.querySelector('.c-logo'); card = el.querySelector('.c-card'); flashEl = el.querySelector('.c-flash');
    el.querySelector('.c-skip').onclick = () => { G.sfx('ui'); C.skip(); };
    shots = build(); next();
  };
  function next() {
    idx++; t = 0; fired = {};
    if (idx >= shots.length) return finish();
    const s = shots[idx];
    gfx.cam.shake = 0;
    if (s.setup) s.setup();
    if (s.card) slam(s.card); else { card.classList.remove('slam'); card.textContent = ''; }
    logo.classList.toggle('on', !!s.logo);
  }
  function finish() {
    if (!C.active) return;
    C.active = false; F.exStop(); restoreItems(); gfx.cine = null;
    const a = W.cache.arena; if (a) { a.flash.intensity = 0; a.setHype(0); }
    gfx.cam.shake = 0; el.remove(); const d = onDone; onDone = null; if (d) d();
  }
  C.skip = finish;
  C.update = function (dt, tt) {
    if (!C.active) return;
    now = tt; t += dt;
    const s = shots[idx], p = Math.min(1, t / s.dur);
    if (F.ex) F.update(dt);
    if (s.update) s.update(p, dt);
    fade.style.opacity = s.black ? 1 : Math.max(0, s.cut ? 1 - t / 0.12 : 1 - t / 0.7, shots[idx + 1] && !shots[idx + 1].cut ? (t - (s.dur - 0.6)) / 0.6 : 0);
    const show = t > 0.35 && t < s.dur - 0.35 && !!s.text;
    if (show && s.text !== lastLine) { lastLine = s.text; sub.textContent = s.text; }
    sub.classList.toggle('on', show);
    if (t >= s.dur) next();
  };
})();
