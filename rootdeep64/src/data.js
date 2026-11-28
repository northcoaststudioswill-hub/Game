/* =====================================================================
   ROOTDEEP 64 — data
   Every table below is Rootdeep v2.9's own, copied verbatim from the
   cartridge (gods, boons, weapons, Mirror, keepsakes, dialogue, foes,
   biomes, bosses, Pact, cast, signatures, intro, sprout exchange).
   Numbers are the game. Do not "rebalance" here without Will.
   ===================================================================== */
'use strict';
/* sprout types — Sprouts' own TYPES table */
const TYPES=[
 {n:'EMBER',c:'#f07830',d:'#983818',l:'#f8c070',sp:74},
 {n:'PEB',c:'#98a0b0',d:'#4c5466',l:'#dce2ea',sp:66},
 {n:'DEW',c:'#48a0f0',d:'#2050a8',l:'#b0e0f8',sp:82},
 {n:'ZIP',c:'#f0d020',d:'#806008',l:'#fff8a0',sp:98},
 {n:'LEAF',c:'#58c048',d:'#286028',l:'#b0f090',sp:76},
 {n:'LUCKY',c:'#f078c0',d:'#902868',l:'#ffc8e8',sp:78}];
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
 MARCUS:["Oh good, the keeper's here. Everybody act natural. Nobody's good at it, but try.","I've watched every keeper go down that door. Read my reviews: all terrible.","The Drowned King. Drowned. King. Two red flags, and you still wanna swim down there.","Erin says there's good in everyone. I checked personally. There's less than she thinks.","Scout wrote forty pages on the grubs. I read every one. I hate the pages AND the grubs.","If you die down there, I'm not crying. I'm telling everyone you owed me money.","Louie's the only one here I respect. He bites his problems. You've got a sword, I guess.","Go on, descend. The deep's been talking trash about you, and honestly? Team deep.","The sprouts follow you now. Great. More witnesses for the descent.","I watered the bed once. ONCE. Now it's in Erin's speech forever.","Scout named a grub after me. I named a boot after Scout. Guess the rest.","Your honest review of the deep, from me: one star. The star is a warning label."],
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
const BOSSES=[{id:'mother',n:'THE GRUB MOTHER',s:'GRUB MOTHER',hp:430,sp:30,dmg:13,r:13,c:'#c99df0'},
 {id:'king',n:'THE DROWNED KING',s:'DROWNED KING',hp:640,sp:34,dmg:15,r:12,c:'#7fd0e8'},
 {id:'hollow',n:'THE HOLLOW KEEPER',s:'HOLLOW KEEPER',hp:880,sp:52,dmg:16,r:8,c:'#e8e4f5'}];
const PACT=[
 {id:'thorns',n:'THORN PACT',  d:'Foes deal +15% damage / rank', max:2},
 {id:'swarm', n:'SWARM PACT',  d:'+25% foes per chamber / rank', max:2},
 {id:'hide',  n:'TOUGH HIDE',  d:'Foes have +20% health / rank', max:2},
 {id:'rush',  n:'RUSH PACT',   d:'Foes are +12% faster / rank',  max:1},
 {id:'dry',   n:'DRY PACT',    d:'Healing is 30% weaker',        max:1}];
const CHARS=[
 {id:'WILL',tag:'THE KEEPER',d:'Balanced. The Lantern knows his hands.',stats:'ALL-ROUND - COMBO 3 ENDS IN A SELFIE FLASH'},
 {id:'ERIN',tag:'THE GARDENER',d:'Her buds fight like they mean it.',stats:'BUDS +50% DAMAGE - SPEED +5%'},
 {id:'LOUIE',tag:'THE GOOD BOY',d:'Fast, fearless, slightly less durable.',stats:'SPEED +15% - QUICK BITE - HP -20'},
 {id:'MARCUS',tag:'THE HATER',d:'Here because everyone else kept dying.',stats:'HP +25 - HITS +20% - SPEED -7%'}];
const SIG={WILL:{n:'MAZEL TOV LASER',d:'A piercing beam of pure celebration.'},
 ERIN:{n:'TOWEL WHIP',d:'A wet snap that roots foes and shoves them back.'},
 LOUIE:{n:'THE BOOF',d:'A bark with mass. Knocks the whole room back.'},
 MARCUS:{n:'HYDRO JET',d:'A piercing jet of water. He hates how cool it is.'}};
const RDCINE=[
 {d:5.5,bg:'garden',lines:[[null,'The Great Lantern kept the garden lit.'],['ERIN','Under it, everything grew. Every bit of it.']]},
 {d:6,bg:'crack',lines:[['LOUIE','WOOF. (The ground just growled.)'],['ERIN','The light is going DOWN, Will. Something under us is hungry.']]},
 {d:7.5,bg:'hearth',lines:[['SCOUT','Statistically, one of us should supervise from up here.'],['MARCUS','Great. A haunted basement. Put it on the list of things I hate.'],['ERIN','Bring me back a story, keeper.']]},
 {d:4,bg:'door',lines:[[null,'So the keeper went down.']]}];
const RDCPLATE={ERIN:'#b8304a',MARCUS:'#3a3a44',SCOUT:'#1f6a72',LOUIE:'#7a4a28',RANGER:'#38603a'};
const SPFX=['EMBER buds lob fire at your foes.','PEB buds block a hit meant for you.','DEW buds slowly mend you.','ZIP buds: +speed, and pickups drift to you.','LEAF buds: foes drop more petals.','LUCKY buds: +crit. The deep approves.'];
const TRADES=[{g:[0,3],t:[3,1]},{g:[1,3],t:[2,1]},{g:[2,3],t:[4,1]},{g:[3,3],t:[5,1]},{g:[4,3],t:[5,1]}];
const SELLS=[{ty:5,dew:12},{ty:4,dew:6},{ty:3,dew:5}];
const PODW=[[0,1,4,0,1,4],[2,3,1,2,3,0],[0,3,5,4,0,3]];
const DOORICON={boon:'✦',petals:'✿',dew:'☾',fruit:'☀',heart:'♥',shop:'⚖',fountain:'≈',honey:'⬢'};
