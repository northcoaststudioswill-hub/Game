/* Dungeon test: the track, room layouts (always a way through), every stage type, the new foes, pits, vents, the swarm.
   Saves frames to test/shots/dun-*.png.   usage: node test/dungeon.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(300);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};const ev=(f,a)=>pg.evaluate(f,a);const shot=n=>pg.screenshot({path:path.join(out,'dun-'+n+'.png')});
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++){gameUpdate(1/60)}})()`);
 await ev(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1;RD.ep=Object.fromEntries(EPISODES.map(e=>[e.id,1]));window.__hold=true;__rd.RDF.join('kb1')});
 console.log('the track');
 let s=await ev(()=>{const bad=[];const seen={},types={};for(let i=0;i<400;i++){const T=genTrack(false);
   if(T.length!==12)bad.push('len');for(const t of T){seen[t.st]=1;types[t.ty]=(types[t.ty]||0)+1;if(STRATA.find(x=>x.id===t.st).act!==t.act)bad.push('act')}
   if(T[0].ty!=='fight'||T[0].elite)bad.push('ch1');[3,7,11].forEach(i=>{if(T[i].ty!=='boss')bad.push('boss')});
   if(T.filter(t=>t.ty==='rest').length>1)bad.push('rest');for(let a=0;a<3;a++)if(T.slice(a*4,a*4+3).filter(t=>t.ty==='cache'||t.ty==='rest').length>1)bad.push('quiet');
   for(let a=0;a<3;a++)if(new Set(T.slice(a*4,a*4+4).map(t=>t.st)).size!==1)bad.push('mixed')}
  return{bad:[...new Set(bad)],seen:Object.keys(seen),types}});
 ok(!s.bad.length,'400 tracks: 12 stages, a guardian every 4th, chamber 1 a plain fight, one stratum per depth, at most one well'+(s.bad.length?' — '+s.bad:''));
 ok(s.seen.length===6,'all six strata turn up: '+s.seen.join(' '));console.log('    stage mix: '+JSON.stringify(s.types));
 s=await ev(()=>genTrack(true).map(t=>t.st[0]+t.ty[0]+(t.elite?'*':'')).join(' '));ok(s==='bf bf bf* bb vf vf vf* vb cf cf* cf cb','a save\'s first runs use the cartridge\'s track: '+s);
 s=await ev(()=>{RD.stats.runs=0;rdStartRun();const a=RUN.track.every(t=>!STRATA.find(x=>x.id===t.st).variant);RUN=null;RD.stats.runs=5;rdStartRun();const b=RUN.track.map(t=>t.ty);RUN=null;return[a,b]});ok(s[0],'first run on a new save: the classic strata');
 console.log('room layouts');
 s=await ev(()=>{const res={};RUN={obst:[],pits:[]};for(const lay of['scatter','pillars','walls','ring','diag','open','chasm','holes','vents']){let bad=0,n=0,lane=0;for(let i=0;i<120;i++){const L=genLayout(lay);n+=L.obst.length+L.pits.length;if(!layoutOk(L.obst,L.pits))bad++;
   for(const o of L.obst.concat(L.pits))if(o.x<W/2+64&&o.x+o.w>W/2-64&&o.y<80)lane++;
   if(L.pits.some(o=>W/2>o.x&&W/2<o.x+o.w&&H/2>o.y&&H/2<o.y+o.h))lane++}res[lay]=[bad,lane,Math.round(n/120*10)/10]}RUN=null;return res});
 ok(Object.values(s).every(v=>v[0]===0&&v[1]===0),'1080 rooms: every one has a walkable way from the landing to the doors, nothing in the door lane or the middle '+JSON.stringify(s));
 ok(s.chasm[2]>0&&s.holes[2]>0,'pit rooms really have pits');
 console.log('every stage, in a run');
 const play=async(ty,st,lay)=>ev(([ty,st,lay])=>{RD.stats.runs=5;__rd.RDF.depart({classic:false});const T=RUN.track;for(const t of T)if(t.ty!=='boss'){t.ty='fight';t.lay='scatter';t.elite=false}
   const i=st==='grotto'||st==='burrows'?1:st==='glass'||st==='vault'?5:9;for(let a=Math.floor(i/4)*4;a<Math.floor(i/4)*4+4;a++)T[a].st=st;T[i].ty=ty;T[i].lay=lay||LAYS[ty][0];__rd.RDF.goto(i+1);SLOWT=0;HSTOP=0;return{ch:RUN.chamber,st:stratumOf().id,ty:stageOf(),foes:RUN.enemies.map(e=>e.kind),pits:RUN.pits.length,vents:RUN.vents?RUN.vents.length:0,phase:RUN.phase}},[ty,st,lay]);
 s=await play('pit','grotto','chasm');ok(s.st==='grotto'&&s.ty==='pit'&&s.pits>=2,'the Glowcap Grotto, a pit room: '+JSON.stringify(s));
 await step(90);await pg.waitForTimeout(250);await shot('1-grotto-pit');
 s=await ev(()=>{RUN.enemies=[];RUN.wave2=null;const P=RUN.pits[0];const e=spawnFoe('grub',P.x+P.w/2,P.y-10,false);e.born=0;const p=PL[0];p.x=e.x;p.y=e.y-14;const k0=RD.stats.pitKills||0;hitEnemy(e,1,'atk',.01,22,p);return{dead:e.dead,pk:(RD.stats.pitKills||0)-k0}});ok(s.dead&&s.pk===1,'knocking a grub into the pit kills it ('+JSON.stringify(s)+')');
 s=await ev(()=>{const P=RUN.pits[0];const e=spawnFoe('grub',P.x+P.w/2,P.y-10,false);e.born=0;for(let i=0;i<120;i++){foeMove(e,1/60,P.x+P.w/2,P.y+P.h+20,40)}const r=!inPit(e.x,e.y,1)&&!e.dead;RUN.enemies=[];return r});ok(s,'but a grub walking on its own goes around');
 s=await ev(()=>{const p=PL[0];p.inv=0;p.dashT=0;p.land=0;p.hp=100;p.safe=[W/2,H-26];const P=RUN.pits[0];p.x=P.x+P.w/2;p.y=P.y+P.h/2;dunUpdate(1/60);return{hp:Math.round(p.hp),x:Math.round(p.x),y:Math.round(p.y),sy:Math.round(H-26)}});ok(s.hp<100&&s.y===s.sy,'a keeper who walks in falls, gets hurt and climbs out where they were safe ('+JSON.stringify(s)+')');
 s=await ev(()=>{const p=PL[0];p.inv=0;p.hp=100;p.dashT=.2;const P=RUN.pits[0];p.x=P.x+P.w/2;p.y=P.y+P.h/2;dunUpdate(1/60);const r=Math.round(p.hp);p.dashT=0;p.x=W/2;p.y=H-26;return r});ok(s===100,'dashing across is safe');
 s=await ev(()=>{RUN.enemies=[];const e=spawnFoe('puffcap',PL[0].x,PL[0].y-40,false);e.born=0;return 1});await step(150);s=await ev(()=>({pc:RUN.enemies.filter(e=>e.kind==='puffcap').length,hz:(RUN.hazards||[]).length,hit:RUN.hitBy}));ok(s.pc===0,'a puffcap walks up to you and bursts ('+JSON.stringify(s)+')');
 s=await play('fight','glass','pillars');await ev(()=>{RUN.enemies=[];RUN.wave2=null;const e=spawnFoe('shardling',W/2,80,false);e.born=0});s=await ev(()=>{const e=RUN.enemies[0];hitEnemy(e,999,'atk',0,0,PL[0]);return RUN.enemies.map(e=>e.kind)});ok(s.length===2&&s.every(k=>k==='mite'),'a shardling breaks into two glass mites: '+s);
 await ev(()=>{RUN.enemies=[];for(const k of['shardling','mite','crab','shardling']){const q=spawnSpot();spawnFoe(k,q[0],q[1+0],false).born=0}});await step(60);await pg.waitForTimeout(250);await shot('2-glass');
 s=await play('trap','ossuary');ok(s.st==='ossuary'&&s.vents>=4,'the Ossuary, a vents room: '+JSON.stringify(s));
 s=await ev(()=>{RUN.enemies=[];RUN.wave2=null;const v=RUN.vents[0];const e=spawnFoe('bonehound',v.x,v.y,false);e.born=0;e.cd=9;e.root=9;v.ph=VBURST-.01;const h0=e.hp;dunUpdate(1/60);return[Math.round(h0),Math.round(e.hp)]});ok(s[1]<s[0],'vents burn foes too ('+s+')');
 await ev(()=>{RUN.enemies=[];for(let i=0;i<4;i++){const q=spawnSpot();spawnFoe('bonehound',q[0],q[1],false).born=0}for(const v of RUN.vents)v.ph=VBURST+.1*Math.random()});await step(8);await pg.waitForTimeout(250);await shot('3-ossuary-vents');
 s=await ev(()=>{RUN.enemies=[];const e=spawnFoe('bonehound',PL[0].x,PL[0].y-50,false);e.born=0;e.cd=0;let st=new Set();for(let i=0;i<70;i++){rdUpdFoe(e,1/60);st.add(e.state)}RUN.enemies=[];return[...st]});ok(s.includes(1)&&s.includes(2),'a bonehound crouches, then lunges ('+s+')');
 s=await play('swarm','vault','open');ok(s.ty==='swarm','the Flooded Vault, a swarm: '+JSON.stringify(s));
 s=await ev(()=>{for(let i=0;i<60*6;i++){for(const e of RUN.enemies)e.cd=9;PL[0].inv=9;gameUpdate(1/60);SLOWT=0;HSTOP=0}return{phase:RUN.phase,n:RUN.enemies.length,t:Math.round(RUN.swarm&&RUN.swarm.t)}});ok(s.phase==='fight'&&s.n>0,'the swarm keeps coming while the timer runs ('+JSON.stringify(s)+')');
 await pg.waitForTimeout(250);await shot('4-vault-swarm');
 s=await ev(()=>{RUN.swarm.t=.05;for(let i=0;i<30;i++){PL[0].inv=9;gameUpdate(1/60);SLOWT=0;HSTOP=0}return{phase:RUN.phase,n:RUN.enemies.length}});ok(s.phase==='doors'&&s.n===0,'when it breaks, the room is clear ('+JSON.stringify(s)+')');
 await pg.waitForTimeout(250);await shot('5-doors-track');
 s=await play('cache','core','open');ok(s.phase==='doors'&&s.foes.length===0,'a quiet cache: no fight, doors open ('+JSON.stringify(s)+')');s=await ev(()=>RUN.pickups.length);ok(s>15,'and loot on the floor ('+s+')');
 await pg.waitForTimeout(250);await shot('6-core-cache');
 s=await ev(()=>{RD.stats.runs=5;__rd.RDF.depart({classic:false});const T=RUN.track;T[5].ty='rest';T[5].lay='open';PL[0].hp=30;__rd.RDF.goto(6);return{phase:RUN.phase,hp:Math.round(PL[0].hp),well:!!RUN.well}});ok(s.phase==='doors'&&s.hp>30&&s.well,'the well: everyone heals ('+JSON.stringify(s)+')');
 await pg.waitForTimeout(250);await shot('7-well');
 console.log('guardians in the new strata');
 for(const [st,ch] of[['grotto',4],['glass',8],['ossuary',12]]){s=await ev(([st,ch])=>{RD.stats.runs=5;__rd.RDF.depart({classic:false});for(let a=ch-4;a<ch;a++)RUN.track[a].st=st;__rd.RDF.goto(ch);SLOWT=0;return bossTitle(RUN.boss)},[st,ch]);
  await step(70);await pg.waitForTimeout(250);await shot('8-boss-'+st);ok(/,/.test(s),st+' guardian: '+s)}
 s=await ev(()=>{const B=RUN.boss;B.hp=B.max*.3;B.phase=2;B.t=0;let kinds=new Set();for(let i=0;i<3000&&RUN.boss&&!kinds.size;i++){PL[0].inv=9;PL[0].hp=999;updBoss(B,1/60);if(!RUN)break;for(const e of RUN.enemies)if(e.kind!=='boss')kinds.add(e.kind)}return[...kinds]});ok(s.length&&!s.includes('shade'),'the Hollow among the bones calls bonehounds, not moths ('+s+')');
 console.log('the act card');
 await ev(()=>{RD.stats.runs=5;__rd.RDF.depart({classic:false});RUN.track.slice(4,8).forEach(t=>t.st='glass');__rd.RDF.goto(5);SLOWT=0;RUN.zoneT=0});await step(40);await pg.waitForTimeout(250);await shot('9-act-card');
 s=await ev(()=>{const g=dunNet();const saved=JSON.stringify(RUN.track.map(t=>[t.st,t.ty,!!t.elite]));const R0=RUN;RUN={chamber:R0.chamber};dunNetApply(g);const back=JSON.stringify(RUN.track.map(t=>[t.st,t.ty,!!t.elite]));RUN=R0;return[saved===back,JSON.stringify(g).length]});ok(s[0],'online: the track, pits, vents and timers travel to a guest ('+s[1]+' bytes)');
 s=await ev(()=>Object.keys(FOES).length);ok(s===10,'ten foe kinds now ('+s+')');
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
