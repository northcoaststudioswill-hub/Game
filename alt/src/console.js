
(()=>{
const $=id=>document.getElementById(id);
const cv=$('screen'),g=cv.getContext('2d');
let H=200;const W=240,MW=70,MH=40,G=0,D=1,S=2,WA=3,TR=4,GT=5;
const HTX=28,HTY=20,HX=HTX*16+8,HY=HTY*16+8,DAYLEN=240,CAP=20,NT=6,PULL=25;
const TYPES=[
 {n:'EMBER',c:'#f07830',d:'#983818',l:'#f8c070',sp:74},
 {n:'PEB',c:'#98a0b0',d:'#4c5466',l:'#dce2ea',sp:66},
 {n:'DEW',c:'#48a0f0',d:'#2050a8',l:'#b0e0f8',sp:82},
 {n:'ZIP',c:'#f0d020',d:'#806008',l:'#fff8a0',sp:98},
 {n:'LEAF',c:'#58c048',d:'#286028',l:'#b0f090',sp:76},
 {n:'LUCKY',c:'#f078c0',d:'#902868',l:'#ffc8e8',sp:78}];
const BUGS=[
 {n:'LADYBUG',v:22,rng:28},{n:'SNAIL',v:5,rng:14},{n:'BUTTERFLY',v:78,rng:34,fly:1},
 {n:'DRAGONFLY',v:50,rng:22,fly:1,water:1},{n:'FIREFLY',v:40,rng:30,fly:1,dusk:1},{n:'SCARAB',v:104,rng:40},
 {n:'BEE',v:70,rng:30,fly:1},{n:'CRAB',v:30,rng:22},{n:'MOTH',v:55,rng:30,fly:1,dusk:1},{n:'FROG',v:45,rng:16}];
const BUG_AT=['IN GRASS','NORTH MEADOW','IN FIELDS','OVER PONDS','AT DUSK','FAR SOUTH','SUNNY ORCHARD','PEBBLE BEACH','AT DUSK','BY THE POND'];
const TRS=[['ACORN CAP','#9a5a2c'],['BLUE FEATHER','#60b8f8'],['OLD KEY','#c8a040'],['SEA SHELL','#f8c8d8'],['GLASS MARBLE','#60d8a8'],['GOLD COIN','#f8d030'],['FOSSIL','#c8c0a8'],['RED BUTTON','#e83040'],['TINY BELL','#f8e060'],['MOON PEBBLE','#a8c8ff'],['LOST SOCK','#f078c0'],['STAR CHIP','#ffffff']];
const R=(a,b)=>a+Math.random()*(b-a), d2=(e,x,y)=>(e.x-x)*(e.x-x)+(e.y-y)*(e.y-y);
const r=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};

/* ---------- style catalogue: [name, colour, light colour, rarity 0-2] ---------- */
const STY={
 cap:[['ACORN','#9a5a2c','#c88848',0],['BERRY','#c02848','#f06080',0],['SKY','#3878d0','#78b0f8',0],['MOSS','#3c8840','#78c870',0],['PLUM','#7040a8','#a878e0',1],['GOLD','#d0a010','#f8e060',2],['SLATE','#586078','#98a0b8',0],['PUMPKIN','#e06818','#f8a858',1],['MINT','#48c0a0','#a0f0d8',1],['MIDNIGHT','#202848','#5060a0',2]],
 coat:[['TEAL','#30a898','#78e0c8',0],['EMBER','#e06028','#f8a868',0],['NAVY','#304890','#6888d0',0],['ROSE','#d05888','#f8a0c0',0],['SLATE','#586078','#98a0b8',1],['SNOW','#d8d8e8','#ffffff',1],['FOREST','#286838','#58a868',0],['LEMON','#e0c820','#fff080',1],['ROYAL','#6030b0','#f8d040',2],['SHADOW','#282030','#685878',2]],
 flower:[['PINK','#f8a0c8','#ffffff',0],['SUN','#f8d040','#fff8a0',0],['VIOLET','#a070e8','#e0d0ff',0],['SKY','#60b8f8','#e0f8ff',0],['SNOW','#ffffff','#d8e8f8',1],['FLAME','#f85030','#f8c040',1],['MINT','#60d8a8','#e0fff0',0],['PEACH','#f8a878','#fff0d8',1],['GOLD','#f8c020','#ffffff',2],['RAINBOW','#f85888','#ffffff',2]],
 ban:[['RED','#e03040','',0],['BLUE','#3070e0','',0],['GREEN','#30a050','',0],['GOLD','#e8b820','',1],['NONE','','',0],['PINK','#f070a8','',0],['PURPLE','#8848d0','',1],['SNOW','#ffffff','',2]],
 trail:[['NONE','','',0],['LEAVES','#58c048','',0],['BUBBLES','#a8d8ff','',0],['SPARKLES','#f8e060','',1],['HEARTS','#f85888','',1],['STARS','#ffffff','',2]]};
STY.hat=[['NONE','','',0],['STRAW','#e8c868','',0],['CHEF','#ffffff','',0],['DAISY CROWN','#f8a0c8','',1],['PARTY','#60b8f8','',1],['GOLD CROWN','#f8d030','',2],['SHADES','#383048','',3],['BEE BUDDY','#f8d030','',3],['THORN HORNS','#f07878','',3],['LOOKOUT CAP','#c04848','',3],['ANTENNAE','#58c048','',3]];
const ROWS=[['CAP','cap'],['COAT','coat'],['FLOWER','flower'],['LOUIE','ban'],['TRAIL','trail'],['HATS','hat']];
const RAR=[['COMMON','#c8c0d8'],['RARE','#60b8f8'],['EPIC','#f8a060'],['BUILT','#a8f080']];
const RAINBOW=['#f85888','#f8a040','#f8e060','#60d880','#60b8f8','#a070e8'];
const ACH=[
 ['FIRST SPROUT','PLUCK YOUR FIRST SPROUT',5],['SMALL CREW','HAVE 20 SPROUTS AT ONCE',15],['BIG CREW','HAVE 40 SPROUTS AT ONCE',30],
 ['RAINBOW CREW','FIND ALL 6 SPROUT TYPES',25],['SHARD BEARER','BRING HOME A SUN SHARD',15],['LANTERN KEEPER','RELIGHT THE GREAT LANTERN',50],
 ['SWIFT KEEPER','RELIGHT IT WITHIN 6 DAYS',40],['OLD FRIEND','MAKE FRIENDS WITH OLD THORNBACK',40],['BUG SCHOLAR','CATCH ALL 10 KINDS OF BUGS',50],
 ['GOOD BOY','PET LOUIE 10 TIMES',15],['GREEN THUMB','HARVEST 10 FLOWERS',20],['BERRY BARON','BRING HOME 50 BERRIES',25],
 ['HELPING HAND','FINISH 10 MISSIONS',30],['FULL BLOOM','PLUCK 10 BLOOMED SPROUTS',15],['FLOWER FARMER','HARVEST 50 FLOWERS',40],
 ['HEAD GARDENER','OPEN ALL 12 GARDEN BEDS',30],['BEST FRIENDS','PET LOUIE 50 TIMES',30],['BUG FAN','CATCH 25 BUGS',25],
 ['STYLISH','OWN 10 STYLE ITEMS',20],['COLLECTOR','OWN EVERY STYLE ITEM',100],['LUCKY','OPEN 5 CAPSULES',15],
 ['REGULAR','3 DAY GIFT STREAK',20],['DEVOTED','7 DAY GIFT STREAK',50],['BERRY TYCOON','BRING HOME 200 BERRIES',50],
 ['DAILY DOER',"FINISH 10 OF ERIN'S DAILY ASKS",30],['SEASONED','REACH KEEPER RANK 5',30],['ORDER UP',"FILL 5 OF ERIN'S FLOWER ORDERS",25],['MOONLIGHT','GROW A MOONBLOOM',30],
 ['TREASURE HUNTER','FIND 6 TREASURES',30],['CURATOR','FIND EVERY TREASURE',80],['FULL HOUSE','10 SPROUTS LIVING AT HOME',20],['BIG FAMILY','30 SPROUTS LIVING AT HOME',40],['RENOVATOR','UPGRADE YOUR HOUSE',20],['BUILDER','FINISH A VALLEY PROJECT',30],['MASTER BUILDER','FINISH ALL 5 VALLEY PROJECTS',100],['MAKING WAVES','OPEN MARCUS WATERWORKS',40]];
const DQ={pluck:['PLUCK 12 SPROUTS',12],berry:['BRING HOME 8 BERRIES',8],bug:['CATCH 2 BUGS',2],pet:['PET LOUIE 3 TIMES',3],throw:['THROW 40 SPROUTS',40],flower:['HARVEST 4 FLOWERS',4],grub:['BEAT A GRUB',1]};

/* ---------- saved progress ---------- */
const DEF=()=>({petals:0,xp:0,tix:1,ach:{},own:{cap:[0],coat:[0],flower:[0],ban:[0,4],trail:[0],hat:[0],rd:[]},eq:{cap:0,coat:0,flower:0,ban:0,trail:0,hat:0},bugs:[0,0,0,0,0,0,0,0,0,0],trs:[],
 life:{pets:0,berries:0,missions:0,blooms:0,flowers:0,bugs:0,pulls:0,dailies:0,grubs:0},last:'',streak:0,mus:6,sfx:7,dq:null,dog:{xp:0}});
function fixMeta(s){const m=Object.assign(DEF(),s||{});m.own=Object.assign(DEF().own,(s||{}).own||{});m.eq=Object.assign(DEF().eq,(s||{}).eq||{});m.life=Object.assign(DEF().life,(s||{}).life||{});m.dog=Object.assign({xp:0},(s||{}).dog||{});while(m.bugs.length<BUGS.length)m.bugs.push(0);if(!Array.isArray(m.trs))m.trs=[];if(m.muted){m.sfx=0;delete m.muted}return m;}
let SAVE={t:0,meta:null,run:null},meta=DEF(),live=false,cloud=null,cloudBusy=false,cloudAt=0,cloudDone=false;
try{const a=JSON.parse(localStorage.getItem('sprouts-v2')||'null');if(a&&a.meta){SAVE=a;meta=fixMeta(a.meta)}
 else{const b=JSON.parse(localStorage.getItem('budlings-v1')||'null');if(b)meta=fixMeta(b)}}catch(e){}
function persist(force){try{SAVE.meta=meta;if(live)SAVE.run=snap();SAVE.t=Date.now();}catch(e){return}
 try{localStorage.setItem('sprouts-v2',JSON.stringify(SAVE))}catch(e){}
 if(cloud&&!cloudBusy&&(force||Date.now()-cloudAt>25000)){cloudBusy=true;cloudAt=Date.now();try{cloud.set({t:SAVE.t,json:JSON.stringify(SAVE)}).catch(()=>{}).then(()=>{cloudBusy=false})}catch(e){cloudBusy=false}}}
const save=()=>persist(false);
async function cloudInit(){try{if(typeof claude==='undefined'||!claude.use){cloudDone=true;return}const db=await claude.use('db'),user=await claude.use('user');if(!db||!user)return;const id=await user.id();if(!id)return;
 const ref=db.collection('data/users/'+id).doc('sprouts'),sn=await ref.get();cloud=ref;
 if(sn&&sn.exists){const d=sn.data();if(d&&d.json&&(d.t||0)>(SAVE.t||0)&&(state==='off'||state==='boot'||state==='menu')){const o=JSON.parse(d.json);if(o&&o.meta){SAVE=o;meta=fixMeta(o.meta);applyLook(meta.eq);loadWorld();try{localStorage.setItem('sprouts-v2',JSON.stringify(SAVE))}catch(e){}}}}
 else if(SAVE.t)persist(true);}catch(e){}cloudDone=true;}
const rankOf=xp=>{let k=1,need=30;while(xp>=need){xp-=need;k++;need+=15}return[k,xp,need]};
function earn(n){const a=rankOf(meta.xp)[0];meta.petals+=n;meta.xp+=n;const b=rankOf(meta.xp)[0];if(b>a){meta.tix+=b-a;toast('KEEPER RANK '+b+'!  +1 TICKET')}save();}
const today=()=>new Date().toDateString();
const dailyReady=()=>meta.last!==today();
function claimDaily(){const y=new Date(Date.now()-864e5).toDateString();meta.streak=meta.last===y?meta.streak+1:1;const a=10+5*Math.min(meta.streak-1,6);meta.last=today();meta.tix++;earn(a);return a;}
function dailies(){if(!meta.dq||meta.dq.d!==today()){const ids=['pluck','berry','bug','pet','throw'];if(meta.life.flowers>0)ids.push('flower');if(meta.life.grubs>0)ids.push('grub');
  for(let i=ids.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[ids[i],ids[j]]=[ids[j],ids[i]]}meta.dq={d:today(),q:ids.slice(0,3).map(id=>[id,0])}}return meta.dq;}
function bump(id,n=1){const dq=dailies();for(const q of dq.q)if(q[0]===id&&q[1]<DQ[id][1]){q[1]=Math.min(DQ[id][1],q[1]+n);if(q[1]>=DQ[id][1]){meta.life.dailies++;toast('DAILY ASK DONE!  +8');earn(8);if(dq.q.every(k=>k[1]>=DQ[k[0]][1])){meta.tix++;toast('ALL 3 DAILY ASKS!  +1 TICKET')}}}}
const ownCount=()=>Object.keys(STY).reduce((a,k)=>a+meta.own[k].length,0)-7;
const styTotal=Object.keys(STY).reduce((a,k)=>a+STY[k].length,0)-7;
function pool(){const o=[];for(const k in STY)STY[k].forEach((it,i)=>{if(it[3]<3&&!meta.own[k].includes(i))o.push({k,i,r:it[3]})});
 /* cartridge 3: Rootdeep unlocks share the machine (see RDCAP in the Rootdeep block) */
 if(typeof RDCAP!=='undefined')RDCAP.forEach((it,i)=>{if(!meta.own.rd.includes(i))o.push({k:'rd',i,r:it.r})});return o;}
/* RESET PULLS: everything that came out of a capsule goes back in, and every pull is refunded as a ticket.
   Starting styles and BUILT items (valley projects) stay. */
function resetPulls(){const D=DEF();let n=0;for(const k in STY){const keep=meta.own[k].filter(i=>D.own[k].includes(i)||STY[k][i][3]===3);n+=meta.own[k].length-keep.length;meta.own[k]=keep;if(!keep.includes(meta.eq[k]))meta.eq[k]=D.eq[k]}
 n+=(meta.own.rd||[]).length;meta.own.rd=[];meta.tix+=n;applyLook(meta.eq);persist(true);return n;}
const pulledCount=()=>{const D=DEF();let n=(meta.own.rd||[]).length;for(const k in STY)n+=meta.own[k].filter(i=>!D.own[k].includes(i)&&STY[k][i][3]!==3).length;return n};
function pullOne(){const p=pool();if(!p.length)return null;const have=[0,1,2].filter(q=>p.some(x=>x.r===q)),w=[60,30,10];let x=Math.random()*have.reduce((a,q)=>a+w[q],0),rr=have[0];
 for(const q of have){x-=w[q];if(x<0){rr=q;break}}const c=p.filter(x=>x.r===rr);return c[(Math.random()*c.length)|0];}

/* ---------- input ---------- */
const keys={up:0,down:0,left:0,right:0,a:0,b:0,x:0,y:0,sel:0,start:0},prev={};
const pressed=k=>keys[k]&&!prev[k];
let ac=null;
function unlock(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();}catch(e){}
 try{if(typeof MUS!=='undefined'&&MUS.pending>=0&&MUS.loading){const i=MUS.pending;MUS.pending=-1;playStored(i,MUS.tok,true)}}catch(e){}}
function snd(f,d=.08,f2=0,type='square',vol=.045){if(!ac||!meta.sfx)return;vol*=Math.pow(meta.sfx/10,1.5)*1.4;try{const o=ac.createOscillator(),ga=ac.createGain(),t=ac.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);ga.gain.setValueAtTime(vol,t);ga.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(ga);ga.connect(ac.destination);o.start(t);o.stop(t+d+.02);}catch(e){}}
const later=(f,ms)=>{if(typeof setTimeout!=='undefined')setTimeout(f,ms)};
function noise(d=.05,vol=.2,freq=2000,type='highpass'){if(!ac||!meta.sfx)return;try{const n=Math.ceil(ac.sampleRate*d),b=ac.createBuffer(1,n,ac.sampleRate),ch=b.getChannelData(0);for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const q=ac.createBufferSource(),f=ac.createBiquadFilter(),ga=ac.createGain();q.buffer=b;f.type=type;f.frequency.value=freq;ga.gain.value=vol*Math.pow(meta.sfx/10,1.5)*1.4;q.connect(f);f.connect(ga);ga.connect(ac.destination);q.start()}catch(e){}}
function cartSnap(){noise(.04,.6,2200);snd(170,.1,52,'sine',.4);later(()=>{noise(.02,.3,4200);snd(1300,.025,0,'square',.03)},55);}
/* ---------- music ---------- */
const TRACKS=(window.SPROUT_TRACKS||[]).map(t=>Object.assign({},t,{img:null}));
TRACKS.forEach(t=>{try{const im=new Image();im.src=t.art;t.img=im}catch(e){}});
const MUS={pending:-1,from:'',list:'',src:null,gain:null,buf:null,bi:-1,cur:-1,last:-1,loading:false,tok:0,gap:0,fade:1,np:0,shown:-1};
const MENU_ST={intro:1,menu:1,rewards:1,caps:1,style:1,bugs:1};
function musWant(){if(state==='off'||state.slice(0,2)==='g3'||state.slice(0,3)==='lan')return'';if(state==='ko')return KO.mus();if(state==='pp')return PP.mus();if(state==='boot')return cart?'':bootT>.35?'menu':'';if(state==='settings')return setFrom==='pause'?'game':'menu';return MENU_ST[state]?'menu':'game';}
const musLevel=()=>Math.pow(meta.mus/10,2)*.85*(state==='pause'||(state==='ko'&&KO&&KO.paused())||(state==='pp'&&PP&&PP.paused())||(state==='settings'&&setFrom==='pause')?.55:1);
function musGain(){if(!MUS.gain&&ac){MUS.gain=ac.createGain();MUS.gain.gain.value=0;MUS.gain.connect(ac.destination)}return MUS.gain;}
function getBuf(i){if(MUS.bi===i&&MUS.buf)return Promise.resolve(MUS.buf);
 return new Promise((res,rej)=>{try{const t=TRACKS[i];if(!t.bytes){const bin=atob(t.data),u=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)u[k]=bin.charCodeAt(k);t.bytes=u;t.data=null}
  const ok=b=>{MUS.buf=b;MUS.bi=i;res(b)},p=ac.decodeAudioData(t.bytes.buffer.slice(0),ok,rej);if(p&&p.catch)p.catch(rej)}catch(e){rej(e)}});}
function stopSrc(){const s=MUS.src;MUS.src=null;MUS.cur=-1;if(s){try{s.onended=null;s.stop()}catch(e){}}}
function nextIdx(){const L=TRACKS.map((t,i)=>i).filter(i=>TRACKS[i].use.includes(MUS.list));if(!L.length)return -1;const c=L.filter(i=>i!==MUS.last),p=c.length?c:L;return p[(Math.random()*p.length)|0];}
let musEl=null;
function playStored(i,tok,inGesture){const t=TRACKS[i];try{
  if(!musEl){musEl=new Audio();musEl.preload='auto';ac.createMediaElementSource(musEl).connect(musGain());}
  const h={stop(){try{musEl.pause()}catch(e){}}},bad=()=>{t.bad=true;if(tok===MUS.tok){MUS.loading=false;MUS.gap=.1}};
  musEl.onerror=bad;musEl.onended=()=>{if(MUS.src===h){MUS.src=null;MUS.cur=-1;MUS.gap=MUS.list==='menu'?1.5:3}};
  musEl.src=t.url||'/_blob/'+t.blob;musEl.currentTime=0;
  const p=musEl.play();if(!p||!p.then){bad();return}
  p.then(()=>{if(tok!==MUS.tok){musEl.pause();return}MUS.loading=false;MUS.pending=-1;MUS.src=h;MUS.cur=MUS.last=i;MUS.np=5.5;MUS.from='STORED';setStrip(i)})
   .catch(e=>{if(e&&e.name==='NotAllowedError'&&!inGesture){if(tok===MUS.tok)MUS.pending=i}else bad()});
 }catch(e){t.bad=true;MUS.loading=false;MUS.gap=.1}}
function playTrack(i){const tok=++MUS.tok;MUS.loading=true;if((TRACKS[i].blob||TRACKS[i].url)&&!TRACKS[i].bad){playStored(i,tok,false);return}
 if(!TRACKS[i].data&&!TRACKS[i].bytes){MUS.loading=false;MUS.gap=8;return}MUS.from='BUILT IN';
 getBuf(i).then(b=>{if(tok!==MUS.tok)return;MUS.loading=false;stopSrc();const s=ac.createBufferSource();s.buffer=b;s.connect(musGain());
  s.onended=()=>{if(MUS.src===s){MUS.src=null;MUS.cur=-1;MUS.gap=MUS.list==='menu'?1.5:3}};s.start();MUS.src=s;MUS.cur=MUS.last=i;MUS.np=5.5;setStrip(i);})
 .catch(()=>{if(tok!==MUS.tok)return;MUS.loading=false;MUS.gap=10;});}
function setStrip(i){const box=$('np');if(!box)return;MUS.shown=i;if(i<0){box.hidden=true;return}const t=TRACKS[i],tx=$('npText'),bx=$('npBox'),line='\u266A '+t.title+'  \u00B7  '+t.artist;
 box.hidden=false;try{$('npArt').src=t.art}catch(e){}tx.textContent=line;bx.classList.remove('roll');
 later(()=>{if(tx.scrollWidth>bx.clientWidth){tx.textContent=line+'\u2003\u2003\u2003'+line+'\u2003\u2003\u2003';bx.style.setProperty('--d',Math.max(8,line.length*.32)+'s');bx.classList.add('roll')}},30);}
function musTick(dt){if(MUS.np>0)MUS.np-=dt;if(!ac||!TRACKS.length)return;const want=musWant(),g=musGain();if(!g)return;
 if(want!==MUS.list){if(MUS.src&&MUS.fade>0){MUS.fade=Math.max(0,MUS.fade-dt/.9);g.gain.setTargetAtTime(musLevel()*MUS.fade,ac.currentTime,.03);return}
  MUS.tok++;MUS.loading=false;MUS.pending=-1;stopSrc();MUS.list=want;MUS.gap=.4;MUS.fade=1;if(!want){setStrip(-1);return}}
 g.gain.setTargetAtTime(musLevel(),ac.currentTime,.04);
 if(!MUS.src&&!MUS.loading&&MUS.list){MUS.gap-=dt;if(MUS.gap<=0){const i=nextIdx();if(i>=0)playTrack(i);else MUS.gap=5}}}

function bindBtn(id,key){const el=$(id);
 el.addEventListener('pointerdown',e=>{e.preventDefault();unlock();keys[key]=1;el.classList.add('on');try{el.setPointerCapture(e.pointerId)}catch(_){}} );
 ['pointerup','pointercancel','lostpointercapture'].forEach(n=>el.addEventListener(n,()=>{keys[key]=0;el.classList.remove('on')}));}
bindBtn('bA','a');bindBtn('bB','b');bindBtn('bX','x');bindBtn('bY','y');bindBtn('bSel','sel');bindBtn('bSta','start');
const dp=$('dpad');
const DIRS={'0':[1,0],'1':[1,1],'2':[0,1],'3':[-1,1],'4':[-1,0],'-4':[-1,0],'-3':[-1,-1],'-2':[0,-1],'-1':[1,-1]};
function dpSet(e){const b=dp.getBoundingClientRect(),x=e.clientX-(b.left+b.width/2),y=e.clientY-(b.top+b.height/2);let v=[0,0];
 if(Math.hypot(x,y)>b.width*.09)v=DIRS[Math.round(Math.atan2(y,x)/(Math.PI/4))]||[0,0];
 keys.right=v[0]>0?1:0;keys.left=v[0]<0?1:0;keys.down=v[1]>0?1:0;keys.up=v[1]<0?1:0;dp.style.setProperty('--tx',v[0]);dp.style.setProperty('--ty',v[1]);}
function dpClr(){keys.left=keys.right=keys.up=keys.down=0;dp.style.setProperty('--tx',0);dp.style.setProperty('--ty',0);}
let dpDown=false;
dp.addEventListener('pointerdown',e=>{e.preventDefault();unlock();dpDown=true;try{dp.setPointerCapture(e.pointerId)}catch(_){ }dpSet(e)});
dp.addEventListener('pointermove',e=>{if(dpDown)dpSet(e)});
['pointerup','pointercancel','lostpointercapture'].forEach(n=>dp.addEventListener(n,()=>{dpDown=false;dpClr()}));
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',z:'a',j:'a',' ':'a',x:'b',k:'b',c:'x',l:'x',v:'y',i:'y',q:'sel',e:'sel',Shift:'sel',Enter:'start',p:'start'};
addEventListener('keydown',e=>{const k=KM[e.key]||KM[e.key.toLowerCase()];if(k){keys[k]=1;unlock();e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.key]||KM[e.key.toLowerCase()];if(k)keys[k]=0});
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden){persist(true);try{ac&&ac.suspend()}catch(e){}}else{try{ac&&ac.resume()}catch(e){}}});

/* ---------- text (drawn at double resolution so it stays sharp) ---------- */
const FS={1:10,2:11,3:15,4:19,5:25};
function setF(sc){g.font='700 '+FS[sc]+'px ui-monospace,"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace';g.textBaseline='top';}
function tw0(s,sc=2){setF(sc);const m=g.measureText(String(s));return Math.ceil((m&&m.width)||String(s).length*FS[sc]*.6);}
/* test hook: when TBX is an array, every text box drawn is recorded (in logical pixels) so a test can check for overlaps */
let TBON=false,TBX=null,TBL=[];
/* Rootdeep (cartridge 3) places text by the real cap height, so the letters' tops land exactly at y on every font.
   With a 'top' baseline, iPhone's SF Mono draws a few pixels lower than desktop fonts, which pushed text onto the
   bottom edge of tags and boxes. Sprouts keeps its own tuned placement. */
const CAPH={};
function capOf(sc){if(CAPH[sc]===undefined){setF(sc);g.textBaseline='alphabetic';const m=g.measureText('H');CAPH[sc]=(m&&m.actualBoundingBoxAscent)||FS[sc]*.72;g.textBaseline='top'}return CAPH[sc]}
function text0(s,x,y,sc=2,c='#fff',sh='#181020'){s=String(s);const capN=cart===2||cart===3||(typeof state==='string'&&state.slice(0,3)==='lan'),cy=capN?capOf(sc):0;setF(sc);if(TBX){const m=g.getTransform(),w=g.measureText(s).width;TBX.push({s,x:(m.a*x+m.e)/2,y:(m.d*y+m.f)/2,w:w*m.a/2,h:FS[sc]*.8*m.d/2,sq:Math.abs(m.a-2)>.01&&Math.abs(m.a-4)>.01})}
 if(capN){g.textBaseline='alphabetic';y+=cy}
 if(sh){g.lineJoin='round';g.lineWidth=2;g.strokeStyle=sh;g.strokeText(s,x,y);g.fillStyle=sh;g.fillText(s,x+1,y+1)}g.fillStyle=c;g.fillText(s,x,y);if(capN)g.textBaseline='top';}
function ctext0(s,y,sc=2,c,sh){const w=tw(s,sc);if(w>W-6){g.save();g.translate(3,0);g.scale((W-6)/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round((W-w)/2),y,sc,c,sh);}
function rtext(s,xr,y,sc=2,c,sh){text(s,xr-tw(s,sc),y,sc,c,sh);}
function wrapPx(s,maxW,sc=2){const out=[];let l='';for(const w of String(s).split(' ')){const t=l?l+' '+w:w;if(l&&tw(t,sc)>maxW){out.push(l);l=w}else l=t}if(l)out.push(l);return out;}
function petalIcon(x,y){r('#f8a0c8',x+1,y,3,5);r('#f8a0c8',x,y+1,5,3);r('#f8d040',x+2,y+2,1,1);}
function ticketIcon(x,y){r('#f8e060',x,y,8,5);r('#281c30',x+2,y+1,1,3);r('#c89010',x+4,y+1,3,1);r('#c89010',x+4,y+3,3,1);}

/* ---------- sprites ---------- */
function mk(rows,pal){const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const x=c.getContext('2d');
 rows.forEach((row,j)=>{for(let i=0;i<row.length;i++){const p=pal[row[i]];if(p){x.fillStyle=p;x.fillRect(i,j,1,1)}}});return c;}
function flip(s){const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.translate(s.width,0);x.scale(-1,1);x.drawImage(s,0,0);return c;}
const pTop=['....kkkk....','...kcccck...','..kcCCccck..','.kcCCcccccc.','.kkkkkkkkkk.'],
 pBot=['..kkkkkkkk..','.kttttttttk.','.ktTttttTtk.','..kttttttk..','..kbbkkbbk..','..kkk..kkk..'];
function buildP(c,C,t,T){const pal={k:'#282038',c,C,f:'#f8dcb0',t,T,b:'#583828'};
 const o={pd:mk([...pTop,'.kffffffffk.','.kfkffffkfk.','.kffffffffk.',...pBot],pal),pu:mk([...pTop,'.kcccccccck.','.kcccccCcck.','.kcccccccck.',...pBot],pal),pr:mk([...pTop,'.kccffffffk.','.kccfffkfkk.','.kccffffffk.',...pBot],pal)};o.pl=flip(o.pr);return o;}
let SP={},FL=['#f8a0c8','#ffffff'],BAN='#e03040',RB=false,flSeed=0;
function applyLook(l){const c=STY.cap[l.cap],t=STY.coat[l.coat],f=STY.flower[l.flower];Object.assign(SP,buildP(c[1],c[2],t[1],t[2]));FL=[f[1],f[2]];RB=f[0]==='RAINBOW';BAN=STY.ban[l.ban][1];}
applyLook(meta.eq);
const grubRows=['....kkkkkkk.....','..kkpppppppkk...','.kppPPpppppppk..','kppPPpppspppppk.','kpppppppppkkkpk.','kppsppppppkwwkkk','kpppppppppkwkkmk','kpppppppppppkkmk','.kppppppppppkkk.','..kkpkkppkkpk...','...kk..kk..kk...'];
const GR={r:mk(grubRows,{k:'#282038',p:'#8858c8',P:'#b890f0',s:'#f8d858',w:'#ffffff',m:'#f8f0d0'})};GR.l=flip(GR.r);
const BO={r:mk(grubRows,{k:'#281820',p:'#b83848',P:'#f07878',s:'#f8d858',w:'#ffffff',m:'#f8f0d0'})};BO.l=flip(BO.r);
const CHR={
 ERIN:[['....kkkk....','...khHHhk...','..khHhhhhk..','.khhhhhhhhk.','.khffffffhk.','.khfkffkfhk.','.khffffffhk.','.khhffffhhk.','.khkddddkhk.','.kkdDddddkk.','..kddddddk..','.kddDdddddk.','.kddddddddk.','..kkbkkbkk..'],{k:'#282038',h:'#b84828',H:'#e87848',f:'#f8dcb0',d:'#9070d0',D:'#c0a8f0',b:'#583828'}],
 MARCUS:[['....kkkk....','..kkcccckk..','.kcCCcccccc.','kkkkkkkkkkkk','.kffffffffk.','.kfkffffkfk.','.krrffffrrk.','.krrrrrrrrk.','..kkkkkkkk..','.ksttttttsk.','.kstTttTtsk.','..kttttttk..','..kbbkkbbk..','..kkk..kkk..'],{k:'#282038',c:'#284878',C:'#5080b8',f:'#f8dcb0',r:'#704828',s:'#e8e0d0',t:'#e88020',T:'#f8c060',b:'#583828'}],
 RANGER:[['....kkkk....','...khhhhk...','...khHHhk...','kkkkbbbbkkkk','khhhhhhhhhhk','.kkffffffkk.','.kfkffffkfk.','.kffffffffk.','..kkkkkkkk..','.kttttttttk.','.ktTttttTtk.','..kttttttk..','..kooKKook..','..kkk..kkk..'],{k:'#282038',h:'#c8a060',H:'#e8c888',b:'#c03030',f:'#e8c098',t:'#506838',T:'#88a060',o:'#583828',K:'#282038'}],
 SCOUT:[['....kkkk....','...kcccck...','..kcCCccck..','.kccccccccc.','.kcffffffck.','.kwwkffkwwk.','.kcffffffck.','.kkcffffckk.','..kkkkkkkk..','.kttttttttk.','.ktTttttTtk.','..kttttttk..','..kbbkkbbk..','..kkk..kkk..'],{k:'#282038',c:'#3c8840',C:'#78c870',f:'#f8dcb0',w:'#e0f8ff',t:'#b89858',T:'#e0c888',b:'#583828'}]};
const CH={};for(const k in CHR)CH[k]=mk(CHR[k][0],CHR[k][1]);
const louieTop=['..kk....kk..........','.kook..kook....kkk..','.koeokkoeok...kooek.','.kooooooook..koeeok.','kokoooookok..koeok..','koeeokoeeokkkkook...','keeeeeeeeoooooook...','.keeekeeeoooooooook.','..kkeeeeoooooooooek.','....keeeooooooooeek.','....keekkkkkkkkkeek.'];
const louieA=[...louieTop,'....kek.kek..kek.kek','....kkk.kkk..kkk.kkk'],louieB=[...louieTop,'...kek..kek.kek..kek','...kkk..kkk.kkk..kkk'];
const LP={k:'#30201c',o:'#e89040',e:'#fff0d8'},LW={k:'#ffffff',o:'#ffffff',e:'#ffffff'};
const louieE=['....................','...kkkkkk......kkk..','kkkoooooookkk.kooek.','keeoooooooeekkoeeok.',...louieA.slice(4)];
const LOU={l:[mk(louieA,LP),mk(louieB,LP)],w:mk(louieA,LW)};LOU.r=LOU.l.map(flip);LOU.wr=flip(LOU.w);LOU.e=mk(louieE,LP);LOU.er=flip(LOU.e);LOU.ew=mk(louieE,LW);LOU.ewr=flip(LOU.ew);
const LOU_PET=['WOOF!','MORE SCRATCHES.','SQUIRREL?!','IS IT PATE TIME?','BEST DAY EVER.','ARF! ARF!','RIGHT THERE. YES.'];
function spSay(s,t=2.4){if(typeof LO!=='undefined'&&LO)LO.say={s,t}}

/* ---------- tiles ---------- */
function tile(fn){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');fn((col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h)});return c;}
const grassV=[[[2,3],[9,6],[13,12],[5,11]],[[4,5],[11,2],[8,13],[14,8]],[[1,9],[6,1],[12,5],[10,12]]];
const TL={
 grass:grassV.map((v,n)=>tile(p=>{p('#58b858',0,0,16,16);v.forEach(([a,b])=>{p('#3c9848',a,b,2,1);p('#3c9848',a,b-1,1,1)});v.forEach(([a,b])=>p('#84d870',(a+7)%15,(b+6)%15,1,1));
   if(n===2){p('#ffffff',7,8,3,1);p('#ffffff',8,7,1,3);p('#f8d040',8,8,1,1)}})),
 dirt:tile(p=>{p('#d8b878',0,0,16,16);[[2,2],[10,4],[6,9],[13,12],[3,13]].forEach(([a,b])=>p('#b89858',a,b,2,1));[[7,2],[12,8],[2,7]].forEach(([a,b])=>p('#f0d8a0',a,b,1,1))}),
 soil:tile(p=>{p('#8a5a3a',0,0,16,16);[3,8,13].forEach((y,i)=>{p('#6e4428',i*2,y,9,1);p('#6e4428',i*2+11,y,4,1)});[[5,1],[12,6],[3,11]].forEach(([a,b])=>p('#a87850',a,b,1,1))}),
 water:[0,1].map(f=>tile(p=>{p('#3888e0',0,0,16,16);[[1,3],[9,7],[4,12]].forEach(([a,b])=>{p('#78b8f8',(a+f*4)%13,b,4,1);p('#a8d8ff',(a+f*4+1)%13,b,1,1)})})),
 tree:tile(p=>{p('#1c5038',0,0,16,16);p('#2c7848',1,1,14,13);p('#2c7848',0,3,16,9);p('#3c9858',2,2,10,8);p('#60c070',3,3,4,2);p('#60c070',8,5,3,1);p('#143828',1,13,14,3);p('#143828',5,10,1,1);p('#143828',11,9,1,1)}),
 gate:[tile(p=>{p('#281810',1,2,14,13);p('#583020',2,3,12,11);p('#885030',2,5,12,1);p('#885030',3,9,10,1);p('#885030',4,12,9,1);[[3,3],[8,4],[12,7],[5,8],[10,11],[2,12]].forEach(([a,b])=>p('#f08030',a,b,1,2));p('#f8d858',8,3,1,1);p('#f8d858',5,7,1,1)}),
  tile(p=>{p('#207088',1,5,6,11);p('#207088',5,1,7,15);p('#207088',10,6,5,10);p('#60d8e8',2,6,4,9);p('#90f0f8',6,2,5,13);p('#48b0d0',11,7,3,8);p('#ffffff',7,3,1,4);p('#ffffff',3,7,1,2);p('#ffffff',12,8,1,1)}),
  tile(p=>{p('#583018',0,5,16,3);p('#583018',0,11,16,3);p('#b07840',0,5,16,2);p('#b07840',0,11,16,2);[2,10].forEach(x=>{p('#583018',x,1,4,15);p('#c89050',x+1,2,2,13);p('#e8b878',x+1,2,1,3)})})]};

TL.wood=tile(p=>{p('#c89860',0,0,16,16);p('#a87848',0,7,16,1);p('#a87848',0,15,16,1);p('#a87848',5,0,1,7);p('#a87848',12,8,1,7);p('#e0b880',1,1,3,1);p('#e0b880',7,9,3,1)});
/* ---------- state ---------- */
let map,fieldL,fieldW,P,LO,buds,sprouts,items,foes,gates,bugs,npcs,plots,parts,spawns,trail,squad,sel,day,dayT,shards,run,tod,gard,won,time=0,msg='',msgT=0,cam,cur,wr,aT,found,winT,sndT=0,duskSaid,achT=0,saveT=0,petOK=false;
const Z=1.5,VW=160;let VH=134,SCW=240,TRN=null,hop=null,pan=null,card=null,scn=null,scnDone=null,sceneQ=[];
let manT=0,needT=-1,inHome=false,parked=[],resid=[],cineI=0,cineT=0,cpage=0;
let introT=0,home={res:Array(NT).fill(0),jobs:[0,0,0],up:0},hi=0;
const DOOR={x:33*16+8,y:17*16+2};
const homeTotal=()=>home.res.reduce((a,b)=>a+b,0),homeLv=()=>Math.min(10,(homeTotal()/5)|0),capNow=()=>CAP+5*homeLv()+2*(rankOf(meta.xp)[0]-1);
const inSoil=q=>q.x>=400&&q.x<512&&q.y>=352&&q.y<400,crewCount=()=>buds.filter(b=>!b.gard).length+sprouts.filter(inSoil).length+seeds.length;
const HCAP=[10,20,35,50],UPCOST=[200,600,1400],homeCap=()=>HCAP[home.up|0];
const LOU_AT=[0,15,40,80,140,220],LOU_AB=['FETCHES LOST SPROUTS','SHARP NOSE: MORE BERRIES','PACK LEADER: FETCHES GROUPS','DOGGY PADDLE: FETCHES FROM WATER','GUARD DOG: SCARES GRUBS','TREASURE HOUND: FINDS TICKETS'];
const louLv=()=>{let k=1;for(let i=1;i<LOU_AT.length;i++)if(meta.dog.xp>=LOU_AT[i])k=i+1;return k};
function louXP(n){const a=louLv();meta.dog.xp+=n;const b=louLv();if(b>a){toast('LOUIE REACHED LEVEL '+b+'!');spSay('NEW TRICK!',3);say('LOUIE LEARNED '+LOU_AB[b-1],6);snd(784,.1);later(()=>snd(1175,.25),110);save()}}
let state='off',bootT=0,bootDing=false,mi=0,ri=0,si=0,pi=0,look=null,dlg=null,dlgPage=0,toasts=[],flash='',flashT=0,cartSel=0,capS={ph:'idle',t:0,it:null},eraseArm=0,resetArm=0,seti=0,setFrom='menu';
const say=(s,t=4)=>{msg=s;msgT=t};
/* ---------- cartridge 2: North Coast Knockout (src/knockout.js) ---------- */
let cart=0;
const KO=window.KO_CART?window.KO_CART({g,W,H:()=>H,r,text,ctext,tw,snd,noise,keys,pressed,mk,flip,ac:()=>ac,meta:()=>meta,eject:()=>eject(),hasTracks:n=>TRACKS.some(t=>t.use.includes(n))}):null;
const PP=window.PP_CART?window.PP_CART({g,W,H:()=>H,r,text,tw,snd,noise,keys,pressed,mk,flip,CH,LOU,TL,will:()=>SP,meta:()=>meta,persist:()=>persist(true),eject:()=>eject(),active:()=>state==='pp',hasTracks:n=>TRACKS.some(t=>t.use.includes(n))}):null;
const PAD=[['act','call','swap','pause'],['light','heavy','super','pause'],['attack','cast','swap','pause'],['use','toss','recipes','pause'],['act','call','select','menu']];
function setPad(i){try{const q=(s,t)=>{const e=document.querySelector(s);if(e)e.textContent=t},L=PAD[i]||PAD[0];q('#bA span',L[0]);q('#bB span',L[1]);q('#bSel small',L[2]);q('#bSta small',L[3]);const cs=$('console');if(cs)cs.classList.toggle('ko',i===1||i===2);const sl=$('bSel');if(sl)sl.classList.remove('ready')}catch(e){}}
const toast=s=>toasts.push({s,t:3.2});
function carve(x,y,w,h,t=G){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)map[j*MW+i]=t;}
function tileAt(px,py){const tx=px>>4,ty=py>>4;if(tx<0||ty<0||tx>=MW||ty>=MH)return TR;return map[ty*MW+tx];}
function free(px,py,swim){const t=tileAt(px,py);return t<=2||t===7||(swim&&t===WA);}
function moveEnt(e,dx,dy,rr,swim){const nx=e.x+dx;if(free(nx-rr,e.y-rr,swim)&&free(nx+rr,e.y-rr,swim)&&free(nx-rr,e.y+rr,swim)&&free(nx+rr,e.y+rr,swim))e.x=nx;
 const ny=e.y+dy;if(free(e.x-rr,ny-rr,swim)&&free(e.x+rr,ny-rr,swim)&&free(e.x-rr,ny+rr,swim)&&free(e.x+rr,ny+rr,swim))e.y=ny;}
function bfs(swim){const d=new Int16Array(MW*MH).fill(-1),q=[HTY*MW+HTX];d[q[0]]=0;for(let h=0;h<q.length;h++){const c=q[h],cx=c%MW,cy=(c/MW)|0;
 for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+ax,ny=cy+ay;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const n=ny*MW+nx,t=map[n];if(d[n]<0&&(t<=2||(swim&&t===WA))){d[n]=d[c]+1;q.push(n)}}}return d;}
