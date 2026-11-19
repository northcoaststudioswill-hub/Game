/* Headless balance run of the simulation core (no browser).
   node godmode/tests/sim_balance.js [seeds]                                  */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['core.js', 'world.js', 'sim.js'].map(f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
const ctx = { console, Math, JSON };
vm.createContext(ctx);
vm.runInContext(src + '\nthis.API={newSim,simStep,serialize,deserialize,powerObserve,powerBless,powerSmite,powerCreate,powerInspire,powerGrab,powerDrag,powerDrop,popCap,countB,firstB,STAGES,BELIEFS,SIM_DT};', ctx);
const A = ctx.API;
const fmt = t => ((t / 60) | 0) + ':' + String((t % 60) | 0).padStart(2, '0');

function run(seed, mode, maxMin) {
  const S = A.newSim(seed);
  const stageAt = {}; let minPop = 99, maxPop = 0, last = 0;
  const steps = maxMin * 60 / A.SIM_DT;
  let fail = 0;
  for (let i = 0; i < steps; i++) {
    A.simStep(S, A.SIM_DT);
    for (const e of S.events) if (e.type === 'stage') stageAt[e.stage] = S.t;
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
    `res f${S.res.food | 0} w${S.res.wood | 0} s${S.res.stone | 0} i${S.res.insight | 0} counts ${S.counts.join('/')} age ${S.age} ` +
    `bld ${S.buildings.map(b => b.type[0] + (b.built ? '' : '*')).join('')} nan ${fail} reload ${S2.citizens.length}`);
  return { S, stageAt };
}
const seeds = process.argv.slice(2).map(Number);
let bad = 0;
for (const seed of (seeds.length ? seeds : [1, 2, 3, 4])) {
  for (const mode of ['passive', 'active', 'cruel']) {
    const { S, stageAt } = run(seed, mode, 40);
    if (mode !== 'cruel' && !stageAt[6]) bad++;
    if (mode === 'passive' && S.stats.deaths > 2) bad++;
  }
}
console.log(bad ? 'FAIL ' + bad : 'OK');
process.exit(bad ? 1 : 0);
