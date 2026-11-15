/* ================================================================
   FRONT OF THE GAME (Fable, v5.2) — the first hour, rebuilt.
   Replaces (by redeclaring, the originals stay above for reference):
     · one HUD for Sunkeep and the field, laid out in fixed rows from
       the bottom of the screen so nothing can sit on anything else
     · the title screen and the opening story (seven animated scenes
       with a typewriter box; King Bibi and Bottie both get a beat)
     · the "joined you" / keeper cut-ins and Bottie's arrival
     · menu chrome (shell, rows, confirm)
     · Sunkeep's ground: paths, plaza, garden, forest edge
   ================================================================ */
const UI={ink:'#14101e',paper:'#f8f4e0',paper2:'#e4dcc0',gold:'#ffd23f',leaf:'#7ee787',dim:'#a8c898',red:'#a33b2e'};
/* a speech box: name tab, three lines, the prompt on its own row */
function uiSay(who,txt,shown,hint,acc){const lines=swWrap(txt,W-36).slice(0,6),bh=25+Math.max(3,lines.length)*11,y=H-bh-4;
 r(UI.ink,4,y,W-8,bh);r(UI.paper,6,y+2,W-12,bh-4);r(acc||UI.gold,6,y+2,W-12,2);r(UI.paper2,6,y+bh-14,W-12,12);
 if(who){const nw=tw(who,1)+10;r(UI.ink,10,y-9,nw+2,12);r(acc||UI.red,11,y-8,nw,10);text(who,16,y-7,1,'#ffffff',null)}
 let left=shown==null?1e9:Math.floor(shown);
 lines.forEach((l,j)=>{if(left<=0)return;text(l.slice(0,left),13,y+8+j*11,1,'#282838',null);left-=l.length+1});
 const done=left>0;if(hint)text(hint,W-12-tw(hint,1),y+bh-12,1,'#6a6258',null);
 if(done&&((time*2.4)|0)%2)text('▼',13,y+bh-12,1,UI.red,null);return done}
function uiPill(lab,y,key){const lw=tw(lab,1)+(key?19:10),x=Math.round(W/2-lw/2);r('rgba(10,14,8,.85)',x,y,lw,11);
 if(key){r(UI.gold,x,y,11,11);text(key,x+3,y+2,1,UI.ink,null);text(lab,x+15,y+2,1,'#ffffff',null)}else text(lab,x+5,y+2,1,'#ffffff',null)}
function uiSky(cols,y1){const n=cols.length-1,bands=18;for(let i=0;i<bands;i++){const k=i/(bands-1)*n,a=Math.min(n-1,Math.floor(k));
  r(wLerpC(cols[a],cols[a+1],k-a),0,Math.floor(y1*i/bands),W,Math.ceil(y1/bands)+1)}}
function uiHills(y,amp,col,seed,sc){for(let x=0;x<W;x+=2){const h=amp*(.55+.3*Math.sin(x*.035*sc+seed)+.15*Math.sin(x*.09*sc+seed*2.3));r(col,x,Math.round(y-h),2,Math.ceil(H-y+h))}}
function uiStars(n,ymax,seed){for(let i=0;i<n;i++){const x=(i*73+seed*31)%W,y=(i*47+seed*17)%ymax,tk=Math.sin(time*2+i*1.7);if(tk>-.6)r(tk>.6?'#ffffff':'#b8c0f0',x,y,1,1);if(i%9===0&&tk>.8){r('#ffffff',x-1,y,3,1);r('#ffffff',x,y-1,1,3)}}}
function uiLantern(x,y,lit,s){s=s||1;const fl=.5+.5*Math.sin(time*2.6);
 if(lit){g.globalAlpha=.10+.06*fl;r('#ffd94d',x-26*s,y-58*s,52*s,44*s);g.globalAlpha=.16+.08*fl;r('#ffd94d',x-16*s,y-52*s,32*s,32*s);g.globalAlpha=1}
 r(UI.ink,x-3*s,y-28*s,6*s,29*s);r('#6b4a2b',x-2*s,y-27*s,4*s,27*s);r('#8a6238',x-2*s,y-27*s,1*s,27*s);
 r(UI.ink,x-9*s,y-46*s,18*s,20*s);r('#7a2e22',x-9*s,y-47*s,18*s,4*s);r('#3c2a16',x-8*s,y-43*s,16*s,16*s);
 if(lit){r('#ffd94d',x-6*s,y-41*s,12*s,12*s);r('#fff3b0',x-4*s,y-39*s,8*s,8*s);r('#ffffff',x-2*s,y-37*s,4*s,4*s)}
 else{r('#2a2438',x-6*s,y-41*s,12*s,12*s);r('#3a3350',x-6*s,y-41*s,12*s,2*s);r(UI.ink,x-1*s,y-41*s,1*s,7*s);r(UI.ink,x,y-35*s,3*s,1*s);r(UI.ink,x+2*s,y-34*s,1*s,5*s)}}
