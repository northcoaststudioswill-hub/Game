/* ================================================================
   ERIN'S MEADOW WALK, AND THE SPROUT KINDS (v7.9)
   The first time out in the Meadow, Erin walks you round it: the
   buried PEB sprout, the boulder wall only a PEB can crack, and the
   bridge sprouts can build. She walks ahead and waits for you, then
   waits again while you try it. Each sprout kind gets its own card
   the first time you have one, so they arrive one at a time.
   ================================================================ */
const WKINDS=[
 {good:'Burns through FIRE WALLS. Keeps the kiln warm.',lore:'Sparks that fell the night the Lantern cracked. Warm to hold.'},
 {good:'Cracks BOULDER WALLS. Counts double when it carries.',lore:'Pebble-hearted and stubborn. Heavy for its size.'},
 {good:'Waters THIRSTY BLOOMS. Happy by the water.',lore:'Lake mist that grew legs. Never quite dry.'},
 {good:'Opens SPARK GATES. The fastest sprout there is.',lore:'Charged by summer storms. Always in a hurry.'},
 {good:'Cuts THORN VINES. Good in the garden.',lore:'Grown from the old woods. Smells like rain.'},
 {good:'Rare. Keep it close.',lore:'Nobody has ever grown one on purpose.'}];
/* a card the first time you have each kind; the opening's three share one page on the how-it-works card */
function kindCheck(){if(state!=='g4world'||W4.scene||(W4.fld&&(W4.fld.dlg||W4.fld.spot)))return false;SW.kinds=SW.kinds||{};
 if(wOp()<3||!SW.lessons.loop){for(const t of [0,2,4])SW.kinds[t]=1;return false}
 for(let t=0;t<TYPES.length;t++)if(!SW.kinds[t]&&(SW.buds[TYPES[t].n]||0)>0){SW.kinds[t]=1;W4.kindT=t;W4.kindC=0;state='g4kind';swSnd(523,.12,784);swSave();return true}
 return false}
function kindUpdate(){W4.kindC=(W4.kindC||0)+1/30;if(W4.kindC>.8&&(pressed('a')||pressed('start'))){swSnd(660,.06,990);state='g4world'}}
function drawKind(){const t=W4.kindT,T=TYPES[t],K=WKINDS[t],c=W4.kindC||0,cy=74;ox=0;oy=0;
 r('#0a0e14',0,0,W,H);g.globalAlpha=.55;r(T.d,0,22,W,104);g.globalAlpha=1;uiRays(W/2,cy,130,12,T.l,.14);
 r('#0a0e14',0,0,W,22);r(T.c,0,22,W,1);r(T.c,0,126,W,1);text('NEW SPROUT KIND',6,7,1,'#8a86a0',null);
 g.save();g.translate(W/2,cy+26);g.scale(4,4);drawBud({x:0,y:0,type:t,stage:2,z:Math.round(Math.abs(Math.sin(time*4))*2),a:t,mv:false,st:'follow',fx:1});g.restore();
 if(c>.25){g.save();g.translate(W/2,134);g.scale(2,2);text(T.n,-tw(T.n,1)/2,0,1,'#ffffff',null);g.restore();ctext(T.n+' SPROUT',158,1,T.l)}
 if(c>.6){text('GOOD FOR',8,178,1,T.l,null);swWrap(K.good,W-70).slice(0,2).forEach((l,j)=>text(l,64,178+j*10,1,'#e8e4f4',null))}
 if(c>.9){text('LORE',8,204,1,T.l,null);swWrap(K.lore,W-70).slice(0,2).forEach((l,j)=>text(l,64,204+j*10,1,'#e8e4f4',null))}
 if(c>1.1){const n=SW.buds[T.n]||0;text('YOU HAVE '+n,8,232,1,'#a8a4c0',null)}
 if(c>.8){r('#14121e',0,H-18,W,18);const s='A  GOT IT';text(s,W-8-tw(s,1),H-13,1,'#7ee787',null)}}
