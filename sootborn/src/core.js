// ============================================================
// core/ — constants, settings, storage, input, audio, layout
// ============================================================
'use strict';
let W = 320, H = 180; const TS = 16, STEP = 1 / 60; // W narrows to 208 in portrait for a bigger picture
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
function hash(x, y) { let h = (x * 374761393 + y * 668265263) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- platform: storage adapter (localStorage if it works, memory otherwise)
const Store = {
  ok: false, mem: {},
  init() { try { localStorage.setItem('bts_probe', '1'); localStorage.removeItem('bts_probe'); this.ok = true; } catch (e) { this.ok = false; } },
  get(k) { if (this.ok) { try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) { } } return k in this.mem ? this.mem[k] : null; },
  set(k, v) { this.mem[k] = v; if (this.ok) { try { localStorage.setItem(k, v); return true; } catch (e) { } } return false; }
};

// ---------- settings
const Settings = {
  d: { music: 6, sfx: 8, text: 1, speed: 1, highlight: 0, reduce: 0, touch: 'auto', op: 60, diff: 1 },
  load() { try { const s = JSON.parse(Store.get('bts_settings') || 'null'); if (s) Object.assign(this.d, s); } catch (e) { } },
  save() { Store.set('bts_settings', JSON.stringify(this.d)); },
  apply() {
    const r = document.documentElement.style;
    r.setProperty('--ts', [0.9, 1, 1.15, 1.3][this.d.text] || 1);
    r.setProperty('--op', this.d.op / 100);
    if (this.d.reduce === 0 && matchMedia('(prefers-reduced-motion: reduce)').matches && !this.d._asked) { this.d.reduce = 1; this.d._asked = 1; }
    Sound.setVol(); Layout.update();
  }
};

