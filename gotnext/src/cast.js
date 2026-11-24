// GOT NEXT — people on the Block with a bit more going on. NEXX (new), and a few regulars borrowed from the crew in
// the other games (names hinted, lines taken from those games as written): Mark, D, Erin's stand, Bottie, and Louie.
// Who's who is in docs/CAST.md.
'use strict';
const NEXX_LINES = [
  "Old basketball games? Same game every year with a new number on the box. I came out here for the real thing.",
  "Goji berry wrap. Don't knock it till you try it. Antioxidants, bro.",
  "Running Warzone tonight. Drop in if you got comms.",
  "I get a business idea every ten minutes. Most of them are clothes.",
  "Made this hoodie myself. Cut it, printed it, posted it.",
  "I don't walk anywhere. Car's right here. Where we going?",
  "Discord's at four hundred unread. I'll get to them. I won't get to them.",
  "Hold up, I'm filming. Do something crazy.",
  "Work hard, hoop hard, post harder.",
];
const NEXX_GOALS = [['dunks', 2, 'Throw down 2 dunks'], ['greens', 3, 'Hit 3 greens'], ['ankles', 1, 'Break somebody\'s ankles'], ['threes', 2, 'Hit 2 from deep'], ['ast', 4, 'Dish 4 assists'], ['blk', 2, 'Get 2 blocks']];
const CAST_LINES = {
  mark: ["BRO. I'VE GOT A GUY. THE GUY IS ME.", "I'm not an NPC. I'm between protagonists.", "I LET YOU HAVE ONE HIT. STRATEGY.", "READ MY REVIEWS, BRO. FIVE STARS."],
  markBet: ["I HAD MONEY ON THAT, BRO."],
  d: ["I drive the van. That's my whole part.", "YO. THE TRUCK NEEDS A PART. THE PART NEEDS A TRUCK TO GO GET IT.", "YO! THE FLOW PROS TRUCK DIED. AGAIN. GOT FRIES?"],
  erin: ["A SLOW DAY IS STILL A GOOD DAY.", "GO WATER YOURSELF.", "Back soon. Don't let Marcus touch my seeds.", "BECAUSE I NEVER CHANGE MY MIND."],
  bottie: ["BZZT. THIS IS GOING ON THE FEED.", "CONTEXT WINDOW: FULL OF YOUR MISTAKES.", "BZZT. I PRESSED ONE BUTTON. ONE. EVERYBODY IS SO DRAMATIC.", "PLEASE RATE THIS RESPONSE."],
  louie: ['WOOF.', 'IS IT PATE TIME?', 'SQUIRREL?!', 'MORE SCRATCHES.', 'MUCH VICTORY. VERY GOOD BOY.'],
};
// ---- the people ----
function castNpc(name, style, wornExtra, x, z, face, opts) {
  const b = aiBuild(opts && opts.ovr || 78, style); b.name = name; b.worn = Object.assign(randomWorn(2), wornExtra || {}); const n = addNpc(b, x, z, face, 'idle', Object.assign({ still: true }, opts || {}));
  n.cast = (opts && opts.cast) || name; return n;
}
function castInit() {
  const C = W.cast = { list: [], t: 0 };
  // NEXX: leaning on his car by the cage, filming, on Discord, eating a wrap
  car(-12.9, -10.3, 0, '#16181c'); solid(-15, -10.8, -11.3, -9.3);
  const pl = sign('NEXX', 0.9, 0.24, '#7de3ff', '#0a0a0e', { border: false }); pl.position.set(-10.86, 0.55, -10.3); pl.rotation.y = Math.PI / 2; scene.add(pl);
  const nx = castNpc('NEXX', 'showman', { top: 't_nexx', head: 'hd_nexx', shoes: 'k_nexx' }, -10.2, -9.4, 0.6, { cast: 'nexx' }); nx.amb = 'phone';
  spot(-9.6, -8.6, 1.9, 'NEXX', () => uiNexx()); C.list.push(nx); C.nexx = nx;
  // MARK and D: by the cage fence, watching the run, Mark with money on it
  const mk = castNpc('MARK', 'slasher', { top: 't_tee', head: 'hd_cap' }, -4.3, -10.7, Math.PI, { cast: 'mark' }); mk.amb = 'cross'; C.list.push(mk); C.mark = mk;
  const dd = castNpc('D', 'glass', { head: 'hd_cap', face: 'f_shades' }, -5.3, -11.0, Math.PI + 0.3, { cast: 'd' }); dd.amb = 'watch'; C.list.push(dd);
  spot(-4.8, -9.6, 1.6, 'MARK & D', () => uiDialog('MARK', pick(CAST_LINES.mark), [['Talk to D', () => uiDialog('D', pick(CAST_LINES.d), [['Later']])], ['Later']]));
  // ERIN'S STAND: fresh food off the farm, by the cage on the other side
  { const g = grp(scene, 7.6, 0, -10.6); ink(M(box(2.2, 0.9, 0.8), toon('#7a5a3a'), 0, 0.45, 0, g), 1.03); M(box(2.3, 0.08, 0.9), toon('#4f8a3c'), 0, 0.93, 0, g);
    for (let i = 0; i < 9; i++) M(sph(0.07, 6, 5), toon(pick(['#e0452c', '#f2c14e', '#7ac74f', '#ff8a3c'])), -0.9 + (i % 5) * 0.42, 1.02, -0.18 + Math.floor(i / 5) * 0.3, g);
    for (const sx of [-1.05, 1.05]) M(cyl(0.03, 0.03, 1.4, 5), toon('#3a2a1a'), sx, 1.6, -0.3, g); M(box(2.4, 0.06, 1.0), toon('#4f8a3c'), 0, 2.3, -0.2, g);
    const sg = sign("ERIN'S STAND", 1.8, 0.36, '#f2c14e', '#203a1a', { border: false }); sg.position.set(0, 2.05, 0.18); g.add(sg); solid(6.4, 8.8, -11.1, -10.1); }
  const er = castNpc('ERIN', 'general', { top: 't_tee' }, 7.6, -11.25, 0, { cast: 'erin' }); er.amb = 'watch'; C.list.push(er);
  spot(7.6, -9.4, 1.8, "ERIN'S STAND", () => uiErin());
  // BOTTIE: chrome, dreads, puffer; films the run for the feed
  const bt = castNpc('BOTTIE', 'showman', { hair: 'h_braids', face: 'f_visor', top: 't_hoodie' }, 3.6, -10.9, Math.PI, { cast: 'bottie' }); bt.amb = 'film'; C.list.push(bt);
  spot(3.6, -9.8, 1.5, 'BOTTIE', () => uiDialog('BOTTIE', pick(CAST_LINES.bottie), [['Later']]));
  // LOUIE: the dog. Has a route. Zoomies.
  C.louie = louieInit(2.5, 3);
  spot(2.5, 3, 1.4, 'LOUIE', () => uiLouie()); C.louieSpot = W.spots[W.spots.length - 1];
}
function louieInit(x, z) {
  const g = new THREE.Group(), fur = toon('#d9853b'), cream = toon('#f3e6cf'), dark = toon('#2a1a10'); g.position.set(x, 0, z); scene.add(g);
  const body = ink(M(box(0.24, 0.22, 0.56), fur, 0, 0.32, 0, g), 1.05); M(box(0.2, 0.12, 0.4), cream, 0, 0.24, 0.04, g);
  const head = grp(g, 0, 0.5, 0.33); ink(M(box(0.22, 0.2, 0.2), fur, 0, 0, 0, head), 1.05); M(box(0.12, 0.09, 0.12), cream, 0, -0.04, 0.14, head); M(box(0.05, 0.04, 0.04), dark, 0, -0.01, 0.21, head);
  for (const sx of [-1, 1]) { const e = M(geo('louieEar', () => new THREE.ConeGeometry(0.05, 0.11, 4)), fur, sx * 0.07, 0.14, -0.02, head); e.rotation.z = -sx * 0.15; M(sph(0.018, 6, 5), dark, sx * 0.055, 0.03, 0.1, head); }
  const tail = M(geo('louieTail', () => new THREE.TorusGeometry(0.08, 0.035, 6, 10, 4.6)), fur, 0, 0.5, -0.3, g); tail.rotation.y = Math.PI / 2;
  const legs = []; for (const [lx, lz] of [[-0.08, 0.2], [0.08, 0.2], [-0.08, -0.2], [0.08, -0.2]]) { const l = grp(g, lx, 0.24, lz); M(box(0.06, 0.24, 0.06), fur, 0, -0.12, 0, l); legs.push(l); }
  return { g, head, tail, legs, x, z, face: 0, tx: x, tz: z, wt: 2, zoom: 0, ph: 0, v: 0, hx: x, hz: z };
}
function castStep(dt) {
  const C = W.cast; if (!C) return; C.t += dt; const me = W.me;
  for (const n of C.list) {
    const d = Math.hypot(me.x - n.x, me.z - n.z);
    if (n.cast === 'nexx') { if (d < 4.5) { n.amb = 'film'; n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.08); } else { n.ambT = (n.ambT || 4) - dt; if (n.ambT <= 0 || n.amb === 'film') { n.amb = pick(['phone', 'phone', 'talk', 'bob', 'cross']); n.ambT = rnd(4, 9); } n.face = lerpAng(n.face, 0.6, 0.03); } }
    else if (n.cast === 'bottie') n.amb = 'film';
    else { n.ambT = (n.ambT || 5) - dt; if (n.ambT <= 0) { n.amb = pick(n.cast === 'mark' ? ['cross', 'watch', 'talk', 'point'] : n.cast === 'erin' ? ['watch', 'clap', 'cross'] : ['watch', 'phone', 'cross']); n.ambT = rnd(4, 9); } }
    n.rig.root.position.set(n.x, 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, crowdPose(n.amb, W.t, { ph: n.ph }, n.rig.prof), dt);
    // a line now and then when you walk past
    n.sayT = (n.sayT || rnd(2, 6)) - dt; if (d < 6 && n.sayT <= 0) { n.sayT = rnd(9, 16); const L = n.cast === 'nexx' ? NEXX_LINES : CAST_LINES[n.cast]; if (L) bubble(n.rig.root, pick(L), 4, n.rig.H + 0.35); }
  }
  // Mark has money on the run in the cage
  if (W.park && C.mark) { const s = W.park.score[0] + W.park.score[1]; if (C.lastPark !== undefined && s !== C.lastPark && Math.random() < 0.5) { bubble(C.mark.rig.root, pick(Math.random() < 0.6 ? CAST_LINES.markBet : CAST_LINES.mark), 3.5, C.mark.rig.H + 0.35); C.mark.amb = Math.random() < 0.5 ? 'ohh' : 'up'; C.mark.ambT = 1.8; } C.lastPark = s; }
  // Louie: wanders his route, sometimes the zoomies, comes over when you are close
  const L = C.louie; if (L) {
    const dm = Math.hypot(me.x - L.x, me.z - L.z);
    if (L.zoom > 0) { L.zoom -= dt; const a = C.t * 2.6; L.tx = L.hx + Math.cos(a) * 3.2; L.tz = L.hz + Math.sin(a) * 2.2; }
    else if (dm < 3.5) { L.tx = me.x + (L.x - me.x) / (dm || 1) * 0.9; L.tz = me.z + (L.z - me.z) / (dm || 1) * 0.9; }
    else { L.wt -= dt; if (L.wt <= 0) { L.wt = rnd(3, 7); if (Math.random() < 0.15) { L.zoom = rnd(4, 7); bubble(L.g, 'ZOOMIES', 2.5, 0.9); } else { L.tx = clamp(L.hx + rnd(-6, 6), -12, 12); L.tz = clamp(L.hz + rnd(-5, 5), -8, 10); } } }
    const dx = L.tx - L.x, dz = L.tz - L.z, l = Math.hypot(dx, dz), sp = L.zoom > 0 ? 6 : 1.6; L.v = l > 0.15 ? Math.min(sp, l * 3) : 0;
    if (l > 0.15) { L.x += dx / l * L.v * dt; L.z += dz / l * L.v * dt; L.face = lerpAng(L.face, Math.atan2(dx, dz), 0.2); } else if (dm < 3.5) L.face = lerpAng(L.face, Math.atan2(me.x - L.x, me.z - L.z), 0.1);
    L.ph += dt * (4 + L.v * 5); L.g.position.set(L.x, Math.abs(Math.sin(L.ph)) * 0.02 * Math.min(1, L.v), L.z); L.g.rotation.y = L.face;
    L.legs.forEach((g, i) => { g.rotation.x = Math.sin(L.ph + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.6 * Math.min(1, L.v / 1.5); });
    L.tail.rotation.z = Math.sin(C.t * (dm < 3.5 ? 18 : 6)) * 0.35; L.head.rotation.x = dm < 3.5 ? -0.25 : Math.sin(C.t * 0.7) * 0.1;
    if (C.louieSpot) { C.louieSpot.x = L.x; C.louieSpot.z = L.z; }
  }
}
// ---- NEXX ----
function uiNexx() {
  const today = dayKey(); S.nexx = S.nexx && S.nexx.day === today ? S.nexx : { day: today, goal: Math.floor(dayHash(today, 7) % NEXX_GOALS.length), done: false, wrap: false };
  const G = NEXX_GOALS[S.nexx.goal];
  uiDialog('NEXX', pick(NEXX_LINES), [
    ['RIDE', () => uiDialog('NEXX', "Seatbelt. I don't walk anywhere. Where to?", [['MY CRIB', () => { uiClose(); toast('NEXX DROPPED YOU OFF', '"Don\'t slam my door."'); enterWorld('crib', 0, 19.2, Math.PI); }], ['THE CAGES', () => { uiClose(); toast('NEXX DROPPED YOU OFF', '"Go cook."'); enterWorld('pit', 0, 3.4, Math.PI); }], ['Never mind']])],
    [S.nexx.done ? 'CLIP POSTED TODAY' : 'CONTENT: ' + G[2].toUpperCase(), () => uiDialog('NEXX', S.nexx.done ? 'Clip did numbers. Come back tomorrow, I need new content.' : `I'm filming your next game. ${G[2]} and I post it. Views pay, bro: 200 VC and 60 Respect.`, [['Bet']]), '', S.nexx.done],
    [S.nexx.wrap ? 'NO MORE WRAPS TODAY' : 'GOJI WRAP (free)', () => { S.nexx.wrap = true; S.boosts.push('goji'); save(); sfx('buy'); uiClose(); toast('GOJI BERRY WRAP', '+3 Speed, +3 Acceleration, +5 Stamina next game. "Antioxidants."'); }, '', S.nexx.wrap],
    ['MERCH', () => uiNexxMerch()],
    ['THE SERVER', () => { uiClose(); toast('NEXX', '"Join the Discord. I\'m in there 24/7."'); uiHomie(); }],
    ['Later'],
  ]);
}
function uiNexxMerch() {
  const items = DRIP.filter(d => d.src === 'nexx');
  openPanel(() => `<div class="ph"><h2>NEXX SUPPLY</h2>${vcLine()}${Btn('✕', uiClose, 'alt sm')}</div><div class="pb"><p class="mu">"Designed it, printed it, posted it. Limited. Not really, I'll make more."</p>` + items.map(d => { const own = S.owned.includes(d.id), price = shopPrice(d.cost);
    return `<div class="card"><h3>${d.n}</h3><p class="mu">${d.slot.toUpperCase()}${d.buff ? ' · ' + Object.entries(d.buff).map(([k, v]) => '+' + v + ' ' + k).join(', ') : ''}</p><div style="margin-top:6px">${own ? '<span class="tag on">OWNED</span> ' + Btn('WEAR', () => { S.worn[d.slot] = d.id; save(); if (W && W.me) worldPlayerRig(); sfx('ui'); rerender(); }, 'sm alt') : Btn(price + ' VC', () => { if (S.vc < price) { sfx('no'); return; } S.vc -= price; S.owned.push(d.id); save(); sfx('buy'); toast('NEXX SUPPLY', d.n + ' is yours.'); rerender(); }, 'sm', S.vc < price)}</div></div>`; }).join('') + `</div>`, 'side', () => uiClose());
}
// NEXX's content: checked after every Cages game (main.js)
function nexxCheck(res) {
  const N = S.nexx; if (!N || N.day !== dayKey() || N.done || res.quit || !res.stats) return null; const G = NEXX_GOALS[N.goal];
  if ((res.stats[G[0]] || 0) >= G[1]) { N.done = true; return { vc: 200, rep: 60, note: `NEXX posted your clip: ${(5 + Math.random() * 40).toFixed(1)}K views (+200 VC, +60 Respect)` }; }
  return null;
}
// ---- ERIN'S STAND ----
function uiErin() {
  uiDialog('ERIN', pick(CAST_LINES.erin), [
    ['FARM SMOOTHIE (40 VC)', () => { if (S.vc < 40) { sfx('no'); return; } S.vc -= 40; S.boosts.push('smoothie'); save(); uiHud(); sfx('buy'); uiClose(); toast("ERIN'S STAND", '+6 Stamina, +2 Strength next game. "A slow day is still a good day."'); }, '', S.vc < 40 || S.boosts.includes('smoothie')],
    ['Later'],
  ]);
}
// ---- LOUIE ----
function uiLouie() {
  const today = dayKey(), done = S.louie === today;
  uiDialog('LOUIE', pick(CAST_LINES.louie), [[done ? 'ALREADY SCRATCHED TODAY' : 'SCRATCHES', () => { S.louie = today; gainRep(3); save(); uiClose(); sfx('unlock'); toast('LOUIE', '"MUCH VICTORY. VERY GOOD BOY." +3 Respect'); if (W.cast && W.cast.louie) W.cast.louie.zoom = 3; }, '', done], ['Later']]);
}
