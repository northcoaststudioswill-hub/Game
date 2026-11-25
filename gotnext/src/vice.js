// GOT NEXT — the bones and the book, Lil Bottie's body, and things to do at home.
//   TREY'S BONES   dice games on grey holodice (the Wisp Table from Guttercrown, moved to the Block): Thirteen,
//                  Twenty-One, Poker Bones, High Bones
//   TREY'S BOOK    bet HC on AI games: winner, spread, a star's points, parlays; then watch the game or sim it
//   BOTTIE         a chrome robot body for the rig; lives at your crib as an upgrade
//   HOME           cookouts, the heavy bag, trick shots, naps, bones at your own table
// HC only. Both the table and the book stop paying out past a daily win limit, so neither is a way to max a build.
'use strict';

// ---------------- Lil Bottie's body ----------------
function botLook(R, skin, hr) {
  const chrome = toon('#c3ccd6'), dark = toon('#1a1c22'), J = R.joints;
  R.root.traverse(o => { if (o.isMesh && o.material === skin) o.material = chrome; });
  const head = J.head, chest = J.chest;
  // dreads: thick ropes off the crown, hanging to the shoulders, in two tones
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, back = Math.cos(a) < 0.55, len = back ? 0.2 + (i % 3) * 0.04 : 0.11; if (!back && Math.abs(Math.sin(a)) < 0.5) continue;
    const d = M(cyl(0.018, 0.014, len, 5), toon(i % 3 ? '#16181c' : '#33e0ff'), Math.sin(a) * hr * 0.9, hr * 1.55 - len / 2, Math.cos(a) * hr * 0.85, head); d.rotation.z = -Math.sin(a) * 0.22; d.rotation.x = Math.cos(a) * 0.22; }
  M(sph(hr * 0.98, 10, 6), toon('#16181c'), 0, hr * 1.5, -0.01, head).scale.set(1, 0.55, 1);
  // a visor strip that glows, an antenna, bolts at the temples
  M(box(hr * 1.7, hr * 0.42, 0.03), flat(0x33e0ff), 0, hr * 1.14, hr * 0.92, head); for (const sx of [-1, 1]) M(cyl(0.022, 0.022, 0.03, 8), dark, sx * hr * 0.93, hr * 1.1, 0, head).rotation.z = Math.PI / 2;
  // the puffer: three fat rolls round the chest, a high collar, rolls on the upper arms
  const pc = toon('#ff2d78'), w = (R.shW || 0.36);
  for (let k = 0; k < 3; k++) ink(M(sph(0.2, 10, 6), pc, 0, -0.08 - k * 0.13, 0, chest), 1.04).scale.set(1.05 + (k === 1 ? 0.06 : 0), 0.42, 0.78);
  ink(M(cyl(0.085, 0.1, 0.09, 10, true), pc, 0, 0.05, 0, chest), 1.05);
  for (const s of ['R', 'L']) { const sh = J['sh' + s]; if (!sh) continue; for (let k = 0; k < 2; k++) M(sph(0.075, 8, 6), pc, 0, -0.07 - k * 0.11, 0, sh).scale.set(1, 0.8, 1); }
  // the chain
  const ch = M(geo('botChain', () => new THREE.TorusGeometry(0.1, 0.012, 5, 14)), toon('#f2c14e'), 0, -0.1, 0.13, chest); ch.rotation.x = 1.2; M(box(0.05, 0.05, 0.015), toon('#f2c14e'), 0, -0.2, 0.17, chest);
}
function bottieBuild() { const b = withSeed(4242, () => aiBuild(84, 'showman')); b.name = 'BOTTIE'; b.bot = true; b.build.body = { h: 75, w: -0.2, s: 0.3 }; b.worn = Object.assign(randomWorn(1), { hair: 'h_buzz', head: 'hd_none', face: 'f_none', top: 't_tank', bottom: 'b_basic', shoes: 'k_white', back: 'bk_none' }); return b; }