function pathTo(sx,sy,tx,ty,swim){const s0=(sy>>4)*MW+(sx>>4),t0=(ty>>4)*MW+(tx>>4);if(s0===t0)return[{x:tx,y:ty}];const prev=new Int32Array(MW*MH).fill(-1),q=[s0];prev[s0]=s0;
 for(let h=0;h<q.length;h++){const c=q[h];if(c===t0)break;const cx=c%MW,cy=(c/MW)|0;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+ax,ny=cy+ay;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const n=ny*MW+nx,tt=map[n];if(prev[n]<0&&(tt<=2||(swim&&tt===WA))){prev[n]=c;q.push(n)}}}
 if(prev[t0]<0)return null;const out=[];for(let c=t0;c!==s0;c=prev[c])out.push({x:(c%MW)*16+8,y:((c/MW)|0)*16+8});return out.reverse();}
function fields(){fieldL=bfs(false);fieldW=bfs(true);}
function mkGate(sub,tiles,id){tiles.forEach(([x,y])=>map[y*MW+x]=GT);const cx=tiles.reduce((a,t)=>a+t[0],0)/tiles.length*16+8,cy=tiles.reduce((a,t)=>a+t[1],0)/tiles.length*16+8;
 const hp=[30,45,45,80][sub];gates.push({kind:'ga',id,sub,tiles,hp,max:hp,alive:true,on:[],x:cx,y:cy});}
function openGate(ga,fx){ga.alive=false;ga.tiles.forEach(([x,y])=>{map[y*MW+x]=(ga.sub===3||x===28||y===20)?D:G;if(fx)puff(x*16+8,y*16+8,['#f08030','#90f0f8','#c89050','#e8c888'][ga.sub],8,45)});bakeDirty=true;
 ga.on.slice().forEach(b=>{b.tgt=null;b.z=0;b.st=d2(b,P.x,P.y)<80*80?'follow':'idle'});ga.on.length=0;fields();}
function mkItem(sub,x,y){const def={berry:{w:1,seeds:1,r:4},big:{w:3,seeds:3,r:7},husk:{w:2,seeds:2,r:5},shard:{w:4,seeds:0,r:6},nectar:{w:1,seeds:0,r:5},pear:{w:8,seeds:4,r:8},trs:{w:3,seeds:0,r:5}}[sub];const it={kind:'it',sub,x,y,alive:true,on:[],...def};items.push(it);return it;}
function mkFoe(x,y,boss){const e={kind:'en',x,y,hx:x,hy:y,boss,r:boss?13:7,hp:boss?150:20,max:boss?150:20,alive:true,on:[],st:'wander',t:0,cd:0,cdP:0,shake:0,face:1,wx:x,wy:y,wt:0};foes.push(e);return e;}
function mkBug(sp,x,y){const q={kind:'bug',sp,x,y,hx:x,hy:y,wx:x,wy:y,t:0,r:3,alive:true,on:[],hid:false,fx:1};bugs.push(q);return q;}
function mkSprout(type,x,y,age=0){sprouts.push({x,y,type,age});}
function mkBud(type,stage,x,y){const b={type,stage,x,y,z:0,st:'follow',tgt:null,t:0,fx:1,mv:false,a:R(0,6),dead:false,nh:0,gard:false,xp:0,star:false};buds.push(b);return b;}
const stageOf=s=>s.age<12?0:s.age<30?1:2;
const str=it=>it.on.reduce((a,b)=>a+(b.type===1?2:1),0);
function soilSpot(){for(let n=0;n<10;n++){const x=R(404,508),y=R(357,396);if(!sprouts.some(s=>d2(s,x,y)<49))return[x,y];}return[R(404,508),R(357,396)];}
const kinds=()=>meta.bugs.filter(x=>x>0).length;
const gardeners=()=>buds.filter(b=>b.gard).length;
const inGarden=(x,y)=>gard.open&&x>=640&&x<832&&y>=48&&y<160;
/* garden beds */
const BEDS=[[44,8],[48,8],[42,8],[50,8],[44,6],[48,6],[42,6],[50,6],[44,4],[48,4],[42,4],[50,4]];
const bedCount=()=>gard.harv<8?4:gard.harv<25?8:12;
function syncBeds(){const n=bedCount();while(plots.length<n){const [tx,ty]=BEDS[plots.length];map[ty*MW+tx]=S;bakeDirty=true;plots.push({kind:'plot',x:tx*16+8,y:ty*16+9,r:5,alive:true,on:[],st:0,dry:true,t:0,flower:0,prog:0,claim:0});}}
const needs=p=>p.st===0||p.st===4||p.dry;
const FLOWERS=[{n:'DAISY',pl:'DAISIES',v:3,g:15,at:0},{n:'TULIP',pl:'TULIPS',v:5,g:22,at:10},{n:'SUNFLOWER',pl:'SUNFLOWERS',v:8,g:32,at:30},{n:'MOONBLOOM',pl:'MOONBLOOMS',v:12,g:45,at:60}];
const seedsOpen=()=>FLOWERS.filter(f=>gard.harv>=f.at).length;
const SIGN={x:47*16+8,y:7*16+12};
function newOrder(){const k=(Math.random()*seedsOpen())|0,need=4+((Math.random()*4)|0);gard.order={k,need,have:0,rw:Math.round(need*FLOWERS[k].v*1.5)};}

function mkNPCs(){
 const N=(name,tx,ty,col,pal,intro,bye,ms)=>({name,x:tx*16+8,y:ty*16+8,col,spr:CH[name]||buildP(...pal).pd,intro,bye,ms,mi:0,st:'new'});
 npcs=[
  N('ERIN',31,19,'#c8a8f8',['#b84828','#e87848','#9070d0','#c0a8f0'],
   "Right then, Will. Let's start small.",
   "Look at it all, Will. The lantern's lit and the garden's blooming. Not bad for the three of us.",[
   {id:'e1',t:'PLUCK 6 SPROUTS',say:"See the sprouts in the soil below the lantern? Walk up to one and press A to pluck it. They'll follow you anywhere.",get:()=>run.plucked,goal:6,rw:10},
   {id:'e2',t:'BRING HOME 3 BERRIES',say:"Face a berry and press A to throw a sprout at it. They carry it home, and the lantern turns berries into new sprouts. Hold B to call everyone back.",get:()=>run.delivered,goal:3,rw:10},
   {id:'e3',t:'PET LOUIE 3 TIMES',say:"Louie sniffs out berries and rounds up strays. Stand still facing him and press A when the heart pops up.",get:()=>run.pets,goal:3,rw:10},
   {id:'e4',t:'PLUCK 3 BLOOMED',say:"Leave sprouts in the soil a while. Leaf, then bud, then bloom. Bloomed sprouts are faster and stronger.",get:()=>run.bloom,goal:3,rw:15,tk:1},
   {id:'e5',t:'HARVEST 3 FLOWERS',garden:1,say:"You're a natural, Will. I've unlocked my garden for you! Go east through the berry field, then north past the fence. I'll meet you there.",
    hint:"Throw sprouts at the soil beds. They plant, water and pick the flowers all on their own, and they keep at it for as long as you leave them here. Dews water fastest.",get:()=>gard.harv,goal:3,rw:20},
   {id:'e6',t:'STATION 5 GARDENERS',say:"Picked flowers land in the basket by the path. Walk over it to collect your petals. The sign beside it picks which seeds get planted. Leave five sprouts here as gardeners and we'll never run short.",get:()=>gardeners(),goal:5,rw:20,tk:1},
   {id:'e11',t:'SEND 5 SPROUTS HOME',say:"Crew getting crowded? Our house is in the corner of the Lantern Field. Walk in the front door and use the desk. Sprouts that move in live there and take a job: picking berries, making petals or training Louie. You choose who does what.",get:()=>homeTotal(),goal:5,rw:25},
   {id:'e7',t:'HAVE 15 SPROUTS',wake:1,say:"Now, those shards. Fair warning: purple grubs are waking up out there. They can't hurt a sprout, only spook it back into the soil, and Louie barks when one's near. Grow the crew to 15 first.",get:()=>run.maxCrew,goal:15,rw:25},
   {id:'e8',t:'BRING HOME 4 SHARDS',say:"Four sun shards: one east, one north, one on the island out west, and one down south with Old Thornback. Ranger, Scout and Marcus know the way.",get:()=>shards,goal:4,rw:50,tk:1},
   {id:'e9',t:'HARVEST 30 FLOWERS',say:"Honestly, Will, the lantern needs you less than my garden does now. More flowers open more beds. Let's fill this place.",get:()=>gard.harv,goal:30,rw:60,tk:1},
   {id:'e10',t:'FILL 5 FLOWER ORDERS',say:"I've started taking flower orders, Will. The banner at the top of the garden shows what I need. Bigger flowers take longer but pay better, and every third order earns a capsule ticket.",get:()=>gard.orders,goal:5,rw:60,tk:1}]),
  N('RANGER',30,16,'#f8a070',['#c03030','#f07060','#805838','#b08860'],
   "I watch the paths around here. Two of them are blocked.","Paths are clear. Nice work, Will.",[
   {id:'r1',t:'BURN THE BRAMBLE',say:"Bramble blocks the north path. Only orange Embers can burn it. Throw them right at it.",get:()=>gates[0].alive?0:1,goal:1,rw:15},
   {id:'r2',t:'FIND A PEB',say:"Grey Pebs sleep up north. They carry double, and grubs can't budge them.",get:()=>found[1]?1:0,goal:1,rw:10},
   {id:'r3',t:'SMASH THE WEST CRYSTAL',say:"The west path is sealed with crystal. Only Pebs can smash it.",get:()=>gates[1].alive?0:1,goal:1,rw:15},
   {id:'r5',t:'BUILD THE ORCHARD BRIDGE',say:"One more path. A river cuts off the north end of the orchard, past Scout. That's the Crooked River. Throw a crowd of sprouts at the stakes and they'll build a bridge. Any kind will do. Willow Falls is on the other side.",get:()=>gates[5].alive?0:1,goal:1,rw:25},
   {id:'r4',t:'WAKE OLD THORNBACK',say:"Those marks lead south, to Old Thornback's hollow. The old folk called him the guardian of the light. He sleeps like a boulder. It takes a whole crowd of sprouts climbing on him to wake him.",get:()=>run.boss?1:0,goal:1,rw:50,tk:1}]),
  N('SCOUT',40,22,'#a8f080',['#3c8840','#78c870','#b89858','#e0c888'],
   "I study the critters out here. Want to help?","My notebook is full. Check your Collection in the main menu!",[
   {id:'s1',t:'FIND A ZIP',say:"Yellow Zip sprouts grow in the far corner of this field. Zips are the fastest sprouts there are.",get:()=>found[3]?1:0,goal:1,rw:10},
   {id:'s2',t:'CATCH A BUG',say:"Throw a sprout at a bug to catch it. Ladybugs are slow. Butterflies need someone quick, like a Zip.",get:()=>run.bugs,goal:1,rw:10},
   {id:'s3',t:'BEAT 2 GRUBS',wake:1,say:"Purple grubs spook sprouts back into the soil. Throw a bunch at one at once. Embers shoo them off fastest.",get:()=>run.foes,goal:2,rw:20},
   {id:'s4',t:'CATCH 4 KINDS OF BUGS',say:"Some bugs only come out at dusk, and one lives over water. Catch 4 different kinds.",get:()=>kinds(),goal:4,rw:30,tk:1}]),
  N('MARCUS',17,23,'#78c8f8',['#284878','#5080b8','#e88020','#f8c060'],
   "Bro. BRO. Will! Perfect timing. I've got the best idea anyone has ever had. A lazy river. Around the WHOLE valley. Dews as lifeguards. Waterslide off the lantern. Marcus Waterworks, bro.","Waterworks is basically done, bro. In my head. Go enjoy that lantern.",[
   {id:'m1',t:'FIND A DEW',say:"First I need staff. Blue Dews grow on the north shore. They swim, nobody else does. See one, send one, bro. Go grab me a Dew.",get:()=>found[2]?1:0,goal:1,rw:10},
   {id:'m2',t:'BRING THE ISLAND SHARD',say:"See that island, bro? Future VIP section. There's a shard on it. Send your Dews into the water and they'll swim out and haul it home. I'd do it myself but these are new shoes.",get:()=>run.isle?1:0,goal:1,rw:30},
   {id:'m3',t:'CATCH A DRAGONFLY',say:"Last thing. Waterworks needs a mascot. Dragonflies over the pond, bro. Only a Dew can reach one. I've caught like a hundred. ...I've caught zero. Send one!",get:()=>meta.bugs[3]?1:0,goal:1,rw:20,tk:1}])];
}
function init(){
 map=new Uint8Array(MW*MH).fill(TR);
 carve(21,15,14,11);carve(35,19,4,3);carve(39,13,14,13);carve(47,15,3,2,WA);carve(43,19,2,2,TR);
 carve(27,10,3,5);carve(19,2,18,8);carve(18,19,3,3);carve(3,12,15,15);carve(5,14,11,11,WA);carve(9,18,3,3);
 carve(27,26,3,5);carve(19,31,18,7);carve(40,3,12,7);carve(45,10,2,3);
 carve(53,19,2,3);carve(55,14,13,12);carve(59,19,2,2,TR);carve(64,16,2,2,TR);carve(61,23,2,1,WA);carve(4,27,2,3);carve(3,30,13,9);carve(3,33,13,2,D);carve(3,35,13,4,WA);
 carve(55,2,13,9);carve(55,2,5,3,WA);carve(55,5,2,6,WA);carve(55,11,13,2,WA);carve(60,13,2,1); /* Willow Falls: pool, stream, river, and the bank the bridge starts from */
 for(let x=18;x<=67;x++)if(map[20*MW+x]===G)map[20*MW+x]=D;
 for(let y=3;y<=36;y++)if(map[y*MW+28]===G)map[y*MW+28]=D;
 for(let y=7;y<=13;y++){map[y*MW+45]=D;map[y*MW+46]=D}
 for(let y=5;y<=19;y++)if(map[y*MW+61]===G)map[y*MW+61]=D;
 carve(25,22,7,3,S);carve(32,15,3,2,6);carve(45,30,11,7,7);home={res:Array(NT).fill(0),jobs:[0,0,0],up:0};
 gates=[];mkGate(0,[[27,12],[28,12],[29,12]],'northBramble');mkGate(1,[[19,19],[19,20],[19,21]],'westCrystal');mkGate(1,[[27,27],[28,27],[29,27]],'southCrystal');mkGate(0,[[27,29],[28,29],[29,29]],'southBramble');mkGate(2,[[45,11],[46,11]],'gardenFence');
 BR.clear();[[60,11],[61,11],[60,12],[61,12]].forEach(([x,y])=>BR.add(y*MW+x));mkGate(3,[[60,11],[61,11],[60,12],[61,12]],'orchardBridge');
 buds=[];sprouts=[];items=[];foes=[];bugs=[];parts=[];trail=[];squad=[];toasts=[];plots=[];seeds=[];bakeDirty=true;mkWbuds();
 P={x:HX,y:HY+22,dx:0,dy:1,anim:0,stun:0,kx:0,ky:0,pluck:0,pl:null,mv:false,idle:0,tr:0};
 LO={x:HX-22,y:HY+26,sx:HX-22,sy:HY+26,st:'follow',t:0,tt:0,dt:0,fx:1,mv:false,cd:1,bark:3,alert:0,dig:R(25,40),tg:null,tx:0,ty:0};
 run={seen:{'LANTERN FIELD':1},grubs:false,plucked:0,delivered:0,bloom:0,pets:0,foes:0,bugs:0,maxCrew:0,boss:false,isle:false};
 tod={berries:0,flowers:0,bugs:0,spooked:0};gard={open:false,harv:0,basket:0,seed:0,order:null,orders:0};won=false;
 fields();
 const c=(tx,ty)=>[tx*16+8,ty*16+8];
 spawns=[];
 [[23,17],[33,17],[22,24],[41,15],[45,22],[50,15],[42,24],[48,19],[20,8],[31,3],[35,8],[9,18],[11,20]].forEach(([x,y])=>spawns.push({k:'berry',x,y}));
 [[46,23],[21,33],[35,36],[24,6]].forEach(([x,y])=>spawns.push({k:'big',x,y}));
 [[44,16],[49,23],[30,6],[4,26]].forEach(([x,y])=>spawns.push({k:'grub',x,y}));
 [[0,24,18],[0,42,18],[0,49,21],[1,22,7],[1,33,7],[2,45,14],[2,41,23],[2,32,23],[3,7,16],[3,13,22],[4,26,17],[4,30,5],[4,46,20],[5,22,36],[2,43,5],[0,49,5]].forEach(([sp,x,y])=>spawns.push({k:'bug',sp,x,y}));
 [[57,16],[60,22],[64,14],[66,23],[5,31],[12,31],[14,32]].forEach(([x,y])=>spawns.push({k:'berry',x,y}));[[59,17],[62,16],[66,19],[57,24],[63,21],[10,32]].forEach(([x,y])=>spawns.push({k:'big',x,y}));
 spawns.push({k:'grub',x:63,y:24});[[6,62,18],[6,58,21],[7,7,33],[7,12,34],[8,24,5],[8,43,16],[9,4,20],[9,16,15]].forEach(([sp,x,y])=>spawns.push({k:'bug',sp,x,y}));[[2,60,17],[2,64,22],[0,58,23],[3,6,36],[3,12,36],[1,13,32]].forEach(([sp,x,y])=>spawns.push({k:'bug',sp,x,y}));
 [[62,4],[66,3],[65,9],[58,7]].forEach(([x,y])=>spawns.push({k:'berry',x,y}));[[64,6],[58,9]].forEach(([x,y])=>spawns.push({k:'big',x,y}));spawns.push({k:'pear',x:66,y:6});
 [[63,3],[59,6],[41,22],[34,6],[62,18],[33,33]].forEach(([x,y])=>spawns.push({k:'nectar',x,y}));[[9,57,8],[3,57,3],[4,64,8],[4,60,9],[2,65,4],[8,62,9]].forEach(([sp,x,y])=>spawns.push({k:'bug',sp,x,y}));
 spawns.forEach(s=>s.id=s.k+(s.sp===undefined?'':s.sp)+'@'+s.x+','+s.y); /* save ids: append new spawns at the end only */
 respawn();
 mkItem('shard',...c(51,19));const s2=mkItem('shard',...c(34,4));s2.w=6;const s3=mkItem('shard',...c(10,19));s3.w=5;s3.isle=true;
 mkFoe(...c(28,35),true);
 for(let i=0;i<6;i++){const [x,y]=soilSpot();mkSprout(0,x,y,8)}
 for(let i=0;i<5;i++)mkSprout(1,(21+i)*16+8,4*16+8,0);
 for(let i=0;i<5;i++)mkSprout(2,(6+i*2)*16+8,12*16+10,0);
 for(let i=0;i<3;i++)mkSprout(2,(6+i*3)*16+8,34*16+10,0);for(let i=0;i<4;i++)mkSprout(5,(58+i*2)*16+8,15*16+4,0);for(let i=0;i<4;i++)mkSprout(4,(45+i)*16+8,3*16+6,0);
 [[51,24],[52,24],[51,25],[52,25]].forEach(([x,y])=>mkSprout(3,x*16+8,y*16+6,0));
 for(let i=0;i<3;i++)mkSprout(2,(62+i)*16+8,2*16+10,0);for(let i=0;i<2;i++)mkSprout(5,(66+i)*16+4,9*16+8,0);
 mkNPCs();syncBeds();
 sel=0;day=1;dayT=0;shards=0;wr=0;aT=0;winT=0;duskSaid=false;found=Array(NT).fill(false);
 cam={x:P.x-VW/2,y:P.y-VH/2};cur={x:P.x,y:P.y+56};msg='';msgT=0;inHome=false;parked=[];newSpark();
}
function respawn(){for(const s of spawns){if((s.ref&&s.ref.alive)||(s.k==='grub'&&!run.grubs))continue;const x=s.x*16+8,y=s.y*16+8;s.ref=s.k==='grub'?mkFoe(x,y,false):s.k==='bug'?mkBug(s.sp,x,y):mkItem(s.k,x,y);}}
function openGarden(fx){if(gard.open)return;gard.open=true;if(!gard.order)newOrder();openGate(gates[4],fx);const e=npcs[0];e.x=46*16+8;e.y=5*16+8;}

/* ---------- save / load of the run ---------- */
const LEGACY_NPC={ERIN:['e1','e2','e3','e4','e5','e6','e7','e8','e9'],RANGER:['r1','r2','r3','r4'],SCOUT:['s1','s2','s3','s4'],MARCUS:['m1','m2','m3']};
const LEGACY_GATES=['northBramble','westCrystal','southCrystal','southBramble','gardenFence'];
function snap(){const sid=o=>{const q=spawns.find(q=>q.ref===o);return q?q.id:''},G2={},N2={};
 gates.forEach(q=>G2[q.id]=[q.alive?1:0,Math.round(q.hp)]);npcs.forEach(n=>N2[n.name]=[n.st==='done'?'':n.ms[n.mi].id,n.st]);
 return{v:3,day,dayT:Math.round(dayT),shards,found,sel,run,tod,won,px:(inHome?DOOR.x:P.x)|0,py:(inHome?DOOR.y+12:P.y)|0,gates:G2,npcs:N2,
 sprouts:sprouts.concat(seeds.map(q=>({type:q.type,x:q.tx,y:q.ty,age:0}))).map(q=>[q.type,q.x|0,q.y|0,Math.round(q.age)]),buds:buds.map(b=>[b.type,b.stage,b.gard?1:0,b.x|0,b.y|0,Math.round(b.xp||0)]),home,
 items:items.filter(q=>q.alive).map(q=>[q.sub,q.x|0,q.y|0,q.w,q.isle?1:0,sid(q),q.tri===undefined?-1:q.tri]),foes:foes.filter(e=>e.alive).map(e=>[e.hx,e.hy,e.boss?1:0,Math.round(e.hp),sid(e)]),
 plots:plots.map(p=>[p.st,p.dry?1:0,Math.round(p.t),p.flower]),gard};}
function upgradeSave(o){if(o.v>=3)return o; /* version 2 stored gates, people and spawns by position */
 const G2={},N2={},names=['ERIN','RANGER','SCOUT','MARCUS'],sid=i=>i>=0&&spawns[i]?spawns[i].id:'';
 (o.gates||[]).forEach((q,i)=>{if(LEGACY_GATES[i])G2[LEGACY_GATES[i]]=q});
 (o.npcs||[]).forEach((q,i)=>{const L=LEGACY_NPC[names[i]];if(L)N2[names[i]]=[q[1]==='done'||!L[q[0]]?'':L[q[0]],q[1]==='done'||L[q[0]]?q[1]:'done']});
 o.items=(o.items||[]).map(q=>[q[0],q[1],q[2],q[3],q[4],sid(q[5])]);o.foes=(o.foes||[]).map(q=>[q[0],q[1],q[2],q[3],sid(q[4])]);
 o.plots=(o.plots||[]).map(q=>[q[0],q[1],q[2],0]);o.gates=G2;o.npcs=N2;o.v=3;return o;}
function restore(o){init();o=upgradeSave(o);day=o.day;dayT=o.dayT;shards=o.shards;found=o.found;while(found.length<NT)found.push(false);sel=o.sel;run=Object.assign(run,o.run);tod=Object.assign(tod,o.tod||{});won=!!o.won;gard=Object.assign(gard,o.gard,{open:false});
 gates.forEach(q=>{const k=o.gates[q.id];if(!k)return;if(!k[0]&&q.id!=='gardenFence')openGate(q);else q.hp=k[1]});
 npcs.forEach(n=>{const k=o.npcs[n.name];if(!k)return;if(k[1]==='done'){n.st='done';n.mi=n.ms.length;return}const i=n.ms.findIndex(m=>m.id===k[0]);n.mi=Math.max(0,i);n.st=k[1]==='new'&&i<=0?'new':'active'});
 if(o.home&&o.home.res){const t=o.home.res.reduce((a,b)=>a+b,0);home={res:o.home.res.slice(0,NT),jobs:(o.home.jobs||[0,t,0]).slice(0,3),up:o.home.up|0};while(home.res.length<NT)home.res.push(0)}
 if(o.gard&&o.gard.open)openGarden();
 P.x=o.px;P.y=o.py;if(!free(P.x,P.y,false)){P.x=HX;P.y=HY+22}LO.x=LO.sx=P.x-18;LO.y=LO.sy=P.y+4;
 sprouts=[];o.sprouts.forEach(q=>mkSprout(q[0],q[1],q[2],q[3]));
 buds=[];o.buds.forEach((q,i)=>{const b=mkBud(q[0],q[1],P.x+((i%7)-3)*5,P.y+6+((i/7)|0)*4);b.xp=q[5]||0;b.star=b.xp>=40;if(q[2]&&gard.open){b.gard=true;b.st='tend';b.x=q[3];b.y=q[4];b.t=R(0,1)}else if(!free(b.x,b.y,false)){b.x=P.x;b.y=P.y}});
 items=[];foes=[];spawns.forEach(q=>{if(q.k!=='bug')q.ref={alive:false}});
 o.items.forEach(q=>{const it=mkItem(q[0],q[1],q[2]);it.w=q[3];it.isle=!!q[4];if(q[6]>=0)it.tri=q[6];const sp=spawns.find(k=>k.id===q[5]);if(sp)sp.ref=it});
 o.foes.forEach(q=>{const e=mkFoe(q[0],q[1],!!q[2]);e.hp=q[3];const sp=spawns.find(k=>k.id===q[4]);if(sp)sp.ref=e});
 plots=[];syncBeds();(o.plots||[]).forEach((q,i)=>{const p=plots[i];if(p){p.st=q[0];p.dry=!!q[1];p.t=q[2];p.flower=Math.min(FLOWERS.length-1,q[3]|0)}});
 if(gard.open&&!gard.order)newOrder();
 fields();digSync();cam.x=P.x-VW/2;cam.y=P.y-VH/2;}
let awayMsg=0;
function awayGrowth(){if(!live||!gard.open||!SAVE.t)return;const hrs=Math.min(8,(Date.now()-SAVE.t)/36e5);if(hrs<.17)return;const n=Math.min(gardeners(),plots.length);if(!n)return;
 const add=Math.min(150-gard.basket,Math.round(hrs*n*6));if(add>0){gard.basket+=add;gard.harv+=(add/6)|0;syncBeds();awayMsg=add}}
function loadWorld(){live=false;if(SAVE.run){try{restore(SAVE.run);live=true;awayGrowth();return}catch(e){SAVE.run=null}}init();}

/* ---------- rewards ---------- */
function unlock1(i){if(meta.ach[i])return;meta.ach[i]=1;toast(ACH[i][0]+'  +'+ACH[i][2]);earn(ACH[i][2]);snd(784,.1);later(()=>snd(1175,.25),110);}
function checkAch(){const c=buds.length,L=meta.life;if(c>run.maxCrew)run.maxCrew=c;
 if(run.plucked>=1)unlock1(0);if(c>=20)unlock1(1);if(c>=40)unlock1(2);if(found.every(x=>x))unlock1(3);if(shards>=1)unlock1(4);
 if(shards>=4){unlock1(5);if(day<=6)unlock1(6)}if(run.boss)unlock1(7);if(kinds()>=BUGS.length)unlock1(8);if(meta.trs.length>=6)unlock1(28);if(meta.trs.length>=TRS.length)unlock1(29);if(homeTotal()>=10)unlock1(30);if(homeTotal()>=30)unlock1(31);if(home.up>0)unlock1(32);if(L.pets>=10)unlock1(9);if(L.flowers>=10)unlock1(10);
 if(L.berries>=50)unlock1(11);if(L.missions>=10)unlock1(12);if(L.blooms>=10)unlock1(13);if(L.flowers>=50)unlock1(14);if(plots.length>=12)unlock1(15);
 if(L.pets>=50)unlock1(16);if(L.bugs>=25)unlock1(17);metaAch();}
function metaAch(){const L=meta.life;if(ownCount()>=10)unlock1(18);if(ownCount()>=styTotal)unlock1(19);if(L.pulls>=5)unlock1(20);if(meta.streak>=3)unlock1(21);if(meta.streak>=7)unlock1(22);
 if(L.berries>=200)unlock1(23);if(L.dailies>=10)unlock1(24);if(rankOf(meta.xp)[0]>=5)unlock1(25);}

/* ---------- helpers ---------- */
function release(b){const t=b.tgt;if(t){const i=t.on.indexOf(b);if(i>=0)t.on.splice(i,1)}b.tgt=null;b.z=0;}
function puff(x,y,c,n=6,sp=30){for(let i=0;i<n;i++)parts.push({x,y,vx:R(-sp,sp),vy:R(-sp,sp*.3),life:R(.3,.6),c});}
function hearts(x,y){for(let i=0;i<3;i++)parts.push({x:x+R(-6,6),y:y-8,vx:R(-4,4),vy:-R(12,20),life:R(.7,1.1),c:'#f85888',gh:2});}
function gtile(ga,b){let best=null,bd=1e9;for(const [tx,ty] of ga.tiles){const x=tx*16+8,y=ty*16+8,d=d2(b,x,y);if(d<bd){bd=d;best={x,y,d}}}return best;}
function tpos(b){const t=b.tgt;if(t.kind==='ga')return gtile(t,b);return t;}
function findTarget(b,rad){let best=null,bd=rad*rad,wrong=null;
 for(const e of foes)if(e.alive){const d=d2(e,b.x,b.y)-e.r*e.r;if(d<bd){bd=d;best=e}}
 for(const it of items)if(it.alive&&str(it)<it.w*2){const d=d2(it,b.x,b.y);if(d<bd){bd=d;best=it}}
 for(const q of bugs)if(q.alive&&!q.hid){const d=d2(q,b.x,b.y);if(d<bd){bd=d;best=q}}
 if(DIG.alive){const d=d2(DIG,b.x,b.y);if(d<bd){bd=d;best=DIG}}
 if(gard.open)for(const p of plots)if(needs(p)&&!p.on.length&&p.claim<time){const d=d2(p,b.x,b.y);if(d<bd){bd=d;best=p}}
 for(const ga of gates)if(ga.alive){const d=gtile(ga,b).d;if(ga.sub!==3&&(ga.sub>1||ga.sub!==b.type)){if(d<900)wrong=ga;continue}if(d<bd){bd=d;best=ga}}
 if(!best&&wrong)say(['ONLY EMBERS BURN BRAMBLE','ONLY PEBS SMASH CRYSTAL',"ERIN HAS THE KEY TO THIS GATE"][wrong.sub],3);
 return best;}
function go(b,tx,ty,sp,dt,swim,stop){const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);if(d>stop){const m=Math.min(d,sp*dt);moveEnt(b,dx/d*m,dy/d*m,1.5,swim);b.mv=true;if(Math.abs(dx)>1)b.fx=dx>0?1:-1;}return d;}
function spook(b){b.dead=true;release(b);puff(b.x,b.y,TYPES[b.type].l,6,40);const [x,y]=soilSpot();mkSprout(b.type,x,y,b.stage*14);tod.spooked++;snd(500,.15,250,'triangle');}
function bark(){snd(520,.05);later(()=>snd(660,.07),70);}
function facing(o,rad){const dx=o.x-P.x,dy=o.y-P.y,d=Math.hypot(dx,dy);return d<rad&&(d<6||(dx*P.dx+dy*P.dy)/d>.55);}

/* ---------- inside the house ---------- */
const RX=45*16,RY=30*16,DESK={x:RX+88,y:RY+8},RZ=[[8,24,46,26],[122,24,46,26],[8,70,50,28],[64,48,50,28]];
function mkRes(){resid=[];const J=home.jobs,pool=[],jobs=[];for(let t=0;t<NT;t++)for(let j=0;j<home.res[t];j++)pool.push(t);for(let j=0;j<3;j++)for(let k=0;k<J[j];k++)jobs.push(j);while(jobs.length<pool.length)jobs.push(3);
 const n=pool.length,m=Math.min(18,n);for(let i=0;i<m;i++){const k=Math.floor(i*n/m),z=RZ[jobs[k]];resid.push({type:pool[(k*7)%n],job:jobs[k],x:RX+z[0]+R(0,z[2]),y:RY+z[1]+R(0,z[3]),tx:0,ty:0,t:R(0,2),a:i*1.3,fx:1,mv:false,z:0,stage:2,star:false,st:'follow',hat:meta.eq.hat})}}
