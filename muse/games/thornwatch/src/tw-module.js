/* ================================================================
   CARTRIDGE 4: THORNWATCH — a garden tower-defense in the Sprouts
   universe. Old Thornback's bramble creeps follow the dirt path
   through Erin's Garden to the Garden Heart. Plant sprout towers
   and keeper heroes anywhere off the path and hold 10 nights.
   v3.0 "Make it Bloons": ONE winding track, FREE placement with
   range circles, building ANYTIME (between and during rounds),
   fast-forward (B on open ground cycles 1X/2X/3X), money dripping
   from pops, a persistent shop strip, and brisk 1X pacing.
   v2.0 content kept whole: 6 sprout towers + 12 fork variants,
   6 keeper heroes with cinematic abilities, Louie + THE BOOF,
   the full creep roster, named placeholder keepers, the juice.
   v3.1: VISUAL OVERHAUL ONLY — mk() pixel sprites for every tower,
   creep and the Heart; a pre-rendered textured garden board (day +
   night); icon-first shop strip + a permanent info bar. All v3.0
   mechanics, numbers and balance untouched.
   v3.2: THE PORT — v3.1's sprites were first-draft inventions and
   it showed. v3.2 stops inventing: creeps are Rootdeep's real
   RDSPR sprites recolored to bramble, towers are Sprouts' own
   drawBud grown to tower scale, and the board is rendered with
   Sprouts' verbatim TL tile painters. Art/layout only, again.
   Save key: 'thornwatch-v1' (best night + wins + plays; v1/v2
   saves load untouched — same key, same shape; v3.3 adds a
   backward-compatible guideDone flag — old saves with plays>0
   or best>0 migrate to done and never see the guide).
   v3.3: CONTROLS + ONBOARDING — grid cursor (16px cells, tap =
   one cell, hold = accelerating repeat), the shop strip joins
   the cursor's travel path (DOWN off the bottom row walks the
   cards with LEFT/RIGHT wrap, A/UP returns armed; SELECT kept
   as a legacy cycle), the info bar always names the current
   A/B actions, START mid-round opens a real pause menu
   (Resume / How to Play / Restart Night / Quit to Title /
   Skip Guide), a 3-page HOW TO PLAY (loop+goal, controls,
   creep field guide), and a Louie-led guided first run.
   Controls: D-pad move / pick · A plant / grow-fork / fire /
   pick · B uproot / speed on open ground in a round / back ·
   START begin the round / pause menu.
   v3.5 "Flesh it out": WIDTH BEFORE LENGTH (Will, via BTD6) —
   three gardens (maps) with their own tracks, per-map STANDARD /
   HARD / ALT NIGHTS modes, stars per map x mode x night, SUN
   DROPS buying permanent LANTERN UPGRADES, the SUNFARM economy
   fork, GRAND Lv3 forms, POWERS on SELECT mid-round, HERO
   TRAINING Lv1-3, BUBBLEBRAM + BURROWER creeps, the BRAMBLE
   MAW and THORNBACK PRIME finales, THE LONG NIGHT endless.
   Also Will's two fixes: the aimer range circle is GONE (a
   placed tower's range shows only while inspected, dashed),
   and a full black/dim-text contrast pass.
   v3.6 "Playtest round": standalone night starts get a fought-
   through purse (map-select/PLAY jumps were death sentences);
   YUKON drives the path nearest Mama and only hits that path;
   hero/tower info lines rebuilt to fit 240px (short ability
   names + a fit ladder), GRAND name doubling fixed; SUNFARM
   lifetime earnings tracked + shown; RAIN is weather (spawns
   during it are slowed too); LOUIE'S HOWL retuned (stun 3s,
   reveal 14s); HARD hp x1.35 -> x1.28 (one knob, sim-logged);
   defeat screen counts held nights honestly and A retries the
   run, B goes to title; POWERS gets a Louie tip at 80 petals
   and an honest panel title; the Crossroads glows at the gate
   that feeds next; cinematic no longer says "ten nights".
   ================================================================ */
let TW=null;
const TWDEF=()=>({best:0,wins:0,plays:0,guideDone:false,introSeen:false,stars:{},drops:0,perks:[],endlessBest:0,seen:{}}); /* v4: seen = story scenes already shown (old saves get an empty one: nothing is granted) */
try{const s=localStorage.getItem('thornwatch-v1');
 if(s){const raw=JSON.parse(s);TW=Object.assign(TWDEF(),raw);
  if(raw.guideDone===undefined){TW.guideDone=(TW.plays>0||TW.best>0||TW.wins>0);
   try{localStorage.setItem('thornwatch-v1',JSON.stringify(TW))}catch(e){}}
  if(raw.introSeen===undefined){TW.introSeen=(TW.plays>0||TW.best>0||TW.wins>0);
   try{localStorage.setItem('thornwatch-v1',JSON.stringify(TW))}catch(e){}}
  if(raw.stars===undefined){TW.stars={};TW.drops=0;TW.perks=[];TW.endlessBest=0;
   const cl=TW.wins>0?10:Math.max(0,Math.min(10,TW.best-1));
   for(let n=1;n<=cl;n++){TW.stars['1s'+n]=1;TW.drops++}
   try{localStorage.setItem('thornwatch-v1',JSON.stringify(TW))}catch(e){}}}
 else TW=TWDEF();}
catch(e){TW=TWDEF()}
function twSave(){try{localStorage.setItem('thornwatch-v1',JSON.stringify(TW))}catch(e){}}
/* ---- v3.5 meta: Sun Drops, Lantern Upgrades, hero training ---- */
const TWPERKS=[
 {id:'purse',n:'DEEP PURSE',fx:'+20 START PETALS',cost:3},
 {id:'heart',n:'SECOND HEART',fx:'+2 MAX HEART',cost:4},
 {id:'discount',n:"KEEPER'S DISCOUNT",fx:'HEROES -10% PETALS',cost:5},
 {id:'soil',n:'RICH SOIL',fx:'POP DRIP +50%',cost:4},
 {id:'boof',n:'DOUBLE BOOF',fx:'LOUIE STUNS TWICE',cost:5},
 {id:'eye',n:"GARDENER'S EYE",fx:'+5% ALL RANGES',cost:6},
 {id:'fork',n:'FORKED PATHS',fx:'FORKS -15% PETALS',cost:4},
 {id:'warm',n:'WARM LANTERN',fx:'ABILITY TIME -15%',cost:6}];
function twHasPerk(id){return TW.perks&&TW.perks.indexOf(id)>=0}
function twHeroCost(i){return Math.round(TWHERO[i].cost*(twHasPerk('discount')?.9:1))}
function twForkCost(ty,v){return Math.ceil(TWFORK[ty][v-1].cost*(twHasPerk('fork')?.85:1))}
const TWGRANDC=[420,460,340,480,380,440];
const TWGRANDN=[['WILDFIRE HEART','ETERNAL EMBER'],['WORLD SIEGE','TWIN TEMPEST'],
 ['ABSOLUTE ZERO','THE LONG MIST'],['TESLA STORM','OVERCLOCKED SKY'],
 ['MOTHER GROVE','GRAND SUNFARM'],['GRAND JACKPOT','THE ONE EYE']];
const TWPOW=[{n:'SUNBURST',cost:150,fx:'90 DMG TO ALL ON SCREEN'},
 {n:'RAIN OF DEW',cost:80,fx:'ALL DRONES SLOWED 10S'},
 {n:"LOUIE'S HOWL",cost:100,fx:'STUN 3S + REVEAL 14S'}];
function twGrandN(t){const n=TWGRANDN[t.type][t.variant-1];return n.indexOf('GRAND ')===0?n:'GRAND '+n}
function twIsBoss(k){return k==='boss'||k==='maw'||k==='prime'}
function twFrontierIn(map,mode){const N=TWMAPS[map-1].nights;
 for(let n=1;n<=N;n++)if(!TW.stars[map+mode+n])return n;return N}
function twFrontier(){for(let m=1;m<=3;m++){const N=TWMAPS[m-1].nights,f=twFrontierIn(m,'s');
  if(f<N||!TW.stars[m+'s'+N])return{map:m,night:f}}return{map:3,night:TWMAPS[2].nights}}
function twMapCleared(m){const N=TWMAPS[m-1].nights;
 return (TW.stars[m+'s'+N]||0)>0||(TW.stars[m+'h'+N]||0)>0}
function twStarPoints(){let s=0;for(const k in TW.stars)s+=TW.stars[k];return s}
function twClearedCount(){let c=0;for(const k in TW.stars)if(k[1]==='s')c++;return c}
/* sprout tower table, Sprouts TYPES order: 0 EMBER 1 PEB 2 DEW 3 ZIP 4 LEAF 5 LUCKY */
const TWT=[
 {cost:25,rng:37,cd:.85,dmg:4,role:'BURNS DRONES OVER TIME'},
 {cost:30,rng:33,cd:1.5,dmg:13,shred:1,role:'HEAVY SHOT, SHREDS ARMOR'},
 {cost:20,rng:35,cd:1.05,dmg:2,slowF:.5,slowT:1.7,role:'SLOWS + SHOWS STEALTH'},
 {cost:35,rng:39,cd:1.25,dmg:5,chain:2,role:'ZAPS 3 DRONES AT ONCE'},
 {cost:20,rng:0,cd:0,dmg:0,dawn:6,role:'GROWS +PETALS EACH DAWN'},
 {cost:30,rng:37,cd:.95,dmg:5,crit:.25,role:'LUCKY HUGE CRIT HITS'}];
const TWCLS=['fire','heavy','cold','spark','none','sharp'];
/* the LV2 fork: two named variants per sprout type */
const TWFORK=[
 [{n:'WILDFIRE',fx:'BURN X2, BURNS LONGER',cost:24,burnDps:2.2,burnT:4,dmg:1.3},
  {n:'EMBERHEART',fx:'SHOTS WAY FASTER',cost:22,cd:.55,dmg:1.5,rng:4}],
 [{n:'SIEGE',fx:'HUGE DMG, SHRED 3',cost:26,dmg:2.2,shred:3,cd:1.15},
  {n:'QUICKLOAD',fx:'DOUBLE SHOT SPEED',cost:24,cd:.5,dmg:1.4}],
 [{n:'DEEPCHILL',fx:'SLOW 68%, LASTS LONGER',cost:18,slowF:.32,slowT:2.6,dmg:2},
  {n:'MISTVEIL',fx:'BIG MIST SHOWS STEALTH',cost:20,rngM:1.5,slowF:.45,dmg:1.3}],
 [{n:'TESLA',fx:'CHAINS 5 DRONES',cost:28,chain:5,dmg:1.5},
  {n:'OVERCLOCK',fx:'ZAPS TWICE AS FAST',cost:26,cd:.5,dmg:1.3}],
 [{n:'GROVE',fx:'+14 PETALS A DAWN',cost:18,dawn:14},
  {n:'SUNFARM',fx:'GROWS PETALS ALL NIGHT',cost:20,dawn:4,farmPer:6,farmAmt:4}],
 [{n:'JACKPOT',fx:'CRITS 40% FOR X5',cost:26,crit:.4,critMult:5,dmg:1.2},
  {n:'DEADEYE',fx:'STEADY HEAVY HITS',cost:24,dmg:2.1,crit:.15}]];
/* keeper heroes: one of each, an attack + a cooldown ability fired in a round */
const TWHERO=[
 {name:'WILL',cost:110,rng:40,cd:.8,dmg:7,cls:'phys',col:'#fff2a8',ab:'MAZEL TOV LASER',abS:'LASER',abCd:25,atk:'PETAL BOLTS, STEADY',line:'WILL: For the garden. For Erin.'},
 {name:'ERIN',cost:100,rng:34,cd:1,dmg:6,cls:'phys',kb:16,col:'#f8f0e0',ab:'TOWEL WHIP',abS:'WHIP',abCd:20,atk:'TOWEL SNAPS + KNOCKBACK',line:'ERIN: My garden. My rules.'},
 {name:'MARCUS',cost:120,rng:42,cd:1.1,dmg:8,cls:'cold',slowF:.7,slowT:1,col:'#7fd4f8',ab:'HYDRO JET',abS:'JET',abCd:22,atk:'WATER BOLTS THAT SLOW',line:'MARCUS: Garden duty. I hate it here.'},
 {name:'RANGER',cost:90,rng:44,cd:.9,dmg:5,cls:'phys',flare:46,col:'#ffd94d',ab:'LANTERN FLARE',abS:'FLARE',abCd:24,atk:'LONG SHOTS. SEES STEALTH',line:'RANGER: I see them before you do.'},
 {name:'SCOUT',cost:90,rng:38,cd:.45,dmg:3,cls:'phys',forage:46,col:'#c8f8a0',ab:"FORAGER'S FIND",abS:'FIND',abCd:30,atk:'PEBBLES PAY +1',line:'SCOUT: Ooh! Shiny petals everywhere!'},
 {name:'MAMA',cost:115,rng:40,cd:1.2,dmg:8,cls:'phys',col:'#ffffff',ab:'YUKON',abS:'YUKON',abCd:34,atk:'LOBS TOY CARS',line:"MAMA: Hands off my babies' garden!"}];
/* placeholder keepers: named, silhouetted, not yet on the watch */
const TWLOCK=[
 {name:'KING BIBI',lore:['Suit, tie, red line.','None cross.']},
 {name:'CORBIN',lore:['The cape. The hearts.','Unknown game.']},
 {name:'???',lore:['Somebody new.','Not yet.']},
 {name:'DEREK',lore:["Marcus's guy. He pulls up.",'On time. Every time.']}];
const TWMENU=[];
for(let i=0;i<6;i++)TWMENU.push({k:'s',i});
for(let i=0;i<6;i++)TWMENU.push({k:'h',i});
for(let i=0;i<4;i++)TWMENU.push({k:'x',i});
/* v3.3 guide missions (info bar, Louie's voice, <=43 chars) */
const TWGUIDE={1:'Go to the gold corners. Press A!',2:'Go to the gold corners. Press A!',3:'One more! Gold corners, then A!',
 4:'Ready! Press START for night!',6:'Petals! Stand on a sprout, press A!'};
let TWTitleSel=0,TWHOW=null;
const TWWARN={1:['',
 'WOOF! Slow drones! Plant by the bends!',
 'GRR! Fast DARTS! DEW slows them down!',
 'ARF! PATCHERS repair! EMBER stops it!',
 'ARF! PLATED ones! PEB cracks armor!',
 'WOOF... STEALTH! DEW mist shows it!',
 'HARDCASE! EMBER bounces off! PEB, NOW!',
 'A LOADER! CARRIERS drop BITS!',
 'Everything at once. Mix it all!',
 'TWO LOADERS! Spend big, hold the line!',
 'THE HARVESTER! EVERYTHING!'],
 2:['',
 'A new garden. The swarm found it.',
 'SHIELDERS! Pop the shield first!',
 'Steel and shields. Crack, then pop!',
 'DRILLERS! DEW mist digs them up!',
 'A LOADER leads tonight. Hold!',
 'Everything cracks and pops at once.',
 'TWO LOADERS! Bottie is mad!',
 'THE SCRAPER! FEED IT PEBBLES!'],
 3:['',
 'Two gates. They come from both!',
 'Stealth on both roads. DEW up!',
 'Diggers under both paths!',
 'Steel, shields, carriers. Mix!',
 'Two loaders, two gates. GRR!',
 'The whole swarm, both roads!',
 'Three loaders! Spend it all!',
 'BOTTIE PRIME! FOR THE GARDEN!']};
function twWarnFor(){if(!TWR)return TWWARN[1][1];
 if(TWR.mode==='e')return TWWARN[3][((TWR.night-1)%8)+1];
 return TWWARN[TWR.map][Math.min(TWR.night,TWMAPS[TWR.map-1].nights)]}
/* TW-local art: Mama (new face, drawn for the watch) + placeholder silhouettes */
const TWMAMA=mk(['....kkkk....','...kbbbbk...','..kbBBBBbk..','..kbbbbbbk..','.kkffffffkk.','.kfkffffkfk.','.kfffffffk..','..krrrrrk...','.krrRRrrrk..','.krrrrrrrk..','.krrRRRrrk..','..krrrrrk...','...kk..kk...','..bbb..bbb..'],{k:'#282038',b:'#6a3a20',B:'#a87848',f:'#f8dcb0',r:'#c03040',R:'#e05868'});
const TWBIBI=mk(['....ssss....','...ssssss...','...ssssss...','...ssssss...','....ssss....','...swttws...','..sswttwss..','..sssttsss..','..ssssssss..','..ssssssss..','...ssssss...','...ss..ss...','...ss..ss...','..sss..sss..'],{s:'#181424',w:'#e8e4da',t:'#c02838'});
const TWCORBIN=mk(['....ssss....','...ssssss...','.ssssssssss.','.ssssssssss.','..ssshhsss..','..ssshhsss..','..ssssssss..','.ssssssssss.','.ssssssssss.','.ssssssssss.','..ssssssss..','...sss..sss..','...sss..sss..','..ss....ss..'],{s:'#1c1428',h:'#f85888'});
const TWBOTTIE=mk(['...ssssss...','..ssssssss..','.ssssssssss.','.ssbbssbbss.','.ssssssssss.','.sssbbbbsss.','..ssssssss..','...ssssss...','..ssssssss..','.ssssssssss.','.ssssssssss.','..ssssssss..','...ss..ss...','...ss..ss...'],{s:'#202028',b:'#57b8ff'});
/* THORNWATCH v3.2 sprite art — PORTED, not invented.
   Creeps: Rootdeep's real RDSPR sprite rows (~/workspace/mothlight/
   rd-module.js, built with Sprouts' mk()), copied verbatim and
   recolored to bramble/bark/moss; pixel edits are marked per sprite.
   Towers: Sprouts' drawBud construction at tower scale — TYPES c/d/l
   layering (dark shell, core, light cap), #181020 eyes, #2c6030 stem,
   stemTop stage growth (bud -> flower), Sprouts soil mound below.
   Tiles: Sprouts' own TL painters, verbatim, via Sprouts' tile(). */

