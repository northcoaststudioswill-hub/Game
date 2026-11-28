'use strict';
/* GODMODE.EXE: the wider world. Fog over the unexplored, the invention of boats, docks and
   shipwrights, voyages of exploration, and groups who sail away to found settlements of
   their own (a faith, a company, a war host, or just the fed-up). Settlements trade and
   raid each other across the water. Pure simulation: no DOM, no THREE. */

const VOY_STATES = { shipwright: 1, embark: 1, aboard: 1, ashore: 1, reboard: 1 };
const ISLE_NAMES = ['Saltmere', 'Greenhollow', 'Cinder Isle', 'the Teeth', 'Mossback', 'Farwater', 'Gull Rock', 'Lantern Key',
  'Hush', 'Driftholm', 'Tallgrass', 'Ember Reef', 'Stillwater', 'the Anvil', 'Brightshoal', 'Low Barrow'];
const SET_KINDS = {
  home:    { name: 'village',    desc: 'Where it all began.' },
  faith:   { name: 'faith colony', desc: 'Founded by believers who wanted a place where everyone believes the same thing.' },
  company: { name: 'company town', desc: 'Founded by someone rich enough to take their workers with them. Everyone works for the founder.' },
  warband: { name: 'war host',   desc: 'Founded by fighters. They raid other settlements for food.' },
  free:    { name: 'free camp',  desc: 'Founded by people who were fed up with everyone else.' }
};

/* ------------------------------------------------------------- settlements */

function fillVoyage(S) {
  if (!S.sets) S.sets = [{ id: 1, name: 'the First Village', isle: 0, x: 0, z: 0, kind: 'home', founder: 0, k: -1, day: 1 }];
  if (!S.boats) S.boats = [];
  if (!S.tech) S.tech = { boats: false };
  if (!S.found) { S.found = S.world.isles.map(I => I.id === 0); }
  if (!S.isleNames) S.isleNames = { 0: 'the home island' };
  if (!S.rival) S.rival = {};
  if (S.setId === undefined) S.setId = 2;
  if (S.boatId === undefined) S.boatId = 1;
  if (S.voyCd === undefined) S.voyCd = 0;
  if (S.settleCd === undefined) S.settleCd = 0;
  if (S.knownR === undefined) S.knownR = 14;
  if (typeof S.fog === 'string') {
    const f = new Uint8Array(FOG_N * FOG_N);
    for (let i = 0; i < f.length && i < S.fog.length; i++) f[i] = S.fog.charCodeAt(i) === 49 ? 1 : 0;
    S.fog = f;
  }
  if (!S.fog) { S.fog = new Uint8Array(FOG_N * FOG_N); revealAt(S, 0, 0, 12); }
  S.fogV = (S.fogV || 0) + 1;
  for (const c of S.citizens) { if (!c.set) c.set = 1; if (c.isle === undefined) c.isle = isleNear(S.world, c.x, c.z); if (c.boat === undefined) c.boat = 0; }
  for (const b of S.buildings) { if (!b.set) b.set = 1; if (b.isle === undefined) b.isle = isleNear(S.world, b.x, b.z); }
  for (const f of S.factions || []) if (!f.set) f.set = 1;
}
/* someone changes settlement: they lose their place in its faction, job, home and (if their partner stays) marriage */
function leaveSettlement(S, c, st) {
  if (c.fac) { const f = getF(S, c.fac); if (f && f.leader === c.id) f.leader = 0; }
  c.title = ''; c.fac = 0; c.home = 0;
  if (c.job) { const b = getB(S, c.job); if (b && b.owner === c.id) b.owner = 0; c.job = 0; }
  c.boss = 0;
  c.set = st;
  if (c.mate) { const m = getC(S, c.mate); if (m && m.set !== st && !(m.boat && boatOf(S, m.boat) && boatOf(S, m.boat).m && boatOf(S, m.boat).m.kind === 'settle')) { memo(S, c, 'Lost ' + m.name + ' to the sea between them.'); memo(S, m, 'Lost ' + c.name + ' to the sea between them.'); m.mate = 0; c.mate = 0; } }
}
function setById(S, id) { for (const t of S.sets) if (t.id === id) return t; return S.sets[0]; }
function resOf(S, id) { const t = setById(S, id); return t.id === 1 || !t.res ? S.res : t.res; }
function RES(S, c) { return resOf(S, c.set || 1); }
function hearthOf(S, c) { return setById(S, c.set || 1); }
function setPop(S, id) { let n = 0; for (const c of S.citizens) if ((c.set || 1) === id) n++; return n; }
function isleName(S, id) { return S.isleNames[id] || 'an unnamed island'; }
function rivalKey(a, b) { return a < b ? a + ':' + b : b + ':' + a; }

/* ------------------------------------------------------------------ fog */

function revealAt(S, x, z, r) {
  const W = S.world, c0 = Math.floor((x + WORLD_HALF) / FOG_CELL), r0 = Math.floor((z + WORLD_HALF) / FOG_CELL), rc = Math.ceil(r / FOG_CELL);
  let fresh = false;
  for (let j = r0 - rc; j <= r0 + rc; j++) for (let i = c0 - rc; i <= c0 + rc; i++) {
    if (i < 0 || j < 0 || i >= FOG_N || j >= FOG_N) continue;
    const k = j * FOG_N + i;
    if (S.fog[k]) continue;
    const cx = -WORLD_HALF + (i + 0.5) * FOG_CELL, cz = -WORLD_HALF + (j + 0.5) * FOG_CELL;
    if (hyp(cx - x, cz - z) > r + FOG_CELL * 0.5) continue;
    S.fog[k] = 1; fresh = true;
    const d = hyp(cx, cz) + 10;
    if (d > S.knownR) S.knownR = Math.min(WORLD_HALF, d);
    for (const I of W.isles) if (!S.found[I.id] && hyp(cx - I.cx, cz - I.cz) < I.R + FOG_CELL * 0.6) discoverIsle(S, I, x, z);
  }
  if (fresh) S.fogV++;
  return fresh;
}
function discoverIsle(S, I, fx, fz) {
  S.found[I.id] = true;
  // who saw it: the nearest person
  let by = null, bd = 1e9;
  for (const c of S.citizens) { const d = hyp(c.x - fx, c.z - fz); if (d < bd) { bd = d; by = c; } }
  const used = Object.values(S.isleNames);
  let name = ISLE_NAMES.find(n => used.indexOf(n) < 0) || 'Isle ' + I.id;
  if (by && S.rng() < 0.3 && used.indexOf(by.name + "'s Landing") < 0) name = by.name + "'s Landing";
  S.isleNames[I.id] = name;
  const ang = Math.atan2(I.cx, -I.cz), dirs = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  const dir = dirs[(Math.round(ang / (TAU / 8)) + 8) % 8];
  const what = I.kind === 'forest' ? 'thick with trees' : I.kind === 'stone' ? 'all rock and scree' : 'green and grassy';
  logMsg(S, 'LAND: ' + (by ? by.name : 'Someone') + ' has sighted an island to the ' + dir + ', ' + what + (I.mountain ? ', with a peak' : '') + '. They call it ' + name + '.', 'good');
  if (by) { memo(S, by, 'Was the first to see ' + name + '.'); by.happy = Math.min(1, by.happy + 0.2); }
  S.stats.found = (S.stats.found || 0) + 1;
  ev(S, 'discover', { isle: I.id, name, x: I.cx, z: I.cz });
  whisper(S, 'disc1', 'They have found that the world is bigger than the island. Some of them are already wondering who would go.');
}

