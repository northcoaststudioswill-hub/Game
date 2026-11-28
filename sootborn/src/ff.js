// ============================================================
// content/ff — THE ASSAY. Four years on: Kael, gilded, passing as an Accredited cadet in the
// proving war they hold above the rock. Told fast: hard cuts, a camera that flies, captions that
// do not wait for a button. Everything the undercity chapters are not.
//  - Opening.run(): the pre-title intro (no play, any button skips)
//  - FF.valley / FF.ford / FF.keep: three playable battles woven through the story
//  - FF.furnace: present day, the three steps toward the furnace. It cannot be won.
// ============================================================
const NOFF = /noff/.test(location.hash);
const CLOAK = '#f4efe2';   // Voss's white cloak: on Kael from day thirty-one to the Pinning
const ffRow = (id, n, x0, dx, y, o, y2) => Array.from({ length: n }, (_, i) => Object.assign({ id: Array.isArray(id) ? id[i % id.length] : id, a: [x0 + i * dx, y + (i % 2) * 7], k: i, blade: 1 }, y2 === undefined ? {} : { b: [x0 + i * dx, y2 + (i % 2) * 7] }, o));
// close-up on a point: scale s0 -> s1, drifting dx sideways
const cu = (x, y, s0, s1, dx) => ({ cam: [x + (dx || 0), y + 200 / s0, 54, 200], to: [x, y + 200 / s1, 54, 200] });
const FIELD = { kind: 'rect', w: 250, h: 120 }, V = ['cadv1', 'cadv2'], TL = ['cadt1', 'cadt2'];
const FF = {
  valley: () => ({
    era: 3, title: 'THE ASSAY', sub: 'HOUSE VIOLET - HOLD THE VALLEY', bg: 'valley', arena: FIELD, music: 'battle', rage: 1, legend: 1, foeName: 'House Teal', winText: 'THE VALLEY HOLDS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 40 }, allies: V, shouts: ['FOR VIOLET!', 'WITH HIM!', 'PUSH!'],
    waves: [[{ id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt2', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 6 }, { id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 7 }],
      [{ id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 8 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }, { id: 'cadt2', name: 'Teal', kind: 'lancer', hp: 8 }, { id: 'cadt1', name: 'Teal', kind: 'cadet', hp: 7 }]],
    onWave: (w, B) => { B.p.fury = 100; B.say('FURY', true); B.voice('fury'); },
    voice: { at: [[1, 'A BLADE IS A WRENCH WITH ONE JOB. I KNOW WRENCHES.'], [9, 'THEY WERE RAISED ON TUTORS AND FENCING MASTERS. I WAS RAISED ON TIER SIX.'], [17, 'THE ASSAYERS ON THE DAIS WRITE DOWN EVERY CUT. I GIVE THEM SOMETHING TO WRITE.'], [28, 'THEY THINK THIS IS A GAME THAT TURNS CHILDREN INTO RULERS. FOR ME IT IS A DOOR.']],
      hurt: 'PAIN IS THE BODY KEEPING COUNT. I KNOW ABOUT COUNTING.', clash: 'STEEL ON STEEL. IT RINGS LIKE A VALVE WHEEL LETTING GO.', fury: 'THERE IT IS. THE THING I KEEP UNDER THE WIRE.', eleven: 'ELEVEN SECONDS. I HAVE LIVED INSIDE THEM FOR FOUR YEARS.', wave: 'MORE. GOOD. I HAVE MORE TOO.' },
    arts: [{ on: 'start', after: 5, name: 'TIER SIX', line: 'I LEARNED TO SWING IN A VALVE BAY, ON PIPES THAT HIT BACK.', panel: 'pipe', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { on: 'wave', name: 'BRASS RING', line: 'SHE WORE A WASHER FOR A WEDDING RING. I WEAR IT UNDER THE ARMOUR.', panel: 'hands', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }],
    intro: [
      { d: 2.6, black: 1, big: 'THE ASSAY', sub2: 'D A Y   F O R T Y', cap: 'MY NAME IS KAEL BRENNICK. UP HERE THEY KNOW ME BY ANOTHER.' },
      { d: 3.0, cam: [0, 330, 150, 150, .2], to: [0, 250, 110, 150, .24], acts: ffRow(V, 6, -75, 30, 40, { fy: -1 }).concat(ffRow(TL, 7, -90, 30, -70, { fy: 1 })), cap: 'THE ACCREDITED RULE THE AIR. ONCE A YEAR THEY SEND THEIR CHILDREN INTO A VALLEY TO LEARN WHICH OF THEM DESERVE TO.' },
      { d: 3.0, cam: [-60, 40, 70, 150, .3], to: [40, 30, 60, 150, .3], lin: 1, acts: ffRow(TL, 7, -90, 30, -70, { fy: 1 }), cap: 'TWELVE HOUSES. REAL STEEL. ASSAYERS ON THE DAIS WRITE DOWN WHO IS WORTH KEEPING. THEY CALL IT THE ASSAY.' },
      { d: 3.0, ...cu(0, 30, 1.9, 2.6, 18), acts: [{ id: 'kael2', a: [0, 30], blade: 1, aura: 1 }], cap: 'I WAS NOT BORN ONE OF THEM. I WAS BORN SIX TIERS UNDER THEIR FEET. THEY BURNED MY WIFE FOR A CRIME THAT WAS MINE.' },
      { d: 3.0, ...cu(0, 30, 2.6, 1.7, -18), acts: [{ id: 'kael2', a: [0, 30], blade: 1, aura: 2 }], cap: 'SO I LET MYSELF BE CUT INTO THEIR SHAPE AND CAME UP THE LIFT TO TAKE THEIR WORLD APART FROM INSIDE IT.' },
      { d: 2.0, cam: [0, 190, 50, 170], to: [0, 150, 52, 190], acts: [{ id: 'kael2', a: [0, 30], blade: 1, aura: 1 }].concat(ffRow(V, 6, -75, 30, 12, { fy: 1 })), cap: 'THEY THINK I AM ONE OF THEM.' },
      { d: 1.5, cam: [70, 110, 46, 150], to: [-70, 110, 46, 150], lin: 1, speed: 1, sfx: 'roar', acts: ffRow(TL, 9, -120, 30, -110, { fy: 1 }, -10), cap: 'HOUSE TEAL. FORTY BLADES.' },
      { d: 1.3, cam: [0, 250, 44, 150], to: [0, 170, 40, 160], speed: 1, shake: .5, flash: 1, acts: [{ id: 'kael2', a: [0, 120], b: [0, 30], fy: -1, blade: 1, aura: 2 }].concat(ffRow(V, 6, -75, 30, 135, { fy: -1 }, 46)), big: 'GOOD.' }
    ],
    outro: [
      { d: 2.4, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 3 }], cap: 'THE GILDING ON ME SHINES. WHAT IS UNDER IT DOES NOT.' },
      { d: 2.6, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'THEY CHANT A NAME I BOUGHT. NOT THE ONE I WAS BORN WITH.' },
      { d: 2.8, cam: [0, 215, 110, 150, .32], to: [0, 240, 120, 150, .9], acts: [], cap: 'BEFORE THE GILDING, I WAS SOOT.', tint: 'rgba(255,240,200,.08)' },
      { d: 2.2, cam: [0, 240, 120, 150, .9], to: [0, 240, 120, 150, 1.25], acts: [], big: 'BEFORE THE FURNACE', cap: 'SIX TIERS DOWN.', tint: 'rgba(255,250,230,.35)' }
    ]
  }),
  ford: () => ({
    era: 2, fin: { name: 'THE CROSSING', l1: 'ELEVEN STEPS ACROSS A RIVER', l2: 'I NEVER LEARNED TO SWIM', rgb: '120,200,255' }, title: 'THE FORD', sub: 'SINGLE COMBAT FOR THE CROSSING', bg: 'ford', arena: FIELD, music: 'dusk', rage: 2, legend: 1, skip: 1, winText: 'THE FORD IS OURS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 45 }, taunt: { 0: ['WHO TRAINED YOU?', 'YOU FIGHT LIKE A MINER!', 'YIELD, BOY!'] },
    voice: { at: [[1, 'VANT IS THE BEST BLADE IN HOUSE TEAL. HE HAS NEVER ONCE BEEN HUNGRY.'], [11, 'MARA USED TO SAY: AIM IT UP, NOT SIDEWAYS. I AM AIMING, MARA.'], [26, 'EVERY NIGHT I WASH THE ACCREDITED OFF MY HANDS AND CHECK THAT THE SOOT IS STILL THERE.']],
      hurt: 'HE HITS LIKE A TALLYMAN. I HAVE BEEN HIT BY TALLYMEN.', fury: 'I DO NOT SPEND IT UP HERE. I BROUGHT IT UP THE LIFT WITH ME, AND I BANK IT.', eleven: 'ONE FOR EVERY SECOND.', half: 'HE IS AFRAID NOW. NOBODY EVER TAUGHT THEM WHAT TO DO WITH THAT.' },
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
    era: 4, newMove: 'NEW: THE BOOTS - HOLD JUMP TO FLY', fin: { name: 'IRON SKY', l1: 'THEY BUILT THE BOOTS TO STAY ABOVE US', l2: 'I BROUGHT THE GROUND WITH ME', rgb: '140,220,255', mode: 'sky' }, boots: 1, title: 'THE KEEP', sub: 'LUCAN AUREL - LAST DAY OF THE ASSAY', bg: 'keep', arena: { kind: 'rect', w: 220, h: 100 }, music: 'duel', rage: 3, legend: 1, skip: 1, endAt: 0.3, winText: 'YIELD.',
    hero: { id: 'kael2', hp: 9, pow: 2, blade: 1, fury0: 50, cape: CLOAK }, taunt: { 0: ['YOU ARE ANGRY AT SOMEONE.', 'MOTHER WOULD LIKE YOU.', 'WHAT ARE YOU?', 'WHO WAS SHE?'] },
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
    era: 2, newMove: 'NEW: BREACH - GUARD + JUMP', title: 'THE PAIRING', sub: 'TWO GO IN. ONE COMES OUT A CADET.', bg: 'cell', arena: { kind: 'ring', rx: 96, ry: 58 }, music: 'dusk', rage: 0, legend: 1, skip: 1, winText: 'ONE COMES OUT',
    hero: { id: 'kael2', hp: 8, pow: 1, blade: 1, fury0: 10 }, taunt: { 0: ['I DO NOT WANT TO.', 'PLEASE.', 'WHO IS THIS FOR?'] },
    foes: [{ id: 'teo', name: 'Dorian Aldane', kind: 'cadet', hp: 36, k2: { poise: 1, double: 1, wind: 0.44, cd: [0.45, 1.0] } }],
    voice: { at: [[1, 'HE SHARED HIS BREAD ON THE LIFT UP. HE ASKED ABOUT MY FAMILY. I LIED WELL.'], [13, 'HE IS NOT BAD AT THIS. SOMEBODY LOVED HIM ENOUGH TO PAY FOR LESSONS.'], [26, 'UP IN THE GALLERY THEY ARE KEEPING SCORE.']],
      hurt: 'GOOD. MAKE IT EASIER FOR ME.', fury: 'I SAID HER NAME UNTIL IT WAS THE ONLY THING IN THE ROOM.', half: 'HE HAS STOPPED TRYING TO WIN. HE IS ONLY TRYING TO LAST.', eleven: 'ELEVEN. HE DID NOTHING TO EARN ANY OF THEM.' },
    arts: [{ at: .5, name: 'HER NAME', line: 'SHE WALKED INTO THE FURNACE SO FORTY CHILDREN COULD BREATHE. I AM DOING THIS FOR HER. I AM.', panel: 'furnace', kind: 'rise', rgb: '255,110,40', hex: '#ff6e28', dark: 'rgba(26,4,2,.8)' }],
    intro: [
      { d: 3.0, cam: [0, 250, 170, 150, .16], to: [0, 150, 66, 150, .3], acts: [{ id: 'kael2', a: [-38, 4], fx: 1, fy: 0, blade: 1 }, { id: 'teo', a: [38, 4], fx: -1, fy: 0, blade: 1 }], big: 'THE PAIRING', cap: 'THE ASSAY. THE FIRST NIGHT. THEY SEAL THE ONES NOBODY PAID FOR IN BY TWOS.' },
      { d: 2.4, ...cu(38, 4, 1.8, 2.4, 16), acts: [{ id: 'teo', a: [38, 4], blade: 1 }], cap: 'DORIAN ALDANE. HE SHARED HIS BREAD ON THE LIFT UP. HE IS THE YOUNGEST ONE HERE.' },
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
    flat: 1,
    era: 3, newMove: 'NEW: SHAFT DROP - JUMP, THEN JUMP AGAIN', fin: { name: 'THE RECKONING', l1: 'THEY CAME DOWN TO COUNT US', l2: 'I AM STILL COUNTING', rgb: '255,240,200' }, title: 'THE ASSAYER', sub: 'HALDEN VOSS - NOBODY TOUCHES AN ASSAYER', bg: 'storm', arena: FIELD, music: 'duel', rage: 3, legend: 1, skip: 1, winText: 'HE BLEEDS',
    hero: { id: 'kael2', hp: 10, pow: 2, blade: 1, fury0: 50 }, taunt: { 0: ['I GRADE YOU, BOY.', 'YOU WILL BE UNMADE FOR THIS.', 'WHAT ARE YOU?'] },
    foes: [{ id: 'voss', name: 'Assayer Voss', kind: 'warden', hp: 130, sc: 1.28, k2: { slam: 1 } }],
    voice: { at: [[1, 'THE ASSAYERS ARE MEANT TO WATCH. THIS ONE HAS BEEN SELLING OUR POSITIONS TO HOUSE TEAL.'], [14, 'HE FIGHTS LIKE A MAN WHO HAS ONLY EVER HIT PEOPLE WHO WERE NOT ALLOWED TO HIT BACK.'], [30, 'I KNOW THAT KIND OF MAN. I GREW UP UNDER THEIR BOOTS.']],
      hurt: 'A HALBERD. OF COURSE IT IS A HALBERD.', fury: 'ANGER IS FOR EQUALS, SHE TOLD ME. THEN LET US BE EQUALS.', half: 'HE LOOKS AT HIS OWN BLOOD AS IF IT WERE A CLERICAL ERROR.', eleven: 'ONE FOR EVERY SECOND. I HAVE PLENTY TO SPARE.' },
    arts: [{ at: .54, name: 'WARM THING', line: 'SHE LIT A FIRE ON A VALVE BLOCK WHEN WE WERE NINE. HANDS, KAEL. EVERYTHING IS HANDS.', panel: 'hands', kind: 'rise', rgb: '255,190,90', hex: '#ffbe5a' }, { at: .72, name: 'THE AUDIT', line: 'THEY CAME DOWN IN LIGHT TO COUNT US. TODAY I DO THE COUNTING.', panel: 'lift', kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }, { at: .36, name: 'BALANCED', line: 'SHE SAID "BALANCED" WHEN THE DOORS CLOSED. I HAVE CARRIED THE REMAINDER EVER SINCE.', panel: 'furnace', stage: 1, kind: 'rise', rgb: '255,90,30', hex: '#ff5a1e', dark: 'rgba(26,4,2,.82)' }],
    intro: [
      { d: 3.0, cam: [-60, 250, 150, 150, .18], to: [0, 150, 62, 150, .32], acts: [{ id: 'voss', a: [34, -8], blade: 2, sc: 1.28, fx: -1, fy: .3 }, { id: 'cadv1', a: [-6, 14], pose: 'kneel', fx: 1, fy: -.3 }, { id: 'cadv2', a: [8, -30], pose: 'kneel', fx: 1, fy: .4 }, { id: 'kael2', a: [-70, 6], b: [-44, 4], fx: 1, fy: 0, blade: 1 }], big: 'THE ASSAYER', cap: 'THE ASSAY. DAY THIRTY-ONE. A STORM OVER THE VALLEY.' },
      { d: 2.6, ...cu(34, -8, 1.5, 2.0, 18), acts: [{ id: 'voss', a: [34, -8], blade: 2, sc: 1.28 }], cap: 'ASSAYER VOSS CAME DOWN FROM THE DAIS TO FINISH HOUSE VIOLET HIMSELF.' },
      { d: 2.4, ...cu(-44, 4, 1.9, 2.8, -14), flash: 1, bolt: 1, sfx: 'roar', acts: [{ id: 'kael2', a: [-44, 4], blade: 1, aura: 3 }], cap: 'NOBODY TOUCHES AN ASSAYER. IT IS THE FIRST RULE THEY TEACH YOU.' }
    ],
    outro: [
      { d: 3.0, cam: [34, 150, 56, 170], to: [10, 124, 54, 190], acts: [{ id: 'voss', a: [26, -6], pose: 'kneel', sc: 1.28, fx: -1, fy: .2 }, { id: 'kael2', a: [-10, 2], blade: 1, fx: 1, fy: -.1, aura: 2 }], cap: 'HE BLEEDS. THE WHOLE VALLEY SEES IT. NOBODY KNEW THEY COULD.' },
      { d: 3.0, ...cu(-10, 2, 1.8, 2.5, 14), acts: [{ id: 'kael2', a: [-10, 2], blade: 1, aura: 2, cape: CLOAK }], cap: 'I TOOK HIS WHITE CLOAK OFF HIM AND WORE IT BACK TO CAMP.' },
      { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 215, 110, 150], acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 1, cape: CLOAK }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'THAT WAS THE NIGHT THEY STOPPED FOLLOWING THE HOUSE AND STARTED FOLLOWING ME.' }
    ]
  }),
  // nine years on: the war comes down out of the sky
  fall: () => ({
    era: 5, newMove: 'NEW FINISHER: EVERY BREATH - IT REACHES THE WHOLE DECK', fin: { name: 'EVERY BREATH', l1: 'EVERY BREATH I TAKE IS HERS', l2: 'I SPEND THEM ALL HERE', rgb: '255,224,138', mode: 'all' }, boots: 1, lurch: 1, title: 'THE FALL', sub: 'THE SUN SPIRE - HOLD THE DECK UNTIL WE HIT', bg: 'fall', arena: FIELD, music: 'battle', rage: 3, legend: 1, skip: 1, foeName: 'Spire Guard', winText: 'THE DECK IS OURS', endAt: .25,
    hero: { id: 'kael2', hp: 12, pow: 2, blade: 1, fury0: 60 }, allies: V, shouts: ['BELOW!', 'WITH HIM!', 'FOR TIER SIX!'], taunt: { 0: ['HE IS SOOT!', 'CUT THE LINES!', 'BRING IT DOWN!'] },
    waves: [[{ id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 9 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 9 }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 9 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 9 }],
      [{ id: 'cade', name: 'Marshal Cade', kind: 'captain', hp: 150, sc: 1.25, k2: { line: 1 } }, { id: 'sg1', name: 'Spire Guard', kind: 'cadet', hp: 9 }, { id: 'sg2', name: 'Spire Guard', kind: 'lancer', hp: 9 }]],
    onWave: (w, B) => { B.p.fury = 100; B.say('FURY', true); B.voice('fury'); },
    voice: { at: [[1, 'NINE YEARS AGO I KNELT WHEN THEY CAME DOWN IN LIGHT. TODAY WE ARE THE ONES COMING DOWN.'], [10, 'FOUR HUNDRED BARGES. EVERY ONE OF THEM FLOWN BY SOMEBODY WHO WAS BORN OWING AIR.'], [20, 'THE SPIRE IS WHERE THEY KEEP THE COUNT. I HAVE COME TO CLOSE THE LEDGER.'], [32, 'MARA SENT A LIST UP WITH TAVI. FORTY-FOUR NAMES. READ THEM OUT WHEN IT IS DONE, SHE SAID.']],
      hurt: 'I HAVE BEEN CUT BY BETTER. I MARRIED BETTER.', fury: 'IT NEVER WENT OUT. I ONLY LEARNED TO AIM IT.', wave: 'CADE. HE SIGNED THE FURNACE ORDER FOR TIER FOUR.', half: 'HE KEEPS LOOKING AT THE SPIRE. NOBODY IS COMING OUT OF IT FOR HIM.', eleven: 'ELEVEN SECONDS. I HAVE MADE AN ARMY OUT OF THEM.' },
    arts: [{ on: 'start', after: 6, name: 'FIRST FIRE', line: 'THEY LIT THEIR FESTIVAL FROM THE FURNACE THAT TOOK HER. I LIT A WAR FROM IT.', panel: 'furnace', stage: 2, kind: 'storm', rgb: '255,120,40', hex: '#ff7828', dark: 'rgba(26,4,2,.8)' }, { on: 'wave', name: 'EVERY BREATH', line: 'EVERY BREATH I TAKE IS HERS. I HAVE TAKEN A GREAT MANY. I INTEND TO SPEND THEM ALL HERE.', panel: 'hands', kind: 'rise', rgb: '255,210,110', hex: '#ffd26e' }, { at: .6, name: 'THE LEDGER', line: 'THEY WROTE DOWN WHAT WE OWED FOR TWO HUNDRED YEARS. NOBODY EVER WROTE DOWN WHAT THEY DID.', panel: 'world', stage: 3, kind: 'storm', rgb: '255,240,200', hex: '#fff0c8' }],
    intro: [
      { d: 2.8, black: 1, big: 'NINE YEARS AFTER THE FURNACE', cap: 'THIS IS WHERE IT GOES. I AM SHOWING YOU SO YOU KNOW IT GOES SOMEWHERE.' },
      { d: 3.2, cam: [0, 330, 170, 150, .3], to: [0, 240, 110, 150, .3], shake: .3, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 2, fy: -1 }].concat(ffRow(V, 6, -75, 30, 44, { fy: -1 })), big: 'THE FALL', cap: 'THE ACCREDITED LIVE ON THE SUN SPIRE, ABOVE THE WEATHER. YOU CANNOT CLIMB TO IT. SO WE ARE FALLING ON IT.' },
      { d: 3.0, ...cu(0, 20, 1.9, 2.6, 16), acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 2, fy: -1 }], cap: 'FOUR HUNDRED STOLEN LIFT-BARGES, CUT LOOSE FROM THE HIGH DOCKS. WE HAVE BOOTS. THE BARGES DO NOT NEED TO LAND WELL.' },
      { d: 2.6, cam: [70, 60, 50, 150], to: [-70, 60, 50, 150], lin: 1, sfx: 'roar', acts: ffRow(['sg1', 'sg2'], 8, -105, 30, -80, { fy: 1 }, -10), cap: 'THE SPIRE GUARD CAME UP TO MEET US ON THE WAY DOWN.' },
      { d: 1.6, ...cu(0, 20, 1.9, 2.9, -14), flash: 1, bolt: 1, acts: [{ id: 'kael2', a: [0, 20], blade: 1, aura: 3 }], big: 'GOOD.' }
    ],
    outro: [
      { d: 3.0, ...cu(0, 10, 1.9, 2.6, -24), acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 3 }], cap: 'CADE WENT OVER THE RAIL. I DID NOT WATCH HIM ALL THE WAY DOWN. I HAD SOMEWHERE TO BE.' },
      { d: 3.2, cam: [40, 150, 60, 150], to: [-30, 240, 130, 150], shake: .4, acts: [{ id: 'kael2', a: [0, 10], blade: 1, aura: 2 }].concat(ffRow(V, 7, -90, 30, 34, { fy: -1, pose: 'raise' })), cap: 'THE SPIRE CAME UP AT US WHITE AND GOLD AND VERY FAST. SOMEBODY BEHIND ME STARTED THE SHIFT SONG.' },
      { d: 3.0, cam: [0, 240, 130, 150, .3], to: [0, 250, 140, 150, 1.1], acts: [], cap: 'BUT THAT IS NINE YEARS OFF, AND I HAVE NOT EARNED IT YET.', tint: 'rgba(255,250,230,.3)' },
      { d: 2.6, black: 1, big: 'SOOTBORN', bigC: '#ffe08a', sub2: 'E V E R Y   B R E A T H   I S   H E R S', cap: 'FIRST I HAVE TO GET OUT OF CINDERWELL.' }
    ]
  }),
  // the dream of the training years: fought below, the old way
  drill: () => ({
    era: 1, newMove: 'NEW: THE RAM: HOOK BUTTON, UP CLOSE. WIDE CUT: GUARD + STRIKE', fin: { name: 'BANKED', l1: 'BRAND SAYS: DO NOT SPEND IT ALL', l2: 'I KEEP SOME BACK', rgb: '255,170,70', mode: 'bank' }, title: 'THE DRILL', sub: 'BRAND - THREE YEARS OF THIS', bg: 'pit', arena: { kind: 'ring', rx: 96, ry: 44 }, music: 'work', legend: 1, skip: 1, winText: 'AGAIN TOMORROW',
    hero: { id: 'kael2', hp: 9, pow: 1, blade: 1, fury0: 20 }, taunt: { 0: ['AGAIN.', 'YOU FIGHT LIKE SOOT.', 'THEY WILL NOT WAIT FOR YOU.', 'STAND UP TALLER.'] },
    foes: [{ id: 'brand', name: 'Brand', kind: 'baton', hp: 44 }],
    voice: { at: [[1, 'BRAND WAS A WARDEN UNTIL THEY ORDERED HIM TO PUT A HALBERD THROUGH A CHILD FOR HUMMING.'], [12, 'HE KNOWS HOW THEY FIGHT BECAUSE HE WAS PAID TO DO IT TO US.'], [24, 'THE NEW LEGS ARE TOO LONG. EVERY STEP LANDS A HAND FURTHER THAN I MEAN IT TO.']],
      hurt: 'HE HITS ME WHERE THE WIRE WENT IN. HE SAYS THEY WILL TOO.', fury: 'HE SAYS: DO NOT SPEND IT. BANK IT. I AM TRYING.', half: 'HE IS SMILING. I HAVE NOT SEEN THAT BEFORE.', eleven: 'ELEVEN. HE COUNTS ALONG WITH ME.' },
    arts: [{ at: .55, name: 'CLOSED TEETH', line: 'THE SHIFT SONG HAS NO WORDS. YOU HUM IT TO KEEP TIME ON THE WHEEL. I KEEP TIME ON HIM.', panel: 'pipe', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }]
  }),
  drill2: () => Object.assign(FF.drill(), { newMove: 'NEW: THE TURN. GUARD JUST AS HE SWINGS AND YOU COME OUT BEHIND HIM', title: 'NO GLOVES', sub: 'BRAND - THE SECOND YEAR', winText: 'AGAIN. BUT BETTER',
    foes: [{ id: 'brand', name: 'Brand', kind: 'baton', hp: 56, k2: { triple: 1 } }], taunt: { 0: ['DO NOT STOP IT. TURN IT.', 'WHERE WERE YOUR FEET?', 'AN HEIR WOULD BE DEAD.', 'AGAIN.'] },
    voice: { at: [[1, 'NO GLOVES. THE GRIP SITS ON THE OLD BURNS LIKE IT WAS CUT FOR THEM.'], [11, 'HE SWINGS WHERE A WARDEN SWINGS. I KNOW WHERE THAT IS. I HAVE BEEN UNDER IT.'], [22, 'STEP IN. LET IT PASS. BE BEHIND HIM. IT IS A VALVE. YOU DO NOT STOP PRESSURE. YOU SEND IT SOMEWHERE.']], hurt: 'THAT ONE I TRIED TO STOP. HE IS RIGHT. I CANNOT.', fury: 'BANK IT. HE SAYS IT EVERY DAY. BANK IT.', half: 'HE IS BREATHING HARD. HE IS FIFTY. HE HAS NOT SAID SO.', eleven: 'ELEVEN. HE DOES NOT COUNT ALONG THIS TIME. HE IS BUSY.' },
    arts: [{ at: .6, name: 'NOT THOSE', line: 'SHE TOOK THE BONES AND THE THROAT AND THE EYES. I SAID: NOT THE HANDS. THOSE ARE BANK SEVEN.', panel: 'hands', kind: 'storm', rgb: '255,170,70', hex: '#ffaa46' }, { at: .28, name: 'THE BAR', line: 'HOLLIS DID NOT TURN ROUND. HE FINISHED THE BAR HE WAS ON. SO WILL I.', panel: 'pipe', kind: 'rise', rgb: '255,120,60', hex: '#ff783c' }] }),
  furnace: () => ({ noFin: 1, title: 'THREE STEPS', sub: 'THE WARDEN', bg: 'furnace', arena: { kind: 'rect', w: 200, h: 80 }, music: 'mystery', doomed: 9, hero: { hp: 4, fury0: 80 }, voice: { at: [[.4, 'THREE STEPS.'], [3, 'IT IS LIKE HITTING THE ARRAY ITSELF.'], [6, 'SHE IS STILL LOOKING AT ME.']], eleven: 'I HIT HIM WITH EVERYTHING I WILL EVER BE. HE DOES NOT MOVE.' }, foes: [{ id: 'warden', name: 'Warden', kind: 'warden', hp: 999, sc: 1.1 }] })
};
// ---- the intro before the title: the Assay, start to finish, in thirty seconds
const OPENING = [
  // below: the night it started. Slow, dark, eleven seconds long.
  { d: 2.6, black: 1, music: 'mystery', credit: 'NORTH COAST STUDIOS PRESENTS', cap: 'THEY SAY THE SURFACE BURNED TWO HUNDRED YEARS AGO.' },
  { d: 3.4, bg: 'furnace', cam: [0, 230, 80, 150, .3], to: [0, 150, 58, 160, .32], lin: 1, credit: 'IN ASSOCIATION WITH E CONCEPTS', acts: [{ id: 'seren', a: [0, 40], b: [0, 4], fy: -1 }, { id: 'warden', a: [-34, 20], fy: -1, blade: 2 }, { id: 'warden', a: [34, 20], fy: -1, blade: 2 }, { id: 'celestine', a: [0, -60], fy: 1 }], cap: 'THEY SAY WE ARE SOOT. WHAT IS LEFT WHEN SOMETHING USEFUL BURNS.' },
  { d: 2.6, bg: 'furnace', cam: [-2, 176, 62, 170, .3], to: [-2, 158, 56, 186, .32], lin: 1, tint: 'rgba(120,10,0,.25)', sfx: 'heart', acts: [{ id: 'seren', a: [0, -6], b: [0, -14], fy: -1 }, { id: 'warden', a: [-30, 6], fy: -1, blade: 2 }, { id: 'warden', a: [30, 6], fy: -1, blade: 2 }, { id: 'hollis', a: [-26, 62], fx: .5, fy: -1 }, { id: 'mara', a: [22, 60], fx: -.5, fy: -1 }, { id: 'kael', a: [-2, 66], b: [-2, 58], fy: -1, aura: 1 }], cap: 'I WATCHED THEM WALK MY WIFE INTO A FURNACE.' },
  { d: 4.6, bg: 'furnace', cam: [0, 150, 56, 170, .3], to: [0, 104, 48, 196, .34], lin: 1, count: 11, tint: 'rgba(120,10,0,.18)', acts: [{ id: 'seren', a: [0, -14], b: [0, -70], fy: -1 }, { id: 'warden', a: [-30, 6], fy: -1, blade: 2 }, { id: 'warden', a: [30, 6], fy: -1, blade: 2 }, { id: 'celestine', a: [22, -58], fx: -1, fy: .4 }], cap: 'THE DOORS STOOD OPEN FOR ELEVEN SECONDS.' },
  { d: 1.7, black: 1, sfx: 'rumble', shake: .8, big: 'THE DOORS CLOSED.' },
  { d: 1.9, black: 1, bolt: 2, sfx: 'roar', music: 'battle', flash: 1, big: 'SO I WENT UP.', bigC: '#ff7a30' },
  // above: four years on. Fast, bright, loud.
  { d: 3.0, bg: 'valley', flash: 1, sfx: 'horn', cam: [0, 330, 200, 150, .14], to: [0, 170, 70, 150, .32], credit: 'A STORY OF CINDERWELL', acts: ffRow(V, 8, -105, 30, 60, { fy: -1 }).concat(ffRow(TL, 8, -105, 30, -70, { fy: 1 })), cap: 'ABOVE THE ROCK, THE ACCREDITED SEND THEIR CHILDREN TO WAR.' },
  { d: 2.3, cam: [-120, 112, 44, 170], to: [110, 112, 44, 170], lin: 1, acts: ffRow(V, 9, -120, 30, 30, { fy: 1 }), cap: 'ONE VALLEY. TWELVE HOUSES. ONE SEASON. THEY CALL IT THE ASSAY.' },
  { d: 1.4, cam: [70, 110, 46, 150], to: [-70, 110, 46, 150], lin: 1, speed: 1, sfx: 'roar', acts: ffRow(TL, 9, -120, 30, -110, { fy: 1 }, -10) },
  { d: 1.4, cam: [0, 270, 46, 150], to: [0, 180, 40, 160], speed: 1, shake: .4, acts: [{ id: 'kael2', a: [0, 124], b: [0, 30], fy: -1, blade: 1, aura: 2 }].concat(ffRow(V, 8, -105, 30, 140, { fy: -1 }, 48)) },
  { d: 2.0, cam: [-20, 128, 50, 170, .3], to: [14, 112, 44, 190, .32], lin: 1, flash: 1, shake: .5, sfx: 'hit', acts: ffRow(V, 6, -110, 40, -74, { fx: .2, fy: 1 }).concat([{ id: 'cadt1', a: [34, 2], fx: -1, fy: .3, blade: 1, guard: 1 }, { id: 'cadt2', a: [-22, -14], fx: .6, fy: .8, st: 'down', t: 2 }, { id: 'cadt1', a: [-36, 22], fx: 1, fy: .2, st: 'down', t: 2 }, { id: 'cadt1', a: [60, -22], fx: -1, fy: .5, blade: 1 }, { id: 'cadt2', a: [84, 6], fx: -1, fy: .2, blade: 1 }, { id: 'kael2', a: [8, 10], fx: 1, fy: -.3, blade: 1, aura: 2, hold: 3 }]), cap: 'THIS YEAR ONE CADET IS BETTER THAN ALL OF THEM.' },
  { d: 2.0, ...cu(0, 24, 1.8, 2.6, -22), bolt: 1, acts: [{ id: 'kael2', a: [0, 24], blade: 1, aura: 3, fx: .6, fy: .8 }], cap: 'HE IS NOT ONE OF THEM.' },
  { d: 2.2, bg: 'ford', cam: [-90, 140, 40, 170], to: [40, 124, 44, 190], flash: 1, sfx: 'hit', shake: .5, acts: [{ id: 'vant', a: [14, 0], fx: -1, fy: .2, blade: 1, sc: 1.12, hold: 1 }, { id: 'kael2', a: [-12, 5], fx: 1, fy: -.2, blade: 1, aura: 2, guard: 1 }].concat(ffRow(TL, 4, 60, 28, -30, { fx: -1 })), cap: 'HE CAME UP FROM UNDER THEIR FEET.' },
  { d: 2.4, bg: 'keep', cam: [0, 250, 140, 150, .2], to: [0, 140, 56, 170, .32], flash: 1, acts: [{ id: 'lucan', a: [4, -4], fx: -1, fy: .2, blade: 1, sc: 1.08, guard: 1 }, { id: 'kael2', a: [-22, 4], fx: 1, fy: -.2, blade: 1, aura: 3, hold: 2 }], cap: 'HE CAME FOR ONE OF THEM IN PARTICULAR.' },
  { d: 2.2, bg: 'keep', ...cu(-22, 4, 1.9, 3.0, -14), sfx: 'roar', flash: 1, bolt: 2, shake: .5, tint: 'rgba(160,20,0,.16)', acts: [{ id: 'kael2', a: [-22, 4], blade: 1, aura: 4, fx: .5, fy: .9 }], cap: 'AND HE HAS BEEN COUNTING TO ELEVEN EVER SINCE.' },
  { d: 0.5, black: 1, flash: 1, sfx: 'hit', shake: .6 },
  { d: 3.6, black: 1, bolt: 1, sfx: 'choir', big: 'SOOTBORN', bigC: '#ffe08a', sub2: 'E V E R Y   B R E A T H   I S   H E R S', credit: 'NORTH COAST STUDIOS  x  E CONCEPTS' }
];
const Opening = { run(done) { if (NOFF) return done(); G.mode = 'opening'; Brawl.start({ bg: 'valley', arena: FIELD, music: 'battle', cineOnly: 1, intro: OPENING, foes: [] }, () => { Fade.a = 1; Fade.dir = -1; Fade.sp = 1.2; Fade.busy = true; done(); }); } };

