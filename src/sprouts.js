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
STY.hat=[['NONE','','',0],['STRAW','#e8c868','',0],['CHEF','#ffffff','',0],['DAISY CROWN','#f8a0c8','',1],['PARTY','#60b8f8','',1],['GOLD CROWN','#f8d030','',2]];
const ROWS=[['CAP','cap'],['COAT','coat'],['FLOWER','flower'],['LOUIE','ban'],['TRAIL','trail'],['HATS','hat']];
const RAR=[['COMMON','#c8c0d8'],['RARE','#60b8f8'],['EPIC','#f8a060']];
const RAINBOW=['#f85888','#f8a040','#f8e060','#60d880','#60b8f8','#a070e8'];
const ACH=[
 ['FIRST SPROUT','PLUCK YOUR FIRST SPROUT',5],['SMALL CREW','HAVE 20 SPROUTS AT ONCE',15],['BIG CREW','HAVE 40 SPROUTS AT ONCE',30],
 ['RAINBOW CREW','FIND ALL 6 SPROUT TYPES',25],['SHARD BEARER','BRING HOME A SUN SHARD',15],['LANTERN KEEPER','RELIGHT THE GREAT LANTERN',50],
 ['SWIFT KEEPER','RELIGHT IT WITHIN 6 DAYS',40],['THORN BREAKER','DEFEAT OLD THORNBACK',40],['BUG SCHOLAR','CATCH ALL 10 KINDS OF BUGS',50],
 ['GOOD BOY','PET LOUIE 10 TIMES',15],['GREEN THUMB','HARVEST 10 FLOWERS',20],['BERRY BARON','BRING HOME 50 BERRIES',25],
 ['HELPING HAND','FINISH 10 MISSIONS',30],['FULL BLOOM','PLUCK 10 BLOOMED SPROUTS',15],['FLOWER FARMER','HARVEST 50 FLOWERS',40],
 ['HEAD GARDENER','OPEN ALL 12 GARDEN BEDS',30],['BEST FRIENDS','PET LOUIE 50 TIMES',30],['BUG FAN','CATCH 25 BUGS',25],
 ['STYLISH','OWN 10 STYLE ITEMS',20],['COLLECTOR','OWN EVERY STYLE ITEM',100],['LUCKY','OPEN 5 CAPSULES',15],
 ['REGULAR','3 DAY GIFT STREAK',20],['DEVOTED','7 DAY GIFT STREAK',50],['BERRY TYCOON','BRING HOME 200 BERRIES',50],
 ['DAILY DOER',"FINISH 10 OF ERIN'S DAILY ASKS",30],['SEASONED','REACH KEEPER RANK 5',30],['ORDER UP',"FILL 5 OF ERIN'S FLOWER ORDERS",25],['MOONLIGHT','GROW A MOONBLOOM',30],
 ['TREASURE HUNTER','FIND 6 TREASURES',30],['CURATOR','FIND EVERY TREASURE',80],['FULL HOUSE','10 SPROUTS LIVING AT HOME',20],['BIG FAMILY','30 SPROUTS LIVING AT HOME',40],['RENOVATOR','UPGRADE YOUR HOUSE',20]];
const DQ={pluck:['PLUCK 12 SPROUTS',12],berry:['BRING HOME 8 BERRIES',8],bug:['CATCH 2 BUGS',2],pet:['PET LOUIE 3 TIMES',3],throw:['THROW 40 SPROUTS',40],flower:['HARVEST 4 FLOWERS',4],grub:['BEAT A GRUB',1]};

/* ---------- saved progress ---------- */
const DEF=()=>({petals:0,xp:0,tix:1,ach:{},own:{cap:[0],coat:[0],flower:[0],ban:[0,4],trail:[0],hat:[0]},eq:{cap:0,coat:0,flower:0,ban:0,trail:0,hat:0},bugs:[0,0,0,0,0,0,0,0,0,0],trs:[],
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
function pool(){const o=[];for(const k in STY)STY[k].forEach((it,i)=>{if(!meta.own[k].includes(i))o.push({k,i,r:it[3]})});return o;}
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
function musWant(){if(state==='off')return'';if(state==='ko')return KO.mus();if(state==='boot')return cart?'':bootT>.35?'menu':'';if(state==='settings')return setFrom==='pause'?'game':'menu';return MENU_ST[state]?'menu':'game';}
const musLevel=()=>Math.pow(meta.mus/10,2)*.85*(state==='pause'||(state==='ko'&&KO&&KO.paused())||(state==='settings'&&setFrom==='pause')?.55:1);
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
try{document.fonts&&document.fonts.load&&document.fonts.load('700 11px "Pixelify Sans"')}catch(e){}
function setF(sc){g.font='700 '+FS[sc]+'px ui-monospace,"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace';g.textBaseline='top';}
function tw(s,sc=2){setF(sc);const m=g.measureText(String(s));return Math.ceil((m&&m.width)||String(s).length*FS[sc]*.6);}
function text(s,x,y,sc=2,c='#fff',sh='#181020'){s=String(s);setF(sc);if(sh){g.lineJoin='round';g.lineWidth=2;g.strokeStyle=sh;g.strokeText(s,x,y);g.fillStyle=sh;g.fillText(s,x+1,y+1)}g.fillStyle=c;g.fillText(s,x,y);}
function ctext(s,y,sc=2,c,sh){const w=tw(s,sc);if(w>W-6){g.save();g.translate(3,0);g.scale((W-6)/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round((W-w)/2),y,sc,c,sh);}
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
function louSay(s,t=2.4){if(typeof LO!=='undefined'&&LO)LO.say={s,t}}
const dogRows=['.kk..kk.........','.kok.kok....kkk.','.koookok...koeek','kooooookkkkkoek.','kokoooooooooook.','keeoooooooooook.','kkeeooooooooook.','.keeeooooooeeek.','..kek.kek.kek.ke','..kkk.kkk.kkk.kk'];
const DOG={l:mk(dogRows,{k:'#30201c',o:'#e89040',e:'#fff0d8'})};DOG.r=flip(DOG.l);
const DOGW={l:mk(dogRows,{k:'#ffffff',o:'#ffffff',e:'#ffffff'})};DOGW.r=flip(DOGW.l);

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
let manT=0,needT=-1,inHome=false,parked=[],resid=[],cineI=0,cineT=0,cpage=0;
let introT=0,home={res:Array(NT).fill(0),jobs:[0,0,0],up:0},hi=0;
const DOOR={x:33*16+8,y:17*16+2};
const homeTotal=()=>home.res.reduce((a,b)=>a+b,0),homeLv=()=>Math.min(10,(homeTotal()/5)|0),capNow=()=>CAP+5*homeLv()+2*(rankOf(meta.xp)[0]-1);
const HCAP=[10,20,35,50],UPCOST=[150,400,900],homeCap=()=>HCAP[home.up|0];
const LOU_AT=[0,15,40,80,140,220],LOU_AB=['FETCHES LOST SPROUTS','SHARP NOSE: MORE BERRIES','PACK LEADER: FETCHES GROUPS','DOGGY PADDLE: FETCHES FROM WATER','GUARD DOG: SCARES GRUBS','TREASURE HOUND: FINDS TICKETS'];
const louLv=()=>{let k=1;for(let i=1;i<LOU_AT.length;i++)if(meta.dog.xp>=LOU_AT[i])k=i+1;return k};
function louXP(n){const a=louLv();meta.dog.xp+=n;const b=louLv();if(b>a){toast('LOUIE REACHED LEVEL '+b+'!');louSay('NEW TRICK!',3);say('LOUIE LEARNED '+LOU_AB[b-1],6);snd(784,.1);later(()=>snd(1175,.25),110);save()}}
let state='off',bootT=0,bootDing=false,mi=0,ri=0,si=0,pi=0,look=null,dlg=null,dlgPage=0,toasts=[],flash='',flashT=0,cartSel=0,capS={ph:'idle',t:0,it:null},eraseArm=0,seti=0,setFrom='menu';
const say=(s,t=4)=>{msg=s;msgT=t};
/* ---------- cartridge 2: North Coast Knockout (src/knockout.js) ---------- */
let cart=0;
const KO=window.KO_CART?window.KO_CART({g,W,H:()=>H,r,text,ctext,tw,snd,noise,keys,pressed,mk,flip,ac:()=>ac,meta:()=>meta,eject:()=>eject(),hasTracks:n=>TRACKS.some(t=>t.use.includes(n))}):null;
const PAD=[['act','call','swap','pause'],['light','heavy','super','pause']];
function setPad(i){try{const q=(s,t)=>{const e=document.querySelector(s);if(e)e.textContent=t},L=PAD[i]||PAD[0];q('#bA span',L[0]);q('#bB span',L[1]);q('#bSel small',L[2]);q('#bSta small',L[3]);const cs=$('console');if(cs)cs.classList.toggle('ko',i===1);const sl=$('bSel');if(sl)sl.classList.remove('ready')}catch(e){}}
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
 gates.push({kind:'ga',id,sub,tiles,hp:sub?45:30,max:sub?45:30,alive:true,on:[],x:cx,y:cy});}
function openGate(ga,fx){ga.alive=false;ga.tiles.forEach(([x,y])=>{map[y*MW+x]=(x===28||y===20)?D:G;if(fx)puff(x*16+8,y*16+8,['#f08030','#90f0f8','#c89050'][ga.sub],8,45)});
 ga.on.slice().forEach(b=>{b.tgt=null;b.z=0;b.st=d2(b,P.x,P.y)<80*80?'follow':'idle'});ga.on.length=0;fields();}
function mkItem(sub,x,y){const def={berry:{w:1,seeds:1,r:4},big:{w:3,seeds:3,r:7},husk:{w:2,seeds:2,r:5},shard:{w:4,seeds:0,r:6}}[sub];const it={kind:'it',sub,x,y,alive:true,on:[],...def};items.push(it);return it;}
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
function syncBeds(){const n=bedCount();while(plots.length<n){const [tx,ty]=BEDS[plots.length];map[ty*MW+tx]=S;plots.push({kind:'plot',x:tx*16+8,y:ty*16+9,r:5,alive:true,on:[],st:0,dry:true,t:0,flower:0,prog:0,claim:0});}}
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
   {id:'r4',t:'BEAT OLD THORNBACK',say:"Old Thornback naps down south on the last shard. Bring a big crew, and lots of Embers.",get:()=>run.boss?1:0,goal:1,rw:50,tk:1}]),
  N('SCOUT',40,22,'#a8f080',['#3c8840','#78c870','#b89858','#e0c888'],
   "I study the critters out here. Want to help?","My notebook is full. Check your Collection in the main menu!",[
   {id:'s1',t:'FIND A ZIP',say:"Yellow Zip sprouts grow in the far corner of this field. Zips are the fastest sprouts there are.",get:()=>found[3]?1:0,goal:1,rw:10},
   {id:'s2',t:'CATCH A BUG',say:"Throw a sprout at a bug to catch it. Ladybugs are slow. Butterflies need someone quick, like a Zip.",get:()=>run.bugs,goal:1,rw:10},
   {id:'s3',t:'BEAT 2 GRUBS',wake:1,say:"Purple grubs spook sprouts back into the soil. Throw a bunch at one at once. Embers hit hardest.",get:()=>run.foes,goal:2,rw:20},
   {id:'s4',t:'CATCH 4 KINDS OF BUGS',say:"Some bugs only come out at dusk, and one lives over water. Catch 4 different kinds.",get:()=>kinds(),goal:4,rw:30,tk:1}]),
  N('MARCUS',17,23,'#78c8f8',['#284878','#5080b8','#e88020','#f8c060'],
   "Water everywhere. Lucky for you, water is my kind of problem.","All dry on my end. Go enjoy that lantern.",[
   {id:'m1',t:'FIND A DEW',say:"Blue Dews grow along the north shore. They swim. Nobody else does.",get:()=>found[2]?1:0,goal:1,rw:10},
   {id:'m2',t:'BRING THE ISLAND SHARD',say:"There's a shard on that island. Throw Dews at the water and they'll swim out and carry it home.",get:()=>run.isle?1:0,goal:1,rw:30},
   {id:'m3',t:'CATCH A DRAGONFLY',say:"See the dragonflies over the pond? Only a Dew can reach one.",get:()=>meta.bugs[3]?1:0,goal:1,rw:20,tk:1}])];
}
function init(){
 map=new Uint8Array(MW*MH).fill(TR);
 carve(21,15,14,11);carve(35,19,4,3);carve(39,13,14,13);carve(47,15,3,2,WA);carve(43,19,2,2,TR);
 carve(27,10,3,5);carve(19,2,18,8);carve(18,19,3,3);carve(3,12,15,15);carve(5,14,11,11,WA);carve(9,18,3,3);
 carve(27,26,3,5);carve(19,31,18,7);carve(40,3,12,7);carve(45,10,2,3);
 carve(53,19,2,3);carve(55,14,13,12);carve(59,19,2,2,TR);carve(64,16,2,2,TR);carve(61,23,2,1,WA);carve(4,27,2,3);carve(3,30,13,9);carve(3,33,13,2,D);carve(3,35,13,4,WA);
 for(let x=18;x<=67;x++)if(map[20*MW+x]===G)map[20*MW+x]=D;
 for(let y=3;y<=36;y++)if(map[y*MW+28]===G)map[y*MW+28]=D;
 for(let y=7;y<=13;y++){map[y*MW+45]=D;map[y*MW+46]=D}
 carve(25,22,7,3,S);carve(32,15,3,2,6);carve(45,30,11,7,7);home={res:Array(NT).fill(0),jobs:[0,0,0],up:0};
 gates=[];mkGate(0,[[27,12],[28,12],[29,12]],'northBramble');mkGate(1,[[19,19],[19,20],[19,21]],'westCrystal');mkGate(1,[[27,27],[28,27],[29,27]],'southCrystal');mkGate(0,[[27,29],[28,29],[29,29]],'southBramble');mkGate(2,[[45,11],[46,11]],'gardenFence');
 buds=[];sprouts=[];items=[];foes=[];bugs=[];parts=[];trail=[];squad=[];toasts=[];plots=[];
 P={x:HX,y:HY+22,dx:0,dy:1,anim:0,stun:0,kx:0,ky:0,pluck:0,pl:null,mv:false,idle:0,tr:0};
 LO={x:HX-22,y:HY+26,sx:HX-22,sy:HY+26,st:'follow',t:0,tt:0,dt:0,fx:1,mv:false,cd:1,bark:3,alert:0,dig:R(25,40),tg:null,tx:0,ty:0};
 run={grubs:false,plucked:0,delivered:0,bloom:0,pets:0,foes:0,bugs:0,maxCrew:0,boss:false,isle:false};
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
 spawns.forEach(s=>s.id=s.k+(s.sp===undefined?'':s.sp)+'@'+s.x+','+s.y); /* save ids: append new spawns at the end only */
 respawn();
 mkItem('shard',...c(51,19));const s2=mkItem('shard',...c(34,4));s2.w=6;const s3=mkItem('shard',...c(10,19));s3.w=5;s3.isle=true;
 mkFoe(...c(28,35),true);
 for(let i=0;i<6;i++){const [x,y]=soilSpot();mkSprout(0,x,y,8)}
 for(let i=0;i<5;i++)mkSprout(1,(21+i)*16+8,4*16+8,0);
 for(let i=0;i<5;i++)mkSprout(2,(6+i*2)*16+8,12*16+10,0);
 for(let i=0;i<3;i++)mkSprout(2,(6+i*3)*16+8,34*16+10,0);for(let i=0;i<4;i++)mkSprout(5,(58+i*2)*16+8,15*16+4,0);for(let i=0;i<4;i++)mkSprout(4,(45+i)*16+8,3*16+6,0);
 [[51,24],[52,24],[51,25],[52,25]].forEach(([x,y])=>mkSprout(3,x*16+8,y*16+6,0));
 mkNPCs();syncBeds();
 sel=0;day=1;dayT=0;shards=0;wr=0;aT=0;winT=0;duskSaid=false;found=Array(NT).fill(false);
 cam={x:P.x-W/2,y:P.y-H/2};cur={x:P.x,y:P.y+56};msg='';msgT=0;inHome=false;parked=[];newSpark();
}
function respawn(){for(const s of spawns){if((s.ref&&s.ref.alive)||(s.k==='grub'&&!run.grubs))continue;const x=s.x*16+8,y=s.y*16+8;s.ref=s.k==='grub'?mkFoe(x,y,false):s.k==='bug'?mkBug(s.sp,x,y):mkItem(s.k,x,y);}}
function openGarden(fx){if(gard.open)return;gard.open=true;if(!gard.order)newOrder();openGate(gates[4],fx);const e=npcs[0];e.x=46*16+8;e.y=5*16+8;}

