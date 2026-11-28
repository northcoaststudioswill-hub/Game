/* =====================================================================
   ROOTDEEP 64 — episodes
   Short 3D scenes, played in the engine with the real cast, that happen
   back home after something in your history crosses a line: a keeper
   unlocked, a hundred foes felled, the first boss beaten, the first time
   you get out. One plays per trip home, the way a good roguelike lets the
   house react to you between runs. They are all in Codex page 7 after.
   The writing is Claude's, on top of Will's characters and canon.

   Staging: every scene is a pure function of (beat, time in beat), so an
   online guest renders the exact same shot from three numbers.
   Cast keys: a character name (WILL ERIN LOUIE MARCUS SCOUT RANGER), '@'
   for whichever keeper P1 plays, 'f:<foe>' foes, 'b:<n>' bosses,
   'p:<prop>' props and 'bud:<n>' sprouts. When '@' is one of the named
   cast, that character plays themself and their other lines drop out.
   ===================================================================== */
'use strict';
const EPZ={hearth:H-70,garden:H*.5+20,deep0:H*.5,deep1:H*.5,deep2:H*.5};
const totalOf=o=>{let n=0;for(const k in o||{})n+=o[k]||0;return n};
const topKiller=()=>{let b=null,n=0;for(const k in RD.diedTo||{})if(RD.diedTo[k]>n){n=RD.diedTo[k];b=k}
 const nm={deep:'"the deep, generally"',mother:'the Grub Mother',king:'the Drowned King',hollow:'the Hollow Keeper'};return nm[b]||'"tripped"'};
