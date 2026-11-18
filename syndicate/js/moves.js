// Guttercrown — moves: every technique gets its own body shape (mv for weapon blows, cs for castings).
(function () {
  'use strict';
  const A = G.ABILITIES, MV = { shield_bash: 'bash', cleave: 'spin', holy_strike: 'smite', death_mark: 'backstab', poison_blade: 'lowcut', riposte_hit: 'riposte' };
  const CS = { fan_knives: 'throw', throwing_knife: 'throw', dirty_trick: 'throw', smoke_bomb: 'plant', caltrops: 'plant', bear_trap: 'plant', glyph: 'plant', thorn_snare: 'plant', guardian_sigil: 'plant',
    war_cry: 'breath', dragon_breath: 'breath', hellfire: 'breath', lightning_bolt: 'cone', burning_hands: 'cone', hunger_dark: 'cone', shocking_grasp: 'cone' };
  Object.keys(A).forEach(id => { const a = A[id]; if (!a) return;
    if (a.type === 'melee' && !a.spell) {
      if (MV[id]) a.mv = MV[id];
      else if (/_m$/.test(id)) a.mv = (a.arc || 100) < 60 ? 'drive' : (a.arc || 100) >= 120 ? 'spin' : 'rise';
      else if (/_h$/.test(id)) a.mv = (a.arc || 100) < 60 ? 'drive' : 'chop';
    } else if (CS[id]) a.cs = CS[id];
    else if (a.type === 'aoe') a.cs = a.at === 'self' ? 'nova' : 'call';
    else if (a.type === 'buff') a.cs = a.heal ? 'bless' : /_form$|avatar/.test(id) ? 'nova' : 'steel';
    else if (a.type === 'proj' && /_m$/.test(id)) a.cs = 'cone';
    else if (a.type === 'line') a.cs = 'cone';
  });
})();
