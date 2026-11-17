// Starhaven — sound effects, synthesized with Web Audio (no files). Placeholder until real sounds and Will's music arrive.
// Browsers only allow sound after the first tap, key or button press, so `unlock` is called on any input.
(function (SH) {
  const A = SH.sfx = {};
  let ctx = null, master = null;

  A.unlock = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination);
      A.volume();
    } catch (e) { ctx = null; }
  };
  A.volume = function () { if (master) master.gain.value = (SH.settings.sfx != null ? SH.settings.sfx : 70) / 100 * 0.5; };

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
    blip: () => tone({ f: 700 + Math.random() * 120, d: 0.025, v: 0.025, type: 'square' }),
    move: () => tone({ f: 660, d: 0.04, v: 0.06, type: 'square' }),
    select: () => { tone({ f: 660, d: 0.05, v: 0.08 }); tone({ f: 990, d: 0.08, v: 0.08, delay: 0.05 }); },
    back: () => { tone({ f: 500, d: 0.05, v: 0.07 }); tone({ f: 330, d: 0.08, v: 0.07, delay: 0.05 }); },
    save: () => { tone({ f: 880, d: 0.08, v: 0.05, type: 'sine' }); tone({ f: 1320, d: 0.12, v: 0.05, type: 'sine', delay: 0.07 }); },
    thud: () => { tone({ f: 90, f2: 40, d: 0.4, v: 0.35, type: 'sine' }); noise({ d: 0.3, freq: 400, v: 0.25 }); },
    rumble: () => { tone({ f: 55, f2: 35, d: 1.2, v: 0.3, type: 'sawtooth' }); noise({ d: 1, freq: 200, v: 0.2 }); },
    chime: () => { [784, 1175].forEach((f, i) => tone({ f, d: 1.2, v: 0.06, type: 'sine', delay: i * 0.2 })); },
  };
  A.play = function (name) { if (S[name]) try { S[name](); } catch (e) { /* never break the game for a sound */ } };
})(window.SH = window.SH || {});
