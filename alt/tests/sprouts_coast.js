/* Sprouts: the 3D cutscenes and the North Coast. Stepped (no real-time waits), fresh save.
   Checks every shot of every 3D scene draws, the captions fit, and the whole new arc plays: the opening in 3D, the
   night the Lantern calls, the sun door, the coast, the pier, the lens carried home, the relight, saves, and the ending.
   Run from the repo root:  node alt/tests/sprouts_coast.js [build.html] [folder for screenshots] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(200); }
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(2); };
  const tp = (tx, ty, dx = 0, dy = -1) => E(`P.x=${tx}*16+8;P.y=${ty}*16+8;P.dx=${dx};P.dy=${dy};LO.x=LO.sx=P.x-18;LO.y=LO.sy=P.y+4;trail=[];buds.forEach(b=>{release(b);b.gard=false;b.x=P.x;b.y=P.y+4;b.st='follow'});void 0`);
  const throwFor = async n => { await E(`keys.a=1;void 0`); await step(n); await E(`keys.a=0;void 0`); };
  const shot = async n => { if (!SHOTS) return; await E('g.setTransform(2,0,0,2,0,0);draw();void 0'); await page.locator('#screen').screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const skip3 = async () => { await step(3); if ((await E('state')) === 'c3') await tap('start'); await step(2); };

  /* ---- the scenes themselves ---- */
  const keys = JSON.parse(await E('JSON.stringify(Object.keys(C3SCN))'));
  ok('five 3D scenes', keys.join() === 'dawn,blaze,call,coast,relight', keys);
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
  ok('left alone, a scene plays itself to the end', (await E('state')) === 'play', await E('state'));
  await E(`c3Play('dawn');void 0`); await tap('start'); ok('START skips a scene', (await E('state')) === 'play');

  /* ---- before the call ---- */
  await E(`init();live=true;state='play';ZONES.forEach(z=>{if(z[0]!=='NORTH COAST')run.seen[z[0]]=1});run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};run.tips={br:1,ne:1,dg:1,wb:1,wn:1,fl:1};found=found.map(()=>true);
    gates.forEach(q=>q.alive&&q.sub<4&&q.id!=='northPier'&&openGate(q));for(let i=0;i<30;i++)mkBud(i%6,2,P.x,P.y);for(let i=0;i<10;i++)mkBud(1,2,P.x,P.y);day=3;dayT=30;void 0`);
  await step(15);
  ok('the sun door is shut and the coast cut off', await E(`coastGate('sunDoor').alive&&fieldL[20*MW+72]<0&&!coastObj()`));
  await tp(66, 20, 1, 0); await throwFor(20); await step(30);
  ok('sprouts cannot open the sun door', await E(`coastGate('sunDoor').alive&&coastGate('sunDoor').on.length===0`), await E('msg'));
  await shot('coast-1-door-shut');
  await E(`dayT=DAYLEN*.8;void 0`); await step(30);
  ok('nothing happens at night before the Lantern is whole', (await E('state')) === 'play' && !(await E('run.call')));

  /* ---- the night the Lantern calls ---- */
  await E(`won=true;shards=4;dayT=DAYLEN*.8;void 0`); await tp(28, 22); await step(30);
  ok('with the Lantern whole, night brings the 3D scene', await E(`state==='c3'&&c3q.key==='call'`), await E('state'));
  await skip3();
  ok('afterwards the door is open, the way is walkable, the lens is out there', await E(`state==='play'&&run.call===1&&!coastGate('sunDoor').alive&&fieldL[20*MW+72]>0&&items.some(i=>i.alive&&i.sub==='lens')`), await E('msg'));
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
  await step(30 * 14); ok('the pier gets built', await E(`!coastGate('northPier').alive&&fieldL[6*MW+86]>0`), await E('msg'));
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
  await step(4); ok('and the relight scene plays in 3D', await E(`state==='c3'&&c3q.key==='relight'`), await E('state'));
  await skip3(); await step(12);
  ok('the North Light is lit, and paid for', await E(`run.lit===1&&state==='play'`), await E('toasts.length&&toasts[0].s'));
  ok('the marker goes back to the missions', !/LENS|PIER|BEAM/.test(await E('OBJ&&OBJ.text')), await E('OBJ&&OBJ.text'));
  await E(`dayT=DAYLEN*.9;tod.flick=0;void 0`); await tp(28, 22); await step(30);
  ok('the Lantern does not skip any more', await E('!tod.flick&&flickT<=0'));
  await tp(85, 11); await step(20); await shot('coast-6-lit-at-night');
  await E(`state='pause';void 0`); await E(`state='guide';gpage=2;gsel=7;void 0`); await shot('coast-7-guide-bessie');
  ok('Bessie is in the field guide once the light is lit', await E(`spGuideList(2).find(e=>e.n==='BESSIE').known&&spGuideList(3).length===10`));
  await E(`state='map';void 0`); await shot('coast-8-map'); await E(`state='play';void 0`);

  /* ---- saves ---- */
  const kept = await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return run.lit===1&&run.call===1&&!coastGate('sunDoor').alive&&!coastGate('northPier').alive&&fieldL[6*MW+86]>0&&!items.some(i=>i.alive&&i.sub==='lens')})()`);
  ok('a save keeps the door, the pier and the light', kept);
  const old = await E(`(()=>{init();live=true;state='play';const o=JSON.parse(JSON.stringify(snap()));delete o.gates.sunDoor;delete o.gates.northPier;o.items=o.items.filter(q=>(q[1]>>4)<70);o.won=true;o.shards=4;o.day=4;restore(o);dayT=20;
    return coastGate('sunDoor').alive&&coastGate('northPier').alive&&won&&!run.call&&fieldL[20*MW+57]>=0})()`);
  ok('a save from before this update loads with the door shut', old);
  await E(`dayT=DAYLEN*.8;void 0`); await step(30); ok('and that save gets the call on its next night', await E(`state==='c3'&&c3q.key==='call'`), await E('state')); await skip3();
  const mid = await E(`(()=>{const o=JSON.parse(JSON.stringify(snap()));restore(o);return run.call===1&&!coastGate('sunDoor').alive&&coastGate('northPier').alive&&items.filter(i=>i.alive&&i.sub==='lens').length===1&&sprouts.some(q=>q.x>70*16)})()`);
  ok('saved half way, the lens and the wild coast sprouts are still there', mid);

  /* ---- the ending in 3D ---- */
  await E(`init();live=true;state='play';shards=3;const it=mkItem('shard',24*16+8-50,18*16+8);it.w=1;for(let i=0;i<6;i++)mkBud(1,2,P.x,P.y);void 0`); await tp(24, 18, -1, 0); await step(3); await throwFor(20); await step(30 * 12);
  ok('the fourth shard plays the 3D ending', await E(`shards===4&&state==='c3'&&c3q.key==='blaze'`), [await E('shards'), await E('state')]);
  await skip3(); ok("then Erin's lines", await E(`state==='cine'&&/^You did it/.test(scn[0][0])`), await E('state'));
  for (let i = 0; i < 30 && (await E('state')) === 'cine'; i++) await tap('a');
  ok('and the win screen', await E(`state==='win'&&won`), await E('state'));

  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
