/* ================================================================
   LOUIE, THE WAY HE IS IN SPROUTS (v7.8)
   Same dog as cartridge 1: walks at your side and holds still when you
   do, sits for pets (hearts and a short bark in caps), digs up berries
   for the sprouts to carry, fetches lost sprouts ("FOUND ONE!") and
   sniffs out wild buddies. At Sunkeep he still runs ahead to point at
   the next goal while there is one.
   ================================================================ */
function louSay(s,t){W4.lsay={s,t:t||2}}
function louSt(){if(!W4.lst)W4.lst={st:'follow',t:0,dig:R2(25,40),bark:6,sx:lou.x,sy:lou.y,fx:-1};return W4.lst}
function R2(a,b){return a+Math.random()*(b-a)}
function louIdleTick(dt){const moving=keys.up||keys.down||keys.left||keys.right;W4.pIdle=moving?0:(W4.pIdle||0)+dt;if(W4.lsay){W4.lsay.t-=dt;if(W4.lsay.t<=0)W4.lsay=null}}
function louGo(L,tx,ty,v,dt){const dx=tx-lou.x,dy=ty-lou.y,d=Math.hypot(dx,dy);W4.louMv=d>3;if(d>3){const s=Math.min(d*6,v);lou.x+=dx/d*s*dt;lou.y+=dy/d*s*dt;if(Math.abs(dx)>1)L.fx=dx>0?1:-1}return d}
/* at your side, not behind you; holds still when you do */
function louSide(L,dir){const dx=dir[0],dy=dir[1],fx=P3.x+dx*14-lou.x,fy=P3.y+dy*14-lou.y,facing=Math.hypot(fx,fy)<30&&(dx*(lou.x-P3.x)+dy*(lou.y-P3.y))>0;if(facing){L.sx=lou.x;L.sy=lou.y;return} /* walking toward him: he holds still so you can reach him */
 if(W4.pIdle<.15){const px=-dy,py=dx;L.sx=P3.x-dx*4+px*22;L.sy=P3.y+4-dy*4+py*22;
  const bl=(x,y)=>W4.fld?fBox(W4.fld,x,y):wSolidAt(x,y);
  if(bl(L.sx,L.sy)){L.sx=P3.x-dx*4-px*22;L.sy=P3.y+4-dy*4-py*22}
  if(bl(L.sx,L.sy)){L.sx=P3.x-dx*36;L.sy=P3.y+4-dy*36}}}
function louDigAt(L,items,x,y){L.st='dig';L.tx=x;L.ty=y;L.t=1.6;L.items=items}
function louCommon(L,dt,items,dir){
 if(L.st==='sit'){L.t-=dt;W4.louMv=false;if(L.t<=0)L.st='follow';return true}
 if(L.st==='dig'){const d=louGo(L,L.tx,L.ty,95,dt);if(d<5){W4.louMv=true;L.t-=dt;if(Math.random()<dt*12)W4.floats.push({x:lou.x+(Math.random()*10-5),y:lou.y+2,txt:'.',t:.4,c:'#a87850'});
   if(L.t<=0){L.items.push({k:'pel',res:'berry',n:1,w:1,x:lou.x,y:lou.y+4,car:[]});louSay('BERRY!',1.6);swSnd(880,.06,1320);L.st='follow';L.dig=R2(40,60);
    if(!SW.lessons.louDig){SW.lessons.louDig=1;swSay('Louie dug up a berry. Throw sprouts at it and they carry it home.',3)}}}return true}
 L.dig-=dt;if(L.dig<=0){const a=Math.random()*6.28,rr=R2(30,46),x=P3.x+Math.cos(a)*rr,y=P3.y+Math.sin(a)*rr,blk=W4.fld?fBox(W4.fld,x,y):wSolidAt(x,y);
  if(!blk&&items.filter(i=>!i.done&&i.res==='berry').length<6){louDigAt(L,items,x,y);return true}L.dig=3}
 return false}
