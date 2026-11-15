/* ================================================================
   SUNKEEP AT WORK (Fable, v5.4) — the base runs like a Palworld camp.
   Everyone you are not adventuring with works at home, on screen:
     · buddies in the box, and party buddies behind your leader,
       walk the base and pick their own jobs
     · sprouts you assign to a building work it and haul for it
   Every worker has WORK SKILLS with levels (1-3). Species bring their
   own; reaching Lv16 or working a lot raises them. Jobs:
     KINDLING kiln · WATERING / PLANTING beds and nursery · MINING quarry
     LUMBERING sawmill · HANDIWORK the Tinker Bench queue
     HAULING carries finished goods to the Lantern · LUCK adds to yields
   Buildings make real pellets that have to be carried home (workers,
   or your own thrown squad). The Tinker Bench is a crafting queue.
   Away from home the old timed tick still pays out.
   ================================================================ */
const WKN={KINDLING:'KINDLE',WATERING:'WATER',PLANTING:'PLANT',QUARRY:'MINE',CHARGE:'CHARGE',FORTUNE:'LUCK',HAULING:'HAUL',HANDIWORK:'CRAFT',LUMBERING:'LUMBER'};
const WKC={KINDLING:'#f07830',WATERING:'#48a0f0',PLANTING:'#58c048',QUARRY:'#98a0b0',CHARGE:'#f0d020',FORTUNE:'#f078c0',HAULING:'#c49a62',HANDIWORK:'#ffd94d',LUMBERING:'#8a5a2c'};
function wkSkills(w){const o={HAULING:1};
 if(w.kind==='s'){const ty=w.ref.type;o[['KINDLING','QUARRY','WATERING','CHARGE','PLANTING','FORTUNE'][ty]]=1;if(ty===4)o.LUMBERING=1;if(ty===3||ty===5)o.HANDIWORK=1}
 else{const sp=wSp(w.ref.sp);for(const k in sp.work)o[k]=sp.work[k];
  if(o.PLANTING)o.LUMBERING=o.PLANTING;if(o.CHARGE)o.HANDIWORK=o.CHARGE;if(o.KINDLING)o.HANDIWORK=Math.max(o.HANDIWORK||0,1);if(o.QUARRY)o.HAULING=2;
  if(w.ref.lv>=16)for(const k in o)o[k]=Math.min(3,o[k]+1)}
 if((w.ref.wxp||0)>=40)for(const k in o)if(k!=='HAULING')o[k]=Math.min(3,o[k]+1);
 return o}
function wkSkillStr(w){const o=wkSkills(w);return Object.keys(o).filter(k=>k!=='HAULING'||o[k]>1).map(k=>WKN[k]+o[k]).join(' ')||'HAUL1'}
function wkBldLv(def,sk){let lv=0;for(const s of def.skill||[])lv=Math.max(lv,sk[s]||0);if(def.k==='sawmill')lv=Math.max(lv,sk.LUMBERING||0);return lv}
function wkName(w){return w.kind==='s'?TYPES[w.ref.type].n+' SPROUT':w.ref.sp}
function wkSync(){const want=[];
 for(const m of SW.party.slice(1).concat(SW.box).slice(0,8))want.push(['b',m]);
 for(const c of SW.crew)if(c.job>=0)want.push(['s',c]);
 const old=W4.wk||[];W4.wk=want.map(([kind,ref],i)=>old.find(w=>w.ref===ref)||{kind,ref,x:284+(i%4)*20,y:158+((i/4)|0)*40,hx:284+(i%4)*20,hy:158+((i/4)|0)*40,task:null,t:Math.random()*1.5,mv:false,fx:1,xpT:0});
 for(const w of old)if(!W4.wk.includes(w)&&w.task&&w.task.it)w.task.it.by=null}
