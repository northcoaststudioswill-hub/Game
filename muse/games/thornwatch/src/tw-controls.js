/* ================================================================
   CLANKAWATCH v4 — CONTROLS
   Found by playing it (Nov 18): B sold a sprout if the cursor sat
   on one and changed speed if it did not, so speeding up kept
   selling towers; START on the dawn card started the next night
   before you could build; and picking a different sprout meant
   walking the cursor off the bottom of the board to a strip of
   sixteen tiny cards and back, twelve presses each way.
   Now every button does one thing:
     A      on open ground: opens the PLANT panel right there
            on a sprout: GROW panel      on a keeper: TRAIN, or its
            ability during a night
     B      back out of a panel. At night: speed 1X / 2X / 3X.
            B never sells anything.
     SELECT inside a GROW or TRAIN panel: uproot (sell). At night
            on the field: powers.
     START  begin the night / pause.
   The game is paused while any panel is open.
   ================================================================ */
const TWPACE=1.4; /* 1X runs 40% quicker than v3.7's: a pure time scale, so no balance ratio moves */
function twUproot(t){const i=TWR.towers.indexOf(t);if(i<0)return;const back=twRefund(t);
 TWR.petals+=back;TWR.towers.splice(i,1);twPlantMsg('Uprooted. +'+back+' petals back.');snd(330,.07,220)}
function twUprootHint(t,iy0){const s='SEL: UPROOT +'+twRefund(t)+'P';text(s,W-4-tw(s,1),iy0+3,1,'#ff9a8a')}
/* the guide's gold corners: the open cell nearest a bend. v3.7 used two fixed points, and on a tall
   phone screen the second one sat on the path, so the tutorial pointed at a spot you could not plant on */
function twGuideSpot(){const P=twPathPts(TWMAP,0),b=P.pts[Math.min(P.pts.length-2,TWR.guide<3?1:2)];let best=[TWR.cur.x,TWR.cur.y],bd=1e9;
 for(const x of twCellXs())for(const y of twCellYs()){if(!twSpotOK(x,y))continue;const d=Math.hypot(x-b.x,y-b.y);if(d<bd){bd=d;best=[x,y]}}
 return best}
function twActA(){const t=twTowerAt(TWR.cur.x,TWR.cur.y);
 if(t){if(t.hero>=0){if(TWR.round)twAbilityA(t);else{TWR.train=t;TWR.trainT=0;snd(590,.05)}return}
  TWR.fork=t;TWR.forkSel=0;TWR.forkT=0;snd(590,.05);return}
 if(!twSpotOK(TWR.cur.x,TWR.cur.y)){twPlantMsg("WOOF! Can't plant there!");TWR.shake=Math.max(TWR.shake,1.5);snd(160,.07);return}
 if(!(TWR.sel>=0&&TWR.sel<12))TWR.sel=0;
 if(TWR.guide>0&&TWR.guide<4)TWR.sel=0; /* the first two sprouts are EMBERs: a lone DEW cannot stop night 1 */
 TWR.build={t:0};snd(590,.05)}
function twActB(){if(!TWR.round){twPlantMsg('B speeds time up, once night falls.');return}
 TWR.speed=TWR.speed%3+1;
 twFloat(TWR.cur.x,TWR.cur.y-14,TWR.speed===1?'1X':TWR.speed===2?'>> 2X FAST':'>>> 3X FAST','#fff8e0');
 snd(440+TWR.speed*180,.06)}
function twPlantSel(){const e=TWMENU[TWR.sel],x=TWR.cur.x,y=TWR.cur.y;
 if(e.k==='h'){const hd=TWHERO[e.i];
  if(TWR.towers.some(q=>q.hero===e.i)){twPlantMsg(hd.name+' is already in the garden!');snd(160,.07);return}
  if(TWR.petals<twHeroCost(e.i)){twPlantMsg('Not enough petals for '+hd.name+'!');snd(160,.07);return}
  TWR.petals-=twHeroCost(e.i);
  TWR.towers.push({hero:e.i,type:-1,lv:1,variant:0,cdT:0,abT:0,hl:1,x,y,a:Math.random()*7});twPlanted();
  twPlantMsg(hd.line);snd(784,.09,1175)}
 else{const def=TWT[e.i];
  if(TWR.petals<def.cost){twPlantMsg('Not enough petals for '+TYPES[e.i].n+'!');snd(160,.07);return}
  TWR.petals-=def.cost;
  TWR.towers.push({hero:-1,type:e.i,lv:1,variant:0,cdT:0,abT:0,x,y,a:Math.random()*7});twPlanted();
  snd(660,.07,990);twBurst(x,y-6,TYPES[e.i].c,6)}
 TWR.build=null}
