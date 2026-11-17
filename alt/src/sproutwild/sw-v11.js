/* ================================================================
   v11.0 (Will, after playing to the Bibi scene, Nov 17)
   1. KISS waits until Erin's tutorial is over, and has moved: he no
      longer stands by the Meadow's north gate, he is on the south
      road by the way to the castle.
   2. PACING: Erin's "why" waits for the tutorial to end; the Bibi
      beam waits for a quiet minute out in the field after that; the
      lamp scene waits for the cottage and its party.
   3. TRAVEL: going from one area to another plays a short side-on
      scene of the place you are going, with the keeper and a few
      sprouts walking in. No buddies in it.
   4. ROOMS: the three houses in Lantern Town open. First pass: you
      can walk in, look at things, and leave.
   ================================================================ */
/* ---- 1. Kiss ---- */
{const R=FMAPS.MEADOW.rows,put=(y,x,s)=>{R[y]=R[y].slice(0,x)+s+R[y].slice(x+s.length)};put(2,15,'.');put(35,15,'M');
 const K_=FMAPS.MEADOW.key.M;if(K_)K_.after='One question: did you bring LEAF sprouts? The castle gate down this road is all thorns.'}
function wTutDone(){return SW.quest>=5||((SW.walk2||0)>=10&&(SW.walk3||0)>=7)}
/* ---- 2. pacing ---- */
function wWhyReady(){return wTutDone()&&!!W4.fld&&(W4.whyW||0)>=6}
function wQuietTick(){const calm=state==='g4world'&&!W4.scene&&!swBusy()&&!(W4.fld&&W4.fld.dlg);if(!calm)return;const L=SW.lessons;
 if(L.defeat1===1&&wTutDone()&&W4.fld)W4.whyW=(W4.whyW||0)+1/60; /* v12: out in the field only, never on top of the cottage */
 if(L.defeat1===2&&!L.soul1&&W4.fld)W4.beamW=(W4.beamW||0)+1/60;
 const F=W4.fld;if(F&&F.id==='MEADOW')for(const np of F.npcs)if(np.who==='KISS'){if(!wTutDone()){if(np.x>-900){np.kx=np.x;np.ky=np.y}np.x=-999;np.y=-999}else if(np.x<-900){np.x=np.kx==null?np.hx:np.kx;np.y=np.ky==null?np.hy:np.ky}}}
function wBeamReady(){return!!W4.fld&&(W4.beamW||0)>=15}
/* ---- 3. the travel scene ---- */
const WTRAV_T=2.9;
function wTravLook(to){const B=(typeof FBIO!=='undefined'&&(FBIO[to]||FBIO.MEADOW))||{};return{g:B.g||'#58a848',g2:B.g2||'#4a9840',p:B.p||'#d8c08a',t:B.t2||'#2f7a3c',t1:B.t1||'#1f5230'}}
{const _ft=fTravel;fTravel=function(to,from){if(SCOFF||!FMAPS[to]&&to!=='BASE'){_ft(to,from);return}const s=wSector(to);
  if(s&&SW.badges.length<s.req){_ft(to,from);return}
  const kinds=TYPES.map((T,i)=>i).filter(i=>(SW.buds[TYPES[i].n]||0)>0),sp=[];for(let i=0;i<Math.min(4,wBudTotal());i++)sp.push(kinds[i%Math.max(1,kinds.length)]);
  W4.trav={to,from,t:0,sp,go:()=>_ft(to,from)};state='g4trav';swSnd(523,.08,784)}}
function travUpdate(dt){const T=W4.trav;if(!T){state='g4world';return}T.t+=dt;
 if(T.t>=WTRAV_T||(T.t>.5&&(pressed('a')||pressed('start')||pressed('b')))){W4.trav=null;T.go();if(W4.banner&&W4.banner.t>0&&state==='g4world')W4.banner.t=0}}
