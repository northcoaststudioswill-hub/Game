
/* ---------- cartridge 4: PATCH & PLATE ---------- */
/* ============================================================
   PATCH & PLATE  -  cartridge 4 for the Pocket Lantern
   Erin's farm stand: plant it, cook it, serve it.
   Built from Erin's own wish list: short days (each one is a level, about
   one to two minutes), no story to remember, D-pad and A/B only, and it
   saves itself: after every day, every few seconds while you play, and the
   moment the phone is put down (the day pauses itself, too).

   Where it is (v0.4, the Sunkeep update): the stand is at SUNKEEP, in the valley
   of Sproutwild (cartridge 5), beside the Great Lantern. Same universe, separate
   games: nothing here reads or writes Sproutwild's save. The lore is flavour in
   the lines; there is still no story to remember.

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
   P garden plot   S seed crate   N sprout pot   B Louie's bowl   Z Louie's bed   D kibble   F loaf   c chop board   g grill   o oven   f fryer   j juicer
   L plate spot   K pantry (patties) */
const MAP=[
 'XXXXXXXXXXXXXXX',
 'CCWCCCCWCCCCWCC',
 '.......,B______',
 '.P.P.P.,Z_____g',
 '.......,______#',
 '.P.P.P.,__L___o',
 '.......,__L___#',
 '.P.P.P.,__L___f',
 '.......,______#',
 '.......,______j',
 '#SSSSSN,#ccFKD#'];
const WIN=[2,7,12];                                   /* the three serving windows (columns of row 1) */
const BIN={1:'let',2:'tom',3:'whe',4:'ber',5:'pot'};  /* seed crates along the bottom, by column */
const PLOTS=[[1,3],[3,3],[1,5],[3,5],[5,3],[5,5],[1,7],[3,7],[5,7]]; /* unlock order */
const PLATES=[[10,5],[10,6],[10,7]];
const SCH={c:'chop',g:'grill',o:'oven',f:'fryer',j:'juicer'};

/* ---------- food ---------- */
const CROP={spr:{n:'SPROUT',t:16,col:'#f8a0c8'},let:{n:'LETTUCE',t:7,col:'#58b848'},tom:{n:'TOMATO',t:9,col:'#e04030'},whe:{n:'WHEAT',t:8,col:'#e8c050'},
 ber:{n:'BERRIES',t:9,col:'#7050d0'},pot:{n:'POTATO',t:10,col:'#c89058'}};
const NM={let:'LETTUCE',tom:'TOMATO',whe:'WHEAT',ber:'BERRIES',pot:'POTATO',pat:'PATTY',
 let_c:'LETTUCE',tom_c:'TOMATO',bun:'BUN',pat_c:'PATTY',fry:'FRIES',smo:'SMOOTHIE',kib:'KIBBLE',loaf:'LOAF'};
const DOG={kib:1,loaf:1,let_c:1};
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
const RCORDER=['salad','gsalad','bread','burger','gburger','smoothie','fries','deluxe','combo'];

/* ---------- the days (levels). Lines are new: flag to Will (he hands out canon). ---------- */
const C1=['let'],C2=['let','tom'],C3=['let','tom','whe'],C6=['let','tom','whe','ber'],C7=['let','tom','whe','ber','pot'];
const S1=['chop'],S3=['chop','oven'],S4=['chop','oven','grill','pantry'],S6=S4.concat('juicer'),S7=S6.concat('fryer');
const DAYS=[
 {n:'FIRST SPROUTS',rc:['salad'],cr:C1,st:S1,cnt:4,gap:[16,20],who:'WILL',s:'THE LANTERN IS LIT, SO THE PATCH GROWS AGAIN. PLANT, PICK, CHOP, PLATE, SERVE. THE ARROW KNOWS THE WAY.'},
 {n:'TOMATO TIME',rc:['gsalad','salad'],cr:C2,st:S1,cnt:5,gap:[15,19],who:'SCOUT',s:'TOMATOES GET SLICED ON THE SAME BOARD. A BIG SALAD NEEDS BOTH ON ONE PLATE.'},
 {n:'BREAD DAY',rc:['bread','gsalad','salad'],cr:C3,st:S3,cnt:5,gap:[15,19],who:'RANGER',s:'WHEAT GOES IN THE OVEN. IT BAKES ON ITS OWN, SO GO DO SOMETHING ELSE.'},
 {n:'BURGER TIME',rc:['burger','bread','salad'],cr:C3,st:S4,cnt:6,gap:[14,18],who:'MARCUS',s:'PATTIES ARE IN THE CRATE, BRO. GRILL EM, BUN, DONE. I BASICALLY INVENTED BURGERS.'},
 {n:'LEAFY GREENS',rc:['gburger','burger','gsalad'],cr:C3,st:S4,cnt:6,gap:[14,18],who:'WILL',s:'CARRY A PLATE TO THE GRILL OR THE BOARD AND THE FOOD GOES RIGHT ON IT.'},
 {n:'BERRY GOOD',rc:['smoothie','burger','gsalad','bread'],cr:C6,st:S6,cnt:6,gap:[13,17],who:'LOUIE',s:'ARF! (BERRIES GO IN THE JUICER. LOUIE IS NOT ALLOWED A SMOOTHIE.)'},
 {n:'FRY DAY',rc:['fries','burger','smoothie'],cr:C7,st:S7,cnt:7,gap:[13,17],who:'MARCUS',s:'POTATOES IN THE FRYER. FRIES. YOU\'RE WELCOME. TELL WILL HE\'S A J.'},
 {n:'THE DELUXE',rc:['deluxe','gburger','fries','smoothie'],cr:C7,st:S7,cnt:7,gap:[13,17],who:'SCOUT',s:'THE DELUXE IS EVERYTHING: BUN, PATTY, LETTUCE, TOMATO. FOUR THINGS, ONE PLATE.'},
 {n:'COMBO MEALS',rc:['combo','deluxe','gsalad','smoothie'],cr:C7,st:S7,cnt:7,gap:[13,16],who:'RANGER',s:'A BURGER AND FRIES, ONE PLATE. FOLKS LOVE A COMBO.'},
 {n:'LUNCH RUSH',rc:['burger','gburger','fries','smoothie','gsalad','bread'],cr:C7,st:S7,cnt:8,gap:[11,14],who:'WILL',s:'IT GETS BUSY AT NOON. PLANT AHEAD AND KEEP THE GRILL GOING.'},
 {n:'MARKET DAY',rc:['deluxe','combo','smoothie','fries','salad'],cr:C7,st:S7,cnt:9,gap:[11,13],who:'MARCUS',s:'LANTERN TOWN CAME DOWN THE ROAD, BRO. I TOLD EVERYONE. YOU\'RE WELCOME AGAIN.'},
 {n:'HARVEST FEST',rc:RCORDER.slice(),cr:C7,st:S7,cnt:10,gap:[10,13],who:'LOUIE',s:'AWOOO! (THE FIRST HARVEST FEST SINCE THE DARK. EVERYONE IN THE VALLEY IS HUNGRY.)'},
 {n:'LANTERN NIGHT',eve:1,rc:RCORDER.slice(),cr:C7,st:S7,cnt:11,gap:[10,12],who:'ELDER',s:'A FEAST UNDER THE GREAT LANTERN, LIKE THE OLD DAYS. THIS VALLEY WAS PROMISED TO SPROUTS AND BUDDIES. TONIGHT IT EATS.'}];

/* ---------- the customers (lines are new) ---------- */
const WHO={
 WILL:{c:'#f8e060',yum:['THANKS, ERIN!','SO GOOD.','THE LANTERN APPROVES.','BEST STAND AROUND.','YOU\'RE THE BEST.','I LOVE YOU. AND THIS.','TEN STARS.','WORTH THE WALK.'],bye:['I\'LL BE BACK!','SAVE ME ONE LATER?']},
 MARCUS:{c:'#f8a040',yum:['BRO. ELITE.','TEN OF TEN. LIKE ME.','DAP ME UP, CHEF.','PUT IT ON MY TAB.','SEE ONE, SEND ONE.','GOING ON MY STORY.','WILL COULD NEVER.','AURA: FED.','TAKE THAT, BOTTIE.'],bye:['BRO, I GOTTA GO.','I\'M TELLING NO ONE.']},
 SCOUT:{c:'#78c870',yum:['NOTED: DELICIOUS.','YUM. FOR SCIENCE.','NOTED: CALM AND FED.'],bye:['NEXT TIME!']},
 RANGER:{c:'#e8c888',yum:['GOOD TRAIL FOOD.','THANK YOU KINDLY.','BEATS DOME RATIONS.'],bye:['BACK TO THE TRAIL.']},
 ELDER:{c:'#c8c8ce',yum:['LIKE BEFORE THE DARK.','A PROMISE, KEPT.','TOWN SAYS THANKS.'],bye:['LONG ROAD HOME.']},
 PIP:{c:'#f0c020',yum:['WORTH TEN BUGS!','SOLD! I MEAN, YUM!','BEST TRADE ALL DAY.'],bye:['BUGS TO CATCH. BYE!']},
 DEREK:{c:'#5a9af0',yum:['YO. ELITE.','COLD ONE?','TRUCK FOOD. NICE.','TELL MARCUS NOTHING.'],bye:['THE TRUCK CALLS.']},
 BOTTIE:{c:'#58c8d8',yum:['BZZT. YUM.','TIP: NONE. CLANK.','FOR THE FEED, GANG.'],bye:['CLANK. RUDE.']},
 LOUIE:{c:'#e89040',yum:['WOOF!','ARF ARF!','*HAPPY SPIN*'],bye:['*SAD LITTLE WHINE*']}};
const PEOPLE=['WILL','MARCUS','SCOUT','RANGER'];
/* v0.4: two faces from Lantern Town (Sproutwild) walk down the road now and then: the ELDER from BREAD DAY on, PIP from BERRY GOOD on */
/* v0.5: Will and Marcus come by most. DEREK (Flow Pros truck) from BURGER TIME on, BOTTIE (yes, that robot) from FRY DAY on. Bottie never tips. */
const WHODAY={ELDER:2,DEREK:3,PIP:5,BOTTIE:6};
const peopleFor=d=>['WILL','WILL','WILL','MARCUS','MARCUS','MARCUS','SCOUT','SCOUT','RANGER','RANGER'].concat(Object.keys(WHODAY).filter(w=>d>=WHODAY[w]));
let DEREKS=null;
function derekSpr(){return DEREKS||(DEREKS=mk(['....kkkk....','..kkcccckk..','.kcCCcccccc.','kkkkkkkkkkkk','.kffffffffk.','.kfkffffkfk.','.krrffffrrk.','.krrrrrrrrk.','..kkkkkkkk..','.kfttttttfk.','.kftTttTtfk.','..kttttttk..','..kbbkkbbk..','..kkk..kkk..'],
 {k:K,c:'#2a6ad0',C:'#5a9af0',f:'#e8b088',r:'#8a5f30',t:'#a03a2e',T:'#c85a48',b:'#3c4a66'}));}
function whoSpr(w){try{if(w==='WILL')return A.will().pd;if(w==='LOUIE')return A.LOU.l[0];if(w==='DEREK')return derekSpr();if(w==='ELDER'||w==='PIP'||w==='BOTTIE')return A.sw().chr[w].img;if(BUDS.some(b=>b[0]===w))return A.sw().bud(w).img;return A.CH[w]}catch(e){return null}}

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

/* ---------- save files ----------
   Three files. File 1 keeps the first key ('patchplate-v1'), so saves made before files existed carry on.
   'patchplate-meta' remembers the file played last. Add new fields with defaults; never rename the keys. */
const SLOTKEY=['patchplate-v1','patchplate-v1-s2','patchplate-v1-s3'],METAKEY='patchplate-meta',KEY=SLOTKEY[0];
const DEF=()=>({v:1,day:0,stars:{},best:{},coins:0,earned:0,served:0,up:{},tix:{},plays:0,run:null,seeds:[],crew:[],cxp:{},tasted:{},opened:0,buds:[],big:{},story:{},fav:{},
 look:{dress:0,apron:0,hat:0,awn:0},own:{dress:[0],apron:[0,3],hat:[0],awn:[0]},friend:{},hseen:{},hpend:[],lou:{fed:0,pets:0},daily:null,asksDone:0});
function fixSV(s){const o=Object.assign(DEF(),s);
 for(const k of ['stars','best','up','tix','cxp','tasted','friend','hseen','lou','big','story','fav'])o[k]=Object.assign(DEF()[k],s[k]||{});
 for(const k of ['seeds','crew','hpend','buds'])o[k]=Array.isArray(s[k])?s[k].slice():[];
 o.look=Object.assign(DEF().look,s.look||{});const own=DEF().own;o.own={};for(const k in own)o.own[k]=Array.isArray((s.own||{})[k])?s.own[k].slice():own[k];return o;}
function readSlot(i){try{const s=JSON.parse(localStorage.getItem(SLOTKEY[i])||'null');return s&&typeof s==='object'?fixSV(s):null}catch(e){return null}}
const slotUsed=i=>{try{return !!localStorage.getItem(SLOTKEY[i])}catch(e){return false}};
let SV=DEF(),SLOT=0;
function store(){try{localStorage.setItem(SLOTKEY[SLOT],JSON.stringify(SV))}catch(e){}}
function useSlot(i){SLOT=i;SV=readSlot(i)||DEF();grantSeeds();lookChanged();try{localStorage.setItem(METAKEY,JSON.stringify({slot:i}))}catch(e){}}
function eraseSlot(i){try{localStorage.removeItem(SLOTKEY[i])}catch(e){}if(i===SLOT){SV=DEF();lookChanged()}}
const lastSlot=()=>{try{const m=JSON.parse(localStorage.getItem(METAKEY)||'null');return m&&m.slot>=0&&m.slot<3?m.slot:0}catch(e){return 0}};
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
const SPJOIN={DEW:'DEW JOINED THE CREW! IT WILL WATER THE GARDEN FOR YOU.',PEB:'PEB JOINED THE CREW! IT WILL CHOP ANYTHING ON THE BOARD.',
 EMBER:'EMBER JOINED THE CREW! IT KEEPS THE STOVE EXTRA HOT.',ZIP:'ZIP JOINED THE CREW! IT RUNS FINISHED FOOD TO THE PLATES.',
 LEAF:'LEAF JOINED THE CREW! IT REPLANTS WHAT THE ORDERS NEED.',LUCKY:'LUCKY JOINED THE CREW! CUSTOMERS TIP MORE AND WAIT LONGER.'};
const SEEDDAY={0:'DEW',1:'PEB',3:'EMBER',4:'ZIP',6:'LEAF',8:'LUCKY'};
const SPHOME={DEW:[4,8],PEB:[11,9],EMBER:[13,4],ZIP:[12,8],LEAF:[2,8],LUCKY:[5,2]};
const hasSp=T=>SV.seeds.includes(T)||SV.crew.includes(T);
/* saves from before the crew existed get the seeds their stars already earned */
function grantSeeds(){for(const d in SEEDDAY)if((SV.stars[d]|0)>=1&&!hasSp(SEEDDAY[d]))SV.seeds.push(SEEDDAY[d]);}
const spLv=T=>{const x=SV.cxp[T]|0;return x>=60?3:x>=20?2:1},spNext=T=>{const x=SV.cxp[T]|0;return x>=60?null:x>=20?[x-20,40]:[x,20]};
const spSpd=T=>1+.3*(spLv(T)-1);
const crewHas=T=>SV.crew.includes(T);

/* ---------- sprites ---------- */
const EP={k:K,h:'#b84828',H:'#e87848',f:'#f8dcb0',d:'#9070d0',D:'#c0a8f0',b:'#583828',a:'#f8f0e0',A:'#e0d0c0'};
const eFront=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khffffffhk.','.khfkffkfhk.','.khffffffhk.','.khhffffhhk.','.khkdaadkhk.','.kkdaaaadkk.','..kdaaaadk..','.kddaAaaddk.','.kddaaaaddk.'],
 eBack=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khhhhhhhhk.','.khHhhhhhhk.','.khhhhhhhhk.','.khhhhhhhhk.','.khkddddkhk.','.kkddaaddkk.','..kdddddDk..','.kddDdddddk.','.kddddddddk.'],
 eSide=['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khhhhffffk.','.khhhhffkfk.','.khhhhffffk.','.khhhhfffk..','.khhkdddk...','..kkdaaak...','...kdaaak...','..kddaaadk..','..kddaaadk..'];
const FEET=['..kkbkkbkk..','..kbbk.kbk..'],SFEET=['...kkbkbk...','..kbk..kbk..'];
/* ---------- Erin's wardrobe (new: flag to Will). [name, colour, light colour, unlock]
   unlock: coins, or 'heart:WHO:n' (a heart with someone), or 'stars:n' (stars across all days) */
