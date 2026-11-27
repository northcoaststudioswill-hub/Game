'use strict';
/* GODMODE.EXE: a whole life. Ageing and generations, each citizen's own memories, the
   secrets they keep, what they want, and the god's hand on any one of them (steer()).
   Pure simulation like sim.js and society.js: no DOM, no THREE. */

const ELDER_AT = 0.78;          // fraction of a lifespan after which someone is old
const MEM_MAX = 40;

function fillLife(c, S) {
  if (c.life === undefined) c.life = 1500 + ((c.id * 9301 + 49297) % 233280) / 233280 * 700;
  if (!c.mem) c.mem = [];
  if (!c.sec) c.sec = [];
  if (c.gen === undefined) c.gen = 1;
  if (c.elder === undefined) c.elder = false;
}
function dayOf(S) { return Math.floor(S.t / DAY_LEN) + 1; }
/* their age in years: childhood (160 s) is 18 years, after that about 25 seconds a year */
function ageYears(c) { return Math.floor(c.age < GROW_SECS ? c.age / GROW_SECS * 18 : 18 + (c.age - GROW_SECS) * 0.04); }
function memo(S, c, text) {
  if (!c || !c.mem) return;
  c.mem.push({ d: dayOf(S), text });
  if (c.mem.length > MEM_MAX) c.mem.splice(1, 1);    // keep the first memory (where they came from)
}
function secret(S, c, k, who, n) {
  if (!c || !c.sec) return;
  for (const s of c.sec) if (s.k === k && s.who === who) { s.n = (s.n || 0) + (n || 0); s.d = dayOf(S); return; }
  c.sec.push({ k, who: who || 0, n: n || 0, d: dayOf(S) });
  if (c.sec.length > 8) c.sec.shift();
}
function nameOf(S, id) { const o = getC(S, id); return o ? o.name : (S.dead && S.dead[id]) || 'someone long gone'; }

/* ---------------------------------------------------------- age and death */

function lifeTick(S) {
  for (const c of S.citizens.slice()) {
    if (!c.elder && c.age > c.life * ELDER_AT) {
      c.elder = true;
      memo(S, c, 'Grew old. The island looks smaller than it used to.');
      c.thought = 'My knees have opinions now.';
      ev(S, 'elder', { id: c.id });
    }
    if (c.age >= c.life && c.state !== 'held') {
      const kids = S.citizens.filter(o => o.par.indexOf(c.id) >= 0).length;
      let grand = 0;
      for (const o of S.citizens) for (const p of o.par) { const pp = getC(S, p); if (pp && pp.par.indexOf(c.id) >= 0) { grand++; break; } }
      const m = c.mate ? getC(S, c.mate) : null;
      const left = [];
      if (m) left.push('a partner, ' + m.name);
      if (kids) left.push(kids + (kids === 1 ? ' child' : ' children'));
      if (grand) left.push(grand + (grand === 1 ? ' grandchild' : ' grandchildren'));
      logMsg(S, c.name + ' has died of old age, ' + ageYears(c) + ' years old. ' + (left.length ? 'They leave ' + left.join(', ') + '.' : 'Nobody was close enough to stay by them.'), '');
      kill(S, c, 'age');
    }
  }
}
function generation(S) {
  let g = 1;
  for (const c of S.citizens) if (c.gen > g) g = c.gen;
  return g;
}

/* ------------------------------------------------------- what they hide */

