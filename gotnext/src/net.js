// GOT NEXT — online: who else has the game open right now, invites, a shared game, and your player saved to your account.
// Runs on the claude.ai artifact "room" (live presence), "user" and "db" capabilities. Outside an artifact, or for a
// viewer the platform does not connect, every one of these is absent and the game is simply single player.
'use strict';
const NET = { room: null, db: null, uid: null, me: null, peers: [], out: null, seenInv: {}, seenGo: {}, known: {}, crew: null, inCrew: null, inSince: 0, waitGo: null, game: null, pub: {}, pubT: 0, cloudT: null, cloudBusy: false, cloudDirty: false, connected: false };
const ST_CODES = ['free', 'shoot', 'finish', 'move', 'stagger', 'jump', 'steal', 'shove', 'pass', 'celeb', 'hop', 'punch', 'clothes'];
const BSTATES = ['held', 'shot', 'through', 'pass', 'loose'];
const r2 = v => Math.round(v * 100) / 100;

// ---------- builds on the wire ----------
// an animation profile on the wire: rounded numbers, a few dozen bytes
function packAnim(a) { const r = v => Math.round(v * 100) / 100, o = { s: [r(a.shot.trad), r(a.shot.high), r(a.shot.quick)], i: [r(a.idle.relaxed), r(a.idle.athletic), r(a.idle.wide)], h: a.hand, lo: a.lower || '', up: a.upper || '', rn: a.run || '' }; for (const [k] of PROF_KEYS) o[k] = r(a[k]); return o; }
function unpackAnim(o) { if (!o || !Array.isArray(o.s) || !Array.isArray(o.i)) return undefined; const a = { shot: { trad: o.s[0], high: o.s[1], quick: o.s[2] }, idle: { relaxed: o.i[0], athletic: o.i[1], wide: o.i[2] }, hand: o.h, lower: typeof o.lo === 'string' ? o.lo : '', upper: typeof o.up === 'string' ? o.up : '', run: typeof o.rn === 'string' ? o.rn : '' }; for (const [k] of PROF_KEYS) a[k] = o[k]; return a; }
function packBuild(b) {
  return { n: b.name, st: b.build.style, og: b.build.origin, h: b.build.body.h, w: r2(b.build.body.w), s: r2(b.build.body.s), sk: b.build.skin, a: ATTRS.map(a => b.attrs[a.id]), bd: b.badges, wn: SLOTS.map(s => b.worn[s[0]]), mv: [b.moves.side, b.moves.back, b.moves.diag, b.moves.jumper, b.moves.dunk, b.moves.celeb], an: b.anim ? packAnim(b.anim) : undefined };
}
function unpackBuild(c) {
  try {
    if (!c || typeof c !== 'object' || !Array.isArray(c.a) || !Array.isArray(c.wn) || !Array.isArray(c.mv)) return null;
    const attrs = {}; ATTRS.forEach((a, i) => attrs[a.id] = c.a[i]); const worn = {}; SLOTS.forEach((s, i) => worn[s[0]] = c.wn[i]);
    return sanitizeBuild({ name: c.n, build: { style: c.st, origin: c.og, body: { h: c.h, w: c.w, s: c.s }, skin: c.sk }, attrs, badges: c.bd || {}, worn, moves: { side: c.mv[0], back: c.mv[1], diag: c.mv[2], jumper: c.mv[3], dunk: c.mv[4], celeb: c.mv[5] }, anim: unpackAnim(c.an) });
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
        if (j && j.v === 1 && j.created && !MT) { S = Object.assign(newSave(), j); slotsInit(); saveLocal(); toast('PLAYER LOADED', S.name + ' · from your account'); if ($('title').style.display === 'flex') uiTitle(); else if (W) { worldPlayerRig(); uiHud(); } }
      } else if (S.created) cloudSave();
    } catch (e) { }
  }).catch(() => { });
}
function cloudSave() {
  if (!NET.db || !NET.uid || !S.created) return; NET.cloudDirty = true; if (NET.cloudT || NET.cloudBusy) return;
  NET.cloudT = setTimeout(async () => {
    NET.cloudT = null; NET.cloudBusy = true; NET.cloudDirty = false;
    try { await NET.db.collection('data/users/' + NET.uid).doc('save').set({ ts: S.ts || Date.now(), save: saveSlim(S) });      /* without the photos and replays: a document has a size limit, and those stay on the device */ } catch (e) { }
    NET.cloudBusy = false; if (NET.cloudDirty) cloudSave();
  }, 4000);
}

