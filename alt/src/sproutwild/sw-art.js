/* ================================================================
   ART PASS (Fable, v5.4) — one look for the whole overworld.
   What the reference games do, applied here:
     · Legacy of Goku: every object carries a dark outline, trees are
       cel-shaded in three flat tones with a hard cast shadow
     · Pokemon: tiles read at a glance, sprites sit on the pixel grid
       (nothing is drawn at a fractional scale any more), small things
       move (leaves sway, water glints, grass parts)
     · Dragon Age: mood comes from light — drifting cloud shadow, sun
       shafts, a warm grade by day, a camp fire and lantern pools at
       night, a soft vignette
   All humans are now drawn by one sprite builder (fChibi) so the
   keeper, the townsfolk, the trainers and King Bibi match.
   ================================================================ */
function artShade(hex,f){const v=[1,3,5].map(i=>parseInt(hex.substr(i,2),16)).map(c=>Math.max(0,Math.min(255,Math.round(f<0?c*(1+f):c+(255-c)*f))));return'#'+v.map(c=>(c<16?'0':'')+c.toString(16)).join('')}
function artCanvas(w,h,fn){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const b=cv.getContext&&cv.getContext('2d');if(!b||!b.fillRect)return cv;fn((c,x,y,w2,h2)=>{b.fillStyle=c;b.fillRect(Math.round(x),Math.round(y),Math.round(w2),Math.round(h2))});return cv}
Object.assign(FLOOK,{
 WILL:{skin:'#e8b088',hair:'#6b4423',top:'#2e8f86',legs:'#2c3242'},
 ERIN:{skin:'#f0bc94',hair:'#c0602a',top:'#e8dcc0',legs:'#3a4a6a',long:1},
 MARCUS:{skin:'#d09a6e',hair:'#1c1c22',top:'#f4f0ea',legs:'#2a4a8a',stripe:'#2a6ad0',beard:1,cap:'#2a6ad0'},
 RANGER:{skin:'#e0a878',hair:'#5a4632',top:'#b89a68',legs:'#5a4632',cap:'#3f7a34'},
 SCOUT:{skin:'#c89878',hair:'#6a4a9e',top:'#4a3a6e',legs:'#2c3242',scarf:'#d05848',long:1},
 PIP:{skin:'#f0bc94',hair:'#8a5f30',top:'#f07830',legs:'#3a6ab0',cap:'#f0c020',sc:.85},
 ELDER:{skin:'#d8a070',hair:'#c8c8ce',top:'#7a5a3a',legs:'#5e442a',beard:1}});
