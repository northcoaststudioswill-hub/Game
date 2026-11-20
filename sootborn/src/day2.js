// ============================================================
// content/day2 — FIRST FIRE. The second day: Fuse Room C, Seren's lantern,
// the Ember Ring, the festival, and what Kael hangs on the Pillar.
// Day-2 scripts wrap the day-1 ones: a D2 entry that returns null falls through.
// ============================================================
Object.assign(CAST, {
  garran: { name: 'Garran, Crew Five', look: () => ({ skin: '#8a5a3e', hair: '#1a1014', style: 'bald', extra: 'beard', shirt: '#6a3a2a', pants: '#2a2420' }) },
  pike: { name: 'Pike, Crew Five', look: () => ({ skin: '#8a5a3e', hair: '#1a1014', style: 'spiky', shirt: '#6a3a2a', pants: '#2a2420' }) }
});
Object.assign(MOUTH, { garran: 'frown', pike: 'smirk' });
NPCS.push(
  { id: 'proctor', map: 'square', at: [13, 9], dir: 1, when: () => F('day1Done') && !F('sull2Done') && !F('day2Done') },
  { id: 'hollis', map: 'square', at: [19, 6], dir: 3, when: () => F('day1Done') },
  { id: 'garran', map: 'square', at: [24, 7], dir: 2, when: () => F('day1Done') && !F('day2Done') && (G.flags.ring | 0) < 2 },
  { id: 'vale', map: 'fuse', at: [5, 5], dir: 1, when: () => F('fuseDone') && !F('vale2Done') }
);

const ray = id => { if (G.flags['ray_' + id]) return; G.flags['ray_' + id] = 1; G.flags.rays = (G.flags.rays || 0) + 1; Sound.play('coin'); HUD.toast(`A ray for the lantern · ${G.flags.rays}`); };
const rays = () => G.flags.rays | 0;
const parts = () => (F('gotWire') ? 1 : 0) + (F('gotGold') ? 1 : 0) + (F('gotWick') ? 1 : 0);
const once = (k, a, b) => F(k) ? b : a.concat([fx(() => setF(k))]);

Object.assign(JOURNAL, {
  q_list: { tab: 'evidence', title: "Seren's list", body: () => "Found folded into her lantern frame. WIRE — Ivo owes me. GOLD — Orin has chalk-gold, don't ask where. WICK — Nell, trade her a joke. MAKE KAEL CARRY IT. HE'LL PRETEND HE DOESN'T WANT TO." + (F('lanternBuilt') ? ` (Finished. ${rays()} rays on it that she never painted.)` : ` (${parts()} of 3 found.)`) },
  e_l0: { tab: 'evidence', title: 'L0 STBY', body: () => 'Under forty years of grime in Fuse Room C: the "standby" bus is Lift Zero. Every First Fire the lamps of Tier 6 go dim, and everyone calls it ceremony. It is the lift, charging, on our lights.' + (F('spareOn') ? ' (You threw the spare breaker onto Tier 6. Tonight is two amps brighter.)' : '') },
  e_remit: { tab: 'evidence', title: 'The envelopes', body: () => "INFORMANT REMITTANCE — 50 SCRIP — WITH GRATITUDE. Sealed, in Dace's locker. His note: nobody informed. The Authority sends one to everyone near a commitment, so the whole row wonders about each other forever." + (F('tookBlood') ? ' (You took it. Fifty scrip.)' : F('burnBlood') ? ' (You are carrying it to the fire.)' : ' (You left it sealed.)') },
  e_ticket: { tab: 'evidence', title: 'A ticket stub', body: 'Yellow paper, soft with age: LIFT 0 — ASCENT — ONE (1) — VOID. Fen found it in a drain as a boy. Somebody from down here went up once. With a ticket. Like it was a tram.' },
  e_dacenote: { tab: 'evidence', title: "Dace's chalk", body: "The collapse in the old tunnel has a gap now, shoulder-wide. His lamp was still warm. On the wall: 'K — IF YOU FOUND THIS, DON'T FOLLOW YET. LIGHT HER LANTERN FIRST. THEN COME. — D.M.' He is alive. He is down there." },
  e_slip: { tab: 'evidence', title: '"More yellow than that"', body: 'Tavi told the High Auditor the lantern was the sun. She said: "Is it. It is rather more yellow than—" and stopped. You were raised on gauges. You know a needle twitch when you see one. More yellow than WHAT?' },
  e_belt: { tab: 'evidence', title: 'The Ember Ring belt', body: "A strip of conveyor belting with three notches. Two are Seren's. One is yours. First Fire rules: fists, stay in the chalk, and nothing that happens inside it gets written down." },
  e_leaf: { tab: 'evidence', title: 'A leaf', body: "Lift Zero opened by itself, empty, for eleven seconds. Clean water on the floor, and one green leaf the size of a child's hand. Tavi asked what a leaf was." },
  pl_fuse: { tab: 'places', title: 'Fuse Room C', body: "Off Bay 3. The panel that splits Tier 6's power between its own lamps and a bus the work orders only call STANDBY. Crew Three's lockers are here. Hers has been emptied." }
});

const FUSE_PUZZLES = [
  { kind: 'breaker', wo: 'WO-116 · FUSE C', name: 'FUSE C - PANEL 1', tip: 'Each breaker carries a load. Push it up to feed the top bus, down for the low bus. Hit both numbers exactly.', labA: 'BAY 3 LAMPS', labB: 'CONVEYORS', loads: [4, 3, 5, 2], A: 7, B: 7, sol: [1, 1, 2, 2], leaveMsg: 'Panel still ticking — come back any time' },
  { kind: 'breaker', wo: 'WO-116 · FUSE C', name: 'FUSE C - PANEL 2', tip: 'Festival load. The standby bus gets exactly 19. Tier 6 gets what is left: 15. One breaker stays spare.', labA: 'TIER 6 LIGHTS', labB: 'STANDBY', loads: [9, 7, 6, 5, 4, 3, 2], A: 15, B: 19, sol: [1, 2, 1, 2, 2, 2, 0], doneText: 'PANEL BALANCED', leaveMsg: 'Panel still ticking — come back any time' }
];

