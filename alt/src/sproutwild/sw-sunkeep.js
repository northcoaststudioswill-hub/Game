/* ================================================================
   SUNKEEP, LIVED IN (v9.6). Will: better visuals, item placement and
   design, more story triggers, more content inside the slice we have.
   - Props in Sunkeep's empty fields: a stone well, a notice board, two
     benches by the fire, flower beds by the Lantern plaza, a lily pond,
     a fenced lane to the gate, a mushroom ring. Nothing builds on them.
   - The well, the board, the benches and the pond can be used (A).
   - Story beats on things you do: the first night at the fire, the day
     you are strong enough for the castle, stepping into the courtyard,
     your first calmed buddy.
   ================================================================ */
const WPROPS=[{k:'well',x:176,y:162,act:'THE WELL',tall:1,r:16},{k:'board',x:268,y:150,act:'READ THE BOARD',tall:1},
 {k:'bench',x:286,y:204,act:'SIT A WHILE'},{k:'bench',x:338,y:214,act:'SIT A WHILE'},
 {k:'fbed',x:176,y:104},{k:'fbed',x:304,y:104},
 {k:'pond',x:400,y:444,act:'THE POND',r:24},{k:'shrooms',x:70,y:446}];
function wBaseProps(){for(const p of WPROPS)W4.decor.push(Object.assign({prop:1,s:1},p))}
function wPropBlocks(cx,cy){if(W4.sector!=='BASE')return false;for(const p of WPROPS){const rad=p.k==='pond'?40:p.k==='fence'?14:22;if(Math.hypot(cx-p.x,cy-p.y)<rad)return true}return false}
function wPropDraw(d){if(!d.prop)return false;const x=Math.round(d.x),y=Math.round(d.y),K='#14101e';
 if(d.k==='well'){r('rgba(0,0,0,.25)',x-13,y+1,26,5);r(K,x-12,y-12,24,14);r('#8c909c',x-11,y-11,22,12);for(let i=0;i<3;i++)r('#6e7280',x-11,y-8+i*4,22,1);r('#a8acb6',x-11,y-11,22,2);
  r('#1a2a3a',x-8,y-12,16,3);r('#3a6a9a',x-7,y-12,14,1);r(K,x-11,y-30,3,19);r(K,x+8,y-30,3,19);r('#8a6a48',x-10,y-29,1,17);r('#8a6a48',x+9,y-29,1,17);
  r(K,x-14,y-34,28,6);r('#a33b2e',x-13,y-33,26,4);r('#c84030',x-13,y-33,26,1);r('#5a3d22',x-1,y-28,2,8);r('#8a6a48',x-3,y-21,6,4)}
 else if(d.k==='board'){r('rgba(0,0,0,.22)',x-12,y+1,24,4);r(K,x-9,y-6,3,8);r(K,x+6,y-6,3,8);r('#6e5233',x-8,y-5,1,6);r('#6e5233',x+7,y-5,1,6);
  r(K,x-13,y-24,26,19);r('#a87948',x-12,y-23,24,17);r('#c49a62',x-12,y-23,24,2);r('#f8f4e0',x-10,y-20,8,7);r('#f8f4e0',x+1,y-19,8,9);r('#ffe8b0',x-9,y-11,7,5);
  r('#a33b2e',x-7,y-21,2,2);r('#a33b2e',x+4,y-20,2,2);for(let i=0;i<3;i++)r('#c8c0a8',x+2,y-16+i*2,6,1);if(((time*2)|0)%2&&wBoardNew())r('#ffd94d',x+10,y-27,3,3)}
 else if(d.k==='bench'){r('rgba(0,0,0,.2)',x-11,y+1,22,3);r(K,x-11,y-8,22,5);r('#a87948',x-10,y-7,20,3);r('#c49a62',x-10,y-7,20,1);r(K,x-9,y-3,3,5);r(K,x+6,y-3,3,5);r(K,x-11,y-14,22,4);r('#8a6a48',x-10,y-13,20,2)}
 else if(d.k==='fbed'){r(K,x-13,y-5,26,9);r('#5a3820',x-12,y-4,24,7);r('#3d2c1a',x-12,y+1,24,2);
  for(let i=0;i<5;i++){const fx=x-10+i*5,c=['#f078c0','#ffd94d','#e04838','#b090e8','#fff3b0'][i];r('#35702c',fx,y-7,1,4);r(c,fx-1,y-10,3,3);r('#ffffff',fx,y-9,1,1)}}
 else if(d.k==='pond'){r('#2c5a2a',x-25,y-12,50,24);r('#2e6c9a',x-23,y-11,46,22);r('#2e6c9a',x-25,y-8,50,16);r('#4a8cc0',x-21,y-9,40,3);
  for(const [lx,ly] of [[-12,-2],[6,3],[14,-5]]){r('#3f8a38',x+lx-3,y+ly-2,7,5);r('#58b848',x+lx-2,y+ly-2,5,3);r('#2e6c9a',x+lx,y+ly-2,1,2)}
  r('#f078c0',x+5,y+1,2,2);for(const [rx,ry] of [[-25,-6],[-24,4],[23,-3],[22,6]]){r('#2e6a2a',x+rx,y+ry-6,1,7);r('#3f8a38',x+rx+2,y+ry-4,1,5);r('#8a5a28',x+rx,y+ry-7,1,2)}
  if(((time*.7)|0)%5===0){const k=(time*.7)%1;g.globalAlpha=1-k;r('#bfe0f8',x-6-k*6,y-1,12+k*12,1);g.globalAlpha=1}}
 else if(d.k==='shrooms'){for(let i=0;i<7;i++){const a=i*.9,mx=Math.round(x+Math.cos(a)*14),my=Math.round(y+Math.sin(a)*7);r('#e8e0c8',mx,my-3,2,3);r(i%2?'#c84030':'#e8a040',mx-2,my-6,6,3);r('#ffffff',mx-1,my-6,1,1)}}
 else if(d.k==='fence'){r(K,x-2,y-12,5,14);r('#8a6a48',x-1,y-11,3,12);r('#a87948',x-1,y-11,3,1);r(K,x-2,y-9,5,1)}
 return true}
