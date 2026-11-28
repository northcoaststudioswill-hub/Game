// Starhaven — rooms (levels). Data only. Coordinates are tiles; x ranges are [start, end).
// Ground top is row 16 unless a shape says otherwise. 20 rows tall.
//   hints:    control tips shown while Wren stands between x0 and x1 (optionally only once a story flag is set)
//   triggers: story scripts that start when Wren reaches x (once each)
//   npcs:     people. Story beats start on their own; optional people can be talked to with TALK.
//   gates:    wooden gates that block the way until a script opens them
(function (SH) {
  SH.ROOMS = {};

  // ---------------------------------------------------------------- Prologue part 1: The Winter Woods (mortal Wren, a bow, no enemies)
  SH.ROOMS.woods = {
    id: 'woods', width: 160, height: 20, theme: 'winter',
    start: { x: 10, y: 16 },
    cottage: 2,                          // the sisters' cottage, where it starts
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 44, 16],
      ['solid', 20, 22, 15, 16],         // a fallen log
      ['ground', 30, 38, 15],            // a snowbank
      ['ground', 47, 160, 16],           // a frozen creek between 44 and 47
      ['solid', 55, 57, 14, 16],         // a boulder
      ['oneway', 81, 87, 12],            // a rock shelf: something green grows up there
      ['solid', 79, 81, 14, 16],         // the step up to it
      ['ground', 110, 118, 15],          // the rise before the clearing
      ['solid', 158, 160, 0, 20],
    ],
    hints: [
      { x0: 9, x1: 17, text: 'Move with {MOVE}. Lissa and Nessa have something to say: walk up to them and use {TALK}.' },
      { x0: 17, x1: 26, text: 'Jump with {JUMP}. Wren is still mortal: one jump, no more.' },
      { x0: 47, x1: 53, text: 'A snare. Stand by it and use {TALK} to check it.' },
      { x0: 59, x1: 72, text: 'Father\'s old targets. Shoot with {SHOOT}: the high one needs a jump: shoot at the top of it.' },
      { x0: 90, x1: 100, text: 'A wolf. Shoot with {SHOOT} before it springs, or jump its lunge. What happens after the first arrow is up to you.', until: 'wolfdone' },
      { x0: 112, x1: 120, text: 'There are snares you have not checked behind you.', until: 'snares3' },
      { x0: 124, x1: 139, text: 'Shoot with {SHOOT}. Get too close and the low star will drift away.', flag: 'stagseen' },
    ],
    triggers: [
      { x: 10, script: 'woods_start' },
      { x: 59, script: 'woods_range' },
      { x: 113, script: 'woods_tracks' },
      { x: 123, script: 'woods_stag' },
    ],
    lanterns: [{ x: 12, lit: true }, { x: 48 }, { x: 89 }, { x: 119 }],
    npcs: [{ id: 'lissa', x: 7, optional: 'woods_lissa' }, { id: 'nessa', x: 15.5, optional: 'woods_nessa' }],
    gates: [],
    props: [
      { t: 'log', x: 20, w: 2 }, { t: 'boulder', x: 55, w: 2, h: 2 }, { t: 'boulder', x: 79, w: 2, h: 2 },
      { t: 'bush', x: 14.5 }, { t: 'bush', x: 27 }, { t: 'bush', x: 40.5 }, { t: 'bush', x: 52 }, { t: 'bush', x: 74 }, { t: 'bush', x: 93 }, { t: 'bush', x: 107 }, { t: 'bush', x: 121 }, { t: 'bush', x: 131 },
      { t: 'drift', x: 24.5 }, { t: 'drift', x: 34 }, { t: 'drift', x: 49 }, { t: 'drift', x: 68 }, { t: 'drift', x: 88 }, { t: 'drift', x: 101 }, { t: 'drift', x: 126 }, { t: 'drift', x: 136 }, { t: 'drift', x: 151 },
      { t: 'pine', x: 17.5 }, { t: 'pine', x: 42 }, { t: 'pine', x: 59 }, { t: 'pine', x: 77 }, { t: 'pine', x: 98 }, { t: 'pine', x: 122 }, { t: 'pine', x: 146 }, { t: 'pine', x: 156.5 },
      { t: 'deadtree', x: 63 }, { t: 'deadtree', x: 67 }, { t: 'deadtree', x: 71 }, { t: 'bones', x: 103 }, { t: 'cairn', x: 109 },
    ],
    motes: [['line', 13, 18, 14.6], ['arc', 18.5, 23.5, 14.4, 2.6], ['line', 31, 37, 13.6], ['arc', 42.5, 48.5, 14.4, 2.8], ['arc', 53, 59, 14.4, 3.6], ['line', 82, 86, 10.6], ['line', 111, 117, 13.6], ['line', 120, 123, 14.6]],
    spawns: [
      { kind: 'pickup', what: 'wood', x: 25 }, { kind: 'pickup', what: 'wood', x: 33, y: 15 }, { kind: 'pickup', what: 'wood', x: 41 },
      { kind: 'snare', n: 1, x: 50 },
      { kind: 'target', x: 63, y: 14.9 }, { kind: 'target', x: 67, y: 11.3 }, { kind: 'target', x: 71, y: 14.9 },
      { kind: 'snare', n: 2, x: 76 },
      { kind: 'pickup', what: 'herb', x: 84, y: 12 },
      { kind: 'wolf', x: 99 },
      { kind: 'snare', n: 3, x: 106 },
      { kind: 'stag', x: 140, spots: [140, 148, 154] },
    ],
  };

  // ---------------------------------------------------------------- Prologue: The Deep (movement only, no enemies)
  SH.ROOMS.deep = {
    id: 'deep', width: 150, height: 34, theme: 'deep',   // two storeys: the trial road above, the cells below
    start: { x: 5, y: 16 },
    shapes: [
      ['solid', 0, 2, 0, 34],
      ['solid', 0, 150, 0, 4],          // the Deep has a roof
      ['solid', 2, 24, 16, 20],         // the trial road is a shelf of rock; under it, the cells
      ['solid', 24, 31, 14, 20],        // step up, then a 3-tile gap: fall in and you are in the cells, not dead
      ['solid', 34, 41, 14, 20],        // 4-tile gap down
      ['solid', 45, 66, 16, 20],
      ['solid', 54, 61, 11, 16],        // the wall: needs a double jump
      ['ground', 76, 104, 16],          // 10-tile gap before this: jump, jump, dash
      ['thorns', 85, 88, 16],           // first thorns: 3 tiles sunk into the floor, one plain jump
      ['ground', 107, 118, 16],         // the chase
      ['ground', 118, 126, 14],
      ['ground', 130, 148, 16],
      ['thorns', 137, 140, 16],
      ['solid', 148, 150, 0, 34],
      // ---- the cells: a long low hall under the road, from the left wall to the rock at x 76
      ['ground', 2, 76, 30],
      ['oneway', 11, 16, 26], ['oneway', 47, 53, 26],                 // old galleries
      ['solid', 22, 24, 28, 30],                                       // a broken pillar to climb over
      ['oneway', 66, 69, 24], ['oneway', 70, 74, 27],                 // the way back up, in the shaft under the long jump:
      ['oneway', 71, 75, 21], ['oneway', 72, 75, 18],                 // four ledges, then the road again at x 76
    ],
    hints: [
      { x0: 2, x1: 66, text: 'The cells under the Umbra. Look around. The way back up is at the far right, past the pillar.', below: 22, until: 'd_up' },
      { x0: 66, x1: 76, text: 'Four ledges up the shaft. Jump straight up through each one.', below: 17 },
      { x0: 3, x1: 21, text: 'The Weighing: stand at an altar and press {CHOOSE} to give the dark that memory. Any one will do. Which one is yours to decide.', flag: 'asked', until: 'riddle', above: 20 },
      { x0: 21, x1: 31, text: 'Hold {JUMP} to jump higher; tap it for a small hop. Miss a jump here and you land in the cells below, unhurt.', above: 20 },
      { x0: 47, x1: 55, text: 'Press {JUMP} again in the air to jump a second time.', above: 20 },
      { x0: 61, x1: 67, text: 'Dash with {DASH}. Jump, jump again at the top, then dash across.', above: 20 },
      { x0: 44, x1: 52, text: 'Someone is standing in the dark. {TALK} if you want to.', until: 'd_caelum', above: 20 },
      { x0: 76, x1: 80, text: 'Rowan. {TALK} to him through the bars.', until: 'd_rowan' },
      { x0: 80, x1: 85, text: 'Black glass cuts. Jump over it. Her glasslings are waiting on the far side.' },
      { x0: 86, x1: 92, text: 'The Eclipse\'s glasslings. Break them with {ATTACK}. They glow before they lunge: step back, then cut.', until: 'maze' },
      { x0: 88, x1: 94, text: 'The last trial is just ahead, and there is no way back. {LEFT} Starlight still behind you.', until: 'maze', motesLeft: true },
      { x0: 94, x1: 104, text: 'RUN. Keep moving right and jump the gaps.' },
    ],
    triggers: [
      { x: 5, script: 'deep_start' },
      { x: 50, script: 'deep_wall', above: 17 },
      { x: 62, script: 'deep_dash', above: 17 },
      { x: 2, script: 'deep_under', below: 24 },
      { x: 80, script: 'deep_thorns' },
      { x: 94, script: 'deep_chase' },
      { x: 143, script: 'deep_end' },
    ],
    lanterns: [{ x: 4, lit: true, from: 6 }, { x: 47, from: 6 }, { x: 79, from: 6 }, { x: 93, from: 6 }, { x: 40, from: 22 }],
    npcs: [{ id: 'caelum', x: 49, from: 6, optional: 'deep_caelum' }, { id: 'rowan', x: 77.6, from: 6, optional: 'deep_rowan' }],   // from: look for the floor below the roof
    props: [
      { t: 'cage', x: 77.6, from: 6 }, { t: 'cage', x: 9, from: 22 }, { t: 'cage', x: 17, from: 22 }, { t: 'cage', x: 31, from: 22 }, { t: 'cage', x: 56, from: 22 },
      { t: 'bones', x: 9, from: 22 }, { t: 'bones', x: 31, from: 22 }, { t: 'bones', x: 62, from: 22 }, { t: 'shroom', x: 14, from: 22 }, { t: 'shroom', x: 36, from: 22 }, { t: 'shroom', x: 52, from: 22 }, { t: 'shroom', x: 68, from: 22 },
      { t: 'bones', x: 10 }, { t: 'bones', x: 38 }, { t: 'bones', x: 58 }, { t: 'bones', x: 90 }, { t: 'bones', x: 112 }, { t: 'bones', x: 133 },
      { t: 'shroom', x: 16 }, { t: 'shroom', x: 28 }, { t: 'shroom', x: 47.5 }, { t: 'shroom', x: 63 }, { t: 'shroom', x: 78 }, { t: 'shroom', x: 100 }, { t: 'shroom', x: 122 }, { t: 'shroom', x: 141 },
      { t: 'chain', x: 12, len: 5 }, { t: 'chain', x: 36, len: 3 }, { t: 'chain', x: 70, len: 6 }, { t: 'chain', x: 96, len: 4 }, { t: 'chain', x: 128, len: 3 },
      { t: 'stal', x: 20, len: 3 }, { t: 'stal', x: 44, len: 2 }, { t: 'stal', x: 72, len: 4 }, { t: 'stal', x: 86, len: 2 }, { t: 'stal', x: 110, len: 3 }, { t: 'stal', x: 140, len: 2 },
    ],
    motes: [['line', 9, 20, 14.6], ['arc', 30, 35, 12.4, 2.4], ['arc', 40, 46, 12.6, 2.4], ['col', 52.6, 14.4, 10.6], ['line', 55, 60, 9.6], ['line', 67, 75, 10.6],
      ['arc', 84, 89, 14.4, 2.6], ['line', 97, 103, 14.6], ['arc', 103.5, 107.5, 14.4, 2.6], ['line', 109, 116, 14.6], ['arc', 125.5, 130.5, 12.6, 2.2], ['arc', 136, 141, 14.4, 2.6],
      ['line', 4, 8, 28.6], ['line', 11.5, 15.5, 24.6], ['line', 26, 36, 28.6], ['line', 47.5, 52.5, 24.6], ['line', 55, 64, 28.6], ['col', 73.5, 25.6, 16.6]],
    exitLight: 145,
    chase: { from: 94, wyrmX: 80, speed: 2.7 },
    gates: [{ id: 'riddlegate', x: 21, top: 6 }],
    spawns: [{ kind: 'altar', what: 'voice', x: 9, y: 16 }, { kind: 'altar', what: 'paint', x: 13, y: 16 }, { kind: 'altar', what: 'laugh', x: 17, y: 16 },
      { kind: 'thornSprite', x: 89.6, y: 16, respawn: false }, { kind: 'thornSprite', x: 92.2, y: 16, respawn: false },
      { kind: 'thornSprite', x: 28, y: 30, respawn: false }, { kind: 'thornSprite', x: 50, y: 30, respawn: false }, { kind: 'thornSprite', x: 60, y: 30, respawn: false },
      { kind: 'pickup', what: 'pack', x: 4.5, y: 30 }, { kind: 'pickup', what: 'tally', x: 19.5, y: 30 }],   // the Eclipse's glasslings: the first things Wren ever breaks
  };

  // ---------------------------------------------------------------- Chapter 1: Ashes (walk, talk, first mural, no enemies)
  SH.ROOMS.ashes = {
    id: 'ashes', width: 122, height: 20, theme: 'dusk', music: 'city',
    start: { x: 4, y: 16 },
    cityFrom: 50,                       // Starhaven's houses begin here
    cityGlowX: 70,
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 22, 16],
      ['ground', 22, 30, 15],
      ['ground', 30, 46, 14],           // the overlook
      ['ground', 46, 122, 16],
      ['oneway', 94, 97, 14],           // stacked crates,
      ['oneway', 97, 101, 12],          // a balcony,
      ['oneway', 101, 104, 10],         // and the eave, level with the roof: three easy steps up
      ['oneway', 86, 90, 12],           // an awning: something is sitting on it
      ['oneway', 57, 60, 13], ['oneway', 63, 66, 11],   // balconies, each with a dark street lamp to light
      ['oneway', 76, 79, 13], ['oneway', 80, 83, 10],
      ['solid', 104, 118, 10, 16],      // the Rooftop House
      ['solid', 118, 122, 0, 20],
    ],
    hints: [
      { x0: 3, x1: 14, text: 'Caelum will meet you up the road.' },
      { x0: 90, x1: 104, text: 'Crates, balcony, eave: three jumps up to the roof.', flag: 'painted' },
      { x0: 54, x1: 68, text: 'The street lamps are dark. Climb the balconies and touch each lamp to light it. Four on this street.', flag: 'arrive', until: 'lamps4' },
      { x0: 75, x1: 85, text: 'Two more lamps up on these balconies.', flag: 'arrive', until: 'lamps4' },
    ],
    triggers: [
      { x: 4, script: 'ashes_start' },
      { x: 39, script: 'ashes_overlook' },
      { x: 55, script: 'ashes_gate' },
      { x: 109.5, above: 10, script: 'ashes_roof', flag: 'painted' },
    ],
    props: [
      { t: 'bush', x: 6 }, { t: 'bush', x: 15 }, { t: 'bush', x: 27 }, { t: 'pine', x: 12 }, { t: 'pine', x: 20 }, { t: 'pine', x: 35 }, { t: 'pine', x: 44 },
      { t: 'banner', x: 56 }, { t: 'banner', x: 67, c: '#7a2a4a' }, { t: 'banner', x: 88 }, { t: 'crate', x: 60 }, { t: 'crate', x: 84.6 }, { t: 'barrel', x: 63 }, { t: 'barrel', x: 92 },
    ],
    motes: [['line', 11, 20, 14.6], ['line', 23, 29, 13.6], ['line', 32, 38, 12.6], ['line', 58, 67, 14.6], ['line', 78, 96, 14.6], ['line', 97.5, 100.5, 10.6], ['line', 105, 108, 8.6]],
    mural: { x: 70, w: 5, needs: 'arrive', flag: 'painted', script: 'ashes_painted', frames: 80 },
    arch: 52,
    house: { x0: 104, x1: 118, top: 10 },
    lanterns: [{ x: 3, lit: true }],
    npcs: [{ id: 'caelum', x: 8 }, { id: 'mirelle', x: 62, optional: 'ashes_mirelle' }],
    gates: [], spawns: [{ kind: 'pickup', what: 'cat', x: 88, y: 12 },
      { kind: 'pickup', what: 'lamp', x: 58.5, y: 13 }, { kind: 'pickup', what: 'lamp', x: 64.5, y: 11 }, { kind: 'pickup', what: 'lamp', x: 77.5, y: 13 }, { kind: 'pickup', what: 'lamp', x: 81.5, y: 10 }],
  };

  // ---------------------------------------------------------------- Chapter 2: The Five (daggers, pogo, first enemies)
  SH.ROOMS.ring = {
    id: 'ring', width: 118, height: 20, theme: 'city',
    zones: [{ x: 0, theme: 'city' }, { x: 66, theme: 'thornwood' }],
    start: { x: 5, y: 16 },
    cityGlowX: 30,
    cityFrom: 3, cityTo: 36, cityLight: 0.75,  // the Training Ring sits on a lit Starhaven street
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 41, 16],
      ['ground', 41, 60, 16],           // Bram's thorn pit
      ['thorns', 42, 59, 16],             // sunk into the floor: you fall in, you cannot walk into them
      ['oneway', 47, 49, 14],            // somewhere to land between buds
      ['oneway', 52, 54, 14],
      ['ground', 60, 118, 16],
      ['oneway', 88, 94, 12],
      ['solid', 116, 118, 0, 20],        // the thornwood closes in: nothing past here
    ],
    hints: [
      { x0: 14, x1: 32, text: 'Daggers: {ATTACK}. Press it three times in a row for a combo. The third cut knocks back.', until: 'combo1' },
      { x0: 14, x1: 32, text: 'Rising strike: {UPSTRIKE}, next to the dummy.', flag: 'combo1', until: 'rise' },
      { x0: 14, x1: 32, text: 'Dash strike: {DASH} toward the dummy, then {ATTACK} while you are still moving.', flag: 'rise', until: 'lunge' },
      { x0: 14, x1: 32, text: 'Guard: stand beside the dummy, face it, and {GUARD} when it says "swinging".', flag: 'lunge', until: 'guard' },
      { x0: 26, x1: 36, text: 'Bram\'s rings are for your daggers (Wren has no bow here). Cut all three: the low one from the ground, the middle one with a rising strike ({UPSTRIKE}), the high one from a jump.', until: 'rings3' },
      { x0: 36, x1: 60, text: 'Jump onto a bud and it bounces you (for a higher bounce, strike down as you land: {DOWNSTRIKE}). Land on the planks between them and take them one at a time.', flag: 'combo', until: 'pit' },
      { x0: 61, x1: 69, text: 'Remember the four: combo, rising strike ({UPSTRIKE}), dash strike ({DASH} then {ATTACK}), and guard ({GUARD}).', flag: 'pit' },
      { x0: 69, x1: 80, text: 'Glasslings glow orange before they lunge. {DASH} through the lunge, then strike.', flag: 'pit' },
    ],
    triggers: [
      { x: 4, script: 'ring_start' },
      { x: 60, script: 'ring_pit', flag: 'combo' },
    ],
    gates: [{ id: 'pitgate', x: 38, top: 6 }, { id: 'northgate', x: 64, top: 6 }],
    lanterns: [{ x: 4, lit: true }, { x: 61 }, { x: 68 }],
    npcs: [{ id: 'bram', x: 11, optional: 'ring_bram_talk' }, { id: 'iris', x: 62.5, optional: 'iris' }],
    spawns: [
      { kind: 'dummy', x: 24 },
      // Bram's three rings: one at chest height, one that wants a rising strike, one that wants a strike from a jump
      { kind: 'target', blade: true, x: 28, y: 14.9 }, { kind: 'target', blade: true, x: 31, y: 13.2 }, { kind: 'target', blade: true, x: 34.5, y: 11.6 },
      { kind: 'pickup', what: 'plums', x: 97 },
      { kind: 'bulb', x: 45.5, y: 12.6 },
      { kind: 'bulb', x: 50.5, y: 12.4 },
      { kind: 'bulb', x: 55.5, y: 12.6 },
      { kind: 'thornSprite', x: 80, respawn: false },
      { kind: 'thornSprite', x: 91, y: 12, respawn: false },
      { kind: 'thornSprite', x: 104, respawn: false },
    ],
    props: [
      { t: 'fence', x: 13, w: 18 }, { t: 'rack', x: 7 }, { t: 'rack', x: 33 }, { t: 'banner', x: 3.5 }, { t: 'banner', x: 36, c: '#7a2a4a' }, { t: 'crate', x: 9.5 }, { t: 'barrel', x: 30 },
      { t: 'bush', x: 70 }, { t: 'bush', x: 85 }, { t: 'bush', x: 99 }, { t: 'bush', x: 110 }, { t: 'deadtree', x: 76 }, { t: 'deadtree', x: 87 }, { t: 'deadtree', x: 102 }, { t: 'deadtree', x: 112 }, { t: 'cairn', x: 107 }, { t: 'bones', x: 82 }, { t: 'bones', x: 95 }, { t: 'boulder', x: 113.5, w: 2, h: 2 },
    ],
    motes: [['line', 14, 20, 14.6], ['pt', 45.5, 10.6], ['pt', 50.5, 10.4], ['pt', 55.5, 10.6], ['line', 70, 76, 14.6], ['line', 89, 93, 10.6], ['line', 96, 101, 14.6]],
    dummyCombo: 'ring_combo',          // landing a full 3-hit combo on the dummy runs this
  };

  // ---------------------------------------------------------------- Chapter 3: First Light (Flame, wyrmlings, the Old Wyrm)
  SH.ROOMS.mountain = {
    id: 'mountain', width: 164, height: 20, theme: 'city', music: 'mountain',
    zones: [{ x: 0, theme: 'city' }, { x: 40, theme: 'mountain' }],
    start: { x: 3, y: 16 },
    cityFrom: 3, cityTo: 30, cityLight: 0.8, cityGlowX: 20,
    arena: [119 * 24 + 40, 161 * 24 - 40],   // where the Old Wyrm may land a leap
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 48, 16],            // the Library courtyard, then the foot of the mountain road
      ['oneway', 19, 25, 12],           // a ledge with the third brazier
      ['ground', 48, 56, 14],
      ['ground', 56, 64, 12],
      ['ground', 68, 90, 12],           // gap 64..68; the first wyrmling's ledge
      ['ground', 90, 117, 14],
      ['oneway', 95, 100, 10],          // somewhere to hop up out of a charge
      ['ground', 117, 162, 14],         // the Old Wyrm's hollow
      ['oneway', 126, 131, 10],         // two ledges in the hollow: out of reach of a charge and the frost,
      ['oneway', 139, 144, 10],         // but stay too long and the roof comes down
      ['solid', 162, 164, 0, 20],
    ],
    props: [
      { t: 'banner', x: 5.5 }, { t: 'banner', x: 28, c: '#7a2a4a' }, { t: 'crate', x: 26 }, { t: 'barrel', x: 31 },
      { t: 'deadtree', x: 42 }, { t: 'deadtree', x: 60 }, { t: 'deadtree', x: 94 }, { t: 'cairn', x: 51 }, { t: 'cairn', x: 73 }, { t: 'cairn', x: 101 },
      { t: 'drift', x: 46 }, { t: 'drift', x: 58 }, { t: 'drift', x: 78 }, { t: 'drift', x: 104 }, { t: 'drift', x: 130 },
      { t: 'bones', x: 87 }, { t: 'bones', x: 110 }, { t: 'bones', x: 124 }, { t: 'bones', x: 136 }, { t: 'bones', x: 146 }, { t: 'bones', x: 156 },
    ],
    motes: [['line', 20, 24, 10.6], ['line', 37, 46, 14.6], ['line', 49, 55, 12.6], ['line', 57, 63, 10.6], ['arc', 63.5, 68.5, 10.4, 2.4], ['line', 70, 76, 10.6], ['line', 96, 99, 8.6], ['line', 108, 114, 12.6]],
    thornWalls: [{ id: 'road', x: 34, w: 2, top: 6 }],
    hints: [
      { x0: 6, x1: 30, text: 'Call the flame with {GIFT}. Each flame costs one moon (beside your hearts); they refill over time, faster when your daggers land.', flag: 'giftgot', until: 'flame' },
      { x0: 6, x1: 27, text: 'Hold {GIFT} and let go for a flame wave: it costs two moons, hits twice as hard and burns through everything in its path.', flag: 'flame' },
      { x0: 27, x1: 34, text: 'Eclipse glass: steel won\'t cut it. Melt it with {GIFT}.', flag: 'flame' },
      { x0: 110, x1: 117, text: 'The Old Wyrm\'s hollow is ahead, and there is no way back out. {LEFT} Starlight still behind you.', flag: 'wall', until: 'bossmet', motesLeft: true },
      { x0: 66, x1: 82, text: 'Wyrmlings charge in a straight line, head armored. Jump over the charge, then strike from behind while it\'s dazed.', flag: 'wall' },
    ],
    triggers: [
      { x: 4, script: 'lib_start' },
      { x: 40, script: 'mtn_road', flag: 'wall' },
      { x: 120, script: 'mtn_wyrm', flag: 'wall' },
    ],
    gates: [{ id: 'arenagate', x: 117, top: 6, open: true }],
    lanterns: [{ x: 4, lit: true }, { x: 46 }, { x: 69 }, { x: 119 }],   // the last one is inside the hollow, so a knockout keeps you in the fight
    npcs: [{ id: 'thane', x: 8 }, { id: 'caelum', x: 11 }],
    spawns: [
      { kind: 'pickup', what: 'page', x: 60, y: 12 },
      { kind: 'thornSprite', x: 43, respawn: false }, { kind: 'thornSprite', x: 52, y: 14, respawn: false }, { kind: 'thornSprite', x: 74, y: 12, respawn: false }, { kind: 'thornSprite', x: 88, respawn: false },
      { kind: 'brazier', x: 13 },
      { kind: 'brazier', x: 17 },
      { kind: 'brazier', x: 22, y: 12 },
      { kind: 'wyrmling', x: 82, y: 12 },
      { kind: 'wyrmling', x: 106 },
      { kind: 'oldWyrm', x: 150 },
    ],
  };

  // ---------------------------------------------------------------- Chapter 4: The Spy in the Library (the fae bow, winged spies, the Spymaster's Shadow)
  // Courtyard (outdoors), then the stacks (galleries three rows apart, a single jump each), then the reading hall (the boss).
  SH.ROOMS.library = {
    id: 'library', width: 156, height: 24, theme: 'library', music: 'city',
    zones: [{ x: 0, theme: 'city' }, { x: 36, theme: 'library' }],
    start: { x: 3, y: 20 },
    shadowArena: [120, 154, 10, 20],
    camLift: 0.2,
    shapes: [
      ['solid', 0, 2, 0, 24],
      ['ground', 2, 156, 20],
      ['solid', 35, 37, 0, 15],          // the Library's front wall, above its great door
      ['solid', 37, 156, 0, 4],          // its roof
      ['oneway', 12, 18, 16], ['oneway', 24, 30, 15],   // the courtyard's colonnade roofs: somewhere to shoot from
      // the stacks
      ['oneway', 40, 50, 17], ['oneway', 60, 72, 17], ['oneway', 84, 96, 17], ['oneway', 104, 114, 17],
      ['oneway', 46, 56, 14], ['oneway', 66, 78, 14], ['oneway', 90, 102, 14],
      ['oneway', 52, 62, 11], ['oneway', 74, 86, 11], ['oneway', 98, 108, 11],
      ['oneway', 60, 70, 8], ['oneway', 82, 92, 8],
      // the reading hall: two side galleries and a high one in the middle
      ['oneway', 123, 129, 15], ['oneway', 145, 151, 15], ['oneway', 132, 142, 11],
      ['solid', 154, 156, 0, 24],
    ],
    hints: [
      { x0: 2, x1: 36, text: 'An arrow pins a spy\'s wing and it falls. Cut it with {ATTACK} while it is down, before it gets up.', flag: 'pinned1', until: 'sky' },
      { x0: 2, x1: 36, text: 'Spies fly above your daggers. Shoot with {BOW}: it aims at the nearest flyer in front of you. Hold up as you shoot to aim high.', flag: 'bow4', until: 'sky' },
      { x0: 37, x1: 118, text: 'The spies go for the open books on the lecterns. Shoot one off before it carries a page away. Climb the galleries for the high one.', flag: 'stacks4', until: 'stacks_done' },
      { x0: 112, x1: 118, text: 'The reading hall is ahead, and there is no way back out. {LEFT} Starlight still behind you.', flag: 'stacks_done', until: 'shadowmet', motesLeft: true },
      { x0: 37, x1: 112, text: 'The reading lamps are dark. Climb up and touch each one to light it: four in the stacks.', flag: 'stacks_done', until: 'lamps4' },
    ],
    triggers: [
      { x: 4, script: 'lib4_start' },
      { x: 122, script: 'lib4_shadow', flag: 'stacks_done' },
    ],
    gates: [{ id: 'libdoor', x: 36, top: 15 }, { id: 'stackgate', x: 118, top: 4 }],
    lanterns: [{ x: 4, lit: true }, { x: 39, from: 18 }, { x: 120, from: 18 }],   // the last is inside the hall, so a knockout keeps you in the fight
    npcs: [{ id: 'thane', x: 8 }, { id: 'caelum', x: 11 }],
    lampScript: 'lib4_lamps',
    props: [
      { t: 'banner', x: 3.5 }, { t: 'banner', x: 33, c: '#7a2a4a' }, { t: 'barrel', x: 20 }, { t: 'crate', x: 31.5 }, { t: 'bush', x: 6 }, { t: 'bush', x: 22.5 },
      { t: 'bookcase', x: 43, h: 2.4, from: 18 }, { t: 'table', x: 52, from: 18 }, { t: 'bookcase', x: 58, h: 2.4, from: 18 }, { t: 'globe', x: 64, from: 18 },
      { t: 'bookcase', x: 70, h: 2.4, from: 18 }, { t: 'table', x: 79, from: 18 }, { t: 'bookcase', x: 88, h: 2.4, from: 18 }, { t: 'table', x: 96, from: 18 },
      { t: 'bookcase', x: 109, h: 2.4, from: 18 }, { t: 'globe', x: 115, from: 18 },
      { t: 'bookcase', x: 122.5, h: 6, w: 2, from: 18 }, { t: 'table', x: 137, from: 18 }, { t: 'bookcase', x: 152, h: 6, w: 2, from: 18 }, { t: 'banner', x: 130, from: 18 }, { t: 'banner', x: 144, c: '#7a2a4a', from: 18 },
    ],
    motes: [['line', 9, 16, 18.6], ['line', 13, 17, 14.6], ['line', 25, 29, 13.6], ['line', 41, 49, 15.6], ['line', 47, 55, 12.6], ['line', 53, 61, 9.6], ['line', 61, 69, 6.6],
      ['line', 75, 85, 9.6], ['line', 83, 91, 6.6], ['line', 91, 101, 12.6], ['line', 99, 107, 9.6], ['line', 105, 113, 15.6], ['line', 124, 128, 13.6], ['line', 146, 150, 13.6]],
    spawns: [
      { kind: 'spy', wave: 1, x: 16, y: 15 }, { kind: 'spy', wave: 1, x: 27, y: 14 },
      { kind: 'spy', wave: 2, x: 58, y: 14 }, { kind: 'spy', wave: 2, x: 88, y: 13 }, { kind: 'spy', wave: 2, x: 106, y: 14 },
      { kind: 'lectern', x: 44, y: 17 }, { kind: 'lectern', x: 80, y: 11 }, { kind: 'lectern', x: 100, y: 20 },
      { kind: 'pickup', what: 'lamp', x: 70, y: 14 }, { kind: 'pickup', what: 'lamp', x: 64, y: 8 }, { kind: 'pickup', what: 'lamp', x: 104, y: 11 }, { kind: 'pickup', what: 'lamp', x: 90, y: 8 },
      { kind: 'shadow', x: 140, y: 10 },
    ],
  };

  // Tile codes
  SH.T_EMPTY = 0; SH.T_SOLID = 1; SH.T_ONEWAY = 2; SH.T_THORNS = 3;

  SH.buildRoom = function (def) {
    const w = def.width, h = def.height;
    const tiles = new Uint8Array(w * h);
    const set = (x, y, v) => { if (x >= 0 && y >= 0 && x < w && y < h) tiles[y * w + x] = v; };
    for (const s of def.shapes) {
      const [kind, x0, x1] = s;
      if (kind === 'ground') { for (let x = x0; x < x1; x++) for (let y = s[3]; y < h; y++) set(x, y, SH.T_SOLID); }
      else if (kind === 'solid') { for (let x = x0; x < x1; x++) for (let y = s[3]; y < s[4]; y++) set(x, y, SH.T_SOLID); }
      else if (kind === 'oneway') { for (let x = x0; x < x1; x++) set(x, s[3], SH.T_ONEWAY); }
      else if (kind === 'thorns') { for (let x = x0; x < x1; x++) set(x, s[3], SH.T_THORNS); }
    }
    // Starlight motes: ['line', x0, x1, row], ['arc', x0, x1, row, lift] (over a jump), ['col', x, row0, row1], ['pt', x, row]
    const motes = [], TS = SH.TILE, mote = (x, y) => motes.push({ x: x * TS, y: y * TS, got: false });
    for (const m of def.motes || []) {
      if (m[0] === 'line') for (let x = m[1]; x <= m[2]; x += 1.5) mote(x, m[3]);
      else if (m[0] === 'arc') { const n = Math.max(3, Math.round((m[2] - m[1]) / 1.2)); for (let i = 0; i <= n; i++) { const k = i / n; mote(m[1] + (m[2] - m[1]) * k, m[3] - Math.sin(k * Math.PI) * m[4]); } }
      else if (m[0] === 'col') for (let y = m[2]; y >= m[3]; y -= 1.3) mote(m[1], y);
      else if (m[0] === 'pt') mote(m[1], m[2]);
    }
    const room = {
      def, w, h, tiles, motes,
      pxW: w * SH.TILE, pxH: h * SH.TILE,
      get(tx, ty) {
        if (tx < 0 || tx >= w) return SH.T_SOLID;
        if (ty < 0 || ty >= h) return SH.T_EMPTY;
        return tiles[ty * w + tx];
      },
      groundY(tx, ty0) {
        for (let ty = ty0 || 0; ty < h; ty++) { const t = this.get(tx, ty); if (t === SH.T_SOLID || t === SH.T_ONEWAY) return ty * SH.TILE; }
        return null;
      },
      // Gates are solid tiles that a script can remove.
      // Thorn walls are solid until burned.
      setThorns(t, solid) {
        for (let x = t.x; x < t.x + t.w; x++) for (let y = t.top; y < 16; y++) set(x, y, solid ? SH.T_SOLID : SH.T_EMPTY);
        t.solid = solid;
      },
      setGate(g, closed) {
        if (g.bottom == null) g.bottom = this.groundY(g.x, g.top) / SH.TILE; // measured once, while the gate is open
        for (let y = g.top; y < g.bottom; y++) set(g.x, y, closed ? SH.T_SOLID : SH.T_EMPTY);
        g.closed = closed;
      },
    };
    return room;
  };
})(window.SH = window.SH || {});
