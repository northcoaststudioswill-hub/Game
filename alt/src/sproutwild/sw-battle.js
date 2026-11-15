/* ================================================================
   BATTLE SCREEN (Fable, v5.6) — same rules, new stage.
   The turn logic above is untouched; this replaces how it is shown:
     · a backdrop for each sector, sprites on the pixel grid
     · each "X used Y!" line plays: a lunge, a bolt in the move's
       colour, a white flash and shake on the target, and only then
       does that HP bar drain
     · your keeper and your sprouts stand behind your buddy; SWARM
       sends them hopping across to latch on and bloom
     · fainting sinks, new buddies slide in
     · one panel style for text, the command grid, moves, the swarm
       picker and the party list
   Everything is derived from BT while drawing; nothing here changes
   an outcome.
   ================================================================ */
const WBSKY={MEADOW:['#4a9ae0','#8fd0f0','#d8f2fc'],TOWN:['#4a9ae0','#8fd0f0','#d8f2fc'],BASE:['#4a9ae0','#8fd0f0','#d8f2fc'],WASTES:['#d8703a','#f2b95e','#f9deb0'],SHORE:['#2a9ad0','#7fd8f0','#e0f8fc'],GLOOM:['#0c0a20','#241b40','#4a3a70'],PEAK:['#7ab0d8','#cfe4f2','#f4faff']};
function wbMove(name){for(const k in WMOVES)if(WMOVES[k].n===name)return WMOVES[k];return null}
function wbBar(x,y,w,frac,h){frac=Math.max(0,Math.min(1,frac));r('#14101e',x-1,y-1,w+2,(h||4)+2);r('#3a3448',x,y,w,h||4);r(frac>.5?'#58c048':frac>.22?'#f8c030':'#e04838',x,y,Math.round(w*frac),h||4);r('rgba(255,255,255,.35)',x,y,Math.round(w*frac),1)}
function wbPlat(x,y,w,B){r('rgba(0,0,0,.22)',x-w/2+4,y+5,w-8,5);r('#14101e',x-w/2,y-4,w,11);r(B.g3,x-w/2+1,y-3,w-2,9);r(B.g2,x-w/2+3,y-4,w-6,7);r(B.g,x-w/2+7,y-5,w-14,5);r(B.a,x-w/2+12,y-5,w-30,1);
 for(let i=0;i<6;i++)r(B.tg[1],Math.round(x-w/2+8+i*(w-18)/5),y-8-(i%2),1,4)}