function uiRays(x,y,rad,n,col,alpha){if(!g.beginPath)return;g.save();g.globalAlpha=alpha;g.fillStyle=col;
 for(let i=0;i<n;i++){const a=time*.5+i*6.283/n;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad);g.lineTo(x+Math.cos(a+.16)*rad,y+Math.sin(a+.16)*rad);g.closePath();g.fill()}
 g.restore();g.globalAlpha=1}
function uiMon(sp,x,y,w2,flip){const spr=wSp(sp)._spr,h2=Math.round(w2*spr.oh/spr.ow);
 if(flip){g.save();g.translate(Math.round(x+w2/2),Math.round(y-h2));g.scale(-1,1);g.drawImage(spr.ol,0,0,w2,h2);g.restore()}else g.drawImage(spr.ol,Math.round(x-w2/2),Math.round(y-h2),w2,h2)}
function uiWill(x,y,sc,ax,ay){const sx=P3.x,sy=P3.y,sax=P3.ax,say=P3.ay,san=P3.anim;P3.ax=ax||0;P3.ay=ay==null?1:ay;P3.anim=0;drawPlayerSpr(x,y,sc);P3.x=sx;P3.y=sy;P3.ax=sax;P3.ay=say;P3.anim=san}

/* ---------------- the one HUD ---------------- */
function wHud(){const sec=wSector(W4.sector),F=W4.fld||W4.bf,atBase=!W4.fld;
 r('rgba(10,14,8,.8)',0,0,W,15);r(UI.gold,0,15,W,1);
 {const rs='♣'+SW.res.wood+' ◆'+SW.res.stone+' ✿'+SW.res.petal+(atBase?' ♥'+SW.hearts:'');text(rs,W-5-tw(rs,1),4,1,'#d8e8c8',null);text(wFit(sec.n,W-16-tw(rs,1)),5,4,1,'#ffd94d',null)}
 if(SW.stam<99){r('#00000088',0,16,W,2);r(SW.stam>40?UI.leaf:SW.stam>18?'#ffd94d':'#e04838',0,16,Math.round(W*SW.stam/100),2)}
 const ban=W4.banner&&W4.banner.t>0;
 {const q=wQuestText();if(q&&!ban&&state!=='g4place'){
  r('rgba(10,14,8,.62)',0,18,W,11);r(UI.gold,0,18,2,11);text(wFit(q,226),6,20,1,'#ffe8b0',null)}}
 if(ban){const sl=swWrap(W4.banner.sub||'',212).slice(0,3),bh2=24+sl.length*11;g.globalAlpha=Math.min(1,W4.banner.t);r('#0e1a0a',8,30,224,bh2);r(UI.gold,8,30,224,2);r(UI.gold,8,30+bh2-2,224,1);
  {const bt=W4.banner.txt,big=tw(bt,2)<=216;text(big?bt:wFit(bt,216),Math.round(W/2-tw(big?bt:wFit(bt,216),big?2:1)/2),35,big?2:1,'#ffffff',null)}sl.forEach((l,j)=>text(l,Math.round(W/2-tw(l,1)/2),53+j*11,1,'#cfe0b8',null));g.globalAlpha=1}
 /* bottom row: squad on the field, crew and sigils at home */
 r('rgba(10,14,8,.8)',0,H-16,W,16);let x=4;const y=H-13;
 if(F){for(let ty=0;ty<TYPES.length;ty++){const all=F.sq.filter(s=>s.type===ty);if(!all.length)continue;const fl=all.filter(s=>s.st==='follow').length,T=TYPES[ty],on=ty===SW.selType;
   const lab=fl===all.length?''+fl:fl+'/'+all.length,w2=13+tw(lab,1);
   if(on){r(UI.gold,x-2,y-2,w2+3,13);r('#2a2416',x-1,y-1,w2+1,11)}
   r(T.d,x,y+1,7,7);r(T.c,x+1,y+2,5,5);r(T.l,x+1,y+2,2,1);r('#2c6030',x+3,y-1,1,2);text(lab,x+10,y+1,1,fl?'#ffffff':'#98988a',null);x+=w2+6}
  if(!F.sq.length)text(atBase?(SW.badges.length?'SIGILS '+SW.badges.length+'/4':''):'NO SPROUTS WITH YOU',4,H-12,1,UI.dim,null)}
 else{for(let ty=0;ty<TYPES.length;ty++){const n=SW.buds[TYPES[ty].n]||0;if(!n)continue;const T=TYPES[ty],lab=''+n;
   r(T.d,x,y+1,7,7);r(T.c,x+1,y+2,5,5);r(T.l,x+1,y+2,2,1);r('#2c6030',x+3,y-1,1,2);text(lab,x+10,y+1,1,'#ffffff',null);x+=19+tw(lab,1)}
  if(x===4&&SW.badges.length)text('SIGILS '+SW.badges.length+'/4',4,H-12,1,SW.badges.length>=4?'#ffd94d':UI.dim,null)}
 {const dph=wDark()<=0?'DAY':wDark()<.6?'DUSK':'NIGHT',dl=dph+' '+(SW.day||1);text(dl,W-5-tw(dl,1),H-12,1,UI.dim,null)}
 const busy=(F&&F.dlg)||W4.talk||state==='g4place';
 if(W4.near&&!busy)uiPill(W4.near.txt,H-30,'A');else if(F&&F.aimLab&&!busy)uiPill(F.aimLab,H-30,F.aimNeed?null:'A');
 if(W4.msgT>0&&W4.msg&&!busy){const ml=swWrap(W4.msg,W-30).slice(0,5),ex=(ml.length-1)*10,by=H-46-ex-(W4.near?0:0);
  r('rgba(10,10,16,.9)',8,by,W-16,13+ex);r(UI.gold,8,by,W-16,1);ml.forEach((l,j)=>text(l,Math.round(W/2-tw(l,1)/2),by+3+j*10,1,'#ffe8b0',null))}}

