// Starhaven — rooms (levels). Data only. Coordinates are tiles; x ranges are [start, end).
// Ground top is row 16 unless a shape says otherwise. 20 rows tall.
//   hints:    control tips shown while Wren stands between x0 and x1 (optionally only once a story flag is set)
//   triggers: story scripts that start when Wren reaches x (once each)
//   npcs:     people. Story beats start on their own; optional people can be talked to with TALK.
//   gates:    wooden gates that block the way until a script opens them
(function (SH) {
  SH.ROOMS = {};

  // ---------------------------------------------------------------- Prologue: The Deep (movement only, no enemies)
  SH.ROOMS.deep = {
    id: 'deep', width: 150, height: 20, theme: 'deep',
    start: { x: 5, y: 16 },
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['solid', 0, 150, 0, 4],          // the Deep has a roof
      ['ground', 2, 24, 16],
      ['ground', 24, 31, 14],           // step up, then a 3-tile gap
      ['ground', 34, 41, 14],           // 4-tile gap down
      ['ground', 45, 66, 16],
      ['solid', 54, 61, 11, 16],        // the wall: needs a double jump
      ['ground', 76, 104, 16],          // 10-tile gap before this: jump, jump, dash
      ['thorns', 85, 88, 15],           // first thorns: 3 tiles, one plain jump
      ['ground', 107, 118, 16],         // the chase
      ['ground', 118, 126, 14],
      ['ground', 130, 148, 16],
      ['thorns', 137, 140, 15],
      ['solid', 148, 150, 0, 20],
    ],
    hints: [
      { x0: 3, x1: 17, text: 'Move with {MOVE}.' },
      { x0: 17, x1: 31, text: 'Jump with {JUMP}. Hold it to jump higher, tap it for a small hop.' },
      { x0: 47, x1: 55, text: 'Press {JUMP} again in the air to jump a second time.' },
      { x0: 61, x1: 67, text: 'Dash with {DASH}. Jump, jump again at the top, then dash across.' },
      { x0: 80, x1: 85, text: 'Thorns hurt. Jump over them.' },
      { x0: 94, x1: 104, text: 'RUN. Keep moving right and jump the gaps.' },
    ],
    triggers: [
      { x: 5, script: 'deep_start' },
      { x: 50, script: 'deep_wall' },
      { x: 62, script: 'deep_dash' },
      { x: 80, script: 'deep_thorns' },
      { x: 94, script: 'deep_chase' },
      { x: 143, script: 'deep_end' },
    ],
    lanterns: [{ x: 4, lit: true }, { x: 47 }, { x: 79 }, { x: 93 }],
    exitLight: 145,
    chase: { from: 94, wyrmX: 80, speed: 2.7 },
    npcs: [], gates: [], spawns: [],
  };

  // ---------------------------------------------------------------- Chapter 1: Ashes (walk, talk, first mural, no enemies)
  SH.ROOMS.ashes = {
    id: 'ashes', width: 122, height: 20, theme: 'dusk',
    start: { x: 4, y: 16 },
    cityFrom: 50,                       // Starhaven's houses begin here
    cityGlowX: 70,
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 22, 16],
      ['ground', 22, 30, 15],
      ['ground', 30, 46, 14],           // the overlook
      ['ground', 46, 122, 16],
      ['oneway', 99, 104, 13],          // ledge up to the roof
      ['solid', 104, 118, 10, 16],      // the Rooftop House
      ['solid', 118, 122, 0, 20],
    ],
    hints: [
      { x0: 3, x1: 14, text: 'Move with {MOVE}. Caelum will meet you up the road.' },
      { x0: 19, x1: 31, text: 'Jump with {JUMP}.' },
      { x0: 94, x1: 104, text: 'Jump up the ledge to reach the roof.', flag: 'painted' },
    ],
    triggers: [
      { x: 4, script: 'ashes_start' },
      { x: 39, script: 'ashes_overlook' },
      { x: 55, script: 'ashes_gate' },
      { x: 106, above: 10, script: 'ashes_roof', flag: 'painted' },
    ],
    mural: { x: 70, w: 5, needs: 'arrive', flag: 'painted', script: 'ashes_painted', frames: 80 },
    arch: 52,
    house: { x0: 104, x1: 118, top: 10 },
    lanterns: [{ x: 3, lit: true }],
    npcs: [{ id: 'caelum', x: 8 }],
    gates: [], spawns: [],
  };

  // ---------------------------------------------------------------- Chapter 2: The Five (daggers, pogo, first enemies)
  SH.ROOMS.ring = {
    id: 'ring', width: 150, height: 20, theme: 'city',
    zones: [{ x: 0, theme: 'city' }, { x: 66, theme: 'thornwood' }],
    start: { x: 5, y: 16 },
    cityGlowX: 30,
    cityFrom: 3, cityTo: 36, cityLight: 0.75,  // the Training Ring sits on a lit Starhaven street
    shapes: [
      ['solid', 0, 2, 0, 20],
      ['ground', 2, 41, 16],
      ['ground', 41, 60, 16],           // Bram's thorn pit
      ['thorns', 42, 59, 15],
      ['ground', 60, 148, 16],
      ['oneway', 88, 94, 12],
      ['solid', 148, 150, 0, 20],
    ],
    hints: [
      { x0: 14, x1: 32, text: 'Daggers: {ATTACK}. Press it three times in a row for a combo. The third cut knocks back.' },
      { x0: 36, x1: 44, text: 'Jump toward a bud. While you are above it, hold {DOWN} and press {ATTACK} to strike down and bounce.', flag: 'combo' },
      { x0: 69, x1: 80, text: 'Thorn sprites glow orange before they lunge. {DASH} through the lunge, then strike.', flag: 'pit' },
    ],
    triggers: [
      { x: 4, script: 'ring_start' },
      { x: 60, script: 'ring_pit', flag: 'combo' },
    ],
    gates: [{ id: 'pitgate', x: 38, top: 6 }, { id: 'northgate', x: 64, top: 6 }],
    lanterns: [{ x: 4, lit: true }, { x: 61 }, { x: 68 }],
    npcs: [{ id: 'bram', x: 11 }, { id: 'iris', x: 62.5, optional: 'iris' }],
    spawns: [
      { kind: 'dummy', x: 24 },
      { kind: 'bulb', x: 45.5, y: 12.6 },
      { kind: 'bulb', x: 50.5, y: 12.4 },
      { kind: 'bulb', x: 55.5, y: 12.6 },
      { kind: 'thornSprite', x: 80, respawn: false },
      { kind: 'thornSprite', x: 91, y: 12, respawn: false },
      { kind: 'thornSprite', x: 104, respawn: false },
    ],
    dummyCombo: 'ring_combo',          // landing a full 3-hit combo on the dummy runs this
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
    const room = {
      def, w, h, tiles,
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
      setGate(g, closed) {
        if (g.bottom == null) g.bottom = this.groundY(g.x, g.top) / SH.TILE; // measured once, while the gate is open
        for (let y = g.top; y < g.bottom; y++) set(g.x, y, closed ? SH.T_SOLID : SH.T_EMPTY);
        g.closed = closed;
      },
    };
    return room;
  };
})(window.SH = window.SH || {});
