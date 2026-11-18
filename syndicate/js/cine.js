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
  function toArena(hype) { arena = W.get('arena'); gfx.setScene(arena.scene); hideRegulars(); arena.setHype(hype); if (arena.cineWall) arena.cineWall(true); }
  function bout(a, b, pa, pb) { ex = F.exStart(a, b, pa, pb); return ex; }
  function giveCrown(e) {
    crown = new T.Group(); const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x7a5408, shininess: 90, flatShading: true });
    crown.add(new T.Mesh(new T.CylinderGeometry(0.25, 0.23, 0.12, 8, 1, true), gold));
    for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.ConeGeometry(0.055, 0.2, 4), gold); s.position.set(Math.cos(i * 1.047) * 0.24, 0.14, Math.sin(i * 1.047) * 0.24); crown.add(s); }
    crown.position.y = 1.86; e.vis.c.root.add(crown); gfx.glow(0xffd36b, 1.5, 0, 1.95, 0, e.vis.c.root, 0.55);
  }
  const FIGHTER = Object.assign(opp('brakk'), {}), ROGUE = opp('grubb'), SORC = opp('kessa'), CLERIC = opp('maul'), QUEEN = opp('vexa');

  // The throne room of Highmarch: Queen Eerin Koheneim and Vilhelm van Koheneim IV, seen once, from below.
  let royal = null;
  function throne() {
    if (royal) return royal;
    const s = gfx.newScene({ bg: 0x0a0c16, ambient: 0.75, key: 2.0, shadowSize: 10, sky: 0xcfd8ff, ground: 0x1a1830, keyColor: 0xfff2e0 }), L = c => gfx.lambert(c), box = gfx.box, mesh = gfx.mesh;
    const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x5a3c08, shininess: 90, flatShading: true }), marble = L(0xe6e4f0);
    mesh(new T.CylinderGeometry(9, 9, 0.2, 28), L(0xbfc0d4), 0, -0.1, 0, s); mesh(new T.CylinderGeometry(3.4, 3.8, 0.35, 16), marble, 0, 0.17, -0.4, s); mesh(new T.CylinderGeometry(2.6, 3.0, 0.3, 16), marble, 0, 0.5, -0.6, s);
    [[-0.95, 0x3a2a6a], [0.95, 0x5a1418]].forEach(q => { box(1.1, 2.9, 0.3, L(q[1]), q[0], 2.1, -1.5, s); box(1.25, 0.2, 0.4, gold, q[0], 3.6, -1.5, s); mesh(new T.ConeGeometry(0.2, 0.5, 4), gold, q[0], 3.95, -1.5, s); box(1.1, 0.25, 0.9, L(q[1]), q[0], 0.9, -1.0, s); });
    for (let i = 0; i < 8; i++) { const a = -0.5 + i * 0.6, x = Math.sin(a) * 7.2 * (i % 2 ? 1 : -1), z = -3 - Math.abs(Math.cos(a)) * 2.5 - (i >> 1) * 0.9; mesh(new T.CylinderGeometry(0.42, 0.5, 9, 8), marble, x, 4.5, z, s); box(1.3, 0.3, 1.3, gold, x, 0.15, z, s); }
    [-3.3, 3.3].forEach((x, i) => { const m = new T.Mesh(new T.PlaneGeometry(1.5, 5), new T.MeshLambertMaterial({ map: gfx.bannerTex(i ? '#5a1418' : '#3a2a6a', '#f0c95a'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(x, 3.6, -2.4); s.add(m); });
    const queen = G.makeChar({ cls: 'sorcerer', race: 'elf', tint: { cloth: '#e8e4f8', armor: '#b8a8e8', armor2: '#8a78c8', hair: '#f4f0ff', trim: '#f0c95a' }, cos: { head: 'crown', aura: 'sigils' } });
    const king = G.makeChar({ cls: 'fighter', race: 'human', tint: { cloth: '#5a1418', armor: '#2a2428', armor2: '#16121a', trim: '#f0c95a', hair: '#8a8a90' }, gear: { weapon: 2, armor: 2 }, cos: { head: 'crown', back: 'greatcloak' } });
    queen.root.position.set(-0.95, 0.65, -0.1); king.root.position.set(0.95, 0.65, -0.1); s.add(queen.root, king.root);
    const wing = new T.MeshBasicMaterial({ color: 0xc8b8ff, transparent: true, opacity: 0.26, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }), wings = [];
    [-1, 1].forEach(sd => [0, 1].forEach(lo => { const g = new T.Group(), w = new T.Mesh(new T.CircleGeometry(lo ? 0.55 : 0.8, 5, 0, Math.PI), wing); w.scale.set(0.8, lo ? 1.1 : 1.6, 1); w.rotation.z = -Math.PI / 2 * sd; w.position.x = sd * 0.05; g.add(w); g.position.set(-0.95 + sd * 0.14, lo ? 1.75 : 2.15, -0.42); g.rotation.z = sd * (lo ? 0.5 : -0.25); s.add(g); wings.push([g, sd]); }));
    box(44, 0.2, 44, L(0x8f90a8), 0, -0.22, 4, s).castShadow = false; box(44, 16, 0.6, L(0x3a3c5a), 0, 8, 17, s); [-13, 13].forEach(x => box(0.6, 16, 44, L(0x3a3c5a), x, 8, 4, s)); box(44, 16, 0.6, L(0x3a3c5a), 0, 8, -9, s);
    for (let k = 0; k < 5; k++) [-7.4, 7.4].forEach(x => { const z = 1.5 + k * 3.2; mesh(new T.CylinderGeometry(0.42, 0.5, 9, 8), marble, x, 4.5, z, s); box(1.3, 0.3, 1.3, gold, x, 0.15, z, s); });
    const hallL = new T.PointLight(0xdfe4ff, 14, 16, 1.4); hallL.position.set(0, 5, 8); s.add(hallL);
    const lq = new T.PointLight(0xc8b8ff, 22, 9, 1.5); lq.position.set(-1.6, 3.4, 1.6); s.add(lq); const lk = new T.PointLight(0xffb070, 18, 9, 1.5); lk.position.set(2.0, 3.0, 1.8); s.add(lk);
    const seated = [queen.root, king.root].concat(wings.map(w => w[0]));
    return royal = { scene: s, cineWall: v => { seated.forEach(o => { o.visible = !v; }); }, update: tt => { queen.pose({ t: tt, act: 'idle' }); king.pose({ t: tt + 1.4, act: 'idle' }); wings.forEach((w, i) => { w[0].rotation.y = w[1] * (0.35 + Math.sin(tt * 2.2 + i) * 0.22); }); if (Math.random() < 0.25) gfx.emit(-0.95 + (Math.random() - 0.5) * 1.6, 1 + Math.random() * 2.4, -0.2, 0, 0.3, 0, 1.6, 0xd8ccff, 0); } };
  }

  C.throneStage = () => throne();
  function build() {
    const hub = () => W.get('hub'), GM = [20.4, 1.35, -0.2];
    return [
      { dur: 2.6, black: true, text: 'Highmarch. The city above sleeps soundly.' },
      // the throne: a slow push in from the foot of the dais
      {
        dur: 6.4, text: 'It sleeps because the faerie queen Eerin Koheneim and her husband, Vilhelm van Koheneim IV, hold the realm in an iron grip.',
        setup: () => { gfx.setScene(throne().scene); },
        update: (p) => { shoot(V([0.6, 0.7, 10.5], [-0.2, 1.3, 6.2], ease(p)), V([0, 1.9, -0.4], [0, 1.75, -0.4], p), lerp(40, 32, p), 0.02 - p * 0.04); throne().update(now); }
      },
      {
        dur: 5.4, cut: true, text: 'Nothing is done above without their seal. So everything they forbid is done below. And they allow it.',
        update: (p) => { const th = lerp(-0.5, 0.5, ease(p)); shoot([Math.sin(th) * 5.6, lerp(2.6, 2.0, p), Math.cos(th) * 5.6 + 0.2], [0, 1.7, -0.2], lerp(34, 29, p), 0.03); throne().update(now); }
      },

      // crane down out of the dark, then a fast low dolly along the street
      {
        dur: 7, cut: true, text: 'Beneath them lies the Undercity. No sun. No law but theirs, and theirs looks away. Only what you owe.',
        setup: () => { gfx.setScene(hub().scene); hideRegulars(); },
        update: (p, dt) => {
          const a = cl(p / 0.42), b = cl((p - 0.42) / 0.58);
          const pos = p < 0.42 ? V([30, 15, 20], [27, 2.5, 6.5], ease(a)) : V([27, 2.5, 6.5], [10.5, 2.5, 5.4], easeIn(b) * 0.55 + b * 0.45);
          const look = p < 0.42 ? V([14, 0, 6], [14, 1.6, 5], ease(a)) : V([14, 1.6, 5], [-3, 1.5, 4.2], ease(b));
          shoot(pos, look, lerp(42, 62, b), Math.sin(p * 3.1) * 0.05); hub().update(now, dt);
        }
      },
      // low orbit around the Guildmaster
      {
        dur: 5.2, cut: true, text: 'The Deep Guild writes every debt in the Blood Ledger. The Guild always collects.',
        update: (p, dt) => { const th = lerp(0.8, 1.5, ease(p)), r = lerp(3.3, 2.4, p); shoot([GM[0] + Math.cos(th) * r, lerp(1.0, 1.55, p), GM[2] + Math.sin(th) * r], [GM[0], lerp(1.5, 1.35, p), GM[2]], lerp(46, 34, p), -0.07); hub().update(now, dt); }
      },
      // the underworld at work: Marc's table, the dice of light, and the Wardens taking the Crown's tenth
      {
        dur: 4.8, cut: true, text: 'Dice. Coin. Unsealed steel. Whatever is forbidden above is for sale beneath one lamp.',
        update: (p, dt) => { shoot(V([22.6, 2.5, 5.2], [24.3, 2.0, 2.9], ease(p)), [25.7, 1.15, -0.1], lerp(48, 36, p), 0.04 - p * 0.06); hub().update(now, dt); }
      },
      {
        dur: 4.4, cut: true, text: 'At the foot of the Long Stair, the throne’s Wardens count their tenth, and look away.',
        update: (p, dt) => { shoot(V([5.8, 0.8, 12.0], [3.9, 1.4, 13.0], ease(p)), [-0.9, lerp(2.2, 1.8, p), 14.5], lerp(52, 42, p), -0.06 + p * 0.05); hub().update(now, dt); }
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
          at('cleave', 2.15, () => F.exCast(A, 'cleave')); at('arm', 2.5, () => { F.exSever(B, 'armL'); F.speed = 0.35; }); at('norm2', 3.1, () => { F.speed = 1; }); at('bash', 3.5, () => F.exCast(A, 'shield_bash'));
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
          shoot(V([-5.6, 1.1, 4.4], [0.4, 3.6, 7.2], ease(k)), V(a, [(a[0] + b[0]) / 2, 1.0, (a[2] + b[2]) / 2], m), lerp(44, 58, k), 0.05 - k * 0.08);
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
          shoot([c[0] + Math.cos(th) * 3.6, lerp(3.6, 7.5, ease(k)), c[2] + Math.sin(th) * 3.6], c, lerp(60, 50, k), lerp(-0.18, 0.18, k));
        }
      },
      // ---- BLOOD — close and low: an arm, a leg, and then nothing left to count
      {
        dur: 5.6, cut: true, card: 'Blood',
        setup: () => { bout(FIGHTER, ROGUE, [-0.9, -0.6], [0.9, 0.7]); arena.setHype(1); G.sfx('crowd'); flash(0.6); },
        update: () => {
          const A = ex.A, B = ex.B;
          at('c1', 0.2, () => F.exCast(A, 'cleave')); at('arm', 0.62, () => { F.exSever(B, 'armL'); F.speed = 0.22; }); at('n1', 1.5, () => { F.speed = 1; });
          at('c2', 1.7, () => F.exCast(A, 'shield_bash')); at('c3', 2.4, () => F.exCast(A, 'cleave')); at('leg', 2.82, () => { F.exSever(B, 'legL'); F.speed = 0.22; }); at('n2', 3.6, () => { F.speed = 1; });
          at('end', 4.1, () => F.exCast(A, 'cleave')); at('gib', 4.5, () => { F.exGib(B); F.speed = 0.3; gfx.cam.shake = 0.5; flash(0.5); G.sfx('cheer'); });
          const k = cl(t / 5.6), th = lerp(2.3, 0.6, ease(k)), c = wp(B, 0.8), r = lerp(3.4, 4.6, k);
          shoot([c[0] + Math.cos(th) * r, lerp(0.35, 1.3, k), c[2] + Math.sin(th) * r], [c[0], lerp(0.9, 0.5, k), c[2]], lerp(50, 42, k), Math.sin(k * 5) * 0.07);
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
        setup: () => { arena.setHype(1); G.sfx('crowd'); if (arena.cineWall) arena.cineWall(false); },
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
        setup: () => { F.exStop(); arena.setHype(0); savedItems = G.state.items; G.state.items = []; const h = W.get('hideout'); gfx.setScene(h.scene); h.refresh(); hideRegulars(); if (!caveL) { caveL = new T.PointLight(0xffb070, 26, 14, 1.5); caveL.position.set(3.2, 2.6, 3.0); } h.scene.add(caveL); },
        update: (p, dt) => { shoot(V([5.2, 2.0, 5.0], [9.8, 4.4, 9.4], ease(p)), V([1.6, 0.5, 1.2], [2.6, 0.3, 2.0], p), lerp(52, 42, p), 0); W.get('hideout').update(now, dt); }
      },
      // the rush: sprint down the street and into the black of the gate
      {
        dur: 4.3, cut: true, text: 'Tonight, your name was entered.',
        setup: () => { restoreItems(); gfx.setScene(hub().scene); hideRegulars(); },
        update: (p, dt) => { const k = easeIn(p); shoot(V([13, 1.5, 9.5], [5, 1.45, -0.7], k), [5, lerp(1.9, 1.5, p), -1.6], lerp(38, 86, k), Math.sin(p * 9) * 0.02 * (1 - p)); gfx.cam.shake = k * 0.12; hub().update(now, dt); }
      },
      { dur: 4.4, black: true, logo: true, cut: true, setup: () => { gfx.cam.shake = 0; G.sfx('boom'); G.sfx('bell'); flash(0.9); } }
    ];
  }
  let caveL = null;
  function restoreItems() { if (caveL && caveL.parent) caveL.parent.remove(caveL); if (savedItems) { G.state.items = savedItems; savedItems = null; if (W.cache.hideout) W.cache.hideout.refresh(); } }

  C.play = function (done) {
    G.ui.close(); onDone = done; idx = -1; t = 0; now = 0; lastLine = null; ex = null;
    G.scene = 'cine'; G.ui.topbar(); C.active = true;
    el = document.createElement('div'); el.id = 'cine';
    el.innerHTML = '<div class="c-fade"></div><div class="c-flash"></div><div class="c-bar top"></div><div class="c-card"></div><div class="c-bar bot"><p class="c-sub"></p></div>' +
      '<div class="c-logo"><h1>Gutter<span>crown</span></h1><small>Pit-fighters of the Undercity</small></div><button class="c-skip mini">Skip intro</button>';
    document.getElementById('ui').appendChild(el);
    sub = el.querySelector('.c-sub'); fade = el.querySelector('.c-fade'); logo = el.querySelector('.c-logo'); card = el.querySelector('.c-card'); flashEl = el.querySelector('.c-flash');
    el.querySelector('.c-skip').onclick = () => { if (navigator.webdriver || !C.holdSkip) { G.sfx('ui'); C.skip(); } };      // players hold to skip (see below); a plain click only skips for automated tests
    let seen = 0; try { seen = localStorage.getItem('guttercrown_intro_seen') ? 1 : 0; } catch (er) { } C.first = !seen;       // first viewing: one hold skips the lot. Later viewings: tap through shot by shot.
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
    C.active = false; F.exStop(); restoreItems(); gfx.cine = null; try { localStorage.setItem('guttercrown_intro_seen', '1'); } catch (er) { }
    const a = W.cache.arena; if (a) { a.flash.intensity = 0; a.setHype(0); if (a.cineWall) a.cineWall(false); } if (royal) royal.cineWall(false);
    gfx.cam.shake = 0; el.remove(); const d = onDone; onDone = null; if (d) d();
  }
  C.skip = finish; C.where = () => ({ idx, t, n: shots ? shots.length : 0, dur: shots && shots[idx] ? shots[idx].dur : 0 });
  // ------------------------------------------------------------ tap for the next scene, hold to skip the whole film
  C.holdSkip = true; C.nextShot = () => { if (C.active) { G.sfx('page'); next(); } };
  { let held = 0, t = 0, last = 0, downFor = 0, wasOn = false, fired = false, downAt = 0, padWas = false, padFor = 0; const NEED = 0.9, TAP = 0.32, keys = {};
    const btn = () => document.querySelector('#cine .c-skip');
    window.addEventListener('keydown', e => { if (G.scene === 'cine' && (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space')) { if (!keys[e.code]) downAt = performance.now(); keys[e.code] = 1; e.preventDefault(); } });
    const tapUp = () => { if (G.scene === 'cine' && downAt && performance.now() - downAt < 350 && !fired && !C.first && !navigator.webdriver) C.nextShot(); downAt = 0; };
    window.addEventListener('keyup', e => { if (keys[e.code]) tapUp(); delete keys[e.code]; });
    const down = e => { if (G.scene === 'cine') { if (!held) downAt = performance.now(); held = 1; if (e.cancelable && e.target && e.target.closest && e.target.closest('.c-skip')) e.preventDefault(); } }, up = () => { if (held) tapUp(); held = 0; };
    document.addEventListener('pointerdown', down); document.addEventListener('touchstart', down, { passive: false }); ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach(ev => document.addEventListener(ev, up));
    setInterval(() => { const now = performance.now(), dt = Math.min(0.5, (now - last) / 1000); last = now; if (G.scene !== 'cine') { t = 0; held = 0; wasOn = false; downFor = 0; return; }
      let padA = false; try { const pads = navigator.getGamepads ? navigator.getGamepads() : []; for (const p of pads) if (p && p.buttons && ((p.buttons[0] && p.buttons[0].pressed) || (p.buttons[9] && p.buttons[9].pressed))) padA = true; } catch (er) { }
      const on = !!(held || padA || Object.keys(keys).length > 0);
      if (on) { downFor += dt; t = downFor > TAP ? t + dt : t; } else { downFor = 0; if (!padA) fired = false; t = Math.max(0, t - dt * 3); }
      if (padA) padFor += dt; else { if (padWas && padFor <= TAP + 0.08 && !fired && !C.first) C.nextShot(); padFor = 0; } padWas = padA;
      wasOn = on;
      const b = btn(); if (b) { const pad = G.input && G.input.usingPad, touch = G.input && G.input.touch; b.textContent = C.first ? (pad ? 'Hold (A) to skip intro' : touch ? 'Hold to skip intro' : 'Hold Space to skip intro') : pad ? '(A) next scene · hold to skip' : touch ? 'Tap: next scene · hold: skip' : 'Space: next scene · hold: skip'; const pc = Math.min(100, t / (NEED - TAP) * 100); b.style.background = pc > 0 ? 'linear-gradient(90deg, rgba(240,201,90,0.85) ' + pc + '%, rgba(20,16,24,0.7) ' + pc + '%)' : ''; b.style.color = pc > 45 ? '#1a1208' : ''; b.style.opacity = on ? 1 : ''; }
      if (t >= NEED - TAP) { t = 0; held = 0; fired = true; downFor = 0; for (const kk in keys) delete keys[kk]; G.sfx('ui'); C.skip(); } }, 40); }
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
