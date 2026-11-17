// Starhaven — the Training Grove. Level data only.
// Coordinates are in tiles. x ranges are [start, end) — end is not filled.
// Each section teaches one move before it is needed. Enemies come last.
(function (SH) {
  SH.ROOMS = SH.ROOMS || {};

  SH.ROOMS.grove = {
    id: 'grove',
    name: 'The Training Grove',
    width: 204,
    height: 20,
    start: { x: 6, y: 16 },
    // Starhaven glows on the far horizon, so the goal is always in sight.
    cityGlowX: 210,

    shapes: [
      ['solid', 0, 2, 0, 20],          // left wall
      ['ground', 2, 24, 16],           // 1. move
      ['ground', 24, 31, 14],          // 2. jump: a two-tile step up...
      ['ground', 34, 41, 14],          //    ...a 3-tile gap...
      ['ground', 45, 66, 16],          //    ...and a 4-tile gap down
      ['solid', 54, 61, 11, 16],       // 3. double jump: a wall one jump can't clear
      ['ground', 76, 128, 16],         // 4. dash: a 10-tile gap (66..76)
      ['ground', 128, 148, 16],        // 6. pogo: a floor of thorns...
      ['thorns', 129, 147, 15],
      ['ground', 148, 202, 16],        // 7. thorn sprites
      ['oneway', 168, 174, 12],
      ['solid', 202, 204, 0, 20],      // right wall
    ],

    // Signs. Text tokens like {JUMP} become the right button for keyboard, touch or gamepad.
    signs: [
      { x: 9, id: 'move', text: 'Move with {MOVE}. Head right: the far lantern marks the end of the grove.' },
      { x: 21, id: 'jump', text: 'Jump with {JUMP}. Hold it to jump high, tap it for a small hop.' },
      { x: 50, id: 'double', text: 'Your fae body can jump twice. Press {JUMP} again in the air to clear the wall.' },
      { x: 63, id: 'dash', text: 'Dash with {DASH}. It works in the air too. This gap takes all three: jump, jump again, then dash.' },
      { x: 96, id: 'dagger', text: 'Daggers: {ATTACK}. Press it three times in a row for a combo. The third cut knocks back.' },
      { x: 124, id: 'pogo', text: 'Thorns hurt. In the air, hold {DOWN} and press {ATTACK} to strike downward and bounce off the thorn buds. Each bounce gives back your second jump and your dash.' },
      { x: 152, id: 'sprites', text: 'Thorn sprites ahead. They glow orange before they lunge. Dash through the lunge, then strike.' },
    ],

    lanterns: [
      { x: 5, id: 'l_start', lit: true },
      { x: 47, id: 'l_double' },
      { x: 79, id: 'l_dash' },
      { x: 127, id: 'l_pogo' },
      { x: 150, id: 'l_sprites' },
      { x: 196, id: 'l_end', end: true },
    ],

    spawns: [
      { kind: 'dummy', x: 106 },
      { kind: 'bulb', x: 132.5, y: 12.6 },
      { kind: 'bulb', x: 137.5, y: 12.4 },
      { kind: 'bulb', x: 142.5, y: 12.6 },
      { kind: 'thornSprite', x: 163 },
      { kind: 'thornSprite', x: 171, y: 12 },
      { kind: 'thornSprite', x: 183 },
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
    const room = {
      def, w, h, tiles,
      pxW: w * SH.TILE, pxH: h * SH.TILE,
      get(tx, ty) {
        if (tx < 0 || tx >= w) return SH.T_SOLID;      // side edges are walls
        if (ty < 0 || ty >= h) return SH.T_EMPTY;      // top is open, bottom is a pit
        return tiles[ty * w + tx];
      },
      // Top of the ground (in px) under tile column tx, searching down from row ty0.
      groundY(tx, ty0) {
        for (let ty = ty0 || 0; ty < h; ty++) { const t = this.get(tx, ty); if (t === SH.T_SOLID || t === SH.T_ONEWAY) return ty * SH.TILE; }
        return null;
      },
    };
    return room;
  };
})(window.SH = window.SH || {});
