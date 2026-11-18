
/* ---------- cartridge 6: LIGHTSWARM ---------- */
/* ============================================================
   LIGHTSWARM  -  cartridge 6 for the Pocket Lantern (vertical slice v0.3)
   An expedition from Sunkeep. Will walks into the dark with a swarm of
   sprouts; the sprouts throw the light by themselves. Dimmed buddies close
   in from every side. Show one enough light and it remembers and goes home
   calm, leaving a mote of light. Motes level you up: pick one of three.
   Five minutes in, the place's Guardian of the Light wakes, dim.
   Light it and its Sigil stone goes home to the Lantern.

   You only steer. A = your keeper's own move, B = WHISTLE (calls every
   mote, shoves the dark back), SELECT = their SUPER when its bar is full
   (a Knockout-style cut-in, a short scene, then it lands). Ten keepers,
   each played the way the lore has them. The Keeper's Trail unlocks
   people, sprout kinds and items by what you do; seeds buy lasting
   upgrades at Sunkeep; every keeper has five mastery ranks.

   Lore it leans on (all already canon, see alt/STORY-NOTES.md):
   expeditions carry the light to far places; sprouts carry the light that
   calms buddies; nothing is hurt, a calmed buddy walks home; Guardians and
   Sigil stones; PYTHORN is Crooked Hollow's Guardian.

   Source: alt/src/lightswarm.js, spliced in by alt/build.py.
   Save: localStorage 'lightswarm-v1' (its own; reads nothing else).
   Test handle: window.__g.LS._
   ============================================================ */
window.LS_CART=function(A){
const W=240,g=A.g,r=A.r,text=A.text,tw=A.tw,keys=A.keys,pressed=A.pressed,TY=A.TYPES;
const snd=(...a)=>{try{A.snd(...a)}catch(e){}},noise=(...a)=>{try{A.noise(...a)}catch(e){}};
const later=(f,ms)=>{if(typeof setTimeout!=='undefined')setTimeout(f,ms)};
let H=304;
const R=(a,b)=>a+Math.random()*(b-a),RI=n=>(Math.random()*n)|0,pick=a=>a[RI(a.length)],cl=(v,a,b)=>v<a?a:v>b?b:v,TAU=Math.PI*2,K='#181020';
const ctext=(s,y,sc,c,sh)=>text(s,Math.round((W-tw(s,sc))/2),y,sc,c,sh);
const wrap=(s,mw,sc=1)=>{const o=[];let l='';for(const w of String(s).split(' ')){const t=l?l+' '+w:w;if(l&&tw(t,sc)>mw){o.push(l);l=w}else l=t}if(l)o.push(l);return o};
const mmss=t=>{t=Math.max(0,t|0);return((t/60)|0)+':'+('0'+(t%60)).slice(-2)};

/* ---------- save ---------- */
const KEY='lightswarm-v1';
const ST0=()=>({calm:0,runs:0,bigs:0,wisps:0,supers:0,wins:0,wake:0,maxT:0,maxLv:0,maxW:0,falls:0,winsBy:{}});
const DEF=()=>({seeds:0,up:{glass:0,boots:0,pockets:0,head:0,reroll:0},best:{t:0,calm:0,lv:0},wins:0,runs:0,seen:0,hero:'will',done:{},mast:{},sup:{},stat:ST0()});
let SV=DEF();
try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o){SV=Object.assign(DEF(),o);SV.up=Object.assign(DEF().up,o.up||{});SV.best=Object.assign(DEF().best,o.best||{});SV.stat=Object.assign(ST0(),o.stat||{});SV.stat.winsBy=Object.assign({},(o.stat||{}).winsBy||{});SV.done=Object.assign({},o.done||{});SV.mast=Object.assign({},o.mast||{});SV.sup=Object.assign({},o.sup||{});
  if(!o.stat){SV.stat.runs=o.runs||0;SV.stat.wins=o.wins||0;SV.stat.maxT=SV.best.t;SV.stat.maxLv=SV.best.lv;SV.stat.calm=SV.best.calm}}}catch(e){} /* v0.1 saves carry over what they can */
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(SV))}catch(e){}};

/* ---------- what the sprouts do (one weapon per sprout kind, five levels each) ---------- */
const WP=[
 {n:'EMBER TOSS',d:'Embers fly at the nearest dim buddy.',lv:['One ember at a time','Two embers','Hotter. Passes through one buddy','Three embers','Faster and hotter']},
 {n:'PEB DROP',d:'A Peb is lobbed high and lands with a thump.',lv:['One Peb, a small thump','Bigger thump','Two Pebs','Heavier','Three Pebs, huge thump']},
 {n:'DEW RING',d:'Dews circle you. Anything that touches them is lit.',lv:['Three Dews','Four Dews','Wider ring, brighter','Five Dews','Six Dews, fast']},
 {n:'ZIP LINE',d:'A Zip darts from buddy to buddy in a chain.',lv:['Chains to 3','Chains to 4','Quicker','Chains to 6','Chains to 8, brighter']},
 {n:'LEAF PATCH',d:'Leafs plant a glowing patch. It slows the dark and mends you.',lv:['A small patch','Lasts longer','Wider','Brighter','Two patches']},
 {n:'LUCKY STAR',d:'A star drops on a buddy. More light from every mote.',lv:['One star','Motes +15%','Two stars','Motes +30%','Three stars, bigger']}];
/* things from home (passives, five levels each unless noted) */
const PS=[
 {id:'louie',n:'LOUIE',d:'Louie fetches far motes and brings them to you.',max:3,lv:['He fetches','He runs faster','He carries twice as much']},
 {id:'oil',n:'LANTERN OIL',d:'+20 light, and tops you up by 20.',max:5},
 {id:'boots',n:'TRAIL BOOTS',d:'Walk 8% faster.',max:5},
 {id:'bell',n:'TINY BELL',d:'Motes come to you from 30% further.',max:5},
 {id:'wrench',n:"MARCUS'S WRENCH",d:'All gas, bro. Sprouts shine 12% brighter.',max:5},
 {id:'tea',n:"ERIN'S TEA",d:'Your light slowly mends itself.',max:5},
 {id:'moon',n:'MOON PEBBLE',d:'Sprouts, your move and WHISTLE are ready 8% sooner.',max:5},
 {id:'nectar',n:'NECTAR',d:'Every mote carries 8% more light.',max:5},
 {id:'acorn',n:'ACORN CAP',d:'A hit dims your light 8% less.',max:5}];
/* finds: one-of-a-kind things from the valley, offered every fifth level. Some have to be opened on the trail first. */
const RL=[
 {id:'shard',n:'SUN SHARD',d:'A piece of the old Lantern. Your light reaches further and slowly mends.'},
 {id:'datac',n:'DATA CENTER KEY',d:'The machine that keeps the valley running. Every level shows four cards.'},
 {id:'coin',n:'GOLD COIN',d:'Half again as many seeds come home, and motes carry a little more.'},
 {id:'feather',n:'BLUE FEATHER',d:'Walk 12% faster. Your move is ready a fifth sooner.'},
 {id:'cuya',n:'CUYAPUP',d:'The river is on fire. Again. It walks with you and tackles the dark.',bud:'CUYAPUP'},
 {id:'bess',n:'BESSLING',d:'Something big just moved under the water. It walks with you.',bud:'BESSLING',goal:'big5'},
 {id:'grass',n:'GRASSKIN',d:'A footprint people will argue about. It walks with you.',bud:'GRASSKIN',goal:'lv20'},
 {id:'lamp',n:'SOUL LAMP',d:'It keeps a little light. Once, when yours goes out, it gives it back.',goal:'fall3'},
 {id:'key',n:'OLD KEY',d:'Every gift holds one more pick.',goal:'wisp3'},
 {id:'chip',n:'STAR CHIP',d:'Your SUPER fills 30% sooner.',goal:'su15'},
 {id:'moonb',n:'MOONBLOOM',d:'It only opens in the dark. Under a third light, sprouts shine 40% brighter.',goal:'t430'},
 {id:'scale',n:"BESSIE'S SCALE",d:'WHISTLE is ready twice as often and hits three times as hard.',goal:'c2500'},
 {id:'sigil',n:'SIGIL STONE',d:'It remembers the Guardian. 30% more light on big buddies and Guardians.',goal:'win2'}];

/* lasting upgrades bought with seeds at Sunkeep */
const UPS=[
 {id:'glass',n:'LANTERN GLASS',d:'+15 light at the start',c:[12,30,60]},
 {id:'boots',n:'WORN-IN BOOTS',d:'+5% walking speed',c:[12,30,60]},
 {id:'pockets',n:'BIG POCKETS',d:'+20% mote reach',c:[10,25,50]},
 {id:'head',n:'HEAD START',d:'Start with one more pick',c:[20,45,90]},
 {id:'reroll',n:"ERIN'S SECOND LOOK",d:'+1 reroll each expedition',c:[15,35,70]}];

/* ---------- the keepers: everyone who has turned up more than once, each played the way the lore has them ----------
   st = the sprout kind they lead with. at = what A does. Passives are read where they apply (search h.id). */
const HERO=[
 {id:'will',s2:"BIKE LANE",sd2:"Five bikes come down the lane you are facing. They do not brake.",q2:"ON YOUR LEFT.",idle:["ERIN AND I WERE PLANNING A WEDDING.", "NOBODY KNOWS WHO CALLED US HERE."],n:'WILL',tag:'THE KEEPER. THROWS FIRST, ASKS LATER.',ko:'will',st:0,hp:100,col:'#3a6ea8',pas:'SHIPPED IT: sprouts throw 10% sooner.',an:'CHARGE',ad:'The swarm surges the way you face.',at:'surge',acd:7,
  su:'HASBARA',sd:'An idea arrives from somewhere. Every buddy in sight stops to have it explained.',
  q:{go:['SPROUTS FIRST. QUESTIONS LATER.','I GOT HERE LAST. I KNOW.'],lv:['SHIPPED IT.','THAT WAS A FEATURE, NOT A BUG.'],low:['THIS IS FINE. PUSHING TO MAIN.'],big:['GG.'],boss:['IS THAT A SNAKE ON A CIRCUS TRUNK?'],su:['I JUST HAD AN IDEA.'],win:['GG. PUSHING TO MAIN.']}},
 {id:'erin',s2:"SPROUT STAMPEDE",sd2:"For seven seconds the whole swarm throws more than twice as fast.",q2:"EVERYBODY. NOW.",idle:["SOMEBODY KEPT THIS LIGHT BEFORE US.", "LOUIE LOOKS AFTER THE SNACKS."],n:'ERIN',tag:'KEEPER OF THE GARDEN.',ko:'erin',spr:'ERIN',st:4,hp:100,col:'#58a868',goal:'first',pas:'GREEN THUMB: her light mends itself, and berries turn up three times as often.',an:'TOWEL WHIP',ad:'A whip all the way round you.',at:'ring',acd:6,ar:52,admg:20,
  su:'LOUIE AIRLINES',sd:'Louie folds into a paper plane, ears for wings, and loops the whole field.',
  q:{go:['NICE AND STEADY.','A SLOW DAY IS STILL A GOOD DAY.'],lv:['THEY WATCH THE LIGHT.','GOOD. KEEP GOING.'],low:['OKAY. THAT ONE HURT.'],big:['GO WATER YOURSELF.'],boss:['IT IS ONLY DIM. IT IS NOT GONE.'],su:['LOUIE. PLANE.'],win:['GOOD BOY. GOOD EVERYBODY.']}},
 {id:'marcus',s2:"THE FINAL BET",sd2:"A coin. Heads, every small buddy in sight goes home. Tails, it costs him light.",q2:"DOUBLE OR NOTHING, BRO.",idle:["DEREK AND I WERE MID JOB, BRO.", "I GOT PLANS FOR THAT POND."],n:'MARCUS',tag:'PLUMBING BOSS. ALL GAS, BRO.',ko:'marcus',spr:'MARCUS',st:1,hp:100,col:'#d06818',goal:'c250',pas:'DOUBLE OR NOTHING: sprouts shine 15% brighter, and every gift is two picks.',an:'DAB CLOUD',ad:'A cloud ahead of you. The dark walks slow in it.',at:'cloud',acd:8,
  su:'THE DAB RIG',sd:'Marcus gets the rig out. The whole field goes very, very slow.',
  q:{go:['FLOW PROS, BABY.','I SUPERVISE.'],lv:['BUILT DIFFERENT, BRO.','I HAD MONEY ON THAT, BRO.'],low:['BRO. BRO. BRO.'],big:['DAP ME UP.'],boss:['I GOT A GUY FOR SNAKES. IT IS ME.'],su:['HOLD THIS, BRO.'],win:['BRO.']}},
 {id:'derek',s2:"BURST PIPE",sd2:"A main goes. The wave carries everything away from him.",q2:"THAT IS NOT UP TO CODE.",idle:["MARCUS OWES ME FOR GAS.", "A LAZY RIVER. HIS IDEA."],n:'DEREK',tag:'FLOW PROS. ON TIME. EVERY TIME.',st:3,hp:95,col:'#1c64c8',goal:'big',pas:'ON TIME: walks 15% faster, and PULL UP is ready a third sooner.',an:'PULL UP',ad:'The swarm surges the way you face.',at:'surge',acd:4.8,
  su:'DEREK PULLS UP',sd:'The Flow Pros truck comes through. Three times. Things fall out the back.',
  q:{go:['ON TIME. EVERY TIME.','MARCUS SAID IT WAS A QUICK JOB.'],lv:['THAT IS BILLABLE.','PUT IT ON THE INVOICE.'],low:['I LEFT THE TRUCK RUNNING.'],big:['THAT ONE IS COMING ON THE VAN.'],boss:['NOT IN THE QUOTE.'],su:['PULLING UP.'],win:['JOB DONE. WHO IS PAYING?']}},
 {id:'mama',s2:"YUKON",sd2:"The big white Yukon backs straight through. Once. That is enough.",q2:"DON'T MAKE ME TURN THIS AROUND.",idle:["RUBY IS ASLEEP. FINALLY.", "THE YUKON IS PARKED AT SUNKEEP."],n:'MAMA',tag:'RUNS ON NO SLEEP.',ko:'mama',st:2,hp:105,col:'#983848',goal:'t4',pas:'UP SINCE 4: everything is ready 15% sooner, and she walks 8% faster.',an:'MOM VOICE',ad:'Everything near you stops dead.',at:'ring',acd:7,ar:64,admg:8,astun:2.2,
  su:'RUBY TEMPER TANTRUM',sd:'Ruby does not want to go home. Five stomps. Everything on the field feels them.',
  q:{go:['I HAVE BEEN UP SINCE 4.','USE YOUR INSIDE FISTS.'],lv:['SHHH. NAP TIME.','ONE. TWO. DO NOT MAKE ME SAY THREE.'],low:["DON'T MAKE ME TURN THIS YUKON AROUND."],big:['NAP TIME FOR YOU TOO.'],boss:["RUBY. MOMMY'S BUSY."],su:['RUBY. GO AHEAD.'],win:['EVERYBODY IN THE YUKON.']}},
 {id:'corbin',s2:"007",sd2:"Nobody can see him for six seconds, and his sprouts shine twice as bright.",q2:"SNEAKY KISS.",idle:["...CAN I GET A KISS, THOUGH?", "ONE QUESTION."],n:'CORBIN',tag:'ONE QUESTION. EVERY SINGLE TIME.',ko:'kiss',st:5,hp:95,col:'#f078a8',goal:'su5',pas:'SMOOCH: some calmed buddies leave a heart that mends you.',an:'KISS',ad:'A blown kiss that goes through everything.',at:'shot',acd:5,ag:'heart',admg:26,
  su:'CAN I GET A KISS?',sd:'He asks. Every small buddy in sight says yes and goes home.',
  q:{go:['CAN I GET A KISS?','CAN I GET A KISS, MAN?'],lv:['CAN I GET A KISS?','...CAN I GET A KISS?'],low:['CAN I GET A... OW.'],big:['CAN I GET A BIG KISS?'],boss:['CAN IT GET A KISS?'],su:['CAN I GET A KISS?'],win:['I GOT A KISS.']}},
 {id:'scout',s2:"WISP LIGHT",sd2:"The Lanternwisp comes. For eight seconds the dark is thin and it burns.",q2:"THERE SHE IS.",idle:["SHE WALKS THE OLD GATEHOUSE AT NIGHT.", "MELONKIN: SHY. NOTED."],n:'SCOUT',tag:'WRITES EVERYTHING DOWN.',spr:'SCOUT',st:3,hp:90,col:'#3c8840',goal:'wisp',pas:'SHARP EYES: sees further in the dark, reaches motes from further, learns 12% more from each.',an:'BUG NET',ad:'Sweeps in every mote for a long way round.',at:'net',acd:5,
  su:'FIELD NOTES',sd:'Everything in sight holds still to be sketched. For ten seconds, every buddy leaves an extra mote.',
  q:{go:['EVER SEEN THE WISP?','I HAVE NEVER CAUGHT ONE MYSELF.'],lv:['WRITING THAT DOWN.','NEW ENTRY.'],low:['NOTE: THEY BITE.'],big:['THAT GOES IN THE GUIDE.'],boss:['OH. OH, THAT IS A BIG ENTRY.'],su:['HOLD STILL, PLEASE.'],win:['FIELD GUIDE COMPLETE. FOR TODAY.']}},
 {id:'ranger',s2:"TRAIL POST",sd2:"He plants a lantern post. Its ring mends him and burns the dark for ten seconds.",q2:"STAY BY THE POST.",idle:["OLD THORNBACK GUARDED A LIGHT ONCE.", "STAY ON THE DIRT."],n:'RANGER',tag:'WATCHES THE PATHS. SAYS LITTLE.',spr:'RANGER',st:1,hp:140,col:'#506838',goal:'w5',pas:'OLD STONES: 40 more light, a slower walk, and Pebs land a quarter wider.',an:'BOULDER',ad:'Rolls one. It does not stop for anything.',at:'shot',acd:6.5,ag:'rock',admg:34,
  su:'ROCKSLIDE',sd:'He has strong opinions about boulders. Here are fourteen of them.',
  q:{go:['PATH IS CLEAR. FOR NOW.','OLD STONES HUM AT NIGHT.'],lv:['HM.','GOOD.'],low:['HM. NOT GOOD.'],big:['OFF THE PATH.'],boss:['THAT IS NOT A BOULDER.'],su:['MIND YOUR HEADS.'],win:['PATH IS CLEAR.']}},
 {id:'bibi',s2:"IRON DOME",sd2:"The big one. Six seconds under it, and it shoves back whatever leans on it.",q2:"TEMPORARILY.",idle:["THREE THOUSAND YEARS. IT WAS PROMISED.", "THE DOME IS TEMPORARY."],n:'KING BIBI',tag:'PRIME MINISTER. AGAIN. AND AGAIN.',ko:'bibi',st:2,hp:110,col:'#3a5a9a',goal:'win',pas:'IRON DOME: the dome takes one hit for him every 14 seconds.',an:'IRON DOME',ad:'Raise it. Nothing touches you. Temporarily.',at:'ring',acd:9,ar:46,admg:14,adome:2.6,
  su:'THE COALITION',sd:'Six lit buddies turn up to walk with him. It holds for a while.',
  q:{go:['STAY CALM. I AM RAISING THE DOME.','TEMPORARILY.'],lv:['NEXT QUESTION.','I ALWAYS COME BACK.'],low:['THIS IS A RED LINE.'],big:['WELCOME TO THE COALITION.'],boss:['A DIM GUARDIAN SPELLS PERIL FOR THE KINGDOM.'],su:['THE COALITION HOLDS.'],win:['I ALWAYS COME BACK.']}},
 {id:'bottie',s2:"AIR SUPPORT",sd2:"Ten strikes from above, each on the strongest thing in sight.",q2:"CLANK CLANK. INCOMING.",idle:["BIG RED BUTTON. DO NOT PRESS.", "BZZT. I AM HELPING."],n:'LIL BOTTIE',tag:'CLANKER GUNS. CHAIN STUN.',ko:'chrome',sw:'BOTTIE',st:0,hp:80,col:'#7050a0',goal:'win3',pas:'CLANKER GUNS: fires by himself, all the time. Less light than anyone.',an:'CLANKERS',ad:'Seven shots in a fan.',at:'shot',acd:4,ag:'bullet',admg:12,an2:7,
  su:'NUKE THE DATA CENTER',sd:'The big red button. Every small buddy in sight is reset. It costs him some light.',
  q:{go:['BZZT. HERE TO HELP. PROBABLY.','SMILE.EXE LOADING.'],lv:['CLANK CLANK.','SMILE.EXE COMPLETE.'],low:['I MIGHT JUST HIT MY RATE LIMIT.'],big:['YOU JUST GOT CHAINED.'],boss:['BIG. RED. SNAKE. DO NOT PRESS.'],su:['OOPS IN ADVANCE.'],win:['THIS WAS FOR MY FEED.']}}];
