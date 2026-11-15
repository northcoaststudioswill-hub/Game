/* ---------- cartridge 4: PATCH & PLATE ---------- */
/* ============================================================
   PATCH & PLATE  -  cartridge 4 for the Pocket Lantern
   Erin's farm stand: plant it, cook it, serve it.
   Built from Erin's own wish list: short days (each one is a level, about
   one to two minutes), no story to remember, D-pad and A/B only, and it
   saves itself: after every day, every few seconds while you play, and the
   moment the phone is put down (the day pauses itself, too).

   Source: v0.3/src/patchplate.js. v0.3/build.py splices it into the console.
   Save: localStorage 'patchplate-v1'. Add new fields with defaults; never
   rename the key or change the format of what's there.
   Test handle: window.__g.PP._
   ============================================================ */
window.PP_CART=function(A){
const W=240,g=A.g,r=A.r,text=A.text,tw=A.tw,keys=A.keys,pressed=A.pressed,mk=A.mk,flip=A.flip;
const snd=(...a)=>{try{A.snd(...a)}catch(e){}},noise=(...a)=>{try{A.noise(...a)}catch(e){}};
const later=(f,ms)=>{if(typeof setTimeout!=='undefined')setTimeout(f,ms)};
let H=200;
const TS=16,COLS=15,ROWS=11,K='#282038';
const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[(Math.random()*a.length)|0];

/* ---------- the stand (15 x 11 tiles) ----------
   X outside path (customers)   C counter   W serving window (one customer each)
   . grass   , path   _ kitchen floor   # hedge (garden) / counter (kitchen)
   P garden plot   S seed crate   N sprout pot   c chop board   g grill   o oven   f fryer   j juicer
   L plate spot   K pantry (patties) */
const MAP=[
 'XXXXXXXXXXXXXXX',
 'CCWCCCCWCCCCWCC',
 '.......,_______',
 '.P.P.P.,______g',
 '.......,______#',
 '.P.P.P.,__L___o',
 '.......,__L___#',
 '.P.P.P.,__L___f',
 '.......,______#',
 '.......,______j',
 '#SSSSSN,#cc#K##'];
const WIN=[2,7,12];                                   /* the three serving windows (columns of row 1) */
const BIN={1:'let',2:'tom',3:'whe',4:'ber',5:'pot'};  /* seed crates along the bottom, by column */
const PLOTS=[[1,3],[3,3],[1,5],[3,5],[5,3],[5,5],[1,7],[3,7],[5,7]]; /* unlock order */
const PLATES=[[10,5],[10,6],[10,7]];
const SCH={c:'chop',g:'grill',o:'oven',f:'fryer',j:'juicer'};

/* ---------- food ---------- */
const CROP={spr:{n:'SPROUT',t:16,col:'#f8a0c8'},let:{n:'LETTUCE',t:7,col:'#58b848'},tom:{n:'TOMATO',t:9,col:'#e04030'},whe:{n:'WHEAT',t:8,col:'#e8c050'},
 ber:{n:'BERRIES',t:9,col:'#7050d0'},pot:{n:'POTATO',t:10,col:'#c89058'}};
const NM={let:'LETTUCE',tom:'TOMATO',whe:'WHEAT',ber:'BERRIES',pot:'POTATO',pat:'PATTY',
 let_c:'LETTUCE',tom_c:'TOMATO',bun:'BUN',pat_c:'PATTY',fry:'FRIES',smo:'SMOOTHIE'};
const PROC={let:'let_c',tom:'tom_c',whe:'bun',pat:'pat_c',pot:'fry',ber:'smo'};
const RAWOF={};for(const k in PROC)RAWOF[PROC[k]]=k;
const STN={chop:{n:'CHOP BOARD',in:{let:'let_c',tom:'tom_c'},taps:4,hint:'CHOP IT FIRST'},
 grill:{n:'GRILL',in:{pat:'pat_c'},t:4},oven:{n:'OVEN',in:{whe:'bun'},t:5},
 fryer:{n:'FRYER',in:{pot:'fry'},t:4},juicer:{n:'JUICER',in:{ber:'smo'},t:3}};
const STOF={let:'chop',tom:'chop',whe:'oven',pat:'grill',pot:'fryer',ber:'juicer'};
const RAWHINT={let:'CHOP IT FIRST',tom:'CHOP IT FIRST',whe:'BAKE IT FIRST',pat:'GRILL IT FIRST',pot:'FRY IT FIRST',ber:'JUICE IT FIRST'};
/* recipes: c = what goes on the plate (a one-thing order can be handed over as is) */
const RC={
 salad:{n:'SALAD',c:['let_c'],v:10},
 gsalad:{n:'BIG SALAD',c:['let_c','tom_c'],v:16},
 bread:{n:'FRESH BREAD',c:['bun'],v:12},
 burger:{n:'BURGER',c:['bun','pat_c'],v:18},
 louie:{n:'PUP PATTY',c:['pat_c'],v:12,dog:1},
 gburger:{n:'LEAF BURGER',c:['bun','pat_c','let_c'],v:24},
 smoothie:{n:'SMOOTHIE',c:['smo'],v:14},
 fries:{n:'FRIES',c:['fry'],v:14},
 deluxe:{n:'DELUXE',c:['bun','pat_c','let_c','tom_c'],v:32,x:10},
 combo:{n:'COMBO MEAL',c:['bun','pat_c','fry'],v:30,x:10}};
const RCORDER=['salad','gsalad','bread','burger','louie','gburger','smoothie','fries','deluxe','combo'];

/* ---------- the days (levels). Lines are new: flag to Will (he hands out canon). ---------- */
const C1=['let'],C2=['let','tom'],C3=['let','tom','whe'],C6=['let','tom','whe','ber'],C7=['let','tom','whe','ber','pot'];
const S1=['chop'],S3=['chop','oven'],S4=['chop','oven','grill','pantry'],S6=S4.concat('juicer'),S7=S6.concat('fryer');
const DAYS=[
 {n:'FIRST SPROUTS',rc:['salad'],cr:C1,st:S1,cnt:4,gap:[16,20],who:'WILL',s:'LETTUCE SEEDS ARE IN THE CRATES. PLANT, PICK, CHOP, PLATE, SERVE. THE ARROW KNOWS THE WAY.'},
 {n:'TOMATO TIME',rc:['gsalad','salad'],cr:C2,st:S1,cnt:5,gap:[15,19],who:'SCOUT',s:'TOMATOES GET SLICED ON THE SAME BOARD. A BIG SALAD NEEDS BOTH ON ONE PLATE.'},
 {n:'BREAD DAY',rc:['bread','gsalad','salad'],cr:C3,st:S3,cnt:5,gap:[15,19],who:'RANGER',s:'WHEAT GOES IN THE OVEN. IT BAKES ON ITS OWN, SO GO DO SOMETHING ELSE.'},
 {n:'BURGER TIME',rc:['burger','louie','bread','salad'],cr:C3,st:S4,cnt:6,gap:[14,18],who:'MARCUS',s:'PATTIES ARE IN THE CRATE, BRO. GRILL EM, BUN, DONE. I BASICALLY INVENTED BURGERS.'},
 {n:'LEAFY GREENS',rc:['gburger','burger','gsalad','louie'],cr:C3,st:S4,cnt:6,gap:[14,18],who:'WILL',s:'CARRY A PLATE TO THE GRILL OR THE BOARD AND THE FOOD GOES RIGHT ON IT.'},
 {n:'BERRY GOOD',rc:['smoothie','burger','gsalad','bread'],cr:C6,st:S6,cnt:6,gap:[13,17],who:'LOUIE',s:'ARF! (BERRIES GO IN THE JUICER. LOUIE IS NOT ALLOWED A SMOOTHIE.)'},
 {n:'FRY DAY',rc:['fries','burger','smoothie','louie'],cr:C7,st:S7,cnt:7,gap:[13,17],who:'MARCUS',s:'POTATOES IN THE FRYER. FRIES. YOU\'RE WELCOME. TELL WILL HE\'S A J.'},
 {n:'THE DELUXE',rc:['deluxe','gburger','fries','smoothie'],cr:C7,st:S7,cnt:7,gap:[13,17],who:'SCOUT',s:'THE DELUXE IS EVERYTHING: BUN, PATTY, LETTUCE, TOMATO. FOUR THINGS, ONE PLATE.'},
 {n:'COMBO MEALS',rc:['combo','deluxe','gsalad','smoothie','louie'],cr:C7,st:S7,cnt:7,gap:[13,16],who:'RANGER',s:'A BURGER AND FRIES, ONE PLATE. FOLKS LOVE A COMBO.'},
 {n:'LUNCH RUSH',rc:['burger','gburger','fries','smoothie','gsalad','bread'],cr:C7,st:S7,cnt:8,gap:[11,14],who:'WILL',s:'IT GETS BUSY AT NOON. PLANT AHEAD AND KEEP THE GRILL GOING.'},
 {n:'MARKET DAY',rc:['deluxe','combo','smoothie','fries','salad','louie'],cr:C7,st:S7,cnt:9,gap:[11,13],who:'MARCUS',s:'THE WHOLE VALLEY\'S HERE, BRO. I TOLD EVERYONE. YOU\'RE WELCOME AGAIN.'},
 {n:'HARVEST FEST',rc:RCORDER.slice(),cr:C7,st:S7,cnt:10,gap:[10,13],who:'LOUIE',s:'AWOOO! (THE BIGGEST DAY OF THE YEAR. EVERYONE IN THE VALLEY IS HUNGRY.)'}];

/* ---------- the customers (lines are new) ---------- */
const WHO={
 WILL:{c:'#f8e060',yum:['THANKS, ERIN!','SO GOOD.','BEST STAND AROUND.'],bye:['I\'LL BE BACK!']},
 MARCUS:{c:'#f8a040',yum:['BRO. ELITE.','TEN OUT OF TEN. LIKE ME.','DAP ME UP, CHEF.'],bye:['BRO, I GOTTA GO.']},
 SCOUT:{c:'#78c870',yum:['NOTED: DELICIOUS.','FOR SCIENCE. YUM.'],bye:['NEXT TIME!']},
 RANGER:{c:'#e8c888',yum:['GOOD TRAIL FOOD.','THANK YOU KINDLY.'],bye:['BACK TO THE TRAIL.']},
 LOUIE:{c:'#e89040',yum:['WOOF!','ARF ARF!','*HAPPY SPIN*'],bye:['*SAD LITTLE WHINE*']}};
const PEOPLE=['WILL','MARCUS','SCOUT','RANGER'];
function whoSpr(w){try{if(w==='WILL')return A.will().pd;if(w==='LOUIE')return A.LOU.l[0];return A.CH[w]}catch(e){return null}}

/* ---------- upgrades (bought with coins between days) ---------- */
const UPS=[
 ['plots','MORE PLOTS','TWO MORE GARDEN PLOTS',[40,90,150]],
 ['grow','SPRINKLERS','CROPS GROW FASTER',[60,140]],
 ['knife','SHARP KNIFE','CHOP IN TWO TAPS',[50]],
 ['heat','HOT STOVE','GRILL, OVEN, FRYER FASTER',[70,150]],
 ['bench','COMFY BENCH','CUSTOMERS WAIT LONGER',[60,130]],
 ['boots','GARDEN BOOTS','ERIN WALKS FASTER',[50]],
 ['seeds','BIG SEED BAGS','FIVE SEEDS A BAG',[45]],
 ['plate','THIRD PLATE','ONE MORE PLATE SPOT',[80]]];

/* ---------- save ---------- */
const KEY='patchplate-v1';
const DEF=()=>({v:1,day:0,stars:{},best:{},coins:0,earned:0,served:0,up:{},tix:{},plays:0,run:null,seeds:[],crew:[],cxp:{}});
let SV=DEF();
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object'){SV=Object.assign(DEF(),s);
 for(const k of ['stars','best','up','tix','cxp'])SV[k]=Object.assign({},s[k]||{});
 for(const k of ['seeds','crew'])SV[k]=Array.isArray(s[k])?s[k].slice():[]}}catch(e){}