const KL=(w,e,l,m)=>({WILL:w,ERIN:e,LOUIE:l,MARCUS:m});
const EPISODES=[
 /* ---- a keeper comes home: these play first ---- */
 {id:'un_ERIN',n:"THE GARDENER'S TURN",set:'garden',card:'ERIN',when:()=>epUnlock('ERIN'),
  cast:{ERIN:[-10,0,.4],LOUIE:[22,14],MARCUS:[40,-8],'p:honey':[-30,-6],'p:honey2':[-24,-10],'p:honey3':[-36,-2]},
  beats:[{l:['ERIN',"Three jars of honey on my shelf. Not one of them was a bribe. I checked."],cam:'two',with:'MARCUS'},
   {l:['ERIN',"You keep coming home with dirt in your hair and a story in your mouth. I want my own story."],mv:{ERIN:[4,10]},cam:'close'},
   {l:['MARCUS',"Erin. You garden. Down there, the garden gardens YOU."],cam:'two',with:'ERIN'},
   {l:['ERIN',"Then I'll weed it."],act:{ERIN:'atk'},cam:'low',at:'ERIN'},
   {l:['LOUIE',"ARF! (He has already packed her a stick. It is his second best stick.)"],act:{LOUIE:'cheer'},cam:'wide'}]},
 {id:'un_LOUIE',n:'TWENTY HOME SAFE',set:'garden',card:'LOUIE',when:()=>epUnlock('LOUIE'),
  cast:Object.assign({LOUIE:[0,6,0],SCOUT:[-44,-10],ERIN:[40,-14]},...[...Array(10)].map((_,i)=>({['bud:'+(i%6)+':'+i]:[Math.cos(i/10*6.283)*20,6+Math.sin(i/10*6.283)*16]}))),
  beats:[{l:['SCOUT',"Eighteen... nineteen... twenty. Twenty sprouts home safe, and Louie counted every one."],cam:'wide',ring:1},
   {l:['LOUIE',"BOOF! (He can count to twenty now. It is mostly the one number, said twenty times.)"],act:{LOUIE:'happy'},cam:'close',ring:1},
   {l:['SCOUT',"They follow him like he's the Lantern. Maybe to them, he is."],cam:'two',with:'LOUIE',ring:1},
   {l:['ERIN',"He sits by the door every night you go down. I think he wants a turn."],cam:'two',with:'LOUIE',ring:1},
   {l:['LOUIE',"AWOO! (He is going. He has decided. He decided a while ago, honestly.)"],act:{LOUIE:'sup'},cam:'low',ring:1}]},
 {id:'un_MARCUS',n:'THE HATER GOES DOWN',set:'hearth',card:'MARCUS',when:()=>epUnlock('MARCUS'),
  cast:{MARCUS:[0,40,3.14],ERIN:[-36,10],LOUIE:[30,16]},
  beats:[{l:['MARCUS',"Eight times. I've watched you go down that hole and come back up through a vegetable EIGHT times."],cam:'wide'},
   {l:['ERIN',"Marcus. Don't."],cam:'close'},
   {l:['MARCUS',"No, I'm doing it. Somebody competent has to. Bro, I've had like forty ideas."],face:{MARCUS:'ERIN'},cam:'low',at:'MARCUS'},
   {l:['LOUIE',"WOOF? (Forty?)"],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"Forty-one. Idea forty-one: me."],act:{MARCUS:'sup'},cam:'low',at:'MARCUS'}]},
 {id:'un_WILL',n:'THE KEEPER COMES HOME',set:'garden',card:'WILL',when:()=>epUnlock('WILL'),
  cast:{WILL:[0,-90,0],ERIN:[-26,20,3.14],MARCUS:[24,24,3.14],LOUIE:[0,30,3.14]},
  beats:[{d:3.4,mv:{WILL:[0,-6]},cam:'wide',mt:3},
   {l:['ERIN',"Will? You've been gone since the Lantern cracked. We thought the road had you."],act:{LOUIE:'happy'},cam:'two',with:'WILL'},
   {l:['WILL',"The road was looking for the same thing you are. It led back here. It always does."],cam:'close'},
   {l:['MARCUS',"Great. Another one. Bro, take a number. The number is behind me."],cam:'two',with:'WILL'},
   {l:['WILL',"Then I'll go down behind you. Somebody has to carry the light back up."],act:{LOUIE:'cheer'},cam:'low',at:'WILL'}]},
 /* ---- the deep, from the other side ---- */
 {id:'mother',n:"THE MOTHER'S NIGHT",set:'deep0',when:()=>bk('mother')>=1,
  cast:{'b:0':[0,-20,0],'f:grub:1':[-80,40],'f:grub:2':[70,50],'f:grub:3':[-30,70]},
  beats:[{d:3.2,mv:{'f:grub:1':[-24,4],'f:grub:2':[24,6],'f:grub:3':[0,18]},mt:3,cam:'pan'},
   {l:['b:0',"(Hush, little ones. It came through. It came through, and it will come again.)"],cam:'low'},
   {l:['f:grub:3',"(Squeak?)"],cam:'close'},
   {l:['b:0',"(No. We do not hate it. We are the garden's history. History does not hate. It waits.)"],cam:'wide'}]},
 {id:'king',n:'A CROWN, RETURNED',set:'deep1',when:()=>bk('king')>=1,
  cast:{'b:1':[0,-24,0],'f:crab:1':[-70,50],'f:crab:2':[60,60],'p:shard':[-70,46]},
  beats:[{d:3,mv:{'f:crab:1':[-14,-2],'p:shard':[-14,-6]},mt:2.8,cam:'pan'},
   {l:['f:crab:1',"(Your Majesty. We found it in the shallows again.)"],cam:'two',with:'b:1'},
   {l:['b:1',"(Put it on the step. I will wear it when I remember why.)"],cam:'low'},
   {l:['f:crab:2',"(Was it the keeper again, Majesty?)"],mv:{'f:crab:2':[20,8]},cam:'wide'},
   {l:['b:1',"(It always is. Some kings get a kingdom. I got a door that keeps opening.)"],cam:'close'}]},
 {id:'hollow',n:'THE HOLLOW, ALONE',set:'deep2',when:()=>bk('hollow')>=1,
  cast:{'b:2':[0,10,3.14]},fx:'lamp',
  beats:[{d:3.4,cam:'pan'},
   {l:['b:2',"(I was a keeper once. Or I was what a keeper leaves behind. It is hard to tell from in here.)"],cam:'close'},
   {l:['b:2',"(It wears my steps better than I did. Good. Someone should.)"],cam:'low'}]},
 {id:'kills500',n:'WHAT THEY SAY ABOUT YOU',set:'deep0',when:()=>stn('kills')>=500,
  cast:{'f:grub:1':[-24,6,1.2],'f:beetle:1':[24,4,-1.2],'f:spitter:1':[12,-14,-.4],'f:crab:1':[-10,-16,.4]},
  beats:[{l:['f:grub:1',"(Squelch. Did everyone see it? The one with the light?)"],cam:'wide'},
   {l:['f:beetle:1',"(Saw it. Felt it. Twice. The second time was worse.)"],cam:'close'},
   {l:['f:spitter:1',"(I keep my distance. I am very good at distance. It is better at closing it.)"],cam:'close'},
   {l:['f:crab:1',"(...I think it's kind of cool, honestly.)"],cam:'low'},
   {l:['f:grub:1',"(Traitor.)"],face:{'f:grub:1':'f:crab:1','f:beetle:1':'f:crab:1','f:spitter:1':'f:crab:1'},cam:'wide'}]},
 /* ---- home reacts ---- */
 {id:'home1',n:'BACK IN BED',set:'hearth',when:()=>stn('deaths')>=1,
  cast:{'@':[-92,-10,.6],ERIN:[-60,8,-1.2],LOUIE:[-74,16],MARCUS:[-30,-8,-1.4]},
  beats:[{l:['LOUIE',"WOOF! WOOF! (You're back! You were gone a whole forever!)"],act:{'@':'down',LOUIE:'happy'},cam:'wide'},
   {l:['ERIN',"There you are. The deep spat you back out, same as everyone. Sit up slow."],act:{'@':'down'},cam:'two',with:'@'},
   {l:['MARCUS',"Eleven minutes. You were gone eleven minutes. I timed it. New record. The bad kind."],act:{'@':'down'},mv:{MARCUS:[-50,-6]},cam:'close'},
   {l:['@',KL("Something down there knew my name.","It smelled like the bottom of a flowerpot. Every flowerpot.","WHINE. (Something down there bit back. He would like that noted.)","Okay. Okay. That was a warm-up. Bro, that was a WARM-UP.")],mv:{'@':[-80,4]},cam:'close'},
   {l:['ERIN',"Eat something. Then go again. The Lantern doesn't fix itself."],act:{LOUIE:'cheer'},cam:'wide'}]},
 {id:'kills100',n:'THE CATALOGUE',set:'hearth',when:()=>stn('kills')>=100,
  cast:{SCOUT:[30,-20,-.6],RANGER:[60,-8,-1.2],'@':[0,10,2.6],'p:board':[42,-40]},
  beats:[{l:['SCOUT',"One hundred! You've felled one hundred things that live below. I've drawn every one. Badly."],act:{SCOUT:'happy'},cam:'two',with:'@'},
   {l:['RANGER',"Count them if you like. They don't stay counted. The deep grows them back like weeds."],cam:'close'},
   {l:['@',KL("Then I'll keep counting.","Weeds I know. Weeds you pull every morning, forever, and you smile while you do it.","BOOF. (He would like to count to a hundred. He is at twenty.)","Then they keep losing. Bro, that's a them problem.")],cam:'close'},
   {l:['SCOUT',"Then I'll need more paper."],cam:'wide'}]},
 {id:'escape1',n:'SUNRISE',set:'garden',sky:'dawn',when:()=>stn('escapes')>=1,
  cast:{'@':[0,-90,0],ERIN:[-30,26,3.14],LOUIE:[0,34,3.14],MARCUS:[30,28,3.14],RANGER:[-60,10,2.4]},
  beats:[{d:3.4,mv:{'@':[0,4]},mt:3,cam:'wide'},
   {l:['LOUIE',"AROOOO! (Out! All the way out! He knew it! He said so, many times, loudly!)"],act:{LOUIE:'cheer'},mv:{LOUIE:[4,16]},cam:'two',with:'@'},
   {l:['ERIN',"You went all the way down, and walked back up through the front door of the world."],act:{ERIN:'happy'},cam:'two',with:'@'},
   {l:['MARCUS',"Lucky. Statistically, lucky. ...Okay, that was sick. Don't tell anyone I said sick."],cam:'close'},
   {l:['@',KL("It's a long way up. It felt shorter with all of you at the top.","The roots let me through. I think they knew I'd be back to weed them.","AWOO! (He would like a snack, and then to do it again.)","Bro. BRO. I told you. Idea number one: win. Nailed it.")],act:{'@':'cheer'},cam:'close'},
   {l:['RANGER',"Now you know the way. The deep will move it by morning. Go find it again."],cam:'wide'}]},
 {id:'kills1000',n:'TALLY MARKS',set:'hearth',when:()=>stn('kills')>=1000,
  cast:{MARCUS:[40,-24,3.14],'p:tablet':[40,-38],ERIN:[0,6,.6],LOUIE:[18,12]},
  beats:[{l:['MARCUS',"Nine hundred ninety-nine... one thousand. Bro. One THOUSAND."],act:{MARCUS:'atk'},cam:'close'},
   {l:['ERIN',"Are you keeping score of the keeper's fights on my wall?"],mv:{ERIN:[16,-6]},cam:'two',with:'MARCUS'},
   {l:['MARCUS',"Somebody has to. Idea: we frame it. We frame the wall."],face:{MARCUS:'ERIN'},cam:'close'},
   {l:['LOUIE',"WOOF. (He has eaten the chalk. It was blue. So is he, now.)"],act:{LOUIE:'happy'},cam:'low',at:'LOUIE'}]},
 {id:'deaths25',n:'THE LEADERBOARD',set:'hearth',when:()=>stn('deaths')>=25,
  cast:{MARCUS:[30,-26,.3],'p:board':[42,-40],ERIN:[-20,0,.8],LOUIE:[0,14],'@':[-46,10,1.2]},
  beats:[{l:['MARCUS',"Family meeting. I made a chart of how the keeper dies. It's a pie chart. It's mostly pie."],cam:'wide'},
   {l:['ERIN',"Marcus. That is not funny."],cam:'close'},
   {l:['MARCUS',()=>"It's a little funny. Biggest slice: "+topKiller()+". Second biggest slice: also that."],cam:'close'},
   {l:['ERIN',()=>stn('deaths')+" times. And "+stn('deaths')+" times, you came home. That's the chart I'm keeping."],act:{ERIN:'happy'},cam:'two',with:'@'},
   {l:['LOUIE',"WOOF. (He sits on the chart. Meeting over.)"],mv:{LOUIE:[24,-18]},cam:'low',at:'LOUIE'}]},
 {id:'honey8',n:'THE SHELF',set:'hearth',when:()=>totalOf(RD.gift)>=8,
  cast:{ERIN:[-40,-6,1.2],MARCUS:[0,0,-1.2],'p:honey':[-58,-20],'p:honey2':[-52,-22],'p:honey3':[-46,-24],'p:table':[-52,-16]},
  beats:[{l:['ERIN',"Eight jars now. I never eat them. I just line them up and look at them."],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"That's insane. Can I have one?"],cam:'close'},
   {l:['ERIN',"No. Each one's a day somebody went down there and thought of me on the way back."],cam:'close'},
   {l:['MARCUS',"...Okay, that's actually nice. Still insane."],cam:'wide'}]},
 {id:'coop1',n:"WHO'S THE BEST PARTNER",set:'hearth',when:()=>stn('coopRuns')>=1,
  cast:{MARCUS:[-14,0,1.5],LOUIE:[14,0,-1.5],ERIN:[0,-30,0],SCOUT:[-40,-20,.6]},
  beats:[{l:['MARCUS',"Obviously I'm the best partner. I bring ideas."],cam:'two',with:'LOUIE'},
   {l:['LOUIE',"BOOF. (He brings sticks. Sticks are ideas you can hold.)"],act:{LOUIE:'happy'},cam:'low',at:'LOUIE'},
   {l:['ERIN',"Two of you went down together and both came up arguing. It's working."],cam:'wide'},
   {l:['SCOUT',"Two keepers, two lights. The deep never knows which one to watch."],cam:'close'}]},
 {id:'split',n:'TWO LIGHTS OVER THE GARDEN',set:'garden',sky:'night',fx:'twins',when:()=>!!RD.flags.split,
  cast:{ERIN:[-10,30,3.14],MARCUS:[40,60,3.14]},
  beats:[{d:3.6,cam:'sky'},
   {l:['ERIN',"Marcus. Wake up. Look."],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"Bro, it's the middle of the... oh."],mv:{MARCUS:[14,30]},cam:'two',with:'ERIN'},
   {l:['ERIN',"Same light. Two of them. One's going down. The other's closing the gate behind it. Gently."],cam:'sky'},
   {l:['MARCUS',"I got an idea. We don't say anything about this. To anyone."],cam:'close'},
   {l:['ERIN',"That's a good idea."],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"I know. That's what scares me."],cam:'sky'}]},
 {id:'mirror',n:'THE MIRROR TALKS BACK',set:'hearth',when:()=>totalOf(RD.mirror)>=8,
  cast:{MARCUS:[0,-14,3.14],'p:mirror':[0,-40],SCOUT:[34,0,-.8]},
  beats:[{l:['MARCUS',"Every time you spend Moondew at this thing, it gets a little shinier. Suspicious."],cam:'close'},
   {l:['SCOUT',"It isn't getting shinier. You're getting stronger. It just shows you."],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"So it's a mirror that hypes you up. Bro. I want one. I want six."],act:{MARCUS:'cheer'},cam:'low',at:'MARCUS'}]},
 {id:'relics12',n:'READING ALOUD',set:'hearth',when:()=>typeof relicCount==='function'&&relicCount()>=12,
  cast:{SCOUT:[0,-10,0],RANGER:[-34,4,.8],ERIN:[34,6,-.8],LOUIE:[10,20],'p:tablet':[0,-22]},
  beats:[{l:['SCOUT',"Twelve relics. Three stories about how the Lantern cracked, and not one of them agrees."],cam:'wide'},
   {l:['RANGER',"Good. Stories that agree are usually lying together."],cam:'close'},
   {l:['ERIN',"Read the one about the jar again. Louie likes that one."],cam:'two',with:'LOUIE'},
   {l:['LOUIE',"Zzz. (He does.)"],act:{LOUIE:'down'},cam:'low',at:'LOUIE'}]},
 {id:'supers',n:'SHOW-OFFS',set:'garden',when:()=>stn('supers')>=25,
  cast:{MARCUS:[-16,0,.8],ERIN:[20,-4,-.8],LOUIE:[4,16]},
  beats:[{l:['MARCUS',"Watch. Watch this. Hydro jet. Ffffssssh."],act:{MARCUS:'sup'},cam:'low',at:'MARCUS'},
   {l:['ERIN',"You're just spitting."],cam:'two',with:'MARCUS'},
   {l:['MARCUS',"It's a TECHNIQUE."],cam:'close'},
   {l:['LOUIE',"BOOF! (He does his too. A pigeon falls out of a tree, offended.)"],act:{LOUIE:'sup'},cam:'wide'},
   {l:['ERIN',"...Okay, that one was good."],act:{ERIN:'happy'},cam:'close'}]}];