// ---- weave them into the story
if (!NOFF) PROLOGUE_A.unshift({ noskip: true }, { fx: () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } }, { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. The last day.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.keepCold() }, { card: 'BEFORE THE FURNACE', sub: 'Cinderwell. Six tiers under the rock. Before any of\u00a0it.', big: 1, min: 1.6, max: 5 }, { noskip: false });
// the furnace: if he runs for her, he gets his three steps
{ const i = PROLOGUE_B.findIndex(s => s.choice && s.choice.some(c => /BREAK FREE/.test(c.t))), ch = PROLOGUE_B[i].choice.find(c => /BREAK FREE/.test(c.t)), was = ch.then;
  ch.then = [narr("You tear out of Mara's arms. Three steps. A Warden turns, unhurried, and lowers a halberd the length of a pipe.")];
  PROLOGUE_B.splice(i + 1, 0, { fx: () => { if (F('ranForHer')) Cutscene.steps.splice(Cutscene.i, 0, { brawl: () => NOFF ? null : FF.furnace() }, { dlg: was }); } }); }
{ const i = PROLOGUE_B.findIndex(s => s.card === 'SOOTBORN'); if (i >= 0) PROLOGUE_B.splice(i, 0,
  { narr: 'The shift song has no words, because words cost breath. You hum it through your teeth to keep time on a valve wheel, forty people turning as one. It is older than the Authority. It was the one thing down here nobody had thought to ration.' },
  { narr: 'After that night the Authority put it on the tier speakers. Every bell. Slowed down, played on their own bright instruments.' },
  { narr: 'So that whenever we heard our own song, we would see the doors close. Hardly anybody on Tier Six has dared to hum it since.' });
  const j = PROLOGUE_B.findIndex(s => s.narr && /starts to hum the shift song/.test(s.narr)); if (j >= 0) PROLOGUE_B.splice(j + 1, 0, { narr: 'It is the only goodbye we are allowed. Speaking at a commitment is forbidden. Nobody ever wrote a rule about humming.' }); }