function updRes(dt){for(const q of resid){q.t-=dt;if(q.t<=0){const z=RZ[q.job];q.tx=RX+z[0]+R(0,z[2]);q.ty=RY+z[1]+R(0,z[3]);q.t=R(1.5,4)}const dx=q.tx-q.x,dy=q.ty-q.y,d=Math.hypot(dx,dy);q.mv=d>2;if(q.mv){q.x+=dx/d*18*dt;q.y+=dy/d*18*dt;q.fx=dx>0?1:-1}}}
function enterHome(){buds.forEach(b=>{if(b.st==='ride'){b.st='follow';b.z=0}});LO.riders=[];parked=buds.filter(b=>b.st==='follow');parked.forEach((b,k)=>{b.st='park';b.x=DOOR.x-18+(k%7)*6;b.y=DOOR.y+8+((k/7)|0)*5});
 inHome=true;P.x=RX+88;P.y=RY+94;P.dx=0;P.dy=-1;LO.st='follow';LO.x=LO.sx=P.x+20;LO.y=LO.sy=P.y-6;trail=[];mkRes();cam.x=RX+88-W/2;cam.y=RY+42-H/2;noise(.06,.3,500,'lowpass');snd(330,.08,440,'triangle',.06);}
function exitHome(){inHome=false;P.x=DOOR.x;P.y=DOOR.y+12;P.dx=0;P.dy=1;parked.forEach(b=>{if(b.st==='park')b.st='follow'});parked=[];LO.st='follow';LO.x=LO.sx=P.x-20;LO.y=LO.sy=P.y+4;trail=[];cam.x=P.x-VW/2;cam.y=P.y-VH/2;noise(.06,.3,500,'lowpass');}
const DIG={kind:'dig',x:0,y:0,r:5,alive:false,on:[]};
function digSync(){DIG.on.length=0;const q=run.spark;if(q){DIG.x=q.x;DIG.y=q.y;DIG.alive=true;if(q.hp===undefined)q.hp=8}else DIG.alive=false}
function updDig(dt){const n=DIG.on.length,q=run.spark;if(!n||!q)return;q.hp-=n*dt;DIG.on.forEach(b=>{b.fx=DIG.x>b.x?1:-1});if(Math.random()<dt*9)puff(DIG.x+R(-5,5),DIG.y,'#a87850',1,28);if(sndT<=0){snd(150+Math.random()*60,.03,90);sndT=.14}
 if(q.hp<=0){const it=mkItem('trs',q.x,q.y);it.tri=q.i;it.w=2+q.i%3;run.spark=null;DIG.alive=false;DIG.on.slice().forEach(b=>{b.z=0;b.tgt=it;b.st='seek';b.t=0});DIG.on.length=0;
  puff(q.x,q.y,'#f8e060',10,45);snd(784,.1);later(()=>snd(1175,.15),100);say('DUG UP: '+TRS[q.i][0]+'!  CARRY IT HOME TO THE LANTERN',5);spSay('DUG IT UP!',3);persist()}}
function newSpark(){run.spark=null;digSync();sniffT=20;const un=TRS.map((q,i)=>i).filter(i=>!meta.trs.includes(i)&&!items.some(k=>k.alive&&k.sub==='trs'&&k.tri===i));if(!un.length)return;const zs=ZONES.filter(z=>(run.seen&&run.seen[z[0]])||z[0]==='LANTERN FIELD');
 for(let k=0;k<40;k++){const z=zs[(Math.random()*zs.length)|0],tx=z[1]+((Math.random()*z[3])|0),ty=z[2]+((Math.random()*z[4])|0);if(map[ty*MW+tx]===G&&fieldL[ty*MW+tx]>=0&&d2({x:tx*16+8,y:ty*16+8},HX,HY)>60*60){run.spark={x:tx*16+8,y:ty*16+8,i:un[(Math.random()*un.length)|0],hp:8};digSync();return}}}
let sniffT=0;

/* ---------- objectives ---------- */
const SOIL={x:456,y:376},GARD={x:46*16,y:6*16+8};
const near=(list,ok)=>{let b=null,bd=1e12;for(const o of list)if(ok(o)){const d=d2(o,P.x,P.y);if(d<bd){bd=d;b=o}}return b};
/* ALT: the objective marker points at a berry you can reach right now (not one behind a gate that's still shut).
   Walkable tiles are flood-filled from the player about once a second; a berry within 2 tiles of them counts (sprouts are thrown). */
let reachC=null,reachT=-9;
function reachable(o){if(!reachC||time-reachT>1){reachT=time;const S=new Set(),k=(x,y)=>x+','+y,q=[[P.x>>4,P.y>>4]];S.add(k(q[0][0],q[0][1]));
  while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,kk=k(nx,ny);if(S.has(kk)||nx<0||ny<0||nx>=MW||ny>=MH||!free(nx*16+8,ny*16+8,false))continue;S.add(kk);q.push([nx,ny])}}reachC=S}
 const tx=o.x>>4,ty=o.y>>4;for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(reachC.has((tx+dx)+','+(ty+dy)))return true;return false}
const isBerry=i=>i.alive&&(i.sub==='berry'||i.sub==='big');
const nearBerry=()=>near(items,i=>isBerry(i)&&reachable(i))||near(items,isBerry)||SOIL;
const nearShard=()=>near(items,i=>i.alive&&i.sub==='shard')||near(foes,e=>e.alive&&e.boss)||{x:HX,y:HY};
const nearBug=()=>near(bugs,q=>q.alive&&!q.hid)||{x:42*16,y:18*16};
const AT={e1:()=>near(sprouts,()=>true)||SOIL,e2:nearBerry,e3:()=>LO,e4:()=>SOIL,e5:()=>GARD,e6:()=>GARD,e7:nearBerry,e8:nearShard,e9:()=>GARD,e10:()=>GARD,e11:()=>DOOR,
 r1:()=>gates[0],r2:()=>({x:23*16+8,y:4*16+8}),r3:()=>gates[1],r5:()=>gates[5],r4:()=>near(foes,e=>e.alive&&e.boss)||nearShard(),
 s1:()=>({x:51*16+8,y:24*16+8}),s2:nearBug,s3:()=>near(foes,e=>e.alive&&!e.boss)||{x:44*16,y:16*16},s4:nearBug,
 m1:()=>({x:10*16,y:12*16+10}),m2:()=>near(items,i=>i.alive&&i.isle)||{x:HX,y:HY},m3:()=>({x:7*16+8,y:16*16+8})};
let OBJ=null,objT=0;
function tracked(){const e=npcs[0];if(e.st!=='done')return e;return npcs.find(n=>n.st==='active')||npcs.find(n=>n.st==='new')||null;}
function objective(){const n=tracked();if(!n)return pjObj();if(n.st==='new')return{text:'TALK TO '+n.name,x:n.x,y:n.y,done:false,col:n.col};
 const m=n.ms[n.mi],v=Math.min(m.get(),m.goal);if(v>=m.goal)return{text:'DONE! GO SEE '+n.name,x:n.x,y:n.y,done:true,col:n.col};
 const p=(AT[m.id]&&AT[m.id]())||n;return{text:m.t+':  '+v+' / '+m.goal,x:p.x,y:p.y,done:false,col:n.col};}
const ZONES=[['LANTERN FIELD',21,15,14,11,26,17],['BERRY FIELD',39,13,14,13,40,18],['NORTH MEADOW',19,2,18,8,26,8],["ERIN'S GARDEN",40,3,12,7,40,8],['DEW POND',3,12,15,15,17,18],["THORNBACK'S HOLLOW",19,31,18,7,26,31],['SUNNY ORCHARD',55,14,13,12,56,18],['PEBBLE BEACH',3,30,13,9,8,31],['WILLOW FALLS',55,2,13,9,63,7]];
const postXY=z=>({x:z[5]*16+8,y:z[6]*16+10});let tlist=[],ti=0;
function travelTo(z){const p=postXY(z);P.x=p.x;P.y=p.y+14;P.dx=0;P.dy=1;P.stun=0;trail=[];let k=0;buds.forEach(b=>{if(b.st==='follow'||b.st==='ride'){b.st='follow';b.z=0;b.x=P.x+((k%7)-3)*6;b.y=P.y+8+((k/7)|0)*5;if(!free(b.x,b.y,b.type===2)){b.x=P.x;b.y=P.y}k++}});
 LO.riders=[];LO.st='follow';LO.x=LO.sx=P.x+18;LO.y=LO.sy=P.y+2;if(!free(LO.x,LO.y,false)){LO.x=LO.sx=P.x;LO.y=LO.sy=P.y}cam.x=Math.max(0,Math.min(MW*16-VW,P.x-VW/2));cam.y=Math.max(0,Math.min(MH*16-VH,P.y-VH/2));zone=z[0];zoneT=2.2;state='play';noise(.35,.12,700,'lowpass');snd(440,.25,880,'triangle',.06);spSay('WHEE!')}
let zone='',zoneT=0;
const ZLINE={'BERRY FIELD':['ERIN',"Best berries in the valley. The big ones take three sprouts to lift."],'NORTH MEADOW':['RANGER',"Pebs nap up here. They're heavier than they look."],"ERIN'S GARDEN":['ERIN',"My pride and joy. Wipe your feet."],'DEW POND':['MARCUS',"Bro. This pond? Future Marcus Waterworks. Only Dews go in, though."],"THORNBACK'S HOLLOW":['ERIN',"Quiet now. Something very big is asleep in here."],'SUNNY ORCHARD':['ERIN',"The Luckies love it here. So do the bees."],'PEBBLE BEACH':['MARCUS',"Beach day, bro. The crabs respect me. Mind your toes anyway."],'WILLOW FALLS':['RANGER',"Hear that? These falls feed the Crooked River, and every pond in the valley. Somebody built up here once, too."]};
function zoneTick(dt){if(zoneT>0)zoneT-=dt;const tx=P.x>>4,ty=P.y>>4;for(const z of ZONES)if(tx>=z[1]&&tx<z[1]+z[3]&&ty>=z[2]&&ty<z[2]+z[4]){if(zone!==z[0]){zone=z[0];zoneT=2.2;run.seen=run.seen||{};if(!run.seen[z[0]]){run.seen[z[0]]=1;if(ZLINE[z[0]]&&state==='play'){pan={z,t:0,sx:cam.x,sy:cam.y};state='pan';snd(523,.12);later(()=>snd(784,.25),120)}}}return}}

/* ---------- talking ---------- */
function wakeGrubs(){if(run.grubs)return;run.grubs=true;respawn();}
function talk(n){const L=[],M=n.ms,offer=m=>{L.push(m.say);if(m.wake)wakeGrubs();if(m.garden)openGarden(true)};
 if(n.st==='new'){L.push(n.intro);offer(M[0]);n.st='active';}
 else if(n.st==='active'){const m=M[n.mi],v=m.get();
  if(v>=m.goal){meta.life.missions++;if(m.tk)meta.tix++;earn(m.rw);L.push(n.name==='MARCUS'?["AYYY! See one, send one! That's my guy. Bring it in, bro.","BROOO. Told you. Never doubted you once. Dap me up.","LET'S GOOO! Waterworks is officially happening. Come here, bro."][n.mi%3]+' *DAP* Here, take '+m.rw+' petals'+(m.tk?' and a capsule ticket.':'.'):['Nicely done','You did it','Perfect','Lovely work'][n.mi%4]+(n.name==='ERIN'?', Will':'')+'! Here, take '+m.rw+' petals'+(m.tk?' and a capsule ticket.':'.'));if(n.name==='MARCUS')dap(n);n.mi++;snd(660,.08);later(()=>snd(990,.2),90);
   if(n.mi<M.length)offer(M[n.mi]);else{n.st='done';L.push(n.bye)}checkAch();}
  else L.push(m.hint||m.say,m.t+': '+Math.min(v,m.goal)+' / '+m.goal);}
 else L.push(n.name==='ERIN'?[n.bye,"Louie's been helping himself to the daisies again. I'm pretending I haven't noticed.","The moonblooms only open properly at dusk. Stick around this evening, Will.","If you ever want a quiet job, the garden always needs gardeners.","One sip of nectar and a sprout blooms on the spot. The blossoms open fresh every morning.","When Louie starts sniffing, something's buried close by. The crew can dig it up and carry it home.","The buddies were here before any of us. They never come close. But every night they sit and watch the lantern."][(day+run.pets)%7]:n.name==='MARCUS'?(dap(n),run.pjSeen&&run.pjSeen.ww&&!pjDone(PJ[0])&&(day+run.pets)%2===0?"Blueprint sign's up by the pond, bro. Bring me sprouts. Like, a LOT of sprouts. See one, send one.":pjDone(PJ[0])&&(day+run.pets)%3===0?"Waterworks, bro. Best thing anyone ever built. You helped. A little. A lot. Dap me up.":[n.bye,"Lazy river's coming, bro. I've got a guy. The guy is me.","I'd race you to the island but I'd win. Respectfully, bro.","See one, send one. That's the whole philosophy, bro. Write it down.","Dap me up. *DAP* Yeah. Feels right.","Next idea: a hot tub. Heated by Embers. Don't tell Erin yet."][(day+run.pets)%6]):n.bye);
 const pages=[];for(const p of L){const w=wrapPx(p,178);for(let i=0;i<w.length;i+=3)pages.push(w.slice(i,i+3))}
 dlg={name:n.name,col:n.col,spr:n.spr,pages};dlgPage=0;state='talk';snd(440,.05);}
function dap(n){toast('DAPPED UP!');noise(.05,.35,1800);later(()=>noise(.04,.25,2600),70);later(()=>snd(880,.06),120);const x=(n.x+P.x)/2,y=(n.y+P.y)/2-6;for(let k=0;k<10;k++)parts.push({x,y,vx:R(-30,30),vy:-R(10,40),life:R(.4,.8),c:k%2?'#f8c060':'#78c8f8'})}
const npcMark=n=>n.st==='new'?1:n.st==='active'&&n.ms[n.mi].get()>=n.ms[n.mi].goal?2:0;

/* ---------- cartridge shelf (DOM) ---------- */
const shelf=$('shelf'),carts=[...shelf.querySelectorAll('.cart')];let cartAnim=null,inserting=false;
function cartHi(i){cartSel=i;carts.forEach((c,n)=>c.classList.toggle('sel',n===i));}
function cartPick(i){if(inserting)return;cartHi(i);const c=carts[i];
 try{lanPlayed(i)}catch(e){}
 if(i>4||(i===1&&!KO)||(i===3&&!PP)){$('shelfMsg').textContent='That one is not out yet';c.classList.remove('nope');void c.offsetWidth;c.classList.add('nope');snd(140,.1);return;}
 inserting=true;const a=c.getBoundingClientRect(),s=$('slot').getBoundingClientRect(),d=a.top-s.bottom,dx=(s.left+s.width/2)-(a.left+a.width/2);
 const done=()=>{inserting=false;shelf.hidden=true;$('slot').classList.add('in');$('led').classList.add('on');cart=i;setPad(i);bootT=0;bootDing=false;state='boot';};
 if(c.animate){cartAnim=c.animate([{transform:'translate(0,-4px)',clipPath:'inset(0 0 0 0)'},{transform:`translate(${dx}px,${-d}px)`,clipPath:'inset(0 0 0 0)',offset:.55},{transform:`translate(${dx}px,${-d-a.height}px)`,clipPath:'inset(100% 0 0 0)'}],{duration:950,easing:'ease-in-out',fill:'forwards'});
  noise(.5,.07,900,'lowpass');later(()=>noise(.025,.2,3000),500);later(cartSnap,880);cartAnim.onfinish=done;}else{cartSnap();done()}}
function eject(){persist(true);if(cartAnim){cartAnim.cancel();cartAnim=null}$('slot').classList.remove('in');$('led').classList.remove('on');$('shelfMsg').textContent='Pick a cartridge';shelf.hidden=false;state='off';cart=0;setPad(0);snd(200,.1,90);try{lanCheck(true)}catch(e){}}
carts.forEach((c,i)=>c.addEventListener('pointerdown',e=>{e.preventDefault();unlock();cartPick(i)}));
let lanHi=0;{const lb=$('lanBtn');if(lb)lb.addEventListener('pointerdown',e=>{e.preventDefault();unlock();lanHi=0;lb.classList.remove('sel');lanOpen('off')})}
(()=>{const a=$('cartArt');if(!a||!a.getContext)return;const x=a.getContext('2d'),p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};
 p('#88d0f8',0,0,40,12);p('#58b858',0,12,40,14);p('#3c9848',0,12,40,1);p('#f8e060',17,3,6,7);p('#282038',16,2,8,1);p('#282038',19,10,2,6);
 [['#f07830',6],['#48a0f0',27],['#f0d020',33],['#98a0b0',11]].forEach(([c,X],i)=>{const Y=17+(i%2)*2;p('#282038',X-1,Y-1,7,7);p(c,X,Y,5,5);p('#181020',X+1,Y+2,1,2);p('#181020',X+3,Y+2,1,2);p('#f8a0c8',X+1,Y-4,3,3);p('#2c6030',X+2,Y-2,1,1)});})();

/* ---------- update ---------- */
function nav(i,n){if(pressed('down')){snd(520,.04);return(i+1)%n}if(pressed('up')){snd(520,.04);return(i+n-1)%n}return i;}
const menuItems=()=>(live?['CONTINUE','NEW GAME']:['PLAY']).concat(['REWARDS','CAPSULES','STYLE','COLLECTION','SETTINGS','SWAP CARTRIDGE']);
function update(dt){
 time+=dt;musTick(dt);if(msgT>0&&!toasts.length)msgT-=dt;sndT-=dt;if(flashT>0)flashT-=dt;
 if(toasts.length){toasts[0].t-=dt;if(toasts[0].t<=0)toasts.shift()}
 if(TRN){TRN.t+=dt;if(!TRN.done&&TRN.t>=.3){TRN.done=true;TRN.fn()}if(TRN.t>=.68)TRN=null;return}
 if(state.slice(0,2)==='g3'){g3Update(dt);return}
 if(state.slice(0,2)==='g4'){g4Update(dt);return} /* cartridge 5: Sproutwild */
 if(state.slice(0,3)==='lan'){lanUpdate(dt);return}
 switch(state){
 case 'off':{const lb=$('lanBtn');if(pressed('down')){lanHi=1;if(lb)lb.classList.add('sel');carts.forEach(c=>c.classList.remove('sel'))}if(pressed('up')&&lanHi){lanHi=0;if(lb)lb.classList.remove('sel');cartHi(cartSel)}
  if(!lanHi){if(pressed('right'))cartHi((cartSel+1)%5);if(pressed('left'))cartHi((cartSel+4)%5)}if(pressed('a')||pressed('start')){if(lanHi){lanHi=0;if(lb)lb.classList.remove('sel');cartHi(cartSel);lanOpen('off')}else cartPick(cartSel)}return;}
 case 'boot':bootT+=dt;if(bootT>1.15&&!bootDing){bootDing=true;snd(988,.1);later(()=>snd(1319,.4),100)}if(bootT>2.7||(bootT>.6&&pressed('a'))){if(cart===1){state='ko';KO.start()}else if(cart===2){g3StartTitle()}else if(cart===3){state='pp';PP.start()}else if(cart===4){g4StartTitle()}else{state='intro';introT=0}}return;
 case 'ko':KO.update(dt);return;
 case 'pp':PP.update(dt);return;
 case 'cine':{cineT+=dt;const end=()=>{state='play';const f=scnDone;scnDone=null;if(f)f();persist()};if(pressed('start')){end();return}
  if(pressed('a')||pressed('b')){if(cineT*38<scn[cineI][0].length)cineT=99;else if(++cineI>=scn.length)end();else{cineT=0;snd(440,.04)}}return}
 case 'hop':hop.t+=dt;if(hop.t>1.55||(hop.t>.3&&pressed('a')))travelTo(hop.z);return;
 case 'pan':{pan.t+=dt;const z=pan.z,cx=Math.max(0,Math.min(MW*16-VW,(z[1]+z[3]/2)*16-VW/2)),cy=Math.max(0,Math.min(MH*16-VH,(z[2]+z[4]/2)*16-VH/2)),k=pan.t<1.3?pan.t/1.3:pan.t<3.3?1:Math.max(0,1-(pan.t-3.3)/.9),e=k*k*(3-2*k);
  cam.x=pan.sx+(cx-pan.sx)*e;cam.y=pan.sy+(cy-pan.sy)*e;if(pan.t>4.2||(pan.t>.4&&(pressed('a')||pressed('b')))){cam.x=pan.sx;cam.y=pan.sy;state='play';zoneT=0}return}
 case 'card':card.t+=dt;if(card.t>.45&&(pressed('a')||pressed('b')||pressed('start')))state='play';return;
 case 'intro':introT+=dt;if((introT>4.6&&(cloudDone||introT>8))||(introT>1&&(pressed('a')||pressed('start')))){state='menu';mi=0;snd(660,.08,990)}return;
 case 'menu':{const it=menuItems(),was=mi;mi=nav(mi,it.length);if(mi!==was)eraseArm=0;
  if(!live){cam.x=HX-VW/2+Math.cos(time*.15)*60;cam.y=HY-VH/2+Math.sin(time*.2)*30}
  if(pressed('a')||pressed('start')){const k=it[mi];snd(660,.08,990);
   if((k==='CONTINUE'||k==='PLAY'||k==='NEW GAME')&&!cloudDone&&time<9){flash='CHECKING FOR YOUR SAVE...';flashT=1.5;return}
   if(k==='CONTINUE'){state='play';if(awayMsg){toast('WHILE YOU WERE AWAY:  +'+awayMsg+' IN THE BASKET');awayMsg=0}}
   else if(k==='NEW GAME'&&!eraseArm){eraseArm=1;flash='PRESS A AGAIN TO START OVER';flashT=4}
   else if(k==='PLAY'||k==='NEW GAME'){eraseArm=0;flashT=0;init();live=true;persist(true);playScene('open',()=>talk(npcs[0]))}
   else if(k==='REWARDS'){state='rewards';ri=0}else if(k==='CAPSULES'){lanOpen('menu','caps')}else if(k==='STYLE'){state='style';si=0;look={...meta.eq}}else if(k==='BUG BOOK'||k==='COLLECTION'){state='bugs';cpage=0}else if(k==='SETTINGS'){state='settings';setFrom='menu';seti=0}else eject();}
  return;}
 case 'rewards':ri=nav(ri,ACH.length+4);if(pressed('a')&&ri===0){if(dailyReady()){const a=claimDaily();metaAch();flash='+'+a+' PETALS AND A TICKET!  STREAK '+meta.streak;flashT=3.5;snd(784,.1);later(()=>snd(1046,.2),100)}else snd(140,.08)}
  if(pressed('b')||pressed('start')){state='menu'}return;
 case 'caps':{const c=capS;c.t+=dt;
  if(c.ph==='idle'){if(pressed('b')||pressed('start')){state='menu';return}
   if(pressed('a')){if(!pool().length){flash='YOU HAVE EVERYTHING!';flashT=2.5;snd(140,.1)}
    else if(meta.tix>0||meta.petals>=PULL){if(meta.tix>0)meta.tix--;else meta.petals-=PULL;c.it=pullOne();c.ph='shake';c.t=0;meta.life.pulls++;snd(200,.5,500)}
    else{flash='NEED A TICKET OR '+PULL+' PETALS';flashT=2.5;snd(140,.1)}}}
  else if(c.ph==='shake'){if(c.t>1.3){c.ph='show';c.t=0;const it=c.it;meta.own[it.k].push(it.i);if(it.k==='rd'){try{rdCapGot(it.i)}catch(e){}}else{meta.eq[it.k]=it.i;applyLook(meta.eq)}metaAch();save();snd(784,.1);later(()=>snd(988,.1),100);later(()=>snd(1319,.3),200)}}
  else if(c.t>.5&&(pressed('a')||pressed('b'))){c.ph='idle';c.t=0}
  return;}
 case 'style':{si=nav(si,ROWS.length);const key=ROWS[si][1],n=STY[key].length;
  if(pressed('right')){look[key]=(look[key]+1)%n;applyLook(look);snd(520,.04)}if(pressed('left')){look[key]=(look[key]+n-1)%n;applyLook(look);snd(520,.04)}
  if(pressed('a')){const o=look[key];if(meta.own[key].includes(o)){meta.eq[key]=o;save();snd(660,.08,990)}else{flash='WIN IT FROM A CAPSULE';flashT=2.5;snd(140,.1)}}
  if(pressed('b')||pressed('start')){applyLook(meta.eq);state='menu'}return;}
 case 'bugs':if(pressed('left')||pressed('right')){cpage=1-cpage;snd(520,.04)}if(pressed('b')||pressed('a')||pressed('start'))state='menu';return;
 case 'talk':if(pressed('a')||pressed('b')){dlgPage++;snd(440,.04);if(dlgPage>=dlg.pages.length){state='play';persist()}}return;
 case 'pause':pi=nav(pi,4);if(pressed('start')||pressed('b')){state='play';return}
  if(pressed('a')){if(pi===0)state='play';else if(pi===1)state='map';else if(pi===2){state='settings';setFrom='pause';seti=0}else{persist(true);state='menu';mi=0}}return;
 case 'map':if(pressed('b')||pressed('a')||pressed('start'))state='pause';return;
 case 'house':{hi=nav(hi,7);const back=()=>{state='play';if(inHome)mkRes();persist()};if(pressed('b')||pressed('start')){back();return}
  const J=home.jobs,rest=()=>homeTotal()-J[0]-J[1]-J[2],jb=hi-2;
  if(jb>=0&&jb<3){if(pressed('right')){if(rest()>0){J[jb]++;snd(520,.04)}else{let o=-1;for(let i=0;i<3;i++)if(i!==jb&&J[i]>0&&(o<0||J[i]>J[o]))o=i;if(o>=0){J[o]--;J[jb]++;snd(520,.04)}else snd(140,.08)}}
   if(pressed('left')){if(J[jb]>0){J[jb]--;snd(520,.04)}else snd(140,.08)}}
  if(pressed('a')){const sq=inHome?parked:buds.filter(b=>b.st==='follow');
   if(hi===0){const c=sq.filter(b=>b.star);if(!c.length){flash='NO STAR SPROUTS WAITING OUTSIDE';flashT=2.5;snd(140,.1)}else moveIn(c)}
   else if(hi===1){const c=sq.filter(b=>!b.star).sort((a,b)=>a.stage-b.stage).slice(0,5);if(c.length<5){flash='BRING AT LEAST 5 SPROUTS WITH YOU';flashT=2.5;snd(140,.1)}else moveIn(c)}
   else if(hi===5){const c=UPCOST[home.up];if(c===undefined){flash='THIS IS THE BIGGEST HOUSE THERE IS';flashT=2.5;snd(140,.1)}else if(meta.petals<c){flash='NEED '+(c-meta.petals)+' MORE PETALS';flashT=2.5;snd(140,.1)}
    else{meta.petals-=c;home.up++;flash='BIGGER HOUSE! ROOM FOR '+homeCap()+' NOW';flashT=3.5;snd(523,.1);later(()=>snd(784,.1),110);later(()=>snd(1046,.25),220);checkAch();persist()}}
   else if(hi===6){if(inHome)exitHome();state='play';dayT=DAYLEN-.01}}return}
 case 'build':if(pressed('b')||pressed('start')){state='play';persist();return}if(pressed('a'))pjSend(bp);return;
 case 'travel':ti=nav(ti,tlist.length);if(pressed('b')||pressed('start'))state='play';else if(pressed('a')){hop={fx:P.x,fy:P.y,z:tlist[ti],t:0};state='hop';noise(.3,.1,700,'lowpass');snd(330,.5,990,'triangle',.05)}return;
 case 'settings':{const was=seti;seti=nav(seti,4);if(seti>=2&&was>=2&&(pressed('left')||pressed('right')))seti=seti===2?3:2;if(seti!==was)resetArm=0;const k=['mus','sfx'][seti];
  if(k&&(pressed('right')||pressed('left'))){const v=Math.max(0,Math.min(10,meta[k]+(pressed('right')?1:-1)));if(v!==meta[k]){meta[k]=v;save();if(k==='sfx')snd(660,.07,990);else snd(520,.04)}}
  if(seti===2&&pressed('a')){const n=pulledCount();if(!n){flash='NOTHING YET';flashT=2;snd(140,.1)}
   else if(!resetArm){resetArm=1;snd(330,.1)}
   else{resetArm=0;const m=resetPulls();flash='RESET! +'+m+' TIX';flashT=3;snd(784,.1);later(()=>snd(523,.2),100)}return}
  if(pressed('b')||pressed('start')||(seti===3&&pressed('a'))){resetArm=0;state=setFrom}return;}
 case 'dayend':if(pressed('a')||pressed('start'))newDay();return;
 case 'win':if(pressed('a')||pressed('start')){state='play';persist(true)}return;
 }
 if(pressed('start')){persist(true);state='pause';pi=0;return;}
 if(sceneQ.length){const q=sceneQ.shift();playScene(q[0],q[1]);return}
 dayT+=dt;saveT+=dt;if(saveT>6){saveT=0;persist()}
 if(!duskSaid&&dayT>DAYLEN*.82){duskSaid=true;say("SUN'S GOING DOWN. NO RUSH.",5);snd(440,.3,220,'triangle',.08)}
 if(dayT>=DAYLEN){endDay();return;}
 achT-=dt;if(achT<=0){achT=.5;checkAch()}
 objT-=dt;if(objT<=0){objT=.3;OBJ=objective();pjTick();tipTick();loreTick()}zoneTick(dt);ambSound(dt);
 // player
 const mx=keys.right-keys.left,my=keys.down-keys.up;P.mv=false;
 if(P.stun>0){P.stun-=dt;moveEnt(P,P.kx*dt,P.ky*dt,4,false);}
 else if(P.pluck>0){P.pluck-=dt;if(P.pluck<=0)finishPluck();}
 else if(mx||my){const l=Math.hypot(mx,my);P.dx=mx/l;P.dy=my/l;moveEnt(P,P.dx*64*dt,P.dy*64*dt,4,false);P.anim+=dt;P.mv=true;
  const tr=STY.trail[meta.eq.trail];P.tr-=dt;if(tr[1]&&P.tr<=0){P.tr=.11;parts.push({x:P.x+R(-3,3),y:P.y+2,vx:R(-6,6),vy:-R(4,14),life:R(.5,.9),c:tr[1],gh:tr[0]==='HEARTS'?2:tr[0]==='STARS'?3:tr[0]==='BUBBLES'?4:5})}}
 P.idle=P.mv?0:P.idle+dt;
 if(inHome){updRes(dt);if(P.y>RY+104&&my>0){TRN={t:0,fn:exitHome};return}}
 else if(run.spark){const d=d2(P,run.spark.x,run.spark.y);if(d<120*120){sniffT-=dt;if(sniffT<=0){sniffT=7;spSay('SNIFF SNIFF...')}}}
 const push=(x,y,rad)=>{const d=Math.sqrt(d2(P,x,y));if(d<rad&&d>0){P.x=x+(P.x-x)/d*rad;P.y=y+(P.y-y)/d*rad}};
 push(HX,HY-2,9);push(KEEP.x,KEEP.y-4,12);for(const n of npcs)push(n.x,n.y,8);if(run.boss)push(THORN.x,THORN.y-5,13);
 if(!trail.length||d2(P,trail[0].x,trail[0].y)>16){trail.unshift({x:P.x,y:P.y});if(trail.length>70)trail.pop();}
 if(gard.open&&gard.basket>0&&d2(P,46*16,7*16+8)<15*15){toast('GARDEN BASKET  +'+gard.basket);earn(gard.basket);gard.basket=0;snd(700,.08,1100)}
 // cursor with gentle snap
 let cx=P.x+P.dx*56,cy=P.y+P.dy*56,sb=26*26,sn=null;
 const tryS=(x,y,o)=>{const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);if(d<sb&&d2(P,x,y)<70*70){sb=d;sn={x,y,o}}};
 foes.forEach(e=>e.alive&&tryS(e.x,e.y,e));items.forEach(i=>i.alive&&tryS(i.x,i.y,i));gates.forEach(ga=>ga.alive&&ga.sub!==2&&tryS(ga.x,ga.y,ga));if(DIG.alive)tryS(DIG.x,DIG.y,DIG);bugs.forEach(q=>q.alive&&!q.hid&&tryS(q.x,q.y,q));
 if(gard.open)plots.forEach(p=>needs(p)&&!p.on.length&&tryS(p.x,p.y,p));
 const signNear=gard.open&&facing(SIGN,24);
 if(sn){cx=sn.x;cy=sn.y}cur.x=cx;cur.y=cy;
 petOK=LO.st==='follow'&&P.idle>.3&&!sn&&!signNear&&facing(LO,26);
 squad=buds.filter(b=>b.st==='follow');
 if(pressed('sel')){cycleSel();manT=4}
 // the right sprout steps up on its own, unless Select was pressed a moment ago
 if(manT>0)manT-=dt;needT=-1;{const o=sn&&sn.o;let pref=null;
  if(o){if(o.kind==='ga')pref=o.sub===3?[1,0,4,5,3,2]:[o.sub];else if(o.kind==='dig')pref=[1,0,4,5,3,2];else if(o.kind==='en')pref=[0,1,5,4,3,2];else if(o.kind==='bug')pref=BUGS[o.sp].water?[2]:[3,2,4,0,5,1];
   else if(o.kind==='plot')pref=o.st>0&&o.st<4?[2,4,0,1,3,5]:[4,2,0,3,5,1];else if(o.kind==='it')pref=o.isle||tileAt(o.x,o.y)===WA?[2]:o.w>=3?[1,0,5,3,4,2]:[5,3,0,4,2,1]}
  else if(tileAt(cx,cy)===WA)pref=[2];
  if(pref){const have=pref.find(t=>squad.some(b=>b.type===t));if(have===undefined){if(pref.length===1&&o)needT=pref[0]}else if(manT<=0||pref.length===1)sel=have}}
 if(keys.a){if(pressed('a')){doA(true);aT=.24;aN=0}else{aT-=dt;if(aT<=0){doA(false);aN++;aT=Math.max(.09,.2-aN*.02)}}}
 if(state!=='play')return;
 if(keys.b){wr=Math.min(48,(wr||8)+dt*110);call(cur.x,cur.y,wr);call(P.x,P.y,18);if(sndT<=0){snd(700+wr*9,.06);sndT=.08}}else wr=0;
 for(const s of sprouts)s.age+=dt;
 squad.forEach((b,i)=>b.si=i);
 for(const b of buds)updBud(b,dt);
 for(const e of foes)if(e.alive)updFoe(e,dt);
 for(const it of items)if(it.alive)updItem(it,dt);
 for(const ga of gates)if(ga.alive)updGate(ga,dt);
 for(const q of bugs)if(q.alive)updBug(q,dt);
 if(gard.open)for(const p of plots)updPlot(p,dt);
 updDig(dt);updSeeds(dt);updWbuds(dt);if(flickT>0)flickT-=dt;
 updLouie(dt);
 buds=buds.filter(b=>!b.dead);
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(!p.gh)p.vy+=60*dt;}
 parts=parts.filter(p=>p.life>0);
 if(inHome){cam.x=RX+88-W/2;cam.y=RY+42-H/2;return}
 const tx=P.x+P.dx*22-VW/2,ty=P.y+P.dy*16-VH/2,kk=Math.min(1,dt*5);cam.x+=(tx-cam.x)*kk;cam.y+=(ty-cam.y)*kk;
 cam.x=Math.max(0,Math.min(MW*16-VW,cam.x));cam.y=Math.max(0,Math.min(MH*16-VH,cam.y));
}
let seeds=[],aN=0,ambS=4;
/* the lantern spits each new seed out in an arc; it plants itself where it lands */
function updSeeds(dt){for(const q of seeds){q.t+=dt/.75;if(q.t>=1){q.done=true;mkSprout(q.type,q.tx,q.ty,0);puff(q.tx,q.ty,'#a87850',3,18);snd(1100+Math.random()*300,.04,700,'triangle',.04)}}if(seeds.length)seeds=seeds.filter(q=>!q.done)}
function sip(b,it){it.alive=false;const got=buds.filter(q=>!q.dead&&!q.gard&&q.stage<2&&(q===b||((q.st==='follow'||q.st==='idle')&&d2(q,it.x,it.y)<80*80))).sort((p,q)=>d2(p,it.x,it.y)-d2(q,it.x,it.y)).slice(0,12);
 got.forEach(q=>{q.stage=2;q.cheer=.9;puff(q.x,q.y-8,'#f8e060',3,22)});b.tgt=null;b.z=0;b.st=d2(b,P.x,P.y)<90*90?'follow':'idle';b.cheer=.9;puff(it.x,it.y-10,'#f8d040',12,45);
 snd(660,.08,990,'triangle',.07);later(()=>snd(880,.08,1320,'triangle',.07),90);later(()=>snd(1320,.2,1760,'triangle',.06),190);say(got.length?'NECTAR!  '+got.length+(got.length===1?' SPROUT':' SPROUTS')+' BLOOMED':'NECTAR!  BUT THE CREW HAD BLOOMED ALREADY',4)}
function tipTick(){if(state!=='play'||inHome)return;const T=run.tips=run.tips||{},br=gates[5];
 if(!T.br&&br&&br.alive&&d2(P,br.x,br.y)<64*64){T.br=1;say('THE CROOKED RIVER. THROW SPROUTS AT THE STAKES TO BUILD A BRIDGE',7)}
 else if(!T.ne&&items.some(i=>i.alive&&i.sub==='nectar'&&d2(P,i.x,i.y)<52*52)){T.ne=1;say('A NECTAR BLOSSOM! THROW A SPROUT AT IT AND THE CREW BLOOMS',7)}
 else if(!T.dg&&DIG.alive&&d2(P,DIG.x,DIG.y)<44*44){T.dg=1;say('SOMETHING IS BURIED HERE. THROW SPROUTS AT IT TO DIG',7)}}