/* x,y = feet centre. dir = facing, mv = walking. */
function fChibi(x,y,L,dir,mv){const s=L.sc||1,K='#14101e',P=(c,a,b,w,h)=>r(c,Math.round(x+a*s),Math.round(y+b*s),Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)));
 const side=dir[0]!==0,back=dir[1]<0&&!side,ph=mv?((time*9+x*.1)|0)%4:0,bob=mv?(ph%2):(Math.sin(time*2+x*.3)>.6?1:0)*0,l1=ph===1?1:0,l2=ph===3?1:0,fx=dir[0]>0?1:-1;
 const top2=L.top2||artShade(L.top,-.24),hair2=artShade(L.hair,-.28),skin2=artShade(L.skin,-.14),leg2=artShade(L.legs,-.25);
 r('rgba(0,0,0,.28)',Math.round(x-6*s),y-1,Math.round(12*s),3);r('rgba(0,0,0,.28)',Math.round(x-4*s),y+2,Math.round(8*s),1);
 P(K,-5,-6,10,7);P(K,-7,-14-bob,14,9);P(K,-7,-26-bob,14,13);if(L.long)P(K,-8,-23-bob,16,14);if(L.big)P(K,-9,-27-bob,18,11);
 if(side){const sw=mv?(ph<2?2:-2):0;P(leg2,-3-sw,-5,3,4);P(L.legs,-2+sw,-5,3,4);P('#2a2228',-3-sw+fx,-1,3,1);P('#2a2228',-2+sw+fx,-1,3,1)}
 else{P(L.legs,-4,-5,3,4-l1);P(L.legs,1,-5,3,4-l2);P(leg2,-1,-5,1,3);P('#2a2228',-4,-1-l1,3,1);P('#2a2228',1,-1-l2,3,1)}
 P(L.top,-5,-13-bob,10,8);P(top2,2,-13-bob,3,8);P(top2,-5,-7-bob,10,2);
 if(L.stripe&&!back)P(L.stripe,-5,-10-bob,10,2);
 if(L.tie&&!back&&!side){P('#f4f0ea',-1,-13-bob,2,2);P(L.tie,-1,-12-bob,2,5)}
 if(L.scarf)P(L.scarf,-5,-14-bob,10,2);
 {const as=mv?(ph<2?1:-1):0;
  if(side){P(top2,-1,-12-bob,3,5);P(L.skin,-1+as*fx,-8-bob,2,2)}
  else{P(L.top,-7,-12-bob,2,5);P(top2,5,-12-bob,2,5);P(L.skin,-7,-8-bob+as,2,2);P(skin2,5,-8-bob-as,2,2)}}
 if(L.long&&!back)P(L.hair,-7,-22-bob,14,11);
 P(L.skin,-6,-25-bob,12,11);P(skin2,-6,-16-bob,12,2);
 if(back){P(L.hair,-6,-25-bob,12,L.long?13:10);P(hair2,-6,-18-bob,12,2);P(artShade(L.hair,.2),-4,-24-bob,4,1)}
 else if(side){P(L.hair,-6,-25-bob,12,4);P(L.hair,fx>0?-6:1,-25-bob,5,L.long?12:8);P(hair2,fx>0?-6:4,-19-bob,2,2);P(artShade(L.hair,.2),-3,-24-bob,4,1)}
 else{P(L.hair,-6,-25-bob,12,4);P(L.hair,-6,-22-bob,2,L.long?10:4);P(L.hair,4,-22-bob,2,L.long?10:4);P(hair2,-3,-22-bob,2,1);P(artShade(L.hair,.2),-4,-24-bob,4,1)}
 if(L.big)P(L.hair,-8,-26-bob,16,6);
 if(!back){const es=side?[fx>0?2:-4]:[-4,2];
  for(const ex of es){if(L.shades)P(K,ex-1,-20-bob,4,2);else{P('#ffffff',ex,-20-bob,2,2);P(K,ex+(side?(fx>0?1:0):(ex<0?1:0)),-20-bob,1,2)}}
  if(L.shades&&!side)P(K,-4,-20-bob,8,1);
  if(L.star&&!side){P(K,-5,-21-bob,4,1);P(K,-4,-22-bob,2,5)}
  if(L.beard){P(L.beardc||L.hair,side?(fx>0?-1:-5):-4,-17-bob,side?6:8,3);P(L.skin,side?(fx>0?2:-3):-1,-17-bob,2,1)}
  else P(artShade(L.skin,-.4),side?(fx>0?2:-3):-1,-17-bob,2,1)}
 if(L.cap){P(K,-7,-27-bob,14,2);P(L.cap,-6,-26-bob,12,3);P(artShade(L.cap,.25),-5,-26-bob,5,1);if(!back)P(L.cap,side?(fx>0?3:-10):-6,-23-bob,side?7:12,1)}
 if(L.helm){P(K,-7,-27-bob,14,2);P(L.helm,-7,-26-bob,14,5);P(artShade(L.helm,.25),-5,-26-bob,5,1);P(artShade(L.helm,-.3),-7,-22-bob,14,1)}
 if(L.crown){P(K,-6,-30-bob,12,6);P('#ffd94d',-5,-29-bob,2,4);P('#ffd94d',-1,-30-bob,2,5);P('#ffd94d',3,-29-bob,2,4);P('#f0b820',-5,-27-bob,10,2);P('#e04838',-1,-27-bob,2,1);P('#fff3b0',-5,-29-bob,1,1)}}
