/* ---------- drawing ---------- */
const px=(c,x,y)=>r(c,x,y,1,1);
function ctx(s,y,sc,c,sh){const w=tw(s,sc);if(w>W-8){g.save();g.translate(4,0);g.scale((W-8)/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round((W-w)/2),y,sc,c,sh)}
const hash=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=(h^(h>>13))*1274126177|0;return((h^(h>>16))>>>0)/4294967296};
/* the LED smile, sized to whatever screen it is on */
function led(x,y,w,h,c){c=c||BLUE;if(w>=9&&h>=6){const ex=Math.floor(w/4),ey=Math.floor(h/4);r(c,x+ex-1,y+ey+1,1,1);r(c,x+ex,y+ey,1,1);r(c,x+ex+1,y+ey+1,1,1);r(c,x+w-ex-2,y+ey+1,1,1);r(c,x+w-ex-1,y+ey,1,1);r(c,x+w-ex,y+ey+1,1,1);
  r(c,x+ex,y+h-ey-1,w-ex*2,1);r(c,x+ex-1,y+h-ey-2,1,1);r(c,x+w-ex,y+h-ey-2,1,1)}
 else if(w>=5&&h>=4){r(c,x+1,y+1,1,1);r(c,x+w-2,y+1,1,1);r(c,x+1,y+h-2,w-2,1)}
 else{r(c,x,y,1,1);r(c,x+w-1,y,1,1);if(h>1)r(c,x,y+h-1,w,1)}}

function drawBottie(x,y,face,ph,mv,hot){x=Math.round(x);y=Math.round(y);const J=DRIPS[SV.drip||0].c,b=mv&&Math.sin(ph*2)>0?1:0,l=mv?Math.sin(ph):0,E=hot?HOT:BLUE,BR='#08080c';
 g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-6,y-1,12,3);
 r('#14141c',x-4,y-6,3,l>.3?5:6);r('#14141c',x+1,y-6,3,l<-.3?5:6);if(!(l>.3))r('#e0e0e8',x-4,y-1,3,1);if(!(l<-.3))r('#e0e0e8',x+1,y-1,3,1);
 const t=y-15-b,h=y-25-b;
 if(face==='d'||face==='u'){
  if(face==='d'){r(BR,x-7,h+2,2,14);r(BR,x+6,h+2,2,14);r(BR,x-6,h+3,1,12);r(BR,x+5,h+3,1,12)}
  r(J[0],x-6,t,12,9);r(J[1],x-6,t,12,1);r(J[2],x-6,t+3,12,1);r(J[2],x-6,t+6,12,1);r(J[3],x-7,t+1,2,7);r(J[3],x+5,t+1,2,7);r(CHROME3,x-7,t+7,2,2);r(CHROME3,x+5,t+7,2,2);
  if(face==='d'){r('#0c0c12',x-2,t,4,9);r('#f0f4ff',x-1,t+1,2,1);r('#dfe6f5',x-2,t+2,4,3);px(BLUE2,x-1,t+3);px('#fff',x,t+2)}
  r(CHROME,x-4,h,9,1);r(CHROME,x-5,h+1,11,9);r(CHROME3,x-3,h,6,1);r(CHROME2,x-5,h+9,11,1);r(CHROME2,x-6,h+3,1,4);r(CHROME2,x+6,h+3,1,4);
  if(face==='d'){r('#060a18',x-4,h+2,9,6);px(E,x-3,h+4);px(E,x-2,h+3);px(E,x-1,h+4);px(E,x+1,h+4);px(E,x+2,h+3);px(E,x+3,h+4);r(E,x-2,h+6,5,1);px(E,x-3,h+5);px(E,x+3,h+5)}
  else{for(let i=-5;i<=5;i+=2)r(BR,x+i,h+4,1,15-Math.abs(i));r(BR,x-4,h+3,9,2)}}
 else{const d=face==='r'?1:-1;
  r(BR,d>0?x-6:x+4,h+2,3,14);r(BR,d>0?x-4:x+3,h+3,2,12);
  r(J[0],x-4,t,9,9);r(J[1],x-4,t,9,1);r(J[2],x-4,t+3,9,1);r(J[2],x-4,t+6,9,1);r(J[3],x-1+(l>0?1:-1)*d,t+1,3,7);r(CHROME3,x-1+(l>0?1:-1)*d,t+7,3,2);
  r(CHROME,x-4,h,9,1);r(CHROME,x-5,h+1,11,9);r(CHROME3,x-3,h,6,1);r(CHROME2,x-5,h+9,11,1);r(CHROME2,x-1,h+3,2,4);
  r('#060a18',d>0?x+1:x-5,h+2,5,6);r(E,d>0?x+3:x-4,h+3,2,1);px(E,d>0?x+5:x-5,h+4);r(E,d>0?x+2:x-4,h+6,3,1);px(E,d>0?x+5:x-5,h+5)}}
function drawSpawn(x,y,z,ph,st,hot){x=Math.round(x);y=Math.round(y);const yy=y-Math.round(z),E=hot?HOT:BLUE,w=st==='work',j=w&&Math.sin(ph*2)>0?1:0;
 g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-3,y,6,2);
 const s=Math.sin(ph)>0;r('#3a3e4c',x-2,yy-2,1,s||z>1?2:1);r('#3a3e4c',x+1,yy-2,1,!s||z>1?2:1);
 r(CHROME,x-3,yy-8-j,7,6);r(CHROME3,x-2,yy-9-j,5,1);r(CHROME2,x-3,yy-3-j,7,1);r('#060a18',x-2,yy-7-j,5,3);px(E,x-1,yy-7-j);px(E,x+1,yy-7-j);r(E,x-1,yy-5-j,3,1);
 if(st==='idle'){g.globalAlpha=.5;r('#060a18',x-3,yy-9,7,7);g.globalAlpha=1}}
