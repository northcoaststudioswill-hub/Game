/* Moves test: every keeper's special, super, heavy and dash strike, fired through real key presses.
   Saves a frame of each special and super to test/shots/move-*.png.   usage: node test/moves.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=path.join(__dirname,'shots');require('fs').mkdirSync(out,{recursive:true});
 const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await br.newPage({viewport:{width:960,height:540}});const errs=[];let fails=0;
 pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(400);
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};const ev=(f,a)=>pg.evaluate(f,a);
 const tap=async(k,ms=50)=>{await pg.keyboard.down(k);await pg.waitForTimeout(ms);await pg.keyboard.up(k)};
 /* a fresh chamber: keeper mid-room facing a row of sturdy, harmless grubs */
 const setup=ch=>ev(ch=>{localStorage.clear();rdLoad();RD.gift.ERIN=3;RD.stats.budsBanked=20;RD.stats.deaths=8;RD.chars[0]=ch;RD.flags.cineSeen=1;
  if(RUN)rdAbandon();PL.length=0;__rd.RDF.join('kb1');__rd.RDF.depart();RUN.enemies=[];RUN.wave2=null;RUN.obst=[];RUN.zoneT=0;RUN.phase='idle';
  const p=PL[0];p.x=140;p.y=170;p.ax=0;p.ay=-1;p.land=0;p.inv=0;
  for(let i=0;i<5;i++){const e=spawnFoe('grub',100+i*20,120-(i%2)*14,false);e.hp=e.max=400;e.sp=0;e.dmg=0;e.born=0}
  __rd.hpSum=()=>RUN.enemies.reduce((a,e)=>a+e.hp,0)},ch);
 for(const ch of['WILL','ERIN','LOUIE','MARCUS']){console.log(ch);
  await setup(ch);await pg.waitForTimeout(200);let h0=await ev(()=>__rd.hpSum());
  /* special */
  await tap('KeyC');await pg.waitForTimeout(ch==='MARCUS'?900:260);await pg.screenshot({path:path.join(out,'move-'+ch+'-special.png')});await pg.waitForTimeout(700);
  let s=await ev(()=>({cd:PL[0].spCd,hp:__rd.hpSum(),name:MOVES[PL[0].char].sp}));ok(s.cd>0&&s.hp<h0,s.name+': cooldown started, foes hurt ('+Math.round(h0-s.hp)+')');
  /* super: refused when empty, fires when full */
  await tap('KeyV');await pg.waitForTimeout(120);s=await ev(()=>({b:!!RUN.banner,f:RUN.freeze}));ok(!s.b,'super refused on an empty meter');
  await ev(()=>{__rd.RDF.meter(0);for(const e of RUN.enemies)e.hp=e.max});h0=await ev(()=>__rd.hpSum());
  await tap('KeyV');await pg.waitForTimeout(150);s=await ev(()=>({b:RUN.banner&&RUN.banner.txt,f:RUN.freeze,m:PL[0].meter}));ok(s.b&&s.f>0&&s.m===0,'super "'+s.b+'": meter spent, room freezes');
  await pg.waitForTimeout(ch==='LOUIE'?1250:ch==='MARCUS'?1050:1000);await pg.screenshot({path:path.join(out,'move-'+ch+'-super.png')});await pg.waitForTimeout(1900);
  s=await ev(()=>({hp:__rd.hpSum(),acts:RUN.acts.length}));ok(s.hp<h0-60,'super lands ('+Math.round(h0-s.hp)+' damage), leftovers cleaned up: '+(s.acts===0));
  /* heavy: hold attack, release */
  await ev(()=>{for(const e of RUN.enemies){e.hp=e.max;e.x=PL[0].x+(Math.random()*20-10);e.y=PL[0].y-22}PL[0].ax=0;PL[0].ay=-1;PL[0].atkCd=0});h0=await ev(()=>__rd.hpSum());
  await pg.keyboard.down('KeyZ');await pg.waitForTimeout(650);const chg=await ev(()=>PL[0].chg);await pg.keyboard.up('KeyZ');await pg.waitForTimeout(150);
  s=await ev(()=>({a:PL[0].heavyA,hp:__rd.hpSum(),name:MOVES[PL[0].char].heavy}));ok(chg>=.45&&s.a>0,s.name+': charged '+chg.toFixed(2)+'s then released');
  /* dash strike: attack out of a dash */
  await pg.waitForTimeout(700);await ev(()=>{PL[0].x=140;PL[0].y=200;PL[0].ax=0;PL[0].ay=-1;PL[0].atkCd=0;PL[0].dashCharges=2;for(const e of RUN.enemies){e.hp=e.max;e.x=130+Math.random()*20;e.y=140}});h0=await ev(()=>__rd.hpSum());
  await tap('ShiftLeft',30);await pg.waitForTimeout(40);await tap('KeyZ',30);await pg.waitForTimeout(40);
  s=await ev(()=>({d:PL[0].dive,name:MOVES[PL[0].char].dive}));ok(s.d>0,s.name+': attack out of a dash goes airborne');
  await pg.waitForTimeout(600);s=await ev(()=>({hp:__rd.hpSum(),m:PL[0].meter}));ok(s.hp<h0,'  ...and lands on them ('+Math.round(h0-s.hp)+'); meter building: '+s.m)}
 console.log(errs.length?'CONSOLE ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