/* ---- tiles: Sprouts TL painters, verbatim (grassV is Sprouts' own) ---- */
const TWDEREK=mk(['....cccc....','..cccccccc..','.cccccccccc.','.ckkkkkkkkc.','...ffffff...','..fkkkkkkf..','...ffffff...','....ffff....','..tttttttt..','.kttttttttk.','.kttttttttk.','..tttttttt..','...pp..pp...','..ppp..ppp..'],{c:'#28406a',k:'#14101e',f:'#c89878',t:'#2a7a8c',p:'#20242e'});
const TWTL={
 grass:grassV.map((v,n)=>tile(p=>{p('#58b858',0,0,16,16);v.forEach(([a,b])=>{p('#3c9848',a,b,2,1);p('#3c9848',a,b-1,1,1)});v.forEach(([a,b])=>p('#84d870',(a+7)%15,(b+6)%15,1,1));
  if(n===2){p('#ffffff',7,8,3,1);p('#ffffff',8,7,1,3);p('#f8d040',8,8,1,1)}})),
 dirt:tile(p=>{p('#d8b878',0,0,16,16);[[2,2],[10,4],[6,9],[13,12],[3,13]].forEach(([a,b])=>p('#b89858',a,b,2,1));[[7,2],[12,8],[2,7]].forEach(([a,b])=>p('#f0d8a0',a,b,1,1))}),
 soil:tile(p=>{p('#8a5a3a',0,0,16,16);[3,8,13].forEach((y,i)=>{p('#6e4428',i*2,y,9,1);p('#6e4428',i*2+11,y,4,1)});[[5,1],[12,6],[3,11]].forEach(([a,b])=>p('#a87850',a,b,1,1))}),
 tree:tile(p=>{p('#1c5038',0,0,16,16);p('#2c7848',1,1,14,13);p('#2c7848',0,3,16,9);p('#3c9858',2,2,10,8);p('#60c070',3,3,4,2);p('#60c070',8,5,3,1);p('#143828',1,13,14,3);p('#143828',5,10,1,1);p('#143828',11,9,1,1)}),
 fence:tile(p=>{p('#583018',0,5,16,3);p('#583018',0,11,16,3);p('#b07840',0,5,16,2);p('#b07840',0,11,16,2);[2,10].forEach(x=>{p('#583018',x,1,4,15);p('#c89050',x+1,2,2,13);p('#e8b878',x+1,2,1,3)})}),
 bramble:tile(p=>{p('#281810',1,2,14,13);p('#583020',2,3,12,11);p('#885030',2,5,12,1);p('#885030',3,9,10,1);p('#885030',4,12,9,1);[[3,3],[8,4],[12,7],[5,8],[10,11],[2,12]].forEach(([a,b])=>p('#f08030',a,b,1,2));p('#f8d858',8,3,1,1);p('#f8d858',5,7,1,1)})};

/* ---- creeps: Rootdeep RDSPR rows, bramble recolors ----
   k is unused here; each def carries its source's own char set. */
const TWCREEPDEF={
/* std = Rootdeep GRUB, rows verbatim; palette purple -> bark */
std:{pal:{s:'#3a2a1a',g:'#8a6a3e',G:'#66482a',e:'#1e150c'},rows:[
"..ssssssss..",
".sggggggggs.",
"sggggggggggs",
"sggggggggegs",
"sggggggggggs",
".sGGGGGGGGs.",
"..ssssssss..",
"...s....s..."]},
/* moss = Rootdeep GRUB, moss palette; EDIT: moss glint pixels (m)
   speckled on the shell's top rows */
moss:{pal:{s:'#22331a',g:'#5d8a3c',G:'#42622c',e:'#1e150c',m:'#84d870'},rows:[
"..smsssmss..",
".sgmggggmgs.",
"sggggggggggs",
"sggggggggegs",
"sggggggggggs",
".sGGGGGGGGs.",
"..ssssssss..",
"...s....s..."]},
/* mite = Rootdeep GRUB rows (a grublet), paler young-bark palette */
mite:{pal:{s:'#4a3826',g:'#a8845a',G:'#7a5c38',e:'#1e150c'},rows:[
"..ssssssss..",
".sggggggggs.",
"sggggggggggs",
"sggggggggegs",
"sggggggggggs",
".sGGGGGGGGs.",
"..ssssssss..",
"...s....s..."]},
/* split = Rootdeep GRUB, EXTENDED: a bulb sac grown on top and a
   dark seam (s) down the body's centre where it will split */
split:{pal:{s:'#3a2a1a',g:'#7a5a34',G:'#5d4023',e:'#1e150c',b:'#6aa844',B:'#4a7a2a'},rows:[
"....bbbb....",
"...bBbbBb...",
"...bBssBb...",
"....bbbb....",
".sggggssggg.",
"sgggggssgggs",
"sgggggeegggg",
"sgggggssgggs",
".sGGGGssGGs.",
"..ssssssss..",
"...s....s..."]},
/* dart = Rootdeep SHADE, rows verbatim; palette -> moss night-wisp,
   glowing eyes kept verbatim (#f8e060) */
dart:{pal:{w:'#6a9a52',d:'#33502e',y:'#f8e060'},rows:[
"ww........ww",
"www......www",
".wwww..wwww.",
"..wwwwwwww..",
"...dddddd...",
"...dy..yd...",
"...dddddd...",
"....dddd....",
"....d..d...."]},
/* bulk = Rootdeep BEETLE, rows AND palette verbatim (already bark) */
bulk:{pal:{h:'#e8e0d0',B:'#6e5226',b:'#a87f3f',e:'#181020',l:'#4a3517'},rows:[
".....hhhh.....",
"....hhhh......",
"..BBBBBBBB....",
".BbbBBBBBBBe..",
"BBbBBBBBBBBB..",
".BbbbBBBBBB...",
"..l..l..l....."]},
/* iron = Rootdeep CRAB, rows verbatim but one rivet row (C studs in
   row 3); palette blue -> ironbark steel */
iron:{pal:{c:'#9aa0ac',C:'#646c78'},rows:[
".cc........cc.",
"cccc......cccc",
".cCCc....cCCc.",
"..cCccccccCc..",
".cccccccccccc.",
".cccccccccccc.",
"..c..c..c..c.."]},
/* regrow = Rootdeep SPITTER, rows verbatim; EDIT: the flower centre
   (f) is a pink regrowth bud instead of pale cream */
regrow:{pal:{a:'#a8e063',f:'#f8a0c8',s:'#3a7028',g:'#58a038'},rows:[
".....aa.....",
"....aaaa....",
"....affa....",
".....ss.....",
"..g..ss..g..",
".ggg.ss.ggg.",
"..g.ssss....",
"....ssss....",
"...ss..ss...",
"..ss....ss.."]},
/* mauler = Rootdeep BEETLE, EXTENDED: shell widened +4 cols, twin
   horns, ember-red eye (e) edit for menace */
mauler:{pal:{h:'#e8e0d0',B:'#543e1e',b:'#8a6a34',e:'#ff5040',l:'#38280f'},rows:[
"..hh..........hh..",
"...hh........hh...",
"....BBBBBBBBBB....",
"..BbbBBBBBBBBBBe..",
".BBbbBBBBBBBBBB...",
"..BBBBBBBBBBBB....",
"...BBBBBBBBBB.....",
"..l...l...l...l..."]},
/* boss = Rootdeep MOTHER, palette verbatim (the purple boss family);
   EDITS: spike tips gold (h, Rootdeep KING's #f8d030), a thorn-tooth
   belly row added, legs lengthened one row */
boss:{pal:{s:'#4a2c5c',g:'#a87fd0',G:'#7a52a8',e:'#1c1428',h:'#f8d030'},rows:[
"..hh....hh....hh....hh..",
".sgggs.sgggs.sgggs.sgggs",
"sggggggggggggggggggggggs",
"sggggGGgggGGgggGGggggggs",
"sggggGGgggGGgggGGgggeegs",
"sggggGGgggGGgggGGgggeegs",
"sggggggggggggggggggggggs",
".sGGGGGGGGGGGGGGGGGGGGs.",
".sGgGGgGGgGGgGGgGGgGGs..",
".ssssssssssssssssssssss.",
"..s..s..s..s..s..s..s...",
"..s..s..s..s..s..s..s..."]},
/* bubble = Rootdeep CRAB, rows verbatim; bubble-pale palette */
bubble:{pal:{c:'#cfeefc',C:'#8fc4e4'},rows:[
".cc........cc.",
"cccc......cccc",
".cCCc....cCCc.",
"..cCccccccCc..",
".cccccccccccc.",
".cccccccccccc.",
"..c..c..c..c.."]},
/* digger = Rootdeep GRUB; EDIT: twin horn pixels (h) on the crown */
digger:{pal:{s:'#4a3418',g:'#a87f3f',G:'#7a5c2a',e:'#1e150c',h:'#e8e0d0'},rows:[
"...s.hh.s...",
".sggggggggs.",
"sggggggggggs",
"sggggggggegs",
"sggggggggggs",
".sGGGGGGGGs.",
"..ssssssss..",
"...s....s..."]},
/* maw = Rootdeep MOTHER, rows verbatim; deep-bramble palette,
   spike tips blood-red (h) */
maw:{pal:{s:'#22331a',g:'#5d8a3c',G:'#42622c',e:'#f8d030',h:'#e8384f'},rows:[
"..hh....hh....hh....hh..",
".sgggs.sgggs.sgggs.sgggs",
"sggggggggggggggggggggggs",
"sggggGGgggGGgggGGggggggs",
"sggggGGgggGGgggGGgggeegs",
"sggggGGgggGGgggGGgggeegs",
"sggggggggggggggggggggggs",
".sGGGGGGGGGGGGGGGGGGGGs.",
".sGgGGgGGgGGgGGgGGgGGs..",
".ssssssssssssssssssssss.",
"..s..s..s..s..s..s..s...",
"..s..s..s..s..s..s..s..."]},
/* prime = Rootdeep MOTHER, rows verbatim; Thornback's own purple
   deepened, gold spike tips kept (the king, older and worse) */
prime:{pal:{s:'#2c1a44',g:'#8a5fc0',G:'#5d3a8a',e:'#0e0a18',h:'#f8d030'},rows:[
"..hh....hh....hh....hh..",
".sgggs.sgggs.sgggs.sgggs",
"sggggggggggggggggggggggs",
"sggggGGgggGGgggGGggggggs",
"sggggGGgggGGgggGGgggeegs",
"sggggGGgggGGgggGGgggeegs",
"sggggggggggggggggggggggs",
".sGGGGGGGGGGGGGGGGGGGGs.",
".sGgGGgGGgGGgGGgGGgGGs..",
".ssssssssssssssssssssss.",
"..s..s..s..s..s..s..s...",
"..s..s..s..s..s..s..s..."]}};

/* ---- towers: Sprouts drawBud, grown to tower scale (16x20) ----
   TOP (5 rows, per variant) + HEAD (9 rows, per type) + STEMSOIL
   (6 rows, shared). Chars: d/c/l = Sprouts TYPES shell/core/light,
   k #181020 eyes (Sprouts'), s #2c6030 stem (Sprouts'), G #70d850
   young leaf (stemTop stage 0), y #f8e060 / Y #f8d040 (stemTop bud /
   flower centre), S/u/U Sprouts soil tile browns, p petal (= type c
   unless overridden), w white sparkle (drawBud LUCKY/ZIP). */
const TWSTEMSOIL=[
".......ss.......",
".......ss.......",
"......sSSs......",
"..SSSSSSSSSSSS..",
".SSuSSuSSuSSuSS.",
"..UUUUUUUUUUUU.."];
const TWHEAD=[
[/* EMBER: round bud head */
"....dddddddd....",
"..dddddddddddd..",
"..dccccccccccd..",
"..dcllcccccccd..",
"..dccccccccccd..",
"..dcckcccckccd..",
"..dcckcccckccd..",
"..ddccccccccdd..",
"....dddddddd...."],
[/* PEB: square head (drawBud type 1) */
"..dddddddddddd..",
"..dccccccccccd..",
"..dcllcccccccd..",
"..dccccccccccd..",
"..dcckcccckccd..",
"..dcckcccckccd..",
"..dccccccccccd..",
"..dccccccccccd..",
"..dddddddddddd.."],
[/* DEW: teardrop head (drawBud type 2) */
".....dddddd.....",
"....ddccccdd....",
"....dcllcccd....",
"...ddccccccdd...",
"..ddccccccccdd..",
"..dcckcccckccd..",
"..dcckcccckccd..",
"..ddccccccccdd..",
"....dddddddd...."],
[/* ZIP: round head + dark band + side sparks (drawBud type 3) */
"....dddddddd....",
"..dddddddddddd..",
"..dccccccccccd..",
"..dcllcccccccd..",
"w.dccccccccccd.w",
"..dcckcccckccd..",
"..dcckcccckccd..",
"..dddddddddddd..",
"....dddddddd...."],
[/* LEAF: round head; side leaves live in the stem rows */
"....dddddddd....",
"..dddddddddddd..",
"..dccccccccccd..",
"..dcllcccccccd..",
"..dccccccccccd..",
"..dcckcccckccd..",
"..dcckcccckccd..",
"..ddccccccccdd..",
"....dddddddd...."],
[/* LUCKY: round head + white sparkles (drawBud type 5) */
"....dddddddd....",
"..dddddddddddd..",
"..dccccccccccd..",
"..dcllcccwcccd..",
"..dccccccccccd..",
"..dcckcccckccd..",
"..dcckcccwkccd..",
"..ddccccccccdd..",
"....dddddddd...."]];
const TWHEAD_EYE=[/* LUCKY DEADEYE: one big eye replaces the pair */
"....dddddddd....",
"..dddddddddddd..",
"..dccccccccccd..",
"..dcccwwwwcccd..",
"..dccwwkkwwccd..",
"..dccwwkkwwccd..",
"..dcccwwwwcccd..",
"..ddccccccccdd..",
"....dddddddd...."];
const TWTOP=[
[/* EMBER base: stage-1 bud in flame colours */
["................",
".......ff.......",
"......foof......",
"......oooo......",
".......ss......."],
/* EMBER WILDFIRE: triple flame tongues */
["f......ff......f",
"ff....foof....ff",
".fof.foooof.fof.",
"..foofooofoof...",
".......ss......."],
/* EMBER EMBERHEART: heart-shaped flame */
["................",
"....oo....oo....",
"...fooo..fooo...",
"...foooooooof...",
".......ss......."]],
[/* PEB base: a pebble cap on the stem */
["................",
"................",
"......dddd......",
".....dccccd.....",
".......ss......."],
/* PEB SIEGE: dome + barrel mouth */
["................",
"....dddddddd....",
"..ddccccccccc...",
"..dccckkkkcccd..",
".......ss......."],
/* PEB QUICKLOAD: twin pebbles */
["................",
"................",
"..dddd....dddd..",
"..dcccd..dcccd..",
".......ss......."]],
[/* DEW base: droplet tip */
[".......ll.......",
"......lccl......",
"......lcccl.....",
".....lcccccl....",
".......ss......."],
/* DEW DEEPCHILL: ice spikes */
[".......ll.......",
"..l....ll....l..",
"..ll...ll...ll..",
"..lll.lccl.lll..",
".......ss......."],
/* DEW MISTVEIL: mist-pale flower (stemTop stage 2) */
["....w......w....",
"..w.pppp....w...",
"...ppYYYYpp.....",
"....pppppp......",
".......ss......."]],
[/* ZIP base: a single bolt */
[".......yyyy.....",
"......yyyy......",
".....yyyy.......",
"....yyyy........",
".......ss......."],
/* ZIP TESLA: twin coil rings + core */
["................",
"....dddddddd....",
"....dyyyyyyd....",
"....dddddddd....",
".......ss......."],
/* ZIP OVERCLOCK: twin bolts */
["..yyy......yyy..",
"...yyy....yyy...",
"...yyy....yyy...",
"....yy....yy....",
".......ss......."]],
[/* LEAF base: stage-0 leaf pair (stemTop stage 0) */
["................",
".....GG..GG.....",
"......GGGG......",
".......ss.......",
".......ss......."],
/* LEAF GROVE: tree canopy + fruit (Sprouts tree-tile greens) */
["..vvvvvvvvvvvv..",
".vvGGvvGGvvGGvv.",
".vGrGvvyGvGrGvv.",
"..vvvvvvvvvvvv..",
".......ss......."],
/* LEAF SUNLEAF: gold sun disc + rays */
["....y......y....",
"..y..yyyy..y....",
"....yyyyyy......",
"..y..yyyy..y....",
".......ss......."]],
[/* LUCKY base: clover */
["................",
".....GG..GG.....",
"....GGGGGGGG....",
".....GGGGGG.....",
".......ss......."],
/* LUCKY JACKPOT: gold star */
[".......YY.......",
".......YY.......",
"..YYYYYYYYYYYY..",
"...YYYYYYYYYY...",
"....YYY..YYY...."],
/* LUCKY DEADEYE: plain stage-1 bud — the eye is the identity */
["................",
".......yy.......",
"......yyyy......",
"......yyyy......",
".......ss......."]]];
const TWPAL=[
{c:'#f07830',d:'#983818',l:'#f8c070',p:'#f07830',o:'#f07830',f:'#f8d030'},
{c:'#98a0b0',d:'#4c5466',l:'#dce2ea',p:'#98a0b0'},
{c:'#48a0f0',d:'#2050a8',l:'#b0e0f8',p:'#48a0f0'},
{c:'#f0d020',d:'#806008',l:'#fff8a0',p:'#f0d020'},
{c:'#58c048',d:'#286028',l:'#b0f090',p:'#58c048',v:'#2c7848',g:'#3c9858',r:'#e8384f'},
{c:'#f078c0',d:'#902868',l:'#ffc8e8',p:'#f078c0'}];
const TWPALBASE={k:'#181020',s:'#2c6030',G:'#70d850',y:'#f8e060',Y:'#f8d040',w:'#ffffff',S:'#8a5a3a',u:'#6e4428',U:'#5a3820'};
const TWPALO=[ /* per-type per-variant palette overrides (variant 0 unused) */
[null,null,null],
[null,null,null],
[null,{c:'#8fd8f8',l:'#e6f7ff',d:'#3f7fbf',p:'#a8dcf8'},{c:'#cfe8f8',l:'#ffffff',d:'#5a90c8',p:'#eaf7ff'}],
[null,null,null],
[null,null,{G:'#f8d030',v:'#806008',g:'#b8901f'}],
[null,null,null]];
const TWLEAFSTEM=[
".GG....ss....GG.",
"..G....ss....G..",
"......sSSs......",
"..SSSSSSSSSSSS..",
".SSuSSuSSuSSuSS.",
"..UUUUUUUUUUUU.."];

