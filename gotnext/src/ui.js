// GOT NEXT — menus and HUD (DOM over the 3D view)
'use strict';
const UI = { cur: null, handlers: [], focus: 0, navT: 0, stack: [] };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function on(fn) { UI.handlers.push(fn); return UI.handlers.length - 1; }
function Btn(label, fn, cls, dis) { return `<button class="btn ${cls || ''}" data-k="${on(fn)}" ${dis ? 'disabled' : ''}>${label}</button>`; }
function uiBusy() { return !!UI.cur || $('title').style.display === 'flex'; }
function openPanel(render, cls, onBack) { UI.openN = UI.stepN || 0; UI.openT = performance.now(); UI.lockMs = 200; UI.cur = { render, cls: cls || '', onBack }; UI.focus = 0; rerender(true); document.body.classList.add('busy');
  // a controller starts on the panel's main action (RESUME, PLAY…), else on the first thing that is not a tab or the close button
  const f = focusables(); let i = f.findIndex(e => e.closest('.pf') && !e.classList.contains('alt')); if (i < 0) i = f.findIndex(e => e.closest('.pf')); if (i < 0) i = f.findIndex(e => !e.closest('.tabs') && !e.closest('.ph')); UI.focus = Math.max(0, i); paintFocus(); }
function rerender(reset) {
  if (!UI.cur) return; const el = $('panel'), pb = el.querySelector('.pb'), sc = pb && !reset ? pb.scrollTop : 0, tb = el.querySelector('.tabs'), ts = tb && !reset ? tb.scrollLeft : 0;
  UI.handlers = []; el.className = UI.cur.cls; el.innerHTML = `<div class="pin">${UI.cur.render()}</div>`; el.style.display = 'block';
  const pb2 = el.querySelector('.pb'); if (pb2) pb2.scrollTop = sc; const tb2 = el.querySelector('.tabs'); if (tb2) tb2.scrollLeft = ts; paintFocus();
}
function uiClose() { if (UI.cur && UI.cur.onClose) { const f = UI.cur.onClose; UI.cur.onClose = null; f(); } UI.cur = null; $('panel').style.display = 'none'; $('panel').innerHTML = ''; document.body.classList.remove('busy'); if (W) { W.look = false; W.talk = null; } if (MT) MT.paused = false; uiHud(); }
function uiBack() { if (!UI.cur) return; sfx('ui'); if (UI.cur.onBack) UI.cur.onBack(); else uiClose(); }
function focusables() { const root = UI.cur ? $('panel') : $('title'); return Array.from(root.querySelectorAll('.btn:not([disabled]),input[type=range],input[type=text],select,.card[data-k],.sw[data-k],span[data-k]:not([data-k=""])')).filter(e => e.offsetParent !== null); }
// controller menus: the stick / d-pad moves to the nearest thing in that direction on screen (not just next in a list).
// Things in the same row (or column) always win over things off it: a wide key next to a short one used to lose to a
// key on the row below (RIGHT from DONE landed on N). The pinned footer button (RUN IT, HIT THE BLOCK) is the end of the
// page: DOWN reaches it only when nothing else is below, UP leaves it for the page, and nothing wraps round to the top.
function navDir(f, from, m) {
  const cur = f[from]; if (!cur) return 0; const a = cur.getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height / 2;
  const curPf = !!cur.closest('.pf'), horiz = m === 'L' || m === 'R'; let bestA = -1, sA = 1e9, bestO = -1, sO = 1e9;
  f.forEach((el, i) => { if (i === from) return; const r = el.getBoundingClientRect(); if (!r.width) return;
    if (!!el.closest('.pf') !== curPf) return;      /* the footer and the page are two lists; the fallbacks below join them */
    const dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy;
    const main = m === 'R' ? dx : m === 'L' ? -dx : m === 'D' ? dy : -dy; if (main <= 6) return;
    const over = horiz ? Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top) : Math.min(a.right, r.right) - Math.max(a.left, r.left);
    const cross = horiz ? Math.abs(dy) : Math.abs(dx);
    if (over > Math.min(a.height, r.height, a.width, r.width) * 0.3 || over > 8) { const sc = main + cross * 0.3; if (sc < sA) { sA = sc; bestA = i; } }
    else { const sc = main + cross * 2.2; if (sc < sO) { sO = sc; bestO = i; } } });
  let best = bestA >= 0 ? bestA : bestO;
  if (best < 0 && m === 'D' && !curPf) best = f.findIndex(e => e.closest('.pf') && !e.classList.contains('alt')), best = best < 0 ? f.findIndex(e => e.closest('.pf')) : best;      /* the bottom of the page: on to the footer */
  if (best < 0 && m === 'U' && curPf) { let lo = -1, ly = -1e9; f.forEach((el, i) => { if (el.closest('.pf')) return; const r = el.getBoundingClientRect(); if (r.width && r.bottom <= a.top + 2 && r.top > ly) { ly = r.top; lo = i; } }); best = lo; }      /* off the footer: the lowest thing on the page above it */
  return best < 0 ? from : best;
}
// LB / RB flip through the tabs at the top of a menu
function navTab(d) {
  const tb = Array.from($('panel').querySelectorAll('.tabs .btn')); if (!tb.length) return false;
  let k = tb.findIndex(b => b.classList.contains('sel')); if (k < 0) k = tb.findIndex(b => !b.classList.contains('alt')); if (k < 0) k = 0;
  tb[(k + d + tb.length) % tb.length].click(); const f = focusables(), first = f.findIndex(e => !e.closest('.tabs') && !e.closest('.ph')); UI.focus = Math.max(0, first); paintFocus(); sfx('ui'); return true;
}
function I_PAD() { const I = IN[0]; return !!(I && I.hasPad && (I.padAt || 0) >= (window.__kbAt || 0)); }
function paintFocus() { if (IS_TOUCH) return; const f = focusables(); f.forEach((b, i) => b.classList.toggle('focus', i === UI.focus)); }
addEventListener('click', e => { const b = e.target.closest('[data-em]'); if (!b) return; e.stopPropagation(); audioInit(); if (b.dataset.em === 'chat') chatOpen(); else emote(b.dataset.em); });
function uiInit() {
  const click = e => {
    const b = e.target.closest('[data-k]'); if (!b || b.disabled || b.tagName === 'INPUT') return; audioInit();
    const f = focusables().indexOf(b); if (f >= 0) UI.focus = f; const h = UI.handlers[+b.dataset.k]; if (h) h(b);
  };
  $('panel').addEventListener('click', click); $('title').addEventListener('click', click);
  $('panel').addEventListener('input', e => { const b = e.target.closest('[data-k]'); if (b) { const h = UI.handlers[+b.dataset.k]; if (h) h(b); } });
  $('prompt').addEventListener('click', () => { if (W && W.near && !uiBusy()) { audioInit(); sfx('uiok'); W.near.fn(); } });
}
// a small strip, bottom left, that says what the controller does right here (only while a controller is in use)
function padHint() {
  let el = $('padhint'); if (!el) { el = document.createElement('div'); el.id = 'padhint'; el.style.cssText = 'position:fixed;left:10px;bottom:26px;z-index:60;font:600 10px var(--m);letter-spacing:.05em;color:#ece9e2;background:rgba(10,10,14,.82);border-left:3px solid #ff2d78;padding:5px 9px;pointer-events:none;max-width:46vw;line-height:1.55'; document.body.appendChild(el); }
  const I = IN[0]; if (!I.hasPad || IS_TOUCH) { el.style.display = 'none'; return; }
  let t = '';
  if (UI.cur) t = 'Ⓐ SELECT · Ⓑ BACK · STICK / D-PAD MOVE' + ($('panel').querySelector('.tabs') ? ' · LB RB TABS' : '') + ' · ←→ ON A SLIDER OR LIST';
  else if (typeof BLD !== 'undefined' && BLD.on && W && W.build) t = (W.build.sel ? 'Ⓐ PLACE · Ⓧ ROTATE · ' + (W.build.pick ? 'Ⓨ STORE · LT SELL · ' : '') + 'Ⓑ PUT BACK' : 'Ⓐ PICK UP · Ⓑ DONE') + '<br>D-PAD ←→ CATALOG · LB RB CATEGORY · D-PAD ↑ LOOK · ↓ SETS · R3 TURN VIEW · STICK MOVE (RT FAST)';
  else if (MT) t = '';      /* in a game the controls strip (#keys) does it, with the real buttons */
  else if (W) t = (W.kind === 'crib' || W.kind === 'room') && !W.visit ? 'Ⓨ BUILD' : '';      /* the controls strip (#keys) shows the rest with real buttons; two bars overlapped */
  else if ($('title').style.display === 'flex') t = 'Ⓐ SELECT · D-PAD MOVE';
  if (el._t !== t) { el._t = t; el.innerHTML = t; } el.style.display = t ? 'block' : 'none';
  const top = !!t && !!UI.cur; if (el._top !== top) { el._top = top; el.style.bottom = '26px'; el.style.top = 'auto'; el.style.left = top ? 'auto' : '10px'; el.style.right = top ? '10px' : 'auto'; }      /* in a menu it sits bottom-right, clear of RUN IT / RUN IT BACK (bottom-left) and of the title */
}
function uiStep(dt) {
  UI.stepN = (UI.stepN || 0) + 1;
  const I = IN[0], f = focusables(); UI.navT -= dt; const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.type !== 'range';
  if (typing) { if (keys.Escape) document.activeElement.blur(); return; }
  const m = Math.abs(I.mx) > Math.abs(I.my) ? (I.mx > 0.6 ? 'R' : I.mx < -0.6 ? 'L' : '') : (I.my > 0.6 ? 'D' : I.my < -0.6 ? 'U' : '');
  if (!m) UI.navT = 0;
  if (m && UI.navT <= 0 && f.length) {
    UI.navT = 0.17; const cur = f[UI.focus];
    if (cur && cur.tagName === 'SELECT' && (m === 'L' || m === 'R')) { cur.selectedIndex = (cur.selectedIndex + (m === 'R' ? 1 : -1) + cur.options.length) % cur.options.length; cur.dispatchEvent(new Event('change', { bubbles: true })); sfx('ui'); }
    else if (cur && cur.type === 'range' && (m === 'L' || m === 'R')) { cur.value = +cur.value + (m === 'R' ? 1 : -1) * (+cur.step || 1); cur.dispatchEvent(new Event('input', { bubbles: true })); }
    else { UI.focus = navDir(f, Math.min(UI.focus, f.length - 1), m); paintFocus(); const n = f[UI.focus]; if (n && n.scrollIntoView) n.scrollIntoView({ block: 'nearest', inline: 'nearest' }); sfx('ui'); }
  }
  if (UI.cur && (I.lbP || I.rbP)) navTab(I.rbP ? 1 : -1);
  if (I.aP && UI.cur && ((UI.stepN || 0) - (UI.openN || 0)) / 60 < (UI.lockMs || 200) / 1000) I.aP = false;      /* a pass or steal still held from the game must not click the screen that just opened (it skipped the results). Counted in frames, not wall time: on a slow machine a deliberate press was eaten */
  if (I.aP && f[UI.focus] && !IS_TOUCH) { const e = f[UI.focus]; if (e.tagName === 'SELECT') { e.selectedIndex = (e.selectedIndex + 1) % e.options.length; e.dispatchEvent(new Event('change', { bubbles: true })); } else if (e.type === 'text') { if (e.dataset.padkb && I_PAD()) e.dispatchEvent(new CustomEvent('padkb', { bubbles: true })); else e.focus(); } else e.click(); I.aP = false; }      /* the press is used up: it must not also act in the world behind the menu */
  if (I.back && UI.cur) { uiBack(); I.back = false; }
  else if (I.start && UI.cur && $('panel').querySelector('.kbdone')) { $('panel').querySelector('.kbdone').click(); I.start = false; }      /* typing a name: START is done */
  else if (I.start && UI.cur && $('panel').querySelector('[data-start] .btn:not(.alt)')) { $('panel').querySelector('[data-start] .btn:not(.alt)').click(); I.start = false; }      /* START is the screen's main action (HIT THE BLOCK) */
  else if (I.start && UI.cur && UI.cur.startCloses && (UI.stepN || 0) - (UI.openN || 0) > 6) { uiBack(); I.start = false; }      /* START opened it, START closes it (on a pad only B did) */
}

