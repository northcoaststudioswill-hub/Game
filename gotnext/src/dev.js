// GOT NEXT — the Dev Room: a maxed-out player, any build, every move, and a reel that plays them all on a real court.
// Open it from the title screen, or press F2 on The Block. Games played from here pay nothing.
'use strict';
const DEV = { back: 'title', tab: 'profile', prev: null, opp: 'max', oppOvr: 85, oppStyle: 'lockdown' };

// ---------- builds ----------
// every attribute 99, every street smart iced out, the flashiest move in every slot
function maxBuild(style, name, h) {
  const st = style || 'showman', attrs = {}, badges = {};
  for (const a of ATTRS) attrs[a.id] = 99; for (const b of BADGES) badges[b.id] = 4;
  const hb = h || { sniper: 77, slasher: 78, general: 74, lockdown: 79, glass: 84, showman: 77 }[st];
  return { name: name || 'MAXED OUT', build: { style: st, origin: 'rustbelt', body: { h: hb, w: 0, s: 0.4 }, skin: 2 }, attrs, badges,
    worn: Object.assign({}, newSave().worn, { shoes: 'k_gold', bottom: 'b_gold', back: 'bk_cape' }), moves: { side: 'shammgod', back: 'moonwalk', diag: 'halfspin', jumper: 'lawsuit', dunk: 'legs', celeb: 'eagle' } };
}
// the first time the Dev Room changes your player, the real one is put aside (inside the save, so it follows a cloud save)
function devKeep() { if (!S.devBak) { const { name, build, attrs, badges, moves, owned, worn, vc, rep, created, seenRank, home } = S; S.devBak = JSON.parse(JSON.stringify({ name, build, attrs, badges, moves, owned, worn, vc, rep, created, seenRank, home })); } }
// a furnished crib to look at: every yard, a few complete sets
function devSampleCrib() {
  const H = home(); H.lot = 2; H.look = { house: 0, trim: 2, fence: 2, ground: 3 };
  H.items = [['rug', -17, 6, 0], ['sofa', -17, 4.5, 0], ['tv', -17, 8.5, 2], ['beanbag', -19, 6, 1], ['arcade', -21.5, 3, 1], ['lava', -14.5, 4, 0], ['fire', -17, 11.5, 0], ['lawn', -15.5, 12.5, 3], ['lawn', -18.5, 12.5, 1],
    ['grill', -21.5, 13, 1], ['cooler', -21.5, 11, 1], ['picnic', -14, 0, 0], ['speaker', -20, -1.5, 0], ['dj', -17, -1.8, 0], ['strings', -17, 1.8, 0], ['palm', -22.5, -2, 0], ['palm', -12.5, 14.2, 0], ['lamp', -12.2, 9, 0],
    ['weights', 14, 9, 0], ['bpress', 17, 9.2, 0], ['bag', 20, 9, 0], ['tires', 22.5, 9, 0], ['rack', 14, 14.5, 2], ['minihoop', 18, 14.5, 2], ['shotclock', 20.5, 14.5, 0], ['cones', 22.5, 13, 0], ['turf', 17, 12, 0],
    ['kicks', -12, 21.5, 2], ['case', -8.5, 21.8, 2], ['spot', -10, 19, 2], ['mirror', -5, 21.8, 2], ['chain', -16, 21.8, 2], ['car', 13, 20, 0], ['holo', 7, 20, 0], ['neonball', 19.5, 22, 2], ['planter', 4, 22, 2],
    ['hedge', 22, 18, 1], ['gnome', 3.2, 19, 0], ['flamingo', 5.2, 18.6, 0], ['flagpole', -22.5, 22.5, 0], ['mural', -20, 22, 2], ['arch', -12, 17.2, 0], ['dogcart', 18, 18.2, 0], ['barber', -3.5, 18, 2], ['boombox', -5.5, 17.2, 0], ['bench', -3.5, 21.6, 2]
  ].map(([i, x, z, r]) => ({ i, x, z, r, m: Math.floor(Math.random() * 5) })).filter(it => HOME_ITEM[it.i]);
  homeRoom().look = { wall: 1, floor: 1 };
  homeRoom().items = [['rug', 0, -1.5, 0], ['sofa', 0, -3.6, 0], ['ctable', 0, -1.6, 0], ['tv', 0, 1.2, 2], ['beanbag', -2.4, -1.8, 1], ['arcade', 6.6, -5.3, 3], ['bed', -5.6, 3.8, 1], ['records', 4.5, -5.6, 0], ['flamp', -2.2, -4.8, 0],
    ['kicks', 6.9, 1.5, 3], ['poster', -4.2, -5.7, 0], ['throne', 3.2, -1.6, 3], ['houseplant', 6.8, 5.2, 0], ['lava', 2.5, -4.8, 0], ['speaker', -6.6, -0.5, 1], ['bowl', 0, -1.6, 0], ['console', 0.35, -1.6, 0]
  ].map(([i, x, z, r]) => ({ i, x, z, r, m: 0, y: ['bowl', 'console'].includes(i) ? 0.44 : 0 })).filter(it => HOME_ITEM[it.i]); save();
}
function devMax() {
  devKeep();
  for (const a of ATTRS) S.attrs[a.id] = 99; for (const b of BADGES) S.badges[b.id] = 4;
  S.moves.owned = Array.from(new Set(S.moves.owned.concat(MOVES.map(m => m.id), JUMPERS.map(m => m.id), DUNKS.map(m => m.id), CELEBS.map(m => m.id))));
  Object.assign(S.moves, { side: 'shammgod', back: 'moonwalk', diag: 'halfspin', jumper: 'lawsuit', dunk: 'legs', celeb: 'eagle' });
  S.owned = Array.from(new Set(S.owned.concat(DRIP.map(d => d.id))));
  S.vc = Math.max(S.vc, 250000); S.rep = Math.max(S.rep, RANKS[RANKS.length - 1].rep); S.seenRank = RANKS.length - 1; S.created = true; save();
}
function devRestore() {
  const b = S.devBak; if (!b) return; Object.assign(S, JSON.parse(JSON.stringify(b))); delete S.devBak; save();
}
function devEdit(fn) { devKeep(); fn(); save(); devRig(); rerender(); }

