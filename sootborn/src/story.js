// ============================================================
// content/story — SOOTBORN: cast, journal, dialogue, hotspots, barks
// Kael Brennick is a defined protagonist: charming, ambitious, grieving.
// G.tendency holds his "drive" chosen in the prologue: caretaker=Heart, tinkerer=Pride, seeker=Hunger.
// ============================================================
const DRIVE = { caretaker: 'Heart', tinkerer: 'Pride', seeker: 'Hunger' };
const KAEL_LOOK = { skin: '#c48a64', hair: '#6a2e18', style: 'spiky', shirt: '#3d5a6a', pants: '#2a3440', scarf: '#b8682a' };
const LOOKS = [Object.assign({ label: 'Kael' }, KAEL_LOOK)];
const playerLook = () => Object.assign({}, KAEL_LOOK);
const crowd = (skin, hair, style, shirt) => () => ({ skin, hair, style, shirt, pants: '#2a2420' });
const CAST = {
  kael: { name: 'Kael', look: () => playerLook() },
  seren: { name: 'Seren Holloway', look: () => ({ skin: '#9a6448', hair: '#1e1416', style: 'long', shirt: '#6a3a4a', pants: '#2a2430', band: '#c8a050' }) },
  tavi: { name: 'Tavi', look: () => ({ skin: KAEL_LOOK.skin, hair: KAEL_LOOK.hair, style: 'short', shirt: '#7a4a6a', pants: '#3a2e40', kid: 1 }) },
  mara: { name: 'Mara Venn', look: () => ({ skin: '#a86e4e', hair: '#7a7470', style: 'bun', band: '#8a3a2e', shirt: '#4a3a30', pants: '#2a2420', extra: 'apron' }) },
  ivo: { name: 'Ivo', look: () => ({ skin: '#d8a07a', hair: '#c8a040', style: 'spiky', extra: 'goggles', shirt: '#5a6a34', pants: '#3a3028' }) },
  orin: { name: 'Old Orin', look: () => ({ skin: '#b07a5a', hair: '#d8d0c0', style: 'bald', extra: 'beard', shirt: '#5a4a6a', pants: '#2a2430' }) },
  nell: { name: 'Nell', look: () => ({ skin: '#7a4e36', hair: '#1a1014', style: 'long', extra: 'coat', shirt: '#d8dcd8', pants: '#3a4a5a' }) },
  dace: { name: 'Dace Morrow', look: () => ({ skin: '#e0b090', hair: '#5a3a20', style: 'short', extra: 'hat', shirt: '#3d5a6a', pants: '#2a3440' }) },
  pell: { name: 'Pell', look: () => ({ skin: '#9a6448', hair: '#8a8a8a', style: 'short', shirt: '#6a3a2a', pants: '#3a2a24' }) },
  juno: { name: 'Juno', look: () => ({ skin: '#5e3a2a', hair: '#1a1014', style: 'bun', shirt: '#c87a2a', pants: '#3a2a24', kid: 1 }) },
  bao: { name: 'Bao', look: () => ({ skin: '#c08060', hair: '#2a1a14', style: 'short', shirt: '#a83a2a', pants: '#2a2020', extra: 'apron' }) },
  watchman: { name: 'Night Watchman', look: () => ({ skin: '#a87a5a', hair: '#2a2a2e', style: 'short', shirt: '#4a4e58', pants: '#2a2c32', extra: 'hat', clean: 1 }) },
  proctor: { name: 'Proctor Sull', look: () => ({ skin: '#c8a080', hair: '#3a3a40', style: 'short', shirt: '#6a6e78', pants: '#3a3c44', extra: 'hat', clean: 1 }) },
  vale: { name: 'Inspector Vale', look: () => ({ skin: '#b89070', hair: '#2a2a2e', style: 'short', shirt: '#5a5e66', pants: '#2a2c32', extra: 'pin', clean: 1 }) },
  celestine: { name: 'High Auditor Celestine Aurel', look: () => ({ accredited: 1, skin: '#f4e6dc', hair: '#f6eac0', robe: '#f4f2ec', trim: '#e8c25a', crown: 1 }) },
  warden: { name: 'Warden', look: () => ({ accredited: 1, warden: 1, skin: '#e8dcd0', hair: '#c8ccd4', robe: '#c8ccd8', trim: '#e8c25a' }) },
  hollis: { name: 'Hollis the welder', look: crowd('#8a5a3e', '#2a1a14', 'short', '#5a4a3a') },
  marrow: { name: 'Marrow', look: crowd('#c08a6a', '#4a3020', 'long', '#4a4a5a') },
  fen: { name: 'Old Fen', look: crowd('#d0a080', '#6a6a6a', 'bald', '#3a4a4a') },
  kit: { name: 'Kit, a runner', look: () => ({ skin: '#6a4430', hair: '#141014', style: 'spiky', shirt: '#2a3a2a', pants: '#2a2420', extra: 'goggles' }) },
  pip: { name: 'Pip', look: () => ({ skin: '#c08a6a', hair: '#6a3a1a', style: 'short', shirt: '#d8d0c0', pants: '#5a6a7a', kid: 1 }) },
  mosi: { name: 'Mosi', look: () => ({ skin: '#5e3a2a', hair: '#1a1014', style: 'bun', shirt: '#d8d0c0', pants: '#5a6a7a', kid: 1 }) },
  ada: { name: 'Ada', look: () => ({ skin: '#e0b090', hair: '#c8a040', style: 'long', shirt: '#d8d0c0', pants: '#5a6a7a', kid: 1 }) },
  c1: { name: 'Hollis', look: crowd('#8a5a3e', '#2a1a14', 'short', '#5a4a3a') },
  c2: { name: 'Neighbor', look: crowd('#c08a6a', '#4a3020', 'long', '#4a4a5a') },
  c3: { name: 'Neighbor', look: crowd('#6a4430', '#141014', 'bun', '#6a4a3a') },
  c4: { name: 'Neighbor', look: crowd('#d0a080', '#6a6a6a', 'bald', '#3a4a4a') }
};
const MOUTH = { kael: 'smirk', seren: 'smile', tavi: 'smile', mara: 'frown', ivo: 'smile', vale: 'flat', celestine: 'smirk', warden: 'flat', proctor: 'frown', watchman: 'frown', nell: 'flat', orin: 'flat', dace: 'smile', bao: 'smile', pell: 'smile', juno: 'smile', pip: 'smile', mosi: 'smile', ada: 'flat', hollis: 'frown', marrow: 'frown', fen: 'flat', kit: 'smirk' };
const NPCS = [
  { id: 'tavi', map: 'apt', at: [7, 3], dir: 2 },
  { id: 'mara', map: 'bay', at: [7, 4], dir: 0 },
  { id: 'vale', map: 'bay', at: [11, 5], dir: 2, when: () => !F('puzzleDone') },
  { id: 'dace', map: 'bay', at: [4, 9], dir: 0, when: () => !F('puzzleDone') },
  { id: 'ivo', map: 'square', at: [22, 12], dir: 2, when: () => !F('crateC') || F('ivoTalk2') },
  { id: 'ivo', map: 'square', at: [25, 8], dir: 2, when: () => F('crateC') && !F('ivoTalk2') },
  { id: 'orin', map: 'square', at: [17, 11], dir: 0 },
  { id: 'proctor', map: 'square', at: [13, 9], dir: 1, when: () => !F('proctorDone') && !F('day1Done') },
  { id: 'nell', map: 'clinic', at: [7, 3], dir: 0 },
  { id: 'pip', map: 'clinic', at: [3, 4], dir: 0 }, { id: 'mosi', map: 'clinic', at: [5, 4], dir: 2 }, { id: 'ada', map: 'clinic', at: [11, 5], dir: 2 },
  { id: 'hollis', map: 'square', at: [19, 7], dir: 0, wander: [[19, 7], [24, 7], [24, 10], [19, 10]], when: () => !F('day1Done') },
  { id: 'marrow', map: 'square', at: [8, 13], dir: 0 },
  { id: 'fen', map: 'square', at: [20, 14], dir: 1 },
  { id: 'kit', map: 'square', at: [26, 5], dir: 2 },
  { id: 'bao', map: 'square', at: [5, 11], dir: 0 },
  { id: 'pell', map: 'square', at: [6, 7], dir: 0, wander: [[6, 7], [10, 7], [10, 5], [6, 5]] },
  { id: 'juno', map: 'square', at: [10, 11], dir: 0, wander: [[10, 11], [15, 11], [15, 5], [10, 5]] }
];

