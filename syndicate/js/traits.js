// Guttercrown — what each weapon is for: one property apiece, on top of its reach, speed and weight.
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES;
  const TR = {
    f_basic: [{ keen: 0.08 }, 'Keen', '+8% critical chance.'], f_spear: [{ opener: 0.2 }, 'First Blood', '+20% damage to a foe above 85% health.'], f_axe: [{ exe: 0.3 }, 'Executioner', '+30% damage to a foe below 35% health.'],
    f_hammer: [{ vsReel: 0.2 }, 'Follow-Through', '+20% damage to a foe who is slowed, stunned or broken.'], f_halberd: [{ slow: [0.15, 0.7] }, 'Hook', 'Every hit slows by 15% for a moment.'], f_flail: [{ mark: 0.9 }, 'Rattle', 'Every hit leaves them marked for a moment: they take 25% more.'],
    r_basic: [{ steal: 1 }, 'Light Fingers', 'Every hit lifts a coin off them.'], r_rapier: [{ exe: 0.25 }, 'Heartseeker', '+25% damage to a foe below 35% health.'], r_axes: [{ keen: 0.1 }, 'Hooked Beards', '+10% critical chance.'],
    r_chain: [{ vsReel: 0.15 }, 'Tangle', 'Slows, and hits slowed foes 15% harder.'], r_spear: [{ opener: 0.2 }, 'First Blood', '+20% damage to a foe above 85% health.'],
    s_basic: [{ dot: ['burn', 2, [1, 3]] }, 'Kindle', 'Sets them alight for 2s.'], s_frost: [{ vsReel: 0.12 }, 'Brittle', 'Slows, and hits slowed foes 12% harder.'], s_spark: [{ pierce: 1 }, 'Arc', 'Ignores half their armour.'], s_acid: [{ exe: 0.15 }, 'Corrode', 'Poisons, and +15% to a foe below 35% health.'], s_staff: [{ opener: 0.15 }, 'Ember Heart', 'Knocks back, and +15% to a foe above 85% health.'],
    c_basic: [{ vsReel: 0.2 }, 'Chastise', '+20% damage to a foe who is slowed, stunned or broken.'], c_flail: [{ mark: 0.9 }, 'Penance', 'Every hit leaves them marked for a moment: they take 25% more.'], c_pick: [{ pierce: 1 }, 'Punch Through', 'Ignores half their armour.'], c_staff: [{ leech: 0.15 }, 'Pilgrim’s Rest', 'Heals you for 15% of the damage it deals.'], c_hammer: [{ slow: [0.2, 0.8] }, 'Toll', 'Every hit slows by 20% for a moment.'],
    d_staff: [{ leech: 0.12 }, 'Living Wood', 'Heals you for 12% of the damage it deals.'], d_spear: [{ opener: 0.2 }, 'First Blood', '+20% damage to a foe above 85% health.'], d_flail: [{ vsReel: 0.15 }, 'Briar', 'Slows, and hits slowed foes 15% harder.'], d_hammer: [{ exe: 0.25 }, 'Deadfall', '+25% damage to a foe below 35% health.'], d_axes: [{ dot: ['poison', 2, [1, 3]] }, 'Fester', 'Every cut festers for 2s.'],
    w_basic: [{ knock: 90 }, 'Repelling', 'Every blast shoves them back.'], w_frost: [{ vsReel: 0.12 }, 'Grave Cold', 'Slows, and hits slowed foes 12% harder.'], w_acid: [{ exe: 0.15 }, 'Gnaw', 'Poisons, and +15% to a foe below 35% health.'], w_spark: [{ leech: 0.12 }, 'Tether', 'Heals you for 12% of the damage it deals.'], w_staff: [{ pierce: 1 }, 'Pact-Keeper', 'Slows, shoves, and ignores half their armour.'] };
  G.WEAPON_TRAIT = {};
  Object.keys(TR).forEach(id => { const t = TR[id], w = (G.ARM_BY || {})[id]; if (!A[id]) return; [id, id + '_h', id + '_m'].forEach(k => { if (A[k]) Object.keys(t[0]).forEach(p => { if (A[k][p] == null) A[k][p] = t[0][p]; }); });
    G.WEAPON_TRAIT[id] = [t[1], t[2]]; const line = ' ' + t[1] + ': ' + t[2]; if (w) w.blurb = (w.blurb || '') + line; if (A[id].desc && A[id].desc.indexOf(t[1] + ':') < 0) A[id].desc += line; });
  // every caster's mastered blow was called the same thing; name them for what they do
  const SIGN = { s_basic: 'Conflagrate', s_frost: 'Shatterpoint', s_spark: 'Forked Arc', s_acid: 'Dissolve', s_staff: 'Emberfall', w_basic: 'Agonising Blast', w_frost: 'Grave’s Grip', w_acid: 'The Long Hunger', w_spark: 'Soul Tether', w_staff: 'The Clause' };
  if (G.SIG) Object.keys(SIGN).forEach(id => { if (G.SIG[id]) { G.SIG[id] = Object.assign({}, G.SIG[id], { name: SIGN[id] }); if (A[id + '_m']) A[id + '_m'].name = SIGN[id]; } });
})();
