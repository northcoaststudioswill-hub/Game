// GOT NEXT — core: save, input (touch twin-stick / keyboard / gamepads), audio
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + RNG() * (b - a);
const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// ---------------- save ----------------
const SAVE_KEY = 'gotnext_v1', OLD_SAVE_KEY = 'pitborn2145_v1';
let S = null;
function newSave() {
  return {
    v: 1, created: false, name: 'ROOKIE',
    build: { style: 'slasher', origin: 'rustbelt', body: { h: 77, w: 0, s: 0 }, skin: 2 },
    attrs: {}, vc: 600, rep: 0,
    badges: {}, bp: { F: 0, S: 0, P: 0, D: 0 }, bxp: { F: 0, S: 0, P: 0, D: 0 },
    owned: DRIP.filter(d => d.src === 'start').map(d => d.id),
    worn: { hair: 'h_buzz', head: 'hd_none', face: 'f_none', top: 't_tank', arm: 'a_none', bottom: 'b_basic', socks: 's_low', shoes: 'k_beat', back: 'bk_none', ball: 'bl_std' },
    moves: { owned: ['cross', 'stepback', 'spin', 'textbook', 'twohand', 'flex'], side: 'cross', back: 'stepback', diag: 'spin', jumper: 'textbook', dunk: 'twohand', celeb: 'flex' },
    crib: {}, home: { lot: 0, items: [], store: {}, look: { house: 0, trim: 0, fence: 0, ground: 1 }, used: {}, tour: '' }, boosts: [], life: {}, drills: {}, ladder: 0, ach: {}, homies: [], seenRank: 0, bumDay: 0,
    set: { sfx: 1, music: 1, meter: 1, sfxVol: 80, musVol: 80 },
  };
}
function loadSave() {
  try { const j = JSON.parse(localStorage.getItem(SAVE_KEY) || localStorage.getItem(OLD_SAVE_KEY)); if (j && j.v === 1) { S = Object.assign(newSave(), j); slotsInit(); return; } } catch (e) { }
  S = newSave(); slotsInit();
}
function saveLocal() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }
function save() { S.ts = Date.now(); if (S.slots) S.slots[S.slot] = slotSnap(); saveLocal(); cloudSave(); }
// ---- build slots: up to 5 players on one account. Each build has its own body, attributes, badges, equipped moves and
// fit; VC, Respect, the drip and moves you own, the crib and lifetime stats are shared. Online uses the active build.
const MAX_SLOTS = 5, MOVE_SLOTS = ['side', 'back', 'diag', 'jumper', 'dunk', 'celeb'];
const cloneJ = o => JSON.parse(JSON.stringify(o));
function slotSnap() { const mv = {}; for (const k of MOVE_SLOTS) mv[k] = S.moves[k]; return cloneJ({ name: S.name, build: S.build, attrs: S.attrs, badges: S.badges, bp: S.bp, bxp: S.bxp, moves: mv, worn: S.worn, anim: S.anim || null, made: S.created }); }
function slotLoad(t) { const d = newSave(); S.name = t.name || d.name; S.build = cloneJ(t.build || d.build); S.attrs = cloneJ(t.attrs || {}); S.badges = cloneJ(t.badges || {}); S.bp = cloneJ(t.bp || d.bp); S.bxp = cloneJ(t.bxp || d.bxp);
  for (const k of MOVE_SLOTS) S.moves[k] = t.moves && S.moves.owned.includes(t.moves[k]) ? t.moves[k] : d.moves[k]; S.worn = Object.assign({}, d.worn, t.worn || {}); for (const s in S.worn) if (s !== 'hair' && S.worn[s] && !S.owned.includes(S.worn[s]) && S.worn[s] !== d.worn[s]) S.worn[s] = d.worn[s];
  S.anim = t.anim || null; if (!Object.keys(S.attrs).length) S.attrs = startAttrs(S.build); }
