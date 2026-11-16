// Usage: node alt/tests/sproutwild/autopilot.js <abs path to built html> <out dir> [seconds cap]
// Writes screenshots and log.txt (every text on screen with timings, then FLAGS) to <out dir>.
// Real-time autopilot: title -> cottage party. Plays like a patient player (reads each caption before A),
// moves at walking speed toward the current goal (position hooks), and logs every text on screen with timings.
const { chromium } = require('playwright');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const FILE=process.argv[2],D=process.argv[3],CAP=+(process.argv[4]||480);
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:430,height:932}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+FILE+'?dev');await sleep(800);
await p.evaluate(()=>{document.querySelector('.cart[data-i="4"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await sleep(4400);
const ev=s=>p.evaluate(s=>window.__g.ev(s),s);
if(process.argv[5]==='fromCottage'){await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();
 S.intro=1;S.quest=4;S.lit=1;S.tendDone=true;S.louFed=1;S.walk2=10;S.walk3=7;S.bwalk=2;S.trioSeeded=1;
 Object.assign(S.lessons,{scSend:1,loop:1,scMeadow:1,scBuild:1,scDab:1,scPlot:1,squire:1});S.beats=Object.assign(S.beats||{},{wake:1,three:1,lit:1,first:1,caught:1});
 S.buildings.push({k:'cottage',gx:3,gy:9,workers:[]});S.res.wood=0;F.giveMon('BESSLING',5);F.giveMon('PEBBLIT',2);F.enter('BASE')});await sleep(1500)}
const key=async(k,ms=70)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await sleep(ms);await p.evaluate(k=>{window.__g.keys[k]=0},k);await sleep(40)};
let shotN=0;const shot=async n=>{const u=await p.evaluate(()=>document.querySelector('#screen').toDataURL());fs.writeFileSync(D+'/'+String(shotN++).padStart(3,'0')+'-'+n+'.png',Buffer.from(u.split(',')[1],'base64'))};
const SNAP=`JSON.stringify((()=>{const F=W4.fld,bf=W4.bf,sc=W4.scene,st=sc&&sc.steps[sc.i],dl=F&&F.dlg;
 const cast=(W4.cast||[]).find(q=>q.who==='ERIN');
 return {state,sec:W4.sector,fid:F?F.id:'',op:typeof wOp==='function'?wOp():0,q:SW.quest,w2:SW.walk2||0,bw:SW.bwalk||0,P:[P3.x,P3.y],wood:SW.res.wood,
  cot:SW.buildings.some(b=>b.k==='cottage'),cons:(W4.cons||[]).length,dab:!!SW.lessons.scDab,
  msg:W4.msgT>0?W4.msg:'',q2:(W4.msgQ||[]).length,pend:(W4.scPend||[]).length,
  scene:st&&st.txt?(st.who||'')+': '+st.txt:'',dlg:dl?dl.lines[dl.i]:'',lou:W4.lsay?W4.lsay.s:'',ban:W4.banner&&W4.banner.t>0?W4.banner.txt:'',
  talk:W4.talk?W4.talk.who:'',quip:(W4.quips||[]).map(q=>q.txt||q.t||'').join('|'),
  buds:(bf&&!F?bf.buds:[]).map(b=>[b.x,b.y,b.g==null?1:b.g]),
  items:((F||bf)?(F||bf).items:[]).filter(i=>!i.done&&!i.guard&&!(i.car&&i.car.length)).map(i=>[i.x,i.y,i.k||'',i.res||'']),
  trees:(!F?W4.nodes:[]).filter(n=>n.k==='tree'&&!n.got).map(n=>[n.x,n.y]),
  erin:F?(W4.ew&&!W4.ew.leave?[W4.ew.x,W4.ew.y]:null):(cast?[cast.x,cast.y]:null),
  tame:(W4.wilds||[]).filter(w=>w.tame).map(w=>[w.x,w.y])[0]||null,
  peb:F?(F.buds.find(b=>b.type===1)||null):null,gate:F?(F.gates.find(g=>g.type===1&&!g.open)||null):null,site:F?(F.sites.find(s=>!s.done)||null):null,
  sq:((F||bf)&&(F||bf).sq||[]).filter(s=>s.st==='follow').length,w3:SW.walk3||0,goal:(()=>{try{return wQuestText()}catch(e){return ''}})(),badges:SW.badges.length,crop:Object.keys(SW.plotCrop||{}).length,plot:(W4.patchBuds||[]).filter(q=>q.type<0&&!q.crop).map(q=>[q.sx,q.sy])[0]||null,gym:F&&F.gym?[F.gym.x,F.gym.y]:null,lv:SW.party.map(m=>m.sp+m.lv).join(' '),etree:W4.ew&&W4.ew.tree&&!W4.ew.tree.got?[W4.ew.tree.x,W4.ew.tree.y]:null,ebug:W4.ew&&W4.ew.bug&&(W4.bugs||[]).includes(W4.ew.bug)?[W4.ew.bug.x,W4.ew.bug.y]:null,wh:W4.wh||520}})())`;
