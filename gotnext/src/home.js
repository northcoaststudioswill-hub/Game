// GOT NEXT — My Crib: the lot, the house, the street, and the home builder.
// Place anything anywhere in the yards you own, turn it, move it, store it, sell it. Everything has Vibe; Vibe levels the
// crib up (perks that follow you into games), and themed sets give their own bonus. Some pieces do something.
'use strict';
const HOME_CATS = [['rare', '★ RARES'], ['seat', 'SEATING'], ['food', 'FOOD & DRINK'], ['tech', 'TECH & GAMES'], ['gym', 'HOOPS & GYM'], ['show', 'DISPLAY'], ['light', 'LIGHTS'], ['yard', 'YARD'], ['wall', 'WALLS & ART']];
const VIBES = [['comfort', 'COMFORT', '#7de3ff'], ['drip', 'DRIP', '#f2c14e'], ['hoops', 'HOOPS', '#ff6a3d'], ['tech', 'TECH', '#a78bff'], ['party', 'PARTY', '#ff2d78']];
// the yards: [x0, x1, z0, z1]. The court and the house are never buildable.
const LOTS = [
  { n: 'The Side Yard', d: 'The strip of dirt west of the court. Yours.', cost: 0, rank: 0, zones: [[-23.5, -11.5, -2.8, 15]] },
  { n: 'The East Yard', d: 'Behind the house, by the alley. Clear it, pave it.', cost: 2500, rank: 1, zones: [[11.6, 23.5, 8, 15]] },
  { n: 'The Front Yard', d: 'All the way to the street. Your crib becomes a compound.', cost: 7500, rank: 3, zones: [[-23.5, -1.8, 16.4, 23], [1.8, 23.5, 16.4, 23]] },
];
const LOOKS = {
  house: [['Red Brick', '#7a4034'], ['Brownstone', '#6a5040'], ['Painted Teal', '#2f6a6a'], ['Midnight', '#2a2c40'], ['Cream', '#b8a888'], ['Gold Leaf', '#a8842c']],
  trim: [['White', '#ece9e2'], ['Black', '#16181c'], ['Hot Pink', '#ff2d78'], ['Ice', '#7de3ff'], ['Gold', '#f2c14e']],
  fence: [['Chain Link', 'chain'], ['Wood Slat', 'wood'], ['Neon Rail', 'neon']],
  ground: [['Dirt And Hope', 'dirt'], ['Concrete', 'concrete'], ['Grass', 'grass'], ['Pavers', 'pavers'], ['Court Turf', 'turf']],
};
const LOOK_COST = { house: 300, trim: 150, fence: 400, ground: 500 };
// crib levels: total Vibe needed, and what each level gives (k/v work like the crib upgrades)
const HOME_LEVELS = [0, 10, 25, 45, 70, 100, 140, 190, 250, 330];
const HOME_PERKS = [
  { lvl: 2, n: 'Lived-In', d: '+3% VC from games.', k: 'vc', v: 0.03 },
  { lvl: 3, n: 'Homies Hang Out', d: 'Your homies come by and use your stuff. +3% Respect.', k: 'rep', v: 0.03 },
  { lvl: 4, n: 'Neighbors Notice', d: 'Neighbors drop in. +2 Stamina in games.', k: 'a_stam', v: 2 },
  { lvl: 5, n: 'Block Favorite', d: '+5% VC from games.', k: 'vc', v: 0.05 },
  { lvl: 6, n: 'Party House', d: 'With music placed, people dance. Start games with 10% Bravado.', k: 'brav', v: 0.10 },
  { lvl: 7, n: 'Local Landmark', d: '+1 to every attribute in games.', k: 'all', v: 1 },
  { lvl: 8, n: 'Tour Stop', d: 'Tourists pay 60 VC a day to look at your crib (on your first visit each day).', k: 'tour', v: 60 },
  { lvl: 9, n: 'Legendary', d: '+6% Respect from games.', k: 'rep', v: 0.06 },
  { lvl: 10, n: 'Kingdom', d: 'Your crib is on The Block\'s billboard. +1 more to every attribute.', k: 'all', v: 1 },
];
const HOME_SETS = [
  { id: 'cookout', n: 'COOKOUT', items: ['grill', 'cooler', 'picnic', 'speaker'], d: '+4 Stamina in games.', k: 'a_stam', v: 4 },
  { id: 'arcade', n: 'ARCADE NIGHT', items: ['arcade', 'beanbag', 'lava', 'tv'], d: 'Green window +2% everywhere.', k: 'green', v: 0.02 },
  { id: 'museum', n: 'SNEAKER MUSEUM', items: ['kicks', 'case', 'spot', 'mirror'], d: '+5% VC from games.', k: 'vc', v: 0.05 },
  { id: 'iron', n: 'IRON PARADISE', items: ['weights', 'bpress', 'bag', 'tires'], d: '+3 Strength in games.', k: 'a_str', v: 3 },
  { id: 'barber', n: 'BARBERSHOP SATURDAY', items: ['barber', 'mirror', 'bench', 'boombox'], d: '+5% Respect from games.', k: 'rep', v: 0.05 },
  { id: 'garden', n: 'GARDEN OF EDEN', items: ['planter', 'palm', 'hedge', 'gnome'], d: 'Fiends ask for 20% less. They feel at peace.', k: 'bum', v: 0.2 },
  { id: 'party', n: 'BLOCK PARTY', items: ['dj', 'speaker', 'strings', 'fire'], d: 'Start games with 15% more Bravado.', k: 'brav', v: 0.15 },
  { id: 'hoops', n: 'HOOP HEAVEN', items: ['rack', 'minihoop', 'shotclock', 'cones'], d: '+10% Shooting badge XP.', k: 'bxS', v: 0.10 },
];
// ---------- the catalog ----------
// w, d: footprint (metres) facing +z; v: Vibe; use: what pressing E next to it does; floor: lies flat, things can sit on it
const HOME_ITEMS = [];
function hitem(id, cat, n, cost, rank, w, d, v, build, extra) { HOME_ITEMS.push(Object.assign({ id, cat, n, cost, rank, w, d, v, build }, extra || {})); }
const _B = (g, w, h, d, c, x, y, z, k) => ink(M(box(w, h, d), toon(c), x || 0, y === undefined ? h / 2 : y, z || 0, g), k || 1.04);
const _C = (g, rt, rb, h, c, x, y, z, n) => ink(M(cyl(rt, rb, h, n || 10), toon(c), x || 0, y === undefined ? h / 2 : y, z || 0, g), 1.05);
// seating
hitem('crate', 'seat', 'Milk Crate', 20, 0, 0.5, 0.5, { comfort: 1 }, g => { _B(g, 0.45, 0.4, 0.45, '#e04848'); }, { sit: 0.4, top: 0.42 });
hitem('lawn', 'seat', 'Lawn Chair', 60, 0, 0.7, 0.7, { comfort: 2 }, g => { _B(g, 0.6, 0.06, 0.55, '#3dffa0', 0, 0.38); _B(g, 0.6, 0.6, 0.06, '#3dffa0', 0, 0.7, -0.27).rotation.x = -0.25; for (const sx of [-0.28, 0.28]) _B(g, 0.04, 0.38, 0.5, '#c8d0d8', sx, 0.19); }, { sit: 0.4 });
hitem('bench', 'seat', 'Park Bench', 120, 0, 1.8, 0.6, { comfort: 3 }, g => { for (let i = 0; i < 3; i++) _B(g, 1.7, 0.05, 0.14, '#7a5a3a', 0, 0.45, -0.18 + i * 0.17); _B(g, 1.7, 0.4, 0.05, '#7a5a3a', 0, 0.75, -0.27); for (const sx of [-0.75, 0.75]) _B(g, 0.08, 0.45, 0.5, '#20242c', sx); }, { sit: 0.45 });
hitem('beanbag', 'seat', 'Bean Bag', 150, 0, 0.9, 0.9, { comfort: 3, tech: 1 }, g => { ink(M(sph(0.45, 12, 8), toon('#a78bff'), 0, 0.28, 0, g), 1.04).scale.set(1, 0.65, 1); }, { sit: 0.3 });
hitem('sofa', 'seat', 'Sectional', 600, 1, 2.6, 1.0, { comfort: 6, drip: 1 }, g => { _B(g, 2.5, 0.45, 0.9, '#2a6a4a', 0, 0.28); _B(g, 2.5, 0.55, 0.25, '#2a6a4a', 0, 0.65, -0.35); for (const sx of [-1.2, 1.2]) _B(g, 0.2, 0.6, 0.9, '#2a6a4a', sx, 0.35); for (const sx of [-0.6, 0, 0.6]) _B(g, 0.55, 0.12, 0.7, '#3a8a64', sx, 0.56, 0.05); }, { sit: 0.5 });
hitem('throne', 'seat', 'Gamer Throne', 900, 2, 0.8, 0.8, { comfort: 4, tech: 3 }, g => { _B(g, 0.6, 0.12, 0.6, '#16181c', 0, 0.48); _B(g, 0.6, 1.0, 0.12, '#16181c', 0, 1.0, -0.26); M(box(0.08, 0.9, 0.13), flat(0xff2d78), -0.2, 1.0, -0.25, g); M(box(0.08, 0.9, 0.13), flat(0xff2d78), 0.2, 1.0, -0.25, g); _C(g, 0.05, 0.05, 0.42, '#6a707c', 0, 0.21); _B(g, 0.6, 0.05, 0.6, '#3a3c44', 0, 0.03); }, { sit: 0.5, glow: [0xff2d78, 0, 1.0, -0.2, 1.6] });
hitem('barber', 'seat', 'Barber Chair', 1200, 2, 0.8, 0.8, { drip: 4, comfort: 2 }, g => { _C(g, 0.3, 0.35, 0.08, '#c8d0d8', 0, 0.04); _C(g, 0.08, 0.08, 0.4, '#c8d0d8', 0, 0.28); _B(g, 0.6, 0.15, 0.6, '#c8482c', 0, 0.55); _B(g, 0.6, 0.8, 0.12, '#c8482c', 0, 0.95, -0.26); for (const sx of [-0.32, 0.32]) _B(g, 0.08, 0.08, 0.55, '#c8d0d8', sx, 0.78); }, { sit: 0.55 });
hitem('hammock', 'seat', 'Hammock', 1400, 3, 2.6, 1.0, { comfort: 7 }, g => { for (const sx of [-1.2, 1.2]) _C(g, 0.06, 0.07, 1.6, '#7a5a3a', sx, 0.8, 0, 6); const h = M(box(2.0, 0.04, 0.8), toon('#f2c14e'), 0, 0.75, 0, g); h.rotation.z = 0; const s = M(box(2.0, 0.3, 0.02), toon('#e04848'), 0, 0.68, 0.38, g); void s; }, { sit: 0.7 });
// food & drink
hitem('cooler', 'food', 'Cooler', 80, 0, 0.7, 0.5, { party: 2 }, g => { _B(g, 0.65, 0.45, 0.45, '#2f6ad8'); _B(g, 0.67, 0.08, 0.47, '#ece9e2', 0, 0.48); }, { top: 0.52 });
hitem('picnic', 'food', 'Picnic Table', 300, 0, 2.0, 1.6, { party: 3, comfort: 2 }, g => { _B(g, 1.9, 0.07, 0.8, '#8a6a44', 0, 0.75); for (const sz of [-0.65, 0.65]) _B(g, 1.9, 0.06, 0.3, '#8a6a44', 0, 0.45, sz); for (const sx of [-0.8, 0.8]) { _B(g, 0.08, 0.75, 1.5, '#6a5034', sx, 0.38); } for (let i = 0; i < 3; i++) _C(g, 0.04, 0.035, 0.12, ['#e04848', '#f2c14e', '#3dffa0'][i], -0.4 + i * 0.35, 0.85, 0.1, 8); }, { sit: 0.45, sitZ: 0.65, top: 0.79 });
hitem('grill', 'food', 'Grill', 450, 1, 0.9, 0.7, { party: 5 }, g => { ink(M(sph(0.38, 12, 8, 0), toon('#16181c'), 0, 0.85, 0, g), 1.03).scale.set(1, 0.6, 0.8); for (const a of [0, 2.1, 4.2]) _B(g, 0.04, 0.8, 0.04, '#3a3c44', Math.cos(a) * 0.22, 0.4, Math.sin(a) * 0.18).rotation.z = Math.cos(a) * 0.2; glow(0, 0.95, 0, 0xff8a3c, 0.9, g, 0.6); }, { emit: ['smoke', 0, 1.05, 0, 3] });
hitem('vending', 'food', 'Vending Machine', 900, 2, 1.0, 0.8, { tech: 2, party: 2 }, g => { _B(g, 0.95, 1.9, 0.75, '#c8482c'); M(box(0.6, 1.3, 0.04), flat(0xfff2c8), -0.1, 1.15, 0.38, g); for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) M(cyl(0.05, 0.05, 0.14, 6), toon(pick(['#3dffa0', '#f2c14e', '#7de3ff', '#ff2d78'])), -0.3 + c * 0.2, 0.7 + r * 0.3, 0.32, g); }, { glow: [0xfff2c8, 0, 1.2, 0.5, 2.2] });
hitem('fridge', 'food', 'Yard Fridge', 700, 1, 0.8, 0.7, { comfort: 2, party: 1 }, g => { _B(g, 0.75, 1.5, 0.65, '#ece9e2'); M(box(0.04, 0.4, 0.04), toon('#6a707c'), 0.3, 1.0, 0.34, g); M(box(0.7, 0.02, 0.02), toon('#6a707c'), 0, 1.1, 0.33, g); }, { use: 'fridge' });
hitem('dogcart', 'food', 'Soy Dog Cart', 2200, 3, 1.8, 0.9, { party: 6 }, g => { _B(g, 1.7, 0.85, 0.8, '#c8d0d8', 0, 0.75); _B(g, 1.72, 0.1, 0.82, '#e04848', 0, 1.22); _C(g, 0.03, 0.03, 1.6, '#6a707c', 0, 2.0, 0, 5); const u = M(geo('umb', () => new THREE.ConeGeometry(1.3, 0.5, 10, 1, true)), new THREE.MeshToonMaterial({ color: '#f2c14e', gradientMap: ramp(), side: THREE.DoubleSide }), 0, 2.75, 0, g); ink(u, 1.02); }, { emit: ['steam', 0, 1.3, 0.1, 2.5] });
// tech & games
hitem('boombox', 'tech', 'Boombox', 100, 0, 0.8, 0.4, { party: 2 }, g => { _B(g, 0.75, 0.42, 0.3, '#16181c', 0, 0.21); for (const sx of [-0.22, 0.22]) M(cyl(0.12, 0.12, 0.04, 12), toon('#b9bec7'), sx, 0.2, 0.16, g).rotation.x = Math.PI / 2; }, { anim: 'pulse' });
hitem('speaker', 'tech', 'Tower Speakers', 500, 1, 1.6, 0.6, { party: 4, tech: 1 }, g => { for (const sx of [-0.55, 0.55]) { _B(g, 0.5, 1.4, 0.45, '#16181c', sx, 0.7); for (const y of [0.45, 1.05]) M(cyl(0.17, 0.17, 0.04, 12), toon('#6a707c'), sx, y, 0.23, g).rotation.x = Math.PI / 2; } }, { anim: 'pulse' });
hitem('tv', 'tech', 'Outdoor Big Screen', 1500, 2, 2.4, 0.6, { tech: 5, comfort: 1 }, g => { _B(g, 2.3, 1.35, 0.12, '#16181c', 0, 1.55); const sc = M(box(2.1, 1.15, 0.02), flat(0x33e0ff), 0, 1.55, 0.07, g); sc.userData.tv = 1; for (const sx of [-0.9, 0.9]) _C(g, 0.04, 0.05, 0.9, '#3a3c44', sx, 0.45, 0, 6); }, { use: 'tv', anim: 'tv', glow: [0x33e0ff, 0, 1.55, 0.35, 2.6] });
hitem('arcade', 'tech', 'Arcade Cabinet', 1800, 2, 0.8, 0.8, { tech: 5, party: 1 }, g => { _B(g, 0.75, 1.8, 0.7, '#2440a8'); M(box(0.55, 0.42, 0.03), flat(0xff4fd8), 0, 1.3, 0.36, g); _B(g, 0.75, 0.1, 0.35, '#16181c', 0, 0.95, 0.4); M(box(0.6, 0.18, 0.03), flat(0xf2c14e), 0, 1.68, 0.36, g); M(sph(0.035, 6, 5), toon('#e04848'), -0.15, 1.02, 0.45, g); }, { use: 'arcade', glow: [0xff4fd8, 0, 1.3, 0.5, 1.6] });
hitem('dj', 'tech', 'DJ Booth', 3200, 3, 2.0, 1.0, { party: 8, tech: 3 }, g => { _B(g, 1.9, 1.0, 0.8, '#16181c'); M(box(1.9, 0.1, 0.82), flat(0xff2d78), 0, 0.3, 0, g); for (const sx of [-0.5, 0.5]) M(cyl(0.22, 0.22, 0.04, 16), toon('#3a3c44'), sx, 1.02, 0, g); for (let i = 0; i < 8; i++) { const b = M(box(0.12, 0.3, 0.02), flat([0x3dffa0, 0xf2c14e, 0xff2d78][i % 3]), -0.7 + i * 0.2, 0.65, 0.41, g); b.userData.eq = i; } }, { use: 'dj', anim: 'eq', glow: [0xff2d78, 0, 0.5, 0.6, 2.4] });
hitem('holo', 'tech', 'Holo Projector', 4800, 4, 1.0, 1.0, { tech: 8, drip: 2 }, g => { _C(g, 0.45, 0.5, 0.25, '#20242c'); M(cyl(0.3, 0.3, 0.03, 16), flat(0x33e0ff), 0, 0.27, 0, g); const h = grp(g, 0, 1.2, 0); const b = M(sph(0.28, 14, 10), new THREE.MeshBasicMaterial({ color: 0x33e0ff, wireframe: true, transparent: true, opacity: 0.8 }), 0, 0, 0, h); void b; M(geo('holoring', () => new THREE.TorusGeometry(0.45, 0.015, 6, 28)), flat(0x7de3ff), 0, 0, 0, h).rotation.x = Math.PI / 2; h.userData.spin = 1; }, { anim: 'spin', glow: [0x33e0ff, 0, 1.0, 0, 2.6] });
hitem('dish', 'tech', 'Satellite Dish', 700, 1, 1.2, 1.2, { tech: 3 }, g => { _C(g, 0.06, 0.08, 1.2, '#c8d0d8', 0, 0.6, 0, 6); const d = M(geo('dish', () => new THREE.SphereGeometry(0.55, 14, 8, 0, 6.3, 0, 1.1)), new THREE.MeshToonMaterial({ color: '#ece9e2', gradientMap: ramp(), side: THREE.DoubleSide }), 0, 1.35, 0, g); d.rotation.x = -1.0; ink(d, 1.02); });
// hoops & gym
hitem('rack', 'gym', 'Ball Rack', 200, 0, 1.2, 0.5, { hoops: 2 }, g => { _B(g, 1.1, 0.06, 0.4, '#6a707c', 0, 0.55); _B(g, 1.1, 0.06, 0.4, '#6a707c', 0, 0.2); for (const sx of [-0.5, 0.5]) _B(g, 0.05, 0.75, 0.4, '#3a3c44', sx, 0.38); for (let i = 0; i < 4; i++) { const b = makeBall(['bl_std', 'bl_rwb', 'bl_neon', 'bl_gold'][i]); b.position.set(-0.39 + i * 0.26, 0.7, 0); g.add(b); } });
hitem('cones', 'gym', 'Cone Set', 40, 0, 1.0, 1.0, { hoops: 1 }, g => { for (let i = 0; i < 4; i++) M(geo('conez', () => new THREE.ConeGeometry(0.1, 0.28, 8)), toon('#ff8a1f'), -0.35 + (i % 2) * 0.7, 0.14, -0.35 + Math.floor(i / 2) * 0.7, g); });
hitem('tires', 'gym', 'Tire Stack', 60, 0, 0.9, 0.9, { hoops: 1 }, g => { for (let i = 0; i < 3; i++) ink(M(geo('tire', () => new THREE.TorusGeometry(0.32, 0.12, 8, 16)), toon('#16181c'), 0, 0.12 + i * 0.22, 0, g), 1.03).rotation.x = Math.PI / 2; });
hitem('weights', 'gym', 'Weight Rack', 800, 1, 1.6, 0.7, { hoops: 4 }, g => { _B(g, 1.5, 0.08, 0.5, '#3a3c44', 0, 0.9); _B(g, 1.5, 0.08, 0.5, '#3a3c44', 0, 0.4); for (const sx of [-0.7, 0.7]) _B(g, 0.06, 1.0, 0.5, '#20242c', sx, 0.5); for (let i = 0; i < 5; i++) for (const y of [0.55, 1.05]) M(cyl(0.07 + i * 0.01, 0.07 + i * 0.01, 0.12, 10), toon('#16181c'), -0.55 + i * 0.27, y, 0, g).rotation.z = Math.PI / 2; }, { use: 'weights' });
hitem('bpress', 'gym', 'Bench Press', 1100, 2, 1.8, 1.0, { hoops: 5 }, g => { _B(g, 0.4, 0.45, 1.3, '#c8482c', 0, 0.25); for (const sx of [-0.55, 0.55]) _B(g, 0.06, 1.15, 0.06, '#3a3c44', sx, 0.58, -0.45); const bar = M(cyl(0.025, 0.025, 1.7, 6), toon('#c8d0d8'), 0, 1.08, -0.45, g); bar.rotation.z = Math.PI / 2; for (const sx of [-0.72, 0.72]) M(cyl(0.22, 0.22, 0.07, 14), toon('#16181c'), sx, 1.08, -0.45, g).rotation.z = Math.PI / 2; }, { use: 'bpress' });
hitem('bag', 'gym', 'Heavy Bag', 600, 1, 0.8, 0.8, { hoops: 3 }, g => { _B(g, 0.08, 2.2, 0.08, '#20242c', -0.35, 1.1); _B(g, 0.6, 0.06, 0.06, '#20242c', -0.08, 2.2); const b = grp(g, 0.2, 2.15, 0); ink(M(cyl(0.2, 0.2, 1.0, 12), toon('#c8482c'), 0, -0.85, 0, b), 1.04); b.userData.swing = 1; }, { anim: 'swing' });
hitem('minihoop', 'gym', 'Mini Hoop', 250, 0, 0.8, 0.8, { hoops: 3, party: 1 }, g => { _B(g, 0.06, 1.6, 0.06, '#c8d0d8', 0, 0.8, -0.3); _B(g, 0.6, 0.42, 0.04, '#ece9e2', 0, 1.65, -0.28); ink(M(geo('mrim', () => new THREE.TorusGeometry(0.15, 0.015, 6, 16)), toon('#ff6a1f'), 0, 1.5, -0.12, g), 1.1).rotation.x = Math.PI / 2; });
hitem('shotclock', 'gym', 'Shot Clock Pole', 1300, 2, 0.5, 0.5, { hoops: 4, tech: 2 }, g => { _C(g, 0.06, 0.06, 2.6, '#3a3c44', 0, 1.3, 0, 6); _B(g, 0.7, 0.45, 0.3, '#16181c', 0, 2.8); const t = sign('14', 0.55, 0.36, '#ff3a3a', '#16181c', { border: false }); t.position.set(0, 2.8, 0.16); g.add(t); t.userData.clock = 1; }, { anim: 'clock', glow: [0xff3a3a, 0, 2.8, 0.3, 1.3] });
// display
hitem('kicks', 'show', 'Sneaker Wall', 1600, 2, 2.4, 0.5, { drip: 8 }, g => { _B(g, 2.3, 1.9, 0.12, '#16181c', 0, 0.95, -0.15); const own = DRIP.filter(d => d.slot === 'shoes' && S.owned.includes(d.id)), list = own.length ? own : DRIP.filter(d => d.slot === 'shoes').slice(0, 3); for (let r = 0; r < 3; r++) { _B(g, 2.2, 0.04, 0.3, '#6a707c', 0, 0.45 + r * 0.55); for (let c = 0; c < 4; c++) { const k = list[(r * 4 + c) % list.length]; shoeProp(k.c, k.c2 || '#fff', -0.8 + c * 0.55, 0.55 + r * 0.55, 0, 0.3, g); } } }, { glow: [0xfff2c8, 0, 1.2, 0.3, 2.4] });
hitem('case', 'show', 'Trophy Case', 2000, 2, 1.4, 0.6, { drip: 5, hoops: 2 }, g => { _B(g, 1.3, 0.5, 0.55, '#3a2a1c', 0, 0.25); const gl = M(box(1.25, 1.1, 0.5), new THREE.MeshBasicMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.18, depthWrite: false }), 0, 1.05, 0, g); void gl; _B(g, 1.3, 0.06, 0.55, '#3a2a1c', 0, 1.62); const n = Math.max(2, Math.min(8, Object.keys(S.ach || {}).length)); for (let i = 0; i < n; i++) { M(cyl(0.07, 0.04, 0.18, 8), toon('#f2c14e'), -0.45 + (i % 4) * 0.3, 0.62 + Math.floor(i / 4) * 0.45, 0, g); } }, { use: 'case', glow: [0xfff2c8, 0, 1.0, 0, 1.6] });
hitem('jersey', 'show', 'Framed Jersey', 900, 1, 1.2, 0.3, { drip: 4 }, g => { _B(g, 0.08, 1.2, 0.08, '#3a3c44', -0.45, 0.6); _B(g, 0.08, 1.2, 0.08, '#3a3c44', 0.45, 0.6); _B(g, 1.0, 1.1, 0.06, '#16181c', 0, 1.55); const t = sign(S.name + '\n' + String(ovrOf(S.attrs) || 0), 0.85, 0.95, '#ece9e2', '#c8482c', { border: false }); t.position.set(0, 1.55, 0.04); g.add(t); });
hitem('mirror', 'show', 'Full Mirror', 300, 0, 0.9, 0.4, { drip: 2 }, g => { _B(g, 0.8, 1.8, 0.08, '#c8a840', 0, 0.95); M(box(0.66, 1.62, 0.02), flat(0xbfd8ee), 0, 0.95, 0.05, g); _B(g, 0.5, 0.06, 0.35, '#c8a840', 0, 0.03); }, { use: 'mirror' });
hitem('chain', 'show', 'Giant Chain', 5000, 4, 1.6, 0.6, { drip: 10 }, g => { _B(g, 1.4, 0.15, 0.5, '#16181c', 0, 0.08); _B(g, 0.1, 1.6, 0.1, '#16181c', 0, 0.9); for (let i = 0; i < 12; i++) { const a = i / 11 * Math.PI; ink(M(geo('link', () => new THREE.TorusGeometry(0.08, 0.025, 6, 10)), toon('#f2c14e'), Math.cos(a) * 0.55, 1.6 - Math.sin(a) * 0.8, 0.08, g), 1.1).rotation.y = i % 2 ? Math.PI / 2 : 0; } _B(g, 0.32, 0.32, 0.06, '#f2c14e', 0, 0.72, 0.08); }, { glow: [0xf2c14e, 0, 1.1, 0.2, 2] });
hitem('statue', 'show', 'Gold Statue of You', 12000, 6, 1.4, 1.4, { drip: 15, hoops: 3 }, g => { _C(g, 0.6, 0.7, 0.7, '#3a3c44', 0, 0.35, 0, 8); const r = makeRig(myBuild(), true); const gold = toon('#f2c14e'); r.root.traverse(o => { if (o.isMesh && o.material !== INK) o.material = gold; }); r.shadow.visible = false; r.root.position.set(0, 0.7, 0); r.root.scale.setScalar(0.85); g.add(r.root); applyPose(r, poseOf('dunk', 0, { u: 0.5, style: 'tomahawk' }), 10); }, { glow: [0xf2c14e, 0, 1.6, 0, 3] });
// lights
hitem('lamp', 'light', 'Street Lamp', 400, 1, 0.5, 0.5, { comfort: 1, party: 1 }, g => { _C(g, 0.06, 0.08, 3.6, '#20242c', 0, 1.8, 0, 6); M(sph(0.2, 8, 6), flat(0xffe0a0), 0, 3.7, 0, g); glow(0, 3.7, 0, 0xffd9a0, 2.4, g); }, { beam: [0xffd9a0, 3.6, 1.8] });
hitem('neonball', 'light', 'Neon "BALL"', 700, 1, 2.0, 0.4, { party: 3, drip: 2 }, g => { _B(g, 0.08, 1.2, 0.08, '#20242c', -0.8, 0.6); _B(g, 0.08, 1.2, 0.08, '#20242c', 0.8, 0.6); const s = sign('BALL', 1.9, 0.7, '#ff2d78', '#0a0a0e', { border: false }); s.position.set(0, 1.5, 0.02); g.add(s); }, { glow: [0xff2d78, 0, 1.5, 0.3, 3] });
hitem('fire', 'light', 'Fire Pit', 900, 2, 1.3, 1.3, { comfort: 4, party: 3 }, g => { _C(g, 0.6, 0.55, 0.35, '#5a5048', 0, 0.18, 0, 12); for (let i = 0; i < 4; i++) { const f = M(geo('flame', () => new THREE.ConeGeometry(0.2, 0.7, 5)), flat([0xff8a3c, 0xf2c14e, 0xff2d78, 0xffd28a][i]), rnd(-0.15, 0.15), 0.55, rnd(-0.15, 0.15), g); f.userData.flame = i; } glow(0, 0.7, 0, 0xff8a3c, 2.6, g, 0.7); }, { anim: 'flame', emit: ['spark', 0, 0.7, 0, 4] });
hitem('lava', 'light', 'Lava Lamp', 150, 0, 0.4, 0.4, { comfort: 1, tech: 1 }, g => { _C(g, 0.12, 0.15, 0.15, '#c8d0d8', 0, 0.08); M(cyl(0.08, 0.12, 0.5, 10), flat(0xff4fd8), 0, 0.4, 0, g); _C(g, 0.08, 0.06, 0.1, '#c8d0d8', 0, 0.7); glow(0, 0.4, 0, 0xff4fd8, 1, g); });
hitem('spot', 'light', 'Spotlight', 650, 1, 0.7, 0.7, { drip: 2, party: 2 }, g => { _B(g, 0.5, 0.12, 0.5, '#20242c', 0, 0.06); _C(g, 0.03, 0.03, 0.3, '#20242c', 0, 0.25, 0, 5); const h = M(cyl(0.18, 0.24, 0.4, 10), toon('#3a3c44'), 0, 0.5, 0.05, g); h.rotation.x = -0.7; glow(0, 0.6, 0.18, 0xfff2c8, 1.1, g); }, { beam: [0xfff2c8, 0.6, 1.2, 'up'] });
hitem('strings', 'light', 'String Light Posts', 500, 0, 3.0, 0.4, { party: 3, comfort: 2 }, g => { for (const sx of [-1.4, 1.4]) _C(g, 0.05, 0.06, 2.6, '#7a5a3a', sx, 1.3, 0, 6); for (let i = 1; i < 10; i++) { const u = i / 10, y = 2.5 - Math.sin(u * Math.PI) * 0.4; const c = [0xff2d78, 0xf2c14e, 0x7de3ff, 0xece9e2][i % 4]; M(sph(0.07, 6, 5), flat(c), -1.4 + u * 2.8, y, 0, g); glow(-1.4 + u * 2.8, y, 0, c, 0.6, g, 0.6); } });
// yard
hitem('planter', 'yard', 'Planter Box', 90, 0, 1.2, 0.5, { comfort: 2 }, g => { _B(g, 1.1, 0.4, 0.45, '#7a5a3a'); for (let i = 0; i < 5; i++) M(sph(0.12, 8, 6), toon(pick(['#ff2d78', '#f2c14e', '#ece9e2', '#a78bff'])), -0.4 + i * 0.2, 0.5, rnd(-0.08, 0.08), g); M(box(1.0, 0.12, 0.35), toon('#3a7a3a'), 0, 0.42, 0, g); });
hitem('palm', 'yard', 'Potted Palm', 300, 0, 0.8, 0.8, { comfort: 3 }, g => { _C(g, 0.3, 0.25, 0.5, '#c8482c'); _C(g, 0.06, 0.09, 1.8, '#8a6a44', 0, 1.3, 0, 6); for (let i = 0; i < 7; i++) { const l = M(box(0.9, 0.03, 0.22), toon('#2f8a4a'), Math.cos(i * 0.9) * 0.35, 2.15, Math.sin(i * 0.9) * 0.35, g); l.rotation.y = -i * 0.9; l.rotation.z = -0.45; } });
hitem('hedge', 'yard', 'Hedge', 200, 0, 2.0, 0.7, { comfort: 2 }, g => { for (let i = 0; i < 3; i++) ink(M(sph(0.42, 8, 6), toon('#2f6a3a'), -0.6 + i * 0.6, 0.45, 0, g), 1.03).scale.set(1, 1.1, 0.8); });
hitem('gnome', 'yard', 'Hooper Gnome', 120, 0, 0.4, 0.4, { drip: 1, comfort: 1 }, g => { _C(g, 0.12, 0.15, 0.3, '#2f6ad8'); M(sph(0.1, 8, 6), toon('#e0b090'), 0, 0.38, 0, g); M(geo('gh', () => new THREE.ConeGeometry(0.1, 0.25, 8)), toon('#e04848'), 0, 0.55, 0, g); M(sph(0.06, 8, 6), toon('#ff6a1f'), 0.14, 0.25, 0.05, g); });
hitem('flamingo', 'yard', 'Plastic Flamingo', 60, 0, 0.4, 0.4, { party: 1, comfort: 1 }, g => { _C(g, 0.01, 0.01, 0.5, '#20242c', 0, 0.25, 0, 4); ink(M(sph(0.12, 8, 6), toon('#ff4fd8'), 0, 0.58, 0, g), 1.05).scale.set(0.8, 0.8, 1.4); _C(g, 0.02, 0.02, 0.3, '#ff4fd8', 0, 0.78, 0.1, 5); M(sph(0.05, 6, 5), toon('#ff4fd8'), 0, 0.93, 0.13, g); });
hitem('pool', 'yard', 'Kiddie Pool', 350, 0, 2.0, 2.0, { party: 3, comfort: 2 }, g => { ink(M(cyl(0.95, 0.95, 0.3, 20, true), toon('#7de3ff'), 0, 0.15, 0, g), 1.02).material.side = THREE.DoubleSide; M(cyl(0.92, 0.92, 0.02, 20), flat(0x4ab8e8), 0, 0.25, 0, g); }, { floorish: 1 });
hitem('turf', 'yard', 'Turf Patch', 120, 0, 2.0, 2.0, { comfort: 1 }, g => { M(box(2.0, 0.03, 2.0), toon('#3a8a44'), 0, 0.015, 0, g); }, { floor: 1 });
hitem('rug', 'yard', 'Outdoor Rug', 200, 0, 2.0, 3.0, { comfort: 2 }, g => { M(box(2.0, 0.02, 3.0), toon('#c8482c'), 0, 0.01, 0, g); M(box(1.6, 0.025, 2.6), toon('#f2c14e'), 0, 0.012, 0, g); M(box(1.2, 0.03, 2.2), toon('#2440a8'), 0, 0.014, 0, g); }, { floor: 1 });
hitem('car', 'yard', 'Project Car', 6000, 4, 4.2, 2.0, { drip: 8, tech: 2 }, g => { _B(g, 4.0, 0.7, 1.8, '#ff2d78', 0, 0.75); _B(g, 2.0, 0.6, 1.6, '#16181c', -0.3, 1.4); M(box(1.9, 0.5, 1.62), flat(0x7de3ff, { transparent: true, opacity: 0.5 }), -0.3, 1.42, 0, g); for (const sx of [-1.3, 1.3]) for (const sz of [-0.85, 0.85]) { _B(g, 0.4, 0.4, 0.4, '#8a8f9c', sx, 0.2, sz * 0.8); } const h = _B(g, 1.0, 0.06, 1.7, '#ff2d78', 1.5, 1.4); h.rotation.z = 0.9; }, {});
// walls & art
hitem('fencep', 'wall', 'Fence Panel', 60, 0, 2.0, 0.2, {}, g => { for (let i = 0; i < 8; i++) _B(g, 0.22, 1.4, 0.05, '#8a6a44', -0.88 + i * 0.25, 0.7); _B(g, 2.0, 0.08, 0.08, '#6a5034', 0, 1.1, -0.06); });
hitem('brick', 'wall', 'Brick Wall', 180, 0, 2.0, 0.4, { drip: 1 }, g => { ink(M(box(2.0, 1.6, 0.35), brickMat('#7a4034', 2, 1.6), 0, 0.8, 0, g), 1.02); });
hitem('mural', 'wall', 'Mural Wall', 1400, 2, 3.0, 0.4, { drip: 6, party: 2 }, g => { ink(M(box(3.0, 2.4, 0.3), toon('#26262c'), 0, 1.2, 0, g), 1.02); }, { mural: 1 });
hitem('flagpole', 'wall', 'Banner Pole', 400, 0, 0.5, 0.5, { party: 2, drip: 1 }, g => { _C(g, 0.04, 0.05, 3.2, '#c8d0d8', 0, 1.6, 0, 6); const t = canvasTex(256, 128, (x, w, h) => { x.fillStyle = '#ff2d78'; x.fillRect(0, 0, w, h); x.fillStyle = '#0a0a0e'; x.font = '900 60px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.fillText('MY CRIB', w / 2, h * 0.65); }); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6, 8, 1), new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide })); f.position.set(0.62, 2.8, 0); g.add(f); f.userData.wave = 1; }, { anim: 'wave' });
hitem('arch', 'wall', 'Gate Arch', 2500, 3, 3.0, 0.6, { drip: 5, party: 2 }, g => { for (const sx of [-1.35, 1.35]) _B(g, 0.25, 2.8, 0.4, '#16181c', sx, 1.4); _B(g, 3.0, 0.5, 0.4, '#16181c', 0, 3.0); const s = sign(S.name, 2.6, 0.4, '#f2c14e', '#0a0a0e', { border: false }); s.position.set(0, 3.0, 0.21); g.add(s); M(box(2.9, 0.05, 0.05), flat(0xf2c14e), 0, 2.72, 0.2, g); }, { glow: [0xf2c14e, 0, 3.0, 0.4, 3.2], walk: 1 });
// tables: things stack on them (Habbo-style). Small things go on any top, or on the ground.
hitem('ctable', 'food', 'Coffee Table', 160, 0, 1.2, 0.7, { comfort: 2 }, g => { _B(g, 1.15, 0.07, 0.65, '#3a2a1c', 0, 0.4); for (const sx of [-0.5, 0.5]) for (const sz of [-0.27, 0.27]) _B(g, 0.06, 0.37, 0.06, '#20242c', sx, 0.18, sz); }, { top: 0.44 });
hitem('stable', 'food', 'Cable Spool Table', 90, 0, 0.9, 0.9, { comfort: 1, party: 1 }, g => { _C(g, 0.45, 0.45, 0.06, '#8a6a44', 0, 0.72, 0, 12); _C(g, 0.18, 0.18, 0.66, '#7a5a3a', 0, 0.36, 0, 10); _C(g, 0.45, 0.45, 0.06, '#8a6a44', 0, 0.03, 0, 12); }, { top: 0.75 });
hitem('bar', 'food', 'Yard Bar', 1300, 2, 2.0, 0.7, { party: 5, drip: 2 }, g => { _B(g, 1.95, 1.0, 0.6, '#16181c', 0, 0.5); _B(g, 2.0, 0.07, 0.7, '#c8a840', 0, 1.04); M(box(1.9, 0.06, 0.02), flat(0xff2d78), 0, 0.15, 0.31, g); }, { top: 1.08, glow: [0xff2d78, 0, 0.2, 0.5, 2] });
hitem('trophy', 'show', 'Trophy', 180, 0, 0.3, 0.3, { drip: 2, hoops: 1 }, g => { _B(g, 0.16, 0.06, 0.16, '#20242c', 0, 0.03); M(cyl(0.1, 0.05, 0.22, 8), toon('#f2c14e'), 0, 0.17, 0, g); M(cyl(0.02, 0.02, 0.06, 5), toon('#f2c14e'), 0, 0.3, 0, g); }, { small: 1 });
hitem('houseplant', 'yard', 'House Plant', 70, 0, 0.4, 0.4, { comfort: 2 }, g => { _C(g, 0.12, 0.1, 0.18, '#c8482c'); for (let i = 0; i < 5; i++) { const l = M(box(0.05, 0.3, 0.12), toon('#3a8a44'), Math.cos(i * 1.3) * 0.05, 0.3, Math.sin(i * 1.3) * 0.05, g); l.rotation.set(Math.sin(i) * 0.5, i * 1.3, Math.cos(i) * 0.5); } }, { small: 1 });
hitem('console', 'tech', 'Game Console', 250, 0, 0.4, 0.3, { tech: 2 }, g => { _B(g, 0.36, 0.08, 0.26, '#ece9e2', 0, 0.04); M(box(0.08, 0.02, 0.02), flat(0x33e0ff), 0.1, 0.06, 0.13, g); _B(g, 0.12, 0.04, 0.07, '#16181c', -0.08, 0.1, 0.03); }, { small: 1 });
hitem('bowl', 'food', 'Snack Bowl', 30, 0, 0.3, 0.3, { party: 1 }, g => { _C(g, 0.13, 0.08, 0.08, '#2f6ad8'); for (let i = 0; i < 6; i++) M(sph(0.035, 5, 4), toon('#f2c14e'), rnd(-0.06, 0.06), 0.09, rnd(-0.06, 0.06), g); }, { small: 1 });
hitem('radio', 'tech', 'Pocket Radio', 60, 0, 0.3, 0.2, { party: 1 }, g => { _B(g, 0.26, 0.16, 0.1, '#c8482c', 0, 0.08); M(cyl(0.05, 0.05, 0.02, 10), toon('#b9bec7'), 0.05, 0.08, 0.05, g).rotation.x = Math.PI / 2; _C(g, 0.005, 0.005, 0.2, '#6a707c', -0.1, 0.25, 0, 4); }, { small: 1, anim: 'pulse' });
hitem('candles', 'light', 'Candle Trio', 50, 0, 0.3, 0.3, { comfort: 1 }, g => { for (let i = 0; i < 3; i++) { M(cyl(0.03, 0.03, 0.1 + i * 0.04, 6), toon('#ece9e2'), -0.07 + i * 0.07, 0.05 + i * 0.02, 0, g); glow(-0.07 + i * 0.07, 0.13 + i * 0.04, 0, 0xffb060, 0.35, g, 0.7); } }, { small: 1 });
// ★ rares: one is on sale each day, and only that day. Collect them.
hitem('r_icecream', 'rare', 'Ice Cream Machine', 3500, 1, 1.0, 0.8, { party: 8, tech: 3 }, g => { _B(g, 0.9, 1.4, 0.7, '#ff9ac8'); M(box(0.6, 0.4, 0.04), flat(0xfff2c8), 0, 1.0, 0.36, g); for (let i = 0; i < 3; i++) M(sph(0.1, 8, 6), toon(['#ff2d78', '#ece9e2', '#7a4a2a'][i]), -0.25 + i * 0.25, 1.55, 0, g); _C(g, 0.05, 0.04, 0.2, '#c8d0d8', 0, 0.55, 0.38, 6); }, { rare: 1, glow: [0xff9ac8, 0, 1.0, 0.5, 2] });
hitem('r_dragon', 'rare', 'Neon Dragon Lamp', 6000, 2, 0.8, 0.8, { drip: 10, party: 4 }, g => { _C(g, 0.3, 0.35, 0.2, '#16181c'); const h = grp(g, 0, 0.9, 0); for (let i = 0; i < 9; i++) M(sph(0.08 - i * 0.004, 8, 6), flat(0x3dffa0), Math.sin(i * 0.8) * 0.25, i * 0.12 - 0.5, Math.cos(i * 0.8) * 0.25, h); M(geo('dhead', () => new THREE.ConeGeometry(0.1, 0.25, 6)), flat(0x3dffa0), Math.sin(7.2) * 0.25, 0.62, Math.cos(7.2) * 0.25, h).rotation.z = 1.3; h.userData.spin = 1; }, { rare: 1, anim: 'spin', glow: [0x3dffa0, 0, 1.0, 0, 2.6] });
hitem('r_goldhoop', 'rare', 'Golden Hoop Lamp', 5000, 2, 0.6, 0.6, { drip: 9, hoops: 4 }, g => { _C(g, 0.2, 0.25, 0.1, '#f2c14e'); _C(g, 0.03, 0.03, 1.4, '#f2c14e', 0, 0.75, 0, 6); ink(M(geo('ghr', () => new THREE.TorusGeometry(0.22, 0.03, 8, 20)), toon('#f2c14e'), 0, 1.5, 0.05, g), 1.08).rotation.x = Math.PI / 2; glow(0, 1.5, 0.05, 0xffd060, 1.4, g, 0.8); }, { rare: 1 });
hitem('r_throne', 'rare', 'Holo Throne', 9000, 4, 1.0, 1.0, { drip: 12, tech: 6 }, g => { _B(g, 0.8, 0.15, 0.7, '#20242c', 0, 0.45); _B(g, 0.8, 1.6, 0.15, '#20242c', 0, 1.25, -0.3); for (const sx of [-0.45, 0.45]) _B(g, 0.12, 0.5, 0.7, '#20242c', sx, 0.55); M(box(0.6, 1.3, 0.02), new THREE.MeshBasicMaterial({ color: 0x33e0ff, transparent: true, opacity: 0.5 }), 0, 1.3, -0.21, g); M(box(0.84, 0.04, 0.72), flat(0x33e0ff), 0, 0.53, 0, g); }, { rare: 1, sit: 0.53, glow: [0x33e0ff, 0, 1.2, -0.1, 2.4] });
hitem('r_fountain', 'rare', 'Soda Fountain', 7000, 3, 1.0, 1.0, { party: 12 }, g => { _C(g, 0.48, 0.5, 0.3, '#c8d0d8', 0, 0.15, 0, 14); M(cyl(0.44, 0.44, 0.02, 14), flat(0xff6a3d), 0, 0.29, 0, g); _C(g, 0.06, 0.08, 0.8, '#c8d0d8', 0, 0.7, 0, 8); _C(g, 0.25, 0.1, 0.12, '#c8d0d8', 0, 1.1, 0, 10); M(cyl(0.22, 0.22, 0.02, 12), flat(0xff6a3d), 0, 1.16, 0, g); }, { rare: 1, emit: ['spark', 0, 1.2, 0, 3], glow: [0xff6a3d, 0, 0.6, 0, 2] });
hitem('r_aquarium', 'rare', 'Aquarium', 8000, 3, 1.6, 0.6, { comfort: 10, tech: 3 }, g => { _B(g, 1.6, 0.6, 0.6, '#16181c', 0, 0.3); M(box(1.5, 0.8, 0.5), new THREE.MeshBasicMaterial({ color: 0x2a8ad8, transparent: true, opacity: 0.55, depthWrite: false }), 0, 1.0, 0, g); const f = grp(g, 0, 1.0, 0); for (let i = 0; i < 4; i++) M(sph(0.05, 6, 4), flat([0xff8a1f, 0xf2c14e, 0xff2d78, 0x3dffa0][i]), -0.5 + i * 0.3, (i % 2) * 0.2 - 0.1, (i % 2 ? 0.1 : -0.1), f).scale.set(1.6, 1, 0.6); f.userData.fish = 1; _B(g, 1.6, 0.06, 0.6, '#16181c', 0, 1.43); }, { rare: 1, anim: 'fish', glow: [0x2a8ad8, 0, 1.0, 0.3, 2.2] });
hitem('bed', 'seat', 'King Bed', 1100, 1, 2.0, 2.4, { comfort: 8 }, g => { _B(g, 1.9, 0.35, 2.3, '#3a2a1c', 0, 0.18); _B(g, 1.85, 0.25, 2.2, '#ece9e2', 0, 0.45); _B(g, 1.86, 0.08, 1.4, '#2440a8', 0, 0.6, 0.35); for (const sx of [-0.45, 0.45]) _B(g, 0.7, 0.14, 0.4, '#ece9e2', sx, 0.62, -0.85); _B(g, 1.95, 1.0, 0.12, '#3a2a1c', 0, 0.5, -1.12); }, { sit: 0.55 });
hitem('records', 'tech', 'Record Shelf', 450, 0, 1.4, 0.45, { party: 3, drip: 1 }, g => { _B(g, 1.35, 1.0, 0.4, '#5a4030', 0, 0.5); for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) M(box(0.02, 0.32, 0.3), toon(pick(['#e04848', '#2440a8', '#f2c14e', '#16181c', '#ece9e2', '#3dffa0'])), -0.55 + i * 0.13, 0.25 + r * 0.45, 0.02, g); M(cyl(0.18, 0.18, 0.04, 16), toon('#16181c'), 0.3, 1.04, 0, g); }, { top: 1.02 });
hitem('flamp', 'light', 'Arc Floor Lamp', 380, 0, 0.6, 0.6, { comfort: 2 }, g => { _C(g, 0.22, 0.25, 0.06, '#16181c', 0, 0.03); const a = M(cyl(0.025, 0.025, 2.0, 6), toon('#c8d0d8'), 0, 1.0, 0, g); void a; M(cyl(0.025, 0.025, 0.9, 6), toon('#c8d0d8'), 0.38, 1.95, 0, g).rotation.z = -1.2; M(geo('shade', () => new THREE.ConeGeometry(0.22, 0.24, 12, 1, true)), toon('#f2c14e'), 0.8, 1.72, 0, g).material.side = THREE.DoubleSide; glow(0.8, 1.6, 0, 0xffd8a0, 1.8, g, 0.7); }, { beam: [0xffd8a0, 1.6, 1.4] });
hitem('poster', 'wall', 'Framed Poster', 140, 0, 1.0, 0.2, { drip: 2 }, g => { const t = geoTex('pst', () => canvasTex(128, 160, (x, w, h) => { x.fillStyle = '#1a1030'; x.fillRect(0, 0, w, h); x.fillStyle = '#ff2d78'; x.font = '900 34px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.fillText('GOT', w / 2, 60); x.fillStyle = '#7de3ff'; x.fillText('NEXT', w / 2, 100); x.fillStyle = '#f2c14e'; x.font = '700 12px monospace'; x.fillText('RUN 01', w / 2, 140); })); _B(g, 0.06, 1.4, 0.06, '#16181c', 0, 0.7, -0.05); _B(g, 0.85, 1.05, 0.05, '#16181c', 0, 1.65, 0); M(new THREE.PlaneGeometry(0.75, 0.95), new THREE.MeshBasicMaterial({ map: t }), 0, 1.65, 0.03, g); });
const HOME_ITEM = {}; HOME_ITEMS.forEach(i => HOME_ITEM[i.id] = i);
const RARES = HOME_ITEMS.filter(i => i.rare);
function rareToday() { return RARES[dayHash(dayKey(), 31) % RARES.length]; }

// ---------- save, levels, perks ----------
function home() { if (!S.home) S.home = { lot: 0, items: [], store: {}, look: { house: 0, trim: 0, fence: 0, ground: 1 }, used: {}, tour: '' }; const h = S.home; h.items = (h.items || []).filter(i => HOME_ITEM[i.i]); h.store = h.store || {}; h.look = Object.assign({ house: 0, trim: 0, fence: 0, ground: 1 }, h.look || {}); h.used = h.used || {}; return h; }
function homeVibe() { const v = { comfort: 0, drip: 0, hoops: 0, tech: 0, party: 0 }, seen = {}; for (const it of allHomeItems()) { const d = HOME_ITEM[it.i]; seen[it.i] = (seen[it.i] || 0) + 1; const k = seen[it.i] <= 2 ? 1 : seen[it.i] <= 4 ? 0.5 : 0.2; for (const c in d.v) v[c] += d.v[c] * k; } for (const c in v) v[c] = Math.round(v[c]); return v; }
function homeLevel() { const v = homeVibe(), tot = Object.values(v).reduce((a, b) => a + b, 0); let l = 1; for (let i = 0; i < HOME_LEVELS.length; i++) if (tot >= HOME_LEVELS[i]) l = i + 1; return { lvl: l, tot, next: HOME_LEVELS[l] }; }
function homeSets() { const have = new Set(allHomeItems().map(i => i.i)); return HOME_SETS.map(s => ({ s, got: s.items.filter(x => have.has(x)).length, done: s.items.every(x => have.has(x)) })); }
function homeFx(k) { if (!S || !S.home) return 0; let v = 0; const L = homeLevel().lvl; for (const p of HOME_PERKS) if (p.lvl <= L && p.k === k) v += p.v; for (const s of homeSets()) if (s.done && s.s.k === k) v += s.s.v; return v; }
// ---------- your crib, online: friends can walk around it (packed small enough to ride in presence) ----------
const _e2 = v => clamp(Math.round(v * 2), 0, 1295).toString(36).padStart(2, '0');
function packHome() {
  const H = home(); const c = {}; for (const x of CRIB) c[x.id] = cribTier(x.id);
  return { n: S.name, l: H.lot | 0, k: [H.look.house, H.look.trim, H.look.fence, H.look.ground], c, lk: H.likes | 0,
    ri: homeRoom().items.slice(0, 60).map(it => HOME_ITEMS.indexOf(HOME_ITEM[it.i]).toString(36).padStart(2, '0') + _e2(it.x + 25) + _e2(it.z + 5) + (it.r & 3) + (it.y ? 1 : 0) + ((it.m || 0) % 5)).join(''), rk: [homeRoom().look.wall, homeRoom().look.floor],
    i: H.items.slice(0, 90).map(it => HOME_ITEMS.indexOf(HOME_ITEM[it.i]).toString(36).padStart(2, '0') + _e2(it.x + 25) + _e2(it.z + 5) + (it.r & 3) + (it.y ? 1 : 0) + ((it.m || 0) % 5)).join('') };
}
// anything from another player is checked: known pieces only, inside the lot, sane numbers
function unpackHome(p) {
  try {
    if (!p || typeof p.i !== 'string' || p.i.length > 900) return null;
    const parse = (str, max, zx) => { const out = []; if (typeof str !== 'string' || str.length > 9 * max) return out; for (let k = 0; k + 9 <= str.length && out.length < max; k += 9) { const q = str.slice(k, k + 9), d = HOME_ITEMS[parseInt(q.slice(0, 2), 36)]; if (!d) continue; const it = { i: d.id, x: clamp(parseInt(q.slice(2, 4), 36) / 2 - 25, zx[0], zx[1]), z: clamp(parseInt(q.slice(4, 6), 36) / 2 - 5, zx[2], zx[3]), r: (+q[6]) & 3, on: q[7] === '1', m: (+q[8]) || 0, y: 0 }; if (!isNaN(it.x) && !isNaN(it.z)) out.push(it); } for (const it of out) if (it.on) { const t = topUnder(itemRect(it), -1, out.filter(o => !o.on)); it.y = t ? t.h : 0; } return out; };
    const roomItems = parse(p.ri, 60, [ROOM.x0, ROOM.x1, ROOM.z0, ROOM.z1]), rk = Array.isArray(p.rk) ? p.rk : [], items = [];
    for (let k = 0; k + 9 <= p.i.length && items.length < 90; k += 9) {
      const s = p.i.slice(k, k + 9), d = HOME_ITEMS[parseInt(s.slice(0, 2), 36)]; if (!d) continue;
      const it = { i: d.id, x: clamp(parseInt(s.slice(2, 4), 36) / 2 - 25, -23.5, 23.5), z: clamp(parseInt(s.slice(4, 6), 36) / 2 - 5, -2.8, 23), r: (+s[6]) & 3, on: s[7] === '1', m: (+s[8]) || 0, y: 0 }; if (isNaN(it.x) || isNaN(it.z)) continue; items.push(it);
    }
    for (const it of items) if (it.on) { const t = topUnder(itemRect(it), -1, items.filter(o => !o.on)); it.y = t ? t.h : 0; }
    const k = Array.isArray(p.k) ? p.k : [], crib = {}; for (const x of CRIB) crib[x.id] = clamp((p.c && p.c[x.id]) | 0, 0, x.tiers.length - 1);
    return { name: String(p.n || 'SOMEONE').replace(/[<>&"]/g, '').slice(0, 14), crib, home: { room: { items: roomItems, look: { wall: clamp(rk[0] | 0, 0, ROOM_LOOKS.wall.length - 1), floor: clamp(rk[1] | 0, 0, ROOM_LOOKS.floor.length - 1) } }, lot: clamp(p.l | 0, 0, LOTS.length - 1), items, store: {}, used: {}, likes: clamp(p.lk | 0, 0, 99999), look: { house: clamp(k[0] | 0, 0, LOOKS.house.length - 1), trim: clamp(k[1] | 0, 0, LOOKS.trim.length - 1), fence: clamp(k[2] | 0, 0, LOOKS.fence.length - 1), ground: clamp(k[3] | 0, 0, LOOKS.ground.length - 1) } } };
  } catch (e) { return null; }
}
// the inside of the house: one big room you decorate (Habbo-style), its own walls and floor
const ROOM = { x0: -7.5, x1: 7.5, z0: -6, z1: 6, h: 4.2 };
const ROOM_LOOKS = {
  wall: [['Bare Plaster', '#b8b0a2', ''], ['Exposed Brick', '#8a4a38', 'brick'], ['Midnight Blue', '#26304a', ''], ['Hot Pink', '#c8326a', ''], ['Pinstripe', '#3a3448', 'stripe'], ['Neon Grid', '#140f24', 'grid'], ['Gold Leaf', '#a8842c', 'stripe'], ['Mint', '#6aa890', '']],
  floor: [['Worn Boards', 'boards'], ['Checker Tile', 'checker'], ['Shag Carpet', 'carpet'], ['Polished Concrete', 'concrete'], ['Hardwood Court', 'court'], ['Marble', 'marble']],
};
const ROOM_COST = { wall: 350, floor: 450 };
const YARD_ONLY = { car: 1, pool: 1, arch: 1, fencep: 1, dish: 1, turf: 1, hedge: 1 };
function homeRoom() { const H = home(); if (!H.room) H.room = { items: [], look: { wall: 0, floor: 0 } }; H.room.items = (H.room.items || []).filter(i => HOME_ITEM[i.i]); H.room.look = Object.assign({ wall: 0, floor: 0 }, H.room.look || {}); return H.room; }
function inRoom() { return !!(W && W.kind === 'room'); }
function homeList() { return inRoom() ? homeRoom().items : home().items; }
function allHomeItems() { return home().items.concat(homeRoom().items); }
function lotZones() { if (inRoom()) return [[ROOM.x0 + 0.2, ROOM.x1 - 0.2, ROOM.z0 + 0.2, ROOM.z1 - 0.2]]; const z = []; for (let i = 0; i <= (home().lot || 0); i++) z.push(...LOTS[i].zones); return z; }

// ---------- the crib ----------
function cribHouse(x0, x1, z0, z1, col, trim) {
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, h = 7.2;
  ink(M(box(w, h, d), brickMat(col, Math.max(w, d), h), cx, h / 2, cz, scene), 1.012); M(box(w + 0.5, 0.45, d + 0.5), toon('#16181c'), cx, h + 0.2, cz, scene);
  M(box(w + 0.3, 0.2, d + 0.3), toon(trim), cx, 3.6, cz, scene); M(box(w + 0.12, 0.9, d + 0.12), toon('#26262c'), cx, 0.45, cz, scene); solid(x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3);
  // windows on the court side (west) and the street side (south), some lit
  const win = (x, y, z, ry) => { const f = M(box(1.3, 1.5, 0.12), toon(trim), x, y, z, scene); f.rotation.y = ry; const lit = RNG() < 0.65, p = M(box(1.05, 1.25, 0.14), flat(lit ? 0xffd28a : 0x20222a), x, y, z, scene); p.rotation.y = ry; p.translateZ(0.01); if (lit) { const gx = x + Math.sin(ry) * 0.4, gz = z + Math.cos(ry) * 0.4; glow(gx, y, gz, 0xffc880, 2.2, null, 0.45); } };
  for (const z of [z0 + 1.6, z1 - 1.6]) { win(x0 - 0.02, 5.3, z, -Math.PI / 2); } win(x0 - 0.02, 1.9, z1 - 1.6, -Math.PI / 2);
  for (const x of [x0 + 1.8, cx, x1 - 1.8]) win(x, 5.3, z1 + 0.02, 0);
  // the door on the court side, a stoop, a porch light, an AC unit, a gutter
  const dz = z0 + 2.6; M(box(0.14, 2.3, 1.2), toon('#3a2a1c'), x0 - 0.05, 1.45, dz, scene); M(box(0.16, 2.5, 1.4), toon(trim), x0 - 0.02, 1.45, dz, scene).translateX(0.02);
  for (let i = 0; i < 3; i++) ink(M(box(0.5, 0.2, 1.8), toon('#8a8378'), x0 - 0.3 - i * 0.45, 0.5 - i * 0.18, dz, scene), 1.03); solid(x0 - 1.6, x0, dz - 1.0, dz + 1.0);
  M(sph(0.12, 8, 6), flat(0xffe0a0), x0 - 0.2, 2.9, dz - 0.9, scene); glow(x0 - 0.3, 2.9, dz - 0.9, 0xffd9a0, 2.4, null, 0.8); beam(x0 - 0.25, 2.85, dz - 0.9, x0 - 2.0, 0, dz - 0.6, 0xffd9a0, 1.6, 0.06, 4); pool(x0 - 1.4, dz - 0.5, 0xffd9a0, 3, 3, 0.25);
  ink(M(box(0.6, 0.5, 0.8), toon('#c8d0d8'), x0 - 0.35, 4.4, z1 - 2.8, scene), 1.04); M(cyl(0.05, 0.05, h, 5), toon('#6a707c'), x0 - 0.1, h / 2, z1 + 0.1, scene);
  return { doorX: x0 - 1.9, doorZ: dz };
}
function rowhouse(x, z, w, d, h, col, ry) {
  const g = grp(scene, x, 0, z); g.rotation.y = ry; ink(M(box(w, h, d), brickMat(col, Math.max(w, d), h), 0, h / 2, 0, g), 1.01); M(box(w + 0.4, 0.4, d + 0.4), toon('#16181c'), 0, h + 0.2, 0, g);
  for (let fl = 0; fl < Math.floor(h / 3); fl++) for (let i = 0; i < Math.floor(w / 2.2); i++) { const lit = RNG() < 0.55, wx = -w / 2 + 1.3 + i * 2.2, wy = 1.8 + fl * 3; M(box(1.1, 1.3, 0.1), flat(lit ? pick([0xffd28a, 0xffe9c0, 0x9fd8ff]) : 0x1a1c24), wx, wy, d / 2 + 0.04, g); if (lit && RNG() < 0.5) glow(wx, wy, d / 2 + 0.4, 0xffc880, 1.8, g, 0.35); }
  for (let i = 0; i < 3; i++) M(box(1.6, 0.2, 0.5), toon('#8a8378'), 0, 0.1 + i * 0.2, d / 2 + 0.25 + (2 - i) * 0.4, g);
  return g;
}
function car(x, z, ry, col) { const c = grp(scene, x, 0.45, z); c.rotation.y = ry; ink(M(box(4.0, 0.7, 1.8), toon(col), 0, 0.3, 0, c), 1.03); ink(M(box(2.0, 0.6, 1.6), toon('#16181c'), -0.2, 0.9, 0, c), 1.03); for (const sx of [-1.3, 1.3]) for (const sz of [-0.9, 0.9]) M(cyl(0.34, 0.34, 0.25, 12), toon('#16181c'), sx, -0.05, sz, c).rotation.x = Math.PI / 2; glow(2.05, 0.35, 0.6, 0xfff2c8, 0.6, c, 0.6); glow(-2.05, 0.35, 0.6, 0xff3a3a, 0.5, c, 0.6); return c; }
function groundTex(kind) {
  return geoTex('yard-' + kind, () => { const t = canvasTex(256, 256, (x, w, h) => {
    const base = { dirt: '#4a3c30', concrete: '#5a5c62', grass: '#2f5a32', pavers: '#6a5c50', turf: '#2a7a40' }[kind]; x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.03, 0.08)})`; x.fillRect(rnd(0, w), rnd(0, h), rnd(1, 4), rnd(1, 4)); }
    if (kind === 'pavers') { x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); for (let j = 0; j <= 4; j++) { const o = (i % 2) * 32; x.beginPath(); x.moveTo(o + j * 64, i * 32); x.lineTo(o + j * 64, i * 32 + 32); x.stroke(); } } }
    if (kind === 'concrete') { x.strokeStyle = 'rgba(0,0,0,.3)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2); }
    if (kind === 'turf') { x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 3; x.strokeRect(10, 10, w - 20, h - 20); }
    if (kind === 'grass' || kind === 'dirt') for (let i = 0; i < 160; i++) { x.strokeStyle = kind === 'grass' ? 'rgba(120,200,110,.35)' : 'rgba(90,110,60,.35)'; x.beginPath(); const px = rnd(0, w), py = rnd(0, h); x.moveTo(px, py); x.lineTo(px + rnd(-2, 2), py - rnd(3, 7)); x.stroke(); }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; });
}
function yard(z, kind, locked, mine) {
  const [x0, x1, z0, z1] = z, w = x1 - x0, d = z1 - z0, t = groundTex(locked ? 'dirt' : kind).clone(); t.needsUpdate = true; t.repeat.set(w / 3, d / 3);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshToonMaterial({ map: t, gradientMap: ramp() })); m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, 0.006, (z0 + z1) / 2); scene.add(m);
  if (locked) { const s = sign(mine ? 'FOR SALE\nASK AT THE BLUEPRINT TABLE' : 'FOR SALE', 2.4, 1.0, '#f2c14e', '#16181c'); s.position.set((x0 + x1) / 2, 1.3, (z0 + z1) / 2); scene.add(s); M(cyl(0.05, 0.05, 1.0, 5), toon('#7a5a3a'), (x0 + x1) / 2, 0.5, (z0 + z1) / 2 - 0.05, scene); for (let i = 0; i < 10; i++) ink(M(sph(0.2, 6, 5), toon('#3a5a2a'), rnd(x0 + 0.5, x1 - 0.5), 0.12, rnd(z0 + 0.5, z1 - 0.5), scene), 1.04).scale.set(1, 0.6, 1); }
}
function lotFence(style, owner, likes) {
  const h = style === 'wood' ? 1.8 : 2.6, segs = [[-24, -3.6, 24, -3.6], [-24, -3.6, -24, 23.6], [24, -3.6, 24, 23.6], [-24, 23.6, -1.8, 23.6], [1.8, 23.6, 24, 23.6]];
  for (const [ax, az, bx, bz] of segs) {
    const len = Math.hypot(bx - ax, bz - az), cx = (ax + bx) / 2, cz = (az + bz) / 2, ry = Math.atan2(bx - ax, bz - az) - Math.PI / 2;
    if (style === 'wood') { const n = Math.round(len / 0.26); const g = grp(scene, cx, 0, cz); g.rotation.y = ry; for (let i = 0; i < n; i++) M(box(0.22, h, 0.05), toon(i % 2 ? '#8a6a44' : '#7a5a3a'), -len / 2 + i * 0.26 + 0.13, h / 2, 0, g); }
    else { const t = fenceTex(); t.repeat.set(len / 1.2, h / 1.2); const m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.position.set(cx, h / 2, cz); m.rotation.y = ry; scene.add(m); }
    if (style === 'neon') { const r = M(box(len, 0.06, 0.06), flat(0xff2d78), cx, h + 0.05, cz, scene); r.rotation.y = ry; const gg = glow(cx, h, cz, 0xff2d78, 1, null, 0.35); gg.scale.set(len * 0.5, 1.2, 1); }
    M(box(len, 0.08, 0.08), toon('#59606c'), cx, h, cz, scene).rotation.y = ry;
  }
  // the gate posts, and a name over the gate
  for (const sx of [-1, 1]) ink(M(box(0.3, 3.4, 0.3), toon('#16181c'), sx * 1.9, 1.7, 23.6, scene), 1.06);
  ink(M(box(4.1, 0.75, 0.2), toon('#16181c'), 0, 3.6, 23.6, scene), 1.03);
  if (likes) { const lk = sign('♥ ' + likes, 1.1, 0.4, '#ff2d78', '#0a0a0e', { border: false }); lk.position.set(0, 2.9, 23.48); lk.rotation.y = Math.PI; scene.add(lk); }
  for (const sd of [1, -1]) { const s = sign(owner + "'S", 3.4, 0.6, '#7de3ff', '#0a0a0e'); s.position.set(0, 3.6, 23.6 + sd * 0.11); s.rotation.y = sd > 0 ? 0 : Math.PI; scene.add(s); glow(0, 3.6, 23.6 + sd * 0.45, 0x7de3ff, 3, null, 0.45); }
}
function buildCrib() {
  const V = W.visit, ct = id => V ? (V.crib[id] || 0) : cribTier(id), H = V ? V.home : home(), look = H.look, owner = V ? V.name : S.name; W.hd = H;
  const fl = ct('floor'), hp = ct('hoop');
  scene.background = new THREE.Color(0x2c2840); scene.fog = new THREE.Fog(0x2c2840, 40, 140);
  baseLights(scene, 0xffe0c8, 0x3a3050, 0xffd0a0, 1.45);
  for (const [x, z, c] of [[-16, 6, 0xffc880], [16, 11, 0xffc880], [0, 20, 0x7de3ff]]) { const l = new THREE.PointLight(c, 10, 16, 1.4); l.position.set(x, 3.6, z); scene.add(l); }
  const g2 = M(new THREE.PlaneGeometry(300, 300), toon('#26282e'), 0, -0.03, 0, scene); g2.rotation.x = -Math.PI / 2;
  addCourt(scene, ['drive', 'black', 'show', 'wood'][fl], hp);
  skyline(scene, 30, 70, ['#ffc531', '#ffe9a8', '#33e0ff'], 10);
  // the yards (owned ones paved your way, the rest for sale), the court-side strips, the house
  LOTS.forEach((L, i) => L.zones.forEach(z => yard(z, LOOKS.ground[look.ground][1], i > (H.lot || 0), !V)));
  for (const z of [[-11.5, -9, -2.8, 15], [9, 11.6, -2.8, 15], [-9, 9, 15, 16.4], [-23.5, 23.5, 15, 16.4], [11.6, 23.5, 7, 8]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(z[1] - z[0], z[3] - z[2]), toon('#3a3c42')); m.rotation.x = -Math.PI / 2; m.position.set((z[0] + z[1]) / 2, 0.004, (z[2] + z[3]) / 2); scene.add(m); }
  const hs = cribHouse(12, 22, -3, 7, LOOKS.house[look.house][1], LOOKS.trim[look.trim][1]);
  lotFence(LOOKS.fence[look.fence][1], owner, H.likes | 0); W.baseSolids = null;
  solid(-24.5, -23.6, -4, 24); solid(23.6, 24.5, -4, 24); solid(-24.5, 24.5, -4.4, -3.4); solid(-24.5, -1.8, 23.4, 24.2); solid(1.8, 24.5, 23.4, 24.2);
  spot(hs.doorX, hs.doorZ, 1.9, V ? 'GO INSIDE' : 'GO INSIDE (closet, your room)', () => enterWorld('room', 0, ROOM.z1 - 2.3, Math.PI, V ? { visit: V } : undefined));
  if (!V) {
  // blueprint table: the home builder
  { const g = grp(scene, 9.9, 0, 9.6); g.rotation.y = -Math.PI / 2; ink(M(box(1.8, 0.08, 1.0), toon('#2440a8'), 0, 0.9, 0, g), 1.04); M(box(1.6, 0.01, 0.8), flat(0x7de3ff), 0, 0.95, 0, g); for (const sx of [-0.8, 0.8]) for (const sz of [-0.4, 0.4]) M(box(0.06, 0.9, 0.06), toon('#20242c'), sx, 0.45, sz, g); const s = sign('BLUEPRINTS', 1.6, 0.36, '#7de3ff', '#0a0a14', { border: false }); s.position.set(0, 1.4, 0); g.add(s); glow(0, 1.0, 0, 0x7de3ff, 1.8, g, 0.5); solid(9.3, 10.5, 8.6, 10.6); }
  spot(9.9, 11.4, 1.8, 'BUILD MODE (B)', () => buildEnter());
  // the old upgrade bench, now beside the blueprints
  ink(M(box(1.6, 0.9, 0.8), toon('#7a5a3a'), 10.2, 0.45, 13.4, scene), 1.04); const ws = sign('CRIB UPGRADES', 2, 0.5, '#ffc531', '#20242c'); ws.position.set(10.2, 1.5, 13.4); ws.rotation.y = -Math.PI / 2; scene.add(ws); solid(9.4, 11, 13, 13.8);
  spot(9.4, 14.6, 1.6, 'CRIB UPGRADES', () => uiCrib());
  spot(-4.5, 9.5, 1.8, 'DRILLS', () => uiDrills('crib'));
  spot(0, 6.5, 2.2, 'SHOOT AROUND', () => startPractice('free'));
  } else spot(0, 21.2, 1.8, '♥ LIKE THIS CRIB (L)', () => likeCrib());
  spot(0, 22.6, 1.8, 'BACK TO THE BLOCK', () => enterWorld('hub', -12.4, 5.8, Math.PI / 2));
  // upgrade props, courtside
  const t = ct;
  if (t('couch') === 0) ink(M(box(0.5, 0.45, 0.5), toon('#e04848'), -9.8, 0.23, 6, scene), 1.05);
  else { const c = toon(t('couch') === 2 ? '#7a2a8a' : '#2a6a4a'); ink(M(box(1.0, 0.5, 2.6), c, -9.9, 0.35, 6, scene), 1.03); ink(M(box(0.3, 1.0, 2.6), c, -10.4, 0.6, 6, scene), 1.03); if (t('couch') === 2) M(box(0.1, 1.4, 2.6), flat(0xff4fd8), -10.6, 0.8, 6, scene); }
  solid(-10.9, -9.2, 4.6, 7.4);
  if (t('trophy')) { ink(M(box(0.4, 2.4, 3.2), toon('#3a2a1c'), -10.6, 1.2, 10.5, scene), 1.02); const n = [0, 3, 7, 12][t('trophy')]; for (let i = 0; i < n; i++) { const tx = -10.3, ty = 0.75 + Math.floor(i / 4) * 0.7, tz = 9.3 + (i % 4) * 0.8; M(cyl(0.1, 0.05, 0.22, 8), toon('#ffc531'), tx, ty + 0.11, tz, scene); M(box(0.14, 0.06, 0.14), toon('#20242c'), tx, ty - 0.02, tz, scene); } solid(-11, -10.2, 8.8, 12.2); }
  if (t('printer')) { ink(M(box(0.9, 1.5, 0.9), toon(t('printer') === 2 ? '#c8482c' : '#c8d0d8'), 6, 0.75, 15.6, scene), 1.03); M(box(0.6, 0.4, 0.05), flat(0x33ff88), 6, 1.1, 15.14, scene); const s = sign(t('printer') === 2 ? 'STEAK\nFABRICATOR' : 'PROTEIN\nPRINTER', 1.2, 0.6, '#33ff88', '#0a0a14'); s.position.set(6, 2, 15.6); s.rotation.y = Math.PI; scene.add(s); solid(5.4, 6.6, 15, 16.2); }
  if (t('shotdoc')) { ink(M(box(1.2, 1.8, 1.0), toon('#2440a8'), -6, 0.9, 15.6, scene), 1.03); M(cyl(0.3, 0.3, 0.6, 10), toon('#ff7a1f'), -6, 2.1, 15.4, scene).rotation.x = 1.1; const s = sign(t('shotdoc') === 2 ? 'SHOT SURGEON 9000' : 'SHOT DOCTOR 3000', 2, 0.4, '#33e0ff', '#0a0a14'); s.position.set(-6, 2.9, 15.6); s.rotation.y = Math.PI; scene.add(s); solid(-6.8, -5.2, 15, 16.2); }
  if (t('sign') === 1) { const s = sign('LIVE LAUGH LAYUP', 4, 0.9, '#ff4fd8', '#0a0a14'); s.position.set(11.68, 3.0, 1); s.rotation.y = -Math.PI / 2; scene.add(s); glow(11.2, 3.0, 1, 0xff4fd8, 1, null, 0.5).scale.set(4.6, 1.8, 1); }
  if (t('sign') === 2) { const s = sign('★ ' + S.name + ' ★\nGREATEST EVER (SELF-REPORTED)', 8, 4, '#ffc531', '#0a0a14'); s.position.set(0, 7, -5); scene.add(s); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), -3, 2.5, -5.2, scene); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), 3, 2.5, -5.2, scene); glow(0, 7, -4.6, 0xffc531, 1, null, 0.4).scale.set(9, 5, 1); }
  if (t('flag')) { const big = t('flag') === 2, hgt = big ? 22 : 7; M(cyl(0.1, 0.14, hgt, 8), toon('#c8d0d8'), -10.2, hgt / 2, -2.6, scene); const ft = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); }); W.flag = new THREE.Mesh(new THREE.PlaneGeometry(big ? 9 : 3, big ? 5.4 : 1.8, 10, 1), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide })); W.flag.position.set(-10.2 + (big ? 4.6 : 1.6), hgt - (big ? 2.8 : 1), -2.6); scene.add(W.flag); solid(-10.5, -9.9, -2.9, -2.3); }
  // the street out front, parked cars, lamps, and the neighbors
  { const st = new THREE.Mesh(new THREE.PlaneGeometry(120, 6), toon('#1e2026')); st.rotation.x = -Math.PI / 2; st.position.set(0, 0.002, 27.5); scene.add(st); M(box(120, 0.16, 0.4), toon('#6a6c72'), 0, 0.08, 24.4, scene); M(box(120, 0.16, 0.4), toon('#6a6c72'), 0, 0.08, 30.6, scene);
    for (let x = -56; x < 60; x += 4) M(box(2, 0.01, 0.15), flat(0xd8c060), x, 0.01, 27.5, scene);
    car(-12, 25.6, 0, '#7de3ff'); car(9, 25.6, 0, '#ece9e2'); car(-4, 29.4, Math.PI, '#a78bff'); car(18, 29.4, Math.PI, '#e04848');
    for (const x of [-20, -6, 8, 22]) lamp(x, 24.9, 0xffd9a0);
    const cols = ['#6a5040', '#7a4034', '#4a4f5c', '#5a4640', '#8a8378', '#3a4a5a'];
    for (let i = 0; i < 6; i++) rowhouse(-30 + i * 12, 37, 11, 8, 8 + (i % 3) * 2, cols[i], Math.PI);
    for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) rowhouse(sx * 31, 2 + i * 13, 12, 8, 9 + i * 2, cols[(i + (sx > 0 ? 2 : 0)) % 6], sx * -Math.PI / 2);
    M(box(60, 9, 1), brickMat('#3a3034', 60, 9), 0, 4.5, -8, scene); mural(owner.split(' ')[0] + '\nHOME COURT', 9, 5, ['#141418', '#7de3ff', '#ff2d78', '#ece9e2', '#08080a'], -14, 4.4, -7.45, 0);
  }
  // people on the street
  const nb = []; for (let i = 0; i < 2; i++) { const b = aiBuild(55); b.worn = randomWorn(1); nb.push(addNpc(b, -18 + i * 30, 31.2, Math.PI, i ? 'sit' : 'idle', { talk: 'neighbor' })); }
  W.baseSolids = W.solids.slice(); W.baseSpots = W.spots.slice();     /* fixed things only; placed pieces are added on top */
  buildHomeItems(); if (!V) homeVisitors();
  pigeons(-6, 27, 5); pigeons(15, 19, 4); litter(10, -24, 24, 24.6, 30.4); skyLife(70, 'MORTGAGES FOR MINORS · ASK US'); W.weather = weather();
  chatter(W.npcs, n => n.homie ? CHAT.homie : n.talk ? CHAT[n.talk] : CHAT.neighbor);
  // first visit of the day at a Tour Stop crib: tourists paid to look
  if (!V && homeFx('tour') && S.home.tour !== dayKey()) { S.home.tour = dayKey(); S.vc += homeFx('tour'); save(); setTimeout(() => toast('CRIB TOURS', `Tourists paid ${homeFx('tour')} VC to look at your crib today.`, 'ach'), 1200); }
  W.bounds = [-23.4, 23.4, -2.9, 23.2]; W.camBox = [-24, 24, -3.4, 30];
}
// ---------- inside the house ----------
function roomFloorTex(kind) {
  return geoTex('rf-' + kind, () => { const t = canvasTex(256, 256, (x, w, h) => {
    if (kind === 'checker') { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? '#1c1c22' : '#e8e4da'; x.fillRect(i * 32, j * 32, 32, 32); } }
    else if (kind === 'boards' || kind === 'court') { for (let i = 0; i < 8; i++) { x.fillStyle = kind === 'court' ? ['#c8925a', '#be8850', '#d09a60'][i % 3] : ['#6a4a30', '#5e4128', '#74513a'][i % 3]; x.fillRect(0, i * 32, w, 32); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, i * 32, w, 2); x.fillRect((i * 97) % w, i * 32, 2, 32); } if (kind === 'court') { x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 4; x.beginPath(); x.arc(w / 2, h / 2, 60, 0, 6.3); x.stroke(); } }
    else if (kind === 'carpet') { x.fillStyle = '#6a2a5a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '255,120,200' : '40,0,40'},${rnd(0.05, 0.15)})`; x.fillRect(rnd(0, w), rnd(0, h), 2, 2); } }
    else if (kind === 'marble') { x.fillStyle = '#e6e2dc'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(120,110,100,.35)'; for (let i = 0; i < 14; i++) { x.lineWidth = rnd(0.5, 2); x.beginPath(); let px = rnd(0, w), py = rnd(0, h); x.moveTo(px, py); for (let j = 0; j < 6; j++) { px += rnd(-40, 40); py += rnd(-40, 40); x.lineTo(px, py); } x.stroke(); } x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 2; x.strokeRect(0, 0, w, h); }
    else { x.fillStyle = '#7a7c82'; x.fillRect(0, 0, w, h); for (let i = 0; i < 800; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.03, 0.07)})`; x.fillRect(rnd(0, w), rnd(0, h), rnd(1, 4), rnd(1, 4)); } }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; });
}
function roomWallMat(look, w, h) {
  const [, col, pat] = look; if (pat === 'brick') return brickMat(col, w, h);
  const t = geoTex('rw-' + col + pat, () => { const c = canvasTex(256, 256, (x, W_, H_) => { x.fillStyle = col; x.fillRect(0, 0, W_, H_);
    if (pat === 'stripe') for (let i = 0; i < 8; i++) { x.fillStyle = 'rgba(255,255,255,.07)'; x.fillRect(i * 32, 0, 12, H_); }
    else if (pat === 'grid') { x.strokeStyle = '#ff2d78'; x.globalAlpha = 0.5; x.lineWidth = 2; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, H_); x.stroke(); x.beginPath(); x.moveTo(0, i * 32); x.lineTo(W_, i * 32); x.stroke(); } }
    else for (let i = 0; i < 600; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.02, 0.05)})`; x.fillRect(rnd(0, W_), rnd(0, H_), rnd(1, 5), rnd(1, 5)); } }); c.wrapS = c.wrapT = THREE.RepeatWrapping; return c; });
  const tt = t.clone(); tt.needsUpdate = true; tt.repeat.set(w / 3, h / 3); return new THREE.MeshToonMaterial({ map: tt, gradientMap: ramp(), transparent: true, side: THREE.DoubleSide });
}
function buildRoom() {
  const V = W.visit, H = V ? V.home : home(), R = V ? (H.room || { items: [], look: { wall: 0, floor: 0 } }) : homeRoom(), look = R.look, owner = V ? V.name : S.name, Rm = ROOM;
  W.hd = { items: R.items };
  scene.background = new THREE.Color(0x0e0c14); scene.fog = null; baseLights(scene, 0xffe8d0, 0x302838, 0xffd8b0, 1.55);
  for (const [x, z] of [[-3.5, -2], [3.5, -2], [0, 3]]) { const l = new THREE.PointLight(0xffc890, 14, 11, 1.3); l.position.set(x, 3.6, z); scene.add(l); }
  const w = Rm.x1 - Rm.x0, d = Rm.z1 - Rm.z0, ft = roomFloorTex(ROOM_LOOKS.floor[look.floor][1]).clone(); ft.needsUpdate = true; ft.repeat.set(w / 3, d / 3);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshToonMaterial({ map: ft, gradientMap: ramp() })); fl.rotation.x = -Math.PI / 2; scene.add(fl);
  const g2 = M(new THREE.PlaneGeometry(200, 200), toon('#08080c'), 0, -0.05, 0, scene); g2.rotation.x = -Math.PI / 2;
  // four walls (they fade when the camera is behind them, so build mode can look in from above)
  W.walls = []; const wl = ROOM_LOOKS.wall[look.wall];
  for (const [cx, cz, len, ry, nx, nz] of [[0, Rm.z0, w, 0, 0, 1], [0, Rm.z1, w, Math.PI, 0, -1], [Rm.x0, 0, d, Math.PI / 2, 1, 0], [Rm.x1, 0, d, -Math.PI / 2, -1, 0]]) {
    const g = grp(scene, cx, 0, cz); g.rotation.y = ry; const m = new THREE.Mesh(new THREE.PlaneGeometry(len, Rm.h), roomWallMat(wl, len, Rm.h)); m.position.y = Rm.h / 2; g.add(m);
    M(box(len, 0.16, 0.06), toon('#16181c'), 0, 0.08, 0.03, g); M(box(len, 0.08, 0.06), toon('#16181c'), 0, Rm.h, 0.03, g); W.walls.push({ g, mats: [], nx, nz, cx, cz }); g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; W.walls[W.walls.length - 1].mats.push(o.material); } });
  }
  // windows on the back wall: the city at night
  const city = geoTex('roomcity', () => canvasTex(256, 160, (x, W_, H_) => { const g = x.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#1a1440'); g.addColorStop(1, '#3a1840'); x.fillStyle = g; x.fillRect(0, 0, W_, H_); for (let i = 0; i < 14; i++) { const bx = i * 19, bh = rnd(40, 120); x.fillStyle = '#0c0c16'; x.fillRect(bx, H_ - bh, 17, bh); for (let j = 0; j < 10; j++) if (Math.random() < 0.5) { x.fillStyle = pick(['#ffc531', '#ffe9a8', '#33e0ff', '#ff2d78']); x.fillRect(bx + 3 + (j % 3) * 5, H_ - bh + 6 + Math.floor(j / 3) * 10, 3, 4); } } }));
  for (const wx of [-4.2, 0, 4.2]) { const f = grp(scene, wx, 2.3, Rm.z0 + 0.04); M(box(2.4, 1.7, 0.08), toon('#16181c'), 0, 0, 0, f); M(new THREE.PlaneGeometry(2.2, 1.5), new THREE.MeshBasicMaterial({ map: city }), 0, 0, 0.05, f); M(box(0.06, 1.5, 0.1), toon('#16181c'), 0, 0, 0.06, f); glow(wx, 2.3, Rm.z0 + 0.6, 0x6a4ac8, 2.6, null, 0.25); }
  // the door back outside, the wardrobe, a pendant light, the owner's name over the door
  { const fw = W.walls[1], g = grp(fw.g, 0, 0, 0.05); M(box(1.4, 2.5, 0.1), toon('#3a2a1c'), 0, 1.25, 0, g); M(sph(0.05, 6, 5), toon('#f2c14e'), 0.5, 1.2, 0.08, g); const s = sign(owner + "'S ROOM", 2.6, 0.45, '#7de3ff', '#0a0a0e', { border: false }); s.position.set(0, 3.1, 0.06); g.add(s);
    g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; fw.mats.push(o.material); } }); }      /* the door and its sign fade with their wall */
  spot(0, Rm.z1 - 0.9, 1.4, 'BACK OUTSIDE', () => { const v = W.visit; enterWorld('crib', 10.1, -0.4, -Math.PI / 2, v ? { visit: v } : undefined); });
  if (!V) { const g = grp(scene, Rm.x0 + 0.45, 0, -3.2); g.rotation.y = Math.PI / 2; ink(M(box(2.0, 2.3, 0.8), toon('#5a4030'), 0, 1.15, 0, g), 1.02); M(box(0.04, 2.1, 0.02), toon('#16181c'), 0, 1.15, 0.41, g); for (const sx of [-0.12, 0.12]) M(sph(0.04, 6, 5), toon('#f2c14e'), sx, 1.2, 0.43, g); solid(Rm.x0, Rm.x0 + 0.9, -4.3, -2.1); spot(Rm.x0 + 1.5, -3.2, 1.3, 'CLOSET (drip)', () => uiShop(true)); spot(Rm.x0 + 1.5, -1.2, 1.2, 'BUILD MODE (B)', () => buildEnter()); }
  M(cyl(0.01, 0.01, 1.2, 4), toon('#16181c'), 0, Rm.h - 0.6, 0, scene); M(cyl(0.35, 0.15, 0.3, 12, true), toon('#f2c14e'), 0, Rm.h - 1.3, 0, scene).material.side = THREE.DoubleSide; glow(0, Rm.h - 1.4, 0, 0xffd8a0, 2.4, null, 0.7); pool(0, 0, 0xffd8a0, 7, 7, 0.18);
  W.baseSolids = W.solids.slice(); W.baseSpots = W.spots.slice();
  buildHomeItems(); if (!V) homeVisitors();
  chatter(W.npcs, n => n.homie ? CHAT.homie : CHAT.neighbor);
  W.bounds = [Rm.x0 + 0.35, Rm.x1 - 0.35, Rm.z0 + 0.35, Rm.z1 - 0.35]; W.camBox = [Rm.x0 - 7, Rm.x1 + 7, Rm.z0 - 7, Rm.z1 + 7];      /* the camera may sit behind a wall: that wall fades (same camera as outside) */
}
// a wall between the camera and the room turns see-through
function roomWallsStep() {
  if (!W || !W.walls) return; const c = camera.position;
  for (const w of W.walls) { const behind = (c.x - w.cx) * w.nx + (c.z - w.cz) * w.nz < (W.build ? 3 : 0.3), o = behind ? 0.07 : 1;      /* from above in build mode the near wall goes early */ for (const m of w.mats) { m.opacity += (o - m.opacity) * 0.25; m.depthWrite = m.opacity > 0.9; } }
}
// every placed item: its mesh, its footprint (you bump into it), its spot (if it does something), its animation
function itemRect(it) { const d = HOME_ITEM[it.i], r = it.r & 1, w = r ? d.d : d.w, dd = r ? d.w : d.d; return [it.x - w / 2, it.x + w / 2, it.z - dd / 2, it.z + dd / 2]; }
function makeItem(d, it) {
  const g = new THREE.Group(); d.build(g); g.position.set(it.x, it.y || 0, it.z); g.rotation.y = it.r * Math.PI / 2;
  if (d.mural) { const texts = ['HOME\nCOURT', S.name.split(' ')[0] + '\nWAS HERE', 'WINNERS\nSTAY', 'BALL\nIS LIFE', 'NO\nREFS']; const m = (it.m || 0) % texts.length; const tex = muralTex(texts[m]); const p = M(new THREE.PlaneGeometry(2.9, 2.3), new THREE.MeshBasicMaterial({ map: tex }), 0, 1.2, 0.16, g); void p; }
  if (d.glow) { const [c, x, y, z, s] = d.glow; glow(x, y, z, c, s, g, 0.55); }
  return g;
}
function muralTex(text) { return geoTex('mur-' + text, () => canvasTex(512, 400, (c, w, h) => { c.fillStyle = '#1a1030'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { const gg = c.createRadialGradient(rnd(0, w), rnd(0, h), 4, rnd(0, w), rnd(0, h), rnd(60, 180)); gg.addColorStop(0, pick(['#ff2d78cc', '#7de3ffcc', '#f2c14ecc'])); gg.addColorStop(1, '#00000000'); c.fillStyle = gg; c.fillRect(0, 0, w, h); } const L = text.split('\n'); c.font = '900 110px Archivo, Impact, sans-serif'; c.textAlign = 'center'; c.lineWidth = 14; c.strokeStyle = '#0a0a0e'; L.forEach((l, i) => { c.save(); c.translate(w / 2, h / 2 + (i - (L.length - 1) / 2) * 120 + 40); c.transform(1, 0, -0.15, 1, 0, 0); c.strokeText(l, 0, 0); c.fillStyle = i ? '#7de3ff' : '#ff2d78'; c.fillText(l, 0, 0); c.restore(); }); })); }
function buildHomeItems() {
  if (W.homeG) scene.remove(W.homeG); W.homeG = grp(scene); W.homeAnim = []; AMB.emit = AMB.emit.filter(e => !e.home);
  const sol = [], sp = [], H = W.hd || home();
  for (const it of H.items) {
    const d = HOME_ITEM[it.i], g = makeItem(d, it); W.homeG.add(g); const r = itemRect(it);
    if (!d.floor && !d.walk && !d.floorish) sol.push([r[0] - 0.12, r[1] + 0.12, r[2] - 0.12, r[3] + 0.12]);
    if (d.emit) { const [k, x, y, z, rate] = d.emit, c = Math.cos(it.r * Math.PI / 2), s = Math.sin(it.r * Math.PI / 2); AMB.emit.push({ kind: k, x: it.x + x * c + z * s, y, z: it.z - x * s + z * c, rate, acc: 0, home: 1 }); }
    if (d.beam) { const [c, h, rr, up] = d.beam, fx = Math.sin(it.r * Math.PI / 2), fz = Math.cos(it.r * Math.PI / 2); const b = up ? beam(it.x + fx * 0.2, h, it.z + fz * 0.2, it.x + fx * 4, h + 8, it.z + fz * 4, c, rr, 0.06) : beam(it.x, h, it.z, it.x, 0, it.z, c, rr, 0.05); W.homeG.attach(b); if (!up) { const p = pool(it.x, it.z, c, 3.6, 3.6, 0.25); W.homeG.attach(p); } }
    if (d.anim) W.homeAnim.push({ g, k: d.anim });
    const fx = Math.sin(it.r * Math.PI / 2), fz = Math.cos(it.r * Math.PI / 2), half = (it.r & 1 ? d.w : d.d) / 2 + 0.5;
    if (d.use) sp.push({ x: it.x + fx * half, z: it.z + fz * half, r: 1.4, label: { fridge: 'GRAB A SNACK (daily)', weights: 'LIFT (daily)', bpress: 'BENCH (daily)', tv: 'WATCH HIGHLIGHTS', arcade: 'PLAY BASKETBALL 2146 (DEMO)', dj: 'SPIN A SET', mirror: 'MIRROR (drip)', case: 'TROPHIES' }[d.use], fn: () => homeUse(d.use, it) });
    if (d.sit) sp.push({ x: it.x + fx * half, z: it.z + fz * half, r: 1.1, label: 'SIT DOWN', fn: () => homeSit(d, it) });
  }
  W.solids = (W.baseSolids || W.solids).concat(sol); W.spots = (W.baseSpots || W.spots).concat(sp);
}
function homeUse(k, it) {
  if (W.visit && k !== 'dj' && k !== 'tv' && k !== 'arcade') return toast('NOT YOUR CRIB', 'Ask ' + W.visit.name + ' first.');
  const H = home(), today = dayKey(), done = H.used[k] === today;
  if (k === 'fridge') { if (done) return toast('FRIDGE', 'Empty until tomorrow. Somebody ate the last soy dog.'); H.used[k] = today; S.boosts.push('dog'); save(); toast('YARD FRIDGE', 'Soy dog loaded: +4 Stamina next game.'); sfx('coin'); }
  else if (k === 'weights' || k === 'bpress') { if (done) return toast('ALREADY LIFTED', 'Your arms filed a complaint. Come back tomorrow.'); H.used[k] = today; const c = k === 'weights' ? 'F' : 'D'; S.bxp[c] += 30; while (S.bxp[c] >= 100) { S.bxp[c] -= 100; S.bp[c]++; } save(); toast(k === 'weights' ? 'LEG DAY' : 'CHEST DAY', `+30 ${CATS[c][0]} badge XP.`); sfx('uiok'); }
  else if (k === 'tv') { const L = S.life || {}; uiDialog('HIGHLIGHTS', `Your career so far: ${L.games || 0} games, ${L.wins || 0} wins, ${L.pts || 0} points, ${L.dunks || 0} dunks, ${L.ankles || 0} ankles broken, ${L.greens || 0} greens. The commentator calls you "a real person who exists".`, [['Nice', null]]); }
  else if (k === 'arcade') uiDialog('BASKETBALL 2146 (DEMO DISC)', 'It is a 40 minute loading screen, then a menu asking you to pre-order the full game. You beat your high score of 0.', [['Again', null], ['Walk away', null, 'alt']]);
  else if (k === 'dj') { W.party = !W.party; for (const n of W.npcs) if (n.homie || n.visitor) n.anim = W.party ? 'dance' : n.anim0; toast(W.party ? 'SET STARTED' : 'SET OVER', W.party ? 'Everybody on the lot is dancing.' : 'Back to regular hanging out.'); sfx('uiok'); }
  else if (k === 'mirror') uiShop(true);
  else if (k === 'case') uiPlayer('ach');
}
function homeSit(d, it) { const fx = Math.sin(it.r * Math.PI / 2), fz = Math.cos(it.r * Math.PI / 2), o = d.sitZ || 0; W.me.sit = { x: it.x + fx * o, z: it.z + fz * o, face: it.r * Math.PI / 2, y: (d.sit || 0.45) - 0.45 }; }
// homies and neighbors come by once the crib is good enough, and use what is there
function homeVisitors() {
  const L = homeLevel().lvl; if (L < 3) return; const seats = [], party = homeList().some(i => i.i === 'dj' || i.i === 'speaker' || i.i === 'boombox');
  for (const it of homeList()) { const d = HOME_ITEM[it.i]; if (d.sit) { const fx = Math.sin(it.r * Math.PI / 2), fz = Math.cos(it.r * Math.PI / 2), o = d.sitZ || 0; seats.push({ x: it.x + fx * o, z: it.z + fz * o, face: it.r * Math.PI / 2, y: d.sit - 0.45 }); } }
  const who = (S.homies || []).slice(0, 3).map(b => ({ b: JSON.parse(JSON.stringify(b)), homie: true }));
  if (inRoom()) who.splice(2); else if (L >= 4) for (let i = who.length; i < 4; i++) { const b = aiBuild(60); b.worn = randomWorn(2); who.push({ b, homie: false }); }
  who.forEach((w, i) => {
    const s = seats[i]; let n;
    if (s) { n = addNpc(w.b, s.x, s.z, s.face, 'sit', { homie: w.homie, visitor: true }); n.yFix = s.y; }
    else { const z = lotZones()[0]; if (inRoom() && !w.homie) return; n = addNpc(w.b, rnd(z[0] + 1, z[1] - 1), rnd(z[2] + 1, z[3] - 1), rnd(0, 6), party && L >= 6 ? 'dance' : pick(['idle', 'idle', 'ball']), { homie: w.homie, visitor: true, wander: true, range: 2 }); }
    n.anim0 = n.anim; if (w.homie) n.rig.root.add(nameTag(w.b.name, 'homie', n.rig.H));
  });
}
function homeAnimStep(dt) {
  roomWallsStep();
  if (!W.homeAnim) return; const t = W.t;
  for (const a of W.homeAnim) a.g.traverse(o => {
    const u = o.userData; if (!u) return;
    if (a.k === 'pulse' && o.isMesh && o.geometry && o.geometry.type === 'CylinderGeometry') { const p = 1 + Math.max(0, Math.sin(t * 11.4)) * 0.1; o.scale.set(p, 1, p); }
    if (u.eq !== undefined) { const v = 0.3 + Math.abs(Math.sin(t * (6 + u.eq * 1.3) + u.eq)) * 0.8; o.scale.y = v * 2; }
    if (u.tv) o.material.color.setHSL((t * 0.05) % 1, 0.7, 0.55 + Math.sin(t * 9) * 0.04);
    if (u.spin) { o.rotation.y = t * 1.5; o.position.y = 1.2 + Math.sin(t * 2) * 0.06; }
    if (u.swing) o.rotation.z = Math.sin(t * 2.2) * 0.12;
    if (u.flame !== undefined) { o.scale.set(1, 0.7 + Math.abs(Math.sin(t * (9 + u.flame * 2) + u.flame)) * 0.8, 1); }
    if (u.wave) { const pa = o.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 3 + t * 4) * 0.08 * (pa.getX(i) + 0.6)); pa.needsUpdate = true; }
    if (u.clock && (u.ct = (u.ct || 0) + dt) > 1) { u.ct = 0; }
    if (u.fish) o.children.forEach((f, i) => { f.position.x = Math.sin(t * (0.5 + i * 0.13) + i * 2) * 0.6; f.rotation.y = Math.cos(t * (0.5 + i * 0.13) + i * 2) > 0 ? 0 : Math.PI; });
  });
}

