/* =====================================================================
   ROOTDEEP 64 — story
   Missions, conversations that fire off what the keeper has actually
   done, lore found in the deep, and things the bosses and gods say.

   WILL — READ THIS: almost every word in this file is new writing by
   Claude, not canon you handed over. It is built only on what Rootdeep
   v2.9 already says (the Lantern cracked downward and something eats
   the light; the gods are the sprout types grown old; the Grub Mother
   is Thornback's mother; the Hollow Keeper wears the keeper's face and
   collects them; keepers before came back changed; "one day the roots
   will bloom instead of bite"). The cartridge's own LINES are untouched
   in data.js and still play as the everyday chatter. Scout and Ranger
   are kept to errands and reactions, no storyline of their own, since
   they are placeholders. Nothing from the Pocket Lantern story notes
   (souls, Bibi) is used here. Cut or rewrite anything: it is all data.

   Shapes:
   MISSIONS  {id,who,n,d,need,p:()=>[have,want],rew,ask:[lines],done:[lines]}
   EVENTS    {id,who,when:()=>bool,lines,rew}     (each plays once)
   ECHOES    {id,th,n,x}                           (th: 0 burrows 1 vault 2 core)
   a line is [speaker, text]
   ===================================================================== */
'use strict';
const ST=()=>RD.stats,stn=k=>RD.stats[k]||0,bk=id=>(RD.bossK&&RD.bossK[id])||0,kk=k=>(RD.killK&&RD.killK[k])||0,dt2=k=>(RD.diedTo&&RD.diedTo[k])||0;
const echoCount=()=>Object.keys(RD.echo||{}).length;
const rewTxt=r=>!r?'':[r.dew?'+'+r.dew+' MOONDEW':'',r.keys?'+'+r.keys+' KEY'+(r.keys>1?'S':''):'',r.honey?'+'+r.honey+' HONEY':'',r.bud?'+'+r.bud[1]+' '+TYPES[r.bud[0]].n+' SPROUT'+(r.bud[1]>1?'S':''):''].filter(Boolean).join('  ');