// ---------- input abstraction: keyboard + touch + gamepad -> actions
const ACTIONS = ['up', 'down', 'left', 'right', 'A', 'B', 'START', 'L', 'R', 'Y', 'X'];
const Input = {
  held: {}, pressed: {}, kb: {}, touch: {}, pad: {}, queued: new Set(), hold: {}, device: 'kb', touchSeen: false,
  keymap: { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', KeyE: 'A', Enter: 'A', Space: 'A', KeyZ: 'A', Escape: 'B', KeyX: 'B', Backspace: 'B', KeyM: 'START', Tab: 'START', KeyP: 'START', KeyQ: 'L', KeyR: 'R', KeyH: 'Y', KeyJ: 'R', KeyC: 'X', KeyF: 'Y', KeyV: 'R', KeyG: 'L' },
  typing(e) { const t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'); },
  init() {
    addEventListener('keydown', e => {
      if (e.code === 'Backquote') { Debug.toggle(); return; }
      if (this.typing(e)) return;
      const a = this.keymap[e.code];
      if (a) { e.preventDefault(); if (!this.kb[a]) this.queued.add(a); this.kb[a] = true; this.setDevice('kb'); }
      Sound.unlock();
    });
    addEventListener('keyup', e => { const a = this.keymap[e.code]; if (a) this.kb[a] = false; });
    addEventListener('blur', () => { this.kb = {}; this.touch = {}; });
    addEventListener('pointerdown', e => { if (e.pointerType === 'touch') { this.touchSeen = true; this.setDevice('touch'); } Sound.unlock(); }, true);
    for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, () => Sound.unlock(), true);
    // touch buttons
    const bind = (el, a) => {
      const on = e => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) { } this.touch[a] = true; this.queued.add(a); el.classList.add('on'); this.setDevice('touch'); Sound.unlock(); };
      const off = e => { this.touch[a] = false; el.classList.remove('on'); };
      el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('lostpointercapture', off);
    };
    bind($('#bA'), 'A'); bind($('#bB'), 'B'); bind($('#bM'), 'START');
    for (const [id, a] of [['bX', 'X'], ['bY', 'Y'], ['bR', 'R'], ['bL', 'L']]) if ($('#' + id)) bind($('#' + id), a);
    const pad = $('#dpad'), knob = pad.querySelector('b');
    let pid = null;
    const setDir = e => {
      const r = pad.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy), m = r.width * 0.36, k = Math.min(1, d / m);
      knob.style.transform = `translate(${dx / (d || 1) * k * m * 0.7}px,${dy / (d || 1) * k * m * 0.7}px)`;
      const T = this.touch; const was = { up: T.up, down: T.down, left: T.left, right: T.right };
      T.up = T.down = T.left = T.right = false;
      if (d > 12) { const ang = Math.atan2(dy, dx), s = Math.PI / 8; // 8-way
        if (ang > -7 * s && ang < -s) T.up = true; if (ang > s && ang < 7 * s) T.down = true;
        if (ang > 5 * s || ang < -5 * s) T.left = true; if (ang > -3 * s && ang < 3 * s) T.right = true; }
      for (const a of ['up', 'down', 'left', 'right']) if (T[a] && !was[a]) this.queued.add(a);
    };
    pad.addEventListener('pointerdown', e => { e.preventDefault(); pid = e.pointerId; try { pad.setPointerCapture(pid); } catch (_) { } setDir(e); this.setDevice('touch'); });
    pad.addEventListener('pointermove', e => { if (e.pointerId === pid) setDir(e); });
    const up = e => { if (e.pointerId !== pid) return; pid = null; knob.style.transform = ''; const T = this.touch; T.up = T.down = T.left = T.right = false; };
    pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up);
  },
  setDevice(d) { if (this.device !== d) { this.device = d; if (d === 'touch') this.touchSeen = true; Layout.update(); HUD.dirty = true; } },
  pollPad() {
    this.pad = {}; let gps = [];
    try { gps = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { gps = []; }
    for (const g of gps || []) {
      if (!g || !g.connected) continue;
      const b = i => g.buttons[i] && g.buttons[i].pressed, ax = g.axes[0] || 0, ay = g.axes[1] || 0, P = this.pad;
      if (b(12) || ay < -.5) P.up = 1; if (b(13) || ay > .5) P.down = 1; if (b(14) || ax < -.5) P.left = 1; if (b(15) || ax > .5) P.right = 1;
      if (this.fight) { // in a fight the pad is laid out like an action game: X strike, Y kick, A jump, B dodge, RB/RT guard, LB/LT hook
        if (b(2)) P.A = 1; if (b(3)) P.X = 1; if (b(0)) P.Y = 1; if (b(1)) P.B = 1; if (b(5) || b(7)) P.R = 1; if (b(4) || b(6)) P.L = 1; if (b(9) || b(8)) P.START = 1;
      } else { if (b(0)) P.A = 1; if (b(1)) P.B = 1; if (b(9) || b(8)) P.START = 1; if (b(4)) P.L = 1; if (b(5)) P.R = 1; if (b(3) || b(2)) P.Y = 1; }
      if (Object.keys(P).length) this.setDevice('pad');
    }
  },
  update(dt) {
    const fi = (Brawl.active && !Brawl.cine && Brawl.phase === 'fight' && !Brawl.art && !Brawl.sup && !UI.stack.length) || (typeof Issue !== 'undefined' && Issue.on); if (fi !== this.fight) { this.fight = fi; document.body.classList.toggle('fight', fi); }
    this.pollPad();
    const n = {};
    for (const a of ACTIONS) n[a] = !!(this.kb[a] || this.touch[a] || this.pad[a]);
    for (const a of ACTIONS) {
      this.pressed[a] = (n[a] && !this.held[a]) || this.queued.has(a);
      this.hold[a] = n[a] ? (this.hold[a] || 0) + dt : 0;
    }
    this.queued.clear(); this.held = n;
  },
  p(a) { return this.pressed[a]; }, h(a) { return this.held[a]; },
  // menu-style repeat: fires on press, then every 0.11s after 0.35s held
  rep(a) { if (this.pressed[a]) return true; const t = this.hold[a]; return t > 0.35 && Math.floor((t - 0.35) / 0.11) !== Math.floor((t - 0.35 - STEP) / 0.11); },
  consume() { this.pressed = {}; this.queued.clear(); },
  label(a) { const d = this.device; if (a === 'A') return d === 'kb' ? 'E' : d === 'pad' ? 'Ⓐ' : 'A'; if (a === 'B') return d === 'kb' ? 'Esc' : d === 'pad' ? 'Ⓑ' : 'B'; if (a === 'START') return d === 'kb' ? 'M' : d === 'pad' ? 'Start' : '☰'; return a; }
};

