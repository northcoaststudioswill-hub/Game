// Guttercrown — a sorcerer's lot, eased: a little more health, mana that comes back as fast as a cleric's, bolts that
// buy a step of room when they land, and a quicker Misty Step. Measured against full simulated careers.
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES;
  const d0 = G.derive;
  G.derive = function (h, st) { const d = d0.apply(this, arguments); if (h && h.cls === 'sorcerer') { d.maxHp = Math.round(d.maxHp * 1.1); d.regen *= 1.3; } return d; };
  ['s_basic', 's_frost', 's_spark', 's_acid', 's_staff'].forEach(k => { if (A[k] && !A[k].knock) A[k].knock = 85; });
  if (A.misty_step) { A.misty_step.cd = 4; A.misty_step.desc = (A.misty_step.desc || '').replace(/\s*$/, ''); }
  if (A.burning_hands) A.burning_hands.knock = Math.max(A.burning_hands.knock || 0, 140);
  if (G.CLASSES.sorcerer) G.PLAY.sorcerer = 'Keep your distance and punish from range. Every bolt that lands shoves them back a step. Up close, blink away with Misty Step or burn them off you.';
  // Mage Armour: a sorcerer walks in already warded. Worth most at level 1, when one mistake used to be the bout.
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const r = fs0.apply(this, arguments), F = G.fight, P = F.P; if (P && !F.ex && P.cls === 'sorcerer') { P.shield = Math.max(P.shield || 0, Math.round(22 + 5 * (G.state.hero.level || 1))); } return r; };
  if (G.RACE_TRAIT && G.LORE) G.LORE.push({ sec: 'The Trades', title: 'Mage Armour', unlock: st => !!(st.hero && st.hero.cls === 'sorcerer'), body: 'A sorcerer’s blood does one thing for them without being asked: before the bell, it puts a skin of force between them and the first blow. It is not much. At the bottom of the Ledger it is the difference between a short career and none.' });
})();