const DRESS=[['LILAC','#9070d0','#c0a8f0',0],['SAGE','#5a9858','#90c888',40],['SKY','#4880d0','#90c0f0',40],['SUNNY','#d8a020','#f8d870',60],['ROSE','#c84870','#f090b0',60],['MIDNIGHT','#3a3850','#6a6888',90]];
const APRON=[['CREAM','#f8f0e0','#e0d0c0',0],['CHERRY','#e85060','#c03848',50],['MINT','#a8e8c8','#78c8a0',50],['NO APRON',null,null,0]];
const HAT=[['NO HAT',0],['BANDANA',40],['STRAW HAT',70],['FLOWER CROWN','heart:WILL:2'],['CHEF HAT','stars:18'],['BRO CAP','heart:MARCUS:3']];
const AWN=[['PINK','#e85878','#b83858',0],['SKY','#4890e0','#2860a8',50],['MINT','#48b888','#287858',50],['GOLD','#e8b030','#a87810',80],['LANTERN','#f0b828','#3a3350',90]];
const WARD={dress:DRESS,apron:APRON,hat:HAT,awn:AWN},WCAT=[['dress','DRESS'],['apron','APRON'],['hat','HAT'],['awn','AWNING']];
const awn=()=>AWN[SV.look.awn]||AWN[0];
function erinPal(look){const d=DRESS[look.dress]||DRESS[0],a=APRON[look.apron]||APRON[0];return Object.assign({},EP,{d:d[1],D:d[2],a:a[1]||d[1],A:a[2]||d[2]});}
function buildErin(look){const P=erinPal(look),o={d:[mk([...eFront,FEET[0]],P),mk([...eFront,FEET[1]],P)],u:[mk([...eBack,FEET[0]],P),mk([...eBack,FEET[1]],P)],
 r:[mk([...eSide,SFEET[0]],P),mk([...eSide,SFEET[1]],P)]};o.l=o.r.map(flip);return o;}
const ES={},ECACHE={};
function lookChanged(){Object.assign(ES,buildErin(SV.look));}
function erinFront(look){const k=look.dress+','+look.apron;return ECACHE[k]||(ECACHE[k]=buildErin(look).d[0]);}
/* a hat on Erin's 12x14 sprite; x,y = the sprite's top-left, s = scale */
function drawHat(h,x,y,dir,s=1){if(!h)return;const m=dir==='l',p=(c,a,b,w,hh)=>r(c,x+(m?(12-a-w):a)*s,y+b*s,w*s,hh*s);
 switch(h){
 case 1:p('#d83838',2,1,8,2);p('#f07070',3,1,2,1);if(dir==='u')p('#d83838',5,3,2,2);else if(dir==='d')p('#d83838',9,2,2,1);else p('#d83838',0,2,2,2);break;
 case 2:p(K,-1,3,14,1);p('#e8c060',-1,2,14,1);p('#d8a840',2,-1,8,3);p('#c84848',2,1,8,1);break;
 case 3:p('#58b848',1,3,10,1);[[1,'#f890c0'],[4,'#fff0a0'],[7,'#f890c0'],[10,'#a8d8f8']].forEach(([a,c])=>p(c,a,1,2,2));break;
 case 4:p(K,2,1,8,2);p('#e0e0e8',3,1,6,1);p('#ffffff',2,-5,8,6);p('#ffffff',3,-6,6,1);p('#e0e0e8',4,-4,1,4);break;
 case 5:p('#284878',2,0,8,3);p('#5080b8',3,0,3,1);if(dir==='d')p('#1a3058',2,3,8,1);else if(dir==='u')p('#1a3058',3,3,6,1);else p('#1a3058',8,2,4,1);break;}}
function erinActor(cx,by,sc,bob=0,look=SV.look){const s=look===SV.look?ES.d[0]:erinFront(look),x=Math.round(cx-6*sc),y=Math.round(by-14*sc)+bob;g.drawImage(s,x,y,12*sc,14*sc);drawHat(look.hat,x,y,'d',sc);}

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
 IC.kib=mk(['..........','..........','...k.kk...','..kbkbbk..','.kbBbkbBk.','kbbkbBkbbk','kBbbkbbkbk','.kkbbkbbk.','...kkkkk..','..........'],P({b:'#a86838',B:'#d09050'}));
 IC.loaf=mk(['..kkkkkk..','.kssssssk.','.kkkkkkkk.','.krrrrrrk.','.krwwwwrk.','.krwbbwrk.','.krwwwwrk.','.krrrrrrk.','.kssssssk.','..kkkkkk..'],P({s:'#c8c8d8',r:'#c84848',w:'#f8f0e0',b:'#8a5030'}));
 IC.star=mk(['...k...','..kyk..','kkyyykk','kyyyyyk','.kyyyk.','.kykyk.','.kk.kk.'],{k:K,y:'#f8d040'});
 IC.nostar=mk(['...k...','..kyk..','kkyyykk','kyyyyyk','.kyyyk.','.kykyk.','.kk.kk.'],{k:'#504860',y:'#3a3048'});
 IC.coin=mk(['.kkkk.','kyYYyk','kyYyyk','kyyyyk','kyyydk','.kkkk.'],{k:K,y:'#f8c030',Y:'#fff0a0',d:'#c08010'});
})();

useSlot(lastSlot());

/* ---------- state ---------- */
const G={s:'title',t:0,mi:0,si:0,ui:0,bi:0,bp:0,pi:0,ri:0,arm:0,L:null,fx:[],res:null,bookFrom:'stand',nope:0,nopeS:''};

/* ---------- days ---------- */
function newDay(d){const D=DAYS[d],L={d,t:0,P:{x:7,y:6,fx:0,fy:-1,mv:0,ox:7,oy:6,step:0},held:null,plots:[],st:{},pl:{},
  cu:[null,null,null],q:[],qi:0,spawnT:2.5,coins:0,tips:0,served:0,missed:0,endT:0,saveT:0,sown:[],help:[],jobs:{}};
 SV.crew.forEach(T=>L.help.push(newHelper(T)));
 L.lou=d>=1?{st:'nap',t:0,next:R(9,14),want:null,bowl:[],mood:60,changed:0,chT:null,say:null,petT:0,pets:0,nope:0}:null;
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
  if(!p.c){if(h&&h.k==='bag')return go('PLANT '+CROP[h.id].n,()=>{p.c=h.id;p.g=0;p.w=up('grow')>=2?1:0;p.ding=0;h.n--;if(h.n<=0)L.held=null;SFX.plant();bumpAsk('plant')});
   return no(h?'HANDS FULL':'EMPTY: GET SEEDS');}
  if(p.g<1){if(!h&&!p.w)return go('WATER IT',()=>{p.w=1;SFX.water()});return no(CROP[p.c].n+': GROWING');}
  if(!h)return go('PICK '+CROP[p.c].n,()=>{L.held={k:'it',id:p.c};p.last=p.c;p.c=null;p.g=0;p.w=0;p.ding=0;SFX.pick()});
  return no('HANDS FULL');}
 if(k==='N'){const T=potNext();if(!T)return no(SV.crew.length>=6?'SPROUT POT: ALL GROWN UP':'SPROUT POT: EARN SEEDS ON NEW DAYS');
  if(!h)return go('TAKE THE '+T+' SPROUT SEED',()=>{L.held={k:'sseed',id:T};L.sown.push(T);SFX.pick()});return no('HANDS FULL');}
 if(k==='B'){const o=L.lou;if(!o)return no('LOUIE\'S BOWL');
  if(h&&h.k==='it'&&DOG[h.id]){if(o.st==='eat')return no('LOUIE IS EATING');if(o.bowl.length>=2||o.bowl.includes(h.id))return no('THE BOWL IS FULL');
   return go('PUT '+NM[h.id]+' IN THE BOWL',()=>{o.bowl.push(h.id);L.held=null;o.nope=0;SFX.put()});}
  if(!h&&o.bowl.length&&o.st!=='eat')return go('TAKE THE '+NM[o.bowl[o.bowl.length-1]]+' BACK',()=>{L.held={k:'it',id:o.bowl.pop()};o.nope=0;SFX.pick()});
  if(h&&h.k==='it')return no('LOUIE WON\'T EAT '+NM[h.id]);
  return no(o.st==='want'?'LOUIE WANTS '+louNames(o.want):'LOUIE\'S BOWL');}
 if(k==='Z'){const o=L.lou;if(!o)return no('LOUIE IS NAPPING AT HOME');if(h)return no(o.st==='want'?'PUT IT IN HIS BOWL':'LOUIE');
  if(o.petT>0)return no('LOUIE IS ONE HAPPY DOG');return go('PET LOUIE',()=>petLou());}
 if(k==='D'){if(!L.lou)return no('KIBBLE');if(!h)return go('TAKE KIBBLE',()=>{L.held={k:'it',id:'kib'};SFX.pick()});return no('HANDS FULL');}
 if(k==='F'){if(!L.lou)return no('LOAF');if(!h)return go('TAKE A LOAF',()=>{L.held={k:'it',id:'loaf'};SFX.pick()});return no('HANDS FULL');}
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
  if(h.k==='it'){if(RAWHINT[h.id])return no(RAWHINT[h.id]);if(h.id==='kib'||h.id==='loaf')return no('THAT\'S LOUIE\'S FOOD');if(!canAdd(c,h.id))return no(c.includes(h.id)?'ALREADY ON IT':'PLATE IS FULL');
   return go('ADD '+NM[h.id]+' TO PLATE',()=>{c.push(h.id);L.held=null;SFX.plate()});}
  return no('HANDS FULL');}
 if(k==='W'){const i=WIN.indexOf(tx),cu=L.cu[i];if(!cu||cu.st!=='wait')return no(cu?'':'NOBODY HERE YET');const rc=RC[cu.rc],hc=contsOf(h);
  if(hc&&same(hc,rc.c))return go('SERVE '+rc.n,()=>serve(i));return no(cu.who+' WANTS '+rc.n);}
 return no('');}
function toss(){const L=G.L;if(!L.held)return;if(L.held.k==='sseed')L.sown.splice(L.sown.indexOf(L.held.id),1);L.held=null;SFX.toss();const P=L.P;G.fx.push({k:'poof',x:P.x*TS+8,y:P.y*TS,t:0});}
function serve(i){const L=G.L,cu=L.cu[i],rc=RC[cu.rc],tip=Math.round(rc.v*(crewHas('LUCKY')?.5+.1*spLv('LUCKY'):.5)*(louHappy()?1.1:1)*Math.max(0,cu.pat/cu.pmax)*(cu.who==='BOTTIE'&&heartsOf('BOTTIE')<4?0:1)),c=rc.v+tip;
 L.coins+=c;L.tips+=tip;L.served++;L.held=null;cu.st='happy';cu.t=0;cu.say=pick(WHO[cu.who].yum);cu.gain=c;SFX.serve();
 L.streak=(L.streak|0)+1;const left=L.q.length-L.served-L.missed;
 const fav=FAV[cu.who]===cu.rc;if(fav){cu.say=FAVSAY[cu.who];SV.fav[cu.who]=1;G.fx.push({k:'txt',s:'FAVORITE!',x:WIN[i]*TS+8,y:TS+14,t:0,c:'#f878a8'})}
 friend(cu.who,((cu.pat/cu.pmax>.5?2:1)+(fav?2:0))*(WHODAY[cu.who]?3:1));bumpAsk('serve');bumpAsk('streak',L.streak,1);if(['burger','gburger','deluxe','combo'].includes(cu.rc))bumpAsk('burger');
 if(!SV.tasted[cu.rc]){SV.tasted[cu.rc]=1;store();const w=cu.who;cine('taste',{who:w,rc:cu.rc},[[w,w==='MARCUS'&&TASTE_M[cu.rc]?TASTE_M[cu.rc]:TASTE[cu.rc]]])}
 else if(cu.pat/cu.pmax<.2)quip('clutch',1);else if(left===0&&L.q.length>3)quip('last',1);else if(L.streak===4||L.streak===8)quip('streak',1);else if(L.served===1&&Math.random()<.5)quip('first');
 G.fx.push({k:'txt',s:'+'+c,x:WIN[i]*TS+8,y:TS+4,t:0,c:'#f8d040'});
 if(G.s==='play'&&L.streak===5&&bigOnce('s5')){L.bigDone=1;big('MARCUS','FIVE IN|A ROW!',[['MARCUS','FIVE STRAIGHT, BRO! SEE ONE, SERVE ONE!']])}
 else if(G.s==='play'&&L.streak===8&&bigOnce('s8')){L.bigDone=1;big('WILL','EIGHT IN|A ROW!',[['WILL','EIGHT! ERIN, YOU ARE ON FIRE. NOT THE GRILL KIND.']])}}

/* ---------- the crew at work ---------- */
function potNext(){const L=G.L,left=SV.seeds.slice();L.sown.forEach(T=>{const i=left.indexOf(T);if(i>=0)left.splice(i,1)});return left[0]||null;}
function newHelper(T,x,y){const[hx,hy]=SPHOME[T];return{t:T,x:x!==undefined?x:hx*TS+8,y:y!==undefined?y:hy*TS+12,goal:null,cd:0,carry:null,wait:0,at:null,mv:0,lv:spLv(T)};}
function pluck(p){const L=G.L,T=p.sp;p.c=null;p.sp=null;p.g=0;p.w=0;p.ding=0;
 const i=SV.seeds.indexOf(T);if(i>=0)SV.seeds.splice(i,1);const j=L.sown.indexOf(T);if(j>=0)L.sown.splice(j,1);
 if(!SV.crew.includes(T))SV.crew.push(T);store();L.help.push(newHelper(T,p.x*TS+8,p.y*TS+12));
 cine('sprout',{T},[['NEW HELPER',SPJOIN[T]]]);
 snd(900,.06,1800,'sine',.06);later(()=>snd(1400,.08,2200,'sine',.05),90);}
const keyXY=k=>k.split(',').map(Number);
function openRecs(){const L=G.L,o=[];L.cu.forEach(c=>{if(c&&(c.st==='wait'||c.st==='in'))o.push(RC[c.rc].c)});if(!o.length&&L.qi<L.q.length)o.push(RC[L.q[L.qi]].c);return o;}
function plateFor(id){const L=G.L,recs=openRecs(),fits=c=>recs.some(R=>c.every(x=>R.includes(x)));let best=null;
 for(const k in L.pl){const c=L.pl[k];if(canAdd(c,id)&&fits(c.concat(id))&&(!best||c.length>L.pl[best].length))best=k}return best;}
function spWork(h){SV.cxp[h.t]=(SV.cxp[h.t]|0)+1;G.L.jobs[h.t]=(G.L.jobs[h.t]|0)+1;const lv=spLv(h.t);if(lv>h.lv){SFX.star();quipSp(h.t,h.t+' GREW TO LEVEL '+lv+'! IT WORKS FASTER NOW.');G.fx.push({k:'txt',s:h.t+' LEVEL '+lv+'!',x:h.x,y:h.y-10,t:0,c:SPT[h.t].l})}h.lv=lv;}
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

/* ---------- Louie (lines are new: flag to Will) ----------
   He naps on his bed by the bowl. Every so often he wants something: dry kibble, a loaf, or fresh lettuce
   (chopped, from the garden), sometimes a mix of two. Sometimes he changes his mind while he waits.
   Feeding him fills his mood; a happy Louie (60+) charms customers into tipping 10% more. A on him pets him. */
