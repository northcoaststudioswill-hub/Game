/* =====================================================================
   ROOTDEEP 64 — HUD & screens
   Drawn crisp on a 2D canvas over the soft 3D picture, in a virtual
   space VW x VH (VH = 300). Every screen is the cartridge's screen —
   same rows, same words — re-set for a TV and up to four keepers.
   ===================================================================== */
'use strict';
const FSZ=[0,9,12,16,22,34];
const FONT=s=>'900 '+s+'px "Arial Black","Avenir Next","Futura","Trebuchet MS","Helvetica Neue",Arial,sans-serif';
function tw(s,sz){hx.font=FONT(FSZ[sz]);return hx.measureText(s).width}
function text(s,x,y,sz,col,ol,al){hx.font=FONT(FSZ[sz]);hx.textBaseline='top';hx.textAlign=al||'left';
 if(ol!==null){hx.lineWidth=Math.max(2,FSZ[sz]*.3);hx.strokeStyle=ol||'#120a18';hx.lineJoin='round';hx.strokeText(s,x,y)}
 hx.fillStyle=col;hx.fillText(s,x,y)}
function ctext(s,y,sz,col,ol,cx){text(s,cx===undefined?VW/2:cx,y,sz,col,ol,'center')}
function rtext(s,x,y,sz,col,ol){text(s,x,y,sz,col,ol,'right')}
function r(c,x,y,w,h){hx.fillStyle=c;hx.fillRect(x,y,w,h)}
function wrapPx(s,maxW,sz){const out=[];let l='';for(const w of String(s).split(' ')){const t=l?l+' '+w:w;if(l&&tw(t,sz)>maxW){out.push(l);l=w}else l=t}if(l)out.push(l);return out}
/* a short message on a dark strip, wrapped to fit any screen */
function banner(msg,y){const big=tw(msg,2)<=VW-24,sz=big?2:1,L=big?[msg]:wrapPx(msg,VW-28,1).slice(0,3),lh=big?18:12,w=Math.max(...L.map(l=>tw(l,sz)))+20;
 r('rgba(10,6,16,.82)',VW/2-w/2,y-4,w,L.length*lh+6);L.forEach((l,i)=>ctext(l,y+i*lh,sz,'#a8f080',null))}
function panel(x,y,w,h,c,edge){r('rgba(6,4,12,.55)',x+2,y+3,w,h);r(edge||'#0c0814',x-1,y-1,w+2,h+2);r(c||'#1d1530',x,y,w,h);r('rgba(255,255,255,.07)',x,y,w,1)}
function pips(n,mx,x,y,c){for(let i=0;i<mx;i++){r('#0d0a14',x+i*8,y,7,7);r(i<n?c:'#3a3350',x+i*8+1,y+1,5,5)}return x+mx*8}
/* gold cartridge-label lettering */
function logoText(s,cx,y,px){hx.font=FONT(px);hx.textAlign='center';hx.textBaseline='top';hx.lineJoin='round';
 hx.lineWidth=px*.3;hx.strokeStyle='#1a0e06';hx.strokeText(s,cx,y+px*.07);hx.lineWidth=px*.16;hx.strokeStyle='#5a3208';hx.strokeText(s,cx,y);
 const g=hx.createLinearGradient(0,y,0,y+px);g.addColorStop(0,'#fff6b8');g.addColorStop(.45,'#ffd94d');g.addColorStop(.55,'#f0a020');g.addColorStop(1,'#c86010');hx.fillStyle=g;hx.fillText(s,cx,y)}
/* reward-door icons, drawn (no font glyphs to go missing on a phone) */
function icon(kind,x,y,s,c){hx.save();hx.translate(x,y);hx.fillStyle=c||'#ffd94d';hx.strokeStyle='#120a18';hx.lineWidth=1.6;hx.lineJoin='round';hx.beginPath();
 if(kind==='boon'){for(let i=0;i<8;i++){const a=i/8*6.2832-1.5708,rr=i%2?s*.4:s;hx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}hx.closePath()}
 else if(kind==='petals'){for(let i=0;i<5;i++){const a=i/5*6.2832;hx.moveTo(Math.cos(a)*s*.55+s*.42,Math.sin(a)*s*.55);hx.arc(Math.cos(a)*s*.55,Math.sin(a)*s*.55,s*.42,0,6.3)}}
 else if(kind==='dew'){hx.moveTo(0,-s);hx.quadraticCurveTo(s*.95,s*.2,0,s);hx.quadraticCurveTo(-s*.95,s*.2,0,-s)}
 else if(kind==='fruit'){hx.arc(0,0,s*.55,0,6.3);for(let i=0;i<8;i++){const a=i/8*6.2832;hx.moveTo(Math.cos(a)*s*.72,Math.sin(a)*s*.72);hx.lineTo(Math.cos(a)*s,Math.sin(a)*s)}hx.lineWidth=2.4;hx.strokeStyle=c||'#ffd94d';hx.stroke();hx.beginPath();hx.arc(0,0,s*.55,0,6.3);hx.strokeStyle='#120a18';hx.lineWidth=1.2}
 else if(kind==='heart'){hx.moveTo(0,s*.9);hx.bezierCurveTo(-s*1.5,-s*.2,-s*.6,-s*1.2,0,-s*.4);hx.bezierCurveTo(s*.6,-s*1.2,s*1.5,-s*.2,0,s*.9)}
 else if(kind==='shop'){hx.rect(-s*.8,-s*.3,s*1.6,s*1.2);hx.moveTo(-s*.45,-s*.3);hx.quadraticCurveTo(0,-s*1.5,s*.45,-s*.3)}
 else if(kind==='fountain'){for(let j=-1;j<=1;j++){hx.moveTo(-s,j*s*.6);hx.quadraticCurveTo(-s*.5,j*s*.6-s*.5,0,j*s*.6);hx.quadraticCurveTo(s*.5,j*s*.6+s*.5,s,j*s*.6)}hx.lineWidth=2.6;hx.strokeStyle=c||'#7fd0e8';hx.stroke();hx.restore();return}
 else{for(let i=0;i<6;i++){const a=i/6*6.2832+.5236;hx.lineTo(Math.cos(a)*s,Math.sin(a)*s)}hx.closePath()}
 hx.stroke();hx.fill();hx.restore()}
const DOORLBL={dew:'MOONDEW',fruit:'SUNFRUIT',heart:'+25 MAX HP',fountain:'HEAL 35%',honey:'HONEY',shop:'SHOP',petals:'PETALS'};
const DOORCOL={boon:'#ffd94d',petals:'#f8a0c8',dew:'#7fd0e8',fruit:'#ffb040',heart:'#f85888',shop:'#e8c888',fountain:'#7fd0e8',honey:'#f8b840'};
/* what a device calls its buttons */
function btnName(dev,b){const id=dev?dev.id:'gp';
 if(id==='kb1')return{a:'Z',b:'X',sp:'C',sup:'V',dash:'SHIFT',start:'ENTER'}[b];if(id==='kb2')return{a:',',b:'.',sp:'M',sup:'N',dash:'/',start:'BKSP'}[b];
 return{a:'A',b:'B',sp:id==='touch'?'SP':'X',sup:id==='touch'?'SUPER':'Y',dash:id==='touch'?'DASH':'R',start:'START'}[b]}
