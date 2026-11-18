// Guttercrown — second balance pass, after play on a controller: swinging has to be paid for, and a home can earn its keep
(function () {
  const G = window.G, T = THREE, A = G.ABILITIES, gfx = G.gfx, W = G.world, ui = G.ui, box = gfx.box, mesh = gfx.mesh, L = c => gfx.lambert(c);
  // ------------------------------------------------------------ stamina: a landed blow gives some back, not all of it
  // (it used to give back more than it cost, so a fighter could swing for ever)
  const GAIN = { fighter: 6, cleric: 6, druid: 5, rogue: 4 };
  (G.ARMS || []).forEach(w => { const b = A[w.id]; if (!b || b.type !== 'melee' || GAIN[w.cls] == null) return; b.gain = GAIN[w.cls]; if (b.desc) b.desc = b.desc.replace('refunded on a hit', 'partly returned on a hit'); });
  ['bite_wolf', 'maul_bear', 'bite_spider', 'rake_bat', 'maul_avatar'].forEach(id => { if (A[id]) A[id].gain = 6; });

  // the fighter was the safest class by a distance; the casters the frailest
  if (A.second_wind) { A.second_wind.healLvl = 3; A.second_wind.desc = 'Catch your breath: heal 1d10 + CON + 3 per level.'; }
  G.CLASSES.sorcerer.hitDie = 8; G.CLASSES.warlock.hitDie = 9;
  (G.ARMS || []).filter(w => w.cls === 'sorcerer' || w.cls === 'warlock').forEach(w => { if (A[w.id]) A[w.id].pow = 1.62; });

  // ------------------------------------------------------------ a home that earns
  const B = W.BUILD, USE = G.ROOM_USE;
  if (B && USE && G.DECOR) {
    const wood = () => new T.MeshLambertMaterial({ color: 0x6a4428, map: gfx.tex('wood'), flatShading: true }), iron = () => L(0x26232a), copper = () => new T.MeshPhongMaterial({ color: 0xb8703a, shininess: 70, flatShading: true });
    const add = (d, build, use) => { G.DECOR.push(d); G.DECOR_BY[d.id] = d; B[d.id] = build; if (use) USE[d.id] = use; };
    add({ id: 'still', name: 'Copper Still', cost: 170, rank: 1, zone: 'house', w: 1, d: 1, max: 1, perk: 'Earns 12 coin after every bout, sold by the cup to the neighbours.', light: 0xff8a30 },
      g => { const cu = copper(); mesh(new T.CylinderGeometry(0.34, 0.4, 0.7, 10), cu, 0, 0.55, 0, g); mesh(new T.SphereGeometry(0.34, 10, 6, 0, 6.28, 0, 1.57), cu, 0, 0.9, 0, g); mesh(new T.CylinderGeometry(0.05, 0.08, 0.5, 6), cu, 0, 1.4, 0, g); const arm = mesh(new T.CylinderGeometry(0.03, 0.03, 0.7, 5), cu, 0.3, 1.5, 0, g); arm.rotation.z = 1.1; mesh(new T.CylinderGeometry(0.16, 0.16, 0.3, 8), wood(), 0.62, 0.15, 0, g); box(0.5, 0.2, 0.5, iron(), 0, 0.1, 0, g); const fl = new T.Mesh(new T.SphereGeometry(0.1, 6, 5), new T.MeshBasicMaterial({ color: 0xff8a30 })); fl.position.set(0, 0.16, 0.26); g.add(fl); return [0, 0.4, 0.3]; },
      ['Take a nip', () => ui.toast(G.pick(['It strips the roof of your mouth. The neighbours pay for this.', 'Clear as water. Do not hold it near the lamp.', 'You are fairly sure it is not meant to be that colour. It sells anyway.']))]);
    add({ id: 'lodger', name: 'Lodger’s Cot', cost: 240, rank: 2, zone: 'house', w: 2, d: 1, max: 1, perk: 'A lodger pays 20 coin after every bout. He is quiet, mostly.' },
      g => { const w = wood(); box(1.7, 0.2, 0.8, w, 0, 0.3, 0, g); [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].forEach(q => box(0.08, 0.3, 0.08, w, q[0], 0.15, q[1], g)); box(1.6, 0.1, 0.72, L(0x6a5a44), 0, 0.45, 0, g); box(0.4, 0.12, 0.5, L(0xd8ccb0), -0.58, 0.54, 0, g); box(1.1, 0.06, 0.74, L(0x4a3a5a), 0.24, 0.52, 0, g); box(0.4, 0.4, 0.3, w, 0.5, 0.2, 0.7, g); },
      ['Collect the rent', () => ui.toast(G.pick(['He pays after your bouts, not before. He is not a fool.', 'There is a note on the pillow: “Good fight. Rent on the table.”', 'He is out. He is always out. The rent is always there.']))]);
    add({ id: 'ratcage', name: 'Marc’s Rat Cages', cost: 190, rank: 2, zone: 'any', w: 1, d: 1, max: 1, perk: 'Marc stables his racers at yours. He pays 10 chits after every bout, to spend at his table.' },
      g => { const ir = iron(); [0.25, 0.75].forEach(y => { box(0.8, 0.04, 0.5, wood(), 0, y - 0.2, 0, g); for (let i = 0; i < 7; i++) box(0.02, 0.4, 0.02, ir, -0.36 + i * 0.12, y, 0.24, g); box(0.8, 0.04, 0.5, ir, 0, y + 0.2, 0, g); mesh(new T.SphereGeometry(0.09, 6, 5), L(0x6a5a4a), -0.15 + (y > 0.5 ? 0.25 : 0), y - 0.1, 0, g).scale.set(1.5, 1, 1); }); },
      ['Look in', () => ui.toast(G.pick(['The grey one is called Second Mortgage. It is Marc’s favourite.', 'One of them is doing laps. In training, apparently.', 'They watch you the way Marc does: working out what you are worth.']))]);
    const INCOME = st => { const own = id => (st.items || []).some(p => p.id === id); return { coin: (own('still') ? 12 : 0) + (own('lodger') ? 20 : 0), chits: own('ratcage') ? 10 : 0 }; };
    G.homeIncome = INCOME;
    const res0 = ui.results;
    ui.results = function (r) { const st = G.state; let inc = null; if (r && r.opp && !r.opp.spar && !r._home) { r._home = 1; inc = INCOME(st); if (inc.coin) st.coin += inc.coin; if (inc.chits) st.chits = (st.chits || 0) + inc.chits; if (inc.coin || inc.chits) G.save(); }
      const out = res0.apply(this, arguments); if (inc && (inc.coin || inc.chits) && r.win) { const end = document.querySelector('#panel .card.res .row.end'); if (end) { const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = 'Your home earned <b>' + [inc.coin ? inc.coin + ' coin' : '', inc.chits ? inc.chits + ' chits' : ''].filter(Boolean).join(' and ') + '</b> while you fought.'; end.parentNode.insertBefore(p, end); } }
      return out; };
    if (G.LORE) G.LORE.push({ sec: 'Home', title: 'A Home That Earns', unlock: st => (st.items || []).some(p => /still|lodger|ratcage/.test(p.id)), body: 'A still sells by the cup. A lodger pays by the bout. Marc pays in chits to keep his racing rats somewhere his creditors will not look. None of it is much. All of it arrives whether you win or lose, and none of it can be taken off your body in the pit.' });
  }
})();