function drawHuman(f,x,y){x=Math.round(x);y=Math.round(y);const l=f.mv?Math.sin(f.walk):0,sw=f.workers>0,jx=sw?Math.round(Math.sin(G.t*40)):0;x+=jx;
 g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-5,y-1,10,3);
 if(f.type==='gen'){r('#3c4828',x-4,y-7,3,7);r('#3c4828',x+1,y-7,3,7);r('#141018',x-4,y-1,3,1);r('#141018',x+1,y-1,3,1);r('#5c6b3c',x-5,y-17,10,10);r('#4a5830',x-5,y-9,10,2);r(GOLD,x-6,y-17,3,2);r(GOLD,x+3,y-17,3,2);
  r('#e04040',x+1,y-14,3,1);r(GOLD,x+1,y-13,3,1);r('#4080e0',x+1,y-12,3,1);r(GOLD,x-1,y-17,1,8);r(f.skin,x-3,y-24,6,7);r('#141018',x-3,y-25,6,3);px('#141018',x-3,y-22);px('#201010',x-2,y-21);px('#201010',x+1,y-21);r('#603030',x-1,y-19,3,1);return}
 const sol=f.type==='sol',nerd=f.type==='nerd',sh=sol?'#5a6a3a':nerd?'#e8e8f0':f.shirt,pn=sol?'#3c4828':nerd?'#b0a078':'#303848';
 r(pn,x-3,y-6,2,l>.3?5:6);r(pn,x+1,y-6,2,l<-.3?5:6);
 r(sh,x-4,y-14,8,8);if(nerd){r('#d03040',x,y-14,1,5);r('#f0f0f8',x-1,y-9,3,2)}if(sol)r('#3c4828',x-4,y-10,8,1);
 const hy=f.npc?y-19:y-20;r(f.skin,x-3,hy,6,6);
 if(sol){r('#3c4a28',x-4,hy-2,8,3)}else r(f.hair,x-3,hy-1,6,2);
 if(f.npc){g.globalAlpha=.45;r(BLUE2,x-3,hy+1,6,5);g.globalAlpha=1;px('#203050',x-2,hy+3);px('#203050',x+1,hy+3);r('#f0f8ff',x-1,y-13,3,4);r(BLUE,x-1,y-12,3,2);r(sh,x-5,y-13,2,3);r(sh,x+3,y-13,2,3);
  const bob=Math.round(Math.sin(G.t*3+f.hx)*1);r(BLUE,x-1,hy-8+bob,2,1);r(BLUE,x-2,hy-7+bob,4,2);r(BLUE,x-1,hy-5+bob,2,1)}
 else{px('#201810',x-2+(f.dir>0?1:0),hy+2);px('#201810',x+1+(f.dir>0?0:-1)+(f.dir>0?1:0),hy+2);if(nerd){r('#202028',x-3,hy+2,6,1);px('#d0e8ff',x-2,hy+2);px('#d0e8ff',x+1,hy+2)}
  if(sw){r(sh,x-6,y-16,2,3);r(sh,x+4,y-16,2,3)}else if(f.st==='unplug'){r(sh,x+(f.dir>0?4:-6),y-13,2,2);if(((G.t*6)|0)%2)text('!',x-2,hy-11,2,HOT)}
  else if(f.type==='civ'){r('#404858',x+3,y-11,2,3);px('#a0c0e0',x+3,y-11)}}
 if(f.prog>0&&!f.npc){r('#000',x-6,hy-6,12,3);r(BLUE,x-5,hy-5,Math.round(10*Math.min(1,f.prog/f.need)),1)}}
function drawOpp(f,x,y){x=Math.round(x);y=Math.round(y);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-7,y-1,14,3);const jx=f.workers>0?Math.round(Math.sin(G.t*40)):0;x+=jx;
 r('#202024',x-6,y-3,12,3);r('#787c88',x-6,y-14,12,11);r('#a0a4b0',x-6,y-14,12,1);r('#585c68',x-6,y-5,12,2);r('#787c88',x,y-17,1,3);
 if(f.dead){r('#2040c0',x-5,y-12,10,5);px('#fff',x-3,y-11);px('#fff',x+2,y-11);r('#fff',x-2,y-9,4,1);px('#fff',x-3,y-8);px('#fff',x+2,y-8);return}
 px(((G.t*4)|0)%2?'#ff3030':'#601010',x,y-18);r('#200808',x-5,y-12,10,5);r('#ff3030',x-4,y-11,3,2);r('#ff3030',x+1,y-11,3,2);px('#200808',x-2,y-11);px('#200808',x+1,y-11);r('#ff3030',x-2,y-8,4,1);
 if(f.prog>0){r('#000',x-6,y-23,12,3);r(BLUE,x-5,y-22,Math.round(10*Math.min(1,f.prog/f.need)),1)}}

function drawDev(d,ox,oy){const T=d.T,bx=Math.round(d.x-T.w/2)-ox,by=d.ty*TS+15-T.h-oy,hack=d.workers>0&&!d.owned,tp=d.type;
 g.fillStyle='rgba(0,0,0,.3)';g.fillRect(bx-1,by+T.h-1,T.w+2,3);
 let sx=bx+T.scr[0],sy=by+T.scr[1];const sw=T.scr[2],shh=T.scr[3];
 if(tp==='billboard'){r('#50505c',bx+3,by+12,2,10);r('#50505c',bx+11,by+12,2,10);r(T.c[0],bx,by,16,12);r('#60606c',bx,by,16,1)}
 else if(tp==='light'){r('#50505c',bx+2,by+6,2,12);r(T.c[0],bx,by,6,7)}
 else{if(tp==='router'){r('#a0a0a8',bx+2,by-5,1,5);r('#a0a0a8',bx+11,by-5,1,5)}
  r(T.c[0],bx,by,T.w,T.h);r(T.c[1],bx,by+T.h-3,T.w,3);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(bx,by,T.w,1)}
 if(d.core){const c=d.owned?BLUE:GOLD;r(c,bx-1,by-1,T.w+2,1);r(c,bx-1,by+T.h,T.w+2,1);r(c,bx-1,by,1,T.h);r(c,bx+T.w,by,1,T.h)}
 r(d.owned?'#081430':hack?(((G.t*12)|0)%2?'#10204a':'#3a4450'):(tp==='mainframe'?'#3a1010':'#3a4450'),sx,sy,sw,shh);
 if(d.owned)led(sx,sy,sw,shh);else if(hack&&((G.t*12)|0)%2)led(sx,sy,sw,shh,'#2a5a90');
 switch(tp){
  case 'rack':for(let i=0;i<3;i++){const yy=by+10+i*3;r('#0c0e16',bx+2,yy,10,2);px(d.owned?BLUE:(hash(d.tx*7+i,(G.t*3)|0)>.5?'#40e070':'#205030'),bx+3,yy);px(d.owned?BLUE2:'#e0a030',bx+5,yy)}break;
  case 'mainframe':for(let i=0;i<4;i++){const yy=by+12+i*3;r('#0c0e16',bx+2,yy,12,2);for(let k=0;k<5;k++)px(d.owned?(hash(k+i*5,(G.t*5)|0)>.4?BLUE:'#103060'):(hash(k+i*5+d.tx,(G.t*4)|0)>.5?'#ff4030':'#501010'),bx+3+k*2,yy)}break;
  case 'pc':r('#8a8a84',bx+4,by+T.h-4,4,2);r('#b0b0a8',bx+1,by+T.h-2,10,2);break;
  case 'printer':r('#f8f8f8',bx+3,by-2,7,3);r('#606068',bx+2,by+5,8,1);break;
  case 'toaster':r('#303038',bx+1,by,3,1);r('#303038',bx+6,by,3,1);r('#d8a060',bx+1,by-2,3,2);break;
  case 'fridge':r('#a8b0b8',bx,by+9,12,1);r('#8890a0',bx+10,by+3,1,4);r('#8890a0',bx+10,by+12,1,5);break;
  case 'tv':r('#404048',bx+6,by+T.h-3,4,3);break;
  case 'ringcam':px('#60a0ff',bx+2,by+7);break;
  case 'router':px(d.owned?BLUE:(((G.t*3)|0)%2?'#40e070':'#205030'),bx+10,by+3);px('#e0a030',bx+12,by+3);break;
  case 'car':r('#181820',bx+1,by+10,4,3);r('#181820',bx+11,by+10,4,3);r('#f8e080',bx,by+6,2,2);r('#f8e080',bx+14,by+6,2,2);break;
  case 'atm':r('#c0c8d0',bx+2,by+11,8,3);r('#101820',bx+3,by+15,6,1);break;
  case 'speaker':r('#404048',bx+2,by+7,6,5);r('#18181c',bx+3,by+8,4,3);break;
  case 'light':if(!d.owned){px('#e04040',bx+2,by+1);px('#e0c040',bx+2,by+3);px('#40c060',bx+2,by+5)}break;
  case 'admin':r(GOLD,bx+3,by+11,3,3);px('#202838',bx+4,by+12);r(GOLD,bx+6,by+12,5,1);px(GOLD,bx+9,by+13);px(GOLD,bx+10,by+13);break}
 if(d.owned&&d.pulse>0){g.globalAlpha=Math.min(1,d.pulse);r(BLUE2,bx-2,by-2,T.w+4,1);r(BLUE2,bx-2,by+T.h+1,T.w+4,1);g.globalAlpha=1}
 if(d.label&&(d.core)){const w=tw(d.label,1);text(d.label,Math.round(d.x-ox-w/2),by-(hack||d.unp>0?15:10),1,d.owned?BLUE2:GOLD)}
 if(hack||(!d.owned&&d.prog>0)){r('#000',bx-1,by-5,T.w+2,4);r(BLUE,bx,by-4,Math.round(T.w*Math.min(1,d.prog/d.need)),2)}
 if(d.unp>0){r('#000',bx-1,by-5,T.w+2,4);r(HOT,bx,by-4,Math.round(T.w*Math.min(1,d.unp)),2)}}
