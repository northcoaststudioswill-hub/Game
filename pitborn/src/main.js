// PITBORN 2145 — boot, the loop, rewards
'use strict';
let ST = null;   // studio / title scene state

function titleScene() {
  disposeScene(scene); scene = new THREE.Scene(); W = null; MT = null;
  scene.background = new THREE.Color(0x1a1430); scene.fog = new THREE.Fog(0x1a1430, 30, 140);
  baseLights(scene, 0xffd9c0, 0x3a3050, 0xffc890, 1.5);
  const g = M(new THREE.PlaneGeometry(300, 300), toon('#20242c'), 0, -0.02, 0, scene); g.rotation.x = -Math.PI / 2;
  addCourt(scene, 'street', 2); addFence(scene, -8.6, 8.6, -2.6, 13.6, 4.2); skyline(scene, 36, 60, ['#ffc531', '#ff4fd8', '#33e0ff']);
  billboard(scene, ADS[0], -13, 7, -6, 0.5, 9, 5); billboard(scene, ADS[4], 13, 7.5, -7, -0.5, 9, 5);
  ST = { kind: 'title', t: 0, rigs: [] };
  const a = makeRig(S.created ? myBuild() : aiBuild(90, 'slasher')); a.root.position.set(0.5, 1.2, 0.9); a.root.rotation.y = Math.PI + 0.3; scene.add(a.root); a.shadow.visible = false; ST.rigs.push([a, 'dunk', { u: 0.6, style: 'tomahawk' }]);
  const b = makeRig(aiBuild(80, 'glass')); b.root.position.set(-0.9, 0, 1.7); b.root.rotation.y = 0.4; scene.add(b.root); ST.rigs.push([b, 'stagger', { fall: false }]);
  const c = makeRig(aiBuild(80, 'sniper')); c.root.position.set(3.4, 0, 4.6); c.root.rotation.y = -2.2; scene.add(c.root); ST.rigs.push([c, 'cheer', {}]);
  const bl = makeBall('bl_std'); scene.add(bl); ST.ball = bl; ST.dunker = a;
}
function studioScene() {
  disposeScene(scene); scene = new THREE.Scene(); W = null; MT = null;
  scene.background = new THREE.Color(0x1c1a30); baseLights(scene, 0xffe8d8, 0x3a3050, 0xffffff, 1.6);
  ink(M(cyl(1.6, 1.8, 0.3, 20), toon('#ff5a3c'), 0, -0.15, 0, scene), 1.03);
  const g = M(new THREE.PlaneGeometry(80, 80), toon('#14121f'), 0, -0.3, 0, scene); g.rotation.x = -Math.PI / 2;
  const s = sign('PITBORN\nDEPARTMENT OF\nPLAYER REGISTRATION', 9, 4.5, '#2e2e48', '#1c1a30', { border: false }); s.position.set(0, 3.2, -5); scene.add(s);
  ST = { kind: 'studio', t: 0, rig: null };
}
function studioRig(spec) { if (ST.rig) scene.remove(ST.rig.root); ST.rig = makeRig(spec); scene.add(ST.rig.root); ST.H = ST.rig.H; }
function studioStep(dt) {
  ST.t += dt; const portrait = innerWidth < innerHeight;
  if (ST.kind === 'title') {
    for (const [r, an, o] of ST.rigs) applyPose(r, poseOf(an, ST.t, o), dt);
    handPos(ST.dunker, 'R', ST.ball.position); ST.ball.position.y += 0.1;
    const a = ST.t * 0.12 + 0.6; camera.position.set(Math.sin(a) * 7.5, 2.2 + Math.sin(ST.t * 0.3) * 0.4, 5.5 + Math.cos(a) * 3.5); camera.lookAt(0, 2.5, 0.5);
  } else if (ST.rig) {
    ST.rig.root.rotation.y = Math.sin(ST.t * 0.5) * 0.7 + 0.2; applyPose(ST.rig, poseOf('idle', ST.t), dt);
    if (portrait) { camera.position.set(0, 0.2, 7.2); camera.lookAt(0, -0.9, 0); } else { camera.position.set(1.9, 1.3, 5.0); camera.lookAt(1.9, 1.0, 0); }
  }
}

