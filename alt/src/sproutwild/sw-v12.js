/* ================================================================
   v12.0: SUNKEEP, REDESIGNED (Will, Nov 17)
   "It feels cluttered and hard to build at. The characters don't
   follow the paths. There are weird looking plots. I like how the
   sprouts grow in the original game in one big thing, and then we
   unlock placeable plots, assign buddies to work them, and level
   gate recipes. I like the furniture. It needs world building,
   lore, and to be clean and good looking."

   - STREETS. One avenue from the Lantern to the south gate and three
     named streets off it: Lantern Row, Field Lane, Gate Lane. The
     old web of lanes is gone. Land between the streets is for
     building, and the build screen tints every free spot green.
   - PEOPLE FOLLOW THE STREETS. Erin, Marcus and the home workers
     walk along the avenue and streets and step off only at the end.
   - THE LANTERN'S SOIL. One big bed, as in Sprouts. Sprouts come up
     anywhere in it. No stakes, no little frames. It grows sprouts
     only.
   - CROP PLOTS are a thing you build and place: berries, and fiber
     reeds from Sunkeep Lv2. Two plots at Lv1, four at Lv2, six at
     Lv3. The best home waterer or planter tends them, and the plot
     says who.
   - RECIPES are gated by Sunkeep's level.
   - LORE. Four things to read: the Lantern plaque, the founders'
     stone, the soil sign, the waystone at the gate.
   ================================================================ */
const WSTREETS=[{n:'LANTERN ROW',y:127,x0:70,x1:410},{n:'FIELD LANE',y:299,x0:40,x1:440},{n:'GATE LANE',y:431,x0:60,x1:420}],WAVE_X=240;
/* ---- roads: the nearest point on a street or the avenue, and a walk between two points that uses them ---- */
function wRoadNear(x,y){let best={x:WAVE_X,y:Math.max(96,Math.min(506,y)),s:-1},bd=Math.hypot(x-best.x,y-best.y);
 WSTREETS.forEach((S,i)=>{const px=Math.max(S.x0,Math.min(S.x1,x)),d=Math.hypot(x-px,y-S.y);if(d<bd){bd=d;best={x:px,y:S.y,s:i}}});return best}
function wRoute(ax,ay,bx,by){if(Math.hypot(ax-bx,ay-by)<56)return[[bx,by]];const A=wRoadNear(ax,ay),B=wRoadNear(bx,by),P=[[A.x,A.y]];
 if(A.s!==B.s||A.s<0){if(A.s>=0)P.push([WAVE_X,A.y]);if(B.s>=0)P.push([WAVE_X,B.y])}
 P.push([B.x,B.y],[bx,by]);return P}
function wRoadStep(o,tx,ty,step){if(W4.sector!=='BASE'||W4.fld){const dx=tx-o.x,dy=ty-o.y,d=Math.hypot(dx,dy)||1,s=Math.min(d,step);o.x+=dx/d*s;o.y+=dy/d*s;return[dx,dy]}
 {const moved=o.rt?Math.hypot((o.rtx||0)-tx,(o.rty||0)-ty):1e9; /* a target that only wobbles keeps its route: only the last step changes (a jittering target used to restart the walk every frame) */
  if(moved>70||!o.rt||!o.rt.length){o.rt=wRoute(o.x,o.y,tx,ty)}else if(moved>0){o.rt[o.rt.length-1]=[tx,ty]}o.rtx=tx;o.rty=ty}
 let left=step,ldx=0,ldy=1;while(left>0&&o.rt.length){const [wx,wy]=o.rt[0],dx=wx-o.x,dy=wy-o.y,d=Math.hypot(dx,dy);if(d<=left+.01){o.x=wx;o.y=wy;left-=d;if(o.rt.length>1)o.rt.shift();else{o.rt[0]=[tx,ty];break}}else{o.x+=dx/d*left;o.y+=dy/d*left;ldx=dx;ldy=dy;left=0}}
 return[ldx,ldy]}
{const _ct=wCastTick;wCastTick=function(dt){const was=(W4.cast||[]).map(c=>[c.x,c.y]);_ct(dt);
  (W4.cast||[]).forEach((c,i)=>{const b=was[i];if(!b||!c.mv)return;const moved=Math.hypot(c.x-b[0],c.y-b[1]);if(moved<=0||moved>8)return;c.x=b[0];c.y=b[1];
   const [dx,dy]=wRoadStep(c,c.tx,c.ty,moved);if(dx||dy)c.dir=Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]})}}
