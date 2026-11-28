/* =====================================================================
   ROOTDEEP 64 — the dungeon, procedurally
   Every run is a TRACK: three depths, each one a stratum of the deep with
   three stages and a guardian, then down into a different kind of place.
   - Six strata: the cartridge's three, plus a variant of each that the
     run can roll instead (the Glowcap Grotto, the Glass Caverns, the
     Ossuary), each with its own light, debris, ambience, foes and a
     twist on that depth's guardian.
   - Stage types: BATTLE, THE PIT (chasms; knock foes in, dash across),
     THE SWARM (hold out until it breaks), THE VENTS (flame vents cycle
     under the fight), A QUIET CACHE and THE WELL (no fight; loot / rest).
   - Room layouts are built from templates (scatter, pillars, walls,
     ring, diagonal, open, chasm, holes, vents) and checked: there is
     always a walkable way from where you land to the reward doors.
   The first two runs on a save use the cartridge's own track.
   ===================================================================== */
'use strict';
const STRATA=[
 {id:'burrows',act:0,n:'THE BURROWS',col:'#a87fd0',room:'burrows',L:0,pool:['grub','grub','spitter','beetle'],deb:['rock','tuft','stalag'],amb:'motes',ob:[.5,.38,.5]},
 {id:'grotto',act:0,variant:true,n:'THE GLOWCAP GROTTO',col:'#5ad0b0',room:'grotto',L:[[.3,.9,.45],[.42,.72,.7],[.26,.4,.44],'#03100e'],pool:['grub','puffcap','puffcap','spitter','grub'],deb:['shroom','tuft','shroom'],amb:'spores',ob:[.24,.42,.4],boss:'THE GRUB MOTHER, OVERGROWN',minion:'puffcap'},
 {id:'vault',act:1,n:'THE FLOODED VAULT',col:'#60b8f8',room:'vault',L:1,pool:['crab','spitter','wisp','shade','grub'],deb:['rock','bone','shard'],amb:'puddles',ob:[.3,.5,.66]},
 {id:'glass',act:1,variant:true,n:'THE GLASS CAVERNS',col:'#c8e8ff',room:'glass',L:[[.3,.9,.4],[.72,.82,.96],[.44,.52,.64],'#0a1222'],pool:['shardling','shardling','crab','shade','wisp'],deb:['shard','rock','shard'],amb:'snow',ob:[.62,.78,.95],boss:'THE DROWNED KING, ICEBOUND',bossTint:[.78,.95,1.25]},
 {id:'core',act:2,n:'THE EMBER CORE',col:'#f07830',room:'core',L:2,pool:['wisp','shade','beetle','crab','spitter'],deb:['rock','ember','shard'],amb:'embers',ob:[.5,.26,.26]},
 {id:'ossuary',act:2,variant:true,n:'THE OSSUARY',col:'#d8ccb8',room:'ossuary',L:[[.3,.85,.45],[.8,.72,.62],[.44,.38,.36],'#0c0806'],pool:['bonehound','bonehound','shade','beetle','spitter'],deb:['bone','rock','bone'],amb:'dust',ob:[.56,.5,.44],boss:'THE HOLLOW KEEPER, AMONG THE BONES',minion:'bonehound'}];
const STIDS=STRATA.map(s=>s.id);
const STAGES={fight:{n:'BATTLE',g:'+',c:'#c8c0d8'},pit:{n:'THE PIT',g:'O',c:'#b08ae8',hint:'KNOCK THEM IN  ·  DASH ACROSS'},swarm:{n:'THE SWARM',g:'#',c:'#f07878',hint:'HOLD OUT UNTIL IT BREAKS'},
 trap:{n:'THE VENTS',g:'^',c:'#f8a040',hint:'WATCH THE FLOOR'},cache:{n:'A QUIET CACHE',g:'$',c:'#ffd94d'},rest:{n:'THE WELL',g:'~',c:'#7fd0e8'},boss:{n:'GUARDIAN',g:'!',c:'#ff6a5a'}};
const STKEYS=Object.keys(STAGES);
const VARNAMES={grotto:['THE GLOWCAP GALLERY','THE SPORE STAIR','THE DRIPPING NAVE',"THE MOTHER'S GARDEN"],glass:['THE MIRROR HALL','THE SINGING SHELF','THE COLD THROAT','THE FROZEN THRONE'],
 ossuary:['THE LONG SHELVES','THE COUNTING ROOM','THE MARROW WALK','THE LAST ALTAR']};
/* four new foes, one family per variant stratum */
Object.assign(FOES,{
 puffcap:{n:'PUFFCAP',hp:30,sp:24,dmg:12,r:6,c:'#5ad0b0',b:'puff'},
 shardling:{n:'SHARDLING',hp:44,sp:30,dmg:10,r:7,c:'#a8d8f8',b:'chase',split:'mite'},
 mite:{n:'GLASS MITE',hp:12,sp:60,dmg:6,r:4,c:'#e0f4ff',b:'chase'},
 bonehound:{n:'BONEHOUND',hp:34,sp:46,dmg:11,r:6,c:'#d8ccb8',b:'lunge'}});
