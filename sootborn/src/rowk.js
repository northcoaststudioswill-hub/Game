// ============================================================
// SOOTBORN — Row K (where Kael lives), the Scuffle, and the Codex.
// Nothing on the row is needed to finish a day. It is there to be looked at.
// ============================================================

// ---- doors you can read from across a room
PROPS.doorway = (g, x, y, a) => { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); };
  R(-2, -7, 20, 23, '#0e090a'); R(-2, -7, 20, 2, '#8a6a3a'); R(-2, -7, 20, 1, '#c09a58'); R(-2, -5, 2, 21, '#6a4e2c'); R(16, -5, 2, 21, '#4a3420'); R(-2, -5, 1, 21, '#96703e');
  if (a === 'wash') { R(0, -5, 16, 21, '#161a1e'); for (let i = 0; i < 16; i += 4) { R(i, -5, 3, 15 + (i % 8 ? 2 : 0), '#6a7a80'); R(i, -5, 1, 15 + (i % 8 ? 2 : 0), '#8a9aa0'); } R(0, 12, 16, 4, 'rgba(200,220,230,.16)'); }
  else { const slab = a === 'seal' ? '#3c4048' : a === 'home' ? '#7a4a2c' : a === 'mara' ? '#5e3e30' : '#55382a', hi = a === 'seal' ? '#565c66' : a === 'home' ? '#96623a' : '#6e4a36';
    R(0, -5, 16, 21, slab); R(0, -5, 16, 1, hi); R(0, -5, 1, 21, hi); R(15, -5, 1, 21, 'rgba(0,0,0,.35)'); R(2, -3, 12, 8, 'rgba(0,0,0,.16)'); R(2, 7, 12, 7, 'rgba(0,0,0,.16)'); R(2, -3, 12, 1, 'rgba(0,0,0,.3)'); R(2, 7, 12, 1, 'rgba(0,0,0,.3)');
    R(12, 5, 2, 3, '#e8b23a'); R(12, 5, 2, 1, '#fff0b0');
    if (a === 'home') { R(5, -2, 6, 6, '#e8a030'); R(6, -3, 4, 8, '#e8a030'); R(4, -1, 8, 4, '#e8a030'); R(6, -1, 4, 4, '#ffd070'); R(7, 0, 2, 2, '#fff2c0'); R(3, 9, 10, 3, '#1a1012'); R(4, 10, 8, 1, '#ffb860'); }
    else if (a === 'seal') { R(0, 3, 16, 4, '#e8c25a'); R(0, 3, 16, 1, '#fff0b0'); for (let i = 1; i < 16; i += 4) R(i, 4, 2, 2, '#1a1214'); R(5, 8, 6, 5, '#e8e0cc'); R(6, 9, 4, 1, '#3a3038'); R(6, 11, 3, 1, '#3a3038'); }
    else { R(3, 9, 10, 3, '#1a1012'); R(4, 10, 8, 1, a === 'mara' ? '#3a3038' : '#8a6a3a'); } }
  R(5, -11, 6, 4, '#2e2e36'); R(6, -10, 4, 2, a === 'seal' ? '#3a3a44' : '#ffd890'); R(-1, 16, 18, 2, '#2a2024'); R(0, 16, 16, 1, '#4a3c40');
  if (a !== 'seal') { g.fillStyle = 'rgba(255,190,110,.10)'; g.fillRect(x - 3, y + 18, 22, 5); g.fillRect(x, y + 23, 16, 3); } };
// a way through a side wall: two tiles tall, lit, with its name on a plate
PROPS.gate = (g, x, y, a) => { const [side, txt] = a.split(':'), e = side === 'e', R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); };
  R(0, -10, 16, 50, '#0a0607'); R(e ? 4 : 0, -6, 12, 42, '#20140f'); R(e ? 9 : 0, -6, 7, 42, '#4a2e1a'); R(e ? 13 : 0, -6, 3, 42, '#a0683a'); R(e ? 15 : 0, -6, 1, 42, '#ffc880');
  for (let i = 0; i < 16; i += 4) { R(i, -10, 2, 4, '#e8b23a'); R(i + 2, -10, 2, 4, '#1a1214'); R(i + 2, 36, 2, 4, '#e8b23a'); R(i, 36, 2, 4, '#1a1214'); }
  R(e ? 0 : 13, -6, 3, 42, '#7a5632'); R(e ? 0 : 15, -6, 1, 42, '#b08a50'); for (let j = -2; j < 34; j += 8) R(e ? 1 : 14, j, 1, 2, '#e8c25a');
  R(e ? 3 : 9, -15, 4, 4, '#2e2e36'); R(e ? 4 : 10, -14, 2, 2, '#ffd890');
  g.fillStyle = 'rgba(255,190,110,.13)'; g.fillRect(x + (e ? -26 : 16), y - 2, 26, 34); g.fillRect(x + (e ? -40 : 42), y + 4, 14, 22);
  g.fillStyle = '#e8b23a'; for (let k = 0; k < 3; k++) { const ax = x + (e ? -30 + k * 9 : 44 - k * 9), d = e ? 1 : -1; for (let i = 0; i < 4; i++) { g.fillRect(ax + i * d, y + 12 + i, 2, 1); g.fillRect(ax + i * d, y + 19 - i, 2, 1); } }
  const w = ptextW(txt) + 6, sx = Math.round(e ? x + 15 - w : x + 1); g.fillStyle = '#0c0808'; g.fillRect(sx - 1, y - 28, w + 2, 11); g.fillStyle = '#c8a050'; g.fillRect(sx, y - 27, w, 9); g.fillStyle = '#1e1512'; g.fillRect(sx + 1, y - 26, w - 2, 7); ptext(g, txt, sx + 3, y - 25, '#f3e3c3'); };
