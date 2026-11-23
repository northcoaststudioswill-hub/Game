// GOT NEXT — the basketball: half-court park games, Street rules and JAM (arcade) rules
'use strict';
let MT = null;
const ARC = 6.75, GRAV = 9.8, HOOP_Y = 3.05;
const SPOTS = [[-6.9, 0.7], [6.9, 0.7], [-5.6, 5.3], [5.6, 5.3], [0, 7.7], [-2.7, 1.3], [2.7, 1.3], [0, 4.8]];
const nAtt = (p, id) => clamp((att(p, id) - 25) / 74, 0, 1.15);
function att(p, id) { return p.A[id] + (p.bravT > 0 ? 8 : 0); }
const bt = (p, id) => p.b.badges[id] || 0;
const dHoop = p => Math.hypot(p.x, p.z);
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
function beyondArc(x, z) { return Math.hypot(x, z) > ARC || Math.abs(x) > 6.6; }

function effAttrs(b, mine) {
  const A = {}; for (const a of ATTRS) A[a.id] = b.attrs[a.id];
  for (const s in b.worn) { const d = DRIPS[b.worn[s]]; if (d && d.buff) for (const k in d.buff) A[k] += d.buff[k]; }
  if (mine) {
    const all = cribFx('all'); for (const k in A) A[k] += all;
    A.stam += cribFx('stam') + cribFx('stam2'); if (cribFx('stam2')) A.str += 3;
    for (const id of MT ? MT.boosts : []) { const bo = BOOSTS.find(x => x.id === id); if (bo && bo.buff) for (const k in bo.buff) A[k] += bo.buff[k]; }
  }
  return A;
}

// in an online game the host's sounds, calls and floats are echoed to the guest
function sfxM(n) { sfx(n); if (MT && MT.net === 'host' && n !== 'bounce' && n !== 'step' && n !== 'whoosh' && n !== 'whistle') netEv({ k: 's', s2: n }); }
function fb(p, txt, col) { if (p.remote) netEv({ k: 'fb', t: txt, c: col }); else if (p.user) hudFb(txt, col); }
function startMatch(cfg) {
  disposeScene(scene); scene = new THREE.Scene();
  const arcade = cfg.mode.arcade;
  MT = { cfg, arcade, P: [], score: [0, 0], phase: 'check', pt: 0, off: cfg.firstOff || 0, needClear: false, clock: 14, time: 0, slow: 0, shake: 0, parts: [], boosts: cfg.boosts || [], practice: cfg.practice || null, rackT: 40, rackScore: 0, over: false, paused: false, callQ: [], looseT: 0, lastScorer: null, hotTeam: -1, net: cfg.net || null };
  // --- set ---
  const style = cfg.court || (arcade ? 'arcade' : 'street');
  scene.background = new THREE.Color(arcade ? 0x120824 : style === 'street' ? 0x1a2238 : 0x27304a);
  scene.fog = new THREE.Fog(scene.background.getHex(), 40, 150);
  baseLights(scene, arcade ? 0xc8a8ff : 0xdde8ff, arcade ? 0x301850 : 0x404858, arcade ? 0xffd0ff : 0xfff0d8, arcade ? 1.7 : 1.5);
  const g = M(new THREE.PlaneGeometry(300, 300), toon(arcade ? '#0c0618' : '#20242c'), 0, -0.02, 0, scene); g.rotation.x = -Math.PI / 2;
  MT.hoop = addCourt(scene, style, cfg.hoopTier === undefined ? 2 : cfg.hoopTier);
  addFence(scene, -8.6, 8.6, -2.6, 13.6, 4.2, arcade ? 0xff8ff0 : 0xffffff);
  skyline(scene, 34, 60, arcade ? ['#ff4fd8', '#33e0ff', '#ffc531'] : ['#ffc531', '#ffe9a8', '#33e0ff'], 30);
  billboard(scene, ADS[(MT.cfg.seed || 0) % ADS.length], -13, 7, -6, 0.5, 9, 5);
  billboard(scene, ADS[((MT.cfg.seed || 0) + 3) % ADS.length], 13, 7.5, -7, -0.5, 9, 5);
  billboard(scene, arcade ? 'JAM\nNO RULES\nNO REFUNDS' : (cfg.practice ? 'HOME COURT' : 'THE PIT\n' + cfg.tier.n), 0, 9.5, -9, 0, 12, 4.5, arcade ? '#ff4fd8' : '#ffc531');
  // spectators behind the baseline fence
  MT.fans = [];
  if (!cfg.practice) for (let i = 0; i < 7; i++) { const b = aiBuild(60); const r = makeRig(b, true); r.root.position.set(-7.5 + i * 2.5 + rnd(-0.4, 0.4), 0, -3.4 - rnd(0, 0.8)); r.shadow.visible = false; scene.add(r.root); MT.fans.push({ r, ph: rnd(0, 6), hype: 0 }); }
  // --- players ---
  cfg.teams.forEach((team, ti) => team.forEach((sp, k) => {
    const mine = sp.mine === true;
    const p = { i: MT.P.length, team: ti, k, ctrl: sp.ctrl, user: sp.ctrl >= 0, remote: sp.ctrl === 2, mine, b: sp.b, x: 0, z: 0, y: 0, vx: 0, vz: 0, face: Math.PI, st: 'free', t: 0, stam: 100, runPh: 0, dribPh: 0, hand: 'R', hot: 0, fire: false, brav: mine ? cribFx('brav') : 0, bravT: 0, slowT: 0, cool: 0, moveCool: 0, combo: 0, comboT: 0, catchT: -9, catchFrom: null, putT: 0, callT: 0, handsUp: false, sprinting: false,
      stats: { pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, ankles: 0, greens: 0, dunks: 0, threes: 0, fga: 0, fgm: 0, bravs: 0, fires: 0 }, ai: { tick: rnd(0, 0.3), spot: null, spotT: 0, tx: 0, tz: 0, mx: 0, mz: 0, hold: 0, mode: '', react: 0 } };
    p.A = effAttrs(sp.b, mine); p.aiLvl = sp.ai === undefined ? cfg.tier.ai : sp.ai;
    p.rig = makeRig(sp.b); p.H = p.rig.H; scene.add(p.rig.root);
    const ringC = ti === 0 ? 0x33a0ff : 0xff4040;
    p.ring = M(geo('ring', () => new THREE.RingGeometry(0.36, 0.46, 20)), new THREE.MeshBasicMaterial({ color: p.user ? (p.ctrl === 0 ? 0xffe14a : 0x4dff9a) : ringC, transparent: true, opacity: 0.85, depthWrite: false }), 0, 0.02, 0, p.rig.root); p.ring.rotation.x = -Math.PI / 2;
    if (p.user) { p.arrow = M(geo('arrow', () => new THREE.ConeGeometry(0.11, 0.24, 4)), flat(p.ctrl === 0 ? 0xffe14a : 0x4dff9a), 0, p.H + 0.42, 0, p.rig.root); p.arrow.rotation.x = Math.PI; }
    MT.P.push(p);
  }));
  // man-to-man by slot
  for (const p of MT.P) { const opp = MT.P.filter(o => o.team !== p.team); p.man = opp.length ? opp[p.k % opp.length] : null; }
  MT.humans = MT.P.filter(p => p.user); MT.me = MT.P.find(p => p.mine) || MT.humans[0]; MT.locals = MT.humans.filter(p => !p.remote);
  // --- ball ---
  const B = MT.B = { mesh: makeBall(cfg.ball || 'bl_std'), pos: V3(0, 1, 9), vel: V3(), state: 'held', holder: null, t: 0, shooter: null, lastTeam: 0, spin: 0 };
  scene.add(B.mesh); B.shadow = M(geo('bshadow', () => new THREE.CircleGeometry(0.14, 10)), flat(0x000000, { transparent: true, opacity: 0.3, depthWrite: false }), 0, 0.016, 0, scene); B.shadow.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 36; i++) { const m = M(sph(0.07, 6, 5), new THREE.MeshBasicMaterial({ color: 0xff8a1f, transparent: true }), 0, -5, 0, scene); MT.parts.push({ m, life: 0, v: V3() }); }
  camera.position.set(0, 7, 20);
  musicMode = arcade ? 'jam' : 'game';
  hudShow(true); setCheck(MT.off, true);
  if (cfg.practice === 'rack') call('MONEY RACK', 'Deep balls only. 40 seconds. GO!', '#ffc531');
  window.__mt = MT;
}

