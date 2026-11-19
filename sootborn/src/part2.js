// SOOTBORN — Part Two: ABOVE. Five chapters from the Pinning to the end. Told straight; the memories now run backward.
const P2F = k => G.flags[k];
FF.gallery = () => ({
  era: 5, boots: 1, newMove: 'NEW: THE COUNT - ELEVEN HITS ON ONE MAN AND HIS LINE IS STRUCK', title: 'THE GALLERY', sub: 'TYR CADE - A MATTER OF HIS UNCLE\'S HONOUR', bg: 'hall', arena: { kind: 'ring', rx: 96, ry: 58 }, music: 'duel', rage: 2, legend: 1, skip: 1, winText: 'NOTED',
  fin: { name: 'NOTED', l1: 'I HAVE LEARNED THEIR WORD FOR IT', l2: 'IT MEANS: I WILL REMEMBER THIS', rgb: '255,240,200' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 30 }, taunt: { 0: ['SORREL. WHO ARE THE SORRELS?', 'YOU FIGHT LIKE A LABOURER.', 'MY UNCLE WILL HEAR OF THIS.'] },
  foes: [{ id: 'tyr', name: 'Tyr Cade', kind: 'duelist', hp: 120, sc: 1.1 }],
  voice: { at: [[1, 'ON THE SPIRE THEY SETTLE THINGS IN A WHITE ROOM WITH A GALLERY, SO EVERYONE WHO MATTERS CAN WATCH WITHOUT STANDING UP.'], [12, 'HE IS FIGHTING FOR HIS UNCLE\'S NAME. I AM FIGHTING UNDER A DEAD BOY\'S. NEITHER OF US IS USING OUR OWN.'], [26, 'IF I WIN TOO WELL THEY WILL ASK WHERE I LEARNED IT. IF I LOSE I AM NOBODY AGAIN. BRAND CALLED THIS THE NARROW PART.']],
    hurt: 'CAREFUL. EDRIC SORREL WOULD NOT KNOW HOW TO TAKE A HIT LIKE THAT.', fury: 'BANK IT. BANK IT. ...SOME OF IT.', half: 'HE HAS STOPPED PLAYING TO THE GALLERY. GOOD. NOW HE WILL MAKE MISTAKES.', eleven: 'ELEVEN. SLOWLY ENOUGH THAT IT LOOKS LIKE STYLE.' },
  arts: [{ at: .32, name: 'A RING', line: 'SHE BET ME THE SKY WAS BLUE. SHE BET ME A RING. I HAVE BEEN PAYING IT EVER SINCE.', panel: 'hands', kind: 'storm', rgb: '120,180,255', hex: '#78b4ff' }, { at: .6, name: 'THE NARROW PART', line: 'BRAND SAID: WIN LIKE YOU ARE BORED. THEY FORGIVE ANYTHING EXCEPT EFFORT.', panel: 'gild', stage: 2, kind: 'storm', rgb: '255,214,120', hex: '#ffd678' }],
  intro: DUEL_IN('tyr', '', 'THE GALLERY', 'THE SUN SPIRE. FOUR YEARS AND A SEASON FROM NOW. I HAVE A POST, A DESK, AND AN ENEMY.', 'TYR CADE. HIS UNCLE THE MARSHAL DID NOT ENJOY HEARING THAT A NOBODY FROM A MINOR HOUSE MADE A PROCTOR BLEED.', 'HE CALLED ME OUT AT A DINNER. I SAID: GRANTED. ILSE WOULD HAVE BEEN PROUD OF THE WORD.', 1.1),
  outro: DUEL_OUT('tyr', 'HE YIELDED WITH HIS WHOLE FAMILY WATCHING. I HELPED HIM UP. THAT WAS THE PART THEY NEVER FORGAVE.', 'LUCAN AUREL WAS IN THE GALLERY. HE WAS THE ONLY ONE WHO CLAPPED.', 'A NAME TRAVELS FAST UP HERE. BY MORNING EDRIC SORREL HAD ONE.', 1.1)
});
FF.riser = () => ({
  era: 5, boots: 1, title: 'RISER NINE', sub: 'THE BALANCING OF TIER FOUR - FORTY PEOPLE, ONE STAIR', bg: 'riser', arena: FIELD, music: 'battle', rage: 3, legend: 1, skip: 1, foeName: 'Warden', winText: 'FORTY OUT',
  fin: { name: 'NINE FLOORS', l1: 'THEY TOLD US THERE WERE SIX', l2: 'I HAVE WALKED ALL NINE', rgb: '255,170,80', mode: 'all' },
  hero: { id: 'kael2', hp: 11, pow: 2, blade: 1, fury0: 70 }, allies: ['cadv1'], shouts: ['MOVE THEM!', 'THE STAIR IS CLEAR!'], taunt: { 0: ['UNLOGGED PERSONS.', 'YOU ARE OWED TO THE FURNACE.', 'WHO IS UNDER THAT MASK?'] },
  waves: [[{ id: 'warden', name: 'Warden', kind: 'warden', hp: 26, sc: 1.1 }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 9 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 9 }],
    [{ id: 'warden', name: 'Warden', kind: 'warden', hp: 30, sc: 1.15 }, { id: 'warden', name: 'Warden', kind: 'warden', hp: 30, sc: 1.15 }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 9 }]],
  onWave: (w, B) => { B.p.fury = 100; B.say('FURY', true); },
  voice: { at: [[1, 'MARSHAL CADE CALLED IT A BALANCING. TIER FOUR USED MORE AIR THAN IT WAS OWED. SO TIER FOUR WAS TO BE MADE SMALLER.'], [12, 'I HAD THE ORDER ON MY DESK THIS MORNING. TONIGHT I AM AT THE BOTTOM OF RISER NINE IN A MASK, WITH BRAND, AND A STAIR FULL OF CHILDREN.'], [24, 'THE FIRST WARDEN I EVER HIT DID NOT MOVE. THE SECOND FELL. THESE ARE THE NINTH AND TENTH.']],
    hurt: 'I FELT THAT ONE. GOOD. I HAVE BEEN BEHIND A DESK TOO LONG.', fury: 'I DID NOT SPEND IT IN THE GALLERY. I KEPT IT FOR THIS.', wave: 'TWO MORE. THE STAIR IS NOT EMPTY YET.', half: 'FORTY PEOPLE. I COUNTED THEM PAST ME. I AM STILL A CLERK.', eleven: 'ELEVEN. ONE OF THEM IS FOR TIER FOUR.' },
  arts: [{ on: 'start', after: 5, name: 'THE ORDER', line: 'IT CAME ACROSS MY DESK FOR A SIGNATURE. A WHOLE TIER, IN ONE LINE, WITH A COLUMN FOR THE AIR IT WOULD SAVE.', panel: 'ledger', stage: 1, kind: 'storm', rgb: '255,90,50', hex: '#ff5a32', dark: 'rgba(26,4,2,.8)' }, { on: 'wave', name: 'FEVER WARD', line: 'I STOLE AIR FOR FORTY BEDS ONCE AND IT COST ME EVERYTHING. TONIGHT IT IS FORTY PEOPLE AND I AM NOT ASKING.', panel: 'ward', stage: 1, kind: 'rise', rgb: '160,220,255', hex: '#a0dcff' }],
  intro: [
    { d: 2.8, black: 1, big: 'RISER NINE', cap: 'FIVE YEARS FROM NOW. THE NIGHT THEY BALANCED TIER FOUR.' },
    { d: 3.0, cam: [-60, 250, 150, 150, .18], to: [0, 150, 62, 150, .32], acts: [{ id: 'warden', a: [34, -8], blade: 2, sc: 1.1, fx: -1, fy: .3 }, { id: 'sg1', a: [54, 14], blade: 1, fx: -1, fy: 0 }, { id: 'kael2', a: [-70, 6], b: [-44, 4], fx: 1, fy: 0, blade: 1 }], cap: 'THE RISER COMES UP IN THE VALLEY WHERE THE ASSAY IS HELD. NOBODY BELOW KNOWS THAT. NOBODY ABOVE THINKS ABOUT IT.' },
    { d: 2.4, ...cu(-44, 4, 1.9, 2.8, -14), flash: 1, bolt: 1, sfx: 'roar', acts: [{ id: 'kael2', a: [-44, 4], blade: 1, aura: 3 }], cap: 'I SIGNED THE ORDER THIS MORNING. THEN I CAME DOWN HERE TO BREAK IT.' }
  ],
  outro: [
    { d: 3.0, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 3 }], cap: 'FORTY OUT. TIER FOUR HAD ELEVEN HUNDRED PEOPLE ON IT.' },
    { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }], cap: 'I WENT BACK UP AND SAT AT MY DESK AND ENTERED THE FIGURE IN THE COLUMN. BALANCED. MY HAND DID NOT SHAKE. THAT FRIGHTENED ME MORE THAN THE WARDENS.' }
  ]
});
FF.son = () => { const friend = !!P2F('lucanFriend'); return {
  era: 5, boots: 1, title: 'THE SON', sub: 'LUCAN AUREL - HIS MOTHER HAS TOLD HIM', bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'duel', rage: 3, legend: 1, skip: 1, endAt: friend ? .5 : .2, winText: friend ? 'HE LOWERS IT' : 'HE FALLS',
  fin: { name: 'ONE DOES NOT', l1: 'ONE DOES NOT KNEEL. ONE IS NOT SORRY.', l2: 'I AM SORRY, LUCAN', rgb: '255,240,200' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 40 }, taunt: { 0: friend ? ['SAY IT IS NOT TRUE.', 'YOU SAT AT MY TABLE.', 'WAS ANY OF IT REAL?'] : ['SOOT. ALL THIS TIME.', 'SHE WAS RIGHT ABOUT YOU.', 'I SHOULD HAVE KNOWN AT THE KEEP.'] },
  foes: [{ id: 'lucan', name: 'Lucan Aurel', kind: 'duelist', hp: 170, sc: 1.1, k2: { line: 1 } }],
  voice: { at: [[1, friend ? 'SIX YEARS FROM NOW. HE WAS THE ONLY ONE ON THE SPIRE WHO EVER ASKED ME A QUESTION AND WAITED FOR THE ANSWER.' : 'SIX YEARS FROM NOW. I KEPT HIM AT ARM\'S LENGTH FOR TWO YEARS. IT HAS NOT MADE THIS EASIER.'], [13, 'HE IS BETTER THAN HE WAS AT THE KEEP. HE PRACTISED. BECAUSE OF ME.'], [26, 'HIS MOTHER BURNED MY WIFE. HE WAS FOURTEEN AND HAD NEVER HEARD OF CINDERWELL. I KEEP HAVING TO SAY THAT TO MYSELF.']],
    hurt: 'HE MEANS IT THIS TIME.', fury: 'NOT AT HIM. IT WAS NEVER FOR HIM.', half: friend ? 'HE IS CRYING. I DID NOT KNOW THEY COULD.' : 'HE WANTS ME TO BE A MONSTER. IT WOULD BE SIMPLER FOR BOTH OF US.', eleven: 'ELEVEN. I PULL THE LAST ONE.' },
  arts: [{ at: .75, name: 'HER CHIN', line: 'HER CHIN. HER HANDS. HER WAY OF LOOKING PAST YOU. AND NONE OF WHAT SHE DID WITH THEM.', panel: 'ante', stage: 1, kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }],
  intro: DUEL_IN('lucan', '', 'THE SON', 'THE KEEP IN THE VALLEY, WHERE WE FIRST DID THIS. HE CHOSE THE PLACE.', friend ? 'HE SAID: MOTHER TOLD ME WHAT YOU ARE. I SAID: DID SHE TELL YOU WHAT SHE IS.' : 'HE SAID: MOTHER TOLD ME WHAT YOU ARE. HE SOUNDED RELIEVED TO HAVE A REASON.', 'I DID NOT COME UP HERE FOR HIM. HE IS STANDING IN THE DOOR ALL THE SAME.', 1.1),
  outro: friend ? [
    { d: 3.2, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id: 'lucan', a: [22, -2], pose: 'kneel', fx: -1, fy: .2, sc: 1.1 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 1 }], cap: 'HE LOWERED IT. HE SAID: I LOOKED IN THE LEDGER AFTER SHE TOLD ME. I FOUND HER NAME. HOLLOWAY.' },
    { d: 3.2, ...cu(22, -2, 1.7, 2.4, 14), acts: [{ id: 'lucan', a: [22, -2], pose: 'kneel', sc: 1.1 }], cap: 'HE SAID: I DID NOT KNOW WE DID THAT. I SAID: THAT IS HOW IT WORKS. NONE OF YOU EVER HAS TO KNOW.' },
    { d: 3.0, cam: [0, 150, 60, 150, .3], to: [0, 250, 170, 150, .16], acts: [{ id: 'kael2', a: [-10, 2], blade: 1 }, { id: 'lucan', a: [14, 2], blade: 1, sc: 1.1, fx: -1, fy: 0 }], cap: 'HE GAVE ME HIS KEY TO THE HIGH DOCKS. HE SAID HE WOULD TELL HER I HAD GONE OVER THE WALL.' }
  ] : [
    { d: 3.2, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id: 'lucan', a: [22, -2], pose: 'kneel', fx: -1, fy: .2, sc: 1.1 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: 'HE WENT BACKWARDS OVER THE PARAPET RATHER THAN YIELD TO SOOT. HIS BOOTS CAUGHT HIM, A LONG WAY DOWN.' },
    { d: 3.0, ...cu(-10, 2, 1.9, 2.6, 12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 2 }], cap: 'HIS KEY TO THE HIGH DOCKS WAS ON THE STONE WHERE HE HAD STOOD. I DO NOT THINK HE DROPPED IT BY ACCIDENT. I NEVER FOUND OUT.' },
    { d: 3.0, cam: [0, 150, 60, 150, .3], to: [0, 250, 170, 150, .16], acts: [{ id: 'kael2', a: [-10, 2], blade: 1 }], cap: 'I HAD A YEAR, PERHAPS, BEFORE HE COULD WALK. I USED IT.' }
  ] }; };