function wHero(x,y){const L=FLOOK[SW.keeper]||FLOOK.WILL,mv=!!(keys.left||keys.right||keys.up||keys.down)&&state==='g4world';fChibi(Math.round(x),Math.round(y)+3,L,[P3.ax||0,P3.ax?0:(P3.ay||1)],mv)}
function uiWill(x,y,sc,ax,ay){fChibi(Math.round(x),Math.round(y)+2,Object.assign({},FLOOK[SW.keeper]||FLOOK.WILL,{sc:Math.max(1,Math.round(sc))}),[ax||0,ax?0:(ay==null?1:ay)],false)}
/* ---------------- trees: outlined, three flat tones, hard shadow ---------------- */
function artTree(R,B,v){const K='#14101e',k=B.tree,x=22,y=44;
 if(k==='cactus'){R(K,x-5,y-26,10,27);R(B.t1,x-4,y-25,8,25);R(B.t2,x-4,y-25,3,25);R(B.t3,x-3,y-24,1,22);R(K,x-12,y-19,7,12);R(B.t1,x-11,y-18,5,10);R(B.t2,x-11,y-18,2,10);R(B.t1,x-7,y-12,4,3);R(K,x+5,y-22,7,13);R(B.t1,x+6,y-21,5,11);R(B.t2,x+6,y-21,2,11);R(B.t1,x+3,y-14,4,3);
  if(v){R('#f078c0',x-2,y-28,4,3);R('#fff3b0',x-1,y-27,2,1)}return}
 if(k==='palm'){R(K,x-3,y-27,7,28);R(B.tk,x-2,y-26,5,26);R(artShade(B.tk,.25),x-2,y-26,2,26);for(let i=0;i<6;i++)R(artShade(B.tk,-.3),x-2,y-23+i*4,5,1);
  R(K,x-19,y-36,39,13);R(K,x-14,y-40,29,6);R(B.t1,x-18,y-31,15,6);R(B.t1,x+4,y-31,15,6);R(B.t2,x-15,y-35,14,5);R(B.t2,x+2,y-35,14,5);R(B.t2,x-9,y-39,19,4);R(B.t3,x-12,y-35,8,2);R(B.t3,x+4,y-35,8,2);R(B.t3,x-5,y-39,10,1);R(B.t1,x-18,y-26,4,2);R(B.t1,x+15,y-26,4,2);
  R(K,x-4,y-30,9,6);R('#8a5a28',x-3,y-29,3,4);R('#8a5a28',x+1,y-29,3,4);return}
 if(k==='shroom'){R(K,x-5,y-20,11,21);R(B.tk,x-4,y-19,9,19);R(artShade(B.tk,-.2),x+1,y-19,4,19);R(artShade(B.tk,-.35),x-4,y-19,9,2);
  R(K,x-18,y-34,37,17);R(K,x-13,y-39,27,6);R(B.t1,x-17,y-26,35,8);R(B.t2,x-17,y-32,35,8);R(B.t2,x-12,y-38,25,6);R(B.t3,x-10,y-37,9,2);R(B.t3,x-15,y-31,5,2);
  R('#f4f0ff',x-8,y-33,4,3);R('#f4f0ff',x+5,y-35,5,3);R('#f4f0ff',x+10,y-28,3,2);R('#f4f0ff',x-14,y-26,3,2);if(v)R('#7ee7ff',x+1,y-30,2,2);return}
 if(k==='pine'){R(K,x-3,y-7,7,8);R(B.tk,x-2,y-6,5,6);R(K,x-15,y-17,31,12);R(B.t1,x-14,y-16,29,10);R(B.t2,x-14,y-16,20,6);R(K,x-11,y-27,23,12);R(B.t1,x-10,y-26,21,10);R(B.t2,x-10,y-26,14,6);R(K,x-7,y-37,15,12);R(B.t1,x-6,y-36,13,10);R(B.t2,x-6,y-36,9,6);R(K,x-3,y-42,7,7);R(B.t2,x-2,y-41,5,5);
  R(B.t3,x-12,y-16,9,2);R(B.t3,x+3,y-16,7,2);R(B.t3,x-8,y-26,8,2);R(B.t3,x+3,y-26,5,2);R(B.t3,x-4,y-36,7,2);R(B.t3,x-1,y-41,3,2);return}
 /* oak */
 R(K,x-5,y-13,11,14);R(B.tk,x-4,y-12,9,12);R(artShade(B.tk,.25),x-4,y-12,3,12);R(artShade(B.tk,-.3),x+2,y-12,3,12);R(K,x-7,y-3,3,4);R(B.tk,x-6,y-2,2,2);R(K,x+5,y-3,3,4);R(B.tk,x+5,y-2,2,2);
 R(K,x-18,y-33,37,22);R(K,x-14,y-40,29,8);R(K,x-9,y-44,19,5);R(K,x-15,y-12,10,4);R(K,x+6,y-12,10,4);
 R(B.t1,x-17,y-32,35,20);R(B.t1,x-13,y-39,27,8);R(B.t1,x-8,y-43,17,5);R(B.t1,x-14,y-12,8,3);R(B.t1,x+7,y-12,8,3);
 R(B.t2,x-17,y-32,28,14);R(B.t2,x-13,y-39,22,8);R(B.t2,x-8,y-43,13,5);R(B.t2,x-14,y-17,10,3);
 R(B.t3,x-12,y-37,9,3);R(B.t3,x-15,y-30,6,3);R(B.t3,x-5,y-42,8,2);R(B.t3,x-2,y-33,7,2);R(B.t3,x-9,y-25,5,2);R(B.t3,x+3,y-38,4,2);
 R(B.t1,x+4,y-24,9,3);R(B.t1,x-6,y-19,8,2);R(B.t1,x+9,y-31,5,3);
 if(v){R('#e04838',x+6,y-27,3,3);R('#ff8a7a',x+6,y-27,1,1);R('#e04838',x-10,y-21,3,3);R('#ff8a7a',x-10,y-21,1,1);R('#e04838',x-1,y-36,3,3)}}