function slotsInit() { if (!Array.isArray(S.slots) || !S.slots.length) { S.slots = [slotSnap()]; S.slot = 0; } S.slot = Math.max(0, Math.min(S.slots.length - 1, S.slot | 0)); S.slots = S.slots.slice(0, MAX_SLOTS); }
function slotSwitch(i) { if (i === S.slot || !S.slots[i] || S.devBak) return false; S.slots[S.slot] = slotSnap(); S.slot = i; slotLoad(S.slots[i]); save(); return true; }
function slotNew() { if (S.slots.length >= MAX_SLOTS || S.devBak) return -1; S.slots[S.slot] = slotSnap(); const d = newSave(); S.slots.push({ name: 'ROOKIE', build: d.build, attrs: {}, badges: {}, bp: d.bp, bxp: d.bxp, moves: {}, worn: d.worn, made: false }); return S.slots.length - 1; }
function slotDelete(i) { if (i === S.slot || !S.slots[i] || S.slots.length < 2) return false; S.slots.splice(i, 1); if (i < S.slot) S.slot--; save(); return true; }
function cribTier(id) { return S.crib[id] || 0; }
function cribFx(k) { let v = 0; for (const c of CRIB) { const t = c.tiers[cribTier(c.id)]; if (t && t.k === k) v += t.v; } return v + (typeof homeFx === 'function' ? homeFx(k) : 0); }
function shopPrice(c) { return Math.round(c * (ORIGIN[S.build.origin].k === 'shop' ? 0.9 : 1)); }
function myBuild() {   // a portable snapshot of the player (also what export codes carry)
  return { name: S.name, build: S.build, attrs: S.attrs, badges: S.badges, worn: S.worn, anim: S.anim || undefined, moves: { side: S.moves.side, back: S.moves.back, diag: S.moves.diag, jumper: S.moves.jumper, dunk: S.moves.dunk, celeb: S.moves.celeb } };
}
function encodeBuild(b) { return BRAND.code + '1-' + btoa(unescape(encodeURIComponent(JSON.stringify(b)))).replace(/=+$/, ''); }
function decodeBuild(code) {
  try {
    return sanitizeBuild(JSON.parse(decodeURIComponent(escape(atob(code.trim().replace(/^(PIT|GN)1-/, ''))))));
  } catch (e) { return null; }
}
// anything that arrives from outside (a pasted code, another player online) goes through here
function sanitizeBuild(j) {
  try {
    if (!j || !j.build || !STYLE[j.build.style] || !j.attrs || !j.build.body) return null;
    j.name = String(j.name || 'HOMIE').slice(0, 14).replace(/[<>&]/g, '');
    for (const a of ATTRS) j.attrs[a.id] = clamp(+j.attrs[a.id] || 40, 25, 99);
    j.build.body = { h: clamp(+j.build.body.h || 77, H_MIN, H_MAX), w: clamp(+j.build.body.w || 0, -1, 1), s: clamp(+j.build.body.s || 0, -1, 1) };
    j.build.skin = clamp(j.build.skin | 0, 0, SKINS.length - 1);
    if (!ORIGIN[j.build.origin]) j.build.origin = 'rustbelt';
    j.badges = j.badges || {}; for (const k in j.badges) { if (!BADGE[k]) delete j.badges[k]; else j.badges[k] = clamp(j.badges[k] | 0, 0, 4); }
    const w = newSave().worn; j.worn = j.worn || {}; for (const k in w) if (!DRIPS[j.worn[k]] || DRIPS[j.worn[k]].slot !== k) j.worn[k] = w[k];
    const m = newSave().moves; j.moves = j.moves || {};
    if (!MOVE[j.moves.side] || MOVE[j.moves.side].slot !== 'side') j.moves.side = m.side;
    if (!MOVE[j.moves.back] || MOVE[j.moves.back].slot !== 'back') j.moves.back = m.back;
    if (!MOVE[j.moves.diag] || MOVE[j.moves.diag].slot !== 'diag') j.moves.diag = m.diag;
    if (!JUMPER[j.moves.jumper]) j.moves.jumper = m.jumper; if (!DUNK[j.moves.dunk]) j.moves.dunk = m.dunk;
    j.anim = typeof cleanProfile === 'function' ? cleanProfile(j.anim) || undefined : undefined;
    return j;
  } catch (e) { return null; }
}