PROPS.chalkring = (g, x, y, w, h) => { const cx = x + w * 8, cy = y + h * 8, rx = w * 8 - 3, ry = h * 8 - 4; g.fillStyle = 'rgba(20,12,12,.3)'; for (let j = -ry; j <= ry; j += 2) { const k = Math.sqrt(Math.max(0, 1 - (j * j) / (ry * ry))) * rx; g.fillRect(Math.round(cx - k), cy + j, Math.round(k * 2), 2); }
  g.fillStyle = '#d8d0c0'; for (let k = 0; k < 6.283; k += .07) { if (Math.sin(k * 9) > .86) continue; g.fillRect(Math.round(cx + Math.cos(k) * rx), Math.round(cy + Math.sin(k) * ry), 2, 1); }
  g.fillStyle = 'rgba(216,208,192,.5)'; g.fillRect(cx - 5, cy, 10, 1); g.fillRect(cx, cy - 3, 1, 7); g.fillStyle = 'rgba(120,30,20,.35)'; g.fillRect(cx + 12, cy + 6, 3, 2); g.fillRect(cx - 18, cy - 4, 2, 1); };
PROPS.rtap = (g, x, y) => { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(5, -8, 6, 24, '#4a5258'); R(5, -8, 2, 24, '#6a747a'); R(3, -10, 10, 3, '#2e3438'); R(10, -2, 5, 2, '#8a6a3a'); R(14, -2, 2, 5, '#8a6a3a'); R(6, -5, 4, 4, '#e8e0cc'); R(7, -4, 2, 1, '#c8452e'); R(2, 12, 12, 4, '#2a2428'); R(3, 12, 10, 1, '#5a8aa0'); R(14, 5, 1, 2, '#9ac8e0'); };
PROPS.washtub = (g, x, y) => { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(1, 4, 14, 11, '#5a4030'); R(1, 4, 14, 2, '#8a6a4a'); R(2, 6, 12, 3, '#7aa0b0'); R(3, 6, 5, 1, '#d8e8f0'); R(1, 9, 14, 1, '#3a2a1e'); R(1, 13, 14, 1, '#3a2a1e'); R(10, 1, 5, 4, '#c8b89a'); R(11, 0, 3, 1, '#e8dcc0'); };
PROPS.kshrine = (g, x, y) => { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(1, 9, 14, 2, '#3a2a1e'); R(1, 9, 14, 1, '#6a4a30'); for (const [a, b, c] of [[2, 5, '#e8a030'], [6, 3, '#ffd070'], [10, 5, '#e8a030'], [13, 6, '#c87a2a'], [4, 0, '#ffd070'], [9, -1, '#e8a030']]) { R(a, b, 3, 3, c); R(a + 1, b - 1, 1, 5, c); R(a - 1, b + 1, 5, 1, c); } R(7, 6, 2, 3, '#f3e3c3'); R(7, 5, 2, 1, '#ffb040'); };
PROPS.ktally = (g, x, y) => { g.fillStyle = 'rgba(216,208,192,.85)'; for (let j = 0; j < 4; j++) for (let i = 0; i < (j === 3 ? 6 : 9); i++) g.fillRect(x + 1 + i * 2 - (i % 5 === 4 ? 1 : 0), y + 1 + j * 4, i % 5 === 4 ? 3 : 1, i % 5 === 4 ? 1 : 3); g.fillStyle = '#e8a030'; g.fillRect(x + 12, y + 13, 3, 3); g.fillRect(x + 13, y + 12, 1, 5); g.fillRect(x + 11, y + 14, 5, 1); };
PROPS.kpost = (g, x, y) => { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(6, -14, 4, 29, '#5a4030'); R(6, -14, 1, 29, '#7a5a40'); R(4, 13, 8, 3, '#2a2024'); R(5, -16, 6, 3, '#3a2a1e'); R(7, -4, 2, 1, '#d8d0c0'); R(7, 0, 2, 1, '#d8d0c0'); R(7, 4, 2, 1, '#d8d0c0'); R(10, -10, 4, 6, '#8a5a4a'); R(10, -10, 4, 1, '#a87a6a'); };
PROPS.hop = (g, x, y) => { g.fillStyle = 'rgba(216,208,192,.7)'; for (let i = 0; i < 3; i++) { g.fillRect(x + i * 11, y + 4, 10, 1); g.fillRect(x + i * 11, y + 13, 10, 1); g.fillRect(x + i * 11, y + 4, 1, 10); g.fillRect(x + i * 11 + 9, y + 4, 1, 10); } ptext(g, '6', x + 3, y + 6, 'rgba(216,208,192,.8)'); ptext(g, '5', x + 14, y + 6, 'rgba(216,208,192,.8)'); ptext(g, '4', x + 25, y + 6, 'rgba(216,208,192,.8)'); g.fillStyle = '#e8a030'; g.fillRect(x + 37, y + 6, 5, 5); g.fillRect(x + 39, y + 4, 1, 9); g.fillRect(x + 35, y + 8, 9, 1); };
Object.assign(TALLP, { rtap: [32, 48, 8, 20, 16], kpost: [32, 48, 8, 24, 16], washtub: [32, 32, 8, 8, 16] });

// ---- the square gets a way through its west wall, and a gate you can see on the east one
{ const S = SQUARE_DEF, drop = p => (p.t === 'door' && p.x === 3) || (p.t === 'sign' && p.a === 'ROW K');
  S.props = S.props.filter(p => !drop(p)).concat([{ t: 'pipes', x: 3, y: 1, w: 1 }, { t: 'gate', x: 27, y: 7, a: 'e:BAY 3' }, { t: 'gate', x: 0, y: 7, a: 'w:ROW K' }]);
  S.set = S.set.filter(s => !(s[0] === 3 && s[1] === 1)).concat([[0, 7, 'E'], [0, 8, 'E']]);
  S.lights = S.lights.concat([{ x: 440, y: 128, r: 46, c: '#ffb860' }, { x: 8, y: 128, r: 46, c: '#ffb860' }]);
  S.exits = S.exits.filter(e => e.to !== 'apt').concat([{ tiles: [[0, 7], [0, 8]], to: 'rowk', spawn: { ...tc(27, 5), dir: 2 } }]);
  const sq = buildMap(S); Object.assign(MAPS.square, { grid: sq.grid, props: S.props, lights: S.lights, exits: S.exits, set: S.set });
  for (const k of ['fest', 'night5']) if (MAPS[k]) { const m = MAPS[k]; m.props = m.props.filter(p => !drop(p)).concat([{ t: 'pipes', x: 3, y: 1, w: 1 }]); m.grid[1][3] = '#'; }
  MAPS.apt.exits = [{ tiles: [[5, 8], [6, 8]], to: 'rowk', spawn: { ...tc(16, 2), dir: 0 } }]; }