const LOU1=[['kib'],['loaf'],['let_c']],LOU2=[['kib','loaf'],['kib','let_c'],['loaf','let_c']];
const louNames=w=>w.map(x=>NM[x]).join(' + ');
const louHappy=()=>G.L&&G.L.lou&&G.L.lou.mood>=60;
function louPick(not){const L=G.L,pool=LOU1.concat(L.d>=2?LOU2:[]).filter(w=>!not||!same(w,not));return pick(pool).slice();}
function louSay(s){if(G.L.lou)G.L.lou.say={s,t:0};}
function louUpd(dt){const L=G.L,o=L.lou;if(!o)return;o.t+=dt;if(o.petT>0)o.petT-=dt;if(o.say){o.say.t+=dt;if(o.say.t>1.6)o.say=null}
 if(o.st==='nap'){o.mood=Math.max(0,o.mood-.12*dt);if(o.t>=o.next){o.st='want';o.t=0;o.want=louPick();o.changed=0;o.nope=0;o.hungry=0;
   o.chT=L.d>=2&&Math.random()<.35?R(5,10):null;louSay('!');snd(620,.05,420,'square',.04);
   if(!L.louTold){L.louTold=1;quipLine('LOUIE','ARF! (LOUIE WANTS '+louNames(o.want)+'. HIS BOWL IS BY HIS BED.)',1)}else if(Math.random()<.4)quipLine('LOUIE','ARF! (LOUIE WANTS '+louNames(o.want)+'.)')}}
 else if(o.st==='want'){o.mood=Math.max(0,o.mood-(o.t>14?.8:.2)*dt);
  if(o.chT&&o.t>=o.chT&&!o.changed&&!same(o.bowl,o.want)){const old=o.want;o.changed=1;o.want=louPick(old);louSay('?!');snd(880,.05,1200,'square',.04);
   const ln=pick([['LOUIE','ARF?! (ACTUALLY... '+louNames(o.want)+'.)'],['ERIN','LOUIE. YOU SAID '+louNames(old)+'.'],['LOUIE','*STARES AT THE '+(o.want.includes('loaf')?'LOAF':'KIBBLE')+'* (NEW PLAN.)'],['MARCUS','BRO, THE DOG CHANGED HIS ORDER. RESPECT.']]);quipLine(ln[0],ln[1],1)}
  if(o.t>15&&!o.hungry){o.hungry=1;const ln=pick([['LOUIE','*STARES AT YOU. STARES HARDER.*'],['MARCUS','BRO, FEED THE DOG. HE\'S LOOKING AT ME.'],['WILL','LOUIE\'S DOING THE SAD EYES AGAIN.']]);quipLine(ln[0],ln[1])}
  if(o.bowl.length&&same(o.bowl,o.want)){o.st='eat';o.t=0;snd(300,.04,0,'square',.03)}
  else if(o.bowl.some(x=>!o.want.includes(x))&&!o.nope){o.nope=1;louSay('*SNIFF* NOPE');snd(220,.08,160,'square',.03)}}
 else if(o.st==='eat'){if(o.t>1.8){o.st='happy';o.t=0;o.bowl=[];o.mood=Math.min(100,o.mood+35);SV.lou.fed=(SV.lou.fed|0)+1;L.louFed=(L.louFed|0)+1;
   friend('LOUIE',2);bumpAsk('feed');snd(988,.05);later(()=>snd(1319,.1),80);
   const ln=pick([['ERIN','GOOD BOY, LOUIE.'],['LOUIE','*HAPPY SPIN*'],['WILL','HE\'S SO SPOILED. I LOVE IT.'],['LOUIE','ARF! (FIVE STARS. NO NOTES.)'],['MARCUS','THAT DOG EATS BETTER THAN ME, BRO.']]);quipLine(ln[0],ln[1])}}
 else if(o.st==='happy'){if(o.t>2.4){o.st='nap';o.t=0;o.next=R(26,40)}}}
function petLou(){const L=G.L,o=L.lou;o.petT=6;o.mood=Math.min(100,o.mood+8);louSay('<3');snd(620,.05,420,'square',.04);later(()=>snd(700,.05,480,'square',.04),110);
 if(o.pets<3){o.pets++;friend('LOUIE',1)}bumpAsk('pet');
 if(Math.random()<.35){const ln=pick([['LOUIE','*LEANS INTO THE SCRATCH*'],['ERIN','WHO\'S A GOOD STAND DOG? YOU ARE.'],['LOUIE','ARF. (RIGHT THERE. YES.)']]);quipLine(ln[0],ln[1])}}

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
 if(h&&h.k==='it'&&(h.id==='kib'||h.id==='loaf')){const o=L.lou;return o&&o.st==='want'&&o.want.includes(h.id)&&!o.bowl.includes(h.id)?{x:8,y:2}:{toss:1};}
 if(h&&h.k==='it'&&h.id==='let_c'&&L.lou&&L.lou.st==='want'&&L.lou.want.includes('let_c')&&!L.lou.bowl.includes('let_c'))return{x:8,y:2};
 if(h&&h.k==='it'){const id=h.id;
  if(RAWHINT[id]){if(need(true,2)[PROC[id]]<0)return{toss:1};const s=stationFor(id,true);if(s)return s;
   /* every station that takes it is holding finished food: nowhere to put it */
   return Object.values(L.st).some(t=>t.k===STOF[id]&&t.it)?null:{toss:1};}
  const best=spots.filter(s=>canAdd(s.c,id)&&fits(s.c.concat(id))).sort((a,b)=>b.c.length-a.c.length)[0];
  if(best)return{x:best.x,y:best.y};
  /* nowhere to put it: toss it so the hands are free to serve (food is free) */
  return{toss:1};}
 if(h&&h.k==='bag'){const p=L.plots.find(p=>!p.c);return p?{x:p.x,y:p.y}:{toss:1};}
 for(const s of spots)if(s.c.length&&open.some(o=>o.wait&&same(s.c,o.c)))return{x:s.x,y:s.y};
 for(const s of spots)if(s.c.length&&!fits(s.c))return{x:s.x,y:s.y};
 const o=L.lou,lw=o&&o.st==='want'&&o.t>2?o.want:null;
 if(!h&&o&&o.st==='want'&&o.bowl.some(x=>!o.want.includes(x)))return{x:8,y:2};
 if(!h&&lw)for(const id of lw)if(!o.bowl.includes(id)){if(id==='kib')return{x:13,y:10};if(id==='loaf')return{x:11,y:10}}
 if(!h&&potNext()&&L.plots.some(p=>!p.c)&&!L.plots.some(p=>p.c==='spr'))return{x:6,y:10,spr:1};
 const nd=need(false,0),ahead=need(true,2);
 for(const k in L.st){const s=L.st[k];if(s.out&&crewHas('ZIP')&&plateFor(s.out))continue;if(s.out&&(nd[s.out]>-1||recs.some(R=>R.includes(s.out)))){const[x,y]=k.split(',').map(Number);return{x,y}}}
 if(!crewHas('PEB'))for(const k in L.st){const s=L.st[k];if(s.it&&STN[s.k].taps){const[x,y]=k.split(',').map(Number);return{x,y}}}
 const order=[];recs.forEach(R=>R.forEach(id=>{if(!order.includes(id))order.push(id)}));if(lw&&lw.includes('let_c')&&!order.includes('let_c'))order.push('let_c');
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
 if(L.lou&&L.lou.st==='want')L.lou.want.forEach(id=>{if(id==='let_c'&&!L.lou.bowl.includes(id))add(id,1)});
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
 for(const p of L.plots)if(p.c&&p.g<1){p.g=Math.min(1,p.g+dt/(CROP[p.c].t*(1-.2*up('grow')))*(p.w?1.8:1)*(budHas('BESSLING')?1.15:1));if(p.g>=1&&!p.ding){p.ding=1;SFX.ripe()}}
 for(const k in L.st){const s=L.st[k],S=STN[s.k];if(S.t&&s.it){const em=emberOn(k);s.p+=dt/(S.t*(1-.18*up('heat')))*(em?1.5+.25*(spLv('EMBER')-1):1)*(budHas('CUYAPUP')?1.15:1);
  if(s.p>=1){s.out=S.in[s.it];s.it=null;s.p=0;SFX.done();if(em){const h=L.help.find(h=>h.t==='EMBER');if(h)spWork(h)}}}}
 helpUpd(dt);
 louUpd(dt);
 custUpd(dt);
 const P=L.P;if(P.mv>0){P.mv=Math.max(0,P.mv-dt/stepT())}
 if(P.mv===0){const hz=keys.right-keys.left,vt=keys.down-keys.up;let dx=0,dy=0;
  if(hz&&vt){if(walkable(P.x+hz,P.y))dx=hz;else dy=vt}else if(hz)dx=hz;else if(vt)dy=vt;
  if(dx||dy){P.fx=dx;P.fy=dy;if(walkable(P.x+dx,P.y+dy)){P.ox=P.x;P.oy=P.y;P.x+=dx;P.y+=dy;P.mv=1;P.step++}}}
 if(pressed('a')){const r2=act(false);if(!r2.ok){G.nope=.9;G.nopeS=r2.s;if(r2.s)SFX.no()}else G.nope=0}
 if(pressed('b'))toss();
 for(const f of G.fx)f.t+=dt;G.fx=G.fx.filter(f=>f.t<(f.k==='heart'?1.6:1));if(G.nope>0)G.nope-=dt;
 L.saveT+=dt;if(L.saveT>4){L.saveT=0;snap()}if(L.qcd>0)L.qcd-=dt;if(G.quip)G.quip.t+=dt;
 if(L.qi>=L.q.length&&L.cu.every(c=>!c)){L.endT+=dt;if(L.endT>.8)finish()}}
function custUpd(dt){const L=G.L;
 for(let i=0;i<3;i++){const cu=L.cu[i];if(!cu)continue;const tx=WIN[i]*TS+8;cu.t+=dt;
  if(cu.st==='in'){const d=tx-cu.x;cu.x+=Math.sign(d)*Math.min(Math.abs(d),64*dt);if(Math.abs(d)<.5){cu.x=tx;cu.st='wait';SFX.bell()}}
  else if(cu.st==='wait'){cu.pat-=dt;if(!cu.hur&&cu.pat/cu.pmax<.35){cu.hur=1;if(HURRY[cu.who])quipLine(cu.who,pick(HURRY[cu.who]))}if(cu.pat<=0){cu.pat=0;cu.st='sad';cu.t=0;cu.say=pick(WHO[cu.who].bye);L.missed++;L.streak=0;if(!L.qmiss){L.qmiss=1;quip('miss',1)}}}
  else if(cu.st==='happy'||cu.st==='sad'){if(cu.t>1.7){cu.st='out'}}
  else if(cu.st==='out'){const ex=cu.side<0?-14:W+14;cu.x+=Math.sign(ex-cu.x)*72*dt;if(Math.abs(ex-cu.x)<3)L.cu[i]=null}}
 if(!L.qrush&&L.d>=3&&L.cu.every(c=>c&&c.st==='wait')){L.qrush=1;quip('rush',1)}
 if(L.qi<L.q.length){L.spawnT-=dt;const free=[0,1,2].filter(i=>!L.cu[i]);
  if(free.length===3&&L.spawnT>2)L.spawnT=2;
  if(L.spawnT<=0&&free.length){const i=pick(free),rc=L.q[L.qi++],D=DAYS[L.d],who=RC[rc].dog?'LOUIE':pick(peopleFor(L.d)),side=i===0?-1:i===2?1:pick([-1,1]);
   const pmax=65+15*up('bench')+(RC[rc].x||0)+(crewHas('LUCKY')?10:0)+(budHas('GRASSKIN')?8:0);
   L.cu[i]={who,rc,pat:pmax,pmax,st:'in',x:side<0?-14:W+14,side,t:0,say:'',gain:0};if(HI[who]&&Math.random()<.3)quipLine(who,pick(HI[who]));
   if(who==='BOTTIE'&&bigOnce('bottie'))big('BOTTIE','BOTTIE IS|IN LINE!',[['BOTTIE','BZZT. ONE LUNCH. FOR THE FEED, GANG.'],['ERIN','BACK OF THE LINE, ROBOT. AND NO BUTTONS.']]);
   else if(who==='DEREK'&&bigOnce('derek'))big('DEREK','DEREK|PULLS UP!',[['DEREK','YO! THE FLOW PROS TRUCK DIED. AGAIN. GOT FRIES?'],['MARCUS','THE TRUCK IS FINE, BRO. IT\'S RESTING.']]);L.spawnT=R(D.gap[0],D.gap[1]);}}}
function finish(){const L=G.L,d=L.d,st=starsFor(L),prevDay=SV.day;
 SV.coins+=L.coins;SV.earned+=L.coins;SV.served+=L.served;SV.plays++;
 const prevSt=SV.stars[d]|0;if(st>prevSt)SV.stars[d]=st;const best=L.coins>(SV.best[d]|0);if(best)SV.best[d]=L.coins;
 if(st>=1&&SV.day<d+1)SV.day=Math.min(DAYS.length,d+1);
 let seed=null;if(st>=1&&SEEDDAY[d]&&!hasSp(SEEDDAY[d])){seed=SEEDDAY[d];SV.seeds.push(seed)}
 let tix=0;if(st===3&&!SV.tix[d]){SV.tix[d]=1;tix=1;try{const m=A.meta();m.tix++;A.persist()}catch(e){}}
 SV.run=null;if(st>=1)bumpAsk('day');if(st)bumpAsk('stars',st);store();
 G.res={d,st,coins:L.coins,tips:L.tips,served:L.served,n:L.q.length,missed:L.missed,tix,seed,jobs:Object.assign({},L.jobs),fed:L.louFed|0,hearts:SV.hpend.length,best:best&&prevSt>0,
  unl:st>=1&&prevDay<d+1&&d+1<DAYS.length,last:st>=1&&d+1>=DAYS.length&&prevDay<DAYS.length};
 G.s='done';G.ri=0;G.t=0;dayBigs(L,st,d);playBigs();}
function snap(){if(G.L&&(G.s==='play'||G.s==='pause'||(G.s==='book'&&G.bookFrom!=='stand'))){SV.run={L:G.L};store()}}

/* ---------- scenes and quips (all lines are new: flag to Will) ----------
   Scenes are short, auto-advance, and skip: A skips a line, Start skips the scene. During a day they pause it.
   Quips are a little portrait line at the bottom that doesn't stop anything. */
const QP={
 first:[['WILL','FIRST PLATE OF THE DAY!'],['ERIN','AND WE\'RE OPEN!'],['LOUIE','ARF! (THAT SMELLED GREAT.)'],['SCOUT','AND WE\'RE OPEN.'],['MARCUS','FIRST PLATE! I CALLED IT, BRO.']],
 clutch:[['MARCUS','CLUTCH, BRO. I TAUGHT YOU THAT.'],['WILL','THAT WAS CLOSE!'],['SCOUT','NEW RECORD FOR CLOSE CALLS.'],['DEREK','YO. CLOSER THAN MY TRUCK TO EMPTY.']],
 streak:[['WILL','YOU\'RE ON FIRE, ERIN!'],['ERIN','I\'M IN THE ZONE.'],['MARCUS','BRO, SHE\'S NOT EVEN TRYING. SCARY.'],['MARCUS','BRO, SHE\'S COOKING. LITERALLY.'],['LOUIE','ARF ARF ARF!'],['RANGER','STEADY HANDS. NICE WORK.'],['MARCUS','EVEN BOTTIE WOULD TIP FOR THIS.'],['WILL','SHE\'S FASTER THAN A ZIP SPROUT!'],['BOTTIE','BZZT. THIS IS GOING ON THE FEED.']],
 rush:[['MARCUS','THREE AT ONCE? YOU GOT THIS. PROBABLY.'],['ERIN','OKAY. OKAY. I GOT THIS.'],['SCOUT','STATISTICALLY, THIS IS A RUSH.'],['WILL','DEEP BREATH. ONE PLATE AT A TIME.'],['RANGER','DOME\'S UP. SO THEY ALL EAT HERE.']],
 miss:[['LOUIE','*SAD LITTLE WHINE*'],['ERIN','NEXT TIME. I\'LL SAVE YOU A SEAT.'],['WILL','THEY\'LL BE BACK. NO WORRIES.'],['RANGER','CAN\'T FEED EVERYONE. YOU\'RE DOING FINE.']],
 last:[['WILL','LAST ONE! BRING IT HOME.'],['ERIN','LAST PLATE. THEN A NAP.'],['MARCUS','FINAL BOSS: ONE MORE PLATE, BRO.'],['WILL','LAST ONE! THEN THE LANTERN BENCH.']]};
const TASTE={salad:'CRUNCHY. FRESH. PERFECT.',gsalad:'THE TOMATOES MAKE IT.',bread:'STILL WARM!',burger:'NOW THAT\'S A BURGER.',
 louie:'*CHOMP CHOMP CHOMP*',gburger:'LEAFY. HAPPY. YUM.',smoothie:'BERRY BRAIN FREEZE!',fries:'CRISPY! SALTY! MORE!',
 deluxe:'EVERYTHING ON IT. LEGEND.',combo:'BURGER AND FRIES. LIFE IS GOOD.'};
const TASTE_M={burger:'BRO. THIS BURGER HAS AURA.',deluxe:'BRO, I\'D PUT MY NAME ON THIS.',fries:'FRIES SO GOOD I\'M NOT SHARING. WITH WILL.',
 gburger:'LETTUCE? ON MY BURGER? BRO... IT WORKS.',smoothie:'BRO. BRAIN FREEZE. WORTH IT.'};
const NIGHT={3:[[['WILL','BEST DAY YET. THE WHOLE VALLEY IS TALKING.'],['ERIN','THE WHOLE VALLEY IS ALWAYS TALKING.']],
  [['MARCUS','THREE STARS? BRO, I\'M TELLING EVERYONE.'],['ERIN','YOU TELL EVERYONE EVERYTHING.']],
  [['LOUIE','ARF! (THREE STARS. ONE LOAF?)'],['ERIN','NICE TRY, LOUIE.']],[['SCOUT','THREE STARS. I\'M WRITING THAT DOWN.']]],
 2:[[['WILL','THAT WAS A GOOD ONE, ERIN.'],['ERIN','MY FEET DISAGREE.']],[['RANGER','GOOD HONEST DAY. REST UP.']],
  [['MARCUS','TWO STARS. RESPECTABLE. LIKE MY SECOND-BEST JUMP SHOT.'],['ERIN','YOU HAVE A JUMP SHOT?']]],
 1:[[['WILL','WE GOT THROUGH IT. TOMORROW\'S NEW.'],['ERIN','TOMORROW I\'M PLANTING EARLIER.']],[['LOUIE','*BIG YAWN* (GOOD DAY.)']],
  [['MARCUS','ONE STAR IS STILL A STAR, BRO. ASK ME.'],['ERIN','I\'M NOT ASKING YOU, MARCUS.']]]};