/* ---------- save / load of the run ---------- */
const LEGACY_NPC={ERIN:['e1','e2','e3','e4','e5','e6','e7','e8','e9'],RANGER:['r1','r2','r3','r4'],SCOUT:['s1','s2','s3','s4'],MARCUS:['m1','m2','m3']};
const LEGACY_GATES=['northBramble','westCrystal','southCrystal','southBramble','gardenFence'];
function snap(){const sid=o=>{const q=spawns.find(q=>q.ref===o);return q?q.id:''},G2={},N2={};
 gates.forEach(q=>G2[q.id]=[q.alive?1:0,Math.round(q.hp)]);npcs.forEach(n=>N2[n.name]=[n.st==='done'?'':n.ms[n.mi].id,n.st]);
 return{v:3,day,dayT:Math.round(dayT),shards,found,sel,run,tod,won,px:(inHome?DOOR.x:P.x)|0,py:(inHome?DOOR.y+12:P.y)|0,gates:G2,npcs:N2,
 sprouts:sprouts.map(q=>[q.type,q.x|0,q.y|0,Math.round(q.age)]),buds:buds.map(b=>[b.type,b.stage,b.gard?1:0,b.x|0,b.y|0,Math.round(b.xp||0)]),home,
 items:items.filter(q=>q.alive).map(q=>[q.sub,q.x|0,q.y|0,q.w,q.isle?1:0,sid(q)]),foes:foes.filter(e=>e.alive).map(e=>[e.hx,e.hy,e.boss?1:0,Math.round(e.hp),sid(e)]),
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
 o.items.forEach(q=>{const it=mkItem(q[0],q[1],q[2]);it.w=q[3];it.isle=!!q[4];const sp=spawns.find(k=>k.id===q[5]);if(sp)sp.ref=it});
 o.foes.forEach(q=>{const e=mkFoe(q[0],q[1],!!q[2]);e.hp=q[3];const sp=spawns.find(k=>k.id===q[4]);if(sp)sp.ref=e});
 plots=[];syncBeds();(o.plots||[]).forEach((q,i)=>{const p=plots[i];if(p){p.st=q[0];p.dry=!!q[1];p.t=q[2];p.flower=Math.min(FLOWERS.length-1,q[3]|0)}});
 if(gard.open&&!gard.order)newOrder();
 fields();cam.x=P.x-W/2;cam.y=P.y-H/2;}
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
 if(gard.open)for(const p of plots)if(needs(p)&&!p.on.length&&p.claim<time){const d=d2(p,b.x,b.y);if(d<bd){bd=d;best=p}}
 for(const ga of gates)if(ga.alive){const d=gtile(ga,b).d;if(ga.sub!==b.type){if(d<900)wrong=ga;continue}if(d<bd){bd=d;best=ga}}
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
function exitHome(){inHome=false;P.x=DOOR.x;P.y=DOOR.y+12;P.dx=0;P.dy=1;parked.forEach(b=>{if(b.st==='park')b.st='follow'});parked=[];LO.st='follow';LO.x=LO.sx=P.x-20;LO.y=LO.sy=P.y+4;trail=[];cam.x=P.x-W/2;cam.y=P.y-H/2;noise(.06,.3,500,'lowpass');}
function newSpark(){run.spark=null;const un=TRS.map((q,i)=>i).filter(i=>!meta.trs.includes(i));if(!un.length)return;const zs=ZONES.filter(z=>(run.seen&&run.seen[z[0]])||z[0]==='LANTERN FIELD');
 for(let k=0;k<40;k++){const z=zs[(Math.random()*zs.length)|0],tx=z[1]+((Math.random()*z[3])|0),ty=z[2]+((Math.random()*z[4])|0);if(map[ty*MW+tx]===G&&d2({x:tx*16+8,y:ty*16+8},HX,HY)>60*60){run.spark={x:tx*16+8,y:ty*16+8,i:un[(Math.random()*un.length)|0]};return}}}
let sniffT=0;

/* ---------- objectives ---------- */
const SOIL={x:456,y:376},GARD={x:46*16,y:6*16+8};
const near=(list,ok)=>{let b=null,bd=1e12;for(const o of list)if(ok(o)){const d=d2(o,P.x,P.y);if(d<bd){bd=d;b=o}}return b};
const nearBerry=()=>near(items,i=>i.alive&&(i.sub==='berry'||i.sub==='big'))||SOIL;
const nearShard=()=>near(items,i=>i.alive&&i.sub==='shard')||near(foes,e=>e.alive&&e.boss)||{x:HX,y:HY};
const nearBug=()=>near(bugs,q=>q.alive&&!q.hid)||{x:42*16,y:18*16};
const AT={e1:()=>near(sprouts,()=>true)||SOIL,e2:nearBerry,e3:()=>LO,e4:()=>SOIL,e5:()=>GARD,e6:()=>GARD,e7:nearBerry,e8:nearShard,e9:()=>GARD,e10:()=>GARD,e11:()=>DOOR,
 r1:()=>gates[0],r2:()=>({x:23*16+8,y:4*16+8}),r3:()=>gates[1],r4:()=>near(foes,e=>e.alive&&e.boss)||nearShard(),
 s1:()=>({x:51*16+8,y:24*16+8}),s2:nearBug,s3:()=>near(foes,e=>e.alive&&!e.boss)||{x:44*16,y:16*16},s4:nearBug,
 m1:()=>({x:10*16,y:12*16+10}),m2:()=>near(items,i=>i.alive&&i.isle)||{x:HX,y:HY},m3:()=>({x:7*16+8,y:16*16+8})};
let OBJ=null,objT=0;
function tracked(){const e=npcs[0];if(e.st!=='done')return e;return npcs.find(n=>n.st==='active')||npcs.find(n=>n.st==='new')||null;}
function objective(){const n=tracked();if(!n)return null;if(n.st==='new')return{text:'TALK TO '+n.name,x:n.x,y:n.y,done:false,col:n.col};
 const m=n.ms[n.mi],v=Math.min(m.get(),m.goal);if(v>=m.goal)return{text:'DONE! GO SEE '+n.name,x:n.x,y:n.y,done:true,col:n.col};
 const p=(AT[m.id]&&AT[m.id]())||n;return{text:m.t+':  '+v+' / '+m.goal,x:p.x,y:p.y,done:false,col:n.col};}
const ZONES=[['LANTERN FIELD',21,15,14,11,26,17],['BERRY FIELD',39,13,14,13,40,18],['NORTH MEADOW',19,2,18,8,26,8],["ERIN'S GARDEN",40,3,12,7,40,8],['DEW POND',3,12,15,15,17,18],["THORNBACK'S HOLLOW",19,31,18,7,26,31],['SUNNY ORCHARD',55,14,13,12,56,18],['PEBBLE BEACH',3,30,13,9,8,31]];
const postXY=z=>({x:z[5]*16+8,y:z[6]*16+10});let tlist=[],ti=0;
function travelTo(z){const p=postXY(z);P.x=p.x;P.y=p.y+14;P.dx=0;P.dy=1;P.stun=0;trail=[];let k=0;buds.forEach(b=>{if(b.st==='follow'||b.st==='ride'){b.st='follow';b.z=0;b.x=P.x+((k%7)-3)*6;b.y=P.y+8+((k/7)|0)*5;if(!free(b.x,b.y,b.type===2)){b.x=P.x;b.y=P.y}k++}});
 LO.riders=[];LO.st='follow';LO.x=LO.sx=P.x+18;LO.y=LO.sy=P.y+2;if(!free(LO.x,LO.y,false)){LO.x=LO.sx=P.x;LO.y=LO.sy=P.y}cam.x=Math.max(0,Math.min(MW*16-W,P.x-W/2));cam.y=Math.max(0,Math.min(MH*16-H,P.y-H/2));zone=z[0];zoneT=2.2;state='play';noise(.35,.12,700,'lowpass');snd(440,.25,880,'triangle',.06);louSay('WHEE!')}
let zone='',zoneT=0;
function zoneTick(dt){if(zoneT>0)zoneT-=dt;const tx=P.x>>4,ty=P.y>>4;for(const z of ZONES)if(tx>=z[1]&&tx<z[1]+z[3]&&ty>=z[2]&&ty<z[2]+z[4]){if(zone!==z[0]){zone=z[0];zoneT=2.2;run.seen=run.seen||{};run.seen[z[0]]=1}return}}

/* ---------- talking ---------- */
function wakeGrubs(){if(run.grubs)return;run.grubs=true;respawn();}
function talk(n){const L=[],M=n.ms,offer=m=>{L.push(m.say);if(m.wake)wakeGrubs();if(m.garden)openGarden(true)};
 if(n.st==='new'){L.push(n.intro);offer(M[0]);n.st='active';}
 else if(n.st==='active'){const m=M[n.mi],v=m.get();
  if(v>=m.goal){meta.life.missions++;if(m.tk)meta.tix++;earn(m.rw);L.push(['Nicely done','You did it','Perfect','Lovely work'][n.mi%4]+(n.name==='ERIN'?', Will':'')+'! Here, take '+m.rw+' petals'+(m.tk?' and a capsule ticket.':'.'));n.mi++;snd(660,.08);later(()=>snd(990,.2),90);
   if(n.mi<M.length)offer(M[n.mi]);else{n.st='done';L.push(n.bye)}checkAch();}
  else L.push(m.hint||m.say,m.t+': '+Math.min(v,m.goal)+' / '+m.goal);}
 else L.push(n.name==='ERIN'?[n.bye,"Louie's been helping himself to the daisies again. I'm pretending I haven't noticed.","The moonblooms only open properly at dusk. Stick around this evening, Will.","If you ever want a quiet job, the garden always needs gardeners."][(day+run.pets)%4]:n.bye);
 const pages=[];for(const p of L){const w=wrapPx(p,178);for(let i=0;i<w.length;i+=3)pages.push(w.slice(i,i+3))}
 dlg={name:n.name,col:n.col,spr:n.spr,pages};dlgPage=0;state='talk';snd(440,.05);}
const npcMark=n=>n.st==='new'?1:n.st==='active'&&n.ms[n.mi].get()>=n.ms[n.mi].goal?2:0;

/* ---------- cartridge shelf (DOM) ---------- */
const shelf=$('shelf'),carts=[...shelf.querySelectorAll('.cart')];let cartAnim=null,inserting=false;
function cartHi(i){cartSel=i;carts.forEach((c,n)=>c.classList.toggle('sel',n===i));}
function cartPick(i){if(inserting)return;cartHi(i);const c=carts[i];
 if(i>1||(i===1&&!KO)){$('shelfMsg').textContent='That one is not out yet';c.classList.remove('nope');void c.offsetWidth;c.classList.add('nope');snd(140,.1);return;}
 inserting=true;const a=c.getBoundingClientRect(),s=$('slot').getBoundingClientRect(),d=a.top-s.bottom,dx=(s.left+s.width/2)-(a.left+a.width/2);
 const done=()=>{inserting=false;shelf.hidden=true;$('slot').classList.add('in');$('led').classList.add('on');cart=i;setPad(i);bootT=0;bootDing=false;state='boot';};
 if(c.animate){cartAnim=c.animate([{transform:'translate(0,-4px)',clipPath:'inset(0 0 0 0)'},{transform:`translate(${dx}px,${-d}px)`,clipPath:'inset(0 0 0 0)',offset:.55},{transform:`translate(${dx}px,${-d-a.height}px)`,clipPath:'inset(100% 0 0 0)'}],{duration:950,easing:'ease-in-out',fill:'forwards'});
  noise(.5,.07,900,'lowpass');later(()=>noise(.025,.2,3000),500);later(cartSnap,880);cartAnim.onfinish=done;}else{cartSnap();done()}}
function eject(){persist(true);if(cartAnim){cartAnim.cancel();cartAnim=null}$('slot').classList.remove('in');$('led').classList.remove('on');$('shelfMsg').textContent='Pick a cartridge';shelf.hidden=false;state='off';cart=0;setPad(0);snd(200,.1,90);}
carts.forEach((c,i)=>c.addEventListener('pointerdown',e=>{e.preventDefault();unlock();cartPick(i)}));
(()=>{const a=$('cartArt');if(!a||!a.getContext)return;const x=a.getContext('2d'),p=(c,X,Y,w,h)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};
 p('#88d0f8',0,0,40,12);p('#58b858',0,12,40,14);p('#3c9848',0,12,40,1);p('#f8e060',17,3,6,7);p('#282038',16,2,8,1);p('#282038',19,10,2,6);
 [['#f07830',6],['#48a0f0',27],['#f0d020',33],['#98a0b0',11]].forEach(([c,X],i)=>{const Y=17+(i%2)*2;p('#282038',X-1,Y-1,7,7);p(c,X,Y,5,5);p('#181020',X+1,Y+2,1,2);p('#181020',X+3,Y+2,1,2);p('#f8a0c8',X+1,Y-4,3,3);p('#2c6030',X+2,Y-2,1,1)});})();