MAPS.rowk = buildMap({
  name: 'Row K — Tier Six', w: 30, h: 11, theme: 'city', music: 'home', dark: 'rgba(12,7,12,.5)',
  set: [[10, 1, 'D'], [13, 1, 'D'], [16, 1, 'D'], [19, 1, 'D'], [22, 1, 'D'], [25, 1, 'D'], [29, 5, 'E'], [29, 6, 'E']],
  overhead: [[10, 3.3, 15, 3.0], [17, 3.5, 24, 3.1], [12, 8.9, 21, 9.2]],
  props: [{ t: 'pipes', x: 1, y: 1, w: 4 }, { t: 'pipes', x: 6, y: 1, w: 3 }, { t: 'poster', x: 5, y: 1, a: 3 }, { t: 'pipes', x: 11, y: 1, w: 2 }, { t: 'pipes', x: 14, y: 1, w: 2 }, { t: 'pipes', x: 23, y: 1, w: 2 }, { t: 'pipes', x: 26, y: 1, w: 3 },
    { t: 'doorway', x: 10, y: 1, a: 'wash' }, { t: 'doorway', x: 13, y: 1, a: 'k5' }, { t: 'doorway', x: 16, y: 1, a: 'home' }, { t: 'doorway', x: 19, y: 1, a: 'mara' }, { t: 'doorway', x: 22, y: 1, a: 'k11' }, { t: 'doorway', x: 25, y: 1, a: 'seal' },
    { t: 'sign', x: 10, y: -.4, a: 'WASH' }, { t: 'sign', x: 13, y: -.4, a: 'K-5' }, { t: 'sign', x: 16, y: -.4, a: 'K-7' }, { t: 'sign', x: 19, y: -.4, a: 'K-9' }, { t: 'sign', x: 22, y: -.4, a: 'K-11' }, { t: 'sign', x: 25, y: -.4, a: 'K-13' },
    { t: 'kshrine', x: 17, y: 1 }, { t: 'ktally', x: 20, y: 1 }, { t: 'gate', x: 29, y: 5, a: 'e:SQUARE' },
    { t: 'chalkring', x: 2, y: 4, w: 6, h: 5 }, { t: 'kpost', x: 8, y: 3, block: blk(8, 3) }, { t: 'bench', x: 3, y: 2, block: blk(3, 2, 2) },
    { t: 'washtub', x: 11, y: 3, block: blk(11, 3) }, { t: 'rtap', x: 23, y: 3, block: blk(23, 3) }, { t: 'hop', x: 17, y: 6 },
    { t: 'bench', x: 14, y: 9, block: blk(14, 9, 2) }, { t: 'barrel', x: 26, y: 9, block: blk(26, 9) }, { t: 'barrel', x: 27, y: 9, block: blk(27, 9) }, { t: 'crate', x: 28, y: 8, block: blk(28, 8) }, { t: 'crate', x: 10, y: 9, block: blk(10, 9) },
    { t: 'lampBase', x: 9, y: 8, block: blk(9, 8) }, { t: 'lampBase', x: 21, y: 9, block: blk(21, 9) }, { t: 'lampBase', x: 1, y: 3, block: blk(1, 3) },
    { t: 'vent', x: 12, y: 6 }, { t: 'vent', x: 24, y: 7 }, { t: 'puddle', x: 22, y: 4 }, { t: 'puddle', x: 12, y: 4 }, { t: 'puddle', x: 6, y: 9 }, { t: 'oil', x: 27, y: 3 }],
  lights: [{ x: 264, y: 40, r: 56, c: '#ffb860' }, { x: 168, y: 40, r: 34 }, { x: 216, y: 40, r: 30 }, { x: 312, y: 40, r: 30 }, { x: 360, y: 40, r: 30 }, { x: 80, y: 104, r: 78, c: '#ffb060' }, { x: 152, y: 132, r: 44 }, { x: 344, y: 148, r: 44 }, { x: 24, y: 52, r: 40 }, { x: 464, y: 96, r: 46, c: '#ffb860' }, { x: 376, y: 60, r: 26, c: '#7ad8ff' }],
  hot: [{ id: 'kwash', tiles: blk(10, 1) }, { id: 'kdoor5', tiles: blk(13, 1) }, { id: 'kdoorM', tiles: blk(19, 1) }, { id: 'kdoor11', tiles: blk(22, 1) }, { id: 'kdoor13', tiles: blk(25, 1) }, { id: 'ksuns', tiles: blk(17, 1) }, { id: 'kwall', tiles: blk(20, 1) },
    { id: 'ktap', tiles: blk(23, 3) }, { id: 'kbarrel', tiles: blk(26, 9, 2) }, { id: 'kpost', tiles: blk(8, 3) }, { id: 'khop', tiles: blk(17, 6, 3) }, { id: 'ktub', tiles: blk(11, 3) }, { id: 'kbench', tiles: blk(3, 2, 2) }],
  exits: [{ tiles: [[16, 1]], to: 'apt', spawn: { x: 96, y: 7 * 16 + 8, dir: 1 } }, { tiles: [[29, 5], [29, 6]], to: 'square', spawn: { ...tc(1, 7), dir: 3 } }]
});
// lamp heads are painted by the world renderer for the square only; the row's lamps carry theirs in the prop
{ const lb = PROPS.lampBase; PROPS.lampBase = (g, x, y, a, h) => { lb(g, x, y, a, h); g.fillStyle = '#3a3a40'; g.fillRect(x + 4, y - 13, 8, 4); g.fillStyle = '#ffd890'; g.fillRect(x + 5, y - 9, 6, 2); }; }

