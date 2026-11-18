// Guttercrown — the realm above: the Long Stair, the throne's proclamations, the Crown's tithe, and the street events that come with them
(function () {
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const QUEEN = 'Eerin Koheneim', KING = 'Vilhelm van Koheneim IV';

  // Nailed to the gate at the foot of the stair. A new one goes up after every bout.
  const PROCLAIM = [
    'By the grace of Queen ' + QUEEN + ': the Long Stair remains sealed. Those below are reminded that they are below.',
    'Let it be known that no blade longer than a hand may be carried in Highmarch. What is carried beneath Highmarch is not the Crown’s concern.',
    'The Crown’s tithe falls due on the first of the month. The Deep Guild will collect it. The Deep Guild always collects.',
    'By order of ' + KING + ', Lord of the Seal-Wardens: any person found on the Stair above the ninth step will be returned to the foot of it. Once.',
    'Games of chance are forbidden throughout the realm. This notice has been posted at the foot of the Stair so that it may be said to have been posted.',
    'Her Majesty is pleased to learn that the pit has a new name on its Ledger. Her Majesty is not otherwise pleased or displeased.',
    'The Seal-Wardens remind the Undercity that lamps are a privilege. Forty years of peace above have been kept by forty years of quiet below.',
    'A reward of five hundred coin is offered for the person who chalked a crown on this gate. The chalk crown is to be left where it is.',
    'It is forbidden to speak of the mines as having been closed. The mines were completed.',
    'Queen ' + QUEEN + ' and ' + KING + ' send their regard to the wearer of the brass crown, and their reminder that it is brass.'
  ];
  const bouts = st => Object.keys(st.wins).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);
  ui.stair = function (line) {
    G.state.stairSeen = Object.keys(G.state.wins).length + (G.state.losses || 0);
    const st = G.state, n = bouts(st), due = Math.max(15, Math.round(st.coin * 0.1)), paid = st.tithed === n, gain = Math.max(3, Math.round(due / 3));
    show('<div class="card small"><h2>The Long Stair</h2><p>Nine hundred steps up to Highmarch, behind an iron gate with two seals on it: a faerie wing and a gauntlet. Two Seal-Wardens stand at the foot. Nobody has been let through in forty years.</p>' +
      '<div class="proc"><small>Posted this day by order of the throne</small><p>' + PROCLAIM[n % PROCLAIM.length] + '</p><i>' + QUEEN + ' · ' + KING + '</i></div>' +
      (line ? '<p class="rankup">' + line + '</p>' : '') +
      '<div class="ab-row"><div class="ab-ic pas">♛</div><div class="ab-tx"><b>Pay the Crown’s tithe</b><small>' + due + ' coin · once after each bout</small><p>Nobody makes a fighter pay it in person. Those who do are noticed: +' + gain + ' respect.</p></div>' + (paid ? '<span class="lock">Paid</span>' : '<button class="big" id="ti"' + (st.coin < due ? ' disabled' : '') + '>Pay ' + due + '</button>') + '</div>' +
      '<div class="row end"><button class="big" id="x">Step back</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); });
    on('#ti', () => { if (st.coin < due || paid) return; st.coin -= due; st.respect += gain; st.tithed = n; G.save(); G.sfx('coin'); ui.topbar(); ui.stair('The Warden counts it twice, stamps your hand with the gauntlet seal, and says nothing. Word gets round by evening.'); });
  };

  // ------------------------------------------------------------ the street knows who rules
  const E = (title, text, choices) => ({ title, text, choices }), C = (label, stat, dc, win, lose) => ({ label, stat, dc, win, lose });
  if (G.EVENTS) G.EVENTS.push(
    E('Papers', 'A Seal-Warden in white plate has come down three levels further than they usually bother to. She holds out a gauntlet. “Seal,” she says. You do not have a seal. Nobody down here has a seal.', [
      C('Hand her the tithe', null, 0, { coin: -25, text: 'She weighs it, nods once, and looks straight through you. That is what a seal buys.' }),
      C('Stand your ground', 'str', 13, { respect: 12, text: 'She studies you for a long moment. “The pit,” she says. “Her Majesty hears about the pit.” She steps aside.' }, { coin: -40, text: 'There are four more of them round the corner. There are always four more round the corner.' }),
      C('Talk like you belong', 'cha', 12, { respect: 6, coin: 15, text: 'By the end of it she is apologising, and has paid you for directions.' }, { coin: -25, text: 'She has heard it. She has heard all of it.' })]),
    E('The Tithe Cart', 'The Guild’s tithe cart is on its way to the Long Stair, heavy with the Crown’s tenth. A wheel has caught in a drain. The two collectors are looking at you.', [
      C('Put your shoulder to it', 'str', 11, { respect: 10, coin: 20, text: 'It comes free. A collector presses coin into your hand and asks your name for the Ledger. The good column.' }, { respect: 2, text: 'It does not move. You have at least been seen trying.' }),
      C('Help yourself while they push', 'dex', 14, { coin: 70, text: 'One purse lighter. The Crown will not miss it. The Guild will make up the difference from somebody else.' }, { coin: -35, text: 'A collector’s hand closes on your wrist. The fine is written down before you have finished lying.' }),
      C('Walk on', null, 0, { text: 'Not your cart. Not your Crown.' })]),
    E('A Plain Cloak', 'A tall man in a plain grey cloak has been watching you from the edge of the lamplight. His boots are too good for this level. So is his posture. He asks, quietly, whether the pit is as honest as they say.', [
      C('Tell him the truth', 'wis', 11, { respect: 14, text: '“Honest enough,” he says, “for a cellar.” He leaves a gold piece stamped with a gauntlet on the wall beside you. Nobody will change it, but everybody has now seen you holding it.' }, { respect: 3, text: 'He listens, nods, and is gone between two lamps. You are not sure what you told him.' }),
      C('Ask who is asking', 'cha', 13, { coin: 40, respect: 8, text: 'He almost smiles. “The fourth of my name to be asked that,” he says, and pays you for the answer he did not give.' }, { text: 'The cloak is empty air. He was never going to answer.' }),
      C('Keep walking', null, 0, { text: 'Some questions are better left with the people who can afford them.' })])
  );
  const always = () => true;
  if (G.LORE) G.LORE.push(
    { sec: 'The World', title: 'The Long Stair', unlock: always, body: 'Nine hundred steps cut through the rock from the Lamp Market to the lowest cellar of Highmarch. It was the miners’ road once. ' + KING + ' closed it with his own seal the day the seams ran out, and the gate has opened since only for the tithe cart. Children dare each other to touch the ninth step.' },
    { sec: 'The World', title: 'The Seal-Wardens', unlock: always, body: 'White plate, gold trim, no names. The Wardens are the throne’s hands: they check seals above and guard the foot of the Stair below. They do not police the Undercity and have never pretended to. They are there to make sure it stays where it is.' },
    { sec: 'The World', title: 'The Crown’s Tithe', unlock: st => G.rankOf(st.respect) >= 1, body: 'One coin in ten of everything the Deep Guild takes goes up the Long Stair on the first of the month. In return the throne does not look down. It is the cheapest peace in the realm and both sides know it. A fighter who pays a share in person, at the gate, is doing something nobody asked for, which is exactly why people notice.' }
  );
  if (G.LORE) G.LORE.push(
    { sec: 'The Pit', title: 'The Reckoning of Blows', unlock: always, body: 'Pit hands do not talk about health. They talk about posture. A fighter who is hit, blocked or turned aside gives ground a little each time, and when there is no ground left they go down on one knee, wide open. Light blows are quick and cheap. A heavy blow is slow, cannot be knocked aside, and goes through a raised guard. Turn a blow at the last instant and the next one is yours: a riposte. Two blows of equal weight that meet edge to edge are a clash, and the crowd loves a clash.' },
    { sec: 'The Pit', title: 'Paper on the Board', unlock: always, body: 'Anyone with coin can nail a contract to the Notice Board: a thing they want to see done in the pit, and what they will pay to see it. The Guild takes no cut, which is how you know the Guild is the one posting half of them. A contract taken down and not honoured is not held against you. The paper says so, in smaller writing.' },
    { sec: 'The World', title: 'The Lower Levels', unlock: st => G.rankOf(st.respect) >= 2, body: 'The Lamp Market is the third level of nine. Below it the workings go on down: tenements cut into old ore galleries, the cisterns, the flooded seventh where the glowcaps are farmed, and two more that nobody has a good reason to visit. From the market kerb you can see their lamps, falling away like a second sky that somebody dropped.' },
    { sec: 'Faces', title: 'What They Carry', unlock: st => !!st.wins.maul, body: 'Sister Maul swings a penitent’s flail, because a mace is over too quickly to pray through. Kessa Cinderhand learned to throw frost so that the next fire would have something to melt. Brakk Ironjaw carries the warhammer he was issued to break a strike, and never handed back. Vexa fences with a duellist’s rapier taken from a Highmarch officer who came down the Stair on a dare.' }
  );
  // the last page of the slice: the throne takes notice
  const champ0 = ui.champion;
  ui.champion = function () {
    champ0.apply(this, arguments);
    const dim = document.querySelector('#panel .card.res .dim'); if (!dim) return;
    const p = document.createElement('p'); p.className = 'proc'; p.innerHTML = '<small>Delivered by a Seal-Warden, on white paper, under two seals</small><p>The cellar has its monarch. See that it stays in the cellar.</p><i>' + QUEEN + ' · ' + KING + '</i>'; dim.parentNode.insertBefore(p, dim);
  };
})();
