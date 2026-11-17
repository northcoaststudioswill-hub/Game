/* ================================================================
   LOUIE, PROPERLY (v9.7). Will: Louie's model is bad; he works well in
   the original Sprouts game. He's a Shiba Inu.
   - Drawn the way Sprouts draws him: the same Shiba sprite at its true
     size (20 x 13, it was being squashed to 24 x 12), with his white
     outline, a two-frame trot with a hop, his tongue, and ears up and
     a blush when he sits for a pet.
   - Fetch, the Sprouts way: a stray sprout rides home on his back.
     He trots over, it hops on, he brings it to your side and it hops
     off. (It used to be told to walk back by itself.)
   ================================================================ */
function louDraw(){const L=louSt(),x=Math.round(lou.x),y=Math.round(lou.y),sit=L.st==='sit',left=L.fx<0,fr=W4.louMv?((time*9)|0)%2:0,hop=W4.louMv&&fr?1:0;
 r('rgba(0,0,0,.3)',x-8,y+1,17,2);const X=x-10,Y=y-12-hop+(sit?1:0),wImg=sit?(left?LOU.ew:LOU.ewr):(left?LOU.w:LOU.wr),img=sit?(left?LOU.e:LOU.er):(left?LOU.l:LOU.r)[fr];
 g.drawImage(wImg,X-1,Y);g.drawImage(wImg,X+1,Y);g.drawImage(wImg,X,Y-1);g.drawImage(wImg,X,Y+1);g.drawImage(img,X,Y);
 if(((time*(sit?12:5))|0)%2)r('#fff0d8',left?X+16:X+3,Y,1,1);                 /* the tail wags */
 if(sit)r('#f85888',left?X+4:X+14,Y+8,2,2);                                 /* the tongue / blush */
 if(L.st==='dig')r('#a87850',left?X-2:X+20,Y+11,2,2);
 W4.louBubP={x,y}}
/* fetch: a stray sprout rides home on his back */
function louFetch(F,L,dt){
 if(L.st==='bring'){L.riders=(L.riders||[]).filter(s=>F.sq.includes(s));if(!L.riders.length){L.st='follow';return true}
  L.riders.forEach((s,i)=>{s.st='ride';s.x=lou.x+((i%3)-1)*4;s.y=lou.y+1;s.z=9;s.mv=false});
  const d=louGo(L,P3.x+(lou.x<P3.x?-14:14),P3.y+4,124,dt);
  if(d<8){const n=L.riders.length;L.riders.forEach((s,i)=>{s.st='follow';s.z=0;s.x=lou.x+((i%3)-1)*5;s.y=lou.y+4});L.riders=[];L.st='sit';L.t=.6;louSay(n>1?'FOUND '+n+'!':'FOUND ONE!',1.4);swSnd(700,.05,500)}
  return true}
 const stray=F.sq.find(s=>s.st==='idle'&&s.t>.6&&Math.hypot(s.x-P3.x,s.y-P3.y)>44);if(!stray)return false;
 stray.t=Math.min(stray.t,2);const d=louGo(L,stray.x,stray.y,130,dt);
 if(d<10){L.riders=[stray];for(const q of F.sq)if(q!==stray&&q.st==='idle'&&L.riders.length<3&&Math.hypot(q.x-stray.x,q.y-stray.y)<40)L.riders.push(q);
  L.st='bring';swSnd(880,.05,1175)}
 return true}
function fLouTick(F,dt){louIdleTick(dt);const L=louSt();
 if(L.st==='sit'||L.st==='dig'){louCommon(L,dt,F.items,F.dir);return}
 if(louFetch(F,L,dt))return;
 L.bark-=dt;if(L.bark<=0){const wd=W4.wilds.find(w=>!w.cap&&Math.hypot(w.x-P3.x,w.y-P3.y)<90);if(wd){L.bark=22;L.fx=wd.x>lou.x?1:-1;louSay(wd.lv>(SW.party[0]?SW.party[0].lv:5)+2?'GRR! BIG ONE!':'SNIFF! A BUDDY!',1.8);swSnd(600,.05,420)}else L.bark=4}
 if(louCommon(L,dt,F.items,F.dir))return;
 const dp=Math.hypot(P3.x-lou.x,P3.y-lou.y);if(dp>260){lou.x=P3.x;lou.y=P3.y+8}louSide(L,F.dir);louGo(L,L.sx,L.sy,dp>50?118:84,dt)}
