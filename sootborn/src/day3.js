// SOOTBORN — Day 3: The Ledger. Told as an illustrated chapter: panels, choices, one fight under the floor, and a dream.
// It closes the hooks Day 2 left open (the ledger, what Celestine has seen, Dace) and sets up how Kael gets out.
FF.under = () => ({
  title: 'UNDER THE FLOOR', sub: 'A WARDEN AT THE HATCH', bg: 'pit', arena: { kind: 'ring', rx: 92, ry: 42 }, music: 'mystery', legend: 1, skip: 1, winText: 'HE STAYS DOWN',
  hero: { hp: 8, pow: 1, fury0: 40 }, allies: ['dace'], shouts: ['HIS KNEE!', 'KEEP HIM OFF THE HATCH!'], taunt: { 0: ['UNLOGGED PERSONS.', 'ON YOUR KNEES.', 'YOU ARE OWED TO THE FURNACE.'] },
  foes: [{ id: 'warden', name: 'Warden', kind: 'baton', hp: 34, sc: 1.1 }],
  voice: { at: [[1, F('ranForHer') ? 'FORTY-THREE DAYS AGO I HIT ONE OF THESE WITH EVERYTHING I HAD. HE DID NOT MOVE.' : 'FORTY-THREE DAYS AGO ONE OF THESE HELD THE FURNACE DOOR, AND I STOOD STILL.'], [11, 'DACE FIGHTS LIKE SOMEBODY WHO HAS DONE THIS BEFORE. I DID NOT KNOW THAT ABOUT DACE.'], [22, 'HE IS ONLY A MAN IN A MASK. NOBODY EVER LET US FIND THAT OUT.']],
    hurt: 'IT HURTS LESS THAN THE FIRST TIME. EVERYTHING DOES.', fury: F('ranForHer') ? 'THREE STEPS, LAST TIME. I HAVE MORE THAN THREE STEPS NOW.' : 'I DID NOT MOVE THEN. I AM MOVING NOW.', half: 'HE IS BREATHING THROUGH HIS TEETH. THEY BREATHE. I HAD NOT BEEN SURE.', eleven: 'ONE FOR EVERY SECOND. THIS TIME THEY LAND.' },
  arts: [{ at: .5, name: F('ranForHer') ? 'THREE STEPS' : 'STOOD STILL', line: F('ranForHer') ? 'I GOT THREE STEPS TOWARD HER BEFORE ONE OF THESE PUT ME ON THE FLOOR. THIS IS THE FOURTH.' : 'MARA HELD MY ARMS AND I LET HER. NOBODY IS HOLDING THEM TONIGHT.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }]
});
const DREAM4 = () => [
  { card: 'THAT NIGHT', sub: 'It shows him the day he arrives.', min: 1.4, max: 4 },
  { panel: 'assay' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'Four years from now the lift opens on grass. I have read the word. I stand on it for a full minute before I can make myself walk.' },
  { pstage: 3 }, { wait: 1.2 },
  { narr: 'A Proctor reads out a dead boy\'s name. I answer to it. Nobody looks twice. Ilse was right about that: they do not look at each other, only at what the other is worth.' },
  { narr: 'That night they seal us in by twos. You have seen what I did in that room.' },
  { pstage: 1 }, { wait: 1 },
  { narr: 'After that it is forty days of taking the valley one standard at a time. I am good at it. That is the part I did not expect, and do not like.' },
  { fade: 'out' }, { panel: null },
  { card: 'FOUR YEARS FROM NOW', sub: 'The Assay. Day twenty-six.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.twins() },
  { card: 'FOUR YEARS EARLIER', sub: 'Cinderwell. Under the floor.', big: 1, min: 1.4, max: 4 }
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
    { say: 'celestine', t: 'Somebody balanced Bank Seven for three nights with a bleed I could not find on any gauge. I burned a girl for it. The fever ward is still breathing. So it was not her hands on that wheel.' },
    { choice: [
      { t: 'It was mine.', fx: () => { G.flags.toldHer = 1; G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('celestine', 'Yes. Thank you for not making me say it for you.')] },
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
    { narr: 'The surface did not burn. Or it stopped burning a long time ago, and nobody came down to tell us.' },
    { say: 'celestine', t: 'Now you know what I have seen. You will not say it below. Nobody would believe you, and I should have to burn whoever did.' },
    { say: 'celestine', t: 'You may go. When I dismiss you the word is "granted," technician. Not "aye." You will learn.' },
    { fade: 'out' }, { panel: null },
    { card: 'He came down at second bell', sub: 'with a pass stamped in gold, and four hundred people watching the light to see if he would.', min: 1.8, max: 6 }
  ];
  const under = [
    { music: 'mystery' }, { panel: 'under' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'That night the chalk in the old tunnel has changed again. Seren\'s suns, and newer ones in a different hand. Then an arrow.' },
    { pstage: 1 }, { wait: 1.2 },
    { say: 'dace', t: 'Don\'t shout. I\'m not a ghost. I\'ve been under your feet for six weeks, eating what Sable drops through the Freight Three grating.' },
    { say: 'dace', t: 'You went up. Don\'t lie, the whole tier watched that light. What\'s up there?' },
    { choice: [
      { t: 'The sky. It never burned.', fx: () => { G.flags.toldDace = 1; }, then: [say('dace', '...Say it again.'), say('kael', 'There\'s a window. It\'s blue, Dace. There\'s grass.'), say('dace', 'Two hundred years. Two hundred years of rationing us air under a sky that works.')] },
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
    { say: 'dace', t: 'Go home. You were never here. And Kael. She\'d have liked that.' },
    { fade: 'out' }, { panel: null }
  ];
  return [
    { music: 'home' }, { card: 'DAY THREE', sub: 'First bell. Forty-three days after the furnace.', big: 1, min: 1.6, max: 5 },
    { panel: 'kael' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'I did not sleep much. Vale\'s offer sat on my chest all night. Carry the Bank Seven ledger up Lift Zero. Nobody from Cinderwell has ever gone up.' },
    { narr: 'Mara says it is a leash. Ivo says it is a door. They are both right.' },
    { say: 'vale', t: 'First bell, Brennick. The Auditor is waiting on a ledger.' },
    { choice: [
      { t: 'I\'ll carry it.', fx: () => { G.flags.ledgerUp = 1; }, then: [say('vale', 'Noted. Stand up straight. Do not touch anything white.')] },
      { t: 'Send your clerk.', fx: () => { G.flags.ledgerUp = 0; G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('vale', 'I was being polite. She asked for the hands that know the bank. You were never being offered a choice. Nobody down here is.'), narr('He holds out the ledger until I take it.')] }
    ] },
    ...up, ...under,
    ...(NOFF ? [] : DREAM4()),
    { card: 'END OF DAY THREE', sub: 'The Ledger', big: 1, sfx: 'splash', min: 2.2, max: 6 },
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
FF.twins = () => ({
  era: 3, title: 'THE STANDARD', sub: 'THE SISTERS VEY - TWO BLADES, ONE MIND', bg: 'ford', arena: FIELD, music: 'dusk', rage: 2, legend: 1, skip: 1, winText: 'THE STANDARD IS OURS',
  fin: { name: 'TWO FOR ONE', l1: 'THEY FIGHT AS ONE PERSON', l2: 'SO I ONLY COUNT ONCE', rgb: '120,220,210' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 40 }, taunt: { 0: ['HE IS SLOW ON THE LEFT.', 'I HAVE HIM.', 'TOGETHER.', 'NOW.'] },
  foes: [{ id: 'cadt1', name: 'Ansa Vey', kind: 'duelist', hp: 56, sc: 1.05 }, { id: 'cadt2', name: 'Oria Vey', kind: 'duelist', hp: 56, sc: 1.05 }],
  voice: { at: [[1, 'TAKE A HOUSE\'S STANDARD AND ITS CADETS ARE YOURS. TEAL KEEPS THEIRS BETWEEN TWO SISTERS WHO HAVE NEVER LOST A BOUT.'], [12, 'THEY DO NOT TALK TO EACH OTHER. THEY DO NOT NEED TO. I HAD THAT ONCE, WITH ONE PERSON.'], [26, 'CREW THREE TURNED A WHEEL THE SAME WAY. FORTY HANDS, ONE COUNT. THESE TWO WOULD HAVE MADE GOOD VALVE TECHS.']],
    hurt: 'ONE CUTS WHILE THE OTHER ONE IS STILL SMILING.', fury: 'I DO NOT HAVE A SECOND PAIR OF HANDS. I HAVE THIS.', half: 'THE YOUNGER ONE LOOKED AT HER SISTER BEFORE SHE LOOKED AT ME. THAT IS THE GAP.', eleven: 'ELEVEN. SPLIT TWO WAYS.' },
  arts: [{ at: .7, name: 'FORTY BEDS', line: 'THE FEVER WARD HAD FORTY BEDS. I COUNTED THEM EVERY NIGHT. I HAVE NOT STOPPED COUNTING THINGS SINCE.', panel: 'ward', kind: 'storm', rgb: '160,220,255', hex: '#a0dcff' }, { at: .3, name: 'ONE COUNT', line: 'FORTY PEOPLE ON ONE WHEEL, HUMMING TO KEEP TIME. NOBODY UP HERE HAS EVER PULLED ON ANYTHING TOGETHER.', panel: 'pipe', kind: 'rise', rgb: '255,170,70', hex: '#ffaa46' }],
  intro: [
    { d: 3.0, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-50, 4], fx: 1, fy: 0, blade: 1, aura: 1 }, { id: 'cadt1', a: [36, -12], fx: -1, fy: 0, blade: 1 }, { id: 'cadt2', a: [36, 18], fx: -1, fy: 0, blade: 1 }], big: 'THE STANDARD', cap: 'THE ASSAY. DAY TWENTY-SIX. HOUSE TEAL\'S STANDARD STANDS ON AN ISLAND IN THE RIVER.' },
    { d: 2.6, ...cu(36, 2, 1.6, 2.2, 18), acts: [{ id: 'cadt1', a: [30, -10], blade: 1 }, { id: 'cadt2', a: [42, 14], blade: 1 }], cap: 'ANSA AND ORIA VEY. THEY MOVE LIKE ONE PERSON WHO HAPPENS TO HAVE FOUR ARMS.' },
    { d: 2.2, ...cu(-50, 4, 1.9, 2.7, -14), flash: 1, sfx: 'heart', acts: [{ id: 'kael2', a: [-50, 4], blade: 1, aura: 2 }], cap: 'I CAME ALONE. I DID NOT WANT ANYBODY BEHIND ME WHO COULD BE USED.' }
  ],
  outro: DUEL_OUT('cadt2', 'THE YOUNGER ONE PUT HER BLADE DOWN FIRST. THE OLDER ONE DID IT A BREATH LATER, AND NOT FOR ME.', 'TEAL\'S STANDARD CAME BACK ACROSS THE RIVER ON MY SHOULDER. THIRTY CADETS CAME WITH IT.', 'I HAD AN ARMY NOW. I HAD NOT ASKED WHAT I WOULD OWE IT.')
});
// after the Keep: the last thing she asks of him
FF.blade = () => ({
  era: 4, boots: 1, title: 'THE PINNING', sub: 'THE AUDITOR\'S BLADE - HER OWN CHAMPION', bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'duel', rage: 3, legend: 1, skip: 1, winText: 'PIN IT ON HIM',
  newMove: 'THE BOOTS: HOLD JUMP TO FLY. HE HAS THEM TOO.', fin: { name: 'IRON SKY', l1: 'SHE WANTED TO SEE WHAT I WAS', l2: 'I SHOWED HER MOST OF IT', rgb: '140,220,255', mode: 'sky' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 50 }, taunt: { 0: ['YOU WERE NOT RAISED TO THIS.', 'I CAN SMELL THE EFFORT.', 'WHO TAUGHT YOU THAT?'] },
  foes: [{ id: 'voss', name: 'The Auditor\'s Blade', kind: 'duelist', hp: 150, sc: 1.22 }],
  voice: { at: [[1, 'I PUT HER SON ON HIS KNEES. SHE SMILED, AND SENT HER OWN CHAMPION DOWN THE STEPS. ONE MORE, SHE SAID. FOR MY CURIOSITY.'], [13, 'HE HAS KILLED FOR HER FOR THIRTY YEARS. HE DOES IT THE WAY I USED TO CHANGE A SEAL.'], [27, 'SHE IS LEANING FORWARD. I HAVE SEEN THAT LOOK. SHE HAD IT AT THE FURNACE.']],
    hurt: 'HE CUTS WHERE THE WIRE WENT IN. HE CAN SEE IT. SHE CANNOT.', fury: 'NOT ALL OF IT. NOT IN FRONT OF HER. ENOUGH.', half: 'HE HAS REALISED I AM NOT WHAT IS WRITTEN ON MY PAPERS. HE CANNOT WORK OUT WHAT I AM INSTEAD.', eleven: 'ELEVEN. SHE COUNTS THEM TOO. SHE DOES NOT KNOW WHY THERE ARE ELEVEN.' },
  arts: [{ at: .68, name: 'LITTLE EMBER', line: 'SHE CALLED SEREN LITTLE EMBER. SHE IS ABOUT TO PIN GOLD ON WHAT THE EMBER LIT.', panel: 'furnace', stage: 0, kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }, { at: .32, name: 'THE WINDOW', line: 'SHE SHOWED ME THE SKY ONCE TO TEACH ME MY PLACE. I HAVE BEEN STANDING UNDER IT FOR FORTY DAYS.', panel: 'ante', stage: 2, kind: 'storm', rgb: '140,200,255', hex: '#8cc8ff' }],
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
    [{ id: 'vant', name: 'Dockmaster Vant', kind: 'captain', hp: 130, sc: 1.2 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 10 }]],
  onWave: (w, B) => { B.p.fury = Math.max(B.p.fury, 70); B.voice('wave'); },
  voice: { at: [[1, 'THREE YEARS ON THE SPIRE, COUNTING WHO BREATHES. I COUNTED OTHER THINGS AS WELL. BARGES. GUARDS. WHO OWED WHOM.'], [12, 'TONIGHT I AM STILL WEARING THEIR SUN ON MY COLLAR. IT GOT ME THROUGH THE GATE. IT COMES OFF AFTER THIS.'], [24, 'ILSE IS ON THE MOORING WINCH. BRAND HAS THE STAIR. DACE SENT WORD FROM BELOW: THE TIERS ARE READY.']],
    hurt: 'THREE YEARS BEHIND A DESK. I AM SLOWER. I AM NOT KINDER.', fury: 'I HAVE BEEN POLITE FOR THREE YEARS. NOTED. GRANTED. ONE DOES NOT. NO MORE.', wave: 'VANT. HE LOST A RIVER TO ME ONCE. THEY GAVE HIM A DOCK TO MAKE UP FOR IT.', half: 'HE KNOWS MY FOOTWORK. HE HAS HAD SEVEN YEARS TO THINK ABOUT IT.', eleven: 'ELEVEN. I STOPPED SAYING THEM OUT LOUD ON THE SPIRE. I NEVER STOPPED COUNTING.' },
  arts: [{ on: 'start', after: 6, name: 'THE COUNT', line: 'THEY GAVE ME THE LEDGER OF WHO BREATHES. I READ ALL OF IT. EVERY NAME THEY EVER STRUCK OUT.', panel: 'world', stage: 3, kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { on: 'wave', name: 'UNLIT', line: 'WE ARE WHAT IS LEFT IN THE LANTERN WHEN THEY PUT IT OUT. THERE ARE A GREAT MANY OF US.', panel: 'under', stage: 1, kind: 'rise', rgb: '255,170,80', hex: '#ffaa50' }],
  intro: [
    { d: 2.8, black: 1, big: 'SEVEN YEARS FROM NOW', cap: 'THREE YEARS AFTER THE PINNING. I HAVE A POST, A SUN ON MY COLLAR, AND A KEY TO THE HIGH DOCKS.' },
    { d: 3.2, cam: [0, 330, 170, 150, .3], to: [0, 240, 110, 150, .3], acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 1, fy: -1 }].concat(ffRow(V, 5, -60, 30, 44, { fy: -1 })), big: 'THE HIGH DOCKS', cap: 'THE LIFT-BARGES MOOR HERE, ABOVE THE WEATHER. FOUR HUNDRED OF THEM. WE NEED EVERY ONE.' },
    { d: 2.6, cam: [70, 60, 50, 150], to: [-70, 60, 50, 150], lin: 1, sfx: 'roar', acts: ffRow(['sg1', 'sg2'], 7, -90, 30, -80, { fy: 1 }, -10), cap: 'I WALKED IN THROUGH THE FRONT GATE. THE GUARD SALUTED. THEN HE SAW WHO WAS BEHIND ME.' },
    { d: 1.6, ...cu(0, 20, 1.9, 2.9, -14), flash: 1, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 3 }], big: 'CUT THEM LOOSE.' }
  ],
  outro: [
    { d: 3.0, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 2 }], cap: 'I TOOK THE SUN OFF MY COLLAR AND DROPPED IT OVER THE RAIL. IT FELL FOR A LONG TIME.' },
    { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 240, 130, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'FOUR HUNDRED BARGES. EVERY ONE WITH A CREW THAT WAS BORN OWING AIR. IT TOOK US TWO MORE YEARS TO BE READY TO USE THEM.' },
    { d: 2.6, black: 1, big: 'TWO YEARS LATER', cap: 'AND THEN, ONE MORNING, WE WERE.' }
  ]
});
FF.wayout = () => ({
  era: 0, title: 'THE WAY OUT', sub: 'PROCTOR SULL AND THE NIGHT WATCH', bg: 'pit', arena: { kind: 'ring', rx: 96, ry: 44 }, music: 'mystery', legend: 1, skip: 1, foeName: 'Night Watch', winText: 'NOBODY SAW',
  hero: { hp: 9, pow: 1, fury0: 50 }, allies: ['dace'], shouts: ['QUIETLY!', 'NOT HIS FACE, HE HAS TO WRITE!'], taunt: { 0: ['BRENNICK?', 'I KNEW IT. I KNEW IT.', 'YOU ARE OWED TO THE FURNACE.'] },
  foes: [{ id: 'proctor', name: 'Proctor Sull', kind: 'baton', hp: 40 }, { id: 'watchman', name: 'Night Watch', kind: 'quick', hp: 10 }, { id: 'watchman', name: 'Night Watch', kind: 'quick', hp: 10 }],
  voice: { at: [[1, 'FOUR MONTHS OF BEING NOBODY. OF LETTING THIS MAN WIN ARGUMENTS ABOUT GAUGES.'], [11, 'HE IS BETTER WITH THE BATON THAN I GAVE HIM CREDIT FOR. HE HAS HAD A LOT OF PRACTICE ON PEOPLE WHO COULD NOT HIT BACK.'], [22, 'IF ONE OF THEM REACHES THE BELL, ROW K BURNS FOR IT. NOBODY REACHES THE BELL.']],
    hurt: 'GOOD. I HAD ALMOST FORGOTTEN WHAT I WAS KEEPING IN.', fury: 'BE TOO MUCH FOR THEM, SHE SAID. I HAVE BEEN TOO LITTLE FOR FOUR MONTHS.', half: 'HE HAS STOPPED SHOUTING MY NAME. HE HAS STARTED SAYING PLEASE.', eleven: 'ELEVEN. THE LAST TIME I COUNT THEM DOWN HERE.' },
  arts: [{ at: .55, name: 'TOO MUCH', line: 'BE TOO MUCH FOR THEM. IT WAS THE LAST THING SHE ASKED ME FOR. I AM LATE STARTING.', panel: 'furnace', stage: 0, kind: 'storm', rgb: '255,120,40', hex: '#ff7828', dark: 'rgba(26,4,2,.8)' }]
});
function DAY4() {
  return [
    { music: 'home' }, { card: 'DAY FOUR', sub: 'Four months later. One hundred and sixty days after the furnace.', big: 1, min: 1.8, max: 5 },
    { panel: 'ante' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'Twice a week, for four months, I ride up in the white car and teach forty engineers what a valve is for. They are not stupid. They have simply never had to keep anything alive.' },
    { narr: 'I listen. Noted. Granted. One does not. I learn where the nine floors are, and which doors want a gold pass, and who is afraid of whom. I draw none of it. I count it.' },
    { say: 'celestine', t: 'You have stopped saying "aye," technician.' },
    { say: 'kael', t: 'Noted.' },
    { narr: 'She laughed. It is the only time I ever heard it. I added it to the list.' },
    { fade: 'out' }, { panel: 'kael' }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { narr: 'Below, I am the most boring man on Tier Six. I fix valves. I eat at Ivo\'s. I let Proctor Sull win an argument about a gauge, twice, in front of people.' },
    { say: 'mara', t: 'You\'ve gone quiet. You were never quiet, not once in your life. You\'re leaving.' },
    { choice: [
      { t: 'Yes.', fx: () => { G.flags.toldMara = 1; }, then: [say('mara', 'Don\'t tell me where. If I know, they can ask me.')] },
      { t: 'I can\'t tell you.', then: [say('mara', 'That\'s a yes. You never could lie to me, you only ever managed it with yourself.')] }
    ] },
    { say: 'mara', t: 'Tavi will ask. I\'ll say you went to fix something big. That\'s true, isn\'t it?' },
    { say: 'kael', t: 'The biggest valve there is.' },
    { say: 'mara', t: 'Be too much for them. I heard her say it. Go on, then. And Kael. Come back taller.' },
    { fade: 'out' }, { music: 'mystery' }, { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'dace', t: 'Tonight. They dropped the watch on you to one Proctor a week ago. Sable sold him a bottle this afternoon.' },
    { say: 'dace', t: 'A man can\'t just vanish down here. The count wouldn\'t balance, and the count always balances. Kael Brennick has to die on paper.' },
    { say: 'dace', t: 'A seal fails on the Bay Three furnace line. You went in to fix it. Mara signs as witness. They send her a tin. Nobody looks for a man they have already weighed.' },
    { say: 'kael', t: 'She\'ll have two tins.' },
    { say: 'dace', t: 'She knows. She said to tell you she\'s running out of shelf.' },
    { pstage: 2 }, { sfx: 'door' }, { wait: 1.2 },
    { narr: 'Light, down through the hatch. Not the Proctor with the bottle. Sull, sober, with the night watch behind him, and four months of wondering why I had stopped arguing.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.wayout() },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'Sull, on his back, looking up at me the way a man looks at a gauge that cannot be right.' },
    { say: 'proctor', t: 'Brennick. They\'ll burn the whole row for this.' },
    { say: 'dace', t: 'No. Because you are going to write that Kael Brennick went into the furnace line after a failed seal, and that you tried to pull him out. You\'ll get a commendation. Or the Inspector hears who has been selling watch shifts by the bottle.' },
    { say: 'proctor', t: '...Noted.' },
    { fade: 'out' }, { panel: 'tin' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'Two days later a tin goes to Row K. Authority grey, a little sun stamped on the lid. Mara signs for it. There is nothing in it. She puts it on the shelf beside the other one.' },
    { fade: 'out' }, { panel: 'under' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'I go out through the old tunnel, past Seren\'s suns. I touch every one of them. Then the hatch, and a stair I did not know was there, and at the top of it a tall woman with gold in her eyes.' },
    { say: 'ilse', t: 'You are shorter than I was told.' },
    { say: 'kael', t: 'I\'m told that can be fixed.' },
    { say: 'ilse', t: 'It can. You will wish it could not. Come along, soot. One does not keep the table waiting.' },
    { fade: 'out' }, { panel: null },
    { card: 'END OF PART ONE', sub: 'B E L O W', big: 1, sfx: 'splash', min: 2.6, max: 7 },
    ...(NOFF ? [] : [
      { card: 'FOUR YEARS FROM NOW', sub: 'The Assay. The last day, after the keep.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.blade() }
    ]),
    { fx: () => { G.flags.day4Done = 1; } }
  ];
}
function afterDay(n, sv) { G.mode = 'dayend'; UI.push(modal({ clear: true, onBack: null, build(b) { b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
    b.innerHTML = n === 3 ? '<p>A Warden lies under the floor of Bay Three with a headache nobody will write down. A valve tech has seen the sky, and has been told to be boring about it.</p><h2 style="margin-top:16px">END OF DAY THREE</h2>' : '<p>Kael Brennick is dead on paper. Something taller is going to come up Lift Zero wearing another name.</p><p><i>"Every breath I take now is hers."</i></p><h2 style="margin-top:16px">END OF PART ONE</h2>'; },
  items: (n === 4 ? [{ label: 'Begin Part Two — Above', act: () => playPart2(1) }] : []).concat(n === 3 ? [{ label: 'Wake up: Day 4 — The Way Out', act: () => { UI.clear(); Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(DAY4(), () => { if (sv) { sv.flags = Object.assign(sv.flags || {}, { day4Done: 1 }); } afterDay(4, sv); }); } }] : []).concat([
    { label: 'Keep exploring Cinderwell', act: () => { UI.clear(); if (sv) { Game.loadSave(sv); Game.autosave(); } else Game.toTitle(); } }, { label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }]) })); }