// ---------- toasts ----------
function toast(big, small, cls) { const t = document.createElement('div'); t.className = 'toast ' + (cls || ''); t.innerHTML = esc(big) + (small ? `<small>${esc(small)}</small>` : ''); $('toasts').appendChild(t); setTimeout(() => t.remove(), cls === 'tip' ? 7500 : 3500); while ($('toasts').children.length > 3) $('toasts').firstChild.remove(); }

// ---------- HUD ----------
function project(x, y, z) { _v.set(x, y, z).project(camera); return [(_v.x * 0.5 + 0.5) * innerWidth, (-_v.y * 0.5 + 0.5) * innerHeight]; }
function hudShow(on) {
  $('hud').style.display = on ? 'block' : 'none'; if (!on || !MT) return;
  $('modeTag').textContent = MT.cfg.mode.n + (MT.practice ? '' : ' · ' + MT.cfg.tier.n + ' · ' + toLabel(MT.cfg.mode));
  $('sb').style.display = MT.practice ? 'none' : 'flex'; $('rackHud').style.display = MT.practice === 'rack' || MT.practice === 'drill' ? 'block' : 'none'; $('brav').style.display = MT.practice ? 'none' : 'block';
  $('n0').textContent = (S.name || 'YOU').slice(0, 10); $('flts').innerHTML = ''; $('call').className = '';
}
function hudCall(big, small, col, dur) { const c = $('call'); c.firstElementChild.textContent = big; c.lastElementChild.textContent = small || ''; c.firstElementChild.style.color = col || '#fff'; c.className = ''; void c.offsetWidth; c.style.animationDuration = (dur || 1.2) + 's'; c.className = 'go'; }
let fbT = null;
function hudFb(txt, col) { const f = $('fb'); f.textContent = txt; f.style.color = col || '#fff'; f.style.opacity = 1; clearTimeout(fbT); fbT = setTimeout(() => f.style.opacity = 0, 1300); }
// words over a player's head. They stack instead of landing on top of each other, and no player carries more than three at once
function hudFloat(p, txt, col) { const now = performance.now(); p.fl = (p.fl || []).filter(t => now - t < 900); if (p.fl.length >= 3) return; const lvl = p.fl.length; p.fl.push(now); const [x, y] = project(p.x, p.H + 0.5 + p.y, p.z); const d = document.createElement('div'); d.className = 'flt'; d.textContent = txt; d.style.cssText = `left:${x}px;top:${y - lvl * 19}px;color:${col || '#fff'}`; $('flts').appendChild(d); setTimeout(() => d.remove(), 1100); }
function hudMatch() {
  const M_ = MT, me = M_.me; $('s0').textContent = M_.score[me.team]; $('s1').textContent = M_.score[1 - me.team]; $('clock').textContent = Math.max(0, Math.ceil(M_.clock));
  $('stam').firstElementChild.style.width = me.stam + '%';
  { const ms = $('mstam'), show = me.stam < 99 && M_.phase === 'live' && !M_.spectate && !M_.hl; if (show) { const [sx, sy] = project(me.x, 0.02, me.z); ms.style.display = 'block'; ms.style.left = sx + 'px'; ms.style.top = (sy + 30) + 'px'; ms.firstElementChild.style.width = Math.max(0, me.stam) + '%'; ms.className = me.stam < 15 ? 'out' : me.stam < 35 ? 'low' : ''; } else ms.style.display = 'none'; }      /* stamina under your feet, where you are looking, while it matters */ const bv = $('brav'); bv.firstElementChild.style.width = (me.brav * 100) + '%'; bv.classList.toggle('on', me.bravT > 0);
  const sh = M_.locals.find(h => h.st === 'shoot' && !h.shot.floater), mt = $('meter');
  if (sh && S.set.meter) {
    const [x, y] = project(sh.x, sh.H * 0.6 + sh.y, sh.z); const u = sh.t / (sh.shot.rel * 1.55), z = 1 / 1.55;
    mt.style.display = 'block'; mt.style.left = (x + 34) + 'px'; mt.style.top = (y - 60) + 'px';
    const rel = sh.shot.released; if (!rel) { $('meterFill').style.height = Math.min(100, u * 100) + '%'; $('meterFill').style.background = ''; } else $('meterFill').style.background = MT.B.green ? '#3dffa0' : '#ff8a3c';
    { const wz = clamp(shotWin(sh, contestOn(sh), nAtt(sh, sh.shot.kind === 'three' ? 'three' : sh.shot.kind === 'mid' ? 'mid' : 'close')) * z * 100, 1.2, 14); $('meterZone').style.bottom = (z * 100 - wz) + '%'; $('meterZone').style.height = (wz * 2) + '%'; }      /* the real window, shrinking with the hand in your face */
  } else mt.style.display = 'none';
  $('clear').style.display = M_.needClear && M_.off === me.team && M_.phase === 'live' ? 'block' : 'none';
  if (M_.drill) $('rackHud').innerHTML = M_.drill.id === 'horse' ? horseHud() : drillHud();
  else if (M_.practice === 'rack') $('rackHud').innerHTML = `<span class="ye">${M_.rackScore}</span> PTS<br><span style="font-size:20px">${Math.max(0, Math.ceil(M_.rackT))}s</span>`;
  if (IS_TOUCH) {
    const has = M_.B.holder === me, offb = M_.off === me.team;
    // the gold switch lets go by itself when the situation it was for is over: the ball changes hands, a shot goes up, play stops
    if (touch.lt) { const sk = (has ? 'b' : offb ? 'o' : 'd') + (M_.B.state === 'shot' || M_.B.state === 'loose' ? 's' : ''); if (touch.ltK === undefined) touch.ltK = sk; if (sk !== touch.ltK || M_.phase !== 'live' || me.st === 'shoot' || me.st === 'finish') { touch.lt = false; touch.ltK = undefined; $('tLT').classList.remove('on'); } } else touch.ltK = undefined;
    const a = has ? 'PASS' : offb ? 'CALL' : M_.arcade ? 'SHOVE' : 'STEAL', b = has ? 'SHOOT' : 'JUMP', h = has ? (me.live === 'dead' ? 'DRIBBLE USED · PASS · SHOOT · FAKE · STICK PIVOTS' : '↓ HOLD SHOOT · ↑ DRIVE · ←→ MOVES') : offb ? 'SKILL STICK' : '↑ HANDS UP · ↓ ' + (M_.arcade ? 'SHOVE' : 'STEAL') + ' · JUMP AT THE RELEASE TO CONTEST';
    { const up = !has && (M_.B.state === 'shot' || (M_.B.state === 'loose' && M_.B.rebound)), l = up && !M_.arcade ? 'BOX OUT' : has ? 'POST' : offb ? (M_.arcade ? 'SWING' : 'SCREEN') : M_.arcade ? 'SWING' : 'BODY UP', e = $('tLT'); if (e && e.textContent !== l) e.textContent = l; }
    { const mates = M_.P.some(q => q.team === me.team && q !== me), canPick = has && M_.P.some(q => q.team === me.team && q !== me && !q.user), canSw = !has && !offb && mates, e = $('tPK'); e.classList.toggle('off', !(M_.phase === 'live' && (canPick || canSw))); const l = canSw ? 'SWITCH' : 'PICK'; if (e.textContent !== l) e.textContent = l; }
    if ($('tA').textContent !== a) $('tA').textContent = a; if ($('tB').textContent !== b) $('tB').textContent = b; if ($('hintR').textContent !== h) $('hintR').textContent = h;
  }
}
function uiHud() {
  if (!S) return; $('wvc').textContent = S.vc.toLocaleString(); const r = rankOf(S.rep); $('wrank').textContent = 'RANK · ' + RANKS[r].n;
  const nx = RANKS[r + 1]; $('repbar').firstElementChild.style.width = (nx ? (S.rep - RANKS[r].rep) / (nx.rep - RANKS[r].rep) * 100 : 100) + '%';
  $('tA').textContent = 'GO'; $('hintR').textContent = 'LOOK';
  const on = NET.room && NET.connected ? netOthers().length : -1, oc = $('wonline'); oc.style.display = on >= 0 ? '' : 'none'; if (on >= 0) oc.innerHTML = (on ? `<b>${on}</b> online with you` : 'online · nobody else here') + (NET.crew ? ` · crew of <b>${NET.crew.m.length + 1}</b>` : NET.inCrew ? ' · in a crew' : '');
  keysHint(true);
}
// the controls strip, bottom left: the buttons of whatever you are holding (controller or keyboard), and only what they do right now
const KC = { A: '<i class="kc ka">A</i>', B: '<i class="kc kb">B</i>', X: '<i class="kc kx">X</i>', Y: '<i class="kc ky">Y</i>' }, kk = t => `<i class="kc">${t}</i>`;
function keysHint(force) {
  const el = $('keys'); if (!el) return; const I = IN[0], pad = !!(I && I.hasPad && (I.padAt || 0) >= (window.__kbAt || 0));
  let ctx = 'world', t = '';
  if (MT && MT.me && !MT.replay) { const me = MT.me, B = MT.B; ctx = MT.phase !== 'live' ? 'dead' : B.holder === me ? 'ball' : MT.off === me.team && B.state !== 'loose' ? 'off' : B.state === 'loose' ? 'loose' : 'def'; if (MT.arcade && ctx === 'def') ctx = 'defR'; }
  const key = ctx + (pad ? 'p' : 'k'); if (!force && el._k === key) return; el._k = key;
  const P = pad ? { mv: 'LEFT STICK', spr: kk('RT'), shoot: KC.X, pass: KC.A, steal: KC.X, block: KC.Y, moves: 'RIGHT STICK', lt: kk('LT'), lb: kk('LB'), menu: kk('START'), look: 'RIGHT STICK', act: KC.A }
    : { mv: kk('WASD'), spr: kk('SHIFT'), shoot: kk('SPACE'), pass: kk('E'), steal: kk('E'), block: kk('SPACE'), moves: kk('IJKL'), lt: kk('Q'), lb: kk('R'), menu: kk('P'), look: kk('J') + kk('L'), act: kk('E') };
  const g = (b, w) => `<span>${b} ${w}</span>`;
  if (ctx === 'world') t = [g(P.mv, 'move'), g(P.spr, 'run'), g(P.act, 'talk / use'), g(P.look, 'look'), g(P.menu, 'my player')].join('');
  else if (ctx === 'ball') t = [g(P.shoot, 'shoot: hold, let go at the top'), MT && MT.cfg.lot ? g(P.pass, 'put it down (back to the Block)') : g(P.pass, pad ? 'pass (aim with the stick)' : 'pass (aim with WASD)'), g(P.spr, 'turbo'), g(P.moves, 'moves · ↙↘ step-back · roll it: spin'), g(P.lt, 'post up'), MT && MT.cfg.lot ? '' : g(P.lb, 'call a screen')].join('');
  else if (ctx === 'off') t = [g(P.pass, 'call for it'), g(P.block, 'jump'), g(P.moves, 'cut'), g(P.lb, 'set a screen'), g(P.lt, 'box out'), g(P.spr, 'sprint')].join('');
  else if (ctx === 'def' || ctx === 'defR') t = [g(P.steal, ctx === 'defR' ? 'shove (hold LT: punch)' : 'steal'), g(P.block, 'jump / contest'), pad ? g(P.moves, '↑ both hands · ↖↗ one hand · ↙↘ low') : '', g(P.lt, 'body up'), g(P.lb, 'switch'), g(P.spr, 'sprint')].join('');
  else if (ctx === 'loose') t = [g(P.mv, 'get to it'), g(P.steal, 'dive'), g(P.block, 'jump for it')].join('');
  else t = [g(P.menu, 'pause')].join('');
  el.innerHTML = t;
}
function vcLine() { return `<span class="chip" style="margin:0">HC <b>${S.vc.toLocaleString()}</b></span>`; }

