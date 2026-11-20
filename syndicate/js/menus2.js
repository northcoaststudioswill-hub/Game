// Guttercrown — the Guildmaster's page in three tabs, and an easier Fence. Loaded after everything that adds to these
// menus, so it only rearranges what they built: every row and button keeps its own behaviour.
(function () {
  'use strict';
  const G = window.G, ui = G.ui;
  let sheetTab = 'moves';
  const TABS = [['moves', 'Moves'], ['char', 'Character'], ['build', 'Build']];

  // ---------------------------------------------------------------- the Guildmaster's page
  const sh0 = ui.sheet;
  ui.sheet = function (msg) {
    const again = !!document.querySelector('#panel .shtabs'); const r = sh0.apply(this, arguments), card = document.querySelector('#panel .card'); if (!card || !card.querySelector('.sh-top')) return r;
    if (msg || !again) sheetTab = 'moves';
    // sort what is on the page into tabs; anything before the first heading describes who you are
    const kids = [...card.children], pane = { moves: [], char: [], build: [] }; let cur = 'char', top = null, foot = null;
    kids.forEach(el => {
      if (el.classList.contains('sh-top')) { top = el; return; }
      if (el.classList.contains('foot') || (el.classList.contains('row') && el.classList.contains('end'))) { foot = el; return; }
      if (el.tagName === 'H3') { const t = el.textContent; cur = /build/i.test(t) ? 'build' : /loadout|always/i.test(t) ? 'moves' : cur; }
      if (el.classList.contains('rankup') && cur === 'char') { pane.moves.unshift(el); return; }
      pane[cur].push(el);
    });
    // the page's own learning button belongs with the moves
    const learn = foot && [...foot.querySelectorAll('button')].find(b => /learn techniques/i.test(b.textContent));
    const bar = document.createElement('div'); bar.className = 'shtabs';
    bar.innerHTML = TABS.map(t => '<button data-shtab="' + t[0] + '" class="' + (t[0] === sheetTab ? 'sel' : '') + '">' + t[1] + '</button>').join('');
    top.insertAdjacentElement('afterend', bar);
    const wraps = {}; let after = bar;
    TABS.forEach(t => { const w = document.createElement('div'); w.className = 'shpane'; w.dataset.pane = t[0]; pane[t[0]].forEach(el => w.appendChild(el)); after.insertAdjacentElement('afterend', w); after = w; wraps[t[0]] = w; });
    if (learn) { const box = document.createElement('div'); box.className = 'shlearn'; learn.classList.add('big'); box.appendChild(learn); wraps.moves.appendChild(box); }
    // loadout: one key row per move, big enough for a thumb
    wraps.moves.querySelectorAll('.ab-row .slots').forEach(s => s.classList.add('keyrow'));
    const show = k => { sheetTab = k; bar.querySelectorAll('button').forEach(b => b.classList.toggle('sel', b.dataset.shtab === k)); TABS.forEach(t => { wraps[t[0]].hidden = t[0] !== k; }); card.scrollTop = 0; };
    bar.querySelectorAll('button').forEach(b => b.onclick = () => { G.sfx('page'); show(b.dataset.shtab); });
    show(sheetTab);
    // LB / RB switch tabs on a controller
    card._tabs = d => { const i = TABS.findIndex(t => t[0] === sheetTab); show(TABS[(i + d + TABS.length) % TABS.length][0]); G.sfx('page'); };
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
    [4, 5].forEach(i => { if (now[i] && !was[i] && ui.isOpen()) { const card = document.querySelector('#panel .card'), d = i === 5 ? 1 : -1; if (card && card._tabs) card._tabs(d); else { const tabs = [...document.querySelectorAll('#panel .tl-tabs .chip')]; const k = tabs.findIndex(b => b.classList.contains('sel')); if (tabs.length) tabs[(k + d + tabs.length) % tabs.length].click(); } } });
    was = now; }, 60);
})();