/* ---- the build screen: every free spot is tinted, so you can see where things fit ---- */
function wInStreet(cx,cy){for(const S of WSTREETS)if(cy>S.y-12&&cy<S.y+12&&cx>S.x0-6&&cx<S.x1+6)return true;return false}
{const _cf=wCellFree;wCellFree=function(gx,gy){if(!_cf(gx,gy))return false;const cx=wCellX(gx)+10,cy=wCellY(gy)+10;return!wInStreet(cx,cy)&&!wPropSolid(cx,cy)}}
{const _dp=drawPlace;drawPlace=function(){_dp();const cam=W4.cam||{x:0,y:0};if(!g.save)return;g.save();g.translate(-cam.x,-cam.y);
  for(let gx=0;gx<=22;gx++)for(let gy=0;gy<=23;gy++){const x=wCellX(gx),y=wCellY(gy);if(x<cam.x-20||x>cam.x+W||y<cam.y-20||y>cam.y+H)continue;if(wCellFree(gx,gy)){r('rgba(126,231,135,.16)',x+1,y+1,18,18);r('rgba(126,231,135,.5)',x+9,y+9,2,2)}}
  g.restore()}}
{const _bu=buildUpdate;buildUpdate=function(){if(pressed('a')){const def=WBUILD[swSel];
   if(def&&def.k==='plot'){if(!wHasRoof()){swSnd(140,.08);swSay('A roof first. Build the COTTAGE, then crop plots.',2.2);return}
    const own=SW.buildings.filter(b=>b.k==='plot').length;if(own>=wPlotMax()){swSnd(140,.08);swSay('Sunkeep Lv'+SW.baseLv+' has room for '+wPlotMax()+' crop plots. Raise Sunkeep on the WORK BOARD for more.',3);return}}}
  _bu();
  if(state==='g4place'&&W4.cursor&&!wCellFree(W4.cursor.x,W4.cursor.y)){let best=null,bd=1e9;for(let gx=0;gx<=22;gx++)for(let gy=0;gy<=23;gy++)if(wCellFree(gx,gy)){const d=Math.hypot(wCellX(gx)+10-P3.x,wCellY(gy)+10-P3.y);if(d<bd){bd=d;best={x:gx,y:gy}}}if(best)W4.cursor=best}}} /* the cursor starts on the nearest free spot */
