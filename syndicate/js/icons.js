// Guttercrown — every move gets its own picture, and a colour that says what it is for: red hurts, amber holds them,
// green mends, blue guards, white moves you, violet changes you. The pause menu can show your moves mid-bout.
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES, ui = G.ui;
  // shapes are drawn on a 24 x 24 grid. f = filled, s = stroked line
  const f = d => '<path d="' + d + '"/>', s = (d, w) => '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const c = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>', ring = (x, y, r, w) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '"/>';
  const DAG = 'M12 2l2 3v9h-4V5z M8 14h8v2h-3v3l-1 2-1-2v-3H8z';
  const P = {
    shield_bash: f('M10 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z') + s('M19 8l3 0 M19 12h4 M19 16l3 0'),
    second_wind: s('M3 9h11a3 3 0 1 0-3-3 M3 14h15a3 3 0 1 1-3 3 M3 19h7', 2.2),
    cleave: s('M4 18C6 8 14 3 21 4', 3) + f('M16 2l6 1-3 5z'),
    leap_slam: f('M12 2l4 5h-3v6h-2V7H8z') + f('M2 20h20v2H2z') + s('M6 19l-2-3 M18 19l2-3 M12 19v-3', 1.6),
    relentless: f('M12 3l8 7h-5l-3-3-3 3H4z M12 11l8 7h-5l-3-3-3 3H4z'),
    riposte: s('M4 4l14 14 M20 4L6 18', 2.4) + f('M15 19l4 0 0-4z M9 19H5v-4z'),
    riposte_hit: s('M4 4l14 14 M20 4L6 18', 2.4),
    action_surge: f('M13 2L5 13h6l-2 9 9-12h-6z'),
    shadowstep: f('M8 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z M6 8h4l2 5-2 1v7H8v-6l-3-2z') + '<g opacity="0.45">' + f('M16 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z M14 8h4l2 5-2 1v7h-2v-6l-3-2z') + '</g>',
    shadow_step: f('M9 4a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z M6 10h6l1 6-2 1v5H8v-5L5 15z') + s('M15 6c4 2 4 10 0 13', 1.8) + s('M18 4c5 3 5 13 0 16', 1.4),
    fan_knives: '<g transform="rotate(-30 12 20)">' + f(DAG) + '</g><g>' + f(DAG) + '</g><g transform="rotate(30 12 20)">' + f(DAG) + '</g>',
    throwing_knife: '<g transform="rotate(45 12 12)">' + f(DAG) + '</g>' + s('M3 6h4 M2 10h4', 1.6),
    poison_blade: '<g transform="rotate(35 12 12)">' + f(DAG) + '</g>' + f('M5 14c0 0 3 4 3 6a3 3 0 0 1-6 0c0-2 3-6 3-6z'),
    smoke_bomb: c(8, 15, 5) + c(15, 13, 6) + c(12, 8, 4.5) + '<g opacity="0.55">' + c(19, 7, 3) + c(5, 8, 2.5) + '</g>',
    death_mark: ring(12, 12, 8, 2.2) + s('M12 1v6 M12 17v6 M1 12h6 M17 12h6', 2) + c(12, 12, 2.2),
    dirty_trick: f('M5 20c0-4 3-6 7-6s7 2 7 6z') + c(8, 9, 1.4) + c(12, 6, 1.6) + c(16, 9, 1.3) + c(10, 3, 1) + c(15, 3.5, 1.1) + c(19, 5, 1),
    flurry: s('M5 4l8 16 M10 3l8 16 M15 3l6 12', 2.2),
    burning_hands: f('M5 22v-7l-2-4 2-1 2 3V6a1.5 1.5 0 0 1 3 0v5V4a1.5 1.5 0 0 1 3 0v7V5a1.5 1.5 0 0 1 3 0v8c0 5-3 9-6 9z') + f('M18 2c2 2 4 4 3 7-1-1-2-1-2-1 1 2 0 4-2 5 0-2-1-3-2-4 1-2 3-4 3-7z'),
    misty_step: s('M12 12c0-3 4-3 4 0s-5 6-8 3-1-10 5-10 9 7 6 12', 2) + '<g opacity="0.5">' + s('M3 20h6 M15 20h6', 1.6) + '</g>',
    lightning_bolt: f('M14 1L4 13h6l-3 10 12-14h-6l3-8z'),
    ray_frost: s('M12 2v20 M3 7l18 10 M21 7L3 17', 2) + s('M10 4l2 2 2-2 M10 20l2-2 2 2', 1.6),
    frost_ray: s('M12 2v20 M3 7l18 10 M21 7L3 17', 2) + s('M10 4l2 2 2-2 M10 20l2-2 2 2', 1.6),
    dragon_breath: f('M2 9l7-5 5 3-2 2 3 1-6 3z') + f('M11 12l11-6v14z') + '<g opacity="0.6">' + c(16, 13, 2) + '</g>',
    chaos_bolt: f('M12 1l2.5 7.5L22 7l-5 5.5 5 5.5-7.5-1.5L12 23l-2.5-6.5L2 18l5-6L2 6.5l7.5 2z'),
    fireball: c(13, 14, 7) + f('M6 9C4 6 5 3 8 2c-1 3 1 4 3 5-3 0-4 1-5 2z') + '<g fill="#fff" opacity="0.45">' + c(15, 12, 2.5) + '</g>',
    fire_bolt: f('M20 4c-3 0-6 1-8 3L4 15l2 2 2-1 1 3 2 1 8-8c2-2 3-5 3-8z') + s('M2 22l4-4', 2),
    sacred_flame: f('M12 2c3 4 6 7 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3 0-5 1-8z') + '<g fill="#fff" opacity="0.5">' + f('M12 12c1.5 2 2.5 3 2.5 5a2.5 2.5 0 0 1-5 0c0-2 1-3 2.5-5z') + '</g>',
    cure_wounds: f('M12 21l-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6z') + '<g fill="#fff" opacity="0.8">' + f('M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z') + '</g>',
    regrowth: f('M4 20C4 9 11 4 21 3c-1 10-6 17-17 17z') + s('M4 20c4-5 8-9 12-12', 1.6),
    shield_faith: f('M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z') + '<g fill="#fff" opacity="0.7">' + f('M12 6l1.5 3.5 3.5.5-2.6 2.4.7 3.6L12 14.3 8.9 16l.7-3.6L7 10l3.5-.5z') + '</g>',
    guiding_bolt: f('M15 2l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z') + s('M10 14l-8 8 M7 12l-5 5', 1.6),
    holy_strike: f('M9 2h6v7h-2v12h-2V9H9z') + s('M3 5l3 2 M21 5l-3 2 M2 11h3 M22 11h-3', 1.6),
    radiance: c(12, 12, 5) + s('M12 1v4 M12 19v4 M1 12h4 M19 12h4 M4 4l3 3 M17 17l3 3 M20 4l-3 3 M7 17l-3 3', 2),
    spirit_guardians: ring(12, 12, 9, 1.4) + f('M12 1c2 2 2 4 0 6-2-2-2-4 0-6z M12 17c2 2 2 4 0 6-2-2-2-4 0-6z M1 12c2-2 4-2 6 0-2 2-4 2-6 0z M17 12c2-2 4-2 6 0-2 2-4 2-6 0z') + c(12, 12, 2.5),
    caltrops: f('M6 21l3-7 3 7z M15 21l3-7 3 7z M9 13l3-8 3 8z') + f('M2 22h20v1H2z'),
    war_cry: f('M3 8h4l6-5v18l-6-5H3z') + s('M16 8c2 2 2 6 0 8 M19 5c4 4 4 10 0 14', 2),
    bear_trap: f('M2 14h20v3H2z') + f('M3 14l2-6 2 6z M8 14l2-6 2 6z M13 14l2-6 2 6z M18 14l2-6 2 6z') + f('M5 17l2 4 2-4z M10 17l2 4 2-4z M15 17l2 4 2-4z'),
    shocking_grasp: f('M4 22v-6l-2-4 2-1 2 3V7a1.5 1.5 0 0 1 3 0v5V5a1.5 1.5 0 0 1 3 0v7V7a1.5 1.5 0 0 1 3 0v8c0 4-2 7-5 7z') + f('M20 2l-4 6h3l-2 5 5-7h-3z'),
    glyph: ring(12, 12, 9.5, 1.6) + s('M12 4l7 12H5z', 1.6) + c(12, 12, 1.8),
    toll_dead: f('M12 2a1.5 1.5 0 0 1 1.5 1.5v.7A6 6 0 0 1 18 10v6l2 2H4l2-2v-6a6 6 0 0 1 4.5-5.8v-.7A1.5 1.5 0 0 1 12 2z') + c(12, 21, 2),
    guardian_sigil: ring(12, 12, 10, 1.6) + f('M12 5l5.5 2v4c0 3.5-2.5 6-5.5 7.5-3-1.5-5.5-4-5.5-7.5V7z'),
    moonbeam: f('M15 2a8 8 0 1 0 7 11 6 6 0 1 1-7-11z') + '<g opacity="0.55">' + f('M6 12h4l2 11H4z') + '</g>',
    wolf_form: f('M4 3l4 5h8l4-5v9l-3 5-5 5-5-5-3-5z') + '<g fill="#000" opacity="0.6">' + c(9, 12, 1.3) + c(15, 12, 1.3) + f('M10.5 16h3L12 18z') + '</g>',
    bite_wolf: f('M4 3l4 5h8l4-5v9l-3 5-5 5-5-5-3-5z') + '<g fill="#000" opacity="0.6">' + c(9, 12, 1.3) + c(15, 12, 1.3) + '</g>',
    bear_form: c(12, 15, 6) + c(5, 7, 2.6) + c(10, 4.5, 2.6) + c(15, 4.5, 2.6) + c(20, 7, 2.6),
    maul_bear: c(12, 15, 6) + c(5, 7, 2.6) + c(10, 4.5, 2.6) + c(15, 4.5, 2.6) + c(20, 7, 2.6),
    spider_form: c(12, 9, 3) + c(12, 15, 4.5) + s('M9 12L3 7 M9 14L2 14 M9 16l-6 5 M15 12l6-5 M15 14h7 M15 16l6 5', 1.6),
    bite_spider: c(12, 9, 3) + c(12, 15, 4.5) + s('M9 12L3 7 M9 14L2 14 M9 16l-6 5 M15 12l6-5 M15 14h7 M15 16l6 5', 1.6),
    bat_form: f('M12 8l2-3 1 4c3-3 6-3 8-1-2 0-3 2-3 4-2-1-4 0-5 2-1-1-2-1-3-1s-2 0-3 1c-1-2-3-3-5-2 0-2-1-4-3-4 2-2 5-2 8 1l1-4z'),
    rake_bat: f('M12 8l2-3 1 4c3-3 6-3 8-1-2 0-3 2-3 4-2-1-4 0-5 2-1-1-2-1-3-1s-2 0-3 1c-1-2-3-3-5-2 0-2-1-4-3-4 2-2 5-2 8 1l1-4z'),
    primal_avatar: s('M5 3c2 6 2 12-1 18 M11 2c2 7 2 13 0 20 M17 3c2 6 2 12-1 18', 2.6),
    maul_avatar: s('M5 3c2 6 2 12-1 18 M11 2c2 7 2 13 0 20 M17 3c2 6 2 12-1 18', 2.6),
    thorn_snare: s('M3 20c3-6 6-3 9-8s6-5 9-9', 2.4) + f('M6 15l-3-1 2 3z M10 11l-1-3 3 2z M14 10l3 0-2-2z M18 6l1-3-3 2z'),
    thorn_whip: s('M3 21c6-1 8-8 4-11s2-8 13-7', 2.2) + f('M6 18l-3 0 2 2z M7 12l-3-1 1 3z M12 5l-1-3 3 1z'),
    barkskin: f('M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z') + '<g fill="#000" opacity="0.35">' + f('M9 6h1.5v12H9z M13 5h1.5v14H13z M7 10h1v5H7z M16.5 9h1v6h-1z') + '</g>',
    hex: f('M1 12c4-6 8-8 11-8s7 2 11 8c-4 6-8 8-11 8s-7-2-11-8z') + '<g fill="#000" opacity="0.65">' + c(12, 12, 4) + '</g>' + c(12, 12, 1.6),
    hunger_dark: s('M4 22c0-6 3-8 1-13 M10 22c0-5-2-8 1-14 2-3 0-5-2-6 M16 22c0-6 4-8 2-12s2-6 4-6', 2.4),
    cause_fear: f('M12 2a7 7 0 0 1 7 7v13l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2L5 22V9a7 7 0 0 1 7-7z') + '<g fill="#000" opacity="0.7">' + f('M8 9h2.5v3H8z M13.5 9H16v3h-2.5z') + c(12, 15, 1.5) + '</g>',
    hellfire: f('M12 2c3 4 7 7 7 12a7 7 0 0 1-14 0c0-4 3-6 4-8 0 2 1 4 2 4 0-3 0-6 1-8z') + f('M5 2l3 5-4-1z M19 2l-3 5 4-1z'),
    whispers: s('M3 6c4-3 10-3 14 0 M5 11c3-2 8-2 11 0 M7 16c2-1 5-1 7 0', 2) + c(19, 18, 2.5),
    dark_pact: f('M5 2h11l3 3v17H5z') + '<g fill="#000" opacity="0.45">' + f('M8 7h8v1.5H8z M8 10h8v1.5H8z M8 13h5v1.5H8z') + '</g>' + c(15, 18, 2.6),
    bull_rush: f('M3 9h7l3-4 3 4v4l-3 5H8l-5-3z') + s('M17 7h5 M18 11h5 M17 15h5', 1.8),
    hamstring: s('M5 3l3 9-2 9 M14 3l-1 9 3 9', 2.2) + s('M2 14l20-3', 2.6),
    gut_cut: '<g transform="rotate(-60 12 12)">' + f(DAG) + '</g>' + f('M15 15c0 0 2 3 2 4.5a2 2 0 0 1-4 0c0-1.5 2-4.5 2-4.5z M19 12c0 0 1.5 2 1.5 3a1.5 1.5 0 0 1-3 0c0-1 1.5-3 1.5-3z'),
    tumble: s('M18 12a6 6 0 1 1-6-6', 2.6) + f('M10 2l5 4-6 2z') + s('M2 20h8', 1.6),
    thunderwave: c(5, 12, 3) + s('M10 6c3 3 3 9 0 12 M14 3c5 5 5 13 0 18 M18 1c6 6 6 16 0 22', 2),
    scorching_ray: s('M2 20L20 4', 2.8) + f('M17 2c3 1 5 3 5 6-2-1-3-1-4-1 1-2 0-4-1-5z') + s('M4 14l6-6 M8 20l6-6', 1.4),
    spirit_hammer: f('M7 3h10v6H7z M11 9h2v12h-2z') + s('M3 4l2 2 M21 4l-2 2 M3 10h2 M21 10h-2', 1.6),
    sanctuary: f('M12 2l9 5v1H3V7z M5 9h2v10H5z M11 9h2v10h-2z M17 9h2v10h-2z M3 20h18v2H3z'),
    ice_knife: '<g transform="rotate(45 12 12)">' + f('M12 1l3 6-3 15-3-15z') + '</g>' + s('M3 3l3 3 M2 9h4', 1.4),
    entangle: s('M3 22c1-6 6-6 5-12 M12 22c0-7 4-8 2-14 M20 22c-1-5-5-7-3-12', 2.2) + f('M7 9l-3-2 3-1z M14 7l2-3 1 3z M17 9l3-1-1 3z'),
    void_rift: '<ellipse cx="12" cy="16" rx="10" ry="4"/>' + '<g fill="#000" opacity="0.6"><ellipse cx="12" cy="16" rx="6.5" ry="2.4"/></g>' + s('M7 12c0-4 2-6 1-10 M12 11c0-4 2-6 0-9 M17 12c0-4-2-6 0-10', 1.6),
    fade_out: f('M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z M8 10h8l1 6-3 1v5h-4v-5l-3-1z') + '<g opacity="0.5">' + s('M3 6v12 M21 6v12', 1.4) + '</g>',
    shadow_ward: f('M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z') + '<g fill="#000" opacity="0.55">' + f('M14 6a5 5 0 1 0 2 9 4 4 0 1 1-2-9z') + '</g>'
  };
  // a signature weapon move takes the shape of how it moves
  const MV = {
    rise: s('M5 20L17 6', 2.6) + f('M14 3l7 0 0 7z') + s('M3 15c3 1 5 4 5 6', 1.4),
    drive: s('M3 12h14', 2.8) + f('M15 6l8 6-8 6z') + s('M3 7h5 M3 17h5', 1.4),
    spin: s('M20 12a8 8 0 1 1-3-6.2', 2.6) + f('M16 2l5 4-6 2z'),
    chop: s('M12 3v14', 2.8) + f('M6 15l6 7 6-7z'),
    lowcut: s('M3 17c6-3 12-3 18 0', 2.6) + f('M18 13l5 4-6 2z'),
    bash: P.shield_bash, cone: f('M2 12l20-9v18z') + '<g fill="#fff" opacity="0.4">' + c(8, 12, 2) + '</g>',
    backstab: '<g transform="rotate(45 12 12)">' + f(DAG) + '</g>', smite: P.holy_strike, riposte: P.riposte_hit
  };
  const base = id => String(id).replace(/_(fighter|rogue|sorcerer|cleric|druid|warlock)$/, '').replace(/_c$/, '').replace(/_h$/, '');
  const OLD = G.icon;
  const ROLE = { dmg: ['#ff6a5a', 'Damage'], ctl: ['#ffb84a', 'Control'], heal: ['#6ce08a', 'Heal'], guard: ['#7ab8ff', 'Guard'], move: ['#e8eef4', 'Move'], form: ['#c79bff', 'Shape'] };
  G.roleOf = ab => { if (!ab || typeof ab !== 'object') return null; const id = base(key(ab));
    if (/_form$|primal_avatar/.test(id)) return 'form'; if (ab.heal || /cure|regrowth|second_wind/.test(id)) return 'heal';
    if (ab.type === 'dash' && !ab.dmg) return 'move'; if (ab.type === 'buff') return /relentless|action_surge|spirit|dmg/.test(id) || (ab.buff && ab.buff.dmg) ? 'dmg' : 'guard';
    if (ab.stun || ab.trap || ab.slow || ab.knock > 250) return 'ctl'; return 'dmg'; };
  const key = ab => { if (ab._k) return ab._k; for (const k in A) if (A[k] === ab) return (ab._k = k); return ab.id || ''; };
  Object.keys(A).forEach(k => { if (A[k] && typeof A[k] === 'object') A[k]._k = k; });
  G.icon = ab => {
    if (ab === 'potion' || !ab || typeof ab !== 'object') return OLD(ab);
    const k0 = key(ab), id = base(k0), body = P[id] || P[id.replace(/_c$/, '')] || (G.ICON_EXTRA || {})[id] || (/^[a-z]_[a-z]+_m$/.test(k0) ? MV[ab.mv] || MV.cone : null);
    if (!body) return OLD(ab);
    return '<svg viewBox="0 0 24 24" fill="currentColor" style="color:' + (ab.color || '#e8e0d0') + '">' + body + '</svg>';
  };
  G.ICON_IDS = Object.keys(P);

  // ---- the bar in a bout: each button carries a stripe in its role colour, so a glance says what it does
  const bh0 = ui.buildHud;
  ui.buildHud = function (Pp, E) { const r = bh0.apply(this, arguments);
    document.querySelectorAll('#abar .ab').forEach(b => { const act = b.dataset.act, m = /^a(\d)$/.exec(act), id = m ? Pp.kit[+m[1]] : act === 'ult' ? Pp.ult : null, ab = id && A[id], role = ab ? G.roleOf(ab) : act === 'dodge' ? 'move' : act === 'parry' ? 'guard' : act === 'potion' ? 'heal' : null;
      b.dataset.role = role || ''; if (role) b.style.setProperty('--role', ROLE[role][0]); });
    return r; };

  // ---- your moves, from the pause menu: what each one is, what it is for, and which button
  ui.myMoves = function (back) {
    const F = G.fight, Pp = F && F.P, h = G.state.hero, pad = G.input.usingPad, touch = G.input.touch && !pad, keys = pad ? ['LB', 'RB', 'Y', 'B'] : touch ? ['1st', '2nd', '3rd', 'Big'] : ['Q', 'E', 'R', 'F'];
    const kit = Pp ? Pp.kit.concat([Pp.ult]) : (h.slots || []).concat([h.ult]), basic = A[G.armOf ? G.armOf(h) : G.CLASSES[h.cls].basic];
    const row = (k, ab) => { if (!ab) return ''; const role = G.roleOf(ab); return '<div class="ab-row mymove"><div class="ab-ic">' + G.icon(ab) + '</div><div class="ab-tx"><b>' + ab.name + '</b>' + (role ? '<span class="rolechip" style="--role:' + ROLE[role][0] + '">' + ROLE[role][1] + '</span>' : '') + (ab.cd ? '<small>' + ab.cd + 's cooldown</small>' : '') + '<p>' + (ab.desc || '') + '</p></div><kbd>' + k + '</kbd></div>'; };
    ui._show('<div class="card small"><h2>Your Moves</h2>' + row(pad ? 'X / RT' : touch ? 'Strike' : 'Click', basic) + kit.map((id, i) => row(keys[i], id && A[id])).join('') +
      '<div class="ab-row mymove"><div class="ab-ic">' + OLD({ icon: 'dash', color: '#cfd8e0' }) + '</div><div class="ab-tx"><b>Dodge</b><span class="rolechip" style="--role:' + ROLE.move[0] + '">Move</span><p>A short, heavy sidestep. You cannot be hit during it.</p></div><kbd>' + (pad ? 'A' : 'Space') + '</kbd></div>' +
      '<div class="ab-row mymove"><div class="ab-ic">' + OLD({ icon: 'shield', color: '#ffe9a0' }) + '</div><div class="ab-tx"><b>' + (G.PARRY_INFO ? G.PARRY_INFO[h.cls][0] : 'Parry') + '</b><span class="rolechip" style="--role:' + ROLE.guard[0] + '">Guard</span><p>' + (G.PARRY_INFO ? G.PARRY_INFO[h.cls][1] : 'Tap to parry, hold to block.') + '</p></div><kbd>' + (pad ? 'LT' : touch ? 'Parry' : 'Shift') + '</kbd></div>' +
      '<p class="dim">Colours: <span style="color:' + ROLE.dmg[0] + '">damage</span> · <span style="color:' + ROLE.ctl[0] + '">control</span> · <span style="color:' + ROLE.heal[0] + '">heal</span> · <span style="color:' + ROLE.guard[0] + '">guard</span> · <span style="color:' + ROLE.move[0] + '">move</span> · <span style="color:' + ROLE.form[0] + '">shape</span></p>' +
      '<div class="row end"><button class="big" id="x">Back</button></div></div>');
    ui._on('#x', () => { if (back) back(); else ui.close(); });
  };
  const pm0 = ui.pauseMenu;
  if (pm0) ui.pauseMenu = function () { const r = pm0.apply(this, arguments), ctl = document.getElementById('pctl'); if (ctl && G.state.hero) { const b = document.createElement('button'); b.id = 'pmoves'; b.innerHTML = '<b>Your moves</b><small>What each of your moves does, and its button.</small>'; ctl.parentNode.insertBefore(b, ctl); b.onclick = () => { G.sfx('ui'); ui.myMoves(() => ui.pauseMenu()); }; } return r; };
})();