const TWTOW=TWTOP.map((tp,ti)=>tp.map((top,vi)=>mk([...top,...((ti===5&&vi===2)?TWHEAD_EYE:TWHEAD[ti]),...(ti===4?TWLEAFSTEM:TWSTEMSOIL)],Object.assign({},TWPALBASE,TWPAL[ti],(TWPALO[ti]&&TWPALO[ti][vi])||{}))));
Object.assign(TWCREEPDEF,TWCREEPV4);for(const _k in TWCREEPPAL4)TWCREEPDEF[_k]=Object.assign({},TWCREEPDEF[_k],{pal:TWCREEPPAL4[_k]}); /* v4 creep art: tw-creeps.js */
const TWCREEP={},TWCREEPF={},TWCREEPB={},TWCREEPR={};
for(const _k in TWCREEPDEF){const _d=TWCREEPDEF[_k];TWCREEP[_k]=mk(_d.rows,_d.pal);
 const _fp={},_bp={},_rp={};for(const _c in _d.pal){_fp[_c]='#f4f1ff';_bp[_c]='#a8dcf8';_rp[_c]='#ff6a5e'}
 TWCREEPF[_k]=mk(_d.rows,_fp);TWCREEPB[_k]=mk(_d.rows,_bp);TWCREEPR[_k]=mk(_d.rows,_rp)}
/* small icons: v3.1 defs kept; the Heart's greens now Sprouts' stem
   green (#2c6030) so it sits in the same palette as everything else */
const TWHEARTDEF={pal:{h:'#f85888',H:'#e8384f',w:'#ffd7e8',p:'#f8a0c8',P:'#e878c8',G:'#58c048',g:'#2c6030'},rows:[
"....................",
"....pp........pp....",
"...pPPp......pPPp...",
"....pp.hhhhhh.pp....",
".....hhhhhhhhhh.....",
"....hhhhhhhhhhhh....",
"....hwwhhhhhhhhh....",
".pp.hhhhhhhhhhhh.pp.",
"....hhhhhhhhhhhh....",
"....hhhhhhHHhhhh....",
".....hhhhhhhhhh.....",
".....hhhhhhhhhh.....",
"......hhhhhhhh......",
"......hhhhhhhh......",
".......hhhhhh.......",
".......hhhhhh.......",
"........hhhh........",
"........hhhh........",
".........hh.........",
"....GG..gggg..GG....",
".....GG.gggg.GG.....",
"........gggg........"]};
const TWFLAMEDEF={pal:{l:'#f8c070',c:'#f07830'},rows:[
"...l...",
"..lcl..",
"..lcl..",
".lcccl.",
".lcccl.",
"..ccc..",
"..ccc..",
"...c..."]};
const TWSTARDEF={pal:{y:'#f8d030'},rows:[
"..y..",
".yyy.",
"yyyyy",
".yyy.",
"..y.."]};
const TWPETALDEF={pal:{p:'#f8a0c8',P:'#e878c8',w:'#ffe0f0'},rows:[
"...pp...",
"..pPPp..",
"..pPwp..",
".pPppPp.",
".pppppp.",
"..pppp..",
"...pp...",
"........"]};
const TWHEART=mk(TWHEARTDEF.rows,TWHEARTDEF.pal),TWFLAME=mk(TWFLAMEDEF.rows,TWFLAMEDEF.pal),
 TWSTAR=mk(TWSTARDEF.rows,TWSTARDEF.pal),TWPETAL=mk(TWPETALDEF.rows,TWPETALDEF.pal);
const TWTREE=TWTL.tree;
const TWTREEF=(()=>{try{const c=document.createElement('canvas');c.width=16;c.height=16;const x=c.getContext('2d');x.translate(16,0);x.scale(-1,1);x.drawImage(TWTREE,0,0);return c}catch(e){return TWTREE}})();
const TWCSZ={std:[16,11],dart:[16,12],bulk:[18,10],moss:[16,11],iron:[18,10],regrow:[14,12],split:[16,13],mite:[10,7],mauler:[24,12],boss:[28,16],bubble:[18,10],digger:[16,11],maw:[36,20],prime:[42,24]};
const TWROLE=['BURNS OVER TIME','HEAVY, SHREDS ARMOR','SLOWS + SHOWS STEALTH','ZAPS 3 AT ONCE','+PETALS EACH DAWN','HUGE CRIT HITS'];

function twHeroSpr(i){if(i===0)return (typeof SP!=='undefined'&&SP&&SP.pd)||(typeof SWSPR!=='undefined'&&SWSPR.WILL&&SWSPR.WILL.ol);
 if(i===1)return CH.ERIN;if(i===2)return CH.MARCUS;if(i===3)return CH.RANGER;if(i===4)return CH.SCOUT;return TWMAMA}
function twLockSpr(i){return i===0?TWBIBI:i===1?TWCORBIN:i===2?TWBOTTIE:TWDEREK}
/* ---- the one winding track (Bloons skeleton, Thornwatch skin) ----
   Waypoints are (x, board-height fraction): in at the bramble edge,
   two S-bends, out at the Garden Heart. Axis-aligned on purpose:
   the path reads at a glance and corners stack tower coverage. */
let TWR=null;
function twBoardTop(){return 30}
function twBoardBot(){return H-42}
let TWMAP=1;
const TWMAPS=[
 {name:"ERIN'S GARDEN",sub:'THE FIRST WATCH',nights:10,grade:0,paths:[[[-14,.16],[172,.16],[172,.47],[54,.47],[54,.78],[208,.78]]]},
 {name:'THE LONG BEDS',sub:'A LONGER DARK',nights:8,grade:1,paths:[[[-14,.12],[196,.12],[196,.38],[44,.38],[44,.64],[196,.64],[196,.88],[208,.88]]]},
 {name:'THE CROSSROADS',sub:'TWO GATES, ONE HEART',nights:8,grade:2,paths:[[[-14,.18],[110,.18],[110,.5],[208,.5]],[[-14,.82],[110,.82],[110,.5],[208,.5]]]}];
const _twPC={};
function twPathPts(map,pi){map=map||TWMAP;pi=pi||0;const key=map+'_'+pi+'_'+H;
 if(_twPC[key])return _twPC[key];
 const t=twBoardTop(),b=twBoardBot(),raw=TWMAPS[map-1].paths[pi];
 const pts=raw.map(p=>({x:p[0],y:Math.round(t+p[1]*(b-t))}));
 const cum=[0];let len=0;
 for(let i=1;i<pts.length;i++){len+=Math.abs(pts[i].x-pts[i-1].x)+Math.abs(pts[i].y-pts[i-1].y);cum.push(len)}
 const P={pts,cum,len};_twPC[key]=P;return P}
function twPathLen(pi){return twPathPts(TWMAP,pi||0).len}
function twPathPos(d,off,pi){const P=twPathPts(TWMAP,pi||0);d=Math.max(0,Math.min(P.len,d));
 let i=1;while(i<P.cum.length-1&&P.cum[i]<d)i++;
 const a=P.pts[i-1],b=P.pts[i],seg=(P.cum[i]-P.cum[i-1])||1,f=(d-P.cum[i-1])/seg;
 const dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y),o=off||0;
 return{x:a.x+(b.x-a.x)*f-dy*o,y:a.y+(b.y-a.y)*f+dx*o}}
function twDistM(map,x,y){let m=1e9;const paths=TWMAPS[map-1].paths;
 for(let pi=0;pi<paths.length;pi++){const P=twPathPts(map,pi);
  for(let i=1;i<P.pts.length;i++){const a=P.pts[i-1],b=P.pts[i];
   const vx=b.x-a.x,vy=b.y-a.y,L2=vx*vx+vy*vy||1;
   let f=((x-a.x)*vx+(y-a.y)*vy)/L2;f=Math.max(0,Math.min(1,f));
   const dx=x-(a.x+vx*f),dy=y-(a.y+vy*f),d2=dx*dx+dy*dy;if(d2<m)m=d2}}
 return Math.sqrt(m)}
function twDistToPath(x,y){return twDistM(TWMAP,x,y)}
function twNearPath(x,y){let bi=0,bd=1e18;const paths=TWMAPS[TWMAP-1].paths;
 for(let pi=0;pi<paths.length;pi++){const P=twPathPts(TWMAP,pi);
  for(let i=1;i<P.pts.length;i++){const a=P.pts[i-1],b=P.pts[i],vx=b.x-a.x,vy=b.y-a.y,L2=vx*vx+vy*vy||1;
   let f=((x-a.x)*vx+(y-a.y)*vy)/L2;f=Math.max(0,Math.min(1,f));
   const dx=x-(a.x+vx*f),dy=y-(a.y+vy*f),d2=dx*dx+dy*dy;if(d2<bd){bd=d2;bi=pi}}}
 return bi}
function twHeartPos(){const P=twPathPts(TWMAP,0);return{x:224,y:P.pts[P.pts.length-1].y}}
function twHeartM(map){const P=twPathPts(map,0);return{x:224,y:P.pts[P.pts.length-1].y}}
function twLouiePos(){const hp=twHeartPos();return{x:hp.x-12,y:hp.y+17}}
/* v4: the garden board painter (twBoardCv) lives in tw-look.js */
function twSyncCreep(cr){const p=twPathPos(cr.d,cr.off,cr.pi||0);cr.x=p.x;cr.y=p.y}
function twSpotOK(x,y){const t=twBoardTop(),b=twBoardBot();
 if(x<10||x>232||y<t+6||y>b-2)return false;
 if(twDistToPath(x,y)<11)return false;
 const hp=twHeartPos(),hx=x-hp.x,hy=y-hp.y;if(hx*hx+hy*hy<20*20)return false;
 const lp=twLouiePos(),lx=x-lp.x,ly=y-lp.y;if(lx*lx+ly*ly<12*12)return false;
 for(const t of TWR.towers){const dx=t.x-x,dy=t.y-y;if(dx*dx+dy*dy<14*14)return false}
 return true}
function twTowerAt(x,y){let best=null,bd=12*12;
 for(const t of TWR.towers){const dx=t.x-x,dy=t.y-y,d2=dx*dx+dy*dy;if(d2<bd){bd=d2;best=t}}
 return best}
function twStartTitle(){twSyncSet();state='g5title'}
function twNewRun(map,mode,night){map=map||1;mode=mode||'s';night=night||1;
 if(twStoryGate('g'+map,map>1&&night===1&&mode!=='e',()=>twNewRun(map,mode,night)))return; /* v4: each garden opens with its scene, once */
 TW.plays++;twSave();TWMAP=map;
 const maxHeart=20+(twHasPerk('heart')?2:0);
 const startP=(mode==='h'?40:60)+(twHasPerk('purse')?20:0)+((night>1&&mode!=='e')?(night-1)*30+(night-1)*(night-1)*24:0); /* v3.6: a run starting at night N holds the purse a fought-through garden would (expert wealth-at-dawn curve, PLAYTEST-v3.6) */
 TWR={night,petals:startP,heart:maxHeart,maxHeart,map,mode,sel:0,cur:{x:128,y:104},towers:[],creeps:[],shots:[],
  queue:[],spawnT:0,round:false,paused:false,speed:1,say:'',sayT:0,kills:0,earned:0,leaks:0,nl:0,
  bossDown:false,first:true,over:false,fork:null,forkSel:0,parts:[],floats:[],beams:[],fx:[],
  flareT:0,boofUsed:false,boofN:0,bossCine:false,openCine:false,cine:null,shake:0,pending:[],drip:0,dripFxT:0,curTick:0,
  focus:'field',menu:null,repD:null,repT:0,repN:0,snap:null,pow:null,train:null,card:null,survived:0,endGain:0,mapClear:false,powTip:false,rainT:0,flies:[],leakK:{},petPulse:0,coinT:0,dngT:0,heroTip:false,forkT:0,trainT:0,
  guide:(TW.guideDone||map!==1||mode!=='s'||night!==1)?0:1,plants:0,grew:false,g5t:0,g5shown:false};
 if(night===1&&mode!=='e')TWR.card={t:3.2,title:'CHAPTER '+map,sub:TWMAPS[map-1].name};
 if(mode==='e')TWR.card={t:3.2,title:'THE LONG NIGHT',sub:'HOW LONG CAN YOU HOLD?'};
 twIntermission(true);state='g5play'}
function twIntermission(first){ /* between rounds: build at your own pace */
 if(TWR.first){TWR.say='Down the dirt path! Plant by the bends!';TWR.first=false}
 else TWR.say=twWarnFor();
 TWR.sayT=99; /* Louie's briefing stays up while you build */
 if(!TWR.heroTip&&TWR.petals>=90&&!TWR.towers.some(t=>t.hero>=0)){TWR.heroTip=true;TWR.say='WOOF! A KEEPER COSTS 90P!';TWR.sayT=99}
 if(TWR.mode!=='e'&&TWR.map===1&&TW.best<TWR.night){TW.best=TWR.night;twSave()}}
function twDef(t){const b=TWT[t.type];
 const d={rng:b.rng,cd:b.cd,dmg:b.dmg,shred:b.shred||0,slowF:b.slowF||0,slowT:b.slowT||0,
  chain:b.chain||0,crit:b.crit||0,critMult:4,dawn:b.dawn||0,mend:0,farmPer:0,farmAmt:0,
  burnDps:t.type===0?3:0,burnT:3,cls:TWCLS[t.type]};
 if(t.lv>1&&t.variant){const v=TWFORK[t.type][t.variant-1];
  if(v.dmg)d.dmg*=v.dmg;if(v.cd)d.cd*=v.cd;if(v.rng)d.rng+=v.rng;if(v.rngM)d.rng*=v.rngM;
  if(v.shred)d.shred=v.shred;if(v.slowF)d.slowF=v.slowF;if(v.slowT)d.slowT=v.slowT;
  if(v.chain)d.chain=v.chain;if(v.crit!==undefined)d.crit=v.crit;if(v.critMult)d.critMult=v.critMult;
  if(v.dawn!==undefined)d.dawn=v.dawn;if(v.mend)d.mend=v.mend;
  if(v.farmPer)d.farmPer=v.farmPer;if(v.farmAmt)d.farmAmt=v.farmAmt;
  if(v.burnDps)d.burnDps*=v.burnDps;if(v.burnT)d.burnT=v.burnT}
 else if(t.lv>1){d.dmg*=1.8;d.cd*=.85;d.rng+=4;if(t.type===0)d.burnDps=6;if(t.type===4)d.dawn=11}
 if(t.lv>=3){d.dmg*=2.6;d.cd*=.7;d.rng+=8;
  if(t.type===0)d.burnDps*=2.5;if(t.type===2)d.slowF=Math.min(.25,d.slowF*.7);
  if(t.type===3)d.chain+=3;if(t.type===4){d.dawn=Math.round(d.dawn*2.5);d.farmAmt=Math.round(d.farmAmt*2.5)}
  if(t.type===5)d.crit=Math.min(.6,d.crit+.15)}
 if(twHasPerk('eye'))d.rng*=1.05;
 return d}
function twUpCost(t){return Math.ceil(TWT[t.type].cost*.7)}
function twInvested(t){if(t.hero>=0)return twHeroCost(t.hero)+((t.hl||1)>=2?120:0)+((t.hl||1)>=3?220:0);
 let v=TWT[t.type].cost;if(t.lv>1)v+=t.variant?twForkCost(t.type,t.variant):twUpCost(t);
 if(t.lv>=3)v+=TWGRANDC[t.type];return v}
function twRefund(t){return Math.floor(twInvested(t)*.7)}
function twPlantMsg(s){TWR.say=s;TWR.sayT=2.6}
function twPlanted(){TWR.plants++;
 if(TWR.guide>0&&TWR.guide<4)TWR.guide=TWR.plants>=2?4:3}
function twGuideDone(){TW.guideDone=true;twSave();
 if(TWR&&TWR.guide>0){TWR.guide=0;TWR.say="You've got it. Hold the garden!";TWR.sayT=2.6;snd(784,.09,1175)}}
function twFloat(x,y,txt,col){TWR.floats.push({x,y,txt,col,t:0,life:1.1});if(TWR.floats.length>14)TWR.floats.shift()}
function twBurst(x,y,col,n){for(let i=0;i<n;i++){if(TWR.parts.length>130)return;
 TWR.parts.push({x,y,vx:(Math.random()-.5)*34,vy:-8-Math.random()*24,t:0,life:.45+Math.random()*.35,col,s:Math.random()<.4?2:1})}}
function twDrip(d,x,y){ /* money from pops: every 20 damage dealt pays 1 petal */
 if(d<=0)return;TWR.drip+=d*(twHasPerk('soil')?1.5:1);
 if(TWR.drip>=20){const pay=Math.floor(TWR.drip/20);TWR.drip-=pay*20;TWR.petals+=pay;TWR.earned+=pay;
  if(TWR.dripFxT<=0&&x!==undefined){twFloat(x,y-16,'+1','#f8c8e0');TWR.dripFxT=.8}}}
/* ---- building: one cursor, one shop strip, anytime ---- */
function twSelRange(){const e=TWMENU[TWR.sel];
 if(e.k==='s')return TWT[e.i].rng; if(e.k==='h')return TWHERO[e.i].rng*(twHasPerk('eye')?1.05:1);return 0}
/* v4: twActA / twActB / the build panel live in tw-controls.js */
/* ---- creeps: one roster, tuned for the long path ---- */
const TWCOMP={
 1:{1:{std:6},2:{std:9,dart:3},3:{std:10,dart:4,regrow:2},4:{std:12,bulk:4,dart:4},
  5:{std:11,moss:6,dart:5,regrow:4},6:{std:9,iron:5,dart:6,bulk:4,split:3},
  7:{std:10,split:5,regrow:4,bulk:4,moss:4,mauler:1},8:{std:10,moss:6,iron:5,regrow:5,dart:6,bulk:4},
  9:{std:10,iron:5,moss:5,split:5,dart:5,mauler:2},10:{std:8,dart:5,bulk:4,moss:3,iron:3}},
 2:{1:{std:8,dart:2},2:{std:9,bubble:3,dart:3},
  3:{std:10,bubble:4,iron:3,regrow:3},4:{std:11,digger:4,dart:5,bubble:3,bulk:3},
  5:{mauler:1,std:10,moss:5,digger:4,bubble:4,regrow:4},6:{iron:5,bulk:5,bubble:5,split:5,std:10,digger:4},
  7:{mauler:2,digger:5,dart:6,bubble:5,moss:5,std:8},8:{std:10,dart:6,bulk:5,moss:5,iron:5,bubble:5,digger:4}},
 3:{1:{std:7,dart:3},2:{std:9,moss:4,bubble:3,dart:3},
  3:{digger:4,std:10,regrow:4,bubble:3,bulk:3},4:{iron:5,bubble:5,split:4,dart:5,std:9},
  5:{mauler:2,std:10,moss:5,digger:4,bubble:4},6:{std:12,iron:5,split:5,bubble:5,digger:5,regrow:5},
  7:{mauler:3,std:10,dart:6,bubble:5,moss:5},8:{std:10,iron:5,bubble:5,digger:4,split:4}}};