// ---- the people of the row
Object.assign(CAST, {
  orla: { name: 'Nan Orla', look: () => ({ skin: '#b88a6a', hair: '#c8c8c8', style: 'bun', shirt: '#5a4a6a', pants: '#2e2630' }) },
  garrow: { name: 'Garrow', look: () => ({ skin: '#8a5a40', hair: '#3a3a3a', style: 'bald', shirt: '#4a3a2a', pants: '#2a2420' }) },
  tam: { name: 'Tam', look: () => ({ skin: '#c48a64', hair: '#2a1a14', style: 'spiky', shirt: '#5a6a3a', pants: '#2a2420' }) },
  bryn: { name: 'Bryn', look: () => ({ skin: '#6a4430', hair: '#141014', style: 'bun', shirt: '#7a3a2a', pants: '#2e2a30' }) },
  dov: { name: 'Dov', look: () => ({ skin: '#9a6448', hair: '#5a3a1a', style: 'short', shirt: '#2a3a4a', pants: '#22222a' }) },
  wick: { name: 'Wick', look: () => ({ skin: '#a87050', hair: '#1a1014', style: 'spiky', shirt: '#8a6a2a', pants: '#3a2a24', kid: 1 }) },
  sela: { name: 'Sela', look: () => ({ skin: '#d0a080', hair: '#6a2e18', style: 'long', shirt: '#4a5a5a', pants: '#2a2430' }) }
});
Object.assign(MOUTH, { garrow: 'smirk', bryn: 'smirk', dov: 'flat', orla: 'flat' });
NPCS.push(
  { id: 'orla', map: 'rowk', at: [12, 3], dir: 2 },
  { id: 'garrow', map: 'rowk', at: [8, 5], dir: 2 },
  { id: 'tam', map: 'rowk', at: [3, 6], dir: 3, wander: [[3, 6], [4, 5], [5, 6], [4, 7]] },
  { id: 'bryn', map: 'rowk', at: [6, 6], dir: 2, wander: [[6, 6], [5, 7], [4, 6], [5, 5]] },
  { id: 'dov', map: 'rowk', at: [2, 8], dir: 1 },
  { id: 'wick', map: 'rowk', at: [18, 7], dir: 0, wander: [[18, 7], [21, 7], [21, 5], [18, 5]] },
  { id: 'sela', map: 'rowk', at: [22, 3], dir: 0 });

