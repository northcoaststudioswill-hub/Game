/* Headless balance run of the simulation core (no browser).
   node godmode/tests/sim_balance.js [seeds]                                  */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['core.js', 'world.js', 'sim.js', 'society.js', 'life.js'].map(f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
const ctx = { console, Math, JSON };
vm.createContext(ctx);
vm.runInContext(src + '\nthis.API={newSim,simStep,serialize,deserialize,powerObserve,powerBless,powerSmite,powerCreate,powerInspire,powerGrab,powerDrag,powerDrop,popCap,countB,firstB,STAGES,BELIEFS,SIM_DT};', ctx);
const A = ctx.API;
const SOC = { love: 'couples', breakup: 'splits', leader: 'leaders', fight: 'fights', war: 'wars', steal: 'thefts', shop: 'shops', hermit: 'hermits', festival: 'festivals', grownup: 'grownups' };
const fmt = t => ((t / 60) | 0) + ':' + String((t % 60) | 0).padStart(2, '0');

function run(seed, mode, maxMin) {
  const S = A.newSim(seed);
  const stageAt = {}; let minPop = 99, maxPop = 0, last = 0;
  const steps = maxMin * 60 / A.SIM_DT;
  let fail = 0, monoT = 0, seedT = 0; const soc = {};
  for (let i = 0; i < steps; i++) {
    A.simStep(S, A.SIM_DT);
    for (const e of S.events) { if (e.type === 'stage') stageAt[e.stage] = S.t; if (SOC[e.type]) soc[SOC[e.type]] = (soc[SOC[e.type]] || 0) + 1; }
    S.events.length = 0;
    if (i === 100) A.powerObserve(S, S.citizens[0].id);
    if (mode === 'active' && i % 20 === 0) {
      const t = S.t, c0 = S.citizens[0];
      // a modest player: inspire ACCELERATION twice early, bless when someone is hungry, place the Spire promptly
      if (S.citizens.length && S.cycles > 40) {
        const hungry = S.citizens.find(c => c.hunger > 0.8);
        if (hungry) A.powerBless(S, hungry.x, hungry.z);
      }
      if (t > 60 && S.stats.inspire < 2 && S.cycles >= 20 && c0) A.powerInspire(S, S.citizens[S.stats.inspire].id, 2);
      if (t > 200 && S.stats.inspire < 6 && S.cycles >= 60 && (t | 0) % 90 === 0) A.powerInspire(S, S.citizens[(S.rng() * S.citizens.length) | 0].id, 2);
      if (S.spireUnlocked && !A.firstB(S, 'spire')) {
        for (let k = 0; k < 40 && !A.firstB(S, 'spire'); k++) { const a = k * 0.7, r = 5 + k * 0.2; A.powerCreate(S, 'spire', Math.sin(a) * r, Math.cos(a) * r); }
        S.events.length = 0;
      }
    }
    if (mode === 'cruel' && i % 600 === 300 && S.citizens.length > 3) A.powerSmite(S, 0, 0, S.citizens[0].id);
    if (stageAt[3] && i % 20 === 0 && S.citizens.length) { seedT++; if (Math.max.apply(null, S.counts) / S.citizens.length >= 0.9) monoT++; }
    const p = S.citizens.length; minPop = Math.min(minPop, p); maxPop = Math.max(maxPop, p);
    for (const c of S.citizens) if (!isFinite(c.x) || !isFinite(c.z)) fail++;
    if (S.sandbox && !last) last = S.t;
    if (last && S.t > last + 60) break;
  }
  // save round trip
  const S2 = A.deserialize(A.serialize(S));
  for (let i = 0; i < 400; i++) A.simStep(S2, A.SIM_DT);
  const st = [1, 2, 3, 4, 5, 6].map(k => stageAt[k] ? fmt(stageAt[k]) : '--').join(' ');
  console.log(`seed ${seed} ${mode.padEnd(7)} stages[${st}] pop ${minPop}-${maxPop} now ${S.citizens.length} deaths ${S.stats.deaths} births ${S.stats.births} ` +
    `res f${S.res.food | 0} w${S.res.wood | 0} s${S.res.stone | 0} i${S.res.insight | 0} counts ${S.counts.join('/')} mono ${seedT ? Math.round(100 * monoT / seedT) : 0}% age ${S.age} ` +
    `\n    society ${Object.keys(soc).map(k => k + ' ' + soc[k]).join(', ') || 'none'} | kids ${S.citizens.filter(c => c.grow < 1).length} coin ${S.citizens.reduce((a, c) => a + c.coin, 0)} factions ${S.factions.map(f => f.name + '(' + S.citizens.filter(c => c.fac === f.id).length + ')').join(' ')}\n    bld ${S.buildings.map(b => b.type[0] + (b.built ? '' : '*')).join('')} nan ${fail} reload ${S2.citizens.length}`);
  return { S, stageAt, mono: seedT ? monoT / seedT : 0, soc };
}
const seeds = process.argv.slice(2).map(Number);
let bad = 0;
for (const seed of (seeds.length ? seeds : [1, 2, 3, 4])) {
  for (const mode of ['passive', 'active', 'cruel']) {
    const { S, stageAt, mono, soc } = run(seed, mode, 40);
    if (mode !== 'cruel' && !stageAt[6]) bad++;
    if (mode === 'passive' && S.stats.deaths - (S.stats.oldAge || 0) > 2) bad++;
    // left alone, the island should not sit at 90%+ one belief for most of the run
    if (mode === 'passive' && mono > 0.5) { console.log('  ^ monoculture'); bad++; }
    // left alone, the island should still grow a society: couples, a faith leader, a business
    if (mode === 'passive' && !(soc.couples && soc.leaders && soc.shops)) { console.log('  ^ no society'); bad++; }
  }
}

// endless: no goal, left alone for 75 minutes. Generations must turn over without the island dying out.
for (const seed of (seeds.length ? seeds.slice(0, 2) : [1, 2])) {
  const S = A.newSim(seed, false);
  let minPop = 99, restores = 0, nan = 0;
  for (let i = 0; i < 75 * 60 / A.SIM_DT; i++) {
    A.simStep(S, A.SIM_DT);
    for (const e of S.events) if (e.type === 'restore') restores++;
    S.events.length = 0;
    if (i % 200 === 0) { minPop = Math.min(minPop, S.citizens.length); for (const c of S.citizens) if (!isFinite(c.x) || !isFinite(c.age)) nan++; }
  }
  const gen = Math.max.apply(null, S.citizens.map(c => c.gen)), old = S.stats.oldAge || 0;
  const ok = restores === 0 && gen >= 3 && old >= 4 && !A.firstB(S, 'spire') && nan === 0 && S.citizens.length >= 8;
  console.log(`seed ${seed} endless 75min pop ${S.citizens.length} (min ${minPop}) generation ${gen} old-age deaths ${old} other deaths ${S.stats.deaths - old} births ${S.stats.births} ` +
    `restores ${restores} spire ${A.firstB(S, 'spire') ? 'yes' : 'no'} factions ${S.factions.length} memories ${S.citizens[0].mem.length} ${ok ? '' : ' <-- FAIL'}`);
  if (!ok) bad++;
  const S2 = A.deserialize(A.serialize(S));
  if (S2.goal !== false || S2.citizens.length !== S.citizens.length) { console.log('  endless save round trip FAIL'); bad++; }
}
console.log(bad ? 'FAIL ' + bad : 'OK');
process.exit(bad ? 1 : 0);