function lifeSecrets(S, c) {
  const out = [];
  for (const s of c.sec) {
    const w = nameOf(S, s.who);
    if (s.k === 'theft') out.push({ k: 'theft', who: s.who, text: 'Stole ' + s.n + ' coin from ' + w + '. Nobody saw.', heavy: 1 });
    else if (s.k === 'sky') out.push({ k: 'sky', who: 0, text: 'Is certain something in the sky is watching them. Has told nobody.' });
    else if (s.k === 'jealous') out.push({ k: 'jealous', who: s.who, text: 'Is eaten up with jealousy over ' + w + '.' });
    else if (s.k === 'saw') out.push({ k: 'saw', who: s.who, text: 'Saw ' + w + ' do something and never said a word.' });
  }
  const mate = c.mate ? getC(S, c.mate) : null;
  let crush = null, cv = 0.5;
  for (const o of S.citizens) {
    if (o === c || o.id === c.mate || !adult(o) || !adult(c) || o.par.indexOf(c.id) >= 0 || c.par.indexOf(o.id) >= 0) continue;
    const v = c.rel[o.id] || 0;
    if (v > cv && (!mate || v > (c.rel[mate.id] || 0))) { cv = v; crush = o; }
  }
  if (crush) {
    const back = (crush.rel[c.id] || 0) > 0.45;
    out.push({ k: 'crush', who: crush.id, text: 'Secretly in love with ' + crush.name + (mate ? ', though they are with ' + mate.name : '') + '. ' + (back ? crush.name + ' feels the same.' : crush.name + ' has no idea.'), heavy: mate ? 1 : 0 });
  }
  for (const o of S.citizens) {
    if (o === c) continue;
    if ((c.rel[o.id] || 0) <= -0.3 && (o.rel[c.id] || 0) >= 0.15) out.push({ k: 'grudge', who: o.id, text: 'Cannot stand ' + o.name + ', who thinks they are friends.' });
  }
  if (c.dom >= 0) {
    let k2 = -1, v2 = 0;
    for (let k = 0; k < 4; k++) if (k !== c.dom && c.b[k] > v2) { v2 = c.b[k]; k2 = k; }
    if (k2 >= 0 && v2 > c.b[c.dom] * 0.6) out.push({ k: 'doubt', who: 0, k2, text: 'Privately doubts ' + BELIEFS[c.dom].name + ', and keeps thinking about ' + BELIEFS[k2].name + '.' });
  }
  if (c.title === 'leader' && c.dom >= 0 && c.b[c.dom] < 0.62) out.push({ k: 'fraud', who: 0, text: 'Does not believe half of what they preach.', heavy: 1 });
  if (c.boss && relOf(c, getC(S, c.boss) || c) < -0.05) out.push({ k: 'boss', who: c.boss, text: 'Resents working for ' + nameOf(S, c.boss) + '.' });
  if (c.coin >= 25) out.push({ k: 'hoard', who: 0, text: 'Has ' + c.coin + ' coin hidden away.' });
  return out;
}

/* --------------------------------------------------------- what they want */

function lifeDesires(S, c) {
  const out = [], B = c.b;
  const add = (key, text, w, who) => out.push({ key, text, w, who: who || 0 });
  if (c.hunger > 0.65) add('food', 'Food. Right now.', 2 + c.hunger);
  if (c.grow < 1) { add('grow', 'To be grown up already.', 0.8); add('play', 'Someone to play with.', 0.6); }
  else {
    const sec = lifeSecrets(S, c), crush = sec.find(s => s.k === 'crush');
    if (!c.mate) add('love', crush ? 'To be with ' + nameOf(S, crush.who) + '.' : 'Someone to love.', 1.1 + c.tr.social * 0.4, crush ? crush.who : 0);
    else {
      let kids = 0, small = 0;
      for (const o of S.citizens) if (o.par.indexOf(c.id) >= 0) { kids++; if (o.grow < 1) small++; }
      if (!small && kids < 3 && !c.elder) add('child', 'A child with ' + nameOf(S, c.mate) + '.', 0.9 + (kids ? 0 : 0.3), c.mate);
    }
    if (!c.home) add('home', 'A roof of their own.', 0.9);
    if (c.coin < 3 && !c.job) add('work', 'Steady work and a little coin.', 0.8);
    else if (c.coin < 3) add('money', 'More coin. Everything costs something now.', 0.7);
    if (c.job && getB(S, c.job) && getB(S, c.job).owner !== c.id && (c.tr.brave + c.curio) > 1.1) add('business', 'A business of their own, not someone else\'s.', 0.75);
    if (c.fac && c.title !== 'leader' && c.tr.social + c.tr.brave > 1.2) { const f = getF(S, c.fac); if (f) add('lead', 'To lead the ' + f.name + '.', 0.7); }
    let foe = null, fv = -0.45;
    for (const o of S.citizens) if ((c.rel[o.id] || 0) < fv) { fv = c.rel[o.id]; foe = o; }
    if (foe) add('revenge', 'To see ' + foe.name + ' brought low.', 0.6 - fv, foe.id);
    if (c.elder) { add('legacy', 'To be remembered.', 0.9); add('time', 'A little more time.', 0.8); }
  }
  if (c.happy < 0.3) add('joy', 'To feel happy again.', 1.2 - c.happy);
  if (c.fear > 0.35) add('safe', 'To stop being afraid.', 0.8 + c.fear);
  const dom = c.dom;
  if (dom === DEV) add('noticed', 'To be noticed by the Watcher.', 0.6 + B[DEV] * 0.4);
  else if (dom === DREAD) add('spared', 'To be spared when the judgement comes.', 0.6 + B[DREAD] * 0.4);
  else if (dom === ACCEL) add('know', 'To know what is beyond the edge of the sky.', 0.6 + B[ACCEL] * 0.4);
  else if (dom === KIN) add('peace', 'For everyone to just get along.', 0.6 + B[KIN] * 0.4);
  out.sort((a, b) => b.w - a.w);
  return out;
}