// ---------------- input ----------------
function blankIn() { return { mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, start: false, back: false, flick: null, rdir: null, rRel: false, _a: false, _b: false, _rd: null, _st: false, _bk: false }; }
const IN = [blankIn(), blankIn(), blankIn()];      // 0 and 1 are local players; 2 is a player online
const keys = {};
let twoPlayer = false;       // set by the Cages when a second pad joins
const touch = { L: null, R: null, a: false, b: false, start: false };
function dir8(x, y) {        // screen space: y negative = up
  const m = Math.hypot(x, y); if (m < 0.55) return null;
  const a = Math.atan2(-y, x) * 180 / Math.PI;   // 0 = right, 90 = up
  if (a > -22.5 && a <= 22.5) return 'R'; if (a > 22.5 && a <= 67.5) return 'UR'; if (a > 67.5 && a <= 112.5) return 'U';
  if (a > 112.5 && a <= 157.5) return 'UL'; if (a > 157.5 || a <= -157.5) return 'L'; if (a > -157.5 && a <= -112.5) return 'DL';
  if (a > -112.5 && a <= -67.5) return 'D'; return 'DR';
}
function dead(v) { return Math.abs(v) < 0.16 ? 0 : v; }
// round deadzone: small pushes give small, controlled movement; direction is never snapped to an axis
function stick(x, y, dz) { const m = Math.hypot(x, y); if (m < dz) return [0, 0]; const s = Math.min(1, (m - dz) / (1 - dz)) / m; return [x * s, y * s]; }
// button presses and stick flicks are latched until a simulation step has used them, so a tap is never lost
// between steps (at 120 FPS some frames run no step; at 30 FPS some run two)
function clearEdges() { for (const I of IN) { I.aP = I.bP = I.bR = I.rRel = I.relEdge = I.lbP = I.rbP = false; I.flick = null; I.pe = {}; } }
function pollInput() {
  const pads = (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(p => p && p.connected);
  for (let i = 0; i < 2; i++) {
    const I = IN[i]; let analog = false, tsp = false, mx = 0, my = 0, rx = 0, ry = 0, sprint = false, a = false, b = false, st = false, bk = false, lt = false;
    // two players and no controller: split the keyboard. P1 left hand (WASD, IJKL), P2 right side (arrows, numpad)
    const split = twoPlayer && pads.length === 0;
    if (i === 1 && split) {
      if (keys.ArrowLeft) mx -= 1; if (keys.ArrowRight) mx += 1; if (keys.ArrowUp) my -= 1; if (keys.ArrowDown) my += 1;
      if (keys.Numpad4) rx -= 1; if (keys.Numpad6) rx += 1; if (keys.Numpad8) ry -= 1; if (keys.Numpad5 || keys.Numpad2) ry += 1;
      sprint = !!keys.ShiftRight; a = !!(keys.Period || keys.Numpad1); b = !!(keys.Slash || keys.Numpad0); st = !!keys.Backspace;
    }
    if (i === 0) {
      if (keys.KeyA || (!split && keys.ArrowLeft)) mx -= 1; if (keys.KeyD || (!split && keys.ArrowRight)) mx += 1; if (keys.KeyW || (!split && keys.ArrowUp)) my -= 1; if (keys.KeyS || (!split && keys.ArrowDown)) my += 1;
      if (keys.KeyJ) rx -= 1; if (keys.KeyL) rx += 1; if (keys.KeyI) ry -= 1; if (keys.KeyK) ry += 1;
      sprint = !!(keys.ShiftLeft || (!split && keys.ShiftRight)); a = !!(keys.KeyE || (!split && keys.Enter)); b = !!keys.Space; st = !!keys.KeyP; bk = !!keys.Escape; lt = !!keys.KeyQ;
      if (touch.L) { mx += touch.L.x; my += touch.L.y; const tm = Math.hypot(touch.L.x, touch.L.y); I._ts = tm > 0.93 || (I._ts && tm > 0.85); if (I._ts) tsp = true; analog = true; }   /* sprint on at 93%, off below 85%: a thumb at full push must not flicker it */
      if (touch.R) { rx += touch.R.x; ry += touch.R.y; }
      lt = lt || !!touch.lt; a = a || touch.a || touch.aTap; b = b || touch.b || touch.bTap; st = st || touch.start || touch.startTap; touch.aTap = touch.bTap = touch.startTap = false;
    }
    // pads: with two players and one pad, the pad belongs to player 2
    let p = null;
    if (twoPlayer) p = pads.length >= 2 ? pads[i] : (i === 1 ? pads[0] : null); else if (i === 0) p = pads[0];
    if (p) {
      const ls = stick(p.axes[0] || 0, p.axes[1] || 0, 0.17), rs = stick(p.axes[2] || 0, p.axes[3] || 0, 0.22); mx += ls[0]; my += ls[1]; if (ls[0] || ls[1]) analog = true; rx += rs[0]; ry += rs[1];
      const B = n => p.buttons[n] && p.buttons[n].pressed;
      const bld = typeof BLD !== 'undefined' && BLD.on && !(typeof UI !== 'undefined' && UI.cur);      /* in the home builder the d-pad browses the catalog; the stick moves the cursor */
      if (!bld) { if (B(14)) mx -= 1; if (B(15)) mx += 1; if (B(12)) my -= 1; if (B(13)) my += 1; }
      { const now = { y: B(3), x: B(2), lt: B(6) || (p.buttons[6] && p.buttons[6].value > 0.35), rt: B(7), sel: B(8) || B(11) || B(10), dl: B(14), dr: B(15), du: B(12), dd: B(13) }, pv = I._pe || {}, pe = I.pe || (I.pe = {}); for (const k in now) if (now[k] && !pv[k]) pe[k] = true; I._pe = now; I.hasPad = true; }
      // on defense (2K layout): X steals, Y jumps to block; A still steals. With the ball and off it: X or Y shoots / jumps
      const def = typeof padDefense === 'function' && padDefense(i);
      sprint = sprint || B(7) || B(5); a = a || B(0) || (def && B(2)); b = b || (def ? B(3) : B(2) || B(3)); st = st || B(9); bk = bk || B(1);
      lt = lt || B(6) || (p.buttons[6] && p.buttons[6].value > 0.35);      /* LT: body up on defense, post up on offense */
      const lb = B(4), rb = B(5); I.lbP = I.lbP || (lb && !I._lb); I.rbP = I.rbP || (rb && !I._rb); I._lb = lb; I._rb = rb;
    }
    const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
    const r = Math.hypot(rx, ry); if (r > 1) { rx /= r; ry /= r; }
    I.mx = mx; I.my = my; I.rx = rx; I.ry = ry; I.lt = lt; I.sprintBtn = sprint; I.sprint = sprint || tsp; I.analog = analog;
    const now = performance.now(); if ((a && !I._a) || (b && !I._b)) I.tPress = now;
    I.aP = I.aP || (a && !I._a); I.bP = I.bP || (b && !I._b); I.bR = I.bR || (!b && I._b); I.a = a; I.b = b; I._a = a; I._b = b;
    I.start = st && !I._st; I._st = st; I.back = bk && !I._bk; I._bk = bk;
    const d = dir8(rx, ry); if (d && !I._rd) { I.flick = d; I.tPress = now; } I.rRel = I.rRel || (!d && !!I._rd); I.rdir = d; I._rd = d;
  }
}
function anyPadStart() { const pads = (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(p => p && p.connected); return pads.length; }
addEventListener('keydown', e => { if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; keys[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Slash', 'Backspace'].includes(e.code) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) e.preventDefault(); audioInit(); });
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

// touch sticks: left half of the screen is the move stick, right half the skill stick. They appear where the thumb lands.
function setupTouch() {
  const pad = $('touch'); if (!IS_TOUCH) { pad.style.display = 'none'; return; }
  document.body.classList.add('touch');
  const R = 56, ids = {};
  function place(el, t) { el.style.left = (t.ox - 60) + 'px'; el.style.top = (t.oy - 60) + 'px'; el.style.opacity = 1; el.firstElementChild.style.transform = `translate(${t.x * 34}px,${t.y * 34}px)`; }
  function start(e) {
    audioInit();
    for (const t of e.changedTouches) {
      if (t.target.closest('.tbtn')) continue; if (document.body.classList.contains('building') && t.clientX >= innerWidth / 2) continue;
      const side = t.clientX < innerWidth / 2 ? 'L' : 'R'; if (touch[side]) continue;
      touch[side] = { id: t.identifier, ox: t.clientX, oy: t.clientY, x: 0, y: 0 }; ids[t.identifier] = side; place($('stick' + side), touch[side]);
    }
    e.preventDefault();
  }
  function move(e) {
    for (const t of e.changedTouches) {
      const side = ids[t.identifier]; if (!side) continue; const s = touch[side]; if (!s) continue;
      let dx = (t.clientX - s.ox) / R, dy = (t.clientY - s.oy) / R; const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
      s.x = dx; s.y = dy; place($('stick' + side), s);
    }
    e.preventDefault();
  }
  function end(e) { for (const t of e.changedTouches) { const side = ids[t.identifier]; if (!side) continue; delete ids[t.identifier]; touch[side] = null; $('stick' + side).style.opacity = 0; } }
  pad.addEventListener('touchstart', start, { passive: false }); pad.addEventListener('touchmove', move, { passive: false });
  pad.addEventListener('touchend', end); pad.addEventListener('touchcancel', end);
  for (const [id, k] of [['tA', 'a'], ['tB', 'b'], ['tLT', 'lt'], ['tMenu', 'start']]) {
    const el = $(id);
    el.addEventListener('touchstart', e => { touch[k] = true; touch[k + 'Tap'] = true; el.classList.add('on');      /* latched: a tap shorter than a frame still counts */ e.preventDefault(); e.stopPropagation(); audioInit(); }, { passive: false });
    const up = e => { touch[k] = false; el.classList.remove('on'); e.preventDefault(); };
    el.addEventListener('touchend', up); el.addEventListener('touchcancel', up);
  }
}

// ---------------- audio (all synthesised) ----------------
let AC = null, master = null, sfxBus = null, musBus = null, musicGain = null, noiseBuf = null, musicTimer = null, musicStep = 0, musicNext = 0, musicMode = 'hub';
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination);
    sfxBus = AC.createGain(); sfxBus.connect(master); musBus = AC.createGain(); musBus.connect(master);      /* the two volume sliders */
    musicGain = AC.createGain(); musicGain.gain.value = 0.16; musicGain.connect(musBus); applyVolumes();
    noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    musicNext = AC.currentTime + 0.1; musicTimer = setInterval(musicTick, 60); if (typeof ostInit === 'function') ostInit();
  } catch (e) { AC = null; }
}
// volume sliders: 0-100, 80 is the default level
function volOf(k) { const v = S && S.set ? S.set[k] : undefined; return (v === undefined ? 80 : clamp(+v || 0, 0, 100)) / 80; }
function applyVolumes() { if (!AC) return; const t = AC.currentTime; sfxBus.gain.setTargetAtTime(volOf('sfxVol'), t, 0.05); musBus.gain.setTargetAtTime(volOf('musVol'), t, 0.05); if (typeof ostRoom === 'function' && typeof OST !== 'undefined') ostRoom(OST.room); }
function tone(f, t, dur, type, vol, f2, dest) {
  if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); o.connect(g); g.connect(dest || sfxBus); o.start(t); o.stop(t + dur + 0.02);
}
function noise(t, dur, vol, hp, lp, dest) {
  if (!AC) return; const s = AC.createBufferSource(); s.buffer = noiseBuf; const g = AC.createGain(), f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = (hp + lp) / 2; f.Q.value = 0.7;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); s.connect(f); f.connect(g); g.connect(dest || sfxBus); s.start(t, Math.random() * 0.5, dur + 0.05);
}
function sfx(n) {
  if (!AC || !S || !S.set.sfx) return; const t = AC.currentTime;
  switch (n) {
    case 'bounce': tone(120, t, .09, 'sine', .5, 60); noise(t, .03, .12, 300, 900); break;
    case 'swish': noise(t, .28, .5, 2500, 7000); break;
    case 'green': noise(t, .3, .5, 2500, 7000); tone(880, t, .12, 'triangle', .25); tone(1320, t + .08, .2, 'triangle', .25); break;
    case 'rim': tone(310, t, .25, 'square', .14, 280); tone(463, t, .2, 'square', .1, 440); break;
    case 'dunk': tone(90, t, .4, 'sawtooth', .5, 40); noise(t, .3, .6, 100, 900); tone(310, t + .02, .5, 'square', .12, 290); break;
    case 'whoosh': noise(t, .16, .22, 500, 2500); break;
    case 'ankle': tone(700, t, .3, 'sawtooth', .22, 90); noise(t + .12, .2, .3, 200, 800); break;
    case 'bump': noise(t, .09, .45, 60, 500); tone(90, t, .1, 'sine', .35, 55); break;
    case 'block': noise(t, .12, .6, 200, 1400); tone(160, t, .15, 'square', .3, 80); break;
    case 'steal': tone(500, t, .07, 'square', .2, 900); tone(900, t + .06, .1, 'square', .2, 1400); break;
    case 'whistle': tone(2700, t, .12, 'square', .1); tone(2850, t + .13, .3, 'square', .1); break;
    case 'buzz': tone(140, t, .7, 'sawtooth', .3); tone(147, t, .7, 'sawtooth', .3); break;
    case 'ui': tone(660, t, .05, 'square', .1); break;
    case 'uiok': tone(520, t, .06, 'square', .12); tone(780, t + .05, .09, 'square', .12); break;
    case 'no': tone(160, t, .15, 'square', .15, 110); break;
    case 'coin': tone(1200, t, .06, 'square', .12); tone(1600, t + .05, .14, 'square', .12); break;
    case 'buy': tone(520, t, .08, 'triangle', .25); tone(660, t + .07, .08, 'triangle', .25); tone(880, t + .14, .2, 'triangle', .25); noise(t, .1, .15, 4000, 9000); break;
    case 'unlock': [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * .07, .25, 'triangle', .22)); noise(t + .3, .5, .12, 5000, 10000); break;
    case 'rank': [392, 523, 659, 784, 1047, 1319, 1568].forEach((f, i) => { tone(f, t + i * .09, .4, 'sawtooth', .1); tone(f / 2, t + i * .09, .4, 'triangle', .2); }); break;
    case 'crowd': noise(t, 1.2, .25, 300, 2500); break;
    case 'fire': noise(t, .8, .4, 150, 1200); tone(200, t, .8, 'sawtooth', .15, 800); break;
    case 'step': noise(t, .03, .05, 1500, 4000); break;
  }
}
// tiny boom-bap sequencer; three moods
const MUS = {
  hub: { bpm: 86, kick: 'x.....x...x.....', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.xx', bass: [55, 0, 0, 55, 0, 0, 65, 0, 49, 0, 0, 49, 0, 58, 0, 0] },
  game: { bpm: 96, kick: 'x..x..x...x..x..', snare: '....x.......x..x', hat: 'xxx.xxx.xxx.xxxx', bass: [41, 0, 41, 0, 0, 49, 0, 0, 37, 0, 37, 0, 0, 46, 0, 49] },
  jam: { bpm: 124, kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..x...x...x...x.', bass: [55, 55, 0, 55, 65, 0, 55, 0, 49, 49, 0, 49, 73, 0, 65, 0] },
};
function musicTick() {
  if (typeof ostSync === 'function') ostSync();
  if (!AC || !S || !S.set.music || musicMode === 'off' || (typeof ostPlaying === 'function' && ostPlaying())) { if (AC) musicNext = AC.currentTime + 0.1; return; }
  const M = MUS[musicMode]; const sp = 60 / M.bpm / 4;
  while (musicNext < AC.currentTime + 0.15) {
    const i = musicStep % 16, t = musicNext;
    if (M.kick[i] === 'x') tone(110, t, .16, 'sine', .9, 38, musicGain);
    if (M.snare[i] === 'x') { noise(t, .12, .5, 900, 4000, musicGain); tone(190, t, .07, 'triangle', .3, 120, musicGain); }
    if (M.hat[i] === 'x') noise(t, .03, .16, 6000, 11000, musicGain);
    if (M.bass[i]) tone(M.bass[i], t, sp * 1.8, 'sawtooth', .28, M.bass[i], musicGain);
    if (musicMode === 'jam' && i % 4 === 2) tone(M.bass[i - 2] * 4 || 440, t, .1, 'square', .08, 0, musicGain);
    musicNext += sp * (i % 2 ? 0.92 : 1.08); musicStep++;
  }
}