/* ---------- update ---------- */
function nav(i,n){if(pressed('down')){snd(520,.04);return(i+1)%n}if(pressed('up')){snd(520,.04);return(i+n-1)%n}return i;}
const menuItems=()=>(live?['CONTINUE','NEW GAME']:['PLAY']).concat(['REWARDS','CAPSULES','STYLE','COLLECTION','SETTINGS','SWAP CARTRIDGE']);
function update(dt){
 time+=dt;musTick(dt);if(msgT>0)msgT-=dt;sndT-=dt;if(flashT>0)flashT-=dt;
 if(toasts.length){toasts[0].t-=dt;if(toasts[0].t<=0)toasts.shift()}
 switch(state){
 case 'off':if(pressed('right'))cartHi((cartSel+1)%3);if(pressed('left'))cartHi((cartSel+2)%3);if(pressed('a')||pressed('start'))cartPick(cartSel);return;
 case 'boot':bootT+=dt;if(bootT>1.15&&!bootDing){bootDing=true;snd(988,.1);later(()=>snd(1319,.4),100)}if(bootT>2.7||(bootT>.6&&pressed('a'))){if(cart===1){state='ko';KO.start()}else{state='intro';introT=0}}return;
 case 'ko':KO.update(dt);return;
 case 'cine':cineT+=dt;if(pressed('start')){state='play';talk(npcs[0]);return}
  if(pressed('a')||pressed('b')){if(cineT*38<CINE[cineI].length)cineT=99;else if(++cineI>=CINE.length){state='play';talk(npcs[0])}else{cineT=0;snd(440,.04)}}return;
 case 'intro':introT+=dt;if((introT>4.6&&(cloudDone||introT>8))||(introT>1&&(pressed('a')||pressed('start')))){state='menu';mi=0;snd(660,.08,990)}return;
 case 'menu':{const it=menuItems(),was=mi;mi=nav(mi,it.length);if(mi!==was)eraseArm=0;
  if(!live){cam.x=HX-W/2+Math.cos(time*.15)*60;cam.y=HY-H/2+Math.sin(time*.2)*30}
  if(pressed('a')||pressed('start')){const k=it[mi];snd(660,.08,990);
   if((k==='CONTINUE'||k==='PLAY'||k==='NEW GAME')&&!cloudDone&&time<9){flash='CHECKING FOR YOUR SAVE...';flashT=1.5;return}
   if(k==='CONTINUE'){state='play';if(awayMsg){toast('WHILE YOU WERE AWAY:  +'+awayMsg+' IN THE BASKET');awayMsg=0}}
   else if(k==='NEW GAME'&&!eraseArm){eraseArm=1;flash='PRESS A AGAIN TO START OVER';flashT=4}
   else if(k==='PLAY'||k==='NEW GAME'){eraseArm=0;flashT=0;init();live=true;state='cine';cineI=0;cineT=0;persist(true)}
   else if(k==='REWARDS'){state='rewards';ri=0}else if(k==='CAPSULES'){state='caps';capS={ph:'idle',t:0,it:null}}else if(k==='STYLE'){state='style';si=0;look={...meta.eq}}else if(k==='BUG BOOK'||k==='COLLECTION'){state='bugs';cpage=0}else if(k==='SETTINGS'){state='settings';setFrom='menu';seti=0}else eject();}
  return;}
 case 'rewards':ri=nav(ri,ACH.length+4);if(pressed('a')&&ri===0){if(dailyReady()){const a=claimDaily();metaAch();flash='+'+a+' PETALS AND A TICKET!  STREAK '+meta.streak;flashT=3.5;snd(784,.1);later(()=>snd(1046,.2),100)}else snd(140,.08)}
  if(pressed('b')||pressed('start')){state='menu'}return;
 case 'caps':{const c=capS;c.t+=dt;
  if(c.ph==='idle'){if(pressed('b')||pressed('start')){state='menu';return}
   if(pressed('a')){if(!pool().length){flash='YOU HAVE EVERYTHING!';flashT=2.5;snd(140,.1)}
    else if(meta.tix>0||meta.petals>=PULL){if(meta.tix>0)meta.tix--;else meta.petals-=PULL;c.it=pullOne();c.ph='shake';c.t=0;meta.life.pulls++;snd(200,.5,500)}
    else{flash='NEED A TICKET OR '+PULL+' PETALS';flashT=2.5;snd(140,.1)}}}
  else if(c.ph==='shake'){if(c.t>1.3){c.ph='show';c.t=0;const it=c.it;meta.own[it.k].push(it.i);meta.eq[it.k]=it.i;applyLook(meta.eq);metaAch();save();snd(784,.1);later(()=>snd(988,.1),100);later(()=>snd(1319,.3),200)}}
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
 case 'travel':ti=nav(ti,tlist.length);if(pressed('b')||pressed('start'))state='play';else if(pressed('a'))travelTo(tlist[ti]);return;
 case 'settings':{seti=nav(seti,3);const k=['mus','sfx'][seti];
  if(k&&(pressed('right')||pressed('left'))){const v=Math.max(0,Math.min(10,meta[k]+(pressed('right')?1:-1)));if(v!==meta[k]){meta[k]=v;save();if(k==='sfx')snd(660,.07,990);else snd(520,.04)}}
  if(pressed('b')||pressed('start')||(seti===2&&pressed('a')))state=setFrom;return;}
 case 'dayend':if(pressed('a')||pressed('start'))newDay();return;
 case 'win':if(pressed('a')||pressed('start')){state='play';persist(true)}return;
 }
 if(pressed('start')){persist(true);state='pause';pi=0;return;}
 dayT+=dt;saveT+=dt;if(saveT>6){saveT=0;persist()}
 if(!duskSaid&&dayT>DAYLEN*.82){duskSaid=true;say("SUN'S GOING DOWN. NO RUSH.",5);snd(440,.3,220,'triangle',.08)}
 if(dayT>=DAYLEN){endDay();return;}
 if(winT>0){winT-=dt;if(winT<=0){won=true;state='win';return}}
 achT-=dt;if(achT<=0){achT=.5;checkAch()}
 objT-=dt;if(objT<=0){objT=.3;OBJ=objective()}zoneTick(dt);
 // player
 const mx=keys.right-keys.left,my=keys.down-keys.up;P.mv=false;
 if(P.stun>0){P.stun-=dt;moveEnt(P,P.kx*dt,P.ky*dt,4,false);}
 else if(P.pluck>0){P.pluck-=dt;if(P.pluck<=0)finishPluck();}
 else if(mx||my){const l=Math.hypot(mx,my);P.dx=mx/l;P.dy=my/l;moveEnt(P,P.dx*64*dt,P.dy*64*dt,4,false);P.anim+=dt;P.mv=true;
  const tr=STY.trail[meta.eq.trail];P.tr-=dt;if(tr[1]&&P.tr<=0){P.tr=.11;parts.push({x:P.x+R(-3,3),y:P.y+2,vx:R(-6,6),vy:-R(4,14),life:R(.5,.9),c:tr[1],gh:tr[0]==='HEARTS'?2:tr[0]==='STARS'?3:tr[0]==='BUBBLES'?4:5})}}
 P.idle=P.mv?0:P.idle+dt;
 if(inHome){updRes(dt);if(P.y>RY+104&&my>0){exitHome();return}}
 else if(run.spark){const d=d2(P,run.spark.x,run.spark.y);if(d<13*13){const i=run.spark.i;run.spark=null;if(!meta.trs.includes(i))meta.trs.push(i);toast('TREASURE: '+TRS[i][0]+'   +15');earn(15);louSay('DUG IT UP!',3);LO.st='sit';LO.t=1.2;puff(P.x,P.y,'#f8e060',10,45);snd(784,.1);later(()=>snd(1175,.12),100);later(()=>snd(1568,.25),200);checkAch()}
  else if(d<120*120){sniffT-=dt;if(sniffT<=0){sniffT=7;louSay('SNIFF SNIFF...')}}}
 const push=(x,y,rad)=>{const d=Math.sqrt(d2(P,x,y));if(d<rad&&d>0){P.x=x+(P.x-x)/d*rad;P.y=y+(P.y-y)/d*rad}};
 push(HX,HY-2,9);for(const n of npcs)push(n.x,n.y,8);
 if(!trail.length||d2(P,trail[0].x,trail[0].y)>16){trail.unshift({x:P.x,y:P.y});if(trail.length>70)trail.pop();}
 if(gard.open&&gard.basket>0&&d2(P,46*16,7*16+8)<15*15){toast('GARDEN BASKET  +'+gard.basket);earn(gard.basket);gard.basket=0;snd(700,.08,1100)}
 // cursor with gentle snap
 let cx=P.x+P.dx*56,cy=P.y+P.dy*56,sb=26*26,sn=null;
 const tryS=(x,y,o)=>{const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);if(d<sb&&d2(P,x,y)<70*70){sb=d;sn={x,y,o}}};
 foes.forEach(e=>e.alive&&tryS(e.x,e.y,e));items.forEach(i=>i.alive&&tryS(i.x,i.y,i));gates.forEach(ga=>ga.alive&&ga.sub<2&&tryS(ga.x,ga.y,ga));bugs.forEach(q=>q.alive&&!q.hid&&tryS(q.x,q.y,q));
 if(gard.open)plots.forEach(p=>needs(p)&&!p.on.length&&tryS(p.x,p.y,p));
 const signNear=gard.open&&facing(SIGN,24);
 if(sn){cx=sn.x;cy=sn.y}cur.x=cx;cur.y=cy;
 petOK=LO.st==='follow'&&P.idle>.3&&!sn&&!signNear&&facing(LO,26);
 squad=buds.filter(b=>b.st==='follow');
 if(pressed('sel')){cycleSel();manT=4}
 // the right sprout steps up on its own, unless Select was pressed a moment ago
 if(manT>0)manT-=dt;needT=-1;{const o=sn&&sn.o;let pref=null;
  if(o){if(o.kind==='ga')pref=[o.sub];else if(o.kind==='en')pref=[0,1,5,4,3,2];else if(o.kind==='bug')pref=BUGS[o.sp].water?[2]:[3,2,4,0,5,1];
   else if(o.kind==='plot')pref=o.st>0&&o.st<4?[2,4,0,1,3,5]:[4,2,0,3,5,1];else if(o.kind==='it')pref=o.isle||tileAt(o.x,o.y)===WA?[2]:o.w>=3?[1,0,5,3,4,2]:[5,3,0,4,2,1]}
  else if(tileAt(cx,cy)===WA)pref=[2];
  if(pref){const have=pref.find(t=>squad.some(b=>b.type===t));if(have===undefined){if(pref.length===1&&o)needT=pref[0]}else if(manT<=0||pref.length===1)sel=have}}
 if(keys.a){if(pressed('a')){doA(true);aT=.24}else{aT-=dt;if(aT<=0){doA(false);aT=.2}}}
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
 updLouie(dt);
 buds=buds.filter(b=>!b.dead);
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(!p.gh)p.vy+=60*dt;}
 parts=parts.filter(p=>p.life>0);
 if(inHome){cam.x=RX+88-W/2;cam.y=RY+42-H/2;return}
 const tx=P.x+P.dx*22-W/2,ty=P.y+P.dy*16-H/2,kk=Math.min(1,dt*5);cam.x+=(tx-cam.x)*kk;cam.y+=(ty-cam.y)*kk;
 cam.x=Math.max(0,Math.min(MW*16-W,cam.x));cam.y=Math.max(0,Math.min(MH*16-H,cam.y));
}
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
  if(!inHome&&facing(DOOR,24)){enterHome();return}
  if(inHome){if(facing(DESK,36)){state='house';hi=0;flashT=0;snd(440,.06,660)}return}
  {const z=ZONES.find(z=>facing(postXY(z),22));if(z){run.seen=run.seen||{};tlist=ZONES.filter(q=>run.seen[q[0]]&&q!==z);if(!tlist.length)say('NO OTHER PLACES FOUND YET. WALK THERE FIRST, THEN TRAVEL',5);else{state='travel';ti=0;snd(440,.06,660)}return}}
  if(gard.open&&facing(SIGN,24)){const n=seedsOpen();if(n<2)say('MORE SEEDS UNLOCK AS YOU HARVEST',4);else{gard.seed=(Math.min(gard.seed,n-1)+1)%n;const f=FLOWERS[gard.seed];say('NOW PLANTING '+f.pl+':  '+f.v+' PETALS EACH',4);snd(660,.06,880)}return}
  if(petOK){LO.st='sit';LO.t=1.3;hearts(LO.x,LO.y);run.pets++;meta.life.pets++;bump('pet');if((tod.petxp=(tod.petxp||0)+1)<=4)louXP(2);louSay(LOU_PET[(run.pets+day)%LOU_PET.length]);save();snd(880,.08,1320,'triangle',.07);if(run.pets===5)say('LOUIE DREAMS OF SQUIRRELS',3);return}}
 let c=squad.filter(b=>b.type===sel);
 if(!c.length){if(!squad.length){if(fresh)snd(140,.08);return}cycleSel();c=squad.filter(b=>b.type===sel);if(!c.length)return;}
 let b=c[0],d=1e9;for(const q of c){const e=d2(q,P.x,P.y);if(e<d){d=e;b=q}}
 b.st='fly';b.sx=P.x;b.sy=P.y-4;b.tx=cur.x;b.ty=cur.y;b.t=0;b.ret=false;snd(500,.12,900);bump('throw');
}
function finishPluck(){const s=P.pl;P.pl=null;const i=sprouts.indexOf(s);if(i<0)return;sprouts.splice(i,1);const st=stageOf(s);
 mkBud(s.type,st,s.x,s.y);puff(s.x,s.y,'#a87850',5,25);snd(600,.07,1200);run.plucked++;bump('pluck');if(st===2){run.bloom++;meta.life.blooms++}
 if(!found[s.type]){found[s.type]=true;say(['EMBERS FIGHT AND BURN BRAMBLE','PEBS: STRONG, SMASH CRYSTAL','DEWS SWIM! THROW AT WATER','ZIPS: SUPER FAST HAULERS','LEAFS: THE BEST GARDENERS','LUCKIES: BONUS SEEDS AND PETALS'][s.type],6);}
 if(!squad.some(b=>b.type===sel))sel=s.type;
}
function avoid(b){for(const n of npcs){const dx=b.x-n.x,dy=b.y-n.y,d=Math.hypot(dx,dy);if(d<13){const k=d||1;moveEnt(b,d?dx/k*(13-d):2,dy/k*(13-d),1.5,b.type===2)}}}
function updBud(b,dt){
 const T=TYPES[b.type],sp=T.sp*(b.stage===2?1.25:1),swim=b.type===2;b.mv=false;
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
function catchBug(b,q){q.alive=false;b.tgt=null;b.st=d2(b,P.x,P.y)<90*90?'follow':'idle';const first=!meta.bugs[q.sp];meta.bugs[q.sp]++;meta.life.bugs++;run.bugs++;tod.bugs++;bump('bug');earn(first?10:2);
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
  walk(118+lv*8);if(d2(l,P.x,P.y)<30*30){l.riders.forEach((b,i)=>{b.st='follow';b.z=0;b.x=l.x+((i%3)-1)*5;b.y=l.y+4});const n=l.riders.length;l.riders=[];l.st='follow';l.sx=l.x;l.sy=l.y;bark();louSay(n>1?'FOUND '+n+'!':'FOUND ONE!')}return}
 if(d2(l,P.x,P.y)>230*230){l.x=P.x+(free(P.x+20,P.y,false)?20:free(P.x-20,P.y,false)?-20:0);l.y=P.y+(l.x===P.x?10:2);l.sx=l.x;l.sy=l.y;l.st='follow'}
 if(l.st==='sit'){l.t-=dt;if(l.t<=0)l.st='follow';return}
 if(l.st==='dig'){if(l.t>0){const d=go(l,l.tx,l.ty,95,dt,false,3);l.tt+=dt;if(d<5||l.tt>3){l.t=0;l.dt=1.4}}
  else{l.dt-=dt;l.mv=true;if(Math.random()<dt*10)puff(l.x,l.y,'#a87850',1,30);if(l.dt<=0){mkItem(lv>=2&&Math.random()<.25?'big':'berry',l.x,l.y+2);louSay('BERRY!');bark();louXP(2);
   if(lv>=6&&!tod.tix&&Math.random()<.3){tod.tix=1;meta.tix++;toast('LOUIE FOUND A CAPSULE TICKET!');save()}l.st='follow';l.dig=R(40,60)*(lv>=2?.55:1)}}return}
 // keep to Will's side, clear of the crew trailing behind him; hold still when Will does
 if(P.mv&&!facing(l,30)){const px=-P.dy,py=P.dx;let sx=P.x-P.dx*4+px*24,sy=P.y-P.dy*4+py*24;if(!free(sx,sy,false)){sx=P.x-P.dx*4-px*24;sy=P.y-P.dy*4-py*24}if(!free(sx,sy,false)){sx=P.x+P.dx*20;sy=P.y+P.dy*20}if(free(sx,sy,false)){l.sx=sx;l.sy=sy}}
 const d=Math.hypot(l.sx-l.x,l.sy-l.y);if(d>4)go(l,l.sx,l.sy,d>50?118:84,dt,false,3);avoid(l);
 if(l.bark<=0)for(const e of foes)if(e.alive&&d2(e,P.x,P.y)<82*82){l.bark=8;l.alert=1.3;bark();louXP(1);louSay('GRR! GRUB!',1.8);if(lv>=5&&!e.boss){e.scare=2.5;e.st='wander'}break}
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
  const it=mkItem(e.boss?'shard':'husk',e.x,e.y);if(e.boss){it.w=8;run.boss=true;say('OLD THORNBACK FALLS!',5)}
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
 it.on.slice().forEach((b,i)=>{b.tgt=null;b.z=0;b.st=near?'follow':'idle';const a=i*1.3;b.x=HX+Math.cos(a)*16;b.y=HY+10+Math.sin(a)*6;});it.on.length=0;
 puff(HX,HY-22,'#f8e060',12,45);
 if(it.sub==='shard'){shards++;if(it.isle)run.isle=true;earn(10);snd(523,.12);later(()=>snd(659,.12),120);later(()=>snd(784,.12),240);later(()=>snd(1046,.3),360);
  if(shards>=4){say('THE LANTERN IS WHOLE!',5);winT=2.5}else say('SUN SHARD '+shards+' OF 4 RESTORED!',5);checkAch();persist(true);return;}
 if(it.sub!=='husk'){run.delivered++;meta.life.berries++;tod.berries++;bump('berry');earn(lucky?3:1)}
 let made=0;for(let i=0;i<it.seeds+(lucky?1:0);i++){if(buds.filter(b=>!b.gard).length+sprouts.length>=capNow())break;const [x,y]=soilSpot();mkSprout(type,x,y,0);made++;}
 snd(700,.08,1000);later(()=>snd(900,.1,1300),90);
 if(!made)say('NO ROOM FOR MORE SPROUTS. SEND SOME HOME TO YOUR HOUSE',4);
}
function updGate(ga,dt){const n=ga.on.length;if(!n)return;ga.hp-=n*dt;if(sndT<=0){snd(ga.sub?1200:160,.03);sndT=.12}
 ga.on.forEach(b=>{b.fx=ga.x>b.x?1:-1});
 if(ga.hp<=0){openGate(ga,true);snd(300,.3,900,'triangle',.08);say(ga.sub?'THE CRYSTAL SHATTERS!':'THE BRAMBLE BURNS AWAY!',4);persist(true);}}
