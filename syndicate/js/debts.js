// Guttercrown — debts and choices: David's collectors, a first choice of steel and bent, honed weapons, what your blood gives you, an open card at every rank, and Marc losing badly.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  const bouts = st => (st.boutN || 0), tied = st => !!(st.signed || st.bound), toHub = () => { G.scene = 'hub'; ui.hub(); ui.close(); };

  // ------------------------------------------------------------ what your blood gives you
  const TRAIT = G.RACE_TRAIT = {
    human: ['Adaptable', '+8% XP and +8% coin from every bout.'], dwarf: ['Stone-Blooded', 'Take 6% less damage from everything.'], elf: ['Fleet', 'Move 8% faster and dodge again 10% sooner.'],
    halforc: ['Relentless', 'Once a bout, the blow that would kill you leaves you standing on a sliver of health.'], tiefling: ['Hellish Blood', '+4% critical chance. Your taunts wake an infernal spirit.'], drow: ['Deep-Sighted', 'Abilities come back 6% faster, and you move 4% faster.'] };
  const BENT = G.BENTS = { tough: ['Tough', '+8% health.'], quick: ['Quick', '+6% speed, dodge again 10% sooner.'], sharp: ['Sharp', '+5% damage.'], canny: ['Canny', '+10% coin and respect.'] };
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments); if (!h) return d;
    const r = h.race; if (r === 'human') { d.xpMul += 0.08; d.coinMul += 0.08; } else if (r === 'dwarf') d.dr += 0.06; else if (r === 'elf') { d.speed *= 1.08; d.dodgeCd *= 0.9; } else if (r === 'tiefling') d.crit += 0.04; else if (r === 'drow') { d.cdr += 0.06; d.speed *= 1.04; }
    const b = h.bent; if (b === 'tough') d.maxHp *= 1.08; else if (b === 'quick') { d.speed *= 1.06; d.dodgeCd *= 0.9; } else if (b === 'sharp') d.dmgMul += 0.05; else if (b === 'canny') { d.coinMul += 0.1; d.respectMul += 0.1; }
    if (st && st.hero === h && st.hone && G.armOf) d.weapon += (st.hone[G.armOf(h)] || 0);
    return d; };
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const r = fs0.apply(this, arguments), P = G.fight.P, h = G.state.hero; if (P && h && !G.fight.ex) P.endure = h.race === 'halforc' ? 1 : 0; return r; };
  // shown where you choose it
  const cr0 = ui.create;
  if (cr0) ui.create = function () { const r = cr0.apply(this, arguments), panel = document.getElementById('panel'); const deco = () => { const sel = panel.querySelector('[data-race].sel'); if (!sel || G.scene !== 'create') return; let p = panel.querySelector('.race-trait'); const t = TRAIT[sel.dataset.race]; if (!t) return; const txt = t[0] + ': ' + t[1]; if (p && p.dataset.k === sel.dataset.race) return; if (p) p.remove(); p = document.createElement('p'); p.className = 'note race-trait'; p.dataset.k = sel.dataset.race; p.innerHTML = '<b>' + t[0] + '</b> · ' + t[1]; sel.parentNode.parentNode.insertBefore(p, sel.parentNode.nextSibling); };
    deco(); if (!panel._rt) { panel._rt = new MutationObserver(() => { try { deco(); } catch (e) { } }); panel._rt.observe(panel, { childList: true, subtree: true }); } return r; };

  // ------------------------------------------------------------ the first choice: what you carry and how you are built
  function firstKit() {
    const st = G.state, h = st.hero, list = (G.ARMS || []).filter(w => w.cls === h.cls && !w.deed).sort((a, b) => (a.cost || 0) - (b.cost || 0)).slice(0, 3); let arm = G.armOf(h), bent = 'tough';
    const draw = () => { show('<div class="card"><small class="over">Before your first bout</small><h2>Steel and Bent</h2><p class="dim">The Guild lends you one weapon. Take the one that suits you; the others can be bought at the Armoury after your first win. Your <b>ability scores</b> come from your class and blood and do not change here. What you choose is how you fight.</p><h3>Your weapon</h3>' +
      list.map(w => '<div class="ab-row' + (w.id === arm ? ' deeddone' : '') + '"><div class="ab-ic pas">⚔</div><div class="ab-tx"><b>' + w.name + '</b><p>' + (w.blurb || (G.ABILITIES[w.id] || {}).desc || '') + '</p></div><button data-arm="' + w.id + '" class="' + (w.id === arm ? 'big' : '') + '">' + (w.id === arm ? 'Chosen' : 'Take') + '</button></div>').join('') +
      '<h3>Your bent</h3><div class="slots">' + Object.keys(BENT).map(k => '<button class="slot' + (k === bent ? ' sel' : '') + '" data-bent="' + k + '">' + BENT[k][0] + '</button>').join('') + '</div><p class="note"><b>' + BENT[bent][0] + '</b> · ' + BENT[bent][1] + '</p>' +
      '<p class="note"><b>' + TRAIT[h.race][0] + '</b> (' + G.RACES[h.race].name + ') · ' + TRAIT[h.race][1] + '</p><div class="row end"><button class="big" id="ok">That is me</button></div></div>');
      on('[data-arm]', el => { arm = el.dataset.arm; G.sfx('ui'); draw(); }); on('[data-bent]', el => { bent = el.dataset.bent; G.sfx('ui'); draw(); });
      on('#ok', () => { st.arms = st.arms || {}; st.arms[arm] = 1; h.arm = arm; h.bent = bent; st.kitPicked = 1; G.save(); G.sfx('level'); ui.close(); ui.topbar(); }); };
    draw();
  }
  const hub0 = ui.hub;
  ui.hub = function () { const r = hub0.apply(this, arguments), st = G.state; if (st && st.hero && !st.kitPicked) { if (bouts(st) || Object.keys(st.wins || {}).length || st.deaths || st.losses) { st.kitPicked = 1; } else if (!st.kitShown && !G.talk && !G.spectating) { st.kitShown = 1; const ok = ui.isOpen() && document.querySelector('#panel #ok'); if (ok) ok.addEventListener('click', () => setTimeout(() => { if (!G.state.kitPicked && G.scene === 'hub' && !ui.isOpen()) firstKit(); }, 0)); else firstKit(); } } return r; };

  // ------------------------------------------------------------ honing: a weapon you keep gets better
  const HONE = [60, 130, 220];
  if (ui.armory) { const ar0 = ui.armory; ui.armory = function () { const r = ar0.apply(this, arguments), st = G.state, h = st.hero, id = G.armOf(h), n = (st.hone = st.hone || {})[id] || 0, end = document.querySelector('#panel .row.end'); if (!end || document.querySelector('#panel .locked-card') || (G.unlocked && !G.unlocked('armory'))) return r;
    const row = document.createElement('div'); row.className = 'ab-row'; row.innerHTML = '<div class="ab-ic pas">✦</div><div class="ab-tx"><b>Hone the ' + G.ARM_BY[id].name + '</b><small>' + n + ' of 3</small><p>The Fence knows a grinder. Each honing adds +1 to every blow with this weapon, on top of its mastery and the grade of your steel.</p></div>' + (n >= 3 ? '<span class="lock">Honed</span>' : '<button id="hone"' + (st.coin < HONE[n] ? ' disabled' : '') + '>' + HONE[n] + ' coin</button>');
    end.parentNode.insertBefore(row, end); on('#hone', () => { if (st.coin < HONE[n]) return; st.coin -= HONE[n]; st.hone[id] = n + 1; G.save(); G.sfx('coin'); ui.topbar(); ui.armory(); }); return r; }; }

  // ------------------------------------------------------------ the sheet says, in one place, what you are made of
  if (ui.sheet) { const sh0 = ui.sheet; ui.sheet = function () { const r = sh0.apply(this, arguments), st = G.state, h = st.hero, card = document.querySelector('#panel .card'), h3 = card && card.querySelector('h3'); if (!h3 || !TRAIT[h.race]) return r;
    const id = G.armOf ? G.armOf(h) : null, d = document.createElement('div'); d.className = 'made';
    d.innerHTML = '<p class="note"><b>What you are made of</b> · scores come from class and blood; these are the choices on top.</p><div class="made-g"><span><small>BLOOD</small><b>' + TRAIT[h.race][0] + '</b><i>' + TRAIT[h.race][1] + '</i></span>' + (h.bent ? '<span><small>BENT</small><b>' + BENT[h.bent][0] + '</b><i>' + BENT[h.bent][1] + '</i></span>' : '') + (id ? '<span><small>STEEL</small><b>' + G.ARM_BY[id].name + '</b><i>Honed ' + ((st.hone || {})[id] || 0) + ' of 3 · mastery ' + Math.floor(((st.mastery || {})[id] || 0) / 100) + '</i></span>' : '') + '</div>';
    h3.parentNode.insertBefore(d, h3); return r; }; }

  // ------------------------------------------------------------ an open card at every rank you have cleared
  const pit0 = ui.pit;
  ui.pit = function () { const r = pit0.apply(this, arguments), st = G.state, lad = document.querySelector('#panel .ladder'), C = G.climb; if (!lad || !C) return r;
    const now = C.tierNow(st), top = now < 0 ? C.NEED.length : now; if (top < 1) return r;
    const d = document.createElement('div'); d.className = 'opencard'; d.innerHTML = '<b>The open card</b><small>Fight a fresh name at any rank you have cleared, for coin. There is always somebody.</small><div class="slots">' + Array.from({ length: top }, (_, t) => { const o = C.make(t, C.NEED[t] + 40 + ((st.low || {})[t] || 0), 1); return '<button class="slot" data-open="' + t + '">Rank ' + (t + 1) + '<i>lvl ' + o.level + ' · ' + o.coin + 'c</i></button>'; }).join('') + '</div>';
    lad.parentNode.insertBefore(d, lad); on('[data-open]', el => { const t = +el.dataset.open; ui.prefight(C.make(t, C.NEED[t] + 40 + ((st.low || {})[t] || 0), 1)); }); return r; };

  // ------------------------------------------------------------ David's collectors
  const res0 = ui.results;
  ui.results = function (r) { const st = G.state; if (r && r.opp && !r.opp.spar && !r._bn) { r._bn = 1; st.boutN = (st.boutN || 0) + 1; } return res0.apply(this, arguments); };
  const NOTES = ['“You owe me {n}. I have counted them twice, because counting is the only honest pleasure left to a man of my quality. Pay, or I will have it out of your hide, your home and your grandmother’s teeth.”', '“{n} souls. MINE. Every one of them has a number and I know the numbers by heart, which is more than I know about my own children. The bearer of this note is authorised to break you.”', '“I did not turn the clock back for the joy of your company, meat. {n}. On the table. Or my man takes the table.”', '“Do you know what interest IS, you witless lump? It is what {n} becomes while you are busy buying hats. Pay him.”'];
  function collector() {
    const st = G.state, h = st.hero, n = st.soulDebt || 0, price = G.oracle.price(st), cls = pick(['fighter', 'cleric', 'rogue']), C = G.CLASSES[cls];
    const o = { id: 'collector2', name: pick(['Mr. Halloran', 'Mistress Vey', 'Brother Ossian', 'The Quiet Clerk', 'Dunmore']), title: 'for the Oracle', cls, race: pick(Object.keys(G.RACES)), level: Math.max(1, h.level), known: C.start.slice(0, 2).concat(h.level >= 4 && C.l2 ? [C.l2[0]] : []).filter(id => G.ABILITIES[id]), hpMul: 0.95, dmgMul: 0.82, ai: { react: 0.46, aggro: 0.66, dodge: 0.14, guard: 0.35, parry: 0.1 }, xp: 0, coin: 0, respect: 0, spar: 1, taunt: '', tint: { cloth: '#3a2a10', armor: '#b8862a', armor2: '#6a4a14', trim: '#f0c95a' } };
    st.collT = bouts(st); G.save();
    show('<div class="card small letter event"><small class="over">Somebody is in your house</small><h2>The Oracle Collects</h2><p>' + o.name + ' is sitting in your chair with a ledger on one knee and a note in gold ink.</p><p class="quote">' + pick(NOTES).replace('{n}', n) + '<br>— D. R.</p>' + (tied(st) ? '<p class="note">“And remember whose name is beside yours on that contract. It is the big one.”</p>' : '<p class="note">“Sign, and I stop sending people. I send for YOU instead. It is much more civilised.”</p>') +
      '<div class="choices"><button id="cp"' + (st.coin < price ? ' disabled' : '') + '><b>Pay for one soul</b><small>' + price + ' coin. You have ' + st.coin + '.</small></button><button id="cf" class="big"><b>Throw them out</b><small>A fight to the yield, in the yard. Win and they leave with nothing. Lose and they take a third of your purse.</small></button></div></div>');
    on('#cp', () => { if (st.coin < price) return; st.coin -= price; st.soulDebt = n - 1; st.soulsPaid = (st.soulsPaid || 0) + 1; G.save(); G.sfx('coin'); ui.close(); ui.topbar(); ui.toast(o.name + ' writes a receipt, in gold. ' + st.soulDebt + ' still owed.'); });
    on('#cf', () => G.spar(o, win => { const s2 = G.state; let line; if (win) { s2.respect += 8; line = o.name + ' picks up the ledger, and most of their teeth, and goes. +8 respect. He will send another.'; } else { const take = Math.round(s2.coin * 0.33); s2.coin -= take; line = o.name + ' counts ' + take + ' coin out of your purse while you lie there, and leaves a receipt on your chest.'; } G.save(); toHub(); show('<div class="card small letter event"><h2>' + (win ? 'Thrown Out' : 'Collected') + '</h2><p>' + line + '</p><p class="note">You still owe ' + (s2.soulDebt || 0) + ' soul' + (s2.soulDebt === 1 ? '' : 's') + '. Pay them down in his cellar.</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); }));
  }
  const hide0 = ui.hideout;
  if (hide0) ui.hideout = function () { const r = hide0.apply(this, arguments), st = G.state; if (st && st.hero && (st.soulDebt || 0) >= 3 && bouts(st) - (st.collT == null ? -9 : st.collT) >= 3 && !G.talk) setTimeout(() => { if (G.scene === 'hideout' && !ui.isOpen() && !G.talk && !G.placing) collector(); }, 900); return r; };

  // ------------------------------------------------------------ Marc, and Marc losing
  const SAY = G.marcSAY;
  if (SAY) {
    SAY.hello.push('BRO. Sit. No, not there, that one is load-bearing.', 'My guy! I was just telling these people about you. They left, but I was telling them.', 'You know what your problem is? You have never been properly, life-ruiningly lucky. Let me fix that.', 'I had a dream you owed me money. Then I woke up, and I was right.');
    SAY.win.push('No. No no no. Do that again, slower, where I can see your hands.', 'Bro, that is statistically rude.', 'Fine. FINE. I am fine. Look how fine I am.', 'You know I have a FAMILY? I do not. But I COULD.');
    SAY.lose.push('And the room goes quiet. Beautiful. I love that sound.', 'It is not gambling if I always win, bro. It is a subscription.', 'Aw. Do you want a hug or a loan? I only do loans.', 'Do not look at me like that. Look at the dice. The dice did it.');
    SAY.card.push('Bro, I do not fix fights. I ENCOURAGE them. Different thing. Ask a lawyer. Not mine.', 'Tonight’s card is all heart. No talent whatsoever. Perfect for betting.');
    SAY.broke.push('Empty pockets, bro? Come here. No, do not come here. Go get pockets.');
    SAY.self.push('Betting on yourself. I love it. I am going to bet against you a little, just for balance. Do not be weird about it.');
  }
  const CRASH = ['THAT IS IT. That is IT, bro. Nobody is that lucky. Nobody. I checked. I MADE the dice.', 'You know what, no. No. I am not mad. I am just going to take my rings off. Hold my rings. Do NOT hold my rings, you will bet them.', 'Three in a row? THREE? My mother could not do that to me and she TRIED.', 'Outside. You and me. I do not even care about the money. I care a little about the money. OUTSIDE.'];
  G.marcSaid = k => { const st = G.state; if (!st || !st.hero) return; if (k === 'win') { st.marcTilt = (st.marcTilt || 0) + 1; if (st.marcTilt >= 3) st.marcSalty = 1; } else if (k === 'lose' || k === 'tie') st.marcTilt = 0; };
  const mk0 = ui.mark;
  if (mk0) ui.mark = function () { const st = G.state, args = arguments, self = this; if (!st.marcSalty || G.spectating) return mk0.apply(self, args);
    st.marcSalty = 0; st.marcTilt = 0; G.save();
    show('<div class="card small"><h2>Marc Crashes Out</h2><div class="mk-top"><span id="mkc"></span><div><p class="quote">“' + pick(CRASH) + '”</p><p class="dim">He has turned the table over. It was not his table. He is squaring up, badly, with a great deal of confidence.</p></div></div><div class="choices"><button class="big" id="mf"><b>Fine. Outside.</b><small>A scrap to the yield. Nobody dies. He will be unbearable either way.</small></button><button id="mn"><b>Let him walk it off</b><small>He will be back at the table in a minute, pretending this did not happen.</small></button></div></div>');
    const el = document.getElementById('mkc'); if (el && G.mark && G.portrait) el.appendChild(G.portrait(G.mark.look, 92));
    on('#mn', () => mk0.call(self, 'I was never mad. That was a bit. Bro, it was a BIT.'));
    on('#mf', () => G.spar({ id: 'mark', name: 'Marc', title: 'of the Long Odds, furious', cls: 'sorcerer', race: 'human', level: Math.max(1, st.hero.level), sub: 'wild', known: ['chaos_bolt', 'misty_step', 'burning_hands'].filter(id => G.ABILITIES[id]), hpMul: 0.9, dmgMul: 0.6, ai: { react: 0.5, aggro: 0.85, dodge: 0.2 }, xp: 0, coin: 0, respect: 0, spar: 1, taunt: '', tint: (G.mark.look || {}).tint },
      win => { const s2 = G.state; let line, got; if (win) { s2.chits = (s2.chits || 0) + 15; s2.respect += 5; line = 'OKAY. Okay. I yield. I YIELD, bro, get off. …You hit like the rent. Here. Chits. We are good. We were always good.'; got = '+15 chits · +5 respect'; } else { line = 'HA! Did you SEE that? Somebody tell me they saw that. I am a WARRIOR. I am going to lie down now. Good fight, bro. Never speak of it.'; got = 'He is in a wonderful mood. It is worse.'; } G.save(); toHub(); show('<div class="card small"><h2>' + (win ? 'Marc Yields' : 'Marc Wins?') + '</h2><p class="quote">“' + line + '”</p><p class="note">' + got + '</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); })); };

  if (G.LORE) G.LORE.push(
    { sec: 'The World', title: 'Yesterday, Again', unlock: st => (st.deaths || 0) >= 1, body: 'When the Oracle brings you back he does not mend you. He turns the day back to the morning before the bout, for everybody, and lets it run again without the part where you died. The gate-men remember raking the sand. The stands remember a good card. The Ledger shows a bout that went the distance and was called. Only you remember the rest, and him. This is why nobody in the Undercity has ever asked how you are still walking about: as far as they know, you have never fallen. He counts the days he has spent on you. He counts everything.' },
    { sec: 'The Trades', title: 'Blood', unlock: () => true, body: Object.keys(TRAIT).filter(k => G.RACES[k]).map(k => G.RACES[k].name + ' · ' + TRAIT[k][0] + ': ' + TRAIT[k][1]).join('  ') });
})();
