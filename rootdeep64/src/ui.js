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
const DOORCOL={boon:'#ffd94d',petals:'#f8a0c8',dew:'#7fd0e8',fruit:'#ffb040',heart:'#f85888',shop:'#e8c888',fountain:'#7fd0e8',honey:'#f8b840'};
/* what a device calls its buttons */
function btnName(dev,b){const id=dev?dev.id:'gp';
 if(id==='kb1')return{a:'Z',b:'X',dash:'SHIFT',start:'ENTER'}[b];if(id==='kb2')return{a:',',b:'.',dash:'/',start:'BKSP'}[b];
 return{a:'A',b:'B',dash:id==='touch'?'DASH':'R',start:'START'}[b]}
const lead0=()=>PL[0]?PL[0].dev:null;

/* ---------------- shared menu furniture ---------------- */
let PX=0; /* left edge of the 300-wide menu column */
function screenShell(title,sub){r('rgba(10,6,18,.86)',0,0,VW,VH);PX=(VW-300)/2;panel(PX,8,300,VH-16,'#120c1c','#ffd94d');
 ctext(title,16,3,'#ffd94d','#403010');if(sub)ctext(sub,37,1,'#a89ec2',null)}
function rowsPlain(items,y,step){items.forEach((s,i)=>text(s,PX+14,y+i*step,1,'#c8c0d8',null))}
function rowsDraw2(items,sel,desc){const step=items.length>6?19:22,y0=56;
 items.forEach((it,i)=>{const yy=y0+i*step,on=i===sel;
  if(on){r('#f8e060',PX+8,yy-4,284,step-2);r('#281c30',PX+9,yy-3,282,step-4)}
  if(it.pip){text(it.a,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);pips(it.pip[0],it.pip[1],PX+14+tw(it.a,1)+8,yy+2,'#ffd94d')}
  else text(it.a,PX+14,yy,1,on?'#ffffff':'#c8c0d8',null);
  if(it.b)rtext(it.b,PX+286,yy,1,on?'#ffd94d':'#8d84a8',null)});
 if(desc)wrapPx(desc,270,1).slice(0,2).forEach((l,i)=>ctext(l,VH-56+i*12,1,'#a89ec2',null))}
function footer(s){ctext(s,VH-25,1,'#8d84a8',null)}
function drawList(items,sel,y,step){items.forEach((s,i)=>{const on=i===sel;if(on){const w=tw(s,2)+26;r('#f8e060',VW/2-w/2,y+i*step-3,w,step-3);r('#281c30',VW/2-w/2+1,y+i*step-2,w-2,step-5)}
  ctext(s,y+i*step,2,on?'#ffd94d':'#c8c0d8',on?null:'#120a18')})}

