'use strict';
/* GODMODE.EXE: shared constants and helpers. No DOM and no THREE in this file,
   world.js or sim.js, so the simulation can run headless in tests. */

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hyp = Math.hypot;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function angDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

const SIM_DT = 1 / 20;      // fixed simulation step, seconds
const DAY_LEN = 200;        // seconds per island day
const NIGHT_FROM = 0.76;    // fraction of the day at which night begins
const POP_MAX = 40;

/* ---- the four belief archetypes ---- */
const DEV = 0, DREAD = 1, ACCEL = 2, KIN = 3;
const BELIEFS = [
  { key: 'devotion', name: 'DEVOTION', who: 'Devotee', hex: '#ffd447',
    creed: 'The Watcher loves us.',
    fx: 'Prays at shrines, which refills your CYCLES. Content, a little slow.' },
  { key: 'dread', name: 'DREAD', who: 'Penitent', hex: '#ff4f6e',
    creed: 'The Watcher punishes those who did not serve.',
    fx: 'Works fast, even at night. Unhappy and easily terrified.' },
  { key: 'accel', name: 'ACCELERATION', who: 'Accelerant', hex: '#3fe8ff',
    creed: 'The future is building itself through us.',
    fx: 'Studies obsessively and makes INSIGHT. Forgets to eat.' },
  { key: 'kinship', name: 'KINSHIP', who: 'Kin', hex: '#8dff7a',
    creed: 'The sky is empty. We have each other.',
    fx: 'Happy, social, gathers food. Will not pray. Shrugs off your ideas.' }
];
const AGE_FX = [
  'CYCLES refill 50% faster',
  'work 25% faster, joy drains',
  'INSIGHT 50% faster, hunger bites',
  'joy up, births double, CYCLES refill slower'
];
/* pairs of beliefs that argue when they meet */
function opposed(a, b) {
  if (a > b) { const t = a; a = b; b = t; }
  return (a === DEV && b === KIN) || (a === DREAD && b === KIN) || (a === DEV && b === ACCEL);
}

/* ---- buildings ---- */
const BUILD = {
  fire:   { name: 'Hearth',    r: 1.5,  cost: {}, work: 1, max: 1,
            desc: 'The stockpile and the heart of the village. It does not go out.' },
  hut:    { name: 'Hut',       r: 1.35, cost: { wood: 10 }, work: 14, max: 8,
            desc: 'Houses three citizens. More huts, more minds.' },
  farm:   { name: 'Farm',      r: 1.7,  cost: { wood: 8, stone: 3 }, work: 12, max: 6,
            desc: 'Grows food on a loop. Tending speeds it up.' },
  shrine: { name: 'Shrine',    r: 1.4,  cost: { wood: 8, stone: 12 }, work: 20, max: 3,
            desc: 'Prayer here refills your CYCLES and deepens DEVOTION.' },
  lab:    { name: 'Terminal',  r: 1.5,  cost: { wood: 12, stone: 16 }, work: 26, max: 3,
            desc: 'Study here produces INSIGHT and breeds ACCELERATION.' },
  shop:   { name: 'Shop',      r: 1.3,  cost: { wood: 8, stone: 4 }, work: 14, max: 3,
            desc: 'A business. Somebody owns it, and somebody works for them.' },
  dock:   { name: 'Dock',      r: 0.9,  cost: { wood: 10 }, work: 10, max: 9,
            desc: 'A pier on the shore. Boats are built and launched here.' },
  spire:  { name: 'The Spire', r: 2.3,  cost: { wood: 60, stone: 70, insight: 150 }, work: 240, max: 1,
            desc: 'Nobody remembers designing it.' }
};

/* ---- god powers ---- */
const COST = { bless: 12, smite: 18, inspire: 15, intervene: 3, observe: 0,
  citizen: 30, grove: 10, rock: 10, blueprint: 4, spire: 0 };
const INSIGHT_GOAL = 80;

const NAMES = ['Bip', 'Momo', 'Tavi', 'Zuzu', 'Pem', 'Kiko', 'Olo', 'Nim', 'Rue', 'Dax', 'Fen', 'Juno',
  'Miso', 'Pip', 'Quill', 'Sol', 'Tuk', 'Uma', 'Vex', 'Wren', 'Yuki', 'Zed', 'Ada', 'Bao', 'Cy', 'Echo',
  'Io', 'Lux', 'Mog', 'Noa', 'Opi', 'Ras', 'Suki', 'Tam', 'Ula', 'Vim', 'Wix', 'Xan', 'Yam', 'Zia',
  'Bodo', 'Coco', 'Dot', 'Elm', 'Fig', 'Gus', 'Hob', 'Ivy', 'Jib', 'Kit'];

/* emote icon indices (atlas order in render.js) */
const EM = { heart: 0, bang: 1, what: 2, zzz: 3, food: 4, bolt: 5, eye: 6, spark: 7,
  note: 8, skull: 9, dots: 10, bulb: 11, anger: 12, halo: 13, chip: 14, leaf: 15,
  coin: 16, fist: 17, baby: 18, crown: 19, fish: 20, dizzy: 21, cup: 22, flag: 23 };
const BELIEF_EMOTE = [EM.halo, EM.bolt, EM.chip, EM.leaf];
