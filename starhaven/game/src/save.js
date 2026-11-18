// Starhaven — save slots (DESIGN.md "Save data": 3 slots, saved after every chapter, evening and bond change).
// A slot holds where you are and what you've built: chapter, bonds, people met, playtime.
(function (SH) {
  const KEY = 'starhaven.slots.v1', N = 3;
  const S = SH.saves = { N };

  S.blank = () => ({ v: 1, chapter: 0, reached: 0, bonds: {}, met: [], playFrames: 0, pending: null, savedAt: 0 });

  S.all = function () {
    const a = SH.store.get(KEY, null);
    if (Array.isArray(a)) return a.concat([null, null, null]).slice(0, N);
    // carry an older single save into slot 1
    const arr = [null, null, null], old = SH.store.get('starhaven.save.v1', null);
    if (old && (old.reached > 0 || (old.met && old.met.length))) {
      const ch = Math.min(old.reached || 0, SH.STORY.CHAPTERS.length - 1);
      arr[0] = Object.assign(S.blank(), { reached: old.reached || 0, bonds: old.bonds || {}, met: old.met || [], chapter: ch, savedAt: Date.now() });
      SH.store.set(KEY, arr);
    }
    return arr;
  };
  S.write = function (i, data) {
    const a = S.all();
    a[i] = Object.assign(S.blank(), data, { savedAt: Date.now() });
    SH.store.set(KEY, a);
  };
  S.erase = function (i) { const a = S.all(); a[i] = null; SH.store.set(KEY, a); };
  S.latest = function () {
    let best = -1, t = -1;
    S.all().forEach((s, i) => { if (s && s.savedAt > t) { t = s.savedAt; best = i; } });
    return best;
  };
  S.describe = function (s) {
    if (!s) return null;
    const ST = SH.STORY, ch = ST.CHAPTERS[Math.min(s.chapter, ST.CHAPTERS.length - 1)];
    const mins = Math.floor(s.playFrames / 3600), time = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
    const done = s.chapter >= ST.CHAPTERS.length;
    const c = s.bonds && s.bonds.caelum ? SH.game.heartsFor(s.bonds.caelum.pts) : 0;
    let when = '';
    try { when = new Date(s.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); } catch (e) { /* fine */ }
    const xp = s.xp || 0, lv = 1 + [30, 80, 150, 240, 350].filter(v => xp >= v).length, stars = Object.values(s.motes || {}).reduce((a, b) => a + b, 0) + (s.bonus || 0), choices = Object.keys(s.mem || {}).length;
    return { title: done ? 'Concept complete' : `${ch.label}: ${ch.name}`, time, caelum: c, when, level: lv, stars, choices };
  };
})(window.SH = window.SH || {});