/* button names follow whoever owns the open menu, else seat 1 */
const lead0=()=>menuDev||(PL[0]?PL[0].dev:null);

/* ---------------- shared menu furniture ---------------- */
let PX=0; /* left edge of the 300-wide menu column */
function screenShell(title,sub){r('rgba(10,6,18,.86)',0,0,VW,VH);PX=(VW-300)/2;panel(PX,8,300,VH-16,'#120c1c','#ffd94d');
 ctext(title,16,3,'#ffd94d','#403010');if(sub)ctext(sub,37,1,'#a89ec2',null)}
function rowsPlain(items,y,step){items.forEach((s,i)=>text(s,PX+14,y+i*step,1,'#c8c0d8',null))}
/* tap targets for touch: rebuilt every frame from what is drawn. Tap a row to pick it, tap it again to choose. */
let HIT=[];
function hitbox(x,y,w,h,sel,set){HIT.push({x,y,w,h,sel,set})}
function rowsDraw2(items,sel,desc){const step=items.length>6?19:22,y0=56;items.forEach((it,i)=>hitbox(PX+8,y0+i*step-4,284,step-2,i===sel,()=>{if(state==='heat')heatSel=i;else uiSel=i}));
 items.forEach((it,i)=>{const yy=y0+i*step,on=i===sel;
  if(on){r('#f8e060',PX+8,yy-4,284,step-2);r('#281c30',PX+9,yy-3,282,step-4)}
  if(it.pip){text(it.a,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);pips(it.pip[0],it.pip[1],PX+14+tw(it.a,1)+8,yy+2,'#ffd94d')}
  else text(it.a,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);
  if(it.b)rtext(it.b,PX+286,yy,1,on?'#ffd94d':'#8d84a8',null)});
 if(desc)wrapPx(desc,270,1).slice(0,2).forEach((l,i)=>ctext(l,VH-56+i*12,1,'#a89ec2',null))}
function footer(s){ctext(s,VH-25,1,'#8d84a8',null)}
function drawList(items,sel,y,step){items.forEach((s,i)=>{const on=i===sel;hitbox(VW/2-110,y+i*step-3,220,step-3,on,()=>{if(state==='menu')menuSel=i;else{if(pauseSel!==i)pauseConfirm=-1;pauseSel=i}});if(on){const w=tw(s,2)+26;r('#f8e060',VW/2-w/2,y+i*step-3,w,step-3);r('#281c30',VW/2-w/2+1,y+i*step-2,w-2,step-5)}
  ctext(s,y+i*step,2,on?'#ffd94d':'#c8c0d8',on?null:'#120a18')})}

/* ---------------- HUD: the Hearth ---------------- */
function hudHub(){
 for(const s of STATIONS){const q=project(s.x,25,29);if(q){const locked=s.id==='heat'&&RD.stats.escapes<1;ctext(s.l,Math.max(23,q.y-10),1,locked?'#6a6284':'#e8e0f8','#120a18',q.x)}}
 for(const who of NPCS){const n=HUBNPC[who];if(!n)continue;const q=project(n.x,who==='LOUIE'?15:26,n.y);
  if(q&&state==='hub'){const ev=NET.client?(NET.mk[who]?{mission:NET.mk[who]==='?'}:null):storyNext(who);if(ev){const turnin=!!ev.mission,by2=q.y-28+Math.sin(time*5)*2;r('#120a18',q.x-6,by2-1,12,15);r(turnin?'#58c048':'#ffd94d',q.x-5,by2,10,13);ctext(turnin?'?':'!',by2+1,1,'#120a18',null,q.x)}}
  if(q)ctext(who,q.y-11,1,'#c8c0d8','#120a18',q.x)}
 {const q=project(DOOR.x,6,DOOR.y+4);if(q)ctext('DESCEND',q.y,1,'#f8c070','#120a18',q.x)}
 {const q=project(BOARD.x,20,BOARD.y+7);if(q)ctext('BOARD',q.y-10,1,'#e8e0f8','#120a18',q.x)}
 if(PL.length>1)for(const p of PL){const q=project(p.x,27,p.y);if(q)ctext('P'+(p.ix+1),q.y-12,1,PCOL[p.ix],'#120a18',q.x)}
 /* top bar */
 r('rgba(10,6,16,.82)',0,0,VW,19);r('#c8a04a',0,19,VW,1);
 text('MOONDEW '+RD.dew,8,4,1,'#7fd0e8',null);text('KEYS '+RD.keys,98,4,1,'#f8d030',null);text('HONEY '+RD.honey,158,4,1,'#f8a0c8',null);
 if(RD.stats.escapes)rtext('ESCAPES '+RD.stats.escapes,VW-8,4,1,'#f8c070',null);
 if(state==='hub'){let shown=0;for(const p of PL){const t=p.hubT;if(!t)continue;const m=btnName(p.dev,'a')+': '+t.n,w=tw(m,2)+16,y=VH-44-shown*20;
   r('rgba(10,6,16,.88)',VW/2-w/2,y-3,w,18);r(PCOL[p.ix],VW/2-w/2,y-3,3,18);ctext(m,y,2,'#ffd94d');shown++}
  /* who's here and how to join or leave, up out of the way of the Root Door */
  const d0=PL[0]&&PL[0].dev,tch=d0&&d0.id==='touch';
  const join=PL.length>=4?'':tch?'MORE KEEPERS: PRESS A ON A CONTROLLER':'MORE KEEPERS: A ON ANOTHER PAD, OR , FOR A 2ND KEYBOARD';
  rtext(PL.length+' / 4 KEEPERS'+(PL.length>1?'  ·  HOLD B TO LEAVE':''),VW-8,24,1,'rgba(200,192,216,.75)',null);if(join)rtext(join,VW-8,36,1,'rgba(200,192,216,.55)',null)}
 if(joinT>0)banner(joinMsg,VH*.5);
 if(state==='talk'&&talkNPC){const bx=Math.max(8,VW/2-170),bw=Math.min(340,VW-16),by=VH-84;
  panel(bx,by,bw,76,'#f8f0d8','#181020');
  const sp=talkEv?talkWho:talkNPC,nw=tw(sp,2)+14;r('#181020',bx+6,by-9,nw,17);r(RDCPLATE[sp]||'#b8304a',bx+7,by-8,nw-2,15);text(sp,bx+13,by-6,2,'#ffffff',null);
  wrapPx(talkTxt,bw-24,1).slice(0,3).forEach((l,i)=>text(l,bx+12,by+14+i*13,1,'#281c30',null));
  const d=lead0();if(talkEv){const last=talkLine>=talkEv.lines.length-1,rw=talkEv.rew?rewTxt(talkEv.rew):'';
   text(btnName(d,'a')+(last?': DONE':': MORE  ·  '+btnName(d,'b')+': SKIP')+(last&&rw?'      '+rw:''),bx+12,by+60,1,last&&rw?'#3a7a28':'#7a6a8a',null);
   rtext((talkLine+1)+' / '+talkEv.lines.length,bx+bw-10,by+60,1,'#a89a8a',null);return}
  const more=talkStart+talkLine<LINES[talkNPC].length-1;
  text((more?btnName(d,'a')+': MORE  ·  '+btnName(d,'b')+': BYE':btnName(d,'a')+': BYE')+(RD.honey>0?'  ·  '+btnName(d,'start')+': GIFT HONEY ('+RD.honey+')':''),bx+12,by+60,1,'#7a6a8a',null)}}