/* the base: lead to the goal while there is one, otherwise be a dog */
function wLouTick(dt){if(W4.petCd>0)W4.petCd-=dt;louIdleTick(dt);const L=louSt(),F=W4.bf,g2=wOp()<3?wNextGoal():null,dp=Math.hypot(P3.x-lou.x,P3.y-lou.y);
 if(g2){const dg=Math.hypot(g2.x-lou.x,g2.y-lou.y);W4.louLead=dg>8?1:2;let tx=lou.x,ty=lou.y;if(dg>8&&dp<96){tx=g2.x;ty=g2.y}else if(dp>150){tx=P3.x;ty=P3.y}louGo(L,tx,ty,92,dt);return}
 W4.louLead=0;if(F&&louCommon(L,dt,F.items,[P3.ax||0,P3.ay||1]))return;
 if(dp>220){lou.x=P3.x+18;lou.y=P3.y+4}louSide(L,[P3.ax||0,P3.ay||1]);louGo(L,L.sx,L.sy,dp>50?118:84,dt)}
/* the field: fetch strays first, sniff out wilds, dig, stay at your side */
function fLouTick(F,dt){louIdleTick(dt);const L=louSt();
 if(L.st==='sit'||L.st==='dig'){louCommon(L,dt,F.items,F.dir);return}
 const stray=F.sq.find(s=>s.st==='idle'&&s.t>2.5&&Math.hypot(s.x-P3.x,s.y-P3.y)>44);
 if(stray){const d=louGo(L,stray.x,stray.y,130,dt);if(d<10){stray.st='ret';louSay('FOUND ONE!',1.4);swSnd(700,.05,500)}return}
 L.bark-=dt;if(L.bark<=0){const wd=W4.wilds.find(w=>!w.cap&&Math.hypot(w.x-P3.x,w.y-P3.y)<90);if(wd){L.bark=22;L.fx=wd.x>lou.x?1:-1;louSay(wd.lv>(SW.party[0]?SW.party[0].lv:5)+2?'GRR! BIG ONE!':'SNIFF! A BUDDY!',1.8);swSnd(600,.05,420)}else L.bark=4}
 if(louCommon(L,dt,F.items,F.dir))return;
 const dp=Math.hypot(P3.x-lou.x,P3.y-lou.y);if(dp>260){lou.x=P3.x;lou.y=P3.y+8}louSide(L,F.dir);louGo(L,L.sx,L.sy,dp>50?118:84,dt)}
/* petting: face him while standing still and press A */
function louPetOK(){const L=louSt();if(L.st!=='follow'||(W4.pIdle||0)<.3)return false;const ax=W4.fld?W4.fld.dir[0]:P3.ax,ay=W4.fld?W4.fld.dir[1]:P3.ay,px=P3.x+(ax||0)*12,py=P3.y+(ay||0)*12;return Math.hypot(px-lou.x,py-lou.y)<18}
function louPet(){const L=louSt();L.st='sit';L.t=1.3;W4.pets=(W4.pets||0)+1;for(let i=0;i<4;i++)W4.floats.push({x:lou.x+(i-1.5)*6,y:lou.y-14-i*3,txt:'♥',t:.9+i*.15,c:'#f078c0'});
 louSay(LOU_PET[(W4.pets+(SW.day||1))%LOU_PET.length],2);swSnd(880,.08,1320);
 if(!(W4.petCd>0)){W4.petCd=18;if(Math.random()<.5){SW.hearts++;SW.heartsTotal++}}}
function wLouTalk(){louPet();if(!W4.fld){const g2=wNextGoal();if(g2&&wOp()>=3)wQuip('LOUIE',g2.label,true)}swSave()}
/* drawing: faces where he is going, sits with his ears up, says short things in a bubble */
function louDraw(){const L=louSt(),x=Math.round(lou.x),y=Math.round(lou.y),sit=L.st==='sit',left=L.fx<0,f=W4.louMv?((time*8)|0)%2:((time*2)|0)%2,hop=W4.louMv&&f?1:0;
 r('rgba(0,0,0,.22)',x-9,y+4,18,3);const img=sit?(left?LOU.e:LOU.er):(left?LOU.l:LOU.r)[f];g.drawImage(img,x-12,y-6-hop+(sit?1:0),24,12);
 if(L.st==='dig')r('#a87850',left?x-13:x+11,y+3+hop,2,2);
 const s=W4.lsay;if(s){const w=tw(s.s,1)+8,bx=Math.max((W4.cam?W4.cam.x:0)+2,Math.round(x-w/2)),by=y-24;r('#14101e',bx-1,by-1,w+2,12);r('#ffffff',bx,by,w,10);r('#ffffff',x-1,by+10,3,2);text(s.s,bx+4,by+1,1,'#282838',null)}}
function fLouDraw(){louDraw()}
