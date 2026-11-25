// GOT NEXT — the basketball: half-court park games, Street rules and RUCKUS (arcade) rules
'use strict';
let MT = null;
const ARC = 6.75, GRAV = 9.8, HOOP_Y = 3.05;
const SPOTS = [[-6.9, 0.7], [6.9, 0.7], [-5.6, 5.3], [5.6, 5.3], [0, 7.7], [-2.7, 1.3], [2.7, 1.3], [0, 4.8]];
const nAtt = (p, id) => clamp((att(p, id) - 25) / 74, 0, 1.15);
function att(p, id) { return p.A[id] + (p.bravT > 0 ? 8 : 0) + (p.puA ? (p.puA[id] || 0) : 0); }
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
    for (const k in A) A[k] += cribFx('a_' + k);           /* crib sets and levels */
    for (const id of MT ? MT.boosts : []) { const bo = BOOSTS.find(x => x.id === id); if (bo && bo.buff) for (const k in bo.buff) A[k] += bo.buff[k]; }
  }
  return A;
}

// in an online game the host's sounds, calls and floats are echoed to the guest
function sfxM(n) { sfx(n); if (MT && MT.net === 'host' && n !== 'bounce' && n !== 'step' && n !== 'whoosh' && n !== 'whistle') netEv({ k: 's', s2: n }); }
function fb(p, txt, col) { if (p.remote) netEv({ k: 'fb', t: txt, c: col, to: p.peer }); else if (p.user) hudFb(txt, col); }
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
  MT.hoop = dressCourt(scene, cfg, style);      /* courts.js: tier-painted park courts, the RUCKUS arcade, power-ups */
  addFence(scene, -8.6, 8.6, -2.6, 13.6, 4.2, arcade ? 0xff8ff0 : 0xffffff);
  skyline(scene, 34, 60, arcade ? ['#ff4fd8', '#33e0ff', '#ffc531'] : ['#ffc531', '#ffe9a8', '#33e0ff'], 30);
  billboard(scene, ADS[(MT.cfg.seed || 0) % ADS.length], -13, 7, -6, 0.5, 9, 5);
  billboard(scene, ADS[((MT.cfg.seed || 0) + 3) % ADS.length], 13, 7.5, -7, -0.5, 9, 5);
  billboard(scene, arcade ? 'RUCKUS\nNO RULES\nNO REFUNDS' : (cfg.practice ? (cfg.practice === 'drill' ? (cfg.court === 'street' ? 'THE BLOCK\nPRACTICE' : 'HOME COURT\nPRACTICE') : cfg.practice === 'rack' ? 'MONEY RACK' : 'HOME COURT') : (cfg.mode.id === '1v1' ? 'THE LADDER\nONES' : 'THE CAGES\n' + cfg.tier.n)), 0, 9.5, -9, 0, 12, 4.5, arcade ? '#ff4fd8' : '#ffc531');
  // spectators behind the baseline fence
  MT.fans = [];
  // atmosphere: four light poles over the court, light pooled on the ground, the day's weather, paper in the wind
  ambInit();
  for (const [lx, lz] of [[-9.4, -2.2], [9.4, -2.2], [-9.4, 13], [9.4, 13]]) {
    M(cyl(0.1, 0.13, 8.5, 6), toon('#2a2c33'), lx, 4.25, lz, scene); const hx = lx * 0.93, hz = lz < 0 ? lz + 0.3 : lz - 0.3; M(box(1.2, 0.4, 0.5), toon('#2a2c33'), hx, 8.6, hz, scene);
    glow(hx, 8.45, hz, arcade ? 0xffb8f0 : 0xfff2dc, 4, null, 0.85); beam(hx, 8.4, hz, lx * 0.45, 0, lz < 0 ? 2 : 8, arcade ? 0xffb8f0 : 0xfff2c8, 3.2, 0.05, 8); pool(lx * 0.5, lz < 0 ? 1.5 : 9, arcade ? 0xff8ff0 : 0xffe9c0, 7, 7, 0.16);
  }
  if (style === 'street' || style === 'arcade') { weather(); litter(6, -8, 8, -1, 12); skyLife(60, arcade ? 'RUCKUS · NO RULES · NO REFUNDS' : 'BASKETBALL 2146 · PRE-ORDER YOUR KNEES'); }
  if (!cfg.practice) crowdInit();      /* courts.js: people along the baseline and both sidelines */
  // --- players ---
  cfg.teams.forEach((team, ti) => team.forEach((sp, k) => {
    const mine = sp.mine === true;
    const p = { i: MT.P.length, team: ti, k, ctrl: sp.ctrl, user: sp.ctrl >= 0, remote: sp.ctrl >= 2, peer: sp.peer || null, mine, b: sp.b, x: 0, z: 0, y: 0, vx: 0, vz: 0, face: Math.PI, st: 'free', t: 0, stam: 100, runPh: 0, dribPh: 0, hand: 'R', hot: 0, fire: false, brav: mine ? cribFx('brav') : 0, bravT: 0, slowT: 0, cool: 0, moveCool: 0, combo: 0, comboT: 0, catchT: -9, catchFrom: null, putT: 0, callT: 0, handsUp: false, sprinting: false,
      stats: { fouls: 0, pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, ankles: 0, greens: 0, dunks: 0, threes: 0, fga: 0, fgm: 0, bravs: 0, fires: 0 }, ai: { tick: rnd(0, 0.3), spot: null, spotT: 0, tx: 0, tz: 0, mx: 0, mz: 0, hold: 0, mode: '', react: 0 } };
    p.A = effAttrs(sp.b, mine); p.aiLvl = sp.ai === undefined ? cfg.tier.ai : sp.ai;
    p.rig = makeRig(sp.b); p.H = p.rig.H; scene.add(p.rig.root);
    // one colour per team for the ring and the name: your team blue, theirs red. You are the thicker ring with the arrow.
    const myT = Math.max(0, cfg.teams.findIndex(t => t.some(x => x.mine === true))); p.teamCol = ti === myT ? 0x33a0ff : 0xff4a4a;
    p.ring = M(p.user ? geo('ringMe', () => new THREE.RingGeometry(0.32, 0.5, 24)) : geo('ring', () => new THREE.RingGeometry(0.36, 0.46, 20)), new THREE.MeshBasicMaterial({ color: p.teamCol, transparent: true, opacity: 0.85, depthWrite: false }), 0, 0.02, 0, p.rig.root); p.ring.rotation.x = -Math.PI / 2;
    if (p.user) {      // a little arrow on your ring that points at the man you are guarding
      p.ptr = new THREE.Group(); p.ptr.position.y = 0.03; p.rig.root.add(p.ptr); p.ptr.visible = false;
      const tri = M(geo('ptr', () => { const sh = new THREE.Shape(); sh.moveTo(0, 0.44); sh.lineTo(-0.26, 0); sh.lineTo(0, 0.12); sh.lineTo(0.26, 0); sh.lineTo(0, 0.44); return new THREE.ShapeGeometry(sh); }), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }), 0, 0, 0.5, p.ptr); tri.rotation.x = Math.PI / 2;
    }
    { const col = '#' + p.teamCol.toString(16).padStart(6, '0');      /* the name sits under the player, in the team's colour */
      const tg = nameTag(sp.b.name, mine ? 'you' : sp.peer ? 'online' : sp.ctrl === 1 ? 'player 2' : ti === myT ? 'squad' : 'them', 0, col); tg.scale.multiplyScalar(0.72); tg.center.set(0.5, 1); tg.material.opacity = mine ? 1 : 0.9; scene.add(tg); p.tag = tg; }
    if (p.user) { p.arrow = M(geo('arrow', () => new THREE.ConeGeometry(0.09, 0.2, 4)), flat(0xffffff), 0, p.H + 0.36, 0, p.rig.root); p.arrow.rotation.x = Math.PI; }
    MT.P.push(p);
  }));
  // man-to-man by slot
  for (const p of MT.P) { const opp = MT.P.filter(o => o.team !== p.team); p.man = opp.length ? opp[p.k % opp.length] : null; }
  MT.humans = MT.P.filter(p => p.user); MT.me = MT.P.find(p => p.mine) || MT.humans[0]; MT.locals = MT.humans.filter(p => !p.remote);
  if (!MT.me) { MT.me = MT.P[0]; MT.spectate = true; }      /* nobody playing: a game you are watching (the book) */
  // --- ball ---
  const B = MT.B = { mesh: makeBall(cfg.ball || 'bl_std'), pos: V3(0, 1, 9), vel: V3(), state: 'held', holder: null, t: 0, shooter: null, lastTeam: 0, spin: 0 };
  scene.add(B.mesh); B.shadow = M(geo('bshadow', () => new THREE.CircleGeometry(0.14, 10)), flat(0x000000, { transparent: true, opacity: 0.3, depthWrite: false }), 0, 0.016, 0, scene); B.shadow.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 36; i++) { const m = M(sph(0.07, 6, 5), new THREE.MeshBasicMaterial({ color: 0xff8a1f, transparent: true }), 0, -5, 0, scene); MT.parts.push({ m, life: 0, v: V3() }); }
  camera.position.set(0, 7, 20);
  musicMode = arcade ? 'jam' : 'game'; ostRoom('game');
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
// p.live: 'hold' (ball held, dribble still available), 'drib' (dribbling), 'dead' (picked up: pass, shoot, fake or pivot)
function dribRules(p) { return p.user && !p.afk && !MT.reel; }
function give(p) { const B = MT.B; B.state = 'held'; B.holder = p; B.lastTeam = p.team; B.shooter = null; p.drib = newDrib(p, B.pos); p.live = dribRules(p) && Math.hypot(p.vx, p.vz) < 1.5 ? 'hold' : 'drib'; p.stopT = 0; }
function changePoss(team) { if (MT.off !== team) { MT.off = team; MT.needClear = !MT.practice; MT.clock = 14; for (const p of MT.P) { p.ai.mode = ''; p.ai.hold = 0; } } }
function call(big, small, col, dur) { hudCall(big, small, col, dur); if (MT && MT.net === 'host') netEv({ k: 'c', b: big, s: small || '', c: col || '#fff', d: dur || 1.2 }); }
function addBrav(p, v) {
  if (!p.user || p.bravT > 0 || MT.practice) return;
  let m = 1; if (p.mine) { if (ORIGIN[S.build.origin].k === 'brav') m += 0.2; if (MT.boosts.includes('hype')) m += 0.5; }
  p.brav += v * m;
  if (p.brav >= 1) { p.brav = 1; p.bravT = 20; p.stats.bravs++; call(pick(CALLS.brav), p.b.name + ' gets +8 to everything', '#ffc531', 1.6); sfxM('rank'); burst(p.x, 1.2, p.z, 0xffc531, 18); }
}
// a dead ball: play stops, and after a beat 'team' checks it up top (fouls, out of bounds)
function deadBall(team, pause) { const M_ = MT; M_.lastScorer = { team: 1 - team, dead: true }; M_.phase = 'scored'; M_.pt = pause || 1.2; M_.B.foulBy = null; }
// fouls (street rules, not RUCKUS): the offense keeps the ball; a foul on a made shot is an and-one (+1)
function foul(d, o, kind, keep) {
  const M_ = MT; if (!d || !o || M_.arcade || M_.practice) return false; d.stats.fouls = (d.stats.fouls || 0) + 1; sfxM('whistle'); if (M_.net === 'host') netEv({ k: 's', s2: 'whistle' });
  call('FOUL', kind + ' · ' + d.b.name + ' (' + d.stats.fouls + ')', '#ff8a1f', 1.3); floatTxt(d, 'FOUL', '#ff8a1f');
  if (keep !== false) deadBall(o.team); return true;
}
const COURT = { x0: -8, x1: 8, z0: -1.6, z1: 13 };      /* the painted lines */
function andOne(p, d) {
  const M_ = MT; if (M_.phase === 'over') return; M_.score[p.team] += 1; p.stats.pts += 1; call('AND ONE', p.b.name + ' +1 · ' + d.b.name + ' fouled', '#ffc531', 1.4);
  if (M_.score[p.team] >= M_.cfg.mode.to) { crowdReact('win', p.team); M_.phase = 'over'; M_.pt = 2.6; sfxM('buzz'); call(p.team === 0 ? 'BALL GAME!' : 'GAME OVER', `${M_.score[0]} — ${M_.score[1]}`, p.team === 0 ? '#33ff88' : '#ff4040', 2.5); }
}
function scorePts(p, pts, how) {
  const M_ = MT; if (p.pu && p.pu.id === 'double' && !M_.practice) { pts *= 2; p.pu = null; p.puA = null; if (M_.net === 'host') netEv({ k: 'pu', a: 'x', i: p.i }); call('DOUBLE UP', p.b.name + ' · that one counts ' + pts, '#ff4fd8', 1.2); }
  M_.score[p.team] += pts; p.stats.pts += pts; p.stats.fgm++; p.hot++; M_.lastScorer = p;
  for (const o of M_.P) if (o.team !== p.team) { o.hot = 0; if (o.fire) { o.fire = false; } }
  if (M_.B.assist && M_.B.assist !== p && M_.time - p.catchT < 5) { M_.B.assist.stats.ast++; addBrav(M_.B.assist, 0.10); floatTxt(M_.B.assist, 'ASSIST', '#ffc531'); }
  if (M_.arcade && p.hot >= 3 && !p.fire) { p.fire = true; p.stats.fires++; call(pick(CALLS.fire), '', '#ff7a1f', 1.6); sfxM('fire'); }
  if (p.mine && cribFx('bucket')) M_.bonusRep = (M_.bonusRep || 0) + 1;
  crowdReact(how === 'dunk' ? 'dunk' : pts >= 2 ? 'three' : 'score', p.team);
  if (M_.hoop.userData.net) M_.netT = 0.35;
  addBrav(p, how === 'dunk' ? 0.16 : 0.10);
  if (M_.drill) drillEvent('make', p, { how, kind: how === 'dunk' ? 'dunk' : M_.B.kind, green: how !== 'dunk' && M_.B.green });
  if (M_.practice) return;
  M_.phase = 'scored'; M_.pt = 1.45; p.st = 'celeb'; p.t = 0;
  if (M_.score[p.team] >= M_.cfg.mode.to) { crowdReact('win', p.team); M_.phase = 'over'; M_.pt = 2.6; sfxM('buzz'); call(p.team === 0 ? 'BALL GAME!' : 'GAME OVER', `${M_.score[0]} — ${M_.score[1]}`, p.team === 0 ? '#33ff88' : '#ff4040', 2.5); }
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
    const ju = o.st === 'jump' ? o.t / 0.62 : -1, jf = ju < 0 ? 0 : ju > 0.2 && ju < 0.75 ? 1.15 : 0.7;        /* a contest timed with the release counts more; jumping too early or late counts less */
    let f = (1 - d / rad) * (o.st === 'jump' ? jf : o.handsUp ? 0.8 : 0.45) * (0.6 + 0.4 * nAtt(o, d > 1.2 ? 'perd' : 'intd')) * (1 + 0.06 * bt(o, 'ground'));
    c = Math.max(c, f);
  }
  return Math.min(0.9, c);
}
// where the move stick points, relative to the rim: tw toward it (+) or away (-), lat across it, mag how hard
function gest(p) { const l = dHoop(p) || 1, dx = p.in.dx || 0, dz = p.in.dz || 0; return { tw: (dx * -p.x + dz * -p.z) / l, lat: dx * (p.z / l) - dz * (p.x / l), mag: Math.hypot(dx, dz) }; }
const HOP_T = 0.34;
// hop step: a two-foot hop and gather, then a strong finish (or a jumper). Gets the ball past a reaching defender.
function startHop(p, next, src, opt) {
  if (MT.needClear && MT.off === p.team) { fb(p, 'TAKE IT BACK past the arc!', '#ff8a1f'); return false; }
  const sp = Math.hypot(p.vx, p.vz), d = dHoop(p) || 1; let ux = sp > 1 ? p.vx / sp : -p.x / d, uz = sp > 1 ? p.vz / sp : -p.z / d;
  const len = next === 'finish' ? clamp(d - 1.1, 0.3, 1.15) : 0.9;
  p.st = 'hop'; p.t = 0; p.hop = { dur: HOP_T, sx: p.x, sz: p.z, tx: p.x + ux * len, tz: p.z + uz * len, next, src, opt: opt || null };
  if (p.user) floatTxt(p, 'HOP STEP', '#f2c14e'); sfxM('step'); return true;
}
function startShot(p, src, floater, opt) {
  if (MT.needClear && MT.off === p.team) { fb(p, 'TAKE IT BACK past the arc!', '#ff8a1f'); return false; }
  opt = opt || {}; const d = dHoop(p), sp0 = Math.hypot(p.vx, p.vz);
  if (!floater && !opt.hopped && !opt.fade && !opt.side && !opt.jumper && (d < 2.0 || (d < finishRange(p) && sp0 > 2.2 && (p.vx * -p.x + p.vz * -p.z) > 0 && src !== 'ai'))) return startFinish(p, p.user ? euroOf(p) : 0);
  // the move stick picks the jumper: away from the rim fades, sideways from a stand side-steps, let go on a drive hops
  let fade = opt.fade ? 1 : 0, side = opt.side || 0;
  if (!floater && !opt.hopped && !fade && !side && !opt.jumper) {
    if (p.user && !p.afk && src !== 'reel') { const g = gest(p); if (g.tw < -0.5) fade = 1; else if (Math.abs(g.lat) > 0.6 && sp0 < 2.6) side = Math.sign(g.lat); }
    else if (!p.user && contestOn(p) > 0.3 && Math.random() < 0.3 + nAtt(p, 'mid') * 0.25) fade = 1;
  }
  const j = JUMPER[p.b.moves.jumper] || JUMPERS[0];
  p.st = 'shoot'; p.t = 0; p.shot = { rel: j.rel * (p.fire ? 0.85 : 1), j, src, released: false, kind: shotKind(p), sp: sp0, vx: p.vx, vz: p.vz, aiRel: 0, fade, side, fx: p.x / (d || 1), fz: p.z / (d || 1) };
  if (side) { const sh = p.shot, l = d || 1; sh.sx = -p.z / l * side; sh.sz = p.x / l * side; /* across the rim line, the way the stick went */ if (sh.sx * (p.in.dx || 0) + sh.sz * (p.in.dz || 0) < 0) { sh.sx = -sh.sx; sh.sz = -sh.sz; } }
  if (p.user && fade) floatTxt(p, 'FADE', '#f2c14e'); else if (p.user && side) floatTxt(p, 'SIDE STEP', '#f2c14e');
  if (opt.hopped) { const sh = p.shot; sh.auto = true; sh.aiRel = sh.rel * (1 + clamp((Math.random() + Math.random() - 1) * (0.2 - nAtt(p, 'iq') * 0.14), -0.3, 0.3)); }
  if (floater) { const sh = p.shot; sh.floater = true; sh.auto = true; sh.rel = 0.36; sh.kind = 'close'; sh.aiRel = sh.rel * (1 + clamp((Math.random() + Math.random() - 1) * (0.22 - nAtt(p, 'close') * 0.14), -0.3, 0.3)); }
  else if ((!p.user || p.afk) && !opt.hopped) { const sd = 0.17 - p.aiLvl * 0.10; p.shot.aiRel = p.shot.rel * (1 + clamp((Math.random() + Math.random() + Math.random() - 1.5) * sd * 1.6, -0.4, 0.45)); }
  p.face = Math.atan2(-p.x, -p.z); return true;
}
// is controller i's player defending right now? (decides what X does)
function padDefense(i) {
  const M_ = MT; if (!M_ || M_.phase !== 'live') return false; const p = i === 0 ? M_.me : M_.P.find(q => q.ctrl === i && !q.remote); if (!p) return false;
  const B = M_.B; return B.holder !== p && !(M_.off === p.team && B.state !== 'loose' && B.state !== 'shot') && B.state !== 'loose';
}
function releaseShot(p) {
  const s = p.shot; if (s.released) return; s.released = true; const B = MT.B;
  const held = s.hold != null ? s.hold : p.t;
  if (p.user && !s.auto && held < s.rel * 0.3) { s.released = false; return startFake(p); }      // let go early = pump fake
  const err = (held - s.rel) / s.rel, kind = s.kind, d = dHoop(p);
  let c = contestOn(p); if (s.j.id === 'moon') c *= 0.8; if (s.floater) c *= 0.5; c *= (1 - 0.12 * bt(p, 'filibuster')); if (s.fade) c *= 0.7; if (s.side) c *= 0.85;
  const rating = kind === 'three' ? 'three' : kind === 'mid' ? 'mid' : 'close', n = nAtt(p, rating);
  let base = kind === 'three' ? 0.20 + n * 0.33 : kind === 'mid' ? 0.28 + n * 0.31 : 0.42 + n * 0.30;
  if (s.floater) base -= Math.max(0, d - 2.2) * 0.045;
  if (s.fade) base -= 0.05 * (1 - nAtt(p, 'mid') * 0.6);
  if (d > 7.6) base -= (d - 7.6) * 0.09 * (1 - 0.18 * bt(p, 'manifest'));
  if (c < 0.06) base += 0.03 + 0.025 * bt(p, 'opencarry');
  if (p.stam < 25) base *= 0.85; if (s.sp > 2.8) base *= 0.9;
  if (p.catchFrom && MT.time - p.catchT < 1.6) base += 0.02 * bt(p.catchFrom, 'trickle') + 0.02;
  if (p.fire) base += 0.35; if (kind === 'close') base += 0.03 * bt(p, 'softmoney');
  let w = (0.05 + nAtt(p, 'iq') * 0.05 + 0.012 * bt(p, 'greencard') + s.j.win + (p.mine ? cribFx('green') * 0.1 : 0)) * (0.55 + n * 0.65) * (1 - c * 0.6);
  if (MT.practice) w *= 1.1; if (p.pu && p.pu.id === 'hot') w *= 1.6;
  const e = Math.abs(err); let green = e <= w, prob;
  if (green) prob = c > 0.55 ? 0.8 : 1; else prob = base * Math.max(0.12, 1 - (e - w) / 0.38 * (1.1 - nAtt(p, 'iq') * 0.35)) * (1 - c * 0.75) * (e < w * 2.2 ? 1.12 : 1);
  if (!p.user) green = green && Math.random() < 0.5;
  else if (s.auto) green = green && Math.random() < 0.08 + 0.17 * nAtt(p, 'iq');      /* hop jumpers and floaters time themselves: a good look, rarely a green (was every time) */
  // blocked?
  for (const o of MT.P) {
    if (o.team === p.team || o.st !== 'jump' || dist(o, p) > 1.45) continue;
    const pb = (0.06 + nAtt(o, 'block') * 0.28 + 0.04 * bt(o, 'nofly')) * (s.j.id === 'quick' ? 0.7 : 1) * (kind === 'three' ? 0.8 : 1) * (s.fade ? 0.55 : 1);
    if (Math.random() < pb) return blocked(p, o);
  }
  B.foulBy = null;
  if (!MT.arcade && !MT.practice) for (const o of MT.P) {
    if (o.team === p.team || o.st !== 'jump') continue; const dd = dist(o, p); if (dd > 0.78) continue;
    const fch = clamp(0.3 + (o.lunge ? 0.22 : 0) + (0.78 - dd) * 0.6 - nAtt(o, 'perd') * 0.25 - 0.05 * bt(o, 'ground'), 0.05, 0.75);
    if (Math.random() < fch) { B.foulBy = o; break; }
  }
  const make = Math.random() < prob; p.stats.fga++;
  const pts = MT.arcade ? (kind === 'three' ? 3 : 2) : (kind === 'three' ? 2 : 1);
  handPos(p.rig, 'R', B.pos); B.pos.y += 0.12;
  launch(p, make, pts, green && make, s.floater ? 1.5 : s.j.arc, kind);
  if (p.user && !s.auto) {
    const lbl = green && make ? 'GREEN' : e < w * 2.2 ? (err < 0 ? 'Slightly early' : 'Slightly late') : err < 0 ? (e > 0.45 ? 'Very early' : 'Early') : (e > 0.45 ? 'Very late' : 'Late');
    fb(p, lbl + (c > 0.06 ? ` · ${Math.round(c * 100)}% contested` : ' · wide open'), green && make ? '#33ff88' : '#fff');
    if (green && make) { p.stats.greens++; sfxM('green'); addBrav(p, 0.05); }
  }
  sfxM('whoosh');
}
function startFake(p) {
  if (p.live === 'drib' && dribRules(p)) {
    // driving: the pump becomes a hesitation (the dribble stays alive). Standing: a real pump fake, and the ball is picked up
    const sp = Math.max(p.shot ? p.shot.sp : 0, Math.hypot(p.vx, p.vz));
    if (sp > 1.8) {
      const vx = p.shot && p.shot.vx !== undefined ? p.shot.vx : p.vx, vz = p.shot && p.shot.vz !== undefined ? p.shot.vz : p.vz, l = Math.hypot(vx, vz) || 1, keep = p.b.moves.back;
      p.st = 'free'; p.y = 0; p.moveCool = 0; p.b.moves.back = 'hesi'; startMove(p, 'back', vx / l, vz / l); p.b.moves.back = keep;
      if (p.st === 'move') { floatTxt(p, 'HESI', '#f2c14e'); return; }
    }
    p.live = 'dead'; floatTxt(p, 'PICKED UP', '#f2c14e');
  }
  p.st = 'fake'; p.t = 0; p.y = 0; sfxM('whoosh');
  let o = null, od = 2.4; for (const q of MT.P) { if (q.team === p.team || q.st !== 'free') continue; const d = dist(q, p); if (d < od) { od = d; o = q; } }
  if (o && !o.user && Math.random() < clamp(0.3 + (1 - o.aiLvl) * 0.3 - nAtt(o, 'perd') * 0.22 + nAtt(p, 'iq') * 0.15, 0.08, 0.7)) { startJump(o); o.ai.react = 0.9; floatTxt(o, 'BIT ON IT', '#f2c14e'); addBrav(p, 0.06); }
}
function euroOf(p) { const l = Math.hypot(p.x, p.z) || 1, lat = p.in.dx * (p.z / l) - p.in.dz * (p.x / l); return Math.abs(lat) > 0.55 ? Math.sign(lat) : 0; }
function launch(p, make, pts, green, arc, kind) {
  const B = MT.B; B.state = 'shot'; B.holder = null; B.shooter = p; B.lastTeam = p.team; B.make = make; B.pts = pts; B.green = green; B.kind = kind; B.t = 0;
  const d = Math.hypot(B.pos.x, B.pos.z);
  let ex = 0, ez = 0; if (!make) { const a = rnd(0, 6.283), r = rnd(0.2, 0.34); ex = Math.cos(a) * r; ez = Math.sin(a) * r * 0.8 + 0.05; }
  B.T = clamp(0.48 + d * 0.085, 0.42, 1.5) * (0.9 + 0.1 * (arc || 1)) * (arc > 1.3 ? 1.15 : 1);
  B.vel.set((ex - B.pos.x) / B.T, (HOOP_Y + 0.06 - B.pos.y + 0.5 * GRAV * B.T * B.T) / B.T, (ez - B.pos.z) / B.T);
}
function blocked(p, o) {
  const B = MT.B; p.stats.fga++; o.stats.blk++; o.swatT = 0.45; MT.hoopT = 0.2; B.state = 'loose'; B.holder = null; B.shooter = null; B.lastTeam = o.team; B.t = 0; MT.looseT = 0;
  handPos(p.rig, 'R', B.pos); const a = Math.atan2(p.x - o.x, p.z - o.z) + rnd(-0.8, 0.8); B.vel.set(Math.sin(a) * rnd(3, 6), rnd(1, 3), Math.cos(a) * rnd(3, 6));
  call(pick(CALLS.block), o.b.name, '#33e0ff', 1.1); sfxM('block'); addBrav(o, 0.15); MT.slow = 0.25; if (p.st === 'finish') { p.finish.done = true; p.finish.blocked = true; p.bumpT = 0.3; p.bumpX = -0.3; p.bumpZ = rnd(-0.15, 0.15); }
  crowdReact('block', o.team); B.rebound = false;
}
function finishRange(p) { return MT.arcade ? 5.6 : 2.5 + nAtt(p, 'vert') * 0.6 + 0.25 * bt(p, 'gravity'); }
// who is in the way of this finish: the opponent most in the lane between you and the rim (or waiting under it).
// along: how far ahead of you, lat: which side of your line (+ = the euro side), rim: how close they are to the rim
function rimThreat(p) {
  const l = dHoop(p) || 1, ux = -p.x / l, uz = -p.z / l; let best = null, bs = 0;
  for (const o of MT.P) {
    if (o.team === p.team || o.st === 'stagger') continue; const rx = o.x - p.x, rz = o.z - p.z, along = rx * ux + rz * uz, lat = rx * -uz + rz * ux;
    if (along < -0.3 || along > l + 0.8 || Math.abs(lat) > 1.4) continue;
    const s = (1 - Math.abs(lat) / 1.4) * (along < 0.2 ? 0.7 : 1) * (0.6 + 0.4 * nAtt(o, 'block'));
    if (s > bs) { bs = s; best = { o, along, lat, rim: dHoop(o), s }; }
  }
  return best;
}
// opt: hopped (after a hop step), rev (reverse), layup (no dunk), kind (a layup from FINISHES), style (a dunk), euro
function startFinish(p, euro, forceDunk, y0, opt) {
  if (MT.needClear && MT.off === p.team) { fb(p, 'TAKE IT BACK past the arc!', '#ff8a1f'); return false; }
  opt = opt || {};
  const d = dHoop(p), sp = Math.hypot(p.vx, p.vz), canDunk = (MT.arcade || att(p, 'dunk') >= 55) && d <= finishRange(p) && (MT.arcade || att(p, 'dunk') + att(p, 'vert') * 0.4 > 78 + (2.0 - p.H) * 40 || att(p, 'dunk') >= 75);
  let rev = opt.rev || opt.kind === 'reverse' || opt.style === 'reverse'; if (opt.kind === 'euro' || opt.euro) euro = opt.euro || euro || 1;
  if (!opt.hopped && !forceDunk && !opt.kind && !opt.style && !opt.layup) {
    // the move stick picks the finish: sideways euro-steps (euroOf), away reverses, let go hops
    if (p.user && !p.afk) { const g = gest(p); if (g.mag < 0.25 && sp > 2.5 && d > 1.5) return startHop(p, 'finish'); if (!euro && g.tw < -0.45) rev = true; }
    else if (!p.user && !laneOpen(p)) { const r = Math.random(); if (r < 0.16 && d > 1.6) return startHop(p, 'finish'); if (!euro && r < 0.48) euro = Math.random() < 0.5 ? -1 : 1; else if (r < 0.62 && Math.abs(p.x) > 1.4 && p.z < 2.4) rev = true; }
  }
  let ax = p.x, az = Math.max(p.z, 0.15); const l = Math.hypot(ax, az) || 1; ax /= l; az /= l;
  let type = opt.layup ? 'layup' : canDunk || forceDunk || opt.style ? 'dunk' : 'layup';
  const near = nearestOpp(p), thr = rimThreat(p), cont = (near[0] && near[1] < 1.6) || !!(thr && thr.s > 0.35);
  // a finisher reads the defense on the way up; how well depends on how good they are (Layup / Dunk / Strength)
  const fq = att(p, 'layup'), dq = att(p, 'dunk'), str = att(p, 'str'), free = !opt.kind && !opt.style && !opt.layup && !euro && !rev && !opt.hopped && !forceDunk;
  let read = '', style0 = '';
  if (thr && thr.s > 0.35 && free) {
    if (type === 'dunk') {
      if (dq >= 90 && (str >= 78 || dq >= 97)) style0 = 'contact';                                   // posterizer: through you
      else if (dq < 90 && thr.along < 2.4 && fq >= 70) { type = 'layup'; read = 'bail'; }             // smart: no dunk into a shot-blocker
    }
    if (type === 'layup') {
      if (fq >= 88) {        // elite: pick the finish the defense gives you
        // whatever the defense allows, mixed up so a shot-blocker cannot sit on one answer
        const opts = [['hang', 3], ['switch', 2]]; if (thr.along > 1.2) opts.push(['euro', 4]); if (thr.rim < 1.4 && Math.abs(p.x) > 0.9) opts.push(['reverse', 2]);
        let r = Math.random() * opts.reduce((a, o) => a + o[1], 0); for (const o of opts) { r -= o[1]; if (r <= 0) { read = o[0]; break; } } read = read || 'hang';
        if (read === 'euro') euro = thr.lat > 0 ? -1 : 1; else if (read === 'reverse') rev = true;
      } else if (fq >= 75) { read = str >= 80 ? 'power' : thr.along > 1.4 ? (euro = thr.lat > 0 ? -1 : 1, 'euro') : 'scoop'; }
    }
  }
  const kind = type === 'dunk' ? '' : opt.kind || (opt.hopped ? 'power' : euro ? 'euro' : rev ? 'reverse' : read === 'hang' || read === 'switch' || read === 'power' || read === 'scoop' ? read : cont ? (fq < 75 ? 'lay' : nAtt(p, 'str') > 0.62 ? 'power' : 'scoop') : sp > 4 && d > 1.7 ? 'finger' : 'lay');
  const style = type !== 'dunk' ? p.b.moves.dunk : opt.style || style0 || (rev ? 'reverse' : p.b.moves.dunk);
  p.st = 'finish'; p.t = 0;
  const f = p.finish = { type, kind, sx: p.x, sz: p.z, tx: ax * (type === 'dunk' ? 0.42 : 0.75), tz: az * (type === 'dunk' ? 0.42 : 0.75), dur: clamp(0.42 + d * 0.085, 0.45, 1.0) + (euro ? 0.1 : 0) + (kind === 'finger' ? 0.06 : 0), done: false, euro: euro || 0, px: az, pz: -ax, y0: y0 || 0, oop: false, peak: type === 'dunk' ? Math.max(0.62, 3.22 - p.H * 1.36) + nAtt(p, 'vert') * 0.2 + (MT.arcade ? 0.7 : 0) : 0.55 + (MT.arcade ? 0.4 : 0) + (kind === 'power' ? -0.08 : 0), style, spin: (type === 'dunk' && (style === 'three60' || (MT.arcade && d > 3.5 && style !== 'reverse' && style !== 'contact'))) ? 1 : 0, hopped: !!opt.hopped, turn: 0, bh: 'R', cont: cont ? 1 : 0, ox: 0, oz: 0, hit: null, contact: 0, blocked: false };
  if (kind === 'hang') f.dur += 0.16; if (kind === 'switch') f.dur += 0.06; if (style === 'squat') f.dur += 0.04;
  if (p.user && read && read !== 'euro' && read !== 'reverse') floatTxt(p, { hang: 'HANG', switch: 'SWITCH HANDS', power: 'POWER', scoop: 'SCOOP', bail: 'PULLED OUT' }[read] || '', '#7de3ff');
  if (rev) {
    // under the rim and out the other side, back to the rim: keep the line you drove on and finish past the hoop
    let vx = sp > 1 ? p.vx / sp : az, vz = sp > 1 ? p.vz / sp : -ax; const tAl = -(p.x * vx + p.z * vz);
    if (tAl < 0.2) { vx = az * (p.x * az - p.z * ax > 0 ? -1 : 1); vz = -ax * (p.x * az - p.z * ax > 0 ? -1 : 1); }
    const go = Math.max(0.2, -(p.x * vx + p.z * vz)) + (type === 'dunk' ? 0.35 : 0.7);
    f.tx = p.x + vx * go; f.tz = Math.max(-0.45, p.z + vz * go);
    f.turn = (vx * -p.z - vz * -p.x > 0 ? 1 : -1) * Math.PI; f.dur += 0.08; f.euro = 0;
  }
  if (p.user && (kind === 'reverse' || style === 'reverse' && type === 'dunk')) floatTxt(p, 'REVERSE', '#f2c14e'); else if (p.user && kind === 'euro') floatTxt(p, 'EURO', '#f2c14e');
  p.face = Math.atan2(-p.x, -p.z); sfxM('whoosh'); return true;
}
function resolveFinish(p) {
  const f = p.finish, B = MT.B; f.done = true; if (B.holder !== p) return;
  let c = 0; const soft = (f.euro ? 0.72 : 1) * (f.oop ? 0.6 : 1) * (f.hopped ? 0.78 : 1) * (f.kind === 'scoop' ? 0.8 : f.kind === 'hang' ? 0.6 : f.kind === 'switch' ? 0.7 : f.kind === 'reverse' || f.style === 'reverse' && f.type === 'dunk' ? 0.75 : 1) * (f.style === 'contact' && f.type === 'dunk' ? 0.45 : 1);
  if (f.contact) c = Math.max(c, f.contact * 0.55);           /* got hit in the air and lost the line */
  for (const o of MT.P) { if (o.team === p.team || o.st === 'stagger') continue; const d = dist(o, p); if (d > 1.9) continue; c = Math.max(c, (1 - d / 1.9) * (0.5 + 0.5 * nAtt(o, 'intd')) * (o.st === 'jump' ? 1 : 0.55)); }
  const fs = clamp((att(p, f.type === 'dunk' ? 'dunk' : 'layup') - 70) / 29, 0, 1);       /* finishing skill above 70 */
  c *= (1 - 0.13 * bt(p, 'lobby')) * soft * (1 - 0.3 * fs);
  for (const o of MT.P) {
    if (o.team === p.team || o.st === 'stagger' || dist(o, p) > 1.7) continue;
    let pb = (0.10 + nAtt(o, 'block') * 0.38 + 0.05 * bt(o, 'nofly')) * (f.type === 'dunk' ? 0.6 : 1) * (1 - nAtt(p, 'str') * 0.25); if (o.st !== 'jump') pb *= 0.1; pb *= soft;
    if (MT.arcade) pb *= 0.6; pb *= 1 - 0.35 * fs;
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
      let vic = f.hit && f.hit.st !== 'stagger' && dist(f.hit, p) < 1.6 ? f.hit : null; if (!vic) for (const o of MT.P) if (o.team !== p.team && o.st !== 'stagger' && dist(o, p) < 1.25) vic = o;
      if (vic) { const dd = dist(vic, p) || 1; vic.st = 'stagger'; vic.t = 0; vic.stg = { dur: 1.5, fall: true, side: 0, dir: [(vic.x - p.x) / dd, (vic.z - p.z) / dd], push: 2.2 }; addBrav(p, 0.1); if (p.mine) MT.bonusRep = (MT.bonusRep || 0) + 3; }
      f.hangT = (MT.arcade ? 0.34 : 0.22) + (f.style === 'squat' ? 0.3 : 0); MT.hoopT = 0.6;
      call(f.oop ? 'ALLEY-OOP!' : f.put ? 'PUTBACK!' : vic ? 'POSTER!' : pick(CALLS.dunk), p.b.name + (vic ? ' on ' + vic.b.name : ds.rep ? ` · ${ds.n}` : ''), '#ff5a3c', 1.3); if (p.mine) MT.bonusRep = (MT.bonusRep || 0) + ds.rep;
      scorePts(p, pts, 'dunk'); if (f.foulBy) { foul(f.foulBy, p, 'blocking', false); andOne(p, f.foulBy); } return;
    }
    B.state = 'loose'; B.holder = null; B.pos.set(0, HOOP_Y + 0.2, 0.2); B.vel.set(rnd(-2, 2), rnd(3, 5), rnd(1, 4)); B.rebound = true; B.shooter = p; B.t = 0; MT.hoopT = 0.4; sfxM('rim'); if (MT.drill) drillEvent('miss', p, { kind: 'dunk' }); fb(p, 'Rim check failed', '#ff8a1f'); p.hot = 0; p.fire = false; return;
  }
  const kAdj = { finger: -0.03, scoop: -0.03, reverse: -0.02, power: -0.04 + nAtt(p, 'str') * 0.1, euro: 0, lay: 0.02, hang: -0.02, switch: -0.01 }[f.kind] || 0;
  const prob = 0.52 + nAtt(p, 'layup') * 0.38 + 0.03 * bt(p, 'softmoney') + put + kAdj - c * (f.kind === 'power' ? 0.45 : 0.6) + (p.fire ? 0.3 : 0);
  handPos(p.rig, f.bh || 'R', B.pos); launch(p, Math.random() < prob, pts, false, 1, 'close'); if (f.foulBy) B.foulBy = f.foulBy; B.T = 0.32; B.vel.set(-B.pos.x / B.T, (HOOP_Y + 0.06 - B.pos.y + 0.5 * GRAV * B.T * B.T) / B.T, -B.pos.z / B.T);
  if (!B.make) { B.vel.x += rnd(-0.6, 0.6); B.vel.z += rnd(0.2, 0.8); }
}
function startMove(p, slot, dx, dz) {
  if (p.moveCool > 0 || p.stam < 6) return;
  const mv = MOVE[p.b.moves[slot]] || MOVES.find(m => m.slot === slot);
  if (mv.keep) { dx *= 0.45; dz = -0.9; }            /* in-and-out: the fake goes sideways, the burst goes forward */ const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
  const burstV = mv.burst * (1 + 0.06 * bt(p, 'getaway')) * (0.85 + nAtt(p, 'accel') * 0.3);
  p.moveN = (p.moveN || 0) + 1; p.st = 'move'; p.t = 0; p.mv = { mv, dx, dz, v: burstV, slot, h0: p.hand }; p.moveCool = mv.dur * 0.48; p.stam -= mv.st; p.handSwT = MT.time + 0.8;      /* a hand you chose with a move stays chosen a while */ if (mv.slot === 'side' && !mv.keep) p.hand = dx > 0.2 ? 'L' : dx < -0.2 ? 'R' : p.hand; dribMove(p, mv);
  p.combo = MT.time - p.comboT < 1.4 ? Math.min(3, p.combo + 1) : 0; p.comboT = MT.time; sfxM('whoosh');
  // ankle check on the nearest defender
  let o = null, od = 2.1; for (const q of MT.P) { if (q.team === p.team || q.st !== 'free') continue; const d = dist(q, p); if (d < od) { od = d; o = q; } }
  if (!o) return;
  let ch = 0.05 + (att(p, 'handle') - att(o, 'perd')) * 0.006 + mv.ank + 0.035 * bt(p, 'ankletax') - 0.035 * bt(o, 'ground') + p.combo * 0.035 + (MT.arcade ? 0.08 : 0);
  if (o.vx * dx + o.vz * dz < -1.2) ch += 0.13;
  if (Math.random() < clamp(ch, 0.02, 0.6)) {
    const fall = Math.random() < 0.4 + p.combo * 0.1; o.st = 'stagger'; o.t = 0;
    // he bit on the fake: his weight goes the opposite way to where the ball handler really went
    const ox = Math.cos(o.face), oz = -Math.sin(o.face), lat = -(dx * ox + dz * oz);
    o.stg = { dur: fall ? rnd(1.4, 1.8) : rnd(0.75, 0.95), fall, side: lat >= 0 ? 1 : -1, dir: [-dx, -dz], push: fall ? 2.0 : 1.5 };
    p.stats.ankles++; call(pick(CALLS.ankle), `${p.b.name} put ${o.b.name} on skates`, '#ffc531', 1.3); sfxM('ankle'); addBrav(p, 0.2); MT.slow = 0.3; crowdReact('ankles', p.team);
  } else o.slowT = 0.22 + mv.ank;
}
function doPass(p, to) {
  if (!to || MT.B.holder !== p) return; const B = MT.B;
  const oop = MT.phase === 'live' && !MT.needClear && to.st === 'free' && dHoop(to) < 3.7 && dHoop(to) > 0.9 && dist(p, to) > 3 && (MT.arcade || att(to, 'dunk') >= 62) && nearestOpp(to)[1] > 0.95 && (to.callT > 0 || to.vx * -to.x + to.vz * -to.z > 1.2);
  p.flashy = !oop && (p.b.build.style === 'showman' || bt(p, 'trickle') >= 2) && Math.random() < 0.45;
  p.st = 'pass'; p.t = 0; p.face = Math.atan2(to.x - p.x, to.z - p.z);
  B.state = 'pass'; B.holder = null; B.target = to; B.from = p; B.t = 0; B.tried = {}; B.lastTeam = p.team; B.bounced = false;
  if (B.pos.y < 0.7) B.pos.y = 0.7;     /* a pass leaves from the hands, wherever the dribble had the ball */ B.speed = 11 + nAtt(p, 'pass') * 7; sfxM('whoosh');
  const dd = dist(p, to); B.pk = oop ? 'lob' : (!passLane(p, to) && dd < 7) ? 'bounce' : dd > 7.5 ? 'overhead' : Math.hypot(p.vx, p.vz) > 3.2 ? 'one' : 'chest'; p.pk = B.pk;
  B.y0 = B.pos.y; B.h0 = Math.max(0.5, Math.hypot(to.x - B.pos.x, to.z - B.pos.z));
  if (oop && startFinish(to, 0, true)) { to.finish.oop = true; to.finish.dur = Math.max(to.finish.dur, 0.66); B.speed = Math.max(7, dist(p, to) / (to.finish.dur * 0.6)); B.oop = true; floatTxt(p, 'LOB', '#f2c14e'); } else B.oop = false;
}
function passTarget(p, mx, mz) {
  const mates = MT.P.filter(o => o.team === p.team && o !== p && o.st !== 'stagger'); if (!mates.length) return null;
  const m = Math.hypot(mx, mz);
  if (m > 0.4) { let best = null, bs = -9; for (const o of mates) { const dx = o.x - p.x, dz = o.z - p.z, l = Math.hypot(dx, dz) || 1; const s = (dx * mx + dz * mz) / (l * m); if (s > bs) { bs = s; best = o; } } return best; }
  let best = null, bs = -9; for (const o of mates) { let od = 9; for (const q of MT.P) if (q.team !== p.team) od = Math.min(od, dist(q, o)); const s = od - dist(o, p) * 0.1; if (s > bs) { bs = s; best = o; } } return best;
}
// ---------------- RUCKUS slugfest ----------------
function startHit(p, kind) {
  p.st = kind; p.t = 0; p.cool = kind === 'punch' ? 1.5 : 2.2; p.hitList = []; sfxM('whoosh');
  if (kind === 'punch') { const fx = Math.sin(p.face), fz = Math.cos(p.face); p.vx += fx * 2; p.vz += fz * 2; }
}
function hitScan(p, kind, reach, frontMin) {
  const fx = Math.sin(p.face), fz = Math.cos(p.face);
  for (const o of MT.P) { if (o.team === p.team || p.hitList.includes(o) || (o.st === 'stagger' && o.stg && o.stg.fall)) continue; const d = dist(o, p); if (d > reach || d < 1e-3) continue;
    if (((o.x - p.x) * fx + (o.z - p.z) * fz) / d < frontMin) continue; applyHit(p, o, kind); if (kind === 'punch') return; }
}
function applyHit(p, o, kind) {
  const M_ = MT, B = M_.B; p.hitList.push(o); const dd = dist(o, p) || 1, dir = [(o.x - p.x) / dd, (o.z - p.z) / dd];
  if (kind === 'punch' && Math.random() > 0.72 + (nAtt(p, 'str') - nAtt(o, 'str')) * 0.35) { floatTxt(o, 'SHRUGGED IT OFF', '#8d8d99'); sfxM('bump'); return; }
  const ko = Math.random() < (kind === 'clothes' ? 0.36 : 0.18) + Math.min(0.3, (M_.brawlHeat || 0) * 0.08);
  o.st = 'stagger'; o.t = 0; o.stg = { dur: ko ? 4.2 : kind === 'clothes' ? 2.0 : 1.5, fall: true, side: 0, dir, push: kind === 'clothes' ? 3.4 : 2.2 };
  if (ko) { o.ko = 4.2; if (M_.net === 'host') netEv({ k: 'ko', i: o.i, d: 4.2 }); }
  sfxM('block'); M_.shake = ko ? 0.55 : 0.3; crowdReact(ko ? 'ko' : 'hit', p.team); burst(o.x, 1.3, o.z, ko ? 0xff4040 : 0xffc531, ko ? 18 : 10);
  floatTxt(o, ko ? 'KO' : kind === 'clothes' ? 'CLOTHESLINED' : 'POW', ko ? '#ff4040' : '#ffc531');
  call(kind === 'clothes' ? 'CLOTHESLINE!' : 'HAYMAKER!', p.b.name + ' on ' + o.b.name, '#ff4040', 1);
  if (B.holder === o) { B.state = 'loose'; B.holder = null; B.pos.set(o.x, 1, o.z); B.vel.set(rnd(-3, 3), 3, rnd(-3, 3)); B.t = 0; B.rebound = false; B.lastTeam = p.team; }
  M_.brawlHeat = (M_.brawlHeat || 0) + 1;
  if (ko && M_.phase === 'live') { M_.brawl = M_.brawl || { t: 1.4, by: p, victims: [] }; if (!M_.brawl.victims.includes(o)) M_.brawl.victims.push(o); }
}
// a knockout stops the game: even in RUCKUS, that one gets called. The team that got hit keeps the ball.
function calledFoul() {
  const M_ = MT, b = M_.brawl; M_.brawl = null; if (!b || M_.phase !== 'live') return; const v = b.victims[0], by = b.by;
  sfxM('whistle'); call('WE HAVE TO CALL THAT', `${by.b.name} is crazy · ${b.victims.length > 1 ? 'two down' : v.b.name + ' is down'}`, '#ff4040', 2.4);
  const vMates = M_.P.filter(q => q.team === v.team && !b.victims.includes(q)), aMates = M_.P.filter(q => q.team === by.team && q !== by);
  floatTxt(vMates[0] || v, 'ALL RIGHT, MAN.', '#ffffff'); setTimeout(() => { if (MT === M_) { floatTxt(vMates[1] || v, 'WE HAVE TO CALL THAT.', '#ffffff'); floatTxt(aMates[0] || by, aMates[0] ? "YOU'RE CRAZY." : 'MY BAD.', '#ffc531'); } }, 700);
  deadBall(v.team, 2.8); M_.brawlHeat = 0;
}
function startSteal(p) {
  const B = MT.B, h = B.holder, now = MT.time; p.reach = (p.reach || []).filter(t => now - t < 1.6); p.reach.push(now);
  if (p.cool > 0) {      // still recovering from the last reach: swiping again is a hand check
    if (h && h.team !== p.team && dist(h, p) < 1.4 && p.reach.length >= 3 && Math.random() < 0.09 * (p.reach.length - 2)) foul(p, h, 'hand check');
    return;
  }
  if (MT.arcade) {   // RUCKUS: shove; hold LT for a haymaker; at a sprint it is a clothesline (AI throws the odd punch too)
    const kind = p.sprinting && Math.hypot(p.vx, p.vz) > 3.6 ? 'clothes' : (p.ltHeld || (!p.user && Math.random() < 0.22)) ? 'punch' : 'shove';
    if (kind !== 'shove') { startHit(p, kind); return; }
    let o = null, od = 1.35; for (const q of MT.P) { if (q.team === p.team || q.st === 'stagger') continue; const d = dist(q, p); if (d < od) { od = d; o = q; } }
    p.st = 'shove'; p.t = 0; p.cool = 1.3;
    if (o && Math.random() < 0.62 + nAtt(p, 'str') * 0.2 - nAtt(o, 'str') * 0.3) {
      { const dd = dist(o, p) || 1; o.st = 'stagger'; o.t = 0; o.stg = { dur: 1.3, fall: true, side: 0, dir: [(o.x - p.x) / dd, (o.z - p.z) / dd], push: 2.4 }; } sfxM('block'); MT.shake = 0.2;
      if (B.holder === o) { B.state = 'loose'; B.holder = null; B.pos.set(o.x, 1, o.z); B.vel.set(rnd(-3, 3), 3, rnd(-3, 3)); B.t = 0; B.rebound = false; B.lastTeam = p.team; p.stats.stl++; call(pick(CALLS.steal), p.b.name, '#33e0ff', 1); addBrav(p, 0.12); }
    }
    return;
  }
  p.st = 'steal'; p.t = 0; p.cool = 0.9; p.stealDone = false; p.lunge = null;
  if (B.state === 'pass' && B.from && B.from.team !== p.team && B.target) {      // jump the passing lane: lunge to where the ball is going
    const ax = B.pos.x, az = B.pos.z, bx = B.target.x, bz = B.target.z, ex = bx - ax, ez = bz - az, L2 = ex * ex + ez * ez || 1, t = clamp(((p.x - ax) * ex + (p.z - az) * ez) / L2, 0, 1), cx = ax + ex * t, cz = az + ez * t, d = Math.hypot(cx - p.x, cz - p.z);
    if (d < 2.3 && d > 0.05) { p.lunge = [(cx - p.x) / d * Math.min(6.5, d / 0.28), (cz - p.z) / d * Math.min(6.5, d / 0.28), 0.28]; p.laneJump = true; floatTxt(p, 'JUMP THE LANE', '#7de3ff'); }
  } else if (h && h.team !== p.team) { const d = dist(h, p); if (d > 0.7 && d < 1.9) p.lunge = [(h.x - p.x) / d * 2.4, (h.z - p.z) / d * 2.4, 0.16]; }
}
// a steal goes for the ball: the closer the ball is to your reaching hand, and the more it is out in front of the
// handler (not tucked away on his far side), the better. Low on the bounce in front of you is the best poke.
function stealChance(p, h) {
  const B = MT.B, fx = Math.sin(p.face), fz = Math.cos(p.face), rx = p.x + fx * 0.75, rz = p.z + fz * 0.75;
  const reach = Math.hypot(B.pos.x - rx, B.pos.z - rz) + Math.max(0, B.pos.y - 1.2) * 0.6, dB = Math.hypot(B.pos.x - p.x, B.pos.z - p.z), dH = dist(h, p);
  let ch = 0.11 + (att(p, 'steal') - att(h, 'handle')) * 0.0045 + 0.03 * bt(p, 'repo') - 0.04 * bt(h, 'nda') + (h.st === 'move' ? -0.04 : 0) + (h.sprinting ? 0.05 : 0) + (h.st === 'shoot' && h.t < h.shot.rel * 0.4 ? 0.06 : 0);
  ch *= reach < 0.35 ? 1.8 : reach < 0.6 ? 1.25 : reach < 0.9 ? 0.8 : 0.35;
  if (dB > dH + 0.1) ch *= 0.5;                                                   /* the ball is on his far side: protected */
  if (h.drib && (h.drib.ph === 'down' || h.drib.ph === 'up') && B.pos.y < 0.7 && reach < 0.7) ch *= 1.2;
  if (h.protect) ch *= 0.75;
  if (h.st === 'finish') ch *= 0.3; else if (h.st === 'hop') ch *= 0.6;
  return { ch: clamp(ch, 0.01, 0.6), reach };
}
function resolveSteal(p) {
  p.stealDone = true; const B = MT.B, h = B.holder; if (!h || h.team === p.team || dist(h, p) > 1.6) { p.slowT = 0.25; return; }
  const sc = stealChance(p, h), ch = sc.ch;
  if (p.user && sc.reach > 0.9) floatTxt(p, 'REACHED', '#8d8d99');
  if (Math.random() < ch) {
    p.stats.stl++; if (h.st === 'shoot' || h.st === 'finish' || h.st === 'hop') { h.st = 'free'; h.y = 0; h.rig.extraYaw = 0; } give(p); changePoss(p.team); crowdReact('steal', p.team); call(pick(CALLS.steal), p.b.name, '#33e0ff', 1); sfxM('steal'); addBrav(p, 0.15); 
  } else {
    p.slowT = 0.4 - 0.05 * bt(p, 'repo'); p.cool = 1.3; p.bumpT = 0.3; p.bumpX = 0.3; p.bumpZ = 0;
    const hf = [Math.sin(h.face), Math.cos(h.face)], dh = dist(h, p) || 1, behind = ((p.x - h.x) * hf[0] + (p.z - h.z) * hf[1]) / dh < -0.3, spam = Math.max(0, (p.reach || []).length - 1);
    const fch = (0.05 + 0.08 * spam + (sc.reach > 0.9 ? 0.12 : 0) + (behind ? 0.15 : 0)) * (1 - nAtt(p, 'steal') * 0.4) * (1 - 0.15 * bt(p, 'repo'));
    if (Math.random() < fch) foul(p, h, behind ? 'reach from behind' : 'reach-in');
  }
}
function startJump(p) {
  if (p.st !== 'free' || p.y > 0) return; p.st = 'jump'; p.t = 0; p.jumpH = (0.38 + nAtt(p, 'vert') * 0.42) * (MT.arcade ? 1.8 : 1); p.lunge = null;
  // contesting a shooter: close out at him as you go up (not all the way: you stop a step short)
  let s = null, sd = 3.2; for (const q of MT.P) if (q.team !== p.team && (q.st === 'shoot' || q.st === 'fake') && dist(q, p) < sd) { sd = dist(q, p); s = q; }
  if (s && sd > 0.75) { const k = Math.min(3.2, (sd - 0.7) / 0.3); p.lunge = [(s.x - p.x) / sd * k, (s.z - p.z) / sd * k, 0.3]; p.face = Math.atan2(s.x - p.x, s.z - p.z); }
}

