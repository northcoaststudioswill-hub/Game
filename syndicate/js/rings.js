// Guttercrown — a sorcerer's ring: one more opens every two levels, and you choose which to wear on your sheet
(function () {
  'use strict';
  const G = window.G, ui = G.ui;
  G.RINGS = {
    cinder: { cls: 'sorcerer', name: 'Cinder Ring', lv: 2, col: ['#ff8a2a', '#ffd060'], desc: 'The first thing your blood does on its own: a circle of embers it will not let you step out of.' },
    glass: { cls: 'sorcerer', name: 'Wet Glass', lv: 4, col: ['#5ae0e0', '#c8fff8'], desc: 'Cold blue light out of the Wet Galleries, where the water has not moved in a hundred years.' },
    storm: { cls: 'sorcerer', name: 'The Stormcall', lv: 6, col: ['#6a9aff', '#e0ecff'], desc: 'A ring of lightning teeth: the Ember Rows still say a storm-born child crackles in the cradle.' },
    wyrm: { cls: 'sorcerer', name: 'Wyrm’s Eye', lv: 8, col: ['#ff4a2a', '#f0c95a'], layers: 2, desc: 'Your blood remembers something with scales. Now the sand under you does too.' },
    pale: { cls: 'sorcerer', name: 'Pale Crown', lv: 10, col: ['#c8a0ff', '#f4f0ff'], layers: 2, desc: 'A Koheneim mandala, the Queen’s own sign. Nobody gave it to you. You simply have one now.' },
    ash: { cls: 'warlock', name: 'Ash Circle', lv: 2, col: ['#8a7a9a', '#c8b8d8'], desc: 'What is left on the floor after the first bargain: a ring of ash that never quite blows away.' },
    line: { cls: 'warlock', name: 'The Signed Line', lv: 4, col: ['#5ac87a', '#b0ffc0'], desc: 'The clause you signed, written round you in a hand that is not yours, still checking you keep it.' },
    teeth: { cls: 'warlock', name: 'Teeth Below', lv: 6, col: ['#5a1418', '#ff6a5a'], desc: 'The thing under the pit opens its mouth a little wider each time you call on it.' },
    seal: { cls: 'warlock', name: 'The Bargain Seal', lv: 8, col: ['#8a4aff', '#f0c95a'], layers: 2, desc: 'Your patron’s own seal, pressed into the sand. Others in the pact can see it from a long way off.' },
    unspoken: { cls: 'warlock', name: 'Name Unspoken', lv: 10, col: ['#8aff9a', '#d8ffe0'], layers: 2, desc: 'Seven points for seven letters you promised never to say aloud. It glows a little brighter every time you nearly do.' },
    hourmark: { cls: 'david', name: 'The Roseinbeirg Hourmark', lv: 99, col: ['#7ab0ff', '#f0f4ff'], desc: 'David’s own. Nobody else stands on it twice.' }
  };
  const CASTER = c => c === 'sorcerer' || c === 'warlock', has = (h, id) => h && G.RINGS[id] && G.RINGS[id].cls === h.cls && h.level >= G.RINGS[id].lv;
  const l0 = G.lookOf;
  G.lookOf = function (h, st) { const l = l0.apply(this, arguments); if (h && CASTER(h.cls)) { if (h.ring && !G.RINGS[h.ring]) h.ring = null; if (h.ring == null) { const got = Object.keys(G.RINGS).filter(id => has(h, id)); h.ring = got.length ? got[got.length - 1] : null; } if (h.ring && has(h, h.ring)) l.ring = h.ring; } return l; };
  // the sheet: pick your ring
  const sh0 = ui.sheet;
  ui.sheet = function () { const r = sh0.apply(this, arguments), h = G.state.hero, dv = document.querySelector('#panel .card .derived'); if (!dv || !h || !CASTER(h.cls)) return r;
    const cur = h.ring && has(h, h.ring) ? h.ring : (h.ring == null ? (G.lookOf(h, G.state).ring || null) : null), ids = Object.keys(G.RINGS).filter(id => G.RINGS[id].cls === h.cls), next = ids.find(id => !has(h, id)), d = document.createElement('div'); d.className = 'ab-row';
    d.innerHTML = '<div class="ab-ic pas">◎</div><div class="ab-tx"><b>Your ring: ' + (cur ? G.RINGS[cur].name : 'none') + '</b><small>' + G.CLASSES[h.cls].name + ' · it lies under your feet</small><p>' + (cur ? G.RINGS[cur].desc : 'Your blood has not made one yet.') + (next ? ' <i>Next: ' + G.RINGS[next].name + ' at level ' + G.RINGS[next].lv + '.</i>' : '') + '</p></div><div class="slots">' + '<button class="slot' + (!cur ? ' sel' : '') + '" data-ring="">None</button>' + ids.filter(id => has(h, id)).map(id => '<button class="slot' + (id === cur ? ' sel' : '') + '" data-ring="' + id + '" style="color:' + G.RINGS[id].col[0] + '">' + G.RINGS[id].name + '</button>').join('') + '</div>';
    dv.parentNode.insertBefore(d, dv.nextSibling); d.querySelectorAll('[data-ring]').forEach(b => b.onclick = () => { h.ring = b.dataset.ring || ''; G.save(); G.sfx('place'); if (G.world && G.world.walker) G.world.walker.key = null; ui.sheet(); }); return r; };
  // a new ring is announced when it arrives
  const lu0 = ui.levelUp;
  if (lu0) ui.levelUp = function () { const r = lu0.apply(this, arguments), h = G.state.hero; if (h && CASTER(h.cls)) { const nw = Object.keys(G.RINGS).find(id => G.RINGS[id].cls === h.cls && G.RINGS[id].lv === h.level); if (nw) { h.ring = nw; G.save(); const card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (end) { const p = document.createElement('p'); p.className = 'rankup'; p.innerHTML = 'A new ring under your feet: <b style="color:' + G.RINGS[nw].col[0] + '">' + G.RINGS[nw].name + '</b>. Change it on your sheet.'; end.parentNode.insertBefore(p, end); } } } return r; };
  if (G.LORE) G.LORE.push({ sec: 'The Trades', title: 'Sorcerers’ Rings', unlock: st => !!(st.hero && CASTER(st.hero.cls) && st.hero.level >= 2), body: 'A sorcerer does not learn magic; it comes up out of them, like damp. After a while it starts to leave marks. The first is usually a ring of embers under the feet that nobody drew. Later ones are stranger: cold glass from the Wet Galleries, the old storm-sign of the Ember Rows, an eye with scales round it. The last anyone has recorded is a mandala the Queen herself wears. Nobody knows how a cellar sorcerer comes by that one, and nobody who has it says. Warlocks get rings too, but theirs are not made by their blood: they are receipts. And there is one ring nobody below the stair will stand on, the hourglass triangle under David Roseinbeirg, because they have all seen what it costs.' });
})();