/* ---------------- title ---------------- */
function swDrawTitle(){const hz=Math.round(H*.60);ox=0;oy=0;
 uiSky(['#090c26','#1b1c50','#4a2f6e','#b04a68','#f08a5a','#ffc878'],hz+6);uiStars(46,Math.round(hz*.6),3);
 /* the sun coming up behind the lantern hill */
 {const sy=hz-10+Math.round(Math.sin(time*.4)*2);g.globalAlpha=.25;r('#fff3b0',W/2-34,sy-20,68,40);g.globalAlpha=.4;r('#fff3b0',W/2-24,sy-14,48,28);g.globalAlpha=1;r('#ffe8a0',W/2-16,sy-10,32,20)}
 uiHills(hz,26,'#3a2a5a',1.3,1);uiHills(hz+8,20,'#2a3a4a',4.1,1.6);
 uiRays(W/2,hz-44,150,9,'#ffd94d',.07);
 uiHills(hz+20,16,'#1d4a2c',2.2,2.1);
 r('#17401f',0,hz+22,W,H);r('#2c6a34',0,hz+22,W,2);
 for(let i=0;i<30;i++)r(i%3?'#2c6a34':'#58c048',(i*41+7)%W,hz+26+(i*13)%Math.max(8,H-hz-34),1,3);
 uiLantern(W/2,hz+10,true,1.2);
 /* fireflies */
 for(let i=0;i<10;i++){const fx=(i*53+time*(6+i%3))%W,fy=hz-30+Math.sin(time*.9+i*2)*18+(i*7)%20;if(Math.sin(time*3+i)>-.2)r('#fff3b0',Math.round(fx),Math.round(fy),1,1)}
 /* the parade: buddies and sprouts crossing the foreground */
 {const gy=H-22,ids=['CINDERCAP','DRIZZLET','FERNFANG','ZIPWIG','PEBBLIT','VOLTHARE'];
  ids.forEach((id,i)=>{const px=((time*14+i*52)%(W+80))-40,bob=((time*7+i)|0)%2;uiMon(id,px,gy-bob,26,true);
   drawBud({x:Math.round(px)-20,y:gy+2,type:i%6,stage:2,z:0,a:i*1.3,mv:true,st:'follow',fx:1})})}
 /* logo */
 {const ly=Math.max(18,Math.round(H*.13))+Math.round(Math.sin(time*1.6)*2),s='SPROUTWILD',lw=tw(s,3),lx=Math.round(W/2-lw/2);
  const k=Math.min(1.7,(W-24)/lw),bw=Math.round(lw*k),bx=Math.round(W/2-bw/2),bh=Math.round(22*k);
  r('rgba(9,12,38,.55)',bx-8,ly-6,bw+16,bh+26);
  g.save();g.translate(bx,ly);g.scale(k,k);text(s,1.5,1.5,3,'#0b2a14',null);text(s,0,0,3,'#a8e078',null);g.restore();
  r('#58c048',bx,ly+bh,bw,2);r('#ffd94d',bx,ly+bh+2,bw,1);
  /* a sprout growing out of the logo */
  r('#2c6030',bx+bw+2,ly+2,1,10);r('#58c048',bx+bw-2,ly-1,4,3);r('#58c048',bx+bw+3,ly-3,4,3);r('#b0f090',bx+bw-1,ly-1,1,1);
  const sub='A LANTERN VALLEY TALE';text(sub,Math.round(W/2-tw(sub,1)/2),ly+bh+7,1,'#ffe8b0',null)}
 if(!(W4.tm|0)){if(((time*1.6)|0)%2)uiPill('PRESS A',Math.round(hz+34),'A');if(typeof eject==='function')uiPill('EJECT',Math.round(hz+50),'B')}
 r('rgba(10,14,8,.8)',0,H-12,W,12);ctext(W4.tsaved>0?'SAVED TO FILE '+(wSlot+1):'GROW · THROW · CATCH · BUILD',H-10,1,W4.tsaved>0?'#7ee787':'#7a9a68',null);
 if(W4.tm|0)wTitleFiles()}