/* ---------------- missions ---------------- */
const MISSIONS=[
 /* Erin: the spine of it */
 {id:'e1',who:'ERIN',n:'A STORY, NOT JUST DEW',d:'Put the Grub Mother down and come back to tell it.',p:()=>[Math.min(1,bk('mother')),1],rew:{dew:25,honey:1},
  ask:[['ERIN',"I meant it, you know. Bring me back a story. Start with whatever is chewing through my roots at the bottom of the Burrows."]],
  done:[['ERIN',"She was that big? And the little ones just... kept coming out of her?"],['ERIN',"Thornback used to nap under my bean poles. I never once wondered where he came from. I should have."],['ERIN',"That's a story. Here. Stories get paid."]]},
 {id:'e2',who:'ERIN',n:'THE BED REMEMBERS',need:'e1',d:'Bank 10 sprouts from your runs.',p:()=>[Math.min(10,stn('budsBanked')),10],rew:{bud:[4,2]},
  ask:[['ERIN',"The pods you find down there are ours. Washed down when the Lantern cracked, every one. Bring ten home and I'll show you something."]],
  done:[['ERIN',"Ten. Look at the bed, keeper. They lean toward the door when you leave. I didn't teach them that."],['ERIN',"Take these two with you. They asked. Don't look at me like that, they asked."]]},
 {id:'e3',who:'ERIN',n:'BE KIND TO IT',need:'e2',d:'Stand in front of the Hollow Keeper.',p:()=>[RD.seen.hollow?1:0,1],rew:{honey:2},
  ask:[['ERIN',"There's a thing at the very bottom. The others who went down wrote about it, the ones who could still write. I need to know if it's true. Go and look at it."]],
  done:[['ERIN',"It wore your face."],['ERIN',"...I know, because the last keeper told me it wore his. And the one before said hers. It doesn't have one of its own, Will. It never did."],['ERIN',"Eat something sweet. You're grey."]]},
 {id:'e4',who:'ERIN',n:'THEN HIT IT. HARD.',need:'e3',d:'Escape the deep.',p:()=>[Math.min(1,stn('escapes')),1],rew:{dew:60,keys:1},
  ask:[['ERIN',"I said be kind to it and I meant that too. But it is standing on the only way out, and I want you home. So."]],
  done:[['ERIN',"You came up the long way. You're the first one who came up the long way with the same eyes."],['LOUIE',"BOOF. (He never doubted. He doubted a little. He is over it.)"],['ERIN',"Look up. The Lantern's a shade warmer. You carried some of it back and didn't even feel it, did you?"]]},
 {id:'e5',who:'ERIN',n:'WHAT THE LIGHT LEFT',need:'e4',d:'Find 9 echoes in the deep.',p:()=>[Math.min(9,echoCount()),9],rew:{dew:50},
  ask:[['ERIN',"The ones before you left notes down there. Scratched in roots, mostly. I want them. All the ones you can carry in your head."]],
  done:[['ERIN',"So nobody is eating the light. It's just falling. Down a crack, like water, into a room with nothing in it."],['ERIN',"And the thing at the bottom is what light turns into when it's alone that long. Oh. Oh, that's so much worse than a monster."]]},
 {id:'e6',who:'ERIN',n:'BLOOM INSTEAD OF BITE',need:'e5',d:'Escape the deep three times.',p:()=>[Math.min(3,stn('escapes')),3],rew:{dew:100,honey:2},
  ask:[['ERIN',"Every time you come up the long way, you bring some back. So do it again. And again. I'll count. I've got a garden's worth of patience and one keeper."]],
  done:[['ERIN',"Three. Come here. Look at the floor."],['ERIN',"That's a root. It came up through the boards this morning, and it didn't bite anything. It flowered."],['MARCUS',"It's a weed."],['ERIN',"It's a flower, Marcus."],['MARCUS',"...It's a nice weed."],['ERIN',"I told you. One day the roots would bloom instead of bite, and you'd be why. Now go back down. It's lonely, and you're the only face it knows."]]},
 /* Marcus: bets against you, pays when he loses */
 {id:'m1',who:'MARCUS',n:'PROVE ME WRONG',d:'Reach chamber 5.',p:()=>[Math.min(5,stn('maxCh')),5],rew:{dew:20},
  ask:[['MARCUS',"Bro. I got a bet running with the dog. I say you never see water. He says WOOF. Go make one of us rich."]],
  done:[['MARCUS',"You saw the Vault. Great. I owe a dog twenty dew."],['LOUIE',"ARF. (He will take it in snacks.)"],['MARCUS',"Take it. Take it before I think about it."]]},
 {id:'m2',who:'MARCUS',n:'SEE ONE, SEND ONE',need:'m1',d:'Fell 100 foes.',p:()=>[Math.min(100,stn('kills')),100],rew:{keys:2},
  ask:[['MARCUS',"New bet. A hundred of them. Not ninety. I counted the grubs once and there were more grubs than my will to live, so, a hundred."]],
  done:[['MARCUS',"A hundred. I checked Scout's little book. I hate that the book was right."],['MARCUS',"Here's two keys. I found them. Do not ask where. Do not ask whose."]]},
 {id:'m3',who:'MARCUS',n:'ONE STAR',need:'m1',d:'Die 5 times. He is collecting reviews.',p:()=>[Math.min(5,stn('deaths')),5],rew:{honey:1},
  ask:[['MARCUS',"I'm writing a review of the deep. I need more data. Go die a few times. For journalism."]],
  done:[['MARCUS',"Five deaths. 'Would not recommend. Staff was rude. Keeper kept coming back.' One star."],['MARCUS',"...Here. It's honey. It's not a gift. I just don't like honey. Shut up."]]},
 {id:'m4',who:'MARCUS',n:'TEAM DEEP',need:'m2',d:'Drown the Drowned King.',p:()=>[Math.min(1,bk('king')),1],rew:{dew:40},
  ask:[['MARCUS',"There's a king down there, bro. Underwater. I looked it up, you can't be a king underwater, that's just a guy in a puddle. Go tell him."]],
  done:[['MARCUS',"You beat a king. In his own puddle. That's the most disrespectful thing I've ever heard and I'm proud of you. No I'm not. Take the dew."]]},
 {id:'m5',who:'MARCUS',n:'FINE.',need:'m4',d:'Escape with the Pact at heat 2 or higher.',p:()=>[Math.min(2,stn('heatEsc')),2],rew:{dew:80},
  ask:[['MARCUS',"Okay so you got out. Once. On easy. The gate over there makes it worse on purpose. Do it worse. Then we'll talk."]],
  done:[['MARCUS',"You made it harder and did it anyway."],['MARCUS',"..."],['MARCUS',"Fine. FINE. You're good at this. That's the only time I'm saying it and if you tell Erin I'll say you hit your head."]]},
 /* Louie */
 {id:'l1',who:'LOUIE',n:'SNACKS FROM THE DEEP',d:'Carry 3 Honey out of the deep, any way you can.',p:()=>[Math.min(3,stn('honeyFound')),3],rew:{bud:[3,2]},
  ask:[['LOUIE',"RUFF! (Translation: the deep has snacks. He can smell them through the floor. Bring three. Any three.)"]],
  done:[['LOUIE',"SNIFF. SNIFF SNIFF. (You smell like three honeys. He is not asking for them. He is looking at them.)"],['LOUIE',"ARF! (He dug these up for you. They were in the floor. They are yellow and fast, like him.)"]]},
 {id:'l2',who:'LOUIE',n:'THE GOOD STICK',need:'l1',d:'Land 10 dash strikes.',p:()=>[Math.min(10,stn('dives')),10],rew:{keys:1},
  ask:[['LOUIE',"WOOF. (Translation: run very fast, then jump on it. This is the whole of what he knows. It has never failed.)"]],
  done:[['LOUIE',"BOOF! BOOF! (Ten times! You ran fast and jumped on it ten times! You are also a dog now. He doesn't make the rules.)"]]},
 {id:'l3',who:'LOUIE',n:'HE ALWAYS WINS',need:'l1',d:'Beat the Grub Mother 3 times.',p:()=>[Math.min(3,bk('mother')),3],rew:{dew:30,honey:1},
  ask:[['LOUIE',"WHINE... (He dreams of chasing her. In the dream he wins three times. He would like the dream to be true. He can't go. You go.)"]],
  done:[['LOUIE',"AROOOO. (Three. Just like the dream. He is going to lie down now and have it again.)"]]},
 {id:'l4',who:'LOUIE',n:'TOLD NO. DAILY.',need:'l3',d:'Escape the deep as LOUIE.',p:()=>[(RD.charEsc&&RD.charEsc.LOUIE)?1:0,1],rew:{dew:60},
  ask:[['LOUIE',"WHINE? (He would simply like to go down too.)"],['ERIN',"...Twenty sprouts home safe, and he walks them every one. If he's earned the door, Louie, I can't keep telling you no."]],
  done:[['LOUIE',"WOOF. (He went all the way down. It did not wear his face. It did not know how. He thinks it tried to and got confused and sat.)"],['ERIN',"It sat?"],['LOUIE',"BOOF. (It sat. He told it it was good. Somebody should.)"]]},
 /* Ranger and Scout: errands only */
 {id:'r1',who:'RANGER',n:'THREE, SEVEN, TEN',d:'Fell 3 elites.',p:()=>[Math.min(3,stn('elites')),3],rew:{keys:1},
  ask:[['RANGER',"Chambers three, seven and ten. Something bigger than the rest stands guard in each. Three of those and you've earned a key off my ring."]],
  done:[['RANGER',"Three guards down. Common graves are for cowards. Here's your key."]]},
 {id:'r2',who:'RANGER',n:'MARK YOUR TURNS',need:'r1',d:'Clear 30 chambers.',p:()=>[Math.min(30,stn('chambers')),30],rew:{dew:30},
  ask:[['RANGER',"The paths shift. Walk enough of them and your feet learn what your head can't. Thirty chambers. Then tell me I'm wrong."]],
  done:[['RANGER',"Thirty. You've stopped looking at the walls when you walk in. Good. That's the door patrol's dew, don't spend it on Marcus."]]},
 {id:'r3',who:'RANGER',n:'A STRING IS A SQUAD',need:'r1',d:'Bring 6 buds home from a single run.',p:()=>[Math.min(6,stn('maxBank')),6],rew:{honey:1},
  ask:[['RANGER',"Six buds at your back is a full squad. Getting them home in one piece is the job. Anyone can collect."]],
  done:[['RANGER',"All six, home. You counted them at every door, didn't you. Good. Honey, from the crate. They've earned it more than you."]]},
 {id:'s1',who:'SCOUT',n:'FIELD NOTES',d:'Meet all 6 kinds of foe.',p:()=>[Object.keys(FOES).filter(k=>RD.seen[k]).length,6],rew:{dew:20},
  ask:[['SCOUT',"I have six blank pages and a deadline I invented! Go get looked at by one of everything, please. For science."]],
  done:[['SCOUT',"Six for six! The wisp page caught fire, which honestly is the best data I could have asked for."]]},
 {id:'s2',who:'SCOUT',n:'THE CRAB IS UNDECIDED',need:'s1',d:'Fell 15 Bubble Crabs.',p:()=>[Math.min(15,kk('crab')),15],rew:{bud:[1,2]},
  ask:[['SCOUT',"Thirty-nine species want to eat you and the crab is undecided. I need a bigger sample. Fifteen should settle it."]],
  done:[['SCOUT',"Fifteen crabs and the finding is: the crab is still undecided. It just has a shield about it. These two were in the last shell. Hi, little guys!"]]},
 {id:'s3',who:'SCOUT',n:'PEER REVIEW',need:'s1',d:'Discover 20 different boons.',p:()=>[Math.min(20,Object.keys(RD.boonSeen).length),20],rew:{dew:40},
  ask:[['SCOUT',"The old sprouts down there keep handing you things. I want a list. Twenty entries and I can publish. To Marcus. Who will hate it."]],
  done:[['SCOUT',"Twenty boons catalogued! Marcus read it. One star. He underlined the star."]]},
 {id:'s4',who:'SCOUT',n:'SAMPLE SIZE',need:'s1',d:'Beat a boss with two or more keepers.',p:()=>[Math.min(1,stn('coopBoss')),1],rew:{honey:1},
  ask:[['SCOUT',"One keeper is an anecdote. Two is a study! Take a friend down and bring me a boss. I'll hold the door. From here. Up here."]],
  done:[['SCOUT',"Two keepers, one boss, zero fatalities worth footnoting. That's publishable! Honey for the both of you. Share. I'm watching."]]}];
