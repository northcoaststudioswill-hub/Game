/* ================================================================
   THE OPENING, EARNED (v8.0)
   Will's notes: the first sprouts popped up by the Lantern and then
   came from a garden nobody explained; things were explained too fast;
   Louie and Erin talked over each other in the Meadow; the first fight
   could start by accident. Now:
   1. Sunkeep is dark. Louie finds a berry and carries it to the Great
      Lantern. It flickers and drops three seeds into the garden.
   2. You watch them grow there (seed, shoot, sprout) and pluck them.
   3. Your sprouts carry berries to the Lantern and wake it (as before).
   4. After your buddy joins, Erin walks you to the south road, and in
      the Meadow she walks you to a calm wild buddy for your first
      catch. No battle can start before that first catch.
   ================================================================ */
WSEEDPOS[0]=[208,351];WSEEDPOS[2]=[240,351];WSEEDPOS[4]=[272,351]; /* on the top row of garden plots, where garden sprouts stand */
/* messages stay up long enough to read */
function swSay(s,t){W4.msg=s;W4.msgT=Math.max(t||2.2,1.4+String(s).length*.055)}
/* ---- 1. Louie's berry ---- */
function louFetchTick(dt){const L=louSt(),B=W4.louBerry;if(W4.lsay){W4.lsay.t-=dt;if(W4.lsay.t<=0)W4.lsay=null}
 if(!B){W4.louFetch=3;return}
 if(W4.louFetch===1){if(louGo(L,B.x+(lou.x<B.x?-9:9),B.y,78,dt)<4){B.held=1;W4.louFetch=2;louSay('!',1);swSnd(880,.05,1320)}}
 else if(W4.louFetch===2){if(louGo(L,240,114,78,dt)<5){W4.louBerry=null;W4.louFetch=3;L.fx=-1;louSay('WOOF!',1.6);swSnd(700,.06,500)}}}
function plantFirst(){SW.louFed=1;const F=W4.bf;if(!F)return;SW.seeds=SW.seeds&&SW.seeds.length?SW.seeds:[0,2,4];
 F.buds=SW.seeds.map((ty,i)=>({type:ty,x:WSEEDPOS[ty][0],y:WSEEDPOS[ty][1],g:SCOFF?1:0,dl:1.1+i*.5}));
 W4.arcs=SW.seeds.map((ty,i)=>({t:-i*.25,ty,tx:WSEEDPOS[ty][0],tyy:WSEEDPOS[ty][1]}));swSnd(784,.12,1175);swSave()}
function seedGrow(dt){const F=W4.bf;if(!F)return;for(const b of F.buds)if(b.g!=null&&b.g<1){b.dl=(b.dl||0)-dt;if(b.dl>0)continue;
 const g0=b.g;b.g=Math.min(1,b.g+dt/5.5);if(g0<1&&b.g>=1){b.glow=1;for(let i=0;i<6;i++)W4.floats.push({x:b.x+(Math.random()*12-6),y:b.y-6-Math.random()*10,txt:'*',t:.6,c:TYPES[b.type].l});swSnd(988,.05,1319)}}}
function scIntro(){W4.louBerry={x:316,y:214,held:0};W4.louFetch=0;
 scStart([{hold:.9},
  {who:'ERIN',txt:"You're up! The Great Lantern went out last night. All of Sunkeep is dark."},
  {who:'MARCUS',txt:"It runs on anything that grows, bro. Fruit, wood, stone. It just needs a first bite."},
  {who:'ERIN',txt:'Louie found a berry. Watch him.',fn:()=>{W4.louFetch=1}},
  {x:'lou',until:()=>W4.louFetch===3,tick:louFetchTick,max:14},
  {x:240,y:96,hold:1.6,fn:()=>{W4.wake=1.2;swSnd(523,.3,1046)}},
  {x:240,y:96,who:'ERIN',txt:'It flickered! Look, it is letting go of something.'},
  {x:240,y:300,hold:1.8,fn:plantFirst},
  {x:240,y:352,hold:2.4},
  {x:240,y:352,who:'ERIN',txt:'Seeds. They fell in the garden. This is where sprouts grow.'},
  {x:240,y:352,who:'MARCUS',txt:'Give them a sec. When one is grown, walk up and press A to pluck it.'},
  {hold:.4}])}