/* ---- crop plots: built and placed ---- */
WBUILD.push({k:'plot',n:'CROP PLOT',cost:{wood:2},d:'A tilled bed for BERRIES, or FIBER REEDS from Sunkeep Lv2. A home buddy that waters or plants tends it.'});
function wPlotMax(){return SW.baseLv>=3?6:SW.baseLv>=2?4:2}
{const _sc=scConStart;scConStart=function(b,def,first){if(b.k==='plot'){b.con=0;b.crop=b.crop||'berry';swSay('CROP PLOT dug. BERRIES are planted. Stand at it and press A to change the crop.',3.6);return}_sc(b,def,first)}}
function wSoilN(){return 6+(SW.buildings.some(b=>b.k==='cottage'&&!b.con)?2:0)+(SW.baseLv>=2?4:0)}
wPlotCount=wSoilN;
function wPbNew(x,y){return{sx:x,sy:y,x,y,type:-1,age:-4,stage:0,mode:'soil',item:false,tx:0,ty:0,dlv:0,seedTy:null,by:null,forPlot:null,bush:null,itemTy:0,t:0}}
wPlotSync=function(){if(W4.fld||!W4.patchBuds||!W4.patchBuds.length)return;const PB=W4.patchBuds,n=wSoilN();
 if(SW.plotCrop&&Object.keys(SW.plotCrop).length){SW.plotCrop={};for(const pb of PB)if(!pb.plotB){pb.crop=null;pb.ripe=false}} /* old saves: the soil grows sprouts only now */
 let soil=PB.filter(p=>!p.plotB).length;while(soil<n&&soil<WPLOTS.length){const [x,y]=WPLOTS[soil++];PB.push(wPbNew(x,y))}
 for(const b of SW.buildings)if(b.k==='plot'&&!b.con&&!PB.some(p=>p.plotB===b)){const pb=wPbNew(wCellX(b.gx)+10,wCellY(b.gy)+12);pb.plotB=b;pb.crop=b.crop=b.crop||'berry';pb.cg=b.cg||0;PB.push(pb)}
 for(let i=PB.length-1;i>=0;i--){const pb=PB[i];if(pb.plotB){if(!SW.buildings.includes(pb.plotB))PB.splice(i,1);else{pb.plotB.cg=pb.cg||0;if(pb.crop!==pb.plotB.crop){pb.crop=pb.plotB.crop;pb.ripe=false}pb.type=-1;pb.seedTy=null}}}};
plCrops=function(){return SW.buildings.filter(b=>b.k==='plot'&&!b.con&&b.crop).length};
plApply=function(){for(const pb of W4.patchBuds||[]){if(pb.plotB){pb.crop=pb.plotB.crop;if(pb.cg==null)pb.cg=pb.plotB.cg||0}else pb.crop=null}};
plSet=function(pb,crop){if(!pb.plotB||!crop)return;pb.plotB.crop=crop;pb.crop=crop;pb.cg=0;pb.ripe=false;swSave()};
function wPlotTender(){let best=null,bl=0;if(wHasRoof())for(const w of W4.wk||[])if(w.kind==='b'){const sk=wkSkills(w),l=Math.max(sk.WATERING||0,sk.PLANTING||0);if(l>bl){bl=l;best=w}}return best}
plotUpdate=function(){const pb=W4.plotPb,rows=['BERRIES','FIBER REEDS','LEAVE'];swNav(rows.length);
 if(pressed('b')||!pb){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];if(r2==='LEAVE'){state='g4world';return}
  if(r2==='FIBER REEDS'&&SW.baseLv<2){swSnd(140,.08);W4.plotMsg='FIBER REEDS need Sunkeep Lv2.';W4.plotMsgAt=time;return}
  const crop=r2==='BERRIES'?'berry':'fiber';plSet(pb,crop);swSay(WCROPS[crop].n+' planted.',2.2);swSnd(660,.08,990);state='g4world'}};
drawPlot=function(){const pb=W4.plotPb,cur=pb&&pb.crop,tn=wPlotTender();swShell('CROP PLOT',plCrops()+' of '+wPlotMax()+' plots');
 swRows([{a:'BERRIES',b:cur==='berry'?'growing here':'2 every '+WCROPS.berry.need+'s'},{a:'FIBER REEDS',b:SW.baseLv<2?'Sunkeep Lv2':cur==='fiber'?'growing here':'1 every '+WCROPS.fiber.need+'s'},{a:'LEAVE',b:''}],swSel,
  W4.plotMsg&&time-W4.plotMsgAt<3?W4.plotMsg:(swSel===0?WCROPS.berry.d:swSel===1?WCROPS.fiber.d:'Each plot grows one crop.')+' '+(tn?'Tended by '+wkName(tn)+': grows '+Math.round((plRate()-1)*100)+'% faster.':'Nobody tends it yet. A home buddy with WATERING or PLANTING will.'))};
{const _db=wDrawBuilding;wDrawBuilding=function(b){if(b.k!=='plot')return _db(b);const x=wCellX(b.gx),y=wCellY(b.gy),K='#14101e';
  r(K,x-1,y+1,22,20);r('#8a6a48',x,y+2,20,18);r('#a87948',x,y+2,20,1);r('#5a3d24',x+2,y+4,16,14);for(let i=0;i<4;i++)r('#6e4a2c',x+2,y+5+i*4,16,1);r('#3d2c1a',x+2,y+16,16,2)}}