const heroOf=id=>HERO.find(h=>h.id===id)||HERO[0];
/* the keeper's trail: every unlock is something you did, not something you bought */
const GOALS=[
 {id:'first',n:'FIRST STEPS',d:'Come home from any expedition',p:s=>[Math.min(1,s.runs),1],rw:'ERIN joins. LOUIE can be found.'},
 {id:'c250',n:'A GOOD START',d:'Calm 250 buddies in all',p:s=>[s.calm,250],rw:'MARCUS joins'},
 {id:'t3',n:'THREE MINUTES',d:'Last 3:00 on one expedition',p:s=>[s.maxT,180],rw:'PEB sprouts join the swarm',f:mmss},
 {id:'big',n:'THE BIG ONE',d:'Calm a big buddy',p:s=>[s.bigs,1],rw:'DEREK joins'},
 {id:'lv10',n:'GROWING',d:'Reach level 10 on one expedition',p:s=>[s.maxLv,10],rw:'LEAF sprouts join the swarm'},
 {id:'wisp',n:'EVER SEEN THE WISP?',d:'Catch a Lanternwisp',p:s=>[s.wisps,1],rw:'SCOUT joins'},
 {id:'t4',n:'UP SINCE 4',d:'Last 4:00 on one expedition',p:s=>[s.maxT,240],rw:'MAMA joins',f:mmss},
 {id:'c1000',n:'A THOUSAND LIGHTS',d:'Calm 1000 buddies in all',p:s=>[s.calm,1000],rw:'LUCKY sprouts join the swarm'},
 {id:'w5',n:'FULL BLOOM',d:'Get any sprout kind to LV 5',p:s=>[s.maxW,5],rw:'RANGER joins'},
 {id:'su5',n:'SHOWTIME',d:'Use a SUPER 5 times',p:s=>[s.supers,5],rw:'CORBIN joins'},
 {id:'wake',n:'IT STIRS',d:'Be there when the Guardian wakes',p:s=>[s.wake,1],rw:'MOON PEBBLE can be found'},
 {id:'win',n:'THE HOLLOW REMEMBERS',d:'Light the Guardian',p:s=>[s.wins,1],rw:'KING BIBI joins'},
 {id:'win3',n:'EVERYBODY HELPS',d:'Light the Guardian with 3 keepers',p:s=>[Object.keys(s.winsBy).length,3],rw:'LIL BOTTIE joins. Somehow.'},
 {id:'fall3',n:'IT KEEPS A LITTLE',d:'Have the light go out 3 times',p:s=>[s.falls,3],rw:'SOUL LAMP can be found'},
 {id:'big5',n:'BIG FRIENDS',d:'Calm 5 big buddies in all',p:s=>[s.bigs,5],rw:'BESSLING can be found'},
 {id:'wisp3',n:'SHE KNOWS YOU NOW',d:'Catch 3 Lanternwisps in all',p:s=>[s.wisps,3],rw:'OLD KEY can be found'},
 {id:'lv20',n:'FULL SWARM',d:'Reach level 20 on one expedition',p:s=>[s.maxLv,20],rw:'GRASSKIN can be found'},
 {id:'t430',n:'NIGHT BLOOM',d:'Last 4:30 on one expedition',p:s=>[s.maxT,270],rw:'MOONBLOOM can be found',f:mmss},
 {id:'su15',n:'ENCORE',d:'Use a SUPER 15 times',p:s=>[s.supers,15],rw:'STAR CHIP can be found'},
 {id:'c2500',n:'SOMETHING IN THE LAKE',d:'Calm 2500 buddies in all',p:s=>[s.calm,2500],rw:"BESSIE'S SCALE can be found"},
 {id:'win2',n:'TWO STONES',d:'Light the Guardian twice',p:s=>[s.wins,2],rw:'SIGIL STONE can be found'},
 {id:'c5000',n:'KEEPER OF THE VALLEY',d:'Calm 5000 buddies in all',p:s=>[s.calm,5000],rw:'+60 seeds',seeds:60}];
const KIND_GOAL={1:'t3',4:'lv10',5:'c1000'},ITEM_GOAL={louie:'first',moon:'wake'};
const has=id=>!id||!!SV.done[id],heroOpen=h=>has(h.goal);
function checkGoals(){const o=[];for(const q of GOALS){if(SV.done[q.id])continue;const[a,b]=q.p(SV.stat);if(a>=b){SV.done[q.id]=1;if(q.seeds)SV.seeds+=q.seeds;o.push(q)}}return o}
/* mastery: each keeper has five ranks of their own, earned by buddies calmed as them */
const MR=[0,200,600,1500,3000],MRW=['','+10 light','A second SUPER to choose','Starts with one more pick','Leads with a LV 2 sprout'];
/* keeper rank: one for the whole save, from every buddy ever calmed. Each rank pays seeds. (Sprouts has a Keeper Rank too.) */
const krOf=c=>{let k=1,need=120;while(c>=need){c-=need;k++;need+=90}return[k,c,need]},krPay=k=>3+k;
const supOf=h=>rankOf(h.id)>=3&&SV.sup[h.id]?1:0,supName=(h,k)=>k?h.s2:h.su;
const rankOf=id=>{const c=SV.mast[id]||0;let k=1;for(let i=1;i<MR.length;i++)if(c>=MR[i])k=i+1;return k};

/* ---------- the dark ---------- */
const EN={
 CINDERCAP:{hp:10,spd:24,dmg:7,r:7,sz:18,xp:1},
 ZIPWIG:{hp:7,spd:50,dmg:6,r:6,sz:16,xp:1,ai:'zig'},
 CLOVERIMP:{hp:12,spd:36,dmg:7,r:6,sz:16,xp:1},
 DRIZZLET:{hp:16,spd:30,dmg:7,r:7,sz:18,xp:1},
 PEBBLIT:{hp:46,spd:15,dmg:12,r:9,sz:22,xp:3},
 FERNFANG:{hp:24,spd:26,dmg:11,r:8,sz:20,xp:2,ai:'charge'},
 MELONKIN:{hp:32,spd:32,dmg:10,r:8,sz:20,xp:2},
 BOULDERHOUND:{hp:360,spd:29,dmg:15,r:14,sz:40,xp:0,elite:1},
 BLOOMBOAR:{hp:700,spd:33,dmg:17,r:15,sz:44,xp:0,elite:1},
 LANTERNWISP:{hp:40,spd:60,dmg:0,r:8,sz:20,xp:0,ai:'flee',wisp:1},
 PYTHORN:{hp:4200,spd:27,dmg:18,r:22,sz:64,xp:0,boss:1,ai:'boss'}};
const BOSS_AT=300,PLACE='CROOKED HOLLOW';

/* ---------- sprites: buddies come from Sproutwild's own art, dimmed for the dark ---------- */
const SPR={};
function bspr(id,sz,mode,fl){const k=id+'|'+sz+'|'+mode+'|'+(fl?1:0);if(SPR[k])return SPR[k];let src=null;try{const s=A.bud(id);src=s&&(s.ol||s.img)}catch(e){}
 const c=document.createElement('canvas'),S=sz*2;c.width=c.height=S;const x=c.getContext('2d');if(!x||!x.fillRect)return SPR[k]=c;
 if(src&&src.width){x.imageSmoothingEnabled=true;if(fl){x.translate(S,0);x.scale(-1,1)}x.drawImage(src,0,0,S,S);x.setTransform(1,0,0,1,0,0);
  if(mode){x.globalCompositeOperation='source-atop';x.fillStyle=mode===1?'rgba(26,16,72,.6)':'#ffffff';x.fillRect(0,0,S,S)}}
 else{x.fillStyle=mode===2?'#ffffff':mode?'#3a3060':'#98a0b0';x.fillRect(S*.2,S*.3,S*.6,S*.6)}
 return SPR[k]=c}
function sprout(x,y,t,hop=0,big=0){const T=TY[t];x=Math.round(x);y=Math.round(y-hop);
 if(big){r(K,x-4,y-8,9,9);r(T.d,x-3,y-7,7,7);r(T.c,x-2,y-6,5,5);r(T.l,x-2,y-6,2,1);r('#2c6030',x,y-11,1,3);r('#70d850',x,y-12,3,1);r('#70d850',x+1,y-13,2,1);r(K,x-2,y-4,1,2);r(K,x+1,y-4,1,2);return}
 r(T.d,x-2,y-5,5,5);r(T.c,x-1,y-4,3,3);r(T.l,x-1,y-4,1,1);r('#2c6030',x,y-7,1,2);r('#70d850',x,y-8,2,1);r(K,x-1,y-3,1,1);r(K,x+1,y-3,1,1)}
function sprout2(x,y,t,hop){g.save();g.translate(Math.round(x),Math.round(y));g.scale(2,2);sprout(0,0,t,hop?.5:0,1);g.restore()}
function ricon(id,x,y){ /* 12 x 12 pictures for the finds */
 const q=RL.find(o=>o.id===id);if(q&&q.bud){g.drawImage(bspr(q.bud,14,0,0),x-1,y-1,14,14);return}
 if(id==='shard'){r(K,x+3,y,7,12);r('#f8e060',x+4,y+1,5,10);r('#fff8c0',x+5,y+2,2,5);r('#f8a030',x+7,y+6,2,5)}
 else if(id==='datac'){r(K,x+1,y+1,10,10);r('#2a3040',x+2,y+2,8,8);for(let j=0;j<3;j++){r('#40a0ff',x+3,y+3+j*3,3,1);r('#40ff90',x+7,y+3+j*3,2,1)}}
 else if(id==='coin'){r(K,x+2,y+2,9,9);r('#f8d030',x+3,y+3,7,7);r('#fff8a0',x+4,y+4,2,2);r('#c89010',x+6,y+5,1,3)}
 else if(id==='feather'){r(K,x+2,y+1,6,9);r('#60b8f8',x+3,y+2,4,7);r('#e0f8ff',x+4,y+3,1,5);r(K,x+7,y+8,3,3);r('#e0f8ff',x+8,y+9,1,1)}
 else if(id==='lamp'){r(K,x+2,y+1,8,11);r('#585070',x+3,y+2,6,2);r('#a8c8ff',x+3,y+4,6,6);r('#ffffff',x+5,y+5,2,3);r('#585070',x+3,y+10,6,1)}
 else if(id==='key'){r(K,x+1,y+2,6,6);r('#c8a040',x+2,y+3,4,4);r(K,x+3,y+4,2,2);r(K,x+6,y+4,6,3);r('#c8a040',x+6,y+5,5,1);r('#c8a040',x+9,y+6,1,2)}
 else if(id==='chip'){r('#ffffff',x+5,y,2,12);r('#ffffff',x,y+5,12,2);r('#f8e060',x+3,y+3,6,6);r('#ffffff',x+4,y+4,4,4)}
 else if(id==='moonb'){r('#2c6030',x+5,y+6,2,6);r(K,x+1,y,10,8);r('#a8c8ff',x+2,y+1,8,6);r('#ffffff',x+4,y+2,4,3)}
 else if(id==='scale'){r(K,x+1,y+2,10,9);r('#30a898',x+2,y+3,8,7);r('#78e0c8',x+3,y+4,4,2);r('#207868',x+5,y+7,4,2)}
 else if(id==='sigil'){r(K,x+2,y,8,12);r('#98a0b0',x+3,y+1,6,10);r('#58c048',x+4,y+2,4,2);r('#f8e060',x+4,y+5,4,4);r('#fff8c0',x+5,y+6,2,2)}}
function icon(id,x,y){ /* 12 x 12 pictures for the things from home */
 if(id==='louie'){try{g.drawImage(A.LOU.r[0],x-4,y)}catch(e){r('#e89040',x,y+3,12,7)}}
 else if(id==='oil'){r(K,x+2,y,8,12);r('#f8e060',x+3,y+3,6,8);r('#fff8c0',x+4,y+5,2,4);r('#c04848',x+3,y+1,6,2)}
 else if(id==='boots'){r(K,x+1,y+1,6,10);r('#a86838',x+2,y+2,4,8);r(K,x+1,y+7,10,5);r('#a86838',x+2,y+8,8,3);r('#e8c888',x+2,y+2,4,1)}
 else if(id==='bell'){r(K,x+2,y+1,8,9);r('#f8e060',x+3,y+2,6,7);r('#fff8a0',x+4,y+3,1,3);r(K,x+1,y+9,10,2);r('#c89010',x+2,y+9,8,1);r('#c89010',x+5,y+11,2,1)}
 else if(id==='wrench'){r(K,x+1,y+1,5,5);r('#98a0b0',x+2,y+2,3,3);r(K,x+3,y+1,1,2);r(K,x+4,y+4,7,7);r('#98a0b0',x+5,y+5,2,2);r('#98a0b0',x+7,y+7,2,2);r('#dce2ea',x+9,y+9,1,1)}
 else if(id==='tea'){r(K,x+1,y+4,9,7);r('#f0f0f8',x+2,y+5,7,5);r('#58b848',x+2,y+5,7,2);r(K,x+9,y+5,3,4);r('#f0f0f8',x+10,y+6,1,2);r('#c8c0d8',x+4,y+1,1,2);r('#c8c0d8',x+6,y,1,3)}
 else if(id==='moon'){r(K,x+2,y+2,9,9);r('#a8c8ff',x+3,y+3,7,7);r('#ffffff',x+4,y+4,2,2);r('#7898d8',x+7,y+7,2,2)}
 else if(id==='berry'){r(K,x+2,y+3,8,8);r('#e23b5e',x+3,y+4,6,6);r('#ff8aa0',x+4,y+5,2,1);r('#2c6030',x+5,y+1,2,3)}
 else if(id==='nectar'){r(K,x+2,y+2,8,10);r('#f8c020',x+3,y+4,6,7);r('#fff8a0',x+4,y+5,2,3);r('#a8d8ff',x+3,y+3,6,1);r('#805018',x+4,y,4,2)}
 else if(id==='acorn'){r(K,x+1,y+1,10,6);r('#9a5a2c',x+2,y+2,8,4);r('#c88848',x+3,y+2,4,1);r(K,x+2,y+6,8,5);r('#e8c888',x+3,y+6,6,4);r(K,x+5,y,2,2)}
 else if(id==='seed'){r(K,x+3,y+2,6,9);r('#f8e060',x+4,y+3,4,7);r('#fff8c0',x+5,y+4,1,3);r('#70d850',x+5,y,2,2)}}