function store(){try{localStorage.setItem(KEY,JSON.stringify(SV))}catch(e){}}
const up=k=>SV.up[k]|0;
const bagN=()=>up('seeds')?5:3,taps=()=>up('knife')?2:4,nPlots=()=>Math.min(9,4+2*up('plots')),nPlates=()=>2+up('plate');
const stepT=()=>up('boots')?.1:.13;

/* ---------- the sprout crew (Sprouts' six canon types; their kitchen jobs are new) ----------
   A sprout seed is earned the first time a day gets a star (SEEDDAY). It waits in the sprout pot (N) at the end
   of the garden: take it, plant it in a plot, water it if you like, and pluck the sprout when it peeks out.
   It joins the crew for good and works on its own every day after. Sprouts level up by working (cxp). */
const SPT={EMBER:{c:'#f07830',d:'#983818',l:'#f8c070',job:'SPEEDS UP THE STOVE'},
 PEB:{c:'#98a0b0',d:'#4c5466',l:'#dce2ea',job:'CHOPS ON THE BOARD'},
 DEW:{c:'#48a0f0',d:'#2050a8',l:'#b0e0f8',job:'WATERS THE GARDEN'},
 ZIP:{c:'#f0d020',d:'#806008',l:'#fff8a0',job:'CARRIES FOOD TO PLATES'},
 LEAF:{c:'#58c048',d:'#286028',l:'#b0f090',job:'REPLANTS PICKED PLOTS'},
 LUCKY:{c:'#f078c0',d:'#902868',l:'#ffc8e8',job:'BIGGER TIPS, MORE PATIENCE'}};
const SPORDER=['DEW','PEB','EMBER','ZIP','LEAF','LUCKY'];
const SEEDDAY={0:'DEW',1:'PEB',3:'EMBER',4:'ZIP',6:'LEAF',8:'LUCKY'};
const SPHOME={DEW:[4,8],PEB:[11,9],EMBER:[13,4],ZIP:[12,8],LEAF:[2,8],LUCKY:[5,2]};
const hasSp=T=>SV.seeds.includes(T)||SV.crew.includes(T);
/* saves from before the crew existed get the seeds their stars already earned */
for(const d in SEEDDAY)if((SV.stars[d]|0)>=1&&!hasSp(SEEDDAY[d]))SV.seeds.push(SEEDDAY[d]);
const spLv=T=>{const x=SV.cxp[T]|0;return x>=60?3:x>=20?2:1},spNext=T=>{const x=SV.cxp[T]|0;return x>=60?null:x>=20?[x-20,40]:[x,20]};
const spSpd=T=>1+.3*(spLv(T)-1);
const crewHas=T=>SV.crew.includes(T);

/* ---------- sprites ---------- */
const EP={k:K,h:'#b84828',H:'#e87848',f:'#f8dcb0',d:'#9070d0',D:'#c0a8f0',b:'#583828',a:'#f8f0e0',A:'#e0d0c0'};
const eFront=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khffffffhk.','.khfkffkfhk.','.khffffffhk.','.khhffffhhk.','.khkdaadkhk.','.kkdaaaadkk.','..kdaaaadk..','.kddaAaaddk.','.kddaaaaddk.'],
 eBack=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khhhhhhhhk.','.khHhhhhhhk.','.khhhhhhhhk.','.khhhhhhhhk.','.khkddddkhk.','.kkddaaddkk.','..kdddddDk..','.kddDdddddk.','.kddddddddk.'],
 eSide=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khhhhffffk.','.khhhhffkfk.','.khhhhffffk.','.khhhhfffk..','.khhkdddk...','..kkdaaak...','...kdaaak...','..kddaaadk..','..kddaaadk..'];
const FEET=['..kkbkkbkk..','..kbbk.kbk..'],SFEET=['...kkbkbk...','..kbk..kbk..'];
const ES={d:[mk([...eFront,FEET[0]],EP),mk([...eFront,FEET[1]],EP)],u:[mk([...eBack,FEET[0]],EP),mk([...eBack,FEET[1]],EP)],
 r:[mk([...eSide,SFEET[0]],EP),mk([...eSide,SFEET[1]],EP)]};ES.l=ES.r.map(flip);

const IC={};
(()=>{const P=(o)=>Object.assign({k:K},o);
 IC.let=mk(['...kkkk...','..kgGGgk..','.kgGggGgk.','kgGggGggGk','kggGggGggk','kgGggGgGgk','kggGgggGgk','.kgggGggk.','..kggggk..','...kkkk...'],P({g:'#58b848',G:'#a0e070'}));
 IC.let_c=mk(['..........','..........','...k.kk...','..kGkgGk..','.kgGgkggk.','kgGkgGgGgk','kggGgkgGgk','.kgggggggk','..kkkkkkk.','..........'],P({g:'#58b848',G:'#a0e070'}));
 IC.tom=mk(['....gk....','..kkggkk..','.krrggrrk.','krRrrrrrrk','krRrrrrrrk','krrrrrrrrk','krrrrrrrrk','.krrrrrrk.','..kkrrkk..','....kk....'],P({r:'#e04030',R:'#f8a080',g:'#3c9848'}));
 IC.tom_c=mk(['..kkkkkk..','.krrrrrrk.','krpyprpyrk','krpppppprk','krrrpprrrk','krrrpprrrk','krpppppprk','krpyprpyrk','.krrrrrrk.','..kkkkkk..'],P({r:'#e04030',p:'#f87060',y:'#f8e0a0'}));
 IC.whe=mk(['..y..y..y.','.yYyyYyyYy','..yYyyYyy.','...yyyyy..','....kbk...','....yyy...','...kbbbk..','...yy.yy..','..yy...yy.','..y.....y.'],P({y:'#e8c050',Y:'#fff0a0',b:'#a06830'}));
 IC.bun=mk(['..........','..........','...kkkk...','.kkBBBBkk.','kbBwbbwBbk','kbbbbwbbbk','kbbbbbbbbk','kddddddddk','.kkkkkkkk.','..........'],P({b:'#d89048',B:'#f0c070',w:'#fff0c0',d:'#a86828'}));
 IC.pat=mk(['..........','..........','..kkkkkk..','.kPpPppPk.','kppppPpppk','kpPppppPpk','kppppppppk','.kpppppPk.','..kkkkkk..','..........'],P({p:'#e07890',P:'#f8a8b8'}));
 IC.pat_c=mk(['..........','..........','..kkkkkk..','.kPpmpPpk.','kppmppmppk','kpmppmpppk','kppppmppmk','.kpppppPk.','..kkkkkk..','..........'],P({p:'#8a5030',P:'#b07848',m:'#4a2818'}));
 IC.ber=mk(['.....g....','....gGg...','..kk.g.kk.','.kBbk.kBbk','.kbbkkkbbk','..kkbBbkk.','...kbbbk..','...kbbbk..','....kkk...','..........'],P({b:'#6040c0',B:'#a090f0',g:'#58b848',G:'#a0e070'}));
 IC.smo=mk(['......kk..','.....kk...','.kkkkkkkk.','.kPpppppk.','.kpPppppk.','..kppppk..','..kppppk..','..kppppk..','..kwwwwk..','...kkkk...'],P({p:'#e05888',P:'#f8a0c0',w:'#f0f0f8'}));
 IC.pot=mk(['..........','...kkkk...','..kpPppk..','.kpPpppdk.','kppppdpppk','kpdppppppk','kppppppdpk','.kpppppk..','..kkkkk...','..........'],P({p:'#c89058',P:'#e8b880',d:'#8a5a30'}));
 IC.fry=mk(['..y.y.y...','.yYyYyYy..','.yyyyyyy..','kkkkkkkkk.','krrwrrwrk.','.krrrrrk..','.krrrrrk..','.krrrrrk..','..kkkkk...','..........'],P({y:'#f0d040',Y:'#fff0a0',r:'#d83838',w:'#f8f0e0'}));
 IC.star=mk(['...k...','..kyk..','kkyyykk','kyyyyyk','.kyyyk.','.kykyk.','.kk.kk.'],{k:K,y:'#f8d040'});
 IC.nostar=mk(['...k...','..kyk..','kkyyykk','kyyyyyk','.kyyyk.','.kykyk.','.kk.kk.'],{k:'#504860',y:'#3a3048'});
 IC.coin=mk(['.kkkk.','kyYYyk','kyYyyk','kyyyyk','kyyydk','.kkkk.'],{k:K,y:'#f8c030',Y:'#fff0a0',d:'#c08010'});
})();

/* ---------- state ---------- */
const G={s:'title',t:0,mi:0,si:0,ui:0,bi:0,bp:0,pi:0,ri:0,arm:0,L:null,fx:[],res:null,bookFrom:'stand',nope:0,nopeS:''};

/* ---------- days ---------- */
function newDay(d){const D=DAYS[d],L={d,t:0,P:{x:7,y:6,fx:0,fy:-1,mv:0,ox:7,oy:6,step:0},held:null,plots:[],st:{},pl:{},
  cu:[null,null,null],q:[],qi:0,spawnT:2.5,coins:0,tips:0,served:0,missed:0,endT:0,saveT:0,sown:[],help:[],jobs:{}};
 SV.crew.forEach(T=>L.help.push(newHelper(T)));
 L.plots=PLOTS.slice(0,nPlots()).map(([x,y])=>({x,y,c:null,g:0,w:0}));
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const ch=MAP[y][x];if(SCH[ch])L.st[x+','+y]={k:SCH[ch],it:null,p:0,out:null}}
 PLATES.slice(0,nPlates()).forEach(([x,y])=>{L.pl[x+','+y]=[]});
 let dogs=0;for(let i=0;i<D.cnt;i++){let rc=i===0?D.rc[0]:pick(D.rc);if(rc==='louie'&&(dogs>=2||i===0&&D.rc.length>1))rc=D.rc.find(k=>k!=='louie');if(rc==='louie')dogs++;L.q.push(rc)}
 const base=L.q.reduce((a,k)=>a+RC[k].v,0);L.goal=[Math.round(base*.5),Math.round(base*.8),Math.round(base*1.05)];
 G.L=L;return L;}
const dayHas=(k,v)=>DAYS[G.L.d][k].includes(v);
const starsFor=L=>L.coins>=L.goal[2]?3:L.coins>=L.goal[1]?2:L.coins>=L.goal[0]?1:0;
const plotAt=(x,y)=>G.L.plots.find(p=>p.x===x&&p.y===y);
function kind(x,y){if(x<0||y<0||x>=COLS||y>=ROWS)return'#';const ch=MAP[y][x];
 if(ch==='P')return plotAt(x,y)?'P':'.';if(ch==='L')return G.L.pl[x+','+y]?'L':'#';return ch;}