function twBuildInput(dt){const b=TWR.build;b.t+=dt;
 if(TWR.guide>0&&TWR.guide<4&&(pressed('left')||pressed('right')||pressed('up')||pressed('down'))){twPlantMsg('EMBER first! It burns. Press A!');snd(160,.05);return}
 if(pressed('left')){TWR.sel=(TWR.sel+11)%12;snd(520,.03)}
 if(pressed('right')){TWR.sel=(TWR.sel+1)%12;snd(520,.03)}
 if(pressed('up')||pressed('down')){TWR.sel=(TWR.sel+6)%12;snd(520,.03)}
 if(pressed('b')||pressed('start')){TWR.build=null;snd(330,.05);return}
 if(pressed('a')&&b.t>=.13)twPlantSel()}
function twDrawBuild(iy0){r('#14101e',0,iy0,W,42);r('#f8d030',0,iy0,W,1);
 for(let i=0;i<12;i++){const e=TWMENU[i],x=i*20,sel=TWR.sel===i;
  if(sel){r('#3a2f66',x,iy0+1,20,18);r('#fff8e0',x,iy0+18,20,1)}
  if(e.k==='s')g.drawImage(TWTOW[e.i][0],x+3,iy0+2,13,16);
  else{const spr=twHeroSpr(e.i),got=TWR.towers.some(q=>q.hero===e.i);if(got)g.globalAlpha=.3;
   if(spr)g.drawImage(spr,x+4,iy0+3,12,14);g.globalAlpha=1}}
 r('#2c2450',119,iy0+3,1,14);
 const e=TWMENU[TWR.sel],hero=e.k==='h',cost=hero?twHeroCost(e.i):TWT[e.i].cost,nm=hero?TWHERO[e.i].name:TYPES[e.i].n;
 const got=hero&&TWR.towers.some(q=>q.hero===e.i),can=TWR.petals>=cost&&!got;
 text(nm,4,iy0+20,2,hero?'#ffd94d':TYPES[e.i].c);
 const cx2=4+tw(nm,2)+6;text(cost+'P',cx2,iy0+20,2,TWR.petals>=cost?'#f8d030':'#ff6a5e');
 const act=got?'ALREADY PLACED':can?'A: PLANT':'NEED '+(cost-TWR.petals)+' MORE';text(act,W-4-tw(act,1),iy0+21,1,can?'#a8e078':'#ff6a5e');
 const role=hero?TWHERO[e.i].atk:TWT[e.i].role;text(role,4,iy0+32,1,'#c8c0d8');
 text('B: BACK',W-4-tw('B: BACK',1),iy0+32,1,'#b8b0d8')}
function twDrawBar(iy0){r('#14101e',0,iy0,W,42);r(TWR.guide>0?'#f8d030':'#2c2450',0,iy0,W,1);
 const ct=twTowerAt(TWR.cur.x,TWR.cur.y);let l1='',c1='#fff8e0',l2='',c2='#a8e078';
 if(ct&&ct.hero>=0){const hd=TWHERO[ct.hero],hl=ct.hl||1;l1=hd.name+' LV'+hl;c1='#ffd94d';
  if(TWR.round){if(ct.abT>0){l2=hd.ab+' IN '+Math.ceil(ct.abT)+'S';c2='#b8b0d8'}else{l2='A: '+hd.ab+'!';c2='#f8d030'}}
  else l2=hl>=3?'A: LOOK':'A: TRAIN '+(hl===1?120:220)+'P'}
 else if(ct){l1=ct.lv>=3?twGrandN(ct):ct.lv>1&&ct.variant?TWFORK[ct.type][ct.variant-1].n:TYPES[ct.type].n+' LV'+ct.lv;c1=TYPES[ct.type].c;
  const dfl=twDef(ct);
  l2=ct.lv<2?'A: GROW FROM '+Math.min(twForkCost(ct.type,1),twForkCost(ct.type,2))+'P':ct.lv===2?'A: GRAND FORM '+TWGRANDC[ct.type]+'P':'A: LOOK';
  if(dfl.farmAmt>0)l2+=' · MADE '+Math.round(ct.farmMade||0)+'P'}
 else{if(TWR.paused){l1='PAUSED'}
  else if(TWR.guide>0&&TWGUIDE[TWR.guide]){l1=TWGUIDE[TWR.guide];c1='#f8d030'}
  else l1=TWR.round?'DRONES LEFT '+(TWR.creeps.length+TWR.queue.length):'BUILD YOUR GARDEN';
  if(twSpotOK(TWR.cur.x,TWR.cur.y))l2='A: PLANT A SPROUT OR KEEPER';else{l2="CAN'T PLANT ON THIS SPOT";c2='#ff9a8a'}}
 if(tw(l1,2)>W-8)text(l1,4,iy0+4,1,c1);else text(l1,4,iy0+3,2,c1);
 text(l2,4,iy0+17,1,c2);
 if(TWR.round){const s='B: SPEED '+TWR.speed+'X · SEL: POWERS · START: PAUSE';text(s,4,iy0+30,1,'#b8b0d8')}
 else if(((time*2)|0)%2||TWR.guide===4)text('START: BEGIN NIGHT '+TWR.night,4,iy0+30,1,'#f8d030');
 else text('START: BEGIN NIGHT '+TWR.night,4,iy0+30,1,'#b89820')}
