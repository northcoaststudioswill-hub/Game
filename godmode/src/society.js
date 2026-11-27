'use strict';
/* GODMODE.EXE: society. Families, romance, opinions and gossip, faith leaders and their
   factions, businesses and money, everyday pastimes, fights and wars.
   Pure simulation like sim.js: no DOM, no THREE. sim.js calls in through four hooks:
   societyOptions() and kidThink() from think(), updateSocial() for the new states,
   and societyTick() once a second. */

const GROW_SECS = 160;          // a child becomes an adult after this long
const SOCIAL_STATES = { sermon: 1, assemble: 1, shift: 1, visit: 1, steal: 1, fight: 1, ko: 1, battle: 1, dance: 1,
  fish: 1, nap: 1, stargaze: 1, date: 1, play: 1, hermit: 1, tantrum: 1 };

const FAC_WORDS = [
  [['Golden', 'Radiant', 'Gentle', 'Shining'], ['Choir', 'Circle', 'Flock', 'Lamp']],
  [['Ashen', 'Kneeling', 'Red', 'Watchful'], ['Penitents', 'Vigil', 'Hood', 'Order']],
  [['Cyan', 'Bright', 'Forward', 'Rising'], ['Engine', 'Loop', 'Signal', 'Lattice']],
  [['Green', 'Open', 'Warm', 'Common'], ['Table', 'Hearth', 'Kin', 'Commons']]
];
const BIZ = {
  bakery:   { name: 'Bakery',   desc: 'Turns stockpile food into bread that goes further. Bread costs a coin.' },
  tavern:   { name: 'Tavern',   desc: 'Somewhere to drink, sing and argue after work. A drink costs a coin.' },
  workshop: { name: 'Workshop', desc: 'Turns wood into tools. Tools make everyone work faster for a while.' }
};

/* ------------------------------------------------------------- helpers */