FOES.shade.fly=FOES.wisp.fly=true;
const FOECOST={grub:1,mite:1,wisp:2,shade:2,puffcap:2,bonehound:2};

function curTrack(r){r=r||RUN;return r&&r.track&&r.track[(r.chamber||1)-1]}
function stratumOf(r){r=r||RUN;const T=curTrack(r);return STRATA.find(s=>s.id===(T&&T.st))||STRATA[[0,2,4][(r&&r.biome)||0]]}
function stageOf(r){const T=curTrack(r);return T?T.ty:'fight'}
function chamberTitle(){const S=stratumOf();if(S.variant)return VARNAMES[S.id][(RUN.chamber-1)%4];return(CHNAMES[RUN.chamber-1]||{n:S.n}).n}
function bossTitle(e){const S=stratumOf();return S.boss||BOSSES[e.bossIx].n}

/* ---------------- the track ---------------- */
const LAYS={fight:['scatter','pillars','walls','ring','diag','open','pillars','walls'],pit:['chasm','holes','chasm'],swarm:['open','pillars','ring'],trap:['vents'],cache:['open'],rest:['open']};
function genTrack(classic){RD.seenStrata=RD.seenStrata||{};const T=[];let rest=false;
 for(let a=0;a<3;a++){const opts=STRATA.filter(s=>s.act===a);let st=opts[0];
  if(!classic){const v=opts[1];st=Math.random()<(RD.seenStrata[v.id]?.5:.7)?v:opts[0]}
  const tys=[];for(let k=0;k<3;k++){const ch=a*4+k+1;let ty='fight';
   if(!classic&&ch>1){const pool=['fight','fight','pit','pit','swarm','trap'];if(k<2)pool.push('cache');if(!rest&&a>0&&k<2)pool.push('rest');ty=pool[(Math.random()*pool.length)|0];if(ty==='rest')rest=true}
   tys.push(ty)}
  const quiet=t=>t==='cache'||t==='rest';if(quiet(tys[1])&&quiet(tys[2]))tys[1]='fight';if(quiet(tys[0])&&quiet(tys[1]))tys[0]='fight';
  const combat=tys.map((t,i)=>quiet(t)||(a===0&&i===0)?-1:i).filter(i=>i>=0);
  const el=classic?[2,2,1][a]:combat[(Math.random()*combat.length)|0];
  tys.forEach((ty,k)=>{const L=LAYS[ty];T.push({ch:a*4+k+1,act:a,st:st.id,ty,elite:k===el,lay:classic?'scatter':L[(Math.random()*L.length)|0]})});
  T.push({ch:a*4+4,act:a,st:st.id,ty:'boss',lay:'scatter'})}
 return T}

/* ---------------- room layouts ---------------- */
function inPit(x,y,m){const P=RUN&&RUN.pits;if(!P)return false;m=m||0;for(const o of P)if(x>o.x+m&&x<o.x+o.w-m&&y>o.y+m&&y<o.y+o.h-m)return true;return false}
function laneOk(x,y,w,h,pad){pad=pad||0;
 if(x<W/2+64+pad&&x+w>W/2-64-pad&&y<80+pad)return false;           /* the reward doors and the lane in front of them */
 if(y+h>H-46-pad&&x<W/2+54+pad&&x+w>W/2-54-pad)return false;          /* where the keepers land */
 const cx=clamp(W/2,x,x+w),cy=clamp(H/2,y,y+h);if(Math.hypot(cx-W/2,cy-H/2)<26+pad)return false; /* the middle (sprout pods) */
 return x>13&&x+w<W-13&&y>32&&y+h<H-11}
function blockedAt(x,y,O,P){if(x<18||x>W-18||y<36||y>H-14)return true;for(const o of O)if(x>o.x-7&&x<o.x+o.w+7&&y>o.y-7&&y<o.y+o.h+7)return true;
 for(const o of P)if(x>o.x-5&&x<o.x+o.w+5&&y>o.y-5&&y<o.y+o.h+5)return true;return false}
/* is there a walkable way from where the keepers land to the doors, and is most of the floor reachable? */
function layoutOk(O,P){const C=5,nx=Math.ceil(W/C),ny=Math.ceil(H/C),seen=new Uint8Array(nx*ny),q=[];let free=0,got=0,door=false;
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)if(!blockedAt(i*C+2.5,j*C+2.5,O,P))free++;
 const s=[Math.floor(W/2/C),Math.floor((H-26)/C)];if(blockedAt(s[0]*C+2.5,s[1]*C+2.5,O,P))return false;q.push(s);seen[s[1]*nx+s[0]]=1;
 while(q.length){const [i,j]=q.pop();got++;const y=j*C+2.5,x=i*C+2.5;if(y<50&&Math.abs(x-W/2)<46)door=true;
  for(const [di,dj] of[[1,0],[-1,0],[0,1],[0,-1]]){const a=i+di,b=j+dj;if(a<0||b<0||a>=nx||b>=ny||seen[b*nx+a])continue;seen[b*nx+a]=1;if(!blockedAt(a*C+2.5,b*C+2.5,O,P))q.push([a,b])}}
 return door&&got>free*.9}
