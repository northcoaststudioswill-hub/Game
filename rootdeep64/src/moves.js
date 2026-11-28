/* =====================================================================
   ROOTDEEP 64 — moves
   New verbs on top of the cartridge's attack / cast / dash. Every name
   here is taken from the fighter in this repo (src/knockout.js: CH sp /
   sp2 / su and the MN tables), per the standing rule that Rootdeep's
   moves mirror that game. What each move *does* down here is this
   port's reading of what it does up there.

     SPECIAL     own cooldown          sp / sp2 from the fighter
     SUPER       meter, filled by fighting   su from the fighter
     HEAVY       hold attack, release  MN.k   (HEAVY)
     DASH STRIKE attack out of a dash  MN.jk  (AIR ATTACK)

   Marcus's fighter super is called HYDRO JET, which the cartridge had
   already given to his cast, so his super is shown under its fighter
   callout, "BRO, I GOT AN IDEA". Unused so far and still available:
   Louie's TURBO ZOOM, Marcus's DOUBLE OR NOTHING, and everyone's
   LAUNCHER / SWEEP / THROW.
   ===================================================================== */
'use strict';
const MOVES={
 WILL:  {sp:'SELFIE FLASH',  sup:'BIKE LANE',          heavy:'SNEAKER KICK',dive:'STAGE DIVE',     spCd:9},
 ERIN:  {sp:'LEASH LASSO',   sup:'SPROUT STAMPEDE',    heavy:'GARDEN KICK', dive:'FLYING FLOP',    spCd:5},
 LOUIE: {sp:'ZOOM ZOOM ZOOM',sup:'JUDGEMENT',          heavy:'CHOMP',       dive:'ZOOM POUNCE',    spCd:6},
 MARCUS:{sp:'DAB CLOUD',     sup:'BRO, I GOT AN IDEA', heavy:'PIPE WRENCH', dive:'CANNONBALL, BRO',spCd:7}};
const CHARGE_T=.45,SUPER_MAX=100;
const mv=p=>MOVES[p.char]||MOVES.WILL;
const moveMul=p=>{const s=rdStats(p);return s.dmgMul*s.castMul};
function meterGain(p,n){if(!p||p.down)return;const was=p.meter||0;p.meter=Math.min(SUPER_MAX,was+n);
 if(was<SUPER_MAX&&p.meter>=SUPER_MAX){ftext(p.x,p.y-28,'SUPER READY!','#ffd94d');snd(880,.08,1320,'triangle',.06);later(()=>snd(1320,.14,1760,'triangle',.06),90)}}
function movesReset(p,newRun){Object.assign(p,{spCd:0,spA:0,supA:0,heavyA:0,dive:0,diveL:0,dashGrace:0,chg:0,charging:false,zoom:null});if(newRun)p.meter=0}

/* ---------------- specials ---------------- */
function doSpecial(p){if(p.spCd>0||p.down||p.dive>0||p.zoom)return;const M=mv(p),[ax,ay]=aimVec(p),mul=moveMul(p);
 RD.stats.specials=(RD.stats.specials||0)+1;p.spCd=M.spCd/rdStats(p).castRegen;p.spA=.55;ftext(p.x,p.y-26,M.sp+'!','#f8a0c8');
 if(p.char==='ERIN'){ /* LEASH LASSO: rope the nearest foe ahead and haul it in */
  let best=null,bs=1e9;for(const e of RUN.enemies){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;if(d>135||e.born>0)continue;const dot=(dx*ax+dy*ay)/d,sc=d-(dot>.2?60:0);if(sc<bs){bs=sc;best=e}}
  RUN.acts.push({k:'leash',o:p,e:best,x2:p.x+ax*90,y2:p.y+ay*90,t:.3,t0:.3,mul});noise(.06,.3,4000);snd(700,.12,1500,'triangle',.05);return}
 if(p.char==='LOUIE'){p.zoom={n:3,t:0,hit:new Set(),mul};p.spA=.5;return} /* ZOOM ZOOM ZOOM: three snap-dashes through the pack */
 if(p.char==='MARCUS'){ /* DAB CLOUD: a slow cloud that dazes whatever wanders into it */
  RUN.acts.push({k:'cloud',x:p.x+ax*14,y:p.y+ay*14,vx:ax*40,vy:ay*40,life:3.2,tick:0,o:p,mul,s:Math.random()*9});noise(.5,.2,900,'lowpass');return}
 /* SELFIE FLASH: the phone goes up, the whole room goes white */
 p.selfie=.22;RUN.flash=.3;snd(1400,.06,2000,'square',.05);later(()=>noise(.08,.3,6000),40);
 for(const e of RUN.enemies.slice()){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<66&&!(e.born>0)){e.root=Math.max(e.root,e.kind==='boss'?.5:1.1);e.dazed=e.kind==='boss'?.5:1.1;hitEnemy(e,8*mul,'special',0,0,p)}}
 RUN.eprojs=RUN.eprojs.filter(q=>Math.hypot(q.x-p.x,q.y-p.y)>66);
 RUN.rings.push({x:p.x,y:p.y,r:66,t:.3,c:'#ffffff'})}

