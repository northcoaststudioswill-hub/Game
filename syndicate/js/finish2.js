// Guttercrown — a late finisher for each calling, opened at Underboss: bodies bent at joints that do not bend that way
(function () {
  'use strict';
  const G = window.G, M = G.MORTALS; if (!M) return;
  const add = (cls, o) => { if (M[cls] && !M[cls].some(q => q.id === o.id)) M[cls].push(Object.assign({ rank: 4, cf: 1, keep: 1, cast: false }, o)); };
  add('fighter', { id: 'breaker', lead: 'breaker', imp: 1.6, tail: 2.4, name: 'Bent the Wrong Way', word: 'BROKEN', desc: 'The elbow, the knee, the other knee, and then the neck, in that order, each the way it does not go.' });
  add('rogue', { id: 'strings', lead: 'strings', imp: 1.9, tail: 2.4, name: 'Every String Cut', word: 'UNSTRUNG', desc: 'Wrists, elbows, knees. You cut whatever holds them up and let them fold.' });
  add('sorcerer', { id: 'boil', lead: 'boil', imp: 1.8, tail: 2.4, name: 'Boiled in the Skin', word: 'BURST', desc: 'You heat everything they are made of at once. Their joints jump. Then there is too much of them for the skin.' });
  add('cleric', { id: 'penance', lead: 'penance', imp: 1.7, tail: 2.4, name: 'Made to Pray', word: 'ABSOLVED', desc: 'On their knees, hands raised to the Light. You accept the prayer on its behalf.' });
  add('druid', { id: 'thorns', lead: 'thorns', imp: 1.8, tail: 2.8, name: 'Grown Through', word: 'GROWN THROUGH', desc: 'Six thorns come up through the sand, and through the feet, the hands and the neck, and keep growing.' });
  add('warlock', { id: 'marionette', lead: 'marionette', imp: 2.2, tail: 2.4, name: 'Danced to Death', word: 'STRINGS CUT', desc: 'Your patron lends you the strings. They dance for the stands until the strings are taken back.' });
})();
// once you have signed with David, the line at the top of the market always says where you stand with him
(function () {
  'use strict';
  const G = window.G, ob0 = G.objective; if (!ob0) return;
  G.objective = function () { const base = ob0.apply(this, arguments), st = G.state; if (!st || !st.hero || G.scene !== 'hub' || !(st.signed || st.bound) || typeof base !== 'string' || /owe David|Signed to David/.test(base)) return base;
    const d = G.oracle && G.oracle.debt ? G.oracle.debt(st) : (st.soulDebt || 0); return base + (d > 0 ? '  ·  You owe David ' + d + (d === 1 ? ' soul' : ' souls') : '  ·  Signed to David: nothing owed, for now'); };
})();