function genLayout(lay){for(let tries=0;tries<12;tries++){const L=buildLayout(lay);if(layoutOk(L.obst,L.pits))return L}return{obst:[],pits:[],vents:null}}
function buildLayout(lay){const O=[],P=[];let V=null;const add=(x,y,w,h)=>{if(laneOk(x,y,w,h,2))O.push({x,y,w,h,s:Math.random()})};
 if(lay==='scatter'){const n=2+((Math.random()*3)|0);for(let i=0;i<n;i++)add(22+Math.random()*(W-80),38+Math.random()*(H-90),14+Math.random()*22,10+Math.random()*10)}
 else if(lay==='pillars'){const cols=3+((Math.random()*2)|0),rows=2,s=10+Math.random()*4;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)add(36+c*(W-72-s)/(cols-1)+R(-5,5),84+r*62+R(-6,6),s,s)}
 else if(lay==='walls'){for(const x of[62+R(-6,6),W-70+R(-6,6)]){const gap=70+Math.random()*70;add(x,48,8,gap-48-17);add(x,gap+17,8,H-48-(gap+17))}}
 else if(lay==='ring'){for(const a of[0,Math.PI,.75,Math.PI-.75]){const x=W/2+Math.cos(a)*62,y=H/2+Math.sin(a)*50;const v=a===0||a===Math.PI;add(x-(v?7:16),y-(v?16:6),v?14:32,v?32:12)}}
 else if(lay==='diag'){const f=Math.random()<.5?1:-1;for(let i=0;i<5;i++){const t=i/4,x=W/2+f*(t-.5)*(W-90),y=70+t*(H-140);add(x-9,y-7,18,14)}}
 else if(lay==='open'){if(Math.random()<.6){add(24,90+R(0,40),12,12);add(W-36,90+R(0,40),12,12)}}
 else if(lay==='chasm'){const y=92+R(0,20),h=16+R(0,8),bx=Math.random()<.5?R(30,80):R(W-110,W-56),bw=24;
  /* a crack across the room: a bridge in the middle and one more off to the side */
  const cuts=[[W/2-22,W/2+22],[bx,bx+bw]].sort((a,b)=>a[0]-b[0]);let x0=14;for(const [a,b] of cuts){if(a-x0>6)P.push({x:x0,y,w:a-x0,h});x0=b}if(W-14-x0>6)P.push({x:x0,y,w:W-14-x0,h});
  if(Math.random()<.6){add(30,y+h+30,12,12);add(W-42,y+h+30,12,12)}}
 else if(lay==='holes'){const n=4+((Math.random()*3)|0);for(let i=0;i<n*3&&P.length<n;i++){const w=22+R(0,20),h=14+R(0,12),x=20+Math.random()*(W-40-w),y=44+Math.random()*(H-100-h);
  if(laneOk(x,y,w,h,8)&&!P.some(o=>x<o.x+o.w+14&&x+w>o.x-14&&y<o.y+o.h+14&&y+h>o.y-14))P.push({x,y,w,h})}}
 else if(lay==='vents'){if(Math.random()<.7){add(30,110,14,14);add(W-44,110,14,14)}V=[];
  for(let i=0;i<40&&V.length<7;i++){const x=28+Math.random()*(W-56),y=50+Math.random()*(H-110);if(laneOk(x-8,y-8,16,16,0)&&!V.some(v=>Math.hypot(v.x-x,v.y-y)<34))V.push({x,y,ph:Math.random()*3.4})}}
 return{obst:O,pits:P,vents:V}}

/* ---------------- a chamber begins ---------------- */
function dunLayout(ch){RUN.pits=[];RUN.vents=null;RUN.swarm=null;RUN.well=null;RUN.cache=null;const T=curTrack();
 if(T&&T.ty!=='boss'&&T.lay!=='scatter'){const L=genLayout(T.lay);RUN.obst=L.obst.map(o=>({...o,biome:RUN.biome}));RUN.pits=L.pits;RUN.vents=L.vents}
 if(ch===1||ch===5||ch===9){const S=stratumOf();RD.seenStrata=RD.seenStrata||{};RD.seenStrata[S.id]=1;RUN.actCard={t:4.2}}}
function dunElite(ch){const T=curTrack();return T?!!T.elite:(ch===3||ch===7||ch===10)}
function dunChatter(ch){const S=stratumOf();if(!(ch===1||ch===5||ch===9)){if(ch!==4&&ch!==8&&ch!==12)chatter('start');return}
 if(ch===5&&S.id==='vault')chatter('vault',true);else if(ch===9&&S.id==='core')chatter('core',true);else if(S.variant)chatter(S.id,true);else chatter('start')}
