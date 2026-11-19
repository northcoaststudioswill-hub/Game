// Guttercrown — sound design on top of the tiny synth in core.js: a room around every sound, hits that sound like the
// weapon that made them, a crowd that reacts, the garden's own air, and the throne's. Still no audio files.
(function () {
  'use strict';
  const G = window.G;
  let ac = null, out = null, wet = null, wetIn = null, nbuf = null, bed = null, bedG = null, bedF = null, wind = null, windG = null;
  // Phones have a small audio budget. Everything here is counted, capped and rate-limited, and the whole layer steps
  // down to a lighter mode on touch devices or the moment the page shows signs of falling behind.
  let live = 0, lite = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints || 0) > 1, late = 0;
  const lastAt = {}, CAP = () => (lite ? 10 : 22);
  const done = n => { live++; n.onended = () => { live = Math.max(0, live - 1); try { n.disconnect(); } catch (e) { } }; };
  G.soundLite = v => { if (v != null) lite = !!v; return lite; }; G.soundLive = () => live;
  const ready = () => {
    if (ac) return !G.muted;
    ac = G.audioCtx && G.audioCtx(); if (!ac) return false;
    out = G.audioOut();
    // one long buffer of noise, shared by everything
    nbuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // a limiter on the way out, so a pile-up of sounds is squashed instead of crackling
    try { const lim = ac.createDynamicsCompressor(); lim.threshold.value = -14; lim.knee.value = 10; lim.ratio.value = 12; lim.attack.value = 0.003; lim.release.value = 0.2; out.disconnect(); out.connect(lim); lim.connect(ac.destination);
      // the room: one feedback delay into a dark filter. Left out altogether in the light mode.
      if (!lite) { wetIn = ac.createGain(); wet = ac.createGain(); wet.gain.value = 0.1; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1900; const dl = ac.createDelay(0.5), fb = ac.createGain(); dl.delayTime.value = 0.083; fb.gain.value = 0.3; wetIn.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(lp); lp.connect(wet); wet.connect(lim); out.connect(wetIn); }
    } catch (e) { }
    return !G.muted;
  };
  // ---- voices
  function tone(f, dur, type, vol, slide, delay, attack) {
    if (live >= CAP()) return;
    const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain(); done(o);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.03);
  }
  function hiss(dur, vol, f0, type, delay, f1, q, attack) {
    if (live >= CAP()) return;
    const t = ac.currentTime + (delay || 0), s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); done(s);
    s.buffer = nbuf; f.type = type || 'bandpass'; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q || 0.8;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.03);
  }
  // a crowd is a lot of voices: several bands of noise that swell and wander
  function voices(dur, vol, lo, hi, delay, rise) {
    const nb = lite ? 1 : 2; for (let i = 0; i < nb; i++) { const f = lo + (hi - lo) * (nb === 1 ? 0.5 : i); hiss(dur * (0.8 + Math.random() * 0.4), vol * (0.7 + Math.random() * 0.5), f, 'bandpass', (delay || 0) + i * 0.03, f * (rise || 1.25), 2.2, dur * 0.3); }
  }
  const R = (a, b) => a + Math.random() * (b - a);
  const X = {
    // ---- steel, wood, and what they do to a body
    slice: () => { hiss(0.11, 0.3, 5200, 'bandpass', 0, 1400, 1.5); hiss(0.16, 0.26, 700, 'lowpass', 0.02); tone(R(150, 180), 0.12, 'sawtooth', 0.09, 0.45); tone(60, 0.16, 'sine', 0.28, 0.5); },
    thud: () => { hiss(0.2, 0.42, 320, 'lowpass'); tone(R(82, 96), 0.2, 'sine', 0.42, 0.42); tone(210, 0.07, 'square', 0.1, 0.5); hiss(0.05, 0.12, 2400, 'bandpass', 0.01); },
    pierce: () => { hiss(0.07, 0.3, 3600, 'bandpass', 0, 900, 3); tone(R(240, 280), 0.07, 'triangle', 0.14, 0.4); tone(70, 0.13, 'sine', 0.26, 0.6); hiss(0.14, 0.14, 500, 'lowpass', 0.03); },
    whipcrack: () => { hiss(0.03, 0.4, 6500, 'highpass'); hiss(0.12, 0.2, 2200, 'bandpass', 0.015, 600, 2); tone(900, 0.05, 'square', 0.06, 0.3); },
    spellhit: () => { tone(R(520, 620), 0.22, 'sine', 0.13, 0.35); tone(1240, 0.14, 'triangle', 0.07, 0.5, 0.01); hiss(0.2, 0.2, 1800, 'bandpass', 0, 500, 1.2); tone(58, 0.2, 'sine', 0.24, 0.6); },
    bigcrit: () => { hiss(0.26, 0.46, 900, 'lowpass'); tone(44, 0.34, 'sine', 0.46, 0.5); tone(R(170, 190), 0.18, 'square', 0.14, 0.4); tone(1320, 0.3, 'triangle', 0.09, 1.4, 0.01); hiss(0.1, 0.22, 5000, 'highpass', 0.01); },
    heavyswing: () => { hiss(0.24, 0.22, 500, 'bandpass', 0, 2200, 1.6, 0.1); tone(90, 0.2, 'sine', 0.1, 0.6); },
    lightswing: () => { hiss(0.09, 0.15, 2600, 'bandpass', 0, 5200, 2.2, 0.03); },
    sever: () => { hiss(0.09, 0.4, 4200, 'bandpass', 0, 900, 2); hiss(0.34, 0.34, 420, 'lowpass', 0.03); tone(120, 0.2, 'sawtooth', 0.12, 0.3, 0.02); for (let i = 0; i < 4; i++) hiss(0.06, 0.16, R(500, 1100), 'bandpass', 0.12 + i * 0.07, 0, 4); },
    impale: () => { hiss(0.05, 0.42, 3000, 'bandpass', 0, 700, 3); tone(64, 0.32, 'sine', 0.44, 0.5); tone(1650, 0.3, 'triangle', 0.07, 0.9, 0.02); hiss(0.4, 0.3, 380, 'lowpass', 0.04); },
    skull: () => { hiss(0.04, 0.5, 1900, 'bandpass', 0, 0, 5); tone(180, 0.09, 'square', 0.2, 0.35); tone(52, 0.3, 'sine', 0.44, 0.6); hiss(0.2, 0.2, 700, 'lowpass', 0.05); },
    'throw': () => { hiss(0.3, 0.2, 900, 'bandpass', 0, 3600, 2.4, 0.06); tone(320, 0.26, 'sine', 0.05, 2.2); },
    spit: () => { hiss(0.05, 0.22, 3200, 'bandpass', 0, 1200, 4); hiss(0.04, 0.12, 900, 'bandpass', 0.07); },
    choke: () => { tone(R(92, 108), 0.22, 'sawtooth', 0.09, 0.8); hiss(0.2, 0.12, 700, 'bandpass', 0, 400, 5); tone(1400, 0.1, 'square', 0.03, 0.9, 0.03); },
    bottle: () => { for (let i = 0; i < 5; i++) tone(R(2200, 5200), R(0.05, 0.14), 'triangle', 0.07, R(0.7, 1.1), i * 0.012); hiss(0.14, 0.26, 6000, 'highpass'); },
    vent: () => { hiss(0.9, 0.3, 1400, 'bandpass', 0, 3800, 0.7, 0.12); tone(70, 0.5, 'sine', 0.16, 0.7); },
    // ---- the crowd
    gasp: () => { voices(0.5, 0.11, 700, 1900, 0, 1.5); },
    roar: () => { voices(1.5, 0.17, 420, 1700, 0, 1.35); voices(1.0, 0.09, 1500, 2800, 0.12, 1.2); },
    boo: () => { voices(1.1, 0.12, 190, 460, 0, 0.8); },
    ooh: () => { voices(0.7, 0.1, 380, 900, 0, 0.72); },
    chant: () => { for (let i = 0; i < 4; i++) { voices(0.2, 0.12, 300, 800, i * 0.34, 1); tone(74, 0.16, 'sine', 0.2, 0.6, i * 0.34); } },
    hush: () => { voices(1.4, 0.05, 900, 2200, 0, 0.5); },
    // ---- the Hour Garden and the man who owns it
    erase: () => { tone(1760, 0.5, 'sine', 0.1, 0.25); tone(2640, 0.4, 'sine', 0.06, 0.2, 0.03); hiss(0.5, 0.2, 5000, 'highpass', 0, 0, 0.7, 0.02); tone(48, 0.4, 'sine', 0.3, 0.5); },
    laugh: () => { const n = 4 + Math.floor(Math.random() * 3), f = R(165, 200); for (let i = 0; i < n; i++) { const t = i * 0.15, ff = f * (1 - i * 0.045); tone(ff, 0.11, 'sawtooth', 0.085, 0.82, t, 0.02); tone(ff * 2.02, 0.1, 'square', 0.02, 0.85, t, 0.02); hiss(0.1, 0.09, 950, 'bandpass', t, 700, 6, 0.02); } },
    bird: () => { const f = R(2400, 3600), n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) tone(f * R(0.9, 1.15), 0.07, 'sine', 0.035, R(0.8, 1.35), i * 0.09, 0.01); },
    goldfall: () => { for (let i = 0; i < 6; i++) tone(R(1800, 3400), 0.09, 'triangle', 0.035, 1, i * R(0.03, 0.07)); },
    // ---- the top of the stair
    throne: () => { [146.8, 220, 293.7, 440].forEach((f, i) => { tone(f, 3.4, 'sine', 0.11, 1, i * 0.12, 0.5); tone(f * 1.003, 3.4, 'triangle', 0.045, 1, i * 0.12, 0.6); }); hiss(2.6, 0.05, 2400, 'bandpass', 0, 900, 0.6, 0.8); },
    dread: () => { tone(55, 3.0, 'sawtooth', 0.09, 0.97, 0, 0.6); tone(58.3, 3.0, 'sawtooth', 0.07, 0.97, 0, 0.6); hiss(2.4, 0.07, 300, 'lowpass', 0, 0, 0.7, 0.9); },
    dawn: () => { [261.6, 329.6, 392, 523.3, 659.3].forEach((f, i) => tone(f, 2.6, 'sine', 0.085, 1, i * 0.22, 0.25)); },
    quill: () => { for (let i = 0; i < 3; i++) hiss(0.09, 0.07, R(3200, 4600), 'bandpass', i * 0.11, 0, 3, 0.02); },
    heart: () => { tone(52, 0.13, 'sine', 0.3, 0.7); tone(48, 0.16, 'sine', 0.22, 0.7, 0.16); }
  };
  const s0 = G.sfx;
  const CROWD = { gasp: 1, roar: 1, boo: 1, ooh: 1, chant: 1, hush: 1 }, GAP = n => (CROWD[n] ? 2200 : n === 'laugh' ? 4000 : n === 'bird' || n === 'goldfall' ? 900 : 70);
  G.sfx = n => {
    const now = performance.now(); if (now - (lastAt[n] || 0) < (X[n] ? GAP(n) : 45)) return; lastAt[n] = now;
    if (X[n]) { if (lite && CROWD[n] && n !== 'roar') return; try { if (ready()) X[n](); } catch (e) { } return; }
    try { ready(); } catch (e) { }
    if (live >= CAP() + 6) return;
    s0(n);
  };
  G.SFX_EXTRA = Object.keys(X);

  // ---- what a blow sounds like depends on what landed it
  const FAM = { axe: 'slice', halberd: 'slice', axes: 'slice', rapier: 'pierce', spear: 'pierce', hammer: 'thud', pick: 'pierce', flail: 'thud', staff: 'thud', chain: 'whipcrack', frost: 'spellhit', spark: 'spellhit', acid: 'spellhit' };
  const BASIC = { fighter: 'slice', rogue: 'pierce', cleric: 'thud', druid: 'thud', sorcerer: 'spellhit', warlock: 'spellhit' };
  let lastGasp = 0;
  G.hitSound = function (att, tgt, ab, crit) {
    let k = 'thud';
    if (ab && (ab.spell || ab.type === 'proj' || ab.type === 'aoe' || ab.type === 'line') && !(ab.basic && BASIC[att.cls] !== 'spellhit')) k = 'spellhit';
    else if (att && att.vis && att.vis.c && att.vis.c.beast) k = 'slice';
    else { const arm = att && att.isPlayer && G.armOf ? String(G.armOf(G.state.hero)).split('_')[1] : (att && att.arm ? String(att.arm).split('_')[1] : 'basic'); k = FAM[arm] || BASIC[att && att.cls] || 'thud'; }
    G.sfx(crit && lite ? 'bigcrit' : k); if (crit && !lite) G.sfx('bigcrit');
    const now = performance.now();
    if (!G.fight.ex && !(G.garden && G.garden.run) && now - lastGasp > 1400 && (crit || (ab && ab.heavy))) { lastGasp = now; G.sfx(tgt && tgt.isPlayer ? 'ooh' : 'gasp'); }
  };
  G.swingSound = function (ab) { G.sfx(ab && ab.heavy ? 'heavyswing' : 'lightswing'); };

  // ---- beds: the crowd under a bout, the wind and birds in the garden, the heartbeat when you are nearly done
  function loop(freq, q) { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nbuf; s.loop = true; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; s.connect(f); f.connect(g); g.connect(out); s.start(); return [g, f]; }
  let hbT = 0, birdT = 2, murT = 3, wasHype = 0;
  let tickAt = 0, lastCrowd = -1, lastWind = -1, lastWet = -1, lastF = -1;
  const setP = (p, v, tc) => { try { p.cancelScheduledValues(ac.currentTime); p.setTargetAtTime(v, ac.currentTime, tc); } catch (e) { } };
  setInterval(() => {
    const nowMs = performance.now(); if (tickAt && nowMs - tickAt > 700 && !document.hidden) { if (++late >= 3 && !lite) { lite = true; if (wet) setP(wet.gain, 0, 0.1); } } tickAt = nowMs;
    let okA = false; try { okA = ready(); } catch (e) { }
    if (!ac) return;
    const F = G.fight, inFight = G.scene === 'fight' && F && F.active && !F.paused, garden = !!(G.garden && G.garden.run), hall = G.finale && G.finale.on;
    if (!bed) { const b = loop(620, 0.6); bedG = b[0]; bedF = b[1]; const w = loop(380, 0.4); windG = w[0]; wind = w[1]; }
    const t = ac.currentTime, hy = (F && F.hypeNow != null ? F.hypeNow : 0.3);
    const crowd = okA && inFight && !garden && !F.ex ? 0.022 + hy * 0.07 : 0;
    const cr = Math.round(crowd * 200) / 200, fq = Math.round((520 + hy * 520) / 40) * 40, wd = okA && (garden && G.scene !== 'hub') ? 0.03 : hall ? 0.022 : 0, wt = lite ? 0 : hall ? 0.3 : garden ? 0.04 : G.scene === 'fight' ? 0.14 : G.scene === 'hideout' ? 0.05 : 0.1;
    if (cr !== lastCrowd) { lastCrowd = cr; setP(bedG.gain, cr, 0.4); } if (fq !== lastF) { lastF = fq; setP(bedF.frequency, fq, 0.5); }
    if (wd !== lastWind) { lastWind = wd; setP(windG.gain, wd, 0.6); } if (wet && wt !== lastWet) { lastWet = wt; setP(wet.gain, wt, 0.3); }
    if (!okA) return;
    if (inFight && !garden && !F.ex) {
      murT -= 0.25; if (murT <= 0) { murT = R(5, 10); if (hy > 0.75) G.sfx(Math.random() < 0.4 ? 'chant' : 'roar'); else if (hy < 0.15 && Math.random() < 0.3) G.sfx('boo'); }
      if (hy - wasHype > 0.2) G.sfx('roar'); wasHype = hy;
      const P = F.P; if (P && P.hp > 0 && P.hp < P.maxHp * 0.25 && F.inFight && F.inFight()) { hbT -= 0.25; if (hbT <= 0) { hbT = 1.1; G.sfx('heart'); } }
    }
    if (inFight && garden) { birdT -= 0.25; if (birdT <= 0) { birdT = R(1.2, 4); G.sfx('bird'); if (Math.random() < 0.15) G.sfx('goldfall'); } }
  }, 250);
})();