const TWBOSSAT={1:{10:'boss'},2:{8:'maw'},3:{8:'prime'}};
function twCreepBase(){return{
 std:{hp:17,sp:17,bounty:4,dmg:1,armor:0},dart:{hp:9,sp:30.5,bounty:3,dmg:1,armor:0},
 bulk:{hp:32,sp:13,bounty:8,dmg:2,armor:5},moss:{hp:15,sp:18,bounty:5,dmg:1,armor:0,camo:1},
 iron:{hp:26,sp:13.5,bounty:7,dmg:2,armor:2},regrow:{hp:20,sp:17.5,bounty:6,dmg:1,armor:0},
 split:{hp:22,sp:17,bounty:5,dmg:1,armor:0},bubble:{hp:16,sp:15,bounty:7,dmg:2,armor:0,shield:26},
 digger:{hp:24,sp:19,bounty:6,dmg:2,armor:0},
 mauler:{hp:265,sp:9.5,bounty:60,dmg:4,armor:2,flat:1},
 boss:{hp:780,sp:8.5,bounty:150,dmg:5,armor:4,flat:1},maw:{hp:950,sp:8,bounty:250,dmg:5,armor:3,flat:1},
 prime:{hp:1600,sp:8,bounty:400,dmg:5,armor:5,flat:1}}}
function twBuildQueue(){const map=TWR.map,mode=TWR.mode,n=TWR.night,B=twCreepBase();
 const gN=n; /* per-map scaling: every garden starts fresh */
 let hpM=1+(gN-1)*.31,spM=Math.min(1.4,1+(gN-1)*.02);
 if(mode==='h'){hpM*=1.28;spM=Math.min(1.5,spM+.03)}
 if(mode==='e'){hpM=(1+(n-1)*.31)*Math.pow(1.13,Math.max(0,n-15));spM=Math.min(1.6,1+(n-1)*.03)}
 const mk=kind=>{const b=B[kind];let m=b.flat?1:hpM;
  if(b.flat&&mode==='h')m=1.2;if(b.flat&&mode==='e')m=Math.pow(1.13,Math.max(0,n-15));
  const hp=Math.round(b.hp*m*(kind==='mauler'&&gN>=9?390/265:1));
  const sh=b.shield?Math.round(b.shield*hpM):0;
  return{kind,hp,maxhp:hp,sp:b.sp*spM,bounty:b.bounty,dmg:b.dmg,armor:b.armor,camo:!!b.camo,
   shield:sh,maxshield:sh,d:0,off:Math.random()*6-3,x:-14,y:0,pi:0,burnT:0,burnDps:0,slowT:0,slowF:1,stunT:0,hitT:0,
   surfaced:kind!=='digger',under:false,shedT:0}};
 const counts={};
 if(mode==='e'){const pool=[['std',5],['dart',3],['regrow',2],['bulk',2],['moss',2],['iron',2],['split',2],['bubble',2],['digger',2]];
  const unlock={dart:2,regrow:3,bulk:4,moss:5,iron:6,split:7,bubble:8,digger:9};
  const avail=pool.filter(pp=>!unlock[pp[0]]||n>=unlock[pp[0]]);
  const total=Math.min(58,14+2*n),wsum=avail.reduce((a,pp)=>a+pp[1],0);
  for(const [k,w] of avail)counts[k]=Math.max(k==='std'?4:0,Math.round(total*w/wsum));
  if(n%5===0)counts.mauler=1+Math.floor(n/10)}
 else{const base=TWCOMP[map][Math.min(n,TWMAPS[map-1].nights)];
  for(const k in base)counts[k]=base[k];
  if(mode==='a'){if(map===1){if(n>=2)counts.moss=(counts.moss||0)+2;if(n>=3)counts.split=(counts.split||0)+2;
    if(n>=5)counts.iron=(counts.iron||0)+2;if(n>=7)counts.regrow=(counts.regrow||0)+2;counts.std+=2}
   else{if(n>=1)counts.digger=(counts.digger||0)+2;if(n>=2)counts.bubble=(counts.bubble||0)+2;
    if(n>=4)counts.mauler=(counts.mauler||0)+1;counts.std+=2}}}
 const q=[];for(const k in counts)for(let i=0;i<counts[k];i++)q.push(mk(k));
 const bk=mode==='e'?(n%10===0?'maw':null):(TWBOSSAT[map]||{})[n];
 if(bk){const bc=mk(bk);if(mode==='e')bc.hp=bc.maxhp=Math.round(950*Math.pow(1.35,n/10-1));q.push(bc)}
 for(let i=q.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=q[i];q[i]=q[j];q[j]=t}
 const big=q.filter(c=>twIsBoss(c.kind)||c.kind==='mauler');
 for(const b of big){q.splice(q.indexOf(b),1);q.splice(Math.min(q.length,6+((Math.random()*6)|0)),0,b)}
 if(TWMAPS[map-1].paths.length>1)q.forEach((cr,i)=>{cr.pi=i%2});
 return q}
function twSpawnGap(){return Math.max(.32,.88-.05*(TWR.night-1))*(0.9+Math.random()*.2)}
function twStartRound(){if(TWR.round||TWR.cine||TWR.fork||TWR.build)return;
 if(twStoryGate('b'+TWR.map,TWR.mode!=='e'&&TWR.night===TWMAPS[TWR.map-1].nights,()=>{state='g5play';twStartRound()}))return; /* v4: the boss night opens with its scene, once */
 TWR.snap={petals:TWR.petals,heart:TWR.heart,kills:TWR.kills,earned:TWR.earned,leaks:TWR.leaks,nl:TWR.nl,
  towers:TWR.towers.map(t=>({hero:t.hero,type:t.type,lv:t.lv,variant:t.variant,hl:t.hl||1,x:t.x,y:t.y,a:t.a,farmMade:t.farmMade||0}))};
 if(TWR.guide===4){TWR.guide=5;TWR.g5t=0;TWR.g5shown=false}
 TWR.queue=twBuildQueue();twMoteReset();TWR.spawnT=0;TWR.round=true;TWR.paused=false;TWR.boofUsed=false;TWR.boofN=0;TWR.nl=0;TWR.leakK={};
 TWR.say=twWarnFor();TWR.sayT=3.2;snd(392,.12,196);
 if(TWR.towers.length&&!TWR.towers.some(t=>t.hero>=0||twDef(t).dmg>=4)){TWR.say='WOOF! TOO WEAK! PLANT SHOOTERS!';TWR.sayT=3.2}
 if(TWR.night===1&&TWR.map===1&&TWR.mode==='s'&&!TWR.openCine){TWR.openCine=true;twStartCine({kind:'open',dur:1.0,fire:null})}}
function twRevealed(cr){if(!cr.camo)return true;if(TWR.flareT>0)return true;
 for(const t of TWR.towers){const dx=cr.x-t.x,dy=cr.y-t.y;
  if(t.hero===3){const fl=TWHERO[3].flare*(twHasPerk('eye')?1.05:1);if(dx*dx+dy*dy<=fl*fl)return true}
  else if(t.hero<0&&t.type===2){const d=twDef(t);if(dx*dx+dy*dy<=d.rng*d.rng)return true}}
 return false}
function twHit(cr,dmg,cls,fx){ /* returns true if the hit landed */
 if(cr.kind==='iron'&&(cls==='fire'||cls==='spark'||(cls==='sharp'&&!(fx&&fx.crit)))){
  twFloat(cr.x,cr.y-15,'CLANK','#c8ccd4');return false}
 if(cr.under)return false;
 if(cr.shield>0){cr.hitT=.12;
  if(dmg<=cr.shield){cr.shield-=dmg;return true}
  dmg-=cr.shield;cr.shield=0;twFloat(cr.x,cr.y-16,'POP!','#bfe8f8');twBurst(cr.x,cr.y-4,'#bfe8f8',5)}
 const armBefore=cr.armor||0;
 let d=cls==='ability'?dmg:dmg-armBefore;if(d<1)d=1;cr.hp-=d;cr.hitT=.12;if(fx&&fx.crit)cr.critT=1.2;
 if(fx){if(fx.shred){cr.armor=Math.max(0,cr.armor-fx.shred);
   if(armBefore>0&&cr.armor===0){TWR.petals+=2;TWR.earned+=2;twFloat(cr.x,cr.y-16,'+2','#ffe9a8')}}
  if(fx.slowF){cr.slowT=Math.max(cr.slowT,fx.slowT);cr.slowF=Math.min(cr.slowF,fx.slowF)}
  if(fx.burnDps){cr.burnT=fx.burnT||3;cr.burnDps=Math.max(cr.burnDps,fx.burnDps)}}
 twDrip(d,cr.x,cr.y);
 return true}
function twTarget(t,rng){let best=null; /* Bloons "first": furthest along the track */
 for(const cr of TWR.creeps){const dx=cr.x-t.x,dy=cr.y-t.y;
  if(dx*dx+dy*dy<=rng*rng&&!cr.under&&twRevealed(cr)&&(!best||cr.d>best.d))best=cr}
 return best}
function twFire(t,dt){const def=twDef(t);if(!def.dmg)return;t.cdT-=dt;if(t.cdT>0)return;
 const best=twTarget(t,def.rng);if(!best)return;t.cdT=def.cd;
 let dmg=def.dmg,crit=false;
 if(def.crit&&Math.random()<def.crit){dmg*=def.critMult;crit=true}
 const landed=twHit(best,dmg,def.cls,{shred:def.shred,slowF:def.slowF,slowT:def.slowT,burnDps:def.burnDps,burnT:def.burnT,crit});
 TWR.shots.push({x1:t.x,y1:t.y-12,x2:best.x,y2:best.y-4,t:.07,col:landed?TYPES[t.type].c:'#9a94a8',crit});
 if(def.chain&&landed){const near=TWR.creeps.filter(cr=>cr!==best&&twRevealed(cr)&&Math.abs(cr.x-best.x)<20&&Math.abs(cr.y-best.y)<20)
   .sort((a,b)=>(Math.abs(a.x-best.x)+Math.abs(a.y-best.y))-(Math.abs(b.x-best.x)+Math.abs(b.y-best.y))).slice(0,def.chain);
  for(const cr of near){twHit(cr,dmg*.6,'spark',null);
   TWR.shots.push({x1:best.x,y1:best.y-4,x2:cr.x,y2:cr.y-4,t:.07,col:'#fff8a0',crit:false})}}
 snd(t.type===3?1240:740,.03,0,'square',.02)}
function twFireHero(t,dt){const hd=TWHERO[t.hero];t.cdT-=dt;if(t.abT>0)t.abT-=dt;if(t.cdT>0)return;
 const best=twTarget(t,hd.rng*(twHasPerk('eye')?1.05:1));if(!best)return;t.cdT=hd.cd;
 const landed=twHit(best,Math.round(hd.dmg*(1+.35*((t.hl||1)-1))),hd.cls,{slowF:hd.slowF||0,slowT:hd.slowT||0});
 if(landed&&hd.kb){best.d=Math.max(0,best.d-hd.kb);twSyncCreep(best)}
 TWR.shots.push({x1:t.x,y1:t.y-14,x2:best.x,y2:best.y-4,t:.07,col:hd.col,crit:false});
 snd(880,.03,0,'square',.018)}
function twStartCine(c){TWR.cine=Object.assign({t:0,dur:.9},c);snd(196,.18,392,'triangle',.05)}
function twAbilityA(t){if(TWR.cine)return;const hd=TWHERO[t.hero];
 if(t.abT>0){TWR.say=hd.name+' needs '+Math.ceil(t.abT)+'s...';TWR.sayT=1.2;snd(160,.06);return}
 twStartCine({kind:'ability',hero:t,who:hd.name,name:hd.ab,line:hd.line,fire:()=>twResolveAbility(t)})}
function twInRad(t,rad){return TWR.creeps.filter(cr=>{if(cr.under)return false;const dx=cr.x-t.x,dy=cr.y-t.y;return dx*dx+dy*dy<=rad*rad})}
function twUsePow(ix){
 if(ix===0){for(const cr of TWR.creeps){if(cr.under)continue;twHit(cr,90,'ability',null);twBurst(cr.x,cr.y-4,'#ffd94d',3)}
  TWR.shake=Math.max(TWR.shake,3);TWR.say='SUNBURST! The sky helps us!';snd(1200,.3,300,'sawtooth',.05)}
 else if(ix===1){TWR.rainT=10;for(const cr of TWR.creeps){cr.slowT=Math.max(cr.slowT,10);cr.slowF=Math.min(cr.slowF,.35)}
  TWR.say='RAIN OF DEW! Everything crawls!';snd(700,.25,1400)}
 else{TWR.flareT=Math.max(TWR.flareT,14);for(const cr of TWR.creeps)cr.stunT=Math.max(cr.stunT||0,3);
  TWR.say='LOUIE HOWLS! AWOOOO!';TWR.shake=Math.max(TWR.shake,2);snd(300,.35,600,'sawtooth',.05)}
 TWR.sayT=1.8}
function twResolveAbility(t){const hd=TWHERO[t.hero];const hm=1+.35*((t.hl||1)-1);
 t.abT=hd.abCd*(twHasPerk('warm')?.85:1)*(1-.1*((t.hl||1)-1));
 if(t.hero===0){const hit=twInRad(t,58);
  for(const cr of hit){twHit(cr,Math.round(60*hm),'ability',null);
   TWR.beams.push({x1:t.x,y1:t.y-14,x2:cr.x,y2:cr.y-4,t:0,life:.35,col:'#fff2a8',w:3});
   TWR.beams.push({x1:t.x,y1:t.y-14,x2:cr.x,y2:cr.y-4,t:0,life:.35,col:'#ffffff',w:1})}
  TWR.shake=Math.max(TWR.shake,2);TWR.say='WILL: MAZEL TOV, drones!';snd(1400,.25,200,'sawtooth',.05)}
 else if(t.hero===1){twBurst(t.x,t.y-6,'#f8f0e0',14);
  for(const cr of twInRad(t,52)){twHit(cr,Math.round(26*hm),'ability',null);cr.d=Math.max(0,cr.d-16);twSyncCreep(cr);
   cr.slowT=Math.max(cr.slowT,1.2);cr.slowF=Math.min(cr.slowF,.6)}
  TWR.say='ERIN: Coming through, sweetie!';snd(500,.15,900)}
 else if(t.hero===2){for(let i=0;i<10;i++)TWR.parts.push({x:t.x-24+(Math.random()*48),y:t.y-16+(Math.random()*20),vx:0,vy:8,t:0,life:.4,col:'#7fd4f8',s:2});
  for(const cr of twInRad(t,52)){twHit(cr,Math.round(36*hm),'ability',null);cr.slowT=Math.max(cr.slowT,2.5);cr.slowF=Math.min(cr.slowF,.35)}
  TWR.say='MARCUS: Drink up. I hate you all.';snd(800,.2,200)}
 else if(t.hero===3){TWR.flareT=6;let n=0;
  for(const cr of TWR.creeps)if(cr.camo){twHit(cr,Math.round(8*hm),'ability',null);n++}
  twFloat(t.x,t.y-24,'FLARE!','#ffd94d');TWR.say='RANGER: There! I see them!';snd(1200,.12,1800)}
 else if(t.hero===4){TWR.petals+=22;TWR.earned+=22;twFloat(t.x,t.y-24,'+22 PETALS','#f8c8e0');
  TWR.say='SCOUT: Found petals! So many petals!';snd(990,.08,1320)}
 else if(t.hero===5){TWR.fx.push({kind:'yukon',d:-12,pi:twNearPath(t.x,t.y),hit:new Set(),dmg:Math.round(45*hm)});
  TWR.shake=Math.max(TWR.shake,3);TWR.say="MAMA: BACK IT UP, BABY!";snd(120,.3,60,'sawtooth',.06)}
 TWR.sayT=1.6}
function twStarsFor(){let s=1;if(TWR.heart>=10)s=2;if(TWR.nl===0)s=3;return s}
function twDawnCard(st){const sn=TWR.snap||{earned:0,kills:0};
 TWR.card={t:2.6,dawn:true,stars:st||0,title:'NIGHT '+TWR.night+' CLEAR!',sub:TWMAPS[TWR.map-1].name,go:'A: TO DAWN',
 lines:['+'+(TWR.earned-sn.earned)+' PETALS · '+(TWR.kills-sn.kills)+' POPS',
  TWR.nl===0?'NO LEAKS! THE HEART IS WHOLE':'LEAKS '+TWR.nl+' · HEART '+TWR.heart]}}
function twRoundEnd(){TWR.round=false;const bonus=14+3*TWR.night-(TWR.moteFace||0);TWR.motes=[]; /* v4: loose petals already paid part of it */
 let leaf=0;
 for(const t of TWR.towers)if(t.hero<0&&t.type===4){const d=twDef(t);leaf+=d.dawn}
 TWR.petals+=bonus+leaf;TWR.earned+=bonus+leaf;
 const hp=twHeartPos();
 if(TWR.mode==='e'){TWR.survived=TWR.night;twDawnCard(0)}
 else{const st=twStarsFor(),key=TWR.map+TWR.mode+TWR.night,old=TW.stars[key]||0;
  if(st>old){TW.stars[key]=st;const gain=(st-old)*(TWR.mode==='h'?2:1);TW.drops+=gain}
  twSave();
  if(TWR.night>=TWMAPS[TWR.map-1].nights){TW.wins++;twSave();TWR.mapClear=true;state='g5win';snd(784,.15,1175);twStoryGate('w'+TWR.map,true,()=>{state='g5win'});return}
  twDawnCard(st);if(st===3)snd(1320,.09,1760)}
 TWR.night++;twIntermission(false);
 twPlantMsg('Dawn! +'+(bonus+leaf)+' petals. Night '+TWR.night+' next.');snd(784,.1,988);
 if(TWR.guide===5)TWR.guide=6;
 if(TWR.guide===6&&TWR.grew)twGuideDone();
 else if(TWR.guide>0&&TWR.night>=3)twGuideDone()}
