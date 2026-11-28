/* Combat look: freezes a real fight at telling moments and saves close-ups to test/shots/combat-*.png */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(300);
 const ev=f=>pg.evaluate(f);const shot=n=>pg.screenshot({path:path.join(out,'combat-'+n+'.png')});
 await ev(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1;RD.stats.runs=9;__rd.RDF.join('kb1');__rd.RDF.depart();RUN.enemies=[];RUN.wave2=null;RUN.obst=[];RUN.zoneT=0;
  const p=PL[0];p.x=140;p.y=150;p.ax=0;p.ay=-1;p.land=0;
  for(let i=0;i<5;i++){const e=spawnFoe(i%2?'beetle':'grub',120+i*10,128-(i%2)*6,i===2);e.hp=e.max=900;e.sp=0;e.dmg=0;e.born=0}
  window.__cam=[[140,58,215],[140,6,135]]});
 /* hold the fight still for a picture: a step at a time, actions called straight in */
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++){gameUpdate(1/60)}})()`);
 const atk=c=>ev(`(()=>{const p=PL[0];p.atkCd=0;p.combo=${c};doAttack(p)})()`);
 await ev(()=>{window.__hold=true});
 await atk(2);await step(4);await pg.waitForTimeout(200);await shot('1-first-cut');
 await atk(0);await step(6);await pg.waitForTimeout(200);await shot('2-spin-backhand');
 await atk(1);await step(5);await pg.waitForTimeout(200);await shot('3-finisher-launch');
 await step(10);await pg.waitForTimeout(200);await shot('4-airborne');
 await step(40);await ev(()=>{const p=PL[0];p.atkCd=0;doHeavy(p)});await step(5);await pg.waitForTimeout(200);await shot('5-heavy-kick');
 await step(40);await ev(()=>{RUN.enemies.forEach(e=>{e.hp=1;e.z=0;e.vz=0})});await atk(1);await step(12);await pg.waitForTimeout(200);await shot('6-deaths-tumble');
 await ev(()=>{window.__cam=null;RUN.enemies=[];for(let i=0;i<4;i++){const e=spawnFoe('grub',90+i*36,80,false);e.sp=0;e.dmg=0;e.born=0;e.hp=e.max=900}PL[0].x=60;PL[0].y=150;PL[0].ax=1;PL[0].ay=0;PL[0].dashCharges=2;PL[0].dev.mx=1;doDash(PL[0])});
 await step(7);await pg.waitForTimeout(200);await shot('7-dash-ghosts');
 await ev(()=>{PL[0].dev.mx=0;const e=spawnFoe('spitter',200,80,false);e.born=0;e.cd=.2;e.sp=0;const g=spawnFoe('grub',PL[0].x+12,PL[0].y-6,false);g.born=0;g.dmg=0;g.sp=0;RUN.enemies.forEach(e=>e.wind=e.kind==='spitter')});await pg.waitForTimeout(200);await shot('8-telegraphs');
 console.log(errs.length?'ERRORS: '+[...new Set(errs)].join(' | '):'no console errors');await br.close()})();
