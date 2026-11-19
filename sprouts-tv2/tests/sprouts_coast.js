/* SPROUTS TV copy of alt/tests/sprouts_coast.js (Nov 18 2026): same checks, run against the standalone build. */
/* Sprouts: the 3D cutscenes and the North Coast. Stepped (no real-time waits), fresh save.
   Checks every shot of every 3D scene draws, the captions fit, and the whole new arc plays: the opening in 3D, the
   night the Lantern calls, the sun door, the coast, the pier, the lens carried home, the relight, saves, and the ending.
   Run from the repo root:  node sprouts-tv2/tests/sprouts_coast.js [build.html] [folder for screenshots] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  /* TV: no cartridge to pick; the keys below walk the real way in (any button, studio card, title, menu) */
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(2); };
  const tp = (tx, ty, dx = 0, dy = -1) => E(`P.x=${tx}*16+8;P.y=${ty}*16+8;P.dx=${dx};P.dy=${dy};LO.x=LO.sx=P.x-18;LO.y=LO.sy=P.y+4;trail=[];buds.forEach(b=>{release(b);b.gard=false;b.x=P.x;b.y=P.y+4;b.st='follow'});void 0`);
  const throwFor = async n => { await E(`keys.a=1;void 0`); await step(n); await E(`keys.a=0;void 0`); };
  const shot = async n => { if (!SHOTS) return; await E('g.setTransform(2,0,0,2,0,0);draw();void 0'); await page.locator('#screen').screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const skip3 = async () => { await step(3); if ((await E('state')) === 'c3') await tap('start'); await step(2); };

  /* ---- the scenes themselves ---- */
  const keys = JSON.parse(await E('JSON.stringify(Object.keys(C3SCN))'));
  ok('nineteen 3D scenes (ten story, nine hidden)', keys.slice().sort().join() === 'arch,bessie,blaze,button,call,coast,dawn,dream,hottub,job,key,marks,moon,relight,sesh,slide,thorn,van,zoomies', keys);
  const long = JSON.parse(await E(`JSON.stringify(Object.entries(C3SCN).flatMap(([k,S])=>S.map((s,i)=>[k,i,wrapPx(s.cap[1],228).length])).filter(q=>q[2]>3))`));
  ok('every caption fits its three lines', long.length === 0, long);
  await E(`init();live=true;void 0`);
  let worst = 0, sum = 0, n = 0, blank = [];
  for (const k of keys) {
    const cnt = await E(`C3SCN.${k}.length`);
    for (let i = 0; i < cnt; i++) for (const f of [0.05, 0.5, 0.97]) {
      const q = JSON.parse(await E(`(()=>{c3Play('${k}');c3q.i=${i};c3q.t=C3SCN.${k}[${i}].d*${f};c3q.tt=${i}*7+c3q.t;const a=performance.now();g.setTransform(2,0,0,2,0,0);draw();const ms=performance.now()-a;
        const s=new Set();for(let j=0;j<c3px.length;j+=97)s.add(c3px[j]);c3q=null;state='play';return JSON.stringify([ms,s.size,c3stat.tris])})()`));
      if (n > 0) { worst = Math.max(worst, q[0]); sum += q[0]; } n++; if (q[1] < 12 || q[2] < 200) blank.push([k, i, f, q[1], q[2]]);
      if (SHOTS && f === 0.5) { await E(`c3Play('${k}');c3q.i=${i};c3q.t=C3SCN.${k}[${i}].d*.6;c3q.tt=${i}*7+c3q.t;void 0`); await shot('3d-' + k + '-' + (i + 1)); await E(`c3q=null;state='play';void 0`); }
    }
  }
  ok('every shot of every scene draws a full picture', blank.length === 0, blank);
  console.log('     ' + n + ' frames, average ' + (sum / (n - 1)).toFixed(1) + ' ms, slowest ' + worst.toFixed(1) + ' ms (headless Chromium)');
  ok('a frame takes under 40 ms here', worst < 40, worst.toFixed(1));

  /* ---- a new game opens in 3D, then hands over to Erin ---- */
  await E(`state='menu';live=false;mi=0;time=20;cloudDone=true;void 0`); await tap('a');
  ok('a new game starts on the 3D opening', await E(`state==='c3'&&c3q.key==='dawn'`), await E('state'));
  let taps = 0; for (; taps < 20 && (await E('state')) === 'c3'; taps++) await tap('a');
  ok('A walks through the three shots (two presses each at most)', taps >= 3 && taps <= 6, taps);
  ok("then Erin's scene, which now starts on her hello", await E(`state==='cine'&&/^Hi, Will/.test(scn[0][0])`), await E('state'));
  for (let i = 0; i < 40 && (await E('state')) !== 'play'; i++) await tap('a');
  await E(`c3Play('dawn');void 0`); await step(30 * 30);
  ok('left alone, a scene plays itself to the end', (await E('state')) !== 'c3', await E('state'));
  await E(`c3Play('dawn');void 0`); await tap('start'); ok('START skips a scene', (await E('state')) === 'play');

  /* ---- scene timing ---- */
  const twice = JSON.parse(await E(`(()=>{let bad=[];for(const k of Object.keys(C3SCN))for(let i=0;i<C3SCN[k].length;i++){const go=()=>{c3Play(k);c3q.i=i;c3q.t=C3SCN[k][i].d*.5;c3q.tt=i*7+c3q.t;time=50;g.setTransform(2,0,0,2,0,0);draw();const a=c3px.slice();c3q=null;state='play';return a};const A=go(),B=go();for(let q=0;q<A.length;q++)if(A[q]!==B[q]){bad.push(k+(i+1));break}}return JSON.stringify(bad)})()`));
  ok('every shot draws the same picture twice running (nothing depends on the shot before it)', twice.length === 0, twice);
  await E(`window.__snd=[];const s0=snd,n0=noise;snd=(...a)=>{__snd.push(['s',c3q?c3q.i:-1,c3q?+c3q.t.toFixed(2):-1]);};noise=(...a)=>{__snd.push(['n',c3q?c3q.i:-1,c3q?+c3q.t.toFixed(2):-1]);};window.__unsnd=()=>{snd=s0;noise=n0};c3Play('dawn');c3q.i=1;c3q.t=0;c3q.cue={};void 0`);
  await E(`g.setTransform(2,0,0,2,0,0);draw();void 0`); await step(20); await E(`draw();void 0`);
  ok('a sound due later in a shot has not played yet', await E(`!__snd.some(q=>q[2]>.2)&&c3q.sched.length>0`), await E('JSON.stringify(__snd)'));
  await step(30); ok('it plays when the shot reaches it', await E(`__snd.some(q=>q[1]===1&&q[2]>=1.05&&q[2]<1.3)`), await E('JSON.stringify(__snd)'));
  await E(`__snd=[];c3Play('call');c3q.i=5;g.setTransform(2,0,0,2,0,0);draw();void 0`); await step(6); const had = await E('c3q.sched.length'); await tap('a'); await tap('a');
  const moved = await E('c3q.i'); await E(`draw();void 0`); await step(170);
  ok('leaving a shot drops the sounds it had not reached', had > 0 && moved === 6 && await E(`!__snd.some(q=>q[1]===6&&q[2]>1)`), [moved, await E('JSON.stringify(__snd.slice(0,6))')]);
  await E(`__unsnd();c3Play('call');c3q.i=3;c3q.t=0;void 0`); await step(6); await tap('a');
  ok('A before the key moment runs the shot forward instead of cutting it', await E(`c3q.i===3&&c3q.ff===1`), await E('[c3q.i,c3q.ff]'));
  let fr = 0; for (; fr < 200 && await E('c3q&&c3q.i===3'); fr++) await step(1);
  ok('it reaches the door opening, holds a beat, and moves on by itself', await E(`c3q&&c3q.i===4`) && fr > 25 && fr < 80, fr + ' frames');
  await E(`c3q=null;state='play';void 0`);

  /* ---- the pond road, the key, and Erin's errand ---- */
  await E(`init();live=true;state='play';dayT=30;ZONES.forEach(z=>run.seen[z[0]]=1);found=found.map(()=>true);openGate(gates[1]);for(let i=0;i<10;i++)mkBud(1,2,P.x,P.y);void 0`); await step(6);
  ok('with the crystal smashed the pond road is still shut', await E(`coastGate('jobsite').alive&&fieldL[20*MW+17]<0&&!run.key`));
  await tp(20, 20, -1, 0); await step(10); ok('walking up without the key says whose it is', /FLOW PROS/.test(await E('msg')), await E('msg'));
  await throwFor(20); await step(20); ok('sprouts cannot open it', await E(`coastGate('jobsite').alive&&coastGate('jobsite').on.length===0`));
  ok('and none are left stranded on the far side', await E(`!buds.some(b=>b.x<18*16)`), await E(`buds.filter(b=>b.x<18*16).length`));
  await shot('key-1-jobsite');
  await E(`openGarden();npcs[0].st='active';npcs[0].mi=npcs[0].ms.findIndex(m=>m.id==='e6');void 0`); await tp(46, 6, 0, -1); await E(`buds.forEach(b=>{b.st='idle'});for(let i=0;i<5;i++){const b=mkBud(4,2,46*16,6*16);b.gard=true;b.st='tend'}P.dx=0;P.dy=-1;void 0`); await step(4);
  await E(`talk(npcs[0]);void 0`);
  ok("turning in Erin's gardeners cuts to the key scene", await E(`state==='c3'&&c3q.key==='key'`), await E('state'));
  await tap('start'); await step(2);
  ok('then she asks for the key, and it is lying in the garden', await E(`state==='talk'&&npcs[0].ms[npcs[0].mi].id==='e12'&&items.some(i=>i.alive&&i.sub==='key')`), await E('npcs[0].ms[npcs[0].mi].id'));
  for (let i = 0; i < 20 && (await E('state')) === 'talk'; i++) await tap('a');
  await step(12); ok('the marker points at the key', /KEY/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await E(`buds.forEach(b=>{release(b);b.gard=false;b.st='follow'});void 0`); await tp(43, 9, -1, 0); await step(6); await shot('key-2-in-the-garden'); await throwFor(30);
  let ks = 0; for (; ks < 90 && !(await E('run.key')); ks++) await step(30);
  ok('the crew carries the key home', await E(`run.key===1&&state==='card'`), ks + ' s, ' + await E('state'));
  for (let i = 0; i < 8 && (await E('state')) === 'card'; i++) { await step(10); await tap('a'); } await step(12); ok('then the marker says to unlock the pond road', /POND ROAD/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await tp(20, 20, -1, 0); await step(12);
  ok('walking up with the key opens it', await E(`!coastGate('jobsite').alive&&fieldL[20*MW+17]>0`), await E('msg'));
  ok('a save keeps the key and the open road', await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return run.key===1&&!coastGate('jobsite').alive})()`));
  ok('a save from before this update that has met Marcus is not locked out', await E(`(()=>{init();live=true;state='play';openGate(gates[1]);npcs[3].st='active';const o=JSON.parse(JSON.stringify(snap()));delete o.gates.jobsite;restore(o);return run.key===1&&!coastGate('jobsite').alive&&fieldL[20*MW+17]>0})()`));
  ok('a fresh old save keeps the new errand', await E(`(()=>{init();live=true;state='play';const o=JSON.parse(JSON.stringify(snap()));delete o.gates.jobsite;restore(o);return !run.key&&coastGate('jobsite').alive})()`));
  ok('a save made in the middle of the errand still has the key to carry', await E(`(()=>{init();live=true;state='play';openGarden();npcs[0].st='active';npcs[0].mi=npcs[0].ms.findIndex(m=>m.id==='e12');keySpawn();const o=JSON.parse(JSON.stringify(snap()));o.items=o.items.filter(q=>q[0]!=='key');restore(o);return items.filter(i=>i.alive&&i.sub==='key').length===1})()`));

  /* ---- meeting Marcus: the van ---- */
  await E(`init();live=true;state='play';dayT=30;ZONES.forEach(z=>run.seen[z[0]]=1);run.key=1;void 0`); await tp(17, 24, 0, -1); await E(`buds.forEach(b=>b.st='idle');void 0`); await step(4); await tap('a');
  ok('talking to Marcus the first time cuts to the van in 3D', await E(`state==='c3'&&c3q.key==='van'`), await E('state'));
  await tap('start'); await step(2);
  ok('then he gives his first ask, without saying the idea twice', await E(`state==='talk'&&dlg.name==='MARCUS'&&npcs[3].st==='active'&&!/lazy river/i.test(dlg.pages.flat().join(' '))&&/Dew/.test(dlg.pages.flat().join(' '))`), await E('state'));
  for (let i = 0; i < 12 && (await E('state')) === 'talk'; i++) await tap('a');
  await step(4); await tap('a'); ok('the second talk is an ordinary one', (await E('state')) === 'talk', await E('state')); for (let i = 0; i < 12 && (await E('state')) === 'talk'; i++) await tap('a');

  /* ---- before the call ---- */
  await E(`init();live=true;state='play';ZONES.forEach(z=>{if(z[0]!=='NORTH COAST')run.seen[z[0]]=1});run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};run.tips={br:1,ne:1,dg:1,wb:1,wn:1,fl:1};found=found.map(()=>true);
    gates.forEach(q=>q.alive&&q.sub<4&&q.id!=='northPier'&&openGate(q));for(let i=0;i<30;i++)mkBud(i%6,2,P.x,P.y);for(let i=0;i<10;i++)mkBud(1,2,P.x,P.y);day=3;dayT=30;void 0`);
  await step(15);
  ok('nothing grows on the coast while it is shut away', await E(`!items.some(i=>i.alive&&i.x>=70*16)&&!bugs.some(q=>q.alive&&q.x>=70*16)&&!foes.some(e=>e.alive&&e.x>=70*16)`));
  ok('the sun door is shut and the coast cut off', await E(`coastGate('sunDoor').alive&&fieldL[20*MW+72]<0&&!coastObj()`));
  await tp(66, 20, 1, 0); await throwFor(20); await step(30);
  ok('sprouts cannot open the sun door', await E(`coastGate('sunDoor').alive&&coastGate('sunDoor').on.length===0`), await E('msg'));
  ok('and none land beyond it', await E(`!buds.some(b=>b.x>=70*16)`), await E(`buds.filter(b=>b.x>=70*16).length`));
  await shot('coast-1-door-shut');
  await E(`dayT=DAYLEN*.8;void 0`); await step(30);
  ok('nothing happens at night before the Lantern is whole', (await E('state')) === 'play' && !(await E('run.call')));

  /* ---- the night the Lantern calls ---- */
  await E(`won=true;shards=4;dayT=DAYLEN*.8;void 0`); await tp(28, 22); await step(30);
  ok('with the Lantern whole, night brings the 3D scene', await E(`state==='c3'&&c3q.key==='call'`), await E('state'));
  await skip3();
  ok('afterwards the door is open, the way is walkable, the lens is out there', await E(`state==='play'&&run.call===1&&!coastGate('sunDoor').alive&&fieldL[20*MW+72]>0&&items.some(i=>i.alive&&i.sub==='lens')`), await E('msg'));
  ok('the coast has its berries and bugs now, but the berry on the rock waits for the pier', await E(`items.filter(i=>i.alive&&i.x>=70*16&&i.sub!=='lens').length>=8&&bugs.some(q=>q.alive&&q.x>=70*16)&&!items.some(i=>i.alive&&i.sub==='big'&&i.y<10*16&&i.x>=83*16)`), await E(`items.filter(i=>i.alive&&i.x>=70*16).length`));
  await step(12); ok('the marker points east', /BEAM EAST/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await E(`dayT=20;void 0`); await step(30); ok('it does not play twice', (await E('state')) === 'play');

  /* ---- the coast ---- */
  await tp(66, 20, 1, 0); await E(`keys.right=1;void 0`); await step(30 * 5); await E(`keys.right=0;void 0`); await step(20);
  ok('walking through the door reaches the North Coast and plays its scene', await E(`state==='c3'&&c3q.key==='coast'&&run.seen['NORTH COAST']===1`), [await E('state'), await E('P.x>>4')]);
  await skip3(); await step(12);
  ok('the marker asks for the pier', /PIER/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await shot('coast-2-arrive');
  ok('the rock is out of reach until the pier is built', await E(`coastGate('northPier').alive&&fieldL[6*MW+86]<0`));
  await tp(85, 11, 0, -1); await step(12); await shot('coast-3-pier-stakes'); await throwFor(120);
  ok('any sprout builds the pier', (await E(`coastGate('northPier').on.length`)) >= 10, await E(`coastGate('northPier').on.length`));
  await step(30 * 14); ok('the pier gets built, and the berry on the rock appears', await E(`!coastGate('northPier').alive&&fieldL[6*MW+86]>0&&items.some(i=>i.alive&&i.sub==='big'&&i.y<10*16&&i.x>=83*16)`), await E('msg'));
  await tp(86, 7, 0, -1); await step(20); await shot('coast-4-north-light');
  await E(`run.tips.ln=1;msg='';void 0`); await tp(86, 6, 0, -1); await E(`buds.forEach(b=>{b.st='idle'});void 0`); await tap('a');
  ok('the tower can be read', /NORTH LIGHT|TO KEEP|SUN CALL/.test(await E('msg')), await E('msg'));

  /* ---- the lens goes all the way home ---- */
  await E(`dayT=5;buds.forEach(b=>{release(b);b.st='follow'});void 0`); await tp(85, 6, 1, 0); await step(12);
  ok('the marker points at the lens', /LENS/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await throwFor(150);
  const lens = JSON.parse(await E(`JSON.stringify((i=>[i.w,str(i),i.on.length])(items.find(i=>i.sub==='lens')))`));
  ok('a crowd can lift it (10 strength)', lens[1] >= lens[0], lens);
  let secs = 0; for (; secs < 200 && (await E('state')) === 'play' && !(await E('run.lens')); secs++) { await step(30); if (secs === 12) await shot('coast-5-lens-on-the-pier'); }
  ok('the lens is carried across the valley to the Lantern', await E('run.lens===1'), secs + ' s, state ' + await E('state'));
  await E(`if(dayT>DAYLEN*.5)dayT=DAYLEN*.5;void 0`); await step(12);
  ok('by day the relight waits: the lens is home, the light is not lit yet', await E(`state!=='c3'&&!run.lit&&relightDue()&&coastObj()===null`), await E('state'));
  for (let k = 0; k < 6 && (await E('state')) !== 'play'; k++) { await tap('a'); await step(3); }
  await E(`dayT=DAYLEN*.7;void 0`); await step(12); ok('from the afternoon the arrow says it happens tonight', await E(`/TONIGHT/.test(objective().text)&&state==='play'`), await E('objective().text'));
  await E(`dayT=DAYLEN*.79;void 0`); await step(14); ok('and the relight scene plays in 3D once night has fallen', await E(`state==='c3'&&c3q.key==='relight'`), await E('state'));
  await skip3(); await step(12);
  ok('the North Light is lit, and paid for', await E(`run.lit===1&&(state==='play'||state==='card')`), await E('toasts.length&&toasts[0].s'));
  for (let i = 0; i < 6 && (await E('state')) === 'card'; i++) await tap('a'); await step(12);
  ok('the marker goes back to the missions', !/LENS|PIER|BEAM/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await E(`dayT=DAYLEN*.9;tod.flick=0;void 0`); await tp(28, 22); await step(30);
  ok('the Lantern does not skip any more', await E('!tod.flick&&flickT<=0'));
  await tp(85, 11); await step(20); await shot('coast-6-lit-at-night');
  await E(`state='pause';void 0`); await E(`state='guide';gpage=2;gsel=7;void 0`); await shot('coast-7-guide-bessie');
  ok('Bessie is in the field guide once the light is lit', await E(`spGuideList(2).find(e=>e.n==='BESSIE').known&&spGuideList(3).length===10`));
  await E(`state='map';void 0`); await shot('coast-8-map'); await E(`state='play';void 0`);

  /* ---- more to do on the coast: Marcus Lakefront, the second grub, the beam at night ---- */
  await E(`dayT=30;tod.flick=1;run.pjSeen=run.pjSeen||{};void 0`); await step(20);
  ok('lighting the North Light opens a sixth valley project', await E(`PJ.length===6&&pjOpen(PJ[5])&&(state==='card'||run.pjSeen.lf===1)`), await E('state'));
  for (let i = 0; i < 6 && (await E('state')) === 'card'; i++) await tap('a');
  const stages = await E('PJ[5].st.length'); let built = 0;
  for (let st = 0; st < stages; st++) { await E(`meta.petals+=300;buds=[];squad=[];const need=PJ[5].st[pjS(PJ[5]).s][1];for(const t in need)for(let i=0;i<need[t];i++)mkBud(+t,2,P.x,P.y+6);pjSend(PJ[5]);void 0`); await step(4);
    if (await E(`state==='cine'&&/^pj:lf/.test(scn[0][1])`)) built++; await E('g.setTransform(2,0,0,2,0,0);draw();void 0'); for (let i = 0; i < 12 && (await E('state')) === 'cine'; i++) await tap('a'); for (let i = 0; i < 4 && (await E('state')) === 'card'; i++) await tap('a'); }
  ok('each of its four stages builds and plays its scene', built === stages && await E('pjDone(PJ[5])'), built);
  ok('it pays out the sailor cap', await E(`meta.own.hat.includes(11)&&STY.hat[11][0]==='SAILOR CAP'`));
  await tp(75, 13); await E(`cam.x=P.x-VW/2;cam.y=P.y-VH/2-20;dayT=40;void 0`); await step(3); await shot('coast-9-lakefront');
  await E(`items.forEach(i=>{if(i.sub==='big'&&i.x>70*16)i.alive=false});pjMorning();void 0`);
  ok('Bessie leaves berries on the beach in the morning', (await E(`items.filter(i=>i.alive&&i.sub==='big'&&i.y<13*16&&i.x>72*16&&i.x<82*16).length`)) >= 3, await E('toasts.map(t=>t.s)'));
  ok('every valley scene line still fits its four rows', await E(`Object.keys(SCN).every(k=>{const q=typeof SCN[k]==='function'?SCN[k]():SCN[k];return q.every(e=>wrapPx(e[0],214).length<=4)})`));
  ok('there are two grubs on the coast road now', (await E(`spawns.filter(q=>q.k==='grub'&&q.x>=70).length`)) === 2);
  ok('at night before the relight a beam is drawn east from the Lantern', await E(`(()=>{const lit=run.lit,probe=c=>{run.lit=0;run.call=c;dayT=DAYLEN*.9;tod.flick=1;P.x=34*16;P.y=20*16+8;cam.x=P.x-VW/2;cam.y=P.y-VH/2;g.setTransform(2,0,0,2,0,0);draw();const y=Math.round((HY-27-Math.round(cam.y))*Z)*2,d=g.getImageData(440,y,1,1).data;return d[0]+d[1]+d[2]};const off=probe(0),on=probe(1);run.lit=lit;run.call=1;dayT=40;return on>off+10})()`));

  ok('a Bessling lives on the coast once it is open, and goes in the guide', await E(`(()=>{mkWbuds();updWbuds(.03);const q=wbuds.find(w=>w.id==='BESSLING');return !!q&&!q.hid&&q.x>70*16&&!!wbSprite(q)&&spGuideList(1).length===8&&spGuideList(1)[7].d.length>20})()`));
  ok('it stays hidden while the coast is shut', await E(`(()=>{const c=run.call;run.call=0;updWbuds(.03);const h=wbuds.find(w=>w.id==='BESSLING').hid;run.call=c;updWbuds(.03);return h===true})()`));
  await E(`time+=30;msgT=0;toasts=[];floats=[];dayT=40;void 0`); await tp(73, 16); await step(14);
  ok('Derek minds the snack shack and has something to say', await E(`floats.some(f=>/^DEREK: /.test(f.s))&&spGuideList(2).some(e=>e.n==='DEREK')`), await E('floats.map(f=>f.s)'));

  /* ---- saves ---- */
  const kept = await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return run.lit===1&&run.call===1&&!coastGate('sunDoor').alive&&!coastGate('northPier').alive&&fieldL[6*MW+86]>0&&!items.some(i=>i.alive&&i.sub==='lens')})()`);
  ok('a save keeps the door, the pier and the light', kept);
  const old = await E(`(()=>{init();live=true;state='play';const o=JSON.parse(JSON.stringify(snap()));delete o.gates.sunDoor;delete o.gates.northPier;o.items=o.items.filter(q=>(q[1]>>4)<70);o.won=true;o.shards=4;o.day=4;restore(o);dayT=20;
    return coastGate('sunDoor').alive&&coastGate('northPier').alive&&won&&!run.call&&fieldL[20*MW+57]>=0})()`);
  ok('a save from before this update loads with the door shut', old);
  await E(`dayT=DAYLEN*.8;void 0`); await step(30); ok('and that save gets the call on its next night', await E(`state==='c3'&&c3q.key==='call'`), await E('state')); await skip3();
  const mid = await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return run.call===1&&!coastGate('sunDoor').alive&&coastGate('northPier').alive&&items.filter(i=>i.alive&&i.sub==='lens').length===1&&sprouts.some(q=>q.x>70*16)})()`);
  ok('saved half way, the lens and the wild coast sprouts are still there', mid);

  /* ---- from Will's playtest: fewer trail posts, the front door, the house in 3D ---- */
  await E(`init();live=true;state='play';dayT=30;ZONES.forEach(z=>run.seen[z[0]]=1);void 0`); await step(4);
  ok('trail posts stand only where regions meet (four, not ten)', await E(`PZ.length===4&&PZ.map(z=>z[0]).join()==='LANTERN FIELD,SUNNY ORCHARD,PEBBLE BEACH,NORTH COAST'`), await E('PZ.map(z=>z[0])'));
  await E(`const p=postXY(PZ[0]);P.x=p.x;P.y=p.y+14;P.dx=0;P.dy=-1;buds.forEach(b=>b.st='idle');void 0`); await step(3); await tap('a');
  ok('a post offers the other three', await E(`state==='travel'&&tlist.length===3`), [await E('state'), await E('tlist.length')]); await tap('b');
  await E(`const p=postXY(ZONES[2]);P.x=p.x;P.y=p.y+14;P.dx=0;P.dy=-1;void 0`); await step(3); await tap('a'); ok('there is no post in the North Meadow any more', (await E('state')) === 'play', await E('state'));
  await E(`state='play';P.x=DOOR.x;P.y=DOOR.y+30;P.dx=0;P.dy=1;buds=[];void 0`); await E(`keys.up=1;void 0`); await step(50); await E(`keys.up=0;void 0`); await step(30);
  ok('walking into the front door goes in (no button)', await E('inHome===true'), await E('[P.x|0,P.y|0,inHome]'));
  await E(`keys.down=1;void 0`); await step(70); await E(`keys.down=0;void 0`); await step(30); ok('walking down leaves', await E('inHome===false'));
  await E(`P.x=DOOR.x+14;P.y=DOOR.y+14;void 0`); await E(`keys.left=1;keys.up=1;void 0`); await step(6); await E(`keys.a=1;void 0`); await step(1); await E(`keys.a=0;keys.left=0;keys.up=0;void 0`); await step(40);
  ok('A at the door works while still holding a direction', await E('inHome===true'), await E('[P.x|0,P.y|0,inHome]'));
  const room = JSON.parse(await E(`(()=>{home.res=[4,3,3,2,3,2];home.jobs=[5,6,3];home.up=2;mkRes();for(let i=0;i<20;i++)__g.update(1/30);g.setTransform(2,0,0,2,0,0);draw();const s=new Set();for(let j=0;j<c3px.length;j+=53)s.add(c3px[j]);const f=c3HomeFit();c3Cam(5.5,f[0]*f[1],f[0],5.5,.7,3.1,38);let y0=1e9,y1=-1e9,x0=1e9,x1=-1e9;for(const x of[-.3,11.3])for(const y of[-.2,3.3])for(const z of[-.3,7.25]){const q=c3Proj(x,y,z);x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]+f[2]);y1=Math.max(y1,q[1]+f[2])}return JSON.stringify([s.size,c3stat.tris,Math.round(x0),Math.round(x1),Math.round(y0),Math.round(y1),H])})()`));
  ok('the house is drawn in 3D and the whole room fits between the top bar and the bottom strip', room[0] > 60 && room[1] > 800 && room[2] >= 0 && room[3] <= 320 && room[4] >= 20 && room[5] <= room[6] - 34, room);
  await shot('house-3d');
  await E(`P.x=RX+88;P.y=RY+30;P.dx=0;P.dy=-1;void 0`); await step(3); await tap('a'); ok('the desk still opens the house menu', (await E('state')) === 'house', await E('state')); await tap('b');
  await E(`exitHome();void 0`); await step(3);

  /* ---- from Will's second playtest: Louie, pacing, messages, greens and Pebs ---- */
  await E(`init();live=true;state='play';dayT=30;npcs[0].st='active';npcs[0].mi=2;items.forEach(i=>i.alive=false);bugs.forEach(q=>q.alive=false);P.x=24*16;P.y=18*16;LO.x=LO.sx=P.x-40;LO.y=LO.sy=P.y-30;P.dx=1;P.dy=0;void 0`);
  let pets = 0; for (let k = 0; k < 3; k++) { await step(45); await tap('a'); if (await E(`run.pets===${k + 1}`)) pets++; await step(60); }
  ok("during Erin's pet-Louie ask he comes round and waits when Will stands still: three scratches without chasing him", pets === 3, [pets, await E('[LO.st,Math.hypot(LO.x-P.x,LO.y-P.y)|0]')]);
  await E(`npcs[0].mi=1;LO.st='follow';LO.x=LO.sx=P.x+40;LO.y=LO.sy=P.y+30;P.dx=1;P.dy=0;P.idle=0;const it=mkItem('berry',P.x+60,P.y);window.__it=it;buds=[];for(let i=0;i<3;i++)mkBud(0,2,P.x-6,P.y+6);void 0`); await step(50); const p0 = await E('run.pets'); await tap('a'); await step(40);
  ok('outside that ask he does not come round, and A at a berry throws (no petting by accident)', await E(`run.pets===${p0}&&(__it.on.length>0||buds.some(b=>b.tgt===__it||b.st==='fly'||b.st==='seek'||b.st==='carry')||!__it.alive)`), await E(`[run.pets,__it.on.length,buds.map(b=>b.st).join()]`));
  await E(`init();live=true;state='play';dayT=30;npcs.forEach(n=>n.st='active');P.x=24*16;P.y=18*16;P.dx=1;P.dy=0;LO.x=LO.sx=P.x+16;LO.y=LO.sy=P.y-12;items.forEach(i=>i.alive=false);const it=mkItem('berry',P.x+20,P.y+2);window.__it=it;for(let i=0;i<3;i++)mkBud(0,2,P.x-8,P.y+6);void 0`); await step(20); const p1 = await E('run.pets'); await tap('a'); await step(30);
  ok('a berry lying right in front of Will can be thrown at (the aim used to reach past it)', await E(`run.pets===${p1}&&(__it.on.length>0||!__it.alive||buds.some(b=>b.tgt===__it))`), await E(`[run.pets,__it.on.length,buds.map(b=>b.st).join()]`));
  ok('the mission givers stand apart (Ranger by the bramble, Scout across the berry field)', await E(`(()=>{const d=(a,b)=>Math.hypot(npcs[a].x-npcs[b].x,npcs[a].y-npcs[b].y)/16;return d(0,1)>=4.5&&d(0,2)>=14&&d(1,2)>=14})()`), await E(`npcs.map(n=>[n.name,n.x>>4,n.y>>4])`));
  ok('the quick asks want a little more', await E(`(()=>{const g=id=>{for(const n of npcs)for(const m of n.ms)if(m.id===id)return m.goal};return g('e2')===5&&g('e5')===5&&g('s2')===3&&g('s3')===3})()`));
  ok('a passing message is drawn low on the screen, not over the marker or the middle', await E(`(()=>{toasts=[];say('ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE TEN ELEVEN TWELVE THIRTEEN FOURTEEN',9);__g.tb.on(1);TBX=[];g.setTransform(2,0,0,2,0,0);draw();const L=TBX.filter(b=>/ONE TWO|THIRTEEN/.test(b.s));__g.tb.on(0);TBX=null;return L.length>=2&&L.every(b=>b.y>H*.6&&b.y<H-20)})()`), await E('H'));
  await E(`msgT=0;sprouts=sprouts.filter(q=>q.type!==1&&q.type!==4);void 0`);
  ok('Pebs and Leafs grow back in the wild each morning (two a patch)', await E(`(()=>{const c=t=>sprouts.filter(q=>q.type===t).length;const a=[c(1),c(4)];wildRegrow();const b=[c(1),c(4)];wildRegrow();const d=[c(1),c(4)];return a[0]===0&&b[0]===2&&d[0]===4&&b[1]===2&&d[1]>=3})()`), await E(`[1,4].map(t=>sprouts.filter(q=>q.type===t).length)`));
  ok('a full patch does not overgrow', await E(`(()=>{for(let i=0;i<9;i++)wildRegrow();return sprouts.filter(q=>q.type===1).length===5})()`), await E(`sprouts.filter(q=>q.type===1).length`));
  ok('there are Leafs in the North Meadow from the start, before the garden opens', await E(`(()=>{init();return sprouts.filter(q=>q.type===4&&q.y<10*16&&q.x<40*16).length===3})()`));

  /* ---- what the house is for ---- */
  await E(`init();live=true;state='play';dayT=30;home.res=[6,0,0,0,0,0];home.jobs=[3,1,0];for(let i=0;i<8;i++)mkBud(0,0,P.x,P.y);enterHome();mkRes();void 0`); await step(3);
  ok('four places inside: desk, beds, pantry, fire', await E(`HST.map(h=>h.id).join()==='desk,bed,pantry,fire'&&!homeAt()`));
  await E(`P.x=RX+150;P.y=RY+86;void 0`); await step(2); await tap('a');
  ok('the beds offer a nap or the night', await E(`state==='hsel'&&hsel.opts.length===2`), await E('state')); await shot('house-beds');
  await tap('a'); ok('a nap wakes at dusk, still at home, and the soil has grown meanwhile', await E(`state==='play'&&inHome&&dayT>=DAYLEN*.62&&dayT<DAYLEN*.64&&sprouts.every(q=>q.age>100)`), await E('[dayT|0,inHome]'));
  await E(`dayT=30;P.x=RX+24;P.y=RY+20;void 0`); await step(2); await tap('a'); await tap('a'); await step(2);
  ok('with three pickers the pantry packs a lunch, once a day', await E(`tod.fed===1&&state==='play'`), await E('state'));
  ok('fed, a carried berry moves a quarter faster', await E(`(()=>{const sp=f=>{tod.fed=f;const it=mkItem('berry',30*16,24*16),b=mkBud(0,2,it.x,it.y);b.tgt=it;b.st='carry';it.on.push(b);const x0=it.x,y0=it.y;updItem(it,.1);const d=Math.hypot(it.x-x0,it.y-y0);it.alive=false;b.dead=true;return d};const a=sp(0),b=sp(1);tod.fed=1;buds=buds.filter(q=>!q.dead);return b>a*1.2&&b<a*1.3})()`));
  await E(`P.x=RX+14;P.y=RY+62;void 0`); await step(2); await tap('a');
  ok('the fire tells the story so far and what is next', await E(`state==='hsel'&&hsel.sub.length>=2&&/^NEXT:/.test(hsel.sub[hsel.sub.length-1])&&hsel.sub.every(l=>wrapPx(l,226,1).length<=2)`), await E('hsel&&hsel.sub')); await shot('house-fire'); await tap('a');
  await E(`home.jobs=[1,0,0];buds.forEach(b=>b.stage=0);exitHome();newDay();void 0`); await step(3);
  ok('every two who rest send one of the crew out bloomed', (await E(`buds.filter(b=>b.stage===2).length`)) === 2, await E(`[homeTotal(),buds.filter(b=>b.stage===2).length]`));

  /* ---- Sprouts' own capsules, and erasing everything ---- */
  await E(`state='menu';mi=menuItems().indexOf('CAPSULES');meta.tix=2;meta.ltix=5;meta.petals=0;void 0`); await tap('a');
  ok("CAPSULES opens Sprouts' own machine", (await E('state')) === 'caps', await E('state'));
  ok('it holds Sprouts styles only; Rootdeep unlocks are only in the Lantern machine', await E(`pool('sp').every(q=>q.k!=='rd')&&pool('sp').length>0&&pool('rd').every(q=>q.k==='rd')&&pool().length===pool('sp').length+pool('rd').length`));
  await tap('a'); await step(60); ok('a pull spends a Sprouts ticket and leaves Lantern tickets alone', await E(`meta.tix===1&&meta.ltix===5&&capS.it&&capS.it.k!=='rd'`), await E('[meta.tix,meta.ltix]'));
  await tap('a'); await tap('b');
  await E(`meta.petals=77;meta.life.berries=9;meta.trs=[1];meta.own.rd=[0];run.pets=3;state='menu';mi=menuItems().indexOf('ERASE EVERYTHING');void 0`); await tap('a');
  ok('ERASE EVERYTHING asks first, with NO chosen', await E(`state==='wipe'&&wipeI===0`), await E('state')); await shot('erase');
  await tap('a'); ok('NO goes back and erases nothing', await E(`state==='menu'&&meta.petals===77`));
  await tap('a'); await tap('down'); await tap('a'); await tap('a'); ok('YES needs three presses', await E(`state==='wipe'&&meta.petals===77`), await E('state'));
  await tap('a');
  ok('then Sprouts is brand new: valley, petals, tickets, pulls, stats, Collection, scenes', await E(`state==='menu'&&!live&&meta.petals===0&&meta.tix===1&&meta.xp===0&&meta.life.berries===0&&meta.life.pulls===0&&meta.trs.length===0&&!meta.scn&&Object.keys(meta.ach).length===0&&ownCount()===0&&SAVE.run===null`), await E('JSON.stringify([state,live,meta.petals,meta.tix,meta.life.pulls,ownCount()])'));
  ok("and what belongs to other games is kept (Rootdeep's unlocks, Lantern tickets, sound)", await E(`meta.own.rd.length===1&&meta.ltix===5&&meta.mus>=0`));
  ok('it is saved that way', await E(`JSON.parse(localStorage.getItem('pl-alt:sprouts-v2')||localStorage.getItem('sprouts-v2')).meta.petals===0`));

  /* ---- easter eggs ---- */
  await E(`init();live=true;state='play';dayT=30;ZONES.forEach(z=>run.seen[z[0]]=1);run.key=1;openGate(gates[1]);openGate(coastGate('jobsite'));void 0`); await step(4);
  ok('no van by the pond until Marcus has been met', await E('!vanHere()'));
  await E(`npcs[3].st='active';void 0`); await tp(13, 27, 0, -1); await E(`P.y=VAN.y+16;buds.forEach(b=>b.st='idle');void 0`); await step(3); await shot('egg-1-van'); await tap('a'); await step(3);
  ok('A at the van by day: Marcus and Derek tear off to a job, in 3D', await E(`state==='c3'&&c3q.key==='job'&&tod.vanGone===1`), await E('state'));
  await tap('start'); await step(3); ok('and the van is gone for the day', await E(`!vanHere()&&state==='play'`));
  await E(`newDay();void 0`); await step(3); ok('it is back in the morning', await E('vanHere()'));
  await tp(13, 27, 0, -1); await E(`P.y=VAN.y+16;buds.forEach(b=>b.st='idle');void 0`); await step(3); await tap('a'); await step(3);
  ok('the second time it is a line, not the scene', await E(`state==='play'&&/JOB/.test(msg)`), await E('msg'));
  await E(`newDay();dayT=DAYLEN*.7;duskSaid=true;void 0`); await tp(13, 27, 0, -1); await E(`P.y=VAN.y+16;buds.forEach(b=>b.st='idle');void 0`); await step(3); await tap('a'); await step(3);
  ok('A at the van after dark: see one, send one', await E(`state==='c3'&&c3q.key==='sesh'&&c3q.S.some(e=>/[Ss]ee one, send one/.test(e.cap[1]))`), await E('state'));
  await tap('start'); await step(3);
  await E(`dayT=30;run.pets=4;LO.st='follow';LO.x=LO.sx=P.x+14;LO.y=LO.sy=P.y;P.dx=1;P.dy=0;P.idle=1;P.mv=false;void 0`); await step(2); await tap('a'); await step(4);
  ok("the fifth scratch does not cut to Louie's dream in the middle of the day", await E(`run.pets===5&&state==='play'&&!sceneQ.length&&/TONIGHT/.test(msg)`), [await E('run.pets'), await E('state'), await E('msg')]);
  { const d = await E('day'); await E(`dayT=DAYLEN-.1;void 0`); await step(6);
    ok('it plays once night has fallen, before the evening report', await E(`state==='c3'&&c3q.key==='dream'&&day===${d}`), await E('state'));
    await tap('start'); await step(8); ok('and the evening report follows it', (await E('state')) === 'dayend', await E('state'));
    await E(`state='play';dayT=30;void 0`); await step(2); } await E(`run.pets=9;LO.st='follow';LO.t=0;LO.x=LO.sx=P.x+14;LO.y=LO.sy=P.y;P.dx=1;P.dy=0;P.idle=1;void 0`); await step(40); await E(`LO.st='follow';LO.x=LO.sx=P.x+14;LO.y=LO.sy=P.y;P.dx=1;P.dy=0;P.idle=1;void 0`); await step(2); await tap('a'); await step(4);
  ok('the tenth plays the zoomies', await E(`run.pets===10&&state==='c3'&&c3q.key==='zoomies'`), [await E('run.pets'), await E('state')]);
  await tap('start'); await step(3);
  await E(`const it=mkItem('trs',HX,HY+12);it.tri=7;it.w=1;const b=mkBud(1,2,HX,HY+14);b.tgt=it;b.st='carry';it.on.push(b);void 0`); await step(30);
  ok('the red button coming home shows its card', await E(`state==='card'&&/RED BUTTON/.test(card.title)`), await E('state'));
  await tap('a'); await step(4); ok('and then its scene', await E(`state==='c3'&&c3q.key==='button'`), await E('state')); await tap('start'); await step(3);
  /* four more hidden scenes */
  const clear = async () => { for (let k = 0; k < 8 && (await E('state')) !== 'play'; k++) { const st = await E('state'); if (st === 'c3') await skip3(); else if (st === 'pause' || st === 'hsel') await tap('b'); else await tap('a'); await step(4); } };
  await clear(); await E(`dayT=30;npcs[3].st='active';run.emb=0;run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1,lf:1};buds=[];for(let i=0;i<6;i++)mkBud(0,2,P.x,P.y);void 0`); await tp(17, 20, -1, 0); await step(4);
  for (let k = 0; k < 40 && (await E('state')) === 'play' && (await E('run.emb')) < 5; k++) { await E(`P.x=16*16+12;P.y=20*16+8;P.dx=-1;P.dy=0;buds.forEach(b=>{release(b);b.st='follow';b.x=P.x+4;b.y=P.y+4});void 0`); await step(2); await throwFor(3); await step(30); }
  await step(6); ok('five Embers thrown in the pond: the hot tub', await E(`state==='c3'&&c3q.key==='hottub'`), [await E('state'), await E('run.emb')]); await clear();
  await E(`openGarden();dayT=DAYLEN*.7;duskSaid=true;void 0`); await step(12); await clear(); await E(`P.x=npcs[0].x;P.y=npcs[0].y+14;P.dx=0;P.dy=-1;buds.forEach(b=>{release(b);b.st='idle';b.x=P.x+40}); LO.x=LO.sx=P.x+50;void 0`); await step(3); await tap('a'); await step(4);
  ok('talking to Erin in her garden at dusk: the moonblooms', await E(`state==='c3'&&c3q.key==='moon'`), await E('state')); await clear();
  await E(`dayT=30;run.boss=true;run.thk=0;P.x=THORN.x;P.y=THORN.y+18;P.dx=0;P.dy=-1;buds.forEach(b=>{release(b);b.st='idle';b.x=P.x+60});LO.x=LO.sx=P.x+50;void 0`); await step(3);
  for (let k = 0; k < 5 && (await E('state')) === 'play'; k++) { await E(`P.x=THORN.x;P.y=THORN.y+18;P.dx=0;P.dy=-1;P.idle=0;void 0`); await tap('a'); await step(6); }
  ok('bothering Thornback five times: the slide', await E(`state==='c3'&&c3q.key==='slide'`), [await E('state'), await E('run.thk')]); await clear();
  await E(`run.call=1;run.lit=1;run.coastScn=1;run.seen['NORTH COAST']=1;if(coastGate('sunDoor').alive)openGate(coastGate('sunDoor'));if(coastGate('northPier').alive)openGate(coastGate('northPier'));dayT=DAYLEN*.7;void 0`); await step(12); await clear(); await tp(86, 7); await step(14);
  ok('the rock by the North Light after dark: Bessie says hello', await E(`state==='c3'&&c3q.key==='bessie'`), await E('state')); await clear();
  ok('nine hidden scenes in the Collection, each with a hint that fits', await E(`C3LIST.length-C3HID===9&&C3LIST.slice(C3HID).every(q=>wrapPx('A hidden scene (9 in all). '+q[2],228,2).length<=3)`));
  await E(`init();live=true;state='play';dayT=30;rushN=0;rushT=-99;const p0=meta.petals;window.__p0=p0;for(let k=0;k<5;k++){const it=mkItem('berry',HX,HY+6);deliver(it)}void 0`);
  ok('five berries home in a row is a berry rush', await E(`rushN===5&&toasts.some(t=>/BERRY RUSH/.test(t.s))&&meta.petals>=__p0+8`), await E('[rushN,meta.petals-__p0]'));
  ok('a best day for berries is remembered and shown in the evening report', await E(`(()=>{meta.best=0;tod.berries=9;endDay();const a=tod.best===1&&meta.best===9;state='play';tod.best=0;tod.berries=3;endDay();const b=!tod.best&&meta.best===9;state='play';return a&&b})()`));
  await E(`run.egg={job:1,sesh:1,dream:1,zoomies:1,button:1};void 0`);
  ok('all five are kept for the Collection, and a save remembers which were found', await E(`['job','sesh','dream','zoomies','button'].every(c3SeenScene)&&(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return Object.keys(run.egg).length===5})()`));

  /* ---- the first shard in 3D ---- */
  await E(`init();live=true;state='play';const it=mkItem('shard',24*16+8-50,18*16+8);it.w=1;for(let i=0;i<6;i++)mkBud(1,2,P.x,P.y);void 0`); await tp(24, 18, -1, 0); await step(3); await throwFor(20); await step(30 * 12);
  ok('the first shard home plays its 3D scene, with Ranger and the marks', await E(`shards===1&&state==='c3'&&c3q.key==='marks'&&c3q.S.some(e=>e.cap[0]==='RANGER')`), [await E('shards'), await E('state')]);
  await skip3(); ok('and play goes on', (await E('state')) === 'play', await E('state'));

  /* ---- the ending in 3D ---- */
  await E(`init();live=true;state='play';shards=3;const it=mkItem('shard',24*16+8-50,18*16+8);it.w=1;for(let i=0;i<6;i++)mkBud(1,2,P.x,P.y);void 0`); await tp(24, 18, -1, 0); await step(3); await throwFor(20); await step(30 * 12);
  ok('the fourth shard plays the 3D ending', await E(`shards===4&&state==='c3'&&c3q.key==='blaze'`), [await E('shards'), await E('state')]);
  await skip3(); ok("then Erin's lines", await E(`state==='cine'&&/^You did it/.test(scn[0][0])`), await E('state'));
  for (let i = 0; i < 30 && (await E('state')) === 'cine'; i++) await tap('a');
  ok('and the win screen', await E(`state==='win'&&won`), await E('state'));

  /* ---- found in the playtest pass ---- */
  await E(`init();live=true;state='play';won=true;shards=4;day=3;ZONES.forEach(z=>run.seen[z[0]]=1);dayT=DAYLEN-.01;void 0`); await step(6);
  ok('going to bed early does not sleep through the call', await E(`state==='c3'&&c3q.key==='call'`), await E('state'));
  await skip3(); await step(30); ok('and the evening report follows it', await E(`run.call===1&&state==='dayend'`), await E('state'));
  ok('a save made during the ending still counts, and a lens that is home but unlit still gets its night', await E(`(()=>{init();live=true;state='play';const o=JSON.parse(JSON.stringify(snap()));o.shards=4;o.won=false;o.run.lens=1;o.run.call=1;restore(o);return won===true&&run.lens===1&&!run.lit&&relightDue()})()`));
  await E(`init();live=true;state='play';ZONES.forEach(z=>run.seen[z[0]]=1);dayT=30;const b=mkBud(0,2,6*16+8,27*16+8);b.st='idle';window.__b=b;void 0`); await step(3);
  ok('a sprout set down inside a tree steps out', await E(`free(__b.x,__b.y,false)`), await E(`[__b.x|0,__b.y|0]`));
  const patch = JSON.parse(await E(`(()=>{init();live=true;state='play';drawWorld();const grab=()=>[BG[0],BG[1],OVR].map(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data),out=[];
    for(const f of [()=>openGate(gates[0],false),()=>openGate(coastGate('sunDoor'),false),()=>openGate(coastGate('northPier'),false),()=>{gard.harv=30;syncBeds()}]){f();const part=bakeDirty!==true;drawWorld();const A=grab();bakeDirty=true;drawWorld();const B=grab();let d=0;for(let k=0;k<3;k++)for(let i=0;i<A[k].length;i+=4)if(A[k][i]!==B[k][i]||A[k][i+1]!==B[k][i+1]||A[k][i+2]!==B[k][i+2]||A[k][i+3]!==B[k][i+3])d++;out.push([part,d])}return JSON.stringify(out)})()`));
  ok('repainting only the changed patch of ground gives the same picture as repainting it all', patch.every(q => q[0] && q[1] === 0), patch);
  const cull = JSON.parse(await E(`(()=>{const seen=c3Seen;let bad=0,n=0,drawn=0,all=0;for(const k of Object.keys(C3SCN))for(let i=0;i<C3SCN[k].length;i++)for(const f of [.2,.8]){const go=()=>{c3Play(k);c3q.i=i;c3q.t=C3SCN[k][i].d*f;c3q.tt=i*7+c3q.t;time=50;g.setTransform(2,0,0,2,0,0);draw();const a=Array.from(c3px);c3q=null;state='play';return a};
    c3Seen=seen;const A=go();drawn+=C3VAL.filter(m=>seen(m.bc,m.br)).length;all+=C3VAL.length;c3Seen=()=>true;const B=go();for(let q=0;q<A.length;q++)if(A[q]!==B[q]){bad++;break}n++}c3Seen=seen;return JSON.stringify([n,bad,Math.round(drawn/all*100)])})()`));
  ok('leaving out the parts of the 3D valley that are off screen never changes the picture', cull[1] === 0 && cull[2] < 70, cull[0] + ' frames, ' + cull[2] + '% of the valley worked out');
  const off = JSON.parse(await E(`(()=>{init();live=true;state='play';ZONES.forEach(z=>run.seen[z[0]]=1);dayT=40;drawWorld();const o=g.fillRect.bind(g);let n=0,out=0;g.fillRect=(x,y,w,h)=>{n++;const m=g.getTransform(),X=m.a*x+m.e,Y=m.d*y+m.f;if(X>cv.width||Y>cv.height||X+w*m.a<0||Y+h*m.d<0)out++;o(x,y,w,h)};g.setTransform(2,0,0,2,0,0);drawWorld();g.fillRect=o;return JSON.stringify([n,out])})()`));
  ok('far less is drawn off screen (it was over half)', off[1] < off[0] * 0.35, off);
  ok('on a slow device a 3D scene works the picture out every other frame', await E(`(()=>{c3Play('dawn');g.setTransform(2,0,0,2,0,0);for(let i=0;i<4;i++){c3q.t+=.03;c3q.tt+=.03;draw()}c3q.half=1;c3q.ms=200;c3q.fn=10;c3q.t+=.2;c3q.tt+=.2;draw();const a=c3px.slice();c3q.t+=.2;c3q.tt+=.2;draw();let same=1;for(let i=0;i<a.length;i++)if(a[i]!==c3px[i]){same=0;break}c3q.t+=.2;c3q.tt+=.2;draw();let moved=0;for(let i=0;i<a.length;i++)if(a[i]!==c3px[i]){moved=1;break}c3q=null;state='play';return same&&moved})()`));

  await E(`meta.scn={};init();live=true;state='play';c3Play('dawn');void 0`); await tap('start'); await E(`state='bugs';cpage=2;csel=0;colFrom='pause';void 0`); await shot('collection-scenes');
  ok('a scene that has been seen is kept in the Collection', await E(`c3SeenScene('dawn')&&!c3SeenScene('call')&&C3LIST.length===Object.keys(C3SCN).length`));
  await tap('a'); const rep1 = await E(`state==='c3'&&c3q.key==='dawn'`); await tap('start'); await step(2);
  ok('A plays it again and comes back to the Collection', rep1 && (await E('state')) === 'bugs', await E('state'));
  await E(`csel=C3LIST.findIndex(q=>q[0]==='call');void 0`); await E('g.setTransform(2,0,0,2,0,0);draw();void 0'); await tap('a'); ok('an unseen scene cannot be played from there', (await E('state')) === 'bugs', await E('state'));
  await tap('b'); ok('B leaves the Collection as before', (await E('state')) === 'pause', await E('state')); await E(`state='play';void 0`);
  const long2 = JSON.parse(await E(`JSON.stringify(C3LIST.filter(q=>tw(q[1],2)>118||wrapPx(q[2]+' Press A to watch it again.',228,2).length>3||wrapPx('One of five hidden scenes. '+q[2],228,2).length>3).map(q=>q[0]))`));
  ok('the scene names and lines fit', long2.length === 0, long2);

  /* ---- glimmers: three hidden lights in every place ---- */
  const gl = JSON.parse(await E(`(()=>{init();live=true;state='play';const per=ZONES.map((z,i)=>GLIM.filter(q=>q.z===i).length);const A=JSON.stringify(GLIM);glimInit();
    const bad=GLIM.filter(q=>{const tx=q.x>>4,ty=(q.y-2)>>4;return map[ty*MW+tx]!==G||!free(q.x,q.y)}).length;
    const dup=GLIM.filter((q,i)=>GLIM.some((o,j)=>j<i&&o.x===q.x&&o.y===q.y)).length;return JSON.stringify([GLIM.length,per,bad,dup,A===JSON.stringify(GLIM)])})()`));
  ok('there are thirty glimmers, three in every place', gl[0] === 30 && gl[1].every(n => n === 3), gl[1]);
  ok('each sits on open grass Will can walk to, no two together, and in the same spots every game', gl[2] === 0 && gl[3] === 0 && gl[4], gl);
  await E(`dayT=40;const q=GLIM[0];P.x=q.x-40;P.y=q.y;cam.x=P.x-VW/2;cam.y=P.y-VH/2;LO.x=LO.sx=P.x-20;LO.y=LO.sy=P.y+14;void 0`); await step(4); await shot('glimmer');
  const g0 = JSON.parse(await E(`JSON.stringify([glimHave(),meta.petals,meta.tix])`));
  await E(`P.x=GLIM[0].x;P.y=GLIM[0].y;void 0`); await step(3);
  const g1 = JSON.parse(await E(`JSON.stringify([glimHave(),meta.petals,meta.tix,!!run.gl[0]])`));
  ok('walking over one picks it up for 2 petals', g0[0] === 0 && g1[0] === 1 && g1[3] && g1[1] === g0[1] + 2, [g0, g1]);
  await step(5); ok('and it is not picked up twice', (await E('glimHave()')) === 1 && (await E('meta.petals')) === g1[1]);
  const walk = async i => { await E(`P.x=GLIM[${i}].x;P.y=GLIM[${i}].y;glimTick();void 0`); }; /* straight to the pick-up, so walking into a new place does not start its own events */
  const zi = await E(`GLIM[0].z`); const mates = JSON.parse(await E(`JSON.stringify(GLIM.map((q,i)=>q.z===${zi}&&i?i:-1).filter(i=>i>0))`));
  await walk(mates[0]); const pz = await E('meta.petals'); await walk(mates[1]);
  ok('clearing a place pays 5 more', (await E('meta.petals')) === pz + 7 && (await E(`glimIn(${zi})`)) === 3, [pz, await E('meta.petals')]);
  const rest = JSON.parse(await E(`JSON.stringify(GLIM.map((q,i)=>run.gl[i]?-1:i).filter(i=>i>=0))`));
  for (let k = 0; k < 6; k++) await walk(rest[k]); const t9 = await E('meta.tix'); await walk(rest[6]);
  ok('the tenth pays a ticket', (await E('glimHave()')) === 10 && (await E('meta.tix')) === t9 + 1, [await E('glimHave()'), t9, await E('meta.tix')]);
  const gkept = await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);live=true;state='play';return glimHave()===10&&!!run.gl[0]})()`);
  ok('found glimmers are kept in the save', gkept, await E('glimHave()'));
  for (let k = 7; k < rest.length - 1; k++) await walk(rest[k]); const pl = await E('meta.petals'), tl = await E('meta.tix'); await walk(rest[rest.length - 1]);
  ok('the last one pays 50 and 2 tickets', (await E('glimHave()')) === 30 && (await E('meta.tix')) >= tl + 2 && (await E('meta.petals')) >= pl + 52, [pl, await E('meta.petals'), tl, await E('meta.tix')]);
  await E(`state='pause';void 0`); await shot('glimmer-pause'); await E(`state='play';void 0`);
  const sc = JSON.parse(await E(`(()=>{const n=npcs.find(n=>n.name==='SCOUT'),ids=n.ms.map(m=>m.id);const a=ids.indexOf('s4'),m5=n.ms[a+1],m6=n.ms[a+2];return JSON.stringify([ids.slice(a),m5.get(),m5.goal,m6.goal,wrapPx(m5.say,228,1).length,wrapPx(m6.say,228,1).length,tw(m5.t,1),tw(m6.t,1)])})()`));
  ok("Scout asks for 10 and then 20 after her bug asks, counted from what Will has found", sc[0].join() === 's4,s5,s6' && sc[1] === 30 && sc[2] === 10 && sc[3] === 20, sc);
  ok('the marker for her ask points at the nearest glimmer not yet found', await E(`(()=>{init();live=true;state='play';const t=AT.s5();return GLIM.some(q=>q.x===t.x&&q.y===t.y)&&GLIM.filter(q=>q.z===0).some(q=>q.x===t.x&&q.y===t.y)})()`));
  /* A at someone talks even while Will is still walking */
  await E(`init();live=true;state='play';run.egg={};ZONES.forEach(z=>run.seen[z[0]]=1);const n=npcs.find(n=>n.name==='SCOUT');P.x=n.x-34;P.y=n.y+4;P.d=1;P.fx=1;P.fy=0;LO.x=LO.sx=P.x-30;LO.y=LO.sy=P.y+20;void 0`);
  await E(`keys.right=1;void 0`); await step(8); const mvg = await E('P.mv'); await E(`keys.a=1;void 0`); await step(1); await E(`keys.a=0;keys.right=0;void 0`); await step(2);
  ok('A at someone talks while Will is still walking', !!mvg && (await E('state')) !== 'play', [mvg, await E('state')]);

  /* ---- story order: what the Nov 18 playthrough turned up ---- */
  const fresh = `init();live=true;state='play';run.egg={};ZONES.forEach(z=>run.seen[z[0]]=1);`;
  const arrows = JSON.parse(await E(`(()=>{${fresh}const out=[],e=npcs[0],at=n=>{P.x=n.x;P.y=n.y+14};at(e);talk(e);state='play';out.push(objective().text);
    for(let k=0;k<3;k++){e.ms[e.mi].get=()=>99;talk(e);state='play';out.push(objective().text)}
    const r=npcs[1];at(r);talk(r);state='play';out.push(objective().text);openGate(gates[0]);out.push(objective().text);talk(r);state='play';out.push(objective().text);
    const sc=npcs[2];at(sc);talk(sc);state='play';out.push(objective().text);found[3]=true;talk(sc);state='play';out.push(objective().text);
    e.ms[e.mi].get=()=>99;out.push(objective().text);at(e);talk(e);state='play';out.push(objective().text);return JSON.stringify(out)})()`));
  ok("the arrow stays on Erin for her first three asks", arrows.slice(0, 3).every(t => /PLUCK|BERRIES|LOUIE|ERIN/.test(t)), arrows.slice(0, 3));
  ok('then it sends Will to meet Ranger, and after his first ask, Scout', /TALK TO RANGER/.test(arrows[3]) && /BRAMBLE/.test(arrows[4]) && /GO SEE RANGER/.test(arrows[5]) && /TALK TO SCOUT/.test(arrows[6]) && /ZIP/.test(arrows[7]), arrows.slice(3, 8));
  ok('with everyone met it stays on whoever Will last spoke to', /BUGS/.test(arrows[8]), arrows[8]);
  ok('an ask that is finished calls him back, whoever gave it, and talking to them puts the arrow on theirs', /GO SEE ERIN/.test(arrows[9]) && /FLOWERS/.test(arrows[10]), arrows.slice(9));
  ok('Marcus is not named until the pond road is open', await E(`(()=>{${fresh}const e=npcs[0];e.st='active';e.mi=4;run.meet=1;npcs[1].st=npcs[2].st='active';run.trk='ERIN';P.x=HX;P.y=HY+20;reachC=null;const a=tracked().name;openGate(gates[1]);openGate(coastGate('jobsite'));reachC=null;return a==='ERIN'&&tracked().name==='MARCUS'})()`));
  ok('the pause list marks the ask the arrow is on', await E(`(()=>{${fresh}npcs[0].st='active';npcs[0].mi=4;npcs[1].st='active';run.trk='RANGER';state='pause';g.setTransform(2,0,0,2,0,0);const o=g.fillRect.bind(g);let n=0;g.fillRect=(x,y,w,h)=>{if(g.fillStyle==='#f8e060'&&x<=3&&y>118)n++;o(x,y,w,h)};draw();g.fillRect=o;state='play';return n===2})()`));
  const s2v = JSON.parse(await E(`(()=>{${fresh}const a=SCN.s2().map(q=>q[2]||'');npcs[3].st='active';const b=SCN.s2().map(q=>q[2]||'');return JSON.stringify([a,b,SCN.s2().every(q=>wrapPx(q[0],228,2).length<=4)])})()`));
  ok('at two shards Marcus only speaks if Will has met him; otherwise Ranger brings the news', s2v[0].includes('RANGER') && !s2v[0].includes('MARCUS') && s2v[1].includes('MARCUS'), s2v);
  const late = JSON.parse(await E(`(()=>{${fresh}const r=npcs[1];r.st='active';r.mi=r.ms.findIndex(m=>m.id==='r5');r.ms[r.mi].get=()=>1;run.boss=true;P.x=r.x;P.y=r.y+14;talk(r);const t=dlg.pages.map(p=>p.join(' ')).join(' ');state='play';
    return JSON.stringify([/already been to see him/.test(t),!/sleeps like a boulder/.test(t),npcs.reduce((k,n)=>k+n.ms.filter(m=>m.late).length,0)===6])})()`));
  ok('an ask that is already done when it is given gets a line that says so (Thornback is not "asleep" after he has moved in)', late.every(Boolean), late);
  ok('the call never comes on the same evening as the ending', await E(`(()=>{${fresh}won=true;day=3;run.wonDay=3;const a=coastDue();day=4;return !a&&coastDue()})()`));
  ok('the job site lock cannot be opened through the crystal beside it', await E(`(()=>{${fresh}run.key=1;const j=coastGate('jobsite');P.x=j.x+30;P.y=j.y;keyTick();const a=j.alive;openGate(gates[1]);keyTick();return a&&!j.alive})()`));
  ok('the job scene (a quiet morning) only plays in the morning', await E(`(()=>{${fresh}npcs[3].st='active';dayT=DAYLEN*.5;vanUse();const a=!sceneQ.length&&tod.vanGone===1;tod.vanGone=0;dayT=DAYLEN*.2;vanUse();return a&&sceneQ.length===1&&sceneQ[0][0]==='3:job'})()`));
  /* A: the nearer of the person and the thing aimed at */
  await E(`${fresh}sceneQ.length=0;const n=npcs[1];for(let i=0;i<4;i++)mkBud(0,2,n.x,n.y+30);P.x=n.x;P.y=n.y+30;P.dx=0;P.dy=-1;void 0`); await step(3);
  const tv = JSON.parse(await E(`JSON.stringify([cur.o===gates[0],squad.length])`)); await tap('a'); await step(2);
  ok('aimed at the bramble with Ranger standing in front of it, A throws', tv[0] && tv[1] > 0 && (await E('state')) === 'play' && await E(`buds.some(b=>b.st==='fly'||b.tgt===gates[0])`), [tv, await E('state')]);
  await E(`buds.forEach(b=>{release(b);b.st='follow'});const n=npcs[1];P.x=n.x;P.y=n.y+13;P.dx=0;P.dy=-1;void 0`); await step(3); await tap('a'); await step(2);
  ok('right up against him, A talks', (await E('state')) === 'talk', await E('state')); await E(`state='play';void 0`);

  /* (the handheld's cartridge splash checks are not here: Sprouts TV has no cartridges. Its own way in is checked by tv.js) */

  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