function wDrawBattle(){const B=FBIO[W4.sector]||FBIO.MEADOW,foe=BT.foe,me=btCur(),fs=wSp(foe.sp)._spr,ms=wSp(me.sp)._spr,K='#14101e';ox=0;oy=0;
 const PH=58,top=H-PH,sc=top>=176?3:2,HY=Math.round(top*.44),cur=BT.log[0];
 /* ---- what is happening right now (derived, draw-side only) ---- */
 if(!BT.d)BT.d={f:foe.hp,m:me.hp,fRef:foe,mRef:me,fin:time,min:time,an:null,line:null,relF:1,relM:1,last:null};
 const d=BT.d;if(d.fRef!==foe){d.fRef=foe;d.f=foe.hp;d.fin=time;d.faint=null}if(d.mRef!==me){d.mRef=me;d.m=me.hp;d.min=time;if(d.faint==='me')d.faint=null}
 if(cur!==d.line){d.line=cur;d.bloom=false;if(cur){const tx=cur.txt,i=tx.indexOf(' used ');
   if(i>0){const nm=tx.slice(0,i),who=nm===me.sp&&nm===foe.sp?(d.last==='me'?'foe':'me'):nm===me.sp?'me':nm===foe.sp?'foe':'keeper';
    const mv=wbMove(tx.slice(i+6).replace(/\s*[!(—].*$/,'').trim());d.an={who,t:time,ty:mv?mv.t:-1,miss:tx.includes('missed'),pw:mv?mv.p:1};d.last=who;if(who==='foe')d.relM=0;else d.relF=0}
   else if(tx.includes(' fainted')){d.faint=tx.startsWith(foe.sp)&&foe.hp<=0?'foe':'me';d.ft=time}
   else if(tx.includes('bloom on'))d.bloom=true}}
 const an=d.an,at=an?time-an.t:9,hit=an&&!an.miss&&an.pw>0&&at>.3&&at<.62;
 /* a bar only drains once its own hit has landed: hold it while that attack is still to come in the log */
 {const later2=BT.log.slice(1),pend=who=>later2.some(l=>l.txt.indexOf(' used ')>0&&l.txt.startsWith(who+' '));
  d.relM=!(pend(foe.sp)&&foe.sp!==me.sp)&&!(an&&an.who==='foe'&&at<.3);d.relF=!later2.some(l=>l.txt.indexOf(' used ')>0&&!l.txt.startsWith(foe.sp+' '))&&!(an&&an.who!=='foe'&&at<.3)}
 if(BT.phase==='menu'||BT.phase==='moves'||!cur){d.relF=1;d.relM=1}
 if(d.relF){d.f+=(foe.hp-d.f)*.2;if(Math.abs(foe.hp-d.f)<.6)d.f=foe.hp}
 if(d.relM){d.m+=(me.hp-d.m)*.2;if(Math.abs(me.hp-d.m)<.6)d.m=me.hp}
 /* ---- backdrop ---- */
 const dk=Math.max(wDark()*.45,0);
 uiSky(WBSKY[W4.sector]||WBSKY.MEADOW,HY+4);
 if(W4.sector==='GLOOM'||wDark()>.6)uiStars(30,HY-10,5);
 else{const sx=W-44;r('#fff3b0',sx-2,10,20,20);r('#ffd94d',sx,12,16,16);r('#ffffff',sx+3,15,6,6);
  for(let i=0;i<3;i++){const cx=((time*(5+i*2)+i*110)%(W+80))-40,cy=14+i*13;g.globalAlpha=.8;r('#ffffff',Math.round(cx),cy,34-i*6,6);r('#ffffff',Math.round(cx)+7,cy-4,20-i*4,5);g.globalAlpha=1}}
 uiHills(HY,18,artShade(B.t1,-.15),2.1,1.2);uiHills(HY+6,12,B.t1,4.7,2);
 r(B.g,0,HY+6,W,top-HY);for(let i=0;i<7;i++){const y=HY+8+i*i*3;if(y<top)r(i%2?B.g2:artShade(B.g,.06),0,y,W,2+i)}
 {const rr=wSeedRand(wSectorSeed(W4.sector)+7);for(let i=0;i<34;i++){const gx=rr()*W,gy=HY+10+rr()*(top-HY-14);r(i%7===0?B.fl[i%B.fl.length]:B.g3,Math.round(gx),Math.round(gy),i%7===0?2:1,i%7===0?2:3)}}
 /* ---- positions ---- */
 const FGx=Math.round(W*.71),FGy=Math.round(top*.50),MGx=Math.round(W*.30),MGy=top-12;
 wbPlat(FGx,FGy,96,B);wbPlat(MGx,MGy,112,B);
 const fw=fs.ow*sc,fh=fs.oh*sc,mw=ms.ow*sc,mh=ms.oh*sc,ease=t=>{const k=Math.min(1,Math.max(0,t/.35));return 1-(1-k)*(1-k)};
 let fx=FGx+(1-ease(time-d.fin))*130,fy=FGy+Math.round(Math.sin(time*2.2)*1.5),mx=MGx-(1-ease(time-d.min))*150,my=MGy+Math.round(Math.sin(time*2.2+1.3)*1.5);
 if(an&&at<.34){const k=Math.sin(Math.min(1,at/.34)*Math.PI);if(an.who==='me'){mx+=k*16;my-=k*8}else if(an.who==='foe'){fx-=k*16;fy+=k*8}}
 if(hit){const s2=Math.round(Math.sin(time*70)*3);if(an.who==='foe')mx+=s2;else fx+=s2}
 const swT=BT.phase==='orb'?2.9-BT.orbT:-1,wob=swT>.9&&swT<2.2?Math.max(0,Math.sin((swT-.9)/1.3*3*Math.PI)):0;
 if(swT>.9&&swT<2.2){fx+=Math.round(Math.sin(time*36)*4*wob);if(BT.wobN!==((swT-.9)/1.3*3|0)){BT.wobN=((swT-.9)/1.3*3|0);swSnd(330+BT.wobN*110,.08,220)}}
 if(swT>=2.2&&!BT.wobEnd){BT.wobEnd=1;if(BT.orbOk){swSnd(784,.12,1568)}else swSnd(160,.14,90)}if(swT<0){BT.wobN=-1;BT.wobEnd=0}
 /* keeper and waiting sprouts, behind your buddy */
 fChibi(Math.round(MGx-52),MGy+4,Object.assign({},FLOOK[SW.keeper]||FLOOK.WILL,{sc:sc>2?2:1}),[0,-1],false);
 {let n=0;for(let ty=0;ty<TYPES.length&&n<8;ty++){const c=Math.min(SW.buds[TYPES[ty].n]||0,ty===(BT.tossIx||0)&&swT>=0?0:3),dz=BT.dz&&BT.dz[ty];
   for(let i=0;i<c&&n<8;i++,n++)drawBud({x:Math.round(6+n*9),y:top-2-(n%2)*3,type:ty,stage:2,z:dz?0:((time*3+n)|0)%4===0?2:0,a:n*1.7,mv:false,st:dz?'stun':'idle',fx:1})}}
 /* foe */
 const drawMon=(spr,x,y,w,h,flip,white,alpha)=>{const img=white&&spr.hol?spr.hol:spr.ol;if(alpha<1)g.globalAlpha=Math.max(0,alpha);
  if(flip){g.save();g.translate(Math.round(x+w/2),Math.round(y-h));g.scale(-1,1);g.drawImage(img,0,0,w,h);g.restore()}else g.drawImage(img,Math.round(x-w/2),Math.round(y-h),w,h);g.globalAlpha=1};
 {let a=1,yo=0;if(d.faint==='foe'){const k=(time-d.ft)/.6;a=1-k;yo=k*24}if(d.bloom||(swT>2.2&&BT.orbOk)){const fl=.5+.5*Math.sin(time*8);g.globalAlpha=.25+.2*fl;r('#fff3b0',FGx-fw/2-6,FGy-fh-6,fw+12,fh+10);g.globalAlpha=1;uiRays(FGx,FGy-fh/2,70,8,'#fff3b0',.16)}
  {let sc=1;if(swT>2.2&&BT.orbOk)sc=Math.max(0,1-(swT-2.2)/.5);const fl=swT>.9&&swT<2.2&&wob>.85;
   if(d.bloom){for(let i=0;i<Math.min(5,BT.tossN||3);i++)drawBud({x:Math.round(FGx-18+i*9),y:FGy+1-(((time*6+i)|0)%2)*2,type:BT.tossIx||0,stage:2,z:0,a:i,mv:true,st:'idle',fx:1});for(let i=0;i<6;i++){const ag=i*1.05+time*2;r('#fff3b0',Math.round(FGx+Math.cos(ag)*22),Math.round(FGy-14+Math.sin(ag)*10),2,2)}} /* caught: it has gone into the light; the sprouts dance where it stood */
   else if(a>0&&sc>0)drawMon(fs,fx,fy+2+yo,Math.max(1,Math.round(fw*sc)),Math.max(1,Math.round(fh*sc)),false,(hit&&an.who!=='foe')||fl,a)}}
 {let a=1,yo=0;if(d.faint==='me'){const k=(time-d.ft)/.6;a=1-k;yo=k*24}if(a>0)drawMon(ms,mx,my+2+yo,mw,mh,!!ms.fable,hit&&an.who==='foe',a)}
 /* the bolt */
 if(an&&at>.08&&at<.34&&an.pw>0){const k=(at-.08)/.26,fromMe=an.who!=='foe',x0=fromMe?MGx+20:FGx-20,y0=fromMe?MGy-mh*.5:FGy-fh*.5,x1=fromMe?FGx:MGx,y1=fromMe?FGy-fh*.5:MGy-mh*.5,c=an.ty>=0?TYPES[an.ty]:{c:'#ffffff',l:'#ffffff',d:'#c8c0d8'};
  for(let i=0;i<5;i++){const kk=Math.max(0,k-i*.06),px=x0+(x1-x0)*kk,py=y0+(y1-y0)*kk-Math.sin(kk*Math.PI)*10;r(i?c.c:c.l,Math.round(px)-3+i,Math.round(py)-3+i,6-i,6-i)}}
 if(hit){const tx=an.who==='foe'?MGx:FGx,ty=an.who==='foe'?MGy-mh*.5:FGy-fh*.5,k=(at-.3)/.32,c=an.ty>=0?TYPES[an.ty].l:'#ffffff';
  for(let i=0;i<8;i++){const a=i*.785;r(i%2?'#ffffff':c,Math.round(tx+Math.cos(a)*(8+k*26)),Math.round(ty+Math.sin(a)*(6+k*20)),3,3)}}
 if(an&&an.miss&&at>.3&&at<.9)text('MISS',(an.who==='foe'?MGx:FGx)-10,Math.round((an.who==='foe'?MGy-mh:FGy-fh)-6-(at-.3)*14),1,'#ffffff',K);
 /* the swarm: hop across, latch on, bloom (or get thrown clear) */
 if(swT>=0){const n=BT.tossN||1,T=TYPES[BT.tossIx||0];
  for(let i=0;i<n;i++){const t0=i*.09,k=Math.max(0,Math.min(1,(swT-t0)/.8)),ang=i*1.26+1,cxp=FGx+Math.cos(ang)*fw*.28,cyp=FGy-fh*.45+Math.sin(ang)*fh*.28;let px,py,z=0;
   if(k<1){px=6+i*9+(cxp-(6+i*9))*k;py=top-4+(cyp-(top-4))*k-Math.sin(k*Math.PI)*34}
   else if(BT.orbOk||swT<2.2){px=cxp+Math.sin(time*30+i)*1+(swT<2.2?Math.round(Math.sin(time*36)*4*wob):0);py=cyp;z=((time*12+i)|0)%2;if(BT.orbOk&&swT>2.2){const k3=Math.min(1,(swT-2.2)/.5);px=px+(FGx-px)*k3;py=py+(FGy-fh*.5-py)*k3}}
   else{const k2=Math.min(1.4,(swT-2.2)/.25);px=cxp+Math.cos(ang)*k2*60;py=cyp-k2*30+k2*k2*70}
   drawBud({x:Math.round(px),y:Math.round(py)+4,type:BT.tossIx||0,stage:2,z,a:i+1,mv:k<1,st:'idle',fx:1})}
  if(swT>2.2&&BT.orbOk)for(let i=0;i<14;i++){const a=i*.45+time*3,rad=8+(swT-2.2)*90;r(i%2?'#fff3b0':T.l,Math.round(FGx+Math.cos(a)*rad),Math.round(FGy-fh*.5+Math.sin(a)*rad*.7),3,3);r(T.c,Math.round(FGx+Math.cos(a+.3)*rad*.6),Math.round(FGy-fh*.5+Math.sin(a+.3)*rad*.4),2,2)}}
 if(dk>0)r('rgba(10,12,48,'+dk.toFixed(3)+')',0,0,W,top);
 /* ---- status cards ---- */
 const card=(x,y,m,hp,mine)=>{const st=wStats(m),T=TYPES[wSp(m.sp).t[0]],w=116,h=mine?34:26;r(K,x,y,w,h);r('#f8f4e0',x+2,y+2,w-4,h-4);r(T.c,x+2,y+2,4,h-4);r(T.d,x+2,y+2,1,h-4);
  text(wFit(m.sp,70),x+10,y+4,1,'#282838',null);const lv='Lv'+m.lv;text(lv,x+w-6-tw(lv,1),y+4,1,'#585868',null);wbBar(x+10,y+16,w-18,hp/st.max,4);
  if(mine){const hs=Math.max(0,Math.round(hp))+'/'+st.max;text(hs,x+w-6-tw(hs,1),y+23,1,'#585868',null);const nx=wXpNext(m.lv);r('#3a3448',x+10,y+26,44,2);r('#48a0f0',x+10,y+26,Math.round(44*Math.min(1,(m.xp||0)/nx)),2)}
  wSp(m.sp).t.forEach((ty,i)=>{if(mine)return;})};
 card(4,4,foe,d.f,false);if(BT.mode!=='wild'){const who=BT.mode==='raid'?'BOTTIE':BT.mode==='trainer'?BT.tn.who:WGYMS[BT.gym].leader,left=(BT.queue||[]).length;for(let i=0;i<=left;i++)r(i===0?'#e04838':'#f0b0a8',8+i*7,32,5,5);text(wFit(who,90),8+(left+1)*7+2,31,1,'#ffffff',K)}
 else if(wSp(foe.sp).catch!=null){const tired=foe.hp/wStats(foe).max;if(tired<.5){const lab=tired<.25?'WORN OUT':'TIRING';r(K,6,31,tw(lab,1)+6,10);text(lab,9,32,1,tired<.25?'#7ee787':'#ffd94d',null)}}
 card(W-120,top-38,me,d.m,true);
 /* ---- the panel ---- */
 r(K,0,top,W,PH);r('#f8f4e0',2,top+2,W-4,PH-4);r('#ffd23f',2,top+2,W-4,2);
 const ink='#282838',sel=(x,y,w,h)=>{r(K,x,y,w,h);r('#fff3b0',x+1,y+1,w-2,h-2);r('#ffd23f',x+1,y+1,3,h-2)};
 if(BT.phase==='msg'||BT.phase==='intro'||BT.phase==='orb'){const tx=BT.phase==='orb'?(swT<.9?'Your '+TYPES[BT.tossIx||0].n+' sprouts swarm in...':swT<2.2?'They latch on'+'...'.slice(0,1+((swT-.9)/1.3*3|0)):BT.orbOk?'It blooms!':'It broke free!'):cur?cur.txt:'';
  swWrap(tx,W-24).slice(0,3).forEach((l,j)=>text(l,10,top+9+j*12,1,ink,null));if(BT.phase==='msg'&&((time*2.4)|0)%2)text('▼',W-16,top+PH-14,1,'#a33b2e',null)}
 else if(BT.phase==='party'){text('SEND WHO?'+(BT.forced?'':'   B  BACK'),10,top+7,1,'#6a6258',null);
  SW.party.forEach((m,i)=>{const y=top+18+i*12,on=i===swSel,st=wStats(m);if(on)sel(6,y-2,W-12,12);
   text(m.sp+' Lv'+m.lv,14,y,1,m.hp<=0?'#a03828':ink,null);wbBar(W-92,y+2,50,m.hp/st.max,4);const hs=m.hp+'/'+st.max;text(hs,W-10-tw(hs,1),y,1,'#585868',null)})}
 else if(BT.phase==='moves'){const mv=me.moves;
  mv.forEach((mid,i)=>{const m=WMOVES[mid],x=6+(i%2)*116,y=top+7+((i/2)|0)*17,on=i===swSel,T=TYPES[m.t];if(on)sel(x,y-2,112,16);
   r(T?T.d:'#585868',x+6,y+1,4,9);r(T?T.c:'#98988a',x+7,y+2,2,7);text(wFit(m.n,72),x+13,y+2,1,ink,null);const pw=m.p?''+m.p:'—';text(pw,x+106-tw(pw,1),y+2,1,'#585868',null)});
  const cm=WMOVES[mv[Math.min(swSel,mv.length-1)]];text(wFit((cm.t>=0?WT[cm.t]+' · ':'')+cm.d,W-20),10,top+PH-13,1,'#6a6258',null)}
 else if(BT.phase==='budpick'){text('SWARM WITH WHICH?   B  BACK',10,top+7,1,'#6a6258',null);
  TYPES.map((t2,i)=>i).filter(i=>(SW.buds[TYPES[i].n]||0)>0&&!(BT.dz&&BT.dz[i])).forEach((ix,j)=>{const kin=wKinship(ix,foe.sp),tag=kin===1.5?'KIN!':kin===1.25?'GOOD':kin===.75?'WEAK':'',T=TYPES[ix],x=6+(j%2)*116,y=top+18+((j/2)|0)*13,on=j===swSel;
   if(on)sel(x,y-2,112,13);r(T.d,x+6,y+1,7,7);r(T.c,x+7,y+2,5,5);text(T.n+' x'+Math.min(5,SW.buds[T.n]),x+17,y+1,1,ink,null);if(tag)text(tag,x+108-tw(tag,1),y+1,1,kin>1?'#1d7a2a':'#a03828',null)})}
 else{const opts=BT.mode==='wild'?['FIGHT','SPROUT','KEEPER','BUDDY','RUN']:BT.mode==='raid'?['FIGHT','KEEPER','BUDDY','RUN']:['FIGHT','KEEPER','BUDDY'];
  swWrap('What will '+me.sp+' do?',92).slice(0,3).forEach((l,j)=>text(l,10,top+9+j*12,1,ink,null));
  opts.forEach((o,i)=>{const x=106+(i%2)*66,y=top+7+((i/2)|0)*15,on=i===swSel,used=o==='KEEPER'&&BT.keeperUsed,lab=o==='SPROUT'?'SWARM':o;
   if(on)sel(x,y-2,64,14);const ic=o==='FIGHT'?'#e04838':o==='SPROUT'?'#58c048':o==='KEEPER'?'#ffd23f':o==='BUDDY'?'#48a0f0':'#98988a';r(K,x+5,y,7,9);r(used?'#c8c0b0':ic,x+6,y+1,5,7);
   text(lab,x+15,y+1,1,used?'#98988a':ink,null)})}}
