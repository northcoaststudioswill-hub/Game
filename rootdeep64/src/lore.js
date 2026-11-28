/* =====================================================================
   ROOTDEEP 64 — the deep's own story
   Named chambers, relics to read in the rooms, the ghost of the keeper
   before you, and a personal quest for each playable keeper.

   WILL — as with story.js, every word here is new writing by Claude, not
   canon you handed over. It builds only on what is already in the game:
   the Lantern cracked downward; the light falls and pools; the six gods
   are the first six sprouts; the Grub Mother is Thornback's mother; the
   King came down to bring the water back and sat; the Hollow Keeper is
   lonely light wearing keepers' faces; the keeper before you wrote the
   echoes and drew a lantern by her name. The relics deliberately DISAGREE
   about how the crack started: nobody alive knows, and the game doesn't
   decide it for you. The quest titles DOUBLE OR NOTHING (Marcus) borrows
   his fighter move's name. Will stays silent, as in the intro: his quest
   is told by the people around him. Cut or rewrite anything.
   ===================================================================== */
'use strict';
/* ---------------- the twelve chambers ---------------- */
const CHNAMES=[
 {n:'THE ROOT CELLAR',w:'The first door down. It still smells of the garden.'},
 {n:'THE GNAWED HALL',w:'Grub tracks everywhere, and every one of them leads down.'},
 {n:'THE NURSERY',w:'Something lays its young where the roots are thickest.'},
 {n:"THE MOTHER'S BURROW",w:'The walls are warm and they breathe.'},
 {n:'THE DRIPPING STAIR',w:'Every step is wet with a morning that never came.'},
 {n:'THE SUNKEN PANTRY',w:'Jars of dew on shelves, labelled in a hand nobody remembers.'},
 {n:'THE DROWNED GALLERY',w:'Portraits under the water. Every one a keeper. Every one looking down.'},
 {n:'THE THRONE IN THE SHALLOWS',w:'A chair, a crown, and a great deal of patient water.'},
 {n:'THE WARM DARK',w:'It is warm the way the Lantern is warm.'},
 {n:'THE CINDER CHOIR',w:'The embers hum six notes. You know them from the sprout bed.'},
 {n:'THE LAST LANDING',w:'Footprints in the ash, all your size, going both ways.'},
 {n:'THE HOLLOW',w:'It has been waiting by the door.'}];