function ambSound(dt){ambS-=dt;if(ambS>0||inHome)return;ambS=R(5,11);const f=dayT/DAYLEN;
 if(f<.6){const b=R(2300,3100);snd(b,.06,b*1.25,'sine',.012);later(()=>snd(b*1.1,.05,b*1.3,'sine',.01),110);if(Math.random()<.5)later(()=>snd(b*.95,.07,b*1.2,'sine',.01),240)}
 else if(f>.7)for(let k=0;k<3;k++)later(()=>snd(4300,.025,0,'square',.004),k*70)}
function moveIn(list){const room=homeCap()-homeTotal();if(room<=0){flash='THE HOUSE IS FULL. UPGRADE IT FIRST';flashT=3;snd(140,.1);return}list=list.slice(0,room);
 let pet=0;const a=homeLv();list.forEach(b=>{home.res[b.type]++;home.jobs[1]++;pet+=b.star?12:2;b.dead=true;release(b)});buds=buds.filter(b=>!b.dead);parked=parked.filter(b=>!b.dead);
 flash=list.length+' MOVED IN AS FLORISTS!   +'+pet+' PETALS';flashT=3.5;snd(660,.08,990);later(()=>snd(1175,.2),100);earn(pet);if(homeLv()>a)toast('HOME LEVEL '+homeLv()+'!  CREW ROOM +5');checkAch();persist();}
function cycleSel(){for(let n=1;n<=NT;n++){const t=(sel+n)%NT;if(squad.some(b=>b.type===t)){sel=t;snd(520,.05);return}}}
function call(x,y,rad){for(const b of buds){if(b.st==='follow'||b.st==='fly')continue;if(d2(b,x,y)<rad*rad){release(b);b.gard=false;b.st='follow';}}}
function doA(fresh){
 if(P.pluck>0||P.stun>0)return;
 let s=null,bd=17*17;for(const q of sprouts){const d=d2(q,P.x,P.y);if(d<bd&&q.age>.5){bd=d;s=q}}
 if(s){P.pluck=.2;P.pl=s;return;}
 if(fresh&&!P.mv){for(const n of npcs)if(facing(n,24)){talk(n);return}
  if(run.boss&&!inHome&&facing(THORN,28)){say(['THORNBACK: SO WARM. THANK YOU, KEEPER.',"THORNBACK: I'LL KEEP WATCH TONIGHT.",'THORNBACK: THE SMALL ONES TICKLE.'][(day+run.pets)%3],4);snd(110,.25,80,'sine',.3);return}
  if(!inHome&&facing(DOOR,24)){TRN={t:0,fn:enterHome};return}
  if(!inHome&&facing(KEEP,30)){if(!run.keep)playScene('keep',()=>{run.keep=1;zone='';persist(true)});else say(['...PROMISED TO SPROUTS AND BUDDIES. KEEP THE...','SUN KEEP. AN ORDER, OR A NAME?','THE STONE IS WARM, LIKE THE LANTERN'][(day+run.pets)%3],5);snd(220,.2,165,'sine',.2);return}
  if(inHome){if(facing(DESK,36)){state='house';hi=0;flashT=0;snd(440,.06,660)}return}
  {const p=PJ.find(p=>pjOpen(p)&&facing({x:p.sx,y:p.sy},22));if(p){bp=p;state='build';flashT=0;snd(440,.06,660);return}}
  {const z=ZONES.find(z=>facing(postXY(z),22));if(z){run.seen=run.seen||{};tlist=ZONES.filter(q=>run.seen[q[0]]&&q!==z);if(!tlist.length)say('NO OTHER PLACES FOUND YET. WALK THERE FIRST, THEN TRAVEL',5);else{state='travel';ti=0;snd(440,.06,660)}return}}
  if(gard.open&&facing(SIGN,24)){const n=seedsOpen();if(n<2)say('MORE SEEDS UNLOCK AS YOU HARVEST',4);else{gard.seed=(Math.min(gard.seed,n-1)+1)%n;const f=FLOWERS[gard.seed];say('NOW PLANTING '+f.pl+':  '+f.v+' PETALS EACH',4);snd(660,.06,880)}return}
  if(petOK){LO.st='sit';LO.t=1.3;hearts(LO.x,LO.y);run.pets++;meta.life.pets++;bump('pet');if((tod.petxp=(tod.petxp||0)+1)<=4)louXP(2);spSay(LOU_PET[(run.pets+day)%LOU_PET.length]);save();snd(880,.08,1320,'triangle',.07);if(run.pets===5)say('LOUIE DREAMS OF SQUIRRELS',3);return}}
 let c=squad.filter(b=>b.type===sel);
 if(!c.length){if(!squad.length){if(fresh)snd(140,.08);return}cycleSel();c=squad.filter(b=>b.type===sel);if(!c.length)return;}
 let b=c[0],d=1e9;for(const q of c){const e=d2(q,P.x,P.y);if(e<d){d=e;b=q}}
 b.st='fly';b.sx=P.x;b.sy=P.y-4;b.tx=cur.x;b.ty=cur.y;b.t=0;b.ret=false;snd(500,.12,900);bump('throw');
}
function finishPluck(){const s=P.pl;P.pl=null;const i=sprouts.indexOf(s);if(i<0)return;sprouts.splice(i,1);const st=stageOf(s);
 mkBud(s.type,st,s.x,s.y);puff(s.x,s.y,'#a87850',5,25);snd(600,.07,1200);run.plucked++;bump('pluck');if(st===2){run.bloom++;meta.life.blooms++}
 if(!found[s.type]){found[s.type]=true;const ty=s.type;card={t:0,title:'NEW SPROUT: '+TYPES[ty].n,sub:['Embers fight hardest and burn through bramble.','Pebs carry double, smash crystal, and never get spooked.','Dews swim. Throw them at water. They water flowers fast too.','Zips are the fastest runners and haulers.','Leafs are the best gardeners.','Luckies bring home bonus seeds and petals.'][ty],art:()=>{g.save();g.translate(117,92);g.scale(3,3);drawBud({x:0,y:0,type:ty,stage:2,z:Math.abs(Math.sin(time*4))*1.5,mv:false,fx:1,st:'follow',a:1});g.restore()}};state='card';snd(784,.08);later(()=>snd(1175,.2),90)}
 if(!squad.some(b=>b.type===sel))sel=s.type;
}
function avoid(b){for(const n of npcs){const dx=b.x-n.x,dy=b.y-n.y,d=Math.hypot(dx,dy);if(d<13){const k=d||1;moveEnt(b,d?dx/k*(13-d):2,dy/k*(13-d),1.5,b.type===2)}}}
function updBud(b,dt){
 const T=TYPES[b.type],sp=T.sp*(b.stage===2?1.25:1),swim=b.type===2;b.mv=false;if(b.cheer>0)b.cheer-=dt;
 if(b.st==='carry'||b.st==='fight'||b.st==='work'){b.xp+=dt;if(!b.star&&b.xp>=40){b.star=true;puff(b.x,b.y-8,'#f8e060',6,30);snd(1175,.08,1568);if(!run.starSaid){run.starSaid=1;say('A SPROUT EARNED A GOLD STAR! STARS CAN MOVE INTO YOUR HOUSE',7)}}}
 switch(b.st){
 case 'follow':{const i=b.si||0,p=trail[Math.min(trail.length-1,2+((i/3)|0)*2)]||P;
   const tx=p.x+((i%3)-1)*6,ty=p.y+(((i*7)%5)-2)*2,d=Math.hypot(tx-b.x,ty-b.y);go(b,tx,ty,Math.min(sp,80)*(d>40?1.5:1),dt,swim,3);
   avoid(b);if(d2(b,P.x,P.y)>190*190)b.st='idle';break;}
 case 'idle':if(d2(b,P.x,P.y)<100&&P.stun<=0)b.st='follow';else avoid(b);break;
 case 'tend':b.t-=dt;if(b.t<=0){b.t=R(.6,1.4);let best=null,bd=1e9;for(const p of plots)if(needs(p)&&!p.on.length&&p.claim<time){const d=d2(p,b.x,b.y);if(d<bd){bd=d;best=p}}
   if(best){best.claim=time+4;b.tgt=best;b.st='seek';b.t=0}}break;
 case 'fly':{b.t+=dt/.38;const t=Math.max(0,Math.min(1,b.t));b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t;b.z=Math.sin(Math.PI*t)*18;b.mv=true;
   if(t>=1){b.z=0;if(b.ret){b.st='follow';break}
    if(tileAt(b.x,b.y)===GT){const tg=findTarget(b,30);if(tg&&tg.kind==='ga'){b.tgt=tg;b.st='seek';b.t=0;break}}
    if(!free(b.x,b.y,swim)){if(tileAt(b.x,b.y)===WA)puff(b.x,b.y,'#a8d8ff',5,30);b.ret=true;b.sx=b.x;b.sy=b.y;b.tx=P.x;b.ty=P.y;b.t=0;b.st='fly';snd(240,.08,160);break;}
    const tg=findTarget(b,tileAt(b.x,b.y)===WA?64:44);
    if(tg){b.tgt=tg;b.st='seek';b.t=0;if(tg.kind==='plot'){b.gard=true;tg.claim=time+4}}else if(inGarden(b.x,b.y)){b.gard=true;b.st='tend';b.t=.5}else b.st='idle';}
   break;}
 case 'seek':{const t=b.tgt,out=()=>{b.tgt=null;b.st=b.gard?'tend':'idle';b.t=.5};if(!t||!t.alive||(t.kind==='plot'&&(!needs(t)||t.on.length))){out();break}
   const p=tpos(b),reach=t.kind==='en'?t.r+3:t.kind==='ga'?15:t.r+5,d=go(b,p.x,p.y,sp,dt,swim,reach-1);b.t+=dt;
   if(d<=reach){if(t.kind==='bug'){catchBug(b,t);break}
     if(t.kind==='it'&&t.sub==='nectar'){sip(b,t);break}
     if(t.kind==='it'&&str(t)>=t.w*2){out();break}
     t.on.push(b);b.a=R(0,6.28);b.st=t.kind==='en'?'fight':t.kind==='it'?'carry':'work';snd(380,.04);}
   else if(b.t>5)out();break;}
 case 'work':b.mv=true;b.z=Math.abs(Math.sin(time*14+b.a))*2;break;
 case 'stun':b.t-=dt;if(b.t<=0){b.z=0;if(b.tgt&&b.tgt.alive){b.st='seek';b.t=0}else{b.tgt=null;b.st='idle'}}break;
 }
}
function updPlot(p,dt){
 if(p.st>=1&&p.st<=3&&!p.dry){p.t-=dt;if(p.t<=0){p.st++;p.dry=p.st<4}}
 if(!p.on.length)return;
 if(!needs(p)){p.on.slice().forEach(b=>{b.tgt=null;b.z=0;b.st='tend';b.t=.4});p.on.length=0;return}
 p.prog+=dt*p.on.reduce((a,b)=>a+(b.type===4?3:b.type===2?2.5:1),0);
 if(p.prog>=1.5){p.prog=0;
  if(p.st===0){p.st=1;p.dry=true;p.flower=Math.min(gard.seed,seedsOpen()-1);puff(p.x,p.y,'#a87850',4,25);snd(300,.06)}
  else if(p.st===4){const F=FLOWERS[p.flower],so=seedsOpen(),n=plots.length;p.st=0;p.dry=true;gard.harv++;gard.basket=Math.min(150,gard.basket+F.v);meta.life.flowers++;tod.flowers++;bump('flower');if(p.flower===3)unlock1(27);puff(p.x,p.y-8,FCOL[p.flower][0],8,40);snd(880,.07,1320);
   syncBeds();if(plots.length>n)say('THE GARDEN GREW! '+plots.length+' BEDS NOW',4);else if(seedsOpen()>so)say('NEW SEEDS: '+FLOWERS[so].pl+'! PICK THEM AT THE SEED SIGN',6);
   const o=gard.order;if(o&&o.k===p.flower&&++o.have>=o.need){gard.orders++;meta.life.orders=(meta.life.orders||0)+1;toast("ERIN'S ORDER DONE!  +"+o.rw);earn(o.rw);if(gard.orders%3===0){meta.tix++;toast('3 ORDERS FILLED!  +1 TICKET')}if(meta.life.orders>=5)unlock1(26);newOrder()}}
  else{p.dry=false;p.t=FLOWERS[p.flower].g;puff(p.x,p.y-4,'#a8d8ff',5,25);snd(1000,.05,700)}
  p.on.slice().forEach(b=>{b.tgt=null;b.z=0;b.st='tend';b.t=R(.3,.9)});p.on.length=0;}
}
function catchBug(b,q){q.alive=false;b.tgt=null;b.st=d2(b,P.x,P.y)<90*90?'follow':'idle';const first=!meta.bugs[q.sp];meta.bugs[q.sp]++;meta.life.bugs++;run.bugs++;tod.bugs++;bump('bug');earn(first?10:pjDone(PJ[4])?6:2);
 puff(q.x,q.y,'#fff8a0',6,30);snd(900,.06,1400);later(()=>snd(1400,.1),70);say((first?'NEW BUG: ':'CAUGHT A ')+BUGS[q.sp].n+'!',3);}
function updBug(q,dt){const s=BUGS[q.sp];if(s.dusk&&dayT/DAYLEN<.6){q.hid=true;return}q.hid=false;
 let th=null,td=48*48;for(const b of buds)if(b.tgt===q){const d=d2(b,q.x,q.y);if(d<td){td=d;th=b}}
 let vx=0,vy=0;
 if(th){const d=Math.sqrt(td)||1;vx=(q.x-th.x)/d*s.v;vy=(q.y-th.y)/d*s.v;}
 else{q.t-=dt;if(q.t<=0){q.t=R(1,3);q.wx=q.hx+R(-s.rng,s.rng);q.wy=q.hy+R(-s.rng,s.rng)}const dx=q.wx-q.x,dy=q.wy-q.y,d=Math.hypot(dx,dy),v=Math.max(4,s.v*.3);if(d>2){vx=dx/d*v;vy=dy/d*v}}
 if(vx)q.fx=vx>0?1:-1;
 if(s.fly){const lim=s.rng+(th&&!s.water?26:0);q.x=Math.max(q.hx-lim,Math.min(q.hx+lim,q.x+vx*dt));q.y=Math.max(q.hy-lim,Math.min(q.hy+lim,q.y+vy*dt));}
 else moveEnt(q,vx*dt,vy*dt,2,false);}
function updLouie(dt){const l=LO,lv=louLv();if(l.say)l.say.t-=dt;l.mv=false;l.cd-=dt;l.bark-=dt;l.alert-=dt;
 l.riders=(l.riders||[]).filter(b=>!b.dead&&b.st==='ride');l.riders.forEach((b,i)=>{b.x=l.x+((i%3)-1)*4;b.y=l.y+1;b.z=9+((i/3)|0)*5;b.fx=l.fx});
 const walk=sp=>{const p=l.path&&l.path[0];if(!p)return true;const dx=p.x-l.x,dy=p.y-l.y,d=Math.hypot(dx,dy),m=sp*dt;if(d<=m+1){l.x=p.x;l.y=p.y;l.path.shift()}else{l.x+=dx/d*m;l.y+=dy/d*m}l.mv=true;if(Math.abs(dx)>1)l.fx=dx>0?1:-1;return !l.path.length};
 if(l.st==='fetch'){const b=l.tg;if(!b||b.dead||b.st!=='idle'){l.st=l.riders.length?'bring':'follow';l.rt=0;l.sx=l.x;l.sy=l.y;return}
  if(walk(118+lv*8)||d2(l,b.x,b.y)<14*14){const got=[b];if(lv>=3)for(const q of buds)if(q!==b&&q.st==='idle'&&!q.gard&&got.length<8&&d2(q,b.x,b.y)<70*70&&(lv>=4||tileAt(q.x,q.y)!==WA))got.push(q);
   got.forEach(q=>{q.st='ride';q.tgt=null;l.riders.push(q)});bark();louXP(3*got.length);l.st='bring';l.rt=0;l.path=null}return}
 if(l.st==='bring'){if(!l.riders.length){l.st='follow';l.sx=l.x;l.sy=l.y;return}l.rt-=dt;if(l.rt<=0||!l.path||!l.path.length){l.rt=.8;l.path=pathTo(l.x,l.y,P.x,P.y,true)||[{x:P.x,y:P.y}]}
  walk(118+lv*8);if(d2(l,P.x,P.y)<30*30){l.riders.forEach((b,i)=>{b.st='follow';b.z=0;b.x=l.x+((i%3)-1)*5;b.y=l.y+4});const n=l.riders.length;l.riders=[];l.st='follow';l.sx=l.x;l.sy=l.y;bark();spSay(n>1?'FOUND '+n+'!':'FOUND ONE!')}return}
 if(d2(l,P.x,P.y)>230*230){l.x=P.x+(free(P.x+20,P.y,false)?20:free(P.x-20,P.y,false)?-20:0);l.y=P.y+(l.x===P.x?10:2);l.sx=l.x;l.sy=l.y;l.st='follow'}
 if(l.st==='sit'){l.t-=dt;if(l.t<=0)l.st='follow';return}
 if(l.st==='dig'){if(l.t>0){const d=go(l,l.tx,l.ty,95,dt,false,3);l.tt+=dt;if(d<5||l.tt>3){l.t=0;l.dt=1.4}}
  else{l.dt-=dt;l.mv=true;if(Math.random()<dt*10)puff(l.x,l.y,'#a87850',1,30);if(l.dt<=0){mkItem(lv>=2&&Math.random()<.25?'big':'berry',l.x,l.y+2);spSay('BERRY!');bark();louXP(2);
   if(lv>=6&&!tod.tix&&Math.random()<.3){tod.tix=1;meta.tix++;toast('LOUIE FOUND A CAPSULE TICKET!');save()}l.st='follow';l.dig=R(40,60)*(lv>=2?.55:1)}}return}
 // keep to Will's side, clear of the crew trailing behind him; hold still when Will does
 if(P.mv&&!facing(l,30)){const px=-P.dy,py=P.dx;let sx=P.x-P.dx*4+px*24,sy=P.y-P.dy*4+py*24;if(!free(sx,sy,false)){sx=P.x-P.dx*4-px*24;sy=P.y-P.dy*4-py*24}if(!free(sx,sy,false)){sx=P.x+P.dx*20;sy=P.y+P.dy*20}if(free(sx,sy,false)){l.sx=sx;l.sy=sy}}
 const d=Math.hypot(l.sx-l.x,l.sy-l.y);if(d>4)go(l,l.sx,l.sy,d>50?118:84,dt,false,3);avoid(l);
 if(l.bark<=0)for(const e of foes)if(e.alive&&d2(e,P.x,P.y)<82*82){l.bark=8;l.alert=1.3;bark();louXP(1);spSay('GRR! GRUB!',1.8);if(lv>=5&&!e.boss){e.scare=2.5;e.st='wander'}break}
 if(l.cd<=0){l.cd=.7;let best=null,bd=1e12;for(const b of buds)if(b.st==='idle'&&!b.gard&&b.nh<time&&d2(b,P.x,P.y)>30*30){if(tileAt(b.x,b.y)===WA&&lv<4)continue;const q=d2(b,l.x,l.y);if(q<bd){bd=q;best=b}}
  if(best){const p=pathTo(l.x,l.y,best.x,best.y,lv>=4);if(p){l.st='fetch';l.tg=best;l.path=p;return}best.nh=time+25}}
 l.dig-=dt;if(l.dig<=0){const a=R(0,6.28),rr=R(30,48),x=P.x+Math.cos(a)*rr,y=P.y+Math.sin(a)*rr,t=tileAt(x,y);
  if((t===G||t===D)&&!inGarden(x,y)&&items.filter(i=>i.alive&&i.sub==='berry').length<18){l.st='dig';l.tx=x;l.ty=y;l.t=1;l.tt=0}else l.dig=2}}
function fling(e,b,stun){const a=R(0,6.28),dd=e.r+R(8,16),nx=e.x+Math.cos(a)*dd,ny=e.y+Math.sin(a)*dd;if(free(nx,ny,b.type===2)){b.x=nx;b.y=ny}b.st='stun';b.t=stun;b.z=0;}
function updFoe(e,dt){
 e.cd-=dt;e.cdP-=dt;
 let dmg=0;e.on.forEach(b=>{dmg+=(b.type===0?2:1)*(b.stage===2?1.4:1);b.x=e.x+Math.cos(b.a)*(e.r-1);b.y=e.y+Math.sin(b.a)*(e.r-1)*.7;b.z=3+Math.abs(Math.sin(time*18+b.a))*3;b.mv=true;});
 if(dmg){e.hp-=dmg*dt;if(sndT<=0){snd(200+Math.random()*80,.03);sndT=.1}}
 if(e.hp<=0){e.alive=false;puff(e.x,e.y,e.boss?'#f07878':'#b890f0',14,50);snd(180,.4,50,'sawtooth',.07);run.foes++;meta.life.grubs++;bump('grub');
  const it=mkItem(e.boss?'shard':'husk',e.x,e.y);if(e.boss){it.w=8;it.x-=22;run.boss=true;sceneQ.push(['thorn',null])}
  e.on.slice().forEach(b=>{b.z=0;b.tgt=it;b.st='seek';b.t=0});e.on.length=0;return;}
 if(e.on.length){e.shake+=dt;if(e.shake>(e.boss?4:5.5)){e.shake=0;e.on.slice().forEach(b=>fling(e,b,.7));e.on.length=0;snd(120,.15,60,'sawtooth')}}else e.shake=0;
 if(e.scare>0){e.scare-=dt;return}
 if(e.st==='wind'){e.t-=dt;if(e.t<=0){let n=1;const rr=(e.r+8)*(e.r+8);
   for(const b of buds){if(!n)break;if(b.dead||b.st==='fly'||b.st==='fight')continue;if(d2(b,e.x,e.y)<rr){n--;if(b.type===1){release(b);fling(e,b,1);puff(b.x,b.y,'#dce2ea',4,30);snd(900,.05)}else spook(b)}}
   e.st='wander';e.cd=2.6}return;}
 let tg=null,bd=52*52;const far=d2(e,e.hx,e.hy)>100*100;
 if(!far){for(const b of buds){if(b.dead||b.st==='fly'||b.st==='fight'||b.gard)continue;const d=d2(b,e.x,e.y);if(d<bd){bd=d;tg=b}}
  if(!tg&&d2(P,e.x,e.y)<bd)tg=P;}
 if(tg){const d=Math.sqrt(d2(tg,e.x,e.y));if(d>e.r+2){const m=(e.boss?18:22)*dt;moveEnt(e,(tg.x-e.x)/d*m,(tg.y-e.y)/d*m,e.boss?8:5,false);e.face=tg.x>e.x?1:-1}
  if(tg===P){if(d<e.r+5&&e.cdP<=0){e.cdP=1.5;P.stun=.25;P.kx=(P.x-e.x)/(d||1)*110;P.ky=(P.y-e.y)/(d||1)*110;snd(150,.12,80)}}
  else if(d<e.r+6&&e.cd<=0){e.st='wind';e.t=.8;snd(260,.1,400)}}
 else{e.wt-=dt;if(e.wt<=0){e.wt=R(2,4);e.wx=e.hx+R(-30,30);e.wy=e.hy+R(-30,30)}
  const d=Math.hypot(e.wx-e.x,e.wy-e.y);if(d>3){const m=(far?30:11)*dt;moveEnt(e,(e.wx-e.x)/d*m,(e.wy-e.y)/d*m,e.boss?8:5,false);e.face=e.wx>e.x?1:-1}}
}
function updItem(it,dt){
 const n=it.on.length;if(!n)return;const s=str(it);let moving=false;
 if(s>=it.w){const f=it.on.every(b=>b.type===2)?fieldW:fieldL,tx=it.x>>4,ty=it.y>>4,d=f[ty*MW+tx];
  if(d>=0){let gx=HX,gy=HY+4;
   if(d>1){for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=tx+ax,ny=ty+ay;if(nx>=0&&ny>=0&&nx<MW&&ny<MH&&f[ny*MW+nx]===d-1){gx=nx*16+8;gy=ny*16+8;break}}}
   const zf=it.on.filter(b=>b.type===3).length/n,dx=gx-it.x,dy=gy-it.y,dd=Math.hypot(dx,dy),sp=(22+18*Math.min(1,(s-it.w)/it.w))*(1+.7*zf);
   if(dd>.5){const m=Math.min(dd,sp*dt);it.x+=dx/dd*m;it.y+=dy/dd*m;moving=true}
   if(d<=1&&d2(it,HX,HY+4)<64){deliver(it);return}}}
 it.on.forEach((b,i)=>{const a=i/n*6.283+time*(moving?2:0);b.x=it.x+Math.cos(a)*(it.r+2);b.y=it.y+Math.sin(a)*(it.r+2)*.6+2;b.mv=moving;b.fx=Math.cos(a)>0?-1:1;});
}
function deliver(it){
 it.alive=false;const cnt=Array(NT).fill(0),lucky=it.on.some(b=>b.type===5);it.on.forEach(b=>cnt[b.type]++);const type=cnt.indexOf(Math.max(...cnt));
 const near=d2(P,HX,HY)<90*90;
 it.on.slice().forEach((b,i)=>{b.tgt=null;b.z=0;b.st=near?'follow':'idle';b.cheer=.8+i*.07;const a=i*1.3;b.x=HX+Math.cos(a)*16;b.y=HY+10+Math.sin(a)*6;});it.on.length=0;
 puff(HX,HY-22,'#f8e060',12,45);
 if(it.sub==='shard'){shards++;if(it.isle)run.isle=true;earn(10);snd(523,.12);later(()=>snd(659,.12),120);later(()=>snd(784,.12),240);later(()=>snd(1046,.3),360);
  sceneQ.push(shards>=4?['end',()=>{won=true;state='win'}]:['s'+shards,null]);checkAch();persist(true);return;}
 if(it.sub==='trs'){const i=it.tri|0;if(!meta.trs.includes(i))meta.trs.push(i);card={t:0,title:TRS[i][0],sub:TRL[i],art:()=>{g.save();g.translate(120,72);g.scale(4,4);trArt(i,0,0);g.restore()}};
  state='card';earn(20);spSay('GOOD FIND!',3);snd(784,.1);later(()=>snd(1175,.12),100);later(()=>snd(1568,.25),200);checkAch();persist(true);return}
 if(it.sub!=='husk'){run.delivered++;meta.life.berries++;tod.berries++;bump('berry');earn(lucky?3:1)}
 if(it.sub==='pear'){earn(10);toast('GOLDEN PEAR!  +10')}
 let made=0;for(let i=0;i<it.seeds+(lucky?1:0);i++){if(crewCount()>=capNow())break;const [x,y]=soilSpot();seeds.push({type,tx:x,ty:y,t:-made*.16});made++;}
 snd(700,.08,1000);later(()=>snd(900,.1,1300),90);
 if(!made)say('NO ROOM FOR MORE SPROUTS. SEND SOME HOME TO YOUR HOUSE',4);
}
function updGate(ga,dt){const n=ga.on.length;if(!n)return;ga.hp-=n*dt;if(sndT<=0){snd(ga.sub===3?300+Math.random()*120:ga.sub?1200:160,.03);sndT=.12}
 ga.on.forEach(b=>{b.fx=ga.x>b.x?1:-1});
 if(ga.hp<=0){openGate(ga,true);snd(300,.3,900,'triangle',.08);say(ga.sub===3?'THE BRIDGE IS BUILT! WILLOW FALLS IS OPEN':ga.sub?'THE CRYSTAL SHATTERS!':'THE BRAMBLE BURNS AWAY!',4);persist(true);}}
function endDay(){buds.forEach(b=>{if(!b.gard){b.tgt=null;b.z=0}});[...foes,...items,...gates,...bugs,DIG].forEach(o=>o.on.length=0);
 const bonus=5+Math.min(15,tod.berries)+Math.min(15,tod.flowers*2);tod.bonus=bonus;earn(bonus);state='dayend';snd(330,.5,110,'triangle',.08);}
function newDay(){mkWbuds();inHome=false;parked=[];day++;dayT=0;duskSaid=false;wr=0;tod={berries:0,flowers:0,bugs:0,spooked:0};P.x=HX;P.y=HY+22;P.dx=0;P.dy=1;P.stun=0;P.pluck=0;trail=[];parts=[];
 LO.x=LO.sx=P.x-22;LO.y=LO.sy=P.y+4;LO.st='follow';
 let k=0;buds.forEach(b=>{if(b.gard)return;b.st='follow';b.x=P.x+((k%7)-3)*6;b.y=P.y+8+((k/7)|0)*5;k++});
 for(const p of plots)if(p.st>=1&&p.st<=3&&!p.dry){p.st++;p.dry=p.st<4;p.t=0}
 if(day>=5)wakeGrubs();respawn();{const J=home.jobs;let made=0;const ty=TYPES.map((q,t)=>t).filter(t=>home.res[t]>0);for(let i=0;i<J[0];i++){if(crewCount()>=capNow())break;const [x,y]=soilSpot();mkSprout(ty[(Math.random()*ty.length)|0]||0,x,y,0);made++}
  if(J[2])louXP(J[2]*2);if(made||J[1]){toast('HOME:'+(made?'  +'+made+' SPROUTS':'')+(J[1]?'  +'+J[1]*2+' PETALS':''));if(J[1])earn(J[1]*2)}}
 if(!buds.length&&!sprouts.length){for(let i=0;i<3;i++){const [x,y]=soilSpot();mkSprout(0,x,y,8)}}
 newSpark();pjMorning();say('DAY '+day+'. GOOD MORNING, WILL!',4);
 cam.x=P.x-VW/2;cam.y=P.y-VH/2;state='play';snd(440,.1,880);persist(true);}

/* ---------- the prequel pass: this valley before it was called Sunkeep ----------
   Wild buddies live here but keep to themselves (they are not a system: nothing targets them). At night they come and
   sit at the edge of the lantern light. Sprite art is Sproutwild's (same scope), scaled down. */
const WBDEF=[['CINDERCAP',22,16],['PEBBLIT',32,6],['DRIZZLET',16,13],['ZIPWIG',50,22],['FERNFANG',22,33],['CLOVERIMP',65,24],['LANTERNWISP',65,8]];
let wbuds=[],flickT=0;
function mkWbuds(){wbuds=WBDEF.map(([id,tx,ty],i)=>({id,hx:tx*16+8,hy:ty*16+8,x:tx*16+8,y:ty*16+8,wx:tx*16+8,wy:ty*16+8,t:R(0,3),fx:1,mv:false,a:i*1.7,path:null,night:false}))}
function wbSprite(q){if(q.spr===undefined){q.spr=null;try{const s=wSp(q.id),c=s&&s._spr&&(s._spr.ol||s._spr.img);if(c&&c.width){q.spr=c;q.sprF=flip(c)}}catch(e){}}return q.spr}
function updWbuds(dt){const f=dayT/DAYLEN;
 for(const q of wbuds){q.mv=false;const wisp=q.id==='LANTERNWISP';if(wisp&&f<.6){q.hid=true;continue}q.hid=false;
  if(f>.74&&!q.night){q.night=true;const a=q.a*2.3,tx=HX+Math.cos(a)*50,ty=HY+8+Math.abs(Math.sin(a))*34;q.path=free(tx,ty,false)&&!wisp?pathTo(q.x,q.y,tx,ty,false):null}
  if(q.path&&q.path.length){const p=q.path[0],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy),m=46*dt;if(d<=m+1){q.x=p.x;q.y=p.y;q.path.shift()}else{q.x+=dx/d*m;q.y+=dy/d*m}q.mv=true;if(Math.abs(dx)>1)q.fx=dx>0?1:-1;continue}
  if(q.night&&q.path){q.fx=HX>q.x?1:-1;continue} /* sitting at the light */
  let ax=0,ay=0;const near=o=>{const d=d2(o,q.x,q.y);if(d<36*36&&d>0){const k=Math.sqrt(d);ax+=(q.x-o.x)/k;ay+=(q.y-o.y)/k}};near(P);for(const b of buds)if(b.st!=='ride'&&b.st!=='park')near(b);
  if(ax||ay){const k=Math.hypot(ax,ay)||1;moveEnt(q,ax/k*58*dt,ay/k*58*dt,4,false);q.mv=true;q.fx=ax>0?1:-1;q.t=1.5;q.wx=q.x;q.wy=q.y;continue}
  q.t-=dt;if(q.t<=0){q.t=R(2,5);q.wx=q.hx+R(-26,26);q.wy=q.hy+R(-20,20)}
  const dx=q.wx-q.x,dy=q.wy-q.y,d=Math.hypot(dx,dy);if(d>3){moveEnt(q,dx/d*14*dt,dy/d*14*dt,4,false);q.mv=true;q.fx=dx>0?1:-1}}}
function drawWbud(q){const c=wbSprite(q),x=Math.round(q.x-ox),y=Math.round(q.y-oy),hop=q.mv?((time*8+q.a)|0)%2:0;r('rgba(0,0,0,.26)',x-6,y+1,12,3);
 if(c){g.imageSmoothingEnabled=true;g.drawImage(q.fx>0?q.sprF:c,x-10,y-17-hop,20,20);g.imageSmoothingEnabled=false}else{r('#383048',x-5,y-9-hop,10,10);r('#98a0b0',x-4,y-8-hop,8,8)}
 if(q.id==='LANTERNWISP'){g.fillStyle='rgba(248,232,150,'+(.16+.08*Math.sin(time*4)).toFixed(2)+')';g.beginPath();g.arc(x,y-8,12,0,7);g.fill()}}
/* the old stone arch behind the willows */
const KEEP={x:66*16+8,y:2*16+12};
function drawKeep(){const x=Math.round(KEEP.x-ox),y=Math.round(KEEP.y-oy),k='#383048';r('rgba(0,0,0,.25)',x-13,y+1,26,3);
 r(k,x-13,y-22,26,24);r('#8088a0',x-12,y-21,24,22);r('#a0a8bc',x-12,y-21,24,2);r(k,x-7,y-14,14,16);r('#2c2840',x-6,y-13,12,15);
 [[-12,-12],[6,-9],[-11,-3],[8,-17]].forEach(([a,b])=>r('#6c7488',x+a,y+b,5,1));r('#48a850',x-12,y-21,7,2);r('#48a850',x+7,y-6,5,2);r('#58c048',x-10,y-19,3,1);
 r('#f8d040',x-1,y-20,3,3);r('#f8d040',x-3,y-19,7,1);r('#f8d040',x,y-22,1,7);r(run.keep?'#f8e060':'#585070',x-1,y-9,3,5);r(run.keep?'#fff8a0':'#6c6488',x,y-8,1,2);
 if(!run.keep&&state==='play'&&((time*3)|0)%3)text('!',x-2,y-38,3,'#f8e060')}
const zName=z=>z==='LANTERN FIELD'&&run&&run.keep?'SUNKEEP':z;
/* each treasure is a small memory of the valley from before anyone can remember */
const TRL=['Far too big for any oak here. What tree dropped this?','No bird in the valley is this blue. Not any more.','Stamped with a little sun. It fits no door we have.','Hold it close: it hums like a lake too wide to see across.',
 'Look close. A tiny valley inside, with a tiny light.','A crowned face, worn smooth. Nobody here knows any king.','A paw print pressed in stone. Older than the lantern?','Big and red. It says DO NOT PRESS. Louie pressed it. Nothing. Yet.',
 'Ring it, and every sprout turns to face the lantern.','Cold at noon, warm at night. It glows when the lantern dims.',"Marcus says it's his. It is far too small. He insists, bro.",'Flat and shiny, with gold lines. It fell out of the sky.'];
function loreTick(){if(state!=='play'||inHome)return;const T=run.tips=run.tips||{};
 if(!T.wb&&wbuds.some(q=>!q.hid&&d2(P,q.x,q.y)<64*64)){T.wb=1;say('A WILD BUDDY. THEY KEEP TO THEMSELVES OUT HERE',6)}
 else if(!T.wn&&dayT/DAYLEN>.8&&d2(P,HX,HY)<90*90&&wbuds.some(q=>q.night&&q.path&&!q.path.length)){T.wn=1;say('THE BUDDIES COME AND SIT BY THE LIGHT AT NIGHT. NOBODY KNOWS WHY',7)}
 if(!tod.flick&&dayT>DAYLEN*.88&&day>=2&&d2(P,HX,HY)<140*140){tod.flick=1;flickT=.45;snd(90,.3,60,'sawtooth',.05);spSay('GRR?',2);if(!T.fl){T.fl=1;say('THE LANTERN SKIPPED, LIKE A PICTURE JUMPING. THEN IT WAS FINE',7)}}}

/* ---------- the painted valley ----------
   The ground, shores, flowers and trees are painted once into two frames (BG, swapped twice a second so water,
   flowers and the falls move) plus OVR, a layer drawn over everyone: the treetops you walk behind.
   Repainted when the map changes (a gate opens, a bed is dug, the bridge is built). */