// ---------- the lobby: everyone with the game open ----------
// Crews: a leader invites people; members pull up to wherever the leader is and get pulled into the leader's games.
function netOthers() { return NET.peers.filter(p => !p.sameTab && p.kind === 'viewer' && p.presence && p.presence.b); }
function peerName(p) { return String((p.presence && p.presence.b && p.presence.b.n) || 'SOMEONE').slice(0, 12); }
function peerById(id) { return netOthers().find(p => p.peer === id) || null; }
function pres(patch) { if (NET.room) NET.room.presence(patch).catch(() => { }); }
function rid() { return Math.random().toString(36).slice(2, 10); }
function crewMembers() { return NET.crew ? NET.crew.m.map(peerById).filter(Boolean) : []; }
function crewLead() { return NET.inCrew ? peerById(NET.inCrew) : null; }
function canAnswer() { return !MT && !NET.game && S.created && $('title').style.display !== 'flex' && document.body.dataset.state === 'world'; }
// everyone you meet online is kept as a homie, so you can still run with their player when they are gone
function remember(p) {
  if (!S.created) return; const bj = JSON.stringify(p.presence.b); if (NET.known[p.peer] === bj) return; NET.known[p.peer] = bj;
  const b = unpackBuild(p.presence.b); if (!b) return; b.net = 1;
  const i = S.homies.findIndex(h => h.name === b.name);
  if (i >= 0) { if (JSON.stringify(S.homies[i]) === JSON.stringify(b)) return; S.homies[i] = b; }
  else { if (S.homies.length >= 12) { const k = S.homies.findIndex(h => h.net); S.homies.splice(k >= 0 ? k : 0, 1); } S.homies.push(b); toast('NEW HOMIE: ' + b.name, 'Their player can run with you now, even when they are not online.'); }
  S.life.homies = Math.max(S.life.homies || 0, S.homies.length); save();
}
function pullUp(L) {
  const w = L.presence.w === 'pit' ? 'pit' : 'hub';
  if (L.presence.w === w) enterWorld(w, clamp(+L.presence.x || 0, -14, 14) + 1.1, clamp(+L.presence.z || 0, -10, 11) + 0.9, +L.presence.f || 0);
  else enterWorld('hub', 0, 9, Math.PI);
}
function netPeers(peers) {
  NET.peers = peers; const me = peers.find(p => p.sameTab); if (me) NET.me = me.peer;
  for (const p of netOthers()) {
    const pr = p.presence; remember(p);
    // a call addressed to this tab
    const inv = pr.inv;
    if (inv && inv.to === NET.me && !NET.seenInv[inv.id] && canAnswer()) {
      NET.seenInv[inv.id] = 1; const nm = peerName(p); sfx('unlock');
      if (inv.k === 'crew') {
        uiDialog(nm + ' WANTS YOU IN THEIR CREW', `Pull up and you go wherever ${nm} goes, and you get pulled into their games: same team or against them, they call it.`, [
          ['Pull up', () => { if (NET.crew) { NET.crew = null; } NET.inCrew = p.peer; NET.inSince = performance.now(); pres({ acc: { id: inv.id, from: p.peer }, in: p.peer, cr: null }); uiClose(); pullUp(p); toast('RUNNING WITH ' + nm, 'You follow them now. Leave the crew from My Player.'); }],
          ['Nah', () => { pres({ acc: { id: inv.id, from: p.peer, no: 1 } }); uiClose(); }, 'alt']]);
      } else {
        const m = MODES.find(x => x.id === inv.m), t = TIERS_COURT[inv.t | 0]; if (!m || !t) continue;
        uiDialog(nm + ' CALLED YOU', `${nm} wants to run ${m.n} on ${t.n}, ${inv.k === 'vs' ? 'against you' : 'on your team'}.`, [
          ['Run it', () => { NET.waitGo = p.peer; pres({ acc: { id: inv.id, from: p.peer } }); uiClose(); toast('CHECKING UP', 'Waiting on ' + nm + '…'); }],
          ['Nah', () => { pres({ acc: { id: inv.id, from: p.peer, no: 1 } }); uiClose(); }, 'alt']]);
      }
    }
    // the answer to the call this tab made
    const acc = pr.acc, out = NET.out;
    if (out && acc && acc.id === out.id && acc.from === NET.me && p.peer === out.to) {
      NET.out = null; pres({ inv: null });
      if (acc.no) toast(peerName(p) + ' PASSED', 'Maybe next run.');
      else if (out.k === 'crew') { NET.crew = NET.crew || { id: rid(), m: [] }; if (!NET.crew.m.includes(p.peer)) NET.crew.m.push(p.peer); pres({ cr: NET.crew }); sfx('uiok'); toast(peerName(p) + ' PULLED UP', 'Your crew follows you. Start a run from any cage gate.'); }
      else netGo(MODES.find(x => x.id === out.m), out.t, [[p.peer, out.k === 'vs' ? 1 : 0]], out.seed);
      if (UI.cur) rerender();
    }
    // a run this tab was called into
    const go = pr.go;
    if (go && !NET.seenGo[go.id] && Array.isArray(go.g) && go.g.some(x => Array.isArray(x) && x[0] === NET.me) && (NET.waitGo === p.peer || NET.inCrew === p.peer) && !MT && !NET.game) {
      NET.seenGo[go.id] = 1; NET.waitGo = null; if (UI.cur) uiClose(); netStartGuest(go, p);
    }
  }
  if (NET.out && !peerById(NET.out.to)) { NET.out = null; pres({ inv: null }); }
  // crew bookkeeping: members who left, or left the crew, drop off; members follow their leader around
  if (NET.crew) {
    const alive = NET.crew.m.filter(id => { const q = peerById(id); return q && q.presence.in === NET.me; });
    if (alive.length !== NET.crew.m.length) { NET.crew.m = alive; if (!alive.length) NET.crew = null; pres({ cr: NET.crew }); }
  }
  if (NET.inCrew) {
    const L = crewLead(), listed = L && L.presence.cr && Array.isArray(L.presence.cr.m) && L.presence.cr.m.includes(NET.me);
    if (!L || (!listed && performance.now() - NET.inSince > 6000)) { NET.inCrew = null; pres({ in: null }); toast('CREW SPLIT', L ? 'You were taken off the crew.' : 'Your crew leader went offline.'); }
    else if (canAnswer() && !UI.cur && W && (L.presence.w === 'hub' || L.presence.w === 'pit') && W.kind !== L.presence.w) { pullUp(L); toast('FOLLOWING ' + peerName(L)); }
  }
  // redraw an open online menu only when something it shows changed (walking around must not eat taps)
  const sig = JSON.stringify([netOthers().map(p => [p.peer, p.presence.w === 'game', p.presence.w, p.presence.o, p.presence.in, p.presence.b && p.presence.b.n]), NET.crew, NET.inCrew, !!NET.out]);
  if (sig !== NET.sig) { NET.sig = sig; if (UI.cur && UI.cur.live) rerender(); }
  uiHud();
}
// called from the world loop; sends only what changed, a few times a second
function netPublish(force) {
  if (!NET.room || !S || !S.created) return;
  const now = performance.now(); if (!force && now - NET.pubT < 110) return;
  const w = MT ? 'game' : worldKey(), me = W ? W.me : null, patch = {}, P = NET.pub;
  const hm = JSON.stringify(packHome()); if (hm !== P.hm) { P.hm = hm; patch.hm = JSON.parse(hm); }
  if ((NET.em || '') !== (P.em || '')) { P.em = NET.em || ''; patch.em = P.em; }
  if (NET.say && (!P.say || P.say.i !== NET.say.i)) { P.say = NET.say; patch.say = NET.say; }
  const bj = JSON.stringify(packBuild(myBuild())); if (bj !== P.bj) { P.bj = bj; patch.b = JSON.parse(bj); patch.o = ovrOf(S.attrs); patch.r = rankOf(S.rep); }
  if (w !== P.w) { P.w = w; patch.w = w; }
  if (me && (Math.abs(me.x - (P.x || 0)) > 0.04 || Math.abs(me.z - (P.z || 0)) > 0.04 || Math.abs(me.face - (P.f || 0)) > 0.05)) { P.x = me.x; P.z = me.z; P.f = me.face; patch.x = r2(me.x); patch.z = r2(me.z); patch.f = r2(me.face); }
  if (Object.keys(patch).length) { NET.pubT = now; NET.room.presence(patch).catch(() => { }); }
}
function netInvite(peer, m, tierIdx, kind) {
  if (!NET.room) return; NET.out = { id: rid(), to: peer, m: m ? m.id : '', t: tierIdx | 0, k: kind, seed: Math.floor(Math.random() * 1e9) };
  pres({ inv: NET.out, acc: null }); sfx('uiok');
  const id = NET.out.id; setTimeout(() => { if (NET.out && NET.out.id === id) { NET.out = null; pres({ inv: null }); toast('NO ANSWER', 'They did not pick up.'); if (UI.cur) rerender(); } }, 30000);
}
function crewKick(peer) { if (!NET.crew) return; NET.crew.m = NET.crew.m.filter(x => x !== peer); if (!NET.crew.m.length) NET.crew = null; pres({ cr: NET.crew }); }
function crewLeave() { NET.inCrew = null; pres({ in: null }); }
// other players walking the same place
// which place you are in, as others see it: a crib is someone's crib
function worldKey() { return !W ? 'menu' : W.kind === 'crib' || W.kind === 'room' ? W.kind + '@' + (W.visit ? W.visit.peer : (NET.me || 'me')) : W.kind; }
function netWorldStep(dt) {
  if (!W) return; netPublish();
  const rigs = W.netRigs || (W.netRigs = {}), seen = {}, key = worldKey(), today = dayKey();
  if (NET.room) for (const p of netOthers()) {
    const pr = p.presence;
    // likes for your crib, one per person per day
    if (pr.lk === (NET.me + '|' + today)) { const H = home(), nm = peerName(p); H.likers = H.likers || {}; if (H.likers[nm] !== today) { H.likers[nm] = today; H.likes = (H.likes | 0) + 1; save(); toast('♥ ' + nm + ' LIKED YOUR CRIB', H.likes + ' likes all time.', 'ach'); sfx('unlock'); } }
    if (pr.w !== key || typeof pr.x !== 'number' || typeof pr.z !== 'number') continue; seen[p.peer] = 1;
    let g = rigs[p.peer]; const bj = JSON.stringify(pr.b);
    if (!g || g.bj !== bj) {
      const b = unpackBuild(pr.b); if (!b) continue; if (g) scene.remove(g.rig.root);
      const rig = makeRig(b); scene.add(rig.root); rig.root.add(nameTag(b.name, RANKS[clamp(pr.r | 0, 0, RANKS.length - 1)].n, rig.H));
      g = rigs[p.peer] = { rig, bj, x: clamp(pr.x, -60, 60), z: clamp(pr.z, -60, 60), f: +pr.f || 0, ph: 0, sayI: g ? g.sayI : (pr.say ? pr.say.i : 0) };
    }
    const tx = clamp(pr.x, -60, 60), tz = clamp(pr.z, -60, 60), k = 1 - Math.exp(-9 * dt), ox = g.x, oz = g.z;
    g.x += (tx - g.x) * k; g.z += (tz - g.z) * k; g.f = lerpAng(g.f, +pr.f || 0, k);
    const v = Math.hypot(g.x - ox, g.z - oz) / Math.max(dt, 0.001); g.ph += dt * (4 + v * 1.6);
    const em = typeof pr.em === 'string' && EMOTES[pr.em] ? EMOTES[pr.em] : null;
    if (em && v < 0.3) { g.rig.root.position.set(g.x, em.y || 0, g.z); g.rig.root.rotation.y = g.f; applyPose(g.rig, emotePose(em, g.rig, W.t, 'flex'), dt); g.rig.gait = null; }
    else locoAnim(g.rig, g.x, g.z, g.f, dt);
    if (pr.say && typeof pr.say.t === 'string' && pr.say.i !== g.sayI) { bubble(g.rig.root, pr.say.t.replace(/[<>]/g, '').slice(0, 60), 5, g.rig.H + 0.45, 'net'); g.sayI = pr.say.i; }
  }
  for (const k in rigs) if (!seen[k]) { scene.remove(rigs[k].rig.root); delete rigs[k]; }
  // hanging out at a crib with someone online for a minute: +15 Respect once a day, for each of you
  if ((W.kind === 'crib' || W.kind === 'room') && Object.keys(seen).length) { W.hangT = (W.hangT || 0) + dt; const H = home(); if (W.hangT >= 60 && H.hang !== today) { H.hang = today; gainRep(15); save(); toast('HUNG OUT', '+15 Respect. Good company counts.', 'ach'); } }
}
function nameTag(name, sub, H, col) {
  col = col || '#ff2d78';
  const tex = canvasTex(256, 80, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(8,8,10,.88)'; x.fillRect(0, 8, w, 60); x.fillStyle = col; x.fillRect(0, 8, 12, 60); x.fillRect(12, 62, w - 12, 6); x.fillStyle = col === '#ff2d78' ? '#ece9e2' : col; x.font = '900 expanded 26px Archivo, sans-serif'; x.textBaseline = 'middle'; x.fillText(String(name).slice(0, 12), 22, 30, 226); x.fillStyle = '#ece9e2'; x.font = '500 14px "JetBrains Mono", monospace'; x.fillText(String(sub).toUpperCase(), 22, 50, 226); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); s.scale.set(1.5, 0.47, 1); s.position.set(0, H + 0.5, 0); s.renderOrder = 9; return s;
}

// ---------- a shared game ----------
// Every screen rebuilds the same rosters from the same seed, so only the human builds ever cross the wire.
// Up to the mode's size per team: 2v2 or 3v3, any mix of people and AI.
function netTeams(m, tier, seed, hostB, guests) {
  return withSeed(seed, () => {
    const used = new Set([hostB.name, ...guests.map(g => g.b.name)]);
    const ai = o => { const b = aiBuild(clamp(o + rnd(-3, 3), 50, 99)); let k = 0; while (used.has(b.name)) b.name = pick(NPC_NAMES) + (++k > 20 ? k : ''); used.add(b.name); return { b, key: '' }; };
    const t0 = [{ b: hostB, key: 'host' }], t1 = [];
    for (const g of guests) { const t = g.team ? t1 : t0; if (t.length < m.size) t.push({ b: g.b, key: g.peer }); }
    while (t0.length < m.size) t0.push(ai(tier.ovr - 2)); while (t1.length < m.size) t1.push(ai(tier.ovr));
    return [t0, t1];
  });
}
async function netJoin(id) { try { return await NET.room.join('g-' + id); } catch (e) { return null; } }
// host: announce the run in the lobby, then start it. g = [[peer, team], ...]
function netGo(m, tierIdx, g, seed) {
  if (!m || !NET.room) return; const go = { id: rid(), m: m.id, t: tierIdx | 0, s: (seed || Math.floor(Math.random() * 1e9)) >>> 0, g };
  pres({ go }); netStartHost(go);
}
async function netStartHost(go) {
  const m = MODES.find(x => x.id === go.m), tier = TIERS_COURT[go.t];
  const guests = go.g.map(([peer, team]) => { const q = peerById(peer), b = q && unpackBuild(q.presence.b); return b ? { peer, team: team ? 1 : 0, b, rin: null, last: {} } : null; }).filter(Boolean);
  if (!m || !tier || !guests.length) { pres({ go: null }); toast('NOBODY TO RUN WITH', 'They left before the check.'); return; }
  const R = await netJoin(go.id); if (!R) { pres({ go: null }); toast('COULD NOT CONNECT', 'Try again.'); return; }
  const teams = netTeams(m, tier, go.s, myBuild(), guests); let slot = 2;
  for (const t of teams) for (const sp of t) {
    if (sp.key === 'host') { sp.ctrl = 0; sp.mine = true; }
    else if (sp.key) { const gg = guests.find(x => x.peer === sp.key); gg.slot = slot; while (IN.length <= slot) IN.push(blankIn()); sp.ctrl = slot++; sp.peer = sp.key; sp.ai = Math.max(0.5, tier.ai); }
    else { sp.ctrl = -1; sp.ai = tier.ai; }
  }
  const G = NET.game = { role: 'host', R, go, guests, q: 0, ev: [], evN: 0, sendT: 0, unsub: null, t0: performance.now() };
  G.unsub = R.onPeers(ch => {
    for (const gg of guests) { const q = ch.peers.find(p => p.peer === gg.peer); if (q) gg.seen = true; if (q && q.presence && q.presence.i) gg.rin = q.presence.i; }
    for (const l of ch.left) { const gg = guests.find(x => x.peer === l.peer); if (gg && !gg.gone && MT) { gg.gone = true; const rp = MT.P.find(p => p.peer === gg.peer); if (rp) { rp.remote = false; rp.user = false; rp.ctrl = -1; MT.humans = MT.P.filter(p => p.user); toast(rp.b.name + ' LEFT', 'The AI took over their player.'); } } }
  }, () => { });
  // anyone who never shows up in the game's room within 8 seconds is played by the AI
  setTimeout(() => { if (NET.game !== G || !MT) return; for (const gg of guests) if (!gg.seen && !gg.gone) { gg.gone = true; const rp = MT.P.find(p => p.peer === gg.peer); if (rp) { rp.remote = false; rp.user = false; rp.ctrl = -1; MT.humans = MT.P.filter(p => p.user); toast(rp.b.name + " DIDN'T SHOW", 'The AI is playing their player.'); } } }, 8000);
  const boosts = S.boosts.slice(); S.boosts = []; save();
  const cfg = { mode: m, tier, teams, boosts, ball: S.worn.ball, seed: go.s % 8, firstOff: go.s % 2, net: 'host' };
  cfg.onEnd = res => { finishGame(res, m, tier, null, cfg); setTimeout(() => netLeave(G), 6000); };
  uiClose(); document.body.dataset.state = 'match'; startMatch(cfg); uiHud(); netPublish(true);
}
async function netStartGuest(go, hostP) {
  const m = MODES.find(x => x.id === go.m), tier = TIERS_COURT[go.t | 0], hb = unpackBuild(hostP.presence.b);
  const guests = go.g.map(x => { if (!Array.isArray(x)) return null; const [peer, team] = x; const b = peer === NET.me ? unpackBuild(packBuild(myBuild())) : (peerById(peer) && unpackBuild(peerById(peer).presence.b)); return b ? { peer, team: team ? 1 : 0, b } : null; });
  if (!m || !tier || !hb || guests.some(x => !x)) { toast('COULD NOT LOAD THE RUN', 'Someone in it dropped. Get called again.'); return; }
  const R = await netJoin(go.id); if (!R) { toast('COULD NOT CONNECT', 'Get called again.'); return; }
  const teams = netTeams(m, tier, go.s, hb, guests);
  for (const t of teams) for (const sp of t) { sp.ctrl = sp.key === NET.me ? 0 : -1; sp.mine = sp.key === NET.me; if (sp.key) sp.peer = sp.key === 'host' ? hostP.peer : sp.key; }
  const G = NET.game = { role: 'guest', R, hostPeer: hostP.peer, go, snap: null, q: -1, evSeen: 0, lastSnapT: performance.now(), out: { a: 0, bc: 0, fc: 0, rc: 0 }, outJ: '', sendT: 0, gs: null, unsub: null, ended: false };
  G.unsub = R.onPeers(ch => {
    const h = ch.peers.find(p => p.peer === hostP.peer); if (h && h.presence && h.presence.s && h.presence.s.q !== G.q) { G.snap = h.presence.s; G.lastSnapT = performance.now(); }
    if (ch.left.some(p => p.peer === hostP.peer)) G.hostLeft = true;
  }, () => { G.hostLeft = true; });
  const cfg = { mode: m, tier, teams, boosts: [], ball: hb.worn.ball, seed: go.s % 8, firstOff: go.s % 2, net: 'guest' };
  cfg.onEnd = res => { finishGame(res, m, tier, null, cfg); netLeave(G); };
  document.body.dataset.state = 'match'; startMatch(cfg); uiHud(); netPublish(true);
}
function netLeave(G) { if (!G) return; try { if (G.unsub) G.unsub(); G.R.leave().catch(() => { }); } catch (e) { } if (NET.game === G) NET.game = null; pres({ acc: null, inv: null, go: null }); netPublish(true); }

// host → guest: things that happened (calls, floats, sounds, shot feedback)
function netEv(e) { const G = NET.game; if (!G || G.role !== 'host') return; e.n = ++G.evN; G.ev.push(e); if (G.ev.length > 6) G.ev.shift(); }
function netSnapshot(end) {
  const M_ = MT, B = M_.B, G = NET.game;
  const s = { q: ++G.q, ph: M_.phase, sc: M_.score, ck: r2(M_.clock), of: M_.off, nc: M_.needClear ? 1 : 0, ev: G.ev,
    P: M_.P.map(p => {
      const a = [r2(p.x), r2(p.z), r2(p.y), r2(p.face), ST_CODES.indexOf(p.st), r2(p.t), (p.handsUp ? 1 : 0) | (p.sprinting ? 2 : 0) | (p.bravT > 0 ? 4 : 0) | (p.fire ? 8 : 0) | (p.hand === 'L' ? 16 : 0) | (p.st === 'shoot' && p.shot.released ? 32 : 0) | (p.live === 'hold' || p.live === 'dead' ? 64 : 0), Math.round(p.stam), r2(p.brav)];
      if (p.st === 'shoot') a.push(r2(p.shot.rel), p.shot.fade ? 1 : 0, p.shot.side || 0); else if (p.st === 'finish') { const f = p.finish; a.push(f.type === 'dunk' ? 1 : 0, r2(f.dur), f.spin, f.type === 'dunk' ? f.style : f.kind, r2(f.turn || 0), f.euro || 0, (f.cont ? 1 : 0) | (f.blocked ? 2 : 0) | (f.hit ? 4 : 0)); } else if (p.st === 'move') a.push(r2(p.mv.dx), ['side', 'back', 'diag'].indexOf(p.mv.slot), p.mv.mv.dur, p.mv.mv.id); else if (p.st === 'hop') a.push(r2(p.hop.dur)); else if (p.st === 'stagger') a.push(p.stg.fall ? 1 : 0, p.stg.side === undefined ? 1 : p.stg.side, r2(p.stg.dur || 1), p.stg.kind || '');
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
// host: each guest's sticks and buttons become an input slot (2, 3, …)
function netPollRemote() {
  const G = NET.game; if (!G || G.role !== 'host') return;
  for (const gg of G.guests) {
    const I = IN[gg.slot], r = gg.rin, L = gg.last; if (!I) continue; I.aP = I.bP = I.relEdge = false; I.flick = null;
    // a player who has not touched anything for 6 s is played by the AI until they do (a phone in a pocket must not stall the game)
    const rj = r ? JSON.stringify(r) : ''; if (rj !== gg.rj) { gg.rj = rj; gg.lastIn = performance.now(); } const idle = performance.now() - (gg.lastIn || G.t0 || 0) > 6000 && !(r && (r.mx || r.my || r.rd || r.b));
    if (MT) { const pl = gg.pl || (gg.pl = MT.P.find(p => p.peer === gg.peer)); if (pl && pl.afk !== idle) { pl.afk = idle; if (pl.remote) floatTxt(pl, idle ? 'AUTO' : 'BACK', idle ? '#8d8d99' : '#3dffa0'); } }
    if (!r) { I.mx = I.my = 0; I.sprint = false; I.rdir = null; I.b = false; I.lt = false; continue; }
    I.mx = clamp(+r.mx || 0, -1, 1); I.my = clamp(+r.my || 0, -1, 1); I.sprint = !!r.sp; I.lt = !!r.lt; I.rdir = typeof r.rd === 'string' ? r.rd : null; I.b = !!r.b;
    if (L.a !== undefined && r.a !== L.a) I.aP = true; if (L.bc !== undefined && r.bc !== L.bc) I.bP = true;
    if (L.fc !== undefined && r.fc !== L.fc) I.flick = String(r.fd || ''); if (L.rc !== undefined && r.rc !== L.rc) { I.relEdge = true; I.rh = clamp(+r.rh || 0, 0, 3); }
    L.a = r.a; L.bc = r.bc; L.fc = r.fc; L.rc = r.rc;
  }
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
  const pay = { mx: r2(I.mx), my: r2(I.my), sp: I.sprint ? 1 : 0, lt: I.lt ? 1 : 0, rd: I.rdir, b: I.b ? 1 : 0, a: o.a, bc: o.bc, fc: o.fc, fd: o.fd || '', rc: o.rc, rh: o.rh || 0 }, pj = JSON.stringify(pay);
  if (pj !== G.outJ && G.sendT <= 0) { G.outJ = pj; G.sendT = 0.033; G.R.presence({ i: pay }).catch(() => { }); }
  // ---- state in ----
  const s = G.snap;
  if (s && s.q !== G.q && Array.isArray(s.P) && Array.isArray(s.B)) {
    G.q = s.q; M_.phase = String(s.ph); M_.score = [s.sc[0] | 0, s.sc[1] | 0]; M_.clock = +s.ck || 0; M_.off = s.of | 0; M_.needClear = !!s.nc;
    s.P.forEach((a, i) => {
      const p = M_.P[i]; if (!p || !Array.isArray(a)) return; p.tx = +a[0] || 0; p.tz = +a[1] || 0; p.ty = +a[2] || 0; p.tf = +a[3] || 0;
      const st = ST_CODES[a[4]] || 'free', fl = a[6] | 0; if (st !== p.st || Math.abs(p.t - a[5]) > 0.25) p.t = +a[5] || 0; p.st = st;
      p.handsUp = !!(fl & 1); p.sprinting = !!(fl & 2); p.bravT = fl & 4 ? 1 : 0; p.live = fl & 64 ? 'dead' : 'drib'; p.fire = !!(fl & 8); p.hand = fl & 16 ? 'L' : 'R'; p.stam = +a[7] || 0; p.brav = +a[8] || 0;
      if (st === 'shoot') p.shot = { rel: +a[9] || 0.6, j: JUMPER[p.b.moves.jumper] || JUMPERS[0], released: !!(fl & 32), fade: a[10] ? 1 : 0, side: +a[11] || 0 };
      else if (st === 'finish') { const k = String(a[12] || ''); p.finish = { type: a[9] ? 'dunk' : 'layup', dur: +a[10] || 0.6, style: a[9] && (DUNK[k]) ? k : p.b.moves.dunk, kind: a[9] ? '' : (FINISHES.find(x => x.id === k) ? k : 'lay'), spin: a[11] | 0, turn: +a[13] || 0, euro: +a[14] || 0, cont: a[15] & 1, blocked: !!(a[15] & 2), hit: a[15] & 4 ? 1 : null }; }
      else if (st === 'move') p.mv = { dx: +a[9] || 0, slot: ['side', 'back', 'diag'][a[10]] || 'side', mv: { dur: +a[11] || 0.35, id: MOVE[a[12]] ? String(a[12]) : 'cross' } };
      else if (st === 'hop') p.hop = { dur: +a[9] || HOP_T };
      else if (st === 'stagger') p.stg = { fall: !!a[9], side: clamp(+a[10] || 0, -1, 1), dur: clamp(+a[11] || 1, 0.3, 5), kind: ['sit', 'face', 'flat', 'spin', 'knee'].includes(a[12]) ? a[12] : 'sit' };
      if (st !== 'finish' && st !== 'move') p.rig.extraYaw = 0;
    });
    B.state = BSTATES[s.B[0]] || 'loose'; B.tp = B.tp || V3(); B.tp.set(+s.B[1] || 0, +s.B[2] || 0, +s.B[3] || 0); B.holder = M_.P[s.B[4]] || null; B.green = !!s.B[5]; B.shooter = s.B[6] ? { fire: true } : null;
    for (const e of (Array.isArray(s.ev) ? s.ev : [])) {
      if (!e || e.n <= G.evSeen) continue; G.evSeen = e.n;
      if (e.k === 'c') hudCall(String(e.b || ''), String(e.s || ''), cssCol(e.c), +e.d || 1.2);
      else if (e.k === 'f') { const p = M_.P[e.i]; if (p) hudFloat(p, String(e.t || ''), cssCol(e.c)); }
      else if (e.k === 'pu') puNet(e);
      else if (e.k === 'ca') { const K = M_.crowd; if (K) { const i = K.pool.findIndex(b => b.name === e.n), b = i >= 0 ? K.pool.splice(i, 1)[0] : null; crowdAdd(b, false); } }
      else if (e.k === 'cs') { const p = M_.P[e.i | 0]; if (p) p.celebStyle = String(e.s || '').slice(0, 14); }
      else if (e.k === 'sb') { const p = M_.P[e.i | 0]; if (p && !(S.set && S.set.talk === 0)) persBub(p, String(e.t || '').slice(0, 100)); }
      else if (e.k === 'ta') { const p = M_.P[e.i | 0]; if (p) p.tauntT = 1.3; }
      else if (e.k === 'cr') crowdReact(String(e.p || ''), e.t === undefined ? undefined : e.t | 0, true);
      else if (e.k === 'ko') { const p = M_.P[e.i | 0]; if (p) p.ko = clamp(+e.d || 3, 0, 6); }
      else if (e.k === 'fb') { if (!e.to || e.to === NET.me) hudFb(String(e.t || ''), cssCol(e.c)); }
      else if (e.k === 's') { sfx(String(e.s2 || '')); if (e.s2 === 'dunk') { M_.shake = 0.45; burst(0, 3, 0, 0xffc531, 14); M_.netT = 0.35; } if (e.s2 === 'swish' || e.s2 === 'green') { M_.netT = 0.35; for (const f of M_.fans) f.hype = 1.4; } }
    }
    if (s.end && !G.ended) { G.ended = true; G.end = s.end; G.endT = 2.4; }
  }
  for (const p of M_.P) {
    if (p.tx === undefined) continue; p.t += dt; const k = 1 - Math.exp(-16 * dt), ox = p.x, oz = p.z;
    p.x += (p.tx - p.x) * k; p.z += (p.tz - p.z) * k; p.y += (p.ty - p.y) * Math.min(1, k * 1.6); p.face = lerpAng(p.face, p.tf, k);
    p.speed = lerp(p.speed || 0, Math.hypot(p.x - ox, p.z - oz) / Math.max(dt, 0.001), 0.3); p.def = M_.off !== p.team && B.holder !== p && B.state !== 'loose';
  }
  if (G.gs && me.st === 'shoot' && !me.shot.released) me.t = (now - G.gs.t0) / 1000;      // your own meter follows your thumb, not the lag
  for (const p of M_.P) animPlayer(p, dt);
  if (B.state === 'held' && B.holder) { if (!B.holder.drib || B.lastHolder !== B.holder) B.holder.drib = newDrib(B.holder, B.pos); ballHeld(B.holder, dt); } else if (B.tp) B.pos.lerp(B.tp, 1 - Math.exp(-28 * dt));
  B.lastHolder = B.state === 'held' ? B.holder : null;
  B.spin += dt * 6; if (B.shooter && B.state === 'shot' && Math.random() < 0.6) burst(B.pos.x, B.pos.y, B.pos.z, 0xff7a1f, 1);
  ballMesh();
  matchFx(dt); matchCam(dt); hudMatch();
  // ---- endings ----
  if (G.ended) { G.endT -= dt; if (G.endT <= 0 && MT) { const e = G.end, mi = me.i, t = me.team; hudShow(false); const cfg = M_.cfg; MT = null;
    const box = (Array.isArray(e.box) ? e.box : []).map((b, i) => ({ n: String(b.n || ''), team: b.team | 0, user: i === mi, s: cleanStats(b.s) }));
    cfg.onEnd({ win: e.sc[t] > e.sc[1 - t], score: [e.sc[t] | 0, e.sc[1 - t] | 0], stats: box[mi] ? box[mi].s : cleanStats({}), mode: cfg.mode, tier: cfg.tier, bonusRep: 0, shutout: e.sc[1 - t] === 0 && e.sc[t] > 0, box }); } }
  else if (G.hostLeft || now - G.lastSnapT > 9000) { const cfg = M_.cfg; hudShow(false); MT = null; netLeave(G); cfg.onEnd({ quit: true, lost: true }); }
}
function cleanStats(s) { const o = {}; for (const k of ['pts', 'ast', 'reb', 'stl', 'blk', 'ankles', 'greens', 'dunks', 'threes', 'fga', 'fgm', 'bravs', 'fires', 'fouls']) o[k] = clamp((s && s[k]) | 0, 0, 999); return o; }
function cssCol(c) { return typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c) ? c : '#fff'; }