// ---------- flow ----------
function setCheck(team, first) {
  const M_ = MT; M_.phase = 'check'; M_.pt = first ? 2.2 : 1.15; M_.off = team; M_.needClear = false; M_.clock = 14; M_.looseT = 0;
  const offs = M_.P.filter(p => p.team === team), defs = M_.P.filter(p => p.team !== team);
  // the human takes the check when it is their ball
  offs.sort((a, b) => (b.user ? 1 : 0) - (a.user ? 1 : 0) || a.k - b.k);
  const oSpots = [[0, 9.3], [-5.4, 5.6], [5.4, 5.6]];
  offs.forEach((p, i) => { p.x = oSpots[i][0]; p.z = oSpots[i][1]; });
  defs.forEach(p => { const m = p.man && p.man.team === team ? p.man : offs[0]; const d = Math.hypot(m.x, m.z) || 1; p.x = m.x - m.x / d * 1.5; p.z = m.z - m.z / d * 1.5; });
  for (const p of M_.P) { p.vx = p.vz = 0; p.y = 0; p.st = 'free'; p.t = 0; p.ai.mode = ''; p.ai.hold = 0; p.ai.spot = null; p.slowT = 0; p.callT = 0; p.ai.tx = p.x; p.ai.tz = p.z; }
  give(offs[0]); M_.B.assist = null;
  if (!M_.practice) call(first ? 'CHECK UP' : 'CHECK', first ? `${M_.cfg.mode.n} · first to ${M_.cfg.mode.to}` : '', '#fff', 1.2);
}
function give(p) { const B = MT.B; B.state = 'held'; B.holder = p; B.lastTeam = p.team; B.shooter = null; p.dribPh = 0; }
function changePoss(team) { if (MT.off !== team) { MT.off = team; MT.needClear = !MT.practice; MT.clock = 14; for (const p of MT.P) { p.ai.mode = ''; p.ai.hold = 0; } } }
function call(big, small, col, dur) { hudCall(big, small, col, dur); if (MT && MT.net === 'host') netEv({ k: 'c', b: big, s: small || '', c: col || '#fff', d: dur || 1.2 }); }
function addBrav(p, v) {
  if (!p.user || p.bravT > 0 || MT.practice) return;
  let m = 1; if (p.mine) { if (ORIGIN[S.build.origin].k === 'brav') m += 0.2; if (MT.boosts.includes('hype')) m += 0.5; }
  p.brav += v * m;
  if (p.brav >= 1) { p.brav = 1; p.bravT = 20; p.stats.bravs++; call(pick(CALLS.brav), p.b.name + ' gets +8 to everything', '#ffc531', 1.6); sfxM('rank'); burst(p.x, 1.2, p.z, 0xffc531, 18); }
}
function scorePts(p, pts, how) {
  const M_ = MT; M_.score[p.team] += pts; p.stats.pts += pts; p.stats.fgm++; p.hot++; M_.lastScorer = p;
  for (const o of M_.P) if (o.team !== p.team) { o.hot = 0; if (o.fire) { o.fire = false; } }
  if (M_.B.assist && M_.B.assist !== p && M_.time - p.catchT < 5) { M_.B.assist.stats.ast++; addBrav(M_.B.assist, 0.10); floatTxt(M_.B.assist, 'ASSIST', '#ffc531'); }
  if (M_.arcade && p.hot >= 3 && !p.fire) { p.fire = true; p.stats.fires++; call(pick(CALLS.fire), '', '#ff7a1f', 1.6); sfxM('fire'); }
  if (p.mine && cribFx('bucket')) M_.bonusRep = (M_.bonusRep || 0) + 1;
  for (const f of M_.fans) f.hype = 1.6;
  if (M_.hoop.userData.net) M_.netT = 0.35;
  addBrav(p, how === 'dunk' ? 0.16 : 0.10);
  if (M_.practice) return;
  M_.phase = 'scored'; M_.pt = 1.45; p.st = 'celeb'; p.t = 0;
  if (M_.score[p.team] >= M_.cfg.mode.to) { M_.phase = 'over'; M_.pt = 2.6; sfxM('buzz'); call(p.team === 0 ? 'BALL GAME!' : 'GAME OVER', `${M_.score[0]} — ${M_.score[1]}`, p.team === 0 ? '#33ff88' : '#ff4040', 2.5); }
}
function floatTxt(p, txt, col) { hudFloat(p, txt, col); if (MT && MT.net === 'host') netEv({ k: 'f', i: p.i, t: txt, c: col || '#fff' }); }
function burst(x, y, z, col, n) {
  let k = 0; for (const q of MT.parts) { if (q.life > 0) continue; q.life = rnd(0.35, 0.7); q.max = q.life; q.m.position.set(x, y, z); q.v.set(rnd(-2.5, 2.5), rnd(0.5, 4), rnd(-2.5, 2.5)); q.m.material.color.setHex(col); if (++k >= n) break; }
}