FF.stair = () => ({
  era: 6, boots: 1, newMove: 'NEW: THE SHIFT SONG - GUARD + HOOK HEALS YOU AND YOURS', title: 'THE STAIR', sub: 'THE SUN SPIRE - NINE HUNDRED STEPS TO THE COUNT', bg: 'stair', arena: { kind: 'rect', w: 220, h: 100 }, music: 'battle', rage: 3, legend: 1, skip: 1, foeName: 'Spire Guard', winText: 'UP',
  fin: { name: 'EVERY BREATH', l1: 'EVERY BREATH I TAKE IS HERS', l2: 'I HAVE NINE HUNDRED STEPS OF THEM', rgb: '255,224,138', mode: 'all' },
  hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 80 }, allies: V, shouts: ['UP!', 'BELOW!', 'DON\'T STOP!'], taunt: { 0: ['HOLD THE LANDING!', 'HE IS ONE MAN!', 'FOR THE AUDITOR!'] },
  waves: [[{ id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 10 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 10 }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 10 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 10 }],
    [{ id: 'warden', name: 'Warden', kind: 'warden', hp: 30, sc: 1.15 }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 10 }, { id: 'warden', name: 'Warden', kind: 'warden', hp: 30, sc: 1.15 }],
    [{ id: 'voss', name: 'The Auditor\'s Blade', kind: 'duelist', hp: 120, sc: 1.22 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 10 }]],
  onWave: (w, B) => { B.p.fury = 100; B.say('FURY', true); },
  voice: { at: [[1, 'THE BARGE CAME DOWN ON THE LOWER TERRACE. HALF OF US WALKED AWAY FROM IT. THAT WAS BETTER THAN ILSE\'S ARITHMETIC.'], [12, 'NINE HUNDRED STEPS. I KNOW BECAUSE I CLIMBED THEM EVERY MORNING FOR THREE YEARS WITH A SUN ON MY COLLAR.'], [24, 'TAVI IS SOMEWHERE BEHIND ME. SIXTEEN. MARA SAID SHE COULD NOT STOP HER, AND THAT I OF ALL PEOPLE WAS NOT TO TRY.']],
    hurt: 'KEEP CLIMBING.', fury: 'IT HAS BEEN NINE YEARS. IT HAS NOT COOLED AT ALL.', wave: 'ANOTHER LANDING. THERE IS ALWAYS ANOTHER LANDING.', half: 'HER CHAMPION AGAIN. HE YIELDED TO ME ONCE. HE HAS BEEN ASHAMED OF IT FOR FIVE YEARS.', eleven: 'ELEVEN. TOP OF THE STAIR.' },
  arts: [{ on: 'wave', name: 'ELEVEN MONTHS', line: 'SHE WORE IT ELEVEN MONTHS. I HAVE WORN IT NINE YEARS. TODAY IT GOES HOME.', panel: 'hands', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }, { on: 'start', after: 6, name: 'BRAND', line: 'BRAND HELD THE DOCK STAIR FOR ELEVEN MINUTES, ALONE. SOMEBODY TIMED IT. I ASKED THEM TO.', panel: 'gild', stage: 2, kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { on: 'wave', name: 'TOO MUCH', line: 'BE TOO MUCH FOR THEM. SHE ASKED IT OF ONE MAN. I BROUGHT FOUR HUNDRED BARGES.', panel: 'furnace', stage: 0, kind: 'rise', rgb: '255,120,40', hex: '#ff7828', dark: 'rgba(26,4,2,.8)' }],
  intro: [
    { d: 3.0, cam: [0, 330, 170, 150, .3], to: [0, 240, 110, 150, .3], shake: .3, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 2, fy: -1 }].concat(ffRow(V, 6, -75, 30, 44, { fy: -1 })), big: 'THE STAIR', cap: 'THE SUN SPIRE. THE LOWER TERRACE. WHAT IS LEFT OF A LIFT-BARGE IS BURNING BEHIND US.' },
    { d: 2.6, cam: [70, 60, 50, 150], to: [-70, 60, 50, 150], lin: 1, sfx: 'roar', acts: ffRow(['sg1', 'sg2'], 8, -105, 30, -80, { fy: 1 }, -10), cap: 'NINE HUNDRED STEPS TO THE ROOM WITH THE WINDOW. THEY ARE ON EVERY ONE.' },
    { d: 1.6, ...cu(0, 20, 1.9, 2.9, -14), flash: 1, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 3 }], big: 'UP.' }
  ],
  outro: [
    { d: 3.0, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 3 }], cap: 'THE TOP OF THE STAIR. A WHITE DOOR. I HAVE WALKED THROUGH IT A HUNDRED TIMES WITH A LEDGER UNDER MY ARM.' },
    { d: 3.0, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 5, -60, 30, 34, { fy: -1 })), cap: 'I TOLD THE OTHERS TO WAIT. THIS PART WAS NEVER THEIRS.' }
  ]
});
FF.ember = () => ({
  breakAt: .45, breakMemo: { panel: 'kael', stage: 0, line: 'SHE BROKE THE BLADE THEY GAVE ME. I HAD HANDS BEFORE I HAD ANY OF THIS.', rgb: '255,170,80' }, breakLine: 'BANK HANDS. HERS WERE NEVER DIRTY ENOUGH TO KNOW WHAT THAT MEANS.',
  era: 6, boots: 1, title: 'LITTLE EMBER', sub: 'CELESTINE AUREL - THE HIGH AUDITOR', bg: 'crown', arena: { kind: 'rect', w: 220, h: 100 }, music: 'final', rage: 3, legend: 1, skip: 1, endAt: .08, winText: 'BALANCED',
  hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 60 }, taunt: { 0: ['THERE YOU ARE, TECHNICIAN.', 'I KEPT THE COUNT. SOMEBODY HAD TO.', 'SHE WAS QUICKER THAN YOU.', 'AND WHO WILL RATION IT WHEN I AM GONE?'] },
  foes: [{ id: 'celf', name: 'Celestine Aurel', kind: 'duelist', hp: 230, sc: 1.18, k2: { line: 1, slam: 1, triple: 1 } }],
  newMove: 'SHE STRIKES A LINE ACROSS THE FLOOR: JUMP IT. SHE DROPS FROM ABOVE: MOVE.',
  voice: { at: [[1, 'SHE IS SEVENTY. SHE HAS WORN THE BOOTS SINCE SHE WAS TWELVE. NOBODY TOLD ME SHE COULD FIGHT. NOBODY WHO KNEW WAS STILL ALIVE.'], [14, 'SHE IS NOT ANGRY. THAT IS THE WORST OF IT. SHE HAS NEVER ONCE BEEN ANGRY AT US. WE WERE A COLUMN THAT HAD TO ADD UP.'], [28, 'THE WINDOW IS BEHIND HER. THE REAL SKY. SHE KEPT IT IN ONE ROOM FOR FIFTY YEARS.'], [42, 'SEREN. I AM NEARLY DONE.']],
    hurt: 'SHE CUTS LIKE SHE SIGNS. ONCE, AND NEATLY.', fury: 'THIS IS WHAT YOU LIT. LOOK AT IT.', half: 'SHE HAS STOPPED CALLING ME TECHNICIAN.', eleven: 'ONE FOR EVERY SECOND THE DOORS STOOD OPEN. I HAVE CARRIED THEM NINE YEARS. THEY ARE YOURS.' },
  arts: [{ at: .82, name: 'THE WASHER', line: 'SHE WORE A WASHER FOR A WEDDING RING. THREE WEEKS OF MY LUNCH BREAKS. IT IS UNDER THIS ARMOUR NOW.', panel: 'hands', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }, { at: .6, name: 'RATION AIR', line: 'WE BLED YOUR AIR INTO A FEVER WARD. FORTY CHILDREN BREATHED. THAT WAS THE WHOLE CRIME.', panel: 'ward', stage: 1, kind: 'storm', rgb: '160,220,255', hex: '#a0dcff' }, { at: .38, name: 'THE SHIFT SONG', line: 'YOU PUT OUR SONG ON YOUR SPEAKERS SO IT WOULD MEAN THE FURNACE. LISTEN. THEY ARE HUMMING IT ON YOUR STAIR.', panel: 'pipe', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { at: .18, name: 'ELEVEN SECONDS', line: 'YOU HELD THE DOORS OPEN FOR ELEVEN SECONDS SO THE WHOLE TIER COULD WATCH HER WALK. I COUNTED. I HAVE NEVER STOPPED.', panel: 'furnace', stage: 2, kind: 'rise', rgb: '255,90,30', hex: '#ff5a1e', dark: 'rgba(26,4,2,.85)' }],
  intro: [
    { d: 3.2, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-46, 6], fx: 1, fy: 0, blade: 1, aura: 2 }, { id: 'celf', a: [44, 0], fx: -1, fy: 0, blade: 1, sc: 1.18 }], big: 'LITTLE EMBER', cap: 'THE TOP OF THE SPIRE. THE SUN IS GOING DOWN IN THE WINDOW SHE ONCE OPENED TO TEACH ME MY PLACE.' },
    { d: 3.0, ...cu(44, 0, 1.6, 2.2, 16), acts: [{ id: 'celf', a: [44, 0], blade: 1, sc: 1.18 }], cap: 'SHE SAID: I WONDERED WHICH OF YOU IT WOULD BE. I HOPED IT WOULD BE YOU. YOU AT LEAST CAN COUNT.' },
    { d: 3.0, ...cu(-46, 6, 1.9, 2.7, -14), acts: [{ id: 'kael2', a: [-46, 6], blade: 1, aura: 2 }], cap: 'I TOOK THE WASHER OUT FROM UNDER MY COLLAR AND LET IT HANG WHERE SHE COULD SEE IT.' },
    { d: 2.2, ...cu(-46, 6, 2.7, 1.9, 10), flash: 1, bolt: 1, sfx: 'heart', acts: [{ id: 'kael2', a: [-46, 6], blade: 1, aura: 3 }], big: 'MY NAME IS KAEL BRENNICK.' }
  ],
  outro: [
    { d: 3.4, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id: 'celf', a: [22, -2], pose: 'kneel', fx: -1, fy: .2, sc: 1.18 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: 'SHE WENT DOWN ON ONE KNEE. I HAD NEVER SEEN ONE OF THEM DO IT. SHE DID IT BADLY, LIKE A THING READ ABOUT.' },
    { d: 3.4, ...cu(22, -2, 1.6, 2.3, 14), acts: [{ id: 'celf', a: [22, -2], pose: 'kneel', sc: 1.18 }], cap: 'SHE SAID: IF YOU OPEN EVERY DOOR AT ONCE, THE ARRAY WILL NOT HOLD. SOME OF THEM WILL DIE OF IT. I WAS NEVER LYING ABOUT THAT.' },
    { d: 3.0, ...cu(-10, 2, 1.9, 2.7, -12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 1 }], cap: 'I SAID: THEN WE WILL COUNT IT TOGETHER. ALL OF US. OUT LOUD.' }
  ]
});
// the Fall, when it is no longer a dream
FF.fall2 = () => { const d = FF.fall(); d.era = 6; d.intro = d.intro.slice(); d.intro[0] = { d: 2.8, black: 1, big: 'THE FALL', cap: 'NINE YEARS. FOUR HUNDRED BARGES. ONE MORNING.' }; d.intro[1] = Object.assign({}, d.intro[1], { big: '' });
  d.outro = d.outro.slice(0, 2).concat([{ d: 3.0, black: 1, big: 'WE HIT.', cap: 'HALF OF US WALKED AWAY FROM IT. THAT WAS BETTER THAN ILSE\'S ARITHMETIC.' }]); d.voice = Object.assign({}, d.voice, { at: [[1, 'NINE YEARS AGO I KNELT WHEN THEY CAME DOWN IN LIGHT. TODAY WE ARE THE ONES COMING DOWN.'], [10, 'FOUR HUNDRED BARGES. EVERY ONE OF THEM FLOWN BY SOMEBODY WHO WAS BORN OWING AIR.'], [20, 'CADE SIGNED TIER FOUR AWAY WITH ONE LINE. I HAVE THE PEN HE USED. I TOOK IT FROM MY OWN DESK.'], [32, 'MARA IS ON THE NEXT BARGE OVER. SHE SAID SHE WOULD NOT MISS THIS IF IT KILLED HER. IT MIGHT.']] }); return d; };