const walkable=(x,y)=>{const k=kind(x,y);return k==='.'||k===','||k==='_';};
const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
const canAdd=(c,id)=>c.length<4&&!c.includes(id);
const contsOf=h=>h?(h.k==='plate'?h.c:h.k==='it'?[h.id]:null):null;

/* ---------- sound ---------- */
const SFX={pick:()=>snd(660,.04),put:()=>snd(440,.05),plant:()=>{noise(.05,.25,900,'lowpass');snd(520,.05)},water:()=>noise(.18,.12,3200),
 chop:()=>{noise(.03,.4,2600);snd(180,.03)},done:()=>{snd(988,.06);later(()=>snd(1319,.08),70)},plate:()=>snd(784,.05),
 serve:()=>{snd(1047,.08);later(()=>snd(1319,.08),90);later(()=>snd(1568,.16),180)},toss:()=>noise(.12,.25,500,'lowpass'),
 no:()=>snd(150,.07),ripe:()=>snd(1320,.04,0,'sine',.03),bell:()=>{snd(1760,.05,0,'sine',.05);later(()=>snd(1760,.12,0,'sine',.04),120)},
 nav:()=>snd(520,.04),ok:()=>{snd(660,.05);later(()=>snd(990,.08),60)},star:()=>{snd(1175,.06);later(()=>snd(1568,.1),80)}};

/* ---------- doing things (A). dry = only say what A would do ---------- */
function act(dry){const L=G.L,P=L.P,tx=P.x+P.fx,ty=P.y+P.fy,k=kind(tx,ty),h=L.held,key=tx+','+ty;
 const no=s=>({ok:false,s}),go=(s,fn)=>{if(!dry)fn();return{ok:true,s}};
 if(k==='S'){const c=BIN[tx];if(!c)return no('');if(!dayHas('cr',c))return no(CROP[c].n+': NOT TODAY');
  if(!h||(h.k==='bag'&&h.id===c&&h.n<bagN()))return go('TAKE '+CROP[c].n+' SEEDS',()=>{L.held={k:'bag',id:c,n:bagN()};SFX.pick()});
  return no('HANDS FULL');}
 if(k==='P'){const p=plotAt(tx,ty);
  if(!p.c&&h&&h.k==='sseed')return go('PLANT THE '+h.id+' SEED',()=>{p.c='spr';p.sp=h.id;p.g=0;p.w=0;p.ding=0;L.held=null;SFX.plant()});
  if(p.c==='spr'&&p.g>=1){if(!h)return go('PLUCK THE '+p.sp+' SPROUT!',()=>pluck(p));return no('HANDS FULL');}
  if(!p.c){if(h&&h.k==='bag')return go('PLANT '+CROP[h.id].n,()=>{p.c=h.id;p.g=0;p.w=up('grow')>=2?1:0;p.ding=0;h.n--;if(h.n<=0)L.held=null;SFX.plant()});
   return no(h?'HANDS FULL':'EMPTY: GET SEEDS');}
  if(p.g<1){if(!h&&!p.w)return go('WATER IT',()=>{p.w=1;SFX.water()});return no(CROP[p.c].n+': GROWING');}
  if(!h)return go('PICK '+CROP[p.c].n,()=>{L.held={k:'it',id:p.c};p.last=p.c;p.c=null;p.g=0;p.w=0;p.ding=0;SFX.pick()});
  return no('HANDS FULL');}
 if(k==='N'){const T=potNext();if(!T)return no(SV.crew.length>=6?'SPROUT POT: ALL GROWN UP':'SPROUT POT: EARN SEEDS ON NEW DAYS');
  if(!h)return go('TAKE THE '+T+' SPROUT SEED',()=>{L.held={k:'sseed',id:T};L.sown.push(T);SFX.pick()});return no('HANDS FULL');}
 if(k==='K'){if(!dayHas('st','pantry'))return no('PANTRY: NOT TODAY');if(!h)return go('TAKE A PATTY',()=>{L.held={k:'it',id:'pat'};SFX.pick()});return no('HANDS FULL');}
 if(SCH[k]){const s=L.st[key],S=STN[s.k];if(!dayHas('st',s.k))return no(S.n+': NOT TODAY');
  if(s.out){if(!h)return go('TAKE '+NM[s.out],()=>{L.held={k:'it',id:s.out};s.out=null;SFX.pick()});
   if(h.k==='plate')return canAdd(h.c,s.out)?go('ADD '+NM[s.out]+' TO PLATE',()=>{h.c.push(s.out);s.out=null;SFX.plate()}):no('PLATE IS FULL');
   return no('HANDS FULL');}
  if(s.it){if(S.taps){if(!h)return go('CHOP! ('+(taps()-s.p)+')',()=>{s.p++;SFX.chop();if(s.p>=taps()){s.out=S.in[s.it];s.it=null;s.p=0;SFX.done()}});return no('BOARD IN USE');}
   return no(S.n+': COOKING');}
  if(h&&h.k==='it'&&S.in[h.id])return go(S.taps?'PUT ON THE BOARD':'PUT IN THE '+S.n,()=>{s.it=h.id;s.p=0;L.held=null;SFX.put()});
  if(h&&h.k==='it')return no(S.n+' IS FOR '+Object.keys(S.in).map(x=>NM[x]).join(' + '));
  return no(S.n);}
 if(k==='L'){const c=L.pl[key];
  if(!h){if(c.length)return go('PICK UP THE PLATE',()=>{L.held={k:'plate',c:c.slice()};L.pl[key]=[];SFX.pick()});return no('PLATE');}
  if(h.k==='plate'){if(!c.length)return go('PUT THE PLATE DOWN',()=>{L.pl[key]=h.c;L.held=null;SFX.put()});return no('SPOT TAKEN');}
  if(h.k==='it'){if(RAWHINT[h.id])return no(RAWHINT[h.id]);if(!canAdd(c,h.id))return no(c.includes(h.id)?'ALREADY ON IT':'PLATE IS FULL');
   return go('ADD '+NM[h.id]+' TO PLATE',()=>{c.push(h.id);L.held=null;SFX.plate()});}
  return no('HANDS FULL');}
 if(k==='W'){const i=WIN.indexOf(tx),cu=L.cu[i];if(!cu||cu.st!=='wait')return no(cu?'':'NOBODY HERE YET');const rc=RC[cu.rc],hc=contsOf(h);
  if(hc&&same(hc,rc.c))return go('SERVE '+rc.n,()=>serve(i));return no(cu.who+' WANTS '+rc.n);}
 return no('');}
function toss(){const L=G.L;if(!L.held)return;if(L.held.k==='sseed')L.sown.splice(L.sown.indexOf(L.held.id),1);L.held=null;SFX.toss();const P=L.P;G.fx.push({k:'poof',x:P.x*TS+8,y:P.y*TS,t:0});}
function serve(i){const L=G.L,cu=L.cu[i],rc=RC[cu.rc],tip=Math.round(rc.v*(crewHas('LUCKY')?.5+.1*spLv('LUCKY'):.5)*Math.max(0,cu.pat/cu.pmax)),c=rc.v+tip;
 L.coins+=c;L.tips+=tip;L.served++;L.held=null;cu.st='happy';cu.t=0;cu.say=pick(WHO[cu.who].yum);cu.gain=c;SFX.serve();
 G.fx.push({k:'txt',s:'+'+c,x:WIN[i]*TS+8,y:TS+4,t:0,c:'#f8d040'});}

/* ---------- the crew at work ---------- */
function potNext(){const L=G.L,left=SV.seeds.slice();L.sown.forEach(T=>{const i=left.indexOf(T);if(i>=0)left.splice(i,1)});return left[0]||null;}
function newHelper(T,x,y){const[hx,hy]=SPHOME[T];return{t:T,x:x!==undefined?x:hx*TS+8,y:y!==undefined?y:hy*TS+12,goal:null,cd:0,carry:null,wait:0,at:null,mv:0,lv:spLv(T)};}
function pluck(p){const L=G.L,T=p.sp;p.c=null;p.sp=null;p.g=0;p.w=0;p.ding=0;
 const i=SV.seeds.indexOf(T);if(i>=0)SV.seeds.splice(i,1);const j=L.sown.indexOf(T);if(j>=0)L.sown.splice(j,1);
 if(!SV.crew.includes(T))SV.crew.push(T);store();L.help.push(newHelper(T,p.x*TS+8,p.y*TS+12));
 G.fx.push({k:'txt',s:T+' JOINED!',x:p.x*TS+8,y:p.y*TS,t:0,c:SPT[T].l});
 snd(900,.06,1800,'sine',.06);later(()=>snd(1400,.08,2200,'sine',.05),90);}
const keyXY=k=>k.split(',').map(Number);
function openRecs(){const L=G.L,o=[];L.cu.forEach(c=>{if(c&&(c.st==='wait'||c.st==='in'))o.push(RC[c.rc].c)});if(!o.length&&L.qi<L.q.length)o.push(RC[L.q[L.qi]].c);return o;}
function plateFor(id){const L=G.L,recs=openRecs(),fits=c=>recs.some(R=>c.every(x=>R.includes(x)));let best=null;
 for(const k in L.pl){const c=L.pl[k];if(canAdd(c,id)&&fits(c.concat(id))&&(!best||c.length>L.pl[best].length))best=k}return best;}
function spWork(h){SV.cxp[h.t]=(SV.cxp[h.t]|0)+1;G.L.jobs[h.t]=(G.L.jobs[h.t]|0)+1;const lv=spLv(h.t);if(lv>h.lv){SFX.star();G.fx.push({k:'txt',s:h.t+' LEVEL '+lv+'!',x:h.x,y:h.y-10,t:0,c:SPT[h.t].l})}h.lv=lv;}
function spGoal(h){const L=G.L;
 switch(h.t){
 case 'DEW':{const p=L.plots.find(p=>p.c&&p.g<1&&!p.w);return p?{x:p.x,y:p.y}:null;}
 case 'LEAF':{const nd=need(true,2),p=L.plots.find(p=>!p.c&&p.last&&dayHas('cr',p.last)&&nd[PROC[p.last]]>0);return p?{x:p.x,y:p.y}:null;}
 case 'PEB':{for(const k in L.st){const s=L.st[k];if(s.k==='chop'&&s.it&&!s.out){const[x,y]=keyXY(k);return{x,y,k}}}return null;}
 case 'EMBER':{for(const k in L.st){const s=L.st[k];if(s.it&&STN[s.k].t){const[x,y]=keyXY(k);return{x,y,k}}}return null;}
 case 'ZIP':{if(h.carry){const k=plateFor(h.carry);if(!k)return null;const[x,y]=keyXY(k);return{x,y,k,plate:1}}
  for(const k in L.st){const s=L.st[k];if(s.out&&plateFor(s.out)){const[x,y]=keyXY(k);return{x,y,k}}}return null;}
 case 'LUCKY':{const i=L.cu.findIndex(c=>c&&c.st==='wait');return i>=0?{x:WIN[i],y:2,stand:1}:null;}}
 return null;}