// ---------- title ----------
function uiTitle() {
  document.body.dataset.state = 'title'; $('title').style.display = 'flex'; document.body.classList.add('busy'); UI.handlers = []; UI.focus = 0;
  $('seasonTag').textContent = `RUN ${String(BRAND.season.no).padStart(2, '0')} · ${BRAND.season.name}`; $('titleLine').textContent = BRAND.line;
  $('tickerTxt').innerHTML = (BRAND.ticker.join(' <b>//</b> ') + ' <b>//</b> ').repeat(4) + 'v' + VERSION;
  $('titleBtns').innerHTML = (S.created ? Btn('Continue · ' + esc(S.name), () => { hideTitle(); enterWorld('hub', 0, 9, Math.PI); }) : '') + Btn(S.created ? 'New player' : 'Build your player', () => {
    const go = () => { if (S.created) S = newSave(); hideTitle(); uiBuilder(); };
    if (S.created) uiDialog('START OVER', 'Start over? This erases your player, drip, crib and Respect. It is only kept once you finish the new build.', [['Erase and start over', go, 'red'], ['Keep my player', () => { uiClose(); uiTitle(); }, 'alt']]); else go();
  }, S.created ? 'alt' : '') + Btn('Dev room', () => uiDev('title'), 'alt');
  paintFocus();
}
function hideTitle() { $('title').style.display = 'none'; if (!UI.cur) document.body.classList.remove('busy'); sfx('uiok'); }

// ---------- builder ----------
function capBars(build, attrs) {
  const caps = capsFor(build); let h = '';
  for (const c in CATS) {
    h += `<div class="cat" style="color:${CATS[c][1]}">${CATS[c][0]}</div>`;
    for (const a of ATTRS) if (a.cat === c) { const v = attrs ? attrs[a.id] : null; h += `<div class="row" style="margin-bottom:3px"><div class="an">${a.n}</div><div class="ab"><i style="width:${caps[a.id]}%;background:${CATS[c][1]};opacity:${attrs ? 0.3 : 1}"></i>${attrs ? `<i style="width:${v}%;background:${CATS[c][1]}"></i>` : ''}</div><div class="av">${attrs ? v + '<small>/' + caps[a.id] + '</small>' : caps[a.id]}</div></div>`; }
  }
  return h;
}
function uiBuilder(opts) {
  opts = opts || {}; const T = { name: S.name === 'ROOKIE' ? '' : S.name, build: JSON.parse(JSON.stringify(S.build)), hair: S.worn.hair };
  document.body.dataset.state = 'create'; studioScene();
  const rig = () => studioRig({ build: T.build, worn: Object.assign({}, S.worn, { hair: T.hair }) });
  const lbs = () => Math.round(150 + (T.build.body.h - 67) * 5.6 + T.build.body.w * 32);
  const body = () => `<label class="sl">HEIGHT <b>${fmtH(T.build.body.h)}</b></label><label class="sl">WEIGHT <b>${lbs()} lbs</b></label><label class="sl">WINGSPAN <b>${fmtH(Math.round(T.build.body.h + 2 + T.build.body.s * 5))}</b></label>`;
  rig();
  openPanel(() => {
    const st = STYLE[T.build.style];
    let h = `<div class="ph"><h2>BUILD YOUR PLAYER</h2></div><div class="pb">`;
    h += `<div class="cat">NAME ON THE JERSEY</div><input type="text" id="bname" maxlength="12" placeholder="YOUR NAME" value="${esc(T.name)}" data-padkb="1">`;
    if (T.kb) {      // a controller has no keys: letters on the screen, picked with the stick and A
      const add = c => () => { if ((T.name || '').length < 12) T.name = (T.name || '') + c; sfx('ui'); rerender(); };
      const cell = (html, span) => `<div style="grid-column:span ${span || 1};display:grid">${html}</div>`;
      h += `<div class="card padkb" style="display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:4px">` + cell(Btn('DONE ✓ (START)', () => { T.kb = false; rerender(); }, 'sm kbdone'), 3) + cell(Btn('⌫ DELETE', () => { T.name = (T.name || '').slice(0, -1); rerender(); }, 'sm alt'), 3) + cell(Btn('SPACE', add(' '), 'sm alt'), 2)
        + cell(Btn('RANDOM', () => { T.name = pick(['HOOPER', 'BUCKETS', 'SPLASH', 'DIME', 'HANDLES', 'BOARDMAN', 'STREETS', 'MIDRANGE', 'CROSSUP']) + Math.floor(Math.random() * 90 + 10); rerender(); }, 'sm alt', !!(T.name || '').trim()), 2)
        + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map(c => cell(Btn(c, add(c), 'sm alt'))).join('') + `</div>`; }      /* a fixed 10-wide grid: rows and columns stay put while you type (RANDOM greys out instead of vanishing and shifting the keys), so the d-pad moves like a keyboard */      /* DONE and DELETE first (easy to reach), RANDOM only while the name is empty (it overwrote a typed one) */
    h += `<div class="cat">PLAYSTYLE <span class="mu" style="text-transform:none;letter-spacing:.02em">— sets what you can become</span></div><div class="grid">` + STYLES.map(s => `<div class="card ${s.id === T.build.style ? 'sel' : ''}" data-k="${on(() => { T.build.style = s.id; sfx('ui'); rig(); rerender(); })}"><h3>${s.n}</h3><p>${s.tag}</p></div>`).join('') + `</div>`;
    h += `<div class="cat">ORIGIN <span class="mu" style="text-transform:none;letter-spacing:.02em">— where 2145 America grew you</span></div><div class="grid">` + ORIGINS.map(o => `<div class="card ${o.id === T.build.origin ? 'sel' : ''}" data-k="${on(() => { T.build.origin = o.id; sfx('ui'); rerender(); })}"><h3>${o.n}</h3><p>${o.d}</p><p class="buff">${o.perk}</p></div>`).join('') + `</div>`;
    h += `<div class="cat">PERSONALITY <span class="mu" style="text-transform:none;letter-spacing:.02em">— how you talk, and a small edge. Pick one now; two more slots open at Tape Deck</span></div><div class="grid">` + PERS_BASE.map(t => `<div class="card ${t.id === ((T.build.pers || ['quiet'])[0]) ? 'sel' : ''}" data-k="${on(() => { T.build.pers = [t.id, '', '']; sfx('ui'); rerender(); })}"><h3>${t.n}</h3><p style="color:var(--go)">${t.d}</p><p class="mu">“${esc(t.t.w[0])}”</p></div>`).join('') + `</div>`;
    h += `<div class="cat">BODY <span class="mu" style="text-transform:none;letter-spacing:.02em">— every inch moves your caps</span></div><div class="card"><div id="bodyLbl" style="display:none"></div>`;
    h += `<label class="sl">HEIGHT <b id="lh">${fmtH(T.build.body.h)}</b></label><input type="range" min="${H_MIN}" max="${H_MAX}" step="1" value="${T.build.body.h}" data-k="${on(el => { T.build.body.h = +el.value; $('lh').textContent = fmtH(T.build.body.h); upd(); })}">`;
    h += `<label class="sl">WEIGHT <b id="lw">${lbs()} lbs</b></label><input type="range" min="-10" max="10" step="1" value="${Math.round(T.build.body.w * 10)}" data-k="${on(el => { T.build.body.w = el.value / 10; upd(); })}">`;
    h += `<label class="sl">WINGSPAN <b id="ls">${fmtH(Math.round(T.build.body.h + 2 + T.build.body.s * 5))}</b></label><input type="range" min="-10" max="10" step="1" value="${Math.round(T.build.body.s * 10)}" data-k="${on(el => { T.build.body.s = el.value / 10; upd(); })}"></div>`;
    h += `<div class="cat">LOOK</div><div class="card">` + SKINS.map((c, i) => `<span class="sw ${i === T.build.skin ? 'sel' : ''}" style="background:${c}" data-k="${on(() => { T.build.skin = i; rig(); rerender(); })}"></span>`).join('') + `<div style="margin-top:8px">` + DRIP.filter(d => d.slot === 'hair' && d.src === 'start').map(d => Btn(d.n, () => { T.hair = d.id; rig(); rerender(); }, 'sm ' + (T.hair === d.id ? '' : 'alt'))).join(' ') + `</div></div>`;
    h += `<div class="cat">ATTRIBUTE CAPS <span class="mu" style="text-transform:none;letter-spacing:.02em">— ${st.n}, max potential</span></div><div class="card" id="capbox">${capBars(T.build)}</div>`;
    h += `</div><div class="pf" data-start="1">${S.created ? '' : `<span class="mu" style="display:block;margin-bottom:4px;font-size:11px">YOU START WITH <b class="ye">${(S.vc + (ORIGIN[T.build.origin].k === 'vc' ? 400 : 0)).toLocaleString()} HC</b>${ORIGIN[T.build.origin].k === 'vc' ? ' (600 + 400 from ' + esc(ORIGIN[T.build.origin].n) + ')' : ''}</span>`}${Btn('HIT THE BLOCK <small style="opacity:.7">(START)</small>', () => {
      if (!(($('bname').value || T.name || '').trim()) && !T.warned && I_PAD()) { T.warned = true; T.kb = true; toast('NAME YOUR PLAYER', 'Or press HIT THE BLOCK again to go as ROOKIE.'); rerender(); if (!T.kb) $('bname').focus(); return; }      /* no more accidental "Nobody" */
      const nm = (($('bname').value || T.name || '')).trim().toUpperCase().replace(/[<>&"]/g, '').slice(0, 12) || 'ROOKIE';
      S.name = nm; S.build = T.build; S.worn.hair = T.hair; S.attrs = startAttrs(S.build); if (!S.created && ORIGIN[S.build.origin].k === 'vc') S.vc += 400; S.created = true; save();
      uiClose(); sfx('unlock'); enterWorld('hub', 0, 9, Math.PI); if (opts.prev !== undefined) toast('NEW BUILD', `${S.name} is on the Block. Switch builds in MY PLAYER → BUILDS.`, 'rank'); else toast('WELCOME TO THE BLOCK', 'Walk to THE CAGES and call next. Fiends will ask for HC.', 'rank');
    })}${opts.prev !== undefined ? Btn('CANCEL', () => { S.slots.splice(S.slot, 1); S.slot = opts.prev; slotLoad(S.slots[opts.prev]); save(); uiClose(); enterWorld('hub', 0, 9, Math.PI); }, 'alt') : ''}</div>`;
    return h;
  }, 'side', () => { });
  function upd() { $('lw').textContent = lbs() + ' lbs'; $('ls').textContent = fmtH(Math.round(T.build.body.h + 2 + T.build.body.s * 5)); $('capbox').innerHTML = capBars(T.build); rig(); }
  $('panel').addEventListener('change', e => { if (e.target.id === 'bname') T.name = e.target.value; });
  $('panel').addEventListener('input', e => { if (e.target.id === 'bname') T.name = e.target.value; });
  $('panel').addEventListener('padkb', e => { if (e.target.id === 'bname') { T.kb = true; rerender(); const f = focusables(), i = f.findIndex(b => b.closest && b.closest('.padkb')); if (i >= 0) { UI.focus = i; paintFocus(); } } });
  { const f = focusables(), i = f.findIndex(b => b.id === 'bname'); if (i >= 0) { UI.focus = i; paintFocus(); } }      /* start on the name, not on HIT THE BLOCK (a second A press made "Nobody") */
  void body;
}