const EPNAMES=EPISODES.map(e=>e.n);
function epUnlock(id){return!!RD.starter&&!(RD.open&&RD.open[id])&&charEarned(id)}

/* ---------------- playing one ---------------- */
let EPI=null;
function epKeeper(){return PL[0]?PL[0].char:keeperDefault()}
/* resolve an episode into beats with start/end marks for every actor */
function epBuild(i,keeper){const E=EPISODES[i],z0=EPZ[E.set]||H*.5,K=keeper||epKeeper();const cast={};let drop=null;
 if(E.cast['@']&&E.cast[K]&&K!=='@')drop=K;
 for(const k in E.cast){if(k===drop)continue;const c=E.cast[k];cast[k]={x:W/2+c[0],z:z0+c[1],yaw:c[2]};}
 const beats=[{d:2.4,title:true,cam:E.beats[0].cam==='sky'?'sky':'wide'}];
 for(const b of E.beats){if(b.l&&b.l[0]===drop)continue;beats.push(Object.assign({},b))}
 if(E.card)beats.push({d:2.8,card:E.card,cam:'wide'});
 /* walk each actor's marks through the beats */
 const pos={};for(const k in cast)pos[k]={x:cast[k].x,z:cast[k].z};
 for(const b of beats){b.from={};b.to={};for(const k in cast){b.from[k]={...pos[k]};const m=b.mv&&b.mv[k];if(m)pos[k]={x:W/2+m[0],z:z0+m[1]};b.to[k]={...pos[k]}}
  if(b.l){let t=b.l[1];if(typeof t==='function')t=t();else if(typeof t==='object')t=t[K]||t.WILL;b.txt=t;b.who=b.l[0]==='@'?K:b.l[0];b.d=b.d||clamp(1.6+t.length*.05,3,7.5)}}
 return{i,E,K,cast,beats,b:0,t:0,z0}}