/* --------------------------------------------------------- docks and boats */

/* a point on an isle's shore at an angle: where people stand to board, and where boats moor */
function shorePoints(S, isleId, ang) {
  const I = S.world.isles[isleId], rr = rimR(I, ang);
  return { ix: I.cx + Math.sin(ang) * (rr - 1.8), iz: I.cz + Math.cos(ang) * (rr - 1.8), bx: I.cx + Math.sin(ang) * (rr + 2.4), bz: I.cz + Math.cos(ang) * (rr + 2.4) };
}
function findShore(S, t, toward) {
  const I = S.world.isles[t.isle];
  let best = null, bs = -1e9;
  for (let k = 0; k < 24; k++) {
    const ang = k / 24 * TAU;
    const p = shorePoints(S, t.isle, ang);
    if (!walkable(S.world, p.ix, p.iz, 0)) continue;
    let ok = true;
    for (const b of S.buildings) if (hyp(b.x - p.ix, b.z - p.iz) < BUILD[b.type].r + 1.6) ok = false;
    if (!ok) continue;
    let s = -hyp(p.ix - t.x, p.iz - t.z) * 0.05 + S.rng() * 0.4;
    if (toward) s += Math.cos(ang - Math.atan2(toward.x - I.cx, toward.z - I.cz)) * 2;
    if (s > bs) { bs = s; best = { ang, ...p }; }
  }
  return best;
}
function placeDock(S, t) {
  const p = findShore(S, t, null);
  if (!p) return null;
  const b = placeBuilding(S, 'dock', p.ix, p.iz, true, t.id);
  b.rot = p.ang; b.ang = p.ang;
  logMsg(S, 'The people of ' + t.name + ' have staked out a dock on the shore.', '');
  return b;
}
function makeBoat(S, t, dock) {
  const p = shorePoints(S, t.isle, dock ? dock.ang : 0);
  const bt = { id: S.boatId++, set: t.id, x: p.bx, z: p.bz, px: p.bx, pz: p.bz, ang: (dock ? dock.ang : 0), ix: p.ix, iz: p.iz, hx: p.bx, hz: p.bz,
    st: 'docked', crew: [], m: null, t: 0, loot: null, name: '' };
  const NAMES_B = ['Dawn', 'Gull', 'Brave Idea', 'Second Chance', 'Little Fish', 'Far Hope', 'Salt', 'Wanderer', 'Promise', 'Kettle'];
  const usedB = S.boats.map(o => o.name);
  bt.name = 'the ' + NAMES_B[(bt.id * 7) % NAMES_B.length];
  for (let i = 0; i < NAMES_B.length && usedB.indexOf(bt.name) >= 0; i++) bt.name = 'the ' + NAMES_B[(bt.id * 7 + i + 1) % NAMES_B.length];
  if (usedB.indexOf(bt.name) >= 0) bt.name += ' ' + ['II', 'III', 'IV', 'V', 'VI'][bt.id % 5];
  S.boats.push(bt);
  return bt;
}
function boatOf(S, id) { for (const b of S.boats) if (b.id === id) return b; return null; }
function freeBoat(S, setId) { for (const b of S.boats) if (b.set === setId && b.st === 'docked') return b; return null; }

/* ------------------------------------------------------ options for think() */

function voyageOptions(S, c, consider, night) {
  if (!S.tech.boats || !adult(c) || c.elder || night) return;
  const t = hearthOf(S, c), res = RES(S, c);
  // build a boat at the dock
  const dock = S.buildings.find(b => b.type === 'dock' && b.built && b.set === t.id);
  if (dock) {
    let have = 0, building = 0;
    for (const b of S.boats) if (b.set === t.id) have++;
    for (const o of S.citizens) if (o.state === 'shipwright' && o.set === t.id) building++;
    if (have < (setPop(S, t.id) >= 10 ? 2 : 1) && res.wood >= 8 && !building) consider(0.55 + 0.3 * c.curio, () => {
      setState(c, 'shipwright', 'Building a boat. It has to float. That is the main thing.');
      c.tid = dock.id; c.tx = dock.x; c.tz = dock.z;
    });
  }
  // join a crew that is boarding
  for (const b of S.boats) {
    if (b.st !== 'boarding' || b.set !== t.id || !b.m || b.m.kind !== 'explore' || b.crew.length + b.coming >= 3) continue;
    consider(0.4 + 0.6 * c.curio + 0.3 * c.tr.brave, () => joinBoat(S, c, b, 'There is room on ' + b.name + '. I am going too.'));
  }
  // set out to explore
  const bt = freeBoat(S, t.id);
  if (bt && S.voyCd <= 0 && c.tr.brave > 0.4 && c.curio > 0.4 && c.title !== 'leader' && S.fogLeft !== 0 && c.hunger < 0.5) {
    consider(0.45 + 0.8 * c.curio + 0.3 * c.tr.brave + 0.2 * c.b[ACCEL], () => {
      bt.st = 'boarding'; bt.t = 10; bt.m = { kind: 'explore', by: c.id }; bt.coming = 0; bt.crew = [];
      S.voyCd = 110;
      joinBoat(S, c, bt, 'Nobody knows what is out there. Somebody should look.');
      S.stats.voyages = (S.stats.voyages || 0) + 1;
      if (S.stats.voyages <= 3) logMsg(S, c.name + ' is taking ' + bt.name + ' out to see what lies in the fog.', '');
    });
  }
}
function joinBoat(S, c, b, why) {
  setState(c, 'embark', why);
  c.tid = b.id; c.tx = b.ix; c.tz = b.iz;
  b.coming = (b.coming || 0) + 1;
}