function wkAt(b,k){return(W4.wk||[]).filter(w=>w.task&&w.task.b===b&&(!k||w.task.k===k))}
function wkPick(w){const sk=wkSkills(w),bench=SW.buildings.find(b=>b.k==='bench');
 if(w.kind==='s'){const b=SW.buildings[w.ref.job];if(!b)return null;
  const mine=(W4.bf.items||[]).find(it=>it.from===b&&!it.by&&!it.car.length);if(mine&&(b.out||0)>=2){mine.by=w;return{k:'haul',it:mine}}
  return{k:b.k==='bench'?'craft':b.k==='nursery'?'tend':'bld',b}}
 if(wDark()>.7)return{k:'sleep',t:6};
 if(bench&&!bench.con&&(SW.craftQ||[]).length&&wkAt(bench).length<2)return{k:'craft',b:bench}; /* anyone can lend a hand; the handy ones are much faster */
 let best=null,bl=0;for(const b of SW.buildings){const def=wBuildDef(b.k);if(!def.yields||(b.out||0)>=3||(b.k==='kiln'&&!(SW.res.ore>0)))continue;const lv=wkBldLv(def,sk)||.4,n=wkAt(b).length;if(!b.con&&n<2&&lv-n*.5>bl){bl=lv-n*.5;best=b}}
 if(best)return{k:'bld',b:best};
 for(const b of SW.buildings)if(b.k==='nursery'&&b.crop&&b.crop.stage<3&&(sk.WATERING||sk.PLANTING)&&!wkAt(b).length)return{k:'tend',b};
 const it=(W4.bf.items||[]).find(i2=>!i2.by&&!i2.car.length&&!i2.done);if(it){it.by=w;return{k:'haul',it}}
 return{k:'idle',x:w.hx+(Math.random()*70-35),y:w.hy+(Math.random()*40-10),t:2+Math.random()*3}}
function wkCraftDone(q,bench){const x=wCellX(bench.gx)+10,y=wCellY(bench.gy);let txt='';
 if(q.id==='tonic'){SW.tonics++;txt='TONIC READY!'}
 else if(q.id==='axe'||q.id==='pick'){SW.tools[q.id]=Math.min(3,SW.tools[q.id]+1);txt=(q.id==='axe'?'AXE':'PICKAXE')+' Lv'+SW.tools[q.id]+'!'}
 else if(q.id==='oil'){SW.hearts+=3;SW.heartsTotal+=3;txt='LANTERN OIL: +3 ♥'}
 else if(q.id==='pouch'){SW.pouch=Math.min(24,(SW.pouch||8)+4);txt='SEED POUCH: '+SW.pouch+' SPROUTS WALK WITH YOU'}
 else if(q.id==='rope'){SW.gear=SW.gear||{};SW.gear.rope=1;txt='CLIMBING ROPE! Ledges can be climbed now.'}
 else if(q.id==='charm'){SW.buds.LUCKY=(SW.buds.LUCKY||0)+1;txt='A LUCKY SPROUT JOINS YOU!'}
 W4.floats.push({x,y:y-10,txt,t:2.2,c:'#ffd94d'});swSnd(784,.1,1318);swSave()}
