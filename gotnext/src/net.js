// GOT NEXT — online: who else has the game open right now, invites, a shared game, and your player saved to your account.
// Runs on the claude.ai artifact "room" (live presence), "user" and "db" capabilities. Outside an artifact, or for a
// viewer the platform does not connect, every one of these is absent and the game is simply single player.
'use strict';
const NET = { room: null, db: null, uid: null, me: null, peers: [], out: null, seenInv: {}, game: null, pub: {}, pubT: 0, cloudT: null, cloudBusy: false, cloudDirty: false, connected: false };
const ST_CODES = ['free', 'shoot', 'finish', 'move', 'stagger', 'jump', 'steal', 'shove', 'pass', 'celeb'];
const BSTATES = ['held', 'shot', 'through', 'pass', 'loose'];
const r2 = v => Math.round(v * 100) / 100;

// ---------- builds on the wire ----------
function packBuild(b) {
  return { n: b.name, st: b.build.style, og: b.build.origin, h: b.build.body.h, w: r2(b.build.body.w), s: r2(b.build.body.s), sk: b.build.skin, a: ATTRS.map(a => b.attrs[a.id]), bd: b.badges, wn: SLOTS.map(s => b.worn[s[0]]), mv: [b.moves.side, b.moves.back, b.moves.diag, b.moves.jumper, b.moves.dunk, b.moves.celeb] };
}
function unpackBuild(c) {
  try {
    if (!c || typeof c !== 'object' || !Array.isArray(c.a) || !Array.isArray(c.wn) || !Array.isArray(c.mv)) return null;
    const attrs = {}; ATTRS.forEach((a, i) => attrs[a.id] = c.a[i]); const worn = {}; SLOTS.forEach((s, i) => worn[s[0]] = c.wn[i]);
    return sanitizeBuild({ name: c.n, build: { style: c.st, origin: c.og, body: { h: c.h, w: c.w, s: c.s }, skin: c.sk }, attrs, badges: c.bd || {}, worn, moves: { side: c.mv[0], back: c.mv[1], diag: c.mv[2], jumper: c.mv[3], dunk: c.mv[4], celeb: c.mv[5] } });
  } catch (e) { return null; }
}

// ---------- start-up ----------
function netInit() {
  const C = window.claude; if (!C || typeof C.use !== 'function') return;
  C.use('room').then(room => {
    if (!room) return; NET.room = room;
    room.onConnection(c => { NET.connected = c; uiHud(); }, () => { NET.room = null; NET.connected = false; NET.peers = []; uiHud(); });
    room.onPeers(ch => netPeers(ch.peers), () => { });
    netPublish(true);
  }).catch(() => { });
  C.use('user').then(async user => {
    if (!user) return; const id = await user.id().catch(() => null); if (!id) return; NET.uid = id;
    const db = await C.use('db').catch(() => null); if (!db) return; NET.db = db;
    try {
      const snap = await db.collection('data/users/' + id).doc('save').get();
      const d = snap.exists ? snap.data() : null;
      if (d && typeof d.save === 'string' && (+d.ts || 0) > (S.ts || 0)) {
        const j = JSON.parse(d.save);
        if (j && j.v === 1 && j.created && !MT) { S = Object.assign(newSave(), j); saveLocal(); toast('PLAYER LOADED', S.name + ' · from your account'); if ($('title').style.display === 'flex') uiTitle(); else if (W) { worldPlayerRig(); uiHud(); } }
      } else if (S.created) cloudSave();
    } catch (e) { }
  }).catch(() => { });
}
function cloudSave() {
  if (!NET.db || !NET.uid || !S.created) return; NET.cloudDirty = true; if (NET.cloudT || NET.cloudBusy) return;
  NET.cloudT = setTimeout(async () => {
    NET.cloudT = null; NET.cloudBusy = true; NET.cloudDirty = false;
    try { await NET.db.collection('data/users/' + NET.uid).doc('save').set({ ts: S.ts || Date.now(), save: JSON.stringify(S) }); } catch (e) { }
    NET.cloudBusy = false; if (NET.cloudDirty) cloudSave();
  }, 4000);
}

