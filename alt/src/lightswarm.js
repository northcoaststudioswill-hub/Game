
/* ---------- cartridge 6: LIGHTSWARM ---------- */
/* ============================================================
   LIGHTSWARM  -  cartridge 6 for the Pocket Lantern (vertical slice v0.1)
   An expedition from Sunkeep. Will walks into the dark with a swarm of
   sprouts; the sprouts throw the light by themselves. Dimmed buddies close
   in from every side. Show one enough light and it remembers and goes home
   calm, leaving a mote of light. Motes level you up: pick one of three.
   Five minutes in, the place's Guardian of the Light wakes, dim.
   Light it and its Sigil stone goes home to the Lantern.

   You only steer. A = CHARGE (the swarm surges the way you face),
   B = WHISTLE (calls every mote, shoves the dark back). Seeds you bring
   home buy lasting upgrades at Sunkeep, so every run counts.

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
const DEF=()=>({seeds:0,up:{glass:0,boots:0,pockets:0,head:0,reroll:0},unl:[1,0,1,1,0,0],best:{t:0,calm:0,lv:0},wins:0,runs:0,seen:0,st:0});
let SV=DEF();
try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o){SV=Object.assign(DEF(),o);SV.up=Object.assign(DEF().up,o.up||{});SV.best=Object.assign(DEF().best,o.best||{});if(!Array.isArray(SV.unl)||SV.unl.length!==6)SV.unl=DEF().unl}}catch(e){}
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
 {id:'moon',n:'MOON PEBBLE',d:'Sprouts, CHARGE and WHISTLE are ready 8% sooner.',max:5}];
/* lasting upgrades bought with seeds at Sunkeep */
const UPS=[
 {id:'glass',n:'LANTERN GLASS',d:'+15 light at the start',c:[12,30,60]},
 {id:'boots',n:'WORN-IN BOOTS',d:'+5% walking speed',c:[12,30,60]},
 {id:'pockets',n:'BIG POCKETS',d:'+20% mote reach',c:[10,25,50]},
 {id:'head',n:'HEAD START',d:'Start with one more pick',c:[20,45,90]},
 {id:'reroll',n:"ERIN'S SECOND LOOK",d:'+1 reroll each expedition',c:[15,35,70]}];
const UNLOCK=45; /* seeds to take a locked sprout kind as your starter */

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
 PYTHORN:{hp:1700,spd:27,dmg:18,r:22,sz:64,xp:0,boss:1,ai:'boss'}};
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
function icon(id,x,y){ /* 12 x 12 pictures for the things from home */
 if(id==='louie'){try{g.drawImage(A.LOU.r[0],x-4,y)}catch(e){r('#e89040',x,y+3,12,7)}}
 else if(id==='oil'){r(K,x+2,y,8,12);r('#f8e060',x+3,y+3,6,8);r('#fff8c0',x+4,y+5,2,4);r('#c04848',x+3,y+1,6,2)}
 else if(id==='boots'){r(K,x+1,y+1,6,10);r('#a86838',x+2,y+2,4,8);r(K,x+1,y+7,10,5);r('#a86838',x+2,y+8,8,3);r('#e8c888',x+2,y+2,4,1)}
 else if(id==='bell'){r(K,x+2,y+1,8,9);r('#f8e060',x+3,y+2,6,7);r('#fff8a0',x+4,y+3,1,3);r(K,x+1,y+9,10,2);r('#c89010',x+2,y+9,8,1);r('#c89010',x+5,y+11,2,1)}
 else if(id==='wrench'){r(K,x+1,y+1,5,5);r('#98a0b0',x+2,y+2,3,3);r(K,x+3,y+1,1,2);r(K,x+4,y+4,7,7);r('#98a0b0',x+5,y+5,2,2);r('#98a0b0',x+7,y+7,2,2);r('#dce2ea',x+9,y+9,1,1)}
 else if(id==='tea'){r(K,x+1,y+4,9,7);r('#f0f0f8',x+2,y+5,7,5);r('#58b848',x+2,y+5,7,2);r(K,x+9,y+5,3,4);r('#f0f0f8',x+10,y+6,1,2);r('#c8c0d8',x+4,y+1,1,2);r('#c8c0d8',x+6,y,1,3)}
 else if(id==='moon'){r(K,x+2,y+2,9,9);r('#a8c8ff',x+3,y+3,7,7);r('#ffffff',x+4,y+4,2,2);r('#7898d8',x+7,y+7,2,2)}
 else if(id==='berry'){r(K,x+2,y+3,8,8);r('#e23b5e',x+3,y+4,6,6);r('#ff8aa0',x+4,y+5,2,1);r('#2c6030',x+5,y+1,2,3)}
 else if(id==='seed'){r(K,x+3,y+2,6,9);r('#f8e060',x+4,y+3,4,7);r('#fff8c0',x+5,y+4,1,3);r('#70d850',x+5,y,2,2)}}