function travDraw(){const T=W4.trav;if(!T)return;const t=T.t,to=T.to,sec=wSector(to)||{n:to},L=wTravLook(to),K='#14101e',night=wDark()>.6,gy=Math.round(H*.66),sc=t*26;ox=0;oy=0;
 /* sky */
 r(night?'#101a34':to==='HOLLOW'?'#6a8aa0':'#8fd0f0',0,0,W,gy);r(night?'#182448':to==='HOLLOW'?'#86a2b4':'#b4e2f8',0,Math.round(gy*.55),W,Math.round(gy*.45));
 if(night){for(let i=0;i<30;i++)r('#c8d8ff',(i*53)%W,(i*29)%Math.round(gy*.6),1,1);r('#f0f0d8',W-40,26,12,12)}else{r('#fff8c0',W-44,22,16,16);for(let i=0;i<3;i++){const cx=Math.round(((i*97+40-sc*.25)%(W+60)+W+60)%(W+60))-30;r('#ffffff',cx,34+i*17,26,6);r('#ffffff',cx+6,30+i*17,14,5)}}
 /* far hills, slow */
 for(let i=0;i<5;i++){const hx=Math.round(((i*70-sc*.4)%(W+90)+W+90)%(W+90))-60,hh=22+(i*13)%18;r(L.t1,hx,gy-hh,70,hh);r(L.t1,hx+8,gy-hh-6,54,6);r(L.t1,hx+18,gy-hh-10,34,4)}
 /* the place itself, sliding in from the right */
 const lx=Math.round(W+40-Math.min(1,t/1.5)*(W*.5+20)),P=(c,x,y,w,h)=>r(c,lx+x,gy+y,w,h);
 if(to==='BASE'){P(K,-9,-74,18,74);P('#6a4a2a',-8,-73,16,73);P(K,-30,-104,60,36);P('#2f7a3c',-29,-103,58,34);P('#48a050',-25,-99,50,10);P(K,-8,-62,16,22);P('#ffd94d',-7,-61,14,20);P('#fff8c0',-4,-58,8,14);P('#c8a060',-22,-14,44,14);P(K,-22,-15,44,1)}
 else if(to==='TOWN'){for(const [dx,c] of [[-34,'#c85040'],[6,'#4878c0'],[44,'#d0a040']]){P(K,dx-1,-33,30,33);P('#e8dcc0',dx,-32,28,32);P(K,dx-4,-46,36,14);P(c,dx-3,-45,34,12);P(K,dx+10,-14,8,14);P('#6a4a2a',dx+11,-13,6,13);P('#7fd0e8',dx+3,-26,6,6);P('#7fd0e8',dx+19,-26,6,6)}}
 else if(to==='SQUIRE'){P(K,-37,-45,74,45);P('#8c909c',-36,-44,72,44);for(let i=0;i<6;i++){P(K,-36+i*12,-50,8,6);P('#a8acb6',-35+i*12,-49,6,5)}for(const dx of [-46,34]){P(K,dx-1,-63,14,63);P('#8c909c',dx,-62,12,62);P('#a8acb6',dx,-62,12,3);P(K,dx+5,-48,2,7);P('#5a3d22',dx+10,-78,1,16);P('#a33b2e',dx+11,-78,7,5)}P(K,-9,-24,18,24);P('#286028',-8,-23,16,23);P('#58c048',-5,-20,2,14);P('#58c048',1,-18,2,14)}
 else if(to==='HOLLOW'){for(const dx of [-40,-8,26]){P(K,dx-1,-57,10,57);P('#3a2c22',dx,-56,8,56);P(K,dx-15,-50,16,5);P('#3a2c22',dx-14,-49,14,3);P(K,dx+8,-40,18,5);P('#3a2c22',dx+8,-39,16,3);P('#1f5230',dx-18,-66,22,12);P('#1f5230',dx+6,-58,22,10)}}
 else if(to==='MEADOW'){P('#3a8ad0',-44,2,60,10);P('#7fc0f0',-40,4,24,2);for(let i=0;i<9;i++){const dx=-30+i*11;P(L.t,dx,-12-(i%3)*3,3,12+(i%3)*3);P(L.t,dx+4,-9,2,9)}for(const dx of [-48,40]){P(K,dx-1,-21,6,21);P('#6a4a2a',dx,-20,4,20);P(K,dx-11,-43,26,25);P(L.t,dx-10,-42,24,23)}for(let i=0;i<5;i++)P(['#ffd94d','#f080a0','#ffffff'][i%3],-46+i*22,-3,2,2)}
 else{for(const dx of [-40,-4,30]){P(K,dx-1,-25,6,25);P('#6a4a2a',dx,-24,4,24);P(K,dx-12,-49,28,27);P(L.t,dx-11,-48,26,25)}}
 /* ground and the road */
 r(L.g,0,gy,W,H-gy);r(L.g2,0,gy,W,3);r(L.p,0,gy+16,W,16);r(K,0,gy+15,W,1);r(K,0,gy+32,W,1);
 for(let i=0;i<14;i++){const tx2=Math.round(((i*37-sc)%(W+20)+W+20)%(W+20))-10;r(L.g2,tx2,gy+6+(i%2)*4,3,2);r(L.g2,tx2+9,gy+40+(i%3)*9,4,2);if(i%3===0)r('#b89860',tx2+4,gy+22+(i%2)*5,3,1)}
 /* the keeper and a few sprouts: no buddies, on purpose */
 const kx=Math.round(-20+Math.min(1,t/2.2)*(W*.42+20)),ky=gy+27;
 T.sp.forEach((ty,i)=>{const bx=kx-20-i*13,by=ky+((i%2)?3:-2);if(bx>-10)drawBud({x:bx,y:by,type:ty,stage:2,z:Math.abs(Math.sin(t*9+i*1.3))*3,a:0,mv:true,st:'follow'})});
 fChibi(kx,ky,Object.assign({},FLOOK[SW.keeper]||FLOOK.WILL,{sc:2}),[1,0],kx<W*.42);
 /* the name card */
 const e=Math.min(1,Math.max(0,(t-.35)/.3)),ny=Math.round(-40+e*58),sub=(typeof WSECSUB!=='undefined'&&WSECSUB[to])||sec.sub||'';
 const sl2=sub?swWrap(sub,W-20).slice(0,2):[],ch=26+sl2.length*11+(sl2.length?4:0);r(K,0,ny-6,W,ch);r(UI.gold,0,ny-6+ch,W,1);const nm=sec.n||to,big=tw(nm,2)<=W-16;text(big?nm:wFit(nm,W-16),Math.round(W/2-tw(big?nm:wFit(nm,W-16),big?2:1)/2),ny,big?2:1,'#ffd94d',null);
 sl2.forEach((l,j)=>text(l,Math.round(W/2-tw(l,1)/2),ny+20+j*11,1,'#cfe0b8',null))
 r(K,0,0,W,6);r(K,0,H-22,W,22);if(t>.6){const h='A  SKIP';text(h,W-8-tw(h,1),H-15,1,'#6a7a62',null)}
 if(t<.15){g.globalAlpha=1-t/.15;r(K,0,0,W,H);g.globalAlpha=1}if(t>WTRAV_T-.2){g.globalAlpha=Math.min(1,(t-(WTRAV_T-.2))/.2);r(K,0,0,W,H);g.globalAlpha=1}}