/* seeds draw as they grow: seed, shoot, sprout */
function fBudDraw(o){if(o.g!=null&&o.g<1){budGrow(o,o.dl>0?0:o.g);return}
 fBudDraw0(o)}
/* ONE growing look for the field and the garden (v8.1): gg 0..1 = seed, shoot, leafy head; the finished bud is drawn by drawBud */
function budGrow(o,gg){const x=Math.round(o.x),y=Math.round(o.y),T=TYPES[o.type];
  r('#5a3820',x-4,y,9,3);r('#3d2c1a',x-3,y+1,7,1);
  if(gg<.34){r('#2a1c10',x-2,y-3,5,4);r('#d8b070',x-1,y-2,3,2);r('#fff0c0',x-1,y-2,1,1);if(((time*3)|0)%2)r('#fff3b0',x+2,y-4,1,1)} /* a pale seed with a dark rim reads on the brown plot */
  else if(gg<.67){const h=2+Math.round((gg-.34)*12);r('#2c6030',x,y-h,1,h);r('#58b848',x-2,y-h,2,1);r('#58b848',x+1,y-h-1,2,1)}
  else{r('#2c6030',x,y-6,1,6);r(T.d,x-2,y-9,5,4);r(T.c,x-1,y-9,3,3)}}
function fBudDraw0(o){const x=Math.round(o.x),y=Math.round(o.y),T=TYPES[o.type],sw=Math.round(Math.sin(time*3+o.x)*1);
 if(o.glow){const fl=.5+.5*Math.sin(time*4+o.x);g.globalAlpha=.18+.14*fl;r(T.l,x-9,y-14,19,18);g.globalAlpha=.3+.2*fl;r('#fff3b0',x-5,y-11,11,12);g.globalAlpha=1}
 r('#5a3820',x-4,y,9,3);r('#3d2c1a',x-3,y+1,7,1);r('#2c6030',x,y-6,1,6);r(T.c,x-3+sw,y-9,3,3);r(T.c,x+1+sw,y-10,3,3);r(T.l,x-2+sw,y-9,1,1);
 if(((time*2+o.x)|0)%2)r('#fff3b0',x+5,y-12,1,1)}
function wNearExtra(px,py){const F=W4.bf;if(!F)return null;for(const b of F.buds)if(Math.hypot(px-b.x,py-b.y)<18)
  return b.g==null||b.g>=1?{k:'fbud',b,txt:'PLUCK'}:{k:'sproutinfo',txt:'GROWING',x:b.x,y:b.y,msg:'Still growing. Give it a moment.'};return null}
function opGoal0(){const F=W4.bf;if(!SW.louFed)return'Watch Louie';if(F&&F.buds.length&&F.buds.every(b=>b.g!=null&&b.g<1))return'The sprouts are growing in the garden';return'Pluck the sprouts in the garden'}
function wBaseArrive(from){const F=W4.bf;P3.x=240;P3.ax=0;P3.ay=-1;P3.y=from==='MEADOW'?(W4.wh||520)-38:SW.lit?152:170;
 lou.x=P3.x-24;lou.y=P3.y+8;W4.part={x:P3.x+16,y:P3.y+6};for(const s of F.sq){s.x=P3.x+(Math.random()*24-12);s.y=P3.y+10+Math.random()*10}
 if(SW.quest<2&&!SW.lit){if(!SW.seeds)SW.seeds=[0,2,4];
  F.buds=SW.louFed?SW.seeds.map(ty=>({type:ty,x:WSEEDPOS[ty][0],y:WSEEDPOS[ty][1],glow:1,g:1})):[];
  for(let i=(SW.fedN||0);i<3;i++)F.items.push({k:'pel',res:'berry',n:1,w:1,x:196+i*16,y:208+(i%2)*6,car:[],op:1})}
 if(SW.quest<2){W4.banner=null;SW.visited.BASE=1}
 wCastInit();W4.talk=null;W4.baseArrive=from?{x:P3.x,y:P3.y}:null;W4.cam=null;wCamUpdate(P3.x,P3.y)}
