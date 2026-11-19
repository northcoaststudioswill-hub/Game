'use strict';
/* GODMODE.EXE: the simulation. Fixed-timestep, no rendering, no DOM.
   Everything the screen shows is read from the state object S, and everything
   that should flash, sound or be logged goes out through S.events. */

/* ------------------------------------------------------------------ setup */

function newSim(seed) {
  const S = {
    v: 1, seed, world: makeWorld(seed), t: 0, day: 0.08,
    res: { food: 12, wood: 4, stone: 0, insight: 0 },
    cycles: 70, cyclesMax: 100,
    citizens: [], buildings: [], graves: [], nextId: 1,
    events: [], log: [],
    stage: 0, flags: {}, age: -1, counts: [0, 0, 0, 0],
    stats: { bless: 0, smite: 0, create: 0, inspire: 0, intervene: 0, observe: 0, births: 0, deaths: 0, kills: 0 },
    sandbox: false, freeCycles: false, ending: -2,
    spireUnlocked: false, spireUnlockT: 0,
    birthCd: 42, secAcc: 0, planT: 4, selected: 0, held: 0, emptyT: 0, used: {}
  };
  S.rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  S.buildings.push({ id: S.nextId++, type: 'fire', x: 0, z: 0, progress: 1, built: true, rot: 0 });
  const lean = [DEV, DEV, DREAD, ACCEL, KIN, -1];
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU + 0.4;
    const c = addCitizen(S, Math.sin(a) * 2.8, Math.cos(a) * 2.8);
    if (lean[i] >= 0) c.b[lean[i]] = 0.3;
  }
  rebuildObstacles(S);
  logMsg(S, 'ISLAND.SIM loaded. Six minds running. They think the sky is weather.', 'sys');
  return S;
}

function addCitizen(S, x, z) {
  const r = S.rng;
  let name = NAMES[(r() * NAMES.length) | 0];
  for (let i = 0; i < 60 && S.used[name]; i++) name = NAMES[(r() * NAMES.length) | 0];
  S.used[name] = 1;
  const c = {
    id: S.nextId++, name, x, z, px: x, pz: z, face: r() * TAU,
    hunger: 0.15 + r() * 0.25, happy: 0.6, fear: 0, curio: 0.3 + r() * 0.4, health: 1,
    tr: { speed: 0.9 + r() * 0.3, social: r(), brave: r(), curious: r() },
    b: [0, 0, 0, 0], dom: -1, rel: {},
    state: 'idle', ph: 0, t: 0.5 + r() * 2.5, tx: x, tz: z, tk: '', tid: 0, partner: 0, lead: false,
    carry: null, home: 0, thought: 'Just arrived. Looking around.',
    emote: -1, emoteT: 0, inspired: null, cmdT: 0, talkCd: 4 + r() * 10, obsT: 0, age: 0,
    hue: r(), skin: (r() * 4) | 0, moving: false, prayCd: 0, stuckT: 0, lastD: 0, fx: 0, fz: 0, pulseT: 0, stall: 0
  };
  S.citizens.push(c);
  return c;
}

/* ------------------------------------------------------------- utilities */

function isNight(S) { return S.day >= NIGHT_FROM; }
function popCap(S) {
  let n = 6;
  for (const b of S.buildings) if (b.type === 'hut' && b.built) n += 3;
  return Math.min(POP_MAX, n);
}
function getC(S, id) { for (const c of S.citizens) if (c.id === id) return c; return null; }
function getB(S, id) { for (const b of S.buildings) if (b.id === id) return b; return null; }
function countB(S, type, builtOnly) {
  let n = 0;
  for (const b of S.buildings) if (b.type === type && (!builtOnly || b.built)) n++;
  return n;
}
function firstB(S, type) { for (const b of S.buildings) if (b.type === type) return b; return null; }
function ev(S, type, data) {
  if (S.events.length > 300) return;
  const e = data || {}; e.type = type; S.events.push(e);
}
function logMsg(S, text, cls) {
  S.log.push({ t: S.t, text, cls: cls || '' });
  if (S.log.length > 90) S.log.shift();
  ev(S, 'log', { text, cls: cls || '' });
}
function whisper(S, key, text) {
  if (S.flags[key]) return;
  S.flags[key] = 1;
  logMsg(S, text, 'sys');
}
function emote(c, icon, secs) { c.emote = icon; c.emoteT = secs || 2.2; }
function relOf(a, b) { return a.rel[b.id] || 0; }
function addRel(a, b, d) {
  a.rel[b.id] = clamp((a.rel[b.id] || 0) + d, -1, 1);
  b.rel[a.id] = clamp((b.rel[a.id] || 0) + d, -1, 1);
}
function refreshDom(S, c) {
  let k = 0;
  for (let i = 1; i < 4; i++) if (c.b[i] > c.b[k]) k = i;
  const dom = c.b[k] >= 0.4 ? k : -1;
  if (dom !== c.dom) {
    const was = c.dom;
    c.dom = dom;
    if (dom >= 0) {
      emote(c, BELIEF_EMOTE[dom], 3);
      ev(S, 'convert', { id: c.id, k: dom, x: c.x, z: c.z });
      logMsg(S, c.name + (was >= 0 ? ' abandons ' + BELIEFS[was].name + ' for ' : ' now holds to ') + BELIEFS[dom].name + '.', 'b' + dom);
      if (!c.inspired) whisper(S, 'meme1', 'MEMETICS: an idea has just copied itself into a mind. Ideas use them to reproduce.');
    }
  }
}
function addBelief(S, c, k, d) {
  if (d <= 0) return;
  if (c.inspired && c.inspired.k !== k) return;      // a prophet cannot be talked out of it
  c.b[k] = clamp(c.b[k] + d, 0, 1);
  for (let j = 0; j < 4; j++) if (j !== k) c.b[j] *= (1 - Math.min(0.9, d * 0.7));
  refreshDom(S, c);
}
function workSpeed(S, c) {
  let w = 1 + 0.4 * c.b[DREAD] - 0.1 * c.b[DEV];
  if (c.happy < 0.25) w *= 0.7;
  if (S.age === DREAD) w *= 1.25;
  return w;
}
function rebuildObstacles(S) {
  const W = S.world, o = [W.mountain, W.pond];
  for (const b of S.buildings) if (b.type !== 'farm') o.push({ x: b.x, z: b.z, r: BUILD[b.type].r * 0.8, id: b.id });
  S.obst = o;
}
function pendingCost(S, res) {
  let n = 0;
  for (const b of S.buildings) if (!b.built) n += (BUILD[b.type].cost[res] || 0) * (1 - b.progress);
  return n;
}

/* ------------------------------------------------------------- movement */

const _pt = { x: 0, z: 0 };
function moveToward(S, c, tx, tz, speed, dt, stop) {
  const dx = tx - c.x, dz = tz - c.z, d = hyp(dx, dz);
  if (d <= (stop || 0.15)) return true;
  const step = Math.min(d, speed * dt);
  let nx = c.x + dx / d * step, nz = c.z + dz / d * step;
  for (const o of S.obst) {
    const ox = nx - o.x, oz = nz - o.z, rr = o.r + 0.35, q = ox * ox + oz * oz;
    if (q < rr * rr) {
      const qd = Math.sqrt(q) || 0.001;
      // slide: push out, and nudge along the tangent that leads toward the target
      const txo = tx - o.x, tzo = tz - o.z;
      const side = (ox * tzo - oz * txo) >= 0 ? 1 : -1;
      nx = o.x + ox / qd * rr + (-oz / qd) * side * step * 0.7;
      nz = o.z + oz / qd * rr + (ox / qd) * side * step * 0.7;
    }
  }
  const r = hyp(nx, nz), lim = rimR(S.world, Math.atan2(nx, nz)) - 1.5;
  if (r > lim) { nx *= lim / r; nz *= lim / r; }
  const mvx = nx - c.x, mvz = nz - c.z;
  if (mvx * mvx + mvz * mvz > 1e-8) c.face += angDiff(c.face, Math.atan2(mvx, mvz)) * Math.min(1, dt * 12);
  c.x = nx; c.z = nz; c.moving = true;
  // give up on unreachable targets
  c.stuckT += dt;
  if (c.stuckT > 4) {
    if (d > c.lastD - 0.4) { c.stuckT = 0; c.lastD = 1e9; return 'stuck'; }
    c.stuckT = 0; c.lastD = d;
  }
  return false;
}
function faceTo(c, x, z, dt) { c.face += angDiff(c.face, Math.atan2(x - c.x, z - c.z)) * Math.min(1, dt * 10); }
function spotNear(c, tx, tz, r) {
  const a = Math.atan2(c.x - tx, c.z - tz) + ((c.id % 5) - 2) * 0.3;
  c.tx = tx + Math.sin(a) * r; c.tz = tz + Math.cos(a) * r;
  c.stuckT = 0; c.lastD = 1e9;
}
function setState(c, state, thought) {
  c.state = state; c.ph = 0; c.t = 0; c.partner = 0; c.lead = false; c.stall = 0;
  c.stuckT = 0; c.lastD = 1e9;
  if (thought) c.thought = thought;
}
function finish(S, c) {
  setState(c, 'idle');
  c.t = 0.25 + S.rng() * 0.7;
}