// ---------- the room ----------
function devRig() { if (ST && ST.kind === 'studio') studioRig(myBuild()); }
function uiDev(back) {
  if (back) DEV.back = back; hideTitleQuiet();
  if (!S.attrs || !ATTRS.every(a => S.attrs[a.id] > 0)) S.attrs = Object.assign(startAttrs(S.build), S.attrs || {});   /* no player made yet: start from a rookie */ document.body.dataset.state = 'create'; studioScene(); devRig(); ST.devPose = DEV.prev;
  openPanel(devRender, 'side', devLeave);
}
function hideTitleQuiet() { $('title').style.display = 'none'; }
function devLeave() {
  uiClose(); if (ST) ST.devPose = null;
  if (DEV.back === 'hub' && S.created) enterWorld('hub', 0, 9, Math.PI); else { titleScene(); uiTitle(); }
}
function devPreview(an, o) { DEV.prev = { an, o: o || {}, t0: ST ? ST.t : 0 }; if (ST) ST.devPose = DEV.prev; }
function devRender() {
  const tabs = [['profile', 'PROFILE'], ['build', 'BUILD'], ['moves', 'MOVES'], ['anim', 'ANIM LAB'], ['play', 'PLAY'], ['reel', 'REEL']];
  let h = `<div class="ph"><h2>DEV ROOM</h2></div><div class="tabs">` + tabs.map(([k, n]) => Btn(n, () => { DEV.tab = k; rerender(true); }, 'sm ' + (DEV.tab === k ? '' : 'alt'))).join('') + `</div><div class="pb">`;
  h += `<div class="card"><div class="row" style="gap:12px"><div class="ovr">${ovrOf(S.attrs)}</div><div><div class="f" style="font-size:18px">${esc(S.name)}</div><div class="mu">${STYLE[S.build.style].n} · ${fmtH(S.build.body.h)} · ${RANKS[rankOf(S.rep)].n}${S.devBak ? ' · <span class="ye">dev player (your real one is saved)</span>' : ''}</div></div></div></div>`;
  const t = DEV.tab;
  if (t === 'anim') {
    h += `<div class="card"><h3>ANIM LAB</h3><p>Every player has a movement profile: how their jump shot blends the three foundations (traditional, high release, quick release), how they stand around (relaxed, athletic, wide), and their posture and timing. It is cosmetic: it never changes release timing or any rating.</p><p style="margin-top:6px">Two players side by side, any action or transition, slow motion, pause and frame step, sliders for the left one, save to your builds or homies.</p><div style="margin-top:6px">${Btn('OPEN ANIM LAB', () => { uiClose(); alabOpen(); })}</div></div>`;
  } else if (t === 'profile') {
    h += `<div class="card"><h3>MAXED OUT</h3><p>Every attribute 99, every street smart iced out, every move, jumper, dunk, celebration and piece of drip owned, top rank, 250,000 HC. The flashiest package is equipped.</p><div style="margin-top:6px">${Btn('MAX ME OUT', () => { devMax(); devRig(); sfx('unlock'); toast('MAXED OUT', '99 everything. Go look in the mirror.', 'rank'); rerender(); })}</div></div>`;
    h += `<div class="card"><h3>YOUR REAL PLAYER</h3><p>${S.devBak ? `Saved: <b>${esc(S.devBak.name)}</b>, ${ovrOf(S.devBak.attrs)} OVR, ${S.devBak.vc.toLocaleString()} HC. Restoring puts everything back exactly as it was, and throws away the dev changes.` : 'Nothing changed yet. The first change made here puts your real player aside so you can get them back.'}</p>${S.devBak ? `<div style="margin-top:6px">${Btn('RESTORE MY PLAYER', () => { devRestore(); devRig(); sfx('uiok'); toast('RESTORED', 'Back to the real you.'); rerender(); }, 'alt')}</div>` : ''}</div>`;
    h += `<div class="card"><h3>WORLD</h3><p>Weather today: <b>${todayWeather()}</b>${weatherOverride ? ' (forced)' : ''}. It changes by the day; force it here to look around.</p><div style="margin-top:6px">${['clear', 'drizzle', 'fog'].map(w => Btn(w, () => { weatherOverride = w; toast('WEATHER', w + ' (next place you enter)'); rerender(); }, 'sm ' + (weatherOverride === w ? '' : 'alt'))).join(' ')} ${Btn('by the day', () => { weatherOverride = null; rerender(); }, 'sm alt')}</div>
      <p style="margin-top:8px">Crib: level ${homeLevel().lvl}, ${home().items.length} pieces, lot ${home().lot + 1}/3.</p><div style="margin-top:6px">${Btn('DECORATE MY CRIB (sample)', () => { devKeep(); devSampleCrib(); toast('CRIB DECORATED', 'All three yards, a few sets. Go home and look.'); rerender(); }, 'sm alt')} ${Btn('EMPTY MY CRIB', () => { devKeep(); home().items = []; home().store = {}; save(); rerender(); }, 'sm alt')}</div></div>`;
    h += `<div class="card"><h3>BUILD CODE</h3><p>Paste a code to become that player, or copy yours.</p><input type="text" id="devCode" placeholder="GN1-..." style="width:100%"><div style="margin-top:6px">${Btn('LOAD CODE', () => { const b = decodeBuild(($('devCode').value || '')); if (!b) { toast('BAD CODE', 'That code did not read.'); return; } devEdit(() => { S.name = b.name; S.build = b.build; S.attrs = b.attrs; S.badges = b.badges; S.worn = b.worn; Object.assign(S.moves, b.moves); }); toast('LOADED', b.name); }, 'sm')} ${Btn('COPY MINE', () => { const c = encodeBuild(myBuild()); try { navigator.clipboard.writeText(c); } catch (e) { } $('devCode').value = c; toast('COPIED', 'Build code is on the clipboard.'); }, 'sm alt')}</div></div>`;
  } else if (t === 'build') {
    const caps = capsFor(S.build);
    h += `<div class="cat">PLAYSTYLE</div><div class="grid">` + STYLES.map(s => `<div class="card ${s.id === S.build.style ? 'sel' : ''}" data-k="${on(() => devEdit(() => { S.build.style = s.id; }))}"><h3>${s.n}</h3><p>${s.tag}</p></div>`).join('') + `</div>`;
    h += `<div class="cat">QUICK SET</div><div class="card">` + [['Max all 99', () => { for (const a of ATTRS) S.attrs[a.id] = 99; }], ['Cap out this style', () => { for (const a of ATTRS) S.attrs[a.id] = caps[a.id]; }], ['Fresh rookie', () => { S.attrs = startAttrs(S.build); }], ['All smarts iced', () => { for (const b of BADGES) S.badges[b.id] = 4; }], ['No smarts', () => { S.badges = {}; }]].map(([n, f]) => Btn(n, () => devEdit(f), 'sm alt')).join(' ') + `</div>`;
    h += `<div class="cat">ARCHETYPES <span class="mu" style="text-transform:none;letter-spacing:.02em">— each style capped out at its signature height</span></div><div class="card">` + STYLES.map(s => Btn(s.n, () => devEdit(() => { const m = maxBuild(s.id); S.build = m.build; const c = capsFor(S.build); for (const a of ATTRS) S.attrs[a.id] = c[a.id]; }), 'sm alt')).join(' ') + `</div>`;
    h += `<div class="cat">BODY</div><div class="card"><label class="sl">HEIGHT <b id="dh">${fmtH(S.build.body.h)}</b></label><input type="range" min="${H_MIN}" max="${H_MAX}" step="1" value="${S.build.body.h}" data-k="${on(el => { devKeep(); S.build.body.h = +el.value; $('dh').textContent = fmtH(S.build.body.h); save(); devRig(); })}">`;
    h += `<label class="sl">WEIGHT</label><input type="range" min="-10" max="10" step="1" value="${Math.round(S.build.body.w * 10)}" data-k="${on(el => { devKeep(); S.build.body.w = el.value / 10; save(); devRig(); })}"><label class="sl">WINGSPAN</label><input type="range" min="-10" max="10" step="1" value="${Math.round(S.build.body.s * 10)}" data-k="${on(el => { devKeep(); S.build.body.s = el.value / 10; save(); devRig(); })}"></div>`;
    h += `<div class="cat">ATTRIBUTES <span class="mu" style="text-transform:none;letter-spacing:.02em">— 25 to 99, caps ignored here (the mark is this style's cap)</span></div><div class="card">`;
    for (const c in CATS) { h += `<div class="cat" style="color:${CATS[c][1]}">${CATS[c][0]}</div>`; for (const a of ATTRS) if (a.cat === c) h += `<label class="sl">${a.n} <b id="da_${a.id}">${S.attrs[a.id]}</b> <small class="mu">cap ${caps[a.id]}</small></label><input type="range" min="25" max="99" step="1" value="${S.attrs[a.id]}" data-k="${on(el => { devKeep(); S.attrs[a.id] = +el.value; $('da_' + a.id).textContent = el.value; save(); })}">`; }
    h += `</div><div class="cat">STREET SMARTS <span class="mu" style="text-transform:none;letter-spacing:.02em">— tap to cycle the tier</span></div><div class="grid">`;
    h += BADGES.map(b => { const v = S.badges[b.id] || 0; return `<div class="card" data-k="${on(() => devEdit(() => { S.badges[b.id] = ((S.badges[b.id] || 0) + 1) % 5; }))}"><h3 style="color:${TIER_COL[v]}">${b.n}</h3><p>${b.d}</p><span class="tag" style="color:${TIER_COL[v]}">${TIERS[v]}</span></div>`; }).join('') + `</div>`;
  } else if (t === 'moves') {
    h += `<p class="mu">Equip anything, owned or not. PREVIEW poses the player here; the REEL tab plays the real thing on a court.</p>`;
    const sec = (title, list, slot, an) => {
      h += `<div class="cat">${title}</div><div class="grid">`;
      for (const m of list) { const eq = slot && S.moves[slot] === m.id; h += `<div class="card ${eq ? 'sel' : ''}"><h3>${m.n}</h3><p>${m.d || ''}</p><div style="margin-top:5px">${slot ? (eq ? `<span class="tag on">EQUIPPED</span> ` : Btn('EQUIP', () => devEdit(() => { S.moves[slot] = m.id; if (!S.moves.owned.includes(m.id)) S.moves.owned.push(m.id); }), 'sm') + ' ') : ''}${an ? Btn('PREVIEW', () => { devPreview(...an(m)); rerender(); }, 'sm alt') : ''}</div></div>`; }
      h += `</div>`;
    };
    const mvA = m => ['move', { kind: m.id, side: 1, cyc: m.dur }];
    sec('SIDE MOVE  ← →', MOVES.filter(m => m.slot === 'side'), 'side', mvA); sec('STEPBACK  ↙ ↘', MOVES.filter(m => m.slot === 'back'), 'back', mvA); sec('SPIN  ↖ ↗', MOVES.filter(m => m.slot === 'diag'), 'diag', mvA);
    sec('JUMPSHOT', JUMPERS, 'jumper', m => ['shoot', { rel: m.rel, kick: m.id === 'lawsuit', cyc: m.rel * 1.6 }]);
    sec('DUNK PACKAGE', DUNKS.concat([DUNK.reverse]), null, m => ['dunk', { style: m.id, cyc: 0.9, u: 1 }]);
    h += `<div class="card">${DUNKS.map(m => Btn((S.moves.dunk === m.id ? '✓ ' : '') + m.n, () => devEdit(() => { S.moves.dunk = m.id; if (!S.moves.owned.includes(m.id)) S.moves.owned.push(m.id); }), 'sm ' + (S.moves.dunk === m.id ? '' : 'alt'))).join(' ')}</div>`;
    sec('FINISHES AND JUMPER VARIATIONS (everyone has these)', FINISHES, null, m => ({ fade: ['shoot', { rel: 0.6, fadeA: 1, cyc: 1 }], side: ['shoot', { rel: 0.6, sideS: 1, cyc: 1 }], hopj: ['hop', { cyc: HOP_T * 2 }], hop: ['hop', { cyc: HOP_T * 2 }] }[m.id] || ['layup', { kind: m.id === 'euro' ? 'lay' : m.id, euro: m.id === 'euro' ? 1 : 0, cyc: 0.9, u: 1 }]));
    sec('CELEBRATION', CELEBS, 'celeb', m => ['celeb', { style: m.id }]);
  } else if (t === 'play') {
    h += `<p class="mu">Your current build, on a real court. Nothing here pays HC or Respect.</p>`;
    h += `<div class="card"><h3>SHOOT AROUND</h3><p>Just you, a hoop and a rebounder that gives the ball back.</p>${Btn('GO', () => devPlay('solo'), 'sm')}</div>`;
    const os = DEV.opp === 'max' ? `a maxed-out ${STYLE[DEV.oppStyle].n}` : `a ${DEV.oppOvr} OVR`;
    h += `<div class="card"><h3>OPPONENT</h3><p>Next games are against ${os}.</p><div>${Btn('MAXED OUT', () => { DEV.opp = 'max'; rerender(); }, 'sm ' + (DEV.opp === 'max' ? '' : 'alt'))} ${Btn('BY OVR', () => { DEV.opp = 'ovr'; rerender(); }, 'sm ' + (DEV.opp === 'ovr' ? '' : 'alt'))}</div>`;
    h += DEV.opp === 'max' ? `<div style="margin-top:6px">${STYLES.map(s => Btn(s.n, () => { DEV.oppStyle = s.id; rerender(); }, 'sm ' + (DEV.oppStyle === s.id ? '' : 'alt'))).join(' ')}</div>` : `<label class="sl">OVR <b id="dov">${DEV.oppOvr}</b></label><input type="range" min="50" max="99" step="1" value="${DEV.oppOvr}" data-k="${on(el => { DEV.oppOvr = +el.value; $('dov').textContent = el.value; })}">`;
    h += `</div><div class="card"><h3>GAMES</h3><div>${Btn('1 v 1 · to 11', () => devPlay('1v1'), 'sm')} ${Btn('STREET 3v3', () => devPlay('s3'), 'sm')} ${Btn('RUCKUS 2v2', () => devPlay('j2'), 'sm')} ${Btn('RUCKUS 3v3', () => devPlay('j3'), 'sm')}</div></div>`;
  } else if (t === 'reel') {
    h += `<p class="mu">Plays every animation in the group with your current build, on a court, through the same code as a game. It loops; pause to leave.</p>`;
    for (const k in REELS) h += `<div class="card"><h3>${REELS[k].n}</h3><p>${REELS[k].list().map(e => e.n).join(' · ')}</p>${Btn('PLAY REEL', () => devReel(k), 'sm')}</div>`;
  }
  return h + `</div><div class="pf">${Btn('LEAVE', devLeave, 'alt')}</div>`;
}

