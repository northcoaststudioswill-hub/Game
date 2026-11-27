// GOT NEXT — the shootaround: Sharpie's hoop by the tracks, a crate of balls, and nobody keeping score.
// Grab a ball off the crate (E / A / tap the prompt), dribble anywhere, hold SHOOT and let go at the top of your jump.
// Close to the rim it is a layup. Makes drop through the net; misses come off the rim and the board and roll, and you go
// get them. Friends on the Block see you dribbling and see every shot you take (each of you shoots your own balls: the
// shot is sent once, and the same flight plays on their screen).
'use strict';
const SA_R = 0.12, SA_RIM = 0.23, SA_G = 9.8;
// hoop: where the rim's centre is (x, z), and which way the hoop faces (dz: -1 = it faces -z); crate: the balls' rack
function saInit(hoop, crate, balls) {
  const sa = W.sa = { rim: { x: hoop.x, y: 3.05, z: hoop.z }, board: hoop.z - hoop.dz * 0.38, dz: hoop.dz, crate, balls: [], held: null, shot: null, made: 0, att: 0, streak: 0, ghosts: [], pubI: 0 };
  for (const m of balls) sa.balls.push({ m, x: m.position.x, y: m.position.y, z: m.position.z, vx: 0, vy: 0, vz: 0, st: 'rack', hx: m.position.x, hy: m.position.y, hz: m.position.z });
  W.spots.push({ x: crate.x, z: crate.z - 0.9, r: 1.5, label: 'SHOOTAROUND · grab a ball', fn: saGrab, sa: true });
}
function saGrab() {
  const sa = W.sa; if (!sa) return;
  if (sa.held) { const b = sa.held; sa.held = null; b.st = 'rack'; b.x = b.hx; b.y = b.hy; b.z = b.hz; b.vx = b.vy = b.vz = 0; document.body.classList.remove('saBall'); sfx('ui'); return; }      /* back on the crate */
  const b = sa.balls.find(q => q.st === 'rack'); if (!b) { toast('CRATE IS EMPTY', 'Go get one off the ground.'); return; }
  saHold(b);
}
function saHold(b) { const sa = W.sa; b.st = 'held'; sa.held = b; document.body.classList.add('saBall'); sfx('bounce'); if (!sa.told) { sa.told = true; toast('SHOOTAROUND', (typeof I_PAD === 'function' && I_PAD() ? 'Hold Ⓧ' : document.body.classList.contains('touch') ? 'Hold SHOOT' : 'Hold SPACE') + ', let go at the top of your jump. Close in, it is a layup.'); } }
// the player's shot: called every frame from worldStep (after the move, before the pose)
function saStep(dt, me, I, busy) {
  const sa = W.sa; if (!sa) return;
  const b = sa.held, R = me.rig;
  // pick a loose ball up by walking onto it
  if (!b && !sa.shot) for (const q of sa.balls) if (q.st === 'loose' && q.y < 1.0 && Math.hypot(q.x - me.x, q.z - me.z) < 0.65) { saHold(q); break; }
  if (b && !sa.shot && !busy && I.bP) {      // start the shot: face the rim, plant
    const d = Math.hypot(sa.rim.x - me.x, sa.rim.z - me.z), lay = d < 2.1;
    sa.shot = { t: 0, lay, d, rel: lay ? 0.42 : 0.58 + 0.04 * Math.min(1, d / 7), done: false, x0: me.x, z0: me.z, dir: Math.atan2(sa.rim.x - me.x, sa.rim.z - me.z) };
    if (lay) { const k = Math.max(0, d - 0.9) / Math.max(d, 0.01); sa.shot.lx = (sa.rim.x - me.x) * k; sa.shot.lz = (sa.rim.z - me.z) * k; }      /* the layup carries him in toward the rim */
  }
  const s = sa.shot;
  if (s) { s.t += dt; me.vx = me.vz = 0; me.face = lerpAng(me.face, s.dir, 1 - Math.exp(-14 * dt));
    if (s.lay && s.t < s.rel) { const k = dt / s.rel; me.x += s.lx * k; me.z += s.lz * k; }
    if (!s.done && (s.lay ? s.t >= s.rel : (!I.b || s.t > s.rel + 0.32))) { s.done = true; saRelease(me, s); }
    if (s.t > s.rel + 0.55) sa.shot = null; }
  // where the ball is while you have it: dribbling at your side, or in your hands for the shot
  if (b && b.st === 'held') {
    if (s) { const hp = handPos(R, 'R', new THREE.Vector3()), hl = handPos(R, 'L', new THREE.Vector3()); b.x = (hp.x + hl.x) / 2; b.y = (hp.y + hl.y) / 2 + 0.08; b.z = (hp.z + hl.z) / 2; }
    else { const hgt = Math.abs(Math.sin(W.t * 7.5)), sf = Math.sin(me.face), cf = Math.cos(me.face); b.x = me.x + sf * 0.3 - cf * 0.27; b.y = 0.125 + hgt * 0.75; b.z = me.z + cf * 0.3 + sf * 0.27; if (hgt < 0.08 && !sa.bt) { sa.bt = 1; } else if (hgt > 0.3) sa.bt = 0; }
  }
  saPhysics(dt);
  // the prompt: your count while you are on it
  const sp = W.spots.find(x => x.sa); if (sp) sp.label = sa.held ? 'PUT IT BACK' : sa.att ? `SHOOTAROUND ${sa.made}/${sa.att} · grab a ball` : 'SHOOTAROUND · grab a ball';
}
// let it go: how good the release was, the shooter's touch from there, and a flight that goes in or does not
function saRelease(me, s) {
  const sa = W.sa, b = sa.held; if (!b) return; sa.held = null; document.body.classList.remove('saBall');
  const d = Math.hypot(sa.rim.x - b.x, sa.rim.z - b.z), A = S.attrs || {}, att = s.lay ? (A.layup || 60) : d < 6.75 ? (A.mid || 60) : (A.three || 60), sk = clamp((att - 25) / 74, 0, 1.1);
  const off = s.lay ? 0 : Math.abs(s.t - s.rel), green = !s.lay && off < 0.035 + 0.015 * sk, q = s.lay ? 1 : clamp(1 - off / 0.2, 0, 1);
  const base = s.lay ? 0.86 : d < 4.5 ? 0.6 : d < 6.75 ? 0.5 : d < 8.5 ? 0.42 : 0.14;
  const make = green && d < 9 ? true : Math.random() < base * (0.7 + 0.5 * sk) * (0.35 + 0.65 * q);
  // aim: the middle of the rim for a make, a spot on the iron for a miss (short, long or off the side)
  let tx = sa.rim.x, tz = sa.rim.z; if (!make) { const a = Math.random() * Math.PI * 2, r = rnd(0.2, 0.34); tx += Math.cos(a) * r; tz += Math.sin(a) * r; }
  const ty = sa.rim.y + (make ? 0.02 : 0.05), T = s.lay ? 0.55 : clamp(0.78 + d * 0.085, 0.85, 1.45);
  const L = { x: b.x, y: b.y, z: b.z, vx: (tx - b.x) / T, vy: (ty - b.y + 0.5 * SA_G * T * T) / T, vz: (tz - b.z) / T };
  saLaunch(b, L); sa.att++; sa.pubI++; sa.pub = Object.assign({ i: sa.pubI }, roundL(L));
  sfx(green ? 'green' : 'whoosh'); if (green) bubble(me.rig.root, 'GREEN', 1.6, me.rig.H + 0.4);
}
function roundL(L) { const o = {}; for (const k in L) o[k] = Math.round(L[k] * 1000) / 1000; return o; }
function saLaunch(b, L) { b.st = 'air'; b.x = L.x; b.y = L.y; b.z = L.z; b.vx = L.vx; b.vy = L.vy; b.vz = L.vz; b.scored = false; b.counted = false; b.t = 0; }
// the flight, the rim, the board, the net, the ground. Fixed small steps, so a friend's copy of a shot flies the same way.
function saPhysics(dt) {
  const sa = W.sa; sa.acc = (sa.acc || 0) + Math.min(dt, 0.1);
  while (sa.acc >= 1 / 120) { sa.acc -= 1 / 120; for (const b of sa.balls.concat(sa.ghosts)) if (b.st === 'air' || b.st === 'loose') saBallStep(b, 1 / 120); }
  for (const b of sa.balls) b.m.position.set(b.x, b.y, b.z);
  for (let i = sa.ghosts.length - 1; i >= 0; i--) { const g = sa.ghosts[i]; g.m.position.set(g.x, g.y, g.z); g.life -= dt; if (g.life <= 0) { scene.remove(g.m); sa.ghosts.splice(i, 1); } }
}
function saBallStep(b, h) {
  const sa = W.sa, rim = sa.rim; b.t = (b.t || 0) + h;
  b.vy -= SA_G * h; b.x += b.vx * h; b.y += b.vy * h; b.z += b.vz * h;
  // the rim: a ring of radius SA_RIM; the ball bounces off the nearest point of the iron
  const dx = b.x - rim.x, dz = b.z - rim.z, rh = Math.hypot(dx, dz) || 1e-4, cx = rim.x + dx / rh * SA_RIM, cz = rim.z + dz / rh * SA_RIM;
  const nx = b.x - cx, ny = b.y - rim.y, nz = b.z - cz, nd = Math.hypot(nx, ny, nz);
  if (nd < SA_R + 0.01 && nd > 1e-4) { const ux = nx / nd, uy = ny / nd, uz = nz / nd, vn = b.vx * ux + b.vy * uy + b.vz * uz;
    if (vn < 0) { b.vx -= 1.55 * vn * ux; b.vy -= 1.55 * vn * uy; b.vz -= 1.55 * vn * uz; b.vx *= 0.9; b.vz *= 0.9; sfx('rim'); }
    const push = SA_R + 0.01 - nd; b.x += ux * push; b.y += uy * push; b.z += uz * push; }
  // the board: a plane behind the rim
  const bz = sa.board, toward = sa.dz;      /* the side of the board the shooter is on */
  if (Math.abs(b.x - rim.x) < 0.9 && b.y > 2.9 && b.y < 3.95 && (b.z - bz) * toward < SA_R && (b.z - bz) * toward > -0.3) { const vIn = b.vz * toward; if (vIn < 0) { b.vz = -b.vz * 0.6; sfx('thud'); } b.z = bz + toward * SA_R; }
  // through the net: crosses the rim's height going down, inside the ring
  if (!b.scored && b.vy < 0 && b.y < rim.y && b.y > rim.y - 0.25 && rh < SA_RIM - SA_R * 0.55 && b.prevY >= rim.y) { b.scored = true; b.vx *= 0.2; b.vz *= 0.2; b.vy = Math.min(b.vy, -2.4); saMade(b); }
  if (b.scored && b.y > rim.y - 0.5 && b.y < rim.y) { b.vx *= 0.9; b.vz *= 0.9; b.x += (rim.x - b.x) * 0.08; b.z += (rim.z - b.z) * 0.08; }      /* the net holds it */
  b.prevY = b.y;
  // the ground, and the edges of the Block
  if (b.y < SA_R) { b.y = SA_R; if (b.vy < -0.8) sfx('bounce'); b.vy = -b.vy * 0.62; b.vx *= 0.86; b.vz *= 0.86; if (Math.abs(b.vy) < 0.5) { b.vy = 0; b.vx *= 0.985; b.vz *= 0.985; } b.st = b.ghost ? b.st : 'loose'; }
  const B = W.bounds; if (b.x < B[0] || b.x > B[1]) { b.x = clamp(b.x, B[0], B[1]); b.vx = -b.vx * 0.5; } if (b.z < B[2] || b.z > B[3]) { b.z = clamp(b.z, B[2], B[3]); b.vz = -b.vz * 0.5; }
  for (const s of W.solids) if (b.y < 1.2 && b.x > s[0] && b.x < s[1] && b.z > s[2] && b.z < s[3]) { const px = Math.min(b.x - s[0], s[1] - b.x), pz = Math.min(b.z - s[2], s[3] - b.z); if (px < pz) { b.x = b.x - s[0] < s[1] - b.x ? s[0] : s[1]; b.vx = -b.vx * 0.5; } else { b.z = b.z - s[2] < s[3] - b.z ? s[2] : s[3]; b.vz = -b.vz * 0.5; } }
  if (b.st === 'loose' && Math.hypot(b.vx, b.vz) < 0.05 && b.y <= SA_R + 0.001) { b.vx = b.vz = 0; }
}
function saMade(b) {
  const sa = W.sa; sfx(Math.random() < 0.5 ? 'swish' : 'net2'); if (b.ghost) return;
  sa.made++; sa.streak++;
  const me = W.me, t = sa.streak >= 10 ? 'ON FIRE · ' + sa.streak + ' STRAIGHT' : sa.streak >= 3 ? sa.streak + ' IN A ROW' : pick(['BUCKET', 'COOKIES', 'WET', 'CASH']);
  bubble(me.rig.root, t, 1.8, me.rig.H + 0.4);
}
// a miss breaks the streak once the ball is on the ground without having gone in
function saStreakCheck() { const sa = W.sa; if (!sa) return; for (const b of sa.balls) if (b.st === 'loose' && !b.scored && !b.counted && b.t > 0.3) { b.counted = true; sa.streak = 0; } else if (b.st === 'loose' && b.scored) b.counted = true; }
// the pose: dribbling while you have it, the jumper or the layup while you shoot. Returns true when it posed the rig.
function saPose(R, me, dt, v) {
  const sa = W.sa; if (!sa) return false; saStreakCheck();
  if (sa.shot) { const s = sa.shot, u = clamp(s.t / s.rel, 0, 1.6), jumpH = s.lay ? 0.45 : 0.28 + 0.1 * clamp(((S.attrs || {}).vert || 60) / 99, 0, 1), y = jumpH * Math.max(0, Math.sin(Math.PI * clamp((s.t - s.rel * 0.35) / (s.rel * 1.25), 0, 1)));
    R.root.position.set(me.x, y, me.z); R.root.rotation.y = me.face; applyPose(R, s.lay ? poseOf('layup', s.t, { u: clamp(s.t / (s.rel + 0.3), 0, 1), leg: R.legLen }) : poseOf('shoot', s.t, { rel: s.rel, prof: R.prof, n: 0 }), dt); R.gait = null; return true; }
  if (sa.held) { R.root.position.set(me.x, 0, me.z); R.root.rotation.y = me.face; applyPose(R, poseOf('dribble', W.t, { ph: me.ph, leg: R.legLen, sp: v, dr: Math.abs(Math.sin(W.t * 7.5)) }), dt); R.gait = null; return true; }
  return false;
}
// friends: what you send (holding a ball, your last shot), and what you see of theirs
function saPresence(patch, P) {
  const sa = W && W.sa, hb = sa && sa.held ? 1 : 0; if (hb !== (P.sahb | 0)) { P.sahb = hb; patch.sahb = hb; }
  if (sa && sa.pub && (!P.sas || P.sas.i !== sa.pub.i)) { P.sas = sa.pub; patch.sas = sa.pub; }
}
function saPeer(g, pr, dt) {
  const sa = W.sa; if (!sa) return false;
  if (pr.sas && typeof pr.sas.i === 'number' && pr.sas.i !== g.sasI) { const first = g.sasI === undefined; g.sasI = pr.sas.i; if (!first) { const L = pr.sas; if ([L.x, L.y, L.z, L.vx, L.vy, L.vz].every(Number.isFinite)) { const m = makeBall('bl_std'); scene.add(m); const gb = { m, ghost: true, life: 6, st: 'air' }; saLaunch(gb, L); gb.st = 'air'; gb.ghost = true; sa.ghosts.push(gb); g.shootT = 0.75; } } }
  if (pr.sahb && !g.ball) { g.ball = makeBall('bl_std'); scene.add(g.ball); } else if (!pr.sahb && g.ball) { scene.remove(g.ball); g.ball = null; }
  if (g.shootT > 0) { g.shootT -= dt; g.rig.root.position.set(g.x, 0.25 * Math.sin(Math.PI * clamp(1 - g.shootT / 0.75, 0, 1)), g.z); g.rig.root.rotation.y = g.f; applyPose(g.rig, poseOf('shoot', 0.75 - g.shootT, { rel: 0.5, prof: g.rig.prof, n: 0 }), dt); g.rig.gait = null; return true; }
  if (g.ball) { const hgt = Math.abs(Math.sin(W.t * 7.5 + 1)), sf = Math.sin(g.f), cf = Math.cos(g.f); g.ball.position.set(g.x + sf * 0.3 - cf * 0.27, 0.125 + hgt * 0.75, g.z + cf * 0.3 + sf * 0.27); g.rig.root.position.set(g.x, 0, g.z); g.rig.root.rotation.y = g.f; applyPose(g.rig, poseOf('dribble', W.t, { ph: g.ph, leg: g.rig.legLen, sp: 0, dr: hgt }), dt); g.rig.gait = null; return true; }
  return false;
}
function saPeerGone(g) { if (g.ball) { scene.remove(g.ball); g.ball = null; } }