/* --------------------------------------------------- per-step behaviour */

function updateVoyage(S, c, dt, sp) {
  let m;
  switch (c.state) {
    case 'shipwright': {
      const d = getB(S, c.tid);
      if (!d) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.5);
        if (m) { c.ph = 1; c.t = 12; }
        if (m === 'stuck') finish(S, c);
      } else {
        faceTo(c, d.x + Math.sin(d.ang) * 3, d.z + Math.cos(d.ang) * 3, dt);
        c.t -= dt * workSpeed(S, c);
        if (c.t <= 0) {
          const res = RES(S, c);
          if (res.wood >= 8) {
            res.wood -= 8;
            const t = hearthOf(S, c), b = makeBoat(S, t, d);
            memo(S, c, 'Built a boat with their own hands: ' + b.name + '.');
            logMsg(S, c.name + ' has finished a boat, ' + b.name + '.', 'good');
            ev(S, 'boat', { x: b.x, z: b.z });
            c.coin += 2;
          }
          finish(S, c);
        }
      }
      break;
    }
    case 'embark': {
      const b = boatOf(S, c.tid);
      if (!b || b.st !== 'boarding') { finish(S, c); break; }
      m = moveToward(S, c, c.tx, c.tz, sp * 1.05, dt, 0.5);
      if (m === 'stuck' || m) {
        b.coming = Math.max(0, (b.coming || 1) - 1);
        b.crew.push(c.id); c.boat = b.id; c.state = 'aboard'; c.ph = 0;
        const RS = RES(S, c); if (c.hunger > 0.3 && RS.food >= 1) { RS.food -= 1; c.hunger = 0; }   // provisions for the trip
        c.thought = b.m.kind === 'explore' ? 'On board. Nervous. Excited.' : b.m.kind === 'settle' ? 'Leaving everything behind.' : b.m.kind === 'raid' ? 'We go to take what we need.' : 'Setting sail.';
      }
      break;
    }
    case 'aboard':
      // the boat moves the crew; if they are somehow not on one, set them ashore
      if (!boatOf(S, c.boat)) { c.boat = 0; clampWalk(S.world, c.x, c.z, _pt); c.x = c.px = _pt.x; c.z = c.pz = _pt.z; finish(S, c); }
      else if (c.emoteT <= 0 && S.rng() < dt * 0.15) emote(c, S.rng() < 0.5 ? EM.what : EM.note, 1.5);
      break;
    case 'ashore': {
      const b = boatOf(S, c.tid);
      if (!b) { finish(S, c); break; }
      const t = setById(S, b.m.target);
      c.t -= dt;
      if (c.ph === 0) {
        m = moveToward(S, c, t.x, t.z, sp * 1.1, dt, BUILD.fire.r + 0.8);
        if (m || c.t < 18) {
          c.ph = 1;
          if (b.m.kind === 'raid') raidLoot(S, c, b, t);
          else if (b.m.kind === 'trade') tradeGoods(S, c, b, t);
        }
      } else if (c.t <= 0 || b.m.done) { setState(c, 'reboard', 'Back to the boat.'); c.tid = b.id; c.tx = b.m.lx; c.tz = b.m.lz; }
      break;
    }
    case 'reboard': {
      const b = boatOf(S, c.tid);
      if (!b) { finish(S, c); break; }
      m = moveToward(S, c, c.tx, c.tz, sp * 1.15, dt, 0.5);
      if (m || m === 'stuck') { if (b.crew.indexOf(c.id) < 0) b.crew.push(c.id); c.boat = b.id; c.state = 'aboard'; c.ph = 0; }
      break;
    }
  }
}

/* ------------------------------------------------------------- the boats */