/* ---- 4. rooms ---- */
const WROOMS=[
 {n:"THE BAKER'S HOUSE",wall:'#e8c8a0',floor:'#b88858',f:[['stove',3,0,2,1,'A big black stove, still warm. It smells like berry pie in here.'],['shelf',6,0,2,1,'Jars of jam, flour, and one jar labelled NOT FOR LOUIE.'],['table',4,4,2,2,'A pie cools on the table. One slice is already gone.'],['bed',0,6,2,3,'A neat little bed with a flour handprint on the pillow.'],['plant',9,7,1,1,'A berry bush in a pot. Somebody talks to it.']]},
 {n:"THE GYM GOER'S HOUSE",wall:'#c8d0e0',floor:'#8a7a6a',f:[['bed',0,0,2,3,'The bed is made so tight a berry would bounce off it.'],['shelf',4,0,3,1,'Trophies. Every one says SECOND PLACE.'],['weights',7,5,2,1,'Dumbbells. You try one. You put it back down quickly.'],['table',3,4,2,2,'A note on the table: GONE TO THE GYM. BACK NEVER.'],['chest',9,0,1,1,'A chest full of clean towels.']]},
 {n:"THE SPROUT LOVER'S HOUSE",wall:'#c8e0b8',floor:'#a89868',f:[['plant',0,0,1,1,'A fern taller than you are.'],['plant',9,0,1,1,'A flower in a boot.'],['shelf',3,0,4,1,'Tiny hats. Dozens of tiny hats, sprout sized.'],['bed',0,6,2,3,'A big bed, and next to it a row of very small beds.'],['table',5,4,2,2,'Seed packets sorted by colour, then by mood.'],['sprout',7,7,1,1,'A sprout waves at you. It lives here. It looks very happy about that.']]}];