// ---------- actions ----------
function shotKind(p) { const d = dHoop(p); return beyondArc(p.x, p.z) ? 'three' : d > 3.2 ? 'mid' : 'close'; }
function contestOn(p, rad) {
  let c = 0; rad = rad || 2.4;
  for (const o of MT.P) {
    if (o.team === p.team || o.st === 'stagger') continue; const d = dist(o, p); if (d > rad) continue;
    let f = (1 - d / rad) * (o.st === 'jump' ? 1 : o.handsUp ? 0.8 : 0.45) * (0.6 + 0.4 * nAtt(o, d > 1.2 ? 'perd' : 'intd')) * (1 + 0.06 * bt(o, 'ground'));
    c = Math.max(c, f);
  }
  return Math.min(0.9, c);
}
function startShot(p, src) {
  if (MT.needClear && MT.off === p.team) { fb(p, 'TAKE IT BACK past the arc!', '#ff8a1f'); return false; }
  const d = dHoop(p);
  if (d < 2.0 || (d < finishRange(p) && Math.hypot(p.vx, p.vz) > 2.2 && (p.vx * -p.x + p.vz * -p.z) > 0 && src !== 'ai')) return startFinish(p);
  const j = JUMPER[p.b.moves.jumper] || JUMPERS[0];
  p.st = 'shoot'; p.t = 0; p.shot = { rel: j.rel * (p.fire ? 0.85 : 1), j, src, released: false, kind: shotKind(p), sp: Math.hypot(p.vx, p.vz), aiRel: 0 };
  if (!p.user) { const sd = 0.17 - p.aiLvl * 0.10; p.shot.aiRel = p.shot.rel * (1 + clamp((Math.random() + Math.random() + Math.random() - 1.5) * sd * 1.6, -0.4, 0.45)); }
  p.face = Math.atan2(-p.x, -p.z); return true;
}
function releaseShot(p) {
  const s = p.shot; if (s.released) return; s.released = true; const B = MT.B;
  const err = ((s.hold != null ? s.hold : p.t) - s.rel) / s.rel, kind = s.kind, d = dHoop(p);
  let c = contestOn(p); if (s.j.id === 'moon') c *= 0.8; c *= (1 - 0.12 * bt(p, 'filibuster'));
  const rating = kind === 'three' ? 'three' : kind === 'mid' ? 'mid' : 'close', n = nAtt(p, rating);
  let base = kind === 'three' ? 0.20 + n * 0.33 : kind === 'mid' ? 0.28 + n * 0.31 : 0.42 + n * 0.30;
  if (d > 7.6) base -= (d - 7.6) * 0.09 * (1 - 0.18 * bt(p, 'manifest'));
  if (c < 0.06) base += 0.03 + 0.025 * bt(p, 'opencarry');
  if (p.stam < 25) base *= 0.85; if (s.sp > 2.8) base *= 0.9;
  if (p.catchFrom && MT.time - p.catchT < 1.6) base += 0.02 * bt(p.catchFrom, 'trickle') + 0.02;
  if (p.fire) base += 0.35; if (kind === 'close') base += 0.03 * bt(p, 'softmoney');
  let w = (0.05 + nAtt(p, 'iq') * 0.05 + 0.012 * bt(p, 'greencard') + s.j.win + (p.mine ? cribFx('green') * 0.1 : 0)) * (0.55 + n * 0.65) * (1 - c * 0.6);
  if (MT.practice) w *= 1.1;
  const e = Math.abs(err); let green = e <= w, prob;
  if (green) prob = c > 0.55 ? 0.8 : 1; else prob = base * Math.max(0.12, 1 - (e - w) / 0.38 * (1.1 - nAtt(p, 'iq') * 0.35)) * (1 - c * 0.75) * (e < w * 2.2 ? 1.12 : 1);
  if (!p.user) green = green && Math.random() < 0.5;
  // blocked?
  for (const o of MT.P) {
    if (o.team === p.team || o.st !== 'jump' || dist(o, p) > 1.45) continue;
    const pb = (0.06 + nAtt(o, 'block') * 0.28 + 0.04 * bt(o, 'nofly')) * (s.j.id === 'quick' ? 0.7 : 1) * (kind === 'three' ? 0.8 : 1);
    if (Math.random() < pb) return blocked(p, o);
  }
  const make = Math.random() < prob; p.stats.fga++;
  const pts = MT.arcade ? (kind === 'three' ? 3 : 2) : (kind === 'three' ? 2 : 1);
  handPos(p.rig, 'R', B.pos); B.pos.y += 0.12;
  launch(p, make, pts, green && make, s.j.arc, kind);
  if (p.user) {
    const lbl = green && make ? 'GREEN' : e < w * 2.2 ? (err < 0 ? 'Slightly early' : 'Slightly late') : err < 0 ? (e > 0.45 ? 'Very early' : 'Early') : (e > 0.45 ? 'Very late' : 'Late');
    fb(p, lbl + (c > 0.06 ? ` · ${Math.round(c * 100)}% contested` : ' · wide open'), green && make ? '#33ff88' : '#fff');
    if (green && make) { p.stats.greens++; sfxM('green'); addBrav(p, 0.05); }
  }
  sfxM('whoosh');
}
function launch(p, make, pts, green, arc, kind) {
  const B = MT.B; B.state = 'shot'; B.holder = null; B.shooter = p; B.lastTeam = p.team; B.make = make; B.pts = pts; B.green = green; B.kind = kind; B.t = 0;
  const d = Math.hypot(B.pos.x, B.pos.z);
  let ex = 0, ez = 0; if (!make) { const a = rnd(0, 6.283), r = rnd(0.2, 0.34); ex = Math.cos(a) * r; ez = Math.sin(a) * r * 0.8 + 0.05; }
  B.T = clamp(0.48 + d * 0.085, 0.42, 1.5) * (0.9 + 0.1 * (arc || 1)) * (arc > 1.3 ? 1.15 : 1);
  B.vel.set((ex - B.pos.x) / B.T, (HOOP_Y + 0.06 - B.pos.y + 0.5 * GRAV * B.T * B.T) / B.T, (ez - B.pos.z) / B.T);
}
function blocked(p, o) {
  const B = MT.B; p.stats.fga++; o.stats.blk++; B.state = 'loose'; B.holder = null; B.shooter = null; B.lastTeam = o.team; B.t = 0; MT.looseT = 0;
  handPos(p.rig, 'R', B.pos); const a = Math.atan2(p.x - o.x, p.z - o.z) + rnd(-0.8, 0.8); B.vel.set(Math.sin(a) * rnd(3, 6), rnd(1, 3), Math.cos(a) * rnd(3, 6));
  call(pick(CALLS.block), o.b.name, '#33e0ff', 1.1); sfxM('block'); addBrav(o, 0.15); MT.slow = 0.25; if (p.st === 'finish') { p.finish.done = true; }
  for (const f of MT.fans) f.hype = 1.2; B.rebound = false;
}
function finishRange(p) { return MT.arcade ? 5.6 : 2.5 + nAtt(p, 'vert') * 0.6 + 0.25 * bt(p, 'gravity'); }
function startFinish(p) {
  if (MT.needClear && MT.off === p.team) { fb(p, 'TAKE IT BACK past the arc!', '#ff8a1f'); return false; }
  const d = dHoop(p), canDunk = (MT.arcade || att(p, 'dunk') >= 55) && d <= finishRange(p) && (MT.arcade || att(p, 'dunk') + att(p, 'vert') * 0.4 > 78 + (2.0 - p.H) * 40 || att(p, 'dunk') >= 75);
  let ax = p.x, az = Math.max(p.z, 0.15); const l = Math.hypot(ax, az) || 1; ax /= l; az /= l;
  const type = canDunk ? 'dunk' : 'layup';
  p.st = 'finish'; p.t = 0;
  p.finish = { type, sx: p.x, sz: p.z, tx: ax * (type === 'dunk' ? 0.42 : 0.75), tz: az * (type === 'dunk' ? 0.42 : 0.75), dur: clamp(0.42 + d * 0.085, 0.45, 1.0), done: false, peak: type === 'dunk' ? Math.max(0.5, 3.22 - p.H * 1.36) + (MT.arcade ? 0.7 : 0) : 0.55 + (MT.arcade ? 0.4 : 0), style: p.b.moves.dunk, spin: (type === 'dunk' && (p.b.moves.dunk === 'three60' || (MT.arcade && d > 3.5))) ? 1 : 0 };
  p.face = Math.atan2(-p.x, -p.z); sfxM('whoosh'); return true;
}
function resolveFinish(p) {
  const f = p.finish, B = MT.B; f.done = true; if (B.holder !== p) return;
  let c = 0;
  for (const o of MT.P) { if (o.team === p.team || o.st === 'stagger') continue; const d = dist(o, p); if (d > 1.9) continue; c = Math.max(c, (1 - d / 1.9) * (0.5 + 0.5 * nAtt(o, 'intd')) * (o.st === 'jump' ? 1 : 0.55)); }
  c *= (1 - 0.13 * bt(p, 'lobby'));
  for (const o of MT.P) {
    if (o.team === p.team || o.st === 'stagger' || dist(o, p) > 1.7) continue;
    let pb = (0.10 + nAtt(o, 'block') * 0.38 + 0.05 * bt(o, 'nofly')) * (f.type === 'dunk' ? 0.6 : 1) * (1 - nAtt(p, 'str') * 0.25); if (o.st !== 'jump') pb *= 0.1;
    if (MT.arcade) pb *= 0.6;
    if (Math.random() < pb) return blocked(p, o);
  }
  const put = p.putT > 0 ? 0.05 * bt(p, 'putback') : 0; p.stats.fga++;
  const pts = MT.arcade ? 2 : 1;
  if (f.type === 'dunk') {
    const ds = DUNK[f.style] || DUNKS[0];
    const prob = 0.74 + nAtt(p, 'dunk') * 0.24 + ds.bonus + 0.04 * bt(p, 'gravity') + put - c * 0.5 + (MT.arcade ? 0.15 : 0) + (p.fire ? 0.3 : 0);
    if (Math.random() < prob) {
      B.state = 'through'; B.holder = null; B.pos.set(0, HOOP_Y - 0.05, 0); B.vel.set(0, -5, 0); B.t = 0; B.scored = true;
      p.stats.dunks++; sfxM('dunk'); MT.shake = 0.45; MT.slow = 0.35; burst(0, 3, 0, 0xffc531, 14);
      call(pick(CALLS.dunk), p.b.name + (ds.rep ? ` · ${ds.n}` : ''), '#ff5a3c', 1.3); if (p.mine) MT.bonusRep = (MT.bonusRep || 0) + ds.rep;
      scorePts(p, pts, 'dunk'); return;
    }
    B.state = 'loose'; B.holder = null; B.pos.set(0, HOOP_Y + 0.2, 0.2); B.vel.set(rnd(-2, 2), rnd(3, 5), rnd(1, 4)); B.rebound = true; B.shooter = p; B.t = 0; sfxM('rim'); fb(p, 'Rim check failed', '#ff8a1f'); p.hot = 0; p.fire = false; return;
  }
  const prob = 0.52 + nAtt(p, 'layup') * 0.38 + 0.03 * bt(p, 'softmoney') + put - c * 0.6 + (p.fire ? 0.3 : 0);
  handPos(p.rig, 'R', B.pos); launch(p, Math.random() < prob, pts, false, 1, 'close'); B.T = 0.32; B.vel.set(-B.pos.x / B.T, (HOOP_Y + 0.06 - B.pos.y + 0.5 * GRAV * B.T * B.T) / B.T, -B.pos.z / B.T);
  if (!B.make) { B.vel.x += rnd(-0.6, 0.6); B.vel.z += rnd(0.2, 0.8); }
}
function startMove(p, slot, dx, dz) {
  if (p.moveCool > 0 || p.stam < 6) return;
  const mv = MOVE[p.b.moves[slot]] || MOVES.find(m => m.slot === slot); const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
  const burstV = mv.burst * (1 + 0.06 * bt(p, 'getaway')) * (0.85 + nAtt(p, 'accel') * 0.3);
  p.st = 'move'; p.t = 0; p.mv = { mv, dx, dz, v: burstV, slot }; p.moveCool = mv.dur + 0.12; p.stam -= mv.st; p.hand = dx > 0.2 ? 'L' : dx < -0.2 ? 'R' : p.hand;
  p.combo = MT.time - p.comboT < 1.4 ? Math.min(3, p.combo + 1) : 0; p.comboT = MT.time; sfxM('whoosh');
  // ankle check on the nearest defender
  let o = null, od = 2.1; for (const q of MT.P) { if (q.team === p.team || q.st !== 'free') continue; const d = dist(q, p); if (d < od) { od = d; o = q; } }
  if (!o) return;
  let ch = 0.05 + (att(p, 'handle') - att(o, 'perd')) * 0.006 + mv.ank + 0.035 * bt(p, 'ankletax') - 0.035 * bt(o, 'ground') + p.combo * 0.035 + (MT.arcade ? 0.08 : 0);
  if (o.vx * dx + o.vz * dz < -1.2) ch += 0.13;
  if (Math.random() < clamp(ch, 0.02, 0.6)) {
    const fall = Math.random() < 0.4 + p.combo * 0.1; o.st = 'stagger'; o.t = 0; o.stg = { dur: fall ? rnd(1.2, 1.6) : rnd(0.6, 0.9), fall };
    p.stats.ankles++; call(pick(CALLS.ankle), `${p.b.name} put ${o.b.name} on skates`, '#ffc531', 1.3); sfxM('ankle'); addBrav(p, 0.2); MT.slow = 0.3; for (const f of MT.fans) f.hype = 1.5;
  } else o.slowT = 0.22 + mv.ank;
}
function doPass(p, to) {
  if (!to || MT.B.holder !== p) return; const B = MT.B;
  p.st = 'pass'; p.t = 0; p.face = Math.atan2(to.x - p.x, to.z - p.z);
  B.state = 'pass'; B.holder = null; B.target = to; B.from = p; B.t = 0; B.tried = {}; B.lastTeam = p.team;
  B.pos.set(p.x + Math.sin(p.face) * 0.4, 1.25 + p.y, p.z + Math.cos(p.face) * 0.4); B.speed = 11 + nAtt(p, 'pass') * 7; sfxM('whoosh');
}
function passTarget(p, mx, mz) {
  const mates = MT.P.filter(o => o.team === p.team && o !== p && o.st !== 'stagger'); if (!mates.length) return null;
  const m = Math.hypot(mx, mz);
  if (m > 0.4) { let best = null, bs = -9; for (const o of mates) { const dx = o.x - p.x, dz = o.z - p.z, l = Math.hypot(dx, dz) || 1; const s = (dx * mx + dz * mz) / (l * m); if (s > bs) { bs = s; best = o; } } return best; }
  let best = null, bs = -9; for (const o of mates) { let od = 9; for (const q of MT.P) if (q.team !== p.team) od = Math.min(od, dist(q, o)); const s = od - dist(o, p) * 0.1; if (s > bs) { bs = s; best = o; } } return best;
}
function startSteal(p) {
  if (p.cool > 0) return; const B = MT.B, h = B.holder;
  if (MT.arcade) {   // shove: anyone close in front
    let o = null, od = 1.35; for (const q of MT.P) { if (q.team === p.team || q.st === 'stagger') continue; const d = dist(q, p); if (d < od) { od = d; o = q; } }
    p.st = 'shove'; p.t = 0; p.cool = 1.3;
    if (o && Math.random() < 0.62 + nAtt(p, 'str') * 0.2 - nAtt(o, 'str') * 0.3) {
      o.st = 'stagger'; o.t = 0; o.stg = { dur: 0.95, fall: true }; sfxM('block'); MT.shake = 0.2;
      if (B.holder === o) { B.state = 'loose'; B.holder = null; B.pos.set(o.x, 1, o.z); B.vel.set(rnd(-3, 3), 3, rnd(-3, 3)); B.t = 0; B.rebound = false; B.lastTeam = p.team; p.stats.stl++; call(pick(CALLS.steal), p.b.name, '#33e0ff', 1); addBrav(p, 0.12); }
    }
    return;
  }
  p.st = 'steal'; p.t = 0; p.cool = 0.9; p.stealDone = false;
}
function resolveSteal(p) {
  p.stealDone = true; const B = MT.B, h = B.holder; if (!h || h.team === p.team || dist(h, p) > 1.5) { p.slowT = 0.25; return; }
  let ch = 0.11 + (att(p, 'steal') - att(h, 'handle')) * 0.0045 + 0.03 * bt(p, 'repo') - 0.04 * bt(h, 'nda') + (h.st === 'move' ? -0.04 : 0) + (h.sprinting ? 0.05 : 0) + (h.st === 'shoot' && h.t < h.shot.rel * 0.4 ? 0.06 : 0);
  if (h.st === 'finish') ch *= 0.3;
  if (Math.random() < clamp(ch, 0.01, 0.45)) {
    p.stats.stl++; if (h.st === 'shoot' || h.st === 'finish') { h.st = 'free'; h.y = 0; } give(p); changePoss(p.team); call(pick(CALLS.steal), p.b.name, '#33e0ff', 1); sfxM('steal'); addBrav(p, 0.15); for (const f of MT.fans) f.hype = 1.2;
  } else { p.slowT = 0.4 - 0.05 * bt(p, 'repo'); p.cool = 1.3; }
}
function startJump(p) { if (p.st !== 'free' || p.y > 0) return; p.st = 'jump'; p.t = 0; p.jumpH = (0.38 + nAtt(p, 'vert') * 0.42) * (MT.arcade ? 1.8 : 1); }