// ---------------- holodice ----------------
// the grey ones: a pillar on a pale foot, a brown cap, a black dome, and the number hanging in the light above it
function holoNumTex(n) { return geoTex('holoB' + n, () => canvasTex(64, 64, x => { x.clearRect(0, 0, 64, 64); x.shadowColor = '#ff7a1f'; x.shadowBlur = 10; x.fillStyle = '#ffb347'; x.font = '900 50px Archivo, Impact, sans-serif'; x.textAlign = 'center'; x.fillText(String(n), 32, 50); x.shadowBlur = 4; x.fillStyle = '#ffe9c0'; x.fillText(String(n), 32, 50); })); }      /* just the glowing number: it sits inside the black dome */
function holodiceMesh(g) {
  ink(M(box(0.3, 0.1, 0.3), toon('#3a3d44'), 0, 0.05, 0, g), 1.04); M(box(0.27, 0.07, 0.27), toon('#d5d9de'), 0, 0.135, 0, g); ink(M(box(0.24, 0.5, 0.24), toon('#8f959d'), 0, 0.42, 0, g), 1.04);
  ink(M(box(0.34, 0.06, 0.34), toon('#5a3a22'), 0, 0.7, 0, g), 1.05); M(sph(0.15, 14, 10), flat(0x08080b), 0, 0.73, 0, g).scale.set(1, 0.9, 1);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: holoNumTex(1 + Math.floor(Math.random() * 6)), transparent: true, depthWrite: false })); sp.scale.setScalar(0.2); sp.position.y = 0.79; sp.material.depthTest = false; sp.renderOrder = 5; g.add(sp); g.userData.holo = sp;
  if (typeof W !== 'undefined' && W) (W.holo = W.holo || []).push({ sp, t: rnd(2, 9), roll: 0 }); return g;
}
function holoStep(dt) { if (!W || !W.holo) return; if (W.bones && W.bones.on && !(UI.cur && UI.cur.onClose)) bonesLeave(); const play = W.bones && W.bones.on;
  for (const h of W.holo) {
    if (h.table && play) {      // a die in play: flickers while it rolls, then shows its number; empty places are dark
      if (h.roll > 0) { h.roll -= dt; h.ft = (h.ft || 0) - dt; h.sp.visible = true; if (h.ft <= 0) { h.ft = 0.06; h.sp.material.map = holoNumTex(1 + Math.floor(Math.random() * 6)); } h.sp.position.y = 0.79; if (h.roll <= 0 && h.val) { h.sp.material.map = holoNumTex(h.val); sfx('ui'); } }
      else { h.sp.visible = h.val > 0; h.sp.position.y = 0.79; h.sp.material.color.setHex(h.held ? 0x7dffb0 : 0xffffff); h.sp.scale.setScalar(h.held ? 0.24 : 0.2); }
      continue; }
    h.sp.visible = true; h.sp.material.color.setHex(0xffffff);
    if (h.roll > 0) { h.roll -= dt; h.ft = (h.ft || 0) - dt; if (h.ft <= 0) { h.ft = 0.07; h.sp.material.map = holoNumTex(1 + Math.floor(Math.random() * 6)); } h.sp.position.y = 0.79; } else { h.t -= dt; h.sp.position.y = 0.79; if (h.t <= 0) { h.t = rnd(4, 12); h.roll = 0.7; } } }
}
// put a game's dice on the table: a place whose number changed rolls first (his a beat after yours)
function bonesSync(you, him, hold) { const T = W && W.bones; if (!T) return; T.on = true; const set = (row, vals, delay) => row.forEach((h, i) => { const v = vals[i] || 0, hd = !!(hold && hold[i] && row === T.you); if (v !== h.val) { h.val = v; h.roll = v ? 0.45 + delay + i * 0.05 : 0; } h.held = hd; }); set(T.you, you.slice(-8), 0); set(T.him, him.slice(-8), 0.35); }
function bonesBusy() { const T = W && W.bones; return !!(T && T.on && T.you.concat(T.him).some(h => h.roll > 0)); }
function bonesLeave() { const T = W && W.bones; if (!T) return; T.on = false; for (const h of T.you.concat(T.him)) { h.val = 0; h.held = false; h.roll = 0; } W.camO = null; }
function holoRollAll() { if (W && W.holo) for (const h of W.holo) h.roll = rnd(0.5, 0.9); }

// drip you cannot buy: earned by doing the thing
function deedDrip(id, why) { if (S.owned.includes(id)) return; S.owned.push(id); save(); setTimeout(() => { toast('UNLOCKED: ' + DRIPS[id].n.toUpperCase(), why + '. It is in your closet.', 'ach'); sfx('unlock'); }, 1200); }

// ---------------- daily limits ----------------
const VICE_CAP = { bones: 1500, book: 2500 };
function vice() { const t = dayKey(); if (!S.vice || S.vice.day !== t) S.vice = { day: t, bones: 0, book: 0, w: (S.vice && S.vice.w) || 0, l: (S.vice && S.vice.l) || 0, net: (S.vice && S.vice.net) || 0 }; return S.vice; }
function viceRoom(k) { return VICE_CAP[k] - vice()[k]; }      /* how much more you can win there today */
function vicePay(k, delta) { const V = vice(); S.vc += delta; V[k] += delta; V.net += delta; if (delta > 0) V.w++; else if (delta < 0) V.l++; save(); if (typeof uiHud === 'function' && W) uiHud(); }