function fTree(B,x,y,s){const v=0,key='_tr'+v; /* fruit marks the trees you can chop */if(!B[key])B[key]=artCanvas(44,48,R=>artTree(R,B,v));const cv=B[key];
 if(cv&&cv.width)g.drawImage(cv,Math.round(x-22+Math.sin(time*1.1+s)*.7),Math.round(y-44))}
function wDrawTree(x,y,s){const B=(W4.fld&&W4.fld.bio)||FBIO.MEADOW;if(!B._tr1)B._tr1=artCanvas(44,48,R=>artTree(R,B,1));
 r('rgba(0,0,0,.24)',Math.round(x-13),Math.round(y-3),28,6);r('rgba(0,0,0,.24)',Math.round(x-8),Math.round(y+3),20,2);
 if(B._tr1&&B._tr1.width)g.drawImage(B._tr1,Math.round(x-22),Math.round(y-44))}
function wDrawNode(nd){const x=Math.round(nd.x+(nd.shake>0?Math.sin(time*70)*1.5:0)),y=Math.round(nd.y),K='#14101e';
 if(nd.k==='tree'){wDrawTree(x,y+5,1);return}
 r('rgba(0,0,0,.24)',x-12,y+3,26,5);
 if(nd.k==='rock'){r(K,x-13,y-9,26,16);r(K,x-9,y-14,17,6);r('#6a7284',x-12,y-8,24,14);r('#8a92a4',x-12,y-8,17,9);r('#8a92a4',x-8,y-13,15,6);r('#c3ccd9',x-7,y-12,8,3);r('#dce6f0',x-6,y-11,4,1);r('#4c5466',x+3,y-3,8,8);r('#4c5466',x-5,y+2,9,3);r(K,x-2,y-6,1,6);r(K,x+5,y-9,1,4);r('#58c048',x-11,y+2,5,2);r('#3f9a46',x+7,y+3,4,2)}
 else{r(K,x-13,y-9,26,15);r(K,x-9,y-14,18,6);r('#2c6e36',x-12,y-8,24,13);r('#3f9a46',x-12,y-8,19,8);r('#3f9a46',x-8,y-13,16,6);r('#86d86c',x-7,y-12,6,2);r('#86d86c',x-10,y-6,4,2);r('#86d86c',x+1,y-9,4,2);
  for(const [bx,by] of [[-6,-3],[3,-5],[7,0],[-1,1],[-9,2]]){r(K,x+bx-1,y+by-1,5,5);r('#e04838',x+bx,y+by,3,3);r('#ff9a8a',x+bx,y+by,1,1)}}}
