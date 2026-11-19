'use strict';
/* GODMODE.EXE: sound. All synthesised with WebAudio; nothing is loaded. */

const AU = { ctx: null, master: null, nextNote: 0 };

function auInit() {
  if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    AU.ctx = new C();
    AU.master = AU.ctx.createGain();
    AU.master.gain.value = 0.5;
    AU.master.connect(AU.ctx.destination);
  } catch (e) { AU.ctx = null; }
}
function auSuspend(on) {
  if (!AU.ctx) return;
  try { if (on) AU.ctx.suspend(); else AU.ctx.resume(); } catch (e) { /* ignore */ }
}
function tone(freq, dur, type, vol, delay, slide) {
  const c = AU.ctx, t0 = c.currentTime + (delay || 0);
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(AU.master);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
function noise(dur, vol, delay, cutoff) {
  const c = AU.ctx, t0 = c.currentTime + (delay || 0);
  const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(); s.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff || 1800;
  const g = c.createGain(); g.gain.value = vol || 0.3;
  s.connect(f); f.connect(g); g.connect(AU.master);
  s.start(t0);
}
function sfx(name) {
  if (!AU.ctx || !APP.settings.sound || AU.ctx.state !== 'running') return;
  switch (name) {
    case 'click': tone(660, 0.05, 'square', 0.07); break;
    case 'deny': tone(160, 0.12, 'square', 0.12); tone(120, 0.16, 'square', 0.12, 0.1); break;
    case 'bless': [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, 'triangle', 0.16, i * 0.07)); break;
    case 'smite': noise(0.5, 0.55, 0, 3200); tone(220, 0.45, 'sawtooth', 0.22, 0, 40); noise(0.9, 0.25, 0.12, 500); break;
    case 'create': tone(330, 0.1, 'square', 0.1); tone(494, 0.1, 'square', 0.1, 0.07); tone(740, 0.16, 'square', 0.1, 0.14); break;
    case 'inspire': [880, 1175, 1568].forEach((f, i) => tone(f, 0.5, 'sine', 0.13, i * 0.09)); tone(220, 0.6, 'triangle', 0.08); break;
    case 'grab': tone(300, 0.14, 'triangle', 0.14, 0, 700); break;
    case 'drop': tone(500, 0.12, 'triangle', 0.14, 0, 180); break;
    case 'observe': tone(990, 0.06, 'sine', 0.09); tone(1320, 0.1, 'sine', 0.07, 0.05); break;
    case 'built': tone(392, 0.12, 'square', 0.1); tone(523, 0.12, 'square', 0.1, 0.1); tone(659, 0.25, 'square', 0.1, 0.2); break;
    case 'birth': [659, 784, 988].forEach((f, i) => tone(f, 0.16, 'triangle', 0.13, i * 0.09)); break;
    case 'death': tone(330, 0.5, 'triangle', 0.14, 0, 110); break;
    case 'convert': tone(740, 0.09, 'sine', 0.07); tone(932, 0.14, 'sine', 0.06, 0.06); break;
    case 'argue': tone(140, 0.08, 'sawtooth', 0.07); tone(170, 0.08, 'sawtooth', 0.07, 0.09); break;
    case 'stage': [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'square', 0.09, i * 0.08)); break;
    case 'age': tone(196, 0.9, 'triangle', 0.12); tone(294, 0.9, 'triangle', 0.1, 0.05); tone(392, 0.9, 'triangle', 0.08, 0.1); break;
    case 'sing':
      tone(55, 6, 'sawtooth', 0.16, 0, 110); tone(110, 6, 'triangle', 0.14, 0, 220);
      [262, 330, 392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 1.2, 'sine', 0.09, 0.8 + i * 0.35));
      noise(2.5, 0.2, 0, 700);
      break;
  }
}
/* a sparse, generative lullaby so the island is never silent */
const SCALE = [196, 220, 262, 294, 330, 392, 440, 523, 587, 659];
function auAmbient(S, dt) {
  if (!AU.ctx || !APP.settings.sound || AU.ctx.state !== 'running') return;
  AU.nextNote -= dt;
  if (AU.nextNote > 0) return;
  const night = isNight(S);
  AU.nextNote = (night ? 2.6 : 1.5) + Math.random() * 2.2;
  const i = (Math.random() * (night ? 5 : SCALE.length)) | 0;
  const f = SCALE[i] * (S.age === DREAD ? 0.5 : 1);
  tone(f, 2.4, 'sine', 0.035);
  if (Math.random() < 0.35) tone(f * 1.5, 2.0, 'sine', 0.02, 0.25);
}