/* ---------------- HUD: the run ---------------- */
function hudPlayer(p,x,y,right){const s=rdStats(p),w=104,full=(p.meter||0)>=SUPER_MAX;
 panel(x,y,w,37,'rgba(14,9,22,.86)');r(PCOL[p.ix],right?x+w-3:x,y,3,37);
 const tx=x+(right?4:8);
 text('P'+(p.ix+1),tx,y+2,1,PCOL[p.ix],null);text(p.char,tx+17,y+2,1,'#e8e4f5',null);
 if(p.down){rtext(((time*3)|0)%2?'DOWN':'',x+w-8,y+2,1,'#ff7a6b',null)}else rtext(p.char.length>5?''+Math.ceil(p.hp):Math.ceil(p.hp)+'/'+s.maxHp,x+w-(right?8:5),y+2,1,'#ffffff',null);
 const bw=w-13;r('#3a1420',tx,y+13,bw,6);r(p.hp/s.maxHp<.3?'#e84a5f':'#58c048',tx,y+13,Math.round(bw*clamp(p.hp/s.maxHp,0,1)),6);
 for(let i=1;i<10;i++)r('rgba(10,6,16,.5)',tx+Math.round(i*bw/10),y+13,1,6);
 /* cast · dash · special */
 let px=tx;px=pips(p.castAmmo||0,1+(hasKeep('stone')?1:0),px,y+21,'#7fd0e8')+4;px=pips(p.dashCharges||0,s.dashCharges,px,y+21,'#ffd94d')+4;
 const cd=clamp(1-(p.spCd||0)/(mv(p).spCd||6),0,1);r('#0d0a14',px,y+21,22,7);r(cd>=1?'#f878a8':'#6a3a52',px+1,y+22,Math.round(20*cd),5);
 /* super meter */
 r('#241a08',tx,y+30,bw,4);r(full?(((time*8)|0)%2?'#ffffff':'#ffd94d'):'#c88a18',tx,y+30,Math.round(bw*clamp((p.meter||0)/SUPER_MAX,0,1)),4);
 if(full)text('SUPER',x+(right?-34:w+4),y+27,1,((time*6)|0)%2?'#ffd94d':'#ffffff','#120a18');
 /* combo counter under the panel: pops on every hit, grades as it climbs */
 if((p.cmb||0)>=3){const n=p.cmb,g=n>=30?'SAVAGE':n>=20?'BRUTAL':n>=10?'GREAT':n>=5?'NICE':'',pop=1+clamp((p.cmbT-1.6)/.2,0,1)*.35,top=y<VH/2,cy=top?y+42:y-26;
  hx.save();hx.translate(right?x+w-8:x+8,cy);hx.scale(pop,pop);text(n+' HITS',0,0,3,PCOL[p.ix],'#120a18',right?'right':'left');if(g)text(g,0,15,1,'#ffffff','#120a18',right?'right':'left');hx.restore()}}
