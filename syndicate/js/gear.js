// Guttercrown — the gear ladder: kits you can see, sets that reward a matched outfit, top-rung pieces you earn, and saved builds
(function () {
  const G = window.G, T = THREE, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), esc = G.esc || (x => x);
  if (!G.KITS) return;

  // ------------------------------------------------------------ new pieces at the top and bottom of the ladder
  G.KIT_BY.issue.mods = { hp: -0.05 }; G.KIT_BY.issue.desc = 'What they handed you. It fits nobody, and it shows: a little less between you and the blade.';
  const K = (id, name, cost, rank, mods, tint, vis, desc, x) => { const k = Object.assign({ id, name, cost, rank, mods, tint, vis, desc }, x); G.KITS.push(k); G.KIT_BY[id] = k; return k; };
  K('ashcloak', 'Raider’s Ashcloak', 520, 3, { speed: 0.08, hp: 0.05, coin: 0.1 }, { armor: '#3a3430', armor2: '#221e1c', cloth: '#4a4038', trim: '#c8552a', legs: '#2a2624' }, 1,
    'Grey with other people’s smoke. Light, quick, and it pays: everyone knows what the wearer does for a living.', { req: st => (st.raids || 0) >= 3, src: '3 expeditions' });
  K('gilded', 'Hourglass Regalia', 0, 0, { regen: 0.15, dr: 0.05, parry: 0.03, heal: 0.1 }, { armor: '#2a1a3a', armor2: '#160c22', cloth: '#3a1f5a', trim: '#f0c95a', legs: '#1a1024' }, 1,
    'Cut by the Oracle’s own tailor, who has been dead for some time. Purple so dark it is nearly black, and far too much gold.', { wg: 4, src: 'The Oracle · 4 wizard gold' });
  K('crownguard', 'Crownbearer’s Mail', 900, 5, { dr: 0.1, poise: 25, respect: 0.1, hp: 0.05 }, { armor: '#5a4a2a', armor2: '#2e2616', cloth: '#6a1220', trim: '#ffd36b', legs: '#2a2420' }, 2,
    'Made for whoever holds the Guttercrown, and re-cut for each of them. The fur is real. So are the dents.', { req: st => !!st.wins.vexa, src: 'Win the crown' });
  const RUNG = { issue: 0, rags: 0, leathers: 1, silks: 2, wraps: 2, chain: 2, plate: 3, warden: 3, ashcloak: 3, gilded: 4, crownguard: 4 }, RN = ['Junk', 'Common', 'Good', 'Fine', 'Awesome'], RC = ['#8a8478', '#c9c9d4', '#7fd68a', '#6ab8ff', '#f0c95a'];
  G.KIT_RUNG = RUNG; G.kitRung = id => RUNG[id] || 0;
  const rungTag = id => '<span class="rung" style="color:' + RC[G.kitRung(id)] + ';border-color:' + RC[G.kitRung(id)] + '">' + RN[G.kitRung(id)] + '</span>';
  // two charms you cannot simply buy
  const XCH = { sandglass: { name: 'Roseinbeirg Sandglass', desc: 'Abilities recover 8% faster.', fx: d => { d.cdr += 0.08; } }, crownshard: { name: 'Shard of the Guttercrown', desc: '+5% damage with everything.', fx: d => { d.dmgMul += 0.05; } } };
  const charmName = id => (XCH[id] || (G.CHARMS || []).find(c => c.id === id) || {}).name || id;

  // ------------------------------------------------------------ sets: kit + the right weapon + the right charm
  const SETS = {
    rags: { name: 'Nothing to Lose', charm: 'ratfoot', arms: { fighter: ['f_basic'], rogue: ['r_basic'], sorcerer: ['s_basic'], cleric: ['c_basic'] }, text: '+8% damage, +4% critical chance', fx: d => { d.dmgMul += 0.08; d.crit += 0.04; } },
    leathers: { name: 'Pit Runner', charm: 'bead', arms: { fighter: ['f_spear'], rogue: ['r_basic', 'r_axes'], sorcerer: ['s_spark'], cleric: ['c_basic', 'c_flail'] }, text: '+5% speed, +10% stamina recovery', fx: d => { d.speed *= 1.05; d.regen *= 1.1; } },
    silks: { name: 'The Duellist', charm: 'olddie', arms: { fighter: ['f_spear', 'f_basic'], rogue: ['r_rapier'], sorcerer: ['s_frost'], cleric: ['c_flail'] }, text: '+30 ms parry, +5% critical chance', fx: d => { d.parry = (d.parry || 0) + 0.03; d.crit += 0.05; } },
    wraps: { name: 'The Penitent', charm: 'knuckle', arms: { fighter: ['f_hammer'], rogue: ['r_axes'], sorcerer: ['s_acid', 's_frost'], cleric: ['c_pick', 'c_staff'] }, text: '+15% healing, +6% health', fx: d => { d.healMul += 0.15; d.maxHp = Math.round(d.maxHp * 1.06); } },
    chain: { name: 'Gate-Guard', charm: 'knuckle', arms: { fighter: ['f_basic', 'f_halberd'], rogue: ['r_axes'], sorcerer: ['s_frost'], cleric: ['c_basic', 'c_flail'] }, text: '+20 posture, −3% damage taken', fx: d => { d.poise = (d.poise || 0) + 20; d.dr += 0.03; } },
    plate: { name: 'Guild Enforcer', charm: 'button', arms: { fighter: ['f_axe', 'f_hammer'], rogue: ['r_chain'], sorcerer: ['s_spark'], cleric: ['c_pick'] }, text: '−4% damage taken, +6% damage', fx: d => { d.dr += 0.04; d.dmgMul += 0.06; } },
    warden: { name: 'False Warden', charm: 'button', arms: { fighter: ['f_halberd'], rogue: ['r_rapier'], sorcerer: ['s_frost'], cleric: ['c_staff', 'c_basic'] }, text: '+15% respect, +30 ms parry, +10 posture', fx: d => { d.respectMul += 0.15; d.parry = (d.parry || 0) + 0.03; d.poise = (d.poise || 0) + 10; } },
    ashcloak: { name: 'The Raider', charm: 'olddie', arms: { fighter: ['f_axe', 'f_spear'], rogue: ['r_axes', 'r_chain'], sorcerer: ['s_basic', 's_acid'], cleric: ['c_flail', 'c_pick'] }, text: '+15% coin, +5% speed, +5% damage', fx: d => { d.coinMul += 0.15; d.speed *= 1.05; d.dmgMul += 0.05; } },
    gilded: { name: 'The Oracle’s Own', charm: 'sandglass', arms: { fighter: ['f_halberd', 'f_basic'], rogue: ['r_rapier', 'r_chain'], sorcerer: ['s_spark', 's_acid'], cleric: ['c_staff'] }, text: 'abilities recover 10% faster, +15% stamina recovery, +8% damage', fx: d => { d.cdr += 0.1; d.regen *= 1.15; d.dmgMul += 0.08; } },
    crownguard: { name: 'The Guttercrown', charm: 'crownshard', arms: { fighter: ['f_axe', 'f_hammer', 'f_basic'], rogue: ['r_basic', 'r_rapier'], sorcerer: ['s_basic', 's_spark'], cleric: ['c_basic', 'c_pick'] }, text: '+10% damage, +8% health, +20 posture', fx: d => { d.dmgMul += 0.1; d.maxHp = Math.round(d.maxHp * 1.08); d.poise = (d.poise || 0) + 20; } }
  };
  G.SETS = SETS;
  const setState = (st, kitId) => { const s = SETS[kitId], h = st.hero; if (!s || !h) return null; const arm = G.armOf(h), okA = s.arms[h.cls].includes(arm), okC = st.charm === s.charm; return { s, okA, okC, on: okA && okC }; };
  G.setOf = st => { const z = st && st.hero ? setState(st, G.kitOf(st).id) : null; return z && z.on ? z.s : null; };
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments); if (st && st.hero === h) { if (XCH[st.charm]) XCH[st.charm].fx(d); const s = G.setOf(st); if (s) s.fx(d); } return d; };
  const look0 = G.lookOf;
  G.lookOf = function (h, st) { const l = look0.apply(this, arguments); if (st && st.hero === h) l.kit = G.kitOf(st).id; return l; };
  const setBlock = (st, kitId) => { const z = setState(st, kitId); if (!z) return ''; const s = z.s, tick = ok => '<b class="' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓' : '✗') + '</b> ';
    return '<div class="setbox' + (z.on && G.kitOf(st).id === kitId ? ' on' : '') + '"><small>SET</small> <b>' + s.name + '</b><p>' + tick(G.kitOf(st).id === kitId) + G.KIT_BY[kitId].name + ' · ' + tick(z.okA) + s.arms[st.hero.cls].map(a => G.ARM_BY[a].name).join(' or ') + ' · ' + tick(z.okC) + charmName(s.charm) + '</p><p class="kitmods">' + s.text + '</p></div>'; };

  // ------------------------------------------------------------ the Outfitter learns about rungs, sets and pieces that are earned
  const out0 = ui.outfitter;
  ui.outfitter = function (sel) {
    out0.apply(this, arguments); const st = G.state, card = document.querySelector('#panel .card'); if (!card || !card.querySelector('.arms')) return;
    const cur = G.kitOf(st).id, pick = G.KIT_BY[sel] || G.KIT_BY[cur], own = (st.kits || {})[pick.id];
    card.querySelectorAll('[data-kit]').forEach(b => { const k = G.KIT_BY[b.dataset.kit], sm = b.querySelector('small'); b.style.borderBottomColor = RC[G.kitRung(k.id)]; if (!(st.kits || {})[k.id] && (k.wg || (k.req && !k.req(st)))) { sm.textContent = k.src; b.classList.add('lk'); } });
    G.KITS.forEach(k => { const el = document.getElementById('kp_' + k.id); if (!el) return; const l = G.lookOf(st.hero, st); l.kit = k.id; l.tint = Object.assign({}, k.tint || {}, st.hero.tint || {}); l.gear = { weapon: (st.gear || {}).weapon || 0, armor: Math.max((st.gear || {}).armor || 0, k.vis || 0) }; l.cos = Object.assign({}, l.cos, { dye: null }); el.innerHTML = ''; el.appendChild(G.portrait(l, 84, 'full')); });
    const nm = card.querySelector('.cp-name'); if (nm) nm.innerHTML = pick.name + ' ' + rungTag(pick.id);
    const det = card.querySelector('.arm-detail'); if (det) det.insertAdjacentHTML('afterend', setBlock(st, pick.id));
    const buy = card.querySelector('#buy');
    if (!own && buy && (pick.wg || (pick.req && !pick.req(st)))) { const s = document.createElement('span'); s.className = 'lock'; s.textContent = pick.src; buy.parentNode.replaceChild(s, buy); }
  };
  // the Oracle keeps the best things in the cellar
  const or0 = ui.oracle;
  if (or0) ui.oracle = function () {
    const r = or0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end || !(st.signed || st.bound)) return r;
    const mk = (title, sub, text, btn, dis, fn) => { const e = document.createElement('div'); e.className = 'ab-row'; e.innerHTML = '<div class="ab-ic pas">♛</div><div class="ab-tx"><b>' + title + '</b><small>' + sub + '</small><p>' + text + '</p></div>' + (btn ? '<button class="big"' + (dis ? ' disabled' : '') + '>' + btn + '</button>' : '<span class="lock">Yours</span>'); end.parentNode.insertBefore(e, end); const b = e.querySelector('button'); if (b) b.onclick = fn; };
    const wg = st.wgold || 0; st.kits = st.kits || { issue: 1 }; st.xch = st.xch || {};
    mk('Hourglass Regalia', 'A kit · 4 wizard gold', G.KIT_BY.gilded.desc, st.kits.gilded ? '' : 'Take it', wg < 4, () => { if ((st.wgold || 0) < 4) return; st.wgold -= 4; st.kits.gilded = 1; st.kit = 'gilded'; G.save(); G.sfx('level'); ui.oracle('It suits you. You look almost like a person. Do not get ideas above that.'); });
    mk('Roseinbeirg Sandglass', 'A charm · 2 wizard gold · abilities recover 8% faster', 'A thumb-sized glass on a chain. The sand runs upward.', st.xch.sandglass ? (st.charm === 'sandglass' ? '' : 'Wear') : 'Take it', !st.xch.sandglass && wg < 2, () => { if (!st.xch.sandglass) { if ((st.wgold || 0) < 2) return; st.wgold -= 2; st.xch.sandglass = 1; } st.charm = 'sandglass'; G.save(); G.sfx('place'); ui.oracle('Wear it where the cattle can see it. I want them to know whose you are.'); });
    return r;
  };
  // the crown's shard: at the charm seller once you hold it
  const ch0 = ui.charms;
  if (ch0) ui.charms = function () {
    const r = ch0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card:not(.locked-card)'), end = card && card.querySelector('.row.end'); if (!end || !card.querySelector('.mk-top')) return r;
    st.xch = st.xch || {}; const own = st.xch.crownshard, worn = st.charm === 'crownshard', can = !!st.wins.vexa, e = document.createElement('div'); e.className = 'ab-row' + (worn ? ' deeddone' : !own && !can ? ' lockedrow' : '');
    e.innerHTML = '<div class="ab-ic pas">✧</div><div class="ab-tx"><b>' + XCH.crownshard.name + '</b><p>' + XCH.crownshard.desc + ' A sliver of brass from the crown itself.</p></div>' + (worn ? '<span class="lock">Worn</span>' : own ? '<button class="big">Wear</button>' : can ? '<button class="big"' + (st.coin < 400 ? ' disabled' : '') + '>400 coin</button>' : '<span class="lock">Win the crown</span>');
    const b = e.querySelector('button'); if (b) b.onclick = () => { if (!own) { if (st.coin < 400) return; st.coin -= 400; st.xch.crownshard = 1; } st.charm = 'crownshard'; G.save(); G.sfx('coin'); ui.topbar(); ui.charms('That one I did not make. Nobody made it. It was broken off.'); };
    end.parentNode.insertBefore(e, end); return r;
  };

  // ------------------------------------------------------------ builds: three saved outfits and loadouts
  const snap = st => ({ slots: st.hero.slots.slice(), arm: G.armOf(st.hero), kit: G.kitOf(st).id, charm: st.charm || null });
  const describe = (st, b) => G.ARM_BY[b.arm].name + ' · ' + G.KIT_BY[b.kit].name + (b.charm ? ' · ' + charmName(b.charm) : '') + '<br>' + b.slots.filter(Boolean).map(id => (G.ABILITIES[id] || {}).name).join(', ');
  ui.builds = function (msg) {
    const st = G.state, h = st.hero; st.builds = st.builds || [null, null, null]; const now = snap(st), set = G.setOf(st);
    let s = '<div class="card small"><h2>Builds</h2><p class="dim">Save what you are carrying and wearing, and call it back before a bout. Three pages in the Guildmaster’s book.</p>' + (msg ? '<p class="rankup">' + msg + '</p>' : '') +
      '<div class="ab-row deeddone"><div class="ab-ic pas">★</div><div class="ab-tx"><b>As you stand</b><p>' + describe(st, now) + (set ? '<br><span class="setname">Set: ' + set.name + '</span>' : '') + '</p></div></div>';
    st.builds.forEach((b, i) => { s += '<div class="ab-row"><div class="ab-ic pas">' + (i + 1) + '</div><div class="ab-tx"><b>' + (b ? esc(b.name) : 'Empty page') + '</b><p>' + (b ? describe(st, b) : 'Nothing written here yet.') + '</p></div><div class="bbtns">' + (b ? '<button class="big" data-load="' + i + '">Use</button>' : '') + '<button data-save="' + i + '">' + (b ? 'Overwrite' : 'Save here') + '</button></div></div>'; });
    show(s + '<div class="row end"><button class="big" id="x">Back</button></div></div>');
    on('#x', () => ui.sheet());
    on('[data-save]', el => { const i = +el.dataset.save, set2 = G.setOf(st); st.builds[i] = Object.assign({ name: set2 ? set2.name : G.ARM_BY[now.arm].name + ' build' }, now); G.save(); G.sfx('place'); ui.builds('Written on page ' + (i + 1) + '.'); });
    on('[data-load]', el => { const b = st.builds[+el.dataset.load], miss = [];
      if (G.armOwned(st, G.ARM_BY[b.arm])) h.arm = b.arm; else miss.push(G.ARM_BY[b.arm].name);
      if ((st.kits || {})[b.kit] || b.kit === 'issue') st.kit = b.kit; else miss.push(G.KIT_BY[b.kit].name);
      if (!b.charm || (st.charms || {})[b.charm] || (st.xch || {})[b.charm]) st.charm = b.charm; else miss.push(charmName(b.charm));
      const sl = b.slots.map(id => id && h.known.includes(id) ? id : null); if (sl.some(Boolean)) h.slots = sl;
      G.save(); G.sfx('place'); if (G.world.walker) G.world.walker.key = ''; ui.topbar(); ui.builds(miss.length ? 'Used, except what you no longer have: ' + miss.join(', ') + '.' : '“' + esc(b.name) + '” it is.'); });
  };
  const sheet0 = ui.sheet;
  ui.sheet = function () {
    sheet0.apply(this, arguments); const st = G.state, ft = document.querySelector('#panel .card .row.end:last-child'); if (!ft) return;
    const b = document.createElement('button'); b.textContent = 'Builds'; b.onclick = () => { G.sfx('ui'); ui.builds(); }; ft.insertBefore(b, ft.firstChild);
    const set = G.setOf(st), z = setState(st, G.kitOf(st).id), dv = document.querySelector('#panel .card .derived');
    if (dv && z) dv.insertAdjacentHTML('afterend', '<p class="setline' + (set ? ' on' : '') + '">' + (set ? 'Set worn: <b>' + set.name + '</b> · ' + set.text : 'Set <b>' + z.s.name + '</b> is incomplete. The Outfitter can tell you what it wants.') + '</p>');
  };

  // ------------------------------------------------------------ what each kit looks like on the body
  G.kitModel = function (id, p) {
    const { torso, head, armL, armR, foreL, foreR, legL, legR, m, w, box, mesh, M } = p, sx = w / 2 + 0.11;
    const pauldron = (sd, r, mat) => { const q = mesh(new T.SphereGeometry(r, 7, 5), mat, sd * (w / 2 + 0.07), 0.66, 0, torso); q.scale.set(1.05, 0.72, 1.1); return q; };
    if (id === 'issue') { box(0.16, 0.12, 0.03, M(0x6a5a44), -w * 0.2, 0.3, 0.225, torso); }                                                     // one mismatched patch
    else if (id === 'rags') { const rag = M(0x6a5a44), rope = M(0xa89060);
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, s = box(0.14, 0.26 + (i % 3) * 0.1, 0.03, rag, Math.sin(a) * w * 0.42, -0.2 - (i % 3) * 0.04, Math.cos(a) * 0.2, torso); s.rotation.y = a; s.rotation.z = (i % 2 ? 0.14 : -0.1); }
      box(w * 0.86 + 0.05, 0.05, 0.45, rope, 0, 0.07, 0, torso); box(0.05, 0.2, 0.05, rope, w * 0.25, -0.05, 0.22, torso); box(0.2, 0.16, 0.03, M(0x4a3e30), w * 0.15, 0.42, 0.225, torso).rotation.z = 0.2; }
    else if (id === 'leathers') { const lt = M(0x3e2816), bk = m.trim;
      [-1, 1].forEach(sd => { const s = box(0.09, 0.8, 0.04, lt, 0, 0.36, 0.228, torso); s.rotation.z = sd * 0.62; }); box(0.1, 0.1, 0.03, bk, 0, 0.37, 0.25, torso);
      pauldron(1, 0.19, lt); box(0.16, 0.16, 0.1, lt, -w * 0.32, 0.02, 0.22, torso); [foreL, foreR].forEach(f => box(0.21, 0.16, 0.23, lt, 0, -0.1, 0, f)); [legL, legR].forEach(l => box(0.2, 0.12, 0.08, lt, 0, 0.0, 0.14, l.userData.shin)); }
    else if (id === 'silks') { const sash = m.trim;
      const s = box(0.13, 0.9, 0.04, sash, 0, 0.34, 0.228, torso); s.rotation.z = -0.66; box(w * 0.6, 0.2, 0.06, m.cloth, 0, 0.72, -0.2, torso);                                 // sash and a high collar
      const hc = new T.Group(); hc.position.set(w / 2 + 0.02, 0.66, -0.1); hc.rotation.set(0.25, 0, -0.2); torso.add(hc); box(0.34, 0.62, 0.04, m.cloth, 0, -0.3, -0.1, hc); box(0.36, 0.05, 0.05, sash, 0, -0.6, -0.1, hc);   // a half-cape off one shoulder
      box(0.3, 0.05, 0.3, sash, 0, 0.3, 0.02, head).rotation.z = 0.1; }
    else if (id === 'wraps') { const ln = M(0xefe6cc), rd = M(0x8a1c1c);
      [foreL, foreR].forEach(f => [-0.04, -0.12, -0.2].forEach((y, i) => { const b = box(0.2, 0.045, 0.22, ln, 0, y, 0, f); b.rotation.z = i % 2 ? 0.12 : -0.12; }));
      [legL, legR].forEach(l => [-0.05, -0.14].forEach((y, i) => { const b = box(0.235, 0.045, 0.275, ln, 0, y, 0, l.userData.shin); b.rotation.z = i % 2 ? 0.1 : -0.1; }));
      box(0.5, 0.42, 0.14, ln, 0, -0.06, -0.24, head); for (let i = 0; i < 5; i++) mesh(new T.SphereGeometry(0.035, 5, 4), rd, -0.12 + i * 0.06, 0.5 - Math.abs(i - 2) * 0.03 - 0.1, 0.235, torso); }
    else if (id === 'chain') { const ml = m.armor2;
      const sk = mesh(new T.CylinderGeometry(w * 0.52, w * 0.6, 0.3, 8, 1, true), ml, 0, -0.14, 0, torso); sk.material.side = T.DoubleSide;
      mesh(new T.CylinderGeometry(0.24, 0.3, 0.2, 8, 1, true), ml, 0, 0.74, 0, torso); [-1, 1].forEach(sd => pauldron(sd, 0.18, ml));
      [armL, armR].forEach(a => box(0.22, 0.14, 0.24, ml, 0, -0.08, 0, a)); }
    else if (id === 'plate' || id === 'crownguard') { const pl = m.armor, ed = m.trim;
      [-1, 1].forEach(sd => { pauldron(sd, 0.27, pl); const rim = mesh(new T.TorusGeometry(0.2, 0.03, 5, 10), ed, sd * (w / 2 + 0.07), 0.6, 0, torso); rim.rotation.x = Math.PI / 2; rim.scale.set(1.2, 1.2, 1);
        const ts = box(0.26, 0.3, 0.06, pl, sd * w * 0.3, -0.12, 0.2, torso); ts.rotation.x = -0.18; box(0.26, 0.04, 0.07, ed, sd * w * 0.3, -0.26, 0.225, torso); });
      mesh(new T.CylinderGeometry(0.17, 0.2, 0.14, 8), pl, 0, 0.72, 0, torso); box(0.08, 0.4, 0.06, ed, 0, 0.46, 0.225, torso);
      [foreL, foreR].forEach(f => box(0.22, 0.2, 0.24, pl, 0, -0.1, 0, f)); [legL, legR].forEach(l => box(0.25, 0.2, 0.1, pl, 0, -0.1, 0.12, l.userData.shin));
      if (id === 'plate') box(0.05, 0.2, 0.44, ed, 0, 0.36, -0.02, head);
      else { const fur = M(0x3a2c20); box(w + 0.42, 0.2, 0.52, fur, 0, 0.7, -0.04, torso); [-1, 1].forEach(sd => mesh(new T.SphereGeometry(0.17, 6, 5), fur, sd * (w / 2 + 0.16), 0.74, 0.02, torso));
        const cr = new T.Group(); cr.position.y = 0.3; head.add(cr); mesh(new T.CylinderGeometry(0.25, 0.24, 0.09, 8, 1, true), ed, 0, 0, 0, cr).material.side = T.DoubleSide; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; mesh(new T.ConeGeometry(0.045, 0.14, 4), ed, Math.sin(a) * 0.24, 0.1, Math.cos(a) * 0.24, cr); } } }
    else if (id === 'warden') { const wh = m.armor, gd = m.trim;
      [-1, 1].forEach(sd => { pauldron(sd, 0.24, wh); const wing = mesh(new T.ConeGeometry(0.1, 0.42, 4), gd, sd * (w / 2 + 0.16), 0.86, -0.04, torso); wing.rotation.z = -sd * 0.5; wing.scale.z = 0.4; });
      box(w * 0.5, 0.95, 0.04, m.cloth, 0, 0.1, 0.235, torso); box(0.07, 0.95, 0.045, gd, 0, 0.1, 0.24, torso); box(w * 0.5, 0.05, 0.05, gd, 0, -0.36, 0.24, torso);
      mesh(new T.ConeGeometry(0.07, 0.4, 5), M(0xf4f0ff), 0, 0.5, -0.1, head).rotation.x = -0.5; }
    else if (id === 'ashcloak') { const ash = M(0x3a3430), em = m.trim;
      const ck = new T.Group(); ck.position.set(0, 0.66, -0.24); ck.rotation.x = 0.14; torso.add(ck); box(w + 0.2, 1.05, 0.05, ash, 0, -0.52, 0, ck); for (let i = 0; i < 5; i++) box(0.14, 0.14 + (i % 2) * 0.1, 0.05, ash, -w / 2 + i * w / 4, -1.1 - (i % 2) * 0.05, 0, ck);
      mesh(new T.SphereGeometry(0.34, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6), ash, 0, 0.0, -0.06, head).rotation.x = -0.35; box(w * 0.7, 0.14, 0.5, ash, 0, 0.7, 0, torso); box(0.12, 0.34, 0.05, em, w * 0.22, 0.48, 0.23, torso); }
    else if (id === 'gilded') { const gd = m.trim, dk = m.cloth;
      mesh(new T.CylinderGeometry(0.34, 0.4, 0.08, 10), gd, 0, 0.7, 0, torso);                                                                        // a collar far too wide
      [0.56, 0.38].forEach((y, i) => mesh(new T.ConeGeometry(0.07, 0.11, 4), gd, 0, y - 0.05, 0.24, torso).rotation.z = i ? 0 : Math.PI); box(0.2, 0.025, 0.03, gd, 0, 0.535, 0.24, torso); box(0.2, 0.025, 0.03, gd, 0, 0.3, 0.24, torso);   // the hourglass
      [-1, 1].forEach(sd => { const ch = mesh(new T.TorusGeometry(0.16, 0.022, 5, 12), gd, sd * (w / 2 + 0.02), 0.52, 0.12, torso); ch.rotation.y = sd * 0.5; const tl = box(0.24, 0.6, 0.04, dk, sd * 0.17, -0.42, -0.2, torso); tl.rotation.x = 0.12; box(0.24, 0.04, 0.05, gd, sd * 0.17, -0.7, -0.24, torso); });
      [foreL, foreR].forEach(f => box(0.2, 0.05, 0.22, gd, 0, -0.18, 0, f)); }
  };

  if (G.LORE) G.LORE.push(
    { sec: 'How Things Work', title: 'Sets', unlock: st => !!(st.seen || {}).outfit, body: 'Every kit has a weapon it was cut for and a charm it was made to be worn with. Wear all three and the set wakes up: a second bonus on top of what the kit already gives. The Outfitter lists what each set wants. Junk has a set too, and it is better than you would think.' },
    { sec: 'How Things Work', title: 'The Ladder of Gear', unlock: st => !!(st.seen || {}).outfit, body: 'Junk, Common, Good, Fine, Awesome. Junk is what the Guild hands you and what you can strip off a beggar. Common and Good are bought. Fine is plate, a dead Warden’s harness, or a raider’s cloak earned on the road. Awesome is not for sale in the ordinary way: one piece comes with the crown, and the other from a cellar under the market, paid for in wizard gold.' },
    { sec: 'How Things Work', title: 'Builds', unlock: st => (st.builds || []).some(Boolean), body: 'The Guildmaster keeps three pages on every fighter worth the ink. Write down what you carry and wear, and you can call it back whole before a bout.' }
  );
})();
