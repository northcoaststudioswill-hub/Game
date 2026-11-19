/* Sprouts TV 2: the Nov 19 2026 cutscene round. Stepped, with the clock held (the page's own loop and timers stand still).
   Checks the scene list and captions, that the van always drives nose first with Derek at the wheel, that every new
   scene plays from its real trigger exactly once, the order of the van's hidden scenes, and that each new scene runs
   start to finish on its own clock.
   Run from the repo root:  node sprouts-tv2/tests/scenes.js [build.html] [folder for screenshots] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  await E('HOLD=1;void 0');
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(2); };
  const shot = async n => { if (!SHOTS) return; await E('g.setTransform(2,0,0,2,0,0);draw();void 0'); await page.locator('#screen').screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const fresh = `init();live=true;state='play';c3q=null;run.egg={};ZONES.forEach(z=>run.seen[z[0]]=1);`;
  const NEW = ['ranger', 'scout', 'road', 'lens', 'watch', 'rest', 'fog', 'munch', 'knock'];

  /* ---- the list ---- */
  const cnt = JSON.parse(await E(`JSON.stringify([Object.keys(C3SCN).length,Object.values(C3SCN).reduce((a,S)=>a+S.length,0),C3LIST.length,C3LIST.length-C3HID,C3LIST.every(q=>!!C3SCN[q[0]]),Object.keys(C3SCN).filter(k=>!C3LIST.some(q=>q[0]===k))])`));
  ok('34 scenes and 152 shots; every one is in the Collection, 12 of them hidden', cnt[0] === 34 && cnt[1] === 152 && cnt[2] === 34 && cnt[3] === 12 && cnt[4] && cnt[5].length === 0, cnt);
  ok('the nine new scenes are there: six in the story, three hidden', await E(`${JSON.stringify(NEW)}.every(k=>!!C3SCN[k])&&['ranger','scout','road','lens','watch','rest'].every(k=>C3LIST.findIndex(q=>q[0]===k)<C3HID)&&['fog','munch','knock'].every(k=>C3LIST.findIndex(q=>q[0]===k)>=C3HID)`));
  const long = JSON.parse(await E(`JSON.stringify(Object.entries(C3SCN).flatMap(([k,S])=>S.map((s,i)=>[k,i+1,wrapPx(s.cap[1],228).length])).filter(q=>q[2]>3))`));
  ok('every caption in the game fits its three lines', long.length === 0, long);
  const order = JSON.parse(await E(`JSON.stringify(C3LIST.slice(0,C3HID).map(q=>q[0]))`));
  const before = (a, b) => order.indexOf(a) >= 0 && order.indexOf(a) < order.indexOf(b);
  ok('the Collection keeps story order: Ranger and Scout before the marks, the road before the van, the lens before the relight, rest after the ending', before('ranger', 'marks') && before('scout', 'marks') && before('road', 'van') && before('lens', 'relight') && before('home', 'rest') && before('watch', 'rest'), order);

  /* ---- the van drives nose first ---- */
  const van = JSON.parse(await E(`(()=>{const o=c3Van,rec=[];c3Van=function(w,r,t,q){rec.push(q&&q.pos?[q.pos[0],q.pos[1],q.pos[2],q.drive|0]:null);return o.apply(this,arguments)};
    const out=[];try{for(const k of Object.keys(C3SCN))for(let i=0;i<C3SCN[k].length;i++){const at=u=>{rec.length=0;c3Play(k);c3q.i=i;c3q.t=C3SCN[k][i].d*u;c3q.tt=i*7+c3q.t;time=50;g.setTransform(2,0,0,2,0,0);draw();c3q=null;state='play';return rec.filter(Boolean)[0]};
      for(const u of [.1,.3,.5,.7,.9]){const a=at(u),b=at(u+.04);if(!a||!b)continue;const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.02)continue;out.push([k,i+1,u,+((dx*Math.cos(a[2])-dz*Math.sin(a[2]))/L).toFixed(2),a[3]])}}}finally{c3Van=o}return JSON.stringify(out)})()`));
  ok('in every shot where the van moves, its nose points the way it is going', van.length >= 9 && van.every(q => q[3] > 0.9), van.filter(q => q[3] <= 0.9).concat([van.length]));
  ok('and whenever it moves, Derek is at the wheel (the job and the pond road)', van.every(q => q[4] === 1) && ['job', 'road'].every(k => van.some(q => q[0] === k)), [...new Set(van.map(q => q[0]))]);

  /* ---- Ranger and Scout: the first hello is a scene ---- */
  for (const [i, key, word] of [[1, 'ranger', 'Two paths'], [2, 'scout', "I'm Scout"]]) {
    await E(`${fresh}const n=npcs[${i}];P.x=n.x;P.y=n.y+14;talk(n);void 0`);
    ok(`${key}: the first talk plays the scene`, await E(`state==='c3'&&c3q.key==='${key}'&&npcs[${i}].st==='new'`), await E('state'));
    await step(20); await shot('scene-' + key); await tap('start'); await step(4);
    ok(`${key}: and it runs straight into the first ask`, await E(`state==='talk'&&npcs[${i}].st==='active'&&JSON.stringify(dlg.pages).includes(${JSON.stringify(word)})`), await E('state+" "+JSON.stringify(dlg&&dlg.pages).slice(0,90)'));
    await E(`state='play';talk(npcs[${i}]);void 0`); ok(`${key}: after that, talking is just talking`, await E(`state==='talk'&&!sceneQ.length`), await E('state'));
    ok(`${key}: a save that has already met them never gets the scene`, await E(`(()=>{${fresh}npcs[${i}].st='active';const o=JSON.parse(JSON.stringify(snap()));restore(o);live=true;state='play';talk(npcs[${i}]);return state==='talk'})()`));
  }
  ok('indoors nobody gets a scene (there is nobody to meet in the house)', await E(`(()=>{${fresh}inHome=true;talk(npcs[1]);const a=state;inHome=false;return a==='talk'})()`));

  /* ---- the pond road ---- */
  await E(`${fresh}run.key=1;openGate(gates[1]);const j=coastGate('jobsite');P.x=j.x+30;P.y=j.y;keyTick();void 0`);
  ok('the key opening the job site queues the road scene, once', await E(`sceneQ.length===1&&sceneQ[0][0]==='3:road'&&(keyTick(),sceneQ.length===1)`), await E('sceneQ.map(q=>q[0])'));
  await step(4); ok('and it plays', await E(`state==='c3'&&c3q.key==='road'`)); await E(`c3q.i=3;c3q.t=2;void 0`); await shot('scene-road'); await tap('start'); await step(3);

  /* ---- the lens ---- */
  const lens = JSON.parse(await E(`(()=>{${fresh}run.call=1;run.leak=1;dayT=DAYLEN*.4;const a=mkItem('trs',HX,HY);a.sub='lens';deliver(a);const day1=sceneQ.map(q=>q[0]).join();
    ${fresh}run.call=1;run.leak=1;dayT=DAYLEN*.85;const b=mkItem('trs',HX,HY);b.sub='lens';deliver(b);return JSON.stringify([day1,sceneQ.map(q=>q[0]).join()])})()`));
  ok('the lens home by day plays its own scene; home after dark it goes straight to the relight', lens[0] === '3:lens' && lens[1] === '3:relight', lens);

  /* ---- Thornback's watch ---- */
  const watch = JSON.parse(await E(`(()=>{${fresh}day=4;run.grubs=true;run.boss=true;tod.raid=0;raidStart();const a=sceneQ.map(q=>q[0]).join();sceneQ.length=0;tod.raid=0;raidStart();const b=sceneQ.length;
    ${fresh}day=4;run.grubs=true;run.boss=false;tod.raid=0;raidStart();return JSON.stringify([a,b,sceneQ.length,foes.filter(e=>e.raid).length])})()`));
  ok('the first dusk Thornback turns a grub away is a scene, never again, and never before he is a friend', watch[0] === '3:watch' && watch[1] === 0 && watch[2] === 0 && watch[3] === 1, watch);

  /* ---- at rest ---- */
  const rest = JSON.parse(await E(`(()=>{${fresh}run.call=1;run.lit=1;run.fin=1;run.finDay=day;const out=[];day+=2;dayT=DAYLEN*.8;coastTick();out.push(sceneQ.length);day+=1;dayT=DAYLEN*.5;coastTick();out.push(sceneQ.length);dayT=DAYLEN*.8;coastTick();out.push(sceneQ.length&&sceneQ[0][0],run.rest|0);coastTick();out.push(sceneQ.length);
    ${fresh}run.call=1;run.lit=1;run.fin=1;run.finDay=day;for(let k=0;k<4;k++){newDay0();out.push(run.rest|0)}out.push(sceneQ.length);return JSON.stringify(out)})()`));
  ok('the North Light rests at dusk on the third night, in a scene; a keeper who sleeps through it is told in the morning instead', rest.join() === '0,0,3:rest,1,1,0,0,0,1,0', rest);

  /* ---- the van after dark ---- */
  const vq = `const Q=()=>{const a=sceneQ.map(q=>q[0].slice(2)).join();sceneQ.length=0;return a||('say:'+(/[A-Z]/.test(msg)?1:0))};`;
  const eggs = JSON.parse(await E(`(()=>{${fresh}${vq}npcs[3].st='active';const out=[];
    day=3;tod.rain=0;tod.berries=0;dayT=DAYLEN*.7;vanUse();out.push(Q());         /* first evening: the session */
    msg='';vanUse();out.push(Q(),run.seshDay);                                        /* same evening: only a line */
    day=4;tod.berries=12;vanUse();out.push(Q());                                      /* a ten berry day: Marcus ate one */
    tod.berries=0;vanUse();out.push(Q());                                             /* an evening after the session: who is it */
    msg='';vanUse();out.push(Q());                                                    /* all seen: a line */
    tod.rain=1;dayT=DAYLEN*.3;vanUse();out.push(Q());tod.rain=1;vanUse();out.push(Q().slice(0,3));   /* rain, any hour: the fog, once; after that the day goes on as usual */
    return JSON.stringify(out)})()`));
  ok('first evening at the van is the session; knocking again that night is only a line', eggs[0] === 'sesh' && eggs[1] === 'say:1' && eggs[2] === 3, eggs.slice(0, 3));
  ok('a ten-berry day brings the eleventh berry; a later evening brings "who is it"; then lines', eggs[3] === 'munch' && eggs[4] === 'knock' && eggs[5] === 'say:1', eggs.slice(3, 6));
  ok('in the rain the van is the driest place in the valley, once', eggs[6] === 'fog' && eggs[7] !== 'fog', eggs.slice(6));
  ok('"who is it" waits for a night after the session: Will has to have been in the van first', await E(`(()=>{${fresh}npcs[3].st='active';day=3;tod.rain=0;tod.berries=0;dayT=DAYLEN*.7;run.egg.sesh=1;run.seshDay=3;vanUse();const a=sceneQ.length;day=4;vanUse();return a===0&&sceneQ.length===1&&sceneQ[0][0]==='3:knock'})()`));
  ok('none of it before Will has met Marcus: the first A at the van is the meeting', await E(`(()=>{${fresh}dayT=DAYLEN*.7;tod.rain=1;vanUse();return state==='c3'&&c3q.key==='van'})()`));

  /* ---- a new game starts clean ---- */
  ok('a scene queued in one game does not follow Will into the next', await E(`(()=>{${fresh}egg('fog');const a=sceneQ.length;init();return a===1&&sceneQ.length===0})()`));

  /* ---- each new scene, start to finish on its own clock ---- */
  for (const k of NEW) {
    await E(`${fresh}run.boss=true;won=true;run.pjSeen={};PJ.forEach(p=>run.pjSeen[p.id]=1);window.__done=0;c3Play('${k}',()=>{window.__done=1});void 0`);
    const n = await E(`C3SCN.${k}.length`); let seen = new Set(), frames = 0, minCols = 1e9;
    for (; frames < 1500 && (await E('state')) === 'c3'; frames++) {
      const i = await E('c3q.i'); if (!seen.has(i)) {
        seen.add(i); await step(18); if ((await E('state')) !== 'c3') break;
        const cols = await E(`(()=>{g.setTransform(2,0,0,2,0,0);draw();const s=new Set();for(let q=0;q<c3px.length;q+=97)s.add(c3px[q]);return s.size})()`); minCols = Math.min(minCols, cols);
        if (k === 'knock' && i === 3) await shot('scene-knock'); if (k === 'fog' && i === 1) await shot('scene-fog'); if (k === 'munch' && i === 1) await shot('scene-munch'); if (k === 'watch' && i === 1) await shot('scene-watch'); if (k === 'lens' && i === 0) await shot('scene-lens'); if (k === 'rest' && i === 0) await shot('scene-rest');
      }
      await tap('a'); await step(6);
    }
    ok(`${k}: all ${n} shots play, each a real picture, and it ends back in the valley`, seen.size === n && minCols > 12 && (await E('state')) === 'play' && (await E('window.__done')) === 1 && await E(`c3SeenScene('${k}')`), [seen.size, minCols, await E('state')]);
  }

  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