const hsh=(x,y,k)=>{let n=Math.imul((x|0)+k*131,374761393)^Math.imul((y|0)+k*17,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
const TDEF=['#1c5038','#2c7848','#3c9858','#60c070'];
const THEME=[ /* same order as ZONES */
 {g:'#58b858',gd:'#3c9848',gl:'#84d870',tr:TDEF,fl:['#ffffff','#f8d040','#f8a0c8'],pr:[['flower',.10],['clover',.06]]},
 {g:'#54b452',gd:'#389044',gl:'#84d46c',tr:TDEF,fl:['#f85888','#ffffff','#f8d040'],pr:[['flower',.08],['clover',.12],['tall',.04]]},
 {g:'#74c460',gd:'#4ca048',gl:'#a8e080',tr:['#1c5038','#2c7848','#44a060','#78cc80'],fl:['#ffffff','#f8e060','#a070e8','#60b8f8'],pr:[['flower',.20],['tall',.16],['rock',.04]]},
 {g:'#62c062',gd:'#48a850',gl:'#90e078',tr:TDEF,fl:['#f8a0c8','#ffffff'],lawn:1,pr:[['flower',.05]]},
 {g:'#4cb070',gd:'#308858',gl:'#78d090',tr:['#184840','#247058','#349068','#58b888'],fl:['#60b8f8','#ffffff'],reed:1,pr:[['flower',.07],['tall',.10],['rock',.03]]},
 {g:'#3c8858',gd:'#286848',gl:'#58a870',tr:['#122c28','#1c4838','#285c44','#3c7858'],fl:['#a070e8','#60d8e8'],pr:[['shroom',.10],['fern',.10],['glow',.05],['rock',.04],['flower',.03]]},
 {g:'#7cc450',gd:'#58a040',gl:'#b0e070',tr:['#285020','#3c7c30','#58a040','#90d060'],fl:['#f8a0c8','#ffffff','#f8d040'],fruit:1,pr:[['petal',.22],['flower',.10],['clover',.05]]},
 {g:'#e8d498',gd:'#d0b878',gl:'#f8e8b8',tr:TDEF,fl:['#ffffff'],sand:1,pr:[['pebble',.14],['shell',.07],['star',.03]]},
 {g:'#50b880',gd:'#349868',gl:'#80d8a0',tr:['#184838','#28705c','#38907c','#68c0a0'],fl:['#60b8f8','#ffffff','#f8e060'],reed:1,willow:1,pr:[['flower',.16],['tall',.10],['glow',.03],['rock',.03]]}];
let BG=null,OVR=null,bakeDirty=true,GLOW=[],ZC=null;
const BR=new Set(); /* bridge tiles: water underneath, planks on top once it is built */
function zoneAt(tx,ty){if(!ZC){ZC=new Uint8Array(MW*MH);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){let best=0,bd=1e9;for(let i=0;i<ZONES.length;i++){const z=ZONES[i],d=Math.max(z[1]-x,0,x-(z[1]+z[3]-1),z[2]-y,y-(z[2]+z[4]-1));if(d<bd){bd=d;best=i}}ZC[y*MW+x]=best}}
 return ZC[Math.max(0,Math.min(MH-1,ty))*MW+Math.max(0,Math.min(MW-1,tx))];}
function bridgeArt(p,X,Y,n,done){
 for(let i=0;i<n;i++){const y=Y+28-i*4;p('#583018',X+2,y,28,4);p(i%2?'#c89050':'#b88040',X+3,y,26,3);p('#e8b878',X+4+((i*5)%14),y,5,1)}
 if(done){p('#583018',X+1,Y,2,32);p('#583018',X+29,Y,2,32);p('#a87040',X+1,Y,1,32);p('#a87040',X+29,Y,1,32)}
 [[1,0],[28,0],[1,29],[28,29]].forEach(([a,b])=>{p('#3c2414',X+a,Y+b-4,3,7);p('#c89050',X+a+1,Y+b-4,1,5)});}
function bake(){
 const Wp=MW*16,Hp=MH*16,mkc=()=>{const c=document.createElement('canvas');c.width=Wp;c.height=Hp;return c};
 if(!BG){BG=[mkc(),mkc()];OVR=mkc()}
 const c0=BG[0].getContext('2d'),c1=BG[1].getContext('2d'),co=OVR.getContext('2d');co.clearRect(0,0,Wp,Hp);GLOW=[];
 let cx=c0;const an=[],s=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(x,y,w,h)},a=(c,x,y,w,h,f)=>an.push([c,x,y,w,h,f]);
 const T=(tx,ty)=>(tx<0||ty<0||tx>=MW||ty>=MH)?TR:map[ty*MW+tx],tree=(tx,ty)=>{const t=T(tx,ty);return t===TR||t===7},
  wat=(tx,ty)=>T(tx,ty)===WA||BR.has(ty*MW+tx),th=(tx,ty)=>THEME[zoneAt(tx,ty)]||THEME[0],
  kind=(tx,ty)=>tree(tx,ty)?'t':wat(tx,ty)?'w':T(tx,ty)===D?'d':T(tx,ty)===S?'s':'g';
 const disc=(x,y,rad,c,ymax)=>{for(let dy=-rad;dy<=rad;dy++){if(ymax!==undefined&&y+dy>ymax)break;const w=Math.round(Math.sqrt(rad*rad-dy*dy));s(c,x-w,y+dy,2*w+1,1)}};
 const at=(X,Y,tx,ty,k,mx=9,my=9)=>[X+2+((hsh(tx,ty,k)*mx)|0),Y+3+((hsh(tx,ty,k+1)*my)|0)];
 const PROP={
  flower(X,Y,tx,ty,t){const n=1+((hsh(tx,ty,51)*3)|0);for(let i=0;i<n;i++){const x=X+2+((hsh(tx,ty,52+i)*12)|0),y=Y+3+((hsh(tx,ty,56+i)*10)|0),c=t.fl[(hsh(tx,ty,60+i)*t.fl.length)|0];s(t.gd,x,y+1,1,2);
    for(const f of[0,1]){const yy=y-(f&&i%2===0?1:0);a(c,x-1,yy,3,1,f);a(c,x,yy-1,1,3,f);a(c==='#f8d040'||c==='#f8e060'?'#f08030':'#f8d040',x,yy,1,1,f)}}},
  tall(X,Y,tx,ty,t){for(let i=0;i<4;i++){const x=X+1+i*4+((hsh(tx,ty,70+i)*2)|0),y=Y+8+((hsh(tx,ty,74+i)*7)|0);s(t.gd,x,y-4,1,5);s(t.gl,x+1,y-2,1,3);for(const f of[0,1])a(t.gd,x+(f?1:0),y-5,1,1,f)}},
  rock(X,Y,tx,ty){const [x,y]=at(X,Y,tx,ty,80,6,6);s('rgba(0,0,0,.2)',x,y+4,7,1);s('#585c70',x,y,7,4);s('#585c70',x+1,y-1,5,1);s('#98a0b0',x+1,y,5,3);s('#dce2ea',x+1,y,2,1)},
  clover(X,Y,tx,ty,t){const [x,y]=at(X,Y,tx,ty,82);s(t.gd,x,y+1,5,2);s(t.gd,x+1,y,3,4);s(t.gl,x+1,y+1,1,1);s(t.gl,x+3,y+2,1,1)},
  shroom(X,Y,tx,ty){const [x,y]=at(X,Y,tx,ty,84);s('#f8f0d8',x+1,y+2,2,2);s('#801c1c',x-1,y+1,6,1);s('#c83838',x,y,4,2);s('#ffffff',x+1,y,1,1);s('#ffffff',x+3,y+1,1,1)},
  glow(X,Y,tx,ty){const [x,y]=at(X,Y,tx,ty,86);s('#d0f8ff',x+1,y+2,1,2);s('#2890a8',x-1,y+1,5,1);s('#60d8e8',x,y,3,2);s('#d0f8ff',x,y,1,1);GLOW.push({x:x+1,y:y+1})},
  fern(X,Y,tx,ty,t){const [x,y]=at(X,Y,tx,ty,88,6,6);for(let i=0;i<4;i++){s('#1c5c40',x+3-i,y+i,1,2);s('#1c5c40',x+4+i,y+i,1,2);s(t.gl,x+3-i,y+i,1,1)}s('#1c5c40',x+3,y,2,6)},
  petal(X,Y,tx,ty){for(let i=0;i<5;i++)s(i%2?'#f8a0c8':'#ffd0e4',X+((hsh(tx,ty,90+i)*15)|0),Y+((hsh(tx,ty,95+i)*15)|0),1,1)},
  pebble(X,Y,tx,ty){for(let i=0;i<2;i++){const [x,y]=at(X,Y,tx,ty,100+i*2,11,11);s('#8088a0',x,y,3,2);s('#c0c8d8',x,y,2,1)}},
  shell(X,Y,tx,ty){const [x,y]=at(X,Y,tx,ty,104);s('#d890a8',x,y+1,4,2);s('#f8c8d8',x,y,4,2);s('#ffffff',x+1,y,1,1);s('#d890a8',x+2,y,1,2)},
  star(X,Y,tx,ty){const [x,y]=at(X,Y,tx,ty,106);s('#c85830',x+1,y,1,5);s('#c85830',x-1,y+2,5,1);s('#f08860',x+1,y+1,1,3);s('#f08860',x,y+2,3,1)}};
 /* ground */
 for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const X=tx*16,Y=ty*16,k=kind(tx,ty),t=th(tx,ty);
  if(k==='t'){s(t.tr[0],X,Y,16,16);continue}
  if(k==='w'){let deep=true;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)if(!wat(tx+i,ty+j))deep=false;const base=deep?(t.sand?'#2c74cc':'#3080d8'):'#3c8ce0';
   s(base,X,Y,16,16);
   [[1,3],[9,7],[4,12]].forEach(([p,q],i)=>{const o=(hsh(tx,ty,i)*9)|0;for(const f of[0,1]){const x=X+(p+o+f*4)%12;a('#78b8f8',x,Y+q,4,1,f);a('#a8d8ff',x+1,Y+q,1,1,f)}});
   const n=!wat(tx,ty-1),so=!wat(tx,ty+1),w=!wat(tx-1,ty),e=!wat(tx+1,ty),nt=tree(tx,ty-1);
   if(w&&tree(tx-1,ty))s('rgba(8,28,48,.28)',X,Y,3,16);if(e&&tree(tx+1,ty))s('rgba(8,28,48,.28)',X+13,Y,3,16);if(so&&tree(tx,ty+1))s('rgba(8,28,48,.2)',X,Y+13,16,3);
   if(n){if(nt)s('#245c98',X,Y,16,4);else{s('#2868b8',X,Y,16,3);s(th(tx,ty-1).sand?'#f8e8b8':'#e8d8a0',X,Y,16,1)}for(let i=0;i<4;i++)for(const f of[0,1])a('#c8e8ff',X+i*4+f*2,Y+(nt?4:3),2,1,f)}
   if(so&&!tree(tx,ty+1))for(let i=0;i<4;i++)for(const f of[0,1])a('#a8d8ff',X+i*4+f*2,Y+15,2,1,f);
   if(w&&!tree(tx-1,ty))for(let i=0;i<4;i++)for(const f of[0,1])a('#a8d8ff',X,Y+i*4+f*2,1,2,f);
   if(e&&!tree(tx+1,ty))for(let i=0;i<4;i++)for(const f of[0,1])a('#a8d8ff',X+15,Y+i*4+f*2,1,2,f);
   if(t.sand&&!n)for(let i=0;i<2;i++)for(const f of[0,1])a('#c8e8ff',X+((hsh(tx,ty,110+i)*9)|0)+f*3,Y+3+i*8,5,1,f);
   if(deep&&t.reed&&!BR.has(ty*MW+tx)&&hsh(tx,ty,31)<.3){const px=X+3+((hsh(tx,ty,32)*7)|0),py=Y+5+((hsh(tx,ty,33)*6)|0);s('#286838',px,py,6,4);s('#48a850',px,py,5,3);s(base,px+2,py+1,2,1);if(hsh(tx,ty,34)<.45){s('#f8a0c8',px+3,py-1,2,2);s('#ffffff',px+3,py-1,1,1)}}
   if(n&&!nt&&t.reed&&!BR.has(ty*MW+tx)&&hsh(tx,ty,35)<.55)for(let i=0;i<3;i++){const rx=X+2+i*4+((hsh(tx,ty,36+i)*3)|0),hh=5+((hsh(tx,ty,40+i)*4)|0);s('#286028',rx,Y+6-hh,1,hh+2);for(const f of[0,1])a('#805030',rx+(f&&i%2?1:0),Y+4-hh,1,3,f)}
   continue}
  if(k==='d'){const wet=t.sand;s(wet?'#d4bc84':'#d8b878',X,Y,16,16);[[2,2],[10,4],[6,9],[13,12],[3,13]].forEach(([p,q],i)=>s(wet?'#bca468':'#b89858',X+(p+((hsh(tx,ty,i)*3)|0))%14,Y+q,2,1));[[7,2],[12,8],[2,7]].forEach(([p,q])=>s('#f0d8a0',X+p,Y+q,1,1));
   const fr=(nx,ny,fn)=>{if(kind(nx,ny)!=='g')return;const t2=th(nx,ny);for(let i=0;i<16;i++){const h1=hsh(tx*16+i,ty*16+(nx-tx)*3+(ny-ty)*5,7);fn(i,h1<.45?1:h1<.85?2:3,t2.g,t2.sand?t2.gd:t2.gd,h1)}};
   fr(tx,ty-1,(i,dp,c,c2,h1)=>{s(c,X+i,Y,1,dp);if(h1>.7)s(c2,X+i,Y+dp-1,1,1)});
   fr(tx,ty+1,(i,dp,c,c2,h1)=>{s(c,X+i,Y+16-dp,1,dp);if(h1>.7)s(c2,X+i,Y+16-dp,1,1)});
   fr(tx-1,ty,(i,dp,c,c2,h1)=>{s(c,X,Y+i,dp,1);if(h1>.7)s(c2,X+dp-1,Y+i,1,1)});
   fr(tx+1,ty,(i,dp,c,c2,h1)=>{s(c,X+16-dp,Y+i,dp,1);if(h1>.7)s(c2,X+16-dp,Y+i,1,1)});
   continue}
  if(k==='s'){s('#8a5a3a',X,Y,16,16);[3,8,13].forEach((y,i)=>{s('#6e4428',X+i*2,Y+y,9,1);s('#6e4428',X+i*2+11,Y+y,4,1)});[[5,1],[12,6],[3,11]].forEach(([p,q])=>s('#a87850',X+p,Y+q,1,1));
   if(kind(tx,ty-1)!=='s')s('#5a3820',X,Y,16,1);if(kind(tx,ty+1)!=='s')s('#5a3820',X,Y+15,16,1);if(kind(tx-1,ty)!=='s')s('#5a3820',X,Y,1,16);if(kind(tx+1,ty)!=='s')s('#5a3820',X+15,Y,1,16);continue}
  s(t.g,X,Y,16,16);if(t.lawn&&(tx+ty)%2)s('rgba(255,255,255,.07)',X,Y,16,16);
  if(t.sand){for(let i=0;i<5;i++)s(t.gd,X+((hsh(tx,ty,i)*15)|0),Y+((hsh(tx,ty,i+5)*15)|0),1,1);for(let i=0;i<3;i++)s(t.gl,X+((hsh(tx,ty,i+10)*14)|0),Y+((hsh(tx,ty,i+13)*15)|0),2,1)}
  else{for(let i=0;i<4;i++){const p=(hsh(tx,ty,i)*14)|0,q=1+((hsh(tx,ty,i+4)*14)|0);s(t.gd,X+p,Y+q,2,1);s(t.gd,X+p,Y+q-1,1,1)}for(let i=0;i<3;i++)s(t.gl,X+((hsh(tx,ty,i+8)*15)|0),Y+((hsh(tx,ty,i+11)*15)|0),1,1)}
  if(T(tx,ty)!==G||(tx===HTX&&ty===HTY))continue;
  let rr=hsh(tx,ty,50),pk=null;for(const [n,pp] of t.pr){if(rr<pp){pk=n;break}rr-=pp}
  if(pk)PROP[pk](X,Y,tx,ty,t);}
 /* trees: one round crown per tile, painted top row first so each row overlaps the one behind it */
 const blob=(x,y,rad,C,tx,ty,t,ymax)=>{disc(x,y,rad,C[0],ymax);disc(x,y-1,rad-1,C[1],ymax);disc(x-2,y-3,rad-4,C[2],ymax);
  const q=(c,px,py,w,h)=>{if(ymax===undefined||py+h-1<=ymax)s(c,px,py,w,h)};
  q(C[3],x-4,y-6,3,1);q(C[3],x-5,y-5,2,1);q(C[3],x-2,y-7,2,1);q(C[0],x+3,y+2,2,1);q(C[0],x-1,y+4,2,1);q(C[2],x+4,y-3,2,1);q(C[2],x+2,y+5,2,1);
  if(t.fruit&&hsh(tx,ty,22)<.6){q('#a01828',x-4,y,3,3);q('#e04050',x-4,y,2,2);q('#a01828',x+3,y-3,3,3);q('#e04050',x+3,y-3,2,2);if(hsh(tx,ty,23)<.5){q('#f8a0c8',x,y-5,2,1);q('#ffd0e4',x+1,y+3,1,1)}}
  if(t.willow)for(let i=0;i<4;i++){const wx=x-6+i*4,wl=4+((hsh(tx,ty,24+i)*4)|0);q(C[3],wx,y-1,1,wl);q(C[2],wx+1,y,1,wl-1)}};
 for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++)if(tree(tx,ty)){const X=tx*16,Y=ty*16,t=th(tx,ty),C=t.tr,front=ty+1<MH&&!tree(tx,ty+1),north=ty>0&&!tree(tx,ty-1);
  const px=X+8+((hsh(tx,ty,20)*3)|0)-1;let cy=Y+7+((hsh(tx,ty,21)*3)|0)-1,rad=9;
  if(front){const kS=kind(tx,ty+1);s(kS==='w'?'#3070b8':kS==='d'?'#b89858':kS==='s'?'#6e4428':th(tx,ty+1).gd,X,Y+11,16,5);s('rgba(10,30,20,.3)',X,Y+11,16,5);s('#3c2414',px-2,Y+9,4,7);s('#6a4428',px-1,Y+9,2,7);cy=Y+3;rad=8}
  else if(north)cy=Y+6;
  blob(px,cy,rad,C,tx,ty,t);
  if(north){cx=co;blob(px,cy,rad,C,tx,ty,t,Y+1);cx=c0}
  if(front&&kind(tx,ty+1)!=='w'){s('rgba(10,30,20,.26)',X+1,Y+16,14,3);s('rgba(10,30,20,.26)',X+3,Y+19,10,1)}}
 /* the falls: a rock face above the pool at the top of Willow Falls */
 {const X=55*16,W2=80,C=THEME[8].tr;s('#484058',X,0,W2,32);for(let i=0;i<7;i++){s('#5c5470',X+((i*29)%66),4+i*4,10+(i*7)%12,2);s('#383048',X+((i*37+11)%70),6+i*4,6,1)}s(C[1],X,0,W2,3);s(C[3],X+4,2,6,1);s(C[3],X+54,2,9,1);
  const fx=X+14,fw=44;s('#5898e8',fx,2,fw,31);s('#88c0f8',fx+2,2,fw-4,31);
  for(let i=0;i<8;i++)for(const f of[0,1]){const lx=fx+3+i*5+(i%2),ly=3+((i*11+f*6)%14);a('#e0f8ff',lx,ly,1,7,f);a('#e0f8ff',lx+2,ly+13,1,6,f);a('#ffffff',lx+1,3+(ly+19)%27,1,2,f)}
  for(let i=0;i<10;i++)for(const f of[0,1]){a('#ffffff',fx-3+i*5+f*2,31+((i+f)%2),4,3,f);a('#e0f8ff',fx-1+i*5-f*2,35,3,1,f)}}
 {const br=gates&&gates.find(q=>q.sub===3);if(br&&!br.alive)bridgeArt(s,60*16,11*16,8,true)}
 c1.drawImage(BG[0],0,0);for(const [c,x,y,w,h,f] of an){const k=f?c1:c0;k.fillStyle=c;k.fillRect(x,y,w,h)}}
/* things that drift on the air: pollen by day, petals in the orchard, spores in the hollow, fireflies at night */
let AMB=[],ambAt=0,NFLY=[];
function drawAmb(){const dt=Math.min(.1,Math.max(0,time-ambAt));ambAt=time;const vh=Math.ceil(H/Z);
 if(!AMB.length)for(let i=0;i<16;i++)AMB.push({x:R(0,VW),y:R(0,vh),a:R(0,6.28),s:R(.6,1.4),cx:cam.x,cy:cam.y});
 const night=dayT/DAYLEN>.66,k=night?'fly':({'SUNNY ORCHARD':'petal',"THORNBACK'S HOLLOW":'spore','WILLOW FALLS':'mist','PEBBLE BEACH':'spray','NORTH MEADOW':'fluff'})[zone]||'pollen';NFLY=[];
 for(let i=0;i<AMB.length;i++){const m=AMB[i];m.x-=cam.x-m.cx;m.y-=cam.y-m.cy;m.cx=cam.x;m.cy=cam.y;const w=Math.sin(time*1.3+m.a);
  if(k==='petal'){m.x+=(7+w*6)*dt;m.y+=10*m.s*dt}else if(k==='spore'||k==='mist'){m.x+=w*4*dt;m.y-=6*m.s*dt}else if(k==='fly'){m.x+=Math.cos(time*.7+m.a)*7*dt;m.y+=Math.sin(time*.9+m.a*2)*6*dt}else if(k==='spray'){m.x-=7*m.s*dt;m.y+=w*3*dt}else{m.x+=(k==='fluff'?10:5)*m.s*dt;m.y+=(w*4-2)*dt}
  m.x=((m.x%VW)+VW)%VW;m.y=((m.y%vh)+vh)%vh;const x=Math.round(m.x),y=Math.round(m.y);
  if(k==='fly'){if(i%2)continue;const on=Math.sin(time*2.2+m.a*3)>-.2;if(on){r('rgba(248,255,128,.28)',x-1,y-1,3,3);r('#f8ff80',x,y,1,1);NFLY.push(m)}}
  else if(k==='petal')r(i%2?'#f8a0c8':'#ffd0e4',x,y,(time*2+i|0)%2?2:1,(time*2+i|0)%2?1:2);
  else if(k==='spore'){if(i%2)r('rgba(144,240,208,.8)',x,y,1,1)}
  else if(k==='mist'){if(i%2)r('rgba(255,255,255,.45)',x,y,2,2)}
  else if(k==='spray'){if(i%3===0)r('rgba(255,255,255,.6)',x,y,2,1)}
  else if(k==='fluff'){if(i%2){r('rgba(255,255,255,.85)',x,y-1,1,3);r('rgba(255,255,255,.85)',x-1,y,3,1)}}
  else if(i%2)r('rgba(255,248,192,.75)',x,y,1,1)}}
function drawClouds(){if(dayT/DAYLEN>.8)return;g.fillStyle='rgba(10,40,50,.07)';const vh=Math.ceil(H/Z);
 for(let k=0;k<4;k++){const x=((time*5+k*430)%(MW*16+400))-200-ox,y=90+k*150+Math.sin(k*2.3)*40-oy;if(x<-150||x>VW+110||y<-60||y>vh+60)continue;g.beginPath();g.ellipse(x,y,90,34,0,0,7);g.ellipse(x+50,y+14,60,26,0,0,7);g.fill()}}