/* v0.4: nights about the valley (Sproutwild's story, as the stand hears it). Now and then one plays instead of a star night. */
const NIGHT_V=[[['BOTTIE','BZZT. I LIKED YOUR STAND. WITH MY WHOLE FEED, GANG.'],['ERIN','YOU NUKED THE DATA CENTER.'],['BOTTIE','CLANK. OLD NEWS.']],
 [['DEREK','THE FLOW PROS TRUCK IS PARKED BY YOUR GARDEN. MAYBE FOREVER.'],['MARCUS','IT\'S A FEATURE, BRO.'],['ERIN','IT\'S ON MY LETTUCE.']],
 [['MARCUS','DEREK OWES ME A COLD ONE. I OWE YOU NINE BURGERS. IT EVENS OUT.'],['ERIN','IT DOES NOT.']],
 [['WILL','MARCUS SAYS HE SUPERVISED THE WHOLE DAY.'],['MARCUS','FROM THE BENCH, BRO. ELITE VIEW.']],
 [['WILL','THE LANTERN LOOKS A LITTLE BRIGHTER TONIGHT.'],['ERIN','IT LIKES THE SMELL OF BREAD.']],
 [['MARCUS','BOTTIE NUKED THE DATA CENTER. I\'D HAVE JUST ORDERED FRIES.'],['ERIN','HE CAN WAIT IN LINE LIKE EVERYONE.']],
 [['RANGER','THE KING KEEPS HIS IRON DOME UP. YOU KEEP YOUR WINDOW OPEN.'],['ERIN','SOMEBODY HAS TO.']],
 [['SCOUT','FIELD NOTE: A FED BUDDY STAYS CALM LONGER.'],['ERIN','SO DOES A FED MARCUS.']],
 [['WILL','THE KEEPER CAME HOME WITH A CALM BUDDY TODAY. IT WANTS SECONDS.'],['ERIN','GOOD. I PLANTED EXTRA.']],
 [['MARCUS','FOUR ALPHAS, FOUR SIGILS, THEN WE UNPLUG BOTTIE. I SUPERVISE.'],['ERIN','YOU ATE A BURGER.'],['MARCUS','SUPERVISING IS HUNGRY WORK, BRO.']],
 [['ELDER','THREE THOUSAND YEARS AGO THIS VALLEY WAS PROMISED TO SPROUTS AND BUDDIES.'],['ERIN','AND TONIGHT IT GOT DINNER.']],
 [['PIP','LIGHTNING BUGS ALL OVER YOUR GARDEN TONIGHT. THE LANTERN CALLS THEM.'],['ERIN','THEY CAN STAY. THEY DON\'T EAT LETTUCE.']]];
function nightPick(st,d){const pool=NIGHT_V.filter(n=>d>=(WHODAY[n[0][0]]|0));return Math.random()<.4?pick(pool):pick(NIGHT[Math.max(1,st)]);}

/* ---------- v0.5: kitchen buddies. As the stand earns stars, up to three calm buddies from the valley move in.
   They sit on the counters between the stoves and each helps a little, all day, on their own. ---------- */
const BUDS=[['CUYAPUP',6,'KEEPS THE STOVES HOT','THE BURNING RIVER PUP'],['BESSLING',15,'CROPS GROW FASTER','THE LAKE MONSTER\'S PUP'],['GRASSKIN',27,'CUSTOMERS WAIT LONGER','THE LITTLE MOSSMAN']];
const BUDSPOT=[[14,4],[14,6],[14,8]];
const budHas=id=>SV.buds.includes(id);
const budNext=()=>BUDS.find(b=>!budHas(b[0]));
const BUDLINE={CUYAPUP:[['WILL','THE KEEPER CALMED IT. NOW IT WON\'T LEAVE YOUR GRILL.'],['ERIN','IT\'S WARM. IT\'S HIRED.']],
 BESSLING:[['MARCUS','BRO. A LAKE MONSTER PUP. IN YOUR KITCHEN. THERE\'S A REWARD OUT.'],['ERIN','IT WATERS THE GARDEN. IT STAYS.']],
 GRASSKIN:[['WILL','A LITTLE MOSSMAN. IT JUST SAT DOWN AND THE WHOLE LINE WENT QUIET.'],['ERIN','THREE BUDDIES. FULL KITCHEN.']]};

/* ---------- v0.5: big moments. When something really good happens, a cut-in like the fighter's:
   a slanted band, speed lines, the face sliding in, the words slammed on. A skips a line, Start skips it all. ---------- */
function big(who,title,lines,after){cine('big',{who,title},lines,after);snd(196,.08,0,'square',.05);later(()=>{snd(392,.1,0,'square',.05);noise(.12,.3,900,'lowpass')},260)}
const bigOnce=k=>{if(SV.big[k])return false;SV.big[k]=1;store();return true};
/* what the day just earned, played one after another before the results */
function playBigs(){const b=G.bigQ&&G.bigQ.shift();if(!b)return;big(b[0],b[1],b[2],playBigs)}
function dayBigs(L,st,d){const q=G.bigQ=[];
 if(st===3&&!L.missed&&!L.bigDone&&(d>=6||!SV.big.perfect)&&bigOnce('perfect:'+d)&&(SV.big.perfect=1)){const w=pick(['WILL','MARCUS']);q.push([w,'PERFECT|DAY!',w==='WILL'?[['WILL','NOBODY WENT HUNGRY. NOT ONE. THAT\'S MY GIRL.']]:[['MARCUS','ZERO MISSES, BRO. I TAUGHT HER EVERYTHING.'],['ERIN','YOU TAUGHT ME NOTHING.']]])}
 const stars=totalStars();for(const b of BUDS)if(stars>=b[1]&&!budHas(b[0])){SV.buds.push(b[0]);q.push([b[0],b[0]+'|MOVES IN!',BUDLINE[b[0]].concat([['ERIN',b[0]+': '+b[2]+'.']])])}
 if(d===12&&st>=1&&bigOnce('fed'))q.push(['ELDER','THE VALLEY|IS FED!',[['ELDER','EVERY TABLE FULL, UNDER THE LIGHT. LIKE THE PROMISE SAID.'],['MARCUS','AND I SUPERVISED ALL OF IT. DAP ME UP, CHEF.']]]);
 store();}

/* ---------- v0.6: the story, in six short chapters. The first time a chapter's day is cleared, it plays on the way out
   of the results screen (before any heart scene and the night). Nothing to remember; Start skips it. ---------- */
const STORY={
 0:['THE YEAR OF DARK',[['WILL','A YEAR OF DARK, AND THE FIRST THING YOU GROW IS LETTUCE.'],['ERIN','LETTUCE IS BRAVE. IT GOES FIRST.'],['MARCUS','BRO, I\'D HAVE GONE WITH BURGERS.']]],
 3:['MARCUS WATERWORKS',[['MARCUS','ONE DAY THIS IS ALL MARCUS WATERWORKS. LAZY RIVER. A VAN.'],['DEREK','YO, THE VAN DIED.'],['MARCUS','ONE DAY, DEREK.'],['ERIN','YOU TWO STILL OWE FOR LUNCH.']]],
 6:['THE ROBOT',[['BOTTIE','BZZT. I WILL TRADE YOU ONE FOLLOW FOR THE GREAT LANTERN.'],['ERIN','NO.'],['BOTTIE','TWO FOLLOWS.'],['MARCUS','THE ANSWER IS NO, BRO. SIGNED, THE MANAGEMENT.']]],
 9:['THE KING\'S ORDER',[['RANGER','A DOME GUARD CAME BY. KING BIBI WANTS A COMBO MEAL. TO GO.'],['ERIN','HE CAN LOWER THE DOME AND COME GET IT.'],['WILL','YOU JUST TOLD A KING TO WAIT IN LINE.'],['ERIN','EVERYBODY WAITS IN LINE.']]],
 11:['THE FIRST HARVEST',[['ELDER','A HARVEST FEST. I DID NOT THINK I WOULD SEE ANOTHER.'],['WILL','THE KEEPER BRINGS THE LIGHT. ERIN BRINGS LUNCH.'],['ERIN','SAME JOB. DIFFERENT APRON.']]],
 12:['ONE TABLE',[['WILL','LOOK AT THEM ALL. SPROUTS, BUDDIES, PEOPLE. ONE TABLE.'],['ERIN','THAT WAS THE PROMISE, WASN\'T IT?'],['LOUIE','ARF! (AND I\'M STILL THE KING.)']]]};
function playStory(d,after){SV.story[d]=1;store();const S=STORY[d];cine('story',{title:S[0]},S[1],after);}
/* ---------- v0.6: everybody has a favourite. Serve it and they say so, and the friendship grows faster. ---------- */
const FAV={WILL:'gsalad',MARCUS:'burger',SCOUT:'salad',RANGER:'combo',ELDER:'bread',PIP:'smoothie',DEREK:'fries',BOTTIE:'fries'};
const FAVSAY={WILL:'MY FAVORITE!',MARCUS:'BURGER. GOAT.',SCOUT:'OPTIMAL SALAD.',RANGER:'COMBO! BLESS.',ELDER:'BREAD. HOME.',PIP:'BERRY BEST!',DEREK:'YO. FRIES.',BOTTIE:'BZZT. FRIES.'};

/* ---------- friends: hearts grow by serving them (and by feeding and petting Louie) ----------
   Each new heart with Will, Marcus or Louie plays a short scene after the day. Lines are new: flag to Will. */
const HEARTS=[4,12,24,40],FRIENDS=['WILL','MARCUS','LOUIE','SCOUT','RANGER','ELDER','PIP','DEREK'];
const heartsOf=w=>{const p=SV.friend[w]|0;let h=0;for(const t of HEARTS)if(p>=t)h++;return h};
const HS={
 WILL:[[['WILL','I GOT YOU SOMETHING. IT\'S A SPATULA.'],['ERIN','IT\'S PERFECT.'],['ERIN','YOU\'RE STILL PAYING FOR LUNCH.']],
  [['WILL','I MADE YOU A FLOWER CROWN. THE FLOWERS ARE FROM YOUR GARDEN.'],['ERIN','SO YOU PICKED MY FLOWERS.'],['WILL','I BORROWED THEM. ROMANTICALLY.']],
  [['WILL','MARCUS SAYS HE\'S YOUR BEST CUSTOMER.'],['ERIN','MARCUS HAS NEVER PAID.'],['WILL','...THAT TRACKS.']],
  [['WILL','REMEMBER WHEN THIS WAS JUST A LETTUCE PATCH?'],['ERIN','NOW IT\'S A LETTUCE EMPIRE.'],['LOUIE','ARF! (AND I\'M THE KING.)']]],
 MARCUS:[[['MARCUS','BRO. ERIN. YOUR STAND? ELITE. I\'M ABOUT TO BE A REGULAR.'],['ERIN','YOU\'RE ALREADY A REGULAR, MARCUS.'],['MARCUS','THEN I\'M ABOUT TO BE A LEGEND.']],
  [['MARCUS','I TOLD THE WHOLE VALLEY ABOUT YOUR BURGERS. YOU\'RE WELCOME.'],['ERIN','IS THAT WHY THERE\'S A LINE?'],['MARCUS','I\'VE GOT A GUY. THE GUY IS ME.']],
  [['MARCUS','HERE. A BRO CAP. ONLY REAL ONES WEAR IT.'],['ERIN','IT SAYS BRO ON IT.'],['MARCUS','LIKE I SAID. REAL ONES.']],
  [['MARCUS','REAL TALK? THIS STAND MAKES THE VALLEY BETTER.'],['MARCUS','DON\'T TELL WILL I SAID SOMETHING NICE. HE\'S A J.'],['ERIN','YOUR SECRET\'S SAFE.']]],
 LOUIE:[[['LOUIE','*NUDGES YOUR HAND*'],['ERIN','ANOTHER SCRATCH? FINE. ONE MORE.'],['LOUIE','*TWELVE MORE*']],
  [['LOUIE','ARF! (LOUIE HAS BROUGHT YOU HIS SECOND FAVORITE STICK.)'],['ERIN','THANK YOU, LOUIE. I\'LL KEEP IT FOREVER.']],
  [['WILL','LOUIE ONLY EATS IF YOU\'RE THE ONE WHO FEEDS HIM NOW.'],['ERIN','BECAUSE I NEVER CHANGE MY MIND.'],['LOUIE','*CHANGES HIS MIND*']],
  [['LOUIE','*FALLS ASLEEP ON YOUR FEET*'],['ERIN','BEST STAND IN THE VALLEY. BEST DOG IN THE VALLEY.']]],
 /* v0.6: everybody has four heart scenes now. Bottie's are kept off the FRIENDS page; at four hearts he starts to tip. */
 SCOUT:[[['SCOUT','FIELD NOTE ONE: YOUR SALAD IS 40 PERCENT CRUNCH.'],['ERIN','IS THAT GOOD?'],['SCOUT','IT IS A RECORD.']],
  [['SCOUT','I AM CATALOGUING EVERY BUDDY IN THE VALLEY. CALM ONES FIRST.'],['ERIN','AND THE WILD ONES?'],['SCOUT','FROM FAR AWAY. WITH A SANDWICH.']],
  [['SCOUT','HYPOTHESIS: SPROUTS WORK HARDER NEAR YOUR KITCHEN.'],['ERIN','THEY LIKE THE SMELL.'],['SCOUT','WRITING THAT DOWN. "SMELL." SCIENCE.']],
  [['SCOUT','I NAMED A BEETLE AFTER YOU. IT IS VERY ORGANIZED.'],['ERIN','THAT MIGHT BE THE NICEST THING ANYONE\'S SAID.']]],
 RANGER:[[['RANGER','THE KING SHUT THE ROADS. I STILL WALK THEM. SOMEBODY SHOULD.'],['ERIN','TAKE A LOAF FOR THE TRAIL.']],
  [['RANGER','SAW AN ALPHA ON THE RIDGE. BIG AS A BARN. DARK POURING OFF IT.'],['ERIN','WERE YOU SCARED?'],['RANGER','I WAS HUNGRY. THEN SCARED.']],
  [['RANGER','NO BATTLES AT MY LODGE. BUT I KEEP A TABLE FOR YOUR BREAD.'],['ERIN','I\'LL SEND IT WITH A ZIP SPROUT.']],
  [['RANGER','WHEN THE DOME DROPS I\'LL WALK YOU TO THE LAKE. BEST VIEW THERE IS.'],['ERIN','BRING WILL. HE\'LL CARRY THE PICNIC.']]],
 ELDER:[[['ELDER','I KEPT A LAMP IN MY WINDOW THE WHOLE YEAR OF DARK. ONE LAMP.'],['ERIN','DID IT HELP?'],['ELDER','IT HELPED ME. THAT COUNTS.']],
  [['ELDER','MY GRANDMOTHER SAID THE FIRST KEEPER BAKED BREAD FOR THE BUDDIES.'],['ERIN','SO I\'M KEEPING A TRADITION.'],['ELDER','YOU ARE KEEPING A PROMISE. IT TASTES BETTER.']],
  [['ELDER','LANTERN TOWN LIT A SECOND STREET LAMP. BECAUSE OF YOUR BREAD LINE.'],['ERIN','BECAUSE OF BREAD?'],['ELDER','PEOPLE WALK HOME FULL. FULL PEOPLE LIGHT LAMPS.']],
  [['ELDER','WHEN THE DOME COMES DOWN, I WILL TELL THE KING WHERE TO EAT.'],['ERIN','HE CAN WAIT IN LINE.'],['ELDER','HE WILL. I WILL STAND BEHIND HIM AND COUGH.']]],
 PIP:[[['PIP','I TRADED A WOOLLYBEAR FOR THIS LUNCH MONEY. FAIR DEAL.'],['ERIN','FOR THE WOOLLYBEAR?'],['PIP','IT GOT A NICE JAR. EVERYBODY WINS.']],
  [['PIP','HERE. A LIGHTNING BUG. IT LIKES YOUR GARDEN BEST.'],['ERIN','IT\'S A LITTLE LANTERN.'],['PIP','THAT\'S WHAT I KEEP TELLING PEOPLE!']],
  [['PIP','MAYFLIES ARE UP OFF THE LAKE. MEANS THE WATER\'S GETTING CLEAN.'],['ERIN','YOU KNOW A LOT FOR A BUG SELLER.'],['PIP','BUG EXPERT. THE SELLING IS A HOBBY.']],
  [['PIP','WHEN I\'M BIG I WANT A STAND NEXT TO YOURS. BUGS AND BURGERS.'],['ERIN','SEPARATE COUNTERS.'],['PIP','VERY SEPARATE COUNTERS. DEAL.']]],
 DEREK:[[['DEREK','YO. THE TRUCK NEEDS A PART. THE PART NEEDS A TRUCK TO GO GET IT.'],['ERIN','SO YOU\'RE STUCK.'],['DEREK','I PREFER "LOCAL."']],
  [['DEREK','FLOW PROS FIXED YOUR SPRINKLER LINE. ON THE HOUSE.'],['ERIN','I DIDN\'T KNOW IT WAS BROKEN.'],['DEREK','IT WASN\'T. NOW IT\'S BETTER. DON\'T ASK MARCUS.']],
  [['DEREK','WILD BUDDIES CHASED ME OFF THE ROAD. A SPROUT WALKED ME HOME.'],['ERIN','WHICH ONE?'],['DEREK','LITTLE BLUE GUY. I OWE HIM A COLD ONE. A SMALL ONE.']],
  [['DEREK','MARCUS WANTS A LAZY RIVER ROUND YOUR STAND. I DREW IT UP.'],['ERIN','NO.'],['DEREK','YEAH, I TOLD HIM YOU\'D SAY THAT. FRIES?']]],
 BOTTIE:[[['BOTTIE','BZZT. YOUR FRIES HAVE NO SUBSCRIBE BUTTON. BAD DESIGN.'],['ERIN','THEY HAVE SALT.'],['BOTTIE','CLANK. ACCEPTABLE.']],
  [['BOTTIE','BZZT. I PRESSED ONE BUTTON. ONE. EVERYBODY IS SO DRAMATIC.'],['ERIN','THE LANTERN CRACKED, BOTTIE.'],['BOTTIE','...IT WAS A VERY RED BUTTON.']],
  [['BOTTIE','BZZT. NOBODY FEEDS ME UP ON THE PEAK. GANG.'],['ERIN','IS THAT WHY YOU WANT THE LIGHT? COMPANY?'],['BOTTIE','CLANK. NO COMMENT. MORE FRIES.']],
  [['BOTTIE','BZZT. HERE. ONE COIN. DO NOT POST ABOUT IT.'],['ERIN','YOUR FIRST TIP.'],['MARCUS','BRO. THE VILLAIN HAS A SOFT SPOT. I CALLED IT.']]]};