// ---------- the lobby: everyone with the game open ----------
function netOthers() { return NET.peers.filter(p => !p.sameTab && p.kind === 'viewer' && p.presence && p.presence.b); }
function peerName(p) { return String((p.presence && p.presence.b && p.presence.b.n) || 'SOMEONE').slice(0, 12); }
function netPeers(peers) {
  NET.peers = peers; const me = peers.find(p => p.sameTab); if (me) NET.me = me.peer;
  for (const p of netOthers()) {
    const pr = p.presence;
    // an invite addressed to this tab
    const inv = pr.inv;
    if (inv && inv.to === NET.me && !NET.seenInv[inv.id] && !MT && !NET.game && S.created && $('title').style.display !== 'flex' && document.body.dataset.state === 'world') {
      NET.seenInv[inv.id] = 1; const m = MODES.find(x => x.id === inv.m), t = TIERS_COURT[inv.t | 0]; if (!m || !t) continue;
      const nm = peerName(p); sfx('unlock');
      uiDialog(nm + ' CALLED YOU', `${nm} wants to run ${m.n} on ${t.n} — ${inv.k === 'vs' ? 'against you' : 'on your team'}.`, [
        ['Run it', () => { const hb = unpackBuild(pr.b); if (!hb) { uiClose(); return; } NET.room.presence({ acc: { id: inv.id, from: p.peer } }).catch(() => { }); uiClose(); netStartGuest(inv, p.peer, hb, m, t); }],
        ['Nah', () => { NET.room.presence({ acc: { id: inv.id, from: p.peer, no: 1 } }).catch(() => { }); uiClose(); }, 'alt']]);
    }
    // an answer to the invite this tab sent
    const acc = pr.acc, out = NET.out;
    if (out && acc && acc.id === out.id && acc.from === NET.me && p.peer === out.to) {
      NET.out = null; NET.room.presence({ inv: null }).catch(() => { });
      if (acc.no) { toast(peerName(p) + ' PASSED', 'Maybe next run.'); if (UI.cur) rerender(); }
      else { const gb = unpackBuild(pr.b); if (gb) netStartHost(out, p.peer, gb); }
    }
  }
  if (NET.out && !netOthers().some(p => p.peer === NET.out.to)) { NET.out = null; NET.room.presence({ inv: null }).catch(() => { }); if (UI.cur) rerender(); }
  if (UI.cur && UI.cur.live) rerender();
  uiHud();
}
// called from the world loop; sends only what changed, a few times a second
function netPublish(force) {
  if (!NET.room || !S || !S.created) return;
  const now = performance.now(); if (!force && now - NET.pubT < 110) return;
  const w = MT ? 'game' : W ? W.kind : 'menu', me = W ? W.me : null, patch = {}, P = NET.pub;
  const bj = JSON.stringify(packBuild(myBuild())); if (bj !== P.bj) { P.bj = bj; patch.b = JSON.parse(bj); patch.o = ovrOf(S.attrs); patch.r = rankOf(S.rep); }
  if (w !== P.w) { P.w = w; patch.w = w; }
  if (me && (Math.abs(me.x - (P.x || 0)) > 0.04 || Math.abs(me.z - (P.z || 0)) > 0.04 || Math.abs(me.face - (P.f || 0)) > 0.05)) { P.x = me.x; P.z = me.z; P.f = me.face; patch.x = r2(me.x); patch.z = r2(me.z); patch.f = r2(me.face); }
  if (Object.keys(patch).length) { NET.pubT = now; NET.room.presence(patch).catch(() => { }); }
}
function netInvite(peer, m, tierIdx, kind) {
  if (!NET.room) return; NET.out = { id: Math.random().toString(36).slice(2, 10), to: peer, m: m.id, t: tierIdx, k: kind, seed: Math.floor(Math.random() * 1e9) };
  NET.room.presence({ inv: NET.out, acc: null }).catch(() => { }); sfx('uiok');
  const id = NET.out.id; setTimeout(() => { if (NET.out && NET.out.id === id) { NET.out = null; NET.room.presence({ inv: null }).catch(() => { }); toast('NO ANSWER', 'They did not pick up.'); if (UI.cur) rerender(); } }, 30000);
}
// other players walking the same place
function netWorldStep(dt) {
  if (!W) return; netPublish();
  const rigs = W.netRigs || (W.netRigs = {}), seen = {};
  if (NET.room && (W.kind === 'hub' || W.kind === 'pit')) for (const p of netOthers()) {
    const pr = p.presence; if (pr.w !== W.kind || typeof pr.x !== 'number' || typeof pr.z !== 'number') continue; seen[p.peer] = 1;
    let g = rigs[p.peer]; const bj = JSON.stringify(pr.b);
    if (!g || g.bj !== bj) {
      const b = unpackBuild(pr.b); if (!b) continue; if (g) scene.remove(g.rig.root);
      const rig = makeRig(b); scene.add(rig.root); rig.root.add(nameTag(b.name, RANKS[clamp(pr.r | 0, 0, RANKS.length - 1)].n, rig.H));
      g = rigs[p.peer] = { rig, bj, x: clamp(pr.x, -60, 60), z: clamp(pr.z, -60, 60), f: +pr.f || 0, ph: 0 };
    }
    const tx = clamp(pr.x, -60, 60), tz = clamp(pr.z, -60, 60), k = 1 - Math.exp(-9 * dt), ox = g.x, oz = g.z;
    g.x += (tx - g.x) * k; g.z += (tz - g.z) * k; g.f = lerpAng(g.f, +pr.f || 0, k);
    const v = Math.hypot(g.x - ox, g.z - oz) / Math.max(dt, 0.001); g.ph += dt * (4 + v * 1.6);
    applyPose(g.rig, poseOf(v > 0.5 ? 'run' : 'idle', v > 0.5 ? 0 : W.t, { sp: v / 8, ph: g.ph }), dt); g.rig.root.position.set(g.x, 0, g.z); g.rig.root.rotation.y = g.f;
  }
  for (const k in rigs) if (!seen[k]) { scene.remove(rigs[k].rig.root); delete rigs[k]; }
}
function nameTag(name, sub, H) {
  const tex = canvasTex(256, 80, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(8,8,10,.8)'; x.fillRect(0, 8, w, 60); x.fillStyle = '#ff2d78'; x.fillRect(0, 8, 6, 60); x.fillStyle = '#ece9e2'; x.font = '900 expanded 26px Archivo, sans-serif'; x.textBaseline = 'middle'; x.fillText(String(name).slice(0, 12), 16, 32, 232); x.fillStyle = '#7de3ff'; x.font = '500 14px "JetBrains Mono", monospace'; x.fillText(String(sub).toUpperCase(), 16, 54, 232); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); s.scale.set(1.5, 0.47, 1); s.position.set(0, H + 0.5, 0); s.renderOrder = 9; return s;
}

// ---------- a shared game ----------
// Both sides build the same rosters from the same seed, so only the two humans' builds ever cross the wire.
function netTeams(m, tier, kind, seed, hostB, guestB) {
  return withSeed(seed, () => {
    const used = new Set([hostB.name, guestB.name]);
    const ai = o => { const b = aiBuild(clamp(o + rnd(-3, 3), 50, 99)); let k = 0; while (used.has(b.name)) b.name = pick(NPC_NAMES) + (++k > 20 ? k : ''); used.add(b.name); return { b, role: 'ai' }; };
    const t0 = [{ b: hostB, role: 'host' }], t1 = [];
    if (kind === 'coop') t0.push({ b: guestB, role: 'guest' }); else t1.push({ b: guestB, role: 'guest' });
    while (t0.length < m.size) t0.push(ai(tier.ovr - 2)); while (t1.length < m.size) t1.push(ai(tier.ovr));
    return [t0, t1];
  });
}
async function netJoin(id) { try { return await NET.room.join('g-' + id); } catch (e) { return null; } }
async function netStartHost(inv, guestPeer, guestB) {
  const m = MODES.find(x => x.id === inv.m), tier = TIERS_COURT[inv.t]; const R = await netJoin(inv.id); if (!R) { toast('COULD NOT CONNECT', 'Try the invite again.'); return; }
  const teams = netTeams(m, tier, inv.k, inv.seed, myBuild(), guestB);
  for (const t of teams) for (const sp of t) { if (sp.role === 'host') { sp.ctrl = 0; sp.mine = true; } else if (sp.role === 'guest') { sp.ctrl = 2; sp.ai = Math.max(0.5, tier.ai); } else { sp.ctrl = -1; sp.ai = tier.ai; } }
  const G = NET.game = { role: 'host', R, guestPeer, inv, q: 0, ev: [], evN: 0, sendT: 0, last: {}, unsub: null };
  G.unsub = R.onPeers(ch => {
    const g = ch.peers.find(p => p.peer === guestPeer); if (g && g.presence && g.presence.i) G.rin = g.presence.i;
    if (ch.left.some(p => p.peer === guestPeer) && MT) { const rp = MT.P.find(p => p.remote); if (rp) { rp.remote = false; rp.user = false; rp.ctrl = -1; MT.humans = MT.P.filter(p => p.user); toast(rp.b.name + ' LEFT', 'The AI took over their player.'); } }
  }, () => { });
  const boosts = S.boosts.slice(); S.boosts = []; save();
  const cfg = { mode: m, tier, teams, boosts, ball: S.worn.ball, seed: inv.seed % 8, firstOff: inv.seed % 2, net: 'host' };
  cfg.onEnd = res => { finishGame(res, m, tier, null, cfg); setTimeout(() => netLeave(G), 6000); };
  uiClose(); document.body.dataset.state = 'match'; startMatch(cfg); uiHud(); netPublish(true);
}
async function netStartGuest(inv, hostPeer, hostB, m, tier) {
  const R = await netJoin(inv.id); if (!R) { toast('COULD NOT CONNECT', 'Ask them to invite you again.'); return; }
  const teams = netTeams(m, tier, inv.k, inv.seed, hostB, myBuild());
  for (const t of teams) for (const sp of t) { sp.ctrl = sp.role === 'guest' ? 0 : -1; sp.mine = sp.role === 'guest'; }
  const G = NET.game = { role: 'guest', R, hostPeer, inv, snap: null, q: -1, evSeen: 0, lastSnapT: performance.now(), out: { a: 0, bc: 0, fc: 0, rc: 0 }, outJ: '', sendT: 0, gs: null, unsub: null, ended: false };
  G.unsub = R.onPeers(ch => {
    const h = ch.peers.find(p => p.peer === hostPeer); if (h && h.presence && h.presence.s && h.presence.s.q !== G.q) { G.snap = h.presence.s; G.lastSnapT = performance.now(); }
    if (ch.left.some(p => p.peer === hostPeer)) G.hostLeft = true;
  }, () => { G.hostLeft = true; });
  const cfg = { mode: m, tier, teams, boosts: [], ball: hostB.worn.ball, seed: inv.seed % 8, firstOff: inv.seed % 2, net: 'guest' };
  cfg.onEnd = res => { finishGame(res, m, tier, null, cfg); netLeave(G); };
  document.body.dataset.state = 'match'; startMatch(cfg); uiHud(); netPublish(true);
}
function netLeave(G) { if (!G) return; try { if (G.unsub) G.unsub(); G.R.leave().catch(() => { }); } catch (e) { } if (NET.game === G) NET.game = null; if (NET.room) NET.room.presence({ acc: null, inv: null }).catch(() => { }); netPublish(true); }

// host → guest: things that happened (calls, floats, sounds, shot feedback)
function netEv(e) { const G = NET.game; if (!G || G.role !== 'host') return; e.n = ++G.evN; G.ev.push(e); if (G.ev.length > 6) G.ev.shift(); }
function netSnapshot(end) {
  const M_ = MT, B = M_.B, G = NET.game;
  const s = { q: ++G.q, ph: M_.phase, sc: M_.score, ck: r2(M_.clock), of: M_.off, nc: M_.needClear ? 1 : 0, ev: G.ev,
    P: M_.P.map(p => {
      const a = [r2(p.x), r2(p.z), r2(p.y), r2(p.face), ST_CODES.indexOf(p.st), r2(p.t), (p.handsUp ? 1 : 0) | (p.sprinting ? 2 : 0) | (p.bravT > 0 ? 4 : 0) | (p.fire ? 8 : 0) | (p.hand === 'L' ? 16 : 0) | (p.st === 'shoot' && p.shot.released ? 32 : 0), Math.round(p.stam), r2(p.brav)];
      if (p.st === 'shoot') a.push(r2(p.shot.rel)); else if (p.st === 'finish') a.push(p.finish.type === 'dunk' ? 1 : 0, r2(p.finish.dur), p.finish.spin); else if (p.st === 'move') a.push(r2(p.mv.dx), ['side', 'back', 'diag'].indexOf(p.mv.slot), p.mv.mv.dur); else if (p.st === 'stagger') a.push(p.stg.fall ? 1 : 0);
      return a;
    }),
    B: [BSTATES.indexOf(B.state), r2(B.pos.x), r2(B.pos.y), r2(B.pos.z), B.holder ? B.holder.i : -1, B.green ? 1 : 0, B.shooter && B.shooter.fire ? 1 : 0] };
  if (end) s.end = end; return s;
}
function netHostStep(dt) {
  const G = NET.game; if (!G || G.role !== 'host' || !MT) return; G.sendT -= dt;
  if (G.sendT <= 0) { G.sendT = 0.05; G.R.presence({ s: netSnapshot() }).catch(() => { }); }
}
function netHostEnd(res) { const G = NET.game; if (!G || G.role !== 'host' || !MT) return; G.R.presence({ s: netSnapshot({ sc: res.score, box: res.box.map(b => ({ n: b.n, team: b.team, s: b.s })) }) }).catch(() => { }); }
// host: the guest's sticks and buttons become input slot 2
function netPollRemote() {
  const I = IN[2], G = NET.game, r = G && G.role === 'host' ? G.rin : null, L = G ? G.last : null;
  I.aP = I.bP = I.relEdge = false; I.flick = null; if (!r) { I.mx = I.my = 0; I.sprint = false; I.rdir = null; I.b = false; return; }
  I.mx = clamp(+r.mx || 0, -1, 1); I.my = clamp(+r.my || 0, -1, 1); I.sprint = !!r.sp; I.rdir = typeof r.rd === 'string' ? r.rd : null; I.b = !!r.b;
  if (L.a !== undefined && r.a !== L.a) I.aP = true; if (L.bc !== undefined && r.bc !== L.bc) I.bP = true;
  if (L.fc !== undefined && r.fc !== L.fc) I.flick = String(r.fd || ''); if (L.rc !== undefined && r.rc !== L.rc) { I.relEdge = true; I.rh = clamp(+r.rh || 0, 0, 3); }
  L.a = r.a; L.bc = r.bc; L.fc = r.fc; L.rc = r.rc;
}

// guest: no simulation here. Send the sticks, draw what the host says.
function netGuestStep(dt) {
  const M_ = MT, G = NET.game, B = M_.B, me = M_.me, I = IN[0], now = performance.now(); M_.time += dt;
  // ---- input out ----
  const o = G.out, hasBall = B.holder === me, myRel = (JUMPER[me.b.moves.jumper] || JUMPERS[0]).rel * (me.fire ? 0.85 : 1);
  if (I.aP) o.a++; if (I.bP) o.bc++; if (I.flick) { o.fc++; o.fd = I.flick; }
  if (!G.gs && hasBall && me.st === 'free' && M_.phase === 'live' && (I.bP || I.flick === 'D')) G.gs = { t0: now, src: I.bP ? 'btn' : 'stick', seen: false };
  if (G.gs) {
    const el = (now - G.gs.t0) / 1000, held = G.gs.src === 'btn' ? I.b : (I.rdir === 'D' || I.rdir === 'DL' || I.rdir === 'DR');
    if (me.st === 'shoot') G.gs.seen = true;
    if (!G.gs.done && (!held || el > myRel * 1.55)) { G.gs.done = true; o.rc++; o.rh = r2(el); }
    if ((G.gs.done && el > myRel * 1.55 + 0.6) || (!G.gs.seen && el > 0.7) || (G.gs.seen && me.st !== 'shoot')) G.gs = null;
  }
  G.sendT -= dt;
  const pay = { mx: r2(I.mx), my: r2(I.my), sp: I.sprint ? 1 : 0, rd: I.rdir, b: I.b ? 1 : 0, a: o.a, bc: o.bc, fc: o.fc, fd: o.fd || '', rc: o.rc, rh: o.rh || 0 }, pj = JSON.stringify(pay);
  if (pj !== G.outJ && G.sendT <= 0) { G.outJ = pj; G.sendT = 0.033; G.R.presence({ i: pay }).catch(() => { }); }
  // ---- state in ----
  const s = G.snap;
  if (s && s.q !== G.q && Array.isArray(s.P) && Array.isArray(s.B)) {
    G.q = s.q; M_.phase = String(s.ph); M_.score = [s.sc[0] | 0, s.sc[1] | 0]; M_.clock = +s.ck || 0; M_.off = s.of | 0; M_.needClear = !!s.nc;
    s.P.forEach((a, i) => {
      const p = M_.P[i]; if (!p || !Array.isArray(a)) return; p.tx = +a[0] || 0; p.tz = +a[1] || 0; p.ty = +a[2] || 0; p.tf = +a[3] || 0;
      const st = ST_CODES[a[4]] || 'free', fl = a[6] | 0; if (st !== p.st || Math.abs(p.t - a[5]) > 0.25) p.t = +a[5] || 0; p.st = st;
      p.handsUp = !!(fl & 1); p.sprinting = !!(fl & 2); p.bravT = fl & 4 ? 1 : 0; p.fire = !!(fl & 8); p.hand = fl & 16 ? 'L' : 'R'; p.stam = +a[7] || 0; p.brav = +a[8] || 0;
      if (st === 'shoot') p.shot = { rel: +a[9] || 0.6, j: JUMPER[p.b.moves.jumper] || JUMPERS[0], released: !!(fl & 32) };
      else if (st === 'finish') p.finish = { type: a[9] ? 'dunk' : 'layup', dur: +a[10] || 0.6, style: p.b.moves.dunk, spin: a[11] | 0 };
      else if (st === 'move') p.mv = { dx: +a[9] || 0, slot: ['side', 'back', 'diag'][a[10]] || 'side', mv: { dur: +a[11] || 0.35 } };
      else if (st === 'stagger') p.stg = { fall: !!a[9] };
      if (st !== 'finish' && st !== 'move') p.rig.extraYaw = 0;
    });
    B.state = BSTATES[s.B[0]] || 'loose'; B.tp = B.tp || V3(); B.tp.set(+s.B[1] || 0, +s.B[2] || 0, +s.B[3] || 0); B.holder = M_.P[s.B[4]] || null; B.green = !!s.B[5]; B.shooter = s.B[6] ? { fire: true } : null;
    for (const e of (Array.isArray(s.ev) ? s.ev : [])) {
      if (!e || e.n <= G.evSeen) continue; G.evSeen = e.n;
      if (e.k === 'c') hudCall(String(e.b || ''), String(e.s || ''), cssCol(e.c), +e.d || 1.2);
      else if (e.k === 'f') { const p = M_.P[e.i]; if (p) hudFloat(p, String(e.t || ''), cssCol(e.c)); }
      else if (e.k === 'fb') hudFb(String(e.t || ''), cssCol(e.c));
      else if (e.k === 's') { sfx(String(e.s2 || '')); if (e.s2 === 'dunk') { M_.shake = 0.45; burst(0, 3, 0, 0xffc531, 14); for (const f of M_.fans) f.hype = 1.6; M_.netT = 0.35; } if (e.s2 === 'swish' || e.s2 === 'green') { M_.netT = 0.35; for (const f of M_.fans) f.hype = 1.4; } }
    }
    if (s.end && !G.ended) { G.ended = true; G.end = s.end; G.endT = 2.4; }
  }
  for (const p of M_.P) {
    if (p.tx === undefined) continue; p.t += dt; const k = 1 - Math.exp(-16 * dt), ox = p.x, oz = p.z;
    p.x += (p.tx - p.x) * k; p.z += (p.tz - p.z) * k; p.y += (p.ty - p.y) * Math.min(1, k * 1.6); p.face = lerpAng(p.face, p.tf, k);
    p.speed = lerp(p.speed || 0, Math.hypot(p.x - ox, p.z - oz) / Math.max(dt, 0.001), 0.3); p.def = M_.off !== p.team && B.holder !== p && B.state !== 'loose';
  }
  if (G.gs && me.st === 'shoot' && !me.shot.released) me.t = (now - G.gs.t0) / 1000;      // your own meter follows your thumb, not the lag
  if (B.state === 'held' && B.holder) ballHeld(B.holder, dt); else if (B.tp) B.pos.lerp(B.tp, 1 - Math.exp(-28 * dt));
  B.spin += dt * 6; if (B.shooter && B.state === 'shot' && Math.random() < 0.6) burst(B.pos.x, B.pos.y, B.pos.z, 0xff7a1f, 1);
  B.mesh.position.copy(B.pos); B.mesh.rotation.x = B.spin; B.shadow.position.set(B.pos.x, 0.016, B.pos.z);
  for (const p of M_.P) animPlayer(p, dt);
  matchFx(dt); matchCam(dt); hudMatch();
  // ---- endings ----
  if (G.ended) { G.endT -= dt; if (G.endT <= 0 && MT) { const e = G.end, mi = me.i, t = me.team; hudShow(false); const cfg = M_.cfg; MT = null;
    const box = (Array.isArray(e.box) ? e.box : []).map((b, i) => ({ n: String(b.n || ''), team: b.team | 0, user: i === mi, s: cleanStats(b.s) }));
    cfg.onEnd({ win: e.sc[t] > e.sc[1 - t], score: [e.sc[t] | 0, e.sc[1 - t] | 0], stats: box[mi] ? box[mi].s : cleanStats({}), mode: cfg.mode, tier: cfg.tier, bonusRep: 0, shutout: e.sc[1 - t] === 0 && e.sc[t] > 0, box }); } }
  else if (G.hostLeft || now - G.lastSnapT > 9000) { const cfg = M_.cfg; hudShow(false); MT = null; netLeave(G); cfg.onEnd({ quit: true, lost: true }); }
}
function cleanStats(s) { const o = {}; for (const k of ['pts', 'ast', 'reb', 'stl', 'blk', 'ankles', 'greens', 'dunks', 'threes', 'fga', 'fgm', 'bravs', 'fires']) o[k] = clamp((s && s[k]) | 0, 0, 999); return o; }
function cssCol(c) { return typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c) ? c : '#fff'; }