// ---------- MyPLAYER ----------
function buffTotals() { const t = {}; for (const s in S.worn) { const d = DRIPS[S.worn[s]]; if (d && d.buff) for (const k in d.buff) t[k] = (t[k] || 0) + d.buff[k]; } return t; }
function header() {
  const r = rankOf(S.rep), nx = RANKS[r + 1];
  return `<div class="hdr"><div class="ovr">${ovrOf(S.attrs)}</div><div><div class="f" style="font-size:20px">${esc(S.name)}</div><div class="sub">${STYLE[S.build.style].n} · ${fmtH(S.build.body.h)} · <span class="cy">${RANKS[r].n}</span> · ${S.rep.toLocaleString()}${nx ? ' / ' + nx.rep.toLocaleString() : ''} respect</div></div><div style="flex:1"></div>${vcLine()}</div>`;
}
function uiPlayer(tab) {
  const st = { tab: tab || 'attrs' };
  const tabs = [['builds', 'BUILDS'], ['attrs', 'ATTRIBUTES'], ['badges', 'STREET SMARTS'], ['moves', 'MOVES'], ['pers', 'PERSONALITY'], ['crew', 'CREW'], ['ach', 'TROPHIES'], ['mag', 'CAGE MAG'], ['road', 'RANK ROAD'], ['opt', 'OPTIONS']];
  openPanel(() => {
    UI.cur.live = st.tab === 'crew';
    let h = `<div class="ph"><h2>MY PLAYER</h2>${Btn('✕', uiClose, 'alt sm')}</div>` + header() + `<div class="tabs">` + tabs.map(t => Btn(t[1], () => { st.tab = t[0]; sfx('ui'); rerender(true); }, st.tab === t[0] ? 'sel' : 'alt')).join('') + `</div><div class="pb">`;
    if (st.tab === 'builds') {
      h += `<p class="mu" style="margin:2px 0 8px">Up to ${MAX_SLOTS} builds. Each has its own body, attributes, street smarts, moves and fit. HC, Respect, the drip and moves you own, and your crib are shared. Online games use the active build.</p>`;
      S.slots[S.slot] = slotSnap();
      if (S.devBak) h += `<p class="warn">Dev Room maxed player is on. Restore your real player in the Dev Room before switching builds.</p>`;
      S.slots.forEach((t, i) => { const on = i === S.slot, st2 = STYLE[t.build.style] || {};
        h += `<div class="card"${on ? ' style="border-color:var(--go)"' : ''}><div class="row"><div><b>${t.name}</b> <span class="mu">· ${st2.n || ''} · ${fmtH(t.build.body.h)} · OVR ${ovrOf(Object.keys(t.attrs).length ? t.attrs : startAttrs(t.build))}</span>${on ? ' <span class="tag on">ACTIVE</span>' : ''}</div><div>`
          + (on ? '' : Btn('PLAY AS', () => { if (slotSwitch(i)) { sfx('unlock'); toast('BUILD SWITCHED', 'You are ' + S.name + ' now.'); if (W && W.me) { worldPlayerRig(); if (typeof netBuildChanged === 'function') netBuildChanged(); } } rerender(); }, 'sm') + ' ' + Btn('DELETE', () => { if (confirm('Delete ' + t.name + '? This cannot be undone.')) { slotDelete(i); sfx('no'); rerender(); } }, 'alt sm'))
          + `</div></div></div>`; });
      if (S.slots.length < MAX_SLOTS) h += Btn('+ NEW BUILD', () => { if (MT) return; const prev = S.slot, i = slotNew(); if (i < 0) return; S.slot = i; slotLoad(S.slots[i]); uiClose(); uiBuilder({ prev }); });
    } else if (st.tab === 'attrs') {
      const caps = capsFor(S.build), bf = buffTotals();
      const buy = (id, n) => { let c = 0, k = 0; for (let i = 0; i < n && S.attrs[id] < caps[id]; i++) { const p = attrCost(S.attrs[id]); if (S.vc < p) break; S.vc -= p; S.attrs[id]++; c += p; k++; } if (k) { sfx('coin'); save(); checkAch(); } else sfx('no'); rerender(); };
      for (const c in CATS) {
        h += `<div class="cat" style="color:${CATS[c][1]}">${CATS[c][0]}</div>`;
        for (const a of ATTRS) if (a.cat === c) {
          const v = S.attrs[a.id], cap = caps[a.id], cost = attrCost(v), mx = v >= cap;
          h += `<div class="card" style="padding:6px 9px"><div class="row"><div class="an"><b>${a.n}</b></div><div class="ab"><i style="width:${cap}%;background:${CATS[c][1]};opacity:.28"></i><i style="width:${v}%;background:${CATS[c][1]}"></i></div><div class="av">${v}${bf[a.id] ? `<span class="buff">+${bf[a.id]}</span>` : ''}<small>/${cap}</small></div>${mx ? '<span class="tag on">MAX</span>' : Btn('+1 · ' + cost, () => buy(a.id, 1), 'sm', S.vc < cost) + (() => { let t = 0, k = 0, vv = v; while (k < 5 && vv < cap) { t += attrCost(vv); vv++; k++; } return k > 1 ? Btn('+' + k + ' · ' + t, () => buy(a.id, k), 'sm alt', S.vc < t) : ''; })()}</div><p>${a.d}</p></div>`;
        }
      }
    } else if (st.tab === 'badges') {
      h += `<p class="mu">Earn smarts XP by doing the thing in real games. 100 XP = 1 point in that category. Higher tiers need the attribute to back it up.</p>`;
      for (const c of ['F', 'S', 'P', 'D']) {
        h += `<div class="cat" style="color:${CATS[c][1]}">${CATS[c][0]} · <span class="ye">${S.bp[c]} PTS</span> <span class="mu">· ${Math.floor(S.bxp[c])}/100 XP</span></div><div class="grid">`;
        for (const b of BADGES) if (b.cat === c) {
          const t = S.badges[b.id] || 0, nxt = t + 1, need = nxt <= 4 ? b.req[nxt] : 0, ok = nxt <= 4 && S.attrs[b.req[0]] >= need && S.bp[c] >= TIER_COST[nxt];
          h += `<div class="card"><h3 style="color:${TIER_COL[t] === '#555' ? 'var(--bone)' : TIER_COL[t]}">${b.n}</h3><div class="pips">${[1, 2, 3, 4].map(i => `<i style="background:${i <= t ? TIER_COL[i] : 'var(--line)'}"></i>`).join('')}<span class="tag mu">${TIERS[t]}</span></div><p>${b.d}</p>`;
          h += nxt > 4 ? `<p class="cy">Iced out. Nothing left to prove.</p>` : `<div class="row" style="margin-top:5px"><p class="g" style="color:${S.attrs[b.req[0]] >= need ? 'var(--go)' : 'var(--warn)'}">${TIERS[nxt]}: needs ${ATTR[b.req[0]].n} ${need}</p>${Btn(TIER_COST[nxt] + ' PT', () => { S.bp[c] -= TIER_COST[nxt]; S.badges[b.id] = nxt; sfx('unlock'); toast(b.n + ' → ' + TIERS[nxt], b.d, 'ach'); save(); rerender(); }, 'sm', !ok)}</div>`;
          h += `</div>`;
        }
        h += `</div>`;
      }
    } else if (st.tab === 'moves') {
      const r = rankOf(S.rep);
      { const A = S.anim || (S.anim = JSON.parse(JSON.stringify(animProfile({ mine: true, name: S.name, build: S.build })))), bb = (list, key) => list.map(([k, n]) => Btn(n, () => { A[key] = k; save(); sfx('ui'); if (W && W.me) worldPlayerRig(); rerender(); }, 'sm ' + ((A[key] || '') === k ? '' : 'alt'))).join(' ');      /* free: how the jumper is put together */
        h += `<div class="cat">BASE PACKAGE <span class="mu" style="text-transform:none;letter-spacing:.02em">— free, on every player from day one. The game picks from it by the situation and never the same one twice running</span></div><div class="card"><p><b>Layups:</b> right or left hand by the side you come from · finger roll · over the top · up and under · scoop · power · wrong foot · 360 · baseline reverse · euro step (stick sideways) · hop step (let go of the stick)</p><p><b>Dunks</b> (Dunk 45+ with a clear run, or 55+): one hand · leaner · two hands · two hands and hang · tip slam on a putback · cocked back and hammer from Dunk 68</p><p><b>Post</b> (LT, or tap the gold button on a phone): drop step · hook · jump hook · fadeaway · turnaround</p><p><b>Jumper:</b> fade, drift and lean-back by the coverage · side step · hop · four gathers, four follow-throughs, three landings</p></div>`;
        h += `<div class="cat">JUMP SHOT BASES <span class="mu" style="text-transform:none;letter-spacing:.02em">— free. Looks only: timing comes from the jumper you equip below</span></div><div class="card"><h3>LOWER <span class="mu">feet, knees, hips</span></h3><div>${bb(LOWER_BASES, 'lower')}</div><h3 style="margin-top:8px">UPPER <span class="mu">the release</span></h3><div>${bb(UPPER_BASES, 'upper')}</div><h3 style="margin-top:8px">RUN STYLE</h3><div>${bb(RUN_STYLES, 'run')}</div></div>`; }
      const sec = (title, list, slot, needAttr) => {
        h += `<div class="cat">${title}</div><div class="grid">`;
        for (const m of list) {
          const own = S.moves.owned.includes(m.id), eq = S.moves[slot] === m.id, price = shopPrice(m.cost), lockR = m.rank > r, lockA = needAttr && m.need > S.attrs[needAttr];
          h += `<div class="card ${eq ? 'sel' : ''} ${!own && (lockR || lockA) ? 'lock' : ''}"><h3>${m.n}</h3><p>${m.d || ''}</p><div style="margin-top:5px">` +
            (eq ? `<span class="tag on">EQUIPPED</span>` : own ? Btn('EQUIP', () => { S.moves[slot] = m.id; sfx('uiok'); save(); rerender(); if (W) worldPlayerRig(); }, 'sm') :
              lockR ? `<span class="tag or">RANK: ${RANKS[m.rank].n}</span>` : lockA ? `<span class="tag or">NEEDS ${ATTR[needAttr].n} ${m.need}</span>` :
                Btn('BUY · ' + price + ' HC', () => { S.vc -= price; S.moves.owned.push(m.id); S.moves[slot] = m.id; sfx('buy'); toast('NEW ANIMATION', m.n); save(); rerender(); }, 'sm', S.vc < price)) + `</div></div>`;
        }
        h += `</div>`;
      };
      h += `<p class="mu">Animations come in <b>packages</b>: you wear one of each kind and the game rotates through it by the situation, never the same one twice running.</p>` + packsUI(r);
      h += `<p class="mu">The right stick is your skill stick. With the ball: flick ← → for your side move, ↙ ↘ for your stepback, ↖ ↗ for your spin, pull ↓ and hold to shoot, push ↑ to attack the rim.</p>`;
      h += `<p class="mu">Single moves: these three are what the <b>Your Picks</b> dribble package uses.</p>`; sec('SIDE MOVE  ← →', MOVES.filter(m => m.slot === 'side'), 'side', 'handle'); sec('STEPBACK  ↙ ↘', MOVES.filter(m => m.slot === 'back'), 'back', 'handle'); sec('SPIN  ↖ ↗', MOVES.filter(m => m.slot === 'diag'), 'diag', 'handle');
      h += `<div class="cat">FINISHES AND JUMPER VARIATIONS</div><div class="card"><p>Everyone has these. The move stick picks one as you go up.</p>` + FINISHES.map(f => `<p><b>${f.n}</b> · ${f.d}</p>`).join('') + `</div>`;
      sec('JUMPSHOT', JUMPERS, 'jumper'); sec('SIGNATURE DUNK <span class="mu" style="text-transform:none;letter-spacing:.02em">— one show-stopper that joins your dunk package</span>', DUNKS.filter(m => m.sig || m.id === 'twohand' || S.moves.owned.includes(m.id)).map(m => m.id === 'twohand' ? Object.assign({}, m, { n: 'None', d: 'Just the package.' }) : m), 'dunk', 'dunk'); sec('CELEBRATION', CELEBS, 'celeb');
    } else if (st.tab === 'crew') {
      h += NET.room && NET.connected ? onlineBlock(null, null) : `<div class="card"><h3>OFFLINE</h3><p>Online play works from the game's shared Claude link, for people signed in that it is shared with. Opened as a file, the game is single player (plus local player 2 with a controller on a computer).</p></div>`;
      h += `<div class="cat">HOMIES · ${S.homies.length}</div>` + (S.homies.length ? S.homies.map(b => `<div class="card"><h3>${esc(b.name)} <span class="mu">${ovrOf(b.attrs)} OVR</span></h3><p>${STYLE[b.build.style].n} · ${fmtH(b.build.body.h)}${b.net ? ' · met online' : ''}</p></div>`).join('') : `<p class="mu">Nobody yet.</p>`);
    } else if (st.tab === 'ach') {
      const done = ACH.filter(a => S.ach[a.id]).length; h += `<p class="mu">${done} / ${ACH.length} trophies.</p><div class="grid">`;
      for (const a of ACH) { const v = Math.min(a.t, achVal(a.k)), d = S.ach[a.id]; h += `<div class="card ${d ? 'sel' : ''}"><h3 style="color:${d ? 'var(--gold)' : 'var(--bone)'}">${d ? '✓ ' : ''}${a.n}</h3><p>${a.d}</p><div class="row" style="margin-top:4px"><div class="ab"><i style="width:${v / a.t * 100}%;background:var(--heat)"></i></div><div class="av" style="width:auto;font-size:11px">${v}/${a.t}</div></div><p class="buff">+${a.vc} HC${a.drip ? ' · ' + DRIPS[a.drip].n : ''}</p></div>`; }
      h += `</div>`;
    } else if (st.tab === 'pers') {
      h += persTab();
    } else if (st.tab === 'mag') {
      h += magTab();
    } else if (st.tab === 'road') {
      const r = rankOf(S.rep);
      RANKS.forEach((k, i) => {
        const un = [].concat(TIERS_COURT.filter(t => t.rank === i && i > 0).map(t => 'Court: ' + t.n), DRIP.filter(d => d.rank === i && d.src === 'shop' && i > 0).map(d => d.n), MOVES.concat(JUMPERS, DUNKS, CELEBS).filter(m => m.rank === i && i > 0).map(m => m.n), CRIB.flatMap(c => c.tiers.filter(t => t.rank === i && t.cost > 0 && i > 0).map(t => 'Crib: ' + t.n)));
        h += `<div class="card ${i === r ? 'sel' : ''} ${i > r ? 'lock' : ''}"><div class="row"><h3 class="g" style="color:${i <= r ? 'var(--ice)' : 'var(--bone)'}">${i <= r ? '✓ ' : ''}${k.n}</h3><span class="f mu">${k.rep.toLocaleString()} RESPECT</span></div><p>${un.length ? 'Unlocks in shops: ' + un.join(' · ') : 'Where everyone starts. Even the Founding Fathers. Allegedly.'}</p></div>`;
      });
    } else {
      h += `<div class="card"><h3>SAVE</h3><p>A copy of your save is kept once a day on this device. A save code carries your player to another browser or keeps it safe.</p>${Btn('COPY SAVE CODE', () => { const c = saveCode(), ta = $('saveTa'); ta.style.display = 'block'; ta.value = c; ta.focus(); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { } if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c).then(() => toast('SAVE CODE COPIED', Math.round(c.length / 1024) + ' KB of text. Paste it somewhere safe.'), () => { }); else if (ok) toast('SAVE CODE COPIED', 'Paste it somewhere safe.'); }, 'sm alt')} ${Btn('LOAD A SAVE CODE', () => { const ta = $('saveTa'); if (ta.style.display !== 'block' || !ta.value.trim() || ta.value.trim() === saveCode()) { ta.style.display = 'block'; ta.value = ''; ta.placeholder = 'Paste a save code here, then press LOAD A SAVE CODE again'; ta.focus(); return; } const code = ta.value; uiDialog('LOAD THIS SAVE?', 'It replaces the player on this device. Your current one is kept as the backup.', [['Load it', () => { const er = saveFromCode(code); uiClose(); if (er) toast('NOT LOADED', er); else { toast('SAVE LOADED', S.name); enterWorld('hub', 0, 9, Math.PI); } }, 'red'], ['Cancel', () => uiPlayer('opt'), 'alt']]); }, 'sm alt')} ${Btn('RESTORE YESTERDAY', () => uiDialog('RESTORE THE BACKUP?', 'Goes back to the copy kept at the start of the day. Today\'s save becomes the backup.', [['Restore', () => { const er = saveRestoreBackup(); uiClose(); if (er) toast('NOT RESTORED', er); else { toast('BACKUP RESTORED', S.name); enterWorld('hub', 0, 9, Math.PI); } }, 'red'], ['Cancel', () => uiPlayer('opt'), 'alt']]), 'sm alt')}<textarea id="saveTa" spellcheck="false" style="display:none;width:100%;height:70px;margin-top:8px;background:var(--ink);color:var(--bone);border:1px solid var(--line);font:11px var(--m);padding:6px"></textarea></div><div class="card"><h3>TRASH TALK</h3><p>Speech bubbles over players during games.</p>${Btn('BUBBLES: ' + (S.set.talk === 0 ? 'OFF' : 'ON'), () => { S.set.talk = S.set.talk === 0 ? 1 : 0; save(); rerender(); }, 'sm alt')}</div><div class="card"><h3>HIGHLIGHTS</h3><p>Big plays get a close-up and a banner, and yours are photographed for CAGE.</p>${Btn('CLOSE-UP CAMERA: ' + (S.set.hlcam === 0 ? 'OFF' : 'ON'), () => { S.set.hlcam = S.set.hlcam === 0 ? 1 : 0; save(); rerender(); }, 'sm alt')}</div><div class="card"><h3>SOUND</h3>${volSliders()}<div style="margin-top:8px">${Btn('SFX: ' + (S.set.sfx ? 'ON' : 'OFF'), () => { S.set.sfx = S.set.sfx ? 0 : 1; save(); rerender(); }, 'sm alt')} ${Btn('MUSIC: ' + (S.set.music ? 'ON' : 'OFF'), () => { S.set.music = S.set.music ? 0 : 1; save(); rerender(); }, 'sm alt')} ${OST.el ? Btn('SKIP TRACK (N)' + (OST.cur ? ' · now: ' + esc(OST.cur) : ''), () => { ostNext(); setTimeout(rerender, 300); }, 'sm alt') : ''} ${Btn('SHOT METER: ' + (S.set.meter ? 'ON' : 'OFF'), () => { S.set.meter = S.set.meter ? 0 : 1; save(); rerender(); }, 'sm alt')} ${Btn('DEFENSE ASSIST: ' + (S.set.dassist === 0 ? 'OFF' : 'ON'), () => { S.set.dassist = S.set.dassist === 0 ? 1 : 0; save(); rerender(); }, 'sm alt')}</div></div>`;
      h += `<div class="card"><h3>CONTROLS</h3><p><b>Phone:</b> left thumb moves (push all the way to sprint). Right thumb is the skill stick. PASS / SHOOT buttons sit above it.</p><p><b>Keyboard:</b> WASD move · Shift sprint · Space shoot / jump (hold, release at the top) · E pass / steal / interact · I J K L skill stick · P pause.</p><p><b>Controller:</b> left stick move · right stick skill stick · A pass / steal · X shoot / jump · RT sprint · Start pause. A second player joins from any game door in The Cages with a controller.</p><p><b>Offense:</b> ↓ hold = shoot, release in the green · ↑ = drive / dunk · ← → = side move · ↙ ↘ = stepback · ↖ ↗ = spin.</p><p><b>Defense:</b> ↑ = hands up · ↓ = steal (RUCKUS: shove) · jump to block and board.</p></div>`;
      h += `<div class="card"><h3>DEV ROOM</h3><p>A maxed-out player, every build, every move, and a reel that plays them all. F2 on The Block opens it too.</p><div style="margin-top:6px">${Btn('OPEN DEV ROOM', () => { uiClose(); uiDev('hub'); }, 'sm alt')}</div></div>`;
      h += `<div class="card"><h3>DANGER ZONE</h3><div style="margin-top:6px">${Btn('BACK TO TITLE', () => { uiClose(); disposeScene(scene); scene = null; W = null; titleScene(); uiTitle(); }, 'sm alt')} ${Btn('ERASE EVERYTHING', () => uiDialog('ARE YOU SURE', 'Erase your player, drip, crib and Respect for good?', [['Erase it all', () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } S = newSave(); uiClose(); disposeScene(scene); scene = null; W = null; titleScene(); uiTitle(); }, 'red'], ['Never mind', null, 'alt']]), 'sm red')}</div></div>`;
    }
    return h + `</div>`;
  });
  if (UI.cur) UI.cur.startCloses = true;      /* START toggles it */
}

