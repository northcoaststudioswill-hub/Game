/* ================================================================
   SAVE FILES (Fable, v5.8)
   Three files. The title screen opens a file list: pick one to
   CONTINUE, pick an empty one for a NEW GAME, SELECT erases (asks
   first). START > SAVE AND QUIT returns to the title. Every save
   is cleaned on load, so a save from an older build, or a damaged
   one, can never crash the game: unknown buddies, buildings and
   sectors are dropped and missing fields are filled in.
   File 1 is the save older builds used ('sproutwild-v1').
   ================================================================ */
var WSLOTS=['sproutwild-v1','sproutwild-s2','sproutwild-s3'],wSlot=0;
function wNormalize(j){const D=SWDEF(),S=Object.assign(SWDEF(),(j&&typeof j==='object')?j:{});
 for(const k of ['res','buds','tools'])S[k]=Object.assign({},D[k],(S[k]&&typeof S[k]==='object')?S[k]:{});
 for(const k in S.res)if(!(S.res[k]>=0))S.res[k]=0;for(const k in S.buds)if(!(S.buds[k]>=0))S.buds[k]=0;
 S.res.fiber=S.res.fiber||0;S.res.ore=S.res.ore||0;
 for(const k of ['seen','caught','gymDone','visited','talkN','unlocked','asks','lessons','fl','gear'])if(!S[k]||typeof S[k]!=='object'||Array.isArray(S[k]))S[k]={};
 for(const k of ['party','box','badges','buildings','crew','trioPlucked','followers'])if(!Array.isArray(S[k]))S[k]=[];
 const okMon=m=>m&&typeof m==='object'&&wSp(m.sp)&&m.lv>0;S.box=S.box.filter(okMon);S.party=S.party.filter(okMon);while(S.party.length>3)S.box.push(S.party.pop());
 for(const m of S.party.concat(S.box)){m.lv=Math.min(40,m.lv|0);const st=wStats(m);if(!(m.hp>=0))m.hp=st.max;m.hp=Math.min(m.hp,st.max);if(!(m.xp>=0))m.xp=0;
  if(!Array.isArray(m.moves)||!m.moves.length||m.moves.some(id=>!WMOVES[id]))m.moves=wMovesAt(wSp(m.sp),m.lv)}
 S.buildings=S.buildings.filter(b=>b&&wBuildDef(b.k)&&b.gx>=0&&b.gy>=0);for(const b of S.buildings){b.workers=[];if(b.crop&&!wSp(b.crop.sp))b.crop=null}
 S.crew=S.crew.filter(c=>c&&c.type>=0&&c.type<TYPES.length);for(const c of S.crew)if(c.job>=S.buildings.length)c.job=-1;
 for(const ty of S.followers)if(TYPES[ty])S.buds[TYPES[ty].n]++;S.followers=[];
 if(!wSector(S.sector))S.sector='BASE';if(!WKEEPERS[S.keeper])S.keeper='WILL';
 S.quest=Math.max(0,Math.min(5,S.quest|0));S.baseLv=Math.max(1,S.baseLv|0);S.day=Math.max(1,S.day|0);if(!(S.stam>=0))S.stam=100;if(!(S.tonics>=0))S.tonics=0;
 if(!(S.hearts>=0))S.hearts=0;if(!(S.heartsTotal>=0))S.heartsTotal=S.hearts;if(!(S.playT>=0))S.playT=0;S.pouch=Math.max(8,Math.min(24,S.pouch|0||8));if(!Array.isArray(S.craftQ))S.craftQ=[];
 S.craftQ=S.craftQ.filter(q=>q&&WRECIPES.some(rc=>rc.id===q.id));
 if(S.quest>=2||S.tendDone)S.lit=1;
 if(!S.party.length&&S.quest>=2){S.quest=1;S.lit=1;S.tendDone=true} /* a save with no buddy goes back to greeting one */
 if(S.lit){S.tendDone=true;S.tendStage=4}
 if(S.selType==null||!TYPES[S.selType])S.selType=0;if(!S.cmdMode)S.cmdMode='sprout';
 return S}
function wResetWorld(){Object.assign(W4,{sector:'BASE',fld:null,bf:null,wk:[],patchBuds:null,tend:null,groundHearts:[],amb:null,jobPos:null,banner:null,talk:null,cine:null,fetch:null,confirm:null,engage:null,
  cast:null,quips:[],quipQ:[],msg:'',msgT:0,dayT:40,wildCd:0,near:null,wake:0,nodes:[],wilds:[],loose:[],treasure:null,from:null,bushes:null,groundFor:null,prodT:0});W4.floats=[];BT=null}
function wSlotInfo(i){try{const j=JSON.parse(localStorage.getItem(WSLOTS[i])||'null');return j&&j.intro?j:null}catch(e){return null}}
function wLoadSlot(i){wSlot=i;let j=null;try{j=JSON.parse(localStorage.getItem(WSLOTS[i])||'null')}catch(e){}const N=wNormalize(j);for(const k in SW)delete SW[k];Object.assign(SW,N);wResetWorld();return!!(j&&j.intro)} /* same object, new contents: nothing holds a stale save */
SW=wNormalize(SW);
/* ---------------- title: splash, then the file list ---------------- */
function titleUpdate(){const tm=W4.tm|0;if(W4.tsaved>0)W4.tsaved-=1/60;
 if(tm===0){if(pressed('a')||pressed('start')){swSnd(784,.09);W4.tm=1;swSel=wSlot}else if(pressed('b')&&typeof eject==='function'){swSave();eject()}return} /* B on the title: back to the cartridge shelf */
 if(tm===2){if(pressed('a')){try{localStorage.removeItem(WSLOTS[swSel])}catch(e){}swSnd(200,.2,90);W4.tm=1}else if(pressed('b'))W4.tm=1;return}
 swNav(3);if(pressed('b')){W4.tm=0;return}
 if(pressed('sel')&&wSlotInfo(swSel)){W4.tm=2;swSnd(300,.08);return}
 if(pressed('a')||pressed('start')){const had=wLoadSlot(swSel);swSnd(784,.09,1175);W4.tm=0;
  if(!had){W4.introPage=0;W4.introT=0;state='g4intro'}else{wEnterSector(SW.sector||'BASE');state='g4world'}}}