/* ---------------- HUD: the Hearth ---------------- */
function hudHub(){
 for(const s of STATIONS){const q=project(s.x,25,29);if(q){const locked=s.id==='heat'&&RD.stats.escapes<1;ctext(s.l,Math.max(23,q.y-10),1,locked?'#6a6284':'#e8e0f8','#120a18',q.x)}}
 for(const who of NPCS){const n=HUBNPC[who];if(!n)continue;const q=project(n.x,who==='LOUIE'?15:26,n.y);if(q)ctext(who,q.y-11,1,'#c8c0d8','#120a18',q.x)}
 {const q=project(DOOR.x,6,DOOR.y+4);if(q)ctext('DESCEND',q.y,1,'#f8c070','#120a18',q.x)}
 if(PL.length>1)for(const p of PL){const q=project(p.x,27,p.y);if(q)ctext('P'+(p.ix+1),q.y-12,1,PCOL[p.ix],'#120a18',q.x)}
 /* top bar */
 r('rgba(10,6,16,.82)',0,0,VW,19);r('#c8a04a',0,19,VW,1);
 text('DEW '+RD.dew,8,4,1,'#7fd0e8',null);text('KEYS '+RD.keys,78,4,1,'#f8d030',null);text('HONEY '+RD.honey,138,4,1,'#f8a0c8',null);
 if(RD.stats.escapes)rtext('ESCAPES '+RD.stats.escapes,VW-8,4,1,'#f8c070',null);
 if(state==='hub'){let shown=0;for(const p of PL){const t=p.hubT;if(!t)continue;const m=btnName(p.dev,'a')+': '+t.n,w=tw(m,2)+16,y=VH-44-shown*20;
   r('rgba(10,6,16,.88)',VW/2-w/2,y-3,w,18);r(PCOL[p.ix],VW/2-w/2,y-3,3,18);ctext(m,y,2,'#ffd94d');shown++}
  if(PL.length<4)text('MORE KEEPERS: PRESS A ON ANOTHER PAD'+(PL.length===1?' ( , ON KEYS)':''),8,VH-14,1,'rgba(200,192,216,.55)',null);
  rtext(PL.length+' / 4 KEEPERS',VW-8,VH-14,1,'rgba(200,192,216,.7)',null)}
 if(joinT>0)ctext(joinMsg,32,2,'#a8f080');
 if(state==='talk'&&talkNPC){const bx=Math.max(8,VW/2-170),bw=Math.min(340,VW-16),by=VH-84;
  panel(bx,by,bw,76,'#f8f0d8','#181020');
  const nw=tw(talkNPC,2)+14;r('#181020',bx+6,by-9,nw,17);r(RDCPLATE[talkNPC]||'#b8304a',bx+7,by-8,nw-2,15);text(talkNPC,bx+13,by-6,2,'#ffffff',null);
  wrapPx(talkTxt,bw-24,1).slice(0,3).forEach((l,i)=>text(l,bx+12,by+14+i*13,1,'#281c30',null));
  const more=talkStart+talkLine<LINES[talkNPC].length-1,d=lead0();
  text((more?btnName(d,'a')+': MORE':btnName(d,'a')+': BYE')+'  ·  '+btnName(d,'b')+': BYE'+(RD.honey>0?'  ·  '+btnName(d,'start')+': GIFT HONEY ('+RD.honey+')':''),bx+12,by+60,1,'#7a6a8a',null)}}

/* ---------------- HUD: the run ---------------- */
function hudPlayer(p,x,y,right){const s=rdStats(p),w=104;
 panel(x,y,w,31,'rgba(14,9,22,.86)');r(PCOL[p.ix],right?x+w-3:x,y,3,31);
 const tx=x+(right?4:8);
 text('P'+(p.ix+1),tx,y+2,1,PCOL[p.ix],null);text(p.char,tx+17,y+2,1,'#e8e4f5',null);
 if(p.down){rtext(((time*3)|0)%2?'DOWN':'',x+w-8,y+2,1,'#ff7a6b',null)}else rtext(Math.ceil(p.hp)+'/'+s.maxHp,x+w-(right?8:5),y+2,1,'#ffffff',null);
 const bw=w-13;r('#3a1420',tx,y+13,bw,6);r(p.hp/s.maxHp<.3?'#e84a5f':'#58c048',tx,y+13,Math.round(bw*clamp(p.hp/s.maxHp,0,1)),6);
 for(let i=1;i<10;i++)r('rgba(10,6,16,.5)',tx+Math.round(i*bw/10),y+13,1,6);
 let px=tx;px=pips(p.castAmmo||0,1+(hasKeep('stone')?1:0),px,y+21,'#7fd0e8')+5;pips(p.dashCharges||0,s.dashCharges,px,y+21,'#ffd94d')}
