// Guttercrown — borrowed coin: David lends at a rate that should be a crime, and Marc lends at a rate that sometimes is one.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  const D_RATE = 0.25, M_RATE = 0.1, toHub = () => { G.scene = 'hub'; ui.hub(); ui.close(); };
  G.loans = { owedD: st => Math.round((st.loanD || {}).owed || 0), owedM: st => Math.round((st.loanM || {}).owed || 0) };

  // ---- every real bout, the numbers move
  const res0 = ui.results;
  ui.results = function (r) { const st = G.state, notes = [];
    if (r && r.opp && !r.opp.spar && !r._ln && st.hero) { r._ln = 1;
      const d = st.loanD; if (d && d.owed > 0) { d.owed = Math.ceil(d.owed * (1 + D_RATE)); d.bouts = (d.bouts || 0) + 1; notes.push('David’s loan grew by a quarter: you owe him <b>' + d.owed + '</b> coin.'); if (d.owed >= 600) { d.owed -= 300; st.soulDebt = (st.soulDebt || 0) + 1; notes.push('“Too slow.” He has taken <b>a soul</b> in place of 300 of it.'); } }
      const m = st.loanM; if (m && m.owed > 0) { m.bouts = (m.bouts || 0) + 1; if (m.rate) { m.owed += Math.ceil(m.principal * m.rate); notes.push('Marc’s loan: <b>' + m.owed + '</b> coin owed.'); } if (m.bouts > 5 && r.win) { const take = Math.min(m.owed, Math.floor((st.coin + (r.coin || 0)) * 0.5)); if (take > 0) { st.coin -= take; m.owed -= take; notes.push('Marc was waiting at the gate. “Bro. It has been a while.” He took <b>' + take + '</b> out of your purse.'); } } if (m.owed <= 0) st.loanM = null; }
      if (notes.length) G.save(); }
    const out = res0.apply(this, arguments); if (notes.length) { const end = document.querySelector('#panel .row.end'); if (end) notes.forEach(n => { const p = document.createElement('p'); p.className = 'dim loan-note'; p.innerHTML = n; end.parentNode.insertBefore(p, end); }); } return out; };

  // ---- David
  const DL = ['Coin? You want COIN? Oh, come here. Sit. I love this part.', 'A quarter on top, every bout, compounding. Do not do the sum, it will only upset you, and I do not have the patience to watch you count.', 'I lend to kings, meat. You are a rounding error with a pulse. Take it.', 'It is not usury if I am better than you. It is tuition.'];
  const or0 = ui.oracle;
  if (or0) ui.oracle = function () { const r = or0.apply(this, arguments), st = G.state, end = document.querySelector('#panel .row.end'); if (!end || !st.hero) return r;
    const d = st.loanD, owed = d ? d.owed : 0, row = document.createElement('div'); row.className = 'ab-row';
    row.innerHTML = '<div class="ab-ic pas">¤</div><div class="ab-tx"><b>Borrow from the Oracle</b><small>' + (owed ? 'You owe ' + owed + ' coin' : 'A quarter on top, every bout') + '</small><p>“' + pick(DL) + '” The debt grows by <b>25% after every bout</b>, on the whole of it. Let it reach 600 and he takes a soul instead.</p></div>' +
      (owed ? '<button id="lpay"' + (st.coin < 1 ? ' disabled' : '') + '>Pay ' + Math.min(st.coin, owed) + '</button>' : '<div class="slots">' + [100, 200, 350].map(v => '<button class="slot" data-lend="' + v + '">' + v + '</button>').join('') + '</div>');
    end.parentNode.insertBefore(row, end);
    on('[data-lend]', el => { const v = +el.dataset.lend; st.coin += v; st.loanD = { owed: v, bouts: 0 }; G.save(); G.sfx('coin'); ui.topbar(); ui.oracle('There. Count it. Now count what it will be. HA! Your face. I would pay for that face, if I ever paid for anything.'); });
    on('#lpay', () => { const v = Math.min(st.coin, owed); st.coin -= v; d.owed -= v; if (d.owed <= 0) st.loanD = null; G.save(); G.sfx('coin'); ui.topbar(); ui.oracle(st.loanD ? 'Some of it. SOME. I asked for all of it and you bring me a tip.' : 'Paid. In full. How dull of you. Borrow again, I was enjoying myself.'); });
    return r; };

  // ---- Marc
  const ML = ['A loan? Bro. BRO. I thought you would never ask. I am so good at this.', 'Ten on the hundred, every bout. That is basically free. That is friendship, with numbers.', 'I do not charge interest, bro. I charge a FEELING. The feeling is ten percent.'];
  const JOBS = [
    { k: 'collect', t: 'There is a guy. Owes me. Has owed me since the mushroom thing. Go and have a conversation with his face, and this one is on the house. No interest. Bro to bro.', b: 'Lean on his late payer', s: 'A scrap to the yield, right now. Win and the loan carries no interest. Lose and it is the usual ten.' },
    { k: 'package', t: 'Or. OR. You hold a thing for me. Do not open the thing. Do not shake the thing. The Wardens might get a bit curious about you for a while. No interest, though!', b: 'Hold his package', s: 'No interest on the loan. The Seal-Wardens take more notice of you.' }];
  const mk0 = ui.mark;
  if (mk0) ui.mark = function () { const r = mk0.apply(this, arguments), st = G.state, box = document.querySelector('#panel .choices'); if (!box || !st.hero || document.querySelector('#panel #mf')) return r;
    const m = st.loanM, b = document.createElement('button'); b.id = 'mloan'; b.innerHTML = m ? '<b>Your tab with Marc</b><small>You owe him ' + m.owed + ' coin' + (m.rate ? ', ten on the hundred each bout.' : ', no interest.') + '</small>' : '<b>Ask Marc for a loan</b><small>Ten on the hundred each bout. Sometimes he would rather have a favour.</small>'; box.appendChild(b); b.onclick = () => { G.sfx('ui'); marcLoan(); }; return r; };
  function marcLoan() {
    const st = G.state, m = st.loanM;
    if (m) { show('<div class="card small"><h2>Your Tab</h2><p class="quote">“' + pick(['No rush, bro. Some rush. A medium rush.', 'I am not counting. I am counting a little. It is ' + m.owed + '.', 'Pay me when you can. You can now. I can see your purse from here.']) + '”</p><p class="note">You owe Marc <b>' + m.owed + '</b> coin' + (m.rate ? ', growing by ' + Math.ceil(m.principal * m.rate) + ' a bout.' : ', with no interest.') + ' Leave it more than five bouts and he starts taking half of every purse at the gate.</p><div class="row end"><button id="b">Back</button><button class="big" id="pay"' + (st.coin < 1 ? ' disabled' : '') + '>Pay ' + Math.min(st.coin, m.owed) + '</button></div></div>');
      on('#b', () => ui.mark()); on('#pay', () => { const v = Math.min(st.coin, m.owed); st.coin -= v; m.owed -= v; if (m.owed <= 0) st.loanM = null; G.save(); G.sfx('coin'); ui.topbar(); ui.mark(st.loanM ? 'A down payment. Love that for us.' : 'Square! We are SQUARE, bro. Do you want to un-square? I have more.'); }); return; }
    const job = Math.random() < 0.45 ? pick(JOBS) : null; let amt = 150;
    const draw = () => { show('<div class="card small"><h2>A Loan From Marc</h2><p class="quote">“' + pick(ML) + (job ? ' …Actually. Hang on. ' + job.t : '') + '”</p><div class="slots">' + [80, 150, 300].map(v => '<button class="slot' + (v === amt ? ' sel' : '') + '" data-a="' + v + '">' + v + ' coin</button>').join('') + '</div><div class="choices"><button class="big" id="t1"><b>Take it at interest</b><small>' + amt + ' now. ' + Math.ceil(amt * M_RATE) + ' more owed after every bout.</small></button>' + (job ? '<button id="t2"><b>' + job.b + '</b><small>' + job.s + '</small></button>' : '') + '<button id="b"><b>Never mind</b></button></div></div>');
      on('[data-a]', el => { amt = +el.dataset.a; draw(); }); on('#b', () => ui.mark());
      const lend = rate => { st.coin += amt; st.loanM = { owed: amt, principal: amt, rate, bouts: 0 }; G.save(); G.sfx('coin'); ui.topbar(); };
      on('#t1', () => { lend(M_RATE); ui.mark('Pleasure. Genuinely. Do not die, it is very bad for my books.'); });
      on('#t2', () => { if (job.k === 'package') { lend(0); st.heat = Math.min(10, (st.heat || 0) + 2); G.save(); ui.mark('Perfect. It is under your bed already. I let myself in. Do not shake it.'); return; }
        const h = st.hero, cls = pick(['fighter', 'rogue', 'cleric']), C = G.CLASSES[cls];
        G.spar({ id: 'latepayer', name: pick(['Fennick', 'Odd Gil', 'Tolliver', 'Mossy Wren']), title: 'who owes Marc', cls, race: pick(Object.keys(G.RACES)), level: Math.max(1, h.level - 1), known: C.start.slice(0, 2).filter(id => G.ABILITIES[id]), hpMul: 0.85, dmgMul: 0.7, ai: { react: 0.55, aggro: 0.55, dodge: 0.12, guard: 0.25, parry: 0.05 }, xp: 0, coin: 0, respect: 0, spar: 1, taunt: '', tint: { cloth: '#6a5a3a', armor: '#4a4438' } },
          win => { lend(win ? 0 : M_RATE); toHub(); show('<div class="card small"><h2>' + (win ? 'Message Delivered' : 'Message Returned') + '</h2><p class="quote">“' + (win ? 'He PAID? Bro. You are an artist. No interest, as promised. I am a man of my word, on days like today.' : 'He hit YOU? Okay. Okay, that is embarrassing for both of us. Usual rate, then. Sorry, bro. Rules.') + '”</p><p class="note">' + amt + ' coin lent' + (win ? ', no interest.' : ', at ten on the hundred.') + '</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); }); }); };
    draw();
  }
  if (G.objective) { const ob0 = G.objective; G.objective = function () { const s = ob0.apply(this, arguments), st = G.state; if (!st || !st.hero || !s) return s; const d = G.loans.owedD(st); return d >= 300 && !/calling you over/.test(s) ? s + ' · you owe David ' + d + ' coin and it grows every bout' : s; }; }
  if (G.LORE) G.LORE.push({ sec: 'How Things Work', title: 'Borrowed Coin', unlock: st => !!(st.loanD || st.loanM), body: 'Two people under the market will lend to a fighter. David Roseinbeirg lends at a quarter on the whole debt after every bout, and when it reaches six hundred he stops counting coin and takes a soul. Marc lends at ten on the hundred, flat, and after five bouts he starts meeting you at the gate. Sometimes Marc would rather have a favour than interest. The favours are never as small as he makes them sound.' });
})();