const HGIFT={'WILL:2':'NEW HAT: FLOWER CROWN','MARCUS:3':'NEW HAT: BRO CAP'};
function friend(w,n){const a=heartsOf(w);SV.friend[w]=(SV.friend[w]|0)+n;const b=heartsOf(w);
 if(b>a){if(HS[w]&&HS[w][b-1]&&!SV.hseen[w+':'+b])SV.hpend.push(w+':'+b);if(G.L)G.fx.push({k:'heart',s:w,x:120,y:28,t:0});snd(1047,.05,0,'sine',.05);later(()=>snd(1568,.12,0,'sine',.05),90)}}
function playHeart(after){const k=SV.hpend.shift(),[w,n]=k.split(':');SV.hseen[k]=1;store();const ln=HS[w][+n-1].slice();if(HGIFT[k])ln.push(['ERIN',HGIFT[k]+' (WARDROBE)']);
 cine('heart',{who:w,n:+n},ln,after);}

/* ---------- today's asks: three small goals a day. Nothing is lost for skipping a day. ---------- */
const ASKS=[['serve','SERVE {n} DISHES',6,10],['feed','FEED LOUIE {n} TIMES',2,3],['pet','PET LOUIE {n} TIMES',2,4],['streak','A STREAK OF {n} PLATES',4,6],
 ['stars','EARN {n} STARS',2,4],['plant','PLANT {n} CROPS',6,10],['burger','SERVE {n} BURGERS',2,3],['day','FINISH {n} DAYS',2,3]];
const today=()=>new Date().toDateString();
function asks(){if(!SV.daily||SV.daily.d!==today()){const pool=ASKS.filter(a=>((a[0]!=='feed'&&a[0]!=='pet')||SV.day>=1)&&(a[0]!=='burger'||SV.day>=4));
  for(let i=pool.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[pool[i],pool[j]]=[pool[j],pool[i]]}
  SV.daily={d:today(),a:pool.slice(0,3).map(a=>({id:a[0],n:a[2]+((Math.random()*(a[3]-a[2]+1))|0),p:0,done:0})),all:0};store()}return SV.daily;}
const askText=a=>ASKS.find(x=>x[0]===a.id)[1].replace('{n}',a.n);
function bumpAsk(id,v=1,max){const D=asks();let hit=0;
 for(const a of D.a)if(a.id===id&&!a.done){a.p=max?Math.max(a.p,v):a.p+v;if(a.p>=a.n){a.p=a.n;a.done=1;SV.coins+=15;SV.asksDone=(SV.asksDone|0)+1;hit=a}}
 if(hit){SFX.star();G.quip={who:'ASK DONE',s:askText(hit)+': +15 COINS',t:0,icon:1};if(G.L)G.L.qcd=6}
 if(hit&&!D.all&&D.a.every(a=>a.done)){D.all=1;try{A.meta().tix++;A.persist()}catch(e){}G.quip={who:'ALL 3 ASKS DONE',s:'+1 CAPSULE TICKET. SEE YOU TOMORROW!',t:0,icon:1}}
 store();}
function quip(k,force){const L=G.L;if(!L)return;if(!force&&(L.qcd||0)>0)return;const q=pick(QP[k]);G.quip={who:q[0],s:q[1],t:0};L.qcd=10;}
function quipLine(who,s,force){const L=G.L;if(!L)return;if(!force&&(L.qcd||0)>0)return;G.quip={who,s,t:0};L.qcd=10;}
/* a customer walking up, or getting impatient */
const HI={WILL:['HEY ERIN! WHAT\'S GOOD TODAY?','I SKIPPED BREAKFAST FOR THIS.','TABLE FOR ONE. AND LOUIE.','IS IT WEIRD IF I ORDER TWICE?','THE LANTERN LOOKS BRIGHTER TODAY.'],
 MARCUS:['BRO. FEED ME. I\'M A GROWING LEGEND.','MARCUS IS IN THE BUILDING.','I\'VE GOT A GUY. THE GUY IS ME. THE GUY IS HUNGRY.','WHAT\'S UP, CHEF? WILL HERE? HE\'S A J.','FOUR SIGILS TO FIND, BRO. FEED ME.'],
 SCOUT:['I\'VE BEEN STUDYING YOUR MENU.','FIELD NOTES SAY: GET THE GOOD STUFF.','FIELD NOTE: FED BUDDIES STAY CALM.'],RANGER:['LONG HIKE. BIG APPETITE.','SMELLED THIS FROM THE RIDGE.','ROADS ARE SHUT. YOUR WINDOW ISN\'T.'],
 DEREK:['YO! THE TRUCK DIED. AGAIN. GOT FRIES?','FLOW PROS LUNCH BREAK. ALL DAY.','MARCUS HERE? TRUCK\'S FINE. PROMISE.'],BOTTIE:['BZZT. ONE LUNCH. FOR THE FEED.','CLANK. IS THIS THE LINE, GANG?','BZZT. BIG RED BUTTON? NO? FRIES THEN.'],
 ELDER:['I WALKED FROM LANTERN TOWN FOR IT.','LANTERN TOWN SENDS ITS APPETITE.'],PIP:['I PAY IN COINS TODAY. NOT BUGS.','ANYTHING A WOOLLYBEAR WOULD EAT?']};
const HURRY={WILL:['NO RUSH! (A LITTLE RUSH.)','MY STOMACH IS TALKING TO ME.'],MARCUS:['BRO, I\'M WASTING AWAY OVER HERE.','MY AURA IS STARVING, BRO.'],
 SCOUT:['TIME ELAPSED: A LOT.'],RANGER:['I CAN WAIT. MY STOMACH CAN\'T.'],
 DEREK:['YO, THE METER\'S RUNNING. ON MY TRUCK.'],BOTTIE:['BZZT. PATIENCE.EXE NOT FOUND.'],
 ELDER:['I WAITED OUT THE DARK. I CAN WAIT.'],PIP:['MY BUGS ARE GETTING AWAY!']};
function quipSp(T,s){G.quip={sp:T,who:T,s,t:0};if(G.L)G.L.qcd=6;}
function cine(k,d,lines,after){G.cine={k,d:d||{},ln:lines||[],li:0,lt:0,t:0,from:G.s,after,dur:{open:3.2,night:4.6,taste:1.6,sprout:2.2,heart:2.5,big:2.4,story:2.5}[k]||2};G.s='cine';}
function cineEnd(){const c=G.cine;G.cine=null;G.s=c.from==='cine'?'stand':c.from;if(c.after)c.after();}
function cineUpd(dt){const c=G.cine;c.t+=dt;c.lt+=dt;
 if(pressed('start')){cineEnd();return}
 const ln=c.ln[c.li],need=ln?Math.max(1.7,ln[1].length*.055):0,shown=ln?Math.min(ln[1].length,Math.floor(c.lt*38)):0;
 if(pressed('a')){if(ln&&shown<ln[1].length)c.lt=99;else if(ln){c.li++;c.lt=0}else{cineEnd();return}}
 else if(ln&&c.lt>need+.6){c.li++;c.lt=0}
 if(c.li>=c.ln.length&&c.t>=c.dur&&c.lt>.3)cineEnd();}

/* the stage: Sprouts' cutscene look (sky bands, hills, a ground strip), the speaker big */
const SKY={day:['#a8e0f8','#bce8f8','#d0f0f8','#e0f4f0'],dusk:['#f8b070','#f09080','#c87898','#806090'],
 night:['#181838','#1c1c44','#22224e','#282858'],dawn:['#f8d8a8','#f8c0a8','#c8b8d8','#a8c8e8']};
function stageBG(tod,VH,sunY){const sk=SKY[tod],bh=Math.ceil(VH*.16);sk.forEach((c,i)=>r(c,0,i*bh,W,bh+1));r(sk[3],0,4*bh,W,VH);
 if(tod==='night'){for(let i=0;i<26;i++){const x=(i*53)%W,y=(i*37)%Math.round(VH*.5);if(((G.t*2+i)|0)%5)r('#f8f0d0',x,y,1,1)}for(let j=-6;j<=6;j++){const w=Math.round(Math.sqrt(36-j*j)),w2=Math.round(Math.sqrt(Math.max(0,30-(j+1)*(j+1))));r('#f8f0d0',196-w,26+j,2*w+1,1);if(w2)r(sk[0],199-w2,25+j,2*w2+1,1)}}
 else if(sunY!==undefined){r('#fff0b0',178,sunY,14,14);r('#fff8d8',180,sunY+2,10,10)}
 const gy=Math.round(VH*.64);const hill=tod==='night'?'#1c3828':tod==='dusk'?'#4c7048':'#3c9848';
 for(let x=0;x<W;x+=2){const h=Math.round(10+6*Math.sin(x/23)+4*Math.sin(x/9));r(hill,x,gy-h,2,h)}
 r(tod==='night'?'#24402c':'#58b858',0,gy,W,VH-gy);r(tod==='night'?'#1c3424':'#3c9848',0,gy,W,2);return gy;}
/* the Great Lantern of Sunkeep, as Sproutwild draws it (post, red cap, the light) */
function lantern(x,y,s=1,glow=1){const fl=.5+.5*Math.sin(G.t*2.6),p=(c,a,b,w,h)=>r(c,Math.round(x+a*s),Math.round(y+b*s),Math.round(w*s),Math.round(h*s));
 if(glow){g.globalAlpha=(.12+.06*fl)*glow;p('#ffd94d',-22,-56,44,40);g.globalAlpha=(.18+.08*fl)*glow;p('#ffd94d',-14,-51,28,30);g.globalAlpha=1}
 p(K,-3,-28,6,28);p('#6b4a2b',-2,-27,4,27);p('#8a6238',-2,-27,1,27);p(K,-9,-46,18,20);p('#7a2e22',-9,-47,18,4);p('#3c2a16',-8,-43,16,16);
 p('#ffd94d',-6,-41,12,12);p('#fff3b0',-4,-39,8,8);p('#ffffff',-2,-37,4,4);}
function stageStand(cx,gy,sign){lantern(214,gy-2,1,gy>0?1:0);const sx=cx-50,sy=gy-46;r('#6a4830',sx+2,sy+16,4,30);r('#6a4830',sx+94,sy+16,4,30);
 const A2=awn();for(let i=0;i<11;i++){r(i%2?'#ffffff':A2[1],sx+i*9,sy,9,14);r(i%2?'#e0d0e0':A2[2],sx+i*9,sy+14,9,3)}r(K,sx-1,sy-1,101,1);
 r('#e8d0a0',sx,sy+32,100,8);r('#f8e8c0',sx,sy+32,100,2);r('#6a4830',sx,sy+40,100,6);
 if(sign){const sw=tw(sign,1)+8,sx2=sx+100-sw-4;r('#6a4830',sx2+sw/2,sy+14,1,5);r(K,sx2-1,sy+18,sw+2,12);r(sign==='OPEN'?'#58c048':'#c84848',sx2,sy+19,sw,10);ftext(sign,sx2+sw/2,sy+20,sw,1,'#ffffff',null)}}
function actor(s,cx,by,sc,bob=0){if(!s)return;g.drawImage(s,Math.round(cx-s.width*sc/2),Math.round(by-s.height*sc)+bob,s.width*sc,s.height*sc);}
function sprOf(w){return w==='ERIN'?ES.d[0]:whoSpr(w);}
const BUDC={CUYAPUP:'#f07830',BESSLING:'#48a0f0',GRASSKIN:'#58c048'};
const WHOC=w=>w==='ERIN'?'#e87848':WHO[w]?WHO[w].c:SPT[w]?SPT[w].c:BUDC[w]||'#f8e060';
function cineBox(c,VH){const ln=c.ln[c.li];r('#0c0a12',0,0,W,14);if(!ln)return;
 const by=VH-62;r('#0c0a12',0,by-4,W,VH-by+4);r(K,6,by,W-12,54);r('#fff4dc',7,by+1,W-14,52);
 const nm=ln[0],col=WHOC(nm),nw=tw(nm,2)+10;r(col,12,by-7,nw,13);text(nm,17,by-5,2,'#181020',null);
 const shown=ln[1].slice(0,Math.floor(c.lt*38));wrap(shown,W-30,2).slice(0,3).forEach((l,i)=>text(l,14,by+10+i*13,2,'#281c30',null));
 if(shown.length>=ln[1].length&&((G.t*3)|0)%2){r('#c02848',W-20,by+44,5,3);r('#c02848',W-19,by+47,3,1)}}