function wkTick(dt){if(!W4.bf)return;wkSync();const bench=SW.buildings.find(b=>b.k==='bench');if(!SW.craftQ)SW.craftQ=[];
 for(const b of SW.buildings){b.busy=0;b.out=0}
 for(const it of W4.bf.items)if(it.from)it.from.out=(it.from.out||0)+1;
 /* you can always work the bench yourself by standing at it */
 if(bench&&SW.craftQ.length&&!wkAt(bench,'craft').some(w=>w.at)&&Math.hypot(P3.x-(wCellX(bench.gx)+10),P3.y-(wCellY(bench.gy)+22))<30){const q=SW.craftQ[0],ns=W4.bf.sq.filter(s=>s.st==='follow').length;q.done+=(1.2+.15*Math.min(8,ns))*dt;bench.busy=1;W4.byHand=.3;if(ns&&((time*4)|0)!==(((time-dt)*4)|0))fSpark(wCellX(bench.gx)+10+(Math.random()*20-10),wCellY(bench.gy)+4-Math.random()*8,'#fff3b0');if(q.done>=q.need){SW.craftQ.shift();wkCraftDone(q,bench)}}
 if(W4.byHand>0)W4.byHand-=dt;
 for(const w of W4.wk){const sk=wkSkills(w),spd=w.kind==='s'?44:56;w.mv=false;w.at=false;
  const go=(x,y,arr)=>{const dx=x-w.x,dy=y-w.y,d=Math.hypot(dx,dy);if(d<=(arr||3))return true;w.x+=dx/d*spd*dt;w.y+=dy/d*spd*dt;w.mv=true;if(Math.abs(dx)>1)w.fx=dx<0?-1:1;return false};
  if(w.kind==='b'&&w.task&&(w.task.k==='bld'||w.task.k==='craft')&&wDark()>.7)w.task=null; /* buddies down tools at night */
  if(!w.task){w.t-=dt;if(w.t<=0){w.task=wkPick(w);w.t=.6}continue}
  const tk=w.task,b=tk.b;
  if(b&&!SW.buildings.includes(b)){w.task=null;continue}
  if(tk.k==='idle'||tk.k==='sleep'){tk.t-=dt;if(tk.k==='idle')go(tk.x,tk.y,4);else go(w.hx,w.hy,4);if(tk.k==='idle'?tk.t<=0:wDark()<.6)w.task=null;continue}
  if(tk.k==='haul'){const it=tk.it;if(!it||it.done||it.car.length||!W4.bf.items.includes(it)){if(it)it.by=null;w.task=null;continue}
   if(!tk.got){if(go(it.x,it.y+4,6))tk.got=1}
   else{if(go(240,106,7)){it.by=null;fDeliver(W4.bf,it);w.task=null;w.ref.wxp=(w.ref.wxp||0)+1}else{it.x=w.x;it.y=w.y-3-(w.kind==='b'?8:4)}}
   continue}
  const slot=wkAt(b).indexOf(w),bx=wCellX(b.gx)+(slot%2?19:1),by=wCellY(b.gy)+25;
  if(!go(bx,by,3))continue;
  w.at=true;w.fx=slot%2?-1:1;b.busy=(b.busy||0)+1;w.xpT+=dt;if(w.xpT>=8){w.xpT=0;w.ref.wxp=(w.ref.wxp||0)+1}
  if(tk.k==='craft'){const q=SW.craftQ[0];if(!q){w.task=null;continue}q.done+=(sk.HANDIWORK||.4)*dt;if(q.done>=q.need){SW.craftQ.shift();wkCraftDone(q,b)}}
  else if(tk.k==='tend'){if(!b.crop||b.crop.stage>=3){if(w.kind!=='s')w.task=null;continue}b.crop.t+=dt*Math.max(sk.WATERING||0,sk.PLANTING||0,.5)}
  else{const def=wBuildDef(b.k),lv=wkBldLv(def,sk)||.4;
   if((b.out||0)>=3){if(w.kind!=='s')w.task=null;else w.task=wkPick(w);continue}
   if(b.k==='kiln'&&!(SW.res.ore>0)){b.busy=0;if(((time*.5)|0)%4===0&&!b.noOre){b.noOre=1;W4.floats.push({x:wCellX(b.gx)+10,y:wCellY(b.gy)-6,txt:'THE KILN NEEDS ORE',t:1.6,c:'#e88'})}else if(((time*.5)|0)%4!==0)b.noOre=0;if(w.kind!=='s'){w.task={k:'idle',x:w.hx,y:w.hy,t:4}}continue}
   b.prog=(b.prog||0)+lv*dt;
   if(b.prog>=16){b.prog=0;if(b.k==='kiln')SW.res.ore--;const luck=wkAt(b).some(w2=>wkSkills(w2).FORTUNE),n=(b.k==='kiln'?1:2)+(lv>=2?1:0)+(luck?1:0)+(SW.keeper==='ERIN'?1:0);
    W4.bf.items.push({k:'pel',res:def.yields,n,w:1,x:wCellX(b.gx)+10+(Math.random()*8-4),y:wCellY(b.gy)+33+(b.out||0)*3,car:[],from:b});
    W4.floats.push({x:wCellX(b.gx)+10,y:wCellY(b.gy)-6,txt:def.yields.toUpperCase()+' READY',t:1.2,c:'#ffd94d'});swSnd(880,.05,1175);
    if(Math.random()<(SW.buildings.some(bb=>bb.k==='statue')?.7:.35)&&(W4.groundHearts||[]).length<8){W4.groundHearts=W4.groundHearts||[];W4.groundHearts.push({x:wCellX(b.gx)+4+Math.random()*12,y:wCellY(b.gy)+38})}
    if(w.kind!=='s')w.task=null}}}}