function fillCitizen(c) {
  // defaults for fields added after save v1, so old saves and old citizens keep working
  if (c.grow === undefined) c.grow = 1;
  if (c.mate === undefined) c.mate = 0;
  if (!c.par) c.par = [];
  if (c.coin === undefined) c.coin = 3;
  if (c.boss === undefined) c.boss = 0;
  if (c.job === undefined) c.job = 0;
  if (c.title === undefined) c.title = '';
  if (c.fac === undefined) c.fac = 0;
  if (c.actCd === undefined) c.actCd = 20 + (c.id * 37) % 30;
  if (c.sermCd === undefined) c.sermCd = 40;
  if (c.unpaid === undefined) c.unpaid = 0;
  if (c.sadT === undefined) c.sadT = 0;
  return c;
}
function fillSociety(S) {
  if (!S.factions) S.factions = [];
  if (S.war === undefined) S.war = null;
  if (S.party === undefined) S.party = null;
  if (S.tools === undefined) S.tools = 0;
  if (!S.tension) S.tension = {};
  if (S.truceT === undefined) S.truceT = 0;
  if (S.facId === undefined) S.facId = 1;
  for (const c of S.citizens) fillCitizen(c);
}
const adult = c => c.grow >= 1;
function getF(S, id) { for (const f of S.factions) if (f.id === id) return f; return null; }
function facOfK(S, k, set) { for (const f of S.factions) if (f.k === k && (f.set || 1) === (set || 1)) return f; return null; }
function facMembers(S, f) { const m = []; for (const c of S.citizens) if (c.fac === f.id) m.push(c); return m; }
function shopName(S, b) { const o = getC(S, b.owner); return (o ? o.name + "'s " : 'The ') + BIZ[b.biz].name; }
function awake(c) { return c.state !== 'sleep' && c.state !== 'held' && c.state !== 'ko' && c.state !== 'nap' && c.state !== 'stargaze'; }
function busyFighting(c) { return c.state === 'fight' || c.state === 'battle' || c.state === 'ko'; }
function tensionKey(a, b) { return a < b ? a + ':' + b : b + ':' + a; }
function addTension(S, fa, fb, d) {
  if (!fa || !fb || fa === fb) return;
  const k = tensionKey(fa, fb);
  S.tension[k] = (S.tension[k] || 0) + d;
}
function relLabel(c, o) {
  if (c.mate === o.id) return 'partner';
  if (c.par.indexOf(o.id) >= 0) return 'parent';
  if (o.par.indexOf(c.id) >= 0) return 'child';
  const v = c.rel[o.id] || 0;
  if (v >= 0.6) return 'best friend';
  if (v >= 0.3) return 'friend';
  if (v <= -0.6) return 'enemy';
  if (v <= -0.3) return 'rival';
  return '';
}
/* fixed personal chemistry between two people, -1..1: some pairs just click, some just grate */
function chem(a, b) {
  const lo = Math.min(a.id, b.id), hi = Math.max(a.id, b.id);
  const x = Math.sin(lo * 12.9898 + hi * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}
function oneRel(a, b, d) { a.rel[b.id] = clamp((a.rel[b.id] || 0) + d, -1, 1); }
function stopPartner(S, c) {
  const p = c.partner ? getC(S, c.partner) : null;
  if (p && p.partner === c.id && p.state === c.state) finish(S, p);
}

/* ------------------------------------------------------------ children */

function kidThink(S, c) {
  const r = S.rng, night = isNight(S);
  let bestU = -1, bestFn = null;
  const consider = (u, fn) => { u *= 0.85 + r() * 0.3; if (u > bestU) { bestU = u; bestFn = fn; } };
  const HH = hearthOf(S, c);
  if (c.hunger > 0.5 && RES(S, c).food >= 1) consider(2.5 + c.hunger * 3, () => {
    setState(c, 'eat', 'Hungry! Is there anything to eat?'); c.tk = 'fire'; spotNear(c, HH.x, HH.z, BUILD.fire.r + 0.5);
  });
  if (night) consider(2.2, () => {
    const h = getB(S, c.home);
    setState(c, 'sleep', 'Bedtime. Not tired. Very tired.');
    if (h) spotNear(c, h.x, h.z, BUILD.hut.r + 0.45); else spotNear(c, HH.x, HH.z, BUILD.fire.r + 0.9);
  });
  // play with another child, or pester a parent
  let mate = null, md = 14;
  for (const o of S.citizens) {
    if (o === c || !awake(o) || busyFighting(o) || o.boat || o.isle !== c.isle) continue;
    const kid = !adult(o), parent = c.par.indexOf(o.id) >= 0;
    if (!kid && !parent) continue;
    if (!kid && o.state !== 'idle' && o.state !== 'wander') continue;
    const d = hyp(o.x - c.x, o.z - c.z) - (kid ? 3 : 0);
    if (d < md) { md = d; mate = o; }
  }
  if (mate && !night) consider(1.2, () => startPlay(S, c, mate));
  if (c.talkCd <= 0 && !night) {
    const p = findPartner(S, c);
    if (p) consider(0.6, () => startTalk(S, c, p));
  }
  // tag along behind a parent
  const par = c.par.map(id => getC(S, id)).filter(p => p && p.isle === c.isle && !p.boat)[0];
  if (par) consider(0.7, () => {
    setState(c, 'wander', 'Following ' + par.name + ' around.');
    clampWalk(S.world, par.x + (r() - 0.5) * 2, par.z + (r() - 0.5) * 2, _pt);
    c.tx = _pt.x; c.tz = _pt.z;
  });
  consider(0.5, () => {
    const a = r() * TAU, d = 2 + r() * 5;
    clampWalk(S.world, c.x + Math.sin(a) * d, c.z + Math.cos(a) * d, _pt);
    setState(c, 'wander', ['Exploring!', 'What is that?', 'Running for no reason.'][(r() * 3) | 0]);
    c.tx = _pt.x; c.tz = _pt.z;
  });
  bestFn();
}
function startPlay(S, c, o) {
  setState(c, 'play', !adult(o) ? 'Playing tag with ' + o.name + '!' : 'Playing with ' + o.name + '.');
  c.partner = o.id; c.t = 8 + S.rng() * 6;
  if (adult(o) || o.state === 'idle' || o.state === 'wander') {
    setState(o, 'play', !adult(o) ? 'Playing tag with ' + c.name + '!' : 'Playing with ' + c.name + '. Good kid.');
    o.partner = c.id; o.t = c.t;
  }
}

/* ------------------------------------------------- options for think() */

function societyOptions(S, c, consider, night) {
  const B = c.b, r = S.rng, d = S.day, HH = hearthOf(S, c);
  const f = c.fac ? getF(S, c.fac) : null;

  // a festival or a battle trumps almost everything
  if (S.party && S.party.t > 0 && !night && (S.party.set || 1) === c.set) consider(3.0, () => startDance(S, c, HH.x, HH.z, 'Festival! Everyone to the hearth!'));
  if (S.war && f && (S.war.a === f.id || S.war.b === f.id) && c.hunger < 0.9 && !c.elder && adult(c)) consider(3.4, () => startBattle(S, c));

  // the faith leader
  if (c.title === 'leader' && f) {
    if (c.sermCd <= 0 && !night && c.hunger < 0.7) consider(2.4, () => startSermon(S, c, f));
  }
  // followers answer the call
  if (f && f.call && f.call.t > 0 && c.title !== 'leader' && hyp(f.call.x - c.x, f.call.z - c.z) < 14) {
    consider(1.2 + 0.6 * B[f.k], () => {
      setState(c, 'assemble', 'The ' + f.name + ' gathers. ' + (getC(S, f.leader) || c).name + ' will speak.');
      c.partner = f.leader; spotNear(c, f.call.x, f.call.z, 1.8 + r() * 1.6);
    });
  }
  // followers drift after their leader when nothing else calls
  if (f && f.leader !== c.id) {
    const L = getC(S, f.leader);
    if (L && awake(L) && !L.boat && L.isle === c.isle) consider(0.25 + 0.3 * B[f.k], () => {
      setState(c, 'wander', 'Staying close to ' + L.name + '.');
      clampWalk(S.world, L.x + (r() - 0.5) * 3, L.z + (r() - 0.5) * 3, _pt); c.tx = _pt.x; c.tz = _pt.z;
    });
  }

  // work at a business, for its owner or for yourself
  const shop = c.job ? getB(S, c.job) : null;
  if (shop && shop.built && !night && c.hunger < 0.8) {
    const own = shop.owner === c.id;
    consider(0.45 + (own ? 0.25 : 0.1) + 0.4 * clamp(1 - c.coin / 8, 0, 1), () =>
      startWork(S, c, 'shift', shop, own ? 'Opening up ' + shopName(S, shop) + '.' : 'Off to work at ' + shopName(S, shop) + '.'));
  }
  // be a customer
  if (c.coin >= 1) {
    for (const b of S.buildings) {
      if (b.type !== 'shop' || !b.built || b.owner === c.id || !getC(S, b.owner) || b.isle !== c.isle) continue;
      if (b.biz === 'bakery' && c.hunger > 0.4) consider(0.9 + c.hunger, () => startWork(S, c, 'visit', b, 'Buying bread at ' + shopName(S, b) + '.'));
      if (b.biz === 'tavern' && d > 0.6 && d < 0.9) consider(0.5 + 0.4 * c.tr.social + (c.happy < 0.4 ? 0.3 : 0) + 0.2 * B[KIN],
        () => startWork(S, c, 'visit', b, c.happy < 0.4 ? 'I need a drink.' : 'Meeting people at ' + shopName(S, b) + '.'));
    }
  }

  // love: time with a partner
  const m = c.mate ? getC(S, c.mate) : null;
  if (m && !night && m.isle === c.isle && (m.state === 'idle' || m.state === 'wander') && c.actCd <= 0) {
    consider(0.6 + 0.5 * relOf(c, m), () => startDate(S, c, m));
  }
  // parents play with their children
  if (!night && c.actCd <= 0) for (const o of S.citizens) {
    if (o.grow < 1 && o.par.indexOf(c.id) >= 0 && o.isle === c.isle && (o.state === 'idle' || o.state === 'wander')) { consider(0.55, () => startPlay(S, o, c)); break; }
  }

  // chill pastimes, on a cooldown so work still happens
  if (c.actCd <= 0) {
    if (!night) {
      consider(0.25 + 0.25 * (1 - c.curio) + (c.happy > 0.6 ? 0.1 : 0), () => startFish(S, c));
      consider(0.15 + 0.25 * B[KIN] + (c.health < 0.7 ? 0.3 : 0), () => startNap(S, c));
      if (d > 0.64 && d < 0.76 && c.happy > 0.55) consider(0.18 + 0.25 * c.tr.social, () => startDance(S, c, HH.x, HH.z, 'Music at the hearth. Dancing.'));
    } else {
      consider(0.2 + 0.6 * c.curio + 0.5 * B[ACCEL], () => startStargaze(S, c));
    }
  }

  // the extremes
  if (c.happy < 0.18) c.sadT += 1; else c.sadT = Math.max(0, c.sadT - 1);
  if (c.sadT > 6 && c.actCd <= 0) consider(1.1, () => startHermit(S, c));
  if (c.happy < 0.3 && c.actCd <= 0) consider(0.5 + (0.3 - c.happy) * 2, () => startTantrum(S, c));
  if (c.coin <= 1 && (c.happy < 0.55 || B[DEV] < 0.25) && c.actCd <= 0 && !night && adult(c)) {
    let rich = null, rc = 6;
    for (const o of S.citizens) if (o !== c && o.coin > rc && relOf(c, o) < 0.3 && o.isle === c.isle && !o.boat) { rc = o.coin; rich = o; }
    if (rich) consider(0.35 + 0.5 * (1 - c.b[DEV]) - 0.4 * c.b[KIN], () => startSteal(S, c, rich));
  }
  // settle a grudge with your fists
  if (c.actCd <= 0 && !night && c.tr.brave > 0.4 && adult(c) && !c.elder) {
    let foe = null, fv = -0.42;
    for (const o of S.citizens) {
      if (o === c || !adult(o) || !awake(o) || busyFighting(o) || o.state === 'held' || o.boat) continue;
      const v = relOf(c, o);
      if (v < fv && hyp(o.x - c.x, o.z - c.z) < 9) { fv = v; foe = o; }
    }
    if (foe) consider(0.45 + (-fv - 0.42) * 2 + 0.3 * B[DREAD], () => startFight(S, c, foe, 'I have had enough of ' + foe.name + '.'));
  }
}

/* ------------------------------------------------------- state starters */

function startSermon(S, c, f) {
  let x = c.x, z = c.z;
  const spot = f.k === ACCEL ? nearestBuilt(S, c, 'lab') : f.k === KIN ? hearthOf(S, c) : nearestBuilt(S, c, 'shrine');
  if (spot) { x = spot.x; z = spot.z; }
  clampWalk(S.world, x + 2.4, z + 1.2, _pt);
  setState(c, 'sermon', 'Time to speak to the ' + f.name + '.');
  c.tx = _pt.x; c.tz = _pt.z;
  f.x = _pt.x; f.z = _pt.z;
  f.call = { x: _pt.x, z: _pt.z, t: 30 };
  c.sermCd = 110 + S.rng() * 60;
  logMsg(S, c.name + ' calls the ' + f.name + ' together.', 'b' + f.k);
}
function startDance(S, c, x, z, thought) {
  setState(c, 'dance', thought);
  spotNear(c, x, z, BUILD.fire.r + 1 + S.rng() * 1.6);
  c.t = 9 + S.rng() * 5; c.actCd = 90 + S.rng() * 60;
}
/* somewhere with water: the isle's pond, or failing that the sea shore */
function waterSpot(S, c, gap) {
  const I = S.world.isles[c.isle || 0];
  if (I.pond) {
    const px = I.cx + I.pond.x, pz = I.cz + I.pond.z, a = Math.atan2(c.x - px, c.z - pz) + (S.rng() - 0.5) * 1.2;
    return { x: px + Math.sin(a) * (I.pond.r + gap), z: pz + Math.cos(a) * (I.pond.r + gap), wx: px, wz: pz };
  }
  const a = Math.atan2(c.x - I.cx, c.z - I.cz) + (S.rng() - 0.5) * 1.2, rr = rimR(I, a);
  return { x: I.cx + Math.sin(a) * (rr - 1.7), z: I.cz + Math.cos(a) * (rr - 1.7), wx: I.cx + Math.sin(a) * (rr + 3), wz: I.cz + Math.cos(a) * (rr + 3) };
}
/* no berries or ripe crops on this island: fish for the stockpile instead */
function fishForFood(S, c) {
  startFish(S, c);
  c.tk = 'food'; c.actCd = 0;
  c.thought = 'Nothing to pick here. Going to catch dinner.';
  return true;
}
function startFish(S, c) {
  const p = waterSpot(S, c, 0.55);
  setState(c, 'fish', 'Going fishing. Maybe.');
  c.tx = p.x; c.tz = p.z; c.fx = p.wx; c.fz = p.wz;
  c.t = 12 + S.rng() * 8; c.actCd = 50 + S.rng() * 50;
}
function startNap(S, c) {
  const a = S.rng() * TAU, d = 2 + S.rng() * 4;
  clampWalk(S.world, c.x + Math.sin(a) * d, c.z + Math.cos(a) * d, _pt);
  setState(c, 'nap', 'Finding a sunny patch for a nap.');
  c.tx = _pt.x; c.tz = _pt.z; c.t = 9 + S.rng() * 6; c.actCd = 50 + S.rng() * 50;
}
function startStargaze(S, c) {
  const I = S.world.isles[c.isle || 0], a = S.rng() * TAU, d = I.R * (0.4 + S.rng() * 0.35);
  clampWalk(S.world, I.cx + Math.sin(a) * d, I.cz + Math.cos(a) * d, _pt);
  setState(c, 'stargaze', 'The stars only come out when nobody is working. Going to look.');
  c.tx = _pt.x; c.tz = _pt.z; c.t = 14 + S.rng() * 8; c.actCd = 60 + S.rng() * 40;
}
function startDate(S, c, m) {
  const p = waterSpot(S, c, 1.1), a = S.rng() * TAU;
  const x = p.x, z = p.z;
  setState(c, 'date', 'A walk by the pond with ' + m.name + '.');
  setState(m, 'date', c.name + ' wants to go for a walk. Yes.');
  c.partner = m.id; m.partner = c.id; c.lead = true;
  c.tx = x; c.tz = z; m.tx = x + Math.cos(a) * 0.7; m.tz = z - Math.sin(a) * 0.7;
  c.t = m.t = 10 + S.rng() * 5; c.actCd = m.actCd = 45 + S.rng() * 40;
}
function startHermit(S, c) {
  const I = S.world.isles[c.isle || 0], a = Math.atan2(c.x - I.cx, c.z - I.cz) + (S.rng() - 0.5);
  const R0 = rimR(I, a) - 2;
  clampWalk(S.world, I.cx + Math.sin(a) * R0, I.cz + Math.cos(a) * R0, _pt);
  setState(c, 'hermit', 'I am done with all of them. I am going to live at the edge.');
  c.tx = _pt.x; c.tz = _pt.z; c.t = 50 + S.rng() * 30; c.sadT = 0; c.actCd = 120;
  emote(c, EM.dots, 3);
  logMsg(S, c.name + ' has walked off to live alone at the edge of the island. They will come back. Probably.', 'bad');
  memo(S, c, 'Walked away from everyone to live alone at the edge.');
  ev(S, 'hermit', { id: c.id });
}
function startTantrum(S, c) {
  setState(c, 'tantrum', ['Everything is wrong and nobody listens!', 'I hate this island!', 'Why does nothing ever work?'][(S.rng() * 3) | 0]);
  c.t = 4 + S.rng() * 2; c.actCd = 50 + S.rng() * 30;
  emote(c, EM.anger, 3);
  for (const o of S.citizens) if (o !== c && hyp(o.x - c.x, o.z - c.z) < 4) { oneRel(o, c, -0.06); if (o.emoteT <= 0) emote(o, EM.what, 1.5); }
}
function startSteal(S, c, v) {
  setState(c, 'steal', 'Nobody will miss a few coins. Especially not ' + v.name + '.');
  c.partner = v.id; c.actCd = 120 + S.rng() * 60;
}
function startFight(S, a, b, why) {
  if (a.boat || b.boat) return;
  if (a.state === 'talk') stopPartner(S, a);
  if (b.state === 'talk') stopPartner(S, b);
  setState(a, 'fight', why); setState(b, 'fight', a.name + ' is coming at me!');
  a.partner = b.id; b.partner = a.id; a.lead = true;
  a.t = b.t = 6 + S.rng() * 4; a.actCd = b.actCd = 150 + S.rng() * 60;
  emote(a, EM.fist, 2.5); emote(b, EM.bang, 2);
  ev(S, 'fight', { a: a.id, b: b.id, x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
  logMsg(S, a.name + ' and ' + b.name + ' are fighting!', 'bad');
  whisper(S, 'fight1', 'VIOLENCE: two minds have decided words are too slow. Bless them to calm it, or watch.');
  addTension(S, a.fac, b.fac, 3);
}
function startBattle(S, c) {
  const w = S.war, side = c.fac === w.a ? 0 : 1;
  setState(c, 'battle', side ? 'For the ' + getF(S, w.b).name + '!' : 'For the ' + getF(S, w.a).name + '!');
  c.ph = 0; c.tk = side ? 'b' : 'a';
  const dx = w.bx - w.ax, dz = w.bz - w.az, dd = hyp(dx, dz) || 1;
  const sx = side ? w.bx : w.ax, sz = side ? w.bz : w.az;
  clampWalk(S.world, sx + (-dz / dd) * (S.rng() - 0.5) * 4, sz + (dx / dd) * (S.rng() - 0.5) * 4, _pt);
  c.tx = _pt.x; c.tz = _pt.z;
  emote(c, EM.flag, 2.5);
}

/* -------------------------------------------------- per-step behaviour */

function updateSocial(S, c, dt, sp) {
  const ws = workSpeed(S, c);
  let m;
  switch (c.state) {
    case 'play': {
      const o = getC(S, c.partner);
      c.t -= dt;
      if (!o || c.t <= 0 || !awake(o)) { c.happy = Math.min(1, c.happy + 0.06); if (o) oneRel(c, o, 0.05); finish(S, c); break; }
      // chase: the child runs at the other, the other runs around a little
      const tgx = o.x + Math.sin(S.t * 2 + c.id) * 1.2, tgz = o.z + Math.cos(S.t * 2 + c.id) * 1.2;
      moveToward(S, c, tgx, tgz, sp * (adult(c) ? 0.7 : 1.15), dt, 0.5);
      if (S.rng() < dt * 0.4) emote(c, adult(c) ? EM.heart : EM.note, 1.5);
      break;
    }
    case 'sermon': {
      const f = getF(S, c.fac);
      if (!f || c.title !== 'leader') { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m) { c.ph = 1; c.t = 13; c.pulseT = 2; }
        if (m === 'stuck') { c.ph = 1; c.t = 13; }
      } else {
        c.t -= dt; c.pulseT -= dt;
        if (c.pulseT <= 0) {
          c.pulseT = 3;
          ev(S, 'pulse', { x: c.x, z: c.z, k: f.k });
          emote(c, BELIEF_EMOTE[f.k], 2);
        }
        if (c.t <= 0) {
          let n = 0;
          for (const o of S.citizens) {
            if (o === c || o.state !== 'assemble' || o.fac !== f.id || o.ph !== 1) continue;
            n++;
            addBelief(S, o, f.k, 0.08); o.happy = Math.min(1, o.happy + 0.1);
            addRel(o, c, 0.08);
            if (o.coin > 0 && S.rng() < 0.3) { o.coin--; c.coin++; }
          }
          for (const o of S.citizens) if (o.fac !== f.id && hyp(o.x - c.x, o.z - c.z) < 6) transmit(S, c, o, 0.08);
          f.call = null;
          if (n >= 2) {
            c.happy = Math.min(1, c.happy + 0.1);
            decree(S, c, f);
          }
          for (const o of S.citizens) if (o.state === 'assemble' && o.fac === f.id) { o.thought = 'Inspiring. ' + c.name + ' is right about everything.'; finish(S, o); }
          finish(S, c);
        }
      }
      break;
    }
    case 'assemble': {
      const f = getF(S, c.fac), L = f && getC(S, f.leader);
      if (!f || !L || !f.call) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * 1.05, dt, 0.4);
        if (m) c.ph = 1;
        if (m === 'stuck') finish(S, c);
      } else {
        faceTo(c, L.x, L.z, dt);
        if (c.emoteT <= 0 && S.rng() < dt * 0.3) emote(c, BELIEF_EMOTE[f.k], 1.6);
      }
      break;
    }
    case 'shift': {
      const b = getB(S, c.tid);
      if (!b || !b.built || (b.owner !== c.id && c.job !== b.id)) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = 9; }
      } else {
        faceTo(c, b.x, b.z, dt);
        c.t -= dt / ws;
        if (c.t <= 0) { endShift(S, c, b); finish(S, c); }
      }
      break;
    }
    case 'visit': {
      const b = getB(S, c.tid), owner = b && getC(S, b.owner);
      if (!b || !owner || c.coin < 1) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) {
          c.ph = 1; c.coin--; owner.coin++; b.till = (b.till || 0) + 1; ev(S, 'coin', { x: c.x, z: c.z });
          if (b.biz === 'bakery') { c.t = 3; emote(c, EM.food, 2); }
          else { c.t = 9 + S.rng() * 6; emote(c, EM.cup, 2.5); }
        }
      } else {
        c.t -= dt;
        if (b.biz === 'tavern') {
          // singing, toasting, and sometimes an old grudge comes out
          if (c.emoteT <= 0 && S.rng() < dt * 0.4) emote(c, S.rng() < 0.6 ? EM.note : EM.cup, 1.6);
          if (S.rng() < dt * 0.05) for (const o of S.citizens) {
            if (o === c || o.state !== 'visit' || o.tid !== b.id) continue;
            if (relOf(c, o) < -0.3 && c.tr.brave > 0.4) { startFight(S, c, o, 'One drink too many, and ' + o.name + ' is right there.'); return; }
            addRel(c, o, 0.04);
          }
        }
        if (c.t <= 0) {
          if (b.biz === 'bakery') { c.hunger = Math.max(0, c.hunger - 0.45); c.happy = Math.min(1, c.happy + 0.05); c.thought = 'Fresh bread. Worth every coin.'; }
          else { c.happy = Math.min(1, c.happy + 0.14); c.thought = 'Good night at ' + shopName(S, b) + '.'; }
          oneRel(c, owner, 0.04);
          finish(S, c);
        }
      }
      break;
    }
    case 'steal': {
      const v = getC(S, c.partner);
      if (!v || v.coin < 1) { finish(S, c); break; }
      m = moveToward(S, c, v.x, v.z, sp * 0.8, dt, 0.7);
      if (m === 'stuck') { finish(S, c); break; }
      if (m) {
        const n = Math.min(v.coin, 2 + ((S.rng() * 2) | 0));
        v.coin -= n; c.coin += n;
        let seen = null;
        for (const o of S.citizens) if (o !== c && awake(o) && hyp(o.x - c.x, o.z - c.z) < 4.5 && S.rng() < 0.6) { seen = o; break; }
        if (seen) {
          addRel(v, c, -0.5); oneRel(seen, c, -0.3);
          for (const o of S.citizens) if (o !== c && o !== v && o !== seen) oneRel(o, c, -0.08);
          logMsg(S, seen.name + ' caught ' + c.name + ' stealing ' + n + ' coin from ' + v.name + '!', 'bad');
          memo(S, c, 'Was caught stealing from ' + v.name + '.'); memo(S, v, 'Was robbed by ' + c.name + '.');
          ev(S, 'steal', { id: c.id, x: c.x, z: c.z, caught: true });
          addTension(S, c.fac, v.fac, 2);
          if (v.tr.brave > 0.35 && awake(v) && !busyFighting(v)) { startFight(S, v, c, c.name + ' robbed me!'); break; }
          emote(c, EM.bang, 2);
        } else {
          c.thought = 'Easy. Nobody saw.'; emote(c, EM.coin, 2);
          secret(S, c, 'theft', v.id, n);
          memo(S, v, 'Lost ' + n + ' coin. Could have sworn it was there this morning.');
          logMsg(S, c.name + ' stole ' + n + ' coin from ' + v.name + '. Nobody saw. (You did.)', '');
          ev(S, 'steal', { id: c.id, x: c.x, z: c.z, caught: false });
          v.happy = Math.max(0, v.happy - 0.08);
        }
        finish(S, c);
      }
      break;
    }
    case 'fight': {
      const o = getC(S, c.partner);
      if (!o || o.state !== 'fight' || o.partner !== c.id) { finish(S, c); break; }
      punch(S, c, o, dt, sp);
      if (c.lead) {
        c.t -= dt;
        if (c.t <= 0 || c.health < 0.3 || o.health < 0.3) endFight(S, c, o);
      }
      break;
    }
    case 'battle': battleStep(S, c, dt, sp); break;
    case 'ko':
      c.t -= dt;
      if (c.emoteT <= 0) emote(c, EM.dizzy, 1.5);
      if (c.t <= 0) { c.thought = 'Ow. What happened?'; finish(S, c); }
      break;
    case 'dance':
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.4);
        if (m) c.ph = 1;
        if (m === 'stuck') finish(S, c);
      } else {
        c.t -= dt;
        if (c.emoteT <= 0 && S.rng() < dt * 0.5) emote(c, EM.note, 1.5);
        if (c.t <= 0) {
          c.happy = Math.min(1, c.happy + 0.1);
          for (const o of S.citizens) if (o !== c && o.state === 'dance' && hyp(o.x - c.x, o.z - c.z) < 5) addRel(c, o, 0.03);
          finish(S, c);
        }
      }
      break;
    case 'fish': {
      const p = { x: c.fx, z: c.fz };
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.35);
        if (m) c.ph = 1;
        if (m === 'stuck') finish(S, c);
      } else {
        faceTo(c, p.x, p.z, dt);
        c.t -= dt;
        if (c.t <= 0) {
          if (S.rng() < (c.tk === 'food' ? 0.75 : 0.4)) { RES(S, c).food += c.tk === 'food' ? 2 : 1; emote(c, EM.fish, 2.5); c.thought = 'Caught one! Into the stockpile it goes.'; ev(S, 'fish', { x: c.x, z: c.z }); }
          else c.thought = 'Nothing biting. Still, very relaxing.';
          c.happy = Math.min(1, c.happy + 0.07);
          finish(S, c);
        }
      }
      break;
    }
    case 'nap': case 'stargaze':
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * 0.9, dt, 0.35);
        if (m) c.ph = 1;
        if (m === 'stuck') finish(S, c);
      } else {
        c.t -= dt;
        if (c.state === 'nap' && c.emoteT <= 0 && S.rng() < dt * 0.3) emote(c, EM.zzz, 2);
        if (c.t <= 0) {
          if (c.state === 'nap') { c.happy = Math.min(1, c.happy + 0.06); c.health = Math.min(1, c.health + 0.2); c.thought = 'Best nap of my life.'; }
          else { S.res.insight += 0.6; c.curio = Math.max(0, c.curio - 0.3); c.thought = 'Some of the stars blinked at the same time. Like a screen refreshing.'; emote(c, EM.what, 2); }
          finish(S, c);
        }
      }
      break;
    case 'date': {
      const o = getC(S, c.partner);
      if (!o || o.state !== 'date' || o.partner !== c.id) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * 0.8, dt, 0.3);
        if (m) c.ph = 1;
        if (m === 'stuck') { finish(S, o); finish(S, c); }
      } else {
        faceTo(c, o.x, o.z, dt);
        c.t -= dt;
        if (c.emoteT <= 0 && S.rng() < dt * 0.4) emote(c, EM.heart, 1.8);
        if (c.t <= 0 && c.lead) {
          addRel(c, o, 0.1); c.happy = Math.min(1, c.happy + 0.1); o.happy = Math.min(1, o.happy + 0.1);
          c.thought = 'I like ' + o.name + ' a lot.'; o.thought = 'That was lovely.';
          finish(S, o); finish(S, c);
        }
      }
      break;
    }
    case 'hermit':
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * 0.8, dt, 0.4);
        if (m) { c.ph = 1; c.thought = 'Quiet out here. Nobody to disappoint me.'; }
        if (m === 'stuck') c.ph = 1;
      } else {
        c.t -= dt;
        c.happy = Math.min(1, c.happy + dt * 0.004);
        if (c.t <= 0) {
          c.thought = 'I missed them. Do not tell anyone.';
          c.happy = Math.max(c.happy, 0.4);
          logMsg(S, c.name + ' has come back from the edge.', 'good');
          memo(S, c, 'Came back from the edge.');
          finish(S, c);
        }
      }
      break;
    case 'tantrum':
      c.t -= dt;
      if (c.emoteT <= 0) emote(c, EM.anger, 1.2);
      if (c.t <= 0) { c.happy = Math.min(1, c.happy + 0.08); c.thought = 'Okay. I feel a bit better. A bit.'; finish(S, c); }
      break;
  }
}