// ---------- playing ----------
// the reel's defender: a good, not maxed, rim protector (6'10", 85 Block, Silver No Fly Zone)
function rimGuard() { const b = maxBuild('lockdown', 'RIM GUARD', 82); for (const a of ATTRS) b.attrs[a.id] = 75; Object.assign(b.attrs, { block: 85, intd: 85, str: 80, vert: 80, reb: 82 }); b.badges = { nofly: 2, ground: 2 }; return b; }
function devOpp(ovr) { return DEV.opp === 'max' ? maxBuild(DEV.oppStyle, pick(NPC_NAMES)) : Object.assign(aiBuild(ovr || DEV.oppOvr), {}); }
function devPlay(kind) {
  uiClose(); document.body.dataset.state = 'match'; ST = null;
  const back = res => { hudShow(false); uiDev(); if (res && !res.quit && res.score) toast(res.win ? 'DUB' : 'L', `${res.score[0]} — ${res.score[1]} · dev game, no pay`); };
  if (kind === 'solo' || kind === 'reel') {
    startMatch({ mode: { id: 'dev', n: 'DEV ROOM', size: 1, arcade: false, to: 999 }, tier: TIERS_COURT[0], practice: 'dev', court: 'street', hoopTier: 2, ball: S.worn.ball, teams: [[{ b: myBuild(), ctrl: 0, mine: true }], kind === 'reel' ? [{ b: rimGuard(), ctrl: -1, ai: 1 }] : []], onEnd: back });
    return;
  }
  const m = kind === '1v1' ? { id: '1v1', n: 'DEV 1V1', size: 1, arcade: false, to: 11 } : MODES.find(x => x.id === kind);
  const lvl = DEV.opp === 'max' ? 1 : clamp((DEV.oppOvr - 50) / 45, 0.3, 1);
  const team = (mine) => { const t = []; for (let i = 0; i < m.size; i++) t.push(mine && i === 0 ? { b: myBuild(), ctrl: 0, mine: true } : { b: devOpp(), ctrl: -1, ai: lvl }); return t; };
  const used = new Set([S.name]); const tm = [team(true), team(false)]; for (const t of tm) for (const sp of t) if (!sp.mine) { let n = sp.b.name; while (used.has(n)) n = pick(NPC_NAMES); used.add(n); sp.b.name = n; }
  startMatch({ mode: m, tier: TIERS_COURT[3], teams: tm, boosts: [], ball: S.worn.ball, seed: 2, firstOff: 0, p2: 'off', onEnd: back });
}