/* no fight here: a cache to loot, or a well to rest at */
function dunQuiet(ch){const T=curTrack();if(!T||(T.ty!=='cache'&&T.ty!=='rest'))return false;RUN.elite=false;RUN.zoneT=2;RUN.wave2=null;
 if(T.ty==='cache'){RUN.cache={x:W/2+R(-30,30),y:H/2-18};for(let i=0;i<18;i++){const a=i/18*6.283;RUN.pickups.push({kind:'petal',val:2,x:RUN.cache.x+Math.cos(a)*R(8,26),y:RUN.cache.y+Math.sin(a)*R(6,18),vx:0,vy:0})}
  for(let i=0;i<3;i++)RUN.pickups.push({kind:'dew',val:3,x:RUN.cache.x+R(-14,14),y:RUN.cache.y+R(-8,8),vx:0,vy:0});if(Math.random()<.3)RUN.pickups.push({kind:'honey',val:1,x:RUN.cache.x,y:RUN.cache.y+10,vx:0,vy:0});
  say2('A QUIET CACHE. NOBODY HOME.',2.6)}
 else{RUN.well={x:W/2,y:H/2+8};for(const p of PL){if(p.down){p.down=false;p.revT=0;p.hp=rdStats(p).maxHp*.3}rdHeal(rdStats(p).maxHp*.3,p)}say2('THE WELL. EVERYONE DRINKS.',2.6);snd(523,.3,784,'sine',.05)}
 chamberCleared();return true}
/* a fight with a twist */
function dunFight(ch){const T=curTrack();if(!T)return;const G=STAGES[T.ty];
 if(T.ty==='swarm'){RUN.wave2=null;RUN.swarm={t:20+Math.min(10,ch),sp:1.4}}
 if(T.ty==='trap')RUN.wave2=null;
 if(G.hint&&T.ty!=='fight')later(()=>{if(RUN&&RUN.chamber===ch)say2(G.n+'  ·  '+G.hint,2.6)},RUN.elite?2100:300)}
function dunHold(){return!!(RUN.swarm&&RUN.swarm.t>0)}
function edgeSpot(){for(let i=0;i<30;i++){const side=(Math.random()*3)|0,x=side===0?R(30,W-30):side===1?20:W-20,y=side===0?40:R(46,H*.6);
  if(inPit(x,y,-8)||PL.some(p=>Math.hypot(p.x-x,p.y-y)<70))continue;return[x,y]}return spawnSpot()}

/* ---------------- every frame ---------------- */
const VPER=3.4,VBURST=2.6;
function dunUpdate(dt){if(RUN.actCard){RUN.actCard.t-=dt;if(RUN.actCard.t<=0)RUN.actCard=null}
 /* pits: keepers fall in unless they're dashing; foes only go in if something put them there */
 if(RUN.pits&&RUN.pits.length){for(const p of PL){if(p.down)continue;if(p.dashT<=0&&!((p.land||0)>.3)&&inPit(p.x,p.y,1)){playerFall(p);if(!RUN)return}else if(!inPit(p.x,p.y,-9))p.safe=[p.x,p.y]}
  for(const e of RUN.enemies.slice())if(!e.dead&&e.kind!=='boss'&&!FOES[e.kind].fly&&!((e.z||0)>1)&&!(e.born>0)&&inPit(e.x,e.y,1))foeFall(e,null)}
 /* vents: glow, then a column of flame */
 if(RUN.vents&&RUN.phase==='fight')for(const v of RUN.vents){const was=v.ph;v.ph=(v.ph+dt)%VPER;
  if(was<VBURST&&v.ph>=VBURST){v.hit=[];snd(150,.25,90,'sawtooth',.04);RUN.parts.push({x:v.x,y:v.y,vx:0,vy:0,z:4,vz:60,life:.4,c:'#f8a040'})}
  if(v.ph>=VBURST&&v.ph<VBURST+.45){v.hit=v.hit||[];for(const p of PL)if(!p.down&&!v.hit.includes(p)&&Math.hypot(p.x-v.x,p.y-v.y)<12){v.hit.push(p);RUN.hitBy='vent';damagePlayer(p,13*foeScale().dmg);if(!RUN)return}
   for(const e of RUN.enemies.slice())if(!e.dead&&e.kind!=='boss'&&!v.hit.includes(e)&&Math.hypot(e.x-v.x,e.y-v.y)<12+e.r*.5){v.hit.push(e);e.hp-=22;e.flash=.12;e.burn=Math.max(e.burn,1.5);e.burnDps=Math.max(e.burnDps,4);ftext(e.x,e.y-e.r-4,'22','#f8a040');if(e.hp<=0)killEnemy(e)}}}
 /* the swarm: they keep coming until it breaks */
 const S=RUN.swarm;if(S&&RUN.phase==='fight'){S.t-=dt;S.sp-=dt;const cap=5+PL.length*2+Math.floor(RUN.chamber/3);
  if(S.sp<=0&&S.t>2&&RUN.enemies.length<cap){S.sp=R(.7,1.4)*(PL.length>1?.8:1);const pool=stratumOf().pool,k=pool[(Math.random()*pool.length)|0],q=edgeSpot();spawnFoe(k,q[0],q[1],false)}
  if(S.t<=0){RUN.swarm=null;say2('THE SWARM BREAKS!',2.2);RUN.petals+=20;ftext(lead().x,lead().y-16,'+20 PETALS','#ffd94d');for(const e of RUN.enemies.slice())if(e.kind!=='boss')killEnemy(e);snd(392,.12);later(()=>snd(523,.2),120)}}}