const RM={x:40,y:72,w:10,h:10};
function roomEnter(i){if(SCOFF)return;W4.room={i:i%WROOMS.length,x:RM.x+RM.w*8,y:RM.y+RM.h*16-10,dir:[0,-1],mv:false,msg:null,t:0};state='g4room';swSnd(392,.06,523)}
function roomSolid(R,x,y){if(x<RM.x+5||x>RM.x+RM.w*16-5||y<RM.y+6||y>RM.y+RM.h*16-2)return true;
 for(const f of WROOMS[R.i].f){const fx=RM.x+f[1]*16,fy=RM.y+f[2]*16;if(x>fx-3&&x<fx+f[3]*16+3&&y>fy-1&&y<fy+f[4]*16+5)return true}return false}
function roomUpdate(dt){const R=W4.room;if(!R){state='g4world';return}R.t+=dt;
 if(R.msg){if(pressed('a')||pressed('b'))R.msg=null;return}
 let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);R.mv=!!(dx||dy);
 if(dx||dy){R.dir=dx?[dx,0]:[0,dy];const v=62*dt,nx=R.x+dx*v,ny=R.y+dy*v;if(!roomSolid(R,nx,R.y))R.x=nx;if(!roomSolid(R,R.x,ny))R.y=ny}
 const atDoor=Math.abs(R.x-(RM.x+RM.w*8))<12&&R.y>RM.y+RM.h*16-6;
 if(pressed('b')||(atDoor&&keys.down)){W4.room=null;state='g4world';swSnd(523,.06,392);return}
 if(pressed('a')){const px=R.x+R.dir[0]*12,py=R.y+R.dir[1]*12;for(const f of WROOMS[R.i].f){const fx=RM.x+f[1]*16,fy=RM.y+f[2]*16;if(px>fx-4&&px<fx+f[3]*16+4&&py>fy-4&&py<fy+f[4]*16+8){R.msg=f[5];swSnd(660,.04);return}}}}
