// Guttercrown — procedural music. No audio files: a small step sequencer drives synth voices through WebAudio.
(function () {
  const G = window.G;
  const N = { C: 0, D: 2, Eb: 3, E: 4, F: 5, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  const hz = (semi) => 55 * Math.pow(2, semi / 12);            // semitones above A1
  const MINOR = [0, 2, 3, 5, 7, 8, 10], DORIAN = [0, 2, 3, 5, 7, 9, 10], PENTA = [0, 3, 5, 7, 10], MAJP = [0, 2, 4, 7, 9];
  // drum strings: x = hit, . = rest, 16 steps per bar. chords are scale degrees for each bar.
  const TRACKS = {
    title: { bpm: 66, root: 5, scale: DORIAN, chords: [0, 5, 3, 4], kick: 'x.......x.......', tom: '......x.......x.', pluck: 0.5, pad: 0.05, bass: 0.07, lead: 0, vol: 0.9 },
    hub: { bpm: 88, root: 7, scale: DORIAN, chords: [0, 3, 6, 4], kick: 'x.....x...x.....', tom: '....x.......x..x', pluck: 0.75, pad: 0.035, bass: 0.06, lead: 0, vol: 0.8 },
    home: { bpm: 60, root: 10, scale: MAJP, chords: [0, 2, 3, 1], kick: '................', tom: '................', pluck: 0.55, pad: 0.05, bass: 0.035, lead: 0, vol: 0.8, soft: 1 },
    fight: { bpm: 132, root: 5, scale: MINOR, chords: [0, 0, 5, 6], kick: 'x..x..x.x..x..x.', tom: '....x.......x.xx', hat: 'x.x.x.x.x.x.x.x.', pluck: 0.35, pad: 0.03, bass: 0.13, lead: 0.5, vol: 1 },
    boss: { bpm: 148, root: 3, scale: MINOR, chords: [0, 5, 3, 6], kick: 'x.x...x.x.x...x.', tom: '....x..x....x.xx', hat: 'xxx.xxx.xxx.xxx.', pluck: 0.4, pad: 0.04, bass: 0.15, lead: 0.65, vol: 1 }
  };
  let ac = null, out = null, cur = null, want = null, step = 0, nextT = 0, timer = 0, seed = 1;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  function env(node, t, a, d, peak) { const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); node.connect(g); g.connect(out); return g; }
  function osc(type, f, t, a, d, peak, slideTo) { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + d); env(o, t, a, d, peak); o.start(t); o.stop(t + a + d + 0.05); }
  let noiseBuf = null;
  function noise(t, d, peak, freq, type) {
    if (!noiseBuf) { noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
    const s = ac.createBufferSource(); s.buffer = noiseBuf; const f = ac.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; s.connect(f); env(f, t, 0.002, d, peak); s.start(t, Math.random() * 0.5); s.stop(t + d + 0.05);
  }
  const deg = (tr, d, oct) => hz(tr.root + tr.scale[((d % tr.scale.length) + tr.scale.length) % tr.scale.length] + 12 * (oct + Math.floor(d / tr.scale.length)));

  function playStep(tr, s, t) {
    const bar = Math.floor(s / 16) % 4, i = s % 16, ch = tr.chords[bar], v = tr.vol;
    if (tr.kick[i] === 'x') osc('sine', 120, t, 0.002, 0.22, 0.5 * v, 38);
    if (tr.tom[i] === 'x') { noise(t, 0.13, 0.22 * v, 900); osc('triangle', 170, t, 0.002, 0.12, 0.16 * v, 90); }
    if (tr.hat && tr.hat[i] === 'x') noise(t, 0.035, 0.05 * v, 7000, 'highpass');
    if (i % 4 === 0 || (tr.bpm > 120 && i % 2 === 0)) osc('sawtooth', deg(tr, ch, 0), t, 0.005, tr.bpm > 120 ? 0.14 : 0.5, tr.bass * v);
    if (i === 0) [0, 2, 4].forEach((k, n) => osc('sawtooth', deg(tr, ch + k, 1) * (1 + (n - 1) * 0.003), t, 0.6, 60 / tr.bpm * 4, tr.pad * v));
    // plucked arpeggio (a lute, more or less)
    if (rnd() < tr.pluck && (i % 2 === 0 || tr.bpm < 80)) { const k = [0, 2, 4, 7, 4, 2][Math.floor(rnd() * 6)]; osc('triangle', deg(tr, ch + k, tr.soft ? 2 : 2), t, 0.004, tr.soft ? 0.9 : 0.35, 0.085 * v); }
    if (tr.lead && i % 2 === 0 && rnd() < tr.lead) { const k = Math.floor(rnd() * 5); osc('square', deg(tr, ch + k, 3), t, 0.006, 0.16, 0.035 * v); }
  }
  function tick() {
    if (!ac) { ac = G.audioCtx && G.audioCtx(); if (!ac) return; out = ac.createGain(); out.gain.value = 0; out.connect(G.audioOut()); nextT = ac.currentTime + 0.1; }
    if (want !== cur) { cur = want; step = 0; seed = 7; nextT = ac.currentTime + 0.15; }
    out.gain.setTargetAtTime(G.musicOff || !cur ? 0 : 0.55, ac.currentTime, 0.4);
    if (!cur || ac.state !== 'running') { nextT = ac.currentTime + 0.1; return; }
    const tr = TRACKS[cur], spb = 60 / tr.bpm / 4;
    if (nextT < ac.currentTime) nextT = ac.currentTime + 0.05;
    while (nextT < ac.currentTime + 0.25) { playStep(tr, step, nextT); step++; if (step % 64 === 0) seed = 7 + (step / 64) % 3; nextT += spb; }
  }
  G.music = function (name) { want = TRACKS[name] ? name : null; if (!timer) timer = setInterval(tick, 90); };
})();
