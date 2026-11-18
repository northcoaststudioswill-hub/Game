// ============================================================
// content/ff — THE ASSAY. Four years on: Kael, gilded, passing as an Accredited cadet in the
// proving war they hold above the rock. Told fast: hard cuts, a camera that flies, captions that
// do not wait for a button. Everything the undercity chapters are not.
//  - Opening.run(): the pre-title intro (no play, any button skips)
//  - FF.valley / FF.ford / FF.keep: three playable battles woven through the story
//  - FF.furnace: present day, the three steps toward the furnace. It cannot be won.
// ============================================================
const NOFF = /noff/.test(location.hash);
const ffRow = (id, n, x0, dx, y, o, y2) => Array.from({ length: n }, (_, i) => Object.assign({ id: Array.isArray(id) ? id[i % id.length] : id, a: [x0 + i * dx, y + (i % 2) * 7], k: i, blade: 1 }, y2 === undefined ? {} : { b: [x0 + i * dx, y2 + (i % 2) * 7] }, o));
// close-up on a point: scale s0 -> s1, drifting dx sideways
const cu = (x, y, s0, s1, dx) => ({ cam: [x + (dx || 0), y + 200 / s0, 54, 200], to: [x, y + 200 / s1, 54, 200] });
const FIELD = { kind: 'rect', w: 250, h: 120 }, V = ['cadv1', 'cadv2'], TL = ['cadt1', 'cadt2'];
const FF = {
  valley: () => ({
    title: 'THE ASSAY', sub: 'HOUSE VIOLET - HOLD THE VALLEY', bg: 'valley', arena: FIELD, music: 'battle', rage: 1, legend: 1, foeName: 'House Teal', winText: 'THE VALLEY HOLDS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 40 }, allies: V, shouts: ['FOR VIOLET!', 'WITH HIM!', 'PUSH!'],
    waves: [[{ id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt2', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 7 }],
      [{ id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 8 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }, { id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 8 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }]],
    onWave: (w, B) => { B.p.fury = 100; B.say('FURY', true); B.voice('fury'); },
    voice: { at: [[1, 'A BLADE IS A WRENCH WITH ONE JOB. I KNOW WRENCHES.'], [9, 'THEY WERE RAISED ON TUTORS AND FENCING MASTERS. I WAS RAISED ON TIER SIX.'], [17, 'THE PROCTORS ON THE DAIS WRITE DOWN EVERY CUT. I GIVE THEM SOMETHING TO WRITE.'], [28, 'THEY THINK THIS IS A GAME THAT TURNS CHILDREN INTO RULERS. FOR ME IT IS A DOOR.']],
      hurt: 'PAIN IS THE BODY KEEPING COUNT. I KNOW ABOUT COUNTING.', clash: 'STEEL ON STEEL. IT RINGS LIKE A VALVE WHEEL LETTING GO.', fury: 'THERE IT IS. THE THING I KEEP UNDER THE GOLD.', eleven: 'ELEVEN SECONDS. I HAVE LIVED INSIDE THEM FOR FOUR YEARS.', wave: 'MORE. GOOD. I HAVE MORE TOO.' },
    arts: [{ on: 'start', after: 5, name: 'TIER SIX', line: 'I LEARNED TO SWING IN A VALVE BAY, ON PIPES THAT HIT BACK.', panel: 'pipe', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { on: 'wave', name: 'BRASS RING', line: 'SHE WORE A WASHER FOR A WEDDING RING. I WEAR IT UNDER THE ARMOUR.', panel: 'hands', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }],
    intro: [
      { d: 2.0, cam: [0, 190, 50, 170], to: [0, 150, 52, 190], acts: [{ id: 'kael2', a: [0, 30], blade: 1, aura: 1 }].concat(ffRow(V, 6, -75, 30, 12, { fy: 1 })), cap: 'THEY THINK I AM ONE OF THEM.' },
      { d: 1.5, cam: [70, 110, 46, 150], to: [-70, 110, 46, 150], lin: 1, speed: 1, sfx: 'roar', acts: ffRow(TL, 9, -120, 30, -110, { fy: 1 }, -10), cap: 'HOUSE TEAL. FORTY BLADES.' },
      { d: 1.3, cam: [0, 250, 44, 150], to: [0, 170, 40, 160], speed: 1, shake: .5, flash: 1, acts: [{ id: 'kael2', a: [0, 120], b: [0, 30], fy: -1, blade: 1, aura: 2 }].concat(ffRow(V, 6, -75, 30, 135, { fy: -1 }, 46)), big: 'GOOD.' }
    ],
    outro: [
      { d: 2.4, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 3 }], cap: 'THE GOLD ON ME SHINES. WHAT IS UNDER IT DOES NOT.' },
      { d: 2.6, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'THEY CHANT A NAME I BOUGHT. NOT THE ONE I WAS BORN WITH.' },
      { d: 2.8, cam: [0, 215, 110, 150, .32], to: [0, 240, 120, 150, .9], acts: [], cap: 'BEFORE THE GOLD, I WAS SOOT.', tint: 'rgba(255,240,200,.08)' },
      { d: 2.2, cam: [0, 240, 120, 150, .9], to: [0, 240, 120, 150, 1.25], acts: [], big: 'FOUR YEARS EARLIER', cap: 'SIX TIERS DOWN.', tint: 'rgba(255,250,230,.35)' }
    ]
  }),
  ford: () => ({
    title: 'THE FORD', sub: 'SINGLE COMBAT FOR THE CROSSING', bg: 'ford', arena: FIELD, music: 'dusk', rage: 2, legend: 1, skip: 1, winText: 'THE FORD IS OURS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 45 }, taunt: { 0: ['WHO TRAINED YOU?', 'YOU FIGHT LIKE A MINER!', 'YIELD, BOY!'] },
    voice: { at: [[1, 'VANT IS THE BEST BLADE IN HOUSE TEAL. HE HAS NEVER ONCE BEEN HUNGRY.'], [11, 'MARA USED TO SAY: AIM IT UP, NOT SIDEWAYS. I AM AIMING, MARA.'], [26, 'EVERY NIGHT I WASH THE GOLD OFF MY HANDS AND CHECK THAT THE SOOT IS STILL THERE.']],
      hurt: 'HE HITS LIKE A PROCTOR. I HAVE BEEN HIT BY PROCTORS.', fury: 'I DO NOT GET ANGRY UP HERE. I WAS ALREADY ANGRY WHEN I ARRIVED.', eleven: 'ONE FOR EVERY SECOND.', half: 'HE IS AFRAID NOW. NOBODY EVER TAUGHT THEM WHAT TO DO WITH THAT.' },
    arts: [{ at: .7, name: 'RATION AIR', line: 'WE BLED THEIR AIR INTO A FEVER WARD. THAT WAS THE WHOLE CRIME.', panel: 'ward', stage: 1, kind: 'storm', rgb: '120,220,200', hex: '#78dcc8' }, { at: .36, name: 'LITTLE EMBER', line: 'THEY CALLED HER LITTLE EMBER. THEN THEY LIT THE FURNACE.', panel: 'furnace', kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }],
    foes: [{ id: 'vant', name: 'Captain Vant', kind: 'captain', hp: 120, sc: 1.12 }],
    intro: [
      { d: 2.2, cam: [-90, 230, 130, 150, .2], to: [30, 150, 64, 150, .32], acts: ffRow(TL, 7, -90, 30, -40, { fy: 1 }).concat([{ id: 'vant', a: [0, -22], blade: 1, sc: 1.12 }]), big: 'THE FORD', cap: 'THE ASSAY. DAY NINETEEN.' },
      { d: 1.7, ...cu(0, -22, 1.8, 2.3, 22), acts: [{ id: 'vant', a: [0, -22], blade: 1, sc: 1.12 }], cap: 'CAPTAIN VANT OFFERED SINGLE COMBAT FOR THE CROSSING. HE HAS NEVER LOST ONE.' },
      { d: 1.6, ...cu(0, 40, 1.9, 2.7, -18), flash: 1, sfx: 'roar', acts: [{ id: 'kael2', a: [0, 40], blade: 1, aura: 2 }], cap: 'NEITHER HAVE I. I HAVE ONLY EVER LOST ONE THING.' }
    ],
    outro: [
      { d: 2.4, ...cu(0, -8, 1.9, 2.6, 20), acts: [{ id: 'kael2', a: [0, -8], blade: 1, aura: 3 }], cap: 'THEY ALL HAVE HER EYES. I CHECK. EVERY TIME.' },
      { d: 2.6, cam: [0, 130, 60, 150], to: [70, 20, 54, 220], acts: [{ id: 'lucan', a: [70, -100], blade: 1, fx: -1, fy: .4 }, { id: 'kael2', a: [0, -8], blade: 1, fx: 1, fy: -.6 }], cap: 'ON THE RIDGE, SOMEONE IS WATCHING.' },
      { d: 2.6, ...cu(70, -100, 1.7, 2.4, 14), acts: [{ id: 'lucan', a: [70, -100], blade: 1 }], cap: 'LUCAN AUREL. THE HIGH AUDITOR HAD A SON.' },
      { d: 2.0, ...cu(70, -100, 2.4, 2.7, 0), acts: [{ id: 'lucan', a: [70, -100], blade: 1 }], big: 'NOT YET.', tint: 'rgba(10,4,16,.45)' }
    ]
  }),
  keep: () => ({
    title: 'THE KEEP', sub: 'LUCAN AUREL - LAST DAY OF THE ASSAY', bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'duel', rage: 3, legend: 1, skip: 1, endAt: 0.3, winText: 'YIELD.',
    hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 50 }, taunt: { 0: ['YOU ARE ANGRY AT SOMEONE.', 'MOTHER WOULD LIKE YOU.', 'WHAT ARE YOU?', 'WHO WAS SHE?'] },
    voice: { at: [[1, 'LUCAN AUREL. HER SON. HER CHIN, HER HANDS, HER WAY OF LOOKING PAST YOU.'], [12, 'HE HAS BEEN BETTER THAN EVERYONE HIS WHOLE LIFE. IT HAS MADE HIM SLOW.'], [20, 'SHE IS WATCHING FROM THE DAIS. SHE DOES NOT KNOW MY FACE. SHE MADE IT.'], [34, 'SHE CALLED SEREN LITTLE EMBER. I WONDER WHAT SHE CALLS HIM.']],
      hurt: 'HE DID NOT LIGHT THE FURNACE. I KNOW. I KNOW.', fury: 'BE TOO MUCH FOR THEM, SHE SAID.', eleven: 'ELEVEN. FOR THE DOORS. FOR THE WASHER ON HER FINGER.', half: 'I COULD KILL HIM. THAT IS NOT WHAT I CAME UP HERE FOR.' },
    arts: [{ at: .82, name: 'LIFT ZERO', line: 'THEY CAME DOWN IN LIGHT. I WENT UP IN IT.', panel: 'lift', kind: 'rise', rgb: '255,240,200', hex: '#fff0c8' }, { at: .6, name: 'TIN SUN', line: 'SHE PAINTED A SUN ON A TIN LID. WRONG COLOUR. BETTER.', panel: 'tin', kind: 'storm', rgb: '255,200,60', hex: '#ffc83c' }, { at: .42, name: 'ELEVEN SECONDS', line: 'THE DOORS STOOD OPEN ELEVEN SECONDS. SHE WALKED IN BY HERSELF.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,90,30', hex: '#ff5a1e', dark: 'rgba(26,4,2,.82)' }],
    foes: [{ id: 'lucan', name: 'Lucan Aurel', kind: 'duelist', hp: 150, sc: 1.08 }],
    intro: [
      { d: 2.2, cam: [0, 260, 150, 150, .18], to: [0, 150, 62, 150, .32], acts: [{ id: 'lucan', a: [40, -10], blade: 1, fx: -1, fy: .3 }, { id: 'kael2', a: [-40, 4], blade: 1, fx: 1, fy: -.2, aura: 2 }], big: 'THE KEEP', cap: 'THE LAST DAY OF THE ASSAY.' },
      { d: 2.0, ...cu(40, -10, 1.8, 2.5, 18), acts: [{ id: 'lucan', a: [40, -10], blade: 1 }], cap: '"YOU FIGHT LIKE YOU ARE ANGRY AT SOMEONE, CADET."' },
      { d: 1.8, ...cu(-40, 4, 1.9, 2.8, -16), flash: 1, sfx: 'roar', acts: [{ id: 'kael2', a: [-40, 4], blade: 1, aura: 3 }], cap: 'HE HAS HIS MOTHER\'S SMILE.' }
    ],
    outro: [
      { d: 2.6, cam: [30, 150, 56, 170], to: [10, 124, 54, 190], acts: [{ id: 'lucan', a: [26, -6], pose: 'kneel', fx: -1, fy: .2 }, { id: 'kael2', a: [-6, 0], blade: 1, fx: 1, fy: -.2, aura: 3 }], cap: 'HIS CIRCLET RINGS ON THE STONE. NOBODY PICKS IT UP.' },
      { d: 2.8, cam: [-6, 90, 54, 200, .32], to: [-6, 130, 60, 200, .62], acts: [{ id: 'kael2', a: [-6, 0], blade: 1, fy: -1, aura: 2 }], cap: 'THE SUN IS ROUNDER THAN SHE PAINTED IT. AND NOT HALF AS WARM.' },
      { d: 3.0, cam: [-6, 130, 60, 200, .62], to: [-6, 160, 90, 180, 1.2], acts: [], cap: 'ONE CANDLE-HOUR, SEREN. WATCH HOW LONG I BURN.', tint: 'rgba(255,246,220,.25)' }
    ]
  }),
  // the first night: two sealed in, one comes out a cadet
  pairing: () => ({
    title: 'THE PAIRING', sub: 'TWO GO IN. ONE COMES OUT A CADET.', bg: 'cell', arena: { kind: 'ring', rx: 96, ry: 58 }, music: 'dusk', rage: 0, legend: 1, skip: 1, winText: 'ONE COMES OUT',
    hero: { id: 'kael2', hp: 8, pow: 1, blade: 1, fury0: 10 }, taunt: { 0: ['I DO NOT WANT TO.', 'PLEASE.', 'WHO IS THIS FOR?'] },
    foes: [{ id: 'teo', name: 'Teo Aldane', kind: 'cadet', hp: 30 }],
    voice: { at: [[1, 'HE SHARED HIS BREAD ON THE LIFT UP. HE ASKED ABOUT MY FAMILY. I LIED WELL.'], [13, 'HE IS NOT BAD AT THIS. SOMEBODY LOVED HIM ENOUGH TO PAY FOR LESSONS.'], [26, 'UP IN THE GALLERY THEY ARE KEEPING SCORE.']],
      hurt: 'GOOD. MAKE IT EASIER FOR ME.', fury: 'I SAID HER NAME UNTIL IT WAS THE ONLY THING IN THE ROOM.', half: 'HE HAS STOPPED TRYING TO WIN. HE IS ONLY TRYING TO LAST.', eleven: 'ELEVEN. HE DID NOTHING TO EARN ANY OF THEM.' },
    arts: [{ at: .5, name: 'HER NAME', line: 'SHE WALKED INTO THE FURNACE SO FORTY CHILDREN COULD BREATHE. I AM DOING THIS FOR HER. I AM.', panel: 'furnace', kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }],
    intro: [
      { d: 3.0, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-38, 4], fx: 1, fy: 0, blade: 1 }, { id: 'teo', a: [38, 4], fx: -1, fy: 0, blade: 1 }], big: 'THE PAIRING', cap: 'THE ASSAY. THE FIRST NIGHT. THEY SEAL US IN BY TWOS.' },
      { d: 2.4, ...cu(38, 4, 1.8, 2.4, 16), acts: [{ id: 'teo', a: [38, 4], blade: 1 }], cap: 'TEO ALDANE. HE SHARED HIS BREAD ON THE LIFT UP. HE IS SIXTEEN.' },
      { d: 2.4, cam: [0, 130, 30, 150, .5], to: [0, 150, 26, 150, .62], acts: [{ id: 'kael2', a: [-38, 4], fx: 1, fy: 0, blade: 1 }, { id: 'teo', a: [38, 4], fx: -1, fy: 0, blade: 1 }], cap: 'A VOICE FROM THE GALLERY: ONE OF YOU LEAVES THIS ROOM A CADET.' },
      { d: 2.0, ...cu(-38, 4, 1.9, 2.7, -14), flash: 1, sfx: 'heart', acts: [{ id: 'kael2', a: [-38, 4], blade: 1, aura: 1 }], cap: 'I DID NOT COME UP HERE TO BE KIND.' }
    ],
    outro: [
      { d: 3.0, cam: [30, 150, 56, 170], to: [6, 124, 54, 190], acts: [{ id: 'teo', a: [22, -2], pose: 'kneel', fx: -1, fy: .2 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1 }], cap: 'HE SAID: I HOPE SHE WAS WORTH IT. I HAD NOT TOLD HIM THERE WAS A SHE.' },
      { d: 3.0, cam: [0, 150, 60, 150, .3], to: [0, 250, 170, 150, .16], acts: [{ id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1 }], cap: 'THEY CARRIED HIM OUT BY THE OTHER DOOR. NOBODY SAYS WHERE IT GOES.' },
      { d: 3.0, ...cu(-10, 2, 1.9, 2.8, 12), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 1 }], cap: 'SEREN WOULD NOT HAVE KNOWN ME. THAT WAS THE PRICE OF THE DOOR.', tint: 'rgba(10,4,16,.3)' }
    ]
  }),
  // day thirty-one: nobody touches a Proctor
  proctor: () => ({
    title: 'THE PROCTOR', sub: 'HALDEN VOSS - NOBODY TOUCHES A PROCTOR', bg: 'storm', arena: FIELD, music: 'duel', rage: 3, legend: 1, skip: 1, winText: 'HE BLEEDS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 50 }, taunt: { 0: ['I GRADE YOU, BOY.', 'YOU WILL BE UNMADE FOR THIS.', 'WHAT ARE YOU?'] },
    foes: [{ id: 'voss', name: 'Proctor Voss', kind: 'warden', hp: 130, sc: 1.28 }],
    voice: { at: [[1, 'THE PROCTORS ARE MEANT TO WATCH. THIS ONE HAS BEEN SELLING OUR POSITIONS TO HOUSE TEAL.'], [14, 'HE FIGHTS LIKE A MAN WHO HAS ONLY EVER HIT PEOPLE WHO WERE NOT ALLOWED TO HIT BACK.'], [30, 'I KNOW THAT KIND OF MAN. I GREW UP UNDER THEIR BOOTS.']],
      hurt: 'A HALBERD. OF COURSE IT IS A HALBERD.', fury: 'ANGER IS FOR EQUALS, SHE TOLD ME. THEN LET US BE EQUALS.', half: 'HE LOOKS AT HIS OWN BLOOD AS IF IT WERE A CLERICAL ERROR.', eleven: 'ONE FOR EVERY SECOND. I HAVE PLENTY TO SPARE.' },
    arts: [{ at: .72, name: 'THE AUDIT', line: 'THEY CAME DOWN IN LIGHT TO COUNT US. TONIGHT I DO THE COUNTING.', panel: 'lift', kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { at: .36, name: 'BALANCED', line: 'SHE SAID "BALANCED" WHEN THE DOORS CLOSED. I HAVE CARRIED THE REMAINDER EVER SINCE.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,90,30', hex: '#ff5a1e', dark: 'rgba(26,4,2,.82)' }],
    intro: [
      { d: 3.0, cam: [-60, 250, 150, 150, .18], to: [0, 150, 62, 150, .32], acts: [{ id: 'voss', a: [34, -8], blade: 2, sc: 1.28, fx: -1, fy: .3 }, { id: 'cadv1', a: [-6, 14], pose: 'kneel', fx: 1, fy: -.3 }, { id: 'cadv2', a: [8, -30], pose: 'kneel', fx: 1, fy: .4 }, { id: 'kael2', a: [-70, 6], b: [-44, 4], fx: 1, fy: 0, blade: 1 }], big: 'THE PROCTOR', cap: 'THE ASSAY. DAY THIRTY-ONE. A STORM OVER THE VALLEY.' },
      { d: 2.6, ...cu(34, -8, 1.5, 2.0, 18), acts: [{ id: 'voss', a: [34, -8], blade: 2, sc: 1.28 }], cap: 'PROCTOR VOSS CAME DOWN FROM THE DAIS TO FINISH HOUSE VIOLET HIMSELF.' },
      { d: 2.4, ...cu(-44, 4, 1.9, 2.8, -14), flash: 1, bolt: 1, sfx: 'roar', acts: [{ id: 'kael2', a: [-44, 4], blade: 1, aura: 3 }], cap: 'NOBODY TOUCHES A PROCTOR. IT IS THE FIRST RULE THEY TEACH YOU.' }
    ],
    outro: [
      { d: 3.0, cam: [34, 150, 56, 170], to: [10, 124, 54, 190], acts: [{ id: 'voss', a: [26, -6], pose: 'kneel', sc: 1.28, fx: -1, fy: .2 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: 'HE BLEEDS. THE WHOLE VALLEY SEES IT. NOBODY KNEW THEY COULD.' },
      { d: 3.0, ...cu(-10, 2, 1.8, 2.5, 14), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 2 }], cap: 'I TOOK HIS WHITE CLOAK OFF HIM AND WORE IT BACK TO CAMP.' },
      { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'THAT WAS THE NIGHT THEY STOPPED FOLLOWING THE HOUSE AND STARTED FOLLOWING ME.' }
    ]
  }),
  furnace: () => ({ title: 'THREE STEPS', sub: 'THE WARDEN', bg: 'furnace', arena: { kind: 'rect', w: 200, h: 80 }, music: 'mystery', doomed: 9, hero: { hp: 4, fury0: 80 }, voice: { at: [[.4, 'THREE STEPS.'], [3, 'IT IS LIKE HITTING THE ARRAY ITSELF.'], [6, 'SHE IS STILL LOOKING AT ME.']], eleven: 'I HIT HIM WITH EVERYTHING I WILL EVER BE. HE DOES NOT MOVE.' }, foes: [{ id: 'warden', name: 'Warden', kind: 'warden', hp: 999, sc: 1.1 }] })
};
// ---- the intro before the title: the Assay, start to finish, in thirty seconds
const OPENING = [
  // below: the night it started. Slow, dark, eleven seconds long.
  { d: 2.6, black: 1, music: 'mystery', credit: 'NORTH COAST STUDIOS PRESENTS', cap: 'THEY SAY THE SURFACE BURNED TWO HUNDRED YEARS AGO.' },
  { d: 3.4, bg: 'furnace', cam: [0, 230, 80, 150, .3], to: [0, 150, 58, 160, .32], lin: 1, credit: 'IN ASSOCIATION WITH E CONCEPTS', acts: [{ id: 'seren', a: [0, 40], b: [0, 4], fy: -1 }, { id: 'warden', a: [-34, 20], fy: -1, blade: 2 }, { id: 'warden', a: [34, 20], fy: -1, blade: 2 }, { id: 'celestine', a: [0, -60], fy: 1 }], cap: 'THEY SAY WE ARE SOOT. WHAT IS LEFT WHEN SOMETHING USEFUL BURNS.' },
  { d: 2.4, ...cu(-8, 70, 1.7, 2.3, -16), bolt: 1, tint: 'rgba(120,10,0,.25)', sfx: 'heart', acts: [{ id: 'mara', a: [6, 62], fy: 1 }, { id: 'kael', a: [-8, 70], fy: 1, aura: 1 }], cap: 'I WATCHED THEM WALK MY WIFE INTO A FURNACE.' },
  { d: 4.2, cam: [0, 120, 50, 170, .32], to: [0, 30, 44, 200, .34], lin: 1, count: 11, tint: 'rgba(120,10,0,.18)', acts: [{ id: 'seren', a: [0, 4], b: [0, -74], fy: -1 }], cap: 'THE DOORS STOOD OPEN FOR ELEVEN SECONDS.' },
  { d: 1.7, black: 1, sfx: 'rumble', shake: .8, big: 'THE DOORS CLOSED.' },
  { d: 1.9, black: 1, bolt: 2, sfx: 'roar', music: 'battle', flash: 1, big: 'SO I WENT UP.', bigC: '#ff7a30' },
  // above: four years on. Fast, bright, loud.
  { d: 3.0, bg: 'valley', flash: 1, sfx: 'horn', cam: [0, 330, 200, 150, .14], to: [0, 170, 70, 150, .32], credit: 'A STORY OF CINDERWELL', acts: ffRow(V, 8, -105, 30, 60, { fy: -1 }).concat(ffRow(TL, 8, -105, 30, -70, { fy: 1 })), cap: 'ABOVE THE ROCK, THE ACCREDITED SEND THEIR CHILDREN TO WAR.' },
  { d: 2.3, cam: [-120, 112, 44, 170], to: [110, 112, 44, 170], lin: 1, acts: ffRow(V, 9, -120, 30, 30, { fy: 1 }), cap: 'ONE VALLEY. TWELVE HOUSES. ONE YEAR. THEY CALL IT THE ASSAY.' },
  { d: 1.4, cam: [70, 110, 46, 150], to: [-70, 110, 46, 150], lin: 1, speed: 1, sfx: 'roar', acts: ffRow(TL, 9, -120, 30, -110, { fy: 1 }, -10) },
  { d: 1.4, cam: [0, 270, 46, 150], to: [0, 180, 40, 160], speed: 1, shake: .4, acts: [{ id: 'kael2', a: [0, 124], b: [0, 30], fy: -1, blade: 1, aura: 2 }].concat(ffRow(V, 8, -105, 30, 140, { fy: -1 }, 48)) },
  { d: 2.0, cam: [-50, 150, 56, 150], to: [50, 132, 50, 170], flash: 1, shake: .8, sfx: 'hit', acts: ffRow(V, 5, -80, 40, 8, { fx: 1, fy: -.5, swing: 1 }).concat(ffRow(TL, 5, -62, 40, -8, { fx: -1, fy: .5, swing: 1 }), [{ id: 'kael2', a: [8, 24], fx: 1, fy: -.4, blade: 1, aura: 2, swing: 1 }]), cap: 'THIS YEAR ONE CADET IS BETTER THAN ALL OF THEM.' },
  { d: 2.0, ...cu(0, 24, 1.8, 2.6, -22), bolt: 1, acts: [{ id: 'kael2', a: [0, 24], blade: 1, aura: 3, swing: 1, fx: 1, fy: .3 }], cap: 'HE IS NOT ONE OF THEM.' },
  { d: 2.2, bg: 'ford', cam: [-90, 140, 40, 170], to: [40, 124, 44, 190], flash: 1, sfx: 'hit', shake: .5, acts: [{ id: 'vant', a: [26, 0], fx: -1, fy: .2, blade: 1, sc: 1.12, swing: 1 }, { id: 'kael2', a: [-14, 6], fx: 1, fy: -.2, blade: 1, aura: 2, swing: 1 }].concat(ffRow(TL, 4, 60, 28, -30, { fx: -1 })), cap: 'HE CAME UP FROM UNDER THEIR FEET.' },
  { d: 2.4, bg: 'keep', cam: [0, 250, 140, 150, .2], to: [0, 140, 56, 170, .32], flash: 1, acts: [{ id: 'lucan', a: [30, -6], fx: -1, fy: .2, blade: 1, sc: 1.08, swing: 1 }, { id: 'kael2', a: [-26, 4], fx: 1, fy: -.2, blade: 1, aura: 3, swing: 1 }], cap: 'HE CAME FOR ONE OF THEM IN PARTICULAR.' },
  { d: 2.2, ...cu(-26, 4, 1.9, 3.0, -14), sfx: 'roar', flash: 1, bolt: 2, shake: .5, tint: 'rgba(160,20,0,.16)', acts: [{ id: 'kael2', a: [-26, 4], blade: 1, aura: 4 }], cap: 'AND HE HAS BEEN COUNTING TO ELEVEN EVER SINCE.' },
  { d: 0.5, black: 1, flash: 1, sfx: 'hit', shake: .6 },
  { d: 3.6, black: 1, bolt: 1, sfx: 'choir', big: 'SOOTBORN', bigC: '#ffe08a', sub2: 'E V E R Y   B R E A T H   I S   H E R S', credit: 'NORTH COAST STUDIOS  x  E CONCEPTS' }
];
const Opening = { run(done) { if (NOFF) return done(); G.mode = 'opening'; Brawl.start({ bg: 'valley', arena: FIELD, music: 'battle', cineOnly: 1, intro: OPENING, foes: [] }, () => { Fade.a = 1; Fade.dir = -1; Fade.sp = 1.2; Fade.busy = true; done(); }); } };

