// Starhaven — Wren's Constellation: Starlight you gather lights stars that make her stronger.
// (An unlock track that gives the collectible a use, as the Keeper's Trail does in Lightswarm.)
(function (SH) {
  const S = {};
  S.DEFS = [
    { id: 'heart', name: 'The Huntress', text: 'One more heart.', costs: [30, 60] },
    { id: 'bond', name: 'The Mate Bond', text: 'Bond Arts fill 15% faster.', costs: [20, 30, 40] },
    { id: 'edge', name: 'The Twin Blades', text: 'Finishing cuts do 1 more damage.', costs: [45] },
    { id: 'moon', name: 'The Fourth Moon', text: 'One more moon for the Flame.', costs: [40], needs: 'flame' },
  ];
  const prog = () => SH.game.progress;
  S.level = id => (prog() && prog().stars && prog().stars[id]) || 0;
  S.gathered = () => Object.values((prog() && prog().motes) || {}).reduce((a, b) => a + b, 0) + ((prog() && prog().bonus) || 0);   // motes, plus what people give her for helping
  S.spent = () => S.DEFS.reduce((n, d) => n + d.costs.slice(0, S.level(d.id)).reduce((a, b) => a + b, 0), 0);
  S.free = () => S.gathered() - S.spent();
  S.cost = d => d.costs[S.level(d.id)];
  S.locked = d => d.needs && !(prog().reached >= 4);      // the Flame arrives in Chapter 3
  S.canBuy = d => S.level(d.id) < d.costs.length && !S.locked(d) && S.free() >= S.cost(d);
  S.buy = function (id) {
    const d = S.DEFS.find(x => x.id === id);
    if (!d || !S.canBuy(d)) return false;
    const p = prog(); p.stars = p.stars || {}; p.stars[id] = S.level(id) + 1;
    S.apply(); SH.game.save(true); SH.sfx.play('lantern');
    return true;
  };
  S.maxHearts = () => SH.PLAYER.hearts + S.level('heart') + (SH.xp.level() >= 4 ? 1 : 0);
  S.maxPips = () => SH.GIFTS.pips + S.level('moon');
  // Put what's been bought onto Wren as she stands now.
  S.apply = function () {
    const w = SH.game.world; if (!w) return;
    const p = w.player, was = p.maxHearts;
    p.maxHearts = S.maxHearts(); if (p.maxHearts > was) p.hearts += p.maxHearts - was;
  };
  SH.stars = S;
})(window.SH = window.SH || {});