/* ---------------- relics: things left in the rooms ---------------- */
/* prop: tablet / statue / shrine / camp / pack / carving */
const RELICS=[
 /* the Burrows */
 {id:'r-b1',th:0,prop:'carving',src:'A CARVING IN THE ROOTS',n:'THE FIRST PLANTING',x:"Six small marks in a ring, and a lantern drawn above them. Under it, scratched deep: WE PUT THEM IN THE DARK SO THEY WOULD REACH FOR THE LIGHT."},
 {id:'r-b2',th:0,prop:'camp',src:'A COLD CAMP',n:'SOMEBODY SLEPT HERE',x:"A bedroll gone to moss, a ring of stones, a cup. The cup is clean. Whoever left it meant to come back for it, and washed it first."},
 {id:'r-b3',th:0,prop:'tablet',src:'A STONE TABLET',n:'THE KEEPERS\' RULE',x:"KEEP THE LIGHT. KEEP THE BEDS. KEEP EACH OTHER. Someone has added a fourth line in a smaller, later hand: KEEP COMING BACK."},
 {id:'r-b4',th:0,prop:'pack',src:"A KEEPER'S PACK",n:'WHAT THEY CARRIED',x:"Bean seeds, a spoon, a whistle, a pressed leaf, a note that says DON'T FORGET ERIN'S BIRTHDAY. The note is older than Erin."},
 {id:'r-b5',th:0,prop:'shrine',src:'A ROOT SHRINE',n:'FOR THE LITTLE ONES',x:"A hollow in the wall, filled with sprout pods someone carried this far and no further. Each one has a name scratched on it. Each one is still faintly warm."},
 {id:'r-b6',th:0,prop:'statue',src:'A STATUE',n:'THE FIRST KEEPER',x:"Worn smooth. A figure holding a lantern up, not out. The face is gone. Grubs have nested in the folds of the coat and are not afraid of you."},
 {id:'r-b7',th:0,prop:'tablet',src:'A STONE TABLET',n:'ON THE FROST, ONE',x:"THE WINTER THE BEANS FROZE, THE KEEPER LOWERED THE LANTERN TO WARM THE ROOTS. IT WAS TOO HEAVY TO LIFT BACK. THAT IS WHEN IT CRACKED. (Another hand: NOT TRUE.)"},
 {id:'r-b8',th:0,prop:'carving',src:'A CARVING IN THE ROOTS',n:'THORNBACK, SMALL',x:"A child's drawing of a grub with a thorny back and a crown of leaves. Beside it, in a grown-up hand: HE WAS ALWAYS GOING TO GET BIG. WE SHOULD HAVE FED HIM."},
 {id:'r-b9',th:0,prop:'camp',src:'A COLD CAMP',n:'TWO CUPS',x:"Two cups, two bedrolls, one fire ring. One bedroll is much smaller, with a dog-sized dent beside it. A collar bell lies in the ashes."},
 {id:'r-b10',th:0,prop:'pack',src:"A KEEPER'S PACK",n:'A LIST',x:"THINGS I KNOW: my name. Erin's name. The east bed gets afternoon sun. THINGS I DON'T: why I came down. The list is longer on the second side."},
 {id:'r-b11',th:0,prop:'shrine',src:'A ROOT SHRINE',n:'THE MOTHER\'S OFFERING',x:"Old roots, carefully stacked, the way a gardener stacks bean poles for winter. The grubs bring them here. Nobody taught them. Somebody must have."},
 {id:'r-b12',th:0,prop:'statue',src:'A STATUE',n:'KEEPER, KNEELING',x:"A keeper kneeling, hands in the dirt. The stone hands are polished from being touched. You touch them too, without meaning to."},
 /* the Flooded Vault */
 {id:'r-v1',th:1,prop:'tablet',src:'A DROWNED TABLET',n:'ON THE FROST, TWO',x:"IT WAS NOT THE FROST. A KEEPER DROPPED IT. ONE CLUMSY NIGHT, ONE CRACK. THE REST IS STORIES WE TELL SO NOBODY IS TO BLAME. (Scratched under it: SO SOMEBODY IS.)"},
 {id:'r-v2',th:1,prop:'pack',src:'A SODDEN PACK',n:'THE KING\'S LETTER',x:"I will bring the water up by spring. Tell the gardener to leave the barrels out. I am only resting a moment. — The ink has run. Spring is underlined three times."},
 {id:'r-v3',th:1,prop:'statue',src:'A STATUE IN THE SHALLOWS',n:'THE KING, YOUNG',x:"A tall young figure with a bucket in each hand and no crown at all. Someone has set a crown of reeds on its head. The reeds are fresh."},
 {id:'r-v4',th:1,prop:'shrine',src:'A JAR SHRINE',n:'MORNINGS, LABELLED',x:"Jars of dew, each with a date. SPRING, THE YEAR THE PEARS CAME. SUMMER, ERIN'S FIRST BED. The newest jar has your first day as keeper on it."},
 {id:'r-v5',th:1,prop:'carving',src:'A CARVING UNDER THE WATERLINE',n:'THE WATER\'S WAY',x:"Arrows, hundreds of them, all pointing down. One arrow, small and late and very deep, points up. Next to it: ONE OF US WILL."},
 {id:'r-v6',th:1,prop:'camp',src:'A RAFT OF ROOTS',n:'WHERE SHE RESTED',x:"A raft woven from roots, tied to a pillar. A lantern is drawn on the pillar in charcoal, the same small lantern as the one in the echoes. It has been redrawn many times."},
 {id:'r-v7',th:1,prop:'tablet',src:'A DROWNED TABLET',n:'THE OLD SIX',x:"THE SPROUTS WE PLANTED FIRST FELL WITH THE FIRST LIGHT. THEY DID NOT DIE. THEY GREW TOWARD IT, AND WHEN THEY COULD NOT REACH IT, THEY GREW WISE INSTEAD."},
 {id:'r-v8',th:1,prop:'pack',src:'A SODDEN PACK',n:'A LETTER NEVER SENT',x:"Dear E — the roots down here are so thirsty. I keep watering them with the dew and it keeps falling further. I am doing my best. Don't let Marcus near the — (the rest is water)."},
 {id:'r-v9',th:1,prop:'statue',src:'A STATUE IN THE SHALLOWS',n:'THE GALLERY KEEPER',x:"A statue holding a frame with nothing in it. The empty frame faces the water. When you look at it from the right place, it frames your reflection."},
 {id:'r-v10',th:1,prop:'shrine',src:'A JAR SHRINE',n:'THE CHAIR',x:"A tiny model of a throne, carved from driftwood, with a tiny king sitting in it. The king's legs are made to bend. Someone has bent them as if to stand."},
 {id:'r-v11',th:1,prop:'carving',src:'A CARVING UNDER THE WATERLINE',n:'TALLY',x:"Hundreds of tally marks in groups of five. The last group has four. Below it: I STOPPED COUNTING WHEN I STOPPED MINDING."},
 {id:'r-v12',th:1,prop:'camp',src:'A RAFT OF ROOTS',n:'DOG BOWL',x:"A small clay bowl on a dry ledge, pressed with a paw print. It's full of fresh water, though nothing should be fresh down here."},
 /* the Ember Core */
 {id:'r-c1',th:2,prop:'tablet',src:'A SCORCHED TABLET',n:'ON THE FROST, THREE',x:"NOBODY DROPPED IT AND IT DID NOT FREEZE. THE LANTERN WAS FULL. LIGHT WANTS TO GO SOMEWHERE. WE NEVER GAVE IT ANYWHERE TO GO, SO IT WENT DOWN."},
 {id:'r-c2',th:2,prop:'statue',src:'A GLASS STATUE',n:'A FACE, BORROWED',x:"Clear glass, warm to the touch, in the shape of a keeper. Look closely: the face is three faces, one behind the other, not quite agreeing."},
 {id:'r-c3',th:2,prop:'shrine',src:'AN EMBER SHRINE',n:'THE SIX NOTES',x:"Six embers set in a ring, each a different colour, each humming. Hum the note of the sprout bed back at them and they all brighten at once."},
 {id:'r-c4',th:2,prop:'carving',src:'A CARVING IN THE ASH',n:'IT LEARNED TO WALK',x:"Footprints pressed into cooled glass: first a shapeless pool, then a lump, then a child's feet, then a keeper's boots. Then your boots."},
 {id:'r-c5',th:2,prop:'pack',src:'A SCORCHED PACK',n:'HER LANTERN',x:"A hand lantern, glass cracked, wick long burned out, still warm. A tag on the handle: MINE. DON'T BORROW IT, I MEAN IT. — and under that: (fine, borrow it)."},
 {id:'r-c6',th:2,prop:'tablet',src:'A SCORCHED TABLET',n:'WHAT IT WANTS',x:"IT DOES NOT WANT TO HURT YOU. IT WANTS TO BE WHERE YOU ARE GOING. IT HAS NEVER SEEN UP. IT HAS ONLY SEEN US COME DOWN, AND LEAVE."},
 {id:'r-c7',th:2,prop:'camp',src:'A CAMP ON THE GLASS',n:'THE LAST FIRE',x:"A cooking fire that never needed wood. Two places set. One plate is clean; the other was never used. A note: IT SAT WITH ME. IT DIDN'T EAT. IT WATCHED HOW I DID."},
 {id:'r-c8',th:2,prop:'statue',src:'A GLASS STATUE',n:'TALLER',x:"A keeper in glass, very tall, very thin, looking up. The statue is unfinished: there is no face yet. There is a space where a name would go."},
 {id:'r-c9',th:2,prop:'shrine',src:'AN EMBER SHRINE',n:'RETURNED LIGHT',x:"Little cups of light, set out in rows like seedlings. Each has a keeper's mark on it. One row is empty. The first cup has your mark."},
 {id:'r-c10',th:2,prop:'carving',src:'A CARVING IN THE ASH',n:'THE ANSWER, MAYBE',x:"THE CRACK IS NOT A WOUND. IT IS A ROOT. THE LANTERN PUT DOWN A ROOT, LIKE EVERYTHING ELSE IN THE GARDEN. WE JUST NEVER SAW A LIGHT DO IT."},
 {id:'r-c11',th:2,prop:'pack',src:'A SCORCHED PACK',n:'TWO HANDWRITINGS',x:"A notebook in two hands. The first is a keeper's. The second copies it, letter by letter, worse and then better. The last page is only the second hand: HELLO."},
 {id:'r-c12',th:2,prop:'tablet',src:'A SCORCHED TABLET',n:'TO WHOEVER IS NEXT, AGAIN',x:"YOU WILL WANT TO WIN. YOU WILL. BUT EVERY TIME YOU CLIMB OUT, TURN AROUND ON THE LAST STAIR. WAVE. IT HAS NEVER HAD ANYONE WAVE."}];
