// GOT NEXT — the grind: drills that pay HC, H-O-R-S-E with Sharpie, the 1v1 ladder in The Cages, the old head's daily
// contracts and the daily event. Drills run on the practice court with the real shooting and finishing; a drill only
// places you, hands you the ball, and counts what happens.
'use strict';

// ---------- spots on the half court (rim at 0,0; +z away from the baseline) ----------
const SPOT3 = [[-6.9, 0.6], [-5.2, 4.6], [0, 7.1], [5.2, 4.6], [6.9, 0.6]];
const SPOTMID = [[-4.3, 0.5], [-3.8, 2.8], [-2.4, 4.3], [0, 4.9], [2.4, 4.3], [3.8, 2.8], [4.3, 0.5]];
const FT = [0, 4.6];

// ---------- the drills ----------
// medals: score for bronze / silver / gold.  pay: [base HC, HC per point].  cat: smarts XP group.
const DRILL_DEFS = [
  { id: 'layups', n: 'Layup Lines', cat: 'F', time: 45, medals: [8, 12, 16], pay: [30, 6], unit: 'pts',
    d: 'Start at a cone, attack the rim, finish. Alternate sides for 45 seconds. Layups 1, dunks 2.',
    tip: 'Push the skill stick up to attack; push sideways as you go up for a euro step.' },
  { id: 'mikan', n: 'Mikan Drill', cat: 'F', time: 30, medals: [9, 13, 17], pay: [25, 6], unit: 'makes',
    d: 'Left side, right side, under the rim. As many finishes as you can in 30 seconds.', tip: 'Flick up the moment the ball is in your hands.' },
  { id: 'ft', n: 'Free Throws', cat: 'S', shots: 10, medals: [6, 8, 10], pay: [20, 8], unit: 'pts',
    d: 'Ten from the line. Every three in a row adds a bonus point.', tip: 'Same release every time. Hold, let go at the top.' },
  { id: 'spots', n: 'Spot Shooting', cat: 'S', shots: 21, medals: [11, 17, 24], pay: [30, 5], unit: 'pts',
    d: 'Seven mid-range spots, three shots each. Makes 1, greens 2.', tip: 'Greens count double. Stand still, take your time.' },
  { id: 'world', n: 'Around the World', cat: 'S', time: 60, medals: [6, 10, 14], pay: [30, 9], unit: 'spots',
    d: 'Make it to move on. Seven spots corner to corner and back. 60 seconds.', tip: 'A miss keeps you where you are. Do not rush the release.' },
  { id: 'three', n: '3-Point Contest', cat: 'S', time: 60, medals: [11, 17, 23], pay: [40, 7], unit: 'pts',
    d: 'Five racks of five around the arc in 60 seconds. The last ball of each rack is the money ball: 2 points.', tip: 'Money balls are the striped ones.' },
  { id: 'catch', n: 'Catch & Shoot', cat: 'S', shots: 10, medals: [9, 15, 21], pay: [35, 6], unit: 'pts',
    d: 'A pass comes to you at a spot on the arc. Catch and fire: a make is 2, a quick release (under 0.8 s) adds 1.', tip: 'Be ready before the ball gets there.' },
  { id: 'weave', n: 'Cone Weave', cat: 'P', time: 22, medals: [160, 230, 290], pay: [30, 0.6], unit: 'pts',
    d: 'Dribble through four cones (toward the rim side of the first, away side of the next), then score. A dribble move at a cone is style points.',
    tip: 'Hit a crossover or spin as you pass a cone.' },
  { id: 'slides', n: 'Defensive Slides', cat: 'D', time: 30, medals: [11, 15, 19], pay: [25, 6], unit: 'touches',
    d: 'No ball. Slide between the lines for 30 seconds. Sprinting does not count: stay in your stance.', tip: 'Move with the stick, keep the sprint button off.' },
];
const DRILL = {}; DRILL_DEFS.forEach(d => DRILL[d.id] = d);

