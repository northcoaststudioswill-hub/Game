// Guttercrown — the opening cinematic: in-engine shots over the three places, with narration, letterboxing and a skip
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world;
  const C = G.cine = { active: false };
  let el, sub, fade, logo, shots, idx, t, onDone, actors, savedItems, crownGlow, lastLine;
  const opp = id => { const o = G.OPPONENTS.find(q => q.id === id); return { cls: o.cls, race: o.race, tint: o.tint, scale: o.scale }; };
  const ease = p => p * p * (3 - 2 * p), lerp = G.lerp;

  function actor(scene, look, x, z, rot) { const c = G.makeChar(look); c.root.position.set(x, 0, z); c.root.rotation.y = rot; scene.add(c.root); actors.push({ c, scene }); return c; }
  function clearActors() { actors.forEach(a => a.scene.remove(a.c.root)); actors = []; }
  function hideRegulars() {
    if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false);
    if (W.walker.char) W.walker.char.root.visible = false;
    const F = G.fight; if (F.P && F.P.vis) { F.P.vis.g.visible = false; F.E.vis.g.visible = false; }
  }
  const cam = (x, z, vh, fy) => { const c = gfx.cam; c.x = x; c.z = z; c.y = 0.9; c.vh = vh * (gfx.portrait ? 1.55 : 1); c.fx = 0.5; c.fy = fy == null ? 0.5 : fy; c.shake = 0; };

  function build() {
    let brakk, grubb, vexa, fallen, arena;
    return [
      { dur: 4.2, black: true, text: 'Above, the city of Highmarch sleeps soundly.' },
      {
        dur: 8, text: 'Beneath it lies the Undercity. No sun. No law. Only what you can take, and what you owe.',
        setup: () => { const h = W.get('hub'); gfx.setScene(h.scene); hideRegulars(); },
        update: (p, tt, dt) => { cam(lerp(2.5, 13, ease(p)), lerp(5.5, 4, p), lerp(13, 11, p)); W.get('hub').update(tt, dt); }
      },
      {
        dur: 7.5, text: 'Down here the Deep Guild keeps the Blood Ledger. Every debt is written in it. The Guild always collects.',
        update: (p, tt, dt) => { cam(lerp(14.2, 15.4, ease(p)), lerp(1.6, 0.5, ease(p)), lerp(7.5, 5.2, ease(p))); W.get('hub').update(tt, dt); }
      },
      {
        dur: 8.5, text: 'Those who cannot pay in coin pay in the pit, one on one, while the whole Undercity watches.',
        setup: () => {
          arena = W.get('arena'); gfx.setScene(arena.scene); hideRegulars(); if (!arena.flash.parent) arena.scene.add(arena.flash); arena.setHype(0.9);
          brakk = actor(arena.scene, opp('brakk'), -0.85, 0.85, Math.PI * 0.75); grubb = actor(arena.scene, opp('grubb'), 0.85, -0.85, -Math.PI * 0.25);
          G.sfx('crowd');
        },
        update: (p, tt) => {
          cam(Math.sin(p * 1.5) * 1.2, Math.cos(p * 1.5) * 0.8 - 0.4, lerp(15, 9, ease(p)), 0.48);
          const a = (tt * 0.95) % 1, b = (tt * 0.95 + 0.5) % 1;
          brakk.pose({ t: tt, act: 'swing', prog: a, flash: b > 0.52 && b < 0.6 ? 1 : 0 }); grubb.pose({ t: tt, act: 'swing', prog: b, flash: a > 0.52 && a < 0.6 ? 1 : 0 });
          [[a, 0.85, -0.85, 0xdfe6ee], [b, -0.85, 0.85, 0xcfd8e0]].forEach(q => { if (q[0] > 0.5 && q[0] < 0.54) { gfx.burst(q[1], 1.1, q[2], q[3], 5, 4, 3); gfx.burst(q[1], 1, q[2], 0xc01818, 2, 3, 2); arena.flash.position.set(0, 1.6, 0); arena.flash.color.set(0xffe0b0); arena.flash.intensity = 26; gfx.cam.shake = 0.12; if (!C.hitS || tt - C.hitS > 0.4) { C.hitS = tt; G.sfx('hit'); } } });
          arena.flash.intensity *= 0.86;
        }
      },
      {
        dur: 9, text: 'For seven years one name has stood at the top of the Ledger. Vexa, the Pale Queen. She wears the Guttercrown.',
        setup: () => {
          clearActors(); arena.setHype(0.25);
          vexa = actor(arena.scene, opp('vexa'), 0, 0, Math.PI / 4);
          const crown = new T.Group(), gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x6a4a08, shininess: 90, flatShading: true });
          crown.add(new T.Mesh(new T.CylinderGeometry(0.25, 0.23, 0.12, 8, 1, true), gold));
          for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.ConeGeometry(0.055, 0.2, 4), gold); s.position.set(Math.cos(i * 1.047) * 0.24, 0.14, Math.sin(i * 1.047) * 0.24); crown.add(s); }
          crown.position.y = 1.82; vexa.root.add(crown); crownGlow = gfx.glow(0xffd36b, 1.6, 0, 1.9, 0, vexa.root, 0.6);
          fallen = actor(arena.scene, opp('brakk'), 1.9, 1.3, 2.2); fallen.pose({ t: 0, act: 'ko', prog: 1 });
          arena.flash.color.set(0xb070ff); arena.flash.position.set(0.6, 2.4, 0.6);
          G.sfx('bell');
        },
        update: (p, tt) => { cam(0.2, 0.2, lerp(11, 5, ease(p)), 0.52); vexa.pose({ t: tt, act: 'idle' }); arena.flash.intensity = 8 + Math.sin(tt * 2) * 2; crownGlow.material.opacity = 0.5 + Math.sin(tt * 3) * 0.15; }
      },
      {
        dur: 8, text: 'Take the crown from her and your debt is struck from the book. Lose, and the crowd forgets your name by morning.',
        setup: () => { arena.setHype(0.7); G.sfx('crowd'); },
        update: (p, tt) => { cam(0.2, 0.2, lerp(5, 17, ease(p)), 0.5); vexa.pose({ t: tt, act: p > 0.25 && p < 0.5 ? 'cast' : 'idle', prog: (p - 0.25) * 4, glow: "#c79bff" }); arena.flash.intensity = 8; }
      },
      {
        dur: 7.5, text: 'The Guild lent you a damp cave, a rusted blade, and a debt you will never pay off in coin.',
        setup: () => {
          clearActors(); arena.flash.intensity = 0; arena.setHype(0);
          savedItems = G.state.items; G.state.items = [];
          const h = W.get('hideout'); gfx.setScene(h.scene); h.refresh(); hideRegulars();
        },
        update: (p, tt, dt) => { cam(lerp(3, 6.5, ease(p)), lerp(2.5, 5.5, ease(p)), lerp(9, 13, p)); W.get('hideout').update(tt, dt); }
      },
      {
        dur: 7, text: 'Tonight, your name was entered.',
        setup: () => { restoreItems(); const h = W.get('hub'); gfx.setScene(h.scene); hideRegulars(); },
        update: (p, tt, dt) => { cam(lerp(4.6, 3.6, ease(p)), lerp(3.2, -0.4, ease(p)), lerp(10, 4.6, ease(p)), 0.55); W.get('hub').update(tt, dt); }
      },
      { dur: 4.2, black: true, logo: true, text: '' }
    ];
  }
  function restoreItems() { if (savedItems) { G.state.items = savedItems; savedItems = null; if (W.cache.hideout) W.cache.hideout.refresh(); } }

  C.play = function (done) {
    G.ui.close(); onDone = done; actors = []; idx = -1; t = 0; lastLine = null; C.hitS = 0;
    G.scene = 'cine'; G.ui.topbar(); C.active = true;
    el = document.createElement('div'); el.id = 'cine';
    el.innerHTML = '<div class="c-fade"></div><div class="c-bar top"></div><div class="c-bar bot"><p class="c-sub"></p></div>' +
      '<div class="c-logo"><h1>Gutter<span>crown</span></h1><small>Pit-fighters of the Undercity</small></div><button class="c-skip mini">Skip intro</button>';
    document.getElementById('ui').appendChild(el);
    sub = el.querySelector('.c-sub'); fade = el.querySelector('.c-fade'); logo = el.querySelector('.c-logo');
    el.querySelector('.c-skip').onclick = () => { G.sfx('ui'); C.skip(); };
    shots = build(); next();
  };
  function next() {
    idx++; t = 0;
    if (idx >= shots.length) return finish();
    const s = shots[idx];
    if (s.setup) s.setup();
    logo.classList.toggle('on', !!s.logo);
    if (s.logo) G.sfx('bell');
  }
  function finish() {
    if (!C.active) return;
    C.active = false; clearActors(); restoreItems();
    const a = W.cache.arena; if (a) { a.flash.intensity = 0; a.setHype(0); }
    gfx.cam.shake = 0; el.remove(); const d = onDone; onDone = null; if (d) d();
  }
  C.skip = finish;
  C.update = function (dt, tt) {
    if (!C.active) return;
    const s = shots[idx]; t += dt;
    const p = Math.min(1, t / s.dur);
    if (s.update) s.update(p, tt, dt);
    fade.style.opacity = s.black ? 1 : Math.max(0, 1 - t / 0.8, (t - (s.dur - 0.7)) / 0.7);
    const show = t > 0.5 && t < s.dur - 0.6;
    if (s.text !== lastLine && show) { lastLine = s.text; sub.textContent = s.text; }
    sub.classList.toggle('on', show && !!s.text);
    if (t >= s.dur) next();
  };
})();