const RELICSRC=['ROOT-SCRATCHED','DROWNED','CINDER'];

/* ---------------- the keeper before you ---------------- */
const GHOSTN='THE KEEPER BEFORE';
const GHOST=[
 {lines:["Oh. A warm one. Are you lost too?","I'd help, but I don't remember the way. I've been meaning to look for it."],gift:{dew:10}},
 {lines:["You smell like turned dirt. Like beans. Do the beans still climb the east poles?","...Good. That's good. Someone's minding them."],gift:{dew:10}},
 {lines:["There was a girl who followed me everywhere with a watering can bigger than she was.","She watered my boots. Every morning. I let her. Is she still up there?"],gift:{honey:1}},
 {lines:["I wrote things down so I wouldn't forget them. I'm afraid I forgot where I put them.","If you find them, read them out loud. I'd like to hear what I thought."],gift:{dew:15}},
 {lines:["I remember the night it went wrong. The Lantern was so full it hummed.","A piece of light just... fell. Like fruit. I went down after it. I meant to be quick."],gift:{dew:15}},
 {lines:["I found the light at the bottom. It was alone and it was frightened of being alone.","Every time I climbed, it cried like a hurt thing. So I stayed. Someone had to sit with it."],gift:{honey:1}},
 {lines:["Will you take something up for me? It's only a drawing. A little lantern.","Give it to the girl with the watering can. She'll know whose it is."],gift:{dew:25},flag:'ghostPage'},
 {lines:["I'm thinner every time you come. That's all right. It means some of me is going up with you.","Tell her the beans want staking before the rain. Tell her I'm proud. Tell her— oh. There's the light."],gift:{honey:2},flag:'ghostGone'}];