// ---------- human control ----------
// what can be cut short, and when: moves chain from halfway, fakes and passes recover fast, a landed jumper is done
function canCancel(p) {
  switch (p.st) {
    case 'move': return p.t > p.mv.mv.dur * 0.5;
    case 'fake': return p.t > 0.12;
    case 'pass': return p.t > 0.12;
    case 'steal': return p.t > 0.26;
    case 'shove': return p.t > 0.22;
    case 'punch': return p.t > 0.38;
    case 'clothes': return p.t > 0.45;
    case 'shoot': return p.shot.released && p.y <= 0.001 && p.t > p.shot.rel + 0.08;
    case 'celeb': return false;
  }
  return false;
}
function humanThink(p, dt) {
  if (MT.reel && p.ctrl === 0) { reelThink(p, dt); return; }
  let I = IN[p.ctrl];
  const B = MT.B; p.in.dx = I.mx; p.in.dz = I.my; p.in.sprint = I.sprint; p.handsUp = false;
  if (MT.phase !== 'live') { p.post = p.bodyUp = false; return; }
  const hasBall = B.holder === p;
  // LT: with the ball and a live dribble, back to the basket (post up); on defense against the ball, body up
  const postNow = !!I.lt && hasBall && p.live === 'drib' && (p.st === 'free' || p.st === 'move') && !MT.arcade;
  if (postNow && !p.post) floatTxt(p, 'POST UP', '#f2c14e'); p.post = postNow;
  p.ltHeld = !!I.lt;
  p.bodyUp = !!I.lt && !hasBall && MT.off !== p.team && !!B.holder && B.holder.team !== p.team && p.st === 'free';
  if (p.st === 'shoot' && !p.shot.released && p.shot.auto) { if (p.t >= p.shot.aiRel) releaseShot(p); return; }
  if (p.remote) {          // the guest times their own release; the host just takes their word for the hold
    if (I.relEdge) p.pendRel = I.rh;
    if (p.st === 'shoot' && !p.shot.released) { if ((p.pendRel != null && p.t >= Math.min(p.pendRel, p.shot.rel * 1.55)) || p.t > p.shot.rel * 1.55 + 0.6) { p.shot.hold = p.pendRel; p.pendRel = null; releaseShot(p); } return; }
    if (p.st !== 'shoot' && p.pendRel != null && !I.bP && I.flick !== 'D') p.pendRel = null;
  }
  if (p.st === 'shoot' && !p.shot.released) {
    if ((p.shot.src === 'btn' && !I.b) || (p.shot.src === 'stick' && I.rdir !== 'D' && I.rdir !== 'DL' && I.rdir !== 'DR') || p.t > p.shot.rel * 1.55) releaseShot(p);
    return;
  }
  // an action pressed while busy is held for 0.3 s and fires as soon as the current one can be cut short
  const pressed = I.bP || I.aP || !!I.flick;
  if (p.st !== 'free') {
    if (pressed && canCancel(p)) { p.st = 'free'; p.rig.extraYaw = 0; p.y = 0; }
    else { if (pressed) p.buf = { bP: I.bP, aP: I.aP, flick: I.flick, ttl: 0.3 }; return; }
  }
  if (!pressed && p.buf && p.buf.ttl > 0) { I = Object.assign({}, I, p.buf); p.buf = null; if (p.st !== 'free') return; }
  else if (pressed) p.buf = null;
  p.tAct = MT.time; if (pressed && I.tPress) p.lat = performance.now() - I.tPress;
  if (hasBall) {
    if (p.live === 'dead' && dribRules(p)) {
      if (I.flick === 'U' && dHoop(p) < 2.6) { startFinish(p, 0, false, 0, { layup: 1, kind: 'power' }); return; }      /* a power move off two feet is still allowed */
      if (I.flick && I.flick !== 'D') { floatTxt(p, "DRIBBLE'S DEAD", '#ff8a1f'); return; }
    }
    if (p.post && p.st === 'free') {      // post moves: shoot = turnaround fadeaway, stick toward the rim = hook, stick to a side = drop step
      const d = dHoop(p), hf = Math.atan2(-p.x, -p.z);
      if (I.bP) {      // shoot from the post: where the stick points picks the move
        const hx = -p.x / (d || 1), hz = -p.z / (d || 1), sx = p.in.dx || 0, sz = p.in.dz || 0, sm = Math.hypot(sx, sz), along = sm > 0.3 ? (sx * hx + sz * hz) / sm : 0, lat = sm > 0.3 ? (sx * -hz + sz * hx) / sm : 0;
        p.post = false;
        if (along > 0.55) {      // into the defender, toward the rim: drop step to the side he is not on, or a hook from further out
          if (d < 3.6) { const [o] = nearestOpp(p); const ol = o ? (o.x - p.x) * -hz + (o.z - p.z) * hx : 0; const side = Math.abs(lat) > 0.3 ? Math.sign(lat) : (ol > 0 ? -1 : 1); floatTxt(p, 'DROP STEP', '#f2c14e'); startFinish(p, side, false, 0, { layup: 1, kind: 'power' }); return; }
          p.face = hf; startShot(p, 'stick', true); floatTxt(p, 'HOOK', '#f2c14e'); return;
        }
        if (along < -0.55) { startShot(p, 'btn', false, { fade: true }); floatTxt(p, 'POST FADE', '#f2c14e'); return; }      /* away from the rim: fadeaway */
        if (Math.abs(lat) > 0.55) { p.face = hf; p.vx += -hz * Math.sign(lat) * 1.6; p.vz += hx * Math.sign(lat) * 1.6; startShot(p, 'stick', true); floatTxt(p, 'JUMP HOOK', '#f2c14e'); return; }      /* across: a step and a jump hook */
        startShot(p, 'btn', false, { jumper: true }); floatTxt(p, 'TURNAROUND', '#f2c14e'); return;      /* stick still: turnaround jumper */
      }
      if (I.flick === 'D') { p.post = false; startShot(p, 'stick', false, { fade: true }); floatTxt(p, 'TURNAROUND', '#f2c14e'); return; }
      if (I.flick === 'U' && d < 5.2) { p.post = false; p.face = hf; startShot(p, 'stick', true); floatTxt(p, 'HOOK', '#f2c14e'); return; }
      if (I.flick && I.flick !== 'U') { const side = I.flick.includes('L') ? -1 : I.flick.includes('R') ? 1 : 0; p.post = false; p.face = hf;
        if (d < 3.8 && side) { floatTxt(p, 'DROP STEP', '#f2c14e'); startFinish(p, side, false, 0, { layup: 1, kind: 'power' }); return; }
        floatTxt(p, 'FACE UP', '#f2c14e'); p.vx += side * 2.4; p.vz += 0; return; }
    }
    if (I.bP) { startShot(p, 'btn'); return; }
    if (I.flick === 'D') { startShot(p, 'stick'); return; }
    if (I.flick === 'U') { const d = dHoop(p); if (d <= finishRange(p) + 0.6) startFinish(p, euroOf(p)); else if (d <= 5.4) startShot(p, 'stick', true); else if (d <= 7.6) startHop(p, 'shot', 'stick'); else startMove(p, 'diag', 0, -1); return; }
    if (I.flick === 'L' || I.flick === 'R') { startMove(p, 'side', I.flick === 'L' ? -1 : 1, -0.15); return; }
    if (I.flick === 'DL' || I.flick === 'DR') { startMove(p, 'back', I.flick === 'DL' ? -0.55 : 0.55, 1); return; }
    if (I.flick === 'UL' || I.flick === 'UR') { startMove(p, 'diag', I.flick === 'UL' ? -0.8 : 0.8, -0.8); return; }
    if (I.aP) { doPass(p, passTarget(p, I.mx, I.my)); return; }
  } else if (MT.off === p.team && B.state !== 'loose' && B.state !== 'shot') {
    if (I.aP) { if (MT.arcade && (I.lt || p.sprinting)) startSteal(p); else { p.callT = 1.2; floatTxt(p, 'BALL!', '#fff'); } }      /* RUCKUS: off the ball you can still throw hands */
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
  if (MT.reel) { reelDefThink(p); return; }
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
      if (p.live === 'dead') {        // picked up: no dribble left. Get rid of it, or go up with it
        if (d < 2.4) { startFinish(p, 0, false, 0, { layup: 1, kind: 'power' }); return; }
        if (tryPass() || (mates.length && Math.random() < 0.6 && (doPass(p, mates[0]), true))) return;
        startShot(p, 'ai'); return;
      }
      if (MT.needClear) {
        if (beyondArc(p.x, p.z)) { /* cleared next frame */ }
        else { const l = d || 1; aiGo(p, p.x / l * 8.0 + (p.x === 0 ? 0.1 : 0), Math.max(p.z / l * 8.0, 4.5), true); if (Math.random() < 0.35 && tryPass(q => beyondArc(q.x, q.z))) return; }
      } else {
        const caller = mates.find(q => q.callT > 0);
        if (caller && passLane(p, caller) && Math.random() < 0.9) { doPass(p, caller); return; }
        const fr = MT.arcade ? Math.min(finishRange(p), 3.2 + L * 2) : finishRange(p);
        if (d < Math.max(2.4, fr * 0.92) && (laneOpen(p) || d < 2.3 || a.hold > 4)) { startFinish(p); return; }
        if (MT.clock < 2.5) { startShot(p, 'ai'); return; }
        if (d > 2.6 && d < 4.7 && !laneOpen(p) && a.mode === 'drive' && Math.random() < 0.3) { a.mode = ''; startShot(p, 'ai', true); return; }
        if (!open && d < 7.6 && Math.random() < 0.05 + L * 0.05) { startFake(p); a.tick = 0.3; return; }
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
  if (M_.brawl) { M_.brawl.t -= dt; if (M_.brawl.t <= 0) calledFoul(); }
  if (M_.brawlHeat) M_.brawlHeat = Math.max(0, M_.brawlHeat - dt * 0.05);
  else if (M_.phase === 'over') { M_.pt -= dt; if (M_.pt <= 0 && !M_.over) { M_.over = true; endMatch(); return; } }
  else if (M_.phase === 'live' && !M_.practice) {
    if (B.state === 'held') { M_.clock -= dt; if (M_.clock <= 0) { sfxM('buzz'); call('SHOT CLOCK', 'Attention span expired', '#ff4040', 1.2); M_.viol = (M_.viol || 0) + 1; const t = 1 - M_.off; M_.lastScorer = { team: M_.off }; M_.phase = 'scored'; M_.pt = 1.2; void t; } }
    if (M_.needClear && B.holder && beyondArc(B.holder.x, B.holder.z)) { M_.needClear = false; }
  }
  if (M_.practice === 'rack' && !M_.over) { M_.rackT -= dt; if (M_.rackT <= 0) { M_.over = true; sfxM('buzz'); endMatch(); return; } }
  if (M_.drill && !M_.over) { drillStep(dt); if (MT !== M_) return; }

  for (const p of M_.P) {
    p.in = p.in || { dx: 0, dz: 0, sprint: false }; if (p.buf) p.buf.ttl -= dt; p.t += dt; p.swatT = (p.swatT || 0) - dt; p.cool -= dt; p.moveCool -= dt; p.slowT -= dt; p.callT -= dt; p.putT -= dt;
    if (p.bravT > 0) { p.bravT -= dt; p.brav = Math.max(0, p.bravT / 20); if (p.bravT <= 0) p.brav = 0; }
    if (p.user && !(p.remote && p.afk)) humanThink(p, dt); else aiThink(p, dt);
    stepPlayer(p, dt);
  }
  // body collisions
  for (let i = 0; i < M_.P.length; i++) for (let j = i + 1; j < M_.P.length; j++) {
    const a = M_.P[i], b = M_.P[j]; if (a.y > 0.5 || b.y > 0.5) continue; const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), R = 0.56;
    if (d < R && d > 0.001) { const push = (R - d) / 2; if (push > 0.05) for (const q of [a, b]) { const sg = q === a ? -1 : 1, lx = dx / d * sg, lz = dz / d * sg, fx = Math.sin(q.face), fz = Math.cos(q.face); q.bumpT = 0.3; q.bumpX = clamp((lx * fx + lz * fz) * -push * 3, -0.25, 0.25); q.bumpZ = clamp((lx * fz - lz * fx) * push * 3, -0.25, 0.25); }
      const wa = a.st === 'stagger' ? 0.2 : 1, wb = b.st === 'stagger' ? 0.2 : 1, pst = a.post || b.post, sa = pst ? 0.2 + nAtt(b, 'str') * 1.4 + (b.bodyUp ? 0.35 : 0) : 0.5 + nAtt(b, 'str') * 0.5, sb = pst ? 0.2 + nAtt(a, 'str') * 1.4 + (a.bodyUp ? 0.35 : 0) : 0.5 + nAtt(a, 'str') * 0.5, tot = sa * wa + sb * wb || 1; a.x -= dx / d * push * 2 * sa * wa / tot; a.z -= dz / d * push * 2 * sa * wa / tot; b.x += dx / d * push * 2 * sb * wb / tot; b.z += dz / d * push * 2 * sb * wb / tot; }
  }
  puStep(dt); stepBall(dt);
  for (const p of M_.P) animPlayer(p, dt);
  if (B.state === 'held' && B.holder) ballHeld(B.holder, dt); ballMesh();
  matchFx(dt); matchCam(dtReal); hudMatch(); if (M_.net === 'host') netHostStep(dtReal);
}
function matchFx(dt) {
  ambientStep(dt, camera, null); courtFx(dt);
  const M_ = MT;
  if (M_.hoopT > 0) { M_.hoopT -= dt; const k = Math.max(0, M_.hoopT); M_.hoop.rotation.x = Math.sin(M_.time * 46) * 0.035 * k; M_.hoop.rotation.z = Math.sin(M_.time * 39) * 0.02 * k; } else if (M_.hoop.rotation.x) { M_.hoop.rotation.x = 0; M_.hoop.rotation.z = 0; }
  for (const q of M_.parts) { if (q.life <= 0) continue; q.life -= dt; q.v.y -= 6 * dt; q.m.position.addScaledVector(q.v, dt); q.m.material.opacity = Math.max(0, q.life / q.max); q.m.scale.setScalar(0.5 + q.life / q.max); if (q.life <= 0) q.m.position.y = -5; }
  crowdStep(dt);
  if (M_.netT > 0) { M_.netT -= dt; const n = M_.hoop.userData.net; if (n) n.scale.set(1 - M_.netT, 1 + M_.netT * 1.5, 1 - M_.netT); }
}
function stepPlayer(p, dt) {
  const M_ = MT, B = M_.B, hasBall = B.holder === p; let lock = 1;
  switch (p.st) {
    case 'shoot': {
      const s = p.shot, j0 = s.rel * 0.42, air = 0.56;
      if (p.y > 0.01) { lock = 0; const dmp = Math.pow(0.35, dt); p.vx *= dmp; p.vz *= dmp; if (s.fade) { p.vx = s.fx * 1.7; p.vz = s.fz * 1.7; } } else if (s.side && p.t < j0) { lock = 0; const k = 3.8 * (1 - p.t / j0); p.vx = s.sx * k; p.vz = s.sz * k; } else lock = s.released ? 0.5 : 0.05;   /* plant on the gather (pull-up), drift in the air, walk off the landing */ const u = (p.t - j0) / air; p.y = u > 0 && u < 1 ? (0.32 + nAtt(p, 'vert') * 0.2) * Math.sin(Math.PI * u) * (M_.arcade ? 1.4 : 1) : 0;
      if (s.released && u >= 1 && p.t > s.rel + 0.2) { p.st = 'free'; p.y = 0; }
      break;
    }
    case 'finish': {
      const f = p.finish, u = p.t / f.dur; lock = 0;
      if (f.hangT > 0 && u >= 0.75 && f.done) { f.hangT -= dt; p.t -= dt; }        // hang on the rim a beat
      const e = Math.min(1, u / 0.8), sw = f.euro ? (e < 0.5 ? Math.sin(e * Math.PI) : 1 - (1 - Math.sin(e * Math.PI)) * 0.35) * 0.95 * f.euro : 0; p.x = lerp(f.sx, f.tx, e) + f.px * sw + f.ox; p.z = lerp(f.sz, f.tz, e) + f.pz * sw + f.oz; p.vx = p.vz = 0;
      // bodies meet in the air: nobody passes through anybody. The finisher slides off the defender, and the first touch
      // is contact: the weaker body gives (Strength), a posterizer goes through, a weak finisher loses the line
      for (const o of MT.P) {
        if (o.team === p.team || o.st === 'stagger' || u > 1) continue; const dx = p.x - o.x, dz = p.z - o.z, dd = Math.hypot(dx, dz) || 0.01;
        if (dd > 0.62 || Math.abs(p.y - o.y) > 1.0) continue;
        const push = 0.62 - dd, ps = f.style === 'contact' && f.type === 'dunk' ? 0.35 : 1; f.ox += dx / dd * push * ps; f.oz += dz / dd * push * ps; p.x += dx / dd * push * ps; p.z += dz / dd * push * ps;
        if (ps < 1) { o.x -= dx / dd * push * 0.65; o.z -= dz / dd * push * 0.65; }
        if (!f.hit) {
          f.hit = o; if (!MT.arcade && !MT.practice && o.st !== 'jump' && Math.hypot(o.vx, o.vz) > 1.6 && Math.random() < 0.55) f.foulBy = o;      /* he moved into the finisher: blocking foul */ const s = (att(p, 'str') - att(o, 'str')) / 40 + (f.style === 'contact' && f.type === 'dunk' ? 0.8 : 0) + (f.kind === 'power' ? 0.3 : 0);
          f.contact = clamp(0.45 - s * 0.45, 0, 0.8) * (f.kind === 'hang' || f.kind === 'switch' ? 0.5 : 1);
          const fx = Math.sin(p.face), fz = Math.cos(p.face), lx = -dx / dd, lz = -dz / dd;
          p.bumpT = 0.3; p.bumpX = clamp(-(lx * fx + lz * fz) * (0.32 - s * 0.12), -0.4, 0.05); p.bumpZ = clamp((lx * fz - lz * fx) * 0.3, -0.3, 0.3);
          o.bumpT = 0.3; o.bumpX = clamp(-0.15 - s * 0.15, -0.45, 0.1); o.bumpZ = rnd(-0.12, 0.12);
          sfxM('bump'); if (p.user && f.contact > 0.3) floatTxt(p, 'BODIED', '#ff8a1f');
        }
      }
      if (f.kind === 'switch' && f.type === 'layup') f.bh = u > 0.5 ? 'L' : 'R';
      p.y = Math.max(f.y0 * (1 - u * 2.2), u < 0.75 ? f.peak * Math.sin(u / 0.75 * Math.PI / 2) : Math.max(0, f.peak * (1 - Math.pow((u - 0.75) / 0.4, 2))));
      if (u >= 0.75 && !f.done) resolveFinish(p);
      if (f.style === 'legs' && f.type === 'dunk') f.bh = u > 0.46 ? 'L' : 'R';
      if (u >= 1.15) { p.st = 'free'; p.y = 0; if (f.turn) p.face += f.turn; p.rig.extraYaw = 0; }
      break;
    }
    case 'hop': {
      const h = p.hop, u = Math.min(1, p.t / h.dur), e = Math.min(1, u / 0.72); lock = 0; p.vx = p.vz = 0;
      const k = 1 - (1 - e) * (1 - e); p.x = lerp(h.sx, h.tx, k); p.z = lerp(h.sz, h.tz, k); p.y = u < 0.72 ? 0.17 * Math.sin(Math.PI * e) : 0;
      if (u >= 1) { p.st = 'free'; p.y = 0; const o2 = Object.assign({ hopped: 1 }, h.opt || {}), ok = h.next === 'shot' ? startShot(p, h.src || 'btn', false, o2) : startFinish(p, 0, false, 0, o2); if (!ok) p.st = 'free'; }
      break;
    }
    case 'move': { const m = p.mv, u = p.t / m.mv.dur; lock = 0; const k = m.v * (m.slot === 'side' ? (u < 0.3 ? 0.12 + 0.3 * (u / 0.3) * (u / 0.3) : 1.2 * (1 - (u - 0.3) / 0.7 * 0.55)) : 1 - u * 0.6), st = 2.4 * Math.min(1, u * 1.6);      /* side moves: set the defender up first, then explode */ p.vx = m.dx * k + p.in.dx * st; p.vz = m.dz * k + p.in.dz * st; if (u >= 1) { p.st = 'free'; p.rig.extraYaw = 0; } break; }
    case 'stagger': { lock = 0; const g = p.stg; if (g.dir && p.t < 0.28) { const k = (g.push || 1.5) * (1 - p.t / 0.28); p.vx = g.dir[0] * k; p.vz = g.dir[1] * k; } else { p.vx *= 0.85; p.vz *= 0.85; } if (p.t >= g.dur) p.st = 'free'; break; }      /* the first steps go where he bit, then he is stuck there */
    case 'fake': lock = 0.25; if (p.t > 0.27) p.st = 'free'; break;
    case 'jump': { lock = 0.35; if (p.lunge && p.t < p.lunge[2]) { lock = 0; p.vx = p.lunge[0]; p.vz = p.lunge[1]; } const u = p.t / 0.62; p.y = p.jumpH * Math.sin(Math.PI * Math.min(1, u)); if (u >= 1) { p.st = 'free'; p.y = 0; } break; }
    case 'steal': lock = 0.55; if (p.lunge && p.t < p.lunge[2]) { lock = 0; p.vx = p.lunge[0]; p.vz = p.lunge[1]; } if (p.t > 0.13 && !p.stealDone && MT.B.state !== 'pass') resolveSteal(p); if (p.t > 0.4) { p.st = 'free'; p.laneJump = false; } break;
    case 'shove': lock = 0.3; if (p.t > 0.35) p.st = 'free'; break;
    case 'punch': lock = 0.25; if (p.t > 0.13 && p.t < 0.3) hitScan(p, 'punch', 1.2, 0.3); if (p.t > 0.45) p.st = 'free'; break;
    case 'clothes': lock = 1; if (p.t > 0.05 && p.t < 0.42) hitScan(p, 'clothes', 1.05, -0.35); if (p.t > 0.5) p.st = 'free'; break;
    case 'pass': lock = 0.8; if (p.t > 0.22) p.st = 'free'; break;
    case 'celeb': lock = 0; p.vx *= 0.85; p.vz *= 0.85; if (M_.phase === 'live') p.st = 'free'; break;
  }
  // no double dribble: you can stop and keep dribbling, but a pump fake after dribbling picks the ball up for good
  if (hasBall && dribRules(p)) { const push = Math.hypot(p.in.dx, p.in.dz); if (p.live === 'hold' && (push > 0.25 || p.st === 'move')) p.live = 'drib'; }
  else if (hasBall && p.live === 'hold') p.live = 'drib';
  // a defender can force a pickup: up in your chest, in front of you, while you are not getting anywhere
  if (hasBall && p.live === 'drib' && p.st === 'free' && M_.phase === 'live' && !M_.practice) {
    const [o, od] = nearestOpp(p), fx = Math.sin(p.face), fz = Math.cos(p.face);
    if (o && od < 1.25 && ((o.x - p.x) * fx + (o.z - p.z) * fz) > od * 0.5 && Math.hypot(p.vx, p.vz) < 1.6 && (o.st === 'free' || o.st === 'steal')) {
      p.pressT = (p.pressT || 0) + dt;
      if (p.pressT >= 0.6) { p.pressT = 0; const ch = clamp(0.1 + (att(o, 'perd') - att(p, 'handle')) * 0.006 + 0.05 * bt(o, 'ground') - 0.05 * bt(p, 'nda') + (o.handsUp ? 0.04 : 0) + (o.bodyUp ? 0.06 : 0), 0.02, 0.34);
        if (Math.random() < ch) { p.live = 'dead'; floatTxt(p, 'FORCED PICKUP', '#ff8a1f'); floatTxt(o, 'LOCKED UP', '#7de3ff'); addBrav(o, 0.08); } }
    } else p.pressT = 0;
  }
  // backing down in the post: moving toward the rim with a defender on your back moves him, by strength (less if he is bodying up)
  if (hasBall && p.post && p.st === 'free' && M_.phase === 'live') {
    const dh = dHoop(p) || 1, hx = -p.x / dh, hz = -p.z / dh, va = p.vx * hx + p.vz * hz;
    for (const o of M_.P) { if (o.team === p.team || o.st === 'jump') continue; const rx = o.x - p.x, rz = o.z - p.z, rl = Math.hypot(rx, rz); if (rl > 1.05 || (rx * hx + rz * hz) < rl * 0.4) continue;
      if (va > 0.2) { const push = clamp(0.3 + (nAtt(p, 'str') - nAtt(o, 'str')) * 0.6 - (o.bodyUp ? 0.2 : 0), 0.05, 0.8); o.x += hx * va * push * dt; o.z += hz * va * push * dt; p.stam = Math.max(0, p.stam - dt * 2.5); o.stam = Math.max(0, o.stam - dt * 2);
        p.bumpTk = (p.bumpTk || 0) - dt; if (p.bumpTk <= 0) { p.bumpTk = 0.45; sfxM('bump'); } } }
  }
  // leaning on the ball handler all day gets called eventually (a hand check)
  if (p.bodyUp && B.holder && B.holder.team !== p.team && dist(p, B.holder) < 1.1) { p.bodyT = (p.bodyT || 0) + dt; if (p.bodyT > 3 && Math.random() < dt * 0.05) { if (foul(p, B.holder, 'hand check')) p.bodyT = 0; } }
  else p.bodyT = Math.max(0, (p.bodyT || 0) - dt * 2);
  if (hasBall) {
    if (p.live === 'dead' && p.st === 'free') { lock = 0; const k = Math.pow(0.002, dt); p.vx *= k; p.vz *= k; }      /* feet stay put: pivot only */
  }
  if (M_.phase !== 'live' && M_.phase !== 'check') lock = Math.min(lock, p.st === 'celeb' ? 0 : 0.5);
  if (M_.phase === 'check') lock = 0;
  // defensive assist (people only, not sprinting): stay between your man and the rim, mirror his steps, sag off the
  // ball when he does not have it. With the stick released it guards for you; pushing the stick still steers.
  if (p.user && !p.remote && p.guard && M_.phase === 'live' && M_.off !== p.team && B.holder && B.holder !== p && !p.in.sprint && p.st === 'free' && (!S || !S.set || S.set.dassist !== 0)) {
    const g = p.guard, dg = dist(p, g); if (dg < 4.2) {
      const gh = dHoop(g) || 1, ux = -g.x / gh, uz = -g.z / gh, onBall = g === B.holder, off = onBall ? (p.bodyUp ? 0.74 : 1.05) : 1.6;
      let sx = g.x + ux * off, sz = g.z + uz * off; if (!onBall) { sx = lerp(sx, B.holder.x, 0.22); sz = lerp(sz, B.holder.z, 0.22); }
      const ka = 3.2, dvx = (sx - p.x) * ka + (g.vx || 0), dvz = (sz - p.z) * ka + (g.vz || 0), topD = (3.3 + nAtt(p, 'speed') * 2.5) * 0.92, m = Math.hypot(dvx, dvz) / topD, ax = m > 1 ? dvx / topD / m : dvx / topD, az = m > 1 ? dvz / topD / m : dvz / topD;
      const pushed = Math.hypot(p.in.dx, p.in.dz) > 0.2, w = (pushed ? 0.3 : 0.85) * (0.75 + 0.25 * nAtt(p, 'perd')) * clamp((4.2 - dg) / 1.5, 0, 1);
      const w2 = p.bodyUp && onBall ? Math.max(w, 0.9) : w; p.in.dx = lerp(p.in.dx, ax, w2); p.in.dz = lerp(p.in.dz, az, w2); p.assist = w2;
      if (onBall && dg < 1.9 && (g.st === 'shoot' || g.st === 'fake')) p.handsUp = true;       /* hands go up on a shooter in front of you */
    }
  } else p.assist = 0;
  // locomotion
  let top = (3.3 + nAtt(p, 'speed') * 2.5) * (M_.arcade ? 1.15 : 1);
  if (hasBall) top *= 0.80 + 0.17 * nAtt(p, 'swb');
  if (p.post) top = Math.min(top, 1.2 + 0.45 * nAtt(p, 'str'));
  if (p.bodyUp) top *= 0.86;
  if (hasBall && !p.post) { const [o, od] = nearestOpp(p); if (o && o.bodyUp && od < 1.0 && ((o.x - p.x) * Math.sin(p.face) + (o.z - p.z) * Math.cos(p.face)) > 0) top *= clamp(0.72 + 0.16 * (nAtt(p, 'str') - nAtt(o, 'str') + 0.5), 0.6, 0.95); }      /* a hand on your body slows the drive */
  const want = Math.hypot(p.in.dx, p.in.dz), canSprint = p.in.sprint && (p.stam > 4 || p.fire) && want > 0.5 && !p.post && !p.bodyUp;
  p.sprinting = canSprint && lock > 0.9;
  if (p.sprinting) { top *= 1.28; if (!p.fire && !(p.pu && p.pu.id === 'turbo')) p.stam -= (hasBall ? 10 : 8) * dt * (1.3 - nAtt(p, 'stam') * 0.5); } else p.stam = Math.min(100, p.stam + (6 + nAtt(p, 'stam') * 7) * dt);
  if (p.stam < 20) top *= 0.86; if (p.slowT > 0) top *= 0.45;
  const def = M_.off !== p.team && !hasBall && B.state !== 'loose'; if (def && !p.sprinting) top *= 0.92;
  if (lock > 0) {
    const tvx = p.in.dx * top * lock, tvz = p.in.dz * top * lock, opp = p.vx * tvx + p.vz * tvz < 0 || (Math.abs(tvx) + Math.abs(tvz) < 0.05);
    const acc = (11 + nAtt(p, 'accel') * 15) * (opp ? 2.4 : 1) * dt;      // braking and reversing bite harder than speeding up
    const ddx = tvx - p.vx, ddz = tvz - p.vz, dl = Math.hypot(ddx, ddz); if (dl <= acc || dl === 0) { p.vx = tvx; p.vz = tvz; } else { p.vx += ddx / dl * acc; p.vz += ddz / dl * acc; }
  }
  // guarding a post-up: hold your ground (you do not walk into him); the contact itself decides who gives, by strength
  if (!p.post && M_.phase === 'live') for (const q of M_.P) { if (q.team === p.team || !q.post) continue; const dx = q.x - p.x, dz = q.z - p.z, dd = Math.hypot(dx, dz); if (dd > 0.9 || dd < 1e-3) continue; const vt = (p.vx * dx + p.vz * dz) / dd; if (vt > 0 || !p.user) { p.vx -= dx / dd * vt; p.vz -= dz / dd * vt; } }      /* the AI plants; a person may give ground */
  if (hasBall && p.st === 'free' && M_.phase === 'live' && !M_.practice) {      // line awareness: hard to drift out by accident
    const push = (n, dist) => { const out = p.vx * n[0] + p.vz * n[1], want = p.in.dx * n[0] + p.in.dz * n[1]; if (out <= 0 || dist > 0.7) return; if (want > 0.85 && p.sprinting) return; const k = clamp(dist / 0.7, 0.05, 1); p.vx -= n[0] * out * (1 - k); p.vz -= n[1] * out * (1 - k); };
    push([1, 0], COURT.x1 - p.x); push([-1, 0], p.x - COURT.x0); push([0, -1], p.z - COURT.z0); push([0, 1], COURT.z1 - p.z);
  }
  p.x = clamp(p.x + p.vx * dt, COURT.x0 - 0.9, COURT.x1 + 0.9); p.z = clamp(p.z + p.vz * dt, COURT.z0 - 0.6, COURT.z1 + 0.9);
  if (hasBall && M_.phase === 'live' && !M_.practice && p.y < 0.05 && (p.st === 'free' || p.st === 'move') && (p.x < COURT.x0 - 0.06 || p.x > COURT.x1 + 0.06 || p.z < COURT.z0 - 0.06 || p.z > COURT.z1 + 0.06)) {
    sfxM('whistle'); call('OUT OF BOUNDS', p.b.name + ' stepped out', '#ff8a1f', 1.2); floatTxt(p, 'OUT', '#ff8a1f'); deadBall(1 - p.team);
  }
  // don't run through the pole / backboard zone
  if (p.z < -0.5 && Math.abs(p.x) < 0.5 && p.st !== 'finish') p.z = -0.5;
  // facing
  const sp = Math.hypot(p.vx, p.vz); let tf = p.face;
  if (p.st === 'shoot' || p.st === 'finish' || p.st === 'hop') tf = Math.atan2(-p.x, -p.z);
  else if (p.st === 'celeb') tf = 0;
  else if (B.state === 'shot' && B.t > 0.25 && dHoop(p) < 4.5 && sp < 2.5) tf = Math.atan2(-p.x, -p.z);
  else if (def && B.holder) {
    // who you are guarding: the nearest opponent if you are a person (so it is whoever you chose to pick up), your
    // assignment if you are the AI; either way the ball handler when he is right on you
    const h = B.holder; let g = p.man || h;
    if (p.user) { let bd = 3.2, bo = null; for (const q of M_.P) if (q.team !== p.team && q.st !== 'stagger') { const d = dist(p, q); if (d < bd) { bd = d; bo = q; } } g = bo || (dist(p, h) < 5 ? h : (p.man || h)); }
    else if (dist(p, h) < 2.2) g = h;
    p.guard = g; const am = Math.atan2(g.x - p.x, g.z - p.z);
    // on the ball: square to him. Off the ball: face your man when tight, open up between man and ball as you sag off
    if (g === h) tf = am; else tf = lerpAng(am, Math.atan2(h.x - p.x, h.z - p.z), clamp((dist(p, g) - 1.4) / 3.2, 0, 0.5));
  }
  else if (hasBall && p.post && p.st === 'free') tf = Math.atan2(p.x, p.z);      /* posting: back to the basket */
  else if (hasBall && p.live === 'dead' && p.st === 'free' && Math.hypot(p.in.dx, p.in.dz) > 0.3) tf = Math.atan2(p.in.dx, p.in.dz);     /* pivot */
  else if (hasBall && !p.sprinting && p.st === 'free') { const hf = Math.atan2(-p.x, -p.z); tf = sp > 1.5 ? lerpAng(Math.atan2(p.vx, p.vz), hf, 0.45 * clamp((3.6 - sp) / 2.1, 0.15, 1)) : hf; }      /* jogging with it, the body turns to where it is going (feet and run curves line up); creeping, it squares to the rim */
  else if (sp > 0.6) tf = Math.atan2(p.vx, p.vz);
  else if (B.holder && B.holder !== p) tf = Math.atan2(B.holder.x - p.x, B.holder.z - p.z);
  if (p.faceLock !== undefined) tf = p.faceLock;
  p.face = lerpAng(p.face, tf, 1 - Math.exp(-12 * dt));
  p.def = def; p.speed = sp; p.topSpeed = top;
}
function lerpAng(a, b, t) { let d = b - a; while (d > Math.PI) d -= 6.2832; while (d < -Math.PI) d += 6.2832; return a + d * t; }

function stepBall(dt) {
  const M_ = MT, B = M_.B; B.t += dt;
  if (B.state === 'held') {
    // where the held ball is drawn is decided after the bodies are posed (ballHeld), so it can sit in a real hand
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
        if (B.foulBy) { const d = B.foulBy; B.foulBy = null; foul(d, p, 'shooting', false); andOne(p, d); }
      } else if (B.foulBy) {
        const d = B.foulBy; B.foulBy = null; B.state = 'loose'; B.t = 0; B.vel.set(rnd(-1, 1), 3, rnd(0.5, 1.5)); sfxM('rim'); foul(d, p, 'shooting');      /* missed and fouled: their ball again */
      } else {
        B.state = 'loose'; B.t = 0; M_.looseT = 0; B.rebound = true; sfxM('rim'); if (M_.drill) drillEvent('miss', p, { kind: B.kind }); const a = rnd(-1.3, 1.3); const s = rnd(1.5, 4.2); B.vel.set(Math.sin(a) * s, rnd(2, 4.5), Math.abs(Math.cos(a)) * s * 0.9 + 0.3); p.hot = 0; if (p.fire) p.fire = false; M_.clock = Math.max(M_.clock, 14);
        if (M_.practice) floatTxt(p, pick(CALLS.miss), '#ff8a1f');
      }
    }
  } else if (B.state === 'through') {
    B.vel.y -= GRAV * dt; B.pos.addScaledVector(B.vel, dt); if (B.pos.y < 0.125) { B.pos.y = 0.125; B.vel.y *= -0.5; B.vel.x = rnd(-0.5, 0.5); B.vel.z = rnd(0.3, 1); if (Math.abs(B.vel.y) > 1) sfxM('bounce'); }
    if (M_.practice && !M_.drill && B.t > 0.45) give(M_.me);
  } else if (B.state === 'pass') {
    const to = B.target; _v.set(to.x, 1.2 + to.y, to.z).sub(B.pos); const l = _v.length(), stepL = B.speed * dt;
    if (l <= Math.max(0.45, stepL)) { give(to); to.catchT = M_.time; to.catchFrom = B.from; B.assist = B.from; if (to.st === 'free') to.ai.tick = 0.25; }
    else {
      B.pos.addScaledVector(_v, stepL / l);
      // the flight's height follows the kind of pass: chest (flat), bounce (off the floor at 60%), overhead and lob (arcs)
      const s = clamp(1 - Math.hypot(to.x - B.pos.x, to.z - B.pos.z) / (B.h0 || 1), 0, 1), yT = 1.2 + to.y, y0 = B.y0 || 1.2;
      B.pos.y = B.pk === 'bounce' ? (s < 0.6 ? lerp(y0, 0.13, s / 0.6) : lerp(0.13, yT, (s - 0.6) / 0.4)) : lerp(y0, yT, s) + Math.sin(Math.PI * s) * (B.pk === 'lob' ? 1.3 : B.pk === 'overhead' ? 0.55 : 0.12);
      if (B.pk === 'bounce' && !B.bounced && s >= 0.6) { B.bounced = true; sfx('bounce'); }
      if (B.t * B.speed > 1.3) for (const o of M_.P) {
        if (o.team === B.from.team || B.tried[o.i] || (o.st !== 'free' && o.st !== 'steal') || Math.hypot(o.x - B.pos.x, o.z - B.pos.z) > (o.laneJump ? 1.15 : 0.8)) continue; B.tried[o.i] = 1;
        const ch = 0.08 + nAtt(o, 'steal') * 0.42 - nAtt(B.from, 'pass') * 0.36 + 0.03 * bt(o, 'repo') + (o.user ? 0.12 : 0) + (o.laneJump ? 0.22 : 0);
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
        const wasReb = B.rebound, air = best.st === 'jump';
        give(best); changePoss(best.team); B.rebound = false; B.assist = null; best.ai.hold = 0; best.ai.tick = 0.3;
        if (wasReb && wasOff && air && !M_.practice && dHoop(best) < 2.0 && (M_.arcade || att(best, 'dunk') >= 68) && Math.random() < (M_.arcade ? 0.8 : 0.3 + 0.15 * bt(best, 'putback'))) { if (startFinish(best, 0, true, best.y)) { best.finish.put = true; best.finish.dur = 0.5; } }
        if (M_.practice) M_.needClear = false;
      }
    }
    if (M_.practice && !M_.drill && M_.looseT > 1.1) { give(M_.me); }
  }
  if (M_.practice === 'rack' && (B.state === 'shot' || B.state === 'through') && B.t > 0.3 && M_.me.st === 'free' && !M_.rackBall) { /* a second ball appears in hand so the rack keeps moving */ }
}