function wkDraw(front){for(const w of W4.wk||[]){if((w.y>P3.y)!==front)continue;const X=Math.round(w.x),Y=Math.round(w.y),tk=w.task,hop=w.mv?((time*8+X)|0)%2:(w.at?((time*5+X)|0)%2:0);
  if(w.kind==='s')drawBud({x:X,y:Y+2-0,type:w.ref.type,stage:2,z:w.at?hop*2:0,a:X*.37,mv:w.mv,st:'follow',fx:1});
  else{const spr=wSp(w.ref.sp)._spr,sw=spr.ow,sh=spr.oh;r('rgba(0,0,0,.22)',X-7,Y-1,14,3);
   if(w.fx>0&&spr.fable){g.save();g.translate(X+sw/2,Y-sh+2-hop);g.scale(-1,1);g.drawImage(spr.ol,0,0,sw,sh);g.restore()}else g.drawImage(spr.ol,X-sw/2,Y-sh+2-hop,sw,sh)}
  const top=Y-(w.kind==='s'?16:24);
  if(tk&&tk.k==='sleep'&&!w.mv){const z=((time*1.5)|0)%3;text('z',X+6+z*2,top+4-z*3,1,'#d8e8c8',null)}
  else if(w.at&&tk&&tk.b){const key=tk.k==='craft'?'HANDIWORK':tk.k==='tend'?'WATERING':(wBuildDef(tk.b.k).skill||['PLANTING'])[0],c=WKC[tk.b.k==='sawmill'?'LUMBERING':key];
   r('#14101e',X-4,top-7,8,8);r(c,X-3,top-6,6,6);r('#ffffff',X-2,top-5,2,1);if(hop)r('#ffffff',X+5,top+2,2,2)}}}