// ---------- human control ----------
function humanThink(p, dt) {
  const I = IN[p.ctrl], B = MT.B; p.in.dx = I.mx; p.in.dz = I.my; p.in.sprint = I.sprint; p.handsUp = false;
  if (MT.phase !== 'live') return;
  const hasBall = B.holder === p;
  if (p.remote) {          // the guest times their own release; the host just takes their word for the hold
    if (I.relEdge) p.pendRel = I.rh;
    if (p.st === 'shoot' && !p.shot.released) { if ((p.pendRel != null && p.t >= Math.min(p.pendRel, p.shot.rel * 1.55)) || p.t > p.shot.rel * 1.55 + 0.6) { p.shot.hold = p.pendRel; p.pendRel = null; releaseShot(p); } return; }
    if (p.st !== 'shoot' && p.pendRel != null && !I.bP && I.flick !== 'D') p.pendRel = null;
  }
  if (p.st === 'shoot' && !p.shot.released) {
    if ((p.shot.src === 'btn' && !I.b) || (p.shot.src === 'stick' && I.rdir !== 'D' && I.rdir !== 'DL' && I.rdir !== 'DR') || p.t > p.shot.rel * 1.55) releaseShot(p);
    return;
  }
  if (p.st !== 'free') return;
  if (hasBall) {
    if (I.bP) { startShot(p, 'btn'); return; }
    if (I.flick === 'D') { startShot(p, 'stick'); return; }
    if (I.flick === 'U') { if (dHoop(p) <= finishRange(p) + 0.6) startFinish(p); else startMove(p, 'diag', 0, -1); return; }
    if (I.flick === 'L' || I.flick === 'R') { startMove(p, 'side', I.flick === 'L' ? -1 : 1, -0.15); return; }
    if (I.flick === 'DL' || I.flick === 'DR') { startMove(p, 'back', I.flick === 'DL' ? -0.55 : 0.55, 1); return; }
    if (I.flick === 'UL' || I.flick === 'UR') { startMove(p, 'diag', I.flick === 'UL' ? -0.8 : 0.8, -0.8); return; }
    if (I.aP) { doPass(p, passTarget(p, I.mx, I.my)); return; }
  } else if (MT.off === p.team && B.state !== 'loose' && B.state !== 'shot') {
    if (I.aP) { p.callT = 1.2; floatTxt(p, 'BALL!', '#fff'); }
    if (I.bP || I.flick === 'U') startJump(p);
  } else {
    if (I.rdir === 'U' || I.rdir === 'UL' || I.rdir === 'UR') p.handsUp = true;
    if (I.bP) startJump(p);
    else if (I.aP || I.flick === 'D') { if (B.state !== 'loose') startSteal(p); }
    else if ((I.flick === 'L' || I.flick === 'R') && p.stam > 8) { p.vx += (I.flick === 'L' ? -1 : 1) * 5; p.stam -= 5; }
  }
}

