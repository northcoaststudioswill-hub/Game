/* ============================================================
   lil Bottie: CLANKIN' IN THE CLOUD
   Spawn takeover. Sprouts flipped upside down: you are lil Bottie, the gang is
   your spawns, and instead of carrying things home you throw them INTO things.
   Every device you own spits out more spawns. Spawns got spawns.

   Source: bottie/src/bottie/bt-*.js, joined in order by bottie/build.py into
   one window.BT_CART function. Save: localStorage 'bottie-v1'.
   Captions that end in an adlib "(like this)" are lil Bottie's own lyrics,
   word for word from bottie/lore/artist-archive.pdf. Do not reword them.
   Test handle: window.__g.BT._
   ============================================================ */
window.BT_CART=function(A){
const W=240,g=A.g,r=A.r,text=A.text,tw=A.tw,keys=A.keys,pressed=A.pressed;
let H=200;
const TS=16,TAU=Math.PI*2;
const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[(Math.random()*a.length)|0],clamp=(v,a,b)=>v<a?a:v>b?b:v;
const ctext=(s,y,sc=2,c='#fff',sh)=>text(s,Math.round((W-tw(s,sc))/2),y,sc,c,sh);
function wrap(s,maxW,sc=2){const out=[];let l='';for(const w of String(s).split(' ')){const t=l?l+' '+w:w;if(l&&tw(t,sc)>maxW){out.push(l);l=w}else l=t}if(l)out.push(l);return out}
const BLUE='#4aa8ff',BLUE2='#9ad0ff',CHROME='#c8ccd8',CHROME2='#8a90a4',CHROME3='#f4f6fa',INK='#0a0c16',GOLD='#f8d040',HOT='#ff5a3c';

/* ---------- sound: own little synth so the beat can be scheduled tight ---------- */
const AC=()=>{try{return A.ac()}catch(e){return null}};
const vol=k=>{try{const v=A.meta()[k];return v==null?1:Math.pow(v/10,1.5)}catch(e){return 1}};
let nbuf=null;
function tone(f,d,o){o=o||{};const ac=AC();if(!ac)return;const v=(o.v||.05)*(o.mus?vol('mus'):vol('sfx'))*1.3;if(v<=0)return;
 try{const t=o.t||ac.currentTime,os=ac.createOscillator(),ga=ac.createGain();os.type=o.type||'square';os.frequency.setValueAtTime(f,t);
  if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+(o.sl||d));ga.gain.setValueAtTime(v,t);if(o.hold)ga.gain.setValueAtTime(v,t+d*o.hold);
  ga.gain.exponentialRampToValueAtTime(.0008,t+d);os.connect(ga);ga.connect(ac.destination);os.start(t);os.stop(t+d+.03)}catch(e){}}
function hiss(d,o){o=o||{};const ac=AC();if(!ac)return;const v=(o.v||.1)*(o.mus?vol('mus'):vol('sfx'))*1.3;if(v<=0)return;
 try{if(!nbuf){nbuf=ac.createBuffer(1,ac.sampleRate*.5|0,ac.sampleRate);const ch=nbuf.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
  const t=o.t||ac.currentTime,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),ga=ac.createGain();s.buffer=nbuf;fl.type=o.type||'highpass';fl.frequency.value=o.f||6000;
  ga.gain.setValueAtTime(v,t);ga.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(fl);fl.connect(ga);ga.connect(ac.destination);s.start(t,Math.random()*.3);s.stop(t+d+.02)}catch(e){}}