// ---------- progression ----------
function achVal(k) {
  if (k === 'owned') return S.owned.length; if (k === 'cribs') { let n = 0; for (const c in S.crib) n += S.crib[c]; return n; }
  if (k === 'ovr') return S.attrs.layup ? ovrOf(S.attrs) : 0; if (k === 'homies') return Math.max(S.life.homies || 0, S.homies.length);
  return S.life[k] || 0;
}
function checkAch() {
  for (const a of ACH) {
    if (S.ach[a.id] || achVal(a.k) < a.t) continue; S.ach[a.id] = 1; S.vc += a.vc;
    if (a.drip && !S.owned.includes(a.drip)) S.owned.push(a.drip);
    toast('🏆 ' + a.n, `+${a.vc} VC` + (a.drip ? ' · NEW DRIP: ' + DRIPS[a.drip].n : ''), 'ach'); sfx('unlock');
  }
  save(); uiHud();
}
function gainRep(v) {
  S.rep += Math.round(v); const r = rankOf(S.rep);
  if (r > S.seenRank) {
    S.seenRank = r; const n = DRIP.filter(d => d.rank === r && d.src === 'shop').length + MOVES.concat(JUMPERS, DUNKS, CELEBS).filter(m => m.rank === r).length;
    const ct = TIERS_COURT.find(t => t.rank === r);
    setTimeout(() => { toast('RANK UP: ' + RANKS[r].n, (ct ? 'New court: ' + ct.n + ' · ' : '') + n + ' new things in the shops', 'rank'); sfx('rank'); }, 900);
  }
  uiHud();
}

