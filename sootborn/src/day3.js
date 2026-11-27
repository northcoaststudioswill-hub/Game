// SOOTBORN — Day 3: The Ledger. Told as an illustrated chapter: panels, choices, one fight under the floor, and a dream.
// It closes the hooks Day 2 left open (the ledger, what Celestine has seen, Dace) and sets up how Kael gets out.
FF.under = () => ({
  title: 'UNDER THE FLOOR', sub: 'A WARDEN AT THE HATCH', bg: 'pit', arena: { kind: 'ring', rx: 92, ry: 42 }, music: 'mystery', legend: 1, skip: 1, winText: 'HE STAYS DOWN',
  hero: { hp: 8, pow: 1, fury0: 40 }, allies: ['dace'], shouts: ['HIS KNEE!', 'KEEP HIM OFF THE HATCH!'], taunt: { 0: ['UNLOGGED PERSONS.', 'ON YOUR KNEES.', 'YOU ARE OWED TO THE FURNACE.'] },
  foes: [{ id: 'warden', name: 'Warden', kind: 'baton', hp: 34, sc: 1.1 }],
  voice: { at: [[1, F('ranForHer') ? 'FORTY-THREE DAYS AGO I HIT ONE OF THESE WITH EVERYTHING I HAD. HE DID NOT MOVE.' : 'FORTY-THREE DAYS AGO ONE OF THESE HELD THE FURNACE DOOR, AND I STOOD STILL.'], [11, 'HARL FIGHTS LIKE SOMEBODY WHO HAS DONE THIS BEFORE. I DID NOT KNOW THAT ABOUT HARL.'], [22, 'HE IS ONLY A MAN IN A MASK. NOBODY EVER LET US FIND THAT OUT.']],
    hurt: 'IT HURTS LESS THAN THE FIRST TIME. EVERYTHING DOES.', fury: F('ranForHer') ? 'THREE STEPS, LAST TIME. I HAVE MORE THAN THREE STEPS NOW.' : 'I DID NOT MOVE THEN. I AM MOVING NOW.', half: 'HE IS BREATHING THROUGH HIS TEETH. THEY BREATHE. I HAD NOT BEEN SURE.', eleven: 'ONE FOR EVERY SECOND. THIS TIME THEY LAND.' },
  arts: [{ at: .5, name: F('ranForHer') ? 'THREE STEPS' : 'STOOD STILL', line: F('ranForHer') ? 'I GOT THREE STEPS TOWARD HER BEFORE ONE OF THESE PUT ME ON THE FLOOR. THIS IS THE FOURTH.' : 'MARA HELD MY ARMS AND I LET HER. NOBODY IS HOLDING THEM TONIGHT.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }]
});
const DREAM4 = () => [
  { fx: () => { World.gilded = 1; } },
  { card: 'THAT NIGHT', sub: 'Further in than it has gone before.', min: 1.4, max: 4 },
  { card: 'NIGHT THIRTY', sub: 'The Assay. The night before day thirty-one.', big: 1, min: 1.5, max: 4.5 }, { mission: 'dais' }, { card: 'MORNING', sub: 'The Assay. Day thirty-one. He has noticed the page.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.proctor() },
    { brawl: () => FF.voss2d() },
    { music: 'mystery' }, { panel: 'voss' }, { fade: 'in', spd: 0.8 }, { wait: 1.2 },
    { narr: 'Nobody touches an Assayer. It is the first rule of the Assay, and the only one they have ever enforced.' },
    { say: 'voss', t: 'You cannot. There is no line for this. There is no column. Nobody has ever needed one.' },
    { say: 'kael', t: 'Then one will have to be added.' },
    { sfx: 'heart' }, { wait: 0.8 }, { sfx: 'pillar' }, { flash: '#ffffff' }, { pstage: 1 }, { wait: 1.6 },
    { narr: 'Forty cadets of Violet and thirty of Teal watched an Assayer go down in the mud, and learned in one breath what my tier has never been allowed to learn. They fall over like anybody.' },
    { pstage: 2 }, { wait: 1.2 },
    { narr: 'What I took from him. First the boots. Thirty days I had watched them hang over us, humming. They are lighter than they look, and in my hands they were dead.' },
    // the vent stack: he climbs it with Voss's dead boots and charges them at the crown. He can fly from here on
    { fade: 'out' }, { issue: 'stack', or: [{ narr: "The Assayers charge them on the island, at the crown of the vent stack. I climbed it by the keeper's stair, the way we climb everything, and stood them on the collar until they burned blue." }] },
    { panel: 'voss' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { narr: 'It took me the rest of that day to stop falling out of the sky.' },
    { narr: 'Then the seal on his collar. It opens the cache. That night I broke a white ribbon and fed seventy people the bread and salve that had sat forty paces from them for a month.' },
    { narr: 'There was a strip of paper in the boot. A sum, a patron\'s mark, and "Violet to finish below." So I knew whose debt Corin Ashby had been paying.' },
    { pstage: 3 }, { wait: 1.6 },
    { narr: 'Last, the cloak. White, and gold at the hem. I wore it back down the ridge with his blood on it, and nobody on the dais came down to take it off me.' },
    { narr: 'From that night they did not follow the House. They followed the cloak. I have thought since that it is all an Assayer ever was. A man, and something white to stand in.' },
    { fx: () => { G.flags.fury = (G.flags.fury || 0) + 2; } }, { fade: 'out' }, { panel: null },
  { fade: 'out' }, { panel: 'ante' }, { pstage: 5 }, { fade: 'in', spd: 1.2 }, { wait: 0.6 }, { music: 'hum' },
  { narr: 'Further still. The white room again, years on. A wheel under my hands. I am humming, and I do not know it, and across the room a cup stops halfway to her mouth.' },
  { music: null }, { sfx: 'heart' }, { wait: 1 },
  { narr: 'I wake before I see what she does.' }, { music: 'mystery' },
  { fade: 'out' }, { panel: null },
  { card: 'FORTY-THREE DAYS AFTER THE FURNACE', sub: 'Cinderwell. Under the floor.', big: 1, tr: 'wake', min: 1.4, max: 4 }
];
function DAY3() {
  const up = [
    { fade: 'out' }, { panel: 'lift' }, { pstage: 3 }, { fade: 'in', spd: 0.8 }, { wait: 1.6 },
    { narr: 'The call light goes white. The doors open for eleven seconds. I have counted that light every day for forty-three days. I have never been on this side of it when it changed.' },
    { pstage: 4 }, { wait: 0.8 },
    { narr: 'Inside, the car is white, and there is a bench. I have never sat on anything that soft.' },
    { narr: 'It climbs for nine minutes. I count. Kit was right. Nine floors, not six. There are three levels above us that are on no map in Cinderwell.' },
    { fade: 'out' }, { panel: 'ante' }, { fade: 'in', spd: 0.7 }, { wait: 1.4 },
    { narr: 'The top is a white room with a shuttered frame in the wall. Vale takes the ledger out of my hands at the door and does not come in.' },
    { pstage: 1 }, { wait: 1.2 },
    { say: 'celestine', t: 'The valve technician. You hung a lantern where I had forbidden one. Sit.' },
    { say: 'kael', t: 'Aye, Auditor.' },
    { say: 'celestine', t: 'One does not say "aye" in this room. It sounds like something a pipe does.' },
    { say: 'celestine', t: 'Somebody balanced Bank Seven for three nights with a bleed I could not find on any gauge. I burned a girl for it. The fever ward is still breathing. So it was not her hands on that wheel.' },
    { choice: [
      { t: 'It was mine.', fx: () => { G.flags.toldHer = 1; G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('celestine', 'Yes. Noted. You have spared me the saying of it.')] },
      { t: 'She was my wife.', fx: () => { G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('celestine', 'I know what she was. I am asking what you are.')] },
      { t: '(Say nothing.)', then: [say('celestine', 'Good. You can hold your tongue. That is rarer down there than talent.')] }
    ] },
    { say: 'celestine', t: 'I knew at the furnace. I needed the tier to see a price paid, and she offered herself before you had finished being brave. She was quicker than you. I expect she always was.' },
    { say: 'celestine', t: 'Little ember. That is what I called her, when she looked at me. I do not usually remember them.' },
    { narr: 'One. Two. Three. I get to eleven and start again. My hands stay on my knees.' },
    { say: 'celestine', t: 'I am not telling you this to be cruel. I am telling you because I have a use for you, and I prefer my tools to know what they are.' },
    { say: 'celestine', t: 'The Array is failing. Not down there. Up here. I have forty engineers who have never touched a valve. You will come up twice a week and show them what a wheel is for.' },
    { say: 'celestine', t: 'Look out of the window, technician.' },
    { pstage: 2 }, { sfx: 'door' }, { wait: 2.6 },
    { narr: 'Not a screen. A window. And in it a light that does not flicker.' },
    { narr: 'Blue. I had the word. I did not have the thing.' },
    { narr: 'She had bet me. Years ago, on the roof of the noodle stall, looking up at the rock. "I bet you it\'s blue. I bet you a ring." She did not have a ring. I made her one off a valve to settle it, and she said that did not count, because I had not lost yet.' },
    { sfx: 'heart' }, { narr: 'I have lost now. It is blue. She was right, and they burned her underneath it, and the woman who gave the order is standing beside me waiting to be thanked for the view.' },
    { fx: () => { G.flags.fury = (G.flags.fury || 0) + 2; } },
    { narr: 'The surface did not burn. Or it stopped burning a long time ago, and nobody came down to tell us.' },
    { say: 'celestine', t: 'Now you know what I have seen. You will not say it below. Nobody would believe you, and I should have to burn whoever did.' },
    { say: 'celestine', t: 'You may go. And when I dismiss you, the word is "granted." You will learn. Your kind always does, eventually.' },
    { fade: 'out' }, { panel: null },
    { card: 'THAT EVENING', sub: 'Cinderwell. Second bell. Four hundred people watching the light to see if he would come down.', min: 1.8, max: 6 },
    { panel: 'row' }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'tavi', t: 'Was it yellow? Kael. Was she right?' },
    { choice: [
      { t: 'I didn\'t see it, Tav.', then: [say('tavi', '...Oh.'), narr('It is the first time I have ever lied to that child. The High Auditor did not have to be in the room to make me do it.')] },
      { t: '(Say nothing. Nod, once.)', fx: () => { G.flags.toldTavi = 1; }, then: [say('tavi', '...'), narr('Tavi looks at me for a long moment, then goes very quietly back to the lantern frame. Mara sees it. She does not ask.')] }
    ] },
    { say: 'mara', t: 'You\'ve got a look on you I have only seen once before. The night after the furnace. Eat something.' },
    { fade: 'out' }, { panel: null }
  ];
  const under = [
    { music: 'mystery' }, { panel: 'under' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'That night the chalk in the old tunnel has changed again. Seren\'s suns, and newer ones in a different hand. Then an arrow.' },
    { pstage: 1 }, { wait: 1.2 },
    { say: 'dace', t: 'Don\'t shout. I\'m not a ghost. I\'ve been under your feet for two days, eating what Sable drops through the Freight Three grating.' },
    { say: 'dace', t: 'You went up. Don\'t lie, the whole tier watched that light. What\'s up there?' },
    { choice: [
      { t: 'The sky. It never burned.', fx: () => { G.flags.toldDace = 1; }, then: [say('dace', '...Say it again.'), say('kael', 'There\'s a window. It\'s blue, Harl. There\'s grass.'), say('dace', 'Two hundred years. Two hundred years of rationing us air under a sky that works.')] },
      { t: 'Nothing worth a furnace.', then: [say('dace', 'That\'s her talking, not you. Fine. Keep it. But you\'ll tell me before the end.')] }
    ] },
    { say: 'dace', t: 'There are more of us than chalk. Hollis. Nell, with her cold crates. Sable. People on Tier Four you\'ve never met. We call ourselves the Unlit, because we\'re what\'s left in the lantern when they put it out.' },
    { say: 'dace', t: 'We\'ve been waiting years for someone the Authority would carry up their own lift. Now they\'ve picked one for us.' },
    { say: 'dace', t: 'There\'s a woman who can make you look like them. Not yet. They\'ll watch you for months. When they stop, she\'ll find you. Until then you fix valves, you go up twice a week, and you are the most boring man on Tier Six.' },
    { say: 'kael', t: 'I am very bad at boring.' },
    { say: 'dace', t: 'Seren said. Learn.' },
    { pstage: 2 }, { sfx: 'door' }, { wait: 1.2 },
    { narr: 'Light, down through the hatch. A halberd. A mask. One Warden, on a routine sweep, in the wrong tunnel on the wrong night.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.under() },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: F('ranForHer') ? 'A Warden, on the floor, breathing through his teeth. Forty-three days ago one of them did not move when I hit him with everything I had.' : 'A Warden, on the floor, breathing through his teeth. I had not known they could be put there.' },
    { say: 'dace', t: 'Well. That\'s done it. He\'ll wake with a headache and a story nobody will want to write down. Wardens don\'t lose.' },
    { say: 'dace', t: "Before you go home. Ten years you've kept that bank turning. You want to see what they're counting?" },
    // the Deep Array: named all through the game, never shown until now. He has a wrench and nothing he will learn later
    { fade: 'out' }, { panel: null }, { issue: 'array', or: [{ panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { narr: 'He took me down a ladder under the floor, to the machine the air comes from. Forty-eight banks. Thirty-one of them lit. I had been keeping it alive for ten years, one valve at a time, and nobody had ever let me see it.' }, { fade: 'out' }, { panel: null }] },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'dace', t: 'Go home. You were never here. And Kael. She\'d have liked that.' },
    { fade: 'out' }, { panel: null }
  ];
  return [
    { music: 'home' }, { card: 'THE LEDGER', sub: 'Forty-three days after the furnace.', big: 1, tr: 'wake', min: 1.6, max: 5 },
    { panel: 'kael' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'I did not sleep much. Vale\'s offer sat on my chest all night. Carry the Bank Seven ledger up Lift Zero. Nobody from Cinderwell has ever gone up Lift Zero and come back down.' },
    { fade: 'out' }, { panel: 'row' }, { pstage: 4 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'mara', t: 'It\'s a leash. They put it on the clever ones first. Your father thought he was being promoted, too.' },
    { say: 'ivo', t: 'It\'s a door, Mara. Nobody from here has ever come back down that lift to tell us. He\'d be the first to know what we\'re even kneeling to.' },
    { say: 'tavi', t: 'Will you see the sun? The real one? Seren said it was yellow. Will you tell me if she was right?' },
    { say: 'kael', t: 'If I see it, Tav, you\'ll be the first to know. On my breath.' },
    { narr: 'I did not know yet that this was a promise I would not be allowed to keep.' },
    { fade: 'out' }, { panel: 'kael' }, { fade: 'in', spd: 0.8 }, { wait: 0.4 },
    { say: 'vale', t: 'First bell, Brennick. The Auditor is waiting on a ledger.' },
    { narr: 'Vale says "noted" the way a man wears a borrowed coat. He was born on Tier Four, the top of the rock, and counted up. When he is tired he still says "don\'t."' },
    { choice: [
      { t: 'I\'ll carry it.', fx: () => { G.flags.ledgerUp = 1; }, then: [say('vale', 'Noted. Stand up straight. Do not touch anything white.')] },
      { t: 'Send your clerk.', fx: () => { G.flags.ledgerUp = 0; G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('vale', 'I was being polite. She asked for the hands that know the bank. You were never being offered a choice. Nobody down here is.'), narr('He holds out the ledger until I take it.')] }
    ] },
    ...up, ...under,
    ...(NOFF ? [] : DREAM4()),
    { fx: () => { G.flags.day3Done = 1; } }
  ];
}

// ---------------------------------------------------------------- more of the Assay, and after
const DUEL_IN = (id, name, big, c1, c2, c3, sc) => [
  { d: 3.0, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-40, 4], fx: 1, fy: 0, blade: 1, aura: 1 }, { id, a: [40, 4], fx: -1, fy: 0, blade: 1, sc: sc || 1 }], big, cap: c1 },
  { d: 2.6, ...cu(40, 4, 1.7, 2.3, 16), acts: [{ id, a: [40, 4], blade: 1, sc: sc || 1 }], cap: c2 },
  { d: 2.2, ...cu(-40, 4, 1.9, 2.7, -14), flash: 1, sfx: 'heart', acts: [{ id: 'kael2', a: [-40, 4], blade: 1, aura: 2 }], cap: c3 }
];
const DUEL_OUT = (id, c1, c2, c3, sc) => [
  { d: 3.0, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id, a: [22, -2], pose: 'kneel', fx: -1, fy: .2, sc: sc || 1 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: c1 },
  { d: 3.0, ...cu(-10, 2, 1.9, 2.6, 12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 2 }], cap: c2 },
  { d: 3.0, cam: [0, 150, 60, 150, .3], to: [0, 250, 170, 150, .16], acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 1 }], cap: c3 }
];
// day twenty-six: the standard, and the two who guard it
FF.twins = () => ({ flat: 1,
  era: 3, title: 'THE STANDARD', sub: 'THE SISTERS VEY - TWO BLADES, ONE MIND', bg: 'ford', arena: FIELD, music: 'dusk', rage: 2, legend: 1, skip: 1, winText: 'THE STANDARD IS OURS',
  fin: { name: 'TWO FOR ONE', l1: 'THEY FIGHT AS ONE PERSON', l2: 'SO I ONLY COUNT ONCE', rgb: '120,220,210' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 40 }, taunt: { 0: ['HE IS SLOW ON THE LEFT.', 'I HAVE HIM.', 'TOGETHER.', 'NOW.'] },
  foes: [{ id: 'cadt1', name: 'Ansa Vey', kind: 'duelist', hp: 56, sc: 1.05 }, { id: 'cadt2', name: 'Oria Vey', kind: 'duelist', hp: 56, sc: 1.05 }],
  voice: { at: [[1, 'TAKE A HOUSE\'S STANDARD AND ITS CADETS ARE YOURS. TEAL HAS SENT TWO SISTERS WHO HAVE NEVER LOST A BOUT TO TAKE THEIRS BACK.'], [12, 'THEY DO NOT TALK TO EACH OTHER. THEY DO NOT NEED TO. I HAD THAT ONCE, WITH ONE PERSON.'], [26, 'CREW THREE TURNED A WHEEL THE SAME WAY. FORTY HANDS, ONE COUNT. THESE TWO WOULD HAVE MADE GOOD VALVE TECHS.']],
    hurt: 'ONE CUTS WHILE THE OTHER ONE IS STILL SMILING.', fury: 'I DO NOT HAVE A SECOND PAIR OF HANDS. I HAVE THIS.', half: 'THE YOUNGER ONE LOOKED AT HER SISTER BEFORE SHE LOOKED AT ME. THAT IS THE GAP.', eleven: 'ELEVEN. SPLIT TWO WAYS.' },
  arts: [{ at: .7, name: 'FORTY BEDS', line: 'THE FEVER WARD HAD FORTY BEDS. I COUNTED THEM EVERY NIGHT. I HAVE NOT STOPPED COUNTING THINGS SINCE.', panel: 'ward', kind: 'storm', rgb: '160,220,255', hex: '#a0dcff' }, { at: .3, name: 'ONE COUNT', line: 'FORTY PEOPLE ON ONE WHEEL, HUMMING TO KEEP TIME. NOBODY UP HERE HAS EVER PULLED ON ANYTHING TOGETHER.', panel: 'pipe', kind: 'rise', rgb: '255,170,70', hex: '#ffaa46' }],
  intro: [
    { d: 3.0, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-50, 4], fx: 1, fy: 0, blade: 1, aura: 1 }, { id: 'cadt1', a: [36, -12], fx: -1, fy: 0, blade: 1 }, { id: 'cadt2', a: [36, 18], fx: -1, fy: 0, blade: 1 }], big: 'THE STANDARD', cap: 'THE ASSAY. DAY TWENTY-SIX. THE SISTERS VEY HAVE COME ACROSS THE RIVER FOR TEAL\'S STANDARD.' },
    { d: 2.6, ...cu(36, 2, 1.6, 2.2, 18), acts: [{ id: 'cadt1', a: [30, -10], blade: 1 }, { id: 'cadt2', a: [42, 14], blade: 1 }], cap: 'ANSA AND ORIA VEY. THEY MOVE LIKE ONE PERSON WHO HAPPENS TO HAVE FOUR ARMS.' },
    { d: 2.2, ...cu(-50, 4, 1.9, 2.7, -14), flash: 1, sfx: 'heart', acts: [{ id: 'kael2', a: [-50, 4], blade: 1, aura: 2 }], cap: 'I MET THEM ALONE. I DID NOT WANT ANYBODY BEHIND ME WHO COULD BE USED.' }
  ],
  outro: DUEL_OUT('cadt2', 'THE YOUNGER ONE PUT HER BLADE DOWN FIRST. THE OLDER ONE DID IT A BREATH LATER, AND NOT FOR ME.', 'TEAL\'S STANDARD STAYED IN OUR CAMP. THIRTY CADETS CAME ACROSS THE RIVER AFTER IT.', 'I HAD AN ARMY NOW. I HAD NOT ASKED WHAT I WOULD OWE IT.')
});
// after the Keep: the last thing she asks of him
FF.blade = () => ({
  era: 4, boots: 1, title: 'THE PINNING', sub: 'THE AUDITOR\'S BLADE - HER OWN CHAMPION', bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'duel', rage: 3, legend: 1, skip: 1, winText: 'PIN IT ON HIM',
  newMove: 'THE BOOTS: HOLD JUMP TO FLY. HE HAS THEM TOO.', fin: { name: 'IRON SKY', l1: 'SHE WANTED TO SEE WHAT I WAS', l2: 'I SHOWED HER MOST OF IT', rgb: '140,220,255', mode: 'sky' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 50, cape: CLOAK }, taunt: { 0: ['YOU WERE NOT RAISED TO THIS.', 'I CAN SMELL THE EFFORT.', 'WHO TAUGHT YOU THAT?'] },
  foes: [{ id: 'voss', name: 'The Auditor\'s Blade', kind: 'duelist', hp: 150, sc: 1.22, k2: { slam: 1 } }],
  voice: { at: [[1, 'I PUT HER SON ON HIS KNEES. SHE SMILED, AND SENT HER OWN CHAMPION DOWN THE STEPS. ONE MORE, SHE SAID. FOR MY CURIOSITY.'], [13, 'HE HAS KILLED FOR HER FOR THIRTY YEARS. HE DOES IT THE WAY I USED TO CHANGE A SEAL.'], [27, 'SHE IS LEANING FORWARD. I HAVE SEEN THAT LOOK. SHE HAD IT AT THE FURNACE.']],
    hurt: 'HE CUTS WHERE THE WIRE WENT IN. HE CAN SEE IT. SHE CANNOT.', fury: 'NOT ALL OF IT. NOT IN FRONT OF HER. ENOUGH.', half: 'HE HAS REALISED I AM NOT WHAT IS WRITTEN ON MY PAPERS. HE CANNOT WORK OUT WHAT I AM INSTEAD.', eleven: 'ELEVEN. SHE COUNTS THEM TOO. SHE DOES NOT KNOW WHY THERE ARE ELEVEN.' },
  arts: [{ at: .68, name: 'LITTLE EMBER', line: 'SHE CALLED SEREN LITTLE EMBER. SHE IS ABOUT TO PIN HER SUN ON WHAT THE EMBER LIT.', panel: 'furnace', stage: 0, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }, { at: .32, name: 'THE WINDOW', line: 'SHE SHOWED ME THE SKY ONCE TO TEACH ME MY PLACE. I HAVE BEEN STANDING UNDER IT FOR FIFTY DAYS.', panel: 'ante', stage: 2, kind: 'storm', rgb: '140,200,255', hex: '#8cc8ff' }],
  intro: DUEL_IN('voss', '', 'THE PINNING', 'THE ASSAY IS OVER. LUCAN AUREL IS ON ONE KNEE. HIS MOTHER HAS NOT STOPPED LOOKING AT ME.', 'SHE SENDS DOWN THE MAN WHO HAS STOOD BEHIND HER CHAIR FOR THIRTY YEARS.', 'ONE MORE. FOR HER CURIOSITY. I HAVE BEEN THE OBJECT OF HER CURIOSITY BEFORE.', 1.22),
  outro: [
    { d: 3.0, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id: 'voss', a: [22, -2], pose: 'kneel', fx: -1, fy: .2, sc: 1.22 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: 'HE YIELDED. I DO NOT THINK HE HAD EVER SAID THE WORD OUT LOUD.' },
    { d: 3.4, ...cu(-10, 2, 1.8, 2.6, 12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, pose: 'kneel', aura: 1 }], cap: 'SHE CAME DOWN THE STEPS HERSELF AND PINNED THE GOLD SUN TO MY COLLAR. HER HANDS WERE COLD. SHE LOOKED STRAIGHT INTO THE FACE ILSE MADE.' },
    { d: 3.4, ...cu(-10, 2, 2.6, 1.8, -12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, pose: 'kneel', aura: 2 }], cap: 'SHE SAID: YOU REMIND ME OF SOMEONE. THEN: NO. AND SHE GAVE ME A POST ON THE SPIRE, COUNTING WHO BREATHES.' },
    { d: 3.0, cam: [0, 150, 60, 150, .3], to: [0, 250, 170, 150, .16], acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 1 }], cap: 'THE KEYS. HANDED OVER, IN FRONT OF EVERYONE, BY THE WOMAN WHO BURNED MY WIFE.', tint: 'rgba(255,240,200,.1)' }
  ]
});
// seven years on: you cannot fall on the Spire without something to fall in
FF.docks = () => ({
  era: 5, boots: 1, title: 'THE HIGH DOCKS', sub: 'FOUR HUNDRED BARGES - CUT THEM LOOSE', bg: 'fall', arena: FIELD, music: 'battle', rage: 3, legend: 1, skip: 1, foeName: 'Dock Guard', winText: 'CUT THE LINES',
  fin: { name: 'EVERY BREATH', l1: 'EVERY BREATH I TAKE IS HERS', l2: 'TONIGHT I TAKE FOUR HUNDRED BARGES', rgb: '255,224,138', mode: 'all' },
  hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 50 }, allies: V, shouts: ['CUT IT!', 'NEXT LINE!', 'FOR TIER SIX!'], taunt: { 0: ['HE WEARS THE SUN!', 'TRAITOR!', 'HOLD THE MOORINGS!'] },
  waves: [[{ id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 9 }, { id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 9 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 9 }],
    [{ id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 10 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 10 }, { id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 10 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 10 }],
    [{ id: 'vant', name: 'Stair Captain Rook', kind: 'captain', hp: 130, sc: 1.2 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 10 }]],
  onWave: (w, B) => { B.p.fury = Math.max(B.p.fury, 70); B.voice('wave'); },
  voice: { at: [[1, 'THREE YEARS ON THE SPIRE, COUNTING WHO BREATHES. I COUNTED OTHER THINGS AS WELL. BARGES. GUARDS. WHO OWED WHOM.'], [12, 'TONIGHT I AM STILL WEARING THEIR SUN ON MY COLLAR. IT GOT ME THROUGH THE GATE. IT COMES OFF AFTER THIS.'], [24, 'ILSE IS ON THE MOORING WINCH. BRAND HAS THE STAIR. HARL CAME UP FROM BELOW. HE SAYS THE TIERS ARE READY.']],
    hurt: 'THREE YEARS BEHIND A DESK. I AM SLOWER. I AM NOT KINDER.', fury: 'I HAVE BEEN POLITE FOR THREE YEARS. NOTED. GRANTED. ONE DOES NOT. NO MORE.', wave: 'ROOK. HE WALKED ME THE LENGTH OF THIS QUAY ONCE, WITH A LAMP.', half: 'HE KNOWS EVERY CLEAT BY NUMBER. HE NEVER ASKED WHAT I WAS.', eleven: 'ELEVEN. I STOPPED SAYING THEM OUT LOUD ON THE SPIRE. I NEVER STOPPED COUNTING.' },
  arts: [{ on: 'start', after: 6, name: 'THE COUNT', line: 'THEY GAVE ME THE LEDGER OF WHO BREATHES. I READ ALL OF IT. EVERY NAME THEY EVER STRUCK OUT.', panel: 'world', stage: 3, kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { on: 'wave', name: 'UNLIT', line: 'WE ARE WHAT IS LEFT IN THE LANTERN WHEN THEY PUT IT OUT. THERE ARE A GREAT MANY OF US.', panel: 'under', stage: 1, kind: 'rise', rgb: '255,170,80', hex: '#ffaa50' }],
  intro: [
    { d: 2.8, black: 1, big: 'SEVEN YEARS AFTER THE FURNACE', cap: 'SEVEN YEARS AFTER THE FURNACE. I HAVE A POST, A SUN ON MY COLLAR, AND A KEY TO THE HIGH DOCKS.' },
    { d: 3.2, cam: [0, 330, 170, 150, .3], to: [0, 240, 110, 150, .3], acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 1, fy: -1 }].concat(ffRow(V, 5, -60, 30, 44, { fy: -1 })), big: 'THE HIGH DOCKS', cap: 'THE LIFT-BARGES MOOR HERE, ABOVE THE WEATHER. FOUR HUNDRED OF THEM. WE NEED EVERY ONE.' },
    { d: 2.6, cam: [70, 60, 50, 150], to: [-70, 60, 50, 150], lin: 1, sfx: 'roar', acts: ffRow(['sg1', 'sg2'], 7, -90, 30, -80, { fy: 1 }, -10), cap: 'THE LAMPS ON THE STAIR WERE ALREADY LIT. SOMEBODY HAD TOLD THEM THE HOUR.' },
    { d: 1.6, ...cu(0, 20, 1.9, 2.9, -14), flash: 1, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 3 }], big: 'CUT THEM LOOSE.' }
  ],
  outro: [
    { d: 3.0, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 2 }], cap: 'I TOOK THE SUN OFF MY COLLAR AND DROPPED IT OVER THE RAIL. IT FELL FOR A LONG TIME.' },
    { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 240, 130, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'FOUR HUNDRED BARGES. EVERY ONE WITH A CREW THAT WAS BORN OWING AIR. IT TOOK US TWO MORE YEARS TO BE READY TO USE THEM.' },
    { d: 2.6, black: 1, big: 'NINE YEARS AFTER THE FURNACE', cap: 'AND THEN, ONE MORNING, WE WERE.' }
  ]
});
FF.wayout = () => ({
  era: 0, title: 'THE WAY OUT', sub: 'TALLYMAN SULL AND THE NIGHT WATCH', bg: 'pit', arena: { kind: 'ring', rx: 96, ry: 44 }, music: 'mystery', legend: 1, skip: 1, foeName: 'Night Watch', winText: 'NOBODY SAW',
  hero: { hp: 9, pow: 1, fury0: 50 }, allies: ['dace'], shouts: ['QUIETLY!', 'NOT HIS FACE, HE HAS TO WRITE!'], taunt: { 0: ['BRENNICK?', 'I KNEW IT. I KNEW IT.', 'YOU ARE OWED TO THE FURNACE.'] },
  foes: [{ id: 'proctor', name: 'Tallyman Sull', kind: 'baton', hp: 40 }, { id: 'watchman', name: 'Night Watch', kind: 'quick', hp: 10 }, { id: 'watchman', name: 'Night Watch', kind: 'quick', hp: 10 }],
  voice: { at: [[1, 'FOUR MONTHS OF BEING NOBODY. OF LETTING THIS MAN WIN ARGUMENTS ABOUT GAUGES.'], [11, 'HE IS BETTER WITH THE BATON THAN I GAVE HIM CREDIT FOR. HE HAS HAD A LOT OF PRACTICE ON PEOPLE WHO COULD NOT HIT BACK.'], [22, 'IF ONE OF THEM REACHES THE BELL, ROW K BURNS FOR IT. NOBODY REACHES THE BELL.']],
    hurt: 'GOOD. I HAD ALMOST FORGOTTEN WHAT I WAS KEEPING IN.', fury: 'BE TOO MUCH FOR THEM, SHE SAID. I HAVE BEEN TOO LITTLE FOR FOUR MONTHS.', half: 'HE HAS STOPPED SHOUTING MY NAME. HE HAS STARTED SAYING PLEASE.', eleven: 'ELEVEN. THE LAST TIME I COUNT THEM DOWN HERE.' },
  arts: [{ at: .55, name: 'TOO MUCH', line: 'BE TOO MUCH FOR THEM. IT WAS THE LAST THING SHE ASKED ME FOR. I AM LATE STARTING.', panel: 'furnace', stage: 0, kind: 'storm', rgb: '255,120,40', hex: '#ff7828', dark: 'rgba(26,4,2,.8)' }]
});
function DAY4() {
  return [
    { music: 'home' }, { card: 'THE WAY OUT', sub: 'One hundred and sixty days after the furnace.', big: 1, tr: 'wake', min: 1.8, max: 5 },
    { panel: 'ante' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'Twice a week, for four months, I ride up in the white car and teach forty engineers what a valve is for. They are not stupid. They have simply never had to keep anything alive.' },
    { narr: 'I listen. Noted. Granted. One does not. I learn where the nine floors are, and which doors want a gold pass, and who is afraid of whom. I draw none of it. I count it.' },
    { pstage: 7 }, { wait: 0.4 },
    { say: 'wren', t: 'Technician. If the seat is scored, why does the gauge still read true? I have asked three of my seniors. They told me gauges do not lie.' },
    { say: 'kael', t: 'Gauges lie all the time. You put your hand on the pipe.' },
    { say: 'wren', t: 'One... touches it?' },
    { say: 'kael', t: 'We do. Down there. Aye.' },
    { say: 'wren', t: '"We." What a useful word. One is never allowed it.' },
    { narr: 'Kestrel Dray. Nineteen, and the only one of the forty who ever got grease on a cuff. She asks me once where I learned it. I say: Tier Six. She writes that down as if it were a school.' },
    { pstage: 2 },
    { say: 'celestine', t: 'You have stopped saying "aye," technician.' },
    { say: 'kael', t: 'Noted.' },
    { narr: 'She laughed. It is the only time I ever heard it. I added it to the list.' },
    { fade: 'out' }, { panel: 'furnace' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'In the third month she had me brought down to Bay Three with two of her engineers, to look at the heart-furnace. Not the fire. The doors.' },
    { say: 'celestine', t: 'They stick, technician. The specification is seven seconds from open to sealed. They have been taking eleven. It is untidy. People are given time to make noise.' },
    { sfx: 'heart' }, { narr: 'Eleven seconds.' },
    { sfx: 'heart' }, { narr: 'I have counted them every day since she walked in. I built everything I am on them. They were a worn seat on a closing valve. A fault. Nobody had meant to give us even that.' },
    { narr: 'I knew the seat. I could have cut a new one in an afternoon. She stood behind me while I had my hands inside the housing, exactly where she stood the last time.' },
    { choice: [
      { t: 'Tell her the seat is past saving.', fx: () => { G.flags.doors = 'kept'; G.flags.fury = (G.flags.fury || 0) + 2; }, then: [say('kael', "It's worn through the casting, Auditor. You'd have to replace the whole housing. Months."), say('celestine', 'Then it will keep. Note it.'), narr('It was not worn through anything. Eleven seconds is all anybody down here is given. I was not going to be the hands that took four of them back.')] },
      { t: 'Fix it. Stay useful. Stay alive.', fx: () => { G.flags.doors = 'fixed'; G.flags.fury = (G.flags.fury || 0) + 4; }, then: [narr('I cut the seat. Seven seconds, door to seal, as specified. She timed it herself and said "granted."'), narr('Everybody who has walked in since has had four seconds less of the hum than Seren did. I did that. I did it so I could stand here long enough to do the rest. I have told myself that every day, and counted the four seconds anyway.')] }
    ] },
    { say: 'celestine', t: 'You are shaking, technician.' },
    { say: 'kael', t: 'Cold housing, Auditor.' },
    { fade: 'out' }, { panel: 'kael' }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { narr: 'Below, I am the most boring man on Tier Six. I fix valves. I eat at Ivo\'s. I let Tallyman Sull win an argument about a gauge, twice, in front of people.' },
    { fade: 'out' }, { panel: 'freight' }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'sable', t: 'So you\'re the one Harl keeps under the floor like a bad secret. I\'m Sable. I run Freight Three, which means I decide what nobody saw arrive.' },
    { pstage: 1 }, { wait: 1 },
    { say: 'sable', t: 'Cold crates. Greens, from somewhere with dirt and daylight. They come down marked for the Spire kitchens and four in forty go missing on my count. Nell\'s ward gets them.' },
    { say: 'sable', t: 'You\'ve seen where they grow, haven\'t you. Don\'t tell me. I like not knowing. It keeps my face honest.' },
    { fade: 'out' }, { panel: 'row' }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'mara', t: 'You\'ve gone quiet. You were never quiet, not once in all your breath. You\'re leaving.' },
    { choice: [
      { t: 'Yes.', fx: () => { G.flags.toldMara = 1; }, then: [say('mara', 'Don\'t tell me where. If I know, they can ask me.')] },
      { t: 'I can\'t tell you.', then: [say('mara', 'That\'s an aye. You never could lie to me, you only ever managed it with yourself.')] }
    ] },
    { say: 'mara', t: 'Tavi will ask. I\'ll say you went to fix something big. That\'s true, isn\'t it?' },
    { say: 'kael', t: 'The biggest valve there is.' },
    { say: 'mara', t: 'Be too much for them. I heard her say it. Go on, then. And Kael. Come back taller.' },
    { say: 'tavi', t: 'Kael? I finished her lantern. The proper one, not the potato. I\'m keeping it for next year so you can light it.' },
    { say: 'kael', t: 'Light it yourself, Tav. You\'ve got steadier hands than me.' },
    { narr: 'That was goodbye. Tavi did not know it. I have gone over it since, more often than the furnace.' },
    { fade: 'out' }, { panel: 'hands' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'I took the washer out of the tin before I went. I had left it shut since the morning it came. It still had a thread of her hair caught in the bore.' },
    { narr: 'The night I gave it to her she turned it over and said: it is a valve washer, Kael. It is the only round thing you own. So I will have to be careful with it, because you plainly will not get another.' },
    { sfx: 'heart' }, { narr: 'She wore it eleven months. I am going to wear it nine years. I did not know the number then. I would have gone anyway.' },
    { fade: 'out' }, { music: 'mystery' }, { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'dace', t: 'Tonight. They dropped the watch on you to one Tallyman a week ago. Sable sold him a bottle this afternoon.' },
    { say: 'dace', t: 'A man can\'t just vanish down here. The count wouldn\'t balance, and the count always balances. Kael Brennick has to die on paper.' },
    { say: 'dace', t: 'A seal fails on the Bay Three furnace line. You went in to fix it. Mara signs as witness. They send her a tin. Nobody looks for a man they have already weighed.' },
    { say: 'kael', t: 'She\'ll have two tins.' },
    { say: 'dace', t: 'She knows. She said to tell you she\'s running out of shelf.' },
    { pstage: 2 }, { sfx: 'door' }, { wait: 1.2 },
    { narr: 'Light, down through the hatch. Not the Tallyman with the bottle. Sull, sober, with the night watch behind him, and four months of wondering why I had stopped arguing.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.wayout() },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'Sull, on his back, looking up at me the way a man looks at a gauge that cannot be right.' },
    { say: 'proctor', t: 'Brennick. They\'ll burn the whole row for this.' },
    { say: 'dace', t: 'No. Because you are going to write that Kael Brennick went into the furnace line after a failed seal, and that you tried to pull him out. You\'ll get a commendation. Or the Inspector hears who has been selling watch shifts by the bottle.' },
    { say: 'proctor', t: '...Noted.' },
    { fade: 'out' }, { panel: 'row' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 }, { pstage: 1 },
    { narr: 'Two days later a tin goes to Row K. Authority grey, a little sun stamped on the lid. Mara signs for it. There is nothing in it. She puts it on the shelf beside the other one.' },
    { fade: 'out' }, { panel: 'under' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'I go out through the old tunnel, past Seren\'s suns. I touch every one of them. Then the hatch, and a stair I did not know was there, and at the top of it a tall woman with gold in her eyes.' },
    { say: 'ilse', t: 'You are shorter than I was told.' },
    { say: 'kael', t: 'I\'m told that can be fixed. ...Ta. For coming.' },
    { say: 'ilse', t: 'That is the last time you will say that word for nine years. Enjoy it. It can be fixed, and you will wish it could not. Come along, soot. One does not keep the table waiting.' },
    // the callback: one beat of the Table's first picture, a page in and a page out. It is the only time the Gilding touches the present; the present stops at that door
    { card: '', big: 1, tr: 'page', min: .95, max: 1.05 }, { panel: 'gild' }, { fx: () => { Fade.a = 0; Fade.dir = 0; Fade.busy = false; } }, { sfx: 'heart' }, { wait: 1.9 },
    { card: '', big: 1, tr: 'page', min: .95, max: 1.05 }, { panel: null }, { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } },
    ...(NOFF ? [] : [{ fx: () => { World.gilded = 1; } }, { card: 'THAT NIGHT', sub: 'The last dream below. It runs to the end.', min: 1.4, max: 4 }, { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. Day forty.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.valley40() }, { card: 'NIGHT FORTY-NINE', sub: 'The Assay. The night before the last day.', big: 1, min: 1.5, max: 4.5 }, { mission: 'eve' }, { card: 'MORNING', sub: 'The Assay. The last day.', big: 1, min: 1, max: 3.2 }, { brawl: () => FF.keepEnd() }]),
    { card: 'END OF PART ONE', sub: 'B E L O W', big: 1, sfx: 'splash', min: 2.6, max: 7 },
    { fx: () => { G.flags.day4Done = 1; } }
  ];
}
function afterDay(n, sv) { G.mode = 'dayend'; UI.push(modal({ clear: true, onBack: null, build(b) { b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
    b.innerHTML = n === 3 ? '<p>A Warden lies under the floor of Bay Three with a headache nobody will write down. A valve tech has seen the sky, and has been told to be boring about it.</p><h2 style="margin-top:16px">THE LEDGER · 43 DAYS AFTER THE FURNACE</h2>' : '<p>Kael Brennick is dead on paper. Something taller is going to come up Lift Zero wearing another name.</p><p><i>"Every breath I take now is hers."</i></p><h2 style="margin-top:16px">END OF PART ONE</h2>'; },
  items: (n === 4 ? [{ label: 'Begin Part Two — Above', act: () => playPart2(1) }] : []).concat(n === 3 ? [{ label: 'Wake up: The Way Out, 160 days after the furnace', act: () => { UI.clear(); Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(DAY4(), () => { if (sv) { sv.flags = Object.assign(sv.flags || {}, { day4Done: 1 }); } afterDay(4, sv); }); } }] : []).concat([
    { label: 'Keep exploring Cinderwell', act: () => { UI.clear(); if (sv) { Game.loadSave(sv); Game.autosave(); } else Game.toTitle(); } }, { label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }]) })); }

// the Ford again, with the new fighters standing in the pixel-art valley instead of the low-poly one
FF.ford2d = () => Object.assign(FF.ford(), { flat: 1, sub: 'SINGLE COMBAT FOR THE CROSSING' });