// ---------- audio: WebAudio synth, user-gesture unlock, graceful no-op
const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
const Sound = {
  ctx: null, mus: null, sfx: null, nb: null, track: null, tname: null, step: 0, next: 0,
  // master chain: music and effects into a compressor, then make-up gain. Without this the mix sat
  // around -36 dB and was all bass, which a phone speaker simply does not play.
  graph(c) { const out = c.createGain(); out.gain.value = 1.2; out.connect(c.destination); const comp = c.createDynamicsCompressor(); comp.threshold.value = -24; comp.knee.value = 12; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2; comp.connect(out);
    const mus = c.createGain(), sfx = c.createGain(); mus.connect(comp); sfx.connect(comp); const nb = c.createBuffer(1, c.sampleRate, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return { mus, sfx, nb }; },
  unlock() {
    // iOS: a looping silent <audio> moves the page to the "playback" audio session, so the ring/silent switch no longer mutes Web Audio
    if (!this.keep) { try { const a = this.keep = new Audio('data:audio/wav;base64,UklGRvQHAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdAHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA=='); a.loop = true; a.preload = 'auto'; a.setAttribute('playsinline', ''); } catch (e) { this.keep = {}; } }
    if (this.keep.play && this.keep.paused) { try { const pr = this.keep.play(); if (pr && pr.catch) pr.catch(() => { }); } catch (e) { } }
    if (this.ctx) { if (this.ctx.state !== 'running' && !document.hidden) this.ctx.resume().catch(() => { }); return; }
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      const c = this.ctx = new C(), g = this.graph(c); this.mus = g.mus; this.sfx = g.sfx; this.nb = g.nb;
      this.setVol(); this.next = c.currentTime + 0.1; if (c.state !== 'running') c.resume().catch(() => { });
      // one inaudible blip inside the gesture: some browsers only start the clock once a source has played
      const o = c.createOscillator(), z = c.createGain(); z.gain.value = 0.0001; o.connect(z); z.connect(c.destination); o.start(); o.stop(c.currentTime + 0.03);
    } catch (e) { this.ctx = null; }
  },
  setVol() { if (!this.ctx) return; this.mus.gain.value = (Settings.d.music / 10) * 1.5; this.sfx.gain.value = (Settings.d.sfx / 10) * 1.0; },
  suspend() { if (this.ctx) this.ctx.suspend().catch(() => { }); },
  resume() { if (this.ctx) this.ctx.resume().catch(() => { }); },
  tone(n, t, dur, type, vol, dest, slideTo) {
    if (!(vol > 0.0005)) return; const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(n > 127 ? n : mtof(n), t); // >127 = Hz, else MIDI note
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfx); o.start(t); o.stop(t + dur + 0.05);
    if (dest === this.mus && !this._part) { const hz = n > 127 ? n : mtof(n); if (hz < 190) { this._part = 1; if (slideTo) this.noise(t, 0.035, vol * .5, dest, 1900, 1.5); else { const up = n > 127 ? hz * 2 : n + 12; this.tone(up, t, dur * .8, 'triangle', vol * .55, dest); this.tone(n > 127 ? hz * 4 : n + 24, t, dur * .5, 'triangle', vol * .22, dest); } this._part = 0; } }
  },
  noise(t, dur, vol, dest, freq, q, type) {
    if (!(vol > 0.0005)) return; const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nb; f.type = type || 'bandpass'; f.frequency.value = freq || 1500; f.Q.value = q || 1;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sfx); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  },
  // a tone that swells in (horns, pads) instead of being struck
  pad(n, t, dur, type, vol, dest, att) { if (!(vol > 0.0005)) return; const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type || 'sawtooth'; o.frequency.setValueAtTime(n > 127 ? n : mtof(n), t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (att || dur * .3)); g.gain.setValueAtTime(vol, t + dur * .7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(dest || this.sfx); o.start(t); o.stop(t + dur + 0.05); if (dest === this.mus && !this._part) { const hz = n > 127 ? n : mtof(n); if (hz < 190) { this._part = 1; this.pad(n > 127 ? hz * 2 : n + 12, t, dur, 'triangle', vol * .5, dest, att); this._part = 0; } } },
  // filtered noise whose pitch moves: the air a blade pushes aside
  sweep(t, dur, vol, f0, f1, q, dest) { if (!(vol > 0.0005)) return; const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.nb; f.type = 'bandpass'; f.Q.value = q || 1.5; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * .35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(dest || this.sfx); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02); },
  // struck steel: partials that do not line up, ringing off quickly
  ring(t, vol, len, base) { for (const [m, v] of [[1, 1], [1.47, .7], [2.09, .55], [2.56, .4], [3.4, .25]]) this.tone((base || 1900) * m * (1 + (Math.random() - .5) * .02), t, (len || .35) / Math.sqrt(m), 'sine', vol * v); this.noise(t, 0.03, vol * 3, null, 6000, 2, 'highpass'); },
  play(name, k) {
    if (!this.ctx || this.ctx.state !== 'running') return; const t = this.ctx.currentTime + 0.005;
    switch (name) {
      case 'swing': this.sweep(t, 0.14, 0.7, 900 + Math.random() * 300, 3600, 1.2); break;
      case 'swing2': this.sweep(t, 0.2, 0.85, 500, 2600, 1); this.sweep(t + 0.02, 0.16, 0.45, 1800, 5200, 2); break;
      case 'steel': this.ring(t, 0.11, 0.4, 1700 + Math.random() * 500); break;
      case 'slash': this.noise(t, 0.09, 0.8, null, 1700, 1.2); this.noise(t, 0.12, 0.6, null, 300, 1, 'lowpass'); this.ring(t, 0.045, 0.18, 2400 + Math.random() * 600); this.tone(110, t, 0.1, 'triangle', 0.3, null, 60); break;
      case 'bigslash': this.noise(t, 0.16, 0.5, null, 1200, 1); this.noise(t, 0.3, 0.45, null, 180, 1, 'lowpass'); this.tone(90, t, 0.32, 'sine', 0.4, null, 34); this.ring(t, 0.04, 0.45, 1500); break;
      case 'clash': this.ring(t, 0.08, 0.7, 1500); this.ring(t + 0.03, 0.05, 0.5, 2300); this.noise(t, 0.1, 0.45, null, 3000, 1); this.tone(70, t, 0.25, 'sine', 0.3, null, 40); break;
      case 'dash': this.sweep(t, 0.16, 0.7, 400, 2400, 2.5); break;
      case 'fury': this.pad(38, t, 1.3, 'sawtooth', 0.09, null, 0.5); this.pad(38.12, t, 1.3, 'sawtooth', 0.07, null, 0.5); this.sweep(t, 1.0, 0.3, 200, 3000, 1); this.tone(50, t + 0.9, 0.5, 'sine', 0.4, null, 30); this.noise(t + 0.9, 0.5, 0.35, null, 400, 0.8, 'lowpass'); break;
      case 'cutin': this.sweep(t, 0.5, 0.3, 300, 5000, 1.5); this.tone(50, t + 0.42, 1.4, 'sine', 0.3); this.tone(86, t + 0.42, 1.6, 'triangle', 0.06); this.tone(93, t + 0.42, 1.6, 'sine', 0.04); this.noise(t + 0.42, 0.25, 0.3, null, 300, 0.8, 'lowpass'); break;
      case 'count': { const n = k || 0; this.tone(50 + n * 2, t, 0.12, 'square', 0.07); this.tone(38 + n, t, 0.2, 'sine', 0.3, null, 40); this.noise(t, 0.07, 0.35, null, 1400 + n * 180, 1.2); this.ring(t, 0.02, 0.15, 2000 + n * 150); break; }
      case 'pillar': this.tone(80, t, 1.3, 'sine', 0.55, null, 26); this.noise(t, 1.4, 0.55, null, 260, 0.6, 'lowpass'); this.noise(t, 0.5, 0.3, null, 2400, 0.8); this.sweep(t + 0.1, 1.2, 0.2, 4000, 500, 1); this.ring(t, 0.04, 0.9, 900); break;
      case 'horn': for (const [n, d] of [[38, 0], [45, 0], [50, 0.02], [38, 1.5], [45, 1.5], [53, 1.52]]) { this.pad(n, t + d, 1.4, 'sawtooth', 0.05, null, 0.35); this.pad(n + 0.08, t + d, 1.4, 'square', 0.02, null, 0.4); } this.noise(t, 2.8, 0.05, null, 500, 0.5, 'lowpass'); break;
      case 'win': [[62, 0], [66, 0.14], [69, 0.28], [74, 0.42], [69, 0.7], [74, 0.84]].forEach(([n, d], i) => { this.pad(n, t + d, i > 3 ? 1.2 : 0.3, 'sawtooth', 0.045, null, 0.03); this.tone(n + 12, t + d, i > 3 ? 1.0 : 0.25, 'triangle', 0.05); }); this.tone(38, t + 0.42, 1.6, 'sine', 0.2); break;
      case 'bodyfall': this.noise(t, 0.18, 0.55, null, 220, 1, 'lowpass'); this.tone(60, t, 0.14, 'sine', 0.2, null, 36); this.ring(t + 0.04, 0.012, 0.2, 1200); break;
      case 'blip': this.tone(84, t, 0.03, 'square', 0.025); break;
      case 'move': this.tone(76, t, 0.03, 'square', 0.03); break;
      case 'ok': this.tone(79, t, 0.06, 'square', 0.05); this.tone(86, t + 0.06, 0.08, 'square', 0.05); break;
      case 'back': this.tone(72, t, 0.06, 'square', 0.04); this.tone(65, t + 0.05, 0.08, 'square', 0.04); break;
      case 'rotate': this.noise(t, 0.05, 0.25, null, 2200, 6); this.tone(55, t, 0.06, 'triangle', 0.12); break;
      case 'solved': [62, 65, 69, 74, 77].forEach((n, i) => this.tone(n, t + i * 0.08, 0.5, 'triangle', 0.12)); break;
      case 'stage': [69, 74].forEach((n, i) => this.tone(n, t + i * 0.1, 0.3, 'triangle', 0.1)); break;
      case 'clue': this.tone(38, t, 1.4, 'sine', 0.25); this.tone(81, t + 0.05, 1.6, 'sine', 0.07); this.tone(86, t + 0.25, 1.4, 'sine', 0.05); break;
      case 'coin': this.tone(83, t, 0.07, 'square', 0.05); this.tone(88, t + 0.07, 0.18, 'square', 0.05); break;
      case 'door': this.noise(t, 0.35, 0.3, null, 380, 0.7, 'lowpass'); this.tone(40, t, 0.25, 'triangle', 0.1); break;
      case 'deny': this.tone(43, t, 0.14, 'square', 0.05); break;
      case 'bell': for (let i = 0; i < 3; i++) { this.tone(81, t + i * 0.55, 1.1, 'triangle', 0.09); this.tone(88, t + i * 0.55, 0.9, 'sine', 0.05); } break;
      case 'step': this.noise(t, 0.05, 0.05, null, 700, 0.8, 'lowpass'); break;
      case 'stepg': this.noise(t, 0.04, 0.05, null, 2600, 5); break;
      case 'cough': this.noise(t, 0.12, 0.25, null, 900, 2); this.noise(t + 0.22, 0.16, 0.3, null, 800, 2); break;
      case 'rumble': this.tone(32, t, 2.2, 'sine', 0.35); this.noise(t, 2, 0.25, null, 120, 1, 'lowpass'); break;
      case 'choir': [74, 78, 81, 86, 90].forEach((n, i) => { this.tone(n, t + i * 0.06, 3.2, 'sine', 0.05); this.tone(n + 12, t + i * 0.06, 2.6, 'sine', 0.015); }); break;
      case 'roar': this.noise(t, 2.4, 0.45, null, 260, 0.6, 'lowpass'); this.tone(36, t, 2.2, 'sawtooth', 0.06); this.noise(t + 0.1, 1.6, 0.12, null, 1400, 1); break;
      case 'hit': this.tone(45, t, 0.25, 'square', 0.12, null, 40); this.noise(t, 0.18, 0.35, null, 500, 1, 'lowpass'); break;
      case 'alarm': [0, 0.18, 0.36].forEach(d => this.tone(d % 0.36 ? 70 : 76, t + d, 0.16, 'square', 0.07)); break;
      case 'heart': this.tone(41, t, 0.12, 'sine', 0.5, null, 30); this.tone(41, t + 0.2, 0.14, 'sine', 0.38, null, 28); break;
      case 'clink': this.tone(96, t, 0.08, 'square', 0.04); this.noise(t, 0.06, 0.2, null, 4200, 8); this.tone(91, t + 0.12, 0.06, 'square', 0.03); break;
      case 'huh': this.tone(70, t, 0.08, 'square', 0.05); this.tone(75, t + 0.08, 0.12, 'square', 0.05); break;
      case 'page': this.noise(t, 0.08, 0.15, null, 3000, 1); break;
      case 'splash': [57, 64, 69, 76].forEach((n, i) => this.tone(n, t + i * 0.12, 1.2, 'triangle', 0.07)); break;
    }
  },
  music(name) { if (this.tname === name) return; this.tname = name; this.track = TRACKS[name] || null; this.step = 0; if (this.ctx) this.next = this.ctx.currentTime + 0.15; },
  tick() {
    if (!this.ctx || !this.track || this.ctx.state !== 'running') return;
    const tr = this.track, sp = 60 / tr.bpm / 4; const now = this.ctx.currentTime;
    if (this.next < now - 0.5) this.next = now + 0.05;
    while (this.next < now + 0.25) { tr.fn(this.step % tr.len, this.next, sp, this); this.step++; this.next += sp; }
  }
};
// Original motif (the "shift song"): D F A G | F E D
const MOTIF = { 0: 62, 4: 65, 8: 69, 12: 67, 16: 65, 20: 64, 24: 62 };
const TRACKS = {
  home: { bpm: 74, len: 64, fn(s, t, sp, S) {
    const bar = s >> 4, chords = [[50, 53, 57], [46, 50, 53], [41, 45, 48], [48, 52, 55]];
    if (s % 16 === 0) { for (const n of chords[bar]) S.tone(n + 12, t, sp * 16, 'triangle', 0.035, S.mus); S.tone(chords[bar][0] - 12, t, sp * 7, 'sine', 0.09, S.mus); }
    if (s % 16 === 8) S.tone(chords[bar][0] - 12, t, sp * 7, 'sine', 0.07, S.mus);
    const m = s < 32 ? MOTIF[s] : ({ 32: 69, 36: 67, 40: 65, 44: 64, 48: 62, 52: 60, 56: 62 })[s];
    if (m) S.tone(m + 12, t, sp * 3.5, 'sine', 0.05, S.mus);
    if (s % 4 === 2) S.noise(t, 0.03, 0.02, S.mus, 6000, 1, 'highpass');
  } },
  work: { bpm: 100, len: 64, fn(s, t, sp, S) {
    const q = s % 16;
    if (q % 8 === 0) S.tone(130, t, 0.18, 'sine', 0.25, S.mus, 45);
    if (q === 4 || q === 12) S.noise(t, 0.12, 0.12, S.mus, 2600, 9);
    if (q === 14 && (s >> 4) % 2) S.noise(t, 0.06, 0.06, S.mus, 3400, 12);
    const bass = [38, 0, 0, 38, 0, 0, 41, 0, 38, 0, 0, 38, 0, 43, 41, 0][q];
    if (bass) S.tone(bass, t, sp * 1.8, 'triangle', 0.13, S.mus);
    if (s >= 32) { const m = MOTIF[s - 32]; if (m) S.tone(m, t, sp * 2.5, 'square', 0.018, S.mus); }
  } },
  mystery: { bpm: 60, len: 32, fn(s, t, sp, S) {
    if (s === 0) { S.tone(38, t, sp * 32, 'sine', 0.06, S.mus); S.tone(45, t, sp * 32, 'sine', 0.035, S.mus); }
    const b = ({ 6: 74, 19: 77, 27: 81 })[s]; if (b) S.tone(b, t, 2.5, 'sine', 0.035, S.mus);
    if (s === 12) S.noise(t, 1.2, 0.02, S.mus, 400, 4);
  } },
  // rage layer shared by the Assay tracks: S.rage (0..1) comes from the fury bar
  _rage(s, t, sp, S, root) { const r = S.rage || 0; if (r < .5) return; const k = (r - .5) * 2, q = s % 16; S.tone(root - 12, t, sp * .9, 'sawtooth', 0.05 * k, S.mus); if (q % 4 === 2) S.tone(130, t, 0.12, 'sine', 0.2 * k, S.mus, 40); if (r >= 1 && q % 2 === 0) S.tone(root + 25 + (q % 4 ? 0 : 1), t, sp * .8, 'square', 0.012, S.mus); if (r >= 1 && q === 0) S.noise(t, sp * 14, 0.05, S.mus, 300, 0.6, 'lowpass'); },
  dusk: { bpm: 126, len: 128, fn(s, t, sp, S) { // the ford: low, modal, hand drums, the shift song in the cellos
    const q = s % 16, bar = s >> 4, root = [38, 38, 39, 38, 36, 36, 39, 38][bar]; TRACKS._rage(s, t, sp, S, root);
    if (q === 0 || q === 6 || q === 10) S.tone(110, t, 0.22, 'sine', 0.22, S.mus, 48); if (q === 3 || q === 8 || q === 13 || q === 14) S.noise(t, 0.06, 0.07, S.mus, 900, 3); if (q % 2 === 1) S.noise(t, 0.02, 0.02, S.mus, 5000, 2, 'highpass');
    if (q === 0) { S.pad(root, t, sp * 16, 'sawtooth', 0.03, S.mus, sp * 4); S.pad(root + 7, t, sp * 16, 'triangle', 0.035, S.mus, sp * 6); S.pad(root + 12 + (bar % 4 === 2 ? 1 : 3), t, sp * 16, 'sine', 0.03, S.mus, sp * 8); }
    if (q % 4 === 0) S.tone(root + 12 + [0, 7, 12, 7][q >> 2], t, sp * 3, 'triangle', 0.035, S.mus);
    if (bar >= 4) { const m = MOTIF[(s - 64) >> 1]; if (m && !(s & 1)) { S.pad(m - 12, t, sp * 7, 'sawtooth', 0.035, S.mus, sp); S.tone(m, t, sp * 6, 'triangle', 0.03, S.mus); } }
    if (q === 0 && bar % 2 === 0) S.noise(t, sp * 30, 0.03, S.mus, 420, 0.5, 'lowpass');
  } },
  duel: { bpm: 168, len: 128, fn(s, t, sp, S) { // the keep: a clock, a blade, and her tune high above his
    const q = s % 16, bar = s >> 4, root = [38, 38, 41, 40, 38, 38, 43, 45][bar]; TRACKS._rage(s, t, sp, S, root);
    S.tone(root + [0, 0, 12, 0, 7, 0, 12, 0, 0, 12, 0, 7, 0, 3, 7, 12][q], t, sp * .8, 'sawtooth', 0.028, S.mus); if (q % 2 === 0) S.noise(t, 0.02, 0.035, S.mus, 7000, 3, 'highpass');
    if (q % 4 === 0) S.tone(130, t, 0.14, 'sine', 0.24, S.mus, 44); if (q === 4 || q === 12) S.noise(t, 0.1, 0.12, S.mus, 2000, 4); if (q === 14 && bar % 2) S.noise(t, 0.08, 0.1, S.mus, 2000, 4);
    if (q === 0) { S.pad(root + 12, t, sp * 15, 'sawtooth', 0.022, S.mus, sp * 2); S.pad(root + 19, t, sp * 15, 'square', 0.012, S.mus, sp * 2); }
    if (bar < 4) { const m = MOTIF[s >> 1]; if (m && !(s & 1)) S.tone(m + 24, t, sp * 6, 'sine', 0.05, S.mus); } // Seren, high and clean
    else { const m = MOTIF[(s - 64) >> 1]; if (m && !(s & 1)) { S.pad(m, t, sp * 5, 'sawtooth', 0.04, S.mus, 0.02); S.pad(m - 12, t, sp * 5, 'square', 0.02, S.mus, 0.02); } } // Kael, the same notes, an octave of iron under them
    if (bar === 7 && q >= 8) S.tone(root + 24 + (q - 8), t, sp * .9, 'square', 0.015, S.mus);
  } },
  battle: { bpm: 152, len: 128, fn(s, t, sp, S) { // the valley: war drums, horns, and the shift song as a march
    const q = s % 16, bar = s >> 4, root = [38, 38, 34, 36, 38, 41, 34, 33][bar], third = [3, 3, 4, 4, 3, 4, 4, 4][bar]; TRACKS._rage(s, t, sp, S, root);
    if (q === 0 || q === 6 || q === 8) S.tone(120, t, 0.2, 'sine', 0.28, S.mus, 40); if (q === 4 || q === 12) { S.noise(t, 0.13, 0.13, S.mus, 1800, 3); S.tone(180, t, 0.08, 'triangle', 0.06, S.mus, 120); } if (q === 10 || q === 14 || q === 15) S.tone(90 + (q - 10) * 6, t, 0.12, 'sine', 0.16, S.mus, 60); if (q % 2 === 1) S.noise(t, 0.025, 0.028, S.mus, 7000, 2, 'highpass');
    S.tone(root + (q % 4 === 3 ? 12 : q % 8 === 6 ? 7 : 0), t, sp * 0.9, 'sawtooth', 0.04, S.mus); S.tone(root + 12 + [0, 7, third, 7][q % 4], t, sp * .7, 'triangle', 0.022, S.mus);
    if (q === 0) { S.pad(root + 12, t, sp * 14, 'sawtooth', 0.028, S.mus, sp * 2); S.pad(root + 12 + third, t, sp * 14, 'sawtooth', 0.02, S.mus, sp * 2); S.pad(root + 19, t, sp * 14, 'triangle', 0.03, S.mus, sp * 2); }
    if (bar >= 4) { const m = MOTIF[(s - 64) >> 1]; if (m && !(s & 1)) { S.pad(m + 12, t, sp * 6, 'sawtooth', 0.04, S.mus, 0.03); S.pad(m + 12.06, t, sp * 6, 'square', 0.018, S.mus, 0.03); S.tone(m, t, sp * 5, 'triangle', 0.04, S.mus); } }
    else { const lead = [[74, 0, 0, 77, 0, 0, 81, 0, 79, 0, 77, 0, 74, 0, 72, 0], [74, 0, 0, 77, 0, 0, 81, 0, 84, 0, 0, 82, 81, 0, 0, 0], [70, 0, 0, 74, 0, 0, 77, 0, 82, 0, 81, 0, 77, 0, 74, 0], [72, 0, 76, 0, 79, 0, 84, 0, 86, 0, 0, 0, 85, 0, 0, 0]][bar][q]; if (lead) { S.tone(lead, t, sp * 1.8, 'square', 0.026, S.mus); S.tone(lead - 12, t, sp * 1.8, 'triangle', 0.03, S.mus); } }
  } },
  spire: { bpm: 84, len: 64, fn(s, t, sp, S) { // above the weather: glass and distance, her tune only in the second half
    const bar = s >> 4, q = s % 16, root = [50, 50, 46, 48][bar]; if (q === 0) { S.pad(root, t, sp * 15, 'sine', 0.05, S.mus, sp * 3); S.pad(root + 7, t, sp * 15, 'triangle', 0.025, S.mus, sp * 3); S.pad(root + 15, t, sp * 15, 'sine', 0.018, S.mus, sp * 3); }
    if (q % 4 === 2) S.tone(root + 24 + [0, 3, 7, 10][(s >> 2) % 4], t, sp * 3, 'sine', 0.03, S.mus); if (q % 8 === 0) S.noise(t, 0.03, 0.02, S.mus, 9000, 4, 'highpass');
    const m = MOTIF[s >> 1]; if (m && !(s & 1) && bar >= 2) S.tone(m + 24, t, sp * 5, 'triangle', 0.028, S.mus); } },
  final: { bpm: 150, len: 128, fn(s, t, sp, S) { // the last duel: the keep's clock with the whole tier humming under it
    TRACKS.duel.fn(s, t, sp, S); const m = MOTIF[(s >> 2) % 32]; if (m && s % 4 === 0) { S.tone(m - 12, t, sp * 7, 'triangle', 0.06, S.mus); S.tone(m, t, sp * 7, 'sine', 0.035, S.mus); S.tone(m - 5, t, sp * 7, 'sine', 0.02, S.mus); }
    if (s % 16 === 0) S.tone(98, t, 0.3, 'sine', 0.3, S.mus, 36); if (s % 16 === 8) S.noise(t, 0.16, 0.14, S.mus, 1400, 3); } },
  dawn: { bpm: 60, len: 32, fn(s, t, sp, S) { // the shift song, for the first time in a major key
    const MJ = { 0: 62, 4: 66, 8: 69, 12: 67, 16: 66, 20: 64, 24: 62 }, m = MJ[s]; if (m) { S.tone(m, t, sp * 3.8, 'triangle', 0.07, S.mus); S.tone(m + 12, t, sp * 3.8, 'sine', 0.03, S.mus); S.tone(m - 12, t, sp * 3.8, 'sine', 0.04, S.mus); }
    if (s % 8 === 0) { const r = [50, 45, 43, 50][s >> 3]; S.pad(r, t, sp * 8, 'sine', 0.06, S.mus, sp * 2); S.pad(r + 7, t, sp * 8, 'triangle', 0.03, S.mus, sp * 2); S.pad(r + 16, t, sp * 8, 'sine', 0.02, S.mus, sp * 2); } } },
  hum: { bpm: 56, len: 32, fn(s, t, sp, S) { const m = MOTIF[s]; if (m) { S.tone(m - 12, t, sp * 3.8, 'triangle', 0.07, S.mus); S.tone(m - 5, t, sp * 3.8, 'sine', 0.03, S.mus); } if (s === 0) S.tone(38, t, sp * 32, 'sine', 0.05, S.mus); } },
  surface: { bpm: 70, len: 32, fn(s, t, sp, S) { const m = MOTIF[s]; if (m) { S.tone(m + 24, t, 2, 'sine', 0.03, S.mus); S.tone(m + 31, t, 2, 'sine', 0.015, S.mus); } } }
};