// ---------- build mode ----------
const BLD = { cat: 'seat', on: false };
function buildEnter() {
  if (!W || (W.kind !== 'crib' && W.kind !== 'room') || W.visit) return; uiClose(); home();
  W.build = { x: Math.round(W.me.x * 2) / 2, z: Math.round(W.me.z * 2) / 2, yaw: 0, sel: null, rot: 0, ghost: null, pick: null, hover: -1 };
  BLD.on = true; document.body.classList.add('building'); buildPanel(); buildZonesShow(true); sfx('uiok');
}
function buildExit() {
  if (!W || !W.build) return; buildGhost(null); buildZonesShow(false); W.build = null; BLD.on = false; document.body.classList.remove('building'); const el = $('build'); if (el) el.style.display = 'none'; save(); sfx('ui');
}
function buildZonesShow(on) {
  if (W.zoneG) { scene.remove(W.zoneG); W.zoneG = null; } if (!on) return;
  W.zoneG = grp(scene); const L = home().lot || 0;
  if (inRoom()) { const z = lotZones()[0], pts = []; for (let x = Math.ceil(z[0]); x <= z[1]; x++) pts.push(x, 0.03, z[2], x, 0.03, z[3]); for (let zz = Math.ceil(z[2]); zz <= z[3]; zz++) pts.push(z[0], 0.03, zz, z[1], 0.03, zz); const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); W.zoneG.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0x7de3ff, transparent: true, opacity: 0.35 }))); return; }
  LOTS.forEach((lot, i) => lot.zones.forEach(z => {
    const w = z[1] - z[0], d = z[3] - z[2], own = i <= L, g = new THREE.GridHelper(1, 1); void g;
    const pts = []; for (let x = Math.ceil(z[0]); x <= z[1]; x++) pts.push(x, 0.03, z[2], x, 0.03, z[3]); for (let zz = Math.ceil(z[2]); zz <= z[3]; zz++) pts.push(z[0], 0.03, zz, z[1], 0.03, zz);
    const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); W.zoneG.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: own ? 0x7de3ff : 0xff8a3c, transparent: true, opacity: own ? 0.35 : 0.25 })));
    const e = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: own ? 0x7de3ff : 0xff8a3c, transparent: true, opacity: 0.06, depthWrite: false })); e.rotation.x = -Math.PI / 2; e.position.set((z[0] + z[1]) / 2, 0.02, (z[2] + z[3]) / 2); W.zoneG.add(e);
  }));
}
const _ghostOK = new THREE.MeshBasicMaterial({ color: 0x3dffa0, transparent: true, opacity: 0.5, depthWrite: false }), _ghostBad = new THREE.MeshBasicMaterial({ color: 0xff3a3a, transparent: true, opacity: 0.5, depthWrite: false });
function buildGhost(id) {
  const B = W.build; if (B.ghost) { scene.remove(B.ghost); B.ghost = null; } B.sel = id; if (!id) return;
  const d = HOME_ITEM[id], g = makeItem(d, { i: id, x: 0, z: 0, r: 0 }); g.position.set(0, 0, 0); g.rotation.y = 0;
  const shell = grp(null); shell.add(g); g.traverse(o => { if (o.isMesh) o.material = _ghostOK; if (o.isSprite) o.visible = false; });
  const pad = M(geo('pad', () => new THREE.PlaneGeometry(1, 1)), _ghostOK, 0, 0.03, 0, shell); pad.rotation.x = -Math.PI / 2; pad.scale.set(d.w, d.d, 1); shell.userData.pad = pad;
  B.ghost = shell; scene.add(shell);
}
// can it go here: inside the yards you own, clear of the house, the court-side furniture and other things (rugs and turf
// only clash with rugs and turf; anything can stand on them)
// what a small thing would stand on here: the highest table top that holds its whole footprint
function topUnder(R, ignore, list) { let best = null; (list || homeList()).forEach((o, k) => { const dd = HOME_ITEM[o.i]; if (k === ignore || !dd.top || o.y) return; const q = itemRect(o); if (R[0] >= q[0] - 0.02 && R[1] <= q[1] + 0.02 && R[2] >= q[2] - 0.02 && R[3] <= q[3] + 0.02 && (!best || dd.top > best.h)) best = { k, h: dd.top }; }); return best; }
const layerOf = (it, d) => d.floor ? 0 : it.y ? 2 : 1;
function buildFits(id, x, z, r, ignore) {
  const d = HOME_ITEM[id], it = { i: id, x, z, r }, R = itemRect(it), e = 0.001;
  if (d.small) { const t = topUnder(R, ignore); if (t) { it.y = t.h; for (let k = 0; k < homeList().length; k++) { const o = homeList()[k]; if (k === ignore || !o.y) continue; const q = itemRect(o); if (R[0] < q[1] - e && R[1] > q[0] + e && R[2] < q[3] - e && R[3] > q[2] + e) return 'Overlaps ' + HOME_ITEM[o.i].n; } return ''; } }
  if (inRoom() && YARD_ONLY[id]) return 'That goes outside';
  if (!lotZones().some(Z => R[0] >= Z[0] - e && R[1] <= Z[1] + e && R[2] >= Z[2] - e && R[3] <= Z[3] + e)) return inRoom() ? 'Against the wall' : 'Outside the yards you own';
  if (!d.floor) for (const s of W.baseSolids || []) if (R[0] < s[1] - 0.05 && R[1] > s[0] + 0.05 && R[2] < s[3] - 0.05 && R[3] > s[2] + 0.05) return 'Something is in the way';
  for (let k = 0; k < homeList().length; k++) { if (k === ignore) continue; const o = homeList()[k]; if (layerOf(o, HOME_ITEM[o.i]) !== layerOf(it, d)) continue; const q = itemRect(o); if (R[0] < q[1] - e && R[1] > q[0] + e && R[2] < q[3] - e && R[3] > q[2] + e) return 'Overlaps ' + HOME_ITEM[o.i].n; }
  if (homeList().length >= (inRoom() ? 60 : 90) && ignore === undefined) return inRoom() ? 'The room is full (60 pieces)' : 'The crib is full (90 pieces)';
  return '';
}
function buildItemAt(x, z) { const H = home(); let best = -1, bl = -1; for (let k = homeList().length - 1; k >= 0; k--) { const it = homeList()[k], q = itemRect(it), l = layerOf(it, HOME_ITEM[it.i]); if (x >= q[0] - 0.1 && x <= q[1] + 0.1 && z >= q[2] - 0.1 && z <= q[3] + 0.1 && l > bl) { best = k; bl = l; } } return best; }
function buildPlace() {
  const B = W.build, H = home(); if (!B.sel) { const k = buildItemAt(B.x, B.z); if (k >= 0) buildPickUp(k); return; }
  const why = buildFits(B.sel, B.x, B.z, B.rot, B.pick === null ? undefined : -1); if (why) { toast("CAN'T PUT THAT THERE", why); sfx('no'); return; }
  const d = HOME_ITEM[B.sel];
  if (B.pick === null) { if ((H.store[B.sel] || 0) > 0) H.store[B.sel]--; else { if (S.vc < d.cost) { toast('NOT ENOUGH VC', `${d.n} costs ${d.cost} VC.`); sfx('no'); return; } S.vc -= d.cost; } }
  const lv0 = homeLevel().lvl, sets0 = homeSets().filter(s => s.done).length;
  if (HOME_ITEM[B.sel].rare && B.pick === null && !(H.store[B.sel] > 0) && rareToday().id !== B.sel) { toast('NOT TODAY', 'That rare is only sold on its day.'); return; }
  const t = HOME_ITEM[B.sel].small ? topUnder(itemRect({ i: B.sel, x: B.x, z: B.z, r: B.rot })) : null;
  homeList().push({ i: B.sel, x: B.x, z: B.z, r: B.rot, m: Math.floor(Math.random() * 5), y: t ? t.h : 0 }); if (t) sfx('uiok'); B.pick = null; sfx('buy'); buildHomeItems(); save(); uiHud();
  const lv = homeLevel().lvl, sets = homeSets(); if (lv > lv0) { const p = HOME_PERKS.find(x => x.lvl === lv); toast('CRIB LEVEL ' + lv, p ? p.n + ': ' + p.d : 'The vibe is rising.', 'rank'); sfx('unlock'); }
  if (sets.filter(s => s.done).length > sets0) { const s = sets.find(x => x.done && x.s.items.includes(homeList()[homeList().length - 1].i)); if (s) { toast('SET COMPLETE · ' + s.s.n, s.s.d, 'ach'); sfx('unlock'); } }
  if (!((H.store[B.sel] || 0) > 0) && S.vc < d.cost) buildGhost(null);
  buildPanel();
}
function buildPickUp(k) { const B = W.build, H = home(), it0 = homeList()[k];
  if (HOME_ITEM[it0.i].top && !it0.y) { const q = itemRect(it0), on = homeList().filter(o => o.y && (() => { const r = itemRect(o); return r[0] >= q[0] - 0.05 && r[1] <= q[1] + 0.05 && r[2] >= q[2] - 0.05 && r[3] <= q[3] + 0.05; })()); if (on.length) { for (const o of on) H.store[o.i] = (H.store[o.i] || 0) + 1; { const L = homeList(), keep = L.filter(o => !on.includes(o)); L.length = 0; L.push(...keep); } k = homeList().indexOf(it0); toast('CLEARED THE TABLE', on.length + ' thing' + (on.length > 1 ? 's' : '') + ' went to storage.'); } }
  const it = homeList().splice(k, 1)[0]; buildHomeItems(); buildGhost(it.i); B.rot = it.r; B.pick = it; B.x = it.x; B.z = it.z; sfx('ui'); buildPanel(); }
