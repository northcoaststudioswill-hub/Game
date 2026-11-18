// Underground Syndicate — core: helpers, dice, save state, audio
(function () {
  const G = window.G = { W: 1168, H: 784 };

  G.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  G.lerp = (a, b, t) => a + (b - a) * t;
  G.rand = (a, b) => a + Math.random() * (b - a);
  G.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  G.mod = score => Math.floor((score - 10) / 2);
  G.fmtMod = m => (m >= 0 ? '+' : '') + m;
  G.roll = d => { let t = 0; for (let i = 0; i < d[0]; i++) t += 1 + Math.floor(Math.random() * d[1]); return t; };
  G.dice = d => d[0] + 'd' + d[1];
  G.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- save ----------
  const KEY = 'underground_syndicate_v2';
  G.newState = () => ({ v: 2, hero: null, coin: 0, respect: 0, wins: {}, losses: 0, items: [], gear: { weapon: 0, armor: 0 }, potions: 1, seenHelp: false });
  G.state = G.newState();
  G.save = () => { try { localStorage.setItem(KEY, JSON.stringify(G.state)); } catch (e) { } };
  G.load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.v === 2 && s.hero) { G.state = Object.assign(G.newState(), s); return true; }
    } catch (e) { }
    return false;
  };
  G.hasSave = () => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return !!(s && s.v === 2 && s.hero); } catch (e) { return false; } };
  G.wipe = () => { try { localStorage.removeItem(KEY); } catch (e) { } G.state = G.newState(); };

  // ---------- audio (tiny synth, no files) ----------
  let ac = null, master = null;
  G.muted = false;
  G.audioInit = () => {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
    } catch (e) { ac = null; }
  };
  function tone(f, dur, type, vol, slide, delay) {
    if (!ac || G.muted) return;
    const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + dur);
    g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, freq, type, delay) {
    if (!ac || G.muted) return;
    const t = ac.currentTime + (delay || 0), n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = buf; f.type = type || 'lowpass'; f.frequency.value = freq || 1200; g.gain.value = vol || 0.2;
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  const SFX = {
    swing: () => noise(0.09, 0.14, 2600, 'highpass'),
    hit: () => { noise(0.12, 0.3, 900); tone(140, 0.1, 'square', 0.12, 0.5); },
    crit: () => { noise(0.18, 0.4, 1400); tone(180, 0.16, 'square', 0.16, 0.4); tone(990, 0.2, 'triangle', 0.1, 1.5); },
    hurt: () => { noise(0.14, 0.3, 600); tone(110, 0.14, 'sawtooth', 0.12, 0.6); },
    cast: () => tone(420, 0.18, 'sine', 0.12, 2),
    fire: () => { noise(0.3, 0.22, 800); tone(200, 0.25, 'sawtooth', 0.06, 0.5); },
    boom: () => { noise(0.55, 0.45, 420); tone(70, 0.5, 'sine', 0.3, 0.5); },
    zap: () => { noise(0.22, 0.3, 3000, 'highpass'); tone(900, 0.2, 'sawtooth', 0.08, 0.2); },
    ice: () => { tone(1400, 0.15, 'triangle', 0.1, 0.6); noise(0.1, 0.1, 5000, 'highpass'); },
    holy: () => { tone(660, 0.35, 'sine', 0.1); tone(990, 0.4, 'sine', 0.08, 1, 0.05); },
    heal: () => { tone(523, 0.14, 'sine', 0.12); tone(659, 0.14, 'sine', 0.12, 1, 0.09); tone(784, 0.22, 'sine', 0.12, 1, 0.18); },
    dodge: () => noise(0.14, 0.14, 1800, 'bandpass'),
    dash: () => { noise(0.18, 0.18, 2400, 'bandpass'); tone(700, 0.15, 'sine', 0.06, 0.4); },
    buff: () => { tone(330, 0.2, 'triangle', 0.12, 1.5); tone(495, 0.25, 'triangle', 0.1, 1.5, 0.08); },
    stun: () => tone(1200, 0.12, 'square', 0.06, 0.5),
    deny: () => tone(150, 0.08, 'square', 0.06),
    ui: () => tone(700, 0.05, 'triangle', 0.08),
    coin: () => { tone(1320, 0.07, 'square', 0.06); tone(1760, 0.14, 'square', 0.06, 1, 0.07); },
    bell: () => { tone(440, 1.2, 'sine', 0.2); tone(883, 0.9, 'sine', 0.1); tone(1320, 0.6, 'sine', 0.05); },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'triangle', 0.14, 1, i * 0.13)),
    lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.35, 'sawtooth', 0.08, 1, i * 0.16)),
    level: () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'sine', 0.14, 1, i * 0.09)),
    crowd: () => noise(0.9, 0.12, 700, 'bandpass')
  };
  G.sfx = n => { if (SFX[n]) SFX[n](); };

  // ---------- progression math ----------
  G.XP_FOR = [0, 0, 100, 250, 450, 700];   // cumulative xp required for level index
  G.MAX_LEVEL = 5;
  G.rankOf = respect => { let r = 0; G.RANKS.forEach((k, i) => { if (respect >= k.at) r = i; }); return r; };

  // Everything numeric about a character comes out of here (hero or opponent).
  G.derive = (h, st) => {
    const cls = G.CLASSES[h.cls], m = s => G.mod(h.stats[s]), L = h.level;
    const d = {
      maxHp: 2.5 * (cls.hitDie * 4 + m('con') * 5 + (L - 1) * (cls.hitDie * 1.2 + m('con') * 2)),
      crit: 0.05 + Math.max(0, m('dex')) * 0.02, critMul: 2, dmgMul: 1,
      speed: 215 * (1 + m('dex') * 0.02), dodgeCd: 1.15 * (1 - Math.max(0, m('dex')) * 0.03),
      cdr: Math.max(0, m('int')) * 0.03, regen: 9 + m('wis') * 1.2, healMul: 1 + Math.max(0, m('wis')) * 0.04,
      respectMul: 1 + m('cha') * 0.05, coinMul: 1 + m('cha') * 0.05, xpMul: 1,
      dr: 0, ward: 0, freePotion: 0, weapon: 0, sneakDice: 2, potionMul: 1
    };
    const sub = h.sub;
    if (sub === 'champion') { d.crit += 0.15; d.critMul = 2.5; }
    if (sub === 'battlemaster') d.tactical = true;
    if (sub === 'assassin') d.sneakDice = 4;
    if (sub === 'thief') { d.coinMul += 0.25; d.dodgeCd *= 0.7; }
    if (sub === 'draconic') { d.maxHp *= 1.12; d.fireBonus = true; }
    if (sub === 'wild') d.wild = true;
    if (sub === 'war') d.radiantMelee = true;
    if (sub === 'light') d.searing = true;
    (h.feats || []).forEach(f => {
      if (f === 'tough') d.maxHp *= 1.15;
      if (f === 'mobile') { d.speed *= 1.12; d.dodgeCd *= 0.75; }
      if (f === 'savage') d.dmgMul += 0.12;
      if (f === 'focused') d.regen *= 1.35;
    });
    if (st) {
      const dc = G.owned(st);
      if (dc.bed) d.maxHp *= 1.1;
      if (dc.trophies) d.respectMul += 0.1;
      if (dc.banner) d.coinMul += 0.1;
      if (dc.glowcaps) d.regen *= 1.1;
      if (dc.bloom) d.xpMul += 0.1;
      if (dc.fountain) d.ward = 12 + L * 3;
      if (dc.cauldron) d.freePotion = 1;
      if (dc.statues) d.dr += 0.05;
      if (dc.crystals) d.crit += 0.03;
      if (dc.desk) d.cdr += 0.06;
      d.weapon = st.gear.weapon * 2;
      d.dr += st.gear.armor * 0.06;
    }
    d.maxHp = Math.round(d.maxHp);
    return d;
  };
})();