// ---- journal
const JOURNAL = {
  p_seren: { tab: 'people', title: 'Seren Holloway', body: "Crew Three pressure-runner. Quick hands, quicker mouth. The person you loved. She took the blame for the valve you turned, and the Authority committed her to the heart-furnace. Her last words: 'Balance the bank, Kael.'" },
  p_tavi: { tab: 'people', title: 'Tavi', body: 'Your little sibling. The fever nearly took them. The air you stole is why they are still here to steal your bread.' },
  p_mara: { tab: 'people', title: 'Mara Venn', body: 'Foreperson, Crew Three. She held you down in the square so you would not die beside Seren. You have not decided whether to thank her.' },
  p_ivo: { tab: 'people', title: 'Ivo', body: 'Childhood friend, scavenger, owner of exactly one boot. He had your other arm that day.' },
  p_orin: { tab: 'people', title: 'Old Orin', body: 'Retired grid engineer. Talks to pipes. Says Seren came asking him about the forbidden line weeks before you ever touched it.' },
  p_nell: { tab: 'people', title: 'Nell', body: 'Clinic tech. Seren ran air canisters to her fever ward. Keeps a tally of shortages that "nobody" causes.' },
  p_vale: { tab: 'people', title: 'Inspector Vale', body: 'Born in the Cinders, raised up to wear grey and a silver pin. He read the charge against Seren. He asked for you on Bank Seven.' },
  p_celestine: { tab: 'people', title: 'High Auditor Celestine Aurel', body: 'Of the Array Authority. Came down Lift 0 in light, called Seren "little ember," and balanced the account. You will not forget her face. Nobody could.' },
  p_sull: { tab: 'people', title: 'Proctor Sull', body: () => 'Authority Proctor, Ashgate beat. Scrubs Seren\'s sun off the Pillar every week with a wire brush.' + (F('threatenedProctor') ? ' You told him what you would do with that brush. He wrote your name down.' : F('charmedProctor') ? ' He left one ray. Maybe by accident.' : '') },
  e_drawing: { tab: 'evidence', title: "Mosi's drawing", body: 'Crayon on a ration wrapper: Seren with a sun for a head, holding hands with forty stick children. You keep it inside your jacket, over your heart. High up. Where the sky would be.' },
  e_tin: { tab: 'evidence', title: 'The tin', body: 'Ash, a blackened brass washer, and an invoice for the fuel that burned her. Fourteen scrip, in installments, out of your wages. Gratitude is breath.' },
  p_dace: { tab: 'people', title: 'Dace Morrow', body: "Seren's runner partner on Crew Three. Joked with you before shift. Gone from the roster by evening — no reassignment listed." },
  e_aux9: { tab: 'evidence', title: 'Outlet AUX-9', body: 'The forbidden line has a name now, freshly stenciled: AUX-9. The line you tapped to save the clinic. Bank Seven will not balance unless it is fed. It is feeding something.' },
  e_crate: { tab: 'evidence', title: 'The cold crate', body: () => "Tagged as slag. Too light, too cold. Real manifest: 40 kg hydroponic greens for 'Meridian Terrace, Tier 1.' Cinderwell starts at Tier 4." + (F('tookSlip') ? ' (The manifest slip is in your pocket.)' : F('reportedCrate') ? ' (You flagged it with Dispatch.)' : '') },
  e_lift: { tab: 'evidence', title: 'Lift 0', body: () => F('ivoTalk2') ? "Lift 0 brought the High Auditor down in light. Ivo says its call light came on again last night — green, eleven seconds. Nobody came down. Something went up." : 'Authority use only. It came down full of light, and went back up full of light. Nobody from Cinderwell got in.' },
  e_chalk: { tab: 'evidence', title: 'Two hands in chalk', body: "On the AUX-9 line: an old arrow pointing up, initialed O.R. Below it, fresh chalk: 'STILL FLOWING. — D.M.' Dace Morrow?" },
  e_riser: { tab: 'evidence', title: 'Riser 9', body: 'AUX-9 runs through the old tunnel and straight up into a sealed riser. The destination plate is scratched out. The air falling from it is warm, and smells green.' },
  e_glove: { tab: 'evidence', title: 'A Crew Three glove', body: 'Someone has been clearing a collapse in the old tunnel. They left a work glove behind, Crew Three tag stitched inside.' },
  pl_cinder: { tab: 'places', title: 'Cinderwell', body: 'Home. Tiers 4 through 9, built around the Deep Array that keeps the air breathable. The Authority calls it "the Cinders." It calls us soot.' },
  pl_square: { tab: 'places', title: 'Ashgate Square', body: "Noodles, gossip, the Lumen Pillar, and Lift 0. Where they took Seren. Someone keeps chalking her sun at the Pillar's base." },
  pl_bay: { tab: 'places', title: 'Maintenance Bay 3', body: "Crew Three's bay. Valve Bank Seven, the heart-furnace, Freight Lift 3, and an outbound dock." },
  pl_tunnel: { tab: 'places', title: 'Old Service Tunnel', body: 'Under Bay 3, through a hatch nobody is supposed to open. Sealed corridors, a collapse, and the AUX-9 line running east.' },
  pl_meridian: { tab: 'places', title: 'Meridian Terrace?', body: 'A name on a manifest. Not on any map you have ever seen. "Tier 1."' }
};

