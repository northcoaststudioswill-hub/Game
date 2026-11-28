/* Animation contact sheet: freezes the rules, holds each action at a few moments, and saves close-ups.
   usage: node test/anim.js   -> test/shots/anim-*.png */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');require('fs').mkdirSync(out,{recursive:true});
 const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:1280,height:300},deviceScaleFactor:1});const errs=[];
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(400);
 /* four keepers in a row, one of each, seen from the front-side */
 await pg.evaluate(()=>{localStorage.clear();rdLoad();RD.gift.ERIN=3;RD.stats.budsBanked=20;RD.stats.deaths=8;RD.chars=['WILL','ERIN','MARCUS','LOUIE'];
  for(const d of['kb1','g1','g2','g3'])__rd.RDF.join(d);__rd.RDF.depart();RUN.enemies=[];RUN.wave2=null;RUN.phase='idle';RUN.obst=[];RUN.zoneT=0;
  PL.forEach((p,i)=>{p.x=95+i*30;p.y=120;p.ax=.55;p.ay=.83;p.land=0;p.inv=0});window.__hold=true;
  window.__cam=[[140,34,236],[140,10,120]]});
 const shot=async(n,f)=>{await pg.evaluate(f);await pg.waitForTimeout(420);await pg.screenshot({path:path.join(out,'anim-'+n+'.png')})};
 const all=s=>'for(const p of PL){'+s+'}';
 await shot('01-idle',()=>{});
 await shot('02-atk1-wind',()=>{for(const p of PL){p.combo=1;p.swingD=.33;p.swing=.33*.97}});
 await shot('03-atk1-hit',()=>{for(const p of PL){p.swing=.33*.68}});
 await shot('04-atk2-hit',()=>{for(const p of PL){p.combo=0;p.swing=.33*.68}});
 await shot('05-atk3-up',()=>{for(const p of PL){p.combo=2;p.swing=.33*.9}});
 await shot('06-atk3-down',()=>{for(const p of PL){p.swing=.33*.6}});
 await shot('07-cast-charge',()=>{for(const p of PL){p.swing=0;p.castA=.45*.94}});
 await shot('08-cast-fire',()=>{for(const p of PL){p.castA=.45*.6}});
 await shot('09-selfie-hurt',()=>{PL[0].castA=0;PL[0].selfieA=.4;for(const p of PL.slice(1)){p.castA=0;p.hurt=.2}});
 await shot('10-dash',()=>{for(const p of PL){p.selfieA=0;p.hurt=0;p.dashT=9}});
 await shot('11-cheer',()=>{for(const p of PL){p.dashT=0;p.cheer=1.1*.86}});
 await shot('12-down-help',()=>{for(const p of PL){p.cheer=0}PL[1].down=true;PL[0].x=PL[1].x-12;PL[3].down=true;PL[2].x=PL[3].x-13});
 /* running, sampled live */
 await pg.evaluate(()=>{for(const p of PL)p.down=false;PL.forEach((p,i)=>{p.x=95+i*30});window.__hold=false;for(const p of PL)p.dev.mx=1;window.__cam=[[140,30,250],[140,10,120]];
  __rd.walk=setInterval(()=>{for(const p of PL){p.dev.mx=1;p.inv=0;if(p.x>W-20){p.x=20}}},10)});
 for(let i=0;i<3;i++){await pg.waitForTimeout(170);await pg.screenshot({path:path.join(out,'anim-13-run'+i+'.png')})}
 /* the Hearth: NPC habits */
 await pg.evaluate(()=>{clearInterval(__rd.walk);window.__cam=[[140,40,250],[140,10,130]];rdAbandon();hubEnter();for(const p of PL.slice(1))dropPlayer(p);PL[0].dev=DEV.kb1;
  ['ERIN','MARCUS','SCOUT','RANGER','LOUIE'].forEach((w,i)=>{const n=HUBNPC[w];n.x=70+i*34;n.y=140;n.wait=99;n.yaw=0});PL[0].x=140;PL[0].y=178;window.__hold=true});
 await pg.waitForTimeout(2300);await pg.screenshot({path:path.join(out,'anim-14-npcs.png')});
 await shot('15-talk',()=>{state='talk';talkNPC='MARCUS';talkTxt=''});
 console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');await br.close()})();