// ---------- AI ----------
function laneOpen(p) {
  const l = dHoop(p) || 1, ux = -p.x / l, uz = -p.z / l;
  for (const o of MT.P) { if (o.team === p.team || o.st === 'stagger') continue; const rx = o.x - p.x, rz = o.z - p.z, along = rx * ux + rz * uz; if (along < 0.2 || along > l) continue; if (Math.abs(rx * uz - rz * ux) < 1.15) return false; }
  return true;
}
function nearestOpp(p) { let b = null, bd = 99; for (const o of MT.P) { if (o.team === p.team || o.st === 'stagger') continue; const d = dist(o, p); if (d < bd) { bd = d; b = o; } } return [b, bd]; }
function passLane(p, to) {
  const dx = to.x - p.x, dz = to.z - p.z, l = Math.hypot(dx, dz) || 1;
  for (const o of MT.P) { if (o.team === p.team) continue; const rx = o.x - p.x, rz = o.z - p.z, along = (rx * dx + rz * dz) / l; if (along < 0.8 || along > l - 0.3) continue; if (Math.abs(rx * dz - rz * dx) / l < 0.75) return false; }
  return true;
}
function aiGo(p, x, z, sprint) { p.ai.tx = x; p.ai.tz = z; p.ai.spr = !!sprint; }
function aiThink(p, dt) {
  const B = MT.B, a = p.ai, L = p.aiLvl; p.handsUp = false; a.spr = false;
  if (MT.phase !== 'live') { p.in.dx = p.in.dz = 0; return; }
  if (p.st === 'shoot' && !p.shot.released) { if (p.t >= p.shot.aiRel) releaseShot(p); return; }
  if (p.st !== 'free') return;
  a.tick -= dt;
  const hasBall = B.holder === p;
  if (B.state === 'loose' || (B.state === 'shot' && B.t > B.T * 0.5)) {
    // go get it: the two nearest per team chase, others get back
    const tx = B.state === 'shot' ? (B.make ? p.x : 0 + B.vel.x * 0.3) : B.pos.x, tz = B.state === 'shot' ? (B.make ? p.z : 1.2) : B.pos.z;
    const mates = MT.P.filter(o => o.team === p.team).sort((m, n) => Math.hypot(m.x - tx, m.z - tz) - Math.hypot(n.x - tx, n.z - tz));
    if (mates.indexOf(p) < 2 || MT.cfg.mode.size === 2) {
      aiGo(p, tx, tz, true);
      if (B.state === 'loose' && Math.hypot(p.x - B.pos.x, p.z - B.pos.z) < 1.1 && B.pos.y > p.H * 1.3 && B.vel.y < 1 && Math.random() < 0.1 + L * 0.2) startJump(p);
    }
  } else if (hasBall) {
    a.hold += dt;
    if (a.tick <= 0) {
      a.tick = 0.34 - L * 0.16 + rnd(0, 0.08);
      const d = dHoop(p), [o, od] = nearestOpp(p), open = od > 1.7, style = p.b.build.style;
      const mates = MT.P.filter(q => q.team === p.team && q !== p && q.st === 'free');
      const tryPass = (pred) => { const c = mates.filter(q => passLane(p, q) && (!pred || pred(q))); if (!c.length) return false; c.sort((m, n) => nearestOpp(n)[1] - nearestOpp(m)[1]); doPass(p, c[0]); return true; };
      if (MT.needClear) {
        if (beyondArc(p.x, p.z)) { /* cleared next frame */ }
        else { const l = d || 1; aiGo(p, p.x / l * 8.0 + (p.x === 0 ? 0.1 : 0), Math.max(p.z / l * 8.0, 4.5), true); if (Math.random() < 0.35 && tryPass(q => beyondArc(q.x, q.z))) return; }
      } else {
        const caller = mates.find(q => q.callT > 0);
        if (caller && passLane(p, caller) && Math.random() < 0.9) { doPass(p, caller); return; }
        const fr = MT.arcade ? Math.min(finishRange(p), 3.2 + L * 2) : finishRange(p);
        if (d < Math.max(2.4, fr * 0.92) && (laneOpen(p) || d < 2.3 || a.hold > 4)) { startFinish(p); return; }
        if (MT.clock < 2.5) { startShot(p, 'ai'); return; }
        const three = nAtt(p, 'three'), mid = nAtt(p, 'mid');
        const sel = (p.fire ? 2 : 1) * (1 + a.hold * 0.35) * (MT.clock < 6 ? 2 : 1);
        if (beyondArc(p.x, p.z) && d < 8.3 && Math.random() < (open ? 0.45 : 0.05) * (0.25 + three) * sel) { startShot(p, 'ai'); return; }
        if (!beyondArc(p.x, p.z) && d > 2.8 && Math.random() < (open ? 0.42 : 0.07) * (0.25 + mid) * sel) { startShot(p, 'ai'); return; }
        // feed an open human sometimes; nobody likes an AI ball hog
        const hum = mates.find(q => q.user);
        if (hum && nearestOpp(hum)[1] > 1.6 && passLane(p, hum) && Math.random() < 0.22 + a.hold * 0.1) { doPass(p, hum); return; }
        const driveBias = { slasher: 0.75, showman: 0.6, general: 0.5, glass: 0.6, lockdown: 0.45, sniper: 0.25 }[style] || 0.5;
        if (laneOpen(p) && Math.random() < driveBias + 0.2) { a.mode = 'drive'; aiGo(p, 0, 0.6, true); }
        else {
          const r = Math.random();
          if (r < 0.2 + L * 0.2 && o && od < 2.2 && p.stam > 20) { const side = (o.x - p.x) > 0 ? -1 : 1; const r2 = Math.random(); if (r2 < 0.6) startMove(p, 'side', side, -0.2); else if (r2 < 0.8) startMove(p, 'back', side * 0.5, 1); else startMove(p, 'diag', side * 0.8, -0.8); a.tick = 0.15; return; }
          if (r < 0.55 + a.hold * 0.08 && tryPass(q => nearestOpp(q)[1] > 1.3)) return;
          // probe: drift to a wing or the elbow
          a.mode = ''; const sp = pick(SPOTS.slice(2, 8)); aiGo(p, sp[0] * 0.8, sp[1], false);
        }
      }
    }
    if (a.mode === 'drive') { aiGo(p, 0, 0.6, true); if (dHoop(p) < 2.2) { a.mode = ''; startFinish(p); return; } }
  } else if (MT.off === p.team) {
    // off-ball offence: spacing and the odd cut
    a.spotT -= dt;
    if (!a.spot || a.spotT <= 0) {
      a.spotT = rnd(2.2, 4.5); const st = p.b.build.style; let cands = SPOTS.filter((s, i) => (st === 'glass' ? i >= 5 || Math.random() < 0.3 : i < 5 || Math.random() < 0.3));
      cands = cands.filter(s => MT.P.every(q => q === p || q.team !== p.team || (Math.hypot(q.x - s[0], q.z - s[1]) > 3 && (!q.ai.spot || q.ai.spot !== s))));
      a.spot = cands.length ? pick(cands) : pick(SPOTS); if (Math.random() < 0.14) { a.spot = [rnd(-1, 1), 1.4]; a.spotT = 1.3; }
    }
    aiGo(p, a.spot[0], a.spot[1], Math.hypot(a.spot[0] - p.x, a.spot[1] - p.z) > 3);
  } else {
    // defence
    const h = B.holder, m = p.man; if (!m) return;
    const onBall = h === m;
    const rate = 3.5 + L * 6 + nAtt(p, 'perd') * 5; a.mx += (m.x - a.mx) * Math.min(1, rate * dt); a.mz += (m.z - a.mz) * Math.min(1, rate * dt);
    const md = Math.hypot(a.mx, a.mz) || 1; let gap = onBall ? (beyondArc(m.x, m.z) ? 1.25 - L * 0.25 : 0.95) : 1.9;
    let tx = a.mx - a.mx / md * gap, tz = a.mz - a.mz / md * gap;
    if (!onBall && h) { tx += (h.x - tx) * 0.22; tz += (h.z - tz) * 0.22; }
    // help at the rim
    if (h && h !== m && h.team !== p.team && dHoop(h) < 3.6 && dHoop(p) < 4.5 && L > 0.4) { tx = h.x * 0.5; tz = h.z * 0.5; }
    aiGo(p, tx, tz, Math.hypot(tx - p.x, tz - p.z) > 2.2);
    if (h && h.team !== p.team) {
      const dh = dist(h, p);
      if (dh < 2.3) p.handsUp = h.st === 'shoot' || (onBall && dHoop(h) < 7.5 && Math.random() < 0.9);
      if ((h.st === 'shoot' && !h.shot.released && h.t > h.shot.rel * (0.75 - L * 0.3) && dh < 1.7) || (h.st === 'finish' && !h.finish.done && h.t > h.finish.dur * 0.3 && dh < 2.0)) {
        if (a.react <= 0) { a.react = 0.8; if (Math.random() < 0.3 + L * 0.5) startJump(p); }
      }
      if (onBall && dh < 1.5 && p.cool <= 0 && h.st === 'free' && Math.random() < (0.25 + L * 0.35) * dt * (0.5 + nAtt(p, 'steal'))) startSteal(p);
    }
    a.react -= dt;
  }
  const dx = a.tx - p.x, dz = a.tz - p.z, l = Math.hypot(dx, dz);
  if (l > 0.25) { const s = Math.min(1, l / 0.8); p.in.dx = dx / l * s; p.in.dz = dz / l * s; } else { p.in.dx = p.in.dz = 0; }
  p.in.sprint = a.spr && l > 1.2;
}

