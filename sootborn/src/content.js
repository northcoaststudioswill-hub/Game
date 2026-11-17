// ============================================================
// content/ — maps, cast, dialogue, journal (declarative data + small script fns)
// Story logic only touches G (state) through helpers; never the DOM.
// ============================================================
const F = k => !!G.flags[k];
const setF = k => { G.flags[k] = 1; };
const fury = n => { G.flags.fury = (G.flags.fury || 0) + n; };
const say = (s, t) => ({ s, t });
const narr = t => ({ s: 'narr', t });
const fx = fn => ({ fx: fn });
const TEND = { caretaker: 'Heart', tinkerer: 'Pride', seeker: 'Hunger' };
const byTend = o => o[G.tendency] ? [narr(o[G.tendency])] : [];

function buildMap(def) {
  const grid = [];
  for (let y = 0; y < def.h; y++) { const row = []; for (let x = 0; x < def.w; x++) row.push(y < 2 || y === def.h - 1 || x === 0 || x === def.w - 1 ? '#' : '.'); grid.push(row); }
  for (const s of def.set || []) { const [x, y, w, h, ch] = s.length === 3 ? [s[0], s[1], 1, 1, s[2]] : s; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) grid[y + j][x + i] = ch; }
  for (const p of def.props) if (p.block) for (const [bx, by] of p.block) grid[by][bx] = 'x';
  return Object.assign({ grid, seed: def.w * 7 + def.h }, def);
}
const tc = (x, y) => ({ x: x * 16 + 8, y: y * 16 + 12 });
const blk = (x, y, w, h) => { const a = []; for (let j = 0; j < (h || 1); j++) for (let i = 0; i < (w || 1); i++) a.push([x + i, y + j]); return a; };