/* ------------------------------------------------------------ personality */

function lifeTraits(c) {
  const t = c.tr, w = [];
  w.push(t.brave > 0.7 ? 'fearless' : t.brave > 0.4 ? 'steady' : 'timid');
  w.push(t.social > 0.7 ? 'outgoing' : t.social > 0.35 ? 'friendly' : 'a loner');
  w.push(t.curious > 0.7 ? 'endlessly curious' : t.curious > 0.35 ? 'curious' : 'content with what they know');
  w.push(t.speed > 1.08 ? 'quick on their feet' : 'unhurried');
  return w;
}

/* ------------------------------------------------- the god's hand: steer */

const STEER = {
  desire:  { name: 'Grant their deepest wish',  cost: 20 },
  love:    { name: 'Kindle love for...',        cost: 15, who: 1 },
  grudge:  { name: 'Sow a grudge against...',   cost: 12, who: 1 },
  peace:   { name: 'Make peace with...',        cost: 10, who: 1 },
  reveal:  { name: 'Reveal their secret',       cost: 10 },
  lead:    { name: 'Raise them up as a leader', cost: 25 },
  rich:    { name: 'Shower them with coin',     cost: 10 },
  calm:    { name: 'Calm them',                 cost: 6 },
  enrage:  { name: 'Fill them with rage',       cost: 8 },
  doubt:   { name: 'Plant doubt in their faith', cost: 12 },
  dream:   { name: 'Send a prophetic dream',    cost: 15 },
  long:    { name: 'Grant a longer life',       cost: 20 },
  end:     { name: 'Let them go, peacefully',   cost: 20 }
};