function buildCancel() { const B = W.build; if (B.pick) { homeList().push(B.pick); B.pick = null; buildHomeItems(); } buildGhost(null); buildPanel(); }
function buildStore() { const B = W.build, H = home(); if (B.pick) { H.store[B.pick.i] = (H.store[B.pick.i] || 0) + 1; toast('STORED', HOME_ITEM[B.pick.i].n + ' is in storage.'); B.pick = null; buildGhost(null); save(); buildPanel(); return; } const k = buildItemAt(B.x, B.z); if (k >= 0) { const it = homeList().splice(k, 1)[0]; H.store[it.i] = (H.store[it.i] || 0) + 1; buildHomeItems(); save(); toast('STORED', HOME_ITEM[it.i].n + ' is in storage.'); buildPanel(); } }
function buildSell() { const B = W.build, H = home(); let id = null; if (B.pick) { id = B.pick.i; B.pick = null; buildGhost(null); } else { const k = buildItemAt(B.x, B.z); if (k >= 0) { id = homeList().splice(k, 1)[0].i; buildHomeItems(); } } if (!id) return; const v = Math.round(HOME_ITEM[id].cost * 0.5); S.vc += v; save(); uiHud(); toast('SOLD', `${HOME_ITEM[id].n} for ${v} VC.`); sfx('coin'); buildPanel(); }
function buildRotate() { const B = W.build; B.rot = (B.rot + 1) % 4; sfx('ui'); }
function buildPanel() {
  let el = $('build'); if (!el) { el = document.createElement('div'); el.id = 'build'; document.body.appendChild(el); el.addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (!b) return; e.stopPropagation(); audioInit(); BLD.act[b.dataset.b](b.dataset.v); }); }
  const H = home(), lv = homeLevel(), v = homeVibe(), B = W.build, sets = homeSets();
  const items = HOME_ITEMS.filter(i => i.cat === BLD.cat), r = rankOf(S.rep), rt = rareToday();
  el.style.display = 'block';
  el.innerHTML = `<div class="bt"><div><b>CRIB LEVEL ${lv.lvl}</b> <span class="mu">VIBE ${lv.tot}${lv.next ? ' / ' + lv.next : ' · MAX'}</span></div><div class="vb">${VIBES.map(([k, n, c]) => `<span style="color:${c}">${n} ${v[k]}</span>`).join('')}</div><div class="vc">VC ${S.vc.toLocaleString()}</div>
    <div class="bb"><button data-b="sets">SETS ${sets.filter(s => s.done).length}/${HOME_SETS.length}</button><button data-b="lot">${inRoom() ? 'ROOM LOOK' : 'LOT & LOOK'}</button><button data-b="cam">⟳ VIEW</button><button data-b="exit" class="x">DONE</button></div></div>
    <div class="bact">${B && B.sel ? `<button data-b="rot">↻ ROTATE (R)</button><button data-b="place" class="go">PLACE (E)</button>${B.pick ? '<button data-b="store">STORE (F)</button>' : ''}${B.pick ? '<button data-b="sell">SELL (X)</button>' : ''}<button data-b="cancel">CANCEL</button>` : `<button data-b="place">PICK UP (E)</button><button data-b="store">STORE (F)</button><button data-b="sell">SELL ½ (X)</button>`}<span class="hint">${B && B.sel ? HOME_ITEM[B.sel].n + (B.pick ? ' · moving' : (H.store[B.sel] ? ' · from storage' : ' · ' + HOME_ITEM[B.sel].cost + ' VC')) : 'Point at something you placed to pick it up, store it or sell it. Or pick something below.'}</span></div>
    <div class="bcat">${HOME_CATS.map(([k, n]) => `<button data-b="cat" data-v="${k}" class="${k === BLD.cat ? 'on' : ''}">${n}</button>`).join('')}<button data-b="cat" data-v="store" class="${BLD.cat === 'store' ? 'on' : ''}">STORAGE ${Object.values(H.store).reduce((a, b) => a + b, 0)}</button></div>
    <div class="bitems">${(BLD.cat === 'store' ? HOME_ITEMS.filter(i => H.store[i.id] > 0) : items).map(i => { const st = H.store[i.id] || 0, off = i.rare && i.id !== rt.id && !st, lock = (i.rank > r && !st) || off; return `<button data-b="pick" data-v="${i.id}" class="card ${B && B.sel === i.id ? 'sel' : ''} ${lock ? 'lock' : ''}" ${lock ? 'disabled' : ''}><b>${i.rare ? '★ ' : ''}${i.n}</b><small>${st ? 'IN STORAGE ×' + st : off ? 'BACK ON ITS DAY' : i.rank > r ? 'RANK: ' + RANKS[i.rank].n : (i.rare ? 'TODAY ONLY · ' : '') + i.cost + ' VC'}</small><i>${Object.entries(i.v).map(([k, x]) => `<em style="color:${VIBES.find(q => q[0] === k)[2]}">+${x} ${k}</em>`).join(' ') || '&nbsp;'}</i>${HOME_SETS.filter(s => s.items.includes(i.id)).map(s => `<u>${s.n}</u>`).join('')}</button>`; }).join('') || '<p class="mu">Nothing in storage.</p>'}</div>`;
}
BLD.act = {
  exit: () => buildExit(), rot: () => buildRotate(), place: () => buildPlace(), store: () => buildStore(), sell: () => buildSell(), cancel: () => buildCancel(),
  cam: () => { W.build.yaw = (W.build.yaw + 1) % 4; }, cat: v => { BLD.cat = v; buildPanel(); },
  pick: id => { const B = W.build; if (B.pick) buildCancel(); buildGhost(id); B.rot = 0; buildPanel(); },
  sets: () => uiHomeSets(), lot: () => uiHomeLot(),
};
function buildStep(dt) {
  const B = W.build, I = IN[0]; if (!B) return; const busy = !!UI.cur;
  // move the cursor, relative to the view
  const a = B.yaw * Math.PI / 2, fx = -Math.sin(a), fz = -Math.cos(a), rx = -fz, rz = fx;
  if (!busy) { const sp = I.sprint ? 12 : 6; B.fx = (B.fx === undefined ? B.x : B.fx) + (fx * -I.my + rx * I.mx) * sp * dt; B.fz = (B.fz === undefined ? B.z : B.fz) + (fz * -I.my + rz * I.mx) * sp * dt; }
  if (B.mouse) { B.fx = B.mouse[0]; B.fz = B.mouse[1]; B.mouse = null; }
  if (inRoom()) { B.fx = clamp(B.fx, ROOM.x0, ROOM.x1); B.fz = clamp(B.fz, ROOM.z0, ROOM.z1); } else { B.fx = clamp(B.fx, -23.5, 23.5); B.fz = clamp(B.fz, -2.8, 23); } const gs = B.sel && HOME_ITEM[B.sel].small ? 4 : 2; B.x = Math.round(B.fx * gs) / gs; B.z = Math.round(B.fz * gs) / gs;      /* small things snap to a quarter metre */
  if (B.sel) { const d = HOME_ITEM[B.sel]; if ((B.rot & 1 ? d.d : d.w) % 1 !== 0 && (B.rot & 1 ? d.d : d.w) * 2 % 2 === 1) { /* half-metre footprints sit on the half grid */ } }
  if (!busy) { if (I.aP) buildPlace(); if (I.bP) buildRotate(); if (I.back) buildExit(); }
  if (!W.build) return;
  if (B.ghost) { const tu = HOME_ITEM[B.sel].small ? topUnder(itemRect({ i: B.sel, x: B.x, z: B.z, r: B.rot }), B.pick ? -1 : undefined) : null; B.ghost.position.set(B.x, tu ? tu.h : 0, B.z); B.ghost.rotation.y = B.rot * Math.PI / 2; const ok = !buildFits(B.sel, B.x, B.z, B.rot, B.pick ? -1 : undefined); if (ok !== B.ok) { B.ok = ok; B.ghost.traverse(o => { if (o.isMesh) o.material = ok ? _ghostOK : _ghostBad; }); } B.ghost.children[0].position.y = 0.04 + Math.sin(W.t * 6) * 0.03; }
  // hover outline on placed things
  const k = B.sel ? -1 : buildItemAt(B.x, B.z); if (k !== B.hover) { B.hover = k; if (W.hoverBox) { scene.remove(W.hoverBox); W.hoverBox = null; } if (k >= 0) { const q = itemRect(homeList()[k]); const bx = new THREE.Box3(new THREE.Vector3(q[0], 0, q[2]), new THREE.Vector3(q[1], 1.6, q[3])); W.hoverBox = new THREE.Box3Helper(bx, 0x7de3ff); scene.add(W.hoverBox); } }
  if (!W.cursor) { W.cursor = M(geo('cur', () => new THREE.RingGeometry(0.18, 0.26, 20)), flat(0xffffff, { transparent: true, opacity: 0.85, depthWrite: false }), 0, 0.05, 0, scene); W.cursor.rotation.x = -Math.PI / 2; }
  W.cursor.position.set(B.x, 0.05, B.z); W.cursor.visible = true;
  // the camera: high and angled, turned in quarter steps
  const cx = B.x - fx * 9.5, cz = B.z - fz * 9.5; _v.set(cx, 11, cz); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(B.x, 0, B.z);
}
// keyboard and mouse in build mode
addEventListener('keydown', e => {
  if (!BLD.on || !W || !W.build || UI.cur) return; const k = e.code;
  if (k === 'KeyR' || k === 'KeyQ') buildRotate(); else if (k === 'KeyX' || k === 'Delete' || k === 'Backspace') buildSell(); else if (k === 'KeyF') buildStore(); else if (k === 'KeyC') W.build.yaw = (W.build.yaw + 1) % 4;
  else if (k === 'Escape' || k === 'KeyB') { if (W.build.sel) buildCancel(); else buildExit(); e.preventDefault(); }
  else if (k === 'Tab') { e.preventDefault(); const i = HOME_CATS.findIndex(c => c[0] === BLD.cat); BLD.cat = HOME_CATS[(i + 1) % HOME_CATS.length][0]; buildPanel(); }
});
addEventListener('keydown', e => { if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.code === 'KeyB' && W && (W.kind === 'crib' || W.kind === 'room') && !W.build && !UI.cur && !BLD.on) buildEnter(); if (e.code === 'KeyL' && W && W.visit && !UI.cur) likeCrib(); });
// visiting: leave a like (one a day per crib), and hang out
function likeCrib() { if (!W || !W.visit) return; if (NET.liked === W.visit.peer + '|' + dayKey()) return toast('ALREADY LIKED', 'One like a day per crib.'); NET.liked = W.visit.peer + '|' + dayKey(); pres({ lk: NET.liked }); bubble(W.me.rig.root, '♥', 2.5); toast('♥ LIKED', W.visit.name + ' will see it.'); sfx('coin'); }
function netVisit(peer) {
  const p = peerById(peer), d = p && unpackHome(p.presence.hm); if (!d) { toast('CAN\'T VISIT', 'Their crib did not come through. Try again in a moment.'); return; }
  uiClose(); d.peer = peer; enterWorld('crib', 0, 19.2, Math.PI, { visit: d }); toast(d.name + "'S CRIB", 'Look around, sit down, say something (T). Press L to leave a like.', 'rank');
}
const _ray = new THREE.Raycaster(), _pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), _mp = new THREE.Vector2(), _hit = new THREE.Vector3();
function buildPointer(e, click) {
  if (!BLD.on || !W || !W.build || UI.cur || !(e.target.id === 'gl' || (e.target.closest && e.target.closest('#touch') && !e.target.closest('.tbtn')))) return;    /* on a phone the touch layer sits over the view */ _mp.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); _ray.setFromCamera(_mp, camera);
  if (_ray.ray.intersectPlane(_pl, _hit)) { W.build.mouse = [_hit.x, _hit.z]; if (click) { W.build.fx = _hit.x; W.build.fz = _hit.z; const gs = W.build.sel && HOME_ITEM[W.build.sel].small ? 4 : 2; W.build.x = Math.round(_hit.x * gs) / gs; W.build.z = Math.round(_hit.z * gs) / gs; if (e.pointerType === 'mouse') buildPlace(); } }
}
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') buildPointer(e, false); });
addEventListener('pointerdown', e => buildPointer(e, true));