function boatStep(S, dt) {
  const W = S.world;
  for (const b of S.boats.slice()) {
    b.px = b.x; b.pz = b.z;
    b.crew = b.crew.filter(id => { const c = getC(S, id); return c && c.boat === b.id; });
    if (b.st === 'boarding') {
      b.t -= dt;
      if (b.t <= 0 || (b.crew.length && !b.coming)) {
        if (!b.crew.length) {
          if (b.t < -25) { b.st = 'docked'; b.m = null; for (const c of S.citizens) if (c.state === 'embark' && c.tid === b.id) finish(S, c); }
          continue;
        }
        for (const c of S.citizens) if (c.state === 'embark' && c.tid === b.id) { c.thought = 'Missed the boat.'; finish(S, c); }
        launch(S, b);
      }
    } else if (b.st === 'out' || b.st === 'back') {
      sail(S, b, dt);
      b.t += dt;
      // a boat that cannot find its way in is carried by the current
      if (b.t > 110 && b.m) { b.x = b.m.tx; b.z = b.m.tz; arrive(S, b); continue; }
      if (b.st === 'out' && b.m.kind === 'explore' && b.t > 70) goHome(S, b);
      if (b.st === 'out' && b.m.kind === 'explore' && !b.m.circling) {
        // land in sight: swing over for a proper look
        for (const I of W.isles) if (S.found[I.id] && !S.sets.some(t => t.isle === I.id && !t.empty) && hyp(I.cx - b.x, I.cz - b.z) < I.R + 22 && !(b.m.seen || []).includes(I.id)) {
          b.m.seen = (b.m.seen || []).concat(I.id); b.m.circling = I.id;
          const a = Math.atan2(b.x - I.cx, b.z - I.cz) + 1.2;
          b.m.tx = I.cx + Math.sin(a) * (I.R + 6); b.m.tz = I.cz + Math.cos(a) * (I.R + 6);
          break;
        }
      }
    } else if (b.st === 'wait') {
      // moored at someone else's shore while the crew is ashore
      b.t -= dt;
      const party = (b.m.party || []).map(id => getC(S, id)).filter(c => c && !c.boat && c.isle === S.world.isles[b.m.isleT !== undefined ? b.m.isleT : isleNear(S.world, b.m.lx, b.m.lz)].id);
      const ashore = party.filter(c => c.state === 'ashore' || c.state === 'reboard').length;
      if (!ashore || b.t <= 0) {
        // everyone who came is taken home, whatever they are doing (fighting, mourning, knocked out)
        for (const c of party) {
          if (c.state === 'fight') { const o = getC(S, c.partner); if (o && o.partner === c.id) finish(S, o); }
          setState(c, 'aboard'); c.boat = b.id; c.x = c.px = b.m.lx; c.z = c.pz = b.m.lz; if (b.crew.indexOf(c.id) < 0) b.crew.push(c.id);
        }
        goHome(S, b);
      }
    }
    // the crew ride along
    b.crew.forEach((id, i) => {
      const c = getC(S, id);
      if (!c) return;
      const rows = Math.ceil(b.crew.length / 2), sx = b.crew.length === 1 ? 0 : (i % 2 ? 0.3 : -0.3), sz = (Math.floor(i / 2) - (rows - 1) / 2) * 0.62 - 0.2;
      const ca = Math.cos(b.ang), sa = Math.sin(b.ang);
      c.px = c.x; c.pz = c.z;
      c.x = b.x + sx * ca + sz * sa; c.z = b.z - sx * sa + sz * ca;
      c.face = b.ang;
    });
  }
}
function launch(S, b) {
  b.st = 'out'; b.t = 0;
  const home = setById(S, b.set);
  if (b.m.kind === 'explore') {
    // head for the darkest part of the map
    let best = 0, bs = -1;
    for (let k = 0; k < 16; k++) {
      const a = k / 16 * TAU + S.rng() * 0.2;
      let unknown = 0, first = 0;
      for (let d = 12; d < 130; d += 6) {
        const x = b.x + Math.sin(a) * d, z = b.z + Math.cos(a) * d;
        if (Math.abs(x) > WORLD_HALF - 4 || Math.abs(z) > WORLD_HALF - 4) break;
        if (!fogKnown(S, x, z)) { unknown++; if (!first) first = d; }
      }
      const s = unknown ? unknown + S.rng() * 3 : 0;
      if (s > bs) { bs = s; best = { a, d: Math.min(110, (first || 40) + 28) }; }
    }
    if (bs <= 0) S.fogLeft = 0;
    b.m.tx = clamp(b.x + Math.sin(best.a) * best.d, -WORLD_HALF + 6, WORLD_HALF - 6);
    b.m.tz = clamp(b.z + Math.cos(best.a) * best.d, -WORLD_HALF + 6, WORLD_HALF - 6);
  }
  for (const id of b.crew) { const c = getC(S, id); if (c) memo(S, c, b.m.kind === 'explore' ? 'Sailed out into the fog on ' + b.name + '.' : b.m.kind === 'settle' ? 'Left ' + home.name + ' for good, on ' + b.name + '.' : b.m.kind === 'raid' ? 'Sailed with the raiders on ' + b.name + '.' : 'Sailed on ' + b.name + ' to trade.'); }
  ev(S, 'sail', { x: b.x, z: b.z, kind: b.m.kind });
}
function goHome(S, b) {
  const h = setById(S, b.set);
  b.st = 'back'; b.t = 0;
  if (!b.m) b.m = { kind: 'return' };
  b.m.circling = 0;
  b.m.tx = b.hx; b.m.tz = b.hz;
  if (!b.m.target && h) { /* home berth already set */ }
}
function sail(S, b, dt) {
  const W = S.world, tx = b.m.tx, tz = b.m.tz;
  const dx = tx - b.x, dz = tz - b.z, d = hyp(dx, dz);
  if (d < 1.2) { arrive(S, b); return; }
  const sp = ((S.rev || 0) >= 3 ? 6.5 : 5) * Math.min(1, d / 4 + 0.3);
  let vx = dx / d, vz = dz / d;
  // steer around land
  for (const I of W.isles) {
    if (d < 14 && hyp(tx - I.cx, tz - I.cz) < I.R * 1.3 + 5) continue;   // coming in to moor here
    const ox = b.x - I.cx, oz = b.z - I.cz, od = hyp(ox, oz), rr = rimR(I, Math.atan2(ox, oz)) + 3.2;
    if (od < rr + 3) {
      const push = clamp((rr + 3 - od) / 3, 0, 1);
      // slide round the island in the direction of travel; keep the side once chosen so it cannot dither
      if (!b.sides) b.sides = {};
      if (b.sides[I.id] === undefined) b.sides[I.id] = (ox * vz - oz * vx) >= 0 ? -1 : 1;
      const side = b.sides[I.id];
      vx += (ox / od) * push * 1.4 + (oz / od) * side * push * 0.9;
      vz += (oz / od) * push * 1.4 - (ox / od) * side * push * 0.9;
    }
  }
  const vn = hyp(vx, vz) || 1;
  b.x += vx / vn * sp * dt; b.z += vz / vn * sp * dt;
  for (const k in b.sides || {}) { const I = W.isles[k]; if (hyp(b.x - I.cx, b.z - I.cz) > I.R + 12) delete b.sides[k]; }
  b.x = clamp(b.x, -WORLD_HALF + 2, WORLD_HALF - 2); b.z = clamp(b.z, -WORLD_HALF + 2, WORLD_HALF - 2);
  b.ang += angDiff(b.ang, Math.atan2(vx, vz)) * Math.min(1, dt * 3);
  if (b.m.circling && d < 6) { b.m.circling = 0; b.m.tx = b.x + Math.sin(b.ang) * 30; b.m.tz = b.z + Math.cos(b.ang) * 30; b.t = Math.max(b.t, 50); }
}
function arrive(S, b) {
  if (b.st === 'back') {
    // home: everyone ashore
    b.st = 'docked'; b.x = b.hx; b.z = b.hz;
    const m = b.m; b.m = null;
    const crew = b.crew.map(id => getC(S, id)).filter(Boolean);
    for (const c of crew) {
      c.boat = 0; c.x = c.px = b.ix + (S.rng() - 0.5); c.z = c.pz = b.iz + (S.rng() - 0.5);
      c.isle = isleNear(S.world, c.x, c.z);
      finish(S, c);
      c.happy = Math.min(1, c.happy + 0.1);
    }
    b.crew = [];
    if (m.kind === 'explore') {
      S.res.insight += 2 + crew.length;
      const seen = (m.seen || []).map(id => isleName(S, id));
      for (const c of crew) { c.curio = 0; memo(S, c, 'Came home from the sea' + (seen.length ? ' having seen ' + seen.join(' and ') : ' with nothing but stories') + '.'); }
      if (crew.length && (seen.length || S.stats.voyages <= 3)) logMsg(S, crew[0].name + (crew.length > 1 ? "'s crew is" : ' is') + ' back from the fog' + (seen.length ? ', full of talk about ' + seen.join(' and ') : ' with nothing to report but water') + '.', 'good');
    } else if (m.kind === 'raid' && b.loot) {
      const res = resOf(S, b.set);
      res.food += b.loot.food; res.wood += b.loot.wood;
      if (crew.length) logMsg(S, 'The raiders are home with ' + Math.round(b.loot.food) + ' food and ' + Math.round(b.loot.wood) + ' wood.', 'bad');
      b.loot = null;
    } else if (m.kind === 'trade') {
      if (crew.length) logMsg(S, 'The traders are back in ' + setById(S, b.set).name + '.', '');
    }
    ev(S, 'dock', { x: b.x, z: b.z });
    return;
  }
  const m = b.m;
  if (m.kind === 'settle') { foundSettlement(S, b); return; }
  if (m.kind === 'raid' || m.kind === 'trade') {
    // moor and go ashore
    b.st = 'wait'; b.t = 40;
    b.m.party = b.crew.slice();
    for (const id of b.crew) {
      const c = getC(S, id);
      if (!c) continue;
      c.boat = 0; c.x = c.px = m.lx + (S.rng() - 0.5); c.z = c.pz = m.lz + (S.rng() - 0.5); c.isle = isleNear(S.world, c.x, c.z);
      setState(c, 'ashore', m.kind === 'raid' ? 'Take what we can carry. Move fast.' : 'We come in peace. And with wood.');
      c.tid = b.id; c.t = 30;
    }
    b.crew = [];
    return;
  }
  goHome(S, b);
}