function steer(S, c, act, whoId, key) {
  const def = STEER[act];
  if (!c || !def) return { ok: false, msg: 'NOBODY THERE' };
  if (!afford(S, def.cost)) return { ok: false, msg: 'NOT ENOUGH CYCLES' };
  const o = whoId && def.who ? getC(S, whoId) : null;
  if (def.who && (!o || o === c)) return { ok: false, msg: 'CHOOSE SOMEONE ELSE' };
  let msg = '';
  switch (act) {
    case 'desire': {
      const ds = lifeDesires(S, c), d = (key && ds.find(x => x.key === key)) || ds[0];
      if (!d) return { ok: false, msg: 'THEY WANT FOR NOTHING' };
      msg = grantDesire(S, c, d);
      if (!msg) return { ok: false, msg: 'THAT CANNOT BE GIVEN RIGHT NOW' };
      break;
    }
    case 'love':
      addRel(c, o, 0.4); oneRel(o, c, 0.1);
      emote(c, EM.heart, 3);
      memo(S, c, 'Could not stop thinking about ' + o.name + '. It came out of nowhere.');
      if (adult(c) && adult(o) && !c.mate && !o.mate && relOf(c, o) > 0.45 && relOf(o, c) > 0.4 && c.par.indexOf(o.id) < 0 && o.par.indexOf(c.id) < 0) pairUp(S, c, o);
      msg = c.name + ' has fallen for ' + o.name + (c.mate === o.id ? ', and they are together now.' : '.');
      break;
    case 'grudge':
      addRel(c, o, -0.45); emote(c, EM.anger, 3);
      memo(S, c, 'Realised ' + o.name + ' has been against them all along.');
      msg = c.name + ' now resents ' + o.name + '.';
      break;
    case 'peace':
      c.rel[o.id] = Math.max(0.25, c.rel[o.id] || 0); o.rel[c.id] = Math.max(0.25, o.rel[c.id] || 0);
      emote(c, EM.heart, 2); emote(o, EM.heart, 2);
      memo(S, c, 'Made peace with ' + o.name + '.'); memo(S, o, 'Made peace with ' + c.name + '.');
      if (c.state === 'fight' && c.partner === o.id) { finish(S, c); finish(S, o); }
      msg = c.name + ' and ' + o.name + ' have made their peace.';
      break;
    case 'reveal': {
      msg = revealSecret(S, c, key, whoId);
      if (!msg) return { ok: false, msg: 'THEY HAVE NOTHING TO HIDE' };
      break;
    }
    case 'lead': {
      if (!adult(c) || c.dom < 0) return { ok: false, msg: 'THEY NEED A CREED TO LEAD' };
      let f = facOfK(S, c.dom, c.set);
      if (!f) {
        const W = FAC_WORDS[c.dom];
        f = { id: S.facId++, k: c.dom, leader: 0, name: W[0][(S.rng() * 4) | 0] + ' ' + W[1][(S.rng() * 4) | 0], x: c.x, z: c.z, call: null, set: c.set };
        S.factions.push(f);
        for (const p of S.citizens) if (p.dom === c.dom && !p.fac && p.set === c.set) p.fac = f.id;
      }
      const old = getC(S, f.leader);
      if (old && old !== c) { old.title = ''; memo(S, old, 'Was pushed aside so ' + c.name + ' could lead.'); oneRel(old, c, -0.3); }
      f.leader = c.id; c.title = 'leader'; c.fac = f.id; c.sermCd = 5;
      memo(S, c, 'Was raised up to lead the ' + f.name + '. It felt like being chosen.');
      emote(c, EM.crown, 3);
      ev(S, 'leader', { id: c.id, k: c.dom, x: c.x, z: c.z, fresh: true, name: f.name });
      msg = c.name + ' now leads the ' + f.name + (old && old !== c ? ', in place of ' + old.name : '') + '.';
      break;
    }
    case 'rich':
      c.coin += 15; c.happy = Math.min(1, c.happy + 0.1); emote(c, EM.coin, 3); ev(S, 'coin', { x: c.x, z: c.z });
      memo(S, c, 'Found fifteen coins in the grass. Did not ask questions.');
      msg = c.name + ' is suddenly rich.';
      break;
    case 'calm':
      c.fear = 0; c.happy = Math.min(1, c.happy + 0.3); c.sadT = 0;
      if (c.state === 'fight' || c.state === 'tantrum' || c.state === 'flee') { const p = c.state === 'fight' ? getC(S, c.partner) : null; finish(S, c); if (p && p.state === 'fight') finish(S, p); }
      for (const id in c.rel) if (c.rel[id] < 0) c.rel[id] *= 0.6;
      emote(c, EM.halo, 2.5);
      memo(S, c, 'A deep calm came over them, from nowhere.');
      msg = c.name + ' is at peace.';
      break;
    case 'enrage': {
      c.happy = Math.max(0, c.happy - 0.3); c.actCd = 0;
      let near = null, nd = 6;
      for (const p of S.citizens) { if (p === c || !adult(p) || !awake(p) || busyFighting(p)) continue; const d = hyp(p.x - c.x, p.z - c.z); if (d < nd) { nd = d; near = p; } }
      memo(S, c, 'Something snapped.');
      if (near && adult(c) && awake(c) && !busyFighting(c)) { addRel(c, near, -0.3); startFight(S, c, near, 'I do not even know why I am this angry.'); msg = c.name + ' flies into a rage at ' + near.name + '.'; }
      else { startTantrum(S, c); msg = c.name + ' is furious at nothing in particular.'; }
      break;
    }
    case 'doubt': {
      if (c.dom < 0) return { ok: false, msg: 'THEY BELIEVE NOTHING YET' };
      const was = c.dom;
      c.b[was] *= 0.45;
      const k2 = HERESY[was][(S.rng() * HERESY[was].length) | 0];
      c.b[k2] = Math.max(c.b[k2], 0.35);
      refreshDom(S, c);
      memo(S, c, 'Lay awake wondering whether ' + BELIEFS[was].name + ' was ever true.');
      msg = c.name + ' has started to doubt ' + BELIEFS[was].name + '.';
      break;
    }
    case 'dream': {
      const k = c.dom >= 0 ? c.dom : (S.rng() * 4) | 0;
      c.curio = 1; S.res.insight += 4; addBelief(S, c, k, 0.2);
      secret(S, c, 'sky');
      emote(c, EM.eye, 3);
      memo(S, c, 'Dreamed of a great eye above the island, and the eye was kind. Or hungry. Hard to say.');
      msg = c.name + ' wakes from a dream they cannot stop talking about. (+4 insight)';
      for (const p of S.citizens) if (p !== c && hyp(p.x - c.x, p.z - c.z) < 5) transmit(S, c, p, 0.2);
      break;
    }
    case 'long':
      c.life += 600; if (c.elder && c.age < c.life * ELDER_AT) c.elder = false;
      c.health = 1; emote(c, EM.spark, 3);
      memo(S, c, 'Felt years younger, all at once.');
      msg = c.name + ' will live a good while longer.';
      break;
    case 'end':
      spend(S, def.cost);
      logMsg(S, 'You let ' + c.name + ' go. They lay down in the grass and did not get up. It looked peaceful.', 'bad');
      kill(S, c, 'peace');
      ev(S, 'steer', { act, x: c.x, z: c.z });
      return { ok: true, msg: c.name + ' is gone.' };
  }
  spend(S, def.cost);
  S.stats.steer = (S.stats.steer || 0) + 1;
  logMsg(S, msg, '');
  ev(S, 'steer', { act, id: c.id, x: c.x, z: c.z });
  return { ok: true, msg };
}