/* ---------------- buildings: bigger, outlined, alive ---------------- */
function wDrawBuilding(b){if(b.con>0){scConDraw(b);return}wDrawBuilding0(b)}
function wDrawBuilding0(b){const x=wCellX(b.gx),y=wCellY(b.gy),K='#14101e',on=b.busy>0,def=wBuildDef(b.k),t=time;
 r('rgba(0,0,0,.24)',x-4,y+17,30,5);
 if(b.k==='cottage'){r(K,x-4,y-1,28,22);r('#9a9aa2',x+15,y-13,6,9);r(K,x+14,y-14,8,2);r('#c8c8d0',x+15,y-13,2,9);
  r('#e8dcc0',x-3,y+6,26,14);r('#c9b890',x-3,y+16,26,4);r('#8a6a48',x-3,y+6,2,14);r('#8a6a48',x+21,y+6,2,14);r('#8a6a48',x+9,y+6,2,6);
  r(K,x-6,y-9,32,16);r('#8a3a2a',x-5,y-8,30,14);r('#a84a36',x-5,y-8,30,4);r('#c05a40',x-3,y-8,12,2);r('#6a2a1e',x-5,y+3,30,3);for(let i=0;i<5;i++)r('#6a2a1e',x-3+i*6,y-3,1,5);
  r(K,x+6,y+10,8,10);r('#6b4a2b',x+7,y+11,6,9);r('#8a6238',x+7,y+11,2,9);r('#ffd94d',x+11,y+15,1,2);
  r(K,x-1,y+9,6,6);r(wDark()>.3?'#ffd94d':'#9ad0f4',x,y+10,4,4);r('#ffffff',x,y+10,1,1);r(K,x+15,y+9,6,6);r(wDark()>.3?'#ffd94d':'#9ad0f4',x+16,y+10,4,4);
  for(let i=0;i<3;i++){const k=((t*.5+i*.33)%1);g.globalAlpha=.5*(1-k);r('#e8e8f0',x+16+Math.sin(t+i)*2+k*4,y-16-k*14,3+k*3,3+k*3);g.globalAlpha=1}}
 else if(b.k==='bed'||b.k==='nursery'){r(K,x-3,y+5,26,16);r('#8a6238',x-2,y+6,24,14);r('#b0834e',x-2,y+6,24,2);r('#5a3d22',x-2,y+17,24,3);r('#4a3520',x,y+9,20,8);r('#6a4a2c',x,y+9,20,1);
  if(b.k==='bed'){const gk=Math.min(1,(b.prog||0)/16);for(let i=0;i<4;i++){const h=2+Math.round(gk*6)+(i%2);r('#2c6030',x+2+i*5,y+13-h,1,h);r('#58c048',x+1+i*5,y+12-h,3,2);if(gk>.7)r(i%2?'#e04838':'#f078c0',x+1+i*5,y+11-h,2,2)}}
  else{r(K,x-1,y-9,22,3);g.globalAlpha=.22;r('#b0e0f8',x-1,y-7,22,16);g.globalAlpha=1;r('#e8f6ff',x-1,y-7,1,16);r('#e8f6ff',x+20,y-7,1,16);r('#e8f6ff',x+2,y-5,5,1);r('#8a909c',x-1,y-9,22,2);
   if(b.crop){const cs=wSp(b.crop.sp)._spr;if(b.crop.stage===1){r('#2c6030',x+9,y+4,2,6);r('#58c048',x+7,y+3,6,2)}
    else{const s2=b.crop.stage===2?13:18;g.drawImage(cs.ol,x+10-s2/2,y+13-Math.round(s2*cs.oh/cs.ow),s2,Math.round(s2*cs.oh/cs.ow));if(b.crop.stage>=3&&((t*1.4)|0)%2)text('!',x+8,y-20,1,'#ffd94d',K)}}}}
 else if(b.k==='kiln'){r(K,x-3,y-3,26,24);r('#8a4a3a',x-2,y+2,24,18);r('#a85a44',x-2,y+2,24,4);r('#c06a50',x,y+2,8,2);for(let j=0;j<3;j++)for(let i=0;i<4;i++)r('#6e3626',x-2+i*6+(j%2)*3,y+7+j*4,5,1);
  r(K,x+5,y-12,10,12);r('#5c6675',x+6,y-11,8,12);r('#7c8698',x+6,y-11,3,12);r(K,x+4,y-13,12,3);
  r(K,x+4,y+8,12,12);r('#2b1a12',x+5,y+9,10,11);const f=((t*8)|0)%3;r(on?'#ffb040':'#a04020',x+6,y+13-f,8,7+f);r(on?'#fff3b0':'#e2541e',x+8,y+15,4,5);
  if(on){g.globalAlpha=.18;r('#ffb040',x-6,y+4,32,20);g.globalAlpha=1}
  for(let i=0;i<3;i++){const k=((t*(on?.8:.3)+i*.33)%1);g.globalAlpha=(on?.6:.3)*(1-k);r(on?'#4a4450':'#8a8a92',x+8+Math.sin(t*2+i)*2,y-15-k*16,3+k*4,3+k*4);g.globalAlpha=1}}
 else if(b.k==='quarry'){r(K,x-4,y+2,28,19);r('#565f6e',x-3,y+3,26,17);r('#3a4150',x,y+7,20,11);r('#2a303c',x+2,y+10,16,7);
  r(K,x-2,y-4,11,10);r('#98a0b0',x-1,y-3,9,8);r('#dce2ea',x-1,y-3,5,2);r('#6a7284',x+5,y+1,3,4);r(K,x+12,y-1,10,9);r('#7c8698',x+13,y,8,7);r('#c8ccd4',x+13,y,4,2);
  const sw=on?Math.round(Math.sin(t*9)*3):0;r(K,x+7,y-10+sw,2,14);r('#8a6238',x+8,y-9+sw,1,12);r('#c8ccd4',x+4,y-11+sw,8,2);if(on&&sw>1){r('#ffffff',x+5,y+6,2,2);r('#fff3b0',x+11,y+8,1,1)}}
 else if(b.k==='bench'){r(K,x-5,y-11,30,5);r('#8a3a2a',x-4,y-10,28,3);r('#a84a36',x-4,y-10,28,1);r(K,x-4,y-7,3,27);r('#6b4a2b',x-3,y-7,1,26);r(K,x+21,y-7,3,27);r('#6b4a2b',x+22,y-7,1,26);
  r(K,x-2,y+7,24,6);r('#b0834e',x-1,y+8,22,4);r('#d0a468',x-1,y+8,22,1);r('#6b4a2b',x,y+12,3,8);r('#6b4a2b',x+17,y+12,3,8);
  r('#5c6675',x+12,y+3,7,5);r('#98a0b0',x+11,y+2,9,2);const hm=on?Math.round(Math.abs(Math.sin(t*10))*5):0;r('#8a6238',x+3,y+1-hm,1,7);r('#c8ccd4',x+1,y-1-hm,5,3);if(on&&hm<1){r('#fff3b0',x+14,y,2,2);r('#ffffff',x+17,y-2,1,1);r('#ffd94d',x+10,y-1,1,1)}
  const q=(SW.craftQ||[])[0];if(q){r(K,x-4,y+21,28,4);r('#ffd94d',x-3,y+22,Math.round(26*Math.min(1,q.done/q.need)),2)}}
 else if(b.k==='sawmill'){r(K,x-4,y+4,28,17);r('#8a5a2c',x-3,y+5,26,15);r('#b0834e',x-3,y+5,26,2);r('#6b4a2b',x-3,y+16,26,4);
  for(let i=0;i<3;i++){r(K,x-3+i*5,y-3-i*0,6,8);r('#a87948',x-2+i*5,y-2,4,6);r('#e0b880',x-1+i*5,y-1,2,2)}
  const cx=x+16,cy=y+4,a=on?t*14:0;if(g.beginPath){g.fillStyle=K;g.beginPath();g.arc(cx,cy,8,0,7);g.fill();g.fillStyle='#c8ccd4';g.beginPath();g.arc(cx,cy,7,0,7);g.fill();g.fillStyle='#7c8698';g.beginPath();g.arc(cx,cy,2,0,7);g.fill()}
  for(let i=0;i<4;i++){const an=a+i*1.571;r('#5c6675',Math.round(cx+Math.cos(an)*5)-1,Math.round(cy+Math.sin(an)*5)-1,2,2)}if(on)r('#e0b880',x+8+((t*20)|0)%6,y+10,2,1)}
 else if(b.k==='statue'){const fl=.5+.5*Math.sin(t*2.4);r(K,x,y+10,20,11);r('#8a7f6a',x+1,y+11,18,9);r('#b8b09c',x+1,y+11,18,2);r(K,x+4,y+2,12,9);r('#9a8f7a',x+5,y+3,10,8);
  g.globalAlpha=.2+.15*fl;r('#ffd94d',x-2,y-16,24,20);g.globalAlpha=1;r(K,x+4,y-12,12,14);r('#ffd23f',x+5,y-11,10,12);r('#fff2b0',x+7,y-9,6,8);r('#ffffff',x+9,y-7,2,4);r('#b07808',x+5,y-2,10,3)}
 else if(b.k==='pen'){for(const px of [x-3,x+9,x+21]){r(K,px-1,y+1,4,19);r('#8a6238',px,y+2,2,17);r('#b0834e',px,y+2,1,17)}
  r(K,x-3,y+5,26,4);r('#a87948',x-2,y+6,24,2);r(K,x-3,y+12,26,4);r('#a87948',x-2,y+13,24,2);r('#f8d878',x+1,y+16,8,3);r('#e0b850',x+11,y+17,8,2);r('#fff0a8',x+2,y+16,4,1)}
 if(def.yields&&(b.prog||0)>0){r(K,x-3,y+21,26,4);r('#7ee787',x-2,y+22,Math.round(24*Math.min(1,b.prog/16)),2)}
 if(Math.hypot(P3.x-(x+10),P3.y-(y+14))<40){const bnm=def.n,lw=tw(bnm,1)+4;r('rgba(10,14,8,.7)',x+10-lw/2,y+26,lw,9);text(bnm,Math.round(x+10-lw/2+2),y+27,1,'#ffe8b0',null)}}