/* ---------------- the walk ---------------- */
function ewNear(F,x,y){for(let rr=0;rr<5;rr++)for(let dy=-rr;dy<=rr;dy++)for(let dx=-rr;dx<=rr;dx++){const tx=Math.floor(x/FT)+dx,ty=Math.floor(y/FT)+dy;if(fWalkTile(F,tx,ty)&&!fBox(F,tx*FT+8,ty*FT+10))return{x:tx*FT+8,y:ty*FT+10}}return{x,y}}
function ewTarget(F,st){if(st===1){const b=F.buds.find(b2=>b2.type===1);return b?ewNear(F,b.x+16,b.y+4):null}
 if(st===3){const gt=F.gates.find(g2=>g2.type===1&&!g2.open);return gt?ewNear(F,gt.x+18,gt.y+22):null}
 if(st===5){const s=F.sites.find(s2=>!s2.done);return s?ewNear(F,s.x,s.y-30):null}
 if(st===7)return ewNear(F,P3.x+20,P3.y);return null}
const EWSAY={
 1:["ERIN: See the sprout poking out of the grass? That's a PEB.","ERIN: Walk up to it and press A to pluck it."],
 3:["ERIN: A boulder wall. Only PEB sprouts can crack rock.","ERIN: Face it and press A. Throw a few if it's tough."],
 5:["ERIN: Sprouts build, too. See the planks out in the water?","ERIN: Face them and press A. A few sprouts make a bridge."],
 7:["ERIN: That's the Meadow. Every kind of sprout has its own job.","ERIN: Bugs live out here too. Throw a sprout at one and it goes in your jar. Check it from START.","ERIN: I'll be at Sunkeep. Go catch yourself a buddy!"]};
function ewTick(F,dt){if(SCOFF||F.id!=='MEADOW'||!SW.lessons.scMeadow||wOp()<3||W4.scene||F.dlg||F.spot)return;const st=SW.walk||0;if(st>=8&&!(W4.ew&&W4.ew.leave))return;
 if(!W4.ew||W4.ewFor!==F){W4.ewFor=F;const p=ewNear(F,P3.x-24,P3.y+10);W4.ew={x:p.x,y:p.y,dir:[0,1],mv:false,t:0}}
 const E=W4.ew,go=(x,y,v)=>{const dx=x-E.x,dy=y-E.y,d=Math.hypot(dx,dy);E.mv=d>2;if(d>2){const s=Math.min(d*5,v);E.x+=dx/d*s*dt;E.y+=dy/d*s*dt;E.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]}return d};
 if(E.leave){if(go(F.start.x,F.start.y-10,70)<4)W4.ew=null;return}
 const dp=Math.hypot(P3.x-E.x,P3.y-E.y);if(dp>230){const p=ewNear(F,P3.x-30,P3.y);E.x=p.x;E.y=p.y}
 if(st===0){fTalk(F,'ERIN',["ERIN: Hey, wait up! First time out here? I'll show you around.","ERIN: Follow me."],()=>{SW.walk=1;swSave()});return}
 if(st===1||st===3||st===5||st===7){const tg=ewTarget(F,st);if(!tg){SW.walk=st+2>7?7:st+2;if(st===7)SW.walk=8;return}
  if(dp>80){E.mv=false;E.wait=1;E.dir=[P3.x>E.x?1:-1,0];return}E.wait=0;   /* she waits for you to catch up */
  if(go(tg.x,tg.y,62)<4){E.mv=false;E.dir=[P3.x>E.x?1:-1,0];if(dp<56)fTalk(F,'ERIN',EWSAY[st],()=>{SW.walk=st+1;if(st===7){SW.walk=8;E.leave=1}swSave()})}return}
 E.mv=false;E.t+=dt;E.dir=[P3.x>E.x?1:-1,0];
 const done=st===2?!F.buds.some(b=>b.type===1):st===4?!F.gates.some(g2=>g2.type===1&&!g2.open):st===6?!F.sites.some(s=>!s.done):true;
 if(done){const L={2:["ERIN: There. A PEB walks with you now. Over this way!"],4:["ERIN: Ha! The rock never stood a chance. One more thing."],6:["ERIN: A bridge! Whatever's on that island is yours."]}[st];fTalk(F,'ERIN',L,()=>{SW.walk=st+1;swSave()});return}
 if(E.t>75){E.t=0;fTalk(F,'ERIN',["ERIN: No rush. I'll wait. Or we can skip it and I'll catch you later."],()=>{})}}
function ewDraw(){const E=W4.ew;if(!E)return;fChibi(Math.round(E.x),Math.round(E.y)+3,FLOOK.ERIN,E.dir,E.mv);
 if(E.wait||(!E.mv&&!E.leave&&(SW.walk===2||SW.walk===4||SW.walk===6)))if(((time*2)|0)%2)text('!',Math.round(E.x)-1,Math.round(E.y)-30,2,'#ffd94d',null)}
