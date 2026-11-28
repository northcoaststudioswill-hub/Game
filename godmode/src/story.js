'use strict';
/* GODMODE.EXE: Story mode. Four guided chapters, each a prepared world and a list of steps.
   The story card says what to do, the button or panel to use pulses, a marker hangs over the
   person or place it means, and a director quietly nudges the world toward the chapter's
   outcome when the player is slow. Each chapter teaches part of the sandbox.

   A step: { say, cont?, ui?, mark?, enter?, push?, done }
   say(S, d) or a string: the instruction (HTML). cont: a CONTINUE button ends the step.
   ui: CSS selector(s) of controls to pulse. mark(S, d): a citizen id or {x, z} for the marker
   and the SHOW button. enter(S, d): once when the step starts. push(S, d, t): once a second,
   t = seconds on this step. done(S, d): true when the step is complete. */

/* ---------------------------------------------------------------- helpers */

function stAdults(S, set) { return S.citizens.filter(c => adult(c) && !c.elder && !c.boat && (set === undefined || c.set === set)); }
function stName(S, id) { const c = getC(S, id); return c ? c.name : nameOf(S, id); }
function stB(id) { return '<b>' + id + '</b>'; }
function stFF(S, mins) { for (let i = 0; i < mins * 60 / SIM_DT; i++) { simStep(S, SIM_DT); S.events.length = 0; } S.log.length = 0; }
function stAdd(S, n) {
  for (let i = 0; i < n && S.citizens.length < POP_MAX; i++) {
    const a = S.rng() * TAU, c = addCitizen(S, Math.sin(a) * 4, Math.cos(a) * 4);
    clampWalk(S.world, c.x, c.z, _pt); c.x = c.px = _pt.x; c.z = c.pz = _pt.z;
    c.age = GROW_SECS + 80 + S.rng() * 300;
    memo(S, c, 'Woke up on the island one morning, as everyone does.');
  }
}
function stBuild(S, type, setId) {
  const p = findSite(S, type, setId || 1);
  if (!p) return null;
  const b = placeBuilding(S, type, p.x, p.z, true, setId || 1);
  b.built = true; b.progress = 1;
  if (type === 'farm') { b.growth = 1; b.food = 6; }
  rebuildObstacles(S); assignHomes(S);
  return b;
}
function stTop(S, res) { for (const k in res) S.res[k] = Math.max(S.res[k], res[k]); }
function stNudge(S, k, n) {
  const pool = S.citizens.filter(c => c.dom !== k && !c.inspired && !c.boat);
  for (let i = 0; i < n && pool.length; i++) addBelief(S, pool.splice((S.rng() * pool.length) | 0, 1)[0], k, 0.25);
}
function stMorning(S) { if (S.day > 0.6) { S.day = 0.04; for (const c of S.citizens) if (c.state === 'sleep') finish(S, c); } }

/* ---------------------------------------------------------------- chapters */

