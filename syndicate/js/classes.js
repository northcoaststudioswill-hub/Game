// Guttercrown — two more callings and one more people: the Druid, who becomes the animals of the deep; the Warlock, who made a bargain down there;
// and the Drow, who never lived anywhere else
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, A = G.ABILITIES, ui = G.ui, S = 32;
  const mk = (id, base, o) => { A[id] = Object.assign({}, A[base], o, { id }); delete A[id].kind; delete A[id].role; if (o.kind) { A[id].kind = o.kind[0]; A[id].role = o.kind[1]; } return A[id]; };

  // ------------------------------------------------------------ the Drow
  G.RACES.drow = { name: 'Drow', bonus: { dex: 2, cha: 1 }, desc: '+2 Dexterity, +1 Charisma. Deep elves: ash skin, white hair, red eyes. The only people in the Undercity who think it is too bright.', skin: '#6a6278', scale: 1.01 };

  // ------------------------------------------------------------ druid: abilities
  const FORMKIND = ['Wild Shape', 'Form'];
  mk('moonbeam', 'sacred_flame', { name: 'Moonbeam', stat: 'wis', color: '#bfe0ff', desc: 'Cold light from a moon nobody down here has seen: 2d8 + WIS on your foe after a moment.', kind: ['Cantrip', 'Damage'] });
  mk('wolf_form', 'shield_faith', { name: 'Tunnel Wolf', cost: 25, cd: 15, wind: 0.2, rec: 0.25, buff: { form: [9, 0], speed: [9, 0.28], dmg: [9, 0.1] }, shieldLvl: 0, form: 'wolf', color: '#b8c0c8', icon: 'up', desc: 'Become a tunnel wolf for 9s: 28% faster, quick lunging bites, and your heavy blow is a pounce. You change back winded.', kind: FORMKIND });
  mk('bear_form', 'shield_faith', { name: 'Cave Bear', cost: 35, cd: 18, wind: 0.3, rec: 0.3, buff: { form: [10, 0], shield: [10, 34], dmg: [10, 0.2], speed: [10, -0.12] }, shieldLvl: 6, form: 'bear', color: '#b08050', icon: 'up', desc: 'Become a cave bear for 10s: a thick hide soaks 34 + 6 per level, slow sweeping mauls break posture, and you hit 20% harder.', kind: FORMKIND });
  mk('spider_form', 'shield_faith', { name: 'Pit Spider', cost: 30, cd: 16, wind: 0.2, rec: 0.25, buff: { form: [9, 0], speed: [9, 0.12] }, shieldLvl: 0, form: 'spider', color: '#9be35a', icon: 'up', desc: 'Become a giant pit spider for 9s: every bite poisons and slows, and you skitter 12% faster.', kind: FORMKIND });
  mk('bat_form', 'shield_faith', { name: 'Great Bat', cost: 30, cd: 16, wind: 0.15, rec: 0.2, buff: { form: [8, 0], speed: [8, 0.45] }, shieldLvl: 0, form: 'bat', color: '#c79bff', icon: 'up', desc: 'Become a great cave bat for 8s: 45% faster, with raking dives that are very hard to parry.', kind: FORMKIND });
  mk('primal_avatar', 'spirit_guardians', { name: 'The Old Bear Wakes', buff: { form: [12, 0], shield: [12, 70], dmg: [12, 0.35], speed: [12, 0.08] }, shieldLvl: 8, aura: null, form: 'avatar', color: '#ffb060', desc: 'Become the cave bear the first miners drew on the walls, for 12s: enormous, armoured in hide, and 35% deadlier.', kind: ['Class feature', 'Burst'] });
  delete A.primal_avatar.aura;
  mk('thorn_snare', G.ABILITIES.bear_trap ? 'bear_trap' : 'sacred_flame', { name: 'Thorn Snare', stat: 'wis', color: '#7fd68a', desc: 'Roots and thorns wait under the sand. Whoever steps in is held and bleeding.', kind: ['1st-level spell', 'Control'] });
  mk('regrowth', 'cure_wounds', { name: 'Regrowth', cost: 28, cd: 11, color: '#7fd68a', desc: 'Moss closes over the wound: heal 2d8 + WIS + 2 per level.', kind: ['1st-level spell', 'Heal'] });
  mk('barkskin', 'shield_faith', { name: 'Barkskin', color: '#b08a50', desc: 'Your skin turns to root-bark for 6s and soaks 22 + 5 per level.', kind: ['2nd-level spell', 'Defense'] });
  // what each animal fights with
  const basicLike = (id, o) => mk(id, 'c_basic', Object.assign({ stat: 'wis', basic: 1, _tempo: 1, beast: 1 }, o));
  basicLike('bite_wolf', { name: 'Bite', range: 70, arc: 60, wind: A.c_basic.wind * 0.62, rec: A.c_basic.rec * 0.62, cost: 5, dmg: [1, 8], lunge: 34, gain: 9, color: '#dfe6ee' });
  basicLike('maul_bear', { name: 'Maul', range: 78, arc: 130, wind: A.c_basic.wind * 1.3, rec: A.c_basic.rec * 1.25, cost: 11, dmg: [2, 8], pz: 2, knock: 150, color: '#ffb060' });
  basicLike('bite_spider', { name: 'Venom Bite', range: 66, arc: 70, wind: A.c_basic.wind * 0.85, rec: A.c_basic.rec * 0.85, cost: 7, dmg: [1, 6], dot: ['poison', 3, [1, 4]], slow: [0.25, 1.2], color: '#9be35a' });
  basicLike('rake_bat', { name: 'Raking Dive', range: 84, arc: 46, wind: A.c_basic.wind * 0.55, rec: A.c_basic.rec * 0.7, cost: 5, dmg: [1, 6], lunge: 60, color: '#c79bff' });
  basicLike('maul_avatar', { name: 'Ruin', range: 96, arc: 150, wind: A.c_basic.wind * 1.2, rec: A.c_basic.rec * 1.1, cost: 8, dmg: [3, 8], pz: 2.4, knock: 220, color: '#ffb060' });
  const FORMS = { wolf: { basic: 'bite_wolf', scale: 1.05, col: 0x8a8f98 }, bear: { basic: 'maul_bear', scale: 1.5, col: 0x6a4a30 }, spider: { basic: 'bite_spider', scale: 1.15, col: 0x2a2a34 }, bat: { basic: 'rake_bat', scale: 1.0, col: 0x3a2a4a }, avatar: { basic: 'maul_avatar', scale: 2.0, col: 0x4a3424, glow: 0xffb060 } };

  // ------------------------------------------------------------ warlock: abilities
  mk('hex', 'guiding_bolt', { name: 'Hex', stat: 'cha', radiant: 0, color: '#b070ff', desc: 'A curse thrown like a stone: 3d6 + CHA, and the target takes 25% more damage for 4s.', kind: ['1st-level spell', 'Damage'] });
  mk('shadow_step', 'misty_step', { name: 'Step Through the Dark', color: '#8a6aff', desc: 'Step into one shadow and out of another. Untouchable while you travel.', kind: ['2nd-level spell', 'Mobility'] });
  mk('hunger_dark', 'burning_hands', { name: 'Arms of the Deep', fire: 0, dot: ['poison', 3, [1, 4]], cone: '#7a4acc', color: '#7a4acc', desc: 'Cold black arms sweep out in a cone: 3d6 + CHA, and the cold keeps biting.', kind: ['1st-level spell', 'Damage'] });
  mk('cause_fear', 'ray_frost', { name: 'Cause Fear', color: '#c8a0ff', desc: 'Show them what waits below: 2d8 + CHA, and they move like a man wading for 3s.', kind: ['1st-level spell', 'Control'] });
  mk('hellfire', 'dragon_breath', { name: 'Hellish Rebuke', color: '#ff4a2a', cone: '#ff4a2a', desc: 'Your patron answers for you: 4d6 + CHA of fire in a wide cone.', kind: ['Pact feature', 'Damage'] });
  mk('whispers', 'chaos_bolt', { name: 'Dissonant Whispers', color: '#8aff9a', desc: '3d8 + CHA of something that should not have a voice. It burns, chills, stuns or marks at random.', kind: ['Pact feature', 'Damage'] });
  mk('dark_pact', 'fireball', { name: 'The Bargain Called In', fire: 0, dot: ['poison', 4, [1, 6]], color: '#8a4aff', desc: 'What you sold comes to collect from somebody else: 6d6 + CHA in a huge area.', kind: ['Mystic Arcanum', 'Burst'] });
  mk('shadow_ward', 'shield_faith', { name: 'Armour of Shadows', color: '#6a4aaa', desc: 'The dark thickens round you for 6s and soaks 22 + 5 per level.', kind: ['Invocation', 'Defense'] });
  mk('w_basic', 's_basic', { name: 'Eldritch Blast', dmg: [1, 10], fire: 0, speed: A.s_basic.speed * 0.9, color: '#b070ff', _tempo: 1 });
  mk('d_staff', 'c_basic', { name: 'Thornwood Staff', stat: 'wis', range: 92, arc: 120, wind: A.c_basic.wind * 0.86, rec: A.c_basic.rec * 0.88, cost: 8, dmg: [1, 6], color: '#c8b070', _tempo: 1 });

  // ------------------------------------------------------------ the classes themselves
  G.CLASSES.druid = { name: 'Druid', role: 'Shapeshifter', tag: 'The deep has its own beasts. Wear them. Fight as wolf, bear, spider and bat.', res: 'Wild', resColor: '#7fd68a', hitDie: 8, primary: 'wis',
    stats: { str: 12, dex: 13, con: 14, int: 10, wis: 17, cha: 10 }, basic: 'd_staff', start: ['wolf_form', 'moonbeam'], l2: ['bear_form', 'spider_form'], ult: 'primal_avatar', pref: 50,
    subs: { fang: { name: 'Circle of the Fang', desc: 'The shape is the weapon.', passive: ['Primal Blood', 'Every animal shape lasts 4s longer and hits 10% harder.'], ability: 'bat_form' },
      root: { name: 'Circle of the Deep Root', desc: 'What grows in the dark grows patient.', passive: ['Mycelial Mind', '+20% healing and +15% Wild recovery.'], ability: 'thorn_snare' } } };
  G.CLASSES.warlock = { name: 'Warlock', role: 'Pact Caster', tag: 'Something under the ninth level answered. Now you owe it, and it pays in ruin.', res: 'Pact', resColor: '#b070ff', hitDie: 7, primary: 'cha',
    stats: { str: 9, dex: 13, con: 14, int: 12, wis: 10, cha: 17 }, basic: 'w_basic', start: ['hex', 'shadow_step'], l2: ['hunger_dark', 'cause_fear'], ult: 'dark_pact', pref: 270, ranged: 1,
    subs: { fiend: { name: 'Pact of the Fiend', desc: 'It burns, and it likes you.', passive: ['Dark One’s Blessing', '+10% damage with everything and +8% max HP.'], ability: 'hellfire' },
      deep: { name: 'Pact of the Deep Dweller', desc: 'It is very old, and it is under the city.', passive: ['Awakened Mind', 'Abilities recover 12% faster and Pact returns 15% quicker.'], ability: 'whispers' } } };
  G.FOE_CLASSES = ['fighter', 'rogue', 'sorcerer', 'cleric', 'druid', 'warlock'];
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments);
    if (h.sub === 'fang') d.formBonus = 1; if (h.sub === 'root') { d.healMul += 0.2; d.regen *= 1.15; }
    if (h.sub === 'fiend') { d.dmgMul += 0.1; d.maxHp = Math.round(d.maxHp * 1.08); } if (h.sub === 'deep') { d.cdr += 0.12; d.regen *= 1.15; } return d; };

  // text the rest of the game expects for every class
  G.MORTAL.druid = { name: 'The Pack Feeds', word: 'DEVOURED', desc: 'You are a wolf for exactly as long as it takes.' };
  G.MORTAL.warlock = { name: 'Paid in Full', word: 'COLLECTED', desc: 'Your patron reaches up through the sand and takes what it is owed.' };
  G.PARRY_INFO.druid = ['Bark Ward', 'A hide of root-bark. Heals you a little and leaves the attacker slowed.']; G.PARRY_INFO.warlock = ['Dark Ward', 'A wall of shadow. Hurls a melee attacker away and turns projectiles back.'];
  G.PLAY.druid = 'Open as yourself, then change. Wolf to close the distance, bear to stand and trade, spider to wear them down. Every shape ends, so use it.';
  G.PLAY.warlock = 'Hex first, then everything else hits harder. Keep your distance, step through the dark when they close, and let the bargain do the work.';
  G.WEAK2 = { druid: 'Watch for the change. The shapes do not last: back off, let it run out, and punish the moment they are themselves again.', warlock: 'Close fast behind a raised guard. Once the hex is on you, everything hurts more, so do not let them have the time.' };
  if (G.MORTALS) {
    G.MORTALS.druid = [Object.assign({ id: 'pack', rank: 0, cast: false }, G.MORTAL.druid), { id: 'roots', rank: 1, name: 'Taken by the Roots', word: 'BURIED', desc: 'The sand opens. Something pale and patient pulls them under, and it closes again.', col: '#7fd68a', pillar: 1 }, { id: 'hounds', rank: 2, name: 'Three From the Dark', word: 'MAULED', desc: 'You whistle. Three shapes come up out of the sand with their ears back, and you let them.', col: '#9ad0a0', imp: 1.9, tail: 3.4, keep: 1, lead: 'hounds' }, { id: 'oldbear', rank: 3, name: 'The Old Bear', word: 'BROKEN', desc: 'A shape off a cave wall, twice the height of a man, for one blow.', col: '#ffb060', imp: 1.5, cast: false }];
    G.MORTALS.warlock = [Object.assign({ id: 'paid', rank: 0, ash: 1, col: '#b070ff' }, G.MORTAL.warlock), { id: 'maw', rank: 1, name: 'The Maw Below', word: 'SWALLOWED', desc: 'A ring of teeth opens in the floor of the pit. It is gone before the crowd can agree on what they saw.', col: '#8a4aff', imp: 1.4 }, { id: 'name', rank: 3, name: 'Speak the Name', word: 'UNMADE', desc: 'You say the thing you promised never to say aloud.', col: '#8aff9a', ash: 1, imp: 1.5 }];
  }
  if (G.EXTRA) { G.EXTRA.druid = ['regrowth', 'barkskin']; G.EXTRA.warlock = ['shadow_ward', 'cause_fear']; }

  // ------------------------------------------------------------ weapons
  const W = (id, cls, name, model, cost, rank, base, o, blurb, mast) => { if (o) mk(id, base, Object.assign({ name, basic: 1, _tempo: 1 }, o)); const w = { id, cls, name, model, cost, rank, blurb }; if (mast) w.mast = mast; G.ARMS.push(w); G.ARM_BY[id] = w; return w; };
  W('d_staff', 'druid', 'Thornwood Staff', 'staff', 0, 0, null, null, 'Cut from something that grows without light. Long, quick, forgiving.');
  W('d_spear', 'druid', 'Stalactite Spear', 'spear', 140, 1, 'd_staff', { range: 104, arc: 44, lunge: 18, dmg: [1, 8] }, 'A stone tooth lashed to a pole. Keeps them at the end of it.');
  W('d_flail', 'druid', 'Thorn Whip', 'flail', 220, 2, 'd_staff', { range: 112, arc: 150, wind: A.d_staff.wind * 1.25, rec: A.d_staff.rec * 1.25, dmg: [1, 8], slow: [0.2, 0.8] }, 'A living vine with opinions. Wide, slow, and it clings.');
  W('d_hammer', 'druid', 'Root Maul', 'hammer', 0, 0, 'd_staff', { range: 66, arc: 100, wind: A.d_staff.wind * 1.6, rec: A.d_staff.rec * 1.5, cost: 12, dmg: [1, 12], pz: 2, knock: 130 }, 'A burl the size of a head on a root the length of an arm.', 3);
  W('w_basic', 'warlock', 'Eldritch Blast', 'fire', 0, 0, null, null, 'A bolt of whatever your patron is made of. Hits like a thrown brick.');
  W('w_frost', 'warlock', 'Grave Chill', 'frost', 140, 1, 'w_basic', { speed: A.w_basic.speed * 0.85, dmg: [1, 8], slow: [0.2, 0.9], color: '#9fd0ff', shape: 'shard' }, 'Cold off something long dead. Slow in the air; slower still once it lands.');
  W('w_acid', 'warlock', 'Gnawing Dark', 'acid', 220, 2, 'w_basic', { dmg: [1, 6], dot: ['poison', 3, [1, 4]], color: '#8aff9a' }, 'It keeps eating after it lands. You try not to wonder what it is eating with.');
  W('w_spark', 'warlock', 'Witch Bolt', 'spark', 0, 0, 'w_basic', { speed: A.w_basic.speed * 1.4, pr: 7, wind: A.w_basic.wind * 0.8, rec: A.w_basic.rec * 0.85, dmg: [1, 6], color: '#c8a0ff' }, 'Thin, fast and spiteful.', 3);
  const HEAVY = { druid: 'Rootbreaker', warlock: 'Baleful Blast' };
  const heavyOf = (id, name, ranged) => { const b = A[id]; if (!b.pow) b.pow = ranged ? 1.32 : 1.2; b.desc = (b.type === 'melee' ? 'Tap to strike' : 'Tap to loose') + ' for ' + b.dmg[0] + 'd' + b.dmg[1] + ' + ' + b.stat.toUpperCase() + '. Costs ' + b.cost + ', refunded on a hit. Hold, then release, for a heavy blow.';
    A[id + '_h'] = Object.assign({}, b, { id: id + '_h', basic: 0, heavy: 1, armor: 1, name, wind: +(b.wind * 2.1).toFixed(3), rec: +(b.rec * 1.5).toFixed(3), cost: b.cost * 2, pow: 2.5, knock: 230, gain: 6, lunge: b.type === 'melee' ? Math.max(46, b.lunge || 0) : 0, speed: b.speed ? b.speed * 1.15 : undefined, pr: b.pr ? b.pr * 1.6 : undefined }); };
  G.ARMS.filter(w => HEAVY[w.cls]).forEach(w => heavyOf(w.id, HEAVY[w.cls], w.cls === 'warlock'));
  [['bite_wolf', 'Pounce'], ['maul_bear', 'Crushing Maul'], ['bite_spider', 'Deep Bite'], ['rake_bat', 'Stooping Dive'], ['maul_avatar', 'Ruin of the Deep']].forEach(q => heavyOf(q[0], q[1]));
  A.bite_wolf_h.lunge = 110; A.rake_bat_h.lunge = 130;

  // ------------------------------------------------------------ sets and kits for the new callings
  if (G.SETS) { const MAP = { c_basic: 'd_staff', c_flail: 'd_flail', c_pick: 'd_hammer', c_staff: 'd_spear', s_basic: 'w_basic', s_frost: 'w_frost', s_acid: 'w_acid', s_spark: 'w_spark' };
    Object.keys(G.SETS).forEach(k => { const a = G.SETS[k].arms; a.druid = [...new Set(a.cleric.map(x => MAP[x]))]; a.warlock = [...new Set(a.sorcerer.map(x => MAP[x]))]; }); }
  if (G.KITS && G.SETS) {
    const K = (id, name, cost, rank, mods, tint, desc, rung) => { const k = { id, name, cost, rank, mods, tint, vis: 0, desc }; G.KITS.push(k); G.KIT_BY[id] = k; if (G.KIT_RUNG) G.KIT_RUNG[id] = rung; };
    K('mosshide', 'Moss-Hide Mantle', 300, 2, { regen: 0.15, heal: 0.12, hp: 0.04 }, { armor: '#4a5a34', armor2: '#2e3a22', cloth: '#5a6e3a', trim: '#d8c8a0', legs: '#3a3226' }, 'Hide off something that lived in the wet galleries, with the moss still growing on it. You mend faster inside it.', 2);
    K('pactrobes', 'Robes of the Low Pact', 480, 3, { regen: 0.2, speed: 0.05, hp: -0.06, parry: 0.02 }, { armor: '#2a1e3a', armor2: '#181024', cloth: '#32204a', trim: '#8aff9a', legs: '#1a1422' }, 'Black cloth sewn with a script that moves when you are not reading it. Power comes easier. Staying alive does not.', 3);
    const any = (f, r, s, c, d, w) => ({ fighter: f, rogue: r, sorcerer: s, cleric: c, druid: d, warlock: w });
    G.SETS.mosshide = { name: 'The Deep Grove', charm: 'bead', arms: any(['f_spear'], ['r_axes'], ['s_acid'], ['c_staff'], ['d_staff', 'd_flail', 'd_spear'], ['w_acid']), text: '+15% healing, +10% stamina recovery, +5% health', fx: d => { d.healMul += 0.15; d.regen *= 1.1; d.maxHp = Math.round(d.maxHp * 1.05); } };
    G.SETS.pactrobes = { name: 'The Low Pact', charm: 'ratfoot', arms: any(['f_axe'], ['r_chain'], ['s_spark', 's_frost'], ['c_pick'], ['d_hammer'], ['w_basic', 'w_frost', 'w_spark']), text: 'abilities recover 8% faster, +6% damage, +4% critical chance', fx: d => { d.cdr += 0.08; d.dmgMul += 0.06; d.crit += 0.04; } };
    const km0 = G.kitModel;
    G.kitModel = function (id, p) { const { torso, head, m, w, box, mesh, M } = p;
      if (id === 'mosshide') { const moss = M(0x4f7a34), hide = M(0x5a4630); [-1, 1].forEach(sd => { const q = mesh(new T.SphereGeometry(0.24, 7, 5), hide, sd * (w / 2 + 0.07), 0.66, 0, torso); q.scale.set(1.1, 0.7, 1.1); [0, 1, 2].forEach(k => mesh(new T.SphereGeometry(0.07, 5, 4), moss, sd * (w / 2 + 0.02 + k * 0.07), 0.78, -0.08 + k * 0.08, torso)); });
        const ck = new T.Group(); ck.position.set(0, 0.64, -0.24); ck.rotation.x = 0.15; torso.add(ck); box(w + 0.1, 0.8, 0.06, hide, 0, -0.4, 0, ck); [0, 1, 2, 3].forEach(k => box(0.16, 0.12, 0.07, moss, -w / 2 + 0.1 + k * (w / 3.4), -0.2 - (k % 2) * 0.3, 0.02, ck)); for (let i = 0; i < 4; i++) mesh(new T.ConeGeometry(0.03, 0.1, 4), M(0xe6dcc4), -0.14 + i * 0.09, 0.56, 0.235, torso).rotation.x = Math.PI; }
      else if (id === 'pactrobes') { const dk = m.cloth, gr = m.trim; box(w * 0.9, 0.34, 0.08, dk, 0, 0.82, -0.22, torso); [-1, 1].forEach(sd => { box(0.08, 0.3, 0.3, dk, sd * w * 0.42, 0.8, -0.08, torso); const ch = mesh(new T.TorusGeometry(0.13, 0.018, 5, 10), gr, sd * 0.1, 0.42, 0.235, torso); ch.scale.y = 1.4; });
        box(0.05, 0.6, 0.03, gr, 0, 0.2, 0.235, torso); [0.38, 0.22, 0.06].forEach(y => box(0.18, 0.02, 0.03, gr, 0, y, 0.24, torso)); const e = new T.Mesh(new T.SphereGeometry(0.05, 6, 5), new T.MeshBasicMaterial({ color: 0x8aff9a })); e.position.set(0, 0.5, 0.25); torso.add(e); }
      else return km0.apply(this, arguments); };
  }

  // ------------------------------------------------------------ the animals
  G.makeBeast = function (kind, col, glow) {
    const root = new T.Group(), body = new T.Group(); root.add(body); const mats = [];
    const M = c => { const m = new T.MeshLambertMaterial({ color: c, flatShading: true }); m.emissive = new T.Color(glow ? 0x3a1c04 : 0); m.userData.e = m.emissive.clone(); mats.push(m); return m; };
    const fur = M(col), dark = M(0x15131a), pale = M(0xe6dcc4), box = gfx.box, mesh = gfx.mesh, legs = [], eye = new T.MeshBasicMaterial({ color: kind === 'spider' ? 0xff3a3a : kind === 'bat' ? 0xffd36b : 0xffe9a0 });
    let head = new T.Group(), jaw = null, wings = null, tail = null;
    if (kind === 'spider') {
      mesh(new T.SphereGeometry(0.42, 8, 6), fur, 0, 0.5, -0.3, body).scale.set(1, 0.8, 1.2); mesh(new T.SphereGeometry(0.26, 7, 5), fur, 0, 0.45, 0.25, body); head.position.set(0, 0.45, 0.45); body.add(head);
      [-1, 1].forEach(sd => { mesh(new T.ConeGeometry(0.04, 0.2, 4), pale, sd * 0.08, -0.1, 0.08, head).rotation.x = Math.PI; for (let k = 0; k < 3; k++) { const e = new T.Mesh(new T.SphereGeometry(0.03, 5, 4), eye); e.position.set(sd * (0.05 + k * 0.05), 0.06 + (k % 2) * 0.05, 0.05); head.add(e); } });
      for (let i = 0; i < 8; i++) { const sd = i % 2 ? 1 : -1, k = Math.floor(i / 2), g = new T.Group(); g.position.set(sd * 0.22, 0.5, 0.25 - k * 0.16); g.rotation.y = sd * (0.5 - k * 0.42); body.add(g); const up = box(0.07, 0.07, 0.5, fur, sd * 0.25, 0.14, 0, g); up.rotation.y = Math.PI / 2; up.rotation.z = sd * -0.6; const lo = box(0.05, 0.6, 0.05, fur, sd * 0.52, -0.02, 0, g); lo.rotation.z = sd * 0.25; legs.push([g, sd, k]); }
    } else if (kind === 'bat') {
      body.position.y = 0.9; mesh(new T.SphereGeometry(0.3, 7, 6), fur, 0, 0, 0, body).scale.set(1, 1.1, 1.2); head.position.set(0, 0.16, 0.32); body.add(head); mesh(new T.SphereGeometry(0.2, 7, 5), fur, 0, 0, 0, head);
      [-1, 1].forEach(sd => { mesh(new T.ConeGeometry(0.08, 0.26, 4), fur, sd * 0.12, 0.2, -0.02, head); const e = new T.Mesh(new T.SphereGeometry(0.035, 5, 4), eye); e.position.set(sd * 0.08, 0.02, 0.17); head.add(e); mesh(new T.ConeGeometry(0.02, 0.08, 3), pale, sd * 0.04, -0.12, 0.15, head).rotation.x = Math.PI; });
      wings = [-1, 1].map(sd => { const g = new T.Group(); g.position.set(sd * 0.2, 0.08, 0); body.add(g); const mem = new T.MeshLambertMaterial({ color: 0x1e1626, flatShading: true, side: T.DoubleSide }); mem.emissive = new T.Color(0); mem.userData.e = mem.emissive.clone(); mats.push(mem);
        const sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(sd * 1.15, 0.2); sh.lineTo(sd * 0.95, -0.25); sh.lineTo(sd * 0.65, -0.1); sh.lineTo(sd * 0.45, -0.38); sh.lineTo(sd * 0.22, -0.15); sh.lineTo(0, -0.3); const w = new T.Mesh(new T.ShapeGeometry(sh), mem); w.rotation.x = -Math.PI / 2; w.castShadow = true; g.add(w); box(1.15, 0.03, 0.03, fur, sd * 0.57, 0.01, -0.1, g).rotation.y = sd * -0.17; return [g, sd]; });
    } else {
      const bear = kind !== 'wolf', L = bear ? 0.95 : 0.9, Wd = bear ? 0.62 : 0.36, H = bear ? 0.6 : 0.4, y0 = bear ? 0.72 : 0.6;
      box(Wd, H, L, fur, 0, y0, -0.05, body); if (bear) mesh(new T.SphereGeometry(0.36, 7, 5), fur, 0, y0 + 0.22, 0.18, body).scale.set(1, 0.8, 1.1); else box(Wd * 0.8, H * 0.5, 0.3, dark, 0, y0 + 0.16, 0.12, body);
      head.position.set(0, y0 + (bear ? 0.08 : 0.16), L / 2 + 0.02); body.add(head); box(bear ? 0.44 : 0.3, bear ? 0.38 : 0.28, bear ? 0.36 : 0.3, fur, 0, 0, 0.1, head); box(bear ? 0.22 : 0.16, bear ? 0.16 : 0.12, bear ? 0.2 : 0.26, bear ? M(0x8a6a4a) : fur, 0, -0.06, bear ? 0.34 : 0.36, head); box(0.08, 0.06, 0.04, dark, 0, -0.02, bear ? 0.45 : 0.5, head);
      jaw = box(bear ? 0.2 : 0.14, 0.05, bear ? 0.18 : 0.24, dark, 0, -0.15, bear ? 0.33 : 0.35, head);
      [-1, 1].forEach(sd => { if (bear) mesh(new T.SphereGeometry(0.08, 5, 4), fur, sd * 0.18, 0.2, 0.02, head); else mesh(new T.ConeGeometry(0.06, 0.18, 4), fur, sd * 0.1, 0.2, 0.02, head); const e = new T.Mesh(new T.SphereGeometry(0.03, 5, 4), eye); e.position.set(sd * (bear ? 0.12 : 0.09), 0.05, bear ? 0.29 : 0.26); head.add(e); mesh(new T.ConeGeometry(0.02, 0.07, 3), pale, sd * 0.05, -0.12, bear ? 0.4 : 0.44, head).rotation.x = Math.PI; });
      [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(q => { const g = new T.Group(); g.position.set(q[0] * Wd * 0.38, y0 - H * 0.3, q[1] * L * 0.34 - 0.05); body.add(g); const ll = y0 - H * 0.3; box(bear ? 0.22 : 0.12, ll, bear ? 0.24 : 0.14, fur, 0, -ll / 2, 0, g); box(bear ? 0.26 : 0.14, 0.08, bear ? 0.32 : 0.2, dark, 0, -ll + 0.04, 0.05, g); legs.push([g, q[0], q[1]]); });
      tail = new T.Group(); tail.position.set(0, y0 + H * 0.3, -L / 2 - 0.05); body.add(tail); if (bear) mesh(new T.SphereGeometry(0.1, 5, 4), fur, 0, 0, -0.04, tail); else { const t = box(0.1, 0.1, 0.5, fur, 0, -0.06, -0.24, tail); t.rotation.x = 0.5; }
    }
    if (glow) gfx.glow(glow, 3.2, 0, 1.0, 0, body, 0.4);
    const C = { root, body, mats, height: 1.4, limbs: {}, beast: kind, sever: () => null };
    C.pose = function (p) {
      const t = p.t || 0, act = p.act || 'idle', mv = p.moving && act !== 'ko', k = Math.max(0, Math.min(1, p.prog || 0)), sw = mv ? Math.sin(p.walk * 1.6) : 0;
      root.position.y = p.y || 0; body.rotation.set(0, 0, 0); if (kind !== 'bat') body.position.y = mv ? Math.abs(Math.cos(p.walk * 1.6)) * 0.06 : Math.sin(t * 2.2) * 0.015; body.position.z = 0;
      if (kind === 'spider') legs.forEach(q => { q[0].rotation.z = Math.sin((mv ? p.walk * 2.2 : t * 1.2) + q[2] * 1.6 + (q[1] > 0 ? 0 : 1.5)) * (mv ? 0.3 : 0.05) * q[1]; });
      else if (kind === 'bat') { const f = Math.sin(t * 13) * 0.75; wings.forEach(w => { w[0].rotation.z = w[1] * f; }); body.position.y = 0.9 + Math.sin(t * 3) * 0.1; body.rotation.x = mv ? 0.35 : 0.1; }
      else { legs.forEach(q => { q[0].rotation.x = sw * 0.7 * q[1] * q[2]; }); if (tail) tail.rotation.y = Math.sin(t * 5) * 0.3; }
      head.rotation.set(0, 0, 0); if (jaw) jaw.rotation.x = 0;
      if (act === 'swing' || act === 'lunge') { const w = k < 0.5 ? k / 0.5 : 1 - (k - 0.5) / 0.5, cock = k < 0.3 ? k / 0.3 : 0, hit = k < 0.3 ? 0 : Math.sin(Math.min(1, (k - 0.3) / 0.4) * Math.PI);
        body.position.z = -0.18 * (k < 0.3 ? cock : 0) + 0.5 * hit; body.rotation.x = (kind === 'bear' ? -0.5 : 0.12) * (k < 0.3 ? cock : 0) + (kind === 'bear' ? 0.35 : -0.1) * hit; if (kind === 'bear' && k < 0.45) body.position.y += 0.25 * cock;
        head.rotation.x = -0.35 * cock + 0.3 * hit; if (jaw) jaw.rotation.x = 0.7 * Math.max(cock, 1 - hit) * (w > 0 ? 1 : 0); if (kind !== 'spider' && kind !== 'bat' && legs.length) { legs[0][0].rotation.x = legs[1][0].rotation.x = -1.0 * hit - 0.4 * cock; } }
      else if (act === 'stun' || act === 'kneel') { body.rotation.z = Math.sin(t * 8) * 0.12; head.rotation.x = 0.5; body.position.y -= 0.1; }
      else if (act === 'cheer') { head.rotation.x = -0.7; if (jaw) jaw.rotation.x = 0.6; }
      else if (act === 'ko') { const e = Math.min(1, k * 2.2); body.rotation.z = 1.45 * e; body.position.y = (kind === 'bat' ? 0.9 * (1 - e) : 0) + 0.25 * e; }
      else if (act === 'dodge') { body.rotation.z = Math.sin(k * Math.PI) * 0.4; body.position.y -= 0.1 * Math.sin(k * Math.PI); }
      if (p.hurt > 0) { const h = Math.min(1, p.hurt / 0.28); body.rotation.x -= 0.3 * h; body.position.z -= 0.15 * h; head.rotation.z = 0.3 * h; }
      const fl = p.flash > 0 ? Math.min(1, p.flash / 0.09) : 0, a = p.alpha == null ? 1 : p.alpha; mats.forEach(m => { m.emissive.copy(m.userData.e); if (fl) m.emissive.setRGB(m.userData.e.r + 0.085 * fl, m.userData.e.g + 0.06 * fl, m.userData.e.b + 0.04 * fl); m.transparent = a < 1; m.opacity = a; });
    };
    return C;
  };

  // ------------------------------------------------------------ changing shape in a bout
  const puff = (e, col) => { for (let i = 0; i < 26; i++) { const a = Math.random() * 6.28, r = Math.random() * 0.6; gfx.emit(e.x / S + Math.cos(a) * r, 0.3 + Math.random() * 1.4, e.y / S + Math.sin(a) * r, Math.cos(a) * 2.2, 1 + Math.random() * 2, Math.sin(a) * 2.2, 0.7, col, 0); } };
  G.forms = {
    FORMS,
    start: function (e, id, ab) {
      const def = FORMS[id]; if (!def) return; if (e.form) G.forms.end(e, true);
      e.form = { id, basic0: e.basic, keys: Object.keys(ab.buff || {}).filter(k => k !== 'form').concat(e.d && e.d.formBonus ? ['dmg'] : []) }; e.basic = def.basic; e.charging = 0; e.chg = 0;
      if (e.d && e.d.formBonus) { ['form', 'speed', 'dmg', 'shield'].forEach(k => { if (e.buffs[k] && ab.buff && ab.buff[k]) e.buffs[k].t += 4; }); e.buffs.dmg = { t: e.buffs.form.t, amt: (ab.buff && ab.buff.dmg ? ab.buff.dmg[1] : 0) + 0.1 }; }
      const v = e.vis; if (v && v.c && !v.human) { v.human = v.c; v.g.remove(v.c.root); const b = G.makeBeast(id === 'avatar' ? 'bear' : id, def.col, def.glow); b.root.scale.setScalar(def.scale * (e.look && e.look.scale || 1)); b.root.rotation.y = v.c.root.rotation.y; v.c = b; v.g.add(b.root); }
      puff(e, ab.color || '#ffffff'); G.sfx('buff'); if (gfx.cam) gfx.cam.shake = Math.max(gfx.cam.shake || 0, id === 'avatar' ? 0.5 : 0.2);
    },
    end: function (e, quiet) {
      const f = e.form; if (!f) return; e.basic = f.basic0; e.form = null; e.charging = 0; e.chg = 0; (f.keys || []).forEach(k => { delete e.buffs[k]; if (k === 'shield') e.shield = 0; }); if (!quiet) delete e.buffs.form;
      const v = e.vis; if (v && v.human) { v.human.root.rotation.y = v.c.root.rotation.y; v.g.remove(v.c.root); v.c = v.human; v.human = null; v.g.add(v.c.root); }
      if (!quiet) { puff(e, '#c8c0b0'); if (e.st && e.hp > 0) e.st.winded = { t: 1.2 }; }      // the change costs you a breath
    }
  };

  if (G.LORE) G.LORE.push(
    { sec: 'The Trades', title: 'Wild: the Druids', unlock: () => true, body: 'There are no forests under Highmarch, and the druids down here have never missed them. Their circles keep the old workings: the wet galleries where pale things grow, the roosts, the dens. A druid does not summon a beast. A druid becomes one, for as long as the shape can be held, and comes back out of breath. Tunnel wolf, cave bear, pit spider, great bat. The oldest of them can wear the bear the first miners painted on the walls, which was already old then.' },
    { sec: 'The Trades', title: 'Pact: the Warlocks', unlock: () => true, body: 'Sorcery is in the blood. A pact is in the ledger. Somewhere under the ninth level things are awake that were there before the mine, and they will lend power to anyone who goes down far enough to ask. Nobody who has asked will say what the terms were. They hex first, they keep their distance, and they are never quite alone in a room.' },
    { sec: 'The World', title: 'The Drow', unlock: () => true, body: 'Deep elves. Ash-grey skin, white hair, eyes like banked coals. Highmarch calls them a rumour. The Undercity calls them neighbours, carefully. They were under the mountain before the Guild lit its first lamp, and they consider every level above the sixth to be the surface.' }
  );
})();