function endDay(){buds.forEach(b=>{if(!b.gard){b.tgt=null;b.z=0}});[...foes,...items,...gates,...bugs].forEach(o=>o.on.length=0);
 const bonus=5+Math.min(15,tod.berries)+Math.min(15,tod.flowers*2);tod.bonus=bonus;earn(bonus);state='dayend';snd(330,.5,110,'triangle',.08);}
function newDay(){inHome=false;parked=[];day++;dayT=0;duskSaid=false;wr=0;tod={berries:0,flowers:0,bugs:0,spooked:0};P.x=HX;P.y=HY+22;P.dx=0;P.dy=1;P.stun=0;P.pluck=0;trail=[];parts=[];
 LO.x=LO.sx=P.x-22;LO.y=LO.sy=P.y+4;LO.st='follow';
 let k=0;buds.forEach(b=>{if(b.gard)return;b.st='follow';b.x=P.x+((k%7)-3)*6;b.y=P.y+8+((k/7)|0)*5;k++});
 for(const p of plots)if(p.st>=1&&p.st<=3&&!p.dry){p.st++;p.dry=p.st<4;p.t=0}
 if(day>=5)wakeGrubs();respawn();{const J=home.jobs;let made=0;const ty=TYPES.map((q,t)=>t).filter(t=>home.res[t]>0);for(let i=0;i<J[0];i++){if(buds.filter(b=>!b.gard).length+sprouts.length>=capNow())break;const [x,y]=soilSpot();mkSprout(ty[(Math.random()*ty.length)|0]||0,x,y,0);made++}
  if(J[2])louXP(J[2]*2);if(made||J[1]){toast('HOME:'+(made?'  +'+made+' SPROUTS':'')+(J[1]?'  +'+J[1]*2+' PETALS':''));if(J[1])earn(J[1]*2)}}
 if(!buds.length&&!sprouts.length){for(let i=0;i<3;i++){const [x,y]=soilSpot();mkSprout(0,x,y,8)}}
 newSpark();say('DAY '+day+'. GOOD MORNING, WILL!',4);
 cam.x=P.x-W/2;cam.y=P.y-H/2;state='play';snd(440,.1,880);persist(true);}