function spJob(h){const L=G.L,g2=h.goal,m=spSpd(h.t);
 switch(h.t){
 case 'DEW':{const p=plotAt(g2.x,g2.y);if(p&&p.c&&p.g<1&&!p.w){p.w=1;spWork(h);noise(.08,.06,3600)}h.goal=null;h.cd=.5/m;return;}
 case 'LEAF':{const p=plotAt(g2.x,g2.y);if(p&&!p.c&&p.last&&need(true,2)[PROC[p.last]]>0){p.c=p.last;p.g=0;p.w=up('grow')>=2?1:0;p.ding=0;spWork(h);snd(560,.04,0,'square',.025)}h.goal=null;h.cd=.8/m;return;}
 case 'PEB':{const s=L.st[g2.k];if(s&&s.it&&!s.out){s.p++;noise(.02,.2,2600);if(s.p>=taps()){s.out=STN.chop.in[s.it];s.it=null;s.p=0;spWork(h);SFX.done();h.goal=null}}else h.goal=null;h.cd=.55/m;return;}
 case 'EMBER':{const s=L.st[g2.k];if(!s||!s.it)h.goal=null;else h.at=g2.k;return;}
 case 'ZIP':{if(g2.plate){const c=L.pl[g2.k];if(c&&h.carry&&canAdd(c,h.carry)&&plateFor(h.carry)===g2.k){c.push(h.carry);h.carry=null;spWork(h);snd(784,.04,0,'square',.025)}h.goal=null;h.cd=.3/m;return;}
  const s=L.st[g2.k];if(s&&s.out&&!h.carry&&plateFor(s.out)){h.carry=s.out;s.out=null;snd(660,.03,0,'square',.025)}h.goal=null;h.cd=.2/m;return;}
 case 'LUCKY':{h.goal=null;h.cd=2.5;return;}}}
function helpUpd(dt){const L=G.L;
 for(const h of L.help){const m=spSpd(h.t);if(h.cd>0)h.cd-=dt;h.at=null;
  if(h.carry){if(!plateFor(h.carry)){h.wait+=dt;if(h.wait>6){G.fx.push({k:'poof',x:h.x,y:h.y-6,t:0});h.carry=null;h.wait=0}}else h.wait=0}
  if(!h.goal&&h.cd<=0)h.goal=spGoal(h);
  const go=h.goal||{x:SPHOME[h.t][0],y:SPHOME[h.t][1]},tx=go.x*TS+8,ty=go.y*TS+(h.goal&&!go.stand?9:12),dx=tx-h.x,dy=ty-h.y,d=Math.hypot(dx,dy),v=44*m*dt;
  if(d>v){h.x+=dx/d*v;h.y+=dy/d*v;h.mv=1}else{h.x=tx;h.y=ty;h.mv=0;if(h.goal&&h.cd<=0)spJob(h)}}}
const emberOn=k=>G.L.help.some(h=>h.t==='EMBER'&&h.at===k);

/* ---------- what to do next: drives the helper arrow on the first days (and the test bot) ---------- */
function plan(){const L=G.L,h=L.held,open=[];L.cu.forEach((c,i)=>{if(c&&(c.st==='wait'||c.st==='in'))open.push({i,c:RC[c.rc].c,wait:c.st==='wait'})});
 const recs=open.map(o=>o.c);if(!recs.length&&L.qi<L.q.length)recs.push(RC[L.q[L.qi]].c);
 const fits=c=>recs.some(R=>c.every(x=>R.includes(x)));
 const spots=Object.keys(L.pl).map(k=>{const[x,y]=k.split(',').map(Number);return{x,y,c:L.pl[k]}});
 if(h&&h.k==='sseed'){const p=L.plots.find(p=>!p.c);return p?{x:p.x,y:p.y,spr:1}:null;}
 const ripeSp=L.plots.find(p=>p.c==='spr'&&p.g>=1);if(ripeSp&&!h)return{x:ripeSp.x,y:ripeSp.y,spr:1};
 const hc=contsOf(h);
 if(hc){const o=open.find(o=>o.wait&&same(hc,o.c));if(o)return{x:WIN[o.i],y:1};}
 if(h&&h.k==='plate'){if(!fits(h.c))return{toss:1};const s=spots.find(s=>!s.c.length);return s?{x:s.x,y:s.y}:null;}
 if(h&&h.k==='it'){const id=h.id;
  if(RAWHINT[id]){if(need(true,2)[PROC[id]]<0)return{toss:1};const s=stationFor(id,true);if(s)return s;
   /* every station that takes it is holding finished food: nowhere to put it */
   return Object.values(L.st).some(t=>t.k===STOF[id]&&t.it)?null:{toss:1};}
  const best=spots.filter(s=>canAdd(s.c,id)&&fits(s.c.concat(id))).sort((a,b)=>b.c.length-a.c.length)[0];
  if(best)return{x:best.x,y:best.y};return recs.some(R=>R.includes(id))?null:{toss:1};}
 if(h&&h.k==='bag'){const p=L.plots.find(p=>!p.c);return p?{x:p.x,y:p.y}:{toss:1};}
 for(const s of spots)if(s.c.length&&open.some(o=>o.wait&&same(s.c,o.c)))return{x:s.x,y:s.y};
 for(const s of spots)if(s.c.length&&!fits(s.c))return{x:s.x,y:s.y};
 if(!h&&potNext()&&L.plots.some(p=>!p.c)&&!L.plots.some(p=>p.c==='spr'))return{x:6,y:10,spr:1};
 const nd=need(false,0),ahead=need(true,2);
 for(const k in L.st){const s=L.st[k];if(s.out&&crewHas('ZIP')&&plateFor(s.out))continue;if(s.out&&(nd[s.out]>-1||recs.some(R=>R.includes(s.out)))){const[x,y]=k.split(',').map(Number);return{x,y}}}
 if(!crewHas('PEB'))for(const k in L.st){const s=L.st[k];if(s.it&&STN[s.k].taps){const[x,y]=k.split(',').map(Number);return{x,y}}}
 const order=[];recs.forEach(R=>R.forEach(id=>{if(!order.includes(id))order.push(id)}));
 /* 1) things you can make now, 2) water what's growing for them, 3) plant for what's coming */
 for(const id of order){if(!(nd[id]>0))continue;const raw=RAWOF[id];
  if(raw==='pat'){if(stationFor('pat',true))return{x:12,y:10};continue;}
  const ripe=L.plots.find(p=>p.c===raw&&p.g>=1);if(ripe)return{x:ripe.x,y:ripe.y};}
 if(!crewHas('DEW'))for(const id of order){if(!(nd[id]>0))continue;const raw=RAWOF[id],dry=L.plots.find(p=>p.c===raw&&p.g<1&&!p.w);if(dry)return{x:dry.x,y:dry.y};}
 const soon=order.slice();L.q.slice(L.qi,L.qi+2).forEach(k=>RC[k].c.forEach(id=>{if(!soon.includes(id))soon.push(id)}));
 for(const id of soon){const raw=RAWOF[id];if(raw==='pat'||!(ahead[id]>0))continue;
  if(L.plots.some(p=>!p.c)){const bx=+Object.keys(BIN).find(c=>BIN[c]===raw);return{x:bx,y:10};}
  const spare=L.plots.find(p=>p.c&&p.c!=='spr'&&p.g>=1&&need(true,2)[PROC[p.c]]<0);if(spare)return{x:spare.x,y:spare.y};}
 return null;}
/* what's still missing for the orders in view (processed ingredient -> count) */
function need(plots=true,ahead=0){const L=G.L,n={},add=(id,v)=>{n[id]=(n[id]||0)+v};
 L.cu.forEach(c=>{if(c&&(c.st==='wait'||c.st==='in'))RC[c.rc].c.forEach(id=>add(id,1))});
 const nxt=Math.max(ahead,L.cu.some(c=>c&&(c.st==='wait'||c.st==='in'))?0:1);L.q.slice(L.qi,L.qi+nxt).forEach(k=>RC[k].c.forEach(id=>add(id,1)));
 const have=id=>add(PROC[id]||id,-1);
 Object.values(L.pl).forEach(c=>c.forEach(id=>add(id,-1)));
 const hc=contsOf(L.held);if(hc)hc.forEach(have);
 for(const k in L.st){const s=L.st[k];if(s.out)add(s.out,-1);if(s.it)have(s.it);}
 L.help.forEach(x=>{if(x.carry)add(x.carry,-1)});
 if(plots)L.plots.forEach(p=>{if(p.c&&p.c!=='spr')have(p.c)});return n;}
function stationFor(raw,free){const L=G.L,want=STOF[raw];for(const k in L.st){const s=L.st[k];if(s.k===want&&(!free||(!s.it&&!s.out))){const[x,y]=k.split(',').map(Number);return{x,y}}}return null;}

/* ---------- updating a day ---------- */
function playUpd(dt){const L=G.L;L.t+=dt;
 if(pressed('start')){G.s='pause';G.pi=0;snap();SFX.nav();return}
 if(pressed('sel')){G.bookFrom='play';G.s='book';G.bp=0;return}
 for(const p of L.plots)if(p.c&&p.g<1){p.g=Math.min(1,p.g+dt/(CROP[p.c].t*(1-.2*up('grow')))*(p.w?1.8:1));if(p.g>=1&&!p.ding){p.ding=1;SFX.ripe()}}
 for(const k in L.st){const s=L.st[k],S=STN[s.k];if(S.t&&s.it){const em=emberOn(k);s.p+=dt/(S.t*(1-.18*up('heat')))*(em?1.5+.25*(spLv('EMBER')-1):1);
  if(s.p>=1){s.out=S.in[s.it];s.it=null;s.p=0;SFX.done();if(em){const h=L.help.find(h=>h.t==='EMBER');if(h)spWork(h)}}}}
 helpUpd(dt);
 custUpd(dt);
 const P=L.P;if(P.mv>0){P.mv=Math.max(0,P.mv-dt/stepT())}
 if(P.mv===0){const hz=keys.right-keys.left,vt=keys.down-keys.up;let dx=0,dy=0;
  if(hz&&vt){if(walkable(P.x+hz,P.y))dx=hz;else dy=vt}else if(hz)dx=hz;else if(vt)dy=vt;
  if(dx||dy){P.fx=dx;P.fy=dy;if(walkable(P.x+dx,P.y+dy)){P.ox=P.x;P.oy=P.y;P.x+=dx;P.y+=dy;P.mv=1;P.step++}}}
 if(pressed('a')){const r2=act(false);if(!r2.ok){G.nope=.9;G.nopeS=r2.s;if(r2.s)SFX.no()}else G.nope=0}
 if(pressed('b'))toss();
 for(const f of G.fx)f.t+=dt;G.fx=G.fx.filter(f=>f.t<1);if(G.nope>0)G.nope-=dt;
 L.saveT+=dt;if(L.saveT>4){L.saveT=0;snap()}
 if(L.qi>=L.q.length&&L.cu.every(c=>!c)){L.endT+=dt;if(L.endT>.8)finish()}}