const missionById=id=>MISSIONS.find(m=>m.id===id);
const missionOpen=m=>!RD.msn[m.id]&&(!m.need||RD.msn[m.need])&&(m.who==='ERIN'||stn('runs')>=1);
const missionDone=m=>{const q=m.p();return q[0]>=q[1]};
function openMissions(){return MISSIONS.filter(missionOpen)}

/* ---------------- conversations that wait for you ---------------- */
const EVENTS=[
 /* first time back */
 {id:'death1',who:'ERIN',when:()=>stn('deaths')>=1,lines:[['ERIN',"There you are. I dug you out of the potato bed. You come up wherever the roots are softest, it turns out."],['ERIN',"Nobody stays down there, keeper. That's the one mercy. It doesn't want you. It only wants what you're carrying."]]},
 {id:'death1m',who:'MARCUS',when:()=>stn('deaths')>=1,lines:[['MARCUS',"Oh, you're alive. I already told everyone you weren't. This is embarrassing for me."]]},
 {id:'death3',who:'ERIN',when:()=>stn('deaths')>=3,lines:[['ERIN',"That's a few times now I've pulled you out of the dirt. I'm not complaining. The potatoes are complaining."],['ERIN',"Spend what you bring back. The Mirror isn't vanity. It's the only thing down here that remembers you between tries."]]},
 {id:'death15',who:'MARCUS',when:()=>stn('deaths')>=15,lines:[['MARCUS',"Fifteen. I've started a second notebook."],['MARCUS',"I'm not worried. I just think it's weird that you're not worried. One of us should be and it's not gonna be me."]]},
 /* the Burrows and the Mother */
 {id:'mother_seen',who:'RANGER',when:()=>RD.seen.mother&&!bk('mother'),lines:[['RANGER',"You saw her, then. Thornback's mother. I've only ever seen the tunnels she leaves."],['RANGER',"She charges in a straight line and she can't turn. Stand still until she's committed. Then don't be there."]]},
 {id:'mother_died',who:'MARCUS',when:()=>dt2('mother')>=1,lines:[['MARCUS',"You got killed by somebody's MOM, bro."],['MARCUS',"I'm not even gonna do a bit. It's already perfect."]]},
 {id:'mother_down',who:'SCOUT',when:()=>bk('mother')>=1,lines:[['SCOUT',"New Codex page! 'The Grub Mother: is she angry, or just hungry?' Finding: yes."],['SCOUT',"Ranger says the grubs only started biting roots when the light stopped reaching them. I wrote that down and then felt bad for a while."]]},
 /* the Vault and the King */
 {id:'vault',who:'ERIN',when:()=>stn('maxCh')>=5,lines:[['ERIN',"You're damp. You found the Vault."],['ERIN',"That water is ours too. Dew that should've been on the leaves by morning. It's been running down that crack every night since the Lantern split."]]},
 {id:'king_seen',who:'SCOUT',when:()=>RD.seen.king&&!bk('king'),lines:[['SCOUT',"A king! With a crown! Did he say what he's king of?"],['SCOUT',"...He doesn't know either? Oh. Oh no. I'm not writing that down."]]},
 {id:'king_died',who:'MARCUS',when:()=>dt2('king')>=1,lines:[['MARCUS',"He LEAPS. It says it on the screen. In capital letters. 'HE LEAPS.' And you stood there."],['MARCUS',"I'm starting to think the deep's fine and you're the problem."]]},
 {id:'king_down',who:'ERIN',when:()=>bk('king')>=1,lines:[['ERIN',"The last keeper wrote about a king. She said he followed the water down to bring it back, and then he sat on it instead."],['ERIN',"I don't think he was a bad king. I think he got tired at exactly the wrong moment. Be careful where you sit down, keeper."]]},
 /* the Core and the Hollow */
 {id:'core',who:'RANGER',when:()=>stn('maxCh')>=9,lines:[['RANGER',"Your boots are smoking. You made the Core."],['RANGER',"That heat is lantern-light. All of it that ever fell, pooled at the bottom with nowhere to go. Bramble taught me the way through is usually on fire. He didn't say it'd be ours."]]},
 {id:'hollow_died',who:'MARCUS',when:()=>dt2('hollow')>=1,lines:[['MARCUS',"So you lost a fight. To you."],['MARCUS',"I've been saying you were your own worst enemy since you got here and everybody said 'Marcus, that's unkind.' Who's unkind NOW."]]},
 {id:'hollow_died2',who:'ERIN',when:()=>dt2('hollow')>=2,lines:[['ERIN',"It dashes when you'd dash. Doesn't it. It learned that from you, on the way down, every run."],['ERIN',"So do something you never do. Stand still. Hold a swing. Be a stranger to it for one breath."]]},
 /* escapes */
 {id:'esc1m',who:'MARCUS',when:()=>stn('escapes')>=1,lines:[['MARCUS',"You got out."],['MARCUS',"I had a whole speech for if you didn't. It was really good. Now nobody gets to hear it. You ruin everything."]]},
 {id:'esc1r',who:'RANGER',when:()=>stn('escapes')>=1,lines:[['RANGER',"The door whispered once after you came through. It said a name. It wasn't yours."],['RANGER',"The Heat Gate's open now. It was waiting to see if anyone could do it once before it asked for more."]]},
 {id:'esc1s',who:'SCOUT',when:()=>stn('escapes')>=1,lines:[['SCOUT',"You escaped! I measured the Lantern before and after. It's brighter. By a very small number. I've never been happier about a very small number."]]},
 {id:'esc2',who:'ERIN',when:()=>stn('escapes')>=2&&RD.msn.e4,lines:[['ERIN',"Twice now. And both times the thing at the bottom was whole again when you got there?"],['ERIN',"Then you're not killing it. You're carrying a little of it home each time, and it fills back in from all that light. Keeper... I think that's the right way round."]]},
 /* the cast takes the door */
 {id:'un_erin',who:'ERIN',when:()=>charUnlocked('ERIN'),lines:[['ERIN',"Three jars of honey and not one of them was a bribe. I noticed."],['ERIN',"If you ever want a turn up here in the warm, I know the way down. The buds listen to me. Don't tell Marcus I offered."],['MARCUS',"I heard. I hear everything. It's a curse."]]},
 {id:'un_louie',who:'LOUIE',when:()=>charUnlocked('LOUIE'),lines:[['LOUIE',"BOOF! BOOF BOOF! (Twenty home safe! He counted! He can count to twenty now, it is mostly the one number said twenty times!)"],['LOUIE',"WOOF. (The door smells like yes today.)"]]},
 {id:'un_marcus',who:'MARCUS',when:()=>charUnlocked('MARCUS'),lines:[['MARCUS',"Eight times. I've watched you go down that hole and come up through a vegetable EIGHT times."],['MARCUS',"Move. I'll do it. I'm gonna hate every second and I want you to watch."]]},
 {id:'played_marcus',who:'ERIN',when:()=>RD.charRun&&RD.charRun.MARCUS,lines:[['ERIN',"He went down. Marcus. On purpose."],['MARCUS',"I fell."],['ERIN',"You walked to the door, said 'watch this', and jumped."],['MARCUS',"I fell with confidence."]]},
 {id:'played_erin',who:'LOUIE',when:()=>RD.charRun&&RD.charRun.ERIN,lines:[['LOUIE',"WHINE. (She went down the hole. He sat on the door the whole time. The door is warm now. He would like that noted.)"]]},
 /* moves */
 {id:'super1',who:'MARCUS',when:()=>stn('supers')>=1,lines:[['MARCUS',"I felt that one through the floor. What was that."],['MARCUS',"No, don't tell me, I want to stay mad."]]},
 {id:'bike',who:'MARCUS',when:()=>RD.flags.sup_WILL,lines:[['MARCUS',"Scout says you rang a bell and a BICYCLE came."],['MARCUS',"Underground. In a cave. And it had the right of way."],['MARCUS',"I respect nothing about you and I need you to teach me that."]]},
 {id:'judge',who:'ERIN',when:()=>RD.flags.sup_LOUIE,lines:[['ERIN',"Louie, what did you DO down there? The whole Hearth lit up."],['LOUIE',"WOOF. (He judged it.)"],['ERIN',"...Was it guilty?"],['LOUIE',"BOOF. (Very.)"]]},
 {id:'heavy20',who:'RANGER',when:()=>stn('heavies')>=20,lines:[['RANGER',"You've started holding the swing before you let it go. Patience with an edge on it. The crabs' shields don't mean a thing to a blow like that. Good."]]},
 /* the Hearth's own things */
 {id:'mirror1',who:'SCOUT',when:()=>Object.keys(RD.mirror).length>=1,lines:[['SCOUT',"You used the Mirror! Did it show you you, or you-but-slightly-better? It only ever shows me my hood."]]},
 {id:'weapon2',who:'RANGER',when:()=>RD.weapons.length>=2,lines:[['RANGER',"New iron off the rack. The Blade's honest, the Maul's an argument, the Bow's a way of not being there. Carry what matches your nerve."]]},
 {id:'keep1',who:'LOUIE',when:()=>Object.keys(RD.keeps).length>=1,lines:[['LOUIE',"SNIFF. (You're carrying something of somebody's. Good. Down there is a long way from everybody.)"]]},
 {id:'bank6',who:'ERIN',when:()=>bankTotal()>=6,lines:[['ERIN',"The bed's filling up. They hum at night, did you know? All six kinds, different notes. It's the first music this room's had since the crack."]]},
 {id:'heat1',who:'RANGER',when:()=>heatTotal()>=1,lines:[['RANGER',"You've signed the Pact. The deep keeps its word, which is more than I can say for most. Whatever you made worse, it'll pay you for. Once."]]},
 {id:'coop1',who:'MARCUS',when:()=>stn('coopRuns')>=1,lines:[['MARCUS',"Oh good, there's more of you now."],['MARCUS',"Twice the keeper. Twice the eulogy. I'm gonna need a bigger notebook."]]},
 {id:'revive1',who:'ERIN',when:()=>stn('revives')>=1,lines:[['ERIN',"Scout says one of you went down and the other stood over them until they got up."],['ERIN',"That's the whole job, you know. Keeper. It was never about the Lantern."]]},
 /* echoes */
 {id:'echo1',who:'SCOUT',when:()=>echoCount()>=1,lines:[['SCOUT',"You found WRITING? Down THERE? Read it to me exactly. No, slower. No, do the voice."],['SCOUT',"I've added a page to the Codex. I'm calling them echoes because 'creepy root notes' didn't fit on the tab."]]},
 {id:'echo12',who:'SCOUT',when:()=>echoCount()>=12,lines:[['SCOUT',"Twelve echoes. I laid them out in order on the table. Then I put them away again, because in order they're a letter, and it's addressed to whoever's reading."]]},
 {id:'echoall',who:'ERIN',when:()=>echoCount()>=18,lines:[['ERIN',"That's all of them. Eighteen."],['ERIN',"She signed the last one, the keeper before you. She never told me she could draw. There's a little lantern next to her name."],['ERIN',"I'm going to press it in the big book with the flowers. Thank you for carrying her up."]]}];
