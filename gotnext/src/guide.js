// GOT NEXT — the first ten minutes. Walk-On meets a new player where they come in, walks them to Coach Overtime, and
// Coach's board teaches the rest: drills that pay you to learn, HOW IT WORKS for every system, and a short lesson plan.
const HOWTO = [
  { t: 'Moving and the ball', b: 'Left stick (or WASD) moves. Squeeze sprint (RT, Shift, or push the phone stick all the way) for a TURBO burst: it costs stamina, shown under your feet, and can beat your man off the first step. Out of stamina you are slow and your shot gets worse. A check-up gives everybody some back.', drill: 'weave' },
  { t: 'Shooting', b: 'Hold the shoot button (X, Space, SHOOT) or pull the skill stick down, and let go at the top of the jump. The meter by your player shows the window: inside it is a green, and greens go in. Your stick picks the shot: away from the rim is a fade (lean back, drift, by how you are covered), sideways is a side step.', drill: 'spots' },
  { t: 'Finishing', b: 'Push the skill stick up (or shoot while driving) near the rim. The game picks a layup or dunk from your package by the situation and never the same one twice running. Stick sideways is a euro step: go away from the shot-blocker. Let go of the stick for a hop step. Driving into a defender with his feet set is a charge.', drill: 'layups' },
  { t: 'Dribble moves', b: 'Flick the skill stick: sideways for your side move, down and to a side for a stepback, up and to a side for a spin. Mixing them builds a combo and breaks ankles. The same move the same way gets read.', drill: 'weave' },
  { t: 'The post', b: 'Hold LT with a live dribble (tap the gold button on a phone) to turn your back and back him down. Then shoot with the stick toward the rim for a drop step, away for a fadeaway, across for a jump hook, or still for a turnaround.', drill: 'mikan' },
  { t: 'Passing and teammates', b: 'Pass (A, E, PASS) goes where your stick points. LB, R or PICK calls a screen: hold sprint for a hard one. Press pass while the ball is on its way to you for a touch pass. Off the ball: pass calls for it, flick the stick to cut, hold LT standing still to set a screen yourself.', drill: 'catch' },
  { t: 'Defense', b: 'Stay between your man (the arrow) and the rim; let go of the stick and you guard him. Steal is X / E / STEAL: time it, spamming gets fouls. Jump (Y / Space / JUMP) at the release to contest. Hold LT to body up, to box out when a shot goes up, and with your feet set in a driver\'s way to take a charge. LB / R / SWITCH takes the ball handler.', drill: 'slides' },
  { t: 'Loose balls and boards', b: 'Box out (LT) before the rebound, jump for it. Press pass/steal near a loose ball to dive. Two men on it at once is a tie-up; the arrow alternates.' },
  { t: 'HC, Respect and Street Smarts', b: 'HC is money: games, drills and contracts pay it, and you spend it on attributes, packages, drip and the crib. Respect is reputation: it sets your rank, and rank opens courts and shelves. Street Smarts are perks you earn points for by doing the thing in real games.' },
  { t: 'Packages and personality', b: 'In MY PLAYER → MOVES you wear one package each of dunks, layups, dribble moves, post moves, idle dribbling and stance. PERSONALITY is three traits: they pick your trash talk and each gives a small edge.' },
  { t: 'The Block', b: 'The Cages (north) is where games are. The Lab sells attributes, The Plug sells drip, Tape Deck sells moves. Sharpie runs shooting games for HC, Trey rolls bones and takes bets, Old Head hands out contracts. Your crib is down the alley.' },
];
const LESSONS = [
  { id: 'read', n: 'Read HOW IT WORKS', done: () => !!S.tutRead },
  { id: 'layups', n: 'Bronze in Layup Lines', done: () => ((S.drills.layups || {}).medal || 0) >= 1 },
  { id: 'spots', n: 'Bronze in Spot Shooting', done: () => ((S.drills.spots || {}).medal || 0) >= 1 },
  { id: 'weave', n: 'Bronze in Cone Weave', done: () => ((S.drills.weave || {}).medal || 0) >= 1 },
  { id: 'slides', n: 'Bronze in Defensive Slides', done: () => ((S.drills.slides || {}).medal || 0) >= 1 },
  { id: 'game', n: 'Play a game in The Cages', done: () => (S.life.games || 0) >= 1 },
];
const LESSON_PAY = 60, LESSON_ALL = 300;
function lessonCheck() { const L = S.lesson || (S.lesson = {}); let got = 0; for (const l of LESSONS) if (!L[l.id] && l.done()) { L[l.id] = 1; got += LESSON_PAY; } if (!L.all && LESSONS.every(l => L[l.id])) { L.all = 1; got += LESSON_ALL; toast('LESSON PLAN DONE', 'Coach nods. +' + LESSON_ALL + ' HC', 'ach'); } if (got) { S.vc += got; save(); if (typeof uiHud === 'function') uiHud(); } return got; }
function howTab(back) {
  if (!S.tutRead) { S.tutRead = 1; save(); }
  return `<p class="mu">Everything in the game, in the order you will need it. TRY IT runs the drill that practises it.</p><div class="grid">` + HOWTO.map(x => `<div class="card"><h3>${x.t}</h3><p>${x.b}</p>${x.drill ? `<div style="margin-top:6px">${Btn('TRY IT · ' + (DRILL_DEFS.find(d => d.id === x.drill) || { n: '' }).n, () => startDrill(x.drill, back), 'sm alt')}</div>` : ''}</div>`).join('') + `</div>`;
}
function lessonTab() {
  const got = lessonCheck(), L = S.lesson || {};
  return `<p class="mu">Six things, ${LESSON_PAY} HC each, ${LESSON_ALL} more for all of them.${got ? ` <b style="color:var(--go)">+${got} HC just now.</b>` : ''}</p><div class="grid">` + LESSONS.map((l, i) => `<div class="card ${L[l.id] ? 'sel' : ''}"><h3 style="color:${L[l.id] ? 'var(--go)' : 'var(--bone)'}">${L[l.id] ? '✓ ' : (i + 1) + '. '}${l.n}</h3><p class="mu">${L[l.id] ? 'Paid.' : '+' + LESSON_PAY + ' HC'}</p></div>`).join('') + `</div>`;
}
// ---- Walk-On
function guideInit() {
  if (W.kind !== 'hub' || W.visit) return; const b = blockBuild('WALK-ON', 'general', { top: 't_tee', head: 'hd_band' }, 62); const fresh = !S.tut;
  const n = addNpc(b, fresh ? W.me.x + 1.5 : -1.7, fresh ? W.me.z - 1.9 : 5.9, fresh ? 0 : Math.PI * 0.8, 'idle', { still: true }); n.cast = 'guide';
  W.guide = { n, st: fresh ? 'greet' : 'rest', t: 0 };
  spot(-1.7, 5.0, 1.5, 'WALK-ON (show me around)', () => { if (W.guide.st === 'rest') uiDialog('WALK-ON', 'Coach has it all on the board. Want the short version again?', [['How it works', () => uiDrills('hub', 'how')], ['The lesson plan', () => uiDrills('hub', 'plan')], ['Later', uiClose, 'alt']]); });
}
function guideStep(dt) {
  const G = W.guide; if (!G) return; const n = G.n, me = W.me; G.t += dt; let moving = false, wave = false; const dm = Math.hypot(me.x - n.x, me.z - n.z);
  if (G.st === 'greet') { n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.15); wave = true;
    if (G.t > 1.0 && !UI.cur) { G.st = 'asked'; uiDialog('WALK-ON', 'First day? I\'m Walk-On. I carry the cones. Coach Overtime is right over there and he teaches everything: come on, I\'ll take you.', [['Show me', () => { uiClose(); S.tut = 1; save(); G.st = 'lead'; G.t = 0; toast('FOLLOW WALK-ON', 'He is taking you to Coach Overtime.'); }], ['I know my way around', () => { uiClose(); S.tut = 1; save(); G.st = 'lead'; G.quiet = true; }, 'alt']]); } }
  else if (G.st === 'lead') { const tx = -1.7, tz = 5.9, dx = tx - n.x, dz = tz - n.z, l = Math.hypot(dx, dz);
    if (l < 0.35) { G.st = G.quiet ? 'rest' : 'arrive'; G.t = 0; n.face = Math.PI * 0.8; }
    else if (!G.quiet && dm > 5.5) { n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.12); wave = true; }      /* waits for you */
    else { const v = G.quiet ? 2.6 : 2.3; n.x += dx / l * v * dt; n.z += dz / l * v * dt; n.face = lerpAng(n.face, Math.atan2(dx, dz), 0.2); moving = true; } }
  else if (G.st === 'arrive') { n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.12); wave = dm > 3.5;
    if (dm < 3.5 && !UI.cur && G.t > 0.4) { G.st = 'rest'; S.tut = 1; save(); uiDialog('WALK-ON', 'This is Coach. Drills pay you to learn. HOW IT WORKS explains everything else, and the LESSON PLAN pays you for doing the first six things. I\'ll be right here.', [['Open the board', () => uiDrills('hub', 'how')], ['Later', uiClose, 'alt']]); } }
  n.hx = n.x; n.hz = n.z;
  if (moving) locoAnim(n.rig, n.x, n.z, n.face, dt, undefined, undefined, 0.5);
  else { n.rig.root.position.set(n.x, 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, wave ? poseOf('call', W.t, {}) : crowdPose('watch', W.t, { ph: n.ph }, n.rig.prof), dt); }
}