/* ---------- draw ---------- */
let ox=0,oy=0;
function stemTop(sx,sy,st){if(st===0){r('#70d850',sx,sy-1,3,1);r('#70d850',sx+1,sy-2,2,1)}else if(st===1){r('#f8e060',sx-1,sy-2,3,2);r('#f8f0a0',sx,sy-3,1,1)}
 else{const c=RB?RAINBOW[Math.abs(flSeed)%6]:FL[0];r(c,sx-1,sy-3,3,3);r(FL[1],sx,sy-4,1,1);r(FL[1],sx-2,sy-2,1,1);r(FL[1],sx+2,sy-2,1,1);r('#f8d040',sx,sy-2,1,1)}}
function hatArt(i,x,y){const k='#383048';
 if(i===1){r(k,x-2,y-1,11,2);r('#e8c868',x-1,y-1,9,1);r(k,x+1,y-4,5,3);r('#e8c868',x+2,y-3,3,2);r('#c04848',x+2,y-2,3,1)}
 else if(i===2){r(k,x,y-6,7,7);r('#ffffff',x+1,y-5,5,5);r('#d8d8e8',x+1,y-1,5,1)}
 else if(i===3){r('#58c048',x,y-1,7,2);r('#f8a0c8',x,y-2,2,2);r('#f8e060',x+3,y-2,2,2);r('#ffffff',x+5,y-2,2,2)}
 else if(i===4){r(k,x+2,y-7,3,8);r('#60b8f8',x+3,y-6,1,2);r('#f85888',x+2,y-4,3,2);r('#60b8f8',x+1,y-2,5,2);r('#f8e060',x+3,y-8,1,2)}
 else if(i===5){r(k,x,y-5,7,6);r('#f8d030',x+1,y-3,5,3);r('#f8d030',x+1,y-4,1,1);r('#f8d030',x+3,y-4,1,1);r('#f8d030',x+5,y-4,1,1);r('#e83040',x+3,y-2,1,1)}}