const log=[];const open={};const flags=[];const t0=Date.now();const T=()=>(Date.now()-t0)/1000;
const readT=s=>1.2+String(s).length*.045;
function track(k,v,s){const now=T();const cur=open[k];
 if(cur&&cur.v!==v){const dur=now-cur.t;log.push(cur.t.toFixed(1)+'s +'+dur.toFixed(1)+'s ['+k+'] '+cur.v);
  if(k==='msg'&&dur<readT(cur.v)*.85)flags.push('TOO FAST '+cur.t.toFixed(1)+'s: msg up '+dur.toFixed(1)+'s (needs ~'+readT(cur.v).toFixed(1)+'s): '+cur.v);
  delete open[k]}
 if(v&&!open[k]){open[k]={v,t:now};
  const others=['scene','dlg','quip'].filter(o=>o!==k&&s[o]);
  if(k==='msg'&&others.length)flags.push('TWO VOICES '+now.toFixed(1)+'s: msg "'+v+'" while '+others.map(o=>o+' "'+s[o]+'"').join(', '));
  if((k==='scene'||k==='dlg'||k==='quip')&&s.msg)flags.push('TWO VOICES '+now.toFixed(1)+'s: '+k+' "'+v+'" while msg "'+s.msg+'"');
  if(k==='msg'&&!['g4world'].includes(s.state))flags.push('MSG UNDER '+s.state+' '+now.toFixed(1)+'s: '+v)}}
let lastTxt='',txtAt=0,lastA=0,lastShot=0,phase='',stuck=0,lastP='',placeTries=0;
const face=async(dx,dy)=>{await ev(`(()=>{if(W4.fld)W4.fld.dir=[${dx},${dy}];P3.ax=${dx};P3.ay=${dy}})()`)};
const moveTo=async(s,x,y,stepPx=11)=>{const dx=x-s.P[0],dy=y-s.P[1],d=Math.hypot(dx,dy);if(d<4)return true;const k=Math.min(1,stepPx/d);
 await p.evaluate(([x,y])=>window.__g.SWF().setPos(x,y),[s.P[0]+dx*k,s.P[1]+dy*k]);
 if(Math.abs(dx)>Math.abs(dy))await face(dx>0?1:-1,0);else await face(0,dy>0?1:-1);return false};