/* ---------------- the opening story ---------------- */
const WSTORY=[
 {who:'',t:'The Great Lantern hung over the valley and everything grew. Then, one night, it cracked.'},
 {who:'',t:'Its light fell as seeds, and the seeds grew legs: SPROUTS, the little plant folk.'},
 {who:'ERIN',t:"A year of dark, keeper. Sunkeep has one good patch of soil left. Grow them."},
 {who:'',t:'Wild BUDDIES went dim without the light. Sprouts can carry it back to them.'},
 {who:'MARCUS',t:"Four gyms, four Sigils. I'll be at mine either way. Unimpressed, as ever."},
 {who:'KING BIBI',t:'Citizens. For thirty years I have warned you: the light is weeks away. Hence, my IRON DOME.',acc:'#1e2c5a'}];
/* six beats, one press each (the old rhythm); B or START skips */
function introUpdate(){W4.introT=(W4.introT||0)+1/60;
 if(pressed('b')){wIntroDone();return}
 if(pressed('a')||pressed('start')){W4.introPage=(W4.introPage||0)+1;W4.introT=0;swSnd(660,.05);if(W4.introPage>=WSTORY.length)wIntroDone()}}
function swDrawIntro(){const p=Math.min(W4.introPage||0,WSTORY.length-1),tt=W4.introT||0,S=WSTORY[p],sn=S.sc==null?p:S.sc,gy=H-78;ox=0;oy=0;
 const fade=Math.min(1,tt*2.5);
 if(sn===0){ /* the lantern in the sky, then the crack */
  const crack=tt>1.5,sh=crack&&tt<2.0?Math.round(Math.sin(time*70)*2):0;
  uiSky(['#070a20','#141a48','#2a2a6a','#3a3a7a'],gy);uiStars(50,gy-20,1);uiHills(gy,22,'#12203a',1.1,1.2);uiHills(gy+10,14,'#0c2a1c',3.3,2);r('#0a2014',0,gy+10,W,H);
  const lx=W/2+sh,ly=Math.round(gy*.42);if(!crack)uiRays(lx,ly,130,10,'#ffd94d',.10);
  g.globalAlpha=crack?.08:.22+.06*Math.sin(time*3);r('#ffd94d',lx-34,ly-34,68,68);g.globalAlpha=1;
  r(UI.ink,lx-17,ly-21,34,42);r('#7a2e22',lx-17,ly-23,34,5);r('#3c2a16',lx-15,ly-18,30,36);r(crack?'#5a4a30':'#ffd94d',lx-12,ly-15,24,30);r(crack?'#6a5a3a':'#fff3b0',lx-8,ly-11,16,22);if(!crack)r('#ffffff',lx-4,ly-6,8,12);
  if(crack){r(UI.ink,lx-2,ly-15,2,9);r(UI.ink,lx,ly-7,5,2);r(UI.ink,lx+4,ly-6,2,10);r(UI.ink,lx-5,ly+3,10,2);r(UI.ink,lx-6,ly+4,2,10);
   if(tt<1.8){g.globalAlpha=1-(tt-1.5)/.3;r('#ffffff',0,0,W,H);g.globalAlpha=1}}}
 else if(sn===1){ /* seeds fall, sprouts pop */
  uiSky(['#070a20','#141a48','#2a2a6a'],gy);uiStars(40,gy-20,2);uiHills(gy,20,'#12203a',1.1,1.2);r('#143a1e',0,gy,W,H);r('#2c6a34',0,gy,W,2);
  for(let i=0;i<9;i++){const k=((tt*.55+i*.137)%1),sx=30+i*24+k*26,sy=k*(gy-6);r('#fff3b0',Math.round(sx),Math.round(sy),2,2);g.globalAlpha=.5;r('#ffd94d',Math.round(sx-3),Math.round(sy-5),1,4);r('#ffd94d',Math.round(sx-6),Math.round(sy-10),1,4);g.globalAlpha=1}
  for(let i=0;i<6;i++){const born=.8+i*.45;if(tt<born)continue;const age=tt-born,px=28+i*37,z=age<.3?Math.sin(age/.3*Math.PI)*10:0;
   if(age<.25){r('#fff3b0',px-4,gy-2,10,2);r('#fff3b0',px,gy-6,2,6)}
   drawBud({x:px,y:gy+8,type:i,stage:age<1?0:age<2?1:2,z,a:i*1.9,mv:age>2,st:'idle',fx:1})}}
 else if(sn===2){ /* Sunkeep, dark lantern, Erin */
  uiSky(['#1a2048','#4a3a70','#c06a6a','#f0b070'],gy);uiHills(gy,18,'#3a3a5a',2.2,1.4);r('#3f7a34',0,gy,W,H);r('#58a044',0,gy,W,2);
  r('#6a4a2c',W/2-50,gy+14,100,22);r('#7d5a36',W/2-50,gy+14,100,3);for(let i=0;i<3;i++){r('#5a3d24',W/2-36+i*30,gy+22,16,3);if(tt>.6+i*.4)drawBud({x:W/2-28+i*30,y:gy+24,type:[0,2,4][i],stage:Math.min(2,Math.floor((tt-.6-i*.4))),z:0,a:i,mv:false,st:'idle',fx:1})}
  uiLantern(W/2,gy+6,false,1.3);fChibi(W/2+56,gy+8,Object.assign({},FLOOK.ERIN,{sc:2}),[-1,0],false);g.drawImage(LOU.l[((time*2)|0)%2],W/2-88,gy-4,26,13);uiWill(W/2-50,gy+4,1.5,1,0)}
 else if(sn===3){ /* a sprout takes command of a buddy */
  uiSky(['#6ab8e8','#a8dcf4','#e0f4fc'],gy);uiHills(gy,14,'#3f8a4a',1.7,1.8);r('#5fa544',0,gy,W,H);r('#86d86c',0,gy,W,2);
  for(let i=0;i<40;i++)r(i%2?'#2f6a2c':'#4fb04a',(i*17+3)%W,gy+4+(i*7)%16,1,5);
  const k=(tt%2.6)/2.6,bx=60+(W-110-60)*Math.min(1,k*1.8),by=gy-8-Math.sin(Math.min(1,k*1.8)*Math.PI)*46,hit=k*1.8>=1;
  uiWill(46,gy+6,1.6,1,0);uiMon('FERNFANG',W-56,gy+12+(hit?0:Math.round(Math.sin(time*5))),44);
  if(!hit)drawBud({x:Math.round(bx),y:Math.round(by)+8,type:4,stage:2,z:0,a:1,mv:false,st:'idle',fx:1});
  else{drawBud({x:W-58,y:gy-30,type:4,stage:2,z:0,a:1,mv:true,st:'idle',fx:1});for(let i=0;i<6;i++){const a=i*1.05+time*3;r('#fff3b0',Math.round(W-56+Math.cos(a)*24),Math.round(gy-14+Math.sin(a)*16),2,2)}}
  uiMon('CINDERCAP',84,gy+12,26,true)}
 else if(sn===4){ /* Marcus and the four sigils */
  uiSky(['#e09a50','#f0c080','#f8e0b0'],gy);uiHills(gy,22,'#94603e',2.9,1.3);r('#bd8850',0,gy,W,H);r('#e6ba78',0,gy,W,2);
  fHouse(W/2,gy+12,wSector('WASTES'));fChibi(W/2+52,gy+16,Object.assign({},FLOOK.MARCUS,{sc:2}),[0,1],false);
  ['#58c048','#f07830','#48a0f0','#f0d020'].forEach((c,i)=>{if(tt<.4+i*.3)return;const a=time*1.2+i*1.571,sx=Math.round(W/2+Math.cos(a)*74),sy=Math.round(gy*.34+Math.sin(a)*12);
   r(UI.ink,sx-5,sy-6,10,12);r(c,sx-3,sy-5,6,3);r(c,sx-4,sy-2,8,4);r(c,sx-3,sy+2,6,3);r('#ffffff',sx-1,sy-2,2,2)})}
 else if(sn===5){ /* King Bibi raises the dome */
  uiSky(['#0c0a20','#241f44','#3d3760','#5a4a80'],gy);uiStars(30,gy-30,5);uiHills(gy,20,'#241f36',1.9,1.5);r('#262244',0,gy,W,H);r('#3d3760',0,gy,W,2);
  const rise=Math.min(1,tt/1.6),rad=Math.round(70*rise);
  if(g.beginPath&&rad>4){g.save();g.beginPath();g.rect(0,0,W,gy);g.clip();g.globalAlpha=.18+.06*Math.sin(time*4);g.fillStyle='#58a0f0';g.beginPath();g.arc(W/2,gy,rad,0,6.3);g.fill();
   g.globalAlpha=.8;g.strokeStyle='#b0e0f8';g.lineWidth=1;g.beginPath();g.arc(W/2,gy,rad,0,6.3);g.stroke();g.globalAlpha=.35;g.beginPath();g.arc(W/2,gy,rad*.7,0,6.3);g.stroke();g.restore();g.globalAlpha=1}
  fFort(W/2,gy+8);fChibi(W/2,gy+18,FLOOK['KING BIBI'],[0,1],false);fChibi(W/2-40,gy+16,FLOOK['DOME GUARD'],[0,1],false);fChibi(W/2+40,gy+16,FLOOK['DOME GUARD'],[0,1],false);
  if(tt>2.4){const by=Math.round(gy*.30+Math.sin(time*1.4)*2);g.globalAlpha=.14+.06*Math.sin(time*5);r('#7ee7ff',W-66,by-30,40,34);g.globalAlpha=1;wChar('BOTTIE',W-46,by,30)}}
 if(fade<1){g.globalAlpha=1-fade;r('#000000',0,0,W,H);g.globalAlpha=1}
 /* letterbox + progress */
 r('#000000',0,0,W,9);for(let i=0;i<WSTORY.length;i++)r(i===p?UI.gold:i<p?'#7a6a30':'#3a3a48',W/2-WSTORY.length*5+i*10,3,7,3);
 uiSay(S.who,S.t,tt*60,'A  NEXT · B  SKIP',S.acc)}