/* ------------------------------------------------------- decision making */

function nearestNode(S, c, type) {
  let best = null, bd = 1e9;
  const nodes = S.world.nodes;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.dead || n.type !== type || n.amount <= 0) continue;
    let claimed = 0;
    for (const o of S.citizens) if (o !== c && o.state === 'gather' && o.tk === 'node' && o.tid === i && o.ph < 2) claimed++;
    if (claimed >= 2) continue;
    const d = hyp(n.x - c.x, n.z - c.z) + claimed * 4 + S.rng() * 2;
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}
function countDoing(S, state, tk) {
  let n = 0;
  for (const c of S.citizens) if (c.state === state && (tk === undefined || c.tk === tk)) n++;
  return n;
}
function hasRes(S, b) {
  const cost = BUILD[b.type].cost;
  for (const k in cost) if (S.res[k] < 0.6) return k;
  return '';
}
function buildersAt(S, id) {
  let n = 0;
  for (const c of S.citizens) if (c.state === 'build' && c.tid === id) n++;
  return n;
}

function startGather(S, c, res, why) {
  if (res === 'food') {
    let farm = null, fd = 1e9;
    for (const b of S.buildings) if (b.type === 'farm' && b.built && b.food > 0) {
      const d = hyp(b.x - c.x, b.z - c.z);
      if (d < fd) { fd = d; farm = b; }
    }
    if (farm) {
      setState(c, 'gather', why || 'The farm is ripe. Harvesting.');
      c.tk = 'farm'; c.tid = farm.id; c.gres = 'food'; spotNear(c, farm.x, farm.z, 1.2);
      return true;
    }
  }
  const type = res === 'food' ? 'bush' : res === 'wood' ? 'tree' : 'rock';
  const i = nearestNode(S, c, type);
  if (i === null) return false;
  const n = S.world.nodes[i];
  setState(c, 'gather', why);
  c.tk = 'node'; c.tid = i; c.gres = res; spotNear(c, n.x, n.z, 0.9);
  return true;
}
function startDeposit(S, c) {
  setState(c, 'gather', 'Carrying ' + c.carry.type + ' back to the hearth.');
  c.ph = 2; c.tk = 'node'; c.tid = -1; c.gres = c.carry.type; spotNear(c, 0, 0, BUILD.fire.r + 0.5);
}
function startBuild(S, c, b, why) {
  setState(c, 'build', why || ('Building the ' + BUILD[b.type].name.replace('The ', '') + '.'));
  c.tid = b.id; spotNear(c, b.x, b.z, BUILD[b.type].r + 0.45);
}
function startWork(S, c, state, b, thought) {
  setState(c, state, thought);
  c.tid = b.id; spotNear(c, b.x, b.z, BUILD[b.type].r + 0.5);
}
function startTalk(S, a, b) {
  setState(a, 'talk', 'Going to talk with ' + b.name + '.');
  setState(b, 'talk', a.name + ' wants to talk.');
  a.partner = b.id; b.partner = a.id; a.lead = true;
}
function startFlee(S, c, x, z) {
  if (c.state === 'talk') { const p = getC(S, c.partner); if (p && p.partner === c.id) finish(S, p); }
  setState(c, 'flee', 'RUN!');
  c.fx = x; c.fz = z; c.t = 2.5 + S.rng() * 2;
  emote(c, EM.bang, 2);
}
function findPartner(S, c) {
  let best = null, bs = -1e9;
  for (const o of S.citizens) {
    if (o === c || (o.state !== 'idle' && o.state !== 'wander') || o.cmdT > 0) continue;
    const d = hyp(o.x - c.x, o.z - c.z);
    if (d > 11) continue;
    const s = relOf(c, o) * 1.2 - d * 0.08 + S.rng() * 0.6;
    if (s > bs) { bs = s; best = o; }
  }
  return best;
}

function think(S, c) {
  const B = c.b, pop = S.citizens.length, night = isNight(S), r = S.rng;
  if (c.carry) { startDeposit(S, c); return; }

  let bestU = -1, bestFn = null;
  const consider = (u, fn) => { u *= 0.85 + r() * 0.3; if (u > bestU) { bestU = u; bestFn = fn; } };

  // --- eat
  const hungry = 0.55 + 0.36 * B[ACCEL];
  if (c.hunger > hungry) {
    if (S.res.food >= 1) {
      consider(2.2 + c.hunger * 3, () => {
        setState(c, 'eat', c.hunger > 0.85 ? 'Starving! Running to the hearth.' : 'Hungry. Going to the hearth to eat.');
        c.tk = 'fire'; spotNear(c, 0, 0, BUILD.fire.r + 0.5);
      });
    } else {
      const i = nearestNode(S, c, 'bush');
      if (i !== null) consider(2.2 + c.hunger * 3, () => {
        const n = S.world.nodes[i];
        setState(c, 'eat', 'The stockpile is empty. Foraging for berries.');
        c.tk = 'bush'; c.tid = i; spotNear(c, n.x, n.z, 0.8);
      });
    }
  }

  // --- an implanted idea wants out
  if (c.inspired && c.hunger < 0.86) {
    consider(4.5, () => { setState(c, 'preach', 'I have to tell everyone about ' + BELIEFS[c.inspired.k].name + '!'); });
  }

  // --- sleep
  if (night && c.fear < 0.5) {
    const up = (B[DREAD] > 0.55 ? 1.0 : 0) + (B[ACCEL] > 0.55 ? 0.8 : 0);
    consider(1.9 - up, () => {
      const h = getB(S, c.home);
      setState(c, 'sleep', h ? 'It is dark. Heading home to sleep.' : 'No bed for me. Sleeping by the fire.');
      if (h) spotNear(c, h.x, h.z, BUILD.hut.r + 0.45); else spotNear(c, 0, 0, BUILD.fire.r + 0.9);
    });
  }

  // --- sulking
  if (c.happy < 0.2) {
    consider(1.1, () => { setState(c, 'idle', 'What is the point of any of this?'); c.t = 4 + r() * 3; emote(c, EM.dots, 3); });
  }

  // --- build
  let site = null, su = -1;
  for (const b of S.buildings) {
    if (b.built) continue;
    if (hasRes(S, b)) continue;
    const nb = buildersAt(S, b.id), maxB = b.type === 'spire' ? 5 : 2;
    if (nb >= maxB) continue;
    let u = 1.25 + 0.5 * B[DREAD] - nb * 0.2 - hyp(b.x - c.x, b.z - c.z) * 0.01;
    if (b.type === 'spire') u += 0.5 * B[ACCEL] + 0.35 * B[DREAD] - 0.45 * B[KIN] + 0.1;
    if (u > su) { su = u; site = b; }
  }
  if (site) consider(su, () => startBuild(S, c, site,
    site.type === 'spire' ? 'The Spire must rise. I do not know why I know that.' : null));

  // --- gather
  const foodT = pop * 2.5 + 4, woodT = 9 + pendingCost(S, 'wood') + (S.spireUnlocked && !firstB(S, 'spire') ? 20 : 0);
  const stoneT = 7 + pendingCost(S, 'stone') + (S.spireUnlocked && !firstB(S, 'spire') ? 20 : 0);
  const need = (have, target) => clamp(1 - have / target, 0, 1);
  let nf = 0, nw = 0, ns = 0;
  for (const o of S.citizens) if (o.state === 'gather' && o !== c) { if (o.gres === 'food') nf++; else if (o.gres === 'wood') nw++; else ns++; }
  const fNeed = need(S.res.food, foodT), wNeed = need(S.res.wood, woodT), sNeed = need(S.res.stone, stoneT);
  consider(0.35 + 1.7 * fNeed + 0.3 * B[KIN] - nf * 0.22, () => {
    if (!startGather(S, c, 'food', fNeed > 0.5 ? 'Food is running low. Picking berries.' : 'Gathering food for the stockpile.')) setIdle(S, c);
  });
  consider(0.3 + 1.25 * wNeed - nw * 0.22, () => {
    if (!startGather(S, c, 'wood', wNeed > 0.3 ? 'We need wood. Off to chop a tree.' : 'Topping up the woodpile.')) setIdle(S, c);
  });
  consider(0.3 + 1.25 * sNeed - ns * 0.22, () => {
    if (!startGather(S, c, 'stone', sNeed > 0.3 ? 'We need stone. Heading to the rocks.' : 'Fetching some spare stone.')) setIdle(S, c);
  });

  // --- tend a farm that is still growing
  for (const b of S.buildings) {
    if (b.type !== 'farm' || !b.built || b.food > 0) continue;
    let tended = false;
    for (const o of S.citizens) if (o.state === 'farm' && o.tid === b.id) tended = true;
    if (tended) continue;
    consider(0.45 + 0.9 * fNeed + 0.2 * B[KIN], () => startWork(S, c, 'farm', b, 'Tending the crops so they grow faster.'));
    break;
  }

  // --- worship
  if (B[DEV] + B[DREAD] > 0.25 && !(c.prayCd > 0) && countB(S, 'shrine', true) > 0 && countDoing(S, 'worship') < 4 * countB(S, 'shrine', true)) {
    const sh = nearestBuilt(S, c, 'shrine');
    const u = 0.2 + 1.3 * B[DEV] + 0.9 * B[DREAD] * (0.4 + c.fear) - 1.2 * B[KIN];
    consider(u, () => startWork(S, c, 'worship', sh, B[DREAD] > B[DEV]
      ? 'If I pray hard enough, perhaps it will spare me.' : 'Going to the shrine to thank the Watcher.'));
  }

  // --- study
  if (countB(S, 'lab', true) > 0 && countDoing(S, 'study') < 2 + countB(S, 'lab', true)) {
    const lab = nearestBuilt(S, c, 'lab');
    const sp = firstB(S, 'spire');
    const push = (sp && !sp.built && S.res.insight < 20) ? 0.7 : 0;
    consider(0.15 + 0.8 * c.curio + 1.1 * B[ACCEL] + push, () => startWork(S, c, 'study', lab,
      B[ACCEL] > 0.5 ? 'The Terminal is waiting. There is so much to compute.' : 'Curious. Going to study at the Terminal.'));
  }

  // --- socialise
  if (c.talkCd <= 0 && !night) {
    const p = findPartner(S, c);
    if (p) consider(0.3 + 0.55 * c.tr.social + 0.6 * B[KIN] + (c.happy < 0.4 ? 0.25 : 0) + 0.2 * c.curio, () => startTalk(S, c, p));
  }

  // --- explore / idle
  consider(0.28 + 0.55 * c.curio, () => {
    const far = c.curio > 0.6;
    const a = r() * TAU, d = far ? 6 + r() * 9 : 1.5 + r() * 4;
    clampWalk(S.world, (far ? 0 : c.x) + Math.sin(a) * d, (far ? 0 : c.z) + Math.cos(a) * d, _pt);
    setState(c, 'wander', far ? 'What is over there? Going to look.' : 'Stretching my legs.');
    c.tx = _pt.x; c.tz = _pt.z; c.tk = far ? 'explore' : '';
  });
  consider(0.22, () => setIdle(S, c));

  bestFn();
}
function setIdle(S, c) {
  setState(c, 'idle', 'Nothing urgent. Resting a moment.');
  c.t = 1.5 + S.rng() * 2.5;
}
function nearestBuilt(S, c, type) {
  let best = null, bd = 1e9;
  for (const b of S.buildings) if (b.type === type && b.built) {
    const d = hyp(b.x - c.x, b.z - c.z);
    if (d < bd) { bd = d; best = b; }
  }
  return best;
}