const CHAPTERS = [
  {
    id: 'fire', title: 'THE FIRST FIRE', seed: 4242,
    blurb: 'Six strangers wake with no memory. Learn to watch, feed, shelter and inspire them, until they build you a shrine.',
    setup(S) { S.res.food = 14; S.cycles = 100; return {}; },
    steps: [
      { cont: true, say: 'Six people woke on this island this morning with no memory of anything before. You are the only one who knows why. They will come to call you <b>the Watcher</b>.<br>This chapter teaches you to touch their world.' },
      { say: '<b>Drag</b> to turn the island. <b>Pinch</b> (or scroll) to zoom in and out.', enter: () => { APP.camMoved = 0; }, done: () => APP.camMoved > 120 },
      { say: 'Those are your people. With <b>OBSERVE</b> chosen, <b>tap one</b> to read their mind.', ui: '#pw [data-p=observe]', mark: S => (S.citizens[0] || {}).id,
        enter: () => setPower('observe'), done: S => S.selected > 0 },
      { say: 'It is hard to wake up hungry. Choose <b>BLESS</b>, then tap near the people by the fire.', ui: '#pw [data-p=bless]', mark: () => ({ x: 0, z: 0 }),
        enter: (S, d) => { d.b0 = S.stats.bless; S.cycles = Math.max(S.cycles, 40); for (const c of S.citizens.slice(0, 3)) c.hunger = 0.8; selectCitizen(0); }, done: (S, d) => S.stats.bless > d.b0 },
      { say: 'Shelter next. Choose <b>CREATE</b>, pick <b>HUT</b>, then tap open grass near the fire. They will build it themselves.', ui: '#pw [data-p=create], #sub [data-k=hut]', mark: () => ({ x: 3.5, z: 2 }),
        enter: S => { APP.createKind = 'hut'; UI.lastSub = ''; stTop(S, { wood: 14 }); }, done: S => S.buildings.some(b => b.type === 'hut') },
      { say: 'Now watch them build it. Tap the <b>1x</b> button (top right) to speed time up.', ui: '#btnSpeed', mark: S => { const b = S.buildings.find(b => b.type === 'hut'); return b && { x: b.x, z: b.z }; },
        push: (S, d, t) => { stTop(S, { wood: 12 }); const b = S.buildings.find(b => b.type === 'hut'); if (b && t > 40) b.progress = Math.min(0.99, b.progress + 0.02); },
        done: S => S.buildings.some(b => b.type === 'hut' && b.built) },
      { say: 'Now give them an idea. Choose <b>INSPIRE</b>, choose <b>DEVOTION</b>, then tap anyone.', ui: '#pw [data-p=inspire], #sub [data-k=b0]', mark: S => (S.citizens[1] || {}).id,
        enter: S => { APP.inspireK = DEV; UI.lastSub = ''; S.cycles = Math.max(S.cycles, 30); setSpeed(1); }, done: S => S.citizens.some(c => c.inspired && c.inspired.k === DEV) || S.counts[DEV] >= 3 },
      { say: 'They preach it to anyone who will listen, and ideas spread when people talk. Wait until <b>four</b> of them believe. (Their hats turn into halos.)', ui: '#zeit',
        push: (S, d, t) => { if (t > 25 && t % 8 === 0) stNudge(S, DEV, 1); }, done: S => S.counts[DEV] >= 4 },
      { say: 'A faith needs a place. Choose <b>CREATE</b>, pick <b>SHRINE</b>, and tap open ground near the fire.', ui: '#pw [data-p=create], #sub [data-k=shrine]',
        enter: S => { APP.createKind = 'shrine'; UI.lastSub = ''; stTop(S, { wood: 12, stone: 16 }); }, mark: () => ({ x: -3.5, z: 3 }), done: S => S.buildings.some(b => b.type === 'shrine') },
      { say: 'Wait for the Shrine to rise. When they pray there, your <b>CYCLES</b> (the purple bar) refill faster.', ui: '#cyc', mark: S => { const b = S.buildings.find(b => b.type === 'shrine'); return b && { x: b.x, z: b.z }; },
        push: (S, d, t) => { stTop(S, { wood: 10, stone: 14 }); const b = S.buildings.find(b => b.type === 'shrine'); if (b && t > 35) b.progress = Math.min(0.99, b.progress + 0.02); },
        done: S => S.buildings.some(b => b.type === 'shrine' && b.built) },
      { say: 'When half of them share one idea, an <b>Age</b> begins and changes the rules for everyone. Wait for the <b>Age of Devotion</b>.', ui: '#zeit',
        push: (S, d, t) => { stMorning(S); if (t > 15 && t % 6 === 0) stNudge(S, DEV, 1); }, done: S => S.age === DEV }
    ],
    outcome: () => ({ title: 'THE FIRST FIRE', text: 'They have a god now, and a place to talk to it. Every prayer at the Shrine is a little more power for you, and every miracle makes them surer you are real.\n\nYou learned to <b>observe</b>, <b>bless</b>, <b>create</b> and <b>inspire</b>. Next: what one life looks like up close.' })
  },
  {
    id: 'life', title: 'A LIFE IN YOUR HANDS', seed: 777,
    blurb: 'One person, all of them: their wishes, their secrets, a love, a child, a business, and a fight that only you can stop.',
    setup(S) {
      stFF(S, 4); stAdd(S, Math.max(0, 11 - S.citizens.length));
      const ad = stAdults(S);
      for (const c of ad) { c.mate = 0; if (c.age < GROW_SECS + 60) c.age = GROW_SECS + 60 + S.rng() * 200; }
      const hero = ad[0], love = ad.find(c => c !== hero && !kin(c, hero)), trader = ad.find(c => c !== hero && c !== love);
      hero.rel[love.id] = 0.38; love.rel[hero.id] = 0.38;
      trader.coin = 2; trader.job = 0;
      stBuild(S, 'hut'); stBuild(S, 'hut'); stBuild(S, 'farm');
      S.res.food = 70; S.res.wood = 40; S.res.stone = 20; S.cycles = 100;
      return { hero: hero.id, love: love.id, trader: trader.id };
    },
    steps: [
      { cont: true, say: (S, d) => stB(stName(S, d.hero)) + ' has lived here as long as anyone can remember. Today you will change their life.<br>This chapter is about one person, and how far your hand reaches into them.' },
      { say: (S, d) => 'Tap ' + stB(stName(S, d.hero)) + ' (marked with the arrow) to see them.', mark: (S, d) => d.hero, enter: () => setPower('observe'), done: (S, d) => S.selected === d.hero },
      { say: 'Now tap <b>LIFE</b> in their panel.', ui: '#inLife', mark: (S, d) => d.hero, done: (S, d) => APP.lifeOpen && UI.lifeId === d.hero },
      { cont: true, say: 'This is everything about them. <b>What they want</b> and <b>what they hide</b>, with buttons to grant or reveal. STORY is their life as they remember it, and PEOPLE is how they feel about everyone.', ui: '#lfBody h4' },
      { say: (S, d) => 'Open <b>STEER</b>, choose <b>Kindle love for...</b>, and pick ' + stB(stName(S, d.love)) + '.', ui: '#lfTabs [data-t=steer], #lfBody [data-act=love]',
        enter: S => { S.cycles = Math.max(S.cycles, 40); }, done: (S, d) => (getC(S, d.hero) || {}).mate === d.love,
        push: (S, d) => { const h = getC(S, d.hero), l = getC(S, d.love); if (h && l && !h.mate && relOf(h, l) > 0.6) { l.rel[h.id] = Math.max(l.rel[h.id] || 0, 0.5); pairUp(S, h, l); } } },
      { say: (S, d) => 'Close the panel (X) and give them time. Tap <b>1x</b> to speed up. Watch for a child.', ui: '#lfClose, #btnSpeed', mark: (S, d) => d.hero,
        push: (S, d) => { if (S.citizens.length >= popCap(S) - 1) stBuild(S, 'hut'); S.birthCd = Math.min(S.birthCd, 4); S.res.food = Math.max(S.res.food, 60); const h = getC(S, d.hero), l = getC(S, d.love); if (h) h.happy = Math.max(h.happy, 0.7); if (l) l.happy = Math.max(l.happy, 0.7); for (const c of S.citizens) if (c.mate && c.id !== d.hero && c.id !== d.love) { const m = getC(S, c.mate); if (m) { m.mate = 0; } c.mate = 0; } },
        done: (S, d) => { const k = S.citizens.find(k => k.par.indexOf(d.hero) >= 0); if (k) d.kid = k.id; return !!k; } },
      { say: (S, d) => 'A child, ' + stB(stName(S, d.kid)) + '. Open ' + stB(stName(S, d.hero)) + '\'s <b>LIFE</b> and the <b>STORY</b> tab: it is all written down.', ui: '#inLife, #lfTabs [data-t=story]', mark: (S, d) => d.hero,
        enter: () => setSpeed(1), done: (S, d) => APP.lifeOpen && UI.lifeId === d.hero && UI.lifeTab === 'story' },
      { say: (S, d) => stB(stName(S, d.trader)) + ' dreams of a business but has no money. Close this panel, open ' + stB(stName(S, d.trader)) + '\'s LIFE, and in STEER choose <b>Shower them with coin</b>.', mark: (S, d) => d.trader, ui: '#lfClose, #lfBody [data-act=rich]',
        enter: S => { S.cycles = Math.max(S.cycles, 30); }, done: (S, d) => (getC(S, d.trader) || { coin: 0 }).coin >= 12 },
      { say: (S, d) => 'With money in hand, ' + stB(stName(S, d.trader)) + ' stakes out a bakery. Close the panel and wait for it to open.', ui: '#lfClose, #btnSpeed',
        mark: (S, d) => { const b = S.buildings.find(b => b.type === 'shop' && b.owner === d.trader); return b ? { x: b.x, z: b.z } : d.trader; },
        enter: (S, d) => { const c = getC(S, d.trader); if (c && !S.buildings.some(b => b.type === 'shop' && b.owner === c.id)) { const p = findSite(S, 'shop', c.set); if (p) { const b = placeBuilding(S, 'shop', p.x, p.z, true, c.set); b.biz = 'bakery'; b.owner = c.id; b.till = 0; c.job = b.id; c.coin -= 5; logMsg(S, c.name + ' has staked out a bakery.', 'good'); memo(S, c, 'Started building a bakery of their own.'); } } },
        push: (S, d, t) => { stTop(S, { wood: 12, stone: 6 }); const b = S.buildings.find(b => b.type === 'shop' && b.owner === d.trader); if (b && t > 30) b.progress = Math.min(0.99, b.progress + 0.03); },
        done: (S, d) => S.buildings.some(b => b.type === 'shop' && b.owner === d.trader && b.built) },
      { say: (S, d) => 'Trouble. ' + stB(stName(S, d.fa)) + ' and ' + stB(stName(S, d.fb)) + ' have hated each other for years, and now they are fighting. Choose <b>BLESS</b> and tap them to stop it.', ui: '#pw [data-p=bless]', mark: (S, d) => d.fa,
        enter: (S, d) => {
          setSpeed(1); stMorning(S);
          const pool = stAdults(S).filter(c => c.id !== d.hero && c.id !== d.love && c.id !== d.trader);
          const a = pool[0], b = pool[1];
          d.fa = a.id; d.fb = b.id; d.c0 = S.stats.calmed || 0; S.cycles = Math.max(S.cycles, 30);
          b.x = a.x + 1; b.z = a.z; clampWalk(S.world, b.x, b.z, _pt); b.x = b.px = _pt.x; b.z = b.pz = _pt.z;
          addRel(a, b, -1.6); a.tr.brave = Math.max(a.tr.brave, 0.6); finish(S, a); finish(S, b); startFight(S, a, b, 'You owe me, and everyone knows it!');
          R.cam.tx = a.x; R.cam.tz = a.z; R.cam.dist = 18;
        },
        push: (S, d) => { const a = getC(S, d.fa), b = getC(S, d.fb); if (a && b && a.state !== 'fight' && a.state !== 'ko' && b.state !== 'ko' && (S.stats.calmed || 0) === d.c0) { a.actCd = 0; a.health = b.health = 1; startFight(S, a, b, 'And another thing!'); } else if (a && a.state === 'fight' && a.lead) a.t = Math.max(a.t, 4); },
        done: (S, d) => (S.stats.calmed || 0) > d.c0 }
    ],
    outcome: (S, d) => ({ title: 'A LIFE IN YOUR HANDS', text: stName(S, d.hero) + ' has a partner, a child and ' + ((getC(S, d.hero) || { mem: [] }).mem.length) + ' memories now, and some of them were yours. A bakery is open, and two old enemies have been made to stop.\n\nYou learned <b>LIFE</b>: wishes, secrets, story, people, and the <b>STEER</b> powers. Next: what happens when two beliefs meet.' })
  },
  {
    id: 'truths', title: 'TWO TRUTHS', seed: 31337,
    blurb: 'Half the island worships you; the other half says the sky is empty. Push them to war, then choose: a miracle, or a victor.',
    setup(S) {
      stFF(S, 3); stAdd(S, Math.max(0, 16 - S.citizens.length));
      const ad = stAdults(S);
      ad.forEach((c, i) => { c.b = [0, 0, 0, 0]; c.b[i % 2 ? KIN : DEV] = 0.85; c.dom = -1; refreshDom(S, c); c.age = Math.max(c.age, GROW_SECS + 60); });
      for (const c of S.citizens) if (!adult(c)) { c.b = [0, 0, 0, 0]; c.dom = -1; }
      S.counts = [0, 0, 0, 0]; for (const c of S.citizens) if (c.dom >= 0) S.counts[c.dom]++;
      factionTick(S); factionTick(S);
      S.tension = {}; S.truceT = 0; S.day = 0.08; S.cycles = 100; S.log.length = 0;
      const fa = facOfK(S, DEV, 1), fb = facOfK(S, KIN, 1);
      return { fa: fa.id, fb: fb.id, la: fa.leader, lb: fb.leader };
    },
    steps: [
      { cont: true, say: 'Half the island believes the Watcher loves them. The other half believes the sky is empty and they only have each other. Each side has a leader who is sure.<br><b>Two truths cannot share one island for long.</b>' },
      { say: (S, d) => 'Tap ' + stB(stName(S, d.la)) + ', who leads the ' + stB(getF(S, d.fa).name) + '. (Leaders wear crowns.)', mark: (S, d) => d.la, enter: () => setPower('observe'), done: (S, d) => S.selected === d.la },
      { say: (S, d) => 'Now tap ' + stB(stName(S, d.lb)) + ', who leads the ' + stB(getF(S, d.fb).name) + ', the ones with the green sprouts.', mark: (S, d) => d.lb, done: (S, d) => S.selected === d.lb },
      { say: (S, d) => 'Push them over the edge. Open ' + stB(stName(S, d.lb)) + '\'s <b>LIFE</b>, then <b>STEER</b>, then <b>Fill them with rage</b>.', ui: '#inLife, #lfTabs [data-t=steer], #lfBody [data-act=enrage]', mark: (S, d) => d.lb,
        enter: S => { S.cycles = Math.max(S.cycles, 30); }, done: (S, d) => { const c = getC(S, d.lb); return !!S.war || (c && (c.state === 'fight' || c.state === 'tantrum' || c.state === 'ko')); } },
      { say: 'Close the panel and watch. Anger spreads, and when the grudges pile up the two sides go to war.', ui: '#lfClose',
        enter: (S, d) => { S.tension[tensionKey(d.fa, d.fb)] = 6; },
        push: (S, d, t) => { stMorning(S); S.tension[tensionKey(d.fa, d.fb)] = (S.tension[tensionKey(d.fa, d.fb)] || 0) + 0.6; S.truceT = 0; },
        done: S => !!S.war },
      { say: 'WAR. You can end it with a miracle: choose <b>BLESS</b> and tap the battlefield (marked). Or do nothing, and let the stronger side win.', ui: '#pw [data-p=bless]',
        mark: S => S.war ? { x: (S.war.ax + S.war.bx) / 2, z: (S.war.az + S.war.bz) / 2 } : null,
        enter: (S, d) => { d.t0 = S.stats.truce || 0; S.cycles = Math.max(S.cycles, 20); if (S.war) { R.cam.tx = (S.war.ax + S.war.bx) / 2; R.cam.tz = (S.war.az + S.war.bz) / 2; R.cam.dist = 22; } },
        done: (S, d) => { if (S.war) return false; d.how = (S.stats.truce || 0) > d.t0 ? 'peace' : 'victory'; const lost = S.factions.filter(f => f.lostT && f.lostT > S.t - 30)[0]; d.loser = lost ? lost.name : ''; return true; } }
    ],
    outcome: (S, d) => d.how === 'peace'
      ? { title: 'THE MIRACLE', text: 'A light fell between the two lines and both sides put down their fists. Nobody won. Everyone saw who stopped it, and a few of them are a little more devout tonight.\n\nYou learned <b>factions</b>, <b>leaders</b>, <b>tension</b> and <b>war</b>, and that a blessing can end one. Next: the world beyond the fog.' }
      : { title: 'THE VICTORS', text: 'You let it run. ' + (d.loser ? 'The ' + d.loser + ' lost, and some of them have quietly changed sides.' : 'Nobody won outright, and everyone went home bruised.') + ' The winners will tell this story for generations.\n\nYou learned <b>factions</b>, <b>leaders</b>, <b>tension</b> and <b>war</b>. Next: the world beyond the fog.' }
  },
  {
    id: 'fog', title: 'BEYOND THE FOG', seed: 9001,
    blurb: 'Your people have learned that wood floats. Send an explorer into the fog, find land, and watch a faith sail away to found a world of its own.',
    setup(S) {
      stFF(S, 5); stAdd(S, Math.max(0, 17 - S.citizens.length));
      if (!S.buildings.some(b => b.type === 'shrine')) stBuild(S, 'shrine');
      if (!S.buildings.some(b => b.type === 'lab')) stBuild(S, 'lab');
      S.res.insight = Math.max(S.res.insight, 40); S.res.food = 80; S.res.wood = 40; S.res.stone = 20; S.cycles = 100;
      S.tech.boats = true;
      const dock = placeDock(S, S.sets[0]); dock.built = true; dock.progress = 1;
      makeBoat(S, S.sets[0], dock); makeBoat(S, S.sets[0], dock);
      const ad = stAdults(S);
      const kin5 = ad.slice(0, 5);
      kin5.forEach(c => { c.b = [0, 0, 0, 0]; c.b[KIN] = 0.9; c.dom = -1; refreshDom(S, c); });
      S.counts = [0, 0, 0, 0]; for (const c of S.citizens) if (c.dom >= 0) S.counts[c.dom]++;
      factionTick(S); factionTick(S);
      const f = facOfK(S, KIN, 1);
      const explorer = ad.find(c => kin5.indexOf(c) < 0 && c.title !== 'leader') || ad[6];
      explorer.tr.brave = Math.max(explorer.tr.brave, 0.7); explorer.curio = 1;
      S.voyCd = 9999; S.settleCd = 9999; S.day = 0.08; S.log.length = 0;
      return { dock: dock.id, fac: f.id, leader: f.leader, explorer: explorer.id };
    },
    steps: [
      { cont: true, say: 'Your people have learned that <b>wood floats</b>. They have a dock and two boats. Beyond the fog there is more world, and some of them are restless.<br>This chapter is about letting them go.' },
      { say: 'Find the <b>dock</b> on the shore (marked) and tap it with <b>OBSERVE</b>.', ui: '#pw [data-p=observe]', mark: (S, d) => { const b = getB(S, d.dock); return b && { x: b.x, z: b.z }; },
        enter: (S, d) => { setPower('observe'); const b = getB(S, d.dock); if (b) { R.cam.tx = b.x; R.cam.tz = b.z; R.cam.dist = 22; } }, done: (S, d) => UI.inspectB === d.dock },
      { say: (S, d) => 'Choose <b>INTERVENE</b>, then pick up ' + stB(stName(S, d.explorer)) + ' (marked) and drop them on the dock. Someone set down on a dock takes a boat out.', ui: '#pw [data-p=intervene]', mark: (S, d) => d.explorer,
        enter: (S, d) => { UI.inspectB = 0; S.cycles = Math.max(S.cycles, 20); const c = getC(S, d.explorer); if (c) { R.cam.tx = c.x; R.cam.tz = c.z; } },
        done: S => S.boats.some(b => b.m && b.m.kind === 'explore') },
      { say: 'They are away. Tap the <b>&#9678;</b> button (top) to follow the boat.', ui: '#btnGo', enter: () => setPower('observe'), done: (S, d, t) => !!UI.goBoat || t > 25 },
      { say: 'Wait for land. Speed up time with <b>1x</b> if you like. The fog clears wherever the boat goes.', ui: '#btnSpeed',
        push: S => {
          // the current carries them toward the nearest island nobody has seen
          const b = S.boats.find(b => b.m && b.m.kind === 'explore' && b.st === 'out');
          if (b && !b.m.circling) { let best = null, bd = 1e9; for (const I of S.world.isles) if (!S.found[I.id]) { const dd = hyp(I.cx - b.x, I.cz - b.z); if (dd < bd) { bd = dd; best = I; } } if (best) { b.m.tx = best.cx + (b.x - best.cx) / bd * (best.R + 6); b.m.tz = best.cz + (b.z - best.cz) / bd * (best.R + 6); b.t = Math.min(b.t, 40); } }
        },
        done: S => S.found.filter(Boolean).length >= 2 },
      { say: (S, d) => 'Land! The ' + stB(getF(S, d.fac).name) + ' have never fitted in here. Choose <b>INTERVENE</b> and drop their leader, ' + stB(stName(S, d.leader)) + ', on the dock. Their followers will go with them.', ui: '#pw [data-p=intervene]', mark: (S, d) => d.leader,
        enter: (S, d) => { setSpeed(1); stMorning(S); S.cycles = Math.max(S.cycles, 20); const c = getC(S, d.leader); if (c) { R.cam.tx = c.x; R.cam.tz = c.z; R.cam.dist = 24; UI.goBoat = 0; } if (!freeBoat(S, 1)) { const dk = getB(S, d.dock); makeBoat(S, S.sets[0], dk); } },
        push: (S, d) => { const f = getF(S, d.fac); if (f && f.leader !== d.leader && f.leader) d.leader = f.leader; },
        done: S => S.boats.some(b => b.m && b.m.kind === 'settle') },
      { say: 'Watch them go. Tap <b>&#9678;</b> to follow them across the sea.', ui: '#btnGo, #btnSpeed', done: S => S.sets.length >= 2, push: S => stMorning(S) }
    ],
    outcome: (S) => { const t = S.sets[S.sets.length - 1]; return { title: 'BEYOND THE FOG', text: t.name + ' now stands on ' + isleName(S, t.isle) + '. It has its own hearth, its own stockpile, and soon its own ideas. The ones who stayed will change too.\n\nYou learned <b>docks</b>, <b>boats</b>, <b>exploring</b> and <b>colonies</b>. That is everything. The world is yours: start an <b>Endless</b> world from the title screen and take them wherever you like.' }; }
  }
];

