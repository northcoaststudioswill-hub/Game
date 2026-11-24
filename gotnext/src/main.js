// GOT NEXT — boot, the loop, rewards
'use strict';
let ST = null;   // studio / title scene state

function titleScene() {
  if (typeof ostRoom === 'function') ostRoom('menu');
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
  scene.background = new THREE.Color(0x141418); baseLights(scene, 0xffe8d8, 0x30303a, 0xffffff, 1.6);
  ink(M(cyl(1.6, 1.8, 0.3, 20), toon('#ece9e2'), 0, -0.15, 0, scene), 1.03);
  const g = M(new THREE.PlaneGeometry(80, 80), toon('#0e0e11'), 0, -0.3, 0, scene); g.rotation.x = -Math.PI / 2;
  const s = sign('WHO\nGOT\nNEXT', 7, 5.4, '#26262e', '#141418', { border: false }); s.position.set(0, 3.2, -5); scene.add(s);
  ST = { kind: 'studio', t: 0, rig: null };
}
function studioRig(spec) { if (ST.rig) scene.remove(ST.rig.root); ST.rig = makeRig(spec); scene.add(ST.rig.root); ST.H = ST.rig.H; }
function studioStep(dt) {
  ST.t += dt; const portrait = innerWidth < innerHeight;
  if (ST.kind === 'alab') { alabStep(dt); return; }
  if (ST.kind === 'title') {
    for (const [r, an, o] of ST.rigs) applyPose(r, poseOf(an, ST.t, o), dt);
    handPos(ST.dunker, 'R', ST.ball.position); ST.ball.position.y += 0.1;
    const a = ST.t * 0.12 + 0.6; camera.position.set(Math.sin(a) * 7.5, 2.2 + Math.sin(ST.t * 0.3) * 0.4, 5.5 + Math.cos(a) * 3.5); camera.lookAt(0, 2.5, 0.5);
  } else if (ST.rig) {
    ST.rig.root.rotation.y = Math.sin(ST.t * 0.5) * 0.7 + 0.2;
    const dp = ST.devPose;          // the Dev Room previews a move by looping its pose
    if (dp) { const cyc = dp.o.cyc || 1.2, lt = (ST.t - dp.t0) % (cyc + 0.6), tt = Math.min(lt, cyc); applyPose(ST.rig, poseOf(dp.an, tt, Object.assign({ leg: ST.rig.legLen }, dp.o, { u: tt / cyc * (dp.o.u || 1) * 1.1 })), dt); }
    else applyPose(ST.rig, poseOf('idle', ST.t), dt);
    if (portrait) { camera.position.set(0, 0.2, 7.2); camera.lookAt(0, -0.9, 0); } else { camera.position.set(1.9, 1.3, 5.0); camera.lookAt(1.9, 1.0, 0); }
  }
}