function hudRun(){const B=BIOMES[RUN.biome];
 /* world-anchored labels */
 if(RUN.phase==='doors')for(const d of RUN.doors){const q=project(d.x,36,27);if(!q)continue;const lbl=d.kind==='boon'?GODS[d.god].n+' BOON':DOORLBL[d.kind]||d.kind.toUpperCase(),c=d.kind==='boon'?GODS[d.god].l:DOORCOL[d.kind];
  const qy=Math.max(46,q.y);icon(d.kind,q.x,qy-8,7,c);ctext(lbl,qy+2,1,'#ffffff','#120a18',q.x);
  if(d.boss)ctext('BOSS AHEAD',qy+13,1,'#ff9a8a','#120a18',q.x);
  if(d.hold>0){const k=clamp(d.hold/doorHold(),0,1),y2=qy+(d.boss?25:14);r('#120a18',q.x-21,y2,42,5);r(d.by?PCOL[d.by.ix]:'#fff',q.x-20,y2+1,Math.round(40*k),3)}}
 for(const e of RUN.enemies){if(e.kind==='boss'||e.hp>=e.max)continue;const q=project(e.x,(e.kind==='shade'||e.kind==='wisp'?24:17)*(e.elite?1.4:1.1),e.y);if(!q)continue;
  r('#120a18',q.x-11,q.y-2,22,4);r('#e84a5f',q.x-10,q.y-1,Math.round(20*clamp(e.hp/e.max,0,1)),2)}
 for(const p of PL){const q=project(p.x,p.down?12:27,p.y);if(!q)continue;
  if(p.down)ctext('P'+(p.ix+1)+' - STAND HERE',q.y-12,1,PCOL[p.ix],'#120a18',q.x);else if(PL.length>1)ctext('P'+(p.ix+1),q.y-12,1,PCOL[p.ix],'#120a18',q.x)}
 {const placed=[];for(const t of RUN.texts.slice(-28)){const q=project(t.x,16+(.8-t.t)*10,t.y);if(!q)continue;let y=q.y-6;const sz=t.txt.length>6?1:2,w=tw(t.txt,sz)/2+2;
  for(let k=0;k<6;k++){const hit=placed.find(o=>Math.abs(o.x-q.x)<o.w+w&&Math.abs(o.y-y)<12);if(!hit)break;y=hit.y-13}placed.push({x:q.x,y,w});ctext(t.txt,y,sz,t.c,'#120a18',q.x)}}
 /* keeper panels in the four corners, like a 4-player cartridge */
 const slots=[[6,6,0],[VW-110,6,1],[6,VH-43,0],[VW-110,VH-43,1]];
 PL.forEach(p=>hudPlayer(p,slots[p.ix][0],slots[p.ix][1],slots[p.ix][2]));
 /* the shared purse */
 const solo=PL.length<2,rx=solo?VW-8:VW/2,al=solo?'right':'center';
 const rt='PETALS '+RUN.petals+'   MOONDEW '+RUN.dew+(RUN.keys?'   KEYS '+RUN.keys:'')+(RUN.heat?'   HEAT '+RUN.heat:'');
 text(rt,rx,7,1,'#f8c8e0','#120a18',al);
 if(RUN.buds.length)text('BUDS '+RUN.buds.length+'/6',rx,19,1,'#a8f080','#120a18',al);
 ctext('CH '+RUN.chamber+'/12  ·  '+B.n+(RUN.phase==='fight'?'  ·  FOES '+RUN.enemies.length+(RUN.wave2&&RUN.wave2.length?' + MORE':''):''),VH-(PL.length>2?13:14),1,'#a89ec2','#120a18');
 if(RUN.phase==='fight'&&RUN.enemies.length&&RUN.enemies.length<=3&&!RUN.wave2)for(const e of RUN.enemies){const q=project(e.x,8,e.y);if(!q)continue;const m=24;if(q.x>m&&q.x<VW-m&&q.y>m+20&&q.y<VH-m-20)continue;
  const ex=clamp(q.x,m,VW-m),ey=clamp(q.y,m+20,VH-m-20),a=Math.atan2(q.y-VH/2,q.x-VW/2);hx.save();hx.translate(ex,ey);hx.rotate(a);hx.fillStyle='#ff6a5a';hx.strokeStyle='#120a18';hx.lineWidth=2;hx.beginPath();hx.moveTo(9,0);hx.lineTo(-6,-7);hx.lineTo(-6,7);hx.closePath();hx.stroke();hx.fill();hx.restore()}
 if(RUN.chamber===1&&RUN.time<9&&RD.stats.runs<=3&&!RUN.banner){const d=lead0();const tch=d&&d.id==='touch';
  const L=[btnName(d,'a')+' HIT','HOLD '+btnName(d,'a')+': HEAVY',btnName(d,'b')+' CAST',(tch?'DASH':(d&&d.id==='kb1'?'SHIFT / DOUBLE-TAP':btnName(d,'dash'))+': DASH'),'HIT DURING A DASH: DASH STRIKE',(tch?'SP':btnName(d,'sp'))+': SPECIAL',(tch?'SUPER':btnName(d,'sup'))+': SUPER WHEN FULL'];
  /* pack the hints into as many lines as the screen needs */
  const mw=Math.min(380,VW-20),lines=[];let cur='';for(const x of L){const t=cur?cur+'  ·  '+x:x;if(cur&&tw(t,1)>mw-16){lines.push(cur);cur=x}else cur=t}lines.push(cur);
  const hy=VH-(PL.length>2?62:46)-lines.length*13;r('rgba(8,5,14,.7)',VW/2-mw/2,hy-4,mw,lines.length*13+7);lines.forEach((l,i)=>ctext(l,hy+i*13,1,'rgba(255,255,255,.88)',null))}
 if(RUN.boss&&RUN.boss.hp>0){const bw=Math.min(200,VW-240),bx=(VW-bw)/2,by=PL.length>1?34:22;r('#ffb0a0',bx-1,by-1,bw+2,10);r('#181020',bx,by,bw,8);r('#c22e4a',bx+1,by+1,Math.round((bw-2)*clamp(RUN.boss.hp/RUN.boss.max,0,1)),6);
  ctext(BOSSES[RUN.boss.bossIx].n,by+11,1,'#ffb0a0','#120a18')}
 if(RUN.zoneT>0){const cn=(CHNAMES[RUN.chamber-1]||{n:B.n}).n;logoText(cn,VW/2,VH*.25,tw(cn,4)>VW-30?16:22);ctext(B.n+'  ·  CHAMBER '+RUN.chamber,VH*.25+26,1,'#c8b8e8','#120a18')}
 if(say2T>0&&!RUN.banner)ctext(say2Txt,RUN.zoneT>0?VH*.42:VH*.34,tw(say2Txt,2)>VW-16?1:2,'#ffd94d');
 /* getting hurt: the screen edge flashes in your colour (solo: red) */
 for(const p of PL)if(p.hurt>0){const a=clamp(p.hurt/.25,0,1)*.55,c=PL.length>1?PCOL[p.ix]:'#e8304a',g=hx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.35,VW/2,VH/2,Math.max(VW,VH)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,c);hx.globalAlpha=a;hx.fillStyle=g;hx.fillRect(0,0,VW,VH);hx.globalAlpha=1}
 /* what the room holds: a relic to read, a keeper's lost thing, the ghost */
 if(RUN.relic){const q=project(RUN.relic.x,22,RUN.relic.y),R0=RELICS.find(r=>r.id===RUN.relic.id);if(q&&R0){const quiet=RUN.phase==='doors',near=PL.find(p=>p.relicNear);
  ctext(RUN.relic.read||(RD.relic&&RD.relic[R0.id])?R0.n:(quiet?R0.src:'?'),q.y-8,1,quiet?'#ffe9a0':'rgba(255,233,160,.5)','#120a18',q.x);if(near)ctext(btnName(near.dev,'a')+': READ',q.y+4,1,'#ffd94d','#120a18',q.x)}}
 if(RUN.qitem){const q=project(RUN.qitem.x,18,RUN.qitem.y),Q=KQUESTS[RUN.qitem.char];if(q)ctext(Q.steps[RUN.qitem.step].item,q.y-8,1,Q.col,'#120a18',q.x)}
 if(RUN.ghostNpc){const g=RUN.ghostNpc,q=project(g.x,30,g.y);if(q&&g.line<0)ctext(GHOSTN,q.y-8,1,'#bfe8ff','#120a18',q.x)}
 if(RUN.echo){const q=project(RUN.echo.x,22,RUN.echo.y);if(q)ctext('AN ECHO',q.y-8,1,'#ffe9a0','#120a18',q.x)}
 /* who is talking down here */
 if(RUN.sub&&!RUN.banner){const s2=RUN.sub,L=wrapPx(s2.txt,Math.min(330,VW-240),1).slice(0,2),bw=Math.max(...L.map(l=>tw(l,1)),tw(s2.who,1))+22,bx=(VW-bw)/2,by=RUN.boss?(PL.length>1?60:48):34,al=clamp(s2.t/.3,0,1);
  hx.globalAlpha=al;r('rgba(8,5,14,.84)',bx,by,bw,L.length*12+17);r(s2.c,bx,by,3,L.length*12+17);text(s2.who,bx+10,by+3,1,s2.c,null);L.forEach((l,i)=>text(l,bx+10,by+15+i*12,1,'#f4ead2',null));hx.globalAlpha=1}
 if(RUN.flash>0)r('rgba(255,255,255,'+clamp(RUN.flash/.3,0,1)*.85+')',0,0,VW,VH);
 /* super call-out: letterbox, name, whose it is */
 if(RUN.banner){const b=RUN.banner,inn=clamp((1.3-b.t)/.12,0,1),out=clamp(b.t/.25,0,1),k=inn*out,by=VH*.13;r('rgba(6,4,12,'+.8*k+')',0,by,VW,52);r(b.c,0,by,VW*k,2);r(b.c,VW*(1-k),by+50,VW*k,2);
  if(k>.5){ctext(b.who,by+6,1,b.c,'#120a18');logoText(b.txt,VW/2+(1-inn)*80,by+17,b.txt.length>15?21:27)}}}