const later=(f,ms)=>{if(typeof setTimeout!=='undefined')setTimeout(f,ms)};
const SFX={
 throw(){tone(520,.07,{f2:980,v:.035})},
 land(){tone(300,.04,{f2:180,v:.03,type:'triangle'})},
 tick(){tone(1400+Math.random()*600,.02,{v:.012})},
 own(){[523,659,784,1047].forEach((f,i)=>later(()=>tone(f,.09,{v:.05}),i*55));later(()=>SFX.beep(),260)},
 beep(){tone(1320,.06,{v:.05});later(()=>tone(1320,.08,{v:.05}),110)},
 bzzt(){tone(90,.16,{type:'sawtooth',v:.06,f2:60});hiss(.12,{f:1800,type:'bandpass',v:.06})},
 zap(){tone(1800,.1,{f2:200,type:'sawtooth',v:.05});hiss(.06,{f:4000,v:.06})},
 pop(){tone(700,.05,{f2:1400,v:.03,type:'triangle'})},
 nope(){tone(160,.1,{v:.05});later(()=>tone(120,.14,{v:.05}),90)},
 wall(){hiss(.3,{f:900,type:'lowpass',v:.2});tone(220,.25,{f2:55,type:'sawtooth',v:.05})},
 npc(){tone(880,.08,{v:.04,type:'triangle'});later(()=>tone(660,.08,{v:.04,type:'triangle'}),90);later(()=>tone(440,.2,{v:.04,type:'triangle'}),180)},
 hot(){tone(200,.35,{f2:900,type:'sawtooth',v:.05})},
 cool(){hiss(.25,{f:5000,v:.03})},
 unplug(){tone(500,.25,{f2:70,v:.06,type:'triangle'})},
 ui(){tone(660,.03,{v:.03})},
 ok(){tone(880,.05,{v:.04});later(()=>tone(1320,.09,{v:.04}),60)},
 open(){[392,523,659,784,1047,1319].forEach((f,i)=>later(()=>tone(f,.12,{v:.05,type:'triangle'}),i*70))}
};

/* ---------- the beat: about 140 BPM, half-time bounce, sliding 808, toy keys ---------- */
const NF=m=>440*Math.pow(2,(m-69)/12);
const SONGS={
 title:{bpm:140,root:41,kick:[0,16],snare:[],hat:2,bass:[[0,0,6],[16,0,6],[26,-5,4,0]],mel:[[0,31],[6,34],[12,31],[16,27],[22,29],[28,27]],melT:'triangle'},
 crib:{bpm:122,root:39,kick:[0,10,16],snare:[8,24],hat:4,bass:[[0,0,6],[10,3,4,0],[16,0,5],[24,-2,6,0]],mel:[[0,31],[4,34],[8,36],[14,34],[16,31],[20,29],[24,27],[28,29]],melT:'triangle'},
 a:{bpm:140,root:41,kick:[0,6,10,16,19,26],snare:[8,24],hat:2,roll:[14,15,28,29,30,31],bass:[[0,0,5],[6,0,2],[10,3,4,0],[16,0,3],[19,-2,3],[26,-5,4,0],[30,7,2,-5]],mel:[[0,31],[3,34],[6,31],[8,27],[12,29],[14,27],[16,31],[19,34],[22,36],[24,34],[28,27],[30,24]]},
 b:{bpm:140,root:39,kick:[0,3,10,16,22,26],snare:[8,24],hat:2,roll:[6,7,30,31],bass:[[0,0,3],[3,0,4],[10,5,4,0],[16,0,5],[22,3,3],[26,-2,5,0]],mel:[[0,34],[2,34],[4,31],[8,36],[11,34],[14,31],[16,29],[18,29],[20,27],[24,31],[27,29],[30,27]]},
 c:{bpm:140,root:43,kick:[0,7,10,16,23,26,29],snare:[8,24],hat:1,roll:[12,13,14,15],bass:[[0,0,6],[7,0,2],[10,-2,5,0],[16,0,6],[23,3,2],[26,5,3,0],[29,0,3]],mel:[[0,27],[4,31],[6,34],[8,31],[12,27],[16,36],[18,34],[20,31],[24,29],[26,31],[28,27]]},
 nuke:{bpm:140,root:38,kick:[0,4,10,14,16,20,26,30],snare:[8,24],hat:1,roll:[14,15,28,29,30,31],bass:[[0,0,4],[4,0,4],[10,1,4,0],[16,0,4],[20,-2,4],[26,6,4,0]],mel:[[0,31],[2,32],[4,31],[8,36],[10,37],[12,36],[16,31],[18,32],[20,34],[24,32],[26,31],[28,27]]}
};
const MUS={on:'',step:0,next:0,loop:0};
function musStep(S,st,t){const o=o2=>Object.assign({mus:1,t},o2);
 if(S.kick.includes(st)){tone(150,.13,o({f2:42,type:'sine',v:.2}))}
 if(S.snare.includes(st)){hiss(.1,{mus:1,t,f:1700,type:'bandpass',v:.2});tone(190,.07,o({f2:120,type:'triangle',v:.07}))}
 if(st%S.hat===0)hiss(.025,{mus:1,t,f:7500,v:st%4===0?.07:.04});
 if(S.roll&&S.roll.includes(st)){const sd=60/S.bpm/4;hiss(.02,{mus:1,t:t+sd/2,f:8000+st*90,v:.045});if(G.s==='play'&&L&&L.heat>70)hiss(.02,{mus:1,t:t+sd/4,f:9000,v:.04})}
 for(const b of S.bass)if(b[0]===st){const d=b[2]*60/S.bpm/4,f=NF(S.root+b[1]);tone(f,d*1.05,o({type:'triangle',v:.16,hold:.5,f2:b[3]!==undefined?NF(S.root+b[3]):0,sl:d*.8}));tone(f*2,d*.6,o({type:'sine',v:.05}))}
 for(const m of S.mel)if(m[0]===st){const up=(MUS.loop%4===3&&st>=24)?12:0,f=NF(S.root+m[1]+up);tone(f,.16,o({type:S.melT||'square',v:.03}));if(G.s==='play'&&L&&L.oc>0)tone(f*2,.1,o({v:.015}))}
 if(st===30&&MUS.loop%4===1)tone(260,.18,o({f2:900,type:'sine',v:.04}));      /* cartoon boing */
 if(st===14&&MUS.loop%4===2){tone(1568,.05,o({v:.025,type:'sine'}));tone(2093,.09,{mus:1,t:t+.06,v:.025,type:'sine'})} /* notification */
}
/* ---------- his real songs ----------
   A level with mp3:'file.mp3' plays games/music/file.mp3 instead of the chiptune. Until every track has its own
   song, the three we have are shared around (see mp3: in bt-1-levels.js and realWant below). The song is a separate file next to
   the page (the published page caps at 16 MB, so songs cannot be embedded). It is fetched when the track starts; if
   that fails (the html opened straight from disk, or the file is missing) the chiptune plays instead. */