/* using them */
function wBoardNew(){return(SW.boardSeen||0)<wBoardKey()}
function wBoardKey(){return(SW.quest>=5?1:0)+SW.badges.length*2+(SW.bottieSeen?1:0)+(SW.shown>=10?1:0)}
function wBoardNotes(){const n=[],q=(()=>{try{return wQuestText()}catch(e){return''}})();
 if(q)n.push({who:'NOTICE BOARD',txt:'TODAY: '+q});
 if(SW.quest<5)n.push({who:'NOTICE BOARD',txt:'WANTED: one cottage. Eight wood. Ask a buddy to chop, the sprouts will carry it. -- Marcus'});
 else if(!SW.badges.length)n.push({who:'NOTICE BOARD',txt:"The castle in Squire's Woods has gone dark. Its gatehouse got up and walked. Stone hates water and leaves. -- Erin"});
 else n.push({who:'NOTICE BOARD',txt:'THE CASTLE IS CALM! One Sigil home. Crooked Hollow next, east of the Meadow. -- Erin'});
 if(SW.bottieSeen)n.push({who:'NOTICE BOARD',txt:'If a robot asks for the Lantern, the answer is no. -- The Management (Marcus)'});
 n.push({who:'NOTICE BOARD',txt:(SW.shown||0)<10?'LIGHT SHOWN: '+(SW.shown||0)+'. The Lantern grows a ring at 10.':'LIGHT SHOWN: '+SW.shown+'. The Lantern has grown '+Math.floor(SW.shown/10)+' ring'+(SW.shown>=20?'s':'')+'.'});
 n.push({who:'NOTICE BOARD',txt:'(pinned under everything, very old:) This valley was promised to sprouts and buddies. Keep the promise. -- the first keeper'});
 return n}