function roomDraw(){const R=W4.room;if(!R)return;const D=WROOMS[R.i],K='#14101e',x0=RM.x,y0=RM.y,w=RM.w*16,h=RM.h*16;ox=0;oy=0;
 r('#0c0a12',0,0,W,H);r(K,x0-5,y0-37,w+10,h+44);r(D.wall,x0,y0-32,w,32);r('rgba(0,0,0,.12)',x0,y0-6,w,6);r('#6a4a2a',x0,y0-2,w,2);
 for(const wx of [x0+8,x0+w-32]){r(K,wx-1,y0-27,26,18);r('#8fd0f0',wx,y0-26,24,16);r('#ffffff',wx+3,y0-23,6,3);r(K,wx+11,y0-26,1,16);r(K,wx,y0-19,24,1)}
 r(D.floor,x0,y0,w,h);for(let j=0;j<RM.h;j++){r('rgba(0,0,0,.10)',x0,y0+j*16+15,w,1);for(let i=0;i<RM.w;i+=2)r('rgba(0,0,0,.10)',x0+((i+(j%2))*16)%w,y0+j*16,1,15)}
 r('#a33b2e',x0+w/2-26,y0+h/2-10,52,34);r('#c85a48',x0+w/2-23,y0+h/2-7,46,28);r('#e8c060',x0+w/2-23,y0+h/2-7,46,1);r('#e8c060',x0+w/2-23,y0+h/2+20,46,1);
 r(K,x0+w/2-13,y0+h,26,7);r('#8a6a48',x0+w/2-12,y0+h,24,6);r('#c8a060',x0+w/2-10,y0+h-5,20,5);
 const draws=[];for(const f of D.f)draws.push([y0+f[2]*16+f[4]*16,f]);draws.push([R.y,null]);draws.sort((a,b)=>a[0]-b[0]);
 for(const [,f] of draws){if(!f){r('rgba(0,0,0,.2)',Math.round(R.x)-6,Math.round(R.y)-1,12,3);fChibi(Math.round(R.x),Math.round(R.y)+3,FLOOK[SW.keeper]||FLOOK.WILL,R.dir,R.mv);continue}
  const fx=x0+f[1]*16,fy=y0+f[2]*16,fw=f[3]*16,fh=f[4]*16,k=f[0],B=(c,a,b,c2,d)=>r(c,fx+a,fy+b,c2,d);
  if(k==='bed'){B(K,0,-4,fw,fh+4);B('#8a6a48',1,-3,fw-2,fh+2);B('#f4f0ea',3,0,fw-6,10);B('#58a0f0',3,11,fw-6,fh-14);B('#4888d8',3,fh-8,fw-6,3)}
  else if(k==='table'){B(K,0,2,fw,fh-6);B('#a8865c',1,3,fw-2,fh-8);B('#c8a070',1,3,fw-2,2);B(K,2,fh-4,3,5);B(K,fw-5,fh-4,3,5);B('#f4f0ea',fw/2-5,7,10,7);B('#e04838',fw/2-3,9,6,3)}
  else if(k==='shelf'){B(K,0,-22,fw,fh+22);B('#6a4a2a',1,-21,fw-2,fh+20);for(let j=0;j<2;j++){B('#c8a070',2,-18+j*15,fw-4,2);for(let i=0;i<Math.floor((fw-8)/7);i++)B(['#e04838','#58a0f0','#ffd94d','#58c048'][(i+j)%4],5+i*7,-27+j*15+18-8,4,8)}}
  else if(k==='stove'){B(K,0,-14,fw,fh+14);B('#3a3a44',1,-13,fw-2,fh+12);B('#5a5a66',1,-13,fw-2,3);B(K,6,-4,fw-12,12);B('#f08030',8,-2,fw-16,8);B('#ffd94d',11,1,fw-22,4);B(K,fw-9,-30,6,17);B('#3a3a44',fw-8,-29,4,16)}
  else if(k==='plant'){B(K,3,6,10,9);B('#b06a3a',4,7,8,7);B(K,1,-10,14,17);B('#2f7a3c',2,-9,12,15);B('#58c048',4,-7,5,6);B('#f080a0',9,-5,3,3)}
  else if(k==='chest'){B(K,1,0,14,13);B('#8a6a48',2,1,12,11);B('#6a4a2a',2,5,12,1);B('#ffd94d',7,4,2,3)}
  else if(k==='weights'){B(K,2,7,fw-4,3);B('#8c909c',3,8,fw-6,1);for(const a of [1,fw-8]){B(K,a,2,7,13);B('#3a3a44',a+1,3,5,11)}}
  else if(k==='sprout'){drawBud({x:fx+8,y:fy+12,type:4,stage:2,z:Math.abs(Math.sin(R.t*4))*3,a:0,mv:true,st:'idle'})}}
 r(K,0,0,W,20);text(D.n,Math.round(W/2-tw(D.n,1)/2),6,1,'#ffd94d',null);
 if(R.msg)uiSay('',R.msg,999,'A  OK');else{const h='A  LOOK · B  LEAVE';r(K,0,H-16,W,16);text(h,Math.round(W/2-tw(h,1)/2),H-12,1,'#a89ec2',null)}}