// ---- the Codex: kept outside the save, so what you have found stays found
const CODEX_STORY = [
  ['c_valve', 'The valve', 'Tavi had the fever and the ward had no air. I knew which line the Authority kept for itself, and I knew the valve. I turned it. For three nights forty children breathed. Then the audit came.'],
  ['c_eleven', 'Eleven seconds', 'Seren said the valve was hers. They believed her because it was easier. They walked my wife into the heart-furnace in front of the tier, and the doors stood open for eleven seconds. Mara held me down. Seren said: balance the bank, Kael.'],
  ['c_day1', 'Forty-one days', 'A tin of ash, a brass washer, and an invoice for the fire. I went back to Bay Three and fixed valves. I talked to the people she had talked to. I started looking at where the pressure goes.'],
  ['c_table', 'The Table', 'A hundred and sixty days after the furnace a woman named Ilse will find me in the old tunnel and take me apart on a table, bones first. It will take nine months. I will keep my hands. This is what I dream about now instead of the furnace.'],
  ['c_day2', 'First Fire', 'The Festival of the First Fire. I hung her lantern on the Pillar under the Tallymen\'s lamps and nobody stopped me. The ring took what I had left in my hands, and Mara let me hit her for holding me down.'],
  ['c_day3', 'Under the floor', 'Lift Zero has a window. The old tunnel has chalk in it, and a riser that carries our air somewhere warm. Whatever is above Tier Four is not burning.'],
  ['c_day4', 'The way out', 'Four months of being nobody. Then one night on the wrong side of a bell, and after it Kael Brennick was dead on paper. Mara signed for the tin. There was nothing in it.'],
  ['c_assay', 'The Assay', 'They sent me up Lift Zero under a dead boy\'s name. One valley, twelve houses, one season. A boy named Dorian Aldane shared his bread with me on the lift and I was shut in a room with him that night. I count him. I count all of them.'],
  ['p1', 'The Post', 'Edric Sorrel, Clerk of the Count. I sat at a desk in the Spire and kept their columns. Seren has a line in the Count. It is one line.'],
  ['p2', 'The Balancing', 'They balanced Tier Four the way they balance everything. I wore a mask and held the top of Riser Nine while forty people climbed out behind me and went into the pines.'],
  ['p3', 'What She Knows', 'I hummed our song in the Spire without knowing it, and she heard. Celestine made me an offer. After that there was only the high docks, and how many I could put on a barge before the second bell.'],
  ['p4', 'Two Years', 'Brand held the dock stair for eleven minutes. Tier Six stood. I spent two years in the weather learning that being right is not the same as being forgiven.'],
  ['p5', 'The Count', 'Nine hundred steps, and Tavi on my left. At the top there was a white door, and behind it the woman who closed the other one. Lift Zero stands open now.']
];
const CODEX_FINDS = [
  ['f_suns', 'Seventeen suns', 'Row K, by the door of K-7', 'Bottle caps, washers, a jar lid, all painted yellow and left on the ledge by my door. Seren painted seventeen suns inside. The row has left eleven more outside, and nobody has said a word to me about it.', null],
  ['f_wall', 'The wall by Mara\'s door', 'Row K, K-9', 'Thirty-one names in chalk, in Mara\'s hand. Everybody on Tier Six who was committed since she made forewoman. Seren\'s is the last. Mara goes over the old ones when they fade.', 'Every name has a week chalked beside it. I checked them against the shift board. Every one of them is an audit week. They do not commit people when somebody steals. They commit people when the count comes up short.'],
  ['f_book', 'A docked ration book', 'Row K, under the mat at K-13', 'The Hadleys\' book. The air stamps stop a week before the seal went on the door. In the margin, in an Authority hand: HUMMING. ONE WEEK. Then: TENANCY ENDED.', 'A week without the row\'s air ration, with a baby in the house. They did not need the furnace for the Hadleys. They only needed the book.'],
  ['f_whistle', 'A tin whistle', 'Row K, behind the barrels', 'Dented, six holes, one of them plugged with wax. Wick\'s brother made it out of conduit. It only plays five pitches. The shift song only needs five.', 'The song has no words because words cost breath. Somebody a long time ago made it out of the five pitches a cracked pipe will give you. It was built to be played on rubbish.'],
  ['f_tap', 'The ration tap', 'Row K', 'The washer was gone and the row had been paying for the drip. I cut a new one from belting. It took less time than it took to queue.', 'The meter is geared wrong. It turns ten for every nine it pours. It is not worn; it left the works that way, with a seal on it. Row K has paid for a tenth more water than it has drunk for as long as there has been a meter.'],
  ['f_notch', 'S.H. in the post', 'Row K, the Scuffle', 'Three notches and two letters cut into the post with something blunt. Seren Holloway, aged fourteen, three bouts in one night. She told me it was four. Garrow says three, and that she bit somebody.', null],
  ['f_knot', 'Garrow\'s knot', 'Row K, the Scuffle', 'A fist of old lift cable, spliced back into itself with one hand. Garrow gives one to whoever is still standing. He has given out nine in thirty years. It does not do anything. I have put it on the shelf.', null],
  ['f_line', 'The painted line', 'The Sun Spire, the fourth ring', 'Ochre, a hand wide, from the service stair to every lamp and every door and nowhere else. The service walks on it. A porter who steps off it loses a day of air. The clerks are brought up not to see it.', 'It is repainted every rest day, by the porters, in their own time. Nobody orders the paint. I looked for the line in the Count that pays for it. There is not one. They buy it themselves.'],
  ['f_bellplate', 'The bell plate', 'The Sun Spire, the fourth ring', 'ONE: A CLERK. TWO: A HOUSE. THREE: A MARSHAL. Under that the gilt has been left bare. The service kneels at any of them. The clerks bow from the neck at two.', null],
  ['f_greens', 'Greens off Freight Three', "The Sun Spire, Sable's stall", "Cold crates chalked F3 in Sable's hand. The kitchens send down what the third ring leaves on its plates. Half of it she sells to clerks. The other half goes down the stair in the same crates, and is in nobody's book.", null],
  ['f_handpipe', 'A worn place on a riser', 'The Sun Spire, the fourth ring', 'Beside a door with a new slate, the paint is gone from the riser pipe at the height of a hand. Somebody on this ring puts a palm on it every night to hear how it is running. Nobody up here does that. Below, everybody does. Seren taught me. I do not know who taught this door.', null],
  ['f_spirebank', "The Spire's own valves", 'The Sun Spire, behind the painted line', 'Twelve wheels on one landing of the service side, and on every valve body the foundry mark that is on Bank Seven. The Spire is plumbed exactly like Tier Six. It is only kept by people nobody up here has given a ring.', null],
  ['f_tally', 'The pencil column', 'The High Docks, the tally booth', "Every sled across the quay gets a stroke in ink. Beside the ink there is a second column in pencil, in Sable's hand: what went back down the dock stair in the same crates. It has been there for years. Nobody up here reads pencil.", null],
  ['f_bench', 'Names under a bench', 'The High Docks, the watch shelter', 'Cut with a seat knife on the underside of the bench where the dock watch sits out its nights. Four names. One is BRAND, with a tally of watches under it that stops.', null],
  ['f_signal', 'The signal book', 'The High Docks, the signal roof', 'Two lamps for a House barge. One for freight. Three for a Marshal. There is no page for a barge that does not answer its signal. Four hundred of them are about to not answer.', null]
];
const Codex = {
  d: null,
  load() { if (!this.d) { try { this.d = JSON.parse(Store.get('sootborn_codex') || '{}'); } catch (e) { this.d = {}; } } return this.d; },
  has(id) { return !!this.load()[id]; },
  add(id, quiet) { const d = this.load(); if (d[id]) return false; d[id] = 1; Store.set('sootborn_codex', JSON.stringify(d)); if (!quiet) { const f = CODEX_FINDS.find(e => e[0] === id), s = CODEX_STORY.find(e => e[0] === id); HUD.toast(f ? `Codex: ${f[1]} (${this.count()} of ${CODEX_FINDS.length} found)` : s ? 'Codex: ' + s[1] : 'Codex'); Sound.play('clue'); } return true; },
  count() { const d = this.load(); return CODEX_FINDS.filter(e => d[e[0]]).length; },
  // the story fills in from what the save has done
  sync() { const f = G.flags || {}, q = true, on = (c, id) => { if (c) this.add(id, q); };
    on(f.day1Done, 'c_valve'); on(f.day1Done, 'c_eleven'); on(f.day1Done, 'c_day1'); on(f.day1Done, 'c_table'); on(f.day2Done, 'c_day2'); on(f.day3Done, 'c_day3'); on(f.day4Done, 'c_day4');
    const p = Number(Store.get('sootborn_p2') || 0), done = Store.get('sootborn_done') === '1'; on(f.day4Done || p || done, 'c_assay'); for (let i = 1; i <= 5; i++) on(done || p > i, 'p' + i); },
  open() { this.sync(); const d = this.load(); let tab = Menus._ct | 0; const names = ['The story', 'Found'];
    const m = modal({ title: 'Codex', startCloses: true, tabs: dd => { tab = (tab + dd + 2) % 2; Menus._ct = tab; Sound.play('page'); m.refresh(); },
      build(b) { const t = document.createElement('div'); t.className = 'tabs'; names.forEach((n, i) => { const bt = document.createElement('button'); bt.textContent = n; bt.className = i === tab ? 'on' : ''; bt.onclick = () => { tab = i; Menus._ct = i; Sound.play('page'); m.refresh(); }; t.appendChild(bt); }); b.appendChild(t);
        let html = '';
        if (tab === 0) { const n = CODEX_STORY.filter(e => d[e[0]]).length; html += `<p style="opacity:.7">The whole of it, in the order it happened to him. ${n} of ${CODEX_STORY.length}. It fills in as you play.</p>`; for (const [id, title, body] of CODEX_STORY) html += d[id] ? `<div class="card"><b>${esc(title)}</b><p>${esc(body)}</p></div>` : '<div class="card ghost"><b>· · ·</b><p>Not yet.</p></div>'; }
        else { html += `<p style="opacity:.7">Things nobody asked him to look at. ${Codex.count()} of ${CODEX_FINDS.length}. None of them are needed. Some of them matter.</p>`; for (const [id, title, where, body, more] of CODEX_FINDS) html += d[id] ? `<div class="card"><b>${esc(title)}</b><p style="opacity:.6">${esc(where)}</p><p>${esc(body)}</p>${more ? `<p style="border-left:2px solid #e8b23a;padding-left:8px">${esc(more)}</p>` : ''}</div>` : `<div class="card ghost"><b>? ? ?</b><p>${esc(where.split(',')[0])}. Not found.</p></div>`; }
        const w = document.createElement('div'); w.innerHTML = html; b.appendChild(w); }, items: [{ label: 'Back', act: () => UI.pop() }] });
    UI.push(m); }
};
const find = id => fx(() => { Codex.add(id); });