function hudRun(){const B=BIOMES[RUN.biome];
 /* world-anchored labels */
 if(RUN.phase==='doors')for(const d of RUN.doors){const q=project(d.x,36,27);if(!q)continue;const lbl=d.kind==='boon'?GODS[d.god].n:d.kind.toUpperCase(),c=d.kind==='boon'?GODS[d.god].l:DOORCOL[d.kind];
  icon(d.kind,q.x,q.y-8,7,c);ctext(lbl,q.y+2,1,'#ffffff','#120a18',q.x)}
 for(const e of RUN.enemies){if(e.kind==='boss'||e.hp>=e.max)continue;const q=project(e.x,(e.kind==='shade'||e.kind==='wisp'?24:17)*(e.elite?1.4:1.1),e.y);if(!q)continue;
  r('#120a18',q.x-11,q.y-2,22,4);r('#e84a5f',q.x-10,q.y-1,Math.round(20*clamp(e.hp/e.max,0,1)),2)}
 for(const p of PL){const q=project(p.x,p.down?12:27,p.y);if(!q)continue;
  if(p.down)ctext('STAND HERE',q.y-12,1,'#a8f080','#120a18',q.x);else if(PL.length>1)ctext('P'+(p.ix+1),q.y-12,1,PCOL[p.ix],'#120a18',q.x)}
 for(const t of RUN.texts){const q=project(t.x,16+(.8-t.t)*10,t.y);if(q)ctext(t.txt,q.y-6,t.txt.length>6?1:2,t.c,'#120a18',q.x)}
 /* keeper panels in the four corners, like a 4-player cartridge */
 const slots=[[6,6,0],[VW-110,6,1],[6,VH-37,0],[VW-110,VH-37,1]];
 PL.forEach((p,i)=>hudPlayer(p,slots[i][0],slots[i][1],slots[i][2]));
 /* the shared purse */
 const solo=PL.length<2,rx=solo?VW-8:VW/2,al=solo?'right':'center';
 const rt='PETALS '+RUN.petals+'   DEW '+RUN.dew+(RUN.keys?'   KEYS '+RUN.keys:'')+(RUN.heat?'   HEAT '+RUN.heat:'');
 text(rt,rx,7,1,'#f8c8e0','#120a18',al);
 if(RUN.buds.length)text('BUDS '+RUN.buds.length+'/6',rx,19,1,'#a8f080','#120a18',al);
 ctext('CH '+RUN.chamber+'/12  ·  '+B.n,VH-(PL.length>2?13:14),1,'#a89ec2','#120a18');
 if(RUN.chamber===1&&RUN.time<7){const d=lead0();ctext(btnName(d,'a')+' HIT  ·  '+btnName(d,'b')+' CAST  ·  '+(d&&d.id==='kb1'?'SHIFT / DOUBLE-TAP':btnName(d,'dash'))+': DASH',VH*.2,1,'rgba(255,255,255,.85)','#120a18')}
 if(RUN.boss&&RUN.boss.hp>0){const bw=Math.min(200,VW-240),bx=(VW-bw)/2,by=PL.length>1?34:22;r('#ffb0a0',bx-1,by-1,bw+2,10);r('#181020',bx,by,bw,8);r('#c22e4a',bx+1,by+1,Math.round((bw-2)*clamp(RUN.boss.hp/RUN.boss.max,0,1)),6);
  ctext(BOSSES[RUN.boss.bossIx].n,by+11,1,'#ffb0a0','#120a18')}
 if(RUN.zoneT>0)logoText(B.n,VW/2,VH*.28,22);
 if(say2T>0)ctext(say2Txt,VH*.44,2,'#ffd94d')}

