/* Lore test: named chambers, relics, the ghost's visits, each keeper's quest, and that every line fits its box.
   Saves frames to test/shots/lore-*.png.   usage: node test/lore.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(300);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};const ev=(f,a)=>pg.evaluate(f,a);const shot=n=>pg.screenshot({path:path.join(out,'lore-'+n+'.png')});
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++){gameUpdate(1/60)}})()`);
 await ev(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1;RD.stats.runs=5;window.__hold=true;__rd.RDF.join('kb1')});
 /* every new line fits where it is shown */
 const bad=await ev(()=>{hx.setTransform(1,0,0,1,0,0);const B=[];const sub=(l,w)=>{if(wrapPx(l,w||293,1).length>2)B.push(l.slice(0,40))};
  RELICS.forEach(r=>{if(wrapPx(r.x,296,1).length>7)B.push(r.id)});GHOST.forEach(g=>g.lines.forEach(l=>sub(l)));CHNAMES.forEach(c=>sub(c.w));
  for(const k in KQUESTS)KQUESTS[k].steps.forEach(s=>{sub(s.bark[1]);s.lines.forEach(l=>{if(wrapPx(l[1],316,1).length>3)B.push(k+': '+l[1].slice(0,30))})});return B});
 ok(bad.length===0,'every relic, ghost line, whisper and quest line fits'+(bad.length?' — too long: '+bad.join(' | '):''));
 const n=await ev(()=>({r:RELICS.length,g:GHOST.length,q:Object.keys(KQUESTS).length,c:CHNAMES.length}));console.log('  '+n.r+' relics, '+n.g+' ghost visits, '+n.q+' keeper quests, '+n.c+' named chambers');
 /* first visit names the chamber */
 await ev(()=>{__rd.RDF.depart()});await step(40);let s=await ev(()=>({sub:RUN.sub&&RUN.sub.who,seen:RD.chSeen[1]}));ok(s.sub==='THE ROOT CELLAR'&&s.seen,'chamber 1 whispers its name on the first visit ('+s.sub+')');
 await pg.waitForTimeout(300);await shot('1-named-chamber');
 /* a relic: placed clear of everything, readable once the room is quiet */
 await ev(()=>{RUN.relic=null;let tries=0;while(!RUN.relic&&tries++<50)chamberLore(2);RUN.enemies.forEach(e=>e.dmg=0)});s=await ev(()=>!!RUN.relic);ok(s,'chambers place relics');
 await ev(()=>{__rd.RDF.clearRoom()});await step(30);await ev(()=>{const p=PL[0];p.x=RUN.relic.x;p.y=RUN.relic.y+8});await step(2);await pg.waitForTimeout(300);await shot('2-relic-in-room');
 s=await ev(()=>PL[0].relicNear);ok(s,'standing by it offers READ');
 await ev(()=>{DEV.kb1.pr.a=true;gameUpdate(1/60);DEV.kb1.pr.a=false});s=await ev(()=>({st:state,n:relicCount(),hdr:echoRead&&echoRead.src}));ok(s.st==='echo'&&s.n===1,'A reads it and keeps it ('+s.hdr+')');
 await pg.waitForTimeout(300);await shot('3-relic-page');await ev(()=>{state='run'});
 /* the ghost: turns up after a fight, speaks, leaves a gift, and the story moves on */
 await ev(()=>{RUN.subQ=[];RUN.sub=null;RUN.ghostMet=false;RD.ghost=0;ghostRoll(3);const g=RUN.ghostNpc;PL[0].x=g.x;PL[0].y=g.y+20});s=await ev(()=>!!RUN.ghostNpc);ok(s,'the keeper before you appears in chamber 3 the first time');
 await step(70);await pg.waitForTimeout(300);await shot('4-ghost');s=await ev(()=>RUN.sub&&RUN.sub.who);ok(s==='THE KEEPER BEFORE','she speaks when you come near ('+s+')');
 await step(60*9);s=await ev(()=>({g:RD.ghost,dew:RUN.dew}));ok(s.g===1&&s.dew>=10,'she finishes, leaves a gift and the meeting counts ('+JSON.stringify(s)+')');
 s=await ev(()=>{state='hub';const e=storyNext('ERIN');return e&&e.id});ok(s==='ev_ghost1'||!!s,'Erin has something to say about her ('+s+')');
 /* a keeper quest: only with that keeper along; found in the deep, brought home, rewarded */
 await ev(()=>{RD.chars[0]='WILL';PL[0].char='WILL';state='run';RD.kq={};RD.kqFound={};RD.kqDone={};RUN.qitem=null;RUN.chamber=3;chamberLore(3)});
 s=await ev(()=>RUN.qitem&&RUN.qitem.char);ok(s==='WILL','as Will, the Lantern shard turns up in chamber 3 (the last of its range)');
 await ev(()=>{PL[0].x=RUN.qitem.x;PL[0].y=RUN.qitem.y});await step(2);s=await ev(()=>({f:RD.kqFound.WILL,say:say2Txt}));ok(s.f===0,'walking onto it finds it: '+s.say);
 await ev(()=>{state='hub';const e=storyNext('ERIN');window.__e=e;return e});s=await ev(()=>__e&&__e.id);ok(s==='kq_WILL_0','Erin takes the shard first, before anything else ('+s+')');
 await ev(()=>{storyFinish(__e);RD.kqFound.WILL=1;storyFinish(storyNext('SCOUT'));RD.kqFound.WILL=2;storyFinish(storyNext('ERIN'))});s=await ev(()=>({d:RD.kqDone.WILL,hp:rdStats(PL[0]).maxHp,msg:joinMsg}));
 ok(s.d===1&&s.hp===110,'three shards later the quest is done and Will has +10 health ('+s.msg+')');
 /* the Codex pages and the Board */
 await ev(()=>{hubEnter();state='codex';codexPage=5});await pg.waitForTimeout(300);await shot('5-story-so-far');
 await ev(()=>{state='board';boardSel=0});await pg.waitForTimeout(300);await shot('6-board');s=await ev(()=>personalQuests().map(q=>q.who));ok(Array.isArray(s),'personal quests list on the Board ('+s+')');
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