function opFx(){const B=W4.louBerry;if(B&&!B.held){r('#14101e',B.x-3,B.y-3,7,6);r('#e04838',B.x-2,B.y-2,5,4);r('#ff8070',B.x-1,B.y-2,1,1);r('#3a7d2e',B.x,B.y-4,2,2)}
 else if(B&&B.held){const L=louSt(),x=Math.round(lou.x)+(L.fx<0?-14:11),y=Math.round(lou.y)-2;r('#14101e',x-1,y-1,5,5);r('#e04838',x,y,3,3)}
 if(W4.arcs){for(const a of W4.arcs){a.t+=1/60;if(a.t<0)continue;const k=Math.min(1,a.t/1.1),x=240+(a.tx-240)*k,y=70+(a.tyy-70)*k-Math.sin(k*3.1416)*60,T=TYPES[a.ty];
   for(let i=1;i<5;i++){const k2=Math.max(0,k-i*.04),x2=240+(a.tx-240)*k2,y2=70+(a.tyy-70)*k2-Math.sin(k2*3.1416)*60;g.globalAlpha=.6-i*.12;r(T.l,Math.round(x2),Math.round(y2),2,2)}
   g.globalAlpha=1;if(k<1){r('#ffffff',Math.round(x)-2,Math.round(y)-2,5,5);r(T.c,Math.round(x)-1,Math.round(y)-1,3,3)}}W4.arcs=W4.arcs.filter(a=>a.t<1.3)}}
/* ---- the wake scene now that the garden is known ---- */
function scWake(){SW.beats=SW.beats||{};SW.beats.lit=1;const pop=()=>{wInitPatch();for(const pb of W4.patchBuds||[])if(pb.type>=0){for(let i=0;i<5;i++)W4.floats.push({x:pb.x+(Math.random()*14-7),y:pb.y-4-Math.random()*12,txt:'*',t:.5+Math.random()*.6,c:TYPES[pb.type].l})}swSnd(784,.12,1568)};
 scStart([
  {x:240,y:70,hold:1.9,fn:()=>{for(const c of WCHOICE){c.x=-200;c.y=-200}W4.wake=3;W4.banner=null;swSnd(523,.35,1046)}},
  {x:240,y:70,who:'ERIN',txt:'It is awake! Your sprouts did that, with the berries they carried.'},
  {x:240,y:352,hold:1.5},
  {x:240,y:352,hold:1.1,fn:pop},
  {x:240,y:352,who:'ERIN',txt:'Now it is lit, the garden grows sprouts on its own. Pluck them when they are grown.'},
  {x:240,y:352,who:'MARCUS',txt:'Every four things you carry home, the Lantern grows one more. Free sprouts, bro.'},
  {who:'MARCUS',txt:'The light reached the wilds too. Three buddies are on their way. Pick one.'}
 ],()=>{W4.choiceT=0;W4.banner={txt:'THE LANTERN STIRS',sub:'Three dim buddies are coming',t:3.5}})}
