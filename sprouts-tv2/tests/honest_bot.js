/* Sprouts TV 2: the honest player. This file is evaluated inside the game (through ?dev) so it can SEE what a
   player sees: where things are, what the arrow says, who is following. It never writes to the game. Everything it
   does goes through the same eight buttons a controller has. If it cannot do a step, the step is not playable (or the
   bot is not good enough): either way it is reported, never papered over.
   __hb.run(seconds) plays that many game seconds and returns a status line. */
(() => {
  const B = window.__hb = { f: 0, log: [], bad: [], ask: '', askT: 0, askV: -1, prog: 0, defer: {}, done: {}, path: null, px: 0, py: 0, side: 0, sd: 0, lx: 0, ly: 0, stuck: 0, hold: 0, note: '', times: {}, fr: {} };
  const K = __g.keys, PR = __g.prev;
  const press = k => { K[k] = 1 };
  const tl = m => { B.log.push('D' + day + ' ' + String(Math.round(dayT / DAYLEN * 100)).padStart(3) + '%  ' + m) };
  const dist = (o, q = P) => Math.hypot(o.x - q.x, o.y - q.y);
  const every = (n, k = 0) => B.f % n === k;
  const followers = t => squad.filter(b => t == null || b.type === t);
  const idlers = () => buds.filter(b => b.st === 'idle' && !b.gard);
  const crew = () => buds.filter(b => !b.gard);
  const npc = name => npcs.find(n => n.name === name);
  const tileOK = (x, y) => fieldL[(y >> 4) * MW + (x >> 4)] >= 0;

  /* ---- legs ---- */
  function nearestOpen(x, y) { let best = null, bd = 1e9; const tx0 = x >> 4, ty0 = y >> 4; for (let r = 0; r < 14 && !best; r++)for (let ty = ty0 - r; ty <= ty0 + r; ty++)for (let tx = tx0 - r; tx <= tx0 + r; tx++) { if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) continue; if (!free(tx * 16 + 8, ty * 16 + 8, false)) continue; const p = pathTo(P.x, P.y, tx * 16 + 8, ty * 16 + 8, false); if (!p) continue; const d = Math.hypot(tx * 16 + 8 - x, ty * 16 + 8 - y); if (d < bd) { bd = d; best = p } } return best }
  function walk(x, y, stop = 4) {
    const d = Math.hypot(x - P.x, y - P.y); if (d <= stop) return d;
    if (every(12) || !B.path || B.px !== x || B.py !== y) { B.px = x; B.py = y; B.path = pathTo(P.x, P.y, x, y, false) || (B.blocked = B.f, nearestOpen(x, y)) || [] }
    let wp = B.path[0]; while (wp && Math.hypot(wp.x - P.x, wp.y - P.y) < 5) { B.path.shift(); wp = B.path[0] }
    if (!wp && pathTo(P.x, P.y, x, y, false)) wp = { x, y };
    if (B.side > 0) { B.side--; press(['up', 'right', 'down', 'left'][B.sd % 4]); return d }
    if (wp) { const dx = wp.x - P.x, dy = wp.y - P.y; if (dx > 2) press('right'); else if (dx < -2) press('left'); if (dy > 2) press('down'); else if (dy < -2) press('up') }
    B.walking = B.f; return d
  }
  function face(o) { const dx = o.x - P.x, dy = o.y - P.y, ax = Math.abs(dx), ay = Math.abs(dy); if (ax > ay * .41) press(dx > 0 ? 'right' : 'left'); if (ay > ax * .41) press(dy > 0 ? 'down' : 'up') }
  const facingIt = o => { const d = dist(o) || 1; return ((o.x - P.x) * P.dx + (o.y - P.y) * P.dy) / d > .85 };
  function talkTo(n) { const d = walk(n.x, n.y + 15, 5); if (d <= 5 || dist(n) < 20) { if (!facingIt(n)) { if (every(3)) face(n) } else if (every(14)) press('a') } }
  /* ---- arms ---- */
  /* throw followers at a thing the aim can snap to. type: a sprout type that is needed, or null. Returns what it is doing. */
  function throwAt(o, type, want = 99, range = 46) {
    const d = dist(o), on = o.on ? o.on.length : 0;
    if (on >= want) return 'manned';
    if (type != null && !followers(type).length) return 'notype';
    if (!followers().length) return 'nocrew';
    const noway = !pathTo(P.x, P.y, o.x, o.y, false); if (d > (noway ? 66 : range)) { const d0 = walk(o.x, o.y, range - 6); if (noway && every(30)) { B.shore = Math.hypot(P.x - (B.sx || 0), P.y - (B.sy || 0)) < 1 ? (B.shore || 0) + 1 : 0; B.sx = P.x; B.sy = P.y } return noway && B.shore > 3 ? 'out of reach' : 'walk' }
    if (type != null && sel !== type) { if (every(8)) press('sel'); return 'sel' }
    if (cur.o !== o) { if (d < 16) { /* too close to aim: step back */ const dx = P.x - o.x, dy = P.y - o.y; if (Math.abs(dx) > Math.abs(dy)) press(dx > 0 ? 'right' : 'left'); else press(dy > 0 ? 'down' : 'up'); B.back = 12 } else if (B.back > 0) B.back--; else if (every(2)) face(o); return 'aim' }
    if (every(5)) press('a'); return 'throw'
  }
  function whistle(at) { if (at && dist(at) > 40) { walk(at.x, at.y, 34); return } if (at && !facingIt(at) && dist(at) > 10 && every(2)) { face(at); return } press('b') }
  /* call idle sprouts back when there are some and nobody is following, or every so often */
  function regroup(min = 1) { const I = idlers(); if (!I.length) return false; if (followers().length >= min && !(B.f % 900 < 120)) return false; let b = I[0], bd = 1e9; for (const q of I) { const d = dist(q); if (d < bd) { bd = d; b = q } } whistle(b); return true }
  function pluck(s) { const d = walk(s.x, s.y + 2, 8); if (d <= 12 && P.pluck <= 0 && every(8)) press('a') }
  const soil = f => sprouts.filter(q => inSoil(q) && q.age > .5 && (!f || f(q)));
  const nearestOf = (L, q = P) => { let b = null, bd = 1e9; for (const o of L) { const d = dist(o, q); if (d < bd) { bd = d; b = o } } return b };
  /* berries: one carrier each (two for a big one), nearest first, only ones Will can walk to */
  function berries(type) {
    if (regroup()) return 'regroup';
    const L = items.filter(i => isBerry(i) && str(i) < i.w && tileOK(i.x, i.y) && pathTo(P.x, P.y, i.x, i.y, false));
    const it = nearestOf(L); if (!it) { if (soil().length && crew().length < capNow()) { pluck(nearestOf(soil())); return 'pluck' } walk(SOIL.x, SOIL.y + 30, 20); return 'no berries' }
    if (!followers().length) { if (soil().length) { pluck(nearestOf(soil())); return 'pluck' } return 'nobody' }
    if (type != null && !followers(type).length) type = null;
    return 'berry ' + throwAt(it, type, 9)
  }
  /* have at least n sprouts out with Will (following or idle), growing the crew from the soil and from berries */
  function grow(n, type) {
    const have = crew().filter(b => type == null || b.type === type).length; if (have >= n) return false;
    const S = soil(q => type == null || q.type === type); if (S.length && crewCount() - sprouts.filter(inSoil).length - seeds.length < capNow()) { pluck(nearestOf(S)); B.note = 'grow: pluck'; return true }
    if (type != null && !crew().some(b => b.type === type)) { B.note = 'grow: none of that kind to start from'; return false }
    B.note = 'grow: ' + berries(type); return true
  }

  /* ---- getting about ---- */
  const GTYPE = g => g.sub === 0 ? 0 : g.sub === 1 ? 1 : null; /* bramble wants Embers, crystal wants Pebs, stakes take anyone */
  const canReach = o => !!pathTo(P.x, P.y, o.x, o.y, false);
  function frontier() { const L = []; for (const g of gates) { if (!g.alive || g.sub === 2 || g.sub === 4) continue; if (g.sub === 5 && (!run.key || gates[1].alive)) continue; let ok = false; for (let dy = -2; dy <= 2 && !ok; dy++)for (let dx = -2; dx <= 2 && !ok; dx++) { const x = g.x + dx * 16, y = g.y + dy * 16; if (x > 0 && y > 0 && free(x, y, false) && pathTo(P.x, P.y, x, y, false)) ok = true } if (ok) L.push(g) } return L }
  /* true when Will can walk to o. If not, works on the shut gate nearest to it that he can get at. */
  function reach(o) {
    if (canReach(o)) return true;
    if (every(60) || !B.gate || !B.gate.alive) { const F = frontier(); B.gate = nearestOf(F, o) || null }
    const g = B.gate; if (!g) { B.note = 'no way there and no gate to open'; return false }
    if (g.sub === 5) { walk(g.x + 26, g.y, 10); B.note = 'to the job site gate with the key'; return false }
    const t = GTYPE(g); if (t != null && !crew().some(b => b.type === t)) { if (t === 1) { const w = nearestOf(sprouts.filter(q => q.type === 1 && !inSoil(q))) || { x: 23 * 16 + 8, y: 4 * 16 + 8 }; if (canReach(w)) { if (w.type === 1) pluck(w); else walk(w.x, w.y, 10); B.note = 'fetching a wild PEB for ' + g.id; return false } } B.note = 'gate ' + g.id + ' needs ' + TYPES[t].n + 'S and there are none'; return false }
    if (grow(t === 1 ? 1 : 3, t)) return false; if (regroup(3)) return false;
    B.note = 'gate ' + g.id + ': ' + throwAt(g, t); return false
  }
  /* a thing out in the water: stand on the bank in line with it and throw Dews in; they find it themselves */
  function swimTo(it) {
    if (!B.bank || B.bankFor !== it) { B.bankFor = it; B.bank = null; let bd = 1e9; for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { let wet = false; for (let k = 1; k < 9; k++) { const x = it.x + ax * k * 16, y = it.y + ay * k * 16; if (tileAt(x, y) === WA) { wet = true; continue } if (!wet) continue; /* still on the island */ if (free(x, y, false) && pathTo(P.x, P.y, x, y, false) && k * 16 < 112 && k * 16 < bd) { bd = k * 16; B.bank = { x: (x >> 4) * 16 + 8, y: (y >> 4) * 16 + 8 } } break } } }
    if (!B.bank) { B.note = 'no bank in line with it that Will can walk to'; reach(it); return }
    if (dist(B.bank) > 7) { walk(B.bank.x, B.bank.y, 5); B.note = 'to the bank'; return }
    if (sel !== 2) { if (every(8)) press('sel'); B.note = 'choosing Dews'; return }
    const wet = tileAt(cur.x, cur.y) === WA && Math.hypot(cur.x - it.x, cur.y - it.y) < 60 && !cur.o;
    if (wet) { if (every(6)) press('a'); B.note = 'throwing Dews into the water' } else { if (every(3)) face(it); B.note = 'turning to face it' }
  }
  function wild(type, x, y) { const w = nearestOf(sprouts.filter(q => q.type === type && !inSoil(q))); const o = w || { x, y }; if (!reach(o)) return; if (w) pluck(w); else { walk(x, y, 10); B.note = 'looking for a wild ' + TYPES[type].n } }
  const strOf = L => L.reduce((a, b) => a + (b.type === 1 ? 2 : 1), 0);
  /* get a thing carried home: enough hands on it, then walk with it */
  function haul(it, type) {
    if (str(it) >= it.w) { if (dist(it) > 60) walk(it.x, it.y, 44); B.note = 'walking it home'; return }
    if (type == null && !reach(it)) return;
    const pool = crew().filter(b => type == null || b.type === type); if (strOf(pool) + str(it) < it.w) { if (!grow(pool.length + 1, type)) B.note = 'need more ' + (type == null ? 'sprouts' : TYPES[type].n + 'S') + ' for a load of ' + it.w; return }
    if (strOf(followers(type)) + str(it) < it.w && idlers().length) { const I = nearestOf(idlers().filter(b => type == null || b.type === type)); if (I) { whistle(I); B.note = 'calling the crew'; return } }
    B.note = 'load: ' + throwAt(it, type)
  }
  function garden(n) {
    if (!gard.open) { B.note = 'garden shut'; return }
    const bed = nearestOf(plots.filter(p => needs(p) && !p.on.length));
    if (gardeners() < n && bed) { if (!crew().length || crew().length < 2) { if (grow(4)) return } if (regroup()) return; if (!reach(bed)) return; B.note = 'bed: ' + throwAt(bed, null, 1); return }
    if (gard.basket > 0) { walk(46 * 16, 7 * 16 + 8, 3); B.note = 'basket'; return }
    B.note = 'gardeners at work (' + gardeners() + ')'; walk(GARD.x, GARD.y + 20, 24)
  }
  const bugOK = q => q.alive && !q.hid;
  function bug(pick, type) { let L = bugs.filter(q => bugOK(q) && (!pick || pick(q))); const q = nearestOf(L.filter(q => canReach(q) || type === 2)) || nearestOf(L); if (!q) { B.note = 'no such bug about'; walk(42 * 16, 18 * 16, 30); return } if (type != null && !crew().some(b => b.type === type)) { B.note = 'needs a ' + TYPES[type].n; return } if (regroup()) return; if (!followers().length && grow(3)) return; B.note = 'bug ' + q.sp + ': ' + throwAt(q, type, 1, 50) }

  /* ---- the asks ---- */
  const A = {
    e1: () => { const s = nearestOf(soil()); if (s) pluck(s); else walk(SOIL.x, SOIL.y + 30, 12) },
    e2: () => { B.note = berries() },
    e3: () => { if (dist(LO) > 90) { walk(LO.x, LO.y, 60); return } B.note = petOK ? 'heart' : 'standing still for Louie'; if (petOK && every(12)) press('a') }, /* stand still: he comes round to the front */
    e4: () => { const s = nearestOf(soil(q => stageOf(q) === 2)); if (s) { pluck(s); return } if (!soil().length) { B.note = 'seed: ' + berries(); return } B.note = 'waiting for a bloom'; if (items.some(i => isBerry(i) && tileOK(i.x, i.y)) && followers().length) B.note = berries(); else walk(SOIL.x, SOIL.y + 34, 16) },
    e5: () => garden(5), e6: () => garden(5),
    e12: () => { const k = items.find(i => i.alive && i.sub === 'key'); if (k) haul(k); else B.note = 'no key yet' },
    e11: () => { const c = followers().filter(b => !b.star); if (c.length < 5) { if (idlers().length) { regroup(5); return } if (grow(crew().length + 1)) return } B.home = 1; const d = walk(DOOR.x, DOOR.y + 12, 4); if (d <= 6) { if (!facingIt(DOOR)) face(DOOR); else if (every(12)) press('a') } },
    e7: () => { if (crew().length < capNow() && soil().length) { pluck(nearestOf(soil())); return } B.note = berries() },
    e8: () => { const L = items.filter(i => i.alive && i.sub === 'shard'); const it = nearestOf(L.filter(i => canReach(i) || str(i) >= i.w)) || nearestOf(L.filter(i => !i.isle)) || L[0]; if (it) { if (it.isle) A.m2(); else haul(it); return } const e = foes.find(e => e.alive && e.boss); if (e) A.r4(); else B.note = 'no shard to be seen' },
    e9: () => garden(Math.min(gardCap(), 8)),
    e10: () => { const o = gard.order; if (o && gard.seed !== o.k && o.k < seedsOpen()) { if (!reach(SIGN)) return; const d = walk(SIGN.x, SIGN.y + 14, 4); B.note = 'at the seed sign for ' + FLOWERS[o.k].pl; if (d <= 6) { if (!facingIt(SIGN)) { if (every(3)) face(SIGN) } else if (every(20)) press('a') } return } garden(Math.min(gardCap(), 8)) },
    r1: () => { if (grow(3, 0)) return; if (regroup(3)) return; B.note = throwAt(gates[0], 0) },
    r2: () => wild(1, 23 * 16 + 8, 4 * 16 + 8),
    r3: () => { const w = nearestOf(sprouts.filter(q => q.type === 1 && !inSoil(q) && canReach(q))); if (w && crew().filter(b => b.type === 1).length < 3) { pluck(w); return } if (!crew().some(b => b.type === 1)) { wild(1, 23 * 16 + 8, 4 * 16 + 8); return } if (regroup(1)) return; B.note = throwAt(gates[1], 1) },
    r5: () => { const g = gates[5]; if (!canReach({ x: g.x, y: g.y + 24 }) && !canReach({ x: g.x, y: g.y - 24 }) && !canReach({ x: g.x - 24, y: g.y }) && !canReach({ x: g.x + 24, y: g.y })) { if (!reach(g)) return } if (grow(8)) return; if (regroup(6)) return; B.note = throwAt(g, null) },
    r4: () => { const e = foes.find(e => e.alive && e.boss); if (!e) { const it = items.find(i => i.alive && i.sub === 'shard' && !i.isle && dist(i, THORN) < 120); if (it) haul(it); else B.note = 'Thornback is up'; return } if (!reach(e)) return; if (grow(Math.min(capNow(), 12))) return; if (regroup(8)) return; B.note = 'climb on: ' + throwAt(e, null) },
    r6: () => { const q = AT.r6(); if (!q) { B.note = 'every post left is behind something shut'; B.defer.r6 = B.f + 30 * 240; return } if (reach(q)) walk(q.x, q.y + 8, 6) },
    s1: () => wild(3, 51 * 16 + 8, 24 * 16 + 8),
    s2: () => bug(q => q.sp !== 3),
    s3: () => { const e = nearestOf(foes.filter(e => e.alive && !e.boss)); if (!e) { B.note = 'no grubs about'; walk(44 * 16, 16 * 16, 30); return } if (!reach(e)) return; if (grow(6)) return; if (regroup(4)) return; B.note = 'grub: ' + throwAt(e, null) },
    s4: () => { const need = q => !meta.bugs[q.sp]; const L = bugs.filter(q => bugOK(q) && need(q)); if (!L.length) { B.note = 'no new kind of bug about (have ' + kinds() + ')'; walk(42 * 16, 18 * 16, 30); return } const q = nearestOf(L); bug(x => x === q, q.sp === 3 ? 2 : null) },
    s5: () => { const q = nearGlim(); if (q.x === HX && q.y === HY) { B.note = 'no glimmer in any place found so far'; return } if (reach(q)) walk(q.x, q.y, 3) },
    s7: () => { const w = wbuds.find(q => q.id === 'LANTERNWISP' && !q.hid); if (!w) { B.note = 'she only walks after dark'; if (dayT > DAYLEN * .5) { if (reach({ x: 63 * 16 + 8, y: 9 * 16 + 8 })) walk(63 * 16 + 8, 9 * 16 + 8, 30) } else B.defer.s7 = B.f + 30 * 60; return } if (reach(w)) walk(w.x, w.y, 40) },
    m0: () => { const k = items.find(i => i.alive && i.sub === 'key'); if (k) haul(k); else { B.note = 'the key is not dug up yet'; B.defer.m0 = B.f + 30 * 120 } },
    m1: () => wild(2, 10 * 16, 12 * 16 + 10),
    m2: () => { const it = items.find(i => i.alive && i.isle); if (!it) { B.note = 'no island shard'; return } if (str(it) >= it.w) { B.note = 'they are swimming it home'; walk(HX, HY + 40, 30); return } if (!crew().some(b => b.type === 2)) { wild(2, 10 * 16, 12 * 16 + 10); return } if (crew().filter(b => b.type === 2).length + str(it) < it.w) { const w = nearestOf(sprouts.filter(q => q.type === 2 && !inSoil(q) && canReach(q))); if (w) { pluck(w); return } if (grow(it.w, 2)) return } if (followers(2).length + str(it) < it.w && idlers().some(b => b.type === 2)) { whistle(nearestOf(idlers().filter(b => b.type === 2))); return } swimTo(it) },
    m3: () => { const q = nearestOf(bugs.filter(q => bugOK(q) && q.sp === 3)); if (!q) { B.note = 'no dragonfly about'; walk(9 * 16, 20 * 16, 30); return } bug(x => x === q, 2) },
    m4: () => { B.note = berries() },
  };
  A.s6 = A.s5;

  /* ---- who to work for ---- */
  const ORDER = ['ERIN', 'RANGER', 'MARCUS', 'SCOUT'], LIM = { e10: 2400, e4: 400, e5: 600, e6: 400, e9: 2400, e7: 900, s5: 400, s6: 400, m4: 400, r4: 400, e8: 600, m2: 500, s7: 500, s4: 400 }; B.gave = {};
  function pickPerson() { /* someone whose ask the bot knows how to try and has not just given up on */
    for (const name of ORDER) { const n = npc(name); if (!n || n.st === 'done') continue; if (n.st === 'new') { if (reachable(n)) return n; continue } const m = n.ms[n.mi]; if (A[m.id] && !(B.defer[m.id] > B.f)) return n } return null
  }
  /* when nobody is asking for anything: the old arch, whatever Louie has sniffed out, and the wedding book */
  function after() {
    const k = keepObj(); if (k && /SOMETHING OLD/.test(k.text)) { if (!reach(KEEP)) return 'arch: ' + B.note; const d = walk(KEEP.x, KEEP.y + 16, 4); if (d <= 6) { if (!facingIt(KEEP)) { if (every(3)) face(KEEP) } else if (every(14)) press('a') } return 'reading the arch' }
    if (k && /BRIDGE/.test(k.text)) { A.r5(); return 'bridge ' + B.note }
    const t = nearestOf(items.filter(i => i.alive && i.sub === 'trs' && (canReach(i) || str(i) >= i.w))); if (t) { haul(t); return 'treasure: ' + B.note }
    if (DIG.alive && canReach(DIG)) { if (grow(5)) return 'dig ' + B.note; if (regroup(3)) return 'dig: calling'; return 'digging: ' + throwAt(DIG, null, 5) }
    const w = wedObj(); if (w && w.done) { B.home = 2; const d = walk(DOOR.x, DOOR.y + 12, 4); if (d <= 6) { if (!facingIt(DOOR)) face(DOOR); else if (every(12)) press('a') } return 'home to set the date' }
    if (louLv() < 4 && petOK) { if (every(12)) press('a'); return 'a scratch for Louie' }
    if (grow(Math.min(capNow(), 12))) return 'idle: ' + B.note;
    B.note = berries(); return 'berries: ' + B.note
  }
  /* the story's own steps (the key at the gate, then everything past the sun door) */
  function story(c) {
    const t = c.text;
    if (/UNLOCK THE POND/.test(t)) { const j = coastGate('jobsite'); if (!canReach({ x: j.x + 30, y: j.y })) { if (gates[1].alive) { A.r3(); return true } return false } walk(j.x + 26, j.y, 8); return true }
    if (/FOLLOW THE BEAM/.test(t)) { if (reach(c)) walk(c.x + 56, c.y, 4); return true } /* the marker is the doorway: go on through it */
    if (/LOOK INSIDE/.test(t)) { if (reach(c)) walk(c.x, c.y, 6); return true }
    if (/BUILD THE OLD PIER/.test(t)) { const g = coastGate('northPier'); if (grow(8)) return true; if (regroup(6)) return true; B.note = throwAt(g, null); return true }
    if (/TELL MARCUS/.test(t)) { const m = npc('MARCUS'); if (reach(m)) talkTo(m); return true }
    if (/FLOW PROS JOB/.test(t)) { if (grow(10)) return true; if (followers().length < 10 && idlers().length) { whistle(nearestOf(idlers())); return true } if (reach(c)) walk(c.x, c.y, 10); return true }
    if (/CARRY THE LENS/.test(t)) { const it = items.find(i => i.alive && i.sub === 'lens'); if (it) haul(it); return true }
    if (/TONIGHT/.test(t)) { B.note = 'waiting for dark at the Lantern'; walk(HX, HY + 44, 20); return true }
    return false
  }
  function think() {
    const o = objective(); B.note = '';
    const fin = npcs.find(msDone); if (fin && canReach(fin)) { talkTo(fin); return 'hand in to ' + fin.name }
    { const c = coastObj() || keyObj(); if (c && story(c)) return 'story: ' + c.text + (B.note ? ' ' + B.note : '') }
    /* the bot works for one person at a time, on the ask they last gave it; Erin's first three come first, as the game insists */
    const e = npcs[0]; if (e.st === 'active' && e.mi >= 3) { const q = npcs.find(q => q.st === 'new' && canReach(q)); if (q) { talkTo(q); return 'meet ' + q.name } }
    let n = B.who ? npc(B.who) : null; if (e.st === 'new' || (e.st === 'active' && e.mi < 3 && !(B.defer[e.ms[e.mi].id] > B.f))) n = e;
    const ok = q => q && q.st === 'active' && A[q.ms[q.mi].id] && !(B.defer[q.ms[q.mi].id] > B.f);
    if (!ok(n)) { n = pickPerson(); if (!n) { B.who = ''; return 'after: ' + after() } }
    B.who = n.name; if (n.st === 'new') { talkTo(n); return 'meet ' + n.name }
    const m = n.ms[n.mi];
    /* progress watch: an ask that has not moved in three game minutes is set aside for five */
    const v = m.get(), key = m.id; if (B.ask !== key || v !== B.askV) { if (B.ask !== key) { tl('ASK    ' + n.name + ' ' + m.id + '  ' + m.t + '  (crew ' + crew().map(b => b.type).sort().join('') + ')') } B.ask = key; B.askV = v; B.askT = time }
    if (time - B.askT > (LIM[key] || 180)) { B.defer[key] = B.f + 30 * 300; B.askT = time; B.gave[key] = (B.gave[key] || 0) + 1; tl('  set aside ' + key + ' (no progress in ' + (LIM[key] || 180) + ' s: ' + B.last + ')'); return 'defer' }
    A[m.id](m, n); return m.id + (B.note ? ' ' + B.note : '')
  }

  B.run = secs => {
    const dt = 1 / 30;
    for (let i = 0; i < secs * 30; i++) {
      B.f++; for (const k in K) K[k] = 0;
      if (msg && msgT > 0 && B.lm !== msg) { B.lm = msg; tl('SAY    ' + msg) } if (state === 'card' && B.lc !== card) { B.lc = card; tl('CARD   ' + card.title) }
      if (state === 'c3' && B.l3 !== c3q) { B.l3 = c3q; tl('3D     <' + c3q.key + '>') }
      if (state === 'play') {
        if (inHome) { if (B.home === 1 && homeTotal() < 5 && parked.filter(b => !b.star).length >= 5) { const q = homeAt(); if (q && q.id === 'desk') { if (every(12)) press('a') } else press('up') } else if (B.home === 2 && !run.wed) { const q = homeAt(), F = HST.find(h => h.id === 'fire'); if (q && q.id === 'fire') { if (every(12)) press('a') } else { if (P.x > F.x + 4) press('left'); if (P.y > F.y + 4) press('up'); else if (P.y < F.y - 4) press('down') } } else { B.home = 0; press('down') } }
        else { B.last = think(); if (every(30)) { if (B.walking > B.f - 30 && Math.hypot(P.x - B.lx, P.y - B.ly) < 2) { B.stuck++; B.side = 14; B.sd++ } B.lx = P.x; B.ly = P.y } }
      } else if (['cine', 'talk', 'card', 'dayend', 'win', 'hop', 'c3', 'pan'].includes(state)) { if (every(8)) press('a') }
      else if (state === 'house' && B.home) { if (hi !== 1) { if (every(8)) press('down') } else if (every(8)) { press('a'); B.home = 0 } }
      else if (state === 'hsel' && B.home === 2) { const o = hsel.opts[hsel.i]; if (/WEDDING BOOK|SET THE DATE/.test(o[0])) { if (every(10)) press('a') } else if (hsel.opts.some(q => /WEDDING BOOK|SET THE DATE/.test(q[0]))) { if (every(10)) press('down') } else { B.home = 0; if (every(8)) press('b') } }
      else if (every(8)) press('b');
      /* asks finished are stamped when they are handed in */
      for (const n of npcs) { const k = n.name + ':' + (n.st === 'done' ? n.ms.length : n.mi); if (B.fr[n.name] !== k) { if (B.fr[n.name] && n.st !== 'new') { const id = n.ms[(n.st === 'done' ? n.ms.length : n.mi) - 1]; if (id && !B.done[id.id]) { B.done[id.id] = +(day + dayT / DAYLEN).toFixed(2); tl('DONE   ' + n.name + ' ' + id.id + '  ' + id.t) } } B.fr[n.name] = k } }
      try { __g.update(dt) } catch (e) { if (B.bad.length < 20) B.bad.push('THROW ' + e.message + ' @' + state + ' ' + (e.stack || '').split('\n')[1]) }
      for (const k in K) PR[k] = K[k];
      if (B.beat && every(B.beat * 30)) tl('  .. ' + state + ': ' + B.last + '  at ' + (P.x >> 4) + ',' + (P.y >> 4) + '  with ' + squad.length + ' of ' + crew().length + ', idle ' + idlers().length + ', pets ' + run.pets);
      if (every(900)) { try { __g.draw() } catch (e) { B.bad.push('DRAW ' + e.message) } }
    }
    return JSON.stringify({ day, pct: Math.round(dayT / DAYLEN * 100), state, doing: B.last, at: [P.x >> 4, P.y >> 4], crew: crew().map(b => b.type).sort().join(''), follow: squad.length, soil: sprouts.filter(inSoil).length, shards, asks: npcs.map(n => n.name[0] + (n.st === 'done' ? 'done' : n.st === 'new' ? 'new' : n.ms[n.mi].id)).join(' '), stuck: B.stuck, bad: B.bad })
  };
  B.A = A; B.tools = { walk, face, talkTo, throwAt, whistle, regroup, pluck, soil, nearestOf, berries, grow, followers, idlers, crew, npc, dist, every, press, tl, tileOK, facingIt };
})();