/* the story-beat hook also drives the quiet timers */
{const _sb=wStoryBeats;wStoryBeats=function(){wQuietTick();_sb()}}
/* ---- 5. Sunkeep, tidied (Will: "Sunkeep is nice, but it could use an update"; "the pathing needs to be better") ----
   - The well, the notice board, the benches, the flower beds and the pond are solid now. You used to walk
     straight through all of them.
   - The road from the Lantern to the south gate is wider, with a paved middle, lamp posts that light at dusk,
     and two stone gate posts where the road leaves for the Meadow. */
WPROPS.push({k:'lamp',x:222,y:286,tall:1},{k:'lamp',x:258,y:286,tall:1},{k:'lamp',x:222,y:452,tall:1},{k:'lamp',x:258,y:452,tall:1},{k:'gatepost',x:208,y:506,tall:1},{k:'gatepost',x:272,y:506,tall:1});
{const _pd=wPropDraw;wPropDraw=function(d){if(!d.prop||(d.k!=='lamp'&&d.k!=='gatepost'))return _pd(d);const x=Math.round(d.x),y=Math.round(d.y),K='#14101e',dk=wDark();
  if(d.k==='lamp'){r('rgba(0,0,0,.22)',x-4,y+1,9,3);r(K,x-1,y-22,3,24);r('#5a5a66',x,y-21,1,22);r(K,x-4,y-30,9,9);r(dk>.3?'#ffd94d':'#c8ccd4',x-3,y-29,7,7);r(dk>.3?'#fff8c0':'#e8ecf0',x-2,y-28,3,3);r(K,x-3,y-32,7,2);
   if(dk>.3&&g.save){g.globalAlpha=.10+.05*Math.sin(time*3+x);r('#ffd94d',x-16,y-40,33,36);r('#ffd94d',x-10,y-46,21,48);g.globalAlpha=1}}
  else{r('rgba(0,0,0,.25)',x-7,y+1,14,4);r(K,x-6,y-26,12,28);r('#8c909c',x-5,y-25,10,26);for(let i=0;i<4;i++)r('#6e7280',x-5,y-20+i*6,10,1);r('#a8acb6',x-5,y-25,10,2);r(K,x-7,y-30,14,5);r('#a8acb6',x-6,y-29,12,3);r(K,x-2,y-38,5,8);r(dk>.3?'#ffd94d':'#c8a060',x-1,y-37,3,6)}
  return true}}
function wPropSolid(x,y){if(W4.sector!=='BASE')return false;for(const p of WPROPS){const dx=Math.abs(x-p.x),dy=y-p.y;
  if(p.k==='well'){if(dx<13&&dy>-12&&dy<4)return true}else if(p.k==='board'){if(dx<12&&dy>-7&&dy<4)return true}
  else if(p.k==='bench'){if(dx<11&&dy>-9&&dy<3)return true}else if(p.k==='fbed'){if(dx<13&&dy>-6&&dy<5)return true}
  else if(p.k==='pond'){if((dx/25)*(dx/25)+(dy/12)*(dy/12)<1)return true}
  else if(p.k==='lamp'){if(dx<3&&dy>-4&&dy<3)return true}else if(p.k==='gatepost'){if(dx<6&&dy>-6&&dy<3)return true}}return false}
{const _ws=wSolidAt;wSolidAt=function(x,y){return _ws(x,y)||wPropSolid(x,y)}}