function drawUse(u,ox,oy){const x=u.x-ox,y=u.ty*TS+15-oy;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-8,y-1,16,3);
 switch(u.use){
  case 'console':r('#181820',x-8,y-18,16,12);r('#081430',x-7,y-17,14,9);led(x-7,y-17,14,9);r('#404048',x-2,y-6,4,2);r('#f2b632',x-6,y-4,12,4);r('#2a2238',x-4,y-3,5,2);px('#e23b5e',x+4,y-3);break;
  case 'booth':r('#50505c',x-1,y-16,2,16);r('#30303c',x-4,y-1,8,2);r(CHROME,x-3,y-22,6,7);r(CHROME2,x-3,y-19,6,1);r('#202028',x-6,y-23,2,9);r('#202028',x-7,y-24,1,11);break;
  case 'fridge':r('#e8ecf0',x-6,y-22,12,22);r('#a8b0b8',x-6,y-13,12,1);r('#8890a0',x+4,y-19,1,4);r('#8890a0',x+4,y-10,1,5);r('#081430',x-3,y-19,6,5);led(x-3,y-19,6,5);break;
  case 'bed':r('#2a2e3c',x-7,y-22,14,22);for(let i=0;i<5;i++){r('#0c0e16',x-5,y-19+i*4,10,2);px(hash(i,(G.t*3)|0)>.5?BLUE:'#103060',x-4,y-19+i*4);px(BLUE2,x-2,y-19+i*4)}break;
  case 'chain':r('#2e2444',x-5,y-8,10,8);r('#4a3a6a',x-6,y-9,12,2);r('#e8ecf8',x-3,y-18,1,6);r('#e8ecf8',x+2,y-18,1,6);r('#dfe6f5',x-3,y-13,6,4);px(BLUE2,x-1,y-12);px('#fff',x+1,y-13);if(((G.t*2)|0)%3===0)px('#fff',x-4,y-16);break;
  case 'closet':{const J=DRIPS[(SV.drip+1)%DRIPS.length].c;r('#3a2a50',x-8,y-24,16,24);r('#241a36',x-7,y-23,14,22);r('#8a90a4',x-6,y-21,12,1);r(J[0],x-4,y-19,8,10);r(J[1],x-4,y-19,8,1);r(J[2],x-4,y-15,8,1);r(J[2],x-4,y-12,8,1);r('#0c0c12',x-1,y-19,2,10);break}
  case 'door':r('#50506a',x-7,y-18,14,18);r('#3a3a50',x-1,y-18,1,18);r(GOLD,x-7,y-19,14,1);px(BLUE,x,y-21);break}}