/* ---------------- cut-ins ---------------- */
function swCineUpdate(){if(!W4.cine){state='g4world';return}W4.cine.t+=1/60;
 if(pressed('a')||pressed('b')||W4.cine.t>5){W4.cine=null;state='g4world'}}
function swDrawCine(){const cn=W4.cine;if(!cn)return;const t=cn.t,cy=Math.round(H*.42),pop=t<.35?.4+t/.35*.75:t<.5?1.15-(t-.35)/.15*.15:1;ox=0;oy=0;
 const mon=cn.kind==='mon',T=mon?TYPES[wSp(cn.id).t[0]]:null,c1=mon?T.d:'#3a2a5a',c2=mon?T.c:'#b06a3a';
 uiSky(['#0a0d18',c1,c2],H);uiRays(W/2,cy,220,12,'#ffffff',.10);uiRays(W/2,cy,150,7,'#fff3b0',.10);
 g.globalAlpha=.25;r('#ffffff',W/2-44,cy-40,88,70);g.globalAlpha=1;
 for(let i=0;i<16;i++){const k=((t*.5+i*.0625)%1),a=i*2.4,x=W/2+Math.cos(a)*k*130,y=cy+Math.sin(a)*k*100;r(i%2?'#fff3b0':(mon?T.l:'#ffd94d'),Math.round(x),Math.round(y),2,2)}
 r('rgba(0,0,0,.3)',W/2-30,cy+30,60,6);
 if(mon)uiMon(cn.id,W/2,cy+34+Math.round(Math.sin(time*3)*1.5),Math.round(84*pop));
 else fChibi(W/2,cy+34,Object.assign({},FLOOK[cn.id]||FLOOK.WILL,{sc:3}),[0,1],false);
 /* name banner sweeps in */
 {const k=Math.min(1,Math.max(0,(t-.25)/.25)),by=Math.max(14,cy-78),bw=Math.round(W*k);r(UI.ink,W/2-bw/2,by,bw,26);r(UI.gold,W/2-bw/2,by,bw,2);r(UI.gold,W/2-bw/2,by+24,bw,2);
  if(k>=1){text(cn.id,Math.round(W/2-tw(cn.id,2)/2),by+6,2,'#ffffff',null)}}
 uiSay(mon?'NEW BUDDY':'KEEPER',mon?(cn.id+' joined you! '+(cn.sub||'')):(WCINELINE[cn.id]||''),Math.max(0,t-.4)*50,'A  CONTINUE',mon?T.d:UI.red)}