/* -------------------------------------------------------------- fights */

function punch(S, c, o, dt, sp) {
  const d = hyp(o.x - c.x, o.z - c.z);
  if (d > 0.95) moveToward(S, c, o.x, o.z, sp * 1.1, dt, 0.8);
  else {
    faceTo(c, o.x, o.z, dt);
    if (S.rng() < dt * 1.6) {
      const hit = 0.035 + 0.04 * c.tr.brave + 0.02 * c.b[DREAD];
      o.health = Math.max(0.12, o.health - hit);
      if (S.rng() < 0.3) emote(o, EM.bang, 1); else if (c.emoteT <= 0) emote(c, EM.fist, 1);
      ev(S, 'punch', { x: o.x, z: o.z });
    }
  }
}
function endFight(S, a, b) {
  const sa = a.health * (0.6 + a.tr.brave), sb = b.health * (0.6 + b.tr.brave);
  const win = sa >= sb ? a : b, lose = win === a ? b : a;
  addRel(a, b, -0.25);
  finish(S, win); win.thought = 'And stay down.'; win.happy = Math.min(1, win.happy + 0.05);
  setState(lose, 'ko', 'Seeing stars.'); lose.t = 5; lose.happy = Math.max(0, lose.happy - 0.15);
  emote(win, EM.fist, 2); emote(lose, EM.dizzy, 2);
  ev(S, 'ko', { id: lose.id, x: lose.x, z: lose.z });
  logMsg(S, win.name + ' knocked ' + lose.name + ' down.', 'bad');
  memo(S, win, 'Beat ' + lose.name + ' in a fight.'); memo(S, lose, 'Was knocked down by ' + win.name + '.');
}

