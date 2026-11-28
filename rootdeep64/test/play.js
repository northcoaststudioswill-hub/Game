/* Play test: drives the real build with real key presses and checks the loop end to end.
   usage: node test/play.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(500);
 await pg.evaluate(()=>{localStorage.clear();rdLoad()});
 const st=()=>pg.evaluate(()=>__rd.RDF.state());
 /* wait on what should happen, not on a clock: a software-rendered browser runs the game slowly */
 const waitFor=async(f,ms)=>{const t0=Date.now();while(Date.now()-t0<(ms||8000)){if(await pg.evaluate(f))return true;await pg.waitForTimeout(100)}return false};const ev=f=>pg.evaluate(f);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};
 const tap=async(k,ms=60)=>{await pg.keyboard.down(k);await pg.waitForTimeout(ms);await pg.keyboard.up(k);await pg.waitForTimeout(90)};
 const hold=async(k,ms)=>{await pg.keyboard.down(k);await pg.waitForTimeout(ms);await pg.keyboard.up(k)};
 /* title -> intro -> hearth */
 await tap('Enter');let s=await st();ok(s.state==='cine','title: START plays the intro on a fresh save ('+s.state+')');ok(s.players.length===1&&s.players[0].dev==='kb1','first device to press is player 1');
 await tap('Enter');s=await st();ok(s.state==='hub','START skips the intro into the Hearth');
 /* walk to the Root Door and open CHOOSE YOUR KEEPER */
 await hold('KeyS',1600);await tap('KeyZ');s=await st();ok(s.state==='chars','walking onto the Root Door + A opens CHOOSE YOUR KEEPER ('+s.state+')');
 await tap('KeyS');await tap('KeyZ');s=await st();ok(s.state==='chars','locked ERIN refuses to dive');
 await tap('KeyW');await tap('KeyZ');await pg.waitForTimeout(300);s=await st();ok(s.state==='run'&&s.run.chamber===1,'WILL dives: chamber 1');
 ok(s.run.enemies>0,'chamber 1 has foes ('+s.run.enemies+')');
 /* fight with real inputs: chase the nearest foe and swing */
 const t0=Date.now();let cleared=false,dashed=false,casted=false;
 while(Date.now()-t0<150000){const q=await ev(()=>{if(!RUN)return null;const p=PL[0];p.hp=Math.max(p.hp,60);let b=null,bd=1e9;for(const e of RUN.enemies){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;b=e}}return{phase:RUN.phase,n:RUN.enemies.length,dx:b?b.x-p.x:0,dy:b?b.y-p.y:0,d:bd,chg:p.dashCharges,ammo:p.castAmmo}});
  if(!q)break;if(q.phase==='doors'){cleared=true;break}
  for(const k of['KeyA','KeyD','KeyW','KeyS'])await pg.keyboard.up(k);
  if(q.dx<-4)await pg.keyboard.down('KeyA');if(q.dx>4)await pg.keyboard.down('KeyD');if(q.dy<-4)await pg.keyboard.down('KeyW');if(q.dy>4)await pg.keyboard.down('KeyS');
  if(q.d<34)await tap('KeyZ',30);else if(!dashed&&q.d>70){await tap('ShiftLeft',30);const c=await ev(()=>PL[0].dashCharges);dashed=c<2}
  else if(!casted&&q.d<120){await tap('KeyX',30);casted=(await ev(()=>PL[0].castAmmo))===0}
  await pg.waitForTimeout(60)}
 for(const k of['KeyA','KeyD','KeyW','KeyS'])await pg.keyboard.up(k);
 ok(cleared,'chamber 1 cleared by fighting (both waves)');ok(dashed,'dash button spends a charge');ok(casted,'cast spends ammo (MAZEL TOV LASER)');
 s=await st();ok(s.run.doors.length===2,'two reward doors: '+s.run.doors.join(' / '));ok(s.run.buds.length>=0&&(await ev(()=>RUN.podDropped)),'a sprout pod dropped (guarantee)');
 /* walk into a door */
 await ev(()=>{PL[0].x=RUN.doors[0].x;PL[0].y=40});await pg.keyboard.down('KeyW');await waitFor(()=>state!=='run'||RUN.chamber===2,6000);await pg.keyboard.up('KeyW');s=await st();
 ok(s.state==='boon'||s.state==='shop'||(s.state==='run'&&s.run.chamber===2),'walking into a door takes its reward ('+s.state+')');
 if(s.state==='boon'){await pg.waitForTimeout(450);await tap('KeyZ');s=await st();ok(s.run.boons.length===1&&s.run.chamber===2,'boon accepted -> chamber 2 with '+s.run.boons[0])}
 if(s.state==='shop'){await tap('KeyX');s=await st();ok(s.run.chamber===2,'left the shop -> chamber 2')}
 /* pause / build / resume */
 await tap('Enter');await waitFor(()=>state==='pause',3000);s=await st();ok(s.state==='pause','START pauses');await pg.waitForTimeout(300);await tap('Enter');await waitFor(()=>state==='run',3000);s=await st();ok(s.state==='run','START resumes');
 /* boss, co-op down + revive, death banking */
 await ev(()=>{__rd.RDF.join('gp9');plRunInit(PL[1]);__rd.RDF.goto(4)});s=await st();ok(s.run.enemies===1&&s.players.length===2,'chamber 4 is the Grub Mother, 2 keepers');
 await ev(()=>{RUN.buds=[];__rd.RDF.hurt(999,1)});s=await st();ok(s.players[1].down&&s.state==='run','P2 falls: down, run continues '+JSON.stringify(s.players)+' rev '+(await ev(()=>RUN&&RUN.revives)));
 await ev(()=>{RUN.enemies[0].x=40;RUN.enemies[0].y=40;RUN.enemies[0].sp=0;RUN.eprojs=[];PL[0].x=PL[1].x+6;PL[0].y=PL[1].y;PL[0].inv=5});await waitFor(()=>!PL[1].down,12000);s=await st();ok(!s.players[1].down&&s.players[1].hp>0,'standing over P2 revives them ('+s.players[1].hp+' hp)');
 await ev(()=>{__rd.RDF.clearRoom()});await waitFor(()=>RUN&&RUN.phase==='doors',6000);s=await st();ok(s.run.phase==='doors'&&(await ev(()=>RUN.keys))===1,'boss down: key + doors');
 const dewBefore=s.meta.dew,runDew=s.run.dew+2*(s.run.chamber-1);await ev(()=>{__rd.RDF.hurt(999,0);__rd.RDF.hurt(999,1)});s=await st();
 ok(s.state==='over'&&s.meta.dew===dewBefore+runDew&&s.meta.keys===2,'party wipe: THE DEEP KEEPS YOU, Moondew + key banked ('+s.meta.dew+' dew)');
 await waitFor(()=>overT>1.4,8000);await tap('KeyZ');await waitFor(()=>state==='hub',3000);s=await st();ok(s.state==='hub','A returns to the Hearth');
 /* escape */
 await ev(()=>{__rd.RDF.depart();__rd.RDF.finale()});await ev(()=>{__rd.RDF.clearRoom()});await pg.waitForTimeout(300);s=await st();ok(s.state==='win'&&s.meta.escapes===1,'chamber 12 cleared: YOU ESCAPED THE DEEP');
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