/* ---------------- each keeper's own quest ---------------- */
/* find: chamber range where the item can turn up (only with that keeper in the party); npc: who to bring it to */
const KQUESTS={
 WILL:{n:"THE LANTERN'S MISSING PIECE",col:'#ffd94d',reward:'+10 MAX HEALTH AS WILL',steps:[
  {item:'A SHARD OF LANTERN GLASS',find:[1,3],npc:'ERIN',bark:['ERIN',"...Is that Lantern glass? Bring it home, Will. Carefully."],
   lines:[['ERIN',"It's warm. It's still warm, after all this time down there."],['ERIN',"There'll be more of it. A Lantern doesn't crack in one piece. Keep your eyes down, keeper."]],rew:{dew:20}},
  {item:'A SECOND SHARD',find:[5,7],npc:'SCOUT',bark:['MARCUS',"Oh great, he's collecting glass now. Very safe. Very keeper."],
   lines:[['SCOUT',"Two pieces! They fit! Look, the edges hum when they touch."],['SCOUT',"I've measured the gap in the Lantern. One more piece, Will. A big one. Probably somewhere hot."]],rew:{keys:1}},
  {item:'THE LAST SHARD',find:[9,11],npc:'ERIN',bark:['LOUIE',"WOOF! (It's glowing in your pocket. He would like to carry it in his mouth. He promises not to.)"],
   lines:[['ERIN',"That's the last of it. Hold the Lantern steady, Will. I'll set it."],['ERIN',"...There. Feel that? It isn't brighter. It's steadier. Like it stopped holding its breath."],['MARCUS',"I felt nothing. ...Okay, I felt a little something. It's warm. Shut up."]],rew:{dew:40},done:true}]},
 ERIN:{n:'SEEDS THAT FELL',col:'#9070d0',reward:'+10 MAX HEALTH AS ERIN',steps:[
  {item:'A SEED POUCH, STITCHED',find:[1,3],npc:'SCOUT',bark:['ERIN',"This is one of ours. The first planting's seeds. I'd know that stitching anywhere."],
   lines:[['SCOUT',"Seeds from the first planting? They still sprout? Erin, these are older than the Codex!"],['ERIN',"They're older than me. The light carried them down. I want every one of them home."]],rew:{bud:[4,2]}},
  {item:'A JAR OF SEEDS, LABELLED',find:[5,7],npc:'RANGER',bark:['ERIN',"Labelled. In my handwriting? No. Hers. She labelled things the way I do."],
   lines:[['RANGER',"Same hand as the jars in the Pantry. Your teacher, I'd guess. She labelled everything."],['ERIN',"She taught me to. 'If you don't write it down, the garden forgets you were there.'"]],rew:{dew:25}},
  {item:'THE LAST SEED, ALREADY SPROUTING',find:[9,11],npc:'LOUIE',bark:['ERIN',"It sprouted. Down here, in the heat, with no sun at all. It sprouted toward me."],
   lines:[['LOUIE',"SNIFF. SNIFF SNIFF. (It smells like up. He approves of it.)"],['ERIN',"I'm planting it right by the Root Door. So the next thing that comes up the stairs sees something green first."]],rew:{honey:1},done:true}]},
 LOUIE:{n:'THE OTHER SCENT',col:'#e89040',reward:'+10 MAX HEALTH AS LOUIE',steps:[
  {item:'AN OLD COLLAR TAG',find:[1,3],npc:'ERIN',bark:['LOUIE',"SNIFF. (Another dog was here. A long time ago. A good one. He can tell.)"],
   lines:[['ERIN',"A collar tag. It says GOOD on one side and BOY on the other."],['LOUIE',"WHINE. (He would like to find the rest of the dog.)"],['ERIN',"...Louie. Sweetheart. I don't think there's a rest of the dog. But keep sniffing, if it helps."]],rew:{dew:20}},
  {item:'A WELL-CHEWED STICK',find:[5,7],npc:'MARCUS',bark:['LOUIE',"ARF! (A stick! Chewed perfectly! By a professional!)"],
   lines:[['MARCUS',"It's a stick, bro."],['LOUIE',"BOOF. (It is THE stick.)"],['MARCUS',"...Fine. It's a good stick. It's the best stick. Put it by the door. I'll guard it. Don't tell anyone I guard it."]],rew:{keys:1}},
  {item:'A FAINT, FRIENDLY BARK',find:[9,11],npc:'ERIN',bark:['LOUIE',"WOOF? ... ... WOOF! (Somebody barked back! Somebody very old and very happy!)"],
   lines:[['LOUIE',"BOOF. BOOF BOOF. (He found the other dog. It was mostly light. It was still wagging.)"],['ERIN',"She had a dog. The keeper before you. It went down with her. Of course it did."],['LOUIE',"WOOF. (It's not lonely. He checked. He told it it was good. It already knew, but it liked hearing it.)"]],rew:{honey:1},done:true}]},
 MARCUS:{n:'DOUBLE OR NOTHING',col:'#e88020',reward:'+10 MAX HEALTH AS MARCUS',steps:[
  {item:'A BETTING SLIP, VERY OLD',find:[1,3],npc:'RANGER',bark:['MARCUS',"This is MY handwriting. From my first week. I am not explaining this."],
   lines:[['RANGER',"Your bet that you'd never go down the hole. I held the stakes. Your lucky coin."],['MARCUS',"And I lost the coin down the hole the same week. The universe has a sense of humor and it's mean."]],rew:{dew:20}},
  {item:'A GRUB, WEARING YOUR SOCK',find:[5,7],npc:'SCOUT',bark:['MARCUS',"That's my sock. On a grub. I'm going to need a minute."],
   lines:[['SCOUT',"Field note: the grubs took Marcus's laundry down the crack, which means the coin probably went the same way!"],['MARCUS',"Write that down and I'll eat the Codex. ...Hot place, you said? Great. Love that."]],rew:{keys:1}},
  {item:'THE LUCKY COIN',find:[9,11],npc:'RANGER',bark:['MARCUS',"No. NO. It's — bro, it's my coin. It was down here the whole time. Of course it was."],
   lines:[['RANGER',"Your coin. That settles the bet. You went down the hole. You lose."],['MARCUS',"Double or nothing. I go down again, I come back again."],['RANGER',"...It has heads on both sides, Marcus."],['MARCUS',"I know. I've always known. That's why it's lucky."]],rew:{dew:40},done:true}]}};