/* what does this NPC have for you right now? turn-ins first, then new asks, then things that happened */
function storyNext(who){
 for(const m of MISSIONS)if(m.who===who&&missionOpen(m)&&RD.flags['mt_'+m.id]&&missionDone(m))return{id:'md_'+m.id,lines:m.done,rew:m.rew,mission:m};
 for(const m of MISSIONS)if(m.who===who&&missionOpen(m)&&!RD.flags['mt_'+m.id])return{id:'mt_'+m.id,lines:m.ask,ask:m};
 for(const e of EVENTS)if(e.who===who&&!RD.flags['ev_'+e.id]&&e.when())return{id:'ev_'+e.id,lines:e.lines,rew:e.rew};
 return null}
function storyFinish(ev){RD.flags[ev.id]=1;let msg='';
 if(ev.mission){RD.msn[ev.mission.id]=1;msg='MISSION DONE: '+ev.mission.n}
 if(ev.ask)msg='NEW MISSION: '+ev.ask.n;
 const r=ev.rew;if(r){RD.dew+=r.dew||0;RD.keys+=r.keys||0;RD.honey+=r.honey||0;if(r.bud)RD.bank[r.bud[0]]=(RD.bank[r.bud[0]]||0)+r.bud[1];snd(784,.12);later(()=>snd(1175,.25),110)}
 if(msg){joinMsg=msg+(r?'   '+rewTxt(r):'');joinT=4}
 if(ev.mission&&ev.mission.id==='e6')RD.flags.bloom=1;
 rdSave()}