// the Pairing used to play here, before the title. It is in the first dream now (DREAM1), so the present comes straight after the furnace.
{ const c = PROLOGUE_B.find(s => s.card === 'FORTY-ONE DAYS AFTER THE FURNACE'); if (c) { c.card = 'ASHGATE'; c.sub = 'Forty-one days after the furnace. Kael still fixes\u00a0valves.'; c.big = 1; c.tr = 'wake'; } }
// the cold open: the last day of the Assay, one duel, nobody named. It cannot be lost, and it cuts as ELEVEN comes down. The whole fight is played at the end of Part One.
FF.keepCold = () => { const d = FF.keep(); delete d.skip; delete d.newMove; delete d.outro; d.cold = 1; d.arts = []; d.sub = 'THE ASSAY - THE LAST DAY'; d.hero = Object.assign({}, d.hero, { fury0: 55 }); d.taunt = { 0: ['WHAT ARE YOU?', 'WHO WAS SHE?', 'YOU ARE ANGRY AT SOMEONE.'] }; d.voice = { at: [[1, 'THE LAST DAY. HER SON HOLDS THE KEEP.']] }; d.foes = d.foes.map(f => Object.assign({}, f, { name: 'Her son' })); if (d.intro) d.intro = d.intro.filter(x => x.big || /LAST DAY/.test(x.cap || '')); return d; };
// the Keep at the end of Part One: the cold open again, the whole way through. He cannot be put down until ELEVEN has gone through him;
// then the blade breaks and he is on his knees in front of his mother. He lives.
FF.keepEnd = () => { const d = FF.keep(); d.breaks = 1; delete d.endAt; d.winText = 'THE BLADE BREAKS'; d.newMove = 'ELEVEN ENDS IT - FILL THE BAR, THEN HOLD STRIKE';
  d.voice = Object.assign({}, d.voice, { at: [[1, 'THE LAST DAY. HER SON HOLDS THE KEEP.'], [8, 'IF I PUT HIM ON HIS KNEES IN FRONT OF HER, SHE WILL HAVE TO PIN THE SUN ON ME HERSELF.'], [17, 'LUCAN AUREL. HER CHIN, HER HANDS, HER WAY OF LOOKING PAST YOU.'], [27, 'SHE IS WATCHING FROM THE DAIS. SHE DOES NOT KNOW MY FACE. SHE MADE IT.'], [39, 'SHE CALLED SEREN LITTLE EMBER. I WONDER WHAT SHE CALLS HIM.']] });
  d.outro = [
    { d: 2.4, ...cu(26, -6, 1.7, 2.4, 14), flash: 1, sfx: 'steel', shake: .6, acts: [{ id: 'lucan', a: [26, -6], fx: -1, fy: .2, guard: 1, blade: 1, sc: 1.08 }, { id: 'kael2', a: [4, -3], blade: 1, fx: 1, fy: -.2, aura: 3, hold: 3 }], cap: 'THE ELEVENTH COMES DOWN ON HIS BLADE. IT BREAKS A HAND ABOVE THE HILT.' },
    { d: 3.0, cam: [40, 170, 64, 160], to: [14, 132, 56, 180], acts: [{ id: 'celestine', a: [30, -64], fx: -.3, fy: 1 }, { id: 'lucan', a: [26, -6], pose: 'kneel', fx: -1, fy: .2, sc: 1.08 }, { id: 'kael2', a: [-6, 0], blade: 1, fx: 1, fy: -.2, aura: 2 }], cap: 'HE GOES TO HIS KNEES IN FRONT OF HIS MOTHER. SHE RISES, AND LEANS FORWARD.' }
  ].concat(d.outro); return d; };