function drawBottie(){const ph=W4.botPhase||0,bt=W4.botT||0,gy=H-70;ox=0;oy=0;
 uiSky(['#050814','#101c38','#243c5c','#4a6a7a'],gy);uiStars(36,gy-20,9);uiHills(gy,16,'#16283a',1.4,1.6);
 r('#2c5a30',0,gy,W,H);r('#4a8a44',0,gy,W,2);
 const sh=ph===1&&bt<.4?Math.round(Math.sin(time*70)*2):0;
 uiLantern(W/2-70+sh,gy+10,true,1.1);
 let by;if(ph===0){const k=Math.min(1,bt/2.6);by=-70+(gy+4+70)*k*k}else if(ph===1)by=gy+2+Math.sin(time*1.8)*2;else by=(gy+2)-340*bt;
 if(ph===0){g.globalAlpha=.5;r('#7ee7ff',W/2+18,0,6,Math.max(0,by-50));g.globalAlpha=.2;r('#7ee7ff',W/2+8,0,26,Math.max(0,by-50));g.globalAlpha=1;uiRays(W/2+21,Math.max(0,by-30),90,8,'#7ee7ff',.12)}
 wChar('BOTTIE',W/2+21+sh,by,52);
 if(ph===1&&bt<.5)for(let i=0;i<8;i++)r('#cbb98a',W/2+21+(i-4)*9,gy+2-Math.round(bt*20)+(i%2)*3,5,3);
 g.drawImage(LOU.l[((time*6)|0)%2],W/2-40,gy-4,26,13);if(ph>=1&&((time*4)|0)%2)text('!',W/2-28,gy-18,1,'#ffd94d',UI.ink);
 uiWill(W/2-18,gy+6,1.5,1,0);
 if(ph===1){const pg=WBOTTPAGES[W4.botPage||0],i=pg.indexOf(': ');uiSay(pg.slice(0,i),pg.slice(i+2),null,'A  NEXT',pg[0]==='L'?'#b45a28':'#2a5a6a')}}

