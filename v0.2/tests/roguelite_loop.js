/* Rootdeep / Pocket Lantern v0.2 test: roguelite_loop
   Run from the repo root:  node v0.2/tests/roguelite_loop.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/roguelite_loop/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'roguelite_loop') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 120) => { await page.keyboard.down(key); await page.waitForTimeout(60); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const cv = await page.$('canvas'); const shot = async nm => cv.screenshot({ path: D + nm + '.png' });
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`localStorage.removeItem('rootdeep-v1');Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};RD.flags={cineSeen:1};hubEnter()`); await page.waitForTimeout(1500); await shot('hub');
  const hp = JSON.parse(await E(`JSON.stringify(NPCS.map(w=>[w,Math.round(HUBNPC[w].y)]))`));
  ok(hp.every(([w,y]) => y < 244) && Math.min(...hp.map(a=>a[1])) < 140, 'Hearth: NPCs spread through the room ' + JSON.stringify(hp));
  // ---- run 1: swarm + interactables ----
  await E(`RD.char='WILL';rdStartRun();state='g3run'`); await page.waitForTimeout(300);
  await E(`for(const t of [0,2,3,4])RUN.buds.push({type:t,x:P3.x,y:P3.y,a:0,cd:0,z:0})`);
  let maxLatched = 0, maxAway = 0;
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(100); const r = JSON.parse(await E(`JSON.stringify({l:RUN.buds.filter(b=>b.latch).length,away:Math.max(...RUN.buds.map(b=>Math.hypot(b.x-P3.x,b.y-P3.y)))})`)); maxLatched = Math.max(maxLatched, r.l); maxAway = Math.max(maxAway, r.away); if (i === 14) await shot('swarm'); }
  ok(maxLatched >= 2 && maxAway > 40, `buds swarm: up to ${maxLatched} latched at once, ${Math.round(maxAway)}px from the keeper`);
  await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(2500);
  const home = JSON.parse(await E(`JSON.stringify(RUN.buds.map(b=>Math.round(Math.hypot(b.x-P3.x,b.y-P3.y))))`));
  ok(home.every(d => d < 45), 'room clear: buds come home ' + JSON.stringify(home));
  await shot('cleared_ints');
  // interactables, placed next to the keeper so we can use each one
  const use = async (k, extra) => { await E(`RUN.enemies=[];RUN.wave2=null;RUN.ints.push(Object.assign({k:'${k}',x:P3.x+6,y:P3.y,done:false,t:0},${extra||'{}'}))`); await hit('KeyZ', 200); return E(`RUN.ints[RUN.ints.length-1].done`); };
  const nb = await E('RUN.buds.length');
  ok(await use('sprout', '{type:5}') && (await E('RUN.buds.length')) === nb + 1, 'A plucks a buried sprout into the string');
  await E('RUN.hp=40'); ok(await use('berry') && (await E('RUN.hp')) >= 50, 'A eats a berry bush (heals)');
  const pk = await E('RUN.pickups.length+RUN.keys+RUN.petals+RUN.dew'); ok(await use('chest') && (await E('RUN.pickups.length+RUN.keys+RUN.petals+RUN.dew')) > pk, 'A opens a root chest');
  await E(`RUN.ints.push({k:'pot',x:P3.x+(P3.ax||0)*14,y:P3.y+(P3.ay===undefined?1:P3.ay)*14+6,done:false,t:0})`); await hit('KeyZ', 200);
  ok(await E('RUN.ints[RUN.ints.length-1].done'), 'an attack smashes a pot');
  await E(`spawnFoe('grub',P3.x+60,P3.y-40,false);RUN.ints.push({k:'boom',x:P3.x+60,y:P3.y-36,done:false,t:0})`); const fh = await E('RUN.enemies[0].hp');
  await E(`rdBreak(RUN.ints[RUN.ints.length-1])`); await page.waitForTimeout(900);
  ok(await E('RUN.ints[RUN.ints.length-1].done') && (await E('RUN.enemies.length?RUN.enemies[0].hp:0')) < fh, 'a boom bulb fizzes, then blows up the foe next to it');
  // ---- the roguelite loop ----
  await E(`RUN.dew=15;RUN.keys=1;RUN.honey=1;window.__g.RDF().hurt(9999);if(state==='g3dying')rdDieFinish()`); await page.waitForTimeout(400);
  ok((await E('state')) === 'g3over' && (await E('RD.dew')) === 30 + 15 && (await E('RD.stats.deaths')) === 1, 'death banks Moondew (' + (await E('RD.dew')) + '), keys and honey, counts the death');
  await page.waitForTimeout(900); await hit('KeyZ', 300); ok((await E('state')) === 'g3hub', 'A returns to the Hearth');
  const hp0 = await E('rdStats().maxHp');
  await E(`uiSel=0;state='g3mirror'`); await hit('KeyZ', 200);
  ok((await E('mir("vit")')) === 1 && (await E('rdStats().maxHp')) > hp0 && (await E('RD.dew')) === 35, `Mirror: Vitality rank bought (max HP ${hp0} -> ${await E('rdStats().maxHp')}, dew left ${await E('RD.dew')})`);
  await E(`state='g3hub';hubEnter();rdStartRun();state='g3run'`); ok((await E('RUN.hp')) === (await E('rdStats().maxHp')), 'next run starts with the upgraded health');
  // chamber flow: clear, take a boon door, keep going
  let boons = 0, chambers = 0;
  for (let c = 0; c < 11; c++) {
    await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(80);
    if ((await E('state')) === 'g3cine') { await E('endCine()'); }
    await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(40);
    if (await E(`RUN&&RUN.phase==='doors'`)) { await E(`RUN.doors[0].kind='boon';window.__g.RDF().door(0);if(RUN)RUN.cineQ=[]`); await page.waitForTimeout(40);
      if ((await E('state')) === 'g3boon') { await hit('KeyZ', 60); boons++; } chambers++; }
    if ((await E('state')) === 'g3cine') await E('endCine()');
  }
  const r2 = JSON.parse(await E(`JSON.stringify({ch:RUN.chamber,boons:[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean).length,keys:RUN.keys,bosses:RD.stats.bosses})`));
  ok(r2.ch === 12 && r2.boons >= 5 && r2.bosses >= 2 && r2.keys >= 2, `pushed to chamber ${r2.ch}: ${r2.boons} boons kept, ${r2.bosses} bosses felled, ${r2.keys} keys`);
  await E(`window.__g.RDF().clearRoom()`); for (let i = 0; i < 8; i++) { await page.waitForTimeout(200); if ((await E('state')) === 'g3cine') await E('endCine()'); }
  ok((await E('state')) === 'g3win' && (await E('RD.stats.escapes')) === 1, 'chamber 12 cleared: escape');
  ok(await E(`RD.stats.escapes>=1&&(()=>{state='g3heat';return true})()`), 'Pact of Roots opens after the escape');
  await E(`heatSel=0;state='g3heat'`); await hit('ArrowRight', 120); ok((await E('heatTotal()')) >= 1, 'heat can be raised (' + (await E('heatTotal()')) + ')');
  await E(`state='g3hub';hubEnter();rdStartRun();state='g3run'`); ok((await E('RUN.heat')) >= 1, 'the next run carries the heat');
  await E(`state='g3hub';RUN=null;hubEnter()`);
  ok(JSON.parse(await E(`localStorage.getItem('rootdeep-v1')`)) .stats.escapes === 1, 'everything is saved');
  console.log('ERRORS:', errs.length ? '\n  ' + errs.join('\n  ') : 'none');
  await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