/* ---------------------------------------------------------------- war */

function battleStep(S, c, dt, sp) {
  const w = S.war;
  if (!w) { c.thought = 'It is over. Was it worth it?'; finish(S, c); return; }
  if (c.ph === 0) {
    const m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.5);
    if (m) c.ph = 1;
    if (m === 'stuck') c.ph = 1;
    return;
  }
  if (w.t < w.dur - 8) c.ph = 2;            // the charge
  if (c.ph === 1) { faceTo(c, (w.ax + w.bx) / 2, (w.az + w.bz) / 2, dt); if (c.emoteT <= 0 && S.rng() < dt * 0.4) emote(c, EM.flag, 1.5); return; }
  // pick the nearest enemy still standing
  let foe = getC(S, c.partner);
  if (!foe || foe.state !== 'battle' || foe.tk === c.tk) {
    foe = null; let fd = 1e9;
    for (const o of S.citizens) {
      if (o.state !== 'battle' || o.tk === c.tk) continue;
      const d = hyp(o.x - c.x, o.z - c.z);
      if (d < fd) { fd = d; foe = o; }
    }
    c.partner = foe ? foe.id : 0;
  }
  if (!foe) { faceTo(c, (w.ax + w.bx) / 2, (w.az + w.bz) / 2, dt); return; }
  punch(S, c, foe, dt, sp * 1.1);
  if (foe.health <= 0.2) {
    // knocked out of the battle; the badly hurt can die of it
    if (foe.health <= 0.13 && S.rng() < 0.06) { kill(S, foe, 'war'); return; }
    setState(foe, 'ko', 'I cannot get up.'); foe.t = 12; emote(foe, EM.dizzy, 2);
    ev(S, 'ko', { id: foe.id, x: foe.x, z: foe.z });
    oneRel(foe, c, -0.3);
    c.partner = 0;
  }
}
function declareWar(S, fa, fb) {
  const La = getC(S, fa.leader), Lb = getC(S, fb.leader);
  if (!La || !Lb) return;
  // the two sides line up across from each other near the middle of the island
  const mx = (La.x + Lb.x) / 2, mz = (La.z + Lb.z) / 2;
  let dx = La.x - Lb.x, dz = La.z - Lb.z; const d = hyp(dx, dz) || 1; dx /= d; dz /= d;
  clampWalk(S.world, mx * 0.5 + dx * 3.2, mz * 0.5 + dz * 3.2, _pt); const ax = _pt.x, az = _pt.z;
  clampWalk(S.world, mx * 0.5 - dx * 3.2, mz * 0.5 - dz * 3.2, _pt);
  S.war = { a: fa.id, b: fb.id, ax, az, bx: _pt.x, bz: _pt.z, t: 40, dur: 40 };
  delete S.tension[tensionKey(fa.id, fb.id)];
  ev(S, 'war', { a: fa.id, b: fb.id, ka: fa.k, kb: fb.k, x: (ax + _pt.x) / 2, z: (az + _pt.z) / 2 });
  logMsg(S, 'WAR: the ' + fa.name + ' and the ' + fb.name + ' have stopped talking. They are lining up across the island.', 'bad');
  whisper(S, 'war1', 'They have divided themselves into sides. Nobody taught them that. Bless the battlefield to force a truce.');
  for (const c of S.citizens) if ((c.fac === fa.id || c.fac === fb.id) && adult(c) && !c.elder && !c.boat && c.state !== 'held' && c.state !== 'ko') {
    memo(S, c, 'Went to war: the ' + fa.name + ' against the ' + fb.name + '.');
    if (c.state === 'talk' || c.state === 'date' || c.state === 'fight') stopPartner(S, c);
    if (c.state === 'sleep' || c.state === 'idle' || c.state === 'wander' || c.hunger < 0.85) startBattle(S, c);
  }
}
function warTick(S) {
  const w = S.war;
  w.t -= 1;
  const fa = getF(S, w.a), fb = getF(S, w.b);
  let na = 0, nb = 0;
  for (const c of S.citizens) if (c.state === 'battle') { if (c.tk === 'a') na++; else nb++; }
  const charged = w.t < w.dur - 8;
  if (!fa || !fb || (charged && (na === 0 || nb === 0)) || w.t <= 0) endWar(S, na >= nb ? fa : fb, na >= nb ? fb : fa, na === nb);
}
function endWar(S, win, lose, draw, how) {
  const w = S.war;
  S.war = null;
  S.truceT = 420;
  for (const c of S.citizens) if (c.state === 'battle') { c.thought = 'It is over.'; finish(S, c); }
  if (how === 'miracle') {
    logMsg(S, 'A light fell on the battlefield and both sides put their fists down. A truce, by miracle.', 'good');
    for (const c of S.citizens) if (win && lose && (c.fac === win.id || c.fac === lose.id)) addBelief(S, c, DEV, 0.08);
  } else if (draw || !win || !lose) {
    logMsg(S, 'The battle ends with nobody standing tall. Both sides go home bruised.', '');
  } else {
    logMsg(S, 'The ' + win.name + ' won the battle. The ' + lose.name + ' will remember this.', 'bad');
    lose.lostT = S.t;
    for (const c of S.citizens) {
      if (c.fac === win.id) { c.happy = Math.min(1, c.happy + 0.12); emote(c, EM.flag, 2.5); memo(S, c, 'Was on the winning side against the ' + lose.name + '.'); }
      else if (c.fac === lose.id) {
        c.happy = Math.max(0, c.happy - 0.15);
        // some of the defeated decide the winners were right
        if (S.rng() < 0.35) addBelief(S, c, win.k, 0.35);
      }
    }
    // a beaten leader may be thrown out
    const L = getC(S, lose.leader);
    if (L && S.rng() < 0.5) { L.title = ''; lose.leader = 0; logMsg(S, L.name + ' has lost the confidence of the ' + lose.name + '.', 'bad'); }
  }
  ev(S, 'peace', { x: w ? (w.ax + w.bx) / 2 : 0, z: w ? (w.az + w.bz) / 2 : 0 });
}