function drawBud(b){const T=TYPES[b.type],gx=Math.round(b.x-ox)-3,gy=Math.round(b.y-oy);
 r('rgba(0,0,0,.28)',gx+1,gy,5,2);
 const hop=b.mv?((time*10+b.a*3)|0)%2:0,x=gx,y=gy-7-Math.round(b.z)-hop;
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
function drawPlot(p){const x=Math.round(p.x-ox),y=Math.round(p.y-oy)+2,h=(p.flower===2?[0,3,7,10,12]:[0,3,6,8,9])[p.st],c=FCOL[p.flower];
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
 else{const X=Math.round(x),Y=Math.round(y)+5;r('rgba(0,0,0,.25)',X-4,Y,8,2);const ws=[2,4,6,8,8,6,6,4,4,2,2];
  ws.forEach((w,i)=>r('#906008',X-w/2-1,Y-12+i,w+2,1));ws.forEach((w,i)=>{r('#f8d030',X-w/2,Y-12+i,w,1);r('#fff8a0',X-w/2,Y-12+i,Math.max(1,w/2-1),1)});
  if(((time*3)|0)%2){r('#ffffff',X+4,Y-13,1,3);r('#ffffff',X+3,Y-12,3,1)}}
 const s=str(it);if((it.on.length||it.w>1)&&(state==='play'||state==='talk')){const t=s+'/'+it.w;text(t,Math.round(x)-tw(t,2)/2,Math.round(y)-(it.sub==='berry'?19:it.sub==='big'?24:23),2,s>=it.w?'#a8f080':'#ffffff');}}
function drawFoe(e){const x=Math.round(e.x-ox),y=Math.round(e.y-oy),sh=e.st==='wind'?Math.round(Math.sin(time*60)):0;
 if(e.boss){r('rgba(0,0,0,.28)',x-13,y+3,26,4);g.drawImage(e.face>0?BO.r:BO.l,x-16+sh,y-17,32,22)}
 else{r('rgba(0,0,0,.28)',x-6,y+2,12,3);g.drawImage(e.face>0?GR.r:GR.l,x-8+sh,y-8+(((time*4+e.hx)|0)%2))}
 if(e.st==='wind')text('!',x-2,y-(e.boss?34:24),3,'#f84848');
 if(e.hp<e.max){const w=e.boss?28:14,t=y-(e.boss?21:11);r('#181020',x-w/2-1,t-1,w+2,4);r('#f84848',x-w/2,t,Math.max(0,Math.round(w*e.hp/e.max)),2)}}
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
 if(d.say&&d.say.t>0){const s=d.say.s,w2=tw(s)+8,bx=Math.max(2,Math.min(W-w2-2,Math.round(x-w2/2)));r('#181020',bx-1,Y-19,w2+2,16);r('#ffffff',bx,Y-18,w2,14);r('#181020',x-1,Y-3,3,2);r('#ffffff',x,Y-4,1,2);text(s,bx+4,Y-17,2,'#281c30',null)}
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
 r(k,X+18,Y+29,12,18);r('#805030',X+19,Y+30,10,16);r('#a87048',X+20,Y+31,4,14);r('#f8e060',X+26,Y+38,2,2);
 [6,33].forEach(wx=>{r(k,X+wx,Y+25,10,10);r(((time*.7+wx)|0)%5?'#88d0f8':'#f8e8a0',X+wx+1,Y+26,8,8);r(k,X+wx+4,Y+26,1,8);r(k,X+wx+1,Y+29,8,1);r('#58c048',X+wx,Y+35,10,2);r('#f8a0c8',X+wx+1,Y+34,2,2);r('#f8e060',X+wx+5,Y+34,2,2)});
 const n=Math.min(8,homeTotal()),sx=ox,sy=oy;let k2=0;for(let t=0;t<NT&&k2<n;t++)for(let j=0;j<home.res[t]&&k2<n;j++,k2++){const side=k2%2?31+((k2/2)|0)*5:3+((k2/2)|0)*5;drawBud({x:32*16+side+3,y:17*16+3+(k2%3),type:t,stage:2,z:Math.max(0,Math.sin(time*3+k2*2))*2,mv:false,fx:k2%2?-1:1,st:'follow',a:k2,star:false,hat:meta.eq.hat})}}
function drawPost(z){const p=postXY(z),x=p.x-ox,y=p.y-oy;r('rgba(0,0,0,.25)',x-5,y+1,10,2);r('#383048',x-2,y-17,4,19);r('#805030',x-1,y-16,2,17);r('#383048',x-9,y-16,15,6);r('#e8c888',x-8,y-15,13,4);r('#383048',x-5,y-9,15,6);r('#c89050',x-4,y-8,13,4);r('#383048',x-8,y-14,1,2);r('#383048',x+7,y-7,1,2);r('#58c048',x-2,y-19,4,2)}
function trArt(i,x,y){const c=TRS[i][1],k='#181020',m=i%4;
 if(m===0){r(k,x-3,y-4,7,8);r(c,x-2,y-3,5,6)}else if(m===1){r(k,x-1,y-5,3,10);r(k,x-3,y-3,7,6);r(c,x,y-4,1,8);r(c,x-2,y-2,5,4)}
 else if(m===2){r(k,x-4,y-3,9,6);r(k,x-3,y-4,7,8);r(c,x-3,y-2,7,4);r(c,x-2,y-3,5,6)}else{r(k,x-1,y-5,3,10);r(k,x-4,y-2,9,4);r(c,x,y-4,1,8);r(c,x-3,y-1,7,2);r(c,x-1,y-2,3,4)}
 r('#ffffff',x-1,y-2,1,1);}
function drawSpark(){const q=run.spark,x=q.x-ox,y=q.y-oy,p=((time*5)|0)%4;r('#6e4428',x-4,y,8,2);r('#a87850',x-2,y-1,4,1);const yy=y-7-(p===1?1:0);g.fillStyle='rgba(248,224,96,'+(.18+.14*Math.sin(time*5)).toFixed(2)+')';g.beginPath();g.arc(x+.5,yy+.5,9,0,7);g.fill();r('#f8e060',x-1,yy-4,3,9);r('#f8e060',x-4,yy-1,9,3);if(p<2){r('#ffffff',x-1,yy-1,3,3)}else r('#ffffff',x,yy,1,1);r('#fff8a0',x+5,yy-5+(p%2),1,1);r('#fff8a0',x-6,yy+2-(p%2),1,1)}
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
function drawHearth(){const x=Math.round(HX-ox),y=Math.round(HY-oy),lit=shards/4,fl=Math.sin(time*9)>0?1:0;
 g.fillStyle='rgba(255,224,110,'+(.10+lit*.16)+')';g.beginPath();g.arc(x,y-24,16+shards*7+fl,0,7);g.fill();
 r('#383048',x-10,y-3,20,9);r('#888098',x-9,y-2,18,7);r('#b0a8c0',x-9,y-2,18,1);
 for(let i=0;i<4;i++)r(i<shards?'#f8d030':'#504860',x-7+i*4,y+1,2,2);
 r('#382818',x-2,y-18,4,16);r('#684830',x-1,y-18,2,16);
 r('#282038',x-7,y-32,14,14);r(shards?'#f8e060':'#705838',x-5,y-30,10,10);r(shards?'#fff8c0':'#907048',x-2+fl,y-27,3,5);r('#f08030',x-1,y-23,2,2);
 r('#782828',x-9,y-35,18,3);r('#c04848',x-9,y-35,18,2);r('#c04848',x-5,y-38,10,3);r('#f07070',x-4,y-38,3,1);}
function drawWorld(){
 ox=Math.round(cam.x);oy=Math.round(cam.y);if(inHome){drawHome();return}const wf=((time*2)|0)%2,x0=ox>>4,y0=oy>>4;
 for(let ty=y0;ty<=y0+((H/16)|0)+1;ty++)for(let tx=x0;tx<=x0+15;tx++){
  const t=(tx<0||ty<0||tx>=MW||ty>=MH)?TR:map[ty*MW+tx],px=tx*16-ox,py=ty*16-oy;let im;
  if(t===G||t===GT||t===6)im=TL.grass[(tx*7+ty*13)%11%3];else if(t===D)im=TL.dirt;else if(t===S)im=TL.soil;else if(t===WA)im=TL.water[(wf+tx+ty)%2];else im=TL.tree;
  g.drawImage(im,px,py);
  if(t!==TR&&ty>0){const up=map[(ty-1)*MW+tx];if(up===TR)r('rgba(10,30,20,.28)',px,py,16,4);else if(t===WA&&up!==WA){r('#2868b8',px,py,16,3);r('#e8d8a0',px,py,16,1)}}
 }
 for(const ga of gates)if(ga.alive){ga.tiles.forEach(([tx,ty])=>{const jx=ga.on.length?Math.round(Math.sin(time*40+tx)):0;g.drawImage(TL.gate[ga.sub],tx*16-ox+jx,ty*16-oy)});
  if(ga.hp<ga.max){const x=Math.round(ga.x-ox),y=Math.round(ga.y-oy)-14;r('#181020',x-11,y-1,22,4);r('#f8d030',x-10,y,Math.round(20*ga.hp/ga.max),2)}}
 for(const ga of gates)if(ga.alive&&ga.sub<2){const T=TYPES[ga.sub],x=Math.round(ga.x-ox)-3,y=Math.round(ga.y-oy)-24+Math.round(Math.sin(time*3)*1.5);r('#181020',x-2,y-2,11,11);r('#f8f0d8',x-1,y-1,9,9);r(T.d,x,y,7,7);r(T.c,x+1,y+1,5,5);r('#181020',x+2,y+3,1,2);r('#181020',x+4,y+3,1,2);r('#181020',x+2,y+9,3,1);r('#181020',x+3,y+10,1,1)}
 LO.pet=petOK&&state==='play';
 const L=[];
 for(const s of sprouts)L.push([s.y,drawSprout,s]);for(const it of items)if(it.alive)L.push([it.y+1,drawItem,it]);
 for(const e of foes)if(e.alive)L.push([e.y,drawFoe,e]);for(const b of buds)L.push([b.y+(b.st==='fight'?4:0),drawBud,b]);
 for(const q of bugs)if(q.alive)L.push([q.y,drawBug,q]);for(const n of npcs)L.push([n.y,drawNPC,n]);
 if(gard.open){noGard=!buds.some(b=>b.gard);for(const p of plots)L.push([p.y-2,drawPlot,p]);L.push([7*16+12,drawBasket]);L.push([SIGN.y,drawSign])}
 if(run.spark)L.push([run.spark.y,drawSpark]);L.push([17*16-3,drawHouse]);for(const z of ZONES)L.push([postXY(z).y,drawPost,z]);L.push([LO.y+12,drawDog,LO]);L.push([P.y,drawPlayer]);L.push([HY,drawHearth]);
 L.sort((a,b)=>a[0]-b[0]);for(const d of L)d[1](d[2]);
 for(const p of parts){const x=Math.round(p.x-ox),y=Math.round(p.y-oy);
  if(p.gh===2){r(p.c,x-2,y-1,2,2);r(p.c,x+1,y-1,2,2);r(p.c,x-2,y,5,2);r(p.c,x-1,y+2,3,1);r(p.c,x,y+3,1,1)}
  else if(p.gh===3){r(p.c,x,y-2,1,5);r(p.c,x-2,y,5,1);r('#f8e060',x,y,1,1)}else if(p.gh===4){r(p.c,x-1,y-1,3,3);r('#ffffff',x-1,y-1,1,1)}else r(p.c,x,y,2,2)}
 if(state==='play'){const x=Math.round(cur.x-ox),y=Math.round(cur.y-oy),c=TYPES[sel].l,q=4+(((time*4)|0)%2);if(needT>=0){const s='NEEDS '+TYPES[needT].n+'S';text(s,Math.round(x-tw(s)/2),y+9,2,TYPES[needT].l)}
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{r('#181020',x+a*q-1,y+b*q-1,3,3);r(c,x+a*q,y+b*q,1,1);r(c,x+a*q-a,y+b*q,1,1);r(c,x+a*q,y+b*q-b,1,1)});
  if(wr>0)for(let i=0;i<16;i++){const a=i/16*6.283+time*5;r(i%2?'#ffffff':'#f8e060',Math.round(x+Math.cos(a)*wr),Math.round(y+Math.sin(a)*wr),2,2)}}
 const f=dayT/DAYLEN;if(f>.6){const a=Math.min(1,(f-.6)/.4);r('rgba(240,120,40,'+(a*.14)+')',0,0,W,H);r('rgba(30,20,90,'+(a*a*.36)+')',0,0,W,H)}
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
 if(zoneT>0&&state==='play'){const a=Math.min(1,zoneT*2,(2.2-zoneT)*4);const zw=tw(zone,3)+22,zy=Math.round(H*.25);g.globalAlpha=a;r('rgba(24,16,32,.82)',Math.round((W-zw)/2),zy-3,zw,21);r('#f8e060',Math.round((W-zw)/2),zy+16,zw,2);ctext(zone,zy,3,'#fff8c0','#403010');g.globalAlpha=1}
 const tot='CREW '+buds.length,tw2=tw(tot);box(W-tw2-8,y,tw2+6,15);text(tot,W-tw2-5,y+1,2,'#c8f0a0');
 let my=20;
 if(OBJ){const w=tw(OBJ.text)+12;box(Math.round((W-w)/2),my,w,15,'rgba(24,16,32,.88)');r(OBJ.done?'#a8f080':OBJ.col,Math.round((W-w)/2),my,3,15);ctext(OBJ.text,my+1,2,OBJ.done?'#a8f080':'#ffffff');my+=17;
  const tx=OBJ.x-ox,ty=OBJ.y-oy,col=OBJ.done?'#a8f080':'#f8e060',on=tx>10&&tx<W-10&&ty>44&&ty<H-24;
  if(state==='play'&&!inHome){if(!on){const cx=W/2,cy=H/2,a=Math.atan2(ty-cy,tx-cx),k=Math.min((W/2-14)/Math.abs(Math.cos(a)||1e-6),(H/2-36)/Math.abs(Math.sin(a)||1e-6)),p=1+Math.sin(time*6)*2;
    g.save();g.translate(Math.round(cx+Math.cos(a)*(k+p)),Math.round(cy+6+Math.sin(a)*(k+p)));g.rotate(a);g.fillStyle='#181020';g.beginPath();g.moveTo(9,0);g.lineTo(-6,-8);g.lineTo(-6,8);g.fill();g.fillStyle=col;g.beginPath();g.moveTo(6,0);g.lineTo(-4,-5);g.lineTo(-4,5);g.fill();g.restore()}
   else if(d2(P,OBJ.x,OBJ.y)>34*34){const by=Math.round(ty-30+Math.sin(time*6)*2),bx=Math.round(tx);r('#181020',bx-4,by-1,9,5);r('#181020',bx-2,by+4,5,2);r('#181020',bx-1,by+6,3,1);r(col,bx-3,by,7,3);r(col,bx-1,by+3,3,2);r(col,bx,by+5,1,1)}}}
 if(inGarden(P.x,P.y)){const o=gard.order,s=(o?'ERIN WANTS '+o.have+' / '+o.need+' '+FLOWERS[o.k].pl+'   ':'')+'GARDENERS '+gardeners();const w=tw(s)+8;box(Math.round((W-w)/2),my,w,15,'rgba(40,90,50,.85)');ctext(s,my+1,2,'#e0ffd0');my+=17}
 if(toasts.length){const s=toasts[0].s,w=tw(s)+20;r('#f8e060',Math.round((W-w)/2),my,w,17);r('#281c30',Math.round((W-w)/2)+1,my+1,w-2,15);petalIcon(Math.round((W-w)/2)+5,my+6);text(s,Math.round((W-w)/2)+14,my+2,2,'#f8e060');
my+=19}
 if(msgT>0&&msg){const ls=wrapPx(msg,222),w=Math.max(...ls.map(l=>tw(l)))+10;box(Math.round((W-w)/2),my,w,4+ls.length*13,'rgba(24,16,32,.88)');ls.forEach((l,i)=>ctext(l,my+2+i*13,2,'#ffffff'));}
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
const CINE=["For as long as anyone can remember, the Great Lantern has kept this valley warm and bright.",
 "Last night it cracked. Four sun shards flew off into the wild, and the nights are getting longer.",
 "Hi, Will! I'm Erin. I look after the lantern and the garden. This is Louie. He looks after snacks.",
 "You're the new keeper. These little ones are sprouts. They grow in the lantern's soil and follow whoever plucks them.",
 "Each kind is good at something. Aim at a thing and the right sprout steps up by itself.",
 "Throw them with A. Call them back with B. Bring the shards home, and make yourself at home too. Ready?"];