/* recipes open with Sunkeep's level */
const WRECLV={tonic:1,rope:1,pouch:2,oil:2,charm:3};
{const _rc=wRecipeCost;wRecipeCost=function(rc){return _rc(rc)}}
{const _tu=toolsUpdate;toolsUpdate=function(){if(pressed('a')&&swSel<WRECIPES.length){const rc=WRECIPES[swSel],lv=WRECLV[rc.id]||1;if(SW.baseLv<lv){swSnd(140,.08);swSay(rc.n+' opens at Sunkeep Lv'+lv+'. Raise Sunkeep on the WORK BOARD.',2.8);return}}_tu()}}
for(const rc of WRECIPES){const lv=WRECLV[rc.id]||1;if(lv>1&&rc.d.indexOf('Sunkeep Lv')<0)rc.d='[Sunkeep Lv'+lv+'] '+rc.d}
/* ---- the soil: one big bed ---- */
wGardenBake=function(R,B,path){const K='#14101e',x0=164,y0=326,w=152,h=80;
 R(K,x0-3,y0-3,w+6,h+6);for(let i=0;i<w+4;i+=8){R('#8c909c',x0-2+i,y0-2,7,3);R('#a8acb6',x0-2+i,y0-2,7,1);R('#8c909c',x0-2+i,y0+h-1,7,3);R('#6e7280',x0-2+i,y0+h+1,7,1)}
 for(let j=0;j<h;j+=8){R('#8c909c',x0-2,y0+j,3,7);R('#8c909c',x0+w-1,y0+j,3,7)}
 R('#5a3d24',x0+1,y0+1,w-2,h-2);R('#6e4a2c',x0+1,y0+1,w-2,2);
 for(let j=0;j<9;j++){const yy=y0+6+j*8;R('#4a3120',x0+3,yy,w-6,2);R('#7a5434',x0+3,yy+2,w-6,1);for(let i=0;i<14;i++)R('#8a6238',x0+6+((i*37+j*19)%(w-14)),yy+4,2,1)}
 for(let i=0;i<10;i++){const sx=x0+8+((i*61)%(w-20)),sy=y0+8+((i*29)%(h-18));R('#a8865c',sx,sy,2,2)}
 for(let yy=y0-2;yy<y0+h+2;yy+=10){R(K,WW/2-8,yy,16,8);R('#a39a86',WW/2-7,yy+1,14,6);R('#b8b09c',WW/2-7,yy+1,14,1)} /* stepping stones: the avenue crosses the soil */
 R(K,x0-2,y0-18,2,16);R(K,x0-12,y0-22,22,11);R('#c49a62',x0-11,y0-21,20,9);R('#5a3d24',x0-9,y0-18,16,1);R('#5a3d24',x0-9,y0-15,12,1)};