function epStart(i,back){EPI=epBuild(i);EPI.back=back||'hub';RD.ep=RD.ep||{};RD.ep[EPISODES[i].id]=1;rdSave();state='ep';snd(392,.25,523,'triangle',.05)}
/* after a run, back home: the first episode whose moment has come */
function epCheck(){if(NET.client||!RD.flags.cineSeen)return false;RD.ep=RD.ep||{};
 for(let i=0;i<EPISODES.length;i++){const E=EPISODES[i];if(RD.ep[E.id])continue;let ok=false;try{ok=E.when()}catch(e){}
  if(ok){epStart(i,'hub');return true}}return false}
function epEnd(){const E=EPI&&EPI.E;if(E&&E.card){RD.open=RD.open||{};RD.open[E.card]=1;rdSave()}const back=EPI?EPI.back:'hub';EPI=null;state=back==='codex'?'codex':'hub'}
function epUpdate(dt){if(!EPI){state='hub';return}const B=EPI.beats[EPI.b];EPI.t+=dt;
 if(pressed('start')||pressed('sel')){epEnd();return}
 if((pressed('a')&&EPI.t>.3)||EPI.t>=B.d){EPI.b++;EPI.t=0;if(EPI.b>=EPI.beats.length)epEnd()}}
/* where everyone is, this frame */
function epActors(){const B=EPI.beats[EPI.b],u=ss(0,B.mt||1.3,EPI.t),A={};
 for(const k in EPI.cast){const f=B.from[k],to=B.to[k];A[k]={k,x:lerp(f.x,to.x,u),z:lerp(f.z,to.z,u),moving:(f.x!==to.x||f.z!==to.z)&&u<1,dx:to.x-f.x,dz:to.z-f.z}}
 const sp=B.who&&A[B.l[0]==='@'?'@':B.l[0]];
 for(const k in A){const a=A[k],c=EPI.cast[k];
  if(a.moving)a.yaw=Math.atan2(a.dx,a.dz);
  else if(B.face&&B.face[k]&&A[B.face[k]])a.yaw=Math.atan2(A[B.face[k]].x-a.x,A[B.face[k]].z-a.z);
  else if(sp&&sp!==a&&!k.startsWith('p:')&&!k.startsWith('bud'))a.yaw=Math.atan2(sp.x-a.x,sp.z-a.z);
  else if(sp===a&&B.with&&A[B.with])a.yaw=Math.atan2(A[B.with].x-a.x,A[B.with].z-a.z);
  else a.yaw=c.yaw!==undefined?c.yaw:0}
 return{A,sp}}
