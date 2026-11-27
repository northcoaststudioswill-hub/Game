/* ---------- cartridge 3: ROOTDEEP (by lil Bottie for Will; ported into Pocket Lantern v20) ---------- */
(()=>{const a=$('cartArt3');if(!a||!a.getContext)return;const x=a.getContext('2d'),p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};
 p('#241a20',0,0,40,26);p('#171020',0,0,40,7);
 [[4,2],[15,4],[33,3],[26,5]].forEach(([X,Y])=>p('#8d84a8',X,Y,1,1));
 p('#ffd94d',17,1,6,5);p('#fff3b0',19,2,2,3);p('#3a2c1c',16,0,8,1);
 p('#4a3040',2,7,3,12);p('#4a3040',10,7,2,9);p('#4a3040',29,7,3,13);p('#4a3040',36,7,2,8);
 p('#4a3040',3,16,6,2);p('#4a3040',30,18,6,2);
 p('#c8c0d8',19,10,2,11);p('#f8d030',16,15,8,2);p('#8a5a2c',19,17,2,4);
 p('#58c048',14,9,4,2);p('#58c048',23,9,4,2);p('#2c6030',18,8,4,2);})();
/* =====================================================================
   CARTRIDGE 2: ROOTDEEP  (by lil Bottie for Will, 2026-11-13, v2)
   Replaces the first cartridge-2 game (Mothlight) at Will's word:
   "too basic — matching in depth, think Hades." So this is a full
   roguelite in the Sprouts world, built to Hades' structure:

   - THE HEARTH (hub): walk between the Mirror, Armory, Keepsake shelf,
     Codex and Heat Gate; Erin, Louie, Ranger, Marcus and Scout stand
     around with dialogue that advances across runs, deaths and escapes.
     Gift them Honey to earn their Keepsakes.
   - RUNS: 12 chambers through 3 biomes (The Burrows, The Flooded Vault,
     The Ember Core). Clear a chamber, pick 1 of 2 reward doors, fight on.
     Bosses at chambers 4, 8 and 12. Death sends you home with your
     Moondew, Keys and Honey intact — petals and boons burn.
   - BOONS: 6 garden gods (the sprout types, grown old and strange) each
     offer Attack / Cast / Dash core boons + 2 passives, in Common /
     Rare / Epic, levelled by Sunfruit (poms), plus 4 duo boons.
   - META: Mirror of Dew upgrades (8 rows), 3 weapons (unlock + swap),
     5 Keepsakes (level by carrying them), a Pact of Roots heat system
     with per-boss Dew bounties, and a Codex of everything you've met.

   Controls (console): D-pad move · A attack · B cast · double-tap a
   direction to dash · START pause / build. (SELECT is only a spare:
   it skips the intro and ejects the cartridge in the Hearth — no
   gameplay verb lives on it.) Keyboard: arrows/WASD, Space/Z = A,
   X/K = B (cast), double-tap a direction to dash, Enter/P = Start.

   For whoever picks this up next (hi, Claude): everything lives in
   this one block, prefixed RD/rd/g3. It reuses ONLY the console
   services a cartridge gets: canvas `g`, W x H, r/text/ctext/tw/nav,
   keys/pressed, snd/noise/later, and the shared eject(). Its save key
   is 'rootdeep-v1'; it never touches 'sprouts-v2' or Sprouts state.
   Routing hooks in the console code: cartPick records cart,
   boot calls g3StartTitle(), update()/draw() delegate any state that
   starts with 'g3'. window.__g.RD() / .RDF() expose state + test
   helpers, same spirit as Sprouts' own __g.
   ===================================================================== */

/* ---------------- data: gods & boons ---------------- */
const GODS={
 EMBER:{n:'EMBER', t:'THE FIRST FLAME',   c:'#f07830', l:'#f8c070'},
 PEB:  {n:'PEB',   t:'THE PATIENT STONE', c:'#98a0b0', l:'#dce2ea'},
 DEW:  {n:'DEW',   t:'THE UNDERSEA',      c:'#48a0f0', l:'#b0e0f8'},
 ZIP:  {n:'ZIP',   t:'THE STORM SEED',    c:'#f0d020', l:'#fff8a0'},
 LEAF: {n:'LEAF',  t:'THE GREEN MOTHER',  c:'#58c048', l:'#b0f090'},
 LUCKY:{n:'LUCKY', t:'THE SIXTH PETAL',   c:'#f078c0', l:'#ffc8e8'}};
const GODIDS=Object.keys(GODS);
/* core boons: v = headline % at Common, per-level growth in rdBoonVal */
const CORES={
 atk:{n:{EMBER:'FLAME STRIKE',PEB:'STONE EDGE',DEW:'TIDE EDGE',ZIP:'STORM EDGE',LEAF:'THORN EDGE',LUCKY:'FORTUNE EDGE'},v:35,
      d:{EMBER:'Attacks burn foes',PEB:'Attacks hit harder, big knockback',DEW:'Attacks chill foes',ZIP:'Attacks may call chain lightning',LEAF:'Attacks sometimes heal you',LUCKY:'Attacks crit far more often'}},
 cast:{n:{EMBER:'FIREBLOOM',PEB:'BOULDERFALL',DEW:'BREAKING WAVE',ZIP:'SKY JUDGEMENT',LEAF:'SNARING VINE',LUCKY:'WILD SEED'},v:45,
      d:{EMBER:'Cast explodes and burns',PEB:'Cast drops a boulder from above',DEW:'Cast knocks back and chills',ZIP:'Cast strikes 3 foes with lightning',LEAF:'Cast roots a foe and blooms a heal',LUCKY:'Cast deals wild random damage'}},
 dash:{n:{EMBER:'ASHEN WAKE',PEB:'BULWARK DASH',DEW:'MIST STEP',ZIP:'BOLT STEP',LEAF:'VERDANT STEP',LUCKY:'SIXTH SENSE'},v:14,
      d:{EMBER:'Dash leaves a flame trail',PEB:'Dash grants stone armour',DEW:'Dash splashes chill around you',ZIP:'Dash strikes the nearest foe',LEAF:'Dash heals a little',LUCKY:'Dash often recharges instantly'}}};
const PASSES=[
 {god:'EMBER',id:'heart', n:'KINDLED HEART', d:'+25 max health',            v:25},
 {god:'EMBER',id:'firewall',n:'FIREWALL',    d:'Burns deal +60% damage',    v:60},
 {god:'PEB',  id:'skin',   n:'STONE SKIN',   d:'Take 8% less damage',       v:8},
 {god:'PEB',  id:'heavy',  n:'HEAVY BLOWS',  d:'+15% damage to bosses',     v:15},
 {god:'DEW',  id:'rain',   n:'MENDING RAIN', d:'Heal 5 after each chamber', v:5},
 {god:'DEW',  id:'breath', n:'DEEP BREATH',  d:'Cast recharges 25% faster', v:25},
 {god:'ZIP',  id:'stormluck',n:'STORM LUCK', d:'+8% crit chance',           v:8},
 {god:'ZIP',  id:'quick',  n:'QUICKENING',   d:'+8% move speed',            v:8},
 {god:'LEAF', id:'synth',  n:'PHOTOSYNTH',   d:'Slowly regrow health',      v:1},
 {god:'LEAF', id:'bloom',  n:'FULL BLOOM',   d:'All healing +50%',          v:50},
 {god:'LUCKY',id:'fortune',n:'FORTUNE',      d:'+30% petals from foes',     v:30},
 {god:'LUCKY',id:'wind',   n:'SECOND WIND',  d:'+1 dash charge',            v:1}];
const DUOS=[
 {gods:['EMBER','ZIP'], id:'wildfire', n:'WILDFIRE STORM', d:'Burning foes are struck by lightning every 2s'},
 {gods:['DEW','PEB'],   id:'mudslide', n:'MUDSLIDE',       d:'Chilled foes take +30% damage'},
 {gods:['LEAF','LUCKY'],id:'clover',   n:'CLOVER MOON',    d:'Foes sometimes drop healing blooms'},
 {gods:['EMBER','LEAF'],id:'phoenix',  n:'PHOENIX BLOOM',  d:'Death once per RUN restores 40% health instead'}];
const RARS=[['COMMON',1,'#c8c0d8'],['RARE',1.45,'#60b8f8'],['EPIC',1.95,'#f8a060']];
/* ---------------- data: weapons / mirror / keepsakes ---------------- */
const WEAPONS={
 blade:{n:'PETAL BLADE', d:'Balanced. A 3-hit blooming combo.', dmg:[13,13,19], rate:.30, range:27, arc:2.0, cost:0},
 maul: {n:'ROOT MAUL',   d:'Slow, huge arcs, big knockback.',   dmg:[30],       rate:.60, range:31, arc:2.6, cost:2, kb:170},
 bow:  {n:'THORNBOW',    d:'Rapid thorn arrows from range.',    dmg:[8],        rate:.21, range:170,arc:0,   cost:3, proj:250}};
const MIRROR=[
 {id:'vit',  n:'VITALITY',    d:'+10 max health / rank',        max:5, cost:[10,15,22,32,45]},
 {id:'might',n:'MIGHT',       d:'+5% all damage / rank',        max:5, cost:[10,15,22,32,45]},
 {id:'swift',n:'SWIFTNESS',   d:'+4% move speed / rank',        max:3, cost:[12,20,30]},
 {id:'skin', n:'BARK SKIN',   d:'-3% damage taken / rank',      max:4, cost:[12,18,26,36]},
 {id:'gold', n:'GOLDEN TOUCH',d:'+20 starting petals / rank',   max:3, cost:[8,14,22]},
 {id:'mend', n:'MENDING',     d:'+3 heal after chambers / rank',max:3, cost:[10,16,24]},
 {id:'luck', n:'OPEN HAND',   d:'Better boon rarity / rank',    max:3, cost:[14,22,32]},
 {id:'defy', n:'DEATH DEFIANCE',d:'Revive once at 50% health',  max:1, cost:[60]}];
const KEEPS=[
 {who:'ERIN',  id:'flower', n:'PRESSED FLOWER', d:'+20 max health. Heal fully after each boss.'},
 {who:'LOUIE', id:'collar', n:'OLD COLLAR',     d:'Once per RUN, a fatal hit leaves you at 20% instead.'},
 {who:'MARCUS',id:'stone',  n:'RIVER STONE',    d:'+1 cast charge, +20% cast damage.'},
 {who:'RANGER',id:'charm',  n:'BRAMBLE CHARM',  d:'Foes that touch you take damage back.'},
 {who:'SCOUT', id:'jar',    n:'BUG JAR',        d:'Foes drop 35% more Moondew.'}];
const NPCS=['ERIN','LOUIE','RANGER','MARCUS','SCOUT'];
const LINES={
 ERIN:["The lantern's warm up here, Will. Down there it's all roots and old dark.","Bring me back a story, not just dew. Though dew spends better.","Louie dug up the floor again. He's looking for the way down, I think.","Every keeper before you came back up changed. Mostly taller. Don't ask.","If the Hollow Keeper wears your face — be kind to it. Then hit it. Hard.","One day the roots will bloom instead of bite. You'll be why.","Marcus has hated everything since 2019. It's his cardio.","The bed's sprouting faster since you started diving. Coincidence, I'm sure.","Take a PEB down with you. I worry less. Slightly less. Barely less.","If a bud scatters, plant its story here. The bed remembers them all."],
 LOUIE:["WOOF. (Translation: the floor smells like adventure and old socks.)","ARF ARF. (He has packed you a stick. It is a good stick.)","WHINE... (He dreams of chasing the Grub Mother. He always wins.)","RUFF! (Translation: bring back snacks from the deep. Any snacks.)","BOOF. (He believes in you. Unconditionally. Loudly.)","GROWL. (That one was at Marcus. Marcus deserved it.)","WHINE? (He would simply like to go down too. He is told no. Daily.)","BOOF. (Translation: the grubs fear you now. He taught them to.)","SNIFF SNIFF. (You smell like deep water and courage. Mostly deep water.)"],
 RANGER:["Paths below shift like paths above. Mark your turns or don't come back.","Thornback was the garden's problem. His mother's the garden's history.","Bramble taught me: the way through is usually on fire. Ember agrees.","Take the elite doors. Cowards get common boons and common graves.","Marcus complains about the dark. Then he sleeps in it like a baby.","Patrolled the door twice today. It only whispered once. Improvement.","A string of buds at your back is a squad. Treat them like one.","Ember Core runs hot. If your boots smoke, you're close to the Keeper."],
 /* Marcus: Sprouts' Marcus (cocky "bro" hype man, "I've got a guy. The guy is me.") who also roasts everyone.
    Anything about Waterworks is a [before, after] pair: it only comes up once Waterworks is open in Sprouts (rdWaterworks).
    who also roasts everyone and everything down here. Keep both halves in every line. */
 MARCUS:["Bro. BRO. The keeper's here. Everybody act natural. Nobody here is good at it, but try.","I've watched every keeper go down that door, bro. Read my reviews. All terrible. Except mine. Mine are great.","The Drowned King. Drowned. King. Two red flags, bro. And you still wanna swim down there?","Erin says there's good in everyone. I checked, personally. There's less than she thinks, bro.","Scout wrote forty pages on the grubs. I read every one. I hate the pages AND the grubs.",["If you don't come back, I'm telling everyone you owed me money. Big money. Business money.","If you don't come back, I'm telling everyone you owed me money. Big money. Waterworks money."],"Louie's the only one here I respect, bro. He bites his problems. You've got a sword. I guess.","The deep's been talking trash about you, bro. And honestly? Team deep.",["I've got a big idea for up top, bro. Huge. Can't say yet. I've got a guy. The guy is me.","Down there needs a lazy river. Waterworks Two. I've got a guy. The guy is me. You clear the bugs first, bro."],"I watered that sprout bed once. ONCE. Now it's in Erin's speech forever. Legacy, bro.","My honest review of the deep: one star. The star is a warning label.","See one, smack one. That's the whole philosophy down there, bro. Write it down.","You're such a J, Will. Love you, bro. Still a J.","Bro, stop J-lighting me. I never said I'd go down there. I said I'd THINK about it.","Will, you absolute J. You walked right past the Burrow. Again."],
 SCOUT:["I catalogued 40 species below! 39 want to eat you. The crab is undecided.","Mothshades blink behind you. If one winks, dash. Trust me.","Every chamber you clear, I update the Codex. Science marches on!","The Hollow Keeper collects faces. Yours is just on loan, apparently.","Marcus reviewed my Codex. One star. He said the star was generous.","Field note: LUCKY buds hum near treasure. Or near Marcus. Data's noisy.","I timed Louie's naps. He's awake for your returns. Every single one.","New Codex page: 'Pods, and why the deep keeps coughing them up.'"]};
/* ---------------- data: enemies & bosses ---------------- */
const FOES={
 grub:  {n:'GRUBLET',     hp:26, sp:40, dmg:8,  r:6, c:'#b890f0', b:'chase'},
 spitter:{n:'SPORE SPITTER',hp:20,sp:25, dmg:7,  r:6, c:'#7ac74f', b:'shoot'},
 beetle:{n:'ROOT BEETLE', hp:58, sp:31, dmg:12, r:7, c:'#a87f3f', b:'charge'},
 shade: {n:'MOTHSHADE',   hp:22, sp:48, dmg:10, r:6, c:'#6a5a96', b:'blink'},
 crab:  {n:'BUBBLE CRAB', hp:46, sp:25, dmg:9,  r:7, c:'#60b8f8', b:'shield'},
 wisp:  {n:'EMBER WISP',  hp:18, sp:35, dmg:8,  r:5, c:'#f8a040', b:'orbit'}};
const BIOMES=[{n:'THE BURROWS',floor:'#312226',wall:'#3a2430',pool:['grub','grub','spitter','beetle']},
 {n:'THE FLOODED VAULT',floor:'#1a2a3a',wall:'#1d3448',pool:['crab','spitter','wisp','shade','grub']},
 {n:'THE EMBER CORE',floor:'#33191c',wall:'#48201c',pool:['wisp','shade','beetle','crab','spitter']}];
const BOSSES=[{id:'mother',n:'THE GRUB MOTHER',s:'GRUB MOTHER',hp:430,sp:30,dmg:13,r:20,c:'#c99df0'},
 {id:'king',n:'THE DROWNED KING',s:'DROWNED KING',hp:640,sp:34,dmg:15,r:18,c:'#7fd0e8'},
 {id:'hollow',n:'THE HOLLOW KEEPER',s:'HOLLOW KEEPER',hp:880,sp:52,dmg:16,r:8,c:'#e8e4f5'}];
const PACT=[
 {id:'thorns',n:'THORN PACT',  d:'Foes deal +15% damage / rank', max:2},
 {id:'swarm', n:'SWARM PACT',  d:'+25% foes per chamber / rank', max:2},
 {id:'hide',  n:'TOUGH HIDE',  d:'Foes have +20% health / rank', max:2},
 {id:'rush',  n:'RUSH PACT',   d:'Foes are +12% faster / rank',  max:1},
 {id:'dry',   n:'DRY PACT',    d:'Healing is 30% weaker',        max:1}];
/* ---------------- sprite art (drawn with Sprouts' own mk()) ---------------- */
function mkW(rows){const pal={};for(const r of rows)for(const ch of r)if(ch!=='.'&&ch!==' ')pal[ch]='#ffffff';return mk(rows,pal);}
function mkSil(rows,color){const pal={};for(const r of rows)for(const ch of r)if(ch!=='.'&&ch!==' ')pal[ch]=color;return mk(rows,pal);}
function mkOl(img,sil){const c=document.createElement('canvas');c.width=img.width+2;c.height=img.height+2;const x=c.getContext('2d');
 for(const o of[[1,0],[0,1],[2,1],[1,2],[0,0],[2,0],[0,2],[2,2]])x.drawImage(sil,o[0],o[1]);
 x.drawImage(img,1,1);return c;}
const SPR=(rows,pal)=>{const img=mk(rows,pal),hit=mkW(rows),sil=mkSil(rows,'#14101e');
 return{img,hit,ol:mkOl(img,sil),hol:mkOl(hit,sil),w:rows[0].length,h:rows.length,ow:rows[0].length+2,oh:rows.length+2};};
const RDSPR={
 grub:SPR(["..ssssssss..",".sggggggggs.","sggggggggggs","sggggggggegs","sggggggggggs",".sGGGGGGGGs.","..ssssssss..","...s....s..."],
  {s:'#5a3a78',g:'#b890f0',G:'#8858c8',e:'#241a30'}),
 spitter:SPR([".....aa.....","....aaaa....","....affa....",".....ss.....","..g..ss..g..",".ggg.ss.ggg.","..g.ssss....","....ssss....","...ss..ss...","..ss....ss.."],
  {a:'#a8e063',f:'#e8ffd0',s:'#3a7028',g:'#58a038'}),
 beetle:SPR([".....hhhh.....","....hhhh......","..BBBBBBBB....",".BbbBBBBBBBe..","BBbBBBBBBBBB..",".BbbbBBBBBB...","..l..l..l....."],
  {h:'#e8e0d0',B:'#6e5226',b:'#a87f3f',e:'#181020',l:'#4a3517'}),
 shade:SPR(["ww........ww","www......www",".wwww..wwww.","..wwwwwwww..","...dddddd...","...dy..yd...","...dddddd...","....dddd....","....d..d...."],
  {w:'#6a5a96',d:'#3a2c58',y:'#f8e060'}),
 crab:SPR([".cc........cc.","cccc......cccc",".cCCc....cCCc.","..cccccccccc..",".cccccccccccc.",".cccccccccccc.","..c..c..c..c.."],
  {c:'#60b8f8',C:'#3f7f9f'}),
 wisp:SPR([".....y......","....yyy.....","....yoy.....","...yooy.....","...yoooy....","..yoooooy...","..yowwooy...","..yowwooy...","...ooooo....","....ooo....."],
  {y:'#f8d030',o:'#f8a040',w:'#fff3b0'}),
 mother:SPR(["..ss....ss....ss....ss..",".sgggs.sgggs.sgggs.sgggs","sggggggggggggggggggggggs","sggggGGgggGGgggGGggggggs","sggggGGgggGGgggGGgggeegs","sggggGGgggGGgggGGgggeegs","sggggggggggggggggggggggs",".sGGGGGGGGGGGGGGGGGGGGs.",".ssssssssssssssssssssss.","..s..s..s..s..s..s..s..."],{s:'#4a2c5c',g:'#a87fd0',G:'#7a52a8',e:'#1c1428'}),
 king:SPR([".y.y.y.y.y............",".yyyyyyyyy............","..TTTTTTTTTT..........","..TT.TT..TT.TT........",".TwwTTwwTTwwTT........","TTTTTTTTTTTTTTTT......","TTbbbbbbbbbbbbbbT.....",".TbbbbbbbbbbbbT.......","..TTTTTTTTTT..........","...T..T..T..T........."],
  {y:'#f8d030',T:'#5fb8c8',w:'#ffffff',b:'#bdeffb'}),
 petal:SPR([".f.f.f...","fffffff..","ffyyyff..","fffffff..",".f.f.f..."],{f:'#f8a0c8',y:'#ffd94d'}),
 dew:SPR(["...d.....","..ddd....","..dwd....",".ddddd...",".ddddd...","..ddd...."],{d:'#7fd0e8',w:'#e6f7ff'}),
 heart:SPR([".hh.hh...","hhhhhhh..","hhhhhhh..",".hhhhh...","..hhh....","...h....."],{h:'#f85888'}),
 honey:SPR(["..oooo...",".oooooo..","ooOOOOoo.","oOOOOOOo.","oOOOOOOo.",".oooooo.."],{o:'#c8842a',O:'#f8b840'})};
function rdTile(base,f1,f2,planks,v){const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d');
 x.fillStyle=base;x.fillRect(0,0,32,32);let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
 if(planks){for(let i=0;i<10;i++){x.fillStyle=i%2?f1:f2;x.fillRect((rnd()*30)|0,(rnd()*30)|0,2+rnd()*2,2)}
  x.fillStyle='rgba(0,0,0,.22)';x.fillRect(0,15,32,1);x.fillRect(0,31,32,1);x.fillRect(9,0,1,15);x.fillRect(23,16,1,15);
  x.fillStyle='rgba(255,255,255,.05)';x.fillRect(0,1,32,1);x.fillRect(0,17,32,1);return c}
 for(const sy of[0,16])for(const sx of[0,16]){
  x.fillStyle='rgba(255,255,255,.05)';x.fillRect(sx,sy,16,1);x.fillRect(sx,sy,1,16);
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(sx,sy+15,16,1);x.fillRect(sx+15,sy,1,16);
  for(let i=0;i<4;i++){x.fillStyle=i%2?f1:f2;x.fillRect(sx+2+((rnd()*12)|0),sy+2+((rnd()*12)|0),2,1)}}
 x.fillStyle='rgba(0,0,0,.20)';x.fillRect(0,0,32,1);x.fillRect(0,0,1,32);
 if(v===1){x.fillStyle='rgba(0,0,0,.13)';x.fillRect(3,5,13,8);x.fillRect(18,19,11,9);x.fillStyle='rgba(255,255,255,.05)';x.fillRect(19,4,9,6)}
 if(v===2){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(6,3,1,7);x.fillRect(7,9,5,1);x.fillRect(22,18,1,8);x.fillRect(19,25,4,1);x.fillStyle=f1;x.fillRect(24,6,2,2)}
 return c;}
const RDTILE={hub:null,burrows:null,vault:null,core:null};
const RDICONS={
 mirror:SPR([".ssssssss.","sbbbbbbbbs","sbwwbbbbbs","sbwwbbbbbs","sbbbbbbbbs","sbbbbbbbbs","sbbbbbbbbs","sbbbbbbbbs",".ssssssss.","...ssss...","..ssssss.."],{s:'#8a6a3a',b:'#a8d8e8',w:'#ffffff'}),
 arm:SPR([".....ww.....",".....ww.....",".....ww.....","....wwww....","..g..ww..g..",".ggg.ww.ggg.","..g..ww..g..",".....ss.....","....ssss....","...ssssss...","..ssssssss.."],{w:'#e8ecf5',g:'#f8c040',s:'#7a4a28'}),
 keep:SPR(["ssssssssssss","sjjj.ppp..js","sjjj.ppp..js","ssssssssssss","s.bb..bb..bs","s.bb..bb..bs","ssssssssssss","s..........s"],{s:'#7a4a28',j:'#e88ab0',p:'#8ac8e8',b:'#c8586a'}),
 codex:SPR([".ssssssss.","srrrrrrrrs","srwwwwwwrs","srwwwwwwrs","srrrrrrrrs","srwwwwwwrs","srwwwwwwrs","srrrrrrrrs",".ssssssss."],{s:'#5c2438',r:'#a03a5c',w:'#f8f0d8'}),
 heat:SPR(["....ff....","...foof...","...foof...","....ff....",".ssssssss.","skkkkkkkks",".ssssssss.","...s..s...","..ss..ss.."],{f:'#f07830',o:'#f8d030',s:'#4a3428',k:'#2c2028'})};

const RDPROPS={
 plant:SPR(["....ll......","..llll..l...",".lllll.lll..","..llllllll..","...lllll....","....lll.....","..ssssssss..","..ssssssss..","...ssssss...","...ssssss..."],{l:'#58c048',s:'#a85a30'}),
 crate:SPR(["ssssssssssss","sbbbbbbbbbbs","sbbbbbbbbbbs","ssssssssssss","sbbbbbbbbbbs","sbbbbbbbbbbs","ssssssssssss"],{s:'#6a4428',b:'#8a5a30'}),
 table:SPR(["......f.........","......y.........","..ssssssssssss..",".sbbbbbbbbbbbbs.","..s..........s..","..s..........s..","..s..........s.."],{f:'#f07830',y:'#fff3b0',s:'#5a3a20',b:'#7a4a28'})};

const RDDEB={
 rock:SPR(["..ss....",".sGGs...","sGGGGs..",".ssss..."],{s:'#241a30',G:'#55496b'}),
 tuft:SPR([".g.g.g..",".g.g.g..","..ggg...",".ggggg..","..s.s..."],{g:'#6abe30',s:'#3a2c22'}),
 shard:SPR(["...t....","..ttt...","..twt...",".tttt...",".tttt..."],{t:'#58d8c8',w:'#e6fffa'}),
 bone:SPR([".w..w...","wwwwww..",".w..w..."],{w:'#e8e0d0'}),
 ember:SPR(["..o.....",".ooo....","ofooo...",".ooo...."],{o:'#f07830',f:'#f8d030'})};
const DEBBY=[[RDDEB.rock,RDDEB.tuft],[RDDEB.rock,RDDEB.bone],[RDDEB.rock,RDDEB.ember,RDDEB.shard]];

function rdTiles(){if(RDTILE.hub)return;
 const V=(b,f1,f2,pl)=>[rdTile(b,f1,f2,pl,0),rdTile(b,f1,f2,pl,1),rdTile(b,f1,f2,pl,2)];
 RDTILE.hub=V('#38262e','#423038','#2a1a20',true);
 RDTILE.burrows=V('#312226','#423038','#241619');RDTILE.vault=V('#1a2a3a','#263c52','#121e2a');RDTILE.core=V('#33191c','#472523','#221013');}

/* ================= ART (v0.2 overhaul) =================
   Rootdeep is the Sprouts valley underground, so it uses the valley's own grammar:
   16px tiles built with Sprouts' tile(), sprites at exactly 1x with a dark outline (SPR),
   and the Lantern as the light. See v0.2/handoffs/ROOTDEEP_ART_MANIFESTO.md. */
const RDPAD=(rows)=>{const w=Math.max(...rows.map(s=>s.length));return rows.map(s=>(s+'.'.repeat(w)).slice(0,w))};
/* SPR plus a gold outline for elites (no more scaling them up) */
const SPRG=(rows,pal)=>{rows=RDPAD(rows);const s=SPR(rows,pal);s.gol=mkOl(s.img,mkSil(rows,'#f8d030'));return s};
/* arena: walls are 16px on top (where the doors and lanterns are), 8px on the other sides */
const RDA={top:38,side:8,bot:8};
/* floor, wall and props per biome. Floors are mid-value so the lantern light reads on them. */
let RDART=null;
function rdArt(){if(RDART)return RDART;const T=tile;
 const earthF=v=>T(p=>{p('#64463a',0,0,16,16);[[2,3],[9,1],[12,9],[5,12],[1,8]].forEach(([a,b])=>p('#4e3430',a,b,2,1));[[7,6],[13,4],[3,14]].forEach(([a,b])=>p('#7e5c4c',a,b,1,1));
  if(v===1){p('#6e4a2a',2,7,5,1);p('#6e4a2a',6,8,4,1);p('#6e4a2a',9,9,3,1);p('#8a5e36',3,7,2,1)}
  if(v===2){p('#2e1e1a',4,9,4,2);p('#7d6058',4,7,4,3);p('#9a7c70',5,7,2,1);p('#2e1e1a',10,12,3,1);p('#7d6058',10,10,3,2)}});
 const stoneF=v=>T(p=>{p('#2f4b5c',0,0,16,16);p('#243a49',0,15,16,1);p('#243a49',15,0,1,16);p('#3d6175',0,0,15,1);p('#3d6175',0,0,1,15);[[4,5],[10,10]].forEach(([a,b])=>p('#365668',a,b,2,1));
  if(v===1){p('#1d3140',5,3,1,5);p('#1d3140',6,7,4,1);p('#1d3140',9,8,1,4)}
  if(v===2){p('#2a6aa8',3,8,9,4);p('#3888e0',4,8,7,3);p('#78b8f8',5,9,3,1);p('#a8d8ff',9,10,1,1)}});
 const ashF=v=>T(p=>{p('#3d2629',0,0,16,16);[[3,2],[11,6],[6,11],[1,13]].forEach(([a,b])=>p('#2a181b',a,b,3,1));[[8,3],[14,12]].forEach(([a,b])=>p('#5a3c3c',a,b,1,1));
  if(v===1){p('#2a181b',2,6,4,1);p('#2a181b',5,7,4,1);p('#2a181b',8,8,5,1);p('#f07830',5,7,2,1);p('#f8d030',6,7,1,1)}
  if(v===2){p('#f07830',10,12,1,1);p('#5a3c3c',4,4,2,2);p('#5a3c3c',12,2,1,1)}});
 const earthW=T(p=>{p('#3b2620',0,0,16,16);p('#24150f',0,0,16,2);p('#4b3228',0,5,16,1);p('#4b3228',0,10,16,1);p('#2e1c16',3,6,4,1);p('#2e1c16',10,11,5,1);
  p('#6e4a2a',3,2,1,6);p('#6e4a2a',4,7,1,3);p('#6e4a2a',11,2,1,4);p('#6e4a2a',12,5,1,6);p('#8a5e36',11,2,1,2);p('#58c048',4,10,1,1);p('#22150f',0,14,16,2)});
 const stoneW=T(p=>{p('#28404f',0,0,16,16);p('#16242e',0,0,16,2);p('#1d3140',0,7,16,1);p('#1d3140',7,2,1,5);p('#1d3140',3,8,1,6);p('#1d3140',12,8,1,6);p('#36566a',0,2,7,1);p('#36566a',8,8,4,1);
  p('#3c7a58',2,2,2,3);p('#3c7a58',2,5,1,3);p('#3c7a58',13,8,1,4);p('#58a070',2,2,1,1);p('#122028',0,14,16,2)});
 const ashW=T(p=>{p('#2e1a1e',0,0,16,16);p('#1a0e10',0,0,16,2);p('#3e2428',0,6,16,1);p('#3e2428',0,11,16,1);p('#f07830',4,3,1,3);p('#f07830',5,6,3,1);p('#f8d030',4,4,1,1);p('#f07830',12,8,1,3);p('#140a0c',0,14,16,2)});
 const P={
  boulderE:SPRG(['....hhhhhh','..hhHHHhhhhh','.hHHHhhhhhhhh','hHHhhhhhhhhhhd','hHhhhhhhhhhhdd','hhhhhhhhhhhhdd','hhhhhhhhhhhddd','hhhhhhhhhhdddd','.hhhhhhhdddddd','..dddddddddd'],{H:'#9a7c6a',h:'#74584a',d:'#4e3a30'}),
  boulderS:SPRG(['....hhhhhh','..hhHHHhhhhh','.hHHHhhhhhhhh','hHHhhhhhhhhhhd','hHhhhhhhhhhhdd','hhhhhhhhhhhhdd','hhhhhhhhhhhddd','hhhhhhhhhhdddd','.hhhhhhhdddddd','..dddddddddd'],{H:'#86a8b8',h:'#5e8094',d:'#3e5a6a'}),
  boulderA:SPRG(['....hhhhhh','..hhHHHhhhhh','.hHHHhhehhhhh','hHHhhhheehhhhd','hHhhhhhhehhhdd','hhhhehhhhhhhdd','hhhheehhhhhddd','hhhhhehhhhdddd','.hhhhhhhdddddd','..dddddddddd'],{H:'#6e4c52',h:'#4e343c',d:'#2e1e26',e:'#f07830'}),
  stump:SPRG(['..bbbbbbbbbb','.bTTTTTTTTTTb','.bTtttttttTTb','.bTtTTTTTtTTb','.bTTttttttTTb','..bbbbbbbbbb','..BbbBbbbBbB','..BbbBbbbBbB','.rBbbBbbbBbBr','rr.BBBBBBBB.rr'],{T:'#c89860',t:'#a87848',b:'#6a4428',B:'#4a2c18',r:'#6a4428'}),
  mush:SPRG(['...pppp','..pPPPPp..pp','.pPwPPwPp.Ppp','..ssssss.pPPp','....ss....ss','....ss....ss','...ssss..ssss'],{p:'#4aa8a0',P:'#8ae0d0',w:'#ffffff',s:'#e8dcc8'}),
  crystal:SPRG(['......w','.....tTt','....tTwTt..t','....tTTTt.tTt','..t.tTTTt.tTt','.tTttTTTt.tTt','.tTTtTTTtttTt','.tTTtTTTttTTt','..ddddddddddd'],{t:'#48b0d0',T:'#90f0f8',w:'#ffffff',d:'#2c4a5a'}),
  crystalA:SPRG(['......w','.....tTt','....tTwTt..t','....tTTTt.tTt','..t.tTTTt.tTt','.tTttTTTt.tTt','.tTTtTTTtttTt','.tTTtTTTttTTt','..ddddddddddd'],{t:'#c83850',T:'#f88088',w:'#fff0f0',d:'#2e1e26'}),
  lampOff:SPRG(['..kkkk','.kggggk','.kgddgk','.kgddgk','.kggggk','..kkkk','...kk','..kkkk'],{k:'#3a2c1c',g:'#5a4a3a',d:'#2a2440'}),
  lampOn:SPRG(['..kkkk','.kyyyyk','.kywwyk','.kywwyk','.kyyyyk','..kkkk','...kk','..kkkk'],{k:'#3a2c1c',y:'#ffd94d',w:'#fff3b0'})};
 /* which props live where, and which of them glow */
 const B=[{floor:[0,1,2].map(earthF),wall:earthW,side:'#2e1c16',sideHi:'#4b3228',props:['boulderE','boulderE','stump','mush'],dark:'rgba(14,6,22,.46)'},
  {floor:[0,1,2].map(stoneF),wall:stoneW,side:'#1d3140',sideHi:'#36566a',props:['boulderS','crystal','crystal','mush'],dark:'rgba(6,10,24,.5)'},
  {floor:[0,1,2].map(ashF),wall:ashW,side:'#1a0e10',sideHi:'#3e2428',props:['boulderA','boulderA','crystalA'],dark:'rgba(18,6,10,.46)'}];
 const GLOW={mush:['#8ae0d0',22],crystal:['#90f0f8',22],crystalA:['#f88088',20],boulderA:['#f07830',14]};
 /* the Hearth's floor: Sprouts' plank layout in a deeper, warmer wood so the room reads as underground */
 const hubWood=T(p=>{p('#7a5236',0,0,16,16);p('#5e3c26',0,7,16,1);p('#5e3c26',0,15,16,1);p('#5e3c26',5,0,1,7);p('#5e3c26',12,8,1,7);p('#946644',1,1,3,1);p('#946644',7,9,3,1);p('#6a4630',9,3,2,1);p('#6a4630',2,11,2,1)});
 RDART={B,P,GLOW,hubWood};return RDART;}

/* ---- foes and bosses, redrawn at 1x in the valley's style (facing right) ---- */
const RDFOE={
 grub:SPRG(['......ssss','...sssGGGGsss','..sGGGggggGGGs','.sGgggggggggggs','sGgggggggggggegs','sggggggggggggggs','sbbbbbbbbbbbbbbs','.sbbbbbbbbbbbbs','..s.s..s..s..s'],{s:'#6a3a86',G:'#d8bcff',g:'#b890f0',e:'#241a30',b:'#ecd8ff'}),
 spitter:SPRG(['....aaaa','...aAAAAa','..aAaaaaAa','..aaammaaa','..aa.mm.aa','...aaaaaa','....ssss','..l.ssss.l','.lll.ss.lll','..l..ss..l','....ssss','...ssssss'],{a:'#7ac74f',A:'#c0f8a0',m:'#3a1a2a',s:'#3a7028',l:'#58a038'}),
 beetle:SPRG(['..........hh','.........hhh','...BBBBBBBBh','..BbbBBBBBBBBe','.BbbbBBBBBBBBBB','.BBbbBBBBBBBBBB','..BBBBBBBBBBBB','..dddddddddddd','..l..l...l..l','.l..l...l..l'],{B:'#7e5e2c',b:'#c89f5f',h:'#e8e0d0',e:'#181020',d:'#4a3517',l:'#3a2810'}),
 shade:SPRG(['ww............ww','wWw..........wWw','.wWww......wwWw','..wWwww..wwwWw','...wwwwddwwww','....wwdyydww','...wwwddddwww','..wWw.dddd.wWw','.ww...dddd...ww','......d..d'],{w:'#6a5a96',W:'#a898d8',d:'#3a2c58',y:'#f8e060'}),
 crab:SPRG(['.cc..........cc','cCCc........cCCc','cCc..........cCc','.cc..wbbbbw..cc','..ccbbbbbbbbcc','.cbbbBBBBBBbbbc','cbbBBBBBBBBBBbbc','cbbbbbbbbbbbbbbc','.cddddddddddddc','..d.d..dd..d.d'],{c:'#3f7f9f',C:'#8ad0f0',b:'#60b8f8',B:'#a8e0ff',w:'#ffffff',d:'#2a5a78'}),
 wisp:SPRG(['.....y','....yy','...yyoy..y','..yoooy.yy','..yooooyy','.yooowwooy','.yoowkwkoy','.yoowwwwoy','.yooowwooy','..yoooooy','...yoooy','....yyy'],{y:'#f8d030',o:'#f8a040',w:'#fff3b0',k:'#7a3010'}),
 mother:SPRG(['....................kk','..............k..kk.kk','..............kkkkkkkk','..........ssssGGGGGGGGssss','.......sssGGGgggggggggggGGss','.....ssGGggggggggggggggggggGs','....sGgggggggggggggggggggggggs','...sGgggSggggggSggggggSgggggees','..sGggggSggggggSggggggSggggggegs','..sgggggSggggggSggggggSggggggggs','.sggggggSggggggSggggggSggggggggs','.sgggggSgggggggSgggggggSgggggmms','.sbbbbbbbbbbbbbbbbbbbbbbbbbbbbbs','..sbbbbbbbbbbbbbbbbbbbbbbbbbbbs','...sssssssssssssssssssssssssss','....l.l..l.l..l.l..l.l..l.l','...l.l..l.l..l.l..l.l..l.l'],
  {k:'#f8d030',s:'#4a2c5c',G:'#e8d4ff',g:'#c99df0',S:'#9a6ac8',e:'#241a30',m:'#7a2040',b:'#f4e4ff',l:'#3a2048'}),
 king:SPRG(['..........y.y.y.y','..........yyyyyyy','..........yrryrry','...CC....TTTTTTTTT.....CC','..CwwC..TTTTTTTTTTT...CwwC','..CCCC.TTwwTTTTTwwTT..CCCC','...CC.TTTekTTTTTekTTT..CC','....C.TTTTTTTTTTTTTTT.C','.....CTTbbbbbbbbbbbTTC','......TbbbbbbbbbbbbbT','.....TTbbbBBBBBBBbbbTT','....TTbbBBBBBBBBBBBbbTT','....TbbBBBBBBBBBBBBBbbT','....TbbbbbbbbbbbbbbbbbT','....kTTTTTTTTTTTTTTTTTk','...kk.T..T..T..T..T..kk','..k..T..T..T..T..T...k'],
  {y:'#f8d030',r:'#e04060',C:'#3f7f9f',w:'#bdeffb',T:'#4fa0b4',e:'#ffffff',k:'#1d2a3a',b:'#7fd0e8',B:'#bdeffb'})};
/* the Sprout King: a sprout who grew up in the dark and came out with a crown */
const RDKING=SPRG(['..L.......L','.LlL.y.y.LlL','..LlLyyyLlL','....yryry','...gGGGGGg','..gGgggggGg','..gGekgekgg','..ggggggggg','..gpggggpgg','...ggggggg','..llgggggll','.ll.lllll.ll','....s...s','...ss...ss'],
 {L:'#58c048',l:'#3c9848',y:'#f8d030',r:'#e04060',g:'#c8e8a0',G:'#eef8d8',e:'#241a30',k:'#ffffff',p:'#f8a0c8',s:'#6a4428'});

/* ---- the Lantern's light: a dark layer with stepped light pools cut out of it ---- */
let RDL=null;
function rdLight(lights,dark){if(!RDL)RDL=document.createElement('canvas');if(RDL.width!==W||RDL.height!==H){RDL.width=W;RDL.height=H}
 const x=RDL.getContext('2d');x.globalCompositeOperation='source-over';x.globalAlpha=1;x.clearRect(0,0,W,H);x.fillStyle=dark;x.fillRect(0,0,W,H);
 x.globalCompositeOperation='destination-out';x.fillStyle='#000';
 for(const L of lights)for(const[k,a]of[[1,.32],[.74,.38],[.48,.55]]){x.globalAlpha=a*(L.a===undefined?1:L.a);x.beginPath();x.arc(Math.round(L.x),Math.round(L.y),Math.max(1,L.r*k),0,7);x.fill()}
 x.globalCompositeOperation='source-over';x.globalAlpha=1;
 g.save();g.imageSmoothingEnabled=false;g.drawImage(RDL,0,0,W,H);
 g.globalCompositeOperation='lighter';for(const L of lights)if(L.c){g.globalAlpha=.07*(L.a===undefined?1:L.a);g.fillStyle=L.c;g.beginPath();g.arc(Math.round(L.x),Math.round(L.y),L.r*.6,0,7);g.fill()}
 g.restore();}
/* draws a keeper at 1x with its feet at (x,y); used in the hub, runs and menus */
function rdDrawKeeper(id,x,y,dirX){x=Math.round(x);y=Math.round(y);
 if(id==='LOUIE'){const s=((time*2)|0)%2,im=dirX<0?(s?LOU.r[0]:LOU.r[1]):(s?LOU.l[0]:LOU.l[1]);g.drawImage(im,x-(im.width>>1),y-im.height+1);return}
 if(id==='KING'){g.drawImage(RDKING.ol,x-(RDKING.ow>>1),y-RDKING.oh+1);return}
 if(id==='WILL'||!CH[id]){drawPlayerSpr(x,y,1);return}
 const im=CH[id];g.drawImage(im,x-(im.width>>1),y-im.height+1);}

/* ---------------- capsule unlocks ----------------
   Pulled from the CAPSULES machine on Sprouts' main menu, in the same pool as the styles
   (60/30/10, no duplicates). Ownership lives in Sprouts' save as meta.own.rd, so it syncs like
   every other style and Sprouts' RESET PULLS (in Settings) can hand them back. */
const RDCAP=[
 {n:'MOONLIGHT LANTERN',d:'YOUR LIGHT IN THE DEEP: MOON-WHITE',r:0,lan:'#d8e8ff'},
 {n:'SPROUT LANTERN',d:'YOUR LIGHT IN THE DEEP: SPROUT-GREEN',r:0,lan:'#b8f890'},
 {n:'MOONDEW JAR',d:'+40 MOONDEW FOR THE DIGS',r:0,dew:40},
 {n:'ROSE LANTERN',d:'YOUR LIGHT IN THE DEEP: ROSE',r:1,lan:'#f8a8d0'},
 {n:'EMBER LANTERN',d:'YOUR LIGHT IN THE DEEP: EMBER',r:1,lan:'#f89848'},
 {n:"ERIN'S INVITE",d:'ERIN CAN DIVE WITH YOU',r:1,ch:'ERIN'},
 {n:"LOUIE'S LEASH",d:'LOUIE CAN DIVE WITH YOU',r:1,ch:'LOUIE'},
 {n:'ROOT MAUL',d:'THE HEAVY WEAPON, IN THE ARMORY',r:1,wp:'maul'},
 {n:"MARCUS'S RSVP",d:'MARCUS CAN DIVE. HE IS NOT HAPPY',r:2,ch:'MARCUS'},
 {n:'ROOT CROWN',d:'THE SPROUT KING CAN DIVE WITH YOU',r:2,ch:'KING'},
 {n:'THORNBOW',d:'THE BOW, IN THE ARMORY',r:2,wp:'bow'}];
function rdCapOwned(){try{return(meta&&meta.own&&meta.own.rd)||[]}catch(e){return[]}}
function rdCapHas(f){return rdCapOwned().some(i=>RDCAP[i]&&f(RDCAP[i]))}
function rdCapGot(i){const c=RDCAP[i];if(!c)return;if(c.dew)RD.dew+=c.dew;if(c.lan)RD.set.lantern=c.lan;rdSave();}
const RDLANTERNS=[['AMBER','#ffd27a']].concat(RDCAP.filter(c=>c.lan).map(c=>[c.n.replace(' LANTERN',''),c.lan]));
function rdLanternC(){const L=RD.set&&RD.set.lantern;return L&&rdCapHas(c=>c.lan===L)?L:'#ffd27a'}
function rdOwnsWeapon(id){return RD.weapons.includes(id)||rdCapHas(c=>c.wp===id)}

/* ---------------- save / state ---------------- */
const RDDEF=()=>({dew:30,keys:1,honey:1,mirror:{},weapons:['blade'],weapon:'blade',keeps:{},keepXp:{},keepEq:'',
 pact:{},bounty:{},gift:{},seen:{},boonSeen:{},stats:{runs:0,deaths:0,escapes:0,kills:0,bosses:0,chambers:0},
 flags:{},heard:{},kstats:{},lineIx:{},bank:{},party:[],set:null});
let RD=RDDEF();
if(!RD.bank)RD.bank={};if(!RD.party)RD.party=[];
if(!RD.set)RD.set={mus:(typeof meta!=='undefined'&&meta&&meta.mus!==undefined)?meta.mus:7,sfx:(typeof meta!=='undefined'&&meta&&meta.sfx!==undefined)?meta.sfx:8,shake:true};
function applyVolumes(){try{if(typeof meta!=='undefined'&&meta){meta.mus=RD.set.mus;meta.sfx=RD.set.sfx}}catch(e){}}
try{const s=JSON.parse(localStorage.getItem('rootdeep-v1')||'null');if(s)RD=Object.assign(RDDEF(),s);}catch(e){}
RD.mirror=RD.mirror||{};RD.weapons=RD.weapons||['blade'];RD.keeps=RD.keeps||{};RD.keepXp=RD.keepXp||{};
RD.pact=RD.pact||{};RD.bounty=RD.bounty||{};RD.gift=RD.gift||{};RD.seen=RD.seen||{};RD.boonSeen=RD.boonSeen||{};RD.lineIx=RD.lineIx||{};RD.char=RD.char||'WILL';
RD.stats=Object.assign({runs:0,deaths:0,escapes:0,kills:0,bosses:0,chambers:0},RD.stats);
function rdSave(){try{localStorage.setItem('rootdeep-v1',JSON.stringify(RD))}catch(e){}}
let RUN=null,P3={x:120,y:110,vx:0,vy:0,fx:1,fy:0,anim:0};
let uiSel=0,uiList=[],talkNPC=null,talkTxt='',talkStart=0,talkLine=0,boonOffer=[],shopItems=[],pauseSel=0,codexPage=0,heatSel=0;
let hubMsg='',hubMsgT=0,overT=0;
const heatTotal=()=>PACT.reduce((a,p)=>a+(RD.pact[p.id]||0),0);
const keepLv=who=>{const xp=RD.keepXp[who]||0;return xp>=50?3:xp>=25?2:1};
const hasKeep=id=>RD.keepEq===id;
const mir=id=>RD.mirror[id]||0;
/* derived stats for the current RUN (or hub preview) */
function rdStats(){const b=RUN?RUN.boons:{atk:null,cast:null,dash:null,pass:[]};
 const pass=id=>b.pass.find(p=>p.id===id);
 const erin=hasKeep('flower');
 return{maxHp:100+mir('vit')*10+(pass('heart')?rdBoonVal(pass('heart')):0)+(erin?20:0)+(RUN&&RUN.bonusMax?RUN.bonusMax:0)+((RD.char==='LOUIE')?-20:(RD.char==='MARCUS')?25:0),
  dmgMul:(1+mir('might')*.05),
  atkMul:(1+(b.atk?rdBoonVal(b.atk)/100:0))*(RD.char==='MARCUS'?1.2:1), castMul:(1+(b.cast?rdBoonVal(b.cast)/100:0))*(hasKeep('stone')?1.2:1),
  speedMul:(1+mir('swift')*.04)*(pass('quick')?1+rdBoonVal(pass('quick'))/100:1)*(RD.char==='ERIN'?1.05:RD.char==='LOUIE'?1.15:RD.char==='MARCUS'?.93:1),
  armor:Math.min(.6,mir('skin')*.03+(pass('skin')?rdBoonVal(pass('skin'))/100:0)),
  crit:.05+(pass('stormluck')?rdBoonVal(pass('stormluck'))/100:0)+(b.atk&&b.atk.god==='LUCKY'?.12:0)+(RUN?budCount(5)*.05:0),
  castRegen:(pass('breath')?1+rdBoonVal(pass('breath'))/100:1), dashCharges:2+(pass('wind')?1:0),
  healMul:(pass('bloom')?1+rdBoonVal(pass('bloom'))/100:1)*((RD.pact.dry&&RUN)?0.7:1)};}
function rdBoonVal(b){if(!b)return 0;const def=b.kind==='core'?CORES[b.slot]:PASSES.find(p=>p.id===b.id);
 const base=b.kind==='core'?def.v:def.v;return Math.round(base*b.rar*(1+.18*(b.level-1))*(b.kind==='pass'&&b.id==='heart'?1:1));}
function boonName(b){if(!b)return '';if(b.kind==='duo')return DUOS.find(d=>d.id===b.id).n;
 if(b.kind==='core')return CORES[b.slot].n[b.god];const p=PASSES.find(p=>p.id===b.id);return p?p.n:'';}
function boonDesc(b){if(!b)return '';
 if(b.kind==='duo')return DUOS.find(d=>d.id===b.id).d;
 const v=rdBoonVal(b);
 if(b.kind==='core'){const base=CORES[b.slot].d[b.god];return (b.slot==='atk'?'Attack +'+v+'%. ':'Cast +'+v+'%. ')+(b.slot==='dash'?'Dash power '+v+'. ':'')+base}
 const p=PASSES.find(p=>p.id===b.id);return p.d;}
function rdHeal(n){if(!RUN)return;const s=rdStats();RUN.hp=Math.min(s.maxHp,RUN.hp+n*s.healMul);}
function godCore(god,slot){return RUN&&RUN.boons[slot]&&RUN.boons[slot].god===god?RUN.boons[slot]:null;}
function hasDuo(id){return RUN&&RUN.boons.pass.some(p=>p.kind==='duo'&&p.id===id);}
function hasGod(god){return RUN&&(RUN.boons.atk?.god===god||RUN.boons.cast?.god===god||RUN.boons.dash?.god===god||RUN.boons.pass.some(p=>p.god===god));}
/* ---------------- boon offers ---------------- */
function rollRar(){const r=Math.random()*100,luck=mir('luck')*3;
 return r<8+luck?2:r<38+luck?1:0;}
function mkBoon(god,kind,slotOrId){const rar=rollRar();RD.boonSeen[(kind==='core'?slotOrId:slotOrId)+':'+(kind==='core'?god:slotOrId)]=1;
 if(kind==='core')return{kind,god,slot:slotOrId,level:1,rar:RARS[rar][1],rarN:RARS[rar][0]};
 if(kind==='duo'){const d=DUOS.find(x=>x.id===slotOrId);return{kind,god:d.gods[0],id:d.id,level:1,rar:1.45,rarN:'DUO'}}
 const p=PASSES.find(x=>x.id===slotOrId);const ex=RUN.boons.pass.find(x=>x.id===slotOrId);
 if(ex)return{kind:'passup',god:p.god,id:p.id,level:ex.level+1,rar:1,rarN:'LEVEL UP'};
 return{kind:'pass',god:p.god,id:p.id,level:1,rar:RARS[rar][1],rarN:RARS[rar][0]};}
function genOffer(god){god=god||GODIDS[(Math.random()*GODIDS.length)|0];const out=[],used=new Set();
 const slots=['atk','cast','dash'].filter(s=>!(RUN.boons[s]&&RUN.boons[s].god===god));
 for(const d of DUOS)if(!hasDuo(d.id)&&d.gods.every(g=>hasGod(g))){out.push(mkBoon(god,'duo',d.id));break}
 while(out.length<3){const roll=Math.random();
  if(roll<.55&&slots.length){const s=slots.splice((Math.random()*slots.length)|0,1)[0];out.push(mkBoon(god,'core',s))}
  else{const pool=PASSES.filter(p=>p.god===god&&!used.has(p.id));if(!pool.length&&slots.length){const s=slots.splice(0,1)[0];out.push(mkBoon(god,'core',s));continue}
   if(!pool.length)break;const p=pool[(Math.random()*pool.length)|0];used.add(p.id);out.push(mkBoon(god,'pass',p.id))}}
 return out.slice(0,3);}
function takeBoon(b){if(b.kind==='core'){RUN.boons[b.slot]=b}
 else if(b.kind==='pass'){RUN.boons.pass.push(b)}
 else if(b.kind==='duo'){RUN.boons.pass.push(b)}
 else if(b.kind==='passup'){const ex=RUN.boons.pass.find(x=>x.id===b.id);if(ex)ex.level=Math.min(5,ex.level+1)}
 snd(784,.12);later(()=>snd(1175,.25),110);}
function boonReturn(){if(RUN&&RUN.boonFrom==='shop'){RUN.boonFrom='';state='g3shop';return}
 RUN.boonFrom='';rdNextChamber();state='g3run';}
function applyFruit(){const owned=[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(b=>b&&b.level<5);
 if(owned.length){const b=owned[(Math.random()*owned.length)|0];b.level++;say2('SUNFRUIT: '+boonName(b)+' Lv'+b.level,3);return true}
 RUN.petals+=60;say2('NO BOON TO FEED. +60 PETALS',2);return false;}
/* ---------------- runs & chambers ---------------- */
function rdGoDown(){rdStartRun();rdDescPick();(RUN.cineQ=RUN.cineQ||[]).unshift('descend');state='g3run'}
function rdStartRun(resume){const s=rdStats();
 RUN={hp:s.maxHp,petals:20+mir('gold')*20,dew:0,keys:0,honey:0,chamber:0,char:RD.char||'WILL',wave2:null,sigShown:0,heat:heatTotal(),
  boons:{atk:null,cast:null,dash:null,pass:[]},enemies:[],projs:[],eprojs:[],pickups:[],parts:[],texts:[],doors:[],zones:[],hazards:[],buds:[],pods:[],dewT:0,podDropped:false,
  obst:[],phase:'fight',atkCd:0,combo:0,dtap:{},castAmmo:1+(hasKeep('stone')?1:0),castCd:0,dashCd:0,dashT:0,dashCharges:rdStats().dashCharges,
  inv:0,shake:0,boss:null,elite:false,revives:mir('defy'),collarUsed:false,phoenixUsed:false,regen:0,fountain:0,time:0,zoneT:0,kills:0,
  xCd:0,yCd:0,sup:0,rush:null,zoomQ:0,fx:[],cutT:0,cutN:'',hs:0,hurtT:0,atkA:null};
 if(resume)return;
 for(const ty of RD.party){if((RD.bank[ty]||0)>0){RD.bank[ty]--;RUN.buds.push({type:ty,x:P3.x,y:P3.y,a:Math.random()*6,cd:0,z:0})}}
 if(RUN.char==='KING')for(let i=0;i<2;i++)RUN.buds.push({type:(Math.random()*5)|0,x:P3.x,y:P3.y,a:Math.random()*6,cd:0,z:0});
 RD.party=[];RD.stats.runs++;ks(RUN.char).runs++;rdSave();rdNextChamber();}
/* chambers: props sit on the 16px grid (14 columns between the side walls), never in the middle,
   the keeper's start, or right under the two doors */
/* ---------------- saving a run ----------------
   A checkpoint is written at the start of every chamber (and on SAVE & QUIT), so closing the app or
   quitting from the pause menu loses at most the chamber you're in. CONTINUE on the title menu resumes it. */
function rdCkpt(){if(!RUN)return;RD.ckpt={hp:RUN.hp,petals:RUN.petals,dew:RUN.dew,keys:RUN.keys,honey:RUN.honey,chamber:RUN.chamber,char:RUN.char,heat:RUN.heat,
 boons:JSON.parse(JSON.stringify(RUN.boons)),buds:RUN.buds.filter(b=>!b.temp).map(b=>b.type),revives:RUN.revives,phoenixUsed:RUN.phoenixUsed,collarUsed:RUN.collarUsed,
 kills:RUN.kills,bonusMax:RUN.bonusMax||0,sup:RUN.sup||0,found:RUN.found||0,t:Date.now()};rdSave()}
function rdResume(){const c=RD.ckpt;if(!c)return false;RD.char=c.char;rdStartRun(true);
 Object.assign(RUN,{hp:c.hp,petals:c.petals,dew:c.dew,keys:c.keys,honey:c.honey,char:c.char,heat:c.heat,boons:c.boons,revives:c.revives,phoenixUsed:c.phoenixUsed,
  collarUsed:c.collarUsed,kills:c.kills,bonusMax:c.bonusMax,sup:c.sup,found:c.found||0});
 RUN.buds=c.buds.map(t=>({type:t,x:P3.x,y:P3.y,a:Math.random()*6,cd:0,z:0}));RUN.chamber=c.chamber-1;RUN.noDrop=1;rdNextChamber();RUN.noDrop=0;state='g3run';say2('BACK IN CHAMBER '+RUN.chamber,2);return true}
function rdArena(biome){RUN.obst=[];const A=rdArt(),kinds=A.B[biome].props,rows=Math.floor((H-RDA.top-RDA.bot)/16),n=3+((Math.random()*3)|0),used=new Set();
 let guard=0;while(RUN.obst.length<n&&guard++<60){const gx=(Math.random()*14)|0,gy=1+((Math.random()*(rows-2))|0),x=RDA.side+gx*16,y=RDA.top+gy*16,key=gx+','+gy;
  if(used.has(key)||Math.abs(x+8-W/2)<30&&Math.abs(y+8-H/2)<34||Math.abs(x+8-W/2)<28&&y>H-60||gy<2&&(Math.abs(x+8-(W/2-40))<20||Math.abs(x+8-(W/2+40))<20))continue;
  used.add(key);const k=kinds[(Math.random()*kinds.length)|0];
  RUN.obst.push({x:x+2,y:y+5,w:12,h:9,kind:k,gx:x,gy:y,biome});}
 RUN.lamps=[{x:W/2-80,y:22},{x:W/2,y:22},{x:W/2+80,y:22}];RUN.litT=0;RUN.usedCells=used;
 P3.x=W/2;P3.y=H-26;P3.vx=P3.vy=0;}
function foeScale(){const ch=RUN.chamber;return{hp:1+.30*(ch-1)+.2*(RD.pact.hide||0),dmg:1+.09*(ch-1)+.15*(RD.pact.thorns||0),sp:1+.12*(RD.pact.rush||0)};}
function spawnFoe(kind,x,y,elite){const d=FOES[kind],sc=foeScale();
 const e={kind,x,y,hp:d.hp*sc.hp*(elite?2.6:1),max:d.hp*sc.hp*(elite?2.6:1),sp:d.sp*sc.sp*(0.9+Math.random()*.2),dmg:d.dmg*sc.dmg,r:d.r*(elite?1.35:1),
  elite:!!elite,t:Math.random()*2,cd:1+Math.random(),hitCd:0,burn:0,burnDps:0,chill:0,root:0,face:1,flash:0,state:0,sx:x,sy:y,bt:0};
 RUN.enemies.push(e);RD.seen[kind]=1;return e;}
function spawnBoss(ix){const d=BOSSES[ix],sc=foeScale();
 const e={kind:'boss',bossIx:ix,x:W/2,y:RDA.top+26,hp:d.hp*(1+.12*RUN.heat),max:d.hp*(1+.12*RUN.heat),sp:d.sp,dmg:d.dmg*sc.dmg,r:d.r,
  elite:false,t:0,cd:2,hitCd:0,burn:0,burnDps:0,chill:0,root:0,face:1,flash:0,bt:3,phase:1,state:0,tx:W/2,ty:52};
 RUN.enemies.push(e);RUN.boss=e;RD.seen[d.id]=1;snd(110,.6,55,'sawtooth',.09);return e;}
let say2T=0,say2Txt='';
function say2(s,t=3){say2Txt=s;say2T=t;}
function rdNextChamber(){if(RUN.chamber>0&&!RUN.noDrop){RUN.surfN=0;rdSurfaceQueue();rdQueueDrop()}RUN.chamber++;RUN.phase='fight';RUN.doors=[];RUN.projs=[];RUN.eprojs=[];RUN.pickups=[];RUN.pods=[];RUN.podDropped=false;
 const ch=RUN.chamber,biome=ch<=4?0:ch<=8?1:2;RUN.biome=biome;rdArena(biome);rdInts(ch,biome,RUN.usedCells);
 if(ch===4||ch===8||ch===12){spawnBoss(ch/4-1);RUN.zoneT=2.4;if(!RD.flags['cine_boss'+(ch/4-1)])RUN.pendingCine='boss'+(ch/4-1);rdCkpt();rdSavedMark();return}
 const pool=BIOMES[biome].pool,budget=4+ch+((RD.pact.swarm||0)*2),eliteCh=ch===3||ch===7||ch===10;
 let spent=0,guard=0;const wlist=[];
 while(spent<budget&&guard++<40){const k=pool[(Math.random()*pool.length)|0],cost=k==='grub'?1:k==='wisp'||k==='shade'?2:3;
  if(spent+cost>budget+1)continue;spent+=cost;wlist.push({k,elite:eliteCh&&spent>=budget-1});}
 const cut=Math.max(1,Math.ceil(wlist.length*.55));
 wlist.slice(0,cut).forEach(s2=>spawnFoe(s2.k,26+Math.random()*(W-52),RDA.top+10+Math.random()*(H*.42),s2.elite));
 RUN.wave2=wlist.length>cut?wlist.slice(cut):null;
 RUN.elite=eliteCh;RUN.zoneT=2;if(eliteCh)say2('AN ELITE GUARDS THIS CHAMBER',2);rdCkpt();rdSavedMark()}
function chamberCleared(){RUN.phase='doors';RD.stats.chambers++;
 if(!RUN.podDropped){RUN.pods.push(rdPodAt(PODW[RUN.biome][(Math.random()*6)|0],W/2+R(-16,16),H/2));RUN.podDropped=true;ftext(W/2,H/2-16,'A SPROUT WAS HIDING HERE!','#a8f080')}
 if(RD.keepEq){const who=(KEEPS.find(k=>k.id===RD.keepEq)||{}).who;if(who)RD.keepXp[who]=(RD.keepXp[who]||0)+1}
 const s=rdStats();let heal=mir('mend')*3+(RUN.boons.pass.find(p=>p.id==='rain')?rdBoonVal(RUN.boons.pass.find(p=>p.id==='rain')):0);
 if(heal)rdHeal(heal);
 if(RUN.boss){bossDown(RUN.boss)}
 const ch=RUN.chamber;
 if(ch>=12){rdEscape();return}
 const kinds=['boon','boon','petals','dew','fruit','heart','shop','fountain','honey'];
 const pick=()=>kinds[(Math.random()*kinds.length)|0];let a=pick(),b=pick();if(b===a)b=pick();
 if(ch===3||ch===7||ch===11)a='boon';
 RUN.doors=[{kind:a,x:W/2-40,y:30},{kind:b,x:W/2+40,y:30}].map(d=>({...d,god:GODIDS[(Math.random()*GODIDS.length)|0]}));
 rdSave();}
function bossDown(e){RD.stats.bosses++;if(!RD.flags['kill_'+BOSSES[e.bossIx].id]){try{meta.ltix=(meta.ltix||0)+1;persist(true)}catch(x){}ftext(P3.x,P3.y-36,'+1 CAPSULE TICKET','#f8e060')}RD.flags['kill_'+BOSSES[e.bossIx].id]=1;RUN.keys++;const heat=RUN.heat,paid=RD.bounty[BOSSES[e.bossIx].id]||0;
 let bonus=0;if(heat>paid){bonus=25*(heat-paid);RD.bounty[BOSSES[e.bossIx].id]=heat}
 RUN.dew+=40+bonus;say2(BOSSES[e.bossIx].s+' FALLEN!',3.2);
 ftext(P3.x,P3.y-16,'+1 KEY','#f8d030');if(bonus)ftext(P3.x,P3.y-26,'+'+bonus+' BOUNTY DEW','#7fd0e8');
 if(hasKeep('flower'))RUN.hp=rdStats().maxHp;
 RUN.boss=null;snd(392,.15);later(()=>snd(523,.15),130);later(()=>snd(659,.15),260);later(()=>snd(784,.4),390);}
function doorReward(d){snd(660,.08,990);
 if(d.kind==='boon'){RUN.boonFrom='door';boonOffer=genOffer(d.god);uiSel=0;state='g3boon';return}
 if(d.kind==='shop'){shopItems=genShop();uiSel=0;state='g3shop';return}
 if(d.kind==='petals'){const n=40+((Math.random()*30)|0);RUN.petals+=n;say2('+'+n+' PETALS',2)}
 if(d.kind==='dew'){const n=20+((Math.random()*15)|0);RUN.dew+=n;say2('+'+n+' MOONDEW',2)}
 if(d.kind==='fruit'){applyFruit()}
 if(d.kind==='heart'){RUN.bonusMax=(RUN.bonusMax||0)+25;rdHeal(25);say2('+25 MAX HEALTH (RUN)',2)}
 if(d.kind==='honey'){RUN.honey++;say2('+1 HONEY',2.5)}
 if(d.kind==='fountain'){rdHeal(rdStats().maxHp*.35);say2('THE FOUNTAIN MENDS YOU',2)}
 rdNextChamber();state='g3run';}
function genShop(){const all=[
 {n:'A BOON',d:'Random god, chosen now',p:150,act:()=>{RUN.boonFrom='shop';boonOffer=genOffer();uiSel=0;state='g3boon'}},
 {n:'SUNFRUIT',d:'Level up a random boon',p:100,act:()=>applyFruit()},
 {n:'BIG HEAL',d:'Restore 40% health',p:60,act:()=>{rdHeal(rdStats().maxHp*.4);say2('PATCHED UP',2)}},
 {n:'HONEY',d:'For gifts at the Hearth',p:80,act:()=>{RUN.honey++;say2('+1 HONEY',2)}},
 {n:'OLD KEY',d:'Unlocks weapons & doors above',p:120,act:()=>{RUN.keys++;say2('+1 KEY',2)}},
 {n:'PETAL PURSE',d:'+90 petals, somehow profit',p:50,act:()=>{RUN.petals+=90;say2('+90 PETALS',2)}}];
 const out=[];while(out.length<3){const it=all.splice((Math.random()*all.length)|0,1)[0];if(it)out.push(it)}return out;}
function rdDie(){RUN.dieT=0;RUN.inv=99;RUN.atkA=null;RUN.rush=null;RUN.cutT=0;state='g3dying';snd(196,.5,49,'sawtooth',.08);later(()=>snd(147,.6,49,'triangle',.05),400)}
function rdDieFinish(){const R0=RUN;{const k=ks(R0.char);k.deaths++;k.best=Math.max(k.best,R0.chamber)}RD.ckpt=null;RD.stats.deaths++;RD.lastRun={chamber:RUN.chamber,kills:RUN.kills,dew:RUN.dew,petals:RUN.petals,heat:RUN.heat,spr:bankBuds(),sub:rdDeathLine(R0),hit:R0.lastHit||''};RD.lastRun.msgs=rdMilestones(R0,false);RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey;RUN=null;rdSave();overT=0;state='g3over';}
function rdEscape(){RD.ckpt=null;RD.stats.escapes++;try{meta.ltix=(meta.ltix||0)+1;persist(true)}catch(x){}const R0=RUN;{const k=ks(R0.char);k.esc++;k.best=12}RD.lastRun={chamber:12,kills:RUN.kills,dew:RUN.dew,petals:RUN.petals,heat:RUN.heat,spr:bankBuds()};RD.lastRun.msgs=rdMilestones(R0,true);RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey;
 if(RD.stats.escapes===1)say2('FIRST ESCAPE!',5);
 RUN=null;rdSave();overT=0;if(!RD.flags.cine_escape)startCine('win','escape');else state='g3win';snd(523,.15);later(()=>snd(659,.15),140);later(()=>snd(784,.15),280);later(()=>snd(1046,.5),420);}
function rdAbandon(){RD.ckpt=null;if(RUN){bankBuds();RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey}RUN=null;rdSave();state='g3hub';}

/* ---------------- the Hearth (hub) ---------------- */
const STATIONS=[{id:'mirror',n:'THE SPROUT DIGS',l:'DIGS',x:28},{id:'arm',n:'ARMORY',l:'ARMORY',x:71},{id:'keep',n:'KEEPSAKE SHELF',l:'SHELF',x:114},{id:'codex',n:'CODEX',l:'CODEX',x:157},{id:'heat',n:'HEAT GATE',l:'HEAT',x:200}];
/* the Hearth's layout is in fractions of the screen height, so a tall phone gets a roomy hall
   with everyone in their own corner, not a pile at the bottom */
function hubL(){return{bedY:Math.round(H*.31),gloomY:Math.round(H*.30),rugY:Math.round(H*.46),deskY:Math.round(H*.62),campY:Math.round(H*.62)}}
const hubY=f=>Math.round(H*f);
const NPCPOS={ERIN:[84,.40],LOUIE:[120,.52],RANGER:[188,.70],MARCUS:[204,.38],SCOUT:[46,.70]};
let pausePage=0;
const HUBNPC={};
const NPCSPD={ERIN:32,LOUIE:46,RANGER:36,MARCUS:27,SCOUT:38};
const CHARS=[
 {id:'WILL',tag:'THE KEEPER',d:'Balanced. The Lantern knows his hands.',stats:'ALL-ROUND'},
 {id:'ERIN',tag:'THE GARDENER',d:'Her buds fight like they mean it.',stats:'BUDS +50% DAMAGE - SPEED +5%'},
 {id:'LOUIE',tag:'THE GOOD BOY',d:'Fast, fearless, slightly less durable.',stats:'SPEED +15% - QUICK BITE - HP -20'},
 {id:'MARCUS',tag:'ALL GAS, BRO',d:'Here because everyone else kept dying. He has notes.',stats:'HP +25 - HITS +20% - SPEED -7%'},
 {id:'KING',n:'SPROUT KING',tag:"THE BUDS' OWN",d:'Grew up in the dark under the valley. Came up with a court.',stats:'BUDS x2 DAMAGE - STRING OF 8 - STARTS WITH 2'}];
/* Keeper moves. The NAMES are canon from North Coast Knockout (cartridge 2): each keeper's
   two specials and super are the same moves on the same buttons as in Knockout
   (X = special 1, Y = special 2, super when the meter is full). How each one plays
   top-down is Rootdeep's adaptation. fin = the Knockout heavy that names the combo finisher. */
const RDMOVES={
 WILL:{x:{n:'SELFIE FLASH',d:'Camera flash. Stuns everything close.',cd:5},y:{n:'MAZEL TOV LASER',d:'A piercing beam of pure celebration.',cd:4.5},su:{n:'BIKE LANE',d:'Rides straight through the room.'},fin:'SNEAKER KICK'},
 ERIN:{x:{n:'TOWEL WHIP',d:'A wet snap. Roots foes and shoves them back.',cd:3.5},y:{n:'LEASH LASSO',d:'Ropes the nearest foe and yanks it in.',cd:5},su:{n:'SPROUT STAMPEDE',d:'Six sprouts charge across the room.'},fin:'GARDEN KICK'},
 LOUIE:{x:{n:'ZOOM ZOOM ZOOM',d:'Three blurs, three bites, three foes.',cd:4.5},y:{n:'TURBO ZOOM',d:'One long, fearless charge.',cd:5},su:{n:'JUDGEMENT',d:'He stares. Light falls on every foe.'},fin:'CHOMP'},
 KING:{x:{n:'SPROUT TOSS',d:'Throw your front bud. It latches on and chews.',cd:1.6},y:{n:'ROYAL WHISTLE',d:'Call the buds home. They rally, heal you, frenzy.',cd:7},su:{n:'BLOOM OF KINGS',d:'Every bud blooms huge. Three golden buds join.'},fin:'SCEPTER SWAT'},
 MARCUS:{x:{n:'DAB CLOUD',d:'A slow cloud of attitude. Dazes what it rolls over.',cd:4.5},y:{n:'DOUBLE OR NOTHING',d:'Coin-flip punch: huge hit or a sad poke.',cd:4},su:{n:'HYDRO JET',d:'Six geysers burst in a line.'},fin:'PIPE WRENCH'}};
function charUnlocked(id){if(id==='WILL')return true;if(rdCapHas(c=>c.ch===id))return true;if(id==='ERIN')return(RD.gift.ERIN||0)>=3;
 if(id==='LOUIE')return(RD.stats.budsBanked||0)>=20;if(id==='MARCUS')return(RD.stats.deaths||0)>=8;if(id==='KING')return(RD.stats.fullString||0)>=1;return false}
function charLockTxt(id){if(id==='ERIN')return 'GIVE ERIN 3 HONEY: '+(RD.gift.ERIN||0)+'/3';
 if(id==='LOUIE')return 'BANK 20 SPROUTS: '+(RD.stats.budsBanked||0)+'/20';
 if(id==='MARCUS')return 'TAKES OVER AFTER 8 DEATHS: '+(RD.stats.deaths||0)+'/8';
 if(id==='KING')return 'CARRY 6 BUDS IN ONE RUN';return ''}
function charsUpdate(){uiSel=nav(uiSel,CHARS.length);
 if(pressed('a')){const c=CHARS[uiSel];if(charUnlocked(c.id)){RD.char=c.id;rdSave();snd(784,.1);later(()=>snd(1175,.2),90);rdGoDown()}else snd(140,.09);return}
 if(pressed('b')||pressed('start'))state='g3hub';}
/* draws one keeper's little sprite with its feet at (x,y) */
function rdKeeperSpr(id,x,y,sc){if(sc>=2){g.save();g.translate(Math.round(x),Math.round(y));g.scale(2,2);rdDrawKeeper(id,0,0,1);g.restore()}else rdDrawKeeper(id,x,y,1)}
/* a coloured face-button chip, the same colours as the console's X and Y */
const RDBTN={A:'#e84a5f',B:'#4a3c6a',X:'#4890e8',Y:'#40a860'};
function rdChip(l,x,y){r('#0d0a14',x,y,11,11);r(RDBTN[l]||'#8d84a8',x+1,y+1,9,9);text(l,x+3,y+2,1,'#ffffff',null);}
function drawChars(){r('#14101c',0,0,W,H);r('#1d1530',0,0,W,20);ctext('CHOOSE YOUR KEEPER',10,2,'#ffd94d',null);
 const NC=CHARS.length,rowH=Math.max(18,Math.min(28,Math.floor((H-112)/NC)-3));
 CHARS.forEach((c,i)=>{const y=24+i*(rowH+3),on=i===uiSel,un=charUnlocked(c.id);
  r(on?'#f8e060':'#241c38',6,y,W-12,rowH);r(on?'#fff3b0':'#2e2450',7,y+1,W-14,rowH-2);
  if(!un){g.save();g.globalAlpha=.45}rdKeeperSpr(c.id,22,y+rowH-3,1);if(!un)g.restore();
  text(c.n||c.id,40,y+Math.round((rowH-9)/2),2,on?'#281c30':un?'#e8e4f5':'#8d84a8',null);
  rtext(un?c.tag:'LOCKED',W-12,y+Math.round((rowH-8)/2),1,on?'#5a4a28':'#a89ec2',null);});
 const c=CHARS[uiSel],un=charUnlocked(c.id),mv=RDMOVES[c.id],py=24+NC*(rowH+3)+2,pb=H-18;
 r('#0d0a18',6,py,W-12,pb-py);r('#2e2450',6,py,W-12,1);
 let ly=py+5;const line=(s,col)=>{if(ly+8>pb)return;text(s,12,ly,1,col,null);ly+=10};
 wrapPx(c.d,214,1).forEach(l=>line(l,'#c8c0d8'));
 if(!un){line(charLockTxt(c.id),'#f8c070');}
 else wrapPx(c.stats,214,1).forEach(l=>line(l,'#a8f080'));
 ly+=3;
 for(const k of['x','y','su']){if(ly+10>pb)break;const m=mv[k];
  if(k==='su'){r('#0d0a14',12,ly,26,11);r('#c87a20',13,ly+1,24,9);text('SUP',15,ly+2,1,'#ffffff',null)}else rdChip(k.toUpperCase(),12,ly);
  text(m.n,42,ly+2,1,un?'#ffd94d':'#8d84a8',null);ly+=12;
  if(un&&ly+8<=pb&&pb-py>110){const dl=wrapPx(m.d,W-58,1);text(dl.length>1?dl[0].replace(/\s*\S*$/,'…'):dl[0],42,ly,1,'#8d84a8',null);ly+=11}}
 ctext(un?'A: DIVE AS '+(c.n||c.id)+'    B: BACK':'B: BACK',H-12,1,'#ffd94d',null);}
const NPCROUTE={
 ERIN:[[84,.40],[76,.45,1],[28,.28,1],[84,.40]],
 LOUIE:[[120,.52],'P3',[98,.57],[146,.55],'P3'],
 RANGER:[[188,.70],[168,.77],[214,.57],[188,.70]],
 MARCUS:[[204,.38],[186,.44],[178,.30],[204,.38]],
 SCOUT:[[46,.70],[157,.20,1],[66,.76,1],[46,.70]]};
function hubNpcReset(){for(const who of NPCS){const hx=NPCPOS[who][0],hy=hubY(NPCPOS[who][1]);
 const route=NPCROUTE[who].map(pt=>pt==='P3'?'P3':{x:pt[0],y:hubY(pt[1]),act:!!pt[2]});
 HUBNPC[who]={x:hx,y:hy,hx,hy,route,ri:0,jx:0,jy:0,act:0,wait:.3+Math.random()*.8}}}
function hubEnter(){rdTalkL=null;hubBark=null;hubBarkT=3;rdApprWait=.9;rdApprTalk=false;rdSavedMark();P3.x=W/2;P3.y=hubY(.36);P3.vx=P3.vy=0;hubNpcReset();state='g3hub';
 if(charUnlocked('KING')&&!RD.flags.cine_king&&(RD.stats.fullString||0)>=1)startCine('hub','king');}
function movePlayer(dt,spd){const mx=keys.right-keys.left,my=keys.down-keys.up;const l=Math.hypot(mx,my)||1;
 const sp=spd*(rdStats().speedMul);
 if(keys.right||keys.left||keys.up||keys.down){P3.vx=mx/l*sp;P3.vy=my/l*sp;P3.fx=mx!==0?mx:(P3.fx);P3.fy=my;P3.anim+=dt*8}
 else{P3.vx*=Math.max(0,1-dt*10);P3.vy*=Math.max(0,1-dt*10)}
 P3.x+=P3.vx*dt;P3.y+=P3.vy*dt;
 if(RUN&&state==='g3run'){P3.x=Math.max(RDA.side+6,Math.min(W-RDA.side-6,P3.x));P3.y=Math.max(RDA.top+6,Math.min(H-RDA.bot-4,P3.y))}
 else{P3.x=Math.max(13,Math.min(W-13,P3.x));P3.y=Math.max(70,Math.min(H-11,P3.y))}
 if(RUN)for(const o of RUN.obst){const nx=Math.max(o.x,Math.min(P3.x,o.x+o.w)),ny=Math.max(o.y,Math.min(P3.y,o.y+o.h));
  const dx=P3.x-nx,dy=P3.y-ny,d=Math.hypot(dx,dy);if(d<7&&d>0){P3.x=nx+dx/d*7;P3.y=ny+dy/d*7}else if(d===0){P3.y=o.y-7}}}
/* what to do next, at the top of the Hearth like Sprouts' objective bar (with an arrow over the target) */
function rdObjective(){const S=RD.stats;
 if(!RD.flags.met_ERIN)return{t:'TALK TO ERIN',who:'ERIN'};
 if(!S.runs)return{t:'GO DOWN THE BURROW',door:1};
 if(!Object.keys(RD.mirror||{}).length&&RD.dew>=Math.min(...MIRROR.map(m=>m.cost[0])))return{t:'SPEND MOONDEW AT THE DIGS',st:'mirror'};
 if(!S.bosses)return{t:'BEAT THE GRUB MOTHER: CHAMBER 4',door:1};
 if(!S.escapes)return{t:'ESCAPE THE DEEP: CHAMBER 12',door:1};
 if(!heatTotal())return{t:'TRY THE PACT OF ROOTS',st:'heat'};
 return null}
/* Erin's welcome, the first time you talk to her: how the whole thing works */
const RDINTRO=["Will! You came. The Lantern's light is draining down through the roots.","Something under the Hearth is eating it. See the Burrow, bottom of the room? It goes all the way down.",
 "Down there, find sprouts. Pluck them with A. They follow you and fight for you.","You'll fall. Everyone does. You wake up right here and keep the Moondew you found.",
 "Spend it at the Sprout Digs, by the back wall. The sprouts dig you upgrades that last. Then go again.","Go on, keeper. I'll keep the light on."];
/* who walks over, when, and what they say. Each plays once; it marks the matching talk topic as heard. */
const RDAPPR=[
 {id:'met_ERIN',flag:1,who:'ERIN',when:()=>!RD.flags.met_ERIN,lines:RDINTRO},
 {id:'e_fall',who:'ERIN',when:()=>RD.stats.deaths>=1,lines:["You came back up! Covered in dirt, but up.","That's how the deep works. You fall, you wake up here. The Moondew you found comes with you.",
  "Take it to the Sprout Digs by the back wall. The sprouts dig you upgrades, and those stay forever.","Then go again. A little deeper every time."]},
 {id:'l_unlock',who:'LOUIE',when:()=>charUnlocked('LOUIE'),lines:["WOOF WOOF! (Louie has dropped his stick at your feet. He's coming down with you now.)","ARF! (Pick him when you go down the Burrow. He is very fast. He wants you to know.)"]},
 {id:'e_unlock',who:'ERIN',when:()=>charUnlocked('ERIN'),lines:["You kept bringing me honey, so... I'm coming down with you. If you want.","Pick me when you go down the Burrow. My buds fight harder for me."]},
 {id:'m_unlock',who:'MARCUS',when:()=>charUnlocked('MARCUS'),lines:["Eight falls, bro. EIGHT. I'm going down there myself.","Pick me at the Burrow. I'll show you how it's done. Hydro Jet, baby."]},
 {id:'e_ledger',who:'ERIN',when:()=>RD.stats.runs>=1&&Object.values(RD.bank||{}).some(v=>v>0),lines:["Will! The sprouts you saved are in the Ledger. That's the bed by the wall, look.",
  "Before you go down, pick up to three of them at the bed. They start the run with you and fight for you.","Find more down there and your string grows. When it's full, the extras climb up here to the bed.",
  "Spare sprouts trade at the bed too. That's the Exchange. Up here, sprouts buy almost everything."]},
 {id:'r_escape',who:'RANGER',when:()=>RD.stats.escapes>=1,lines:["You came out the bottom and back up. Not many have.","The gate by the wall is open now. The Pact of Roots.","Sign it and the deep gets meaner. Meaner deep, better rewards. Your call, keeper."]},
 {id:'m_caps',who:'MARCUS',when:()=>RD.stats.runs>=1&&(typeof meta!=='undefined')&&(meta.ltix||0)>0,lines:["Bro. BRO. You've got capsule tickets and you're just... holding them?",
  "Press START, hit CAPSULES. One Lantern ticket, one capsule. Keepers, lanterns, weapons.","Bosses pay them. Escapes pay them. Erin's stand pays them. Even the Lantern achievements on the shelf pay them, J.","Don't thank me. Actually, thank me."]}];
/* after a fall, whoever knows that foe best walks over and says how it works (once per foe, the first time it gets you).
   The game teaches through its people instead of a manual; nothing about the foes themselves changes. */
const RDLESSON={
 grub:{who:'MARCUS',lines:["Bro. Grublets. GRUBLETS got you. The little ones.","They just run straight at you, J. Swing first, keep moving. Your sprouts eat them for breakfast. Let them."]},
 spitter:{who:'SCOUT',lines:["Spore Spitters keep their distance. Fascinating. Also rude.","Walk right at them. They back away, so pin them against a wall. When one flashes red, it's about to spit. Step aside."]},
 beetle:{who:'RANGER',lines:["Root Beetles shake before they charge. Every time.","When one shakes, step aside. It can't turn once it's going. Then hit it from behind."]},
 shade:{who:'SCOUT',lines:["Mothshades blink right up next to you. I've timed it. Twice.","Watch for a little sparkle near your feet. That's where it's about to land. Dash the moment you see it."]},
 crab:{who:'RANGER',lines:["That crab spends most of its time in its shell. Hitting the shell barely scratches it.","Wait for it to come out, then hit hard. Fire burns straight through the shell, if an Ember boon offers."]},
 wisp:{who:'ERIN',lines:["Those little fire wisps got you? They circle around and throw sparks.","Don't chase the circle, Will. Step right through it and swat them. They pop easy."]},
 boom:{who:'MARCUS',lines:["You blew yourself up. With a boom bulb. Bro.","Hit it, then MOVE. It fizzes first. The foes stand next to it, J. Not you."]},
 boss0:{who:'ERIN',lines:["The Grub Mother calls her children when she's hurt. I could hear them from up here.","When she wiggles, she's about to charge, so step aside. Clear the little ones so they can't crowd you."]},
 boss1:{who:'SCOUT',lines:["The Drowned King leaps to wherever you were standing. Did you see the red ring?","When the ring shows, move. He lands on the ring, not on you. Probably. Science says move."]},
 boss2:{who:'RANGER',lines:["The Hollow Keeper wears your face. It charges in a straight line.","When the deep shouts DASH, dash. Then hit it while it turns around."]}};
RDAPPR.splice(2,0,...Object.keys(RDLESSON).map(k=>({id:'lesson_'+k,who:RDLESSON[k].who,lines:RDLESSON[k].lines,when:()=>!!(RD.lastRun&&RD.lastRun.hit===k)})));
let rdAppr=null,rdApprWait=0,rdApprTalk=false;
/* the walk-up waiting for this person, if any (talking to them first plays it, so nothing is missed) */
function rdApprPending(who){RD.heard=RD.heard||{};for(const a of RDAPPR){if(a.who!==who||(a.flag?RD.flags[a.id]:RD.heard[a.id]))continue;let ok=false;try{ok=a.when()}catch(e){}if(ok)return a}return null}
function rdApprCheck(){RD.heard=RD.heard||{};for(const a of RDAPPR){const done=a.flag?RD.flags[a.id]:RD.heard[a.id];if(done)continue;let ok=false;try{ok=a.when()}catch(e){}if(ok&&HUBNPC[a.who]){rdApproach(a);return true}}return false}
function rdApproach(a){if(a.flag)RD.flags[a.id]=1;else RD.heard[a.id]=1;if(a.who==='ERIN')RD.flags.met_ERIN=1;rdSave();
 const n=HUBNPC[a.who];n.wait=0;rdAppr={a,t:0};hubMsg='';hubBark=null;P3.vx=P3.vy=0;state='g3appr';snd(392,.2,523,'triangle',.04)}
function apprUpdate(dt){const A=rdAppr,n=HUBNPC[A.a.who];A.t+=dt;const side=n.x<P3.x?-1:1,tx=P3.x+side*16,ty=P3.y-2,dx=tx-n.x,dy=ty-n.y,d=Math.hypot(dx,dy);
 if(A.t>.45){if(d>2&&A.t<4&&!pressed('a')){const sp=(NPCSPD[A.a.who]||32)*2;n.x+=dx/d*Math.min(d,sp*dt);n.y+=dy/d*Math.min(d,sp*dt)}
  else{n.x=tx;n.y=ty;n.wait=4;P3.fx=side;P3.ax=side;P3.ay=0;rdTalkL=A.a.lines;talkNPC=A.a.who;uiSel=0;talkStart=0;talkLine=0;talkTxt=rdLn(A.a.lines[0]);rdApprTalk=true;state='g3talk';snd(520,.04)}}
 if(A.t>.45&&P3)P3.fx=side;}
function rdDrawLetterbox(k,top){const h=Math.round(16*k);r('#000000',0,0,W,h);if(!top)r('#000000',0,H-h,W,h)}
let rdTalkL=null;
function hubTarget(){let best=null,bd=17*17;
 for(const s of STATIONS){const d=(P3.x-s.x)**2+(P3.y-70)**2;if(d<bd*1.3){bd=d;best={kind:'station',id:s.id,n:s.n,x:s.x,y:70}}}
 for(const who of NPCS){const n2=HUBNPC[who],x=n2?n2.x:NPCPOS[who][0],y=n2?n2.y:hubY(NPCPOS[who][1]);const d=(P3.x-x)**2+(P3.y-y)**2;if(d<bd){bd=d;best={kind:'npc',who,n:who,x,y}}}
 const bY=hubL().bedY+16,db2=(P3.x-41)**2+(P3.y-bY)**2;if(db2<bd*1.6){bd=db2;best={kind:'sprouts',n:'SPROUT LEDGER',x:41,y:bY}}
 const d=(P3.x-W/2)**2+(P3.y-(H-13))**2;if(d<bd)best={kind:'descend',n:'THE BURROW — GO DOWN',x:W/2,y:H-13};
 return best;}
function hubUpdate(dt){if(pressed('sel')){rdSave();eject();return}
 if(pressed('start')){hpSel=0;hpArm=0;state='g3hpause';snd(660,.06,880);return}
 if(rdApprWait>0)rdApprWait-=dt;else if(rdApprCheck())return;
 movePlayer(dt,84);
 for(const who of NPCS){const n=HUBNPC[who];if(!n)continue;
  if(n.act>0)n.act-=dt;
  if(n.wait>0){n.wait-=dt;continue}
  const rp=n.route[n.ri],tx2=rp==='P3'?P3.x:rp.x+n.jx,ty2=rp==='P3'?P3.y:rp.y+n.jy;
  const dx=tx2-n.x,dy=ty2-n.y,d=Math.hypot(dx,dy);
  if(d<3){n.act=rp!=='P3'&&rp.act?1.4:0;
   n.wait=who==='MARCUS'&&n.ri===0?1.2+Math.random()*1.4:.5+Math.random()*1.3;
   n.ri=(n.ri+1)%n.route.length;n.jx=R(-6,6);n.jy=R(-3,3)}
  else{const sp=NPCSPD[who]||32;n.x+=dx/d*sp*dt;n.y+=dy/d*sp*dt}}
 for(let i=0;i<NPCS.length;i++)for(let j=i+1;j<NPCS.length;j++){const a=HUBNPC[NPCS[i]],c=HUBNPC[NPCS[j]];if(!a||!c)continue;
  const dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy);if(d>0&&d<22){const push=(22-d)/2,ux=dx/d,uy=dy/d;a.x-=ux*push;a.y-=uy*push;c.x+=ux*push;c.y+=uy*push}}
 for(const who of NPCS){const n=HUBNPC[who];if(n){n.y=Math.max(78,Math.min(H-40,n.y));n.x=Math.max(12,Math.min(W-12,n.x))}}
 hubBarkT-=dt;if(hubBark){hubBark.t-=dt;if(hubBark.t<=0)hubBark=null}
 if(hubBarkT<=0){hubBarkT=5+Math.random()*4;const pool=NPCS.filter(w=>HUBNPC[w]&&HUBNPC[w].y>96&&!rdTopic(w)&&Math.hypot(HUBNPC[w].x-P3.x,HUBNPC[w].y-P3.y)<150);
  if(pool.length){const w=pool[(Math.random()*pool.length)|0],L2=RDBARK[w]||['...'];hubBark={who:w,txt:rdLn(L2[(Math.random()*L2.length)|0]),t:2.6}}}
 const t=hubTarget();
 hubMsg=t?('A: '+t.n):'';if(hubMsgT>0)hubMsgT-=dt;
 if(t&&pressed('a')){snd(520,.05);
  if(t.kind==='descend'){if(CHARS.filter(c=>charUnlocked(c.id)).length<=1){RD.char='WILL';rdGoDown();return}uiSel=Math.max(0,CHARS.findIndex(c=>c.id===(RD.char||'WILL')));state='g3chars';return}
  if(t.kind==='sprouts'){sprPage=0;uiSel=0;state='g3sprouts';return}
  if(t.kind==='npc'){const ap=rdApprPending(t.who);if(ap){if(ap.flag)RD.flags[ap.id]=1;else RD.heard[ap.id]=1;if(ap.who==='ERIN')RD.flags.met_ERIN=1;rdSave();rdTalkL=ap.lines;talkNPC=t.who;uiSel=0;talkStart=0;talkLine=0;talkTxt=rdLn(ap.lines[0]);rdApprTalk=true;state='g3talk';return}}
  if(t.kind==='npc'&&t.who==='ERIN'&&!RD.flags.met_ERIN){rdTalkL=RDINTRO;talkNPC='ERIN';uiSel=0;talkStart=0;talkLine=0;talkTxt=RDINTRO[0];RD.flags.met_ERIN=1;rdSave();state='g3talk';return}
  if(t.kind==='npc'){const tp=rdTopic(t.who);if(tp){rdTalkL=tp.lines;RD.heard[tp.id]=1;talkNPC=t.who;uiSel=0;talkStart=0;talkLine=0;talkTxt=rdLn(tp.lines[0]);rdSave();state='g3talk';return}}
  if(t.kind==='npc'){rdTalkL=null;talkNPC=t.who;uiSel=0;
   talkStart=RD.flags['met_'+t.who]?(RD.lineIx[t.who]||1)%LINES[t.who].length:0;
   RD.flags['met_'+t.who]=1;talkLine=0;talkTxt=rdLn(LINES[t.who][talkStart]);RD.lineIx[t.who]=talkStart+1;rdSave()
   state='g3talk';return}
  if(t.id==='mirror'&&!RD.flags.cine_burrow){startCine('mirror','burrow');return}
  uiSel=0;codexPage=0;heatSel=0;state='g3'+t.id;return}}
function talkUpdate(){if(pressed('b')){state='g3hub';if(rdApprTalk){rdApprTalk=false;rdApprWait=1.4}snd(330,.05);return}
 if(pressed('start')&&RD.honey>0&&talkNPC){const who=talkNPC,k=KEEPS.find(k=>k.who===who);
  RD.honey--;RD.gift[who]=(RD.gift[who]||0)+1;if(k&&!RD.keeps[k.id]){RD.keeps[k.id]=1;RD.keepXp[who]=RD.keepXp[who]||0;talkTxt=who+' gave you a keepsake: '+k.n+'! Equip it at the shelf.';snd(784,.12);later(()=>snd(1175,.25),110)}
  else{RD.dew+=5;talkTxt=who+' presses 5 Moondew into your hand. "For the road down."'}rdSave();return}
 if(pressed('a')){const L=rdTalkL||LINES[talkNPC];talkLine++;
  if(talkStart+talkLine>=(rdTalkL?L.length:Math.min(L.length,talkStart+1))){state='g3hub';if(rdApprTalk){rdApprTalk=false;rdApprWait=1.4}if(L===RDINTRO){hubBark={who:'MARCUS',txt:"door's RIGHT there, bro",t:3.5};hubBarkT=6}}else{talkTxt=rdLn(L[talkStart+talkLine]);snd(520,.04)}return}}
function mirrorUpdate(){uiSel=nav(uiSel,MIRROR.length);
 if(pressed('a')){const m=MIRROR[uiSel],rank=mir(m.id);
  if(rank>=m.max){snd(140,.08)}else{const c=m.cost[rank];if(RD.dew>=c){RD.dew-=c;RD.mirror[m.id]=rank+1;rdSave();snd(784,.1);later(()=>snd(1175,.2),100)}else snd(140,.08)}}
 if(pressed('b')||pressed('start'))state='g3hub';}
function armUpdate(){const ids=Object.keys(WEAPONS);uiSel=nav(uiSel,ids.length);
 if(pressed('a')){const id=ids[uiSel],w=WEAPONS[id];
  if(rdOwnsWeapon(id)){RD.weapon=id;rdSave();snd(660,.08,990)}
  else if(RD.keys>=w.cost){RD.keys-=w.cost;RD.weapons.push(id);RD.weapon=id;rdSave();snd(784,.12);later(()=>snd(1175,.25),110)}else snd(140,.08)}
 if(pressed('b')||pressed('start'))state='g3hub';}
function keepUpdate(){uiSel=nav(uiSel,KEEPS.length);
 if(pressed('a')){const k=KEEPS[uiSel];
  if(RD.keeps[k.id]){RD.keepEq=RD.keepEq===k.id?'':k.id;rdSave();snd(660,.08,990)}else snd(140,.08)}
 if(pressed('b')||pressed('start'))state='g3hub';}
function codexUpdate(){if(pressed('left')){codexPage=Math.max(0,codexPage-1);snd(520,.04)}if(pressed('right')){codexPage=Math.min(3,codexPage+1);snd(520,.04)}
 if(pressed('b')||pressed('a')||pressed('start'))state='g3hub';}
function heatUpdate(){if(RD.stats.escapes<1){if(pressed('a')||pressed('b')||pressed('start'))state='g3hub';return}
 heatSel=nav(heatSel,PACT.length);const p=PACT[heatSel],cur=RD.pact[p.id]||0;
 if(pressed('right')&&cur<p.max){RD.pact[p.id]=cur+1;rdSave();snd(660,.06,880)}
 if(pressed('left')&&cur>0){RD.pact[p.id]=cur-1;rdSave();snd(440,.06)}
 if(pressed('b')||pressed('start'))state='g3hub';}
function boonUpdate(){uiSel=nav(uiSel,boonOffer.length);
 if(pressed('a')&&boonOffer.length){const b=boonOffer[uiSel];takeBoon(b);boonOffer=[];boonReturn();}}
function shopUpdate(){uiSel=nav(uiSel,shopItems.length+1);
 if(pressed('a')){if(uiSel===shopItems.length){rdNextChamber();state='g3run';return}
  const it=shopItems[uiSel];
  if(it.sold){snd(140,.08)}else if(RUN.petals>=it.p){RUN.petals-=it.p;it.sold=true;snd(700,.08,1100);it.act()}else snd(140,.08)}
 if(pressed('b')){rdNextChamber();state='g3run'}}
let hpSel=0,hpArm=0,rdSavedT=0;
const HPITEMS=['RESUME','SAVE GAME','SETTINGS','CAPSULES','NEW GAME','QUIT TO TITLE','SWAP CARTRIDGE'];
const HPDESC=['BACK TO THE HEARTH','SAVES EVERYTHING. IT ALSO SAVES ON ITS OWN','MUSIC, SOUND, SHAKE, LANTERN','ONE MACHINE FOR EVERY CARTRIDGE','WIPE ROOTDEEP AND START OVER','THE ROOTDEEP TITLE MENU','BACK TO THE CARTRIDGE SHELF'];
function rdSavedMark(){rdSavedT=1.8}
function hpauseUpdate(){const was=hpSel;hpSel=nav(hpSel,HPITEMS.length);if(hpSel!==was)hpArm=0;
 if(pressed('b')||pressed('start')){state='g3hub';snd(440,.05);return}
 if(pressed('a')){const k=HPITEMS[hpSel];snd(660,.06,990);
  if(k==='RESUME')state='g3hub';
  else if(k==='SAVE GAME'){rdSave();rdSavedMark()}
  else if(k==='SETTINGS'){setReturn='g3hpause';uiSel=0;state='g3set'}
  else if(k==='CAPSULES')lanOpen('g3hpause','caps');
  else if(k==='NEW GAME'){if(hpArm<2){hpArm++;snd(330,.1)}else{hpArm=0;rdNewGame()}}
  else if(k==='QUIT TO TITLE'){rdSave();menuSel=0;newArm=0;state='g3menu'}
  else{rdSave();eject()}}}
function drawHPause(){hubMsg='';drawHub();r('rgba(8,5,14,.86)',0,0,W,H);const st=19,n=HPITEMS.length,ph=n*st+40,y0=Math.round((H-ph)/2);
 r('#181020',W/2-82,y0-2,164,ph+4);r('#241a38',W/2-80,y0,160,ph);r('#ffd94d',W/2-80,y0,160,1);ctext('THE HEARTH',y0+6,2,'#ffd94d','#403010');
 drawList(HPITEMS,hpSel,y0+34,st);
 const dsc=HPITEMS[hpSel]==='NEW GAME'&&hpArm?(hpArm===1?'A AGAIN: ARE YOU SURE?':'ONCE MORE: ALL ROOTDEEP PROGRESS GOES'):HPDESC[hpSel];
 ctext(dsc,y0+ph+12,1,hpArm?'#ff9a8a':'#a89ec2',null);ctext('B: BACK',H-13,1,'#8d84a8',null)}
function rdDrawSaved(){if(rdSavedT<=0)return;const a=Math.min(1,rdSavedT*2),x=W-46,y=17;g.save();g.globalAlpha=a;r('#181020',x-1,y-1,44,13);r('#2a4a2a',x,y,42,11);
 r('#a8f080',x+3,y+5,2,2);r('#a8f080',x+5,y+7,2,2);r('#a8f080',x+7,y+5,2,2);r('#a8f080',x+9,y+3,2,2);text('SAVED',x+14,y+2,1,'#e8ffd8',null);g.restore()}
function pauseUpdate(){if(pressed('b')){if(pausePage===1){pausePage=0}else state='g3run';return}
 if(pausePage===1){if(pressed('a')||pressed('start'))pausePage=0;return}
 pauseSel=nav(pauseSel,6);
 if(pressed('start')){state='g3run';return}
 if(pressed('a')){if(pauseSel===0)state='g3run';else if(pauseSel===1)pausePage=1;
  else if(pauseSel===2){setReturn='g3pause';uiSel=0;state='g3set'}
  else if(pauseSel===3){RUN=null;rdSave();menuSel=0;state='g3menu';snd(784,.1)}
  else if(pauseSel===4){rdAbandon();hubEnter()}else{RUN=null;rdSave();eject()}}}

/* ---------------- intro cinematic ---------------- */
/* cinematics: the intro, each boss the first time you meet it, the first escape, the Sprout King.
   lines can be a function so the radio voice fits whoever is diving. */
const rdRadio=(marcus,scout)=>()=>[RUN&&RUN.char==='MARCUS'?['SCOUT',scout]:['MARCUS',marcus]];
const RDCINES={
 intro:[
 {d:5.5,bg:'garden',lines:[[null,'The Great Lantern kept the garden lit.'],['ERIN','Under it, everything grew. Every bit of it.']]},
 {d:6,bg:'crack',lines:[['LOUIE','WOOF. (The ground just growled.)'],['ERIN','The light is going DOWN, Will. Something under us is hungry.']]},
 {d:7.5,bg:'hearth',lines:[['SCOUT','Statistically, one of us should supervise from up here.'],['MARCUS','Bro. A haunted basement. Love that for you. Not going.'],['ERIN','Bring me back a story, keeper.']]},
 {d:4,bg:'door',lines:[[null,'So the keeper went down.']]}],
 boss0:[{d:4.5,bg:'boss',boss:0,lines:[[null,'Something huge is chewing on the roots.'],['GRUB MOTHER','MORE. LIGHT. MORE.']]},
  {d:3.6,bg:'boss',boss:0,lines:rdRadio('Bro. That is a worm with a crown. End it. I want to go to bed.','A grub with a crown. Fascinating. Hit it.')}],
 boss1:[{d:4.5,bg:'boss',boss:1,lines:[[null,'The water in here stands up.'],['DROWNED KING','I DRANK YOUR LANTERN, LITTLE LIGHT.']]},
  {d:3.6,bg:'boss',boss:1,lines:rdRadio('Bro, it TALKS. I hate when they talk. Hit it in the mouth.','It talks. Noting that. Please do not die.')}],
 boss2:[{d:4.5,bg:'boss',boss:2,lines:[[null,'At the very bottom, someone is waiting.'],['HOLLOW KEEPER','You left the light on for nobody.']]},
  {d:3.8,bg:'boss',boss:2,lines:()=>[RUN&&RUN.char==='ERIN'?['LOUIE','WOOF. (That is not Will. Bite it.)']:['ERIN',"Whatever that is, it isn't you. Come home."]]}],
 escape:[{d:4.5,bg:'escape',lines:[[null,'The keeper climbed out of the deep.'],['ERIN','You brought some light back up with you.']]},
  {d:4.5,bg:'escape',lines:[['MARCUS','Cool, bro. Now do it again with heat. Unless you\'re scared. You\'re scared.'],[null,'The Pact of Roots is open at the Hearth.']]}],
 burrow:[{d:5,bg:'burrow',lines:()=>RDBURROWL[RD.char||'WILL']||RDBURROWL.WILL},{d:4,bg:'burrow',lines:[[null,'Give them Moondew and they dig you something stronger. It lasts forever.']]}],
 descend:[{d:3.6,bg:'descend',lines:()=>(RUN&&RUN.descL)||[]}],
 drop:[{d:2.6,bg:'drop',lines:[]}],
 surface:[{d:3.6,bg:'surface',lines:()=>[[null,(RUN&&RUN.surfN||0)+((RUN&&RUN.surfN)===1?' sprout heads':' sprouts head')+' up to the surface.'],RDSURFL[(RUN&&RUN.char)||'WILL']||RDSURFL.WILL]}],
 king:[{d:4.5,bg:'king',lines:[[null,'Six buds in a row. Something in the dark noticed.'],['SPROUT KING','You carried my court all the way down.']]},
  {d:4.5,bg:'king',lines:[['SPROUT KING','The buds have chosen. I walk with you, keeper.'],['MARCUS','Bro. The salad has a crown now. Never been this jealous of a salad.']]}]};
const RDCINE=RDCINES.intro;
/* going down: a line for whoever's diving (picked once, so it doesn't flicker), and Erin's push on the very first one */
const RDDESCL={WILL:[['WILL','Lantern lit. Down we go.'],['WILL','Okay, deep. Round two.'],['WILL',"Stay close, buds. It's dark down there."]],
 ERIN:[['ERIN','Hold on, buds. Mind the roots.'],['ERIN',"Back soon. Don't let Marcus touch my seeds."],['ERIN','Okay. Okay. In we go.']],
 LOUIE:[['LOUIE','WOOF! (Head first. Always head first.)'],['LOUIE','ARF ARF! (He has smelled something down there.)']],
 MARCUS:[['MARCUS','Bro. Watch this. Actually nobody watch this.'],['MARCUS','Marcus, going in. Tell the people I was brave.'],['MARCUS',"If I'm not back in ten, I'm busy winning."]],
 KING:[['SPROUT KING','Court. We descend.'],['SPROUT KING','The roots remember their king. Onward.']]};
function rdDescPick(){const k=RUN.char||'WILL',L=RDDESCL[k]||RDDESCL.WILL;
 if(RD.stats.runs<=1){RUN.descL=[[null,'The Burrow under the Hearth goes all the way down.'],['ERIN','Find sprouts down there, Will. Pluck them with A. They fight for you.'],['ERIN','When you fall, you come back here. Nobody stays down. Go on.']];RDCINES.descend[0].d=9}
 else{RUN.descL=[L[(Math.random()*L.length)|0]];RDCINES.descend[0].d=3.6}}
/* between chambers: the room you just cleared, any rescued sprouts climbing up to the surface, then the drop */
function rdQueueDrop(){const n=RUN.surfN||0,k=RUN.char||'WILL';let L=[];
 if(n){L=!RD.flags.surf_told?[[null,'Your string is full, so '+n+(n===1?' rescued sprout climbs':' rescued sprouts climb')+' up to the surface.'],[null,'They go home to the Ledger. Spend them up there.'],RDSURFL[k]||RDSURFL.WILL]
  :[[null,n+(n===1?' rescued sprout climbs':' rescued sprouts climb')+' up to the surface.'],RDSURFL[k]||RDSURFL.WILL];RD.flags.surf_told=1}
 RDCINES.drop[0].d=n?2.6+L.length*1.9:2.6;RDCINES.drop[0].lines=L;RUN.dropFrom=RUN.chamber;(RUN.cineQ=RUN.cineQ||[]).push('drop')}
/* the chamber card both scenes end on: CHAMBER 5 / THE FLOODED VAULT */
function rdDrawChamberCard(sc,y){const t=rdCineT,k=Math.max(0,Math.min(1,(t-(sc.d-1.3))/.35));if(!RUN||k<=0)return;
 const ch=RUN.chamber,b=ch<=4?0:ch<=8?1:2;g.save();g.globalAlpha=k;
 ctext((ch%4===0?'BOSS · ':'')+'CHAMBER '+ch,y,2,'#ffffff','#181020');ctext(BIOMES[b].n,y+20,1,['#c8a0e8','#7fd0e8','#f8a060'][b],null);g.restore()}
const RDCPLATE={WILL:'#2a6a88',ERIN:'#b8304a',MARCUS:'#3a3a44',SCOUT:'#1f6a72',LOUIE:'#7a4a28',RANGER:'#38603a','GRUB MOTHER':'#7a3a9a','DROWNED KING':'#2a6a88','HOLLOW KEEPER':'#3a3050','SPROUT KING':'#3c8a30'};
let rdCineT=0,rdCineIx=0,rdCineDest='hub',rdCineKey='intro',rdCineSeq=RDCINES.intro;
const rdLines=sc=>typeof sc.lines==='function'?sc.lines():sc.lines;
function startCine(dest,key){rdCineKey=key||'intro';rdCineSeq=RDCINES[rdCineKey];rdCineIx=0;rdCineT=0;rdCineDest=dest;state='g3cine';snd(392,.3,196,'triangle',.05)}
function endCine(){if(rdCineKey==='intro')RD.flags.cineSeen=1;else RD.flags['cine_'+rdCineKey]=1;rdSave();
 if(rdCineDest==='mirror'){uiSel=0;state='g3mirror'}else if(rdCineDest==='hub'){hubEnter();if(rdCineKey==='intro')rdApprWait=.6}else if(rdCineDest==='run')state='g3run';else if(rdCineDest==='win')state='g3win';else{menuSel=0;state='g3menu'}}
function cineUpdate(dt){rdCineT+=dt;const sc=rdCineSeq[rdCineIx],LN=rdLines(sc),NL=Math.max(1,LN.length);
 if(pressed('start')||pressed('sel')){endCine();return}
 if(pressed('a')){const seg=sc.d/NL,cur=Math.min(NL-1,Math.floor(rdCineT/seg));
  if(cur<NL-1)rdCineT=(cur+1)*seg+.01;
  else{rdCineIx++;rdCineT=0;if(rdCineIx>=rdCineSeq.length){endCine();return}}}
 if(rdCineT>=sc.d){rdCineIx++;rdCineT=0;if(rdCineIx>=rdCineSeq.length)endCine()}}
function cineActor(x,y,fx){const sax=P3.ax,say=P3.ay;P3.ax=fx||1;P3.ay=0;drawPlayerSpr(x,y,1);P3.ax=sax;P3.ay=say}
/* ================= STAGES =================
   Rootdeep's cinematics use Sprouts' own cutscene language (see drawCine in Sprouts):
   a side-view stage, sky bands or a cave, hills, a ground strip, the speaker drawn large,
   everyone else at 2x, the Great Lantern from Sprouts' drawHearth and Louie from drawDog.
   base(hh) sets the stage height; the ground line is hh-14. */
const RSTG={HH:0,GY:0,
 base(hh){this.HH=hh;this.GY=hh-14;return this},
 sky(k){const hh=this.HH;
  if(k==='night'){r('#101838',0,0,W,hh);for(let i=0;i<30;i++)r(i%5?'#8090c8':'#ffffff',(i*53+17)%240,(i*29+7)%Math.max(20,hh-50),1,1)}
  else(k==='dawn'?[['#9ab8e8',0],['#e8b8c0',.26],['#f8d8b0',.46]]:[['#f8b878',0],['#f8c890',.2],['#f8dca8',.42]]).forEach(([c,q])=>r(c,0,Math.round(hh*q),W,hh-Math.round(hh*q)))},
 hills(k){const hh=this.HH,n=k==='night';g.fillStyle=n?'#182848':k==='dawn'?'#8cbc80':'#78c078';g.beginPath();g.arc(50,hh+14,72,0,7);g.arc(190,hh+30,92,0,7);g.fill();
  r(n?'#1c3828':'#58b858',0,hh-26,W,26);r(n?'#142c20':'#3c9848',0,hh-26,W,2);for(let i=0;i<16;i++)r(n?'#24482f':'#84d870',(i*37+5)%W,hh-20+((i*7)%14),2,1)},
 cave(){const hh=this.HH;r('#181428',0,0,W,hh);g.fillStyle='#241c38';g.beginPath();g.arc(120,hh+40,170,0,7);g.fill();
  for(let k=0;k<11;k++){const x=(k*23+8)%236,len=10+(k*7)%26;r('#3a2620',x,0,3,len);r('#6e4a2a',x+1,0,1,len-2);r('#3a2620',x+(k%2?2:-1),len-2,2,4)}
  r('#3b2620',0,hh-26,W,26);r('#24150f',0,hh-26,W,2);for(let i=0;i<12;i++)r('#4e3530',(i*41+9)%W,hh-20+((i*5)%14),3,1)},
 /* a sprite with its feet on the ground line, at an exact integer scale */
 put(spr,x,s,fx,dy){const w=spr.width*s,h=spr.height*s,gy=this.GY+(dy||0);r('rgba(0,0,0,.28)',Math.round(x-w*.33),gy+1,Math.round(w*.66),s+1);
  g.save();g.translate(Math.round(x),gy-h+s);if(fx<0)g.scale(-1,1);g.translate(-(w>>1),0);g.drawImage(spr,0,0,w,h);g.restore()},
 lantern(x,sc,n){const so=ox,sy=oy,sh=shards;shards=n;g.save();g.translate(x,this.GY);g.scale(sc,sc);ox=HX;oy=HY;drawHearth();g.restore();ox=so;oy=sy;shards=sh},
 dog(x,sc,sit,fx,alert){const so=ox,sy=oy;g.save();g.translate(Math.round(x),this.GY);g.scale(sc,sc);ox=oy=0;drawDog({x:0,y:0,fx:fx||-1,mv:false,st:sit?'sit':'follow',alert:alert?1:0,say:null});g.restore();ox=so;oy=sy},
 keeper(id,x,s,fx,dy){if(id==='LOUIE')return this.dog(x,s,false,fx);const spr=id==='KING'?RDKING.ol:id==='WILL'?SP.pd:CH[id];if(spr)this.put(spr,x,s,fx,dy)},
 bud(x,type,s,hop){const z=Math.round(Math.abs(Math.sin(time*5+type*1.7))*(hop||0));g.save();g.translate(Math.round(x),this.GY-z*s);g.scale(s,s);drawBud({x:ox,y:oy,type,stage:2,z:0,a:type,mv:true,st:'follow',fx:1});g.restore()},
 sprout(x,type,s){g.save();g.translate(Math.round(x),this.GY);g.scale(s,s);drawSprout({x:ox,y:oy+2,type,age:30});g.restore()}};

/* the cutscenes. The current speaker is drawn at 3x, everyone else at 2x */
function rdDrawCine(){const sc=rdCineSeq[rdCineIx],tt=rdCineT,LN=rdLines(sc),seg=sc.d/Math.max(1,LN.length),li=Math.min(Math.max(0,LN.length-1),Math.floor(tt/seg)),ln=LN[li]||[null,''],spk=ln[0],S=RSTG.base(H-74),gy=S.GY,hh=S.HH,
  kp=(RUN&&RUN.char)||RD.char||'WILL',who=(id,x,fx)=>S.keeper(id,x,spk===id?3:2,fx);
 if(sc.bg==='garden'){S.sky('dusk');S.hills('dusk');
  r('#8a5a3a',8,gy-5,46,9);r('#6e4428',8,gy-5,46,2);for(let k=0;k<3;k++)S.sprout(18+k*14,k,1);
  S.lantern(120,2,4);S.keeper('WILL',74,2,1);S.dog(160,2,true,-1);who('ERIN',200,-1);}
 else if(sc.bg==='crack'){const sh=tt<1.2?1:0;g.save();if(sh)g.translate(Math.round(R(-1.2,1.2)),0);
  S.sky('night');S.hills('night');S.lantern(120,2,Math.max(0,4-Math.floor(tt*1.1)));
  /* the ground splits open under the Lantern and its light drains down into it */
  const w=Math.min(78,tt*52);for(let x=-w;x<=w;x+=2){const k=1-Math.abs(x)/Math.max(1,w),d=Math.round((6+((x*7+40)&7))*k*2.2);if(d<1)continue;
   r('#04060a',120+x,hh-26,2,Math.min(26,d));if(k>.55&&((x/2)|0)%3===0)r('rgba(88,240,192,.55)',120+x,hh-26+Math.min(24,d)-1,2,1)}
  for(let i=0;i<10;i++){const p=((tt*.8+i*.1)%1);r(i%2?'#ffd94d':'#fff3b0',Math.round(120+Math.sin(i*2.3)*10*(1-p)),Math.round(gy-44+p*(hh-gy+58)),2,2)}
  S.keeper('WILL',62,2,1);S.dog(92,2,false,1,true);who('ERIN',196,-1);g.restore();}
 else if(sc.bg==='hearth'){const A=rdArt();r('#3b2620',0,0,W,hh-26);for(let i=0;i<5;i++)r('#34211c',0,Math.round((hh-26)*(i+1)/6),W,1);for(let i=0;i<18;i++)r(i%3?'#4b3228':'#6e4a2a',(i*53+11)%W,(i*37+9)%Math.max(10,hh-34),i%3?3:1,i%3?1:5);
  for(let x=0;x<W;x+=16)g.drawImage(A.hubWood||TL.wood,x,hh-26);r('#3a2414',0,hh-10,W,10);
  /* the fire, and a lamp on a chain */
  r('#4a4048',8,gy-40,36,40);r('#2a2028',12,gy-34,28,34);r('#5a5058',6,gy-44,40,5);
  const fl=((time*10)|0)%2;r('#f07830',16,gy-12-fl,20,12+fl);r('#f8d030',20,gy-9,12,9);r('#fff3b0',24,gy-6+fl,4,5);
  r('#3a2c1c',W/2,0,1,24);r('#3a2c1c',W/2-5,24,11,12);r('#ffd94d',W/2-3,26,7,8);r('#fff3b0',W/2-1,28,3,4);
  who('ERIN',66,1);S.dog(96,2,true,1);who('MARCUS',128,1);who('SCOUT',160,-1);who('RANGER',192,-1);S.put(SP.pu,224,2,1);
  rdLight([{x:W/2,y:30,r:70,c:'#ffd27a'},{x:26,y:gy-8,r:50,c:'#f8a040'}],'rgba(20,8,16,.32)');}
 else if(sc.bg==='door'){S.cave();
  /* the root door: an arch in the rock with the deep's green light breathing out of it */
  const dx=W/2,top=gy-70,pul=.35+.15*Math.sin(time*3);g.save();g.globalAlpha=pul;g.fillStyle='#58f0c0';g.beginPath();g.arc(dx,gy-30,46,0,7);g.fill();g.restore();
  r('#0b0812',dx-20,top+14,40,56);g.fillStyle='#0b0812';g.beginPath();g.arc(dx,top+16,20,Math.PI,0);g.fill();
  g.save();g.globalAlpha=.35+.2*Math.sin(time*4);r('#58f0c0',dx-14,top+22,28,48);g.restore();
  for(let k=0;k<14;k++){const a=Math.PI+k/13*Math.PI,x=Math.round(dx+Math.cos(a)*24),y=Math.round(top+16+Math.sin(a)*24);r('#6e4a2a',x-2,y-2,4,4);r('#8a5e36',x-1,y-2,2,1)}
  r('#6e4a2a',dx-24,top+16,4,54);r('#6e4a2a',dx+20,top+16,4,54);
  const wx=Math.min(dx-6,24+tt*34),fade=Math.max(0,Math.min(1,(dx-14-wx)/20+.15));g.save();g.globalAlpha=fade;S.keeper(kp,wx,2,1);g.restore();
  if(tt>2.1){ctext('ROOTDEEP',29,5,'#181020',null);ctext('ROOTDEEP',26,5,'#ffd94d','#403010')}}
 else if(sc.bg==='escape'){S.sky('dawn');S.hills('dawn');
  /* the Lantern blazes; the keeper is out of the hole, and the buds pop out after */
  for(let i=0;i<10;i++){const a=i/10*6.283+time*.3;g.save();g.globalAlpha=.18;g.strokeStyle='#fff3b0';g.lineWidth=3;g.beginPath();g.moveTo(132,gy-40);g.lineTo(132+Math.cos(a)*90,gy-40+Math.sin(a)*70);g.stroke();g.restore()}
  S.lantern(132,2,4);r('#24150f',38,hh-24,40,8);r('#0b0812',42,hh-22,32,5);
  for(let i=0;i<4;i++){const a=tt-.5-i*.35;if(a>0){const k=Math.min(1,a/.45),x=52+i*8+k*(i*10-6),y=Math.round(-Math.sin(k*Math.PI)*16);g.save();g.translate(0,y);S.bud(x,i+1,2,a>.45?3:0);g.restore()}}
  S.keeper(kp,96,2,1);
  if(rdCineIx===0)who('ERIN',206,-1);else who('MARCUS',214,-1);
  S.dog(170,2,true,-1);}
 else if(sc.bg==='king'){S.cave();
  g.save();g.globalAlpha=.25+.08*Math.sin(time*3);g.fillStyle='#b8f890';g.beginPath();g.arc(W/2,gy-30,52,0,7);g.fill();g.restore();
  [[52,0],[78,1],[162,2],[188,3],[30,4],[210,5]].forEach(([x,t2])=>S.bud(x,t2,2,4));
  S.put(RDKING.ol,W/2,spk==='SPROUT KING'||rdCineIx===0?4:3,1);if(((time*3)|0)%2)r('#ffffff',W/2+6,gy-60,2,2);
  if(rdCineIx===1)S.keeper('MARCUS',226,spk==='MARCUS'?3:2,-1);}
 else if(sc.bg==='surface'){const top=Math.round(hh*.28),kp2=(RUN&&RUN.char)||'WILL',sx=W/2+20;
  /* a shaft up through the earth to daylight; the waiting sprouts climb it and pop out onto the grass */
  [['#9ab8e8',0],['#e8b8c0',.5]].forEach(([c,q])=>r(c,0,Math.round(top*q),W,top));r('#58b858',0,top-6,W,6);r('#3c9848',0,top-1,W,2);
  r('#3b2620',0,top+1,W,hh-top);for(let i=0;i<14;i++)r('#4e3530',(i*41+9)%W,top+8+((i*29)%(hh-top-20)),3,1);
  r('#120a10',sx-14,top-2,28,hh-top-24);r('#24150f',sx-15,top-2,1,hh-top-24);r('#24150f',sx+14,top-2,1,hh-top-24);
  g.save();g.globalAlpha=.25;r('#fff3b0',sx-12,top-2,24,hh-top-24);g.restore();
  r('#6e4a2a',sx-7,top,1,hh-top-26);r('#6e4a2a',sx+6,top,1,hh-top-26);for(let y=top+4;y<hh-26;y+=6)r('#6e4a2a',sx-7,y,14,1);
  const T=(RUN&&RUN.surfT)||[0,1,2];T.forEach((ty,i)=>{const k=Math.min(1,Math.max(0,(tt-i*.3)/1.6)),y=Math.round((hh-30)-(hh-30-top+6)*k);
   if(k<1){g.save();g.translate(sx,y);g.scale(2,2);drawBud({x:ox,y:oy,type:ty,stage:2,z:0,a:time*8+i,mv:true,st:'follow',fx:1});g.restore()}
   else{const px=sx+22+i*14-((i%2)?6:0);g.save();g.translate(px,top-4-Math.round(Math.abs(Math.sin(time*6+i))*3));g.scale(2,2);drawBud({x:ox,y:oy,type:ty,stage:2,z:0,a:i,mv:true,st:'follow',fx:1});g.restore()}});
  S.keeper(kp2,sx-48,2,1);
  rdLight([{x:sx,y:top,r:70,c:'#fff3b0'},{x:sx-48,y:gy-14,r:40,c:rdLanternC()}],'rgba(14,6,22,.3)');}
 else if(sc.bg==='descend'||sc.bg==='drop'){const d=sc.d,fall=Math.max(0,tt-(d-1.3)),go=d-2.1,hx=W/2,hy=gy-2;
  if(fall<=0){
   if(sc.bg==='descend'){const A=rdArt();for(let y=15;y<hh;y+=16)for(let x=0;x<W;x+=16)g.drawImage(A.hubWood,x,y);r('#3b2620',0,15,W,22);for(let x=0;x<W;x+=16)g.drawImage(A.B[0].wall,x,20);
    r('#3a2c1c',hx,15,1,16);r('#3a2c1c',hx-4,31,9,8);r('#ffd94d',hx-2,33,5,5)}
   else{const pb=RUN.dropFrom<=4?0:RUN.dropFrom<=8?1:2,AB=rdArt().B[pb];for(let y=31;y<hh;y+=16)for(let x=0;x<W;x+=16)g.drawImage(AB.floor[((x*7+y*13)>>4)%9<7?0:1],x,y);for(let x=0;x<W;x+=16)g.drawImage(AB.wall,x,15)}
   /* the hole in the floor, with the deep breathing up out of it */
   g.save();g.globalAlpha=.25+.1*Math.sin(time*4);g.fillStyle='#58f0c0';g.beginPath();g.ellipse(hx,hy,24,8,0,0,7);g.fill();g.restore();
   g.fillStyle='#2a1a14';g.beginPath();g.ellipse(hx,hy,18,6,0,0,7);g.fill();g.fillStyle='#04060a';g.beginPath();g.ellipse(hx,hy+1,15,4,0,0,7);g.fill();
   for(let i=0;i<10;i++){const a=i/10*6.283;r('#6e4a2a',Math.round(hx+Math.cos(a)*19)-1,Math.round(hy+Math.sin(a)*6)-1,3,2)}
   /* rescued sprouts climb a root up out of the room */
   if(sc.bg==='drop'&&RUN.surfN){const rx=34;r('#6e4a2a',rx,15,2,gy-15);for(let y=20;y<gy;y+=9)r('#8a5e36',rx-2,y,6,1);
    (RUN.surfT||[]).forEach((ty,i)=>{const p=Math.max(0,Math.min(1,(tt-.3-i*.35)/1.8)),y=Math.round(gy-4-(gy-10)*p);if(p<1){g.save();g.translate(rx+1,y);g.scale(2,2);drawBud({x:ox,y:oy,type:ty,stage:2,z:0,a:time*8+i,mv:true,st:'follow',fx:1});g.restore()}});
    const left=(RUN.surfT||[]).filter((ty,i)=>tt-.3-i*.35<1.8).length;if(left)text(left+' GOING UP',rx+8,gy-40,1,'#a8f080','#181020')}
   /* the keeper walks to the hole and drops in */
   const wk=Math.min(1,tt/Math.max(.4,Math.min(1.4,go))),kx=Math.round((sc.bg==='drop'?W/2+60:W/2-70)+(hx-(sc.bg==='drop'?W/2+60:W/2-70))*wk),sink=Math.max(0,(tt-go)/.8);
   g.save();g.beginPath();g.rect(0,0,W,hy);g.clip();g.translate(0,Math.round(sink*sink*44));S.keeper(kp,kx,2,sc.bg==='drop'?-1:1);g.restore();
   if(sc.bg==='drop'){const a=Math.min(1,tt*3);g.save();g.globalAlpha=a;r('rgba(8,5,14,.8)',0,40,W,20);r('#a8f080',0,40,W,1);r('#a8f080',0,59,W,1);ctext('CHAMBER '+RUN.dropFrom+' CLEARED',45,1,'#a8f080',null);g.restore()}
   rdLight([{x:hx,y:hy,r:44,c:'#58f0c0'},{x:kx,y:gy-14,r:46,c:rdLanternC()}],sc.bg==='drop'?'rgba(10,4,16,.3)':'rgba(14,6,22,.3)')}
  else{/* falling down the shaft: roots stream past, the keeper's lantern the only light */
   r('#08060c',0,15,W,hh-15);for(let i=0;i<16;i++){const x=i<8?6+i*5:W-46+(i-8)*5,y=Math.round(((i*37+fall*260)%(hh+20))-10);r(i%3?'#2a1a14':'#3a2414',x,y,3,22);r('#4e3530',x+1,y+4,1,10)}
   for(let i=0;i<9;i++){const x=40+((i*53)%160),y=Math.round(((i*71+fall*420)%(hh))+10);r('rgba(255,243,176,.35)',x,y,1,8)}
   const ky=Math.round(Math.min(hh*.62,80+fall*70));S.base(ky+14).keeper(kp,W/2+Math.round(Math.sin(fall*9)*2),2,1);S.base(H-74);
   rdLight([{x:W/2,y:ky-6,r:50,c:rdLanternC()}],'rgba(4,2,8,.5)');rdDrawChamberCard(sc,28)}}
 else if(sc.bg==='burrow'){S.cave();const kp2=RD.char||'WILL';
  /* the burrow under the Hearth: tunnels, a hanging lamp, and sprouts digging with tiny shovels */
  for(const[ax,ay,rr]of[[60,hh-60,24],[150,hh-70,30],[210,hh-50,18]]){g.fillStyle='#0b0812';g.beginPath();g.arc(ax,ay,rr,Math.PI,0);g.fill();r('#0b0812',ax-rr,ay,rr*2,8)}
  r('#3a2c1c',W/2,0,1,26);r('#3a2c1c',W/2-4,26,9,9);r('#ffd94d',W/2-2,28,5,5);
  r('#c89860',26,0,1,gy-10);r('#c89860',36,0,1,gy-10);for(let y=4;y<gy-10;y+=7)r('#c89860',26,y,11,1);
  S.keeper(kp2,31,2,1);
  [[110,0],[140,3],[170,4],[198,2]].forEach(([x,t2],i)=>{S.bud(x,t2,2,i%2?3:0);const sw=Math.sin(time*8+i)>0;r('#98a0b0',x+(sw?10:6),gy-(sw?20:14),2,6);r('#7a4a28',x+(sw?7:3),gy-(sw?16:12),4,1);
   if(sw)for(let k=0;k<3;k++)r('#7a5a44',x+14+k*3,gy-6-((time*20+k*5+i*3)%10),2,2)});
  rdLight([{x:W/2,y:30,r:80,c:'#ffd27a'},{x:150,y:hh-60,r:50,c:'#a8f080'}],'rgba(14,6,22,.4)');}
 else if(sc.bg==='boss'){const bi=sc.boss,AB=rdArt().B[bi],rise=Math.min(1,tt/1.4),fy=Math.round(H*.36+(1-rise)*26),col=BOSSES[bi].c;
  g.save();if(tt<1.4)g.translate(Math.round(R(-1,1)),0);
  for(let ty=20;ty<H;ty+=16)for(let tx=0;tx<W;tx+=16)g.drawImage(AB.floor[((tx*7+ty*13)>>4)%9<7?0:1],tx,ty);
  for(let tx=0;tx<W;tx+=16)g.drawImage(AB.wall,tx,15);
  /* silhouette first, then the reveal with a white flash */
  const sp=bi<2?RDFOE[bi?'king':'mother'].ol:SP.pd,lit=bi<2&&tt>1.4;g.save();g.globalAlpha=Math.min(1,.25+rise);g.translate(W/2-sp.width,fy-sp.height*2);g.scale(2,2);
  g.drawImage(lit?sp:rdShadowOf(sp),0,0);g.restore();
  for(let i=0;i<14;i++){const p=(tt*.9+i*.071)%1;r('rgba(200,180,160,'+(.5*(1-p)).toFixed(2)+')',Math.round(W/2+((i*37)%90)-45),Math.round(fy-p*40),2,2)}
  S.base(H-50).keeper(kp,W/2,2,1);S.base(H-74);
  rdLight([{x:W/2,y:H-76,r:64,c:rdLanternC()},{x:W/2,y:fy-20,r:30+rise*24,a:rise,c:col}],AB.dark);
  if(tt>1.4&&tt<1.6){g.save();g.globalAlpha=(1.6-tt)/.2*.7;r('#ffffff',0,0,W,H);g.restore()}
  g.restore();
  if(tt>1.1){const a=Math.min(1,(tt-1.1)*3);g.save();g.globalAlpha=a;r('rgba(8,5,14,.8)',0,30,W,24);r(col,0,30,W,1);r(col,0,53,W,1);ctext(BOSSES[bi].n,34,3,'#ffffff','#181020');g.restore()}}
 if(sc.bg!=='boss')r('#000000',0,hh,W,H-hh);
 r('#000000',0,0,W,15);r('#000000',0,H-15,W,15);
 if(LN.length){r('#f4ead2',4,H-50,W-8,32);r('#281c30',4,H-50,W-8,1);
 if(ln[0]){const pc=RDCPLATE[ln[0]]||'#181020';r('#181020',8,H-58,tw(ln[0],2)+10,14);r(pc,9,H-57,tw(ln[0],2)+8,12);text(ln[0],13,H-55,2,'#ffffff',null)}
 wrapPx(ln[1],222,1).slice(0,2).forEach((l,i)=>text(l,10,H-41+i*10,1,'#281c30',null))}
 text('START: SKIP',W-tw('START: SKIP',1)-6,H-12,1,'#8d84a8',null);}
/* ---------------- sprouts: the shared currency ---------------- */
const SPFX=['EMBER buds lob fire at your foes.','PEB buds block a hit meant for you.','DEW buds slowly mend you.','ZIP buds: +speed, and pickups drift to you.','LEAF buds: foes drop more petals.','LUCKY buds: +crit. The deep approves.'];
const TRADES=[{g:[0,3],t:[3,1]},{g:[1,3],t:[2,1]},{g:[2,3],t:[4,1]},{g:[3,3],t:[5,1]},{g:[4,3],t:[5,1]}];
const SELLS=[{ty:5,dew:12},{ty:4,dew:6},{ty:3,dew:5}];
const PODW=[[0,1,4,0,1,4],[2,3,1,2,3,0],[0,3,5,4,0,3]];
const budCount=ty=>(RUN&&RUN.buds)?RUN.buds.filter(b=>b.type===ty).length:0;
const bankTotal=()=>Object.values(RD.bank).reduce((a,b)=>a+b,0);
/* swarm bites: small on purpose (a full string is a nudge, not a weapon). ZIP bites fast, EMBER burns, LEAF knocks petals loose */
const RDBITE={0:{d:1.1,cd:.7},2:{d:1,cd:.8},3:{d:.6,cd:.36},4:{d:1,cd:.7},5:{d:1,cd:.66}};
function rdBudPick(b){let best=null,bs=1e9;for(const e of RUN.enemies){if(e.hp<=0||Math.hypot(e.x-P3.x,e.y-P3.y)>120)continue;
 const crowd=RUN.buds.filter(o=>o!==b&&(o.latch===e||o.tgt===e)).length,sc=Math.hypot(e.x-b.x,e.y-b.y)+crowd*28;if(sc<bs){bs=sc;best=e}}return best}
/* foes that blink, charge or leap shake their buds off */
function rdShake(e){if(!RUN||!RUN.buds)return;for(const b of RUN.buds)if(b.latch===e&&!b.fly){b.latch=null;b.leap=null;b.tgt=null;b.recall=.7;b.x+=R(-10,10);b.y+=R(4,10)}}
/* lifetime count of sprouts found in the deep (milestones pay Moondew on the run's end screen) */
function rdFound(){RD.stats.sproutsFound=(RD.stats.sproutsFound||0)+1;RUN.found=(RUN.found||0)+1}
function budMul(){return(RUN.char==='ERIN'?1.5:RUN.char==='KING'?2:1)*(RUN.bloomT>0?3:1)}
function budMax(){return RUN.char==='KING'?8:6}
function bankBuds(){if(!RUN||!RUN.buds)return 0;let n=0;for(const t of RUN.waiting||[]){RD.bank[t]=(RD.bank[t]||0)+1;n++}RUN.waiting=[];for(const b of RUN.buds){if(b.temp)continue;RD.bank[b.type]=(RD.bank[b.type]||0)+1;n++}RD.stats.budsBanked=(RD.stats.budsBanked||0)+n;RUN.buds=[];return n}
let sprPage=0;
function sproutsUpdate(){const rows=sprPage===0?6:TRADES.length+SELLS.length;
 if(pressed('right')||pressed('left')){sprPage=sprPage?0:1;uiSel=0;snd(520,.05);return}
 uiSel=nav(uiSel,rows);
 if(pressed('a')){if(sprPage===0){const ty=uiSel;
   const inP=RD.party.filter(x=>x===ty).length;
   if(inP>0&&(RD.party.length<=inP||inP>=(RD.bank[ty]||0))){RD.party.splice(RD.party.lastIndexOf(ty),1);snd(440,.05)}
   else if(RD.party.length<3&&(RD.bank[ty]||0)>inP){RD.party.push(ty);snd(784,.06)}
   else snd(160,.08,'sawtooth',.05);rdSave()}
  else if(uiSel<TRADES.length){const tr=TRADES[uiSel];
   if((RD.bank[tr.g[0]]||0)>=tr.g[1]){RD.bank[tr.g[0]]-=tr.g[1];RD.bank[tr.t[0]]=(RD.bank[tr.t[0]]||0)+tr.t[1];snd(784,.08);later(()=>snd(1175,.15),90)}
   else snd(160,.08,'sawtooth',.05);rdSave()}
  else{const s=SELLS[uiSel-TRADES.length];
   if((RD.bank[s.ty]||0)>=1){RD.bank[s.ty]--;RD.dew+=s.dew;snd(980,.07,1470)}
   else snd(160,.08,'sawtooth',.05);rdSave()}}
 if(pressed('b')||pressed('start')){state='g3hub';rdSave()}}
function drawSprouts(){const M=RD;
 if(sprPage===0){screenShell('SPROUT LEDGER','◀ ▶ EXCHANGE · BANK: '+bankTotal());
  for(let ty=0;ty<6;ty++){const yy=44+ty*17,on=ty===uiSel,T=TYPES[ty];
   if(on){r('#f8e060',6,yy-2,W-12,15);r('#281c30',7,yy-1,W-14,13)}
   drawBud({x:17+ox,y:yy+9+oy,type:ty,stage:2,z:0,a:ty*1.7,mv:false,st:'idle',fx:1});
   text(T.n+'  ×'+(M.bank[ty]||0),30,yy,1,on?'#ffffff':'#c8c0d8',on?null:'#181020');
   const ip=M.party.filter(x=>x===ty).length;rtext(ip?'DIVING ×'+ip:'—',W-10,yy,1,on?'#ffd94d':'#8d84a8',on?null:'#181020');}
  wrapPx(SPFX[uiSel]+' A: take buddies into the deep (max 3). They are at risk down there.',222,1).slice(0,3).forEach((l,i)=>ctext(l,H-55+i*11,1,'#a89ec2',null));
  ctext('A: ADD / REMOVE    B: BACK',H-11,1,'#8d84a8',null);return}
 screenShell('SPROUT EXCHANGE','◀ ▶ LEDGER · SPROUTS ARE MONEY HERE');
 const rows=TRADES.map(tr=>({a:'3 '+TYPES[tr.g[0]].n+' → 1 '+TYPES[tr.t[0]].n,b:(M.bank[tr.g[0]]||0)>=3?'READY':'NEED 3'}))
  .concat(SELLS.map(s=>({a:'SELL 1 '+TYPES[s.ty].n,b:'+'+s.dew+' MOONDEW'})));
 rowsDraw2(rows,uiSel,uiSel<TRADES.length?'Trading up the chain: EMBER→ZIP→LUCKY, PEB→DEW→LEAF.':'Moondew buys upgrades at the Digs. Sprouts buy everything else.');
 ctext('A: TRADE / SELL    B: BACK',H-11,1,'#8d84a8',null);}

/* ---------------- combat ---------------- */
function burst(x,y,c,n=6,sp=36){for(let i=0;i<n;i++)RUN.parts.push({x,y,vx:R(-sp,sp),vy:R(-sp,sp),life:R(.25,.55),c});}
function ftext(x,y,txt,c){RUN.texts.push({x,y,txt,c:c||'#fff',t:.8});}
/* a sprout pod is never left inside a rock or stump, or outside the room: it's nudged clear so you can walk over it */
function rdPodAt(type,x,y){const p={type,x,y};for(const o of RUN.obst||[]){if(p.x>=o.x&&p.x<=o.x+o.w&&p.y>=o.y&&p.y<=o.y+o.h){const l=p.x-o.x,r2=o.x+o.w-p.x,t=p.y-o.y,b=o.y+o.h-p.y,m=Math.min(l,r2,t,b);
 if(m===l)p.x=o.x-1;else if(m===r2)p.x=o.x+o.w+1;else if(m===t)p.y=o.y-1;else p.y=o.y+o.h+1}}collide(p,9);return p}
function collide(e,rr){e.x=Math.max(RDA.side+rr,Math.min(W-RDA.side-rr,e.x));e.y=Math.max(RDA.top+rr,Math.min(H-RDA.bot-rr,e.y));
 for(const o of RUN.obst){const nx=Math.max(o.x,Math.min(e.x,o.x+o.w)),ny=Math.max(o.y,Math.min(e.y,o.y+o.h));
  const dx=e.x-nx,dy=e.y-ny,d=Math.hypot(dx,dy);if(d<rr&&d>0){e.x=nx+dx/d*rr;e.y=ny+dy/d*rr}}}
/* attacks lock on: aim at the nearest foe, preferring ones in front of you; with none in range, where you face */
function rdAim(range){let[ax,ay]=aimVec(),best=null,bs=1e9;for(const e of RUN.enemies){if(e.hp<=0)continue;const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy);if(d>range)continue;
  const dot=(dx*ax+dy*ay)/(d||1),sc=d*(dot>.3?1:dot>-.2?1.6:2.6);if(sc<bs){bs=sc;best=e}}
 if(best){const dx=best.x-P3.x,dy=best.y-P3.y,d=Math.hypot(dx,dy)||1;ax=dx/d;ay=dy/d;P3.ax=ax;P3.ay=ay}return[ax,ay]}
function aimVec(){let ax=P3.ax||0,ay=P3.ay===undefined?1:P3.ay;if(keys.right||keys.left||keys.up||keys.down){
 const mx=keys.right-keys.left,my=keys.down-keys.up,l=Math.hypot(mx,my)||1;ax=mx/l;ay=my/l;P3.ax=ax;P3.ay=ay}return[ax,ay];}
function hitEnemy(e,dmg,src,kx,ky){if(e.hp<=0)return;const s=rdStats();let crit=Math.random()<s.crit;
 if(e.kind==='crab'&&e.state===1&&src!=='burn')dmg*=.35;
 if(src==='atk'&&e.kind==='boss'&&RUN.boons.pass.find(p=>p.id==='heavy'))dmg*=1+rdBoonVal(RUN.boons.pass.find(p=>p.id==='heavy'))/100;
 if(hasDuo('mudslide')&&e.chill>0)dmg*=1.3;
 dmg*=crit?2:1;e.hp-=dmg;e.flash=.12;
 if(src==='atk'||src==='sp')RUN.hs=Math.max(RUN.hs||0,crit?.06:.035);
 /* the super meter fills from your own hits (not supers, burns, buds or reflects) */
 if(src!=='su'&&src!=='burn'&&src!=='bud'&&src!=='reflect'&&(RUN.sup||0)<100){RUN.sup=Math.min(100,(RUN.sup||0)+dmg*.5);
  if(RUN.sup>=100){ftext(P3.x,P3.y-22,'SUPER READY - B','#ffd94d');snd(1568,.08,2093)}}
 if(kx){e.x+=kx;e.y+=ky;collide(e,e.r)}
 if(src==='bud'){burst(e.x,e.y-4,'#e8e4f5',2,16);if(Math.random()<.3)snd(820+Math.random()*120,.02,0,'square',.01)}
 else{ftext(e.x+R(-4,4),e.y-e.r-4,Math.round(dmg)+(crit?'!':''),crit?'#ffd94d':src==='cast'?'#b0e0f8':'#ffffff');
 burst(e.x,e.y,FOES[e.kind]?FOES[e.kind].c:'#fff',crit?7:4,30);snd(crit?900:520+Math.random()*80,.03)}
 if(src==='atk'&&RUN.boons.atk){const g=RUN.boons.atk.god;
  if(g==='EMBER'){e.burn=3;e.burnDps=Math.max(e.burnDps,dmg*.22*(RUN.boons.pass.find(p=>p.id==='firewall')?1.6:1))}
  if(g==='DEW')e.chill=Math.max(e.chill,2.5);
  if(g==='ZIP'&&Math.random()<.28){let best=null,bd=70*70;for(const o of RUN.enemies)if(o!==e&&o.hp>0){const d=(o.x-e.x)**2+(o.y-e.y)**2;if(d<bd){bd=d;best=o}}
   if(best){best.hp-=dmg*.45;best.flash=.12;ftext(best.x,best.y-10,Math.round(dmg*.45),'#fff8a0');burst(best.x,best.y,'#f0d020',4,26)}}
  if(g==='LEAF'&&Math.random()<.2)rdHeal(1);
  if(g==='PEB'){e.x+= (kx||0)*1.6;e.y+=(ky||0)*1.6;collide(e,e.r)}}
 if(e.hp<=0)killEnemy(e);}
function killEnemy(e){e.hp=0;RD.stats.kills++;ks(RUN.char).kills++;RUN.kills++;burst(e.x,e.y,'#e8e4f5',10,44);snd(240,.12,90,'triangle',.06);
 if(e.kind==='boss'){for(const o of RUN.enemies)if(o!==e)o.hp=Math.min(o.hp,0),o.dead=true;RUN.enemies=RUN.enemies.filter(o=>o===e||!o.dead);RUN.enemies.splice(RUN.enemies.indexOf(e),1);
  RUN.pods.push(rdPodAt(PODW[RUN.biome][(Math.random()*6)|0],e.x-6,e.y),rdPodAt(PODW[RUN.biome][(Math.random()*6)|0],e.x+6,e.y));RUN.podDropped=true;ftext(e.x,e.y-14,'SPROUT PODS!','#a8f080');return}
 RUN.enemies.splice(RUN.enemies.indexOf(e),1);
 const fortune=RUN.boons.pass.find(p=>p.id==='fortune')?1+rdBoonVal(RUN.boons.pass.find(p=>p.id==='fortune'))/100:1;
 const np=Math.round((2+Math.random()*3)*(e.elite?4:1)*fortune)+Math.min(3,budCount(4));
 for(let i=0;i<np;i++)RUN.pickups.push({kind:'petal',val:1,x:e.x+R(-5,5),y:e.y+R(-5,5),vx:R(-24,24),vy:R(-24,24)});
 if(Math.random()<.25*(hasKeep('jar')?1.35:1))RUN.pickups.push({kind:'dew',val:e.elite?6:2,x:e.x,y:e.y,vx:R(-16,16),vy:R(-16,16)});
 if(Math.random()<.06)RUN.pickups.push({kind:'heart',val:10,x:e.x,y:e.y,vx:0,vy:0});
 if(Math.random()<.02)RUN.pickups.push({kind:'honey',val:1,x:e.x,y:e.y,vx:0,vy:0});
 if(hasDuo('clover')&&Math.random()<.16)RUN.pickups.push({kind:'heart',val:8,x:e.x+R(-8,8),y:e.y+R(-6,6),vx:0,vy:0});
 if(e.elite||Math.random()<.25){RUN.pods.push(rdPodAt(PODW[RUN.biome][(Math.random()*6)|0],e.x,e.y));RUN.podDropped=true;ftext(e.x,e.y-12,'SPROUT POD!','#a8f080');snd(1046,.07,1568)}}
function damagePlayer(n){if(!RUN||RUN.inv>0||RUN.dashT>0)return;const s=rdStats();
 const peb=RUN.buds&&RUN.buds.find(b=>b.type===1&&b.cd<=0);
 if(peb){peb.cd=15;RUN.inv=.55;ftext(P3.x,P3.y-16,'PEB BLOCKED!','#dce2ea');burst(P3.x,P3.y,'#dce2ea',6,30);snd(520,.08,760);return}
 let d=n*(1-s.armor)*(RUN.armT>0?.5:1);
 RUN.hp-=d;RUN.hurtOnce=1;RUN.inv=.55;RUN.shake=Math.min(5,2.5);RUN.hs=.08;RUN.hurtT=.28;RUN.sup=Math.min(100,(RUN.sup||0)+5);burst(P3.x,P3.y,'#ff7a6b',7,36);snd(170,.15,70,'sawtooth',.07);
 if(RUN.buds&&RUN.buds.length&&Math.random()<.3){const lb=RUN.buds.pop();ftext(P3.x,P3.y-20,TYPES[lb.type].n+' SCATTERED!','#f8a0c8');snd(340,.1,180)}
 if(hasKeep('charm')){for(const e of RUN.enemies)if(Math.hypot(e.x-P3.x,e.y-P3.y)<e.r+9)hitEnemy(e,9,'reflect')}
 if(RUN.hp<=0){if(RUN.revives>0){RUN.revives--;RUN.hp=s.maxHp*.5;RUN.inv=2;say2('DEATH DEFIED!',3);burst(P3.x,P3.y,'#ffd94d',16,50);snd(784,.2);later(()=>snd(1175,.4),140)}
  else if(hasDuo('phoenix')&&!RUN.phoenixUsed){RUN.phoenixUsed=true;RUN.hp=s.maxHp*.4;RUN.inv=2;say2('PHOENIX BLOOM!',3);burst(P3.x,P3.y,'#f07830',16,50)}
  else if(hasKeep('collar')&&!RUN.collarUsed){RUN.collarUsed=true;RUN.hp=s.maxHp*.2;RUN.inv=2;say2('LOUIE HAULS YOU BACK!',3);burst(P3.x,P3.y,'#f8a0c8',14,46)}
  else rdDie();}}
function doAttack(){const w=WEAPONS[RD.weapon],s=rdStats(),[ax,ay]=rdAim(WEAPONS[RD.weapon].proj?170:WEAPONS[RD.weapon].range+40),isLou=RUN.char==='LOUIE';RUN.atkCd=w.rate*(isLou?.72:1);
 noise(.045,.14,2400);RUN.combo=(RUN.combo+1)%(w.dmg.length);
 const base=w.dmg[RUN.combo]*s.dmgMul*s.atkMul*(isLou?.85:1);
 rdAtkStart(isLou?'bite':w.proj?'bow':RD.weapon==='maul'?'maul':'blade',Math.atan2(ay,ax),RUN.combo);
 if(w.proj){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*w.proj,vy:ay*w.proj,dmg:base,kind:'arrow',r:2,life:1.1});snd(740,.05,1200);return}
 let hit=false;for(const e of RUN.enemies.slice()){const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy);
  if(d<(isLou?Math.max(18,w.range-6):w.range)+e.r){const dot=(dx/(d||1))*ax+(dy/(d||1))*ay;if(dot>Math.cos(w.arc/2)||d<12){hitEnemy(e,base,'atk',(dx/(d||1))*(w.kb||40)*.06,(dy/(d||1))*(w.kb||40)*.06);hit=true}}}
 rdHitInts(P3.x+ax*w.range*.5,P3.y+ay*w.range*.5,w.range*.6+4);
 if(hit)snd(300,.05,180);
 if(hit&&w.dmg.length>1&&RUN.combo===w.dmg.length-1)ftext(P3.x,P3.y-24,RDMOVES[RUN.char||'WILL'].fin+'!','#fff3b0');
 RUN.slashT=.12;RUN.slashAng=Math.atan2(ay,ax);
 if(RD.weapon==='maul'&&!isLou)later(()=>{if(!RUN)return;RUN.fx.push({k:'whistle',x:P3.x+ax*16,y:P3.y+ay*16-2,t:.25,max:.25,dust:1});RUN.shake=Math.max(RUN.shake,2.5);burst(P3.x+ax*16,P3.y+ay*16,'#c8a878',8,40)},110);}
function doDash(){const s=rdStats();if(RUN.dashCharges<=0||RUN.dashT>0)return;const[ax,ay]=aimVec();
 RUN.dashCharges--;RUN.dashT=.15;RUN.dashRegen=.95;RUN.inv=Math.max(RUN.inv,.24);
 P3.vx=ax*310;P3.vy=ay*310;noise(.1,.16,1600);burst(P3.x,P3.y,'#a8d8ff',5,20);
 const b=RUN.boons.dash;if(!b)return;const g=b.god,v=rdBoonVal(b);
 if(g==='EMBER')RUN.zones.push({x:P3.x,y:P3.y,t:2.2,r:13,dps:v*1.6,friendly:true});
 if(g==='DEW'){for(const e of RUN.enemies)if(Math.hypot(e.x-P3.x,e.y-P3.y)<34)e.chill=Math.max(e.chill,2)}
 if(g==='ZIP'){let best=null,bd=95*95;for(const e of RUN.enemies){const d=(e.x-P3.x)**2+(e.y-P3.y)**2;if(d<bd){bd=d;best=e}}
  if(best){best.hp-=v*1.4;best.flash=.12;ftext(best.x,best.y-10,Math.round(v*1.4),'#fff8a0');burst(best.x,best.y,'#f0d020',6,30);if(best.hp<=0)killEnemy(best)}}
 if(g==='PEB')RUN.armT=1.2;
 if(g==='LEAF')rdHeal(2+v*.12);
 if(g==='LUCKY'&&Math.random()<.35){RUN.dashCharges++;RUN.dashRegen=0}}
function doCast(){const s=rdStats();if(RUN.castAmmo<=0||RUN.castCd>0)return;const[ax,ay]=rdAim(160);
 RUN.castAmmo--;RUN.castCd=.35;RUN.castRegenT=3.2/s.castRegen;snd(880,.07,1320,'triangle',.06);
 const god=RUN.boons.cast?RUN.boons.cast.god:'',mul=s.castMul;
 /* no cast boon yet: a plain bolt of lantern light (the keepers' signature moves live on X, Y and the super) */
 if(!god){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*260,vy:ay*260,dmg:15*mul,kind:'bolt',r:4,life:.8});burst(P3.x+ax*6,P3.y+ay*6,'#ffd94d',5,24);snd(1200,.09,2400,'square',.05);
  return}
 const nearest=(rad)=>{let best=null,bd=rad*rad;for(const e of RUN.enemies){const d=(e.x-P3.x)**2+(e.y-P3.y)**2;if(d<bd){bd=d;best=e}}return best};
 if(god==='ZIP'){const sorted=RUN.enemies.slice().sort((a,b)=>((a.x-P3.x)**2+(a.y-P3.y)**2)-((b.x-P3.x)**2+(b.y-P3.y)**2)).slice(0,3);
  for(const e of sorted){e.hp-=26*mul;e.flash=.15;ftext(e.x,e.y-12,Math.round(26*mul),'#fff8a0');burst(e.x,e.y,'#f0d020',7,34);if(e.hp<=0)killEnemy(e)}if(!sorted.length)snd(200,.08);return}
 if(god==='PEB'){const t=nearest(140);const x=t?t.x:P3.x+ax*62,y=t?t.y:P3.y+ay*62;
  RUN.hazards.push({x,y,t:.45,r:27,dmg:30*mul,from:'player'});return}
 if(god==='LEAF'){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*215,vy:ay*215,dmg:16*mul,kind:'vine',r:3,life:1});return}
 if(god==='DEW'){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*185,vy:ay*185,dmg:15*mul,kind:'wave',r:8,life:.9,pierce:99});return}
 if(god==='EMBER'){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*225,vy:ay*225,dmg:20*mul,kind:'fire',r:4,life:1});return}
 if(god==='LUCKY'){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*235,vy:ay*235,dmg:(6+Math.random()*58)*mul,kind:'wild',r:3,life:1});return}
 RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*230,vy:ay*230,dmg:18*mul,kind:'thorn',r:3,life:1});}
function projHit(p,e){const s=rdStats();
 if(p.kind==='fire'){for(const o of RUN.enemies.slice())if(Math.hypot(o.x-e.x,o.y-e.y)<32){o.burn=3;o.burnDps=Math.max(o.burnDps,p.dmg*.3);hitEnemy(o,o===e?p.dmg:p.dmg*.6,'cast')}burst(e.x,e.y,'#f07830',10,40);return true}
 hitEnemy(e,p.dmg,p.src||'cast');
 if(p.kind==='cloud')e.root=Math.max(e.root,e.kind==='boss'?.15:.5);
 if(p.kind==='stampede'&&e.kind!=='boss'&&e.hp>0){e.x+=p.vx/190*7;e.y+=p.vy/190*7;collide(e,e.r)}
 if(p.kind==='vine'){e.root=Math.max(e.root,1.6);RUN.pickups.push({kind:'heart',val:6,x:e.x+R(-6,6),y:e.y+R(-4,4),vx:0,vy:0})}
 if(p.kind==='wave'){e.chill=Math.max(e.chill,2.5);const d=Math.hypot(e.x-P3.x,e.y-P3.y)||1;e.x+=(e.x-P3.x)/d*14;e.y+=(e.y-P3.y)/d*14;collide(e,e.r)}
 if(p.kind==='towel'){e.root=Math.max(e.root,.35);const d=Math.hypot(e.x-P3.x,e.y-P3.y)||1;e.x+=(e.x-P3.x)/d*20;e.y+=(e.y-P3.y)/d*20;collide(e,e.r)}
 if(p.kind==='jet')e.chill=Math.max(e.chill,1.5);
 return (p.pierce||p.kind==='laser'||p.kind==='jet')?false:p.kind!=='wave';}

/* ---------------- things to do in a chamber (Sprouts-style) ----------------
   pot: smash it (attacks, shots, rushes) for petals. sprout: a buried sprout, A to pluck it into your string.
   berry: a berry bush, A to eat (heals). chest: a root chest, A to open. boom: a boom bulb, hit it and stand back. */
const RDINT={
 potE:SPRG(['...dddd','..dhhhhd','...dhhd','..hhhhhh','.hHhhhhhh','hHhhhhhhhh','hHhhhhhhhh','hhhhhhhhhd','.hhhhhhhd','..dddddd'],{d:'#6a3a20',h:'#c87848',H:'#f0a878'}),
 potS:SPRG(['...dddd','..dhhhhd','...dhhd','..hhhhhh','.hHhhhhhh','hHhhhhhhhh','hHhhhhhhhh','hhhhhhhhhd','.hhhhhhhd','..dddddd'],{d:'#2a4a5a',h:'#5e8094',H:'#a8d8f0'}),
 potA:SPRG(['...dddd','..dhhhhd','...dhhd','..hhhhhh','.hHhhhhhh','hHhhhhhhhh','hHhhhehhhh','hhhheehhhd','.hhhhhhhd','..dddddd'],{d:'#2e1e26',h:'#6e4c52',H:'#a07078',e:'#f8a040'}),
 berry:SPRG(['...gggg','.gggGggg','gGgrgggrg','ggrRgggggg','gggggrgRgg','.gggrRgggg','..ggggggg','...bbbb'],{g:'#3c9848',G:'#60c070',r:'#e03040',R:'#ff8090',b:'#5a3a24'}),
 bush:SPRG(['...gggg','.gggGggg','gGgggggggg','gggggggggg','gggggggggg','.ggggggggg','..ggggggg','...bbbb'],{g:'#3c9848',G:'#60c070',b:'#5a3a24'}),
 chest:SPRG(['.kkkkkkkkkk','kwwwwwwwwwwk','kwyywwwwyywk','kkkkkkkkkkkk','kbbbbyybbbbk','kbbbbyybbbbk','kbbbbbbbbbbk','kkkkkkkkkkkk'],{k:'#3a2414',w:'#8a5a30',y:'#f8d030',b:'#6a4428'}),
 chestOpen:SPRG(['kwwwwwwwwwwk','kwyywwwwyywk','kkkkkkkkkkkk','k..........k','kyyyyyyyyyyk','kbbbbbbbbbbk','kbbbbbbbbbbk','kkkkkkkkkkkk'],{k:'#3a2414',w:'#8a5a30',y:'#f8d030',b:'#6a4428'}),
 boom:SPRG(['....ss','...sss','..pppp','.pPPppp','.pPwpppp','.ppppppp','..ppppp','...ppp','....l','...lll'],{s:'#3c9848',p:'#e04878',P:'#f878a8',w:'#ffffff',l:'#3c9848'})};
const RDUSE={sprout:'PLUCK',berry:'EAT',chest:'OPEN'};
function rdInts(ch,biome,used){RUN.ints=[];const boss=ch%4===0,rows=Math.floor((H-RDA.top-RDA.bot)/16),free=[];
 for(let gx=0;gx<14;gx++)for(let gy=1;gy<rows-1;gy++){const x=RDA.side+gx*16,y=RDA.top+gy*16;
  if(used.has(gx+','+gy)||Math.abs(x+8-W/2)<26&&y>H-64)continue;free.push([x+8,y+12])}
 for(let i=free.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[free[i],free[j]]=[free[j],free[i]]}
 const add=(k,o)=>{const c=free.pop();if(c)RUN.ints.push(Object.assign({k,x:c[0],y:c[1],done:false,t:Math.random()*6},o||{}))};
 const nPot=boss?2:2+((Math.random()*3)|0);for(let i=0;i<nPot;i++)add('pot');
 if(boss)return;
 if(ch===1||Math.random()<.5)add('sprout',{type:PODW[biome][(Math.random()*6)|0]});
 if(Math.random()<.35)add('berry');
 if(biome!==1&&Math.random()<.45){add('boom');if(Math.random()<.4)add('boom')}
 if(ch===3||ch===7||ch===10||Math.random()<.2)add('chest');}
function rdNearInt(){let best=null,bd=15;for(const it of RUN.ints||[]){if(it.done||!RDUSE[it.k])continue;const d=Math.hypot(it.x-P3.x,it.y-P3.y);if(d<bd){bd=d;best=it}}return best}
function rdUseInt(it){it.done=true;
 if(it.k==='sprout'){if(RUN.buds.filter(b=>!b.temp).length<budMax()){RUN.buds.push({type:it.type,x:it.x,y:it.y-8,a:Math.random()*6,cd:0,z:0});ftext(it.x,it.y-18,'PLUCKED! '+TYPES[it.type].n,'#a8f080');rdFound()}
  else rdWait(it.type,it.x,it.y-4);burst(it.x,it.y-4,'#8a5a3a',8,30);snd(660,.06,990);later(()=>snd(990,.08,1320),70)}
 else if(it.k==='berry'){rdHeal(10);ftext(it.x,it.y-18,'+10','#a8f080');burst(it.x,it.y-6,'#e03040',6,26);snd(880,.06,1175)}
 else if(it.k==='chest'){const roll=Math.random();snd(523,.08,784);later(()=>snd(784,.12,1046),90);burst(it.x,it.y-6,'#f8d030',12,40);
  if(roll<.1){RUN.keys++;ftext(it.x,it.y-20,'AN OLD KEY!','#f8d030')}
  else if(roll<.42){for(let i=0;i<3;i++)RUN.pickups.push({kind:'dew',val:3,x:it.x,y:it.y-4,vx:R(-30,30),vy:R(-40,-10)})}
  else for(let i=0;i<14;i++)RUN.pickups.push({kind:'petal',val:2,x:it.x,y:it.y-4,vx:R(-40,40),vy:R(-50,-10)})}}
function rdBreak(it){if(it.done)return;
 if(it.k==='boom'){if(!(it.fuse>0)){it.fuse=.6;snd(1400,.05,0,'square',.03)}return}
 if(it.k!=='pot')return;it.done=true;const c=RUN.biome===1?'#a8d8f0':RUN.biome===2?'#a07078':'#c87848';burst(it.x,it.y-5,c,9,40);snd(260,.08,140,'square',.04);
 const n=3+((Math.random()*4)|0);for(let i=0;i<n;i++)RUN.pickups.push({kind:'petal',val:1,x:it.x,y:it.y-4,vx:R(-30,30),vy:R(-30,10)});
 if(Math.random()<.12)RUN.pickups.push({kind:'heart',val:6,x:it.x,y:it.y-4,vx:0,vy:0});else if(Math.random()<.08)RUN.pickups.push({kind:'dew',val:2,x:it.x,y:it.y-4,vx:0,vy:0})}
/* things in reach of a hit: a circle (attacks, rushes) or a point (shots) */
function rdHitInts(x,y,rad){for(const it of RUN.ints||[])if(!it.done&&(it.k==='pot'||it.k==='boom')&&Math.hypot(it.x-x,it.y-6-y)<rad)rdBreak(it)}
function rdIntsUpdate(dt){for(const it of RUN.ints||[]){it.t+=dt;
 if(it.k==='boom'&&it.fuse>0){it.fuse-=dt;if(it.fuse<=0){it.done=true;it.fuse=0;RUN.fx.push({k:'flash',x:it.x,y:it.y-6,r:34,t:.3,max:.3});burst(it.x,it.y-6,'#f878a8',16,60);RUN.shake=4;snd(110,.3,50,'sawtooth',.09);noise(.25,.3,600,'lowpass');
  for(const e of RUN.enemies.slice())if(e.hp>0&&Math.hypot(e.x-it.x,e.y-it.y)<36+e.r)hitEnemy(e,26*rdStats().dmgMul,'cast',(e.x-it.x)*.2,(e.y-it.y)*.2);
  if(RUN&&Math.hypot(P3.x-it.x,P3.y-it.y)<24){RUN.lastHit='boom';damagePlayer(6)}
  if(RUN)for(const o of RUN.ints)if(o!==it&&o.k==='boom'&&!o.done&&!(o.fuse>0)&&Math.hypot(o.x-it.x,o.y-it.y)<40)o.fuse=.18}}}}
function rdDrawInts(){const pots=['potE','potS','potA'];for(const it of RUN.ints||[]){const x=Math.round(it.x),y=Math.round(it.y);
 if(it.k==='pot'){if(it.done)continue;const sp=RDINT[pots[RUN.biome]];r('rgba(0,0,0,.28)',x-5,y,10,2);g.drawImage(sp.ol,x-(sp.ow>>1),y-sp.oh+1)}
 else if(it.k==='sprout'){if(it.done){r('#3a2414',x-4,y-1,8,2);continue}r('#4a3020',x-6,y-2,12,4);r('#6a4a30',x-5,y-3,10,2);
  g.save();g.translate(x+Math.round(Math.sin(it.t*5)*(Math.sin(it.t*1.3)>.6?1:0)),y+3);drawSprout({x:ox,y:oy,type:it.type,age:.2});g.restore();
  if(((it.t*2)|0)%3===0)r('#ffffff',x+4,y-11,1,1)}
 else if(it.k==='berry'||it.k==='chest'){const sp=it.k==='berry'?(it.done?RDINT.bush:RDINT.berry):(it.done?RDINT.chestOpen:RDINT.chest);r('rgba(0,0,0,.28)',x-6,y,12,2);g.drawImage(sp.ol,x-(sp.ow>>1),y-sp.oh+1)}
 else if(it.k==='boom'){if(it.done){r('#3c9848',x-1,y-3,2,3);continue}const sp=RDINT.boom,fl=it.fuse>0&&((it.t*16)|0)%2;r('rgba(0,0,0,.28)',x-4,y,8,2);
  g.drawImage(fl?sp.hol:sp.ol,x-(sp.ow>>1),y-sp.oh+1+(it.fuse>0?Math.round(R(-1,1)):0))}}
 /* the prompt for the one you're next to (only when no foe is close) */
 const it=rdNearInt();if(it&&!RUN.enemies.some(e=>Math.hypot(e.x-P3.x,e.y-P3.y)<34)){const s2='A: '+RDUSE[it.k];text(s2,Math.round(it.x-tw(s2,1)/2),Math.round(it.y)-26,1,'#fff3b0','#181020')}}

/* ---------------- the basic attack, animated ----------------
   The keeper lunges into the swing and the weapon itself sweeps through the arc with a smear behind it.
   Petal Blade: 3-hit combo, the third hit spins. Root Maul: a slow heavy slam with a dust ring. Thornbow: draw and loose.
   Louie bites (jaws snap shut in front of him). */
const RDWPN={
 blade:SPRG(['...g','...g.wwwwwwwwp','hhhgwbbbbbbbbPp','...g.wwwwwwwwp','...g'],{h:'#7a4a28',g:'#f8d030',w:'#ffffff',b:'#c8d0dc',p:'#f8a0c8',P:'#f85888'}),
 maul:SPRG(['............dddddd','............dHHhhd','llllllllllllldHhhhd','llllllllllllldhhhhd','............dhhhhd','............dddddd'],{l:'#6e4a2a',d:'#3a2414',H:'#c89860',h:'#8a5e36'})};
function rdAtkStart(kind,ang,combo){RUN.atkA={t:0,max:kind==='maul'?.3:kind==='bow'?.18:kind==='bite'?.16:combo===2?.24:.17,kind,ang,combo,dir:combo%2?-1:1};}
function rdAtkLunge(){const A=RUN.atkA;if(!A)return[0,0];const k=A.t/A.max,m=(A.kind==='maul'?(k<.35?-1.5:4):A.kind==='bow'?-1:3)*Math.sin(Math.PI*Math.min(1,k));return[Math.cos(A.ang)*m,Math.sin(A.ang)*m]}
function rdDrawAtk(front){const A=RUN.atkA;if(!A)return;const k=Math.min(1,A.t/A.max),px=P3.x,py=P3.y-6;
 if(A.kind==='bite'){if(!front)return;const cx=px+Math.cos(A.ang)*13,cy=py+3+Math.sin(A.ang)*10,gp=Math.round(5*(1-k));
  g.save();g.translate(Math.round(cx),Math.round(cy));g.rotate(A.ang);for(const s2 of[-1,1]){const y=s2*(gp+1);r('#ffffff',-3,y-(s2<0?2:0),6,2);r('#ffffff',-2,y+(s2<0?0:-1),1,1);r('#ffffff',1,y+(s2<0?0:-1),1,1)}g.restore();
  if(k>.6){g.save();g.globalAlpha=1-k;r('#ffffff',Math.round(cx)-1,Math.round(cy)-6,2,2);r('#ffffff',Math.round(cx)+4,Math.round(cy)-3,2,2);g.restore()}return}
 if(A.kind==='bow'){if(!front)return;g.save();g.translate(Math.round(px),Math.round(py+2));g.rotate(A.ang);const pull=k<.5?k*2:0;
  g.strokeStyle='#8a5e36';g.lineWidth=2;g.beginPath();g.arc(4,0,7,-1.2,1.2);g.stroke();g.strokeStyle='#e8e4f5';g.lineWidth=1;g.beginPath();g.moveTo(4+Math.cos(-1.2)*7,Math.sin(-1.2)*7);g.lineTo(4-pull*5,0);g.lineTo(4+Math.cos(1.2)*7,Math.sin(1.2)*7);g.stroke();
  if(k<.5)r('#b0f090',Math.round(4-pull*5),-1,12,1);g.restore();return}
 const spin=A.kind==='blade'&&A.combo===2,sw=A.kind==='maul'?2.6:2.1,e=1-Math.pow(1-k,3),a0=A.ang-A.dir*sw/2,a1=spin?a0+A.dir*Math.PI*2:A.ang+A.dir*sw/2,a=a0+(a1-a0)*e,R2=A.kind==='maul'?18:15;
 /* the weapon is behind the keeper while it's above them, in front while it's below */
 if((Math.sin(a)<0)===front)return;
 g.save();g.globalAlpha=.6*(1-k*.7);g.lineCap='round';g.strokeStyle=spin?'#ffd94d':A.kind==='maul'?'#d8c0a0':'#f8f0ff';g.lineWidth=A.kind==='maul'?7:5;g.beginPath();
 const lo=Math.min(a0,a),hi=Math.max(a0,a);g.arc(px,py,R2-3,lo,hi);g.stroke();g.globalAlpha=.5*(1-k);g.strokeStyle=A.kind==='maul'?'#8a5e36':'#f8a0c8';g.lineWidth=1;g.beginPath();g.arc(px,py,R2+1,lo,hi);g.stroke();g.restore();
 const sp=RDWPN[A.kind]||RDWPN.blade;g.save();g.translate(Math.round(px),Math.round(py));g.rotate(a);g.drawImage(sp.ol,2,-(sp.oh>>1));g.restore();
 if(spin&&((A.t*40)|0)%2)RUN.parts.push({x:px+Math.cos(a)*R2,y:py+Math.sin(a)*R2,vx:R(-20,20),vy:R(-20,20),life:.3,c:'#f8a0c8'});}

/* ---------------- keeper specials (X, Y) and supers ---------------- */
function rdNear(rad,skip){let best=null,bd=rad*rad;for(const e of RUN.enemies){if(e.hp<=0||(skip&&skip.has(e)))continue;const d=(e.x-P3.x)**2+(e.y-P3.y)**2;if(d<bd){bd=d;best=e}}return best}
/* a rush moves the keeper on rails, hits each foe it passes once, and can't be hurt */
function rdRush(vx,vy,t,dmg,kb,kind,src){RUN.rush={vx,vy,t,dmg,kb,kind,src:src||'sp',hit:new Set()};RUN.inv=Math.max(RUN.inv,t+.12);P3.vx=vx;P3.vy=vy;}
function rdZoomHop(){const seen=RUN.zoomHit||(RUN.zoomHit=new Set()),e=rdNear(130,seen),m=rdStats().dmgMul;let ax,ay;
 if(e){seen.add(e);const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy)||1;ax=dx/d;ay=dy/d;P3.ax=ax;P3.ay=ay;rdRush(ax*430,ay*430,Math.min(.22,(d+16)/430),10*m,6,'zoom')}
 else{[ax,ay]=aimVec();rdRush(ax*430,ay*430,.14,10*m,6,'zoom')}
 snd(520+RUN.zoomQ*120,.06,300,'sawtooth',.05);RUN.zoomQ--;}
const RDSPEC={
 WILL_x(ax,ay,m){RUN.fx.push({k:'flash',x:P3.x,y:P3.y-6,r:48,t:.35,max:.35});noise(.03,.5,5000);snd(2400,.03,0,'square',.05);
  for(const e of RUN.enemies.slice())if(e.hp>0&&Math.hypot(e.x-P3.x,e.y-P3.y)<48+e.r){e.root=Math.max(e.root,e.kind==='boss'?.4:1.3);hitEnemy(e,6*m,'sp')}},
 WILL_y(ax,ay,m){const len=176,oy2=P3.y-6;RUN.fx.push({k:'beam',x:P3.x,y:oy2,ax,ay,len,t:.5,max:.5});RUN.shake=3;snd(180,.45,900,'sawtooth',.09);snd(1400,.4,500,'square',.04);
  for(const e of RUN.enemies.slice()){if(e.hp<=0)continue;const px=e.x-P3.x,py=e.y-oy2,along=px*ax+py*ay;if(along<-4||along>len)continue;if(Math.abs(px*ay-py*ax)<8+e.r)hitEnemy(e,20*m,'sp',ax*5,ay*5)}},
 WILL_su(ax,ay,m){rdRush(ax*330,ay*330,.75,30*m,10,'bike','su');snd(1200,.1,1600,'sine',.1);later(()=>snd(1200,.1,1600,'sine',.1),120)},
 ERIN_x(ax,ay,m){RUN.projs.push({x:P3.x+ax*8,y:P3.y+ay*8,vx:ax*175,vy:ay*175,dmg:14*m,kind:'towel',r:9,life:.45,src:'sp',pierce:1});noise(.03,.5,5000);snd(2400,.03,0,'square',.05)},
 ERIN_y(ax,ay,m){let t=null,bs=1e9;for(const e of RUN.enemies){if(e.hp<=0)continue;const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy);if(d>140)continue;const sc=d*((dx*ax+dy*ay)/(d||1)>.35?.6:1);if(sc<bs){bs=sc;t=e}}
  if(!t){ftext(P3.x,P3.y-18,'NOTHING TO LASSO','#c8c0d8');RUN.yCd=.6;return}
  RUN.fx.push({k:'leash',x:t.x,y:t.y,e:t,t:.3,max:.3});
  if(t.kind!=='boss'){const d=Math.hypot(t.x-P3.x,t.y-P3.y)||1;t.x=P3.x+(t.x-P3.x)/d*18;t.y=P3.y+(t.y-P3.y)/d*18;collide(t,t.r)}
  t.root=Math.max(t.root,t.kind==='boss'?.5:1.1);hitEnemy(t,9*m,'sp');snd(700,.08,300,'triangle',.06)},
 ERIN_su(ax,ay,m){const px=-ay,py=ax;for(let i=0;i<6;i++){const o=(i-2.5)*13;RUN.projs.push({x:P3.x-ax*14+px*o,y:P3.y-ay*14+py*o,vx:ax*190,vy:ay*190,dmg:15*m,kind:'stampede',bud:i,r:6,life:1.7,pierce:1,rehit:.6,src:'su',delay:i*.06})}
  snd(660,.08,990);later(()=>snd(880,.08,1320),90)},
 LOUIE_x(){RUN.zoomQ=3;RUN.zoomHit=new Set();rdZoomHop()},
 LOUIE_y(ax,ay,m){rdRush(ax*320,ay*320,.5,22*m,14,'turbo');snd(200,.5,620,'sawtooth',.07)},
 LOUIE_su(ax,ay,m){const ts=RUN.enemies.filter(e=>e.hp>0).slice(0,7);
  if(!ts.length)RUN.fx.push({k:'pillar',x:P3.x+ax*40,y:P3.y+ay*40,t:1.2,max:1.2,hits:4,tick:.35,dmg:0});
  for(const e of ts)for(let j=0;j<(e.kind==='boss'?2:1);j++)RUN.fx.push({k:'pillar',e,ox:j?10:0,x:e.x,y:e.y,t:1.2,max:1.2,hits:4,tick:.35,dmg:7*m});
  snd(80,1.2,40,'sawtooth',.08)},
 KING_x(ax,ay,m){const free=RUN.buds.filter(b=>!b.fly&&!b.latch),b=free[0];
  if(!b){ftext(P3.x,P3.y-18,'NO BUDS TO TOSS','#c8c0d8');RUN.xCd=.4;return}
  let t=null,bs=1e9;for(const e of RUN.enemies){if(e.hp<=0)continue;const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy);if(d>150)continue;const sc=d*((dx*ax+dy*ay)/(d||1)>.35?.6:1);if(sc<bs){bs=sc;t=e}}
  b.latch=t;b.fly={t:0,sx:b.x,sy:b.y,tx:t?t.x:P3.x+ax*60,ty:t?t.y:P3.y+ay*60};snd(880,.05,1320,'triangle',.05)},
 KING_y(ax,ay,m){let n=0;for(const b of RUN.buds){b.latch=null;b.fly=null;b.leap=null;b.tgt=null;b.z=0;b.recall=1.2;n++}RUN.frenzyT=4;rdHeal(1.5*n);
  RUN.fx.push({k:'whistle',x:P3.x,y:P3.y-6,t:.5,max:.5});snd(1046,.08,1568,'triangle',.06);later(()=>snd(1568,.12,1046,'triangle',.05),90);
  if(n)ftext(P3.x,P3.y-30,'+'+Math.round(1.5*n)+' · FRENZY!','#a8f080')},
 KING_su(ax,ay,m){RUN.bloomT=6;for(let i=0;i<3;i++)RUN.buds.push({type:5,x:P3.x+R(-10,10),y:P3.y+R(-6,6),a:Math.random()*6,cd:0,z:0,temp:6.5});
  burst(P3.x,P3.y-6,'#ffd94d',16,50);snd(784,.12);later(()=>snd(1046,.12),100);later(()=>snd(1568,.3),200)},
 MARCUS_x(ax,ay,m){RUN.projs.push({x:P3.x+ax*14,y:P3.y+ay*14,vx:ax*62,vy:ay*62,dmg:4*m,kind:'cloud',r:12,life:2.4,pierce:1,rehit:.45,src:'sp'});noise(.5,.2,900,'lowpass')},
 MARCUS_y(ax,ay,m){const win=Math.random()<.55+(hasGod('LUCKY')?.15:0);RUN.fx.push({k:'coin',x:P3.x,y:P3.y-24,t:.6,max:.6,win});
  for(const e of RUN.enemies.slice()){if(e.hp<=0)continue;const dx=e.x-P3.x,dy=e.y-P3.y,d=Math.hypot(dx,dy);if(d<34+e.r&&(dx*ax+dy*ay)/(d||1)>.1)hitEnemy(e,(win?34:5)*m,'sp',dx/(d||1)*(win?16:3),dy/(d||1)*(win?16:3))}
  ftext(P3.x,P3.y-32,win?'DOUBLE!':'NOTHING, BRO.',win?'#ffd94d':'#a89ec2');
  if(win){burst(P3.x+ax*16,P3.y+ay*16,'#f8d030',12,46);RUN.shake=3;snd(1200,.05);later(()=>snd(1600,.12),70)}else snd(300,.15,150,'triangle',.05)},
 MARCUS_su(ax,ay,m){for(let i=0;i<6;i++)RUN.hazards.push({x:P3.x+ax*(24+i*26),y:P3.y+ay*(24+i*26),t:.3+i*.12,r:15,dmg:17*m,from:'player',geyser:1,root:.5});noise(.9,.25,700,'lowpass')}};
function rdSpecial(slot){if(!RUN||RUN.rush||RUN.cutT>0)return;const ch=RUN.char||'WILL',mv=RDMOVES[ch][slot],ck=slot+'Cd';
 if(RUN[ck]>0){snd(140,.05);return}
 RUN[ck]=mv.cd;const[ax,ay]=rdAim(160);say2(mv.n+'!',1);
 RDSPEC[ch+'_'+slot](ax,ay,rdStats().dmgMul);}
/* the super: a short freeze-frame cut-in, then the move */
function rdSuper(){RUN.sup=0;RUN.cutT=.7;RUN.cutN=RDMOVES[RUN.char||'WILL'].su.n;RUN.inv=Math.max(RUN.inv,1.2);snd(988,.1);later(()=>snd(1319,.3),90);}
function rdSuperGo(){const ch=RUN.char||'WILL',[ax,ay]=rdAim(170);RDSPEC[ch+'_su'](ax,ay,rdStats().dmgMul);}

function foeMove(e,dt,tx,ty,sp){const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy)||1;
 const step=Math.min(d,sp*dt*(e.chill>0?.55:1));e.x+=dx/d*step;e.y+=dy/d*step;e.face=dx>0?1:-1;collide(e,e.r);return d;}
function rdUpdFoe(e,dt){e.flash=Math.max(0,e.flash-dt);e.hitCd-=dt;e.cd-=dt;
 if(e.burn>0){e.burn-=dt;e.hp-=e.burnDps*dt;if(Math.random()<dt*6)RUN.parts.push({x:e.x+R(-4,4),y:e.y-4,vx:0,vy:-18,life:.35,c:'#f07830'});
  if(e.hp<=0){killEnemy(e);return}}
 if(e.chill>0)e.chill-=dt;if(e.root>0){e.root-=dt;return}
 const d=Math.hypot(P3.x-e.x,P3.y-e.y),B=FOES[e.kind].b;
 if(B==='chase')foeMove(e,dt,P3.x,P3.y,e.sp);
 else if(B==='shoot'){if(d>105)foeMove(e,dt,P3.x,P3.y,e.sp);else if(d<70)foeMove(e,dt,e.x+(e.x-P3.x),e.y+(e.y-P3.y),e.sp);
  if(e.cd<=0&&d<125){e.cd=1.9;const a=Math.atan2(P3.y-e.y,P3.x-e.x);RUN.eprojs.push({k:e.kind==='boss'?'boss'+e.bossIx:e.kind,x:e.x,y:e.y,vx:Math.cos(a)*118,vy:Math.sin(a)*118,dmg:e.dmg,r:3});snd(340,.05,220)}}
 else if(B==='orbit'){const a=Math.atan2(e.y-P3.y,e.x-P3.x)+dt*.9,nx=P3.x+Math.cos(a)*56,ny=P3.y+Math.sin(a)*56;foeMove(e,dt,nx,ny,e.sp*1.4);
  if(e.cd<=0){e.cd=2.4;const an=Math.atan2(P3.y-e.y,P3.x-e.x);RUN.eprojs.push({k:e.kind==='boss'?'boss'+e.bossIx:e.kind,x:e.x,y:e.y,vx:Math.cos(an)*125,vy:Math.sin(an)*125,dmg:e.dmg,r:3})}}
 else if(B==='shield'){e.t+=dt;e.state=(e.t%3.4)<2.2?1:0;foeMove(e,dt,P3.x,P3.y,e.sp*(e.state?0.7:1.25))}
 else if(B==='blink'){foeMove(e,dt,P3.x,P3.y,e.sp);
  if(e.cd<=0&&d>26){e.cd=2.3;rdShake(e);burst(e.x,e.y,'#6a5a96',6,24);const a=Math.atan2(e.y-P3.y,e.x-P3.x);e.x=P3.x+Math.cos(a)*20;e.y=P3.y+Math.sin(a)*20;collide(e,e.r);burst(e.x,e.y,'#6a5a96',6,24);snd(980,.07,340)}}
 else if(B==='charge'){const st=e.state;
  if(st===0){foeMove(e,dt,P3.x,P3.y,e.sp);if(d<74&&e.cd<=0){e.state=1;e.t=.45}}
  if(st===1){e.t-=dt;e.x+=R(-.7,.7);if(e.t<=0){e.state=2;e.t=.42;rdShake(e);const a=Math.atan2(P3.y-e.y,P3.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a);snd(220,.08,110)}}
  if(st===2){e.t-=dt;e.x+=e.sx*175*dt;e.y+=e.sy*175*dt;collide(e,e.r);if(e.t<=0){e.state=0;e.cd=1.3}}}
 /* touch damage */
 if(d<e.r+7&&e.hitCd<=0&&RUN.inv<=0&&RUN.dashT<=0){e.hitCd=.85;RUN.lastHit=e.kind;const kx=(P3.x-e.x)/(d||1)*90,ky=(P3.y-e.y)/(d||1)*90;P3.vx+=kx;P3.vy+=ky;damagePlayer(e.dmg);}}
function updBoss(e,dt){e.flash=Math.max(0,e.flash-dt);e.hitCd-=dt;e.cd-=dt;e.bt-=dt;
 if(e.burn>0){e.burn-=dt;e.hp-=e.burnDps*dt;if(e.hp<=0){killEnemy(e);return}}
 if(e.chill>0)e.chill-=dt;if(e.root>0){e.root-=dt;return}
 const frac=e.hp/e.max;e.phase=frac>.66?1:frac>.33?2:3;
 const d=Math.hypot(P3.x-e.x,P3.y-e.y);
 const radial=n=>{for(let i=0;i<n;i++){const a=i/n*6.283+e.t;RUN.eprojs.push({k:e.kind==='boss'?'boss'+e.bossIx:e.kind,x:e.x,y:e.y,vx:Math.cos(a)*95,vy:Math.sin(a)*95,dmg:e.dmg*.8,r:3})}snd(180,.15,90,'sawtooth',.06)};
 const aimed=(n,sp)=>{const base=Math.atan2(P3.y-e.y,P3.x-e.x);for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.22;RUN.eprojs.push({k:e.kind==='boss'?'boss'+e.bossIx:e.kind,x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:e.dmg*.85,r:3})}};
 if(e.bossIx===0){ /* Grub Mother */
  if(e.state===1){e.t-=dt;e.x+=R(-1,1);if(e.t<=0){e.state=2;e.t=.5;const a=Math.atan2(P3.y-e.y,P3.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a)}}
  else if(e.state===2){e.t-=dt;e.x+=e.sx*165*dt;e.y+=e.sy*165*dt;collide(e,e.r);if(e.t<=0)e.state=0}
  else{foeMove(e,dt,P3.x,P3.y,e.sp);
   if(e.bt<=0){e.bt=e.phase===1?7:5;const adds=RUN.enemies.length-1;
    if(Math.random()<.5&&adds<4){for(let i=0;i<2;i++)spawnFoe('grub',e.x+R(-14,14),e.y+R(-10,10),false);say2('SHE CALLS HER CHILDREN',1.6)}
    else if(e.phase>=2)radial(10);else{e.state=1;e.t=.5}}}}
 else if(e.bossIx===1){ /* Drowned King */
  if(e.state===1){e.t-=dt;if(e.t<=0){e.x=e.tx;e.y=e.ty;e.state=0;RUN.shake=4;RUN.hazards.push({x:e.x,y:e.y,t:.05,r:26,dmg:e.dmg,from:'foe',instant:true});burst(e.x,e.y,'#7fd0e8',12,44);snd(120,.25,60,'sawtooth',.08)}}
  else{foeMove(e,dt,P3.x,P3.y,e.sp*.7);
   if(e.bt<=0){e.bt=e.phase===3?4.2:5.6;const roll=Math.random();
    if(roll<.45){e.state=1;e.t=.7;e.tx=P3.x;e.ty=P3.y;rdShake(e);say2('HE LEAPS!',1)}
    else if(roll<.75)radial(12);else{for(let i=0;i<2;i++)spawnFoe(Math.random()<.5?'wisp':'crab',e.x+R(-18,18),e.y+R(-12,12),false)}}}}
 else{ /* Hollow Keeper */
  if(e.state===1){e.t-=dt;if(e.t<=0){e.state=2;e.t=.34;const a=Math.atan2(P3.y-e.y,P3.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a);snd(140,.1,70,'sawtooth',.07)}}
  else if(e.state===2){e.t-=dt;e.x+=e.sx*265*dt;e.y+=e.sy*265*dt;collide(e,e.r);
   if(Math.hypot(P3.x-e.x,P3.y-e.y)<e.r+8&&RUN.inv<=0){RUN.lastHit='boss2';damagePlayer(e.dmg*1.1);if(!RUN)return}
   if(e.t<=0)e.state=0}
  else{foeMove(e,dt,P3.x,P3.y,e.sp*(e.phase===3?1.3:1));
   if(e.bt<=0){e.bt=e.phase===3?2.6:3.6;const roll=Math.random();
    if(roll<.4){e.state=1;e.t=.42;say2('IT WEARS YOUR FACE — DASH!',1.2)}
    else if(roll<.7)aimed(e.phase>=2?5:3,135);
    else if(e.phase>=2&&RUN.enemies.length<3){spawnFoe('shade',e.x+R(-16,16),e.y+R(-12,12),false)}
    else radial(9)}}}
 if(RUN&&d<e.r+7&&e.hitCd<=0&&RUN.inv<=0&&RUN.dashT<=0){e.hitCd=.85;RUN.lastHit='boss'+e.bossIx;damagePlayer(e.dmg);}}
function runUpdate(dt){if(RUN.cineQ&&RUN.cineQ.length){startCine('run',RUN.cineQ.shift());return}
 if(RUN.pendingCine){const k=RUN.pendingCine;RUN.pendingCine=null;startCine('run',k);return}
 RUN.time+=dt;if(say2T>0)say2T-=dt;if(RUN.zoneT>0)RUN.zoneT-=dt;
 if(RUN.cutT>0){RUN.cutT-=dt;if(RUN.cutT<=0){RUN.cutT=0;rdSuperGo()}return}
 /* hit-stop: a few frames of freeze when a blow lands (longer when you're the one hit) */
 if(RUN.hs>0){RUN.hs-=dt;return}
 if(RUN.atkA){RUN.atkA.t+=dt;if(RUN.atkA.t>=RUN.atkA.max)RUN.atkA=null}if(RUN.hurtT>0)RUN.hurtT-=dt;rdTips(dt);
 if(pressed('start')){pauseSel=0;pausePage=0;state='g3pause';rdSave();return}
 /* player */
 if(RUN.atkCd>0)RUN.atkCd-=dt;if(RUN.castCd>0)RUN.castCd-=dt;if(RUN.inv>0)RUN.inv-=dt;
 if(RUN.xCd>0)RUN.xCd-=dt;if(RUN.yCd>0)RUN.yCd-=dt;
 if(RUN.armT>0)RUN.armT-=dt;if(RUN.shake>0)RUN.shake*=Math.max(0,1-dt*7);if(RUN.slashT>0)RUN.slashT-=dt;
 aimVec();
 if(RUN.rush){const u=RUN.rush;u.t-=dt;P3.x+=u.vx*dt;P3.y+=u.vy*dt;collide(P3,6);RUN.inv=Math.max(RUN.inv,.1);
  RUN.parts.push({x:P3.x,y:P3.y,vx:R(-10,10),vy:R(-10,10),life:.3,c:u.kind==='bike'?'#ffd94d':u.kind==='zoom'||u.kind==='turbo'?'#f8a040':'#ffe9a8'});
  for(const e of RUN.enemies.slice()){if(e.hp<=0||u.hit.has(e))continue;
   if(Math.hypot(e.x-P3.x,e.y-P3.y)<e.r+9){u.hit.add(e);const d=Math.hypot(u.vx,u.vy)||1;hitEnemy(e,u.dmg,u.src,u.vx/d*u.kb,u.vy/d*u.kb);RUN.shake=Math.max(RUN.shake,2)}}
  rdHitInts(P3.x,P3.y,12);
  if(u.t<=0){RUN.rush=null;P3.vx=P3.vy=0;if(RUN.zoomQ>0)rdZoomHop()}}
 else if(RUN.dashT>0){RUN.dashT-=dt;P3.x+=P3.vx*dt;P3.y+=P3.vy*dt;collide(P3,6);RUN.trail=RUN.trail||[];RUN.trail.push({x:P3.x,y:P3.y,t:.22,ax:P3.ax||0,ay:P3.ay===undefined?1:P3.ay});RUN.parts.push({x:P3.x,y:P3.y,vx:R(-8,8),vy:R(-8,8),life:.25,c:'#ffe9a8'})}
 else movePlayer(dt,92*rdStats().speedMul*(1+.07*budCount(3)));
 if(RUN.dashRegen>0){RUN.dashRegen-=dt;if(RUN.dashRegen<=0&&RUN.dashCharges<rdStats().dashCharges)RUN.dashCharges++}
 if(RUN.castRegenT>0){RUN.castRegenT-=dt;if(RUN.castRegenT<=0){const mx=1+(hasKeep('stone')?1:0);if(RUN.castAmmo<mx){RUN.castAmmo++;if(RUN.castAmmo<mx)RUN.castRegenT=3.2/rdStats().castRegen}}}
 const synth=RUN.boons.pass.find(p=>p.id==='synth');if(synth)RUN.hp=Math.min(rdStats().maxHp,RUN.hp+rdBoonVal(synth)*.2*dt);
 if(!RUN.rush){
  for(const d of['left','right','up','down'])if(pressed(d)){if(RUN.dtap[d]!==undefined&&RUN.time-RUN.dtap[d]<.27)doDash();RUN.dtap[d]=RUN.time}
  if(pressed('a')){const it=rdNearInt();if(it&&!RUN.enemies.some(e=>Math.hypot(e.x-P3.x,e.y-P3.y)<34))rdUseInt(it);else doAttack()}
  if(pressed('b')){if((RUN.sup||0)>=100)rdSuper();else doCast()}
  if(pressed('x'))rdSpecial('x');
  if(pressed('y'))rdSpecial('y');
  if(RUN.cutT>0)return}
 /* sprout buddies. Erin's hit 1.5x, the Sprout King's 2x; ROYAL WHISTLE frenzies them, BLOOM OF KINGS triples them */
 if(RUN.frenzyT>0)RUN.frenzyT-=dt;
 if(RUN.bloomT>0){RUN.bloomT-=dt;if(RUN.bloomT<=0){RUN.buds=RUN.buds.filter(b=>!b.temp);say2('THE BLOOM FADES',1.2)}}
 const bm=budMul(),bcd=(RUN.frenzyT>0?.5:1)*(RUN.bloomT>0?.5:1);
 /* the swarm: every bud but PEB (your guard) rushes foes near you, latches on and chews in small bites.
    They spread out across foes, hop to the next when theirs falls, and come home when the fight's done. */
 if(RUN.buds)for(let i=0;i<RUN.buds.length;i++){const b=RUN.buds[i];b.a+=dt;if(b.cd>0)b.cd-=dt;if(b.acd>0)b.acd-=dt;if(b.acd===undefined)b.acd=0;if(b.recall>0)b.recall-=dt;
  if(b.fly){const f=b.fly;f.t+=dt;const k=Math.min(1,f.t/.3),e=b.latch,tx=e?e.x:f.tx,ty=e?e.y-5:f.ty;
   b.x=f.sx+(tx-f.sx)*k;b.y=f.sy+(ty-f.sy)*k;b.z=Math.round(Math.sin(k*Math.PI)*16);
   if(k>=1){b.fly=null;b.z=0;if(e&&e.hp>0){hitEnemy(e,12*rdStats().dmgMul,'sp');burst(e.x,e.y-4,'#a8f080',6,30);snd(523,.05,784);b.lt=3.2;b.lacd=.2}else b.latch=null}continue}
  if(b.latch){const e=b.latch;b.lacd-=dt;if(b.lt!==undefined)b.lt-=dt;
   if(e.hp<=0||b.lt<=0||!RUN.enemies.includes(e)){b.latch=null;b.tgt=null;b.lt=undefined}
   else{const k=RUN.buds.filter(o=>o.latch===e).indexOf(b),ang=k*2.1;b.x=e.x+Math.round(Math.cos(ang)*e.r*.8);b.y=e.y-4+Math.round(Math.sin(ang)*3);b.z=((b.a*12)|0)%2;b.fx=Math.cos(ang)<0?1:-1;
    if(b.lacd<=0){const bt=RDBITE[b.type]||RDBITE[0];b.lacd=bt.cd*bcd;hitEnemy(e,bt.d*bm,'bud');
     if(b.type===0){e.burn=Math.max(e.burn,1);e.burnDps=Math.max(e.burnDps,1.2)}
     if(b.type===4&&Math.random()<.12)RUN.pickups.push({kind:'petal',val:1,x:e.x,y:e.y,vx:R(-20,20),vy:R(-20,20)});
     if(!RUN)return}
    continue}}
  if(b.type!==1&&!(b.recall>0)&&RUN.enemies.length){let tgt=b.tgt;
   if(!(tgt&&tgt.hp>0&&RUN.enemies.includes(tgt)&&Math.hypot(tgt.x-P3.x,tgt.y-P3.y)<140))tgt=rdBudPick(b);
   if(tgt){b.tgt=tgt;const dx=tgt.x-b.x,dy=tgt.y-5-b.y,d=Math.hypot(dx,dy)||1;b.fx=dx>=0?1:-1;
    /* a smooth, timed leap: the bud crouches, arcs through the air and lands on the foe */
    if(!b.leap||b.leap.e!==tgt)b.leap={e:tgt,t:0,sx:b.x,sy:b.y,dur:Math.max(.34,Math.min(.62,d/(b.type===3?190:140)))*(RUN.frenzyT>0?.8:1)};
    const L2=b.leap;L2.t+=dt;const k=Math.min(1,L2.t/L2.dur),e2=k*k*(3-2*k);b.x=L2.sx+(tgt.x-L2.sx)*e2;b.y=L2.sy+(tgt.y-5-L2.sy)*e2;b.z=Math.round(Math.sin(k*Math.PI)*12);
    if(k>=1){b.leap=null;b.latch=tgt;b.lt=undefined;b.lacd=.15;b.z=0;burst(tgt.x,tgt.y-6,'#e8e4f5',3,18)}continue}}
  b.leap=null;
  b.tgt=null;b.z=0;
  const an=i===0?P3:RUN.buds[i-1];
  const tx2=an.x+(i===0?0:Math.cos(i*2.4)*13),ty2=an.y+(i===0?15:Math.sin(i*2.4)*9+6),dd=Math.hypot(tx2-b.x,ty2-b.y);
  if(dd>2){const sp=dd>52?210:125;b.x+=(tx2-b.x)*Math.min(1,dt*sp/Math.max(dd,1));b.y+=(ty2-b.y)*Math.min(1,dt*sp/Math.max(dd,1))}
  b.fx=tx2>=b.x?1:-1;
  if(b.temp){b.temp-=dt;if(b.temp<=0){b.dead=1;continue}}
  /* PEB guards you: it only swats foes that get right up close */
  if(b.type===1&&b.acd<=0)for(const e of RUN.enemies)if(Math.hypot(e.x-b.x,e.y-b.y)<17){hitEnemy(e,2*bm,'bud');burst(e.x,e.y-4,'#c8ccd4',3,18);b.acd=1.5*bcd;break}}
 if(RUN.buds)RUN.buds=RUN.buds.filter(b=>!b.dead);
 /* personal space: buds in the string keep a little room from you and from each other */
 if(RUN.buds){const fr=RUN.buds.filter(b=>!b.latch&&!b.fly&&!b.leap);for(let i=0;i<fr.length;i++){const a=fr[i];
  const pd=Math.hypot(a.x-P3.x,a.y-P3.y);if(pd<11&&pd>0){a.x+=(a.x-P3.x)/pd*(11-pd)*.5;a.y+=(a.y-P3.y)/pd*(11-pd)*.5}
  for(let j=i+1;j<fr.length;j++){const c=fr[j],dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy);if(d>0&&d<12){const push=(12-d)/2*.6,ux=dx/d,uy=dy/d;a.x-=ux*push;a.y-=uy*push;c.x+=ux*push;c.y+=uy*push}}}}
 if(RUN.buds&&budCount(2)>0){RUN.dewT+=dt;if(RUN.dewT>4){RUN.dewT=0;if(RUN.hp<rdStats().maxHp){rdHeal(1);const db=RUN.buds.find(b=>b.type===2);if(db)RUN.parts.push({x:db.x,y:db.y-9,vx:0,vy:-12,life:.5,c:'#48a0f0'})}}}
 if(RUN.pods)for(const pd of RUN.pods){if(!pd.got&&Math.hypot(P3.x-pd.x,P3.y-pd.y)<12){pd.got=true;
  if(RUN.buds.filter(b=>!b.temp).length<budMax()){RUN.buds.push({type:pd.type,x:pd.x,y:pd.y,a:Math.random()*6,cd:0,z:0});ftext(pd.x,pd.y-14,TYPES[pd.type].n+' JOINED!','#a8f080');snd(880,.07,1320);rdFound();
   if(!RUN.fullCounted&&RUN.buds.filter(b=>!b.temp).length>=6){RUN.fullCounted=1;RD.stats.fullString=(RD.stats.fullString||0)+1;if(RD.stats.fullString===1)say2('THE BUDS HAVE A KING NOW',3)}}
  else rdWait(pd.type,pd.x,pd.y)}}
 if(RUN.pods)RUN.pods=RUN.pods.filter(pd=>!pd.got);
 /* flame zones */
 for(const z of RUN.zones){z.t-=dt;for(const e of RUN.enemies)if(Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){e.burn=Math.max(e.burn,.4);e.burnDps=Math.max(e.burnDps,z.dps)}}
 RUN.zones=RUN.zones.filter(z=>z.t>0);
 /* wildfire duo */
 if(hasDuo('wildfire')){RUN.duoT=(RUN.duoT||0)-dt;if(RUN.duoT<=0){RUN.duoT=2;for(const e of RUN.enemies.slice())if(e.burn>0){e.hp-=14;e.flash=.12;burst(e.x,e.y,'#f0d020',4,26);if(e.hp<=0)killEnemy(e)}}}
 /* hazards (boulderfalls, king slams) */
 for(const h of RUN.hazards){h.t-=dt;if(h.t<=0&&!h.done){h.done=true;burst(h.x,h.y,h.geyser?'#bdeffb':h.from==='player'?'#98a0b0':'#7fd0e8',12,44);snd(130,.2,60,'sawtooth',.07);
  if(h.geyser){RUN.fx.push({k:'geyser',x:h.x,y:h.y,t:.42,max:.42});RUN.shake=Math.max(RUN.shake,1.5)}
  if(h.from==='player'){rdHitInts(h.x,h.y,h.r+6);for(const e of RUN.enemies.slice())if(e.hp>0&&Math.hypot(e.x-h.x,e.y-h.y)<h.r+e.r){hitEnemy(e,h.dmg,h.geyser?'su':'cast');if(h.root&&e.hp>0)e.root=Math.max(e.root,e.kind==='boss'?.15:h.root)}}
  else if(Math.hypot(P3.x-h.x,P3.y-h.y)<h.r+6&&RUN.inv<=0&&RUN.dashT<=0){RUN.lastHit='boss1';damagePlayer(h.dmg);if(!RUN)return}}}
 RUN.hazards=RUN.hazards.filter(h=>!h.done);
 /* foes */
 for(const e of RUN.enemies.slice()){if(e.hp<=0)continue;if(e.kind==='boss')updBoss(e,dt);else rdUpdFoe(e,dt);if(!RUN)return}
 /* projectiles */
 /* each shot remembers whom it has hit: a piercing shot hits a foe once (or again after p.rehit seconds), never every frame */
 for(const p of RUN.projs){if(p.delay>0){p.delay-=dt;continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  for(const e of RUN.enemies.slice()){if(e.hp<=0||Math.hypot(e.x-p.x,e.y-p.y)>=e.r+p.r)continue;
   const hm=p.hm||(p.hm=new Map()),last=hm.get(e);if(last!==undefined&&(!p.rehit||RUN.time-last<p.rehit))continue;hm.set(e,RUN.time);
   if(projHit(p,e)){p.life=0;break}if(!RUN)return}
  if(p.life>0&&p.src!=='bud')for(const it of RUN.ints)if(!it.done&&(it.k==='pot'||it.k==='boom')&&Math.hypot(it.x-p.x,it.y-6-p.y)<p.r+6){rdBreak(it);if(!p.pierce)p.life=0;break}}
 RUN.projs=RUN.projs.filter(p=>p.life>0&&p.x>-8&&p.x<W+8&&p.y>20&&p.y<H+8);
 for(const p of RUN.eprojs){p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(Math.hypot(P3.x-p.x,P3.y-p.y)<p.r+6&&RUN.inv<=0&&RUN.dashT<=0){p.life=0;RUN.lastHit=p.k||'shot';damagePlayer(p.dmg);if(!RUN)return}}
 RUN.eprojs=RUN.eprojs.filter(p=>p.life!==0&&p.x>-8&&p.x<W+8&&p.y>20&&p.y<H+8);
 /* pickups */
 for(const p of RUN.pickups){const d=Math.hypot(P3.x-p.x,P3.y-p.y);
  if(d<(budCount(3)>0?88:48)){p.vx+=(P3.x-p.x)*8*dt*8;p.vy+=(P3.y-p.y)*8*dt*8}
  p.vx*=Math.max(0,1-dt*4);p.vy*=Math.max(0,1-dt*4);p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(d<10){p.got=true;if(p.kind==='petal'){RUN.petals+=p.val;if(Math.random()<.3)snd(1200,.03,1600,'square',.02)}
   else if(p.kind==='dew'){RUN.dew+=p.val;say2('+'+p.val+' MOONDEW',1.2);snd(980,.06,1470)}
   else if(p.kind==='heart'){rdHeal(p.val);ftext(P3.x,P3.y-12,'+'+p.val,'#a8f080')}
   else if(p.kind==='honey'){RUN.honey+=p.val;say2('+1 HONEY',1.5)}}}
 RUN.pickups=RUN.pickups.filter(p=>!p.got);
 /* doors / clear */
 if(RUN.phase==='fight'&&RUN.enemies.length===0){
  if(RUN.wave2&&RUN.wave2.length){const w2=RUN.wave2;RUN.wave2=null;
   for(const s2 of w2)spawnFoe(s2.k,26+Math.random()*(W-52),RDA.top+10+Math.random()*(H*.42),s2.elite);
   say2('THE DEEP STIRS - MORE RISE',1.6);snd(160,.25,70,'sawtooth',.06)}
  else{chamberCleared();if(!RUN)return}}
 else if(RUN.phase==='doors'){for(const d of RUN.doors)if(Math.abs(P3.x-d.x)<10&&P3.y<d.y+17){doorReward(d);return}}
 /* fx */
 rdIntsUpdate(dt);if(!RUN)return;
 for(const f of RUN.fx){f.t-=dt;if(f.e&&f.e.hp>0){f.x=f.e.x+(f.ox||0);f.y=f.e.y}
  if(f.k==='pillar'&&f.hits>0){f.tick-=dt;if(f.tick<=0){f.tick=.18;f.hits--;RUN.shake=Math.max(RUN.shake,1.5);snd(160,.06,80,'sawtooth',.04);
   if(f.dmg)for(const e of RUN.enemies.slice())if(e.hp>0&&Math.hypot(e.x-f.x,e.y-f.y)<e.r+9)hitEnemy(e,f.dmg,'su')}}}
 RUN.fx=RUN.fx.filter(f=>f.t>0);
 if(RUN.phase==='doors'){const was=RUN.litT||0;RUN.litT=was+dt;(RUN.lamps||[]).forEach((l,i)=>{if(was<=i*.22&&RUN.litT>i*.22){snd(784+i*196,.12,0,'triangle',.05);burst(l.x,l.y+8,'#ffd94d',6,26)}})}
 for(const q of RUN.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt}RUN.parts=RUN.parts.filter(q=>q.life>0);
 for(const t of RUN.texts){t.y-=16*dt;t.t-=dt}RUN.texts=RUN.texts.filter(t=>t.t>0);
 if(RUN.trail){for(const tr of RUN.trail)tr.t-=dt;RUN.trail=RUN.trail.filter(tr=>tr.t>0)}}

/* ---------------- drawing: hub & screens ---------------- */
function drawPlayerSpr(x,y,scale){scale=scale||1;const spr=P3.ay<-.4?SP.pu:P3.ax<-.4?SP.pl:P3.ax>.4?SP.pr:SP.pd;
 const hop=Math.hypot(P3.vx||0,P3.vy||0)>12&&((P3.anim|0)%2)?-1:0;g.save();g.translate(Math.round(x)-6*scale,Math.round(y)-11*scale+hop);g.scale(scale,scale);g.drawImage(spr,0,0);g.restore();
 r('rgba(0,0,0,.25)',Math.round(x)-5,Math.round(y)+1,10,2);}
/* ---------------- the Hearth's furniture ----------------
   The five stations are real pieces of furniture against the back wall, and each of the cast has a corner with their things. */
const RDHUB={
 mirror:SPRG(['....gggggg','..ggbbbbbbgg','.gbbwbbbbbbbg','.gbwwbbbbbbbg','gbbwbbbbbbbbbg','gbbbbbbbbbbbbg','gbbbbbbbbbbbbg','gbbbbbbbbbbbbg','gbbbbbbbbbbwbg','.gbbbbbbbbwbg','.gbbbbbbbbbbg','..ggbbbbbbgg','....gggggg','......dd','......dd','....dddddd'],{g:'#d8a838',b:'#8ac8e8',w:'#ffffff',d:'#6a4428'}),
 books:SPRG(['dddddddddddddddd','drrbbgyyprrbbggd','drrbbgyyprrbbggd','drrbbgyyprrbbggd','dddddddddddddddd','dggyyrrpbbyyggrd','dggyyrrpbbyyggrd','dggyyrrpbbyyggrd','dddddddddddddddd','dbbpprryyggbbppd','dbbpprryyggbbppd','dbbpprryyggbbppd','dddddddddddddddd','dd............dd'],{d:'#5a3a20',r:'#c84858',b:'#4878c8',g:'#58a858',y:'#e8c868',p:'#a070e8'}),
 gate:SPRG(['...tt.tttt.tt','..trrtrrrrtrrt','.trrrrrrrrrrrrt','trrr........rrrt','trr..........rrt','trr..........rrt','trr..........rrt','trr..........rrt','trr..........rrt','trr..........rrt','trrr........rrrt','tttttttttttttttt'],{t:'#3a2414',r:'#6e4a2a'}),
 beanbag:SPRG(['....bbbbbb','..bbBBbbbbbb','.bBBbbbbbbbbb','bBbbbbbbbbbbbb','bbbbbbbbbbbbbb','bbbbbbbbbbbbbd','.bbbbbbbbbbbdd','..dddddddddd'],{b:'#3858a8',B:'#6888d0',d:'#24386a'}),
 dogbed:SPRG(['..oooooooooo','.oOOOOOOOOOOo','oOccccccccccOo','oOccccccccccOo','.oOOOOOOOOOOo','..oooooooooo'],{o:'#8a5a30',O:'#c87848',c:'#f0d8b0'}),
 globe:SPRG(['...ww','..wbbw','.wbgbbw','.wbbgbw','..wbbw','...dd','..dddd'],{w:'#5a3a20',b:'#4878c8',g:'#58a858',d:'#6a4428'}),
 bedroll:SPRG(['..gggggggggg','.gGGGGGGGGGgg','gGGggggggggGGg','gggggggggggggg','.rrrrrrrrrrrr'],{g:'#4a7a3a',G:'#6a9a58',r:'#8a5a30'})};
function rdDrawStation(s){const x=s.x,base=54,lk=s.id==='heat'&&RD.stats.escapes<1;r('rgba(0,0,0,.3)',x-11,base-1,22,3);
 if(s.id==='mirror')rdDrawDigs(x,base);
 else if(s.id==='arm'){r('#3a2414',x-12,base-24,24,20);r('#7a4a28',x-11,base-23,22,18);r('#5a3a20',x-11,base-16,22,1);r('#c8a04a',x-8,base-21,2,2);r('#c8a04a',x,base-21,2,2);r('#c8a04a',x+7,base-21,2,2);
  const own=id=>rdOwnsWeapon(id);g.save();g.translate(x-6,base-6);g.rotate(-Math.PI/2);g.drawImage(RDWPN.blade.ol,0,-3);g.restore();
  g.save();if(!own('maul'))g.globalAlpha=.3;g.translate(x+1,base-5);g.rotate(-Math.PI/2);g.drawImage(RDWPN.maul.ol,0,-4,15,7);g.restore();
  g.save();if(!own('bow'))g.globalAlpha=.3;g.strokeStyle='#8a5e36';g.lineWidth=2;g.beginPath();g.arc(x+7,base-13,7,-1.3,1.3);g.stroke();g.strokeStyle='#e8e4f5';g.lineWidth=1;g.beginPath();g.moveTo(x+9,base-20);g.lineTo(x+9,base-6);g.stroke();g.restore();
  r('#5a3a20',x-12,base-4,24,4)}
 else if(s.id==='keep'){r('#3a2414',x-13,base-26,26,24);r('#7a4a28',x-12,base-25,24,22);r('#5a3a20',x-12,base-14,24,2);r('#5a3a20',x-12,base-4,24,2);
  const K=[['flower','#f8a0c8'],['collar','#e04040'],['stone','#a8b0c0'],['charm','#58c048'],['jar','#7fd0e8']];
  K.forEach(([id,c],i)=>{const has=RD.keeps&&RD.keeps[id],kx=x-10+(i%3)*8,ky=i<3?base-20:base-10;g.save();if(!has)g.globalAlpha=.25;r(c,kx,ky,5,5);r('#ffffff',kx+1,ky+1,1,1);if(RD.keepEq===id){r('#ffd94d',kx-1,ky+6,7,1)}g.restore()})}
 else if(s.id==='codex'){const sp=RDHUB.books;g.drawImage(sp.ol,x-(sp.ow>>1),base-sp.oh);r('#f8f0d8',x-6,base-sp.oh-4,12,5);r('#5c2438',x-1,base-sp.oh-4,2,5);r('#281c30',x-5,base-sp.oh-3,3,1);r('#281c30',x+2,base-sp.oh-3,3,1)}
 else if(s.id==='heat'){const sp=RDHUB.gate;g.save();if(lk)g.globalAlpha=.55;g.drawImage(sp.ol,x-(sp.ow>>1),base-sp.oh);g.restore();
  if(lk){r('#c8a04a',x-2,base-12,5,4);r('#c8a04a',x-1,base-14,3,2)}else{g.save();g.globalAlpha=.45+.25*Math.sin(time*4);r('#f07830',x-5,base-15,10,10);g.restore();r('#f8d030',x-3,base-10,2,2);r('#f8d030',x+2,base-10,2,2)}}}
/* the cast's corners */
function rdDrawCorners(HL){const pr=(sp,x,y)=>{r('rgba(0,0,0,.25)',x-(sp.ow>>1)+1,y-1,sp.ow-2,2);g.drawImage(sp.ol,x-(sp.ow>>1),y-sp.oh)};
 /* Erin: her watering can beside the bed */
 r('#98a0b0',72,HL.bedY+18,7,6);r('#c8d0dc',73,HL.bedY+19,4,2);r('#98a0b0',79,HL.bedY+17,3,1);r('#98a0b0',70,HL.bedY+19,2,3);
 /* Marcus: a beanbag, a little rug, his own mug */
 g.save();g.globalAlpha=.6;r('#5a2a3a',186,HL.gloomY-4,46,30);g.restore();pr(RDHUB.beanbag,212,HL.gloomY+16);
 r('#f8f0d8',194,HL.gloomY+12,4,5);r('#e07a20',194,HL.gloomY+14,4,2);r('#f8f0d8',198,HL.gloomY+13,1,2);
 /* Louie: his bed on the rug */
 pr(RDHUB.dogbed,W/2,HL.rugY+24);
 /* Scout: books stacked by the desk, a globe */
 r('#c84858',40,HL.deskY+4,8,3);r('#4878c8',41,HL.deskY+1,7,3);r('#e8c868',40,HL.deskY-2,8,3);pr(RDHUB.globe,52,HL.deskY+6);
 /* Ranger: a bedroll and a lantern on the crate */
 pr(RDHUB.bedroll,180,HL.campY+30);r('#3a2c1c',202,HL.campY-8,5,6);r('#ffd94d',203,HL.campY-7,3,4);}

/* ---------------- dialogue that grows with you ----------------
   Topics unlock at milestones (falls, depth, bosses, escapes, heat, sprouts found) and as keepers are unlocked
   and played (the keeper log, RD.kstats). Talking to someone plays their oldest new topic once; a "!" over their
   head means they have one. After that they go back to their usual lines. */
function ks(id){RD.kstats=RD.kstats||{};return RD.kstats[id]||(RD.kstats[id]={runs:0,kills:0,best:0,deaths:0,esc:0})}
/* read a keeper's log without creating one */
const ksR=id=>(RD.kstats&&RD.kstats[id])||{runs:0,kills:0,best:0,deaths:0,esc:0};
const RDTALK=(()=>{const S=()=>RD.stats,F=()=>RD.flags,K=ksR,U=id=>charUnlocked(id),best=()=>RD.stats.best||0,heat=()=>Math.max(heatTotal(),0);return[
 /* Erin */
 {id:'e_fall',who:'ERIN',when:()=>S().deaths>=1,lines:["You came back up! Covered in dirt, but up.","That's how it goes down there. You fall, you wake up here, you keep the Moondew. Then you go again."]},
 {id:'e_ch4',who:'ERIN',when:()=>best()>=4,lines:["You reached the Grub Mother's nest. I could hear her from up here.","She guards the way down. Take sprouts with you. They hate her too."]},
 {id:'e_mother',who:'ERIN',when:()=>F().kill_mother,lines:["The Grub Mother's gone quiet. The bed's been sprouting all morning.","I think the garden knows."]},
 {id:'e_vault',who:'ERIN',when:()=>best()>=5,lines:["Water down there? Under the garden? That explains the soggy carrots."]},
 {id:'e_unlock',who:'ERIN',when:()=>U('ERIN'),lines:["You kept bringing me honey, so... I'm coming down with you. If you want.","Pick me when you go down the Burrow. My buds fight harder for me."]},
 {id:'e_dived',who:'ERIN',when:()=>K('ERIN').runs>=1,lines:["I went down there! It's so loud. Everything wants to eat you.","My buds were amazing, though. Did you see them? You saw them."]},
 {id:'e_core',who:'ERIN',when:()=>best()>=9,lines:["Scout says it gets hot near the bottom. Ember-hot. Take a DEW bud with you. Trust me."]},
 {id:'e_escape',who:'ERIN',when:()=>S().escapes>=1,lines:["You did it. The Lantern's brighter. I can see it from the bed.","Don't stop now, though. Whatever's down there will grow back."]},
 {id:'e_king',who:'ERIN',when:()=>U('KING'),lines:["A sprout with a crown, Will. In my bed. He's very polite.","He calls the others 'my court'. They love it."]},
 {id:'e_heat',who:'ERIN',when:()=>heat()>=1,lines:["Marcus talked you into the Pact, didn't he. Be careful. Heat makes the deep meaner."]},
 /* Marcus */
 {id:'m_fall',who:'MARCUS',when:()=>S().deaths>=1,lines:["Bro. BRO. You died in like a minute. I timed it.","The Digs are right there, J. Buy something. Make it make sense."]},
 {id:'m_ch4',who:'MARCUS',when:()=>best()>=4,lines:["Heard you met the Grub Mother, bro. She's a worm. With a crown. I'd have won."]},
 {id:'m_mother',who:'MARCUS',when:()=>F().kill_mother,lines:["You beat the worm queen? Okay. Okay, bro. That's fine. I could've. But fine."]},
 {id:'m_unlock',who:'MARCUS',when:()=>U('MARCUS'),lines:["Eight falls, bro. EIGHT. I'm going down there myself.","Pick me at the Burrow. I'll show you how it's done. Hydro Jet, baby."]},
 {id:'m_dived',who:'MARCUS',when:()=>K('MARCUS').runs>=1,lines:["Went down. It was fine. I let it win, bro. Strategy.","Don't look at the Codex. The Codex lies."]},
 {id:'m_louie',who:'MARCUS',when:()=>K('LOUIE').kills>=50,lines:["The dog has more kills than you now, bro. Think about that. The DOG."]},
 {id:'m_deaths10',who:'MARCUS',when:()=>S().deaths>=10,lines:["Ten falls, J. I made a chart. It only goes down."]},
 {id:'m_escape',who:'MARCUS',when:()=>S().escapes>=1,lines:["You escaped? Bro, I was about to come get you. Literally putting my shoes on.","Now do it with heat. Unless you're scared. You're scared."]},
 {id:'m_king',who:'MARCUS',when:()=>U('KING'),lines:["The salad has a crown, bro. A CROWN. Who approved this."]},
 {id:'m_heat',who:'MARCUS',when:()=>heat()>=3,lines:["Heat three? Look at you, bro. Still a J, though. A hot J."]},
 /* Scout */
 {id:'s_fall',who:'SCOUT',when:()=>S().deaths>=1,lines:["Field note: the keeper fell. Recovery time: immediate. Fascinating!","Every run fills in the Codex. It's the bookcase on the back wall."]},
 {id:'s_vault',who:'SCOUT',when:()=>best()>=5,lines:["You found standing water under the Burrows! I have so many questions. Mostly about the crabs."]},
 {id:'s_erin',who:'SCOUT',when:()=>K('ERIN').runs>=1,lines:["Erin's buds hit fifty percent harder. I measured. She glared at the ruler."]},
 {id:'s_hundred',who:'SCOUT',when:()=>S().kills>=100,lines:["One hundred foes catalogued as 'defeated'! Your column in the Codex is getting long."]},
 {id:'s_louie',who:'SCOUT',when:()=>K('LOUIE').runs>=1,lines:["Louie dove! His Zooms are faster than my pencil. My notes are mostly smudges."]},
 {id:'s_found25',who:'SCOUT',when:()=>(S().sproutsFound||0)>=25,lines:["Twenty-five sprouts found in the deep! Every one went into the Ledger. Science AND gardening."]},
 {id:'s_core',who:'SCOUT',when:()=>best()>=9,lines:["Ember Core temperature: very. That's the whole note. Very."]},
 {id:'s_king',who:'SCOUT',when:()=>U('KING'),lines:["The Sprout King! A new species! Well. A new title. I'm updating everything."]},
 /* Ranger */
 {id:'r_fall',who:'RANGER',when:()=>S().deaths>=1,lines:["Fell, did you. Good. Now you know the ground."]},
 {id:'r_mother',who:'RANGER',when:()=>F().kill_mother,lines:["Grub Mother's dead. Her children will be angrier for it. Watch the Burrows."]},
 {id:'r_vault',who:'RANGER',when:()=>best()>=5,lines:["Water rooms. When a crab shines, don't swing into the shell."]},
 {id:'r_marcus',who:'RANGER',when:()=>K('MARCUS').runs>=1,lines:["Saw Marcus come back up. Says he 'let it win'. His boots were on fire."]},
 {id:'r_escape',who:'RANGER',when:()=>S().escapes>=1,lines:["You came out the bottom and back up. Not many have. Don't get comfortable."]},
 {id:'r_heat5',who:'RANGER',when:()=>heat()>=5,lines:["Heat five. The deep remembers you now. That's not a compliment."]},
 /* Louie */
 {id:'l_fall',who:'LOUIE',when:()=>S().deaths>=1,lines:["WHINE. (He was worried. He's sniffing you for injuries. And snacks.)"]},
 {id:'l_unlock',who:'LOUIE',when:()=>U('LOUIE'),lines:["WOOF WOOF! (He's packed his own stick. He's coming down with you now.)"]},
 {id:'l_dived',who:'LOUIE',when:()=>K('LOUIE').runs>=1,lines:["ZOOM. (He did a Zoom Zoom Zoom down there. He'd like to talk about it. He can't.)"]},
 {id:'l_escape',who:'LOUIE',when:()=>S().escapes>=1,lines:["AWOOO! (Victory howl. The whole Hearth heard it.)"]}]})();
/* when newer news makes an older topic stale (the Grub Mother dead, not just found), the older one is skipped */
const RDSTALE={e_ch4:'e_mother',m_ch4:'m_mother'};
function rdTopic(who){RD.heard=RD.heard||{};for(const t of RDTALK)if(t.who===who&&!RD.heard[t.id]){let ok=false;try{ok=t.when()}catch(e){}if(!ok)continue;
  const nw=RDSTALE[t.id]&&RDTALK.find(q=>q.id===RDSTALE[t.id]);let newer=false;try{newer=!!(nw&&!RD.heard[nw.id]&&nw.when())}catch(e){}if(newer){RD.heard[t.id]=1;continue}return t}return null}

/* ---------------- first-run tips, one at a time, when they matter ---------------- */
function rdTips(dt){if(RUN.tip){RUN.tip.t-=dt;if(RUN.tip.t<=0)RUN.tip=null;return}
 const F=RD.flags,show=(id,txt)=>{if(F[id])return false;F[id]=1;RUN.tip={txt,t:4.2};rdSave();return true};
 /* a tip for something you've already done is no use: felling foes means you know A attacks */
 if(RUN.kills>=2&&!F.tip_atk)F.tip_atk=1;
 if(RUN.chamber===1&&RUN.time>.6&&show('tip_move','MOVE WITH THE D-PAD'))return;
 if(RUN.enemies.some(e=>Math.hypot(e.x-P3.x,e.y-P3.y)<75)&&show('tip_atk','A: ATTACK. IT AIMS ITSELF'))return;
 if(RUN.hurtOnce&&show('tip_dash','DOUBLE-TAP A DIRECTION: DASH'))return;
 if((RUN.pods||[]).length&&show('tip_pod','WALK OVER A SPROUT TO PICK IT UP'))return;
 if(RUN.kills>=1&&show('tip_spec','X AND Y: YOUR SPECIAL MOVES'))return;
 if(RUN.kills>=3&&show('tip_cast','B: A BOLT OF LANTERN LIGHT'))return;
 if((RUN.sup||0)>=100&&show('tip_super','SUPER IS FULL: PRESS B'))return;
 if(RUN.phase==='doors'&&show('tip_door','WALK INTO A DOOR TO CLAIM IT'))return;}
function rdDrawTip(){if(!RUN||!RUN.tip)return;const t=RUN.tip,a=Math.min(1,t.t*3,(4.2-t.t)*4),w=tw(t.txt,1)+16,x=Math.round((W-w)/2),y=H-32;
 g.save();g.globalAlpha=Math.max(0,a);r('#181020',x-1,y-1,w+2,15);r('#2e2450',x,y,w,13);r('#ffd94d',x,y,3,13);text(t.txt,x+10,y+3,1,'#fff3b0',null);g.restore()}

/* what each of them is doing at their station */
function rdNpcJob(who,x,y){if(who==='ERIN'){r('#98a0b0',x+5,y-9,5,4);r('#98a0b0',x+10,y-10,2,1);for(let i=0;i<3;i++){const p=(time*2+i*.33)%1;r('#7fd0e8',x+12+i,Math.round(y-9+p*10),1,2)}}
 else if(who==='SCOUT'){r('#f8f0d8',x+5,y-8,6,5);r('#281c30',x+6,y-7,4,1);if(((time*6)|0)%2)r('#281c30',x+6,y-5,3,1);r('#c8a04a',x+10,y-10,1,4)}
 else if(who==='RANGER'){r('#d8c8a0',x-11,y-9,7,5);r('#8a6a40',x-10,y-7,5,1);r('#e84a5f',x-7,y-8,1,1)}
 else{r('#fff3b0',x-1,y-25,2,2);if(((time*6)|0)%2)r('#ffd94d',x+3,y-22,1,1)}}
/* Marcus only mentions Waterworks once it exists in Sprouts: the MAKING WAVES achievement (saved for good),
   or the project finished in the valley you're playing now. A line can be a [before, after] pair. */
function rdWaterworks(){try{const i=ACH.findIndex(a=>a[0]==='MAKING WAVES');if(i>=0&&meta&&meta.ach&&meta.ach[i])return true;return !!(run&&pjDone(PJ[0]))}catch(e){return false}}
const rdLn=e=>Array.isArray(e)?e[rdWaterworks()?1:0]:e;
/* little things they say to themselves in the Hearth */
const RDBARK={MARCUS:['bro.',"you're a J.",'stop J-lighting me',['big ideas, bro','waterworks 2.0'],'team deep.'],ERIN:['hi, keeper!','water, water...',"they're growing!"],
 SCOUT:['fascinating.','page 41...','noted. noted.'],RANGER:['paths shift.','stay sharp.','hm.'],LOUIE:['WOOF','*snore*','arf!']};
let hubBark=null,hubBarkT=3;
function rdDrawNPC(who,x,y,bob){r('rgba(0,0,0,.25)',Math.round(x)-5,Math.round(y)+1,10,2);rdDrawKeeper(who,x,y+2+(bob||0),1);
 if(who!=='LOUIE'&&state!=='g3cine'&&state!=='g3talk'){const w2=tw(who,1)+6,tx=Math.round(x-w2/2),ty=Math.round(y)+4;r('#181020',tx-1,ty-1,w2+2,11);r(RDCPLATE[who]||'#3a3050',tx,ty,w2,9);text(who,tx+3,ty,1,'#ffffff',null)}}
function rdVig(){for(let i=0;i<3;i++){const a='rgba(4,2,8,'+(0.10-i*0.03)+')',o=i*5;
 r(a,0,o,W,5);r(a,0,H-o-5,W,5);r(a,o,0,5,H);r(a,W-o-5,0,5,H)}}
function drawHub(){rdTiles();const A=rdArt();r('#1d141f',0,0,W,H);
 /* the Hearth is a valley house dug into the earth: Sprouts' own wood floor, an earth wall behind the stations */
 for(let ty=30;ty<H;ty+=16)for(let tx=0;tx<W;tx+=16)g.drawImage(A.hubWood,tx,ty);
 for(let tx=0;tx<W;tx+=16){g.drawImage(A.B[0].wall,tx,14);g.drawImage(A.B[0].wall,tx,30)}r('rgba(0,0,0,.35)',0,46,W,2);
 /* shelves between the stations: jars of dew, seed packets, Scout's books */
 for(const sx of[50,93,136,179]){r('#5a3a20',sx-9,24,18,2);/* upper shelf only */r('#3a2414',sx-9,26,18,1);r('#7fd0e8',sx-7,19,3,5);r('#e6f7ff',sx-7,19,1,1);r('#a8f080',sx-2,20,4,4);r('#c84858',sx+3,18,2,6);r('#e8c868',sx+5,19,2,5);
}
 r('#2e1c16',0,14,6,H);r('#2e1c16',W-6,14,6,H);r('#4b3228',5,46,1,H-46);r('#4b3228',W-6,46,1,H-46);
 for(let y=60;y<H-20;y+=37){r('#6e4a2a',1,y,2,9);r('#6e4a2a',W-3,y+14,2,9)}
 {const fy=hubY(.47),fl=((time*10)|0)%2;
  /* the fireplace on the left wall */
  r('#3a3238',2,fy-14,26,30);r('#5a5058',2,fy-16,28,4);r('#4a4048',4,fy-12,22,26);r('#1a1218',8,fy-6,14,20);
  for(let i=0;i<4;i++){r('#6a6068',4+i*6,fy-16,4,2)}r('#f07830',10,fy+4-fl,10,10+fl);r('#f8d030',12,fy+7,6,7);r('#fff3b0',14,fy+9+fl,2,4);
  /* the window on the right wall: the sprout garden, glowing, with little heads bobbing past */
  r('#5a3a20',W-30,fy-14,26,26);r('#1c3828',W-27,fy-11,20,20);g.save();g.globalAlpha=.55+.15*Math.sin(time*2);r('#58b858',W-27,fy+1,20,8);g.restore();
  for(let i=0;i<3;i++){const bx=W-25+((time*6+i*7)%18);r(['#f07830','#48a0f0','#f0d020'][i],Math.round(bx),fy+1-((((time*4)|0)+i)%2),3,3)}
  r('#5a3a20',W-18,fy-11,2,20);r('#5a3a20',W-27,fy-2,20,2);}
 const HL=hubL();
 /* the hearth rug in the middle of the hall: a border, a field, a row of diamonds, fringe */
 {const rx=W/2-56,ry=HL.rugY;r('#3a1622',rx,ry,112,32);r('#7a2e40',rx+1,ry+1,110,30);r('#c8a04a',rx+3,ry+3,106,1);r('#c8a04a',rx+3,ry+28,106,1);r('#c8a04a',rx+3,ry+3,1,26);r('#c8a04a',rx+108,ry+3,1,26);
  r('#8e3a4e',rx+5,ry+5,102,22);for(let i=0;i<8;i++){const cx=rx+12+i*13,cy=ry+16;r('#c8a04a',cx,cy-3,1,1);r('#c8a04a',cx-1,cy-2,3,1);r('#e8c868',cx-2,cy-1,5,1);r('#c8a04a',cx-1,cy,3,1);r('#c8a04a',cx,cy+1,1,1)}
  for(let i=0;i<7;i++){r('#d8c8a8',rx-3,ry+3+i*4,3,1);r('#d8c8a8',rx+112,ry+3+i*4,3,1)}}
 /* the Great Lantern, hanging over the hearth */
 g.save();g.globalAlpha=.10+.02*Math.sin(time*2);g.fillStyle='#ffd94d';g.beginPath();g.arc(W/2,10,14,0,7);g.fill();g.restore();
 r('#3a2c1c',W/2-5,1,10,11);r('#ffd94d',W/2-3,3,6,6);r('#fff3b0',W/2-1,4,2,3);
 for(const tx2 of[6,228]){r('#3a2c22',tx2,26,4,10);const fl=1+Math.sin(time*9+tx2);
  g.save();g.globalAlpha=.10+.03*fl;g.fillStyle='#f8a040';g.beginPath();g.arc(tx2+2,24,9,0,7);g.fill();g.restore();
  r('#f07830',tx2+1,20+Math.round(fl*.6),2,4);r('#f8d030',tx2+1,22+Math.round(fl*.6),2,2)}
 for(const s of STATIONS)rdDrawStation(s);

 const pr=(k,x,y)=>{const sp=RDPROPS[k];r('rgba(0,0,0,.3)',x-8,y+sp.h-1,16,2);g.drawImage(sp.ol,x-(sp.ow>>1),y-1)};
 /* Erin's sprout bed (upper left): soil in a wooden frame, with your banked buds sleeping in it */
 {const by=HL.bedY;r('#3a2415',14,by,54,28);for(let i=0;i<4;i++)for(let j=0;j<2;j++)g.drawImage(TL.soil,0,0,i<3?16:2,j?6:16,16+i*16,by+4+j*16,i<3?16:2,j?6:16);
  r('#7a4a28',14,by,54,3);r('#5a3a20',14,by+25,54,3);r('#7a4a28',14,by,2,28);r('#7a4a28',66,by,2,28);r('#a06a38',14,by,54,1);
  const flat=[];for(let ty=0;ty<6;ty++)for(let i=0;i<(RD.bank[ty]||0);i++)flat.push(ty);
  flat.slice(0,10).forEach((ty,i)=>drawBud({x:21+(i%5)*10+ox,y:by+22+((i/5)|0)*11-11+oy,type:ty,stage:2,z:0,a:i*1.3+ty,mv:false,st:'idle',fx:1}));
  pr('plant',80,by-10);}
 /* Marcus's corner (upper right): a dim patch, a crate to sulk on */
 rdDrawCorners(HL);
 /* Scout's desk (lower left) and Ranger's camp (lower right) */
 pr('table',28,HL.deskY);pr('plant',16,HL.deskY+26);
 pr('crate',204,HL.campY);pr('crate',220,HL.campY+12);pr('plant',226,HL.campY-18);
 pr('plant',16,H-42);pr('plant',224,H-42);
 for(const who of NPCS){const n=HUBNPC[who],x=n?n.x:NPCPOS[who][0],y=n?n.y:hubY(NPCPOS[who][1]),mv=n&&n.wait<=0;
  rdDrawNPC(who,x,y,mv?-(((time*8)|0)%2):-(((time*1.3+x*.1)|0)%2));
  if(n&&n.act>0)rdNpcJob(who,Math.round(x),Math.round(y));
  if(state==='g3hub'&&rdTopic(who)){const bx=Math.round(x),by=Math.round(y)-30-Math.round(Math.abs(Math.sin(time*4))*2);r('#181020',bx-3,by-1,7,11);r('#ffd94d',bx-2,by,5,9);r('#181020',bx,by+1,1,4);r('#181020',bx,by+7,1,1)}}
 if(hubBark&&state==='g3hub'){const n=HUBNPC[hubBark.who];if(n){const bw=tw(hubBark.txt,1)+8,bx=Math.max(4,Math.min(W-4-bw,Math.round(n.x-bw/2))),by=Math.round(n.y)-38;
  r('#181020',bx-1,by-1,bw+2,13);r('#f8f0d8',bx,by,bw,11);r('#f8f0d8',Math.round(n.x)-1,by+11,3,2);r('#181020',Math.round(n.x)-2,by+11,1,2);r('#181020',Math.round(n.x)+2,by+11,1,2);r('#f8f0d8',Math.round(n.x),by+13,1,1);
  text(hubBark.txt,bx+4,by+1,1,'#281c30',null)}}
 /* root door */
 g.save();g.globalAlpha=.16+.05*Math.sin(time*3);g.fillStyle='#58f0c0';g.beginPath();g.arc(W/2,H-20,18,0,7);g.fill();g.restore();
 rdDrawBurrowHatch(W/2,H-10);
 if(state!=='g3talk'&&state!=='g3hpause')text('THE BURROW',Math.round(W/2-tw('THE BURROW',1)/2),H-9,1,'#f8c070',null);
 r('rgba(0,0,0,.25)',Math.round(P3.x)-5,Math.round(P3.y)+1,10,2);drawPlayerSpr(P3.x,P3.y+2,1);
 /* warm, cozy light: the hearth lantern, the torches, the root door, and you */
 rdLight([{x:W/2,y:12,r:70,c:'#ffd27a'},{x:8,y:24,r:34,c:'#f8a040'},{x:230,y:24,r:34,c:'#f8a040'},{x:W/2,y:H-17,r:30,c:'#58f0c0'},{x:P3.x,y:P3.y-6,r:56,c:'#ffd27a'},{x:W/2,y:HL.rugY+16,r:46,c:'#f8a040'},{x:41,y:HL.bedY+14,r:30,c:'#a8f080'},{x:30,y:HL.deskY,r:26,c:'#f8a040'},{x:16,y:hubY(.47)+6,r:48,c:'#f8a040'},{x:W-17,y:hubY(.47),r:30,c:'#a8f080'}],'rgba(14,6,22,.34)');
 for(const st2 of STATIONS){const lk=st2.id==='heat'&&RD.stats.escapes<1;text(st2.l,Math.round(st2.x-tw(st2.l,1)/2),57,1,lk?'#6a6284':'#f8f0d8','#181020')}
 /* top bar */
 r('rgba(10,6,16,.9)',0,0,W,15);text('DEW '+RD.dew,4,2,1,'#7fd0e8',null);
 text('KEYS '+RD.keys,64,2,1,'#f8d030',null);text('HONEY '+RD.honey,112,2,1,'#f8a0c8',null);
 if(RD.stats.escapes)rtext('ESCAPES '+RD.stats.escapes,W-4,2,1,'#f8c070',null);
 if(hubMsg){const w=tw(hubMsg,2)+12;r('rgba(10,6,16,.88)',Math.round((W-w)/2),H-38,w,15);ctext(hubMsg,H-37,2,'#ffd94d')}
 {const ob=rdObjective();if(ob&&state==='g3hub'){const tw2=tw(ob.t,1)+14;r('#181020',4,16,tw2+2,13);r('#2e2450',5,17,tw2,11);r('#a070e8',5,17,3,11);text(ob.t,11,18,1,'#fff3b0',null);
  let mx=null,my=null;if(ob.who&&HUBNPC[ob.who]){mx=HUBNPC[ob.who].x;my=HUBNPC[ob.who].y-28}else if(ob.door){mx=W/2;my=H-40}else if(ob.st){const st3=STATIONS.find(q=>q.id===ob.st);if(st3){mx=st3.x;my=72}}
  if(mx!==null){const b=Math.round(Math.abs(Math.sin(time*4))*3);r('#181020',Math.round(mx)-4,my-b-1,9,4);r('#ffd94d',Math.round(mx)-3,my-b,7,2);r('#ffd94d',Math.round(mx)-2,my-b+2,5,1);r('#ffd94d',Math.round(mx)-1,my-b+3,3,1);r('#ffd94d',Math.round(mx),my-b+4,1,1)}}}
 if(state==='g3talk'&&talkNPC){
  const ls=wrapPx(talkTxt,222,1),nl=Math.max(2,Math.min(4,ls.length)),bh=nl*11+26,by=H-4-bh;r('#181020',4,by,W-8,bh);r('#f8f0d8',5,by+1,W-10,bh-2);
  const nw=tw(talkNPC,2)+10;r('#181020',8,by-7,nw+2,14);r(RDCPLATE[talkNPC]||'#b8304a',9,by-6,nw,12);text(talkNPC,14,by-4,2,'#ffffff',null);
  ls.slice(0,4).forEach((l,i)=>text(l,10,by+10+i*11,1,'#281c30',null));r('#e0d4b8',10,H-20,W-20,1);
  const more=talkNPC&&!!rdTalkL&&talkStart+talkLine<rdTalkL.length-1;
  text((more?'A: MORE ▼':'A: BYE')+' · B: BYE'+(RD.honey>0?' · START: GIFT ('+RD.honey+')':''),10,H-16,1,'#7a6a8a',null);}}
function rowsPlain(items,y,step){items.forEach((s,i)=>text(s,10,y+i*step,1,'#c8c0d8',null));}
function rowsDraw2(items,sel,desc){const step=items.length>6?15:17,y0=items.length>6?40:44;
 items.forEach((it,i)=>{const yy=y0+i*step,on=i===sel;
 if(on){r('#f8e060',6,yy-2,W-12,step-2);r('#281c30',7,yy-1,W-14,step-4)}
 text(it.a,10,yy+(step>15?2:1),1,on?'#ffffff':'#c8c0d8',on?null:'#181020');
 if(it.b)rtext(it.b,W-10,yy+(step>15?2:1),1,on?'#ffd94d':'#8d84a8',on?null:'#181020');});
 if(desc)wrapPx(desc,222,1).slice(0,2).forEach((l,i)=>ctext(l,H-44+i*11,1,'#a89ec2',null));}
function screenShell(title,sub){r('#120c1c',0,0,W,H);ctext(title,8,3,'#ffd94d','#403010');
 if(sub)ctext(sub,26,1,'#a89ec2',null);}
function g3DrawUI(){const M=RD;
 if(state==='g3set'){screenShell('SETTINGS','SHARED WITH THE CONSOLE');
  const pips=v=>'●'.repeat(v)+'○'.repeat(10-v);
  const lan=RDLANTERNS.find(l=>l[1]===rdLanternC())||RDLANTERNS[0],nl=RDLANTERNS.filter((l,i)=>i===0||rdCapHas(c=>c.lan===l[1])).length;
  rowsDraw2([{a:'MUSIC VOL  '+pips(M.set.mus),b:M.set.mus+' / 10'},{a:'SFX VOL  '+pips(M.set.sfx),b:M.set.sfx+' / 10'},{a:'SCREEN SHAKE',b:M.set.shake?'ON':'OFF'},{a:'LANTERN COLOUR',b:lan[0]}],uiSel,['The lantern hum, low under everything.','Every slash, beep and bloom.','The screen kicks when you take a hit.',nl>1?'The colour of your light down there.':'More lantern colours come from Sprouts capsules.'][uiSel]);
  ctext('◀ ▶ ADJUST · A: CYCLE    B: BACK',H-13,1,'#8d84a8',null);return}
 if(state==='g3sprouts'){drawSprouts();return}
 if(state==='g3mirror'){screenShell('THE SPROUT DIGS','MOONDEW: '+M.dew);
  rowsDraw2(MIRROR.map(m=>{const rank=mir(m.id);return{a:m.n+'  '+'●'.repeat(rank)+'○'.repeat(m.max-rank),b:rank>=m.max?'MAX':m.cost[rank]+' DEW'}}),uiSel,MIRROR[uiSel].d.replace(/\.?\s*$/,'.')+' Dug with Moondew, kept forever.');
  ctext('A: DIG DEEPER    B: BACK',H-11,1,'#8d84a8',null);return}
 if(state==='g3arm'){screenShell('THE ARMORY','KEYS: '+M.keys);
  rowsDraw2(Object.keys(WEAPONS).map(id=>{const w=WEAPONS[id],own=rdOwnsWeapon(id);
   return{a:(M.weapon===id?'* ':'')+w.n,b:own?'OWNED':w.cost+' KEYS'}}),uiSel,WEAPONS[Object.keys(WEAPONS)[uiSel]].d);
  ctext('A: EQUIP / UNLOCK    B: BACK',H-13,1,'#8d84a8',null);return}
 if(state==='g3keep'){screenShell('KEEPSAKE SHELF','ONE AT A TIME · LEVELS BY USE');
  rowsDraw2(KEEPS.map(k=>{const own=M.keeps[k.id];return{a:(M.keepEq===k.id?'* ':'')+k.n,b:own?'Lv'+keepLv(k.who)+' · '+(M.keepXp[k.who]||0)+'/50':'GIFT '+k.who}}),uiSel,KEEPS[uiSel].d);
  ctext('A: EQUIP / REMOVE    B: BACK',H-13,1,'#8d84a8',null);return}
 if(state==='g3codex'){screenShell('CODEX OF THE DEEP','◀ ▶ PAGES · B: BACK');
  if(codexPage===0)rowsPlain(['RUNS '+M.stats.runs+'   DEATHS '+M.stats.deaths,'ESCAPES '+M.stats.escapes+'   CHAMBERS '+M.stats.chambers,'FOES FELLED '+M.stats.kills+'   BOSSES '+M.stats.bosses,'SPROUTS FOUND '+(M.stats.sproutsFound||0)+'   DEEPEST '+(M.stats.best||0),'HEAT NOW '+heatTotal(),'WEAPON: '+WEAPONS[M.weapon].n,'KEEPSAKE: '+(M.keepEq?((KEEPS.find(k=>k.id===M.keepEq)||{}).n):'NONE')],46,15);
  else if(codexPage===1){const seen=Object.keys(FOES).filter(k=>M.seen[k]);const boss=Object.keys(BOSSES).filter(i=>M.seen[BOSSES[i].id]);
   rowsPlain(['FOES MET '+seen.length+' / '+Object.keys(FOES).length].concat(seen.map(k=>FOES[k].n)).concat(['BOSSES MET '+boss.length+' / 3']).concat(boss.map(i=>BOSSES[i].n)),46,13)}
  else if(codexPage===3){const rows=['KEEPERS: RUNS · FOES · DEEPEST · ESC',''];for(const c of CHARS){const k=ksR(c.id);if(!charUnlocked(c.id)&&!k.runs)continue;rows.push((c.n||c.id)+'   '+k.runs+' · '+k.kills+' · '+k.best+' · '+k.esc)}rowsPlain(rows,46,14)}
  else rowsPlain(['BOONS DISCOVERED: '+Object.keys(M.boonSeen).length,'','THE GODS:'].concat(GODIDS.map(g=>GODS[g].n+' — '+GODS[g].t)),46,14);
  return}
 if(state==='g3heat'){screenShell('THE PACT OF ROOTS','TOTAL HEAT: '+heatTotal());
  if(RD.stats.escapes<1){ctext('SEALED. ESCAPE ONCE TO OPEN.',60,2,'#8d84a8');ctext('A: BACK',90,1,'#8d84a8',null);return}
  rowsDraw2(PACT.map(px=>({a:px.n+'  '+'●'.repeat(RD.pact[px.id]||0)+'○'.repeat(px.max-(RD.pact[px.id]||0)),b:''})),heatSel,PACT[heatSel].d+' Bosses pay Dew bounties at new heat.');
  ctext('◀ ▶ ADJUST    B: BACK',H-13,1,'#ffd94d',null);return}
 if(state==='g3boon'){r('#0d0a18',0,0,W,H);const god=boonOffer[0]?boonOffer[0].god:'EMBER';
  ctext(GODS[god].n+' SPEAKS',6,3,GODS[god].l,'#181020');ctext('"'+GODS[god].t+' OFFERS:"',26,1,'#a89ec2',null);
  /* cards size to the screen; descriptions only print as many lines as fit inside the card */
  const n=boonOffer.length||1,need=Math.max(1,Math.min(3,Math.max(...boonOffer.map(b=>wrapPx(boonDesc(b),208,1).length)))),ch2=Math.max(32,Math.min(Math.floor((H-62)/n)-4,31+need*10)),nl=Math.max(1,Math.floor((ch2-30)/10));
  boonOffer.forEach((b,i)=>{const y=40+i*(ch2+4),on=i===uiSel,gc=GODS[b.god]||GODS.EMBER;
   r(on?'#f8e060':'#241c38',8,y,W-16,ch2);r(on?'#fff3b0':'#2e2450',9,y+1,W-18,ch2-2);r(gc.c,9,y+1,4,ch2-2);
   text(boonName(b),17,y+3,2,on?'#281c30':'#e8e4f5',null);
   text((b.kind==='core'?b.slot.toUpperCase()+' BOON':b.kind==='duo'?'DUO BOON':'PASSIVE')+' · '+b.rarN+' · Lv'+b.level,17,y+17,1,on?'#5a4a28':'#a89ec2',null);
   const dl=wrapPx(boonDesc(b),208,1);dl.slice(0,nl).forEach((l,j)=>text(j===nl-1&&dl.length>nl?l.replace(/\s*\S*$/,'…'):l,17,y+28+j*10,1,on?'#281c30':'#c8c0d8',null));});
  ctext(RD.stats.runs<=2?'BOONS LAST FOR THIS RUN.   A: ACCEPT':'A: ACCEPT',H-13,1,'#8d84a8',null);return}
 if(state==='g3shop'){screenShell('A ROOT-TOOTHS STALL','PETALS: '+RUN.petals);
  rowsDraw2(shopItems.map(it=>({a:it.n,b:it.sold?'SOLD':it.p+'p'})).concat([{a:'LEAVE — ONWARD',b:''}]),uiSel,uiSel<shopItems.length?shopItems[uiSel].d:'Back below. The dark is waiting.');
  ctext('A: BUY    B: LEAVE',H-13,1,'#8d84a8',null);return}
 if(state==='g3pause'){r('rgba(8,5,14,.92)',0,0,W,H);
  if(pausePage===1){ctext('YOUR BUILD',8,3,'#ffd94d');
   const bs=[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean);
   rowsPlain(bs.length?bs.map(b=>boonName(b)+' · '+(b.kind==='core'?b.slot.toUpperCase():b.kind==='duo'?'DUO':'PASS')+' Lv'+b.level+' '+b.rarN):['NO BOONS YET. THE GODS WATCH.'],36,13);
   const s=rdStats();ctext('DMG x'+s.dmgMul.toFixed(2)+'  CRIT '+Math.round(s.crit*100)+'%  ARMOR '+Math.round(s.armor*100)+'%',H-26,1,'#a8f080',null);
   ctext('B: BACK',H-14,1,'#8d84a8',null);return}
  ctext('PAUSED',10,4,'#ffd94d');ctext('CHAMBER '+RUN.chamber+' · '+BIOMES[RUN.biome].n,38,1,'#a89ec2',null);
  const ps=H>=220?19:15,py0=52;
  drawList(['RESUME','BUILD','SETTINGS','SAVE & QUIT','ABANDON RUN','SWAP CARTRIDGE'],pauseSel,py0,ps);
  ctext(pauseSel===3?'SAVED AT THE START OF THIS CHAMBER':pauseSel===5?'YOUR RUN IS SAVED FIRST':'PETALS '+RUN.petals+' · DEW '+RUN.dew+' · KEYS '+RUN.keys,Math.min(H-24,py0+6*ps+8),1,pauseSel===3||pauseSel===5?'#a8f080':'#c8c0d8',null);
  if(H>=220){const mv=RDMOVES[RUN.char||'WILL'];let ly=py0+6*ps+24;
   for(const k of['x','y']){if(ly+12>H-6)break;rdChip(k.toUpperCase(),40,ly);text(mv[k].n,56,ly+2,1,'#ffd94d',null);ly+=14}
   if(ly+12<=H-6){r('#0d0a14',40,ly,13,11);r('#c87a20',41,ly+1,11,9);text('S',44,ly+2,1,'#ffffff',null);text(mv.su.n+' (B WHEN FULL)',56,ly+2,1,'#ffd94d',null)}}
  return}}

/* ---------------- drawing: the RUN ---------------- */
const DOORICON={boon:'✦',petals:'✿',dew:'☾',fruit:'☀',heart:'♥',shop:'⚖',fountain:'≈',honey:'⬢'};
/* a cached dark copy of a sprite (the Hollow Keeper wears your shadow) */
const RDSHADOW=new Map();
function rdShadowOf(im){let c=RDSHADOW.get(im);if(c)return c;c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
 x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(20,12,34,.78)';x.fillRect(0,0,c.width,c.height);RDSHADOW.set(im,c);return c}
/* foes at exactly 1x; elites wear a gold outline; the Hollow Keeper is Will's own sprite at an exact 2x, in shadow */
function rdDrawFoe(e){const x=Math.round(e.x),y=Math.round(e.y),k=e.kind;
 if(k==='boss'&&e.bossIx===2){const im=SP.pd,w2=im.width*2,h2=im.height*2;r('rgba(0,0,0,.3)',x-9,y+e.r-1,18,3);
  g.save();g.globalAlpha=.22+.08*Math.sin(time*3);g.fillStyle='#b8a8e8';g.beginPath();g.arc(x,y+e.r-h2/2,h2*.55,0,7);g.fill();g.restore();
  g.save();g.translate(x-(w2>>1),y+e.r-h2+2);g.scale(2,2);g.drawImage(rdShadowOf(im),0,0);
  if(e.flash>0){g.globalAlpha=.5;r('#ffffff',0,0,im.width,im.height)}g.restore();
  r('#e8e4f5',x-4,y+e.r-h2+10,2,2);r('#e8e4f5',x+2,y+e.r-h2+10,2,2);return}
 const spr=k==='boss'?RDFOE[e.bossIx===0?'mother':'king']:RDFOE[k];if(!spr)return;
 const S=k==='boss'?2:1,dw=spr.ow*S,dh=spr.oh*S,bob=k==='boss'?0:Math.round(Math.sin(time*3+e.x*.5)*.6),dx=x-(dw>>1),dy=y+e.r-dh+2+bob;
 r('rgba(0,0,0,.28)',x-((dw*.36)|0),y+e.r,((dw*.72)|0),2*S);
 g.save();if(e.face<0){g.translate(x,0);g.scale(-1,1);g.translate(-x,0)}
 g.translate(dx,dy);g.scale(S,S);g.drawImage(e.flash>0?spr.hol:e.elite?spr.gol:spr.ol,0,0);g.restore();
 if(k==='crab'&&e.state===1){g.save();g.globalAlpha=.35;g.fillStyle='#bdeffb';g.beginPath();g.arc(x,y-2,e.r+6,0,7);g.fill();g.restore()}
 if(e.chill>0){g.save();g.globalAlpha=.3;g.fillStyle='#a8d8ff';g.beginPath();g.arc(x,y-3,e.r+2,0,7);g.fill();g.restore()}
 if(e.root>0&&k!=='boss'&&((time*6)|0)%2)r('#fff3b0',x-1,dy-4,2,2);
 /* telegraphs: a foe about to attack says so */
 const d2=Math.hypot(P3.x-e.x,P3.y-e.y);
 if((k==='spitter'||k==='wisp')&&e.cd<.35&&e.cd>0&&(k==='wisp'||d2<125)){g.save();g.globalAlpha=.5+.4*Math.sin(time*40);g.strokeStyle='#ff7a6b';g.lineWidth=1;g.beginPath();g.arc(x,y-4,e.r+3+(.35-e.cd)*10,0,7);g.stroke();g.restore()}
 if((k==='beetle'||k==='boss'&&e.bossIx===0)&&e.state===1){const an=Math.atan2(P3.y-e.y,P3.x-e.x);g.save();g.globalAlpha=.6;for(let i=1;i<7;i++)if(((time*20+i)|0)%2)r('#ff7a6b',Math.round(e.x+Math.cos(an)*i*9)-1,Math.round(e.y+Math.sin(an)*i*9)-1,3,3);g.restore()}
 if(k==='shade'&&e.cd<.3&&e.cd>0&&d2>26){const a=Math.atan2(e.y-P3.y,e.x-P3.x),bx=P3.x+Math.cos(a)*20,by=P3.y+Math.sin(a)*20;for(let i=0;i<4;i++)r('#a898d8',Math.round(bx+Math.cos(time*9+i*1.6)*5),Math.round(by-4+Math.sin(time*9+i*1.6)*4),1,1)}
 if(k==='boss'&&e.bossIx===1&&e.state===1){g.save();g.globalAlpha=.4+.3*Math.sin(time*30);g.strokeStyle='#ff7a6b';g.lineWidth=2;g.beginPath();g.arc(e.tx,e.ty,26,0,7);g.stroke();g.restore()}
 if(e.burn>0&&((time*8)|0)%2)r('#f07830',x-2,dy-3,3,3);
 if(e.hp<e.max&&k!=='boss'){r('#181020',x-9,dy-5,18,3);r('#e84a5f',x-8,dy-4,Math.round(16*Math.max(0,e.hp/e.max)),1)}}
/* bg=true draws only the room (under the pause menu): no labels, numbers or HUD */
function drawRun(bg){const B=BIOMES[RUN.biome],A=rdArt(),AB=A.B[RUN.biome],shx=RD.set.shake&&RUN.shake?R(-RUN.shake,RUN.shake)*.5:0,shy=RD.set.shake&&RUN.shake?R(-RUN.shake,RUN.shake)*.5:0;
 g.save();g.translate(Math.round(shx),Math.round(shy));
 /* floor: 16px tiles, variant picked by a stable hash so a chamber never flickers */
 for(let ty=RDA.top-16;ty<H;ty+=16)for(let tx=0;tx<W;tx+=16){const hsh=((tx*7+ty*13+RUN.chamber*31)>>4)%9;g.drawImage(AB.floor[hsh<6?0:hsh<8?1:2],tx,ty)}
 /* the top wall: a 16px face with a dark lip, then the side and bottom walls */
 for(let tx=0;tx<W;tx+=16)g.drawImage(AB.wall,tx,RDA.top-16);
 r('rgba(0,0,0,.35)',0,RDA.top,W,2);
 r(AB.side,0,RDA.top-16,RDA.side,H);r(AB.sideHi,RDA.side-1,RDA.top,1,H-RDA.top-RDA.bot);
 r(AB.side,W-RDA.side,RDA.top-16,RDA.side,H);r(AB.sideHi,W-RDA.side,RDA.top,1,H-RDA.top-RDA.bot);
 r(AB.side,0,H-RDA.bot,W,RDA.bot);r(AB.sideHi,RDA.side,H-RDA.bot,W-RDA.side*2,1);
 /* wall lanterns: dark while you fight, relit one by one when the chamber is cleared */
 RUN.lamps.forEach((l,i)=>{const on=RUN.phase==='doors'&&RUN.litT>i*.22,sp=on?A.P.lampOn:A.P.lampOff;g.drawImage(sp.ol,l.x-(sp.ow>>1),l.y)});
 /* reward doors: burrow arches cut into the wall, rimmed in the reward's colour */
 if(RUN.phase==='doors')for(const d of RUN.doors){const x=Math.round(d.x),gc=d.kind==='boon'?GODS[d.god].c:'#c8a04a',top=RDA.top-16;
  r('#0b0812',x-11,top+2,22,15);r('#0b0812',x-9,top,18,2);
  r(gc,x-12,top+3,2,13);r(gc,x+10,top+3,2,13);r(gc,x-10,top+1,2,2);r(gc,x+8,top+1,2,2);r(gc,x-8,top-1,16,2);
  g.save();g.globalAlpha=.25+.15*Math.sin(time*4+x);r(gc,x-9,top+3,18,13);g.restore();
  if(!bg)text(DOORICON[d.kind]||'?',x-3,top+4,2,'#ffd94d',null);
  if(!bg){const lbl=d.kind==='boon'?GODS[d.god].n:d.kind.toUpperCase();text(lbl,Math.round(x-tw(lbl,1)/2),RDA.top+2,1,'#e8e4f5','#181020')}}
 /* a little scattered debris, then the props (drawn back to front) */
 for(let i=0;i<7;i++){const dx2=RDA.side+8+(i*97+RUN.chamber*31)%(W-RDA.side*2-16),dy2=RDA.top+8+((i*57+RUN.chamber*19)%(H-RDA.top-RDA.bot-20)),db=DEBBY[RUN.biome][i%DEBBY[RUN.biome].length];
  g.drawImage(db.ol,dx2-(db.ow>>1),dy2)}
 for(const o of RUN.obst.slice().sort((a,b)=>a.gy-b.gy)){const sp=A.P[o.kind]||A.P.boulderE;
  r('rgba(0,0,0,.28)',o.gx+2,o.gy+13,12,3);g.drawImage(sp.ol,o.gx+8-(sp.ow>>1),o.gy+16-sp.oh)}
 rdDrawInts();
 for(const z of RUN.zones){g.save();g.globalAlpha=.3+.1*Math.sin(time*9);g.fillStyle='#f07830';g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.fill();g.restore()}
 for(const h of RUN.hazards){g.save();g.globalAlpha=.35+.3*Math.sin(time*16);g.strokeStyle=h.geyser?'#7fd0e8':h.from==='player'?'#dce2ea':'#ff7a6b';g.lineWidth=2;
  g.beginPath();g.arc(h.x,h.y,h.r,0,7);g.stroke();g.restore()}
 for(const pd of RUN.pods||[]){g.save();g.globalAlpha=.3+.18*Math.sin(time*4+pd.x);g.fillStyle='#a8f080';g.beginPath();g.arc(pd.x,pd.y-2,8+Math.sin(time*4+pd.x)*1.5,0,7);g.fill();g.restore();
  drawSprout({x:pd.x+ox,y:pd.y+oy+Math.round(Math.sin(time*3+pd.x)*1),type:pd.type,age:.2});
  if(((time*2+pd.x)|0)%2)r('#ffffff',Math.round(pd.x)+4,Math.round(pd.y)-11,1,1)}
 for(const p of RUN.pickups){const spr=RDSPR[p.kind],x=Math.round(p.x),y=Math.round(p.y)+Math.round(Math.sin(time*5+p.x)*1);
  if(spr){g.drawImage(spr.ol,Math.round(x-spr.ow/2),Math.round(y-spr.oh/2));
   if(p.kind==='dew'){g.save();g.globalAlpha=.25+.12*Math.sin(time*6);g.fillStyle='#7fd0e8';g.beginPath();g.arc(x,y,6,0,7);g.fill();g.restore()}}
  else r('#f8a0c8',x-1,y-1,3,3)}
 for(const e of RUN.enemies)rdDrawFoe(e);
 /* move effects drawn under the actors: flash rings, the laser, leash, pillars, geysers */
 for(const f of RUN.fx){const k=f.t/f.max;g.save();
  if(f.k==='flash'){g.globalAlpha=.7*k;g.fillStyle='#ffffff';g.beginPath();g.arc(f.x,f.y,f.r*(1.15-.35*k),0,7);g.fill();}
  else if(f.k==='beam'){const ex=f.x+f.ax*f.len,ey=f.y+f.ay*f.len;g.lineCap='round';
   g.globalAlpha=.35+.4*k;g.strokeStyle='#ffd94d';g.lineWidth=10*k+4;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(ex,ey);g.stroke();
   g.globalAlpha=.5+.5*k;g.strokeStyle='#ffffff';g.lineWidth=3;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(ex,ey);g.stroke();
   if(((time*20)|0)%2){g.fillStyle='#f8a0c8';for(let i=1;i<6;i++)g.fillRect(Math.round(f.x+f.ax*f.len*i/6+R(-5,5)),Math.round(f.y+f.ay*f.len*i/6+R(-5,5)),2,2)}}
  else if(f.k==='whistle'){g.globalAlpha=k;g.strokeStyle=f.dust?'#d8c0a0':'#a8f080';g.lineWidth=2;g.beginPath();g.arc(f.x,f.y,8+70*(1-k),0,7);g.stroke();g.globalAlpha=k*.6;g.beginPath();g.arc(f.x,f.y,4+40*(1-k),0,7);g.stroke()}
  else if(f.k==='leash'){g.globalAlpha=Math.min(1,k*1.6);g.strokeStyle='#8a5a2c';g.lineWidth=2;g.beginPath();g.moveTo(P3.x,P3.y-6);g.lineTo(f.x,f.y-4);g.stroke();r('#c8a04a',Math.round(f.x)-2,Math.round(f.y)-6,4,4)}
  else if(f.k==='pillar'){const arm=f.tick>0&&f.hits===4;
   if(arm){g.globalAlpha=.5+.4*Math.sin(time*30);g.strokeStyle='#fff3b0';g.lineWidth=1;g.beginPath();g.arc(f.x,f.y,9,0,7);g.stroke()}
   else{g.globalAlpha=Math.min(1,k*2);g.fillStyle='#fff3b0';g.fillRect(Math.round(f.x)-5,22,10,Math.round(f.y)-20);g.fillStyle='#ffffff';g.fillRect(Math.round(f.x)-2,22,4,Math.round(f.y)-20);
    g.globalAlpha=.4*k;g.fillStyle='#ffd94d';g.beginPath();g.arc(f.x,f.y,13,0,7);g.fill()}}
  else if(f.k==='geyser'){const hh=Math.round(34*Math.sin(Math.PI*(1-k)));g.globalAlpha=.9;
   r('#7fd0e8',Math.round(f.x)-5,Math.round(f.y)-hh,10,hh);r('#e6f7ff',Math.round(f.x)-2,Math.round(f.y)-hh,4,hh);r('#bdeffb',Math.round(f.x)-7,Math.round(f.y)-hh-3,14,4)}
  g.restore()}
 for(const p of RUN.projs){if(p.delay>0)continue;const c={arrow:'#b0f090',thorn:'#b0f090',fire:'#f07830',wave:'#7fd0e8',vine:'#58c048',wild:'#f078c0',laser:'#ffd94d',jet:'#7fd0e8',towel:'#f8f0d8',bolt:'#ffd94d'}[p.kind]||'#fff';
  if(p.kind==='stampede'){drawBud({x:p.x+ox,y:p.y+oy,type:p.bud,stage:2,z:0,a:time*9+p.bud,mv:true,st:'follow',fx:p.vx>=0?1:-1});continue}
  if(p.kind==='cloud'){g.save();g.globalAlpha=.75;for(let i=0;i<5;i++){const a=i*1.26+time*1.5;g.fillStyle=i%2?'#c8c0d8':'#e8e4f5';g.beginPath();g.arc(p.x+Math.cos(a)*6,p.y-4+Math.sin(a)*3,5,0,7);g.fill()}g.restore();continue}
  if(p.kind==='towel'){r('#181020',Math.round(p.x)-6,Math.round(p.y)-3,12,6);r(c,Math.round(p.x)-5,Math.round(p.y)-2,10,4);r('#7fd0e8',Math.round(p.x)-5,Math.round(p.y),10,1);continue}
  if(p.kind==='wave'){r(c,Math.round(p.x)-3,Math.round(p.y)-4,6,8);r('#e6f7ff',Math.round(p.x)-1,Math.round(p.y)-2,2,4)}
  else if(p.kind==='fire'){r(c,Math.round(p.x)-3,Math.round(p.y)-3,6,6);r('#f8d030',Math.round(p.x)-1,Math.round(p.y)-1,3,3)}
  else if(p.kind==='laser'||p.kind==='bolt'){r(c,Math.round(p.x)-3,Math.round(p.y)-3,6,6);r('#ffffff',Math.round(p.x)-1,Math.round(p.y)-1,3,3)}
  else r(c,Math.round(p.x)-2,Math.round(p.y)-1,4,2)}
 for(const p of RUN.eprojs){r('#ff7a6b',Math.round(p.x)-2,Math.round(p.y)-2,4,4);r('#ffd0c8',Math.round(p.x)-1,Math.round(p.y)-1,1,1)}
 /* player */
 if(RUN.trail&&RUN.char==='WILL')for(const tr of RUN.trail){g.save();g.globalAlpha=.3*(tr.t/.22);const tspr=tr.ay<-.4?SP.pu:tr.ax<-.4?SP.pl:tr.ax>.4?SP.pr:SP.pd;g.drawImage(tspr,Math.round(tr.x)-(tspr.width>>1),Math.round(tr.y)-tspr.height+3);g.restore()}
 if(RUN.rush&&RUN.rush.kind==='bike'){const u=RUN.rush,d=Math.hypot(u.vx,u.vy)||1,bx=u.vx/d,by=u.vy/d,cx=Math.round(P3.x),cy=Math.round(P3.y)+2;
  g.save();g.strokeStyle='#181020';g.lineWidth=2;for(const s2 of[-1,1]){g.beginPath();g.arc(cx+bx*7*s2,cy+by*4*s2,4,0,7);g.stroke()}
  g.strokeStyle='#d83030';g.beginPath();g.moveTo(cx-bx*7,cy-by*4);g.lineTo(cx,cy-3);g.lineTo(cx+bx*7,cy+by*4);g.stroke();g.restore()}
 const dying=state==='g3dying';
 if(!dying){r('rgba(0,0,0,.28)',Math.round(P3.x)-5,Math.round(P3.y)+1,10,2);
 rdDrawAtk(false);
 {const[lx,ly]=rdAtkLunge();if(!(RUN.inv>0&&RUN.dashT<=0&&!RUN.rush&&RUN.hurtT<=0&&((time*12)|0)%2))rdDrawKeeper(RUN.char||'WILL',P3.x+lx,P3.y+2+ly,P3.ax)}
 rdDrawAtk(true);}
 /* the bud string; thrown buds arc through the air; in BLOOM OF KINGS every bud is an exact 2x */
 if(!dying)for(const b of RUN.buds||[]){const big=RUN.bloomT>0;if(big){g.save();g.translate(b.x,b.y);g.scale(2,2);g.translate(-b.x,-b.y)}
  drawBud({x:b.x+ox,y:b.y+oy,type:b.type,stage:2,z:b.z||0,a:b.a,mv:true,st:'follow',fx:b.fx||1});
  if(big)g.restore();if(b.temp&&((time*6)|0)%2)r('#ffd94d',Math.round(b.x),Math.round(b.y)-12-(big?10:0),1,1)}
 /* the Lantern's light. Darker while you fight; the relit wall lanterns open the room up */
 {const L=[{x:P3.x,y:P3.y-6,r:86,c:rdLanternC()}],GL=A.GLOW;
  RUN.lamps.forEach((l,i)=>{if(RUN.phase==='doors'&&RUN.litT>i*.22)L.push({x:l.x,y:l.y+8,r:Math.min(64,(RUN.litT-i*.22)*180),c:'#ffd27a'})});
  for(const o of RUN.obst){const gw=GL[o.kind];if(gw)L.push({x:o.gx+8,y:o.gy+8,r:gw[1]+Math.sin(time*2+o.gx)*1.5,c:gw[0]})}
  for(const e of RUN.enemies){if(e.kind==='wisp'||e.burn>0)L.push({x:e.x,y:e.y-4,r:18,c:'#f8a040'});else if(e.kind==='boss')L.push({x:e.x,y:e.y-10,r:e.bossIx===2?44:40,a:.75,c:e.bossIx===2?'#b8a8e8':null})}
  for(const pd of RUN.pods||[])L.push({x:pd.x,y:pd.y-4,r:20,c:'#a8f080'});
  for(const it of RUN.ints||[]){if(it.k==='boom'&&!it.done)L.push({x:it.x,y:it.y-6,r:it.fuse>0?26:14,c:'#f878a8'});else if(it.k==='sprout'&&!it.done)L.push({x:it.x,y:it.y-4,r:12,c:'#a8f080'});else if(it.k==='chest'&&it.done)L.push({x:it.x,y:it.y-6,r:18,c:'#f8d030'})}
  if(RUN.phase==='doors')for(const d of RUN.doors)L.push({x:d.x,y:RDA.top-2,r:30,c:d.kind==='boon'?GODS[d.god].c:'#ffd94d'});
  for(const pr of RUN.projs)if(!(pr.delay>0))L.push({x:pr.x,y:pr.y,r:pr.kind==='fire'?16:11,c:pr.kind==='fire'?'#f8a040':'#fff3b0'});
  for(const pr of RUN.eprojs)L.push({x:pr.x,y:pr.y,r:10,c:'#ff7a6b'});
  for(const z of RUN.zones)L.push({x:z.x,y:z.y,r:z.r+8,c:'#f8a040'});
  for(const f of RUN.fx){const k=f.t/f.max;if(f.k==='flash')L.push({x:f.x,y:f.y,r:90*k,c:'#ffffff'});else if(f.k==='beam')L.push({x:f.x+f.ax*f.len/2,y:f.y+f.ay*f.len/2,r:f.len/2,a:k,c:'#ffd94d'});
   else if(f.k==='pillar'&&!(f.tick>0&&f.hits===4))L.push({x:f.x,y:f.y,r:30,a:k,c:'#fff3b0'});else if(f.k==='geyser')L.push({x:f.x,y:f.y-10,r:24,a:k,c:'#bdeffb'})}
  if(RUN.bloomT>0)for(const b of RUN.buds)L.push({x:b.x,y:b.y-6,r:16,c:'#a8f080'});
  rdLight(L,RUN.phase==='doors'?'rgba(14,6,22,'+Math.max(.2,.46-RUN.litT*.35)+')':AB.dark);}
 {const top=RDA.top,span=H-top-RDA.bot;for(let i=0;i<16;i++){
  if(RUN.biome===0){const y=top+((((i*37-time*7)%span)+span)%span),x=Math.round((i*53+Math.sin(time*.7+i)*8+W)%W);r('rgba(232,208,176,.32)',x,Math.round(y),1,1)}
  else if(RUN.biome===1){const y=top+((time*55+i*29)%span),x=(i*61+7)%W;r('rgba(160,215,245,.45)',x,Math.round(y),1,3)}
  else{const y=H-RDA.bot-((time*18+i*31)%span),x=Math.round((i*47+Math.sin(time+i)*6+W)%W);r(i%3?'rgba(248,160,64,.75)':'rgba(248,216,96,.8)',x,Math.round(y),1,1)}}}
 for(const q of RUN.parts)r(q.c,Math.round(q.x),Math.round(q.y),2,2);
 for(const f of RUN.fx)if(f.k==='coin'){const k=f.t/f.max,w=Math.max(1,Math.round(Math.abs(Math.cos(time*28))*4)),cy=Math.round(f.y-10*(1-k));
  r('#181020',Math.round(f.x)-w-1,cy-1,2*w+3,8);r(k<.4?(f.win?'#f8d030':'#8d84a8'):'#f8d030',Math.round(f.x)-w,cy,2*w+1,6)}
 if(!bg)for(const t of RUN.texts)text(t.txt,Math.round(t.x-tw(t.txt,1)/2),Math.round(t.y),1,t.c,null);
 g.restore();if(bg)return;
 /* HUD */
 if(RUN.hurtT>0){const a=(RUN.hurtT/.28)*.45;g.save();g.globalAlpha=a;r('#e84a5f',0,0,W,4);r('#e84a5f',0,H-4,W,4);r('#e84a5f',0,0,4,H);r('#e84a5f',W-4,0,4,H);g.restore()}
 const s=rdStats();r('rgba(8,5,14,.88)',0,0,W,20);r('#c22e4a',0,20,W,1);
 r('#0d0a14',3,3,60,14);r('#3a1420',4,4,58,12);r(RUN.hp/s.maxHp<.3?'#e84a5f':'#58c048',4,4,Math.round(58*Math.max(0,RUN.hp/s.maxHp)),12);r('rgba(255,255,255,.18)',4,4,Math.round(58*Math.max(0,RUN.hp/s.maxHp)),2);
 {const hs=Math.ceil(RUN.hp)+'/'+s.maxHp;text(hs,Math.round(33-tw(hs,1)/2),6,1,'#ffffff','#181020')}
 /* X and Y: the keeper's specials, same colours as the console buttons; they fill back up as they cool down */
 const mvs=RDMOVES[RUN.char||'WILL'],sbtn=(x,l,cd,mx)=>{const rd=cd<=0,f=rd?1:Math.max(0,1-cd/mx),c=RDBTN[l];
  r('#0d0a14',x,3,13,15);r('#2a2440',x+1,4,11,13);const fh=Math.round(13*f);r(c,x+1,17-fh,11,fh);
  text(l,x+4,5,1,rd?'#ffffff':'#8d84a8',rd?'#181020':null)};
 sbtn(66,'X',RUN.xCd,mvs.x.cd);sbtn(81,'Y',RUN.yCd,mvs.y.cd);
 /* the super meter: full means B fires the super */
 const sf=Math.min(1,(RUN.sup||0)/100),full=sf>=1;r('#0d0a14',97,5,42,9);r('#2a2440',98,6,40,7);
 r(full?(((time*6)|0)%2?'#ffd94d':'#f8a040'):'#c87a20',98,6,Math.round(40*sf),7);
 if(full)text('SUPER',103,5,1,'#281c30',null);else text('SUP',107,5,1,'rgba(255,255,255,.55)',null);
 let px2=143;const pip=(n,mx,c)=>{for(let i=0;i<mx;i++){r('#0d0a14',px2+i*6,6,5,7);r(i<n?c:'#3a3350',px2+i*6+1,7,3,5)}px2+=mx*6+4};
 pip(RUN.castAmmo,1+(hasKeep('stone')?1:0),'#7fd0e8');pip(RUN.dashCharges,s.dashCharges,'#ffd94d');
 const rt='✿'+RUN.petals+' ☾'+RUN.dew+(RUN.heat?' ♨'+RUN.heat:'');rtext(rt,W-4,3,1,'#f8c8e0',null);
 text('CH '+RUN.chamber+'/12 · '+B.n,4,H-11,1,'#a89ec2',null);
 rdDrawTip();
 if(RUN.boss&&RUN.boss.hp>0){const bw=150,bx=(W-bw)/2;r('#ffb0a0',bx-1,23,bw+2,10);r('#181020',bx,24,bw,8);r('#c22e4a',bx+1,25,Math.round((bw-2)*Math.max(0,RUN.boss.hp/RUN.boss.max)),6);
  ctext(BOSSES[RUN.boss.bossIx].n,34,1,'#ffb0a0',null)}
 if(RUN.zoneT>0)ctext(B.n,Math.round(H*.3),3,'#fff8e0','#181020');
 if(say2T>0&&!(RUN.cutT>0))ctext(say2Txt,Math.round(H*.42),2,'#ffd94d');
 /* super cut-in: the keeper slides in on a band with the move's name */
 if(RUN.cutT>0){const k=RUN.cutT/.7,by=Math.round(H*.36),slide=Math.round(Math.max(0,k-.75)*4*W);
  r('rgba(8,5,14,.55)',0,22,W,H-22);r('#181020',0,by-2,W,46);r('#c87a20',0,by,W,42);r('#f8a040',0,by,W,2);r('#7a3c10',0,by+40,W,2);
  for(let i=0;i<8;i++)r('rgba(255,243,176,.35)',((i*37+time*400)%(W+40))-20,by+6+((i*11)%30),18,1);
  rdKeeperSpr(RUN.char||'WILL',36-slide,by+38,2);
  text('SUPER!',70+slide,by+5,1,'#fff3b0','#7a3c10');text(RUN.cutN,70+slide,by+17,2,'#ffffff','#7a3c10');}}

/* ---------------- title / death / escape ---------------- */
function drawMenu(){drawTitle();const it=rdMenuItems().map((k,i)=>k==='NEW GAME'&&newArm&&i===menuSel?'A AGAIN: ERASE SAVE':k),n=it.length,st=17,top=H-30-n*st;
 r('rgba(8,5,14,.82)',W/2-70,top-8,140,n*st+12);r('#ffd94d',W/2-70,top-8,140,1);drawList(it,menuSel,top,st);
 const c=RD.ckpt;if(c&&menuSel===0&&rdHasSave())ctext('SAVED RUN: '+((CHARS.find(x=>x.id===c.char)||{}).n||c.char)+', CHAMBER '+c.chamber,top-22,1,'#a8f080',null);}
function drawTitle(){const gl=Math.round(H*.13);
 /* above: the valley at night with the Great Lantern; below: the earth, roots and sprouts, down to the root door */
 r('#101838',0,0,W,gl);for(let i=0;i<22;i++)r(i%5?'#8090c8':'#ffffff',(i*53+17)%240,(i*29+5)%Math.max(8,gl-10),1,1);
 g.fillStyle='#182848';g.beginPath();g.arc(40,gl+10,40,0,7);g.arc(200,gl+16,56,0,7);g.fill();
 const band=[['#3b2620',0],['#34211f',.18],['#2b1b20',.38],['#21141f',.6],['#170e18',.82]];band.forEach(([c,q])=>r(c,0,gl+Math.round((H-gl)*q),W,H));
 r('#58b858',0,gl-4,W,6);r('#3c9848',0,gl+1,W,2);for(let i=0;i<20;i++)r('#84d870',(i*29+3)%W,gl-3+(i%3),2,1);
 {const so=ox,sy=oy,sh=shards;shards=4;g.save();g.translate(W/2,gl-1);ox=HX;oy=HY;drawHearth();g.restore();ox=so;oy=sy;shards=sh}
 g.save();g.globalAlpha=.14+.04*Math.sin(time*2);g.fillStyle='#ffd94d';g.beginPath();g.arc(W/2,gl-10,26,0,7);g.fill();g.restore();
 /* roots wandering down from the grass */
 for(let k=0;k<9;k++){const x0=12+k*27,len=Math.round((H-gl)*(.25+((k*37)%60)/100));for(let y=0;y<len;y+=2){const x=Math.round(x0+Math.sin(y*.07+k)*5+Math.sin(y*.021+k*2)*8);r(y<len*.6?'#6e4a2a':'#5a3a24',x,gl+3+y,y<len*.5?2:1,2)}}
 for(let i=0;i<16;i++)r('#4e3530',(i*61+11)%W,gl+12+((i*47)%(H-gl-30)),3,2);
 /* sprouts sleeping in the dark, each with a little glow */
 [[34,.52,0],[206,.46,2],[64,.74,3],[180,.7,5],[120,.86,1]].forEach(([x,q,t2],i)=>{const y=Math.round(gl+(H-gl)*q*.8);g.save();g.globalAlpha=.25+.1*Math.sin(time*2+i);g.fillStyle='#a8f080';g.beginPath();g.arc(x,y-4,9,0,7);g.fill();g.restore();
  drawBud({x:x+ox,y:y+oy,type:t2,stage:2,z:0,a:time*1.5+i,mv:false,st:'idle',fx:1})});
 for(let i=0;i<10;i++){const p=(time*.06+i*.1)%1;r('rgba(232,208,176,'+(.4*(1-p)).toFixed(2)+')',Math.round((i*47+Math.sin(time+i)*6)%W),Math.round(H-20-p*(H-gl-30)),1,1)}
 const ly=Math.round(H*.34);ctext('ROOTDEEP',ly+3,5,'#181020',null);ctext('ROOTDEEP',ly,5,'#ffd94d','#403010');
 for(let x=0;x<W;x+=8){const hh=6+((x*13)%7);r('#080510',x,H-14-hh,8,14+hh)}
 r('#080510',0,H-16,W,16);
 g.save();g.globalAlpha=.3+.1*Math.sin(time*3);g.fillStyle='#58f0c0';g.beginPath();g.arc(W/2,H-17,7,0,7);g.fill();g.restore();
 r('#0a1a20',W/2-4,H-23,8,12);g.fillStyle='#0a1a20';g.beginPath();g.arc(W/2,H-23,4,Math.PI,0);g.fill();r('#6e4a2a',W/2-6,H-24,2,13);r('#6e4a2a',W/2+4,H-24,2,13);
 if(RD.stats.runs&&state!=='g3menu')ctext('RUNS '+RD.stats.runs+' · ESCAPES '+RD.stats.escapes,H-40,1,'#6a6284',null);
 if(state!=='g3menu'&&((time*2)|0)%2)ctext('PRESS A',H-31,2,'#ffffff');
 if(state!=='g3menu')ctext('B OR SELECT: SWAP CARTRIDGE',H-11,1,'#565064',null);}

function drawOver(win){r(win?'#141a10':'#180a10',0,0,W,H);const L=RD.lastRun||{chamber:0,kills:0,dew:0,petals:0,heat:0},kp=RD.char||'WILL';
 /* a small stage on tall screens: the keeper down in the dark with Erin's rope coming, or dawn over the valley */
 const S0=H>=250?Math.min(120,H-160):0;
 if(S0){const S=RSTG.base(S0);
  if(win){S.sky('dawn');S.hills('dawn');S.lantern(150,1,4);S.keeper(kp,96,2,1);[70,118].forEach((x,i)=>S.bud(x,i+2,1,3));S.dog(178,1,true,-1)}
  else{S.cave();const lx=W/2+26,rope=Math.round((S.GY-30)*Math.min(1,overT/2.5));
   if(kp==='LOUIE'){/* Louie lies belly-up, paws in the air */const sp=LOU.l[0];g.save();g.translate(W/2-4,S.GY-2);g.scale(2,-2);g.drawImage(sp,-(sp.width>>1),0);g.restore()}
   else{g.save();g.translate(W/2-4,S.GY-2);g.rotate(-Math.PI/2);const sp=kp==='KING'?RDKING.ol:kp==='WILL'||!CH[kp]?SP.pd:CH[kp];g.drawImage(sp,-sp.width,-sp.height,sp.width*2,sp.height*2);g.restore()}
   const fl=.35+.15*Math.sin(time*7);g.save();g.globalAlpha=fl;g.fillStyle='#ffd94d';g.beginPath();g.arc(W/2-34,S.GY-6,10,0,7);g.fill();g.restore();r('#3a2c1c',W/2-37,S.GY-10,7,9);r('#806030',W/2-35,S.GY-8,3,5);
   r('#c8a878',lx,0,1,rope);if(rope>4){g.save();g.globalAlpha=.4;g.fillStyle='#ffd27a';g.beginPath();g.arc(lx,rope,9,0,7);g.fill();g.restore();r('#ffd94d',lx-2,rope-2,5,5)}}
  r(win?'#141a10':'#180a10',0,S0,W,H-S0);r(win?'#a8f080':'#ff9a8a',0,S0,W,1)}
 const o=S0?S0-8:0;
 ctext(win?'YOU ESCAPED THE DEEP':'THE DEEP KEEPS YOU',o+(S0?22:40),3,win?'#ffd94d':'#ff9a8a','#181020');
 ctext(win?'DAWN, AND YOUR FACE IS STILL YOURS':(L.sub||'ERIN WILL COME DIGGING. SHE ALWAYS DOES'),o+(S0?46:70),1,'#c8c0d8',null);
 const st=S0?o+64:96,sp2=S0?16:18;
 ctext('CHAMBERS REACHED  '+(win?12:L.chamber),st,2,'#ffffff');
 ctext('FOES FELLED  '+L.kills,st+sp2,2,'#ffffff');
 ctext('MOONDEW BANKED  +'+L.dew,st+sp2*2,2,'#7fd0e8');
 const ms=[L.spr?L.spr+(L.spr===1?' SPROUT':' SPROUTS')+' SAVED TO THE LEDGER':''].concat((L.msgs||[]).map(m=>'★ '+m)).concat(L.heat?['HEAT '+L.heat]:[]).filter(Boolean);
 ms.slice(0,4).forEach((m,i)=>ctext(m,st+sp2*3+i*12,1,m[0]==='★'?'#ffd94d':'#a8f080',null));
 ctext('SPEND IT AT THE DIGS. GO AGAIN.',H-30,1,'#a8f080',null);
 if(overT>.8&&((time*2)|0)%2)ctext('A: THE HEARTH',H-16,2,'#ffffff');}
/* ---------------- the capsule machine, from Rootdeep's own menu ----------------
   Since the rewards split (Nov 18) it holds only Rootdeep's unlocks and takes Lantern tickets (meta.ltix).
   Sprouts has its own machine and tickets. */
let capR={ph:'idle',t:0,it:null,msg:'',msgT:0};
const CAPTUT=()=>["This is the Lantern's capsule machine. It holds Rootdeep's unlocks.","One Lantern ticket opens one capsule. Never the same thing twice. Sprouts has a machine and tickets of its own, in its menu.","LEFT and RIGHT show what's inside, and how to earn Lantern tickets."];
const CAPPG=['SPROUTS','ROOTDEEP','KNOCKOUT','TICKETS'];
function capsUpdate(dt){const c=capR;c.t+=dt;if(c.msgT>0)c.msgT-=dt;
 if(c.pg===undefined)c.pg=String(lanFrom).slice(0,2)==='g3'?1:0;
 if(c.tut===undefined)c.tut=LAN.capTut?-1:0;
 if(c.tut>=0){if(pressed('a')||pressed('b')||pressed('start')){c.tut++;snd(520,.04);if(c.tut>=CAPTUT().length){c.tut=-1;LAN.capTut=1;lanSave()}}return}
 if(c.ph==='idle'&&(pressed('left')||pressed('right'))){c.pg=(c.pg+(pressed('right')?1:3))%4;snd(520,.04)}
 if(c.ph==='idle'){if(pressed('b')||pressed('start')){lanBack();return}
  if(pressed('a')){if(!pool('rd').length){c.msg='YOU HAVE EVERYTHING!';c.msgT=2.5;snd(140,.1)}
   else if((meta.ltix||0)>0){meta.ltix--;c.it=pullOne('rd');c.ph='shake';c.t=0;meta.life.pulls++;snd(200,.5,500)}
   else{c.msg='NEED A LANTERN TICKET';c.msgT=2.5;snd(140,.1)}}}
 else if(c.ph==='shake'){if(c.t>1.2){const it=c.it;meta.own[it.k].push(it.i);if(it.k==='rd')rdCapGot(it.i);else{meta.eq[it.k]=it.i;applyLook(meta.eq)}
   try{metaAch()}catch(e){}persist(true);c.ph='show';c.t=0;snd(784,.1);later(()=>snd(988,.1),100);later(()=>snd(1319,.3),200)}}
 else if(c.t>.5&&(pressed('a')||pressed('b'))){c.ph='idle';c.t=0}}
function drawCaps(){const c=capR;screenShell('CAPSULES','ROOTDEEP UNLOCKS  ·  LANTERN TICKETS');
 text('LANTERN TICKETS '+(meta.ltix||0),10,40,1,'#f8e060',null);
 const mx=W/2+(c.ph==='shake'?Math.round(Math.sin(c.t*40)*2):0),my=54;
 if(c.ph!=='show'){r('#181020',mx-23,my,46,40);r('#b0e0f8',mx-21,my+2,42,36);r('#e0f8ff',mx-18,my+5,5,12);
  [['#f85888',-14,24],['#f8e060',-3,28],['#60b8f8',8,23],['#a070e8',-9,13],['#60d880',4,14],['#f8a040',11,31]].forEach(([col,a,b2],i)=>{const j=c.ph==='shake'?Math.round(Math.sin(c.t*30+i)*2):0;r('#181020',mx+a-1,my+b2-1+j,8,8);r(col,mx+a,my+b2+j,6,6);r('#ffffff',mx+a,my+b2+j,6,2)});
  r('#181020',mx-26,my+38,52,26);r('#e23b5e',mx-24,my+40,48,22);r('#9c1f3c',mx-24,my+57,48,5);r('#181020',mx-5,my+45,10,10);r('#f8e060',mx-3,my+47,6,6)}
 else{const it=c.it,isRd=it.k==='rd',nm=isRd?RDCAP[it.i].n:STY[it.k][it.i][0]+' '+ROWS.find(q=>q[1]===it.k)[0],rr=isRd?RDCAP[it.i].r:STY[it.k][it.i][3],ra=RAR[rr];
  for(let i=0;i<10;i++){const a=i/10*6.283+c.t;r(ra[1],Math.round(W/2+Math.cos(a)*44),Math.round(my+32+Math.sin(a)*26),2,2)}
  if(c.t<.4){g.save();g.globalAlpha=1-c.t/.4;r('#ffffff',0,0,W,H);g.restore()}
  if(isRd&&RDCAP[it.i].ch)rdKeeperSpr(RDCAP[it.i].ch,W/2,my+44,2);else{r('#181020',W/2-11,my+16,22,22);r(isRd?(RDCAP[it.i].lan||'#a8f080'):STY[it.k][it.i][1]||'#c8c0d8',W/2-9,my+18,18,18)}
  ctext((isRd?'ROOTDEEP · ':'SPROUTS STYLE · ')+ra[0],my+50,1,ra[1],null);ctext(nm,my+62,2,'#ffffff');}
 const pg=c.pg||0,top=my+80;r('#241a38',6,top-3,W-12,13);r('#ffd94d',6,top-3,W-12,1);
 const head=['SPROUTS STYLES '+ROWS.reduce((a,q)=>a+((meta.own[q[1]]||[]).length),0)+' / '+ROWS.reduce((a,q)=>a+((STY[q[1]]||[]).length),0),'ROOTDEEP '+rdCapOwned().length+' / '+RDCAP.length,'KNOCKOUT','HOW TO GET TICKETS'][pg];
 ctext('◀ '+head+' ▶',top,1,'#ffd94d',null);
 let rows=[];
 if(pg===0)rows=ROWS.map(q=>[({CAP:'CAPS',COAT:'COATS',FLOWER:'FLOWERS',LOUIE:"LOUIE'S BANDANAS",TRAIL:'TRAILS'})[q[0]]||q[0],((meta.own[q[1]]||[]).length)+' / '+((STY[q[1]]||[]).length),'#e8e4f5','#ffd94d']).concat([['SPROUTS HAS ITS OWN MACHINE NOW','','#f8e060',''],['WEAR THEM IN SPROUTS: STYLE MENU','','#8d84a8','']]);
 else if(pg===1){const owned=rdCapOwned();rows=RDCAP.map((it,i)=>{const has=owned.includes(i);return[it.n,has?'OWNED':RAR[it.r][0],has?'#e8e4f5':'#6a6284',has?'#a8f080':RAR[it.r][1]]})}
 else if(pg===2)rows=[['NOTHING IN THE MACHINE YET','','#c8c0d8',''],['KNOCKOUT STILL PAYS TICKETS:','','#8d84a8',''],['  EACH NEW ARCADE CLEAR','+1','#e8e4f5','#f8e060'],['  EVERY 10 WINS','+1','#e8e4f5','#f8e060'],['  SURVIVAL: EVERY 5 IN A ROW','+1','#e8e4f5','#f8e060'],['  TRIALS: EVERY 4 STARS','+1','#e8e4f5','#f8e060']];
 else rows=[['SPROUTS KEEPS ITS OWN TICKETS','','#8d84a8',''],
  ['ROOTDEEP','','#a8f080',''],['  FIRST WIN OVER EACH BOSS','+1','#e8e4f5','#f8e060'],['  EVERY ESCAPE','+1','#e8e4f5','#f8e060'],
  ['PATCH & PLATE','','#a8f080',''],['  FIRST 3 STARS ON A DAY','+1','#e8e4f5','#f8e060'],
  ['KNOCKOUT · THE LANTERN','','#a8f080',''],['  ARCADE CLEARS, EVERY 10 WINS','+1','#e8e4f5','#f8e060'],['  SURVIVAL x5, TRIAL STARS x4','+1','#e8e4f5','#f8e060'],['  LANTERN ACHIEVEMENTS','+2-5','#e8e4f5','#f8e060']];
 const st=Math.max(9,Math.min(13,Math.floor((H-top-28)/rows.length)));
 if(!(c.tut>=0))rows.slice(0,Math.floor((H-top-28)/st)).forEach(([a,b,ca,cb],i)=>{const y=top+14+st*i;text(a,12,y,1,ca,null);if(b)rtext(b,W-12,y,1,cb,null)});
 if(c.tut>=0){const L=CAPTUT(),ls=wrapPx(L[c.tut],222,1),bh=Math.max(2,ls.length)*11+26,by=H-4-bh;r('rgba(8,5,14,.6)',0,0,W,H);r('#181020',4,by,W-8,bh);r('#f8f0d8',5,by+1,W-10,bh-2);
  const nw=tw('ERIN',2)+10;r('#181020',8,by-7,nw+2,14);r(RDCPLATE.ERIN,9,by-6,nw,12);text('ERIN',14,by-4,2,'#ffffff',null);
  ls.slice(0,4).forEach((l,i)=>text(l,10,by+10+i*11,1,'#281c30',null));text(c.tut<L.length-1?'A: MORE ▼':'A: GOT IT',10,H-16,1,'#7a6a8a',null);return}
 ctext(c.msgT>0?c.msg:c.ph==='show'?'A: NICE!':pool('rd').length?((meta.ltix||0)>0?'A: OPEN ONE (1 TICKET)    B: BACK':'NO LANTERN TICKETS YET    B: BACK'):'YOU HAVE EVERYTHING    B: BACK',H-13,1,c.msgT>0?'#f8a060':'#8d84a8',null);}

/* ---------------- the Burrow Beneath, and sprouts going up to the surface ----------------
   The old Mirror is now a hatch in the Hearth floor: the sprouts you've banked dug a burrow under it, and Moondew
   buys their digging (the same eight permanent upgrades, saved as RD.mirror as before).
   When your string is full, sprouts you find wait (RUN.waiting); at the next door they climb to the surface
   in a short scene that depends on your keeper, and they're banked in the Ledger. */
const RDSURFL={WILL:['WILL','Up you go. Tell Erin I said hi.'],ERIN:['ERIN',"Straight to the bed, all of you. I'll be up soon."],
 LOUIE:['LOUIE','WOOF! (He herds them up the shaft. Very good boy.)'],MARCUS:['MARCUS',"Go, go, go. Bro, you're slow. I believe in you. GO."],
 KING:['SPROUT KING','My court ascends. Await me in the light.']};
const RDBURROWL={WILL:[[null,'Under the Hearth, the sprouts have been digging.'],['WILL','They dug all this? Under the Hearth?']],
 ERIN:[[null,'Under the Hearth, the sprouts have been digging.'],['ERIN','Oh! Tunnels! Look at their little shovels!']],
 LOUIE:[[null,'Under the Hearth, the sprouts have been digging.'],['LOUIE','WOOF. (He would also like to dig. He is told no.)']],
 MARCUS:[[null,'Under the Hearth, the sprouts have been digging.'],['MARCUS','Bro. They built a whole basement. No permits. Respect.']],
 KING:[[null,'Under the Hearth, the sprouts have been digging.'],['SPROUT KING','My court has been busy. Good.']]};
function rdSurfaceQueue(){const w=RUN.waiting||[];if(!w.length)return;for(const t of w)RD.bank[t]=(RD.bank[t]||0)+1;
 RD.stats.budsBanked=(RD.stats.budsBanked||0)+w.length;RUN.surfN=w.length;RUN.surfT=w.slice(0,8);RUN.waiting=[];rdSave()}
function rdWait(type,x,y){(RUN.waiting=RUN.waiting||[]).push(type);rdFound();ftext(x,y-14,"FULL: IT'LL GO UP TOP",'#a8f080');snd(880,.06,1320)}
/* the Sprout Digs: a dig site against the back wall, a sign, a shovel, and whoever's on shift */
function rdDrawDigs(x,base){r('#4e3020',x-13,base-8,26,8);r('#6e4a2a',x-11,base-11,22,4);r('#8a5e36',x-8,base-13,16,3);r('#2a1a14',x-6,base-6,12,4);
 r('#5a3a20',x-12,base-24,2,14);r('#c89860',x-15,base-27,14,7);r('#8a5e36',x-15,base-21,14,1);r('#3a2414',x-13,base-25,2,1);r('#3a2414',x-10,base-25,2,1);r('#3a2414',x-7,base-25,3,1);
 r('#98a0b0',x+7,base-24,3,5);r('#7a4a28',x+8,base-19,1,8);
 const up=Math.sin(time*3)>0;if(up){r('#58c048',x-1,base-17,1,2);r('#58c048',x+1,base-17,1,2)}r('#c8e8a0',x-2,base-15+(up?0:2),5,3);r('#241a30',x-1,base-14+(up?0:2),1,1);r('#241a30',x+1,base-14+(up?0:2),1,1);
 for(let k=0;k<3;k++)if(((time*2+k*.3)%1)<.5)r('#7a5a44',x+3+k*3,base-12-((time*12+k*4)%6),2,2)}
/* the hatch itself, in the Hearth */
function rdDrawBurrowHatch(x,base){r('#3a2414',x-13,base-22,26,20);r('#5a3a20',x-13,base-22,26,2);
 g.fillStyle='#0b0812';g.beginPath();g.arc(x,base-9,10,Math.PI,0);g.fill();r('#0b0812',x-10,base-9,20,7);
 g.save();g.globalAlpha=.25+.12*Math.sin(time*3);r('#a8f080',x-7,base-12,14,10);g.restore();
 r('#c89860',x-4,base-17,1,15);r('#c89860',x+3,base-17,1,15);for(let i=0;i<4;i++)r('#c89860',x-4,base-15+i*4,8,1);
 for(let k=0;k<8;k++){const a=Math.PI+k/7*Math.PI;r('#6e4a2a',Math.round(x+Math.cos(a)*12)-1,Math.round(base-9+Math.sin(a)*12)-1,3,3)}
 if(((time*.6)|0)%3===0){const px=x+7,py=base-12;r('#58c048',px,py-3,1,2);r('#58c048',px+2,py-3,1,2);r('#c8e8a0',px-1,py-1,4,3);r('#241a30',px,py,1,1);r('#241a30',px+2,py,1,1)}}

/* ---------------- milestones, and what the death screen says ---------------- */
function rdMilestones(R0,win){const m=[],S=RD.stats;
 const best=S.best||0;if(R0.chamber>best){S.best=R0.chamber;if(best>0&&!win)m.push('NEW DEEPEST: CHAMBER '+R0.chamber)}
 const k0=S.kills-(R0.kills||0);for(const n of[50,100,250,500,1000,2500])if(k0<n&&S.kills>=n)m.push(n+' FOES FELLED, EVER');
 const f=S.sproutsFound||0,f0=f-(R0.found||0);for(const n of[10,25,50,100,200,500])if(f0<n&&f>=n){const dew=Math.round(n/2);RD.dew+=dew;m.push(n+' SPROUTS FOUND, EVER  +'+dew+' DEW')}
 if(!win&&S.deaths===1)m.push('FIRST FALL. EVERYONE HAS ONE.');
 if(!win)for(const n of[10,25,50])if(S.deaths===n)m.push(n+' FALLS. MARCUS IS COUNTING.');
 return m.slice(0,3)}
function rdDeathLine(R0){if(R0.chamber<=1)return "MARCUS SAW THAT. HE'S TELLING EVERYONE";
 const L={boss0:'THE GRUB MOTHER ATE WELL TONIGHT',boss1:'THE DROWNED KING KEEPS YOUR LIGHT',boss2:'YOUR SHADOW WON. FOR NOW.',grub:'GRUBLETS. IT WAS GRUBLETS.',
  spitter:'SPORED OUT. ERIN WILL COME DIGGING',beetle:'FLATTENED BY A BEETLE. RUDE.',shade:'THE MOTHSHADE GOT BEHIND YOU',crab:'PINCHED. THE CRAB IS SMUG ABOUT IT',
  wisp:'SINGED. THE WISPS ARE GIGGLING',boom:'YOUR OWN BOOM BULB. BOLD.'};
 return L[R0.lastHit]||'ERIN WILL COME DIGGING. SHE ALWAYS DOES'}

/* ---------------- the death cinematic ----------------
   The dark closes in on the keeper, the buds run to them, and Erin's rope comes down and hauls the buds
   up to safety (that's them being banked in the Ledger). Then the death screen. A skips after a moment. */
function rdDyingUpdate(dt){const t=(RUN.dieT+=dt),x=P3.x,y=P3.y;RUN.shake=0;
 RUN.buds.forEach((b,i)=>{b.latch=null;b.fly=null;const a=i/Math.max(1,RUN.buds.length)*6.283,hx=x+Math.cos(a)*12,hy=y+Math.sin(a)*6;
  if(t<1.7){b.x+=(hx-b.x)*Math.min(1,dt*5);b.y+=(hy-b.y)*Math.min(1,dt*5);b.z=Math.round(Math.abs(Math.sin(t*9+i))*2)}
  else{b.x+=(x+8-b.x)*Math.min(1,dt*6);b.y-=dt*(90+i*12);b.z=0}});
 for(const q of RUN.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt}RUN.parts=RUN.parts.filter(q=>q.life>0);
 if(t>3.4||(t>1&&(pressed('a')||pressed('start'))))rdDieFinish();}
function rdDrawDying(){const t=RUN.dieT,k=Math.min(1,t/1.6),x=Math.round(P3.x),y=Math.round(P3.y),kp=RUN.char||'WILL';
 const sp=kp==='KING'?RDKING.ol:kp==='LOUIE'?LOU.l[0]:kp==='WILL'||!CH[kp]?SP.pd:CH[kp];
 g.save();g.translate(x,y);g.rotate(-Math.PI/2*Math.min(1,t/.35));g.drawImage(sp,-(sp.width>>1),-sp.height+2);g.restore();
 rdLight([{x,y:y-4,r:Math.max(16,86-k*70),c:rdLanternC()}],'rgba(6,2,12,'+(.46+k*.4).toFixed(2)+')');
 if(t>1.2){const ry=Math.round(Math.min(y-8,(t-1.2)*170));r('#c8a878',x+8,0,1,ry);if(ry>4){g.save();g.globalAlpha=.5;g.fillStyle='#ffd27a';g.beginPath();g.arc(x+8,ry,7,0,7);g.fill();g.restore();r('#ffd94d',x+6,ry-2,5,5)}}
 for(const b of RUN.buds)drawBud({x:b.x+ox,y:b.y+oy,type:b.type,stage:2,z:b.z||0,a:b.a,mv:true,st:'follow',fx:1});
 const nb=RUN.buds.filter(b=>!b.temp).length;
 if(t>1.7){const a=Math.min(1,(t-1.7)*2);g.save();g.globalAlpha=a;ctext('THE DEEP KEEPS YOU',Math.round(H*.28),3,'#ff9a8a','#181020');
  if(nb)ctext(nb+(nb===1?' SPROUT':' SPROUTS')+' HAULED UP TO SAFETY',Math.round(H*.28)+22,1,'#a8f080',null);g.restore()}}

/* ================= THE LANTERN MENU (console level) =================
   Opened from the cartridge shelf. One capsule machine for every cartridge (the same pool, odds and wallet as
   Sprouts' and Rootdeep's CAPSULES, which now open this), stats from all three games, and Lantern achievements
   that span games and pay capsule tickets. Tickets now come from every cartridge: Sprouts as before, Rootdeep
   (first win over each boss, every escape) and Knockout (each new arcade clear, every 10 wins).
   Saved in localStorage 'lantern-v1'. Knockout's own save ('ncko-v1') is only read, never written. */
let LAN={ach:{},played:{},ko:{w:0,cl:0},tixEarned:0};
try{const s=JSON.parse(localStorage.getItem('lantern-v1')||'null');if(s)LAN=Object.assign(LAN,s)}catch(e){}
const lanSave=()=>{try{localStorage.setItem('lantern-v1',JSON.stringify(LAN))}catch(e){}};
function koStars(){const t=koSV().tr||{};let n=0;for(const k in t)n+=t[k]||0;return n}
function koSV(){try{return Object.assign({diff:0,clear:{},w:0,l:0,surv:0},JSON.parse(localStorage.getItem('ncko-v1')||'{}'))}catch(e){return{diff:0,clear:{},w:0,l:0,surv:0}}}
/* ALT: Patch & Plate's saves, read only (the best of its three files) */
function ppSV(){const out={day:0,stars:0,served:0,earned:0,crew:0,friends:0};
 for(const k of['patchplate-v1','patchplate-v1-s2','patchplate-v1-s3']){try{const s=JSON.parse(localStorage.getItem(k)||'null');if(!s)continue;
  const st=Object.values(s.stars||{}).reduce((a,b)=>a+(+b||0),0),fr=Object.values(s.friend||{}).reduce((a,b)=>a+[4,12,24,40].filter(t=>(+b||0)>=t).length,0); /* hearts, same thresholds as Patch & Plate's HEARTS */
  if(st>out.stars||(st===out.stars&&(s.day||0)>out.day)){out.day=s.day||0;out.stars=st;out.served=s.served||0;out.earned=s.earned||0;out.crew=(s.crew||[]).length;out.friends=fr}}catch(e){}}
 return out}
const lanPlayedN=()=>[0,1,2,3,4,5,6].filter(i=>LAN.played[i]).length;
const sprAch=n=>{try{const i=ACH.findIndex(a=>a[0]===n);return i>=0&&!!meta.ach[i]}catch(e){return false}};
const LACH=[
 ['TRIPLE THREAT','PLAY THREE CARTRIDGES',2,()=>lanPlayedN()>=3],
 ['FULL SHELF','PLAY ALL SEVEN CARTRIDGES',2,()=>lanPlayedN()>=7],
 ['LIGHT ABOVE AND BELOW','RELIGHT THE GREAT LANTERN IN SPROUTS AND ESCAPE ROOTDEEP',2,()=>sprAch('LANTERN KEEPER')&&RD.stats.escapes>=1],
 ['SEE ONE, SEND ONE','OPEN MARCUS WATERWORKS IN SPROUTS AND DIVE AS MARCUS',2,()=>rdWaterworks()&&ksR('MARCUS').runs>=1],
 ['GOOD BOY TRILOGY','PET LOUIE 10 TIMES, CLEAR KNOCKOUT ARCADE AS LOUIE, DIVE AS LOUIE',2,()=>sprAch('GOOD BOY')&&koSV().clear.louie&&ksR('LOUIE').runs>=1],
 ['GARDENER AND FIGHTER','CLEAR KNOCKOUT ARCADE AS ERIN AND DIVE AS ERIN',2,()=>koSV().clear.erin&&ksR('ERIN').runs>=1],
 ['BUILT DIFFERENT','CLEAR KNOCKOUT ARCADE AS MARCUS AND ESCAPE ROOTDEEP AS MARCUS',2,()=>koSV().clear.marcus&&ksR('MARCUS').esc>=1],
 ['THE DEVELOPER','CLEAR KNOCKOUT ARCADE AS WILL AND ESCAPE ROOTDEEP AS WILL',2,()=>koSV().clear.will&&ksR('WILL').esc>=1],
 ['KNOCKOUT ARTIST','CLEAR KNOCKOUT ARCADE WITH THREE DIFFERENT FIGHTERS',2,()=>Object.keys(koSV().clear).length>=3],
 ['ROOTS RUN DEEP','ESCAPE ROOTDEEP THREE TIMES',2,()=>RD.stats.escapes>=3],
 ['STILL STANDING','WIN 5 FIGHTS IN A ROW IN KNOCKOUT SURVIVAL',2,()=>koSV().surv>=5],
 ['FARM TO TABLE','BRING HOME 50 BERRIES IN SPROUTS AND REACH DAY 6 AT PATCH & PLATE',2,()=>meta.life.berries>=50&&ppSV().day>=5],
 ['SPROUT ECONOMY','40 SPROUTS AT ONCE IN SPROUTS, 100 FOUND IN ROOTDEEP',2,()=>sprAch('BIG CREW')&&(RD.stats.sproutsFound||0)>=100],
 ['CAPSULE CURIOUS','OPEN 10 CAPSULES',2,()=>meta.life.pulls>=10],
 ['CAPSULE COLLECTOR','OWN 30 CAPSULE ITEMS',2,()=>pulledCount()>=30],
 ['EVERYTHING, EVERYWHERE','OWN EVERY CAPSULE ITEM',3,()=>!pool().length],
 ['LANTERN KEEPER','EARN EVERY OTHER LANTERN ACHIEVEMENT',5,()=>LACH.slice(0,-1).every(a=>LAN.ach[a[0]])]];
/* award achievements and cross-game tickets; returns what was earned, and shows it on the shelf */
function lanCheck(onShelf){const got=[];let tix=0;
 for(const a of LACH){let ok=false;try{ok=!!a[3]()}catch(e){}if(ok&&!LAN.ach[a[0]]){LAN.ach[a[0]]=1;tix+=a[2];got.push(a[0])}}
 const ko=koSV(),cl=Object.keys(ko.clear).length;if(cl>LAN.ko.cl){tix+=cl-LAN.ko.cl;got.push('KNOCKOUT ARCADE CLEAR');LAN.ko.cl=cl}
 const w10=Math.floor(ko.w/10);if(w10>Math.floor(LAN.ko.w/10)){tix+=w10-Math.floor(LAN.ko.w/10);got.push('KNOCKOUT WINS')}LAN.ko.w=ko.w;
 const s5=Math.floor((ko.surv||0)/5);if(s5>(LAN.ko.s5||0)){tix+=s5-(LAN.ko.s5||0);got.push('SURVIVAL STREAK');LAN.ko.s5=s5}
 const t4=Math.floor(koStars()/4);if(t4>(LAN.ko.t4||0)){tix+=t4-(LAN.ko.t4||0);got.push('TRIAL STARS');LAN.ko.t4=t4}
 if(tix){meta.ltix=(meta.ltix||0)+tix;LAN.tixEarned+=tix;try{persist(true)}catch(e){}}
 lanSave();
 if(onShelf&&got.length){const m=$('shelfMsg');if(m){m.textContent='✦ '+got[0]+(got.length>1?' +'+(got.length-1)+' MORE':'')+'  +'+tix+' TICKETS';setTimeout(()=>{if(state==='off')m.textContent='Pick a cartridge'},4500)}}
 return{got,tix}}
function lanPlayed(i){LAN.played[i]=1;lanSave()}
let lanFrom='off',lanSel=0,lanPage=0,lanMsg='',lanMsgT=0;
function lanOpen(from,sub){lanFrom=from||'off';lanSel=0;lanPage=0;if(lanFrom==='off'){shelf.hidden=true}const r2=lanCheck(false);
 if(r2.got.length){lanMsg='✦ '+r2.got[0]+'  +'+r2.tix+' TICKETS';lanMsgT=3.5}
 if(sub==='caps'){capR={ph:'idle',t:0,it:null,msg:'',msgT:0};state='lancaps'}else state='lan'}
function lanBack(){if(state!=='lan'&&lanFrom==='off'&&state!=='lancapsx'){state='lan';return}
 if(lanFrom==='off'){state='off';shelf.hidden=false;$('shelfMsg').textContent='Pick a cartridge'}else state=lanFrom}
const LANITEMS=['CAPSULES','STATS','ACHIEVEMENTS','BACK TO THE SHELF'];
function lanUpdate(dt){if(lanMsgT>0)lanMsgT-=dt;
 if(state==='lan'){lanSel=nav(lanSel,LANITEMS.length);
  if(pressed('b')||pressed('start')){lanBack();return}
  if(pressed('a')){snd(660,.06,990);const k=LANITEMS[lanSel];if(k==='CAPSULES'){capR={ph:'idle',t:0,it:null,msg:'',msgT:0};state='lancaps'}else if(k==='STATS'){lanPage=0;state='lanstats'}else if(k==='ACHIEVEMENTS'){uiSel=0;state='lanach'}else lanBack()}return}
 if(state==='lancaps'){capsUpdate(dt);return}
 if(state==='lanstats'){if(pressed('left'))lanPage=(lanPage+4)%5;if(pressed('right'))lanPage=(lanPage+1)%5;if(pressed('left')||pressed('right'))snd(520,.04);if(pressed('b')||pressed('a')||pressed('start'))lanBack();return}
 if(state==='lanach'){uiSel=nav(uiSel,LACH.length);if(pressed('b')||pressed('start'))lanBack();return}}
function lanDrawLamp(x,y){g.save();g.globalAlpha=.18+.05*Math.sin(time*2);g.fillStyle='#ffd94d';g.beginPath();g.arc(x,y+8,22,0,7);g.fill();g.restore();
 r('#3a2c1c',x-1,y-10,2,8);r('#3a2c1c',x-7,y-2,14,3);r('#6e4a20',x-6,y+1,12,15);r('#ffd94d',x-4,y+3,8,11);r('#fff3b0',x-2,y+5,4,6);r('#3a2c1c',x-7,y+16,14,3)}
function lanDraw(){r('#0c0a12',0,0,W,H);
 if(state==='lancaps'){drawCaps();return}
 const top=state==='lan'?Math.round(H*.12):0;
 if(state==='lan'){for(let i=0;i<30;i++)r(i%5?'#3a3350':'#8d84a8',(i*53+17)%240,(i*29+11)%H,1,1);lanDrawLamp(W/2,top+8);
  ctext('POCKET LANTERN',top+34,3,'#ffd94d','#403010');ctext('THE CONSOLE',top+52,1,'#a89ec2',null);
  const done=LACH.filter(a=>LAN.ach[a[0]]).length;ctext('TICKETS '+(meta.ltix||0)+'  ·  ACHIEVEMENTS '+done+'/'+LACH.length,top+70,1,'#c8c0d8',null);
  const st=20,y0=Math.round(H*.5);r('rgba(8,5,14,.8)',W/2-74,y0-10,148,LANITEMS.length*st+12);r('#ffd94d',W/2-74,y0-10,148,1);drawList(LANITEMS,lanSel,y0,st);
  ctext(lanMsgT>0?lanMsg:['ROOTDEEP UNLOCKS FOR LANTERN TICKETS','NUMBERS FROM THE GAMES','GOALS THAT SPAN THE GAMES','PICK A CARTRIDGE'][lanSel],H-16,1,lanMsgT>0?'#ffd94d':'#8d84a8',null);return}
 if(state==='lanstats'){const P=['ALL GAMES','SPROUTS','KNOCKOUT','ROOTDEEP','PATCH & PLATE'][lanPage];screenShell('STATS','◀ '+P+' ▶');let rows=[];
  if(lanPage===0){const done=LACH.filter(a=>LAN.ach[a[0]]).length;rows=[['CARTRIDGES PLAYED',lanPlayedN()+' / 7'],['LANTERN ACHIEVEMENTS',done+' / '+LACH.length],['CAPSULES OPENED',meta.life.pulls],['CAPSULE ITEMS OWNED',pulledCount()],['LANTERN TICKETS ON HAND',meta.ltix||0],['TICKETS FROM THE LANTERN',LAN.tixEarned]]}
  else if(lanPage===1){const L=meta.life;rows=[['KEEPER RANK',rankOf(meta.xp)[0]],['PETALS EARNED',meta.xp],['ACHIEVEMENTS',Object.keys(meta.ach).length+' / '+ACH.length],['MISSIONS',L.missions],['BERRIES BROUGHT HOME',L.berries],['BUGS CAUGHT',L.bugs],['FLOWERS HARVESTED',L.flowers],['LOUIE PETS',L.pets]]}
  else if(lanPage===2){const k=koSV(),c=Object.keys(k.clear);rows=[['WINS',k.w],['LOSSES',k.l],['ARCADE CLEARS',c.length+' / 8'],['CLEARED WITH',c.length?c.map(x=>x.toUpperCase()).slice(0,3).join(', ')+(c.length>3?'...':''):'NOBODY YET'],['BEST SURVIVAL STREAK',k.surv||0],['TRIAL STARS',koStars()+' / 32']]}
  else if(lanPage===4){const q=ppSV();rows=[['DAYS OPEN',Math.min(12,q.day+1)+' / 12'],['STARS',q.stars+' / 36'],['DISHES SERVED',q.served],['COINS EARNED',q.earned],['SPROUT CREW',q.crew+' / 6'],['FRIEND HEARTS',q.friends+' / 20']]}
  else if(lanPage===3){const S=RD.stats;rows=[['RUNS',S.runs],['ESCAPES',S.escapes],['DEEPEST CHAMBER',(S.best||0)+' / 12'],['FOES FELLED',S.kills],['BOSSES FELLED',S.bosses],['SPROUTS FOUND',S.sproutsFound||0],['FALLS',S.deaths],['KEEPERS UNLOCKED',CHARS.filter(c=>charUnlocked(c.id)).length+' / '+CHARS.length]]}
  rows.forEach(([a,b],i)=>{const y=48+i*17;r(i%2?'#181024':'#1d1530',8,y-3,W-16,15);text(a,14,y+1,1,'#c8c0d8',null);rtext(String(b),W-14,y+1,1,'#ffd94d',null)});
  ctext('◀ ▶ PAGES    B: BACK',H-13,1,'#8d84a8',null);return}
 if(state==='lanach'){const done=LACH.filter(a=>LAN.ach[a[0]]).length;screenShell('ACHIEVEMENTS',done+' / '+LACH.length+' · PAID IN LANTERN TICKETS');
  /* more achievements than fit: the list scrolls with the cursor, and the description stays clear below it */
  const fit=Math.max(7,Math.floor((H-44-40-6)/15)),off=Math.max(0,Math.min(LACH.length-fit,uiSel-(fit>>1)));
  rowsDraw2(LACH.slice(off,off+fit).map(a=>({a:(LAN.ach[a[0]]?'★ ':'○ ')+a[0],b:LAN.ach[a[0]]?'DONE':'+'+a[2]+' TIX'})),uiSel-off,LACH[uiSel][1]);
  if(off>0)rtext('▲',W-4,30,1,'#8d84a8',null);if(off+fit<LACH.length)rtext('▼',W-4,40+fit*15-4,1,'#8d84a8',null);
  ctext('B: BACK',H-13,1,'#8d84a8',null);return}}

/* ---------------- dispatch ---------------- */
let musT=null;
function rdMusStart(){if(musT)return;const notes=[110,130.81,164.81,196,220,196,164.81,130.81,98,110,130.81,146.83];let i=0;
 musT=setInterval(()=>{try{if(cart!==1||state.slice(0,2)!=='g3'||!ac||!meta||!meta.mus)return;
  const o=ac.createOscillator(),ga=ac.createGain(),tt=ac.currentTime;o.type='triangle';
  o.frequency.setValueAtTime(notes[i++%notes.length],tt);
  const v=0.045*Math.pow(meta.mus/10,1.5);ga.gain.setValueAtTime(v,tt);ga.gain.exponentialRampToValueAtTime(.001,tt+1.5);
  o.connect(ga);ga.connect(ac.destination);o.start(tt);o.stop(tt+1.55);}catch(e){}},680);}
function g3StartTitle(){applyVolumes();rdMusStart();state='g3title';}
let menuSel=0,setReturn='g3title';
const rdHasSave=()=>!!(RD.flags.cineSeen||RD.stats.runs);
function rdMenuItems(){return(rdHasSave()?['CONTINUE','NEW GAME']:['NEW GAME']).concat(['CAPSULES','SETTINGS','INTRO','SWAP CARTRIDGE'])}
let newArm=0;
/* NEW GAME: wipe Rootdeep's save (your settings stay; Sprouts capsule unlocks live in Sprouts' save and stay), then the intro */
function rdNewGame(){const set=RD.set;RD=RDDEF();RD.set=set;rdSave();newArm=0;startCine('hub','intro')}
function menuUpdate(){const it=rdMenuItems(),was=menuSel;menuSel=nav(menuSel,it.length);if(menuSel!==was)newArm=0;
 if(pressed('a')||pressed('start')){snd(660,.06,990);const k=it[menuSel];
  if(k==='CONTINUE'){if(!rdResume())hubEnter()}
  else if(k==='NEW GAME'){if(rdHasSave()&&!newArm){newArm=1;snd(330,.1)}else rdNewGame()}
  else if(k==='CAPSULES')lanOpen('g3menu','caps');
  else if(k==='INTRO')startCine('menu');
  else if(k==='SETTINGS'){setReturn='g3menu';uiSel=0;state='g3set'}
  else eject()}
 if(pressed('b')||pressed('sel'))eject()}
function setUpdate(){uiSel=nav(uiSel,4);const lr=(pressed('right')?1:0)-(pressed('left')?1:0);
 if(lr||pressed('a')){let touched=true;
  if(uiSel===0)RD.set.mus=lr?Math.max(0,Math.min(10,RD.set.mus+lr)):(RD.set.mus>=10?0:RD.set.mus+1);
  else if(uiSel===1)RD.set.sfx=lr?Math.max(0,Math.min(10,RD.set.sfx+lr)):(RD.set.sfx>=10?0:RD.set.sfx+1);
  else if(uiSel===2){if(pressed('a'))RD.set.shake=!RD.set.shake;else touched=false}
  else{const own=RDLANTERNS.filter((l,i)=>i===0||rdCapHas(c=>c.lan===l[1])),ix=Math.max(0,own.findIndex(l=>l[1]===rdLanternC()));
   RD.set.lantern=own[(ix+(lr||1)+own.length)%own.length][1];}
  if(touched){applyVolumes();rdSave();snd(660,.05,880)}}
 if(pressed('b')||pressed('start')){snd(440,.05);state=setReturn}}
function g3Update(dt){
 if(say2T>0)say2T-=dt;if(rdSavedT>0&&state!=='g3cine')rdSavedT-=dt;
 switch(state){
 case 'g3menu':menuUpdate();return;
 case 'g3set':setUpdate();return;
 case 'g3sprouts':sproutsUpdate();return;
 case 'g3cine':cineUpdate(dt);return;
 case 'g3title':if(pressed('a')||pressed('start')){snd(660,.08,990);if(!rdHasSave())rdNewGame();else{menuSel=0;newArm=0;state='g3menu'}}
  else if(pressed('b')||pressed('sel'))eject();return;
 case 'g3hub':hubUpdate(dt);return;
 case 'g3talk':talkUpdate();return;
 case 'g3appr':apprUpdate(dt);return;
 case 'g3hpause':hpauseUpdate();return;
 case 'g3chars':charsUpdate();return;
 case 'g3mirror':mirrorUpdate();return;
 case 'g3arm':armUpdate();return;
 case 'g3keep':keepUpdate();return;
 case 'g3codex':codexUpdate();return;
 case 'g3heat':heatUpdate();return;
 case 'g3boon':boonUpdate();return;
 case 'g3shop':if(!RUN){state='g3hub';return}shopUpdate();return;
 case 'g3pause':if(!RUN){hubEnter();return}pauseUpdate();return;
 case 'g3run':if(!RUN){hubEnter();return}runUpdate(dt);return;
 case 'g3dying':if(!RUN){state='g3over';return}rdDyingUpdate(dt);return;
 case 'g3over':case 'g3win':overT+=dt;if(overT>.8&&(pressed('a')||pressed('start')))hubEnter();return;
 }}
function g3Draw(){
 switch(state){
 case 'g3title':drawTitle();return;
 case 'g3menu':drawMenu();return;
 case 'g3cine':rdDrawCine();return;
 case 'g3hub':drawHub();rdDrawSaved();return;
 case 'g3talk':drawHub();if(rdApprTalk)rdDrawLetterbox(1,true);return;
 case 'g3appr':drawHub();rdDrawLetterbox(Math.min(1,rdAppr.t/.4));return;
 case 'g3hpause':drawHPause();return;
 case 'g3chars':drawChars();return;
 case 'g3mirror':case 'g3arm':case 'g3keep':case 'g3codex':case 'g3heat':case 'g3boon':case 'g3shop':case 'g3pause':case 'g3set':case 'g3sprouts':
  if(state==='g3boon'||state==='g3pause'){if(RUN&&state==='g3pause'){drawRun(true)}g3DrawUI();return}
  if(state==='g3shop'&&RUN){g3DrawUI();return}
  g3DrawUI();return;
 case 'g3run':if(RUN){drawRun();rdDrawSaved()}return;
 case 'g3dying':if(RUN){drawRun(true);rdDrawDying()}return;
 case 'g3over':drawOver(false);return;
 case 'g3win':drawOver(true);return;
 }}
/* test hooks for Will's harness (same spirit as Sprouts' __g) */
const RDF={start:()=>{hubEnter()},depart:()=>{rdStartRun();state='g3run'},
 special:k=>rdSpecial(k),superFill:()=>{if(RUN)RUN.sup=100},run:()=>RUN,
 ints:()=>RUN?RUN.ints.map(i=>({k:i.k,x:i.x,y:i.y,done:i.done})):[],near:()=>{const i=rdNearInt();return i?i.k:null},
 goto:n=>{if(RUN){RUN.chamber=n-1;rdNextChamber();state='g3run'}},
 cine:(k,d)=>startCine(d||'hub',k),ckpt:()=>RD.ckpt,lan:()=>LAN,lanCheck:()=>lanCheck(false),
 talk:who=>{talkNPC=who;talkStart=0;talkLine=0;talkTxt=LINES[who]?rdLn(LINES[who][0]):'';state='g3talk'},open:id=>{state='g3'+id},
 clearRoom:()=>{if(RUN){RUN.wave2=null;for(const e of RUN.enemies.slice())killEnemy(e)}},
 hurt:n=>{if(RUN){RUN.inv=0;RUN.dashT=0;damagePlayer(n)}},
 door:i=>{if(RUN&&RUN.doors[i])doorReward(RUN.doors[i])},
 give:(k,n)=>{RD[k]=(RD[k]||0)+n;rdSave()},
 boss:()=>{if(RUN){RUN.enemies=[];spawnBoss(RUN.chamber>=8?2:RUN.chamber>=4?1:0)}},
 forceBoon:god=>{if(RUN){boonOffer=genOffer(god);uiSel=0;state='g3boon'}},
 forceShop:()=>{if(RUN){shopItems=genShop();uiSel=0;state='g3shop'}},
 giveRun:(k,n)=>{if(RUN)RUN[k]=(RUN[k]||0)+n},
 pod:t2=>{if(RUN)RUN.pods.push({type:t2,x:P3.x,y:P3.y})},
 buds:()=>RUN?RUN.buds.map(b=>b.type):[],bank:()=>RD.bank,party:()=>RD.party,char:()=>RD.char,unlocks:()=>CHARS.map(c=>c.id+':'+(charUnlocked(c.id)?'open':'locked')),set:()=>RD.set,cineSeen:()=>!!RD.flags.cineSeen,
 npcPos:who=>HUBNPC[who]?[Math.round(HUBNPC[who].x),Math.round(HUBNPC[who].y)]:null,talkTxt:()=>talkTxt,pods:()=>RUN?RUN.pods.map(p=>({t:p.type,x:Math.round(p.x),y:Math.round(p.y)})):[],
 pos:()=>({x:Math.round(P3.x),y:Math.round(P3.y),dashT:RUN?+RUN.dashT.toFixed(2):0,chg:RUN?RUN.dashCharges:0,ammo:RUN?RUN.castAmmo:0}),
 foes:()=>RUN?RUN.enemies.map(e=>({k:e.kind,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp)})):[],
 doors:()=>RUN?RUN.doors.map(d=>d.kind+(d.kind==='boon'?':'+d.god:'')):[],
 offer:()=>boonOffer.map(b=>boonName(b)+' ('+b.rarN+')'),
 finale:()=>{if(RUN){RUN.chamber=11;rdNextChamber()}},
 state:()=>({state,run:RUN?{chamber:RUN.chamber,hp:Math.round(RUN.hp),petals:RUN.petals,dew:RUN.dew,enemies:RUN.enemies.length,phase:RUN.phase,boons:[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean).map(boonName)}:null,
  meta:{dew:RD.dew,keys:RD.keys,honey:RD.honey,escapes:RD.stats.escapes,deaths:RD.stats.deaths,weapon:RD.weapon,keeps:Object.keys(RD.keeps),heat:heatTotal()}})};