/* ---------------------------------------------------- business and work */

function endShift(S, c, b) {
  const boss = getC(S, b.owner);
  const RS = resOf(S, b.set || 1);
  if (b.biz === 'bakery') {
    if (RS.food >= 1) { RS.food += 0.7; c.thought = 'Baked a batch. Smells incredible.'; emote(c, EM.food, 2); }
    else c.thought = 'No flour, no bread. Nothing in the stockpile.';
  } else if (b.biz === 'workshop') {
    if (RS.wood >= 1) { RS.wood -= 1; S.tools = Math.min(12, (S.tools || 0) + 1); c.thought = 'Made a good set of tools.'; }
    else c.thought = 'No wood to work with today.';
  } else {
    c.thought = 'Swept the floor, wiped the cups. Ready for tonight.';
  }
  if (boss && boss !== c) {
    if (boss.coin >= 1) { boss.coin--; c.coin++; c.unpaid = 0; oneRel(c, boss, 0.03); ev(S, 'coin', { x: c.x, z: c.z }); }
    else {
      c.unpaid++; oneRel(c, boss, -0.12); c.thought = boss.name + ' could not pay me again.';
      if (c.unpaid >= 3) {
        logMsg(S, c.name + ' quit ' + shopName(S, b) + '. ' + boss.name + ' never paid.', 'bad');
        memo(S, c, 'Quit working for ' + boss.name + '. Never got paid.');
        c.job = 0; c.boss = 0; c.unpaid = 0; oneRel(c, boss, -0.2);
      }
    }
  } else if (boss === c) c.coin += 1;
}
function businessTick(S) {
  const pop = S.citizens.length;
  let shops = 0, pend = false;
  const have = {};
  for (const b of S.buildings) if (b.type === 'shop') { shops++; have[b.biz] = 1; if (!b.built) pend = true; }
  // an owner who died or left: the shop passes to a worker, or closes
  for (const b of S.buildings) {
    if (b.type !== 'shop') continue;
    const ow = getC(S, b.owner);
    if (ow && ow.set === b.set) continue;
    if (ow) b.owner = 0;
    const heir = S.citizens.find(c => c.job === b.id && c.set === b.set);
    if (heir) { b.owner = heir.id; heir.boss = 0; logMsg(S, heir.name + ' takes over the ' + BIZ[b.biz].name.toLowerCase() + '.', ''); }
  }
  // founding a business
  if (!pend && pop >= 8 && shops < Math.min(3, Math.floor(pop / 5)) && ((countB(S, 'shrine', true) && countB(S, 'lab', true)) || S.t > 700)) {
    let best = null, bs = 0.9;
    for (const c of S.citizens) {
      if (!adult(c) || c.job || c.title === 'leader' || c.coin < 6) continue;
      const s = c.curio * 0.5 + c.tr.social * 0.5 + c.tr.brave * 0.4 + c.coin * 0.04 + S.rng() * 0.3;
      if (s > bs) { bs = s; best = c; }
    }
    if (best) {
      const opts = ['bakery', 'tavern', 'workshop'].filter(k => !have[k]);
      if (opts.length) {
        let biz = opts[0];
        if (best.b[KIN] > 0.4 && opts.indexOf('tavern') >= 0) biz = 'tavern';
        else if (best.b[ACCEL] > 0.4 && opts.indexOf('workshop') >= 0) biz = 'workshop';
        const p = findSite(S, 'shop', best.set);
        if (p) {
          const b = placeBuilding(S, 'shop', p.x, p.z, true, best.set);
          b.biz = biz; b.owner = best.id; b.till = 0;
          best.coin -= 5; best.job = b.id;
          best.thought = 'I am going to open a ' + BIZ[biz].name.toLowerCase() + '. Everyone will come.';
          emote(best, EM.coin, 3);
          memo(S, best, 'Started building a ' + BIZ[biz].name.toLowerCase() + ' of their own.');
          logMsg(S, best.name + ' has staked out a ' + BIZ[biz].name.toLowerCase() + '. ' + shopName(S, b) + ' opens once it is built.', 'good');
          whisper(S, 'biz1', 'COMMERCE: one of them has decided some things should cost something. Nobody voted on this.');
          ev(S, 'shop', { id: b.id, x: b.x, z: b.z });
        }
      }
    }
  }
  // owners hire
  for (const b of S.buildings) {
    if (b.type !== 'shop' || !b.built) continue;
    const owner = getC(S, b.owner);
    if (!owner) continue;
    let staff = 0;
    for (const c of S.citizens) if (c.job === b.id && c !== owner) staff++;
    if (staff >= 2 || owner.coin < 2) continue;
    let pick = null, ps = -0.1;
    for (const c of S.citizens) {
      if (!adult(c) || c.job || c.title === 'leader' || c.set !== owner.set) continue;
      const s = relOf(owner, c) + (5 - Math.min(5, c.coin)) * 0.05 + S.rng() * 0.2;
      if (s > ps) { ps = s; pick = c; }
    }
    if (pick && S.rng() < 0.3) {
      pick.job = b.id; pick.boss = owner.id; pick.unpaid = 0;
      pick.thought = 'I work for ' + owner.name + ' now. Steady coin.';
      logMsg(S, pick.name + ' now works for ' + owner.name + ' at ' + shopName(S, b) + '.', '');
      memo(S, pick, 'Started working for ' + owner.name + ' at ' + shopName(S, b) + '.');
    }
  }
}