/* how tall and how big each kind of actor is, for framing */
function epSize(k){if(!k)return[14,1];if(k.startsWith('b:'))return[[16,2.3],[22,2.2],[30,2.1]][+k.slice(2)];if(k.startsWith('f:'))return[8,.8];if(k==='LOUIE'||(k==='@'&&EPI.K==='LOUIE'))return[12,1.15];return[24,1.25]}
function epCam(A,sp){const B=EPI.beats[EPI.b],t=EPI.t,side=EPI.b%2?1:-1;const L=Object.values(A).filter(a=>!a.k.startsWith('p:')&&!a.k.startsWith('bud'));
 let cx=0,cz=0;for(const a of L){cx+=a.x;cz+=a.z}cx/=L.length||1;cz/=L.length||1;
 const foc=A[B.at]||sp||L[0]||{x:W/2,z:EPI.z0},[h,s]=epSize(foc.k);
 /* the dialogue box covers the bottom third, so subjects are framed high */
 switch(B.cam){
  case'close':{/* in front of the face, three-quarter on */const y=foc.yaw||0,fx=Math.sin(y),fz=Math.cos(y),d=(40-t*1.2)*s;
   setCam([foc.x+fx*d+fz*side*d*.45,h*.95+3,foc.z+fz*d-fx*side*d*.45],[foc.x,h*.52,foc.z],.5);break}
  case'low':setCam([foc.x+side*10*s,3+h*.25,foc.z+(44-t)*s],[foc.x,h*.75,foc.z],.56);break;
  case'two':{const o=A[B.with]||L.find(a=>a!==foc)||foc,[h2,s2]=epSize(o.k),hm=Math.max(h,h2),sm=Math.max(s,s2),mx=(foc.x+o.x)/2,mz=(foc.z+o.z)/2,d=Math.hypot(foc.x-o.x,foc.z-o.z);
   /* side-on to the pair, from the open side of the room */let nx=-(o.z-foc.z),nz=o.x-foc.x;const nl=Math.hypot(nx,nz)||1;nx/=nl;nz/=nl;if(nz<0){nx=-nx;nz=-nz}if(nl<2){nx=0;nz=1}
   const dd=40*sm+d*.75-t*1.2;setCam([mx+nx*dd+side*6,hm*.9+6,mz+nz*dd],[mx,hm*.42,mz],.58);break}
  case'pan':setCam([cx-50+t*14,64,cz+110],[cx,0,cz],.6);break;
  case'sky':setCam([cx+side*10,10,cz+80-t*2],[cx,46,cz-60],.7);break;
  default:setCam([cx+Math.sin(time*.2)*18,62,cz+118-t*2],[cx,2,cz-6],.6)}}