// a room to practise in: Brand does not go down, and neither do you
FF.training = () => ({
  barks: ['AGAIN.', 'SLOW.', 'YOUR FEET, BOY.', 'GUARD UP.'],
  era: 6, training: 1, title: 'THE PUMP ROOM', sub: 'BRAND - NOBODY GOES DOWN IN HERE', bg: 'hall', arena: { kind: 'ring', rx: 100, ry: 58 }, music: 'work', rage: 1, legend: 1, skip: 1, winText: 'ENOUGH',
  newMove: 'TRAINING: NOBODY CAN LOSE. PAUSE FOR THE MOVE LIST.',
  hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 50 }, taunt: { 0: ['AGAIN.', 'SLOWER. NOW FASTER.', 'USE ALL OF IT.', 'THAT ONE WAS CLEAN.'] },
  foes: [{ id: 'brand', name: 'Brand', kind: 'captain', hp: 400, sc: 1.05, k2: { line: 1, slam: 1 } }]
});
// meanwhile, six tiers down: you play Mara
FF.brandstair = () => ({
  era: 3, title: 'THE DOCK STAIR', sub: 'BRAND - ELEVEN MINUTES', bg: 'fall', arena: { kind: 'rect', w: 170, h: 80 }, music: 'duel', doomed: 34, doomedFight: 1, endless: 1, rage: 2, foeName: 'Dock Guard',
  fin: { name: 'THE STAIR', l1: 'I WAS A WARDEN', l2: 'I KNOW WHAT A STAIR IS WORTH', rgb: '200,210,230' },
  hero: { id: 'brand', name: 'BRAND', hp: 16, pow: 3, blade: 1, fury0: 70 }, taunt: { 0: ['HE WAS ONE OF OURS!', 'TAKE THE STAIR!', 'HE IS ONE OLD MAN!'] },
  waves: [[{ id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 15 }, { id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 15 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 15 }],
    [{ id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 16 }, { id: 'sg1', name: 'Dock Guard', kind: 'cadet', hp: 16 }, { id: 'sg2', name: 'Dock Guard', kind: 'lancer', hp: 16 }, { id: 'sg1', name: 'Stair Captain', kind: 'captain', hp: 60, sc: 1.15 }]],
  voice: { at: [[1, 'I WAS A WARDEN. I KNOW HOW MANY IT TAKES TO CLEAR A STAIR. IT IS MORE THAN I HAVE MINUTES.'], [9, 'I PUT A HALBERD BUTT INTO A WELDER FOR HUMMING, ONCE. I HAVE CARRIED IT UP EVERY STAIR SINCE.'], [18, 'THEN THEY ORDERED ME TO DO IT TO A CHILD. I PUT THE HALBERD DOWN. IT WAS NOT ENOUGH. THIS IS THE REST OF IT.'], [27, 'THE LAST MOORING IS CUT. I CAN HEAR IT GO. GOOD. COME BACK TALLER, SOOT.']], hurt: 'I HAVE HAD WORSE FROM A CADET I WAS TEACHING.', fury: 'YOUR FEET, BOY. I SAID IT A THOUSAND TIMES. MINE ARE STAYING WHERE THEY ARE.', wave: 'MORE. GOOD. EVERY ONE ON THIS STAIR IS ONE NOT ON THE DOCK.' }
});
FF.stand = () => ({
  era: 0, title: 'TIER SIX STANDS', sub: 'MARA VENN - A COMMITMENT AT BAY THREE', bg: 'furnace', arena: { kind: 'rect', w: 200, h: 80 }, music: 'work', legend: 1, skip: 1, foeName: 'Warden', winText: 'NOBODY KNEELS',
  fin: { name: 'TWO TINS', l1: 'ONE FOR SEREN. ONE FOR KAEL.', l2: 'THERE WILL NOT BE A THIRD', rgb: '255,120,40' },
  hero: { id: 'mara', name: 'MARA', hp: 11, pow: 2, fury0: 60 }, allies: ['hollis', 'ivo'], shouts: ['UP! ALL OF YOU, UP!', 'WITH MARA!', 'HUM IT!'], taunt: { 0: ['KNEEL.', 'GRATITUDE IS BREATH.', 'YOU ARE OWED TO THE FURNACE.'] },
  waves: [[{ id: 'warden', name: 'Warden', kind: 'baton', hp: 22, sc: 1.1 }, { id: 'watchman', name: 'Night Watch', kind: 'quick', hp: 9 }], [{ id: 'warden', name: 'Warden', kind: 'baton', hp: 26, sc: 1.1 }, { id: 'warden', name: 'Warden', kind: 'heavy', hp: 30, sc: 1.15 }, { id: 'proctor', name: 'Proctor Sull', kind: 'quick', hp: 14 }]],
  onWave: (w, B) => { B.p.fury = 100; B.say('THE WHOLE ROW IS STANDING', true); },
  voice: { at: [[1, 'I AM SIXTY-ONE. I HAVE KNELT AT FORTY-FOUR COMMITMENTS. I COUNTED. HE GETS THAT FROM ME.'], [11, 'THEY WERE GOING TO PUT A BOY OF NINE THROUGH THAT DOOR FOR HIS MOTHER\'S DEBT.'], [22, 'I HAVE TWO TINS ON MY SHELF AND ONE OF THEM IS EMPTY. I AM NOT STARTING A THIRD.']],
    hurt: 'I HAVE HAD WORSE FROM A VALVE WHEEL.', fury: 'BE TOO MUCH FOR THEM. SHE WAS NOT ONLY TALKING TO HIM.', wave: 'MORE OF THEM. GOOD. LET THEM COUNT US.', half: 'HOLLIS HAS BOTH ARMS UP. I DID NOT KNOW HE COULD.', eleven: 'I KNOW HIS NUMBER. I TAUGHT HIM TO COUNT.' },
  arts: [{ on: 'start', after: 5, name: 'FORTY-FOUR', line: 'FORTY-FOUR TIMES I KNELT AND WATCHED THE DOORS CLOSE ON SOMEBODY I KNEW. I AM DONE KNEELING.', panel: 'furnace', stage: 2, kind: 'storm', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }, { on: 'wave', name: 'THE SHELF', line: 'A TIN FOR SEREN. A TIN FOR KAEL, WITH NOTHING IN IT. I DUST THEM ON REST DAYS.', panel: 'tin', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }]
});
// ------------------------------------------------------------------ the chapters
const P2 = {
  1: () => [
    { music: 'spire' }, { card: 'PART TWO', sub: 'A B O V E', big: 1, sfx: 'splash', min: 2.2, max: 6 },
    { card: 'THE POST', sub: 'The Sun Spire. Four years and a season from now.', big: 1, min: 1.6, max: 5 },
    { panel: 'spire' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'My name up here is Edric Sorrel. The real one died of a fever at eleven, in a minor House with no money to bury him loudly. Ilse bought his papers.' },
    { narr: 'I won their Assay under it. The High Auditor pinned a sun to my collar and made me Clerk of the Count. I live on the fourth ring of the Spire. There is a window in every room.' },
    { narr: 'I did not sleep the first month. There is a window in every room and the sky comes in. I lay under it and waited for a ceiling.' },
    { fade: 'out' }, { panel: 'desk' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { pstage: 3 },
    { say: 'wren', t: 'Clerk Sorrel? Engineer Halloran. They have put me on the Array board. You will not remember, but we... no. Forgive me. You have a look of someone.' },
    { say: 'kael', t: 'One is told that often.' },
    { say: 'wren', t: 'He was a technician from below. He taught me to put my hand on the pipe. He fell in a furnace, they said. I have been touching pipes ever since. Nobody up here can tell me why it works.' },
    { narr: 'She said "we," and "forgive me." Nobody on the Spire says either. I had to stop myself answering her in my own voice.' },
    ...(P2F('wrenMet') ? [{ narr: 'I knew the voice. A pump house on a dark island, and a gauge that held at two. She had not seen my face then. She was looking at it now, and she almost had it.' }] : []),
    { narr: 'She left a grease print on my desk. I did not wipe it off for a week.' },
    { pstage: 5 }, { wait: 0.8 },
    { narr: 'The Second Clerk kept the desk across from mine. Maren Aldane. She checked my columns every evening and had not yet found a wrong one. It annoyed her, and she said so.' },
    { say: 'maren', t: 'Sorrel. Your sevens are ugly. Your sums are not. One notes both.' },
    { say: 'maren', t: 'You were in my brother\'s Assay. Teo Aldane. He was the youngest one there. He did not come out of the Pairing.' },
    { sfx: 'heart' }, { narr: 'He shared his bread with me on the lift. I have counted him every day since. He is not one of the eleven. He has a number of his own.' },
    { say: 'maren', t: 'One does not ask who was in the room. The Proctors seal the pairings. I only wondered whether he was brave.' },
    { choice: [
      { t: 'He shared his bread on the lift. He was kind.', fx: () => { G.flags.marenKind = 1; }, then: [say('maren', '...Kind. Yes. That was always the trouble with him. Noted, Sorrel.'), narr('She did not look up again that evening. The next morning there was a heel of bread on my desk, and no note.')] },
      { t: 'One does not remember the Pairing.', fx: () => { G.flags.marenKind = 0; G.flags.fury = (G.flags.fury || 0) + 1; }, then: [say('maren', 'No. One is not supposed to. Your sevens, Sorrel.'), narr('She went back to her columns. She was still watching my hands when I left.')] }
    ] },
    { fade: 'out' }, { panel: 'ledger' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'The Count is a book. Every person below has a line in it. What they breathe, and what they owe for it.' },
    { pstage: 1 }, { wait: 2.6 },
    { narr: 'When a line costs more than it earns, somebody on the Spire strikes it, and writes one word after. Then, six tiers down, a furnace door opens.' },
    { narr: 'It is my job to keep the columns adding up. I am good at it. I was always good with gauges.' },
    { pstage: 2 }, { wait: 2.2 },
    { sfx: 'heart' }, { narr: 'I found her on my third day. I had told myself I would not look.' },
    { narr: 'Holloway, S. They had not even written her whole name.' },
    { sfx: 'heart' }, { wait: 1.2 }, { narr: 'One. Two. Three. I closed the book at eleven and went on with the morning\'s columns. My hand was steady. I was learning what that cost.' },
    { narr: 'The first line I struck myself was in the ninth week. "Marrow, J. Tier Six. Air owed: eleven days."' },
    { sfx: 'heart' }, { narr: 'I knew him. He hummed at the furnace. They docked his air for it, and he never caught the eleven days up. He used to sit two benches from the noodle stall and complain about the broth.' },
    { narr: 'It is a good pen. It does not drag. I had expected it to drag.' },
    { narr: 'After that I learned where the Spire kitchens keep their surplus, and how to carry a day across from one column to another where nobody looks. I was handed nine hundred lines in five years. I struck four hundred and six. I know every name. It does not help them.' },
    { fx: () => { G.flags.fury = (G.flags.fury || 0) + 2; } },
    { fade: 'out' }, { panel: 'ante' }, { pstage: 4 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'lucan', t: 'Sorrel. You are the one who put me on my knees in front of my mother. I have been wanting to meet you properly.' },
    { say: 'lucan', t: 'Nobody had ever beaten me. I found I did not mind as much as I was supposed to. Would you teach me how you did it?' },
    { choice: [
      { t: 'Granted. Sit down.', fx: () => { G.flags.lucanFriend = 1; }, then: [say('lucan', 'You say that word like someone who learned it. Never mind. I like it.'), narr('He came twice a week after that. He asked questions and waited for the answers. Nobody else on the Spire did either.')] },
      { t: 'One does not teach a rival.', fx: () => { G.flags.lucanFriend = 0; }, then: [say('lucan', 'No. I suppose one does not.'), narr('He kept coming to the gallery when I fought. He always sat alone.')] }
    ] },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.gallery() }
  ],
  2: () => [
    { music: 'spire' }, { card: 'THE BALANCING', sub: 'Five years from now.', big: 1, min: 1.6, max: 5 },
    { panel: 'desk' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'In my second year the order for Tier Four came across my desk. Eleven hundred lines, to be struck at once. Marshal Cade called it a balancing.' },
    { pstage: 1 }, { sfx: 'heart' }, { wait: 1 },
    { narr: 'It needed the Clerk\'s signature. Mine.' },
    { choice: [
      { t: 'Sign it. Stay hidden.', fx: () => { G.flags.signedFour = 1; G.flags.fury = (G.flags.fury || 0) + 2; }, then: [narr('I signed. If I had not, another clerk would have by noon, and I would have been a line in the book myself by evening. I have told myself that every day since.')] },
      { t: 'Lose it. Buy a day.', fx: () => { G.flags.signedFour = 0; }, then: [narr('I let it fall behind a cabinet and found it again the next morning, with apologies. One day. Dace used all of it.'), narr('Cade signed it himself in the end, and looked at me for a long time while he did.')] }
    ] },
    { when: () => !G.flags.signedFour, fade: 'out' }, { when: () => !G.flags.signedFour, panel: null }, { when: () => !G.flags.signedFour, card: 'THAT NIGHT', sub: 'The Count hall. After the bell.', big: 1, min: 1.5, max: 4.5 }, { when: () => !G.flags.signedFour, mission: 'count' },
    { when: () => !G.flags.signedFour, panel: 'desk' }, { when: () => !G.flags.signedFour, pstage: 1 }, { when: () => !G.flags.signedFour, fade: 'in', spd: 0.8 },
    { pstage: 2 }, { wait: 1.4 }, { fade: 'out' }, { music: 'mystery' }, { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'A letter came up through Sable the same week, in Dace\'s chalk-fingered hand.' },
    { say: 'dace', t: 'Tavi is on the wheel now. Twelve. She hums while she turns it and nobody has the heart to stop her. Mara says to tell you the shelf is holding.' },
    { say: 'dace', t: 'She puts the sun back on the Pillar every rest day. Sull scrubs it. She puts it back. I have stopped telling her not to.' },
    { fade: 'out' }, { panel: null }, { card: 'BELOW', sub: 'Cinderwell. Five years after the furnace. Tavi.', big: 1, min: 1.5, max: 4.5 }, { mission: 'sun' },
    { music: 'mystery' }, { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'dace', t: 'There is a riser under Tier Four that comes up in your valley. Nine floors, Kael. If somebody held the top of it for an hour.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.riser() },
    { music: 'spire' }, { panel: 'desk' }, { pstage: 4 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'Marshal Cade came to my desk the next morning. He did not sit.' },
    { say: 'cade', t: 'Forty lines short, Sorrel. Tier Four balanced at one thousand and sixty. Somebody held a riser against three of my Wardens. In a mask.' },
    { say: 'cade', t: 'You were in the Assay. You know what that kind of fighting looks like. Tell me what you would look for.' },
    { choice: [
      { t: 'Someone who had done it before.', then: [say('cade', 'Yes. That is what I thought. I am looking at everyone who has.'), narr('He looked at me for exactly as long as it takes to count to eleven. Then he left.')] },
      { t: 'A fault in the count, Marshal. Not a man.', then: [say('cade', 'You are a clerk to the bone, Sorrel. Check it, then. I will have the figure by noon.'), narr('I gave him the figure by noon. Forty short. I wrote "clerical" beside it. It is the only joke in the whole of the Count.')] }
    ] },
    { pstage: 5 }, { wait: 0.8 },
    { narr: 'Maren Aldane checked the figure after he left. She always checked.' },
    { say: 'maren', t: 'Forty short, and "clerical" in your hand. You have never once been clerical, Sorrel. One has checked.' },
    { say: 'maren', t: 'The pairings are sealed. The seals are kept in this office. I have had a year, and a key.' },
    { sfx: 'heart' }, { narr: 'She did not say what she had read. She capped her pen and squared it with the edge of the desk. The Accredited do not accuse. They balance.' },
    { pstage: 3 }, { wait: 0.8 },
    { narr: 'Wren Halloran came by the desk most evenings that year. She brought Array readings she did not need checked.' },
    { say: 'wren', t: 'The east manifold is weeping again. Nobody on the board will touch it. They say it is not done to touch it.' },
    { say: 'kael', t: 'Put a palm flat on it. If it is warm past the second joint, it is the seal and not the line.' },
    { say: 'wren', t: 'You say that like someone who burned the palm finding out.' },
    { narr: 'She turned my hand over on the desk and looked at it. The Gilding takes a great deal. It does not take scars. She did not say anything. She set it down again as carefully as a reading.' },
    { choice: [
      { t: '(Leave your hand where it is.)', fx: () => { G.flags.wrenClose = 1; }, then: [narr('It was the first time in five years anybody had touched me who was not trying to kill me or measure me.'), narr('I counted to eleven anyway. The washer was under my collar. It did not get any heavier. I had thought it would.')] },
      { t: 'One has columns to finish.', fx: () => { G.flags.wrenClose = 0; }, then: [say('wren', 'Noted.'), narr('She left the readings. She came back the next evening with more.')] }
    ] },
    { fade: 'out' }, { panel: null }
  ],
  3: () => [
    { music: 'spire' }, { card: 'WHAT SHE KNOWS', sub: 'Six years from now.', big: 1, min: 1.6, max: 5 },
    { panel: 'ante' }, { pstage: 5 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'She sent for me to look at a valve in her own room. The Array was failing faster. She did not trust her engineers with anything she could hear.' },
    { narr: 'It was a simple seat. I had my hands on the wheel, and I was thinking about nothing at all.' },
    { music: 'hum' }, { wait: 1.6 },
    { narr: 'I did not know I was doing it until she put down her cup.' },
    { music: null }, { sfx: 'heart' }, { wait: 1.4 },
    { say: 'celestine', t: 'I had that put on the speakers of Tier Six for a year. I know it better than my own House anthem.' },
    { say: 'celestine', t: 'There is nobody on this Spire who could hum it without thinking. Nobody who was not taught it before they could talk.' },
    { say: 'celestine', t: 'Little ember had a husband. I remember now. A valve technician. I had him brought up here to teach my engineers, and then he fell in a furnace, and I was briefly annoyed.' },
    { sfx: 'heart' }, { narr: 'One. Two. Three.' }, { sfx: 'heart' }, { narr: 'Nine years of counting, and it had never once been this hard to stop at eleven.' },
    { music: 'spire' }, { say: 'celestine', t: 'Sit down, Brennick. If I meant to call the Wardens I should not have sent them out of the room first.' },
    { say: 'celestine', t: 'I am seventy. The Accredited bear late and live long; it is most of what the gold is for. The Array has perhaps ten years. My son is kind, which is the same as useless. I need somebody to keep the Count after me who knows what a valve is and what a furnace is for.' },
    { say: 'celestine', t: 'You could make it gentler. Fewer lines struck. You would be very good at it. You already are.' },
    { choice: [
      { t: 'Granted.', fx: () => { G.flags.liedToHer = 1; }, then: [say('celestine', 'You said that too quickly. Never mind. You have until the morning to mean it.'), narr('I did not have until the morning. She told her son that night. I think she wanted to see what he would do.')] },
      { t: 'You burned her for forty beds.', fx: () => { G.flags.liedToHer = 0; G.flags.fury = (G.flags.fury || 0) + 2; }, then: [say('celestine', 'I burned her so that I would not have to burn the forty. That is what the Count is, technician. You have been keeping it for two years. Do not pretend you cannot do the sum.'), narr('I left by the window. By nightfall her son knew my name.')] }
    ] },
    { fade: 'out' }, { panel: 'ante' }, { pstage: 4 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'She did not send Wardens. She sent her son, alone, to the keep where I had beaten him two years before. I think she wanted to see which of us she had raised.' },
    { say: 'lucan', t: 'She says you are soot. She says it the way one reports a column that will not close. Are you?' },
    { say: 'kael', t: 'Aye.' },
    { say: 'lucan', t: '...I have never heard anybody say that word. It is shorter than I expected.' },
    ...(P2F('lucanFriend') ? [{ say: 'lucan', t: 'You taught me for two years. You could have opened my throat any morning in the gallery. I counted the mornings last night. There were a great many.' }] : [{ say: 'lucan', t: 'I asked you to teach me, once. You declined. I see now that it was a kindness, of a sort. One does not want to owe a blade to the man one is sent to remove.' }]),
    { say: 'kael', t: 'There was a note pinned to the Proctors\' glass, at the Assay. Her hand. "My son is to reach the last day. No further than he can walk."' },
    { sfx: 'heart' }, { say: 'lucan', t: '...She wrote that.' },
    { say: 'lucan', t: 'Of course she wrote that. I reached the last day. I have been proud of it for two years.' },
    { narr: 'He drew. His hand was steadier than it had been at the keep. I had done that. I was sorry for it, and I let him come.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.son() },
    { music: 'mystery' }, { panel: 'freight' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'The night before the docks we met in Freight Three. Sable, with the shutter down. Ilse. Brand. And Dace, up from under the floor for the first time in seven years.' },
    { say: 'dace', t: "Give me a minute. I've had a ceiling all my breath, and then a lower one. Sable says there isn't one up there at all. I don't see how it stays up." },
    { say: 'sable', t: "It doesn't stay up. There's nothing to stay. You'll hate it. Everybody does, the first week." },
    { say: 'ilse', t: 'Four hundred barges, moored in pairs. Cut the pairs and the wind does the rest. The watch changes at the second bell, and for nine minutes nobody is looking at the stair.' },
    { say: 'kael', t: 'I wrote the rota. It is nine minutes.' },
    { narr: 'I had written it at my desk that afternoon. Maren Aldane had taken it for copying. She had never offered to copy anything before. I was thinking about the docks.' },
    { say: 'brand', t: 'If the nine minutes are not there, the stair will want holding. I hold it. You do not argue, and you do not come back for me. You have a tier. I have a welder.' },
    { say: 'kael', t: 'His name is Hollis.' },
    { say: 'brand', t: 'I know his name. I have known it seven years. I have never once said it. ...Hollis.' },
    { narr: 'He said it like a man putting down something he had carried up nine floors. Then he went to see to his halberd, and I let him, because I thought there would be a morning after.' },
    { fade: 'out' }, { panel: null },
    { card: 'THE HIGH DOCKS', sub: 'Seven years from now. The second bell.', big: 1, min: 1.5, max: 4.5 },
    { issue: 'docks', or: [{ brawl: () => FF.docks() }] }
  ],
  4: () => [
    { music: 'mystery' }, { card: 'TWO YEARS', sub: 'Seven to nine years from now.', big: 1, min: 1.6, max: 5 },
    { panel: 'dockstair' }, { fade: 'in', spd: 0.8 }, { wait: 1.2 },
    { narr: 'The High Docks should have been dark at that bell. I had written the watch rota myself. They were on the stair with their lamps already lit.' },
    { narr: 'Somebody had told them the hour. Brand looked at the lamps, and then at me, and counted them the way a Warden counts.' },
    { narr: 'Brand held the dock stair behind us while we cut the last moorings. He had been a Warden. He knew exactly how many of them it would take, and that it was more than he had minutes.' },
    { pstage: 1 }, { wait: 2.4 },
    { narr: 'He said: go. I said no. He said: Brennick, I put a halberd butt into a welder for humming, once. I have been waiting seven years for a stair. Go.' },
    { fade: 'out' }, { panel: null }, { card: 'THE DOCK STAIR', sub: 'Seven years from now. Brand.', big: 1, min: 1.5, max: 4.5 },
    { brawl: () => FF.brandstair() },
    { music: 'mystery' }, { panel: 'dockstair' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { sfx: 'heart' }, { wait: 2 },
    { narr: 'Eleven minutes. Somebody timed it. I asked them to.' },
    { fade: 'out' }, { panel: 'weather' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    ...(P2F('wrenMet') ? [
      { narr: 'For a week I knew who had done it. The dock log had one pass entered against the lamp gallery at the first bell. An engineer\'s pass. Halloran, W.' },
      { narr: 'I did not say it to anyone. I counted it instead. She had the gallery. She had the hour. She had my face, nearly, from a pump house on a dark island.' },
      ...(P2F('wrenClose') ? [{ narr: 'And she had put her hand over mine on a weeping manifold, and I had left it there. I went over that evening eleven times, looking for the lie in it. I wanted very badly to find one. It would have been simpler.' }] : []),
      { say: 'ilse', t: 'You have a name in your mouth. I can see you chewing it. Swallow it or spit it, soot. Do not carry it about.' },
      { say: 'kael', t: 'An engineer lit those lamps.' },
      { say: 'ilse', t: 'An engineer\'s pass lit those lamps. That is not the same sentence. You have struck four hundred names from a book. You of all people know what a line in a book is worth.' },
      { narr: 'I knew. I went on believing it anyway. It is a thing I am not proud of: Brand was a week dead, and I needed it to be somebody I could reach.' },
      { fx: () => { G.flags.fury = (G.flags.fury || 0) + 1; } }
    ] : []),
    { narr: 'Sable got the note out of the dock office a week later. One line, in a hand I had sat across from for three years.' },
    { sfx: 'heart' }, { narr: '"The high docks. The second bell. The Clerk\'s own rota. For Teo Aldane. Balanced."' },
    { say: 'ilse', t: 'You are going to tell me she had the right. Do not. I can hear you preparing it.' },
    { say: 'kael', t: 'She had the right.' },
    { say: 'ilse', t: 'She had a brother. Brand had a stair. You had a room that opened for one. Nobody in this had a right, soot. They saw to that before any of you were born.' },
    { narr: 'I had not lost anything since the furnace. I had forgotten how it is done. I sat on a barge in the weather for most of a month and did not count anything at all.' },
    { narr: 'It was a valve that got me up. A seal weeping on the third barge, and four hundred hulls, and nobody else aboard who knew what the sound meant. I went and put my hand on the pipe. Then I went and found the others.' },
    { fx: () => { G.flags.fury = (G.flags.fury || 0) + 3; } },
    { fade: 'out' }, { panel: 'weather' }, { fade: 'in', spd: 0.8 }, { wait: 1.2 },
    { narr: 'We hid four hundred barges in the weather for two years. The Unlit came up in ones and twos through Riser Nine and learned to fly them. Valve techs. Welders. A noodle seller.' },
    { say: 'dace', t: 'Tier Six stopped kneeling in the spring. Mara did it. I was not there. I am told it went like this.' },
    { fade: 'out' }, { panel: null }, { card: 'MEANWHILE', sub: 'Six tiers down. Bay Three. A commitment.', big: 1, min: 1.5, max: 4.5 },
    { brawl: () => FF.stand() },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'dace', t: 'She stood up, and the whole row stood up behind her, and the Wardens found they did not have enough halberds. The boy is on the wheel with Tavi now.' },
    { say: 'dace', t: 'Tavi is coming up. Sixteen. Don\'t give me that look, I am only the messenger. Mara says you were younger when you married.' },
    { fade: 'out' }, { panel: 'weather' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'tavi', t: 'You got tall.' },
    { say: 'kael', t: 'You got old.' },
    { say: 'tavi', t: 'You said I\'d be the first to know. If it was yellow.' },
    { say: 'kael', t: 'Look up, Tav.' },
    { narr: 'My own voice. "Tav." I had not used it in seven years. It came out rusty, like a wheel nobody had turned.' },
    { narr: 'Seven years late. Tavi looked for a long time and then said: she was right. And then: she\'d be unbearable about it.' },
    { say: 'wren', t: 'Clerk... no. Brennick. I have brought eleven engineers and the Array schematics. One touches the pipe. I worked out why it works. It is because somebody has to care whether it does.' },
    { say: 'wren', t: 'We. I am practising. We touch the pipe. ...Aye?' },
    ...(P2F('wrenMet') ? [
      { say: 'wren', t: 'There is a pass in the dock log with my name on it. One went to the lamp gallery to shut the valve. They were waiting there too. They held me, and lit it with my own hand on the wheel.' },
      { say: 'wren', t: 'You thought it was me.' },
      { say: 'kael', t: 'For a week.' },
      { say: 'wren', t: 'A week. One would have given it two days. ...It is the only slow thing about you, Brennick, thinking ill of somebody. One hopes you keep it.' },
      { narr: 'The eleven engineers were the ones who had held her. She had talked to them for two years through a cell door, about pressure. I have never worked out how to say sorry in Accredited. There is no word. I said it in soot. She said: noted.' }
    ] : []),
    { say: 'tavi', t: 'Close enough. Ta for the schematics.' },
    { narr: 'She found me that night at the rail, with the cord out of my collar.' },
    { say: 'wren', t: 'The washer. You hold it when you count. I have watched you do it for four years and never asked.' },
    { say: 'kael', t: "Her name was Seren. She wore it on her finger. It's off a valve on Bank Seven." },
    { say: 'wren', t: 'I am not asking for her place.' },
    { say: 'kael', t: "There isn't a place. There's a shelf, in a room on Row K. Two tins on it. That's all the room there's ever been." },
    { say: 'wren', t: 'Then I am asking whether a shelf can be made longer. I am an engineer. It is the sort of thing we... It is the sort of thing we do.' },
    { narr: 'She got the word out twice. I do not think she noticed.' },
    { choice: [
      { t: 'Ask me again when the doors are open.', fx: () => { G.flags.wrenAsk = 1; }, then: [say('wren', 'Granted. ...Aye. I meant aye.'), narr('She stayed at the rail. Neither of us counted anything. The weather went by underneath, and for once I did not look for a ceiling.')] },
      { t: 'Every breath I take is hers, Wren.', fx: () => { G.flags.wrenAsk = 0; }, then: [say('wren', 'I know. I have read the Count. There turned out to be a great many breaths in it.'), narr('She went below. She left her coat on the rail, and I did not move it.')] }
    ] },
    { fade: 'out' }, { panel: 'gild' }, { pstage: 3 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'ilse', t: 'When you stand in front of her, soot, you will want to use the words I taught you. Do not. Use your own. That is the only thing she has never heard.' },
    { say: 'kael', t: 'Noted.' },
    { say: 'ilse', t: '...That was a joke. You have made a joke. Nine years and I finally get one.' },
    { say: 'ilse', t: 'One thing more, since we are being honest. The leaf in Lift Zero, the night of your festival. That was mine. I sent the car down empty to see who on that tier would look inside it instead of at the floor.' },
    { say: 'kael', t: 'And?' },
    { say: 'ilse', t: 'One man with a lantern, and a child who kept the leaf. It was enough to be going on with.' },
    { fade: 'out' }, { panel: null },
    { panel: 'spire' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 1.2 },
    { narr: 'And then one morning the weather broke over the Sun Spire, and we were already above it.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.fall2() }
  ],
  5: () => [
    { music: 'mystery' }, { card: 'THE COUNT', sub: 'Nine years from now. The Sun Spire.', big: 1, min: 1.6, max: 5 },
    { panel: 'weather' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'They wanted me to say something before the stair. I am not good at it. Seren was the one who talked.' },
    { say: 'kael', t: 'For five years up here I said "one." One does not kneel. One is not sorry. I\'m done with it. It\'s "we." It was always we.' },
    { say: 'kael', t: 'They taught us to count. Air breathed, air owed. They never thought about what else we might count.' },
    { say: 'kael', t: 'I have counted eleven seconds every day for nine years. Mara has counted forty-four commitments. Tier Four counted eleven hundred, and then stopped being able to.' },
    { say: 'kael', t: 'Today we go up nine hundred steps and we read them the total. Out loud. Every name. And then we open every door they have.' },
    ...(G.tendency === 'caretaker' ? [{ say: 'kael', t: 'I went up for one child with a fever. There are forty beds on every tier. It was never going to stay one.' }] : G.tendency === 'tinkerer' ? [{ say: 'kael', t: 'I thought I was better at this than anybody they had. I was. It turned out not to be the point.' }] : G.tendency === 'seeker' ? [{ say: 'kael', t: 'I told her once I wanted to be the one who decides who breathes. She said that is how they talk. Today nobody decides.' }] : []),
    { sfx: 'roar' }, { narr: 'Nobody cheered. Somebody started the shift song. It went up the terrace like a valve letting go.' },
    { say: 'tavi', t: "That was nearly a speech. She'd have heckled." },
    { say: 'kael', t: "She'd have written it." },
    { say: 'tavi', t: "I'm on your left the whole way up. Don't argue. I've flown a barge." },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.stair() },
    { music: 'spire' }, { panel: 'spire' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'At the top of the nine hundred steps there was one clerk in front of the white door, with a pen in her hand and no blade.' },
    { say: 'maren', t: 'Brennick. That is the name, is it not. I read it in a sealed book, and then I sold you a stair for it.' },
    { say: 'maren', t: 'Eleven minutes, they tell me. I have counted them since. It did not balance. Nothing came back.' },
    { choice: [
      { t: 'He was kind. I killed him anyway. The room only opened for one.', fx: () => { G.flags.marenDoor = 1; }, then: [say('maren', '...You count him.'), say('kael', 'Every day. He has a number of his own.'), say('maren', 'Then that is two who keep it. One does not forgive you. One is opening the door.'), narr('She unlocked it with the Second Clerk\'s key and stood aside. She did not say "we." She was nearer to it than she knew.')] },
      { t: 'Stand aside, Maren.', fx: () => { G.flags.marenDoor = 0; }, then: [say('maren', 'Granted. There is nobody left behind it who is worth a clerk.'), narr('She put the key on the floor between us and walked down the stair, through the whole of the Unlit, and nobody touched her. I had asked them not to.')] }
    ] },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.ember() },
    { music: 'hum' }, { panel: 'ante' }, { pstage: 6 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'She knelt on her own floor with the sun going down behind her, and she looked, for the first time since I had known her, like somebody waiting to be told a number.' },
    { choice: [
      { t: 'Strike her line.', fx: () => { G.flags.ending = 'struck'; }, then: [narr('I opened the book on her desk and found her line. Aurel, C. I struck it, and wrote one word after, in my own hand.'), narr('Balanced.'), narr('Then I put down the pen and never picked that one up again.')] },
      { t: 'Send her down Lift Zero.', fx: () => { G.flags.ending = 'below'; }, then: [narr('I walked her to the white car myself. Nine minutes down. I told Mara to give her a bunk on Row K and a ration book.'), say('celestine', 'This is crueller than the furnace.'), say('kael', 'No. It\'s Tuesday. You\'ll get used to it. We did.'), say('celestine', '...Noted.'), say('kael', 'Down there it\'s "aye."')] }
    ] },
    { fade: 'out' }, { music: 'dawn' }, { panel: 'dawn' }, { fade: 'in', spd: 0.6 }, { wait: 2.4 },
    { narr: 'I unlocked Lift Zero from the top and left it running, doors open, all the way down.' },
    { narr: 'It took nine minutes for the light to reach Ashgate Square. It had never been allowed to before.' },
    { pstage: 1 }, { wait: 2.2 },
    { sfx: 'bell' }, { narr: 'They did not cheer. They stood and looked up. Somebody in the back started the shift song, and nobody put a halberd in it.' },
    { narr: 'She had been right about one thing. The Array did not hold. We lost people that first winter, with every door open and nobody rationing. We counted them out loud, by name, all of us. That was the difference. It was all the difference.' },
    { pstage: 2 }, { wait: 2.4 },
    { narr: 'I went down on the first car. Past the square, past Bay Three, into the old tunnel, to a chalk sun that somebody had been keeping fresh for nine years.' },
    { narr: 'I am told I stood there a long time. I was counting. I got to eleven, and for the first time, I did not have to start again.' },
    ...((G.flags.rays | 0) > 0 ? [{ narr: 'Seren\'s lantern was still on the Pillar, with ' + (G.flags.rays | 0) + ' paper rays on it. Nobody had been allowed to take it down, and then nobody had wanted to.' }] : []),
    { narr: 'Vale handed in his ledger the first morning the light came down. He asked for a wheel on Tier Eight, where his sister\'s ward had been. He is not good at it yet.' },
    { narr: 'Sull kept the night watch. Somebody has to walk the bays. He says "aye" now and nobody makes anything of it.' },
    { narr: 'Nell\'s ward has forty beds and the fans up. Ivo runs Freight Three with Sable, and every crate that comes down is marked for whoever is hungry. Dace chalks suns on the new doors.' },
    ...(G.flags.marenDoor ? [{ narr: 'Maren Aldane keeps the new Count. It has no columns. It is a list of names, and she reads it aloud on rest days. Teo\'s first.' }] : [{ narr: 'Nobody has seen Maren Aldane since the stair. Her desk was cleared. There was a heel of bread on it.' }]),
    ...(P2F('lucanFriend') ? [{ narr: 'Lucan Aurel walks the tiers with a slate, learning names. He asks before he writes one down. He is kind. It has turned out to be of use.' }] : [{ narr: 'Lucan Aurel went out with the first envoy and did not look back. He sent one letter. It said: I should have liked to understand. I have kept it.' }]),
    { narr: 'Ilse would not come down. She said she had been unmade once and it had taken. She keeps the glass room at the top of the Spire, and teaches anybody who asks how they talked up there, so that nobody can be shut out by a word again.' },
    { narr: 'Tavi flies the lift-barges. Yellow hull. She painted the sun on it herself and would not be told it was the wrong yellow.' },
    { narr: 'The other eleven Houses sent envoys the first spring. We showed them the open lift and the list of names. Four went home and opened their own. We are still talking to the rest.' },
    { fade: 'out' }, { panel: 'row' }, { pstage: 3 }, { fade: 'in', spd: 0.7 }, { wait: 1.2 },
    { narr: 'Then Row K. The door was open. It had never had a lock. Mara looked up from the table and did not get up.' },
    { say: 'mara', t: 'Taller. I did say. Sit down, you\'re blocking the light, and we\'ve only just got some.' },
    { narr: 'There were two tins on the shelf. I took down the one with my name on it and opened it. There was nothing in it. I put the washer inside, and put it back beside hers.' },
    { say: 'mara', t: 'Well. That\'s the shelf balanced, then.' },
    ...(G.flags.wrenAsk ? [{ say: 'mara', t: "There's an engineer out in the row who won't come in without being asked. She's had her hand on every pipe I own. Says they're sound." }, { say: 'kael', t: 'Come in, Wren. Mind the step.' }, { narr: 'She came in. Mara looked at her, and at me, and got a third bowl down off the shelf without a word. It was the kindest thing I ever saw her do.' }] : [{ narr: 'Wren Halloran keeps what is left of the Array. She sends readings down on rest days that I do not need to check. I check them.' }]),
    { narr: 'Every breath I take is hers. There turned out to be enough of them for everyone.' },
    { fade: 'out' }, { panel: null },
    { card: 'SOOTBORN', sub: 'E V E R Y   B R E A T H   I S   H E R S', big: 1, sfx: 'splash', min: 3, max: 9 },
    { card: 'THE END', sub: 'North Coast Studios  x  E Concepts', min: 2.4, max: 8 }
  ]
};
const P2_TITLES = { 1: 'The Post', 2: 'The Balancing', 3: 'What She Knows', 4: 'Two Years', 5: 'The Count' };
const P2KEYS = ['lucanFriend', 'signedFour', 'liedToHer', 'ending', 'marenKind', 'marenDoor', 'wrenMet', 'wrenClose', 'wrenAsk', 'fury', 'rays', 'ranForHer'];
function p2Save() { try { const o = {}; for (const k of P2KEYS) if (G.flags[k] !== undefined) o[k] = G.flags[k]; Store.set('sootborn_p2f', JSON.stringify(o)); if (G.tendency) Store.set('sootborn_tend', G.tendency); } catch (e) { } }
function p2Load() { try { G.flags = G.flags || {}; const o = JSON.parse(Store.get('sootborn_p2f') || '{}'); for (const k of P2KEYS) if (G.flags[k] === undefined && o[k] !== undefined) G.flags[k] = o[k]; if (!G.tendency && Store.get('sootborn_tend')) G.tendency = Store.get('sootborn_tend'); } catch (e) { } }
function playPart2(n) { p2Load(); Store.set('sootborn_p2', String(n)); UI.clear(); Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(P2[n](), () => afterPart2(n)); }
function afterPart2(n) { p2Save(); Store.set('sootborn_p2', n >= 5 ? '' : String(n + 1)); if (n >= 5) Store.set('sootborn_done', '1'); G.mode = 'dayend'; Sound.music('mystery'); UI.push(modal({ clear: true, onBack: null, build(b) { b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
    b.innerHTML = n >= 5 ? '<h2>THE END</h2><p>' + (G.flags.ending === 'below' ? 'Celestine Aurel has a bunk on Row K and a ration book. She is learning the shift song. She is not good at it. On the fourth day she said "ta" to Mara for a bowl of noodles. Mara pretended not to hear.' : 'There is one line in the Count struck in a valve tech\'s hand. Nobody has struck another.') + '</p><p style="opacity:.7">SOOTBORN · thanks for playing.</p>' : `<h2>Part Two · ${n} of 5</h2><p>${P2_TITLES[n]} is done. Next: ${P2_TITLES[n + 1]}.</p>`; },
  items: (n < 5 ? [{ label: 'Continue: ' + P2_TITLES[n + 1], act: () => playPart2(n + 1) }] : []).concat([{ label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }]) })); }