/* ---------------- Sunkeep set pieces ---------------- */
function wShrine(){const lx=WW/2,K='#14101e',fl=.5+.5*Math.sin(time*2.2),dk=wDark();
 r('rgba(0,0,0,.28)',lx-34,84,68,6);r(K,lx-31,72,62,15);r('#8a7f6a',lx-30,79,60,7);r('#b8b09c',lx-30,79,60,2);r('#9a8f7a',lx-24,73,48,6);r('#c8c0ac',lx-24,73,48,2);
 for(const px of [lx-17,lx+9]){r(K,px-1,26,10,48);r('#7c7260',px,27,8,46);r('#a39a86',px,27,3,46);r('#5e5648',px+6,27,2,46);r('#b8b09c',px-1,27,10,3)}
 r(K,lx-26,10,52,18);r('#6a2a1e',lx-25,21,50,6);r('#8a3a2a',lx-25,14,50,8);r('#a84a36',lx-25,14,50,3);r('#c05a40',lx-21,14,16,1);r(K,lx-18,6,36,7);r('#8a3a2a',lx-17,7,34,6);r('#a84a36',lx-17,7,34,2);r(K,lx-3,0,6,8);r('#ffd23f',lx-2,1,4,6);r('#fff3b0',lx-1,2,2,3);
 /* banners */
 for(const [bx,c] of [[lx-29,'#2e8f86'],[lx+23,'#c0602a']]){const wv=Math.round(Math.sin(time*2+bx)*1);r(K,bx-1,30,8,22);r(c,bx,31,6,19+wv);r(artShade(c,.3),bx,31,2,19+wv);r('#ffd94d',bx+2,36,2,4)}
 g.globalAlpha=.14+.08*fl+dk*.1;r('#ffd94d',lx-22,26,44,46);g.globalAlpha=.2+.1*fl;r('#ffd94d',lx-13,32,26,34);g.globalAlpha=1;
 r(K,lx-11,30,22,34);r('#3c2a16',lx-10,31,20,32);r('#ffd94d',lx-7,35,14,24);r('#fff3b0',lx-5,38,10,18);r('#ffffff',lx-2,42,4,10);r('#3c2a16',lx-1,31,2,32);r('#3c2a16',lx-10,46,20,2);
 {const lab='LV'+SW.baseLv,lw=tw(lab,1)+6;r(K,lx-lw/2,87,lw,10);r('#ffd23f',lx-lw/2+1,88,lw-2,8);text(lab,Math.round(lx-lw/2+3),89,1,K,null)}
 /* the camp fire the workers rest around */
 {const cx=240,cy=176,f=((time*9)|0)%3;r('rgba(0,0,0,.25)',cx-10,cy+1,20,4);for(const [sx,sy] of [[-9,0],[-6,3],[0,4],[6,3],[9,0],[-6,-3],[6,-3]]){r(K,cx+sx-2,cy+sy-2,5,5);r('#8a92a4',cx+sx-1,cy+sy-1,3,3)}
  r('#5a3d22',cx-6,cy-1,12,3);r('#3c2a16',cx-4,cy-3,8,2);r('#e2541e',cx-4,cy-9-f,8,8+f);r('#ffb040',cx-3,cy-7-f,6,6+f);r('#fff3b0',cx-1,cy-4,3,3);
  g.globalAlpha=.10+dk*.22+.03*f;r('#ffb040',cx-34,cy-26,68,48);r('#ffb040',cx-22,cy-34,44,62);g.globalAlpha=1;
  for(let i=0;i<3;i++){const k=((time*.9+i*.33)%1);r('#ffd94d',Math.round(cx-3+i*3+Math.sin(time*3+i)*2),Math.round(cy-10-k*18),1,1)}}}