function playerFall(p){const s=p.safe||[W/2,H-26];burst(p.x,p.y,'#3a2c58',10,30);RUN.hitBy='pit';p.inv=0;damagePlayer(p,rdStats(p).maxHp*.12);if(!RUN)return;
 p.x=s[0];p.y=s[1];p.vx=p.vy=0;p.inv=1;p.land=.5;ftext(p.x,p.y-18,'FELL!','#c8b8e8');snd(300,.3,80,'triangle',.06)}
function foeFall(e,p){if(e.dead)return;const pit=RUN.pits.find(o=>e.x>o.x&&e.x<o.x+o.w&&e.y>o.y&&e.y<o.y+o.h);
 ftext(e.x,e.y-10,'FELL!','#c8b8e8');burst(e.x,e.y,'#3a2c58',8,26);snd(420,.25,90,'triangle',.05);RD.stats.pitKills=(RD.stats.pitKills||0)+1;
 /* loot lands on the nearest edge, not at the bottom */
 if(pit){const c=[[pit.x-6,e.y],[pit.x+pit.w+6,e.y],[e.x,pit.y-6],[e.x,pit.y+pit.h+6]].sort((a,b)=>Math.hypot(a[0]-e.x,a[1]-e.y)-Math.hypot(b[0]-e.x,b[1]-e.y))[0];e.x=c[0];e.y=c[1]}
 if(e.elite){e.hp-=e.max*.35;e.flash=.2;const q=spawnSpot();e.x=q[0];e.y=q[1];e.born=.5;ftext(e.x,e.y-12,'IT CLIMBS OUT','#f8d030');if(e.hp<=0)killEnemy(e);return}
 if(p)p.kills=(p.kills||0)+1;killEnemy(e)}
/* knocked by a hit: walls stop them, pits don't */
function dunKnocked(e,p){if(RUN.pits&&RUN.pits.length&&e.kind!=='boss'&&!FOES[e.kind].fly&&inPit(e.x,e.y,1))foeFall(e,p)}
function dunCollidePits(e,rr){if(!RUN.pits||!RUN.pits.length||e.dev||e.knock||e.kind==='boss'||(FOES[e.kind]&&FOES[e.kind].fly))return;
 for(const o of RUN.pits){const nx=Math.max(o.x,Math.min(e.x,o.x+o.w)),ny=Math.max(o.y,Math.min(e.y,o.y+o.h)),dx=e.x-nx,dy=e.y-ny,d=Math.hypot(dx,dy);
  if(d<rr&&d>0){e.x=nx+dx/d*rr;e.y=ny+dy/d*rr}else if(d===0){const c=[[o.x-rr,e.y],[o.x+o.w+rr,e.y],[e.x,o.y-rr],[e.x,o.y+o.h+rr]].sort((a,b)=>Math.hypot(a[0]-e.x,a[1]-e.y)-Math.hypot(b[0]-e.x,b[1]-e.y))[0];e.x=c[0];e.y=c[1]}}}
/* new foes: what they do */
function dunFoe(e,dt,T,d,B){
 if(B==='puff'){if(e.state===0){foeMove(e,dt,T.x,T.y,e.sp);if(d<26){e.state=1;e.t=.75;snd(300,.3,640,'sine',.04)}}
  else{e.t-=dt;e.mv=0;if(e.t<=0){e.popped=true;puffBurst(e,true);killEnemy(e)}}return true}
 if(B==='lunge'){if(e.state===0){foeMove(e,dt,T.x,T.y,e.sp);if(d<66&&e.cd<=0){e.state=1;e.t=.38}}
  else if(e.state===1){e.t-=dt;e.yaw=Math.atan2(T.x-e.x,T.y-e.y);if(e.t<=0){e.state=2;e.t=.24;const a=Math.atan2(T.y-e.y,T.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a);snd(260,.06,520)}}
  else{e.t-=dt;e.x+=e.sx*300*dt;e.y+=e.sy*300*dt;e.mv=1;collide(e,e.r);if(e.t<=0){e.state=0;e.cd=1.1+Math.random()*.7}}return true}
 return false}
function puffBurst(e,now){RUN.hazards.push({x:e.x,y:e.y,r:26,t:now?.02:.5,dmg:e.dmg*(now?1:.8),from:'foe',by:'puffcap'});
 for(let i=0;i<14;i++)RUN.parts.push({x:e.x+R(-6,6),y:e.y+R(-6,6),vx:R(-50,50),vy:R(-50,50),z:5,vz:R(10,40),life:R(.4,.8),c:i%2?'#5ad0b0':'#c8fff0'})}
function dunOnKill(e){const F=FOES[e.kind];if(!F)return;
 if(e.kind==='puffcap'&&!e.popped){e.popped=true;puffBurst(e,false)}
 if(F.split&&RUN.phase==='fight')for(const s of[-1,1]){const m=spawnFoe(F.split,e.x+s*7,e.y+R(-3,3),false);m.born=.25}}