/* ---------------- supers ---------------- */
function doSuper(p){if(p.down)return;if((p.meter||0)<SUPER_MAX){if(!(p.noSupT>time)){p.noSupT=time+1;ftext(p.x,p.y-30,'SUPER '+Math.floor(p.meter||0)+'%','#c88a18');snd(140,.06)}return}
 if(RUN.freeze>0||p.dive>0||p.zoom){p.supQ=true;return}p.supQ=false;const M=mv(p);
 RD.stats.supers=(RD.stats.supers||0)+1;RD.flags['sup_'+p.char]=1;p.meter=0;p.supA=1.05;p.inv=Math.max(p.inv,1.4);p.dive=0;p.zoom=null;p.charging=false;
 RUN.freeze=.6;RUN.freezeP=p;RUN.banner={txt:M.sup,who:(PL.length>1?'P'+(p.ix+1)+'  ':'')+p.char,c:PCOL[p.ix],t:1.3};
 snd(220,.5,880,'sawtooth',.07);snd(330,.5,1320,'square',.04);RUN.shake=3}
function superFire(p){const[ax,ay]=aimVec(p),mul=moveMul(p);
 /* walk back along the aim line to find where something would enter the room from */
 const edge=(ox,oy)=>{let x=ox,y=oy;for(let i=0;i<80&&x>-10&&x<W+10&&y>14&&y<H+16;i++){x-=ax*6;y-=ay*6}return[x,y]};
 if(p.char==='ERIN'){ /* SPROUT STAMPEDE */
  for(let i=0;i<6;i++){const off=(i-2.5)*19,e=edge(p.x-ay*off,p.y+ax*off);RUN.acts.push({k:'sprout',x:e[0],y:e[1],vx:ax*235,vy:ay*235,delay:i*.11,life:3,type:i,o:p,hit:new Set(),mul})}
  snd(523,.1);later(()=>snd(659,.1),90);later(()=>snd(784,.2),180);return}
 if(p.char==='LOUIE'){ /* JUDGEMENT: it lands on whatever most deserves it */
  let best=null,bh=-1;for(const e of RUN.enemies){const h=e.kind==='boss'?1e9:e.hp;if(h>bh){bh=h;best=e}}
  RUN.acts.push({k:'judge',e:best,x:best?best.x:p.x+ax*50,y:best?best.y:p.y+ay*50,t:0,next:.3,hits:4,o:p,mul});snd(80,1.2,40,'sawtooth',.08);return}
 if(p.char==='MARCUS'){ /* six geysers march out in a line */
  for(let i=0;i<6;i++)RUN.acts.push({k:'geyser',x:clamp(p.x+ax*(30+i*30),16,W-16),y:clamp(p.y+ay*(30+i*30),36,H-14),delay:.08+i*.12,life:.5,o:p,mul});
  noise(.9,.25,700,'lowpass');return}
 /* BIKE LANE: ding ding */
 const e=edge(p.x,p.y);RUN.acts.push({k:'bike',x:e[0],y:e[1],vx:ax*330,vy:ay*330,life:2.6,o:p,hit:new Set(),mul});
 snd(1200,.1,1600,'sine',.1);later(()=>snd(1200,.1,1600,'sine',.1),120)}