/* ================================================================
   v9.7: whoever says something important walks up to you first.
   A scene at Sunkeep whose speakers include Erin or Marcus starts with
   them walking over to stand beside you (Erin on your left, Marcus on
   your right). Scenes with their own staging (fn steps) are left alone.
   ================================================================ */
function scWalkUp(steps){if(W4.fld||!W4.cast||steps.some(s=>s.fn))return steps;
 const who=[...new Set(steps.map(s=>s.who).filter(w=>w==='ERIN'||w==='MARCUS'))],cs=who.map(w=>W4.cast.find(q=>q.who===w)).filter(Boolean);
 if(!cs.length)return steps;
 const spot=c=>({x:P3.x+(c.who==='ERIN'?-24:24),y:P3.y+2});
 if(!cs.some(c=>Math.hypot(c.x-spot(c).x,c.y-spot(c).y)>14))return steps;
 const walk={max:6,until:()=>cs.every(c=>Math.hypot(c.x-spot(c).x,c.y-spot(c).y)<3),
  tick:dt=>{for(const c of cs){const sp=spot(c),dx=sp.x-c.x,dy=sp.y-c.y,d=Math.hypot(dx,dy);c.mv=d>2;
   if(d>2){const v=Math.min(d*6,92);c.x+=dx/d*v*dt;c.y+=dy/d*v*dt;c.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]}else c.dir=[P3.x>c.x?1:-1,0];
   c.tx=c.x;c.ty=c.y;c.t=Math.max(c.t||0,12)}}};
 return[walk].concat(steps)}
/* ================================================================
   v9.8: during Erin's Meadow walk you can only do what she has shown
   you. The aim ring only locks on to the thing she is teaching right
   now; A on anything else gets "Hang on! I'll show you that."
   Talking, petting Louie, the Lantern post and signs always work.
   ================================================================ */
function wTutStage(){if(SCOFF||!W4.fld||W4.fld.id!=='MEADOW')return null;const w2=SW.walk2||0,w3=SW.walk3||0;
 if(w2===2&&SW.lessons.tutFight===1)return'af';if(w2<10)return'a'+w2;if(w3>=1&&w3<7)return'b'+w3;return null}
function wTutAim(o,k){const st=wTutStage();if(!st||W4.tutOff)return true;
 if(st==='af')return k==='wild';
 if(st==='a1'||st==='a2')return k==='wild'&&!!o.tame;
 if(st==='a5'||st==='a6')return k==='gate';
 if(st==='a7'||st==='a8')return k==='site';
 if(st==='b1'||st==='b2')return k==='bwork'&&o.k==='tree';
 if(st==='b3')return k==='item'&&o.res==='wood';
 if(st==='b4'||st==='b5')return k==='bug';
 return false}
function wTutNear(n){const st=wTutStage();if(!st)return true;
 if(['louie','sign','road','info','npc'].includes(n.k))return true;
 if(n.k==='bud')return st==='a3'||st==='a4';
 return false}
function wTutHint(){if(time<(W4.tutHintT||0))return;W4.tutHintT=time+4;swSay("ERIN: Hang on! I'll show you that. Stick with me.",2.4)}

/* v10.0: the first alpha waits for a Buddy Barn */
const _wGG10=wGymGoal;wGymGoal=function(){if(SW.quest>=5&&!SW.badges.length&&!wHasDC())return 'Build a BUDDY BARN at Sunkeep (8 stone, 6 wood) before the castle alpha.';return _wGG10()};

/* v10.1: the castle is a three-step puzzle. A moat (sprouts build the bridge), the thorn gate (LEAF),
   then an inner boulder wall (PEB) in front of the alpha. A PEB grows in the courtyard, so nobody is stuck. */
{const R=FMAPS.SQUIRE.rows,put=(y,x,s)=>{R[y]=R[y].slice(0,x)+s+R[y].slice(x+s.length)};
 put(4,25,'.');put(5,20,'###x###');put(6,25,'q');put(7,21,'u');
 put(9,18,'::~~~b~~~~');put(9,28,'.');put(10,16,'::::::::');
 FMAPS.SQUIRE.key.u={k:'bud',type:1}}

/* v10.2: the Meadow's west lane was two tiles wide going down, one wide going east, and stopped a tile short
   of the main road. Now it is two wide all the way and joins the road. */
{const R=FMAPS.MEADOW.rows,put=(y,x,s)=>{R[y]=R[y].slice(0,x)+s+R[y].slice(x+s.length)};put(7,2,':::::::::::::::');put(8,2,':::::::::::::::')}