/* ---- 4a. Erin walks you to the south road ---- */
function bwTick(dt){if(SCOFF||W4.sector!=='BASE'||SW.quest!==2||!SW.lessons.scSend||!SW.lessons.loop||W4.scene||state!=='g4world')return;const st=SW.bwalk||0;if(st>=2&&!W4.bwHold)return;
 const c=(W4.cast||[]).find(q=>q.who==='ERIN');if(!c)return;const gy=(W4.wh||520)-60,dp=Math.hypot(P3.x-c.x,P3.y-c.y);
 if(st===0){W4.bwT=(W4.bwT||0)+dt;if(W4.bwT<1.2)return;W4.bwHold=1;scStart([{who:'ERIN',txt:"Ready for the wilds? I'll walk you to the Meadow. Stay close!"}],()=>{SW.bwalk=1;swSave()});return}
 const go=(x,y,v)=>{const dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy);c.mv=d>2;if(d>2){const s=Math.min(d*5,v);c.x+=dx/d*s*dt;c.y+=dy/d*s*dt;c.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]}c.tx=c.x;c.ty=c.y;c.t=5;return d};
 if(st===1){const behind=Math.hypot(P3.x-240,P3.y-gy)>Math.hypot(c.x-240,c.y-gy)+20;if(dp>80&&behind){c.mv=false;c.tx=c.x;c.ty=c.y;c.t=5;c.dir=[P3.x>c.x?1:-1,0];return} /* waits only when you fall behind */
  if(go(240,gy,dp<40?80:62)<4&&dp<70){scStart([{who:'ERIN',txt:'The south road. The Meadow is just through here. Walk on down, I will meet you on the other side!'}],()=>{SW.bwalk=2;swSave()})}return}
 if(st===2){go(240,gy+40,50);c.tx=c.x;c.ty=c.y}}
/* ---- 4b. the Meadow walk, with your first catch first ---- */
function scMeadow(F){SW.lessons.scMeadow=1} /* Erin covers the Meadow now; Louie keeps quiet */
function ewTame(F){let wd=W4.wilds.find(w=>w.tame);if(wd)return wd;const sec=wSector(F.id),gr=F.grass.slice().sort((a,b)=>Math.hypot(a[0]*FT-F.start.x,a[1]*FT-F.start.y)-Math.hypot(b[0]*FT-F.start.x,b[1]*FT-F.start.y))[3]||F.grass[0];
 if(!gr)return null;wd=fSpawnWild(F,sec);wd.x=wd.tx=gr[0]*FT+8;wd.y=wd.ty=gr[1]*FT+10;wd.lv=sec.lv[0];wd.tame=1;W4.wilds.push(wd);return wd}
function ewTarget(F,st){if(st===1){const wd=ewTame(F);return wd?ewNear(F,wd.x+30,wd.y+6):null}
 if(st===3){const b=F.buds.find(b2=>b2.type===1);return b?ewNear(F,b.x+16,b.y+4):null}
 if(st===5){const gt=F.gates.find(g2=>g2.type===1&&!g2.open);return gt?ewNear(F,gt.x+18,gt.y+22):null}
 if(st===7){const s=F.sites.find(s2=>!s2.done);return s?ewNear(F,s.x,s.y-30):null}
 if(st===9)return ewNear(F,P3.x+20,P3.y);return null}
const EW2={
 1:["ERIN: There. A wild buddy, out in the grass. See its tag? Level 2.","ERIN: Face it and press A. Each sprout you throw fills its bar.","ERIN: Fill the bar and it blooms and joins you. Take your time. It won't run."],
 3:["ERIN: Now, sprouts. They are not all the same. See that one poking out? That's a PEB.","ERIN: Walk up to it and press A to pluck it."],
 5:["ERIN: A boulder wall. Only PEB sprouts can crack rock.","ERIN: Face it and press A. Throw a few if it's tough."],
 7:["ERIN: Sprouts build, too. See the planks out in the water?","ERIN: Face them and press A. A few sprouts make a bridge."],
 9:["ERIN: That's the Meadow. Every kind of sprout has its own job."]};
const EWDONE={2:["ERIN: Your first catch! It walks with you now.","ERIN: Buddies can fight, too. Stand next to a wild one and press SELECT to battle it. Battles make them stronger.","ERIN: Not now, though. Come on, there's more to see."],
 4:["ERIN: There. A PEB walks with you now. Over this way!"],6:["ERIN: Ha! The rock never stood a chance. One more thing."],8:["ERIN: A bridge! Whatever's on that island is yours."]};