// ---------- step ----------
function matchStep(dtReal) {
  const M_ = MT; if (!M_ || (M_.paused && !M_.net)) return;
  if (M_.net === 'guest') return netGuestStep(dtReal);
  let dt = dtReal; if (M_.slow > 0) { M_.slow -= dtReal; dt *= 0.35; }
  M_.time += dt; const B = M_.B;
  // phases
  if (M_.phase === 'check') { M_.pt -= dt; if (M_.pt <= 0) { M_.phase = 'live'; sfxM('whistle'); } }
  else if (M_.phase === 'scored') { M_.pt -= dt; if (M_.pt <= 0) setCheck(1 - M_.lastScorer.team); }
  else if (M_.phase === 'over') { M_.pt -= dt; if (M_.pt <= 0 && !M_.over) { M_.over = true; endMatch(); return; } }
  else if (M_.phase === 'live' && !M_.practice) {
    if (B.state === 'held') { M_.clock -= dt; if (M_.clock <= 0) { sfxM('buzz'); call('SHOT CLOCK', 'Attention span expired', '#ff4040', 1.2); M_.viol = (M_.viol || 0) + 1; const t = 1 - M_.off; M_.lastScorer = { team: M_.off }; M_.phase = 'scored'; M_.pt = 1.2; void t; } }
    if (M_.needClear && B.holder && beyondArc(B.holder.x, B.holder.z)) { M_.needClear = false; }
  }
  if (M_.practice === 'rack' && !M_.over) { M_.rackT -= dt; if (M_.rackT <= 0) { M_.over = true; sfxM('buzz'); endMatch(); return; } }

  for (const p of M_.P) {
    p.in = p.in || { dx: 0, dz: 0, sprint: false }; p.t += dt; p.cool -= dt; p.moveCool -= dt; p.slowT -= dt; p.callT -= dt; p.putT -= dt;
    if (p.bravT > 0) { p.bravT -= dt; p.brav = Math.max(0, p.bravT / 20); if (p.bravT <= 0) p.brav = 0; }
    if (p.user) humanThink(p, dt); else aiThink(p, dt);
    stepPlayer(p, dt);
  }
  // body collisions
  for (let i = 0; i < M_.P.length; i++) for (let j = i + 1; j < M_.P.length; j++) {
    const a = M_.P[i], b = M_.P[j]; if (a.y > 0.5 || b.y > 0.5) continue; const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), R = 0.56;
    if (d < R && d > 0.001) { const push = (R - d) / 2, wa = a.st === 'stagger' ? 0.2 : 1, wb = b.st === 'stagger' ? 0.2 : 1, sa = 0.5 + nAtt(b, 'str') * 0.5, sb = 0.5 + nAtt(a, 'str') * 0.5, tot = sa * wa + sb * wb || 1; a.x -= dx / d * push * 2 * sa * wa / tot; a.z -= dz / d * push * 2 * sa * wa / tot; b.x += dx / d * push * 2 * sb * wb / tot; b.z += dz / d * push * 2 * sb * wb / tot; }
  }
  stepBall(dt);
  for (const p of M_.P) animPlayer(p, dt);
  matchFx(dt); matchCam(dtReal); hudMatch(); if (M_.net === 'host') netHostStep(dtReal);
}
function matchFx(dt) {
  const M_ = MT;
  for (const q of M_.parts) { if (q.life <= 0) continue; q.life -= dt; q.v.y -= 6 * dt; q.m.position.addScaledVector(q.v, dt); q.m.material.opacity = Math.max(0, q.life / q.max); q.m.scale.setScalar(0.5 + q.life / q.max); if (q.life <= 0) q.m.position.y = -5; }
  for (const f of M_.fans) { f.hype -= dt; applyPose(f.r, poseOf(f.hype > 0 ? 'cheer' : 'idle', M_.time, { ph: f.ph }), dt); }
  if (M_.netT > 0) { M_.netT -= dt; const n = M_.hoop.userData.net; if (n) n.scale.set(1 - M_.netT, 1 + M_.netT * 1.5, 1 - M_.netT); }
}
function stepPlayer(p, dt) {
  const M_ = MT, B = M_.B, hasBall = B.holder === p; let lock = 1;
  switch (p.st) {
    case 'shoot': {
      lock = 0.12; const s = p.shot, j0 = s.rel * 0.42, air = 0.56; const u = (p.t - j0) / air; p.y = u > 0 && u < 1 ? (0.32 + nAtt(p, 'vert') * 0.2) * Math.sin(Math.PI * u) * (M_.arcade ? 1.4 : 1) : 0;
      if (s.released && u >= 1 && p.t > s.rel + 0.2) { p.st = 'free'; p.y = 0; }
      break;
    }
    case 'finish': {
      const f = p.finish, u = p.t / f.dur; lock = 0;
      const e = Math.min(1, u / 0.8); p.x = lerp(f.sx, f.tx, e); p.z = lerp(f.sz, f.tz, e); p.vx = p.vz = 0;
      p.y = u < 0.75 ? f.peak * Math.sin(u / 0.75 * Math.PI / 2) : Math.max(0, f.peak * (1 - Math.pow((u - 0.75) / 0.4, 2)));
      if (u >= 0.75 && !f.done) resolveFinish(p);
      if (u >= 1.15) { p.st = 'free'; p.y = 0; p.rig.extraYaw = 0; }
      break;
    }
    case 'move': { const m = p.mv, u = p.t / m.mv.dur; lock = 0; const k = m.v * (1 - u * 0.6); p.vx = m.dx * k; p.vz = m.dz * k; if (u >= 1) { p.st = 'free'; p.rig.extraYaw = 0; } break; }
    case 'stagger': lock = 0; p.vx *= 0.9; p.vz *= 0.9; if (p.t >= p.stg.dur) p.st = 'free'; break;
    case 'jump': { lock = 0.35; const u = p.t / 0.62; p.y = p.jumpH * Math.sin(Math.PI * Math.min(1, u)); if (u >= 1) { p.st = 'free'; p.y = 0; } break; }
    case 'steal': lock = 0.4; if (p.t > 0.13 && !p.stealDone) resolveSteal(p); if (p.t > 0.4) p.st = 'free'; break;
    case 'shove': lock = 0.3; if (p.t > 0.35) p.st = 'free'; break;
    case 'pass': lock = 0.5; if (p.t > 0.22) p.st = 'free'; break;
    case 'celeb': lock = 0; p.vx *= 0.85; p.vz *= 0.85; if (M_.phase === 'live') p.st = 'free'; break;
  }
  if (M_.phase !== 'live' && M_.phase !== 'check') lock = Math.min(lock, p.st === 'celeb' ? 0 : 0.5);
  if (M_.phase === 'check') lock = 0;
  // locomotion
  let top = (3.3 + nAtt(p, 'speed') * 2.5) * (M_.arcade ? 1.15 : 1);
  if (hasBall) top *= 0.80 + 0.17 * nAtt(p, 'swb');
  const want = Math.hypot(p.in.dx, p.in.dz), canSprint = p.in.sprint && (p.stam > 4 || p.fire) && want > 0.5;
  p.sprinting = canSprint && lock > 0.9;
  if (p.sprinting) { top *= 1.28; if (!p.fire) p.stam -= (hasBall ? 10 : 8) * dt * (1.3 - nAtt(p, 'stam') * 0.5); } else p.stam = Math.min(100, p.stam + (6 + nAtt(p, 'stam') * 7) * dt);
  if (p.stam < 20) top *= 0.86; if (p.slowT > 0) top *= 0.45;
  const def = M_.off !== p.team && !hasBall && B.state !== 'loose'; if (def && !p.sprinting) top *= 0.92;
  if (lock > 0) {
    const acc = (11 + nAtt(p, 'accel') * 15) * dt, tvx = p.in.dx * top * lock, tvz = p.in.dz * top * lock;
    const ddx = tvx - p.vx, ddz = tvz - p.vz, dl = Math.hypot(ddx, ddz); if (dl <= acc || dl === 0) { p.vx = tvx; p.vz = tvz; } else { p.vx += ddx / dl * acc; p.vz += ddz / dl * acc; }
  }
  p.x = clamp(p.x + p.vx * dt, -7.8, 7.8); p.z = clamp(p.z + p.vz * dt, -1.35, 12.8);
  // don't run through the pole / backboard zone
  if (p.z < -0.5 && Math.abs(p.x) < 0.5 && p.st !== 'finish') p.z = -0.5;
  // facing
  const sp = Math.hypot(p.vx, p.vz); let tf = p.face;
  if (p.st === 'shoot' || p.st === 'finish') tf = Math.atan2(-p.x, -p.z);
  else if (p.st === 'celeb') tf = 0;
  else if (def && B.holder) { const m = p.user ? B.holder : (p.man || B.holder); const tgt = dist(p, B.holder) < 4 ? B.holder : m; tf = Math.atan2(tgt.x - p.x, tgt.z - p.z); }
  else if (hasBall && !p.sprinting && p.st === 'free') { const hf = Math.atan2(-p.x, -p.z); tf = sp > 1.5 ? lerpAng(Math.atan2(p.vx, p.vz), hf, 0.45) : hf; }
  else if (sp > 0.6) tf = Math.atan2(p.vx, p.vz);
  else if (B.holder && B.holder !== p) tf = Math.atan2(B.holder.x - p.x, B.holder.z - p.z);
  p.face = lerpAng(p.face, tf, 1 - Math.exp(-12 * dt));
  p.def = def; p.speed = sp; p.topSpeed = top;
}
function lerpAng(a, b, t) { let d = b - a; while (d > Math.PI) d -= 6.2832; while (d < -Math.PI) d += 6.2832; return a + d * t; }