const aPress=async(gap=600)=>{if(Date.now()-lastA<gap)return;lastA=Date.now();await key('a')};
while(T()<CAP){
 let s;try{s=JSON.parse(await ev(SNAP))}catch(e){await sleep(200);continue}
 for(const k of ['msg','scene','dlg','lou','ban','quip'])track(k,s[k],s);
 const ph=s.state+'/'+s.sec+'/op'+s.op+'/q'+s.q+'/w'+s.w2+'/bw'+s.bw;if(ph!==phase){log.push(T().toFixed(1)+'s == '+ph);phase=ph}
 if(Date.now()-lastShot>6000){await shot(s.state);lastShot=Date.now()}
 if(s.state==='g4dab'){globalThis.__sawDab=1;if(Date.now()-lastShot>2500){await shot('dab');lastShot=Date.now()}}
 if(!globalThis.__dbgT||Date.now()-globalThis.__dbgT>20000){globalThis.__dbgT=Date.now();log.push(T().toFixed(1)+'s DBG cot='+s.cot+' crop='+s.crop+' plot='+JSON.stringify(s.plot)+' q='+s.q+' P='+s.P.map(Math.round)+' sec='+s.sec+' fid='+s.fid+' state='+s.state)}
 if(s.goal!==globalThis.__goal){globalThis.__goal=s.goal;log.push(T().toFixed(1)+'s GOAL '+s.goal+'   [team '+s.lv+']')}
 if(s.badges>=1){log.push(T().toFixed(1)+'s FIRST SIGIL [team '+s.lv+']');await sleep(3000);await shot('sigil');break}
 const txt=s.scene||s.dlg||(s.state!=='g4world'?s.state:'');if(txt!==lastTxt){lastTxt=txt;txtAt=Date.now()}
 // 1. anything that waits for A: read it first
 if(s.scene&&Date.now()-txtAt>20000&&!globalThis.__dumped){globalThis.__dumped=1;log.push('STUCK DUMP '+await ev("JSON.stringify({i:W4.scene.i,n:W4.scene.steps.length,t:W4.scene.t,step:W4.scene.steps[W4.scene.i],pend:(W4.scPend||[]).length,msgT:W4.msgT,state,keysA:keys.a,prevA:prev.a})"));console.log(log[log.length-1])}
 if(s.scene||s.dlg||s.talk){const need=Math.max(1.6,readT(s.scene||s.dlg||'x'))*1000;if(Date.now()-txtAt>need){await key('a');if(!globalThis.__dumped)txtAt=Date.now()}await sleep(150);continue}
 if(['g4title','g4intro','g4loop','g4kind','g4cine','g4choice','g4file','g4slot','g4save'].includes(s.state)||(s.state!=='g4world'&&!['g4build','g4place','g4pause','g4battle','g4plot'].includes(s.state))){if(Date.now()-txtAt>2200){await key('a');txtAt=Date.now()}await sleep(150);continue}
 if(s.state==='g4battle'){await aPress(500);await sleep(150);continue}
 if(s.state==='g4plot'){const sel=+(await ev('swSel'));if(sel<1)await key('down');else if(sel>1)await key('up');else await key('a');await sleep(250);continue}
 if(s.state==='g4pause'){const sel=+(await ev('swSel'));if(sel<3)await key('down');else if(sel>3)await key('up');else await key('a');await sleep(200);continue}
 if(s.state==='g4build'){const want=+(await ev("WBUILD.findIndex(d=>d.k==='cottage')")),sel=+(await ev('swSel'));if(sel<want)await key('down');else if(sel>want)await key('up');else await key('a');await sleep(200);continue}
 if(s.state==='g4place'){placeTries++;if(placeTries%3===0)await key(placeTries%6===0?'down':'right');await key('a');await sleep(300);continue}
 // 2. the world
 if(s.state!=='g4world'){await sleep(150);continue}
 if(s.sec==='BASE'&&!s.fid){
  if(s.op===0){const bd=s.buds.find(x=>x[2]>=1);if(bd){if(await moveTo(s,bd[0],bd[1]+13)){await face(0,-1);await aPress()}}await sleep(150);continue}
  if(s.op===1){const it=s.items[0];if(it){if(await moveTo(s,it[0]+30,it[1]+2)){await face(-1,0);await aPress(900)}}await sleep(150);continue}
  if(s.op===2){if(await moveTo(s,240,170)){await face(0,-1);await aPress(1200)}await sleep(150);continue}
  if(s.q<=2){if(s.erin&&s.bw<2){const dx=s.P[0]-s.erin[0],dy=s.P[1]-s.erin[1],d=Math.hypot(dx,dy)||1;if(d>30)await moveTo(s,s.erin[0]+dx/d*26,s.erin[1]+dy/d*26-(dy>0?40:0),9);}else{await moveTo(s,240,s.wh-8,11);await key('down',120)}await sleep(150);continue}
  if(s.cot&&!s.crop&&s.plot){if(await moveTo(s,s.plot[0],s.plot[1]+14)){await face(0,-1);await aPress(1500)}await sleep(150);continue}
  if(s.cot&&s.q>=5){await moveTo(s,240,s.wh-8,11);await key('down',120);await sleep(150);continue}
  if(!s.cot){if(s.wood>=8){await key('start');await sleep(300);continue}
   const it=s.items.find(i=>i[3]==='wood'||i[2]==='log'||i[2]==='pel')||s.items[0];
   if(it&&s.sq){if(await moveTo(s,it[0]+28,it[1]+2)){await face(-1,0);await aPress(900)}await sleep(150);continue}
   const tr=s.trees.sort((a,b2)=>Math.hypot(a[0]-s.P[0],a[1]-s.P[1])-Math.hypot(b2[0]-s.P[0],b2[1]-s.P[1]))[0];
   if(tr){if(await moveTo(s,tr[0],tr[1]+24)){await face(0,-1);await aPress(2500)}}await sleep(150);continue}
  await sleep(200);continue}
 if(s.fid==='MEADOW'){
  if(s.w2===2&&s.tame){if(await moveTo(s,s.tame[0],s.tame[1]+24)){await face(0,-1);await aPress(700)}await sleep(150);continue}
  if(s.w2===4&&s.peb){if(await moveTo(s,s.peb.x,s.peb.y+12)){await face(0,-1);await aPress()}await sleep(150);continue}
  if(s.w2===6&&s.gate){if(await moveTo(s,s.gate.x,s.gate.y+22)){await face(0,-1);await aPress(1000)}await sleep(150);continue}
  if(s.w2===8&&s.site){if(await moveTo(s,s.site.x,s.site.y-26)){await face(0,1);await aPress(800)}await sleep(150);continue}
  if(s.w2>=10&&s.w3===2&&s.etree){if(await moveTo(s,s.etree[0],s.etree[1]+22)){await face(0,-1);await aPress(2500)}await sleep(150);continue}
  if(s.w2>=10&&s.w3===3){const it=s.items.find(i=>i[3]==='wood');if(it){if(await moveTo(s,it[0]+28,it[1]+2)){await face(-1,0);await aPress(900)}await sleep(150);continue}}
  if(s.w2>=10&&s.w3===5&&s.ebug){if(await moveTo(s,s.ebug[0],s.ebug[1]+20)){await face(0,-1);await aPress(800)}await sleep(150);continue}
  if(s.erin&&(s.w2<10||(s.w3>0&&s.w3<7))){const dx=s.P[0]-s.erin[0],dy=s.P[1]-s.erin[1],d=Math.hypot(dx,dy)||1;if(d>34)await moveTo(s,s.erin[0]+dx/d*26,s.erin[1]+dy/d*26,10);await sleep(150);continue}
  if(s.q>=5){if(s.P[1]>24||Math.abs(s.P[0]-(17*16+16))>6){await moveTo(s,17*16+16,s.P[1]>24?Math.max(20,s.P[1]-11):20)}else{await key('up',150)}await sleep(150);continue}
  if(s.w2>=10||s.q>=3){// home: up the west lane to the north gate
   if(s.P[1]>40){await moveTo(s,s.P[0]>60?s.P[0]-11:40,s.P[1]-11)}else{await key('up',150)}
   stuck=(lastP===s.P.join())?stuck+1:0;lastP=s.P.join();if(stuck>40){await p.evaluate(()=>window.__g.SWF().travel('BASE','MEADOW'));log.push(T().toFixed(1)+'s (autopilot: travel hook home after being stuck)')}
   await sleep(150);continue}
  await sleep(150);continue}
 if(s.fid==='TOWN'&&s.gym){if(await moveTo(s,s.gym[0],s.gym[1]+18)){await face(0,-1);await aPress(1500)}await sleep(150);continue}
 await sleep(150)}
for(const k in open)log.push(open[k].t.toFixed(1)+'s (still up) ['+k+'] '+open[k].v);
await shot('end');
fs.writeFileSync(D+'/log.txt',log.join('\n')+'\n\nFLAGS\n'+flags.join('\n')+'\n\nerrors '+JSON.stringify(errs));
console.log('time',T().toFixed(0)+'s','flags',flags.length,'errors',errs.length);console.log(flags.join('\n'));
await b.close()})();
