// Guttercrown — more street events, many of them only for a certain trade, blood, standing or situation.
// Events that fit you come up more often than ones that do not, and you will not see the same one twice running.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const E = (title, when, text, choices) => ({ title, when, text, choices }), C = (label, stat, dc, win, lose) => ({ label, stat, dc, win, lose });
  const cls = c => st => st.hero.cls === c, race = r => st => st.hero.race === r, lv = (a, b) => st => st.hero.level >= a && st.hero.level <= (b || 99), rk = n => st => G.rankOf(st.respect) >= n;
  const nm = () => G.state.hero.name;
  const MORE = [
    // ---- trades
    E('The Old Drill', cls('fighter'), () => 'Six Guild recruits are being drilled in a dead-end by a one-armed sergeant who keeps getting the footwork wrong. He sees how you stand and stops shouting.', [
      C('Show them properly', 'str', 11, { respect: 9, xp: 30, text: 'You run them until they drop. The sergeant buys you a drink with somebody else’s coin.' }, { respect: 2, text: 'One of the recruits puts you on your back. The others pretend not to have seen. They saw.' }),
      C('Correct the sergeant', 'cha', 12, { coin: 25, text: 'He takes it well, and pays you to come back. You will not.' }, { respect: -3, text: '“I held the Landing for eleven years, pup.” He did not. Nobody argues.' }),
      C('Walk on', null, 0, { text: 'Behind you somebody falls over their own feet. The sergeant blames the sand.' })]),
    E('A Lock Worth Picking', cls('rogue'), () => 'A Guild strongbox sits on a cart outside the counting-house. The guard is asleep. The lock is a Morrow Seven, which you could open with a fishbone.', [
      C('Open it', 'dex', 13, { coin: 70, text: 'A fishbone, as it happens. The guard does not stir. You close it again, lighter.' }, { coin: -30, respect: -4, text: 'The guard was not asleep. The fine is thirty and a long look.' }),
      C('Wake the guard and collect a reward', 'cha', 10, { coin: 20, respect: 4, text: '“Thank you, citizen.” Nobody has called you that before. It itches.' }, { text: 'He does not believe a word, and keeps his hand on his club until you leave.' }),
      C('Leave it', null, 0, { text: 'Somebody else will. Somebody always does.' })]),
    E('Wild Surge', cls('sorcerer'), () => 'Something in your blood turns over in the middle of the market. Every lamp on the street flares blue at once. Stallholders are looking at you.', [
      C('Hold it in', 'con', 12, { xp: 40, text: 'It goes back down, slowly, and leaves you knowing it a little better.' }, { coin: -25, text: 'It does not go back down. You pay for the awning.' }),
      C('Let it go, and make it look deliberate', 'cha', 11, { respect: 10, text: 'A shower of sparks, a bow. The street applauds a trick you did not play.' }, { respect: -4, coin: -15, text: 'It goes exactly where you did not point it.' }),
      C('Run', 'dex', 9, { text: 'You are round two corners before the last lamp settles.' }, { coin: -10, text: 'You knock over a pie stall on the way. Of course you do.' })]),
    E('Last Rites', cls('cleric'), () => 'A man is dying against the wall of the Ember Rows, and has been for an hour. People step round him. He has seen your symbol.', [
      C('Kneel with him', 'wis', 10, { bless: 1, respect: 6, text: 'You say the old words. He goes easier for it. Something goes with you into your next bout.' }, { bless: 1, text: 'You lose the words halfway. He finishes them for you, and is gone.' }),
      C('Try to save him', 'wis', 15, { respect: 14, xp: 30, text: 'He sits up. The people who stepped round him will be talking about it for a year.' }, { text: 'Too late. You did try. Two people saw you try.' }),
      C('Fetch somebody', null, 0, { coin: -5, text: 'You pay a runner. You do not wait to see who comes.' })]),
    E('Something in the Drain', cls('druid'), () => 'Down a drain-grate, something is crying in a voice no rat has. Yellow eyes. A tunnel cat, half-grown, with its leg caught.', [
      C('Talk it out', 'wis', 11, { potion: 1, text: 'It comes out, sniffs you, and leaves a strange root at your feet before it goes. The Apothecary pays nothing for it; you brew it yourself.' }, { coin: -8, text: 'It bites you, gets free, and leaves. You buy a bandage.' }),
      C('Pull the grate', 'str', 12, { respect: 5, text: 'The grate comes away. So does the cat, at speed. A child cheers.' }, { text: 'The grate does not come away. The cat looks at you with contempt.' }),
      C('Leave it to its gods', null, 0, { text: 'It has them. Down here everything does.' })]),
    E('Collect Call', cls('warlock'), () => 'Every candle in the street gutters at once and leans towards you. Something you made a bargain with would like a word, here, now, in front of people.', [
      C('Answer it', 'cha', 12, { xp: 50, text: 'It is pleased with you. It teaches you something you will not repeat.' }, { respect: -5, text: 'It is not pleased. Everybody in the street heard what it called you.' }),
      C('Make it wait', 'wis', 13, { respect: 8, text: 'You do not answer. The candles straighten. You are still here. That impresses people who know.' }, { coin: -30, text: 'It does not like waiting. Thirty coin of yours turns to ash in your pocket.' })]),
    // ---- bloods
    E('Long Memory', race('elf'), () => 'An elf old enough to have known your grandmother’s grandmother stops you, takes your chin in one hand, and turns your face to the lamp.', [
      C('Let her look', 'wis', 10, { respect: 6, xp: 25, text: '“Silverbough,” she says. “You were bankers once. Try not to be ashamed of it.” She tells you three things about your family nobody living knows.' }, { text: '“No. I was mistaken. Nobody I knew would be down here.”' }),
      C('Pull away', null, 0, { text: '“Proud. That is the family, then.”' })]),
    E('Seam Song', race('dwarf'), () => 'The old miners are singing the Seam Song in the Lamp Tavern, the long version, and there is a cask on the table for whoever lasts the whole thing.', [
      C('Sing it through', 'con', 13, { coin: 40, respect: 6, text: 'Forty-one verses. You last. The cask is mostly empty; the purse under it is not.' }, { coin: -10, text: 'Verse twenty-nine. You wake under the table with a bill.' }),
      C('Sing one verse and leave', null, 0, { respect: 3, text: 'The right verse. Your grandfather’s. The table goes quiet, then louder.' })]),
    E('Tusks and Manners', race('halforc'), () => 'A fine lady from somewhere up the stair has wandered into the market, seen you, and screamed. Nobody is quite sure what to do.', [
      C('Bow very low', 'cha', 12, { respect: 9, text: 'You bow like a courtier. The market roars. The lady faints, which makes it better.' }, { respect: 2, text: 'You bow. She screams again. The market roars anyway.' }),
      C('Roar back', 'str', 9, { respect: 6, text: 'She goes back up the Long Stair a great deal faster than she came down it.' }, { respect: -4, text: 'Her bodyguard takes it badly. So does your jaw.' })]),
    E('Ward-Sign', race('tiefling'), () => 'The cheese-seller makes the ward against the evil eye as you pass. Two fingers, flicked. His grandmother taught him; it shows.', [
      C('Make it back at him, better', 'cha', 11, { coin: 15, respect: 4, text: 'He goes white and gives you a wheel of cheese not to do it again.' }, { text: 'He makes it twice. You are now in a ward-off. You lose.' }),
      C('Buy his whole stock', null, 0, { coin: -30, respect: 6, text: 'You pay in full, and eat a slice looking him in the eye. The market likes you for it.' })]),
    E('Kin From Below', race('drow'), () => 'A drow you do not know falls into step beside you and speaks in the deep tongue. Your house has a message. Your house has never sent you a message.', [
      C('Hear it', 'int', 12, { xp: 40, respect: 4, text: 'Coded, and nasty, and true: your next opponent is not what the Ledger says. You make use of it.' }, { text: 'You lose the thread of the old grammar. The messenger looks at you with real pity, and goes.' }),
      C('Refuse it', null, 0, { respect: 3, text: '“Tell them I am busy.” They will. It will be the most interesting thing anyone has said about you down there in years.' })]),
    E('Cousin Somebody', race('human'), () => 'A man with your nose insists, loudly, that he is your cousin, and that family owes family twenty coin.', [
      C('Pay your cousin', null, 0, { coin: -20, respect: 2, text: 'He weeps. He might even be your cousin. Down here nobody can prove anything.' }),
      C('Ask about grandmother', 'int', 11, { text: 'He gets her name wrong. He leaves very quickly.' }, { coin: -10, text: 'He gets it right. You pay half, rattled.' })]),
    // ---- standing
    E('Fresh Meat Tax', lv(1, 3), () => 'Three Rookeries boys tell you new fighters pay a toll on this street. They have a sign. They made the sign.', [
      C('Pay the toll', null, 0, { coin: -15, text: 'They thank you very politely and go and spend it on pies.' }),
      C('Make an example', 'str', 11, { respect: 7, text: 'You only have to make an example of one. The sign goes in the drain.' }, { coin: -25, text: 'There were four. The fourth had a brick.' }),
      C('Ask who is in charge', 'cha', 12, { respect: 4, text: 'Their mother. You find her. They pay YOU a toll now.' }, { coin: -15, text: 'They are. They are very insulted you asked.' })]),
    E('The Little Fan', st => G.rankOf(st.respect) >= 2, () => 'A child with a stick for a sword has been following you for three streets doing your stance, badly. Their mother is mortified.', [
      C('Show them the real stance', null, 0, { respect: 6, text: 'They do it perfectly, once, and will remember it the rest of their life.' }),
      C('Let them hit you', 'con', 8, { respect: 8, text: 'You go down with great drama. The street applauds the child. The child is going to be a problem in ten years.' }, { respect: 4, text: 'The stick catches you in the eye. You make it look intentional.' })]),
    E('A Knife in the Crowd', lv(6), () => 'Crossing the market at the busy hour, you feel somebody too close, moving with you. Somebody paid for this.', [
      C('Turn first', 'dex', 14, { respect: 12, coin: 40, text: 'You have their wrist before the blade is clear. The purse they were paid with is now yours.' }, { coin: -20, text: 'A long scratch along your ribs and a lot of people suddenly looking elsewhere. You pay a stitcher.' }),
      C('Feel for it', 'wis', 13, { respect: 8, text: 'You step left at the right moment. They stab a barrel. You leave them to explain it.' }, { coin: -20, text: 'You feel it too late. A stitcher, twenty coin.' })]),
    E('Your Name on a Wall', st => G.rankOf(st.respect) >= 3, () => 'Somebody has painted your name on the wall of the Ember Rows, very large, with a crown over it. The crown is a little premature.', [
      C('Leave it', null, 0, { respect: 6, text: 'By the next morning there are three more. One of them is spelled right.' }),
      C('Paint it out yourself', null, 0, { respect: 3, text: 'People see you do it. That gets talked about too, and better.' })]),
    // ---- situations
    E('The Gravedigger', st => (st.fallen || []).length >= 3, () => { const f = G.state.fallen || []; return 'The man who digs for the pit has a list, and he wants to ask you about the names on it. ' + f.slice(-3).map(x => x.n).join(', ') + '. He wants to know what they said at the end.'; }, [
      C('Tell him the truth', 'wis', 10, { respect: 6, text: 'He writes it all down. Nobody else ever asks him what they said.' }, { text: 'You cannot remember. He writes that down too.' }),
      C('Tell him something kinder', 'cha', 10, { respect: 4, coin: 10, text: 'He knows. He pays you for it anyway. Somebody has to say it.' }, { text: 'He knows, and does not pay.' })]),
    E('Clockwork Sparrow', st => !!(st.signed || st.bound), () => 'A tiny golden bird lands on your shoulder, ticking, and says in a very familiar voice: “I can see you, you know. Spend wisely, vessel.”', [
      C('Let it ride', null, 0, { coin: 25, text: 'It drops a coin down your collar and flies off cackling in clockwork.' }),
      C('Swat it', 'dex', 12, { respect: 6, text: 'It shatters into very expensive pieces. Somewhere under the market somebody is shrieking.' }, { coin: -20, text: 'It dodges, and returns with a bill for the attempted damage.' })]),
    E('Marc’s Associate', st => (st.loanM || 0) > 0, () => 'A large man in a small hat introduces himself as “an associate of Marc’s”. He is holding a note. The note has your name on it and a smiley face.', [
      C('Pay something on account', null, 0, { coin: -30, text: '“Marc said you were good for it.” He tips the small hat.' }),
      C('Explain you are in a dangerous profession', 'cha', 12, { respect: 3, text: 'He nods slowly. He has a mother. He leaves.' }, { coin: -45, text: 'He also has a dangerous profession.' })]),
    E('Unsigned', st => !(st.signed || st.bound) && (st.deaths || 0) >= 1, () => 'A woman in grey stops you outside the Lamp Tavern. She knows. You can see that she knows. “I walked out of the garden too, once,” she says. “Do you want to know how?”', [
      C('Listen', 'wis', 11, { xp: 40, bless: 1, text: '“They fight each other. Let them.” She goes before you can ask her name. You go into your next bout with it in your head.' }, { text: 'She tells you, but it does not make sense. You think she might not have walked out at all.' }),
      C('Walk away', null, 0, { text: 'You hear her laughing, in a voice that sounds like a clock.' })]),
    // ---- anyone
    E('Rat Race', null, () => 'Behind the Lamp Tavern they are racing rats down a gutter. The favourite is called Chancellor. The outsider is called Small Margaret.', [
      C('Ten on Chancellor', null, 9, { coin: 15, text: 'Chancellor wins by a whisker. Literally.' }, { coin: -10, text: 'Chancellor stops to eat something.' }),
      C('Ten on Small Margaret', null, 15, { coin: 70, respect: 3, text: 'SMALL MARGARET. The gutter goes wild.' }, { coin: -10, text: 'Small Margaret does not start.' }),
      C('Just watch', null, 0, { text: 'It is the best thing that happens all week.' })]),
    E('Spilled Ale', null, () => 'A big drunk turns round too fast and puts a full mug down your front. He looks at you. You look at him. The tavern goes quiet.', [
      C('Laugh it off', 'cha', 10, { respect: 4, coin: 5, text: 'He buys you another, and a pie. You are friends now. He is very sorry and very large.' }, { respect: -2, text: 'He takes the laugh the wrong way. You leave before it becomes a bout.' }),
      C('Put him down', 'str', 12, { respect: 7, text: 'One move. The tavern goes back to its business. Somebody mops.' }, { coin: -15, text: 'He was bigger than he looked. You pay for the table.' })]),
    E('The Lost Page', null, () => 'A page from the Blood Ledger is blowing down the street. Somebody’s debts. Somebody’s name. Somebody will pay to have it back, and somebody else will pay to have it burned.', [
      C('Return it to the Keeper', null, 0, { respect: 8, text: 'The Keeper looks at it, then at you, and writes something next to your name. It is a good something.' }),
      C('Find who it belongs to', 'int', 12, { coin: 55, text: 'A grateful baker. Very grateful. Mostly in coin.' }, { text: 'Three people claim it. You give up and burn it, which pleases one of them.' })]),
    E('The Busker’s Duet', null, () => 'The busker with the hurdy-gurdy has lost his singer. He points his bow at you. The crowd starts clapping before you can refuse.', [
      C('Sing', 'cha', 12, { respect: 8, coin: 12, text: 'Not well. With feeling. They throw coins anyway.' }, { respect: -3, text: 'A dog joins in. The dog is better.' }),
      C('Dance instead', 'dex', 11, { respect: 6, text: 'The pit-step, but slower. The crowd loves it more than they will admit.' }, { text: 'You do not dance. You discover this publicly.' })])
  ];
  // the outcome rules for these; anything they share with the old events works the same
  function applyMore(o) {
    const st = G.state, bits = [];
    if (o.coin) { const c = Math.max(-st.coin, o.coin); st.coin += c; bits.push((c > 0 ? '+' : '') + c + ' coin'); }
    if (o.respect) { st.respect = Math.max(0, st.respect + o.respect); bits.push((o.respect > 0 ? '+' : '') + o.respect + ' respect'); }
    if (o.xp) { st.hero.xp = (st.hero.xp || 0) + o.xp; bits.push('+' + o.xp + ' XP'); }
    if (o.potion && st.potions < G.POTION_MAX) { st.potions++; bits.push('+1 potion'); }
    if (o.bless) { st.bless = 1; bits.push('warded for your next bout'); }
    G.save(); return bits.join(' · ');
  }
  const d20 = () => 1 + Math.floor(Math.random() * 20);
  const ev0 = ui.event;
  ui.event = function () {
    const st = G.state; if (!st || !st.hero) return ev0.apply(this, arguments);
    const recent = st.evRecent || (st.evRecent = []);
    const pool = []; MORE.forEach(e => { if (recent.includes(e.title)) return; if (e.when && !e.when(st)) return; pool.push([e, e.when ? 3 : 1]); });
    (G.EVENTS || []).forEach(e => { if (!recent.includes(e.title)) pool.push([null, 1, e.title]); });
    let tot = pool.reduce((a, q) => a + q[1], 0), r = Math.random() * tot, pick = pool[pool.length - 1];
    for (const q of pool) { r -= q[1]; if (r <= 0) { pick = q; break; } }
    const title = pick[0] ? pick[0].title : pick[2]; recent.push(title); while (recent.length > 8) recent.shift(); G.save();
    if (!pick[0]) { const all = G.EVENTS, keep = all.slice(); G.EVENTS = all.filter(e => e.title === title); try { return ev0.apply(this, arguments); } finally { G.EVENTS = keep; } }
    const ev = pick[0], mod = s => G.mod(st.hero.stats[s]); G.afterFight = false;
    const text = typeof ev.text === 'function' ? ev.text() : ev.text;
    show('<div class="card small letter event"><h2>' + ev.title + '</h2><p>' + text + '</p><div class="choices">' +
      ev.choices.map((c, i) => '<button data-c="' + i + '"><b>' + c.label + '</b><small>' + (c.stat ? c.stat.toUpperCase() + ' check · d20 ' + G.fmtMod(mod(c.stat)) + ' vs DC ' + c.dc : c.dc ? 'Luck · d20 vs DC ' + c.dc : 'No roll') + '</small></button>').join('') + '</div></div>');
    on('[data-c]', el => {
      const c = ev.choices[+el.dataset.c]; let ok = true, line = '';
      if (c.dc) { const r2 = d20(), m = c.stat ? mod(c.stat) : 0, t2 = r2 + m; ok = r2 !== 1 && (r2 === 20 || t2 >= c.dc); line = '<div class="roll ' + (ok ? 'ok' : 'no') + '"><span class="die">' + r2 + '</span><b>' + (r2 === 20 ? 'Natural 20!' : r2 === 1 ? 'Natural 1.' : r2 + (c.stat ? ' ' + G.fmtMod(m) + ' = ' + t2 : '') + ' against DC ' + c.dc) + '</b><small>' + (ok ? 'Success' : 'Failure') + '</small></div>'; G.sfx(ok ? 'coin' : 'deny'); }
      const o = ok ? c.win : (c.lose || c.win), got = applyMore(o);
      show('<div class="card small letter event"><h2>' + ev.title + '</h2>' + line + '<p>' + o.text + '</p>' + (got ? '<p class="got">' + got + '</p>' : '') + '<div class="row end"><button class="big" id="x">Carry on</button></div></div>');
      on('#x', () => { ui.close(); ui.topbar(); const h = st.hero; if (o.xp && h.level < G.MAX_LEVEL && h.xp >= G.XP_FOR[h.level + 1] && ui.levelCheck) ui.levelCheck(); });
    });
  };
  G.EVENTS_MORE = MORE;
})();