function wPropUse(d){if(d.k==='board'){SW.boardSeen=wBoardKey();scStart(wBoardNotes().map(s=>Object.assign({x:d.x,y:d.y},s)),()=>swSave());return}
 if(d.k==='well'){if(SW.wellDay!==(SW.day||1)){SW.wellDay=SW.day||1;SW.hearts=(SW.hearts||0)+1;SW.heartsTotal=(SW.heartsTotal||0)+1;swSay('You drop a pebble in. Plink. Somewhere far below, a sprout giggles. +1 heart',3.2);swSnd(1175,.06,1568);swSave()}
  else swSay('Plink. The well has given today. Come back tomorrow.',2.4);return}
 if(d.k==='bench'){const hurt=SW.party.some(m=>m.hp<wStats(m).max);for(const m of SW.party)m.hp=wStats(m).max;
  swSay(wDark()>.5?'You sit by the fire. The Lantern hums. Your buddies doze off and wake up rested.':hurt?'You sit a while. Your buddies flop down in the grass and get their breath back.':'You sit a while. Louie puts his head on your knee.',3.2);if(hurt)swSnd(880,.08,1175);return}
 if(d.k==='pond'){const L=['Lily pads. A frog that is definitely not a buddy stares at you.','The water shows the Lantern upside down. It looks just as proud.','A ripple. Something small and orange darts under a lily pad.'];swSay(L[(SW.pondN=(SW.pondN||0)+1)%L.length],3);return}}
/* ---- story beats on things you do ---- */
function wStoryBeats(){wPlotSync();{const cot=SW.buildings.some(b=>b.k==='cottage'&&!b.con);if((SW.day||1)===1&&!cot)W4.dayT=Math.min(W4.dayT||0,170); /* v9.7: the first day lasts until there is a roof */
  if(cot&&!SW.lessons.cotDay){SW.lessons.cotDay=1;if((SW.day||1)===1)W4.dayT=Math.min(W4.dayT||0,95)}} /* ...and then a good afternoon before the first evening */
 if(SW.party.length&&!SW.lessons.scSend){SW.lessons.scSend=1} /* v9.7: Erin teaches sending a buddy at a tree in the Meadow; no second lesson at home */
 if(SCOFF||state!=='g4world'||W4.scene||swBusy()||(W4.scPend&&W4.scPend.length)||(W4.banner&&W4.banner.t>0))return;const L=SW.lessons;
 /* v10.1: after the first defeat, Erin says why (Will) */
 if(L.defeat1===1){L.defeat1=2;scStart([{who:'ERIN',txt:"That one's gone, keeper. The dark had it too deep."},{who:'ERIN',txt:"A buddy you can't show the light stays dark, and a dark buddy keeps the valley dark. Sometimes a battle is the only way to clear it."},{who:'ERIN',txt:"Nobody blames you for it. But catch them when you can. Showing the light is the real job."}],()=>swSave());return}
 /* the first night at home: the fire */
 if(!W4.fld&&W4.sector==='BASE'&&SW.quest>=3&&wDark()>.5&&!L.nightFire){L.nightFire=1;L.night=1;
  scStart([{who:'ERIN',txt:"The sun's going down. Out there the dark is strongest, and the wilds get bolder."},
   {who:'MARCUS',txt:"In here the Lantern keeps it off. Fire's warm, bro. The benches are free."},
   {who:'ERIN',txt:'Sleep in your new cottage to skip to morning. Or sit by the fire with us a while.'},{hold:.3}],()=>swSave());return}
 /* strong enough for the castle */
 const A=FMAPS.SQUIRE.key.A.lv,ld=SW.party[0];
 if(SW.quest>=5&&!SW.badges.length&&ld&&ld.lv>=A-1&&!L.readyCastle&&SW.lessons.scGym){L.readyCastle=1;
  scStart([{who:'MARCUS',txt:ld.sp+' is Lv'+ld.lv+'! Look at you. Castle time, bro.'},{who:'ERIN',txt:wHasDC()?"South through the Meadow to Squire's Woods. A moat, a thorn gate and a boulder stand in the way.":"Build a BUDDY BARN first: 8 stone, 6 wood. Then south through the Meadow to Squire's Woods."}],()=>swSave());return}
 /* the courtyard: the alpha wakes */
 const F=W4.fld;if(F&&F.id==='SQUIRE'&&!L.court&&F.alphas&&F.alphas.length&&P3.x>19*FT&&P3.x<27*FT&&P3.y>FT&&P3.y<8*FT){L.court=1;const al=F.alphas[0];
  scStart([{x:al.x,y:al.y+10,hold:1.0},{x:al.x,y:al.y+10,who:'LOUIE',txt:"Shh. It's waking up..."},
   {x:al.x,y:al.y+10,who:'',txt:'STONESQUIRE stirs. Dark pours off it like smoke off a candle.'},
   {x:al.x,y:al.y+10,who:'LOUIE',txt:'Walk up and press A. Throw sprouts if it gets rough. I believe in you. Woof.'},{hold:.3}],()=>swSave());return}
 /* the first buddy you calm */
 if((SW.shown||0)>=1&&!L.firstLight){L.firstLight=1;if((SW.walk2||0)<10)return; /* Erin's Meadow walk says it herself */
  scStart([{who:'ERIN',txt:'Did you see that? The dark broke right off it. That is the whole job, keeper.'},{who:'MARCUS',txt:'One down. Whole valley to go. I believe they call that a backlog, bro.'}],()=>swSave());return}}