// ---------------- the Ember Ring
const RING = [
  () => ({ pre: [say('ivo', "I'm not fighting him. Hollis. I am NOT — fine. FINE. For the wire bet."), say('ivo', 'Not the face, Kael. I sell with this face.')],
    def: { title: 'BOUT ONE', sub: 'IVO - HE BITES', foes: [{ id: 'ivo', name: 'Ivo', kind: 'jab', hp: 9 }], taunt: { 0: ['NOT THE FACE!', 'OW! RUDE!'] } },
    win: [say('ivo', 'I let you win. Tell Tavi I let you win.'), fx(() => { G.scrip += 4; Sound.play('coin'); HUD.toast('+4 scrip'); })] }),
  () => F('threatenedProctor') ? {
    pre: [say('hollis', '...Kael. Proctor at the chalk.'), say('proctor', "Old rule, isn't it? Anyone steps in. Nothing gets written down."), say('proctor', "I'd like that. Five minutes with nothing written down.")],
    def: { title: 'BOUT TWO', sub: 'PROCTOR SULL - NOTHING GETS WRITTEN DOWN', foes: [{ id: 'proctor', name: 'Sull', kind: 'baton', hp: 22 }], taunt: { 0: ['SPELL IT NOW, SOOT!', 'STAY DOWN!'] } },
    win: [narr('Sull sits in the chalk dust with his lip split, breathing like a bellows. The square has gone silent. Nobody down here has ever seen a Proctor on the ground.'), say('proctor', '...Nothing written down.'), say('kael', 'Nothing written down.'), narr("He gets up by himself. You don't offer a hand and he doesn't look for one. But he will walk tonight's patrol with a limp."), fx(() => { setF('beatSull'); G.scrip += 8; Sound.play('coin'); })]
  } : {
    pre: [say('hollis', 'Crew Five. The Garran brothers. They share one brain, and most of it is in the big one.'), say('garran', 'Two on one. Crew Five rules.'), say('kael', 'Crew Five can count to two? Mara owes me a scrip.')],
    def: { title: 'BOUT TWO', sub: 'TWO ON ONE - CREW FIVE RULES', foes: [{ id: 'garran', name: 'Garran', kind: 'heavy', hp: 16 }, { id: 'pike', name: 'Pike', kind: 'quick', hp: 8 }], taunt: { 0: ['HOLD STILL!'], 1: ['TOO SLOW!'] } },
    win: [say('garran', '...Good left. Hers was better.'), say('kael', 'Everyone keeps telling me.'), fx(() => { G.scrip += 8; Sound.play('coin'); HUD.toast('+8 scrip'); })]
  },
  () => ({ pre: [say('hollis', "Last bout. A belt-holder's second stands for her when she can't. Seren's second was —"), say('mara', 'Me.'), narr("Mara steps over the chalk, rolling her sleeves. Forty years of hauling valve wheels in those forearms."), say('mara', "You've wanted to hit me for forty-two days, boy. In here it's legal."),
      { choice: [{ t: "I don't want to hit you, Mara.", then: [say('mara', 'Liar. Hands up.')] }, { t: 'Aye. I have.', fx: () => setF('ringHonest'), then: [say('mara', 'Good. Honest. Hands up.')] }] }],
    def: { title: 'FINAL BOUT', sub: "MARA VENN - FOREWOMAN'S PRIVILEGE", winText: 'THE BELT IS YOURS', foes: [{ id: 'mara', name: 'Mara', kind: 'boss', hp: 39 }], taunt: { 0: ['I HELD YOU DOWN. HIT ME!', 'SHE BOUGHT YOUR LIFE!', 'THERE HE IS.'] } },
    win: [narr('Mara sits down hard in the chalk. And laughs. A real one, rusty from forty-two days of not being used.'), say('mara', "There he is. There's the one she married."), say('mara', '...She had a better left.'),
      { choice: [{ t: '(Help her up.)', fx: () => { trust('mara', 1); setF('ringMercy'); }, then: [say('mara', "I'm sorry, Kael. I'd do it again, and I'm sorry. Both. Every day.")] }, { t: "I'm still angry.", fx: () => fury(1), then: [say('mara', "Good. Aim it up, not sideways. I'll hold the bag until you can reach them.")] }] },
      narr('Hollis lifts the belt off his good shoulder: a strip of conveyor belting with two notches cut in it. He cuts a third.'), say('hollis', "Brennick. Belt-holder. She'd have been unbearable about it."), fx(() => { setF('ringChamp'); addJ('e_belt'); Sound.play('clue'); })] })
];
function ringBout() {
  const i = G.flags.ring | 0, B = RING[i]();
  if (i === 2) B.def.arts = [{ at: .5, name: 'FORTY-TWO DAYS', line: 'SHE HELD ME DOWN WHILE THE DOORS CLOSED. SHE HAS NOT SLEPT SINCE EITHER.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }];
  B.def.voice = [{ at: [[1, 'THE CHALK CIRCLE. SEREN HELD THE BELT HERE. I HELD HER COAT.'], [9, 'IVO FIGHTS THE WAY HE SELLS. FAST, AND HOPING YOU WILL NOT LOOK TOO CLOSELY.']], fury: 'FORTY-TWO DAYS OF THIS IN MY HANDS, AND NOWHERE TO PUT IT.' },
    { at: [[1, 'NOTHING GETS WRITTEN DOWN IN THE RING. THAT IS THE WHOLE POINT OF THE RING.'], [12, 'WATCH THE GROUND, NOT THE FISTS. SHE TAUGHT ME THAT. I WAS A BAD STUDENT.']], hurt: 'GOOD. SOMETHING I CAN FEEL.', fury: 'THERE IT IS.', eleven: 'ELEVEN SECONDS. THAT IS HOW LONG THE DOORS STOOD OPEN.' },
    { at: [[1, 'MARA HELD ME DOWN WHILE THE DOORS CLOSED. NOW SHE IS ASKING ME TO HIT HER FOR IT.'], [12, 'EVERY ONE I LAND, SHE NODS.']], hurt: 'FORTY YEARS OF VALVE WHEELS IN THAT ARM.', half: 'I THOUGHT THIS WOULD FEEL LIKE SOMETHING.', eleven: 'ONE FOR EVERY SECOND. SHE COUNTS THEM WITH ME.' }][i];
  return B.pre.concat([fx(() => Brawl.start(B.def, win => {
    if (win) { G.flags.ring = i + 1; Game.autosave(); Dialogue.start(B.win, () => { World.afterBeat(); Game.autosave(); }); }
    else Dialogue.start([say('hollis', ["Up you get. Chalk's still wet. Go again when your ears stop ringing.", 'Watch the ground, not the fists. The red tells you where it lands. Step THROUGH it.', 'She lost her first six, you know. Never told you that, did she.'][Math.min(3, G.flags.ringLoss = (G.flags.ringLoss | 0) + 1) - 1])], () => World.afterBeat());
  }))]);
}

// ---------------- talk
const D2T = {
  tavi() {
    if (!F('d2Tavi')) return [
      say('tavi', "Up. UP! It's First Fire. You promised you wouldn't sleep through it this year."),
      say('you', "I've never slept through it."),
      say('tavi', 'Last year you proposed through it. Same thing. Nobody got any sleep.'),
      narr("Seren's lantern is on the table. A wire frame, bent on one side. A paper sun, half painted. No wick."),
      say('tavi', "I tried to finish it. I can't. The frame's bent and the gold ran out and there's no wick. And — look. She left a list. In the frame."),
      narr('A ration wrapper, folded into the wire. Her handwriting, leaning forward like it is late for something.'),
      narr("WIRE — Ivo owes me.\nGOLD — Orin has chalk-gold. Don't ask where.\nWICK — Nell. Trade her a joke."),
      narr("And at the bottom, underlined twice: MAKE KAEL CARRY IT. HE'LL PRETEND HE DOESN'T WANT TO."),
      { choice: [
        { t: "I don't want to carry it.", then: [say('tavi', "...She SAID you'd say that. It's on the LIST, Kael.")] },
        { t: 'Then we finish it. Tonight it burns.', fx: () => trust('tavi', 1), then: [say('tavi', "Really? Not 'we'll see'? Not the face?"), say('you', 'Not the face.')] },
        { t: "A lantern won't bring her back, Tav.", fx: () => setF('bitterLantern'), then: [say('tavi', "I know that. I'm eleven, not stupid."), say('tavi', "It's not for bringing her back. It's so they have to LOOK at her.")] }
      ] },
      say('tavi', "And get rays. Paper ones. Everybody who loved her gets to add a ray. That's the rule. I made the rule. It's a good rule."),
      say('tavi', 'Mara wants you first, though. Board says Fuse Room C.'),
      fx(() => { setF('d2Tavi'); addJ('q_list'); Game.autosave(); })
    ];
    if (!F('lanternBuilt')) return [say('tavi', parts() === 3 ? "You've got all three! The shelf. Come ON." : `Wire, gold, wick. You've got ${parts()}. And ${rays()} ray${rays() === 1 ? '' : 's'}. Everybody gets a ray!`)];
    if (!F('clock2')) return [say('tavi', "It's done. It's really done."), say('tavi', "But you can't skip shift on First Fire. Mara will skin you and hang YOU on the Pillar. Go clock out. Then come get me.")];
    return [say('tavi', "Last bell's coming. I can feel the lamps getting ready to dim."), say('tavi', "Once we go, we're out till it's over. Ready?"),
      { choice: [{ t: "Ready. Bring your coat, the square's cold after bell.", then: [fx(() => Game.startFestival())] }, { t: 'Not yet. Give me a minute.', then: [say('tavi', "One minute. I'm counting. One...")] }] }];
  },
  mara() {
    if (!F('mara2')) return [
      say('mara', "You're early. Don't make it a habit, I'll start expecting things."),
      say('mara', "Dace's locker is still locked. Nobody has come for his things. Nobody has come to tell me to stop waiting for him, either."),
      ...(F('bledAgain') ? [say('mara', 'Ward gauge ran fat for an hour yesterday. Vale pulled the Seven logbook at first bell. I am telling you so your face is ready.')] : []),
      say('mara', 'WO-116. Fuse Room C. Festival load. Every year the Authority wants the standby bus topped up before First Fire, and every year our lamps go dim to pay for it.'),
      say('you', 'Standby for what?'),
      say('mara', "For whatever they're standing by for. Door's on the north wall, past the furnace. Balance the panel. Both buses, exact."),
      fx(() => { setF('mara2'); setF('fuseOrder'); Game.autosave(); })
    ];
    if (!F('fuseDone')) return [say('mara', 'Fuse Room C. North wall, past the furnace. Both buses, exact.')];
    if (!F('clock2')) return [
      say('mara', "Panel's holding?"), say('you', 'Both buses. Exact.'),
      ...(F('spareOn') ? [say('mara', "Funny thing. The bay lamps are brighter than I've seen them at a First Fire in twenty years. Must be a fault."), say('you', 'Must be.'), say('mara', '...Must be.')] : []),
      say('mara', "Vale came out of that room after you looking like a man who'd swallowed a bolt. I don't want to know."),
      say('mara', 'Sixteen on your chit. They took their two.'),
      fx(() => { G.scrip += 16; Sound.play('coin'); HUD.toast('+16 scrip (18 − 2 fuel)'); }),
      narr('She reaches into her apron and pulls out a strip of red cloth, frayed at one end.'),
      say('mara', 'Her shift band. She left it in my office the night of — the night you two did the bank. I was going to hand it back in the morning.'),
      say('mara', 'Tavi says there is a rule about rays. Put it on the damn lantern.'),
      fx(() => { ray('mara'); setF('clock2'); Game.autosave(); }),
      say('mara', "Go on. First Fire. I'll be in the square. Back row. Where forepeople stand.")
    ];
    return [say('mara', (G.flags.ring | 0) === 2 ? 'Hollis says you are one bout from her belt. ...I know who stands third. Go and see.' : 'Back row. Go. And eat something first.')];
  },
  vale() { return [say('vale', 'I am not here, Brennick. And neither were you.')]; },
  proctor() {
    const tail = fx(() => { setF('sull2Done'); setF('proctorDone'); addJ('p_sull', true); Game.autosave(); });
    if (F('threatenedProctor')) return [
      say('proctor', 'Brennick. K-A-E-L. See? I kept the spelling.'),
      say('proctor', 'Random inspection. Pockets.'),
      narr('He takes his time. He finds your wage chit and reads it like a menu.'),
      say('proctor', "Fine for obstructing a Proctor: five scrip. Fine for the tone: nothing. The tone I'm keeping."),
      fx(() => { const n = Math.min(5, G.scrip); G.scrip -= n; Sound.play('deny'); HUD.toast(`−${n} scrip`); }),
      say('proctor', 'Your kid. Tavi. Ninth name on the ward board. I can read too, see.'),
      { choice: [
        { t: '(Step into him.) Say that name again.', fx: () => { setF('sullWar'); fury(2); }, then: [narr("Close enough to count his eyelashes. He doesn't step back. But his hand finds his whistle, and stays there."), say('proctor', "Tonight. First Fire. Give me one reason. I'm begging you, soot."), say('proctor', '...Or step in the chalk. Old rule. Nothing gets written down in the chalk.')] },
        { t: '(Breathe. Every breath is hers.) Happy First Fire, Proctor.', fx: () => setF('sullSwallow'), then: [narr('It costs you more than five scrip. He looks almost disappointed.')] }
      ] }, tail];
    if (F('charmedProctor')) return [
      say('proctor', "Don't. Don't do the bucket thing."),
      narr('He is scrubbing again. There are two suns today. Somebody drew a second one in the night.'),
      say('proctor', 'Listen. Bucket-boy. Orders for tonight: no lanterns hung on the Pillar. Cordon after the lighting. Double patrol.'),
      say('proctor', "I walk the long loop. Clockwise. I'm slow on the south side. Bad knee."),
      say('proctor', "I'm not telling you that. I'm complaining about my knee."),
      fx(() => setF('sullTip')), tail];
    return [
      narr('The brush, again. There are two suns today. Somebody drew a second one in the night.'),
      say('proctor', 'Still walking, soot? Good. Keep it up tonight. No lanterns on the Pillar. New order.'),
      { choice: [{ t: 'Whose order?', then: [say('proctor', 'Came down the lift in an envelope. Same as everything.')] }, { t: '(Keep walking.)', then: [narr('The brush keeps scraping. One sun gone. He starts on the second.')] }] }, tail];
  },
  ivo() {
    if (!F('gotWire')) return [
      say('ivo', "Kael! First Fire! I've sold eleven lantern frames and nine of them will even stay up."),
      say('you', "Seren's list says you owe her wire."),
      say('ivo', '...She wrote it DOWN? I owe her wire from a bet. She bet I would cry at your wedding. I said I had dignity.'),
      narr('He digs through the cart and comes up with a coil of copper, bright as a new coin. Much too good to be scrap.'),
      say('ivo', "That's not scrap. I pulled it out of the Lift Zero conduit housing, a month before — before. Don't look at me like that, it was just lying there. Behind a panel. Which I unscrewed."),
      say('ivo', "Authority copper. In her lantern. She'd laugh till she choked."),
      fx(() => { setF('gotWire'); Sound.play('clue'); HUD.toast('Lantern: wire'); }),
      say('ivo', "And a ray. Mine's the label off my lost boot. It's the only part of it I've still got."), fx(() => ray('ivo')),
      say('ivo', F('ivoTalk2') ? 'And — the lift light. It came on again last night. Not eleven seconds. A full minute. Green the whole time.' : 'And — I never told you. Lift Zero. The call light has been coming on at night. Green. Last night, a full minute.'),
      say('ivo', "Something's coming down, Kael. Or somebody. On First Fire."),
      { choice: [
        { t: 'Then tonight you watch the lift, and I watch the fire.', fx: () => { trust('ivo', 1); setF('ivoWatch'); }, then: [say('ivo', "Deal. If it opens I'll scream. I have a very carrying scream.")] },
        { t: 'Stay away from it tonight. Promise me.', then: [say('ivo', 'I promise to stay exactly as far from it as you do.')] }
      ] },
      fx(() => { setF('ivoTalk2'); addJ('e_lift', true); Game.autosave(); })
    ];
    return [say('ivo', F('lanternBuilt') ? "Is that it? ...Oh. Oh, that's her all over. Go. I'll be in the square. Front row. Crying. With dignity." : "Go build it! And try the chalk ring. Hollis is running it. I'm told the first bout is against someone devastatingly handsome.")];
  },
  orin() {
    if (!F('gotGold')) return [
      say('orin', 'First Fire. Hm. You know what the first fire was, boy?'),
      { choice: [{ t: 'The furnace. First thing the founders lit.', then: [say('orin', "That's what the worksheet says.")] }, { t: 'Tell me.' }] },
      say('orin', "My grandmother said the First Fire wasn't lit. It was LEFT. Up there. They sealed the doors on it, and called the dark safety."),
      say('orin', 'She said it was round. She said it moved.'),
      say('you', "Seren's list says you have gold."),
      narr('He looks at you for a long time. Then he unscrews the head of his walking stick. Inside: a stub of something yellow, wrapped in oilcloth.'),
      say('orin', "Engineer's chalk. Authority issue. For marking lines that aren't on the schematics. Forty years I kept it and never found a line worth it."),
      say('orin', 'She did. She came to me with a drawing of a sun and asked what color it should be. I said I didn\'t know. She said: "Then give me the best color you\'ve got, and I\'ll decide."'),
      fx(() => { setF('gotGold'); if (!F('metOrin')) { setF('metOrin'); addJ('p_orin', true); } Sound.play('clue'); HUD.toast('Lantern: gold'); Game.autosave(); }),
      ...(F('sawChalk') ? [say('you', 'O.R. The arrow in the tunnel. That is your mark.'), say('orin', 'Orin Raske. I chalked that arrow the day they made me burn the paper. Pointing the only way I knew was true.')] : [])
    ];
    return [say('orin', 'Round, she said. And it moved. Light the thing, boy. Let an old man see a round one before he goes.')];
  },
  nell() {
    if (!F('gotWick')) return [
      say('nell', "Kael. Quietly — no. Never mind quietly. It's First Fire. Even I am allowed to be loud once a year."),
      say('you', "Seren's list says you have a wick. I'm supposed to trade you a joke."),
      say('nell', 'Go on, then.'),
      { choice: [
        { t: 'What did the valve say to the Proctor? "Gratitude is breath. And yours stinks."', then: [say('nell', "...That's terrible. She would have been so proud.")] },
        { t: "I haven't got one. She took all the jokes with her.", then: [say('nell', 'No. She left them here. Pip tells her noodle joke every morning. Badly. I will take that as payment.')] },
        { t: "A man walks into Lift Zero. That's it. That's the joke.", then: [say('nell', "Ha. — Don't say that one in the square.")] }
      ] },
      narr("She cuts a length of lamp wick from the ward's last spool, and waxes it between two fingers."),
      say('nell', "Ward's own. It lit the night lamp through all three of her nights. I was saving the end of it for something."),
      fx(() => { setF('gotWick'); if (!F('metNell')) { setF('metNell'); addJ('p_nell', true); } setF('visitedWard'); Sound.play('clue'); HUD.toast('Lantern: wick'); Game.autosave(); }),
      say('nell', "The children can't come. Ration air. I can't have forty of them breathing square dust. So do one thing for me."),
      say('nell', 'Carry it past this door tonight. Slowly. So they can see it through the glass.'),
      fx(() => setF('nellAsk')),
      ...(F('nellHook') ? [say('nell', 'And the other thing. The cold thing. After the festival. Not before.')] : [])
    ];
    return [say('nell', 'Past the door. Slowly. Forty faces, Kael. Give them something to look at that is not a ceiling.')];
  },
  pip() { return [say('pip', 'Why did the noodle go to the clinic? Because it felt... wait. Because it was... Seren did it better.'), say('kael', 'Because it was feeling a little strained.'), say('pip', 'STRAINED! Yes! ...I still don\'t get it.')]; },
  mosi() { return once('kidRay', [say('mosi', "I made a ray! It's blue. Because the sky is blue. Pip says green."), say('mosi', 'Ada colored the back. Everyone did a bit. There are forty bits.'), narr('A strip of ration wrapper, colored in forty hands. Somebody has drawn a very small fan on it.'), fx(() => ray('kids'))], [say('mosi', 'Put ours near the top. Where the sky would be.')]); },
  ada() { return [say('ada', 'Will the lantern be warm?'), say('kael', 'Warm as she was.'), say('ada', 'Then hold it near the window. I want to feel it through the glass.')]; },
  bao() {
    return once('ray_baoSeen', [say('bao', 'First Fire broth! Double chili! Half price for widowers, which is a discount I invented this morning.'),
      say('bao', 'They license the lanterns now, you hear? One candle-hour each. A Proctor comes round with a stamp. I asked what happens to an unlicensed light. He said: "It goes out."'),
      narr('He wipes his hands and takes something from under the counter. A square of greasy paper, kept flat under a bowl.'),
      say('bao', 'Her last order. She wrote it down herself, because she said I never listen. "EXTRA CHILI. KAEL PAYS."'), fx(() => ray('bao'))],
    [say('bao', 'Eat before the bell. Nobody should watch an Accredited on an empty stomach.'),
      { choice: [{ t: 'Buy a bowl (4 scrip).', then: [fx(() => { if (G.scrip >= 4) { G.scrip -= 4; Sound.play('coin'); Dialogue.push([narr('Double chili. Your eyes water. You tell yourself it is the chili.')]); } else Dialogue.push([say('bao', 'Four scrip. Even on First Fire.')]); })] }, { t: 'Not now.' }] }]);
  },
  pell() { return once('ray_pellSeen', [say('pell', 'Swept the whole square twice. For the Auditor, they said. I swept it for Seren. Same broom. They cannot tell the difference.'), say('pell', "A ray? I've got — a bristle? No. Here. My sweeping ticket. It's yellow."), fx(() => ray('pell'))], [say('pell', 'Mind the chalk ring. I am NOT sweeping that till morning.')]); },
  juno() { return once('ray_junoSeen', [say('juno', 'I drew FOUR suns last night. The grey man only found two!'), say('juno', "Take my chalk wrapper. It's got sun dust on it. It's basically magic."), fx(() => ray('juno'))], [say('juno', 'Are you gonna fight in the ring? Seren ALWAYS won. She let me hold the belt once. It smelled like the conveyor.')]); },
  hollis() {
    const r = G.flags.ring | 0;
    if (!F('ringIntro')) return [
      say('hollis', "Can't lift a lantern this year. Arm. So I'll hum instead. They can't put a halberd in a hum. Well. They can. It just takes them a while to find it."),
      narr('He holds out a strip cut from his welding apron, scorched black along one edge.'),
      say('hollis', 'Ray. Already burned once. So it knows what it is doing.'), fx(() => ray('hollis')),
      say('hollis', "And the Ember Ring's chalked. First Fire rules: fists, no tools, stay in the chalk. And nothing that happens inside it gets written down. Oldest law we have that they didn't hand us."),
      say('hollis', 'Seren held the belt two years running. Nobody has wanted to take it since.'),
      say('hollis', 'Three bouts and it is yours. Or it stays on my shoulder, and I go on being sad at it.'),
      fx(() => setF('ringIntro')),
      { choice: [{ t: 'Chalk my name.', then: ringBout() }, { t: 'Later.', then: [say('hollis', "Chalk'll be here till last bell.")] }] }
    ];
    if (r >= 3) return [say('hollis', 'Belt-holder. Wear it tonight. Let them wonder what the notches are for.')];
    return [say('hollis', ['First bout. Ready?', 'Second bout. They get harder. Ready?', "Last one. For the belt. ...You'll want to sit down after you see who it is."][r]),
      { choice: [{ t: 'Ready.', then: ringBout() }, { t: 'Not yet.' }] }];
  },
  garran() { return [say('garran', 'Crew Five. We lift things.'), say('garran', 'Later, we lift you.')]; },
  marrow() {
    return once('ray_marrowSeen', [
      say('marrow', 'They sent me fifty scrip. An envelope. "With gratitude." I never said a word about her, Kael. I swear on my children —'),
      ...(F('lockerD') ? [say('kael', 'I know. They send one to everyone who was near. So we will all wonder.'), say('marrow', '...Everyone? Then — Hollis thought that I — oh. Oh, those shining bastards.')] : [say('kael', 'I believe you.'), say('marrow', 'Nobody else does. I can feel them not believing me.')]),
      say('marrow', "Here. From my girls. They cut it from the envelope. Only good use it'll ever get."), fx(() => ray('marrow'))],
    [say('marrow', F('lockerD') ? "I told Hollis about the envelopes. He sat down on the ground. Then he hugged me. Hollis!" : 'Fifty scrip. Sealed. I keep it under a floorboard like it is a rat.')]);
  },
  fen() {
    if (F('ray_fen')) return [say('fen', "*cough* A ticket, lad. Somebody had a ticket. Think about that when she comes down all shining.")];
    return [say('fen', '*cough* Spare a breath for First Fire?'),
      { choice: [
        { t: 'Buy him an air chit (3 scrip).', then: [fx(() => {
          if (G.scrip < 3) { Dialogue.push([say('fen', 'Empty pockets, eh. Then we are brothers. *cough*')]); return; }
          G.scrip -= 3; Sound.play('coin');
          Dialogue.push([say('fen', "Bless you. Bless — here. I've got nothing. No. I've got this."), narr('A scrap of yellow paper, soft with age. A ticket stub: LIFT 0 — ASCENT — ONE (1) — VOID.'), say('fen', 'Found it in a drain when I was a boy. Somebody went up once, lad. With a TICKET. Like it was a tram.'), fx(() => { ray('fen'); addJ('e_ticket'); Sound.play('clue'); })]);
        })] },
        { t: 'Not today, Fen.', then: [say('fen', 'Smart lad. *cough* Smart.')] }
      ] }];
  },
  kit() {
    return once('ray_kitSeen', [
      say('kit', 'Brennick. Sable sends regards.'),
      F('tookSlip') ? say('kit', "She knows a slip walked off Crate C. She's not angry. She's interested. That's worse.") : say('kit', 'You flagged her crate. It cost her twelve scrip to a Proctor to un-flag it. She says you owe her twelve scrip or one favor. She prefers favors.'),
      say('kit', "After the festival. Freight Three. Come alone, or don't. She'll know either way."), fx(() => setF('sableHook')),
      say('kit', "...And a ray. From me. I didn't even like her."), say('kit', 'She paid my fine once. Never said. Here.'), fx(() => ray('kit'))],
    [say('kit', 'Freight Three. After. Nine floors, Brennick. Not six.')]);
  }
};

// ---------------- hotspots
const D2H = {
  shelf() {
    if (F('lanternBuilt')) return [narr('The shelf is empty except for the tin. The lantern is by the door, where you cannot forget it. As if you could.')];
    const have = parts();
    if (have < 3) return [narr("Seren's lantern. Bent frame, half a sun, no wick. Her list is still folded in the wire."), narr(`WIRE — ${F('gotWire') ? 'got it' : 'Ivo'}.  GOLD — ${F('gotGold') ? 'got it' : 'Orin'}.  WICK — ${F('gotWick') ? 'got it' : 'Nell'}.`), narr(`Rays so far: ${rays()}.`)];
    const names = [['mara', "Mara's strip of her shift band"], ['ivo', "Ivo's boot label"], ['kids', 'forty colored bits from the ward'], ['bao', 'her last noodle order'], ['hollis', "Hollis's scorched apron"], ['marrow', 'a corner of an Authority envelope'], ['pell', 'a yellow sweeping ticket'], ['juno', 'a chalk wrapper'], ['fen', 'a void lift ticket'], ['kit', "a runner's ray"]].filter(([k]) => F('ray_' + k)).map(a => a[1]);
    return [
      narr("You straighten the frame with Authority copper. Tavi rubs Orin's gold into a drop of lamp oil until it shines."),
      narr("The ward's wick goes in last. It still smells faintly of the night lamp."),
      ...(names.length ? [narr(`Tavi pastes on the rays, one at a time, saying each name: ${names.join(', ')}.`)] : [narr('No rays but the ones she painted. Tavi looks at it for a while and says nothing.')]),
      narr('That leaves the tin.'),
      { choice: [
        { t: "Hang her washer in the middle of the sun.", fx: () => { setF('washerOn'); setF('openedTin'); addJ('e_tin', true); }, then: [narr('The blackened brass washer, on a twist of copper, in the center of the paper. It turns a little in the draft. When the light is behind it, it will be the only dark thing in the sun.'), say('tavi', "...It's a ring. Kael. That's her RING."), say('you', 'Perfectly balanced pressure seal.')] },
        { t: 'Leave the tin shut. Not that. Not yet.', then: [narr('You touch the lid with two fingers. The lantern will have to do without her ring. So will you.')] }
      ] },
      { choice: [
        { t: 'Paint the last ray yourself.', then: [narr('Your hand is steadier than you expected. It has had forty-two days of practice at the Pillar.')] },
        { t: 'Give Tavi the brush.', fx: () => trust('tavi', 1), then: [narr('Tavi sticks their tongue out when they concentrate. Seren used to do that. You had forgotten that, and now you have it back.')] }
      ] },
      narr('For a second, in the lamplight, it looks exactly like the one she drew on your wrist.'),
      fx(() => { setF('lanternBuilt'); Sound.play('solved'); HUD.toast("Seren's lantern is finished"); Game.autosave(); })
    ];
  },
  suns() {
    if (F('sun18')) return [narr('Eighteen suns. The last one is a little crooked. It is the best one.')];
    return [narr('Seventeen suns and a half. She added one every time something good happened.'),
      { choice: [{ t: 'Finish the eighteenth.', fx: () => setF('sun18'), then: [narr("You use the last of Orin's gold on your thumb. It comes out crooked."), say('you', 'Something good happened, Seren. I got out of bed.')] }, { t: 'Not yet.' }] }];
  },
  radio: () => [narr("Cinder Radio: '...the High Auditor will attend the Festival of the First Fire. Lanterns are licensed for one candle-hour. The hanging of lanterns at the Lumen Pillar is suspended, for reasons of gratitude.'")],
  worksheet: () => [narr("Tavi's worksheet: 'FIVE THINGS I AM GRATEFUL FOR.'"), narr('1. Air.  2. Kael.  3. Noodles.  4. Seren —'), narr("Number four has been crossed out in the teacher's red: COMMITTED PERSONS ARE NOT LISTED. Tavi has written her back in. Twice.")],
  bed: () => [narr(F('day2Done') ? 'Not tired. Not after that.' : 'Not on First Fire.')],
  tools: () => [narr('Your valve keys. The bent pick for seized couplings. And your striker, the one you light the Bank Seven pilot with. You put it in your pocket without deciding to.')],
  notice: () => [narr('FESTIVAL OF THE FIRST FIRE — TONIGHT, LAST BELL. LANTERNS BY LICENSE: ONE CANDLE-HOUR.'), narr('NEW: NO LANTERNS AT THE PILLAR. BY ORDER.'), narr("Someone has scratched beneath it, very small: 'SHE HUNG HERS THERE EVERY YEAR.'")],
  lift0: () => [narr('LIFT 0 — ARRAY AUTHORITY USE ONLY.'), narr('The call light is green. Not blinking. Just on. Steady as a held breath.'), ...(F('fuseDone') ? [narr('You know what is feeding it now. You balanced the bus yourself.')] : [narr('It hums. You have heard that pitch somewhere before.')])],
  pillar() {
    if (!F('sull2Done')) return [narr('Sull is kneeling at the base again, with his bucket.')];
    return [narr("Two suns at the Pillar's base today." + (F('charmedProctor') ? ' Sull left them both.' : ' Sull took one. The other is already back.')), narr('High above, the top hook. Every lantern in Ashgate has hung from this Pillar since before Orin was born. Hers always went up first.')];
  },
  bench: () => [narr('One year ago tonight you sat on this bench with a brass washer in your pocket, sweating through your good shirt, while she pretended not to notice.')],
  screen: () => [narr("The Authority screen has a fifth message today: FIRST FIRE TONIGHT. BE GRATEFUL IN AN ORDERLY FASHION.")],
  shiftboard: () => [narr("CREW 3 — TODAY\nWO-116  Fuse room C — festival load — K. Brennick\nWO-117  Conveyor 2 — grease — (unassigned)"), narr("Under two layers of tape you can still read both names.")],
  conveyor: () => [narr("Conveyor Two, still. Dace's rag has dried stiff on the rail. Nobody has moved it.")],
  furnace: () => [fx(() => { World.fxFlash('#ff6a20', 0.6); Sound.play('roar'); }), narr('The heat. The doors. Eleven seconds. It does not get smaller.'),
    narr("There is a Proctor's seal on the furnace door today, and beside it a brass cup on a chain. Polished. Waiting."), say('kael', "...The First Fire. They draw it from here. Tonight they'll light every lantern in Cinderwell from this."), say('kael', 'From her.'), fx(() => setF('knowsFire'))],
  valves: () => [narr("Bank Seven hums. AUX-9 reads full. Vale's thumbprint is on the logbook cover, in graphite.")],
  breakers() {
    if (F('fuseDone')) return [narr('Both buses steady. TIER 6 LIGHTS: ' + (F('spareOn') ? '17, with the spare thrown.' : '15.') + ' And under your thumbprint in the grime, the brass plate: L0 STBY — 19.')];
    return [fx(() => Puzzle.open(FUSE_PUZZLES, Game.onFuseDone))];
  },
  lockerS: () => [narr('The nameplate has been unscrewed. The four little holes are still there.'), narr('Inside: nothing. The Authority cleared it the same afternoon. They even wiped the shelf.'),
    narr('But on the inside of the door, low down, where you would only see it kneeling: a sun, scratched with a valve key. And under it: K + S. BALANCED.'), fx(() => setF('sawLockerS'))],
  lockerK: () => [narr('Your locker. Spare gloves. A heel of bread gone to stone.'), narr("And the note she left you on the morning of the wedding. You have read it so many times the folds have gone soft: DON'T BE LATE. I'LL START WITHOUT YOU.")],
  lockerD() {
    if (F('lockerD')) return [narr("Dace's locker. The flat-packed lantern is still inside. FOR S. — I'LL CARRY IT.")];
    return [narr('D. MORROW. Locked. Nobody has come for his things.'),
      { choice: [
        { t: 'Pick it. You have the bent pick, and no shame.', then: [
          narr('Four seconds. Seren could do it in two.'),
          narr("A grease rag. A festival lantern, flat-packed, never opened, with a tag: FOR S. — I'LL CARRY IT."),
          narr('And a sealed Authority envelope. Heavy. Stamped: INFORMANT REMITTANCE — 50 SCRIP — WITH GRATITUDE.'),
          say('you', '...Dace.'),
          narr('Under it, a page torn from a logbook, in his cramped hand:'),
          narr('"It came the morning after. I never said a word to anyone. Mara got one. Hollis got one. THEY SEND IT TO EVERYONE NEAR. So we all wonder. So we never stand in a row again."'),
          narr('"I didn\'t open it. Tell Kael I didn\'t open it. — Fuse C feeds the lift. I am going down to see what the lift feeds."'),
          { choice: [
            { t: 'Take the envelope. Fifty scrip is fifty scrip.', fx: () => { setF('tookBlood'); G.scrip += 50; Sound.play('coin'); }, then: [narr('It weighs almost nothing. You had expected it to weigh what a person weighs.')] },
            { t: 'Take it — to burn. In their own fire, tonight.', fx: () => { setF('burnBlood'); fury(1); }, then: [narr('Into your jacket, next to your heart, where it can feel what it did.')] },
            { t: 'Leave it sealed. The way he left it.', fx: () => setF('leftBlood'), then: [narr('You lock the door again behind it. Four seconds. Out of respect, you take your time.')] }
          ] },
          fx(() => { setF('lockerD'); addJ('e_remit'); addJ('p_dace', true); Sound.play('clue'); Game.autosave(); })
        ] },
        { t: 'Leave it. It is his.' }
      ] }];
  },
  spool: () => [narr('A spool of festival cable. Stenciled: TIER 6 FESTIVAL CIRCUIT — 400 LANTERN-HOURS — BY LICENSE.'), narr('Four hundred lanterns, one hour each. Somebody up there did the arithmetic on how much joy the Cinders could afford.')],
  fusebench: () => [narr("Crew Three's bench. Forty years of initials carved in it. The newest: S.H., with a little sun for the dot of a letter that has no dot.")],
  rubble() {
    return [narr('The stack of moved rocks is taller today. Much taller. There is a gap in the collapse now, shoulder-wide, with a draft coming through it.'),
      narr("Dace's lamp sits on the stack. Wick trimmed. The glass is still faintly warm. He was here last night."),
      narr("On the wall beside the gap, fresh chalk: 'K — IF YOU FOUND THIS, DON'T FOLLOW YET. LIGHT HER LANTERN FIRST. THEN COME. — D.M.'"),
      say('you', "...He's alive. He's down there, and he's leaving me homework."),
      fx(() => { if (!G.journal.includes('e_dacenote')) Sound.play('clue'); addJ('e_dacenote'); setF('daceNote'); Game.autosave(); })];
  },
  stall: () => D2T.bao()
};

// ---------------- after the festival: a few words from everyone (Day 3 is not built)
const D3 = {
  tavi: "I kept the leaf. It's in my worksheet. It's going soft. Do they all go soft?",
  mara: 'Vale wants an answer by first bell. Whatever you say to him, son, say it standing up.',
  ivo: 'It OPENED, Kael. I screamed. Did you hear me scream? Everyone heard me scream.',
  orin: 'Round. And it moved across the whole square. ...Thank you, boy.',
  nell: "Forty of them saw it through the glass. Ada hasn't stopped talking. Ada. Talking.",
  hollis: 'We stood in a row. Did you see? A row.',
  marrow: 'I burned my envelope this morning. In the stove. The girls watched.',
  bao: "Free noodles for belt-holders and lantern-hangers. Don't tell me which one you are.",
  pell: "I'm not sweeping the chalk today. Any of it.",
  juno: 'I drew TEN suns. On the screen. Up high. I stood on Pell.',
  fen: '*cough* I breathed easy last night. First time in years. *cough* Mostly.',
  kit: 'Sable watched the whole thing from Freight Three. She says the favor just got bigger.',
  pip: "What's a leaf? Tavi says you know.", mosi: 'Our ray was near the top. I SAW it.', ada: 'It was warm. Through the glass. I felt it.'
};

// ---------------- wrap day 1 scripts
for (const k in D2T) { const o = TALK[k]; TALK[k] = () => { if (F('day2Done') && D3[k]) return [say(k, D3[k])]; if (F('day1Done')) { const r = D2T[k](); if (r) return r; } return o ? o() : [narr('...')]; }; }
for (const k in D2H) { if (!D2H[k]) continue; const o = HOT[k]; HOT[k] = () => { if (F('day1Done')) { const r = D2H[k](); if (r) return r; } return o ? o() : [narr('...')]; }; }
const _barks = barks;
barks = function (id) {
  if (!F('day1Done')) return _barks(id);
  if (F('day2Done')) return ({ juno: ['TEN SUNS!'], pell: ['NOT SWEEPING THAT.'], hollis: ['A ROW. WE STOOD IN A ROW.'], bao: ['NOODLES! FREE! NO, WAIT.'], tavi: ["WHAT'S A LEAF?"] })[id] || [];
  return ({ pell: ['FIRST FIRE TONIGHT!', 'SWEPT IT TWICE.'], juno: ['FOUR SUNS!', "CAN'T CATCH ME!"], bao: ['FESTIVAL BROTH! DOUBLE CHILI!'], orin: ['ROUND, SHE SAID.', 'HMM.'], ivo: ['LANTERN FRAMES! MOSTLY STRAIGHT!'], nell: ['CARRY IT PAST THE DOOR.'],
    hollis: ['EMBER RING! STAY IN THE CHALK!', 'WHO STEPS IN?'], garran: ['CREW FIVE.'], marrow: ['FIFTY SCRIP...'], fen: ['*COUGH* SPARE A BREATH?'], kit: ['SABLE SENDS REGARDS.'], proctor: ['NO LANTERNS ON THE PILLAR.'],
    pip: ['TELL THE NOODLE JOKE!'], mosi: ['I MADE A RAY!'], ada: ['...'], mara: [], tavi: F('lanternBuilt') ? ['IS IT TIME?'] : ['WIRE. GOLD. WICK.'] })[id] || [];
};
function D2OBJ() {
  if (G.heist === 2) return "Hang her lantern on the Pillar, unseen";
  if (F('day4Done')) return "Part One is finished — explore freely";
  if (F('day3Done')) return "The Way Out begins when The Ledger ends (or from the Dev menu). Explore freely";
  if (F('day2Done')) return "The Ledger begins when First Fire ends (or from the Dev menu). Explore freely";
  if (!F('d2Tavi')) return 'Talk to Tavi';
  if (!F('mara2')) return G.mapId === 'bay' ? 'Report to Mara' : 'Report to Mara in Bay 3 (east, through the square)';
  if (!F('fuseDone')) return G.mapId === 'fuse' ? 'Balance the breaker panel' : 'Fuse Room C: the door on the north wall of Bay 3';
  if (!F('clock2')) return 'Clock out with Mara';
  if (!F('lanternBuilt')) { const need = [!F('gotWire') && 'wire (Ivo)', !F('gotGold') && 'gold (Orin)', !F('gotWick') && 'wick (Nell, clinic)'].filter(Boolean); return need.length ? 'For the lantern: ' + need.join(' · ') : 'Finish the lantern at home (the shelf)'; }
  return 'When you are ready for the festival, tell Tavi';
}

// ---------------- festival night: whispers, getting caught
const FEST_WHISPER = id => [say(id, ({ tavi: 'Top hook. She always jumped for it. You can reach.', ivo: "North face is blind. Go when Sull's on the far side. And DON'T look at the one with the lamp.", mara: "I see nothing. I'm old. Go.", hollis: '...hmmm-hmm-hmmm...', bao: 'If they chase you, run through my stall. I will be very clumsy.', orin: 'Round, boy. Go.', nell: 'Forty faces at the glass. Go.' })[id] || 'Go on, Kael. We never saw you.')];
function FEST_CAUGHT(k, who) {
  return [say(who === 'proctor' ? 'proctor' : 'watchman', who === 'proctor' ? 'You! Behind the line, soot! Curfew at the Pillar!' : 'Hey! Back! Back behind the cordon!'),
    say('ivo', ['Okay. Okay. He just thinks you wandered. Watch the loop. Count it.', "Right. New plan. When you move, I'm going to be very clumsy with my cart. Go when you hear it.", 'Again! I have more cart!'][Math.min(2, k - 1)])];
}

// ---------------- FIRST FIRE: the ceremony
function festA() {
  const n = rays();
  return [
    { music: 'mystery' },
    { card: 'THE FIRST FIRE', sub: 'Ashgate Square. After last bell.', min: 1.2, max: 4 },
    { scene: 'fest', cam: [8, 10], dark: F('spareOn') ? 'rgba(6,4,14,.5)' : 'rgba(6,4,14,.62)', zoom: 2 },
    { add: [['kael', 8, 9, 3], ['tavi', 7, 10, 3], ['ivo', 9, 11, 1], ['mara', 4, 8, 3], ['hollis', 6, 11, 3], ['marrow', 6, 7, 3], ['pell', 5, 9, 3], ['juno', 9, 12, 1], ['bao', 5, 11, 3], ['orin', 7, 13, 1], ['fen', 3, 10, 3],
      ['kit', 20, 11, 2], ['nell', 18, 10, 2], ['c2', 19, 9, 2, 'c2'], ['c3', 20, 7, 2, 'c3'], ['c4', 18, 12, 2, 'c4'], ['c1', 21, 9, 2, 'c1'], ['proctor', 12, 10, 2], ['watchman', 15, 10, 3], ['vale', 11, 5, 0]] },
    { pillarRed: 1 }, { fade: 'in' }, { wait: 0.7 },
    { narr: 'One night a year, Cinderwell stays out past last bell. Four hundred lanterns, one candle-hour each, stamped and licensed. From above, if anyone above were looking, the Cinders must look like a bed of embers.' },
    F('nellAsk') ? { narr: 'You carried it past the ward door first. Slowly, the way she asked. Forty faces pressed to the glass. Ada put her palm flat on the pane, where the warm would be.' } : null,
    { say: 'tavi', t: "Everyone's looking at it. Kael. Everyone's looking at her lantern." },
    { say: 'kael', t: "Let them. That's what it's for." },
    n >= 4 ? { narr: `There are ${n} rays on it she never painted. People keep finding theirs and touching it, quickly, like a rivet for luck.` } : null,
    F('ringChamp') ? { narr: 'Her belt is over your shoulder. Three notches. Hollis nods at it every time he catches your eye.' } : null,
    { sfx: 'rumble' }, { shake: 0.9 }, { wait: 0.8 },
    { narr: F('fuseDone') ? 'The ground hums. Every lamp in the square dips. And tonight, for the first time in your life, you know exactly why.' : 'The ground hums. Every lamp in the square dips, the way it does every First Fire.' },
    { flash: '#fff6dc' }, { beam: 1 }, { music: 'surface' }, { sfx: 'choir' }, { fx: () => { Cutscene.lift = 1; } },
    { add: [['celestine', 13, 1, 0], ['wl', 12, 1, 0, 'warden'], ['wr', 14, 1, 0, 'warden']] },
    { pan: [12, 4], dur: 1.6, hold: false },
    { move: 'wl', to: [12, 4], spd: 14 }, { move: 'wr', to: [14, 4], spd: 14 }, { move: 'celestine', to: [13, 4], spd: 14, wait: true },
    { narr: 'She comes down in light, the way she did forty-two days ago. The same white. The same unhurried gold. In her hands, a brass cup on a chain. In the cup, a flame.' },
    { say: 'vale', t: 'Kneel for High Auditor Celestine Aurel. Kneel for the First Fire.' },
    { kneel: 'all', but: ['vale', 'kael', 'proctor', 'watchman'] }, { sfx: 'step' },
    { choice: [
      { t: 'Kneel.', fx: () => { setF('kneltFest'); const a = Cutscene.actor('kael'); if (a) a.kneel = 1; }, then: [narr('You kneel. The lantern does not. You hold it up over your bowed head, like something that outranks you.')] },
      { t: 'Kneel last.', fx: () => { setF('lastToKneel'); fury(1); }, then: [narr("You are the only one standing in a square of four hundred. One full second. Two. Vale's eyes find you, and widen, very slightly."), fx(() => { const a = Cutscene.actor('kael'); if (a) a.kneel = 1; }), narr('Then your knee touches stone. The whole tier breathes out.')] }
    ] },
    { zoom: 2.4 }, { pan: [13, 4], dur: 1.2 },
    { say: 'celestine', t: 'Cinderwell. How festive. You have made such a brave little effort with the paper.' },
    { say: 'celestine', t: 'I bring you the First Fire. Drawn this evening from your own heart-furnace, as it has been for two hundred years.' },
    { say: 'celestine', t: 'It burns on whatever it is given. This year, it was given rather well.' },
    { heart: 1 }, { vignette: 1 },
    { narr: 'A sound goes through the square. Not a word. Just four hundred people understanding the same thing at the same moment.' },
    { pan: [8, 9], dur: 0.9 }, { zoom: 2.8 },
    { say: 'tavi', t: 'Kael. Kael, she means —' },
    { say: 'kael', t: 'I know what she means.' },
    { say: 'celestine', t: 'Gratitude is breath. Come. Take your light.' },
    { kneel: 'all', v: 0 },
    { narr: "Proctors carry tapers down the rows. The flame passes hand to hand, lantern to lantern. Seren's fire, coming toward you one candle at a time." },
    { choice: [
      { t: "Take it. It's HER fire. They don't get to keep it.", fx: () => setF('fireTheirs'), then: [narr('The taper touches the wick. The paper sun fills up gold from the inside, and for a moment you cannot see anything else in the world.'), say('kael', '(There you are.)')] },
      { t: 'Close your hand over the wick. Strike your own.', fx: () => { setF('fireOwn'); fury(1); }, then: [narr('The Proctor with the taper stops. The row stops. You take out your striker, the one that lights the Bank Seven pilot, and thumb it. Once. Twice.'), narr('It catches. An unlicensed light. Small, and blue at the root, and yours.')] },
      { t: 'Give Tavi the striker.', fx: () => { setF('fireTavi'); trust('tavi', 1); }, then: [narr("Tavi's hands are shaking. It takes four tries. On the fourth, the wick catches, and Tavi makes a sound you have not heard since before the fever. A laugh, with nothing wrong with it.")] }
    ] },
    { fx: () => { Cutscene.glowK = 1; } },
    F('washerOn') ? { narr: 'In the middle of the lit sun, her washer turns on its twist of copper. A small dark ring. A perfectly balanced pressure seal.' } : null,
    F('burnBlood') ? { narr: 'And while the flame is still in front of you, you take a sealed Authority envelope out of your jacket — INFORMANT REMITTANCE, WITH GRATITUDE — and hold its corner to the fire.' } : null,
    F('burnBlood') ? { narr: 'Fifty scrip burns greener than you would think. Marrow sees it. Hollis sees it. You watch them both work out what the envelopes were.' } : null,
    { heart: 0 }, { vignette: 0 }, { zoom: 2.2 },
    { move: 'celestine', to: [11, 7], spd: 12, wait: true }, { face: 'celestine', dir: 2 }, { pan: [10, 8], dur: 1 },
    { say: 'celestine', t: 'Ah. The loud one. And you have brought... what is it? A face?' },
    { choice: [
      { t: 'A gift. From Crew Three. With gratitude.', then: [say('celestine', 'How dear. You are learning the words. In a generation or two you might even learn the tune.')] },
      { t: '(Hold it higher. Say nothing.)', then: [say('celestine', 'Still staring. Still silent. I had so hoped the invoice would improve you.')] },
      { t: 'It has more friends than you do.', fx: () => fury(1), then: [say('celestine', '...Inspector, do they all talk? I was told they mostly coughed.')] }
    ] },
    { emote: 'tavi', t: '!' },
    { say: 'tavi', t: "It's the SUN." },
    { say: 'celestine', t: 'Is it.' },
    { say: 'celestine', t: 'It is rather more yellow than th—' },
    { emote: 'celestine', t: '...' }, { wait: 0.9 },
    { narr: 'The silence is very small. But you were raised on gauges. You know a needle twitch when you see one.' },
    { say: 'celestine', t: 'One imagines.' },
    { say: 'kael', t: '(More yellow than what? ...She has SEEN it.)' },
    { fx: () => { setF('celestineSlip'); addJ('e_slip'); Sound.play('clue'); } },
    { move: 'celestine', to: [13, 5], spd: 14, wait: true }, { face: 'celestine', dir: 0 }, { pan: [13, 6], dur: 1 },
    { say: 'celestine', t: 'Inspector. The custom of hanging these on the Pillar is suspended, I think. Light is a thing one receives. It is not a thing one puts up.' },
    { say: 'celestine', t: 'And have the Bank Seven ledger on the lift by first bell. I should like something to read.' },
    F('bledAgain') || F('nearlyCaught') ? { narr: 'Vale does not look at you. It is the loudest thing he has ever not done.' } : null,
    { move: 'wl', to: [12, 1], spd: 16 }, { move: 'wr', to: [14, 1], spd: 16 }, { move: 'celestine', to: [13, 1], spd: 16, wait: true },
    { remove: 'celestine' }, { remove: 'wl' }, { remove: 'wr' }, { beam: 0 }, { music: 'mystery' }, { fx: () => { Cutscene.lift = 1; } },
    { narr: 'She goes up in light. The lamps come back. The Proctors string a cordon around the Pillar, where every lantern in Ashgate has hung since before Orin was born.' },
    { pan: [8, 10], dur: 1.2 }, { zoom: 2.6 },
    { say: 'ivo', t: "Every year. Every year, hers went up first. Top hook. She'd climb the base like a rat up a pipe." },
    { say: 'tavi', t: "There's still a top hook." },
    { say: 'ivo', t: 'Tavi. No. Kael — tell Tavi no.' },
    { say: 'kael', t: 'There is still a top hook.' },
    { say: 'ivo', t: "...Fine. FINE. Sull walks the long loop, clockwise. There's one standing north of the Pillar and one south, swinging lamps. Move when they look away." },
    F('sullTip') ? { say: 'kael', t: "Sull is slow on the south side. Bad knee. He complained to me about it." } : null,
    F('beatSull') ? { say: 'ivo', t: "And he's limping. I wonder why. I wonder who could possibly have done that, in a chalk ring, where nothing gets written down." } : null,
    { say: 'tavi', t: "Make them look at her, Kael." },
    { fade: 'out' },
    { card: 'Ashgate Square · after last bell', sub: "Hang her lantern on the Pillar. Stay out of the Proctors' lamplight. Throw a bolt to pull them away.", min: 1.2, max: 5 }
  ].filter(Boolean);
}

// ---------------- FIRST FIRE: the sun, the row, the lift
function festB() {
  const n = rays(), row = n >= 7 ? 3 : n >= 4 ? 2 : 1;
  return [
    { scene: 'fest', cam: [13, 7], dark: F('spareOn') ? 'rgba(6,4,14,.5)' : 'rgba(6,4,14,.62)', zoom: 2.6 },
    { add: [['kael', 13, 7, 0], ['tavi', 6, 12, 3], ['ivo', 8, 13, 3], ['mara', 4, 8, 3], ['hollis', 5, 10, 3], ['marrow', 6, 7, 3], ['pell', 4, 12, 3], ['juno', 9, 14, 1], ['bao', 5, 11, 3], ['orin', 12, 14, 1], ['fen', 20, 14, 1],
      ['kit', 24, 10, 2], ['nell', 17, 14, 1], ['c2', 22, 8, 2, 'c2'], ['c3', 23, 12, 2, 'c3'], ['c4', 3, 6, 3, 'c4'], ['proctor', 17, 11, 2], ['watchman', 13, 12, 0]] },
    { pillarRed: 1 }, { fx: () => { Cutscene.lift = 1; Cutscene.glowK = 1; } }, { fade: 'in', spd: 3 },
    { narr: 'The base is still warm from the day-cycle. Your boots find the same rivets hers did. Top hook. You have to stretch for it. She never stretched. She jumped.' },
    { fx: () => { Cutscene.hung = 1; Cutscene.glowK = 0; } }, { sfx: 'solved' }, { wait: 0.8 },
    { narr: "It swings once. Settles. And then the Pillar's light comes up through the paper." },
    { fx: () => { Cutscene.sunT = 1; } }, { flash: '#fff2c0' }, { music: 'hum' }, { zoom: 1.25 }, { pan: [13, 9], dur: 2.4 },
    { narr: 'A sun. Forty feet across. It lands on the square, on the stalls, on four hundred upturned faces, on the Authority screens, on the gate of Lift Zero. Every ray she painted and every ray she was given, thrown as wide as a tier.' },
    F('washerOn') ? { narr: 'And in the middle of it, on the stones, the shadow of a ring.' } : null,
    F('spareOn') ? { narr: 'The lamps are burning two amps brighter than any First Fire in twenty years. Nobody knows why but you, and one grey Inspector.' } : null,
    { say: 'proctor', t: 'HEY! You! Down! Get that DOWN!' },
    { move: 'proctor', to: [14, 10], spd: 46, wait: true }, { zoom: 2 }, { pan: [13, 10], dur: 0.8 },
    ...(row === 3 ? [{ move: 'hollis', to: [12, 9], spd: 40 }, { move: 'marrow', to: [13, 9], spd: 40 }, { move: 'bao', to: [14, 9], spd: 40 }, { move: 'pell', to: [11, 9], spd: 40 }, { move: 'juno', to: [15, 9], spd: 50 }, { move: 'mara', to: [10, 9], spd: 40, wait: true },
        { narr: 'Sull gets three steps. Then Hollis is in front of him. Then Marrow. Then Bao, still holding a ladle. Then a sweep with a broom, and a girl with chalk on her hands, and a forewoman with her sleeves rolled.' },
        { narr: 'Nobody raises a fist. They just stand. In a row. The way the envelopes were supposed to make sure they never would again.' }]
      : row === 2 ? [{ move: 'hollis', to: [12, 9], spd: 40 }, { move: 'bao', to: [14, 9], spd: 40 }, { move: 'marrow', to: [13, 9], spd: 30, wait: true },
        { narr: 'Sull gets three steps. Then Hollis is in front of him, bad arm and all. Then Bao. Then, after a breath, Marrow. Three people. It is not a wall. It is enough to make him stop.' }]
      : [{ move: 'mara', to: [13, 9], spd: 40, wait: true }, { narr: 'Sull gets three steps before Mara is in front of him. Just Mara. Arms folded. Forty years of forewoman in her face.' }, { say: 'mara', t: "It's a lantern, Proctor. On First Fire. Write that down and see how it reads." }]),
    { narr: 'And from somewhere in the back, low, through closed teeth: the shift song.' },
    { narr: 'For forty-two days they have played it at us through the speakers at every bell, so it would mean the furnace. Tonight the tier takes it back.' },
    F('sullTip') ? { say: 'proctor', t: "...One candle-hour. It's licensed for one candle-hour. Then it comes down." } : F('sullWar') || F('beatSull') ? { say: 'proctor', t: "Brennick. I've got your name spelled right. You hear me? I've got it spelled RIGHT." } : { say: 'proctor', t: "It comes down at first bell. I'll scrub the light off the stones if I have to." },
    F('sullTip') ? { narr: 'He says it loudly, for the record. Then he turns his back on it, and stands guard over the wrong side of the square for exactly one hour.' } : { narr: 'He does not climb. Not with four hundred people humming. He stands under her sun with his whistle in his fist and does not blow it. You can see what that costs him. You enjoy it more than you should.' },
    { move: 'kael', to: [11, 7], spd: 26 }, { move: 'tavi', to: [10, 7], spd: 50, wait: true }, { pan: [11, 7], dur: 1 }, { zoom: 2.6 },
    { emote: 'tavi', t: '!' },
    { say: 'tavi', t: "She's on everything. Kael, look. She's on EVERYTHING." },
    { say: 'kael', t: 'Happy anniversary, Seren.' },
    { say: 'kael', t: "I carried it. I pretended I didn't want to. It was on the list." },
    { wait: 1.2 }, { music: null },
    { narr: 'Then the humming falters. Because behind the sun, behind the gate, the call light on Lift Zero has gone from green to white.' },
    { pan: [13, 3], dur: 1.4 }, { sfx: 'rumble' }, { shake: 0.7 }, { wait: 0.8 }, { fx: () => { Cutscene.lift = 2; } }, { sfx: 'door' },
    { narr: 'The gate opens by itself. No beam. No choir. No one inside.' },
    { narr: "Just the car, lit and empty. On its floor, a puddle of clean water, and one green leaf the size of a child's hand, turning in the draft." },
    F('ivoWatch') ? { say: 'ivo', t: "KAEL. It's — there's nobody. It just CAME. I screamed. Did you hear me scream?" } : null,
    { emote: 'tavi', t: '?' },
    { say: 'tavi', t: 'What is that?' }, { say: 'kael', t: 'A leaf.' }, { say: 'tavi', t: "What's a leaf?" },
    { narr: 'The gate stands open for eleven seconds. You count them. Everyone counts them. Nobody from Cinderwell gets in.' },
    { fx: () => { Cutscene.lift = 1; } }, { sfx: 'door' },
    { narr: 'Not tonight.' },
    { add: [['vale', 14, 5, 2]] }, { pan: [12, 6], dur: 1 },
    { say: 'vale', t: 'Brennick.' },
    { say: 'vale', t: 'She asked for the Bank Seven ledger by first bell. She did not say who should carry it up.' },
    { say: 'vale', t: 'I can send a clerk. Or I can send a valve tech who knows the bank, and who has just shown four hundred people he cannot be told where to put a light.' },
    { say: 'vale', t: 'Sleep on it. You have until first bell.' },
    { fade: 'out' },
    { card: 'FIRST FIRE', sub: 'One candle-hour. It burned for three.', big: 1, sfx: 'splash', min: 2.2, max: 6 },
    ...(NOFF ? [] : DREAM2())
  ].filter(Boolean);
}

// the Proctor duel plays before the ceremony: the night Kael learns what the Authority takes, cut against the night he takes something back
{ const f0 = festA; festA = function () { return (NOFF ? [] : [{ card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. Day nineteen.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.ford() }]).concat(f0()); }; }