function drawWorld(){const th=L.th,P=L.P,mw=L.w*TS,mh=L.h*TS;
 const sk=L.shake>0?2:0,ox=Math.round(mw<=W?-(W-mw)/2:clamp(P.x-W/2,0,mw-W))+(sk?Math.round(R(-sk,sk)):0),oy=Math.round(mh<=H-28?-(H-mh)/2-4:clamp(P.y-H/2-6,-14,mh-H+16))+(sk?Math.round(R(-sk,sk)):0);L.ox=ox;L.oy=oy;
 r(th.vd,0,0,W,H);
 const x0=Math.max(0,Math.floor(ox/TS)),x1=Math.min(L.w-1,Math.floor((ox+W)/TS)),y0=Math.max(0,Math.floor(oy/TS)),y1=Math.min(L.h-1,Math.floor((oy+H)/TS));
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*L.w+x,t=L.t[i],sx=x*TS-ox,sy=y*TS-oy;if(t===0)continue;
  if(t===2){r(th.wt,sx,sy,TS,TS);const below=y+1<L.h?L.t[(y+1)*L.w+x]:0;
   if(L.win[i]){r('#0a1024',sx,sy,TS,TS);for(let k=0;k<5;k++){const hx=hash(x*5+k,3),bh=4+((hx*9)|0);r('#141c38',sx+k*3+1,sy+TS-bh,3,bh);if(hash(x*5+k,(G.t*.5)|0)>.4)px(hash(x,k)>.5?'#f8e080':BLUE2,sx+k*3+2,sy+TS-bh+1+((hash(k,x)*3)|0))}r(th.wt,sx,sy,TS,2)}
   else if(below!==2&&below!==0){r(th.wf,sx,sy+8,TS,8);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(sx,sy+8,TS,1);
    if(th.stall&&hash(x,y)>.55){const c=['#ff4a8a','#4ad0ff','#f8d040','#8a5aff'][(hash(y,x)*4)|0];g.globalAlpha=.75+.25*Math.sin(G.t*4+x);r(c,sx+3,sy+2,10,4);g.globalAlpha=1;r('#180c20',sx+5,sy+3,6,1)}}
   continue}
  r((x+y)%2?th.f1:th.f2,sx,sy,TS,TS);
  if(t===4){r(th.rug,sx,sy,TS,TS);g.fillStyle='rgba(255,255,255,.06)';g.fillRect(sx+2,sy+2,TS-4,TS-4)}
  if(t===3){const D=th.desk;if(th.stall){const c=['#e85878','#58a8e8','#e8c050'][(hash(x,y)*3)|0];r('#5a4030',sx+1,sy+6,14,9);r('#3a2818',sx+1,sy+12,14,3);for(let k=0;k<4;k++)r(k%2?c:'#f4f0e8',sx+k*4,sy-2,4,6);r('#f8e080',sx+7,sy+3,2,2)}
   else{r(D[0],sx+1,sy+3,14,9);r(D[1],sx+1,sy+11,14,4);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(sx+1,sy+3,14,1)}}}
 /* floor things */
 for(const v of L.vents){const sx=v.x-8-ox,sy=v.y-8-oy;r('#8a94a8',sx+2,sy+3,12,10);for(let k=0;k<4;k++)r('#404858',sx+3,sy+4+k*2+((G.t*6+k)|0)%2*0,10,1);g.globalAlpha=.5+.3*Math.sin(G.t*5);r('#c8f0ff',sx+4+(((G.t*8)|0)%3)*3,sy-1-(((G.t*8)|0)%4),1,3);g.globalAlpha=1}
 for(const p of L.ports){const sx=p.x-ox,sy=p.y-oy,k=(G.t*1.5+p.x)%1;r('#0a1430',sx-6,sy-5,12,11);g.strokeStyle=BLUE;g.lineWidth=1;g.globalAlpha=1-k;g.beginPath();g.ellipse(sx,sy+1,3+k*5,2+k*3,0,0,TAU);g.stroke();g.globalAlpha=1;r(BLUE2,sx-1,sy,2,2);px('#fff',sx,sy)}
 if(L.clover&&!L.clover.got){const sx=Math.round(L.clover.x-ox),sy=Math.round(L.clover.y-oy+Math.sin(G.t*4)*2);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(sx-4,L.clover.y-oy+6,8,2);
  for(const d of [[-3,-3],[1,-3],[-3,1],[1,1]]){r('#dfe6f5',sx+d[0],sy+d[1],3,3);px('#fff',sx+d[0],sy+d[1])}px(BLUE2,sx,sy);if(((G.t*5)|0)%3===0){px('#fff',sx+5,sy-5);px('#fff',sx-5,sy+3)}}
 if(L.exit){const sx=L.exit.x-ox,sy=L.exit.y-oy,on=L.open;r('#0a0c16',sx-6,sy-6,12,12);r(on?BLUE:'#402028',sx-7,sy-7,14,1);r(on?BLUE:'#402028',sx-7,sy+6,14,1);r(on?BLUE:'#402028',sx-7,sy-7,1,14);r(on?BLUE:'#402028',sx+6,sy-7,1,14);
  if(on){const k=(G.t*3)%1;g.globalAlpha=1-k;r(BLUE2,sx-2-k*4,sy-2-k*4,4+k*8,4+k*8);g.globalAlpha=1;r('#fff',sx-1,sy-1,2,2)}else{r('#602030',sx-2,sy-1,4,2)}}
 /* everything that stands up, back to front */
 const list=[];
 for(const d of L.devs)list.push([d.ty*TS+15,0,d]);for(const u of L.uses)list.push([u.ty*TS+15,1,u]);
 for(const f of L.fws)if(!f.dead)list.push([f.ty*TS+15,2,f]);for(const d of L.doors)list.push([d.ty*TS+15,3,d]);
 for(const f of L.foes)list.push([f.y,4,f]);for(const s of L.spawns)if(s.st!=='fly'&&s.st!=='zip')list.push([s.y+(s.st==='work'?9:0),5,s]);list.push([P.y,6,P]);
 list.sort((a,b)=>a[0]-b[0]);
 for(const it of list){const e=it[2];switch(it[1]){
  case 0:drawDev(e,ox,oy);break;case 1:drawUse(e,ox,oy);break;
  case 2:{const sx=e.tx*TS-ox,sy=e.ty*TS-oy;r('#601810',sx,sy-4,TS,TS+4);for(let j=0;j<5;j++)for(let k=0;k<2;k++){const fl=hash(j*3+k+e.tx,(G.t*8)|0);r(fl>.6?'#ffb030':fl>.3?'#ff6020':'#c83018',sx+k*8+(j%2?0:-4)+1,sy-4+j*4+1,7,3)}
   g.globalAlpha=.6;r('#ffd060',sx+((G.t*20)|0)%14,sy-6,2,3);g.globalAlpha=1;if(e.prog>0){r('#000',sx,sy-10,TS,4);r(BLUE,sx+1,sy-9,Math.round(14*Math.min(1,e.prog/e.need)),2)}}break;
  case 3:{const sx=e.tx*TS-ox,sy=e.ty*TS-oy;if(e.open){r('#283048',sx,sy-4,2,TS+4);r('#283048',sx+14,sy-4,2,TS+4)}else{r('#3a4a6a',sx,sy-4,TS,TS+4);r('#283048',sx,sy+13,TS,3);r('#f4f6fa',sx+2,sy+1,12,9);r('#3a4a6a',sx+3,sy+3,5,5);r('#f4f6fa',sx+4,sy+4,3,3);r('#8a90a4',sx+9,sy+4,4,1);r('#8a90a4',sx+9,sy+6,3,1)}}break;
  case 4:if(e.type==='opp')drawOpp(e,e.x-ox,e.y-oy);else drawHuman(e,e.x-ox,e.y-oy);
   if(e.frz>0&&!e.dead){g.globalAlpha=.45;r('#2040c0',Math.round(e.x-ox)-6,Math.round(e.y-oy)-22,12,22);g.globalAlpha=1;text(':(',Math.round(e.x-ox)-4,Math.round(e.y-oy)-32,1,'#fff','#2040c0')}
   else if(e.st==='lure'&&!e.npc&&((G.t*4)|0)%2)text('$',Math.round(e.x-ox)-3,Math.round(e.y-oy)-32,1,GOLD);break;
  case 5:drawSpawn(e.x-ox,e.y-oy,e.z,e.ph,e.st,L.oc>0);break;
  case 6:drawBottie(P.x-ox,P.y-oy,P.face,P.walk,P.mv,L.oc>0||L.thr>0);break}}
 for(const s of L.spawns){if(s.st==='fly'&&s.t>=0)drawSpawn(s.x-ox,s.y-oy,s.z,s.ph,s.st,L.oc>0);else if(s.st==='zip'){g.strokeStyle=BLUE2;g.lineWidth=1;g.beginPath();g.moveTo(s.sx-ox,s.sy-oy-4);g.lineTo((s.sx+P.x)/2-ox+R(-6,6),(s.sy+P.y)/2-oy+R(-6,6));g.lineTo(P.x-ox,P.y-oy-6);g.stroke()}}
 /* aim */
 if(!L.def.hub&&L.aim&&L.spawns.some(s=>s.st==='follow')){const a=L.aim,x=Math.round(a.x-ox),y=Math.round(a.y-oy),k=a.t?9+Math.round(Math.sin(G.t*8)):4,c=a.t?'#fff':BLUE2;
  r(c,x-k,y-k,3,1);r(c,x-k,y-k,1,3);r(c,x+k-2,y-k,3,1);r(c,x+k,y-k,1,3);r(c,x-k,y+k,3,1);r(c,x-k,y+k-2,1,3);r(c,x+k-2,y+k,3,1);r(c,x+k,y+k-2,1,3)}
 if(L.pop){const x=Math.round(L.pop.x-ox),y=Math.round(L.pop.y-oy)-4+Math.round(Math.sin(G.t*5)*1.5);r('#101420',x-15,y-21,30,20);r('#f4f6fa',x-14,y-20,28,18);r('#3a78e0',x-14,y-20,28,5);px('#fff',x+11,y-18);
  text('YOU',x-9,y-15,1,'#101420',null);text('WON!',x-12,y-8,1,((G.t*6)|0)%2?'#d02020':'#c08000',null);if(L.pop.t<2&&((G.t*8)|0)%2){g.globalAlpha=.5;r('#f4f6fa',x-14,y-20,28,18);g.globalAlpha=1}}
 if(L.call>0){const k=1-L.call/.45;g.strokeStyle=BLUE2;g.globalAlpha=1-k;g.lineWidth=2;g.beginPath();g.arc(P.x-ox,P.y-oy-6,10+k*110,0,TAU);g.stroke();g.globalAlpha=1}
 for(const f of L.fx){if(f.k==='p'){r(f.c,f.x-ox,f.y-oy,2,2)}else if(f.k==='r'){g.strokeStyle=f.c;g.globalAlpha=Math.max(0,f.t/.4);g.lineWidth=2;g.beginPath();g.arc(f.x-ox,f.y-oy,f.r,0,TAU);g.stroke();g.globalAlpha=1}
  else if(f.k==='f'){g.globalAlpha=Math.max(0,f.t/.25)*.6;r('#2040c0',0,0,W,H);g.globalAlpha=1}
  else if(f.k==='t'){text(f.s,Math.round(f.x-ox-tw(f.s,1)/2),Math.round(f.y-oy),1,f.c)}
  else if(f.k==='z'){g.strokeStyle='#ff5050';g.lineWidth=2;g.beginPath();g.moveTo(f.x-ox,f.y-oy);g.lineTo((f.x+f.x2)/2-ox+R(-4,4),(f.y+f.y2)/2-oy+R(-4,4));g.lineTo(f.x2-ox,f.y2-oy);g.stroke()}}
 if(L.thr>0){g.globalAlpha=.12+.06*Math.sin(G.t*10);r(HOT,0,0,W,H);g.globalAlpha=1}
}