// =====================================================================
//  BALL HANDLING LAYER — the dribble is a little state machine with real ball flight:
//    hand  : ball in the palm, the hand pushes it down
//    down  : released, travels to a floor point picked for this dribble (beside, in front, between the legs, behind)
//    up    : comes back off the floor and meets the receiving hand wherever that hand now is
//    carry : held in one palm (spin moves)       gather: both hands (shots, passes, fakes, finishes)
//  The hand pose is driven from the same clock, so the hand is low when the ball leaves and high when it arrives.
// =====================================================================
const _bp = new THREE.Vector3(), _bq = new THREE.Vector3();
function palm(p, hand, out) { handPos(p.rig, hand, out); out.y -= 0.115; return out; }
// a reset (check, teleport): the ball starts in the hand instead of flying in from wherever it was
function resetDrib(p) { const D = newDrib(p, MT.B.pos); palm(p, D.hand, MT.B.pos); D.ph = 'hand'; D.t = 0; D.F = null; p.drib = D; return D; }
function newDrib(p, from) { return { ph: 'up', t: 0, T: 0.16, hand: p.hand || 'R', F: from.clone(), P0: from.clone(), kind: '', push: 1 }; }
// where this bounce lands, in the player's frame: side (+ = dribble hand side), forward
function dribFloor(p, D, kind, tAhead, vx, vz) {
  if (vx === undefined) { vx = p.avx || 0; vz = p.avz || 0; }
  const fx = Math.sin(p.face), fz = Math.cos(p.face), rx = fz, rz = -fx, sgn = D.hand === 'R' ? -1 : 1, v = Math.hypot(vx, vz);
  let side = 0.3, fwd = 0.3 + Math.min(0.45, v * 0.06);                 // ordinary dribble: outside the foot, ahead more at speed
  if (kind === 'cross' || kind === 'killer') { side = 0.02; fwd = kind === 'killer' ? 0.3 : 0.45; }
  else if (kind === 'tween') { side = 0.0; fwd = 0.04; }
  else if (kind === 'behind') { side = 0.0; fwd = -0.32; }
  else if (kind === 'shammgod') { side = -0.42; fwd = 0.34; }
  else if (kind === 'retreat') { side = 0.32; fwd = 0.1; }
  else if (p.protect) { side = 0.42; fwd = 0.05; }                     // ball kept away from the defender, low and to the side
  // forward of the body along the way he faces (the offset was worked out above but never applied: the ball always
  // bounced level with the hips, and a runner then outran it)
  return _bq.set(p.x + vx * tAhead + rx * side * sgn + fx * fwd, 0.125, p.z + vz * tAhead + rz * side * sgn + fz * fwd).clone();
}
// which hand the ball wants to be in: away from a defender who is close, otherwise the hand on the side you are going
function autoHand(p) {
  const fx = Math.sin(p.face), fz = Math.cos(p.face), [o, od] = nearestOpp(p);
  if (o && od < 1.7) { const lat = (o.x - p.x) * -fz + (o.z - p.z) * fx, fwd = (o.x - p.x) * fx + (o.z - p.z) * fz; if (fwd > -0.3 && Math.abs(lat) > 0.12) return lat > 0 ? 'L' : 'R'; if (od < 1.2) return null; }
  const dh = dHoop(p) || 1, hx = -p.x / dh, hz = -p.z / dh, lv = (p.avx || 0) * -hz + (p.avz || 0) * hx;      /* sideways, as seen looking at the rim */
  return lv > 1.1 ? 'R' : lv < -1.1 ? 'L' : null;
}
// a dribble move takes the ball out of whatever it was doing and sends it where the move needs it
function dribMove(p, mv) {
  const D = p.drib; if (!D || MT.B.holder !== p) return;
  const k = mv.id, change = { cross: 1, tween: 1, behind: 1, shammgod: 1, killer: 1 }[k];
  if (k === 'spin' || k === 'halfspin') { D.ph = 'carry'; D.t = 0; D.T = mv.dur * 0.8; return; }
  if (change) D.hand = p.hand;                                         // startMove already chose the new hand
  D.ph = 'down'; D.t = 0; D.T = Math.max(0.09, mv.dur * 0.32); D.P0 = MT.B.pos.clone(); D.kind = change ? k : (k === 'stepback' || k === 'moonwalk' || k === 'snatch' ? 'retreat' : k === 'hesi' ? 'hesi' : '');
  const pk = p.mv.slot === 'side' ? 0.3 : 0.8, mvx = p.mv.dx * p.mv.v * pk, mvz = p.mv.dz * p.mv.v * pk;      /* side moves set up before they explode: the body has not gone far when the ball lands */ D.F = dribFloor(p, D, D.kind, D.T, mvx, mvz); D.upT = Math.max(0.12, mv.dur * 0.42);
}
function ballFollow(B, target, dt, exact) {
  // never teleport: if the ball is far from where it should be (a state change), it closes the gap fast instead of jumping
  const d = B.pos.distanceTo(target);
  if (exact && d < 0.2) B.pos.copy(target); else if (d > 0) { const m = Math.min(d, Math.max(d * (1 - Math.exp(-22 * dt)), 0), 11 * dt); B.pos.addScaledVector(_bq.copy(target).sub(B.pos), m / d); }
}
function ballHeld(p, dt) {
  const M_ = MT, B = M_.B; let D = p.drib || (p.drib = newDrib(p, B.pos)); if (p.reset) { p.reset = false; D = resetDrib(p); } D.t += dt;
  if (B.pos.distanceTo(_bp.set(p.x, B.pos.y, p.z)) > 2.5 || (D.F && Math.hypot(D.F.x - p.x, D.F.z - p.z) > 2.5)) D = resetDrib(p);
  const st = p.st;
  if (st === 'shoot' || st === 'finish' || st === 'fake' || st === 'pass' || st === 'hop' || ((p.live === 'hold' || p.live === 'dead') && st === 'free')) {
    // gather: ball between the hands, then up into the shooting hand
    const bh = (st === 'finish' && p.finish.bh === 'L') || ((st === 'shoot' || st === 'fake') && p.rig.prof && p.rig.prof.hand === 'L') ? 'L' : 'R'; handPos(p.rig, bh, _bp); handPos(p.rig, bh === 'R' ? 'L' : 'R', _bq);
    const lift = st === 'shoot' ? clamp((p.t - p.shot.rel * 0.35) / (p.shot.rel * 0.4), 0, 1) : st === 'finish' ? clamp(p.t / (p.finish.dur * 0.5), 0, 1) : 0;
    _bp.lerp(_bq, 0.5 * (1 - lift)); _bp.y += 0.06 + 0.05 * lift;
    ballFollow(B, _bp, dt, true); D.ph = 'gather'; p.dribH = 0.6; B.spin += dt * 2; return;
  }
  if (D.ph === 'gather') { D.ph = 'up'; D.t = 0; D.T = 0.14; D.F = B.pos.clone(); D.hand = p.hand; }
  const v = Math.hypot(p.avx || 0, p.avz || 0), hesi = p.st === 'move' && p.mv.mv.id === 'hesi';
  const Tc = clamp(0.56 - v * 0.032, 0.36, 0.56) * (p.protect ? 0.8 : 1) * (hesi ? 1.35 : 1);
  if (D.ph === 'carry') {
    palm(p, D.hand, _bp); ballFollow(B, _bp, dt, true); p.dribH = 0.75;
    if (D.t >= D.T || p.st !== 'move') { D.ph = 'down'; D.t = 0; D.T = Tc * 0.26; D.P0 = B.pos.clone(); D.kind = ''; D.F = dribFloor(p, D, '', D.T); D.upT = Tc * 0.38; }
  } else if (D.ph === 'hand') {
    // the hand rides the ball down, then lets go
    // receive (the hand gives with the ball as it rises), then push it back down
    const Th = Tc * 0.36, u = Math.min(1, D.t / Th); p.dribH = u < 0.35 ? 0.88 + 0.12 * (u / 0.35) : 1 - 0.8 * ((u - 0.35) / 0.65);
    palm(p, D.hand, _bp); ballFollow(B, _bp, dt, true);
    if (D.t >= Th) { D.ph = 'down'; D.t = 0; D.T = Tc * 0.26; D.P0 = B.pos.clone(); D.kind = '';
      const want = p.st === 'free' && !p.post ? autoHand(p) : null;      /* switch hands with a quick crossover dribble in front of the body */
      if (want && want !== D.hand && M_.time - (p.handSwT || -9) > 0.75) { p.hand = want; D.hand = want; D.kind = 'cross'; p.handSwT = M_.time; }
      D.F = dribFloor(p, D, D.kind, D.T); D.upT = Tc * 0.38; }
  } else if (D.ph === 'down') {
    if (D.t <= dt * 1.01) { const T0 = D.T; D.T = Math.max(D.T, D.P0.distanceTo(D.F) / 10);     /* no faster than a hard real push */ if (D.T > T0 * 1.05 && p.st === 'free' && !D.kind) D.F = dribFloor(p, D, '', D.T); }   /* a longer drop from a high hand lands further ahead, where the runner will be */
    const u = Math.min(1, D.t / D.T), e = Math.pow(u, 1.5); p.dribH = 0.25 + 0.6 * u;
    B.pos.set(lerp(D.P0.x, D.F.x, u), lerp(D.P0.y, 0.125, e), lerp(D.P0.z, D.F.z, u));
    if (u >= 1) { D.ph = 'up'; D.t = 0; D.C0 = null; D.T = D.upT || Tc * 0.5; D.F.copy(B.pos); if (M_.phase === 'live' && !M_.bounceMute) sfx('bounce'); }
  } else {   // up: off the floor to wherever the receiving hand is now
    const u = Math.min(1, D.t / D.T), e = 1 - (1 - u) * (1 - u); p.dribH = 0.85 + 0.15 * u;
    palm(p, D.hand, _bp); _bq.set(lerp(D.F.x, _bp.x, u), lerp(D.F.y, _bp.y, e), lerp(D.F.z, _bp.z, u));
    // a real ball has a top speed: chase the path, but never faster than ~11 m/s; the catch happens when ball and hand meet
    const gap = B.pos.distanceTo(_bq), cap = 11 * dt; if (gap > cap) B.pos.lerp(_bq, cap / gap); else B.pos.copy(_bq);
    if (u >= 0.85 && B.pos.distanceTo(_bp) < 0.12) { D.ph = 'hand'; D.t = 0; }      // fingertips take it a touch before the palm
  }
  B.spin += dt * (D.ph === 'down' ? 9 : 4);
}
function ballMesh() { const B = MT.B; B.mesh.position.copy(B.pos); B.mesh.rotation.x = B.spin; B.shadow.position.set(B.pos.x, 0.016, B.pos.z); B.shadow.scale.setScalar(clamp(1.3 - B.pos.y * 0.15, 0.4, 1.3)); }
function animPlayer(p, dt) {
  const M_ = MT, B = M_.B, R = p.rig, hasBall = B.holder === p; let an = 'idle', o = { leg: R.legLen, prof: R.prof };
  p.protect = hasBall && p.st === 'free' && nearestOpp(p)[1] < 1.7 && Math.hypot(p.avx || 0, p.avz || 0) < 3;
  p.runPh += dt * (4 + p.speed * 2.1);
  const spN = clamp(p.speed / 6.5, 0, 1);
  switch (p.st) {
    case 'shoot': an = p.shot.floater ? 'floater' : 'shoot'; o.rel = p.shot.rel; o.n = p.stats.fga + 1; o.fadeA = p.shot.fade ? 1 : 0; o.sideS = p.shot.side || 0; o.kick = p.shot.j.id === 'lawsuit'; if (M_.net !== 'guest') { p.fadeK = lerp(p.fadeK || 0, contestOn(p), 0.2); o.fade = p.fadeK; } { const fx = Math.sin(p.face), fz = Math.cos(p.face); o.drift = ((p.avx || 0) * fz - (p.avz || 0) * fx) * -0.06; } break;
    case 'fake': an = 'fake'; o.rel = 0.6; break;
    case 'finish': { const f = p.finish; an = f.type; o.u = p.t / f.dur; o.style = f.style; o.kind = f.kind; o.euro = f.euro || 0; o.cont = f.cont; o.blocked = f.blocked; o.hit = !!f.hit; o.onRim = f.done && f.hangT > 0; if (f.spin) R.extraYaw = Math.min(1, o.u / 0.75) * Math.PI * 2; else if (f.turn) { const k = clamp(o.u / 0.7, 0, 1); R.extraYaw = f.turn * k * k * (3 - 2 * k); } break; }
    case 'hop': an = 'hop'; o.u = p.t / ((p.hop && p.hop.dur) || HOP_T); break;
    case 'move': { const k = p.mv.mv.id || 'cross', u = Math.min(1, p.t / p.mv.mv.dur), sg = p.mv.dx > 0 ? -1 : 1; an = 'move'; o.side = p.mv.dx; o.kind = k; o.u = u; o.hand = p.hand;
      if (k === 'spin') R.extraYaw = u * Math.PI * 2 * sg; else if (k === 'halfspin') R.extraYaw = Math.sin(u * Math.PI) * 2.4 * sg; break; }
    case 'stagger': an = 'stagger'; o.fall = p.stg.fall; o.dur = p.stg.dur; o.side = p.stg.side === undefined ? 1 : p.stg.side; break;
    case 'jump': an = p.swatT > 0 ? 'swat' : 'jump'; break; case 'steal': an = 'steal'; break; case 'shove': an = 'shove'; break; case 'punch': an = 'punch'; break; case 'clothes': an = 'clothes'; o.sp = 1; o.ph = p.runPh; break; case 'pass': an = 'pass'; o.flashy = p.flashy; o.pk = p.pk; break;
    case 'celeb': an = 'celeb'; o.style = p.b.moves.celeb; break;
    default:
      if (hasBall && (p.live === 'hold' || p.live === 'dead')) { an = 'hold'; }
      else if (hasBall) { an = 'dribble'; o.sp = spN; o.ph = p.runPh; o.dr = p.dribH === undefined ? 0.8 : p.dribH; o.hand = p.drib ? p.drib.hand : p.hand; o.protect = p.protect; if (p.post) { o.post = 1; o.dr = Math.min(o.dr, 0.5); } }
      else if (p.callT > 0 && p.speed < 2) an = 'call';
      else if (p.def && M_.phase === 'live') { an = 'slide'; o.ph = p.runPh; o.up = p.handsUp; o.bodyUp = p.bodyUp ? 1 : 0; if (p.sprinting) { an = 'run'; o.sp = spN; } }
      else if (p.speed > 0.4) { an = 'run'; o.sp = spN; o.ph = p.runPh; }
      else if (B.state === 'pass' && B.target === p) an = 'catch';
      if (!hasBall && B.state === 'shot' && B.t > 0.25 && dHoop(p) < 4.5 && p.speed < 2.5 && p.st === 'free') an = 'boxout';
      if (B.state === 'pass' && B.target === p && Math.hypot(B.pos.x - p.x, B.pos.z - p.z) < 4) o.catchArms = true;
      else if (M_.phase === 'scored' && M_.lastScorer && !M_.lastScorer.dead && M_.lastScorer.team !== p.team) an = 'sulk';
  }
  if (p.forceAn && p.st === 'free' && !hasBall) { an = p.forceAn; o.ph = p.runPh; }
  if (an === 'idle') { o.ph = p.i * 1.7; o.tired = clamp((35 - (p.stam === undefined ? 100 : p.stam)) / 35, 0, 1); o.alert = M_.phase === 'live' ? clamp(1.6 - Math.hypot(B.pos.x - p.x, B.pos.z - p.z) / 4, 0, 1) : 0; }      /* readier the closer the ball, heavier when gassed */
  if (p.st !== 'finish' && p.st !== 'move') R.extraYaw = 0;       /* whatever ended a spin or a reverse, the body faces where it faces */
  if (!hasBall && an !== 'stagger' && an !== 'sulk' && an !== 'celeb' && p.st !== 'finish' && p.st !== 'move') { let a = Math.atan2(B.pos.x - p.x, B.pos.z - p.z) - p.face; while (a > Math.PI) a -= 6.2832; while (a < -Math.PI) a += 6.2832; o.look = p.def && p.guard && p.guard !== B.holder && B.state === 'held' ? a * 0.5 : a; }      /* guarding off the ball: the body is on your man, the head only half-turns to the ball (see both) */
  if (p.speed > 2 && (an === 'run' || an === 'dribble')) { let a = Math.atan2(p.vx || 0, p.vz || 0) - p.face; while (a > Math.PI) a -= 6.2832; while (a < -Math.PI) a += 6.2832; o.bank = -a * 0.35 * spN; }
  // presentation velocity from actual movement (works the same on a guest, who only gets positions)
  let avx = (p.x - (p.lx === undefined ? p.x : p.lx)) / dt, avz = (p.z - (p.lz === undefined ? p.z : p.lz)) / dt; p.lx = p.x; p.lz = p.z;
  if (Math.hypot(avx, avz) * dt > 1) { avx = avz = 0; p.avx = p.avz = p.pavx = p.pavz = 0; if (B.holder === p) p.reset = true; }   // placed, not moved (a check, a reset)
  avx = clamp(avx, -12, 12); avz = clamp(avz, -12, 12);
  p.avx = lerp(p.avx || 0, avx, 0.5); p.avz = lerp(p.avz || 0, avz, 0.5);
  const fwdA = ((p.avx - (p.pavx || 0)) * Math.sin(p.face) + (p.avz - (p.pavz || 0)) * Math.cos(p.face)) / dt; p.pavx = p.avx; p.pavz = p.avz;
  p.leanF = lerp(p.leanF || 0, clamp(fwdA * 0.016, -0.24, 0.26), 1 - Math.exp(-9 * dt)); o.leanF = p.leanF;
  const asp = Math.hypot(p.avx, p.avz);
  if (asp > 0.6 && (p.st === 'free' || p.st === 'move')) { let a = Math.atan2(p.avx, p.avz) - p.face; while (a > Math.PI) a -= 6.2832; while (a < -Math.PI) a += 6.2832; if (Math.abs(a) < 2.3) o.hipYaw = clamp(a, -0.6, 0.6) * Math.min(1, asp / 3) * 0.75; }
  if (p.bumpT > 0) { p.bumpT -= dt; const k = p.bumpT / 0.3; o.bump = [p.bumpX * k, p.bumpZ * k]; }
  if (R.gait && (an === 'run' || an === 'dribble' || an === 'slide')) o.ph = R.gait.ph;       // arms swing with the feet that are actually stepping
  p.an = an;
  const t = an === 'idle' || an === 'celeb' || an === 'call' || an === 'sulk' ? M_.time : an === 'fake' ? 0.3 + p.t : p.t;
  // running forward at speed (with or without the ball): the legs follow real running curves on a stride clock that
  // advances with distance (knee drive, heel recovery, a flight phase); arms stay with the ball when dribbling.
  // Sideways, backwards, slow or defensive movement keeps the planted-feet stepping.
  let P = poseOf(an, t, o), duty = 0.38;
  { const yawR = p.face + (R.extraYaw || 0); let da = Math.atan2(p.avx, p.avz) - yawR; da = Math.atan2(Math.sin(da), Math.cos(da));
    const fwd = (an === 'run' || an === 'dribble') && p.st === 'free' && p.y < 0.01 && asp > 1.2 && Math.abs(da) < 0.7 && !p.protect;      /* jogging counts too (was 3 m/s: a half-pushed stick fell back to the old stepping, the "stomp") */
    p.strideW = lerp(p.strideW || 0, fwd ? 1 : 0, 1 - Math.exp(-(fwd ? 9 : 14) * dt)); const w = p.strideW;
    if (w > 0.02) {
      // the same stride clock as walking around the Block: walking gait curves up to a brisk walk, running curves above
      const k = clamp((asp - 2.6) / 3.6, 0, 1), cad = 2.7 + 1.1 * k, wWalk = 1 - clamp((asp - 2.2) / 0.9, 0, 1); duty = 0.4 - 0.14 * k;
      const stepW = R.legLen * 0.74 * clamp(Math.sqrt(asp / 1.35), 0.45, 1.3), step = lerp(Math.max(asp, 0.5) / cad, stepW, wWalk); p.psi = ((p.psi || 0) + asp * dt / (2 * step)) % 1;
      let Pr = null;
      if (wWalk < 1) { let lo = 0.3, hi = 2.2; const need = asp * duty * 2 / cad - 0.1; for (let i = 0; i < 10; i++) { const m = (lo + hi) / 2; if (R.legLen * 0.92 * (Math.sin((3 + 20 * m) * D2R) + Math.sin((20 * m - 3) * D2R)) < need) lo = m; else hi = m; }
        Pr = poseOf('sprint', 0, { psi: p.psi, duty, k, hipA: Math.min(lo, 1.5), flight: (0.5 - duty) * 2 / cad, thigh: R.thigh, shin: R.shin }); }
      if (wWalk > 0) { let lo = 0.2, hi = 2.4; const need = 1.2 * stepW - 0.12; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (R.legLen * (Math.sin((11 + 19 * m) * D2R) + Math.sin((20 * m - 11) * D2R)) < need) lo = m; else hi = m; }
        const amp = clamp(Math.sqrt(asp / 1.35), 0.45, 1.3), Pw = poseOf('gait', 0, { psi: p.psi, amp, hipA: Math.min(lo, 1.6), swag: R.prof ? 0.2 + R.prof.swag * 0.4 : 0.3, thigh: R.thigh, shin: R.shin, leg: R.legLen });
        Pr = Pr ? blendPose(Pr, Pw, wWalk) : Pw; }
      duty = lerp(duty, 0.6, wWalk);
      const mix = (key, ww) => { const a = P[key] || POSE.zero, b = Pr[key] || POSE.zero; P[key] = [lerp(a[0], b[0], ww), lerp(a[1], b[1], ww), lerp(a[2], b[2], ww)]; };
      for (const key of ['hpR', 'knR', 'anR', 'hpL', 'knL', 'anL']) mix(key, w); P.y = lerp(P.y || 0, Pr.y, w);
      const ub = an === 'run' ? w : w * 0.45; for (const key of ['hips', 'spine', 'chest', 'neck']) mix(key, ub);
      if (an === 'dribble') { P.spine[0] += 0.2 * w; P.chest[0] += 0.12 * w; P.neck[0] -= 0.26 * w; }
      if (an === 'run') for (const key of ['shR', 'elR', 'wrR', 'shL', 'elL', 'wrL']) mix(key, w); else { const off = (o.hand === 'L') ? 'R' : 'L'; for (const key of ['sh' + off, 'el' + off, 'wr' + off]) mix(key, w * 0.95); }
      if (o.leanF) P.spine[0] += o.leanF * w * 0.5; P.rate = Math.max(P.rate || 16, 16 + 24 * w);
      const uR = p.psi, uL = (p.psi + 0.5) % 1; p.stR = uR < duty; p.stL = uL < duty;
    }
  }
  // layers (anim.js): profile posture on the moving poses, a landing that soaks up the drop; then the transition rate
  // out of whatever the body was doing (it always blends from its current pose; gameplay never waits for it)
  profilePosture(P, an, R.prof); landLayer(P, R, p, dt, R.prof);
  if (an !== R.anPrev) { const r = transRate(R.anPrev || an, an), rec = R.prof ? R.prof.recovery : 1; R.trRate = /^(shoot|jump|swat|stagger|dunk|layup|floater|hop)$/.test(R.anPrev || '') ? r * rec : r; R.trPair = !!TRANS[(R.anPrev || '') + '>' + an]; R.trT = 0; R.anPrev = an; }
  R.trT = (R.trT || 0) + dt; if (R.trT < 2.5 / R.trRate) P.rate = R.trPair ? lerp(R.trRate, P.rate || 16, R.trT * R.trRate / 2.5) : Math.max(P.rate || 16, R.trRate);
  applyPose(R, P, dt);
  R.root.position.set(p.x, p.y, p.z); R.root.rotation.y = p.face + (R.extraYaw || 0);
  if ((p.strideW || 0) > 0.3) gaitLock(R, p.psi, R.root.rotation.y, p.strideW, duty); else R.lock = null;
  const air = p.y > 0.01 || p.st === 'finish' || (p.st === 'hop' && p.t < (p.hop ? p.hop.dur : HOP_T) * 0.7) || (p.st === 'jump' && p.t > 0.04);
  gaitStep(R, { x: p.x, z: p.z, yaw: R.root.rotation.y, vx: p.avx, vz: p.avz, grounded: !air, quick: p.st === 'move' ? 1 : 0, wide: an === 'slide' ? 1 : p.protect ? 0.6 : an === 'idle' || an === 'catch' ? 0.25 : 0.05, want: (p.st === 'stagger' ? (p.stg && p.stg.fall ? 0 : 0.4) : 1) * (1 - (p.strideW || 0)), dt });
  legIK(R, dt);
  R.shadow.position.y = 0.015 - p.y; R.shadow.scale.setScalar(clamp(1 - p.y * 0.25, 0.4, 1)); p.ring.position.y = 0.02 - p.y;
  if (p.ptr) { const guest = M_.net === 'guest', near = () => { let best = null, bd = 1e9; for (const q of M_.P) if (q.team !== p.team) { const d = dist(q, p); if (d < bd) { bd = d; best = q; } } return best; };      /* a guest doesn't run the defense brain: point at the closest man */
    const tg = (guest ? M_.off !== p.team : p.def) && M_.phase === 'live' && (p.man || p.guard || (guest ? near() : null));      /* your matchup from the opening check, not whoever you happen to be near */ p.ptr.visible = !!tg && dist(tg, p) > 0.5;
    if (p.ptr.visible) { p.ptr.position.y = 0.03 - p.y; p.ptr.rotation.y = Math.atan2(tg.x - p.x, tg.z - p.z) - R.root.rotation.y; p.ptr.children[0].material.opacity = 0.6 + 0.3 * Math.sin(M_.time * 6); } }
  R.capeSwing = lerp(R.capeSwing || 0, spN * 0.9 + (p.y > 0.2 ? 0.5 : 0), 0.1);
  if (p.arrow) { p.arrow.position.y = p.H + 0.36 + Math.sin(M_.time * 5) * 0.04; p.arrow.rotation.y += dt * 3; }
  if (p.tag) p.tag.position.set(p.x, 0.04, p.z + 0.62);      /* just in front of the feet, toward the camera */
  // ring colours: your matchup glows when you are on defence
  if (!p._puRing) { const marked = !p.user && M_.me && M_.me.def && (M_.me.man || M_.me.guard) === p && M_.phase === 'live'; p.ring.material.color.setHex(p.teamCol); p.ring.scale.setScalar(marked ? 1.2 + 0.08 * Math.sin(M_.time * 6) : 1); }      /* your matchup's ring pulses */
  if (p.bravT > 0 || p.fire) { if (Math.random() < 0.35) burst(p.x + rnd(-0.3, 0.3), rnd(0.2, 1.8) + p.y, p.z + rnd(-0.3, 0.3), p.fire ? 0xff7a1f : 0xffc531, 1); }
  if (p.sprinting && p.speed > 4 && Math.sin(p.runPh) * Math.sin(p.runPh - dt * 12) < 0 && p.user) sfxM('step');
}