/* ------------------------------------------------------------ the engine */

const STORY = { el: null };

function storyMenu() {
  const done = APP.settings.storyDone || {};
  const html = 'Four guided chapters. Each sets up a world, tells you what to do, and leads to an ending. Together they teach the whole sandbox.\n\n' +
    CHAPTERS.map((c, i) => '<span class="big">' + (i + 1) + '. ' + c.title + (done[c.id] ? ' &#10003;' : '') + '</span>' + c.blurb).join('\n\n');
  showDlg('STORY', html, CHAPTERS.map((c, i) => ({ label: (i + 1) + '. ' + c.title + (done[c.id] ? ' ✓' : ''), fn: () => startStory(i) })).concat([{ label: 'Back' }]), 'story');
}
function startStory(i) {
  const ch = CHAPTERS[i];
  const S = newSim(ch.seed, false);
  const data = ch.setup(S) || {};
  S.events.length = 0;
  S.story = { ch: i, step: 0, t: 0, data, entered: -1 };
  lsDel(SAVE_KEY); APP.hasSave = false;
  setSim(S);
  APP.mode = 'play';
  $('title').hidden = true; $('hud').hidden = false;
  const C = R.cam;
  C.auto = false; C.follow = 0; C.tx = 0; C.tz = 0; C.dist = R.w < R.h ? 30 : 24; C.pitch = 0.8;
  setPower('observe'); setSpeed(1);
  APP.last = performance.now();
  banner('CHAPTER ' + (i + 1), ch.title, '#ff8ae6');
  saveGame();
}
function storyActive() { return APP.S && APP.S.story && APP.mode === 'play'; }

