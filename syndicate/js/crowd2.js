// Guttercrown — when the stands love you they throw things you can use: a flask lands in the pit, and whoever reaches it first drinks it
(function () {
  'use strict';
  const G = window.G, T = window.THREE; let gifts = [], next = 0, clock = 0;
  const S = () => G.fight.edgeApi.S, scene = () => G.gfx.scene();
  function flask() { const g = new T.Group(), gl = new T.Mesh(new T.CylinderGeometry(0.1, 0.13, 0.26, 8), new T.MeshLambertMaterial({ color: 0xc0283a, transparent: true, opacity: 0.85 })); gl.position.y = 0.13; g.add(gl); const nk = new T.Mesh(new T.CylinderGeometry(0.04, 0.05, 0.1, 6), new T.MeshLambertMaterial({ color: 0xc0283a })); nk.position.y = 0.31; g.add(nk); const ck = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.05, 6), new T.MeshLambertMaterial({ color: 0x8a6a3a })); ck.position.y = 0.38; g.add(ck); const gw = new T.Mesh(new T.SphereGeometry(0.22, 8, 6), new T.MeshBasicMaterial({ color: 0xff5060, transparent: true, opacity: 0.25, depthWrite: false })); gw.position.y = 0.15; g.add(gw); return g; }
  const clear = () => { gifts.forEach(q => q.m.parent && q.m.parent.remove(q.m)); gifts = []; };
  const fs0 = G.fight.start; G.fight.start = function () { clear(); next = 22 + Math.random() * 10; clock = 0; return fs0.apply(this, arguments); };
  const up0 = G.fight.update;
  G.fight.update = function (dt) { const r = up0.apply(this, arguments), F = G.fight; if (!F.active || F.paused || F.ex || !F.P || !F.E || !F.inFight || !F.inFight() || (G.garden && G.garden.run)) return r; dt = dt || 0; clock += dt;
    const hype = (typeof F.hypeNow === 'number' ? F.hypeNow : 0) * 100, X = F.edgeApi; if (!X) return r;
    if (clock > next && hype >= 70 && gifts.length < 1) { next = clock + 24 + Math.random() * 12; const a = Math.random() * 6.283, R = 120 + Math.random() * 120, x = F.P.x * 0.6 + Math.cos(a) * R * 0.5, y = F.P.y * 0.6 + Math.sin(a) * R * 0.5, m = flask(); scene().add(m); gifts.push({ m, x, y, t: 0, h: 6 }); X.text(F.P, 'THE CROWD THROWS A FLASK', '#ff8a96', true); G.sfx('cheer'); }
    for (let i = gifts.length - 1; i >= 0; i--) { const q = gifts[i]; q.t += dt; q.h = Math.max(0, 6 - q.t * 14); q.m.position.set(q.x / S(), q.h + (q.h ? 0 : Math.abs(Math.sin(q.t * 3)) * 0.06), q.y / S()); q.m.rotation.y += dt * 2; if (q.h === 0 && !q.landed) { q.landed = 1; G.sfx('bottle'); }
      if (q.landed && F.E.hp > 0 && F.E.hp < F.E.maxHp * 0.5 && !(F.E.st && F.E.st.stun)) { const d = Math.hypot(q.x - F.E.x, q.y - F.E.y) || 1; if (d < 260) { F.E.x += (q.x - F.E.x) / d * 90 * dt; F.E.y += (q.y - F.E.y) / d * 90 * dt; F.E.moving = true; } }       // a hurt opponent goes for it too
      const who = [F.P, F.E].find(e => e && e.hp > 0 && q.landed && Math.hypot(e.x - q.x, e.y - q.y) < 34);
      if (who) { X.heal(who, who.maxHp * 0.12); X.text(who, who.isPlayer ? 'DRINKS IT' : 'THEY GOT IT FIRST', who.isPlayer ? '#7dffa0' : '#ff8a6a', true); G.sfx(who.isPlayer ? 'cheer' : 'boo'); q.m.parent && q.m.parent.remove(q.m); gifts.splice(i, 1); continue; }
      if (q.t > 9) { q.m.parent && q.m.parent.remove(q.m); gifts.splice(i, 1); } }
    return r; };
})();