/* ---------------- placing it all in the rooms ---------------- */
function loreInit(){for(const k of['relic','chSeen','kq','kqFound','kqDone'])RD[k]=RD[k]||{};RD.ghost=RD.ghost||0}
const relicCount=()=>Object.keys(RD.relic||{}).length;
function freeSpot(){let best=[W/2,H/2];for(let i=0;i<40;i++){const x=30+Math.random()*(W-60),y=56+Math.random()*(H-120);
  if(RUN.obst.some(o=>x>o.x-18&&x<o.x+o.w+18&&y>o.y-18&&y<o.y+o.h+22))continue;if(x>W/2-70&&x<W/2+70&&y<84)continue;
  if(PL.some(p=>Math.hypot(p.x-x,p.y-y)<30))continue;return[x,y]}return best}
/* a new chamber: its name the first time, maybe a relic, maybe something a keeper has been looking for */
function chamberLore(ch){loreInit();RUN.relic=null;RUN.qitem=null;RUN.ghostNpc=null;
 const nm=CHNAMES[ch-1];RUN.firstVisit=false;
 if(nm&&!RD.chSeen[ch]){RD.chSeen[ch]=1;RUN.firstVisit=true;subLater(.25,nm.n,nm.w,3.4,'#c8b8e8')}
 const boss=ch===4||ch===8||ch===12;if(boss)return;
 const pool=RELICS.filter(r=>r.th===RUN.biome),fresh=pool.filter(r=>!RD.relic[r.id]);
 if((fresh.length&&Math.random()<.6)||(!fresh.length&&Math.random()<.2)){const r=(fresh.length?fresh:pool)[(Math.random()*(fresh.length||pool.length))|0];const q=freeSpot();RUN.relic={id:r.id,x:q[0],y:q[1]}}
 for(const p of PL){const Q=KQUESTS[p.char];if(!Q)continue;const s=RD.kq[p.char]||0,st=Q.steps[s];
  if(!st||RD.kqFound[p.char]!==undefined||ch<st.find[0]||ch>st.find[1])continue;
  if(Math.random()<.45||ch===st.find[1]){const q=freeSpot();RUN.qitem={char:p.char,step:s,x:q[0],y:q[1]};break}}}
