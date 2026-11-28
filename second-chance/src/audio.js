'use strict';
/* SECOND CHANCE - audio: everything is synthesised, so the game stays one file. */
(function () {
  const A = SC.audio = { on: true, ctx: null, combat: 0 };
  let ctx, master, mus, noiseBuf, next = 0, stepN = 0, seq = 0;
  A.unlock = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = A.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = A.on ? 0.8 : 0; master.connect(ctx.destination);
    mus = ctx.createGain(); mus.gain.value = 0.5; mus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    next = ctx.currentTime + 0.1;
  };
  A.toggle = function () { A.on = !A.on; if (master) master.gain.value = A.on ? 0.8 : 0; return A.on; };
  function tone(f, dur, o) {
    o = o || {}; const t = (o.at || ctx.currentTime), os = ctx.createOscillator(), g = ctx.createGain();
    os.type = o.type || 'square'; os.frequency.setValueAtTime(f, t); if (o.to) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.gain || 0.2, t + (o.att || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    os.connect(g); g.connect(o.out || master); os.start(t); os.stop(t + dur + 0.02);
  }
  function noise(dur, o) {
    o = o || {}; const t = (o.at || ctx.currentTime), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true; f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1200, t); if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur); f.Q.value = o.q || 1;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.gain || 0.3, t + (o.att || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(o.out || master); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  const S = {
    whoosh: v => noise(0.16, { f: v ? 500 : 900, to: v ? 1600 : 2600, q: 1.4, gain: 0.22, att: 0.03 }),
    hit: v => { noise(0.1, { f: 1800, to: 500, gain: 0.45 }); tone(v ? 110 : 170, v ? 0.22 : 0.12, { type: 'sine', to: 50, gain: v ? 0.6 : 0.4 }); if (v) noise(0.25, { f: 300, to: 90, type: 'lowpass', gain: 0.5 }); },
    hurt: () => { tone(220, 0.22, { type: 'sawtooth', to: 70, gain: 0.3 }); noise(0.14, { f: 900, to: 300, gain: 0.4 }); },
    dodge: () => noise(0.22, { f: 400, to: 2400, q: 0.8, gain: 0.25, att: 0.04 }),
    perfect: () => { tone(880, 0.5, { type: 'triangle', to: 1760, gain: 0.25 }); tone(1320, 0.6, { type: 'sine', gain: 0.18 }); },
    land: () => tone(120, 0.14, { type: 'sine', to: 50, gain: 0.4 }),
    step: () => noise(0.035, { f: 500 + (stepN++ % 2) * 160, q: 2, gain: 0.07 }),
    crate: () => { noise(0.22, { f: 700, to: 200, gain: 0.5 }); tone(190, 0.1, { type: 'square', to: 80, gain: 0.2 }); },
    pickup: () => { tone(660, 0.1, { type: 'triangle', gain: 0.22 }); tone(990, 0.2, { type: 'triangle', gain: 0.22, at: ctx.currentTime + 0.08 }); },
    deny: () => tone(140, 0.14, { type: 'square', to: 100, gain: 0.16 }),
    ui: () => tone(520, 0.06, { type: 'square', gain: 0.12 }),
    blip: () => tone(300 + Math.random() * 60, 0.03, { type: 'square', gain: 0.05 }),
    lock: () => { tone(700, 0.06, { type: 'square', gain: 0.14 }); tone(1050, 0.08, { type: 'square', gain: 0.14, at: ctx.currentTime + 0.06 }); },
    alert: () => tone(980, 0.11, { type: 'square', to: 1300, gain: 0.1 }),
    leap: () => noise(0.4, { f: 300, to: 1800, q: 0.9, gain: 0.26, att: 0.1 }),
    ember: () => { noise(0.9, { f: 500, to: 80, type: 'lowpass', gain: 0.9 }); tone(70, 0.7, { type: 'sine', to: 30, gain: 0.9 }); noise(0.5, { f: 3000, to: 800, gain: 0.25 }); },
    shade: () => { noise(0.3, { f: 2600, to: 200, q: 2, gain: 0.3, att: 0.12 }); tone(330, 0.3, { type: 'sine', to: 80, gain: 0.2 }); },
    shadeHit: () => { noise(0.14, { f: 4000, to: 1500, q: 3, gain: 0.5 }); tone(98, 0.3, { type: 'sine', to: 40, gain: 0.6 }); },
    chainThrow: () => noise(0.2, { f: 1200, to: 3200, q: 3, gain: 0.2, att: 0.05 }),
    chain: () => { for (let i = 0; i < 6; i++) tone(1500 + Math.random() * 1400, 0.07, { type: 'square', gain: 0.07, at: ctx.currentTime + i * 0.035 }); },
    chainYank: () => { for (let i = 0; i < 5; i++) tone(2400 - i * 300, 0.06, { type: 'square', gain: 0.08, at: ctx.currentTime + i * 0.025 }); tone(90, 0.3, { type: 'sine', to: 40, gain: 0.6 }); },
    finishWind: () => tone(90, 0.5, { type: 'sawtooth', to: 400, gain: 0.2, att: 0.3 }),
    finish: () => { noise(1.0, { f: 800, to: 60, type: 'lowpass', gain: 1 }); tone(60, 0.9, { type: 'sine', to: 28, gain: 1 }); tone(440, 0.7, { type: 'triangle', to: 880, gain: 0.2 }); },
    revive: () => { tone(110, 1.1, { type: 'sawtooth', to: 880, gain: 0.25, att: 0.2 }); noise(0.8, { f: 200, to: 4000, gain: 0.4, att: 0.3 }); },
    slam: () => { noise(0.5, { f: 400, to: 70, type: 'lowpass', gain: 0.8 }); tone(60, 0.5, { type: 'sine', to: 30, gain: 0.8 }); },
    roar: () => { tone(90, 0.9, { type: 'sawtooth', to: 55, gain: 0.4 }); noise(0.9, { f: 500, to: 200, q: 2, gain: 0.3 }); },
    dazed: () => { tone(1200, 0.12, { type: 'triangle', gain: 0.2 }); tone(900, 0.12, { type: 'triangle', gain: 0.2, at: ctx.currentTime + 0.1 }); tone(1200, 0.2, { type: 'triangle', gain: 0.2, at: ctx.currentTime + 0.2 }); },
    dissolve: () => noise(0.5, { f: 3000, to: 300, q: 1.5, gain: 0.2, att: 0.05 }),
    door: () => { noise(1.1, { f: 180, to: 120, q: 4, gain: 0.5, att: 0.1 }); tone(70, 1, { type: 'sawtooth', gain: 0.1 }); },
    clue: () => { tone(523, 0.12, { type: 'triangle', gain: 0.2 }); tone(784, 0.3, { type: 'triangle', gain: 0.2, at: ctx.currentTime + 0.1 }); },
    path: () => { tone(196, 1.2, { type: 'sawtooth', to: 392, gain: 0.2, att: 0.3 }); tone(784, 1, { type: 'triangle', gain: 0.2, at: ctx.currentTime + 0.4 }); noise(1.1, { f: 300, to: 5000, gain: 0.25, att: 0.5 }); },
    page: () => noise(0.12, { f: 2400, to: 900, q: 1, gain: 0.16 }),
    fuse: () => noise(0.4, { f: 3000, to: 5000, q: 6, gain: 0.12 }),
    boom: () => { noise(1.1, { f: 600, to: 50, type: 'lowpass', gain: 1 }); tone(55, 0.9, { type: 'sine', to: 25, gain: 0.9 }); noise(0.3, { f: 2500, to: 600, gain: 0.4 }); },
    splat: () => { noise(0.18, { f: 900, to: 200, q: 2, gain: 0.6 }); tone(90, 0.2, { type: 'sine', to: 40, gain: 0.6 }); },
    splash: () => { noise(0.35, { f: 2600, to: 400, q: 1.2, gain: 0.4 }); tone(800, 0.08, { type: 'triangle', to: 1600, gain: 0.1 }); },
    coin: () => { tone(1320, 0.06, { type: 'square', gain: 0.08 }); tone(1760, 0.1, { type: 'square', gain: 0.08, at: ctx.currentTime + 0.05 }); },
    climb: () => tone(220 + Math.random() * 40, 0.05, { type: 'square', gain: 0.08 }),
    gunshot: () => { noise(0.25, { f: 3000, to: 300, gain: 0.9 }); tone(140, 0.2, { type: 'square', to: 50, gain: 0.4 }); },
    echo: () => { tone(330, 1.6, { type: 'sine', to: 165, gain: 0.25, att: 0.4 }); tone(495, 1.6, { type: 'sine', to: 247, gain: 0.15, att: 0.6 }); noise(1.4, { f: 6000, to: 800, q: 4, gain: 0.08, att: 0.6 }); },
    ascend: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.9, { type: 'sine', gain: 0.16, att: 0.1, at: ctx.currentTime + i * 0.18 })); }
  };
  A.sfx = function (name, v) { if (!ctx || !A.on || !S[name]) return; try { S[name](v); } catch (e) { /* audio is never worth a crash */ } };

  /* a slow walking bass for the streets, drums when it turns into a fight */
  const BASS = [38, 0, 38, 41, 0, 43, 0, 36, 38, 0, 45, 43, 0, 41, 36, 0], LEAD = [62, 65, 69, 0, 67, 65, 0, 62];
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  A.tick = function (inCombat) {
    if (!ctx || !A.on) return; A.combat += ((inCombat ? 1 : 0) - A.combat) * 0.03;
    const stepT = 60 / (inCombat ? 118 : 92) / 2;
    while (next < ctx.currentTime + 0.15) {
      const i = seq++ % 16, b = BASS[i];
      if (b) tone(hz(b), stepT * 1.7, { type: 'triangle', gain: 0.3, at: next, out: mus });
      if (i % 2 === 0) noise(0.04, { f: 7000, q: 1, gain: 0.05 + (i % 4 === 0 ? 0.04 : 0), at: next, out: mus });
      if (A.combat > 0.4) {
        if (i % 8 === 0 || i % 8 === 5) tone(110, 0.16, { type: 'sine', to: 40, gain: 0.55, at: next, out: mus });
        if (i % 8 === 4) noise(0.14, { f: 1700, q: 0.8, gain: 0.3, at: next, out: mus });
        if (i % 2 === 1) tone(hz(LEAD[(i >> 1) % 8] || 62) * 2, stepT * 0.8, { type: 'square', gain: 0.045, at: next, out: mus });
      } else if (i % 4 === 2 && LEAD[(seq >> 2) % 8]) tone(hz(LEAD[(seq >> 2) % 8]), stepT * 3, { type: 'sine', gain: 0.07, att: 0.08, at: next, out: mus });
      next += stepT;
    }
  };
})();