// ---- the Scuffle: open hands, no blades, first to sit down buys the tea
const SCUFFLE = [
  () => ({ pre: [say('garrow', "Tam, then. He's quick and he knows it, which is half of why he loses."), say('tam', "Brennick! Mind the face, I've a girl on Row J.")],
    def: { bg2: 'rowk', title: 'THE SCUFFLE', sub: 'TAM - OPEN HANDS, NO BLADES', winText: 'TAM SITS DOWN', foes: [{ id: 'tam', name: 'Tam', kind: 'quick', hp: 15 }], taunt: { 0: ['TOO SLOW, VALVE MAN!', 'ROW J IS WATCHING!', 'AGAIN! AGAIN!'] },
      voice: { at: [[1, 'OPEN HANDS. NOBODY HERE WANTS ANYTHING BROKEN. I HAVE FORGOTTEN WHAT THAT IS LIKE.'], [10, 'HE BOUNCES. SEREN BOUNCED. SHE SAID STANDING STILL WAS FOR PIPES.']], hurt: 'GOOD. THAT ONE WAS MINE TO TAKE.' } },
    win: [say('tam', "Aye, aye, I'm sat. I'm sat! Somebody tell Row J I slipped."), say('garrow', "One. Bryn's been warming up since you walked in, mind.")] }),
  () => ({ pre: [say('bryn', "I haul ore twelve hours and then I come here to rest. You're the rest, Kael."), say('garrow', "She doesn't dodge. Never has. Doesn't need to.")],
    def: { bg2: 'rowk', title: 'THE SCUFFLE', sub: 'BRYN - SHE DOES NOT DODGE', winText: 'BRYN SITS DOWN, EVENTUALLY', foes: [{ id: 'bryn', name: 'Bryn', kind: 'jab', hp: 26 }], taunt: { 0: ['THAT ALL OF IT?', "I'VE HAD WORSE OFF A CART.", 'COME ON, THEN.'] },
      voice: { at: [[1, 'SHE HAS FORTY POUNDS ON ME AND SHE IS SMILING.'], [11, 'IT IS LIKE HITTING A LOADED CART. YOU DO NOT STOP A CART. YOU GET IT TO GO SOMEWHERE ELSE.']], hurt: 'THAT IS WHAT TWELVE HOURS OF ORE DOES TO AN ARM.' } },
    win: [say('bryn', "Hah! There. Now I'm rested."), say('bryn', "She'd have gone for my knees, your Seren. Dirty little fighter. I liked her ever so much."), say('garrow', 'Two. Dov. Up you get.')] }),
  () => ({ pre: [say('dov', "I don't much want to, Kael. You've a look on you lately."), say('garrow', "That's why, lad. Better it comes out here, on chalk, than in front of a Warden."), say('dov', 'Aye. Fair. Hands up, then.')],
    def: { bg2: 'rowk', title: 'THE SCUFFLE', sub: 'DOV - THE ROW\'S BEST', winText: 'THE ROW GOES QUIET', foes: [{ id: 'dov', name: 'Dov', kind: 'boss', hp: 30 }], taunt: { 0: ['EASY. EASY, KAEL.', "THAT'S NOT A SCUFFLE, THAT'S A GRUDGE.", 'BREATHE, MAN.'] },
      voice: { at: [[1, 'DOV CARRIED HER LANTERN FRAME UP FROM THE BAY THE DAY SHE STARTED IT. I HAVE NOTHING AGAINST DOV.'], [12, 'HE KEEPS TELLING ME TO BREATHE. EVERYBODY KEEPS TELLING ME TO BREATHE.']], hurt: 'HE PULLED THAT. HE IS PULLING THEM ALL.', half: 'HE HAS STOPPED PULLING THEM.', eleven: 'I COUNTED. I DID NOT MEAN TO COUNT.' } },
    win: [narr('Dov sits down in the chalk and looks at his hands, and then at yours. Nobody on the row says anything for a moment.'), say('dov', "That wasn't for me, was it."), say('kael', 'No.'), say('dov', "Aye. Well. Better here."),
      say('garrow', "Three. Thirty years I've stood at this post and I've handed out nine of these."), narr('He works something out of his pocket with his one hand: a fist of old lift cable, spliced back into itself.'), say('garrow', "Doesn't do anything. Put it on a shelf. She never got one, you know. Three bouts in a night and she bit a man, so I couldn't."), find('f_knot'), fx(() => setF('rkChamp'))] })
];
function scuffleBout() { const i = G.flags.rkBout | 0, B = SCUFFLE[i]();
  return B.pre.concat([fx(() => Brawl.start(B.def, win => { G.mode = 'world'; HUD.dirty = true;
    if (win) { G.flags.rkBout = i + 1; Game.autosave(); Dialogue.start(B.win, () => { World.afterBeat(); Game.autosave(); }); }
    else Dialogue.start([say('garrow', ["Sat down. Tea's on you. Go again when you can count my fingers.", "You're fighting like it owes you money. It's a scuffle, lad. Go again.", "Watch where the weight goes, not the hands. Go again."][(G.flags.rkLoss = (G.flags.rkLoss | 0) + 1) % 3])], () => World.afterBeat()); }))]); }