// the Valley, day forty: it used to open the game and explain everything. In the last dream it needs none of that
FF.valley40 = () => { const d = FF.valley(); d.skip = 1; d.boots = 1; d.era = Math.max(d.era || 0, 4); d.hero = Object.assign({}, d.hero, { cape: CLOAK }); if (d.intro && d.intro.length > 2) { d.intro = [d.intro[0], d.intro[d.intro.length - 1]]; d.intro[0] = Object.assign({}, d.intro[0], { cap: 'DAY FORTY. TWO HOUSES HAVE COME FOR THE VALLEY.' }); d.intro[1] = Object.assign({}, d.intro[1], { cap: 'SEVENTY CADETS BEHIND ME. NOT ONE OF THEM KNOWS WHAT I AM.' }); } d.foeName = 'Two Houses'; const ot = id => id === 'cadt1' ? 'cado1' : id === 'cadt2' ? 'cado2' : id; d.waves = d.waves.map(w => w.map(e => Object.assign({}, e, { id: ot(e.id), name: 'Cadet' }))); for (const s of (d.intro || []).concat(d.outro || [])) if (s.acts) s.acts = s.acts.map(a => Object.assign({}, a, { id: ot(a.id) })); if (d.outro && d.outro.length > 1 && d.outro[d.outro.length - 1].big === 'BEFORE THE FURNACE') d.outro = d.outro.slice(0, -1); return d; };
// ---- the dreams: what happens between the fights, told below, the old way
const DREAM1 = () => [
  { music: 'mystery' }, { card: 'THAT NIGHT', sub: 'Kael does not dream of the furnace. For once it runs forward.', min: 1.6, max: 5 },
  { panel: 'gild' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'A hundred and sixty days after the furnace a woman finds me in the old tunnel. She was Accredited once. She still has the height, and the gold in her eyes, and nothing else they gave her.' },
  { say: 'ilse', t: 'They do not fear soot. They fear nothing that kneels. They only fear what looks like them.' },
  { say: 'ilse', t: 'So I am going to make you look like them. It will hurt more than anything that has happened to you. Except one thing.' },
  { say: 'kael', t: 'Why would one of them do this for one of us?' },
  { say: 'ilse', t: 'I kept a column of the Count for eleven years. One morning I was handed a line to strike, and I asked to see the person first. That was the whole of my crime. I asked to see her.' },
  { say: 'ilse', t: 'She was a welder on Tier Five with a cough. They struck her while I was still on the stair. Then they struck me from my House, which is slower, and you are permitted to watch.' },
  { say: 'ilse', t: 'You may stop me at any stage until the eyes. After the eyes there is no going back down. The dark will hurt you for the rest of your time.' },
  { say: 'kael', t: "I've been in the dark all my breath. Do it." },
  { pstage: 1 }, { wait: 2.2 },
  { narr: 'They call it gilding. They do it to their own children at twelve: gold wire run into the long bones so they grow tall, gold in the eye so they can stand the sun.' },
  { narr: 'Done to a grown man it takes nine months on a table, and most of his voice.' },
  // the table itself, drawn: fourteen pictures of what was done. If they were shown, the lines they carry are not said twice
  { fade: 'out' }, { issue: 'gild', or: [] }, { panel: 'gild' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.5 },
  { when: () => !G.flags.issue_gild, sfx: 'heart' }, { when: () => !G.flags.issue_gild, narr: 'First the bones. A child\'s bones are soft and take the wire. Mine had to be opened. I counted the places. Of course I counted. There were more than eleven, and I had to start again, and starting again was worse than the wire.' },
  { when: () => !G.flags.issue_gild, narr: 'Then the throat. Twenty years of furnace air comes out of it in black thread. I had not known that was why everybody on my tier sounded alike. I had thought it was only how people sound.' },
  { when: () => !G.flags.issue_gild, say: 'ilse', t: 'Now the hands. An heir has no burns on his palms. He has never held anything hot.' },
  { when: () => !G.flags.issue_gild, say: 'kael', t: 'No.' },
  { when: () => !G.flags.issue_gild, say: 'ilse', t: 'They will see them.' },
  { when: () => !G.flags.issue_gild, say: 'kael', t: "Then they'll see them. Those are Bank Seven. Those are the night I kept forty beds breathing. Take the rest. Not those." },
  { narr: 'It was the only no I had. She looked at my hands for a long time, and then she wrapped them, and I wore gloves for a year. She never raised it again.' },
  { fade: 'out' }, { panel: 'hands' }, { fade: 'in', spd: 0.8 }, { wait: 1 },
  { narr: 'On the table I went back to one day, over and over. Not the furnace. I would not give them the furnace.' },
  { narr: 'We were nine. She had stolen ration fuel, which is a commitment offence, and she lit it on a cold valve block behind Bank Seven with a flint and a curl of packing.' },
  { say: 'seren', t: "Hands, Kael. Everything is hands. If you can make one warm thing you can make another. Don't tell Mara." },
  { narr: 'She held mine over it until they stopped shaking. I had not known they were. She had known for a week.' },
  { sfx: 'heart' }, { narr: 'Every time the wire went in I put my hands back over that fire. By the sixth month I could smell the packing burn.' },
  { fade: 'out' }, { fx: () => { World.gilded = 1; } }, { panel: 'gild' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { when: () => !G.flags.issue_gild, narr: 'Last, the eyes. Gold leaf laid behind the lens, so the sun cannot burn what it was never meant to reach. It is the only part done awake.' },
  { when: () => !G.flags.issue_gild, narr: 'When the wrappings came off the first thing I saw was Ilse, holding a bare lamp a hand from my face. It did not hurt. Nothing bright has hurt since. I have never forgiven how easy that was to give us, and how long they did not.' },
  { fx: () => { G.flags.fury = (G.flags.fury || 0) + 2; } },
  { pstage: 2 }, { wait: 1.6 },
  { narr: 'I went onto the table a valve tech. I came off it a head taller, with a face my own mother would walk past, and had to learn to walk. Ten years came off with the rest. The wire does that. It is most of what the Gilding is for.' },
  { narr: 'I looked in the glass for her. I had thought, stupidly, that some part of it would still be the man she married, and that she would know him. There was nobody in the glass that either of us had ever met.' },
  { say: 'ilse', t: 'You are looking for somebody. Stop. He is not gone. He is underneath, where the wire is. That is the only place he was ever going to be safe.' },
  { narr: 'I asked her whether it was like that for her. She said: I was twelve. I do not remember who was underneath. That is what the Gilding is for.' },
  { pstage: 3 }, { wait: 0.8 },
  { say: 'ilse', t: 'Now the mouth. You sound like Tier Six every time you open it. Tell me you are grateful.' },
  { say: 'kael', t: 'Ta. ...Thanks.' },
  { pstage: 4 },
  { say: 'ilse', t: 'No. Soot thanks. To thank is to admit you were given something. They say: noted.' },
  { pstage: 5 },
  { say: 'ilse', t: 'Soot says "aye." They say "granted."' },
  { pstage: 6 },
  { say: 'ilse', t: 'Soot says "my breath" when it means "my life," because you have had to count it. They have never counted a breath. They say "my time."' },
  { pstage: 7 },
  { say: 'ilse', t: 'And never "we." Soot says "we" about everything. Up there it is "one." One does not kneel. One is not sorry. Try.' },
  { say: 'kael', t: 'One is... not sorry.' },
  { say: 'ilse', t: 'Better. Now mean it.' },
  { narr: 'That part nobody had to teach me.' },
  { narr: 'You can hear what she did in the way I tell this. I have not been able to say "don\'t" inside my own head for years. It is the one thing they took that I let them keep.' },
  { narr: 'Then Brand, in a sealed pump room, every day for three years.' },
  { fade: 'out' }, { panel: null },
  { card: 'TWO YEARS AFTER THE FURNACE', sub: 'A sealed pump room. Brand.', big: 1, min: 1.4, max: 4 }, { brawl: () => FF.drill() },
  // the second year, with the gloves off (it used to be dreamed a night later, after things that happen after it)
  { panel: 'gild' }, { pstage: 2 }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'The second year. I could walk. I could say "granted" without tasting it. I still wore the gloves.' },
  { say: 'brand', t: 'Take them off.' },
  { say: 'kael', t: 'Ilse said a year.' },
  { say: 'brand', t: 'Ilse is teaching you to pass. I am teaching you to live. Every heir you meet has been handed a blade since he was six and has never once been hit. You have been hit all your breath. That is the only thing you have that they do not. Take them off and use it.' },
  { say: 'brand', t: 'I am going to swing at your head. Do not stop it. You cannot. Step into it and let it go past, and be standing behind me when it lands. They call it the Turn. I call it not being where the halberd is.' },
  { fade: 'out' }, { panel: null }, { card: 'TWO AND A HALF YEARS AFTER THE FURNACE', sub: 'The pit. Brand. No gloves.', big: 1, min: 1.5, max: 4.5 },
  { brawl: () => FF.drill2() },
  { panel: 'hands' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'He looked at my palms afterwards, the way a man looks at a tool he sold once. He knew what a valve burn was. He had stood guard over the people who got them.' },
  { say: 'brand', t: 'I hit a welder from behind once, for humming. He did not turn round. He finished the bar he was on. I have thought about that bar every day since.' },
  { say: 'brand', t: 'When you get up there, boy, do not let them teach you it was ever a fair fight. It was never a fight. That is what the halberds are for.' },
  { fx: () => { G.flags.fury = (G.flags.fury || 0) + 1; } },
  { fade: 'out' }, { panel: null },
  { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'Lift Zero. Up under a dead boy\'s name, into the Assay.', min: 1.6, max: 5 },
  // then the lift opens on grass: the first days of the Assay
  { panel: 'assay' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'Four years after the furnace the lift opens on grass. I have read the word. I stand on it for a full minute before I can make myself walk.' },
  { pstage: 3 }, { wait: 1.2 },
  { narr: 'An Assayer reads out a dead boy\'s name. I answer to it. Nobody looks twice. Ilse was right about that: they do not look at each other, only at what the other is worth.' },
  { narr: 'That night they seal the ones nobody paid for in by twos.' },
  { fade: 'out' }, { panel: null }, ...(NOFF ? [] : [{ card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. The first night.', big: 1, min: 1.5, max: 4.5 }, { plate: 'pairing', secs: 7 }, { brawl: () => FF.pairing() }, { card: 'MORNING', sub: 'The Assay. Day three. The camp by daylight.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => walkCampDay() }]),
  { panel: 'assay' }, { pstage: 3 }, { fade: 'in', spd: 0.8 }, { wait: 0.6 },
  { narr: 'On the third day House Violet still had not eaten. Forty heirs, a river, a wood full of deer. I had expected to hate them. I had not expected to have to feed them.' },
  { fade: 'out' }, { panel: null }, { card: 'NIGHT THREE', sub: 'The Assay. Day three, after dark.', big: 1, min: 1.5, max: 4.5 }, { mission: 'camp' },
  { panel: 'assay' }, { pstage: 1 }, { fade: 'in', spd: 0.8 }, { wait: 1 },
  { narr: 'After that it is forty days of taking the valley one standard at a time. I am good at it. That is the part I did not expect, and do not like.' },
  { fade: 'out' }, { panel: null }
];
const DREAM2 = () => [
  { fx: () => { World.gilded = 1; } },
  { card: 'THAT NIGHT', sub: 'The dream again. It is getting longer.', min: 1.4, max: 4 },
  // what the Assay is, and then its middle: the Island and the Standard
  { panel: 'assay' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'The Assay. Every year the Accredited put their heirs, the year they come of age, into a walled valley with real steel and no rule that matters, and wait to see who walks out leading the rest.' },
  { pstage: 1 }, { wait: 2.2 },
  { narr: 'Twelve Houses. Twelve standards. Take another House\'s standard and its cadets are yours. Take the keep on the ridge and it is over.' },
  { pstage: 2 }, { wait: 1.4 },
  { narr: 'They put me in Violet. Teal holds the river. For twenty-five days we have been taking each other apart.' },
  { pstage: 3 }, { wait: 1.4 },
  { narr: 'The Assayers watch from the dais and write it all down. The winner is not given a prize. He is given a post: the Spire, the Array, the count of who breathes.' },
  { narr: 'That is why I am up here. I did not come to win their game. I came to be handed the keys.' },
  { narr: 'Lucan Aurel holds the keep. Her son. If I put him on his knees in front of her, she will have to pin the sun on me herself.' },
  { narr: 'She sat across a white room from me twice a week for four months. She will look straight at what Ilse made of me and see one of her own.' },
  { fade: 'out' }, { panel: 'ledger' }, { fade: 'in', spd: 1.2 }, { wait: 0.6 }, { sfx: 'heart' },
  { narr: 'And for one breath the dream slips further. A book as wide as a table. Columns of names. A pen in my hand, and gold on my cuff.' },
  { pstage: 1 }, { wait: 1.4 },
  { narr: 'I do not know yet what the red lines mean. I know my hand is very steady, and that I hate it.' },
  { fade: 'out' }, { panel: null },
  { card: 'FOUR YEARS AFTER THE FURNACE', sub: 'The Assay. Night twenty-five.', big: 1, min: 1.5, max: 4.5 },
  { panel: 'island' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'House Teal held the island in the river, and the island held the only pump house in the valley. Their lamps ran off its vent stack. So did the Assayers\' boots. So did everything.' },
  { narr: 'An apprentice kept the stack at night. Grey coat, no House. She stood with one hand flat on the pipe, the way you stand when you are listening to it.' },
  { narr: 'I had not known anyone above the rock did that.' },
  { fade: 'out' }, { panel: null }, { mission: 'raid' },
  { card: 'MORNING', sub: 'The Assay. Day twenty-six. They have come for it.', big: 1, min: 1.5, max: 4.5 }, { brawl: () => FF.twins() },
  { card: 'NIGHT TWENTY-EIGHT', sub: 'The Assay. Night twenty-eight. Forty of them, and nobody sitting.', big: 1, min: 1.5, max: 4.5 }, { mission: 'lamp' }
];
const DREAM3 = () => [
  { fx: () => { World.gilded = 1; } },
  { panel: 'spire' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'And once, only once, the dream runs all the way out to the end.' },
  { narr: 'The Sun Spire. Where they keep the count. Above the weather, where the sky was never poison at all.' },
  { pstage: 1 }, { wait: 1.6 },
  { narr: 'Nine years after the furnace, we stop asking to be let up. We come down on it.' },
  { fade: 'out' }, { panel: null }
];
function ffScene(card, sub, def, done) { Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play([{ music: null }, { card, sub, big: 1, min: 1.5, max: 4.5 }, { brawl: def }], done); }