function ewTick(F,dt){if(SCOFF||F.id!=='MEADOW'||wOp()<3||W4.scene||F.dlg||F.spot)return;SW.lessons.scMeadow=1;const st=SW.walk2||0;
 if(SW.quest<3&&st>=1){const tm=W4.wilds.find(w=>w.tame);if(tm)for(const w of W4.wilds)if(w!==tm&&!(w.lat&&w.lat.length)&&Math.hypot(w.x-tm.x,w.y-tm.y)<110)w.gone=1;W4.wilds=W4.wilds.filter(w=>!w.gone)} /* the lesson buddy has the grass to itself */if(st>=10&&!(W4.ew&&W4.ew.leave)&&!(SW.walk3>0&&SW.walk3<7))return;
 if(!W4.ew||W4.ewFor!==F){W4.ewFor=F;const p=ewNear(F,P3.x-24,P3.y+10);W4.ew={x:p.x,y:p.y,dir:[0,1],mv:false,t:0}}
 const E=W4.ew,go=(x,y,v)=>{const dx=x-E.x,dy=y-E.y,d=Math.hypot(dx,dy);E.mv=d>2;if(d>2){const s=Math.min(d*5,v);E.x+=dx/d*s*dt;E.y+=dy/d*s*dt;E.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]}return d};
 if(E.leave){if(ewGo(F,E,F.start.x,F.start.y-10,70,go)<4)W4.ew=null;return}
 const dp=Math.hypot(P3.x-E.x,P3.y-E.y);if(dp>230){const p=ewNear(F,P3.x-30,P3.y);E.x=p.x;E.y=p.y}
 if(st>=10){ew3Tick(F,dt,E,dp,go);return}
 if(st===0){if(SW.quest>=3){SW.walk2=3;return}fTalk(F,'ERIN',["ERIN: You made it! Welcome to the Meadow.","ERIN: "+((SW.party[0]&&SW.party[0].sp)||"Your buddy")+" could use a friend. Wild ones live down in the tall grass. Follow me."],()=>{SW.walk2=1;swSave()});return}
 if(st%2===1&&E.rest>0){E.rest-=dt;E.mv=false;E.dir=[P3.x>E.x?1:-1,0];return} /* a breath between lessons (v8.5) */
 if(st%2===1){const tg=ewTarget(F,st);if(!tg){SW.walk2=st===9?10:st+2;return}
  if(dp>80&&Math.hypot(P3.x-tg.x,P3.y-tg.y)>Math.hypot(E.x-tg.x,E.y-tg.y)+20){E.mv=false;E.wait=1;E.dir=[P3.x>E.x?1:-1,0];return}E.wait=0;
  if(ewGo(F,E,tg.x,tg.y,62,go)<4){E.mv=false;E.dir=[P3.x>E.x?1:-1,0];if(dp<70)fTalk(F,'ERIN',EW2[st],()=>{SW.walk2=st+1;if(st===9){SW.walk2=10;if(SW.walk3)E.leave=1;else{SW.walk3=1;E.rest=2}}swSave()})}return}
 E.mv=false;E.t+=dt;E.dir=[P3.x>E.x?1:-1,0];
 const done=st===2?SW.quest>=3:st===4?!F.buds.some(b=>b.type===1):st===6?!F.gates.some(g2=>g2.type===1&&!g2.open):st===8?!F.sites.some(s=>!s.done):true;
 if(done){if(st===2)for(const w of W4.wilds)w.tame=0;fTalk(F,'ERIN',EWDONE[st],()=>{SW.walk2=st+1;E.rest=3;swSave()});E.t=0;return}
 if(E.t>75&&st!==2){E.t=0;fTalk(F,'ERIN',["ERIN: No rush. I'll wait right here."],()=>{})}}
function ewDraw(){const E=W4.ew;if(!E)return;fChibi(Math.round(E.x),Math.round(E.y)+3,FLOOK.ERIN,E.dir,E.mv);
 const st=SW.walk2||0;if(E.wait||(!E.mv&&!E.leave&&st%2===0&&st<10))if(((time*2)|0)%2)text('!',Math.round(E.x)-1,Math.round(E.y)-30,2,'#ffd94d',null)}