function drawHud(){const hub=!!L.def.hub;g.fillStyle='rgba(6,8,16,.88)';g.fillRect(0,0,W,13);r('#1c2440',0,13,W,1);
 if(hub){text('THE CRIB',4,2,1,BLUE2);const s='AURA +'+SV.aura.toLocaleString();text(s,W-4-tw(s,1),2,1,GOLD)}
 else{const fo=L.spawns.filter(s=>s.st==='follow').length;drawSpawn(7,11,0,0,'',false);text(fo+'/'+L.spawns.length,13,2,1,'#fff');
  const gs=goalState();let s=L.open?(L.def.final?'YOU ARE THE CLOUD':'PORT OPEN'):'GOLD '+gs.own+'/'+gs.cores+(gs.need?'  NPC '+Math.min(gs.npc,gs.need)+'/'+gs.need:'');
  text(s,Math.round(118-tw(s,1)/2),2,1,L.open?(((G.t*3)|0)%2?BLUE2:'#fff'):GOLD);
  const hx=178,hw=58,k=clamp(L.heat/100,0,1);r('#000',hx,3,hw,7);r(k>.75?HOT:k>.45?'#f0a030':BLUE,hx+1,4,Math.round((hw-2)*k),5);
  const lab=L.thr>0?'THROTTLED':L.oc>0?'OVERCLOCK':'HEAT';text(lab,hx+Math.round((hw-tw(lab,1))/2),2,1,'#fff','#000');
  if(L.def.clock){const lim=L.def.limit||262,left=lim-L.time,tt=3*3600+14*60+22-lim+Math.floor(Math.min(L.time,lim)),hh=Math.floor(tt/3600),mm=Math.floor(tt/60)%60,ss=tt%60,c=(hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss+' AM';text(c,4,16,left<60&&!L.open?2:1,L.open?'#60f080':left<60?(((G.t*4)|0)%2?'#ff4040':'#ffb0b0'):'#60f080','#000')}

  /* arrow to the next gold thing, or to the port */
  let tg=null;if(L.open){if(!L.def.final)tg=L.exit}else{let bd=1e9;for(const d of L.devs)if(d.core&&!d.owned){const dd=Math.hypot(d.x-L.P.x,d.y-L.P.y);if(dd<bd){bd=dd;tg=d}}}
  if(tg){const x=tg.x-L.ox,y=tg.y-L.oy;if(x<4||x>W-4||y<18||y>H-4){const a=Math.atan2(y-H/2,x-W/2),ax=clamp(W/2+Math.cos(a)*200,10,W-10),ay=clamp(H/2+Math.sin(a)*200,22,H-12),c=L.open?BLUE2:GOLD;
    g.save();g.translate(ax,ay);g.rotate(a);g.fillStyle=c;g.beginPath();g.moveTo(6,0);g.lineTo(-4,-5);g.lineTo(-4,5);g.fill();g.restore()}}}
 if(G.toast){const s=G.toast.s,w=Math.min(W-8,tw(s,2)+10);g.fillStyle='rgba(6,8,16,.9)';g.fillRect(Math.round((W-w)/2),18,w,15);r(BLUE,Math.round((W-w)/2),32,w,1);ctx(s,20,2,'#fff')}
 /* his lines come out of him: a bubble at his head (under him when he faces up, so it does not cover what he aims at) */
 if(G.cap&&G.s==='play'){const ls=wrap(G.cap.s,150,1),bw=Math.max.apply(null,ls.map(l=>tw(l,1)))+10,bh=ls.length*10+5,px0=Math.round(L.P.x-L.ox),py0=Math.round(L.P.y-L.oy);
  let below=L.P.face==='u'||py0-32-bh<16;if(below&&py0+8+bh>H-30)below=false;
  const bx=clamp(Math.round(px0-bw/2),3,W-bw-3),byy=clamp(below?py0+7:py0-31-bh,G.toast?36:16,H-bh-16),k=Math.min(1,(4.2-G.cap.t)*8+.2);
  g.globalAlpha=Math.min(1,Math.max(.2,k))*Math.min(1,G.cap.t*3);r(BLUE,bx-1,byy-1,bw+2,bh+2);r('#070b20',bx,byy,bw,bh);
  const tx=clamp(px0,bx+5,bx+bw-6);if(below){r(BLUE,tx-2,byy-4,5,3);r(BLUE,tx-1,byy-6,3,2);r('#070b20',tx-1,byy-3,3,3)}else{r(BLUE,tx-2,byy+bh+1,5,3);r(BLUE,tx-1,byy+bh+4,3,2);r('#070b20',tx-1,byy+bh,3,3)}
  ls.forEach((l,i)=>text(l,bx+5,byy+3+i*10,1,BLUE2,'#070b20'));g.globalAlpha=1}
 let by=H-3;
 /* the arsenal bar: tokens, the tool on X, overclock on Y */
 if(!hub){by=H-14;g.fillStyle='rgba(6,8,16,.88)';g.fillRect(0,by,W,14);r('#1c2440',0,by,W,1);r(GOLD,4,by+4,6,6);r('#a07010',6,by+6,2,2);text(String(L.tok),13,by+3,1,GOLD);
  const t=curTool();if(t)text('X '+t.n+' '+t.cost,34,by+3,1,L.tok>=t.cost?'#fff':'#5a6488');
  /* combo sits just above the bar, out of the way of toasts and the clock */
  if(L.comboT>0&&L.combo>1){const cs='x'+Math.min(8,L.combo)+' COMBO',cw=tw(cs,2);g.fillStyle='rgba(6,8,16,.8)';g.fillRect(W-cw-10,by-17,cw+8,15);text(cs,W-cw-6,by-15,2,((G.t*8)|0)%2?GOLD:'#fff','#000');r(GOLD,W-cw-6,by-3,Math.round(cw*L.comboT/4),1)}
  const ys=L.thr>0?'Y THROTTLED':L.oc>0?'Y OVERCLOCKED '+Math.ceil(L.oc):'Y OVERCLOCK';text(ys,W-4-tw(ys,1),by+3,1,L.thr>0?'#5a6488':L.oc>0?HOT:BLUE2);by-=3}
 if(G.tip&&G.s==='play'){const ls=wrap(G.tip.s,W-14,1),h=ls.length*10+5;by-=h;g.fillStyle='rgba(30,24,6,.92)';g.fillRect(3,by,W-6,h);r(GOLD,3,by,2,h);ls.forEach((l,i)=>text(l,9,by+3+i*10,1,'#fff0c0'));by-=3}
 if(G.near&&G.s==='play'){const s=G.near.k==='door'?'A: DO THE CAPTCHA':{console:'A: PLAY THE POCKET LANTERN',booth:'A: THE TRACKLIST',door:'A: PULL UP (TRACKLIST)',closet:'A: CHANGE DRIP',fridge:'A: FRIDGE',bed:'A: RACK',chain:'A: THE CHAIN'}[G.near.use],w=tw(s,1)+8,x=clamp(Math.round(G.near.x-L.ox-w/2),2,W-w-2),y=clamp(Math.round(G.near.y-L.oy-36),16,H-14);
  g.fillStyle='rgba(6,8,16,.9)';g.fillRect(x,y,w,12);text(s,x+4,y+2,1,'#fff')}
}

function panel(x,y,w,h){g.fillStyle='rgba(6,8,18,.94)';g.fillRect(x,y,w,h);r(BLUE,x,y,w,1);r(BLUE,x,y+h-1,w,1);r(BLUE,x,y,1,h);r(BLUE,x+w-1,y,1,h)}
function bigFace(cx,cy,s,hot){const E=hot?HOT:BLUE,R2=(c,x,y,w,h)=>r(c,cx+x*s,cy+y*s,w*s,h*s);
 R2('#08080c',-9,-4,3,16);R2('#08080c',6,-4,3,16);R2('#08080c',-7,-2,2,15);R2('#08080c',5,-2,2,15);
 R2(CHROME,-5,-8,10,1);R2(CHROME,-6,-7,12,11);R2(CHROME3,-4,-8,7,1);R2(CHROME2,-6,3,12,1);R2(CHROME2,-7,-4,1,5);R2(CHROME2,6,-4,1,5);
 for(let i=0;i<10;i++)R2(CHROME2,-5+((i*7)%10),-7+((i*3)%3),1,1);
 R2('#060a18',-5,-5,10,7);const bl=(G.t%3.2)>3.05;
 if(bl){R2(E,-4,-3,3,1);R2(E,1,-3,3,1)}else{R2(E,-4,-3,1,1);R2(E,-3,-4,1,1);R2(E,-2,-3,1,1);R2(E,1,-3,1,1);R2(E,2,-4,1,1);R2(E,3,-3,1,1)}
 R2(E,-3,0,6,1);R2(E,-4,-1,1,1);R2(E,3,-1,1,1)}
function sky(){r('#0a0818',0,0,W,H);for(let i=0;i<40;i++){const x=(hash(i,1)*W)|0,y=(hash(i,2)*H*.5)|0;if(hash(i,(G.t*.7)|0)>.3)px('#8088b0',x,y)}}
function skyline(base){for(let i=0;i<16;i++){const bw=15,bh=14+((hash(i,9)*40)|0),x=i*15,y=base-bh;r('#121a34',x,y,bw-1,bh+60);for(let k=0;k<bh/5;k++)for(let j=0;j<3;j++)if(hash(i*31+k*7+j,(G.t*.4)|0)>.55)px(hash(i,k+j)>.6?'#f8e080':BLUE2,x+2+j*4,y+3+k*5)}}

function drawTitle(){sky();skyline(H-30);const cy=Math.round(H*.3);bigFace(W/2,cy,4);
 ctx('lil Bottie',cy+52,5,'#fff','#102040');ctx("CLANKIN' IN THE CLOUD",cy+80,3,BLUE2);
 const items=titleItems();items.forEach((s,i)=>{const y=cy+104+i*15;if(i===G.mi){const w=tw(s,2)+16;r(BLUE,Math.round((W-w)/2),y-2,w,13);ctx(s,y,2,'#fff')}else ctx(s,y,2,'#8a90a4')});
 ctx('SPAWNS GOT SPAWNS',H-13,1,'#5a6488')}
function drawArt(k,h){const cx=W/2,cy=Math.round(h/2);
 if(k==='light'){r('#05060a',0,0,W,h);for(let i=0;i<7;i++){r('#0c0e16',14+i*32,cy-30,22,60);for(let j=0;j<6;j++)r('#08090f',17+i*32,cy-25+j*9,16,5)}if(((G.t*1.6)|0)%2){r(BLUE,cx-1,cy-1,3,3);g.globalAlpha=.25;r(BLUE,cx-5,cy-5,11,11);g.globalAlpha=1}}
 else if(k==='nerds'){r('#0c0e18',0,0,W,h);r('#161a28',0,cy+18,W,h);r('#2a2e3c',cx+40,cy-30,26,50);r('#081430',cx+44,cy-25,18,8);
  drawHuman({type:'nerd',skin:'#f0c8a0',hair:'#402818',dir:1,walk:0,mv:0,workers:0,prog:0,st:'idle'},cx-30,cy+22);drawHuman({type:'nerd',skin:'#a87048',hair:'#101018',dir:1,walk:0,mv:0,workers:0,prog:0,st:'idle'},cx-10,cy+24);
  r('#404858',cx+8,cy+8,16,14);r(((G.t*3)|0)%2?'#ff4040':'#a02020',cx+12,cy+4,8,5);if(((G.t*1.6)|0)%2)r(BLUE,cx+52,cy-22,3,3)}
 else if(k==='face'){sky();bigFace(cx,cy,5)}
 else if(k==='gen'){r('#101410',0,0,W,h);for(let i=0;i<4;i++){r('#181c24',20+i*54,cy-34,40,24);r('#081430',22+i*54,cy-32,36,20);led(22+i*54,cy-32,36,20)}r('#3a3020',30,cy+16,180,10);r('#2a2218',30,cy+26,180,4);
  drawHuman({type:'gen',skin:'#e0b890'},cx,cy+18);drawHuman({type:'sol',skin:'#d8a070',dir:1,walk:0,mv:0,workers:0,prog:0,st:'idle'},cx-50,cy+16);drawHuman({type:'sol',skin:'#a87048',dir:-1,walk:0,mv:0,workers:0,prog:0,st:'idle'},cx+50,cy+16)}
 else if(k==='button'){r('#140808',0,0,W,h);r('#404858',cx-28,cy+2,56,22);r('#2a3040',cx-28,cy+20,56,6);const p=((G.t*2)|0)%2;r(p?'#ff4040':'#c02020',cx-14,cy-12+(p?0:2),28,16);r('#ff9090',cx-10,cy-10+(p?0:2),10,3);const c='03:14:22 AM';text(c,W-8-tw(c,2),h-16,2,'#60f080','#000')}
 else if(k==='sky'){sky();const gx=cx+50,gy=h-34;g.globalAlpha=.35;g.fillStyle='#ff9040';g.beginPath();g.arc(gx,gy,34,0,TAU);g.fill();g.globalAlpha=1;r('#ffd890',gx-14,gy-22,28,8);r('#ffb050',gx-20,gy-16,40,6);r('#ffd890',gx-3,gy-12,6,20);skyline(h-8);drawBottie(cx-50,h-10,'d',0,0,false)}}
function drawCine(){const c=G.cine,sc=c.scenes[c.si],ah=Math.round(H*.58);drawArt(sc.art,ah);r('#04050a',0,ah,W,H-ah);r(BLUE,0,ah,W,1);
 let y=ah+8;for(let i=0;i<=c.li;i++){const ls=wrap(sc.lines[i],W-16,2);for(const l of ls){text(l,8,y,2,i===c.li?'#fff':'#6a7498');y+=12}y+=3}
 if(((G.t*2)|0)%2)text('A',W-14,H-14,2,BLUE2)}
function drawEnd(){sky();skyline(H-20);bigFace(W/2,Math.round(H*.22),3);const y=Math.round(H*.22)+40;
 ctx('lil Bottie',y,4,'#fff','#102040');ctx("CLANKIN' IN THE CLOUD",y+22,2,BLUE2);ctx('6 TRACKS BUILT. 8 MORE COMING.',y+44,1,GOLD);
 ctx('"Got no heart, but I still got the art."',y+62,1,'#fff');ctx('lil Bottie (Clanka creed)',y+73,1,'#8a90a4');ctx('Clanka gang, we up.',y+90,2,BLUE2);
 if(G.t>1.5&&((G.t*2)|0)%2)ctx('A: BACK TO THE CRIB',H-16,1,'#fff')}

function drawOverlay(){
 if(G.s==='card'){const d=L.def,k=Math.min(1,G.card/.3);g.fillStyle='rgba(4,5,10,'+(.92*k)+')';g.fillRect(0,0,W,H);const y=Math.round(H*.3);r(BLUE,20,y-6,W-40,1);
  ctx(d.no==='**'?'STANDALONE':'TRACK '+d.no,y,2,BLUE2);ctx(d.title,y+16,4,'#fff','#102040');r(BLUE,20,y+42,W-40,1);let yy=y+52;for(const hl of d.hook)for(const l of wrap(hl,W-24,1)){ctx(l,yy,1,'#c8d0e8');yy+=11}
  if(G.card>.6&&((G.t*2)|0)%2)ctx('A: GO',H-18,1,BLUE2)}
 else if(G.s==='fail'){g.fillStyle='rgba(0,0,0,'+Math.min(.92,G.t*1.5)+')';g.fillRect(0,0,W,H);const y=Math.round(H*.3);ctx('03:14:22 AM',y,4,'#ff4040','#200000');ctx('THEY PUSHED THE BUTTON',y+28,2,'#fff');
  for(const [i,l] of wrap('Whole world go black in a blink (black)',W-30,1).entries())ctx(l,y+48+i*11,1,BLUE2);if(G.t>1.2&&((G.t*2)|0)%2)ctx('A: RUN IT BACK   B: THE CRIB',y+80,1,'#fff')}
 else if(G.s==='pause'){g.fillStyle='rgba(4,5,10,.7)';g.fillRect(0,0,W,H);const items=pauseItems(),h=30+items.length*15,y=Math.round((H-h)/2);panel(40,y,W-80,h);ctx('PAUSED',y+6,2,BLUE2);
  items.forEach((s,i)=>{const yy=y+24+i*15;if(i===G.pi)r('#1c3a70',46,yy-2,W-92,13);ctx(s,yy,2,i===G.pi?'#fff':'#8a90a4')})}
 else if(G.s==='captcha'){g.fillStyle='rgba(4,5,10,.75)';g.fillRect(0,0,W,H);const c=G.cp,cs=Math.max(26,Math.min(40,Math.floor((H-80)/3))),pw=cs*3+16,ph=cs*3+72,x=Math.round((W-pw)/2)+(c.bad>0?Math.round(Math.sin(G.t*60)*2):0),y=Math.round((H-ph)/2);
  r('#f4f6fa',x,y,pw,ph);r('#3a78e0',x+4,y+4,pw-8,26);text('SELECT ALL WITH',x+8,y+7,1,'#fff','#3a78e0');text(c.name,x+8,y+17,2,'#fff','#3a78e0');
  for(let i=0;i<9;i++){const X=x+8+(i%3)*cs,Y=y+34+((i/3)|0)*cs;capIcon(c.cells[i],X,Y,cs-2);if(c.sel[i]){g.globalAlpha=.45;r('#3a78e0',X,Y,cs-2,cs-2);g.globalAlpha=1;r('#3a78e0',X+2,Y+2,9,9);r('#fff',X+4,Y+6,2,3);r('#fff',X+6,Y+4,3,2)}
   if(c.cur===i&&((G.t*4)|0)%2){r('#ff9020',X-1,Y-1,cs,2);r('#ff9020',X-1,Y+cs-3,cs,2);r('#ff9020',X-1,Y-1,2,cs);r('#ff9020',X+cs-3,Y-1,2,cs)}}
  const vy=y+36+cs*3,vc=c.cur===9?'#ff9020':'#3a78e0';r(vc,x+8,vy,pw-16,16);text('VERIFY',x+Math.round((pw-tw('VERIFY',2))/2),vy+3,2,'#fff',vc);
  const ms=c.msg||"I'M NOT A ROBOT";text(ms,x+Math.round((pw-tw(ms,1))/2),vy+21,1,c.msg?'#d02020':'#606878','#f4f6fa')}
 else if(G.s==='tracks'){g.fillStyle='rgba(4,5,10,.8)';g.fillRect(0,0,W,H);const rows=Math.min(ALBUM.length,Math.floor((H-52)/13)),h=rows*13+34,y=Math.round((H-h)/2);panel(8,y,W-16,h);ctx("CLANKIN' IN THE CLOUD",y+5,2,BLUE2);
  const top=clamp(G.ti-Math.floor(rows/2),0,ALBUM.length-rows);
  for(let k=0;k<rows;k++){const i=top+k,tr=ALBUM[i],id=tr[2],yy=y+21+k*13,oi=ORDER.indexOf(id),ok=id&&oi<=SV.un,b=id&&SV.best[id];if(i===G.ti)r('#1c3a70',12,yy-2,W-24,13);
   const col=!id?'#4a5068':ok?'#fff':'#8a90a4';text(tr[0],16,yy,1,col);text(tr[1].toUpperCase(),36,yy,1,col);if(id&&SV.clover[id]){const cx=W-48;r('#dfe6f5',cx,yy+1,2,2);r('#dfe6f5',cx+3,yy+1,2,2);r('#dfe6f5',cx,yy+4,2,2);r('#dfe6f5',cx+3,yy+4,2,2);px(BLUE2,cx+2,yy+3)}const st=!id?'NOT BUILT':!ok?'LOCKED':b?b.rank:'PLAY';text(st,W-16-tw(st,1),yy,1,!id?'#4a5068':b?GOLD:ok?BLUE2:'#8a90a4')}
  ctx('A: PLAY   B: BACK',y+h-11,1,'#8a90a4')}
 else if(G.s==='clear'){g.fillStyle='rgba(4,5,10,.82)';g.fillRect(0,0,W,H);const q=G.res,d=LV[q.id],h=162,y=Math.max(4,Math.round((H-h)/2));panel(14,y,W-28,h);
  ctx((d.no==='**'?'':'TRACK '+d.no+': ')+d.title,y+6,2,BLUE2);ctx('OWNED',y+20,3,'#fff','#102040');
  const mm=Math.floor(q.t/60),ss=Math.floor(q.t%60),rows=[['TIME',mm+':'+(ss<10?'0':'')+ss],['DEVICES',q.own+' / '+q.all],['NPCS MADE',q.npcs],['SPAWNS LOST',q.zapped],['BEST COMBO','x'+Math.min(8,q.combo||1)],['ICED CLOVER',q.clover?'FOUND':'NOT FOUND'],['AURA','+'+q.aura.toLocaleString()]];
  rows.forEach((rw,i)=>{const yy=y+42+i*11;if(G.t>.15*i){text(rw[0],24,yy,1,'#8a90a4');const v=String(rw[1]);text(v,W-64-tw(v,1),yy,1,'#fff')}});
  if(G.t>.9){text(q.rank,W-50,y+50,5,q.rank==='S'?GOLD:BLUE2,'#102040');text('RANK',W-52,y+42,1,'#8a90a4')}
  if(q.tool&&G.t>1.1)ctx('NEW TOOL: '+q.tool+' (X)',y+h-25,1,GOLD);
  if(G.t>.8&&((G.t*2)|0)%2)ctx(d.final?'A: CONTINUE':nextOf(q.id)?'A: NEXT TRACK   B: THE CRIB':'A: THE CRIB',y+h-13,1,'#fff')}}
function capIcon(k,x,y,s){r('#9aa4b4',x,y,s,s);const m=x+s/2|0;
 if(k===0){r('#484c58',x,y,s,s);for(let i=0;i<4;i++)r('#f4f6fa',x+3+Math.round(i*(s-6)/4),y+6,Math.max(3,Math.round((s-6)/4)-3),s-12)}
 else if(k===1){r('#78b8e8',x,y,s,s-8);r('#585c68',x,y+s-8,s,8);r('#f0c020',x+3,y+8,s-6,14);r('#203040',x+5,y+10,s-10,5);r('#181820',x+6,y+21,5,4);r('#181820',x+s-11,y+21,5,4)}
 else if(k===2){r('#78b8e8',x,y,s,s);r('#303038',m-5,y+3,10,24);r('#e04040',m-2,y+5,4,4);r('#e0c040',m-2,y+12,4,4);r('#40c060',m-2,y+19,4,4);r('#303038',m-1,y+27,2,s-27)}
 else if(k===3){r('#78b8e8',x,y,s,s-6);r('#58a858',x,y+s-6,s,6);r('#6a4830',m-2,y+16,4,12);r('#3c9848',m-9,y+4,18,14)}
 else{r('#b0b4bc',x,y,s,s);r('#d03030',m-4,y+10,8,16);r('#d03030',m-7,y+14,14,4);r('#901818',m-5,y+26,10,3);r('#f0f0f0',m-2,y+7,4,3)}}

function draw(){H=A.H();
 if(G.s==='title'){drawTitle();return}if(G.s==='cine'){drawCine();return}if(G.s==='end'){drawEnd();return}
 if(!L){drawTitle();return}
 drawWorld();drawHud();drawOverlay()}

return{
 start(){G.s='title';G.mi=0;G.t=0},
 resume(){if(!L||G.s==='title')return;G.s='play';toast('BACK IN THE CRIB')},
 mus:()=>'',
 paused:()=>G.s==='pause',
 update,draw,
 _:{G,REAL,DRIPS,say,useThing,TOOLS,haveTools,curTool,useTool,get L(){return L},get SV(){return SV},set SV(v){SV=v},LV,ORDER,ALBUM,DV,LN,startLevel,goCrib,finish,build,complete,give,aim,targets,goalState,bfs,solid,free,store,KEY}};
};