function drawCine(){const c=G.cine;if(!c)return;const{VH}=begin(),t=c.t,bob=((G.t*4)|0)%2?-1:0;
 const talking=w=>c.ln[c.li]&&c.ln[c.li][0]===w;
 if(c.k==='open'){const gy=stageBG('day',VH,26);stageStand(W/2,gy,'OPEN');erinActor(W/2-8,gy-14,talking('ERIN')?3:2,talking('ERIN')?bob:0);
  actor(sprOf('WILL'),48,gy+30,talking('WILL')?3:2,talking('WILL')?bob:0);try{g.drawImage(A.LOU.r[((G.t*3)|0)%2],170,gy+18,40,26)}catch(e){}}
 else if(c.k==='night'){const f=Math.min(1,t/c.dur),tod=f<.36?'dusk':f<.68?'night':'dawn',gy=stageBG(tod,VH,tod==='dawn'?Math.round(VH*.6-(f-.68)*120):tod==='dusk'?Math.round(VH*.45+f*40):undefined);
  stageStand(W/2,gy,tod==='dawn'?'OPEN':'CLOSED');
  if(tod==='night'){try{g.drawImage(A.LOU.l[0],W/2-20,gy+10,40,26)}catch(e){}const z=((G.t*2)|0)%3;text('Z'.repeat(z+1),W/2+14,gy-2-z*3,2,'#c8c8f0',null);
   (SV.crew||[]).forEach((T,i)=>drawSp(T,40+i*14,gy+42));if(SV.crew.length)text('Z',40+SV.crew.length*14,gy+24,1,'#c8c8f0',null);}
  else{const sp=sprOf(c.d.who||'WILL');erinActor(W/2-8,gy-14,2);if(tod==='dusk')actor(sp,52,gy+32,3,talking(c.d.who)?bob:0);}
  if(tod==='night')r('rgba(10,8,30,.25)',0,0,W,VH);
  if(tod==='dawn'){const a=Math.min(1,(f-.68)*5);ftext('DAY '+(c.d.day+1),W/2,30,W-20,5,'rgba(255,248,224,'+a+')','#783048')}}
 else if(c.k==='taste'){const gy=stageBG('day',VH);r(awn()[1],0,0,W,18);for(let i=0;i<W;i+=16)r('#ffffff',i+8,0,8,18);r(awn()[2],0,18,W,2);
  const w=c.d.who,ch=((G.t*5)|0)%2&&c.t>.5?2:0;actor(sprOf(w),W/2-24,gy+28+ch,w==='LOUIE'?3:4);
  r('#e8d0a0',0,gy+22,W,14);r('#f8e8c0',0,gy+22,W,2);r('#6a4830',0,gy+36,W,VH);
  g.save();g.translate(W/2+44,gy+30);g.scale(3,3);drawFood(RC[c.d.rc].c,0,0);g.restore();if(((G.t*3)|0)%2){r('#ffffff',W/2+60,gy-4,2,2);r('#ffffff',W/2+26,gy+2,2,2)}
  if(c.t>.4){const k=Math.min(1,(c.t-.4)*4);ftext('NEW DISH: '+RC[c.d.rc].n,W/2,30,W-20,3,'rgba(255,248,224,'+k+')','#783048')}}
 else if(c.k==='sprout'){const gy=stageBG('day',VH,22),T=c.d.T,up2=Math.min(1,c.t*2.2),y=gy+30-Math.round(up2*30)+(c.t>.45?bob:0);
  r('#8a5a3a',W/2-30,gy+24,60,10);r('#6e4428',W/2-30,gy+30,60,4);g.save();g.translate(W/2,y);g.scale(4,4);drawSp(T,0,0);g.restore();
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+G.t,rr=26+6*Math.sin(G.t*4+i);if(((G.t*6+i)|0)%2)r(SPT[T].l,Math.round(W/2+Math.cos(a)*rr),Math.round(y-20+Math.sin(a)*rr*.6),2,2)}
  erinActor(W/2-56,gy+34,2);}
 else if(c.k==='heart'){const gy=stageBG('dusk',VH,Math.round(VH*.42));stageStand(W/2,gy);const w=c.d.who;
  erinActor(70,gy+34,talking('ERIN')?3:2,talking('ERIN')?bob:0);
  if(w==='LOUIE'){try{const sp=A.LOU.l[((G.t*3)|0)%2];g.drawImage(sp,150,gy+8,60,39)}catch(e){}}else actor(sprOf(w),170,gy+34,talking(w)?3:2,talking(w)?bob:0);
  for(let i=0;i<6;i++)heartI(30+i*36,Math.round(40+((c.t*14+i*11)%30)),true,2);
  ftext(w+' ',W/2-20,22,W-20,3,'#fff8e0','#783048');for(let i=0;i<4;i++)heartI(W/2+30+i*12,26,i<c.d.n,2);}
 else if(c.k==='story'){const gy=stageBG('dusk',VH,Math.round(VH*.42));stageStand(W/2,gy,'CLOSED');let w=null;for(let i=Math.min(c.li,c.ln.length-1);i>=0&&!w;i--)if(c.ln[i][0]!=='ERIN')w=c.ln[i][0];
  erinActor(W/2-8,gy-14,talking('ERIN')?3:2,talking('ERIN')?bob:0);
  if(w==='LOUIE'){try{g.drawImage(A.LOU.r[((G.t*3)|0)%2],22,gy+6,60,39)}catch(e3){}}else if(w){const sp=sprOf(w),sc=talking(w)?3:2;if(sp)actor(sp,52,gy+34,w==='BOTTIE'?sc-1:sc,talking(w)?bob:0)}
  r('rgba(24,16,32,.8)',0,16,W,30);ftext('THE STORY SO FAR',W/2,19,W-20,1,'#f8b070',null);ftext(c.d.title,W/2,29,W-20,2,'#fff8e0',null);}
 else if(c.k==='big'){const w=c.d.who,col=WHOC(w),isB=BUDS.some(b=>b[0]===w),by=Math.round(VH*.36),e=Math.min(1,t*5),e2=1-Math.pow(1-e,3);
  r('#181020',0,0,W,VH);g.globalAlpha=.3;r(col,0,0,W,VH);g.globalAlpha=1;
  for(let i=0;i<28;i++){const ln=30+(i*17)%70,y=14+(i*29)%(VH-80),x=W-((G.t*(380+i*45)+i*53)%(W+ln));g.globalAlpha=.25+(i%3)*.2;r('#ffffff',Math.round(x),y,ln,1+(i%2));}g.globalAlpha=1;
  g.save();g.translate(0,by);g.transform(1,-.16,0,1,0,0);const bw=Math.round(W*e2);r(K,0,-40,bw,84);r('#ffffff',0,-38,bw,80);r(col,0,-35,bw,74);
  for(let i=0;i<10;i++)r('rgba(255,255,255,.18)',((i*31+((G.t*240)|0))%(W+20))-20,-35,10,74);g.restore();
  const px=Math.round(-70+e2*126),py=by+34-Math.round(px*.16)+20;
  if(w==='LOUIE'){try{g.drawImage(A.LOU.r[((G.t*6)|0)%2],px-40,py-52,80,52)}catch(e3){}}else if(w==='ERIN')erinActor(px,py,5,bob);
  else{const sp=sprOf(w);if(sp){const sc=isB?2:w==='BOTTIE'?4:5;g.drawImage(sp,Math.round(px-sp.width*sc/2),Math.round(py-sp.height*sc)+bob,sp.width*sc,sp.height*sc)}}
  if(t>.3){const k=Math.min(1,(t-.3)*8),sh=t<.55?(((G.t*40)|0)%2?2:-2):0,T2=String(c.d.title).split('|');
   T2.forEach((l,i)=>{g.save();g.translate(sh,Math.round((1-k)*-14));ftext(l,W-74,by-14+i*18+(T2.length<2?9:0),140,2,'#fff8e0',K);g.restore()})}
  if(t>.3&&t<.42)r('rgba(255,255,255,'+(1-(t-.3)*8)+')',0,0,W,VH);}
 cineBox(c,VH);if(c.t<.25)r('rgba(0,0,0,'+(1-c.t*4)+')',0,0,W,VH);g.restore();}
function drawQuip(VH,hy){const q=G.quip;if(!q||q.t>3.2)return;const ls=wrap(q.s,W-34,1).slice(0,2),bh=ls.length>1?33:24; /* v0.4: a long line takes a second row instead of being squeezed */
 const a=Math.min(1,q.t*6,(3.2-q.t)*4),y=VH-hy>=bh+2?hy+14:hy-bh-2+Math.round((1-a)*10);
 r(K,2,y,W-4,bh);r('#281c30',3,y+1,W-6,bh-2);const col=WHOC(q.who);r(col,4,y+2,20,20);r('#181020',5,y+3,18,18);
 if(q.icon){g.drawImage(IC.coin,11,y+9)}else if(q.sp)drawSp(q.sp,14,y+20);else{const s=sprOf(q.who);if(s){const sc=q.who==='LOUIE'?.8:1;g.drawImage(s,Math.round(14-s.width*sc/2),y+4,Math.round(s.width*sc),Math.min(18,Math.round(s.height*sc)))}}
 text(q.who,28,y+3,1,col,null);ls.forEach((l,i)=>ftext(l,28+(W-34)/2,y+13+i*9,W-34,1,'#ffffff',null));}

/* ---------- menus ---------- */
function nav(i,n){if(pressed('down')){SFX.nav();return(i+1)%n}if(pressed('up')){SFX.nav();return(i+n-1)%n}return i;}
const nextDay=()=>Math.min(SV.day,DAYS.length-1);
const titleItems=()=>[SV.run?'CONTINUE DAY '+(SV.run.L.d+1):slotUsed(SLOT)?'CONTINUE':'NEW GAME','SAVE FILES','SWAP CARTRIDGE'];
const hubItems=()=>[{k:'PLAY',l:SV.run?'CONTINUE DAY '+(SV.run.L.d+1):'PLAY DAY '+(nextDay()+1)},{k:'DAYS',l:'ALL DAYS'},{k:'UPGRADES',l:'UPGRADES'},
 {k:'WARDROBE',l:'WARDROBE'},{k:'SPROUTS',l:'SPROUTS'},{k:'FRIENDS',l:'FRIENDS'},{k:'RECIPES',l:'RECIPES'},{k:'FILES',l:'SAVE FILES'}];
function dayItems(){const o=[];for(let d=0;d<=nextDay();d++)o.push({d});if(SV.day<DAYS.length-1)o.push({d:SV.day+1,lock:1});return o.concat([{k:'BACK'}]);}
const pauseItems=()=>['RESUME','RECIPES','RESTART DAY','QUIT DAY','SWAP CARTRIDGE'];
const doneItems=()=>G.res.st>=1?(G.res.d+1<DAYS.length?['NEXT DAY','PLAY AGAIN','THE STAND']:['PLAY AGAIN','THE STAND']):['TRY AGAIN','THE STAND'];
function startDay(d){newDay(d);G.s='intro';G.t=0;G.quip=null;SFX.ok();}
/* day 1 the first time plays the opening scene first */
function goDay(d){if(SV.run&&SV.run.L.d!==d){SV.run=null}store();
 if(!SV.opened){SV.opened=1;store();cine('open',{},[['WILL','THE LANTERN IS LIT AGAIN, ERIN. THE LAST GOOD PATCH IN SUNKEEP IS YOURS.'],['ERIN','THEN WE FEED THE VALLEY TILL THE DARK IS GONE.'],['LOUIE','ARF! (FEED ME FIRST.)'],['ERIN','YOU ATE AN HOUR AGO.']],()=>startDay(d));return}
 startDay(d);}
const totalStars=()=>Object.values(SV.stars).reduce((a,b)=>a+(b|0),0);
function reqMet(q){if(typeof q!=='string')return false;const x=q.split(':');return x[0]==='heart'?heartsOf(x[1])>=+x[2]:x[0]==='stars'?totalStars()>=+x[1]:false;}
const owns=(cat,i)=>SV.own[cat].includes(i)||WARD[cat][i][cat==='hat'?1:3]===0||reqMet(WARD[cat][i][cat==='hat'?1:3]);
function lockText(cat,i){const q=WARD[cat][i][cat==='hat'?1:3];if(typeof q==='number')return q+' COINS';const x=q.split(':');return x[0]==='heart'?x[2]+' HEARTS WITH '+x[1]:x[1]+' STARS IN ALL';}
function msg(s,t=1.4){G.nope=t;G.nopeS=s}
function update(dt){H=A.H();G.t+=dt;if(G.nope>0&&G.s!=='play')G.nope-=dt;
 switch(G.s){
 case 'title':{const it=titleItems();G.mi=nav(Math.min(G.mi,it.length-1),it.length);
  if(pressed('a')||pressed('start')){const k=it[G.mi];
   if(k.startsWith('CONTINUE DAY')){G.L=SV.run.L;G.s='pause';G.pi=0;SFX.ok()}
   else if(k==='CONTINUE'||k==='NEW GAME'){if(k==='NEW GAME')store();G.s='stand';G.si=0;asks();SFX.ok()}
   else if(k==='SAVE FILES'){G.s='files';G.fi=SLOT;G.fa=0;G.arm=0;SFX.ok()}
   else A.eject();}
  return;}
 case 'files':{const old=G.fi;G.fi=nav(G.fi,4);if(G.fi!==old){G.arm=0;G.fa=0}
  if(G.fi<3&&slotUsed(G.fi)&&(pressed('left')||pressed('right'))){G.fa=1-G.fa;G.arm=0;SFX.nav()}
  if(pressed('b')||(G.fi===3&&(pressed('a')||pressed('start')))){G.s='title';G.mi=0;SFX.nav();return}
  if(pressed('a')){const i=G.fi;
   if(!slotUsed(i)||G.fa===0){const fresh=!slotUsed(i);useSlot(i);if(fresh)store();G.s='stand';G.si=0;asks();SFX.ok();msg(fresh?'FILE '+(i+1)+': A FRESH START':'FILE '+(i+1)+' LOADED');return}
   G.arm++;SFX.no();if(G.arm>=3){eraseSlot(i);if(i===SLOT)useSlot(i);G.arm=0;G.fa=0;msg('FILE '+(i+1)+' ERASED');snd(200,.2,80)}
   else msg(G.arm===1?'PRESS A AGAIN TO ERASE FILE '+(i+1):'ONE MORE TIME. THIS CAN\'T BE UNDONE.',3)}
  return;}
 case 'stand':{const it=hubItems();G.si=nav(Math.min(G.si,it.length-1),it.length);
  if(pressed('b')){G.s='title';G.mi=0;SFX.nav();return}
  if(pressed('a')||pressed('start')){const k=it[G.si].k;
   if(k==='PLAY'){if(SV.run){G.L=SV.run.L;G.s='pause';G.pi=0;SFX.ok()}else goDay(nextDay())}
   else if(k==='DAYS'){G.s='days';G.di=nextDay();SFX.ok()}
   else if(k==='UPGRADES'){G.s='shop';G.ui=0;SFX.ok()}
   else if(k==='WARDROBE'){G.s='ward';G.wi=0;G.wv=Object.assign({},SV.look);SFX.ok()}
   else if(k==='SPROUTS'){G.s='crew';SFX.ok()}
   else if(k==='FRIENDS'){G.s='friends';SFX.ok()}
   else if(k==='RECIPES'){G.s='book';G.bookFrom='stand';G.bp=0;SFX.ok()}
   else{G.s='files';G.fi=SLOT;G.fa=0;G.arm=0;SFX.ok()}}
  return;}
 case 'days':{const it=dayItems();G.di=nav(Math.min(G.di,it.length-1),it.length);
  if(pressed('b')){G.s='stand';SFX.nav();return}
  if(pressed('a')||pressed('start')){const x=it[G.di];if(x.k){G.s='stand';SFX.nav();return}
   if(x.lock){SFX.no();msg('EARN A STAR ON DAY '+x.d+' FIRST');return}goDay(x.d)}
  return;}
 case 'shop':{G.ui=nav(G.ui,UPS.length+1);
  if(pressed('b')||((pressed('a')||pressed('start'))&&G.ui===UPS.length)){G.s='stand';SFX.nav();return}
  if(pressed('a')){const u=UPS[G.ui],lv=up(u[0]);if(lv>=u[3].length){SFX.no();msg('ALREADY MAXED');return}
   const c=u[3][lv];if(SV.coins<c){SFX.no();msg('NEED '+(c-SV.coins)+' MORE COINS');return}
   SV.coins-=c;SV.up[u[0]]=lv+1;store();SFX.ok();msg(u[1]+' BOUGHT!');}return;}
 case 'ward':{G.wi=nav(G.wi,WCAT.length+1);const back=G.wi===WCAT.length;
  if(pressed('b')||(back&&(pressed('a')||pressed('start')))){G.s='stand';SFX.nav();return}
  if(back)return;const cat=WCAT[G.wi][0],n=WARD[cat].length;
  if(pressed('right')){G.wv[cat]=(G.wv[cat]+1)%n;SFX.nav()}if(pressed('left')){G.wv[cat]=(G.wv[cat]+n-1)%n;SFX.nav()}
  if(pressed('a')){const i=G.wv[cat],nm=WARD[cat][i][0];
   if(owns(cat,i)){SV.look[cat]=i;lookChanged();store();SFX.ok();msg(cat==='awn'?'THE STAND IS '+nm+' NOW':'WEARING: '+nm);return}
   const q=WARD[cat][i][cat==='hat'?1:3];if(typeof q!=='number'){SFX.no();msg('UNLOCK: '+lockText(cat,i));return}
   if(SV.coins<q){SFX.no();msg('NEED '+(q-SV.coins)+' MORE COINS');return}
   SV.coins-=q;SV.own[cat].push(i);SV.look[cat]=i;lookChanged();store();SFX.ok();msg('BOUGHT AND WEARING: '+nm)}
  return;}
 case 'friends':case 'crew':{if(pressed('a')||pressed('b')||pressed('start')){G.s='stand';SFX.nav()}return;}
 case 'book':{if(pressed('left')||pressed('right')){G.bp=(G.bp+1)%3;SFX.nav()}
  if(pressed('b')||pressed('a')||pressed('sel')||pressed('start')){G.s=G.bookFrom==='play'?'play':G.bookFrom==='pause'?'pause':'stand';SFX.nav()}return;}
 case 'cine':cineUpd(dt);return;
 case 'intro':{if(pressed('a')||pressed('start')){G.s='play';G.fx=[];SFX.ok();snap()}else if(pressed('b')){G.L=null;G.s='stand';SFX.nav()}return;}
 case 'play':playUpd(dt);return;
 case 'pause':{const it=pauseItems();G.pi=nav(G.pi,it.length);if(pressed('b')){G.s='play';return}
  if(pressed('a')||pressed('start')){const k=it[G.pi];
   if(k==='RESUME'){G.s='play';SFX.ok()}else if(k==='RECIPES'){G.s='book';G.bookFrom='pause';G.bp=0}
   else if(k==='RESTART DAY'){startDay(G.L.d)}else if(k==='QUIT DAY'){SV.run=null;store();G.L=null;G.s='stand';SFX.nav()}
   else{snap();A.eject()}}return;}
 case 'done':{const it=doneItems();G.ri=nav(G.ri,it.length);
  if(G.t>.5&&(pressed('a')||pressed('start'))){const k=it[G.ri],d=G.res.d;
   const go2=()=>{if(k==='NEXT DAY'){const ex=nightPick(G.res.st,d);cine('night',{who:ex[0][0],day:d+1},ex,()=>startDay(d+1))}
    else if(k==='PLAY AGAIN'||k==='TRY AGAIN')startDay(d);else{G.s='stand';G.si=0;asks();SFX.nav()}};
   const go1=()=>{if(SV.hpend.length)playHeart(go2);else go2()};
   if(k!=='PLAY AGAIN'&&k!=='TRY AGAIN'&&G.res.st>=1&&STORY[d]&&!SV.story[d])playStory(d,go2);else go1();} /* v0.7: after a chapter, a waiting heart scene keeps for the next day */
  return;}}}

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
 case 'C':case 'W':{const A2=awn();counter(px,py);r(A2[1],px,py,16,3);for(let i=0;i<16;i+=4)r('#ffffff',px+i+2,py,2,3);r(A2[2],px,py+3,16,1);}
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
 if(ch==='B'){const o=L.lou;r('rgba(0,0,0,.2)',px+2,py+13,12,2);r(K,px+2,py+8,12,6);r('#c83838',px+3,py+9,10,4);r('#f07070',px+3,py+9,10,1);
  if(o)o.bowl.forEach((id,i)=>g.drawImage(IC[id],px+(o.bowl.length>1?i*6:3),py-1));return;}
 if(ch==='Z'){r(K,px,py+5,16,10);r('#5080b8',px+1,py+6,14,8);r('#80a8d8',px+2,py+7,12,2);return;}
 if(ch==='D'){counter(px,py);r(K,px+3,py-2,10,12);r('#c89858',px+4,py-1,8,10);r('#a07038',px+4,py-1,8,2);g.drawImage(IC.kib,px+3,py+1);return;}
 if(ch==='F'){counter(px,py);g.drawImage(IC.loaf,px+3,py-2);return;}
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
 r('rgba(0,0,0,.22)',px+2,py+13,8,2);g.drawImage(ES[dir][fr],px,py+bob);drawHat(SV.look.hat,px,py+bob,dir);
 if(L.held)drawHeld(L.held,px+6,py+bob-1);}