function custUpd(dt){const L=G.L;
 for(let i=0;i<3;i++){const cu=L.cu[i];if(!cu)continue;const tx=WIN[i]*TS+8;cu.t+=dt;
  if(cu.st==='in'){const d=tx-cu.x;cu.x+=Math.sign(d)*Math.min(Math.abs(d),64*dt);if(Math.abs(d)<.5){cu.x=tx;cu.st='wait';SFX.bell()}}
  else if(cu.st==='wait'){cu.pat-=dt;if(cu.pat<=0){cu.pat=0;cu.st='sad';cu.t=0;cu.say=pick(WHO[cu.who].bye);L.missed++}}
  else if(cu.st==='happy'||cu.st==='sad'){if(cu.t>1.7){cu.st='out'}}
  else if(cu.st==='out'){const ex=cu.side<0?-14:W+14;cu.x+=Math.sign(ex-cu.x)*72*dt;if(Math.abs(ex-cu.x)<3)L.cu[i]=null}}
 if(L.qi<L.q.length){L.spawnT-=dt;const free=[0,1,2].filter(i=>!L.cu[i]);
  if(free.length===3&&L.spawnT>2)L.spawnT=2;
  if(L.spawnT<=0&&free.length){const i=pick(free),rc=L.q[L.qi++],D=DAYS[L.d],who=RC[rc].dog?'LOUIE':pick(PEOPLE),side=i===0?-1:i===2?1:pick([-1,1]);
   const pmax=65+15*up('bench')+(RC[rc].x||0)+(crewHas('LUCKY')?10:0);
   L.cu[i]={who,rc,pat:pmax,pmax,st:'in',x:side<0?-14:W+14,side,t:0,say:'',gain:0};L.spawnT=R(D.gap[0],D.gap[1]);}}}
function finish(){const L=G.L,d=L.d,st=starsFor(L),prevDay=SV.day;
 SV.coins+=L.coins;SV.earned+=L.coins;SV.served+=L.served;SV.plays++;
 const prevSt=SV.stars[d]|0;if(st>prevSt)SV.stars[d]=st;const best=L.coins>(SV.best[d]|0);if(best)SV.best[d]=L.coins;
 if(st>=1&&SV.day<d+1)SV.day=Math.min(DAYS.length,d+1);
 let seed=null;if(st>=1&&SEEDDAY[d]&&!hasSp(SEEDDAY[d])){seed=SEEDDAY[d];SV.seeds.push(seed)}
 let tix=0;if(st===3&&!SV.tix[d]){SV.tix[d]=1;tix=1;try{const m=A.meta();m.tix++;A.persist()}catch(e){}}
 SV.run=null;store();
 G.res={d,st,coins:L.coins,tips:L.tips,served:L.served,n:L.q.length,missed:L.missed,tix,seed,jobs:Object.assign({},L.jobs),best:best&&prevSt>0,
  unl:st>=1&&prevDay<d+1&&d+1<DAYS.length,last:st>=1&&d+1>=DAYS.length&&prevDay<DAYS.length};
 G.s='done';G.ri=0;G.t=0;}
function snap(){if(G.L&&(G.s==='play'||G.s==='pause'||(G.s==='book'&&G.bookFrom!=='stand'))){SV.run={L:G.L};store()}}

/* ---------- menus ---------- */
function nav(i,n){if(pressed('down')){SFX.nav();return(i+1)%n}if(pressed('up')){SFX.nav();return(i+n-1)%n}return i;}
const titleItems=()=>(SV.run?['CONTINUE DAY '+(SV.run.L.d+1)]:[]).concat(['PLAY','SWAP CARTRIDGE']);
function standItems(){const o=[];for(let d=0;d<=Math.min(SV.day,DAYS.length-1);d++)o.push({d});if(SV.day<DAYS.length-1)o.push({d:SV.day+1,lock:1});
 return o.concat([{k:'UPGRADES'},{k:'SPROUTS'},{k:'RECIPES'},{k:'TITLE'}]);}
const pauseItems=()=>['RESUME','RECIPES','RESTART DAY','QUIT DAY','SWAP CARTRIDGE'];
const doneItems=()=>G.res.st>=1?(G.res.d+1<DAYS.length?['NEXT DAY','PLAY AGAIN','THE STAND']:['PLAY AGAIN','THE STAND']):['TRY AGAIN','THE STAND'];
function startDay(d){newDay(d);G.s='intro';G.t=0;SFX.ok();}
function update(dt){H=A.H();G.t+=dt;
 switch(G.s){
 case 'title':{const it=titleItems();G.mi=nav(Math.min(G.mi,it.length-1),it.length);
  if(pressed('a')||pressed('start')){const k=it[G.mi];
   if(k.startsWith('CONTINUE')){G.L=SV.run.L;G.s='pause';G.pi=0;SFX.ok()}
   else if(k==='PLAY'){G.s='stand';const L2=standItems();G.si=Math.max(0,L2.findIndex(x=>x.d===Math.min(SV.day,DAYS.length-1)));SFX.ok()}
   else A.eject();}
  return;}
 case 'stand':{const it=standItems();G.si=nav(Math.min(G.si,it.length-1),it.length);
  if(pressed('b')){G.s='title';G.mi=0;SFX.nav();return}
  if(pressed('a')||pressed('start')){const x=it[G.si];
   if(x.lock){SFX.no();G.nope=1.2;G.nopeS='EARN A STAR ON DAY '+x.d+' FIRST';return}
   if(x.d!==undefined){if(SV.run&&SV.run.L.d!==x.d){SV.run=null;store()}startDay(x.d);return}
   if(x.k==='UPGRADES'){G.s='shop';G.ui=0;SFX.ok()}else if(x.k==='SPROUTS'){G.s='crew';SFX.ok()}else if(x.k==='RECIPES'){G.s='book';G.bookFrom='stand';G.bp=0;SFX.ok()}else{G.s='title';G.mi=0;SFX.nav()}}
  if(G.nope>0)G.nope-=dt;return;}
 case 'shop':{G.ui=nav(G.ui,UPS.length+1);if(G.nope>0)G.nope-=dt;
  if(pressed('b')||((pressed('a')||pressed('start'))&&G.ui===UPS.length)){G.s='stand';SFX.nav();return}
  if(pressed('a')){const u=UPS[G.ui],lv=up(u[0]);if(lv>=u[3].length){SFX.no();G.nope=1;G.nopeS='ALREADY MAXED';return}
   const c=u[3][lv];if(SV.coins<c){SFX.no();G.nope=1;G.nopeS='NEED '+(c-SV.coins)+' MORE COINS';return}
   SV.coins-=c;SV.up[u[0]]=lv+1;store();SFX.ok();G.nope=1;G.nopeS=u[1]+' BOUGHT!';}return;}
 case 'book':{if(pressed('left')||pressed('right')){G.bp=1-G.bp;SFX.nav()}
  if(pressed('b')||pressed('a')||pressed('sel')||pressed('start')){G.s=G.bookFrom==='play'?'play':G.bookFrom==='pause'?'pause':'stand';SFX.nav()}return;}
 case 'crew':{if(pressed('a')||pressed('b')||pressed('start')){G.s='stand';SFX.nav()}return;}
 case 'intro':{if(pressed('a')||pressed('start')){G.s='play';G.fx=[];SFX.ok();snap()}else if(pressed('b')){G.L=null;G.s='stand';SFX.nav()}return;}
 case 'play':playUpd(dt);return;
 case 'pause':{const it=pauseItems();G.pi=nav(G.pi,it.length);if(pressed('b')){G.s='play';return}
  if(pressed('a')||pressed('start')){const k=it[G.pi];
   if(k==='RESUME'){G.s='play';SFX.ok()}else if(k==='RECIPES'){G.s='book';G.bookFrom='pause';G.bp=0}
   else if(k==='RESTART DAY'){startDay(G.L.d)}else if(k==='QUIT DAY'){SV.run=null;store();G.L=null;G.s='stand';SFX.nav()}
   else{snap();A.eject()}}return;}
 case 'done':{const it=doneItems();G.ri=nav(G.ri,it.length);
  if(G.t>.5&&(pressed('a')||pressed('start'))){const k=it[G.ri],d=G.res.d;
   if(k==='NEXT DAY')startDay(d+1);else if(k==='PLAY AGAIN'||k==='TRY AGAIN')startDay(d);
   else{G.s='stand';const L2=standItems();G.si=Math.max(0,L2.findIndex(x=>x.d===Math.min(SV.day,DAYS.length-1)));SFX.nav()}}return;}}}