// ---------- drip depot / closet ----------
function uiShop(closet) {
  const st = { slot: 'top' }; if (W) { W.look = true; W.me.face = W.yaw + Math.PI; W.me.vx = W.me.vz = 0; }
  const r = () => rankOf(S.rep);
  openPanel(() => {
    let h = `<div class="ph"><h2>${closet ? 'CLOSET' : 'THE PLUG'}</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="tabs">` + SLOTS.map(s => Btn(s[1], () => { st.slot = s[0]; sfx('ui'); rerender(true); }, st.slot === s[0] ? 'sel' : 'alt')).join('') + Btn('★ FITS', () => { st.slot = 'fits'; sfx('ui'); rerender(true); }, st.slot === 'fits' ? 'sel' : 'alt') + `</div><div class="pb"><div class="grid">`;
    if (st.slot === 'fits') return h + fitCards(closet, rerender) + `</div></div>`;
    let items = DRIP.filter(d => d.slot === st.slot && (closet || (d.src !== 'nexx' && d.src !== 'deed')));      /* NEXX SUPPLY is only at Nexx */ if (closet) items = items.filter(d => S.owned.includes(d.id)); else items = items.slice().sort((a, b) => a.r - b.r || a.cost - b.cost);
    for (const d of items) {
      const own = S.owned.includes(d.id), eq = S.worn[d.slot] === d.id, price = shopPrice(d.cost), lockR = d.rank > r();
      const bf = d.buff ? Object.keys(d.buff).map(k => `+${d.buff[k]} ${ATTR[k].n}`).join(' · ') : '';
      let act;
      if (eq) act = `<span class="tag on">WEARING</span>`;
      else if (own) act = Btn('WEAR', () => { S.worn[d.slot] = d.id; sfx('uiok'); save(); worldPlayerRig(); rerender(); }, 'sm');
      else if (d.src === 'ach') act = `<span class="tag" style="color:var(--heat)">TROPHY REWARD</span>`;
      else if (d.src === 'bum') act = `<span class="tag" style="color:var(--heat)">A FIEND MIGHT HAVE ONE</span>`;
      else if (lockR) act = `<span class="tag or">RANK: ${RANKS[d.rank].n}</span>`;
      else act = Btn('BUY · ' + price + ' HC', () => { S.vc -= price; S.owned.push(d.id); S.worn[d.slot] = d.id; sfx('buy'); toast('NEW DRIP: ' + d.n, RAR[d.r][0] + (bf ? ' · ' + bf : '')); save(); worldPlayerRig(); checkAch(); rerender(); }, 'sm', S.vc < price);
      h += `<div class="card ${eq ? 'sel' : ''} ${!own && lockR ? 'lock' : ''}" style="border-left:5px solid ${RAR[d.r][1]}"><div class="row"><span class="sw" style="background:${d.c};width:22px;height:22px;margin:0;border-width:2px"></span><h3 class="g">${d.n}</h3></div><span class="tag" style="color:${RAR[d.r][1]}">${RAR[d.r][0]}</span> <span class="buff">${bf}</span><div style="margin-top:6px">${act}</div></div>`;
    }
    if (!items.length) h += `<p class="mu">Nothing here yet.</p>`;
    return h + `</div></div>`;
  }, 'side');
}

