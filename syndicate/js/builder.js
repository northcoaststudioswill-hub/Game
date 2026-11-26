// Guttercrown — the character builder: one step at a time, everything chosen in one place, and a past and a nature that cost something.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, A = G.ABILITIES, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // [name, the good, the bad, apply]
  const BG = G.BACKGROUNDS = {
    miner: ['Old Seam Miner', '+10% health', '−5% speed', d => { d.maxHp *= 1.1; d.speed *= 0.95; }],
    deserter: ['Warden Deserter', '6% less damage taken', '−10% respect', d => { d.dr += 0.06; d.respectMul -= 0.1; }],
    cutpurse: ['Cutpurse', '+15% coin', '−6% health', d => { d.coinMul += 0.15; d.maxHp *= 0.94; }],
    acolyte: ['Chapel Acolyte', '+20% resource regeneration', '−5% damage', d => { d.regen *= 1.2; d.dmgMul -= 0.05; }],
    smelter: ['Smelter’s Hand', '+6% damage', '−10% resource regeneration', d => { d.dmgMul += 0.06; d.regen *= 0.9; }],
    debtor: ['Debtor’s Child', '+12% XP', '−10% coin, and you start with none', d => { d.xpMul += 0.12; d.coinMul -= 0.1; }],
    stairborn: ['Stairborn', '+15% respect, +40 starting coin', '−8% health', d => { d.respectMul += 0.15; d.maxHp *= 0.92; }] };
  const PERS = G.NATURES = {
    reckless: ['Reckless', '+10% damage', 'take 8% more damage', d => { d.dmgMul += 0.1; d.dr -= 0.08; }],
    patient: ['Patient', 'abilities return 10% faster', '−6% damage', d => { d.cdr += 0.1; d.dmgMul -= 0.06; }],
    showman: ['Showman', '+20% respect', 'take 4% more damage', d => { d.respectMul += 0.2; d.dr -= 0.04; }],
    cold: ['Cold', '+5% critical chance', '−10% respect', d => { d.crit += 0.05; d.respectMul -= 0.1; }],
    greedy: ['Greedy', '+15% coin', '−10% XP', d => { d.coinMul += 0.15; d.xpMul -= 0.1; }],
    stubborn: ['Stubborn', '+10% health', '−8% speed', d => { d.maxHp *= 1.1; d.speed *= 0.92; }] };
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments); if (!h) return d; if (h.bg && BG[h.bg]) BG[h.bg][3](d); if (h.pers && PERS[h.pers]) PERS[h.pers][3](d); return d; };

  // one cantrip for anybody, scaled to the class that learns it
  if (A.sacred_flame) { A.sacred_flame_c = Object.assign({}, A.sacred_flame, { name: 'Sacred Flame', cost: 12, cd: 6, dmg: [1, 8], desc: 'A cantrip. Radiance comes down on them a moment later for 1d8. It does not need a clear line.', kind: ['Cantrip', 'Damage'] }); }
  const CAN = ['fire_bolt_c', 'frost_ray_c', 'thorn_whip', 'sacred_flame_c'].filter(id => A[id]);
  Object.keys(G.CLASSES).forEach(c => CAN.forEach(id => { A[id + '_' + c] = Object.assign({}, A[id], { stat: G.CLASSES[c].primary }); }));
  G.CANTRIPS = CAN;
  // a cantrip is not offered when the class already has a move of that name (a sorcerer's own Fire Bolt, a sorcerer's Ray of Frost): it read as the same move twice
  const canFor = cls => { const C0 = G.CLASSES[cls], taken = new Set([C0.basic].concat(C0.start || [], C0.l2 || []).filter(id => A[id]).map(id => A[id].name)), ok = CAN.filter(id => !taken.has(A[id].name)); return ok.length ? ok : CAN; };
  const STEPS = [['cls', 'Class'], ['race', 'Blood'], ['bg', 'Past'], ['pers', 'Nature'], ['arts', 'Arts'], ['arm', 'Steel']];
  ui.create = function () {
    G.scene = 'create'; G.enterCreate();
    const pick = G.createPick = G.createPick || { race: 'human', cls: 'fighter', name: '', bg: 'miner', pers: 'reckless', arm: null, step: 0 }; if (pick.step == null) pick.step = 0; pick.bg = pick.bg || 'miner'; pick.pers = pick.pers || 'reckless';
    const arms = () => (G.ARMS || []).filter(w => w.cls === pick.cls && !w.deed).sort((a, b) => (a.cost || 0) - (b.cost || 0)).slice(0, 3);
    const opt = (attr, k, sel, title, good, bad) => '<button class="bopt' + (sel ? ' sel' : '') + '" data-' + attr + '="' + k + '"><b>' + title + '</b>' + (good ? '<span class="g">' + good + '</span>' : '') + (bad ? '<span class="b">' + bad + '</span>' : '') + '</button>';
    const render = () => {
      const C = G.CLASSES[pick.cls], R = G.RACES[pick.race], stats = G.baseStats(pick.cls, pick.race), T = (G.RACE_TRAIT || {})[pick.race] || ['', ''], al = arms(); if (!al.some(w => w.id === pick.arm)) pick.arm = al.length ? al[0].id : null;
      const pool = C.start.concat(C.l2 || []).filter((id, i, a) => A[id] && a.indexOf(id) === i); if (!pick.arts || pick.artsCls !== pick.cls) { pick.arts = C.start.slice(0, 2); pick.artsCls = pick.cls; pick.can = ((G.CANTRIP || {})[pick.cls]) || canFor(pick.cls)[0]; } if (!canFor(pick.cls).includes(pick.can)) pick.can = canFor(pick.cls)[0];
      const step = STEPS[pick.step][0], last = pick.step === STEPS.length - 1, can = (G.CANTRIP || {})[pick.cls];
      let h = '<div class="card create builder"><div class="bsteps">' + STEPS.map((s, i) => '<button class="' + (i === pick.step ? 'sel' : i < pick.step ? 'done' : '') + '" data-step="' + i + '">' + (i + 1) + ' · ' + s[1] + '</button>').join('') + '</div>';
      if (step === 'cls') h += '<div class="cls-grid">' + Object.keys(G.CLASSES).map(k => '<button class="cls' + (k === pick.cls ? ' sel' : '') + '" data-cls="' + k + '"><span class="cp" data-p="' + k + '"></span><b>' + G.CLASSES[k].name + '</b><small>' + G.CLASSES[k].role + '</small></button>').join('') + '</div><p class="bnote"><b>' + C.name + '.</b> ' + G.PLAY[pick.cls] + '</p><p class="bkit"><small>YOU START WITH</small> ' + [C.basic].concat(pick.arts && pick.artsCls === pick.cls ? pick.arts : C.start, pick.can && pick.artsCls === pick.cls ? [pick.can] : can ? [can] : []).filter(id => A[id]).map(id => '<span title="' + esc(A[id].desc) + '">' + A[id].name + '</span>').join('') + ' <small>· ' + C.res + '</small></p>';
      if (step === 'race') h += '<div class="bgrid">' + Object.keys(G.RACES).map(k => { const t = (G.RACE_TRAIT || {})[k] || ['', '']; return opt('race', k, k === pick.race, G.RACES[k].name, t[0] + ': ' + t[1]); }).join('') + '</div><p class="bnote">' + R.desc + '</p>';
      if (step === 'bg') h += '<p class="bnote">What you were before the debt. One thing it gave you, one thing it cost.</p><div class="bgrid">' + Object.keys(BG).map(k => opt('bg', k, k === pick.bg, BG[k][0], BG[k][1], BG[k][2])).join('') + '</div>';
      if (step === 'pers') h += '<p class="bnote">How you fight when nobody is telling you how.</p><div class="bgrid">' + Object.keys(PERS).map(k => opt('pers', k, k === pick.pers, PERS[k][0], PERS[k][1], PERS[k][2])).join('') + '</div>';
      if (step === 'arts') h += '<p class="bnote">Choose <b>two</b> to start with (' + pick.arts.length + ' of 2). The ones you leave can be learned as you level.</p><div class="bgrid">' + pool.map(id => opt('art', id, pick.arts.includes(id), A[id].name, A[id].desc)).join('') + '</div><p class="bnote">And <b>one cantrip</b>: weak, slow to come back, but it reaches.</p><div class="bgrid">' + canFor(pick.cls).map(id => opt('can', id, id === pick.can, A[id].name, A[id].desc.replace(/^A cantrip\. /, ''))).join('') + '</div>';
      if (step === 'arm') h += '<p class="bnote">The Guild lends you one. After this, new steel is the Fence’s business.</p><div class="bgrid one">' + al.map(w => opt('arm', w.id, w.id === pick.arm, w.name, w.blurb || (A[w.id] || {}).desc || '')).join('') + '</div><input id="nm" maxlength="16" placeholder="Name your fighter" value="' + esc(pick.name) + '">';
      h += '<div class="bsum"><div class="stats mini">' + G.STATS.map(s => '<div class="stat' + (s === C.primary ? ' prim' : '') + '"><small>' + s.toUpperCase() + '</small><b>' + stats[s] + '</b></div>').join('') + '</div><p>' + [R.name + ' ' + C.name, BG[pick.bg][0], PERS[pick.pers][0], pick.arm && G.ARM_BY[pick.arm] ? G.ARM_BY[pick.arm].name : ''].filter(Boolean).join(' · ') + '</p></div>';
      h += '<div class="row end">' + (pick.step > 0 ? '<button id="bk">Back</button>' : '') + (last ? '' : '<button id="go" class="quiet">Skip and enter</button><button class="big" id="nx">Next: ' + STEPS[pick.step + 1][1] + '</button>') + (last ? '<button class="big" id="go">Enter the Undercity</button>' : '') + '</div></div>';
      show(h, 'right'); G.setPreview({ cls: pick.cls, race: pick.race, arm: pick.arm || G.CLASSES[pick.cls].basic, gear: { weapon: 0, armor: 0 } });
      document.querySelectorAll('#panel .cp').forEach(el => el.appendChild(G.portrait({ cls: el.dataset.p, race: pick.race }, 54)));
      const nm = document.querySelector('#panel #nm'); if (nm) nm.oninput = () => pick.name = nm.value;
      on('[data-step]', el => { pick.step = +el.dataset.step; render(); }); on('#bk', () => { pick.step--; render(); }); on('#nx', () => { pick.step++; G.sfx('ui'); render(); });
      on('[data-art]', el => { const id = el.dataset.art, i = pick.arts.indexOf(id); if (i >= 0) pick.arts.splice(i, 1); else { if (pick.arts.length >= 2) pick.arts.shift(); pick.arts.push(id); } G.sfx('ui'); render(); }); on('[data-can]', el => { pick.can = el.dataset.can; G.sfx('ui'); render(); });
      ['race', 'cls', 'bg', 'pers', 'arm'].forEach(k => on('[data-' + k + ']', el => { pick[k] = el.dataset[k]; G.sfx('ui'); render(); }));
      on('#go', () => {
        const name = (pick.name || '').trim() || G.pick(['Ash', 'Vane', 'Corvin', 'Mirel', 'Dask', 'Rook', 'Sable', 'Thorn']);
        const C0 = G.CLASSES[pick.cls]; G.state = G.newState(); const st = G.state, h2 = st.hero = G.newHero(name, pick.race, pick.cls); h2.bg = pick.bg; h2.pers = pick.pers; st.coin = pick.bg === 'debtor' ? 0 : pick.bg === 'stairborn' ? 70 : 30;
        if (pick.arm && G.ARM_BY[pick.arm]) { st.arms = {}; st.arms[pick.arm] = 1; h2.arm = pick.arm; } st.kitPicked = 1; st.kitShown = 1;
        { const arts = (pick.arts && pick.arts.length ? pick.arts : C0.start).slice(0, 2); while (arts.length < 2) { const nx = C0.start.find(id => !arts.includes(id)); if (!nx) break; arts.push(nx); } const cid = (pick.can || canFor(pick.cls)[0]) + '_' + pick.cls, can2 = A[cid] ? cid : null; h2.known = arts.concat(can2 ? [can2] : []); h2.slots = [arts[0] || null, arts[1] || null, can2]; h2.cantrip = 1; }
        G.save(); G.createPick = null; ui.hub(true);
      });
    };
    render();
  };
  // the sheet's "made of" block gains the two new lines
  if (ui.sheet) { const sh0 = ui.sheet; ui.sheet = function () { const r = sh0.apply(this, arguments), h = G.state.hero, g = document.querySelector('#panel .made-g'); if (g && h) { [[h.bg, BG, 'PAST'], [h.pers, PERS, 'NATURE']].forEach(q => { const e = q[0] && q[1][q[0]]; if (!e) return; const sp = document.createElement('span'); sp.innerHTML = '<small>' + q[2] + '</small><b>' + e[0] + '</b><i>' + e[1] + ' · ' + e[2] + '</i>'; g.appendChild(sp); }); } return r; }; }
  // before a bout: no control lists at all (they are in the pause menu), and what you have not prepared is one line, not a grid of blanks
  const pf0 = ui.prefight;
  if (pf0) ui.prefight = function () { const r = pf0.apply(this, arguments), card = document.querySelector('#panel .card'); if (!card) return r;
    card.querySelectorAll('.keys').forEach(k => k.remove());
    const prep = card.querySelector('.prep'); if (prep) { const off = [...prep.querySelectorAll('.pc:not(.on)')], names = off.map(e => (e.querySelector('small') || {}).textContent).filter(Boolean); off.forEach(e => e.remove()); if (names.length) { const p = document.createElement('p'); p.className = 'dim prep-off'; p.textContent = 'Not prepared: ' + names.join(', ') + '.'; prep.parentNode.insertBefore(p, prep.nextSibling); } if (!prep.children.length) prep.remove(); }
    if ((G.state.boutN || 0) < 1 && !card.querySelector('.keys-hint')) { const p = document.createElement('p'); p.className = 'dim keys-hint'; p.textContent = G.input && G.input.touch ? 'The ☰ button pauses and shows the controls.' : 'Controls are in the pause menu: Esc, or Menu on a controller.'; const end = card.querySelector('.row.end'); if (end) end.parentNode.insertBefore(p, end); }
    return r; };
})();