// ---------- the reel: every animation, played through the real game ----------
// each entry: n name, at start spot, dir run direction, spr sprint, when(p) trigger (or run seconds), go(p) the action
const toRim = (x, z) => { const l = Math.hypot(x, z); return [-x / l, -z / l]; };
function reelDunk(id, n) { return { n, d: 'Dunk', at: [1.4, 6.6], dir: toRim(1.4, 6.6), spr: 1, when: p => dHoop(p) < 2.9, go: p => startFinish(p, 0, true, 0, { style: id }) }; }
const REELS = {
  dunks: { n: 'DUNKS', list: () => DUNKS.map(m => reelDunk(m.id, m.n)).concat([
    { n: 'Reverse Mortgage', d: 'Reverse dunk · baseline drive, stick away from the rim', at: [5.6, 1.0], dir: [-1, -0.05], spr: 1, when: p => Math.abs(p.x) < 2.3, go: p => startFinish(p, 0, true, 0, { style: 'reverse' }) },
    { n: 'Hop Step Slam', d: 'Hop step · let go of the stick on the way in', at: [-1.2, 7.0], dir: toRim(-1.2, 7.0), spr: 1, when: p => dHoop(p) < 3.6, go: p => startHop(p, 'finish') }]) },
  layups: { n: 'LAYUPS', list: () => [
    { n: 'Lay-in', d: 'Stick toward the rim', at: [1.8, 5.2], dir: toRim(1.8, 5.2), spr: 0, when: p => dHoop(p) < 2.0, go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'lay' }) },
    { n: 'Finger Roll', d: 'Full speed from a step out', at: [-1.0, 7.4], dir: toRim(-1.0, 7.4), spr: 1, when: p => dHoop(p) < 3.0, go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'finger' }) },
    { n: 'Euro Step', d: 'Stick sideways as you go up', at: [2.4, 6.4], dir: toRim(2.4, 6.4), spr: 1, when: p => dHoop(p) < 3.0, go: p => startFinish(p, -1, false, 0, { layup: 1, kind: 'euro', euro: -1 }) },
    { n: 'Reverse Layup', d: 'Baseline, stick away from the rim', at: [-5.6, 1.0], dir: [1, -0.05], spr: 1, when: p => Math.abs(p.x) < 2.2, go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'reverse' }) },
    { n: 'Scoop', d: 'Underhand, under the shot-blocker', at: [0.6, 6.0], dir: toRim(0.6, 6.0), spr: 1, when: p => dHoop(p) < 2.4, go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'scoop' }) },
    { n: 'Power Layup', d: 'Two feet, two hands', at: [-2.0, 4.6], dir: toRim(-2.0, 4.6), spr: 0, when: p => dHoop(p) < 1.9, go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'power' }) },
    { n: 'Hop Step Layup', d: 'Let go of the stick on the way in', at: [1.0, 7.0], dir: toRim(1.0, 7.0), spr: 1, when: p => dHoop(p) < 3.4, go: p => startHop(p, 'finish', null, { layup: 1 }) },
    { n: 'Floater', d: 'Push ↑ from just outside the paint', at: [-0.8, 7.6], dir: toRim(-0.8, 7.6), spr: 1, when: p => dHoop(p) < 4.6, go: p => startShot(p, 'reel', true) }] },
  jumpers: { n: 'JUMPERS', list: () => [
    { n: 'Pull-Up', d: 'Your jumpshot: ' + (JUMPER[S.moves.jumper] || JUMPERS[0]).n, at: [2.6, 8.0], dir: toRim(2.6, 8.0), spr: 1, when: p => dHoop(p) < 5.6, go: p => startShot(p, 'reel', false, { hopped: 0 }) },
    { n: 'Fadeaway', d: 'Stick away from the rim as you shoot', at: [-3.0, 3.4], dir: toRim(-3.0, 3.4), spr: 0, run: 0.5, go: p => startShot(p, 'reel', false, { fade: 1 }) },
    { n: 'Side-Step', d: 'Stick sideways from a stand', at: [3.4, 5.4], dir: [0, 0], run: 0.4, go: p => startShot(p, 'reel', false, { side: 1 }) },
    { n: 'Hop-Step Jumper', d: 'Push ↑ (drive) from mid-range', at: [-0.6, 9.6], dir: toRim(-0.6, 9.6), spr: 1, when: p => dHoop(p) < 6.2, go: p => startHop(p, 'shot', 'reel') },
    { n: 'Stepback Three', d: '↙ ↘ then shoot', at: [1.8, 6.6], dir: toRim(1.8, 6.6), spr: 0, run: 0.5, go: p => startMove(p, 'back', 0.5, 1), then: [[0.42, p => startShot(p, 'reel', false, { hopped: 0 })]] },
    { n: 'Killer Into A Fade', d: 'Combo: Hostile Takeover, then fade', at: [-1.2, 6.2], dir: toRim(-1.2, 6.2), spr: 0, run: 0.5, go: p => { p.b.moves.side = 'killer'; startMove(p, 'side', 1, -0.15); }, then: [[0.45, p => startShot(p, 'reel', false, { fade: 1 })]] }] },
  handles: { n: 'HANDLES', list: () => MOVES.map(m => ({ n: m.n, d: { side: '← →', back: '↙ ↘', diag: '↖ ↗' }[m.slot] + ' · ' + m.d, at: [0.4, 8.2], dir: [0, -0.45], spr: 0, run: 0.7, go: p => { p.b.moves[m.slot] = m.id; if (m.slot === 'side') startMove(p, 'side', 1, -0.15); else if (m.slot === 'back') startMove(p, 'back', 0.55, 1); else startMove(p, 'diag', 0.8, -0.8); } })) },
};
// the same lane, a rim protector waiting, and finishers of different quality: the game picks the finish
const CONT = (n, d, att, x, z) => ({ n, d, att, at: [x, z], dir: toRim(x, z), spr: 1, def: [x * 0.17, z * 0.17], when: p => dHoop(p) < 2.9, go: p => startFinish(p, 0, false, 0, { auto: 1 }) });
REELS.contested = { n: 'CONTESTED AT THE RIM', list: () => [
  CONT('Average finisher', '65 Layup, 40 Dunk, into a rim protector', { layup: 65, close: 65, dunk: 40, str: 55, vert: 60 }, 0.8, 6.6),
  CONT('Strong finisher', '85 Layup, 92 Strength', { layup: 85, close: 80, dunk: 40, str: 92, vert: 70 }, -1.2, 6.4),
  CONT('Elite finisher', '99 Layup', { layup: 99, close: 99, dunk: 40, str: 75, vert: 85 }, 1.6, 6.2),
  CONT('Average dunker', '72 Dunk but 99 Layup: pulls out of the dunk and finishes', { dunk: 72, vert: 70, str: 60 }, -0.6, 6.8),
  CONT('Elite dunker', '99 Dunk, 99 Strength', {}, 0.4, 6.8),
  Object.assign(CONT('Hang And Adjust', 'Elite finisher: pull it down, let him fly by', { layup: 99, dunk: 40 }, 1.0, 6.4), { go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'hang' }) }),
  Object.assign(CONT('Euro Around Him', 'Elite finisher: one step, then the open side', { layup: 99, dunk: 40 }, 0.6, 6.6), { go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'euro', euro: 1 }) }),
  Object.assign(CONT('Switch Hands', 'Elite finisher: to the hand away from the block', { layup: 99, dunk: 40 }, -1.0, 6.4), { go: p => startFinish(p, 0, false, 0, { layup: 1, kind: 'switch' }) }),
  CONT('Weak dunker, no layup game', '66 Dunk, 55 Layup: goes up anyway, gets stuffed', { dunk: 66, layup: 55, vert: 72, str: 50 }, 0.2, 6.8)] };