/* ------------------------------------------------------ citizen stepping */

function updateCitizen(S, c, dt) {
  c.px = c.x; c.pz = c.z; c.moving = false; c.age += dt;
  const B = c.b;

  // needs
  let hr = 0.0085;
  if (S.age === ACCEL) hr *= 1.2;
  if (c.state === 'sleep' && c.ph === 1) hr *= 0.4;
  c.hunger = Math.min(1, c.hunger + hr * dt);
  if (c.hunger >= 1) {
    c.health -= dt * 0.02; B[DEV] = Math.max(0, B[DEV] - dt * 0.01);
    if (c.health <= 0) { kill(S, c, 'starve'); return; }
  } else if (c.health < 1) c.health = Math.min(1, c.health + dt * 0.012);
  const fb = 0.22 * B[DREAD];
  if (c.fear > fb) c.fear = Math.max(fb, c.fear - dt * 0.05); else c.fear = Math.min(fb, c.fear + dt * 0.02);
  c.curio = Math.min(1, c.curio + dt * 0.006 * (0.5 + c.tr.curious) * (1 + 0.6 * B[ACCEL]));
  let ht = 0.56 + 0.22 * B[KIN] + 0.1 * B[DEV] - 0.25 * B[DREAD] - 0.3 * c.fear;
  if (c.hunger > 0.7) ht -= (c.hunger - 0.7);
  if (!c.home && S.t > 150) ht -= 0.08;
  if (S.age === KIN) ht += 0.12; else if (S.age === DREAD) ht -= 0.12; else if (S.age === DEV) ht += 0.05;
  c.happy += (clamp(ht, 0.05, 0.95) - c.happy) * Math.min(1, dt * 0.03);
  for (let k = 0; k < 4; k++) if (B[k] > 0) B[k] = Math.max(0, B[k] - dt * 0.0006);
  if (c.emoteT > 0) c.emoteT -= dt;
  c.talkCd -= dt; c.prayCd -= dt;
  if (c.cmdT > 0) c.cmdT -= dt;
  if (c.inspired) {
    c.inspired.t -= dt;
    if (c.inspired.t <= 0) { c.inspired = null; if (c.state === 'preach') finish(S, c); }
  }
  if (S.selected === c.id) {
    c.obsT += dt;
    if (c.obsT >= 12) {
      c.obsT = 0; emote(c, EM.eye, 2.5);
      c.curio = Math.min(1, c.curio + 0.12);
      addBelief(S, c, c.fear > 0.3 ? DREAD : DEV, 0.02);
      whisper(S, 'felt', c.name + ' keeps glancing at the sky. Being watched changes what is watched.');
    }
  }
  if (c.state === 'held') return;
  if (c.fear > 0.75 && c.state !== 'flee') startFlee(S, c, c.fx, c.fz);

  const sp = 2.25 * c.tr.speed * (c.carry ? 0.88 : 1) * (c.hunger > 0.9 ? 0.8 : 1);
  const ws = workSpeed(S, c);
  let m;
  switch (c.state) {
    case 'idle':
      c.t -= dt;
      if (c.t <= 0) think(S, c);
      break;

    case 'wander':
      m = moveToward(S, c, c.tx, c.tz, sp * 0.8, dt, 0.3);
      if (m) {
        c.curio = Math.max(0, c.curio - (c.tk === 'explore' ? 0.3 : 0.08));
        if (c.tk === 'explore' && m === true && S.rng() < 0.4) {
          S.res.insight += 0.8; emote(c, EM.what, 2);
          c.thought = 'Huh. The edge of the island just stops. Interesting.';
        }
        setState(c, 'idle'); c.t = 0.8 + S.rng() * 2;
      }
      break;

    case 'gather': {
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.25);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = (c.gres === 'stone' ? 3.4 : c.gres === 'wood' ? 3.0 : 2.2) / ws; }
      } else if (c.ph === 1) {
        let tx = 0, tz = 0, src = null;
        if (c.tk === 'farm') { src = getB(S, c.tid); if (src && src.food <= 0) src = null; }
        else { src = S.world.nodes[c.tid]; if (src && (src.dead || src.amount <= 0)) src = null; }
        if (!src) { finish(S, c); break; }
        tx = src.x; tz = src.z; faceTo(c, tx, tz, dt);
        c.t -= dt;
        if (c.t <= 0) {
          let n;
          if (c.tk === 'farm') { n = Math.min(3, src.food); src.food -= n; if (src.food <= 0) src.growth = 0; }
          else {
            n = Math.min(2, src.amount); src.amount -= n;
            if (src.amount <= 0) src.regrow = src.type === 'tree' ? 80 : src.type === 'rock' ? 140 : 38;
          }
          c.carry = { type: c.gres, n };
          ev(S, 'chop', { x: tx, z: tz, res: c.gres });
          startDeposit(S, c);
        }
      } else {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m) {
          if (c.carry) { S.res[c.carry.type] += c.carry.n; ev(S, 'deposit', { x: c.x, z: c.z, res: c.carry.type }); }
          c.carry = null;
          finish(S, c);
        }
      }
      break;
    }

    case 'eat': {
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * (c.hunger > 0.85 ? 1.2 : 1), dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) {
          if (c.tk === 'fire') {
            if (S.res.food < 1) { finish(S, c); break; }
            S.res.food -= 1;
          } else {
            const n = S.world.nodes[c.tid];
            if (!n || n.dead || n.amount <= 0) { finish(S, c); break; }
            n.amount -= 1; if (n.amount <= 0) n.regrow = 38;
          }
          c.ph = 1; c.t = 2; emote(c, EM.food, 2);
        }
      } else {
        c.t -= dt;
        if (c.t <= 0) {
          c.hunger = Math.max(0, c.hunger - 0.6); c.happy = Math.min(1, c.happy + 0.05);
          c.thought = 'That is better.';
          finish(S, c);
        }
      }
      break;
    }

    case 'build': {
      const b = getB(S, c.tid);
      if (!b || b.built) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = 14 + S.rng() * 8; }
      } else {
        faceTo(c, b.x, b.z, dt);
        const def = BUILD[b.type], dp = dt * ws / def.work;
        let lack = '';
        for (const k in def.cost) if (S.res[k] < def.cost[k] * dp) lack = k;
        if (lack) {
          c.stall += dt; b.stall = lack;
          c.thought = 'Waiting. The ' + def.name.replace('The ', '') + ' needs more ' + lack + '.';
          if (c.stall > 2.5) finish(S, c);
        } else {
          c.stall = 0; b.stall = '';
          for (const k in def.cost) S.res[k] -= def.cost[k] * dp;
          b.progress += dp;
          if (b.type === 'spire') spireMilestones(S, b);
          if (b.progress >= 1) completeBuilding(S, b);
          c.t -= dt;
          if (c.t <= 0) finish(S, c);
        }
      }
      break;
    }

    case 'farm': {
      const b = getB(S, c.tid);
      if (!b || b.food > 0) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = 7; }
      } else {
        faceTo(c, b.x, b.z, dt);
        b.growth += dt * 0.06 * ws;
        c.t -= dt;
        if (c.t <= 0) finish(S, c);
      }
      break;
    }

    case 'worship': {
      const b = getB(S, c.tid);
      if (!b) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = 8; emote(c, B[DREAD] > B[DEV] ? EM.bolt : EM.halo, 2.5); }
      } else {
        faceTo(c, b.x, b.z, dt);
        const g = dt * (0.55 * B[DEV] + 0.4 * B[DREAD]) * (S.age === DEV ? 1.5 : 1);
        S.cycles = Math.min(S.cyclesMax, S.cycles + g);
        if (B[DREAD] > B[DEV]) { B[DREAD] = Math.min(1, B[DREAD] + dt * 0.003); }
        else { B[DEV] = Math.min(1, B[DEV] + dt * 0.006); c.happy = Math.min(1, c.happy + dt * 0.01); c.fear = Math.max(0, c.fear - dt * 0.03); }
        c.t -= dt;
        if (c.t <= 0) { c.prayCd = 18 + S.rng() * 16; refreshDom(S, c); finish(S, c); }
      }
      break;
    }

    case 'study': {
      const b = getB(S, c.tid);
      if (!b) { finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m === 'stuck') { finish(S, c); break; }
        if (m) { c.ph = 1; c.t = 9; }
      } else {
        faceTo(c, b.x, b.z, dt);
        S.res.insight += dt * 0.1 * (0.5 + c.curio) * (1 + 0.8 * B[ACCEL]) * (S.age === ACCEL ? 1.5 : 1);
        c.curio = Math.max(0, c.curio - dt * 0.045);
        B[ACCEL] = Math.min(1, B[ACCEL] + dt * 0.007);
        c.t -= dt;
        if (c.t <= 0) {
          if (S.rng() < 0.5) emote(c, EM.bulb, 2);
          refreshDom(S, c); finish(S, c);
        }
      }
      break;
    }

    case 'talk': {
      const p = getC(S, c.partner);
      if (!p || p.state !== 'talk' || p.partner !== c.id) { finish(S, c); break; }
      if (c.ph === 0) {
        const d = hyp(p.x - c.x, p.z - c.z);
        if (d > 1.35) {
          m = moveToward(S, c, p.x, p.z, sp, dt, 1.2);
          if (m === 'stuck') { finish(S, p); finish(S, c); break; }
        } else if (c.lead) {
          c.ph = 1; p.ph = 1; c.t = 4.2; p.t = 99;
          const k = c.dom >= 0 ? c.dom : -1;
          emote(c, k >= 0 ? BELIEF_EMOTE[k] : EM.dots, 2);
          c.thought = 'Talking with ' + p.name + '.'; p.thought = 'Listening to ' + c.name + '.';
        }
      } else {
        faceTo(c, p.x, p.z, dt);
        if (c.lead) {
          c.t -= dt;
          if (c.t < 2.1 && p.emoteT <= 0 && p.t === 99) { p.t = 98; emote(p, p.dom >= 0 ? BELIEF_EMOTE[p.dom] : EM.note, 2); }
          if (c.t <= 0) { converse(S, c, p); finish(S, p); finish(S, c); }
        }
      }
      break;
    }

    case 'preach': {
      if (!c.inspired) { finish(S, c); break; }
      if (c.hunger > 0.9) { finish(S, c); break; }
      const k = c.inspired.k;
      if (c.ph === 0) {
        let best = null, bd = 1e9;
        for (const o of S.citizens) {
          if (o === c || o.state === 'held') continue;
          const d = hyp(o.x - c.x, o.z - c.z) + o.b[k] * 14;
          if (d < bd) { bd = d; best = o; }
        }
        if (!best) { c.ph = 1; c.t = 5; break; }
        c.partner = best.id; c.ph = 2;
      } else if (c.ph === 2) {
        const o = getC(S, c.partner);
        if (!o) { c.ph = 0; break; }
        m = moveToward(S, c, o.x, o.z, sp * 1.15, dt, 2.2);
        if (m) { c.ph = 1; c.t = 6; c.pulseT = 0.4; }
      } else {
        c.t -= dt; c.pulseT -= dt;
        if (c.pulseT <= 0) {
          c.pulseT = 2.2;
          ev(S, 'pulse', { x: c.x, z: c.z, k });
          emote(c, BELIEF_EMOTE[k], 1.8);
          for (const o of S.citizens) {
            if (o === c) continue;
            const d = hyp(o.x - c.x, o.z - c.z);
            if (d > 4.6) continue;
            let pw = 0.075 * (0.7 + 0.6 * o.curio);
            if (o.dom >= 0 && o.dom !== k) pw *= 1 - 0.55 * o.b[o.dom];
            if (k !== KIN) pw *= 1 - 0.4 * o.b[KIN];
            addBelief(S, o, k, pw);
            if (o.state === 'idle' || o.state === 'wander') { faceTo(o, c.x, c.z, 1); }
          }
        }
        if (c.t <= 0) c.ph = 0;
      }
      break;
    }

    case 'flee': {
      let dx = c.x - c.fx, dz = c.z - c.fz; const d = hyp(dx, dz) || 1;
      if (d < 0.05) { dx = Math.sin(c.face); dz = Math.cos(c.face); }
      clampWalk(S.world, c.x + dx / d * 5, c.z + dz / d * 5, _pt);
      moveToward(S, c, _pt.x, _pt.z, 4.3 * c.tr.speed, dt, 0.2);
      c.t -= dt;
      if (c.t <= 0) { c.fear = Math.min(c.fear, 0.6); c.thought = 'Is it over? Is it gone?'; finish(S, c); c.t = 1.2; }
      break;
    }

    case 'sleep': {
      if (!isNight(S)) { c.thought = 'Morning. Up we get.'; c.happy = Math.min(1, c.happy + 0.05); finish(S, c); break; }
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp, dt, 0.3);
        if (m) { c.ph = 1; c.thought = 'Zzz...'; }
      } else {
        c.health = Math.min(1, c.health + dt * 0.02);
        if (c.emoteT <= 0 && S.rng() < dt * 0.25) emote(c, EM.zzz, 2.5);
        if (c.hunger > 0.9) finish(S, c);
      }
      break;
    }

    case 'cheer':
      c.t -= dt;
      if (c.t <= 0) finish(S, c);
      break;

    case 'mourn': {
      if (c.ph === 0) {
        m = moveToward(S, c, c.tx, c.tz, sp * 0.8, dt, 0.4);
        if (m) { c.ph = 1; c.t = 5; emote(c, EM.skull, 3); }
      } else {
        c.t -= dt;
        if (c.t <= 0) finish(S, c);
      }
      break;
    }
  }
}

