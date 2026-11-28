/* Episodes test: the first-keeper choice, every episode plays and fits, triggers after a run, unlocks, Codex replay.
   Saves frames to test/shots/ep-*.png.   usage: node test/episodes.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(300);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};const ev=(f,a)=>pg.evaluate(f,a);const shot=n=>pg.screenshot({path:path.join(out,'ep-'+n+'.png')});
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++){gameUpdate(1/60)}})()`);
 const press=async b=>{await ev(b=>{DEV.kb1.pr[b]=true;gameUpdate(1/60);DEV.kb1.pr[b]=false},b)};
 await ev(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1;window.__hold=true;__rd.RDF.join('kb1');hubEnter()});
 console.log('the first keeper');
 let s=await ev(()=>CHARS.map(c=>charUnlocked(c.id)));ok(s.every(Boolean),'a new save can pick any keeper first');
 await ev(()=>{charsEnter();PL[0].csel=1});await pg.waitForTimeout(300);await shot('0-first-pick');
 await press('a');await step(3);s=await ev(()=>({st:state,start:RD.starter,open:RD.open,c:PL[0].char}));ok(s.st==='run'&&s.start==='ERIN'&&s.c==='ERIN','picking Erin starts the run as Erin ('+JSON.stringify(s)+')');
 s=await ev(()=>CHARS.map(c=>c.id+':'+charUnlocked(c.id)).join(' '));ok(/ERIN:true/.test(s)&&/WILL:false/.test(s)&&/MARCUS:false/.test(s),'after that, the others are locked: '+s);
 s=await ev(()=>{rdAbandon();hubEnter();return PL[0].char});ok(s==='ERIN','home again, you are still Erin');
 s=await ev(()=>charLockTxt('WILL'));ok(/CHAMBER 4/.test(s),'Will has his own way home: '+s);
 console.log('every episode');
 s=await ev(()=>{hx.setTransform(1,0,0,1,0,0);const B=[];EPISODES.forEach((E,i)=>{for(const K of['WILL','ERIN','LOUIE','MARCUS']){const e=epBuild(i,K);for(const b of e.beats)if(b.txt&&wrapPx(b.txt,262,1).length>3)B.push(E.id+'/'+K+': '+b.txt.slice(0,30))}});return B});
 ok(s.length===0,'every line fits the box at phone width'+(s.length?' — too long: '+s.join(' | '):''));
 s=await ev(()=>EPISODES.length);console.log('  '+s+' episodes');
 const shots={home1:1,un_WILL:1,mother:1,king:1,kills500:1,escape1:1,split:1,un_LOUIE:1};
 for(let i=0;i<s;i++){const id=await ev(i=>{RD.stats.runs=3;PL[0].char='WILL';epStart(i,'hub');return EPI.E.id},i);let n=await ev(()=>EPI.beats.length);
  for(let b=0;b<n;b++){await ev(b=>{EPI.b=b;EPI.t=1.6},b);await pg.waitForTimeout(40)}
  if(shots[id]){await ev(()=>{EPI.b=Math.min(2,EPI.beats.length-1);EPI.t=2.5});await pg.waitForTimeout(250);await shot((i+1)+'-'+id)}
  await ev(()=>{EPI.b=EPI.beats.length-1;EPI.t=99;epUpdate(0)});const st=await ev(()=>state);if(st!=='hub')ok(false,id+' ends back home ('+st+')')}
 ok(errs.length===0,'all of them play through, every beat drawn, without an error');
 await ev(()=>{epStart(0,'hub');EPI.b=0;EPI.t=.8});await pg.waitForTimeout(250);await shot('0-title');await ev(()=>{epEnd()});
 console.log('when they play');
 s=await ev(()=>{RD.ep={};RD.open={ERIN:1};RD.stats.deaths=1;RD.stats.kills=0;RD.stats.maxCh=1;RD.flags.split=0;RD.gift={};RD.stats.escapes=0;RD.bossK={};RD.mirror={};state='over';overT=2;RD.stats.supers=0;RD.stats.coopRuns=0;RD.relic={};return 1});
 await press('a');s=await ev(()=>({st:state,id:EPI&&EPI.E.id}));ok(s.st==='ep'&&s.id==='home1','coming home after your first death plays BACK IN BED ('+s.id+')');
 s=await ev(()=>EPI.beats.filter(b=>b.who).map(b=>b.who));ok(!s.includes('ERIN')||s.filter(w=>w==='ERIN').length===1,'as Erin, Erin plays herself and her other lines drop: '+s.join(','));
 await press('start');s=await ev(()=>state);ok(s==='hub','START skips it');
 s=await ev(()=>{state='over';overT=2;window.__rnd0=Math.random;Math.random=()=>.99;return 1});await press('a');s=await ev(()=>{Math.random=window.__rnd0;return state});ok(s==='hub','a milestone episode only plays once');
 s=await ev(()=>{RD.stats.maxCh=4;state='over';overT=2;return 1});await press('a');s=await ev(()=>({st:state,id:EPI&&EPI.E.id}));ok(s.id==='un_WILL','reaching chamber 4 brings Will home ('+s.id+')');
 await ev(()=>{EPI.b=EPI.beats.length-1;EPI.t=.9});await pg.waitForTimeout(250);await shot('card-will');
 await ev(()=>{EPI.b=EPI.beats.length-1;EPI.t=99;epUpdate(0)});s=await ev(()=>({o:RD.open.WILL,u:charUnlocked('WILL')}));ok(s.o&&s.u,'and he can be chosen after');
 console.log('after a fall');
 s=await ev(()=>{RD.lastRun={chamber:5,biome:1,kills:12,killer:'crab',by:'deep',time:200,co:[{char:'ERIN'}],dew:5,heat:0};RD.rndLast=[];const n={};for(let i=0;i<300;i++){const j=epDeathPick(true);const id=EPISODES[j].id;n[id]=(n[id]||0)+1}return n});
 const top=Object.entries(s).sort((a,b)=>b[1]-a[1]);ok(top[0][0]==='r_crab','killed by a crab: the crab scene is the likeliest ('+top.slice(0,4).map(t=>t.join(':')).join(' ')+')');
 ok(!s.r_lobby&&!s.r_king&&!s.r_zero,'and scenes that do not fit never come up');
 s=await ev(()=>{RD.rndLast=[];const seen=[];for(let k=0;k<8;k++){Math.random0=Math.random0||Math.random;Math.random=()=>.1;state='over';overT=2;const died=true;hubEnter();epCheck(died);Math.random=Math.random0;if(state==='ep'){seen.push(EPI.E.id);epEnd()}}return seen});
 ok(s.length===8&&new Set(s).size===8,'eight deaths in a row, eight different scenes: '+s.join(' '));
 s=await ev(()=>{const r=Math.random;Math.random=()=>.99;state='over';overT=2;hubEnter();epCheck(true);Math.random=r;return state});ok(s==='hub','and sometimes nothing happens, you just wake up');
 s=await ev(()=>{RD.rndLast=[];RD.lastRun.killer='king';const r=Math.random;let got=null;for(let k=0;k<40&&!got;k++){const j=epDeathPick(true);if(EPISODES[j].id==='r_king')got=j}Math.random=r;epStart(got,'hub');EPI.b=1;EPI.t=2;return EPI.E.n});await pg.waitForTimeout(250);await shot('r-king');await ev(()=>{EPI.b=0;EPI.t=.8});await pg.waitForTimeout(200);await shot('r-title');await ev(()=>epEnd());
 s=await ev(()=>{state='codex';codexPage=6;echoSel=0;return 1});await pg.waitForTimeout(250);await shot('codex');await press('a');s=await ev(()=>({st:state,id:EPI&&EPI.E.id}));ok(s.st==='ep','Codex page 7 plays them again ('+s.id+')');
 await press('start');s=await ev(()=>state);ok(s==='codex','...and goes back to the Codex');
 s=await ev(()=>{localStorage.clear();RD=RDDEF();RD.stats.runs=4;rdSave();rdLoad();return[RD.starter,charUnlocked('WILL'),charUnlocked('ERIN')]});ok(s[0]==='WILL'&&s[1]&&!s[2],'an older save keeps Will as its first keeper ('+s+')');
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