/* once a UI tick: run the current step */
function storyTick(S, dt) {
  const st = S.story, el = $('story');
  document.querySelectorAll('.hl').forEach(e => e.classList.remove('hl'));
  if (!st || APP.mode !== 'play') { if (!el.hidden) el.hidden = true; UI.storyMark = null; return; }
  const ch = CHAPTERS[st.ch], step = ch.steps[st.step];
  if (!step) { finishStory(S); return; }
  if (st.entered !== st.step) {
    st.entered = st.step; st.t = 0; st.acc = 0;
    if (step.enter) step.enter(S, st.data);
    UI.storyShown = -1;
  }
  // the director runs on sim time, once a second
  const running = !APP.menuOpen && !APP.dlgOpen && !APP.lifeOpen && !APP.hidden;
  if (running) {
    st.acc += dt * APP.speed;
    while (st.acc >= 1) { st.acc -= 1; st.t++; if (step.push) step.push(S, st.data, st.t); }
  }
  if (!step.cont && step.done && step.done(S, st.data, st.t)) { nextStep(S); return; }
  // pulse the controls the step is about
  if (step.ui) document.querySelectorAll(step.ui).forEach(e => e.classList.add('hl'));
  const mk = step.mark ? step.mark(S, st.data) : null;
  UI.storyMark = typeof mk === 'number' ? (getC(S, mk) ? { id: mk } : null) : mk || null;
  el.classList.toggle('over', !!APP.lifeOpen);
  if (UI.storyShown === st.step) return;
  UI.storyShown = st.step;
  el.hidden = false;
  $('storyStep').textContent = 'CHAPTER ' + (st.ch + 1) + ' · ' + (st.step + 1) + '/' + ch.steps.length;
  $('storyText').innerHTML = typeof step.say === 'function' ? step.say(S, st.data) : step.say;
  $('storyGo').hidden = !step.cont;
  $('storyShow').hidden = !step.mark;
}
function nextStep(S) {
  const st = S.story;
  st.step++;
  sfx('stage');
  if (st.step >= CHAPTERS[st.ch].steps.length) finishStory(S);
  saveGame();
}
function finishStory(S) {
  const st = S.story; if (!st) return;
  const ch = CHAPTERS[st.ch], out = ch.outcome(S, st.data);
  APP.settings.storyDone = APP.settings.storyDone || {};
  APP.settings.storyDone[ch.id] = 1; saveSettings();
  S.story = null; UI.storyMark = null; $('story').hidden = true;
  S.voyCd = Math.min(S.voyCd, 60); S.settleCd = Math.min(S.settleCd, 120);   // the world runs on its own again
  document.querySelectorAll('.hl').forEach(e => e.classList.remove('hl'));
  const nextI = st.ch + 1 < CHAPTERS.length ? st.ch + 1 : -1;
  const btns = [];
  if (nextI >= 0) btns.push({ label: 'Chapter ' + (nextI + 1) + ': ' + CHAPTERS[nextI].title, fn: () => startStory(nextI) });
  btns.push({ label: 'Keep playing this world', fn: () => { saveGame(); } });
  btns.push({ label: 'Title screen', fn: () => { saveGame(); showTitle(); } });
  showDlg('CHAPTER ' + (st.ch + 1) + ' COMPLETE', '<span class="big">' + out.title + '</span>' + out.text, btns, 'story');
  sfx('sing');
}
function storyShow() {
  const m = UI.storyMark; if (!m) return;
  const c = m.id ? getC(APP.S, m.id) : null, x = c ? c.x : m.x, z = c ? c.z : m.z;
  R.cam.follow = 0; UI.goBoat = 0; R.cam.tx = x; R.cam.tz = z; R.cam.dist = Math.min(R.cam.dist, 22);
}
function storyInit() {
  $('storyGo').onclick = () => { sfx('click'); if (storyActive()) nextStep(APP.S); };
  $('storyShow').onclick = () => { sfx('click'); storyShow(); };
  $('storyQuit').onclick = () => { sfx('click'); confirmDlg('LEAVE THE STORY', 'Stop the guided chapter and keep this world as an ordinary endless one?', 'Leave the story', () => { APP.S.story = null; $('story').hidden = true; UI.storyMark = null; saveGame(); }); };
  $('btnStory').onclick = () => { auInit(); sfx('click'); if (APP.hasSave) confirmDlg('START A CHAPTER', 'This replaces the saved world on this device.', 'Continue', () => setTimeout(storyMenu, 0)); else storyMenu(); };
}

/* tests only: run the world and the story's director for a while without rendering */
function storyFastForward(secs) {
  const S = APP.S;
  for (let i = 0; i < secs && S.story; i++) {
    for (let k = 0; k < 20; k++) simStep(S, SIM_DT);
    handleEvents(S);
    const st = S.story, step = CHAPTERS[st.ch].steps[st.step];
    if (!step) break;
    if (st.entered !== st.step) { st.entered = st.step; st.t = 0; st.acc = 0; if (step.enter) step.enter(S, st.data); }
    st.t++; if (step.push) step.push(S, st.data, st.t);
    if (!step.cont && step.done && step.done(S, st.data, st.t)) { nextStep(S); if (!S.story) break; }
  }
}