// ---- talk scripts
const TALK = {
  tavi() {
    if (F('day1Done')) return [say('tavi', "Morning! Festival in two days. I'm making Seren's lantern. Finishing it, I mean. It looks like a potato."), say('you', "It's a beautiful potato, Tav."), narr("(Day 2 isn't built yet. Explore as long as you like.)")];
    if (!F('talkedTavi')) return [
      say('tavi', 'You were saying her name again. In your sleep.'),
      { choice: [
        { t: 'Was I? Must have been a good dream.', then: [say('tavi', "Liar. You're a good liar, though. Top three in Cinderwell.")] },
        { t: 'I miss her, Tav.', fx: () => trust('tavi', 1), then: [say('tavi', 'Me too. She used to steal my bread too. You two were made for each other.')] },
        { t: "I'll stop when they pay for it.", fx: () => { setF('angryAtDawn'); fury(1); }, then: [say('tavi', "...Don't say that where Vale can hear. Please. I can't lose two of you.")] }
      ] },
      say('tavi', "The tin's still on the shelf. I didn't touch it. I just... say good morning to it."),
      say('tavi', 'Mara pinned your name to the shift board. Bank Seven.'),
      say('tavi', "Kael... that's the bank. Their bank."),
      say('you', 'Then I guess they want to see if I flinch.'),
      say('tavi', 'Do you?'),
      say('you', 'Never in public.'),
      say('tavi', "Bay's east, through the square. Don't let Ivo talk you into anything. And come home."),
      fx(() => { setF('talkedTavi'); addJ('p_tavi', true); addJ('pl_cinder', true); Game.autosave(); })
    ];
    if (F('clockedOut') && !F('taviNight')) return [
      say('tavi', "You're home. You've got the thinking face. Seren called it your 'scheme face.'"),
      F('toldIvo') ? say('tavi', 'Ivo came by looking serious. Ivo is never serious. Is something happening?') : say('tavi', 'Ivo came by. Said the lift light was on again. Said not to tell you. So obviously I am telling you.'),
      { choice: [
        { t: "Nothing's happening. Go to sleep.", fx: () => setF('liedTavi'), then: [say('tavi', "Okay. You're a bad liar when you're tired. Night.")] },
        { t: "Something is. And I'm going to be ready for it.", fx: () => { setF('honestTavi'); trust('tavi', 1); }, then: [say('tavi', 'Then I want to be ready too. Promise you won\'t do it alone. Not like last time.'), say('you', 'Promise.')] }
      ] },
      fx(() => setF('taviNight'))
    ];
    if (F('clockedOut')) return [say('tavi', "Sleep. You snore when you're scheming, so I'll know.")];
    return [say('tavi', "Go! Mara's counting seconds. I can feel it from here.")];
  },
  mara() {
    if (!F('talkedMara1')) return [
      say('mara', 'You came.'), say('you', 'You sound surprised.'),
      say('mara', "I'd have bet against it. Would've lost. Wouldn't be the first thing I've lost this month."),
      say('mara', "Vale asked for you on Seven. Asked. Vale doesn't ask."),
      say('mara', "Board first. Then the bank. Every pipe fed, no open ends."),
      say('mara', 'And Kael — whatever you see on that bank, you see it with your mouth shut.'),
      { choice: [
        { t: 'My mouth is famously well behaved.', then: [say('mara', "Your mouth is the reason I'm grey.")] },
        { t: 'You held me down that day.', fx: () => setF('confrontedMara'), then: [say('mara', 'I did.'), say('mara', "And I'd do it again. She bought your life, boy. I wasn't going to let you hand it back.")] }
      ] },
      fx(() => { setF('talkedMara1'); addJ('p_mara', true); addJ('pl_bay', true); Game.autosave(); })
    ];
    if (!F('puzzleDone')) return [say('mara', F('tookOrder') ? 'Bank Seven. North wall. Vale is watching. Be boring.' : 'Board. Wall. Left of the bank. Read it.')];
    if (!F('maraDebrief')) return [
      say('mara', "Bank Seven's holding. Good hands. Hers were better."),
      ...(F('bledAgain') ? [say('mara', '...And the clinic branch twitched while Vale was at the furnace. I didn\'t see it. I\'m old. My eyes are terrible.'), say('mara', 'Do it again and I will break your fingers myself. Gently. So you can still work.')] : F('nearlyCaught') ? [say('mara', 'Vale walked off writing. What did you do?'), say('kael', 'Nothing.'), say('mara', "That's what she used to say.")] : []),
      say('you', "Mara. AUX-9. That's what they named it now. The line I tapped."),
      say('you', "It's not dead. It's the fattest line on the bank, and the bank won't balance without it. It's feeding something."),
      say('mara', '...'),
      say('mara', 'Some lines are older than the schematics. You log what\'s on the order.'),
      { choice: [
        { t: "Logged as balanced. I'm a model citizen.", fx: () => { trust('mara', 1); setF('loggedClean'); }, then: [say('mara', "Good. Keep your head down. Keep your crew fed. Keep breathing. That's the whole job.")] },
        { t: 'Where does it go, Mara?', fx: () => setF('askedAux'), then: [say('mara', 'Up.'), say('mara', "Pressure goes up, Kael. That's all a valve knows. Learn to be a valve.")] },
        { t: 'She burned for this pipe. Someone will answer for it.', fx: () => { trust('mara', -1); setF('wantsReport'); fury(1); }, then: [say('mara', 'Someone will. Not today, and not you, not if I can help it.'), say('mara', "Vale is still in the building. And Vale writes everything down.")] }
      ] },
      say('mara', 'Eighteen scrip on your chit.'),
      say('mara', "...Less two. The Authority's installment on her fuel. I'm sorry, son. I didn't write the ledger."),
      { choice: [
        { t: "They're charging me for the fire that burned my wife.", fx: () => fury(1), then: [say('mara', "They charge for everything. That's how you know who owns it."), say('kael', "Then one day I'll send them a bill. Itemized.")] },
        { t: '(Take the chit. Say nothing.)', fx: () => setF('swallowedBill'), then: [say('mara', '...Good. Hate quietly. It lasts longer.')] }
      ] },
      fx(() => { G.scrip += 16; Sound.play('coin'); HUD.toast('+16 scrip (18 − 2 fuel)'); }),
      say('mara', "One more job. Dispatch is short-handed — Sable's lot never has enough hands."),
      say('mara', 'Three outbound crates on the south-east dock. Check the tags against the manifests before Freight Three takes them.'),
      fx(() => { setF('maraDebrief'); Game.autosave(); })
    ];
    if (!F('crateC')) return [say('mara', 'Three crates. South-east dock. Tags against manifests.')];
    if (!F('clockedOut')) return [
      say('mara', 'Done?'),
      ...(F('tookSlip') ? [say('mara', "Whatever's in your pocket — I didn't see it. Neither did you.")] : []),
      ...(F('reportedCrate') ? [say('mara', 'Dispatch says you flagged a crate. Sable will have heard by now. Latch your door tonight.')] : []),
      say('mara', "Dace isn't on tomorrow's roster."),
      say('you', "Where'd they move him?"),
      say('mara', "Roster doesn't say. Roster never says."),
      say('mara', "He was her partner, Kael. Forty-one days, and now him. Go home. Eat something that isn't a brick."),
      fx(() => { setF('clockedOut'); addJ('p_dace'); Sound.play('clue'); Game.autosave(); })
    ];
    return [say('mara', 'Go home, Kael. That is not a request.')];
  },
  vale() {
    if (!F('metVale')) return [
      say('vale', 'Brennick. Back on Bank Seven. The Authority believes in rehabilitation.'),
      { choice: [
        { t: 'Inspector. You look rested. Must be all that extra air.', fx: () => setF('valeWit'), then: [say('vale', "Careful. Wit is a luxury item, and you're on a very tight budget.")] },
        { t: '(Say nothing. Hold his eyes.)', fx: () => setF('valeSilent'), then: [say('vale', 'Good. Silence suits you. It suited her too, in the end. Almost.')] },
        { t: "Rehabilitate me all the way up, Inspector. I'm a fast learner.", fx: () => setF('valeNoted'), then: [say('vale', '...Ambition. In a valve tech. How novel.'), say('vale', "I'll make a note. I make a great many notes.")] }
      ] },
      ...(F('threatenedProctor') ? [say('vale', 'Also. You threatened a Proctor in Ashgate this morning. With a brush, I\'m told. I wrote it down. I write everything down.')] : []),
      say('vale', "Bank Seven has been re-stenciled since the incident. You'll find every line properly labeled now."),
      say('vale', "Do your work. Touch only what is yours. You'll find that's a very short list."),
      fx(() => { setF('metVale'); addJ('p_vale'); })
    ];
    return [say('vale', F('tookOrder') ? 'The bank, Brennick. I am timing you.' : 'The board is on the wall. I trust you can read. Seren could.')];
  },
  dace() {
    if (!F('metDace')) return [say('dace', 'Kael. ...I\'m glad you came back.'), say('dace', "She'd have — never mind. If Seven bites, bite back. For her."), say('dace', "And don't tell Mara I got sentimental. She'll make me grease Conveyor Two with my own hair."), fx(() => setF('metDace'))];
    return [say('dace', 'Festival tomorrow night. I was going to carry her lantern. Now I don\'t know who\'s carrying what.')];
  },
  ivo() {
    if (F('crateC') && !F('ivoTalk2')) return [
      say('ivo', 'There you are. You look like Bank Seven chewed you up and spat out the bolts.'),
      say('ivo', "So? What happened? You've got the scheme face. Seren's name for it, not mine."),
      { choice: [
        { t: "I found a crate going somewhere that doesn't exist.", fx: () => { trust('ivo', 1); setF('toldIvo'); }, then: [
          say('ivo', '...Meridian Terrace?'),
          say('ivo', "Sable's runners say that name when they think nobody's listening. Then they stop saying it."),
          say('ivo', "Here's my thing to show you. Last night, Lift Zero's call light came on. Green. Eleven seconds."),
          say('ivo', "Nobody came down this time, Kael. Something went up.")] },
        { t: "Long shift. I'm just tired.", fx: () => setF('keptFromIvo'), then: [
          say('ivo', "Sure. You've got your 'I'm fine' face on, and it's a terrible face, but sure."),
          say('ivo', "When you're ready: Lift Zero's light came on last night. Eleven seconds. Nobody came down.")] },
        { t: 'Leave it, Ivo. You saw what asking gets you.', fx: () => { trust('ivo', -1); setF('warnedIvo'); }, then: [
          say('ivo', "...I held your arm while they walked her to the furnace. Don't tell me what I saw."),
          say('ivo', "Fine. Then I definitely won't tell you about Lift Zero's light coming on last night. Good night, Kael.")] }
      ] },
      fx(() => { setF('ivoTalk2'); addJ('e_lift'); Game.autosave(); })
    ];
    if (F('ivoTalk2')) return [say('ivo', F('warnedIvo') ? "Go home. I'm busy. Being busy. Very, very busy." : "Go home, Kael. Tavi worries. Don't tell Tavi I said Tavi worries.")];
    if (!F('metIvo')) return [
      say('ivo', 'Kael! Upright! Employed! Last time I saw you upright I was hanging off your arm.'),
      say('you', 'I remember. You bite.'),
      say('ivo', 'Only people I love. Listen — Bank Seven. They put you on her bank on purpose.'),
      say('ivo', 'The gauges on Seven lie. Swear on my boot. My other boot. Not the lost one.'),
      say('ivo', 'Come find me after your shift. I have something to show you.'),
      fx(() => { setF('metIvo'); addJ('p_ivo', true); })
    ];
    return [say('ivo', "Go! Shift! Money! I'll be here, being devastatingly handsome among the scrap.")];
  },
  orin() {
    const first = !F('metOrin') ? [fx(() => { setF('metOrin'); addJ('p_orin', true); })] : [];
    if (F('puzzleDone') && !F('orinHint')) return [say('orin', 'Seven, was it? Fed the fat line. AUX-9, they call it now. Painted it nice and white after they burned your girl.'),
      say('orin', "I drew that line forty years ago. On paper they made me burn."),
      say('orin', 'Your Seren asked me about it, you know. Weeks before you ever touched it. Sharp girl. Too sharp.'),
      say('orin', "There's a hatch in your bay floor. The pipe goes down before it goes up. Follow it, if you've got the stomach."),
      fx(() => setF('orinHint')), ...first];
    if (F('puzzleDone')) return [say('orin', "Water runs downhill. Power goes where it's told. Ask who's telling it."), ...first];
    return [say('orin', "Water runs downhill, kid. Power doesn't. Power goes where it's told."), say('orin', 'They told us the sky burns. I built the pipes that carry the smoke. Never once saw smoke.'), ...first];
  },
  nell() {
    const visit = !F('visitedWard') ? [fx(() => { setF('visitedWard'); })] : [];
    const first = !F('metNell') ? [fx(() => { setF('metNell'); addJ('p_nell', true); })] : [];
    if (F('crateC') && !F('nellHook')) return [
      say('you', 'Nell. Have you ever seen greens? Real ones. Chilled.'),
      say('nell', '...'), say('nell', "Don't say that word in the square again. I mean it."),
      say('nell', 'Come by the clinic in a few days. Quietly. Bring whatever you saw. Seren would have.'), fx(() => setF('nellHook')), ...first];
    if (F('nellHook')) return [say('nell', 'Quietly, Kael.')];
    if (F('bledAgain') && !F('nellBleed')) return [say('nell', 'Somebody fed my ward an hour ago. The gauge jumped like a heart.'), say('nell', "I'm not going to ask. I'm going to say thank you to the air, and I'm going to pray that whoever it was is better at not getting caught than she was."), fx(() => setF('nellBleed')), ...first, ...visit];
    return [say('nell', 'Kael. You came in. Most people can\'t, now.'), say('nell', "Forty kids. Every one of them breathing on their own. That's what she bought. Look at them. Don't look away from it. You earned that, both of you."), say('nell', "And now they've cut us to ration again. Fever salts gone. Shipments come in full and the depot sends them out half-empty. Nobody's stealing. Nobody is ever stealing."), ...first, ...visit];
  },
  proctor() {
    return [
      say('proctor', 'Move along, soot. Nothing to see. Just cleaning up graffiti.'),
      narr("He is scrubbing Seren's sun off the Pillar with a wire brush. The little rays come off one at a time."),
      { choice: [
        { t: 'Missed a spot, Proctor. Want me to hold the bucket? I am famously good with buckets.', fx: () => setF('charmedProctor'), then: [say('proctor', '...Get out of my light, Brennick.'), narr('He gathers his bucket and goes. He leaves one ray. Maybe by accident.')] },
        { t: '(Grab the brush.) Touch her sun again and I will feed you this brush.', fx: () => { setF('threatenedProctor'); fury(2); }, then: [
          say('proctor', '...Say that again, soot. Slower. So I get the spelling right.'),
          say('kael', 'K-A-E-L. B-R-E-N-N-I-C-K. Crew Three. Write it big.'),
          narr('He writes it. He takes his time about it. Then he walks off whistling the shift song, and you understand that you have just made a mistake you would make again.')] },
        { t: '(Walk away. Not today.)', fx: () => setF('swallowedProctor'), then: [narr('You walk. Your nails cut little crescents into your palms. Behind you, the brush keeps scraping.')] }
      ] },
      fx(() => { setF('proctorDone'); addJ('p_sull'); Game.autosave(); })
    ];
  },
  hollis() { return [say('hollis', 'Kael. ...Took a halberd at her commitment for humming. Still can\'t lift my left arm above the shoulder.'), say('hollis', 'Worth it. We hummed her all the way to the door. She heard us. I know she did.')]; },
  marrow() { return [say('marrow', 'They docked my family\'s air ration a week for humming. Gratitude is breath, the Proctor said.'), say('marrow', 'My breath, apparently. Not theirs.'), ...(F('chalkedSun') ? [say('marrow', 'I saw you redraw her sun. Bigger. Good. Make them scrub harder.')] : [])]; },
  fen() { return [say('fen', '*cough* Air for an old man? Spare a breath? ...No? Smart lad.'), say('fen', "Air's the only thing worth stealing down here. Everyone knows that. Your wife knew it.")]; },
  kit() { return [say('kit', "Freight Three goes up nine floors. The sign says six. You didn't hear it from me."), say('kit', 'Nobody hears anything from me. Nobody hears anything from anyone. That\'s how you get to keep breathing.')]; },
  pip() { return [say('pip', "You're Seren's Kael! She said you'd be grumpy and tall. You're only grumpy."), say('pip', 'She told us the sky is blue. Like the inside of a gas flame. Is that true?'),
    { choice: [{ t: "It's true. She saw it in a book.", then: [say('pip', "I KNEW it. Mosi said it was green.")] }, { t: "I don't know yet. I'm going to find out.", fx: () => setF('promisedPip'), then: [say('pip', 'Then come back and tell us. Promise. She always came back.')] }] }]; },
  mosi() { return [say('mosi', "I drew her. Look. That's her, and that's the sun. Her head is the sun because she's warm."), narr('The drawing is crayon on the back of a ration wrapper. A woman with a sun for a head, holding hands with forty stick children.'),
    ...(F('gotDrawing') ? [] : [{ choice: [{ t: 'Can I keep it?', fx: () => { setF('gotDrawing'); addJ('e_drawing'); }, then: [say('mosi', "...Okay. But you have to put it somewhere high up. Where the sky would be.")] }, { t: "It's perfect. Keep it safe.", then: [say('mosi', "I'm putting it under my pillow. The Proctors don't check under pillows.")] }] }])]; },
  ada() { if (F('bledAgain')) return [say('ada', 'The storm came back! The fan did the storm again! ...Was that you?'), say('kael', 'Storms just happen, sweetheart. Nobody does them.'), say('ada', '...Seren said that too. Exactly like that.')]; return [narr('Ada is very small and very still. She is breathing on her own, slow and steady, which six weeks ago she could not do.'), say('ada', '...Is she coming back to fix the fan again?'), say('kael', '...No, sweetheart. But I will. I\'m very good at fans.')]; },
  pell() { const l = ["Sorry about Seren, Kael. She swept better than me. Don't tell anyone.", "Festival's tomorrow. I'm sweeping early. Like a professional.", "Pillar's going white soon. Day's half gone."]; return [say('pell', l[(G.talkCount.pell = (G.talkCount.pell || 0) + 1) % l.length])]; },
  juno() { const l = ["I drew Seren's sun on the Pillar again! The grey men scrub it. I draw it faster.", 'My brother says the sky is fire. My other brother says it\'s soup.', "When I grow up I'm gonna ride Lift Zero and never come back. Except for noodles."]; return [say('juno', l[(G.talkCount.juno = (G.talkCount.juno || 0) + 1) % l.length])]; },
  bao() { return HOT.stall(); }
};