// ---------- layout: integer scaling where possible, safe areas, portrait mode
const Layout = {
  portrait: false, rect: { x: 0, y: 0, w: W, h: H },
  safe() { const s = getComputedStyle($('#safe')); return { t: parseFloat(s.paddingTop) || 0, r: parseFloat(s.paddingRight) || 0, b: parseFloat(s.paddingBottom) || 0, l: parseFloat(s.paddingLeft) || 0 }; },
  update() {
    const vw = innerWidth, vh = innerHeight, sa = this.safe();
    const portrait = this.portrait = vh > vw * 1.1;
    const lw = portrait ? 208 : 320, cvs = $('#game');
    if (W !== lw) { W = lw; cvs.width = W; cvs.getContext('2d').imageSmoothingEnabled = false; }
    let s;
    if (!portrait) { s = Math.min((vw - sa.l - sa.r) / W, (vh - sa.t - sa.b) / H); }
    else { s = Math.min((vw - sa.l - sa.r - 12) / W, (vh * 0.52) / H); }
    if (s >= 2) s = Math.floor(s);
    const cw = Math.round(W * s), ch = Math.round(H * s);
    const cx = Math.round((vw - cw) / 2), cy = Math.round(portrait ? sa.t + 8 : (vh - ch) / 2);
    const c = $('#game'); Object.assign(c.style, { left: cx + 'px', top: cy + 'px', width: cw + 'px', height: ch + 'px' });
    this.rect = { x: cx, y: cy, w: cw, h: ch };
    const r = document.documentElement.style;
    r.setProperty('--cx', cx + 'px'); r.setProperty('--cy', cy + 'px'); r.setProperty('--cw', cw + 'px'); r.setProperty('--ch', ch + 'px');
    r.setProperty('--rx', (vw - cx - cw) + 'px'); r.setProperty('--by', (vh - cy - ch) + 'px');
    document.body.classList.toggle('portrait', portrait);
    const t = Settings.d.touch, show = t === 'on' || (t === 'auto' && (Input.touchSeen || matchMedia('(pointer: coarse)').matches));
    document.body.classList.toggle('touch', show);
  }
};

const Debug = {
  on: false, fps: 0, frames: 0, acc: 0,
  toggle() { this.on = !this.on; $('#dbg').classList.toggle('hidden', !this.on); },
  frame(dt) { this.frames++; this.acc += dt; if (this.acc >= 0.5) { this.fps = Math.round(this.frames / this.acc); this.frames = 0; this.acc = 0; if (this.on) this.draw(); } },
  draw() { $('#dbg').textContent = `fps ${this.fps}  mode ${G.mode}\nmap ${G.mapId}  pos ${P.x | 0},${P.y | 0}\nscrip ${G.scrip} trust ${JSON.stringify(G.trust)}\nflags ${Object.keys(G.flags).join(' ')}\nstorage ${Store.ok ? 'local' : 'memory'}  input ${Input.device}`; }
};