/* in a run: tell the keeper the moment an errand is finished */
function missionWatch(){if(!RUN)return;for(const m of MISSIONS){if(!missionOpen(m)||!RD.flags['mt_'+m.id]||RD.flags['mw_'+m.id])continue;if(missionDone(m)){RD.flags['mw_'+m.id]=1;say2('MISSION DONE - TELL '+m.who,3);snd(784,.1);later(()=>snd(988,.1),100);later(()=>snd(1175,.2),200)}}}

/* ---------------- echoes: what the keepers before left behind ---------------- */
const ECHOTH=['ROOT-SCRATCHED NOTES','DROWNED LEDGERS','CINDER SCRIPT'];
const ECHOES=[
 {id:'b1',th:0,n:'FIRST NOTCH',x:"Day one below. The roots here grow DOWN, toward nothing. I asked one why. That's the kind of day it's been. — a keeper"},
 {id:'b2',th:0,n:'ON GRUBS',x:"The grubs didn't bite when I was small. They ate dead leaves and were shy. They aren't angry. They're in the dark with nothing to eat, and they have children."},
 {id:'b3',th:0,n:'ON PODS',x:"Found a sprout pod in the wall, alive, humming. They wash down with the light. If you're reading this, pick them up. Every one. They didn't choose to be here either."},
 {id:'b4',th:0,n:'HIS MOTHER',x:"Something huge is turning in the lowest burrow. The little ones go quiet when she moves. I think I knew her son. He was a terror in the garden. He was also somebody's baby."},
 {id:'b5',th:0,n:'ON COMING BACK',x:"Died. Woke in the cabbages. Erin was already digging. The deep sends you home every time. I think it's being polite. I think it wants the light and is sorry about the rest."},
 {id:'b6',th:0,n:'TALLER',x:"Erin says I came back taller. I measured. I did. The deep keeps something and gives you a little height for it. I can't remember what my mother's laugh sounded like."},
 {id:'v1',th:1,n:'WATERLINE',x:"This is dew. All of it. Every morning that the leaves upstairs were dry, it was down here instead. There's a whole lost summer in this room."},
 {id:'v2',th:1,n:'ITEM, ONE CROWN',x:"Found: one crown, in the shallows, too big for any head I know. Someone important came down here on purpose. Left it where I found it. It wasn't lost."},
 {id:'v3',th:1,n:'THE OLD ONES',x:"The six that speak to you down here are sprouts. The first six ever planted under the Lantern. They went down with the first light that fell and they've been growing toward it ever since."},
 {id:'v4',th:1,n:'WHAT THEY WANT',x:"I asked the green one why they help. She said: 'You're going down. We want to go up. Carry what we give you past the bottom, and some of us comes home in it.'"},
 {id:'v5',th:1,n:'THE KING',x:"Met him. He came to bring the water back. He told me so, very slowly, sitting on it. He's been about to stand up for longer than the garden has had a wall."},
 {id:'v6',th:1,n:'A WARNING',x:"Don't rest in the Vault. It's cool and quiet and it sounds like rain on a roof. That's how it gets you. Not teeth. Just a nice place to stop."},
 {id:'c1',th:2,n:'WARM',x:"It's warm down here like the Lantern is warm. Same warm. I held my hands out without thinking. This isn't fire. It's home, spilled."},
 {id:'c2',th:2,n:'NOTHING IS EATING IT',x:"I came down to kill whatever eats the light. There's nothing. No mouth. The light falls down the crack like water and pools here, and the pool is so alone it started to stand up."},
 {id:'c3',th:2,n:'IT HAS NO FACE',x:"Saw it. It looked like me. Then I blinked and it looked like the keeper whose notes I'd been reading. It only knows the shapes that come to visit. We're the only faces it has."},
 {id:'c4',th:2,n:'IT COPIES',x:"It dashes how I dash. Swings how I swing. It isn't mocking me. It's a child doing what the grown-up does. I hit it anyway. I'm sorry. It's standing on the way out."},
 {id:'c5',th:2,n:'THE LONG WAY',x:"When you beat it and climb out the far side, you come up warm. Check the Lantern after. I think every keeper who makes the long climb carries a cupful of it home."},
 {id:'c6',th:2,n:'TO WHOEVER IS NEXT',x:"I'm too tall now to remember much. So, you: be kind to it. Then hit it, hard, and climb. And then go back. It's so lonely. It lights up when you walk in. (a small lantern is drawn here)"}];