function wTitleFiles(){const K='#14101e',tm=W4.tm|0,pw=W-20,rh=34,ph=3*rh+40,py=Math.max(18,Math.min(Math.round(H*.30),H-ph-6));
 r('rgba(6,8,20,.6)',0,0,W,H);r(K,8,py,pw+4,ph);r('#f8f4e0',10,py+2,pw,ph-4);r('#ffd23f',10,py+2,pw,2);
 text('CHOOSE A FILE',16,py+7,1,'#6a6258',null);
 for(let i=0;i<3;i++){const j=wSlotInfo(i),y=py+20+i*rh,on=i===swSel,lab='FILE '+(i+1),nx=22+tw(lab,1)+8;
  r(on?K:'#d8d0b8',14,y,pw-8,rh-3);r(on?'#fff3b0':'#efe8d0',15,y+1,pw-10,rh-5);if(on)r('#ffd23f',15,y+1,3,rh-5);
  text(lab,22,y+4,1,'#a33b2e',null);
  if(j){const pt=Math.floor((j.playT||0)/60),bud=((j.party||[]).length+(j.box||[]).length),sec=wSector(j.sector)?wSector(j.sector).n:'SUNKEEP BASE';
   text(wFit((j.keeper||'WILL')+' · '+sec,pw+10-nx-14),nx,y+4,1,'#282838',null);
   text(wFit('DAY '+(j.day||1)+' · '+((j.badges||[]).length)+' SIGILS · '+(pt>=60?Math.floor(pt/60)+'h ':'')+(pt%60)+'m',pw-18),22,y+17,1,'#585868',null)}
  else{text('NEW GAME',nx,y+4,1,'#1d7a2a',null);text('an empty file',22,y+17,1,'#98907c',null)}}
 {const cur=wSlotInfo(swSel),hint=wFit(cur?'A PLAY · SELECT ERASE · B BACK':'A NEW GAME · B BACK',pw-10);text(hint,Math.round(W/2-tw(hint,1)/2),py+ph-16,1,'#6a6258',null)}
 if(tm===2){const y=Math.round(H/2-36),t1='ERASE FILE '+(swSel+1)+'?';r('rgba(6,8,6,.7)',0,0,W,H);r(K,16,y,W-32,72);r('#f8f4e0',18,y+2,W-36,68);r('#e04838',18,y+2,W-36,3);
  text(t1,Math.round(W/2-tw(t1,2)/2),y+11,2,'#a33b2e',null);ctext('This cannot be undone.',y+31,1,'#282838',null);text('A  ERASE',30,y+52,1,'#a33b2e',null);text('B  KEEP IT',W-30-tw('B  KEEP IT',1),y+52,1,'#1d5a2a',null)}}
/* ---------------- pause: save and quit ---------------- */
function swPauseUpdate(){const rows=['BUDDIES','BUDDY GUIDE','BUILD','SECTORS','BASE','KEEPER','GUIDE','SAVE AND QUIT','RESUME'];swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='BUDDIES'){swSel=0;state='g4party'}
  else if(r2==='BUDDY GUIDE'){swSel=0;state='g4dex'}
  else if(r2==='BUILD'){if(W4.sector!=='BASE'){swSay('Building happens at Sunkeep Base.',1.8);state='g4world'}else{swSel=0;state='g4build'}}
  else if(r2==='SECTORS'){W4.mapRO=1;swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}
  else if(r2==='BASE'){swSel=0;state='g4base'}
  else if(r2==='KEEPER'){swSel=['WILL','ERIN','MARCUS'].indexOf(SW.keeper);state='g4keeper'}
  else if(r2==='GUIDE'){W4.guidePage=0;state='g4guide'}
  else if(r2==='SAVE AND QUIT'){swSave();swSnd(784,.1,1175);W4.tm=0;W4.tsaved=3;state='g4title'}
  else state='g4world'}}
function drawPause(){swShell('KEEPER MENU','FILE '+(wSlot+1));
 swRows([{a:'BUDDIES',b:SW.party.length+(SW.party.length===1?' buddy':' buddies')},{a:'BUDDY GUIDE',b:Object.keys(SW.caught).length+'/'+WSPECIES.length+' met'},
  {a:'BUILD',b:W4.sector==='BASE'?'at home':'only at home'},{a:'MAP',b:'look only'},{a:'WORK BOARD',b:'Sunkeep Lv'+SW.baseLv},{a:'KEEPER',b:SW.keeper},{a:'GUIDE',b:'how it works'},
  {a:'SAVE AND QUIT',b:'to the title'},{a:'RESUME',b:''}],swSel,
  'Sprouts '+wBudTotal()+'/'+(SW.pouch||8)+' · Tonic '+SW.tonics+' · Berry '+SW.res.berry+' · Ingot '+SW.res.ingot+' · Ore '+(SW.res.ore||0)+' · Fiber '+(SW.res.fiber||0)+'. Saves by itself.')}
