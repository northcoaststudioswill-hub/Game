// GOT NEXT — ANIM LAB (developer only, inside the Dev Room): two players side by side doing the same action, the
// profile of the left one on sliders. Preview the foundational styles, blends, transitions; slow it down, pause, step
// a frame; save the profile to one of your builds or a homie, or reset it to the defaults its build gives it.
'use strict';
const ALAB = { a: null, b: null, act: 'shoot', speed: 1, paused: false, ball: true, t: 0, step: 0, prof: null, solo: null, ui: 'blend', tab: 'profile', cmp: true, joint: 'shR' };
const ALAB_ACTS = [
  ['shoot', 'Jump shot'], ['fake', 'Pump fake'], ['idle', 'Idle'], ['dribble', 'Dribble'], ['hold', 'Triple threat'], ['slide', 'Defense'], ['run', 'Run'], ['walk', 'Walk'], ['pass', 'Pass'], ['jump', 'Contest'],
  ['swag:rock', 'Swag: rock'], ['swag:tween', 'Swag: through the legs'], ['swag:behind', 'Swag: behind the back'], ['swag:yoyo', 'Swag: yo-yo'], ['swag:sizeup', 'Swag: size-up'], ['swag:wave', 'Swag: wave him up'], ['def:sag', 'Defense: sagging off'], ['def:tight', 'Defense: up close'], ['def:screen', 'Set a screen'], ['def:screen2', 'Hard screen'], ['def:screen3', 'Soft screen (slip)'], ['def:fight', 'Fight over a screen'], ['def:under', 'Go under a screen'], ['def:stuck', 'Caught on a screen'], ['def:box', 'Box out'], ['jump:1', 'Contest: right hand'], ['jump:2', 'Contest: left hand'], ['jump:3', 'Contest: flying'], ['steal:1', 'Steal: other hand'], ['steal:2', 'Steal: two-hand dig'], ['def:dive', 'Dive on a loose ball'],
  ['layup', 'Layup'], ['layup:finger', 'Layup: finger roll'], ['layup:under', 'Layup: up and under'], ['layup:over', 'Layup: over the top'], ['layup:reverse', 'Layup: reverse'], ['layup:spin', 'Layup: 360'], ['layup:quick', 'Layup: wrong foot'], ['layup:scoop', 'Layup: scoop'], ['layup:power', 'Layup: power'], ['dunk', 'Dunk'], ['dunk:onehand', 'Dunk: one hand'], ['dunk:cock', 'Dunk: cocked back'], ['dunk:hammer', 'Dunk: hammer'], ['dunk:lean', 'Dunk: leaner'], ['dunk:hangtwo', 'Dunk: two hands and hang'], ['dunk:tip', 'Dunk: tip slam'], ['cross', 'Crossover'], ['post', 'Post up (LT)'], ['bodyup', 'Body up (LT)'], ['steal', 'Steal'], ['shove', 'Shove'], ['punch', 'Haymaker'], ['clothes', 'Clothesline'], ['stagger', 'Fall: sit'], ['fall:face', 'Fall: face first'], ['fall:flat', 'Fall: laid out'], ['fall:spin', 'Fall: spun round'], ['fall:knee', 'Fall: to a knee'],
  ['celeb:airflex', 'Celeb: air flex'], ['celeb:goggles', 'Celeb: three goggles'], ['celeb:bow', 'Celeb: take a bow'], ['celeb:callme', 'Celeb: call me'], ['celeb:flexdown', 'Celeb: crab flex'], ['celeb:toosmall', 'Celeb: too small'], ['celeb:stare', 'Celeb: stare down'], ['celeb:pout', 'Celeb: pout'], ['celeb:shh', 'Celeb: shh'], ['celeb:rock', 'Celeb: rock the baby'], ['celeb:nightnight', 'Celeb: night night'], ['celeb:pound', 'Celeb: chest pound'], ['celeb:shrug', 'Celeb: shrug'], ['celeb:floor', 'Celeb: slap the floor'], ['celeb:wag', 'Celeb: finger wag'], ['celeb:greenbean', 'Celeb: green bean'], ['celeb:greengiant', 'Celeb: green giant'], ['celeb:iceveins', 'Celeb: ice in my veins'], ['celeb:fentlean', 'Celeb: fent lean'], ['celeb:pour40', 'Celeb: pour out the 40'],
  ['fan:up', 'Fan: arms up'], ['fan:jump', 'Fan: jump'], ['fan:ohh', 'Fan: OHHH'], ['fan:point', 'Fan: point & laugh'], ['fan:cover', 'Fan: hand over mouth'], ['fan:boo', 'Fan: boo'], ['fan:count', 'Fan: three'], ['fan:wave', 'Fan: towel'], ['fan:clap', 'Fan: clap'], ['fan:phone', 'Fan: phone'], ['fan:film', 'Fan: filming'], ['fan:talk', 'Fan: talking'], ['fan:bob', 'Fan: bobbing'], ['fan:cross', 'Fan: arms crossed'],
  ['mv:tween', 'Move: between the legs'], ['mv:behind', 'Move: behind the back'], ['mv:spin', 'Move: spin'], ['mv:stepback', 'Move: stepback'], ['mv:hesi', 'Move: hesi'], ['floater', 'Floater'], ['hop', 'Hop step'], ['pass:bounce', 'Pass: bounce'], ['pass:overhead', 'Pass: overhead'], ['catch', 'Catch'], ['swat', 'Block'], ['knees', 'Gassed (hands on knees)'],
  ['grab:scoop', 'Loose ball: scoop'], ['grab:board', 'Loose ball: board to the chin'], ['grab:catch', 'Loose ball: catch'], ['reach', 'Loose ball: reach'],
  ['emote:call', 'Emote: wave'], ['emote:dance', 'Emote: dance'], ['emote:sit', 'Emote: sit'], ['emote:cheer', 'Emote: hype'], ['fan:thumbs', 'Emote: 3:14 AM'], ['fan:armsout', 'Emote: on the roof'],
  ['celeb:salute', 'Celeb: salute'], ['celeb:count', 'Celeb: count the HC'], ['celeb:eagle', 'Celeb: freedom eagle'], ['celeb:sulk', 'Celeb: sulk'], ['celeb:beg', 'Celeb: beg'], ['celeb:warm', 'Celeb: warm up'],
  ['fan:scroll', 'Bottie: scroll'], ['fan:loser', 'Bottie: loser'], ['fan:think', 'Bottie: think'], ['fan:me', 'Bottie: me'], ['fan:robot', 'Bottie: robot'], ['fan:point2', 'Bottie: point'], ['fan:npc', 'Bottie: NPC'], ['fan:eat', 'Bottie: eat'], ['fan:prison', 'Bottie: prison'], ['fan:shake', 'Bottie: shake'], ['fan:nope', 'Bottie: nope'], ['fan:one', 'Bottie: one'], ['fan:watch2', 'Bottie: watch'], ['fan:flex', 'Bottie: flex'], ['fan:money', 'Bottie: money'], ['fan:pray', 'Bottie: pray'], ['fan:stop', 'Bottie: stop'], ['fan:runin', 'Bottie: run in'], ['fan:shrug', 'Bottie: shrug'],
  ['fan:ankles', 'Fan: ankles!'], ['fan:block', 'Fan: get that out'], ['fan:dunk', 'Fan: dunk reaction'], ['fan:hit', 'Fan: hit'], ['fan:ko', 'Fan: KO'], ['fan:steal', 'Fan: pickpocket'], ['fan:three', 'Fan: three'], ['fan:win', 'Fan: win'], ['fan:watch', 'Fan: watching'],
  ['seq:idle,shoot,run', 'Idle → shot → land → run'], ['seq:dribble,shoot,idle', 'Dribble → shot'], ['seq:dribble,pass,idle', 'Dribble → pass'], ['seq:run,idle', 'Run → stop'], ['seq:slide,run,dribble', 'Defense → run → offense'], ['seq:walk,run,idle', 'Walk → run → stop'],
];
const ALAB_DUR = { shoot: 1.05, fake: 0.7, pass: 0.6, jump: 0.8, idle: 1.0, dribble: 1.1, hold: 1.0, slide: 1.1, run: 1.2, walk: 1.2, layup: 0.85, dunk: 0.95, cross: 0.45, post: 1.4, bodyup: 1.2, steal: 0.45, shove: 0.4, punch: 0.5, clothes: 0.6, stagger: 2.2, mv: 0.5, floater: 0.9, hop: 0.8, swat: 0.8, catch: 1.0, boxout: 1.2, knees: 2.0, grab: 0.45, reach: 1.2, dive: 1.5, emote: 2.0 };
// who you can pick: your builds, your homies, and built-in players of every style
function alabCast() {
  const L = [];
  (S.slots || []).forEach((t, i) => L.push({ k: 'slot', i, n: t.name + (i === S.slot ? ' (active)' : ''), spec: Object.assign({}, i === S.slot ? myBuild() : { name: t.name, build: t.build, attrs: t.attrs, badges: t.badges, worn: t.worn, moves: t.moves, anim: t.anim }) }));
  (S.homies || []).forEach((h, i) => L.push({ k: 'homie', i, n: h.name + ' (homie)', spec: h }));
  for (const s of STYLES) L.push({ k: 'ai', n: s.n + ' (built-in)', spec: Object.assign(aiBuild(80, s.id), { name: s.n.toUpperCase() }) });
  return L;
}
function alabOpen() {
  disposeScene(scene); scene = new THREE.Scene(); W = null; MT = null; scene.background = new THREE.Color(0x141418); baseLights(scene, 0xffe8d8, 0x30303a, 0xffffff, 1.6);
  const g = M(new THREE.PlaneGeometry(40, 40), toon('#2a2a31'), 0, 0, 0, scene); g.rotation.x = -Math.PI / 2;
  for (const x of [-1, 1]) ink(M(cyl(0.45, 0.5, 0.04, 20), toon('#3a3a44'), x * 0.6, 0.02, 0, scene), 1.02);
  ST = { kind: 'alab', t: 0 }; ALAB.mark = null; const cast = alabCast(); ALAB.cast = cast; if (ALAB.ai === undefined) { ALAB.ai = 0; ALAB.bi = Math.min(cast.length - 1, (S.slots || []).length + (S.homies || []).length + 1); }
  alabRigs(); document.body.dataset.state = 'create'; openPanel(alabRender, 'side', () => { alabLeave(); uiClose(); uiDev(); });
}
function alabRigs() {
  for (const k of ['a', 'b']) if (ALAB[k]) { scene.remove(ALAB[k].R.root); if (ALAB[k].ball) scene.remove(ALAB[k].ball); }
  const mk = (c, x) => { const R = makeRig(c.spec); R.root.position.set(x, 0, 0); scene.add(R.root); const ball = makeBall('bl_std'); scene.add(ball); return { R, c, x, ball, y: 0, an: null }; };
  ALAB.a = mk(ALAB.cast[ALAB.ai], -0.6); ALAB.b = mk(ALAB.cast[ALAB.bi], 0.6); ALAB.prof = JSON.parse(JSON.stringify(ALAB.a.R.prof)); ALAB.a.R.prof = ALAB.prof; ALAB.t = 0;
}
// what a player is doing at lab time t: a single action loops; a sequence plays its parts back to back
function alabAt(t) {
  const act = ALAB.act; if (!act.startsWith('seq:')) { const d = act.startsWith('fall:') ? 2.2 : ALAB_DUR[act] || ALAB_DUR[act.split(':')[0]] || 1; return { an: act, t: t % (d + 0.5), d }; }
  const parts = act.slice(4).split(','), tot = parts.reduce((s, a) => s + (ALAB_DUR[a] || 1), 0); let u = t % tot;
  for (const a of parts) { const d = ALAB_DUR[a] || 1; if (u < d) return { an: a, t: u, d }; u -= d; } return { an: parts[0], t: 0, d: 1 };
}
function alabPose(F, s, dt) {
  const R = F.R, prof = R.prof; let an = s.an, P, y = 0, o = { leg: R.legLen, prof };
  if (an === 'stagger' || an.startsWith('fall:')) { const n = Math.floor(ALAB.t / 2.7); o.hit = { tw: Math.sin(n * 2.1 + (F === ALAB.b ? 1.6 : 0)), fb: Math.cos(n * 1.3) * 0.8, pw: 1, s1: Math.sin(n * 3.7), s2: Math.cos(n * 2.9) }; }      /* a different hit every loop */
  if (an === 'shoot' || an === 'fake') { const rel = an === 'fake' ? 0.6 : 0.6, u = s.t / rel; o.rel = rel; o.n = 1; P = poseOf(an, s.t, o); if (an === 'shoot') y = u > 0.62 && u < 1.42 ? 0.42 * Math.sin(Math.PI * (u - 0.62) / 0.8) : 0; }
  else if (an === 'run') { const psi = (s.t * 1.45) % 1; P = poseOf('sprint', 0, { rs: prof.run, psi, duty: 0.33, k: 0.6, hipA: 1.1, flight: 0.08, thigh: R.thigh, shin: R.shin }); profilePosture(P, 'run', prof); }
  else if (an === 'walk') { P = poseOf('gait', 0, { psi: (s.t * 0.95) % 1, amp: 1, hipA: 1, swag: 0.35 + prof.swag * 0.8, thigh: R.thigh, shin: R.shin, leg: R.legLen }); }
  else if (an === 'dribble') { o.sp = 0; o.ph = s.t * 7; o.dr = 0.8; o.hand = prof.hand; P = poseOf('dribble', s.t, o); profilePosture(P, 'dribble', prof); }
  else if (an === 'slide') { o.ph = s.t * 6; o.up = true; P = poseOf('slide', s.t, o); profilePosture(P, 'slide', prof); }
  else if (/^(jump|steal):\d$/.test(an)) { o.v = +an.slice(-1); const bs = an.split(':')[0]; P = poseOf(bs, s.t, o); y = bs === 'jump' && s.t < 0.6 ? 0.5 * Math.sin(Math.PI * s.t / 0.6) : 0; }
  else if (an === 'jump') { P = poseOf('jump', s.t, o); y = s.t < 0.6 ? 0.5 * Math.sin(Math.PI * s.t / 0.6) : 0; }
  else if (an.startsWith('layup:') || an.startsWith('dunk:')) { const bs = an.split(':')[0], kd = an.split(':')[1]; o.u = s.t / ALAB_DUR[bs]; if (bs === 'dunk') o.style = kd; else o.kind = kd; P = poseOf(bs, s.t, o); y = Math.sin(Math.PI * clamp((o.u - 0.25) / 0.7, 0, 1)) * (bs === 'dunk' ? 0.85 : 0.55); }
  else if (an === 'layup' || an === 'dunk') { o.u = s.t / ALAB_DUR[an]; o.style = an === 'dunk' ? 'twohand' : undefined; P = poseOf(an, s.t, o); y = Math.sin(Math.PI * clamp((o.u - 0.25) / 0.7, 0, 1)) * (an === 'dunk' ? 0.85 : 0.55); }
  else if (an === 'cross') { o.kind = 'cross'; o.u = Math.min(1, s.t / 0.4); o.side = 1; o.hand = 'R'; P = poseOf('move', s.t, o); }
  else if (an === 'post') { o.sp = 0; o.ph = s.t * 7; o.dr = 0.45; o.hand = 'R'; o.post = 1; P = poseOf('dribble', s.t, o); }
  else if (an === 'bodyup') { o.ph = s.t * 6; o.bodyUp = 1; P = poseOf('slide', s.t, o); profilePosture(P, 'slide', prof); }
  else if (an === 'clothes') { o.sp = 1; o.ph = s.t * 9; P = poseOf('clothes', s.t, o); }
  else if (an === 'stagger') { o.fall = true; o.dur = 2.2; o.side = 0; P = poseOf('stagger', s.t, o); }
  else if (an.startsWith('fan:')) P = crowdPose(an.slice(4), ALAB.t, { ph: 0 }, prof);
  else if (an.startsWith('swag:')) { o.sp = 0; o.ph = ALAB.t * 7; o.dr = 0.8; o.hand = 'R'; o.swag = an.slice(5); o.swT = ALAB.t; P = poseOf('dribble', ALAB.t, o); }
  else if (/^def:screen[23]$/.test(an)) { o.screen = +an.slice(-1); P = poseOf('idle', ALAB.t, o); }
  else if (/^def:(fight|under|stuck)$/.test(an)) { o.scrR = an.slice(4); P = poseOf('slide', ALAB.t, o); }
  else if (an === 'def:screen' || an === 'def:box' || an === 'def:dive') { o[an.slice(4)] = 1; P = poseOf('idle', ALAB.t, o); }
  else if (an.startsWith('def:')) { o.ph = ALAB.t * 6; o.defMode = an.slice(4); o.ballSide = 1; o.swT = ALAB.t; P = poseOf('slide', ALAB.t, o); }
  else if (an.startsWith('fall:')) { o.fall = true; o.dur = 2.2; o.side = 1; o.kind = an.slice(5); P = poseOf('stagger', s.t % 2.7, o); }
  else if (an.startsWith('celeb:')) { o.style = an.slice(6); P = poseOf('celeb', ALAB.t, o); y = o.style === 'airflex' ? 0.6 : 0; }
  else if (an.startsWith('mv:')) { o.kind = an.slice(3); o.u = Math.min(1, s.t / 0.5); o.side = 1; o.hand = 'R'; P = poseOf('move', s.t, o); }
  else if (an.startsWith('pass:')) { o.pk = an.slice(5); P = poseOf('pass', s.t * 0.5, o); }
  else if (an === 'hop') { o.u = s.t / 0.8; P = poseOf('hop', s.t, o); y = Math.sin(Math.PI * clamp(o.u, 0, 1)) * 0.25; }
  else if (an === 'floater') { P = poseOf('floater', s.t, o); y = Math.sin(Math.PI * clamp(s.t / 0.9, 0, 1)) * 0.35; }
  else if (an === 'swat') { P = poseOf('swat', s.t, o); y = Math.sin(Math.PI * clamp(s.t / 0.8, 0, 1)) * 0.45; }
  else if (an.startsWith('grab:')) { const g = an.slice(5); o.grab = { u: clamp(s.t / 0.45, 0, 1), h: g === 'scoop' ? 0.1 : g === 'board' ? 1.2 : 0.6, side: 1 }; P = poseOf('idle', ALAB.t, o); y = g === 'board' ? 0.4 * Math.sin(Math.PI * clamp(s.t / 0.45, 0, 1)) : 0; }
  else if (an === 'reach') { o.reachL = { k: 1, side: 1, low: 0.5 + 0.5 * Math.sin(ALAB.t * 2) }; P = poseOf('idle', ALAB.t, o); }
  else if (an === 'dive') { o.dive = 1; P = poseOf('idle', ALAB.t, o); }
  else if (an.startsWith('emote:')) { const e = an.slice(6); P = poseOf(e, ALAB.t, Object.assign(o, { ph: 0 })); }
  else P = poseOf(an, an === 'idle' ? ALAB.t : s.t, o);
  F.y = y; landLayer(P, R, F, dt, prof);
  if (an !== F.an) { F.rate = transRate(F.an || an, an); F.trT = 0; F.an = an; } F.trT = (F.trT || 0) + dt; if (F.trT < 2.5 / F.rate) P.rate = Math.max(P.rate || 16, F.rate);
  applyPose(R, P, dt); R.root.position.y = y; R.root.updateMatrixWorld(true);
  // the ball: in the hands, up into the shooting hand, gone at the release; bouncing under the dribble hand
  const B = F.ball; B.visible = ALAB.ball && !/^(run|walk|slide|jump|idle|bodyup|steal|shove|punch|clothes|stagger)$/.test(an) && !an.startsWith('fan:') && !an.startsWith('def:') && !an.startsWith('fall:') && !an.startsWith('celeb:') && !an.startsWith('emote:') && !/^(dive|reach|knees|boxout|swat)$/.test(an);
  if (B.visible) { const sh = prof.hand === 'L' ? 'L' : 'R', off = sh === 'R' ? 'L' : 'R', a = new THREE.Vector3(), b = new THREE.Vector3(); handPos(R, sh, a); handPos(R, off, b);
    if (an === 'shoot' || an === 'fake') { const u = s.t / 0.6, lift = clamp((u - 0.35) / 0.4, 0, 1); if (an === 'shoot' && u > 1) { const f = u - 1; B.position.set(F.x, a.y + f * 4.5 - f * f * 3, a.z - f * 2.2); } else { a.lerp(b, 0.5 * (1 - lift)); a.y += 0.06 + 0.05 * lift; B.position.copy(a); } }
    else if (an === 'dribble' || an === 'post' || an === 'cross' || an.startsWith('swag:') || an.startsWith('mv:')) { handPos(R, prof.hand === 'L' ? 'L' : 'R', a); const c = Math.abs(Math.sin(s.t * 7 / 2)); B.position.set(a.x, 0.12 + (a.y - 0.18) * c, a.z + 0.05); }
    else if (an === 'pass') { const f = s.t / 0.6; a.lerp(b, 0.5); B.position.set(a.x, a.y, a.z + (f > 0.45 ? (f - 0.45) * 6 : 0)); }
    else { a.lerp(b, 0.5); B.position.copy(a); } }
}
function alabStep(dt) {
  const step = ALAB.step; ALAB.step = 0; const d = ALAB.paused ? step : dt * ALAB.speed; ALAB.t += d;
  const s = alabAt(ALAB.t); for (const F of [ALAB.a, ALAB.b]) if (F) { F.R.root.rotation.y = ALAB.view || 0.5; ANIM_ED.rec = F === ALAB.a; ANIM_ED.skip = F === ALAB.b && ALAB.tab === 'edit' && ALAB.cmp; try { alabPose(F, s, ALAB.paused ? 1 : Math.max(d, 1e-4)); } finally { ANIM_ED.skip = false; } }
  if (ALAB.tab === 'edit') edLive(); else if (ALAB.mark) ALAB.mark.visible = false;
  const lab = $('alabT'); if (lab) lab.textContent = `${s.an} · ${s.t.toFixed(2)} s` + (s.an === 'shoot' ? ` · u ${(s.t / 0.6).toFixed(2)} (${shotPhaseName(s.t / 0.6)})` : '');
  const portrait = innerWidth < innerHeight; if (portrait) { camera.position.set(0, 1.6, 5.2); camera.lookAt(0, 0.6, 0); } else {      // the panel covers the right of the screen: aim so both players stand in the part you can see
    const pn = $('panel'), pf = pn && pn.style.display !== 'none' ? clamp(pn.getBoundingClientRect().left / innerWidth, 0.3, 1) : 1, d = 5.4, hw = d * Math.tan(camera.fov * Math.PI / 360) * camera.aspect, cx = (1 - pf) * hw;
    camera.position.set(cx, 1.45, d); camera.lookAt(cx, 1.0, 0); }
}
function shotPhaseName(u) { let n = 'gather'; for (const k in SHOT_PH) if (u >= SHOT_PH[k]) n = k; return n; }
function alabPick(k, v) { ALAB[k] = +v; alabRigs(); rerender(); }
window.alabPick = alabPick;
function alabAct(k) { ALAB.act = k; ALAB.t = 0; ALAB.edLock = null; rerender(); }
window.alabAct = alabAct;      /* the cast pickers are <select>s: an inline onchange needs a global */
function alabRender() {
  const P = ALAB.prof, cast = ALAB.cast, A = cast[ALAB.ai], sl = (lbl, v, lo, hi, st, fn, id) => `<label class="sl">${lbl} <b id="${id}">${(+v).toFixed(2)}</b></label><input type="range" min="${lo}" max="${hi}" step="${st}" value="${v}" data-k="${on(el => { fn(+el.value); $(id).textContent = (+el.value).toFixed(2); })}">`;
  let h = `<div class="ph"><h2>ANIM LAB</h2>${Btn('✕', () => { alabLeave(); uiClose(); uiDev(); }, 'alt sm')}</div><div class="pb">`;
  h += `<div class="tabs">` + [['profile', 'PROFILE'], ['edit', 'EDIT ANIMATIONS']].map(([k, n]) => Btn(n, () => { ALAB.tab = k; rerender(); }, ALAB.tab === k ? 'sel' : '')).join('') + `</div>`;
  h += `<div class="card"><div class="row"><b>LEFT</b><select onchange="alabPick('ai', this.value)">${cast.map((c, i) => `<option value="${i}" ${i === ALAB.ai ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div>`
    + `<div class="row" style="margin-top:4px"><b>RIGHT</b><select onchange="alabPick('bi', this.value)">${cast.map((c, i) => `<option value="${i}" ${i === ALAB.bi ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div><p class="mu" id="alabT" style="margin-top:6px">—</p></div>`;
  { const grp = {}; for (const [k, n] of ALAB_ACTS) { const g = n.includes(':') ? n.split(':')[0] : k.startsWith('seq:') ? 'Sequences' : 'Basics'; (grp[g] = grp[g] || []).push([k, n]); }
    h += `<div class="cat">ACTION <span class="mu" style="text-transform:none;letter-spacing:.02em">— ${ALAB_ACTS.length} of them</span></div><div class="card"><select style="width:100%" onchange="alabAct(this.value)">` + Object.keys(grp).map(g => `<optgroup label="${esc(g)}">` + grp[g].map(([k, n]) => `<option value="${k}" ${ALAB.act === k ? 'selected' : ''}>${esc(n)}</option>`).join('') + `</optgroup>`).join('') + `</select>`
      + `<div style="margin-top:6px">${Btn('◀ PREV', () => alabAct(ALAB_ACTS[(ALAB_ACTS.findIndex(q => q[0] === ALAB.act) - 1 + ALAB_ACTS.length) % ALAB_ACTS.length][0]), 'sm alt')} ${Btn('NEXT ▶', () => alabAct(ALAB_ACTS[(ALAB_ACTS.findIndex(q => q[0] === ALAB.act) + 1) % ALAB_ACTS.length][0]), 'sm alt')}</div></div>`; }
  if (ALAB.tab === 'edit') return h + edTab() + `</div>`;
  h += `<div class="cat">PLAYBACK</div><div class="card">${sl('SPEED', ALAB.speed, 0.05, 2, 0.05, v => { ALAB.speed = v; }, 'alS')}<div style="margin-top:6px">${Btn(ALAB.paused ? '▶ PLAY' : '❚❚ PAUSE', () => { ALAB.paused = !ALAB.paused; rerender(); }, 'sm')} ${Btn('◀ FRAME', () => { ALAB.paused = true; ALAB.t = Math.max(0, ALAB.t - 2 / 60); ALAB.step = 1 / 60; rerender(); }, 'sm alt')} ${Btn('FRAME ▶', () => { ALAB.paused = true; ALAB.step = 1 / 60; rerender(); }, 'sm alt')} ${Btn('RESTART', () => { ALAB.t = 0; }, 'sm alt')} ${Btn(ALAB.ball ? 'BALL: ON' : 'BALL: OFF', () => { ALAB.ball = !ALAB.ball; rerender(); }, 'sm alt')}</div>`
    + sl('TURN', ALAB.view === undefined ? 0.5 : ALAB.view, -3.14, 3.14, 0.05, v => { ALAB.view = v; }, 'alV') + `</div>`;
  h += `<div class="cat">LEFT PLAYER'S PROFILE <span class="mu" style="text-transform:none;letter-spacing:.02em">— cosmetic only, never changes a gameplay number</span></div><div class="card"><h3>JUMP SHOT BLEND</h3>`;
  const wset = (g, k) => v => { P[g][k] = v; const n = normW(P[g]); Object.assign(P[g], n); for (const kk in n) { const e = $('al_' + g + kk); if (e) e.textContent = n[kk].toFixed(2); } };
  for (const [k, n] of SHOT_STYLES) h += sl(n.toUpperCase(), P.shot[k], 0, 1, 0.01, wset('shot', k), 'al_shot' + k);
  h += `<h3 style="margin-top:8px">RUN STYLE</h3><div>` + RUN_STYLES.map(([k, n]) => Btn(n, () => { P.run = k; rerender(); }, 'sm ' + ((P.run || '') === k ? '' : 'alt'))).join(' ') + `</div><h3 style="margin-top:8px">LOWER BASE <span class="mu">feet, knees, hips</span></h3><div>` + LOWER_BASES.map(([k, n]) => Btn(n, () => { P.lower = k; rerender(); }, 'sm ' + ((P.lower || '') === k ? '' : 'alt'))).join(' ') + `</div><h3 style="margin-top:8px">UPPER BASE <span class="mu">the release</span></h3><div>` + UPPER_BASES.map(([k, n]) => Btn(n, () => { P.upper = k; rerender(); }, 'sm ' + ((P.upper || '') === k ? '' : 'alt'))).join(' ') + `</div>`;
  h += `<h3 style="margin-top:8px">IDLE BLEND</h3>`; for (const [k, n] of IDLE_STYLES) h += sl(n.toUpperCase(), P.idle[k], 0, 1, 0.01, wset('idle', k), 'al_idle' + k);
  h += `<h3 style="margin-top:8px">POSTURE AND TIMING</h3><div style="margin:4px 0">${Btn('SHOOTS ' + (P.hand === 'L' ? 'LEFT' : 'RIGHT'), () => { P.hand = P.hand === 'L' ? 'R' : 'L'; rerender(); }, 'sm alt')}</div>`;
  for (const [k, n, lo, hi] of PROF_KEYS) h += sl(n.toUpperCase(), P[k], lo, hi, 0.01, v => { P[k] = v; }, 'al_' + k);
  const canSave = A.k === 'slot' || A.k === 'homie';
  h += `<div style="margin-top:8px">${Btn('SAVE PROFILE', () => { const c = JSON.parse(JSON.stringify(P)); if (A.k === 'slot') { if (A.i === S.slot) S.anim = c; else S.slots[A.i].anim = c; } else if (A.k === 'homie') S.homies[A.i].anim = c; save(); sfx('unlock'); toast('PROFILE SAVED', A.n + ' moves like this now, everywhere.'); }, 'sm', !canSave)} ${Btn('RESET TO DEFAULTS', () => { const sp = Object.assign({}, A.spec, { anim: undefined }); ALAB.prof = profileFromBuild(sp); ALAB.a.R.prof = ALAB.prof; if (canSave) { if (A.k === 'slot') { if (A.i === S.slot) S.anim = null; else S.slots[A.i].anim = null; } else S.homies[A.i].anim = null; save(); } rerender(); }, 'sm alt')}</div>`
    + `<p class="mu" style="margin-top:6px">${canSave ? 'Saving writes this profile to ' + esc(A.n) + ': it shows in games, on the Block, and to friends online.' : 'Built-in players get their profile from their name and build, so it is the same every time you meet them. Save is for your builds and homies.'}</p></div>`;
  return h + `</div>`;
}

// =====================================================================
//  EDIT: bend any animation by hand. Pick a joint, drag its sliders; a key goes in at that point of the action and
//  the pose eases from key to key. The edit changes that action in the game for every player (cosmetic only).
// =====================================================================
const ED_JOINTS = [['head', 'Head'], ['neck', 'Neck'], ['chest', 'Chest'], ['spine', 'Lower back'], ['hips', 'Hips'],
  ['shR', 'R shoulder'], ['elR', 'R elbow'], ['wrR', 'R wrist'], ['shL', 'L shoulder'], ['elL', 'L elbow'], ['wrL', 'L wrist'],
  ['hpR', 'R hip'], ['knR', 'R knee'], ['anR', 'R ankle'], ['hpL', 'L hip'], ['knL', 'L knee'], ['anL', 'L ankle']];
const ED_AX = [['BEND', 'forward / back'], ['TWIST', 'turn'], ['SIDE', 'out / in']];
const DEG = 180 / Math.PI;
function edStore() { if (!S.animEd) S.animEd = {}; return S.animEd; }
function edCurKey() { return ALAB.edLock || (ANIM_ED.last && ANIM_ED.last.key) || ALAB.act; }
function edCurU() { return ANIM_ED.last ? ANIM_ED.last.u : 0; }
// the offsets at this moment: an exact key if there is one here, else what the curve gives
function edValue(key, u, j) {
  const E = edStore()[key]; if (!E || !E.keys || !E.keys.length) return j === 'y' ? 0 : [0, 0, 0];
  const s = edSample(E, u, ANIM_ED.last ? ANIM_ED.last.loop : true); if (j === 'y') return (s && s.y) || 0; return (s && s.j[j]) ? s.j[j].slice() : [0, 0, 0];
}
// the key at phase u, made if missing: a new key starts from what the curve already shows there, so nothing jumps
function edKeyAt(key, u) {
  const st = edStore(), E = st[key] || (st[key] = { keys: [] }); u = Math.round(u * 100) / 100;
  let k = E.keys.find(q => Math.abs(q.u - u) < 0.015); if (k) return k;
  const loop = ANIM_ED.last ? ANIM_ED.last.loop : true, smp = E.keys.length ? edSample(E, u, loop) : null;
  k = { u, j: {}, y: smp ? smp.y || 0 : 0 }; if (smp) for (const n in smp.j) k.j[n] = smp.j[n].slice();
  E.keys.push(k); E.keys.sort((a, b) => a.u - b.u); return k;
}
function edTouch() { ALAB.edDirty = 1; ALAB.paused = true; }
function edSet(axis, v) {
  const key = edCurKey(), j = ALAB.joint || 'shR', k = edKeyAt(key, edCurU());
  if (axis === 'y') k.y = v; else { const a = k.j[j] || (k.j[j] = [0, 0, 0]); a[axis] = v / DEG; }
  edTouch(); edKeysUi();
}
function edKeysUi() {
  const el = $('edKeys'); if (!el) return; const E = edStore()[edCurKey()], K = (E && E.keys) || [];
  el.innerHTML = K.length ? K.map((k, i) => `<span class="chip" style="display:inline-block;margin:2px;padding:3px 7px;border:1px solid var(--line);border-radius:6px;cursor:pointer" data-k="${on(() => edGoto(k.u))}">${(k.u * 100).toFixed(0)}% <b style="color:var(--heat)" data-k="${on(() => { K.splice(i, 1); if (!K.length) delete edStore()[edCurKey()]; edTouch(); rerender(); })}">✕</b></span>`).join('') : '<span class="mu">No keys yet: drag a slider and one goes in here.</span>';
}
// jump the lab clock to a phase of the action (paused), so a key can be looked at or changed
function edGoto(u) { const s = alabAt(0); ALAB.t = clamp(u, 0, 0.999) * (s.d || 1); ALAB.paused = true; ALAB.step = 1e-4; }
function edLive() {      // every frame: the readout, the sliders following the curve while you are not dragging, the marker on the joint
  const key = edCurKey(), u = edCurU(), lab = $('edNow'); if (lab) lab.innerHTML = `<b>${esc(key)}</b> · ${(u * 100).toFixed(0)}% through` + (edStore()[key] ? (edStore()[key].off ? ' · <span style="color:var(--heat)">edit OFF</span>' : ' · <span style="color:var(--ok,#3dffa0)">edited</span>') : '');
  const ph = $('edPh'); if (ph && document.activeElement !== ph) ph.value = u;
  const j = ALAB.joint || 'shR', v = edValue(key, u, j);
  for (let a = 0; a < 3; a++) { const i = $('edA' + a), b = $('edV' + a); if (i && document.activeElement !== i) { i.value = Math.round(v[a] * DEG); if (b) b.textContent = Math.round(v[a] * DEG) + '°'; } }
  const yi = $('edY'), yb = $('edYv'), yv = edValue(key, u, 'y'); if (yi && document.activeElement !== yi) { yi.value = yv; if (yb) yb.textContent = yv.toFixed(2); }
  if (!ALAB.mark) { ALAB.mark = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2d78, depthTest: false })); ALAB.mark.renderOrder = 20; scene.add(ALAB.mark); }
  const J = ALAB.a && ALAB.a.R.joints[j]; ALAB.mark.visible = ALAB.tab === 'edit' && !!J; if (J) J.getWorldPosition(ALAB.mark.position);
  if (ALAB.edDirty && (ALAB.edSaveT = (ALAB.edSaveT || 0) + 1) > 45) { ALAB.edDirty = 0; ALAB.edSaveT = 0; save(); }
}
function edTab() {
  const key = edCurKey(), E = edStore()[key], j = ALAB.joint || 'shR', st = edStore();
  let h = `<div class="card"><h3>EDITING</h3><p id="edNow" class="mu">—</p><div style="margin-top:4px">${Btn(ALAB.edLock ? '🔒 LOCKED: ' + esc(ALAB.edLock) : 'LOCK THIS ACTION', () => { ALAB.edLock = ALAB.edLock ? null : (ANIM_ED.last && ANIM_ED.last.key) || ALAB.act; rerender(); }, 'sm ' + (ALAB.edLock ? '' : 'alt'))} ${Btn(ALAB.cmp ? 'RIGHT: ORIGINAL' : 'RIGHT: EDITED TOO', () => { ALAB.cmp = !ALAB.cmp; rerender(); }, 'sm alt')}</div>`
    + `<p class="mu" style="margin-top:6px">Pick an action, pause where it looks wrong, choose a joint and drag. The right player shows the original so you can compare. A sequence edits whichever part is playing; lock it to stay on one.</p></div>`;
  h += `<div class="cat">TIMELINE</div><div class="card"><input type="range" id="edPh" min="0" max="0.999" step="0.005" value="${edCurU()}" style="width:100%" data-k="${on(el => edGoto(+el.value))}"><div style="margin-top:4px">${Btn(ALAB.paused ? '▶ PLAY' : '❚❚ PAUSE', () => { ALAB.paused = !ALAB.paused; rerender(); }, 'sm')} ${Btn('◀ FRAME', () => { ALAB.paused = true; ALAB.t = Math.max(0, ALAB.t - 2 / 60); ALAB.step = 1 / 60; }, 'sm alt')} ${Btn('FRAME ▶', () => { ALAB.paused = true; ALAB.step = 1 / 60; }, 'sm alt')} ${Btn('+ KEY HERE', () => { edKeyAt(key, edCurU()); edTouch(); edKeysUi(); }, 'sm alt')}</div>`
    + `<h3 style="margin-top:8px">KEYS</h3><div id="edKeys"></div></div>`;
  h += `<div class="cat">JOINT</div><div class="card">` + ED_JOINTS.map(([k, n]) => Btn(n + (E && E.keys.some(q => q.j[k] && (q.j[k][0] || q.j[k][1] || q.j[k][2])) ? ' •' : ''), () => { ALAB.joint = k; rerender(); }, 'sm ' + (j === k ? '' : 'alt'))).join(' ');
  h += ED_AX.map(([n, d], a) => `<label class="sl" style="margin-top:6px;display:block">${n} <span class="mu">${d}</span> <b id="edV${a}">0°</b></label><input type="range" id="edA${a}" min="-180" max="180" step="1" value="0" style="width:100%" data-k="${on(el => { edSet(a, +el.value); $('edV' + a).textContent = el.value + '°'; })}">`).join('')
    + `<label class="sl" style="margin-top:6px;display:block">BODY HEIGHT <span class="mu">whole body up / down</span> <b id="edYv">0.00</b></label><input type="range" id="edY" min="-0.6" max="0.6" step="0.01" value="0" style="width:100%" data-k="${on(el => { edSet('y', +el.value); $('edYv').textContent = (+el.value).toFixed(2); })}">`
    + `<div style="margin-top:6px">${Btn('ZERO THIS JOINT HERE', () => { const k = edKeyAt(key, edCurU()); delete k.j[j]; edTouch(); }, 'sm alt')} ${Btn('ZERO JOINT EVERYWHERE', () => { if (E) for (const q of E.keys) delete q.j[j]; edTouch(); rerender(); }, 'sm alt')}</div></div>`;
  h += `<div class="cat">THIS ACTION</div><div class="card">${Btn(E && E.off ? 'EDIT IS OFF: TURN ON' : 'TURN EDIT OFF', () => { if (E) { E.off = !E.off; edTouch(); rerender(); } }, 'sm alt', !E)} ${Btn('MIRROR R → L', () => { if (!E) return; for (const q of E.keys) for (const n of Object.keys(q.j)) if (n.endsWith('R')) { const v = q.j[n]; q.j[n.slice(0, -1) + 'L'] = [v[0], -v[1], -v[2]]; } edTouch(); rerender(); }, 'sm alt', !E)} ${Btn('RESET ACTION', () => { delete st[key]; edTouch(); rerender(); }, 'sm red', !E)}</div>`;
  const keys = Object.keys(st);
  h += `<div class="cat">ALL YOUR EDITS</div><div class="card">` + (keys.length ? keys.map(k => `<div class="row" style="margin:2px 0"><span>${esc(k)} <span class="mu">${st[k].keys.length} key${st[k].keys.length === 1 ? '' : 's'}${st[k].off ? ' · off' : ''}</span></span>${Btn('EDIT', () => { ALAB.edLock = k; const a = ALAB_ACTS.find(q => q[0] === k || q[0] === k.replace(/^grab:/, 'grab:')); if (a) ALAB.act = a[0]; rerender(); }, 'sm alt')}</div>`).join('') : '<p class="mu">Nothing edited yet.</p>')
    + `<div style="margin-top:6px">${Btn('COPY EDITS', () => { const c = edCode(st); try { navigator.clipboard.writeText(c).then(() => toast('EDITS COPIED', 'Paste them to Claude to bake them into the game for good, or into another save.'), () => prompt('Copy this:', c)); } catch (e) { prompt('Copy this:', c); } }, 'sm', !keys.length)} ${Btn('PASTE EDITS', () => { const c = prompt('Paste an edits code (GNANIM1:...)'); if (!c) return; const m = edFromCode(c); if (!m) { toast('THAT CODE DID NOT READ', 'It should start with GNANIM1:'); return; } Object.assign(st, m); edTouch(); rerender(); }, 'sm alt')} ${Btn('CLEAR ALL', () => uiDialog('CLEAR EVERY EDIT', 'Put every animation back the way the game ships it?', [['Clear them', () => { S.animEd = {}; save(); alabOpen(); ALAB.tab = 'edit'; rerender(); }, 'red'], ['Never mind', null, 'alt']]), 'sm red', !keys.length)}</div>`
    + `<p class="mu" style="margin-top:6px">Edits are saved with your game and change these actions everywhere you play (online, others see the game's own moves). COPY EDITS gives a code you can send back to have them built in.</p></div>`;
  setTimeout(edKeysUi, 0);
  return h;
}

function alabLeave() { ANIM_ED.rec = false; ANIM_ED.skip = false; ANIM_ED.last = null; if (ALAB.edDirty) { ALAB.edDirty = 0; save(); } }