function epSet(E){const night=E.sky==='night',dawn=E.sky==='dawn',cx=W/2;
 if(E.set==='hearth'){setLight([.3,.9,.45],[.78,.66,.52],[.5,.42,.44]);setFog('#120a12',430,820);frameBegin();drawRoomMesh('hub');
  prop(PROP.rug,W/2,0,H-44);for(const s of STATIONS)prop(PROP[s.id],s.x,0,29,0,1.15);lantern(W/2,50,H*.42,1.5);
  torch(12,40);torch(W-12,40);torch(12,H*.62);torch(W-12,H*.62);prop(PROP.bed,BED.x,0,BED.y-6,0,1.08);
  prop(PROP.hatch,DOOR.x,0,DOOR.y);prop(PROP.plant,22*HK,0,H-80);prop(PROP.plant,196*HK,0,H-126);prop(PROP.crate,216*HK,0,H-80,.3)}
 else if(E.set==='garden'){if(night){setLight([.2,.9,.4],[.26,.3,.46],[.3,.32,.46]);setFog('#04060e',220,600)}else if(dawn){setLight([.6,.5,.4],[1,.78,.58],[.56,.5,.52]);setFog('#3a2a30',260,700)}else{setLight([.2,.9,.4],[.62,.64,.6],[.58,.6,.56]);setFog('#0a140c',260,640)}
  frameBegin();drawRoomMesh('garden');for(let i=0;i<46;i++)prop(PROP.tuft,(i*47)%(W+160)-80,0,(i*31)%(H+80)-10,i,1.2+(i%3)*.4);
  for(let i=0;i<5;i++)prop(PROP.plant,-30+(i*91)%(W+60),0,20+(i*53)%70,i,1.4);prop(PROP.post,cx,0,H*.5-26);lantern(cx,28,H*.5-26,1.5);
  if(dawn){sprite(W/2+60,70+EPI.t*2,-160,90,hex('#ffd890'),.8,true);sprite(W/2+60,70,-160,240,hex('#ff9a60'),.25,true)}else sprite(W+40,150,-120,26,[.91,.9,.96],.9,false)}
 else{const B=+E.set.slice(4),L=BLIGHT[B];setLight(L[0],L[1],L[2]);setFog(L[3],300,700);frameBegin();drawRoomMesh(BKEY[B],[.85,.85,.9]);torch(12,36);torch(W-12,36);torch(12,H*.62);torch(W-12,H*.62)}
 if(E.fx==='twins'){const T=(EPI.b+EPI.t/6);for(const sd of[-1,1]){const lx=W/2+sd*(10+T*14),ly=70+Math.sin(T*2+sd)*6-(sd>0?T*3:0),lz=-30-T*(sd<0?14:4);
   sprite(lx,ly,lz,14,[1,1,1],.95,true);sprite(lx,ly,lz,50,hex(sd<0?'#ffe9a0':'#cfe0ff'),.55,true)}}
 if(E.fx==='lamp'){sprite(W/2,14,EPZ.deep2-30,10,hex('#ffe9a0'),.6+.2*Math.sin(time*2),true);sprite(W/2,14,EPZ.deep2-30,40,hex('#ffd94d'),.2,true);lantern(W/2,10,EPZ.deep2-30,1)}}