/* ---------------- screens ---------------- */
function drawUI(){const M=RD,d=lead0(),A=btnName(d,'a'),Bk=btnName(d,'b');
 if(state==='set'){screenShell('SETTINGS','SOUND AND FEEL');
  rowsDraw2([{a:'MUSIC VOL',pip:[M.set.mus,10],b:M.set.mus+' / 10'},{a:'SFX VOL',pip:[M.set.sfx,10],b:M.set.sfx+' / 10'},{a:'SCREEN SHAKE',b:M.set.shake?'ON':'OFF'}],uiSel,['The lantern hum, low under everything.','Every slash, beep and bloom.','The screen kicks when you take a hit.'][uiSel]);
  footer('< > ADJUST  ·  '+A+': CYCLE    '+Bk+': BACK');return}
 if(state==='sprouts'){drawSprouts();return}
 if(state==='mirror'){screenShell('MIRROR OF DEW','MOONDEW: '+M.dew);
  rowsDraw2(MIRROR.map(m=>{const rank=mir(m.id);return{a:m.n,pip:[rank,m.max],b:rank>=m.max?'MAX':m.cost[rank]+' DEW'}}),uiSel,MIRROR[uiSel].d+' Bought with Moondew, kept forever.');
  footer(A+': BUY RANK    '+Bk+': BACK');return}
 if(state==='arm'){screenShell('THE ARMORY','KEYS: '+M.keys);
  rowsDraw2(Object.keys(WEAPONS).map(id=>{const w=WEAPONS[id],own=M.weapons.includes(id);
   return{a:(M.weapon===id?'* ':'')+w.n,b:own?'OWNED':w.cost+' KEYS'}}),uiSel,WEAPONS[Object.keys(WEAPONS)[uiSel]].d+(PL.length>1?' Every keeper carries it.':''));
  footer(A+': EQUIP / UNLOCK    '+Bk+': BACK');return}
 if(state==='keep'){screenShell('KEEPSAKE SHELF','ONE AT A TIME  ·  LEVELS BY USE');
  rowsDraw2(KEEPS.map(k=>{const own=M.keeps[k.id];return{a:(M.keepEq===k.id?'* ':'')+k.n,b:own?'Lv'+keepLv(k.who)+'  ·  '+(M.keepXp[k.who]||0)+'/50':'GIFT '+k.who}}),uiSel,KEEPS[uiSel].d);
  footer(A+': EQUIP / REMOVE    '+Bk+': BACK');return}
 if(state==='codex'){screenShell('CODEX OF THE DEEP','< > PAGES  ·  '+Bk+': BACK');
  if(codexPage===0)rowsPlain(['RUNS '+M.stats.runs+'   DEATHS '+M.stats.deaths,'ESCAPES '+M.stats.escapes+'   CHAMBERS '+M.stats.chambers,'FOES FELLED '+M.stats.kills+'   BOSSES '+M.stats.bosses,'HEAT NOW '+heatTotal(),'WEAPON: '+WEAPONS[M.weapon].n,'KEEPSAKE: '+(M.keepEq?((KEEPS.find(k=>k.id===M.keepEq)||{}).n):'NONE')],60,17);
  else if(codexPage===1){const seen=Object.keys(FOES).filter(k=>M.seen[k]);const boss=Object.keys(BOSSES).filter(i=>M.seen[BOSSES[i].id]);
   rowsPlain(['FOES MET '+seen.length+' / '+Object.keys(FOES).length].concat(seen.map(k=>FOES[k].n)).concat(['BOSSES MET '+boss.length+' / 3']).concat(boss.map(i=>BOSSES[i].n)),60,15)}
  else rowsPlain(['BOONS DISCOVERED: '+Object.keys(M.boonSeen).length,'','THE GODS:'].concat(GODIDS.map(g=>GODS[g].n+' — '+GODS[g].t)),60,16);
  return}
 if(state==='heat'){screenShell('THE PACT OF ROOTS','TOTAL HEAT: '+heatTotal());
  if(RD.stats.escapes<1){ctext('SEALED. ESCAPE ONCE TO OPEN.',110,2,'#8d84a8');ctext(A+': BACK',140,1,'#8d84a8',null);return}
  rowsDraw2(PACT.map(px=>({a:px.n,pip:[RD.pact[px.id]||0,px.max],b:''})),heatSel,PACT[heatSel].d+' Bosses pay Dew bounties at new heat.');
  footer('< > ADJUST    '+Bk+': BACK');return}
 if(state==='boon'){r('rgba(10,6,18,.84)',0,0,VW,VH);PX=(VW-300)/2;const god=boonOffer[0]?boonOffer[0].god:'EMBER';
  ctext(GODS[god].n+' SPEAKS',12,3,GODS[god].l,'#181020');ctext('"'+GODS[god].t+' OFFERS:"',33,1,'#a89ec2',null);
  boonOffer.forEach((b,i)=>{const y=52+i*70,on=i===uiSel,gc=GODS[b.god]||GODS.EMBER;
   panel(PX,y,300,62,on?'#fff3b0':'#2e2450',on?'#f8e060':'#0c0814');r(gc.c,PX,y,5,62);
   text(boonName(b),PX+13,y+6,2,on?'#281c30':'#e8e4f5',null);
   text((b.kind==='core'?b.slot.toUpperCase()+' BOON':b.kind==='duo'?'DUO BOON':'PASSIVE')+'  ·  '+b.rarN+'  ·  Lv'+b.level,PX+13,y+23,1,on?'#5a4a28':'#a89ec2',null);
   wrapPx(boonDesc(b),278,1).slice(0,2).forEach((l,j)=>text(l,PX+13,y+36+j*12,1,on?'#281c30':'#c8c0d8',null))});
  ctext(A+': ACCEPT'+(PL.length>1?'  ·  THE WHOLE PARTY SHARES IT':''),VH-22,1,'#8d84a8',null);return}
 if(state==='shop'){screenShell('A ROOT-TOOTHS STALL','PETALS: '+RUN.petals);
  rowsDraw2(shopItems.map(it=>({a:it.n,b:it.sold?'SOLD':it.p+'p'})).concat([{a:'LEAVE — ONWARD',b:''}]),uiSel,uiSel<shopItems.length?shopItems[uiSel].d:'Back below. The dark is waiting.');
  footer(A+': BUY    '+Bk+': LEAVE');return}
 if(state==='pause'){r('rgba(8,5,14,.86)',0,0,VW,VH);PX=(VW-300)/2;
  if(pausePage===1){ctext('YOUR BUILD',16,3,'#ffd94d');
   const bs=[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean);
   rowsPlain(bs.length?bs.map(b=>boonName(b)+'  ·  '+(b.kind==='core'?b.slot.toUpperCase():b.kind==='duo'?'DUO':'PASS')+' Lv'+b.level+' '+b.rarN):['NO BOONS YET. THE GODS WATCH.'],50,15);
   const s=rdStats(PL[0]);ctext('DMG x'+s.dmgMul.toFixed(2)+'   CRIT '+Math.round(s.crit*100)+'%   ARMOR '+Math.round(s.armor*100)+'%',VH-44,1,'#a8f080',null);
   ctext(Bk+': BACK',VH-26,1,'#8d84a8',null);return}
  ctext('PAUSED',22,4,'#ffd94d');ctext('CHAMBER '+RUN.chamber+'  ·  '+BIOMES[RUN.biome].n,54,1,'#a89ec2',null);
  drawList(['RESUME','BUILD','SETTINGS','ABANDON RUN','QUIT TO TITLE'],pauseSel,84,24);
  ctext('PETALS '+RUN.petals+'  ·  DEW '+RUN.dew+'  ·  KEYS '+RUN.keys,VH-58,1,'#c8c0d8',null);
  ctext('PAD: STICK MOVE · A HIT · B CAST · R DASH      KEYS: Z · X · SHIFT',VH-28,1,'#6a6284',null);return}}