/* --------------------------------------------------- founding a settlement */

function foundSettlement(S, b) {
  const m = b.m, I = S.world.isles[m.isle];
  if (!b.crew.some(id => getC(S, id))) { goHome(S, b); return; }
  const from = setById(S, b.set);
  // the hearth goes on open ground near the middle
  let hx = I.cx, hz = I.cz, ok = false;
  for (let ring = 0; ring < 8 && !ok; ring++) for (let k = 0; k < 10 && !ok; k++) {
    const a = k / 10 * TAU + ring, r = ring * 1.4;
    const x = I.cx + Math.sin(a) * r, z = I.cz + Math.cos(a) * r;
    if (canPlace(S, 'fire', x, z)) { hx = x; hz = z; ok = true; }
  }
  if (!ok) clampWalk(S.world, I.cx, I.cz, _pt), hx = _pt.x, hz = _pt.z;
  const t = { id: S.setId++, name: m.name, isle: I.id, x: hx, z: hz, kind: m.sk, founder: m.by, k: m.k, day: dayOf(S), res: { food: 10, wood: 6, stone: 2 } };
  S.sets.push(t);
  const hb = placeBuilding(S, 'fire', hx, hz, true, t.id);
  hb.built = true; hb.progress = 1;
  for (const id of b.crew) {
    const c = getC(S, id);
    if (!c) continue;
    const wasLeader = c.title === 'leader' && m.fac && c.fac === m.fac;
    if (!wasLeader) { if (c.fac) { const f0 = getF(S, c.fac); if (f0 && f0.leader === c.id && f0.id !== m.fac) { f0.leader = 0; c.title = ''; } } }
    c.boat = 0; c.set = t.id; c.home = 0;
    if (c.mate) { const mt = getC(S, c.mate); if (mt && b.crew.indexOf(mt.id) < 0) { memo(S, c, 'Left ' + mt.name + ' behind, and that was the end of it.'); memo(S, mt, c.name + ' sailed away to ' + t.name + ' without them.'); mt.mate = 0; c.mate = 0; } }
    c.x = c.px = m.lx + (S.rng() - 0.5) * 1.5; c.z = c.pz = m.lz + (S.rng() - 0.5) * 1.5; c.isle = I.id;
    if (c.job) { const sh = getB(S, c.job); if (sh && sh.set !== t.id) { if (sh.owner === c.id) sh.owner = 0; c.job = 0; } }
    if (t.kind === 'company' && c.id !== m.by) c.boss = m.by; else if (c.boss && !(t.kind === 'company')) c.boss = 0;
    memo(S, c, 'Helped found ' + t.name + ' on ' + isleName(S, I.id) + '.');
    setState(c, 'cheer', 'Our own place. Ours.'); c.t = 2.5;
  }
  // a faith that leaves takes its faction with it
  if (t.kind === 'faith' && m.fac) {
    const f = getF(S, m.fac);
    if (f) { f.set = t.id; for (const c of S.citizens) if (c.fac === f.id && c.set !== t.id) c.fac = 0; }
  }
  // the boat stays: beached here until they build a dock
  b.set = t.id; b.st = 'docked'; b.m = null; b.crew = [];
  b.hx = b.x; b.hz = b.z; b.ix = m.lx; b.iz = m.lz;
  const founder = getC(S, m.by);
  logMsg(S, 'A NEW SETTLEMENT: ' + t.name + ' is founded on ' + isleName(S, I.id) + (founder ? ' by ' + founder.name : '') + ', a ' + SET_KINDS[t.kind].name + '. ' + setPop(S, t.id) + ' souls.', 'good');
  whisper(S, 'set1', 'They have split. The ones who left will change, and so will the ones who stayed. Distance is a kind of idea too.');
  ev(S, 'founded', { id: t.id, x: hx, z: hz, name: t.name, kind: t.kind });
  rebuildObstacles(S); assignHomes(S);
  S.rival[rivalKey(t.id, from.id)] = 2;
}

