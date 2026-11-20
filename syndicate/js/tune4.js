// Guttercrown — weapon balance from a seeded tournament (five bouts per weapon against the same tougher opponent):
// the slow heavy weapons lost too often for what they hit, and the cold and acid casters hit too lightly. Bought weapons should be sidegrades, not traps.
(function () {
  'use strict';
  const A = window.G.ABILITIES;
  const T = { // [wind/recovery multiplier, new dice or null, heavy-blow power multiplier]
    f_hammer: [0.85, [2, 7], 1.1], c_pick: [0.8, [2, 6], 1.15], c_hammer: [0.8, [2, 8], 1.15], d_hammer: [0.85, [2, 7], 1.1],
    f_flail: [0.9, null, 1], c_flail: [0.9, null, 1], d_axes: [1, [1, 8], 1],
    s_frost: [1, [1, 8], 1], w_frost: [1, [1, 8], 1], w_acid: [1, [1, 8], 1], w_staff: [1, [1, 8], 1], d_staff: [1.08, null, 1] };
  Object.keys(T).forEach(id => { const [sp, dice, pw] = T[id]; [id, id + '_h', id + '_m'].forEach((k, i) => { const a = A[k]; if (!a) return; if (sp !== 1) { a.wind *= sp; a.rec *= sp; } if (dice && i === 0) a.dmg = dice.slice(); if (i > 0 && pw !== 1) a.pow = (a.pow || 1) * pw; }); });
  // the named fighters who carry these weapons keep the punch they had, so the change is the player's gain, not the gate's
  const OFF = { beatrix: 0.92, dolly: 0.93, collector: 0.93, asc_queen: 0.95 };
  [].concat(window.G.OPPONENTS || [], (window.G.ascent && window.G.ascent.FOES) || []).forEach(o => { if (o && OFF[o.id]) o.dmgMul = (o.dmgMul || 1) * OFF[o.id]; });
  if (A.s_frost) A.s_frost.speed = Math.max(A.s_frost.speed || 580, 700);
})();