function nextEcho(th){return ECHOES.find(e=>e.th===th&&!RD.echo[e.id])||null}
/* a chamber gives one up now and then; a boss always does, the first time through its thread */
function echoRoll(boss){if(!RUN)return;const e=nextEcho(RUN.biome);if(!e)return;if(!(boss||RUN.elite||Math.random()<.2))return;let x=W/2,y=H/2+30;
 for(let i=0;i<30;i++){x=W/2+R(-60,60);y=H/2+R(0,50);if(!RUN.obst.some(o=>x>o.x-12&&x<o.x+o.w+12&&y>o.y-12&&y<o.y+o.h+16))break}RUN.echo={e,x,y}}
let echoRead=null,echoT=0;
function echoTake(){echoRead=RUN.echo.e;RD.echo[echoRead.id]=1;RUN.echo=null;echoT=0;rdSave();snd(660,.2,990,'triangle',.05);state='echo'}
function echoUpdate(dt){echoT+=dt;if(echoT>.3&&(pressed('a')||pressed('b')||pressed('start'))){state=RUN?'run':'codex';snd(520,.05)}}

/* ---------------- things said in the deep ---------------- */
const GODSAY={
 EMBER:["I was the first flame under the Lantern. I remember when it was only a spark and so was I.","You again. You burn a little brighter each time you fall. I notice these things.","Take the fire up with you. I've been trying to climb for three thousand years. You have legs.","When you see the Lantern, tell it Ember kept the pilot light on."],
 PEB:["...","...Keeper.","I do not hurry. I have never hurried. Take this. Go slowly. It is the only way down that lasts.","The stone above us is listening. It likes you. Stone does not like many things."],
 DEW:["Every drop in the Vault used to be a morning. Take one. It was going to be yours anyway.","You're thirsty. Everyone who comes down is thirsty and none of them drink. Drink.","I can hear the garden through you. Is it dry up there? ...Don't answer. I can hear that too.","Carry me past the king. He means well. He always meant well."],
 ZIP:["FAST. You. Good. Take it take it take it.","You're slow today. Slower than last time. I'm joking. Am I? Go!","I was a seed for one second and I've been bored ever since. Make it loud down there.","When you get out, run somewhere for no reason. For me. I never got to."],
 LEAF:["Hello, little keeper. You've got dirt on you. Good. That's where everything starts.","Erin's hands are on you. I can tell. She grows things the right way: by letting them.","We aren't gods, you know. We're the first six in the bed. We just had a very long time to think.","Take this up. Plant it by the door. If it flowers, that's me saying thank you."],
 LUCKY:["Ooh, a keeper. I had a feeling. I always have a feeling. Pick one, they're all good. Probably.","Sixth petal, sixth time's the charm, six of one. I don't know what any of that means. Here!","You found me again! What are the odds. No, really, what are they, Scout would know.","If you make it out, it wasn't luck. But let me have this one. Say it was luck."]};