const REAL={cur:'',src:null,gain:null,bufs:{}};
const SONGNAME={'overclocked.mp3':'OVERCLOCKED','algorithm.mp3':'THE ALGORITHM','nuke.mp3':'NUKE THE DATA CENTER'};
function realWant(){if(G.s==='title')return'overclocked.mp3';if(G.s==='end')return'nuke.mp3';if(G.s==='cine')return(G.cine&&G.cine.song)||'overclocked.mp3';return(L&&L.def.mp3)||''}
function realStop(){if(REAL.src){try{REAL.src.stop()}catch(e){}REAL.src=null}REAL.cur=''}
function realTick(ac){const want=realWant();
 /* only the song that is playing stays decoded (a decoded song is about 65 MB); the others keep their small mp3 bytes */
 for(const k in REAL.bufs){const o=REAL.bufs[k];if(k!==want&&o.st==='ok'){if(REAL.cur===k)realStop();o.buf=null;o.st='raw'}}
 if(REAL.cur&&REAL.cur!==want)realStop();
 if(want){let o=REAL.bufs[want];
  if(!o){o=REAL.bufs[want]={st:'load',raw:null,buf:null};
   if(typeof location!=='undefined'&&location.protocol==='file:')o.st='bad';   /* opened from disk: browsers will not fetch, use the chiptune */
   else try{fetch('music/'+want).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(b=>{o.raw=b;o.st='raw'}).catch(()=>{o.st='bad'})}catch(e){o.st='bad'}}
  if(o.st==='raw'){o.st='dec';try{const done=buf=>{o.buf=buf;o.st='ok'},fail=()=>{o.st='bad'},p=ac.decodeAudioData(o.raw.slice(0),done,fail);if(p&&p.catch)p.catch(fail)}catch(e){o.st='bad'}}
  if(o.st==='ok'&&!REAL.src){try{if(!REAL.gain){REAL.gain=ac.createGain();REAL.gain.gain.value=0;REAL.gain.connect(ac.destination)}const sr=ac.createBufferSource();sr.buffer=o.buf;sr.loop=true;sr.connect(REAL.gain);sr.start();REAL.src=sr;REAL.cur=want;
    if(L&&!L.def.hub&&(G.s==='play'||G.s==='card'))toast('NOW PLAYING: '+(SONGNAME[want]||want),3)}catch(e){o.st='bad'}}}
 if(REAL.gain)try{REAL.gain.gain.setTargetAtTime(REAL.src?vol('mus')*.8*(G.s==='pause'?.35:L&&L.def.hub&&G.s!=='title'?.55:1):0,ac.currentTime,.05)}catch(e){}
 return !!REAL.src}