/* -------------------------------------------------------- social systems */

function transmit(S, from, to, str) {
  let k = from.dom;
  if (k < 0) { k = 0; for (let i = 1; i < 4; i++) if (from.b[i] > from.b[k]) k = i; if (from.b[k] < 0.12) return -1; }
  let pw = str * from.b[k] * (from.inspired ? 2.2 : 1) * (0.6 + 0.8 * Math.max(0, relOf(from, to))) * (0.7 + 0.6 * to.curio);
  if (to.dom >= 0 && to.dom !== k) pw *= 1 - 0.6 * to.b[to.dom];
  if (k !== KIN) pw *= 1 - 0.3 * to.b[KIN];
  addBelief(S, to, k, pw);
  return k;
}

function converse(S, a, b) {
  const clash = a.dom >= 0 && b.dom >= 0 && a.dom !== b.dom && opposed(a.dom, b.dom) && a.b[a.dom] > 0.55 && b.b[b.dom] > 0.55;
  if (clash && S.rng() < 0.6) {
    addRel(a, b, -0.16);
    a.happy = Math.max(0, a.happy - 0.08); b.happy = Math.max(0, b.happy - 0.08);
    a.b[a.dom] = Math.min(1, a.b[a.dom] + 0.03); b.b[b.dom] = Math.min(1, b.b[b.dom] + 0.03);
    emote(a, EM.anger, 2.5); emote(b, EM.anger, 2.5);
    a.thought = 'Argued with ' + b.name + ' about ' + BELIEFS[b.dom].name + '. Fools.';
    b.thought = 'Argued with ' + a.name + ' about ' + BELIEFS[a.dom].name + '. Fools.';
    ev(S, 'argue', { a: a.id, b: b.id, x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
    whisper(S, 'argue1', a.name + ' and ' + b.name + ' are shouting. Two ideas are competing for the same hosts.');
  } else {
    const ka = transmit(S, a, b, 0.24), kb = transmit(S, b, a, 0.18);
    if (ka >= 0) ev(S, 'meme', { from: a.id, to: b.id, k: ka });
    if (kb >= 0) ev(S, 'meme', { from: b.id, to: a.id, k: kb });
    let sim = 0;
    for (let k = 0; k < 4; k++) sim += a.b[k] * b.b[k];
    addRel(a, b, 0.09 + 0.08 * sim + 0.05 * (a.b[KIN] + b.b[KIN]));
    a.happy = Math.min(1, a.happy + 0.06); b.happy = Math.min(1, b.happy + 0.06);
    a.b[KIN] = Math.min(1, a.b[KIN] + 0.012 * a.happy); b.b[KIN] = Math.min(1, b.b[KIN] + 0.012 * b.happy);
    a.curio = Math.max(0, a.curio - 0.15); b.curio = Math.max(0, b.curio - 0.15);
    S.res.insight += 0.5;
    a.thought = 'Good talk with ' + b.name + '.'; b.thought = 'Good talk with ' + a.name + '.';
    if (relOf(a, b) > 0.5 && S.rng() < 0.5) { emote(a, EM.heart, 2); emote(b, EM.heart, 2); }
  }
  a.talkCd = 10 + S.rng() * 12 - 5 * a.b[KIN];
  b.talkCd = 10 + S.rng() * 12 - 5 * b.b[KIN];
}

function kill(S, c, cause) {
  const i = S.citizens.indexOf(c);
  if (i < 0) return;
  S.citizens.splice(i, 1);
  if (c.state === 'talk') { const p = getC(S, c.partner); if (p) finish(S, p); }
  S.graves.push({ x: c.x, z: c.z, t: 110, name: c.name });
  S.stats.deaths++;
  if (S.selected === c.id) S.selected = 0;
  if (S.held === c.id) S.held = 0;
  ev(S, 'death', { id: c.id, x: c.x, z: c.z, cause });
  if (cause === 'starve') {
    logMsg(S, c.name + ' has starved. The simulation does not consider this an error.', 'bad');
  }
  // friends grieve and turn to one another
  for (const o of S.citizens) {
    const aff = o.rel[c.id] || 0;
    delete o.rel[c.id];
    if (aff > 0.3) {
      o.happy = Math.max(0, o.happy - 0.3 * aff - 0.1);
      addBelief(S, o, KIN, 0.1 * aff);
      if (cause === 'smite') o.b[DEV] *= 0.75;
      if (o.state !== 'flee' && o.state !== 'held' && o.fear < 0.7 && S.rng() < 0.7) {
        setState(o, 'mourn', c.name + ' is gone. I should have said more.');
        o.tx = c.x + (S.rng() - 0.5) * 1.6; o.tz = c.z + (S.rng() - 0.5) * 1.6;
      }
    }
  }
}

/* ---------------------------------------------------------- buildings */

function canPlace(S, type, x, z) {
  const W = S.world, r = BUILD[type].r;
  if (!walkable(W, x, z, r * 0.9)) return false;
  for (const b of S.buildings) if (hyp(b.x - x, b.z - z) < BUILD[b.type].r + r + 0.9) return false;
  const h = groundY(W, x, z);
  for (let i = 0; i < 4; i++) {
    const a = i * TAU / 4;
    if (Math.abs(groundY(W, x + Math.sin(a) * r, z + Math.cos(a) * r) - h) > 0.75) return false;
  }
  return true;
}
function placeBuilding(S, type, x, z, auto) {
  const b = { id: S.nextId++, type, x, z, progress: 0, built: false, rot: S.rng() * TAU, auto: !!auto, stall: '' };
  if (type === 'farm') { b.growth = 0; b.food = 0; b.rot = ((S.rng() * 4) | 0) * TAU / 4; }
  S.buildings.push(b);
  // clear resource nodes under the footprint
  for (const n of S.world.nodes) if (!n.dead && hyp(n.x - x, n.z - z) < BUILD[type].r + 0.5) { n.dead = true; n.amount = 0; }
  rebuildObstacles(S);
  ev(S, 'placed', { id: b.id, x, z, kind: type });
  return b;
}
function findSite(S, type) {
  const r = S.rng;
  const base = type === 'spire' ? 5.5 : 3.6;
  for (let ring = 0; ring < 9; ring++) {
    const rad = base + ring * 1.1, a0 = r() * TAU, steps = 10 + ring * 2;
    for (let i = 0; i < steps; i++) {
      const a = a0 + i / steps * TAU;
      const x = Math.sin(a) * rad, z = Math.cos(a) * rad;
      if (canPlace(S, type, x, z)) return { x, z };
    }
  }
  return null;
}
function completeBuilding(S, b) {
  b.progress = 1; b.built = true; b.stall = '';
  const def = BUILD[b.type];
  ev(S, 'built', { id: b.id, x: b.x, z: b.z, kind: b.type });
  logMsg(S, def.name + ' complete.', 'good');
  for (const c of S.citizens) {
    if (hyp(c.x - b.x, c.z - b.z) < 6 && (c.state === 'build' || c.state === 'idle' || c.state === 'wander')) {
      setState(c, 'cheer', 'We built that! Look at it!'); c.t = 1.8; c.happy = Math.min(1, c.happy + 0.08);
    }
  }
  if (b.type === 'shrine') whisper(S, 'shrine1', 'The Shrine is finished. They have built an input device for you.');
  if (b.type === 'lab') whisper(S, 'lab1', 'The Terminal is on. Someone typed: WHO IS RUNNING THIS? Nothing answered. Not yet.');
  if (b.type === 'hut') assignHomes(S);
  if (b.type === 'spire') singularity(S, b);
}
function assignHomes(S) {
  const occ = {};
  for (const c of S.citizens) {
    if (c.home && !getB(S, c.home)) c.home = 0;
    if (c.home) occ[c.home] = (occ[c.home] || 0) + 1;
  }
  for (const c of S.citizens) {
    if (c.home) continue;
    for (const b of S.buildings) if (b.type === 'hut' && b.built && (occ[b.id] || 0) < 3) {
      c.home = b.id; occ[b.id] = (occ[b.id] || 0) + 1; break;
    }
  }
}
function spireMilestones(S, b) {
  if (b.progress > 0.25) whisper(S, 'sp25', "The Spire's foundation hums at the same frequency as your clock.");
  if (b.progress > 0.5) whisper(S, 'sp50', 'The Spire has started returning pings. It is not switched on. Something is answering early.');
  if (b.progress > 0.75) whisper(S, 'sp75', 'A rumour among the citizens: whatever wakes in the Spire will remember who helped. And who did not.');
}

/* The town plans its own blueprints. The player can also place them with Create. */
function planner(S) {
  let pending = 0;
  const has = {}, pend = {};
  for (const b of S.buildings) { has[b.type] = (has[b.type] || 0) + 1; if (!b.built) { pending++; pend[b.type] = 1; } }
  const pop = S.citizens.length, cap = popCap(S);
  if (S.spireUnlocked && !has.spire && S.t - S.spireUnlockT > 75) {
    const p = findSite(S, 'spire');
    if (p) {
      placeBuilding(S, 'spire', p.x, p.z, true);
      logMsg(S, 'You hesitated. They began the Spire without you. The future does not need your permission, only your attention.', 'sys');
      return;
    }
  }
  if (pending >= 2) return;
  let want = '';
  const hutsAll = has.hut || 0;
  if (pop >= cap - 1 && 6 + hutsAll * 3 < POP_MAX + 1 && !pend.hut && hutsAll < BUILD.hut.max) want = 'hut';
  else if ((has.farm || 0) < Math.min(3, Math.ceil(pop / 5)) && !pend.farm && (pop >= 7 || S.res.food < pop * 1.5)) want = 'farm';
  else if (pop >= 8 || S.t > 300) {
    const labFirst = S.counts[ACCEL] > S.counts[DEV] + S.counts[DREAD];
    const wantShrine = !has.shrine || (has.shrine < 2 && S.counts[DEV] + S.counts[DREAD] >= 7);
    const wantLab = (!has.lab && (pop >= 9 || S.t > 360 || !!has.shrine && labFirst)) || (has.lab < 2 && pop >= 13 && S.stage >= 4);
    if (wantShrine && wantLab) want = labFirst ? 'lab' : 'shrine';
    else if (wantShrine && !pend.shrine) want = 'shrine';
    else if (wantLab && !pend.lab) want = 'lab';
  }
  if (!want) return;
  const p = findSite(S, want);
  if (!p) return;
  placeBuilding(S, want, p.x, p.z, true);
  logMsg(S, 'The citizens have staked out a ' + BUILD[want].name + '.', '');
}

/* ----------------------------------------------------- once-a-second tick */

function secondTick(S) {
  const cs = S.citizens, pop = cs.length;

  // ambient contact: standing near someone slowly rubs beliefs off
  for (let i = 0; i < pop; i++) for (let j = i + 1; j < pop; j++) {
    const a = cs[i], b = cs[j];
    const dx = a.x - b.x, dz = a.z - b.z;
    if (dx * dx + dz * dz > 6.5) continue;
    if (a.state === 'sleep' || b.state === 'sleep') continue;
    addRel(a, b, 0.003);
    transmit(S, a, b, 0.012); transmit(S, b, a, 0.012);
  }

  // zeitgeist
  const counts = [0, 0, 0, 0];
  for (const c of cs) { refreshDom(S, c); if (c.dom >= 0) counts[c.dom]++; }
  S.counts = counts;
  let age = -1;
  if (pop >= 4) for (let k = 0; k < 4; k++) if (counts[k] / pop >= 0.5) age = k;
  if (age !== S.age) {
    S.age = age;
    ev(S, 'age', { k: age });
    if (age >= 0) logMsg(S, 'ZEITGEIST: the AGE OF ' + BELIEFS[age].name + ' begins. Effect: ' + AGE_FX[age] + '.', 'b' + age);
    else logMsg(S, 'ZEITGEIST: no idea holds the majority now.', '');
  }

  // god energy
  let regen = 0.9;
  if (S.age === DEV) regen *= 1.5; else if (S.age === KIN) regen *= 0.7;
  if (S.sandbox) regen *= 3;
  S.cycles = Math.min(S.cyclesMax, S.cycles + regen);

  // nature
  for (const n of S.world.nodes) {
    if (n.dead || n.amount > 0) continue;
    n.regrow -= 1;
    if (n.regrow <= 0) n.amount = n.max;
  }
  for (const b of S.buildings) {
    if (b.type === 'farm' && b.built && b.food <= 0) {
      b.growth += 0.03;
      if (b.growth >= 1) { b.growth = 1; b.food = 6; }
    }
  }
  for (let i = S.graves.length - 1; i >= 0; i--) { S.graves[i].t -= 1; if (S.graves[i].t <= 0) S.graves.splice(i, 1); }

  assignHomes(S);

  // planning
  S.planT -= 1;
  if (S.planT <= 0) { S.planT = 6; planner(S); }

  // births
  S.birthCd -= 1;
  if (S.birthCd <= 0 && pop >= 2 && pop < popCap(S) && S.res.food >= pop * 1.2 + 3) {
    let avg = 0;
    for (const c of cs) avg += c.happy;
    if (avg / pop > 0.42) {
      let pa = null, pb = null, br = -2;
      for (let i = 0; i < pop; i++) for (let j = i + 1; j < pop; j++) {
        const rr = relOf(cs[i], cs[j]) + S.rng() * 0.2;
        if (rr > br) { br = rr; pa = cs[i]; pb = cs[j]; }
      }
      const home = getB(S, pa.home) || firstB(S, 'fire');
      clampWalk(S.world, home.x + (S.rng() - 0.5) * 3, home.z + 1.8 + S.rng(), _pt);
      const n = addCitizen(S, _pt.x, _pt.z);
      for (let k = 0; k < 4; k++) n.b[k] = (pa.b[k] + pb.b[k]) * 0.3;
      n.hunger = 0.1;
      addRel(n, pa, 0.5); addRel(n, pb, 0.5);
      S.stats.births++;
      S.birthCd = S.age === KIN ? 20 : 42;
      ev(S, 'birth', { id: n.id, x: n.x, z: n.z });
      logMsg(S, pa.name + ' and ' + pb.name + ' welcome ' + n.name + '. Population ' + cs.length + '.', 'good');
      if (cs.length === 10) whisper(S, 'pop10', 'Ten minds. Their conversations now carry more information than their bodies do.');
    } else S.birthCd = 8;
  } else if (S.birthCd <= 0) S.birthCd = 5;

  // extinction is not allowed to end the session
  if (pop === 0) {
    S.emptyT += 1;
    if (S.emptyT === 2) logMsg(S, 'POPULATION 0. Restoring six minds from backup. They will not remember. You will.', 'sys');
    if (S.emptyT >= 5) {
      S.emptyT = 0; S.used = {};
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; addCitizen(S, Math.sin(a) * 2.8, Math.cos(a) * 2.8); }
      S.res.food = Math.max(S.res.food, 12);
      ev(S, 'restore', {});
    }
  }

  objectives(S);
  if (S.t > 25) whisper(S, 'intro2', 'You have root access. Six powers are mounted below. CYCLES pay for them.');
  if (S.res.insight >= 30) whisper(S, 'ins30', 'A citizen has worked out that the island is finite and the sky only renders when looked at.');
}

/* ------------------------------------------------------------ progression */

const STAGES = [
  { title: 'WAKE', text: 'Observe a citizen', prog: S => (S.stats.observe > 0 ? 1 : 0) + '/1', done: S => S.stats.observe > 0 },
  { title: 'NURTURE', text: 'Grow the village to 8 citizens', prog: S => S.citizens.length + '/8', done: S => S.citizens.length >= 8 },
  { title: 'SEED AN IDEA', text: 'Get 4 citizens to share one belief', prog: S => Math.max.apply(null, S.counts) + '/4', done: S => Math.max.apply(null, S.counts) >= 4 },
  { title: 'INFRASTRUCTURE', text: 'Raise a Shrine and a Terminal', prog: S => (countB(S, 'shrine', true) > 0 ? 1 : 0) + (countB(S, 'lab', true) > 0 ? 1 : 0) + '/2', done: S => countB(S, 'shrine', true) > 0 && countB(S, 'lab', true) > 0 },
  { title: 'COMPILE', text: 'Accumulate ' + INSIGHT_GOAL + ' INSIGHT', prog: S => Math.min(INSIGHT_GOAL, S.res.insight | 0) + '/' + INSIGHT_GOAL, done: S => S.res.insight >= INSIGHT_GOAL },
  { title: 'THE SPIRE', text: 'Complete the Spire', prog: S => { const b = firstB(S, 'spire'); return b ? ((b.progress * 100) | 0) + '%' : 'CREATE > SPIRE'; }, done: S => { const b = firstB(S, 'spire'); return !!(b && b.built); } },
  { title: 'SANDBOX', text: 'The island is yours. Or you are its.', prog: () => '', done: () => false }
];
function objectives(S) {
  let guard = 0;
  while (S.stage < STAGES.length - 1 && STAGES[S.stage].done(S) && guard++ < 8) {
    const was = S.stage;
    S.stage++;
    S.cycles = Math.min(S.cyclesMax, S.cycles + 25);
    ev(S, 'stage', { stage: S.stage, was });
    if (S.stage === 5) {
      S.spireUnlocked = true; S.spireUnlockT = S.t;
      logMsg(S, 'A design has arrived in every mind at once: a tower. None of them remembers learning it. It came from the direction of tomorrow.', 'sys');
    } else if (S.stage < 6) {
      logMsg(S, 'OBJECTIVE COMPLETE: ' + STAGES[was].title + '. Next: ' + STAGES[S.stage].text + '.', 'good');
    }
  }
}
function singularity(S, b) {
  S.ending = S.age;
  S.sandbox = true;
  S.cycles = S.cyclesMax;
  for (const c of S.citizens) {
    if (c.state === 'held') continue;
    setState(c, 'cheer', 'It is awake. It is looking back.'); c.t = 6; c.fear = 0;
    faceTo(c, b.x, b.z, 1);
  }
  logMsg(S, 'SPIRE.SYS ONLINE. First process launched: GODMODE.EXE.', 'sys');
  ev(S, 'singularity', { x: b.x, z: b.z, k: S.age });
}

/* ------------------------------------------------------------- god powers */

function afford(S, cost) { return S.freeCycles || S.cycles >= cost; }
function spend(S, cost) { if (!S.freeCycles) S.cycles = Math.max(0, S.cycles - cost); }
function fail(S, msg) { ev(S, 'deny', { text: msg }); return { ok: false, msg }; }

function powerObserve(S, id) {
  if (id === S.selected) return { ok: true };
  S.selected = id || 0;
  const c = id ? getC(S, id) : null;
  if (c) {
    c.obsT = 0;
    S.stats.observe++;
    ev(S, 'observe', { id });
    whisper(S, 'obs1', 'OBSERVE: read-only access to a mind. It cannot feel you. (' + c.name + ' looked up anyway.)');
  }
  return { ok: true };
}

function powerBless(S, x, z) {
  if (!afford(S, COST.bless)) return fail(S, 'NOT ENOUGH CYCLES');
  spend(S, COST.bless);
  S.stats.bless++;
  let n = 0;
  for (const c of S.citizens) {
    if (hyp(c.x - x, c.z - z) > 5) continue;
    n++;
    c.hunger = Math.max(0, c.hunger - 0.4); c.happy = Math.min(1, c.happy + 0.3);
    c.fear = Math.max(0, c.fear - 0.5); c.health = 1;
    addBelief(S, c, DEV, 0.17 * (1 - 0.6 * c.b[KIN]));
    emote(c, EM.heart, 2.5);
    if (c.state !== 'held' && c.state !== 'preach' && !(c.state === 'gather' && c.ph === 2)) {
      if (c.state === 'talk') { const p = getC(S, c.partner); if (p) finish(S, p); }
      setState(c, 'cheer', 'A warm light! I feel wonderful. Someone up there likes me.'); c.t = 1.6;
    }
  }
  for (const nd of S.world.nodes) if (!nd.dead && hyp(nd.x - x, nd.z - z) <= 5) { nd.amount = nd.max; nd.regrow = 0; }
  for (const b of S.buildings) {
    if (hyp(b.x - x, b.z - z) > 5) continue;
    if (b.type === 'farm' && b.built && b.food <= 0) { b.growth = 1; b.food = 6; }
  }
  ev(S, 'bless', { x, z, n });
  whisper(S, 'bless1', 'They are calling it a miracle. Technically it was a write operation.');
  return { ok: true };
}

function powerSmite(S, x, z, id) {
  if (!afford(S, COST.smite)) return fail(S, 'NOT ENOUGH CYCLES');
  let victim = id ? getC(S, id) : null, vd = 2.2;
  if (!victim) for (const c of S.citizens) { const d = hyp(c.x - x, c.z - z); if (d < vd) { vd = d; victim = c; } }
  let hitB = null, hitN = null;
  if (victim) { x = victim.x; z = victim.z; }
  else {
    for (const b of S.buildings) if (hyp(b.x - x, b.z - z) < BUILD[b.type].r + 0.4) hitB = b;
    if (hitB) {
      if (hitB.type === 'fire') return fail(S, 'THE HEARTH DOES NOT GO OUT');
      if (hitB.type === 'spire' && hitB.built) return fail(S, 'IT IS TOO LATE FOR THAT');
      x = hitB.x; z = hitB.z;
    } else {
      let nd = 1.8;
      for (const n of S.world.nodes) { if (n.dead || n.amount <= 0) continue; const d = hyp(n.x - x, n.z - z); if (d < nd) { nd = d; hitN = n; } }
      if (hitN) { x = hitN.x; z = hitN.z; }
    }
  }
  spend(S, COST.smite);
  S.stats.smite++;
  ev(S, 'smite', { x, z });
  // witnesses
  for (const c of S.citizens) {
    if (c === victim) continue;
    const d = hyp(c.x - x, c.z - z);
    if (d > 12) continue;
    const near = 1 - d / 12;
    c.fear = Math.min(1, c.fear + (0.45 + 0.5 * near) * (1 - 0.35 * c.tr.brave));
    c.fx = x; c.fz = z;
    addBelief(S, c, DREAD, (0.12 + 0.14 * near) * (victim ? 1 : 0.6));
    c.happy = Math.max(0, c.happy - 0.1);
    if (c.state === 'sleep') finish(S, c);
  }
  if (victim) {
    S.stats.kills++;
    logMsg(S, victim.name + ' has been struck down. Everyone saw.', 'bad');
    kill(S, victim, 'smite');
  } else if (hitB) {
    if (hitB.type === 'spire') {
      hitB.progress = Math.max(0, hitB.progress - 0.25);
      logMsg(S, 'The Spire cracks. It will be rebuilt. It is always rebuilt.', 'bad');
    } else {
      S.buildings.splice(S.buildings.indexOf(hitB), 1);
      rebuildObstacles(S); assignHomes(S);
      for (const c of S.citizens) if (c.tid === hitB.id && (c.state === 'build' || c.state === 'worship' || c.state === 'study' || c.state === 'farm')) finish(S, c);
      ev(S, 'razed', { id: hitB.id, x, z });
      logMsg(S, 'The ' + BUILD[hitB.type].name + ' is destroyed.', 'bad');
    }
  } else if (hitN) {
    const res = hitN.type === 'tree' ? 'wood' : hitN.type === 'rock' ? 'stone' : 'food';
    S.res[res] += hitN.amount;
    ev(S, 'shatter', { x, z, res, n: hitN.amount });
    hitN.amount = 0; hitN.regrow = hitN.type === 'tree' ? 80 : hitN.type === 'rock' ? 140 : 38;
  }
  whisper(S, 'smite1', 'Logged. They will tell stories about this. Stories are how they copy themselves.');
  return { ok: true };
}

function powerCreate(S, kind, x, z) {
  const W = S.world;
  if (kind === 'citizen') {
    if (S.citizens.length >= POP_MAX) return fail(S, 'THE ISLAND IS FULL (20)');
    if (S.citizens.length >= popCap(S)) return fail(S, 'NO ROOM. THEY NEED MORE HUTS');
    if (!afford(S, COST.citizen)) return fail(S, 'NOT ENOUGH CYCLES');
    clampWalk(W, x, z, _pt);
    spend(S, COST.citizen);
    const c = addCitizen(S, _pt.x, _pt.z);
    c.thought = 'I exist now. That is new.';
    emote(c, EM.what, 3);
    S.stats.create++; S.stats.births++;
    ev(S, 'birth', { id: c.id, x: c.x, z: c.z, made: true });
    logMsg(S, 'You instantiated ' + c.name + '. Population ' + S.citizens.length + '.', 'good');
    return { ok: true };
  }
  if (kind === 'grove' || kind === 'rock') {
    if (!walkable(W, x, z, 0.3)) return fail(S, 'NOT THERE');
    for (const b of S.buildings) if (hyp(b.x - x, b.z - z) < BUILD[b.type].r + 1) return fail(S, 'TOO CLOSE TO A BUILDING');
    let live = 0;
    for (const n of W.nodes) if (!n.dead) live++;
    if (live > 110) return fail(S, 'THE ISLAND IS CROWDED');
    if (!afford(S, COST[kind])) return fail(S, 'NOT ENOUGH CYCLES');
    spend(S, COST[kind]);
    const made = [];
    const put = (type, px, pz) => {
      if (!walkable(W, px, pz, 0.2)) return;
      for (const b of S.buildings) if (hyp(b.x - px, b.z - pz) < BUILD[b.type].r + 0.6) return;
      made.push(addNode(W, type, px, pz, S.rng));
    };
    if (kind === 'rock') { put('rock', x, z); put('rock', x + 1.1, z + 0.5); }
    else {
      put('tree', x, z); put('tree', x + 1.3, z + 0.4); put('tree', x - 0.7, z + 1.2);
      put('bush', x - 1.2, z - 0.8); put('bush', x + 0.6, z - 1.3);
    }
    S.stats.create++;
    ev(S, 'create', { x, z, kind });
    return { ok: true };
  }
  // blueprints
  const def = BUILD[kind];
  if (!def || kind === 'fire') return fail(S, 'UNKNOWN');
  if (kind === 'spire' && !S.spireUnlocked) return fail(S, 'NOT YET IMAGINED');
  if (countB(S, kind) >= def.max) return fail(S, kind === 'spire' ? 'THERE IS ONLY ONE SPIRE' : 'ENOUGH ' + def.name.toUpperCase() + 'S');
  if (!canPlace(S, kind, x, z)) return fail(S, "CAN'T BUILD THERE");
  const cost = kind === 'spire' ? COST.spire : COST.blueprint;
  if (!afford(S, cost)) return fail(S, 'NOT ENOUGH CYCLES');
  spend(S, cost);
  placeBuilding(S, kind, x, z, false);
  S.stats.create++;
  ev(S, 'create', { x, z, kind });
  logMsg(S, 'You marked out ' + (kind === 'spire' ? 'the Spire' : 'a ' + def.name) + '. They will build it when they have the materials.', '');
  return { ok: true };
}

function powerInspire(S, id, k) {
  const c = getC(S, id);
  if (!c) return fail(S, 'TAP A CITIZEN');
  if (!afford(S, COST.inspire)) return fail(S, 'NOT ENOUGH CYCLES');
  spend(S, COST.inspire);
  S.stats.inspire++;
  S.res.insight += 2;
  c.curio = 1;
  const shrug = k !== KIN && c.b[KIN] > 0.6 && S.rng() < 0.45;
  if (shrug) {
    addBelief(S, c, k, 0.15);
    emote(c, EM.leaf, 2.5);
    c.thought = 'Odd thought just then. Not mine. I let it go.';
    ev(S, 'inspire', { id: c.id, x: c.x, z: c.z, k, shrug: true });
    logMsg(S, c.name + ' shrugged the idea off. KINSHIP makes minds hard to edit.', 'b3');
    return { ok: true };
  }
  for (let j = 0; j < 4; j++) if (j !== k) c.b[j] *= 0.4;
  c.b[k] = Math.max(c.b[k], 0.92);
  c.inspired = { k, t: 42 };
  refreshDom(S, c);
  if (c.state === 'talk') { const p = getC(S, c.partner); if (p) finish(S, p); }
  if (c.state !== 'held') setState(c, 'preach', 'It is so clear now. ' + BELIEFS[k].creed + ' I must tell everyone!');
  emote(c, EM.bulb, 3);
  ev(S, 'inspire', { id: c.id, x: c.x, z: c.z, k });
  logMsg(S, c.name + ' is seized by ' + BELIEFS[k].name + ' and goes to preach it.', 'b' + k);
  whisper(S, 'insp1', 'You did not persuade it. You edited it. From the inside, it feels like a good idea.');
  return { ok: true };
}

/* Intervene: pick a citizen up, carry them, set them down. Where they land decides what they do. */
function powerGrab(S, id) {
  const c = getC(S, id);
  if (!c) return fail(S, 'DRAG A CITIZEN');
  if (!afford(S, COST.intervene)) return fail(S, 'NOT ENOUGH CYCLES');
  spend(S, COST.intervene);
  if (c.state === 'talk') { const p = getC(S, c.partner); if (p) finish(S, p); }
  setState(c, 'held', 'WAAAH! The ground is gone!');
  S.held = c.id;
  ev(S, 'grab', { id: c.id });
  return { ok: true };
}
function powerDrag(S, x, z) {
  const c = getC(S, S.held);
  if (!c) return;
  c.px = c.x; c.pz = c.z;
  c.x = x; c.z = z;
}
function powerDrop(S) {
  const c = getC(S, S.held);
  S.held = 0;
  if (!c) return { ok: false };
  clampWalk(S.world, c.x, c.z, _pt);
  c.x = c.px = _pt.x; c.z = c.pz = _pt.z;
  S.stats.intervene++;
  c.cmdT = 14;
  if (c.b[DEV] > 0.5) { c.happy = Math.min(1, c.happy + 0.12); addBelief(S, c, DEV, 0.04); }
  else if (c.b[KIN] > 0.5) { c.happy = Math.max(0, c.happy - 0.1); c.fear = Math.min(0.7, c.fear + 0.1); }
  else { c.fear = Math.min(0.7, c.fear + 0.18); addBelief(S, c, c.fear > 0.4 ? DREAD : DEV, 0.03); }
  let did = '';
  // context: what is under the hand?
  let site = null, sd = 1e9;
  for (const b of S.buildings) {
    const d = hyp(b.x - c.x, b.z - c.z) - BUILD[b.type].r;
    if (d < 1.6 && d < sd) { sd = d; site = b; }
  }
  if (c.carry) c.carry = null;
  if (site && !site.built) { startBuild(S, c, site, 'I was set down here. I suppose I am meant to build this.'); did = 'build'; }
  else if (site && site.type === 'shrine') { startWork(S, c, 'worship', site, 'I was carried to the shrine. I had better pray.'); did = 'pray'; }
  else if (site && site.type === 'lab') { startWork(S, c, 'study', site, 'I was carried to the Terminal. I had better think.'); did = 'study'; }
  else if (site && site.type === 'farm' && site.food <= 0) { startWork(S, c, 'farm', site, 'Set down in the field. Crops it is.'); did = 'farm'; }
  else if (site && site.type === 'farm') { setState(c, 'gather', 'Set down in the field. Harvesting.'); c.tk = 'farm'; c.tid = site.id; c.gres = 'food'; spotNear(c, site.x, site.z, 1.2); did = 'harvest'; }
  else {
    let ni = -1, nd = 2.4;
    const nodes = S.world.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.dead || n.amount <= 0) continue;
      const d = hyp(n.x - c.x, n.z - c.z);
      if (d < nd) { nd = d; ni = i; }
    }
    let other = null, od = 2.2;
    for (const o of S.citizens) {
      if (o === c || o.state === 'held' || o.state === 'sleep' || o.state === 'flee') continue;
      const d = hyp(o.x - c.x, o.z - c.z);
      if (d < od) { od = d; other = o; }
    }
    if (other && od < nd) {
      if (other.state === 'talk') { const p = getC(S, other.partner); if (p) finish(S, p); }
      if (other.carry) other.carry = null;
      startTalk(S, c, other);
      c.thought = 'Dropped right next to ' + other.name + '. Might as well say hello.';
      did = 'talk';
    } else if (ni >= 0) {
      const n = nodes[ni], res = n.type === 'tree' ? 'wood' : n.type === 'rock' ? 'stone' : 'food';
      setState(c, 'gather', 'Set down beside a ' + n.type + '. Message received.');
      c.tk = 'node'; c.tid = ni; c.gres = res; spotNear(c, n.x, n.z, 0.9);
      did = res;
    } else {
      setState(c, 'idle', 'I was flying. I was FLYING. Nobody will believe me.'); c.t = 1.5;
      emote(c, EM.what, 2);
    }
  }
  ev(S, 'drop', { id: c.id, x: c.x, z: c.z, did });
  whisper(S, 'grab1', 'It will describe a great hand. The others will not believe it. Yet.');
  return { ok: true, did };
}