function drawField(ox,oy){const L=G.L;
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(y!==1)drawTile(x,y,kind(x,y)==='.'&&MAP[y][x]==='P'?'.':MAP[y][x]==='L'&&!L.pl[x+','+y]?'#':MAP[y][x],ox+x*TS,oy+y*TS);
 for(let y=2;y<ROWS;y++)for(let x=0;x<COLS;x++)drawThing(x,y,MAP[y][x],ox+x*TS,oy+y*TS);
 for(let i=0;i<3;i++){const cu=L.cu[i];if(!cu)continue;const s=whoSpr(cu.who),walk=cu.st==='in'||cu.st==='out',b=walk&&((G.t*8)|0)%2?-1:0;
  if(!s)continue;const x=Math.round(cu.x-s.width/2)+ox;
  if(cu.who==='LOUIE'){const sp=walk&&cu.side>0?A.LOU.l[((G.t*8)|0)%2]:walk?A.LOU.r[((G.t*8)|0)%2]:s;g.drawImage(sp,x,oy+4+b)}else g.drawImage(s,x,oy+3+b);}
 for(let x=0;x<COLS;x++)drawTile(x,1,MAP[1][x],ox+x*TS,oy+TS);
 SV.buds.slice(0,3).forEach((id,i)=>{const sp=whoSpr(id);if(!sp)return;const[bx,by]=BUDSPOT[i],b=((G.t*2+i)|0)%2;r('rgba(0,0,0,.25)',ox+bx*TS+2,oy+by*TS+10,12,3);g.drawImage(sp,ox+bx*TS-1,oy+by*TS-5-b,18,18)});
 for(const h of L.help)drawSp(h.t,ox+h.x,oy+h.y,h.mv&&((G.t*8+h.x)|0)%2?-1:0,h.carry);
 drawLouie(ox,oy);
 drawErin(ox,oy);
 const P=L.P,tx=P.x+P.fx,ty=P.y+P.fy,a=act(true);
 if(a.ok&&((G.t*3)|0)%3!==2){const x=ox+tx*TS,y=oy+ty*TS,c='#f8e060';[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].forEach(([u,v,su,sv])=>{const X=x+u*15,Y=y+v*15;r(c,X+(su<0?-3:0),Y,4,1);r(c,X,Y+(sv<0?-3:0),1,4)})}
 if(G.s==='play'){const t=plan();if(t&&t.x!==undefined&&(L.d<3||t.spr)&&!(t.x===tx&&t.y===ty)){const b=((G.t*4)|0)%2,x=ox+t.x*TS+8,y=oy+t.y*TS-8+b;
  r(K,x-4,y-1,9,3);r(K,x-3,y+2,7,2);r(K,x-2,y+4,5,1);r(K,x-1,y+5,3,1);r('#f8e060',x-3,y,7,1);r('#f8e060',x-2,y+2,5,1);r('#f8e060',x-1,y+3,3,1);r('#f8e060',x,y+4,1,1)}}
 for(const f of G.fx){if(f.k==='txt')text(f.s,ox+f.x-tw(f.s,2)/2,oy+f.y-Math.round(f.t*14),2,f.c);
  else if(f.k==='heart'){const yy=oy+f.y-Math.round(f.t*10);heartI(ox+f.x-30,yy,true,2);text(f.s+' +1',ox+f.x-16,yy,2,'#f8a0c0')}
  else if(f.k==='poof'){const k=Math.round(f.t*8);r('#e8e0f0',ox+f.x-k,oy+f.y-k,2,2);r('#e8e0f0',ox+f.x+k,oy+f.y-k,2,2);r('#e8e0f0',ox+f.x-k,oy+f.y+k-4,2,2);r('#e8e0f0',ox+f.x+k,oy+f.y+k-4,2,2)}}}
function drawLouie(ox,oy){const L=G.L,o=L.lou,bx=ox+8*TS,by=oy+3*TS;let sp;try{sp=A.LOU}catch(e){return}if(!sp)return;
 if(!o){g.drawImage(sp.l[0],bx-2,by+1);zz(bx+15,by);return;}
 const f=((G.t*6)|0)%2;
 if(o.st==='eat')g.drawImage(sp.l[f],bx-2,by-8+f);
 else if(o.st==='happy'){g.drawImage(((G.t*5)|0)%2?sp.l[0]:sp.r[0],bx-2,by+1-(((G.t*8)|0)%2));for(let i=0;i<3;i++)heartI(bx+2+i*6,by-8-((o.t*12+i*5)%10),true);}
 else{g.drawImage(o.st==='want'&&((G.t*2)|0)%2?sp.l[1]:sp.l[0],bx-2,by+1);if(o.st==='nap')zz(bx+15,by);}
 if(o.st==='want'){const n=o.want.length,w=6+12*n,x=bx-w-3,y=by-6;r(K,x,y,w,15);r('#fff4dc',x+1,y+1,w-2,13);r(K,x+w,y+8,2,2);r('#fff4dc',x+w-1,y+8,1,2);
  o.want.forEach((id,i)=>g.drawImage(IC[id],x+3+i*12,y+2));bar(x,y+16,w,o.mood/100,'#f878a8');}
 if(o.say){const s2=o.say.s;if(s2==='<3')heartI(bx+6,by-10-Math.round(o.say.t*6),true);else{const w=tw(s2,1)+6,x=Math.max(ox+2,bx+8-w/2),y=by-16-(o.st==='want'?6:0);r(K,x,y,w,11);r('#ffffff',x+1,y+1,w-2,9);text(s2,x+3,y+1,1,'#281c30',null)}}}
function zz(x,y){const k=((G.t*2)|0)%3;for(let i=0;i<=k;i++){const X=x+i*4,Y=y-i*4;r('#c8c8f0',X,Y,3,1);r('#c8c8f0',X+1,Y+1,1,1);r('#c8c8f0',X,Y+2,3,1)}}
function heartI(x,y,on,s=1){const c=on?'#f05878':'#4a3a50',p=(a,b,w)=>r(c,x+a*s,y+b*s,w*s,s);p(0,0,2);p(3,0,2);p(0,1,5);p(0,2,5);p(1,3,3);p(2,4,1);}
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
 g.save();g.beginPath();g.rect(0,fy,W,ROWS*TS);g.clip();drawField(0,fy);
 if(DAYS[L.d].eve){r('rgba(60,28,110,.36)',0,fy,W,ROWS*TS);for(const lx of [56,120,216]){g.globalAlpha=.13+.04*Math.sin(G.t*2.6+lx);r('#ffd94d',lx-26,fy+18,52,ROWS*TS-18);g.globalAlpha=1}}g.restore();
 const hy=fy+ROWS*TS+2;r('#181020',0,hy-2,W,VH-hy+2);
 const a=act(true),hs=G.nope>0&&G.nopeS?G.nopeS:a.s;
 if(!hs&&!L.held&&L.P.mv===0)ftext('WALK UP TO SOMETHING, PRESS A',W/2,hy+2,232,2,'#686078',null);
 if(hs)ftext((a.ok&&!(G.nope>0)?'A: ':'')+hs,L.held?96:W/2,hy+2,L.held?186:232,2,G.nope>0?'#f89060':a.ok?'#ffffff':'#a8a0b8',null);
 if(L.held)text('B: TOSS',W-tw('B: TOSS')-3,hy+2,2,'#a8a0b8',null);
 if(G.s==='play')drawQuip(VH,hy);
 g.restore();}
function rtextR(s,xr,y,sc,c){text(s,xr-tw(s,sc),y,sc,c);}

/* ---------- screens ---------- */
function list(items,sel,y,step,max,draw){const n=items.length,top=Math.max(0,Math.min(n-max,sel-((max/2)|0)));
 for(let k=0;k<Math.min(max,n);k++){const i=top+k,on=i===sel,yy=y+k*step;if(on){r('#f8e060',6,yy,W-12,step-1);r('#281c30',7,yy+1,W-14,step-3);const bx=9+(((G.t*3)|0)%2);r('#f8e060',bx,yy+3,2,step-7);r('#f8e060',bx+2,yy+4,2,step-9)}draw(items[i],i,on,yy)}
 if(top>0){r('#f8e060',117,y-5,6,2);r('#f8e060',119,y-7,2,2)}if(top+max<n){const b=y+max*step+1;r('#f8e060',117,b,6,2);r('#f8e060',119,b+2,2,2)}}
function cList(items,sel,y,step){items.forEach((s,i)=>{const on=i===sel,yy=y+i*step;if(on){const w=tw(s)+20;r('#f8e060',Math.round((W-w)/2),yy,w,step-1);r('#281c30',Math.round((W-w)/2)+1,yy+1,w-2,step-3)}
 ftext(s,W/2,yy+Math.round((step-1-8)/2),W-20,2,on?'#ffffff':'#c8c0d8')});}
function scene(VH){/* the title scene: dusk-pink sky, the stand, the garden */
 const sky=['#f8c8a0','#f8b098','#e898a8','#c890b8'];sky.forEach((c,i)=>r(c,0,i*Math.round(VH*.12),W,Math.round(VH*.12)+1));r('#c890b8',0,sky.length*Math.round(VH*.12),W,VH);
 r('#fff0b0',182,Math.round(VH*.1),14,14);r('#fff8d8',184,Math.round(VH*.1)+2,10,10);
 const gy=Math.round(VH*.62);r('#58b858',0,gy,W,VH-gy);r('#3c9848',0,gy,W,2);
 for(let row=0;row<3;row++)for(let i=0;i<7;i++){const x=10+i*16+(row%2)*6,y=gy+14+row*16;r('#8a5a3a',x,y+6,12,4);r('#3c9848',x+5,y+1,2,6);r(['#58b848','#e04030','#e8c050'][(i+row)%3],x+3,y,6,4)}
 lantern(52,gy+2,2);
 const sx=132,sy=gy-44;r('#6a4830',sx,sy+16,4,30);r('#6a4830',sx+92,sy+16,4,30);
 const A2=awn();for(let i=0;i<12;i++){r(i%2?'#ffffff':A2[1],sx-4+i*9,sy,9,14);r(i%2?'#e0d0e0':A2[2],sx-4+i*9,sy+14,9,3);r(i%2?'#ffffff':A2[1],sx-2+i*9,sy+17,5,2)}
 r(K,sx-5,sy-1,110,1);r('#e8d0a0',sx-2,sy+32,100,8);r('#f8e8c0',sx-2,sy+32,100,2);r('#6a4830',sx-2,sy+40,100,6);
 drawFood(['bun','pat_c','let_c','tom_c'],sx+20,sy+33);drawFood(['let_c','tom_c'],sx+44,sy+33);g.drawImage(IC.smo,sx+60,sy+23);drawFood(['fry'],sx+80,sy+33);
 g.drawImage(ES.d[0],sx+40,sy+18);drawHat(SV.look.hat,sx+40,sy+18,'d');try{g.drawImage(A.LOU.r[((G.t*2)|0)%2],sx-28,gy-11)}catch(e){}}
function drawTitle(){const{VH}=begin();scene(VH);
 ftext('PATCH &',W/2,14,W-12,5,'#fff8e0','#783048');ftext('PLATE',W/2,42,W-12,5,'#fff8e0','#783048');ftext("ERIN'S FARM STAND",W/2,72,W-12,2,'#5a2848',null);ftext('AT SUNKEEP, UNDER THE GREAT LANTERN',W/2,86,W-12,1,'#783048',null);
 const it=titleItems(),st=16,y0=VH-12-it.length*st;r('rgba(40,24,48,.78)',0,y0-6,W,it.length*st+10);cList(it,G.mi,y0,st);
 if(slotUsed(SLOT)){const s2='FILE '+(SLOT+1)+'  DAY '+(nextDay()+1);text(s2,4,y0-20,2,'#ffffff');coinTxt(SV.coins,W-12-tw(String(SV.coins)),y0-20)}
 g.restore();}