/* ---------------- screens ---------------- */
function drawUI(){const M=RD,d=lead0(),A=btnName(d,'a'),Bk=btnName(d,'b');
 if(state==='set'){screenShell('SETTINGS','SOUND AND FEEL');
  rowsDraw2([{a:'MUSIC VOL',pip:[M.set.mus,10],b:M.set.mus+' / 10'},{a:'SFX VOL',pip:[M.set.sfx,10],b:M.set.sfx+' / 10'},{a:'SCREEN SHAKE',b:M.set.shake?'ON':'OFF'},{a:"KEEPER'S GRACE",b:M.set.grace?'ON':'OFF'},{a:'AIM HELP',b:M.set.assist!==false?'ON':'OFF'}],uiSel,['The lantern hum, low under everything.','Every slash, beep and bloom.','The screen kicks when you take a hit.',"An easier descent: you take half damage, and every run starts with one extra revive.",'Attacks and casts lean toward a foe close to where you aim.'][uiSel]);
  footer('< > ADJUST  ·  '+A+': CYCLE    '+Bk+': BACK');return}
 if(state==='sprouts'){drawSprouts();return}
 if(state==='mirror'){screenShell('MIRROR OF DEW','MOONDEW: '+M.dew);
  rowsDraw2(MIRROR.map(m=>{const rank=mir(m.id);return{a:m.n,pip:[rank,m.max],b:rank>=m.max?'MAX':m.cost[rank]+' DEW'}}),uiSel,MIRROR[uiSel].d+'. Bought with Moondew, kept forever.');
  footer(buyAsk===uiSel?A+' AGAIN: BUY FOR '+MIRROR[uiSel].cost[mir(MIRROR[uiSel].id)]+' MOONDEW    '+Bk+': BACK':A+': BUY RANK    '+Bk+': BACK');return}
 if(state==='arm'){screenShell('THE ARMORY','KEYS: '+M.keys);
  rowsDraw2(Object.keys(WEAPONS).map(id=>{const w=WEAPONS[id],own=M.weapons.includes(id);
   return{a:(M.weapon===id?'* ':'')+w.n,b:own?'OWNED':w.cost+' KEYS'}}),uiSel,WEAPONS[Object.keys(WEAPONS)[uiSel]].d+(PL.length>1?' Every keeper carries it.':''));
  footer(A+': EQUIP / UNLOCK    '+Bk+': BACK');return}
 if(state==='keep'){screenShell('KEEPSAKE SHELF','ONE AT A TIME  ·  LEVELS BY USE');
  rowsDraw2(KEEPS.map(k=>{const own=M.keeps[k.id];return{a:(M.keepEq===k.id?'* ':'')+k.n,b:own?'Lv'+keepLv(k.who)+'  ·  '+(M.keepXp[k.who]||0)+'/50':'GIFT '+k.who}}),uiSel,KEEPS[uiSel].d);
  footer(A+': EQUIP / REMOVE    '+Bk+': BACK');return}
 if(state==='codex'){screenShell('CODEX OF THE DEEP','< > PAGES  ·  '+(codexPage+1)+' / 6  ·  '+Bk+': BACK');
  if(codexPage===0)rowsPlain(['RUNS '+M.stats.runs+'   DEATHS '+M.stats.deaths,'ESCAPES '+M.stats.escapes+'   CHAMBERS CLEARED '+M.stats.chambers,'FOES FELLED '+M.stats.kills+'   BOSSES '+M.stats.bosses,'HEAT NOW '+heatTotal(),'WEAPON: '+WEAPONS[M.weapon].n,'KEEPSAKE: '+(M.keepEq?((KEEPS.find(k=>k.id===M.keepEq)||{}).n):'NONE')],60,17);
  else if(codexPage===1){const seen=Object.keys(FOES).filter(k=>M.seen[k]);const boss=Object.keys(BOSSES).filter(i=>M.seen[BOSSES[i].id]);
   rowsPlain(['FOES MET '+seen.length+' / '+Object.keys(FOES).length].concat(seen.map(k=>FOES[k].n)).concat(['BOSSES MET '+boss.length+' / 3']).concat(boss.map(i=>BOSSES[i].n)),60,15)}
  else if(codexPage===4){const found=RELICS.filter(r=>M.relic&&M.relic[r.id]);text('RELICS READ  '+found.length+' / '+RELICS.length,PX+14,54,1,'#ffd94d',null);
   if(!found.length)wrapPx('Nothing yet. When a room is quiet, look for something glowing: a tablet, a statue, a cold camp. Walk up to it and press '+A+'.',270,1).forEach((l,i)=>text(l,PX+14,76+i*13,1,'#a89ec2',null));
   const top=clamp(echoSel-6,0,Math.max(0,found.length-13));found.slice(top,top+13).forEach((e,i)=>{const on=top+i===echoSel,yy=70+i*15;hitbox(PX+8,yy-3,284,14,on,()=>echoSel=top+i);if(on){r('#f8e060',PX+8,yy-3,284,14);r('#281c30',PX+9,yy-2,282,12)}
    text(e.n,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);rtext(BIOMES[e.th].n,PX+286,yy,1,on?'#ffd94d':'#6a6284',null)});
   if(found.length)footer(A+': READ    < > PAGES    '+Bk+': BACK')}
  else if(codexPage===5){text('THE STORY SO FAR',PX+14,54,1,'#ffd94d',null);storySoFar().forEach((l,i)=>text(l,PX+14,72+i*14,1,l[0]==='*'?'#a8f080':'#c8c0d8',null))}
  else if(codexPage===2)rowsPlain(['DIFFERENT BOONS OFFERED: '+Object.keys(M.boonSeen).length,'','THE GODS:'].concat(GODIDS.map(g=>GODS[g].n+' — '+GODS[g].t)),60,16);
  else{const found=ECHOES.filter(e=>M.echo[e.id]);text('ECHOES FOUND  '+found.length+' / '+ECHOES.length,PX+14,54,1,'#ffd94d',null);
   if(!found.length)wrapPx('Nothing yet. The keepers before you left notes in the deep. Clear chambers and look for a page that glows.',270,1).forEach((l,i)=>text(l,PX+14,76+i*13,1,'#a89ec2',null));
   const top=clamp(echoSel-6,0,Math.max(0,found.length-13));found.slice(top,top+13).forEach((e,i)=>{const on=top+i===echoSel,yy=70+i*15;hitbox(PX+8,yy-3,284,14,on,()=>echoSel=top+i);if(on){r('#f8e060',PX+8,yy-3,284,14);r('#281c30',PX+9,yy-2,282,12)}
    text(e.n,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);rtext(ECHOTH[e.th],PX+286,yy,1,on?'#ffd94d':'#6a6284',null)});
   if(found.length)footer(A+': READ    < > PAGES    '+Bk+': BACK')}
  return}
 if(state==='board'){const L=openMissions().concat(personalQuests()),done=MISSIONS.filter(m=>M.msn[m.id]).length;screenShell("KEEPER'S BOARD",'ERRANDS DONE  '+done+' / '+MISSIONS.length);
  if(!L.length){ctext('NOTHING PINNED UP. EVERY ERRAND IS DONE.',110,1,'#a8f080',null);footer(Bk+': BACK');return}
  const top=clamp(boardSel-4,0,Math.max(0,L.length-8));
  L.slice(top,top+8).forEach((m,i)=>{const on=top+i===boardSel,yy=56+i*19;hitbox(PX+8,yy-4,284,17,false,()=>boardSel=top+i);const told=m.told||M.flags['mt_'+m.id],q=m.p(),fin=m.fin!==undefined?m.fin:q[0]>=q[1];
   if(on){r('#f8e060',PX+8,yy-4,284,17);r('#281c30',PX+9,yy-3,282,15)}
   r(m.id.startsWith('kq-')?KQUESTS[m.who].col:RDCPLATE[m.who]||'#444',PX+12,yy-1,4,11);text(told?m.n:'? ? ?',PX+21,yy,1,on?'#ffffff':'#c8c0d8',null);
   rtext(!told?'ASK '+m.who:fin?(m.id.startsWith('kq-')?'BRING IT HOME':'TELL '+m.who):q[0]+' / '+q[1],PX+286,yy,1,fin&&told?'#a8f080':on?'#ffd94d':'#8d84a8',null)});
  const m=L[boardSel]||L[0],told=m.told||M.flags['mt_'+m.id];
  wrapPx(told?m.d+(m.id.startsWith('kq-')?'  ('+m.who+"'S QUEST)":'  ('+m.who+')')+'   '+rewTxt(m.rew):m.who+' has something to ask you. Go and talk to '+(m.who==='LOUIE'?'him':m.who)+'.',270,1).slice(0,2).forEach((l,i)=>ctext(l,VH-56+i*12,1,'#a89ec2',null));
  footer(Bk+': BACK');return}
 if(state==='echo'&&echoRead){r('rgba(8,5,12,.82)',0,0,VW,VH);const bw=Math.min(330,VW-20),bx=(VW-bw)/2,by=VH*.2;
  panel(bx,by,bw,150,'#efe2bc','#3a2c18');r('rgba(120,90,40,.18)',bx,by,bw,20);
  ctext(echoRead.src||ECHOTH[echoRead.th],by+5,1,'#7a5a28',null);ctext(echoRead.n,by+26,2,'#3a2414',null);
  wrapPx(echoRead.x,bw-34,1).slice(0,7).forEach((l,i)=>text(l,bx+17,by+50+i*13,1,'#3a2c24',null));
  rtext(echoRead.relic?relicCount()+' / '+RELICS.length:(ECHOES.filter(e=>M.echo[e.id]).length)+' / '+ECHOES.length,bx+bw-10,by+134,1,'#9a7a48',null);
  if(echoT>.3)ctext(A+': KEEP IT',by+160,1,((time*2)|0)%2?'#ffd94d':'#fff3b0','#120a18');return}
 if(state==='heat'){screenShell('THE PACT OF ROOTS','TOTAL HEAT: '+heatTotal());
  if(RD.stats.escapes<1){ctext('SEALED. ESCAPE ONCE TO OPEN.',110,2,'#8d84a8');ctext(A+': BACK',140,1,'#8d84a8',null);return}
  rowsDraw2(PACT.map(px=>({a:px.n,pip:[RD.pact[px.id]||0,px.max],b:''})),heatSel,PACT[heatSel].d+' Bosses pay Dew bounties at new heat.');
  footer('< > ADJUST    '+Bk+': BACK');return}
 if(state==='boon'){r('rgba(10,6,18,.84)',0,0,VW,VH);PX=(VW-300)/2;const god=offerGod||'EMBER';
  ctext(GODS[god].n+' SPEAKS',12,3,GODS[god].l,'#181020');wrapPx('"'+(boonQuote||GODS[god].t+' OFFERS:')+'"',Math.min(VW-20,420),1).slice(0,2).forEach((l,i,a)=>ctext(l,(a.length>1?29:33)+i*11,1,'#a89ec2',null));
  boonOffer.forEach((b,i)=>{const y=52+i*70,on=i===uiSel,gc=GODS[b.god]||GODS.EMBER;hitbox(PX,y,300,62,on,()=>uiSel=i);
   panel(PX,y,300,62,on?'#fff3b0':'#2e2450',on?'#f8e060':'#0c0814');r(gc.c,PX,y,5,62);
   text(boonName(b),PX+13,y+6,2,on?'#281c30':'#e8e4f5',null);
   text((b.kind==='core'?b.slot.toUpperCase()+' BOON':b.kind==='duo'?'DUO BOON':'PASSIVE')+'  ·  '+b.rarN+'  ·  Lv'+b.level,PX+13,y+23,1,on?'#5a4a28':'#a89ec2',null);
   wrapPx(boonDesc(b),278,1).slice(0,2).forEach((l,j)=>text(l,PX+13,y+36+j*12,1,on?'#281c30':'#c8c0d8',null))});
  ctext(stateT<.25?' ':A+': ACCEPT'+(PL.length>1?'  ·  THE WHOLE PARTY SHARES IT':''),VH-22,1,'#8d84a8',null);ownerTag();return}
 if(state==='shop'){screenShell("A ROOT-TOOTH'S STALL",'PETALS: '+RUN.petals);ownerTag();
  rowsDraw2(shopItems.map(it=>({a:it.n,b:it.sold?'SOLD':it.p+'p'})).concat([{a:'LEAVE — ONWARD',b:''}]),uiSel,uiSel<shopItems.length?shopItems[uiSel].d:'Back below. The dark is waiting.');
  footer(A+': BUY    '+Bk+': LEAVE');return}
 if(state==='pause'){r('rgba(8,5,14,.86)',0,0,VW,VH);PX=(VW-300)/2;
  if(pausePage===1){ctext('YOUR BUILD',16,3,'#ffd94d');
   const bs=[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean);
   rowsPlain(bs.length?bs.map(b=>boonName(b)+'  ·  '+(b.kind==='core'?b.slot.toUpperCase():b.kind==='duo'?'DUO':'PASS')+' Lv'+b.level+' '+b.rarN):['NO BOONS YET. THE GODS WATCH.'],50,15);
   const s=rdStats(PL.find(q=>q.dev===menuDev)||PL[0]);ctext('ATTACK x'+(s.dmgMul*s.atkMul).toFixed(2)+'   CAST x'+(s.dmgMul*s.castMul).toFixed(2)+'   CRIT '+Math.round(s.crit*100)+'%   ARMOR '+Math.round(s.armor*100)+'%',VH-44,1,'#a8f080',null);
   ctext(Bk+': BACK',VH-26,1,'#8d84a8',null);return}
  const pp=PL.find(q=>q.dev===menuDev);ctext(PL.length>1&&pp?'P'+(pp.ix+1)+' PAUSED':'PAUSED',22,4,pp&&PL.length>1?PCOL[pp.ix]:'#ffd94d');ctext('CHAMBER '+RUN.chamber+'  ·  '+BIOMES[RUN.biome].n,54,1,'#a89ec2',null);
  const L=pauseItems();drawList(L.map((s,i)=>i===pauseConfirm?'SURE? '+A+' AGAIN':s),pauseSel,80,22);
  ctext('PETALS '+RUN.petals+'  ·  MOONDEW '+RUN.dew+'  ·  KEYS THIS RUN '+RUN.keys,VH-58,1,'#c8c0d8',null);
  const dv=lead0(),tch=dv&&dv.id==='touch';
  ctext(tch?'A HIT (HOLD: HEAVY) · B CAST · SP SPECIAL · SUPER · DASH':dv&&dv.id.slice(0,2)==='kb'?'KEYS: '+btnName(dv,'a')+' HIT (HOLD: HEAVY) · '+btnName(dv,'b')+' CAST · '+btnName(dv,'sp')+' SPECIAL · '+btnName(dv,'sup')+' SUPER · '+btnName(dv,'dash')+' DASH':'PAD: A HIT (HOLD: HEAVY) · B CAST · X SPECIAL · Y SUPER · R DASH',VH-34,1,'#6a6284',null);
  ctext('ATTACK OUT OF A DASH: DASH STRIKE',VH-22,1,'#6a6284',null);return}}