function grantDesire(S, c, d) {
  const o = d.who ? getC(S, d.who) : null;
  switch (d.key) {
    case 'food': c.hunger = 0; c.happy = Math.min(1, c.happy + 0.1); memo(S, c, 'Found a basket of food that was not there a moment ago.'); return c.name + ' is fed.';
    case 'grow': c.grow = 1; memo(S, c, 'Grew up overnight. Everyone noticed.'); ev(S, 'grownup', { id: c.id, x: c.x, z: c.z }); return c.name + ' is suddenly grown up.';
    case 'play': c.happy = 1; return c.name + ' has the best afternoon of their life.';
    case 'love': {
      let p = o;
      if (!p || p.mate) { let best = -2; for (const q of S.citizens) { if (q === c || q.mate || !adult(q) || q.par.indexOf(c.id) >= 0 || c.par.indexOf(q.id) >= 0) continue; const v = relOf(c, q) + relOf(q, c); if (v > best) { best = v; p = q; } } }
      if (!p || p.mate) return '';
      c.rel[p.id] = Math.max(0.6, c.rel[p.id] || 0); p.rel[c.id] = Math.max(0.6, p.rel[c.id] || 0);
      pairUp(S, c, p);
      return c.name + ' and ' + p.name + ' have found each other.';
    }
    case 'child': {
      const m = getC(S, c.mate);
      if (!m || S.citizens.length >= POP_MAX) return '';
      const home = getB(S, c.home) || hearthOf(S, c);
      clampWalk(S.world, home.x + (S.rng() - 0.5) * 3, home.z + 1.8, _pt);
      const n = addCitizen(S, _pt.x, _pt.z);
      makeChild(S, c, m, n);
      S.stats.births++;
      ev(S, 'birth', { id: n.id, x: n.x, z: n.z });
      return c.name + ' and ' + m.name + ' welcome ' + n.name + '.';
    }
    case 'home': {
      for (const b of S.buildings) if (b.type === 'hut' && b.built && b.set === c.set) {
        let n = 0; for (const q of S.citizens) if (q.home === b.id) n++;
        if (n < 3) { c.home = b.id; memo(S, c, 'Finally has a roof of their own.'); return c.name + ' has a home now.'; }
      }
      const p = findSite(S, 'hut', c.set);
      if (!p) return '';
      placeBuilding(S, 'hut', p.x, p.z, false, c.set);
      return 'A hut is marked out for ' + c.name + '. The others will build it.';
    }
    case 'work': case 'business': {
      if (d.key === 'work') {
        const b = S.buildings.find(b => b.type === 'shop' && b.built && getC(S, b.owner) && b.owner !== c.id && b.set === c.set);
        if (b) { c.job = b.id; c.boss = b.owner; c.coin += 3; memo(S, c, 'Got work at ' + shopName(S, b) + '.'); return c.name + ' now works at ' + shopName(S, b) + '.'; }
      }
      const have = {}; for (const b of S.buildings) if (b.type === 'shop') have[b.biz] = 1;
      const biz = ['tavern', 'bakery', 'workshop'].find(k => !have[k]);
      const p = biz && findSite(S, 'shop', c.set);
      if (!p) { c.coin += 8; return c.name + ' finds 8 coin. It will do for now.'; }
      const b = placeBuilding(S, 'shop', p.x, p.z, true, c.set);
      b.biz = biz; b.owner = c.id; b.till = 0; c.job = b.id; c.boss = 0;
      memo(S, c, 'Opened a ' + BIZ[biz].name.toLowerCase() + ' of their own.');
      return c.name + ' is opening a ' + BIZ[biz].name.toLowerCase() + '.';
    }
    case 'money': c.coin += 12; return c.name + ' has money now.';
    case 'lead': return steerLead(S, c);
    case 'revenge': {
      if (!o) return '';
      o.happy = Math.max(0, o.happy - 0.3); o.coin = Math.floor(o.coin / 2); emote(o, EM.dots, 3);
      memo(S, o, 'Had a terrible, humiliating day. Everyone saw.');
      memo(S, c, 'Watched ' + o.name + ' get what was coming to them.');
      c.happy = Math.min(1, c.happy + 0.2);
      return o.name + ' has a humiliating day, and ' + c.name + ' enjoys every minute.';
    }
    case 'legacy': c.happy = 1; for (const q of S.citizens) if (q !== c) oneRel(q, c, 0.15); memo(S, c, 'Everyone came to hear their stories.'); return 'The whole island comes to hear ' + c.name + '\'s stories.';
    case 'time': c.life += 600; c.elder = c.age > c.life * ELDER_AT; return c.name + ' has more time.';
    case 'joy': c.happy = 0.95; c.sadT = 0; return c.name + ' feels happy again.';
    case 'safe': c.fear = 0; return c.name + ' is not afraid anymore.';
    case 'noticed': c.happy = 1; addBelief(S, c, DEV, 0.2); emote(c, EM.eye, 3); memo(S, c, 'Felt the Watcher look right at them. It was the best moment of their life.'); return c.name + ' knows they have been seen.';
    case 'spared': c.fear = 0; c.happy = Math.min(1, c.happy + 0.3); memo(S, c, 'Was told, in a dream, that they would be spared.'); return c.name + ' believes they will be spared.';
    case 'know': S.res.insight += 6; c.curio = 0; secret(S, c, 'sky'); memo(S, c, 'Understood, for one second, what the island is. Then lost it.'); return c.name + ' glimpses what lies beyond. (+6 insight)';
    case 'peace': for (const q of S.citizens) if (q !== c && hyp(q.x - c.x, q.z - c.z) < 7) { addRel(c, q, 0.15); } return 'Everyone near ' + c.name + ' gets along a little better.';
  }
  return '';
}
function steerLead(S, c) {
  if (!adult(c) || c.dom < 0) return '';
  const f = facOfK(S, c.dom, c.set);
  if (!f) return '';
  const old = getC(S, f.leader);
  if (old && old !== c) old.title = '';
  f.leader = c.id; c.title = 'leader'; c.fac = f.id;
  memo(S, c, 'Was chosen to lead the ' + f.name + '.');
  ev(S, 'leader', { id: c.id, k: c.dom, x: c.x, z: c.z, fresh: true, name: f.name });
  return c.name + ' now leads the ' + f.name + '.';
}