// ---------- progression ----------
function achVal(k) {
  if (k === 'owned') return S.owned.length; if (k === 'cribs') { let n = 0; for (const c in S.crib) n += S.crib[c]; return n; }
  if (k === 'ovr') return S.attrs.layup ? ovrOf(S.attrs) : 0; if (k === 'ladder') return S.ladder || 0; if (k === 'homies') return Math.max(S.life.homies || 0, S.homies.length);
  return S.life[k] || 0;
}
function checkAch() {
  for (const a of ACH) {
    if (S.ach[a.id] || achVal(a.k) < a.t) continue; S.ach[a.id] = 1; S.vc += a.vc;
    if (a.drip && !S.owned.includes(a.drip)) S.owned.push(a.drip);
    toast(a.n, `+${a.vc} VC` + (a.drip ? ' · NEW DRIP: ' + DRIPS[a.drip].n : ''), 'ach'); sfx('unlock');
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
  twoPlayer = false; const gate = MODES.indexOf(m); enterWorld('pit', gate >= 0 ? pitDoorX(gate) : 0, gate >= 0 ? -1.6 : 5.2, Math.PI);
  if (res.quit) { if (res.lost) toast('CONNECTION LOST', 'The other player dropped. No harm, no pay.'); else toast('FORFEIT', 'No VC. No Respect. The park saw that.'); return; }
  const s = res.stats, L = S.life, notes = [];
  let vc = (res.win ? 70 : 30) * tier.mult + s.pts * 4 + s.ast * 6 + s.reb * 4 + s.stl * 8 + s.blk * 8 + s.ankles * 10 + s.dunks * 5 + s.greens * 4;
  if (m.arcade) vc *= 0.75;       // RUCKUS games are faster and score more
  const cv = cribFx('vc'); if (cv) { vc *= 1 + cv; notes.push(`Crib +${Math.round(cv * 100)}% VC`); }
  if (cfg.boosts.includes('lotto')) { if (Math.random() < 0.5) { vc *= 2; notes.push('SCRATCH-OFF HIT: VC doubled'); } else notes.push('Scratch-off: "PLAY AGAIN"'); }
  let rep = (res.win ? 45 : 12) * tier.mult + s.pts + s.ast * 2 + s.stl * 2 + s.blk * 2 + s.ankles * 3 + res.bonusRep;
  const rm = (ORIGIN[S.build.origin].k === 'rep' ? 0.15 : 0) + cribFx('rep'); if (rm) { rep *= 1 + rm; notes.push(`+${Math.round(rm * 100)}% Respect`); }
  if (res.shutout && res.win) { rep += 40; notes.push('SKUNK: +40 Respect'); }
  if (evOn('bucket')) { vc *= 1.25; notes.push('BUCKET BONANZA +25% VC'); }
  if (cfg.bonus) { const bo = cfg.bonus(res); if (bo) { vc += bo.vc; rep += bo.rep || 0; notes.push(bo.note); } }
  { const nx = nexxCheck(res); if (nx) { vc += nx.vc; rep += nx.rep; notes.push(nx.note); } }      /* Nexx filmed it */
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
  uiResults(res, { vc, rep, bxp: bx, pts, notes }, st ? () => launchGame(m, tier, st) : null);
}
function afterPractice(res, back) {
  if (back === 'hub') enterWorld('hub', 6.4, 7.4, 0.7); else enterWorld('crib', 0, 9, Math.PI);
  if (res.practice === 'rack' && !res.quit) {
    const pay = res.rack * 5; S.vc += pay; S.life.bestRack = Math.max(S.life.bestRack || 0, res.rack); save(); checkAch();
    uiDialog('SHARPIE THE HUSTLER', res.rack >= 20 ? `${res.rack}?! Who ARE you. Take your ${pay} VC and stop embarrassing me.` : res.rack >= 8 ? `${res.rack} points. ${pay} VC. Respectable. Barely.` : `${res.rack} points. Here's ${pay} VC. Buy a jumpshot with it.`, [['Take the bag', null]]); sfx('buy');
  }
}

// ---------- loop ----------
let last = 0; const SIM_DT = 1 / 60;
// ---------- debug overlay: ` (backquote) or ?debug ----------
const DBG = { on: /[?&]debug/.test(location.search), t: 0, fps: 60, steps: 0 };
addEventListener('keydown', e => { if (e.code === 'Backquote') { DBG.on = !DBG.on; $('dbg').style.display = DBG.on ? 'block' : 'none'; } });
function dbgDraw(dt) {
  DBG.fps = lerp(DBG.fps, 1 / Math.max(dt, 0.001), 0.05); if ((DBG.t += dt) < 0.1) return; DBG.t = 0;
  const el = $('dbg'); el.style.display = DBG.on ? 'block' : 'none'; if (!DBG.on) return;
  const f2 = v => (v >= 0 ? ' ' : '') + v.toFixed(2), I = IN[0];
  if (!MT) { el.textContent = `fps ${DBG.fps.toFixed(0)}  (no game)`; return; }
  const p = MT.me, B = MT.B, R = p.rig, G = R.gait, D = p.drib;
  const ft = s => { const f = G && G.ft[s]; return !f ? '-' : f.sw ? `swing ${(f.t / f.T * 100 | 0)}%` : 'planted'; };
  el.textContent = [
    `fps ${DBG.fps.toFixed(0)}   sim 60 Hz   steps/frame ${DBG.steps}`,
    `state  ${p.st.padEnd(7)} t ${p.t.toFixed(2)}   anim ${p.an || ''}   buffered ${p.buf && p.buf.ttl > 0 ? (p.buf.bP ? 'shoot' : p.buf.aP ? 'pass' : p.buf.flick) : '-'}`,
    `move   v ${Math.hypot(p.vx, p.vz).toFixed(2)} m/s   stick ${f2(I.mx)} ${f2(I.my)}${I.sprint ? ' sprint' : ''}   skill ${I.rdir || '-'}`,
    `feet   R ${ft('R').padEnd(11)} L ${ft('L').padEnd(11)} ik ${G ? G.w.toFixed(2) : '-'}  hips -${G ? G.drop.toFixed(2) : '0'}  steps ${G ? G.steps : 0}`,
    `ball   ${B.state.padEnd(6)} ${B.holder === p && D ? `${D.ph} ${D.hand} ${(D.t / (D.T || 1) * 100 | 0)}%` : B.holder ? 'held by ' + B.holder.b.name : ''}   y ${B.pos.y.toFixed(2)}`,
    `input  last press → action ${p.lat !== undefined ? p.lat.toFixed(0) + ' ms' : '-'}`,
  ].join('\n');
}
function frame(now) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
  pollInput(); netPollRemote();
  if (uiBusy()) uiStep(dt);
  if (MT) {
    if (!UI.cur && (IN[0].start || IN[1].start)) { uiPause(); clearEdges(); }
    else {
      // games run on a fixed 60 Hz step: the same input does the same thing at 30, 60 or 144 FPS
      MT.acc = (MT.acc || 0) + dt; let n = 0;
      while (MT && MT.acc >= SIM_DT - 1e-6 && n < 5) { MT.acc -= SIM_DT; matchStep(SIM_DT); clearEdges(); n++; }
      DBG.steps = n;
      if (MT && n === 5) MT.acc = 0;
    }
  }
  else if (W) { worldStep(dt); netWorldStep(dt); clearEdges(); }
  else { if (ST && !ST.frozen) studioStep(dt); clearEdges(); }
  if (scene) renderer.render(scene, camera);
  dbgDraw(dt);
}
function boot() {
  loadSave(); gfxInit(); setupTouch(); uiInit(); titleScene(); uiTitle(); netInit();
  addEventListener('pointerdown', audioInit, { once: false });
  document.addEventListener('visibilitychange', () => { if (document.hidden && MT && !MT.practice && !UI.cur) uiPause(); });
  window.__pit = { get S() { return S; }, get MT() { return MT; }, get W() { return W; }, IN, keys, save, enterWorld, launchGame, uiClose, gainRep, checkAch, MODES, TIERS_COURT, startPractice, get UI() { return UI; }, NET, netGo, DRILL, startDrill, uiDev, devMax, devRestore, devReel, devPlay, REELS, maxBuild, buildEnter, buildExit, buildPlace, buildFits, buildItemAt, buildCancel, buildRotate, buildStore, buildSell, BLD, uiHomeLot, buildPickUpIdx: k => buildPickUp(k), devSampleCrib, rareToday: () => rareToday(), RARES: () => RARES, touch, OST, contestOn: p => contestOn(p), stealChance: (p, h) => stealChance(p, h), doPass: (p, t) => doPass(p, t), startSteal: p => startSteal(p), uiKael: () => uiKael(), uiNexx: () => uiNexx(), nexxCheck: r => nexxCheck(r), uiLouie: () => uiLouie(), uiErin: () => uiErin(), castStep: dt => castStep(dt), puStep: dt => puStep(dt), POWERUPS: () => POWERUPS, scorePts: (p, n, h) => scorePts(p, n, h), releaseShot: p => releaseShot(p), startPractice2: 0, packBuild: b => packBuild(b), unpackBuild: c => unpackBuild(c), myBuild: () => myBuild(), shotPose: (a, u, n) => shotPose(a, u, n), idlePose: (a, t, o) => idlePose(a, t, o), profileFromBuild: s => profileFromBuild(s), animProfile: s => animProfile(s), alabOpen: () => alabOpen(), get ALAB() { return ALAB; }, uiDev: b => uiDev(b), aiBuild: (o, r) => aiBuild(o, r), slotNew: () => slotNew(), slotSwitch: i => slotSwitch(i), slotLoad: t => slotLoad(t), slotDelete: i => slotDelete(i), attrCost: v => attrCost(v), uiPlayer: t => uiPlayer(t), ovrOf: a => ovrOf(a), resolveSteal: p => resolveSteal(p), startJump: p => startJump(p), startShot: (p, s, f, o) => startShot(p, s, f, o), vol: () => ({ mus: +musBus.gain.value.toFixed(3), sfx: +sfxBus.gain.value.toFixed(3) }), homeLevel, homeSets, homeFx, netVisit: id => netVisit(id), emote: k => emote(k), chatSend: t => chatSend(t), likeCrib: () => likeCrib(), packHome: () => packHome() };
  window.__step = dt => { if (MT) matchStep(dt); };
  window.__camera = camera; window.__render = () => renderer.render(scene, camera); window.__info = () => { let m = 0, s = 0, t = 0; scene.traverse(o => { if (o.isSprite) s++; else if (o.isMesh) m++; }); return { calls: renderer.info.render.calls, tris: renderer.info.render.triangles, meshes: m, sprites: s }; };
  // test hook: draw the player in one pose and hand back the frame
  window.__poseShot = (an, t, o) => {
    if (!ST || !ST.frozen) { uiClose(); $('title').style.display = 'none'; studioScene(); studioRig(myBuild()); ST.frozen = true; }
    const R = ST.rig; for (let k = 0; k < 40; k++) applyPose(R, poseOf(an, t, Object.assign({ leg: R.legLen }, o)), 0.05);
    R.root.rotation.y = o.ry === undefined ? -1.15 : o.ry; R.root.position.y = (o.y || 0);
    camera.position.set(0, 1.15, 3.1); camera.lookAt(0, 1.0, 0); renderer.render(scene, camera); return renderer.domElement.toDataURL('image/png');
  };
  requestAnimationFrame(frame);
}
// signs are drawn with the brand face, so wait for it (briefly) before building the first scene
(document.fonts && document.fonts.load ? Promise.race([Promise.all([document.fonts.load('900 expanded 40px Archivo'), document.fonts.load('500 12px "JetBrains Mono"')]), new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(boot, boot);