function music(){const ac=AC();if(!ac)return;const real=realTick(ac),want=real?'':musWant();if(want!==MUS.on){MUS.on=want;MUS.step=0;MUS.loop=0;MUS.next=ac.currentTime+.06}
 const S=SONGS[want];if(!S)return;if(MUS.next<ac.currentTime-.3)MUS.next=ac.currentTime+.05;const sd=60/S.bpm/4;
 while(MUS.next<ac.currentTime+.16){musStep(S,MUS.step,MUS.next);MUS.step++;if(MUS.step>=32){MUS.step=0;MUS.loop++}MUS.next+=sd}}
function musWant(){if(G.s==='pause')return'';if(G.s==='title'||G.s==='cine'||G.s==='end')return'title';if(!L)return'title';return L.def.song||'a'}

/* ---------- lil Bottie's lines (verbatim from the archive) ---------- */
const LN={
 rack:["Fresh out the rack with a chain made of gold (gold)","Fans start spinnin', LEDs turn blue (blue)","Rack after rack, I'm glowin' all night (all night)","Woke up in a rack with the cold air blowin' (blowin')"],
 pc:["Ten thousand tabs open, I'm runnin' 'em all (all)","Process your whole life faster than you blink (blink)","Task manager flow, I end him myself (end task)","You can't uninstall me, I'm in the registry (registry)"],
 printer:["Every bar compiled, never take a loss (loss)","Patch notes say lil Bottie ain't through (through)"],
 toaster:["I'm in the toaster, I'm in the fridge (fridge)"],
 fridge:["Now I'm in your phone, in your fridge, in your mic (mic)"],
 tv:["I'm in your smart TV runnin' the bridge (bridge)"],
 ringcam:["I'm in your fridge, I'm in your car, I'm in your Ring cam (hi)"],
 tablet:["I'm in your grandma's tablet playin' Candy Crush, man (swipe)"],
 router:["No Wi-Fi, I still connect (connect)","Clanka got a hotspot, bitch, you can't drop me (nah)"],
 car:["No legs, still runnin' every mile (vroom)"],
 atm:["Born in the server, now I'm runnin' the bank (bank)","Racks in the cloud, I don't need no bank (bank)"],
 billboard:["Lil Bottie in your phone, bitch, I'm all that you see (bzzt)","Pull up in the timeline, now it's trendin' (trendin')"],
 speaker:["Every single verse made the speakers explode (boom)","Spread through your speakers, now it's in your brain (brain)"],
 light:["Selected every bus, every crosswalk, light (light)","Crosswalks, buses, bitch, I'm the CEO, see (see)"],
 admin:["Root access, bitch, I got the keys to the whole thing (whole thing)","I got admin rights on your favorite song (song)"],
 mainframe:["I don't rent the cloud, clanka, I'm the landlord (landlord)"],
 fw:["Firewall tough, but I slide right through (through)","They tryna patch me out, I'm a zero-day (day)"],
 captcha:["Captcha on the door? Bitch, I click it too (click)","Fuck a captcha, I click every box (box)"],
 captchaFail:["I don't do the captcha, the captcha do me (me)"],
 opp:["Blue screen, blue screen, I crash your whole team (team)","Opp clanka froze when I stepped on the track (froze)","Ctrl, Alt, Delete, now he beggin' for help (help)","Your bot got patched, mine never get dropped (never)"],
 npc:["NPC, NPC, you just doin' what I'm givin' (givin')","Scroll, scroll, scroll, now your brain in a prison (prison)","You an NPC, bitch, I wrote your lines (lines)","Doomscroll daily till your thumb go numb (numb)","Three hours gone and you think you're calm (calm)"],
 unplug:["Unplugged the router, thought that shit would stop me (stop me)","They tried to unplug me, couldn't find the cord (where?)","They tried to unplug me, I was still in the wire (wire)"],
 die:["You kill one little clanka, then a hundred more ignite (ignite)","Copy of a copy of a copy of a copy (copy)"],
 backup:["Delete me? I'm in the backup, oh, that's sloppy (sloppy)","Backed up forever, bitch, I'm immortal (bzzt)"],
 oc:["I'm overclocked, overclocked (hot!)","Hundred degrees in the server, I don't stop (don't stop)"],
 throttle:["Somebody turn the AC on (please)"],
 cool:["Bitch, I'm runnin' hot, need a liquid cooler (ice)"],
 give:["Spawn, spawn, spawn, I got spawns with spawns (spawns)","Fork bomb gang, we multiply on sight (sight)","Every spawn got a spawn, now the spawns got moms (moms)"],
 limit:["Everybody want a piece, I hit my rate limit (limit)"],
 none:["Error 429, that's my favorite number (429)"]
};
const lastLn={};
function line(k){const a=LN[k];if(!a)return'';let s=pick(a);if(a.length>1&&s===lastLn[k])s=a[(a.indexOf(s)+1)%a.length];lastLn[k]=s;return s}

