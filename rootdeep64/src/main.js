/* =====================================================================
   ROOTDEEP 64 — boot, loop, test hooks
   ===================================================================== */
'use strict';
let lastT=0,booted=false;
function frame(ts){const dt=Math.min(.05,Math.max(0,(ts-lastT)/1000)||0);lastT=ts;
 pollInput(dt);if(!window.__hold)gameUpdate(dt); /* __hold: tests freeze the rules and let the animation settle */
 if(RN.ok)drawScene(dt);
 drawHud();
 requestAnimationFrame(frame)}
function boot(){layout();
 if(!RN.ok){document.getElementById('nogl').hidden=false;return}
 glInit();buildMeshes();touchInit();booted=true;requestAnimationFrame(frame)}
/* test hooks, same spirit as the cartridge's window.__g.RDF() */
const RDF={
 join:id=>{const d=DEV[id]||(DEV[id]=mkDev(id,id.toUpperCase()));return joinPlayer(d)},
 start:()=>{if(!PL.length)joinPlayer(DEV.kb1);hubEnter()},
 depart:()=>{if(!PL.length)joinPlayer(DEV.kb1);for(const p of PL){p.char=RD.chars[p.ix]||'WILL'}rdStartRun();state='run'},
 talk:who=>{talkNPC=who;talkStart=0;talkLine=0;talkTxt=LINES[who]?LINES[who][0]:'';state='talk'},open:id=>{uiSel=0;state=id},
 clearRoom:()=>{if(RUN){RUN.wave2=null;for(const e of RUN.enemies.slice())killEnemy(e)}},
 hurt:(n,i)=>{const p=PL[i||0];if(RUN&&p){p.inv=0;p.dashT=0;damagePlayer(p,n)}},
 door:i=>{if(RUN&&RUN.doors[i])doorReward(RUN.doors[i])},
 give:(k,n)=>{RD[k]=(RD[k]||0)+n;rdSave()},
 boss:()=>{if(RUN){RUN.enemies=[];spawnBoss(RUN.chamber>=8?2:RUN.chamber>=4?1:0)}},
 forceBoon:god=>{if(RUN){boonOffer=genOffer(god);uiSel=0;state='boon'}},
 forceShop:()=>{if(RUN){shopItems=genShop();uiSel=0;state='shop'}},
 giveRun:(k,n)=>{if(RUN)RUN[k]=(RUN[k]||0)+n},
 pod:t2=>{if(RUN)RUN.pods.push({type:t2,x:PL[0].x,y:PL[0].y})},
 meter:i=>{const p=PL[i||0];if(p)p.meter=100},
 goto:ch=>{if(RUN){RUN.enemies=[];RUN.wave2=null;RUN.boss=null;RUN.chamber=ch-1;rdNextChamber()}},
 finale:()=>{if(RUN){RUN.enemies=[];RUN.wave2=null;RUN.boss=null;RUN.chamber=11;rdNextChamber()}},
 unlocks:()=>CHARS.map(c=>c.id+':'+(charUnlocked(c.id)?'open':'locked')),
 state:()=>({state,players:PL.map(p=>({ix:p.ix,dev:p.dev.id,char:p.char,hp:Math.round(p.hp),down:!!p.down,meter:Math.round(p.meter||0),spCd:+(p.spCd||0).toFixed(2),x:Math.round(p.x),y:Math.round(p.y),chg:p.dashCharges,ammo:p.castAmmo})),
  run:RUN?{chamber:RUN.chamber,petals:RUN.petals,dew:RUN.dew,enemies:RUN.enemies.length,phase:RUN.phase,buds:RUN.buds.map(b=>b.type),doors:RUN.doors.map(d=>d.kind+(d.kind==='boon'?':'+d.god:'')),
   boons:[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean).map(boonName)}:null,
  meta:{dew:RD.dew,keys:RD.keys,honey:RD.honey,escapes:RD.stats.escapes,deaths:RD.stats.deaths,weapon:RD.weapon,keeps:Object.keys(RD.keeps),heat:heatTotal(),bank:RD.bank}})};
window.__rd={RDF,RD:()=>RD,RUN:()=>RUN,PL,DEV,KEYS,step:(dt,n)=>{for(let i=0;i<(n||1);i++){pollInput(dt);gameUpdate(dt)}},set:(k,v)=>{if(k==='state')state=v}};
boot();