function sceneEp(dt){if(!EPI)return;const E=EPI.E,B=EPI.beats[EPI.b];const {A,sp}=epActors();
 epCam(A,sp);epSet(E);const t=EPI.t,T=time;
 for(const k in A){const a=A[k],act=B.act&&B.act[k],talking=sp===a&&!B.title&&!B.card;
  if(k.startsWith('p:')){const pm=PROP[k.slice(2).replace(/\d+$/,'')];if(pm){prop(pm,a.x,0,a.z,a.yaw||0,1.2);shadow(a.x,a.z,5)}continue}
  if(k.startsWith('bud:')){const ty=+k.split(':')[1],i=+k.split(':')[2];let x=a.x,z=a.z;if(B.ring){const ang=i/10*6.283+T*.8,c=EPI.cast.LOUIE?A.LOUIE:a;x=c.x+Math.cos(ang)*20;z=c.z+Math.sin(ang)*16}
   shadow(x,z,3);drawBud(ty,x,z,Math.atan2(-Math.sin(i/10*6.283+T*.8),Math.cos(i/10*6.283+T*.8)),Math.abs(Math.sin(T*6+i))*3,.75);continue}
  if(k.startsWith('f:')){const kind=k.split(':')[1],f=FOES[kind];shadow(a.x,a.z,f.r);drawFoe({kind,x:a.x,y:a.z,z:talking?Math.abs(Math.sin(T*9))*2:0,yaw:a.yaw,r:f.r,flash:0,born:0,state:0,hp:1,max:1,mv:a.moving?1:0,t:T});continue}
  if(k.startsWith('b:')){const ix=+k.slice(2),b=BOSSES[ix];drawFoe({kind:'boss',bossIx:ix,x:a.x,y:a.z,yaw:a.yaw,r:b.r,flash:0,born:0,state:0,hp:b.hp,max:b.hp,mv:a.moving?1:0,t:T,tx:a.x,ty:a.z,lx:a.x,ly:a.z});continue}
  const who=k==='@'?EPI.K:k,cyc=(t*.8)%1;const o={id:'ep'+EPI.i+k,talk:talking,look:sp&&sp!==a?Math.atan2(sp.x-a.x,sp.z-a.z):undefined,nosit:true};
  if(!PL.some(p=>p.char===who)&&k!=='@')o.npc=who;
  if(act==='cheer')o.cheer=cyc*.84;else if(act==='happy')o.happy=true;else if(act==='down')o.down=true;else if(act==='atk'){o.atk=(t*1.4)%1;o.weapon=who==='LOUIE'?null:'blade';o.trail=true}
  else if(act==='sup')o.sup=Math.min(.99,(t*.7)%1.2);if(who==='LOUIE')o.happy=o.happy||act==='happy';
  shadow(a.x,a.z,6);drawCast(who,a.x,a.z,a.yaw,o)}
 frameEnd()}