// whole outfits from one game. Buying one gets every piece you are missing at 15% off and puts it all on.
function fitCards(closet, rerender) {
  const r = rankOf(S.rep); let h = closet ? '' : `<p class="mu" style="grid-column:1/-1">Whole fits from the crew's games. You only pay for the pieces you don't own, 15% off, and it all goes on at once.</p>`, n = 0;
  for (const ft of FITS) {
    const ps = ft.items.map(id => DRIPS[id]).filter(Boolean), miss = ps.filter(d => !S.owned.includes(d.id)); if (closet && miss.length) continue; n++;
    const blocked = miss.find(d => d.src !== 'shop'), lockR = miss.reduce((m, d) => Math.max(m, d.rank), 0), price = Math.round(miss.reduce((t, d) => t + shopPrice(d.cost), 0) * 0.85);
    const wearing = ps.every(d => S.worn[d.slot] === d.id), rar = ps.reduce((m, d) => Math.max(m, d.r), 0);
    const wearAll = () => { for (const d of ps) S.worn[d.slot] = d.id; save(); worldPlayerRig(); };
    let act;
    if (wearing) act = `<span class="tag on">WEARING</span>`;
    else if (!miss.length) act = Btn('WEAR FIT', () => { wearAll(); sfx('uiok'); rerender(); }, 'sm');
    else if (blocked) act = `<span class="tag" style="color:var(--heat)">${esc(blocked.n)}: NOT SOLD HERE</span>`;
    else if (lockR > r) act = `<span class="tag or">RANK: ${RANKS[lockR].n}</span>`;
    else act = Btn('BUY FIT · ' + price + ' HC', () => { S.vc -= price; for (const d of miss) S.owned.push(d.id); wearAll(); sfx('buy'); toast('NEW FIT: ' + ft.n, ft.g + ' · ' + miss.length + ' new piece' + (miss.length > 1 ? 's' : '')); checkAch(); rerender(); }, 'sm', S.vc < price);
    h += `<div class="card ${wearing ? 'sel' : ''}" style="border-left:5px solid ${RAR[rar][1]}"><div class="row"><span class="g"><h3>${esc(ft.n)}</h3><span class="tag" style="color:${RAR[rar][1]}">${esc(ft.g)}</span></span></div>`
      + `<div class="row" style="flex-wrap:wrap;gap:4px;margin:6px 0">${ps.map(d => `<span class="sw" title="${esc(d.n)}" style="background:${d.c};width:16px;height:16px;margin:0;border-width:2px;${S.owned.includes(d.id) ? '' : 'opacity:.45'}"></span>`).join('')}</div>`
      + `<p class="mu" style="font-size:11px">${ps.map(d => (S.owned.includes(d.id) ? '✓ ' : '') + esc(d.n)).join(' · ')}</p><div style="margin-top:6px">${act}</div></div>`;
  }
  if (!n) h += `<p class="mu">${closet ? 'No full fits yet. Buy every piece of one (or the whole fit at The Plug).' : 'Nothing here yet.'}</p>`;
  return h;
}

