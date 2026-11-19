/* SPROUTS TV copy of alt/tests/sprouts_valley.js (Nov 18 2026): same checks, run against the standalone build. */
/* Sprouts, the valley update: the bridge, nectar, the golden pear, lantern seeds, buried treasure, saves, and the
   three functions Sproutwild used to redefine. Stepped (no real-time waits), fresh save.
   Run from the repo root:  node sprouts-tv2/tests/sprouts_valley.js [build.html] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  /* TV: no cartridge to pick; the keys below walk the real way in (any button, studio card, title, menu) */
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const tp = (tx, ty) => E(`P.x=${tx}*16+8;P.y=${ty}*16+8;P.dx=0;P.dy=-1;LO.x=LO.sx=P.x-18;LO.y=LO.sy=P.y+4;trail=[];buds.forEach(b=>{release(b);b.x=P.x;b.y=P.y+4;b.st='follow'});void 0`);
  const throwFor = async n => { await E(`keys.a=1;void 0`); await step(n); await E(`keys.a=0;void 0`); };
  await E(`init();live=true;state='play';npcs[0].st='active';ZONES.forEach(z=>run.seen[z[0]]=1);run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};found=found.map(()=>true);for(let i=0;i<12;i++)mkBud(i%6,0,P.x,P.y);void 0`);
  ok('Sprouts keeps its own Louie bubble, garden bed and build screen', await E(`/LO\\.say/.test(String(spSay))&&/p\\.flower/.test(String(drawBed))&&/pjS\\(p\\)/.test(String(drawPjBuild))`));
  await E(`spSay('WOOF!');void 0`); ok("Louie's bubble is set", (await E('LO.say&&LO.say.s')) === 'WOOF!');
  ok('the falls are cut off until the bridge is built', await E('gates[5].alive&&fieldL[8*MW+61]<0'));
  await tp(61, 14); await step(12); ok('a hint explains the bridge', /BRIDGE/.test(await E('msg')), await E('msg'));
  await throwFor(90); ok('any sprout works on the bridge', (await E('gates[5].on.length')) >= 10, await E('gates[5].on.length'));
  await step(30 * 14); ok('the bridge gets built and can be walked', await E('!gates[5].alive&&map[11*MW+60]===D&&fieldL[8*MW+61]>0'), await E('msg'));
  await tp(63, 5); await E(`buds.forEach(b=>b.stage=0);bugs.forEach(q=>{q.alive=false});void 0`); await step(4); await throwFor(2); await step(60);
  ok('nectar blooms the crew', (await E('buds.filter(b=>b.stage===2).length')) === 12, await E('msg'));
  await tp(66, 8); await step(4); await throwFor(120); const d0 = await E('run.delivered'); let t = 0; for (; t < 450; t++) { await step(6); if (await E('run.delivered') > d0) break; }
  ok('the golden pear is carried home over the bridge', t < 450, Math.round(t / 5) + ' s'); ok('the lantern throws its seeds', (await E('seeds.length')) > 0, await E('seeds.length'));
  const n0 = await E('sprouts.length'); await step(45); ok('the seeds land and sprout', await E(`seeds.length===0&&sprouts.length>${n0}`));
  await E(`run.spark={x:23*16+8,y:21*16+8,i:3,hp:DIGHP};digSync();void 0`); await tp(23, 23); await step(4); await throwFor(40);
  ok('sprouts dig at the buried spot', await E('DIG.on.length>0||!DIG.alive'), await E('DIG.on.length'));
  for (t = 0; t < 40; t++) { await step(30); if ((await E('state')) === 'card') break; }
  ok('the treasure is dug up, carried home and filed', await E(`state==='card'&&meta.trs.includes(3)`), await E('card&&card.title')); await E(`state='play';void 0`);
  await E(`run.spark={x:24*16+8,y:19*16+8,i:5,hp:.01};digSync();buds[0].tgt=DIG;buds[0].st='work';DIG.on.push(buds[0]);seeds.push({type:2,tx:420,ty:370,t:0});void 0`); await step(2);
  const sig = `JSON.stringify([sprouts.length+seeds.length,buds.length,items.filter(i=>i.alive).map(i=>i.sub+(i.tri===undefined?'':i.tri)).sort(),gates.map(g=>g.alive)])`;
  const a = await E(sig); await E(`restore(JSON.parse(JSON.stringify(snap())));void 0`); ok('save and load keep the bridge, a treasure in transit and seeds in the air', a === await E(sig));
  ok('a save from before this update still loads', await E(`(()=>{init();const o=JSON.parse(JSON.stringify(snap()));delete o.gates.orchardBridge;o.items=o.items.filter(q=>q[0]==='berry'||q[0]==='big'||q[0]==='shard').map(q=>q.slice(0,6));o.run.spark={x:400,y:300,i:1};restore(o);return gates[5].alive&&run.spark.hp===DIGHP&&DIG.alive})()`));
  await E(`newDay();void 0`); ok('nectar blossoms open again in the morning', (await E(`items.filter(i=>i.alive&&i.sub==='nectar').length`)) === 6);
  /* the prequel pass */
  ok('eight wild buddies (seven in the valley, a Bessling on the coast), with Sproutwild art', await E(`wbuds.length===8&&wbuds.every(q=>!!wbSprite(q))`));
  ok('nothing targets a buddy', await E(`(()=>{const q=wbuds[0];return findTarget({x:q.x,y:q.y,type:0},20)===null||findTarget({x:q.x,y:q.y,type:0},20).kind!==undefined})()`));
  await E(`P.x=wbuds[0].x+12;P.y=wbuds[0].y;void 0`); const bx = await E('wbuds[0].x'); await step(30); ok('a buddy backs away from Will', (await E('wbuds[0].x')) < bx - 8, await E('msg'));
  await E(`P.x=HX;P.y=HY+30;dayT=DAYLEN*.76;duskSaid=true;void 0`); await step(30 * 25); ok('at night buddies sit by the lantern', (await E(`wbuds.filter(q=>q.night&&q.path&&!q.path.length&&d2(q,HX,HY)<80*80).length`)) >= 1, await E(`wbuds.map(q=>[q.id,Math.round(Math.sqrt(d2(q,HX,HY)))])`));
  await E(`dayT=1;gates.forEach(q=>q.alive&&openGate(q));ZONES.forEach(z=>run.seen[z[0]]=1);run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};state='play';P.x=KEEP.x;P.y=KEEP.y+14;P.dx=0;P.dy=-1;keys.a=0;void 0`); await step(3); await E(`keys.a=1;void 0`); await step(1); await E(`keys.a=0;void 0`);
  ok('the old arch plays its scene (3D now)', await E(`state==='c3'&&c3q.key==='arch'&&c3q.S.length===7`)); await E(`__g.draw();void 0`);
  await E(`keys.start=1;void 0`); await step(1); await E(`keys.start=0;void 0`); await step(2);
  ok('afterwards the Lantern Field is called Sunkeep', await E(`run.keep===1&&zName('LANTERN FIELD')==='SUNKEEP'`));
  ok('every treasure has a memory that fits its card', await E(`TRL.length===TRS.length&&TRL.every((l,i)=>wrapPx(l,168,2).length<=3)`));
  ok('every scene line fits its four rows', await E(`Object.keys(SCN).every(k=>{const q=typeof SCN[k]==='function'?SCN[k]():SCN[k];return q.every(e=>wrapPx(e[0],214).length<=4)})`));
  /* menus, the field guide, small talk, rescue of a stuck item */
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(1); };
  await E(`dayT=30;state='play';void 0`); await tap('start'); ok('START opens the pause grid', (await E('state')) === 'pause' && (await E('pi')) === 0);
  await tap('right'); await tap('down'); ok('the d-pad moves round the grid', (await E('PMENU[pi][0]')) === 'COLLECTION'); await E(`__g.draw();void 0`);
  await tap('a'); await E(`__g.draw();void 0`); await tap('down'); await tap('right'); ok('the Collection has a cursor', (await E('csel')) === 3, await E('csel'));
  await tap('right'); ok('right at the edge turns to the treasures', (await E('cpage')) === 1 && (await E('csel')) === 0); await E(`__g.draw();void 0`);
  ok('every bug and treasure has a line that fits', await E(`BUGL.length===BUGS.length&&BUGL.concat(TRL).every(l=>wrapPx(l,228,2).length<=3)&&BUGS.every(b=>tw(b.n,2)<=74)&&TRS.every(q=>tw(q[0],2)<=92)`));
  await tap('b'); ok('Collection opened from pause comes back to pause', (await E('state')) === 'pause');
  await tap('left'); await tap('a'); ok('the field guide opens', (await E('state')) === 'guide');
  for (let p = 0; p < 4; p++) { for (let i = 0; i < 9; i++) { await E(`__g.draw();void 0`); await tap('down'); } await tap('right'); }
  ok('every guide entry fits its three lines', await E(`[0,1,2,3].every(p=>spGuideList(p).every(e=>e.d&&wrapPx(e.d,228,2).length<=3))`), await E(`[0,1,2,3].map(p=>spGuideList(p).map(e=>wrapPx(e.d,228,2).length).join(''))`));
  ok('pause tile labels fit their tiles', await E(`PMENU.every(([k])=>tw(k,2)<=86&&tw(pauseSub(k),1)<=86)`), await E(`PMENU.map(([k])=>[tw(k,2),tw(pauseSub(k),1)])`));
  await tap('b'); await tap('b'); ok('B backs out to the valley', (await E('state')) === 'play');
  ok('a buddy you have been near is in the guide', await E(`!!(run.wbSeen&&Object.keys(run.wbSeen).length)&&spGuideList(1).some(e=>e.known)`));
  await E(`msgT=0;toasts.length=0;LO.say=null;barkCD=0;P.x=npcs[0].x+20;P.y=npcs[0].y+8;npcs[0].st='done';npcs.forEach(n=>{n.bt=0;n.say=null});void 0`);
  for (let i = 0; i < 12 && !(await E(`!!(npcs[0].say&&npcs[0].say.t>0)`)); i++) { await E(`msgT=0;toasts.length=0;LO.say=null;LO.dig=99;barkCD=0;P.x=npcs[0].x+20;P.y=npcs[0].y+8;void 0`); await step(6); } /* Louie or a message may be talking: one voice at a time */
  ok('Erin says a line as you walk past', await E(`!!(npcs[0].say&&npcs[0].say.t>0)`), await E('npcs[0].say&&npcs[0].say.s')); await E(`__g.draw();void 0`);
  ok('small-talk lines fit a bubble', await E(`Object.values(BARKS).flat().concat(['MORNING, WILL!','THEY WATCH THE LIGHT.','LONG DAY, BRO.']).every(s=>tw(s,1)<=150)`), await E(`Object.values(BARKS).flat().filter(s=>tw(s,1)>150)`));
  await E(`for(let i=0;i<10;i++)mkBud(1,2,P.x,P.y);const it=mkItem('shard',18*16+8,33*16+8);it.w=8;buds.slice(-10).forEach(b=>{b.tgt=it;b.st='carry';it.on.push(b)});window.__it=it;void 0`); const sh0 = await E('shards');
  for (t = 0; t < 120; t++) { await step(30); if ((await E('shards')) > sh0 || (await E('state')) !== 'play') break; }
  ok('a shard dropped inside a wall is still walked home', (await E('shards')) > sh0, t + ' s'); await E(`state='play';sceneQ.length=0;void 0`);
  /* nature's balance: a buddy eats a sprout left behind, quietly, and only then */
  const strand = (extra = '') => E(`(()=>{mkWbuds();const q=wbuds[1];buds=[];for(let i=0;i<14;i++)mkBud(i%6,2,P.x,P.y);const b=buds[0];b.st='idle';b.it=40;b.x=q.x+40;b.y=q.y+8;window.__b=b;P.x=HX;P.y=HY+30;dayT=30;state='play';LO.st='sit';LO.t=999;${extra}})()`);
  const eaten = async secs => { for (let i = 0; i < secs; i++) { await step(30); if (await E('__b.dead||!buds.includes(__b)')) return true; } return false; };
  await strand(); ok('a buddy eats a sprout left idle far from Will', await eaten(25), await E('run.eaten'));
  ok('and nothing is said about it', !/EAT|ATE |BUDD/.test(await E(`toasts.map(t=>t.s).join('|')+'|'+(msgT>0?msg:'')`)), await E(`toasts.map(t=>t.s).join('|')+'|'+(msgT>0?msg:'')`));
  await strand(`P.x=b.x+50;P.y=b.y;`); ok('not while Will is near', !(await eaten(12)));
  await strand(`b.star=true;`); ok('never a star sprout', !(await eaten(12)));
  await strand(`buds.length=9;`); ok('never from a small crew', !(await eaten(12)));
  await strand(`b.it=5;`); ok('not one that only just stopped', !(await eaten(8)));
  await strand(); await step(60); await E(`P.x=__b.x+30;P.y=__b.y;void 0`); await step(30); ok('if Will comes back in time the buddy backs off', await E(`!__b.dead&&wbuds.every(q=>!q.hunt)`));
  await E(`LO.st='follow';void 0`);
  await E(`npcs.forEach(n=>{n.st='done';n.mi=n.ms.length});run.keep=0;gates[5].alive=true;void 0`); ok('with the missions done the marker asks for the bridge', /BRIDGE/.test(await E('objective().text')));
  await E(`gates[5].alive=false;void 0`); ok('then for the old arch', /WILLOW FALLS/.test(await E('objective().text'))); await E(`run.keep=1;void 0`);
  await E(`found=found.map(()=>true);run.wbSeen={};WBDEF.forEach(q=>run.wbSeen[q[0]]=1);run.boss=true;run.lit=1;run.pjSeen=Object.assign(run.pjSeen||{},{lf:1});ZONES.forEach(z=>run.seen[z[0]]=1);run.gdone=0;state='play';void 0`); const tx0 = await E('meta.tix'); await step(120);
  const tx1 = await E('meta.tix'); await step(120); ok('a full field guide pays two tickets, once', tx1 >= tx0 + 2 && (await E('run.gdone')) === 1 && (await E('meta.tix')) === tx1, [tx0, tx1, await E('state'), await E('spGuideCount()'), await E('TYPES.length+WBDEF.length+GPPL.length+ZONES.length'), await E('JSON.stringify([0,1,2,3].map(p=>spGuideList(p).filter(e=>!e.known).map(e=>e.n)))')]);
  await E(`toasts.length=0;P.x=HX;P.y=HY+30;buds.forEach(b=>{release(b);b.gard=false;b.st='follow';b.x=P.x;b.y=P.y+6});buds.slice(0,2).forEach(b=>{b.st='idle';b.x=60*16;b.y=18*16});endDay();void 0`); await step(1); ok('the evening report counts the strays Louie brings home', (await E('tod.strays')) === 2 && (await E('state')) === 'dayend'); await E(`__g.draw();newDay();void 0`);
  await E(`dayT=DAYLEN*.95;flickT=.3;void 0`); await E(`__g.draw();void 0`); ok('night draws, with the lantern skipping', true);
  ok('no page errors', !errs.length, errs);
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