/* group up, pick a destination, and go */
function planExodus(S) {
  if (!S.tech.boats || S.settleCd > 0 || S.boats.some(b => b.m && b.m.kind === 'settle')) return;
  const free = S.world.isles.filter(I => I.id && S.found[I.id] && !S.sets.some(t => t.isle === I.id && !t.empty));
  if (!free.length) return;
  for (const t of S.sets.slice().sort(() => S.rng() - 0.5)) {
    const bt = freeBoat(S, t.id);
    if (!bt) continue;
    const pop = setPop(S, t.id);
    if (pop < (t.id !== 1 ? 12 : 14)) continue;
    const able = S.citizens.filter(c => c.set === t.id && adult(c) && !c.elder && c.state !== 'held' && !c.boat);
    const plans = [];
    // a faith that is outnumbered at home
    for (const f of S.factions) {
      if (f.set !== t.id) continue;
      const L = getC(S, f.leader), mem = able.filter(c => c.fac === f.id);
      if (!L || mem.length < 3 || L.boat || L.elder) continue;
      const share = mem.length / Math.max(1, pop), wronged = (f.lostT || 0) > S.t - 400;
      const s = (share < 0.45 ? 1 : 0) + (wronged ? 1.5 : 0) + S.rng() * 0.8;
      if (s > 1) plans.push({ s, sk: 'faith', by: L, k: f.k, fac: f.id, who: mem, name: f.name.split(' ')[0] + ' Haven' });
    }
    // a rich owner and the workers
    for (const c of able) {
      if (c.coin < 40) continue;
      const staff = able.filter(o => o.boss === c.id || (o.coin < 2 && relOf(o, c) > 0));
      if (staff.length < 2) continue;
      const s = 1 + c.coin / 60 + S.rng() * 0.5;
      plans.push({ s: s * 0.7, sk: 'company', by: c, k: c.dom, who: staff, name: c.name + ' & Company' });
      break;
    }
    // fighters
    const brave = able.filter(c => c.tr.brave > 0.6 && (c.b[DREAD] > 0.25 || c.happy < 0.55 || c.title === 'leader'));
    if (brave.length >= 3) {
      const by = brave.slice().sort((a, b) => b.tr.brave - a.tr.brave)[0];
      const s = 0.8 + brave.length * 0.1 + S.rng() * 0.6;
      plans.push({ s, sk: 'warband', by, k: by.dom, who: brave, name: 'the ' + by.name + ' Host' });
    }
    // the fed-up, or just too many people
    const unhappy = able.filter(c => c.happy < 0.4);
    if (unhappy.length >= 3 || pop >= popCap(S) - 1) {
      const who = unhappy.length >= 3 ? unhappy : able.filter(c => c.tr.brave > 0.5 && c.curio > 0.4);
      if (who.length >= 3) {
        const by = who[(S.rng() * who.length) | 0];
        const s = 0.7 + unhappy.length * 0.12 + (pop >= popCap(S) - 1 ? 0.6 : 0) + S.rng() * 0.5;
        plans.push({ s, sk: 'free', by, k: by.dom, who, name: 'Free ' + (by.name) + "'s Camp" });
      }
    }
    if (!plans.length) continue;
    const have = {}; for (const q of S.sets) if (!q.empty) have[q.kind] = 1;
    for (const q of plans) q.s += have[q.sk] ? 0 : 0.8;
    let tot = 0; for (const q of plans) tot += q.s;
    let pick = S.rng() * tot, plan = plans[0];
    for (const q of plans) { pick -= q.s; if (pick <= 0) { plan = q; break; } }
    if (launchExodus(S, t, plan, bt, free, pop)) return;
  }
}

/* a group sets out for good: the founder, up to five others, and their partners and small children */
function launchExodus(S, t, plan, bt, free, pop) {
    const most = Math.min(Math.max(3, Math.floor(pop * 0.45)), t.id === 1 ? pop - 9 : pop);
    if (most < 3) return false;
    const go = new Set([plan.by.id]);
    for (const c of plan.who) { if (go.size >= Math.min(6, most)) break; go.add(c.id); }
    for (const id of Array.from(go)) {
      const c = getC(S, id);
      if (c.mate && go.size < most) { const m = getC(S, c.mate); if (m && m.set === t.id && !m.boat && (relOf(m, c) > 0.2)) go.add(m.id); }
      for (const k of S.citizens) if (k.grow < 1 && k.par.indexOf(id) >= 0 && k.set === t.id && go.size < most + 2) go.add(k.id);
    }
    if (S.sets.some(q => q.name === plan.name)) plan.name = 'New ' + plan.name.replace(/^the /, '').replace(/^Free /, '');
    const isle = free.sort((a, b) => hyp(a.cx - t.x, a.cz - t.z) - hyp(b.cx - t.x, b.cz - t.z))[0];
    const tgtAng = Math.atan2(t.x - isle.cx, t.z - isle.cz);
    const p = shorePoints(S, isle.id, tgtAng);
    bt.st = 'boarding'; bt.t = 25; bt.crew = []; bt.coming = 0;
    bt.m = { kind: 'settle', sk: plan.sk, by: plan.by.id, k: plan.k, fac: plan.fac || 0, name: plan.name, isle: isle.id, tx: p.bx, tz: p.bz, lx: p.ix, lz: p.iz };
    for (const id of go) {
      const c = getC(S, id);
      if (c.state === 'talk' || c.state === 'fight' || c.state === 'date' || c.state === 'play') { const o = getC(S, c.partner); if (o && o.partner === c.id) finish(S, o); }
      joinBoat(S, c, bt, c === plan.by ? 'We are leaving. All of us who want something better.' : 'Going with ' + plan.by.name + '. I have made up my mind.');
    }
    S.settleCd = 300;
    logMsg(S, 'EXODUS: ' + plan.by.name + ' is leading ' + (go.size - 1) + ' others to the dock. They mean to sail for ' + isleName(S, isle.id) + ' and found ' + plan.name + '.', 'sys');
    ev(S, 'exodus', { x: bt.x, z: bt.z, name: plan.name, kind: plan.sk });
    // people left behind feel it
    for (const id of go) { const c = getC(S, id); for (const o of S.citizens) if (!go.has(o.id) && (o.rel[c.id] || 0) > 0.5) memo(S, o, 'Watched ' + c.name + ' leave for ' + isleName(S, isle.id) + '.'); }
  return true;
}

