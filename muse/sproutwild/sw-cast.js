/* ================================================================
   THE CAST AT HOME (Fable, v5.9)
   Erin, Marcus and Louie are people in the start area, not signs:
   they walk about, turn to look at you, and talk in speech bubbles
   over their heads. The first minutes are taught by them, in the
   world, while you already have control — no pages to read first.
   After the opening they keep wandering and quipping about what is
   going on (a new building, workers, ore, night).
   The pre-game story is now three scenes; Erin and Marcus say the
   rest in person.
   ================================================================ */
WSTORY.length=0;WSTORY.push(
 {sc:0,who:'',t:'The Great Lantern hung over the valley and everything grew. Then, one night, it cracked.'},
 {sc:1,who:'',t:'Its light fell as seeds, and the seeds grew legs. The buddies of the valley went dim.'},
 {sc:5,who:'KING BIBI',t:'Citizens. For thirty years I have warned you: the light is weeks away. Hence, my IRON DOME.',acc:'#1e2c5a'});
const WCANCH={ /* where each of them hangs about, by how far along you are */
 ERIN:[[290,148,14],[214,206,16],[150,196,20],[336,300,56]],MARCUS:[[190,154,14],[272,176,16],[334,200,20],[300,214,40]],WILL:[[150,250,30],[150,250,30],[150,250,30],[130,260,50]]};
function wCastInit(){W4.cast=['ERIN','MARCUS','WILL'].map(w=>{const a=WCANCH[w][Math.min(3,wOp())];return{who:w,x:a[0],y:a[1],tx:a[0],ty:a[1],t:1+Math.random()*2,dir:[0,1],mv:false}});
 if(wOp()===0&&!(SW.beats&&SW.beats.wake)){W4.cast[0].x=330;W4.cast[0].y=214;W4.cast[1].x=150;W4.cast[1].y=220} /* they walk up as you wake */
 W4.quips=[];W4.quipQ=[];W4.idleT=9}
function wNpcList(){if(W4.sector!=='BASE')return[];if(!W4.cast)wCastInit();return W4.cast.filter(c=>c.who!==SW.keeper)}
function wSpeaker(who){if(who==='LOUIE')return{x:lou.x,y:lou.y+10,h:14};const c=(W4.cast||[]).find(q=>q.who===who);return c?{x:c.x,y:c.y,h:30}:null}
function wQuip(who,txt,delay,dur){if(!W4.quipQ)return;W4.quipQ.push({who,txt,d:delay||0,t:dur||Math.max(3,1.6+txt.length*.055)})}
const WCBEATS=[
 ['wake',()=>wOp()===0,[['ERIN',"You're up! A year of dark, and today the roots are glowing.",.8],['LOUIE','WOOF!',3.2],['MARCUS','Seeds. In the Lantern. Walk up and press A. Go on.',5]]],
 ['first',()=>wOp()===0&&wBudTotal()>=1,[['ERIN',"It follows you! That's a sprout. Lantern light with legs.",.3]]],
 ['three',()=>wOp()===1,[['MARCUS','Now those berries. Face them and press B. They throw themselves, basically.',.4],['ERIN','Hold B and they all come running back.',5]]],
 ['carry',()=>wOp()===1&&W4.bf&&W4.bf.items.some(i=>i.op&&i.car.length),[['ERIN','See? They know the way home. Everything goes to the Lantern.',.5]]],
 ['lit',()=>wOp()===2,[['MARCUS','...Okay. That was something.',.8],['ERIN',"It's awake! And the dim ones can feel it. Go and say hello.",3.6],['LOUIE','(tail going like mad)',6.5]]],
 ['buddy',()=>SW.quest>=2&&SW.party.length>0&&SW.quest<5,[['ERIN','Buddies fight and fetch. Sprouts carry. You have both now.',1.2],['MARCUS','South road. Tire a wild one out, then swarm it. I will be here. Judging.',5.2]]],
 ['caught',()=>SW.quest>=3,[['ERIN','You brought one home! Leave it here and it will find work.',1],['MARCUS','START, then BUILD. A cottage first. I am not sleeping outside again.',5]]],
 ['cottage',()=>SW.buildings.some(b=>b.k==='cottage'),[['MARCUS','A roof. Finally.',.6],['ERIN','A garden bed next, and they will grow berries on their own.',3.4]]],
 ['worker',()=>(W4.wk||[]).some(w=>w.at),[['MARCUS','Free labour. I respect it.',.5]]],
 ['ore',()=>(SW.res.ore||0)>0,[['MARCUS','Ore! Build a kiln. Flow Pros runs on ingots, and now so do you.',.6]]],
 ['fiber',()=>(SW.res.fiber||0)>=4,[['ERIN','That is enough fiber for a seed pouch. The bench can make one.',.6]]],
 ['sigil',()=>SW.badges.length>=1,[['ERIN','A Sigil! The roads past town are open to you now.',.8],['MARCUS','One. Out of four. Calm down.',4]]]];
const WCIDLE={ERIN:['The beds grow better when someone sings. So I sing.','Louie has a route. Always trust the route.','A tidy base is a happy base. Mostly.','Everything you carry home feeds the Lantern.','Kin sprouts bloom best. Leaf on leaf, dew on dew.','If a buddy is good at a job, it will find that job.'],
 MARCUS:["I'm not an NPC. I'm between protagonists.",'Your form is terrible. The sprouts respect it anyway.','Hydro jet solves most problems. The rest are personal.','King Bibi called that dome temporary. In writing.','You know what this place needs? A van.','Ore. Kiln. Ingots. Tools. It is not complicated.'],
 WILL:['I catalog every sprout in this valley. Twice.','The Lantern chose us. No pressure or anything.','If Marcus asks, I was absolutely working.'],
 LOUIE:['*sniff sniff*','WOOF.','(tail wag)','(found a stick)','ARF! ARF!']};
