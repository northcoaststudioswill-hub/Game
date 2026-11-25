// GOT NEXT — ANIM LAB (developer only, inside the Dev Room): two players side by side doing the same action, the
// profile of the left one on sliders. Preview the foundational styles, blends, transitions; slow it down, pause, step
// a frame; save the profile to one of your builds or a homie, or reset it to the defaults its build gives it.
'use strict';
const ALAB = { a: null, b: null, act: 'shoot', speed: 1, paused: false, ball: true, t: 0, step: 0, prof: null, solo: null, ui: 'blend' };
const ALAB_ACTS = [
  ['shoot', 'Jump shot'], ['fake', 'Pump fake'], ['idle', 'Idle'], ['dribble', 'Dribble'], ['hold', 'Triple threat'], ['slide', 'Defense'], ['run', 'Run'], ['walk', 'Walk'], ['pass', 'Pass'], ['jump', 'Contest'],
  ['swag:rock', 'Swag: rock'], ['swag:tween', 'Swag: through the legs'], ['swag:behind', 'Swag: behind the back'], ['swag:yoyo', 'Swag: yo-yo'], ['swag:sizeup', 'Swag: size-up'], ['swag:wave', 'Swag: wave him up'], ['def:sag', 'Defense: sagging off'], ['def:tight', 'Defense: up close'], ['def:screen', 'Set a screen'], ['def:screen2', 'Hard screen'], ['def:screen3', 'Soft screen (slip)'], ['def:fight', 'Fight over a screen'], ['def:under', 'Go under a screen'], ['def:stuck', 'Caught on a screen'], ['def:box', 'Box out'],
  ['layup', 'Layup'], ['layup:finger', 'Layup: finger roll'], ['layup:under', 'Layup: up and under'], ['layup:over', 'Layup: over the top'], ['layup:reverse', 'Layup: reverse'], ['layup:spin', 'Layup: 360'], ['layup:quick', 'Layup: wrong foot'], ['layup:scoop', 'Layup: scoop'], ['layup:power', 'Layup: power'], ['dunk', 'Dunk'], ['dunk:onehand', 'Dunk: one hand'], ['dunk:cock', 'Dunk: cocked back'], ['dunk:hammer', 'Dunk: hammer'], ['dunk:lean', 'Dunk: leaner'], ['dunk:hangtwo', 'Dunk: two hands and hang'], ['dunk:tip', 'Dunk: tip slam'], ['cross', 'Crossover'], ['post', 'Post up (LT)'], ['bodyup', 'Body up (LT)'], ['steal', 'Steal'], ['shove', 'Shove'], ['punch', 'Haymaker'], ['clothes', 'Clothesline'], ['stagger', 'Fall: sit'], ['fall:face', 'Fall: face first'], ['fall:flat', 'Fall: laid out'], ['fall:spin', 'Fall: spun round'], ['fall:knee', 'Fall: to a knee'],
  ['celeb:airflex', 'Celeb: air flex'], ['celeb:goggles', 'Celeb: three goggles'], ['celeb:bow', 'Celeb: take a bow'], ['celeb:callme', 'Celeb: call me'], ['celeb:flexdown', 'Celeb: crab flex'], ['celeb:toosmall', 'Celeb: too small'], ['celeb:stare', 'Celeb: stare down'], ['celeb:pout', 'Celeb: pout'], ['celeb:shh', 'Celeb: shh'], ['celeb:rock', 'Celeb: rock the baby'], ['celeb:nightnight', 'Celeb: night night'], ['celeb:pound', 'Celeb: chest pound'], ['celeb:shrug', 'Celeb: shrug'], ['celeb:floor', 'Celeb: slap the floor'], ['celeb:wag', 'Celeb: finger wag'], ['celeb:greenbean', 'Celeb: green bean'], ['celeb:greengiant', 'Celeb: green giant'], ['celeb:iceveins', 'Celeb: ice in my veins'], ['celeb:fentlean', 'Celeb: fent lean'], ['celeb:pour40', 'Celeb: pour out the 40'],
  ['fan:up', 'Fan: arms up'], ['fan:jump', 'Fan: jump'], ['fan:ohh', 'Fan: OHHH'], ['fan:point', 'Fan: point & laugh'], ['fan:cover', 'Fan: hand over mouth'], ['fan:boo', 'Fan: boo'], ['fan:count', 'Fan: three'], ['fan:wave', 'Fan: towel'], ['fan:clap', 'Fan: clap'], ['fan:phone', 'Fan: phone'], ['fan:film', 'Fan: filming'], ['fan:talk', 'Fan: talking'], ['fan:bob', 'Fan: bobbing'], ['fan:cross', 'Fan: arms crossed'],
  ['seq:idle,shoot,run', 'Idle → shot → land → run'], ['seq:dribble,shoot,idle', 'Dribble → shot'], ['seq:dribble,pass,idle', 'Dribble → pass'], ['seq:run,idle', 'Run → stop'], ['seq:slide,run,dribble', 'Defense → run → offense'], ['seq:walk,run,idle', 'Walk → run → stop'],
];
const ALAB_DUR = { shoot: 1.05, fake: 0.7, pass: 0.6, jump: 0.8, idle: 1.0, dribble: 1.1, hold: 1.0, slide: 1.1, run: 1.2, walk: 1.2, layup: 0.85, dunk: 0.95, cross: 0.45, post: 1.4, bodyup: 1.2, steal: 0.45, shove: 0.4, punch: 0.5, clothes: 0.6, stagger: 2.2 };
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
  ST = { kind: 'alab', t: 0 }; const cast = alabCast(); ALAB.cast = cast; if (ALAB.ai === undefined) { ALAB.ai = 0; ALAB.bi = Math.min(cast.length - 1, (S.slots || []).length + (S.homies || []).length + 1); }
  alabRigs(); document.body.dataset.state = 'create'; openPanel(alabRender, 'side', () => { uiClose(); uiDev(); });
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
  if (an === 'shoot' || an === 'fake') { const rel = an === 'fake' ? 0.6 : 0.6, u = s.t / rel; o.rel = rel; o.n = 1; P = poseOf(an, s.t, o); if (an === 'shoot') y = u > 0.62 && u < 1.42 ? 0.42 * Math.sin(Math.PI * (u - 0.62) / 0.8) : 0; }
  else if (an === 'run') { const psi = (s.t * 1.45) % 1; P = poseOf('sprint', 0, { psi, duty: 0.33, k: 0.6, hipA: 1.1, flight: 0.08, thigh: R.thigh, shin: R.shin }); profilePosture(P, 'run', prof); }
  else if (an === 'walk') { P = poseOf('gait', 0, { psi: (s.t * 0.95) % 1, amp: 1, hipA: 1, swag: 0.35 + prof.swag * 0.8, thigh: R.thigh, shin: R.shin, leg: R.legLen }); }
  else if (an === 'dribble') { o.sp = 0; o.ph = s.t * 7; o.dr = 0.8; o.hand = prof.hand; P = poseOf('dribble', s.t, o); profilePosture(P, 'dribble', prof); }
  else if (an === 'slide') { o.ph = s.t * 6; o.up = true; P = poseOf('slide', s.t, o); profilePosture(P, 'slide', prof); }
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
  else if (an === 'def:screen' || an === 'def:box') { o[an.slice(4)] = 1; P = poseOf('idle', ALAB.t, o); }
  else if (an.startsWith('def:')) { o.ph = ALAB.t * 6; o.defMode = an.slice(4); o.ballSide = 1; o.swT = ALAB.t; P = poseOf('slide', ALAB.t, o); }
  else if (an.startsWith('fall:')) { o.fall = true; o.dur = 2.2; o.side = 1; o.kind = an.slice(5); P = poseOf('stagger', s.t % 2.7, o); }
  else if (an.startsWith('celeb:')) { o.style = an.slice(6); P = poseOf('celeb', ALAB.t, o); y = o.style === 'airflex' ? 0.6 : 0; }
  else P = poseOf(an, an === 'idle' ? ALAB.t : s.t, o);
  F.y = y; landLayer(P, R, F, dt, prof);
  if (an !== F.an) { F.rate = transRate(F.an || an, an); F.trT = 0; F.an = an; } F.trT = (F.trT || 0) + dt; if (F.trT < 2.5 / F.rate) P.rate = Math.max(P.rate || 16, F.rate);
  applyPose(R, P, dt); R.root.position.y = y; R.root.updateMatrixWorld(true);
  // the ball: in the hands, up into the shooting hand, gone at the release; bouncing under the dribble hand
  const B = F.ball; B.visible = ALAB.ball && !/^(run|walk|slide|jump|idle|bodyup|steal|shove|punch|clothes|stagger)$/.test(an) && !an.startsWith('fan:') && !an.startsWith('def:') && !an.startsWith('fall:') && !an.startsWith('celeb:');
  if (B.visible) { const sh = prof.hand === 'L' ? 'L' : 'R', off = sh === 'R' ? 'L' : 'R', a = new THREE.Vector3(), b = new THREE.Vector3(); handPos(R, sh, a); handPos(R, off, b);
    if (an === 'shoot' || an === 'fake') { const u = s.t / 0.6, lift = clamp((u - 0.35) / 0.4, 0, 1); if (an === 'shoot' && u > 1) { const f = u - 1; B.position.set(F.x, a.y + f * 4.5 - f * f * 3, a.z - f * 2.2); } else { a.lerp(b, 0.5 * (1 - lift)); a.y += 0.06 + 0.05 * lift; B.position.copy(a); } }
    else if (an === 'dribble' || an === 'post' || an === 'cross' || an.startsWith('swag:')) { handPos(R, prof.hand === 'L' ? 'L' : 'R', a); const c = Math.abs(Math.sin(s.t * 7 / 2)); B.position.set(a.x, 0.12 + (a.y - 0.18) * c, a.z + 0.05); }
    else if (an === 'pass') { const f = s.t / 0.6; a.lerp(b, 0.5); B.position.set(a.x, a.y, a.z + (f > 0.45 ? (f - 0.45) * 6 : 0)); }
    else { a.lerp(b, 0.5); B.position.copy(a); } }
}
function alabStep(dt) {
  const step = ALAB.step; ALAB.step = 0; const d = ALAB.paused ? step : dt * ALAB.speed; ALAB.t += d;
  const s = alabAt(ALAB.t); for (const F of [ALAB.a, ALAB.b]) if (F) { F.R.root.rotation.y = ALAB.view || 0.5; alabPose(F, s, Math.max(d, 1e-4)); }
  const lab = $('alabT'); if (lab) lab.textContent = `${s.an} · ${s.t.toFixed(2)} s` + (s.an === 'shoot' ? ` · u ${(s.t / 0.6).toFixed(2)} (${shotPhaseName(s.t / 0.6)})` : '');
  const portrait = innerWidth < innerHeight; if (portrait) { camera.position.set(0, 1.6, 5.2); camera.lookAt(0, 0.6, 0); } else {      // the panel covers the right of the screen: aim so both players stand in the part you can see
    const pn = $('panel'), pf = pn && pn.style.display !== 'none' ? clamp(pn.getBoundingClientRect().left / innerWidth, 0.3, 1) : 1, d = 5.4, hw = d * Math.tan(camera.fov * Math.PI / 360) * camera.aspect, cx = (1 - pf) * hw;
    camera.position.set(cx, 1.45, d); camera.lookAt(cx, 1.0, 0); }
}
function shotPhaseName(u) { let n = 'gather'; for (const k in SHOT_PH) if (u >= SHOT_PH[k]) n = k; return n; }
function alabPick(k, v) { ALAB[k] = +v; alabRigs(); rerender(); }
window.alabPick = alabPick;      /* the cast pickers are <select>s: an inline onchange needs a global */
function alabRender() {
  const P = ALAB.prof, cast = ALAB.cast, A = cast[ALAB.ai], sl = (lbl, v, lo, hi, st, fn, id) => `<label class="sl">${lbl} <b id="${id}">${(+v).toFixed(2)}</b></label><input type="range" min="${lo}" max="${hi}" step="${st}" value="${v}" data-k="${on(el => { fn(+el.value); $(id).textContent = (+el.value).toFixed(2); })}">`;
  let h = `<div class="ph"><h2>ANIM LAB</h2>${Btn('✕', () => { uiClose(); uiDev(); }, 'alt sm')}</div><div class="pb">`;
  h += `<div class="card"><div class="row"><b>LEFT</b><select onchange="alabPick('ai', this.value)">${cast.map((c, i) => `<option value="${i}" ${i === ALAB.ai ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div>`
    + `<div class="row" style="margin-top:4px"><b>RIGHT</b><select onchange="alabPick('bi', this.value)">${cast.map((c, i) => `<option value="${i}" ${i === ALAB.bi ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div><p class="mu" id="alabT" style="margin-top:6px">—</p></div>`;
  h += `<div class="cat">ACTION</div><div class="card">` + ALAB_ACTS.map(([k, n]) => Btn(n, () => { ALAB.act = k; ALAB.t = 0; rerender(); }, 'sm ' + (ALAB.act === k ? '' : 'alt'))).join(' ') + `</div>`;
  h += `<div class="cat">PLAYBACK</div><div class="card">${sl('SPEED', ALAB.speed, 0.05, 2, 0.05, v => { ALAB.speed = v; }, 'alS')}<div style="margin-top:6px">${Btn(ALAB.paused ? '▶ PLAY' : '❚❚ PAUSE', () => { ALAB.paused = !ALAB.paused; rerender(); }, 'sm')} ${Btn('◀ FRAME', () => { ALAB.paused = true; ALAB.t = Math.max(0, ALAB.t - 2 / 60); ALAB.step = 1 / 60; rerender(); }, 'sm alt')} ${Btn('FRAME ▶', () => { ALAB.paused = true; ALAB.step = 1 / 60; rerender(); }, 'sm alt')} ${Btn('RESTART', () => { ALAB.t = 0; }, 'sm alt')} ${Btn(ALAB.ball ? 'BALL: ON' : 'BALL: OFF', () => { ALAB.ball = !ALAB.ball; rerender(); }, 'sm alt')}</div>`
    + sl('TURN', ALAB.view === undefined ? 0.5 : ALAB.view, -3.14, 3.14, 0.05, v => { ALAB.view = v; }, 'alV') + `</div>`;
  h += `<div class="cat">LEFT PLAYER'S PROFILE <span class="mu" style="text-transform:none;letter-spacing:.02em">— cosmetic only, never changes a gameplay number</span></div><div class="card"><h3>JUMP SHOT BLEND</h3>`;
  const wset = (g, k) => v => { P[g][k] = v; const n = normW(P[g]); Object.assign(P[g], n); for (const kk in n) { const e = $('al_' + g + kk); if (e) e.textContent = n[kk].toFixed(2); } };
  for (const [k, n] of SHOT_STYLES) h += sl(n.toUpperCase(), P.shot[k], 0, 1, 0.01, wset('shot', k), 'al_shot' + k);
  h += `<h3 style="margin-top:8px">LOWER BASE <span class="mu">feet, knees, hips</span></h3><div>` + LOWER_BASES.map(([k, n]) => Btn(n, () => { P.lower = k; rerender(); }, 'sm ' + ((P.lower || '') === k ? '' : 'alt'))).join(' ') + `</div><h3 style="margin-top:8px">UPPER BASE <span class="mu">the release</span></h3><div>` + UPPER_BASES.map(([k, n]) => Btn(n, () => { P.upper = k; rerender(); }, 'sm ' + ((P.upper || '') === k ? '' : 'alt'))).join(' ') + `</div>`;
  h += `<h3 style="margin-top:8px">IDLE BLEND</h3>`; for (const [k, n] of IDLE_STYLES) h += sl(n.toUpperCase(), P.idle[k], 0, 1, 0.01, wset('idle', k), 'al_idle' + k);
  h += `<h3 style="margin-top:8px">POSTURE AND TIMING</h3><div style="margin:4px 0">${Btn('SHOOTS ' + (P.hand === 'L' ? 'LEFT' : 'RIGHT'), () => { P.hand = P.hand === 'L' ? 'R' : 'L'; rerender(); }, 'sm alt')}</div>`;
  for (const [k, n, lo, hi] of PROF_KEYS) h += sl(n.toUpperCase(), P[k], lo, hi, 0.01, v => { P[k] = v; }, 'al_' + k);
  const canSave = A.k === 'slot' || A.k === 'homie';
  h += `<div style="margin-top:8px">${Btn('SAVE PROFILE', () => { const c = JSON.parse(JSON.stringify(P)); if (A.k === 'slot') { if (A.i === S.slot) S.anim = c; else S.slots[A.i].anim = c; } else if (A.k === 'homie') S.homies[A.i].anim = c; save(); sfx('unlock'); toast('PROFILE SAVED', A.n + ' moves like this now, everywhere.'); }, 'sm', !canSave)} ${Btn('RESET TO DEFAULTS', () => { const sp = Object.assign({}, A.spec, { anim: undefined }); ALAB.prof = profileFromBuild(sp); ALAB.a.R.prof = ALAB.prof; if (canSave) { if (A.k === 'slot') { if (A.i === S.slot) S.anim = null; else S.slots[A.i].anim = null; } else S.homies[A.i].anim = null; save(); } rerender(); }, 'sm alt')}</div>`
    + `<p class="mu" style="margin-top:6px">${canSave ? 'Saving writes this profile to ' + esc(A.n) + ': it shows in games, on the Block, and to friends online.' : 'Built-in players get their profile from their name and build, so it is the same every time you meet them. Save is for your builds and homies.'}</p></div>`;
  return h + `</div>`;
}