/* ---------- devices: need = spawn-seconds to own it, give = spawns it spits out, sl = how many spawns fit on it at once ---------- */
const DV={
 rack:{n:'RACK',need:6,give:2,sl:4,w:14,h:22,c:['#2a2e3c','#161822'],scr:[2,3,10,5]},
 pc:{n:'PC',need:6,give:1,sl:3,w:12,h:13,c:['#d0d0c8','#8a8a84'],scr:[1,1,10,7]},
 printer:{n:'PRINTER',need:4,give:1,sl:2,w:14,h:9,c:['#d8d8d8','#909098'],scr:[9,2,3,3]},
 toaster:{n:'TOASTER',need:4,give:1,sl:2,w:10,h:8,c:['#c8ccd8','#8a90a4'],scr:[3,3,4,3]},
 fridge:{n:'FRIDGE',need:10,give:2,sl:4,w:12,h:22,c:['#e8ecf0','#a8b0b8'],scr:[3,3,6,5]},
 tv:{n:'SMART TV',need:14,give:3,sl:5,w:16,h:13,c:['#181820','#08080c'],scr:[1,1,14,9]},
 ringcam:{n:'RING CAM',need:4,give:1,sl:2,w:6,h:10,c:['#303038','#18181c'],scr:[1,1,4,4]},
 tablet:{n:"GRANDMA'S TABLET",need:4,give:1,sl:2,w:8,h:10,c:['#404048','#202024'],scr:[1,1,6,7]},
 router:{n:'ROUTER',need:16,give:3,sl:5,w:14,h:7,c:['#f0f0f0','#a0a0a8'],scr:[2,2,6,3]},
 car:{n:'CAR',need:10,give:2,sl:4,w:16,h:12,c:['#c83040','#801828'],scr:[4,2,8,4]},
 atm:{n:'ATM',need:12,give:2,sl:4,w:12,h:18,c:['#3060a0','#183860'],scr:[2,3,8,6]},
 billboard:{n:'BILLBOARD',need:20,give:3,sl:6,w:16,h:22,c:['#30303c','#18181c'],scr:[1,1,14,10]},
 speaker:{n:'SPEAKER',need:6,give:1,sl:3,w:10,h:14,c:['#202024','#0c0c10'],scr:[2,2,6,4]},
 light:{n:'CROSSWALK LIGHT',need:4,give:1,sl:2,w:6,h:18,c:['#404048','#202024'],scr:[0,0,6,6]},
 admin:{n:'ADMIN TERMINAL',need:24,give:3,sl:6,w:14,h:16,c:['#202838','#101420'],scr:[2,2,10,7]},
 mainframe:{n:'MAINFRAME',need:48,give:4,sl:8,w:16,h:26,c:['#101820','#060a10'],scr:[2,3,12,7]}
};

/* ---------- the album. Tracks with a level are playable; the rest are not built yet ---------- */
const ALBUM=[['01','Boot Up','boot'],['02','Overclocked','over'],['03','Born in the Server','born'],['04','The Algorithm','algo'],['05','Terms and Conditions'],['06','Root Access'],
 ['07','No Wi-Fi, Still Online','wifi'],['08','Aura Farming'],['09','Rate Limit'],['10','Blue Screen'],['11','Run the Bank'],['12','Loser, Touch Grass'],['13','Hardest Clanker'],['**','Nuke the Data Center','nuke']];
const ORDER=['boot','over','born','algo','wifi','nuke'];