// ---- hotspot scripts
const HOT = {
  mural: () => [narr('A painted sun, peeling at the edges. Mom painted it the year Tavi was born.'), narr("Seren used to touch it on her way out the door. For luck, she said. It didn't work.")],
  shelf: () => [narr("Seren's festival lantern, half-finished. A paper sun on a wire frame. She never got to light it."),
    narr('Beside it, the tin. Authority grey, with a little stamped sun on the lid. Somebody up there thought that was a nice touch.'),
    ...(F('openedTin') ? [narr('You know what is inside. You check anyway. You always check.')] : [{ choice: [
      { t: 'Open it.', fx: () => { setF('openedTin'); addJ('e_tin'); }, then: [narr('Ash. Less than you would think. A brass washer, blackened, still round. And the invoice, folded in thirds.'), narr('COMMITMENT FUEL — 14 SCRIP. BALANCE OWED: 10. GRATITUDE IS BREATH.'), say('kael', "...Balance owed. Funny. That's what I was going to say.")] },
      { t: 'Not today.', then: [narr('Not today. You touch the lid with two fingers, the way she used to touch the mural.')] }] }])],
  radio: () => [narr(F('puzzleDone') ? "Cinder Radio: '...a reminder that rumors damage morale. And damaged morale damages air.'" : "Cinder Radio: '...Array output nominal. Surface toxicity holding at lethal. Gratitude is breath, Cinderwell.'")],
  worksheet: () => [narr("Tavi's school worksheet: 'WHY THE SURFACE IS DEADLY (5 reasons).'"), narr("Tavi has added a sixth, in pencil: 'Nobody ever came back to say.'"), narr("And under it, smaller: 'Seren said the sky is blue. How would she know?'")],
  bed: () => {
    if (F('day1Done')) return [narr("Not tired yet. (Day 2 isn't built yet — explore as long as you like.)")];
    if (!F('clockedOut')) return [narr(F('talkedTavi') ? "No time. The bell's already rung." : "Tavi's giving you a look. The 'get up' look.")];
    return [narr('Sleep and end the day?'), { choice: [{ t: 'Sleep.', then: [fx(() => Game.dayEnd())] }, { t: 'Not yet.' }] }];
  },
  notice: () => [narr('FESTIVAL OF THE FIRST FIRE — tomorrow, last bell. Bring a lantern.'), narr('BY ORDER OF THE ARRAY AUTHORITY: Theft of air is theft from all. Gratitude is breath.'), narr("Someone has scratched beneath it, very small: 'SEREN.'")],
  lift0: () => [narr('LIFT 0 — ARRAY AUTHORITY USE ONLY.'), narr('Forty-one days ago it came down full of light. It went back up full of light. Nobody from Cinderwell got in.'),
    ...byTend({ seeker: 'The gate rails are freshly greased. Someone up there uses this more than they admit.', tinkerer: 'The conduit feeding it is new, and thicker than the one feeding the whole clinic.', caretaker: "Kids dare each other to touch it. Since Seren, nobody's daring anymore." }),
    narr(F('ivoTalk2') ? 'The call light is dark now. You stare at it anyway.' : "Behind the grille, the call light is dark. You'd swear it's warm."), fx(() => addJ('e_lift', true))],
  clinic: () => [narr('CLINIC — CLOSED FOR STOCKTAKING. Again.'), narr('Six weeks ago the fever wards were breathing each other\'s breath. Then, for three days, they weren\'t.')],
  pillar: () => {
    if (!F('proctorDone')) return [narr('A Proctor is kneeling at the Pillar\'s base with a bucket and a wire brush.')];
    const done = F('chalkedSun');
    return [narr('The Lumen Pillar fakes a day: amber at first bell, white at noon, red at last bell. It turned red an hour early the day they took her.'),
      narr("At its base, someone has chalked a small sun. Seren's sun. The Authority scrubs it every week. It's back every morning."),
      ...(done ? [] : [{ choice: [
        { t: F('charmedProctor') ? 'Redraw it. All of it. Bigger.' : 'Redraw her sun. Bigger than before.', fx: () => setF('chalkedSun'), then: [narr('You draw it bigger than before. Every ray. Your hand is steadier than you expected.'), say('you', "Morning, Seren. I'm back on your bank. Try not to laugh.")] },
        { t: 'Leave it. Not where Vale can see.', fx: () => setF('leftSun'), then: [narr("You keep walking. You'll come back when no one's watching. You always do.")] }
      ] }]), fx(() => addJ('pl_square', true))];
  },
  bench: () => [narr('A bench polished smooth by forty years of tired people. You and Seren split noodles here the night before the lift came down.')],
  cart: () => [narr("Ivo's scrap cart. A hand-painted sign: EVERYTHING WORKS (MOSTLY).")],
  stall: () => {
    const n = G.talkCount.bao = (G.talkCount.bao || 0) + 1;
    if (n === 1) return [say('bao', 'Kael. Sit. This one is on the house.'), say('bao', 'For her. She always paid in jokes. Terrible jokes. I miss them.'), fx(() => { setF('ateNoodles'); Sound.play('coin'); }), narr('You eat. It burns. It is perfect. For a minute, nobody says anything, which is the kindest thing anyone has done for you in weeks.')];
    return [say('bao', "Another? Four scrip this time. Grief is free, noodles aren't."),
      { choice: [
        { t: 'Buy a bowl (4 scrip).', then: [fx(() => { if (G.scrip >= 4) { G.scrip -= 4; Sound.play('coin'); Dialogue.push([narr('You slurp. It burns. It is perfect.')]); } else Dialogue.push([say('bao', "Four scrip, friend. I can count, even if the Array can't.")]); })] },
        { t: 'Not now.', then: [say('bao', 'The broth will remember you.')] }
      ] }];
  },
  shiftboard: () => {
    if (F('puzzleDone')) return [narr("CREW 3 — TOMORROW: Mara Venn · Kael Brennick · and a strip of fresh tape where 'Dace Morrow' used to be."), narr("Under the tape you can still see an older strip. 'S. Holloway.'"), fx(() => { if (!G.journal.includes('p_dace')) { addJ('p_dace'); Sound.play('clue'); } })];
    if (!F('talkedMara1')) return [narr('CREW 3 — WORK ORDERS.'), narr("You can feel Mara watching you read it. Better check in with her first.")];
    if (!F('tookOrder')) return [narr('CREW 3 — WORK ORDERS'), narr('WO-114  Valve Bank 7 — rebalance — K. Brennick\nWO-115  Conveyor 2 — grease — D. Morrow\nWO-116  Fuse room C — inspect — tomorrow'),
      narr('You initial WO-114. Her bank. Your hands.'), fx(() => { setF('tookOrder'); Sound.play('ok'); Game.autosave(); })];
    return [narr('WO-114  Valve Bank 7 — rebalance — K. Brennick. North wall, right of the board.')];
  },
  valves: () => {
    if (F('puzzleDone')) return [narr("Bank Seven hums, steady. AUX-9's gauge reads full. It always will.")];
    if (!F('tookOrder')) return [narr('Valve Bank 7. The last time you stood here, Seren was keeping watch by the door.'), narr('Grab your work order from the board first.')];
    return [fx(() => Puzzle.open(PUZZLES, Game.onPuzzleDone))];
  },
  suns: () => [narr("Seren's little suns, painted straight onto the plaster. Seventeen of them. She added one every time something good happened."), narr('The last one is half-finished. You have not been able to decide whether to finish it.')],
  tools: () => [narr('Your valve keys, pressure wrenches, the bent pick you use for seized couplings. All of it clean. Seren used to say you loved those tools more than her. You used to let her think she was joking.')],
  cot: () => [narr("Tavi's cot. They have slept in your bed since the fever. Neither of you has said why. Neither of you needs to.")],
  screen: () => [narr("An Authority screen. It cycles the same four messages from first bell to last: GRATITUDE IS BREATH. THE SURFACE BURNS. REPORT AIR THEFT. THE AUTHORITY PROVIDES."), narr("Between messages, for one frame, the emblem: a golden sun with an open eye in its center. Kids call it 'the Watcher.' Adults don't call it anything.")],
  poster0: () => [narr("GRATITUDE IS BREATH. Every surface in Cinderwell says it. You've started hearing it in Celestine's voice.")],
  poster1: () => [narr('REPORT AIR THEFT. REWARD: 50 SCRIP.'), narr('Fifty scrip. Seren was worth fifty scrip to somebody. You wonder who collected.')],
  poster2: () => [narr('BY ORDER OF THE ARRAY AUTHORITY: SEREN HOLLOWAY, CREW THREE, COMMITTED TO THE ARRAY FOR THEFT OF AIR. LET THE ACCOUNT BALANCE.'), narr('Someone has drawn a tiny sun in the corner, in chalk. Someone else has tried to scrape it off and failed.'), ...(F('touchedPoster') ? [] : [{ choice: [
    { t: 'Tear it down.', fx: () => { setF('touchedPoster'); fury(1); setF('toreNotice'); }, then: [narr('It rips in one long, satisfying sound. Three people in the square stop and stare. One of them, very quietly, starts to clap. Then stops.'), say('kael', "They'll print another. Let them. Paper costs them something.")] },
    { t: 'Leave it. Let it remind you.', fx: () => setF('touchedPoster'), then: [narr('You read it again. And again. Until every letter is carved somewhere behind your eyes.')] }] }])],
  poster3: () => [narr('THE SURFACE BURNS. STAY BELOW. STAY GRATEFUL.'), narr('The illustration shows a red sky and a skeleton. It is very well drawn. Somebody up there has a lot of time for drawing.')],
  poster4: () => [narr('WORK IS WORSHIP. Underneath, in grease pencil: "THEN WHO\'S THE GOD?"')],
  vent: () => [narr('A floor vent breathing out warm, stale air. Tier 6\'s ration, recycled for the fourth time today. It tastes like pennies.')],
  relay: () => [narr("The audit relay. The fuse you pulled forty-one days ago has been replaced with a sealed Authority unit, wired in gold."), narr('Of course it has.')],
  kidsuns: () => [narr("The kids have painted suns all over the ward wall, copying Seren's. Some are yellow. Some are blue. One is green, with a face."), narr('Under them, in Nell\'s neat hand: "FOR SEREN, WHO BROUGHT THE AIR."')],
  fanvent: () => [narr('The ward fan, turning slow. Ration speed.'), narr('For three nights it spun so fast the kids called it "the storm." You were the storm. She was the reason.')],
  wardboard: () => [narr('BREATHING ON THEIR OWN: 40 / 40.'), narr("Forty names in chalk. Tavi's is ninth. Next to the board somebody has added a forty-first line, no name, just a little sun.")],
  canisters: () => [narr('Air canisters. Empty, every one. Stamped RATION — TIER 6 — GRATITUDE IS BREATH.'), ...byTend({ tinkerer: 'The valves have been fitted with restrictors. Somebody went to real effort to make sure these could only ever be half full.', seeker: 'The fill dates are all the same day. The day after the commitment.', caretaker: "Seren's handwriting is still on one: 'FOR PIP. EXTRA. DON'T TELL.'" })],
  emptycot: () => [narr('An empty cot, freshly made. Nell keeps it that way. For whoever is next, she says. She never says what she thinks.')],
  hatch: () => {
    if (!F('puzzleDone')) return [narr('A service hatch to the old tunnels, bolted shut. Mara keeps the key on her belt.')];
    return [narr(F('sawRiser') ? 'The hatch to the old tunnel. Still unbolted.' : 'The hatch is unbolted now. Someone left it that way. The AUX-9 line dives straight through the floor beside it.'),
      { choice: [{ t: 'Climb down.', then: [fx(() => { Sound.play('door'); Fade.go(() => { World.load('tunnel', { x: 2 * 16 + 8, y: 4 * 16 + 4, dir: 3 }); addJ('pl_tunnel', true); Game.autosave(); }); })] }, { t: 'Not now.' }] }];
  },
  sealdoor: () => [narr('SERVICE CORRIDOR 4 — SEALED AFTER PRESSURE EVENT, YEAR 2231.'), ...byTend({ tinkerer: 'The weld bead on the seal is clean and modern. Much newer than 2231.', seeker: 'The date was stenciled over an older date. You can still see its ghost underneath.', caretaker: 'Somebody left a candle stub at the foot of the door. For whoever was on the other side.' })],
  chalk: () => [narr('Chalk on the AUX-9 line, faded but careful: an arrow pointing up, and initials. O.R.'), narr("Below it, fresh chalk in a different hand: 'STILL FLOWING. — D.M.'"), narr('D.M. Dace Morrow. Seren\'s partner. He kept going after they burned her.'), fx(() => { if (!G.journal.includes('e_chalk')) Sound.play('clue'); addJ('e_chalk'); setF('sawChalk'); Game.autosave(); })],
  rubble: () => [narr('An old collapse. But someone has been moving the rocks: there is a neat stack to one side.'), narr('Wedged between two stones, a work glove. A Crew Three tag is stitched inside.'), fx(() => { addJ('e_glove'); setF('sawGlove'); })],
  tpipe: () => [narr('AUX-9. The pipe is warm, and it hums. Pressure is going somewhere in a hurry.')],
  riser: () => {
    if (F('sawRiser')) return [narr('Riser 9. Warm air keeps falling, patient as a promise.')];
    return [narr('The AUX-9 line meets a riser as wide as a lift shaft and turns straight up into the dark.'), narr('RISER 9. FLOW TO: — the destination plate has been scratched out with something sharp.'),
      narr('Air falls from the grille. Warm air. It smells like the cold crate: green, and alive, and like nothing in Cinderwell.'),
      say('you', 'They told us the sky would strip our lungs out.'),
      say('you', "This is our air, going up. And that... that's theirs, coming down. They've been breathing better than us on our own work."),
      { choice: [
        { t: '"Balance the bank." You meant this, didn\'t you, Seren.', fx: () => setF('vowHeart'), then: [say('you', "They took from us. So the account's open. I'll close it. For you, and for every kid in Nell's ward.")] },
        { t: "I'm not going to break their world. I'm going to climb it.", fx: () => setF('vowRise'), then: [say('you', "They came down in light. One day I'm going up in it. And they'll call me sir.")] },
        { t: 'Every pipe has a top. I want to see who sits at it.', fx: () => setF('vowSeek'), then: [say('you', "Somebody up there chose this. I'm going to learn their name, and their schedule, and their favorite tea.")] }
      ] },
      fx(() => { setF('sawRiser'); addJ('e_riser'); Sound.play('clue'); Game.autosave(); })];
  },
  furnace: () => [fx(() => { World.fxFlash('#ff6a20', 0.7); Sound.play('roar'); }),
    narr('The heat hits your face and you are back there.'),
    narr('Her hand lifted. The washer catching the fire. The doors. Eleven seconds.'),
    fx(() => World.fxFlash('#fff0d0', 0.4)),
    say('kael', '...Breathe. Breathe, Kael. She told you to breathe.'),
    ...(F('touchedFurnace') ? [] : [{ choice: [
      { t: 'Press your palm to the furnace door.', fx: () => { setF('touchedFurnace'); fury(1); }, then: [narr('You hold it there until it hurts. You want it to hurt. When you pull away, the shape of your hand stays on the iron for a moment, then fades, like everything they burn.')] },
      { t: 'Turn away. Not here. Not in front of Vale.', fx: () => setF('turnedFromFurnace'), then: [narr('You turn away. Somewhere behind you, Vale makes a note.')] }] }])],
  freight: () => [narr('FREIGHT LIFT 3 — DISPATCH PERSONNEL ONLY.'), ...byTend({ tinkerer: 'The cable drum is rated for three times the tiers on the sign.', seeker: 'The floor indicator has nine marks. Someone painted over the top three.', caretaker: "Sable's runners ride it up and come back with new boots." })],
  conveyor: () => [narr(F('puzzleDone') ? "Conveyor Two has gone quiet. Dace's grease rag hangs off the rail, still wet." : 'Conveyor Two, clanking along. Dace is elbow-deep in its gearbox.')],
  crateA: () => !F('maraDebrief') ? [narr('Outbound freight. Not your job — yet.')] : [narr('Crate A. Tag: SLAG — RECLAIM DEPOT 4.'), narr('Manifest: slag, 200 kg. Heavy as sin. It matches.'), fx(() => setF('crateA'))],
  crateB: () => !F('maraDebrief') ? [narr('Outbound freight. Not your job — yet.')] : [narr('Crate B. Tag: FILTER CORES, SPENT.'), narr('Manifest: 12 spent filter cores. Smells like the inside of a lung. It matches.'), fx(() => setF('crateB'))],
  crateC: () => {
    if (!F('maraDebrief')) return [narr("Outbound freight. There's frost on the corner. Frost?")];
    if (F('crateC')) return [narr("The cold crate. Waiting for a lift to somewhere that isn't.")];
    return [narr('Crate C. Tag: SLAG — RECLAIM DEPOT 4.'),
      narr("But it's far too light for slag. And it's cold. Cold like nothing down here is cold."),
      ...byTend({ tinkerer: 'The lid seals are refrigeration-grade. Way above dock spec.', caretaker: "Nell's clinic can't get fever salts. Somebody can afford to chill a box of rocks?", seeker: 'Someone sanded an older tag off before stapling this one on.' }),
      narr('Under the tag, a second slip. HYDROPONIC GREENS, 40 KG. DELIVER: MERIDIAN TERRACE, TIER 1.'),
      say('you', "Greens. Real greens. Tavi's never even seen a leaf. And there is no Tier 1. Cinderwell starts at Four."),
      { choice: [
        { t: 'Flag the discrepancy with Dispatch.', fx: () => setF('reportedCrate'), then: [narr('You stamp it HOLD — DISCREPANCY. Somewhere, a dispatcher is going to be very annoyed.'), say('you', 'Let them come ask me about it. I have questions too.')] },
        { t: 'Pocket the manifest slip.', fx: () => setF('tookSlip'), then: [narr('The slip goes in your pocket. The tag goes back on. The crate looks exactly as wrong as before.'), say('you', "Evidence is just a story nobody's told yet.")] }
      ] },
      fx(() => { setF('crateC'); addJ('e_crate'); addJ('pl_meridian', true); Sound.play('clue'); Game.autosave(); })];
  }
};