Object.assign(TALK, {
  garrow() { const i = G.flags.rkBout | 0;
    if (i >= 3) return [say('garrow', ["Nine knots in thirty years. Don't lose it.", "Row's quieter since you had your three. Folk saw it come out of you. Did them good and all.", "She bit a man, your Seren. Right there. I'd have given her the knot else."][(G.talkCount.garrow = (G.talkCount.garrow || 0) + 1) % 3])];
    const first = !F('rkGarrow'); setF('rkGarrow');
    return (first ? [say('garrow', "Kael Brennick. Thought we'd lost you to that room."), say('garrow', "This is the Scuffle. Open hands, no blades, nobody's angry. First to sit down buys the tea. The Authority doesn't mind it. Says it keeps us tired."), say('garrow', "It doesn't keep us tired. It keeps us from doing it somewhere that matters.")] : [say('garrow', ['Back for it?', "Chalk's fresh.", 'Dov was asking after you. Not in a keen way.'][i])])
      .concat([{ choice: [{ t: ['Step into the chalk. (Tam)', 'Step into the chalk. (Bryn)', 'Step into the chalk. (Dov)'][i], then: scuffleBout() }, { t: 'Not today.', then: [say('garrow', "Aye. It'll keep. It's kept thirty years.")] }] }]); },
  tam() { return [say('tam', (G.flags.rkBout | 0) > 0 ? ["I slipped. Tell anyone who asks, I slipped.", "You hit like a man with somewhere else to be.", "Row J's got a scuffle too. Theirs has rules. It's rubbish."][(G.talkCount.tam = (G.talkCount.tam || 0) + 1) % 3] : ["Kael! You stepping in? Garrow's the one to see.", "Bryn's put me down four times this week. I'm wearing her out, me.", "Mind the chalk, it's fresh."][(G.talkCount.tam = (G.talkCount.tam || 0) + 1) % 3])]; },
  bryn() { return [say('bryn', (G.flags.rkBout | 0) > 1 ? ["Knees. She'd have gone for my knees. I do miss her.", "You're all right, Kael. You're not all right. But you're all right.", "Twelve hours of ore tomorrow. This is the good bit of the day."][(G.talkCount.bryn = (G.talkCount.bryn || 0) + 1) % 3] : ["Garrow calls it. I just stand where he says and people fall over.", "They count the carts up top, you know. Every one. I've never once seen what's in the count.", "Sorry about your Seren. I'd say it better if I knew how."][(G.talkCount.bryn = (G.talkCount.bryn || 0) + 1) % 3])]; },
  dov() { return [say('dov', F('rkChamp') ? ["Better here. I meant it.", "I carried her lantern frame up from the bay. Did I tell you? Light as nothing.", "If you ever aim that at the right people, Kael, I'd like to be stood behind you."][(G.talkCount.dov = (G.talkCount.dov || 0) + 1) % 3] : ["Kael.", "I don't scuffle much now. Garrow says that's when you should.", "You've a look on you. I'm not the only one's noticed."][(G.talkCount.dov = (G.talkCount.dov || 0) + 1) % 3])]; },
  orla() { const n = G.talkCount.orla = (G.talkCount.orla || 0) + 1;
    if (F('rkWhistleDone') && !F('rkOrlaSong')) { setF('rkOrlaSong'); return [say('orla', "I heard the lad on that whistle. Five pitches, and he had them all. I nearly dropped the wash."), say('orla', "My nan had it from hers. You hum it through your teeth to keep the wheel in time. No words. Words cost breath, and breath was rationed before anything else was."), say('orla', "And now they play it at us off the speakers, slow, so we'll think of the doors. Clever. Whoever thought of that has never turned a wheel in their life.")]; }
    if (F('rkTap') && !F('rkOrlaTap')) { setF('rkOrlaTap'); return [say('orla', "You fixed the tap. Eight months that's dripped and we've paid for every drop."), say('orla', "Ten for nine, you say? Hm. I'm not surprised. I'm seventy-one, I've not been surprised since I was thirty."), say('orla', "Don't tell the row all at once. Tell Mara. She'll know what to do with it, and when.")]; }
    return [say('orla', ["Kael. You've come out. Good. A door wants opening or it forgets how.", "Hot water's first bell and last bell. In between it's whatever the pipes feel like.", "I've washed for this row fifty years. I know what everybody's hiding by what they don't hand me.", "K-13's sealed. The Hadleys. Don't knock, there's nobody to hear it. Look if you like. Nobody else will."][n % 4])]; },
  wick() {
    if (F('rkWhistleDone')) return [say('wick', ["I can do four of the notes! The fifth one's hiding.", "Nan Orla says not on the row. So I do it in the wash-house where it echoes.", "Is it true you fought Dov? Tam says you fought Dov."][(G.talkCount.wick = (G.talkCount.wick || 0) + 1) % 3])];
    if (F('rkWhistleGot')) { setF('rkWhistleDone'); return [say('wick', "That's it! That's Jem's! Where— no, don't tell me, he'll ask and I'll have to say."), narr('He blows it. Five notes come out, in the wrong order, and one of them twice.'), say('orla', 'Wick. Not on the row, love. Not since.'), narr('He stops. He does not know what since. He was told not to, the way you are told not to touch a hot pipe.'), say('wick', 'Ta, Kael. I owed you one anyway. I ate the heel of your bread off the sill last week.')]; }
    setF('rkWhistleAsk'); return [say('wick', "I've lost Jem's whistle. He made it. He'll skin me and then he'll tell Mam and she'll skin what's left."), say('wick', "It rolled. Down the square end, I think. I had it and then I didn't.")]; },
  sela() {
    if (F('rkTap') && !F('rkSelaTa')) { setF('rkSelaTa'); return [say('sela', "It's stopped. The tap. I thought I'd gone deaf."), say('sela', "Ta, Kael. Truly. Here, it's only two scrip, don't argue, I'd have paid the meter more than that by rest day."), fx(() => { G.scrip += 2; Sound.play('coin'); HUD.dirty = true; })]; }
    return [say('sela', ["Shh. She's just gone down. First time since second bell.", "You count the drips at night, with a little one. Every drip's a stamp off the book.", "Seren used to take her for an hour so I could sleep. Never asked. Just turned up and held her arms out."][(G.talkCount.sela = (G.talkCount.sela || 0) + 1) % 3])]; }
});
Object.assign(HOT, {
  kwash: () => [narr('The wash-house. Steam through a curtain of old belting. Hot water is first bell and last bell only, and the pipes knock in between like somebody asking to be let out.')],
  kdoor5: () => [narr('K-5. Cinder Radio through the door, turned down low. Somebody inside is talking back to it. They are not agreeing.')],
  kdoorM: () => [narr("K-9. Mara's. She is on shift. She is always on shift."), narr('The door has never had a lock. Nobody on the row has ever needed telling not to open it.')],
  kdoor11: () => [narr("K-11. Sela's. A baby's blanket is drying on the handle, and somebody has chalked QUIET on the step, with a small sun under it.")],
  kdoor13: () => F('rkBook') ? [narr('K-13. The seal is still on the latch. The mat is straight. You put it back straight.')] : [narr('K-13. An Authority seal across the latch, and a notice: TENANCY ENDED. The Hadleys had this one. Nobody has said where they went. Nobody has asked.'),
    { choice: [{ t: '(Look under the mat.)', then: [narr('A ration book, pushed flat. The air stamps stop a week short. In the margin, in a clean hand: HUMMING. ONE WEEK.'), narr('You remember the baby crying through the wall that week. You remember being annoyed.'), fx(() => setF('rkBook')), find('f_book')] }, { t: '(Leave it.)', then: [narr('You leave it. The row has left it for a month.')] }] }],
  ksuns: () => [narr('The ledge by your door. Bottle caps, washers, a jar lid. All painted yellow. Eleven of them now. There were nine yesterday.'), narr('Nobody has knocked. Nobody has said anything. They just leave them, the way you would leave a lamp on for somebody.'), find('f_suns'),
    ...(G.flags.rkMorn || typeof walkRowMorning !== 'function' ? [] : [{ choice: [
      { t: 'Stand at the door a moment. (A memory. It changes nothing.)', fx: () => { G.flags.rkMorn = 1; }, then: [narr('The same door. I let it be the morning after the First Fire, most of a year before the furnace, with the row up before us.'), fx(() => Brawl.start(walkRowMorning(), () => { G.mode = 'world'; HUD.dirty = true; Dialogue.start([narr('Eleven painted suns on a ledge. The door is shut. I go on standing in front of it a while longer than a man should in front of his own door.')]); }))] },
      { t: 'Go in.' }] }])],
  kwall: () => [narr("The wall by Mara's door. Names in chalk, in her square forewoman's hand. Thirty-one. She goes over the old ones when they fade."), narr('The last one is Holloway, S. The chalk is still bright. There is a week written beside each of them.'), ...byTend({ tinkerer: 'You know the shift board by heart. You run the weeks against it without meaning to. Every one of them lands on an audit.', seeker: 'Thirty-one weeks. You have seen those weeks somewhere else. On the shift board, with a little sun stamped beside them: AUDIT.', caretaker: 'You read every name. You knew nineteen of them. Every week beside them is a week you remember the grey men walking the tier with their ledgers.' }), find('f_wall')],
  ktap: () => F('rkTap') ? [narr('The row tap. It does not drip. The meter beside it turns ten for every nine. You have not decided who to tell.')] : [narr("The row's ration tap, and the meter beside it under an Authority seal. The tap drips. The meter ticks over every time it does."),
    { choice: [{ t: '(Fix it. You have your keys.)', then: [narr('The washer is gone to nothing. You cut a new one out of a scrap of belting and seat it with the bent pick. It takes less time than the queue does.'), narr('Then, because your hands are already there, you count the meter against the pour. Ten for nine. You count it again. Ten for nine. It is not worn. It was made that way.'), fx(() => { setF('rkTap'); Sound.play('door'); }), find('f_tap')] }, { t: '(Not your tap.)', then: [narr('It is everybody\'s tap. That is the same as nobody\'s. You know that. You walk on.')] }] }],
  kbarrel: () => F('rkWhistleGot') ? [narr('Two barrels of grey water for the floors. Nothing behind them now.')] : [narr('Two barrels of grey water for the floors.'), ...(F('rkWhistleAsk') ? [narr('Behind the second one, against the wall: a tin whistle made out of conduit. Dented. Six holes, one plugged with wax.'), fx(() => setF('rkWhistleGot')), find('f_whistle'), narr("Wick's brother made this. You put it in your pocket.")] : [narr('Something small has rolled in behind them. You would have to know what you were looking for.')])],
  kpost: () => [narr('The post of the Scuffle. Thirty years of notches, three to a winner, and initials cut with whatever was to hand.'), narr('Low down, where a fourteen-year-old could reach: three notches, and S.H. She told you it was four.'), find('f_notch')],
  khop: () => [narr("The children's squares. Six, five, four, and then a sun."), narr('You hop from six to four. Past four there is only the sun. The rule is that you may throw your stone at it, but you may not go.'), narr('You played it too. You never once asked who made the rule.')],
  ktub: () => [narr("Nan Orla's tub. She has washed for the row for fifty years and knows what everybody is hiding by what they do not hand her.")],
  kbench: () => [narr('The Scuffle bench. Whoever sits down first buys the tea. There is a ring in the wood where the pot goes.')]
});
function barksRowK() { return { orla: ['FIRST BELL, HOT WATER.', 'MIND THE WET.'], garrow: ['OPEN HANDS!', 'NOBODY\'S ANGRY.', 'SIT HIM DOWN!'], tam: ['HA!', 'TOO SLOW!'], bryn: ['COME ON, THEN.', 'AGAIN.'], wick: ['NOT IT!', 'SIX, FIVE, FOUR...'], sela: ['SHH.'], dov: ['...'] }; }
{ const b0 = barks; barks = id => barksRowK()[id] || b0(id); }
// the gilded portrait lasts as long as the dream it was set in
{ const cp = Cutscene.play; Cutscene.play = function (steps, done) { return cp.call(this, steps, function () { World.gilded = 0; return done && done.apply(this, arguments); }); }; }
[0, 1, 2].forEach(i => { FF['scuffle' + i] = () => SCUFFLE[i]().def; });