// ---------------- TREY'S BONES ----------------
const TREY = {
  hello: ['Trey Dedrick, the Third. At your service and at your expense. Pick a game.', 'Another brave wallet. Sit. Well. Stand. There are no chairs.', 'The dice are honest. I am merely charming.'],
  bust: ['Over. Dreadful luck. I shall treasure it.', 'Bust! My grandfather would have wept. With joy.', 'Too many. The light giveth and so on.'],
  win: ['Well rolled. I hate it. Here is your HC.', 'You win. I shall be gracious about it later, in private.', 'Splendid. Do it again so I can win it back.'],
  lose: ['The house prevails, as houses do.', 'Mine. Thank you ever so.', 'Unlucky. Lucky for me, which is the important bit.'],
  push: ['A draw. Your stake back, and my respect, which is worth less.', 'Even. Nobody is happy. Perfect.'],
  dead: ['DEAD ON. Triple! I shall need a moment.', 'Exactly the number. Triple, curse you.'],
  roll: ['Another?', 'And one more…', 'The light is warm tonight.', 'Steady hands.'],
  broke: ['Your wallet is empty, friend. Come back heavier.'], capped: ['You have cleaned me out for today. Come back tomorrow. I shall be rested and you shall be poorer.'],
};
const BONES = {
  t13: { n: 'THIRTEEN', d: 'Roll one die at a time. Stand close to 13; Trey has to match or beat you. A dead 13 pays triple.', target: 13 },
  t21: { n: 'TWENTY-ONE', d: 'The long game: the same, to 21. A dead 21 pays triple.', target: 21 },
  poker: { n: 'POKER BONES', d: 'Five dice each. Tap dice to hold them, throw the rest once. Best hand wins.' },
  high: { n: 'HIGH BONES', d: 'Two dice each, highest total wins. PRESS once: double the stake and rethrow your worst.' },
};
const d6 = () => 1 + Math.floor(Math.random() * 6);
// poker hands on five dice: [rank, tiebreak...]; higher is better
function bonesHand(d) {
  const c = {}; for (const v of d) c[v] = (c[v] || 0) + 1; const g = Object.entries(c).map(([v, n]) => [n, +v]).sort((a, b) => b[0] - a[0] || b[1] - a[1]), s = d.slice().sort((a, b) => a - b).join('');
  const kick = g.map(x => x[1]);
  if (g[0][0] === 5) return [7, ...kick]; if (g[0][0] === 4) return [6, ...kick]; if (g[0][0] === 3 && g[1][0] === 2) return [5, ...kick];
  if (s === '12345' || s === '23456') return [4, d.reduce((a, b) => a + b, 0)]; if (g[0][0] === 3) return [3, ...kick]; if (g[0][0] === 2 && g[1][0] === 2) return [2, ...kick]; if (g[0][0] === 2) return [1, ...kick]; return [0, ...kick];
}
const HAND_N = ['HIGH DIE', 'A PAIR', 'TWO PAIR', 'THREE OF A KIND', 'STRAIGHT', 'FULL HOUSE', 'FOUR OF A KIND', 'FIVE OF A KIND'];
function handCmp(a, b) { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return d; } return 0; }
function treyHolds(d) { const h = bonesHand(d); if (h[0] >= 4) return d.map(() => true); const c = {}; for (const v of d) c[v] = (c[v] || 0) + 1; const best = Math.max(...Object.values(c)); if (best === 1) { const mx = Math.max(...d); return d.map(v => v === mx && v >= 5); } return d.map(v => c[v] >= 2); }
// one full hand of a totals game with you standing at `stand` (used by the test to measure the house edge)
function bonesSim(target, stand) { let y = 0; while (y < stand) y += d6(); if (y > target) return -1; if (y === target) return 2; let h = 0; while (h < y) h += d6(); return h > target ? 1 : -1; }      /* Trey takes a tie: with best play the house keeps 2-3% */
function holoHTML(v, o) { o = o || {}; return `<span data-k="${o.k === undefined ? '' : o.k}" style="display:inline-block;width:46px;margin:0 3px;text-align:center;cursor:${o.k === undefined ? 'default' : 'pointer'};opacity:${o.dim ? 0.45 : 1}"><span style="display:block;height:30px;font:900 22px var(--display,Archivo);color:${o.held ? '#3dffa0' : '#ffb347'};text-shadow:0 0 10px ${o.held ? '#3dffa0' : '#ff7a1f'}">${v || '·'}</span><span style="display:block;width:20px;height:10px;margin:0 auto;background:#0d0d10;border-radius:10px 10px 0 0"></span><span style="display:block;width:34px;height:6px;margin:0 auto;background:#5a3a22"></span><span style="display:block;width:24px;height:34px;margin:0 auto;background:linear-gradient(90deg,#7c828a,#a5abb3 45%,#8a9098)"></span><span style="display:block;width:28px;height:6px;margin:0 auto;background:#d5d9de"></span><span style="display:block;width:32px;height:7px;margin:0 auto;background:#3a3d44"></span></span>`; }
function uiBones(home) {
  const G = { game: null, stake: home ? 25 : 50, phase: 'pick', you: [], him: [], hold: [], msg: pick(TREY.hello), pressed: false, bet: 0 };
  const host = home ? 'HOUSE RULES' : 'TREY', stakes = home ? [10, 25, 50] : [25, 50, 100, 250], say = k => home ? ({ win: 'You win.', lose: 'The house takes it.', push: 'Push.', bust: 'Bust.', dead: 'DEAD ON. Triple.', roll: '', broke: 'Not enough HC.', capped: 'Enough for today.' }[k]) : pick(TREY[k]);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const settle = (res, mult) => { const win = res > 0 ? Math.round(G.bet * (mult || 1)) : res < 0 ? -G.bet : 0; vicePay('bones', win); G.phase = 'done'; G.res = res; G.won = win; sfx(res > 0 ? 'coin' : res < 0 ? 'no' : 'ui'); holoRollAll(); };
  const start = id => { if (S.vc < G.stake) { G.msg = say('broke'); return rerender(); } if (viceRoom('bones') <= 0) { G.msg = say('capped'); return rerender(); }
    G.game = id; G.bet = G.stake; G.you = []; G.him = []; G.hold = [false, false, false, false, false]; G.pressed = false; G.res = 0; G.phase = 'you'; sfx('uiok');
    if (id === 'poker') { G.you = [d6(), d6(), d6(), d6(), d6()]; G.msg = 'Tap the dice you want to keep. Then throw the rest.'; }
    else if (id === 'high') { G.you = [d6(), d6()]; G.him = [d6(), d6()]; G.msg = `You show ${sum(G.you)}. Stand, or press: double the stake and rethrow your worst.`; }
    else { G.you = [d6()]; G.msg = say('roll'); } rerender(); };
  const treyTotals = () => { const T = BONES[G.game].target, y = sum(G.you); while (sum(G.him) < y) G.him.push(d6()); const h = sum(G.him); if (h > T) { G.msg = say('win'); settle(1); } else { G.msg = say('lose'); settle(-1); } };
  const act = a => {
    const T = BONES[G.game] && BONES[G.game].target;
    if (G.game === 't13' || G.game === 't21') {
      if (a === 'roll') { G.you.push(d6()); const y = sum(G.you); sfx('ui'); if (y > T) { G.msg = say('bust'); settle(-1); } else if (y === T) { G.msg = say('dead'); settle(1, 2); if (T === 13) deedDrip('f_dead13', 'Hit a dead 13'); } else G.msg = say('roll'); }
      else if (a === 'stand') treyTotals();
    } else if (G.game === 'poker') {
      if (a === 'throw') { G.you = G.you.map((v, i) => G.hold[i] ? v : d6()); let h = [d6(), d6(), d6(), d6(), d6()]; const k = treyHolds(h); h = h.map((v, i) => k[i] ? v : d6()); G.him = h;
        const a1 = bonesHand(G.you), b1 = bonesHand(G.him), c = handCmp(a1, b1); G.msg = `${HAND_N[a1[0]]} against ${HAND_N[b1[0]]}. ` + say(c > 0 ? 'win' : c < 0 ? 'lose' : 'push'); settle(c > 0 ? 1 : c < 0 ? -1 : 0); }
    } else if (G.game === 'high') {
      if (a === 'press' && !G.pressed && S.vc >= G.bet * 2) { G.pressed = true; G.bet *= 2; const i = G.you[0] <= G.you[1] ? 0 : 1; G.you[i] = d6(); sfx('ui'); }
      if (a === 'press' || a === 'stand') { const y = sum(G.you), h = sum(G.him); G.msg = `${y} against ${h}. ` + say(y > h ? 'win' : 'lose'); settle(y > h ? 1 : -1); }      /* Trey takes a tie */
    }
    rerender();
  };
  const bar = () => {
    bonesSync(G.phase === 'pick' ? [] : G.you, G.phase === 'pick' ? [] : G.him, G.game === 'poker' && G.phase === 'you' ? G.hold : null);
    const T = W.bones, pt = innerWidth < innerHeight; W.camO = { p: new THREE.Vector3(T.cx + 0.15, pt ? 5.2 : 3.0, T.cz + (pt ? 7.4 : 4.3)), l: new THREE.Vector3(T.cx, 0.15, T.cz + 0.75) };
    const tot = G.phase !== 'pick' && G.game !== 'poker' && G.you.length ? ` · YOU ${sum(G.you)}${G.him.length ? ' · TREY ' + sum(G.him) : ''}` : '';
    let h = `<div style="flex:1"></div><div class="card sel" style="max-width:720px;margin:0 auto;width:100%"><div class="row"><h3 class="mono" style="font-size:10px;color:var(--heat)">TREY${G.phase !== 'pick' ? ' · ' + BONES[G.game].n + ' · ' + G.bet + ' HC' + tot : ''}</h3>${vcLine()}</div><p style="font-size:14px;margin:6px 0 8px">${esc(G.msg)}</p><div class="pf" style="flex-wrap:wrap;gap:6px">`;
    if (G.phase === 'pick') h += stakes.map(s => Btn(s + '', () => { G.stake = s; rerender(); }, 'sm ' + (G.stake === s ? '' : 'alt'))).join('') + Object.keys(BONES).map(id => Btn(BONES[id].n, () => start(id), 'sm', S.vc < G.stake)).join('') + Btn('LEAVE', uiClose, 'sm alt');
    else if (G.phase === 'you') h += (G.game === 'poker' ? G.you.map((v, i) => Btn((G.hold[i] ? 'KEEP ' : '') + v, () => { G.hold[i] = !G.hold[i]; sfx('ui'); rerender(); }, 'sm ' + (G.hold[i] ? '' : 'alt'))).join('') + Btn('THROW THE REST', () => act('throw'), 'sm') : G.game === 'high' ? Btn('STAND', () => act('stand'), 'sm') + Btn('PRESS (' + G.bet * 2 + ')', () => act('press'), 'sm alt', S.vc < G.bet * 2) : Btn('ROLL', () => act('roll'), 'sm') + Btn('STAND ON ' + sum(G.you), () => act('stand'), 'sm alt'));
    else h += `<b class="${G.won > 0 ? 'cy' : G.won < 0 ? 'warn' : 'mu'}" style="font-size:16px;margin-right:8px">${G.won > 0 ? '+' + G.won : G.won} HC</b>` + Btn('AGAIN · ' + G.stake, () => start(G.game), 'sm', S.vc < G.stake) + Btn('OTHER GAMES', () => { G.phase = 'pick'; G.msg = say('roll') || 'Pick a game.'; rerender(); }, 'sm alt') + Btn('LEAVE', uiClose, 'sm alt');
    return h + `</div>${G.phase === 'pick' ? `<p class="mu" style="margin-top:6px;font-size:11px">${Object.values(BONES).map(b => b.n + ': ' + b.d).join(' ')}</p>` : ''}</div><div style="height:4%"></div>`;
  };
  openPanel(() => {
    if (!home && W && W.bones) return bar();
    const V = vice(); let h = `<div class="ph"><h2>${home ? 'BONES AT HOME' : "TREY'S BONES"}</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><div class="card sel"><h3 class="mono" style="font-size:10px;color:var(--heat)">${host}</h3><p style="font-size:15px;margin:6px 0">${esc(G.msg)}</p></div>`;
    if (G.phase === 'pick') {
      h += `<div class="cat">STAKE</div><div class="card">` + stakes.map(s => Btn(s + ' HC', () => { G.stake = s; rerender(); }, 'sm ' + (G.stake === s ? '' : 'alt'))).join(' ') + `</div><div class="cat">GAME</div>`;
      for (const id in BONES) h += `<div class="card"><h3>${BONES[id].n}</h3><p class="mu">${BONES[id].d}</p><div style="margin-top:6px">${Btn('PLAY · ' + G.stake + ' HC', () => start(id), 'sm', S.vc < G.stake)}</div></div>`;
      h += `<p class="mu">Today at the table: ${V.bones >= 0 ? '+' : ''}${V.bones} HC. The table stops paying once you are up ${VICE_CAP.bones} in a day.</p>`;
    } else {
      const B_ = BONES[G.game], tot = G.game === 'poker' ? '' : ` · ${sum(G.you)}`;
      h += `<div class="cat">${B_.n} · ${G.bet} HC</div><div class="card"><p class="mono" style="font-size:10px">YOU${tot}</p><div style="margin:6px 0">` + G.you.map((v, i) => holoHTML(v, G.game === 'poker' && G.phase === 'you' ? { k: on(() => { G.hold[i] = !G.hold[i]; sfx('ui'); rerender(); }), held: G.hold[i] } : {})).join('') + `</div>`;
      h += `<p class="mono" style="font-size:10px;margin-top:8px">${home ? 'THE HOUSE' : 'TREY'}${G.him.length && G.game !== 'poker' ? ' · ' + sum(G.him) : ''}</p><div style="margin:6px 0">` + (G.him.length ? G.him.map(v => holoHTML(v)).join('') : holoHTML(0, { dim: true })) + `</div></div>`;
      if (G.phase === 'you') h += `<div class="pf">` + (G.game === 'poker' ? Btn('THROW THE REST', () => act('throw')) : G.game === 'high' ? Btn('STAND', () => act('stand')) + Btn('PRESS (' + G.bet * 2 + ')', () => act('press'), 'alt', S.vc < G.bet * 2) : Btn('ROLL', () => act('roll')) + Btn('STAND ON ' + sum(G.you), () => act('stand'), 'alt')) + `</div>`;
      else h += `<p class="${G.won > 0 ? 'cy' : G.won < 0 ? 'warn' : 'mu'}" style="font-size:16px;margin:8px 0">${G.won > 0 ? '+' + G.won : G.won} HC</p><div class="pf">${Btn('AGAIN · ' + G.stake, () => start(G.game), '', S.vc < G.stake)}${Btn('OTHER GAMES', () => { G.phase = 'pick'; G.msg = say('roll') || 'Pick a game.'; rerender(); }, 'alt')}</div>`;
    }
    return h + `</div>`;
  }, !home && W && W.bones ? 'clear' : 'side', () => uiClose());
  if (!home && W && W.bones) UI.cur.onClose = bonesLeave;
}

