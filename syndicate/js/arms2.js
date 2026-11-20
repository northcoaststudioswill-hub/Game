// Guttercrown — every weapon has a temper of its own: a trait that changes how a fight with it goes, and a profile in the Armoury that shows it
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES, ui = G.ui, now = () => performance.now() / 1000;
  const X = () => G.fight.edgeApi, weapon = ab => ab && (ab.basic || ab.heavy), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const slow = (t, s, amt) => { t.st = t.st || {}; t.st.slow = { t: s, amt }; }, bleed = (t, a, s, d) => { t.st = t.st || {}; t.st.poison = { t: s, dice: d || [1, 4], tick: 0.5, by: a }; };
  const chain = (a, t, win) => { const n = now(), same = a._wt === t && n - (a._wn || 0) < win; a._wc = same ? (a._wc || 0) + 1 : 1; a._wt = t; a._wn = n; return a._wc; };
  // pre: returns a damage multiplier; post: does the thing after the blow lands
  const T = G.ARM_TRAIT = {
    f_basic: { name: 'Riposte', text: 'Blows within a second and a half of your parry or perfect dodge land 35% harder.', pre: (a) => now() - (a._openT || -9) < 1.5 ? 1.35 : 1 },
    f_spear: { name: 'Tip of the Spear', text: 'Hits at the far end of the reach land 30% harder. Close in, it is just a stick.', pre: (a, t, ab) => dist(a, t) > (ab.range || 90) * 0.65 ? 1.3 : 1 },
    f_axe: { name: 'Hewing', text: 'Heavy blows leave them bleeding for 3s.', post: (a, t, ab) => { if (ab.heavy) { bleed(t, a, 3, [1, 6]); X().text(t, 'HEWN', '#ff5040', false); } } },
    f_hammer: { name: 'Bonebreaker', text: 'Heavy blows smash their guard open and daze them for half a second.', post: (a, t, ab) => { if (ab.heavy) { t.guard = 0; t.st.stun = { t: 0.5 }; X().text(t, 'GUARD BROKEN', '#e0b040', false); } } },
    f_flail: { name: 'Over the Guard', text: 'The head wraps round shields: against a raised guard it lands 40% harder.', pre: (a, t) => t.guard > 0 ? 1.4 : 1 },
    r_basic: { name: 'Flurry', text: 'Every third blow in a row on the same target opens a bleed.', post: (a, t) => { if (chain(a, t, 2) % 3 === 0) { bleed(t, a, 3); X().text(t, 'BLEEDING', '#ff5040', false); } } },
    r_rapier: { name: 'Point Control', text: 'Criticals land 30% harder, and a hit from behind always finds the gap.', pre: (a, t) => { const ang = Math.atan2(a.y - t.y, a.x - t.x), d = Math.abs(Math.atan2(Math.sin(ang - t.aim), Math.cos(ang - t.aim))); return d > 2 ? 1.3 : 1; }, crit: 1.3 },
    r_axes: { name: 'Chop and Hook', text: 'Every hit drags at them: slowed by a fifth for 1.5s.', post: (a, t) => slow(t, 1.5, 0.2) },
    r_spear: { name: 'Gutter Reach', text: 'Hits at the far end of the reach land 25% harder and slow them.', pre: (a, t, ab) => dist(a, t) > (ab.range || 90) * 0.65 ? 1.25 : 1, post: (a, t, ab) => { if (dist(a, t) > (ab.range || 90) * 0.65) slow(t, 1.2, 0.25); } },
    c_basic: { name: 'Blessed Iron', text: 'Every third blow on the same target carries a little light: +1d6 radiant and a flash.', pre: (a, t) => ((a._wc || 0) + (a._wt === t ? 1 : 0)) % 3 === 0 ? 1.25 : 1, post: (a, t) => { if (chain(a, t, 3) % 3 === 0) X().text(t, 'BLESSED IRON', '#ffe08a', false); } },
    c_pick: { name: 'Armour Piercer', text: 'Ignores most of their armour: the heavier they are plated, the harder it lands.', pre: (a, t) => 1 + Math.min(0.4, (t.d.dr || 0) * 1.5) },
    c_flail: { name: 'Over the Guard', text: 'The head wraps round shields: against a raised guard it lands 40% harder.', pre: (a, t) => t.guard > 0 ? 1.4 : 1 },
    c_hammer: { name: 'The Toll', text: 'Heavy blows ring the bell: they are slowed for 2s and you hear it.', post: (a, t, ab) => { if (ab.heavy) { slow(t, 2, 0.35); G.sfx('bell'); X().text(t, 'TOLLED', '#ffe08a', false); } } },
    d_flail: { name: 'Snare', text: 'Every hit pulls them a step towards you.', post: (a, t) => { const d = dist(a, t) || 1; if (d > 50) { t.x += (a.x - t.x) / d * 26; t.y += (a.y - t.y) / d * 26; } } },
    d_hammer: { name: 'Rooted', text: 'Heavy blows root them to the spot for 0.8s.', post: (a, t, ab) => { if (ab.heavy) { t.st.stun = { t: 0.8 }; X().text(t, 'ROOTED', '#8fd66a', false); } } },
    d_spear: { name: 'Stalactite Cold', text: 'Hits chill them: slowed for 1.5s, and slowed targets take 15% more.', pre: (a, t) => t.st && t.st.slow ? 1.15 : 1, post: (a, t) => slow(t, 1.5, 0.25) },
    d_staff: { name: 'Thornwood Sweep', text: 'Hits send them half again as far.', post: (a, t) => { t.kx = (t.kx || 0) * 1.5; t.ky = (t.ky || 0) * 1.5; } },
    d_axes: { name: 'Bone Sickles', text: 'Criticals open a bleed for 4s.', critPost: (a, t) => { bleed(t, a, 4, [1, 6]); X().text(t, 'BLEEDING', '#ff5040', false); } },
    s_basic: { name: 'Kindling', text: 'Every bolt that lands on something already burning burns it a second longer and 15% harder.', pre: (a, t) => t.st && t.st.burn ? 1.15 : 1, post: (a, t) => { if (t.st && t.st.burn) t.st.burn.t += 1; } },
    s_frost: { name: 'Brittle', text: 'Targets you have slowed take 20% more from every shard.', pre: (a, t) => t.st && t.st.slow ? 1.2 : 1 },
    s_spark: { name: 'Arc', text: 'One bolt in four jumps back for a second hit.', post: (a, t) => { if (Math.random() < 0.25) setTimeout(() => { try { if (t.hp > 0 && G.fight.inFight()) { t.hp -= 4 + Math.floor(Math.random() * 6); X().text(t, 'ARC', '#fff070', false); G.sfx('zap'); } } catch (e) { } }, 160); } },
    s_staff: { name: 'Ember Burst', text: 'Criticals burst against them and set them alight.', critPost: (a, t) => { t.st.burn = { t: 3, dice: [1, 6], tick: 0.5, by: a }; X().text(t, 'EMBER BURST', '#ff8a2a', true); } },
    w_basic: { name: 'Repelling Blast', text: 'Every blast shoves them back a long way.', post: (a, t) => { const d = dist(a, t) || 1; t.kx = (t.x - a.x) / d * 260; t.ky = (t.y - a.y) / d * 260; } },
    w_frost: { name: 'Grave Cold', text: 'Hits slow them, and slowed targets take 15% more.', pre: (a, t) => t.st && t.st.slow ? 1.15 : 1, post: (a, t) => slow(t, 1.5, 0.25) },
    w_spark: { name: 'Tether', text: 'Each hit on the same target within two seconds adds 10%, up to +40%.', pre: (a, t) => 1 + Math.min(0.4, ((a._wt === t && now() - (a._wn || 0) < 2) ? (a._wc || 0) : 0) * 0.1), post: (a, t) => chain(a, t, 2) },
    w_acid: { name: 'Gnaw', text: 'Every hit poisons them a little longer.', post: (a, t) => { if (t.st && t.st.poison) t.st.poison.t += 1; else bleed(t, a, 2, [1, 3]); } },
    f_halberd: { name: 'Hook and Haul', text: 'The hook on the back of the head: every hit drags them a step towards you, and heavy blows sweep their feet for half a second.', post: (a, t, ab) => { const d = dist(a, t) || 1; if (d > 60) { t.x += (a.x - t.x) / d * 22; t.y += (a.y - t.y) / d * 22; } if (ab.heavy) { t.st.stun = { t: 0.5 }; X().text(t, 'SWEPT', '#c9b27a', false); } } },
    r_chain: { name: 'Long Weight', text: 'Hits at the far end of the chain land 25% harder and wrap their legs: slowed for 1.5s.', pre: (a, t, ab) => dist(a, t) > (ab.range || 100) * 0.6 ? 1.25 : 1, post: (a, t, ab) => { if (dist(a, t) > (ab.range || 100) * 0.6) slow(t, 1.5, 0.3); } },
    s_acid: { name: 'Corrode', text: 'Every splash eats a little of their armour for 4s: the next hits land 10% harder, up to +30%.', pre: (a, t) => 1 + Math.min(0.3, (t._cor || 0) * 0.1 * (now() - (t._corT || -9) < 4 ? 1 : 0)), post: (a, t) => { t._cor = now() - (t._corT || -9) < 4 ? Math.min(3, (t._cor || 0) + 1) : 1; t._corT = now(); } },
    c_staff: { name: 'Pilgrim\'s Ward', text: 'Every hit you land wraps you in a small ward of light (6 points, for 3s).', post: (a) => { a.shield = Math.max(a.shield || 0, 6); } },
    // a druid in another shape fights with that shape's own temper
    bite_wolf: { name: 'The Pack', text: 'Every third bite in a row drags them down for a moment.', post: (a, t) => { if (chain(a, t, 2.5) % 3 === 0) { t.st.stun = { t: 0.5 }; X().text(t, 'DRAGGED DOWN', '#c8c0b0', false); } } },
    maul_bear: { name: 'The Weight', text: 'Every maul shoves them back, and one in three knocks them flat.', post: (a, t) => { if (Math.random() < 0.33) X().knockdown(t, 0.7); } },
    bite_spider: { name: 'Venom', text: 'Every bite poisons them, and poisoned targets take 15% more.', pre: (a, t) => t.st && t.st.poison ? 1.15 : 1, post: (a, t) => { if (t.st && t.st.poison) t.st.poison.t += 1; else bleed(t, a, 3, [1, 4]); } },
    rake_bat: { name: 'Blood Drinker', text: 'You heal for a fifth of every rake.', post: (a, t, ab, dmg) => { if (dmg > 0) X().heal(a, dmg * 0.2); } },
    maul_avatar: { name: 'The Old Thing', text: 'Every blow breaks their guard and shakes the pit.', post: (a, t) => { t.guard = 0; } },
    w_staff: { name: 'Pact Drain', text: 'You heal for a tenth of every blow.', post: (a, t, ab, dmg) => { if (dmg > 0) X().heal(a, dmg * 0.1); } }
  };
  const traitOf = e => e && T[e.basic];
  // through the edge hooks, which see every blow
  const E = G.edge; if (E) { const pre0 = E.pre, post0 = E.post, gain0 = E.gain;
    E.gain = function (e, why) { if (why === 'dodge' || why === 'parry') e._openT = now(); return gain0.apply(this, arguments); };
    E.pre = function (att, tgt, ab) { let r = pre0.apply(this, arguments); const tr = traitOf(att); if (!tr || !weapon(ab) || !tr.pre) return r; const m = tr.pre(att, tgt, ab) || 1; if (m === 1) return r; r = r || { mul: 1 }; r.mul = (r.mul || 1) * m; return r; };
    E.post = function (att, tgt, ab, dmg, r) { const tr = traitOf(att); if (tr && weapon(ab) && X()) { try { if (tr.post) tr.post(att, tgt, ab, dmg); if (tr.critPost && att._lastCrit) tr.critPost(att, tgt, ab, dmg); } catch (e) { } } return post0.apply(this, arguments); }; }
  // a weapon's profile: how fast, how far, how hard, and its temper
  const prof = id => { const ab = A[id]; if (!ab) return null; const melee = ab.type === 'melee', spd = 1 - Math.min(1, Math.max(0, ((ab.wind || 0.15) + (ab.rec || 0.2) - 0.22) / 0.35)), reach = melee ? Math.min(1, ((ab.range || 60) - 50) / 55) : Math.min(1, (ab.speed || 700) / 1000), dice = (ab.dmg || [1, 6]), pow = Math.min(1, (dice[0] * (dice[1] + 1) / 2 - 2) / 5); return { spd, reach, pow, melee }; };
  const bar = (n, v, c) => '<div class="wp-b"><small>' + n + '</small><i style="--v:' + Math.round(Math.max(0.08, v) * 100) + '%;--c:' + c + '"></i></div>';
  G.armProfileHTML = id => { const p = prof(id), tr = T[id]; if (!p) return ''; return '<div class="wprof">' + (tr ? '<small class="over">Its temper</small><p class="wp-t"><b>' + tr.name + '.</b> ' + tr.text + '</p>' : '') + '</div>'; };
  if (ui.armory) { const ar0 = ui.armory; ui.armory = function (sel) { const r = ar0.apply(this, arguments), st = G.state, det = document.querySelector('#panel .arm-detail'); if (!det || !st.hero || det.parentNode.querySelector('.wprof')) return r; const list = G.ARMS.filter(w => w.cls === st.hero.cls), pick = list.find(w => w.id === sel) || list.find(w => w.id === G.armOf(st.hero)); if (pick) det.insertAdjacentHTML('afterend', G.armProfileHTML(pick.id)); return r; }; }
})();