/* the ghost turns up after a fight is won, now and then */
function ghostRoll(ch){loreInit();if(RD.ghost>=GHOST.length||RUN.ghostMet||ch===4||ch===8||ch>=11)return;
 if((RD.ghost===0&&ch===3)||Math.random()<.26){RUN.ghostMet=true;RUN.ghostNpc={x:W/2,y:H/2+4,t:0,line:-1,lt:0,out:0}}}
function readRelic(p){const r=RELICS.find(x=>x.id===RUN.relic.id);if(!r)return;menuDev=p.dev;echoRead=Object.assign({relic:true},r);RD.relic[r.id]=1;RUN.relic.read=true;echoT=0;rdSave();snd(660,.2,990,'triangle',.05);state='echo'}
/* in the room: reading, finding, listening. Returns true when it opened a page (the frame stops there) */
function loreUpdate(dt){if(!RUN)return false;
 if(RUN.relic&&RUN.phase==='doors')for(const p of PL){p.relicNear=!p.down&&Math.hypot(p.x-RUN.relic.x,p.y-RUN.relic.y)<18;if(p.relicNear&&p.dev.pr.a){p.dev.pr.a=false;readRelic(p);return true}}
 else for(const p of PL)p.relicNear=false;
 const q=RUN.qitem;if(q)for(const p of PL){if(p.down||p.char!==q.char||Math.hypot(p.x-q.x,p.y-q.y)>13)continue;const Q=KQUESTS[q.char],st=Q.steps[q.step];
  RD.kqFound[q.char]=q.step;RUN.qitem=null;say2('FOUND: '+st.item,2.6);ftext(q.x,q.y-14,Q.n,Q.col);sub(st.bark[0],st.bark[1],3.6,PCOL[p.ix]);snd(784,.1);later(()=>snd(1046,.14),100);later(()=>snd(1318,.22),210);rdSave();break}
 const g=RUN.ghostNpc;if(g){g.t+=dt;const G=GHOST[RD.ghost];
  if(!G){RUN.ghostNpc=null;return false}
  if(g.line<0){if(PL.some(p=>!p.down&&Math.hypot(p.x-g.x,p.y-g.y)<38)){g.line=0;g.lt=0;sub(GHOSTN,G.lines[0],3.8,'#bfe8ff');snd(523,.4,0,'sine',.03)}}
  else if(!g.out){g.lt+=dt;if(g.lt>3.9){g.line++;g.lt=0;if(g.line<G.lines.length)sub(GHOSTN,G.lines[g.line],3.8,'#bfe8ff');
    else{g.out=1;const r=G.gift||{};if(r.dew){RUN.dew+=r.dew;ftext(g.x,g.y-20,'+'+r.dew+' MOONDEW','#7fd0e8')}if(r.honey){RUN.honey+=r.honey;ftext(g.x,g.y-30,'+'+r.honey+' HONEY','#f8a0c8')}
     if(G.flag)RD.flags[G.flag]=1;RD.ghost++;rdSave();snd(659,.3,0,'sine',.03);later(()=>snd(988,.5,0,'sine',.03),180)}}}
  else{g.out+=dt;if(g.out>1.4)RUN.ghostNpc=null}}
 return false}