/* night: real dark, with pools of light round the lantern, the windows, the trail lamps and the fireflies */
let LT=null;
function drawNight(){const f=dayT/DAYLEN;if(f<.12){r('rgba(255,190,140,'+((1-f/.12)*.10).toFixed(3)+')',0,0,W,H);return}if(f<=.6)return;const a=Math.min(1,(f-.6)/.4);
 r('rgba(240,120,40,'+(a*.12).toFixed(3)+')',0,0,W,H);
 if(!LT){LT=document.createElement('canvas');LT.width=W;LT.height=304}const c=LT.getContext('2d');c.globalCompositeOperation='source-over';c.clearRect(0,0,W,304);c.fillStyle='rgba(14,12,58,'+(a*a*.62).toFixed(3)+')';c.fillRect(0,0,W,H);c.globalCompositeOperation='destination-out';
 const L=(wx,wy,rad,k=1)=>{const x=(wx-ox)*Z,y=(wy-oy)*Z,rr=rad*Z;if(x<-rr||y<-rr||x>W+rr||y>H+rr)return;const gr=c.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(0,0,0,'+k+')');gr.addColorStop(.5,'rgba(0,0,0,'+(k*.6).toFixed(2)+')');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(x-rr,y-rr,rr*2,rr*2)};
 L(HX,HY-22,(36+shards*13+Math.sin(time*9))*(flickT>0?.35:1),.95);L(32*16+11,14*16+32,15,.8);L(32*16+38,14*16+32,15,.8);L(P.x,P.y-4,24,.45);
 for(const z of ZONES)if(!run.seen||run.seen[z[0]]||z[0]==='LANTERN FIELD'){const p=postXY(z);L(p.x+5,p.y-8,17,.8)}
 for(const q of GLOW)L(q.x,q.y,9,.7);for(const q of bugs)if(q.alive&&!q.hid&&q.sp===4)L(q.x,q.y-7,11,.8);
 for(const m of NFLY)L(m.x+ox,m.y+oy,7,.6);for(const q of wbuds)if(!q.hid&&q.id==='LANTERNWISP')L(q.x,q.y-8,16,.8);
 for(const it of items)if(it.alive&&(it.sub==='shard'||it.sub==='nectar'||it.sub==='trs'))L(it.x,it.y-6,13,.7);
 if(run.spark)L(run.spark.x,run.spark.y-6,12,.7);
 if(pjDone(PJ[2]))L(520,534,34,.8);if(pjDone(PJ[4]))L(1072,400,24,.8);if(pjS(PJ[1]).s>=3)L(656,96,22,.8);if(pjDone(PJ[0]))L(164,206,30,.7);
 g.imageSmoothingEnabled=true;g.drawImage(LT,0,0,W,H,0,0,W,H);g.imageSmoothingEnabled=false;
 if(flickT>0)for(let k=0;k<4;k++){const y=((time*90+k*61)|0)%(H-12),h=4+k*2,dx=(k%2?1:-1)*(3+k*2);try{g.drawImage(cv,0,y*2,480,h*2,dx,y,240,h)}catch(e){}}
 const x=(HX-ox)*Z,y=(HY-22-oy)*Z,rr=(30+shards*10)*Z;if(x>-rr&&y>-rr&&x<W+rr&&y<H+rr){const gr=g.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(255,214,120,'+(a*.30).toFixed(3)+')');gr.addColorStop(1,'rgba(255,214,120,0)');g.fillStyle=gr;g.fillRect(x-rr,y-rr,rr*2,rr*2)}}

/* ---------- draw ---------- */
let ox=0,oy=0;
function stemTop(sx,sy,st){if(st===0){r('#70d850',sx,sy-1,3,1);r('#70d850',sx+1,sy-2,2,1)}else if(st===1){r('#f8e060',sx-1,sy-2,3,2);r('#f8f0a0',sx,sy-3,1,1)}
 else{const c=RB?RAINBOW[Math.abs(flSeed)%6]:FL[0];r(c,sx-1,sy-3,3,3);r(FL[1],sx,sy-4,1,1);r(FL[1],sx-2,sy-2,1,1);r(FL[1],sx+2,sy-2,1,1);r('#f8d040',sx,sy-2,1,1)}}
function hatArt(i,x,y){const k='#383048';
 if(i===1){r(k,x-2,y-1,11,2);r('#e8c868',x-1,y-1,9,1);r(k,x+1,y-4,5,3);r('#e8c868',x+2,y-3,3,2);r('#c04848',x+2,y-2,3,1)}
 else if(i===2){r(k,x,y-6,7,7);r('#ffffff',x+1,y-5,5,5);r('#d8d8e8',x+1,y-1,5,1)}
 else if(i===3){r('#58c048',x,y-1,7,2);r('#f8a0c8',x,y-2,2,2);r('#f8e060',x+3,y-2,2,2);r('#ffffff',x+5,y-2,2,2)}
 else if(i===4){r(k,x+2,y-7,3,8);r('#60b8f8',x+3,y-6,1,2);r('#f85888',x+2,y-4,3,2);r('#60b8f8',x+1,y-2,5,2);r('#f8e060',x+3,y-8,1,2)}
 else if(i===6){r('#181020',x,y+2,3,3);r('#181020',x+4,y+2,3,3);r('#181020',x+2,y+2,3,1);r('#ffffff',x+1,y+2,1,1);r('#ffffff',x+5,y+2,1,1)}
 else if(i===7){r(k,x+1,y-5,6,5);r('#f8d030',x+2,y-4,4,3);r('#181020',x+3,y-4,1,3);r('#ffffff',x+1,y-7,2,2);r('#ffffff',x+5,y-7,2,2)}
 else if(i===8){r(k,x-1,y-4,3,4);r('#f8f0d8',x,y-3,1,3);r(k,x+5,y-4,3,4);r('#f8f0d8',x+6,y-3,1,3)}
 else if(i===9){r(k,x,y-4,7,4);r('#c04848',x+1,y-3,5,2);r(k,x+4,y-1,5,2);r('#a03030',x+5,y-1,3,1)}
 else if(i===10){r(k,x+1,y-5,1,5);r(k,x+5,y-5,1,5);r('#58c048',x,y-6,2,2);r('#58c048',x+5,y-6,2,2)}
 else if(i===5){r(k,x,y-5,7,6);r('#f8d030',x+1,y-3,5,3);r('#f8d030',x+1,y-4,1,1);r('#f8d030',x+3,y-4,1,1);r('#f8d030',x+5,y-4,1,1);r('#e83040',x+3,y-2,1,1)}}
function drawBud(b){const T=TYPES[b.type],gx=Math.round(b.x-ox)-3,gy=Math.round(b.y-oy);
 r('rgba(0,0,0,.28)',gx+1,gy,5,2);
 const hop=b.mv?((time*10+b.a*3)|0)%2:0,x=gx,y=gy-7-Math.round(b.z)-hop-(b.cheer>0?Math.round(Math.abs(Math.sin(b.cheer*11))*4):0);
 flSeed=(b.a*9)|0;r('#2c6030',x+3,y-2,1,2);stemTop(x+3,y-2,b.stage);
 if(b.star){r('#b07808',x+5,y-7,3,3);r('#f8e060',x+6,y-8,1,5);r('#f8e060',x+4,y-6,5,1);if(((time*4+b.a)|0)%2)r('#ffffff',x+6,y-6,1,1)}
 if(b.type===1){r(T.d,x,y,7,7)}else if(b.type===2){r(T.d,x+2,y-1,3,1);r(T.d,x+1,y,5,7);r(T.d,x,y+2,7,4)}else{r(T.d,x+1,y,5,7);r(T.d,x,y+1,7,5)}
 r(T.c,x+1,y+1,5,5);r(T.l,x+1,y+1,2,1);
 if(b.type===3){r(T.d,x+1,y+5,5,1);const w=((time*14+b.a)|0)%2;r('#ffffff',x-1,y+1+w,1,2);r('#ffffff',x+7,y+1+w,1,2)}
 if(b.type===4){r(T.d,x-2,y+1,2,3);r(T.c,x-1,y+2,1,1);r(T.d,x+7,y+1,2,3);r(T.c,x+7,y+2,1,1)}
 if(b.type===5){r('#ffffff',x+3,y+1,1,1);r('#ffffff',x+5,y+5,1,1);r('#ffffff',x+1,y+5,1,1)}
 if(b.st==='stun'){r('#181020',x+1,y+3,2,1);r('#181020',x+4,y+3,2,1)}else{const ex=b.fx>0?1:0;r('#181020',x+1+ex,y+3,1,2);r('#181020',x+4+ex,y+3,1,2)}
 if(b.st==='idle'&&((time*2+b.x)|0)%2)r('#ffffff',x+6,y-5,1,1);
 if(b.hat)hatArt(b.hat,x,y);
}
function drawSprout(s){const x=Math.round(s.x-ox),y=Math.round(s.y-oy),T=TYPES[s.type],st=stageOf(s);
 r('#5a3820',x-3,y,7,2);r(T.d,x-2,y-2,5,2);r(T.c,x-1,y-2,3,1);r('#2c6030',x,y-5,1,3);flSeed=s.x|0;stemTop(x,y-5,st);
 if(s.age<.5)r('#ffffff',x-1,y-8,3,1);}
const FCOL=[['#ffffff','#f8d040'],['#f85888','#f8a0c8'],['#f8c020','#805018'],['#a8c8ff','#ffffff']];
function flowerHead(k,x,y){const c=FCOL[k];
 if(k===0){r(c[0],x-2,y-3,5,3);r(c[0],x-1,y-4,3,5);r(c[1],x,y-2,1,1)}
 else if(k===1){r(c[0],x-2,y-4,5,4);r(c[0],x-2,y-5,1,1);r(c[0],x,y-5,1,1);r(c[0],x+2,y-5,1,1);r(c[1],x-1,y-4,1,3)}
 else if(k===2){r(c[0],x-3,y-5,7,5);r(c[0],x-2,y-6,5,7);r(c[1],x-1,y-4,3,3)}
 else{r('rgba(168,200,255,.35)',x-4,y-7,9,9);r(c[0],x,y-6,1,7);r(c[0],x-1,y-5,3,5);r(c[0],x-2,y-4,5,3);r(c[1],x,y-3,1,1)}}
function drawSign(){const x=SIGN.x-ox,y=SIGN.y-oy;r('rgba(0,0,0,.25)',x-5,y+1,10,2);r('#583018',x-1,y-6,2,8);r('#583018',x-7,y-16,14,11);r('#c89050',x-6,y-15,12,9);flowerHead(Math.min(gard.seed,seedsOpen()-1),x,y-8);}
let noGard=false;
function drawBed(p){const x=Math.round(p.x-ox),y=Math.round(p.y-oy)+2,h=(p.flower===2?[0,3,7,10,12]:[0,3,6,8,9])[p.st],c=FCOL[p.flower];
 if(p.st===0){r('#6e4428',x-4,y-2,8,3);r('#a87850',x-2,y-3,4,1);if(!p.on.length&&noGard){const by=y-13+Math.round(Math.sin(time*5+p.x)*2);r('#181020',x-3,by-1,7,7);r('#f8e060',x-2,by,5,5);r('#281c30',x,by+1,1,3);r('#281c30',x-1,by+2,3,1)}}
 else{r('#2c8030',x,y-h,1,h);if(p.st>=2){r('#58c048',x-2,y-3,2,1);r('#58c048',x+1,y-4,2,1)}
  if(p.st===3)r(c[0],x-1,y-h-2,3,2);
  if(p.st===4){flowerHead(p.flower,x,y-h);if(((time*3+p.x)|0)%3===0)r('#ffffff',x+3,y-h-6,1,1)}
  else if(p.dry&&((time*2)|0)%2){r('#181020',x+3,y-h-8,5,6);r('#60b8f8',x+4,y-h-6,3,3);r('#60b8f8',x+5,y-h-7,1,1);r('#e0f8ff',x+4,y-h-5,1,1)}}
 if(p.on.length){r('#181020',x-6,y+3,12,3);r('#a8f080',x-5,y+4,Math.round(10*Math.min(1,p.prog/1.5)),1)}}
function drawBasket(){const x=46*16-ox,y=7*16+12-oy;r('rgba(0,0,0,.25)',x-6,y+1,12,2);r('#583018',x-6,y-5,12,7);r('#b07840',x-5,y-4,10,5);r('#805030',x-5,y-2,10,1);r('#583018',x-5,y-10,1,5);r('#583018',x+4,y-10,1,5);r('#583018',x-5,y-11,10,1);
 if(gard.basket>0){r('#f8a0c8',x-4,y-7,3,3);r('#f8d040',x-1,y-8,3,3);r('#a070e8',x+2,y-7,3,3);const s='+'+gard.basket;if(state==='play'||state==='talk')text(s,x-tw(s,2)/2,y-24,2,'#f8c8e0')}}
function drawBerry(x,y,s,c,cd,cl){x=Math.round(x);y=Math.round(y);r('rgba(0,0,0,.25)',x-2*s,y,4*s,2);const t=y-6*s;
 r(cd,x-2*s,t,4*s,6*s);r(cd,x-3*s,t+s,6*s,4*s);r(c,x-2*s,t+s,4*s,4*s);r(cl,x-2*s,t+s,s,s);r('#48a040',x-s,t-s,2*s,s);r('#48a040',x,t-2*s,s,s);}
function drawItem(it){const x=it.x-ox,y=it.y-oy-(it.on.length&&str(it)>=it.w?2+Math.round(Math.sin(time*8)):0);
 if(it.sub==='berry')drawBerry(x,y+3,1,'#e83860','#901838','#f8a8b8');
 else if(it.sub==='big')drawBerry(x,y+5,2,'#f0a020','#985808','#f8e088');
 else if(it.sub==='husk'){drawBerry(x,y+4,1,'#9070b8','#483060','#c0a8e0');r('#181020',Math.round(x)-2,Math.round(y)-1,1,1);r('#181020',Math.round(x)+1,Math.round(y)-1,1,1)}
 else if(it.sub==='nectar'){const X=Math.round(x),Y=Math.round(y)+4,b=Math.round(Math.sin(time*3+it.x));r('rgba(0,0,0,.25)',X-4,Y,8,2);g.fillStyle='rgba(248,224,96,'+(.16+.08*Math.sin(time*4)).toFixed(2)+')';g.beginPath();g.arc(X+.5,Y-12,10,0,7);g.fill();
  r('#2c8030',X,Y-9,1,9);r('#58c048',X-3,Y-4,3,1);r('#58c048',X+1,Y-6,3,1);r('#b05818',X-4,Y-17+b,9,8);r('#f8a040',X-3,Y-16+b,7,6);r('#f8d040',X-3,Y-16+b,3,2);r('#b05818',X-2,Y-10+b,1,2);r('#b05818',X+2,Y-10+b,1,2);
  const d=(time*1.2+it.x)%1;r('#fff8a0',X,Y-9+b+Math.round(d*4),1,2);r('#ffffff',X-2,Y-15+b,1,1)}
 else if(it.sub==='pear'){const X=Math.round(x),Y=Math.round(y)+7,ws=[4,6,6,8,10,12,12,12,10,8];r('rgba(0,0,0,.25)',X-6,Y,12,3);ws.forEach((w,i)=>r('#906008',X-w/2-1,Y-10+i,w+2,1));ws.forEach((w,i)=>{r('#f8c828',X-w/2,Y-10+i,w,1);r('#fff088',X-w/2,Y-10+i,Math.max(1,(w/3)|0),1)});
  r('#583018',X,Y-13,1,3);r('#58c048',X+1,Y-13,3,2);if(((time*3)|0)%2)r('#ffffff',X+5,Y-12,1,1)}
 else if(it.sub==='trs'){const X=Math.round(x),Y=Math.round(y)+2;r('rgba(0,0,0,.25)',X-4,Y+3,8,2);trArt(it.tri|0,X,Y-3);if(((time*3)|0)%2){r('#ffffff',X+5,Y-10,1,3);r('#ffffff',X+4,Y-9,3,1)}}
 else{const X=Math.round(x),Y=Math.round(y)+5;r('rgba(0,0,0,.25)',X-4,Y,8,2);const ws=[2,4,6,8,8,6,6,4,4,2,2];
  ws.forEach((w,i)=>r('#906008',X-w/2-1,Y-12+i,w+2,1));ws.forEach((w,i)=>{r('#f8d030',X-w/2,Y-12+i,w,1);r('#fff8a0',X-w/2,Y-12+i,Math.max(1,w/2-1),1)});
  if(((time*3)|0)%2){r('#ffffff',X+4,Y-13,1,3);r('#ffffff',X+3,Y-12,3,1)}}
 const s=str(it);if((it.on.length||it.w>1)&&(state==='play'||state==='talk')){const t=s+'/'+it.w;text(t,Math.round(x)-tw(t,2)/2,Math.round(y)-(it.sub==='berry'?19:it.sub==='big'?24:it.sub==='pear'?27:23),2,s>=it.w?'#a8f080':'#ffffff');}}
function drawFoe(e){const x=Math.round(e.x-ox),y=Math.round(e.y-oy),sh=e.st==='wind'?Math.round(Math.sin(time*60)):0;
 if(e.boss){r('rgba(0,0,0,.28)',x-13,y+3,26,4);g.drawImage(e.face>0?BO.r:BO.l,x-16+sh,y-17,32,22)}
 else{r('rgba(0,0,0,.28)',x-6,y+2,12,3);g.drawImage(e.face>0?GR.r:GR.l,x-8+sh,y-8+(((time*4+e.hx)|0)%2))}
 if(e.st==='wind')text('!',x-2,y-(e.boss?34:24),3,'#f84848');else if(e.boss&&!e.on.length)text('z',x+12,y-30-((time*3)|0)%5,2,'#b0c8f8');
 if(e.hp<e.max){const w=e.boss?28:14,t=y-(e.boss?21:11);r('#181020',x-w/2-1,t-1,w+2,4);r(e.boss?'#f8e060':'#f84848',x-w/2,t,Math.max(0,Math.round(w*e.hp/e.max)),2)}}
function bugArt(sp,x,y,fl){switch(sp){
 case 0:r('#181020',x-2,y-3,5,4);r('#e83030',x-1,y-3,3,3);r('#181020',x,y-3,1,3);r('#181020',x-1,y-2,1,1);break;
 case 1:r('#c8b080',x-3,y-1,6,1);r('#c8b080',x+2,y-3,1,2);r('#604020',x-3,y-5,4,4);r('#c08850',x-2,y-4,2,2);break;
 case 2:r('#181020',x,y-3,1,4);if(fl){r('#f8f8ff',x-3,y-4,3,2);r('#f8f8ff',x+1,y-4,3,2);r('#f8a0c8',x-2,y-2,2,2);r('#f8a0c8',x+1,y-2,2,2)}else{r('#f8f8ff',x-1,y-4,1,4);r('#f8f8ff',x+1,y-4,1,4)}break;
 case 3:r('#108898',x-3,y-1,7,1);r('#20d0e0',x-2,y-1,5,1);r('#181020',x+3,y-1,1,1);r('#d0f8ff',x-1,y-(fl?3:2),3,1);r('#d0f8ff',x-1,y+(fl?1:0),3,1);break;
 case 4:r('rgba(240,255,120,.3)',x-3,y-3,6,7);r('#403820',x-1,y-2,2,2);r(fl?'#f8ff80':'#c8e040',x-1,y,2,2);break;
 case 5:r('#181020',x-3,y-4,6,5);r('#f8d030',x-2,y-4,4,4);r('#fff8a0',x-2,y-4,2,1);r('#181020',x,y-4,1,4);break;
 case 6:r('#181020',x-3,y-3,6,4);r('#f8d030',x-2,y-3,1,4);r('#f8d030',x,y-3,1,4);r('#f8d030',x+2,y-3,1,3);r('#e0f8ff',x-2,y-(fl?5:4),4,1);break;
 case 7:r('#801818',x-3,y-3,7,3);r('#e85040',x-2,y-3,5,2);r('#e85040',x-5,y-5+(fl?1:0),2,2);r('#e85040',x+4,y-5+(fl?0:1),2,2);r('#181020',x-1,y-4,1,1);r('#181020',x+1,y-4,1,1);break;
 case 8:r('#403848',x,y-3,1,4);if(fl){r('#b0a8c0',x-3,y-4,3,3);r('#b0a8c0',x+1,y-4,3,3);r('#e8e0f0',x-2,y-3,1,1);r('#e8e0f0',x+2,y-3,1,1)}else{r('#b0a8c0',x-1,y-4,1,3);r('#b0a8c0',x+1,y-4,1,3)}break;
 case 9:{const h=fl?1:0;r('#286028',x-3,y-3-h,7,4);r('#58c048',x-2,y-3-h,5,3);r('#ffffff',x-3,y-5-h,2,2);r('#ffffff',x+1,y-5-h,2,2);r('#181020',x-2,y-5-h,1,1);r('#181020',x+2,y-5-h,1,1);break}}}
function drawBug(q){if(q.hid)return;const s=BUGS[q.sp];let x=Math.round(q.x-ox),y=Math.round(q.y-oy);
 if(s.fly){r('rgba(0,0,0,.2)',x-1,y,3,1);y-=7+Math.round(Math.sin(time*5+q.hx))}bugArt(q.sp,x,y,((time*12)|0)%2);}
function drawDog(d){const x=Math.round(d.x-ox),y=Math.round(d.y-oy),left=d.fx<0,fr=d.mv?((time*9)|0)%2:0,hop=d.mv&&fr?1:0,sit=d.st==='sit'?1:0;
 r('rgba(0,0,0,.3)',x-8,y+1,17,2);const X=x-10,Y=y-12-hop+sit,ears=d.st==='sit',w=ears?(left?LOU.ew:LOU.ewr):(left?LOU.w:LOU.wr);
 g.drawImage(w,X-1,Y);g.drawImage(w,X+1,Y);g.drawImage(w,X,Y-1);g.drawImage(w,X,Y+1);g.drawImage(ears?(left?LOU.e:LOU.er):(left?LOU.l:LOU.r)[fr],X,Y);
 if(BAN){r(BAN,left?X+7:X+10,Y+8,3,2);r(BAN,left?X+8:X+11,Y+10,1,1)}
 if(((time*(d.st==='sit'?12:5))|0)%2)r('#fff0d8',left?X+16:X+3,Y,1,1);
 if(d.st==='sit'){r('#f85888',left?X+4:X+14,Y+8,2,2)}
 if(d.st==='dig')r('#a87850',left?X-2:X+20,Y+10+hop,2,2);
 if(d.say&&d.say.t>0){const s=d.say.s,fz=SCW<W?1:2,w2=tw(s,fz)+8,bx=Math.max(2,Math.min(SCW-w2-2,Math.round(x-w2/2)));r('#181020',bx-1,Y-19,w2+2,16);r('#ffffff',bx,Y-18,w2,14);r('#181020',x-1,Y-3,3,2);r('#ffffff',x,Y-4,1,2);text(s,bx+4,Y-(fz===1?16:17),fz,'#281c30',null)}
 else if(d.alert>0)text('!',x-2,Y-15,3,'#f8e060');
 else if(d.pet){const by=Y-14+(((time*3)|0)%2);r('#181020',x-6,by-1,13,11);r('#ffffff',x-5,by,11,9);r('#f85888',x-3,by+2,2,2);r('#f85888',x+1,by+2,2,2);r('#f85888',x-3,by+3,6,2);r('#f85888',x-2,by+5,4,1);r('#f85888',x-1,by+6,2,1)}}
function drawNPC(n){const x=Math.round(n.x-ox),y=Math.round(n.y-oy);r('rgba(0,0,0,.28)',x-4,y+3,8,2);g.drawImage(n.spr,x-6,y-10-(((time*1.5+n.x)|0)%2));
 const m=npcMark(n);if(m&&state==='play'&&((time*3)|0)%3)text('!',x-2,y-27,3,m===2?'#a8f080':'#f8e060');}
function drawPlayer(){const x=Math.round(P.x-ox),y=Math.round(P.y-oy);r('rgba(0,0,0,.28)',x-4,y+3,8,2);
 const s=Math.abs(P.dy)>=Math.abs(P.dx)?(P.dy<0?SP.pu:SP.pd):(P.dx>0?SP.pr:SP.pl),bob=P.mv?((P.anim*8)|0)%2:0;
 g.drawImage(s,x-6,y-10-bob-(P.pluck>0?2:0));}
function drawHouse(){const X=32*16-ox,Y=14*16+2-oy,k='#383048';
 r('rgba(0,0,0,.25)',X+1,Y+45,47,3);r(k,X+33,Y+1,8,13);r('#888098',X+34,Y+2,6,12);r('#b0a8c0',X+34,Y+2,6,2);
 r(k,X+2,Y+18,44,29);r('#f0e0c0',X+3,Y+19,42,27);r('#d8c098',X+3,Y+41,42,5);
 for(let i=0;i<9;i++){r(k,X-2+i*2.5,Y+18-i*2,52-i*5,3);r(i%2?'#b84038':'#d05848',X-1+i*2.5,Y+18-i*2,50-i*5,2)}
 for(let i=0;i<3;i++){const u=(time*.35+i/3)%1;r('rgba(240,240,248,'+(.55*(1-u)).toFixed(2)+')',X+35+Math.round(Math.sin(time*1.5+i*2)*2+u*4),Y-2-Math.round(u*16),3+((u*2)|0),3+((u*2)|0))}
 r(k,X+18,Y+29,12,18);r('#805030',X+19,Y+30,10,16);r('#a87048',X+20,Y+31,4,14);r('#f8e060',X+26,Y+38,2,2);
 [6,33].forEach(wx=>{r(k,X+wx,Y+25,10,10);r(((time*.7+wx)|0)%5?'#88d0f8':'#f8e8a0',X+wx+1,Y+26,8,8);r(k,X+wx+4,Y+26,1,8);r(k,X+wx+1,Y+29,8,1);r('#58c048',X+wx,Y+35,10,2);r('#f8a0c8',X+wx+1,Y+34,2,2);r('#f8e060',X+wx+5,Y+34,2,2)});
 const n=Math.min(8,homeTotal()),sx=ox,sy=oy;let k2=0;for(let t=0;t<NT&&k2<n;t++)for(let j=0;j<home.res[t]&&k2<n;j++,k2++){const side=k2%2?31+((k2/2)|0)*5:3+((k2/2)|0)*5;drawBud({x:32*16+side+3,y:17*16+3+(k2%3),type:t,stage:2,z:Math.max(0,Math.sin(time*3+k2*2))*2,mv:false,fx:k2%2?-1:1,st:'follow',a:k2,star:false,hat:meta.eq.hat})}}
function drawPost(z){const p=postXY(z),x=p.x-ox,y=p.y-oy;r('rgba(0,0,0,.25)',x-5,y+1,10,2);r('#383048',x-2,y-17,4,19);r('#805030',x-1,y-16,2,17);r('#383048',x-9,y-16,15,6);r('#e8c888',x-8,y-15,13,4);r('#383048',x-5,y-9,15,6);r('#c89050',x-4,y-8,13,4);r('#383048',x-8,y-14,1,2);r('#383048',x+7,y-7,1,2);r('#58c048',x-2,y-19,4,2);r('#383048',x+3,y-11,5,6);r(dayT/DAYLEN>.6?(((time*4)|0)%2?'#fff8a0':'#f8e060'):'#8890a8',x+4,y-10,3,4)}
function trArt(i,x,y){const c=TRS[i][1],k='#181020',m=i%4;
 if(m===0){r(k,x-3,y-4,7,8);r(c,x-2,y-3,5,6)}else if(m===1){r(k,x-1,y-5,3,10);r(k,x-3,y-3,7,6);r(c,x,y-4,1,8);r(c,x-2,y-2,5,4)}
 else if(m===2){r(k,x-4,y-3,9,6);r(k,x-3,y-4,7,8);r(c,x-3,y-2,7,4);r(c,x-2,y-3,5,6)}else{r(k,x-1,y-5,3,10);r(k,x-4,y-2,9,4);r(c,x,y-4,1,8);r(c,x-3,y-1,7,2);r(c,x-1,y-2,3,4)}
 r('#ffffff',x-1,y-2,1,1);}
function drawSpark(){const q=run.spark,x=q.x-ox,y=q.y-oy,p=((time*5)|0)%4;r('#6e4428',x-4,y,8,2);r('#a87850',x-2,y-1,4,1);const yy=y-7-(p===1?1:0);g.fillStyle='rgba(248,224,96,'+(.18+.14*Math.sin(time*5)).toFixed(2)+')';g.beginPath();g.arc(x+.5,yy+.5,9,0,7);g.fill();r('#f8e060',x-1,yy-4,3,9);r('#f8e060',x-4,yy-1,9,3);if(p<2){r('#ffffff',x-1,yy-1,3,3)}else r('#ffffff',x,yy,1,1);r('#fff8a0',x+5,yy-5+(p%2),1,1);r('#fff8a0',x-6,yy+2-(p%2),1,1);
 if(q.hp<8){r('#181020',x-7,y+4,14,4);r('#f8d030',x-6,y+5,Math.round(12*Math.max(0,1-q.hp/8)),2)}}
function drawSeed(q){if(q.t<0)return;const t=Math.min(1,q.t),x=Math.round(HX+(q.tx-HX)*t-ox),gy=HY-8+(q.ty-HY+8)*t,y=Math.round(gy-Math.sin(Math.PI*t)*26-(1-t)*22-oy),T=TYPES[q.type];r('rgba(0,0,0,.22)',x-1,Math.round(gy-oy),3,1);r('#181020',x-2,y-2,5,5);r(T.c,x-1,y-1,3,3);r(T.l,x-1,y-1,1,1)}
function drawHome(){r('#0c0a12',0,0,W,H);const X=RX-ox,Y=RY-oy,k='#383048',J=home.jobs,zk=Math.min(1.3,(W-4)/182,(H-74)/150);g.save();g.translate(W/2,H/2-6);g.scale(zk,zk);g.translate(-W/2,-H/2);
 r(k,X-3,Y-33,182,36);r('#e8d8b8',X,Y-30,176,30);for(let i=0;i<11;i++)r('#dcc8a0',X+i*16+7,Y-30,2,26);r('#a87048',X,Y-4,176,4);
 for(let ty=0;ty<7;ty++)for(let tx=0;tx<11;tx++)g.drawImage(TL.wood,X+tx*16,Y+ty*16);
 r(k,X-3,Y,3,115);r(k,X+176,Y,3,115);r(k,X-3,Y+112,182,3);
 [20,140].forEach(wx=>{r(k,X+wx,Y-26,18,16);r(dayT/DAYLEN>.75?'#283868':'#88d0f8',X+wx+1,Y-25,16,14);r(k,X+wx+8,Y-25,1,14);r(k,X+wx+1,Y-19,16,1)});
 r(k,X+50,Y-27,16,14);r('#f8e8b0',X+51,Y-26,14,12);r('#f8d030',X+56,Y-23,4,6);r('#c04848',X+54,Y-25,8,2);r(k,X+110,Y-27,16,14);r('#b0e0f8',X+111,Y-26,14,12);r('#e89040',X+114,Y-21,8,5);r('#fff0d8',X+115,Y-19,3,3);
 r(k,X+74,Y+1,28,13);r('#a87048',X+75,Y+2,26,11);r('#c89050',X+75,Y+2,26,3);r('#ffffff',X+80,Y+5,9,6);r('#a098b0',X+81,Y+7,7,1);r('#a098b0',X+81,Y+9,5,1);r('#e23b5e',X+92,Y+5,5,6);
 r(k,X+5,Y+1,36,14);r('#b07840',X+6,Y+2,34,12);[9,20,31].forEach((jx,i)=>{r(k,X+jx-1,Y+3,8,10);r(['#e83860','#f0a020','#9070b8'][i],X+jx,Y+5,6,7);r('#ffffff',X+jx,Y+4,6,2)});
 r(k,X+10,Y+52,22,12);r('#c89050',X+11,Y+53,20,10);r('#e83860',X+14,Y+55,4,4);r('#e83860',X+22,Y+56,4,4);r('#f8a8b8',X+14,Y+55,1,1);
 r(k,X+125,Y+1,46,14);r('#8a5a3a',X+126,Y+2,44,12);[132,143,154,165].forEach((fx,i)=>{r('#2c8030',X+fx,Y+2,1,6);flowerHead(i,X+fx,Y+3)});
 r(k,X+140,Y+52,24,11);r('#c89050',X+141,Y+53,22,9);flowerHead(0,X+147,Y+54);flowerHead(1,X+157,Y+54);
 r('#b84038',X+58,Y+42,62,40);r('#f0a868',X+61,Y+45,56,34);r('#b84038',X+66,Y+50,46,24);r('#f8e060',X+86,Y+59,6,6);
 r(k,X+6,Y+84,30,20);r('#e23b5e',X+7,Y+85,28,18);r('#f8a0b0',X+10,Y+88,22,12);r(k,X+41,Y+97,8,8);r('#60b8f8',X+42,Y+98,6,6);r('#ffffff',X+43,Y+99,2,2);
 r(k,X+134,Y+74,36,32);r('#805030',X+135,Y+75,34,30);[0,15].forEach(by=>{r('#f0e0c0',X+137,Y+77+by,30,11);r('#60b8f8',X+137,Y+83+by,30,5);r('#ffffff',X+138,Y+78+by,8,4)});
 r('#58a058',X+76,Y+101,24,10);r('#78c078',X+78,Y+103,20,6);
 [['PICKERS '+J[0],8,17],['FLORISTS '+J[1],110,17],['TRAINERS '+J[2],8,106],['RESTING '+(homeTotal()-J[0]-J[1]-J[2]),62,84]].forEach(([n,lx,ly])=>text(n,X+lx,Y+ly,1,'#fff8e0'));
 const L=[];for(const q of resid)L.push([q.y,drawBud,q]);L.push([LO.y+1,drawDog,LO]);L.push([P.y,drawPlayer]);L.sort((a,b)=>a[0]-b[0]);LO.pet=petOK&&state==='play';for(const d of L)d[1](d[2]);
 for(const q of resid)if(q.job<3&&q.mv){const x=Math.round(q.x-ox),y=Math.round(q.y-oy)-17;r(k,x-2,y-1,5,5);r(['#e83860','#f8a0c8','#f8e060'][q.job],x-1,y,3,3)}
 for(const p of parts){const x=Math.round(p.x-ox),y=Math.round(p.y-oy);if(p.gh===2){r(p.c,x-2,y-1,2,2);r(p.c,x+1,y-1,2,2);r(p.c,x-2,y,5,2);r(p.c,x-1,y+2,3,1);r(p.c,x,y+3,1,1)}else r(p.c,x,y,2,2)}
 g.restore();if(state==='play'){const fy=H-50,dk=facing(DESK,36);box(0,fy,W,31,'rgba(24,16,32,.92)');ctext(dk?'A: MANAGE THE HOUSE':!resid.length?'NOBODY LIVES HERE YET. TRY THE DESK':'LIVING HERE '+homeTotal()+' / '+homeCap(),fy+2,2,dk?'#f8e060':'#fff8e0');ctext('WALK DOWN TO LEAVE',fy+17,1,'#a098b0')}}
const THORN={x:398,y:316};
function drawThorn(){const x=THORN.x-ox,y=THORN.y-oy,b=((time*1.2)|0)%2;r('rgba(0,0,0,.28)',x-13,y+1,26,4);g.drawImage(BO.r,x-16,y-20+b,32,22);if(dayT/DAYLEN>.6)text('z',x+14,y-30-((time*3)|0)%5,2,'#b0c8f8')}
function drawHearth(){const x=Math.round(HX-ox),y=Math.round(HY-oy),lit=shards/4,fl=Math.sin(time*9)>0?1:0;
 {const rr=18+shards*8+fl,gr=g.createRadialGradient(x,y-24,2,x,y-24,rr);gr.addColorStop(0,'rgba(255,232,130,'+(.20+lit*.22).toFixed(2)+')');gr.addColorStop(.6,'rgba(255,224,110,'+(.08+lit*.12).toFixed(2)+')');gr.addColorStop(1,'rgba(255,224,110,0)');g.fillStyle=gr;g.fillRect(x-rr,y-24-rr,rr*2,rr*2)}
 r('#383048',x-10,y-3,20,9);r('#888098',x-9,y-2,18,7);r('#b0a8c0',x-9,y-2,18,1);
 for(let i=0;i<4;i++)r(i<shards?'#f8d030':'#504860',x-7+i*4,y+1,2,2);
 r('#382818',x-2,y-18,4,16);r('#684830',x-1,y-18,2,16);
 r('#282038',x-7,y-32,14,14);r(shards?'#f8e060':'#705838',x-5,y-30,10,10);r(shards?'#fff8c0':'#907048',x-2+fl,y-27,3,5);r('#f08030',x-1,y-23,2,2);
 r('#782828',x-9,y-35,18,3);r('#c04848',x-9,y-35,18,2);r('#c04848',x-5,y-38,10,3);r('#f07070',x-4,y-38,3,1);}
function drawWorld(){
 ox=Math.round(cam.x);oy=Math.round(cam.y);if(inHome){drawHome();return}g.save();g.scale(Z,Z);SCW=VW;const wf=((time*2)|0)%2;
 if(bakeDirty||!BG){bake();bakeDirty=false}
 const bsx=Math.max(0,ox),bsy=Math.max(0,oy),bsw=Math.min(VW+1,MW*16-bsx),bsh=Math.min(Math.ceil(H/Z)+1,MH*16-bsy);
 g.drawImage(BG[wf],bsx,bsy,bsw,bsh,bsx-ox,bsy-oy,bsw,bsh);drawClouds();
 {const mx=894-ox,my=30-oy;if(mx>-60&&mx<VW+10&&my>-20&&my<VH+10)for(let k=0;k<7;k++){const u=(time*.9+k*.37)%1;r('rgba(255,255,255,'+(.55*(1-u)).toFixed(2)+')',Math.round(mx+((k*17)%44)+Math.sin(time*2+k)*2),Math.round(my+2-u*9),2,2)}}
 {const br=gates[5];if(br&&br.alive){const X=60*16-ox,Y=11*16-oy;bridgeArt(r,X,Y,Math.floor((1-br.hp/br.max)*8),false);if(!br.on.length){const y=Y+2+Math.round(Math.sin(time*3)*1.5);r('#181020',X+10,y-2,13,11);r('#f8f0d8',X+11,y-1,11,9);r('#583018',X+12,y+1,9,2);r('#c89050',X+12,y+1,8,1);r('#583018',X+12,y+5,9,2);r('#c89050',X+12,y+5,8,1);r('#181020',X+15,y+9,3,1);r('#181020',X+16,y+10,1,1)}}}
 for(const ga of gates)if(ga.alive){if(ga.sub<3)ga.tiles.forEach(([tx,ty])=>{const jx=ga.on.length?Math.round(Math.sin(time*40+tx)):0;g.drawImage(TL.gate[ga.sub],tx*16-ox+jx,ty*16-oy)});
  if(ga.hp<ga.max){const x=Math.round(ga.x-ox),y=Math.round(ga.y-oy)-14;r('#181020',x-11,y-1,22,4);r('#f8d030',x-10,y,Math.round(20*ga.hp/ga.max),2)}}
 for(const ga of gates)if(ga.alive&&ga.sub<2){const T=TYPES[ga.sub],x=Math.round(ga.x-ox)-3,y=Math.round(ga.y-oy)-24+Math.round(Math.sin(time*3)*1.5);r('#181020',x-2,y-2,11,11);r('#f8f0d8',x-1,y-1,9,9);r(T.d,x,y,7,7);r(T.c,x+1,y+1,5,5);r('#181020',x+2,y+3,1,2);r('#181020',x+4,y+3,1,2);r('#181020',x+2,y+9,3,1);r('#181020',x+3,y+10,1,1)}
 LO.pet=petOK&&state==='play';
 const L=[];
 for(const s of sprouts)L.push([s.y,drawSprout,s]);for(const q of seeds)L.push([q.ty,drawSeed,q]);for(const q of wbuds)if(!q.hid)L.push([q.y,drawWbud,q]);L.push([KEEP.y,drawKeep]);for(const it of items)if(it.alive)L.push([it.y+1,drawItem,it]);
 for(const e of foes)if(e.alive)L.push([e.y,drawFoe,e]);for(const b of buds)L.push([b.y+(b.st==='fight'?4:0),drawBud,b]);
 for(const q of bugs)if(q.alive)L.push([q.y,drawBug,q]);for(const n of npcs)L.push([n.y,drawNPC,n]);
 if(gard.open){noGard=!buds.some(b=>b.gard);for(const p of plots)L.push([p.y-2,drawBed,p]);L.push([7*16+12,drawBasket]);L.push([SIGN.y,drawSign])}
 if(run.boss)L.push([THORN.y,drawThorn]);pjDrawList(L);if(run.spark)L.push([run.spark.y,drawSpark]);L.push([17*16-3,drawHouse]);for(const z of ZONES)L.push([postXY(z).y,drawPost,z]);L.push([LO.y+12,drawDog,LO]);L.push([P.y,drawPlayer]);L.push([HY,drawHearth]);
 L.sort((a,b)=>a[0]-b[0]);for(const d of L)d[1](d[2]);
 g.drawImage(OVR,bsx,bsy,bsw,bsh,bsx-ox,bsy-oy,bsw,bsh);
 for(const p of parts){const x=Math.round(p.x-ox),y=Math.round(p.y-oy);
  if(p.gh===2){r(p.c,x-2,y-1,2,2);r(p.c,x+1,y-1,2,2);r(p.c,x-2,y,5,2);r(p.c,x-1,y+2,3,1);r(p.c,x,y+3,1,1)}
  else if(p.gh===3){r(p.c,x,y-2,1,5);r(p.c,x-2,y,5,1);r('#f8e060',x,y,1,1)}else if(p.gh===4){r(p.c,x-1,y-1,3,3);r('#ffffff',x-1,y-1,1,1)}else r(p.c,x,y,2,2)}
 if(state==='play'){const x=Math.round(cur.x-ox),y=Math.round(cur.y-oy),c=TYPES[sel].l,q=4+(((time*4)|0)%2);if(needT>=0){const s='NEEDS '+TYPES[needT].n+'S';text(s,Math.round(x-tw(s)/2),y+9,2,TYPES[needT].l)}
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{r('#181020',x+a*q-1,y+b*q-1,3,3);r(c,x+a*q,y+b*q,1,1);r(c,x+a*q-a,y+b*q,1,1);r(c,x+a*q,y+b*q-b,1,1)});
  if(wr>0)for(let i=0;i<16;i++){const a=i/16*6.283+time*5;r(i%2?'#ffffff':'#f8e060',Math.round(x+Math.cos(a)*wr),Math.round(y+Math.sin(a)*wr),2,2)}}
 drawAmb();
 g.restore();SCW=W;drawNight();
}
function box(x,y,w,h,c='rgba(24,16,32,.82)'){r(c,x,y,w,h);}
function drawHUD(){
 const ds='DAY '+day,dw=tw(ds);box(2,2,dw+66,15);text(ds,5,3,2,'#fff8c0');
 const bx=dw+10,bw=52,f=Math.min(1,dayT/DAYLEN);r('#504860',bx,8,bw,3);r('#f8d030',bx,8,Math.round(bw*(1-f)),3);const sx=bx+Math.round((bw-5)*f);r('#181020',sx-1,5,7,9);r(f>.8?'#f8a060':'#fff080',sx,6,5,7);
 const ss=shards+' / 4',sw=tw(ss);box(W-sw-18,2,sw+16,15);r('#906008',W-sw-15,5,6,8);r('#f8d030',W-sw-14,4,4,10);r('#fff8a0',W-sw-14,5,1,5);text(ss,W-sw-5,3,2,'#fff8c0');
 let x=2;const y=H-17;
 for(let t=0;t<NT;t++){if(!found[t])continue;const n=String(squad.filter(b=>b.type===t).length),T=TYPES[t],on=t===sel,w=16+tw(n);
  r(on?'#f8e060':'rgba(24,16,32,.82)',x,y,w+2,15);if(on)r('#281c30',x+1,y+1,w,13);
  r(T.d,x+3,y+4,7,7);r(T.c,x+4,y+5,5,5);r(T.l,x+4,y+5,2,1);r('#181020',x+5,y+7,1,2);r('#181020',x+7,y+7,1,2);
  text(n,x+13,y+1,2,on?'#ffffff':'#b0a8c0',null);x+=w+4;}
 if(zoneT>0&&state==='play'){const a=Math.min(1,zoneT*2,(2.2-zoneT)*4);const zn=zName(zone),zw=tw(zn,3)+22,zy=Math.round(H*.25);g.globalAlpha=a;r('rgba(24,16,32,.82)',Math.round((W-zw)/2),zy-3,zw,21);r('#f8e060',Math.round((W-zw)/2),zy+16,zw,2);ctext(zn,zy,3,'#fff8c0','#403010');g.globalAlpha=1}
 const tot=buds.filter(b=>!b.gard).length+' / '+capNow(),tw2=tw(tot);box(W-tw2-8,y,tw2+6,15);text(tot,W-tw2-5,y+1,2,'#c8f0a0');
 let my=20;
 if(OBJ){const w=tw(OBJ.text)+12;box(Math.round((W-w)/2),my,w,15,'rgba(24,16,32,.88)');r(OBJ.done?'#a8f080':OBJ.col,Math.round((W-w)/2),my,3,15);ctext(OBJ.text,my+1,2,OBJ.done?'#a8f080':'#ffffff');my+=17;
  const tx=(OBJ.x-ox)*Z,ty=(OBJ.y-oy)*Z,col=OBJ.done?'#a8f080':'#f8e060',on=tx>10&&tx<W-10&&ty>44&&ty<H-24;
  if(state==='play'&&!inHome){if(!on){const cx=W/2,cy=H/2,a=Math.atan2(ty-cy,tx-cx),k=Math.min((W/2-14)/Math.abs(Math.cos(a)||1e-6),(H/2-36)/Math.abs(Math.sin(a)||1e-6)),p=1+Math.sin(time*6)*2;
    g.save();g.translate(Math.round(cx+Math.cos(a)*(k+p)),Math.round(cy+6+Math.sin(a)*(k+p)));g.rotate(a);g.fillStyle='#181020';g.beginPath();g.moveTo(9,0);g.lineTo(-6,-8);g.lineTo(-6,8);g.fill();g.fillStyle=col;g.beginPath();g.moveTo(6,0);g.lineTo(-4,-5);g.lineTo(-4,5);g.fill();g.restore()}
   else if(d2(P,OBJ.x,OBJ.y)>34*34){const by=Math.round(ty-30+Math.sin(time*6)*2),bx=Math.round(tx);r('#181020',bx-4,by-1,9,5);r('#181020',bx-2,by+4,5,2);r('#181020',bx-1,by+6,3,1);r(col,bx-3,by,7,3);r(col,bx-1,by+3,3,2);r(col,bx,by+5,1,1)}}}
 if(toasts.length){const s=toasts[0].s,w=tw(s)+20;r('#f8e060',Math.round((W-w)/2),my,w,17);r('#281c30',Math.round((W-w)/2)+1,my+1,w-2,15);petalIcon(Math.round((W-w)/2)+5,my+6);text(s,Math.round((W-w)/2)+14,my+2,2,'#f8e060')}
 else if(msgT>0&&msg){const ls=wrapPx(msg,222),w=Math.max(...ls.map(l=>tw(l)))+10;box(Math.round((W-w)/2),my,w,4+ls.length*13,'rgba(24,16,32,.88)');ls.forEach((l,i)=>ctext(l,my+2+i*13,2,'#ffffff'))}
 else if(inGarden(P.x,P.y)){const o=gard.order,s=(o?'ERIN WANTS '+o.have+' / '+o.need+' '+FLOWERS[o.k].pl+'   ':'')+'GARDENERS '+gardeners();const w=tw(s)+8;box(Math.round((W-w)/2),my,w,15,'rgba(40,90,50,.85)');ctext(s,my+1,2,'#e0ffd0')}
}
function npCard(){if(MUS.np>0&&MUS.cur>=0&&state==='play'){const t=TRACKS[MUS.cur],w=Math.max(tw(t.title,2),tw(t.artist,1),tw('NOW PLAYING',1))+42,k=Math.min(1,(5.5-MUS.np)*4,MUS.np*3),cx=Math.round(-w+(w+3)*k),cy=H-60;
  r('#181020',cx,cy,w,40);r('#f8f0d8',cx+1,cy+1,w-2,38);r('#181020',cx+4,cy+7,26,26);if(t.img&&t.img.complete)g.drawImage(t.img,cx+5,cy+8,24,24);
  text('NOW PLAYING',cx+35,cy+2,1,'#8858c8',null);text(t.title,cx+35,cy+13,2,'#281c30',null);text(t.artist,cx+35,cy+26,1,'#685878',null);}}
function walletBox(y){const p=String(meta.petals),t=String(meta.tix),w=tw(p)+tw(t)+34;box(W-w-3,y,w,15,'rgba(24,16,32,.88)');petalIcon(W-w,y+5);text(p,W-w+8,y+1,2,'#f8c8e0');ticketIcon(W-tw(t)-17,y+5);text(t,W-tw(t)-6,y+1,2,'#f8e060');}
function drawList(items,sel,y,step,max=7){const n=items.length,top=Math.max(0,Math.min(n-max,sel-((max/2)|0)));
 for(let k=0;k<Math.min(max,n);k++){const i=top+k,s=items[i],on=i===sel,yy=y+k*step;if(on){const w=tw(s)+18;r('#f8e060',Math.round((W-w)/2),yy-2,w,15);r('#281c30',Math.round((W-w)/2)+1,yy-1,w-2,13)}ctext(s,yy-1,2,on?'#ffffff':'#c8c0d8')}
 if(top>0){r('#f8e060',117,y-7,6,2);r('#f8e060',119,y-9,2,2)}if(top+max<n){const b=y+max*step-3;r('#f8e060',117,b,6,2);r('#f8e060',119,b+2,2,2)}return top;}
function drawPreview(x,y,w,h){r('#181020',x,y,w,h);g.save();g.beginPath();g.rect(x+1,y+1,w-2,h-2);g.clip();g.drawImage(TL.grass[0],x+1,y+1,w-2,h-2);g.drawImage(TL.grass[1],x+1,y+1+h/2,w-2,h/2);
 g.translate(x,y);g.scale(2,2);g.drawImage(SP.pd,5,4);const sx=ox,sy=oy;ox=oy=0;
 drawBud({x:w/2-10,y:17,type:(time|0)%NT,stage:2,z:0,mv:false,fx:-1,st:'follow',a:(time|0),hat:(look||meta.eq).hat});drawDog({x:w/4,y:h/2-5,fx:-1,mv:((time/2)|0)%2===0,st:'follow',alert:0});ox=sx;oy=sy;g.restore();
 const tr=STY.trail[(look||meta.eq).trail];if(tr[1]){for(let i=0;i<4;i++){const px=x+10+i*13,py=y+h-6-((time*20+i*9)%14);r(tr[1],px,py,3,3)}}}
const WHO={ERIN:'#c8a8f8',RANGER:'#f8a070',MARCUS:'#78c8f8',THORNBACK:'#f07878',LOUIE:'#e89040'};
const SCN={
 open:[["For as long as anyone can remember, the Great Lantern has kept this valley warm and bright.",'lantern'],
  ["Last night it cracked. Four sun shards flew off into the wild, and the nights are getting longer.",'crack'],
  ["Hi, Will! I'm Erin. I look after the lantern and the garden. This is Louie. He looks after snacks.",'erin','ERIN'],
  ["You're the new keeper. These little ones are sprouts. They grow in the lantern's soil and follow whoever plucks them.",'sprouts','ERIN'],
  ["Each kind is good at something. Aim at a thing and the right sprout steps up by itself.",'types','ERIN'],
  ["Throw them with A. Call them back with B. Bring the shards home, and make yourself at home too. Ready?",'home','ERIN']],
 s1:[["The shard clicks back into place. The Great Lantern coughs, flickers, and glows a little brighter.",'relight'],
  ["One down, Will! Feel that? The soil's warming up already.",'erin','ERIN'],
  ["Before you celebrate, come look at this. Something left marks by the lantern. Big ones.",'claws','RANGER'],
  ["So it didn't just crack. Something cracked it. Keep your eyes open out there.",'claws','ERIN']],
 s2:()=>[["Two shards home. The lantern's light reaches the edge of the field now.",'relight'],
  ["Bro. Found more of those marks by my pond. Something huge was dragging something warm. I could take it. Probably.",'trail','MARCUS'],
  [run.boss?"Trail went south, into the hollow. Which explains our big new neighbor. I would've handled it, bro.":"Trail heads south, into the hollow. Nobody goes in the hollow. ...You first though, bro.",'trail','MARCUS'],
  ["Grr. ...Woof?",'erin','LOUIE']],
 s3:()=>[["Three shards. The nights are almost warm again.",'relight'],
  run.boss?["One left, and you already know who was keeping it warm. Bring it home, Will.",'erin','ERIN']:["One left, and we know where it is. Old Thornback has slept in that hollow since before I was born.",'thorn','ERIN'],
  run.boss?["Woof!",'erin','LOUIE']:["Go gently, Will. Bring plenty of sprouts, and bring Louie.",'thorn','ERIN']],
 thorn:[["Old Thornback blinks awake. Tucked under his chin, glowing softly, is the last sun shard.",'thorn2'],
  ["...Oh. Oh no. Is this yours? The nights got so cold. I only wanted to curl up by the warm light.",'thorn2','THORNBACK'],
  ["I must have squeezed too tight. I heard a crack, and I ran. I'm sorry, little keeper.",'thorn2','THORNBACK'],
  ["I was set to guard that light, long before you came. I have forgotten who asked me. Or why it matters so.",'thorn2','THORNBACK'],
  ["A guardian. So the old stories were true. I wish I remembered the rest of them.",'erin','ERIN'],
  ["He wasn't stealing it. He was freezing. Will... there's room by the lantern, isn't there?",'erin','ERIN'],
  ["Thornback pads off toward the Lantern Field. Carry the shard home.",'thorn2']],
 end:[["The last shard slides home. The Great Lantern blazes, and the whole valley turns gold.",'party'],
  ["You did it, Will. You, Louie, and a few dozen very small friends.",'party','ERIN'],
  ["Warm. Finally warm. I'll keep watch at night, if you'll have me.",'party','THORNBACK'],
  ["The lantern is whole. Nobody remembers who lit it first, or why the valley needs it so.",'party'],
  ["The garden is growing. And there's still plenty to find out there.",'party']],
 keep:[["Behind the willows stands an arch of old stone, older than any path in the valley. A sun is carved at the top.",'ruin'],
  ["Look at the carving, Will. A lantern. Sprouts. And big creatures standing with them. Buddies.",'ruin','ERIN'],
  ["There are words. '...promised to sprouts and buddies. Keep the...' The rest is worn away.",'ruin','ERIN'],
  ["And here, under the sun: SUN KEEP. Is that an order, or a name?",'ruin','ERIN'],
  ["Our house sits on stones just like these. Somebody kept this light before us, and nobody remembers who.",'ruin','ERIN'],
  ["Woof.",'ruin','LOUIE'],
  ["Erin starts calling the Lantern Field 'Sunkeep'. It sticks.",'ruin']]};
/* ---------- valley projects: sprouts move out for good to build things ---------- */
const npcBy=n=>npcs.find(q=>q.name===n)||{st:'',mi:0};
const PJ=[
 {id:'ww',name:'MARCUS WATERWORKS',who:'MARCUS',sx:216,sy:220,ky:230,box:[112,212,80,8],foc:[176,250],hat:6,visit:'SWIM DAY',
  open:()=>npcBy('MARCUS').st==='done',
  intro:"Marcus wants a waterpark! Take sprouts to his blueprint sign by the pond.",
  st:[['SWIM SPOT',{1:8}],['LIFEGUARD TOWER',{2:10,1:6}],['LAZY RIVER',{2:16}],['THE BIG SLIDE',{3:10,1:8,0:6}],['GRAND OPENING',{4:12,5:12},300]],
  tip:['PEBS DIG OUT A BEACH AND A SWIM SPOT','DEWS ON DUTY. PEBS HAUL THE WOOD','DEWS FLOAT TUBES AROUND THE ISLAND','ZIPS TEST IT. PEBS AND EMBERS BUILD IT','LEAFS AND LUCKIES DECORATE. THEN WE OPEN'],
  perk:'+10 PETALS EVERY MORNING. SPROUTS LOVE A SWIM DAY.'},
 {id:'gh',name:"ERIN'S GREENHOUSE",who:'ERIN',sx:664,sy:156,ky:110,box:[642,122,26,14],foc:[656,92],hat:7,visit:'GARDEN DAY',
  open:()=>gard.open,
  intro:"Erin dreams of a greenhouse. Her blueprint is in the garden.",
  st:[['WOODEN FRAME',{1:10}],['GLASS PANES',{3:10}],['WARM STOVE',{0:12}],['BEES AND BLOOMS',{4:12,5:8},150]],
  tip:['PEBS RAISE THE FRAME','ZIPS FIT AND POLISH EVERY PANE','EMBERS KEEP IT WARM AT NIGHT','LEAFS FILL THE SHELVES. LUCKIES BRING BEES'],
  perk:'WATERS YOUR GARDEN EVERY MORNING. +10 PETALS A DAY.'},
 {id:'den',name:"THORNBACK'S DEN",who:'THORNBACK',sx:472,sy:556,ky:541,box:[420,566,136,10],foc:[520,520],hat:8,visit:'NAP DAY',
  open:()=>!!run.boss,
  intro:"Thornback needs a warm den. His blueprint is in the hollow.",
  st:[['MOSS BED',{4:12}],['WARM STONES',{0:12,1:6}],['DEN LIGHTS',{3:8,5:6},100]],
  tip:['LEAFS GATHER THE SOFTEST MOSS','EMBERS HEAT THE STONES. PEBS ROLL THEM IN','ZIPS STRING LIGHTS. LUCKIES HANG A LANTERN'],
  perk:'THORNBACK FINDS YOU A TICKET EVERY THIRD MORNING.'},
 {id:'lo',name:"RANGER'S LOOKOUT",who:'RANGER',sx:536,sy:92,ky:79,box:[480,98,56,10],foc:[560,64],hat:9,visit:'STARGAZING',
  open:()=>npcBy('RANGER').mi>=2||npcBy('RANGER').st==='done',
  intro:"Ranger wants a lookout. The blueprint is in the north meadow.",
  st:[['STONE FOOTINGS',{1:12}],['TALL LADDER',{4:10}],['SPYGLASS',{3:8,2:6},100]],
  tip:['PEBS SET THE HEAVY STONES','LEAFS WEAVE A STURDY LADDER','A ZIP CLIMBS UP. DEWS POLISH THE LENS'],
  perk:'EACH MORNING RANGER SAYS WHERE A TREASURE SPARKLES.'},
 {id:'bh',name:"SCOUT'S BUG HOTEL",who:'SCOUT',sx:1032,sy:396,ky:415,box:[976,402,64,8],foc:[1060,392],hat:10,visit:'BUG WALK',
  open:()=>npcBy('SCOUT').st==='done',
  intro:"Scout wants a bug hotel. The blueprint is in the orchard.",
  st:[['TINY ROOMS',{4:10,1:6}],['FLOWER GARDEN',{5:8}],['NIGHT LIGHTS',{0:6,3:6},100]],
  tip:['LEAFS AND PEBS STACK STICKS AND BARK','LUCKIES PLANT FLOWERS FOR GUESTS','EMBERS AND ZIPS HANG LITTLE LIGHTS'],
  perk:'EVERY BUG YOU CATCH IS WORTH MORE PETALS.'}];
const pjS=p=>{run.pj=run.pj||{};return run.pj[p.id]||(run.pj[p.id]={s:0,got:[0,0,0,0,0,0],wt:[0,0,0,0,0,0],w:0,v:0})},
 pjDone=p=>pjS(p).s>=p.st.length,pjOpen=p=>{try{return !!p.open()}catch(e){return false}},PJV=2;
let bp=null;
function pjGone(b){b.dead=true;release(b);puff(b.x,b.y,TYPES[b.type].c,3,25)}
function pjSend(p){const s=pjS(p),sq=buds.filter(b=>b.st==='follow'&&!b.gard),bad=m=>{flash=m;flashT=2.6;snd(140,.1)};
 if(pjDone(p)){if(s.v>=PJV)return bad('COME BACK TOMORROW FOR MORE');if(sq.length<10)return bad('BRING 10 SPROUTS WITH YOU');
  sq.slice(0,10).forEach(b=>{s.wt[b.type]++;pjGone(b)});s.w+=10;s.v++;buds=buds.filter(b=>!b.dead);squad=squad.filter(b=>!b.dead);earn(20);louXP(4);
  flash='10 SPROUTS MOVED IN!  +20 PETALS';flashT=3.5;snd(660,.08,990);later(()=>snd(1175,.2),100);persist();return}
 const [nm,need,pet]=p.st[s.s];let sent=0;
 for(const t in need){const left=need[t]-s.got[t];if(left<=0)continue;sq.filter(b=>b.type==t&&!b.dead).slice(0,left).forEach(b=>{pjGone(b);s.got[t]++;s.wt[t]++;s.w++;sent++})}
 buds=buds.filter(b=>!b.dead);squad=squad.filter(b=>!b.dead);
 const ready=Object.keys(need).every(t=>s.got[t]>=need[t]);
 if(ready&&(!pet||meta.petals>=pet)){if(pet)meta.petals-=pet;pjStage(p);return}
 if(sent){earn(sent);flash=sent+' MOVED OUT TO BUILD!  +'+sent+' PETALS';flashT=3;snd(660,.08,990);later(()=>snd(990,.12),90);persist();return}
 bad(ready?'NEED '+(pet-meta.petals)+' MORE PETALS':'BRING THE SPROUTS IT NEEDS');}
function pjStage(p){const s=pjS(p);s.s++;s.got=[0,0,0,0,0,0];const fin=s.s>=p.st.length;earn(fin?60:20+10*s.s);
 if(fin){if(!meta.own.hat.includes(p.hat))meta.own.hat.push(p.hat);meta.tix++;unlock1(33);if(PJ.every(pjDone))unlock1(34);if(p.id==='ww')unlock1(35);metaAch();}
 state='play';sceneQ.push([p.id+s.s,null]);snd(523,.1);later(()=>snd(784,.1),110);later(()=>snd(1046,.25),220);checkAch();persist();}
function pjTick(){if(pjDone(PJ[2])){THORN.x=520;THORN.y=534}
 if(state!=='play'||sceneQ.length)return;run.pjSeen=run.pjSeen||{};
 for(const p of PJ)if(!run.pjSeen[p.id]&&pjOpen(p)){run.pjSeen[p.id]=1;card={t:0,title:'NEW PROJECT!',sub:p.intro,art:()=>pjIcon(p)};state='card';snd(784,.08);later(()=>snd(1175,.2),90);persist();return}}
function pjIcon(p){const spr=CH[p.who];if(spr)g.drawImage(spr,90,56,24,28);else g.drawImage(BO.l,84,62,32,22);
 r('#181020',122,54,30,30);r('#3870c8',123,55,28,28);for(let k=0;k<5;k++)r('#a8d0f8',126,59+k*5,6+((k*9)%16),1);r('#f8f0d8',140,68,8,8);r('#3870c8',142,70,4,4);}
function pjMorning(){let pet=0;for(const p of PJ){const s=pjS(p);s.v=0;if(pjDone(p))pet+=10}
 if(pjDone(PJ[1]))for(const q of plots)if(q.st>=1&&q.st<=3)q.dry=false;
 if(pjDone(PJ[2])&&day%3===0){meta.tix++;toast('THORNBACK FOUND YOU A TICKET')}
 if(pet){earn(pet);toast('PROJECTS:  +'+pet+' PETALS')}
 if(pjDone(PJ[3])&&run.spark){const tx=run.spark.x>>4,ty=run.spark.y>>4,z=ZONES.find(z=>tx>=z[1]&&tx<z[1]+z[3]&&ty>=z[2]&&ty<z[2]+z[4]);if(z)toast('RANGER: A SPARKLE IN '+z[0])}}
function pjObj(){for(const p of PJ)if(pjOpen(p)&&!pjDone(p)){const s=pjS(p);return{text:'BUILD: '+p.st[s.s][0],x:p.sx,y:p.sy,done:false,col:WHO[p.who]||'#c8c0d8'}}return null}
function wkTypes(s,n){const o=[],tot=s.wt.reduce((a,b)=>a+b,0)||1;for(let t=0;t<NT;t++){const k=Math.round(s.wt[t]/tot*n);for(let i=0;i<k;i++)o.push(t)}while(o.length<n)o.push(o.length?o[0]:2);
 for(let i=o.length-1;i>0;i--){const j=(i*7+3)%(i+1);[o[i],o[j]]=[o[j],o[i]]}return o.slice(0,n)}
function pjDrawList(L){for(const p of PJ){if(!pjOpen(p))continue;const s=pjS(p);L.push([p.sy,drawPjSign,p]);if(s.s>0)L.push([p.ky,p.draw,s.s]);
 const n=Math.min(8,s.w),ty=wkTypes(s,n),[bx,by,bw,bh]=p.box;
 for(let k=0;k<n;k++){const ph=time*.6+k*1.7,x=bx+((k*37+11)%bw)+Math.sin(ph)*6,y=by+((k*13)%Math.max(1,bh));
  L.push([y,drawBud,{x,y,type:ty[k],stage:2,z:0,mv:Math.abs(Math.cos(ph))>.35,fx:Math.cos(ph)>0?1:-1,st:'follow',a:k,star:false,hat:meta.eq.hat}])}}}
function drawPjSign(p){const x=Math.round(p.sx-ox),y=Math.round(p.sy-oy),dn=pjDone(p),c=dn?'#f8d030':'#3870c8',l=dn?'#fff8a0':'#a8d0f8';
 r('rgba(0,0,0,.25)',x-6,y+1,12,2);r('#583018',x-1,y-6,2,8);r('#383048',x-8,y-17,16,12);r(c,x-7,y-16,14,10);r(l,x-5,y-14,10,1);r(l,x-5,y-11,6,1);r(l,x-5,y-8,9,1);
 if(!dn){const b=((time*2)|0)%2;r('#181020',x-2,y-28+b,5,9);r('#f8e060',x-1,y-27+b,3,5);r('#f8e060',x-1,y-21+b,3,2)}}
const pX=v=>Math.round(v-ox),pY=v=>Math.round(v-oy);
PJ[0].draw=s=>{
 if(s>=1){for(let tx=7;tx<=12;tx++){r('#e8d498',pX(tx*16),pY(13*16+5),16,11);r('#f8e8b8',pX(tx*16+3+(tx%3)*3),pY(13*16+8),2,1);r('#d0b878',pX(tx*16+9),pY(13*16+12),2,1)}
  r('#e8e0d0',pX(192),pY(252),56,1);for(let k=0;k<7;k++){const bx=pX(194+k*8),by=pY(250)+(((time*2+k)|0)%2);r(k%2?'#ffffff':'#e83040',bx-1,by,3,3)}}
 if(s>=2){const x=pX(244),y=pY(238);r('#181020',x-7,y-26,2,27);r('#181020',x+5,y-26,2,27);r('#f8f0d8',x-6,y-25,1,25);r('#f8f0d8',x+6,y-25,1,25);for(let k=0;k<3;k++)r('#f8f0d8',x-6,y-20+k*7,13,1);
  r('#181020',x-9,y-29,18,4);r('#c04848',x-8,y-28,16,2);r('#181020',x,y-44,1,15);for(let k=0;k<5;k++){r('#181020',x-11+k*4,y-47+Math.abs(k-2),5,4);r(k%2?'#ffffff':'#e83040',x-10+k*4,y-46+Math.abs(k-2),4,3)}
  drawBud({x:244,y:210,type:2,stage:2,z:0,mv:false,fx:-1,st:'follow',a:3,hat:meta.eq.hat})}
 if(s>=3){const ty=wkTypes(pjS(PJ[0]),8);for(let k=0;k<8;k++){const a=time*.25+k*.785,x=168+Math.cos(a)*42,y=312+Math.sin(a)*36,px=pX(x),py=pY(y);
  r('#181020',px-6,py-2,12,6);r(['#f85888','#f8a040','#f8e060','#60d880'][k%4],px-5,py-1,10,4);r('#ffffff',px-4,py-1,2,1);
  drawBud({x,y:y+1+Math.round(Math.sin(time*2+k)),type:ty[k],stage:2,z:0,mv:false,fx:Math.sin(a)>0?-1:1,st:'follow',a:k,hat:meta.eq.hat})}}
 if(s>=4){const x=pX(104),y=pY(222);r('#181020',x-6,y-24,2,24);r('#181020',x+4,y-24,2,24);for(let k=0;k<4;k++)r('#c89050',x-5,y-20+k*5,10,1);r('#181020',x-7,y-27,14,4);r('#f8d030',x-6,y-26,12,2);
  const at=u=>[108+u*20+Math.sin(u*3.14)*10,196+u*50];for(let k=0;k<=14;k++){const [sx,sy]=at(k/14);r('#181020',pX(sx)-3,pY(sy)-1,7,4);r(k%2?'#60b8f8':'#f8d030',pX(sx)-2,pY(sy),5,2)}
  const u=(time%3.2)/1.4;if(u<1){const [sx,sy]=at(u);drawBud({x:sx,y:sy+1,type:3,stage:2,z:0,mv:false,fx:1,st:'follow',a:7,hat:meta.eq.hat})}
  else if(u<1.6){const k=(u-1)/.6;g.strokeStyle='rgba(255,255,255,'+(1-k).toFixed(2)+')';g.lineWidth=1;g.beginPath();g.ellipse(pX(128),pY(247),3+k*10,1+k*4,0,0,7);g.stroke()}}
 if(s>=5){const a=pX(128),b=pX(200),t=pY(194);r('#583018',a-1,t,2,26);r('#583018',b-1,t,2,26);
  for(let k=0;k<=12;k++){const x=Math.round(a+(b-a)*k/12),y=t+2+Math.round(Math.sin(k/12*3.14)*5);r('#383048',x,y,2,1);if(k<12&&k!==5&&k!==6)r(RAINBOW[k%6],x+1,y+1,3,3)}
  const w=tw('WATERWORKS',1)+6,cx=Math.round((a+b)/2);r('#181020',cx-w/2-1,t+8,w+2,10);r('#3888e0',cx-w/2,t+9,w,8);text('WATERWORKS',cx-w/2+3,t+9,1,'#ffffff',null);
  [[146,216,'#f85888'],[184,216,'#f8a040']].forEach(([ux,uy,c])=>{const x=pX(ux),y=pY(uy);r('#583018',x,y-12,1,12);r('#181020',x-8,y-15,17,4);r(c,x-7,y-14,15,2)})}};
PJ[1].draw=s=>{const x=pX(642),y=pY(110);
 if(s>=2){g.fillStyle='rgba(168,216,248,.55)';g.fillRect(x+2,y-19,24,17);g.beginPath();g.moveTo(x+2,y-20);g.lineTo(x+14,y-29);g.lineTo(x+26,y-20);g.fill();r('rgba(255,255,255,.8)',x+5,y-16,1,6);r('rgba(255,255,255,.8)',x+18,y-15,1,4)}
 if(s>=3){g.fillStyle='rgba(248,160,64,.18)';g.fillRect(x+2,y-19,24,17);r('#383048',x+4,y-9,7,7);r(((time*6)|0)%2?'#f8a040':'#f8d030',x+5,y-6,5,2);r('#383048',x+20,y-36,3,9);
  for(let k=0;k<3;k++)r('rgba(225,225,235,.75)',x+20+Math.round(Math.sin(time*2+k)*2),y-40-((time*8+k*6)%18),3,3)}
 if(s>=4){for(let k=0;k<3;k++){r('#8a5a3a',x+13+k*4,y-6,3,4);flowerHead(k,x+14+k*4,y-8)}r('#383048',x+3,y-18,7,6);r('#f8d030',x+4,y-17,5,4);r('#383048',x+4,y-15,5,1);
  for(let k=0;k<2;k++){const a=time*2+k*3,bx=x+14+Math.round(Math.cos(a)*16),by=y-24+Math.round(Math.sin(a*1.3)*6);r('#f8d030',bx,by,2,2);r('#181020',bx+1,by,1,2);r('#ffffff',bx,by-1,2,1)}}
 if(s>=1){const W2='#583018';r(W2,x,y-20,2,20);r(W2,x+26,y-20,2,20);r(W2,x+13,y-29,2,29);r(W2,x,y-2,28,2);r(W2,x,y-21,28,2);
  for(let k=0;k<14;k++){r(W2,x+k,y-21-Math.round(k*9/13),1,2);r(W2,x+27-k,y-21-Math.round(k*9/13),1,2)}}};
PJ[2].draw=s=>{const x=pX(520),y=pY(540);
 if(s>=2){g.fillStyle='rgba(248,160,64,.14)';g.beginPath();g.ellipse(x,y-4,34,14,0,0,7);g.fill()}
 if(s>=1){g.fillStyle='#2c5c30';g.beginPath();g.ellipse(x,y-2,22,7,0,0,7);g.fill();g.fillStyle='#58a848';g.beginPath();g.ellipse(x,y-3,19,5,0,0,7);g.fill();for(let k=0;k<7;k++)r('#88d070',x-16+k*5,y-6+(k%2)*3,2,1)}
 if(s>=2)for(let k=0;k<10;k++){const a=k/10*6.283,sx=Math.round(x+Math.cos(a)*27),sy=Math.round(y-2+Math.sin(a)*10);r('#383048',sx-3,sy-2,7,5);r('#98a0b0',sx-2,sy-2,5,3);r(((time*3+k)|0)%3?'#f8a040':'#f8d030',sx-1,sy-1,2,1)}
 if(s>=3){r('#583018',x-30,y-24,2,24);r('#583018',x+29,y-24,2,24);for(let k=0;k<=12;k++){const lx=x-29+k*5,ly=y-23+Math.round(Math.sin(k/12*3.14)*6);r('#383048',lx,ly,5,1);if(k%2===0)r(((time*2+k)|0)%2?'#f8e060':RAINBOW[(k/2)%6],lx,ly+1,2,2)}
  r('#383048',x+27,y-31,6,7);r(((time*3)|0)%2?'#f8e060':'#fff8a0',x+28,y-30,4,5)}};
PJ[3].draw=s=>{const x=pX(568),y=pY(78);
 if(s>=2){r('#583018',x-8,y-40,2,36);r('#583018',x+6,y-40,2,36);for(let k=0;k<8;k++)r('#c89050',x-6,y-9-k*4,12,1);r('#583018',x-11,y-43,22,4);r('#c89050',x-10,y-42,20,2)}
 if(s>=1){r('#383048',x-11,y-6,22,7);r('#98a0b0',x-10,y-5,20,5);r('#dce2ea',x-9,y-5,6,1);r('#dce2ea',x+2,y-5,6,1)}
 if(s>=3){r('#583018',x-9,y-58,2,15);r('#583018',x+7,y-58,2,15);r('#181020',x-12,y-60,24,3);r('#c04848',x-11,y-59,22,1);r('#583018',x,y-70,1,10);const f=((time*3)|0)%2;r('#f8e060',x+1,y-70,5+f,3);
  drawBud({x:566,y:35,type:3,stage:2,z:0,mv:false,fx:1,st:'follow',a:5,hat:meta.eq.hat});r('#383048',x+2,y-50,7,2);if(((time*1.5)|0)%3===0)r('#ffffff',x+8,y-50,1,1)}};
PJ[4].draw=s=>{const x=pX(1072),y=pY(414);
 if(s>=1){r('#181020',x-14,y-31,28,31);r('#8a5a3a',x-13,y-30,26,29);for(let i=0;i<3;i++)for(let j=0;j<3;j++){const cx=x-12+i*8,cy=y-29+j*9;r('#3c2a20',cx,cy,7,8);r(['#c89050','#6a4c38','#78c870'][(i+j)%3],cx+1,cy+1,5,6);r('#3c2a20',cx+2,cy+2+((i*3+j)%3),3,1)}
  g.fillStyle='#583018';g.beginPath();g.moveTo(x-17,y-30);g.lineTo(x,y-42);g.lineTo(x+17,y-30);g.fill();r('#c04848',x-1,y-40,2,2)}
 if(s>=2){for(let k=0;k<6;k++)flowerHead(k%4,x-17+k*7,y+2);for(let k=0;k<2;k++){const a=time*1.6+k*3,bx=x+Math.round(Math.cos(a)*22),by=y-26+Math.round(Math.sin(a*1.4)*10),w=((time*10)|0)%2;r(['#f8a040','#60b8f8'][k],bx-1-w,by,2,2);r(['#f8a040','#60b8f8'][k],bx+1+w,by,2,2);r('#181020',bx,by,1,3)}}
 if(s>=3){for(const lx of[-16,15]){r('#181020',x+lx,y-14,3,5);r(((time*3+lx)|0)%2?'#f8e060':'#fff8a0',x+lx+1,y-13,1,3)}if(dayT/DAYLEN>.55)for(let k=0;k<5;k++)if(((time*2+k)|0)%2)r('#f8f080',x-20+((k*13+Math.round(time*5))%40),y-36+((k*7)%24),1,1)}};
function drawPjBuild(){const p=bp,s=pjS(p),dn=pjDone(p),col=WHO[p.who]||'#c8c0d8';
 text(p.name,5,2,2,'#f8e060');const tg=p.who,tgw=tw(tg,1)+6;r(col,5,19,tgw,9);text(tg,8,19,1,'#181020',null);
 for(let k=0;k<p.st.length;k++){const x=W-6-(p.st.length-k)*10;r('#181020',x,19,8,8);r(k<s.s?'#a8f080':k===s.s?'#f8e060':'#504860',x+1,20,6,6)}
 if(!dn){const [nm,need,pet]=p.st[s.s],sq=buds.filter(b=>b.st==='follow'&&!b.gard);ctext('STAGE '+(s.s+1)+': '+nm,33,2,'#ffffff');let y=52;
  for(const t in need){const T=TYPES[t],have=sq.filter(b=>b.type==t).length,got=s.got[t],n=need[t],ok=got>=n;
   r('#181020',8,y,11,11);r(T.d,9,y+1,9,9);r(T.c,10,y+2,7,7);r('#181020',11,y+4,1,2);r('#181020',15,y+4,1,2);text(T.n,24,y,2,ok?'#a8f080':'#ffffff');
   r('#181020',82,y+2,66,8);r('#383048',83,y+3,64,6);r(ok?'#a8f080':T.c,83,y+3,Math.round(64*Math.min(1,got/n)),6);
   rtext(got+'/'+n,196,y,2,ok?'#a8f080':'#ffffff');if(!ok)rtext('+'+Math.min(have,n-got),236,y,2,have?'#f8e060':'#706888');y+=15}
  if(pet){petalIcon(11,y+4);text('PETALS',24,y,2,'#f8c8e0');rtext(String(pet),196,y,2,meta.petals>=pet?'#a8f080':'#f8a060')}
  r('#281c30',0,112,W,100);ctext(flashT>0?flash:p.tip[s.s],115,2,flashT>0?'#a8f080':'#fff8c0');
  ctext('SPROUTS YOU SEND MOVE HERE FOR GOOD',132,1,'#a098b0');ctext('A: SEND SPROUTS      B: LEAVE',146,2,'#a098b0')}
 else{ctext('ALL BUILT!',34,3,'#a8f080');wrapPx(p.perk,226).slice(0,2).forEach((l,i)=>ctext(l,62+i*14,2,'#fff8c0'));ctext(p.visit+': SEND 10 SPROUTS',94,2,'#ffffff');
  r('#281c30',0,112,W,100);ctext(flashT>0?flash:'+20 PETALS EACH.  '+Math.max(0,PJV-s.v)+' LEFT TODAY',115,2,flashT>0?'#a8f080':'#f8c8e0');
  ctext('SPROUTS LIVING HERE: '+s.w,132,1,'#a098b0');ctext('A: SEND 10      B: LEAVE',146,2,'#a098b0')}}
Object.assign(SCN,{
 ww1:[["The Pebs dig out a swim spot and a sandy little beach. Marcus is already lying on it.",'pj:ww'],["Bro. BRO. Look at this beach. I said it'd take a week. Took an hour. I'm a visionary, bro.",'pj:ww','MARCUS']],
 ww2:[["A lifeguard tower rises over the pond. A very serious Dew climbs up and blows a tiny whistle.",'pj:ww'],["Safety first, bro. Then fun. Then MORE fun. That's the Waterworks promise.",'pj:ww','MARCUS']],
 ww3:[["Inner tubes drift around the island. The sprouts float in slow, happy circles.",'pj:ww'],["Lazy river is LIVE. Look at 'em float, bro. I dreamed this. Literally. Last Tuesday.",'pj:ww','MARCUS']],
 ww4:[["A big twisty slide drops right into the pond. The Zips go first. Then again. Then again.",'pj:ww'],["Fastest slide in the valley, bro. Only slide in the valley. Still counts.",'pj:ww','MARCUS']],
 ww5:[["Flags go up over the beach. The whole valley turns out for the grand opening.",'pj:ww'],["Ladies, gentlemen, sprouts. Welcome... to MARCUS WATERWORKS!",'pj:ww','MARCUS'],
  ["I can't believe you actually built a waterpark, Marcus.",'erin','ERIN'],["Couldn't have done it without my guy. Will. Bring it in, bro.",'dap','MARCUS'],["Woof! (Louie is already in the lazy river.)",'pj:ww','LOUIE'],
  ["Marcus gave your sprouts SHADES and a capsule ticket. Swim days are open: bring 10 sprouts to the sign for petals.",'pj:ww']],
 gh1:[["The Pebs raise a little wooden frame in the corner of the garden.",'pj:gh'],["A greenhouse, Will. I've wanted one forever. Don't tell Marcus. He'll want to put a slide in it.",'pj:gh','ERIN']],
 gh2:[["The Zips fit pane after pane, then polish every one until it shines.",'pj:gh'],["Look at the light in there. It's like standing inside a sunbeam.",'pj:gh','ERIN']],
 gh3:[["The Embers settle in around a tiny stove. The greenhouse glows warm, even at night.",'pj:gh'],["Now the seedlings won't shiver. Neither will I.",'pj:gh','ERIN']],
 gh4:[["Leafs fill the shelves with blooms, and the Luckies coax a family of bees into a hive.",'pj:gh'],["It's perfect, Will. Thank you. Really.",'erin','ERIN'],["The greenhouse now waters the garden every morning. Erin gave your sprouts a BEE BUDDY and a capsule ticket.",'pj:gh']],
 den1:[["The Leafs pile soft moss into a bed, big enough for someone very big.",'pj:den'],["For... me? Nobody has ever made me a bed.",'pj:den','THORNBACK']],
 den2:[["The Embers warm a ring of stones. The hollow feels like a summer afternoon.",'pj:den'],["Warm stones. Warm everything. I may never leave.",'pj:den','THORNBACK']],
 den3:[["The Zips string tiny lights, and the Luckies hang a lantern of his very own.",'pj:den'],["A little lantern, just for me. Now I won't need to borrow yours.",'pj:den','THORNBACK'],
  ["Thornback moves in. Every third morning he finds you a ticket. Your sprouts get THORN HORNS, and you get a capsule ticket.",'pj:den']],
 lo1:[["The Pebs set heavy stone footings in the north meadow.",'pj:lo'],["Solid. A lookout's only as good as what it stands on.",'pj:lo','RANGER']],
 lo2:[["The Leafs weave a sturdy ladder and lash the tower together.",'pj:lo'],["Almost there. I can nearly see Marcus's pond from here. He's waving. He's always waving.",'pj:lo','RANGER']],
 lo3:[["A Zip scurries up with a spyglass, and the Dews polish the lens.",'pj:lo'],["Now I can see the whole valley. Every morning I'll tell you where something sparkles.",'pj:lo','RANGER'],["Ranger gave your sprouts a LOOKOUT CAP and a capsule ticket.",'pj:lo']],
 bh1:[["The Leafs and Pebs stack tiny rooms out of sticks, bark and moss.",'pj:bh'],["A bug hotel! Every room is a different kind of cozy.",'pj:bh','SCOUT']],
 bh2:[["The Luckies plant flowers all around it. The first guests flutter in.",'pj:bh'],["A butterfly just checked in. I'm writing this down.",'pj:bh','SCOUT']],
 bh3:[["Embers and Zips hang little night lights. The moths are thrilled.",'pj:bh'],["The bugs are so happy here, they're worth more petals now. And the sprouts can have these.",'pj:bh','SCOUT'],["Scout gave your sprouts ANTENNAE and a capsule ticket.",'pj:bh']]});

function playScene(k,done){const q=SCN[k];scn=typeof q==='function'?q():q;cineI=0;cineT=0;scnDone=done||null;state='cine';}
function shardArt(X,Y){const ws=[2,4,6,8,8,6,6,4,4,2,2];ws.forEach((w,i)=>r('#906008',X-w/2-1,Y-12+i,w+2,1));ws.forEach((w,i)=>{r('#f8d030',X-w/2,Y-12+i,w,1);r('#fff8a0',X-w/2,Y-12+i,Math.max(1,w/2-1),1)});}
function drawCine(){const t=cineT,i=cineI,e=scn[i],art=e[1],sx=ox,sy=oy,hh=H-74,gy=hh-14,night=art==='lantern'||art==='crack'||art==='relight',cave=art==='thorn'||art==='thorn2',gold=art==='party',dark=night||cave;ox=oy=0;
 if(cave){r('#181428',0,0,W,hh);g.fillStyle='#241c38';g.beginPath();g.arc(120,hh+40,170,0,7);g.fill();for(let k=0;k<9;k++)r('#2c2444',(k*29+8)%236,0,7,10+(k*7)%22);r('#2a3a30',0,hh-26,W,26);r('#1c2a24',0,hh-26,W,2)}
 else{if(night){r('#101838',0,0,W,hh);for(let k=0;k<30;k++)r(k%5?'#8090c8':'#ffffff',(k*53+17)%240,(k*29+7)%Math.max(20,hh-50),1,1);g.fillStyle='#182848'}
  else{(gold?[['#f89048',0],['#f8b868',.2],['#f8e098',.42]]:[['#f8b878',0],['#f8c890',.2],['#f8dca8',.42]]).forEach(([c,q])=>r(c,0,Math.round(hh*q),W,hh));g.fillStyle=gold?'#a0b858':'#78c078'}
  g.beginPath();g.arc(50,hh+14,72,0,7);g.arc(190,hh+30,92,0,7);g.fill();r(night?'#1c3828':gold?'#70a848':'#58b858',0,hh-26,W,26);r(night?'#142c20':'#3c9848',0,hh-26,W,2)}
 const heart=(x,y)=>{r('#f85888',x-2,y-1,2,2);r('#f85888',x+1,y-1,2,2);r('#f85888',x-2,y,5,2);r('#f85888',x-1,y+2,3,1);r('#f85888',x,y+3,1,1)};
 const big=(spr,x)=>g.drawImage(spr,x,gy-54,48,56),sm=(spr,x)=>{r('rgba(0,0,0,.28)',x+4,gy+2,16,3);g.drawImage(spr,x,gy-26,24,28)};
 const lant=(x,sc,n)=>{const sh=shards;if(n!==undefined)shards=n;g.save();g.translate(x,gy);g.scale(sc,sc);ox=HX;oy=HY;drawHearth();ox=oy=0;g.restore();shards=sh};
 const dog=(x,y,sc,sit,fx)=>{g.save();g.translate(x,y);g.scale(sc,sc);drawDog({x:0,y:0,fx:fx||-1,mv:false,st:sit?'sit':'follow',alert:0,say:null});g.restore()};
 const claw=(x,y)=>{for(let k=0;k<3;k++){r('#3c2a20',x+k*6,y-k,2,9);r('#6a4c38',x+k*6+2,y-k+1,1,7)}};
 const thorn=(x,y,k)=>{r('rgba(0,0,0,.3)',x+3*k,y-2*k,26*k,4*k);g.drawImage(BO.l,x,y-22*k,32*k,22*k)};
 if(art==='lantern')lant(120,2,4);
 else if(art==='crack'){lant(120,2,t<.3?4:0);if(t<.3)r('rgba(255,255,255,'+(1-t/.3).toFixed(2)+')',0,0,W,hh);[[-1,-.9],[1,-.8],[-.8,-.3],[.9,-.4]].forEach(([ax,ay])=>{const d=Math.min(1,Math.max(0,t-.3)/1.8),x=Math.round(120+ax*d*135),y=Math.round(gy-56+ay*d*90+d*d*34);if(d>0&&d<1){r('#906008',x-2,y-3,5,7);r('#f8d030',x-1,y-2,3,5);r('#fff8a0',x-1,y-2,1,2);r('#fff8a0',Math.round(x-ax*7),Math.round(y-ay*7),1,1)}})}
 else if(art==='relight'){lant(120,2);if(t<.4)r('rgba(255,244,190,'+(1-t/.4).toFixed(2)+')',0,0,W,hh);for(let k=0;k<10;k++)r('#fff8a0',Math.round(120+Math.sin(k*2.1+t)*(24+k*5)),Math.round(gy-34-((t*22+k*13)%70)),1,1)}
 else if(art==='erin'){big(CH.ERIN,70);dog(158,gy,2,t>.8);if(t>1.1&&((t*2)|0)%2)heart(182,gy-34)}
 else if(art==='sprouts'){big(SP.pd,30);r('#8a5a3a',96,gy-6,136,10);r('#6e4428',96,gy-6,136,2);for(let k=0;k<6;k++){const a=t-.3-k*.28;if(a>0){g.save();g.translate(110+k*22,gy-2);g.scale(2,2);if(a<1.3)drawSprout({x:0,y:2,type:k%NT,age:a*28});else drawBud({x:0,y:0,type:k%NT,stage:1,z:Math.abs(Math.sin(t*5+k))*2,mv:true,fx:-1,st:'follow',a:k});g.restore()}}}
 else if(art==='types'){const tips=['BURN','SMASH','SWIM','RUN','GARDEN','BONUS'];for(let k=0;k<NT;k++){const x=22+k*39,a=t-k*.18;if(a>0){g.save();g.translate(x,gy-30);g.scale(3,3);drawBud({x:0,y:0,type:k,stage:2,z:Math.max(0,Math.sin(a*6))*Math.max(0,1-a)*4,mv:false,fx:1,st:'follow',a:k});g.restore();const n=TYPES[k].n;text(n,Math.round(x-tw(n,1)/2),gy-24,1,TYPES[k].l);text(tips[k],Math.round(x-tw(tips[k],1)/2),gy-13,1,'#ffffff')}}}
 else if(art==='home'){ox=32*16-24;oy=14*16+2-(gy-46);drawHouse();ox=oy=0;lant(196,1);r('rgba(0,0,0,.28)',112,gy+3,8,2);g.drawImage(SP.pd,110,gy-10);r('rgba(0,0,0,.28)',128,gy+3,8,2);g.drawImage(CH.ERIN,126,gy-10);dog(154,gy+3,1,true)}
 else if(art==='ruin'){sm(SP.pr,20);sm(CH.ERIN,46);dog(88,gy+3,1,true,1);const ax=112,ay=gy-70,k='#383048';r('rgba(0,0,0,.25)',ax-2,gy+1,108,4);r(k,ax-2,ay-2,108,74);r('#8088a0',ax,ay,104,72);r('#a0a8bc',ax,ay,104,3);r('#48a850',ax,ay,30,3);r('#48a850',ax+80,ay+40,24,3);
  for(let i=0;i<8;i++)r('#6c7488',ax+((i*37)%90),ay+8+i*8,12,1);r(k,ax+14,ay+18,76,54);r('#2c2840',ax+16,ay+20,72,52);
  r('#f8d040',ax+48,ay+4,8,8);for(let i=0;i<8;i++){const a=i*.785;r('#f8d040',Math.round(ax+51+Math.cos(a)*8),Math.round(ay+7+Math.sin(a)*6),2,2)}
  const c='#a0a8bc',lit=t>.6;r(c,ax+49,ay+50,6,18);r(c,ax+45,ay+36,14,14);r(lit?'#f8e060':'#585070',ax+47,ay+38,10,10);r(c,ax+44,ay+33,16,3);if(lit){g.fillStyle='rgba(248,224,96,.2)';g.beginPath();g.arc(ax+52,ay+43,14+Math.sin(t*4),0,7);g.fill()}
  for(let i=0;i<3;i++){const x=ax+21+i*8,y=ay+60-(i%2)*4;r(c,x,y,5,6);r(c,x+2,y-3,1,3);r(c,x+1,y-5,3,2)}
  r(c,ax+64,ay+50,18,14);r(c,ax+66,ay+46,6,5);r(c,ax+76,ay+46,5,5);r(c,ax+65,ay+64,4,4);r(c,ax+77,ay+64,4,4);r('#2c2840',ax+68,ay+54,2,2);r('#2c2840',ax+76,ay+54,2,2);
  if(i>=3)text('SUN KEEP',ax+52-tw('SUN KEEP',1)/2,ay+23,1,'#f8e060',null)}
 else if(art==='claws'){big(CH.RANGER,30);lant(204,1);[[104,gy-4],[136,gy+4],[168,gy-2]].forEach(([x,y],k)=>{if(t>.3+k*.35)claw(x,y)})}
 else if(art==='trail'){big(CH.MARCUS,26);g.fillStyle='#3888e0';g.save();g.translate(196,gy-4);g.scale(1,.3);g.beginPath();g.arc(0,0,40,0,7);g.fill();g.restore();r('#a8d8ff',180,gy-7,12,1);r('#a8d8ff',200,gy-2,8,1);for(let k=0;k<4;k++)if(t>.3+k*.3)claw(90+k*22,gy+2-(k%2)*7)}
 else if(art.slice(0,3)==='pj:'){const p=PJ.find(q=>q.id===art.slice(3)),cx=cam.x,cy=cam.y,vh=Math.ceil(H/Z);cam.x=Math.max(0,Math.min(MW*16-VW,p.foc[0]-VW/2));cam.y=Math.max(0,Math.min(MH*16-vh,p.foc[1]-(vh-50)/2));drawWorld();cam.x=cx;cam.y=cy;ox=oy=0;
  if(t<3)for(let k=0;k<16;k++)r(RAINBOW[k%6],Math.round((k*37+Math.sin(t*2+k)*10)%236),Math.round((t*50+k*23)%Math.max(30,hh-20)),2,2)}
 else if(art==='dap'){const d=Math.round(Math.max(0,.7-t)*50);big(SP.pd,50-d);g.save();g.translate(190+d,0);g.scale(-1,1);big(CH.MARCUS,0);g.restore();
  if(t>.7){const k=Math.min(1,(t-.7)*4);for(let i=0;i<10;i++){const a=i/10*6.283;r(i%2?'#f8e060':'#78c8f8',Math.round(120+Math.cos(a)*(8+k*22)),Math.round(gy-30+Math.sin(a)*(6+k*16)),2,2)}text('DAP!',100,Math.max(10,gy-96),4,'#f8e060')}}
 else if(cave){sm(SP.pr,22);dog(66,gy+3,1.5,art==='thorn2',1);const bob=art==='thorn2'?Math.round(Math.sin(t*4)):0;
  g.fillStyle='rgba(248,224,96,'+(.28+.12*Math.sin(t*3)).toFixed(2)+')';g.beginPath();g.arc(126,gy-6,art==='thorn'?13:20,0,7);g.fill();thorn(118,gy+4+bob,3.4);
  if(art==='thorn'){text('z',196,gy-84-((t*5)|0)%6,2,'#b0c8f8');text('Z',208,gy-98-((t*5)|0)%6,3,'#b0c8f8')}
  else{g.save();g.translate(110,gy+6);g.scale(2,2);shardArt(0,0);g.restore();if(((t*2)|0)%2){r('#a8d8ff',214,gy-66,2,4);r('#a8d8ff',213,gy-63,4,2)}}}
 else if(gold){thorn(2,gy-2,1.6);lant(120,2,4);sm(SP.pd,58);sm(CH.ERIN,82);sm(CH.MARCUS,146);sm(CH.RANGER,172);sm(CH.SCOUT,198);dog(120,gy+12,1.5,true);
  for(let k=0;k<8;k++){g.save();g.translate(18+k*29,gy+20);g.scale(1.5,1.5);drawBud({x:0,y:0,type:k%NT,stage:2,z:Math.abs(Math.sin(t*5+k*1.3))*4,mv:true,fx:k<4?1:-1,st:'follow',a:k});g.restore()}
  for(let k=0;k<12;k++)if(((t*2+k)|0)%3)r('#fff8a0',Math.round((k*47+20+Math.sin(t+k)*8)%236),Math.round(14+(k*31)%Math.max(30,hh-70)+Math.cos(t*1.3+k)*5),1,1)}
 r('#181020',4,H-72,232,68);r('#f8f0d8',5,H-71,230,66);if(e[2]){const w=tw(e[2])+10;r('#181020',8,H-82,w,15);r(WHO[e[2]]||'#c8c0d8',9,H-81,w-2,13);text(e[2],13,H-80,2,'#181020',null)}
 const ls=wrapPx(e[0],214),n=Math.floor(t*38);let c=0;ls.slice(0,4).forEach((l,k)=>{text(l.slice(0,Math.max(0,n-c)),12,H-66+k*15,2,'#281c30',null);c+=l.length+1});
 if(n>=e[0].length&&((time*3)|0)%2){r('#c02848',224,H-14,5,3);r('#c02848',225,H-11,3,1);r('#c02848',226,H-10,1,1)}
 rtext('START: SKIP',236,3,1,dark?'#8090c8':'#a87048',null);text((i+1)+' / '+scn.length,5,3,1,dark?'#8090c8':'#a87048',null);ox=sx;oy=sy;}
function drawIntro(){const t=introT,gy=Math.round(H*.6),sx=ox,sy=oy;ox=oy=0;
 [['#f8b878',0],['#f8c890',.14],['#f8dca8',.3],['#f8ecc8',.45]].forEach(([c,k])=>r(c,0,Math.round(H*k),W,H));
 g.fillStyle='#fff4c0';g.beginPath();g.arc(34,Math.round(H*.36)-Math.min(12,t*3),14,0,7);g.fill();
 g.fillStyle='#78c078';g.beginPath();g.arc(60,gy+40,70,0,7);g.arc(190,gy+50,80,0,7);g.fill();
 r('#58b858',0,gy,W,H);r('#3c9848',0,gy,W,2);for(let i=0;i<14;i++){r('#3c9848',(i*37+11)%236,gy+8+(i*13)%30,2,1);r('#84d870',(i*53+5)%236,gy+5+(i*17)%34,1,1)}
 const sy0=H-26;r('#8a5a3a',0,sy0,W,26);r('#6e4428',0,sy0,W,2);for(let i=0;i<12;i++)r('#6e4428',(i*41+7)%230,sy0+7+(i*7)%14,7,1);
 // title letters drop in
 const T='SPROUTS',tw0=tw(T,5),lx=Math.round((W-tw0)/2);let cx=lx;for(let i=0;i<T.length;i++){const k=Math.max(0,Math.min(1,(t-.2-i*.12)/.35)),b=k<1?0:Math.max(0,Math.sin((t-.55-i*.12)*9))*Math.max(0,1-(t-.55-i*.12)*1.6)*5;
  if(k>0)text(T[i],cx,Math.round(-30+(H*.12+30)*k-b),5,'#f8e060','#783010');cx+=tw(T[i],5)}
 if(t>1.4)ctext('A POCKET LANTERN GAME',Math.round(H*.12)+30,2,'#783010',null);
 // the parade
 const wy=gy+22,px=Math.min(118,-20+t*62),walking=px<118;
 for(let i=0;i<8;i++){const bx=px-20-i*11;if(bx>-8)drawBud({x:bx,y:wy+((i*7)%5)-2,type:i%4,stage:i%3===0?2:i%3,z:walking?0:Math.max(0,Math.sin(t*7+i))*3,mv:walking,fx:1,st:'follow',a:i*1.7})}
 drawDog({x:Math.min(144,px+26),y:wy+3,fx:1,mv:walking,st:walking?'follow':'sit',alert:0,say:walking?null:{s:((t*.6)|0)%2?'ARF!':'WOOF!',t:1}});
 r('rgba(0,0,0,.28)',Math.round(px)-4,wy+3,8,2);g.drawImage(walking?SP.pr:SP.pd,Math.round(px)-6,wy-10-(walking?((t*8)|0)%2:0));
 [['ERIN',186],['MARCUS',206],['SCOUT',222]].forEach(([n,x],i)=>{r('rgba(0,0,0,.28)',x-4,wy+3-i,8,2);g.drawImage(CH[n],x-6,wy-10-i-(((t*2+i)|0)%2))});
 if(!walking&&((t*2)|0)%2){const hx=164,hy=wy-22;r('#f85888',hx-2,hy-1,2,2);r('#f85888',hx+1,hy-1,2,2);r('#f85888',hx-2,hy,5,2);r('#f85888',hx-1,hy+2,3,1);r('#f85888',hx,hy+3,1,1)}
 // sprouts pop up in the soil as it loads
 const pr=Math.min(1,t/4.2),n=Math.floor(pr*10);for(let i=0;i<n;i++)drawSprout({x:21+i*22,y:sy0+14,type:i%4,age:Math.min(40,(pr*10-i)*14)});
 ctext(pr<1||!cloudDone&&t<8?'WAKING THE SPROUTS...':(((t*2)|0)%2?'PRESS A':''),sy0-13,2,'#fff8e0');
 ox=sx;oy=sy;}
function draw(){
 if(state.slice(0,2)==='g3'){g3Draw();return;}
 if(state.slice(0,2)==='g4'){g4Draw();return;}
 if(state.slice(0,3)==='lan'){lanDraw();return;}
 if(state==='off'){r('#0c0a12',0,0,W,H);return;}
 const OY=(H-160)/2;
 if(state==='boot'){r('#0c0a12',0,0,W,H);const t=bootT;if(t>.25){const y=Math.round(Math.min(OY+46,-30+(t-.25)*(OY+76))),c=bootDing?'#f8e060':['#f07830','#48a0f0','#f0d020','#98a0b0'][((t*8)|0)%4];
   ctext('POCKET',y,5,c,'#403010');ctext('LANTERN',y+28,5,c,'#403010');if(bootDing){r('#f8e060',117,y+62,6,8);r('#fff8c0',119,y+64,2,4);r('#c04848',115,y+59,10,3);ctext('LIGHTS ON',y+78,2,'#c8c0d8',null)}}return;}
 if(state==='ko'){KO.draw();return}
 if(state==='pp'){PP.draw();return}
 if(state==='intro'){drawIntro();return}
 if(state==='cine'){drawCine();return}
 drawWorld();
 if(state==='play'||state==='talk'){drawHUD();npCard()}
 if(state==='pan'){const L=ZLINE[pan.z[0]],a=Math.min(1,pan.t*3,(4.2-pan.t)*3),bh=Math.round(30*a),ls=wrapPx(L[1],222);r('#0c0a12',0,0,W,bh);r('#0c0a12',0,H-Math.round(64*a),W,70);
  if(a>=1){ctext(pan.z[0],5,4,'#f8e060','#403010');const w=tw(L[0])+10;r(WHO[L[0]],8,H-61,w,13);text(L[0],13,H-61,2,'#181020',null);ls.forEach((l,i)=>text(l,10,H-45+i*14,2,'#ffffff',null))}return}
 const dim={menu:'rgba(20,12,40,.62)',rewards:'rgba(20,12,40,.86)',caps:'rgba(20,12,40,.88)',style:'rgba(20,12,40,.86)',bugs:'rgba(20,12,40,.86)',pause:'rgba(20,12,40,.82)',house:'rgba(20,12,40,.9)',build:'rgba(20,12,40,.9)',travel:'rgba(20,12,40,.86)',map:'rgba(12,8,24,.94)',hop:'rgba(12,8,24,.94)',card:'rgba(20,12,40,.72)',settings:'rgba(20,12,40,.88)',dayend:'rgba(16,10,50,.84)',win:'rgba(255,220,110,.35)'}[state];if(dim)r(dim,0,0,W,H);
 g.save();g.translate(0,state==='talk'?H-160:OY);
 if(state==='talk'){const pg=dlg.pages[dlgPage],w=tw(dlg.name)+10;
  r('#181020',4,99,232,58);r('#f8f0d8',5,100,230,56);r('#181020',8,90,w,15);r(dlg.col,9,91,w-2,13);text(dlg.name,13,92,2,'#181020',null);
  r('#181020',9,108,40,32);r(dlg.col,10,109,38,30);g.drawImage(dlg.spr,0,0,12,9,11,111,36,27);
  pg.forEach((l,i)=>text(l,54,108+i*15,2,'#281c30',null));if(((time*3)|0)%2){r('#c02848',224,148,5,3);r('#c02848',225,151,3,1);r('#c02848',226,152,1,1)}}
 else if(state==='menu'){ctext('SPROUTS',2,5,'#f8e060','#783010');const it=menuItems(),st=15,y0=35,top=drawList(it,mi,y0,st,7);
  const k=it.indexOf('REWARDS')-top;if(k>=0&&k<7&&dailyReady()&&((time*2)|0)%2)text('!',174,y0+k*st-3,3,'#f86048');
  const rk=rankOf(meta.xp);box(3,142,96,15,'rgba(24,16,32,.88)');text('RANK '+rk[0],6,143,2,'#a8f080');const bx=10+tw('RANK '+rk[0]);r('#504860',bx,148,96-bx,4);r('#a8f080',bx,148,Math.round((96-bx)*rk[1]/rk[2]),4);
  walletBox(142);if(flashT>0){box(0,140,W,19,'rgba(24,16,32,.95)');ctext(flash,143,2,'#f8a060')}}
 else if(state==='rewards'){text('REWARDS',5,1,3,'#f8e060');walletBox(3);const dq=dailies(),N=ACH.length+4;
  const top=Math.max(0,Math.min(N-7,ri-3));
  for(let k=0;k<7;k++){const i=top+k,y=24+k*14,on=i===ri;if(i>=N)break;if(on)r('rgba(248,224,96,.22)',2,y-1,236,14);
   if(i===0){const rdy=dailyReady();petalIcon(6,y+4);text('DAILY GIFT',16,y,2,rdy?'#f8a060':'#a098b0');rtext(rdy?'A: CLAIM':'STREAK '+meta.streak,235,y,2,rdy?'#a8f080':'#a098b0')}
   else if(i<4){const q=dq.q[i-1],d=DQ[q[0]],dn=q[1]>=d[1];r(dn?'#a8f080':'#c8a8f8',6,y+3,6,6);text(d[0],16,y,2,dn?'#a8f080':'#ffffff');rtext(q[1]+' / '+d[1],235,y,2,dn?'#a8f080':'#c8a8f8')}
   else{const a=ACH[i-4],dn=meta.ach[i-4];r(dn?'#a8f080':'#504860',6,y+3,6,6);if(dn){r('#281c30',7,y+6,2,2);r('#281c30',9,y+4,2,2)}text(a[0],16,y,2,dn?'#ffffff':'#a098b0');rtext('+'+a[2],235,y,2,dn?'#a8f080':'#f8c8e0')}}
  r('#281c30',0,123,W,80);const dsc=flashT>0?flash:ri===0?(dailyReady()?'PETALS AND A CAPSULE TICKET, EVERY DAY':'COME BACK TOMORROW FOR MORE'):ri<4?"ERIN'S DAILY ASK: +8 EACH, ALL 3 = TICKET":ACH[ri-4][1];
  ctext(dsc,127,2,flashT>0?'#a8f080':'#fff8c0');ctext(Object.keys(meta.ach).length+' / '+ACH.length+' DONE      B: BACK',143,2,'#a098b0');}
 else if(state==='caps'){text('CAPSULES',5,1,3,'#f8e060');walletBox(3);const c=capS,sh=c.ph==='shake'?Math.round(Math.sin(c.t*40)*2):0,mx=120+sh;
  if(c.ph!=='show'){r('#181020',mx-27,25,54,50);r('#b0e0f8',mx-25,27,50,46);r('#e0f8ff',mx-22,30,6,14);
   [['#f85888',-16,54],['#f8e060',-4,58],['#60b8f8',8,53],['#a070e8',-10,42],['#60d880',4,43],['#f8a040',14,62],['#f8a0c8',-18,64]].forEach(([col,a,b],i)=>{const j=c.ph==='shake'?Math.round(Math.sin(c.t*30+i)*2):0;r('#181020',mx+a-1,b-1+j,10,10);r(col,mx+a,b+j,8,8);r('#ffffff',mx+a,b+j,8,3)});
   r('#181020',mx-31,73,62,36);r('#e23b5e',mx-29,75,58,32);r('#9c1f3c',mx-29,101,58,6);r('#181020',mx-6,82,12,12);r('#f8e060',mx-4,84,8,8);r('#181020',mx-1,84,2,8);r('#181020',mx+12,92,12,10);r('#2a2238',mx+13,93,10,8);
   const left=pool().length;ctext(left?(meta.tix>0?'A: OPEN ONE  (1 TICKET)':'A: OPEN ONE  ('+PULL+' PETALS)'):'YOU HAVE EVERY STYLE!',113,2,'#ffffff');
   if(flashT>0)ctext(flash,127,2,'#f8a060');else ctext('STYLES '+ownCount()+'/'+styTotal+'   ROOTDEEP '+meta.own.rd.length+'/'+RDCAP.length,127,2,'#c8c0d8');
   ctext('COMMON 60 RARE 30 EPIC 10  B: BACK',143,2,'#a098b0');}
  else if(c.it.k==='rd'){const it=RDCAP[c.it.i],ra=RAR[it.r];for(let i=0;i<10;i++){const a=i/10*6.283+c.t;r(ra[1],Math.round(120+Math.cos(a)*(50+Math.sin(c.t*3)*4)),Math.round(56+Math.sin(a)*30),2,2)}
   if(c.t<.4)r('rgba(255,255,255,'+(1-c.t/.4).toFixed(2)+')',0,-OY,W,H);
   /* a little root door with the item's light glowing out of it */
   const lc=it.lan||(it.ch?'#a8f080':it.wp?'#e8ecf5':'#7fd0e8');r('#181020',96,28,48,58);r('#3a2620',98,30,44,54);r('#0b0812',104,40,32,44);
   g.save();g.globalAlpha=.35+.15*Math.sin(time*4);r(lc,106,42,28,40);g.restore();
   if(it.ch)rdKeeperSpr(it.ch,120,78,2);else{r(lc,116,54,8,14);r('#ffffff',118,57,4,6)}
   ctext('ROOTDEEP · '+ra[0],92,2,ra[1]);ctext(it.n,104,3,'#ffffff');ctext(it.d,122,2,'#a8f080');if(c.t>.5&&((time*2)|0)%2)ctext('A: NICE!',140,2,'#c8c0d8');}
  else{const it=c.it,o=STY[it.k][it.i],ra=RAR[o[3]],lab=ROWS.find(q=>q[1]===it.k)[0];for(let i=0;i<10;i++){const a=i/10*6.283+c.t;r(ra[1],Math.round(120+Math.cos(a)*(50+Math.sin(c.t*3)*4)),Math.round(64+Math.sin(a)*34),2,2)}
   if(c.t<.4)r('rgba(255,255,255,'+(1-c.t/.4).toFixed(2)+')',0,-OY,W,H);drawPreview(86,26,68,70);ctext(ra[0],100,2,ra[1]);ctext(o[0]+' '+lab,113,3,'#ffffff');ctext("YOU'RE WEARING IT NOW",131,2,'#a8f080');if(c.t>.5&&((time*2)|0)%2)ctext('A: NICE!',145,2,'#c8c0d8');}}
 else if(state==='style'){text('STYLE',5,1,3,'#f8e060');walletBox(3);
  ROWS.forEach(([lab,key],i)=>{const y=24+i*15,on=i===si,o=look[key],op=STY[key][o],own=meta.own[key].includes(o);if(on)r('rgba(248,224,96,.2)',2,y-1,160,15);
   text(lab,6,y,2,on?'#ffffff':'#a098b0');text((on?'< ':'')+op[0]+(on?' >':''),on?58:66,y,2,!own?'#807890':on?'#f8e060':'#c8c0d8');if(meta.eq[key]===o)r('#a8f080',152,y+4,5,5);});
  drawPreview(166,24,70,86);const key=ROWS[si][1],o=look[key],op=STY[key][o],own=meta.own[key].includes(o);
  ctext(flashT>0?flash:meta.eq[key]===o?'WEARING THIS NOW':own?'A: WEAR IT':(op[3]===3?'BUILT: FINISH A VALLEY PROJECT':RAR[op[3]][0]+': FOUND IN CAPSULES'),116,2,flashT>0?'#f8a060':own?'#a8f080':RAR[op[3]][1]);
  ctext(ownCount()+' / '+styTotal+' COLLECTED',130,2,'#c8c0d8');ctext('D-PAD: BROWSE AND TRY ON      B: BACK',144,2,'#a098b0');}
 else if(state==='bugs'){text('COLLECTION',5,1,3,'#f8e060');rtext(cpage?'<  TREASURES '+meta.trs.length+' / '+TRS.length+'  >':'<  BUGS '+kinds()+' / '+BUGS.length+'  >',236,5,1,'#a8f080');
  if(!cpage)BUGS.forEach((b,i)=>{const x=4+(i%2)*118,y=22+((i/2)|0)*25,n=meta.bugs[i];r('rgba(248,240,216,.12)',x,y,114,23);r(n?'#58b858':'#383048',x+2,y+2,20,19);
   if(n){g.save();g.translate(x+12,y+16);g.scale(2,2);bugArt(i,0,0,((time*6)|0)%2);g.restore();text(b.n,x+26,y+1,2,'#ffffff');text('CAUGHT '+n,x+26,y+12,1,'#a8f080')}
   else{text('?',x+8,y+4,3,'#706888');text(BUG_AT[i],x+26,y+6,1,'#a098b0')}});
  else TRS.forEach((q,i)=>{const x=4+(i%2)*118,y=22+((i/2)|0)*21,has=meta.trs.includes(i);r('rgba(248,240,216,.12)',x,y,114,19);r(has?'#584878':'#383048',x+2,y+2,16,15);
   if(has){trArt(i,x+10,y+10);text(q[0],x+22,y+3,2,'#ffffff')}else{text('?',x+6,y+2,2,'#706888');text('? ? ?',x+22,y+3,2,'#706888')}});
  ctext(cpage?'A NEW SPARKLE HIDES EACH MORNING      B: BACK':'LEFT / RIGHT: TREASURES      B: BACK',149,1,'#a098b0');}
 else if(state==='settings'){text('SETTINGS',5,1,3,'#f8e060');
  [['MUSIC','mus'],['SOUND FX','sfx']].forEach(([lab,k],i)=>{const y=30+i*28,on=seti===i;if(on)r('rgba(248,224,96,.2)',2,y-3,236,26);
   text(lab,8,y,2,on?'#ffffff':'#c8c0d8');rtext(meta[k]?String(meta[k]*10)+'%':'OFF',232,y,2,on?'#f8e060':'#a098b0');
   for(let n=0;n<10;n++){const x=8+n*22,hh=3+n;r('#181020',x,y+22-hh,18,hh);r(n<meta[k]?(on?'#f8e060':'#a8f080'):'#504860',x+1,y+23-hh,16,hh-2)}});
  /* RESET PULLS and BACK share one row (the music panel sits right below) */
  const ry=88,ron=seti===2,bon=seti===3;if(ron)r('rgba(248,224,96,.2)',2,ry-3,140,17);if(bon)r('rgba(248,224,96,.2)',146,ry-3,92,17);
  const rl=resetArm?'A AGAIN = RESET':flashT>0&&/^RESET!|^NOTHING/.test(flash)?flash:'RESET PULLS';
  text(rl,8,ry,2,resetArm||flashT>0&&/^RESET!/.test(flash)?'#f8a060':ron?'#ffffff':'#c8c0d8');text('BACK',Math.round(192-tw('BACK',2)/2),ry,2,bon?'#ffffff':'#c8c0d8');
  r('#281c30',0,108,W,100);text('NOW PLAYING',8,110,1,'#a098b0');
  const t=TRACKS[MUS.cur>=0?MUS.cur:MUS.shown];if(t){r('#181020',7,121,26,26);if(t.img&&t.img.complete)g.drawImage(t.img,8,122,24,24);text(t.title,38,121,2,'#ffffff');text(t.artist,38,134,1,'#c8a8f8');if(MUS.from)rtext(MUS.from,234,110,1,'#706888')}
  else text(TRACKS.length?(meta.mus?'...':'MUSIC IS OFF'):'NO MUSIC LOADED',8,124,2,'#a098b0');
  const pc=pulledCount();ctext(seti===2?(pc?'GIVES BACK '+pc+(pc===1?' ITEM FOR 1 TICKET':' ITEMS FOR '+pc+' TICKETS'):'NO CAPSULE PULLS TO RESET'):((time/4)|0)%2?'NO SOUND ON IPHONE? CHECK THE RING SWITCH':'LEFT / RIGHT: ADJUST      B: BACK',146,2,'#a098b0');}
 else if(state==='map'||state==='hop'){const hp=state==='hop',mx=15,my=18,col=['#58b858','#d8b878','#8a5a3a','#3888e0','#1c5038','#58b858','#c04848'];
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=map[ty*MW+tx];if(t!==TR&&t!==7)r(col[t],mx+tx*3,my+ty*3,3,3)}
  for(const ga of gates)if(ga.alive)ga.tiles.forEach(([tx,ty])=>r(['#f08030','#90f0f8','#c89050','#3888e0'][ga.sub],mx+tx*3,my+ty*3,3,3));
  const dot=(x,y,c,sz=4)=>{const X=Math.round(mx+x*3/16-sz/2),Y=Math.round(my+y*3/16-sz/2);r('#181020',X-1,Y-1,sz+2,sz+2);r(c,X,Y,sz,sz)};
  for(const z of ZONES){const p=postXY(z);dot(p.x,p.y,'#e8c888',2)}
  if(run.spark&&((time*2)|0)%2)dot(run.spark.x,run.spark.y,'#f078c0',3);dot(HX,HY,'#f8e060',5);dot(DOOR.x,DOOR.y-20,'#c04848',5);for(const it of items)if(it.alive&&it.sub==='shard')dot(it.x,it.y,'#f8d030',3);for(const n of npcs)dot(n.x,n.y,n.col);for(const p of PJ)if(pjOpen(p))dot(p.sx,p.sy,pjDone(p)?'#f8d030':'#3870c8',3);
  if(!hp&&OBJ&&((time*3)|0)%2){const X=Math.round(mx+OBJ.x*3/16),Y=Math.round(my+OBJ.y*3/16);r('#f8e060',X-5,Y-5,10,1);r('#f8e060',X-5,Y+4,10,1);r('#f8e060',X-5,Y-5,1,10);r('#f8e060',X+4,Y-5,1,10)}
  if(!hp){const wx=inHome?DOOR.x:P.x,wy=inHome?DOOR.y+10:P.y;if(!inHome)dot(LO.x,LO.y,'#e89040',3);dot(wx,wy,((time*4)|0)%2?'#ffffff':'#f85888',5)}
  else{const a=postXY(hop.z),k=Math.min(1,hop.t/1.2),e2=k*k*(3-2*k),at=q=>[hop.fx+(a.x-hop.fx)*q,hop.fy+(a.y-hop.fy)*q-Math.sin(Math.PI*q)*90];for(let q=0;q<=14;q++)if(q/14<=e2){const p=at(q/14);dot(p[0],p[1],'#fff8e0',1)}const p=at(e2);dot(p[0],p[1],'#f85888',5);dot(a.x,a.y,((time*5)|0)%2?'#f8e060':'#ffffff',4)}
  for(const z of ZONES)if(!run.seen||run.seen[z[0]]||z[0]==='LANTERN FIELD'){const n=z[0].replace("THORNBACK'S ",'').replace("ERIN'S ",'').replace('SUNNY ','').replace('PEBBLE ','').replace(' FIELD','').replace('NORTH ','').replace('DEW ',''),w=tw(n,1);text(n,Math.max(2,Math.min(W-w-2,Math.round(mx+(z[1]+z[3]/2)*3-w/2))),my+(z[2]+z[4])*3-1,1,'#fff8e0')}
  if(hp){ctext('TO '+zName(hop.z[0]),1,3,'#f8e060')}else{text('MAP',5,1,3,'#f8e060');let lx=64;[['WILL','#ffffff'],['LOUIE','#e89040'],['SHARD','#f8d030'],['HOME','#c04848']].forEach(([n,c])=>{r('#181020',lx,5,6,6);r(c,lx+1,6,4,4);text(n,lx+9,3,1,'#c8c0d8');lx+=tw(n,1)+17});
  box(170,146,70,14,'rgba(24,16,32,.9)');text('B: BACK',180,147,2,'#a098b0')}}
 else if(state==='house'){text('HOME',5,1,3,'#f8e060');walletBox(3);const sq=inHome?parked:buds.filter(b=>b.st==='follow'),ns=sq.filter(b=>b.star).length,J=home.jobs,rest=homeTotal()-J[0]-J[1]-J[2],uc=UPCOST[home.up];
  const rows=[['MOVE IN STAR SPROUTS',ns+' HERE'],['MOVE IN 5 SPROUTS',sq.length-ns+' HERE'],['BERRY PICKERS',J[0]],['FLORISTS',J[1]],["LOUIE'S TRAINERS",J[2]],['BUILD A BIGGER HOUSE',uc?uc+' PETALS':'MAX'],['GO TO BED','']];
  rows.forEach(([l,v],i)=>{const y=21+i*13,on=i===hi,job=i>=2&&i<=4;if(on){r('#f8e060',3,y-2,234,14);r('#281c30',4,y-1,232,12)}text(l,9,y-1,2,on?'#ffffff':job?'#a8f080':'#c8c0d8');rtext(job?(on?'<  '+v+'  >':String(v)):v,231,y-1,2,on?'#f8e060':'#a098b0')});
  r('#281c30',0,112,W,100);ctext(flashT>0?flash:['WORKERS EARN GOLD STARS: +12 PETALS EACH','ANY SPROUTS WITH YOU: +2 PETALS EACH','EACH LEAVES 1 NEW SPROUT EVERY MORNING','EACH MAKES 2 PETALS EVERY MORNING','EACH GIVES LOUIE 2 XP EVERY MORNING',uc?'ROOM FOR '+HCAP[home.up+1]+' SPROUTS INSTEAD OF '+homeCap():'NO BIGGER HOUSE TO BUILD','SKIP TO THE EVENING REPORT'][hi],115,2,flashT>0?'#a8f080':'#fff8c0');
  text('LIVING '+homeTotal()+' / '+homeCap(),8,130,2,'#ffffff');rtext('RESTING '+rest,232,130,2,rest?'#f8a060':'#a098b0');
  text('HOME LV '+homeLv(),8,144,2,'#f8a060');ctext('LOUIE LV '+louLv(),144,2,'#e89040');rtext('CREW '+capNow(),232,144,2,'#c8f0a0');}
 else if(state==='build')drawPjBuild();
 else if(state==='travel'){ctext('TRAIL POST',4,4,'#f8e060');ctext('WHERE TO, WILL?',28,2,'#c8c0d8');drawList(tlist.map(z=>zName(z[0])),ti,48,15,6);ctext('A: GO      B: STAY',146,2,'#a098b0');}
 else if(state==='card'){const ls=wrapPx(card.sub,168,2),k=Math.min(1,card.t*5);r('#181020',28,28,184,112);r('#f8f0d8',29,29,182,110);r('#f8e060',29,29,182,18);ctext(card.title,31,2,'#281c30',null);g.save();g.translate(120,74);g.scale(k,k);g.translate(-120,-74);r('#c8e8a0',84,50,72,46);{const sx=ox,sy=oy;ox=oy=0;card.art();ox=sx;oy=sy}g.restore();ls.slice(0,3).forEach((l,i)=>ctext(l,99+i*13,2,'#281c30',null));if(card.t>.45&&((time*2)|0)%2)ctext('A: OK',144,2,'#f8e060')}
 else if(state==='pause'){ctext('PAUSED',2,4,'#f8e060');drawList(['RESUME','MAP','SETTINGS','SAVE AND QUIT TO MENU'],pi,27,14);
  r('#281c30',0,84,W,120);text('MISSIONS',6,87,2,'#f8a060');let y=101,any=false;
  for(const n of npcs)if(n.st==='active'){any=true;const m=n.ms[n.mi],v=Math.min(m.get(),m.goal);text(n.name+': '+m.t,6,y,2,v>=m.goal?'#a8f080':'#ffffff');rtext(v+' / '+m.goal,235,y,2,v>=m.goal?'#a8f080':'#c8c0d8');y+=13}
  if(!any)text(npcs.every(n=>n.st==='done')?'ALL MISSIONS DONE!':'TALK TO ERIN BY THE LANTERN',6,y,2,'#c8c0d8');}
 else if(state==='dayend'){ctext('NIGHT FALLS',6,4,'#b0c8f8');ctext("ERIN'S EVENING REPORT, DAY "+day,32,2,'#c8a8f8');
  ctext('BERRIES BROUGHT HOME:  '+tod.berries,48,2);ctext('FLOWERS PICKED:  '+tod.flowers,60,2);ctext('BUGS CAUGHT:  '+tod.bugs,72,2);
  ctext('EVERYONE IS HOME SAFE.  CREW OF '+buds.length,86,2,'#a8f080');
  {const cnt=TYPES.map((q,t)=>buds.filter(b=>b.type===t).length),sh=cnt.map((n,t)=>t).filter(t=>cnt[t]>0),ws=sh.map(t=>14+tw(String(cnt[t]))+7);let x=Math.round((W-ws.reduce((a,b)=>a+b,0)+7)/2);sh.forEach((t,i)=>{const T=TYPES[t],y=100-Math.round(Math.max(0,Math.sin(time*5+i*1.1))*2);r(T.d,x,y+3,7,7);r(T.c,x+1,y+4,5,5);r(T.l,x+1,y+4,2,1);r('#181020',x+2,y+6,1,2);r('#181020',x+4,y+6,1,2);r('#2c6030',x+3,y+1,1,2);r('#f8a0c8',x+2,y-1,3,2);text(String(cnt[t]),x+10,99,2,T.l);x+=ws[i]})}
  ctext('DAY BONUS:  +'+tod.bonus+' PETALS',115,2,'#f8c8e0');
  ctext(tod.berries+tod.flowers>12?'"What a day, Will!"':tod.berries+tod.flowers>3?'"Nice and steady, Will."':'"A slow day is still a good day."',129,2,'#c8a8f8');if(((time*2)|0)%2)ctext('A: SLEEP',145,2,'#a8f080');}
 else if(state==='win'){r('rgba(40,20,20,.6)',0,24,W,112);ctext('THE LANTERN SHINES!',34,4,'#f8e060','#783010');ctext('WILL, ERIN AND LOUIE DID IT',62,2);ctext('RELIT IN '+day+(day===1?' DAY':' DAYS'),78,2,'#a8f080');ctext('THE GARDEN IS STILL GROWING...',94,2,'#c8a8f8');if(((time*2)|0)%2)ctext('A: KEEP PLAYING',116,2,'#b0e0f8');}
 g.restore();
 if(TRN){const k=TRN.t<.3?1-TRN.t/.3:Math.max(0,(TRN.t-.36)/.32);g.fillStyle='#0c0a12';g.beginPath();g.rect(0,0,W,H);g.arc(W/2,H/2,k*Math.hypot(W,H)/2,0,7,true);g.fill()}
}
/*@include rootdeep.js*//*@include sproutwild*//* ---------- loop ---------- */
function fit(){const p=cv.parentNode||{};let nh=Math.round(240*p.clientHeight/p.clientWidth/2)*2;nh=Math.max(160,Math.min(304,nh||200));if(nh!==H||cv.height!==nh*2||cv.width!==480){H=nh;cv.width=480;cv.height=H*2}VH=Math.ceil(H/Z);}
fit();addEventListener('resize',fit);try{new ResizeObserver(fit).observe(cv.parentNode)}catch(e){}
loadWorld();cloudInit();
let last=0;
function frame(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;
 try{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;if(TBON)TBX=[];draw();if(TBON){TBL=TBX;TBX=null}}catch(err){console.error(err)}
 for(const k in keys)prev[k]=keys[k];
 requestAnimationFrame(frame);}
if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(frame);
window.__g={KO,PP,RD:()=>RD,RDF:()=>RDF,SW:()=>SW,SWF:()=>SWF,tb:{on:v=>{TBON=!!v},last:()=>TBL},
 ev:/[?&]dev\b/.test(location.search)?(s=>eval(s)):undefined,unlock,MUS,update,draw,keys,prev,snap,restore,persist,get s(){return{state,P,LO,buds,sprouts,items,foes,gates,bugs,npcs,plots,gard,shards,day,run,meta,live,SAVE}}};
})();