/* ---------------- menu chrome ---------------- */
function swShell(title,sub){r('#141a14',0,0,W,H);for(let i=0;i<24;i++)r('#1a221a',(i*53)%W,22+(i*37)%Math.max(10,H-30),14,1);
 r('#1d2b18',0,0,W,20);r(UI.gold,0,20,W,1);r('#3a5a30',0,21,W,1);
 r('#2c6030',6,4,1,5);r('#58c048',3,3,3,3);r('#58c048',7,2,3,3);
 text(title,14,5,1,'#ffd94d',null);if(sub){const s2=wFit(sub,W-30-tw(title,1));text(s2,W-8-tw(s2,1),5,1,UI.dim,null)}}
function swRows(items,sel,desc){const room=H-26-(desc?40:8),rh=Math.max(10,Math.min(16,Math.floor(room/Math.max(1,items.length)))),vis=Math.max(1,Math.floor(room/rh)),y0=26;
 const top=Math.max(0,Math.min(items.length-vis,sel-Math.floor(vis/2)));
 for(let i=top;i<Math.min(items.length,top+vis);i++){const it=items[i],y=y0+(i-top)*rh,on=i===sel;
  r(on?UI.ink:'#1e2a1e',8,y,W-16,rh-2);r(on?'#fff3b0':'#243424',9,y+1,W-18,rh-4);if(on)r(UI.gold,9,y+1,3,rh-4);
  const bw=it.b?Math.min(tw(it.b,1),Math.round(W*.52)):0,bt2=it.b?wFit(it.b,bw):'',atxt=wFit(it.a,W-40-bw-(bw?8:0));
  text(atxt,17,y+Math.floor((rh-10)/2)+1,1,on?'#281c30':'#e8f4d8',null);
  if(it.b)text(bt2,W-13-tw(bt2,1),y+Math.floor((rh-10)/2)+1,1,on?'#7a5a18':UI.dim,null)}
 if(top>0)text('▲',W-8,24,1,UI.gold,null);if(top+vis<items.length)text('▼',W-8,y0+vis*rh-8,1,UI.gold,null);
 if(desc){r(UI.ink,6,H-38,W-12,32);r('#0d140d',7,H-37,W-14,30);r('#3a5a30',7,H-37,W-14,1);
  swWrap(desc,W-26).slice(0,3).forEach((l,j)=>text(l,12,H-34+j*9,1,'#cfe0b8',null))}}
function drawConfirm(){r('rgba(6,8,6,.76)',0,0,W,H);const y=Math.round(H/2-46);
 r(UI.ink,22,y,W-44,92);r(UI.paper,24,y+2,W-48,88);r(UI.gold,24,y+2,W-48,3);
 ctext('ARE YOU SURE?',y+12,2,UI.red,null);
 swWrap(W4.confirm?W4.confirm.txt:'',W-70).slice(0,3).forEach((l,j)=>ctext(l,y+34+j*11,1,'#282838',null));
 r(UI.paper2,24,y+74,W-48,16);text('A  YES',40,y+78,1,'#1d5a2a',null);text('B  NO',W-40-tw('B  NO',1),y+78,1,UI.red,null)}