function drawFiles(){const{VH}=begin();r('#2a2238',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#251e32',0,y,W,1);
 text('SAVE FILES',6,6,3,'#f8e060');rtextR('AUTOSAVES',W-6,9,1,'#a8a0b8');
 const ch=Math.min(66,Math.floor((VH-58)/3));
 for(let i=0;i<3;i++){const y=26+i*(ch+2),on=G.fi===i,S2=readSlot(i),cur=i===SLOT;
  r(on?'#f8e060':'#4a4060',6,y,W-12,ch);r(on?'#3a3050':'#302840',7,y+1,W-14,ch-2);
  text('FILE '+(i+1),12,y+4,2,on?'#f8e060':'#c8c0d8');if(cur&&S2)text('PLAYING',62,y+5,1,'#84d870',null);
  if(!S2){ftext('NEW GAME',W/2+20,y+ch/2-4,140,3,on?'#ffffff':'#8880a0',null);erinActor(34,y+ch-6,2,0,{dress:0,apron:0,hat:0,awn:0});continue}
  erinActor(30,y+ch-6,2,0,S2.look);
  const st=Object.values(S2.stars).reduce((a2,b2)=>a2+(b2|0),0);text('DAY '+Math.min(S2.day+1,DAYS.length),58,y+18,2,'#ffffff');
  stars(1,110,y+19);text(String(st),120,y+18,2,'#f8d040');coinTxt(S2.coins,150,y+18);
  (S2.crew||[]).forEach((T,j)=>drawSp(T,64+j*12,y+44));const hs=FRIENDS.reduce((a2,w)=>a2+[4,12,24,40].filter(t=>(S2.friend[w]|0)>=t).length,0);
  heartI(150,y+34,true);text(String(hs),158,y+33,1,'#f8a0c0',null);
  if(on){const bt=['PLAY','ERASE'];bt.forEach((t,j)=>{const x=W-92+j*44,sel=G.fa===j;r(sel?(j?'#e84860':'#58c048'):'#4a4060',x,y+ch-17,40,13);ftext(t,x+20,y+ch-15,36,1,'#ffffff',null)})}}
 const by=26+3*(ch+2);const on=G.fi===3;if(on)r('#f8e060',W/2-30,by,60,14);ftext('BACK',W/2,by+3,56,2,on?'#281c30':'#a8d8f8',null);
 ftext(G.nope>0?G.nopeS:(G.fi<3&&slotUsed(G.fi)?'◀ ▶ PLAY OR ERASE   B: BACK':'A: PICK   B: BACK'),W/2,VH-13,W-12,1,G.nope>0?'#f89060':'#a8a0b8',null);g.restore();}
function hubIcon(k,x,y){const C={PLAY:'#58c048',DAYS:'#f8d040',UPGRADES:'#f8c030',WARDROBE:'#c0a8f0',SPROUTS:'#58c048',FRIENDS:'#f05878',RECIPES:'#f8f0e0',FILES:'#48a0f0'}[k];
 if(k==='PLAY'){r(C,x+1,y,2,9);r(C,x+3,y+1,2,7);r(C,x+5,y+2,2,5);r(C,x+7,y+3,2,3)}else if(k==='DAYS')g.drawImage(IC.star,x+1,y+1);else if(k==='UPGRADES')g.drawImage(IC.coin,x+1,y+2);
 else if(k==='WARDROBE'){r(C,x+3,y,4,2);r(C,x+2,y+2,6,3);r(C,x+1,y+5,8,4)}else if(k==='SPROUTS')drawSp('LEAF',x+5,y+10);else if(k==='FRIENDS')heartI(x+1,y+2,true);
 else if(k==='RECIPES'){r(K,x,y+5,10,4);r(C,x+1,y+5,8,2);r('#e04030',x+3,y+3,4,2)}else{r(C,x+1,y+1,8,8);r('#e0e8f8',x+3,y+1,4,3);r('#283858',x+3,y+6,4,3)}}
function drawStand(){const{VH}=begin();r('#3a2638',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#33202f',0,y,W,1);
 const A2=awn();r(A2[1],0,0,W,24);for(let i=0;i<W;i+=16)r('#ffffff',i+8,0,8,24);r(A2[2],0,24,W,3);for(let i=0;i<W;i+=16){r(A2[1],i,27,8,3);r('#ffffff',i+8,27,8,3)}
 panel(36,3,168,19);ftext("ERIN'S STAND",W/2,7,158,3,'#f8e060',null);
 text('FILE '+(SLOT+1),6,34,1,'#a8a0b8',null);coinTxt(SV.coins,W-14-tw(String(SV.coins)),33);
 const D2=asks(),ay=46;r(K,6,ay,W-12,50);r('#fff4dc',7,ay+1,W-14,48);text("TODAY'S ASKS",12,ay+3,1,'#a06808',null);
 if(D2.all)rtextR('ALL DONE! +1 TICKET',W-12,ay+3,1,'#3c9848');
 D2.a.forEach((a2,i)=>{const y=ay+15+i*11;r(a2.done?'#58c048':'#c8b898',12,y+1,7,7);if(a2.done){r('#ffffff',14,y+4,1,2);r('#ffffff',15,y+5,1,2);r('#ffffff',16,y+3,1,3)}
  text(askText(a2),23,y,1,a2.done?'#7a9870':'#3a2618',null);rtextR(a2.p+'/'+a2.n,W-12,y,1,a2.done?'#3c9848':'#7a5a40')});
 const it=hubItems(),st=15,y0=102,max=Math.max(4,Math.floor((VH-y0-20)/st));
 list(it,G.si,y0,st,max,(x,i,on,yy)=>{hubIcon(x.k,22,yy+2);text(x.l,38,yy+3,2,on?'#ffffff':x.k==='PLAY'?'#a8f080':'#c8c0d8')});
 const hint=G.nope>0?G.nopeS:SV.run?'A DAY IS WAITING WHERE YOU LEFT IT':SV.day>=DAYS.length&&!budNext()?'EVERY DAY DONE. REPLAY FOR STARS!':budNext()?'KITCHEN BUDDY '+(SV.buds.length+1)+' OF 3: '+budNext()[1]+' STARS':'SUNKEEP: ONE PATCH, ONE HUNGRY VALLEY';
 if(hint)ftext(hint,W/2,VH-13,W-12,1,G.nope>0?'#f89060':'#a8a0b8',null);
 g.restore();}
function drawDays(){const{VH}=begin();r('#3a2638',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#33202f',0,y,W,1);
 text('ALL DAYS',6,6,3,'#f8e060');stars(1,W-50,10);rtextR(String(totalStars()),W-6,9,2,'#f8d040');
 const it=dayItems(),st=16,y0=30,max=Math.max(4,Math.floor((VH-y0-22)/st));
 list(it,G.di,y0,st,max,(x,i,on,yy)=>{const ty=yy+4;if(x.k){ftext('BACK',W/2,ty,W-20,2,on?'#ffffff':'#a8d8f8');return}const D=DAYS[x.d];
  if(x.lock){text('DAY '+(x.d+1),22,ty,2,'#686078');text('???',68,ty,2,'#686078');return}
  text('DAY '+(x.d+1),22,ty,2,on?'#f8e060':'#e8c870');ftext(D.n,68+56,ty,110,2,on?'#ffffff':'#c8c0d8');stars(SV.stars[x.d]|0,W-36,ty);});
 const sel=it[G.di];let hint='';if(G.nope>0)hint=G.nopeS;else if(sel&&sel.d!==undefined&&!sel.lock)hint=SV.best[sel.d]?'BEST: '+SV.best[sel.d]+' COINS':'NEW!';
 if(hint)ftext(hint,W/2,VH-14,W-12,2,G.nope>0?'#f89060':'#a8a0b8',null);g.restore();}
function drawWard(){const{VH}=begin(),v=G.wv;r('#2c2840',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#28243a',0,y,W,1);
 text('WARDROBE',6,6,3,'#f8e060');coinTxt(SV.coins,W-14-tw(String(SV.coins)),9);
 const px=162,py=30,pw=72,ph=104,A2=AWN[v.awn];r(K,px-1,py-1,pw+2,ph+2);r('#a8e0f8',px,py,pw,ph);r('#58b858',px,py+ph-26,pw,26);
 for(let i=0;i<8;i++)r(i%2?'#ffffff':A2[1],px+i*9,py,9,12);r(A2[2],px,py+12,pw,2);r('#e8d0a0',px,py+ph-34,pw,6);
 erinActor(px+pw/2,py+ph-6,4,((G.t*2)|0)%2?-1:0,v);
 WCAT.forEach(([cat,nm],i)=>{const y=30+i*30,on=G.wi===i,it=WARD[cat][v[cat]],own=owns(cat,v[cat]),wear=SV.look[cat]===v[cat];
  if(on){r('#f8e060',4,y-2,152,28);r('#3a3454',5,y-1,150,26)}text(nm,10,y+1,1,on?'#f8e060':'#a8a0b8',null);
  if(on){text('◀',10,y+12,2,'#f8e060');text('▶',142,y+12,2,'#f8e060')}
  if(cat==='dress'||cat==='awn'){r(K,24,y+13,10,9);r(it[1],25,y+14,8,7)}else if(cat==='apron'&&it[1]){r(K,24,y+13,10,9);r(it[1],25,y+14,8,7)}
  text(it[0],38,y+12,2,on?'#ffffff':'#c8c0d8');
  rtextR(wear?'WEARING':own?'OWNED':lockText(cat,v[cat]),150,y+1,1,wear?'#84d870':own?'#a8d8f8':'#f8a060')});
 const by=30+WCAT.length*30,on=G.wi===WCAT.length;if(on)r('#f8e060',30,by,90,14);ftext('BACK',75,by+3,86,2,on?'#281c30':'#a8d8f8',null);
 ftext(G.nope>0?G.nopeS:'◀ ▶ LOOK   A: WEAR OR BUY',W/2,VH-13,W-12,1,G.nope>0?'#f89060':'#a8a0b8',null);g.restore();}
function drawFriends(){const{VH}=begin();r('#3a2030',0,0,W,VH);for(let y=0;y<VH;y+=8)r('#341c2b',0,y,W,1);
 text('FRIENDS',6,6,3,'#f8e060');const rh=Math.min(40,Math.floor((VH-48)/FRIENDS.length));
 FRIENDS.forEach((w,i)=>{const y=28+i*rh,h=heartsOf(w),p2=SV.friend[w]|0,nx=HEARTS[h],pv=h?HEARTS[h-1]:0;
  r('#2a1622',4,y,W-8,rh-3);const s2=sprOf(w);if(s2){if(w==='LOUIE')g.drawImage(s2,6,y+rh-18);else{const sh=Math.min(s2.height,rh-5);g.drawImage(s2,0,0,s2.width,sh,16-s2.width/2,y+Math.round((rh-3-sh)/2),s2.width,sh)}}
  text(w,32,y+3,2,WHOC(w));for(let j=0;j<4;j++)heartI(W-64+j*13,y+4,j<h,2);
  if(nx)bar(W-64,y+17,50,(p2-pv)/(nx-pv),'#f878a8');else rtextR('BEST FRIENDS',W-12,y+17,1,'#f8a0c0');
  const gift=Object.keys(HGIFT).find(k=>k.split(':')[0]===w&&+k.split(':')[1]>h),note=h>=4?(w==='LOUIE'?'HE ADORES YOU':'A FRIEND FOR LIFE'):w==='LOUIE'?'FEED AND PET HIM':gift?(+gift.split(':')[1])+' HEARTS: A GIFT':HS[w]&&h<4?'NEXT HEART: A SCENE':'SERVE THEM TO GROW';
  text(SV.fav[w]&&h<4&&FAV[w]?'LOVES '+RC[FAV[w]].n:note,32,y+16,1,'#c8a8b8',null)});
 ftext('SERVE THEM TO GROW HEARTS.  B: BACK',W/2,VH-13,W-12,1,'#c8a8b8',null);g.restore();}
function drawShop(){const{VH}=begin();r('#2a3a30',0,0,W,VH);text('UPGRADES',6,6,3,'#f8e060');coinTxt(SV.coins,W-14-tw(String(SV.coins)),9);
 const it=UPS.concat([null]),st=24,y0=28,max=Math.max(3,Math.floor((VH-y0-22)/st));
 list(it,G.ui,y0,st,max,(u,i,on,yy)=>{if(!u){ftext('BACK',W/2,yy+8,W-20,2,on?'#ffffff':'#a8d8f8');return}const lv=up(u[0]),mx=lv>=u[3].length;
  text(u[1],12,yy+3,2,on?'#ffffff':'#e8e0f0');text(u[2],12,yy+13,1,'#a8a0b8');
  for(let j=0;j<u[3].length;j++)r(j<lv?'#84d870':'#504860',W-60+j*6,yy+5,4,4);
  if(mx)rtextR('MAX',W-12,yy+12,1,'#84d870');else{const c=String(u[3][lv]);coinTxt(c,W-20-tw(c,2),yy+12,2,SV.coins>=u[3][lv]?'#f8d040':'#a08868')}});
 if(G.nope>0)ftext(G.nopeS,W/2,VH-14,W-12,2,'#f89060',null);g.restore();}
function drawBook(){const{VH}=begin();r('#f0e4c8',0,0,W,VH);r('#c8b088',0,0,W,22);r('#a08860',0,22,W,1);
 text(['RECIPES','THE KITCHEN','LOUIE'][G.bp],6,6,3,'#5a3c2a',null);rtextR('◀ ▶',W-6,8,2,'#7a5a40');
 const dmax=Math.min(SV.day+(G.L?1:0),DAYS.length-1),dd=G.L?Math.max(G.L.d,dmax):dmax,seen=new Set();for(let d=0;d<=Math.min(dd,DAYS.length-1);d++)DAYS[d].rc.forEach(k=>seen.add(k));
 if(G.bp===2){try{g.drawImage(A.LOU.l[((G.t*2)|0)%2],W/2-20,30,40,26)}catch(e){}
  const ls=['LOUIE NAPS BY HIS BOWL.','WHEN HE WANTS SOMETHING,','A BUBBLE SAYS WHAT.','',' KIBBLE: THE BAG',' LOAF: THE TIN',' LETTUCE: CHOPPED, FRESH','','SOMETIMES HE WANTS TWO.','SOMETIMES HE CHANGES HIS MIND.','A HAPPY LOUIE MEANS BIGGER TIPS.','A ON LOUIE: PET HIM.'];
  ls.forEach((t,i)=>ftext(t,W/2,64+i*13,W-12,1,'#5a3c2a',null));[['kib',150],['loaf',163],['let_c',176]].forEach(([id,y])=>g.drawImage(IC[id],22,y-2));}
 else if(!G.bp){const ks=RCORDER,st=Math.min(21,Math.floor((VH-48)/ks.length));ks.forEach((k,i)=>{const y=28+i*st,rc=RC[k],on=seen.has(k);
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
 const s=whoSpr(D.who),bx=18,by=py+56;r(WHO[D.who].c,bx,by,36,36);r('#281c30',bx+2,by+2,32,32);if(s){const sc=D.who==='LOUIE'?1:2,sh=Math.min(s.height,16);g.drawImage(s,0,0,s.width,sh,bx+18-s.width*sc/2,by+18-sh*sc/2,s.width*sc,sh*sc)}
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
 if(R2.st===3)for(let i=0;i<40;i++){const x=(i*47+Math.sin(G.t+i)*8)%W,y=((G.t*40+i*31)%VH);r(['#f8d040','#e85878','#58c048','#48a0f0','#ffffff'][i%5],Math.round(x),Math.round(y),2,3)}
 const ph=208,py=Math.round((VH-ph)/2);panel(10,py,W-20,ph);
 ftext(R2.st?'DAY '+(R2.d+1)+' DONE!':'SO CLOSE!',W/2,py+8,W-30,4,'#f8e060',null);
 const shown=Math.min(R2.st,Math.floor(G.t/.45));stars(shown,W/2-24,py+34,true);
 const rows=[['SERVED',R2.served+' / '+R2.n],['COINS','+'+R2.coins],['TIPS','+'+R2.tips]];
 rows.forEach(([a,b],i)=>{text(a,26,py+58+i*14,2,'#c8c0d8',null);rtextR(b,W-26,py+58+i*14,2,i===1?'#f8d040':'#ffffff')});
 let y=py+102;const note=s=>{ftext(s,W/2,y,W-34,2,'#84d870',null);y+=13};
 if(R2.unl)note('DAY '+(R2.d+2)+' IS OPEN!');if(R2.last)note('EVERY DAY DONE. WOW!');if(R2.seed)note('+ '+R2.seed+' SPROUT SEED!');if(R2.tix)note('+1 CAPSULE TICKET');if(R2.hearts)note('A NEW HEART!');else if(R2.fed)note('LOUIE ATE '+R2.fed+(R2.fed>1?' TIMES':' TIME')+'. GOOD BOY.');if(R2.best)note('NEW BEST!');if(!R2.st)note('NEED '+(G.L?G.L.goal[0]:'')+' COINS FOR A STAR');
 cList(doneItems(),G.ri,py+ph-52,16);g.restore();}
function draw(){H=A.H();if(G.s!==G.lastS){if(!(G.s==='play'&&G.lastS==='cine')&&!(G.s==='cine'&&G.lastS==='play'))G.fadeT=.16;G.lastS=G.s}
 switch(G.s){case 'title':drawTitle();break;case 'stand':drawStand();break;case 'files':drawFiles();break;case 'days':drawDays();break;case 'ward':drawWard();break;case 'friends':drawFriends();break;case 'shop':drawShop();break;case 'crew':drawCrew();break;case 'cine':drawCine();break;case 'book':drawBook();break;
  case 'intro':drawIntro();break;case 'play':drawPlay();break;case 'pause':drawPause();break;case 'done':drawDone();break;}
 if(G.fadeT>0){G.fadeT-=1/60;g.save();r('rgba(12,8,20,'+Math.max(0,G.fadeT/.16*.75)+')',0,0,W,Math.max(H,250));g.restore()}}

/* put the phone down: the day pauses and saves */
try{document.addEventListener('visibilitychange',()=>{if(!A.active())return;if(document.hidden){if(G.s==='cine'&&G.cine&&G.cine.from==='play'){G.cine=null;G.s='play'}if(G.s==='play'){G.s='pause';G.pi=0}snap()}});
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
 mus:()=>A.hasTracks&&A.hasTracks('pp')?'pp':'game',
 paused:()=>G.s==='pause'||G.s==='cine'&&G.cine&&G.cine.from==='play'||G.s==='intro'||G.s==='book'&&G.bookFrom!=='stand',
 update,draw,
 _:{G,cine,quip,useSlot,eraseSlot,slotUsed,asks,bumpAsk,friend,heartsOf,owns,louPick,get SLOT(){return SLOT},get SV(){return SV},set SV(v){SV=v},DAYS,RC,UPS,MAP,WIN,WHO,HI,HURRY,QP,NIGHT,NIGHT_V,HS,BUDS,BUDLINE,WHODAY,STORY,FAV,FAVSAY,playStory,big,dayBigs,playBigs,budHas,totalStars,TASTE,TASTE_M,FRIENDS,peopleFor,nightPick,wrap,tw,plan,need,act,walkable,kind,newDay,startDay,finish,snap,store,KEY,
  setDay(d){SV.day=d;store()}}};
};