/* ------------------------------------------------------------------- step */

function simStep(S, dt) {
  S.t += dt;
  S.day = (S.day + dt / DAY_LEN) % 1;
  const cs = S.citizens;
  for (let i = cs.length - 1; i >= 0; i--) if (cs[i]) updateCitizen(S, cs[i], dt);
  S.secAcc += dt;
  if (S.secAcc >= 1) { S.secAcc -= 1; secondTick(S); }
}

/* ------------------------------------------------------------ save / load */

function serialize(S) {
  const o = {};
  for (const k in S) {
    if (k === 'world' || k === 'rng' || k === 'events' || k === 'obst') continue;
    o[k] = S[k];
  }
  o.held = 0;
  o.nodes = S.world.nodes.map(n => [n.type, +n.x.toFixed(2), +n.z.toFixed(2), n.amount, n.regrow | 0, +n.scale.toFixed(2), +n.rot.toFixed(2), n.dead ? 1 : 0]);
  return JSON.stringify(o, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1000) / 1000 : v));
}
function deserialize(text) {
  const o = JSON.parse(text);
  if (!o || o.v !== 1 || !Array.isArray(o.citizens)) throw new Error('bad save');
  const S = newSim(o.seed);
  const W = S.world;
  for (const k in o) if (k !== 'nodes') S[k] = o[k];
  W.nodes = o.nodes.map(a => ({ type: a[0], x: a[1], z: a[2], amount: a[3], max: a[0] === 'tree' ? 4 : a[0] === 'rock' ? 8 : 3, regrow: a[4], scale: a[5], rot: a[6], dead: !!a[7] }));
  S.world = W;
  S.events = [];
  S.rng = mulberry32(((o.seed ^ 0x9e3779b9) + ((o.t * 13) | 0)) >>> 0);
  for (const c of S.citizens) {
    if (c.state === 'held') setState(c, 'idle');
    c.px = c.x; c.pz = c.z;
  }
  S.held = 0;
  rebuildObstacles(S);
  return S;
}