/* in co-op, say whose menu this is */
function ownerTag(){if(PL.length<2||!menuDev)return;const p=PL.find(q=>q.dev===menuDev);if(!p)return;const t='P'+(p.ix+1)+' IS CHOOSING';const w=tw(t,1)+16;r(PCOL[p.ix],VW-w-8,8,w,16);text(t,VW-w,11,1,'#120a18',null)}
function drawSprouts(){const M=RD,A=btnName(lead0(),'a'),Bk=btnName(lead0(),'b');
 if(sprPage===0){screenShell('SPROUT LEDGER','< > EXCHANGE  ·  BANK: '+bankTotal());
  for(let ty=0;ty<6;ty++){const yy=56+ty*22,on=ty===uiSel,T=TYPES[ty];hitbox(PX+8,yy-4,284,20,on,()=>uiSel=ty);
   if(on){r('#f8e060',PX+8,yy-4,284,20);r('#281c30',PX+9,yy-3,282,18)}
   r(T.d,PX+14,yy-1,12,12);r(T.c,PX+15,yy,10,10);r(T.l,PX+16,yy+1,4,2);r('#181020',PX+17,yy+5,2,3);r('#181020',PX+22,yy+5,2,3);
   text(T.n+'  x'+(M.bank[ty]||0),PX+34,yy,1,on?'#ffffff':'#c8c0d8',null);
   const ip=M.party.filter(x=>x===ty).length;rtext(ip?'DIVING x'+ip:'—',PX+286,yy,1,on?'#ffd94d':'#8d84a8',null)}
  wrapPx(SPFX[uiSel]+' '+A+': take buddies into the deep (max 3). They are at risk down there.',270,1).slice(0,2).forEach((l,i)=>ctext(l,VH-56+i*12,1,'#a89ec2',null));
  footer(A+': ADD / REMOVE    '+Bk+': BACK');return}
 screenShell('SPROUT EXCHANGE','< > LEDGER  ·  SPROUTS ARE MONEY HERE');
 const rows=TRADES.map(tr=>({a:'3 '+TYPES[tr.g[0]].n+' > 1 '+TYPES[tr.t[0]].n,b:(M.bank[tr.g[0]]||0)>=3?'READY':'NEED 3'}))
  .concat(SELLS.map(s=>({a:'SELL 1 '+TYPES[s.ty].n,b:'+'+s.dew+' MOONDEW'})));
 rowsDraw2(rows,uiSel,uiSel<TRADES.length?'Trading up the chain: EMBER>ZIP>LUCKY, PEB>DEW>LEAF.':'Moondew buys Mirror ranks. Sprouts buy everything else.');
 footer(A+': TRADE / SELL    '+Bk+': BACK')}