let SQUARE_DEF;
const MAPS = {
  apt: buildMap({
    name: 'Home — Tier 6, Row K', w: 12, h: 9, theme: 'home', music: 'home', dark: 'rgba(14,8,12,.42)',
    set: [[5, 8, 'D'], [6, 8, 'D']],
    props: [{ t: 'rug', x: 4, y: 4, w: 3, h: 2 }, { t: 'mural', x: 2, y: 1 }, { t: 'shelf', x: 6, y: 1 }, { t: 'radio', x: 8, y: 1 },
      { t: 'bed', x: 1, y: 2, block: blk(1, 2, 2, 2) }, { t: 'table', x: 8, y: 3, block: blk(8, 3, 2, 1) },
      { t: 'suns', x: 4, y: 1 }, { t: 'suns', x: 5, y: 1 }, { t: 'tools', x: 10, y: 1 }, { t: 'cot', x: 10, y: 6, block: blk(10, 6) }, { t: 'puddle', x: 2, y: 6 }],
    lights: [{ x: 152, y: 56, r: 84, c: '#ffb060' }, { x: 96, y: 136, r: 36, c: '#ff9040' }, { x: 136, y: 24, r: 26, c: '#ffb35a' }],
    hot: [{ id: 'mural', tiles: blk(2, 1, 2) }, { id: 'shelf', tiles: blk(6, 1) }, { id: 'radio', tiles: blk(8, 1) }, { id: 'bed', tiles: blk(1, 2, 2, 2) }, { id: 'worksheet', tiles: blk(8, 3, 2) }, { id: 'suns', tiles: blk(4, 1, 2) }, { id: 'tools', tiles: blk(10, 1) }, { id: 'cot', tiles: blk(10, 6) }],
    exits: [{ tiles: [[5, 8], [6, 8]], to: 'square', spawn: { ...tc(3, 2), dir: 0 } }]
  }),
  square: buildMap(SQUARE_DEF = {
    name: 'Ashgate Square', w: 28, h: 16, theme: 'city', music: 'home', dark: 'rgba(10,6,14,.56)',
    set: [[3, 1, 'D'], [27, 7, 'E'], [27, 8, 'E'], [21, 1, 'D'], [10, 6, 7, 5, ',']],
    overhead: [[1, 4.2, 9, 3.6], [17, 3.4, 27, 4.0], [3, 13.2, 12, 12.6]], screens: [[15, 1, 3]],
    props: [{ t: 'pipes', x: 1, y: 1, w: 2 }, { t: 'pipes', x: 4, y: 1, w: 3 }, { t: 'door', x: 3, y: 1 }, { t: 'board', x: 7, y: 1, w: 2 }, { t: 'pipes', x: 9, y: 1, w: 3 }, { t: 'liftgate', x: 12, y: 1 },
      { t: 'pipes', x: 14, y: 1, w: 7 }, { t: 'clinic', x: 21, y: 1 }, { t: 'pipes', x: 22, y: 1, w: 5 },
      { t: 'pillarBase', x: 13, y: 8, block: blk(13, 8) }, { t: 'lampBase', x: 7, y: 4, block: blk(7, 4) }, { t: 'lampBase', x: 19, y: 4, block: blk(19, 4) }, { t: 'lampBase', x: 9, y: 13, block: blk(9, 13) }, { t: 'lampBase', x: 22, y: 9, block: blk(22, 9) },
      { t: 'awning', x: 4, y: 10 }, { t: 'stall', x: 4, y: 12, block: blk(4, 12, 3) }, { t: 'bench', x: 16, y: 12, block: blk(16, 12, 2) }, { t: 'cart', x: 23, y: 12, block: blk(23, 12) },
      { t: 'barrel', x: 25, y: 13, block: blk(25, 13) }, { t: 'barrel', x: 26, y: 13, block: blk(26, 13) }, { t: 'barrel', x: 1, y: 13, block: blk(1, 13) },
      { t: 'screen', x: 15, y: 1, w: 3 }, { t: 'poster', x: 5, y: 1, a: 0 }, { t: 'poster', x: 9, y: 1, a: 2 }, { t: 'poster', x: 23, y: 1, a: 3 }, { t: 'poster', x: 25, y: 1, a: 1 },
      { t: 'sign', x: 3, y: 0, a: 'ROW K' }, { t: 'sign', x: 12.5, y: 0, a: 'LIFT 0' }, { t: 'sign', x: 21, y: 0, a: 'FEVER WARD' }, { t: 'sign', x: 8, y: 0, a: 'NOTICES' }, { t: 'banner', x: 11, y: 1 }, { t: 'banner', x: 14, y: 1 },
      { t: 'vent', x: 2, y: 9 }, { t: 'vent', x: 24, y: 5 }, { t: 'puddle', x: 8, y: 9 }, { t: 'puddle', x: 19, y: 10 }, { t: 'puddle', x: 4, y: 6 }, { t: 'oil', x: 21, y: 13 }, { t: 'suns', x: 11, y: 1 }],
    lights: [{ x: 216, y: 112, r: 100, c: '#ffe2b0', pillar: 1 }, { x: 120, y: 58, r: 50 }, { x: 312, y: 58, r: 50 }, { x: 152, y: 202, r: 50 }, { x: 360, y: 138, r: 50 },
      { x: 88, y: 176, r: 44, c: '#ff7a3a' }, { x: 344, y: 40, r: 36, c: '#cfe8ff' }, { x: 56, y: 30, r: 30 }, { x: 440, y: 128, r: 40, c: '#ff9040' }, { x: 264, y: 30, r: 54, c: '#7ad8ff' }],
    hot: [{ id: 'notice', tiles: blk(7, 1, 2) }, { id: 'lift0', tiles: blk(12, 1, 2) }, { id: 'clinic', tiles: blk(21, 1) }, { id: 'pillar', tiles: blk(13, 8) }, { id: 'stall', tiles: blk(4, 12, 3) },
      { id: 'bench', tiles: blk(16, 12, 2) }, { id: 'cart', tiles: blk(23, 12) }, { id: 'screen', tiles: blk(15, 1, 3) }, { id: 'poster0', tiles: blk(5, 1, 2) }, { id: 'poster2', tiles: blk(9, 1, 2) }, { id: 'poster3', tiles: blk(23, 1, 2) }, { id: 'poster1', tiles: blk(25, 1, 2) }, { id: 'vent', tiles: [[2, 9], [24, 5]] }],
    exits: [{ tiles: [[21, 1]], to: 'clinic', spawn: { x: 7 * 16 + 8, y: 7 * 16 + 8, dir: 1 } }, { tiles: [[3, 1]], to: 'apt', spawn: { x: 96, y: 7 * 16 + 8, dir: 1 } }, { tiles: [[27, 7], [27, 8]], to: 'bay', spawn: { x: 24, y: 7 * 16 + 4, dir: 3 } }]
  }),
  bay: buildMap({
    name: 'Maintenance Bay 3', w: 24, h: 14, theme: 'bay', music: 'work', dark: 'rgba(10,6,10,.5)',
    set: [[0, 6, 'E'], [0, 7, 'E'], [13, 2, 4, 2, ','], [15, 9, 8, 4, ','], [17, 1, 'D']],
    overhead: [[1, 3.0, 8, 3.4], [12, 6.2, 22, 5.8]], screens: [[6, 1, 3]],
    props: [{ t: 'pipes', x: 1, y: 1, w: 3 }, { t: 'board', x: 4, y: 1, w: 2 }, { t: 'pipes', x: 6, y: 1, w: 3 }, { t: 'valves', x: 9, y: 1 }, { t: 'pipes', x: 12, y: 1, w: 2 }, { t: 'furnace', x: 14, y: 1 },
      { t: 'pipes', x: 16, y: 1, w: 1 }, { t: 'door', x: 17, y: 1 }, { t: 'pipes', x: 18, y: 1, w: 1 }, { t: 'freight', x: 19, y: 1 }, { t: 'pipes', x: 21, y: 1, w: 2 }, { t: 'hazard', x: 19, y: 2, w: 2, h: 1 },
      { t: 'conveyor', x: 2, y: 10, w: 6, block: blk(2, 10, 6) }, { t: 'crate', x: 16, y: 10, block: blk(16, 10) }, { t: 'crate', x: 18, y: 10, block: blk(18, 10) }, { t: 'crate', x: 20, y: 10, a: 1, block: blk(20, 10) },
      { t: 'label', x: 16, y: 10, a: 'A' }, { t: 'label', x: 18, y: 10, a: 'B' }, { t: 'label', x: 20, y: 10, a: 'C' },
      { t: 'barrel', x: 22, y: 4, block: blk(22, 4) }, { t: 'barrel', x: 22, y: 5, block: blk(22, 5) }, { t: 'barrel', x: 1, y: 12, block: blk(1, 12) }, { t: 'crate', x: 2, y: 12, block: blk(2, 12) },
      { t: 'hatch', x: 11, y: 12, block: blk(11, 12) },
      { t: 'screen', x: 6, y: 1, w: 3 }, { t: 'poster', x: 1, y: 1, a: 4 }, { t: 'poster', x: 21, y: 1, a: 1 }, { t: 'relay', x: 21, y: 7, block: blk(21, 7) },
      { t: 'sign', x: 4.5, y: 0, a: 'CREW 3' }, { t: 'sign', x: 10, y: 0, a: 'BANK 7' }, { t: 'sign', x: 14.2, y: 0, a: 'HEART-FURNACE' }, { t: 'sign', x: 17.4, y: 0, a: 'FUSE C' }, { t: 'sign', x: 20, y: 0, a: 'FREIGHT 3' }, { t: 'banner', x: 13, y: 1 }, { t: 'banner', x: 16, y: 1 },
      { t: 'vent', x: 13, y: 4 }, { t: 'vent', x: 17, y: 6 }, { t: 'oil', x: 6, y: 6 }, { t: 'oil', x: 14, y: 8 }, { t: 'oil', x: 9, y: 11 }, { t: 'barrel', x: 3, y: 4, block: blk(3, 4) }, { t: 'crate', x: 13, y: 7, block: blk(13, 7) }, { t: 'crate', x: 8, y: 7, block: blk(8, 7) }],
    lights: [{ x: 240, y: 30, r: 90, c: '#ff7a30', furnace: 1 }, { x: 168, y: 34, r: 58, c: '#4fd6d0' }, { x: 80, y: 92, r: 56 }, { x: 200, y: 124, r: 56 }, { x: 304, y: 112, r: 64 },
      { x: 312, y: 34, r: 24, c: '#ff3020' }, { x: 80, y: 164, r: 40 }, { x: 120, y: 30, r: 50, c: '#7ad8ff' }],
    hot: [{ id: 'shiftboard', tiles: blk(4, 1, 2) }, { id: 'valves', tiles: blk(9, 1, 3) }, { id: 'furnace', tiles: blk(14, 1, 2) }, { id: 'freight', tiles: blk(19, 1, 2) },
      { id: 'crateA', tiles: blk(16, 10) }, { id: 'crateB', tiles: blk(18, 10) }, { id: 'crateC', tiles: blk(20, 10) }, { id: 'conveyor', tiles: blk(2, 10, 6) }, { id: 'hatch', tiles: blk(11, 12) }, { id: 'relay', tiles: blk(21, 7) }, { id: 'screen', tiles: blk(6, 1, 3) }, { id: 'poster4', tiles: blk(1, 1, 2) }, { id: 'poster1', tiles: blk(21, 1, 2) }],
    exits: [{ tiles: [[0, 6], [0, 7]], to: 'square', spawn: { x: 26 * 16 + 4, y: 8 * 16 + 4, dir: 2 } },
      { tiles: [[17, 1]], to: 'fuse', spawn: { x: 5 * 16 + 8, y: 6 * 16 + 4, dir: 1 }, when: () => F('fuseOrder'), deny: () => [narr('FUSE ROOM C. Locked. Mara has the key, and Mara has opinions about keys.'), narr("WO-116 is on tomorrow's board.")] }]
  }),
  clinic: buildMap({
    name: 'Fever Ward — Tier 6 Clinic', w: 14, h: 9, theme: 'clinic', music: 'home', dark: 'rgba(8,10,12,.4)',
    set: [[7, 8, 'D']],
    props: [{ t: 'sign', x: 9.5, y: 0, a: 'WARD ROLL' }, { t: 'suns', x: 2, y: 1 }, { t: 'suns', x: 3, y: 1 }, { t: 'suns', x: 5, y: 1 }, { t: 'fanvent', x: 7, y: 1 }, { t: 'board', x: 9, y: 1, w: 2 }, { t: 'poster', x: 11, y: 1, a: 0 },
      { t: 'cot', x: 2, y: 3, block: blk(2, 3) }, { t: 'cot', x: 2, y: 5, block: blk(2, 5) }, { t: 'cot', x: 4, y: 3, block: blk(4, 3) }, { t: 'cot', x: 4, y: 5, block: blk(4, 5) },
      { t: 'cot', x: 10, y: 4, block: blk(10, 4) }, { t: 'cot', x: 10, y: 6, block: blk(10, 6) }, { t: 'canisters', x: 12, y: 3, block: blk(12, 3) }, { t: 'canisters', x: 12, y: 4, block: blk(12, 4) }, { t: 'puddle', x: 7, y: 6 }],
    lights: [{ x: 120, y: 30, r: 70, c: '#d8f0ff' }, { x: 56, y: 70, r: 50, c: '#ffe0b0' }, { x: 168, y: 90, r: 50, c: '#ffe0b0' }],
    hot: [{ id: 'kidsuns', tiles: blk(2, 1, 4) }, { id: 'fanvent', tiles: blk(7, 1) }, { id: 'wardboard', tiles: blk(9, 1, 2) }, { id: 'canisters', tiles: blk(12, 3, 1, 2) }, { id: 'emptycot', tiles: [[10, 6]] }],
    exits: [{ tiles: [[7, 8]], to: 'square', spawn: { x: 21 * 16 + 8, y: 2 * 16 + 12, dir: 0 } }]
  }),
  tunnel: buildMap({
    name: 'Old Service Tunnel', w: 26, h: 8, theme: 'tunnel', music: 'mystery', dark: 'rgba(5,3,7,.66)',
    set: [[0, 3, 'E'], [0, 4, 'E'], [1, 2, 24, 5, ',']],
    props: [{ t: 'pipes', x: 1, y: 1, w: 7 }, { t: 'sealdoor', x: 8, y: 1 }, { t: 'pipes', x: 9, y: 1, w: 5 }, { t: 'chalk', x: 14, y: 1 }, { t: 'pipes', x: 15, y: 1, w: 8 },
      { t: 'stencil', x: 4, y: 1 }, { t: 'stencil', x: 18, y: 1 }, { t: 'riser', x: 23, y: 1 }, { t: 'ladder', x: 1, y: 2 },
      { t: 'sign', x: 8, y: 0, a: 'CORRIDOR 4' }, { t: 'sign', x: 23.5, y: 0, a: 'RISER 9' }, { t: 'sign', x: 1.5, y: 0, a: 'BAY 3' },
      { t: 'rails', x: 2, y: 3, w: 20 }, { t: 'orecart', x: 17, y: 3, block: blk(17, 3) }, { t: 'rubble', x: 12, y: 5, block: blk(12, 5, 2, 2) }, { t: 'cagelamp', x: 6, y: 1 }, { t: 'cagelamp', x: 12, y: 1 }, { t: 'cagelamp', x: 19, y: 1 }, { t: 'crate', x: 4, y: 6, block: blk(4, 6) }, { t: 'barrel', x: 21, y: 6, block: blk(21, 6) }],
    lights: [{ x: 24, y: 48, r: 50 }, { x: 104, y: 30, r: 58 }, { x: 200, y: 30, r: 58 }, { x: 312, y: 30, r: 58 }, { x: 384, y: 36, r: 84, c: '#fff0b0', riser: 1 }, { x: 216, y: 96, r: 36, c: '#ffb060' }],
    hot: [{ id: 'sealdoor', tiles: blk(8, 1) }, { id: 'chalk', tiles: blk(14, 1) }, { id: 'rubble', tiles: blk(12, 5, 2, 2) }, { id: 'riser', tiles: blk(23, 1, 2) }, { id: 'tpipe', tiles: [[3, 1], [4, 1], [17, 1], [18, 1]] }],
    exits: [{ tiles: [[0, 3], [0, 4]], to: 'bay', spawn: { x: 11 * 16 + 8, y: 11 * 16 + 12, dir: 0 } }]
  }),
  fuse: buildMap({
    name: 'Fuse Room C', w: 12, h: 8, theme: 'bay', music: 'work', dark: 'rgba(6,6,12,.62)',
    set: [[5, 7, 'D'], [1, 2, 10, 1, ',']],
    props: [{ t: 'pipes', x: 1, y: 1, w: 1 }, { t: 'breaker', x: 2, y: 1 }, { t: 'cagelamp', x: 5, y: 1 }, { t: 'pipes', x: 6, y: 1, w: 1 }, { t: 'locker', x: 7, y: 1, a: 0 }, { t: 'locker', x: 8, y: 1, a: 1 }, { t: 'locker', x: 9, y: 1, a: 2 }, { t: 'poster', x: 10, y: 1, a: 4 },
      { t: 'sign', x: 3, y: 0, a: 'PANEL C' }, { t: 'sign', x: 8, y: 0, a: 'CREW 3' },
      { t: 'crate', x: 1, y: 5, block: blk(1, 5) }, { t: 'spool', x: 10, y: 4, block: blk(10, 4) }, { t: 'barrel', x: 10, y: 5, block: blk(10, 5) }, { t: 'oil', x: 4, y: 4 }, { t: 'oil', x: 8, y: 5 }, { t: 'bench', x: 7, y: 5, block: blk(7, 5, 2) }],
    lights: [{ x: 56, y: 30, r: 60, c: '#4fd6d0' }, { x: 88, y: 26, r: 40 }, { x: 136, y: 34, r: 46, c: '#ffb060' }, { x: 88, y: 100, r: 40 }],
    hot: [{ id: 'breakers', tiles: blk(2, 1, 3) }, { id: 'lockerS', tiles: blk(7, 1) }, { id: 'lockerD', tiles: blk(8, 1) }, { id: 'lockerK', tiles: blk(9, 1) }, { id: 'spool', tiles: blk(10, 4) }, { id: 'fusebench', tiles: blk(7, 5, 2) }],
    exits: [{ tiles: [[5, 7]], to: 'bay', spawn: { x: 17 * 16 + 8, y: 2 * 16 + 12, dir: 0 } }]
  })
};
// Festival night: the same square after last bell — lantern stacks for cover, no exits, one thing to do.
MAPS.fest = buildMap(Object.assign({}, SQUARE_DEF, {
  name: 'Ashgate Square — First Fire', music: 'mystery', dark: 'rgba(6,4,14,.66)',
  props: SQUARE_DEF.props.concat([{ t: 'lantstack', x: 8, y: 9, block: blk(8, 9) }, { t: 'lantstack', x: 8, y: 10, block: blk(8, 10) }, { t: 'lantstack', x: 18, y: 8, block: blk(18, 8) }, { t: 'lantstack', x: 11, y: 12, block: blk(11, 12) },
    { t: 'cordon', x: 11, y: 6, w: 5, h: 5 }, { t: 'festlamp', x: 2, y: 5 }, { t: 'festlamp', x: 2, y: 11 }, { t: 'festlamp', x: 25, y: 4 }, { t: 'festlamp', x: 25, y: 11 }, { t: 'festlamp', x: 14, y: 14 }, { t: 'festlamp', x: 6, y: 14 }, { t: 'festlamp', x: 20, y: 14 }]),
  lights: SQUARE_DEF.lights.concat([{ x: 40, y: 84, r: 30, c: '#ffb050' }, { x: 40, y: 180, r: 30, c: '#ffb050' }, { x: 408, y: 68, r: 30, c: '#ffb050' }, { x: 408, y: 180, r: 30, c: '#ffb050' }, { x: 232, y: 228, r: 30, c: '#ffb050' }, { x: 104, y: 228, r: 30, c: '#ffb050' }, { x: 328, y: 228, r: 30, c: '#ffb050' }]),
  hot: [{ id: 'pillarFest', tiles: blk(13, 8) }], exits: []
}));