function wGateArt(gx,gy2){const K='#14101e',fl=.5+.5*Math.sin(time*2.4);
 r('rgba(0,0,0,.28)',gx-23,gy2-3,46,6);
 for(const px of [gx-21,gx+13]){r(K,px-1,gy2-37,10,37);r('#5c6675',px,gy2-36,8,35);r('#8a92a4',px,gy2-36,3,35);r('#3f4654',px+6,gy2-36,2,35);r('#c8ccd4',px-1,gy2-36,10,3);r('#7ee7ff',px+3,gy2-26,2,2);r('#7ee7ff',px+3,gy2-16,2,2)}
 r(K,gx-24,gy2-45,48,10);r('#8a6238',gx-23,gy2-44,46,8);r('#b0834e',gx-23,gy2-44,46,2);r('#5a3d22',gx-23,gy2-38,46,2);r(K,gx-4,gy2-43,8,6);r('#ffd23f',gx-3,gy2-42,6,4);
 g.globalAlpha=.34+.2*fl;r('#7ee7ff',gx-13,gy2-34,26,33);g.globalAlpha=1;r('#bdf3ff',gx-9,gy2-30,18,26);r('#ffffff',gx-4,gy2-26,8,18);
 for(let i=0;i<4;i++){const k=((time*.7+i*.25)%1);r('#ffffff',Math.round(gx-10+i*6+Math.sin(time*2+i)*2),Math.round(gy2-4-k*30),1,2)}
 if(Math.hypot(P3.x-gx,P3.y-(gy2-16))<70){const lab='LANTERN GATE',lw=tw(lab,1)+4;r('rgba(10,14,8,.7)',gx-lw/2,gy2-57,lw,9);text(lab,Math.round(gx-lw/2+2),gy2-56,1,'#ffe8b0',null)}}
/* ---------------- light and air ---------------- */
function fxAtmos(){const id=W4.sector,dk=wDark(),cx=W4.cam?W4.cam.x:0,cy=W4.cam?W4.cam.y:0,open=id!=='GLOOM';
 if(open&&dk<.6){ /* cloud shadows crossing the ground */
  for(let i=0;i<3;i++){const sx=Math.round(((i*340+time*9)%1100)-220-cx),sy=Math.round(40+i*190-cy);if(sx>W||sx<-140||sy>H||sy<-80)continue;
   r('rgba(8,24,40,.07)',sx,sy+12,130,40);r('rgba(8,24,40,.07)',sx+16,sy,98,64);r('rgba(8,24,40,.05)',sx+34,sy-8,60,80)}}
 if(open&&dk<.25&&g.beginPath&&(id==='BASE'||id==='MEADOW'||id==='TOWN'||id==='SHORE')){ /* sun shafts */
  g.save();g.fillStyle='#fff3b0';for(let i=0;i<3;i++){const bx=((i*110+time*3)%(W+120))-60;g.globalAlpha=.035+.015*Math.sin(time*.7+i);g.beginPath();g.moveTo(bx,0);g.lineTo(bx+26,0);g.lineTo(bx-40,H);g.lineTo(bx-80,H);g.closePath();g.fill()}g.restore();g.globalAlpha=1}
 if(open&&dk<.3)r('rgba(255,214,140,.045)',0,0,W,H);
 if(id==='BASE'||id==='MEADOW'||id==='TOWN'){ /* butterflies by day, fireflies by night */
  for(let i=0;i<4;i++){const wx=(i*173+Math.sin(time*.5+i*2)*60+time*4)%600,wy=80+i*110+Math.sin(time*.8+i)*30,sx=Math.round(wx-cx),sy=Math.round(wy-cy);if(sx<0||sx>W||sy<18||sy>H-18)continue;
   if(dk>.5){if(Math.sin(time*3+i)>0)r('#fff3b0',sx,sy,2,2)}else{const fp=((time*10+i)|0)%2,c=['#f078c0','#ffffff','#ffd94d','#7fd0e8'][i];r(c,sx-(fp?2:1),sy,fp?2:1,2);r(c,sx+1,sy,fp?2:1,2);r('#14101e',sx,sy,1,2)}}}
 /* vignette */
 r('rgba(6,8,20,.10)',0,16,W,6);r('rgba(6,8,20,.10)',0,H-22,W,6);r('rgba(6,8,20,.07)',0,16,5,H-32);r('rgba(6,8,20,.07)',W-5,16,5,H-32);
 for(const [vx,vy] of [[0,16],[W-18,16],[0,H-34],[W-18,H-34]])r('rgba(6,8,20,.08)',vx,vy,18,18)}
