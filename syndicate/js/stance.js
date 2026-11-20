// Guttercrown — how a fighter stands when nobody is swinging: a set for those on their feet, another for those who float
(function () {
  'use strict';
  const G = window.G, ui = G.ui, T = window.THREE, sin = Math.sin;
  // each stance edits the pose the weapon already chose; index 0 is the guild's own, untouched
  const GROUND = [
    { name: 'Guild Standard', sub: 'How the weapon was taught' },
    { name: 'The Crouch', sub: 'Low, coiled, eyes up', f: (q, t, mv) => { q.by -= 0.15; q.bx = 0.32; q.hx = -0.24; q.arx = -1.2 + sin(t * 2.4) * 0.04; q.arz = 0.15; q.alx = -1.3; q.alz = -0.3; q.ty = 0.35; q.eR = 0.9; q.eL = 1.0; if (!mv) { q.ll = 0.34; q.lr = -0.42; } } },
    { name: 'Parade Rest', sub: 'Upright, one hand behind the back', f: (q, t, mv) => { q.by += 0.05; q.bx = -0.02; q.hx = -0.1; q.arx = -0.12; q.arz = 0.1; q.alx = 0.45; q.alz = -0.3; q.ty = 0.08; q.eR = 0.08; q.eL = 1.1; if (!mv) { q.ll = 0.03; q.lr = -0.03; } } },
    { name: 'The Long Line', sub: 'Side-on, blade raised, off hand behind', f: (q, t, mv) => { q.by -= 0.05; q.bx = 0.05; q.ty = 0.95; q.arx = -1.55 + sin(t * 2.4) * 0.03; q.arz = 0; q.alx = 0.6; q.alz = -0.25; q.eR = 0.08; q.eL = 1.0; if (!mv) { q.ll = 0.42; q.lr = -0.44; } } },
    { name: 'The Roof', sub: 'Held high over the head', f: (q, t, mv) => { q.bx = 0.02; q.arx = -2.75 + sin(t * 2.4) * 0.04; q.arz = -0.15; q.alx = -2.55 + sin(t * 2.4) * 0.04; q.alz = 0.35; q.ty = 0.3; q.eR = 0.75; q.eL = 0.75; if (!mv) { q.ll = 0.24; q.lr = -0.28; } } },
    { name: 'Gutter Guard', sub: 'Fists up, chin down, always moving', f: (q, t, mv) => { q.by -= 0.07 - Math.abs(sin(t * 5)) * 0.02; q.bx = 0.26; q.tz = sin(t * 2.5) * 0.07; q.hx = 0.1; q.arx = -1.5; q.arz = 0.35; q.alx = -1.6; q.alz = -0.35; q.eR = 1.5; q.eL = 1.5; q.ty = 0.3; if (!mv) { q.ll = 0.22; q.lr = -0.26; } } },
    { name: 'Tavern Lean', sub: 'On the shoulder, hand on the hip', f: (q, t, mv) => { q.by += 0.03; q.bx = -0.06; q.bz = 0.07; q.tz = 0.09; q.hz = -0.12; q.arx = -2.3; q.arz = -0.25; q.alx = -0.2; q.alz = 0.6; q.eR = 1.35; q.eL = 1.25; q.ty = 0.12; if (!mv) { q.ll = 0.04; q.lr = -0.2; } } },
    { name: 'The Hound', sub: 'Bent double, arms hanging, swaying', f: (q, t, mv) => { q.by -= 0.13; q.bx = 0.52; q.hx = -0.5; q.tz = sin(t * 1.8) * 0.09; q.arx = -0.55 + sin(t * 1.8) * 0.1; q.arz = 0.25; q.alx = -0.55 - sin(t * 1.8) * 0.1; q.alz = -0.25; q.eR = 0.3; q.eL = 0.3; q.ty = 0.1; if (!mv) { q.ll = 0.36; q.lr = -0.3; } } }
  ];
  const leg = (robe, a, b) => robe ? [a * 0.3, b * 0.3] : [a, b];
  const FLOAT = [
    { name: 'Stillness', sub: 'Hanging in the air, nothing more' },
    { name: 'The Seated Hour', sub: 'Legs folded under, hands on the knees', f: (q, t, mv, robe) => { q.fl = leg(robe, -1.4, -1.4); q.kn = robe ? [0.3, 0.3] : [2.0, 2.0]; q.arx = -0.55; q.arz = -0.15; q.alx = -0.55; q.alz = 0.15; q.eR = 0.95; q.eL = 0.95; q.ty = 0; q.hx = 0.08; } },
    { name: 'Open Hands', sub: 'Arms wide, head back, toes down', f: (q, t, mv, robe) => { q.fl = [0.1, 0.02]; q.kn = [0.1, 0.3]; q.fbx = -0.1; q.arx = -0.25; q.arz = -1.2 - sin(t * 1.3) * 0.05; q.alx = -0.25; q.alz = 1.2 + sin(t * 1.3) * 0.05; q.eR = 0.25; q.eL = 0.25; q.hx = -0.32; q.ty = 0; } },
    { name: 'The Recline', sub: 'Lying back on nothing, arms folded', f: (q, t, mv, robe) => { q.fbx = -0.4; q.fl = leg(robe, -1.15, -0.8); q.kn = robe ? [0.3, 0.2] : [1.25, 0.5]; q.arx = -1.0; q.arz = 0.7; q.alx = -1.0; q.alz = -0.7; q.eR = 1.5; q.eL = 1.5; q.hx = 0.34; q.ty = 0; } },
    { name: 'The Coil', sub: 'One knee drawn up, one hand out', f: (q, t, mv, robe) => { q.fbx = 0.14; q.fl = leg(robe, -1.7, 0.25); q.kn = robe ? [0.35, 0.3] : [2.0, 0.9]; q.arx = -1.4 + sin(t * 2) * 0.04; q.arz = 0.1; q.alx = -0.35; q.alz = -0.35; q.eR = 0.3; q.eL = 1.2; q.ty = 0.5; } },
    { name: 'The Drowned', sub: 'Limp, head on one side, turning slowly', f: (q, t, mv, robe) => { q.fbx = -0.07; q.fl = [0.14, 0.04]; q.kn = [0.4, 0.55]; q.tz = sin(t * 0.9) * 0.1; q.hz = 0.32; q.hx = 0.26; q.arx = 0.12; q.arz = -0.4 + sin(t * 0.9) * 0.06; q.alx = 0.12; q.alz = 0.4 + sin(t * 0.9) * 0.06; q.eR = 0.2; q.eL = 0.2; q.ty = sin(t * 0.6) * 0.2; } }
  ];
  G.STANCES = { g: GROUND, f: FLOAT }; G.STANCE_POSE = { g: GROUND.map(s => s.f), f: FLOAT.map(s => s.f) };
  // your own choice; everyone else in the pit stands the way their name says they would
  G.stanceOf = function (e) { const h = G.state && G.state.hero; if (e.isPlayer && h && !(G.fight && G.fight.ex)) return [h.stance || 0, h.fstance || 0];
    let n = 7; const nm = String(e.name || (e.d && e.d.name) || e.cls || 'x'); for (let i = 0; i < nm.length; i++) n = (n * 31 + nm.charCodeAt(i)) >>> 0; return [n % 10 < 3 ? 0 : 1 + (n >>> 4) % (GROUND.length - 1), n % 10 < 3 ? 0 : 1 + (n >>> 8) % (FLOAT.length - 1)]; };
  // the shape a wound throws on the sand
  const WOUND = { axe: 'slash', halberd: 'slash', axes: 'slash', chain: 'slash', rapier: 'stab', spear: 'stab', pick: 'spike', flail: 'spike', hammer: 'blunt', staff: 'blunt' }, BASIC = { fighter: 'slash', rogue: 'stab', cleric: 'spike', druid: 'blunt' };
  G.woundOf = function (att, ab) { if (ab && (ab.spell || ab.type === 'proj' || ab.type === 'aoe' || ab.type === 'line') && !(ab.basic && BASIC[att.cls])) return 'burn'; if (att && att.vis && att.vis.c && att.vis.c.beast) return 'slash';
    const hero = G.state && G.state.hero, arm = att && att.isPlayer && G.armOf && hero && !G.fight.ex ? String(G.armOf(hero)).split('_')[1] : (att && att.arm ? String(att.arm).split('_')[1] : 'basic'); let k = WOUND[arm] || BASIC[att && att.cls] || 'blunt';
    if (ab && (ab.mv === 'drive' || ab.mv === 'riposte' || ab.mv === 'backstab') && k !== 'spike') k = 'stab'; return k; };

  // ---------------------------------------------------------------- a small picture of each stance on your own fighter
  let pr, sc, cam; const cache = {};
  function shot(look, hov, i) { const key = JSON.stringify([look.cls, look.race, look.arm, look.kit, look.ring, look.skin, hov, i]); if (cache[key] != null) return cache[key];
    try { if (!pr) { pr = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); pr.setSize(200, 200, false); pr.toneMapping = T.ACESFilmicToneMapping; pr.toneMappingExposure = 1.3; sc = new T.Scene(); sc.add(new T.HemisphereLight(0x8a80a8, 0x2a1c14, 1.3)); const d = new T.DirectionalLight(0xffd8b0, 2.2); d.position.set(-3, 5, 4); sc.add(d); cam = new T.OrthographicCamera(-1.12, 1.12, 1.12, -1.12, 0.1, 50); cam.position.set(4.4, 2.6, 4.2); cam.lookAt(0, 1.05, 0); }
      const c = G.makeChar(Object.assign({}, look, { scale: 1 })); c.root.scale.multiplyScalar(1 / G.RACES[look.race].scale); for (let r = 0; r < 50; r++) c.pose({ t: 1 + r * 0.016, act: 'idle', ready: 1, stn: [i, i] });
      sc.add(c.root); pr.render(sc, cam); cache[key] = pr.domElement.toDataURL('image/png'); sc.remove(c.root); } catch (e) { cache[key] = ''; }
    return cache[key]; }
  G.stanceShot = shot;

  // ---------------------------------------------------------------- choosing one, at the Guildmaster
  ui.stances = function () { const st = G.state, h = st.hero, look = G.lookOf(h, st), hov = (h.cls === 'sorcerer' || h.cls === 'warlock') && !!look.ring, list = hov ? FLOAT : GROUND, key = hov ? 'fstance' : 'stance', cur = h[key] || 0;
    ui._show('<div class="card"><small class="over">Guildmaster</small><h2>' + (hov ? 'How You Hang in the Air' : 'Your Stance') + '</h2><p class="dim">' + (hov ? 'A ring holds you up; how you carry yourself in it is yours to choose.' : 'How you stand between blows. It changes nothing but how you look doing it.') + '</p><div class="stances">' +
      list.map((s, i) => '<button class="stance' + (i === cur ? ' on' : '') + '" data-stn="' + i + '"><img alt="" src="' + shot(look, hov, i) + '"><b>' + s.name + '</b><small>' + s.sub + '</small></button>').join('') + '</div><div class="row end"><button class="big" id="x">Back</button></div></div>');
    ui._on('[data-stn]', b => { h[key] = +b.dataset.stn; G.save && G.save(); G.sfx('equip'); ui.stances(); const f = document.querySelector('[data-stn="' + h[key] + '"]'); if (f && G.input.usingPad) f.focus({ preventScroll: true }); });
    ui._on('#x', () => ui.sheet()); const card = document.querySelector('#panel .card'); if (card) card._back = () => { ui.sheet(); return true; };
  };
  const sh0 = ui.sheet;
  ui.sheet = function () { const r = sh0.apply(this, arguments), tiles = document.querySelector('#panel .gm-tiles'); if (!tiles || tiles.querySelector('[data-stance]')) return r;
    const h = G.state.hero, hov = (h.cls === 'sorcerer' || h.cls === 'warlock') && !!G.lookOf(h, G.state).ring, cur = (hov ? FLOAT : GROUND)[h[hov ? 'fstance' : 'stance'] || 0] || GROUND[0];
    const b = document.createElement('button'); b.className = 'fence-room'; b.dataset.stance = 1; b.innerHTML = '<span class="fr-ic">♜</span><b>Stance</b><small>' + cur.name + '</small>'; b.onclick = () => { G.sfx('page'); ui.stances(); };
    const after = tiles.querySelector('[data-go="char"]'); (after || tiles.lastElementChild).insertAdjacentElement('afterend', b); tiles.classList.add('gm9'); return r; };
})();