function wCastTick(dt){if(!W4.cast)wCastInit();if(!SW.beats)SW.beats={};const op=Math.min(3,wOp());
 for(const c of W4.cast){if(c.who===SW.keeper)continue;const a=WCANCH[c.who][op],dp=Math.hypot(P3.x-c.x,P3.y-c.y);c.t-=dt;
  if(Math.hypot(c.tx-a[0],c.ty-a[1])>a[2]+4||c.t<=0){for(let n=0;n<6;n++){const tx=a[0]+(Math.random()*2-1)*a[2],ty=a[1]+(Math.random()*2-1)*a[2];if(!wSolidAt(tx,ty)){c.tx=tx;c.ty=ty;break}}c.t=2.5+Math.random()*4}
  const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy),far=Math.hypot(c.x-a[0],c.y-a[1])>a[2]+30;c.mv=d>2&&(far||dp>22);
  if(c.mv){const v=far?64:26;c.x+=dx/d*v*dt;c.y+=dy/d*v*dt;c.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]}
  else if(dp<60){const px=P3.x-c.x,py=P3.y-c.y;c.dir=Math.abs(px)>Math.abs(py)?[px>0?1:-1,0]:[0,py>0?1:-1]}}
 /* scripted beats fire once per save; idle chatter fills the gaps */
 for(const [id,cond,lines] of WCBEATS)if(!SW.beats[id]&&cond()){SW.beats[id]=1;for(const [who,txt,d] of lines)wQuip(who,txt,d);W4.idleT=14;swSave();break}
 W4.idleT-=dt;if(W4.idleT<=0&&!W4.quips.length&&!W4.quipQ.length){W4.idleT=11+Math.random()*9;const who=['ERIN','MARCUS','LOUIE','WILL'].filter(w=>w!==SW.keeper)[(Math.random()*3)|0],sp=wSpeaker(who);
  if(sp&&Math.hypot(P3.x-sp.x,P3.y-sp.y)<150){const pool=WCIDLE[who];wQuip(who,wDark()>.7&&who==='ERIN'?'Night already. The fire is lit if you want company.':pool[(Math.random()*pool.length)|0])}}
 for(let i=W4.quipQ.length-1;i>=0;i--){const q=W4.quipQ[i];q.d-=dt;if(q.d<=0){W4.quipQ.splice(i,1);W4.quips=W4.quips.filter(o=>o.who!==q.who);W4.quips.push(q);swSnd(q.who==='LOUIE'?700:q.who==='MARCUS'?300:520,.04,q.who==='LOUIE'?500:q.who==='MARCUS'?260:640)}}
 for(const q of W4.quips)q.t-=dt;W4.quips=W4.quips.filter(q=>q.t>0)}
function wQuipDraw(){const K='#14101e',cx=W4.cam?W4.cam.x:0,cy=W4.cam?W4.cam.y:0,placed=[];
 for(const q of W4.quips||[]){const sp=wSpeaker(q.who);if(!sp)continue;const lines=swWrap(q.txt,124).slice(0,5),w=Math.max(...lines.map(l=>tw(l,1)))+10,h=lines.length*10+6;
  let x=Math.round(sp.x-w/2),y=Math.round(sp.y-sp.h-h-4);x=Math.max(cx+3,Math.min(cx+W-w-3,x));y=Math.max(cy+31,y);
  for(let n=0;n<4;n++){const hit=placed.find(b=>x<b.x+b.w+2&&x+w+2>b.x&&y<b.y+b.h+4&&y+h+4>b.y);if(!hit)break;y=Math.max(cy+31,hit.y-h-5);if(y===cy+31&&hit.y<cy+40+h)x=hit.x>cx+W/2?Math.max(cx+3,hit.x-w-4):Math.min(cx+W-w-3,hit.x+hit.w+4)} /* bubbles never sit on each other */
  placed.push({x,y,w,h});const tx=Math.max(x+6,Math.min(x+w-8,Math.round(sp.x)-1)),a=Math.min(1,q.t*3);
  g.globalAlpha=a;r(K,x-1,y,w+2,h);r(K,x,y-1,w,h+2);r('#fffdf2',x,y,w,h);r('#e8e0c8',x,y+h-2,w,2);
  if(Math.abs((y+h)-(sp.y-sp.h))<14){r(K,tx-1,y+h,5,2);r(K,tx,y+h+2,3,2);r('#fffdf2',tx,y+h-1,3,2);r('#fffdf2',tx+1,y+h+1,1,2)}
  else{const who=q.who,nw=tw(who,1)+6;r(K,x+3,y-9,nw,10);r(who==='MARCUS'?'#2a6ad0':who==='LOUIE'?'#b45a28':'#a33b2e',x+4,y-8,nw-2,8);text(who,x+6,y-8,1,'#ffffff',null)}
  lines.forEach((l,j)=>text(l,x+5,y+3+j*10,1,q.who==='LOUIE'?'#a05a18':'#282838',null));g.globalAlpha=1}}