/* CHOOSE YOUR KEEPER: the models stand in the Hearth; this is their lettering */
const CSLOT=i=>({x:W/2+(i-(PL.length-1)/2)*(PL.length>3?52:PL.length>2?62:78),y:H-52});
function sceneChars(dt){setLight([.3,.9,.6],[.85,.72,.6],[.52,.44,.48]);setFog('#120a12',430,820);
 const span=PL.length>2?1:.74;setCam([W/2,36,H+(PL.length<2?86:46+PL.length*14)],[W/2,15,H-56],.62*span+.1);frameBegin();drawRoomMesh('hub');
 for(const s of STATIONS)prop(PROP[s.id],s.x,0,29,0,1.15);lantern(W/2,50,H*.42,1.5);torch(12,40);torch(W-12,40);
 PL.forEach((p,i)=>{const c=CHARS[p.csel],un=charUnlocked(c.id),q=CSLOT(i);shadow(q.x,q.y,7);
  mPush();mT(q.x,.5,q.y);mS(11);drawT(MESH.ring,{c:hex(PCOL[p.ix]),a:p.ready?1:.55,unlit:true,glow:p.ready});mPop();
  drawCast(c.id,q.x,q.y,p.ready?0:Math.sin(time*1.1+i)*.45,{id:'cs'+i,nosit:p.ready,scale:1.5,c:un?null:[.16,.14,.22],weapon:un&&c.id!=='LOUIE'?RD.weapon:null,cheer:p.ready?((time*.85+i*.3)%1)*.84:-1,npc:un?null:'MARCUS'})});
 frameEnd()}