function stepBall(dt) {
  const M_ = MT, B = M_.B; B.t += dt;
  if (B.state === 'held') {
    ballHeld(B.holder, dt);
  } else if (B.state === 'shot') {
    B.vel.y -= GRAV * dt; B.pos.addScaledVector(B.vel, dt); B.spin -= dt * 9;
    if (B.shooter && B.shooter.fire && Math.random() < 0.6) burst(B.pos.x, B.pos.y, B.pos.z, 0xff7a1f, 1);
    if (B.t >= B.T) {
      const p = B.shooter;
      if (B.make) {
        B.state = 'through'; B.t = 0; B.pos.set(0, HOOP_Y, 0); B.vel.set(0, -4.5, 0); sfxM(B.green ? 'green' : 'swish');
        if (B.kind === 'three') p.stats.threes++;
        if (M_.practice === 'rack') { if (B.kind === 'three') { const v = B.green ? 3 : 2; M_.rackScore += v; floatTxt(p, '+' + v, B.green ? '#33ff88' : '#ffc531'); } else floatTxt(p, 'Deep balls only!', '#ff8a1f'); }
        else if (!M_.practice) call(B.green ? pick(CALLS.green) : B.kind === 'three' ? pick(CALLS.three) : pick(CALLS.make), p.b.name + ` +${B.pts}`, B.green ? '#33ff88' : '#fff', 1.1);
        else floatTxt(p, B.green ? 'GREEN' : 'Bucket', B.green ? '#33ff88' : '#fff');
        scorePts(p, B.pts, 'shot');
      } else {
        B.state = 'loose'; B.t = 0; M_.looseT = 0; B.rebound = true; sfxM('rim'); const a = rnd(-1.3, 1.3); const s = rnd(1.5, 4.2); B.vel.set(Math.sin(a) * s, rnd(2, 4.5), Math.abs(Math.cos(a)) * s * 0.9 + 0.3); p.hot = 0; if (p.fire) p.fire = false; M_.clock = Math.max(M_.clock, 14);
        if (M_.practice) floatTxt(p, pick(CALLS.miss), '#ff8a1f');
      }
    }
  } else if (B.state === 'through') {
    B.vel.y -= GRAV * dt; B.pos.addScaledVector(B.vel, dt); if (B.pos.y < 0.125) { B.pos.y = 0.125; B.vel.y *= -0.5; B.vel.x = rnd(-0.5, 0.5); B.vel.z = rnd(0.3, 1); if (Math.abs(B.vel.y) > 1) sfxM('bounce'); }
    if (M_.practice && B.t > 0.45) give(M_.me);
  } else if (B.state === 'pass') {
    const to = B.target; _v.set(to.x, 1.2 + to.y, to.z).sub(B.pos); const l = _v.length(), stepL = B.speed * dt;
    if (l <= Math.max(0.45, stepL)) { give(to); to.catchT = M_.time; to.catchFrom = B.from; B.assist = B.from; if (to.st === 'free') to.ai.tick = 0.25; }
    else {
      B.pos.addScaledVector(_v, stepL / l);
      if (B.t * B.speed > 1.3) for (const o of M_.P) {
        if (o.team === B.from.team || B.tried[o.i] || (o.st !== 'free' && o.st !== 'steal') || Math.hypot(o.x - B.pos.x, o.z - B.pos.z) > 0.8) continue; B.tried[o.i] = 1;
        const ch = 0.08 + nAtt(o, 'steal') * 0.42 - nAtt(B.from, 'pass') * 0.36 + 0.03 * bt(o, 'repo') + (o.user ? 0.12 : 0);
        if (Math.random() < clamp(ch, 0.02, 0.6)) { o.stats.stl++; give(o); changePoss(o.team); call(pick(CALLS.steal), o.b.name + ' jumped the lane', '#33e0ff', 1); sfxM('steal'); addBrav(o, 0.15); break; }
      }
    }
  } else if (B.state === 'loose') {
    M_.looseT += dt; B.vel.y -= GRAV * dt; B.pos.addScaledVector(B.vel, dt); B.spin += dt * 5;
    if (B.pos.y < 0.125) { B.pos.y = 0.125; if (Math.abs(B.vel.y) > 1.2) sfxM('bounce'); B.vel.y *= -0.62; B.vel.x *= 0.8; B.vel.z *= 0.8; }
    if (B.pos.x < -8.3 || B.pos.x > 8.3) { B.vel.x *= -0.6; B.pos.x = clamp(B.pos.x, -8.3, 8.3); } if (B.pos.z < -2.3 || B.pos.z > 13.3) { B.vel.z *= -0.6; B.pos.z = clamp(B.pos.z, -2.3, 13.3); }
    if (B.t > 0.18) {
      let best = null, bs = -9;
      for (const p of M_.P) {
        if (p.st !== 'free' && p.st !== 'jump') continue; const reach = p.H * 1.3 + p.y + 0.12 + 0.06 * bt(p, 'eminent');
        if (Math.hypot(p.x - B.pos.x, p.z - B.pos.z) > 0.8 + 0.05 * bt(p, 'eminent') || B.pos.y > reach) continue;
        const s = nAtt(p, 'reb') + Math.random() * 0.5 + (p.st === 'jump' ? 0.3 : 0) + p.H * 0.2; if (s > bs) { bs = s; best = p; }
      }
      if (!best && M_.looseT > 6) best = M_.P.slice().sort((a, b) => Math.hypot(a.x - B.pos.x, a.z - B.pos.z) - Math.hypot(b.x - B.pos.x, b.z - B.pos.z))[0];
      if (best) {
        const wasOff = M_.off === best.team;
        if (B.rebound) { best.stats.reb++; addBrav(best, 0.05); if (best.user) floatTxt(best, wasOff ? 'OFFENSIVE BOARD' : 'BOARD', '#fff'); if (wasOff) { best.putT = 2; M_.clock = 14; } }
        give(best); changePoss(best.team); B.rebound = false; B.assist = null; best.ai.hold = 0; best.ai.tick = 0.3;
        if (M_.practice) M_.needClear = false;
      }
    }
    if (M_.practice && M_.looseT > 1.1) { give(M_.me); }
  }
  if (M_.practice === 'rack' && (B.state === 'shot' || B.state === 'through') && B.t > 0.3 && M_.me.st === 'free' && !M_.rackBall) { /* a second ball appears in hand so the rack keeps moving */ }
  B.mesh.position.copy(B.pos); B.mesh.rotation.x = B.spin; B.shadow.position.set(B.pos.x, 0.016, B.pos.z); B.shadow.scale.setScalar(clamp(1.3 - B.pos.y * 0.15, 0.4, 1.3));
}