/* ---------------- heavy & dash strike ---------------- */
function doHeavy(p){const w=WEAPONS[RD.weapon],s=rdStats(p),[ax,ay]=aimVec(p),isLou=p.char==='LOUIE';
 const base=Math.max(...w.dmg)*1.8*s.dmgMul*s.atkMul*(isLou?.85:1);
 RD.stats.heavies=(RD.stats.heavies||0)+1;p.atkCd=w.rate*1.9;p.heavyA=.42;p.swing=0;ftext(p.x,p.y-26,mv(p).heavy+'!','#ffd94d');noise(.07,.22,1500);snd(160,.14,70,'sawtooth',.07);
 let hit=false;for(const e of RUN.enemies.slice()){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);
  if(d<32+e.r){const dot=(dx/(d||1))*ax+(dy/(d||1))*ay;if(dot>.45||d<13){e.root=Math.max(e.root,.45);hitEnemy(e,base,'heavy',(dx/(d||1))*15,(dy/(d||1))*15,p);hit=true}}}
 if(hit){RUN.shake=Math.max(RUN.shake,2.5);burst(p.x+ax*18,p.y+ay*18,'#fff3b0',10,46)}}
function doDive(p){const w=WEAPONS[RD.weapon];p.atkCd=w.rate;p.dive=.3;p.dashGrace=0;p.inv=Math.max(p.inv,.4);p.swing=0;
 ftext(p.x,p.y-26,mv(p).dive+'!','#7fd0e8');snd(300,.2,900,'triangle',.06)}
function diveLand(p){const w=WEAPONS[RD.weapon],s=rdStats(p),isLou=p.char==='LOUIE';
 const base=Math.max(...w.dmg)*1.6*s.dmgMul*s.atkMul*(isLou?.85:1);p.diveL=.3;let any=false;
 for(const e of RUN.enemies.slice()){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d<27+e.r){any=true;hitEnemy(e,base,'atk',(dx/(d||1))*9,(dy/(d||1))*9,p)}}
 if(any)RD.stats.dives=(RD.stats.dives||0)+1;
 RUN.rings.push({x:p.x,y:p.y,r:27,t:.3,c:'#fff3b0'});burst(p.x,p.y,'#c8b8a8',12,50);RUN.shake=Math.max(RUN.shake,2.2);snd(120,.16,55,'sawtooth',.08);noise(.1,.25,700,'lowpass')}

/* one keeper's attack-side input for this frame (replaces the bare "A = attack" line) */
function movesInput(p,dt,dv){
 if(p.spCd>0)p.spCd-=dt;if(p.spA>0)p.spA-=dt;if(p.supA>0)p.supA-=dt;if(p.heavyA>0)p.heavyA-=dt;if(p.diveL>0)p.diveL-=dt;
 if(p.dashT>0)p.dashGrace=.16;else if(p.dashGrace>0)p.dashGrace-=dt;
 if(p.dive>0){const[ax,ay]=aimVec(p);p.dive-=dt;p.inv=Math.max(p.inv,.12);p.x+=ax*120*dt;p.y+=ay*120*dt;collide(p,6);if(p.dive<=0)diveLand(p);return}
 if(p.zoom){const z=p.zoom;p.inv=Math.max(p.inv,.16);z.t-=dt;
  if(z.t<=0){if(z.n<=0){p.zoom=null;return}z.n--;z.t=.16;
   let best=null,bd=125;for(const e of RUN.enemies){if(z.hit.has(e)||e.born>0)continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e}}
   if(!best&&z.hit.size){z.hit.clear();for(const e of RUN.enemies){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e}}}
   let ax,ay;if(best){ax=(best.x-p.x)/(bd||1);ay=(best.y-p.y)/(bd||1);p.ax=ax;p.ay=ay;z.hit.add(best)}else[ax,ay]=aimVec(p);
   const len=best?Math.min(bd+20,92):62;
   for(const e of RUN.enemies.slice()){const t=clamp((e.x-p.x)*ax+(e.y-p.y)*ay,0,len);if(Math.hypot(e.x-(p.x+ax*t),e.y-(p.y+ay*t))<e.r+10)hitEnemy(e,11*z.mul,'special',ax*5,ay*5,p)}
   p.vx=ax*len/.12;p.vy=ay*len/.12;p.dashT=.12;snd(520,.08,300,'sawtooth',.07);burst(p.x,p.y,'#f8c070',5,24)}
  return}
 if(dv.pr.sup||p.supQ)doSuper(p);
 if(dv.pr.sp)doSpecial(p);
 if(dv.pr.a&&p.atkCd<=.02){if(p.dashGrace>0)doDive(p);else doAttack(p);p.chg=0;p.charging=true}
 if(p.charging){if(dv.cur.a){const was=p.chg;p.chg+=dt;if(was<CHARGE_T&&p.chg>=CHARGE_T)snd(990,.06,1480,'square',.03)}
  else{if(p.chg>=CHARGE_T&&p.dive<=0)doHeavy(p);p.charging=false;p.chg=0}}}