/* ---------------- drawing ---------------- */
function dunProps(){if(PROP.shroom)return;let b=new MB();b.cyl(0,0,0,1.6,1.2,5,6,'#d8e8d0','#f0fff0');b.sph(0,5.4,0,4.6,2.6,4.6,8,5,'#2a8a78','#6ae0c0');b.box(-2,7,1.4,1.1,.5,1.1,'#e8fff0');b.box(1.6,7.2,-1.2,1,.5,1,'#e8fff0');PROP.shroom=b.done();
 b=new MB();b.cyl(0,0,0,9,9,2.4,12,'#5a6a78','#8a9aa8');b.cyl(0,2.4,0,7.6,7.6,.4,12,'#2a5a7a','#3f8ab0');PROP.well=b.done()}
function buildFoes2(){let b;
 b=new MB();b.cyl(0,0,0,2.2,1.8,5,6,'#c8d8c0','#f0fff0');b.sph(0,6,0,5.6,3.6,5.6,8,5,'#1f7a68','#5ad0b0');for(const [x,z] of[[-2.6,1.6],[2.2,2.2],[0,-2.8],[-1,3.4],[3,-1]])b.box(x,8.6,z,1.2,.6,1.2,'#e8fff0');
 b.box(-1,3,1.9,.8,1.2,.5,'#141a18');b.box(1,3,1.9,.8,1.2,.5,'#141a18');FOE.puffcap=b.done();
 b=new MB();b.sph(0,3.2,0,3.8,3,3.8,7,5,'#5a7aa0','#9ac8f0');for(const [rx,rz,h] of[[0,0,8],[.5,.3,6],[-.5,.4,6.5],[.3,-.5,5.5],[-.4,-.4,5]])b.xf(rx*3,4,rz*3,rz,0,-rx).cyl(0,0,0,1.6,0,h,5,'#a8d8f8','#f0faff').rst();
 b.box(-1.4,3.4,3.6,1,1.2,.5,'#141c28');b.box(1.4,3.4,3.6,1,1.2,.5,'#141c28');for(const z of[-2,1.6]){b.box(-3.6,.6,z,1.2,1.2,1,'#5a7aa0');b.box(3.6,.6,z,1.2,1.2,1,'#5a7aa0')}FOE.shardling=b.done();
 b=new MB();b.cyl(0,1.2,0,2,0,4.6,5,'#a8d8f8','#f4fbff');b.sph(0,1.4,0,2,1.4,2,6,4,'#7aa8d0','#c8e8ff');b.box(-.7,1.8,1.7,.6,.7,.4,'#141c28');b.box(.7,1.8,1.7,.6,.7,.4,'#141c28');
 for(const z of[-1,1]){b.box(-2.2,.4,z,1.2,.5,.6,'#7aa8d0');b.box(2.2,.4,z,1.2,.5,.6,'#7aa8d0')}FOE.mite=b.done();
 b=new MB();b.box(0,5.2,-.5,4.2,3.4,9,'#a89c88','#e0d6c4');for(const z of[-3,-1,1])b.box(0,5.2,z,5,3.8,.8,'#e8e0d0');b.box(0,6.6,5.6,4.4,3.8,4.4,'#c8bca8','#f0e8d8');b.box(0,5.2,7.6,3,1.6,2.4,'#d8ccb8');
 b.box(-1.2,7.4,7.9,1,1,.5,'#f86040');b.box(1.2,7.4,7.9,1,1,.5,'#f86040');for(const [x,z] of[[-1.8,3],[1.8,3],[-1.8,-3.6],[1.8,-3.6]])b.box(x,2,z,1.2,4.2,1.2,'#c8bca8');b.xf(0,6,-5.4,.6,0,0).box(0,0,-1.6,.8,.8,3.4,'#c8bca8').rst();FOE.bonehound=b.done()}
function dunDrawFoe(k,e,o,close,hov){if(!FOE[k])return false;
 if(k==='puffcap'){const sw=e.state===1?1+(1-e.t/.75)*.55:1;mT(0,Math.abs(Math.sin(time*7+e.x))*(e.mv?.8:.2),0);mS(sw,sw*(e.state===1?.92:1),sw);draw(FOE.puffcap,e.state===1?{add:(o.add||0)+(Math.sin(time*40)>0?.35:.05),c:o.c}:o)}
 else if(k==='shardling'){mRY(Math.sin(time*2+e.x)*.15);mT(0,Math.abs(Math.sin(time*8+e.x))*(e.mv?.7:0),0);draw(FOE.shardling,o)}
 else if(k==='mite'){mT(R(-.2,.2),Math.abs(Math.sin(time*18+e.x))*1.2,0);draw(FOE.mite,o)}
 else if(k==='bonehound'){if(e.state===1){mT(R(-.4,.4),-1.2,-1);mRX(.22)}else if(e.state===2){mS(.9,.95,1.25);mRX(-.12)}else mT(0,Math.abs(Math.sin(time*12+e.x))*(e.mv?1.2:0),0);draw(FOE.bonehound,e.state===1?{add:(o.add||0)+.2,c:o.c}:o)}
 return true}