// ---------------- TREY'S BOOK (it used to be Mark's; Trey kept the hustle) ----------------
const CREWS = ['Rust Belt Rejects', 'Parking Lot Legends', 'The Refund Kings', 'Vat 44', 'Low Gravity', 'Food Court Five', 'The Subscriptions', 'Silo Boys', 'Moon Money', 'The Pre-Orders', 'Knee Payment Plan', 'Open Run'];
function bkTeam(name, ovr, size, seed) { const ps = []; for (let i = 0; i < size; i++) { const o = clamp(Math.round(ovr + (i === 0 ? 5 : -3) + rnd(-3, 3)), 52, 97), style = pick(STYLES).id; const b = withSeed(seed + i, () => aiBuild(o, style)); ps.push({ n: b.name, ovr: o, style, seed: seed + i }); } return { n: name, ovr, ps }; }
// a quick model of a game: possessions until someone gets to the target. Used for the lines and for SIM.
function bkSim(g) {
  const to = g.to, sc = [0, 0], pts = [g.t[0].ps.map(() => 0), g.t[1].ps.map(() => 0)]; let off = Math.random() < 0.5 ? 0 : 1, guard = 0;
  while (sc[0] < to && sc[1] < to && guard++ < 400) { const o = g.t[off], d = g.t[1 - off], q = clamp(0.44 + (o.ovr - d.ovr) * 0.007, 0.2, 0.7);
    if (Math.random() < q) { const w = o.ps.map(p => Math.pow(p.ovr / 80, 4)), tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot, k = 0; while (k < w.length - 1 && r > w[k]) { r -= w[k]; k++; } const v = Math.random() < 0.22 ? 2 : 1; sc[off] += v; pts[off][k] += v; off = 1 - off; }
    else if (Math.random() > 0.28) off = 1 - off; }
  return { sc, pts };
}
function bkLines(g) {
  let w0 = 0; const mg = [], st = [[], []]; for (let i = 0; i < 400; i++) { const r = bkSim(g); if (r.sc[0] > r.sc[1]) w0++; mg.push(r.sc[0] - r.sc[1]); st[0].push(r.pts[0][0]); st[1].push(r.pts[1][0]); }
  const med = a => a.slice().sort((x, y) => x - y)[a.length >> 1], p = clamp(w0 / 400, 0.08, 0.92), ml = q => Math.max(1.06, Math.round(0.93 / q * 100) / 100), m = med(mg), fav = m >= 0 ? 0 : 1;
  g.ml = [ml(p), ml(1 - p)]; g.fav = fav; g.sp = Math.max(0.5, Math.floor(Math.abs(m) * 0.9) + 0.5); g.pr = [Math.floor(med(st[0])) + 0.5, Math.floor(med(st[1])) + 0.5];
}
function bkSlate() {
  const names = CREWS.slice().sort(() => Math.random() - 0.5), games = [];
  for (let i = 0; i < 3; i++) { const mi = pick([0, 0, 1, 2]), m = MODES[mi], base = Math.round(rnd(62, 90)), g = { id: i, mi, to: m.to, n: m.n, t: [bkTeam(names[i * 2], base + Math.round(rnd(-2, 2)), m.size, 9000 + Math.floor(Math.random() * 1e6)), bkTeam(names[i * 2 + 1], base + Math.round(rnd(-9, 9)), m.size, 9000 + Math.floor(Math.random() * 1e6))], res: null }; bkLines(g); games.push(g); }
  return { games, slip: null };
}
function book() { if (!S.book || !S.book.slate) S.book = Object.assign({ w: 0, l: 0, net: 0 }, S.book || {}, { slate: bkSlate() }); return S.book; }
function bkLegLabel(g, L) { const t = g.t[L.s]; return L.k === 'ml' ? `${t.n} to win` : L.k === 'sp' ? `${t.n} ${L.s === g.fav ? '-' : '+'}${g.sp}` : `${g.t[L.s].ps[0].n} ${L.o ? 'over' : 'under'} ${g.pr[L.s]} pts`; }
function bkLegOdds(g, L) { return L.k === 'ml' ? g.ml[L.s] : 1.87; }
function bkLegWon(g, L) { const r = g.res; if (!r) return null; const m = r.sc[L.s] - r.sc[1 - L.s]; if (L.k === 'ml') return m > 0; if (L.k === 'sp') return L.s === g.fav ? m > g.sp : m > -g.sp; const p = r.star[L.s]; return L.o ? p > g.pr[L.s] : p < g.pr[L.s]; }
function bkFinish(gi, r) { const B = book(), g = B.slate.games[gi]; g.res = r; save(); bkSettle(); }
function bkSettle() {
  const B = book(), sl = B.slate.slip; if (!sl || sl.done) return; const gs = B.slate.games; if (sl.legs.some(L => !gs[L.g].res)) return;
  const won = sl.legs.every(L => bkLegWon(gs[L.g], L)); sl.done = true; sl.won = won; const pay = won ? Math.round(sl.stake * sl.odds) : 0; sl.pay = pay;
  if (won) { S.vc += pay; vice().book += pay; vice().net += pay; B.w++; B.net += pay - sl.stake; if (sl.legs.length >= 3) deedDrip('hd_bookie', 'Cashed a 3-leg parlay'); } else { B.l++; B.net -= sl.stake; }
  save(); setTimeout(() => toast(won ? 'TICKET CASHED' : 'TICKET DEAD', won ? `+${pay} HC. Trey: "${pick(["I LET YOU HAVE ONE HIT. STRATEGY.", "READ MY REVIEWS, BRO. FIVE STARS."])}"` : 'Trey: "I HAD MONEY ON THAT, BRO." (Yours.)', won ? 'ach' : ''), 600);
}
function bkBuilds(t) { return t.ps.map(p => { const b = withSeed(p.seed, () => aiBuild(p.ovr, p.style)); b.name = p.n; return { b, ctrl: -1, ai: clamp((p.ovr - 50) / 45, 0.3, 1) }; }); }
function bkWatch(gi) {
  const B = book(), g = B.slate.games[gi], m = MODES[g.mi], tier = TIERS_COURT[clamp(Math.floor((Math.max(g.t[0].ovr, g.t[1].ovr) - 55) / 11), 0, 3)];
  uiClose(); const cfg = { mode: m, tier, teams: [bkBuilds(g.t[0]), bkBuilds(g.t[1])], boosts: [], ball: 'bl_std', seed: gi + 3, firstOff: Math.random() < 0.5 ? 0 : 1, spectate: true };
  cfg.onEnd = res => { enterWorld('hub', -4.8, -8.6, Math.PI);
    if (res.quit || !res.box) { const r = bkSim(g); bkFinish(gi, { sc: r.sc, star: [r.pts[0][0], r.pts[1][0]], sim: true }); toast('YOU LEFT EARLY', 'The game finished without you.'); }
    else { const star = s => { const b = res.box.find(x => x.n === g.t[s].ps[0].n && x.team === s); return b ? b.s.pts : 0; }; bkFinish(gi, { sc: res.score.slice(), star: [star(0), star(1)] }); }
    setTimeout(() => uiBook(), 300); };
  save(); document.body.dataset.state = 'match'; startMatch(cfg); uiHud(); const n0 = $('n0'); if (n0) n0.textContent = g.t[0].n.slice(0, 10);
}
function uiBook() {
  const B = book(), st = { legs: [], stake: 50 };
  const has = (g, k) => st.legs.find(L => L.g === g && L.k === k), tog = (g, k, s, o) => { const i = st.legs.findIndex(L => L.g === g && L.k === k); const same = i >= 0 && st.legs[i].s === s && st.legs[i].o === o; if (i >= 0) st.legs.splice(i, 1); if (!same && st.legs.length < 5) st.legs.push({ g, k, s, o }); sfx('ui'); rerender(); };
  const odds = () => Math.round(st.legs.reduce((a, L) => a * bkLegOdds(B.slate.games[L.g], L), 1) * 100) / 100;
  openPanel(() => {
    const SL = B.slate, sl = SL.slip, V = vice(); let h = `<div class="ph"><h2>TREY'S BOOK</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><p class="mu">"BRO. I'VE GOT A GUY. THE GUY IS ME." Pick winners, spreads and points. One pick is a single; more is a parlay: every one has to hit. Then watch the games, or let them run.</p>`;
    for (const g of SL.games) { const a = g.t[0], b = g.t[1], open = !sl && !g.res, sel = (k, s, o) => { const L = has(g.id, k); return L && L.s === s && L.o === o ? '' : 'alt'; };
      h += `<div class="card"><h3>${esc(a.n)} <span class="mu">${a.ovr}</span> vs ${esc(b.n)} <span class="mu">${b.ovr}</span></h3><p class="mu">${g.n} · first to ${g.to}${g.res ? ` · <b class="cy">FINAL ${g.res.sc[0]} — ${g.res.sc[1]}</b>${g.res.sim ? ' (sim)' : ''}` : ''}</p>`;
      if (open) { h += `<div style="margin-top:6px"><span class="mono" style="font-size:10px">WINNER</span> ${Btn(`${esc(a.n)} ${g.ml[0]}`, () => tog(g.id, 'ml', 0), 'sm ' + sel('ml', 0))} ${Btn(`${esc(b.n)} ${g.ml[1]}`, () => tog(g.id, 'ml', 1), 'sm ' + sel('ml', 1))}</div>`;
        h += `<div style="margin-top:4px"><span class="mono" style="font-size:10px">SPREAD</span> ${Btn(`${esc(g.t[g.fav].n)} -${g.sp}`, () => tog(g.id, 'sp', g.fav), 'sm ' + sel('sp', g.fav))} ${Btn(`${esc(g.t[1 - g.fav].n)} +${g.sp}`, () => tog(g.id, 'sp', 1 - g.fav), 'sm ' + sel('sp', 1 - g.fav))} <span class="mu">1.87</span></div>`;
        for (const s of [0, 1]) h += `<div style="margin-top:4px"><span class="mono" style="font-size:10px">${esc(g.t[s].ps[0].n.toUpperCase())} PTS</span> ${Btn('OVER ' + g.pr[s], () => tog(g.id, 'pr' + s, s, 1), 'sm ' + sel('pr' + s, s, 1))} ${Btn('UNDER ' + g.pr[s], () => tog(g.id, 'pr' + s, s, 0), 'sm ' + sel('pr' + s, s, 0))} <span class="mu">1.87</span></div>`; }
      else if (!g.res) h += `<div style="margin-top:6px">${Btn('WATCH IT', () => bkWatch(g.id), 'sm')} ${Btn('SIM IT', () => { const r = bkSim(g); bkFinish(g.id, { sc: r.sc, star: [r.pts[0][0], r.pts[1][0]], sim: true }); sfx('ui'); rerender(); }, 'sm alt')}</div>`;
      h += `</div>`; }
    if (sl) { h += `<div class="card sel"><h3>YOUR TICKET · ${sl.legs.length > 1 ? sl.legs.length + '-LEG PARLAY' : 'SINGLE'} · ${sl.stake} HC at ${sl.odds}</h3>` + sl.legs.map(L => { const g = SL.games[L.g], w = bkLegWon(g, L); return `<p>${w === null ? '○' : w ? '<span class="cy">✔</span>' : '<span class="warn">✘</span>'} ${esc(bkLegLabel(g, L))} <span class="mu">${bkLegOdds(g, L)}</span></p>`; }).join('') + (sl.done ? `<p class="${sl.won ? 'cy' : 'warn'}" style="font-size:16px;margin-top:6px">${sl.won ? 'CASHED: +' + sl.pay + ' HC' : 'DEAD TICKET'}</p>` : `<p class="mu" style="margin-top:6px">Pays ${Math.round(sl.stake * sl.odds)} HC if every pick hits.</p>`) + `</div>`;
      if (sl.done || SL.games.every(g => g.res)) h += Btn('NEW SLATE', () => { B.slate = bkSlate(); save(); sfx('uiok'); st.legs = []; rerender(true); }); }
    else if (SL.games.every(g => g.res)) h += Btn('NEW SLATE', () => { B.slate = bkSlate(); save(); rerender(true); });
    else { const o = odds(), room = viceRoom('book'), maxPay = Math.round(st.stake * o), okStake = S.vc >= st.stake, capped = room <= 0;
      h += `<div class="card sel"><h3>BET SLIP${st.legs.length > 1 ? ' · ' + st.legs.length + '-LEG PARLAY' : ''}</h3>` + (st.legs.length ? st.legs.map(L => `<p>${esc(bkLegLabel(SL.games[L.g], L))} <span class="mu">${bkLegOdds(SL.games[L.g], L)}</span></p>`).join('') : '<p class="mu">Nothing picked yet.</p>')
        + `<div style="margin-top:6px">${[25, 50, 100, 250, 500].map(s => Btn(s + '', () => { st.stake = s; rerender(); }, 'sm ' + (st.stake === s ? '' : 'alt'))).join(' ')}</div>`
        + (st.legs.length ? `<p style="margin-top:6px">Odds <b>${o}</b> · pays <b class="cy">${maxPay} HC</b></p>` : '') + `<div style="margin-top:6px">${Btn(capped ? 'TREY IS TAPPED OUT TODAY' : 'PLACE IT · ' + st.stake + ' HC', () => { S.vc -= st.stake; vice().book -= st.stake; vice().net -= st.stake; SL.slip = { legs: st.legs.map(L => ({ g: L.g, k: L.k.slice(0, 2), s: L.s, o: L.o })), stake: st.stake, odds: o, done: false }; save(); uiHud(); sfx('buy'); rerender(true); }, '', !st.legs.length || !okStake || capped)}</div></div>`; }
    h += `<p class="mu">Your record with Trey: ${B.w}-${B.l}, ${B.net >= 0 ? '+' : ''}${B.net} HC. Today: ${V.book >= 0 ? '+' : ''}${V.book}. He stops taking bets once you are up ${VICE_CAP.book} in a day.</p>`;
    return h + `</div>`;
  }, 'side', () => uiClose());
}