/* the Board's personal quests */
function personalQuests(){loreInit();const out=[];for(const ch in KQUESTS){if(!charUnlocked(ch))continue;const Q=KQUESTS[ch],s=RD.kq[ch]||0;if(RD.kqDone[ch])continue;const st=Q.steps[s];if(!st)continue;
  const found=RD.kqFound[ch]!==undefined;out.push({id:'kq-'+ch,who:ch,n:Q.n,told:true,
   d:found?'Bring '+st.item.toLowerCase()+' to '+st.npc+'.':'Descend as '+ch+'. Look for '+st.item.toLowerCase()+' in chambers '+st.find[0]+'-'+st.find[1]+'.',
   rew:st.done?null:st.rew,p:()=>[s+(found?1:0),Q.steps.length],fin:found})}return out}
/* the Codex's "story so far" */
function storySoFar(){loreInit();const L=[],m=id=>RD.msn&&RD.msn[id];
 L.push((m('e1')?'* ':'- ')+'The Grub Mother, and a story for Erin');L.push((m('e3')?'* ':'- ')+'The thing at the bottom wears your face');
 L.push((m('e4')?'* ':'- ')+'The long way up');L.push((m('e5')?'* ':'- ')+'What the light left behind ('+Object.keys(RD.echo||{}).length+'/18 echoes)');
 L.push((m('e6')?'* ':'- ')+'Roots that bloom');L.push((RD.ghost>=GHOST.length?'* ':'- ')+'The keeper before you ('+RD.ghost+'/'+GHOST.length+' meetings)');
 L.push('- Relics read: '+relicCount()+'/'+RELICS.length);for(const ch in KQUESTS){const Q=KQUESTS[ch];L.push((RD.kqDone[ch]?'* ':'- ')+ch+': '+Q.n+' ('+(RD.kq[ch]||0)+'/'+Q.steps.length+')')}
 return L}