const WOUT=new Map();function outl(sp){let c=WOUT.get(sp);if(!c){c=document.createElement('canvas');c.width=sp.width;c.height=sp.height;const x=c.getContext('2d');if(x&&x.drawImage){x.drawImage(sp,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff8c0';x.fillRect(0,0,c.width,c.height)}WOUT.set(sp,c)}return c}
function willSpr(){const S=A.will()||{};return RN&&Math.abs(RN.P.fx)>Math.abs(RN.P.fy)?(RN.P.fx<0?S.pl:S.pr):(RN&&RN.P.fy<0?S.pu:S.pd)}

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
function newRun(st){const hp=100+15*SV.up.glass;
 RN={t:0,P:{x:0,y:0,fx:0,fy:1,mv:0,inv:0},hp,max:hp,xp:0,need:6,lv:1,calm:0,elites:0,seeds:0,
  w:[0,0,0,0,0,0],wt:[0,0,0,0,0,0],p:{louie:0,oil:0,boots:0,bell:0,wrench:0,tea:0,moon:0},
  en:[],pr:[],ep:[],mo:[],fx:[],pa:[],it:[],sw:[],fr:[],zl:[],pt:[],lob:[],st:[],
  spT:1,ev:{},aCd:0,bCd:0,ch:null,wh:0,shake:0,freeze:0,queue:SV.up.head,rr:SV.up.reroll,boss:null,won:0,dead:0,lou:null,cam:{x:-W/2,y:-H/2},ban:null,tip:0,start:st,hurtT:0,dmgTaken:0};
 RN.w[st]=1;syncSwarm();SV.runs++;SV.st=st;store();banner('EXPEDITION: '+PLACE,'CARRY THE LIGHT. THE SPROUTS DO THE THROWING.',4)}
const banner=(a,b,t=3)=>{RN.ban={a,b,t,T:t}};
const mul=()=>({dmg:1+.12*RN.p.wrench,cd:Math.pow(.92,RN.p.moon),spd:60*(1+.05*SV.up.boots)*(1+.08*RN.p.boots),reach:26*(1+.2*SV.up.pockets)*(1+.3*RN.p.bell),mote:1+(RN.w[5]>=4?.3:RN.w[5]>=2?.15:0)});
function syncSwarm(){const N=RN,want=[];for(let t=0;t<6;t++)for(let i=0;i<(N.w[t]?N.w[t]+1:0);i++)want.push(t);
 while(N.sw.length<want.length){const t=want[N.sw.length];N.sw.push({t,x:N.P.x+R(-8,8),y:N.P.y+R(-8,8),a:R(0,TAU),i:N.sw.length})}
 N.sw.forEach((s,i)=>{s.t=want[i];s.i=i})}

/* ---------- spawning: the dark comes in waves, thicker by the minute ---------- */
function spawn(id,x,y){const N=RN,D=EN[id],k=1+N.t/95+Math.pow(N.t/180,2),a=N.P.mv&&Math.random()<.5?Math.atan2(N.P.fy,N.P.fx)+R(-1.1,1.1):R(0,TAU),d=Math.hypot(W,H)/2+24;
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
  else if(k==='boss'){N.boss=spawn('PYTHORN');N.boss.cd=2.5;banner('A DIM GUARDIAN STIRS','PYTHORN, GUARDIAN OF '+PLACE,3.5);N.shake=.5;snd(98,.6,49,'sawtooth',.08);later(()=>snd(73,.7,37,'sawtooth',.08),300)}}
 if(N.won)return;const rate=(1+t/27)*(N.boss?.5:1),cap=N.boss?90:140;
 N.spT-=dt;while(N.spT<=0){N.spT+=1/rate;if(N.en.length<cap)spawn(pickType(t))}}

/* ---------- light on a buddy ---------- */
function hit(e,dmg,kx=0,ky=0,quiet){const N=RN;if(e.gone)return;e.hp-=dmg*mul().dmg;if(!quiet)e.fl=.07;const kb=e.D.boss?0:e.D.elite?.25:1;e.kx+=kx*kb;e.ky+=ky*kb;
 if(e.hp<=0)calm(e);else say('hit',.05,()=>snd(R(420,520),.03,0,'square',.02))}
function calm(e){const N=RN;if(e.gone)return;e.gone=1;N.calm++;const D=e.D;
 N.fx.push({k:'calm',id:e.id,sz:D.sz,x:e.x,y:e.y,t:0,ax:e.x-N.P.x,ay:e.y-N.P.y,big:D.elite||D.boss});
 for(let i=0;i<(D.elite?12:5);i++)N.pa.push({x:e.x,y:e.y-6,vx:R(-50,50),vy:R(-70,-10),l:R(.3,.6),c:pick(['#fff8a0','#f8e060','#ffffff'])});
 if(D.boss){win();return}
 if(D.xp)mote(e.x,e.y,D.xp);if(D.xp&&N.w[5]&&Math.random()<.12)mote(e.x+R(-6,6),e.y+R(-6,6),1);
 if(D.elite){N.elites++;N.it.push({k:'chest',x:e.x,y:e.y,t:0});for(let i=0;i<8;i++)mote(e.x+R(-16,16),e.y+R(-16,16),2);if(N.fr.length<2)N.fr.push({id:e.id,x:e.x,y:e.y,cd:1,tg:null,fx:-1});N.freeze=.08;N.shake=.3;
  banner(e.id+' REMEMBERS','IT WALKS WITH YOU NOW',2.5);snd(523,.1);later(()=>snd(784,.1),90);later(()=>snd(1047,.22),180)}
 else if(D.wisp){N.it.push({k:'chest',x:e.x,y:e.y,t:0});snd(1319,.1,1976,'sine',.05)}
 else{if(Math.random()<.012)N.it.push({k:'berry',x:e.x,y:e.y,t:0});say('calm',.045,()=>snd(R(700,980),.05,R(1100,1400),'sine',.03))}}
function mote(x,y,v){const N=RN;if(N.mo.length>240){const o=N.mo[RI(60)];o.v+=v;return}N.mo.push({x,y,v,pull:0,a:R(0,TAU)})}
function hurt(d){const N=RN;if(N.P.inv>0||N.won||N.dead)return;N.hp-=d;N.dmgTaken+=d;N.P.inv=.7;N.shake=.25;N.hurtT=.3;noise(.09,.4,500,'lowpass');snd(180,.12,90,'square',.05);
 if(N.hp<=0){N.hp=0;N.dead=.001;snd(220,.5,55,'sine',.08)}}
function gain(v){const N=RN;N.xp+=v*mul().mote;say('mote',.035,()=>snd(1320+Math.min(600,N.xp/N.need*600),.03,0,'sine',.025));
 while(N.xp>=N.need){N.xp-=N.need;N.lv++;N.need=Math.round(5+N.lv*5);N.queue++}}
function win(){const N=RN;N.won=.001;N.boss=null;N.freeze=.25;N.shake=.6;N.ep.length=0;for(const e of N.en)if(!e.gone)later(()=>{if(RN===N)calm(e)},R(100,900));
 snd(523,.12);later(()=>snd(659,.12),120);later(()=>snd(784,.12),240);later(()=>snd(1047,.5),360);banner('PYTHORN REMEMBERS','ITS SIGIL STONE GOES HOME TO THE LANTERN',5)}

/* ---------- the cards ---------- */
function options(){const N=RN,o=[];for(let t=0;t<6;t++)if(N.w[t]<5)o.push({k:'w',t,lv:N.w[t]});for(const p of PS)if(N.p[p.id]<p.max)o.push({k:'p',p,lv:N.p[p.id]});return o}
function deal(){const N=RN,o=options(),own=o.filter(q=>q.lv>0),c=[];
 /* at most four sprout kinds in a swarm, so a build takes shape */
 const kinds=N.w.filter(v=>v>0).length,ok=o.filter(q=>q.k!=='w'||q.lv>0||kinds<4);
 while(c.length<3&&ok.length){const src=own.length&&Math.random()<.45?own.filter(q=>ok.includes(q)):ok;if(!src.length){own.length=0;continue}const q=pick(src);ok.splice(ok.indexOf(q),1);const j=own.indexOf(q);if(j>=0)own.splice(j,1);c.push(q)}
 if(!c.length)c.push({k:'b'});G.cards=c;G.ci=0;G.lock=.45;G.s='cards';snd(784,.08);later(()=>snd(988,.08),70);later(()=>snd(1319,.2),140)}
function take(c){const N=RN;if(c.k==='w'){N.w[c.t]++;syncSwarm()}else if(c.k==='p'){N.p[c.p.id]++;if(c.p.id==='oil'){N.max+=20;N.hp=Math.min(N.max,N.hp+20)}if(c.p.id==='louie'&&!N.lou)N.lou={x:N.P.x-20,y:N.P.y,st:0,tg:null,n:0,v:0,fx:1}}else N.hp=Math.min(N.max,N.hp+30);
 N.queue--;snd(660,.06,990);if(N.queue>0)deal();else{G.s='play';N.P.inv=Math.max(N.P.inv,.6)}}
const cardName=c=>c.k==='w'?WP[c.t].n:c.k==='p'?c.p.n:'BERRIES';
const cardSub=c=>c.k==='b'?'':c.lv?'LV '+c.lv+' > '+(c.lv+1):'NEW';
const cardDesc=c=>c.k==='w'?(c.lv?WP[c.t].lv[c.lv]:WP[c.t].d):c.k==='p'?(c.p.lv?c.p.lv[c.lv]:c.p.d):'Everything is maxed. Eat. +30 light.';

/* ---------- update: play ---------- */
const near=(x,y,n,rad,skip)=>{const N=RN,o=[];for(const e of N.en){if(e.gone||(skip&&skip.has(e)))continue;const d=(e.x-x)*(e.x-x)+(e.y-y)*(e.y-y);if(d<rad*rad)o.push([d,e])}o.sort((a,b)=>a[0]-b[0]);return o.slice(0,n).map(q=>q[1])};
function weapons(dt){const N=RN,P=N.P,M=mul(),L=N.w;
 if(L[0]){N.wt[0]-=dt;if(N.wt[0]<=0){const lv=L[0],n=lv>=4?3:lv>=2?2:1,tg=near(P.x,P.y,n,150);if(tg.length){N.wt[0]=(lv>=5?.62:.9)*M.cd;
   tg.forEach((e,i)=>{const d=Math.hypot(e.x-P.x,e.y-P.y)||1;N.pr.push({t:0,x:P.x,y:P.y-6,vx:(e.x-P.x)/d*175,vy:(e.y-P.y)/d*175,l:1.1,dmg:lv>=5?17:lv>=3?13:10,pc:lv>=3?1:0,hs:new Set(),a:0})});say('th',.08,()=>snd(620,.04,860,'square',.018))}}}
 if(L[1]){N.wt[1]-=dt;if(N.wt[1]<=0){const lv=L[1],n=lv>=5?3:lv>=3?2:1,c=N.en.filter(e=>!e.gone&&Math.abs(e.x-P.x)<115&&Math.abs(e.y-P.y)<115);if(c.length){N.wt[1]=2.5*M.cd;
   for(let i=0;i<n;i++){const e=pick(c);N.lob.push({t:1,sx:P.x,sy:P.y-6,tx:e.x+e.kx*.1,ty:e.y,u:-i*.12,rad:lv>=5?40:lv>=2?32:25,dmg:lv>=4?40:24})}}}}
 if(L[2]){const lv=L[2],n=lv>=5?6:lv>=4?5:lv>=2?4:3,rad=lv>=3?40:31,dmg=lv>=3?12:9,sp=lv>=5?3.6:2.7;
  for(let i=0;i<n;i++){const a=N.t*sp+i*TAU/n,x=P.x+Math.cos(a)*rad,y=P.y-4+Math.sin(a)*rad;for(const e of N.en)if(!e.gone&&e.dh<=0&&Math.abs(e.x-x)<e.D.r+5&&Math.abs(e.y-6-y)<e.D.r+5){e.dh=.3;hit(e,dmg,Math.cos(a)*110,Math.sin(a)*110)}}}
 if(L[3]){N.wt[3]-=dt;if(N.wt[3]<=0){const lv=L[3],n=lv>=5?8:lv>=4?6:lv>=2?4:3,first=near(P.x,P.y,1,125)[0];if(first){N.wt[3]=(lv>=3?1.7:2.2)*M.cd;const seen=new Set(),pts=[[P.x,P.y-6]];let e=first;
   for(let i=0;i<n&&e;i++){seen.add(e);pts.push([e.x,e.y-6]);hit(e,lv>=5?17:12);e=near(e.x,e.y,1,85,seen)[0]}N.zl.push({pts,t:.2});snd(1500,.07,500,'sawtooth',.02)}}}
 if(L[4]){N.wt[4]-=dt;if(N.wt[4]<=0){const lv=L[4];N.wt[4]=(lv>=5?2.2:4.2)*M.cd;N.pt.push({x:P.x,y:P.y,rad:lv>=3?34:25,t:0,dur:lv>=2?5.5:4,dps:lv>=4?15:9,tk:0});snd(392,.08,523,'sine',.03)}}
 if(L[5]){N.wt[5]-=dt;if(N.wt[5]<=0){const lv=L[5],n=lv>=5?3:lv>=3?2:1,c=N.en.filter(e=>!e.gone&&Math.abs(e.x-P.x)<118&&Math.abs(e.y-P.y)<Math.min(140,H/2));if(c.length){N.wt[5]=2.8*M.cd;for(let i=0;i<n;i++){const e=pick(c);N.st.push({x:e.x,y:e.y,t:.42+i*.1,rad:lv>=5?24:16,dmg:30})}}}}
 /* things in flight */
 for(const p of N.pr){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;p.a+=dt*14;for(const e of N.en)if(!e.gone&&!p.hs.has(e)&&Math.abs(e.x-p.x)<e.D.r+3&&Math.abs(e.y-6-p.y)<e.D.r+4){p.hs.add(e);hit(e,p.dmg,p.vx*.35,p.vy*.35);if(p.pc-->0)continue;p.l=0;break}}
 N.pr=N.pr.filter(p=>p.l>0);
 for(const b of N.lob){b.u+=dt/.55;if(b.u>=1){b.done=1;N.fx.push({k:'thump',x:b.tx,y:b.ty,rad:b.rad,t:0});N.shake=Math.max(N.shake,.12);say('thump',.06,()=>{noise(.1,.35,300,'lowpass');snd(110,.1,55,'sine',.06)});
   for(const e of N.en){if(e.gone)continue;const dx=e.x-b.tx,dy=e.y-b.ty,d=Math.hypot(dx,dy);if(d<b.rad+e.D.r)hit(e,b.dmg,dx/(d||1)*130,dy/(d||1)*130)}}}
 N.lob=N.lob.filter(b=>!b.done);
 for(const s of N.st){s.t-=dt;if(s.t<=0){s.done=1;N.fx.push({k:'star',x:s.x,y:s.y,rad:s.rad,t:0});say('star',.06,()=>snd(1568,.09,784,'triangle',.04));for(const e of N.en)if(!e.gone&&Math.hypot(e.x-s.x,e.y-s.y)<s.rad+e.D.r)hit(e,s.dmg)}}
 N.st=N.st.filter(s=>!s.done);
 for(const q of N.pt){q.t+=dt;q.tk-=dt;const tick=q.tk<=0;if(tick)q.tk=.25;for(const e of N.en){if(e.gone)continue;if(Math.hypot(e.x-q.x,e.y-q.y)<q.rad+e.D.r){e.slow=.2;if(tick)hit(e,q.dps*.25,0,0,1)}}
  if(Math.hypot(P.x-q.x,P.y-q.y)<q.rad)N.hp=Math.min(N.max,N.hp+1.2*dt)}
 N.pt=N.pt.filter(q=>q.t<q.dur);for(const z of N.zl)z.t-=dt;N.zl=N.zl.filter(z=>z.t>0)}
function enemies(dt){const N=RN,P=N.P;
 for(const e of N.en){if(e.gone)continue;const D=e.D;let dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
  if(e.fl>0)e.fl-=dt;if(e.dh>0)e.dh-=dt;if(e.slow>0)e.slow-=dt;e.a+=dt;
  if(!D.boss&&d>330){const a=R(0,TAU),q=Math.hypot(W,H)/2+24;e.x=P.x+Math.cos(a)*q;e.y=P.y+Math.sin(a)*q;continue}
  let vx=dx/d,vy=dy/d,sp=e.spd*(e.slow>0?.5:1);
  if(e.stun>0){e.stun-=dt;sp=0}
  else if(D.ai==='zig'){const s=Math.sin(e.a*5)*.9;vx+=-dy/d*s;vy+=dx/d*s}
  else if(D.ai==='charge'){e.cd-=dt;if(e.ph===0&&d<85&&e.cd<=0){e.ph=1;e.pt=.5;e.cx=vx;e.cy=vy}
   if(e.ph===1){sp=0;e.pt-=dt;if(e.pt<=0){e.ph=2;e.pt=.42}}else if(e.ph===2){vx=e.cx;vy=e.cy;sp=165;e.pt-=dt;if(e.pt<=0){e.ph=0;e.cd=2.6}}}
  else if(D.ai==='flee'){e.life-=dt;if(e.life<=0){e.gone=1;N.fx.push({k:'poof',x:e.x,y:e.y,t:0});continue}if(d<110){vx=-vx;vy=-vy}else{vx=Math.cos(e.a*.7);vy=Math.sin(e.a*.9);sp*=.4}}
  else if(D.ai==='boss')sp=bossAI(e,dt,dx/d,dy/d,d,sp);
  if(D.ai==='boss'&&e.ph===2){vx=e.cx;vy=e.cy}
  e.x+=(vx*sp+e.kx)*dt;e.y+=(vy*sp+e.ky)*dt;const f=Math.pow(.004,dt);e.kx*=f;e.ky*=f;if(Math.abs(vx)>.2&&sp>0)e.fx=vx>0?1:-1;
  if(D.dmg&&d<D.r+6&&e.stun<=0)hurt(D.dmg)}
 /* shoulder room: buddies do not stand on each other */
 const E=N.en;for(let i=0;i<E.length;i++){const a=E[i];if(a.gone||a.D.boss)continue;for(let j=i+1;j<E.length;j++){const b=E[j];if(b.gone)continue;const dx=b.x-a.x,dy=b.y-a.y,m=a.D.r+b.D.r;if(Math.abs(dx)>=m||Math.abs(dy)>=m)continue;const d=Math.hypot(dx,dy)||.01;if(d<m){const k=(m-d)/d*.5*(b.D.boss?2:1);a.x-=dx*k;a.y-=dy*k;if(!b.D.boss){b.x+=dx*k;b.y+=dy*k}}}}
 N.en=E.filter(e=>!e.gone);
 for(const q of N.ep){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt;if(Math.abs(q.x-P.x)<6&&Math.abs(q.y-(P.y-5))<7){q.l=0;hurt(10)}}N.ep=N.ep.filter(q=>q.l>0)}
/* PYTHORN: slithers after you, winds up and charges along a line, throws rings of thorns, calls the Hollow */
function bossAI(e,dt,ux,uy,d,sp){const N=RN;
 if(e.ph===0){e.cd-=dt;if(e.cd<=0){const k=(e.n=(e.n||0)+1)%3;if(k===1){e.ph=1;e.pt=.85;e.cx=ux;e.cy=uy;snd(147,.3,220,'sawtooth',.05)}else if(k===2){e.ph=3;e.pt=.6}else{e.ph=4;e.pt=.5}}return sp}
 if(e.ph===1){e.pt-=dt;if(e.pt>.25){e.cx=ux;e.cy=uy}if(e.pt<=0){e.ph=2;e.pt=.75;noise(.2,.4,400,'lowpass')}return 0}
 if(e.ph===2){e.pt-=dt;if(e.pt<=0){e.ph=0;e.cd=e.hp<e.max*.5?1.5:2.3}return 215}
 if(e.ph===3){e.pt-=dt;if(e.pt<=0){const n=e.hp<e.max*.5?14:10,o=R(0,TAU);for(let i=0;i<n;i++){const a=o+i/n*TAU;N.ep.push({x:e.x,y:e.y-10,vx:Math.cos(a)*62,vy:Math.sin(a)*62,l:4})}snd(330,.15,165,'square',.04);e.ph=0;e.cd=2}return sp*.3}
 e.pt-=dt;if(e.pt<=0){ring('MELONKIN',6,120);snd(196,.2,131,'sawtooth',.04);e.ph=0;e.cd=2.4}return sp*.3}
function others(dt){const N=RN,P=N.P,M=mul();
 /* motes */
 for(const m of N.mo){m.a+=dt*4;const dx=P.x-m.x,dy=P.y-6-m.y,d=Math.hypot(dx,dy)||1;if(!m.pull&&!m.held&&d<M.reach)m.pull=1;if(m.pull){m.pull+=dt*5;const s=Math.min(d,(90+m.pull*60)*dt);m.x+=dx/d*s;m.y+=dy/d*s;if(d<7){m.done=1;gain(m.v)}}}
 N.mo=N.mo.filter(m=>!m.done);
 /* berries and gifts */
 for(const it of N.it){it.t+=dt;if(Math.hypot(P.x-it.x,P.y-it.y)<13){it.done=1;if(it.k==='berry'){N.hp=Math.min(N.max,N.hp+18);snd(660,.08,990,'sine',.05);N.fx.push({k:'txt',s:'+18',x:P.x,y:P.y-18,t:0,c:'#ff8aa0'})}else{N.queue++;N.hp=Math.min(N.max,N.hp+15);G.gift=1;snd(988,.1);later(()=>snd(1319,.1),80);later(()=>snd(1760,.25),160)}}}
 N.it=N.it.filter(q=>!q.done);
 /* Louie fetches */
 const L=N.lou;if(L){const lv=N.p.louie,sp=lv>=2?150:112,capN=lv>=3?12:6,go=(x,y)=>{const dx=x-L.x,dy=y-L.y,d=Math.hypot(dx,dy)||1,s=Math.min(d,sp*dt);L.x+=dx/d*s;L.y+=dy/d*s;if(Math.abs(dx)>1)L.fx=dx>0?1:-1;return d};
  if(L.st===0){if(!L.tg||L.tg.done||L.tg.pull){L.tg=null;let bd=1e9;for(const m of N.mo){if(m.pull||m.held)continue;const d=(m.x-L.x)**2+(m.y-L.y)**2,dp=(m.x-P.x)**2+(m.y-P.y)**2;if(dp>50*50&&dp<230*230&&d<bd){bd=d;L.tg=m}}}
   if(L.tg){if(go(L.tg.x,L.tg.y)<6){L.tg.done=1;L.v+=L.tg.v;L.n++;L.tg=null;say('lou',.1,()=>snd(880,.03,0,'square',.02));if(L.n>=capN)L.st=1}}else if(L.n)L.st=1;else go(P.x-18*(P.fx||1),P.y+8)}
  else if(go(P.x,P.y)<10){gain(L.v);L.v=0;L.n=0;L.st=0;N.fx.push({k:'txt',s:'WOOF!',x:L.x,y:L.y-16,t:0,c:'#fff0d8'});snd(520,.05,390,'square',.03)}}
 /* calmed big ones that walk with you */
 for(const f of N.fr){f.cd-=dt;if(f.tg&&(f.tg.gone||Math.hypot(f.tg.x-P.x,f.tg.y-P.y)>120))f.tg=null;if(!f.tg&&f.cd<=0)f.tg=near(P.x,P.y,3,95).filter(e=>!N.fr.some(o=>o!==f&&o.tg===e))[0]||null;
  const tx=f.tg?f.tg.x:P.x+(f===N.fr[0]?-26:26),ty=f.tg?f.tg.y:P.y+14,dx=tx-f.x,dy=ty-f.y,d=Math.hypot(dx,dy)||1,s=Math.min(d,(f.tg?130:80)*dt);if(d>4){f.x+=dx/d*s;f.y+=dy/d*s;f.fx=dx>0?1:-1}
  if(f.tg&&d<f.tg.D.r+12&&f.cd<=0){hit(f.tg,26,dx/d*150,dy/d*150);f.cd=.7;f.tg=null}}
 /* the swarm: a loose crowd behind you; it surges on CHARGE */
 const c=N.ch,n=N.sw.length;for(const s of N.sw){const k=Math.sqrt(s.i+.6)*7,a=s.i*2.4+Math.sin(N.t*1.3+s.a)*.5;let tx=P.x-P.fx*(14+k*.5)+Math.cos(a)*k,ty=P.y+4-P.fy*(14+k*.5)+Math.sin(a)*k*.8;if(c){const f=Math.sin(Math.min(1,c.t/.4)*Math.PI)*62;tx+=c.dx*f;ty+=c.dy*f}
  const dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy);s.mv=d>2;const sp=Math.min(d,(c?330:60+d*5)*dt);if(d>.5){s.x+=dx/d*sp;s.y+=dy/d*sp}}
 for(const f of N.fx)f.t+=dt;N.fx=N.fx.filter(f=>f.t<(f.k==='calm'?1.1:f.k==='txt'?.8:.4));
 for(const p of N.pa){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=140*dt;p.l-=dt}N.pa=N.pa.filter(p=>p.l>0)}
function upPlay(dt){const N=RN,P=N.P;
 if(N.dead){N.dead+=dt;if(N.dead>2.4)finish(false);return}
 if(pressed('start')&&!N.won){G.s='pause';G.pi=0;snd(440,.05);return}
 if(N.freeze>0){N.freeze-=dt;return}
 if(N.won){N.won+=dt;dt*=.6;if(N.won>5.2){finish(true);return}}else N.t+=dt;
 if(N.ban){N.ban.t-=dt;if(N.ban.t<=0)N.ban=null}
 const M=mul();let mx=(keys.right?1:0)-(keys.left?1:0),my=(keys.down?1:0)-(keys.up?1:0);P.mv=mx||my?1:0;
 if(P.mv){const d=Math.hypot(mx,my);mx/=d;my/=d;P.fx=mx;P.fy=my;P.x+=mx*M.spd*dt;P.y+=my*M.spd*dt}
 if(P.inv>0)P.inv-=dt;if(N.hurtT>0)N.hurtT-=dt;if(N.shake>0)N.shake-=dt;if(N.p.tea)N.hp=Math.min(N.max,N.hp+.35*N.p.tea*dt);
 N.aCd-=dt;N.bCd-=dt;if(N.wh>0)N.wh-=dt;
 if(pressed('a')&&N.aCd<=0&&!N.won){N.aCd=7*M.cd;N.ch={t:0,dx:P.fx,dy:P.fy,hs:new Set()};P.inv=Math.max(P.inv,.45);noise(.18,.3,900);snd(330,.16,660,'square',.04)}
 if(pressed('b')&&N.bCd<=0&&!N.won){N.bCd=12*M.cd;N.wh=.5;for(const m of N.mo)if(!m.held)m.pull=1;for(const e of N.en){const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;if(d<86){hit(e,6,dx/d*170,dy/d*170);if(!e.D.boss)e.stun=.9}}snd(1568,.3,2093,'sine',.05);later(()=>snd(2093,.2,1568,'sine',.04),120)}
 if(N.ch){const c=N.ch;c.t+=dt;const f=Math.min(1,c.t/.4),hx=P.x+c.dx*(18+f*62),hy=P.y+c.dy*(18+f*62);for(const e of N.en)if(!e.gone&&!c.hs.has(e)&&Math.hypot(e.x-hx,e.y-hy)<30+e.D.r){c.hs.add(e);hit(e,22+N.lv*2.5,c.dx*190,c.dy*190)}if(c.t>.5)N.ch=null}
 if(!N.tip&&N.t>7&&SV.runs<=3&&!N.ban){N.tip=1;banner('A: CHARGE    B: WHISTLE','BOTH REFILL. USE THEM WHEN IT GETS CROWDED.',4)}
 director(dt);weapons(dt);enemies(dt);others(dt);
 const cx=P.x-W/2,cy=P.y-H/2;N.cam.x+=(cx-N.cam.x)*Math.min(1,dt*9);N.cam.y+=(cy-N.cam.y)*Math.min(1,dt*9);
 if(N.queue>0&&!N.dead&&!N.won&&G.s==='play')deal()}
function finish(won){const N=RN,seeds=Math.floor(N.calm/25)+Math.floor(N.t/30)+N.elites*3+(won?30:0);
 const rec=[];if(N.t>SV.best.t+.5){SV.best.t=Math.floor(N.t);if(!won)rec.push('LONGEST')}if(N.calm>SV.best.calm){SV.best.calm=N.calm;rec.push('MOST CALMED')}if(N.lv>SV.best.lv)SV.best.lv=N.lv;
 if(won)SV.wins++;SV.seeds+=seeds;store();G.rep={won,t:N.t,calm:N.calm,lv:N.lv,seeds,rec,first:won&&SV.wins===1,w:N.w.slice(),fr:N.fr.map(f=>f.id)};G.s='report';G.t=0;G.lock=.9}

/* ---------- update: menus ---------- */
const TMENU=()=>['START EXPEDITION','SUNKEEP','HOW IT WORKS','SWAP CARTRIDGE'];
const nav=(i,n,a='down',b='up')=>{if(pressed(a)){snd(520,.04);return(i+1)%n}if(pressed(b)){snd(520,.04);return(i+n-1)%n}return i};
function update(dt){H=A.H();G.t+=dt;if(G.lock>0)G.lock-=dt;if(G.noteT>0)G.noteT-=dt;
 switch(G.s){
 case 'title':{const M=TMENU();G.mi=nav(G.mi,M.length);if(pressed('a')||pressed('start')){snd(660,.06,880);const k=M[G.mi];if(k==='START EXPEDITION'){if(!SV.seen){G.s='story';G.ip=0}else{G.s='pick';G.si=SV.unl[SV.st]?SV.st:0}}else if(k==='SUNKEEP'){G.s='shop';G.ui=0}else if(k==='HOW IT WORKS'){G.s='how'}else A.eject()}break}
 case 'story':if(pressed('a')||pressed('start')){snd(440,.04);if(++G.ip>=STORY.length){SV.seen=1;store();G.s='pick';G.si=0}}else if(pressed('b')){SV.seen=1;store();G.s='pick';G.si=0}break;
 case 'how':if(pressed('a')||pressed('b')||pressed('start'))G.s='title';break;
 case 'pick':G.si=nav(G.si,6,'right','left');if(pressed('down')){G.si=(G.si+3)%6;snd(520,.04)}if(pressed('up')){G.si=(G.si+3)%6;snd(520,.04)}if(pressed('b'))G.s='title';
  if(pressed('a')||pressed('start')){if(SV.unl[G.si]){snd(784,.08,1175);newRun(G.si);G.s='play'}else if(SV.seeds>=UNLOCK){SV.seeds-=UNLOCK;SV.unl[G.si]=1;store();snd(784,.1);later(()=>snd(1175,.2),100);note(TY[G.si].n+' SPROUTS WILL LEAD NOW')}else{snd(140,.1);note('NEEDS '+UNLOCK+' SEEDS. YOU HAVE '+SV.seeds)}}break;
 case 'shop':G.ui=nav(G.ui,UPS.length);if(pressed('b')||pressed('start'))G.s=G.rep&&G.from==='report'?'report':'title';
  if(pressed('a')){const u=UPS[G.ui],lv=SV.up[u.id];if(lv>=3){snd(140,.1);note('ALREADY AS GOOD AS IT GETS')}else if(SV.seeds<u.c[lv]){snd(140,.1);note('NEEDS '+u.c[lv]+' SEEDS')}else{SV.seeds-=u.c[lv];SV.up[u.id]++;store();snd(784,.1);later(()=>snd(1175,.2),100);note(u.n+' LV '+SV.up[u.id])}}break;
 case 'play':upPlay(dt);break;
 case 'cards':{const n=G.cards.length;G.ci=nav(G.ci,n);if(G.lock<=0){if(pressed('a'))take(G.cards[G.ci]);else if(pressed('sel')&&RN.rr>0&&G.cards[0].k!=='b'){RN.rr--;deal();G.lock=.25}}break}
 case 'pause':G.pi=nav(G.pi,3);if(pressed('start')||pressed('b'))G.s='play';else if(pressed('a')){snd(660,.06,880);if(G.pi===0)G.s='play';else if(G.pi===1){const s=RN.start;newRun(s);G.s='play'}else finish(false)}break;
 case 'report':if(G.lock<=0){if(pressed('a')||pressed('start')){snd(784,.08,1175);newRun(RN?RN.start:0);G.s='play'}else if(pressed('b')){G.s='shop';G.ui=0;G.from='report'}else if(pressed('sel')){G.s='title';G.from=''}}break}}
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
 for(const q of N.pt){const x=q.x-cx,y=q.y-cy,k=Math.min(1,q.t*4)*Math.min(1,(q.dur-q.t)*2);g.globalAlpha=.3*k;g.fillStyle='#b0f090';g.beginPath();g.ellipse(x,y,q.rad,q.rad*.8,0,0,7);g.fill();g.globalAlpha=1;
  for(let i=0;i<7;i++){const a=i*.9+q.x,rr=q.rad*(.3+.6*((i*37)%10)/10)*k,fx=Math.round(x+Math.cos(a)*rr),fy=Math.round(y+Math.sin(a)*rr*.8);r('#2c6030',fx,fy-3,1,3);r(i%2?'#ffffff':'#f8e060',fx-1,fy-5,3,2)}}
 for(const s of N.st){const x=Math.round(s.x-cx),y=Math.round(s.y-cy);g.globalAlpha=.5;g.strokeStyle='#ffc8e8';g.lineWidth=1;g.beginPath();g.ellipse(x,y,s.rad*.8,s.rad*.5,0,0,7);g.stroke();g.globalAlpha=1}
 for(const b of N.lob){if(b.u<0)continue;const x=Math.round(b.tx-cx),y=Math.round(b.ty-cy);g.globalAlpha=.35;g.fillStyle='#181020';g.beginPath();g.ellipse(x,y,6+b.u*8,3+b.u*4,0,0,7);g.fill();g.globalAlpha=1}
 /* everything that stands, back to front */
 const Q=[];for(const e of N.en)Q.push([e.y,0,e]);for(const s of N.sw)Q.push([s.y,1,s]);for(const f of N.fr)Q.push([f.y,2,f]);if(N.lou)Q.push([N.lou.y,3,N.lou]);Q.push([P.y,4,P]);for(const f of N.fx)if(f.k==='calm')Q.push([f.y,5,f]);
 Q.sort((a,b)=>a[0]-b[0]);
 for(const [,k,o] of Q){
  if(k===0){const D=o.D,sz=D.sz,x=Math.round(o.x-cx),y=Math.round(o.y-cy);if(x<-40||x>W+40||y<-20||y>H+70)continue;const hop=o.stun>0?0:((o.a*7)|0)%2,wind=(D.ai==='charge'||D.boss)&&o.ph===1;
   r('rgba(0,0,0,.28)',x-(sz*.3|0),y-1,(sz*.6)|0,3);g.drawImage(bspr(o.id,sz,o.fl>0?2:1,o.fx>0),x-sz/2+(wind?Math.round(Math.sin(GT*60)*1.5):0),y-sz+2-hop,sz,sz)}
  else if(k===1){r('rgba(0,0,0,.25)',Math.round(o.x-cx)-3,Math.round(o.y-cy)+1,7,2);sprout(o.x-cx,o.y-cy+1,o.t,o.mv?((GT*10+o.a*3)|0)%2:0,1)}
  else if(k===2){const sz=30,x=Math.round(o.x-cx),y=Math.round(o.y-cy);r('rgba(0,0,0,.28)',x-9,y-1,18,3);g.drawImage(bspr(o.id,sz,0,o.fx>0),x-sz/2,y-sz+2-(((GT*8)|0)%2),sz,sz)}
  else if(k===3){const x=Math.round(o.x-cx),y=Math.round(o.y-cy),fr=((GT*10)|0)%2;r('rgba(0,0,0,.28)',x-8,y,17,2);try{g.drawImage((o.fx<0?A.LOU.l:A.LOU.r)[fr],x-10,y-12-fr)}catch(e){r('#e89040',x-8,y-10,16,10)}if(o.n)r('#fff8a0',x-1,y-16,3,3)}
  else if(k===4){const x=Math.round(P.x-cx),y=Math.round(P.y-cy);if(N.dead>1.2)continue;r('rgba(0,0,0,.3)',x-5,y-1,10,3);if(!(P.inv>0&&N.hurtT<=0&&((GT*20)|0)%2&&!N.ch)){const sp=willSpr();if(sp){const wy=y-14-(P.mv?((GT*9)|0)%2:0),o=outl(sp);g.drawImage(o,x-7,wy);g.drawImage(o,x-5,wy);g.drawImage(o,x-6,wy-1);g.drawImage(o,x-6,wy+1);g.drawImage(sp,x-6,wy)}else r('#30a898',x-4,y-12,8,12)}
   const lx=x+(P.fx<0?-9:7),ly=y-9;r(K,lx-1,ly-1,5,7);r('#f8e060',lx,ly,3,5);r('#fff8c0',lx+1,ly+1,1,2);r('#c04848',lx,ly-1,3,1)}
  else{const sz=o.big?o.sz:o.sz,d=Math.hypot(o.ax,o.ay)||1,run=Math.max(0,o.t-.35),x=Math.round(o.x-cx+o.ax/d*run*95),y=Math.round(o.y-cy+o.ay/d*run*95),hop=o.t<.35?Math.abs(Math.sin(o.t/.35*Math.PI*2))*5:((GT*12)|0)%2;
   g.globalAlpha=Math.max(0,Math.min(1,(1.1-o.t)*3));g.drawImage(bspr(o.id,sz,o.t<.07?2:0,o.ax>0),x-sz/2,y-sz+2-hop,sz,sz);if(o.t<.5){r('#f85888',x-1,y-sz-4-o.t*10,2,2);r('#f85888',x+2,y-sz-4-o.t*10,2,2);r('#f85888',x,y-sz-2-o.t*10,3,2)}g.globalAlpha=1}}
 /* in the air */
 if(N.w[2]){const lv=N.w[2],n=lv>=5?6:lv>=4?5:lv>=2?4:3,rad=lv>=3?40:31,sp=lv>=5?3.6:2.7;for(let i=0;i<n;i++){const a=t*sp+i*TAU/n;sprout(P.x+Math.cos(a)*rad-cx,P.y-1+Math.sin(a)*rad-cy,2,0,1)}}
 for(const p of N.pr)sprout(p.x-cx,p.y-cy+4,0,0,1);
 for(const b of N.lob){if(b.u<0)continue;const u=b.u,x=b.sx+(b.tx-b.sx)*u,y=b.sy+(b.ty-b.sy)*u-Math.sin(u*Math.PI)*46;sprout(x-cx,y-cy,1,0,1)}
 for(const s of N.st){const x=Math.round(s.x-cx),y=Math.round(s.y-cy-s.t*260);r('#ffc8e8',x,y-14,1,12);r('#f078c0',x-2,y-2,5,5);r('#ffffff',x-1,y-1,3,3);r('#ffffff',x,y-4,1,9);r('#ffffff',x-4,y,9,1)}
 for(const q of N.ep){const x=Math.round(q.x-cx),y=Math.round(q.y-cy);r('#181020',x-3,y-3,6,6);r('#c060ff',x-2,y-2,4,4);r('#f0c8ff',x-1,y-1,2,2)}
 for(const it of N.it){const x=Math.round(it.x-cx),y=Math.round(it.y-cy-Math.abs(Math.sin(it.t*4))*3);if(it.k==='berry')icon('berry',x-6,y-10);else{r(K,x-7,y-10,14,11);r('#c89050',x-6,y-9,12,9);r('#f8e060',x-6,y-6,12,2);r('#fff8c0',x-1,y-7,2,4);if(((GT*5)|0)%2){r('#ffffff',x+7,y-13,1,3);r('#ffffff',x+6,y-12,3,1)}}}
 /* the dark, with the light cut out of it */
 if(!LT){LT=document.createElement('canvas');LT.width=W;LT.height=304}
 const c=LT.getContext('2d'),dk=N.won?Math.max(0,.84-N.won*.3):.84;
 if(c&&c.createRadialGradient){c.globalCompositeOperation='source-over';c.clearRect(0,0,W,304);c.fillStyle='rgba(10,8,44,'+dk.toFixed(3)+')';c.fillRect(0,0,W,H);c.globalCompositeOperation='destination-out';
  const L=(x,y,rad,k=1)=>{if(x<-rad||y<-rad||x>W+rad||y>H+rad||rad<1)return;const gr=c.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(0,0,0,'+k+')');gr.addColorStop(.55,'rgba(0,0,0,'+(k*.7).toFixed(2)+')');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(x-rad,y-rad,rad*2,rad*2)};
  const lf=N.dead?Math.max(0,1-N.dead/1.2):1,pr=(44+52*(N.hp/N.max)+Math.min(22,N.sw.length*.9)+Math.sin(GT*7)*1.5)*lf;L(P.x-cx,P.y-6-cy,pr,1);
  if(N.ch){const f=Math.min(1,N.ch.t/.4);L(P.x+N.ch.dx*(18+f*62)-cx,P.y+N.ch.dy*(18+f*62)-cy,46,.9)}if(N.wh>0)L(P.x-cx,P.y-cy,90*(1-N.wh/.5)+40,.8*(N.wh/.5));
  for(const p of N.pr)L(p.x-cx,p.y-cy,16,.8);for(const q of N.pt)L(q.x-cx,q.y-cy,q.rad*1.5,.8);for(const z of N.zl)for(const p of z.pts)L(p[0]-cx,p[1]-cy,20,.8);
  for(const f of N.fx){if(f.k==='calm')L(f.x-cx,f.y-cy,(f.big?70:26)*Math.max(0,1-f.t),.9);else if(f.k==='thump'||f.k==='star')L(f.x-cx,f.y-cy,f.rad*1.6,.9*(1-f.t/.4))}
  for(const f of N.fr)L(f.x-cx,f.y-10-cy,26,.8);if(N.lou)L(N.lou.x-cx,N.lou.y-6-cy,14,.6);for(const it of N.it)L(it.x-cx,it.y-5-cy,15,.8);
  if(N.boss)L(N.boss.x-cx,N.boss.y-20-cy,30,.35);props(cx,cy,L);
  g.drawImage(LT,0,0,W,H,0,0,W,H)}
 /* what shows in the dark: eyes, motes, sparks */
 for(const e of N.en){const x=Math.round(e.x-cx),y=Math.round(e.y-cy),sz=e.D.sz;if(x<-10||x>W+10||y<0||y>H+30)continue;if(e.D.wisp){g.globalAlpha=.5+.2*Math.sin(GT*6);g.fillStyle='#f8e896';g.beginPath();g.arc(x,y-10,7,0,7);g.fill();g.globalAlpha=1;continue}
  const ey=y-Math.round(sz*.52),ex=x+e.fx*Math.round(sz*.14),w=sz>30?2:1,c2=e.D.elite||e.D.boss?'#ff70a0':'#c890ff';if(((e.a*1.3)|0)%9===0)continue;r(c2,ex-w-1,ey,w,w);r(c2,ex+1,ey,w,w)}
 for(const m of N.mo){const x=Math.round(m.x-cx),y=Math.round(m.y-cy+Math.sin(m.a)*1.5),b=m.v>2;r('#f8e060',x-1,y-1,b?3:2,b?3:2);r('#ffffff',x,y,1,1);if(b){r('#fff8a0',x,y-2,1,5);r('#fff8a0',x-2,y,5,1)}}
 for(const z of N.zl){g.globalAlpha=z.t/.2;g.strokeStyle='#fff8a0';g.lineWidth=2;g.beginPath();z.pts.forEach((p,i)=>{const x=p[0]-cx+(i?R(-2,2):0),y=p[1]-cy+(i?R(-2,2):0);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke();g.globalAlpha=1}
 for(const f of N.fx){const x=f.x-cx,y=f.y-cy;if(f.k==='thump'||f.k==='star'){g.globalAlpha=1-f.t/.4;g.strokeStyle=f.k==='star'?'#ffc8e8':'#dce2ea';g.lineWidth=2;g.beginPath();g.ellipse(x,y,f.rad*(.4+f.t*1.5),f.rad*(.3+f.t*1.1),0,0,7);g.stroke();g.globalAlpha=1}
  else if(f.k==='txt')text(f.s,Math.round(x-tw(f.s,1)/2),Math.round(y-f.t*14),1,f.c);else if(f.k==='poof'){g.globalAlpha=1-f.t/.4;r('#f8e896',x-2-f.t*20,y-10,2,2);r('#f8e896',x+f.t*20,y-12,2,2);g.globalAlpha=1}}
 for(const p of N.pa)r(p.c,Math.round(p.x-cx),Math.round(p.y-cy),2,2);
 if(N.wh>0){g.globalAlpha=N.wh/.5;g.strokeStyle='#fff8a0';g.lineWidth=2;g.beginPath();g.arc(P.x-cx,P.y-cy,86*(1-N.wh/.5)+8,0,7);g.stroke();g.globalAlpha=1}
 if(N.boss&&N.boss.ph===1){const b=N.boss;g.globalAlpha=.35+.25*Math.sin(GT*30);g.strokeStyle='#ff70a0';g.lineWidth=3;g.beginPath();g.moveTo(b.x-cx,b.y-8-cy);g.lineTo(b.x+b.cx*170-cx,b.y-8+b.cy*170-cy);g.stroke();g.globalAlpha=1}
 if(N.won){const u=N.won,x=W/2,y=H/2-30-Math.min(60,u*14);if(u>.6){r(K,x-6,y-8,12,15);r('#98a0b0',x-5,y-7,10,13);r('#58c048',x-3,y-5,6,3);r('#f8e060',x-2,y-1,4,5);r('#fff8c0',x-1,y,2,2);if(((GT*8)|0)%2){r('#ffffff',x+7,y-10,1,3);r('#ffffff',x+6,y-9,3,1)}}}
 if(N.hurtT>0)r('rgba(255,60,90,'+(N.hurtT*.8).toFixed(2)+')',0,0,W,H);
 if(N.hp<N.max*.3&&!N.dead&&!N.won){const a=(.1+.08*Math.sin(GT*8)).toFixed(2);r('rgba(255,60,90,'+a+')',0,0,W,3);r('rgba(255,60,90,'+a+')',0,H-3,W,3);r('rgba(255,60,90,'+a+')',0,0,3,H);r('rgba(255,60,90,'+a+')',W-3,0,3,H)}
 hud();
 if(N.dead>.5){r('rgba(8,6,20,'+Math.min(.8,(N.dead-.5)).toFixed(2)+')',0,0,W,H);if(N.dead>1)ctext('THE LIGHT WENT OUT',H/2-10,3,'#c8c0d8')}}
function hud(){const N=RN,M=mul();
 r(K,0,0,W,3);r('#3a3060',0,0,W,2);r('#a8f080',0,0,Math.round(W*Math.min(1,N.xp/N.need)),2);
 r('rgba(12,10,24,.72)',0,3,W,21);
 /* light */
 r(K,4,7,5,9);r('#f8e060',5,9,3,6);r('#c04848',5,7,3,2);r(K,12,8,62,8);r('#3a2a2a',13,9,60,6);const f=N.hp/N.max;r(f<.3?'#ff5a6e':'#f8e060',13,9,Math.round(60*f),6);r('#fff8c0',13,9,Math.round(60*f),1);
 const tl=N.boss||N.won?'GUARDIAN':mmss(BOSS_AT-N.t);text(tl,Math.round(142-tw(tl,2)/2),6,2,N.boss?'#ff70a0':BOSS_AT-N.t<30?'#f8e060':'#ffffff');
 const cs=String(N.calm);text(cs,W-5-tw(cs,2),6,2,'#a8f080');r('#f85888',W-tw(cs,2)-17,9,2,2);r('#f85888',W-tw(cs,2)-14,9,2,2);r('#f85888',W-tw(cs,2)-17,10,5,2);r('#f85888',W-tw(cs,2)-16,12,3,1);r('#f85888',W-tw(cs,2)-15,13,1,1);
 text('LV'+N.lv,78,9,1,'#a8f080',null);
 /* the swarm you have built */
 let x=4;for(let t=0;t<6;t++)if(N.w[t]){r('rgba(12,10,24,.6)',x-1,26,13,15);sprout(x+5,36,t);for(let i=0;i<N.w[t];i++)r('#f8e060',x+i*2+1,38,1,2);x+=15}
 for(const p of PS)if(N.p[p.id]){r('rgba(12,10,24,.6)',x-1,26,13,15);g.save();g.translate(x,27);g.scale(.85,.85);icon(p.id,0,0);g.restore();for(let i=0;i<N.p[p.id];i++)r('#a8f080',x+i*2+1,38,1,2);x+=15}
 if(N.boss){const b=N.boss,w=W-40;r(K,19,H-52,w+2,8);r('#3a2040',20,H-51,w,6);r('#c060ff',20,H-51,Math.round(w*Math.max(0,b.hp/b.max)),6);r('#f0c8ff',20,H-51,Math.round(w*Math.max(0,b.hp/b.max)),1);ctext('PYTHORN  DIM GUARDIAN',H-63,1,'#f0c8ff')}
 /* A and B */
 const btn=(bx,lab,nm,cd,full,col)=>{const y=H-40,rdy=cd<=0;r(K,bx,y,56,16);r(rdy?col:'#2a2238',bx+1,y+1,54,14);if(!rdy)r('#4a4068',bx+1,y+1,Math.round(54*(1-cd/full)),14);text(lab,bx+4,y+2,2,rdy?'#fff':'#8f86a8',rdy?K:null);text(nm,bx+15,y+4,1,rdy?'#fff':'#8f86a8',null)};
 btn(4,'B','WHISTLE',N.bCd,12*M.cd,'#3a3050');btn(W-60,'A','CHARGE',N.aCd,7*M.cd,'#e23b5e');
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
 try{const S=A.will();g.drawImage(S.pd,114,cy+6)}catch(e){}r(K,127,cy+10,5,7);r('#f8e060',128,cy+11,3,5);r('#fff8c0',129,cy+12,1,2);
 ctext('LIGHTSWARM',Math.max(4,cy-64),5,'#f8e060','#403010');ctext('AN EXPEDITION FROM SUNKEEP',Math.max(32,cy-36),1,'#a8f080',null);
 const M=TMENU(),y0=Math.min(H-M.length*19-16,cy+84);M.forEach((m,i)=>{const on=i===G.mi,y=y0+i*19;tile(44,y,152,17,on);const s=m;text(s,Math.round(120-tw(s,1)/2),y+4,1,on?'#281c30':'#d8d0ec',null)});
 text('SEEDS '+SV.seeds,5,H-12,1,'#f8e060',null);const b=SV.wins?'GUARDIANS LIT '+SV.wins:SV.best.t?'BEST '+mmss(SV.best.t):'VERTICAL SLICE';text(b,W-5-tw(b,1),H-12,1,'#8f86a8',null)}
function drawStory(){back();const p=STORY[G.ip],y=Math.round(H*.2);
 /* a small picture: the dark Lantern, or the swarm leaving the gate */
 r(K,30,y,180,70);r('#101028',31,y+1,178,68);r('#1c3a24',31,y+50,178,19);
 if(G.ip===0){r(K,112,y+18,16,34);r('#585070',114,y+20,12,30);r('#383048',116,y+24,8,12);r('#6c6488',108,y+14,24,5);for(let i=0;i<6;i++){r('#c890ff',44+i*27,y+44+(i%2)*6,1,1);r('#c890ff',47+i*27,y+44+(i%2)*6,1,1)}}
 else if(G.ip===4){g.drawImage(bspr('PYTHORN',48,1,0),96,y+8,48,48);r('#ff70a0',112,y+26,2,2);r('#ff70a0',118,y+26,2,2)}
 else{r('#f8e060',46,y+22,8,12);r('#fff8c0',48,y+24,3,5);r(K,48,y+34,4,18);g.globalAlpha=.25;g.fillStyle='#f8e060';g.beginPath();g.arc(50,y+30,24,0,7);g.fill();g.globalAlpha=1;for(let i=0;i<9;i++)sprout(76+i*13+Math.sin(G.t*2+i)*2,y+60-(i%3)*3,[0,2,3,1,4,5][i%6],((G.t*8+i)|0)%2,1);try{g.drawImage(A.will().pr,196,y+42)}catch(e){}}
 if(p[1]){r('#f8e060',30,y+78,tw(p[1],1)+8,12);text(p[1],34,y+80,1,'#281c30',null)}
 wrap(p[0],184,1).forEach((l,i)=>text(l,30,y+96+i*12,1,'#ffffff',null));
 ctext('A: GO ON    B: SKIP    '+(G.ip+1)+' / '+STORY.length,H-14,1,'#8f86a8',null)}
function drawHow(){back();head('HOW IT WORKS');const L=['D-PAD: WALK. THAT IS ALL YOU STEER.','THE SPROUTS THROW LIGHT BY THEMSELVES.','LIT BUDDIES GO HOME CALM AND LEAVE MOTES.','MOTES LEVEL YOU UP: PICK 1 OF 3.','A: CHARGE. THE SWARM SURGES AHEAD.','B: WHISTLE. CALLS EVERY MOTE, SHOVES THE DARK.','YOUR LIGHT IS YOUR LIFE. IT SHRINKS AS IT DIMS.','AT 5:00 THE GUARDIAN WAKES. LIGHT IT.','SEEDS YOU BRING HOME BUY UPGRADES AT SUNKEEP.'];
 const dy=Math.min(18,(H-46)/L.length);L.forEach((l,i)=>{const y=Math.round(28+i*dy);r('#f8e060',6,y+3,3,3);if(tw(l,1)>W-18){g.save();g.translate(13,0);g.scale((W-18)/tw(l,1),1);text(l,0,y,1,'#ffffff',null);g.restore()}else text(l,13,y,1,'#ffffff',null)});ctext('A: BACK',H-13,1,'#8f86a8',null)}
function drawPick(){back();head('WHO LEADS THE SWARM?');seedsTag(5);const cw=74,chh=Math.min(62,Math.floor((H-96)/2));
 for(let t=0;t<6;t++){const x=6+(t%3)*(cw+3),y=26+((t/3)|0)*(chh+3),on=t===G.si,un=SV.unl[t];tile(x,y,cw,chh,on);if(un)sprout2(x+cw/2,y+chh/2+12,t,on&&((G.t*6)|0)%2);else{r(K,x+cw/2-5,y+chh/2-8,10,10);r('#585070',x+cw/2-4,y+chh/2-7,8,8);r(K,x+cw/2-1,y+chh/2-4,2,3)}
  const s=TY[t].n;text(s,Math.round(x+cw/2-tw(s,1)/2),y+3,1,on?'#281c30':un?'#d8d0ec':'#6c6488',null);const s2=un?'':UNLOCK+' SEEDS';if(s2)text(s2,Math.round(x+cw/2-tw(s2,1)/2),y+chh-13,1,on?'#281c30':'#8f86a8',null)}
 const y=30+2*(chh+3),w=WP[G.si];text(w.n,8,y,2,'#f8e060');let yy=y+15;wrap(w.d,224,1).forEach(l=>{text(l,8,yy,1,'#ffffff',null);yy+=11});yy+=4;w.lv.forEach((l,i)=>{if(yy<H-40){text('LV'+(i+1),8,yy,1,'#a8f080',null);text(l,34,yy,1,'#a8a0c0',null);yy+=11}});
 if(G.noteT>0)ctext(G.note,H-26,1,'#ff8aa0',null);ctext(SV.unl[G.si]?'A: GO    B: BACK':'A: UNLOCK    B: BACK',H-13,1,'#8f86a8',null)}
function drawShop(){back();head('SUNKEEP');seedsTag(5);const rh=Math.min(40,Math.floor((H-52)/UPS.length));
 UPS.forEach((u,i)=>{const y=25+i*rh,on=i===G.ui,lv=SV.up[u.id];tile(5,y,230,rh-3,on);text(u.n,10,y+3,1,on?'#281c30':'#f8e060',null);if(rh>=30)text(u.d,10,y+15,1,on?'#4a3a50':'#a8a0c0',null);
  for(let k=0;k<3;k++){r(K,170+k*8,y+4,6,6);r(k<lv?'#58c048':on?'#c8b060':'#2a2c46',171+k*8,y+5,4,4)}const c=lv>=3?'MAX':String(u.c[lv]);text(c,W-10-tw(c,1),y+3,1,on?'#281c30':SV.seeds>=u.c[lv]||lv>=3?'#a8f080':'#8f86a8',null)});
 if(G.noteT>0)ctext(G.note,H-26,1,'#ff8aa0',null);ctext('A: BUY    B: BACK',H-13,1,'#8f86a8',null)}
function drawCards(){drawPlay();r('rgba(8,6,24,.78)',0,0,W,H);const n=G.cards.length,chh=Math.min(64,Math.floor((H-62)/3)),y0=Math.round((H-(n*(chh+4))-34)/2)+26;
 ctext(G.gift?'A GIFT OF LIGHT':'LEVEL '+RN.lv+'!',y0-24,3,'#f8e060');
 G.cards.forEach((c,i)=>{const y=y0+i*(chh+4),on=i===G.ci;tile(8,y,224,chh,on);r(on?'#281c30':'#0c0a1c',12,y+4,22,chh-8);
  if(c.k==='w')sprout2(23,y+chh/2+10,c.t,on&&((G.t*6)|0)%2);else icon(c.k==='p'?c.p.id:'berry',17,y+chh/2-6);
  text(cardName(c),39,y+4,chh>=50?2:1,on?'#281c30':'#f8e060',null);const s=cardSub(c);if(s)text(s,W-13-tw(s,1),y+5,1,on?'#a02848':s==='NEW'?'#ff8aa0':'#a8f080',null);
  wrap(cardDesc(c),186,1).slice(0,chh>=50?3:2).forEach((l,k)=>text(l,39,y+(chh>=50?19:16)+k*11,1,on?'#281c30':'#d8d0ec',null))});
 const f=G.lock>0?'...':'A: TAKE IT'+(RN.rr>0&&G.cards[0].k!=='b'?'    SELECT: REROLL ('+RN.rr+')':'');ctext(f,Math.min(H-13,y0+n*(chh+4)+2),1,'#c8c0d8',null)}
function drawPause(){drawPlay();r('rgba(8,6,24,.8)',0,0,W,H);const y=Math.round(H*.2);ctext('PAUSED',y,3,'#f8e060');['RESUME','START OVER','GO HOME'].forEach((m,i)=>{const on=i===G.pi;tile(54,y+26+i*20,132,17,on);text(m,Math.round(120-tw(m,1)/2),y+30+i*20,1,on?'#281c30':'#d8d0ec',null)});
 const N=RN;let yy=y+94;for(let t=0;t<6;t++)if(N.w[t]&&yy<H-14){sprout(20,yy+9,t);text(WP[t].n+'  LV '+N.w[t],30,yy,1,'#ffffff',null);yy+=12}for(const p of PS)if(N.p[p.id]&&yy<H-14){text(p.n+'  LV '+N.p[p.id],30,yy,1,'#a8f080',null);yy+=12}}
function drawReport(){back();const R_=G.rep;head('EXPEDITION REPORT');let y=Math.round(Math.max(26,H*.12));
 ctext(R_.won?'THE HOLLOW REMEMBERS':'THE LIGHT WENT OUT',y,3,R_.won?'#f8e060':'#c8c0d8');y+=20;
 wrap(R_.won?(R_.first?'Pythorn curls back up on its circus trunk, bright again. One Sigil stone is home.':'Pythorn is lit again. Its stone hums at the Lantern.'):R_.t>=BOSS_AT?'So close. Pythorn was awake. Louie dragged you home by the collar.':'Louie dragged you home by the collar. The sprouts walked back by themselves.',220,1).forEach(l=>{ctext(l,y,1,'#ffffff',null);y+=11});y+=6;
 const rows=[['LASTED',mmss(R_.t)],['BUDDIES CALMED',String(R_.calm)],['LEVEL',String(R_.lv)]];rows.forEach(q=>{tile(30,y,180,15,0);text(q[0],36,y+3,1,'#d8d0ec',null);text(q[1],W-36-tw(q[1],1),y+3,1,'#f8e060',null);y+=17});
 tile(30,y,180,19,1);icon('seed',34,y+3);text('SEEDS HOME',50,y+5,1,'#281c30',null);const s='+'+R_.seeds;text(s,W-36-tw(s,2),y+4,2,'#281c30',null);y+=25;
 if(R_.rec.length&&y<H-40){ctext('NEW RECORD: '+R_.rec.join(', '),y,1,'#ff8aa0',null);y+=13}
 let x=120-(R_.w.filter(v=>v).length*14)/2;if(y<H-34)for(let t=0;t<6;t++)if(R_.w[t]){sprout(x+6,y+12,t,0,1);x+=14}
 if(G.lock<=0){ctext('A: GO AGAIN',H-26,2,'#f8e060');ctext('B: SUNKEEP ('+SV.seeds+' SEEDS)    SELECT: TITLE',H-12,1,'#8f86a8',null)}}
function draw(){H=A.H();
 switch(G.s){case 'title':drawTitle();break;case 'story':drawStory();break;case 'how':drawHow();break;case 'pick':drawPick();break;case 'shop':drawShop();break;case 'play':drawPlay();break;case 'cards':drawCards();break;case 'pause':drawPause();break;case 'report':drawReport();break}}

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
 _:{G,get RN(){return RN},get SV(){return SV},set SV(v){SV=v},WP,PS,UPS,EN,EVENTS,BOSS_AT,KEY,newRun,spawn,ring,calm,hit,hurt,gain,deal,take,options,finish,mul,store,near,syncSwarm}};
};