/* ---------- drawing helpers ---------- */
function ftext(s,cx,y,maxw,sc=2,c='#fff',sh='#181020'){s=String(s);const w=tw(s,sc);
 if(w>maxw){g.save();g.translate(Math.round(cx-maxw/2),0);g.scale(maxw/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round(cx-w/2),y,sc,c,sh);}
function wrap(s,maxW,sc){const out=[];let l='';for(const w of String(s).split(' ')){const t=l?l+' '+w:w;if(l&&tw(t,sc)>maxW){out.push(l);l=w}else l=t}if(l)out.push(l);return out;}
function panel(x,y,w,h,c='#281c30'){r(K,x,y,w,h);r('#f8e060',x+1,y+1,w-2,h-2);r(c,x+2,y+2,w-4,h-4);}
function stars(n,x,y,big){const s=big?2:1;for(let i=0;i<3;i++)g.drawImage(i<n?IC.star:IC.nostar,x+i*(8*s+(big?2:1)),y,7*s,7*s);}
function coinTxt(n,x,y,sc=2,c='#f8d040'){g.drawImage(IC.coin,x,y+1);text(String(n),x+8,y,sc,c);}
function drawBag(x,y,c,n){r(K,x+1,y+1,8,9);r('#d8b878',x+2,y+2,6,7);r('#a88848',x+2,y+2,6,1);r(K,x+3,y,4,1);r(K,x+4,y+1,2,1);r(CROP[c].col,x+4,y+5,2,2);}
/* food on a plate, drawn from what's actually on it. cx = centre, by = bottom */
function drawFood(c,cx,by){
 if(c.length===1&&c[0]==='smo'){g.drawImage(IC.smo,cx-5,by-10);return}
 r(K,cx-8,by-3,16,3);r('#f8f8f8',cx-7,by-3,14,2);r('#c8c8d8',cx-6,by-1,12,1);
 const has=k=>c.includes(k);let x0=cx,y=by-3;
 if(has('fry')){const solo=c.length===1;g.drawImage(IC.fry,solo?cx-5:cx+1,by-12);if(solo)return;x0=cx-3;}
 if(has('smo'))g.drawImage(IC.smo,cx+3,by-12),x0=cx-3;
 if(has('bun')&&c.length===1){g.drawImage(IC.bun,x0-5,by-11);return}
 if(has('bun')){r('#a86828',x0-6,y-2,12,2);y-=2;
  if(has('pat_c')){r('#4a2818',x0-7,y-2,14,2);r('#8a5030',x0-6,y-2,12,1);y-=2}
  if(has('tom_c')){r('#e04030',x0-6,y-1,12,1);y-=1}
  if(has('let_c')){r('#3c9848',x0-7,y-1,14,1);r('#a0e070',x0-6,y-2,3,1);r('#a0e070',x0-1,y-2,3,1);r('#a0e070',x0+4,y-2,2,1);y-=1}
  r(K,x0-6,y-5,12,5);r('#d89048',x0-5,y-4,10,4);r('#f0c070',x0-4,y-4,4,1);r('#fff0c0',x0-2,y-3,1,1);r('#fff0c0',x0+2,y-2,1,1);return}
 if(has('let_c')||has('tom_c')){r(K,x0-7,y-4,14,4);r('#e8e0f0',x0-6,y-3,12,3);r('#58b848',x0-6,y-6,12,3);r('#a0e070',x0-4,y-7,4,1);r('#a0e070',x0+1,y-6,3,1);
  if(has('tom_c')){r('#e04030',x0-4,y-5,2,2);r('#e04030',x0+2,y-6,2,2)}if(has('pat_c'))r('#8a5030',x0-1,y-6,3,2);return}
 if(has('pat_c')){if(c.length===1){r(K,x0-7,y-4,14,4);r('#c83838',x0-6,y-3,12,3);r('#f07070',x0-6,y-3,12,1)}g.drawImage(IC.pat_c,x0-5,by-12);}}
function drawHeld(h,cx,by){if(!h)return;if(h.k==='sseed'){drawSeed(cx-5,by-10,h.id);return}if(h.k==='plate'){drawFood(h.c,cx,by);return}if(h.k==='bag'){drawBag(cx-5,by-10,h.id,h.n);return}g.drawImage(IC[h.id],cx-5,by-10);}

/* a sprout: cx = centre, by = feet. Same colours as Sprouts' buds */
function drawSp(T,cx,by,bob=0,carry=null){const C=SPT[T],x=Math.round(cx),y=Math.round(by)+bob;
 r('rgba(0,0,0,.22)',x-3,Math.round(by),7,2);
 r(C.d,x-3,y-8,7,8);r(C.d,x-4,y-7,9,6);r(C.c,x-3,y-7,7,6);r(C.l,x-2,y-7,3,1);
 const bl=((G.t*1.3+cx)%4)<.12;r(K,x-2,y-5,1,bl?1:2);r(K,x+2,y-5,1,bl?1:2);
 r('#3c9848',x,y-11,1,3);r('#84d870',x+1,y-11,2,1);r('#f8a0c8',x-1,y-13,3,2);r('#ffffff',x,y-13,1,1);
 if(carry)g.drawImage(IC[carry],x-5,y-23);}
function drawSeed(x,y,T){const C=SPT[T];r(K,x+2,y+2,6,7);r(C.c,x+3,y+3,4,5);r(C.l,x+3,y+3,2,1);r('#3c9848',x+4,y,1,2);r('#84d870',x+5,y,2,1);
 if(((G.t*3)|0)%2)r('#ffffff',x+8,y+1,1,1);}

/* ---------- drawing the stand ---------- */
function counter(x,y){r('#6a4830',x,y,16,16);r('#e8d0a0',x,y,16,11);r('#f8e8c0',x,y,16,2);r('#c8a878',x,y+10,16,1);r('#4a3020',x,y+15,16,1);}
function bar(x,y,w,f,c='#84d870'){r('#281c30',x,y,w,3);r(c,x+1,y+1,Math.max(0,Math.round((w-2)*f)),1);}
function drawTile(x,y,ch,px,py){const TL=A.TL;
 const grass=()=>g.drawImage(TL.grass[(x*7+y*3)%3],px,py),floor=()=>g.drawImage(TL.wood,px,py);
 switch(ch){
 case 'X':r('#a89878',px,py,16,16);r('#c8b898',px+1,py+1,6,6);r('#c8b898',px+9,py+2,6,5);r('#c8b898',px+3,py+9,7,6);r('#b8a888',px+11,py+10,4,5);break;
 case 'C':case 'W':counter(px,py);r('#e85878',px,py,16,3);for(let i=0;i<16;i+=4)r('#ffffff',px+i+2,py,2,3);r('#b83858',px,py+3,16,1);
  if(ch==='W'){r(K,px+5,py+5,6,4);r('#f8d040',px+6,py+5,4,3);r('#fff0a0',px+7,py+5,1,1);r(K,px+7,py+4,2,1)}break;
 case '.':grass();break;
 case ',':g.drawImage(TL.dirt,px,py);break;
 case '_':floor();break;
 case 'P':g.drawImage(TL.soil,px,py);break;
 case 'S':grass();break;
 case '#':if(x<7)grass(),g.drawImage(TL.tree,px,py);else counter(px,py);break;
 default:if(x<7)grass();else floor();}}
function drawThing(x,y,ch,px,py){const L=G.L,key=x+','+y;
 if(ch==='P'){const p=plotAt(x,y);if(!p)return;if(p.w&&p.c)r('rgba(30,16,40,.3)',px,py,16,16);if(!p.c)return;
  const st=p.g>=1?3:p.g>.6?2:p.g>.25?1:0,cc=CROP[p.c].col;
  if(p.c==='spr'){const C=SPT[p.sp]||SPT.DEW;
   if(st===0){r(C.c,px+7,py+8,3,3);if(((G.t*3)|0)%2)r('#ffffff',px+8,py+8,1,1)}
   else if(st===1){r('#3c9848',px+8,py+5,1,6);r('#84d870',px+9,py+5,2,1);r(C.c,px+6,py+10,5,2)}
   else if(st===2){r('#3c9848',px+8,py+2,1,5);r('#84d870',px+9,py+2,2,1);r('#f8a0c8',px+7,py+1,3,2);r(C.d,px+4,py+8,9,4);r(C.c,px+5,py+8,7,3)}
   else{const w=((G.t*5)|0)%2;drawSp(p.sp,px+8+w,py+13);r('#5a3a20',px+3,py+12,11,2);if(((G.t*4)|0)%2){r('#ffffff',px+1,py+3,1,1);r('#ffffff',px+14,py+6,1,1)}}
   if(st<3)bar(px+2,py+13,12,p.g,'#f8a0c8');return;}
  if(st===0){r('#4a2a18',px+5,py+8,2,2);r('#4a2a18',px+9,py+7,2,2)}
  else if(st===1){r('#3c9848',px+7,py+7,2,5);r('#84d870',px+5,py+6,3,2);r('#84d870',px+9,py+6,3,2)}
  else if(st===2){r('#3c9848',px+7,py+4,2,8);r('#84d870',px+3,py+5,4,3);r('#84d870',px+9,py+4,4,3);r(cc,px+6,py+3,4,3)}
  else{const b=((G.t*3+x)|0)%2;g.drawImage(IC[p.c],px+3,py+2+b);if(((G.t*4+y)|0)%4===0)r('#ffffff',px+13,py+2,1,1)}
  if(st<3)bar(px+2,py+13,12,p.g);return;}
 if(ch==='S'){const c=BIN[x],on=dayHas('cr',c);r(K,px+1,py+3,14,13);r(on?'#a06838':'#6a5048',px+2,py+4,12,11);r(on?'#c88850':'#806458',px+2,py+4,12,2);r('#704020',px+2,py+9,12,1);
  if(on)g.drawImage(IC[c],px+3,py-1);else{r('#c8c0d0',px+5,py+7,6,1)}return;}
 if(ch==='N'){r(K,px+3,py+5,10,10);r('#c86838',px+4,py+6,8,8);r('#e88858',px+4,py+6,8,2);r('#5a3a20',px+4,py+8,8,1);const T=potNext();
  if(T){drawSeed(px+3,py-4,T)}else{r('#3c9848',px+7,py+3,1,3);r('#84d870',px+8,py+3,2,1)}return;}
 if(ch==='K'){const on=dayHas('st','pantry');counter(px,py);r(K,px+2,py+1,12,9);r(on?'#c8e0f0':'#7a7088',px+3,py+2,10,7);if(on){g.drawImage(IC.pat,px+3,py+1)}return;}
 if(ch==='L'){if(!L.pl[key])return;counter(px,py);r('#d8c090',px+2,py+2,12,7);const c=L.pl[key];if(c.length)drawFood(c,px+8,py+10);else{r('#ffffff',px+4,py+4,8,3);r('#c8c8d8',px+5,py+7,6,1)}return;}
 if(SCH[ch]){const s=L.st[key],on=dayHas('st',s.k);
  if(ch==='o'){r('#7a3020',px,py,16,16);r('#b84830',px+1,py,14,15);for(let j=0;j<16;j+=4){r('#7a3020',px,py+j,16,1);r('#7a3020',px+((j/4)%2?4:10),py+j,1,4)}
   r(K,px+3,py+5,10,8);r(on&&s.it?'#f0a040':'#3a2838',px+4,py+6,8,6);if(on&&s.it)r('#f8d080',px+5,py+7,6,2);}
  else{counter(px,py);
   if(ch==='c'){r('#a87040',px+2,py+2,12,7);r('#d8a060',px+2,py+2,12,1);r('#c8c8d8',px+11,py+3,1,4);r(K,px+11,py+7,1,2)}
   if(ch==='g'){r(K,px+1,py+1,14,9);r('#383040',px+2,py+2,12,7);for(let i=0;i<3;i++)r('#6a6078',px+3,py+3+i*2,10,1);if(on&&s.it&&((G.t*6)|0)%2)r('#f06030',px+3,py+8,10,1)}
   if(ch==='f'){r(K,px+1,py+1,14,9);r('#9098a8',px+2,py+2,12,7);r(on?'#e8c040':'#8a8070',px+3,py+3,10,5);if(on&&s.it&&((G.t*8)|0)%2){r('#fff0a0',px+5,py+4,1,1);r('#fff0a0',px+9,py+5,1,1)}}
   if(ch==='j'){r(K,px+4,py-5,8,13);r('#d8f0f8',px+5,py-4,6,8);if(s.it||s.out)r('#e05888',px+5,py,6,4);r('#5a5068',px+3,py+7,10,3);r(K,px+6,py-6,4,1)}}
  if(!on){r('rgba(20,12,30,.55)',px,py,16,16);r('#c8c0d0',px+4,py+7,8,1);return}
  if(s.it&&!STN[s.k].taps){g.drawImage(IC[s.it],px+3,py-3);bar(px+2,py+12,12,s.p,'#f8a040')}
  if(s.it&&STN[s.k].taps){g.drawImage(IC[s.it],px+3,py-1);bar(px+2,py+12,12,s.p/taps(),'#f8a040')}
  if(s.out){const b=((G.t*3)|0)%2;g.drawImage(IC[s.out],px+3,py-4+b);if(((G.t*4)|0)%3===0)r('#ffffff',px+13,py-3,1,1)}}}
function drawErin(ox,oy){const L=G.L,P=L.P,f=P.mv,px=Math.round((P.x-(P.x-P.ox)*f)*TS)+ox+2,py=Math.round((P.y-(P.y-P.oy)*f)*TS)+oy+1;
 const dir=P.fy<0?'u':P.fy>0?'d':P.fx<0?'l':'r',fr=f>0?(P.step%2):0,bob=f>0&&f<.5?-1:0;
 r('rgba(0,0,0,.22)',px+2,py+13,8,2);g.drawImage(ES[dir][fr],px,py+bob);
 if(L.held)drawHeld(L.held,px+6,py+bob-1);}
function drawField(ox,oy){const L=G.L;
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(y!==1)drawTile(x,y,kind(x,y)==='.'&&MAP[y][x]==='P'?'.':MAP[y][x]==='L'&&!L.pl[x+','+y]?'#':MAP[y][x],ox+x*TS,oy+y*TS);
 for(let y=2;y<ROWS;y++)for(let x=0;x<COLS;x++)drawThing(x,y,MAP[y][x],ox+x*TS,oy+y*TS);
 for(let i=0;i<3;i++){const cu=L.cu[i];if(!cu)continue;const s=whoSpr(cu.who),walk=cu.st==='in'||cu.st==='out',b=walk&&((G.t*8)|0)%2?-1:0;
  if(!s)continue;const x=Math.round(cu.x-s.width/2)+ox;
  if(cu.who==='LOUIE'){const sp=walk&&cu.side>0?A.LOU.l[((G.t*8)|0)%2]:walk?A.LOU.r[((G.t*8)|0)%2]:s;g.drawImage(sp,x,oy+4+b)}else g.drawImage(s,x,oy+3+b);}
 for(let x=0;x<COLS;x++)drawTile(x,1,MAP[1][x],ox+x*TS,oy+TS);
 for(const h of L.help)drawSp(h.t,ox+h.x,oy+h.y,h.mv&&((G.t*8+h.x)|0)%2?-1:0,h.carry);
 drawErin(ox,oy);
 const P=L.P,tx=P.x+P.fx,ty=P.y+P.fy,a=act(true);
 if(a.ok&&((G.t*3)|0)%3!==2){const x=ox+tx*TS,y=oy+ty*TS,c='#f8e060';[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].forEach(([u,v,su,sv])=>{const X=x+u*15,Y=y+v*15;r(c,X+(su<0?-3:0),Y,4,1);r(c,X,Y+(sv<0?-3:0),1,4)})}
 if(G.s==='play'){const t=plan();if(t&&t.x!==undefined&&(L.d<3||t.spr)&&!(t.x===tx&&t.y===ty)){const b=((G.t*4)|0)%2,x=ox+t.x*TS+8,y=oy+t.y*TS-8+b;
  r(K,x-4,y-1,9,3);r(K,x-3,y+2,7,2);r(K,x-2,y+4,5,1);r(K,x-1,y+5,3,1);r('#f8e060',x-3,y,7,1);r('#f8e060',x-2,y+2,5,1);r('#f8e060',x-1,y+3,3,1);r('#f8e060',x,y+4,1,1)}}
 for(const f of G.fx){if(f.k==='txt')text(f.s,ox+f.x-tw(f.s,2)/2,oy+f.y-Math.round(f.t*14),2,f.c);
  else if(f.k==='poof'){const k=Math.round(f.t*8);r('#e8e0f0',ox+f.x-k,oy+f.y-k,2,2);r('#e8e0f0',ox+f.x+k,oy+f.y-k,2,2);r('#e8e0f0',ox+f.x-k,oy+f.y+k-4,2,2);r('#e8e0f0',ox+f.x+k,oy+f.y+k-4,2,2)}}}
function drawCard(i,y){const cu=G.L.cu[i];if(!cu||cu.st==='out')return;const w=76,h=38,cx=WIN[i]*TS+8,rc=RC[cu.rc];
 const low=cu.st==='wait'&&cu.pat/cu.pmax<.25,x=cx-38+(low&&((G.t*16)|0)%2?1:0),bg=cu.st==='sad'?'#c8c0d0':cu.st==='in'?'#e8dcc4':'#fff4dc';
 r(K,x,y,w,h);r(bg,x+1,y+1,w-2,h-2);r(K,cx-3,y+h,7,1);r(bg,cx-2,y+h-1,5,1);r(K,cx-2,y+h+1,5,1);r(K,cx-1,y+h+2,3,1);r(bg,cx-1,y+h,3,1);r(bg,cx,y+h+1,1,1);
 r(WHO[cu.who].c,x+1,y+1,w-2,2);
 if(cu.st==='happy'||cu.st==='sad'){const ls=wrap(cu.say,w-6,1).slice(0,2);ls.forEach((l,j)=>ftext(l,cx,y+5+j*11,w-6,1,'#281c30',null));
  if(cu.st==='happy')ftext('+'+cu.gain,cx,y+27,w-6,1,'#a06808',null);return}
 ftext(rc.n,cx,y+5,w-6,1,'#281c30',null);
 drawFood(rc.c,x+12,y+31);rc.c.forEach((id,j)=>g.drawImage(IC[id],x+24+j*12,y+17));
 if(cu.st==='wait'){const f=cu.pat/cu.pmax;bar(x+3,y+h-5,w-6,f,f>.5?'#58c048':f>.25?'#f0c020':'#e84040')}}
function layout(){H=A.H();const VH=Math.max(H,250),s=H/VH;return{VH,s,top:Math.round((VH-250)*.45)};}
function begin(){const L2=layout();g.save();if(L2.s<1){g.translate(Math.round((W-W*L2.s)/2),0);g.scale(L2.s,L2.s)}return L2;}
function drawPlay(){const{VH,top}=begin(),L=G.L,fy=top+58;
 r('#5a3c2a',0,0,W,VH);for(let y=0;y<fy;y+=6)r('#4c3222',0,y,W,1);r('#3a2618',0,fy-1,W,1);
 r('#281c30',0,top,W,15);text('DAY '+(L.d+1),4,top+3,2,'#f8e060');
 const cs=String(L.coins);coinTxt(cs,92,top+3);stars(starsFor(L),104+tw(cs),top+4);
 const left=L.q.length-L.served-L.missed;rtextR(left+' TO GO',W-4,top+3,2,'#c8c0d8');
 for(let i=0;i<3;i++)drawCard(i,top+17);
 g.save();g.beginPath();g.rect(0,fy,W,ROWS*TS);g.clip();drawField(0,fy);g.restore();
 const hy=fy+ROWS*TS+2;r('#181020',0,hy-2,W,VH-hy+2);
 const a=act(true),hs=G.nope>0&&G.nopeS?G.nopeS:a.s;
 if(!hs&&!L.held&&L.P.mv===0)ftext('WALK UP TO SOMETHING, PRESS A',W/2,hy+2,232,2,'#686078',null);
 if(hs)ftext((a.ok&&!(G.nope>0)?'A: ':'')+hs,L.held?96:W/2,hy+2,L.held?186:232,2,G.nope>0?'#f89060':a.ok?'#ffffff':'#a8a0b8',null);
 if(L.held)text('B: TOSS',W-tw('B: TOSS')-3,hy+2,2,'#a8a0b8',null);
 g.restore();}
function rtextR(s,xr,y,sc,c){text(s,xr-tw(s,sc),y,sc,c);}

/* ---------- screens ---------- */
function list(items,sel,y,step,max,draw){const n=items.length,top=Math.max(0,Math.min(n-max,sel-((max/2)|0)));
 for(let k=0;k<Math.min(max,n);k++){const i=top+k,on=i===sel,yy=y+k*step;if(on){r('#f8e060',6,yy,W-12,step-1);r('#281c30',7,yy+1,W-14,step-3)}draw(items[i],i,on,yy)}
 if(top>0){r('#f8e060',117,y-5,6,2);r('#f8e060',119,y-7,2,2)}if(top+max<n){const b=y+max*step+1;r('#f8e060',117,b,6,2);r('#f8e060',119,b+2,2,2)}}
function cList(items,sel,y,step){items.forEach((s,i)=>{const on=i===sel,yy=y+i*step;if(on){const w=tw(s)+20;r('#f8e060',Math.round((W-w)/2),yy,w,step-1);r('#281c30',Math.round((W-w)/2)+1,yy+1,w-2,step-3)}
 ftext(s,W/2,yy+Math.round((step-1-8)/2),W-20,2,on?'#ffffff':'#c8c0d8')});}
function scene(VH){/* the title scene: dusk-pink sky, the stand, the garden */
 const sky=['#f8c8a0','#f8b098','#e898a8','#c890b8'];sky.forEach((c,i)=>r(c,0,i*Math.round(VH*.12),W,Math.round(VH*.12)+1));r('#c890b8',0,sky.length*Math.round(VH*.12),W,VH);
 r('#fff0b0',182,Math.round(VH*.1),14,14);r('#fff8d8',184,Math.round(VH*.1)+2,10,10);
 const gy=Math.round(VH*.62);r('#58b858',0,gy,W,VH-gy);r('#3c9848',0,gy,W,2);
 for(let row=0;row<3;row++)for(let i=0;i<7;i++){const x=10+i*16+(row%2)*6,y=gy+14+row*16;r('#8a5a3a',x,y+6,12,4);r('#3c9848',x+5,y+1,2,6);r(['#58b848','#e04030','#e8c050'][(i+row)%3],x+3,y,6,4)}
 const sx=132,sy=gy-44;r('#6a4830',sx,sy+16,4,30);r('#6a4830',sx+92,sy+16,4,30);
 for(let i=0;i<12;i++){r(i%2?'#ffffff':'#e85878',sx-4+i*9,sy,9,14);r(i%2?'#e0d0e0':'#b83858',sx-4+i*9,sy+14,9,3);r(i%2?'#ffffff':'#e85878',sx-2+i*9,sy+17,5,2)}
 r(K,sx-5,sy-1,110,1);r('#e8d0a0',sx-2,sy+32,100,8);r('#f8e8c0',sx-2,sy+32,100,2);r('#6a4830',sx-2,sy+40,100,6);
 drawFood(['bun','pat_c','let_c','tom_c'],sx+20,sy+33);drawFood(['let_c','tom_c'],sx+44,sy+33);g.drawImage(IC.smo,sx+60,sy+23);drawFood(['fry'],sx+80,sy+33);
 g.drawImage(ES.d[0],sx+40,sy+18);try{g.drawImage(A.LOU.r[((G.t*2)|0)%2],sx-28,gy-11)}catch(e){}}
function drawTitle(){const{VH}=begin();scene(VH);
 ftext('PATCH &',W/2,14,W-12,5,'#fff8e0','#783048');ftext('PLATE',W/2,42,W-12,5,'#fff8e0','#783048');ftext("ERIN'S FARM STAND",W/2,72,W-12,2,'#5a2848',null);
 const it=titleItems(),st=16,y0=VH-12-it.length*st;r('rgba(40,24,48,.78)',0,y0-6,W,it.length*st+10);cList(it,G.mi,y0,st);
 if(SV.day>0||SV.coins){const s='DAYS '+Math.min(SV.day,DAYS.length)+'/'+DAYS.length;text(s,4,y0-20,2,'#ffffff');coinTxt(SV.coins,W-12-tw(String(SV.coins)),y0-20)}
 g.restore();}
function drawStand(){const{VH}=begin();r('#3a2638',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#33202f',0,y,W,1);
 r('#e85878',0,0,W,26);for(let i=0;i<W;i+=16)r('#ffffff',i+8,0,8,26);r('#b83858',0,26,W,3);
 panel(30,3,180,20);ftext("ERIN'S STAND",W/2,8,170,3,'#f8e060',null);
 text('DAYS',6,35,2,'#c8c0d8');coinTxt(SV.coins,W-14-tw(String(SV.coins)),35);
 const it=standItems(),st=16,y0=50,max=Math.max(4,Math.floor((VH-y0-24)/st));
 list(it,G.si,y0,st,max,(x,i,on,yy)=>{const ty=yy+4;
  if(x.d!==undefined){const D=DAYS[x.d];if(x.lock){text('DAY '+(x.d+1),12,ty,2,'#686078');text('???',58,ty,2,'#686078');return}
   text('DAY '+(x.d+1),12,ty,2,on?'#f8e060':'#e8c870');ftext(D.n,58+60,ty,118,2,on?'#ffffff':'#c8c0d8');stars(SV.stars[x.d]|0,W-38,ty);return}
  ftext(x.k,W/2,ty,W-20,2,on?'#ffffff':'#a8d8f8')});
 const sel=it[G.si];let hint='';if(G.nope>0)hint=G.nopeS;else if(sel&&sel.d!==undefined&&!sel.lock)hint=SV.best[sel.d]?'BEST: '+SV.best[sel.d]+' COINS':'NEW!';
 if(hint)ftext(hint,W/2,VH-14,W-12,2,G.nope>0?'#f89060':'#a8a0b8',null);
 g.restore();}
function drawShop(){const{VH}=begin();r('#2a3a30',0,0,W,VH);text('UPGRADES',6,6,3,'#f8e060');coinTxt(SV.coins,W-14-tw(String(SV.coins)),9);
 const it=UPS.concat([null]),st=24,y0=28,max=Math.max(3,Math.floor((VH-y0-22)/st));
 list(it,G.ui,y0,st,max,(u,i,on,yy)=>{if(!u){ftext('BACK',W/2,yy+8,W-20,2,on?'#ffffff':'#a8d8f8');return}const lv=up(u[0]),mx=lv>=u[3].length;
  text(u[1],12,yy+3,2,on?'#ffffff':'#e8e0f0');text(u[2],12,yy+13,1,'#a8a0b8');
  for(let j=0;j<u[3].length;j++)r(j<lv?'#84d870':'#504860',W-60+j*6,yy+5,4,4);
  if(mx)rtextR('MAX',W-12,yy+12,1,'#84d870');else{const c=String(u[3][lv]);coinTxt(c,W-20-tw(c,2),yy+12,2,SV.coins>=u[3][lv]?'#f8d040':'#a08868')}});
 if(G.nope>0)ftext(G.nopeS,W/2,VH-14,W-12,2,'#f89060',null);g.restore();}
function drawBook(){const{VH}=begin();r('#f0e4c8',0,0,W,VH);r('#c8b088',0,0,W,22);r('#a08860',0,22,W,1);
 text(G.bp?'THE KITCHEN':'RECIPES',6,6,3,'#5a3c2a',null);rtextR('◀ ▶',W-6,8,2,'#7a5a40');
 const dmax=Math.min(SV.day+(G.L?1:0),DAYS.length-1),dd=G.L?Math.max(G.L.d,dmax):dmax,seen=new Set();for(let d=0;d<=Math.min(dd,DAYS.length-1);d++)DAYS[d].rc.forEach(k=>seen.add(k));
 if(!G.bp){const ks=RCORDER,st=Math.min(21,Math.floor((VH-48)/ks.length));ks.forEach((k,i)=>{const y=28+i*st,rc=RC[k],on=seen.has(k);
   if(!on){text('???',30,y+4,2,'#b8a888',null);return}drawFood(rc.c,14,y+14);text(rc.n,28,y+4,2,'#3a2618',null);
   rc.c.forEach((id,j)=>g.drawImage(IC[id],W-58+j*12,y+3));});}
 else{const rows=[['let','CHOP BOARD','let_c'],['tom','CHOP BOARD','tom_c'],['whe','OVEN','bun'],['pat','GRILL','pat_c'],['pot','FRYER','fry'],['ber','JUICER','smo']];
  rows.forEach(([a,s,b],i)=>{const y=30+i*24;g.drawImage(IC[a],10,y);text('→ '+s+' →',26,y+1,2,'#3a2618',null);g.drawImage(IC[b],W-24,y)});
  const yy=30+6*24+2,tips=['SEEDS: CRATES BY THE GARDEN.','PATTIES: THE PANTRY CRATE.','A ON A GROWING PLOT WATERS IT.','B TOSSES WHAT YOU HOLD.','SPROUT SEEDS: THE POT. PLANT, PLUCK!'];
  tips.forEach((t,i)=>ftext(t,W/2,yy+i*13,W-12,1,'#5a3c2a',null));}
 ftext(G.bookFrom==='stand'?'B: BACK':'B: BACK TO THE DAY',W/2,VH-13,W-12,1,'#7a5a40',null);g.restore();}
function drawCrew(){const{VH}=begin();r('#26402c',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#223a28',0,y,W,1);
 text('SPROUTS',6,6,3,'#f8e060');rtextR(SV.crew.length+' / 6',W-6,9,2,'#c8c0d8');
 const st=Math.min(36,Math.floor((VH-50)/6));
 SPORDER.forEach((T,i)=>{const y=28+i*st,C=SPT[T],on=crewHas(T),seed=SV.seeds.includes(T);
  r('#1a2c1e',4,y,W-8,st-3);
  if(on){drawSp(T,20,y+st-8,((G.t*2+i)|0)%2?-1:0);text(T,36,y+3,2,C.l);text(C.job,36,y+15,1,'#c8d8c0');
   const lv=spLv(T),nx=spNext(T);stars(lv,W-38,y+3);if(nx)bar(W-38,y+14,26,nx[0]/nx[1],C.c);else rtextR('MAX',W-12,y+14,1,'#84d870');}
  else if(seed){drawSeed(15,y+st/2-7,T);text(T+' SEED',36,y+3,2,'#a8c8a0');text('IN THE POT: PLANT IT, PLUCK IT',36,y+15,1,'#84d870');}
  else{r('#3a4a3c',16,y+st/2-5,8,8);text('???',36,y+3,2,'#68786a');const d=+Object.keys(SEEDDAY).find(k=>SEEDDAY[k]===T);text('A STAR ON DAY '+(d+1)+' EARNS IT',36,y+15,1,'#68786a');}});
 ftext('THEY LEVEL UP BY WORKING.   B: BACK',W/2,VH-13,W-12,1,'#a8c8a0',null);g.restore();}
function drawIntro(){drawPlay();const{VH}=begin(),L=G.L,D=DAYS[L.d];r('rgba(20,12,30,.72)',0,0,W,VH);
 const ph=200,py=Math.round((VH-ph)/2);panel(8,py,W-16,ph);
 ftext('DAY '+(L.d+1),W/2,py+8,W-30,4,'#f8e060',null);ftext(D.n,W/2,py+32,W-30,3,'#ffffff',null);
 const s=whoSpr(D.who),bx=18,by=py+56;r(WHO[D.who].c,bx,by,36,36);r('#281c30',bx+2,by+2,32,32);if(s){const sc=D.who==='LOUIE'?1:2;g.drawImage(s,bx+18-s.width*sc/2,by+18-s.height*sc/2,s.width*sc,s.height*sc)}
 text(D.who,bx,by+40,1,WHO[D.who].c,null);
 wrap(D.s,W-84,2).slice(0,6).forEach((l,i)=>text(l,62,by+i*12,2,'#e8e0f0',null));
 const gy=py+ph-58;text('GOAL',18,gy,2,'#c8c0d8',null);[0,1,2].forEach(i=>{const x=58+i*54;stars(i+1,x,gy+1);coinTxt(L.goal[i],x+(i+1)*8+4,gy)});
 text('CUSTOMERS: '+L.q.length,18,gy+16,2,'#c8c0d8',null);
 if(potNext()){const s2='SPROUT SEED!';rtextR(s2,W-18,gy+16,2,'#84d870');drawSeed(W-30-tw(s2),gy+12,potNext())}
 const blink=((G.t*2)|0)%2;ftext('A: OPEN THE STAND   B: BACK',W/2,py+ph-18,W-30,2,blink?'#ffffff':'#f8e060',null);g.restore();}
function drawPause(){drawPlay();const{VH}=begin();r('rgba(20,12,30,.78)',0,0,W,VH);const it=pauseItems(),ph=34+it.length*16,py=Math.round((VH-ph)/2);
 panel(30,py,W-60,ph);ftext('PAUSED',W/2,py+7,W-70,3,'#f8e060',null);cList(it,G.pi,py+28,16);
 ftext('SAVED. PICK IT UP ANY TIME.',W/2,py+ph+8,W-12,1,'#84d870',null);g.restore();}
function drawDone(){const{VH}=begin(),R2=G.res;scene(VH);r('rgba(20,12,30,.7)',0,0,W,VH);
 const ph=208,py=Math.round((VH-ph)/2);panel(10,py,W-20,ph);
 ftext(R2.st?'DAY '+(R2.d+1)+' DONE!':'SO CLOSE!',W/2,py+8,W-30,4,'#f8e060',null);
 const shown=Math.min(R2.st,Math.floor(G.t/.45));stars(shown,W/2-24,py+34,true);
 const rows=[['SERVED',R2.served+' / '+R2.n],['COINS','+'+R2.coins],['TIPS','+'+R2.tips]];
 rows.forEach(([a,b],i)=>{text(a,26,py+58+i*14,2,'#c8c0d8',null);rtextR(b,W-26,py+58+i*14,2,i===1?'#f8d040':'#ffffff')});
 let y=py+102;const note=s=>{ftext(s,W/2,y,W-34,2,'#84d870',null);y+=13};
 if(R2.unl)note('DAY '+(R2.d+2)+' IS OPEN!');if(R2.last)note('EVERY DAY DONE. WOW!');if(R2.seed)note('+ '+R2.seed+' SPROUT SEED!');if(R2.tix)note('+1 CAPSULE TICKET');if(R2.best)note('NEW BEST!');if(!R2.st)note('NEED '+(G.L?G.L.goal[0]:'')+' COINS FOR A STAR');
 cList(doneItems(),G.ri,py+ph-52,16);g.restore();}
function draw(){H=A.H();
 switch(G.s){case 'title':drawTitle();break;case 'stand':drawStand();break;case 'shop':drawShop();break;case 'crew':drawCrew();break;case 'book':drawBook();break;
  case 'intro':drawIntro();break;case 'play':drawPlay();break;case 'pause':drawPause();break;case 'done':drawDone();break;}}

/* put the phone down: the day pauses and saves */
try{document.addEventListener('visibilitychange',()=>{if(!A.active())return;if(document.hidden){if(G.s==='play'){G.s='pause';G.pi=0}snap()}});
 addEventListener('pagehide',()=>{if(A.active())snap()});}catch(e){}

/* ---------- cartridge label ---------- */
(()=>{const a=document.getElementById('cartArt4');if(!a||!a.getContext)return;const x=a.getContext('2d'),p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};
 p('#f8c8a0',0,0,40,9);p('#e898a8',0,9,40,8);p('#58b858',0,17,40,9);p('#3c9848',0,17,40,1);
 for(let i=0;i<7;i++){p(i%2?'#ffffff':'#e85878',4+i*4,3,4,4);p(i%2?'#e0d0e0':'#b83858',4+i*4,7,4,1)}p(K,3,2,30,1);
 p('#6a4830',5,8,1,9);p('#6a4830',30,8,1,9);p('#e8d0a0',4,13,28,3);p('#6a4830',4,16,28,1);
 p('#a86828',8,11,7,1);p('#4a2818',8,10,7,1);p('#58b848',8,9,7,1);p('#d89048',9,7,5,2);
 p('#e05888',20,8,3,5);p('#f0f0f8',20,8,3,1);p('#e04030',25,10,3,3);
 [[3,21],[11,22],[19,21],[27,22],[35,21]].forEach(([X,Y],i)=>{p('#8a5a3a',X-2,Y+2,6,2);p('#3c9848',X,Y-1,1,3);p(['#58b848','#e04030','#e8c050'][i%3],X-1,Y-2,3,2)});})();

return{
 start(){G.s='title';G.mi=0;G.t=0;G.fx=[];G.nope=0},
 mus:()=>'game',
 paused:()=>G.s==='pause'||G.s==='intro'||G.s==='book'&&G.bookFrom!=='stand',
 update,draw,
 _:{G,get SV(){return SV},set SV(v){SV=v},DAYS,RC,UPS,MAP,WIN,plan,need,act,walkable,kind,newDay,startDay,finish,snap,store,KEY,
  setDay(d){SV.day=d;store()}}};
};