/* ---------------- the things supers and specials leave in the room ---------------- */
function updateActs(dt){for(const a of RUN.acts){
  if(a.delay>0){a.delay-=dt;continue}
  if(a.k==='bike'||a.k==='sprout'){a.x+=a.vx*dt;a.y+=a.vy*dt;a.life-=dt;const big=a.k==='bike',l=Math.hypot(a.vx,a.vy)||1;
   if(a.x<-40||a.x>W+40||a.y<-20||a.y>H+50)a.life=0;
   for(const e of RUN.enemies.slice()){if(a.hit.has(e)||e.born>0)continue;if(Math.hypot(e.x-a.x,e.y-a.y)<e.r+(big?15:8)){a.hit.add(e);hitEnemy(e,(big?62:17)*a.mul,'super',a.vx/l*(big?22:7),a.vy/l*(big?22:7),a.o);if(big)RUN.shake=Math.max(RUN.shake,2.5)}}
   if(big){RUN.eprojs=RUN.eprojs.filter(q=>Math.hypot(q.x-a.x,q.y-a.y)>20);if(Math.random()<dt*30)RUN.parts.push({x:a.x,y:a.y,vx:R(-10,10),vy:R(-10,10),z:1.5,vz:10,life:.3,c:'#8a7a8a',ng:1})}}
  else if(a.k==='judge'){a.t+=dt;if(a.e&&a.e.hp>0&&!a.e.dead){a.x=a.e.x;a.y=a.e.y}
   if(a.t>=a.next&&a.hits>0){a.hits--;a.next+=.26;RUN.shake=Math.max(RUN.shake,3);snd(110,.2,55,'sawtooth',.08);RUN.rings.push({x:a.x,y:a.y,r:26,t:.3,c:'#ffd94d'});
    for(const e of RUN.enemies.slice())if(Math.hypot(e.x-a.x,e.y-a.y)<26+e.r&&!(e.born>0))hitEnemy(e,23*a.mul,'super',0,0,a.o)}
   a.life=a.hits>0?1:.28-(a.t-a.next+.26)}
  else if(a.k==='geyser'){if(!a.done){a.done=true;snd(200,.25,90,'sawtooth',.06);RUN.rings.push({x:a.x,y:a.y,r:17,t:.3,c:'#7fd0e8'});burst(a.x,a.y,'#bdeffb',9,44);
    for(const e of RUN.enemies.slice())if(Math.hypot(e.x-a.x,e.y-a.y)<17+e.r&&!(e.born>0)){e.root=Math.max(e.root,.6);e.chill=Math.max(e.chill,2);hitEnemy(e,26*a.mul,'super',0,0,a.o)}}
   a.life-=dt}
  else if(a.k==='cloud'){a.x+=a.vx*dt;a.y+=a.vy*dt;a.vx*=1-dt*.5;a.vy*=1-dt*.5;a.life-=dt;a.tick-=dt;
   if(a.tick<=0){a.tick=.4;for(const e of RUN.enemies.slice())if(Math.hypot(e.x-a.x,e.y-a.y)<23+e.r&&!(e.born>0)){e.root=Math.max(e.root,e.kind==='boss'?.12:.34);e.dazed=.5;e.chill=Math.max(e.chill,1);hitEnemy(e,4*a.mul,'special',0,0,a.o)}}}
  else if(a.k==='leash'){a.t-=dt;if(a.t<=0){a.life=0;const p=a.o,e=a.e;
    if(e&&e.hp>0&&!e.dead){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
     if(e.kind==='boss'){hitEnemy(e,20*a.mul,'special',0,0,p);e.root=Math.max(e.root,.5);if(d>30){p.x=e.x+dx/d*30;p.y=e.y+dy/d*30;collide(p,6)}}
     else{e.x=p.x-dx/d*17;e.y=p.y-dy/d*17;collide(e,e.r);e.root=Math.max(e.root,1.4);e.dazed=1.4;hitEnemy(e,14*a.mul,'special',0,0,p)}
     snd(300,.08,160)}}else a.life=1}}
 RUN.acts=RUN.acts.filter(a=>a.delay>0||a.life>0)}