// ---- weave them into the story
if (!NOFF) PROLOGUE_A.unshift({ noskip: true }, { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { card: 'FOUR YEARS FROM NOW', sub: 'Above the rock. The Assay.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.valley() }, { noskip: false });
// the furnace: if he runs for her, he gets his three steps
{ const i = PROLOGUE_B.findIndex(s => s.choice && s.choice.some(c => /BREAK FREE/.test(c.t))), ch = PROLOGUE_B[i].choice.find(c => /BREAK FREE/.test(c.t)), was = ch.then;
  ch.then = [narr("You tear out of Mara's arms. Three steps. A Warden turns, unhurried, and lowers a halberd the length of a pipe.")];
  PROLOGUE_B.splice(i + 1, 0, { fx: () => { if (F('ranForHer')) Cutscene.steps.splice(Cutscene.i, 0, { brawl: () => NOFF ? null : FF.furnace() }, { dlg: was }); } }); }
if (!NOFF) { const i = PROLOGUE_B.findIndex(s => s.card === 'SOOTBORN'); if (i >= 0) PROLOGUE_B.splice(i, 0, { fade: 'out' }, { card: 'FOUR YEARS FROM NOW', sub: 'The Assay. The first night.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.pairing() }); }
function ffScene(card, sub, def, done) { Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play([{ music: null }, { card, sub, big: 1, min: 1.5, max: 4.5 }, { brawl: def }], done); }
