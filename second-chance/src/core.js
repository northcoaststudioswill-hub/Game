'use strict';
/* SECOND CHANCE - core: namespace, maths, tunables. */
const SC = window.SC = { V: '0.3.0' };

SC.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
SC.lerp = (a, b, t) => a + (b - a) * t;
SC.damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
SC.smooth = t => t * t * (3 - 2 * t);
SC.easeOut = t => 1 - (1 - t) * (1 - t) * (1 - t);
SC.angDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
SC.dampAng = (a, b, k, dt) => a + SC.angDiff(a, b) * (1 - Math.exp(-k * dt));
SC.rand = (a, b) => a + Math.random() * (b - a);
SC.pick = arr => arr[(Math.random() * arr.length) | 0];
SC.dist2 = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);

/* A seeded generator, so textures and set dressing come out the same every run. */
SC.seeded = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

/* The three paths. Everything that differs between them hangs off this table. */
SC.PATHS = {
  ember: {
    id: 'ember', name: 'EMBER', title: 'THE FURNACE', power: 'PYRE', btn: 'PYRE',
    color: 0xff5a1f, hot: 0xffd23a, css: '#ff5a1f', cssHot: '#ffd23a',
    blurb: 'Wrath. Leap and bring the fire down on everything near you.',
    passive: 'The third hit of a combo bursts into flame.',
    word: 'FWOOM!'
  },
  shade: {
    id: 'shade', name: 'SHADE', title: 'THE LONG DARK', power: 'SHADOWSTEP', btn: 'SHADOW<br>STEP',
    color: 0x9a4dff, hot: 0xe2c6ff, css: '#9a4dff', cssHot: '#e2c6ff',
    blurb: 'Guile. Fall into your own shadow and come up behind them.',
    passive: 'Your dodge carries further and forgives more.',
    word: 'SHHK!'
  },
  tether: {
    id: 'tether', name: 'TETHER', title: 'THE DROWNED CHAIN', power: 'GRAVE CHAIN', btn: 'GRAVE<br>CHAIN',
    color: 0x19d3c5, hot: 0xc8fff6, css: '#19d3c5', cssHot: '#c8fff6',
    blurb: 'Judgement. Throw the chain, drag them in, hold them still.',
    passive: 'Every Hollow you put down gives a little life back.',
    word: 'SNAP!'
  }
};

SC.T = {                      // tunables
  playerSpeed: 6.2, playerAccel: 38, turnRate: 16,
  dodgeTime: 0.34, dodgeSpeed: 15.5, dodgeCool: 0.28, perfectWindow: 0.2,
  hp: 100, meter: 100, powerCost: 34,
  step: 0.5, gravity: 30,
  camDist: 5.4, camDistCombat: 6.9, camPitch: 0.3, camMin: 1.9, camFov: 55
};

/* Tally's ledger: what scrip buys at a crossing. cost is per level. */
SC.UPGRADES = [
  { id: 'hp', name: 'HARD TO KILL', max: 2, cost: [20, 40], text: ['+25 health', '+25 more health'] },
  { id: 'dmg', name: 'HEAVY HANDS', max: 2, cost: [20, 40], text: ['Fists and feet hit 20% harder', '40% harder'] },
  { id: 'well', name: 'DEEP WELL', max: 2, cost: [25, 45], text: ['Your power costs less', 'Costs less again: four uses from a full bar'] },
  { id: 'word', name: 'LAST WORD', max: 2, cost: [15, 30], text: ['Finishers give back 15 health', 'Finishers give back 30 health'] },
  { id: 'due', name: 'PAST DUE', max: 1, cost: [35], text: ['A fourth hit: leap and slam the combo home'] }
];
SC.up = { hp: 0, dmg: 0, well: 0, word: 0, due: 0 };

/* challenge: what hurts you, and how much the Hollows can take */
SC.DIFF = {
  story: { name: 'STORY', hurt: 0.55, hp: 0.8, tokens: 1 },
  normal: { name: 'NORMAL', hurt: 1, hp: 1, tokens: 2 },
  hard: { name: 'HARD', hurt: 1.4, hp: 1.25, tokens: 3 }
};
/* per-device settings, kept apart from the save so a new game does not reset them */
SC.settings = { diff: 'normal', sound: true, sens: 1, quality: 0 };
try { Object.assign(SC.settings, JSON.parse(localStorage.getItem('second-chance-settings') || '{}')); } catch (e) { /* defaults */ }
SC.saveSettings = () => { try { localStorage.setItem('second-chance-settings', JSON.stringify(SC.settings)); } catch (e) { /* not saved */ } };
SC.diff = () => SC.DIFF[SC.settings.diff] || SC.DIFF.normal;

SC.flags = {};                 // story flags, saved
SC.events = {};
SC.on = (name, fn) => { (SC.events[name] = SC.events[name] || []).push(fn); };
SC.emit = (name, a, b) => { (SC.events[name] || []).forEach(fn => fn(a, b)); };