function twFxUpdate(dt){
 for(let i=TWR.flies.length-1;i>=0;i--){const f=TWR.flies[i];f.t+=dt;f.x+=(70-f.x)*Math.min(1,dt*7);f.y+=(8-f.y)*Math.min(1,dt*7);
  if(f.t>.5||Math.hypot(70-f.x,8-f.y)<4){TWR.flies.splice(i,1);TWR.petPulse=.25;
   if(TWR.coinT<=0){snd(1560,.03,0,'square',.012);TWR.coinT=.07}}}
 if(TWR.petPulse>0)TWR.petPulse-=dt;
 if(TWR.coinT>0)TWR.coinT-=dt;
 for(let i=TWR.parts.length-1;i>=0;i--){const p=TWR.parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=46*dt;if(p.t>=p.life)TWR.parts.splice(i,1)}
 for(let i=TWR.floats.length-1;i>=0;i--){const f=TWR.floats[i];f.t+=dt;f.y-=9*dt;if(f.t>=f.life)TWR.floats.splice(i,1)}
 for(let i=TWR.beams.length-1;i>=0;i--){TWR.beams[i].t+=dt;if(TWR.beams[i].t>=TWR.beams[i].life)TWR.beams.splice(i,1)}
 for(let i=TWR.fx.length-1;i>=0;i--){const f=TWR.fx[i];
  if(f.kind==='yukon'){f.d+=115*dt;
   for(const cr of TWR.creeps){if((cr.pi||0)!==(f.pi||0))continue;if(!f.hit.has(cr)&&Math.abs(cr.d-f.d)<=13){f.hit.add(cr);
     twHit(cr,f.dmg||45,'ability',null);cr.d=Math.max(0,cr.d-26);twSyncCreep(cr)}}
   if(f.d>twPathLen(f.pi||0)+16)TWR.fx.splice(i,1)}}
 if(TWR.shake>0)TWR.shake=Math.max(0,TWR.shake-dt*9)}
/* ---- v3.3 controls: grid cursor + strip as one travel path ----
   Field cells are 16px (a tower footprint). A tap steps one cell;
   holding repeats after .28s, accelerating to a .07s interval —
   the whole field crosses in ~1.3s. DOWN off the bottom row puts
   focus in the shop strip; LEFT/RIGHT walk the cards with wrap;
   UP or A returns to the field with the card armed. */
function twCellXs(){const xs=[];for(let x=16;x<=224;x+=16)xs.push(x);return xs}
function twCellYs(){const ys=[],t=twBoardTop(),b=twBoardBot();
 for(let y=t+10;y<=b-4;y+=16)ys.push(y);return ys}
function twCellStep(dx,dy){const c=TWR.cur;
 if(dx){const xs=twCellXs();let nx=null;
  for(const v of xs){if(dx>0&&v>c.x+.5&&(nx===null||v<nx))nx=v;
   if(dx<0&&v<c.x-.5&&(nx===null||v>nx))nx=v}
  if(nx===null)return false;c.x=nx;return true}
 if(dy){const ys=twCellYs();let ny=null;
  for(const v of ys){if(dy>0&&v>c.y+.5&&(ny===null||v<ny))ny=v;
   if(dy<0&&v<c.y-.5&&(ny===null||v>ny))ny=v}
  if(ny===null)return false;c.y=ny;return true}
 return false}
function twNavStep(d){
 if(d==='left'&&twCellStep(-1,0))snd(520,.02,0,'square',.012);
 if(d==='right'&&twCellStep(1,0))snd(520,.02,0,'square',.012);
 if(d==='up'&&twCellStep(0,-1))snd(520,.02,0,'square',.012);
 if(d==='down'&&twCellStep(0,1))snd(520,.02,0,'square',.012)}
function twNav(dt){const dirs=['left','right','up','down'];let pd=null;
 for(const d of dirs)if(pressed(d))pd=d;
 if(pd){TWR.repD=pd;TWR.repT=0;TWR.repN=0;twNavStep(pd)}
 else if(TWR.repD&&keys[TWR.repD]){TWR.repT+=dt;
  const th=TWR.repN===0?.28:Math.max(.07,.15-.012*TWR.repN);
  if(TWR.repT>=th){TWR.repT=0;TWR.repN++;twNavStep(TWR.repD)}}
 else TWR.repD=null}
/* ---- v3.4 front door: settings (shared console meta, the
   Rootdeep way), main menu, intro cinematic ---- */
const TWSET={mus:7,sfx:8,shake:true};
let TWSETUI=null;
function twSyncSet(){if(typeof meta!=='undefined'){if(meta.mus!=null)TWSET.mus=meta.mus;if(meta.sfx!=null)TWSET.sfx=meta.sfx}
 if(TW&&TW.set&&TW.set.shake!=null)TWSET.shake=TW.set.shake}
function twApplySet(){if(typeof meta!=='undefined'){meta.mus=TWSET.mus;meta.sfx=TWSET.sfx}
 TW.set={mus:TWSET.mus,sfx:TWSET.sfx,shake:TWSET.shake};twSave()}
function twOpenSet(from){TWSETUI={sel:0,from};state='g5set';snd(590,.04)}
function twSetInput(){const u=TWSETUI;if(!u){state='g5title';return}
 if(pressed('up')){u.sel=(u.sel+2)%3;snd(520,.03)}
 if(pressed('down')){u.sel=(u.sel+1)%3;snd(520,.03)}
 let ch=false;
 if(pressed('left')){if(u.sel===0){TWSET.mus=Math.max(0,TWSET.mus-1);ch=true}else if(u.sel===1){TWSET.sfx=Math.max(0,TWSET.sfx-1);ch=true}else{TWSET.shake=!TWSET.shake;ch=true}}
 if(pressed('right')){if(u.sel===0){TWSET.mus=Math.min(10,TWSET.mus+1);ch=true}else if(u.sel===1){TWSET.sfx=Math.min(10,TWSET.sfx+1);ch=true}else{TWSET.shake=!TWSET.shake;ch=true}}
 if(pressed('a')){if(u.sel===2){TWSET.shake=!TWSET.shake;ch=true}else if(u.sel===0){TWSET.mus=(TWSET.mus+1)%11;ch=true}else{TWSET.sfx=(TWSET.sfx+1)%11;ch=true}}
 if(ch){twApplySet();snd(660,.03)}
 if(pressed('b')||pressed('start')){const f=u.from;TWSETUI=null;snd(330,.05);state=f==='pause'?'g5play':'g5menu'}}
function twDrawSet(){r('#14101e',0,0,W,H);r('#241b40',0,0,W,24);r('#f8d030',0,24,W,1);
 text('SETTINGS',6,5,2,'#fff8e0'); text('SHARED WITH THE CONSOLE',6,30,1,'#b8b0d8');
 const rows=[['MUSIC VOL',TWSET.mus,0],['SFX VOL',TWSET.sfx,0],['SCREEN SHAKE',TWSET.shake?1:0,1]];
 rows.forEach((rw,i)=>{const y=52+i*26,sel=TWSETUI&&TWSETUI.sel===i;
  if(sel)r('#2c2450',8,y-3,W-16,20);
  if(sel)text('\u25b6',12,y,2,'#f8d030');
  text(rw[0],26,y,2,sel?'#fff8e0':'#c8c0d8');
  if(rw[2]===0){for(let pp=0;pp<10;pp++)r(pp<rw[1]?'#f8d030':'#3a3454',158+pp*7,y+3,5,8)}
  else text(rw[1]?'ON':'OFF',158,y,2,rw[1]?'#a8e078':'#ff6a5e')});
 text('\u25c0 \u25b6 ADJUST \u00b7 B: BACK',6,H-13,1,'#b8b0d8')}
let TWMenuSel=0;
let TWSTART=null,TWNOTE='';
const TWMAIN=['PLAY','NIGHTS','LANTERN UPGRADES','THE LONG NIGHT','INTRO','HOW TO PLAY','FIELD GUIDE','SETTINGS','SWAP CARTRIDGE'];
function twMenuAct(){const it=TWMAIN[TWMenuSel];
 if(it==='PLAY'){snd(660,.06);const f=twFrontier();TWSTART={map:f.map,mode:'s',night:f.night};
  if(!TW.introSeen)twIntroStart('play');else twNewRun(f.map,'s',f.night)}
 else if(it==='NIGHTS'){TWMAPUI={map:1,mode:'s',night:1,focus:'night'};twMapUiSync();state='g5map';snd(590,.04)}
 else if(it==='LANTERN UPGRADES'){TWUPGUI={sel:0,msg:'',msgT:0};state='g5upg';snd(590,.04)}
 else if(it==='THE LONG NIGHT'){if(twMapCleared(3)){snd(660,.06);twNewRun(1,'e',1)}
  else{TWNOTE='CLEAR THE CROSSROADS FIRST!';snd(160,.08)}}
 else if(it==='INTRO')twIntroStart('menu');
 else if(it==='HOW TO PLAY'){TWHOW={page:0,from:'menu'};snd(590,.04)}
 else if(it==='FIELD GUIDE'){TWHOW={page:2,from:'menu'};snd(590,.04)}
 else if(it==='SETTINGS')twOpenSet('menu');
 else if(it==='SWAP CARTRIDGE'){snd(330,.06);eject()}}
function twDrawMainMenu(){const mw=184,mx=Math.round((W-mw)/2),my=74,mh=Math.min(TWMAIN.length,6)*16+26;
 r('rgba(8,6,16,.80)',mx,my,mw,mh);r('#1c1633',mx+2,my+2,mw-4,mh-4);
 r('#f8d030',mx,my,mw,1);r('#f8d030',mx,my+mh-1,mw,1);r('#f8d030',mx,my,1,mh);r('#f8d030',mx+mw-1,my,1,mh);
 const vis=6,vst=Math.max(0,Math.min(TWMAIN.length-vis,TWMenuSel-2));
 if(vst>0)text('▲',mx+mw-14,my+5,1,'#b8b0d8');
 if(vst+vis<TWMAIN.length)text('▼',mx+mw-14,my+mh-24,1,'#b8b0d8');
 for(let i=vst;i<Math.min(TWMAIN.length,vst+vis);i++){const y=my+7+(i-vst)*16,sel=TWMenuSel===i;
  if(sel)r('#2c2450',mx+5,y-2,mw-10,14);
  if(sel)text('\u25b6',mx+9,y,2,'#f8d030');
  text(TWMAIN[i],mx+24,y,2,sel?'#fff8e0':'#c8c0d8');
  if(i===0){const f=twFrontier(),ft=twClearedCount()>=26?'ALL CLEAR':'MAP '+f.map+' · NIGHT '+f.night;
   text(ft,mx+mw-10-tw(ft,1),y+4,1,'#f8d030')}
  if(TWMAIN[i]==='THE LONG NIGHT'&&!twMapCleared(3))text('LOCKED',mx+mw-10-tw('LOCKED',1),y+4,1,'#a49cc0')}
 text(TWNOTE||'A: PICK \u00b7 B: TITLE',mx+8,my+mh-12,1,TWNOTE?'#ff6a5e':'#b8b0d8')}
/* v4: the story player (twIntroStart, twIntroUpdate, twDrawIntro, twStoryGate) lives in tw-story.js */
/* ---- pause menu + restart (snapshot taken in twStartRound) ---- */
function twOpenMenu(){const items=['resume','how','settings','restart','quit'];
 if(TWR.guide>0)items.push('skip');
 TWR.menu={sel:0,items};TWR.paused=true;snd(440,.05)}
function twRestartNight(){const s=TWR.snap;TWR.menu=null;TWR.paused=false;
 if(!s){TWR.round=false;return}
 TWR.petals=s.petals;TWR.heart=s.heart;TWR.kills=s.kills;TWR.earned=s.earned;TWR.leaks=s.leaks;TWR.nl=s.nl||0;
 TWR.towers=s.towers.map(t=>Object.assign({},t,{cdT:0,abT:0}));
 TWR.creeps=[];TWR.queue=[];TWR.motes=[];TWR.shots=[];TWR.parts=[];TWR.beams=[];TWR.fx=[];TWR.pending=[];TWR.flies=[];TWR.leakK={};
 TWR.round=false;TWR.cine=null;TWR.fork=null;TWR.train=null;TWR.pow=null;TWR.flareT=0;TWR.rainT=0;TWR.boofUsed=false;TWR.boofN=0;TWR.drip=0;
 if(TWR.night===1&&TWR.guide===5){TWR.guide=4;TWR.g5shown=false}
 TWR.say=twWarnFor();TWR.sayT=99;snd(392,.08)}
function twMenuInput(){const m=TWR.menu;
 if(pressed('up')){m.sel=(m.sel+m.items.length-1)%m.items.length;snd(520,.03)}
 if(pressed('down')){m.sel=(m.sel+1)%m.items.length;snd(520,.03)}
 if(pressed('b')||pressed('start')){TWR.menu=null;TWR.paused=false;snd(440,.05);return}
 if(pressed('a')){const it=m.items[m.sel];
  if(it==='resume'){TWR.menu=null;TWR.paused=false;snd(440,.05)}
  else if(it==='how'){TWHOW={page:0,from:'pause'};snd(590,.04)}
  else if(it==='settings'){twOpenSet('pause');snd(590,.04)}
  else if(it==='restart')twRestartNight();
  else if(it==='quit'){TWR.menu=null;TWR.paused=false;state='g5title';snd(330,.06)}
  else if(it==='skip'){TW.guideDone=true;twSave();TWR.guide=0;TWR.menu=null;TWR.paused=false;
   TWR.say='Guide off. Hold the garden!';TWR.sayT=2;snd(440,.05)}}}
function twHowInput(){
 if(pressed('left')&&TWHOW.page>0){TWHOW.page--;snd(520,.03)}
 if(pressed('right')&&TWHOW.page<3){TWHOW.page++;snd(520,.03)}
 if(pressed('b')){TWHOW=null;snd(330,.05)}}
const TWMENULBL={resume:'RESUME',how:'HOW TO PLAY',settings:'SETTINGS',restart:'RESTART NIGHT',quit:'QUIT TO TITLE',skip:'SKIP GUIDE'};
function twDrawMenu(){const m=TWR.menu,mw=150,mh=m.items.length*13+40,
 mx=Math.round((W-mw)/2),my=Math.max(34,Math.round((H-mh)/2)-4);
 r('rgba(8,6,16,.72)',0,0,W,H);
 r('#1c1633',mx,my,mw,mh);r('#f8d030',mx,my,mw,1);r('#f8d030',mx,my+mh-1,mw,1);
 r('#f8d030',mx,my,1,mh);r('#f8d030',mx+mw-1,my,1,mh);
 text('PAUSED',mx+8,my+6,2,'#fff8e0');
 for(let i=0;i<m.items.length;i++){const y=my+27+i*13,sel=m.sel===i;
  if(sel)r('#2c2450',mx+4,y-2,mw-8,12);
  text(sel?'\u25b6':' ',mx+8,y,1,'#f8d030');
  text(TWMENULBL[m.items[i]],mx+18,y,1,sel?'#fff8e0':'#c8c0d8')}
 text('A: PICK \u00b7 B: RESUME',mx+8,my+mh-11,1,'#b8b0d8')}
/* field guide rows: kind, name, counter in <=5 words (Louie's own) */
const TWGUIDE_ROWS=[['std','DRONE','ANY SHOOTER DROPS IT'],['dart','DART','DEW SLOWS IT DOWN'],
 ['regrow','PATCHER','EMBER BURN STOPS REPAIRS'],['bulk','PLATED','PEB CRACKS ITS ARMOR'],
 ['moss','STEALTH','DEW MIST SHOWS IT'],['iron','HARDCASE','ONLY PEB HURTS IT'],
 ['split','CARRIER','DROP THE BITS TOO'],['mite','BIT','TINY BUT FAST'],
 ['bubble','SHIELDER','POP ITS SHIELD FIRST'],['digger','DRILLER','DEW MIST DIGS IT UP'],
 ['mauler','LOADER','BRING EVERYTHING YOU HAVE'],['maw','THE SCRAPER','DROPS BITS. GARDEN 2 END.'],
 ['boss','THE HARVESTER','THE BOSS OF GARDEN 1'],['prime','BOTTIE PRIME','THE END. GARDEN 3.']];
let TWMAPUI=null,TWUPGUI=null;
const TWMODES=[['s','STANDARD'],['h','HARD'],['a','ALT NIGHTS']];
function twModeOk(map,mode){if(mode==='s')return true;
 return (TW.stars[map+'s'+TWMAPS[map-1].nights]||0)>0}
function twMapOk(map){if(map===1)return true;const pm=map-1;
 return (TW.stars[pm+'s'+TWMAPS[pm-1].nights]||0)>0||(TW.stars[pm+'h'+TWMAPS[pm-1].nights]||0)>0}
function twMapUiSync(){const u=TWMAPUI;if(!u)return;
 if(!twMapOk(u.map))u.map=1;
 if(!twModeOk(u.map,u.mode))u.mode='s';
 u.night=twFrontierIn(u.map,u.mode)}
function twMapInput(){const u=TWMAPUI;if(!u){state='g5menu';return}
 if(pressed('b')){TWMAPUI=null;TWMAP=1;TWNOTE='';state='g5menu';snd(330,.05);return}
 if(pressed('up')||pressed('down')){const rows=['map','mode','night'];let ix=rows.indexOf(u.focus);
  ix=(ix+(pressed('down')?1:2))%3;u.focus=rows[ix];TWNOTE='';snd(520,.03);return}
 if(pressed('left')||pressed('right')){const d=pressed('right')?1:-1;snd(520,.03);
  if(u.focus==='map'){let m=u.map+d;if(m<1)m=3;if(m>3)m=1;
   if(twMapOk(m)){u.map=m;u.mode='s';twMapUiSync();TWNOTE=''}
   else TWNOTE='CLEAR '+TWMAPS[m-2].name+' FIRST!'}
  else if(u.focus==='mode'){const ix=TWMODES.findIndex(m2=>m2[0]===u.mode);
   const nm=TWMODES[(ix+d+3)%3][0];
   if(twModeOk(u.map,nm)){u.mode=nm;twMapUiSync();TWNOTE=''}else TWNOTE='CLEAR ON STANDARD FIRST!'}
  else{u.night=Math.max(1,Math.min(TWMAPS[u.map-1].nights,u.night+d));TWNOTE=''}
  return}
 if(pressed('a')||pressed('start')){
  if(u.night>twFrontierIn(u.map,u.mode)){snd(160,.08);TWNOTE='CLEAR THE NIGHTS BEFORE IT!';return}
  const s={map:u.map,mode:u.mode,night:u.night};TWMAPUI=null;snd(660,.06);
  if(!TW.introSeen){TWSTART=s;twIntroStart('sel')}else twNewRun(s.map,s.mode,s.night)}}
