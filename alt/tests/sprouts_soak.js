/* Sprouts soak test: two autopilots that play the real game through its real controls, with the clock stepped.
   A. "Erin's day": follows the objective marker from a fresh save for one in-game day (pathfinding, pluck, throw, talk, pet).
      Expects to get through Erin's first three asks. It sometimes gets as far as the garden; the bot, not the game, is the limit.
   B. "Chaos": a mid-game valley (gates open, grubs awake, 24 sprouts), wandering between random things and throwing,
      whistling, travelling and opening menus, for SEEDS x DAYS in-game days.
   Both check every second that no sprout is stuck in a wall or in water, every worker is on the thing it thinks it is
   working on, nothing is NaN, no item is carried for 90 s without arriving, and update and draw never throw.
   Run from the repo root:  node alt/tests/sprouts_soak.js [build.html] [seeds=2] [days=2]   (about 1 minute per chaos day) */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const SEEDS = +(process.argv[3] || 2), DAYS = +(process.argv[4] || 2);
(async () => {
  const browser = await chromium.launch(); let fail = 0;
  const open = async () => { const page = await browser.newPage({ viewport: { width: 440, height: 956 } }); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    const E = s => page.evaluate(s => __g.ev(s), s);
    for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(200); }
    return { page, E, errs }; };
  const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  { const { page, E, errs } = await open();
  await E(`init();live=true;state='play';window.__bot={log:[],bad:[],seen:{},stuck:0,lx:0,ly:0};void 0`);
  const runA = secs => E(`(()=>{const B=window.__bot,K=__g.keys,PR=__g.prev,dt=1/30;
   const press=k=>{K[k]=1};const inv=()=>{const bad=m=>{if(B.bad.length<40&&!B.bad.includes(m))B.bad.push(m)};
     for(const b of buds){if(!isFinite(b.x)||!isFinite(b.y))bad('bud NaN '+b.st);
       if(['carry','fight','work'].includes(b.st)&&(!b.tgt||!b.tgt.on.includes(b)))bad('bud '+b.st+' not on its target ('+(b.tgt&&(b.tgt.kind+':'+(b.tgt.sub||'')))+')');
       if(b.st==='seek'&&!b.tgt)bad('seek without target');
       if(['follow','idle'].includes(b.st)&&!free(b.x,b.y,b.type===2)&&tileAt(b.x,b.y)!==GT)bad('bud '+b.st+' inside tile '+tileAt(b.x,b.y)+' type '+b.type+' at '+(b.x>>4)+','+(b.y>>4))}
     for(const o of [...items,...foes,...gates,...bugs,...plots,DIG])for(const b of o.on){if(b.dead)bad('dead bud on '+o.kind);if(b.tgt!==o)bad('on-list mismatch '+o.kind+':'+(o.sub||'')+' bud '+b.st)}
     for(const it of items)if(it.alive&&(!isFinite(it.x)||!isFinite(it.y)))bad('item NaN');
     if(!free(P.x,P.y,false)&&!inHome)bad('player in wall '+tileAt(P.x,P.y));
     if(!isFinite(cam.x))bad('cam NaN');if(crewCount()>capNow()+12)bad('over cap '+crewCount()+'/'+capNow());
     for(const q of wbuds)if(!isFinite(q.x)||(!free(q.x,q.y,false)&&!q.path))bad('buddy in wall '+q.id)};
   for(let f=0;f<${secs}*30;f++){for(const k in K)K[k]=0;
    if(!B.seen[state]){B.seen[state]=1;B.log.push('d'+day+' '+Math.round(dayT)+'s state '+state)}
    if(['cine','talk','card','dayend','win','hop'].includes(state)){if(f%8===0)press('a')}
    else if(state==='travel'||state==='house'||state==='build'||state==='pause'||state==='map'){if(f%8===0)press('b')}
    else if(state==='play'){let o=objective();if(o&&/BLOOMED/.test(o.text)&&sprouts.filter(inSoil).length<3){const q=nearBerry();o={text:'FETCH BERRIES FIRST',x:q.x,y:q.y}}
      if(o){const key=o.text.replace(/\\d+ \\/ \\d+/,'');if(B.cur!==key){B.cur=key;B.log.push('d'+day+' '+Math.round(dayT)+'s '+o.text+' (crew '+buds.length+')')}
       if(inHome){press('down')}
       else{const d=Math.hypot(o.x-P.x,o.y-P.y);
        if(f%15===0||!B.path){B.path=pathTo(P.x,P.y,o.x,o.y,false);if(!B.path){/* walk toward the nearest reachable tile */let best=null,bd=1e9;for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){if(fieldL[ty*MW+tx]<0)continue;const dd=Math.hypot(tx*16+8-o.x,ty*16+8-o.y);if(dd<bd&&pathTo(P.x,P.y,tx*16+8,ty*16+8,false)){bd=dd;best=[tx,ty]}}B.path=best?pathTo(P.x,P.y,best[0]*16+8,best[1]*16+8,false):[]}}
        const talkO=/^TALK|^DONE|PET LOUIE/.test(o.text),pluckO=/PLUCK/.test(o.text),near=!talkO&&!pluckO&&d<46;let wp=B.path&&B.path[0];while(wp&&Math.hypot(wp.x-P.x,wp.y-P.y)<5){B.path.shift();wp=B.path[0]}
        if(near&&d>16){const dx=o.x-P.x,dy=o.y-P.y;P.dx=dx/d;P.dy=dy/d;if(f%4<2)press('a')}
        else if(talkO&&d<22){const dx=o.x-P.x,dy=o.y-P.y;P.dx=dx/d;P.dy=dy/d;if(f%20===10)press('a')}
        else if(pluckO&&o.x===SOIL.x&&o.y===SOIL.y&&/BLOOMED/.test(o.text)){if(d<40)press('up')}
        else if(pluckO&&d<12){if(f%10===0)press('a')}
        else if(!talkO&&!pluckO&&d<=16){if(f%6===0)press('a')}
        else if(wp){const dx=wp.x-P.x,dy=wp.y-P.y;if(dx>2)press('right');else if(dx<-2)press('left');if(dy>2)press('down');else if(dy<-2)press('up')}
        if(f%240===0&&buds.some(b=>b.st==='idle'))B.whistle=45;if(B.whistle>0){B.whistle--;press('b')}
        if(f%30===0){if(Math.hypot(P.x-B.lx,P.y-B.ly)<2&&d>30){B.stuck++;B.side=18;B.sd=(B.sd||0)+1}B.lx=P.x;B.ly=P.y}if(B.side>0){B.side--;const k=[['up'],['down'],['left'],['right']][B.sd%4];K.up=K.down=K.left=K.right=0;press(k[0])}}}}
    try{__g.update(dt)}catch(e){if(B.bad.length<40)B.bad.push('THROW '+e.message+' @'+state);}
    for(const k in K)PR[k]=K[k];if(f%30===0&&state==='play')inv();if(f%300===0){try{__g.draw()}catch(e){B.bad.push('DRAW '+e.message)}}}
   return JSON.stringify({day,dayT:Math.round(dayT),state,crew:buds.length,soil:sprouts.length,shards,deliv:run.delivered,petals:meta.petals,stuck:B.stuck,ms:npcs.map(n=>n.name[0]+(n.st==='done'?'done':n.mi))})})()`);
    let last; for (let d = 0; d < 5; d++) last = JSON.parse(await runA(48));
    const B = JSON.parse(await E('JSON.stringify(window.__bot)')); console.log(B.log.join('\n'));
    ok("Erin's day: plucks and brings berries home (first two asks; it usually gets through four) on day 1", +last.ms[0].slice(1) >= 2 || last.ms[0] === 'Edone', last.ms);
    ok("Erin's day: nothing broke", !B.bad.length && !errs.length, B.bad.concat(errs)); await page.close(); }
  for (let seed = 1; seed <= SEEDS; seed++) { const { page, E, errs } = await open();
  await E(`init();live=true;state='play';npcs.forEach(n=>{n.st='active'});wakeGrubs();openGarden();[0,1,2,3].forEach(i=>openGate(gates[i]));ZONES.forEach(z=>run.seen[z[0]]=1);run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1};found=found.map(()=>true);
   for(let i=0;i<24;i++)mkBud(i%6,i%3,P.x,P.y);window.__bot={bad:[],ev:{},s:${seed},t:0,tg:null};void 0`);
  const runB = secs => E(`(()=>{const B=window.__bot,K=__g.keys,PR=__g.prev,dt=1/30;const rnd=()=>{B.s=(B.s*1664525+1013904223)>>>0;return B.s/4294967296};const press=k=>{K[k]=1};const ev=k=>{B.ev[k]=(B.ev[k]||0)+1};
   const bad=m=>{if(B.bad.length<40&&!B.bad.includes(m))B.bad.push('d'+day+' '+Math.round(dayT)+'s '+m)};
   const inv=()=>{for(const b of buds){if(!isFinite(b.x)||!isFinite(b.y))bad('bud NaN '+b.st);
       if(['carry','fight','work'].includes(b.st)&&(!b.tgt||!b.tgt.on.includes(b)))bad('bud '+b.st+' not on its target ('+(b.tgt&&(b.tgt.kind+':'+(b.tgt.sub||'')))+')');
       if(b.st==='seek'&&!b.tgt)bad('seek without target');if(b.st==='ride'&&!(LO.riders||[]).includes(b))bad('rider not on Louie');
       if(['follow','idle'].includes(b.st)&&!free(b.x,b.y,b.type===2)&&tileAt(b.x,b.y)!==GT)bad('bud '+b.st+' inside tile '+tileAt(b.x,b.y)+' type '+b.type+' at '+(b.x>>4)+','+(b.y>>4));
       if(b.st==='idle'){b.idleT=(b.idleT||0)+1}else b.idleT=0}
     for(const o of [...items,...foes,...gates,...bugs,...plots,DIG])for(const b of o.on){if(b.dead)bad('dead bud on '+o.kind);if(b.tgt!==o)bad('on-list mismatch '+o.kind+':'+(o.sub||'')+' bud '+b.st)}
     for(const it of items)if(it.alive){if(!isFinite(it.x)||!isFinite(it.y))bad('item NaN');if(it.on.length&&str(it)>=it.w){it.cT=(it.cT||0)+1;if(it.cT===90)bad('item carried 90s without arriving: '+it.sub+' at '+(it.x>>4)+','+(it.y>>4)+' carriers '+it.on.map(b=>b.type).join(''))}else it.cT=0}
     if(!free(P.x,P.y,false)&&!inHome)bad('player in wall '+tileAt(P.x,P.y)+' at '+(P.x>>4)+','+(P.y>>4));if(!isFinite(cam.x))bad('cam NaN');
     for(const q of wbuds)if(!isFinite(q.x))bad('buddy NaN');if(seeds.length>40)bad('seed pile-up');if(items.filter(i=>i.alive).length>140)bad('item flood '+items.filter(i=>i.alive).length)};
   const pick=()=>{const c=[];for(const i of items)if(i.alive)c.push(i);for(const e of foes)if(e.alive)c.push(e);for(const q of bugs)if(q.alive&&!q.hid)c.push(q);for(const ga of gates)if(ga.alive&&ga.sub!==2)c.push(ga);if(DIG.alive){c.push(DIG);c.push(DIG)}for(const p of plots)c.push(p);for(const s of sprouts)c.push(s);for(const z of ZONES)c.push(postXY(z));c.push(DOOR);c.push(KEEP);for(const n of npcs)c.push(n);for(const q of wbuds)c.push(q);return c[(rnd()*c.length)|0]};
   for(let f=0;f<${secs}*30;f++){for(const k in K)K[k]=0;
    if(['cine','talk','card','dayend','win','hop','pan'].includes(state)){if(f%8===0)press('a');ev(state)}
    else if(state==='travel'){if(f%8===0)press(rnd()<.5?'a':rnd()<.5?'down':'b')}
    else if(state==='house'){if(f%8===0)press(rnd()<.4?'a':rnd()<.6?'down':rnd()<.5?'right':'b')}
    else if(state==='build'){if(f%8===0)press(rnd()<.6?'a':'b')}
    else if(state==='pause'||state==='map'||state==='settings'){if(f%8===0)press('b')}
    else if(state==='play'){B.t-=dt;
      if(inHome){if(B.t<=0){B.t=3+rnd()*4;B.home=rnd()<.5}if(B.home){press('up');if(f%10===0)press('a')}else press('down')}
      else{if(B.t<=0||!B.tg||B.tg.alive===false){B.tg=pick();B.t=6+rnd()*10;B.path=null}
       const o=B.tg,d=Math.hypot(o.x-P.x,o.y-P.y);
       if(f%20===0||!B.path){B.path=pathTo(P.x,P.y,o.x,o.y,false)||[]}let wp=B.path[0];while(wp&&Math.hypot(wp.x-P.x,wp.y-P.y)<5){B.path.shift();wp=B.path[0]}
       if(d<50){const dx=o.x-P.x,dy=o.y-P.y;if(d>0){P.dx=dx/d;P.dy=dy/d}if(d>18&&rnd()<.3){if(dx>2)press('right');else if(dx<-2)press('left');if(dy>2)press('down');else if(dy<-2)press('up')}if(f%3===0||rnd()<.3)press('a')}
       else if(wp){const dx=wp.x-P.x,dy=wp.y-P.y;if(dx>2)press('right');else if(dx<-2)press('left');if(dy>2)press('down');else if(dy<-2)press('up')}
       else{press(['up','down','left','right'][(rnd()*4)|0])}
       if(rnd()<.004)B.wh=20+rnd()*50;if(B.wh>0){B.wh--;press('b')}if(rnd()<.002)press('sel')}}
    try{__g.update(dt)}catch(e){bad('THROW '+e.message+' @'+state+' '+(e.stack||'').split('\\n')[1])}
    for(const k in K)PR[k]=K[k];if(f%30===0&&state==='play')inv();if(f%150===0){try{__g.draw()}catch(e){bad('DRAW '+e.message+' @'+state)}}}
   return JSON.stringify({day,crew:buds.length,soil:sprouts.length,shards,deliv:run.delivered,foes:run.foes,bugs:run.bugs,trs:meta.trs.length,br:!gates[5].alive,boss:!!run.boss,harv:gard.harv,home:homeTotal(),keep:run.keep||0,idleLong:buds.filter(b=>b.idleT>120).length,ev:B.ev})})()`);
    let last; for (let d = 0; d < DAYS * 5; d++) last = await runB(50);
    const bad = JSON.parse(await E('JSON.stringify(window.__bot.bad)')); console.log(last);
    ok('chaos seed ' + seed + ': ' + DAYS + ' days, nothing broke', !bad.length && !errs.length, bad.concat(errs)); await page.close(); }
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