// ---------- panels: sets & perks, lot & look ----------
function uiHomeSets() {
  openPanel(() => {
    const lv = homeLevel(); let h = `<div class="ph"><h2>SETS & PERKS</h2>${Btn('✕', uiClose, 'alt sm')}</div><div class="pb">`;
    h += `<div class="card sel"><h3>CRIB LEVEL ${lv.lvl}</h3><p>Vibe ${lv.tot}${lv.next ? `. Next level at ${lv.next}.` : '. Maxed.'} Every piece adds Vibe; a third copy of the same thing counts half, a fifth a fifth.</p></div><div class="cat">LEVEL PERKS</div>`;
    for (const p of HOME_PERKS) h += `<div class="card ${p.lvl <= lv.lvl ? 'sel' : 'lock'}"><h3>${p.lvl <= lv.lvl ? '✓ ' : ''}LEVEL ${p.lvl} · ${p.n}</h3><p>${p.d}</p></div>`;
    h += `<div class="cat">SETS <span class="mu" style="text-transform:none">— place every piece of a set for its bonus</span></div>`;
    for (const x of homeSets()) h += `<div class="card ${x.done ? 'sel' : ''}"><h3>${x.done ? '✓ ' : ''}${x.s.n} · ${x.got}/${x.s.items.length}</h3><p class="buff">${x.s.d}</p><p>${x.s.items.map(i => (home().items.some(q => q.i === i) ? '✓ ' : '· ') + HOME_ITEM[i].n).join('  ')}</p></div>`;
    return h + `</div>`;
  }, 'side');
}
function uiHomeLot() {
  openPanel(() => {
    const H = home(), r = rankOf(S.rep); let h = `<div class="ph"><h2>LOT & LOOK</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><div class="cat">THE LOT</div>`;
    LOTS.forEach((L, i) => { const own = i <= (H.lot || 0), next = i === (H.lot || 0) + 1; h += `<div class="card ${own ? 'sel' : ''}"><h3>${own ? '✓ ' : ''}${L.n}</h3><p>${L.d}</p>${next ? (L.rank > r ? `<span class="tag or">RANK: ${RANKS[L.rank].n}</span>` : Btn('BUY · ' + L.cost + ' VC', () => { S.vc -= L.cost; H.lot = i; save(); sfx('unlock'); toast('NEW LAND', L.n + ' is yours. Build on it.', 'rank'); homeRebuild(); }, 'sm', S.vc < L.cost)) : ''}</div>`; });
    if (inRoom()) { const RL = homeRoom().look; h = `<div class="ph"><h2>ROOM LOOK</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb">`;
      for (const k of ['wall', 'floor']) { h += `<div class="cat">${k === 'wall' ? 'WALLS' : 'FLOOR'} <span class="mu" style="text-transform:none">— ${ROOM_COST[k]} VC to change</span></div><div class="card">` + ROOM_LOOKS[k].map((o, i) => Btn((RL[k] === i ? '✓ ' : '') + o[0], () => { if (RL[k] === i) return; if (S.vc < ROOM_COST[k]) { toast('NOT ENOUGH VC', ''); return; } S.vc -= ROOM_COST[k]; RL[k] = i; save(); sfx('buy'); homeRebuild(); }, 'sm ' + (RL[k] === i ? '' : 'alt'))).join(' ') + `</div>`; }
      return h + `</div>`; }
    for (const k of ['house', 'trim', 'fence', 'ground']) {
      h += `<div class="cat">${{ house: 'HOUSE PAINT', trim: 'TRIM', fence: 'FENCE', ground: 'YARD GROUND' }[k]} <span class="mu" style="text-transform:none">— ${LOOK_COST[k]} VC to change</span></div><div class="card">`;
      h += LOOKS[k].map((o, i) => Btn((H.look[k] === i ? '✓ ' : '') + o[0], () => { if (H.look[k] === i) return; if (S.vc < LOOK_COST[k]) { toast('NOT ENOUGH VC', ''); return; } S.vc -= LOOK_COST[k]; H.look[k] = i; save(); sfx('buy'); homeRebuild(); }, 'sm ' + (H.look[k] === i ? '' : 'alt'))).join(' ') + `</div>`;
    }
    return h + `</div>`;
  }, 'side');
}
// the lot and the look are part of the scene itself: rebuild the crib, keep the builder open where it was
function homeRebuild() { const B = W.build, me = W.me, keep = B ? { x: B.x, z: B.z, yaw: B.yaw } : null, kind = W.kind; uiClose(); if (B) buildExit(); enterWorld(kind, me.x, me.z, me.face); if (keep) { buildEnter(); Object.assign(W.build, keep, { fx: keep.x, fz: keep.z }); } }
