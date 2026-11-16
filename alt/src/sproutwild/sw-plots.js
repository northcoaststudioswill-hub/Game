/* ================================================================
   GARDEN PLOTS (v7.0)
   The garden is the base's one field. Each plot grows ONE thing and
   you choose which: SPROUTS (the default), BERRIES or FIBER REEDS.
   More crops means fewer sprouts, so the plots are the management
   decision. Home buddies speed growth (WATERING / PLANTING) and
   harvest ripe crops; what they pick is carried to the Lantern like
   everything else. The old GARDEN BED building is retired.
   ================================================================ */
const WCROPS={berry:{n:'BERRIES',res:'berry',need:60,yield:2,d:'Fruit for tonics, town requests and the Lantern.'},
 fiber:{n:'FIBER REEDS',res:'fiber',need:90,yield:1,d:'Reeds for rope and seed pouches.'}};
const WBUILD_OLD=WBUILD.splice(WBUILD.findIndex(b=>b.k==='bed'),1);
function wBuildDef(k){return WBUILD.find(b=>b.k===k)||WBUILD_OLD.find(b=>b.k===k)}
function wPlotCount(){return 6+(wHasRoof()?1:0)+(SW.baseLv>=2?1:0)}
function plCrops(){return Object.keys(SW.plotCrop||{}).length}
function plApply(){SW.plotCrop=SW.plotCrop||{};(W4.patchBuds||[]).forEach((pb,i)=>{const c=SW.plotCrop[i];pb.crop=c&&WCROPS[c]&&pb.type<0?c:null;if(pb.crop&&pb.cg==null)pb.cg=0})}
function plSet(pb,crop){SW.plotCrop=SW.plotCrop||{};const i=W4.patchBuds.indexOf(pb);
 if(crop){SW.plotCrop[i]=crop;pb.crop=crop;pb.cg=0;pb.ripe=false;pb.seedTy=null;if(pb.by){pb.by.forPlot=null;pb.by=null}}else{delete SW.plotCrop[i];pb.crop=null;pb.ripe=false}swSave()}
function plRate(){let b=0;if(wHasRoof())for(const w of W4.wk||[])if(w.kind==='b'){const sk=wkSkills(w);b=Math.max(b,sk.WATERING||0,sk.PLANTING||0)}return 1+b*.5}
function plTick(dt){if(!W4.patchBuds)return;if(W4.plotsFor!==W4.patchBuds){plApply();W4.plotsFor=W4.patchBuds}
 const rate=plRate();for(const pb of W4.patchBuds){if(pb.crop&&pb.type<0&&pb.seedTy!=null)pb.seedTy=null; /* a crop plot never takes a seed */
  if(!pb.crop||pb.type>=0||pb.ripe)continue;const C=WCROPS[pb.crop];pb.cg=(pb.cg||0)+dt*rate;
  if(pb.cg>=C.need){pb.ripe=true;W4.floats.push({x:pb.sx,y:pb.sy-16,txt:C.n+' READY',t:1.4,c:'#ffd94d'});swSnd(880,.05,1175)}}}
function plHarvest(pb){const C=WCROPS[pb.crop];if(!C||!pb.ripe)return;pb.ripe=false;pb.cg=0;pb.hBy=null;
 W4.bf.items.push({k:'pel',res:C.res,n:C.yield,w:1,x:pb.sx+(Math.random()*8-4),y:pb.sy+11,car:[]});swSnd(660,.06,990);
 W4.floats.push({x:pb.sx,y:pb.sy-14,txt:'PICKED',t:1,c:'#a0e888'})}
function plDraw(pb){const C=WCROPS[pb.crop];if(!C)return;const x=Math.round(pb.sx),y=Math.round(pb.sy),k=pb.ripe?1:Math.min(1,(pb.cg||0)/C.need),K='#14101e';
 if(pb.crop==='berry'){const h=3+Math.round(k*7),w=5+Math.round(k*7);r(K,x-(w>>1)-1,y-h-1,w+2,h+2);r('#3a7d2e',x-(w>>1),y-h,w,h);r('#58b848',x-(w>>1),y-h,w,2);
  if(k>.5)r('#e04838',x-3,y-h+3,2,2);if(k>.8)r('#e04838',x+1,y-h+5,2,2);if(pb.ripe){r('#ff6858',x-1,y-h+1,2,2);r('#e04838',x+3,y-h+2,2,2)}}
 else{const h=4+Math.round(k*10);for(let i=-1;i<=1;i++){const hh=h-(i?2:0);r(K,x+i*3-1,y-hh-1,3,hh+2);r(pb.ripe?'#d8c878':'#8ab858',x+i*3,y-hh,1,hh);if(k>.7)r('#b08848',x+i*3-0,y-hh-0,1,3)}}
 if(pb.ripe&&((time*3)|0)%2)r('#fff3b0',x+5,y-14,2,2)}
function plotUpdate(){const pb=W4.plotPb,rows=['SPROUTS','BERRIES','FIBER REEDS','LEAVE'];swNav(rows.length);
 if(pressed('b')||!pb){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];if(r2==='LEAVE'){state='g4world';return}
  const crop=r2==='BERRIES'?'berry':r2==='FIBER REEDS'?'fiber':null;plSet(pb,crop);
  swSay(crop?WCROPS[crop].n+' planted. Buddies at home water and pick them.':'This plot grows sprouts again.',2.6);swSnd(660,.08,990);state='g4world'}}
function drawPlot(){const pb=W4.plotPb,cur=pb&&pb.crop,n=(W4.patchBuds||[]).length,cr=plCrops();swShell('GARDEN PLOT',cr+' of '+n+' plots grow crops');
 swRows([{a:'SPROUTS',b:!cur?'growing here':'sprouts grow here'},{a:'BERRIES',b:cur==='berry'?'growing here':'2 every '+WCROPS.berry.need+'s'},
  {a:'FIBER REEDS',b:cur==='fiber'?'growing here':'1 every '+WCROPS.fiber.need+'s'},{a:'LEAVE',b:''}],swSel,
  swSel===0?'Garden sprouts plant seeds here and new sprouts grow. Pluck them when grown.':swSel===1?WCROPS.berry.d+' Takes the plot from sprouts.':swSel===2?WCROPS.fiber.d+' Takes the plot from sprouts.':'Each plot grows one thing. Home buddies with WATERING or PLANTING make crops grow faster.')}
function scPlots(){SW.lessons.scPlot=1;scStart([{hold:.5},{x:240,y:352,hold:1.1},
  {x:240,y:352,who:'ERIN',txt:'Now the garden. Each plot grows one thing: sprouts, berries or fiber reeds.'},
  {x:240,y:352,who:'ERIN',txt:'Stand at an empty plot and press A to choose. More crops means fewer sprouts. Your call.'},
  {x:240,y:352,who:'MARCUS',txt:'Buddies at home water it and pick it. Sprouts carry it. I supervise, bro.'},{hold:.4}],()=>swSave())}