/* ---------------- Sunkeep's ground ---------------- */
function wBakeGround(){const sec=wSector(W4.sector),wh=W4.wh||360,B=FBIO.MEADOW;
 const cv=document.createElement('canvas');cv.width=WW;cv.height=wh;const b=cv.getContext('2d');
 const R=(c,x,y,w,h)=>{b.fillStyle=c;b.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))},rnd=wSeedRand(wSectorSeed(sec.id)+5);
 R(B.g,0,0,WW,wh);
 for(let i=0;i<90;i++)R(B.g2,rnd()*WW,rnd()*wh,10+rnd()*22,5+rnd()*10);
 for(let i=0;i<520;i++){const ux=rnd()*WW,uy=rnd()*wh;R(B.g3,ux,uy+1,1,2);R(B.g3,ux+2,uy+1,1,2);R(B.a,ux+1,uy,1,2)}
 const path=(x,y,w,h)=>{R(B.p,x,y,w,h);for(let i=0;i<w*h/40;i++)R(B.p2,x+rnd()*(w-2),y+rnd()*(h-1),2,1);
  for(let i=0;i<w;i+=2){R(B.g2,x+i,y-1,2,1+((rnd()*2)|0));R(B.g2,x+i,y+h-((rnd()*2)|0),2,2)}
  for(let i=0;i<h;i+=2){R(B.g2,x-1,y+i,1+((rnd()*2)|0),2);R(B.g2,x+w-((rnd()*2)|0),y+i,2,2)}};
 if(sec.id==='BASE'){
  path(WW/2-9,88,18,236);path(WW/2-9,392,18,wh-392);     /* lantern to garden, garden to gate */
  path(84,120,312,14);path(84,134,14,292);path(98,412,134,14); /* the keepers' lanes */
  path(322,198,14,214);path(248,412,88,14);
  /* plaza */
  for(let px=196;px<284;px+=11)for(let py=92;py<116;py+=8){R('#6e6350',px+((py/8|0)%2)*5,py,11,8);R(((px+py)/4|0)%2?'#a39a86':'#948a76',px+((py/8|0)%2)*5,py,10,7);R('#b8b09c',px+((py/8|0)%2)*5,py,10,1)}
  /* the garden: fenced, tilled */
  const pc=6+Math.min(2,SW.buildings.filter(b2=>b2.k==='bed').length);
  R('#5a8a3a',158,326,164,66);R('#8a6a48',162,330,156,3);R('#8a6a48',162,384,156,3);R('#8a6a48',162,330,3,57);R('#8a6a48',315,330,3,57);
  R('#b89468',162,330,156,1);for(let fx=162;fx<=315;fx+=22){R(UI.ink,fx-1,326,6,9);R('#6e5233',fx,327,4,7);R(UI.ink,fx-1,380,6,9);R('#6e5233',fx,381,4,7)}
  const PL=[[208,348],[240,348],[272,348],[208,374],[240,374],[272,374],[176,361],[304,361]];
  for(let i=0;i<pc;i++){const [px,py]=PL[i];R('#4a3520',px-12,py-7,24,15);R('#6a4a2c',px-11,py-6,22,13);R('#8a6238',px-11,py-6,22,2);R('#5a3d24',px-8,py-1,16,2);R('#5a3d24',px-8,py+3,16,2)}
  /* flower beds along the lanes */
  for(let i=0;i<46;i++){const fx=20+rnd()*(WW-40),fy=100+rnd()*(wh-150);if(fx>150&&fx<330&&fy>316&&fy<400)continue;const c=B.fl[i%3];R(c,fx,fy,2,2);R('#ffffff',fx,fy,1,1);R(B.g3,fx,fy+2,1,2)}}
 /* the forest edge */
 const tree=(x,y)=>{R('rgba(0,0,0,.24)',x-12,y-3,28,6);artTree((c,a,b2,w,h)=>R(c,x-22+a,y-44+b2,w,h),B,0)};
 R('#2c5a2e',0,0,WW,10);R('#2c5a2e',0,0,6,wh);R('#2c5a2e',WW-6,0,6,wh);R('#2c5a2e',0,wh-8,WW,8);
 for(let x=6;x<WW;x+=26){if(sec.id==='BASE'&&x>150&&x<330)continue;tree(x+((rnd()*6)|0),26+((rnd()*5)|0))}
 for(let y=52;y<wh-10;y+=26){tree(1+((rnd()*3)|0),y);tree(WW-2-((rnd()*3)|0),y+12)}
 for(let x=6;x<WW;x+=14){if(Math.abs(x-WW/2)<34)continue;R(UI.ink,x-1,wh-13,15,13);R(B.t1,x,wh-12,13,12);R(B.t2,x,wh-12,13,4);R(B.t3,x+2,wh-11,4,1)}
 W4.groundCv=cv;W4.groundFor=sec.id+'x'+wh}