function dunDraw(){const S=stratumOf();
 for(const o of RUN.pits||[]){const cx=o.x+o.w/2,cz=o.y+o.h/2;mPush();mT(cx,.25,cz);mS(o.w,.4,o.h);drawT(MESH.cube,{c:[0,0,0],a:1,unlit:true});mPop();
  mPush();mT(cx,.3,cz);mS(o.w-3,.4,o.h-3);drawT(MESH.cube,{c:hex(S.col).map(v=>v*.12),a:1,unlit:true});mPop();
  for(let i=0;i<3;i++){const t=(time*.35+i*.33+o.x*.01)%1;sprite(o.x+((i*37+o.x)%o.w),t*14,o.y+((i*23+o.y)%o.h),5,hex(S.col),.25*(1-t),true)}}
 for(const v of RUN.vents||[]){mPush();mT(v.x,.35,v.y);mS(9);drawT(MESH.disc,{c:[.14,.08,.06],a:1,unlit:true});mPop();
  const ph=v.ph;if(ph>1.8&&ph<VBURST){const u=(ph-1.8)/.8;mPush();mT(v.x,.5,v.y);mS(12*u);drawT(MESH.ring,{c:hex('#f8a040'),a:.9,unlit:true,glow:true});mPop();sprite(v.x,3,v.y,10+u*10,hex('#f07830'),.4*u,true)}
  else if(ph>=VBURST&&ph<VBURST+.5&&RUN.phase==='fight'){const u=(ph-VBURST)/.5,hgt=Math.sin(u*3.14159)*46+6;mPush();mT(v.x,0,v.y);mS(7,hgt,7);drawT(MESH.cyl,{c:hex('#f07830'),a:.7,unlit:true,glow:true,nocull:true});mPop();
   mPush();mT(v.x,0,v.y);mS(3,hgt*1.05,3);drawT(MESH.cyl,{c:hex('#fff3b0'),a:.45,unlit:true,glow:true,nocull:true});mPop();sprite(v.x,hgt,v.y,22,hex('#f8a040'),.7,true)}
  else sprite(v.x,1.5,v.y,6,hex('#f07830'),.25+.1*Math.sin(time*3+v.x),true)}
 if(RUN.well){const w=RUN.well;prop(PROP.well,w.x,0,w.y,0,1);shadow(w.x,w.y,11);sprite(w.x,4,w.y,40,hex('#7fd0e8'),.25+.08*Math.sin(time*2),true);const t=(time*.5)%1;sprite(w.x+Math.sin(time)*3,3+t*18,w.y,2.2,hex('#bdeffb'),1-t,true)}
 if(RUN.cache){const c=RUN.cache;prop(PROP.pack,c.x-14,0,c.y-4,.4,1.2);prop(PROP.camp,c.x+12,0,c.y-6,0,1.1);prop(PROP.crate,c.x,0,c.y-14,.2,.9);shadow(c.x,c.y,14)}}
/* each stratum's air */
function dunAmbience(S){for(let i=0;i<10;i++){const px=(i*67+RUN.chamber*31)%(W-30)+15,pz=36+((i*41+RUN.chamber*17)%(H-52));
 if(S.amb==='spores'){const t=(time*.15+i*.21)%1;sprite(px+Math.sin(time*.7+i)*6,t*36,pz,2,hex('#7af0d0'),.6*(1-t),true)}
 else if(S.amb==='snow'){const t=(time*.1+i*.17)%1;sprite(px+Math.sin(time*.5+i)*8,44-t*44,pz,1.6,[.95,.97,1],.7*(1-t*.5),true);if(i<4){mPush();mT(px,.3,pz);mS(8,1,6);drawT(MESH.disc,{c:hex('#c8e8ff'),a:.12,unlit:true});mPop()}}
 else if(S.amb==='dust'){const t=(time*.06+i*.19)%1;sprite(px+t*20-10,8+Math.sin(time+i)*3,pz,2.4,hex('#c8bca8'),.35*Math.sin(t*3.14159),true)}}}

/* ---------------- the track, on screen ---------------- */
function trackStrip(y,w,labels){const T=RUN&&RUN.track;if(!T)return;const n=T.length,x0=(VW-w)/2,step=w/(n-1),cur=RUN.chamber-1;
 for(let a=0;a<3;a++){const S=STRATA.find(s=>s.id===T[a*4].st)||STRATA[a*2],xa=x0+a*4*step-4,xb=x0+(a*4+3)*step+4;r(S.col,xa,y-1,xb-xa,2);if(labels)ctext(S.n,y-17,1,S.col,'#120a18',(xa+xb)/2)}
 T.forEach((t,i)=>{const x=Math.round(x0+i*step),G=STAGES[t.ty],big=t.ty==='boss',s=big?8:6,past=i<cur,on=i===cur;
  if(on){r('#ffffff',x-s/2-2,y-s/2-2,s+4,s+4)}r('#120a18',x-s/2-1,y-s/2-1,s+2,s+2);r(past?'#4a4258':G.c,x-s/2,y-s/2,s,s);
  if(t.elite&&!past)r('#f8d030',x-1,y-s/2-4,2,2)});
 if(labels){const nx=T[cur];if(nx)ctext('NOW: '+STAGES[nx.ty].n,y+9,1,'#ffffff','#120a18')}}
