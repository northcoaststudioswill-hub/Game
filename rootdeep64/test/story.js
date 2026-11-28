/* Story test: missions asked and turned in, conversations firing off real progress, echoes, barks.
   Saves frames to test/shots/story-*.png.   usage: node test/story.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');require('fs').mkdirSync(out,{recursive:true});
 const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(400);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};const ev=(f,a)=>pg.evaluate(f,a);
 const tap=async(k,ms=60)=>{await pg.keyboard.down(k);await pg.waitForTimeout(ms);await pg.keyboard.up(k);await pg.waitForTimeout(90)};
 const shot=n=>pg.screenshot({path:path.join(out,'story-'+n+'.png')});
 const stand=who=>ev(who=>{const n=HUBNPC[who];n.wait=99;n.x=140;n.y=120;PL[0].x=140;PL[0].y=132;for(const w of NPCS)if(w!==who){HUBNPC[w].wait=99;HUBNPC[w].x=40+NPCS.indexOf(w)*50;HUBNPC[w].y=70}},who);
 await ev(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1;__rd.RDF.start()});
 /* every text line must fit the dialogue box (3 wrapped lines) */
 const long=await ev(()=>{hx.setTransform(1,0,0,1,0,0);const bad=[];const chk=(id,L)=>L.forEach(l=>{if(wrapPx(l[1],316,1).length>3)bad.push(id+': '+l[1].slice(0,40))});
  MISSIONS.forEach(m=>{chk(m.id,m.ask);chk(m.id,m.done)});EVENTS.forEach(e=>chk(e.id,e.lines));ECHOES.forEach(e=>{if(wrapPx(e.x,296,1).length>7)bad.push(e.id)});
  Object.keys(GODSAY).forEach(g=>GODSAY[g].forEach(l=>{if(wrapPx('"'+l+'"',420,1).length>2)bad.push(g+': '+l.slice(0,30))}));return bad});
 ok(long.length===0,'every line fits its box'+(long.length?' — too long: '+long.join(' | '):''));
 const counts=await ev(()=>({m:MISSIONS.length,e:EVENTS.length,x:ECHOES.length}));console.log('  '+counts.m+' missions, '+counts.e+' conversations, '+counts.x+' echoes');
 /* Erin asks */
 let s=await ev(()=>__rd.RDF.story('ERIN'));ok(s==='mt_e1','fresh save: Erin has a mission to ask ('+s+')');
 await stand('ERIN');await pg.waitForTimeout(500);await shot('01-marker');
 await tap('KeyZ');await pg.waitForTimeout(300);await shot('02-ask');
 s=await ev(()=>({st:state,who:talkWho,ev:talkEv&&talkEv.id}));ok(s.st==='talk'&&s.ev==='mt_e1','talking to her plays the ask, not small talk');
 await tap('KeyZ');s=await ev(()=>({st:state,f:RD.flags.mt_e1,msg:joinMsg}));ok(s.st==='hub'&&s.f===1,'accepted: "'+s.msg+'"');
 s=await ev(()=>__rd.RDF.story('ERIN'));ok(s===null,'nothing new from Erin until something happens');
 await tap('KeyZ');s=await ev(()=>({ev:talkEv,t:talkTxt}));ok(!s.ev&&s.t.length>0,'so she falls back to the cartridge\'s own lines');await tap('KeyX');
 /* the board */
 await ev(()=>{PL[0].x=BOARD.x;PL[0].y=BOARD.y});await pg.waitForTimeout(150);await tap('KeyZ');await pg.waitForTimeout(250);await shot('03-board');
 s=await ev(()=>state);ok(s==='board','the Keeper\'s Board opens');await tap('KeyX');
 /* go do it: Grub Mother, with her lines, and an echo */
 await ev(()=>{__rd.RDF.depart();__rd.RDF.goto(4);PL[0].inv=99});await pg.waitForTimeout(2600);await shot('04-boss-intro');
 s=await ev(()=>RUN.sub&&RUN.sub.who);ok(s==='GRUB MOTHER','the boss gets an intro line ('+s+')');
 await ev(()=>{__rd.RDF.clearRoom()});await pg.waitForTimeout(1200);s=await ev(()=>({e:!!RUN.echo,say:say2Txt}));ok(s.e,'a boss always leaves an echo the first time');
 await ev(()=>{PL[0].x=RUN.echo.x;PL[0].y=RUN.echo.y});await pg.waitForTimeout(700);await shot('05-echo');
 s=await ev(()=>({st:state,n:Object.keys(RD.echo).length}));ok(s.st==='echo'&&s.n===1,'walking onto it opens the page and keeps it');await tap('KeyZ');
 await ev(()=>{__rd.RDF.forceBoon('LEAF')});await pg.waitForTimeout(300);await shot('06-god');s=await ev(()=>boonQuote);ok(s.length>10,'the god says something: '+s.slice(0,44)+'...');
 await ev(()=>{state='run';rdAbandon();hubEnter()});
 /* turn it in */
 s=await ev(()=>__rd.RDF.story('ERIN'));ok(s==='md_e1','back home, Erin has the turn-in waiting ('+s+')');
 const dew0=await ev(()=>RD.dew);await stand('ERIN');await pg.waitForTimeout(300);await tap('KeyZ');await tap('KeyZ');await tap('KeyZ');await pg.waitForTimeout(200);await shot('07-turnin');await tap('KeyZ');
 s=await ev(()=>({d:RD.dew,m:RD.msn.e1,next:__rd.RDF.story('ERIN')}));ok(s.m===1&&s.d===dew0+25,'mission paid +25 Moondew');ok(s.next==='mt_e2','and the next link in her chain opens ('+s.next+')');
 /* others reacted to the same thing */
 s=await ev(()=>({sc:__rd.RDF.story('SCOUT'),ra:__rd.RDF.story('RANGER'),ma:__rd.RDF.story('MARCUS')}));ok(!!s.sc&&!!s.ma,'Scout and Marcus have things to say too ('+s.sc+', '+s.ma+')');
 /* drain every NPC until quiet, then cause things and check new beats appear */
 const drain=()=>ev(()=>{let n=0;for(const w of NPCS){let e;while((e=storyNext(w))&&n<200){storyFinish(e);n++}}return n});
 let n=await drain();ok(n>3,'drained '+n+' pending beats');
 await ev(()=>{RD.stats.deaths=1;RD.diedTo.hollow=1;RD.seen.hollow=1});await drain();s=await ev(()=>Object.keys(RD.flags).filter(k=>k.startsWith('ev_')));ok(s.includes('ev_hollow_died')&&s.includes('ev_death1'),'dying to the Hollow Keeper set off its conversations ('+s.length+' played so far)');
 await drain();await ev(()=>{RD.stats.escapes=3;RD.stats.maxCh=12;RD.bossK.king=1;RD.bossK.hollow=3;for(const e of ECHOES)RD.echo[e.id]=1;RD.stats.budsBanked=20});n=await drain();
 s=await ev(()=>({bloom:RD.flags.bloom,done:MISSIONS.filter(m=>RD.msn[m.id]).length}));ok(s.bloom===1,'three escapes and Erin\'s chain ends: the Hearth blooms ('+n+' beats, '+s.done+' missions done)');
 await ev(()=>{hubEnter()});await pg.waitForTimeout(500);await shot('08-bloom');
 await ev(()=>{uiSel=0;codexPage=3;echoSel=0;state='codex'});await pg.waitForTimeout(250);await shot('09-codex');
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
