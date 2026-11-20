// Guttercrown — the edge: five pips under your stamina that fill a different way for every calling, and pay out a different way
(function () {
  'use strict';
  const G = window.G, ui = G.ui, MAX = 5;
  const melee = ab => ab.type === 'melee' && !ab.spell, spell = ab => ab.spell || ab.type === 'proj' || ab.type === 'aoe' || ab.type === 'line';
  const E = G.EDGE = {
    fighter: { name: 'Momentum', col: '#e0b040', desc: 'Every blow that lands adds one. Taking a blow loses one. Each pip is +4% damage; at five the next ability or heavy blow is a Crushing Blow that knocks them flat.' },
    rogue: { name: 'Openings', col: '#9fe8ff', desc: 'A perfect dodge or a parry adds two; a blow lands for one, or two from the side or behind. At five your next blow is a guaranteed critical.' },
    sorcerer: { name: 'Overcharge', col: '#ff8a2a', desc: 'Every spell adds one. At five the next spell is Overcharged for +45% damage.' },
    cleric: { name: 'Devotion', col: '#ffe08a', desc: 'Every blow that lands adds one. At five the Light answers: you heal a tenth of your health and take a ward.' },
    druid: { name: 'Wild Bond', col: '#8fd66a', desc: 'Every blow that lands adds one. At five your next blow roots them to the spot for a second and a half.' },
    warlock: { name: 'Debt', col: '#b070ff', desc: 'Every spell adds one, and each pip is +3% damage. At five your next blow collects: you heal half of what it deals.' }
  };
  const api = () => G.fight.edgeApi, clsOf = e => (e && E[e.cls]) ? e.cls : null, lvOf = e => e && e.isPlayer && G.state && G.state.hero ? (G.state.hero.edgeLv || 0) : e && e.level >= 7 ? 1 : 0, big = e => lvOf(e) >= 2 ? 1.5 : 1;
  const add = (e, n) => { const c = clsOf(e); if (!c || G.fight.ex) return; const was = e.edge || 0; e.edge = Math.max(0, Math.min(MAX, was + n)); if (e.edge === MAX && was < MAX) { const X = api(); X.text(e, E[c].name.toUpperCase() + ' READY', E[c].col, true); G.sfx('buff'); } };
  G.edge = {
    gain(e, why) { const c = clsOf(e); if (!c) return; if (why === 'cast' && (c === 'sorcerer' || c === 'warlock')) add(e, 1); if ((why === 'dodge' || why === 'parry') && c === 'rogue') add(e, 2); },
    pre(att, tgt, ab) { const c = clsOf(att); if (!c) return null; const n = att.edge || 0, full = n >= MAX, r = { mul: 1 };
      const B = big(att); if (c === 'fighter') { r.mul = 1 + n * 0.04; if (full && (ab.heavy || !ab.basic)) { r.mul *= 1 + 0.4 * B; r.pay = 'crush'; } }
      if (c === 'rogue' && full) { r.crit = true; r.pay = 'open'; if (B > 1) r.mul = 1.25; }
      if (c === 'sorcerer' && full && spell(ab)) { r.mul = 1 + 0.45 * B; r.pay = 'over'; }
      if (c === 'warlock') { r.mul = 1 + n * 0.03; if (full) r.pay = 'collect'; }
      if (c === 'druid' && full) r.pay = 'root';
      return r; },
    post(att, tgt, ab, dmg, r) { const X = api(), ca = clsOf(att), ct = clsOf(tgt); if (!X) return;
      if (ct === 'fighter') add(tgt, -1);
      if (r && r.pay) { att.edge = 0; const col = E[ca].col;
        if (r.pay === 'crush') { X.text(tgt, 'CRUSHING BLOW', col, true); X.knockdown(tgt, 0.9 * big(att)); G.sfx('bigcrit'); }
        if (r.pay === 'open') X.text(tgt, 'OPENED', col, true);
        if (r.pay === 'over') { X.text(tgt, 'OVERCHARGED', col, true); G.sfx('fire'); }
        if (r.pay === 'collect') { X.heal(att, dmg * 0.5 * big(att)); X.text(att, 'COLLECTED', col, true); }
        if (r.pay === 'root') { tgt.st = tgt.st || {}; tgt.st.stun = { t: 1.5 * big(att) }; X.text(tgt, 'ROOTED', col, true); G.sfx('vent'); }
        return; }
      if (!ca) return;
      if (ca === 'fighter' && melee(ab)) add(att, 1);
      if (ca === 'rogue' && melee(ab)) { const a = Math.atan2(att.y - tgt.y, att.x - tgt.x), d = Math.abs(Math.atan2(Math.sin(a - tgt.aim), Math.cos(a - tgt.aim))); add(att, d > 1.2 ? 2 : 1); }
      if (ca === 'cleric' && melee(ab)) { add(att, 1); if ((att.edge || 0) >= MAX) { att.edge = 0; X.heal(att, att.maxHp * 0.1 * big(att)); X.setBuff(att, 'shield', 5, Math.round(att.maxHp * 0.08)); att.shield = Math.max(att.shield || 0, Math.round(att.maxHp * 0.08)); X.text(att, 'BLESSED', E.cleric.col, true); G.sfx('holy'); } }
      if (ca === 'druid' && (melee(ab) || ab.beast)) add(att, 1); }
  };
  // the pips on the bout's HUD, under each fighter's stamina
  const pip = (el, e) => { if (!el || !e) return; let p = el.querySelector('.edge'); const c = clsOf(e); if (!c) { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('div'); p.className = 'edge'; p.innerHTML = '<b></b>' + '<i></i>'.repeat(MAX); const rs = el.querySelector('.pz') || el.querySelector('.res'); if (!rs) return; rs.parentNode.insertBefore(p, rs.nextSibling); }
    p.querySelector('b').textContent = E[c].name; p.style.setProperty('--ec', E[c].col); const n = e.edge || 0; p.querySelectorAll('i').forEach((q, i) => q.classList.toggle('on', i < n)); p.classList.toggle('full', n >= MAX); };
  const fs0 = G.fight.start; G.fight.start = function () { const r = fs0.apply(this, arguments), F = G.fight; [F.P, F.E].forEach(e => { if (e && clsOf(e) && lvOf(e) >= 1) e.edge = 2; }); return r; };
  setInterval(() => { const F = G.fight; if (!F || !F.active || F.ex) return; pip(document.getElementById('hudP'), F.P); pip(document.getElementById('hudE'), F.E); }, 100);
  // the Character page says what yours does
  const TIERS = [null, { name: 'Ready', lvl: 3, cost: 150, desc: 'Start every bout with two pips already lit.' }, { name: 'Deep', lvl: 6, cost: 400, desc: 'Every payout is half again as big: longer knockdowns and roots, bigger heals and hits.' }];
  const sh0 = ui.sheet; if (sh0) ui.sheet = function () { const r = sh0.apply(this, arguments), st = G.state, h = st && st.hero, ed = h && E[h.cls], card = document.querySelector('#panel .card'); if (!ed || !card || card.querySelector('.edge-note')) return r; const lv = h.edgeLv || 0, nx = TIERS[lv + 1];
    const pane = card.querySelector('[data-pane="char"]') || card, d = document.createElement('div'); d.className = 'edge-note';
    d.innerHTML = '<h3>' + ed.name + (lv ? ' <span class="dim">· ' + TIERS[lv].name + '</span>' : '') + '</h3><p class="dim">' + ed.desc + '</p>' + TIERS.slice(1).map((t, i) => '<div class="edge-tier' + (lv > i ? ' got' : '') + '"><b>' + t.name + '</b><small>' + t.desc + '</small>' + (lv > i ? '<em>Yours</em>' : lv === i ? (h.level < t.lvl ? '<em>Level ' + t.lvl + '</em>' : '<button class="mini" data-edge="' + (i + 1) + '"' + (st.coin < t.cost ? ' disabled' : '') + '>' + t.cost + ' coin</button>') : '<em>Later</em>') + '</div>').join('');
    pane.appendChild(d); d.querySelectorAll('[data-edge]').forEach(bt => bt.onclick = () => { const t = TIERS[+bt.dataset.edge]; if (st.coin < t.cost) return; st.coin -= t.cost; h.edgeLv = +bt.dataset.edge; G.save(); G.sfx('level'); ui.topbar && ui.topbar(); ui.sheet(); const g = document.querySelector('[data-go=char]'); if (g) g.click(); }); return r; };
})();