const EPPLATE={WILL:'#2a4a8a'};
function epName(k){if(k==='@')return EPI.K;if(k.startsWith('f:'))return FOES[k.split(':')[1]].n;if(k.startsWith('b:'))return BOSSES[+k.slice(2)].n;return k}
function epPlate(k){if(k.startsWith('b:'))return '#4a2050';if(k.startsWith('f:'))return '#3a3040';const n=k==='@'?EPI.K:k;return RDCPLATE[n]||EPPLATE[n]||'#181020'}
function hudEp(){if(!EPI)return;const B=EPI.beats[EPI.b],t=EPI.t,E=EPI.E;r('#000000',0,0,VW,22);r('#000000',0,VH-22,VW,22);
 if(EPI.b===0&&t<.5)r('rgba(0,0,0,'+(1-t/.5)+')',0,0,VW,VH);
 if(B.title){const a=clamp(Math.min(t/.4,(B.d-t)/.4),0,1);hx.globalAlpha=a;ctext('EPISODE '+(EPI.i+1),VH*.36,1,'#c8c0d8',null);logoText(E.n,VW/2,VH*.36+14,22);hx.globalAlpha=1}
 if(B.card){const a=clamp(t/.4,0,1);hx.globalAlpha=a;ctext('KEEPER UNLOCKED',VH*.34,1,'#a8f080','#120a18');logoText(B.card,VW/2,VH*.34+14,30);ctext('CHOOSE '+B.card+' WHEN YOU DESCEND',VH*.34+52,1,'#c8c0d8','#120a18');hx.globalAlpha=1}
 if(B.txt){const bw=Math.min(350,VW-16),bx=(VW-bw)/2,by=VH-84;panel(bx,by,bw,56,'#f4ead2','#281c30');const nm=epName(B.l[0]),pc=epPlate(B.l[0]),nw=tw(nm,2)+14;
  r('#181020',bx+6,by-10,nw,17);r(pc,bx+7,by-9,nw-2,15);text(nm,bx+13,by-7,2,'#ffffff',null);
  let left=Math.floor(t*60);wrapPx(B.txt,bw-22,1).slice(0,3).forEach((l,i)=>{if(left<=0)return;text(l.slice(0,left),bx+11,by+12+i*13,1,'#281c30',null);left-=l.length+1})}
 rtext(btnName(lead0(),'a')+': NEXT   '+btnName(lead0(),'start')+': SKIP',VW-8,VH-15,1,'#8d84a8',null)}