/* ================================================================
   THE GARDEN THAT GROWS (v9.7). Will: the plots are not all
   functional and have no room to grow. Up to 12 plots, four columns
   either side of the lane that now runs straight through the garden,
   three rows. 6 to start, 8 with the cottage, 12 at Sunkeep Lv2.
   Plots not open yet are staked out with string, so you can see
   where the garden is going. New plots really appear when they open
   (the old garden only ever made its plots once).
   ================================================================ */
WPLOTS.length=0;for(const y of [342,366,390])for(const x of [214,266,186,294])WPLOTS.push([x,y]);
function wPlotCount(){return 6+(SW.buildings.some(b=>b.k==='cottage'&&!b.con)?2:0)+(SW.baseLv>=2?4:0)}
function wPlotSync(){if(W4.fld||!W4.patchBuds||!W4.patchBuds.length)return;const n=wPlotCount();
 while(W4.patchBuds.length<n){const [x,y]=WPLOTS[W4.patchBuds.length];W4.patchBuds.push({sx:x,sy:y,x,y,type:-1,age:-4,stage:0,mode:'soil',item:false,tx:0,ty:0,dlv:0,seedTy:null,by:null,forPlot:null,bush:null,itemTy:0,t:0});
  if(!SCOFF){W4.floats.push({x,y:y-12,txt:'NEW PLOT',t:1.8,c:'#7ee787'});swSnd(784,.06,1175)}}}
function wGardenBake(R,B,path){const n=wPlotCount(),K='#14101e';
 R('#5a8a3a',166,328,148,76);path(WW/2-9,324,18,84);                       /* grass bed, and the lane runs through */
 const post=(x,y)=>{R(K,x-1,y-1,5,10);R('#6e5233',x,y,3,8);R('#8a6a48',x,y,3,1)};
 for(let x=168;x<310;x+=6){if(x>222&&x<254)continue;R('#8a6a48',x,331,6,2);R('#a87948',x,331,6,1);R('#8a6a48',x,397,6,2);R('#a87948',x,397,6,1)}  /* rails, with gaps for the lane */
 R('#8a6a48',168,331,2,68);R('#8a6a48',310,331,2,68);
 for(const x of [167,196,222,254,282,309]){post(x,326);post(x,392)}post(167,360);post(309,360);
 WPLOTS.forEach(([px,py],i)=>{if(i<n){R('#4a3520',px-12,py-7,24,15);R('#6a4a2c',px-11,py-6,22,13);R('#8a6238',px-11,py-6,22,2);R('#5a3d24',px-8,py-1,16,2);R('#5a3d24',px-8,py+3,16,2)}
  else{for(const [cx,cy] of [[-11,-6],[10,-6],[-11,6],[10,6]]){R(K,px+cx,py+cy-3,2,5);R('#c8b088',px+cx,py+cy-3,1,4)}R('#e8dcc0',px-10,py-6,20,1);R('#e8dcc0',px-10,py+6,20,1);R('#e8dcc0',px-11,py-5,1,11);R('#e8dcc0',px+10,py-5,1,11)}});
 if(n<WPLOTS.length){const [lx,ly]=WPLOTS[Math.min(WPLOTS.length-1,n)];R(K,lx-9,ly-14,19,8);R('#c49a62',lx-8,ly-13,17,6);R('#5a3d24',lx-6,ly-11,13,1);R('#5a3d24',lx-6,ly-9,10,1)}}
