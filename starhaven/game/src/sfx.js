// Starhaven — sound effects, synthesized with Web Audio (no files). Placeholder until real sounds and Will's music arrive.
// Browsers only allow sound after the first tap, key or button press, so `unlock` is called on any input.
(function (SH) {
  const A = SH.sfx = {};
  let ctx = null, master = null, mus = null;

  A.unlock = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination);
      mus = ctx.createGain(); mus.connect(ctx.destination);
      setInterval(A.tick, 60);
      A.volume();
    } catch (e) { ctx = null; }
  };
  A.volume = function () {
    if (master) master.gain.value = (SH.settings.sfx != null ? SH.settings.sfx : 70) / 100 * 0.5;
    if (mus) mus.gain.value = (SH.settings.music != null ? SH.settings.music : 50) / 100 * 0.35;
  };

  function tone(o) {
    if (!ctx || !SH.settings.sfx) return;
    const t = ctx.currentTime + (o.delay || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v || 0.3, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + o.d + 0.02);
  }
  function noise(o) {
    if (!ctx || !SH.settings.sfx) return;
    const t = ctx.currentTime + (o.delay || 0), len = Math.max(1, Math.floor(ctx.sampleRate * o.d));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; f.type = o.filter || 'lowpass'; f.frequency.value = o.freq || 2000;
    g.gain.value = o.v || 0.3;
    src.connect(f); f.connect(g); g.connect(master); src.start(t);
  }

  const S = {
    jump: () => tone({ f: 300, f2: 520, d: 0.1, v: 0.12 }),
    djump: () => { tone({ f: 500, f2: 900, d: 0.12, v: 0.12, type: 'triangle' }); tone({ f: 900, f2: 1300, d: 0.1, v: 0.06, type: 'sine', delay: 0.03 }); },
    land: () => noise({ d: 0.05, freq: 600, v: 0.12 }),
    dash: () => noise({ d: 0.16, freq: 3000, filter: 'bandpass', v: 0.25 }),
    slash: () => noise({ d: 0.08, freq: 5000, filter: 'highpass', v: 0.18 }),
    hit: () => { tone({ f: 220, f2: 90, d: 0.09, v: 0.22 }); noise({ d: 0.06, freq: 1500, v: 0.2 }); },
    kill: () => { tone({ f: 330, f2: 60, d: 0.25, v: 0.22 }); noise({ d: 0.2, freq: 900, v: 0.2 }); },
    hurt: () => { tone({ f: 180, f2: 70, d: 0.25, v: 0.25, type: 'sawtooth' }); },
    pogo: () => { tone({ f: 420, f2: 840, d: 0.12, v: 0.16, type: 'triangle' }); },
    bow: () => { noise({ d: 0.12, freq: 2500, filter: 'bandpass', v: 0.2 }); tone({ f: 160, f2: 120, d: 0.08, v: 0.1, type: 'triangle' }); },
    lantern: () => { [523, 659, 784].forEach((f, i) => tone({ f, d: 0.35, v: 0.08, type: 'sine', delay: i * 0.07 })); },
    heart: () => { [659, 784, 988, 1319].forEach((f, i) => tone({ f, d: 0.4, v: 0.09, type: 'sine', delay: i * 0.09 })); },
    paint: () => tone({ f: 600 + Math.random() * 300, d: 0.05, v: 0.03, type: 'sine' }),
    mural: () => { [392, 523, 659, 784, 1047].forEach((f, i) => tone({ f, d: 0.6, v: 0.08, type: 'sine', delay: i * 0.08 })); },
    mote: () => { tone({ f: 1320, d: 0.07, v: 0.05, type: 'sine' }); tone({ f: 1760, d: 0.12, v: 0.04, type: 'sine', delay: 0.05 }); },
    blip: () => tone({ f: 700 + Math.random() * 120, d: 0.025, v: 0.025, type: 'square' }),
    move: () => tone({ f: 660, d: 0.04, v: 0.06, type: 'square' }),
    select: () => { tone({ f: 660, d: 0.05, v: 0.08 }); tone({ f: 990, d: 0.08, v: 0.08, delay: 0.05 }); },
    back: () => { tone({ f: 500, d: 0.05, v: 0.07 }); tone({ f: 330, d: 0.08, v: 0.07, delay: 0.05 }); },
    save: () => { tone({ f: 880, d: 0.08, v: 0.05, type: 'sine' }); tone({ f: 1320, d: 0.12, v: 0.05, type: 'sine', delay: 0.07 }); },
    thud: () => { tone({ f: 90, f2: 40, d: 0.4, v: 0.35, type: 'sine' }); noise({ d: 0.3, freq: 400, v: 0.25 }); },
    rumble: () => { tone({ f: 55, f2: 35, d: 1.2, v: 0.3, type: 'sawtooth' }); noise({ d: 1, freq: 200, v: 0.2 }); },
    chime: () => { [784, 1175].forEach((f, i) => tone({ f, d: 1.2, v: 0.06, type: 'sine', delay: i * 0.2 })); },
  };
  // ---------------------------------------------------------------- music
  // Placeholder themes, synthesized: a step sequencer per place. Will's own tracks replace these later.
  const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
  function note(n, t, d, type, v) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(mtof(n), t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.05, d / 4)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(mus); o.start(t); o.stop(t + d + 0.05);
  }
  function hiss(t, d, v, freq) {
    const len = Math.floor(ctx.sampleRate * d), buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len);
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = v; src.connect(f); f.connect(g); g.connect(mus); src.start(t);
  }
  // The Starhaven motif (original): D F A G | F E D, heard in the city and echoed elsewhere.
  const MOTIF = { 0: 62, 6: 65, 12: 69, 18: 67, 32: 65, 38: 64, 44: 62 };
  const TRACKS = {
    // the winter woods: cold, sparse, a lonely plucked line over a low drone
    woods: { bpm: 60, len: 64, fn(s, t, sp) {
      if (s % 32 === 0) { note(45, t, sp * 30, 'sine', 0.10); note(52, t, sp * 30, 'sine', 0.05); }
      const m = { 0: 76, 6: 72, 10: 69, 20: 71, 26: 72, 36: 76, 40: 79, 46: 76, 54: 72, 58: 69 }[s];
      if (m) note(m, t, sp * 5, 'triangle', 0.07);
      if (s % 16 === 8) hiss(t, 2.4, 0.03, 900);
    } },
    // Under the Mountain: a drone, something dripping, something wrong
    deep: { bpm: 50, len: 64, fn(s, t, sp) {
      if (s % 32 === 0) { note(38, t, sp * 31, 'sine', 0.14); note(39, t + 1, sp * 20, 'sine', 0.04); }
      if (s % 16 === 0) note(26, t, 0.7, 'sine', 0.2);
      const b = { 5: 86, 21: 81, 30: 87, 43: 82, 57: 86 }[s]; if (b) note(b, t, 2.2, 'sine', 0.03);
      if (s % 32 === 20) hiss(t, 3, 0.03, 300);
    } },
    // Starhaven: warm chords and the motif
    city: { bpm: 72, len: 64, fn(s, t, sp) {
      const bar = s >> 4, ch = [[50, 57, 65], [46, 53, 62], [41, 53, 60], [48, 55, 64]][bar];
      if (s % 16 === 0) { for (const n of ch) note(n + 12, t, sp * 15, 'triangle', 0.045); note(ch[0] - 12, t, sp * 14, 'sine', 0.10); }
      if (s % 4 === 2) note(ch[(s >> 2) % 3] + 24, t, sp * 2, 'sine', 0.03);
      const m = MOTIF[s]; if (m) note(m + 12, t, sp * 5, 'sine', 0.07);
    } },
    // the mountain: open fifths and wind
    mountain: { bpm: 66, len: 64, fn(s, t, sp) {
      if (s % 32 === 0) { note(43, t, sp * 30, 'sine', 0.10); note(50, t, sp * 30, 'sine', 0.06); }
      const m = { 0: 74, 8: 79, 14: 77, 24: 74, 32: 72, 40: 74, 48: 67, 56: 69 }[s]; if (m) note(m, t, sp * 7, 'triangle', 0.05);
      if (s % 16 === 4) hiss(t, 3.2, 0.045, 600 + (s % 32) * 20);
    } },
    // the Wyrm: a pulse you can't outrun
    tense: { bpm: 138, len: 32, fn(s, t, sp) {
      const bass = [38, 38, 0, 38, 41, 0, 38, 0, 38, 38, 0, 38, 43, 0, 41, 0][s % 16];
      if (bass) note(bass, t, sp * 0.9, 'sawtooth', 0.09);
      if (s % 8 === 4) hiss(t, 0.12, 0.12, 2400);
      if (s % 4 === 0) note(26, t, 0.12, 'sine', 0.22);
      const m = { 0: 74, 6: 73, 12: 74, 16: 77, 22: 76, 28: 74 }[s]; if (m) note(m, t, sp * 3, 'square', 0.025);
    } },
  };
  // the opening film: winter, then thorns, then the turn, then the motif arriving home (through-composed, about 26 seconds)
  TRACKS.film = { bpm: 66, len: 128, fn(s, t, sp) {
    if (s < 32) {                                     // the hunt, the Wall: cold and thin
      if (s % 16 === 0) { note(45, t, sp * 15, 'sine', 0.11); note(52, t, sp * 15, 'sine', 0.05); }
      const m = { 0: 76, 6: 72, 10: 69, 16: 71, 22: 72, 26: 76, 30: 74 }[s]; if (m) note(m, t, sp * 5, 'triangle', 0.07);
      if (s % 16 === 8) hiss(t, 2.4, 0.03, 900);
    } else if (s < 64) {                              // the Queen, the trials: low, wrong, a slow heart
      if (s % 16 === 0) { note(38, t, sp * 15, 'sine', 0.15); note(39, t + 0.5, sp * 10, 'sine', 0.05); note(44, t, sp * 15, 'sawtooth', 0.018); }
      if (s % 8 === 0) { note(26, t, 0.5, 'sine', 0.22); note(26, t + 0.28, 0.4, 'sine', 0.13); }
      const m = { 36: 74, 42: 73, 48: 70, 54: 69, 60: 68 }[s]; if (m) note(m, t, sp * 5, 'triangle', 0.05);
      if (s === 62) hiss(t, 1.6, 0.06, 2000);
    } else if (s < 96) {                              // his blood, the bond waking: everything rises
      const k = s - 64, arp = [50, 57, 62, 65, 69, 74, 77, 81][k >> 2];
      if (k % 4 === 0) { note(arp, t, sp * 10, 'triangle', 0.05 + k * 0.0012); note(arp + 12, t + sp, sp * 6, 'sine', 0.035); }
      if (k % 16 === 0) { note(38, t, sp * 15, 'sine', 0.12); note(50, t, sp * 15, 'triangle', 0.05); }
      if (k === 28) { hiss(t, 1.8, 0.05, 3200); note(86, t, sp * 6, 'sine', 0.05); }
    } else {                                          // Starhaven: the motif, warm, at last
      const k = s - 96, ch = k < 16 ? [50, 57, 65] : [46, 53, 62];
      if (k % 16 === 0) { for (const n of ch) note(n + 12, t, sp * 15, 'triangle', 0.055); note(ch[0] - 12, t, sp * 15, 'sine', 0.12); }
      const m = { 0: 62, 3: 65, 6: 69, 9: 67, 16: 65, 19: 64, 22: 62 }[k]; if (m) { note(m + 12, t, sp * 5, 'sine', 0.09); note(m + 24, t, sp * 4, 'sine', 0.03); }
      if (k % 4 === 2) note(ch[(k >> 2) % 3] + 24, t, sp * 2, 'sine', 0.025);
    }
  } };
  let track = null, trackName = null, step = 0, next = 0;
  A.music = function (name) {
    if (trackName === name) return;
    trackName = name; track = TRACKS[name] || null; step = 0;
    if (ctx) next = ctx.currentTime + 0.3;
  };
  A.tick = function () {
    if (!ctx || !track || ctx.state !== 'running' || !SH.settings.music) return;
    const sp = 60 / track.bpm / 4, now = ctx.currentTime;
    if (next < now - 0.5) next = now + 0.05;
    while (next < now + 0.25) { try { track.fn(step % track.len, next, sp); } catch (e) { /* never break the game for a note */ } step++; next += sp; }
  };

  A.play = function (name) { if (S[name]) try { S[name](); } catch (e) { /* never break the game for a sound */ } };
})(window.SH = window.SH || {});