function matchCam(dt) {
  const M_ = MT, hs = M_.locals.length ? M_.locals : [M_.me || M_.P[0]]; let fx = 0, fz = 0; for (const h of hs) { fx += h.x; fz += h.z; } fx /= hs.length; fz /= hs.length;
  const portrait = innerWidth < innerHeight, B = M_.B;
  // lean the frame toward the ball so passes and boards stay on screen
  if (M_.spectate) { fx = B.pos.x * 0.7; fz = clamp(B.pos.z, 2, 8) * 0.6 + 2; }
  fx = lerp(fx, B.pos.x, 0.25); fz = lerp(fz, B.pos.z, 0.2);
  const back = portrait ? 8.6 : 7.4, up = portrait ? 4.9 : 4.3;
  _v.set(fx * 0.62, up + fz * 0.1, fz + back + (hs.length > 1 ? 2 : 0));
  camera.position.lerp(_v, 1 - Math.exp(-4 * dt));
  const fovT = (portrait ? 74 : 52) - (M_.slow > 0 ? 7 : 0); if (Math.abs(camera.fov - fovT) > 0.05) { camera.fov += (fovT - camera.fov) * (1 - Math.exp(-9 * dt)); camera.updateProjectionMatrix(); }
  if (M_.shake > 0) { M_.shake -= dt; camera.position.x += rnd(-1, 1) * M_.shake * 0.25; camera.position.y += rnd(-1, 1) * M_.shake * 0.25; }
  _v2.set(fx * 0.5, portrait ? 0.2 : 1.5, fz * (portrait ? 0.7 : 0.45) - (portrait ? 0 : 1.2)); M_.look = (M_.look || _v2.clone()); M_.look.lerp(_v2, 1 - Math.exp(-5 * dt)); camera.lookAt(M_.look);
}

function endMatch() {
  const M_ = MT, me = M_.me, cfg = M_.cfg;
  hudShow(false);
  const res = { practice: M_.practice, drill: M_.drill ? { id: M_.drill.id, score: M_.drill.score } : null, rack: M_.rackScore, win: M_.score[0] > M_.score[1], score: M_.score.slice(), stats: me.stats, mode: cfg.mode, tier: cfg.tier, bonusRep: M_.bonusRep || 0, shutout: M_.score[1] === 0 && M_.score[0] > 0, box: M_.P.map(p => ({ n: p.b.name, team: p.team, user: p.user, s: p.stats })) };
  netHostEnd(res); MT = null; cfg.onEnd(res);
}
function quitMatch() { if (!MT) return; const cfg = MT.cfg, pr = MT.practice; hudShow(false); if (MT.net) netLeave(NET.game); MT = null; cfg.onEnd(pr ? { practice: pr, quit: true, rack: 0 } : { quit: true }); }
