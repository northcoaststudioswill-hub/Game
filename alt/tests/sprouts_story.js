/* Sprouts story run: the whole arc by script, stepped. Carries home all four sun shards (field, meadow, island by Dews
   only, and Thornback's), plays the scenes, reaches the ending, then uses the house desk, sends sprouts to a valley
   project and sleeps to the next morning.
   Run from the repo root:  node alt/tests/sprouts_story.js [build.html] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(200); }
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const step = n => E(`(()=>{for(let i=0;i<${n};i++){__g.update(1/30);if(i%10===0)__g.draw();for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const tp = (tx, ty, dx, dy) => E(`dayT=Math.min(dayT,20);P.x=${tx}*16+8;P.y=${ty}*16+8;P.dx=${dx};P.dy=${dy};LO.x=LO.sx=P.x-18;LO.y=LO.sy=P.y+4;trail=[];buds.forEach(b=>{release(b);b.gard=false;b.x=P.x;b.y=P.y+4;b.st='follow'});void 0`);
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(3); };
  const throwFor = async n => { await E(`keys.a=1;void 0`); await step(n); await E(`keys.a=0;void 0`); };
  const scenes = []; const skip = async () => { await step(4); /* a queued scene starts on the next frame */ for (let i = 0; i < 90 && (await E('state')) !== 'play'; i++) { if ((await E('state')) === 'cine' && !scenes.includes(await E('scn[0][0]'))) scenes.push(await E('scn[0][0]')); await tap('a'); } };
  const until = async (cond, secs) => { let t = 0; for (; t < secs; t++) { await step(30); if ((await E('state')) !== 'play' || await E(cond)) break; } return t; };
  await E(`init();live=true;state='play';ZONES.forEach(z=>run.seen[z[0]]=1);run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};run.tips={br:1,ne:1,dg:1,wb:1,wn:1,fl:1};run.egg={sesh:1,job:1,dream:1,zoomies:1,button:1}; /* the hidden scenes would cut into this scripted run (the bot pets Louie by accident) */found=found.map(()=>true);gates.forEach(q=>q.alive&&openGate(q));openGarden();wakeGrubs();
    for(let i=0;i<30;i++)mkBud(i%6,2,P.x,P.y);for(let i=0;i<8;i++)mkBud(2,2,P.x,P.y);void 0`);
  for (const [name, tx, ty] of [['berry field', 51, 21], ['north meadow', 34, 6]]) { await tp(tx, ty, 0, -1); await throwFor(150); const s0 = await E('shards'); const t = await until(`shards>${s0}`, 200);
    ok('the ' + name + ' shard is carried home', (await E('shards')) === s0 + 1, t + ' s'); await skip(); }
  await tp(16, 19, -1, 0); await step(3); ok('aiming at water picks Dews by itself', (await E('TYPES[sel].n')) === 'DEW');
  await throwFor(200); ok('only Dews go in the water', await E(`buds.every(b=>b.type===2||tileAt(b.x,b.y)!==WA||b.st==='fly')`));
  let t = await until('run.isle', 150); ok('the island shard is swum home', await E('!!run.isle&&shards===3'), t + ' s'); await skip();
  await tp(28, 33, 0, 1); await throwFor(240); t = await until('run.boss', 120); ok('a crowd wakes Old Thornback', await E('!!run.boss'), t + ' s ' + await E(`JSON.stringify({st:state,b:[...new Set(buds.map(b=>b.st+(b.tgt?':'+(b.tgt.kind+(b.tgt.sub||'')):'')))],n:buds.length,boss:foes.filter(e=>e.boss).map(e=>[e.x|0,e.y|0,e.hp|0,e.on.length,e.st]),P:[P.x|0,P.y|0,P.stun],soil:sprouts.length,dayT:dayT|0,msg})`));
  ok('his scene (3D now) has the guardian lines', await E(`state==='c3'&&c3q.key==='thorn'&&c3q.S.some(e=>/set to guard that light/.test(e.cap[1]))`)); await skip();
  await E(`dayT=20;void 0`); t = await until('shards>=4', 200); ok('the last shard comes home and the ending plays', await E(`shards===4&&state==='c3'&&c3q.key==='blaze'&&/last shard slides home/.test(c3q.S[0].cap[1])`), t + ' s ' + await E(`JSON.stringify({st:state,shards,sh:items.filter(i=>i.alive&&i.sub==='shard').map(i=>[i.x|0,i.y|0,i.w,str(i),i.on.map(b=>b.type).join(''),tileAt(i.x,i.y),fieldL[(i.y>>4)*MW+(i.x>>4)]]),b:[...new Set(buds.map(b=>b.st+(b.tgt?':'+(b.tgt.kind+(b.tgt.sub||'')):'')))],dayT:dayT|0})`));
  await E(`keys.start=1;void 0`); await step(1); await E(`keys.start=0;void 0`); await step(2); /* START skips the 3D shot; Erin's scene follows */
  ok('the ending says nobody remembers who lit it', await E(`state==='cine'&&scn.some(e=>/Nobody remembers who lit it first/.test(e[0]))`)); await skip();
  for (let i = 0; i < 10 && (await E('state')) !== 'play'; i++) await tap('a');
  ok('the lantern is relit and play goes on', await E(`won&&state==='play'&&meta.ach[5]===1`), scenes.length + ' scenes seen');
  await tp(33, 19, 0, -1); await E(`buds.slice(0,3).forEach(b=>{b.star=true});enterHome();void 0`); await step(5);
  await E(`state='house';hi=1;void 0`); await tap('a'); ok('five sprouts move into the house', (await E('homeTotal()')) === 5, await E('flash'));
  await E(`hi=0;void 0`); await tap('a'); ok('star sprouts move in for more petals', (await E('homeTotal()')) === 8, await E('flash'));
  await E(`state='play';exitHome();void 0`); await step(3); ok('the crew is waiting outside', await E(`buds.length>0&&buds.every(b=>b.st==='follow')`));
  await E(`npcs[3].st='done';bp=PJ[0];state='build';void 0`); await tap('a'); ok('Pebs move out to build the Waterworks', (await E('pjS(PJ[0]).got[1]')) > 0, await E('flash'));
  await E(`state='play';endDay();void 0`); await step(2); ok('the evening report shows', (await E('state')) === 'dayend'); await tap('a'); await step(5);
  ok('morning comes: day 2, home pays out, the buddies are back', await E(`day===2&&state==='play'&&wbuds.length===8&&toasts.some(t=>/^HOME:/.test(t.s))`));
  ok('no page errors', !errs.length, errs);
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