// ---------- the day: one event and three contracts, the same for everyone that day ----------
const DAY_EVENTS = [
  { id: 'grind', n: 'GRIND DAY', d: 'Drills pay 50% more HC.' },
  { id: 'green', n: 'GREEN DAY', d: 'Greens count double in every shooting drill.' },
  { id: 'ladder', n: 'LADDER NIGHT', d: 'Ladder wins in The Cages pay double.' },
  { id: 'horse', n: 'HORSE DERBY', d: 'Beating Sharpie at H-O-R-S-E pays double.' },
  { id: 'bucket', n: 'BUCKET BONANZA', d: 'Games in The Cages pay 25% more HC.' },
  { id: 'fiend', n: 'FIEND APPRECIATION DAY', d: 'Helping a fiend earns 10 Respect instead of 3.' },
];
const CONTRACTS = [
  { id: 'win2', n: 'Win 2 games in The Cages', k: 'wins', t: 2, vc: 260 }, { id: 'pts25', n: 'Score 25 points in games', k: 'pts', t: 25, vc: 220 },
  { id: 'ast6', n: 'Dish 6 assists', k: 'ast', t: 6, vc: 220 }, { id: 'dunk3', n: 'Throw down 3 dunks', k: 'dunks', t: 3, vc: 200 },
  { id: 'green8', n: 'Hit 8 greens', k: 'greens', t: 8, vc: 220 }, { id: 'ank2', n: 'Break ankles twice', k: 'ankles', t: 2, vc: 230 },
  { id: 'drill3', n: 'Finish 3 drills', k: 'drills', t: 3, vc: 200 }, { id: 'dmake30', n: 'Make 30 shots in drills', k: 'drillMakes', t: 30, vc: 220 },
  { id: 'ladder1', n: 'Win a ladder match', k: 'ladderWins', t: 1, vc: 300 }, { id: 'horse1', n: 'Beat Sharpie at H-O-R-S-E', k: 'horseWins', t: 1, vc: 260 },
  { id: 'stl4', n: 'Get 4 steals', k: 'stl', t: 4, vc: 200 }, { id: 'gave2', n: 'Help 2 fiends', k: 'gave', t: 2, vc: 120 },
  { id: 'three5', n: 'Hit 5 deep balls in games', k: 'threes', t: 5, vc: 230 }, { id: 'medal1', n: 'Earn a drill medal you did not have', k: 'medals', t: 1, vc: 250 },
];
const dayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const dayHash = (k, salt) => { let h = 2166136261 ^ salt; for (const c of k) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
function todayEvent() { return DAY_EVENTS[dayHash(dayKey(), 7) % DAY_EVENTS.length]; }
const evOn = id => todayEvent().id === id;
function daily() {
  const k = dayKey();
  if (!S.daily || S.daily.day !== k) {
    const base = {}; for (const c of CONTRACTS) base[c.k] = S.life[c.k] || 0;
    const picks = [], h = dayHash(k, 99); let i = h; while (picks.length < 3) { const c = CONTRACTS[i % CONTRACTS.length].id; if (!picks.includes(c)) picks.push(c); i = (i * 1103515245 + 12345) >>> 0; }
    S.daily = { day: k, base, picks, claimed: [] }; save();
  }
  return S.daily;
}
const lifeAdd = (k, n) => { S.life[k] = (S.life[k] || 0) + (n || 1); };

// =====================================================================
//  RUNNING A DRILL
// =====================================================================
function startDrill(id, back) {
  const def = DRILL[id], fl = cribTier('floor'), home = back === 'crib';
  uiClose(); document.body.dataset.state = 'match';
  startMatch({ mode: { n: def.n.toUpperCase(), size: 1, arcade: false, to: 999 }, tier: TIERS_COURT[0], practice: 'drill', drill: id,
    court: home ? ['drive', 'black', 'show', 'wood'][fl] : 'street', hoopTier: home ? cribTier('hoop') : 2, ball: S.worn.ball,
    teams: [[{ b: myBuild(), ctrl: 0, mine: true }], []], onEnd: res => id === 'horse' ? horseEnd(res) : drillEnd(res, back) });
  MT.drill = { def, id, score: 0, left: def.time || 0, rep: 0, shots: 0, makes: 0, waiting: false, begun: false, data: {}, marks: [] };
  call(def.n.toUpperCase(), def.tip, '#f2c14e', 2.2);
}
function dMark(x, z, col) { const m = M(geo('dmark', () => new THREE.RingGeometry(0.32, 0.46, 24)), new THREE.MeshBasicMaterial({ color: col || 0xf2c14e, transparent: true, opacity: 0.9, depthWrite: false }), x, 0.025, z, scene); m.rotation.x = -Math.PI / 2; MT.drill.marks.push(m); return m; }
function dCone(x, z) { const g = grp(scene, x, 0, z); ink(M(geo('cone', () => new THREE.ConeGeometry(0.18, 0.5, 10)), toon('#ff7a1f'), 0, 0.25, 0, g), 1.08); M(cyl(0.19, 0.19, 0.06, 10), toon('#ece9e2'), 0, 0.18, 0, g); M(box(0.42, 0.03, 0.42), toon('#ff7a1f'), 0, 0.015, 0, g); MT.drill.marks.push(g); return g; }
function dLine(x0, z0, x1, z1, col) { const m = M(box(Math.max(0.06, Math.abs(x1 - x0)), 0.02, Math.max(0.06, Math.abs(z1 - z0))), flat(col || 0xff2d78), (x0 + x1) / 2, 0.02, (z0 + z1) / 2, scene); MT.drill.marks.push(m); return m; }
// put the player on a spot, facing the rim, with or without the ball
function dPlace(x, z, ball) {
  const M_ = MT, me = M_.me, B = M_.B; me.x = x; me.z = z; me.vx = me.vz = 0; me.y = 0; me.st = 'free'; me.t = 0; me.face = Math.atan2(-x, -z); me.buf = null; me.moveCool = 0;
  if (ball === 'pass') { B.state = 'pass'; B.holder = null; B.target = me; B.from = me; B.t = 0; B.tried = {}; B.pos.set(0, 1.4, 0.6); B.y0 = 1.4; B.h0 = Math.max(0.5, Math.hypot(x, z - 0.6)); B.pk = 'chest'; B.speed = 10.5; B.bounced = false; B.oop = false; B.lastTeam = me.team; M_.drill.data.passAt = M_.time; }
  else if (ball === false) { B.state = 'dead'; B.holder = null; B.pos.set(8.6, 0.125, 13.2); }
  else { B.pos.set(x, 1, z); give(me); }
}
const dMark1 = (D, x, z) => { if (!D.cur) D.cur = dMark(x, z, 0x3dffa0); D.cur.position.set(x, 0.025, z); };
const greenX = () => evOn('green') ? 2 : 1;

// each drill: begin (once), rep (set up the next attempt), make / miss, step (every frame), and whether it is done
const DRILL_RUN = {
  layups: {
    begin(D) { dCone(-4.2, 6.4); dCone(4.2, 6.4); },
    rep(D) { const s = D.rep % 2 ? 1 : -1; dPlace(4.2 * s, 6.0, true); },
    make(D, e) { const v = e.how === 'dunk' ? 2 : 1; D.score += v; D.makes++; return '+' + v; },
  },
  mikan: {
    rep(D) { const s = D.rep % 2 ? 1 : -1; dPlace(1.05 * s, 0.75, true); dMark1(D, 1.05 * s, 0.75); },
    make(D) { D.score++; D.makes++; return '+1'; },
  },
  ft: {
    begin(D) { dMark(FT[0], FT[1], 0xece9e2); },
    rep(D) { dPlace(FT[0], FT[1], true); },
    make(D, e) { D.makes++; D.data.streak = (D.data.streak || 0) + 1; let v = 1; if (D.data.streak % 3 === 0) v++; D.score += v; return v > 1 ? '+2 STREAK' : '+1'; },
    miss(D) { D.data.streak = 0; },
    done(D) { return D.shots >= D.def.shots; },
  },
  spots: {
    rep(D) { const s = SPOTMID[Math.floor(D.shots / 3) % SPOTMID.length]; dPlace(s[0], s[1], true); dMark1(D, s[0], s[1]); },
    make(D, e) { const v = (e.green ? 2 : 1) * (e.green ? greenX() : 1); D.score += v; D.makes++; return (e.green ? 'GREEN +' : '+') + v; },
    done(D) { return D.shots >= D.def.shots; },
  },
  world: {
    rep(D) { const i = D.data.at || 0, k = i % 12, idx = k < 7 ? k : 12 - k, s = SPOTMID[idx]; dPlace(s[0], s[1], true); dMark1(D, s[0], s[1]); },
    make(D) { D.data.at = (D.data.at || 0) + 1; D.score++; D.makes++; return 'NEXT SPOT'; },
  },
  three: {
    begin(D) { D.data.racks = SPOT3.map(([x, z], r) => { const g = grp(scene, x * 1.12, 0, z * 1.12 + 0.25); ink(M(box(0.9, 0.5, 0.35), toon('#3a3c44'), 0, 0.25, 0, g), 1.03); const balls = []; for (let i = 0; i < 5; i++) { const b = makeBall(i === 4 ? 'bl_rwb' : S.worn.ball); b.position.set(-0.36 + i * 0.18, 0.6, 0); b.scale.setScalar(0.8); g.add(b); balls.push(b); } D.marks.push(g); return balls; }); },
    rep(D) { const r = Math.floor(D.shots / 5), i = D.shots % 5; if (r >= 5) return; const s = SPOT3[r]; dPlace(s[0], s[1], true); dMark1(D, s[0], s[1]); const b = D.data.racks[r][i]; if (b) b.visible = false; D.data.money = i === 4; },
    make(D, e) { let v = D.data.money ? 2 : 1; if (e.green && evOn('green')) v *= 2; if (e.kind !== 'three') { return 'BEHIND THE LINE!'; } D.score += v; D.makes++; return (D.data.money ? 'MONEY +' : '+') + v; },
    done(D) { return D.shots >= 25; },
  },
  catch: {
    rep(D) { const s = SPOT3[D.shots % 5]; dPlace(s[0], s[1], 'pass'); dMark1(D, s[0], s[1]); D.data.caught = null; D.data.quick = false; },
    step(D) { const me = MT.me; if (MT.B.holder === me && D.data.caught === null) D.data.caught = MT.time; if (me.st === 'shoot' && D.data.caught !== null && D.data.relT === undefined) { D.data.quick = MT.time - D.data.caught < 0.8; D.data.relT = 1; } if (me.st !== 'shoot') D.data.relT = undefined; },
    make(D, e) { let v = 2 + (D.data.quick ? 1 : 0); if (e.green && evOn('green')) v += 1; D.score += v; D.makes++; return D.data.quick ? 'QUICK +' + v : '+' + v; },
    done(D) { return D.shots >= D.def.shots; },
  },
  weave: {
    begin(D) { D.data.cones = [-5, -2.5, 0, 2.5]; D.data.cones.forEach(x => dCone(x, 7.6)); dLine(4.6, 6.4, 4.6, 8.8, 0x3dffa0); D.data.next = 0; D.data.wrong = 0; D.data.style = 0; D.data.styled = {}; D.data.phase = 'weave'; D.data.mn = 0; D.data.el = 0; },
    rep(D) { if (D.rep === 0) { dPlace(-7.2, 7.6, true); MT.me.face = Math.PI / 2; } else if (D.data.phase === 'finish') dPlace(MT.me.x, MT.me.z, true); },
    step(D, dt) {
      const me = MT.me, d = D.data; d.el += dt;
      if ((me.moveN || 0) !== d.mn) { d.mn = me.moveN || 0; const c = d.cones.findIndex(x => Math.abs(me.x - x) < 1.4); if (c >= 0 && !d.styled[c]) { d.styled[c] = 1; d.style++; floatTxt(me, 'STYLE', '#a78bff'); } }
      if (d.phase === 'weave' && d.next < 4 && me.x > d.cones[d.next]) { const want = d.next % 2 === 0 ? 'N' : 'S', got = me.z < 7.6 ? 'N' : 'S'; if (want !== got) { d.wrong++; floatTxt(me, 'WRONG SIDE', '#ff8a3c'); sfx('no'); } else sfx('ui'); d.next++; }
      if (d.phase === 'weave' && d.next >= 4 && me.x > 4.6) { d.phase = 'finish'; d.finishAt = d.el; call('NOW SCORE', '', '#3dffa0', 1); }
    },
    make(D) { if (D.data.phase !== 'finish') return 'FINISH THE COURSE'; D.data.phase = 'done'; D.makes++; D.score = Math.max(0, Math.round((D.def.time - D.data.el) * 10 + D.data.style * 15 + 50 - D.data.wrong * 30)); return 'DONE'; },
    done(D) { return D.data.phase === 'done'; },
    noRepOnMiss(D) { return D.data.phase !== 'finish'; },
  },
  slides: {
    begin(D) { dLine(-3.2, 4.0, -3.2, 7.0); dLine(3.2, 4.0, 3.2, 7.0); MT.off = 1; D.data.side = 1; D.data.warn = 0; },
    rep(D) { if (D.rep === 0) { dPlace(0, 5.5, false); MT.me.faceLock = Math.PI; } },
    step(D, dt) {
      const me = MT.me, d = D.data; me.faceLock = 0 + Math.PI; me.forceAn = me.sprinting ? null : 'slide';
      if (me.sprinting) { d.warn -= dt; if (d.warn <= 0) { floatTxt(me, 'SLIDE, DON\'T RUN', '#ff8a3c'); d.warn = 1.2; } d.cheat = true; }
      if (d.side > 0 ? me.x >= 3.05 : me.x <= -3.05) { if (d.cheat) { d.cheat = false; floatTxt(me, 'NO COUNT', '#ff8a3c'); } else { D.score++; floatTxt(me, '+1', '#3dffa0'); sfx('ui'); } d.side = -d.side; }
    },
  },
};

// events from the court (called by ball.js)
function drillEvent(type, p, e) {
  const D = MT && MT.drill; if (!D || p !== MT.me || !D.begun || D.over) return;
  const R = DRILL_RUN[D.id]; if (D.data.resolved) return; D.data.resolved = true; D.shots++;
  if (type === 'make') { const t = R.make ? R.make(D, e) : '+1'; if (t) floatTxt(p, t, t.startsWith('+') || t.includes('+') ? '#3dffa0' : '#f2c14e'); lifeAdd('drillMakes'); }
  else { if (R.miss) R.miss(D, e); floatTxt(p, pick(CALLS.miss), '#ff8a3c'); }
  D.waiting = true;
}
function drillStep(dt) {
  const M_ = MT, D = M_.drill, B = M_.B, R = DRILL_RUN[D.id]; if (M_.phase !== 'live' || D.over) return;
  if (!D.begun) { D.begun = true; if (R.begin) R.begin(D); R.rep(D); D.data.resolved = false; return; }
  if (D.def.time) { D.left -= dt; if (D.left <= 0 && !D.timeUp) { D.timeUp = true; sfx('buzz'); } }
  if (R.step) R.step(D, dt);
  if (MT !== M_) return;
  const airborne = B.state === 'shot' || (B.state === 'held' && B.holder && (B.holder.st === 'shoot' || B.holder.st === 'finish'));
  // a rep is over once the ball is dead: through the net, bouncing loose, or back in your hands off a rebound
  if (D.waiting && (B.state === 'through' && B.t > 0.45 || B.state === 'loose' && M_.looseT > 0.7 || B.state === 'held' && B.holder === M_.me && M_.me.st === 'free')) {
    D.waiting = false; D.rep++;
    if ((R.done && R.done(D)) || D.timeUp) return drillFinish();
    if (!(R.noRepOnMiss && R.noRepOnMiss(D) && D.data.resolved && B.state !== 'through')) R.rep(D);
    D.data.resolved = false;
  }
  // a loose ball nobody resolved (dropped, walked off) comes back so the drill never stalls
  if (!D.waiting && B.state === 'loose' && M_.looseT > 1.6 && D.id !== 'slides') { if (D.id === 'weave') dPlace(M_.me.x, M_.me.z, true); else R.rep(D); }
  if (D.timeUp && !airborne && !D.waiting) return drillFinish();
  if (R.done && R.done(D) && !airborne && !D.waiting) return drillFinish();
}
function drillFinish() { if (!MT || !MT.drill) return; const D = MT.drill; if (D.over) return; D.over = true; MT.over = true; sfx('buzz'); endMatch(); }
function drillHud() {
  const D = MT.drill, d = D.def; if (!D) return '';
  const right = d.time ? Math.max(0, Math.ceil(D.left)) + 's' : (D.id === 'three' ? '' : (d.shots - D.shots) + ' left');
  const med = d.medals.findIndex(m => D.score < m); const nxt = med < 0 ? 'GOLD' : ['BRONZE', 'SILVER', 'GOLD'][med] + ' ' + d.medals[med];
  return `<span class="ye">${D.score}</span> ${d.unit.toUpperCase()}<br><span style="font-size:15px">${right}${D.id === 'three' ? ' · rack ' + Math.min(5, Math.floor(D.shots / 5) + 1) : ''}</span><br><span style="font-size:11px;color:var(--ash)">${med < 0 ? 'GOLD PACE' : 'NEXT ' + nxt}</span>`;
}

// ---------- results and pay ----------
function drillEnd(res, back) {
  if (back === 'crib') enterWorld('crib', -3.6, 9.6, Math.PI); else enterWorld('hub', -3.2, 3.9, 0);
  if (res.quit || !res.drill) { toast('DRILL STOPPED', 'No pay for a drill you walk out of.'); return; }
  const { id, score } = res.drill, d = DRILL[id], rec = S.drills[id] || (S.drills[id] = { best: 0, medal: 0, runs: 0, day: '', today: 0 });
  const k = dayKey(); if (rec.day !== k) { rec.day = k; rec.today = 0; } rec.today++; rec.runs++;
  const medal = d.medals.filter(m => score >= m).length, newBest = score > rec.best, notes = [];
  // repeats of the same drill on the same day pay less after the third
  const rpt = [1, 1, 1, 0.75, 0.5, 0.35][Math.min(5, rec.today - 1)];
  let vc = Math.round((d.pay[0] + score * d.pay[1]) * rpt * (evOn('grind') ? 1.5 : 1) * (1 + cribFx('vc')));
  let rep = Math.round(score * 0.6 + medal * 6);
  if (rpt < 1) notes.push(`Run ${rec.today} of this drill today: ${Math.round(rpt * 100)}% pay`); if (evOn('grind')) notes.push('GRIND DAY +50%');
  if (medal > rec.medal) { const bonus = [0, 100, 250, 600][medal], rb = [0, 20, 50, 120][medal]; vc += bonus; rep += rb; notes.push(['', 'BRONZE', 'SILVER', 'GOLD'][medal] + ` medal: +${bonus} HC, +${rb} Respect`); lifeAdd('medals', medal - rec.medal); if (medal === 3) lifeAdd('drillGolds'); rec.medal = medal; }
  if (newBest) { rec.best = score; notes.push('Personal best'); }
  S.vc += vc; lifeAdd('drills'); S.bxp[d.cat] += Math.round(10 + score * 1.5); while (S.bxp[d.cat] >= 100) { S.bxp[d.cat] -= 100; S.bp[d.cat]++; notes.push('+1 ' + CATS[d.cat][0] + ' smarts point'); }
  gainRep(rep); checkAch(); save();
  sfx(medal ? 'unlock' : 'buy');
  const mcol = ['#8d8d99', '#c9814a', '#c8d0d8', '#f2c14e'][medal];
  uiDialog(d.n.toUpperCase(), `${score} ${d.unit}. ${medal ? ['', 'Bronze', 'Silver', 'Gold'][medal] + '.' : 'No medal yet: bronze is ' + d.medals[0] + '.'} +${vc} HC · +${rep} Respect.${notes.length ? '  ' + notes.join(' · ') + '.' : ''}`,
    [['Again', () => startDrill(id, back)], ['All drills', () => uiDrills(back)], ['Done', null, 'alt']]);
  setTimeout(() => { const t = $('panel').querySelector('h3'); if (t) t.style.color = mcol; }, 0);
}

// ---------- the drills board ----------
function uiDrills(back, tab0) {
  daily(); let tab = tab0 || 'drills';
  openPanel(() => {
    const ev = todayEvent();
    let h = `<div class="ph"><h2>${back === 'crib' ? 'HOME DRILLS' : 'COACH\'S BOARD'}</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb">`;
    if (back !== 'crib') { h += `<div class="tabs">` + [['drills', 'DRILLS'], ['how', 'HOW IT WORKS'], ['plan', 'LESSON PLAN']].map(([k, n]) => Btn(n, () => { tab = k; rerender(); }, tab === k ? 'sel' : '')).join('') + `</div>`; lessonCheck(); if (tab === 'how') return h + howTab(back) + `</div>`; if (tab === 'plan') return h + lessonTab() + `</div>`; }
    h += `<div class="card sel"><h3 class="ye">TODAY · ${ev.n}</h3><p>${ev.d}</p></div>`;
    h += `<p class="mu">Drills pay HC, Respect and smarts XP. First time to each medal pays a bonus. The same drill pays less after three runs in a day.</p><div class="grid">`;
    for (const d of DRILL_DEFS) {
      const r = S.drills[d.id] || { best: 0, medal: 0 }, m = r.medal || 0;
      h += `<div class="card"><div class="row"><h3 class="g">${d.n}</h3><span class="tag" style="color:${CATS[d.cat][1]}">${CATS[d.cat][0]}</span></div><p>${d.d}</p>
        <div class="pips" style="margin-top:6px">${[1, 2, 3].map(i => `<i style="background:${i <= m ? ['', '#c9814a', '#c8d0d8', '#f2c14e'][i] : 'var(--line)'}"></i>`).join('')}<span class="tag">best ${r.best || 0} · bronze ${d.medals[0]} · silver ${d.medals[1]} · gold ${d.medals[2]}</span></div>
        <div style="margin-top:8px">${Btn('RUN IT', () => startDrill(d.id, back), 'sm')}</div></div>`;
    }
    return h + `</div></div>`;
  });
}

// =====================================================================
//  H-O-R-S-E WITH SHARPIE (a drill-shaped side game)
// =====================================================================
const HORSE = 'HORSE';
DRILL.horse = { id: 'horse', n: 'H-O-R-S-E', cat: 'S', medals: [99, 99, 99], pay: [0, 0], unit: 'letters', tip: 'Make one and he has to match it from the same spot.' };
DRILL_RUN.horse = {
  begin(D) { const b = aiBuild(75, 'sniper'); b.name = 'Sharpie'; b.worn.head = 'hd_cap'; D.data.npc = makeRig(b); D.data.npc.root.position.set(6.8, 0, 9); scene.add(D.data.npc.root); D.data.you = 0; D.data.him = 0; D.data.turn = 'you'; D.data.mode = 'set'; D.data.npcT = 0; },
  rep(D) { const d = D.data; if (d.mode === 'set' && d.turn === 'you') dPlace(d.lastX === undefined ? 0 : d.lastX, d.lastZ === undefined ? 6.5 : d.lastZ, true); else if (d.mode === 'match' && d.turn === 'you') { dPlace(d.spot[0], d.spot[1], true); dMark1(D, d.spot[0], d.spot[1]); } else dPlace(MT.me.x, MT.me.z, false); },
  make(D, e) {
    const d = D.data, me = MT.me;
    if (d.mode === 'set') { d.spot = [me.x, me.z]; d.lastX = me.x; d.lastZ = me.z; d.turn = 'npc'; d.mode = 'match'; d.npcT = 1.2; return 'HE HAS TO MATCH'; }
    d.mode = 'set'; d.turn = 'npc'; d.npcT = 1.0; return 'MATCHED';
  },
  miss(D) { const d = D.data; if (d.mode === 'match') { d.you++; floatTxt(MT.me, 'LETTER: ' + HORSE.slice(0, d.you), '#ff8a3c'); d.mode = 'set'; d.turn = 'npc'; d.npcT = 1.0; } else { d.turn = 'npc'; d.mode = 'set'; d.npcT = 1.0; } },
  step(D, dt) {
    const d = D.data, n = d.npc; if (!n) return; d.t = (d.t || 0) + dt;
    applyPose(n, poseOf(d.shooting > 0 ? 'shoot' : 'idle', d.shooting > 0 ? 0.9 - d.shooting : d.t, { rel: 0.6, leg: n.legLen }), dt); n.root.updateMatrixWorld(true);
    if (d.shooting > 0) { d.shooting -= dt; if (d.shooting <= 0) d.resolveNpc(); }
    if (d.turn !== 'npc' || D.waiting || d.shooting > 0 || d.you >= 5 || d.him >= 5) return;
    d.npcT -= dt; if (d.npcT > 0) return;
    // Sharpie's shot: matching yours, or calling his own
    const set = d.mode === 'set', sp = set ? pick(SPOTMID.concat(SPOT3)) : d.spot, dd = Math.hypot(sp[0], sp[1]);
    n.root.position.set(sp[0], 0, sp[1]); n.root.rotation.y = Math.atan2(-sp[0], -sp[1]); d.shooting = 0.9; sfx('whoosh');
    const pMake = clamp((dd < 3 ? 0.8 : dd < 6.6 ? 0.6 : 0.45) - (set ? 0.05 : 0) - Math.max(0, dd - 7) * 0.08, 0.2, 0.85);
    d.resolveNpc = () => {
      const made = Math.random() < pMake, who = { x: sp[0], z: sp[1], y: 0, H: 1.9 };
      if (made) { sfx('swish'); hudFloat(who, 'SHARPIE: BUCKET', '#ece9e2'); } else { sfx('rim'); hudFloat(who, 'SHARPIE: CLANK', '#8d8d99'); }
      if (set) { if (made) { d.spot = sp; d.mode = 'match'; d.turn = 'you'; call('MATCH IT', 'From where he stands', '#f2c14e', 1.2); } else { d.mode = 'set'; d.turn = 'you'; } }
      else { if (!made) { d.him++; call('SHARPIE GETS ' + HORSE[d.him - 1], HORSE.slice(0, d.him), '#3dffa0', 1.2); } d.mode = 'set'; d.turn = 'you'; }
      n.root.position.set(6.8, 0, 9);
      if (d.him >= 5 || d.you >= 5) { D.score = d.him >= 5 ? 1 : 0; return drillFinish(); }
      DRILL_RUN.horse.rep(D); D.data.resolved = false;
    };
  },
  done(D) { return D.data.you >= 5 || D.data.him >= 5; },
};
function horseHud() { const d = MT.drill.data, l = n => HORSE.split('').map((c, i) => `<span style="color:${i < n ? 'var(--heat)' : 'var(--line)'}">${c}</span>`).join(''); return `<span style="font-size:16px">YOU ${l(d.you)}<br>SHARPIE ${l(d.him)}</span><br><span style="font-size:11px;color:var(--ash)">${d.turn === 'you' ? (d.mode === 'match' ? 'MATCH HIS SHOT' : 'YOUR SHOT: ANYWHERE') : 'SHARPIE SHOOTS'}</span>`; }
function startHorse() {
  if (S.vc < 50) { toast('50 HC TO PLAY', 'Sharpie does not do credit.'); return; }
  S.vc -= 50; save(); startDrill('horse', 'hub');
}
function horseEnd(res) {
  enterWorld('hub', 6.4, 7.4, 0.7);
  if (res.quit) { toast('YOU WALKED', 'Sharpie keeps the 50.'); return; }
  const won = res.drill.score === 1, pay = (evOn('horse') ? 2 : 1) * 250;
  if (won) { S.vc += pay; lifeAdd('horseWins'); gainRep(30); sfx('unlock'); } else sfx('no'); checkAch(); save();
  uiDialog('SHARPIE THE HUSTLER', won ? `You spelled me out. ${pay} HC, take it. ${evOn('horse') ? 'Derby day, I pay double. Do not tell anyone.' : 'Run it back any time.'}` : 'H-O-R-S-E. That\'s you. The 50 is mine. Come back when your jumper does.',
    [['Again (50 HC)', () => { uiClose(); startHorse(); }, '', S.vc < 50], ['Later', null, 'alt']]);
}

// =====================================================================
//  THE LADDER: six people in The Cages who will play you one on one
// =====================================================================
const LADDER = [
  { name: 'Lil Kickstand', style: 'sniper', ovr: 62, line: 'First one\'s free. After that I charge.', worn: { hair: 'h_hightop', head: 'hd_none', face: 'f_shades', top: 't_tee', arm: 'a_wrist', bottom: 'b_basic', socks: 's_low', shoes: 'k_white', back: 'bk_none', ball: 'bl_std' } },
  { name: 'Two-Ply', style: 'slasher', ovr: 69, line: 'I go to the rim like it owes me money. Because it does.', worn: { hair: 'h_braids', head: 'hd_band', face: 'f_none', top: 't_jersey', arm: 'a_sleeve', bottom: 'b_orange', socks: 's_high', shoes: 'k_red', back: 'bk_none', ball: 'bl_std' } },
  { name: 'Deacon Gains', style: 'glass', ovr: 75, line: 'Every rebound is a sermon. You are about to be preached at.', worn: { hair: 'h_bald', head: 'hd_bandred', face: 'f_mask', top: 't_hoodie', arm: 'a_both', bottom: 'b_camo', socks: 's_blk', shoes: 'k_grip', back: 'bk_towel', ball: 'bl_std' } },
  { name: 'Mini Mortgage', style: 'general', ovr: 81, line: 'I run the floor like a 30-year fixed. You will be paying for a long time.', worn: { hair: 'h_bun', head: 'hd_cap', face: 'f_visor', top: 't_jerseyteal', arm: 'a_wrist', bottom: 'b_teal', socks: 's_high', shoes: 'k_volt', back: 'bk_none', ball: 'bl_neon' } },
  { name: 'Static', style: 'lockdown', ovr: 86, line: 'You will not score. I have it in writing.', worn: { hair: 'h_buzz', head: 'hd_antenna', face: 'f_goggles', top: 't_tankblk', arm: 'a_sleevered', bottom: 'b_long', socks: 's_neon', shoes: 'k_moon', back: 'bk_none', ball: 'bl_neon' } },
  { name: 'The Commissioner', style: 'showman', ovr: 92, line: 'I do not play people. I review them.', worn: { hair: 'h_flame', head: 'hd_capflag', face: 'f_gold', top: 't_gold', arm: 'a_chrome', bottom: 'b_gold', socks: 's_flag', shoes: 'k_gold', back: 'bk_cape', ball: 'bl_gold' } },
];
const ONES = { id: '1v1', n: 'ONES', size: 1, arcade: false, to: 7, d: 'One on one to 7. Ones and twos. Winners stay.' };
function ladderBuild(i) { const L = LADDER[i]; const b = withSeed(1000 + i, () => aiBuild(L.ovr, L.style)); b.name = L.name; b.keepLook = true; b.worn = Object.assign({}, L.worn); return b; }
function uiLadder(i) {
  const L = LADDER[i], beaten = (S.ladder || 0) > i, open = (S.ladder || 0) >= i, pay = Math.round(ladderPay(i) * (beaten ? 0.3 : 1));
  if (!open) return uiDialog(L.name.toUpperCase(), `"Beat ${LADDER[i - 1].name} first. I don't play people nobody's heard of."`, [['Fair.', null]]);
  uiDialog(L.name.toUpperCase() + ` · ${L.ovr} OVR`, `"${L.line}"  One on one to 7. ${beaten ? 'Rematch pays ' + pay + ' HC.' : 'Beat me: ' + pay + ' HC, ' + (40 * (i + 1)) + ' Respect, and I\'ll run with you any time.'}${evOn('ladder') ? ' Ladder Night: double.' : ''}`,
    [['Run ones', () => runLadder(i)], ['Not now', null, 'alt']]);
}
const ladderPay = i => 160 * (i + 1);
function runLadder(i) {
  uiClose(); const L = LADDER[i], tier = TIERS_COURT[Math.min(3, Math.floor(i / 1.6))];
  const b = ladderBuild(i), lvl = clamp(0.3 + i * 0.13, 0.3, 1);
  const cfg = { mode: ONES, tier, teams: [[{ b: myBuild(), ctrl: 0, mine: true }], [{ b, ctrl: -1, ai: lvl }]], boosts: S.boosts.splice(0), ball: S.worn.ball, seed: i, firstOff: 0 };
  cfg.bonus = res => { if (!res.win) return null; const beaten = (S.ladder || 0) > i; let vc = Math.round(ladderPay(i) * (beaten ? 0.3 : 1) * (evOn('ladder') ? 2 : 1)); lifeAdd('ladderWins');
    if (!beaten) { S.ladder = i + 1; const hb = JSON.parse(JSON.stringify(b)); hb.net = 0; if (!S.homies.some(h => h.name === hb.name)) { if (S.homies.length >= 12) S.homies.shift(); S.homies.push(hb); } setTimeout(() => toast(L.name.toUpperCase() + ' RUNS WITH YOU NOW', 'They are a homie: put them on your squad.', 'ach'), 1800); }
    return { vc, rep: beaten ? 10 : 40 * (i + 1), note: (beaten ? 'Ladder rematch' : 'Beat ' + L.name) + ` +${vc} HC${evOn('ladder') ? ' (Ladder Night x2)' : ''}` }; };
  cfg.onEnd = res => finishGame(res, ONES, tier, null, cfg);
  save(); document.body.dataset.state = 'match'; startMatch(cfg); uiHud();
}

// =====================================================================
//  THE OLD HEAD'S DAILY CONTRACTS
// =====================================================================
function uiContracts() {
  const D = daily();
  openPanel(() => {
    const ev = todayEvent();
    let h = `<div class="ph"><h2>OLD HEAD</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><div class="card"><p style="color:var(--bone);font-size:14px">"${esc(pick(OLDHEAD))}"</p></div>`;
    h += `<div class="card sel"><h3 class="ye">TODAY ON THE BLOCK · ${ev.n}</h3><p>${ev.d}</p></div><div class="cat">TODAY'S CONTRACTS <span class="mu" style="text-transform:none;letter-spacing:.02em">— new ones tomorrow</span></div>`;
    for (const id of D.picks) {
      const c = CONTRACTS.find(x => x.id === id), prog = Math.min(c.t, Math.max(0, (S.life[c.k] || 0) - (D.base[c.k] || 0))), done = prog >= c.t, got = D.claimed.includes(id);
      h += `<div class="card ${got ? 'sel' : ''}"><div class="row"><div class="g"><h3>${c.n}</h3><div class="row" style="margin-top:5px"><div class="ab"><i style="width:${prog / c.t * 100}%;background:var(--go)"></i></div><span class="av" style="width:auto;font-size:11px">${prog}/${c.t}</span></div></div>
        ${got ? '<span class="tag on">PAID</span>' : Btn(`${c.vc} HC`, () => { D.claimed.push(id); S.vc += c.vc; gainRep(25); sfx('buy'); toast('CONTRACT PAID', `${c.n} · +${c.vc} HC · +25 Respect`, 'ach'); save(); rerender(); }, 'sm', !done)}</div></div>`;
    }
    return h + `<p class="mu">Contracts count what you do from the moment the day starts: games, drills, the ladder, H-O-R-S-E, the fiends.</p></div>`;
  });
}