/* ---- lore to read ---- */
WPROPS.push({k:'plaque',x:206,y:126,act:'READ THE PLAQUE',r:14},{k:'fstone',x:120,y:160,act:'THE OLD STONE',tall:1,r:16},{k:'soilsign',x:158,y:318,act:'READ THE SIGN',r:14},{k:'waystone',x:296,y:476,act:'THE WAYSTONE',tall:1,r:16});
const WLORE={plaque:['THE GREAT LANTERN. Lit by the first keepers. "While it burns, nothing in this valley grows alone."','Under it, scratched in later with a nail: It cracked the night the Data Center burned. We are still here.'],
 fstone:['SUNKEEP. The first keepers camped here because the soil glowed at night. Three tents and a dream, the Elder says.','Most of the names are worn smooth. One mark is still clear: a pawprint.'],
 soilsign:["THE LANTERN'S SOIL. The light fell here as seeds. Whatever lands in this soil grows legs, sooner or later.",'Underneath, in marker: DO NOT PLANT YOUR BOOTS. I TRIED. -- Marcus'],
 waystone:['SOUTH: the Meadow. Past it, the castle nobody finished. NORTH and WEST: Lantern Town, under the Dome.','Someone has added in chalk: THE DOME IS NOT THE SKY.']};
{const _pu=wPropUse;wPropUse=function(d){if(WLORE[d.k]){scStart(WLORE[d.k].map(txt=>({x:d.x,y:d.y,who:'',txt})));return}_pu(d)}}
{const _pd=wPropDraw;wPropDraw=function(d){if(!d.prop||!WLORE[d.k])return _pd(d);const x=Math.round(d.x),y=Math.round(d.y),K='#14101e';
  if(d.k==='plaque'){r('rgba(0,0,0,.2)',x-9,y+1,18,3);r(K,x-8,y-10,16,12);r('#8c909c',x-7,y-9,14,10);r('#f8e060',x-5,y-7,10,6);r('#b08a20',x-4,y-5,8,1);r('#b08a20',x-4,y-3,6,1)}
  else if(d.k==='fstone'){r('rgba(0,0,0,.25)',x-9,y+1,18,4);r(K,x-8,y-24,16,26);r(K,x-6,y-27,12,4);r('#8c909c',x-7,y-23,14,24);r('#8c909c',x-5,y-26,10,3);r('#a8acb6',x-7,y-23,3,22);r('#6e7280',x-3,y-18,7,1);r('#6e7280',x-3,y-14,5,1);r('#6e7280',x-1,y-8,3,3);r('#58b848',x-7,y-2,5,3);r('#58b848',x+3,y-4,4,5)}
  else if(d.k==='soilsign'){r(K,x-1,y-8,3,10);r('#6e5233',x,y-7,1,8);r(K,x-10,y-18,20,11);r('#c49a62',x-9,y-17,18,9);r('#5a3d24',x-7,y-15,14,1);r('#5a3d24',x-7,y-12,10,1)}
  else{r('rgba(0,0,0,.25)',x-8,y+1,16,4);r(K,x-7,y-20,14,22);r('#a39a86',x-6,y-19,12,20);r('#b8b09c',x-6,y-19,12,2);r(K,x-3,y-15,6,1);r(K,x-1,y-17,2,5);r(K,x-3,y-9,6,1);r('#f4f0ea',x-4,y-6,8,1)}
  return true}}
{const _ps=wPropSolid;wPropSolid=function(x,y){if(_ps(x,y))return true;if(W4.sector!=='BASE')return false;for(const p of WPROPS){if(!WLORE[p.k])continue;const dx=Math.abs(x-p.x),dy=y-p.y;if(dx<8&&dy>-6&&dy<3)return true}return false}}
/* words that named the old garden */
WQUEST[4]='Build a CROP PLOT (START, BUILD)';
{const m=WBASEMS[1]&&WBASEMS[1].find(q=>q[0]==='crop:1');if(m)m[1]='Build a crop plot'}
scPlots=function(){SW.lessons.scPlot=1;scStart([{hold:.5},{x:240,y:352,hold:1.1},
  {x:240,y:352,who:'ERIN',txt:"This is the Lantern's soil. Sprouts come up here on their own. Pluck them when they are grown."},
  {x:240,y:352,who:'ERIN',txt:'Food is different. Build a CROP PLOT anywhere there is room: START, then BUILD. It grows berries.'},
  {x:240,y:352,who:'MARCUS',txt:'Buddies at home water it and pick it. Sprouts carry it. I supervise, bro.'},{hold:.4}],()=>swSave())};

function wPlotLabel(b){const pb=(W4.patchBuds||[]).find(q=>q.plotB===b),C=WCROPS[b.crop]||WCROPS.berry,tn=wPlotTender();
 if(pb&&pb.ripe)return'HARVEST '+C.n;return C.n+' · '+Math.min(99,Math.round(((pb&&pb.cg)||0)/C.need*100))+'%'+(tn?' · '+wkName(tn)+' tends it':' · change crop')}