function ballHeld(p, dt) {
  const M_ = MT, B = M_.B;
  if (p.st === 'shoot' || p.st === 'finish') { handPos(p.rig, 'R', B.pos); B.pos.y += 0.1; if (p.st === 'shoot' && p.t < p.shot.rel * 0.5) { handPos(p.rig, 'L', _v); B.pos.lerp(_v, 0.5); } }
  else {
    const rate = p.st === 'move' ? 15 : 7 + p.speed * 0.9; const prev = Math.sin(p.dribPh); p.dribPh += dt * rate; const cur = Math.sin(p.dribPh);
    if ((prev > 0) !== (cur > 0) && M_.phase === 'live') { if (!M_.bounceMute) sfxM('bounce'); }
    const hgt = Math.abs(cur), side = p.hand === 'R' ? -1 : 1, low = p.st === 'move' ? 0.5 : 0.8;
    const fx = Math.sin(p.face), fz = Math.cos(p.face), rx = fz, rz = -fx;   // right of facing = -x when facing +z → (cos, -sin)·side
    B.pos.set(p.x + fx * 0.3 - rx * side * -0.27, 0.125 + hgt * p.H * 0.47 * low + p.y, p.z + fz * 0.3 - rz * side * -0.27);
    p.dribH = hgt;
  }
  B.spin += dt * 6;
}
function animPlayer(p, dt) {
  const M_ = MT, B = M_.B, R = p.rig, hasBall = B.holder === p; let an = 'idle', o = { leg: R.legLen };
  p.runPh += dt * (4 + p.speed * 2.1);
  const spN = clamp(p.speed / 6.5, 0, 1);
  switch (p.st) {
    case 'shoot': an = 'shoot'; o.rel = p.shot.rel; o.kick = p.shot.j.id === 'lawsuit'; break;
    case 'finish': { const f = p.finish; an = f.type; o.u = p.t / f.dur; o.style = f.style; if (f.spin) R.extraYaw = Math.min(1, o.u / 0.75) * Math.PI * 2; break; }
    case 'move': an = 'move'; o.side = p.mv.dx; if (p.mv.slot === 'diag') R.extraYaw = Math.min(1, p.t / p.mv.mv.dur) * Math.PI * 2 * (p.mv.dx > 0 ? -1 : 1); break;
    case 'stagger': an = 'stagger'; o.fall = p.stg.fall; break;
    case 'jump': an = 'jump'; break; case 'steal': an = 'steal'; break; case 'shove': an = 'shove'; break; case 'pass': an = 'pass'; break;
    case 'celeb': an = 'celeb'; o.style = p.b.moves.celeb; break;
    default:
      if (hasBall) { an = 'dribble'; o.sp = spN; o.ph = p.runPh; o.dr = p.dribH || 0; o.hand = p.hand; }
      else if (p.def && M_.phase === 'live') { an = 'slide'; o.ph = p.runPh; o.up = p.handsUp; if (p.sprinting) { an = 'run'; o.sp = spN; } }
      else if (p.speed > 0.4) { an = 'run'; o.sp = spN; o.ph = p.runPh; }
      else if (B.state === 'pass' && B.target === p) an = 'catch';
  }
  const t = an === 'idle' || an === 'celeb' ? M_.time : p.t;
  applyPose(R, poseOf(an, t, o), dt);
  R.root.position.set(p.x, p.y, p.z); R.root.rotation.y = p.face + (R.extraYaw || 0);
  R.shadow.position.y = 0.015 - p.y; R.shadow.scale.setScalar(clamp(1 - p.y * 0.25, 0.4, 1)); p.ring.position.y = 0.02 - p.y;
  R.capeSwing = lerp(R.capeSwing || 0, spN * 0.9 + (p.y > 0.2 ? 0.5 : 0), 0.1);
  if (p.arrow) { p.arrow.position.y = p.H + 0.42 + Math.sin(M_.time * 5) * 0.04; p.arrow.rotation.y += dt * 3; }
  // ring colours: your matchup glows when you are on defence
  if (!p.user) { const marked = M_.me && M_.me.def && M_.me.man === p && M_.phase === 'live'; p.ring.material.color.setHex(marked ? 0xff4fd8 : p.team === M_.me.team ? 0x33a0ff : 0xff4040); p.ring.scale.setScalar(marked ? 1.25 : 1); }
  if (p.bravT > 0 || p.fire) { if (Math.random() < 0.35) burst(p.x + rnd(-0.3, 0.3), rnd(0.2, 1.8) + p.y, p.z + rnd(-0.3, 0.3), p.fire ? 0xff7a1f : 0xffc531, 1); }
  if (p.sprinting && p.speed > 4 && Math.sin(p.runPh) * Math.sin(p.runPh - dt * 12) < 0 && p.user) sfxM('step');
}

function matchCam(dt) {
  const M_ = MT, hs = M_.locals.length ? M_.locals : [M_.me || M_.P[0]]; let fx = 0, fz = 0; for (const h of hs) { fx += h.x; fz += h.z; } fx /= hs.length; fz /= hs.length;
  const portrait = innerWidth < innerHeight, B = M_.B;
  // lean the frame toward the ball so passes and boards stay on screen
  fx = lerp(fx, B.pos.x, 0.25); fz = lerp(fz, B.pos.z, 0.2);
  const back = portrait ? 8.6 : 7.4, up = portrait ? 4.9 : 4.3;
  _v.set(fx * 0.62, up + fz * 0.1, fz + back + (hs.length > 1 ? 2 : 0));
  camera.position.lerp(_v, 1 - Math.exp(-4 * dt));
  if (M_.shake > 0) { M_.shake -= dt; camera.position.x += rnd(-1, 1) * M_.shake * 0.25; camera.position.y += rnd(-1, 1) * M_.shake * 0.25; }
  _v2.set(fx * 0.5, portrait ? 0.2 : 1.5, fz * (portrait ? 0.7 : 0.45) - (portrait ? 0 : 1.2)); M_.look = (M_.look || _v2.clone()); M_.look.lerp(_v2, 1 - Math.exp(-5 * dt)); camera.lookAt(M_.look);
}

function endMatch() {
  const M_ = MT, me = M_.me, cfg = M_.cfg;
  hudShow(false);
  const res = { practice: M_.practice, rack: M_.rackScore, win: M_.score[0] > M_.score[1], score: M_.score.slice(), stats: me.stats, mode: cfg.mode, tier: cfg.tier, bonusRep: M_.bonusRep || 0, shutout: M_.score[1] === 0 && M_.score[0] > 0, box: M_.P.map(p => ({ n: p.b.name, team: p.team, user: p.user, s: p.stats })) };
  netHostEnd(res); MT = null; cfg.onEnd(res);
}
function quitMatch() { if (!MT) return; const cfg = MT.cfg, pr = MT.practice; hudShow(false); if (MT.net) netLeave(NET.game); MT = null; cfg.onEnd(pr ? { practice: pr, quit: true, rack: 0 } : { quit: true }); }