function hudChars(){const n=PL.length,d0=lead0();r('rgba(10,6,16,.82)',0,0,VW,26);ctext('CHOOSE YOUR KEEPER',5,3,'#ffd94d','#403010');
 const colW=Math.min(150,(VW-12)/Math.max(n,1));
 PL.forEach((p,i)=>{const c=CHARS[p.csel],un=charUnlocked(c.id),q=CSLOT(i),top=project(q.x,40,q.y),ft=project(q.x,-3,q.y);if(!top||!ft)return;const x=top.x;
  ctext('P'+(p.ix+1)+'  ·  '+(p.dev.id.slice(0,2)==='gp'?'PAD':p.dev.label),top.y-16,1,PCOL[p.ix],'#120a18',x);
  ctext('< '+c.id+' >',top.y-4,3,un?'#ffffff':'#8d84a8','#120a18',x);
  const cw=n===1?Math.min(360,VW-24):colW-8,stop=VH-34;let y=Math.min(ft.y+2,VH-104);const say=(s,col)=>{for(const l of wrapPx(s,cw,1).slice(0,3)){if(y>stop-24)return;ctext(l,y,1,col,'#120a18',x);y+=11}};
  if(un){say(c.tag+'  ·  '+SIG[c.id].n,'#ffd94d');if(KQUESTS[c.id]){loreInit();const Q=KQUESTS[c.id];say(RD.kqDone[c.id]?'QUEST DONE: '+Q.n+' (+10 HP)':'QUEST: '+Q.n+' '+(RD.kq[c.id]||0)+'/'+Q.steps.length,Q.col)}if(n<3)say(c.stats,'#c8c0d8');if(n===1)say(c.d+' '+SIG[c.id].d,'#c8c0d8')}else{say('LOCKED','#ff9a8a');say(charLockTxt(c.id),'#c8c0d8')}
  if(p.ready)ctext('READY!',y+2,2,'#a8f080','#120a18',x);else ctext(un?btnName(p.dev,'a')+': READY':'',y+2,1,'#ffd94d','#120a18',x)});
 ctext((n<4?(d0&&d0.id==='touch'?'MORE KEEPERS: A ON A CONTROLLER   ·   ':'MORE KEEPERS: PRESS A ON ANOTHER PAD   ·   '):'')+btnName(d0,'b')+': BACK',VH-13,1,'#8d84a8','#120a18');
 if(n>1&&PL.every(p=>p.ready))ctext('DESCENDING TOGETHER...',VH*.36,2,'#a8f080');
 if(joinT>0)banner(joinMsg,VH-44)}

/* ---------------- title / intro / death / escape ---------------- */
function hudTitle(){const g=hx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'rgba(6,4,12,.55)');g.addColorStop(.5,'rgba(6,4,12,0)');g.addColorStop(1,'rgba(6,4,12,.75)');hx.fillStyle=g;hx.fillRect(0,0,VW,VH);
 const lk=Math.min(1,VW/400);logoText('ROOTDEEP',VW/2-22*lk,VH*.12,50*lk);
 hx.save();hx.translate(VW/2+146*lk,VH*.12+30*lk);hx.rotate(-.16);logoText('64',0,-22*lk,44*lk);hx.restore();
 ctext('A  SPROUTS  ROGUELITE  ·  1-4  KEEPERS',VH*.12+62,1,'#c8b8e8','#120a18');
 if(state==='menu'){panel(VW/2-94,VH-150,188,116,'rgba(8,5,14,.82)','#ffd94d');drawList(['TO THE HEARTH',NET.host?'STOP HOSTING':'PLAY ONLINE','INTRO','SETTINGS'],menuSel,VH-138,26);if(joinT>0)banner(joinMsg,VH*.5);return}
 if(state!=='title')return;
 if(RD.stats.runs)ctext('RUNS '+RD.stats.runs+'  ·  ESCAPES '+RD.stats.escapes,VH-66,1,'#8d84a8','#120a18');
 if(((time*2)|0)%2)ctext(touchSeen?'TAP  A  TO  START':'PRESS  START',VH-50,3,'#ffffff');
 ctext('CONTROLLER · KEYBOARD · TOUCH — FIRST TO PRESS IS PLAYER 1',VH-22,1,'#6a6284','#120a18')}
function hudCine(){const sc=RDCINE[rdCineIx];r('#000000',0,0,VW,20);r('#000000',0,VH-20,VW,20);
 if(sc.bg==='door'&&rdCineT>2.1)logoText('ROOTDEEP',VW/2,34,40);
 const seg=sc.d/sc.lines.length,li=Math.min(sc.lines.length-1,Math.floor(rdCineT/seg)),ln=sc.lines[li];
 const bw=Math.min(350,VW-16),bx=(VW-bw)/2,by=VH-74;panel(bx,by,bw,44,'#f4ead2','#281c30');
 if(ln[0]){const pc=RDCPLATE[ln[0]]||'#181020',nw=tw(ln[0],2)+14;r('#181020',bx+6,by-10,nw,17);r(pc,bx+7,by-9,nw-2,15);text(ln[0],bx+13,by-7,2,'#ffffff',null)}
 wrapPx(ln[1],bw-22,1).slice(0,2).forEach((l,i)=>text(l,bx+11,by+12+i*13,1,'#281c30',null));
 rtext(btnName(lead0(),'start')+': SKIP',VW-8,VH-14,1,'#8d84a8',null)}
function hudOver(win){r(win?'rgba(16,24,12,.84)':'rgba(24,8,14,.84)',0,0,VW,VH);const L=RD.lastRun||{chamber:0,kills:0,dew:0,petals:0,heat:0};
 ctext(win?'YOU ESCAPED THE DEEP':'THE DEEP KEEPS YOU',34,4,win?'#ffd94d':'#ff9a8a','#181020');
 ctext(win?escapeLine():deathLine(),66,1,'#c8c0d8',null);
 ctext('REACHED CHAMBER  '+(win?12:L.chamber),100,2,'#ffffff');
 ctext('FOES FELLED  '+L.kills,122,2,'#ffffff');
 ctext('MOONDEW BANKED  +'+L.dew+(L.bonus?'  (+'+L.bonus+' FOR CHAMBERS CLEARED)':''),144,L.bonus?1:2,'#7fd0e8');
 /* co-op: who did what */
 if(L.co&&L.co.length>1)L.co.forEach((c,i)=>ctext('P'+(c.ix+1)+' '+c.char+'   FELLED '+c.kills+'   WENT DOWN '+c.downs,194+i*12,1,PCOL[c.ix]||'#fff','#120a18'));
 if(L.heat)ctext('HEAT '+L.heat,166,1,'#f8a060',null);
 if(L.spr)ctext('SPROUTS BANKED  +'+L.spr,180,1,'#a8f080',null);
 ctext('SPEND IT AT THE MIRROR. GO AGAIN.',VH-52,1,'#a8f080',null);
 if(overT>1.3)ctext(btnName(lead0(),'a')+': THE HEARTH',VH-34,2,((time*2)|0)%2?'#ffffff':'#ffd94d')}
function drawHud(){HIT=[];hx.setTransform(hudS,0,0,hudS,0,0);hx.clearRect(0,0,VW,VH);drawHudInner();hudNet()}
function drawHudInner(){
 switch(state){
 case 'title':case 'menu':hudTitle();return;
 case 'online':hudTitle();drawOnline();return;
 case 'cine':hudCine();return;
 case 'hub':case 'talk':hudHub();return;
 case 'chars':hudChars();return;
 case 'run':hudRun();return;
 case 'pause':case 'boon':case 'shop':if(RUN)hudRun();drawUI();return;
 case 'echo':drawUI();return;
 case 'set':if(setReturn!=='pause')hudTitle();drawUI();return;
 case 'over':hudOver(false);return;
 case 'win':hudOver(true);return;
 default:drawUI()}}