/* someone set down on a dock: a faith leader leads their faithful away, anyone else takes a boat out exploring */
function dockDrop(S, c, dock) {
  const t = hearthOf(S, c);
  const bt = freeBoat(S, t.id);
  if (!S.tech.boats) { c.thought = 'Water. Lots of water. If only there were some way across.'; return 'nothing'; }
  if (!bt) { c.thought = 'No boat here. Someone needs to build one.'; emote(c, EM.dots, 2); return 'nothing'; }
  const free = S.world.isles.filter(I => I.id && S.found[I.id] && !S.sets.some(q => q.isle === I.id && !q.empty));
  const f = c.title === 'leader' && c.fac ? getF(S, c.fac) : null;
  if (f && free.length && adult(c)) {
    const mem = S.citizens.filter(o => o.fac === f.id && o.set === t.id && adult(o) && !o.elder && !o.boat && o !== c);
    if (mem.length >= 2) {
      const plan = { s: 9, sk: 'faith', by: c, k: f.k, fac: f.id, who: mem, name: f.name.split(' ')[0] + ' Haven' };
      const pop = setPop(S, t.id);
      // a leader set down by the hand of god takes up to half the settlement, whatever its size
      if (launchExodus(S, t, plan, bt, free, Math.max(pop, 12))) { memo(S, c, 'Was set down on the dock by a great hand, and understood: leave.'); return 'exodus'; }
    }
  }
  if (!adult(c)) return 'nothing';
  bt.st = 'boarding'; bt.t = 6; bt.m = { kind: 'explore', by: c.id }; bt.coming = 0; bt.crew = [];
  S.voyCd = Math.max(S.voyCd, 60);
  joinBoat(S, c, bt, 'Set down on the dock. I think I am meant to go and look.');
  S.stats.voyages = (S.stats.voyages || 0) + 1;
  logMsg(S, c.name + ' takes ' + bt.name + ' out into the fog.', '');
  return 'explore';
}

/* ---------------------------------------------- raids and trade at sea */

function planContact(S) {
  if (!S.tech.boats || S.sets.length < 2) return;
  for (const t of S.sets) {
    if (t.empty) continue;
    t.raidCd = (t.raidCd === undefined ? 120 : t.raidCd) - 10;
    if (t.raidCd > 0) continue;
    const bt = freeBoat(S, t.id);
    if (!bt) continue;
    const others = S.sets.filter(o => o !== t && !o.empty && o.isle !== t.isle && setPop(S, o.id) > 0 && S.found[o.isle]);
    if (!others.length) continue;
    const able = S.citizens.filter(c => c.set === t.id && adult(c) && !c.elder && !c.boat && c.state !== 'held' && c.hunger < 0.5 && c.title !== 'leader' && !VOY_STATES[c.state]);
    // raid: war hosts always want to; others only against bitter rivals
    let tgt = null, kind = '';
    for (const o of others) {
      const rv = S.rival[rivalKey(t.id, o.id)] || 0;
      if ((t.kind === 'warband' || rv >= 6) && resOf(S, o.id).food >= 6) { tgt = o; kind = 'raid'; break; }
    }
    if (!tgt && (t.kind === 'company' || t.kind === 'home' || S.rng() < 0.4)) { tgt = others[(S.rng() * others.length) | 0]; kind = 'trade'; }
    if (!tgt) continue;
    const crew = (kind === 'raid' ? able.filter(c => c.tr.brave > 0.45).sort((a, b) => b.tr.brave - a.tr.brave) : able.filter(c => c.tr.social > 0.4)).slice(0, kind === 'raid' ? 4 : 2);
    if (crew.length < (kind === 'raid' ? 3 : 1)) continue;
    const p = shorePoints(S, tgt.isle, Math.atan2(t.x - tgt.x, t.z - tgt.z));
    bt.st = 'boarding'; bt.t = 14; bt.crew = []; bt.coming = 0;
    bt.m = { kind, target: tgt.id, tx: p.bx, tz: p.bz, lx: p.ix, lz: p.iz };
    for (const c of crew) joinBoat(S, c, bt, kind === 'raid' ? 'We sail for ' + tgt.name + '. They have food. We need it.' : 'Taking goods over to ' + tgt.name + '.');
    t.raidCd = kind === 'raid' ? 260 + S.rng() * 120 : 200 + S.rng() * 120;
    logMsg(S, kind === 'raid' ? 'RAID: ' + crew.length + ' fighters from ' + t.name + ' are taking ' + bt.name + ' to ' + tgt.name + '.' : 'Traders from ' + t.name + ' set sail for ' + tgt.name + '.', kind === 'raid' ? 'bad' : '');
    if (kind === 'raid') ev(S, 'raid', { x: tgt.x, z: tgt.z, from: t.name, to: tgt.name });
    return;
  }
}
function raidLoot(S, c, b, t) {
  if (b.m.done) return;
  const res = resOf(S, t.id);
  const food = Math.min(8, res.food), wood = Math.min(5, res.wood);
  res.food -= food; res.wood -= wood;
  b.loot = { food: (b.loot ? b.loot.food : 0) + food, wood: (b.loot ? b.loot.wood : 0) + wood };
  b.m.done = true;
  const from = setById(S, b.set);
  logMsg(S, 'Raiders from ' + from.name + ' have taken ' + Math.round(food) + ' food and ' + Math.round(wood) + ' wood from ' + t.name + '!', 'bad');
  S.rival[rivalKey(t.id, from.id)] = (S.rival[rivalKey(t.id, from.id)] || 0) + 4;
  // the locals fight back
  let n = 0;
  for (const o of S.citizens) {
    if (o.set !== t.id || !adult(o) || o.elder || !awake(o) || busyFighting(o) || hyp(o.x - c.x, o.z - c.z) > 10) continue;
    oneRel(o, c, -0.4);
    if (n < 2 && o.tr.brave > 0.3) {
      const raider = S.citizens.find(r => r.state === 'ashore' && r.tid === b.id && !busyFighting(r) && hyp(r.x - o.x, r.z - o.z) < 14);
      if (raider) { startFight(S, o, raider, 'Thieves! Get off our island!'); n++; }
    }
    memo(S, o, 'Was raided by ' + from.name + '.');
  }
}
function tradeGoods(S, c, b, t) {
  if (b.m.done) return;
  b.m.done = true;
  const mine = resOf(S, b.set), theirs = resOf(S, t.id);
  const best = r => ['food', 'wood', 'stone'].sort((a, z) => r[z] - r[a])[0];
  const give = best(mine), take = best(theirs);
  const n = Math.min(5, mine[give], theirs[take]);
  if (n >= 1 && give !== take) {
    mine[give] -= n; theirs[give] += n; theirs[take] -= n; mine[take] += n;
    logMsg(S, 'Traders from ' + setById(S, b.set).name + ' swapped ' + Math.round(n) + ' ' + give + ' for ' + take + ' with ' + t.name + '.', 'good');
  } else logMsg(S, 'Traders from ' + setById(S, b.set).name + ' visited ' + t.name + ' and mostly talked.', '');
  const key = rivalKey(t.id, b.set);
  S.rival[key] = Math.max(-6, (S.rival[key] || 0) - 2);
  for (const o of S.citizens) if (o.set === t.id && hyp(o.x - c.x, o.z - c.z) < 10) { addRel(o, c, 0.12); if (S.rng() < 0.3) transmit(S, c, o, 0.1); }
  c.coin += 2;
  memo(S, c, 'Traded with the people of ' + t.name + '.');
}