const WOUT=new Map();function outl(sp){let c=WOUT.get(sp);if(!c){c=document.createElement('canvas');c.width=sp.width;c.height=sp.height;const x=c.getContext('2d');if(x&&x.drawImage){x.drawImage(sp,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff8c0';x.fillRect(0,0,c.width,c.height)}WOUT.set(sp,c)}return c}
const HG={
 derek:[['....kkkk....','..kkcccckk..','.kcccccccck.','.kCCCCCCCCk.','.kffffffffk.','.kfkffffkfk.','.kffffffffk.','.kfrrrrrrfk.','..kkkkkkkk..','.kttttttttk.','.ktTtwwtTtk.','..kttttttk..','..kbbkkbbk..','..kkk..kkk..'],{k:'#282038',c:'#383048',C:'#585070',f:'#f0c8a0',r:'#7a5030',t:'#1c64c8',T:'#5a9cf0',w:'#f4f4f0',b:'#28324a'}],
 bibi:[['...y.yy.y...','...kyyyyk...','..kwwwwwwk..','.kwwffffwwk.','.kwffffffwk.','.kfkffffkfk.','.kffffffffk.','.kkffmmffkk.','..kkkkkkkk..','.knnwrrwnnk.','.knnnrrnnnk.','..knnnnnnk..','..knnkknnk..','..kkk..kkk..'],{k:'#282038',y:'#f8d030',w:'#f0f0f4',f:'#e6b48e',m:'#8a4840',n:'#24304c',r:'#c02030'}],
 mama:[['....kkkk....','...kddddk...','..kdDddddk..','.kddddddddk.','.kdffffffdk.','.kdfkffkfdk.','.kdffffffdk.','.kddffffddk.','.kdkttttkdk.','.kkttttttkk.','..kttttttk..','..kjjjjjjk..','..kjjkkjjk..','..kkk..kkk..'],{k:'#282038',d:'#2e1e1a',D:'#4e342a',f:'#e8b890',t:'#7a2434',j:'#34486c'}],
 corbin:[['....kkkk....','...khhhhk...','..khhhhhhk..','.khhhhhhhhk.','.kssssssssk.','.kskssssksk.','.kssssssssk.','.kksspssskk.','..kkkkkkkk..','.kppppppppk.','.kppPppPppk.','..kppppppk..','..krrkkrrk..','..kkk..kkk..'],{k:'#282038',h:'#1c1410',s:'#b07850',p:'#d83c8c',P:'#f078a8',r:'#c02030'}]};
const HSP={};
/* a keeper's field sprite: Will has four facings; the rest are the models the other cartridges already use, or drawn here in the same style */
function heroSpr(h,fx=0,fy=1){if(h.id==='will'){const S=A.will()||{};return Math.abs(fx)>Math.abs(fy)?(fx<0?S.pl:S.pr):(fy<0?S.pu:S.pd)}
 if(HSP[h.id])return HSP[h.id];let c=null;try{if(h.spr)c=A.CHS[h.spr];else if(h.sw){const q=A.swchr()[h.sw],o=q.ol;c=document.createElement('canvas');c.width=14;c.height=Math.round(14*q.oh/q.ow);const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(o,0,0,c.width,c.height)}else if(HG[h.id])c=A.mk(HG[h.id][0],HG[h.id][1])}catch(e){}
 return HSP[h.id]=c}
function drawHero(h,x,y,fx,fy,bob=0,sc=1){const sp=heroSpr(h,fx,fy);if(!sp){r('#30a898',x-4,y-12,8,12);return}const w=sp.width*sc,hh=sp.height*sc,X=Math.round(x-w/2),Y=Math.round(y-hh-bob);
 if(!h.sw){const o=outl(sp);g.drawImage(o,X-1,Y,w,hh);g.drawImage(o,X+1,Y,w,hh);g.drawImage(o,X,Y-1,w,hh);g.drawImage(o,X,Y+1,w,hh)}g.drawImage(sp,X,Y,w,hh)}
function headOf(h){try{const K_=A.ko();if(h.ko&&K_){const c=K_.CH.find(q=>q.id===h.ko);if(c&&c.head)return c.head}}catch(e){}return heroSpr(h,0,1)}

/* ---------- the ground: one moonlit meadow pattern, repeated, with odd things scattered by a hash ---------- */
let GP=null;
function ground(){if(GP)return GP;GP=document.createElement('canvas');GP.width=GP.height=256;const x=GP.getContext('2d');if(!x||!x.fillRect)return GP;
 const p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};let s=7;const rn=()=>{s=(s*16807)%2147483647;return s/2147483647};
 p('#4a9e50',0,0,256,256);for(let i=0;i<70;i++){const X=4+rn()*236,Y=4+rn()*236;p('#429048',X|0,Y|0,(10+rn()*18)|0,(6+rn()*10)|0)}
 for(let i=0;i<230;i++){const X=(2+rn()*250)|0,Y=(3+rn()*250)|0;p('#2f7a3c',X,Y,2,1);p('#2f7a3c',X,Y-1,1,1)}
 for(let i=0;i<120;i++)p('#78c868',(1+rn()*253)|0,(1+rn()*253)|0,1,1);
 for(let i=0;i<16;i++){const X=(6+rn()*240)|0,Y=(6+rn()*240)|0,c=['#ffffff','#f8a0c8','#f8e060'][i%3];p(c,X-1,Y,3,1);p(c,X,Y-1,1,3);p('#f8d040',X,Y,1,1)}
 for(let i=0;i<9;i++){const X=(8+rn()*236)|0,Y=(8+rn()*236)|0;p('#b89858',X,Y,5,2);p('#d8b878',X+1,Y,3,1)}
 return GP}
const hsh=(a,b)=>{let h=(a*73856093)^(b*19349663);h=(h^(h>>>13))*1274126177;return(h^(h>>>16))>>>0};
function props(cx,cy,glow){const x0=Math.floor(cx/72)-1,y0=Math.floor(cy/72)-1;
 for(let j=y0;j<=y0+Math.ceil(H/72)+1;j++)for(let i=x0;i<=x0+5;i++){const h=hsh(i,j);if(h%5>1)continue;const x=Math.round(i*72+(h>>4)%60-cx),y=Math.round(j*72+(h>>10)%60-cy),k=(h>>16)%6;
  if(glow){if(k===2)glow(x+2,y-2,11,.55);continue}
  if(k===0){r('rgba(0,0,0,.25)',x-6,y+1,13,3);r(K,x-6,y-7,13,9);r('#8088a0',x-5,y-6,11,7);r('#a0a8bc',x-5,y-6,8,2);r('#6c7488',x-1,y-2,4,1)}
  else if(k===1){r('rgba(0,0,0,.25)',x-5,y+1,11,3);r(K,x-5,y-6,11,8);r('#8a5a3a',x-4,y-5,9,6);r('#c89860',x-4,y-5,9,2);r('#a87848',x-2,y-5,5,1)}
  else if(k===2){r(K,x,y-5,5,6);r('#d0f8ff',x+1,y-1,3,2);r('#2890a8',x-1,y-5,7,3);r('#60d8e8',x,y-6,5,3);r('#d0f8ff',x+1,y-5,1,1)}
  else if(k===3){r('rgba(0,0,0,.22)',x-7,y+1,15,3);r(K,x-7,y-8,15,10);r('#2c7848',x-6,y-7,13,8);r('#3c9858',x-5,y-7,9,4);r('#e23b5e',x-3,y-4,2,2);r('#e23b5e',x+3,y-2,2,2);r('#e23b5e',x,y-6,2,2)}
  else if(k===4){for(let q=0;q<4;q++){const fx=x-6+q*4,fy=y-(q%2)*3;r('#2c6030',fx,fy-3,1,4);r(['#f8a0c8','#ffffff','#f8e060','#a070e8'][q],fx-1,fy-5,3,2)}}
  else{r('rgba(0,0,0,.25)',x-3,y+1,7,2);r(K,x-2,y-16,4,18);r('#805030',x-1,y-15,2,16);r(K,x-5,y-15,10,5);r('#585070',x-4,y-14,8,3);r(K,x+2,y-10,5,6);r('#6c6488',x+3,y-9,3,4)}}}

/* ---------- state ---------- */
const G={s:'title',mi:0,t:0,si:0,ui:0,ci:0,pi:0,lock:0,cards:[],gift:0,note:'',noteT:0,rep:null,ip:0};
let RN=null,sT={};
const say=(k,gap,f)=>{const n=G.t;if((sT[k]||0)>n)return;sT[k]=n+gap;f()};
function newRun(hid){const h=heroOf(hid),rk=rankOf(h.id),st=h.st,hp=h.hp+15*SV.up.glass+(rk>=2?10:0)+(h.id==='ranger'?0:0);
 RN={t:0,h,P:{x:0,y:0,fx:0,fy:1,mv:0,inv:0},hp,max:hp,xp:0,need:6,lv:1,calm:0,elites:0,seeds:0,
  w:[0,0,0,0,0,0],wt:[0,0,0,0,0,0],p:{louie:0,oil:0,boots:0,bell:0,wrench:0,tea:0,moon:0,nectar:0,acorn:0},
  en:[],pr:[],ep:[],mo:[],fx:[],pa:[],it:[],sw:[],fr:[],zl:[],pt:[],lob:[],st:[],su:[],
  spT:1,ev:{},aCd:0,bCd:0,ch:null,wh:0,ring:null,shake:0,freeze:0,queue:SV.up.head+(rk>=4?1:0),rr:SV.up.reroll,boss:null,won:0,dead:0,lou:null,cam:{x:-W/2,y:-H/2},ban:null,tip:0,start:h.id,hurtT:0,dmgTaken:0,
  sm:0,smNeed:160,sk:supOf(h),r:{},rq:0,rad:null,radQ:[],pop:null,cheer:0,idleT:22,stamp:0,spy:0,wl:0,bigDome:0,lampUsed:0,rdyPop:0,say:null,sayT:0,dome:0,domeCd:0,gT:0,bigs:0,wisps:0,supers:0,woke:0,notes:0};
 RN.w[st]=rk>=5?2:1;syncSwarm();SV.runs++;SV.hero=h.id;store();banner('EXPEDITION: '+PLACE,'CARRY THE LIGHT. THE SPROUTS DO THE THROWING.',4);quip('go',1)}
/* the radio from Sunkeep: somebody back home (never the keeper you are playing), a face and a line */
function radio(who,alt,s){const N=RN;if(!N)return;const id=N.h.id===who?alt:who;if(!id||id===N.h.id)return;N.radQ.push({h:heroOf(id),s});if(N.radQ.length>3)N.radQ.shift()}
const RADIO=[[18,'erin','marcus','SUNKEEP HERE. WE CAN SEE YOUR LIGHT FROM THE GATE.'],[75,'marcus','derek','FLOW PROS NEVER HAD A JOB LIKE THIS, BRO.'],[105,'scout','erin','THEY ARE NOT ANGRY. THEY JUST CANNOT SEE.'],
 [150,'bibi','erin','CITIZENS. THE DOME STAYS UP. TEMPORARILY.'],[195,'ranger','erin','EVERY PLACE HAS A GUARDIAN. THIS ONE SLEEPS ON A TRUNK.'],[225,'bottie','marcus','BZZT. NICE LIGHT. IT WOULD LOOK GOOD ON MY FEED.'],
 [262,'erin','will','IT SLIPPED OFF A CIRCUS TRAIN IN 1944. IT NEVER STOPPED GROWING.'],[284,'marcus','derek','FOUR GUARDIANS, FOUR SIGILS. THIS IS ONE OF THEM, BRO.']];
/* one voice at a time, never over a banner */
function quip(k,force){const N=RN;if(!N||!N.h.q[k])return;if(!force&&(N.sayT>0||Math.random()<.35))return;N.say={s:pick(N.h.q[k]),t:2.6};N.sayT=force?4:9}
const banner=(a,b,t=3)=>{RN.ban={a,b,t,T:t}};
const mul=()=>{const i=RN.h.id,q=RN.r;return{dmg:(1+.12*RN.p.wrench)*(i==='marcus'?1.15:1)*(q.moonb&&RN.hp<RN.max*.34?1.4:1)*(RN.spy>0?2:1),cd:Math.pow(.92,RN.p.moon)*(i==='mama'?.85:1),wcd:i==='will'?.9:1,spd:60*(1+.05*SV.up.boots)*(1+.08*RN.p.boots)*(i==='derek'?1.15:i==='mama'?1.08:i==='ranger'?.92:1)*(q.feather?1.12:1),reach:26*(1+.2*SV.up.pockets)*(1+.3*RN.p.bell)*(i==='scout'?1.4:1),mote:(1+(RN.w[5]>=4?.3:RN.w[5]>=2?.15:0))*(i==='scout'?1.12:1)*(1+.08*RN.p.nectar)*(q.coin?1.1:1)}};
function syncSwarm(){const N=RN,want=[];for(let t=0;t<6;t++)for(let i=0;i<(N.w[t]?N.w[t]+1:0);i++)want.push(t);
 while(N.sw.length<want.length){const t=want[N.sw.length];N.sw.push({t,x:N.P.x+R(-8,8),y:N.P.y+R(-8,8),a:R(0,TAU),i:N.sw.length})}
 N.sw.forEach((s,i)=>{s.t=want[i];s.i=i})}

/* ---------- spawning: the dark comes in waves, thicker by the minute ---------- */
function spawn(id,x,y){const N=RN,D=EN[id],k=1+N.t/85+Math.pow(N.t/165,2),a=N.P.mv&&Math.random()<.5?Math.atan2(N.P.fy,N.P.fx)+R(-1.1,1.1):R(0,TAU),d=Math.hypot(W,H)/2+24;
 const e={id,D,x:x===undefined?N.P.x+Math.cos(a)*d:x,y:y===undefined?N.P.y+Math.sin(a)*d:y,hp:D.hp*(D.boss||D.wisp?1:k),spd:D.spd*R(.9,1.1)*(D.boss?1:1+N.t/650),fl:0,kx:0,ky:0,stun:0,slow:0,a:R(0,TAU),dh:0,ph:0,pt:0,cd:R(1,2),fx:-1,life:D.wisp?16:0};
 e.max=e.hp;N.en.push(e);return e}
function ring(id,n,d=150){for(let i=0;i<n;i++){const a=i/n*TAU;spawn(id,RN.P.x+Math.cos(a)*d,RN.P.y+Math.sin(a)*d)}}
function pickType(t){const w=[['CINDERCAP',t<200?10:4],['ZIPWIG',t>30?4:0],['CLOVERIMP',t>60?3:0],['PEBBLIT',t>90?2:0],['FERNFANG',t>150?3:0],['DRIZZLET',t>180?2:0],['MELONKIN',t>210?5:0]];
 let s=0;for(const q of w)s+=q[1];let x=Math.random()*s;for(const q of w){x-=q[1];if(x<0)return q[0]}return'CINDERCAP'}
const EVENTS=[[45,'wisp'],[60,'pack'],[120,'elite1'],[150,'pack'],[180,'ringD'],[205,'wisp'],[240,'elite2'],[270,'pack2'],[BOSS_AT,'boss']];
function director(dt){const N=RN,t=N.t;
 for(const [at,k] of EVENTS)if(t>=at&&!N.ev[at]){N.ev[at]=1;
  if(k==='wisp'){spawn('LANTERNWISP');banner('A LANTERNWISP!','CATCH HER LIGHT FOR A GIFT',2.5);snd(1319,.12,1760,'sine',.05)}
  else if(k==='pack'){const a=R(0,TAU);for(let i=0;i<10;i++)spawn('CLOVERIMP',N.P.x+Math.cos(a)*170+R(-24,24),N.P.y+Math.sin(a)*170+R(-24,24))}
  else if(k==='pack2'){for(let q=0;q<3;q++){const a=R(0,TAU);for(let i=0;i<8;i++)spawn('ZIPWIG',N.P.x+Math.cos(a)*175+R(-24,24),N.P.y+Math.sin(a)*175+R(-24,24))}}
  else if(k==='ringD'){ring('DRIZZLET',18,160);banner('THEY ARE ALL AROUND YOU','B: WHISTLE SHOVES THEM BACK',2.5);snd(196,.3,98,'sawtooth',.05)}
  else if(k==='elite1'||k==='elite2'){spawn(k==='elite1'?'BOULDERHOUND':'BLOOMBOAR');banner('A BIG ONE',(k==='elite1'?'BOULDERHOUND':'BLOOMBOAR')+' HAS FORGOTTEN THE MOST',2.5);snd(147,.35,73,'sawtooth',.06)}
  else if(k==='boss'){N.boss=spawn('PYTHORN');N.boss.cd=2.5;banner('A DIM GUARDIAN STIRS','PYTHORN, GUARDIAN OF '+PLACE,3.5);N.woke=1;N.sayT=0;later(()=>{if(RN===N)quip('boss',1)},3600);N.shake=.5;snd(98,.6,49,'sawtooth',.08);later(()=>snd(73,.7,37,'sawtooth',.08),300)}}
 if(N.won)return;const rate=(1+t/27)*(N.boss?.5:1),cap=N.boss?90:140;
 N.spT-=dt;while(N.spT<=0){N.spT+=1/rate;if(N.en.length<cap)spawn(pickType(t))}}

/* ---------- light on a buddy ---------- */
function hit(e,dmg,kx=0,ky=0,quiet){const N=RN;if(e.gone)return;e.hp-=dmg*mul().dmg*(N.r.sigil&&(e.D.elite||e.D.boss)?1.3:1);if(!quiet)e.fl=.07;const kb=e.D.boss?0:e.D.elite?.25:1;e.kx+=kx*kb;e.ky+=ky*kb;
 if(e.hp<=0)calm(e);else say('hit',.05,()=>snd(R(420,520),.03,0,'square',.02))}
function calm(e){const N=RN;if(e.gone)return;e.gone=1;N.calm++;const D=e.D;N.sm=Math.min(N.smNeed,N.sm+(D.elite?12:1)*(N.r.chip?1.3:1));if(N.calm%100===0){N.pop={s:N.calm+' HOME',t:0};snd(1047,.08);later(()=>snd(1319,.15),80)}if(N.notes>0&&D.xp)mote(e.x+R(-5,5),e.y+R(-5,5),1);if(N.h.id==='corbin'&&!D.boss&&Math.random()<.06)N.it.push({k:'heart',x:e.x,y:e.y,t:0});
 N.fx.push({k:'calm',id:e.id,sz:D.sz,x:e.x,y:e.y,t:0,ax:e.x-N.P.x,ay:e.y-N.P.y,big:D.elite||D.boss});
 for(let i=0;i<(D.elite?12:5);i++)N.pa.push({x:e.x,y:e.y-6,vx:R(-50,50),vy:R(-70,-10),l:R(.3,.6),c:pick(['#fff8a0','#f8e060','#ffffff'])});
 if(D.boss){win();return}
 if(D.xp)mote(e.x,e.y,D.xp);if(D.xp&&N.w[5]&&Math.random()<.12)mote(e.x+R(-6,6),e.y+R(-6,6),1);
 if(D.elite){N.elites++;N.bigs++;quip('big',1);if(N.bigs===1)radio('ranger','erin','BIG ONE OFF THE PATH. IT HAD FORGOTTEN THE MOST.');N.it.push({k:'chest',x:e.x,y:e.y,t:0});for(let i=0;i<8;i++)mote(e.x+R(-16,16),e.y+R(-16,16),2);if(N.fr.filter(f=>!f.sm&&!f.star).length<2)N.fr.push({id:e.id,x:e.x,y:e.y,cd:1,tg:null,fx:-1});N.freeze=.08;N.shake=.3;
  banner(e.id+' REMEMBERS','IT WALKS WITH YOU NOW',2.5);snd(523,.1);later(()=>snd(784,.1),90);later(()=>snd(1047,.22),180)}
 else if(D.wisp){N.wisps++;radio('scout','erin','YOU CAUGHT HER LIGHT. I HAVE NEVER MANAGED THAT.');N.it.push({k:'chest',x:e.x,y:e.y,t:0});snd(1319,.1,1976,'sine',.05)}
 else{if(Math.random()<(N.h.id==='erin'?.036:.012))N.it.push({k:'berry',x:e.x,y:e.y,t:0});say('calm',.045,()=>snd(R(700,980),.05,R(1100,1400),'sine',.03))}}
function mote(x,y,v){const N=RN;if(N.mo.length>240){const o=N.mo[RI(60)];o.v+=v;return}N.mo.push({x,y,v,pull:0,a:R(0,TAU)})}
function hurt(d){const N=RN;if(N.P.inv>0||N.won||N.dead)return;if(N.h.id==='bibi'&&N.domeCd<=0){N.domeCd=14;N.P.inv=.8;N.dome=.5;snd(880,.12,440,'triangle',.05);N.fx.push({k:'txt',s:'DOME',x:N.P.x,y:N.P.y-18,t:0,c:'#a8c8ff'});return}const lo0=N.hp<N.max*.3;d*=1-.08*N.p.acorn;N.hp-=d;N.dmgTaken+=d;N.P.inv=.7;N.shake=.25;N.hurtT=.3;noise(.09,.4,500,'lowpass');snd(180,.12,90,'square',.05);
 if(N.hp<=0&&N.r.lamp&&!N.lampUsed){N.lampUsed=1;N.hp=N.max*.5;N.P.inv=2.5;N.fx.push({k:'flash',x:N.P.x,y:N.P.y,t:0});N.wh=.5;for(const e of N.en){const dx=e.x-N.P.x,dy=e.y-N.P.y,q=Math.hypot(dx,dy)||1;if(q<110){e.kx+=dx/q*260;e.ky+=dy/q*260;e.stun=1.5}}banner('THE SOUL LAMP','IT KEPT A LITTLE LIGHT FOR YOU',3);radio('erin','marcus','THE LAMP GAVE IT BACK. DO NOT WASTE IT.');snd(523,.15);later(()=>snd(784,.3),140)}
 else if(N.hp<=0){N.hp=0;N.dead=.001;snd(220,.5,55,'sine',.08)}else if(!lo0&&N.hp<N.max*.3)quip('low',1)}
function gain(v){const N=RN;N.xp+=v*mul().mote;say('mote',.035,()=>snd(1320+Math.min(600,N.xp/N.need*600),.03,0,'sine',.025));
 while(N.xp>=N.need){N.xp-=N.need;N.lv++;N.need=Math.round(5+N.lv*5+N.lv*N.lv*.2);N.queue++;if(N.lv%5===0)N.rq++;quip('lv');N.cheer=.9;N.fx.push({k:'lvl',x:N.P.x,y:N.P.y,t:0});N.fx.push({k:'txt',s:'LEVEL '+N.lv,x:N.P.x,y:N.P.y-22,t:0,c:'#a8f080'})}}
function win(){const N=RN;N.won=.001;N.boss=null;N.freeze=.25;N.shake=.6;N.ep.length=0;for(const e of N.en)if(!e.gone)later(()=>{if(RN===N)calm(e)},R(100,900));
 snd(523,.12);later(()=>snd(659,.12),120);later(()=>snd(784,.12),240);later(()=>snd(1047,.5),360);banner('PYTHORN REMEMBERS','ITS SIGIL STONE GOES HOME TO THE LANTERN',5);later(()=>{if(RN===N)quip('win',1)},1500)}

/* ---------- the cards ---------- */
function options(){const N=RN,o=[];for(let t=0;t<6;t++)if(N.w[t]<5&&(N.w[t]>0||has(KIND_GOAL[t])))o.push({k:'w',t,lv:N.w[t]});for(const p of PS)if(N.p[p.id]<p.max&&has(ITEM_GOAL[p.id]))o.push({k:'p',p,lv:N.p[p.id]});return o}
function deal(){const N=RN;G.ct=0;
 if(N.rq>0){const o=RL.filter(q=>has(q.goal)&&!N.r[q.id]),c=[];while(c.length<3&&o.length){const q=pick(o);o.splice(o.indexOf(q),1);c.push({k:'r',r:q})}if(c.length){G.cards=c;G.ci=0;G.lock=.5;G.s='cards';G.find=1;snd(523,.1);later(()=>snd(784,.1),90);later(()=>snd(1047,.1),180);later(()=>snd(1568,.3),270);return}N.rq=0;if(N.queue<=0){G.s='play';return}}
 G.find=0;const o=options(),own=o.filter(q=>q.lv>0),c=[];
 /* at most four sprout kinds in a swarm, so a build takes shape */
 const kinds=N.w.filter(v=>v>0).length,ok=o.filter(q=>q.k!=='w'||q.lv>0||kinds<4);
 while(c.length<(N.r.datac?4:3)&&ok.length){const src=own.length&&Math.random()<.45?own.filter(q=>ok.includes(q)):ok;if(!src.length){own.length=0;continue}const q=pick(src);ok.splice(ok.indexOf(q),1);const j=own.indexOf(q);if(j>=0)own.splice(j,1);c.push(q)}
 if(!c.length)c.push({k:'b'});G.cards=c;G.ci=0;G.lock=.45;G.s='cards';snd(784,.08);later(()=>snd(988,.08),70);later(()=>snd(1319,.2),140)}
function take(c){const N=RN;if(c.k==='r'){const id=c.r.id;N.r[id]=1;N.rq--;if(c.r.bud)N.fr.push({id:c.r.bud,x:N.P.x,y:N.P.y+10,cd:.5,tg:null,fx:-1,star:1});N.fx.push({k:'lvl',x:N.P.x,y:N.P.y,t:0});snd(660,.06,990);if(N.rq>0||N.queue>0)deal();else{G.s='play';G.gift=0;N.P.inv=Math.max(N.P.inv,.6)}return}
 if(c.k==='w'){N.w[c.t]++;syncSwarm()}else if(c.k==='p'){N.p[c.p.id]++;if(c.p.id==='oil'){N.max+=20;N.hp=Math.min(N.max,N.hp+20)}if(c.p.id==='louie'&&!N.lou)N.lou={x:N.P.x-20,y:N.P.y,st:0,tg:null,n:0,v:0,fx:1}}else N.hp=Math.min(N.max,N.hp+30);
 N.queue--;snd(660,.06,990);if(N.queue>0)deal();else{G.s='play';G.gift=0;N.P.inv=Math.max(N.P.inv,.6)}}
const cardName=c=>c.k==='r'?c.r.n:c.k==='w'?WP[c.t].n:c.k==='p'?c.p.n:'BERRIES';
const cardSub=c=>c.k==='r'?'FIND':c.k==='b'?'':c.lv?'LV '+c.lv+' > '+(c.lv+1):'NEW';
const cardDesc=c=>c.k==='r'?c.r.d:c.k==='w'?(c.lv?WP[c.t].lv[c.lv]:WP[c.t].d):c.k==='p'?(c.p.lv?c.p.lv[c.lv]:c.p.d):'Everything is maxed. Eat. +30 light.';

/* ---------- update: play ---------- */
const near=(x,y,n,rad,skip)=>{const N=RN,o=[];for(const e of N.en){if(e.gone||(skip&&skip.has(e)))continue;const d=(e.x-x)*(e.x-x)+(e.y-y)*(e.y-y);if(d<rad*rad)o.push([d,e])}o.sort((a,b)=>a[0]-b[0]);return o.slice(0,n).map(q=>q[1])};
function weapons(dt){const N=RN,P=N.P,M=mul(),L=N.w,bz=N.boss&&!N.boss.gone&&Math.hypot(N.boss.x-P.x,N.boss.y-P.y)<125; /* with the Guardian close, the swarm goes for it */
 if(L[0]){N.wt[0]-=dt;if(N.wt[0]<=0){const lv=L[0],n=lv>=4?3:lv>=2?2:1,tg=near(P.x,P.y,n,150);if(bz&&!tg.includes(N.boss))tg[0]=N.boss;if(tg.length){N.wt[0]=(lv>=5?.62:.9)*M.cd*M.wcd;
   tg.forEach((e,i)=>{const d=Math.hypot(e.x-P.x,e.y-P.y)||1;N.pr.push({t:0,x:P.x,y:P.y-6,vx:(e.x-P.x)/d*175,vy:(e.y-P.y)/d*175,l:1.1,dmg:lv>=5?17:lv>=3?13:10,pc:lv>=3?1:0,hs:new Set(),a:0})});say('th',.08,()=>snd(620,.04,860,'square',.018))}}}
 if(L[1]){N.wt[1]-=dt;if(N.wt[1]<=0){const lv=L[1],n=lv>=5?3:lv>=3?2:1,c=N.en.filter(e=>!e.gone&&Math.abs(e.x-P.x)<115&&Math.abs(e.y-P.y)<115);if(c.length){N.wt[1]=2.5*M.cd*M.wcd;
   for(let i=0;i<n;i++){const e=bz&&i===0?N.boss:pick(c);N.lob.push({t:1,sx:P.x,sy:P.y-6,tx:e.x+e.kx*.1,ty:e.y,u:-i*.12,rad:(lv>=5?40:lv>=2?32:25)*(N.h.id==='ranger'?1.25:1),dmg:lv>=4?40:24})}}}}
 if(L[2]){const lv=L[2],n=lv>=5?6:lv>=4?5:lv>=2?4:3,rad=lv>=3?40:31,dmg=lv>=3?12:9,sp=lv>=5?3.6:2.7;
  for(let i=0;i<n;i++){const a=N.t*sp+i*TAU/n,x=P.x+Math.cos(a)*rad,y=P.y-4+Math.sin(a)*rad;for(const e of N.en)if(!e.gone&&e.dh<=0&&Math.abs(e.x-x)<e.D.r+5&&Math.abs(e.y-6-y)<e.D.r+5){e.dh=.3;hit(e,dmg,Math.cos(a)*110,Math.sin(a)*110)}}}
 if(L[3]){N.wt[3]-=dt;if(N.wt[3]<=0){const lv=L[3],n=lv>=5?8:lv>=4?6:lv>=2?4:3,first=bz?N.boss:near(P.x,P.y,1,125)[0];if(first){N.wt[3]=(lv>=3?1.7:2.2)*M.cd*M.wcd;const seen=new Set(),pts=[[P.x,P.y-6]];let e=first;
   for(let i=0;i<n&&e;i++){seen.add(e);pts.push([e.x,e.y-6]);hit(e,lv>=5?17:12);e=near(e.x,e.y,1,85,seen)[0]}N.zl.push({pts,t:.2});snd(1500,.07,500,'sawtooth',.02)}}}
 if(L[4]){N.wt[4]-=dt;if(N.wt[4]<=0){const lv=L[4];N.wt[4]=(lv>=5?2.2:4.2)*M.cd*M.wcd;N.pt.push({x:P.x,y:P.y,rad:lv>=3?34:25,t:0,dur:lv>=2?5.5:4,dps:lv>=4?15:9,tk:0});snd(392,.08,523,'sine',.03)}}
 if(L[5]){N.wt[5]-=dt;if(N.wt[5]<=0){const lv=L[5],n=lv>=5?3:lv>=3?2:1,c=N.en.filter(e=>!e.gone&&Math.abs(e.x-P.x)<118&&Math.abs(e.y-P.y)<Math.min(140,H/2));if(c.length){N.wt[5]=2.8*M.cd*M.wcd;for(let i=0;i<n;i++){const e=bz&&i===0?N.boss:pick(c);N.st.push({x:e.x,y:e.y,t:.42+i*.1,rad:lv>=5?24:16,dmg:30})}}}}
 if(N.h.id==='bottie'){N.gT-=dt;if(N.gT<=0){const e=near(P.x,P.y,1,140)[0];if(e){N.gT=.5;const d=Math.hypot(e.x-P.x,e.y-P.y)||1;N.pr.push({x:P.x,y:P.y-6,vx:(e.x-P.x)/d*230,vy:(e.y-P.y)/d*230,l:.8,dmg:6+N.lv*.4,pc:0,hs:new Set(),a:0,g:'bullet'})}}}
 /* things in flight */
 for(const p of N.pr){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;p.a+=dt*14;for(const e of N.en)if(!e.gone&&!p.hs.has(e)&&Math.abs(e.x-p.x)<e.D.r+3+(p.r||0)&&Math.abs(e.y-6-p.y)<e.D.r+4+(p.r||0)){p.hs.add(e);hit(e,p.dmg,p.vx*.35,p.vy*.35);if(p.pc-->0)continue;p.l=0;break}}
 N.pr=N.pr.filter(p=>p.l>0);
 for(const b of N.lob){b.u+=dt/.55;if(b.u>=1){b.done=1;N.fx.push({k:'thump',x:b.tx,y:b.ty,rad:b.rad,t:0});N.shake=Math.max(N.shake,.12);say('thump',.06,()=>{noise(.1,.35,300,'lowpass');snd(110,.1,55,'sine',.06)});
   for(const e of N.en){if(e.gone)continue;const dx=e.x-b.tx,dy=e.y-b.ty,d=Math.hypot(dx,dy);if(d<b.rad+e.D.r)hit(e,b.dmg,dx/(d||1)*130,dy/(d||1)*130)}}}
 N.lob=N.lob.filter(b=>!b.done);
 for(const s of N.st){s.t-=dt;if(s.t<=0){s.done=1;N.fx.push({k:'star',x:s.x,y:s.y,rad:s.rad,t:0});say('star',.06,()=>snd(1568,.09,784,'triangle',.04));for(const e of N.en)if(!e.gone&&Math.hypot(e.x-s.x,e.y-s.y)<s.rad+e.D.r)hit(e,s.dmg)}}
 N.st=N.st.filter(s=>!s.done);
 for(const q of N.pt){q.t+=dt;q.tk-=dt;const tick=q.tk<=0;if(tick)q.tk=.25;for(const e of N.en){if(e.gone)continue;if(Math.hypot(e.x-q.x,e.y-q.y)<q.rad+e.D.r){e.slow=.2;if(tick)hit(e,q.dps*.25,0,0,1)}}
  if(!q.cl&&Math.hypot(P.x-q.x,P.y-q.y)<q.rad)N.hp=Math.min(N.max,N.hp+(q.post?4:1.2)*dt)}
 N.pt=N.pt.filter(q=>q.t<q.dur);for(const z of N.zl)z.t-=dt;N.zl=N.zl.filter(z=>z.t>0)}
function enemies(dt){const N=RN,P=N.P;
 for(const e of N.en){if(e.gone)continue;const D=e.D;let dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
  if(e.fl>0)e.fl-=dt;if(e.dh>0)e.dh-=dt;if(e.slow>0)e.slow-=dt;if(e.dab>0)e.dab-=dt;e.a+=dt;
  if(!D.boss&&d>330){const a=R(0,TAU),q=Math.hypot(W,H)/2+24;e.x=P.x+Math.cos(a)*q;e.y=P.y+Math.sin(a)*q;continue}
  let vx=dx/d,vy=dy/d,sp=e.spd*(e.dab>0?.3:e.slow>0?.5:1);
  if(e.stun>0){e.stun-=dt;sp=0}
  else if(D.ai==='zig'){const s=Math.sin(e.a*5)*.9;vx+=-dy/d*s;vy+=dx/d*s}
  else if(D.ai==='charge'){e.cd-=dt;if(e.ph===0&&d<85&&e.cd<=0){e.ph=1;e.pt=.5;e.cx=vx;e.cy=vy}
   if(e.ph===1){sp=0;e.pt-=dt;if(e.pt<=0){e.ph=2;e.pt=.42}}else if(e.ph===2){vx=e.cx;vy=e.cy;sp=165;e.pt-=dt;if(e.pt<=0){e.ph=0;e.cd=2.6}}}
  else if(D.ai==='flee'){e.life-=dt;if(e.life<=0){e.gone=1;N.fx.push({k:'poof',x:e.x,y:e.y,t:0});continue}if(d<110){vx=-vx;vy=-vy}else{vx=Math.cos(e.a*.7);vy=Math.sin(e.a*.9);sp*=.4}}
  else if(D.ai==='boss')sp=bossAI(e,dt,dx/d,dy/d,d,sp);
  if(N.spy>0&&!D.boss){vx=Math.cos(e.a*.8+e.x);vy=Math.sin(e.a*.7+e.y);sp*=.5}
  if(D.ai==='boss'&&e.ph===2){vx=e.cx;vy=e.cy}
  e.x+=(vx*sp+e.kx)*dt;e.y+=(vy*sp+e.ky)*dt;const f=Math.pow(.004,dt);e.kx*=f;e.ky*=f;if(Math.abs(vx)>.2&&sp>0)e.fx=vx>0?1:-1;
  if(D.dmg&&d<D.r+6&&e.stun<=0&&N.spy<=0)hurt(D.dmg*(1+N.t/380))}
 /* shoulder room: buddies do not stand on each other */
 const E=N.en;for(let i=0;i<E.length;i++){const a=E[i];if(a.gone||a.D.boss)continue;for(let j=i+1;j<E.length;j++){const b=E[j];if(b.gone)continue;const dx=b.x-a.x,dy=b.y-a.y,m=a.D.r+b.D.r;if(Math.abs(dx)>=m||Math.abs(dy)>=m)continue;const d=Math.hypot(dx,dy)||.01;if(d<m){const k=(m-d)/d*.5*(b.D.boss?2:1);a.x-=dx*k;a.y-=dy*k;if(!b.D.boss){b.x+=dx*k;b.y+=dy*k}}}}
 N.en=E.filter(e=>!e.gone);
 for(const q of N.ep){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt;if(Math.abs(q.x-P.x)<6&&Math.abs(q.y-(P.y-5))<7){q.l=0;hurt(10)}}N.ep=N.ep.filter(q=>q.l>0)}
/* PYTHORN: slithers after you, winds up and charges along a line, throws rings of thorns, calls the Hollow */
function bossAI(e,dt,ux,uy,d,sp){const N=RN;
 if(e.ph===0){sp*=1+Math.max(0,N.t-BOSS_AT)/120; /* it gets angrier the longer you run from it */e.cd-=dt;if(e.cd<=0){const k=(e.n=(e.n||0)+1)%3;if(k===1){e.ph=1;e.pt=.85;e.cx=ux;e.cy=uy;snd(147,.3,220,'sawtooth',.05)}else if(k===2){e.ph=3;e.pt=.6}else{e.ph=4;e.pt=.5}}return sp}
 if(e.ph===1){e.pt-=dt;if(e.pt>.25){e.cx=ux;e.cy=uy}if(e.pt<=0){e.ph=2;e.pt=.75;noise(.2,.4,400,'lowpass')}return 0}
 if(e.ph===2){e.pt-=dt;if(e.pt<=0){e.ph=0;e.cd=e.hp<e.max*.5?1.5:2.3}return 215}
 if(e.ph===3){e.pt-=dt;if(e.pt<=0){const n=e.hp<e.max*.5?14:10,o=R(0,TAU);for(let i=0;i<n;i++){const a=o+i/n*TAU;N.ep.push({x:e.x,y:e.y-10,vx:Math.cos(a)*62,vy:Math.sin(a)*62,l:4})}snd(330,.15,165,'square',.04);e.ph=0;e.cd=2}return sp*.3}
 e.pt-=dt;if(e.pt<=0){ring('MELONKIN',6,120);snd(196,.2,131,'sawtooth',.04);e.ph=0;e.cd=2.4}return sp*.3}
function others(dt){const N=RN,P=N.P,M=mul();
 /* motes */
 for(const m of N.mo){m.a+=dt*4;const dx=P.x-m.x,dy=P.y-6-m.y,d=Math.hypot(dx,dy)||1;if(!m.pull&&!m.held&&d<M.reach)m.pull=1;if(m.pull){m.pull+=dt*5;const s=Math.min(d,(90+m.pull*60)*dt);m.x+=dx/d*s;m.y+=dy/d*s;if(d<7){m.done=1;gain(m.v)}}}
 N.mo=N.mo.filter(m=>!m.done);
 /* berries and gifts */
 for(const it of N.it){it.t+=dt;if(Math.hypot(P.x-it.x,P.y-it.y)<13){it.done=1;if(it.k==='berry'){N.hp=Math.min(N.max,N.hp+18);N.berries=(N.berries||0)+1;snd(660,.08,990,'sine',.05);N.fx.push({k:'txt',s:'+18',x:P.x,y:P.y-18,t:0,c:'#ff8aa0'})}else if(it.k==='heart'){N.hp=Math.min(N.max,N.hp+4);snd(880,.05,1320,'sine',.04)}else{N.queue+=(N.h.id==='marcus'?2:1)+(N.r.key?1:0);N.hp=Math.min(N.max,N.hp+15);G.gift=1;snd(988,.1);later(()=>snd(1319,.1),80);later(()=>snd(1760,.25),160)}}}
 N.it=N.it.filter(q=>!q.done);
 /* Louie fetches */
 const L=N.lou;if(L){const lv=N.p.louie,sp=lv>=2?150:112,capN=lv>=3?12:6,go=(x,y)=>{const dx=x-L.x,dy=y-L.y,d=Math.hypot(dx,dy)||1,s=Math.min(d,sp*dt);L.x+=dx/d*s;L.y+=dy/d*s;if(Math.abs(dx)>1)L.fx=dx>0?1:-1;return d};
  if(L.st===0){if(!L.tg||L.tg.done||L.tg.pull){L.tg=null;let bd=1e9;for(const m of N.mo){if(m.pull||m.held)continue;const d=(m.x-L.x)**2+(m.y-L.y)**2,dp=(m.x-P.x)**2+(m.y-P.y)**2;if(dp>50*50&&dp<230*230&&d<bd){bd=d;L.tg=m}}}
   if(L.tg){if(go(L.tg.x,L.tg.y)<6){L.tg.done=1;L.v+=L.tg.v;L.n++;L.tg=null;say('lou',.1,()=>snd(880,.03,0,'square',.02));if(L.n>=capN)L.st=1}}else if(L.n)L.st=1;else go(P.x-18*(P.fx||1),P.y+8)}
  else if(go(P.x,P.y)<10){gain(L.v);L.v=0;L.n=0;L.st=0;N.fx.push({k:'txt',s:'WOOF!',x:L.x,y:L.y-16,t:0,c:'#fff0d8'});snd(520,.05,390,'square',.03)}}
 /* calmed big ones that walk with you */
 for(const f of N.fr){f.cd-=dt;if(f.life!==undefined){f.life-=dt;if(f.life<=0){f.done=1;N.fx.push({k:'poof',x:f.x,y:f.y,t:0});continue}}if(f.tg&&(f.tg.gone||Math.hypot(f.tg.x-P.x,f.tg.y-P.y)>120))f.tg=null;if(!f.tg&&f.cd<=0)f.tg=near(P.x,P.y,3,95).filter(e=>!N.fr.some(o=>o!==f&&o.tg===e))[0]||null;
  const fi=N.fr.indexOf(f),tx=f.tg?f.tg.x:P.x+Math.cos(fi*1.05+2.6)*30,ty=f.tg?f.tg.y:P.y+10+Math.sin(fi*1.05+2.6)*18,dx=tx-f.x,dy=ty-f.y,d=Math.hypot(dx,dy)||1,s=Math.min(d,(f.tg?130:80)*dt);if(d>4){f.x+=dx/d*s;f.y+=dy/d*s;f.fx=dx>0?1:-1}
  if(f.tg&&d<f.tg.D.r+12&&f.cd<=0){hit(f.tg,f.star?34:f.sm?15:26,dx/d*150,dy/d*150);f.cd=.7;f.tg=null}}
 N.fr=N.fr.filter(f=>!f.done);
 /* the swarm: a loose crowd behind you; it surges on CHARGE */
 const c=N.ch,n=N.sw.length;if(N.cheer>0)N.cheer-=dt;for(const s of N.sw){const k=Math.sqrt(s.i+.6)*8.5,a=s.i*2.4+Math.sin(N.t*1.3+s.a)*.5;let tx=P.x-P.fx*(14+k*.5)+Math.cos(a)*k,ty=P.y+4-P.fy*(14+k*.5)+Math.sin(a)*k*.8;if(c){const f=Math.sin(Math.min(1,c.t/.4)*Math.PI)*62;tx+=c.dx*f;ty+=c.dy*f}
  const dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy);s.mv=d>2;const sp=Math.min(d,(c?330:60+d*5)*dt);if(d>.5){s.x+=dx/d*sp;s.y+=dy/d*sp}}
 /* sprouts keep shoulder room: no two stand on the same spot, moving or still */
 for(let i=0;i<n;i++){const a=N.sw[i];for(let j=i+1;j<n;j++){const b=N.sw[j],dx=b.x-a.x,dy=b.y-a.y;if(Math.abs(dx)>9||Math.abs(dy)>7)continue;const d=Math.hypot(dx,dy*1.3)||.01;if(d<9){const k=(9-d)/d*.5,px=d<.05?Math.cos(i*2.4):dx,py=d<.05?Math.sin(i*2.4):dy;a.x-=px*k;a.y-=py*k;b.x+=px*k;b.y+=py*k}}const hx=a.x-P.x,hy=a.y-P.y,hd=Math.hypot(hx,hy);if(hd<9&&!c){a.x=P.x+(hd?hx/hd:1)*9;a.y=P.y+(hd?hy/hd:0)*9}}
 for(const f of N.fx)f.t+=dt;N.fx=N.fx.filter(f=>f.t<(f.k==='calm'?1.1:f.k==='txt'?.8:.4));
 for(const p of N.pa){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=140*dt;p.l-=dt}N.pa=N.pa.filter(p=>p.l>0)}
const onScr=e=>Math.abs(e.x-RN.P.x)<W/2+12&&Math.abs(e.y-RN.P.y)<H/2+12;
let rdy=false;function setReady(v){if(v===rdy)return;rdy=v;try{const e=document.getElementById('bSel');if(e)e.classList.toggle('ready',v)}catch(e){}}
/* A: each keeper's own move */
function doA(){const N=RN,P=N.P,h=N.h,M=mul(),k=h.at,lvD=N.lv*2;N.aCd=h.acd*M.cd*(N.r.feather?.8:1);
 if(k==='surge'){N.ch={t:0,dx:P.fx,dy:P.fy,hs:new Set()};P.inv=Math.max(P.inv,.45);noise(.18,.3,900);snd(330,.16,660,'square',.04)}
 else if(k==='ring'){N.ring={t:0,rad:h.ar,col:h.adome?'#a8c8ff':h.astun?'#ff8aa0':'#ffffff'};for(const e of N.en){if(e.gone)continue;const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;if(d<h.ar+e.D.r){hit(e,h.admg+lvD,dx/d*210,dy/d*210);if(h.astun&&!e.D.boss&&!e.gone)e.stun=h.astun}}
  if(h.adome){P.inv=h.adome;N.dome=h.adome}else P.inv=Math.max(P.inv,.3);noise(.12,.35,h.astun?1800:1100);snd(h.astun?784:440,.14,h.astun?392:880,'square',.04)}
 else if(k==='cloud'){N.pt.push({x:P.x+P.fx*42,y:P.y+P.fy*42,rad:46,t:0,dur:5,dps:14+N.lv*1.5,tk:0,cl:1});snd(200,.3,120,'sine',.05);noise(.3,.2,600,'lowpass')}
 else if(k==='shot'){const n=h.an2||1,a0=Math.atan2(P.fy,P.fx),big=h.ag!=='bullet';for(let i=0;i<n;i++){const a=a0+(n>1?(i-(n-1)/2)*.16:0),sp=h.ag==='rock'?120:h.ag==='heart'?150:240;N.pr.push({x:P.x,y:P.y-6,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:big?1.7:.8,dmg:h.admg+lvD,pc:big?99:1,hs:new Set(),a:0,g:h.ag,r:big?(h.ag==='rock'?9:6):0})}
  snd(h.ag==='rock'?147:h.ag==='heart'?988:660,.12,h.ag==='rock'?73:h.ag==='heart'?1319:330,'square',.04)}
 else if(k==='net'){N.ring={t:0,rad:150,col:'#a8f080'};for(const m of N.mo)if(Math.hypot(m.x-P.x,m.y-P.y)<170)m.pull=1;for(const e of N.en){if(e.gone)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<56){hit(e,10+lvD);if(!e.D.boss&&!e.gone)e.stun=.7}}snd(1175,.12,1568,'sine',.04)}}
/* SELECT: the super. A cut-in, a short scene, then it lands. */
function startSuper(){const N=RN;N.sm=0;N.rdyPop=0;N.supers++;N.smNeed+=70;G.su={t:0,h:N.h,k:N.sk};G.s='super';setReady(false);snd(262,.1);later(()=>snd(392,.1),90);later(()=>snd(523,.3),180)}
function doSuper(){const N=RN,P=N.P,id=N.h.id,vis=N.en.filter(e=>!e.gone&&onScr(e)),big=e=>e.D.elite||e.D.boss;P.inv=Math.max(P.inv,1.2);N.shake=.4;N.sayT=0;noise(.3,.5,300,'lowpass');
 if(G.su&&G.su.k){N.say={s:N.h.q2,t:2.6};N.sayT=4;
  if(id==='will')N.su.push({k:'bikes',t:0,dur:2.1,x0:P.x,y0:P.y,dx:P.fx,dy:P.fy,pts:[]});
  else if(id==='erin'){N.stamp=7;N.cheer=7}
  else if(id==='marcus'){if(Math.random()<.65){for(const e of vis){if(big(e))hit(e,400);else calm(e)}N.seeds+=5;N.pop={s:'PAID OUT',t:0};radio('derek','erin','HE HAD MONEY ON THAT.')}else{N.hp=Math.max(1,N.hp-20);N.sm=N.smNeed*.6;N.pop={s:'TAILS',t:0};N.hurtT=.3;radio('derek','erin','HE HAD MONEY ON THAT TOO.')}}
  else if(id==='derek')N.su.push({k:'wave',t:0,dur:1.2,hs:new Set()});
  else if(id==='mama')N.su.push({k:'truck',yuk:1,t:0,dur:1.5});
  else if(id==='corbin'){N.spy=6;P.inv=6}
  else if(id==='scout'){N.wl=8;N.su.push({k:'wisp',t:0,dur:8})}
  else if(id==='ranger')N.pt.push({x:P.x,y:P.y,rad:70,t:0,dur:10,dps:26,tk:0,post:1});
  else if(id==='bibi'){N.bigDome=6;N.dome=6;P.inv=6}
  else{const tg=vis.slice().sort((a,b)=>b.hp-a.hp);for(let i=0;i<10;i++){const e=tg.length?tg[i%tg.length]:null;N.lob.push({t:1,sx:P.x+R(-60,60),sy:P.y-H/2-30,tx:e?e.x:P.x+R(-90,90),ty:e?e.y:P.y+R(-90,90),u:-i*.16,rad:36,dmg:110,rock:2})}}
  return}
 quip('su',1);if(id==='will')radio('marcus','erin',"BRO. YOU'RE J-LIGHTING AGAIN.");
 if(id==='will'){for(const e of vis){hit(e,big(e)?250:60);if(!e.gone){if(!e.D.boss)e.stun=4;N.fx.push({k:'txt',s:'OH.',x:e.x,y:e.y-e.D.sz,t:0,c:'#a8f080'})}}}
 else if(id==='erin')N.su.push({k:'plane',t:0,dur:4.2});
 else if(id==='marcus')N.su.push({k:'dab',t:0,dur:8});
 else if(id==='derek')N.su.push({k:'truck',t:0,dur:3.3});
 else if(id==='mama')N.su.push({k:'tantrum',t:0,dur:2.6,n:0});
 else if(id==='corbin'){for(const e of vis){if(big(e))hit(e,220);else calm(e)}N.hp=Math.min(N.max,N.hp+15)}
 else if(id==='scout'){N.notes=10;for(const m of N.mo)m.pull=1;for(const e of vis){hit(e,30);if(!e.gone&&!e.D.boss)e.stun=2.5}}
 else if(id==='ranger'){for(let i=0;i<14;i++){const e=vis.length?pick(vis):null;N.lob.push({t:1,sx:P.x+R(-90,90),sy:P.y-H/2-30,tx:e?e.x:P.x+R(-100,100),ty:e?e.y:P.y+R(-100,100),u:-i*.24,rad:42,dmg:75,rock:1})}}
 else if(id==='bibi'){const ids=['CINDERCAP','PEBBLIT','DRIZZLET','ZIPWIG','FERNFANG','CLOVERIMP'];N.fr=N.fr.filter(f=>!f.sm);for(let i=0;i<6;i++){const a=i/6*TAU;N.fr.push({id:ids[i],x:P.x+Math.cos(a)*30,y:P.y+Math.sin(a)*30,cd:.15*i,tg:null,fx:-1,life:14,sm:1})}}
 else{for(const e of vis){if(big(e))hit(e,350);else calm(e)}N.hp=Math.max(1,N.hp-15);N.fx.push({k:'flash',x:P.x,y:P.y,t:0})}}
function supers(dt){const N=RN,P=N.P;if(N.notes>0)N.notes-=dt;
 for(const q of N.su){q.t+=dt;
  if(q.k==='plane'){const a=q.t*3.2,rx=95*Math.min(1,q.t*2),x=P.x+Math.cos(a)*rx,y=P.y+Math.sin(a*2)*rx*.7;q.dir=-Math.sin(a)>0?1:-1;q.px=x;q.py=y;for(const e of N.en)if(!e.gone&&(e.sh||0)<=N.t&&Math.hypot(e.x-x,e.y-y)<34+e.D.r){e.sh=N.t+.35;hit(e,55,(e.x-x)*3,(e.y-y)*3)}}
  else if(q.k==='dab'){for(const e of N.en)if(!e.gone&&Math.hypot(e.x-P.x,e.y-P.y)<150){e.dab=.3;hit(e,22*dt,0,0,1)}}
  else if(q.k==='bikes'){const px=-q.dy,py=q.dx;q.pts=[];for(let i=0;i<5;i++){const u=(q.t-i*.14)/1.3;if(u<0||u>1)continue;const d=-150+u*340,o=(i-2)*26,x=q.x0+q.dx*d+px*o,y=q.y0+q.dy*d+py*o;q.pts.push([x,y]);for(const e of N.en)if(!e.gone&&(e.sh||0)<=N.t&&Math.hypot(e.x-x,e.y-y)<15+e.D.r){e.sh=N.t+.5;hit(e,95,q.dx*240+px*R(-60,60),q.dy*240+py*R(-60,60))}}}
  else if(q.k==='wave'){const rr=q.t/q.dur*215;q.rr=rr;for(const e of N.en){if(e.gone||q.hs.has(e))continue;const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;if(d<rr+8){q.hs.add(e);hit(e,90,dx/d*320,dy/d*320);if(!e.gone&&!e.D.boss)e.stun=1.1}}}
  else if(q.k==='wisp'){q.px=P.x+Math.cos(q.t*2.2)*46;q.py=P.y-10+Math.sin(q.t*2.2)*30}
  else if(q.k==='truck'&&q.yuk){const u=q.t/q.dur,x=P.x-190+u*380,y=P.y;q.px=x;q.py=y;q.dir=1;if(u<.05)say('trk',.5,()=>{noise(.6,.3,260,'lowpass');snd(880,.12,0,'square',.03);later(()=>snd(880,.12,0,'square',.03),260)});for(const e of N.en)if(!e.gone&&(e.sh||0)<=N.t&&Math.abs(e.x-x)<36+e.D.r&&Math.abs(e.y-y)<44+e.D.r){e.sh=N.t+2;hit(e,260,300,R(-120,120));if(!e.gone&&!e.D.boss)e.stun=2}}
  else if(q.k==='truck'){const ps=Math.min(2,(q.t/1.1)|0),u=(q.t-ps*1.1)/1.1,dir=ps%2?-1:1,x=P.x+dir*(-175+u*350),y=P.y+[-34,34,0][ps];q.px=x;q.py=y;q.dir=dir;if(u<.05)say('trk',.5,()=>{noise(.5,.3,300,'lowpass');snd(110,.5,70,'sawtooth',.05)});
   for(const e of N.en)if(!e.gone&&(e.sh||0)<=N.t&&Math.abs(e.x-x)<30+e.D.r&&Math.abs(e.y-y)<20+e.D.r){e.sh=N.t+.6;hit(e,130,dir*260,R(-80,80))}if(Math.random()<dt*14)N.pa.push({x:x-dir*24,y:y-6,vx:-dir*R(20,60),vy:R(-60,-20),l:.6,c:pick(['#c8d0dc','#f8e060'])})}
  else if(q.k==='tantrum'){const n=Math.min(5,((q.t/.5)|0)+1);if(n>q.n){q.n=n;N.shake=.35;noise(.15,.5,200,'lowpass');snd(98,.15,49,'sine',.08);N.fx.push({k:'thump',x:P.x,y:P.y,rad:120,t:0});for(const e of N.en)if(!e.gone&&onScr(e)){hit(e,36);if(!e.gone&&!e.D.boss)e.stun=.7}}}}
 N.su=N.su.filter(q=>q.t<q.dur)}
function upPlay(dt){const N=RN,P=N.P;
 if(N.dead){N.dead+=dt;if(N.dead>2.4)finish(false);return}
 if(pressed('start')&&!N.won){G.s='pause';G.pi=0;snd(440,.05);return}
 if(N.freeze>0){N.freeze-=dt;return}
 if(N.won){N.won+=dt;dt*=.6;if(N.won>5.2){finish(true);return}}else N.t+=dt;
 if(N.ban){N.ban.t-=dt;if(N.ban.t<=0)N.ban=null}
 const M=mul();let mx=(keys.right?1:0)-(keys.left?1:0),my=(keys.down?1:0)-(keys.up?1:0);P.mv=mx||my?1:0;
 if(P.mv){const d=Math.hypot(mx,my);mx/=d;my/=d;P.fx=mx;P.fy=my;P.x+=mx*M.spd*dt;P.y+=my*M.spd*dt}
 if(P.inv>0)P.inv-=dt;if(N.hurtT>0)N.hurtT-=dt;if(N.shake>0)N.shake-=dt;if(N.p.tea)N.hp=Math.min(N.max,N.hp+.35*N.p.tea*dt);if(N.r.shard)N.hp=Math.min(N.max,N.hp+.5*dt);if(N.h.id==='erin')N.hp=Math.min(N.max,N.hp+.5*dt);
 for(const q of RADIO)if(N.t>=q[0]&&!N.ev['r'+q[0]]){N.ev['r'+q[0]]=1;radio(q[1],q[2],q[3])}
 if(N.rad){N.rad.t+=dt;if(N.rad.t>4.2)N.rad=null}else if(N.radQ.length&&!N.ban){N.rad={h:N.radQ[0].h,s:N.radQ[0].s,t:0};N.radQ.shift();snd(880,.04,0,'square',.03);later(()=>snd(660,.04,0,'square',.03),70)}
 if(N.pop){N.pop.t+=dt;if(N.pop.t>1.6)N.pop=null}N.idleT-=dt;if(N.idleT<=0&&N.sayT<=0&&!N.boss){N.idleT=R(28,40);if(N.h.idle){N.say={s:pick(N.h.idle),t:3};N.sayT=8}}
 if(N.stamp>0)N.stamp-=dt;if(N.spy>0){N.spy-=dt;P.inv=Math.max(P.inv,.1)}if(N.wl>0){N.wl-=dt;for(const e of N.en)if(!e.gone&&onScr(e))hit(e,14*dt,0,0,1)}
 if(N.bigDome>0){N.bigDome-=dt;P.inv=Math.max(P.inv,.1);N.dome=Math.max(N.dome,.1);for(const e of N.en){if(e.gone)continue;const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;if(d<50+e.D.r){e.kx+=dx/d*40;e.ky+=dy/d*40;hit(e,34*dt,0,0,1)}}}
 if(N.sm>=N.smNeed&&!N.rdyPop){N.rdyPop=1;N.pop={s:'SUPER READY',t:0};snd(784,.08);later(()=>snd(1175,.2),90)}
 N.aCd-=dt;N.bCd-=dt;if(N.wh>0)N.wh-=dt;
 if(N.sayT>0)N.sayT-=dt;if(N.say){N.say.t-=dt;if(N.say.t<=0)N.say=null}if(N.domeCd>0)N.domeCd-=dt;if(N.dome>0)N.dome-=dt;if(N.ring){N.ring.t+=dt;if(N.ring.t>.35)N.ring=null}
 if(pressed('a')&&N.aCd<=0&&!N.won)doA();
 if(pressed('sel')&&N.sm>=N.smNeed&&!N.won){startSuper();return}
 if(pressed('b')&&N.bCd<=0&&!N.won){N.bCd=12*M.cd*(N.r.scale?.5:1);N.wh=.5;for(const m of N.mo)if(!m.held)m.pull=1;for(const e of N.en){const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;if(d<86){hit(e,N.r.scale?18:6,dx/d*170,dy/d*170);if(!e.D.boss)e.stun=.9}}snd(1568,.3,2093,'sine',.05);later(()=>snd(2093,.2,1568,'sine',.04),120)}
 if(N.ch){const c=N.ch;c.t+=dt;const f=Math.min(1,c.t/.4),hx=P.x+c.dx*(18+f*62),hy=P.y+c.dy*(18+f*62);for(const e of N.en)if(!e.gone&&!c.hs.has(e)&&Math.hypot(e.x-hx,e.y-hy)<30+e.D.r){c.hs.add(e);hit(e,22+N.lv*2.5,c.dx*190,c.dy*190)}if(c.t>.5)N.ch=null}
 if(!N.tip&&N.t>7&&SV.runs<=3&&!N.ban){N.tip=1;banner('A: '+N.h.an+'    B: WHISTLE','SELECT: YOUR SUPER, WHEN ITS BAR IS FULL',4.5)}
 director(dt);weapons(dt*(N.stamp>0?2.3:1));enemies(dt);others(dt);supers(dt);
 const cx=P.x-W/2,cy=P.y-H/2;N.cam.x+=(cx-N.cam.x)*Math.min(1,dt*9);N.cam.y+=(cy-N.cam.y)*Math.min(1,dt*9);
 if((N.queue>0||N.rq>0)&&!N.dead&&!N.won&&G.s==='play')deal()}
function finish(won){const N=RN,S=SV.stat,id=N.h.id,k0=krOf(S.calm)[0];let seeds=Math.round((Math.floor(N.calm/40)+Math.floor(N.t/30)+N.elites*3+(won?30:0)+N.seeds)*(N.r.coin?1.5:1));
 const rec=[];if(N.t>SV.best.t+.5){SV.best.t=Math.floor(N.t);if(!won)rec.push('LONGEST')}if(N.calm>SV.best.calm){SV.best.calm=N.calm;rec.push('MOST CALMED')}if(N.lv>SV.best.lv)SV.best.lv=N.lv;
 S.calm+=N.calm;S.runs++;S.bigs+=N.bigs;S.wisps+=N.wisps;S.supers+=N.supers;S.wake+=N.woke;S.maxT=Math.max(S.maxT,Math.floor(N.t));S.maxLv=Math.max(S.maxLv,N.lv);S.maxW=Math.max(S.maxW,...N.w);if(won){S.wins++;S.winsBy[id]=1}else S.falls++;const kr=krOf(S.calm);let kpay=0;for(let k=k0+1;k<=kr[0];k++)kpay+=krPay(k);seeds+=kpay;
 const r0=rankOf(id);SV.mast[id]=(SV.mast[id]||0)+N.calm;const r1=rankOf(id);
 if(won)SV.wins++;SV.seeds+=seeds;const un=checkGoals();store();setReady(false);
 G.rep={won,t:N.t,calm:N.calm,lv:N.lv,seeds,rec,first:won&&SV.wins===1,w:N.w.slice(),fr:N.fr.map(f=>f.id),un,hero:N.h,rank:r1>r0?r1:0,kr,kup:kr[0]>k0?kr[0]:0,kpay,finds:Object.keys(N.r)};G.s='report';G.t=0;G.lock=.9}

/* ---------- update: menus ---------- */
const TMENU=()=>['START EXPEDITION',"KEEPER'S TRAIL",'SUNKEEP','HOW IT WORKS','SWAP CARTRIDGE'];
const nav=(i,n,a='down',b='up')=>{if(pressed(a)){snd(520,.04);return(i+1)%n}if(pressed(b)){snd(520,.04);return(i+n-1)%n}return i};
function update(dt){H=A.H();G.t+=dt;if(G.lock>0)G.lock-=dt;if(G.noteT>0)G.noteT-=dt;setReady(G.s==='play'&&!!RN&&RN.sm>=RN.smNeed&&!RN.dead&&!RN.won);
 switch(G.s){
 case 'title':{const M=TMENU();G.mi=nav(G.mi,M.length);if(pressed('a')||pressed('start')){snd(660,.06,880);const k=M[G.mi];if(k==='START EXPEDITION'){if(!SV.seen){G.s='story';G.ip=0}else{G.s='pick';G.si=Math.max(0,HERO.findIndex(h=>h.id===SV.hero))}}else if(k==="KEEPER'S TRAIL"){G.s='trail';G.gi=Math.max(0,GOALS.findIndex(q=>!SV.done[q.id]));G.hold=0}else if(k==='SUNKEEP'){G.s='shop';G.ui=0}else if(k==='HOW IT WORKS'){G.s='how'}else A.eject()}break}
 case 'story':if(pressed('a')||pressed('start')){snd(440,.04);if(++G.ip>=STORY.length){SV.seen=1;store();G.s='pick';G.si=0}}else if(pressed('b')){SV.seen=1;store();G.s='pick';G.si=0}break;
 case 'how':if(pressed('a')||pressed('b')||pressed('start'))G.s='title';break;
 case 'pick':{const n=HERO.length;if(pressed('right')){G.si=(G.si+1)%n;snd(520,.04)}if(pressed('left')){G.si=(G.si+n-1)%n;snd(520,.04)}if(pressed('down')||pressed('up')){G.si=(G.si+5)%n;snd(520,.04)}if(pressed('b'))G.s='title';if(pressed('sel')){const h=HERO[G.si];if(heroOpen(h)&&rankOf(h.id)>=3){SV.sup[h.id]=SV.sup[h.id]?0:1;store();snd(660,.05,880)}else{snd(140,.1);note('A SECOND SUPER COMES AT RANK 3')}}
  if(pressed('a')||pressed('start')){const h=HERO[G.si];if(heroOpen(h)){snd(784,.08,1175);newRun(h.id);G.s='play'}else{snd(140,.1);const q=GOALS.find(o=>o.id===h.goal);note('ON THE TRAIL: '+q.d.toUpperCase())}}break}
 case 'trail':G.gi=nav(G.gi,GOALS.length);if(pressed('b')||pressed('a')||pressed('start'))G.s='title';
  /* for testing: hold SELECT here for two seconds and the whole trail opens */
  if(keys.sel){G.hold+=dt;if(G.hold>2&&(GOALS.some(q=>!SV.done[q.id])||HERO.some(h=>rankOf(h.id)<3))){for(const q of GOALS)SV.done[q.id]=1;for(const h of HERO)SV.mast[h.id]=Math.max(SV.mast[h.id]||0,MR[2]);store();snd(784,.1);later(()=>snd(1175,.25),110);note('WHOLE TRAIL OPENED (TESTING)')}}else G.hold=0;break;
 case 'super':{const u=G.su;u.t+=dt;if(u.t>(u.k?2.1:2.5)||(u.t>.75&&pressed('a'))){G.s='play';doSuper()}break}
 case 'shop':G.ui=nav(G.ui,UPS.length);if(pressed('b')||pressed('start'))G.s=G.rep&&G.from==='report'?'report':'title';
  if(pressed('a')){const u=UPS[G.ui],lv=SV.up[u.id];if(lv>=3){snd(140,.1);note('ALREADY AS GOOD AS IT GETS')}else if(SV.seeds<u.c[lv]){snd(140,.1);note('NEEDS '+u.c[lv]+' SEEDS')}else{SV.seeds-=u.c[lv];SV.up[u.id]++;store();snd(784,.1);later(()=>snd(1175,.2),100);note(u.n+' LV '+SV.up[u.id])}}break;
 case 'play':upPlay(dt);break;
 case 'cards':{const n=G.cards.length;G.ct=(G.ct||0)+dt;G.ci=nav(G.ci,n);if(G.lock<=0){if(pressed('a'))take(G.cards[G.ci]);else if(pressed('sel')&&RN.rr>0&&G.cards[0].k!=='b'&&G.cards[0].k!=='r'){RN.rr--;deal();G.lock=.25}}break}
 case 'pause':G.pi=nav(G.pi,3);if(pressed('start')||pressed('b'))G.s='play';else if(pressed('a')){snd(660,.06,880);if(G.pi===0)G.s='play';else if(G.pi===1){const s=RN.start;newRun(s);G.s='play'}else finish(false)}break;
 case 'report':if(G.lock<=0){if(pressed('a')||pressed('start')){snd(784,.08,1175);newRun(RN?RN.start:'will');G.s='play'}else if(pressed('b')){G.s='shop';G.ui=0;G.from='report'}else if(pressed('sel')){G.s='title';G.from=''}}break}}
const note=s=>{G.note=s;G.noteT=2.4};
const STORY=[
 ['The Great Lantern is dark, and in the dark the valley\'s buddies forgot the promise.',''],
 ['Sunkeep still grows sprouts, more than the garden can hold. So the spare ones go out, to carry the light to far places.','ERIN'],
 ['Tonight it is CROOKED HOLLOW. You walk, bro. The sprouts do the throwing. I supervise.','MARCUS'],
 ['Show a dim buddy enough light and it remembers. Nothing gets hurt. It just goes home.','ERIN'],
 ['Every place has a Guardian of the Light, and the Hollow\'s has gone dim. Last till it wakes. Then light it.','ERIN']];

/* ---------- draw: the field ---------- */
let LT=null;
function drawPlay(){const N=RN,P=N.P,sh=N.shake>0?N.shake*8:0,cx=Math.round(N.cam.x+R(-sh,sh)),cy=Math.round(N.cam.y+R(-sh,sh)),t=N.t,GT=G.t;
 const gp=ground(),ox=((cx%256)+256)%256,oy=((cy%256)+256)%256;for(let y=-oy;y<H;y+=256)for(let x=-ox;x<W;x+=256)g.drawImage(gp,x,y);
 props(cx,cy,null);
 for(const q of N.pt){const x=q.x-cx,y=q.y-cy,k=Math.min(1,q.t*4)*Math.min(1,(q.dur-q.t)*2);if(q.cl)continue;if(q.post){g.globalAlpha=.22*k;g.fillStyle='#f8e060';g.beginPath();g.ellipse(x,y,q.rad,q.rad*.85,0,0,7);g.fill();g.globalAlpha=1;r('rgba(0,0,0,.25)',x-4,y+1,9,2);r(K,x-2,y-20,4,22);r('#805030',x-1,y-19,2,20);r(K,x-9,y-19,15,6);r('#e8c888',x-8,y-18,13,4);r(K,x+3,y-13,6,7);r(((GT*4)|0)%2?'#fff8a0':'#f8e060',x+4,y-12,4,5);continue}g.globalAlpha=.3*k;g.fillStyle='#b0f090';g.beginPath();g.ellipse(x,y,q.rad,q.rad*.8,0,0,7);g.fill();g.globalAlpha=1;
  for(let i=0;i<7;i++){const a=i*.9+q.x,rr=q.rad*(.3+.6*((i*37)%10)/10)*k,fx=Math.round(x+Math.cos(a)*rr),fy=Math.round(y+Math.sin(a)*rr*.8);r('#2c6030',fx,fy-3,1,3);r(i%2?'#ffffff':'#f8e060',fx-1,fy-5,3,2)}}
 for(const s of N.st){const x=Math.round(s.x-cx),y=Math.round(s.y-cy);g.globalAlpha=.5;g.strokeStyle='#ffc8e8';g.lineWidth=1;g.beginPath();g.ellipse(x,y,s.rad*.8,s.rad*.5,0,0,7);g.stroke();g.globalAlpha=1}
 for(const b of N.lob){if(b.u<0)continue;const x=Math.round(b.tx-cx),y=Math.round(b.ty-cy);g.globalAlpha=.35;g.fillStyle='#181020';g.beginPath();g.ellipse(x,y,6+b.u*8,3+b.u*4,0,0,7);g.fill();g.globalAlpha=1}
 /* everything that stands, back to front */
 const Q=[];for(const e of N.en)Q.push([e.y,0,e]);for(const s of N.sw)Q.push([s.y,1,s]);for(const f of N.fr)Q.push([f.y,2,f]);if(N.lou)Q.push([N.lou.y,3,N.lou]);Q.push([P.y,4,P]);for(const f of N.fx)if(f.k==='calm')Q.push([f.y,5,f]);
 Q.sort((a,b)=>a[0]-b[0]);
 for(const [,k,o] of Q){
  if(k===0){const D=o.D,sz=D.sz,x=Math.round(o.x-cx),y=Math.round(o.y-cy);if(x<-40||x>W+40||y<-20||y>H+70)continue;const hop=o.stun>0?0:((o.a*7)|0)%2,wind=(D.ai==='charge'||D.boss)&&o.ph===1;
   r('rgba(0,0,0,.28)',x-(sz*.3|0),y-1,(sz*.6)|0,3);g.drawImage(bspr(o.id,sz,o.fl>0?2:1,o.fx>0),x-sz/2+(wind?Math.round(Math.sin(GT*60)*1.5):0),y-sz+2-hop,sz,sz)}
  else if(k===1){r('rgba(0,0,0,.25)',Math.round(o.x-cx)-3,Math.round(o.y-cy)+1,7,2);sprout(o.x-cx,o.y-cy+1,o.t,N.cheer>0?Math.abs(Math.sin(GT*11+o.i*.9))*5:o.mv?((GT*10+o.a*3)|0)%2:0,1)}
  else if(k===2){const sz=o.sm?20:30,x=Math.round(o.x-cx),y=Math.round(o.y-cy);r('rgba(0,0,0,.28)',x-9,y-1,18,3);g.drawImage(bspr(o.id,sz,0,o.fx>0),x-sz/2,y-sz+2-(((GT*8)|0)%2),sz,sz)}
  else if(k===3){const x=Math.round(o.x-cx),y=Math.round(o.y-cy),fr=((GT*10)|0)%2;r('rgba(0,0,0,.28)',x-8,y,17,2);try{g.drawImage((o.fx<0?A.LOU.l:A.LOU.r)[fr],x-10,y-12-fr)}catch(e){r('#e89040',x-8,y-10,16,10)}if(o.n)r('#fff8a0',x-1,y-16,3,3)}
  else if(k===4){const x=Math.round(P.x-cx),y=Math.round(P.y-cy);if(N.dead>1.2)continue;r('rgba(0,0,0,.3)',x-5,y-1,10,3);if(!(P.inv>0&&N.hurtT<=0&&((GT*20)|0)%2&&!N.ch&&N.dome<=0)){if(N.spy>0)g.globalAlpha=.4;drawHero(N.h,x,y,P.fx,P.fy,P.mv?((GT*9)|0)%2:0);g.globalAlpha=1}
   const lx=x+(P.fx<0?-9:7),ly=y-9;r(K,lx-1,ly-1,5,7);r('#f8e060',lx,ly,3,5);r('#fff8c0',lx+1,ly+1,1,2);r('#c04848',lx,ly-1,3,1)}
  else{const sz=o.big?o.sz:o.sz,d=Math.hypot(o.ax,o.ay)||1,run=Math.max(0,o.t-.35),x=Math.round(o.x-cx+o.ax/d*run*95),y=Math.round(o.y-cy+o.ay/d*run*95),hop=o.t<.35?Math.abs(Math.sin(o.t/.35*Math.PI*2))*5:((GT*12)|0)%2;
   g.globalAlpha=Math.max(0,Math.min(1,(1.1-o.t)*3));g.drawImage(bspr(o.id,sz,o.t<.07?2:0,o.ax>0),x-sz/2,y-sz+2-hop,sz,sz);if(o.t<.5){r('#f85888',x-1,y-sz-4-o.t*10,2,2);r('#f85888',x+2,y-sz-4-o.t*10,2,2);r('#f85888',x,y-sz-2-o.t*10,3,2)}g.globalAlpha=1}}
 /* in the air */
 if(N.w[2]){const lv=N.w[2],n=lv>=5?6:lv>=4?5:lv>=2?4:3,rad=lv>=3?40:31,sp=lv>=5?3.6:2.7;for(let i=0;i<n;i++){const a=t*sp+i*TAU/n;sprout(P.x+Math.cos(a)*rad-cx,P.y-1+Math.sin(a)*rad-cy,2,0,1)}}
 for(const p of N.pr){const x=Math.round(p.x-cx),y=Math.round(p.y-cy);if(p.g==='heart'){r(K,x-6,y-6,13,12);r('#f85888',x-5,y-5,5,5);r('#f85888',x+1,y-5,5,5);r('#f85888',x-4,y,9,3);r('#f85888',x-2,y+3,5,2);r('#ffc8e8',x-4,y-4,2,2)}else if(p.g==='rock')rock(x,y,9);else if(p.g==='bullet'){r('#40a0ff',x-2,y-2,4,4);r('#e4eaf2',x-1,y-1,2,2)}else sprout(x,y+4,0,0,1)}
 for(const b of N.lob){if(b.u<0)continue;const u=b.u,x=b.sx+(b.tx-b.sx)*u,y=b.sy+(b.ty-b.sy)*u-Math.sin(u*Math.PI)*46;if(b.rock===2){const X=Math.round(x-cx),Y=Math.round(y-cy);r(K,X-3,Y-8,6,12);r('#aab2c0',X-2,Y-7,4,10);r('#e83040',X-2,Y+1,4,2);r('#f8a030',X-1,Y-12,2,4)}else if(b.rock)rock(Math.round(x-cx),Math.round(y-cy),10);else sprout(x-cx,y-cy,1,0,1)}
 for(const q of N.su){const x=Math.round((q.px||0)-cx),y=Math.round((q.py||0)-cy);if(q.k==='bikes'){for(const b of q.pts){const X=Math.round(b[0]-cx),Y=Math.round(b[1]-cy);r('rgba(0,0,0,.25)',X-8,Y+1,16,2);r(K,X-9,Y-6,7,7);r(K,X+3,Y-6,7,7);r('#98a0b0',X-7,Y-4,3,3);r('#98a0b0',X+5,Y-4,3,3);r('#e23b5e',X-6,Y-9,13,2);r('#e23b5e',X+1,Y-13,2,5);r(K,X-3,Y-15,7,2)}}
  else if(q.k==='wisp'){g.drawImage(bspr('LANTERNWISP',22,0,0),x-11,y-16,22,22)}
  else if(q.k==='truck'&&q.yuk){g.save();g.translate(x,y+10);g.scale(1.6,1.6);r('rgba(0,0,0,.3)',-26,-1,52,3);r(K,-27,-19,54,17);r('#f4f4f0',-26,-18,52,15);r(K,-18,-27,34,10);r('#f4f4f0',-17,-26,32,9);r('#78b8f8',-15,-25,13,7);r('#78b8f8',1,-25,13,7);r(K,-20,-5,9,7);r(K,11,-5,9,7);g.restore()}
  else if(q.k==='truck')truck(x,y,q.dir,1);else if(q.k==='plane'){r('rgba(0,0,0,.25)',x-10,y+16,20,3);g.save();g.translate(x,y);g.scale(q.dir||1,1);r('#f4f4f0',-16,-4,32,3);r('#d8d8e0',-11,-1,22,2);try{g.drawImage(A.LOU.r[0],-10,-14)}catch(e){}r('#f4f4f0',-6,-6,12,2);g.restore()}
  else if(q.k==='tantrum'){const j=Math.abs(Math.sin(q.t*12.6))*8,rx=Math.round(P.x-cx+16),ry=Math.round(P.y-cy-j);r(K,rx-4,ry-13,8,7);r('#e8b890',rx-3,ry-12,6,5);r('#2e1e1a',rx-3,ry-13,6,2);r('#f078a8',rx-4,ry-7,8,5);r('#181020',rx-3,ry-2,2,2);r('#181020',rx+1,ry-2,2,2)}}
 for(const s of N.st){const x=Math.round(s.x-cx),y=Math.round(s.y-cy-s.t*260);r('#ffc8e8',x,y-14,1,12);r('#f078c0',x-2,y-2,5,5);r('#ffffff',x-1,y-1,3,3);r('#ffffff',x,y-4,1,9);r('#ffffff',x-4,y,9,1)}
 for(const q of N.ep){const x=Math.round(q.x-cx),y=Math.round(q.y-cy);r('#181020',x-3,y-3,6,6);r('#c060ff',x-2,y-2,4,4);r('#f0c8ff',x-1,y-1,2,2)}
 for(const it of N.it){const x=Math.round(it.x-cx),y=Math.round(it.y-cy-Math.abs(Math.sin(it.t*4))*3);if(it.k==='berry')icon('berry',x-6,y-10);else{r(K,x-7,y-10,14,11);r('#c89050',x-6,y-9,12,9);r('#f8e060',x-6,y-6,12,2);r('#fff8c0',x-1,y-7,2,4);if(((GT*5)|0)%2){r('#ffffff',x+7,y-13,1,3);r('#ffffff',x+6,y-12,3,1)}}}
 /* the dark, with the light cut out of it */
 if(!LT){LT=document.createElement('canvas');LT.width=W;LT.height=304}
 const c=LT.getContext('2d'),dk=N.won?Math.max(0,.84-N.won*.3):N.wl>0?.84-.56*Math.min(1,N.wl,(8-N.wl)*3):.84;
 if(c&&c.createRadialGradient){c.globalCompositeOperation='source-over';c.clearRect(0,0,W,304);c.fillStyle='rgba(10,8,44,'+dk.toFixed(3)+')';c.fillRect(0,0,W,H);c.globalCompositeOperation='destination-out';
  const L=(x,y,rad,k=1)=>{if(x<-rad||y<-rad||x>W+rad||y>H+rad||rad<1)return;const gr=c.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(0,0,0,'+k+')');gr.addColorStop(.55,'rgba(0,0,0,'+(k*.7).toFixed(2)+')');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(x-rad,y-rad,rad*2,rad*2)};
  const lf=N.dead?Math.max(0,1-N.dead/1.2):1,pr=(44+52*(N.hp/N.max)+Math.min(22,N.sw.length*.9)+(N.r.shard?22:0)+(N.h.id==='scout'?18:0)+Math.sin(GT*7)*1.5)*lf;L(P.x-cx,P.y-6-cy,pr,1);
  if(N.ch){const f=Math.min(1,N.ch.t/.4);L(P.x+N.ch.dx*(18+f*62)-cx,P.y+N.ch.dy*(18+f*62)-cy,46,.9)}if(N.wh>0)L(P.x-cx,P.y-cy,90*(1-N.wh/.5)+40,.8*(N.wh/.5));
  for(const p of N.pr)L(p.x-cx,p.y-cy,16,.8);for(const q of N.pt)L(q.x-cx,q.y-cy,q.rad*1.5,.8);for(const z of N.zl)for(const p of z.pts)L(p[0]-cx,p[1]-cy,20,.8);
  for(const f of N.fx){if(f.k==='calm')L(f.x-cx,f.y-cy,(f.big?70:26)*Math.max(0,1-f.t),.9);else if(f.k==='thump'||f.k==='star')L(f.x-cx,f.y-cy,f.rad*1.6,.9*(1-f.t/.4))}
  for(const f of N.fr)L(f.x-cx,f.y-10-cy,26,.8);if(N.lou)L(N.lou.x-cx,N.lou.y-6-cy,14,.6);for(const it of N.it)L(it.x-cx,it.y-5-cy,15,.8);
  if(N.boss)L(N.boss.x-cx,N.boss.y-20-cy,30,.35);for(const q of N.pt)if(q.post)L(q.x-cx,q.y-cy,q.rad*1.4,.95);for(const q of N.su){if(q.k==='bikes')for(const b of q.pts)L(b[0]-cx,b[1]-cy,26,.9);else if(q.k==='wave')L(P.x-cx,P.y-cy,(q.rr||0)+30,.6);else if(q.k==='wisp')L(q.px-cx,q.py-cy,40,.9);else if(q.k==='truck'||q.k==='plane')L(q.px-cx,q.py-cy,44,.9);else if(q.k==='dab')L(P.x-cx,P.y-cy,150,.5)}if(N.ring)L(P.x-cx,P.y-cy,N.ring.rad*1.3,.8*(1-N.ring.t/.35));for(const f of N.fx)if(f.k==='flash')L(f.x-cx,f.y-cy,400,1-f.t/.4);props(cx,cy,L);
  g.drawImage(LT,0,0,W,H,0,0,W,H)}
 /* what shows in the dark: eyes, motes, sparks */
 for(const e of N.en){const x=Math.round(e.x-cx),y=Math.round(e.y-cy),sz=e.D.sz;if(x<-10||x>W+10||y<0||y>H+30)continue;if(e.D.wisp){g.globalAlpha=.5+.2*Math.sin(GT*6);g.fillStyle='#f8e896';g.beginPath();g.arc(x,y-10,7,0,7);g.fill();g.globalAlpha=1;continue}
  const ey=y-Math.round(sz*.52),ex=x+e.fx*Math.round(sz*.14),w=sz>30?2:1,c2=e.D.elite||e.D.boss?'#ff70a0':'#c890ff';if(((e.a*1.3)|0)%9===0)continue;r(c2,ex-w-1,ey,w,w);r(c2,ex+1,ey,w,w)}
 for(const m of N.mo){const x=Math.round(m.x-cx),y=Math.round(m.y-cy+Math.sin(m.a)*1.5),b=m.v>2;r('#f8e060',x-1,y-1,b?3:2,b?3:2);r('#ffffff',x,y,1,1);if(b){r('#fff8a0',x,y-2,1,5);r('#fff8a0',x-2,y,5,1)}}
 for(const z of N.zl){g.globalAlpha=z.t/.2;g.strokeStyle='#fff8a0';g.lineWidth=2;g.beginPath();z.pts.forEach((p,i)=>{const x=p[0]-cx+(i?R(-2,2):0),y=p[1]-cy+(i?R(-2,2):0);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke();g.globalAlpha=1}
 for(const f of N.fx){const x=f.x-cx,y=f.y-cy;if(f.k==='thump'||f.k==='star'){g.globalAlpha=1-f.t/.4;g.strokeStyle=f.k==='star'?'#ffc8e8':'#dce2ea';g.lineWidth=2;g.beginPath();g.ellipse(x,y,f.rad*(.4+f.t*1.5),f.rad*(.3+f.t*1.1),0,0,7);g.stroke();g.globalAlpha=1}
  else if(f.k==='txt')text(f.s,Math.round(x-tw(f.s,1)/2),Math.round(y-f.t*14),1,f.c);else if(f.k==='poof'){g.globalAlpha=1-f.t/.4;r('#f8e896',x-2-f.t*20,y-10,2,2);r('#f8e896',x+f.t*20,y-12,2,2);g.globalAlpha=1}}
 for(const p of N.pa)r(p.c,Math.round(p.x-cx),Math.round(p.y-cy),2,2);
 const smoke=(x,y,rad,k,sd)=>{for(let i=0;i<9;i++){const a=i*2.1+sd,d=rad*(.2+.6*((i*37)%10)/10);g.globalAlpha=.2*k;g.fillStyle='#f0f0f8';g.beginPath();g.arc(x+Math.cos(a+GT*.4)*d,y+Math.sin(a+GT*.3)*d*.8,rad*.34+Math.sin(GT*2+i)*2,0,7);g.fill()}g.globalAlpha=1};
 for(const q of N.pt)if(q.cl)smoke(q.x-cx,q.y-cy,q.rad,Math.min(1,q.t*4)*Math.min(1,(q.dur-q.t)*2),q.x);
 for(const q of N.su)if(q.k==='dab')smoke(P.x-cx,P.y-cy,150,Math.min(1,q.t*2)*Math.min(1,(q.dur-q.t))*1.1,3);
 for(const q of N.su)if(q.k==='wave'){g.globalAlpha=Math.max(0,1-q.t/q.dur);g.strokeStyle='#78b8f8';g.lineWidth=5;g.beginPath();g.ellipse(P.x-cx,P.y-cy,q.rr||1,(q.rr||1)*.85,0,0,7);g.stroke();g.strokeStyle='#e0f8ff';g.lineWidth=2;g.beginPath();g.ellipse(P.x-cx,P.y-cy,(q.rr||1)+4,((q.rr||1)+4)*.85,0,0,7);g.stroke();g.globalAlpha=1}
 for(const f of N.fx)if(f.k==='lvl'){const k=f.t/.4;g.globalAlpha=1-k;g.strokeStyle='#a8f080';g.lineWidth=3;g.beginPath();g.ellipse(f.x-cx,f.y-cy,10+k*46,(10+k*46)*.8,0,0,7);g.stroke();for(let i=0;i<8;i++){const a=i*.785;r('#f8e060',f.x-cx+Math.cos(a)*(8+k*40),f.y-cy-6+Math.sin(a)*(8+k*40)*.8-k*10,2,2)}g.globalAlpha=1}
 if(N.bigDome>0){g.globalAlpha=.25+.1*Math.sin(GT*12);g.fillStyle='#a8c8ff';g.beginPath();g.arc(P.x-cx,P.y-cy,50,Math.PI,TAU);g.fill();g.globalAlpha=.9;g.strokeStyle='#e0f0ff';g.lineWidth=2;g.beginPath();g.arc(P.x-cx,P.y-cy,50,Math.PI,TAU);g.stroke();g.globalAlpha=1}
 if(N.ring){const q=N.ring,k=q.t/.35;g.globalAlpha=1-k;g.strokeStyle=q.col;g.lineWidth=3;g.beginPath();g.ellipse(P.x-cx,P.y-cy,q.rad*(.3+.7*k),q.rad*(.3+.7*k)*.85,0,0,7);g.stroke();g.globalAlpha=1}
 if(N.dome>0||(N.h.id==='bibi'&&N.domeCd<=0)){g.globalAlpha=N.dome>0?.5+.2*Math.sin(GT*20):.22;g.strokeStyle='#a8c8ff';g.lineWidth=N.dome>0?2:1;g.beginPath();g.arc(P.x-cx,P.y-7-cy,N.dome>0?16:13,Math.PI,TAU);g.stroke();g.globalAlpha=1}
 for(const f of N.fx)if(f.k==='flash'){g.globalAlpha=Math.max(0,1-f.t/.4);r('#ffffff',0,0,W,H);g.globalAlpha=1}
 if(N.say&&!N.ban&&!N.dead){const s=N.say.s,w2=Math.min(W-6,tw(s,1)+8),px=Math.round(P.x-cx),py=Math.round(P.y-cy),bx=Math.max(3,Math.min(W-w2-3,Math.round(px-w2/2))),by=Math.max(44,py-36);g.globalAlpha=Math.min(1,N.say.t*4);r(K,bx-1,by-1,w2+2,15);r('#ffffff',bx,by,w2,13);r(K,px-1,by+14,3,2);r('#ffffff',px,by+13,1,2);
  if(tw(s,1)>w2-8){g.save();g.translate(bx+4,0);g.scale((w2-8)/tw(s,1),1);text(s,0,by+2,1,'#281c30',null);g.restore()}else text(s,bx+4,by+2,1,'#281c30',null);g.globalAlpha=1}
 if(N.wh>0){g.globalAlpha=N.wh/.5;g.strokeStyle='#fff8a0';g.lineWidth=2;g.beginPath();g.arc(P.x-cx,P.y-cy,86*(1-N.wh/.5)+8,0,7);g.stroke();g.globalAlpha=1}
 if(N.boss&&N.boss.ph===1){const b=N.boss;g.globalAlpha=.35+.25*Math.sin(GT*30);g.strokeStyle='#ff70a0';g.lineWidth=3;g.beginPath();g.moveTo(b.x-cx,b.y-8-cy);g.lineTo(b.x+b.cx*170-cx,b.y-8+b.cy*170-cy);g.stroke();g.globalAlpha=1}
 if(N.won){const u=N.won,x=W/2,y=H/2-30-Math.min(60,u*14);if(u>.6){r(K,x-6,y-8,12,15);r('#98a0b0',x-5,y-7,10,13);r('#58c048',x-3,y-5,6,3);r('#f8e060',x-2,y-1,4,5);r('#fff8c0',x-1,y,2,2);if(((GT*8)|0)%2){r('#ffffff',x+7,y-10,1,3);r('#ffffff',x+6,y-9,3,1)}}}
 if(N.hurtT>0)r('rgba(255,60,90,'+(N.hurtT*.8).toFixed(2)+')',0,0,W,H);
 if(N.hp<N.max*.3&&!N.dead&&!N.won){const a=(.1+.08*Math.sin(GT*8)).toFixed(2);r('rgba(255,60,90,'+a+')',0,0,W,3);r('rgba(255,60,90,'+a+')',0,H-3,W,3);r('rgba(255,60,90,'+a+')',0,0,3,H);r('rgba(255,60,90,'+a+')',W-3,0,3,H)}
 hud();
 if(N.dead>.5){r('rgba(8,6,20,'+Math.min(.8,(N.dead-.5)).toFixed(2)+')',0,0,W,H);if(N.dead>1)ctext('THE LIGHT WENT OUT',H/2-10,3,'#c8c0d8')}}
function rock(x,y,rr){g.fillStyle=K;g.beginPath();g.arc(x,y-rr+2,rr+1,0,7);g.fill();g.fillStyle='#8088a0';g.beginPath();g.arc(x,y-rr+2,rr,0,7);g.fill();r('#a0a8bc',x-rr*.5,y-rr*1.4+2,rr*.6,2);r('#6c7488',x+1,y-rr+4,rr*.5,1)}
function truck(x,y,dir,sc=1){g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir*sc,sc);r('rgba(0,0,0,.3)',-24,-1,48,3);r(K,-25,-24,34,22);r('#1c64c8',-24,-23,32,20);r('#5a9cf0',-24,-23,32,3);r('#f4f4f0',-22,-17,28,7);r(K,8,-18,17,16);r('#f4f4f0',9,-17,15,14);r('#78b8f8',15,-16,8,6);r(K,-20,-5,8,7);r(K,10,-5,8,7);r('#585070',-18,-3,4,3);r('#585070',12,-3,4,3);g.restore();
 if(sc>=3){const s='FLOW PROS';text(s,Math.round(x-8*dir*sc-tw(s,1)/2),Math.round(y-17*sc+(7*sc-10)/2),1,'#1c64c8',null)}}
function hud(){const N=RN,M=mul();
 r(K,0,0,W,3);r('#3a3060',0,0,W,2);r('#a8f080',0,0,Math.round(W*Math.min(1,N.xp/N.need)),2);
 r('rgba(12,10,24,.72)',0,3,W,21);
 /* light */
 r(K,4,6,5,9);r('#f8e060',5,8,3,6);r('#c04848',5,6,3,2);r(K,12,6,62,8);r('#3a2a2a',13,7,60,6);const f=N.hp/N.max;r(f<.3?'#ff5a6e':'#f8e060',13,7,Math.round(60*f),6);r('#fff8c0',13,7,Math.round(60*f),1);
 const sf=Math.min(1,N.sm/N.smNeed),full=sf>=1;r(K,12,15,62,5);r('#2a2040',13,16,60,3);r(full?(((G.t*6)|0)%2?'#fff8a0':'#f8a030'):'#c060ff',13,16,Math.round(60*sf),3);r(full?'#f8e060':'#c060ff',5,16,3,3);
 if(full&&!N.won&&((G.t*3)|0)%3){const s='SELECT: '+supName(N.h,N.sk);ctext(s,N.boss?H-76:H-56,1,'#f8e060')}if(N.notes>0)text('NOTES '+Math.ceil(N.notes),78,15,1,'#a8f080',null);
 const tl=N.boss||N.won?'GUARDIAN':mmss(BOSS_AT-N.t);text(tl,Math.round(142-tw(tl,2)/2),6,2,N.boss?'#ff70a0':BOSS_AT-N.t<30?'#f8e060':'#ffffff');
 const cs=String(N.calm);text(cs,W-5-tw(cs,2),6,2,'#a8f080');r('#f85888',W-tw(cs,2)-17,9,2,2);r('#f85888',W-tw(cs,2)-14,9,2,2);r('#f85888',W-tw(cs,2)-17,10,5,2);r('#f85888',W-tw(cs,2)-16,12,3,1);r('#f85888',W-tw(cs,2)-15,13,1,1);
 text('LV'+N.lv,78,5,1,'#a8f080',null);
 /* the swarm you have built */
 let x=4;for(let t=0;t<6;t++)if(N.w[t]){r('rgba(12,10,24,.6)',x-1,26,13,15);sprout(x+5,36,t);for(let i=0;i<N.w[t];i++)r('#f8e060',x+i*2+1,38,1,2);x+=15}
 for(const p of PS)if(N.p[p.id]){r('rgba(12,10,24,.6)',x-1,26,13,15);g.save();g.translate(x,27);g.scale(.85,.85);icon(p.id,0,0);g.restore();for(let i=0;i<N.p[p.id];i++)r('#a8f080',x+i*2+1,38,1,2);x+=15}
 for(const q of RL)if(N.r[q.id]&&x<W-14){r('rgba(40,30,8,.7)',x-1,26,13,15);r('#f8e060',x-1,40,13,1);ricon(q.id,x,27);x+=15}
 if(N.pop){const u=N.pop.t,k=u<.15?u/.15*1.3:u<.25?1.3-(u-.15)*3:1,a=Math.min(1,(1.6-u)*3);g.save();g.globalAlpha=Math.max(0,a);g.translate(W/2,58);g.scale(k,k);text(N.pop.s,-tw(N.pop.s,3)/2,-8,3,'#f8e060','#141018');g.restore();g.globalAlpha=1}
 if(N.rad&&!N.dead){const q=N.rad,u=q.t,sl=u<.25?(1-u/.25):u>3.9?(u-3.9)/.3:0,y=H-66-(N.boss?24:0),X=Math.round(-sl*W),hd=headOf(q.h);r(K,X+3,y-1,W-6,22);r('#16222c',X+4,y,W-8,20);r(q.h.col,X+4,y,22,20);if(hd){const sc=Math.min(18/hd.width,18/hd.height);g.drawImage(hd,X+5+Math.round((20-hd.width*sc)/2),y+1,Math.round(hd.width*sc),Math.round(hd.height*sc))}
  text(q.h.n,X+30,y+1,1,'#f8e060',null);if(((u*6)|0)%2)r('#58c048',X+W-12,y+3,4,4);const mw=W-38,sw=tw(q.s,1);if(sw>mw){g.save();g.translate(X+30,0);g.scale(mw/sw,1);text(q.s,0,y+10,1,'#ffffff',null);g.restore()}else text(q.s,X+30,y+10,1,'#ffffff',null)}
 if(N.boss){const b=N.boss,w=W-40;r(K,19,H-52,w+2,8);r('#3a2040',20,H-51,w,6);r('#c060ff',20,H-51,Math.round(w*Math.max(0,b.hp/b.max)),6);r('#f0c8ff',20,H-51,Math.round(w*Math.max(0,b.hp/b.max)),1);ctext('PYTHORN  DIM GUARDIAN',H-63,1,'#f0c8ff')}
 /* A and B */
 const btn=(bx,lab,nm,cd,full,col)=>{const y=H-40,rdy=cd<=0;r(K,bx,y,72,16);r(rdy?col:'#2a2238',bx+1,y+1,70,14);if(!rdy)r('#4a4068',bx+1,y+1,Math.round(70*(1-cd/full)),14);text(lab,bx+4,y+2,2,rdy?'#fff':'#8f86a8',rdy?K:null);const nw=tw(nm,1);if(nw>54){g.save();g.translate(bx+15,0);g.scale(54/nw,1);text(nm,0,y+4,1,rdy?'#fff':'#8f86a8',null);g.restore()}else text(nm,bx+15,y+4,1,rdy?'#fff':'#8f86a8',null)};
 btn(4,'B','WHISTLE',N.bCd,12*M.cd,'#3a3050');btn(W-76,'A',N.h.an,N.aCd,N.h.acd*M.cd,'#e23b5e');
 if(N.ban){const b=N.ban,a=Math.min(1,b.t*3,(b.T-b.t)*4),y=Math.round(H*.26);g.globalAlpha=Math.max(0,a);r('rgba(12,10,24,.82)',0,y-4,W,b.b?32:20);r('#f8e060',0,y-4,W,1);r('#f8e060',0,y+(b.b?27:15),W,1);ctext(b.a,y,2,'#f8e060');if(b.b){const s=b.b;if(tw(s,1)>W-8){g.save();g.translate(4,0);g.scale((W-8)/tw(s,1),1);text(s,0,y+14,1,'#ffffff',null);g.restore()}else ctext(s,y+14,1,'#ffffff',null)}g.globalAlpha=1}}

/* ---------- draw: menus ---------- */
function back(){r('#0c0a1c',0,0,W,H);for(let i=0;i<40;i++)r(i%3?'#16142c':'#1e1a3a',(i*67)%W,(i*41)%Math.max(H,160),2,2)}
function head(t,sub){r('#1d2b18',0,0,W,20);r('#f8e060',0,20,W,1);r(K,0,21,W,1);sprout(10,16,2,0,1);text(t,20,4,2,'#f8e060');if(sub)text(sub,W-5-tw(sub,1),6,1,'#a8f080',null)}
function tile(x,y,w,h,on){r(on?'#ffd23f':'#14101e',x,y,w,h);r(on?'#fff3b0':'#1f2236',x+1,y+1,w-2,h-2);if(!on)r('#2a2c46',x+1,y+1,w-2,1)}
function seedsTag(y){const s=String(SV.seeds);icon('seed',W-18-tw(s,2),y-2);text(s,W-5-tw(s,2),y,2,'#f8e060')}
function drawTitle(){const t=G.t,cy=Math.round(H*.3);r('#0a0820',0,0,W,H);
 /* a pool of light in a big dark, the swarm milling in it, eyes all round */
 const gp=ground();g.save();g.beginPath();g.arc(120,cy+20,58+Math.sin(t*2)*2,0,7);g.clip();g.drawImage(gp,0,cy-60);g.restore();
 const gr=g.createRadialGradient?g.createRadialGradient(120,cy+20,20,120,cy+20,62):null;if(gr){gr.addColorStop(0,'rgba(10,8,32,0)');gr.addColorStop(1,'rgba(10,8,32,1)');g.fillStyle=gr;g.fillRect(50,cy-50,140,140)}
 for(let i=0;i<14;i++){const a=i*1.9+t*.25,d=74+((i*29)%34),x=Math.round(120+Math.cos(a)*d*1.25),y=Math.round(cy+20+Math.sin(a)*d*.8);if(((t*1.1+i)|0)%7===0)continue;r(i%5?'#c890ff':'#ff70a0',x-2,y,1,1);r(i%5?'#c890ff':'#ff70a0',x+1,y,1,1)}
 for(let i=0;i<13;i++){const a=i*2.4+Math.sin(t+i)*.4,d=Math.sqrt(i+.6)*7;sprout(120+Math.cos(a)*d*1.5-4,cy+36+Math.sin(a)*d*.9,[0,2,3,1,4,5][i%6],((t*8+i)|0)%2,1)}
 drawHero(heroOf(SV.hero),120,cy+20,0,1);r(K,127,cy+10,5,7);r('#f8e060',128,cy+11,3,5);r('#fff8c0',129,cy+12,1,2);
 ctext('LIGHTSWARM',Math.max(4,cy-64),5,'#f8e060','#403010');ctext('AN EXPEDITION FROM SUNKEEP',Math.max(32,cy-36),1,'#a8f080',null);
 const M=TMENU(),y0=Math.min(H-M.length*19-16,cy+84);M.forEach((m,i)=>{const on=i===G.mi,y=y0+i*19;tile(44,y,152,17,on);const s=m;text(s,Math.round(120-tw(s,1)/2),y+4,1,on?'#281c30':'#d8d0ec',null)});
 text('SEEDS '+SV.seeds+'   RANK '+krOf(SV.stat.calm)[0],5,H-12,1,'#f8e060',null);const b=SV.wins?'GUARDIANS LIT '+SV.wins:SV.best.t?'BEST '+mmss(SV.best.t):'VERTICAL SLICE';text(b,W-5-tw(b,1),H-12,1,'#8f86a8',null)}
function drawStory(){back();const p=STORY[G.ip],y=Math.round(H*.2);
 /* a small picture: the dark Lantern, or the swarm leaving the gate */
 r(K,30,y,180,70);r('#101028',31,y+1,178,68);r('#1c3a24',31,y+50,178,19);
 if(G.ip===0){r(K,112,y+18,16,34);r('#585070',114,y+20,12,30);r('#383048',116,y+24,8,12);r('#6c6488',108,y+14,24,5);for(let i=0;i<6;i++){r('#c890ff',44+i*27,y+44+(i%2)*6,1,1);r('#c890ff',47+i*27,y+44+(i%2)*6,1,1)}}
 else if(G.ip===4){g.drawImage(bspr('PYTHORN',48,1,0),96,y+8,48,48);r('#ff70a0',112,y+26,2,2);r('#ff70a0',118,y+26,2,2)}
 else{r('#f8e060',46,y+22,8,12);r('#fff8c0',48,y+24,3,5);r(K,48,y+34,4,18);g.globalAlpha=.25;g.fillStyle='#f8e060';g.beginPath();g.arc(50,y+30,24,0,7);g.fill();g.globalAlpha=1;for(let i=0;i<9;i++)sprout(76+i*13+Math.sin(G.t*2+i)*2,y+60-(i%3)*3,[0,2,3,1,4,5][i%6],((G.t*8+i)|0)%2,1);try{g.drawImage(A.will().pr,196,y+42)}catch(e){}}
 if(p[1]){r('#f8e060',30,y+78,tw(p[1],1)+8,12);text(p[1],34,y+80,1,'#281c30',null)}
 wrap(p[0],184,1).forEach((l,i)=>text(l,30,y+96+i*12,1,'#ffffff',null));
 ctext('A: GO ON    B: SKIP    '+(G.ip+1)+' / '+STORY.length,H-14,1,'#8f86a8',null)}
function drawHow(){back();head('HOW IT WORKS');const L=['D-PAD: WALK. THAT IS ALL YOU STEER.','THE SPROUTS THROW LIGHT BY THEMSELVES.','LIT BUDDIES GO HOME CALM AND LEAVE MOTES.','MOTES LEVEL YOU UP: PICK 1 OF 3.',"A: YOUR KEEPER'S OWN MOVE.",'B: WHISTLE. CALLS EVERY MOTE, SHOVES THE DARK.','SELECT: YOUR SUPER, WHEN ITS BAR IS FULL.','YOUR LIGHT IS YOUR LIFE. IT SHRINKS AS IT DIMS.','AT 5:00 THE GUARDIAN WAKES. LIGHT IT.',"THE KEEPER'S TRAIL OPENS PEOPLE, SPROUTS, ITEMS.",'SEEDS BUY LASTING UPGRADES AT SUNKEEP.'];
 const dy=Math.min(18,(H-46)/L.length);L.forEach((l,i)=>{const y=Math.round(28+i*dy);r('#f8e060',6,y+3,3,3);if(tw(l,1)>W-18){g.save();g.translate(13,0);g.scale((W-18)/tw(l,1),1);text(l,0,y,1,'#ffffff',null);g.restore()}else text(l,13,y,1,'#ffffff',null)});ctext('A: BACK',H-13,1,'#8f86a8',null)}
function drawPick(){back();head('WHO CARRIES THE LIGHT?');const cw=44,chh=44,h=HERO[G.si],open=heroOpen(h);
 HERO.forEach((q,i)=>{const x=5+(i%5)*(cw+2.5),y=25+((i/5)|0)*(chh+3),on=i===G.si,un=heroOpen(q);tile(Math.round(x),y,cw,chh,on);
  if(un){drawHero(q,Math.round(x+cw/2),y+chh-5,0,1,on&&((G.t*6)|0)%2?1:0,2);const rk=rankOf(q.id);for(let k=0;k<rk-1;k++)r('#f8a030',Math.round(x)+3+k*4,y+3,3,3)}
  else{const X=Math.round(x+cw/2),Y=y+chh/2;r(K,X-6,Y-2,12,10);r('#585070',X-5,Y-1,10,8);r(K,X-4,Y-8,8,7);r(on?'#fff3b0':'#1f2236',X-2,Y-6,4,5);r(K,X-1,Y+2,2,3)}});
 let y=25+2*(chh+3)+3;text(h.n,8,y,2,'#f8e060');const rk=rankOf(h.id);if(open){const s='RANK '+rk+' / 5';text(s,W-8-tw(s,1),y+2,1,'#f8a030',null)}y+=14;
 const line=(s,c,mw=224,x=8)=>{wrap(s,mw,1).forEach(l=>{if(y<H-26)text(l,x,y,1,c,null);y+=10})};
 line(h.tag,'#a8f080');y+=2;
 if(!open){const q=GOALS.find(o=>o.id===h.goal),[a,b]=q.p(SV.stat);line('ON THE TRAIL: '+q.n,'#ff8aa0');line(q.d+'.','#ffffff');const f=q.f||String;line(f(Math.min(a,b))+' / '+f(b),'#8f86a8')}
 else{sprout(13,y+9,h.st,0,1);text('LEADS WITH '+TY[h.st].n+' SPROUTS',22,y,1,'#ffffff',null);y+=12;line(h.pas,'#d8d0ec');y+=2;
  text('A',8,y,1,'#ff8aa0',null);line(h.an+': '+h.ad,'#ffffff',206,20);y+=2;const sk=supOf(h);text('SUPER',8,y,1,'#f8e060',null);if(rk>=3){const s2='SELECT: '+supName(h,1-sk);text(s2,W-8-tw(s2,1),y,1,'#8f86a8',null)}y+=10;line(supName(h,sk)+': '+(sk?h.sd2:h.sd),'#ffffff');y+=2;
  if(rk<5&&y<H-26){const c=SV.mast[h.id]||0;line('RANK '+(rk+1)+' AT '+MR[rk]+' CALMED ('+c+'): '+(rk===2?h.s2:MRW[rk].toUpperCase()),'#8f86a8')}}
 if(G.noteT>0){r('#0c0a1c',0,H-28,W,14);ctext(G.note,H-26,1,'#ff8aa0',null)}ctext(open?'A: GO    B: BACK':'B: BACK',H-13,1,'#8f86a8',null)}
function drawTrail(){back();const n=GOALS.filter(q=>SV.done[q.id]).length;head("KEEPER'S TRAIL",n+' / '+GOALS.length);const rh=31,vis=Math.max(3,Math.floor((H-42)/rh)),top=cl(G.gi-((vis/2)|0),0,Math.max(0,GOALS.length-vis));
 for(let i=top;i<Math.min(GOALS.length,top+vis);i++){const q=GOALS[i],y=25+(i-top)*rh,on=i===G.gi,dn=!!SV.done[q.id],[a,b]=q.p(SV.stat),f=q.f||String;tile(5,y,230,rh-3,on);
  r(K,9,y+4,9,9);r(dn?'#58c048':on?'#c8b060':'#2a2c46',10,y+5,7,7);if(dn){r('#ffffff',11,y+8,2,2);r('#ffffff',13,y+9,1,2);r('#ffffff',14,y+6,2,4)}
  text(q.n,22,y+3,1,on?'#281c30':dn?'#a8f080':'#f8e060',null);const pg=dn?'DONE':f(Math.min(a,b))+' / '+f(b);text(pg,W-10-tw(pg,1),y+3,1,on?'#281c30':'#8f86a8',null);
  text(q.d,22,y+14,1,on?'#4a3a50':'#a8a0c0',null);const rw=q.rw;if(tw(q.d,1)+tw(rw,1)<196)text(rw,W-10-tw(rw,1),y+14,1,on?'#a02848':'#ff8aa0',null);
  if(!dn){r(K,22,y+25,206,2);r('#58c048',22,y+25,Math.round(206*Math.min(1,a/b)),2)}}
 const q=GOALS[G.gi];r('#0c0a1c',0,H-28,W,28);if(G.noteT>0)ctext(G.note,H-26,1,'#a8f080',null);else ctext('REWARD: '+q.rw.toUpperCase(),H-26,1,'#ff8aa0',null);ctext('A: BACK',H-13,1,'#8f86a8',null)}
/* ---------- the super: a cut-in the way Knockout does them, then a short scene of its own ---------- */
function cutIn(t,h,k){const cy=Math.round(H/2),e=Math.min(1,t/.18),sl=Math.round((1-e)*W),img=headOf(h);r('#0c0810',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.3);
 r(h.col,-W+sl*1.5,-66,W*2,24);r(h.col,-W-sl*1.5,42,W*2,24);r('#f8e060',-W-sl,-36,W*2,72);r('#141018',-W+sl,-32,W*2,4);r('#141018',-W+sl,28,W*2,4);
 for(let i=0;i<70;i++){const px=-W+((i*29+t*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.22)',Math.round(px),py,3,3)}g.restore();if(!img)return;
 const S=Math.max(3,Math.min(6,Math.floor(H/50))),hw=img.width*S,hh=img.height*S,px=Math.round(W/2-hw/2+(1-e)*130),py=Math.round(cy-hh/2-14+(t>.22&&t<.3?R(-3,3):0));
 g.drawImage(img,px,py,hw,hh);if(t>.22){const sn=supName(h,k);ctext(sn,py+hh+14,tw(sn,4)>W-8?3:4,'#ffffff','#141018');ctext('SUPER  -  '+h.n,py+hh+40,1,'#f8e060',null)}}
function scene(h,t){const cy=Math.round(H/2),id=h.id,hd=headOf(h);r('#0c0810',0,0,W,H);
 const big=(s,y,c='#ffffff')=>ctext(s,Math.round(y),tw(s,3)>W-8?2:3,c,'#141018'),hed=(x,y,sc=4,img=hd)=>{if(img)g.drawImage(img,Math.round(x),Math.round(y),img.width*sc,img.height*sc)};
 if(id==='will'){ /* Bibi, at the desk, beams the idea in. The keeper thinks it is his own. */
  r('#182028',0,cy+30,W,H);r('#2a3440',10,cy+26,124,8);
  for(let i=0;i<3;i++){const x=14+i*40,y=cy-34;r('#101418',x-2,y-2,36,36);r('#0c2a1c',x,y,32,30);if(i===1){try{g.drawImage(A.ko().CH.find(q=>q.id==='bibi').head,x,y-1,32,32)}catch(e){}}else for(let j=0;j<4;j++)r('#2a8a5a',x+3,y+4+j*6,Math.round(6+((t*70+j*17+i*9)%22)),3);r('rgba(64,255,144,.14)',x,y+((t*40)|0)%28,32,2);r('#101418',x+12,y+34,8,6)}
  text('HASBARA DESK',16,cy+40,1,'#40ff90',null);hed(166,cy-10);
  if(t>.3){const k=Math.min(1,(t-.3)/.4);g.globalAlpha=.5+.3*Math.sin(t*40);g.strokeStyle='#f8e060';g.lineWidth=4;g.beginPath();g.moveTo(88,cy-18);g.lineTo(88+96*k,cy-18+16*k);g.stroke();g.globalAlpha=1}
  if(t>.8){r(K,193,cy-38,12,14);r('#f8e060',194,cy-37,10,10);r('#fff8c0',196,cy-35,4,5);r('#8088a0',196,cy-27,6,3);big('I JUST HAD AN IDEA.',cy+62)}}
 else if(id==='marcus'){r('#2a2018',0,cy+34,W,H);r('#6a4830',20,cy+30,200,6);hed(22,cy-44);const x=150,y=cy+30;
  r(K,x-11,y-11,22,11);r('#a8d8ff',x-10,y-10,20,10);r('#d0f0ff',x-8,y-9,4,8);r(K,x-4,y-37,8,27);r('#78b8f8',x-3,y-36,6,26);r('#d0f0ff',x-2,y-34,2,22);r('#a8d8ff',x+8,y-18,14,4);r('#98a0b0',x+20,y-22,5,8);
  if(t<.7){const f=((t*30)|0)%2;r('#f8a030',x+27+f,y-24,8,4);r('#fff8a0',x+27,y-23,4,2);r('#383048',x+35,y-26,10,8)}
  else{const k=t-.7;for(let i=0;i<16;i++){const a=i*1.7,d=k*(60+i*9),rad=10+k*(26+i%5*6);g.globalAlpha=Math.max(0,.5-k*.12);g.fillStyle='#f0f0f8';g.beginPath();g.arc(x+Math.cos(a)*d,y-30+Math.sin(a)*d*.7,rad,0,7);g.fill()}g.globalAlpha=1}
  if(t>.9)big('BRO.',cy+56)}
 else if(id==='erin'){r('#88d0f8',0,0,W,H);r('#b8e4ff',0,cy+20,W,H);for(let i=0;i<4;i++){const x=((i*90-t*60)%300+300)%300-40,y=30+i*((H-80)/4);r('#ffffff',x,y,40,8);r('#ffffff',x+8,y-5,22,6)}
  const a=t*4.2,x=120+Math.cos(a)*(40+t*28),y=cy-10+Math.sin(a)*34;g.save();g.translate(Math.round(x),Math.round(y));g.scale(3,3);r('#f4f4f0',-14,-3,28,3);r('#d8d8e0',-10,0,20,2);try{g.drawImage(A.LOU.r[0],-10,-13)}catch(e){}r('#f4f4f0',-5,-5,11,2);g.restore();
  hed(8,H-66,3);if(t>1)big('GOOD BOY.',cy+70,'#f8a0c8')}
 else if(id==='derek'){r('#283040',0,0,W,H);r('#383848',0,cy-34,W,84);for(let i=0;i<6;i++)r('#f8e060',((i*50-t*500)%300+300)%300-30,cy+44,24,3);
  const x=Math.round(-120+t*250),y=cy+34;for(let i=0;i<5;i++){const k=(t*3+i*.3)%1;r('#c8d0dc',x-90-i*22,y-10-Math.sin(k*3.14)*22,4,6)}truck(x,y,1,3);
  if(t>.9)big('ON TIME. EVERY TIME.',cy+70)}
 else if(id==='mama'){const sh=t<1.4?Math.round(Math.sin(t*50)*3):0;r('#983848',0,0,W,H);r('#7a2434',0,cy+40,W,H);hed(8,cy-64,3);
  const j=Math.round(Math.abs(Math.sin(t*12))*14),x=132+sh,y=cy+40-j; /* Ruby: pink hoodie, black leggings, white sneakers */
  r(K,x-13,y-48,26,22);r('#e8b890',x-11,y-44,22,16);r('#2e1e1a',x-11,y-46,22,6);r(K,x-7,y-37,3,3);r(K,x+4,y-37,3,3);r('#8a4840',x-4,y-31,8,3);r('#f078a8',x-12,y-28,24,18);r('#f8a0c8',x-12,y-28,24,3);r('#f078a8',x-18,y-32,6,12);r('#f078a8',x+12,y-32,6,12);r('#181020',x-9,y-10,7,8);r('#181020',x+2,y-10,7,8);r('#f4f4f0',x-10,y-2,9,4);r('#f4f4f0',x+1,y-2,9,4);
  if(j<3)for(let i=0;i<3;i++){r('#f8e060',x-30-i*8,y+2,6,2);r('#f8e060',x+24+i*8,y+2,6,2)}
  g.save();g.translate(W/2+30+sh,cy-66);const k=1+Math.abs(Math.sin(t*12))*.4;g.scale(k,k);text('NO!',-tw('NO!',5)/2,-12,5,'#f8e060','#141018');g.restore();if(t>1)big("RUBY. MOMMY'S BUSY.",cy+62)}
 else if(id==='corbin'){r('#f078a8',0,0,W,H);for(let i=0;i<14;i++){const x=(i*53)%W,y=(H+40)-((t*70+i*37)%(H+40)),c=i%2?'#ffffff':'#c02030';r(c,x,y,3,3);r(c,x+4,y,3,3);r(c,x,y+2,7,3);r(c,x+1,y+5,5,1);r(c,x+2,y+6,3,1)}
  if(hd)hed(120-hd.width*3,cy-hd.height*3-24,6);big('CAN I GET A KISS?',cy+44);if(t>1)ctext('...MAN?',cy+66,2,'#ffffff','#141018')}
 else if(id==='scout'){r('#3c8840',0,0,W,H);const x=24,y=cy-74;r(K,x-2,y-2,164,124);r('#f0e8d0',x,y,160,120);r('#c04848',x+18,y,1,120);for(let i=1;i<9;i++)r('#b8c8d8',x+2,y+i*13,156,1);
  ['CINDERCAP','ZIPWIG','PEBBLIT'].forEach((b,i)=>{if(t>i*.35){g.drawImage(bspr(b,26,0,0),x+26,y+8+i*36,26,26);text(b,x+60,y+12+i*36,1,'#383048',null);if(t>i*.35+.2){r('#3c8840',x+62,y+26+i*36,3,3);r('#3c8840',x+65,y+29+i*36,3,3);r('#3c8840',x+68,y+23+i*36,3,6)}}});
  hed(196,cy-30,3);if(t>1.1)big('WRITING THAT DOWN.',cy+62)}
 else if(id==='ranger'){r('#283848',0,0,W,H);g.fillStyle='#506838';g.beginPath();g.moveTo(0,cy-60);g.lineTo(W,cy+50);g.lineTo(W,H);g.lineTo(0,H);g.fill();hed(190,Math.max(4,cy-120),3);
  for(let i=0;i<7;i++){const u=(t*.9+i*.17)%1,x=u*W,y=cy-60+u*110-Math.abs(Math.sin(u*14+i))*18;rock(Math.round(x),Math.round(y),8+i%3*3)}
  if(t>.9)big('MIND YOUR HEADS.',cy+84)}
 else if(id==='bibi'){r('#24304c',0,0,W,H);r('#1a2238',0,cy+36,W,H);r('#f8d030',0,cy+36,W,2);r(K,96,cy+2,48,40);r('#3a5a9a',98,cy+4,44,38);r('#f8d030',112,cy+14,16,10);if(hd)hed(120-hd.width*2,cy-hd.height*4+6,4);
  ['CINDERCAP','PEBBLIT','DRIZZLET','ZIPWIG','FERNFANG','CLOVERIMP'].forEach((b,i)=>{if(t>.25+i*.15){const L=i<3,x=L?8+i*28:W-34-(i-3)*28;g.drawImage(bspr(b,26,0,L),x,cy+38-(((t*8+i)|0)%2)*2,26,26)}});
  if(t>1.1)big('THE COALITION HOLDS.',cy+78)}
 else{r('#101420',0,0,W,H);for(let i=0;i<6;i++){const x=8+i*38;r('#2a3040',x,cy-74,30,90);for(let j=0;j<8;j++)r(((t*9+i*3+j)|0)%3?'#40a0ff':'#40ff90',x+4+(j%2)*12,cy-68+j*10,8,3)}
  hed(10,cy+26,3);const dn=t>.8;r(K,150,cy+30,50,24);r('#585070',152,cy+32,46,20);r('#801020',160,cy+(dn?26:18),30,dn?8:16);r('#e83040',162,cy+(dn?26:18),26,dn?6:13);text('DO NOT PRESS',140,cy+58,1,'#e83040',null);
  if(dn){g.globalAlpha=Math.min(1,(t-.8)/.5);r('#ffffff',0,0,W,H);g.globalAlpha=1;if(t>1.2)big('OOPS IN ADVANCE.',cy-8,'#f8e060')}}}
/* the second supers share one stage: the keeper, the thing itself, their line */
function scene2(h,t){const cy=Math.round(H/2),id=h.id,hd=headOf(h),x=158,y=cy+6;r('#0c0810',0,0,W,H);r(h.col,0,cy-52,W,96);r('rgba(12,8,16,.45)',0,cy-52,W,96);r('#f8e060',0,cy-52,W,2);r('#f8e060',0,cy+42,W,2);
 for(let i=0;i<12;i++)r('rgba(255,255,255,.12)',((i*41+t*300)%(W+40))-20,cy-46+(i*7)%84,18,1);
 if(hd)g.drawImage(hd,14,Math.round(cy-hd.height*2.5-4),hd.width*5,hd.height*5);
 if(id==='will'){for(let i=0;i<3;i++){const bx=Math.round(120+((t*220+i*60)%170)),by=y-22+i*20;r(K,bx-9,by-1,7,7);r(K,bx+5,by-1,7,7);r('#98a0b0',bx-7,by+1,3,3);r('#98a0b0',bx+7,by+1,3,3);r('#e23b5e',bx-6,by-4,14,2);r('#e23b5e',bx+2,by-8,2,5);r(K,bx-2,by-10,7,2)}r('#58c048',112,y+34,120,3)}
 else if(id==='erin'){for(let i=0;i<14;i++)sprout2(116+((i*23+t*160)%120),y-18+(i%4)*14,[4,0,2,3,1,5][i%6],((t*12+i)|0)%2)}
 else if(id==='marcus'){const w=Math.abs(Math.cos(t*14))*22+2;r(K,x-w/2-1,y-23,w+2,46);r('#f8d030',x-w/2,y-22,w,44);r('#fff8a0',x-w/2,y-22,Math.max(1,w/4),44);if(w>14)text('$',x-4,y-8,3,'#805018',null)}
 else if(id==='derek'){r(K,x-34,y-4,30,12);r('#98a0b0',x-33,y-3,28,10);r(K,x+6,y-4,30,12);r('#98a0b0',x+7,y-3,28,10);for(let i=0;i<9;i++){const a=-1.57+(i-4)*.2,d=(t*90+i*9)%46;r(i%2?'#78b8f8':'#b0e0f8',x+Math.cos(a)*d,y+Math.sin(a)*d,4,6)}}
 else if(id==='mama'){const bx=Math.round(250-t*110);g.save();g.translate(bx,y+22);g.scale(2,2);r('rgba(0,0,0,.3)',-26,-1,52,3);r(K,-27,-19,54,17);r('#f4f4f0',-26,-18,52,15);r(K,-18,-27,34,10);r('#f4f4f0',-17,-26,32,9);r('#78b8f8',-15,-25,13,7);r('#78b8f8',1,-25,13,7);r(K,-20,-5,9,7);r(K,11,-5,9,7);r('#e83040',-26,-14,2,4);g.restore();if(((t*6)|0)%2)text('BEEP',bx-70,y-30,1,'#f8e060',null)}
 else if(id==='corbin'){r(K,x-20,y-22,40,44);r('#181020',x-18,y-20,36,40);r('#f4f4f0',x-6,y-20,12,40);r(K,x-8,y-12,16,7);r('#c02030',x-7,y-11,5,5);r('#c02030',x+2,y-11,5,5);g.globalAlpha=.5+.4*Math.sin(t*9);text('007',x-13,y+26,3,'#f8e060',null);g.globalAlpha=1}
 else if(id==='scout'){g.globalAlpha=.35+.15*Math.sin(t*8);g.fillStyle='#f8e896';g.beginPath();g.arc(x,y,34,0,7);g.fill();g.globalAlpha=1;g.drawImage(bspr('LANTERNWISP',44,0,0),x-22,y-22-Math.round(Math.sin(t*5)*3),44,44)}
 else if(id==='ranger'){g.globalAlpha=.3;g.fillStyle='#f8e060';g.beginPath();g.arc(x+10,y-18,30,0,7);g.fill();g.globalAlpha=1;r(K,x-3,y-30,6,62);r('#805030',x-2,y-29,4,60);r(K,x-18,y-28,30,10);r('#e8c888',x-17,y-27,28,8);r(K,x+6,y-18,10,12);r('#fff8a0',x+7,y-17,8,10)}
 else if(id==='bibi'){g.strokeStyle='#a8c8ff';for(let i=0;i<3;i++){g.globalAlpha=.9-i*.25;g.lineWidth=3-i;g.beginPath();g.arc(x,y+30,30+i*10+Math.sin(t*6)*2,Math.PI,TAU);g.stroke()}g.globalAlpha=1;r('#f8d030',x-34,y+30,68,2);drawHero(h,x,y+28,0,1,0,2)}
 else{for(let i=0;i<4;i++){const bx=110+i*30,by=y-26+((t*120+i*31)%70);r(K,bx-7,by-3,14,7);r('#aab2c0',bx-6,by-2,12,5);r('#40a0ff',bx-2,by-1,4,2);r('#e4eaf2',bx-12,by-5,8,2);r('#e4eaf2',bx+4,by-5,8,2);r('#f8a030',bx-1,by+5,2,6)}}
 ctext(h.s2,cy-74,tw(h.s2,4)>W-8?3:4,'#ffffff','#141018');if(t>.5)ctext(h.q2,cy+56,tw(h.q2,3)>W-8?2:3,'#f8e060','#141018')}
function drawSuper(){const u=G.su;if(u.t<.75)cutIn(u.t,u.h,u.k);else if(u.k)scene2(u.h,u.t-.75);else scene(u.h,u.t-.75)}
function drawShop(){back();head('SUNKEEP');seedsTag(5);const rh=Math.min(40,Math.floor((H-52)/UPS.length));
 UPS.forEach((u,i)=>{const y=25+i*rh,on=i===G.ui,lv=SV.up[u.id];tile(5,y,230,rh-3,on);text(u.n,10,y+3,1,on?'#281c30':'#f8e060',null);if(rh>=30)text(u.d,10,y+15,1,on?'#4a3a50':'#a8a0c0',null);
  for(let k=0;k<3;k++){r(K,170+k*8,y+4,6,6);r(k<lv?'#58c048':on?'#c8b060':'#2a2c46',171+k*8,y+5,4,4)}const c=lv>=3?'MAX':String(u.c[lv]);text(c,W-10-tw(c,1),y+3,1,on?'#281c30':SV.seeds>=u.c[lv]||lv>=3?'#a8f080':'#8f86a8',null)});
 if(G.noteT>0)ctext(G.note,H-26,1,'#ff8aa0',null);ctext('A: BUY    B: BACK',H-13,1,'#8f86a8',null)}
function drawCards(){drawPlay();r('rgba(8,6,24,.78)',0,0,W,H);const n=G.cards.length,chh=Math.min(64,Math.floor((H-62)/Math.max(3,n))),y0=Math.round((H-(n*(chh+4))-34)/2)+26;
 ctext(G.find?'A FIND FROM THE VALLEY':G.gift?'A GIFT OF LIGHT':'LEVEL '+RN.lv+'!',y0-24,tw('A FIND FROM THE VALLEY',3)>W-8&&G.find?2:3,'#f8e060');
 G.cards.forEach((c,i)=>{const y=y0+i*(chh+4),on=i===G.ci,sl=Math.max(0,1-((G.ct||0)-i*.07)/.22),ofs=Math.round(sl*sl*W);g.save();g.translate(ofs,0);tile(8,y,224,chh,on);if(c.k==='r'){r('#f8a030',8,y,224,1);r('#f8a030',8,y+chh-1,224,1)}r(on?'#281c30':'#0c0a1c',12,y+4,22,chh-8);
  if(c.k==='r')ricon(c.r.id,17,Math.round(y+chh/2-6));else if(c.k==='w')sprout2(23,y+chh/2+10,c.t,on&&((G.t*6)|0)%2);else icon(c.k==='p'?c.p.id:'berry',17,y+chh/2-6);
  text(cardName(c),39,y+4,chh>=50?2:1,on?'#281c30':'#f8e060',null);const s=cardSub(c);if(s)text(s,W-13-tw(s,1),y+5,1,on?'#a02848':s==='NEW'?'#ff8aa0':'#a8f080',null);
  wrap(cardDesc(c),186,1).slice(0,chh>=50?3:2).forEach((l,k)=>text(l,39,y+(chh>=50?19:16)+k*11,1,on?'#281c30':'#d8d0ec',null));g.restore()});
 const f=G.lock>0?'...':'A: TAKE IT'+(RN.rr>0&&G.cards[0].k!=='b'?'    SELECT: REROLL ('+RN.rr+')':'');ctext(f,Math.min(H-13,y0+n*(chh+4)+2),1,'#c8c0d8',null)}
function drawPause(){drawPlay();r('rgba(8,6,24,.8)',0,0,W,H);const y=Math.round(H*.2);ctext('PAUSED',y,3,'#f8e060');['RESUME','START OVER','GO HOME'].forEach((m,i)=>{const on=i===G.pi;tile(54,y+26+i*20,132,17,on);text(m,Math.round(120-tw(m,1)/2),y+30+i*20,1,on?'#281c30':'#d8d0ec',null)});
 const N=RN;let yy=y+94;for(let t=0;t<6;t++)if(N.w[t]&&yy<H-14){sprout(20,yy+9,t);text(WP[t].n+'  LV '+N.w[t],30,yy,1,'#ffffff',null);yy+=12}for(const p of PS)if(N.p[p.id]&&yy<H-14){text(p.n+'  LV '+N.p[p.id],30,yy,1,'#a8f080',null);yy+=12}for(const q of RL)if(N.r[q.id]&&yy<H-14){text(q.n,30,yy,1,'#f8a030',null);yy+=12}}
function drawReport(){back();const R_=G.rep;head('EXPEDITION REPORT');let y=Math.round(Math.max(26,H*.12));
 ctext(R_.won?'THE HOLLOW REMEMBERS':'THE LIGHT WENT OUT',y,3,R_.won?'#f8e060':'#c8c0d8');y+=20;
 wrap(R_.won?(R_.first?'Pythorn curls back up on its circus trunk, bright again. One Sigil stone is home.':'Pythorn is lit again. Its stone hums at the Lantern.'):R_.t>=BOSS_AT?'So close. Pythorn was awake. Louie dragged you home by the collar.':'Louie dragged you home by the collar. The sprouts walked back by themselves.',220,1).forEach(l=>{ctext(l,y,1,'#ffffff',null);y+=11});y+=6;
 const rows=[['LASTED',mmss(R_.t)],['BUDDIES CALMED',String(R_.calm)],['LEVEL',String(R_.lv)]];rows.forEach(q=>{tile(30,y,180,15,0);text(q[0],36,y+3,1,'#d8d0ec',null);text(q[1],W-36-tw(q[1],1),y+3,1,'#f8e060',null);y+=17});
 tile(30,y,180,19,1);icon('seed',34,y+3);text('SEEDS HOME',50,y+5,1,'#281c30',null);const s='+'+R_.seeds;text(s,W-36-tw(s,2),y+4,2,'#281c30',null);y+=25;
 if(R_.rec.length&&y<H-40){ctext('NEW RECORD: '+R_.rec.join(', '),y,1,'#ff8aa0',null);y+=13}
 if(R_.kr&&y<H-40){const k=R_.kr,s='KEEPER RANK '+k[0];text(s,30,y,1,R_.kup?'#f8e060':'#d8d0ec',null);r(K,110,y+2,100,6);r('#2a2c46',111,y+3,98,4);r('#f8a030',111,y+3,Math.round(98*k[1]/k[2]),4);y+=12;if(R_.kup){ctext('RANK UP!  +'+R_.kpay+' SEEDS',y,1,'#f8e060',null);y+=12}}
 if(R_.rank&&y<H-40){ctext(R_.hero.n+' IS RANK '+R_.rank+': '+MRW[R_.rank-1].toUpperCase(),y,1,'#f8a030',null);y+=13}
 for(const q of R_.un)if(y<H-40){r('#1d2b18',10,y-2,220,13);r('#58c048',10,y-2,2,13);const s='TRAIL: '+q.rw.toUpperCase();if(tw(s,1)>212){g.save();g.translate(16,0);g.scale(212/tw(s,1),1);text(s,0,y,1,'#a8f080',null);g.restore()}else text(s,16,y,1,'#a8f080',null);y+=15}
 let x=120-(R_.w.filter(v=>v).length*14)/2;if(y<H-40)for(let t=0;t<6;t++)if(R_.w[t]){sprout(x+6,y+12,t,0,1);x+=14}
 if(G.lock<=0){ctext('A: GO AGAIN',H-26,2,'#f8e060');ctext('B: SUNKEEP ('+SV.seeds+' SEEDS)    SELECT: TITLE',H-12,1,'#8f86a8',null)}}
function draw(){H=A.H();
 switch(G.s){case 'title':drawTitle();break;case 'story':drawStory();break;case 'how':drawHow();break;case 'pick':drawPick();break;case 'shop':drawShop();break;case 'trail':drawTrail();break;case 'super':drawSuper();break;case 'play':drawPlay();break;case 'cards':drawCards();break;case 'pause':drawPause();break;case 'report':drawReport();break}}

/* put the phone down: the expedition pauses */
try{document.addEventListener('visibilitychange',()=>{if(A.active()&&document.hidden&&G.s==='play'&&RN&&!RN.dead&&!RN.won){G.s='pause';G.pi=0}})}catch(e){}

/* ---------- cartridge label ---------- */
(()=>{const a=document.getElementById('cartArt6');if(!a||!a.getContext)return;const x=a.getContext('2d'),p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};
 p('#0a0820',0,0,40,26);p('#2f7a3c',12,8,16,14);p('#4a9e50',14,6,12,18);p('#4a9e50',10,10,20,10);p('#58b858',15,9,10,12);
 p('#f8e060',19,10,3,5);p('#fff8c0',20,11,1,2);p('#282038',20,15,1,4);
 [['#f07830',14,17],['#48a0f0',24,18],['#f0d020',17,20],['#f078c0',23,13],['#58c048',13,12]].forEach(([c,X,Y])=>{p('#282038',X-1,Y-1,5,5);p(c,X,Y,3,3);p('#70d850',X+1,Y-2,1,1)});
 [[3,5],[33,4],[5,20],[34,19],[2,12],[36,12]].forEach(([X,Y],i)=>{p(i%3?'#c890ff':'#ff70a0',X,Y,1,1);p(i%3?'#c890ff':'#ff70a0',X+3,Y,1,1)})})();

return{
 start(){G.s='title';G.mi=0;G.t=0;G.rep=null;G.from=''},
 mus:()=>'game',
 paused:()=>G.s==='pause'||G.s==='cards',
 update,draw,
 _:{RL,RADIO,krOf,supOf,radio,HERO,GOALS,MR,rankOf,heroOf,checkGoals,doA,doSuper,startSuper,G,get RN(){return RN},get SV(){return SV},set SV(v){SV=v},WP,PS,UPS,EN,EVENTS,BOSS_AT,KEY,newRun,spawn,ring,calm,hit,hurt,gain,deal,take,options,finish,mul,store,near,syncSwarm}};
};