REELS.all = { n: 'EVERYTHING', list: () => REELS.dunks.list().concat(REELS.layups.list(), REELS.jumpers.list(), REELS.handles.list(), REELS.contested.list()) };
// the reel's defender: stands in the lane, hands up, and jumps at the shot. Only used by entries that set def.
function reelDefThink(o) {
  const R = MT.reel, e = R.list[R.i], me = MT.me; o.in.dx = o.in.dz = 0; o.handsUp = !!e.def;
  if (!e.def || o.st !== 'free' || R.ph === 'setup') return;
  o.faceLock = Math.atan2(me.x - o.x, me.z - o.z);
  const d = dist(o, me), lead = e.jump === undefined ? 0.15 : e.jump;
  if (!R.jumped && ((me.st === 'finish' && me.t > me.finish.dur * lead && d < 2.6) || (me.st === 'shoot' && me.t > me.shot.rel * 0.35 && d < 2.6) || (me.st === 'hop' && d < 1.6))) { R.jumped = 1; startJump(o); }
}
function devReel(k) {
  devPlay('reel'); const keep = Object.assign({}, MT.me.b.moves);
  MT.reel = { k, list: REELS[k].list(), i: 0, ph: 'setup', t: 0, keep, A0: Object.assign({}, MT.me.A), def: MT.P.find(q => q.team === 1) };
}
function reelThink(p, dt) {
  const R = MT.reel, B = MT.B, e = R.list[R.i]; p.handsUp = false;
  if (MT.phase !== 'live') { p.in.dx = p.in.dz = 0; return; }
  R.t += dt;
  if (R.ph === 'setup') {
    p.in.dx = p.in.dz = 0; p.in.sprint = false;
    if (B.holder !== p) { if ((B.state === 'shot' || B.state === 'through') && R.t < 2.5) return; give(p); }
    Object.assign(p.b.moves, R.keep); p.A = Object.assign({}, R.A0, e.att || {}); MT.off = p.team; R.jumped = 0;
    const o = R.def; if (o) { o.st = 'free'; o.y = 0; o.vx = o.vz = 0; o.rig.gait = null; if (e.def) { o.x = e.def[0]; o.z = e.def[1]; } else { o.x = 7.4; o.z = 12.4; } o.lx = o.x; o.lz = o.z; o.face = Math.atan2(p.x - o.x, p.z - o.z); o.faceLock = undefined; }
    p.st = 'free'; p.y = 0; p.x = e.at[0]; p.z = e.at[1]; p.vx = p.vz = 0; p.lx = p.x; p.lz = p.z; p.reset = true; p.rig.gait = null; p.face = Math.atan2(-p.x, -p.z); p.rig.extraYaw = 0;
    call(e.n, `${R.i + 1}/${R.list.length} · ${e.d || ''}`, '#ffc531', 1.6); R.ph = 'run'; R.t = 0; return;
  }
  if (R.ph === 'run') {
    p.in.dx = e.dir[0]; p.in.dz = e.dir[1]; p.in.sprint = !!e.spr;
    if ((e.when ? e.when(p) : R.t >= (e.run || 0.5)) || R.t > 3) { e.go(p); R.ph = 'act'; R.t = 0; R.done = {}; }
    return;
  }
  // act: let it play out; release jumpers on time; run any follow-ups
  p.in.dx = p.in.dz = 0; p.in.sprint = false;
  if (e.then) e.then.forEach(([t, fn], i) => { if (!R.done[i] && R.t >= t && (p.st === 'free' || p.st === 'move' && canCancel(p))) { R.done[i] = 1; p.st = 'free'; fn(p); } });
  if (p.st === 'shoot' && !p.shot.released && !p.shot.auto && p.t >= p.shot.rel) releaseShot(p);
  if ((p.st === 'free' && R.t > 1.3 && (!e.then || Object.keys(R.done).length === e.then.length)) || R.t > 4) { R.i = (R.i + 1) % R.list.length; R.ph = 'setup'; R.t = 0; }
}
addEventListener('keydown', ev => { if (ev.code === 'F2' && W && !UI.cur && S.created) { ev.preventDefault(); uiDev('hub'); } });
