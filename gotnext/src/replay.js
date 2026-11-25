// GOT NEXT — replays. The last few seconds of every game are always in memory (where each body and the ball were, 15 times
// a second). When a play of yours makes the CAGE cover, those seconds are kept with it. A replay plays back in the real
// court from any angle, can be saved as a video file, and can be posted to THE WALL for everyone the game is shared with.
const RP_HZ = 15, RP_SECS = 5, RP_KEEP = 5, RP_Q = 32;
function repRec(dt) {      // called every frame of a real game
  const M_ = MT; if (!M_ || M_.replay || M_.practice || M_.drill || M_.net === 'guest') return; const R = M_.rec || (M_.rec = { t: 0, fr: [], j: Object.keys(M_.P[0].rig.joints) });
  R.t += dt; if (R.t < 1 / RP_HZ) return; R.t = 0; const f = [Math.round(M_.B.pos.x * 100), Math.round(M_.B.pos.y * 100), Math.round(M_.B.pos.z * 100)];
  for (const p of M_.P) { const g = p.rig, r = g.root; f.push(Math.round(r.position.x * 100), Math.round(r.position.z * 100), Math.round(r.position.y * 100), Math.round((((r.rotation.y % 6.2832) + 6.2832) % 6.2832) * 5000)); for (const k of R.j) { const e = g.joints[k].rotation; f.push(clamp(Math.round(e.x * RP_Q), -127, 127), clamp(Math.round(e.y * RP_Q), -127, 127), clamp(Math.round(e.z * RP_Q), -127, 127)); } }
  R.fr.push(f); if (R.fr.length > RP_HZ * (RP_SECS + 2)) R.fr.shift();
}
function repPack(fr, np, nj) {      // 16-bit for positions, 8-bit for joint angles
  const per = 6 + np * (8 + nj * 3), u = new Uint8Array(fr.length * per), dv = new DataView(u.buffer); let o = 0;
  for (const f of fr) { let i = 0; for (let k = 0; k < 3; k++) { dv.setInt16(o, clamp(f[i++], -32000, 32000)); o += 2; } for (let p = 0; p < np; p++) { for (let k = 0; k < 4; k++) { dv.setInt16(o, clamp(f[i++], -32000, 32000)); o += 2; } for (let k = 0; k < nj * 3; k++) dv.setInt8(o++, f[i++]); } }
  let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(s);
}
function repUnpack(rp) {
  const np = rp.np, nj = rp.j.length, per = 6 + np * (8 + nj * 3), bin = atob(rp.d); if (bin.length !== rp.n * per) return null; const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); const dv = new DataView(u.buffer), out = []; let o = 0;
  for (let n = 0; n < rp.n; n++) { const f = { b: [dv.getInt16(o) / 100, dv.getInt16(o + 2) / 100, dv.getInt16(o + 4) / 100], p: [] }; o += 6; for (let p = 0; p < np; p++) { const q = { x: dv.getInt16(o) / 100, z: dv.getInt16(o + 2) / 100, y: dv.getInt16(o + 4) / 100, r: dv.getInt16(o + 6) / 5000, j: new Int8Array(u.buffer, o + 8, nj * 3) }; o += 8 + nj * 3; f.p.push(q); } out.push(f); }
  return out;
}
// anything that did not come from this device is checked before it is trusted
function repValid(rp) {
  try { if (!rp || rp.v !== 1 || typeof rp.d !== 'string' || rp.d.length > 200000 || !Array.isArray(rp.j) || rp.j.length < 10 || rp.j.length > 24 || !Array.isArray(rp.specs) || !Array.isArray(rp.teams)) return false;
    if (!(rp.np >= 2 && rp.np <= 6) || rp.specs.length !== rp.np || rp.teams.length !== rp.np || !(rp.n >= 10 && rp.n <= RP_HZ * 8)) return false; if (!rp.teams.every(t => t === 0 || t === 1) || !rp.j.every(k => typeof k === 'string' && /^[a-zA-Z]{2,8}$/.test(k))) return false;
    if (!MODES.some(m => m.id === rp.mode) || !HL[rp.k]) return false; return !!repUnpack(rp) && rp.specs.every(s => !!unpackBuild(s)); } catch (e) { return false; }
}
// keep the seconds around a highlight of yours (called a moment after the photo, so the finish is in it)
function repKeep(h) {
  const M_ = MT, R = M_ && M_.rec; if (!R || R.fr.length < RP_HZ * 2 || !h || !h.p) return null; const fr = R.fr.slice(-RP_HZ * RP_SECS), id = 'r' + Date.now().toString(36);
  const rp = { v: 1, id, k: h.kind, who: h.p.b.name, vs: h.vic ? h.vic.b.name : '', mode: M_.cfg.mode.id, court: Math.max(0, TIERS_COURT.indexOf(M_.cfg.tier)), sc: M_.score[M_.me.team] + '–' + M_.score[1 - M_.me.team], day: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' }).toUpperCase(),
    hz: RP_HZ, n: fr.length, np: M_.P.length, j: R.j.slice(), teams: M_.P.map(p => p.team), star: h.p.i, specs: M_.P.map(p => packBuild(p.b)), d: repPack(fr, M_.P.length, R.j.length) };
  const L = S.reps || (S.reps = []); L.unshift(rp); if (L.length > RP_KEEP) L.length = RP_KEEP; return id;
}
function repGet(id) { return (S.reps || []).find(r => r.id === id) || null; }
// ---- playback
function replayPlay(rp, back) {
  if (!repValid(rp)) { toast('REPLAY', 'That replay could not be read.'); return false; } const fr = repUnpack(rp), m = MODES.find(x => x.id === rp.mode), tier = TIERS_COURT[rp.court] || TIERS_COURT[0];
  const teams = [[], []]; rp.specs.forEach((s, i) => { const b = unpackBuild(s); b.keepLook = true; teams[rp.teams[i]].push({ b, ctrl: -1, ai: 0.5 }); }); if (!teams[0].length || !teams[1].length) return false;
  uiClose(); document.body.dataset.state = 'match'; twoPlayer = false;
  startMatch({ mode: m, tier, teams, boosts: [], replayOf: rp, onEnd: () => { } }); const M_ = MT; hudShow(false); hlEnd();
  // startMatch lays the players out team by team; the recording was made in that same order
  const order = []; [0, 1].forEach(t => rp.teams.forEach((tt, i) => { if (tt === t) order.push(i); }));
  M_.replay = { rp, fr, t: 0, speed: 1, hold: 0, cam: 0, loops: 0, order, back: back || (() => enterWorld('hub', 0, 9, Math.PI)), paused: false }; M_.phase = 'live'; M_.spectate = true;
  for (const p of M_.P) { if (p.ptr) p.ptr.visible = false; } replayBar(); return true;
}
function replayStep(dt) {
  const M_ = MT, Rp = M_.replay, fr = Rp.fr, n = fr.length; if (!Rp.paused) { if (Rp.hold > 0) { Rp.hold -= dt; if (Rp.hold <= 0) { Rp.t = 0; Rp.loops++; if (Rp.rec && Rp.rec.done) Rp.rec.done(); } } else Rp.t += dt * Rp.speed; }
  let ft = Rp.t * Rp.rp.hz; if (ft >= n - 1) { ft = n - 1; if (Rp.hold <= 0 && !Rp.paused) Rp.hold = 0.9; } const i = Math.floor(ft), a = ft - i, A = fr[i], Bf = fr[Math.min(n - 1, i + 1)], J = Rp.rp.j;
  M_.P.forEach((p, k) => { const s = Rp.order[k], q0 = A.p[s], q1 = Bf.p[s], g = p.rig; g.root.position.set(lerp(q0.x, q1.x, a), lerp(q0.y, q1.y, a), lerp(q0.z, q1.z, a)); let dr = q1.r - q0.r; if (dr > 3.1416) dr -= 6.2832; else if (dr < -3.1416) dr += 6.2832; g.root.rotation.y = q0.r + dr * a;
    for (let j = 0; j < J.length; j++) { const o = g.joints[J[j]]; if (o) o.rotation.set(lerp(q0.j[j * 3], q1.j[j * 3], a) / RP_Q, lerp(q0.j[j * 3 + 1], q1.j[j * 3 + 1], a) / RP_Q, lerp(q0.j[j * 3 + 2], q1.j[j * 3 + 2], a) / RP_Q); } p.x = g.root.position.x; p.z = g.root.position.z; });
  const B = M_.B; B.pos.set(lerp(A.b[0], Bf.b[0], a), lerp(A.b[1], Bf.b[1], a), lerp(A.b[2], Bf.b[2], a)); B.spin = (B.spin || 0) + dt * 6 * Rp.speed; B.mesh.position.copy(B.pos); B.mesh.rotation.x = B.spin; if (B.shadow) B.shadow.position.set(B.pos.x, 0.016, B.pos.z);
  // camera: the broadcast angle, a slow orbit round the man who did it, or low under the rim
  const star = M_.P[Rp.order.indexOf(Rp.rp.star)] || M_.P[0], sx = star.rig.root.position.x, sz = star.rig.root.position.z, sy = star.rig.root.position.y, pt = innerWidth < innerHeight;
  if (Rp.cam === 0) { _v.set(sx * 0.6, pt ? 4.9 : 4.2, lerp(sz, B.pos.z, 0.3) + (pt ? 8.6 : 7.2)); _v2.set(sx * 0.6, 1.5, sz * 0.5); }
  else if (Rp.cam === 1) { const an = 0.6 + Rp.t * 0.35 + Rp.loops * 1.3, r = pt ? 5.6 : 4.6; _v.set(sx + Math.sin(an) * r, 1.9 + sy * 0.6, sz + Math.cos(an) * r); _v2.set(sx, 1.25 + sy * 0.8, sz); }
  else { _v.set(sx * 0.35 + (sx > 0 ? -1.2 : 1.2), 0.7, -0.9); _v2.set(sx, 1.6 + sy, sz); }
  camera.position.lerp(_v, Rp.snap ? 1 : 1 - Math.exp(-6 * dt)); Rp.snap = false; M_.look = M_.look || _v2.clone(); M_.look.lerp(_v2, 1 - Math.exp(-8 * dt)); camera.lookAt(M_.look);
  // a body right in front of the lens fills the screen: anybody within arm's length of the camera steps out of the shot (the star never does)
  for (const q of M_.P) { const rp0 = q.rig.root.position, near = q !== star && Math.hypot(rp0.x - camera.position.x, rp0.z - camera.position.z) < 1.5; q.rig.root.visible = !near; if (q.tag) q.tag.visible = !near; }
  const fov = Rp.cam === 1 ? 40 : Rp.cam === 2 ? 58 : (pt ? 74 : 50); if (Math.abs(camera.fov - fov) > 0.1) { camera.fov += (fov - camera.fov) * 0.15; camera.updateProjectionMatrix(); }
  if (typeof crowdStep === 'function' && M_.fans) crowdStep(dt * 0.5);
}
function replayQuit() { const M_ = MT; if (!M_ || !M_.replay) return; const back = M_.replay.back; if (M_.replay.rec && M_.replay.rec.stop) M_.replay.rec.stop(true); hudShow(false); MT = null; uiClose(); back(); }
function replayBar() {
  openPanel(() => { const M_ = MT, Rp = M_ && M_.replay; if (!Rp) return ''; const rp = Rp.rp, busy = !!Rp.rec;
    return `<div style="flex:1"></div><div class="card sel" style="max-width:760px;margin:0 auto;width:100%"><div class="row"><h3 class="mono" style="font-size:10px;color:var(--heat)">REPLAY · ${esc(HL[rp.k].n)} · ${esc(rp.who)}${rp.vs ? ' › ' + esc(rp.vs) : ''}</h3><span class="mono mu" style="font-size:10px">${esc(rp.sc || '')} · ${esc(rp.day || '')}</span></div><div class="pf" style="flex-wrap:wrap;gap:6px;margin-top:8px">`
      + (busy ? `<span class="tag on">RECORDING THE VIDEO…</span>` : Btn(Rp.paused ? '▶ PLAY' : '❚❚ PAUSE', () => { Rp.paused = !Rp.paused; rerender(); }, 'sm') + ' ' + Btn(Rp.speed < 1 ? 'FULL SPEED' : 'SLOW MOTION', () => { Rp.speed = Rp.speed < 1 ? 1 : 0.35; rerender(); }, 'sm alt') + ' ' + Btn('ANGLE: ' + ['BROADCAST', 'ORBIT', 'UNDER THE RIM'][Rp.cam], () => { Rp.cam = (Rp.cam + 1) % 3; Rp.snap = true; rerender(); }, 'sm alt')
        + ' ' + Btn('SAVE VIDEO', () => replayVideo(), 'sm alt') + ' ' + (Rp.wall ? '' : Btn('POST TO THE WALL', () => wallPost(rp), 'sm alt')) + ' ' + Btn('DONE', replayQuit, 'sm alt')) + `</div></div>`; }, 'clear', replayQuit);
}
// ---- video: record one pass of the replay off the game's own canvas and hand it over as a file
function replayVideo() {
  const M_ = MT, Rp = M_ && M_.replay; if (!Rp || Rp.rec) return; const cv = renderer.domElement;
  if (!cv.captureStream || typeof MediaRecorder === 'undefined') { toast('VIDEO', 'This browser cannot record the screen of the game.'); return; }
  const type = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(t => { try { return MediaRecorder.isTypeSupported(t); } catch (e) { return false; } }); if (!type) { toast('VIDEO', 'This browser cannot record video.'); return; }
  let mr, chunks = []; try { mr = new MediaRecorder(cv.captureStream(30), { mimeType: type, videoBitsPerSecond: 5e6 }); } catch (e) { toast('VIDEO', 'Recording could not start here.'); return; }
  const ext = type.indexOf('mp4') >= 0 ? 'mp4' : 'webm', name = 'gotnext-' + Rp.rp.k + '-' + String(Rp.rp.who || 'play').toLowerCase().replace(/[^a-z0-9]+/g, '') + '.' + ext;
  mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  mr.onstop = async () => { const cancelled = Rp.rec && Rp.rec.cancel; Rp.rec = null; if (MT === M_) rerender(); if (cancelled || !chunks.length) return; const blob = new Blob(chunks, { type });
    try { const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
      if (dl) { await dl.save({ filename: name, data: blob }); toast('VIDEO SAVED', name); }
      else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 20000); toast('VIDEO', name + ' · ' + Math.round(blob.size / 1024) + ' KB'); }
    } catch (e) { toast('VIDEO NOT SAVED', e && e.code === 'declined' ? 'You said no to the file.' : e && e.code === 'host_unavailable' ? 'This app cannot save files. Open the game in a browser to save it.' : 'The file could not be saved here.'); } };
  Rp.t = 0; Rp.hold = 0; Rp.paused = false; Rp.snap = true; Rp.rec = { done: () => { try { mr.stop(); } catch (e) { } }, stop: (cancel) => { if (Rp.rec) Rp.rec.cancel = !!cancel; try { mr.stop(); } catch (e) { } } }; mr.start(); rerender();
}
// ---- the wall: replays people posted, for everyone the game is shared with
function wallPost(rp) {
  if (!NET.db || !NET.uid) { toast('THE WALL', 'Posting needs the game opened from its shared Claude link, signed in.'); return; }
  const slot = (S.wallN = ((S.wallN || 0) + 1) % 3), body = { uid: NET.uid, ts: Date.now(), by: String(S.name || '').slice(0, 24), k: rp.k, who: String(rp.who || '').slice(0, 24), vs: String(rp.vs || '').slice(0, 24), sc: String(rp.sc || '').slice(0, 12), rp: JSON.stringify(rp) };
  NET.db.collection('wall').doc(NET.uid + '_' + slot).set(body).then(() => { toast('ON THE WALL', 'Everybody the game is shared with can watch it. You keep your last three up there.'); if (MT && MT.replay) { MT.replay.wall = true; rerender(); } save(); }, () => toast('THE WALL', 'It would not post. You may only be allowed to watch here.'));
}
let WALL = { list: null, at: 0, busy: false };
function wallLoad(force) {
  if (!NET.db || WALL.busy || (!force && WALL.list && Date.now() - WALL.at < 30000)) return; WALL.busy = true; const done = setTimeout(() => { WALL.busy = false; if (!WALL.list) WALL.list = []; if (UI.cur) rerender(); }, 10000);
  NET.db.collection('wall').orderBy('ts', 'desc').limit(12).get().then(snap => { clearTimeout(done); WALL.busy = false; WALL.at = Date.now(); WALL.list = []; for (const d of (snap.docs || [])) { const x = d.exists ? d.data() : null; if (!x || typeof x.rp !== 'string' || x.rp.length > 220000) continue; WALL.list.push({ by: String(x.by || '').slice(0, 24), k: String(x.k || ''), who: String(x.who || '').slice(0, 24), vs: String(x.vs || '').slice(0, 24), sc: String(x.sc || '').slice(0, 12), ts: +x.ts || 0, raw: x.rp, mine: x.uid === NET.uid }); } if (UI.cur) rerender(); }, () => { clearTimeout(done); WALL.busy = false; WALL.list = WALL.list || []; if (UI.cur) rerender(); });
}
function wallUI() {
  let h = `<div class="cat">THE WALL <span class="mu" style="text-transform:none;letter-spacing:.02em">— replays people posted. Open one of your own replays and press POST TO THE WALL</span></div>`;
  if (!NET.db) return h + `<div class="card"><p>The wall is online. It shows when the game is opened from its shared Claude link, signed in.</p></div>`;
  wallLoad(); if (!WALL.list) return h + `<div class="card"><p>Looking at the wall…</p></div>`; if (!WALL.list.length) return h + `<div class="card"><p>Nothing up yet. Be the first.</p></div>`;
  return h + `<div class="grid">` + WALL.list.map((w, i) => `<div class="card ${w.mine ? 'sel' : ''}"><h3>${esc((HL[w.k] || { n: 'HIGHLIGHT' }).n)}</h3><p>${esc(w.who)}${w.vs ? ' › ' + esc(w.vs) : ''} <span class="mu">· ${esc(w.sc)}</span></p><p class="mu">posted by ${esc(w.by || 'somebody')}${w.mine ? ' (you)' : ''}</p><div style="margin-top:6px">${Btn('WATCH', () => { let rp = null; try { rp = JSON.parse(WALL.list[i].raw); } catch (e) { } if (!rp || !replayPlay(rp, () => { enterWorld('hub', 0, 9, Math.PI); uiPlayer('mag'); })) toast('THE WALL', 'That one could not be played.'); else if (MT && MT.replay) { MT.replay.wall = true; rerender(); } }, 'sm')}</div></div>`).join('') + `</div>` + `<div style="margin-top:8px">${Btn('REFRESH', () => { WALL.list = null; wallLoad(true); rerender(); }, 'sm alt')}</div>`;
}