function godLine(god){RD.godMet=RD.godMet||{};const n=RD.godMet[god]||0;RD.godMet[god]=n+1;const L=GODSAY[god];return L[Math.min(n,L.length-1)]}
const BOSSSAY={
 mother:{intro:["(The burrow shakes. The little ones go quiet.)","(She knows your smell now.)","(She was waiting. She has more children than last time.)"],p2:"(She calls. The walls answer.)",p3:"(She is tired. She does not stop.)",down:["(The burrow is still. The little ones don't understand yet.)","(Still again. She'll be back. Hunger always is.)"]},
 king:{intro:["I... came down... to bring it back.","You. The warm one. Did you bring the garden with you?","Has it been long? It doesn't feel long. Sit. No? ...They never sit."],p2:"This is MY water. I was... going to return it.",p3:"I am so tired, keeper. I only sat for a moment.",down:["Oh. I can stand. I'd forgotten that I could stand.","...Thank you. I'll get up properly. In a moment."]},
 hollow:{intro:["(It turns. It is wearing your face. It is trying to get the smile right.)","(It lights up when you walk in. Then it raises your sword.)","(It has been practising your dash.)","(It was waiting by the door, the way a dog waits.)"],p2:"(It copies your stance. It is very proud of it.)",p3:"(It doesn't understand why you keep hitting it. It hits back the way you taught it.)",down:["(It comes apart into warm light. Some of it follows you up the stairs.)","(It holds your face one second longer than it needs to. Then it lets go.)"]}};