function drawSprouts(){const M=RD,A=btnName(lead0(),'a'),Bk=btnName(lead0(),'b');
 if(sprPage===0){screenShell('SPROUT LEDGER','< > EXCHANGE  ·  BANK: '+bankTotal());
  for(let ty=0;ty<6;ty++){const yy=56+ty*22,on=ty===uiSel,T=TYPES[ty];
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
 const span=PL.length>2?1:.74;setCam([W/2,34,H+46+PL.length*14],[W/2,15,H-56],.62*span+.1);frameBegin();drawRoomMesh('hub');
 for(const s of STATIONS)prop(PROP[s.id],s.x,0,29,0,1.15);lantern(W/2,50,H*.42,1.5);torch(12,40);torch(W-12,40);
 PL.forEach((p,i)=>{const c=CHARS[p.csel],un=charUnlocked(c.id),q=CSLOT(i);shadow(q.x,q.y,7);
  mPush();mT(q.x,.5,q.y);mS(11);drawT(MESH.ring,{c:hex(PCOL[i]),a:p.ready?1:.55,unlit:true,glow:p.ready});mPop();
  drawCast(c.id,q.x,q.y,p.ready?0:Math.sin(time*1.4+i)*.5,{anim:time*9,mv:p.ready,scale:1.5,c:un?null:[.16,.14,.22],weapon:un&&c.id!=='LOUIE'?RD.weapon:null})});
 frameEnd()}
function hudChars(){const n=PL.length,d0=lead0();r('rgba(10,6,16,.82)',0,0,VW,26);ctext('CHOOSE YOUR KEEPER',5,3,'#ffd94d','#403010');
 const colW=Math.min(150,(VW-12)/Math.max(n,1));
 PL.forEach((p,i)=>{const c=CHARS[p.csel],un=charUnlocked(c.id),q=CSLOT(i),top=project(q.x,40,q.y),ft=project(q.x,-3,q.y);if(!top||!ft)return;const x=top.x;
  ctext('P'+(i+1)+'  ·  '+p.dev.label,top.y-16,1,PCOL[i],'#120a18',x);
  ctext('< '+c.id+' >',top.y-4,3,un?'#ffffff':'#8d84a8','#120a18',x);
  let y=ft.y+2;const say=(s,col)=>{wrapPx(s,colW-8,1).slice(0,3).forEach(l=>{ctext(l,y,1,col,'#120a18',x);y+=11})};
  if(un){say(c.tag,'#ffd94d');say(SIG[c.id].n,'#7fd0e8');if(n<3)say(c.stats,'#c8c0d8')}else{say('LOCKED','#ff9a8a');say(charLockTxt(c.id),'#c8c0d8')}
  if(p.ready)ctext('READY!',y+2,2,'#a8f080','#120a18',x);else ctext(un?btnName(p.dev,'a')+': READY':'',y+2,1,'#ffd94d','#120a18',x)});
 if(n===1){const c=CHARS[PL[0].csel],un=charUnlocked(c.id);const bw=Math.min(340,VW-16);
  wrapPx(c.d+' '+(un?SIG[c.id].d:'Unlock to descend as '+c.id+'.'),bw,1).slice(0,2).forEach((l,j)=>ctext(l,VH-40+j*12,1,'#c8c0d8','#120a18'))}
 ctext((n<4?'MORE KEEPERS: PRESS A ON ANOTHER PAD   ·   ':'')+btnName(d0,'b')+': BACK',VH-13,1,'#8d84a8','#120a18');
 if(n>1&&PL.every(p=>p.ready))ctext('DESCENDING TOGETHER...',VH*.36,2,'#a8f080');
 if(joinT>0)ctext(joinMsg,30,2,'#a8f080')}

/* ---------------- title / intro / death / escape ---------------- */
function hudTitle(){const g=hx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'rgba(6,4,12,.55)');g.addColorStop(.5,'rgba(6,4,12,0)');g.addColorStop(1,'rgba(6,4,12,.75)');hx.fillStyle=g;hx.fillRect(0,0,VW,VH);
 logoText('ROOTDEEP',VW/2-22,VH*.12,50);
 hx.save();hx.translate(VW/2+146,VH*.12+30);hx.rotate(-.16);logoText('64',0,-22,44);hx.restore();
 ctext('A  SPROUTS  ROGUELITE  ·  1-4  KEEPERS',VH*.12+62,1,'#c8b8e8','#120a18');
 if(state==='menu'){panel(VW/2-84,VH-128,168,92,'rgba(8,5,14,.82)','#ffd94d');drawList(['TO THE HEARTH','INTRO','SETTINGS'],menuSel,VH-116,26);return}
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
 ctext(win?'DAWN, AND YOUR FACE IS STILL YOURS':'ERIN WILL COME DIGGING. SHE ALWAYS DOES',66,1,'#c8c0d8',null);
 ctext('CHAMBERS REACHED  '+(win?12:L.chamber),100,2,'#ffffff');
 ctext('FOES FELLED  '+L.kills,122,2,'#ffffff');
 ctext('MOONDEW BANKED  +'+L.dew,144,2,'#7fd0e8');
 if(L.heat)ctext('HEAT '+L.heat,166,1,'#f8a060',null);
 if(L.spr)ctext('SPROUTS BANKED  +'+L.spr,180,1,'#a8f080',null);
 ctext('SPEND IT AT THE MIRROR. GO AGAIN.',VH-52,1,'#a8f080',null);
 if(overT>.8&&((time*2)|0)%2)ctext(btnName(lead0(),'a')+': THE HEARTH',VH-34,2,'#ffffff')}
function drawHud(){hx.setTransform(hudS,0,0,hudS,0,0);hx.clearRect(0,0,VW,VH);
 switch(state){
 case 'title':case 'menu':hudTitle();return;
 case 'cine':hudCine();return;
 case 'hub':case 'talk':hudHub();return;
 case 'chars':hudChars();return;
 case 'run':hudRun();return;
 case 'pause':case 'boon':case 'shop':if(RUN)hudRun();drawUI();return;
 case 'set':if(setReturn!=='pause')hudTitle();drawUI();return;
 case 'over':hudOver(false);return;
 case 'win':hudOver(true);return;
 default:drawUI()}}