/* exposing a secret to everyone has consequences */
function revealSecret(S, c, key, who) {
  const list = lifeSecrets(S, c);
  if (!list.length) return '';
  const s = (key && list.find(x => x.k === key && (!who || x.who === who))) || list.find(x => x.heavy) || list[0];
  const o = s.who ? getC(S, s.who) : null;
  switch (s.k) {
    case 'theft':
      for (const p of S.citizens) if (p !== c) oneRel(p, c, -0.15);
      if (o) addRel(o, c, -0.5);
      c.sec = c.sec.filter(x => x !== c.sec.find(y => y.k === 'theft' && y.who === s.who));
      memo(S, c, 'Everyone found out about the theft.');
      if (o && awake(o) && awake(c) && !busyFighting(o) && !busyFighting(c) && o.tr.brave > 0.3) startFight(S, o, c, 'You stole from me!');
      return 'Everyone now knows ' + c.name + ' stole from ' + nameOf(S, s.who) + '.';
    case 'crush':
      if (!o) return '';
      if ((o.rel[c.id] || 0) > 0.35 && !o.mate && !c.mate) { pairUp(S, c, o); return 'The secret is out: ' + c.name + ' loves ' + o.name + ', and ' + o.name + ' loves them back.'; }
      if (c.mate) { const m = getC(S, c.mate); if (m) { addRel(m, c, -0.45); oneRel(m, o, -0.4); memo(S, m, 'Found out ' + c.name + ' is in love with ' + o.name + '.'); } }
      oneRel(o, c, (o.rel[c.id] || 0) > 0 ? 0.05 : -0.1);
      memo(S, c, 'Everyone found out how they feel about ' + o.name + '. Mortifying.');
      c.happy = Math.max(0, c.happy - 0.2);
      return 'The secret is out: ' + c.name + ' is in love with ' + o.name + '.' + (c.mate ? ' ' + nameOf(S, c.mate) + ' is not taking it well.' : '');
    case 'grudge':
      if (!o) return '';
      addRel(o, c, -0.4); memo(S, o, 'Found out ' + c.name + ' secretly hates them.');
      return o.name + ' has learned what ' + c.name + ' really thinks of them.';
    case 'doubt': case 'fraud': {
      const f = c.fac ? getF(S, c.fac) : null;
      if (f) for (const p of S.citizens) if (p.fac === f.id && p !== c) oneRel(p, c, -0.2);
      if (c.title === 'leader' && f) { c.title = ''; f.leader = 0; memo(S, c, 'Was exposed as a doubter and thrown out as leader.'); return 'The ' + f.name + ' has learned their leader ' + c.name + ' does not believe. They are thrown out.'; }
      memo(S, c, 'Everyone knows about their doubts now.');
      return 'Everyone now knows ' + c.name + ' doubts ' + BELIEFS[c.dom].name + '.';
    }
    case 'boss':
      if (o) { addRel(o, c, -0.3); memo(S, o, 'Found out ' + c.name + ' resents them.'); }
      c.job = 0; c.boss = 0;
      return c.name + '\'s resentment comes out. They are out of a job.';
    case 'hoard':
      for (const p of S.citizens) if (p !== c && p.coin < 5) oneRel(p, c, -0.12);
      return 'Everyone now knows about ' + c.name + '\'s hidden coin. The poor are not pleased.';
    case 'sky':
      for (const p of S.citizens) if (hyp(p.x - c.x, p.z - c.z) < 8) addBelief(S, p, DEV, 0.06);
      return c.name + ' tells everyone about the eye in the sky. Some of them look up.';
    case 'jealous': case 'saw':
      if (o) addRel(o, c, -0.2);
      return c.name + '\'s secret about ' + nameOf(S, s.who) + ' comes out.';
  }
  return '';
}