// ---------- crib ----------
function uiCrib() {
  openPanel(() => {
    const r = rankOf(S.rep);
    let h = `<div class="ph"><h2>CRIB UPGRADES</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><p class="mu">Your home court. Everything you bolt on here follows you into The Cages.</p>` + (W && W.kind === 'crib' ? `<div class="card sel"><h3>HOME BUILDER</h3><p>Furniture, lights, gym gear, art, the yard: place anything in the yards you own. Vibe levels your crib up; sets give bonuses. Crib level ${homeLevel().lvl}.</p>${Btn('OPEN BUILD MODE (B)', () => buildEnter(), 'sm')}</div>` : '');
    for (const c of CRIB) {
      const t = cribTier(c.id), cur = c.tiers[t], nx = c.tiers[t + 1];
      h += `<div class="card"><div class="row"><div class="g"><h3>${c.n}: <span class="cy">${cur.n}</span></h3><p>${cur.d || '&nbsp;'}</p>`;
      if (nx) { const price = shopPrice(nx.cost), lock = nx.rank > r; h += `<p class="ye">NEXT → ${nx.n}: <span class="buff">${nx.d}</span></p></div>` + (lock ? `<span class="tag or">RANK: ${RANKS[nx.rank].n}</span>` : Btn(price + ' HC', () => { S.vc -= price; S.crib[c.id] = t + 1; sfx('buy'); toast('CRIB UPGRADE', nx.n + ' — ' + nx.d, 'ach'); save(); checkAch(); const m = W.me; uiClose(); enterWorld('crib', m.x, m.z, m.face); uiCrib(); }, '', S.vc < price)); }
      else h += `<p class="ye">Fully upgraded.</p></div>`;
      h += `</div><div class="pips" style="margin-top:5px">${c.tiers.slice(1).map((x, i) => `<i style="background:${i < t ? 'var(--ice)' : 'var(--line)'}"></i>`).join('')}</div></div>`;
    }
    return h + `</div>`;
  });
}

// ---------- the Cages: mode setup, kiosk, homies ----------
function uiMode(m) {
  const r = rankOf(S.rep); let top = 0; TIERS_COURT.forEach((t, i) => { if (t.rank <= r) top = i; });
  const st = { tier: Math.min(top, S.lastTier === undefined ? top : S.lastTier), mates: Array.from({ length: m.size - 1 }, (_, i) => S.homies[i] ? i : -1), rival: -1, p2: 'off', ct: {} };
  const cyc = (v, n) => (v + 2) % (n + 1) - 1;   // -1 (random), 0..n-1
  openPanel(() => {
    const t = TIERS_COURT[st.tier];
    let h = `<div class="ph"><h2>${m.n}</h2>${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><p>${m.d}</p>`;
    const online = NET.room && NET.connected, crewFirst = online && (crewMembers().length || crewLead());
    if (crewFirst) h += onlineBlock(m, st);
    h += `<div class="cat">COURT</div><div class="grid">` + TIERS_COURT.map((c, i) => `<div class="card ${i === st.tier ? 'sel' : ''} ${c.rank > r ? 'lock' : ''}" ${c.rank > r ? '' : `data-k="${on(() => { st.tier = i; sfx('ui'); rerender(); })}"`}><h3>${c.n}</h3><p>${c.rank > r ? 'Unlocks at ' + RANKS[c.rank].n : `Opponents ~${c.ovr} OVR · pays ×${c.mult}`}</p></div>`).join('') + `</div>`;
    h += `<div class="cat">YOUR SQUAD</div>`;
    for (let i = 0; i < m.size - 1; i++) { const v = st.mates[i] === undefined ? -1 : st.mates[i]; h += `<div style="margin-bottom:8px">${Btn(`TEAMMATE ${i + 1}: ${v < 0 ? 'RANDOM FROM THE PARK' : esc(S.homies[v].name) + ' (homie)'} ▸`, () => { st.mates[i] = cyc(v, S.homies.length); sfx('ui'); rerender(); }, 'alt sm')}</div>`; }
    h += `<div style="margin-bottom:8px">${Btn(`RIVAL: ${st.rival < 0 ? 'RANDOMS' : esc(S.homies[st.rival].name) + ' (homie) + crew'} ▸`, () => { st.rival = cyc(st.rival, S.homies.length); sfx('ui'); rerender(); }, 'alt sm')}</div>`;
    h += S.homies.length ? `<p class="mu">Your homies fill the squad first. Anyone you meet online becomes a homie, so their player runs with you even when they are not here.</p>` : `<p class="mu">Meet friends online, or import their build at THE LINK, and their players can run with you here.</p>`;
    if (!IS_TOUCH) h += `<div class="cat">PLAYER 2 <span class="mu" style="text-transform:none;letter-spacing:.02em">— same screen, controller or split keyboard</span></div>${Btn('P2: ' + ({ off: 'OFF', coop: 'CO-OP (your teammate)', vs: 'VERSUS (other team)' }[st.p2]) + ' ▸', () => { st.p2 = st.p2 === 'off' ? 'coop' : st.p2 === 'coop' ? 'vs' : 'off'; sfx('ui'); rerender(); }, 'alt sm')}<p class="mu">${st.p2 === 'off' ? 'Off: just you. Turn it on and a second player joins on ' + (anyPadStart() > 1 ? 'controller 2.' : anyPadStart() ? 'a second controller, or the keyboard while you stay on yours.' : 'a controller, or the other half of the keyboard.') : anyPadStart() ? anyPadStart() + ' controller(s) connected: player 2 is on ' + (anyPadStart() > 1 ? 'controller 2, player 1 on controller 1 or the keyboard.' : 'the controller, player 1 on the keyboard.') : 'No controller: the keyboard splits. Player 1: WASD move, Shift sprint, Space shoot, E pass, IJKL skill stick. Player 2: arrows move, right Shift sprint, / shoot, . pass, numpad 8 4 5 6 skill stick.'}</p>`;
    if (online && !crewFirst) h += onlineBlock(m, st);
    if (S.boosts.length) h += `<div class="cat">LOADED BOOSTS</div><p class="buff">${S.boosts.map(b => BOOSTS.find(x => x.id === b).n).join(' · ')}</p>`;
    h += `</div><div class="pf">${Btn('RUN IT', () => { S.lastTier = st.tier; launchGame(m, t, st); })}<span class="mu" style="align-self:center">Win ≈ ${Math.round(70 * t.mult + 60)} HC · ${Math.round(45 * t.mult + 15)} Respect</span></div>`;
    return h;
  });
  UI.cur.live = true;
}
// who is online, your crew, and the calls you can make from a cage gate (m) or from My Player (no m)
function onlineBlock(m, st) {
  const others = netOthers(), crew = crewMembers(), lead = crewLead(); let h = `<div class="cat">ONLINE <span class="mu" style="text-transform:none;letter-spacing:.02em">— anyone with the game open right now</span></div>`;
  if (lead) h += `<div class="card sel"><h3>IN ${esc(peerName(lead))}'S CREW</h3><p>You follow them, and they pull you into their runs. You can still run solo.</p><div style="margin-top:6px">${Btn('LEAVE CREW', () => { crewLeave(); rerender(); }, 'sm alt')}</div></div>`;
  if (crew.length) {
    h += `<div class="card sel"><h3>YOUR CREW · ${crew.length + 1}</h3>`;
    for (const p of crew) {
      const busy = p.presence.w === 'game', t = st && st.ct[p.peer] ? 1 : 0;
      h += `<div class="row" style="margin-top:6px"><div class="g"><b>${esc(peerName(p))}</b> <span class="mu">${p.presence.o | 0} OVR${busy ? ' · in a game' : ''}</span></div>${m ? Btn(t ? 'THEIR TEAM' : 'MY TEAM', () => { st.ct[p.peer] = t ? 0 : 1; sfx('ui'); rerender(); }, 'sm ' + (t ? 'red' : '')) : ''}${Btn('CUT', () => { crewKick(p.peer); rerender(); }, 'sm alt')}</div>`;
    }
    if (m) {
      const go = crew.filter(p => p.presence.w !== 'game'), n0 = 1 + go.filter(p => !st.ct[p.peer]).length, n1 = go.filter(p => st.ct[p.peer]).length, ok = go.length && n0 <= m.size && n1 <= m.size;
      h += `<p class="mu" style="margin-top:8px">${ok ? `${n0} of you vs ${n1 ? n1 + ' of you' : 'nobody you know'}, AI fills the rest.` : `Too many on one side for ${m.n}: ${m.size} a team.`}</p><div style="margin-top:6px">${Btn('RUN IT WITH THE CREW', () => { S.lastTier = st.tier; netGo(m, st.tier, go.map(p => [p.peer, st.ct[p.peer] ? 1 : 0])); }, '', !ok)}</div>`;
    } else h += `<p class="mu" style="margin-top:8px">Walk to a cage gate to start a run with them.</p>`;
    h += `</div>`;
  }
  if (NET.out) h += `<div class="card sel"><h3>CALLING…</h3><p>Waiting for them to pick up.</p><div style="margin-top:6px">${Btn('CANCEL', () => { NET.out = null; pres({ inv: null }); rerender(); }, 'sm alt')}</div></div>`;
  const rest = others.filter(p => !(NET.crew && NET.crew.m.includes(p.peer)) && p.peer !== NET.inCrew);
  if (!others.length) h += `<p class="mu">Nobody else is here. Share the game's link with a friend and they show up on The Block.</p>`;
  else for (const p of rest) {
    const busy = p.presence.w === 'game' || !!NET.out, full = crew.length >= 5;
    h += `<div class="card"><div class="row" style="flex-wrap:wrap"><div class="g"><h3>${esc(peerName(p))} <span class="mu">${p.presence.o | 0} OVR</span></h3><p>${p.presence.w === 'game' ? 'In a game right now.' : 'On ' + (p.presence.w === 'pit' ? 'The Cages' : String(p.presence.w || '').startsWith('crib') ? (p.presence.w === 'crib@' + NET.me ? 'YOUR crib' : 'a crib') : 'The Block') + '.'}${p.presence.in ? ' Running with a crew.' : ''}</p></div>${NET.inCrew ? '' : Btn('+ CREW', () => { netInvite(p.peer, null, 0, 'crew'); rerender(); }, 'sm cy', busy || full)}${!m && p.presence.hm && W ? Btn('VISIT CRIB', () => netVisit(p.peer), 'sm alt') : ''}${m ? Btn('SAME TEAM', () => { netInvite(p.peer, m, st.tier, 'coop'); rerender(); }, 'sm', busy) + Btn('VERSUS', () => { netInvite(p.peer, m, st.tier, 'vs'); rerender(); }, 'sm alt', busy) : ''}</div></div>`;
  }
  return h;
}
function uiKiosk() {
  openPanel(() => {
    let h = `<div class="ph"><h2>LAST CALL</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><p class="mu">"One game only. No refunds. Side effects include winning." Everything here is used up in your next Pit game.</p><div class="grid">`;
    for (const b of BOOSTS.filter(x => !x.hidden)) { const has = S.boosts.includes(b.id), price = shopPrice(b.cost); h += `<div class="card ${has ? 'sel' : ''}"><h3>${b.n}</h3><p class="buff">${b.d}</p><div style="margin-top:6px">${has ? '<span class="tag hot">LOADED</span>' : Btn(price + ' HC', () => { S.vc -= price; S.boosts.push(b.id); sfx('buy'); save(); rerender(); }, 'sm', S.vc < price)}</div></div>`; }
    return h + `</div></div>`;
  });
}
function uiHomie() {
  const code = encodeBuild(myBuild());
  openPanel(() => {
    let h = `<div class="ph"><h2>THE LINK</h2>${Btn('✕', uiClose, 'alt sm')}</div><div class="pb">`;
    h += `<div class="card"><h3>EXPORT YOUR BUILD</h3><p>Send this code to a friend. They paste it here and your player shows up in their park — as a teammate or as the rival.</p><textarea id="expc" rows="3" readonly>${code}</textarea><div style="margin-top:6px">${Btn('COPY CODE', () => { const t = $('expc'); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { } if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => { }); toast(ok || navigator.clipboard ? 'COPIED' : 'SELECT AND COPY IT', 'Send it to a homie.'); sfx('uiok'); }, 'sm cy')}</div></div>`;
    h += `<div class="card"><h3>IMPORT A HOMIE</h3><textarea id="impc" rows="3" placeholder="Paste a GN1-… code"></textarea><div style="margin-top:6px">${Btn('ADD HOMIE', () => {
      const b = decodeBuild($('impc').value); if (!b) { toast('BAD CODE', 'That is not a ' + BRAND.name + ' build.'); sfx('no'); return; }
      if (S.homies.length >= 12) S.homies.shift(); S.homies.push(b); S.life.homies = (S.life.homies || 0) + 1; save(); checkAch(); sfx('unlock'); toast('HOMIE ADDED: ' + b.name, STYLE[b.build.style].n + ' · ' + ovrOf(b.attrs) + ' OVR', 'ach'); rerender();
    }, 'sm')}</div></div>`;
    h += `<div class="cat">YOUR HOMIES</div>` + (S.homies.length ? S.homies.map((b, i) => `<div class="card"><div class="row"><div class="g"><h3>${esc(b.name)} <span class="mu">${ovrOf(b.attrs)} OVR</span></h3><p>${STYLE[b.build.style].n} · ${fmtH(b.build.body.h)}</p></div>${Btn('CUT', () => { S.homies.splice(i, 1); save(); rerender(); }, 'sm alt')}</div></div>`).join('') : `<p class="mu">Nobody yet. It's lonely at the bottom.</p>`);
    h += `<div class="card"><h3>PLAY TOGETHER</h3><p>This game is one file. Send the file to a friend and they have the whole game. On a computer, plug in a controller and pick CO-OP or VERSUS at any game door.</p></div>`;
    return h + `</div>`;
  });
}

