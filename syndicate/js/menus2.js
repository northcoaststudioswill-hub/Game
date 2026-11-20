// Guttercrown — the Guildmaster's page in three tabs, and an easier Fence. Loaded after everything that adds to these
// menus, so it only rearranges what they built: every row and button keeps its own behaviour.
(function () {
  'use strict';
  const G = window.G, ui = G.ui;
  let sheetTab = 'moves';
  const TABS = [['moves', 'Moves'], ['char', 'Character'], ['build', 'Build']];

  // ---------------------------------------------------------------- the Guildmaster's page: a front page of tiles, like the Fence, each opening one short page
  const A = G.ABILITIES, PAGES = { moves: 'Loadout', char: 'Character', build: 'Build' };
  const sh0 = ui.sheet;
  ui.sheet = function (msg) {
    const again = !!document.querySelector('#panel .gm-home'); const r = sh0.apply(this, arguments), card = document.querySelector('#panel .card'); if (!card || !card.querySelector('.sh-top')) return r;
    if (msg) sheetTab = 'moves'; else if (!again) sheetTab = 'home';
    const st = G.state, h = st.hero, kids = [...card.children], pane = { moves: [], char: [], build: [] }; let cur = 'char', top = null, foot = null;
    kids.forEach(el => {
      if (el.classList.contains('sh-top')) { top = el; return; }
      if (el.classList.contains('foot') || (el.classList.contains('row') && el.classList.contains('end'))) { foot = el; return; }
      if (el.tagName === 'H3') { const t = el.textContent; cur = /build/i.test(t) ? 'build' : /loadout|always/i.test(t) ? 'moves' : cur; }
      if (el.classList.contains('rankup') && cur === 'char') { pane.moves.unshift(el); return; }
      pane[cur].push(el);
    });
    const wraps = {}; let after = top;
    // the front page
    const home = document.createElement('div'); home.className = 'gm-home shpane'; home.dataset.pane = 'home';
    const fb = re => foot && [...foot.querySelectorAll('button')].find(q => re.test(q.textContent));
    const keys = G.input.usingPad ? ['LB', 'RB', 'Y'] : G.input.touch ? ['1', '2', '3'] : ['Q', 'E', 'R'];
    home.innerHTML = '<button class="gm-carry" data-go="moves"><small class="over">You carry into the pit</small><span class="gm-slots">' + [0, 1, 2].map(i => { const ab = A[(h.slots || [])[i]]; return '<span class="gm-slot' + (ab ? '' : ' none') + '"><i class="gm-ic">' + (ab ? G.icon(ab) : '') + '</i><b>' + (ab ? ab.name : 'Empty') + '</b><kbd>' + keys[i] + '</kbd></span>'; }).join('') + '</span></button>' +
      '<div class="fence-rooms gm-tiles">' +
      '<button class="fence-room" data-go="moves"><span class="fr-ic">⚔</span><b>Loadout</b><small>Choose your three moves</small></button>' +
      '<button class="fence-room" data-px="learn"><span class="fr-ic">✦</span><b>Learn</b><small>Techniques for hire</small></button>' +
      '<button class="fence-room" data-px="fin"><span class="fr-ic">☠</span><b>Finisher</b><small>Your mortal blow</small></button>' +
      '<button class="fence-room" data-go="char"><span class="fr-ic">◈</span><b>Character</b><small>Scores, blood, past' + (h.cls === 'sorcerer' || h.cls === 'warlock' ? ', ring' : '') + '</small></button>' +
      '<button class="fence-room" data-go="build"><span class="fr-ic">▲</span><b>Build</b><small>Your path by level</small></button>' +
      '<button class="fence-room" data-px="builds"><span class="fr-ic">❖</span><b>Builds</b><small>Ideas for your class</small></button>' +
      '<button class="fence-room" data-px="fallen"><span class="fr-ic">✝</span><b>The Fallen</b><small>' + ((st.fallen || []).length) + ' in the sand</small></button>' +
      '<button class="fence-room" data-px="codex"><span class="fr-ic">❧</span><b>Codex</b><small>Lore and how things work</small></button>' +
      '</div>';
    top.insertAdjacentElement('afterend', home); after = home; wraps.home = home;
    const back = document.createElement('div'); back.className = 'gm-back'; back.innerHTML = '<button id="gmback">‹ Guildmaster</button><b></b>'; home.insertAdjacentElement('afterend', back); after = back;
    Object.keys(PAGES).forEach(k => { const w = document.createElement('div'); w.className = 'shpane'; w.dataset.pane = k; pane[k].forEach(el => w.appendChild(el)); after.insertAdjacentElement('afterend', w); after = w; wraps[k] = w; });
    wraps.moves.querySelectorAll('.ab-row .slots').forEach(q => q.classList.add('keyrow'));
    // the old footer's doors are tiles now; only Done stays down there
    const PX = { learn: fb(/learn techniques/i), builds: fb(/^builds$/i), fallen: fb(/fallen/i), codex: fb(/codex/i), fin: [...wraps.moves.querySelectorAll('.ab-row')].map(rw => /mortal blow|finisher/i.test(rw.textContent) ? rw.querySelector('button') : null).find(Boolean) };
    ['learn', 'builds', 'fallen', 'codex'].forEach(k => { if (PX[k]) PX[k].style.display = 'none'; });
    home.querySelectorAll('[data-px]').forEach(t => { const b2 = PX[t.dataset.px]; if (!b2) { t.disabled = true; return; } t.onclick = () => b2.click(); });
    const show = k => { sheetTab = k; Object.keys(wraps).forEach(q => { wraps[q].hidden = q !== k; }); back.hidden = k === 'home'; back.querySelector('b').textContent = PAGES[k] || ''; card.scrollTop = 0; };
    home.querySelectorAll('[data-go]').forEach(t => t.onclick = () => { G.sfx('page'); show(t.dataset.go); });
    back.querySelector('#gmback').onclick = () => { G.sfx('page'); show('home'); };
    show(sheetTab);
    if (G.input.usingPad) { const f1 = sheetTab === 'home' ? home.querySelector('.gm-tiles button') : back.querySelector('#gmback'); if (f1) setTimeout(() => f1.focus({ preventScroll: true }), 0); }
    card._back = () => { if (sheetTab !== 'home') { G.sfx('page'); show('home'); return true; } return false; };       // B on a controller steps back to the front page first
    return r;
  };

  // ---------------------------------------------------------------- before a bout: who, what they said, what you carry, and the gate
  const pf0 = ui.prefight;
  if (pf0) ui.prefight = function (o) {
    const r = pf0.apply(this, arguments), card = document.querySelector('#panel .card.vs'); if (!card) return r; card.classList.add('pf2');
    const h = G.state.hero, foot = card.querySelector('.row.end'), q = sel => card.querySelector(sel);
    card.querySelectorAll('.ctitle, .ctab, .cmore, .keys, .keys-hint').forEach(e => e.remove()); [...card.querySelectorAll('p.dim')].forEach(e => { if (/Red marks on the floor/.test(e.textContent)) e.remove(); });
    // what you carry in
    const keys = G.input.usingPad ? ['LB', 'RB', 'Y'] : G.input.touch ? ['', '', ''] : ['Q', 'E', 'R'], carry = document.createElement('div'); carry.className = 'pf-carry';
    carry.innerHTML = '<small class="over">You carry</small><span class="gm-slots">' + [0, 1, 2].map(i => { const ab = A[(h.slots || [])[i]]; return '<span class="gm-slot' + (ab ? '' : ' none') + '"><i class="gm-ic">' + (ab ? G.icon(ab) : '') + '</i><b>' + (ab ? ab.name : 'Empty') + '</b>' + (keys[i] ? '<kbd>' + keys[i] + '</kbd>' : '') + '</span>'; }).join('') + '</span>';
    // gear: one line when it is even, the full comparison only when somebody has the edge
    const gear = q('.gearcmp'); let gline = null; if (gear && gear.classList.contains('ok')) { gline = document.createElement('p'); gline.className = 'pf-even'; gline.textContent = 'Steel and armour: evenly matched.'; gear.remove(); }
    const tip = q('p.note'); if (tip) tip.classList.add('pf-tip');
    const prep = q('.prep'), off = q('.prep-off'); let prow = null; if (prep || off) { prow = document.createElement('div'); prow.className = 'pf-prep'; if (prep) prow.appendChild(prep); if (off) prow.appendChild(off); }
    // last stop: the essentials in one tap, from whoever is open to you
    const st = G.state, B = G.BOONS || {}, bn = st.boons || (st.boons = {}), open = k => !G.unlocked || G.unlocked(k), ess = [];
    if (st.potions < G.POTION_MAX) ess.push({ id: 'pot', ic: G.icon('potion'), name: 'Potion', sub: st.potions + ' of ' + G.POTION_MAX, cost: G.POTION_COST, buy: () => { st.potions++; } });
    if (open('cook') && B.stew && !bn.meal) ess.push({ id: 'meal', ic: '♨', name: B.stew.name, sub: B.stew.desc, cost: B.stew.cost, buy: () => { bn.meal = 'stew'; } });
    if (open('apoth') && B.ironbark && !bn.tonic) ess.push({ id: 'tonic', ic: '⚗', name: B.ironbark.name, sub: B.ironbark.desc, cost: B.ironbark.cost, buy: () => { bn.tonic = 'ironbark'; } });
    let erow = null; if (ess.length && !(o && o.spar)) { erow = document.createElement('div'); erow.className = 'pf-ess'; erow.innerHTML = '<small class="over">Last stop · you have ' + st.coin + ' coin</small><div class="pf-essrow">' + ess.map(e => '<button data-ess="' + e.id + '"' + (st.coin < e.cost ? ' disabled' : '') + '><i>' + e.ic + '</i><b>' + e.name + '</b><small>' + e.sub + '</small><em>' + e.cost + ' coin</em></button>').join('') + '</div>';
      erow.querySelectorAll('[data-ess]').forEach(b => b.onclick = () => { const e = ess.find(x => x.id === b.dataset.ess); if (!e || st.coin < e.cost) return; st.coin -= e.cost; e.buy(); G.save(); G.sfx('coin'); ui.topbar(); const keepQ = [q('.quote'), q('.retort'), q('p.note')].map(x => x && x.innerHTML); ui.prefight(o); const c2 = document.querySelector('#panel .card.vs'); if (c2) ['.quote', '.retort', 'p.note'].forEach((sel, i) => { const x = c2.querySelector(sel); if (x && keepQ[i]) x.innerHTML = keepQ[i]; }); }); }
    [carry, gline || q('.gearcmp'), prow, erow, tip].forEach(el => { if (el && foot) foot.parentNode.insertBefore(el, foot); });
    return r;
  };

  // ---------------------------------------------------------------- the Fence: the three back rooms as big tiles, then what is for sale
  const shop0 = ui.shop;
  if (shop0) ui.shop = function () {
    const r = shop0.apply(this, arguments), card = document.querySelector('#panel .card'); if (!card) return r;
    const rooms = [...card.querySelectorAll('.ab-row')].filter(row => /^(The Armoury|The Outfitter|The Tailor)/.test((row.querySelector('.ab-tx b') || {}).textContent || ''));
    if (rooms.length) { const grid = document.createElement('div'); grid.className = 'fence-rooms'; rooms[0].insertAdjacentElement('beforebegin', grid);
      rooms.forEach(row => { const b = row.querySelector('button'), name = row.querySelector('.ab-tx b').textContent, sub = (row.querySelector('.ab-tx small') || {}).textContent || '', ic = (row.querySelector('.ab-ic') || {}).innerHTML || '';
        const t = document.createElement('button'); t.className = 'fence-room'; t.innerHTML = '<span class="fr-ic">' + ic + '</span><b>' + name.replace(/^The /, '') + '</b><small>' + sub + '</small>';
        if (b) { t.onclick = () => b.click(); if (b.disabled) t.disabled = true; } else { t.disabled = true; t.innerHTML += '<i>' + ((row.querySelector('.lock') || {}).textContent || 'Closed') + '</i>'; }
        grid.appendChild(t); row.style.display = 'none'; }); }
    return r;
  };

  // ---------------------------------------------------------------- the Tailor: the categories as proper tabs, the rack as a grid
  const tl0 = ui.tailor;
  if (tl0) ui.tailor = function () {
    const r = tl0.apply(this, arguments), card = document.querySelector('#panel .card'); if (!card) return r;
    const chips = card.querySelector('.tl-top .chips'); if (chips) { chips.classList.add('tl-tabs'); card.querySelector('.tl-top').insertAdjacentElement('afterend', chips); }
    const rows = [...card.children].filter(e => e.classList.contains('ab-row')); if (rows.length > 3) { const g = document.createElement('div'); g.className = 'tl-grid'; rows[0].insertAdjacentElement('beforebegin', g); rows.forEach(rw => g.appendChild(rw)); }
    return r;
  };

  // controller: LB / RB turn the Guildmaster's tabs and the Tailor's categories
  let was = {};
  setInterval(() => { let pads = []; try { pads = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { } let gp = null; for (const p of pads) if (p && p.connected) { gp = p; break; } if (!gp) return;
    const now = { 4: !!(gp.buttons[4] && gp.buttons[4].pressed), 5: !!(gp.buttons[5] && gp.buttons[5].pressed) };
    [4, 5].forEach(i => { if (now[i] && !was[i] && ui.isOpen()) { const card = document.querySelector('#panel .card'), d = i === 5 ? 1 : -1; { const tabs = [...document.querySelectorAll('#panel .tl-tabs .chip')]; const k = tabs.findIndex(b => b.classList.contains('sel')); if (tabs.length) tabs[(k + d + tabs.length) % tabs.length].click(); } } });
    was = now; }, 60);
})();