// ---------------- on the Block ----------------
function viceInit() {
  const cx = -12.9, cz = -0.2, g = grp(scene, cx, 0, cz);      /* against the west wall, between The Lab and the crib door: clear ground */
  ink(M(cyl(0.9, 0.9, 0.08, 16), toon('#1f6a3a'), 0, 0.78, 0, g), 1.03); ink(M(cyl(0.16, 0.3, 0.76, 8), toon('#2a2c33'), 0, 0.38, 0, g), 1.04);
  // sixteen holodice: your eight in front of the felt, Trey's eight behind it. The game is played on these.
  const T = W.bones = { you: [], him: [], cx, cz, on: false };
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const h = grp(g, (i - 3.5) * 0.46, 0, r === 0 ? 1.25 : -1.0); holodiceMesh(h); const e = W.holo[W.holo.length - 1]; e.table = true; e.val = 0; (r === 0 ? T.you : T.him).push(e); }
  const sg = sign("TREY'S BONES", 2.2, 0.4, '#ffb347', '#0a0a0e', { border: false }); sg.position.set(0, 2.5, -1.9); g.add(sg); for (const sx of [-1.1, 1.1]) M(cyl(0.03, 0.03, 2.5, 5), toon('#2a2c33'), sx, 1.25, -1.9, g);
  solid(cx - 2.0, cx + 2.0, cz - 1.3, cz + 1.5);
  const tb = withSeed(3003, () => aiBuild(70, 'general')); tb.name = 'TREY'; tb.worn = Object.assign(randomWorn(3), { head: 'hd_cap', face: 'f_shades', top: 't_hoodie' }); const n = addNpc(tb, cx, cz - 1.5, 0, 'idle', { still: true }); n.cast = 'trey'; n.amb = 'cross'; if (W.cast) W.cast.list.push(n);
  CAST_LINES.trey = TREY.hello.concat(['The dice are honest. I am merely charming.']);
  spot(cx, cz + 2.3, 1.8, "TREY (dice and bets)", () => uiDialog('TREY', pick(TREY.hello.concat(CAST_LINES.mark)), [["TREY'S BONES (dice)", () => uiBones(false)], ["TREY'S BOOK (bet on games)", () => uiBook()], ['Later']]));
}