// ---------- talk ----------
function uiDialog(name, text, opts) {
  openPanel(() => `<div style="flex:1"></div><div class="card sel"><h3 class="mono" style="font-size:10px;color:var(--heat)">${esc(name)}</h3><p style="color:var(--bone);font-size:15px;margin:8px 0 12px">${esc(text)}</p><div class="pf">${opts.map(o => Btn(o[0], () => { if (o[1]) o[1](); else uiClose(); }, o[2] || '', o[3])).join('')}</div></div><div style="height:12%"></div>`, 'clear');
}
function uiBum(n) {
  W.talk = n;
  if (n.blessed) return uiDialog(n.name, pick(BUM_THANKS), [['Stay up.', null]]);
  const amt = Math.max(3, Math.round((6 + rankOf(S.rep) * 6 + rnd(0, 6)) * (1 - cribFx('bum'))));
  uiDialog(n.name, pick(BUM_ASK).replace('{n}', amt), [
    [`Give ${amt} HC`, () => {
      S.vc -= amt; S.life.gave = (S.life.gave || 0) + 1; n.blessed = true; n.anim = 'cheer'; n.wander = false; sfx('coin'); gainRep(evOn('fiend') ? 10 : 3);
      let extra = '';
      if (!S.owned.includes('hd_crown') && Math.random() < 0.22) { S.owned.push('hd_crown'); extra = ' He hands you a CARDBOARD CROWN.'; toast('NEW DRIP: Cardboard Crown', 'EPIC · +1 Passing', 'ach'); sfx('unlock'); }
      save(); checkAch(); uiDialog(n.name, pick(BUM_THANKS) + extra, [['+3 Respect. Worth it.', null]]);
    }, 'alt', S.vc < amt],
    ['Nah', () => uiDialog(n.name, pick(BUM_NO), [['...', null]])],
  ]);
}
function uiRack() {
  uiDialog('SHARPIE THE HUSTLER', `I keep a book on everybody who hoops around here. You too: every shot, every drive, every move, every game. Ask and I'll read it to you. And two games. MONEY RACK: 40 seconds, deep balls only, I pay 5 HC a point, entry 25 (your best: ${S.life.bestRack || 0}). Or H-O-R-S-E, you and me: 50 to play, beat me for ${evOn('horse') ? 500 : 250}.`, [
    ['Your book', () => uiVip()], ['Money Rack (25)', () => { S.vc -= 25; save(); startPractice('rack'); }, '', S.vc < 25], ['H-O-R-S-E (50)', () => { uiClose(); startHorse(); }, '', S.vc < 50], ['Nah', null, 'alt']]);
}


// ---------- results ----------
function uiResults(res, rw, again) {
  const s = res.stats;
  openPanel(() => {
    let h = `<div class="ph"><h2 style="color:${res.win ? 'var(--go)' : 'var(--heat)'}">${res.win ? 'DUB' : 'L'} · ${res.score[0]} — ${res.score[1]}</h2></div><div class="pb">`;
    h += `<div class="card sel"><div class="row" style="flex-wrap:wrap;gap:18px"><div><div class="mu f">HC</div><div class="big ye" id="rvc">0</div></div><div><div class="mu f">RESPECT</div><div class="big cy" id="rrep">0</div></div><div class="g"><div class="mu f">BADGE XP</div>${['F', 'S', 'P', 'D'].map(c => `<span class="tag" style="color:${CATS[c][1]}">${CATS[c][0]} +${rw.bxp[c]}</span>`).join(' ')}${rw.pts.length ? `<p class="buff">${rw.pts.join(' · ')}</p>` : ''}</div></div>${rw.notes.length ? `<p class="buff">${rw.notes.join(' · ')}</p>` : ''}</div>`;
    h += `<div class="card"><table><tr><th>PLAYER</th><th>PTS</th><th>AST</th><th>REB</th><th>STL</th><th>BLK</th><th>ANK</th><th>PF</th><th>FG</th></tr>` + res.box.map(b => `<tr style="color:${b.user ? 'var(--gold)' : b.team === 0 ? 'var(--ice)' : '#ff9ab8'}"><td>${esc(b.n)}</td><td>${b.s.pts}</td><td>${b.s.ast}</td><td>${b.s.reb}</td><td>${b.s.stl}</td><td>${b.s.blk}</td><td>${b.s.ankles}</td><td>${b.s.fouls || 0}</td><td>${b.s.fgm}/${b.s.fga}</td></tr>`).join('') + `</table></div>`;
    h += `<p class="mu">${s.greens} greens · ${s.dunks} dunks · ${s.threes} deep balls · ${s.bravs} Bravado</p>`;
    return h + `</div><div class="pf">${again ? Btn('RUN IT BACK', again) : ''}${Btn('BACK TO THE CAGES', uiClose, again ? 'alt' : '')}</div>`;
  });
  UI.lockMs = 1100;      /* the buzzer often comes mid-press */
  // the count-up
  let t = 0; const iv = setInterval(() => { t += 0.05; const k = Math.min(1, t); const a = $('rvc'), b = $('rrep'); if (!a) { clearInterval(iv); return; } a.textContent = '+' + Math.round(rw.vc * k); b.textContent = '+' + Math.round(rw.rep * k); if (k < 1) sfx('coin'); else { clearInterval(iv); sfx('buy'); } }, 45);
}
function volSliders() { return `<label class="sl">MUSIC VOLUME <b id="lmv">${S.set.musVol === undefined ? 80 : S.set.musVol}</b></label><input type="range" id="vmus" min="0" max="100" step="5" value="${S.set.musVol === undefined ? 80 : S.set.musVol}" data-k="${on(el => { S.set.musVol = +el.value; $('lmv').textContent = el.value; applyVolumes(); saveLocal(); })}"><label class="sl">EFFECTS VOLUME <b id="lsv">${S.set.sfxVol === undefined ? 80 : S.set.sfxVol}</b></label><input type="range" id="vsfx" min="0" max="100" step="5" value="${S.set.sfxVol === undefined ? 80 : S.set.sfxVol}" data-k="${on(el => { S.set.sfxVol = +el.value; $('lsv').textContent = el.value; applyVolumes(); saveLocal(); if (!UI.vt || performance.now() - UI.vt > 180) { UI.vt = performance.now(); sfx('bounce'); } })}">`; }
function uiPause() {
  if (!MT || MT.over) return; MT.paused = true; const online = !!MT.net;
  openPanel(() => `<div class="ph"><h2>${online ? 'MENU · the game is still live' : 'PAUSED'}</h2></div><div class="pb"><div class="card"><h3>SOUND</h3>${volSliders()}</div><div class="card"><h3>WITH THE BALL</h3><p>Skill stick ↓ hold & release = shoot (release in the green band) · ↑ = drive, layup or dunk · ← → = side move · ↙ ↘ = stepback · ↖ ↗ = spin. PASS throws to the teammate you are pushing toward.</p></div><div class="card"><h3>WITHOUT IT</h3><p>On defense: skill stick hold ↑ = both hands up (a wall, two-hand contest), ↖ ↗ = one hand high on that side (that hand contests and reaches), ↙ ↘ = hands low and digging, flick ↓ = steal${MT.arcade ? ' / shove' : ''}, JUMP to block or rebound. On offense: CALL asks for the rock. After a stop, take it back past the arc.</p></div><div class="card"><h3>BRAVADO</h3><p>Big plays fill the bar. Full bar = +8 to every attribute for 20 seconds.</p></div></div><div class="pf">${Btn('RESUME', uiClose)}${Btn(MT.practice ? 'LEAVE' : 'FORFEIT', () => { uiClose(); quitMatch(); }, 'red')}</div>`, '', uiClose);
  if (UI.cur) UI.cur.startCloses = true;      /* START toggles it */
}
