// SOOTBORN — Part Two: ABOVE. Five chapters from the Pinning to the end. Told straight; the memories now run backward.
const P2F = k => G.flags[k];
FF.gallery = () => ({
  era: 5, boots: 1, newMove: 'NEW: THE COUNT - ELEVEN HITS ON ONE MAN AND HIS LINE IS STRUCK', title: 'THE GALLERY', sub: 'TYR CADE - A MATTER OF HIS UNCLE\'S HONOUR', bg: 'hall', arena: { kind: 'ring', rx: 96, ry: 58 }, music: 'duel', rage: 2, legend: 1, skip: 1, winText: 'NOTED',
  fin: { name: 'NOTED', l1: 'I HAVE LEARNED THEIR WORD FOR IT', l2: 'IT MEANS: I WILL REMEMBER THIS', rgb: '255,240,200' },
  hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 30 }, taunt: { 0: ['SORREL. WHO ARE THE SORRELS?', 'YOU FIGHT LIKE A LABOURER.', 'MY UNCLE WILL HEAR OF THIS.'] },
  foes: [{ id: 'tyr', name: 'Tyr Cade', kind: 'duelist', hp: 120, sc: 1.1 }],
  voice: { at: [[1, 'ON THE SPIRE THEY SETTLE THINGS IN A WHITE ROOM WITH A GALLERY, SO EVERYONE WHO MATTERS CAN WATCH WITHOUT STANDING UP.'], [12, 'HE IS FIGHTING FOR HIS UNCLE\'S NAME. I AM FIGHTING UNDER A DEAD BOY\'S. NEITHER OF US IS USING OUR OWN.'], [26, 'IF I WIN TOO WELL THEY WILL ASK WHERE I LEARNED IT. IF I LOSE I AM NOBODY AGAIN. BRAND CALLED THIS THE NARROW PART.']],
    hurt: 'CAREFUL. EDRIC SORREL WOULD NOT KNOW HOW TO TAKE A HIT LIKE THAT.', fury: 'BANK IT. BANK IT. ...SOME OF IT.', half: 'HE HAS STOPPED PLAYING TO THE GALLERY. GOOD. NOW HE WILL MAKE MISTAKES.', eleven: 'ELEVEN. SLOWLY ENOUGH THAT IT LOOKS LIKE STYLE.' },
  arts: [{ at: .6, name: 'THE NARROW PART', line: 'BRAND SAID: WIN LIKE YOU ARE BORED. THEY FORGIVE ANYTHING EXCEPT EFFORT.', panel: 'gild', stage: 2, kind: 'storm', rgb: '255,214,120', hex: '#ffd678' }],
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
  arts: [{ on: 'start', after: 6, name: 'BRAND', line: 'BRAND HELD THE DOCK STAIR FOR ELEVEN MINUTES, ALONE. SOMEBODY TIMED IT. I ASKED THEM TO.', panel: 'gild', stage: 2, kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { on: 'wave', name: 'TOO MUCH', line: 'BE TOO MUCH FOR THEM. SHE ASKED IT OF ONE MAN. I BROUGHT FOUR HUNDRED BARGES.', panel: 'furnace', stage: 0, kind: 'rise', rgb: '255,120,40', hex: '#ff7828', dark: 'rgba(26,4,2,.8)' }],
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
// meanwhile, six tiers down: you play Mara
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
    { fade: 'out' }, { panel: 'ledger' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'The Count is a book. Every person below has a line in it. What they breathe, and what they owe for it.' },
    { pstage: 1 }, { wait: 2.6 },
    { narr: 'When a line costs more than it earns, somebody on the Spire strikes it, and writes one word after. Then, six tiers down, a furnace door opens.' },
    { narr: 'It is my job to keep the columns adding up. I am good at it. I was always good with gauges.' },
    { pstage: 2 }, { wait: 2.2 },
    { sfx: 'heart' }, { narr: 'I found her on my third day. I had told myself I would not look.' },
    { narr: 'Holloway, S. They had not even written her whole name.' },
    { sfx: 'heart' }, { wait: 1.2 }, { narr: 'One. Two. Three. I closed the book at eleven and went on with the morning\'s columns. My hand was steady. I was learning what that cost.' },
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
    { pstage: 2 }, { wait: 1.4 }, { fade: 'out' }, { music: 'mystery' }, { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { narr: 'A letter came up through Sable the same week, in Dace\'s chalk-fingered hand.' },
    { say: 'dace', t: 'Tavi is on the wheel now. Twelve. She hums while she turns it and nobody has the heart to stop her. Mara says to tell you the shelf is holding.' },
    { say: 'dace', t: 'There is a riser under Tier Four that comes up in your valley. Nine floors, Kael. If somebody held the top of it for an hour.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.riser() }
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
    { say: 'celestine', t: 'I am seventy. The Array has perhaps ten years. My son is kind, which is the same as useless. I need somebody to keep the Count after me who knows what a valve is and what a furnace is for.' },
    { say: 'celestine', t: 'You could make it gentler. Fewer lines struck. You would be very good at it. You already are.' },
    { choice: [
      { t: 'Granted.', fx: () => { G.flags.liedToHer = 1; }, then: [say('celestine', 'You said that too quickly. Never mind. You have until the morning to mean it.'), narr('I did not have until the morning. She told her son that night. I think she wanted to see what he would do.')] },
      { t: 'You burned her for forty beds.', fx: () => { G.flags.liedToHer = 0; G.flags.fury = (G.flags.fury || 0) + 2; }, then: [say('celestine', 'I burned her so that I would not have to burn the forty. That is what the Count is, technician. You have been keeping it for two years. Do not pretend you cannot do the sum.'), narr('I left by the window. By nightfall her son knew my name.')] }
    ] },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.son() },
    { brawl: () => FF.docks() }
  ],
  4: () => [
    { music: 'mystery' }, { card: 'TWO YEARS', sub: 'Seven to nine years from now.', big: 1, min: 1.6, max: 5 },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'Brand held the dock stair behind us while we cut the last moorings. Alone, for eleven minutes. Somebody timed it. I asked them to.' },
    { narr: 'We hid four hundred barges in the weather for two years. The Unlit came up in ones and twos through Riser Nine and learned to fly them. Valve techs. Welders. A noodle seller.' },
    { say: 'dace', t: 'Tier Six stopped kneeling in the spring. Mara did it. I was not there. I am told it went like this.' },
    { fade: 'out' }, { panel: null }, { card: 'MEANWHILE', sub: 'Six tiers down. Bay Three. A commitment.', big: 1, min: 1.5, max: 4.5 },
    { brawl: () => FF.stand() },
    { panel: 'under' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
    { say: 'dace', t: 'She stood up, and the whole row stood up behind her, and the Wardens found they did not have enough halberds. The boy is on the wheel with Tavi now.' },
    { say: 'dace', t: 'Tavi is coming up. Sixteen. Don\'t give me that look, I am only the messenger. Mara says you were younger when you married.' },
    { fade: 'out' }, { panel: 'gild' }, { pstage: 3 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
    { say: 'ilse', t: 'When you stand in front of her, soot, you will want to use the words I taught you. Do not. Use your own. That is the only thing she has never heard.' },
    { say: 'kael', t: 'Noted.' },
    { say: 'ilse', t: '...That was a joke. You have made a joke. Nine years and I finally get one.' },
    { fade: 'out' }, { panel: null },
    { panel: 'spire' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 1.2 },
    { narr: 'And then one morning the weather broke over the Sun Spire, and we were already above it.' },
    { fade: 'out' }, { panel: null },
    { brawl: () => FF.fall2() }
  ],
  5: () => [
    { music: 'mystery' }, { card: 'THE COUNT', sub: 'Nine years from now. The Sun Spire.', big: 1, min: 1.6, max: 5 },
    { brawl: () => FF.stair() },
    { brawl: () => FF.ember() },
    { music: 'hum' }, { panel: 'ante' }, { pstage: 6 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
    { narr: 'She knelt on her own floor with the sun going down behind her, and she looked, for the first time since I had known her, like somebody waiting to be told a number.' },
    { choice: [
      { t: 'Strike her line.', fx: () => { G.flags.ending = 'struck'; }, then: [narr('I opened the book on her desk and found her line. Aurel, C. I struck it, and wrote one word after, in my own hand.'), narr('Balanced.'), narr('Then I put down the pen and never picked that one up again.')] },
      { t: 'Send her down Lift Zero.', fx: () => { G.flags.ending = 'below'; }, then: [narr('I walked her to the white car myself. Nine minutes down. I told Mara to give her a bunk on Row K and a ration book.'), say('celestine', 'This is crueller than the furnace.'), say('kael', 'No. It\'s Tuesday. You\'ll get used to it. We did.')] }
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
    { narr: 'Every breath I take is hers. There turned out to be enough of them for everyone.' },
    { fade: 'out' }, { panel: null },
    { card: 'SOOTBORN', sub: 'E V E R Y   B R E A T H   I S   H E R S', big: 1, sfx: 'splash', min: 3, max: 9 },
    { card: 'THE END', sub: 'North Coast Studios  x  E Concepts', min: 2.4, max: 8 }
  ]
};
const P2_TITLES = { 1: 'The Post', 2: 'The Balancing', 3: 'What She Knows', 4: 'Two Years', 5: 'The Count' };
function playPart2(n) { Store.set('sootborn_p2', String(n)); UI.clear(); Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(P2[n](), () => afterPart2(n)); }
function afterPart2(n) { Store.set('sootborn_p2', n >= 5 ? '' : String(n + 1)); G.mode = 'dayend'; Sound.music('mystery'); UI.push(modal({ clear: true, onBack: null, build(b) { b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
    b.innerHTML = n >= 5 ? '<h2>THE END</h2><p>' + (G.flags.ending === 'below' ? 'Celestine Aurel has a bunk on Row K and a ration book. She is learning the shift song. She is not good at it.' : 'There is one line in the Count struck in a valve tech\'s hand. Nobody has struck another.') + '</p><p style="opacity:.7">SOOTBORN · thanks for playing.</p>' : `<h2>Part Two · ${n} of 5</h2><p>${P2_TITLES[n]} is done. Next: ${P2_TITLES[n + 1]}.</p>`; },
  items: (n < 5 ? [{ label: 'Continue: ' + P2_TITLES[n + 1], act: () => playPart2(n + 1) }] : []).concat([{ label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }]) })); }