// ---------------- at home ----------------
function bottieAtCrib() {
  if (!cribTier('bottie') || W.visit) return; const n = addNpc(bottieBuild(), 6.6, 15.4, -2.4, 'idle', { still: true }); n.cast = 'bottie'; n.amb = 'film'; W.cast = W.cast || { list: [], t: 0 }; W.cast.list.push(n);
  if (cribTier('bottie') > 1) { const b = grp(scene, 8.3, 0, 16.2); ink(M(box(1.5, 2.1, 1.5), toon('#23242a'), 0, 1.05, 0, b), 1.03); M(box(0.7, 1.1, 0.04), flat(0x33e0ff), 0, 1.2, 0.77, b); const s = sign('THE BOOTH', 1.3, 0.26, '#ff2d78', '#0a0a0e', { border: false }); s.position.set(0, 2.25, 0.78); b.add(s); if (W.solids) W.solids.push([7.5, 9.1, 15.4, 17]); }
  W.spots.push({ x: 6.2, z: 14.6, r: 1.7, label: 'BOTTIE', fn: () => uiBottieHome() });
}
const BOT_BARS = ['BZZT. {n} with the rock, {d} dunks on the clock, {a} ankles in a sock. GANG.', 'CLANK. {g} greens, no in-betweens, {n} on the feed by any means. GANG.', 'BZZT. {w} wins, where do I begin, {n} cooked your whole team again. GANG.', 'Born in the server, raised by the code, {n} got {p} points on the road. GANG.'];
function uiBottieHome() {
  const t = cribTier('bottie'), today = dayKey(), H = home(), L = S.life || {}, did = k => H.used['bot_' + k] === today;
  const bar = pick(BOT_BARS).replace('{n}', S.name).replace('{d}', L.dunks || 0).replace('{a}', L.ankles || 0).replace('{g}', L.greens || 0).replace('{w}', L.wins || 0).replace('{p}', L.pts || 0);
  uiDialog('BOTTIE', pick(CAST_LINES.bottie), [
    [did('track') ? 'TRACK DROPPED TODAY' : 'DROP A TRACK', () => { H.used.bot_track = today; const r = t > 1 ? 35 : 20; gainRep(r); save(); sfx('unlock'); uiDialog('BOTTIE', bar, [['+' + r + ' Respect']]); }, '', did('track')],
    [did('post') ? 'POSTED TODAY' : 'POST TO THE FEED', () => { H.used.bot_post = today; const v = t > 1 ? 180 : 80; S.vc += v; save(); sfx('coin'); uiClose(); toast('THE FEED', `"BZZT. THIS IS GOING ON THE FEED." +${v} HC`); }, '', did('post')],
    ['Later'],
  ]);
}
function homeUse2(k, done) {
  const H = home(), today = dayKey(), L = homeLevel().lvl, need = { grill: 3, minihoop: 2, bed: 1, bag: 1, holodice: 4 }[k], nm = { grill: 'COOKOUT', minihoop: 'TRICK SHOT', bed: 'NAP', bag: 'HEAVY BAG', holodice: 'BONES AT HOME' }[k];
  if (L < need) return toast(nm + ' IS LOCKED', `Crib level ${need} opens it. You are level ${L}: place more stuff.`);
  if (k === 'holodice') return uiBones(true);
  if (done) return toast(nm, 'Once a day. Come back tomorrow.');
  H.used[k] = today;
  if (k === 'grill') { gainRep(20); W.party = true; for (const n of W.npcs) if (n.homie || n.visitor) n.anim = 'dance'; toast('COOKOUT', 'Soy burgers for the block. +20 Respect, and everybody on the lot is dancing.'); sfx('unlock'); }
  else if (k === 'bag') { S.bxp.P += 25; while (S.bxp.P >= 100) { S.bxp.P -= 100; S.bp.P++; } toast('HEAVY BAG', 'Hand speed. +25 Playmaking smarts XP.'); sfx('bump'); }
  else if (k === 'bed') { S.boosts.push('nap'); toast('NAP', 'Slept like a subscription you forgot about. +8 Stamina next game.'); sfx('coin'); }
  else if (k === 'minihoop') { const ch = clamp(0.3 + ((S.attrs.three || 50) + (S.attrs.mid || 50)) / 500, 0.3, 0.7); let m = 0; const shots = [0, 0, 0].map(() => { const ok = Math.random() < ch; if (ok) m++; return ok ? 'SPLASH' : 'brick'; }); const v = m * 30 + (m === 3 ? 60 : 0); S.vc += v;
    uiDialog('TRICK SHOT', `Off the fence, off the roof, off the fridge: ${shots.join(' · ')}.` + (m === 3 ? ' Three for three.' : ''), [[v ? '+' + v + ' HC' : 'Tomorrow, then']]); sfx(m ? 'swish' : 'rim'); }
  save();
}
