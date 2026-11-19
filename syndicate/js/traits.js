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
  // pointed weapons: a slightly more forgiving thrust, and a heavy blow that carries you onto the target
  ['f_spear', 'd_spear', 'r_spear', 'r_rapier'].forEach(id => { if (!A[id]) return; A[id].arc = Math.max(A[id].arc || 44, 54); [id + '_h', id + '_m'].forEach(k => { if (A[k]) { A[k].arc = Math.max(A[k].arc || 44, 54); A[k].lunge = Math.max(A[k].lunge || 0, 70); } }); });
  if (A.d_spear) { A.d_spear.dmg = [1, 10]; if (A.d_spear_h) A.d_spear_h.name = 'Deep Thrust'; if (A.f_spear_h) A.f_spear_h.name = 'Deep Thrust'; if (A.r_spear_h) A.r_spear_h.name = 'Deep Thrust'; }
  // every caster's basic is thrown its own way
  { const CSB = { s_basic: 'throw', s_frost: 'push', s_spark: 'snap', s_acid: 'lob', s_staff: 'point', w_basic: 'claw', w_frost: 'push', w_acid: 'lob', w_spark: 'snap', w_staff: 'point' }; Object.keys(CSB).forEach(id => { [id, id + '_h'].forEach(k => { if (A[k]) A[k].cs = CSB[id]; }); }); }
  // every caster's mastered blow was called the same thing; name them for what they do
  const SIGN = { s_basic: 'Conflagrate', s_frost: 'Shatterpoint', s_spark: 'Forked Arc', s_acid: 'Dissolve', s_staff: 'Emberfall', w_basic: 'Agonising Blast', w_frost: 'Grave’s Grip', w_acid: 'The Long Hunger', w_spark: 'Soul Tether', w_staff: 'The Clause' };
  if (G.SIG) Object.keys(SIGN).forEach(id => { if (G.SIG[id]) { G.SIG[id] = Object.assign({}, G.SIG[id], { name: SIGN[id] }); if (A[id + '_m']) A[id + '_m'].name = SIGN[id]; } });
})();
// ---- finishers that come with your blood, whatever your trade
(function () {
  'use strict';
  const G = window.G, ui = G.ui;
  const R = {
    human: [{ id: 'rc_mob', rank: 1, name: 'Mob Justice', word: 'TORN DOWN', desc: 'You do it the way a crowd would: from every side at once, and not stopping when it is done.', lead: 'cuts', keep: 1, cast: false, imp: 1.3, col: '#ffd36b' },
            { id: 'rc_steps', rank: 3, name: 'Down. Let It Settle.', word: 'SENTENCED', desc: 'The four words every Highmarch debtor hears, said over them, with a heel.', lead: 'stomp', behead: 1, kick: 1, cast: false, imp: 1.3, col: '#e8e0c0' }],
    dwarf: [{ id: 'rc_seam', rank: 1, name: 'The Seam Closes', word: 'BURIED', desc: 'You strike the floor where forty years in the mine taught you it is weakest. It takes them like a shaft takes a careless boy.', lead: 'quake', crack: 1, swallow: 1, cast: false, imp: 1.4, col: '#c8a24a' },
            { id: 'rc_anvil', rank: 3, name: 'Anvil Work', word: 'HAMMERED FLAT', desc: 'Down, and then struck until they are the shape you wanted.', lead: 'stomp', keep: 1, crack: 1, cast: false, imp: 1.4, col: '#ff8a3c' }],
    elf: [{ id: 'rc_leaf', rank: 1, name: 'Leaf-Fall', word: 'UNMADE', desc: 'Six hundred years of practice. They come apart along lines they did not know they had.', lead: 'cuts', bisect: 1, cast: false, imp: 1.2, col: '#b8f0c0' },
          { id: 'rc_still', rank: 3, name: 'The Long Patience', word: 'UNSEEN', desc: 'You were never where they looked. The head understands a moment after the neck.', lead: 'quiet', behead: 1, cast: false, imp: 1.5, col: '#e8f4ff' }],
    halforc: [{ id: 'rc_hurl', rank: 1, name: 'Thrown Away', word: 'HURLED', desc: 'You pick them up over your head and throw them at the wall like something you are finished with.', lead: 'lift', toss: 1, hoist: 1, cast: false, imp: 1.3, col: '#9ad04a' },
              { id: 'rc_tusk', rank: 3, name: 'Both Halves', word: 'RIPPED', desc: 'Hands. No blade. One to each side.', lead: 'tear', bisect: 1, cast: false, imp: 1.6, col: '#c0e070' }],
    tiefling: [{ id: 'rc_mouth', rank: 1, name: 'Hellmouth', word: 'DRAGGED DOWN', desc: 'The sand goes red and soft, and something that knows your family reaches up for them.', lead: 'sink', swallow: 1, fire: 1, imp: 1.4, col: '#ff4a2a' },
               { id: 'rc_kiss', rank: 3, name: 'Brimstone Kiss', word: 'CINDERS', desc: 'You breathe on them. It is not breath.', lead: 'implode', ash: 1, fire: 1, imp: 1.3, col: '#ff7a2a' }],
    drow: [{ id: 'rc_web', rank: 1, name: 'Strung for the Larder', word: 'STRUNG UP', desc: 'Threads from nowhere lift them by wrist and ankle, the way it is done in Vael Ushar, and pull.', lead: 'cocoon', imp: 1.7, col: '#c79bff' },
           { id: 'rc_dark', rank: 3, name: 'Lights Out', word: 'SNUFFED', desc: 'Every torch on that side gutters. When they come back there is less of somebody.', lead: 'quiet', behead: 1, cast: false, imp: 1.5, col: '#7a5aff' }] };
  G.RACE_MORTALS = R;
  const sync = () => { const st = G.state, h = st && st.hero; if (!h || !G.MORTALS || !G.MORTALS[h.cls]) return; const L = G.MORTALS[h.cls]; for (let i = L.length - 1; i >= 0; i--) if (L[i].race && L[i].race !== h.race) L.splice(i, 1); (R[h.race] || []).forEach(m => { if (!L.some(q => q.id === m.id)) L.push(Object.assign({ race: h.race }, m)); }); };
  ['hub', 'pit', 'prefight', 'sheet', 'finishers', 'mortals'].forEach(fn => { const f0 = ui[fn]; if (f0) ui[fn] = function () { sync(); return f0.apply(this, arguments); }; });
  if (G.mortalsOpen) { const mo0 = G.mortalsOpen; G.mortalsOpen = function (st) { sync(); return mo0.apply(this, arguments); }; }
  if (G.LORE) G.LORE.push({ sec: 'The Pit', title: 'Blood Tells', unlock: st => G.rankOf(st.respect) >= 1, body: 'The Guild teaches a trade, but nobody leaves their blood at the gate. Dwarves know where a floor will break. Elves have had centuries to practise one cut. A half-orc does not need the blade at all. The stands can tell what you are by how you end it, and they have favourites.' });
})();
