// Guttercrown — the edge: five pips under your stamina that fill a different way for every calling, and pay out a different way
(function () {
  'use strict';
  const G = window.G, ui = G.ui, MAX = 5;
  const melee = ab => ab.type === 'melee' && !ab.spell, spell = ab => ab.spell || ab.type === 'proj' || ab.type === 'aoe' || ab.type === 'line';
  const E = G.EDGE = {
    fighter: { name: 'Momentum', col: '#e0b040', desc: 'Every blow that lands adds one. Taking a blow loses one. Each pip is +6% damage; at five the next ability or heavy blow is a Crushing Blow that knocks them flat.' },
    rogue: { name: 'Openings', col: '#9fe8ff', desc: 'A perfect dodge or a parry adds two; a blow lands for one, or two from the side or behind. At five your next blow is a guaranteed critical.' },
    sorcerer: { name: 'Overcharge', col: '#ff8a2a', desc: 'Every spell adds one. At five the next spell is Overcharged for +60% damage.' },
    cleric: { name: 'Devotion', col: '#ffe08a', desc: 'Every blow that lands adds one. At five the Light answers: you heal a tenth of your health and take a ward.' },
    druid: { name: 'Wild Bond', col: '#8fd66a', desc: 'Every blow that lands adds one. At five your next blow roots them to the spot for a second and a half.' },
    warlock: { name: 'Debt', col: '#b070ff', desc: 'Every spell adds one, and each pip is +5% damage. At five your next blow collects: you heal half of what it deals.' }
  };
  const api = () => G.fight.edgeApi, clsOf = e => (e && E[e.cls]) ? e.cls : null;
  const add = (e, n) => { const c = clsOf(e); if (!c || G.fight.ex) return; const was = e.edge || 0; e.edge = Math.max(0, Math.min(MAX, was + n)); if (e.edge === MAX && was < MAX) { const X = api(); X.text(e, E[c].name.toUpperCase() + ' READY', E[c].col, true); G.sfx('buff'); } };
  G.edge = {
    gain(e, why) { const c = clsOf(e); if (!c) return; if (why === 'cast' && (c === 'sorcerer' || c === 'warlock')) add(e, 1); if ((why === 'dodge' || why === 'parry') && c === 'rogue') add(e, 2); },
    pre(att, tgt, ab) { const c = clsOf(att); if (!c) return null; const n = att.edge || 0, full = n >= MAX, r = { mul: 1 };
      if (c === 'fighter') { r.mul = 1 + n * 0.06; if (full && (ab.heavy || !ab.basic)) { r.mul *= 1.4; r.pay = 'crush'; } }
      if (c === 'rogue' && full) { r.crit = true; r.pay = 'open'; }
      if (c === 'sorcerer' && full && spell(ab)) { r.mul = 1.6; r.pay = 'over'; }
      if (c === 'warlock') { r.mul = 1 + n * 0.05; if (full) r.pay = 'collect'; }
      if (c === 'druid' && full) r.pay = 'root';
      return r; },
    post(att, tgt, ab, dmg, r) { const X = api(), ca = clsOf(att), ct = clsOf(tgt); if (!X) return;
      if (ct === 'fighter') add(tgt, -1);
      if (r && r.pay) { att.edge = 0; const col = E[ca].col;
        if (r.pay === 'crush') { X.text(tgt, 'CRUSHING BLOW', col, true); X.knockdown(tgt, 0.9); G.sfx('bigcrit'); }
        if (r.pay === 'open') X.text(tgt, 'OPENED', col, true);
        if (r.pay === 'over') { X.text(tgt, 'OVERCHARGED', col, true); G.sfx('fire'); }
        if (r.pay === 'collect') { X.heal(att, dmg * 0.5); X.text(att, 'COLLECTED', col, true); }
        if (r.pay === 'root') { tgt.st = tgt.st || {}; tgt.st.stun = { t: 1.5 }; X.text(tgt, 'ROOTED', col, true); G.sfx('vent'); }
        return; }
      if (!ca) return;
      if (ca === 'fighter' && melee(ab)) add(att, 1);
      if (ca === 'rogue' && melee(ab)) { const a = Math.atan2(att.y - tgt.y, att.x - tgt.x), d = Math.abs(Math.atan2(Math.sin(a - tgt.aim), Math.cos(a - tgt.aim))); add(att, d > 1.2 ? 2 : 1); }
      if (ca === 'cleric' && melee(ab)) { add(att, 1); if ((att.edge || 0) >= MAX) { att.edge = 0; X.heal(att, att.maxHp * 0.1); X.setBuff(att, 'shield', 5, Math.round(att.maxHp * 0.08)); att.shield = Math.max(att.shield || 0, Math.round(att.maxHp * 0.08)); X.text(att, 'BLESSED', E.cleric.col, true); G.sfx('holy'); } }
      if (ca === 'druid' && (melee(ab) || ab.beast)) add(att, 1); }
  };
  // the pips on the bout's HUD, under each fighter's stamina
  const pip = (el, e) => { if (!el || !e) return; let p = el.querySelector('.edge'); const c = clsOf(e); if (!c) { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('div'); p.className = 'edge'; p.innerHTML = '<b></b>' + '<i></i>'.repeat(MAX); const rs = el.querySelector('.pz') || el.querySelector('.res'); if (!rs) return; rs.parentNode.insertBefore(p, rs.nextSibling); }
    p.querySelector('b').textContent = E[c].name; p.style.setProperty('--ec', E[c].col); const n = e.edge || 0; p.querySelectorAll('i').forEach((q, i) => q.classList.toggle('on', i < n)); p.classList.toggle('full', n >= MAX); };
  setInterval(() => { const F = G.fight; if (!F || !F.active || F.ex) return; pip(document.getElementById('hudP'), F.P); pip(document.getElementById('hudE'), F.E); }, 100);
  // the Character page says what yours does
  const sh0 = ui.sheet; if (sh0) ui.sheet = function () { const r = sh0.apply(this, arguments), h = G.state && G.state.hero, ed = h && E[h.cls], card = document.querySelector('#panel .card'); if (ed && card && !card.querySelector('.edge-note')) { const pane = card.querySelector('[data-pane="char"]') || card; const d = document.createElement('div'); d.className = 'edge-note'; d.innerHTML = '<h3>' + ed.name + '</h3><p class="dim">' + ed.desc + '</p>'; pane.appendChild(d); } return r; };
})();