/* --------------------------------------------- colonies plan their own building */

function colonyPlanner(S, t) {
  let pend = 0; const has = {};
  for (const b of S.buildings) if (b.set === t.id) { has[b.type] = (has[b.type] || 0) + 1; if (!b.built) pend++; }
  if (pend) return;
  const pop = setPop(S, t.id);
  if (!pop) return;
  let want = '';
  if (S.tech.boats && !has.dock && pop >= 4) { placeDock(S, t); return; }
  if (pop >= 3 + 3 * (has.hut || 0) && (has.hut || 0) < BUILD.hut.max) want = 'hut';
  else if ((has.farm || 0) < Math.ceil(pop / 5) && pop >= 4) want = 'farm';
  else if (pop >= 6 && !has.shrine && (t.k === DEV || t.k === DREAD)) want = 'shrine';
  else if (pop >= 6 && !has.lab && t.k === ACCEL) want = 'lab';
  if (!want) return;
  const p = findSite(S, want, t.id);
  if (!p) return;
  placeBuilding(S, want, p.x, p.z, true, t.id);
}

/* ------------------------------------------------------------ once a second */

function voyageTick(S) {
  // everyone on land sees around them; boats see further
  for (const c of S.citizens) {
    if (!c.boat) { c.isle = isleNear(S.world, c.x, c.z); revealAt(S, c.x, c.z, 6); }
  }
  for (const b of S.boats) if (b.st === 'out' || b.st === 'back') revealAt(S, b.x, b.z, (S.rev || 0) >= 3 ? 16 : 12);
  S.voyCd -= 1; S.settleCd -= 1;
  // the invention of the boat
  if (!S.tech.boats && S.t > 240 && S.res.insight >= 20) {
    for (const c of S.citizens) {
      if (!adult(c) || c.curio < 0.45 || c.boat) continue;
      const I = S.world.isles[c.isle || 0], lx = c.x - I.cx, lz = c.z - I.cz;
      const byWater = hyp(lx, lz) > rimR(I, Math.atan2(lx, lz)) - 6 || c.state === 'fish' || (c.state === 'wander' && c.tk === 'explore');
      if (!byWater && S.t < 900) continue;
      if (S.rng() > (byWater ? 0.04 : 0.004)) continue;
      S.tech.boats = true;
      memo(S, c, 'Watched a log drift out to sea and understood: a boat.');
      c.thought = 'If wood floats, and I sit on the wood...'; emote(c, EM.bulb, 3);
      logMsg(S, c.name + ' watched driftwood float away and had an idea: a BOAT. Now someone has to build a dock.', 'good');
      ev(S, 'invent', { what: 'boats', x: c.x, z: c.z });
      break;
    }
  }
  // anyone stuck on an island that is not their settlement's joins whoever lives there, or makes camp
  for (const c of S.citizens) {
    if (c.boat || VOY_STATES[c.state] || c.state === 'held' || S.boats.some(b => b.st === 'wait' && b.m && (b.m.party || []).indexOf(c.id) >= 0)) { c.strandT = 0; continue; }
    const h = hearthOf(S, c);
    if (h.isle === c.isle && !h.empty) { c.strandT = 0; continue; }
    c.strandT = (c.strandT || 0) + 1;
    if (c.strandT < 20) continue;
    c.strandT = 0;
    let st = setAt(S, c.x, c.z);
    if (!st && !adult(c)) { const p = c.par.map(id => getC(S, id)).find(p => p && p.isle === c.isle); if (p) st = p.set; }
    if (!st) {
      const t = { id: S.setId++, name: c.name + "'s Camp", isle: c.isle, x: c.x, z: c.z, kind: 'free', founder: c.id, k: c.dom, day: dayOf(S), res: { food: 4, wood: 0, stone: 0 } };
      const I = S.world.isles[c.isle];
      clampWalk(S.world, c.x + 1.8, c.z, _pt);
      for (let ring = 0, ok = false; ring < 8 && !ok; ring++) for (let k = 0; k < 10 && !ok; k++) {
        const a = k / 10 * TAU + ring, r = ring * 1.4, x = I.cx + Math.sin(a) * r, z = I.cz + Math.cos(a) * r;
        if (canPlace(S, 'fire', x, z)) { _pt.x = x; _pt.z = z; ok = true; }
      }
      S.sets.push(t);
      const hb = placeBuilding(S, 'fire', _pt.x, _pt.z, true, t.id); hb.built = true; hb.progress = 1; t.x = hb.x; t.z = hb.z;
      logMsg(S, c.name + ' is stranded on ' + isleName(S, c.isle) + ', and lights a fire. ' + t.name + ' begins.', '');
      st = t.id;
    } else logMsg(S, c.name + ' has stayed on in ' + setById(S, st).name + '.', '');
    memo(S, c, 'Ended up on ' + isleName(S, c.isle) + ', far from home, and made a life there.');
    leaveSettlement(S, c, st);
    rebuildObstacles(S);
  }
  // settlements that are empty are abandoned
  for (const t of S.sets) {
    if (t.id === 1) continue;
    const pop = setPop(S, t.id);
    if (!pop && !t.empty) { t.empty = true; logMsg(S, t.name + ' stands empty now. The hearth burns for nobody.', 'bad'); }
    else if (pop && t.empty) t.empty = false;
  }
  if ((S.t | 0) % 6 === 3) {
    for (const t of S.sets) if (t.id !== 1 && !t.empty) colonyPlanner(S, t);
    const home = S.sets[0];
    if (S.tech.boats && !S.buildings.some(b => b.type === 'dock' && b.set === 1) && setPop(S, 1) >= 6) placeDock(S, home);
  }
  if ((S.t | 0) % 10 === 5) { planExodus(S); planContact(S); }
  // rivalries cool
  for (const k in S.rival) { if (S.rival[k] > 0) S.rival[k] = Math.max(0, S.rival[k] - 0.01); }
}