function launchGame(m, tier, st) {
  const mk = (o, lvl) => { const b = aiBuild(clamp(o + rnd(-3, 3), 50, 99)); return { b, ctrl: -1, ai: lvl }; };
  const used = new Set(); const nm = sp => { let n = sp.b.name, k = 0; while (used.has(n) || n === S.name) n = pick(NPC_NAMES) + (++k > 20 ? k : ''); used.add(n); sp.b.name = n; return sp; };
  const t0 = [{ b: myBuild(), ctrl: 0, mine: true }];
  for (let i = 0; i < m.size - 1; i++) {
    const hi = st.mates[i] === undefined ? -1 : st.mates[i];
    const sp = hi >= 0 && S.homies[hi] ? { b: JSON.parse(JSON.stringify(S.homies[hi])), ctrl: -1, ai: Math.max(0.5, tier.ai) } : nm(mk(tier.ovr - 2, Math.max(0.35, tier.ai * 0.9)));
    if (i === 0 && st.p2 === 'coop') sp.ctrl = 1; t0.push(sp);
  }
  const t1 = [];
  for (let i = 0; i < m.size; i++) {
    const sp = i === 0 && st.rival >= 0 && S.homies[st.rival] ? { b: JSON.parse(JSON.stringify(S.homies[st.rival])), ctrl: -1, ai: Math.max(0.5, tier.ai) } : nm(mk(tier.ovr, tier.ai));
    if (i === 0 && st.p2 === 'vs') sp.ctrl = 1; t1.push(sp);
  }
  twoPlayer = st.p2 !== 'off';
  const boosts = S.boosts.slice(); S.boosts = []; save();
  const cfg = { mode: m, tier, teams: [t0, t1], boosts, ball: S.worn.ball, seed: Math.floor(Math.random() * 8), firstOff: Math.random() < 0.6 ? 0 : 1, p2: st.p2 };
  cfg.onEnd = res => finishGame(res, m, tier, st, cfg);
  uiClose(); document.body.dataset.state = 'match'; startMatch(cfg); uiHud();
}
function finishGame(res, m, tier, st, cfg) {
  twoPlayer = false; const doorX = -10.5 + MODES.indexOf(m) * 7;
  enterWorld('pit', doorX, -6.6, 0);
  if (res.quit) { toast('FORFEIT', 'No VC. No Respect. The park saw that.'); return; }
  const s = res.stats, L = S.life, notes = [];
  let vc = (res.win ? 70 : 30) * tier.mult + s.pts * 4 + s.ast * 6 + s.reb * 4 + s.stl * 8 + s.blk * 8 + s.ankles * 10 + s.dunks * 5 + s.greens * 4;
  if (m.arcade) vc *= 0.75;       // JAM games are faster and score more
  const cv = cribFx('vc'); if (cv) { vc *= 1 + cv; notes.push(`Trophy wall +${Math.round(cv * 100)}% VC`); }
  if (cfg.boosts.includes('lotto')) { if (Math.random() < 0.5) { vc *= 2; notes.push('SCRATCH-OFF HIT: VC doubled'); } else notes.push('Scratch-off: "PLAY AGAIN"'); }
  let rep = (res.win ? 45 : 12) * tier.mult + s.pts + s.ast * 2 + s.stl * 2 + s.blk * 2 + s.ankles * 3 + res.bonusRep;
  const rm = (ORIGIN[S.build.origin].k === 'rep' ? 0.15 : 0) + cribFx('rep'); if (rm) { rep *= 1 + rm; notes.push(`+${Math.round(rm * 100)}% Respect`); }
  if (res.shutout && res.win) { rep += 40; notes.push('SKUNK: +40 Respect'); }
  vc = Math.round(vc); rep = Math.round(rep);
  const bx = { F: 12 + s.dunks * 20 + (s.fgm - s.threes) * 7, S: 12 + s.greens * 12 + s.threes * 14, P: 12 + s.ast * 22 + s.ankles * 24, D: 12 + s.stl * 24 + s.blk * 24 + s.reb * 9 };
  const mS = 1 + cribFx('bxS') + cribFx('bxSF'), mF = 1 + cribFx('bxSF'); bx.S = Math.round(bx.S * mS); bx.F = Math.round(bx.F * mF);
  const pts = [];
  for (const c in bx) { bx[c] = Math.round(bx[c] * (res.win ? 1 : 0.7) * (0.8 + tier.mult * 0.2)); S.bxp[c] += bx[c]; let n = 0; while (S.bxp[c] >= 100) { S.bxp[c] -= 100; S.bp[c]++; n++; } if (n) pts.push(`+${n} ${CATS[c][0]} badge point${n > 1 ? 's' : ''}`); }
  S.vc += vc;
  for (const k of ['pts', 'ast', 'reb', 'stl', 'blk', 'ankles', 'greens', 'dunks', 'threes', 'bravs', 'fires']) L[k] = (L[k] || 0) + s[k];
  L.games = (L.games || 0) + 1; if (res.win) L.wins = (L.wins || 0) + 1; if (res.shutout && res.win) L.shutouts = (L.shutouts || 0) + 1;
  gainRep(rep); checkAch(); save();
  if (pts.length) setTimeout(() => { toast('BADGE POINTS', pts.join(' · '), 'ach'); sfx('unlock'); }, 1600);
  uiResults(res, { vc, rep, bxp: bx, pts, notes }, () => launchGame(m, tier, st));
}
function afterPractice(res, back) {
  if (back === 'hub') enterWorld('hub', 13, 15, -2.4); else enterWorld('crib', 0, 9, Math.PI);
  if (res.practice === 'rack' && !res.quit) {
    const pay = res.rack * 5; S.vc += pay; S.life.bestRack = Math.max(S.life.bestRack || 0, res.rack); save(); checkAch();
    uiDialog('SHARPIE THE HUSTLER', res.rack >= 20 ? `${res.rack}?! Who ARE you. Take your ${pay} VC and stop embarrassing me.` : res.rack >= 8 ? `${res.rack} points. ${pay} VC. Respectable. Barely.` : `${res.rack} points. Here's ${pay} VC. Buy a jumpshot with it.`, [['Take the bag', null]]); sfx('buy');
  }
}

// ---------- loop ----------
let last = 0;
function frame(now) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
  pollInput();
  if (uiBusy()) uiStep(dt);
  if (MT) { if (!UI.cur && (IN[0].start || IN[1].start)) uiPause(); else matchStep(dt); }
  else if (W) worldStep(dt);
  else if (ST) studioStep(dt);
  if (scene) renderer.render(scene, camera);
}
function boot() {
  loadSave(); gfxInit(); setupTouch(); uiInit(); titleScene(); uiTitle();
  addEventListener('pointerdown', audioInit, { once: false });
  document.addEventListener('visibilitychange', () => { if (document.hidden && MT && !MT.practice && !UI.cur) uiPause(); });
  window.__pit = { get S() { return S; }, get MT() { return MT; }, get W() { return W; }, IN, keys, save, enterWorld, launchGame, uiClose, gainRep, checkAch, MODES, TIERS_COURT, startPractice, get UI() { return UI; } };
  window.__step = dt => { if (MT) matchStep(dt); };
  requestAnimationFrame(frame);
}
boot();
