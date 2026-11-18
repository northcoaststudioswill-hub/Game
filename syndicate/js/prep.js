// Guttercrown — preparation: the card before a bout shows what every stall and room has done for you, Whisper scouts whoever is actually next,
// the busker and Whisper reward regulars, and wizard gold has more to buy
(function () {
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  const bouts = st => Object.keys(st.wins || {}).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);
  const pat = st => st.patron || (st.patron = {}), un = k => !G.unlocked || G.unlocked(k);

  // ------------------------------------------------------------ Whisper sells whoever you will really meet next
  if (ui.whisper && G.climb) {
    const w0 = ui.whisper; let lastScout = null;
    const cw0 = ui.close; ui.close = function () { ui._whOpen = false; lastScout = null; return cw0.apply(this, arguments); };
    ui.whisper = function () {
      const st = G.state; if (!st || !st.hero || !un('whisper')) return w0.apply(this, arguments);
      const nx = G.climb.next(st), inList = G.OPPONENTS.includes(nx), had = (st.boons || {}).scout;
      if (!inList) G.OPPONENTS.unshift(nx);
      let r; try { r = w0.apply(this, arguments); } finally { if (!inList) G.OPPONENTS.shift(); }
      if (ui._whOpen && had === nx.id && lastScout !== nx.id) { pat(st).whisper = (pat(st).whisper || 0) + 1; if (pat(st).whisper === 5) setTimeout(() => ui.toast('Whisper leans closer than usual. She has started telling you the parts she keeps back.'), 500); G.save(); }
      lastScout = had; ui._whOpen = true;
      const p = document.querySelector('#panel .card:not(.locked-card) .mk-top p.dim'), n = pat(st).whisper || 0;
      if (p) p.insertAdjacentHTML('afterend', '<p class="patron">' + (n >= 5 ? 'She trusts you: a scouted fighter takes <b>15%</b> more from you, not 10%.' : 'Buy from her ' + (5 - n) + ' more time' + (5 - n === 1 ? '' : 's') + ' and she tells you the parts she keeps back.') + '</p>');
      return r;
    };
  }
  // ------------------------------------------------------------ the busker knows your song by heart
  if (ui.busker) { const b0 = ui.busker; let lastSong = null;
    ui.busker = function () { const st = G.state, had = lastSong; const r = b0.apply(this, arguments), now = (st.boons || {}).song || null;
      if (now && !had && ui._buskOpen) { pat(st).busker = (pat(st).busker || 0) + 1; if (pat(st).busker === 5) setTimeout(() => ui.toast('The busker has your song by heart now. The whole street joins in.'), 500); G.save(); }
      lastSong = now; ui._buskOpen = true; const p = document.querySelector('#panel .card:not(.locked-card) p.dim'), n = pat(st).busker || 0;
      if (p) p.insertAdjacentHTML('afterend', '<p class="patron">' + (n >= 5 ? 'He knows it by heart: the crowd starts <b>hotter still</b>.' : (5 - n) + ' more request' + (5 - n === 1 ? '' : 's') + ' and he will know it by heart.') + '</p>');
      return r; };
    const c0 = ui.close; ui.close = function () { ui._buskOpen = false; lastSong = null; return c0.apply(this, arguments); }; }
  const fs0 = G.fight.start;
  G.fight.start = function (o) {
    const st = G.state, scouted = st && st.boons && o && st.boons.scout === o.id, song = st && st.boons && st.boons.song;
    const r = fs0.apply(this, arguments), P = G.fight.P; if (!P || G.fight.ex || (o && o.spar)) return r;
    if (scouted && (pat(st).whisper || 0) >= 5) P.d.dmgMul *= 1.15 / 1.1;
    if (song && (pat(st).busker || 0) >= 5 && G.fight.addHype) G.fight.addHype(15);
    if (st.gilt) P.d.dmgMul *= 1 + 0.04 * st.gilt;
    return r;
  };

  // ------------------------------------------------------------ before the bout: what you are walking in with
  const pre0 = ui.prefight;
  ui.prefight = function (o) {
    pre0.apply(this, arguments); const st = G.state, card = document.querySelector('#panel .card.vs'), end = card && card.querySelector('.row.end:last-child'); if (!end || !st.hero || (o && o.spar)) return;
    card.querySelectorAll('p.dim').forEach(p => { if (/^Going in with|^Nothing eaten/.test(p.textContent)) p.remove(); });
    { const seen = bouts(st) >= 3, touch = G.input && G.input.touch; card.querySelectorAll('.keys').forEach(k => { if (seen || touch) k.remove(); }); card.querySelectorAll('p.dim').forEach(p => { if (/^On a phone/.test(p.textContent) && (seen || !touch)) p.remove(); }); }      // the controls are a lesson, not a fixture
    const B = st.boons || {}, name = k => ((G.BOONS || {})[B[k]] || {}).name, set = G.setOf ? G.setOf(st) : null, sec = st.second != null && (st.tally || [])[st.second];
    const rows = [];
    const add = (lock, label, val, hint) => { if (lock && !un(lock)) return; rows.push('<span class="pc' + (val ? ' on' : '') + '"><small>' + label + '</small><b>' + (val || hint) + '</b></span>'); };
    add('apoth', 'Tonic', name('tonic'), 'none · Apothecary'); add('cook', 'Meal', name('meal'), 'none · Big Hobb or your stove'); add(null, 'Song', name('song'), 'none · the Busker');
    add('whisper', 'Scouted', B.scout === o.id ? 'Yes, +' + ((pat(st).whisper || 0) >= 5 ? 15 : 10) + '% damage' : '', 'no · Whisper');
    add(null, 'Rested', st.rested ? '+' + st.rested + '% XP' : '', 'no · sleep at home');
    add('outfit', 'Set', set ? set.name : '', 'none worn · Outfitter'); add('charms', 'Charm', st.charm ? 'Worn' : '', 'none · charm seller');
    add('board', 'Contract', st.contract ? 'Taken' : '', 'none · Notice Board'); add('tally', 'Second', sec ? sec.name : '', 'nobody · the Low Lamp');
    rows.push('<span class="pc' + (st.potions > 0 ? ' on' : '') + '"><small>Potions</small><b>' + st.potions + ' of ' + G.POTION_MAX + '</b></span>');
    if (G.oracle && (st.signed || st.bound)) rows.push('<span class="pc' + ((st.favours || {}).borrow ? ' on' : '') + '"><small>Borrowed Time</small><b>' + ((st.favours || {}).borrow ? 'Armed' : 'off · the cellar') + '</b></span>');
    const d = document.createElement('div'); d.className = 'prep'; d.innerHTML = rows.join(''); end.parentNode.insertBefore(d, end);
  };

  // ------------------------------------------------------------ more for wizard gold to do
  const or0 = ui.oracle;
  if (or0) ui.oracle = function () {
    const r = or0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end || !(st.signed || st.bound)) return r;
    const wg = st.wgold || 0, mk = (title, sub, text, btn, dis, fn) => { const e = document.createElement('div'); e.className = 'ab-row'; e.innerHTML = '<div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + title + '</b><small>' + sub + '</small><p>' + text + '</p></div>' + (btn ? '<button class="big"' + (dis ? ' disabled' : '') + '>' + btn + '</button>' : '<span class="lock">Done</span>'); end.parentNode.insertBefore(e, end); const b = e.querySelector('button'); if (b) b.onclick = fn; };
    const g = st.gilt || 0;
    mk('Gilded Edge', '3 wizard gold · ' + g + ' of 3 taken', 'He runs wizard gold into your weapon hand. It does not come out. +4% damage with everything, for good, each time.', g < 3 ? 'Give 3' : '', wg < 3, () => { if ((st.wgold || 0) < 3 || (st.gilt || 0) >= 3) return; st.wgold -= 3; st.gilt = (st.gilt || 0) + 1; G.save(); G.sfx('level'); ui.oracle(pick(['Hold still. This is going to hurt, and I am going to enjoy that.', 'There. Now you hit like something of mine ought to.'])); });
    if ((st.heat || 0) > 0) mk('Make a clerk forget', '1 wizard gold · heat −3', 'A Warden’s clerk loses a page. Then, usually, a finger. Your name comes off the list either way.', 'Give 1', wg < 1, () => { if ((st.wgold || 0) < 1) return; st.wgold -= 1; st.heat = Math.max(0, (st.heat || 0) - 3); G.save(); G.sfx('coin'); ui.oracle(pick(['Gone. The page, I mean. And the clerk, I should think.', 'Heat is for people who can be caught. Try to remember whose you are.'])); });
    return r;
  };

  // ------------------------------------------------------------ if you will not die, he sends for you
  if (G.oracle) {
    const hub0 = ui.hub;
    ui.hub = function () { const r = hub0.apply(this, arguments), st = G.state; if (st && st.hero && !st.deaths && !st.davidCall && G.rankOf(st.respect) >= 3) { st.davidCall = 1; G.save(); setTimeout(() => { if (!G.talk) { G.sfx('bell'); ui.toast('Somewhere on the south side of the market, a clock has started ticking that was not there before.'); } }, 2600); } return r; };
    const orc0 = ui.oracle;
    ui.oracle = function () { const st = G.state; if (st.davidCall && !st.deaths && !st.davidMet && G.scene === 'hub') { st.cellarSeen = 1; ui.close(); return G.oracle.revive(() => { ui.hub(); ui.close(); ui.oracle(); }); } return orc0.apply(this, arguments); };
  }
  if (G.LORE) G.LORE.push({ sec: 'How Things Work', title: 'Walking In Prepared', unlock: st => bouts(st) >= 3, body: 'The card before a bout lists what you are carrying into it: tonic, meal, song, whether Whisper has sold you the other fighter, whether you slept, what set you wear, who stands as your Second. Every empty line is a stall or a room you did not visit. None of it is required. All of it adds up.' });
})();