function twDrawMap(){const u=TWMAPUI||{map:1,mode:'s',night:1,focus:'night'};
 r('#0d0a18',0,0,W,H);g.drawImage(twBoardCv(false,u.map),0,twBoardTop());r('rgba(10,8,22,.62)',0,0,W,H);
 ctext('CHOOSE A GARDEN',36,2,'#f8d030');
 for(let m=1;m<=3;m++){const cx=6+(m-1)*79,cw=76,ok=twMapOk(m),sel=u.map===m;
  r(sel?'#2c2450':'#171226',cx,46,cw,32);if(sel||u.focus==='map')r(sel?'#f8d030':'#4a4270',cx,46,cw,1);
  text(["ERIN'S GARDEN",'LONG BEDS','CROSSROADS'][m-1],cx+4,49,1,ok?'#fff8e0':'#a49cc0');
  if(ok){let st=0;for(let n=1;n<=TWMAPS[m-1].nights;n++)st+=TW.stars[m+'s'+n]||0;
   g.drawImage(TWSTAR,cx+4,60,9,9);text(st+'/'+(TWMAPS[m-1].nights*3),cx+16,61,1,'#f8d030');
   text(['FIRST WATCH','LONGER DARK','TWO GATES'][m-1],cx+4,70,1,'#a49cc0')}
  else text('LOCKED',cx+4,62,1,'#a49cc0')}
 const md=TWMODES.find(m2=>m2[0]===u.mode),mdx=W/2-tw('MODE: '+md[1],2)/2;
 if(u.focus==='mode')r('#f8d030',mdx-8,84,tw('MODE: '+md[1],2)+16,1);
 text('MODE: '+md[1],mdx,88,2,'#fff8e0');
 ctext(u.mode==='h'?'+HP DRONES · 40 PETALS · 2X DROPS':u.mode==='a'?'THE NIGHTS, REMIXED':'THE GARDEN AS PLANTED',108,1,'#c8c0d8');
 const N=TWMAPS[u.map-1].nights,fr=twFrontierIn(u.map,u.mode),pw=21,gap=2,tot=N*pw+(N-1)*gap,sx=Math.round((W-tot)/2);
 text('NIGHT',sx,122,1,'#b8b0d8');
 for(let n=1;n<=N;n++){const px=sx+(n-1)*(pw+gap),un=n<=fr,st=TW.stars[u.map+u.mode+n]||0;
  r(n===u.night?'#2c2450':'#171226',px,132,pw,26);
  if(n===u.night||u.focus==='night')r(n===u.night?'#f8d030':'#4a4270',px,132,pw,1);
  text(String(n),px+(n<10?8:5),135,1,un?'#fff8e0':'#8f86c8');
  if(un)for(let s2=0;s2<3;s2++){if(s2<st)g.drawImage(TWSTAR,px+2+s2*6,148,5,5);else r('#4a4270',px+2+s2*6,148,5,5)}
  else text('X',px+8,147,1,'#8f86c8')}
 if(TWNOTE)ctext(TWNOTE,H-28,1,'#ff6a5e');
 {const sr='STARS '+twStarPoints()+' · DROPS '+TW.drops;text(sr,W-tw(sr,1)-6,H-16,1,'#f8d030')}
 text('A: PLAY · B: BACK',6,H-16,1,'#b8b0d8')}
function twUpgInput(){const u=TWUPGUI;if(!u){state='g5menu';return}
 if(pressed('b')){TWUPGUI=null;state='g5menu';snd(330,.05);return}
 if(pressed('down')&&u.sel<6){u.sel+=2;snd(520,.03)}
 if(pressed('up')&&u.sel>=2){u.sel-=2;snd(520,.03)}
 if(pressed('left')||pressed('right')){u.sel^=1;snd(520,.03)}
 if(pressed('a')){const pk=TWPERKS[u.sel];
  if(TW.perks.indexOf(pk.id)>=0){u.msg=pk.n+' IS ALREADY YOURS.';snd(330,.06)}
  else if(TW.drops>=pk.cost){TW.drops-=pk.cost;TW.perks.push(pk.id);twSave();
   u.msg=pk.n+' IS YOURS!';snd(784,.12,1175)}
  else{u.msg='NEED '+(pk.cost-TW.drops)+' MORE SUN DROPS.';snd(160,.08)}}}
function twDrawUpg(){const u=TWUPGUI||{sel:0,msg:''};
 r('#14101e',0,0,W,H);r('#241b40',0,0,W,22);
 text('LANTERN UPGRADES',6,4,2,'#fff8e0');
 g.drawImage(TWSTAR,W-52,4,11,11);text(String(TW.drops),W-38,5,2,'#f8d030');
 text('STARS PAY SUN DROPS. SPEND THEM!',6,26,1,'#b8b0d8');
 for(let i=0;i<8;i++){const pk=TWPERKS[i],cx=6+(i%2)*118,cy=40+((i/2)|0)*33,own=TW.perks.indexOf(pk.id)>=0,sel=u.sel===i;
  r(sel?'#2c2450':'#1d1830',cx,cy,112,30);
  if(sel)r('#f8d030',cx,cy,112,1);
  text(pk.n,cx+5,cy+3,1,own?'#a8e078':'#fff8e0');
  text(pk.fx,cx+5,cy+12,1,'#c8c0d8');
  text(own?'OWNED':pk.cost+' DROPS',cx+5,cy+21,1,own?'#a8e078':'#f8d030')}
 if(u.msg)ctext(u.msg,H-26,1,'#ffd94d');
 text('A: BUY · B: BACK',6,H-13,1,'#b8b0d8')}
function twDrawPow(){const u=TWR.pow,mw=184,mx=Math.round((W-mw)/2),mh=116,my=Math.round((H-mh)/2);
 r('rgba(8,6,16,.6)',0,0,W,H);r('#17122a',mx,my,mw,mh);r('#f8d030',mx,my,mw,1);
 text('POWERS · PAY TO FIRE',mx+8,my+5,1,'#f8d030');
 for(let i=0;i<3;i++){const pw=TWPOW[i],y=my+18+i*26,sel=u.sel===i;
  if(sel){r('#2c2450',mx+4,y-3,mw-8,23);r('#f8d030',mx+4,y-3,mw-8,1)}
  text(pw.n,mx+8,y,2,sel?'#fff8e0':'#c8c0d8');
  text(pw.cost+'P',mx+mw-10-tw(pw.cost+'P',2),y,2,TWR.petals>=pw.cost?'#f8d030':'#ff6a5e');
  text(pw.fx,mx+8,y+13,1,sel?'#f8d030':'#a49cc0')}
 text('A: FIRE · B: CLOSE',mx+8,my+mh-11,1,'#b8b0d8')}
function twDrawTrain(iy0){const t=TWR.train,hd=TWHERO[t.hero],cost=(t.hl||1)===1?120:220;
 r('#14101e',0,iy0,W,42);r('#f8d030',0,iy0,W,1);
 twUprootHint(t,iy0);
 if((t.hl||1)>=3){text(hd.name,4,iy0+3,1,'#f8d030');text('FULLY TRAINED',6,iy0+15,2,'#fff8e0');text('A / B: BACK',6,iy0+29,1,'#b8b0d8');return}
 text('TRAIN '+hd.name+'?',4,iy0+3,1,'#c8c0d8');
 text('LV'+(t.hl||1)+' → LV'+((t.hl||1)+1),6,iy0+15,2,'#fff8e0');
 text(cost+'P',110,iy0+15,2,'#f8d030');
 text('DMG +35% · FASTER',6,iy0+29,1,'#f8d030');
 text('A: TRAIN · B: NO',140,iy0+29,1,'#b8b0d8')}
function twDrawHow(){const p=TWHOW.page;
 r('#14101e',0,0,W,H);r('#241b40',0,0,W,24);r('#f8d030',0,24,W,1);
 text('HOW TO PLAY',6,5,2,'#fff8e0'); text((p+1)+' / 4',W-40,5,2,'#b8b0d8');
 if(p===0){ctext('DEFEND THE GARDEN HEART',42,2,'#f8d030');ctext('IN THREE GARDENS.',60,2,'#f8d030');
  text('Drones fly the paths to the Heart.',14,88,1,'#e8e4f8');
  text('Plant sprouts + keepers off the path.',14,102,1,'#e8e4f8');
  text('Clear a garden to open the next one.',14,116,1,'#e8e4f8');
  text('26 nights. BOTTIE PRIME waits last.',14,130,1,'#e8e4f8')}
 else if(p===1){ctext('CONTROLS',42,2,'#f8d030');
  const rows=[['D-PAD','MOVE \u00b7 PICK CARDS BELOW'],['A','PLANT \u00b7 GROW \u00b7 FIRE'],
   ['B','UPROOT \u00b7 SPEED UP TIME'],['START','START NIGHT \u00b7 PAUSE'],['SEL','POWERS, MID-ROUND']];
  rows.forEach((rw,i)=>{const y=70+i*22;text(rw[0],14,y,2,'#fff8e0');text(rw[1],92,y+4,1,'#c8c0d8')})}
 else{ctext('FIELD GUIDE',42,2,'#f8d030');
  const grows=TWGUIDE_ROWS.slice(p===2?0:7,p===2?7:14);
  grows.forEach((rw,i)=>{const y=58+i*13,spr=TWCREEP[rw[0]];
   if(spr)g.drawImage(spr,8,y,13,10);
   text(rw[1],26,y+1,1,'#fff8e0');text(rw[2],26+tw(rw[1],1)+6,y+1,1,'#c8c0d8')})}
 text('\u25c0 \u25b6 PAGES \u00b7 B: BACK',6,H-13,1,'#b8b0d8')}
function twMite(parent){return{kind:'mite',hp:5,maxhp:5,sp:28,bounty:1,dmg:1,armor:0,camo:false,
 d:parent.d,off:parent.off,pi:parent.pi||0,shield:0,maxshield:0,surfaced:true,under:false,shedT:0,
 x:parent.x,y:parent.y,burnT:0,burnDps:0,slowT:0,slowF:1,stunT:0,hitT:0}}
function twWorld(dt){ /* one simulation step; input lives in twUpdate */
 if(TWR.sayT>0&&TWR.sayT<90)TWR.sayT-=dt;
 if(TWR.round&&!TWR.powTip&&TWR.petals>=80&&TWR.sayT<=0){TWR.powTip=true;TWR.say='WOOF! SELECT = POWERS!';TWR.sayT=2.2}
 if(TWR.dngT>0)TWR.dngT-=dt;
 if(TWR.round&&TWR.dngT<=0&&TWR.sayT<=1.2&&TWR.creeps.some(c=>c.d>twPathLen(c.pi||0)*.78)){TWR.say='WOOF! TOO CLOSE!';TWR.sayT=1.4;TWR.dngT=6;snd(392,.1,196)}
 if(TWR.flareT>0)TWR.flareT-=dt;
 if(TWR.rainT>0)TWR.rainT-=dt;
 if(TWR.dripFxT>0)TWR.dripFxT-=dt;
 if(TWR.round&&TWR.queue.length){TWR.spawnT-=dt;
  if(TWR.spawnT<=0){const cr=TWR.queue.shift();cr.d=0;if(TWR.rainT>0){cr.slowT=Math.max(cr.slowT,TWR.rainT);cr.slowF=Math.min(cr.slowF,.35)}twSyncCreep(cr);TWR.creeps.push(cr);
   TWR.spawnT=twSpawnGap();
   if(twIsBoss(cr.kind)&&!TWR.bossCine){TWR.bossCine=true;
    const bn=cr.kind==='maw'?'THE SCRAPER':cr.kind==='prime'?'BOTTIE PRIME':'THE HARVESTER';
    TWR.say=bn+' IS HERE!!';TWR.sayT=2.5;
    twStartCine({kind:'boss',dur:1.1,fire:null,bossKind:cr.kind,name:bn,sub:cr.kind==='maw'?'IT EATS THE GARDEN\'S DATA':cr.kind==='prime'?'THE NUMBA ONE CLANKA':'IT REAPS WHAT YOU SOWED'});snd(98,.4,49,'sawtooth',.06)}}}
 for(const t of TWR.towers){if(t.hero>=0)twFireHero(t,dt);else twFire(t,dt);
  if(TWR.round&&t.hero<0&&t.type===4){const d=twDef(t);
   if(d.farmAmt>0){t.farmT=(t.farmT||0)+dt;
    if(t.farmT>=d.farmPer){t.farmT=0;t.fruitT=1.2;
     TWR.petals+=d.farmAmt;TWR.earned+=d.farmAmt;t.farmMade=(t.farmMade||0)+d.farmAmt;twFloat(t.x,t.y-24,'+'+Math.round(d.farmAmt),'#f8d030');twBurst(t.x,t.y-14,'#f8a0c8',3)}}
   if(t.fruitT>0)t.fruitT-=dt}}
 const scout=TWR.towers.find(x=>x.hero===4);
 const hp=twHeartPos();
 for(let i=TWR.creeps.length-1;i>=0;i--){const cr=TWR.creeps[i];const L=twPathLen(cr.pi);
  if(cr.burnT>0){cr.burnT-=dt;const bd=cr.burnDps*dt;cr.hp-=bd;twDrip(bd)}
  if(cr.kind==='regrow'&&cr.burnT<=0&&cr.hp>0&&cr.hp<cr.maxhp)cr.hp=Math.min(cr.maxhp,cr.hp+2.8*dt);
  if(cr.slowT>0)cr.slowT-=dt;else cr.slowF=1;
  if(cr.stunT>0)cr.stunT-=dt;
  if(cr.hitT>0)cr.hitT-=dt;if(cr.critT>0)cr.critT-=dt;
  if((cr.kind==='boss'||cr.kind==='prime')&&!cr.enr&&cr.hp<cr.maxhp/2){cr.enr=true;cr.sp*=1.25;TWR.say=cr.kind==='prime'?'BZZT! NUMBA ONE CLANKA IS MAD!':'OVERCLOCKED! FASTER NOW!';TWR.sayT=1.8;TWR.shake=Math.max(TWR.shake,2);snd(82,.35,55,'sawtooth',.06)}
  if(cr.kind==='digger'){const L2=twPathLen(cr.pi);
   if(!cr.surfaced){let surf=TWR.flareT>0||cr.d>=L2*.4;
    if(!surf)for(const t of TWR.towers){if(t.hero<0&&t.type===2){const dd=twDef(t),dx=cr.x-t.x,dy=cr.y-t.y;
     if(dx*dx+dy*dy<=dd.rng*dd.rng){surf=true;break}}}
    if(surf){cr.surfaced=true;twBurst(cr.x,cr.y-2,'#8a5a3a',6);if(cr.d<L2*.4)twFloat(cr.x,cr.y-14,'UP!','#f8e8c8')}}
   cr.under=!cr.surfaced;
   if(cr.under&&Math.random()<dt*3&&TWR.parts.length<130)
    TWR.parts.push({x:cr.x+(Math.random()*8-4),y:cr.y+2,vx:0,vy:-6,t:0,life:.4,col:'#8a5a3a',s:1})}
  if((cr.kind==='maw'||cr.kind==='prime')&&cr.hp>0){cr.shedT=(cr.shedT||0)+dt;
   if(cr.shedT>=12){cr.shedT=0;TWR.pending.push(twMite(cr));twBurst(cr.x,cr.y-4,'#a87fd0',4)}}
  if(cr.hp<=0){TWR.creeps.splice(i,1);let b=cr.bounty;
   if(scout){const dx=cr.x-scout.x,dy=cr.y-scout.y;if(dx*dx+dy*dy<=TWHERO[4].forage*TWHERO[4].forage)b+=1}
   TWR.petals+=b;TWR.earned+=b;TWR.kills++;
   twBurst(cr.x,cr.y-4,twIsBoss(cr.kind)?'#f8d030':'#f8a0c8',twIsBoss(cr.kind)?22:6);
   if(TWR.flies.length<24)TWR.flies.push({x:cr.x,y:cr.y-4,t:0});
   if(b>=10)twFloat(cr.x,cr.y-18,'+'+b,b>=40?'#f8d030':'#f8c8e0');
   if(cr.critT>0){twBurst(cr.x,cr.y-4,'#ffd94d',12);twFloat(cr.x,cr.y-25,'CRIT!','#ffd94d');snd(880,.07,1320,'square',.03)}
   if(cr.kind==='split')for(let k=0;k<2;k++)TWR.pending.push(twMite(cr));
   if(twIsBoss(cr.kind)){TWR.bossDown=true;TWR.shake=Math.max(TWR.shake,3)}
   snd(220,.06,110);continue}
  cr.d+=cr.sp*(cr.stunT>0?0:(cr.slowT>0?cr.slowF:1))*dt;twSyncCreep(cr);
  if(TWR.boofN<(twHasPerk('boof')?2:1)&&cr.d>=L-34){TWR.boofN++;TWR.boofUsed=true;
   for(const o of TWR.creeps){const dx=o.x-cr.x,dy=o.y-cr.y;if(dx*dx+dy*dy<46*46)o.stunT=Math.max(o.stunT||0,1.6)}
   TWR.say='BOOF!!';TWR.sayT=1.5;TWR.shake=Math.max(TWR.shake,3);twBurst(cr.x,cr.y-6,'#f8e8c8',10);snd(240,.12,120)}
  if(cr.d>=L){TWR.creeps.splice(i,1);TWR.heart-=cr.dmg;TWR.leaks++;TWR.nl++;TWR.leakK[cr.kind]=(TWR.leakK[cr.kind]||0)+1;
   TWR.say='ARF! THE HEART!';TWR.sayT=1.4;TWR.shake=Math.max(TWR.shake,4);snd(180,.15,90);
   if(TWR.heart<=0){TWR.heart=0;
    if(TWR.mode==='e'){TWR.survived=TWR.night-1;const gain=Math.min(4,Math.floor(TWR.survived/5));
     TWR.endGain=gain;TW.drops+=gain;if(TWR.survived>TW.endlessBest)TW.endlessBest=TWR.survived}
    else if(TWR.map===1&&TW.best<TWR.night)TW.best=TWR.night;
    twSave();state='g5over';snd(147,.4,73,'sawtooth',.05);return}}}
 for(const m of TWR.pending)TWR.creeps.push(m);TWR.pending.length=0;
 for(let i=TWR.shots.length-1;i>=0;i--){TWR.shots[i].t-=dt;if(TWR.shots[i].t<=0)TWR.shots.splice(i,1)}
 twFxUpdate(dt);
 if(TWR.round&&!TWR.queue.length&&!TWR.creeps.length&&!TWR.cine)twRoundEnd()}