function drawCine(){const t=cineT,i=cineI,sx=ox,sy=oy,hh=H-74,night=i<2,gy=hh-14;ox=oy=0;
 if(night){r('#101838',0,0,W,hh);for(let k=0;k<30;k++)r(k%5?'#8090c8':'#ffffff',(k*53+17)%240,(k*29+7)%Math.max(20,hh-50),1,1);g.fillStyle='#182848'}
 else{[['#f8b878',0],['#f8c890',.2],['#f8dca8',.42]].forEach(([c,q])=>r(c,0,Math.round(hh*q),W,hh));g.fillStyle='#78c078'}
 g.beginPath();g.arc(50,hh+14,72,0,7);g.arc(190,hh+30,92,0,7);g.fill();r(night?'#1c3828':'#58b858',0,hh-26,W,26);r(night?'#142c20':'#3c9848',0,hh-26,W,2);
 const heart=(x,y)=>{r('#f85888',x-2,y-1,2,2);r('#f85888',x+1,y-1,2,2);r('#f85888',x-2,y,5,2);r('#f85888',x-1,y+2,3,1);r('#f85888',x,y+3,1,1)};
 if(i<2){const lit=i===0||t<.3,sh=shards;shards=lit?4:0;g.save();g.translate(120,gy);g.scale(2,2);ox=HX;oy=HY;drawHearth();ox=oy=0;g.restore();shards=sh;
  if(i===1){if(t<.3)r('rgba(255,255,255,'+(1-t/.3).toFixed(2)+')',0,0,W,hh);[[-1,-.9],[1,-.8],[-.8,-.3],[.9,-.4]].forEach(([ax,ay])=>{const d=Math.min(1,Math.max(0,t-.3)/1.8),x=Math.round(120+ax*d*135),y=Math.round(gy-56+ay*d*90+d*d*34);if(d>0&&d<1){r('#906008',x-2,y-3,5,7);r('#f8d030',x-1,y-2,3,5);r('#fff8a0',x-1,y-2,1,2);r('#fff8a0',Math.round(x-ax*7),Math.round(y-ay*7),1,1)}})}}
 else if(i===2){g.drawImage(CH.ERIN,70,gy-54,48,56);g.save();g.translate(158,gy);g.scale(2,2);drawDog({x:0,y:0,fx:-1,mv:false,st:t>.8?'sit':'follow',alert:0,say:null});g.restore();if(t>1.1&&((t*2)|0)%2)heart(182,gy-34)}
 else if(i===3){g.drawImage(SP.pd,30,gy-54,48,56);r('#8a5a3a',96,gy-6,136,10);r('#6e4428',96,gy-6,136,2);for(let k=0;k<6;k++){const a=t-.3-k*.28;if(a>0){g.save();g.translate(110+k*22,gy-2);g.scale(2,2);if(a<1.3)drawSprout({x:0,y:2,type:k%NT,age:a*28});else drawBud({x:0,y:0,type:k%NT,stage:1,z:Math.abs(Math.sin(t*5+k))*2,mv:true,fx:-1,st:'follow',a:k});g.restore()}}}
 else if(i===4){const tips=['BURN','SMASH','SWIM','RUN','GARDEN','BONUS'];for(let k=0;k<NT;k++){const x=22+k*39,a=t-k*.18;if(a>0){g.save();g.translate(x,gy-30);g.scale(3,3);drawBud({x:0,y:0,type:k,stage:2,z:Math.max(0,Math.sin(a*6))*Math.max(0,1-a)*4,mv:false,fx:1,st:'follow',a:k});g.restore();const n=TYPES[k].n;text(n,Math.round(x-tw(n,1)/2),gy-24,1,TYPES[k].l);text(tips[k],Math.round(x-tw(tips[k],1)/2),gy-13,1,'#ffffff')}}}
 else{ox=32*16-24;oy=14*16+2-(gy-46);drawHouse();ox=oy=0;g.save();g.translate(196,gy);ox=HX;oy=HY;drawHearth();ox=oy=0;g.restore();r('rgba(0,0,0,.28)',112,gy+3,8,2);g.drawImage(SP.pd,110,gy-10);r('rgba(0,0,0,.28)',128,gy+3,8,2);g.drawImage(CH.ERIN,126,gy-10);drawDog({x:154,y:gy+3,fx:-1,mv:false,st:'sit',alert:0,say:null})}
 r('#181020',4,H-72,232,68);r('#f8f0d8',5,H-71,230,66);const ls=wrapPx(CINE[i],214),n=Math.floor(t*38);let c=0;ls.slice(0,4).forEach((l,k)=>{text(l.slice(0,Math.max(0,n-c)),12,H-66+k*15,2,'#281c30',null);c+=l.length+1});
 if(n>=CINE[i].length&&((time*3)|0)%2){r('#c02848',224,H-14,5,3);r('#c02848',225,H-11,3,1);r('#c02848',226,H-10,1,1)}
 rtext('START: SKIP',236,3,1,night?'#8090c8':'#a87048',null);text((i+1)+' / '+CINE.length,5,3,1,night?'#8090c8':'#a87048',null);ox=sx;oy=sy;}
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
 if(state==='off'){r('#0c0a12',0,0,W,H);return;}
 const OY=(H-160)/2;
 if(state==='boot'){r('#0c0a12',0,0,W,H);const t=bootT;if(t>.25){const y=Math.round(Math.min(OY+46,-30+(t-.25)*(OY+76))),c=bootDing?'#f8e060':['#f07830','#48a0f0','#f0d020','#98a0b0'][((t*8)|0)%4];
   ctext('POCKET',y,5,c,'#403010');ctext('LANTERN',y+28,5,c,'#403010');if(bootDing){r('#f8e060',117,y+62,6,8);r('#fff8c0',119,y+64,2,4);r('#c04848',115,y+59,10,3);ctext('LIGHTS ON',y+78,2,'#c8c0d8',null)}}return;}
 if(state==='ko'){KO.draw();return}
 if(state==='intro'){drawIntro();return}
 if(state==='cine'){drawCine();return}
 drawWorld();
 if(state==='play'||state==='talk'){drawHUD();npCard()}
 const dim={menu:'rgba(20,12,40,.62)',rewards:'rgba(20,12,40,.86)',caps:'rgba(20,12,40,.88)',style:'rgba(20,12,40,.86)',bugs:'rgba(20,12,40,.86)',pause:'rgba(20,12,40,.82)',house:'rgba(20,12,40,.9)',travel:'rgba(20,12,40,.86)',map:'rgba(12,8,24,.94)',settings:'rgba(20,12,40,.88)',dayend:'rgba(16,10,50,.84)',win:'rgba(255,220,110,.35)'}[state];if(dim)r(dim,0,0,W,H);
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
   if(flashT>0)ctext(flash,127,2,'#f8a060');else ctext(ownCount()+' / '+styTotal+' STYLES     NO DUPLICATES',127,2,'#c8c0d8');
   ctext('COMMON 60   RARE 30   EPIC 10      B: BACK',143,2,'#a098b0');}
  else{const it=c.it,o=STY[it.k][it.i],ra=RAR[o[3]],lab=ROWS.find(q=>q[1]===it.k)[0];for(let i=0;i<10;i++){const a=i/10*6.283+c.t;r(ra[1],Math.round(120+Math.cos(a)*(50+Math.sin(c.t*3)*4)),Math.round(64+Math.sin(a)*34),2,2)}
   if(c.t<.4)r('rgba(255,255,255,'+(1-c.t/.4).toFixed(2)+')',0,-OY,W,H);drawPreview(86,26,68,70);ctext(ra[0],100,2,ra[1]);ctext(o[0]+' '+lab,113,3,'#ffffff');ctext("YOU'RE WEARING IT NOW",131,2,'#a8f080');if(c.t>.5&&((time*2)|0)%2)ctext('A: NICE!',145,2,'#c8c0d8');}}
 else if(state==='style'){text('STYLE',5,1,3,'#f8e060');walletBox(3);
  ROWS.forEach(([lab,key],i)=>{const y=24+i*15,on=i===si,o=look[key],op=STY[key][o],own=meta.own[key].includes(o);if(on)r('rgba(248,224,96,.2)',2,y-1,160,15);
   text(lab,6,y,2,on?'#ffffff':'#a098b0');text((on?'< ':'')+op[0]+(on?' >':''),on?58:66,y,2,!own?'#807890':on?'#f8e060':'#c8c0d8');if(meta.eq[key]===o)r('#a8f080',152,y+4,5,5);});
  drawPreview(166,24,70,86);const key=ROWS[si][1],o=look[key],op=STY[key][o],own=meta.own[key].includes(o);
  ctext(flashT>0?flash:meta.eq[key]===o?'WEARING THIS NOW':own?'A: WEAR IT':RAR[op[3]][0]+': FOUND IN CAPSULES',116,2,flashT>0?'#f8a060':own?'#a8f080':RAR[op[3]][1]);
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
  const by=88,bon=seti===2;if(bon)r('rgba(248,224,96,.2)',2,by-3,236,17);ctext('BACK',by,2,bon?'#ffffff':'#c8c0d8');
  r('#281c30',0,108,W,100);text('NOW PLAYING',8,110,1,'#a098b0');
  const t=TRACKS[MUS.cur>=0?MUS.cur:MUS.shown];if(t){r('#181020',7,121,26,26);if(t.img&&t.img.complete)g.drawImage(t.img,8,122,24,24);text(t.title,38,121,2,'#ffffff');text(t.artist,38,134,1,'#c8a8f8');if(MUS.from)rtext(MUS.from,234,110,1,'#706888')}
  else text(TRACKS.length?(meta.mus?'...':'MUSIC IS OFF'):'NO MUSIC LOADED',8,124,2,'#a098b0');
  ctext(((time/4)|0)%2?'NO SOUND ON IPHONE? CHECK THE RING SWITCH':'LEFT / RIGHT: ADJUST      B: BACK',146,2,'#a098b0');}
 else if(state==='map'){const mx=15,my=18,col=['#58b858','#d8b878','#8a5a3a','#3888e0','#1c5038','#58b858','#c04848'];
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=map[ty*MW+tx];if(t!==TR&&t!==7)r(col[t],mx+tx*3,my+ty*3,3,3)}
  for(const ga of gates)if(ga.alive)ga.tiles.forEach(([tx,ty])=>r(['#f08030','#90f0f8','#c89050'][ga.sub],mx+tx*3,my+ty*3,3,3));
  const dot=(x,y,c,sz=4)=>{const X=Math.round(mx+x*3/16-sz/2),Y=Math.round(my+y*3/16-sz/2);r('#181020',X-1,Y-1,sz+2,sz+2);r(c,X,Y,sz,sz)};
  for(const z of ZONES){const p=postXY(z);dot(p.x,p.y,'#e8c888',2)}
  if(run.spark&&((time*2)|0)%2)dot(run.spark.x,run.spark.y,'#f078c0',3);dot(HX,HY,'#f8e060',5);dot(DOOR.x,DOOR.y-20,'#c04848',5);for(const it of items)if(it.alive&&it.sub==='shard')dot(it.x,it.y,'#f8d030',3);for(const n of npcs)dot(n.x,n.y,n.col);
  if(OBJ&&((time*3)|0)%2){const X=Math.round(mx+OBJ.x*3/16),Y=Math.round(my+OBJ.y*3/16);r('#f8e060',X-5,Y-5,10,1);r('#f8e060',X-5,Y+4,10,1);r('#f8e060',X-5,Y-5,1,10);r('#f8e060',X+4,Y-5,1,10)}
  dot(LO.x,LO.y,'#e89040',3);dot(P.x,P.y,((time*4)|0)%2?'#ffffff':'#f85888',5);
  for(const z of ZONES)if(!run.seen||run.seen[z[0]]||z[0]==='LANTERN FIELD'){const n=z[0].replace("THORNBACK'S ",'').replace("ERIN'S ",'').replace('SUNNY ','').replace('PEBBLE ','').replace(' FIELD','').replace('NORTH ','').replace('DEW ',''),w=tw(n,1);text(n,Math.max(2,Math.min(W-w-2,Math.round(mx+(z[1]+z[3]/2)*3-w/2))),my+(z[2]+z[4])*3-1,1,'#fff8e0')}
  text('MAP',5,1,3,'#f8e060');let lx=64;[['WILL','#ffffff'],['LOUIE','#e89040'],['SHARD','#f8d030'],['HOME','#c04848']].forEach(([n,c])=>{r('#181020',lx,5,6,6);r(c,lx+1,6,4,4);text(n,lx+9,3,1,'#c8c0d8');lx+=tw(n,1)+17});
  box(170,146,70,14,'rgba(24,16,32,.9)');text('B: BACK',180,147,2,'#a098b0');}
 else if(state==='house'){text('HOME',5,1,3,'#f8e060');walletBox(3);const sq=inHome?parked:buds.filter(b=>b.st==='follow'),ns=sq.filter(b=>b.star).length,J=home.jobs,rest=homeTotal()-J[0]-J[1]-J[2],uc=UPCOST[home.up];
  const rows=[['MOVE IN STAR SPROUTS',ns+' HERE'],['MOVE IN 5 SPROUTS',sq.length-ns+' HERE'],['BERRY PICKERS',J[0]],['FLORISTS',J[1]],["LOUIE'S TRAINERS",J[2]],['BUILD A BIGGER HOUSE',uc?uc+' PETALS':'MAX'],['GO TO BED','']];
  rows.forEach(([l,v],i)=>{const y=21+i*13,on=i===hi,job=i>=2&&i<=4;if(on){r('#f8e060',3,y-2,234,14);r('#281c30',4,y-1,232,12)}text(l,9,y-1,2,on?'#ffffff':job?'#a8f080':'#c8c0d8');rtext(job?(on?'<  '+v+'  >':String(v)):v,231,y-1,2,on?'#f8e060':'#a098b0')});
  r('#281c30',0,112,W,100);ctext(flashT>0?flash:['WORKERS EARN GOLD STARS: +12 PETALS EACH','ANY SPROUTS WITH YOU: +2 PETALS EACH','EACH LEAVES 1 NEW SPROUT EVERY MORNING','EACH MAKES 2 PETALS EVERY MORNING','EACH GIVES LOUIE 2 XP EVERY MORNING',uc?'ROOM FOR '+HCAP[home.up+1]+' SPROUTS INSTEAD OF '+homeCap():'NO BIGGER HOUSE TO BUILD','SKIP TO THE EVENING REPORT'][hi],115,2,flashT>0?'#a8f080':'#fff8c0');
  text('LIVING '+homeTotal()+' / '+homeCap(),8,130,2,'#ffffff');rtext('RESTING '+rest,232,130,2,rest?'#f8a060':'#a098b0');
  text('HOME LV '+homeLv(),8,144,2,'#f8a060');ctext('LOUIE LV '+louLv(),144,2,'#e89040');rtext('CREW '+capNow(),232,144,2,'#c8f0a0');}
 else if(state==='travel'){ctext('TRAIL POST',4,4,'#f8e060');ctext('WHERE TO, WILL?',28,2,'#c8c0d8');drawList(tlist.map(z=>z[0]),ti,48,15,6);ctext('A: GO      B: STAY',146,2,'#a098b0');}
 else if(state==='pause'){ctext('PAUSED',2,4,'#f8e060');drawList(['RESUME','MAP','SETTINGS','SAVE AND QUIT TO MENU'],pi,27,14);
  r('#281c30',0,84,W,120);text('MISSIONS',6,87,2,'#f8a060');let y=101,any=false;
  for(const n of npcs)if(n.st==='active'){any=true;const m=n.ms[n.mi],v=Math.min(m.get(),m.goal);text(n.name+': '+m.t,6,y,2,v>=m.goal?'#a8f080':'#ffffff');rtext(v+' / '+m.goal,235,y,2,v>=m.goal?'#a8f080':'#c8c0d8');y+=13}
  if(!any)text(npcs.every(n=>n.st==='done')?'ALL MISSIONS DONE!':'TALK TO ERIN BY THE LANTERN',6,y,2,'#c8c0d8');}
 else if(state==='dayend'){ctext('NIGHT FALLS',6,4,'#b0c8f8');ctext("ERIN'S EVENING REPORT, DAY "+day,32,2,'#c8a8f8');
  ctext('BERRIES BROUGHT HOME:  '+tod.berries,52,2);ctext('FLOWERS PICKED:  '+tod.flowers,66,2);ctext('BUGS CAUGHT:  '+tod.bugs,80,2);
  ctext('EVERYONE IS HOME SAFE.  CREW OF '+buds.length,94,2,'#a8f080');ctext('DAY BONUS:  +'+tod.bonus+' PETALS',110,2,'#f8c8e0');
  ctext(tod.berries+tod.flowers>12?'"What a day, Will!"':tod.berries+tod.flowers>3?'"Nice and steady, Will."':'"A slow day is still a good day."',126,2,'#c8a8f8');if(((time*2)|0)%2)ctext('A: SLEEP',144,2,'#a8f080');}
 else if(state==='win'){r('rgba(40,20,20,.6)',0,24,W,112);ctext('THE LANTERN SHINES!',34,4,'#f8e060','#783010');ctext('WILL, ERIN AND LOUIE DID IT',62,2);ctext('RELIT IN '+day+(day===1?' DAY':' DAYS'),78,2,'#a8f080');ctext('THE GARDEN IS STILL GROWING...',94,2,'#c8a8f8');if(((time*2)|0)%2)ctext('A: KEEP PLAYING',116,2,'#b0e0f8');}
 g.restore();
}
/* ---------- loop ---------- */
function fit(){const p=cv.parentNode||{};let nh=Math.round(240*p.clientHeight/p.clientWidth/2)*2;nh=Math.max(160,Math.min(304,nh||200));if(nh!==H||cv.height!==nh*2||cv.width!==480){H=nh;cv.width=480;cv.height=H*2}}
fit();addEventListener('resize',fit);try{new ResizeObserver(fit).observe(cv.parentNode)}catch(e){}
loadWorld();cloudInit();
let last=0;
function frame(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;
 try{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;draw();}catch(err){console.error(err)}
 for(const k in keys)prev[k]=keys[k];
 requestAnimationFrame(frame);}
if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(frame);
window.__g={KO,unlock,MUS,update,draw,keys,prev,snap,restore,persist,get s(){return{state,P,LO,buds,sprouts,items,foes,gates,bugs,npcs,plots,gard,shards,day,run,meta,live,SAVE}}};
})();