function dunHud(){const S=stratumOf();
 if(RUN.swarm&&RUN.swarm.t>0){const t=Math.ceil(RUN.swarm.t);ctext('HOLD OUT  '+t,30,2,t<=5?'#a8f080':'#f07878','#120a18')}
 if(RUN.actCard){const t=RUN.actCard.t,a=clamp(Math.min((4.2-t)/.4,t/.5),0,1);hx.globalAlpha=a;const y=VH*.6;r('rgba(10,6,16,.55)',0,y-28,VW,58);
  ctext('DEPTH '+(Math.floor((RUN.chamber-1)/4)+1)+(S.variant?'  ·  NOBODY HAS MAPPED THIS':''),y-26,1,'#c8c0d8',null);trackStrip(y+4,Math.min(VW-40,330),true);hx.globalAlpha=1}
 else if(RUN.phase==='doors'&&RUN.track&&RUN.chamber<12){const nx=RUN.track[RUN.chamber];trackStrip(VH-34,Math.min(VW*.55,220),false);
  if(nx)ctext('NEXT: '+(STAGES[nx.ty].n)+(nx.st!==curTrack().st?'  ·  DOWN INTO '+STRATA.find(s=>s.id===nx.st).n:''),VH-26,1,STAGES[nx.ty].c,'#120a18')}}

/* ---------------- online ---------------- */
function dunNet(){if(!RUN)return 0;const T=RUN.track;
 return[T?T.map(t=>STIDS.indexOf(t.st)+''+STKEYS.indexOf(t.ty)+(t.elite?1:0)).join(''):'',(RUN.pits||[]).map(p=>[r1(p.x),r1(p.y),r1(p.w),r1(p.h)]),RUN.vents?RUN.vents.map(v=>[r1(v.x),r1(v.y),r2(v.ph)]):0,
  RUN.swarm?r2(RUN.swarm.t):0,RUN.actCard?r2(RUN.actCard.t):0,RUN.well?1:0,RUN.cache?[r1(RUN.cache.x),r1(RUN.cache.y)]:0]}
function dunNetApply(g){if(!g||!RUN)return;if(g[0]&&RUN._tk!==g[0]){RUN._tk=g[0];RUN.track=[];for(let i=0;i<g[0].length;i+=3)RUN.track.push({ch:i/3+1,st:STIDS[+g[0][i]],ty:STKEYS[+g[0][i+1]],elite:g[0][i+2]==='1'})}
 RUN.pits=(g[1]||[]).map(a=>({x:a[0],y:a[1],w:a[2],h:a[3]}));RUN.vents=g[2]?g[2].map(a=>({x:a[0],y:a[1],ph:a[2]})):null;RUN.swarm=g[3]?{t:g[3]}:null;RUN.actCard=g[4]?{t:g[4]}:null;
 RUN.well=g[5]?{x:W/2,y:H/2+8}:null;RUN.cache=g[6]?{x:g[6][0],y:g[6][1]}:null}

/* ---------------- what the keepers say about the new places ---------------- */
{const C={ERIN:{grotto:["These mushrooms are glowing. That's either beautiful or a warning.","Don't touch the caps. I mean it. Don't even look at them hard."],glass:["It's like the whole cave is holding its breath.","Careful. Everything in here is sharp and pretty. Like Marcus, but sharp."],ossuary:["Somebody stacked all these. Neatly. That's the scary part.","Bones don't scare me. Tidy bones scare me."]},
 MARCUS:{grotto:["Bro, the floor's breathing. I don't like a breathing floor.","Idea: we don't eat anything in here. Even if it looks like a snack."],glass:["Everything in here's a mirror. I look great. This is a trap.","Bro, if I break one of these is it seven years bad luck? Asking for me."],ossuary:["It's a closet. A big closet. Full of guys who lost.","Okay, I'm not scared, I'm respectful. There's a difference. Shut up."]},
 LOUIE:{grotto:["SNIFF. (It smells like a forest that went to sleep and had a bad dream.)","AH-CHOO. (Spores. Everywhere. He sneezes on principle.)"],glass:["WHINE. (His paws are cold. The floor sings when he walks. He does not like that.)","ARF? (There is another Louie in the wall. He is very handsome.)"],ossuary:["...WOOF. (So many bones. He has never seen so many bones. He must be very, very good.)","GRRR. (These bones walk. Bones should not walk. Bones should be chewed.)"]},
 WILL:{grotto:["The Lantern's light bends wrong in here. Like it's being breathed on.","Stay close. The glow makes it hard to tell what's moving."],glass:["I can see us a hundred times in the walls. Only one of us has to make it out.","Listen. The whole cave rings when something moves."],ossuary:["Somebody kept count down here. Every one of them.","Keep the light up. These ones remember it."]}};
 for(const k in C)if(CHATTER[k])Object.assign(CHATTER[k],C[k])}
