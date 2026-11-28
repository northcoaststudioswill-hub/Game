// Starhaven — save slots (DESIGN.md "Save data": 3 slots, saved after every chapter, evening and bond change).
// A slot holds where you are and what you've built: chapter, bonds, people met, playtime.
(function (SH) {
  const KEY = 'starhaven.slots.v1', N = 3;
  const S = SH.saves = { N, VERSION: 2 };

  S.blank = () => ({ v: 1, chapter: 0, reached: 0, bonds: {}, met: [], playFrames: 0, pending: null, savedAt: 0 });

  S.all = function () {
    const a = SH.store.get(KEY, null);
    if (Array.isArray(a)) return a.concat([null, null, null]).slice(0, N).map(S.clean);
    // carry an older single save into slot 1
    const arr = [null, null, null], old = SH.store.get('starhaven.save.v1', null);
    if (old && (old.reached > 0 || (old.met && old.met.length))) {
      const ch = Math.min(old.reached || 0, SH.STORY.CHAPTERS.length - 1);
      arr[0] = Object.assign(S.blank(), { reached: old.reached || 0, bonds: old.bonds || {}, met: old.met || [], chapter: ch, savedAt: Date.now() });
      SH.store.set(KEY, arr);
    }
    return arr;
  };
  // Make any stored slot safe to read: wrong types become defaults, unknown chapters are clamped. A slot from a newer
  // version of the game than this one is kept but shown as unreadable, so it is never loaded half-understood.
  S.clean = function (s) {
    if (!s || typeof s !== 'object') return null;
    const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d), obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
    const N = SH.STORY.CHAPTERS.length;
    return Object.assign({}, s, {
      chapter: Math.max(0, Math.min(N, Math.floor(num(s.chapter, 0)))), reached: Math.max(0, Math.floor(num(s.reached, 0))),
      bonds: obj(s.bonds), met: Array.isArray(s.met) ? s.met.filter(x => typeof x === 'string') : [], playFrames: num(s.playFrames, 0),
      motes: obj(s.motes), stars: obj(s.stars), mem: obj(s.mem), seen: obj(s.seen), lore: obj(s.lore), said: obj(s.said),
      xp: num(s.xp, 0), bonus: num(s.bonus, 0), bondMeter: num(s.bondMeter, 0), savedAt: num(s.savedAt, 0),
      pending: typeof s.pending === 'string' && SH.STORY.SCRIPTS && SH.STORY.SCRIPTS[s.pending] ? s.pending : null,
      future: num(s.version, 1) > S.VERSION,
    });
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
    if (s.future) return { title: 'Saved by a newer version', time: '-', caelum: 0, when: '', level: 1, stars: 0, choices: 0, future: true };
    const ST = SH.STORY, ch = ST.CHAPTERS[Math.min(s.chapter, ST.CHAPTERS.length - 1)];
    const mins = Math.floor(s.playFrames / 3600), time = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
    const done = s.chapter >= ST.CHAPTERS.length;
    const c = s.bonds && s.bonds.caelum ? SH.game.heartsFor(s.bonds.caelum.pts) : 0;
    let when = '';
    try { when = new Date(s.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); } catch (e) { /* fine */ }
    const xp = s.xp || 0, lv = SH.xp.levelAt(xp), stars = Object.values(s.motes || {}).reduce((a, b) => a + b, 0) + (s.bonus || 0), choices = Object.keys(s.mem || {}).length;
    return { title: done ? 'Concept complete' : `${ch.label}: ${ch.name}`, time, caelum: c, when, level: lv, stars, choices };
  };
})(window.SH = window.SH || {});