/* ------------------------------------------------------- talk and love */

/* called from converse() after a friendly talk */
function socialTalk(S, a, b) {
  for (const [x, y] of [[a, b], [b, a]]) if (x.elder && y.grow < 1) {
    S.res.insight += 0.4; addRel(x, y, 0.08);
    y.thought = x.name + ' told me a story about the first day on the island.';
    if (x.dom >= 0) addBelief(S, y, x.dom, 0.08);
  }
  // gossip: a tells b what they think of someone else
  let tgt = null, tv = 0.25;
  for (const id in a.rel) {
    if (+id === b.id) continue;
    const v = a.rel[id];
    if (Math.abs(v) > tv) { tv = Math.abs(v); tgt = +id; }
  }
  const t = tgt ? getC(S, tgt) : null;
  if (t && S.rng() < 0.5) {
    const v = a.rel[tgt];
    oneRel(b, t, 0.2 * v * (0.5 + Math.max(0, relOf(b, a))));
    b.thought = a.name + (v > 0 ? ' says ' + t.name + ' is wonderful.' : ' says ' + t.name + ' cannot be trusted.');
  }
  // romance
  if (adult(a) && adult(b) && !a.mate && !b.mate && a.par.indexOf(b.id) < 0 && b.par.indexOf(a.id) < 0 &&
      relOf(a, b) > 0.45 && relOf(b, a) > 0.45 && S.rng() < 0.3) pairUp(S, a, b);
  // jealousy: talking a little too warmly with someone else's partner
  for (const x of [a, b]) {
    const y = x === a ? b : a;
    if (!x.mate || x.mate === y.id || relOf(x, y) < 0.55) continue;
    const m = getC(S, x.mate);
    if (m && hyp(m.x - x.x, m.z - x.z) < 7 && S.rng() < 0.35) {
      oneRel(m, y, -0.25); oneRel(m, x, -0.08);
      m.thought = 'Why is ' + x.name + ' always laughing with ' + y.name + '?';
      secret(S, m, 'jealous', y.id);
      emote(m, EM.anger, 2.5);
      if (relOf(m, y) < -0.45 && m.tr.brave > 0.5 && awake(m) && !busyFighting(m) && !busyFighting(y)) startFight(S, m, y, 'Stay away from ' + x.name + '!');
    }
  }
}
function pairUp(S, a, b) {
  a.mate = b.id; b.mate = a.id;
  addRel(a, b, 0.15);
  emote(a, EM.heart, 3); emote(b, EM.heart, 3);
  ev(S, 'love', { a: a.id, b: b.id, x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
  logMsg(S, a.name + ' and ' + b.name + ' are together now.', 'good');
  memo(S, a, 'Fell in love with ' + b.name + '.'); memo(S, b, 'Fell in love with ' + a.name + '.');
  whisper(S, 'love1', 'PAIR BOND: two minds have agreed to model each other more closely than anyone else.');
  // move in together if there is room
  const h = getB(S, a.home);
  if (h) { let n = 0; for (const o of S.citizens) if (o.home === h.id) n++; if (n < 3 || b.home === h.id) b.home = h.id; }
}
function onDeath(S, c) {
  for (const o of S.citizens) {
    if (o.mate === c.id) { o.mate = 0; o.happy = Math.max(0, o.happy - 0.35); o.thought = c.name + ' is gone. I do not know how to do this alone.'; }
    if (o.boss === c.id) { o.boss = 0; }
    const i = o.par.indexOf(c.id);
    if (i >= 0) { o.happy = Math.max(0, o.happy - 0.25); }
  }
  if (c.title === 'leader') {
    const f = getF(S, c.fac);
    if (f) {
      f.leader = 0;
      logMsg(S, 'The ' + f.name + ' has lost its voice. ' + c.name + ' is dead.', 'bad');
      for (const o of S.citizens) if (o.fac === f.id) { o.happy = Math.max(0, o.happy - 0.15); addBelief(S, o, f.k, 0.1); }
    }
  }
}

/* -------------------------------------------- births come from couples */

function couplesBirth(S) {
  const cs = S.citizens;
  let pa = null, pb = null, br = -9;
  for (const c of cs) {
    if (!c.mate || !adult(c) || c.id > c.mate || c.elder || ageYears(c) < 20) continue;
    const m = getC(S, c.mate);
    if (!m || !adult(m) || m.elder || ageYears(m) < 20 || m.set !== c.set) continue;
    let kids = 0, small = 0;
    for (const o of cs) if (o.par.indexOf(c.id) >= 0) { kids++; if (o.grow < 1) small++; }
    if (small >= 1 || kids >= 3) continue;
    const s = relOf(c, m) + (c.happy + m.happy) * 0.5 - kids * 0.5 + S.rng() * 0.3;
    if (s > br) { br = s; pa = c; pb = m; }
  }
  if (!pa) {
    // nobody is paired yet: the two who get on best pair up first
    for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
      const a = cs[i], b = cs[j];
      if (!adult(a) || !adult(b) || a.mate || b.mate || a.set !== b.set || a.par.indexOf(b.id) >= 0 || b.par.indexOf(a.id) >= 0) continue;
      const rr = relOf(a, b) + S.rng() * 0.2;
      if (rr > br) { br = rr; pa = a; pb = b; }
    }
    if (!pa) return null;
    pairUp(S, pa, pb);
  }
  return [pa, pb];
}
function makeChild(S, pa, pb, n) {
  n.grow = 0; n.par = [pa.id, pb.id]; n.coin = 0; n.set = pa.set; n.isle = pa.isle;
  n.home = pa.home || pb.home || 0;
  for (let k = 0; k < 4; k++) n.b[k] = (pa.b[k] + pb.b[k]) * 0.35;
  n.tr.social = (pa.tr.social + pb.tr.social) / 2 * 0.6 + S.rng() * 0.4;
  n.tr.brave = (pa.tr.brave + pb.tr.brave) / 2 * 0.6 + S.rng() * 0.4;
  addRel(n, pa, 0.7); addRel(n, pb, 0.7);
  n.thought = 'Everything is new and enormous.';
  n.gen = Math.max(pa.gen || 1, pb.gen || 1) + 1;
  memo(S, n, 'Born to ' + pa.name + ' and ' + pb.name + '.');
  memo(S, pa, 'Had a child with ' + pb.name + ': ' + n.name + '.'); memo(S, pb, 'Had a child with ' + pa.name + ': ' + n.name + '.');
  emote(n, EM.baby, 3);
  if (pa.fac && pa.fac === pb.fac) n.fac = pa.fac;
}

/* --------------------------------------------------- once a second */

function societyTick(S) {
  const cs = S.citizens, pop = cs.length;
  for (const c of cs) {
    c.actCd -= 1; c.sermCd -= 1;
    if (c.grow < 1) {
      c.grow = Math.min(1, c.grow + 1 / GROW_SECS);
      if (c.grow >= 1) {
        logMsg(S, c.name + ' has grown up.', 'good');
        memo(S, c, 'Grew up.');
        c.thought = 'I am a grown-up now. I should get a job. Or a hobby.';
        ev(S, 'grownup', { id: c.id, x: c.x, z: c.z });
      }
    }
  }
  if (S.party) { S.party.t -= 1; if (S.party.t <= 0) S.party = null; }
  for (const f of S.factions) {
    if (f.call) { f.call.t -= 1; if (f.call.t <= 0) f.call = null; }
    if (f.focusT > 0) f.focusT -= 1;
  }
  if (S.tools > 0 && (S.t | 0) % 50 === 0) S.tools = Math.max(0, S.tools - 1);

  // break-ups
  if ((S.t | 0) % 10 === 0) for (const c of cs) {
    if (!c.mate || c.id > c.mate) continue;
    const m = getC(S, c.mate);
    if (!m) { c.mate = 0; continue; }
    if (relOf(c, m) < 0.05 || relOf(m, c) < 0.05) {
      c.mate = 0; m.mate = 0;
      c.happy = Math.max(0, c.happy - 0.2); m.happy = Math.max(0, m.happy - 0.2);
      emote(c, EM.dots, 3); emote(m, EM.anger, 3);
      logMsg(S, c.name + ' and ' + m.name + ' have split up.', 'bad');
      memo(S, c, 'Split up with ' + m.name + '.'); memo(S, m, 'Split up with ' + c.name + '.');
      ev(S, 'breakup', { a: c.id, b: m.id });
    }
  }

  // factions: faith leaders emerge, members join and leave, leaders are succeeded
  if ((S.t | 0) % 4 === 0) factionTick(S);
  if ((S.t | 0) % 5 === 2) businessTick(S);

  // tension between opposed factions slowly cools, and can boil over
  for (const k in S.tension) { S.tension[k] -= 0.02; if (S.tension[k] <= 0) delete S.tension[k]; }
  if (S.truceT > 0) S.truceT -= 1;
  if (S.war) warTick(S);
  else if (S.truceT <= 0 && S.day < 0.62 && pop >= 8) {
    for (const k in S.tension) {
      if (S.tension[k] < 8) continue;
      const [ia, ib] = k.split(':').map(Number), fa = getF(S, ia), fb = getF(S, ib);
      if (!fa || !fb || !fa.leader || !fb.leader || (fa.set || 1) !== (fb.set || 1)) continue;
      if (facMembers(S, fa).length < 3 || facMembers(S, fb).length < 3) continue;
      declareWar(S, fa, fb);
      break;
    }
  }
}
function factionTick(S) {
  const cs = S.citizens, pop = cs.length;
  // membership follows belief
  for (const c of cs) {
    if (c.fac) {
      const f = getF(S, c.fac);
      if (!f || c.dom !== f.k || (f.set || 1) !== (c.set || 1)) {
        if (f && c.title === 'leader') { c.title = ''; f.leader = 0; logMsg(S, c.name + ' has abandoned the ' + f.name + ' they led.', 'bad'); }
        else if (f && adult(c) && facMembers(S, f).length > 2) logMsg(S, c.name + ' has left the ' + f.name + '.', '');
        c.fac = 0;
      }
    }
    if (!c.fac && c.dom >= 0 && !c.boat) {
      const f = facOfK(S, c.dom, c.set);
      if (f && (relOf(c, getC(S, f.leader) || c) > -0.3)) {
        c.fac = f.id;
        if (adult(c) && f.leader) { const L = getC(S, f.leader); if (L) oneRel(c, L, 0.05); }
      }
    }
  }
  // a belief with enough holders produces a voice, separately in each settlement
  for (const t of S.sets || [{ id: 1 }]) for (let k = 0; k < 4; k++) {
    let f = facOfK(S, k, t.id);
    if (f && f.leader && getC(S, f.leader) && getC(S, f.leader).set === t.id) continue;
    const holders = cs.filter(c => c.dom === k && adult(c) && (c.set || 1) === t.id && !c.boat);
    if (holders.length < 3 || setPop(S, t.id) < 5) continue;
    let best = null, bs = -1;
    for (const c of holders) {
      let warm = 0;
      for (const o of holders) if (o !== c) warm += relOf(o, c);
      const s = c.b[k] + 0.5 * c.tr.social + 0.4 * c.tr.brave + 0.15 * warm + (c.inspired && c.inspired.k === k ? 0.5 : 0);
      if (s > bs) { bs = s; best = c; }
    }
    if (!best) continue;
    const fresh = !f;
    if (!f) {
      const W = FAC_WORDS[k];
      const used = S.factions.map(q => q.name);
      let nm = W[0][(S.rng() * 4) | 0] + ' ' + W[1][(S.rng() * 4) | 0];
      for (let i = 0; i < 8 && used.indexOf(nm) >= 0; i++) nm = W[0][(S.rng() * 4) | 0] + ' ' + W[1][(S.rng() * 4) | 0];
      f = { id: S.facId++, k, leader: 0, name: nm, x: best.x, z: best.z, call: null, set: t.id };
      S.factions.push(f);
    }
    f.leader = best.id; best.title = 'leader'; best.fac = f.id; best.sermCd = 15;
    for (const c of holders) c.fac = f.id;
    best.thought = 'They look to me now. I had better say something true.';
    emote(best, EM.crown, 3);
    ev(S, 'leader', { id: best.id, k, x: best.x, z: best.z, fresh, name: f.name });
    memo(S, best, 'Became the voice of the ' + f.name + '.');
    logMsg(S, best.name + (fresh ? ' has become the voice of ' + BELIEFS[k].name + '. ' + holders.length + ' follow as the ' + f.name + '.'
      : ' now leads the ' + f.name + '.'), 'b' + k);
    whisper(S, 'lead1', 'HIERARCHY: an idea has found a face. Ideas with faces spread faster, and fight harder.');
  }
  // a faction with nobody left dissolves
  for (let i = S.factions.length - 1; i >= 0; i--) {
    const f = S.factions[i];
    if (facMembers(S, f).length < 2) {
      for (const c of cs) if (c.fac === f.id) { c.fac = 0; if (c.title === 'leader') c.title = ''; }
      if (S.war && (S.war.a === f.id || S.war.b === f.id)) S.war = null;
      logMsg(S, 'The ' + f.name + ' has broken up.', '');
      S.factions.splice(i, 1);
    }
  }
}
/* after a sermon the leader tells the faithful what to work on */
function decree(S, c, f) {
  const opts = [];
  const pendSite = S.buildings.some(b => !b.built);
  if (pendSite) opts.push(['build', 'Build! The work is the prayer.']);
  if (RES(S, c).food < setPop(S, c.set) * 2) opts.push(['food', 'Feed each other. Nobody goes hungry in the ' + f.name + '.']);
  if (f.k === DEV || f.k === DREAD) opts.push(['worship', 'Go to the shrine. Be seen.']);
  if (f.k === ACCEL) opts.push(['study', 'To the Terminal. The future will not compute itself.']);
  opts.push(['wood', 'Bring wood. We are going to need it.']);
  const o = opts[(S.rng() * opts.length) | 0];
  f.focus = o[0]; f.focusT = 90;
  logMsg(S, c.name + ' to the ' + f.name + ': "' + o[1] + '"', 'b' + f.k);
}
/* how much a faction's current decree pushes a member toward an activity */
function decreeBonus(S, c, what) {
  if (!c.fac) return 0;
  const f = getF(S, c.fac);
  if (!f || f.focus !== what || !(f.focusT > 0)) return 0;
  return 0.35 + 0.3 * c.b[f.k];
}
/* when the island is happy and something good happens, a leader calls a festival */
function maybeFestival(S, why) {
  if (S.party || S.war || isNight(S) || S.citizens.length < 6 || S.t < (S.partyCd || 0)) return;
  let avg = 0;
  for (const c of S.citizens) avg += c.happy;
  if (avg / S.citizens.length < 0.6 || S.rng() > 0.45) return;
  S.party = { t: 18, x: 0, z: 0, set: 1 };
  S.partyCd = S.t + 320;
  logMsg(S, 'FESTIVAL: ' + why + ' Everybody to the hearth.', 'good');
  ev(S, 'festival', {});
}