/* ---------------- the Tinker Bench: a crafting queue ---------------- */
const WRECIPES=[{id:'tonic',n:'TONIC',cost:{berry:3},need:12,d:'Heals a buddy 25 HP.'},{id:'axe',n:'AXE',need:24,d:'Each level: +1 damage to trees. Lv3 also yields +1.'},{id:'pick',n:'PICKAXE',need:24,d:'Each level: +1 damage to rocks. Lv3 also yields +1.'},
 {id:'oil',n:'LANTERN OIL',cost:{wood:2,berry:2},need:10,d:'Burns bright: +3 gratitude hearts.'},{id:'charm',n:'LUCKY CHARM',cost:{ingot:1,berry:5},need:20,d:'A LUCKY sprout hatches from it and joins your pouch.'}];
function wRecipeCost(rc){if(rc.id==='rope'&&((SW.gear&&SW.gear.rope)||(SW.craftQ||[]).some(q=>q.id==='rope')))return null;if(rc.id==='pouch'&&(SW.pouch||8)+4*(SW.craftQ||[]).filter(q=>q.id==='pouch').length>=24)return null;if(rc.cost)return rc.cost;const lv=SW.tools[rc.id]+(SW.craftQ||[]).filter(q=>q.id===rc.id).length;if(lv>=3)return null;const c=wToolCost(rc.id,lv),o={wood:c.w,stone:c.s};if(c.i)o.ore=c.i;return o}
function toolsUpdate(){const n=WRECIPES.length+3;swNav(n);if(!SW.craftQ)SW.craftQ=[];
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){if(swSel===n-1){state='g4world';return}
  if(swSel===n-3){W4.assignB=SW.buildings.findIndex(b=>b.k==='bench');swSel=0;state='g4assign';return}
  if(swSel===n-2){swSel=0;state='g4jobs';return}
  const rc=WRECIPES[swSel],c=wRecipeCost(rc);
  if(!c){swSnd(140,.08);swSay('That is as good as it gets already.',1.6);return}
  if(SW.craftQ.length>=4){swSnd(140,.08);swSay('The bench queue is full (4).',1.6);return}
  if(!wCanPay(c)){swSnd(140,.08);swSay('Not enough: needs '+wCostStr(c)+'.',2.2);return}
  wPay(c);SW.craftQ.push({id:rc.id,need:rc.need,done:0});swSnd(660,.08,990);swSay(rc.n+' queued. Workers with CRAFT build it — or stand at the bench and do it yourself.',3);swSave()}}
