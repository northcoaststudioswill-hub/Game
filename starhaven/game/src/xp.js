// Starhaven — experience. Wren levels up by doing things: fighting, hunting, gathering, helping, finishing chapters.
// Each level gives one fixed perk (the Constellation is where you choose; levels are what you earn by playing).
(function (SH) {
  const X = {};
  X.AT = [0, 30, 80, 150, 240, 350, 480];                 // total XP needed for level 1, 2, 3...
  X.PERKS = [null, null,
    { name: 'Quick hands', text: 'Everything in Wren\'s hands is ready again sooner: the bow now, and whatever comes after it.' },
    { name: 'Light feet', text: 'Wren recovers her footing faster. When she learns to dash, it will be ready again sooner.' },
    { name: 'Hard to kill', text: 'One more heart.' },
    { name: 'Bonded', text: 'Every level starts with the bond bar a third full.' },
    { name: 'Hunter\'s patience', text: 'Starlight drifts to you from further away.' },
    { name: 'Steady aim', text: 'Arrows from the starbow fly a fifth faster.' },
  ];
  const prog = () => SH.game.progress;
  X.total = () => (prog() && prog().xp) || 0;
  X.levelAt = t => { let l = 1; while (l < X.AT.length && t >= X.AT[l]) l++; return l; };
  X.level = () => X.levelAt(X.total());
  X.max = () => X.AT.length;
  X.span = () => { const l = X.level(); return l >= X.max() ? [1, 1] : [X.total() - X.AT[l - 1], X.AT[l] - X.AT[l - 1]]; };
  X.gain = function (n, why) {
    const G = SH.game; if (!prog() || !n) return;
    if (n > 0 && G.boon('thane')) n = Math.ceil(n * 1.2);   // Thane, heart 2: Well read
    const before = X.level(); prog().xp = X.total() + n;
    const p = G.world && G.world.player;
    if (p && why) SH.fx.word(p.x, p.y - 76, '+' + n + ' XP', '#9fe8ff', 44);
    const after = X.level();
    if (after > before) {
      const perk = X.PERKS[after];
      SH.arts.finisher('LEVEL ' + after, perk.name.toUpperCase(), '#9fe8ff'); SH.sfx.play('heart');
      G.hud.toast('Level ' + after + ': ' + perk.name + '. ' + perk.text);
      if (after === 4 && p) { p.maxHearts = SH.stars.maxHearts(); p.hearts = p.maxHearts; }
      G.explain('xp'); G.save();
    }
    G.hud.xp();
  };
  X.quick = () => X.level() >= 2 ? 0.75 : 1;
  X.dash = () => X.level() >= 3 ? 0.78 : 1;
  X.reach = () => X.level() >= 6 ? 46 : 16;
  SH.xp = X;
})(window.SH = window.SH || {});