const CHATTER={
 ERIN:{start:["Stay close, you lot. That goes for the buds too.","Roots growing down. That's not right. That's just not right.","I've pulled weeds meaner than this.","Mind the little ones. They're only hungry."],vault:["All this dew, and my lettuces are dry as paper.","Don't sit down. Whatever you do."],core:["It's the same warm. Oh, it's the same warm as home."],low:["I'm fine. I've had worse from a rose bush."],clear:["There. Tidy."],rev:["Up you get. I've got you."]},
 MARCUS:{start:["Oh good. Another room. I was worried we'd run out of rooms.","It smells like a foot down here. A wet foot.","I'm not scared. I'm unimpressed. They feel similar.","Bro, if I die I'm haunting the dog specifically.","Every one of these things has a mom. Think about that. I'm not."],vault:["Great, it's damp. My favorite thing. Damp.","A king. In a puddle. Okay."],core:["WHY is it HOT. We went DOWN."],low:["That one counted. I'm writing that one down."],clear:["Was that it? That was it. Embarrassing for them."],rev:["Get up. You're making us look bad. Get UP."]},
 LOUIE:{start:["WOOF. (Smells like grubs. And adventure. Mostly grubs.)","SNIFF SNIFF. (Something in here is afraid. He hopes it's them.)","ARF! (He would like to chase all of it.)"],vault:["WHINE. (Wet paws. He did not agree to wet paws.)"],core:["PANT PANT PANT. (Hot floor! Hot floor! Hot floor!)"],low:["YIP! (That was rude.)"],clear:["BOOF. (Good room. Next room.)"],rev:["LICK. LICK LICK. (Get up get up get up.)"]}};
function sub(who,txt,t,c){if(RUN)RUN.sub={who,txt,t:t||3.6,c:c||'#ffd94d'}}
function subLater(delay,who,txt,t,c){if(RUN)RUN.subQ.push({d:delay,who,txt,t,c})}
function chatter(kind,force){if(!RUN)return;const ps=alive().filter(p=>CHATTER[p.char]&&CHATTER[p.char][kind]);if(!ps.length||(!force&&Math.random()>.4))return;
 const p=ps[(Math.random()*ps.length)|0],L=CHATTER[p.char][kind];subLater(kind==='start'?1.2:.2,p.char,L[(Math.random()*L.length)|0],3.2,PCOL[p.ix])}
function bossSay(e,part){const B=BOSSES[e.bossIx],S=BOSSSAY[B.id];if(!S)return;let txt=S[part];if(Array.isArray(txt)){const n=part==='intro'?(RD.seenN&&RD.seenN[B.id]||1)-1:bk(B.id)-1;txt=txt[clamp(n,0,txt.length-1)]}
 subLater(part==='intro'?2.2:.1,B.s,txt,4.2,'#ffb0a0')}
/* how the deep signs off */
function deathLine(){const L=RD.lastRun||{};const by=L.by;
 if(by==='mother')return["TUCKED IN BY SOMEBODY'S MOTHER","SHE HAS SO MANY CHILDREN TO FEED"][stn('deaths')%2];
 if(by==='king')return["HE ONLY SAT ON YOU FOR A MOMENT","THE VAULT IS A NICE PLACE TO STOP"][stn('deaths')%2];
 if(by==='hollow')return["IT LOOKED SORRY. IT HAD YOUR FACE TO DO IT WITH","IT WILL PRACTISE THAT ONE"][stn('deaths')%2];
 return["ERIN WILL COME DIGGING. SHE ALWAYS DOES","YOU COME UP WHERE THE ROOTS ARE SOFTEST","THE DEEP SENDS YOU HOME. IT IS BEING POLITE","A LITTLE TALLER THIS TIME"][stn('deaths')%4]}
function escapeLine(){const n=stn('escapes');return n<=1?"DAWN, AND YOUR FACE IS STILL YOURS":n===2?"WARM ALL THE WAY UP THE STAIRS":n===3?"THE LANTERN KNEW YOUR STEP":"IT WALKED YOU TO THE DOOR THIS TIME"}