function drawTools(){swShell('TINKER BENCH','B  DONE');if(!SW.craftQ)SW.craftQ=[];
 const rows=WRECIPES.map(rc=>{const c=wRecipeCost(rc),tl=rc.id==='axe'||rc.id==='pick';return{a:rc.n+(tl?' Lv'+SW.tools[rc.id]:''),b:c?wCostStr(c)+(wCanPay(c)?'':' ✗'):'MASTERWORK'}});
 rows.push({a:'ASSIGN SPROUTS',b:'pin a sprout here'},{a:'SPROUT JOBS',b:'axe & pick crews'},{a:'LEAVE',b:''});
 const q=SW.craftQ,hand=(W4.wk||[]).filter(w=>wkSkills(w).HANDIWORK).length;
 const qs=q.length?'QUEUE: '+q.map((x,i)=>WRECIPES.find(rc=>rc.id===x.id).n+(i===0?' '+Math.floor(100*x.done/x.need)+'%':'')).join(' · '):'Queue empty.';
 swRows(rows,swSel,(swSel<WRECIPES.length?WRECIPES[swSel].d+' ':'')+qs+' · Buddies at home build it. Stand at the bench and you and your sprouts help.')}
/* ---------------- the work board ---------------- */
function baseUpdate(){const n=(W4.wk||[]).length+1;swNav(n);if(pressed('a')||pressed('b'))state='g4world'}
function drawBase(){swShell('SUNKEEP WORK BOARD','BASE LV '+SW.baseLv);wkSync();
 const ms=WBASEMS[SW.baseLv],done=ms?ms.filter(([k])=>wMissionDone(k)).length:0,rows=[{a:ms?'MISSIONS '+done+'/'+ms.length:'BASE FULLY GROWN',b:'♥ '+SW.hearts+' · AXE '+SW.tools.axe+' PICK '+SW.tools.pick}];
 const job=w=>{const tk=w.task;return!tk?'thinking':tk.k==='sleep'?'asleep':tk.k==='idle'?'resting':tk.k==='haul'?'hauling':tk.k==='craft'?'crafting':tk.k==='tend'?'tending':wBuildDef(tk.b.k).n.toLowerCase()};
 for(const w of W4.wk)rows.push({a:wkName(w)+(w.kind==='b'?' Lv'+w.ref.lv:''),b:job(w)});
 const sel=Math.min(swSel,rows.length-1),w=W4.wk[sel-1];
 swRows(rows,sel,sel===0?(ms?ms.map(([k,l])=>(wMissionDone(k)?'✓ ':'· ')+l).join('  '):'Everything is built. For now.'):
  'SKILLS: '+wkSkillStr(w)+'. Work XP '+(w.ref.wxp||0)+'/40'+((w.ref.wxp||0)>=40?' (skills +1)':'')+'. '+(w.kind==='b'?'Buddies at home pick their own jobs by skill.':'Pinned to its building; it also hauls what it makes.')+(W4.wk.length?'':''))}
