// Guttercrown — balance pass: numbers changed after simulating every weapon, class and level-up choice (see docs/BALANCE.md)
(function () {
  const G = window.G, A = G.ABILITIES;
  const dmg = (id, d) => { if (!A[id]) return; A[id].dmg = d; if (A[id + '_h']) A[id + '_h'].dmg = d; const b = A[id]; if (b.desc) b.desc = b.desc.replace(/for \d+d\d+ \+/, 'for ' + d[0] + 'd' + d[1] + ' +'); };
  const pow = (id, v) => { if (A[id]) A[id].pow = v; };
  // weapons: the outliers on paper
  dmg('f_hammer', [1, 12]);                       // slowest weapon in the pit was also the weakest per second
  dmg('r_spear', [1, 6]);                         // top damage and top reach was one too many
  dmg('c_basic', [1, 8]); dmg('c_flail', [1, 10]);  // the mace was the worst basic in the game
  ['d_staff', 'd_spear', 'd_flail', 'd_hammer', 'd_axes'].forEach(id => pow(id, 1.0));   // a druid's own weapons are the fallback; the shapes are the damage
  dmg('w_basic', [1, 8]); dmg('w_frost', [1, 6]); dmg('w_staff', [1, 6]);                // hex already makes everything hit a quarter harder
  // casters: they lost to every wall the melee classes walked through
  (G.ARMS || []).filter(w => w.cls === 'sorcerer' || w.cls === 'warlock').forEach(w => pow(w.id, 1.5));
  G.CLASSES.sorcerer.hitDie = 7; G.CLASSES.warlock.hitDie = 8;
  pow('d_staff', 1.08); pow('d_spear', 1.08); pow('d_axes', 1.08);
  if (A.wolf_form) { A.wolf_form.cd = 13; A.bear_form.cd = 15; A.spider_form.cd = 14; A.bat_form.cd = 14; }      // shapes come round a little sooner

  // ------------------------------------------------------------ a third choice at level 2
  { const third = { fighter: 'war_cry', rogue: 'throwing_knife', sorcerer: 'glyph', cleric: 'toll_dead', druid: 'regrowth', warlock: 'shadow_ward' };
    Object.keys(third).forEach(c => { const id = third[c], C = G.CLASSES[c]; if (!C || !A[id] || C.l2.includes(id)) return; C.l2.push(id); if (G.EXTRA && G.EXTRA[c]) G.EXTRA[c] = G.EXTRA[c].filter(x => x !== id); }); }

  // ------------------------------------------------------------ signature blows: what a weapon does in a master's hand
  const FAM = { axe: 'heavy', hammer: 'heavy', pick: 'heavy', spear: 'pole', halberd: 'pole', staff: 'pole', rapier: 'fence', axes: 'dual', chain: 'swing', flail: 'swing' };
  const SIG = { heavy: ['Skullringer', 'stuns for 0.7s', { stun: 0.7 }], pole: ['Hurl Back', 'throws them twice as far and breaks posture', { knock: 420 }], fence: ['Heartseeker', 'hits half as hard again', {}], dual: ['Twin Fangs', 'strikes twice', { repeat: 2 }], swing: ['Hamstring', 'slows by 40% for 2s', { slow: [0.4, 2] }],
    blade: ['Guard-Splitter', 'breaks posture and shoves them off their feet', { knock: 300 }], orb: ['Overcharge', 'a bigger bolt that keeps burning', { dot: ['burn', 3, [1, 6]] }] };
  G.SIG = {};
  (G.ARMS || []).forEach(w => { const h = A[w.id + '_h']; if (!h) return; const suf = w.id.split('_')[1], fam = h.type !== 'melee' ? 'orb' : (FAM[suf] || 'blade'), sg = SIG[fam];
    const m = A[w.id + '_m'] = Object.assign({}, h, sg[2], { id: w.id + '_m', name: sg[0], sig: 1 });
    if (fam === 'fence') m.pow = h.pow * 1.5; else m.pow = h.pow * 1.12; if (fam === 'pole' || fam === 'blade') m.pz = (h.pz || 1) * 1.8; if (fam === 'orb') { m.pr = (h.pr || 12) * 1.3; if (h.dot) m.dot = [h.dot[0], h.dot[1] + 2, h.dot[2]]; if (h.slow) m.slow = [Math.min(0.6, h.slow[0] * 2), h.slow[1] + 1]; }
    if (fam === 'dual') { m.pow = h.pow * 0.7; }
    G.SIG[w.id] = { name: sg[0], text: sg[1] }; });
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const r = fs0.apply(this, arguments), st = G.state, P = G.fight.P; if (!P || G.fight.ex) return r;
    P.mastered = !!(G.mastery && G.mastery.level(st, P.basic) >= 5 && A[P.basic + '_m']);
    if (P.mastered && !(o && o.spar)) { st.sigSeen = st.sigSeen || {}; if (!st.sigSeen[P.basic]) { st.sigSeen[P.basic] = 1; setTimeout(() => G.ui.toast('Mastered: your heavy blow with the ' + G.ARM_BY[P.basic].name + ' is now ' + G.SIG[P.basic].name + '. It ' + G.SIG[P.basic].text + '.'), 1800); } }
    return r; };
  // the Armoury says what mastery will give
  const arm0 = G.ui.armory;
  if (arm0) G.ui.armory = function (sel) { const r = arm0.apply(this, arguments), st = G.state, det = document.querySelector('#panel .arm-detail'); if (!det || !st.hero) return r;
    const list = G.ARMS.filter(w => w.cls === st.hero.cls), pick = list.find(w => w.id === sel) || list.find(w => w.id === G.armOf(st.hero)), sg = pick && G.SIG[pick.id]; if (!sg) return r;
    const lv = G.mastery ? G.mastery.level(st, pick.id) : 1; det.insertAdjacentHTML('afterend', '<div class="setbox' + (lv >= 5 ? ' on' : '') + '"><small>SIGNATURE · AT MASTER</small> <b>' + sg.name + '</b><p>' + (lv >= 5 ? 'Yours. ' : 'Mastery ' + lv + ' of 5. ') + 'The heavy blow ' + sg.text + '.</p></div>'); return r; };
  if (G.LORE) G.LORE.push({ sec: 'How Things Work', title: 'Signature Blows', unlock: st => Object.keys(st.sigSeen || {}).length > 0, body: 'Carry one weapon long enough and it stops being a weapon and becomes a habit. At the fifth rank of mastery the heavy blow changes: a hammer rings the skull and stuns, a polearm throws them across the pit, a rapier finds the heart, paired blades strike twice, a flail takes the legs, and a caster’s focus overcharges. The Armoury lists each one.' });
})();