function twUpdate(dt){switch(state){
 case 'g5title':TWMAP=1;if(pressed('a')||pressed('start')){state='g5menu';TWMenuSel=0;snd(660,.06)}
  else if(pressed('b')||pressed('sel'))eject();return;
 case 'g5menu':TWMAP=1;if(TWHOW){twHowInput();return}
  if(pressed('up')){TWMenuSel=(TWMenuSel+TWMAIN.length-1)%TWMAIN.length;TWNOTE='';snd(520,.03)}
  if(pressed('down')){TWMenuSel=(TWMenuSel+1)%TWMAIN.length;TWNOTE='';snd(520,.03)}
  if(pressed('b')){state='g5title';snd(330,.05);return}
  if(pressed('a')||pressed('start'))twMenuAct();return;
 case 'g5set':twSetInput();return;
 case 'g5map':twMapInput();return;
 case 'g5upg':twUpgInput();return;
 case 'g5cine':twIntroUpdate(dt);return;
 case 'g5play':{
  if(TWR.cine){TWR.cine.t+=dt;
   if(pressed('a')||TWR.cine.t>=TWR.cine.dur){const c=TWR.cine;TWR.cine=null;if(c.fire)c.fire()}
   return}
  if(TWR.build){twBuildInput(dt);return}
  if(TWR.fork&&pressed('sel')){twUproot(TWR.fork);TWR.fork=null;return}
  if(TWR.train&&pressed('sel')){twUproot(TWR.train);TWR.train=null;return}
  if(TWR.fork){TWR.forkT=(TWR.forkT||0)+dt;if(pressed('left')){TWR.forkSel=0;snd(520,.03)}
   if(pressed('right')){TWR.forkSel=1;snd(520,.03)}
   if(pressed('b')){TWR.fork=null;snd(330,.05)}
   if(pressed('a')&&(TWR.forkT||0)>=.13){const t=TWR.fork;
    if(t.lv>=3){TWR.fork=null;snd(330,.05)}
    else if(t.lv>=2){const gc=TWGRANDC[t.type];
     if(TWR.petals<gc){twPlantMsg('Not enough petals!');snd(160,.07)}
     else{TWR.petals-=gc;t.lv=3;t.cdT=0;TWR.fork=null;
      twPlantMsg(twGrandN(t)+' RISES!');snd(784,.12,1568);twBurst(t.x,t.y-10,'#f8d030',14)}}
    else{const v=TWFORK[t.type][TWR.forkSel],fc=twForkCost(t.type,TWR.forkSel+1);
     if(TWR.petals<fc){twPlantMsg('Not enough petals!');snd(160,.07)}
     else{TWR.petals-=fc;t.lv=2;t.variant=TWR.forkSel+1;t.cdT=0;TWR.fork=null;
      twPlantMsg(TYPES[t.type].n+' became '+v.n+'!');snd(880,.08,1320);TWR.grew=true;if(TWR.guide===6)twGuideDone()}}}
   return}
  if(TWR.card){TWR.card.t-=dt;
   if(pressed('a')||pressed('start')||TWR.card.t<=0){TWR.card=null}
   return}
  if(TWR.pow){if(pressed('up')){TWR.pow.sel=(TWR.pow.sel+2)%3;snd(520,.03)}
   if(pressed('down')){TWR.pow.sel=(TWR.pow.sel+1)%3;snd(520,.03)}
   if(pressed('b')||pressed('sel')){TWR.pow=null;snd(330,.05)}
   if(pressed('a')){const ix=TWR.pow.sel,pw=TWPOW[ix];
    if(TWR.petals<pw.cost){twPlantMsg('Not enough petals!');snd(160,.07)}
    else{TWR.petals-=pw.cost;TWR.pow=null;twUsePow(ix)}}
   return}
  if(TWR.train){const t=TWR.train;TWR.trainT=(TWR.trainT||0)+dt;
   if(pressed('b')){TWR.train=null;snd(330,.05)}
   if(pressed('a')&&(TWR.trainT||0)>=.13){const cost=(t.hl||1)===1?120:220;
    if((t.hl||1)>=3){TWR.train=null;snd(330,.05)}
    else if(TWR.petals<cost){twPlantMsg('Not enough petals!');snd(160,.07)}
    else{TWR.petals-=cost;t.hl=(t.hl||1)+1;TWR.train=null;
     twPlantMsg(TWHERO[t.hero].name+' trained to LV'+t.hl+'!');snd(880,.08,1320);twBurst(t.x,t.y-14,'#f8d030',8)}}
   return}
  if(TWHOW){twHowInput();return}
  if(TWR.menu){twMenuInput();return}
  twNav(dt);twMotes(dt);
  if(pressed('sel')){if(TWR.round){TWR.pow={sel:0};snd(590,.04)}}
  if(pressed('a'))twActA();
  if(pressed('b'))twActB();
  if(pressed('start')){if(TWR.round)twOpenMenu();else if(TWR.guide>0&&TWR.guide<4){twPlantMsg('WOOF! Two sprouts first!');snd(160,.07)}else{TWR.focus='field';twStartRound()}}
  if(TWR.guide===5&&TWR.round&&TWR.night===1){TWR.g5t+=dt;
   if(TWR.g5t>=5&&!TWR.g5shown){TWR.g5shown=true;TWR.say='B speeds time up! Try it!';TWR.sayT=2.6;snd(660,.06)}}
  if(TWR.fork||TWR.train||TWR.pow||TWR.cine||TWR.build)return;
  const steps=TWR.round?TWR.speed:1;
  for(let i=0;i<steps;i++){if(TWR.cine||state!=='g5play')break;twWorld(dt*TWPACE)}
  return}
 case 'g5win':if(pressed('a')||pressed('start')){state='g5title';snd(660,.06)}return;
 case 'g5over':if(pressed('a')||pressed('start')){const m2=TWR.map,md2=TWR.mode;snd(660,.06);twNewRun(m2,md2,1)}
  else if(pressed('b')){state='g5title';snd(330,.06)}return;
 }}
function twHeart(x,y,s){r('#f85888',x-4*s,y-3*s,3*s,3*s);r('#f85888',x+1*s,y-3*s,3*s,3*s);
 r('#f85888',x-4*s,y-1*s,8*s,3*s);r('#f85888',x-2*s,y+2*s,4*s,2*s);r('#f85888',x,y+4*s,1*s,1*s);
 r('#ffb8d0',x-3*s,y-2*s,2*s,1*s)}
function twRangeDash(x,y,rad,col){if(rad<=0)return;
 g.globalAlpha=.55;g.strokeStyle=col;g.lineWidth=1;
 for(let i=0;i<12;i++){g.beginPath();g.arc(x,y,rad,i*Math.PI/6,i*Math.PI/6+Math.PI/9);g.stroke()}
 g.globalAlpha=1}
function twRangeCirc(x,y,rad,col){if(rad<=0)return;
 g.globalAlpha=.6;g.strokeStyle=col;g.lineWidth=1;g.beginPath();g.arc(x,y,rad,0,7);g.stroke();g.globalAlpha=1}