// ---- valve puzzles: authored solutions (N E S W letters), scrambled at runtime
const PUZZLES = [
  { name: 'BANK 7-A', tip: 'Tap a coupling to turn it. Feed every pipe from the pump. Leave no open ends.', cols: 4, rows: 3, cells: [
    ['', 'ES', 'SW', ''],
    ['SRC:E', 'NW', 'NS', 'OUT:S:RES'],
    ['', '', 'NE', 'NW']] },
  { name: 'BANK 7-B', tip: 'Two outlets. Residential... and the line you tapped for the clinic.', cols: 6, rows: 5, cells: [
    ['', '', 'ES', 'EW', 'SW', ''],
    ['', 'ES', 'NW', '', 'NE', 'OUT:W:RES'],
    ['SRC:E', 'WNS', '', 'ES', 'W', ''],
    ['', 'NE', 'EWS', 'NW', 'ES', 'OUT:W:AUX-9'],
    ['', '', 'NE', 'EW', 'NW', '']] }
];

// ---- ambient barks
function barks(id) {
  const eve = F('clockedOut') && !F('day1Done');
  const B = {
    pell: eve ? ['LONG DAY, KAEL?', 'MIND THE GRATE.'] : ['MORNING, KAEL.', 'SORRY ABOUT SEREN.', 'SWEEP, SWEEP.'],
    juno: ['I DREW HER SUN!', "CAN'T CATCH ME!", 'THE SKY IS SOUP!'],
    bao: ['NOODLES! HOT!', 'SIT, KAEL. EAT.'],
    orin: F('puzzleDone') ? ['FOLLOW THE PIPE.', 'HMM.'] : ['THE PIPES ARE TALKING.', 'HMM.'],
    dace: ['HEY, KAEL.', 'FOR HER.'],
    ivo: F('crateC') && !F('ivoTalk2') ? ['PSST! OVER HERE!'] : ['NEED A BOOT?', 'SCRAP! GOOD SCRAP!'],
    nell: ['FEVER SALTS... GONE AGAIN.'],
    mara: F('tookOrder') && !F('puzzleDone') ? ['CLOCK IS RUNNING.'] : [],
    vale: ['GRATITUDE IS BREATH.', 'TICK, TOCK, BRENNICK.'],
    proctor: ['MOVE ALONG, SOOT.', 'NOTHING TO SEE.'],
    hollis: ['WE HUMMED FOR HER.', 'ARM STILL ACHES.'], marrow: ['RATIONS CUT AGAIN.'], fen: ['*COUGH* SPARE A BREATH?'], kit: ['NINE FLOORS. NOT SIX.'],
    pip: ['IS THE SKY BLUE?'], mosi: ['I DREW HER!'], ada: ['...'],
    tavi: F('clockedOut') ? ['YOU OKAY?'] : []
  };
  return B[id] || [];
}