function twDraw(){ox=0;oy=0;
 if(state==='g5title'||state==='g5menu'){r('#1e2c28',0,0,W,H);
  g.drawImage(twBoardCv(true),0,twBoardTop());
  r('rgba(12,10,28,.46)',0,0,W,H);
  for(let i=0;i<20;i++){const sx=(i*47)%W,sy=(i*29)%Math.max(40,twBoardTop()+26);r(i%4?'#8f86c8':'#e8e4f8',sx,sy,1,1)}
  r('#f8e060',204,8,10,10);r('#fff8c0',206,10,3,3);
  for(let i=0;i<6;i++)g.drawImage(TWTOW[i][0],12+i*22,H-28+Math.round(Math.sin(time*2+i*1.1)*1.2),16,20);
  const wsp=twHeroSpr(0);if(wsp)g.drawImage(wsp,166,H-30,15,18);
  if(CH.ERIN)g.drawImage(CH.ERIN,186,H-30,15,18);
  if(CH.MARCUS)g.drawImage(CH.MARCUS,206,H-30,15,18);
  drawDog({x:150,y:H-12,fx:-1,mv:0,st:'sit',alert:0,say:null});
  const twpp=twPathPos(6+((Math.sin(time*.4)+1)/2)*64,0);g.globalAlpha=.85;g.drawImage(TWCREEP.std,Math.round(twpp.x)-8,Math.round(twpp.y)-6,16,11);g.globalAlpha=1;
  const thp=twHeartPos();g.globalAlpha=.10+.05*Math.sin(time*2.4);r('#f8c070',thp.x-13,thp.y-13,26,26);g.globalAlpha=1;
  ctext('CLANKAWATCH',34,4,'#7fd4f8');ctext("LIL BOTTIE WANTS THE LIGHT. HE'S MAD.",56,1,'#e8e4f8',null);
  ctext('THREE GARDENS. 26 NIGHTS. ONE HEART.',68,1,'#fff8e0',null);
  {const bw=26,bh=twBottieH(bw),bx=20,by=twBoardTop()+8-bh+Math.round(Math.sin(time*2.2)*1.5);g.drawImage(twOL(twBottieSpr(),bw,bh),bx-1,by-1);twMad(bx+bw-3,by-6)} /* v4: the numba one clanka, mad, on the wall */
  if(state==='g5title'){if(((time*1.6)|0)%2)ctext('PRESS START',96,2,'#fff8e0');
   ctext('STARS '+twStarPoints()+' · SUN DROPS '+TW.drops+' \u00b7 GARDENS SAVED '+TW.wins,132,1,'#c8b8f8',null)}
  else twDrawMainMenu();
  if(TWHOW)twDrawHow();return}
 if(state==='g5cine'){twDrawIntro();return}
 if(state==='g5set'){twDrawSet();return}
 if(state==='g5map'){twDrawMap();return}
 if(state==='g5upg'){twDrawUpg();return}
 if(state==='g5win'){r('#58b858',0,0,W,H);g.drawImage(twBoardCv(false),0,twBoardTop());r('rgba(12,10,28,.5)',0,0,W,H);
  if(TWR.map>=3){ctext('THE GARDEN STANDS!',H/2-30,3,'#a8e078');
   ctext('PRIME IS DOWN! ALL 3 GARDENS HELD!',H/2-6,1,'#fff8e0',null)}
  else{ctext('GARDEN HELD!',H/2-30,3,'#a8e078');
   ctext(TWR.map===1?'GARDEN CLEAR! THE LONG BEDS OPEN!':'LONG BEDS CLEAR! CROSSROADS OPEN!',H/2-6,1,'#fff8e0',null)}
  ctext('KILLS '+TWR.kills+' · PETALS EARNED '+TWR.earned+' · LEAKS '+TWR.leaks,H/2+8,1,'#e8e4f8',null);
  if(((time*2)|0)%2)ctext('PRESS A',H/2+30,2,'#fff8e0');return}
 if(state==='g5over'){r('#1e2c28',0,0,W,H);g.drawImage(twBoardCv(true),0,twBoardTop());r('rgba(40,8,16,.45)',0,0,W,H);ctext('THE SWARM TOOK THE HEART',H/2-30,2,'#ff6a5e');{const bw=28,bh=twBottieH(bw);g.drawImage(twOL(twBottieSpr(),bw,bh),W/2-bw/2-1,H/2-36-bh);ctext('BOTTIE: BZZT! NUMBA ONE CLANKA!',H/2+44,1,'#7fd4f8',null)}
  ctext(TWR.mode==='e'?('THE LONG NIGHT: SURVIVED '+TWR.survived+' \u00b7 BEST '+TW.endlessBest):(TWR.night<=1?'THE HEART FELL ON NIGHT 1':'YOU HELD '+(TWR.night-1)+' NIGHT'+(TWR.night-1>1?'S':'')+' \u00b7 FELL ON NIGHT '+TWR.night),H/2-6,1,'#fff8e0',null);
  ctext('KILLS '+TWR.kills+' · PETALS EARNED '+TWR.earned+(TWR.mode==='e'&&TWR.endGain?' · +'+TWR.endGain+' SUN DROPS':''),H/2+8,1,'#e8e4f8',null);
  {const lk=TWR.leakK||{};let top=null,tn=0;for(const k in lk)if(lk[k]>tn){tn=lk[k];top=k}
   if(top&&TWR.mode!=='e'){const row=TWGUIDE_ROWS.find(r=>r[0]===top);
    if(row){let ls='x'+tn+' '+row[1]+' · '+row[2];if(ls.length>39)ls='x'+tn+' '+row[1];
     ctext(ls,H/2+20,1,'#ffd7e8',null)}}}
  if(((time*2)|0)%2)ctext('A: RETRY \u00b7 B: TITLE',H/2+30,2,'#fff8e0');return}
 const night=TWR.round,day=!night;
 r(night?'#1e2c28':'#58b858',0,0,W,H);
 g.drawImage(twBoardCv(night),0,twBoardTop());
 const shaken=TWR&&TWR.shake>0&&TWSET.shake;
 if(shaken){g.save();g.translate((Math.random()*2-1)*TWR.shake,(Math.random()*2-1)*TWR.shake)}
 /* the Garden Heart: glow, petal ring, pulsing flower-heart sprite */
 const hp=twHeartPos(),hx=hp.x,hy=hp.y;
 g.globalAlpha=.12+.05*Math.sin(time*3);r('#f85888',hx-14,hy-14,28,28);
 g.globalAlpha=.08;r('#f85888',hx-19,hy-19,38,38);g.globalAlpha=1;
 for(let i=0;i<6;i++){const a=i*1.05+0.5,fx=hx+Math.cos(a)*13,fy=hy+Math.sin(a)*11;
  r(['#f8c8e0','#f8d030','#e878c8'][i%3],fx-1,fy-1,2,2)}
 const pul=Math.sin(time*3)>0,pw2=pul?22:20,ph2=pul?24:22;
 g.drawImage(TWHEART,hx-pw2/2,hy-13-(ph2-22)/2,pw2,ph2);
 /* towers + heroes (soil patch grounds each one) */
 if(TWR){for(const t of TWR.towers){
  r('rgba(0,0,0,.28)',t.x-7,t.y+2,14,3);
  if(t.hero>=0){
   const spr=twHeroSpr(t.hero);
   if(spr)twSpr(spr,t.x-10,t.y-21,20,23);else r('#ffd94d',t.x-5,t.y-18,10,16);
   for(let li=0;li<(t.hl||1);li++)r('#f8d030',t.x-8+li*5,t.y+8,4,2);
   if(night){const hd=TWHERO[t.hero],f=t.abT>0?1-t.abT/hd.abCd:1;
    r('#181020',t.x-8,t.y+5,16,2);r(f>=1?'#f8d030':'#8f86c8',t.x-8,t.y+5,16*f,2);
    if(f>=1&&((time*3)|0)%2){r('#fff8c0',t.x-10,t.y-22,1,1);r('#fff8c0',t.x+9,t.y-16,1,1)}}}
  else{twSpr(TWTOW[t.type][t.variant||0],t.x-8,t.y-16,16,20);
   if(t.fruitT>0)g.drawImage(TWPETAL,t.x-4,t.y-27,8,8);
   if(t.lv>=3)g.drawImage(TWSTAR,t.x-5,t.y-30,10,10);
   if(t.lv>1){r('#f8d030',t.x+5,t.y-18,3,3);r('#fff3b0',t.x+6,t.y-17,1,1)}}}}
 /* beams + yukon fx */
 if(TWR){for(const b of TWR.beams){g.globalAlpha=.85*(1-b.t/b.life);
   const dx=b.x2-b.x1,dy=b.y2-b.y1,steps=Math.max(2,Math.round(Math.hypot(dx,dy)/3));
   for(let i=0;i<=steps;i++)r(b.col,Math.round(b.x1+dx*i/steps)-b.w/2,Math.round(b.y1+dy*i/steps)-b.w/2,b.w,b.w);
   g.globalAlpha=1}
  for(const f of TWR.fx)if(f.kind==='yukon'){const pos=twPathPos(f.d,0,f.pi||0),fx0=Math.round(pos.x),yy=Math.round(pos.y);
   r('rgba(0,0,0,.3)',fx0-17,yy+5,34,2);
   r('#f4f6f8',fx0-17,yy-4,34,8);r('#e2e6ea',fx0-10,yy-10,19,7);r('#9fd8e8',fx0-8,yy-9,7,5);r('#9fd8e8',fx0+1,yy-9,6,5);
   r('#c02838',fx0+15,yy-2,2,3);r('#f8d030',fx0-17,yy-2,2,3);
   r('#282038',fx0-12,yy+3,6,4);r('#282038',fx0+6,yy+3,6,4);r('#8f9299',fx0-10,yy+4,2,2);r('#8f9299',fx0+8,yy+4,2,2)}}
 /* creeps: real sprites now — flip to face travel, bob, flash on hit */
 if(TWR){for(const cr of TWR.creeps){const cx=Math.round(cr.x),cy=Math.round(cr.y);
   const sz=TWCSZ[cr.kind]||[16,13],swd=sz[0],sht=sz[1];
   const hidden=cr.camo&&!twRevealed(cr);
   const p2=twPathPos(Math.min(twPathLen(cr.pi),cr.d+2),cr.off,cr.pi),p1=twPathPos(Math.max(0,cr.d-2),cr.off,cr.pi);
   if(p2.x>p1.x)cr.face=1;else if(p2.x<p1.x)cr.face=-1;if(cr.face===undefined)cr.face=1;
   const bob=cr.kind==='mite'?0:Math.round(Math.sin(cr.d*.45)*0.7);
   r('rgba(0,0,0,.3)',cx-swd/2,cy+3,swd,2);
   if(cr.under){r('#8a5a3a',cx-7,cy+1,14,4);r('#6e4428',cx-4,cy-1,8,3);r('#a87850',cx-2,cy,3,1);continue}
   if(hidden)g.globalAlpha=.45;
   const spr=cr.hitT>0?TWCREEPF[cr.kind]:TWCREEP[cr.kind];
   g.save();g.translate(cx,cy-2+bob);if(cr.face<0)g.scale(-1,1);
   g.drawImage(twOL(spr,swd,sht),-swd/2-1,-sht-1);g.restore();
   if(cr.slowT>0){g.globalAlpha=.32;g.save();g.translate(cx,cy-2+bob);if(cr.face<0)g.scale(-1,1);
    g.drawImage(TWCREEPB[cr.kind],-swd/2,-sht,swd,sht);g.restore();g.globalAlpha=1}
   if((cr.kind==='boss'||cr.kind==='prime')&&cr.enr){g.globalAlpha=.28;g.save();g.translate(cx,cy-2+bob);if(cr.face<0)g.scale(-1,1);
    g.drawImage(TWCREEPR[cr.kind],-swd/2,-sht,swd,sht);g.restore();g.globalAlpha=1}
   if(cr.shield>0){g.globalAlpha=.16;g.fillStyle='#bfe8f8';g.beginPath();g.arc(cx,cy-3,swd/2+3,0,7);g.fill();
    g.globalAlpha=.55;g.strokeStyle='#bfe8f8';g.lineWidth=1;g.beginPath();g.arc(cx,cy-3,swd/2+3,0,7);g.stroke();g.globalAlpha=1}
   if(cr.kind==='regrow'&&cr.hp<cr.maxhp&&cr.burnT<=0&&((time*2)|0)%2)g.drawImage(TWHEART,cx-4,cy-sht-9,7,8);
   if(cr.burnT>0){const fl=((time*9)|0)%2;g.drawImage(TWFLAME,cx-3,cy-sht-6-fl,7,8)}
   if(cr.stunT>0){g.drawImage(TWSTAR,cx-6,cy-sht-8,5,5);g.drawImage(TWSTAR,cx+2,cy-sht-10,5,5)}
   g.globalAlpha=1;
   const wpx=twIsBoss(cr.kind)?(cr.kind==='prime'?38:32):cr.kind==='mauler'?24:16;
   r('#181020',cx-wpx/2,cy-sht-5,wpx,3);r('#e8384f',cx-wpx/2,cy-sht-5,Math.max(0,wpx*cr.hp/cr.maxhp),3);
   if(cr.shield>0){r('#181020',cx-wpx/2,cy-sht-8,wpx,2);r('#8fc4e4',cx-wpx/2,cy-sht-8,Math.max(0,wpx*cr.shield/(cr.maxshield||1)),2)}
   if(cr.armor>0){const aw=Math.min(wpx,cr.armor*3),ay=cy-sht-(cr.shield>0?11:8);r('#181020',cx-wpx/2,ay,aw,2);r('#98a0b0',cx-wpx/2,ay,aw,2)}}}
 /* crossroads: the gate that feeds next glows while the wave comes */
 if(TWR&&TWR.round&&TWR.queue.length&&TWMAPS[TWR.map-1].paths.length>1){const nq=TWR.queue[0],gey=twPathPts(TWR.map,nq.pi||0).pts[0].y;
  r('rgba(20,8,4,.55)',0,gey-9,13,18);
  r('#f08030',2,gey-6,2,2);r('#f08030',9,gey+4,2,2);r('#f8d030',5,gey-1,2,2);
  if(TWR.spawnT<.6||((time*2)|0)%2){r('#ffd94d',1,gey-2,3,3);r('#ffd94d',9,gey-2,3,3)}}
 /* shots */
 if(TWR){for(const s of TWR.shots){r(s.col,s.x1,s.y1-1,2,2);
  const dx=s.x2-s.x1,dy=s.y2-s.y1,steps=4;
  for(let i=1;i<=steps;i++){r(s.col,Math.round(s.x1+dx*i/steps),Math.round(s.y1+dy*i/steps),s.crit?2:1,s.crit?2:1)}}}
 /* particles + floaters */
 if(TWR){for(const p of TWR.parts)r(p.col,p.x,p.y,p.s,p.s);
  twDrawMotes();
  for(const f of TWR.flies)g.drawImage(TWPETAL,Math.round(f.x)-3,Math.round(f.y)-3,6,6);
  for(const f of TWR.floats){const fx2=Math.max(2,Math.min(Math.round(f.x-f.txt.length*2.5),W-f.txt.length*6-2)),fy2=Math.round(f.y);
   text(f.txt,fx2+1,fy2+1,1,'#1c1428');text(f.txt,fx2,fy2,1,f.col)}}
 /* Louie the lookout, by the Heart */
 if(TWR){const lp=twLouiePos();drawDog({x:lp.x,y:lp.y,fx:-1,mv:0,st:'sit',alert:night?1:0,say:null})}
 /* range circle + cursor */
 if(TWR){const ct=twTowerAt(TWR.cur.x,TWR.cur.y);
  if((TWR.guide>=1&&TWR.guide<=3)&&!TWR.build){const gs=twGuideSpot();
   const ge=TWMENU[TWR.sel];g.globalAlpha=.5;
   if(ge.k==='s')g.drawImage(TWTOW[ge.i][0],gs[0]-8,gs[1]-16,16,20);
   else if(ge.k==='h'){const hs=twHeroSpr(ge.i);if(hs)g.drawImage(hs,gs[0]-10,gs[1]-21,20,23)}
   g.globalAlpha=1;const gp=11+2*Math.sin(time*5),gc='#f8d030';
   r(gc,gs[0]-gp,gs[1]-gp,5,2);r(gc,gs[0]-gp,gs[1]-gp,2,5);r(gc,gs[0]+gp-5,gs[1]-gp,5,2);r(gc,gs[0]+gp-2,gs[1]-gp,2,5);
   r(gc,gs[0]-gp,gs[1]+gp-2,5,2);r(gc,gs[0]-gp,gs[1]+gp-5,2,5);r(gc,gs[0]+gp-5,gs[1]+gp-2,5,2);r(gc,gs[0]+gp-2,gs[1]+gp-5,2,5)}
  if(ct){const rr=ct.hero>=0?TWHERO[ct.hero].rng*(twHasPerk('eye')?1.05:1):twDef(ct).rng;twRangeDash(ct.x,ct.y,rr,'#fff8e0')}
  const cx=TWR.cur.x,cy=TWR.cur.y,bl=((time*4)|0)%2;
  r('rgba(255,248,224,.10)',cx-8,cy-8,16,16);
  const cc=(!ct&&twSelRange()>0&&!twSpotOK(cx,cy))?'#e8384f':(bl?'#fff8e0':'#f8d030');
  r(cc,cx-9,cy-10,5,2);r(cc,cx-9,cy-10,2,5);r(cc,cx+4,cy-10,5,2);r(cc,cx+7,cy-10,2,5);
  r(cc,cx-9,cy+8,5,2);r(cc,cx-9,cy+5,2,5);r(cc,cx+4,cy+8,5,2);r(cc,cx+7,cy+5,2,5);
  if(ct){const cl=ct.hero>=0?TWHERO[ct.hero].name:(ct.lv>=3?twGrandN(ct):'LV'+ct.lv+' '+TYPES[ct.type].n);
   const clw=tw(cl,1),clx=Math.max(2,Math.min(cx-14,W-clw-4));
   r('rgba(20,8,16,.45)',clx-2,cy-15,clw+4,9);text(cl,clx,cy-14,1,'#fff8e0')}}
 if(shaken)g.restore();
 /* ability cut-in */
 if(TWR&&TWR.cine){const ci=TWR.cine,slide=Math.min(1,ci.t*3.2),px2=Math.round(-52+66*slide);
  r('#0a0818',0,0,W,24);r('#0a0818',0,H-24,W,24);r('#f8d030',0,24,W,1);r('#f8d030',0,H-25,W,1);
  if(ci.kind==='ability'){const spr=twHeroSpr(ci.hero.hero);
   if(spr)g.drawImage(spr,px2,Math.round(H/2)-30,48,56);
   text(ci.who,px2+58,Math.round(H/2)-16,2,'#fff8e0');
   text(ci.name,px2+58,Math.round(H/2)+2,2,'#f8d030');
   text(ci.line,px2+58,Math.round(H/2)+22,1,'#c8c0d8')}
  else if(ci.kind==='boss'){const bk=ci.bossKind||'boss',bsz=TWCSZ[bk];
   g.drawImage(TWCREEP[bk],px2-4,Math.round(H/2)-30,84,Math.round(84*bsz[1]/bsz[0]));
   text(ci.name||'THE HARVESTER',px2+76,Math.round(H/2)-10,2,'#ff6a5e');
   text(ci.sub||'IT REAPS WHAT YOU SOWED',px2+76,Math.round(H/2)+8,1,'#c8c0d8')}
  else{const lp=typeof LOU!=='undefined'&&LOU&&LOU.l&&LOU.l[0];
   if(lp)g.drawImage(lp,px2,Math.round(H/2)-20,60,39);
   text('NIGHT 1',px2+70,Math.round(H/2)-14,2,'#fff8e0');
   text('THE SWARM COMES AT DARK',px2+70,Math.round(H/2)+4,1,'#c8c0d8')}
  text('A: SKIP',W-34,H-8,1,'#b8b0d8')}
 /* HUD: icons + clean chips; say text sits inside its panel now */
 r('#14101e',0,0,W,16);
 const twDng=TWR&&TWR.round&&TWR.creeps.some(c=>c.d>twPathLen(c.pi||0)*.78),twDngOn=twDng&&(((time*4)|0)%2===0);
 g.drawImage(TWHEART,3,3,twDngOn?11:9,twDngOn?12:10);
 text('HEART '+(TWR?TWR.heart:20),15,3,1,TWR&&(TWR.heart<=5||twDngOn)?'#e8384f':'#ffd7e8');
 g.drawImage(TWPETAL,66,4,TWR&&TWR.petPulse>0?10:8,TWR&&TWR.petPulse>0?10:8);
 text('PETALS '+(TWR?TWR.petals:0),77,3,1,TWR&&TWR.petPulse>0?'#ffffff':'#f8c8e0');
 text(TWR?(TWR.mode==='e'?'NIGHT '+TWR.night:'NIGHT '+TWR.night+'/'+TWMAPS[TWR.map-1].nights):'NIGHT 1/10',140,3,1,'#c8c0d8');
 if(TWR&&TWR.round)text(TWR.speed+'X',214,2,2,'#f8d030');
 if(TWR&&TWR.sayT>0&&TWR.say){r('#241b40',0,16,W,13);text(TWR.say.slice(0,44),4,18,1,'#f8e8c8')}
 {const b=TWR&&TWR.creeps.find(c=>twIsBoss(c.kind));
  if(b){const bl=b.kind==='maw'?'THE SCRAPER':b.kind==='prime'?'BOTTIE PRIME':'THE HARVESTER';
   r('#181020',52,32,112,5);r('#e8384f',52,32,112*Math.max(0,b.hp/b.maxhp),5);
   const blw=tw(bl,1);r('rgba(20,8,16,.45)',234-blw,29,blw+4,9);text(bl,236-blw,30,1,'#ff8a7a')}}
 /* info bar: the readable menu — selected entry or the tower under the
    cursor, name big, role plain, price in gold. The fork panel takes
    over both bottom bars while a grow choice is open. */
 const iy0=H-42;
 if(TWR&&TWR.fork){const t=TWR.fork,fk=TWFORK[t.type];
  r('#14101e',0,iy0,W,42);r('#f8d030',0,iy0,W,1);
  twUprootHint(t,iy0);
  if(t.lv>=3){text(twGrandN(t),4,iy0+3,1,'#f8d030');r('#2c2450',2,iy0+14,236,26);text('FULLY GROWN. A LEGEND.',6,iy0+17,2,'#fff8e0');text('A / B: BACK',6,iy0+30,1,'#b8b0d8')}
  else if(t.lv>=2){text('GROW IT ONE MORE TIME?',4,iy0+3,1,'#c8c0d8');
   r('#2c2450',2,iy0+14,236,26);r('#f8d030',2,iy0+14,236,1);
   text(twGrandN(t),6,iy0+17,2,'#fff8e0');
   text(TWGRANDC[t.type]+'P',236-tw(TWGRANDC[t.type]+'P',2),iy0+17,2,'#f8d030');
   text(twDef(t).farmAmt>0?'MADE +'+Math.round(t.farmMade||0)+'P SO FAR':'A LEGEND OF THE GARDEN',6,iy0+30,1,'#f8d030')}
  else{text('GROW IT? \u25c0 \u25b6 A',4,iy0+3,1,'#c8c0d8');
   for(let s=0;s<2;s++){const v=fk[s],fx0=s*120,sel=TWR.forkSel===s,fc=twForkCost(t.type,s+1);
    if(sel){r('#2c2450',fx0+2,iy0+14,116,26);r('#f8d030',fx0+2,iy0+14,116,1)}
    text(v.n,fx0+6,iy0+17,2,sel?'#fff8e0':'#c8c0d8');
    text(fc+'P',fx0+114-tw(fc+'P',2),iy0+17,2,'#f8d030');
    text(v.fx,fx0+6,iy0+30,1,sel?'#f8d030':'#a49cc0')}}}
 else if(TWR&&TWR.build)twDrawBuild(iy0);
 else if(TWR)twDrawBar(iy0);
 if(TWR&&TWR.card){r('rgba(8,6,16,.55)',0,0,W,H);
  ctext(TWR.card.title,H/2-26,3,'#f8d030',null);ctext(TWR.card.sub,H/2,2,'#fff8e0',null);
  if(TWR.card.stars)for(let si=0;si<3;si++){if(si<TWR.card.stars)g.drawImage(TWSTAR,W/2-26+si*20,H/2+12,14,14);
   else{g.globalAlpha=.22;g.drawImage(TWSTAR,W/2-26+si*20,H/2+12,14,14);g.globalAlpha=1}}
  if(TWR.card.lines)TWR.card.lines.forEach((ln,li)=>ctext(ln,H/2+32+li*12,1,'#e8e4f8',null));
  ctext(TWR.card.go||'A: BEGIN',TWR.card.lines?Math.min(H/2+58,H-48):H/2+22,1,'#b8b0d8',null)}
 if(TWR&&TWR.pow)twDrawPow();
 if(TWR&&TWR.train)twDrawTrain(H-42);
 if(TWR&&TWR.menu)twDrawMenu();
 if(TWHOW)twDrawHow();
}
const TWF={state:()=>state,start:()=>twStartTitle(),meta:()=>TW,run:()=>TWR,
 newRun:()=>{twNewRun()},update:(dt)=>twUpdate(dt),
 setPetals:(v)=>{TWR.petals=v},setHeart:(v)=>{TWR.heart=v},
 setSel:(v)=>{TWR.sel=v},setCur:(x,y)=>{TWR.cur.x=x;TWR.cur.y=y},cur:()=>TWR.cur,
 plantAt:(x,y,type,lv)=>{const t={hero:-1,type,lv:lv||1,variant:0,cdT:0,abT:0,x,y,a:1};TWR.towers.push(t);return t},
 placeHero:(x,y,h)=>{const t={hero:h,type:-1,lv:1,variant:0,cdT:0,abT:0,x,y,a:1};TWR.towers.push(t);return t},
 towers:()=>TWR.towers,creeps:()=>TWR.creeps,startNight:()=>twStartRound(),round:()=>TWR.round,
 speed:()=>TWR.speed,setSpeed:(v)=>{TWR.speed=v},
 actA:()=>twActA(),actB:()=>twActB(),warn:(n)=>TWWARN[1][n],
 menu:()=>TWMENU[TWR.sel],menuLen:()=>TWMENU.length,fork:()=>TWR.fork?{type:TWR.fork.type,sel:TWR.forkSel}:null,
 setForkSel:(v)=>{TWR.forkSel=v},motes:()=>TWR&&TWR.motes?TWR.motes.map(m=>({x:m.x,y:m.y,t:m.t})):[],build:()=>TWR&&TWR.build?{sel:TWR.build.sel}:null,
 nightA:()=>{const t=twTowerAt(TWR.cur.x,TWR.cur.y);if(t&&t.hero>=0)twAbilityA(t)},
 cine:()=>TWR.cine?TWR.cine.kind:null,
 skipCine:()=>{if(TWR.cine){const c=TWR.cine;TWR.cine=null;if(c.fire)c.fire()}},
 defOf:(t)=>twDef(t),revealed:(cr)=>twRevealed(cr),hit:(cr,d,cls,fx)=>twHit(cr,d,cls,fx),
 boof:()=>TWR.boofUsed,parts:()=>TWR.parts,heroDef:(i)=>TWHERO[i],forkDef:(ty)=>TWFORK[ty],
 pathLen:()=>twPathLen(),pathPos:(d)=>twPathPos(d,0),spotOK:(x,y)=>twSpotOK(x,y),
 heartPos:()=>twHeartPos(),distToPath:(x,y)=>twDistToPath(x,y),
 focus:()=>TWR.focus,guide:()=>TWR?TWR.guide:0,guideDone:()=>TW.guideDone,
 pauseMenu:()=>TWR.menu?{sel:TWR.menu.sel,items:TWR.menu.items.slice()}:null,
 menuSel:()=>TWMenuSel,introSeen:()=>TW.introSeen,
 intro:()=>TWCINE?{scene:TWCINE.scene,line:TWCINE.line,dest:TWCINE.dest,key:TWCINE.key}:null,storyAudit:()=>twStoryAudit(),storyPlay:(k)=>twStoryPlay(k,()=>{state='g5menu'}),seen:()=>TW.seen,
 twset:()=>({mus:TWSET.mus,sfx:TWSET.sfx,shake:TWSET.shake,ui:TWSETUI?{sel:TWSETUI.sel,from:TWSETUI.from}:null}),
 howPage:()=>TWHOW?TWHOW.page:-1,titleSel:()=>TWTitleSel,
 openMenu:()=>twOpenMenu(),restart:()=>twRestartNight(),
 snapInfo:()=>TWR.snap?{petals:TWR.snap.petals,towers:TWR.snap.towers.length}:null,
 sprites:()=>({tow:TWTOW,creep:TWCREEP,heart:TWHEART,flame:TWFLAME,tree:TWTREE}),boardCv:(n)=>twBoardCv(n),
 stars:()=>TW.stars,drops:()=>TW.drops,perks:()=>TW.perks.slice(),endlessBest:()=>TW.endlessBest,
 cleared:()=>twClearedCount(),frontier:()=>twFrontier(),mapCleared:(m)=>twMapCleared(m),
 newRunAt:(m,md,n)=>twNewRun(m,md,n),runMap:()=>TWR?{map:TWR.map,mode:TWR.mode,night:TWR.night}:null,
 heroCost:(i)=>twHeroCost(i),forkCost:(t,v)=>twForkCost(t,v),grandCost:(t)=>TWGRANDC[t],
 buyPerk:(id)=>{const pk=TWPERKS.find(pp=>pp.id===id);if(!pk||TW.perks.indexOf(id)>=0||TW.drops<pk.cost)return false;
  TW.drops-=pk.cost;TW.perks.push(id);twSave();return true},
 powOpen:()=>TWR?!!TWR.pow:false,usePow:(i)=>twUsePow(i),leakK:()=>TWR?Object.assign({},TWR.leakK):{},flies:()=>TWR?TWR.flies.length:0,
 trainOpen:()=>TWR?!!TWR.train:false,card:()=>TWR?TWR.card:null,
 mapUi:()=>TWMAPUI?{map:TWMAPUI.map,mode:TWMAPUI.mode,night:TWMAPUI.night,focus:TWMAPUI.focus}:null,
 upgSel:()=>TWUPGUI?TWUPGUI.sel:-1,perkList:()=>TWPERKS.map(pp=>({id:pp.id,n:pp.n,cost:pp.cost}))};

