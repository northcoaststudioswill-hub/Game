/* =====================================================================
   ROOTDEEP 64 — game
   Rootdeep v2.9's loop, ported rule for rule out of the Pocket Lantern
   cartridge: the Hearth, the Mirror, the Armory, keepsakes, the Sprout
   Ledger, the Pact, CHOOSE YOUR KEEPER, 12 chambers / 3 biomes, two
   waves, elites at 3/7/10, bosses at 4/8/12, two reward doors, boons,
   buds, banking on death. The simulation still runs on the cartridge's
   flat plane in the cartridge's units (speeds, ranges, damage are the
   original numbers); models.js stands it up in 3D.

   What changed for couch co-op (1-4 keepers, one screen, one run):
   - `P3` became `PL[]`. Everything that was "the player" is per-keeper:
     health, dash charges, cast ammo, combo, character.
   - The run itself is shared: petals, Moondew, keys, honey, boons, the
     bud string, the chamber count, the doors. One build, one goal.
   - Foes hunt the nearest standing keeper. A fallen keeper is revived
     by a teammate standing over them, and gets up at the next chamber.
     Death Defiance / Phoenix / Old Collar only fire to stop a wipe.
   - More keepers = a bigger chamber budget and tougher bosses.
   Solo plays exactly like the cartridge.
   ===================================================================== */
'use strict';
const W=280,H=230,HK=W/240; /* arena plane; HK maps the cartridge's 240-wide hub layout */
let state='title',time=0;

/* ---------------- sound (the console's own two voices) ---------------- */
let ac=null;
function audioWake(){try{if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(AC)ac=new AC()}if(ac&&ac.state==='suspended')ac.resume()}catch(e){}}
function snd(f,d=.08,f2=0,type='square',vol=.045){if(!ac||!RD.set.sfx)return;vol*=Math.pow(RD.set.sfx/10,1.5)*1.4;try{const o=ac.createOscillator(),ga=ac.createGain(),t=ac.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);ga.gain.setValueAtTime(vol,t);ga.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(ga);ga.connect(ac.destination);o.start(t);o.stop(t+d+.02);}catch(e){}}
function noise(d=.05,vol=.2,freq=2000,type='highpass'){if(!ac||!RD.set.sfx)return;try{const n=Math.ceil(ac.sampleRate*d),b=ac.createBuffer(1,n,ac.sampleRate),ch=b.getChannelData(0);for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),ga=ac.createGain();s.buffer=b;fl.type=type;fl.frequency.value=freq;ga.gain.value=vol*Math.pow(RD.set.sfx/10,1.5)*.5;s.connect(fl);fl.connect(ga);ga.connect(ac.destination);s.start()}catch(e){}}
function later(fn,ms){setTimeout(fn,ms)}
let musT=null;
function rdMusStart(){if(musT)return;const notes=[110,130.81,164.81,196,220,196,164.81,130.81,98,110,130.81,146.83];let i=0;
 musT=setInterval(()=>{try{if(!ac||!RD.set.mus||document.hidden)return;
  const o=ac.createOscillator(),ga=ac.createGain(),tt=ac.currentTime;o.type='triangle';
  const n=notes[i++%notes.length];o.frequency.setValueAtTime(n,tt);
  const v=0.045*Math.pow(RD.set.mus/10,1.5);ga.gain.setValueAtTime(v,tt);ga.gain.exponentialRampToValueAtTime(.001,tt+1.5);
  o.connect(ga);ga.connect(ac.destination);o.start(tt);o.stop(tt+1.55);
  if(i%4===1){const o2=ac.createOscillator(),g2=ac.createGain();o2.type='sine';o2.frequency.setValueAtTime(n/2,tt);g2.gain.setValueAtTime(v*1.3,tt);g2.gain.exponentialRampToValueAtTime(.001,tt+2.4);o2.connect(g2);g2.connect(ac.destination);o2.start(tt);o2.stop(tt+2.45)}}catch(e){}},680);}

/* ---------------- save / state ---------------- */
const SAVEKEY='rootdeep64-v1';
const RDDEF=()=>({dew:30,keys:1,honey:1,mirror:{},weapons:['blade'],weapon:'blade',keeps:{},keepXp:{},keepEq:'',
 pact:{},bounty:{},gift:{},seen:{},boonSeen:{},stats:{runs:0,deaths:0,escapes:0,kills:0,bosses:0,chambers:0},
 flags:{},lineIx:{},bank:{},party:[],set:null,chars:['WILL','WILL','WILL','WILL']});
let RD=RDDEF();
function rdLoad(){try{let s=JSON.parse(localStorage.getItem(SAVEKEY)||'null');
  /* first boot next to the cartridge: carry the cartridge save over (read-only, never written back) */
  if(!s){s=JSON.parse(localStorage.getItem('rootdeep-v1')||'null');if(s&&s.char)s.chars=[s.char,'WILL','WILL','WILL']}
  if(s)RD=Object.assign(RDDEF(),s)}catch(e){}
 RD.mirror=RD.mirror||{};RD.weapons=RD.weapons||['blade'];RD.keeps=RD.keeps||{};RD.keepXp=RD.keepXp||{};RD.bank=RD.bank||{};RD.party=RD.party||[];
 RD.pact=RD.pact||{};RD.bounty=RD.bounty||{};RD.gift=RD.gift||{};RD.seen=RD.seen||{};RD.boonSeen=RD.boonSeen||{};RD.lineIx=RD.lineIx||{};RD.flags=RD.flags||{};
 RD.chars=RD.chars||['WILL','WILL','WILL','WILL'];for(const k of['msn','echo','bossK','killK','diedTo','charEsc','charRun','seenN','godMet'])RD[k]=RD[k]||{};if(!RD.set)RD.set={mus:7,sfx:8,shake:true};
 RD.stats=Object.assign({runs:0,deaths:0,escapes:0,kills:0,bosses:0,chambers:0},RD.stats)}
rdLoad();
function rdSave(){try{localStorage.setItem(SAVEKEY,JSON.stringify(RD))}catch(e){}}
let RUN=null;
let uiSel=0,talkNPC=null,talkTxt='',talkStart=0,talkLine=0,boonOffer=[],shopItems=[],pauseSel=0,pausePage=0,codexPage=0,heatSel=0;
let overT=0,joinMsg='',joinT=0,diveT=0,talkEv=null,talkWho='',boonQuote='',boardSel=0,echoSel=0;
const heatTotal=()=>PACT.reduce((a,p)=>a+(RD.pact[p.id]||0),0);
const keepLv=who=>{const xp=RD.keepXp[who]||0;return xp>=50?3:xp>=25?2:1};
const hasKeep=id=>RD.keepEq===id;
const mir=id=>RD.mirror[id]||0;
const alive=()=>PL.filter(p=>!p.down);
const lead=()=>PL.find(p=>!p.down)||PL[0];
/* derived stats for one keeper in the current RUN (or hub preview) */
function rdStats(p){p=p||PL[0];const ch=p?p.char:'WILL';const b=RUN?RUN.boons:{atk:null,cast:null,dash:null,pass:[]};
 const pass=id=>b.pass.find(p=>p.id===id);
 const erin=hasKeep('flower');
 return{maxHp:100+mir('vit')*10+(pass('heart')?rdBoonVal(pass('heart')):0)+(erin?20:0)+(RUN&&RUN.bonusMax?RUN.bonusMax:0)+((ch==='LOUIE')?-20:(ch==='MARCUS')?25:0),
  dmgMul:(1+mir('might')*.05),
  atkMul:(1+(b.atk?rdBoonVal(b.atk)/100:0))*(ch==='MARCUS'?1.2:1), castMul:(1+(b.cast?rdBoonVal(b.cast)/100:0))*(hasKeep('stone')?1.2:1),
  speedMul:(1+mir('swift')*.04)*(pass('quick')?1+rdBoonVal(pass('quick'))/100:1)*(ch==='ERIN'?1.05:ch==='LOUIE'?1.15:ch==='MARCUS'?.93:1),
  armor:Math.min(.6,mir('skin')*.03+(pass('skin')?rdBoonVal(pass('skin'))/100:0)),
  crit:.05+(pass('stormluck')?rdBoonVal(pass('stormluck'))/100:0)+(b.atk&&b.atk.god==='LUCKY'?.12:0)+(RUN?budCount(5)*.05:0),
  castRegen:(pass('breath')?1+rdBoonVal(pass('breath'))/100:1), dashCharges:2+(pass('wind')?1:0),
  healMul:(pass('bloom')?1+rdBoonVal(pass('bloom'))/100:1)*((RD.pact.dry&&RUN)?0.7:1)};}
function rdBoonVal(b){if(!b)return 0;const def=b.kind==='core'?CORES[b.slot]:PASSES.find(p=>p.id===b.id);
 return Math.round(def.v*b.rar*(1+.18*(b.level-1)));}
function boonName(b){if(!b)return '';if(b.kind==='duo')return DUOS.find(d=>d.id===b.id).n;
 if(b.kind==='core')return CORES[b.slot].n[b.god];const p=PASSES.find(p=>p.id===b.id);return p?p.n:'';}
function boonDesc(b){if(!b)return '';
 if(b.kind==='duo')return DUOS.find(d=>d.id===b.id).d;
 const v=rdBoonVal(b);
 if(b.kind==='core'){const base=CORES[b.slot].d[b.god];return (b.slot==='atk'?'Attack +'+v+'%. ':'Cast +'+v+'%. ')+(b.slot==='dash'?'Dash power '+v+'. ':'')+base}
 const p=PASSES.find(p=>p.id===b.id);return p.d;}
/* heal one keeper, or (no keeper given) everyone still standing */
function rdHeal(n,p){if(!RUN)return;for(const q of(p?[p]:alive())){const s=rdStats(q);q.hp=Math.min(s.maxHp,q.hp+n*s.healMul)}}
function hasDuo(id){return RUN&&RUN.boons.pass.some(p=>p.kind==='duo'&&p.id===id);}
function hasGod(god){return RUN&&(RUN.boons.atk?.god===god||RUN.boons.cast?.god===god||RUN.boons.dash?.god===god||RUN.boons.pass.some(p=>p.god===god));}
/* ---------------- boon offers ---------------- */
function rollRar(){const r=Math.random()*100,luck=mir('luck')*3;
 return r<8+luck?2:r<38+luck?1:0;}
function mkBoon(god,kind,slotOrId){const rar=rollRar();RD.boonSeen[slotOrId+':'+(kind==='core'?god:slotOrId)]=1;
 if(kind==='core')return{kind,god,slot:slotOrId,level:1,rar:RARS[rar][1],rarN:RARS[rar][0]};
 if(kind==='duo'){const d=DUOS.find(x=>x.id===slotOrId);return{kind,god:d.gods[0],id:d.id,level:1,rar:1.45,rarN:'DUO'}}
 const p=PASSES.find(x=>x.id===slotOrId);const ex=RUN.boons.pass.find(x=>x.id===slotOrId);
 if(ex)return{kind:'passup',god:p.god,id:p.id,level:ex.level+1,rar:1,rarN:'LEVEL UP'};
 return{kind:'pass',god:p.god,id:p.id,level:1,rar:RARS[rar][1],rarN:RARS[rar][0]};}
function genOffer(god){god=god||GODIDS[(Math.random()*GODIDS.length)|0];boonQuote=godLine(god);const out=[],used=new Set();
 const slots=['atk','cast','dash'].filter(s=>!(RUN.boons[s]&&RUN.boons[s].god===god));
 for(const d of DUOS)if(!hasDuo(d.id)&&d.gods.every(g=>hasGod(g))){out.push(mkBoon(god,'duo',d.id));break}
 while(out.length<3){const roll=Math.random();
  if(roll<.55&&slots.length){const s=slots.splice((Math.random()*slots.length)|0,1)[0];out.push(mkBoon(god,'core',s))}
  else{const pool=PASSES.filter(p=>p.god===god&&!used.has(p.id));if(!pool.length&&slots.length){const s=slots.splice(0,1)[0];out.push(mkBoon(god,'core',s));continue}
   if(!pool.length)break;const p=pool[(Math.random()*pool.length)|0];used.add(p.id);out.push(mkBoon(god,'pass',p.id))}}
 return out.slice(0,3);}
function takeBoon(b){RD.stats.boons=(RD.stats.boons||0)+1;if(b.kind==='core'){RUN.boons[b.slot]=b}
 else if(b.kind==='pass'){RUN.boons.pass.push(b)}
 else if(b.kind==='duo'){RUN.boons.pass.push(b)}
 else if(b.kind==='passup'){const ex=RUN.boons.pass.find(x=>x.id===b.id);if(ex)ex.level=Math.min(5,ex.level+1)}
 snd(784,.12);later(()=>snd(1175,.25),110);}
function boonReturn(){if(RUN&&RUN.boonFrom==='shop'){RUN.boonFrom='';state='shop';return}
 RUN.boonFrom='';rdNextChamber();state='run';}
function applyFruit(){const owned=[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(b=>b&&b.level<5);
 if(owned.length){const b=owned[(Math.random()*owned.length)|0];b.level++;say2('SUNFRUIT: '+boonName(b)+' Lv'+b.level,3);return true}
 RUN.petals+=60;say2('NO BOON TO FEED. +60 PETALS',2);return false;}
/* ---------------- runs & chambers ---------------- */
function plRunInit(p){const s=rdStats(p);Object.assign(p,{hp:s.maxHp,down:false,revT:0,atkCd:0,combo:0,dtap:{},castAmmo:1+(hasKeep('stone')?1:0),castCd:0,castRegenT:0,
 dashT:0,dashRegen:0,dashCharges:s.dashCharges,inv:0,armT:0,slashT:0,swing:0,trail:[],vx:0,vy:0})}
function rdStartRun(){
 RUN={petals:20+mir('gold')*20,dew:0,keys:0,honey:0,chamber:0,wave2:null,sigShown:0,heat:heatTotal(),
  boons:{atk:null,cast:null,dash:null,pass:[]},enemies:[],projs:[],eprojs:[],pickups:[],parts:[],texts:[],doors:[],zones:[],hazards:[],buds:[],pods:[],dewT:0,podDropped:false,
  obst:[],sub:null,subQ:[],echo:null,mwT:0,acts:[],rings:[],bolts:[],freeze:0,flash:0,banner:null,phase:'fight',shake:0,boss:null,elite:false,revives:mir('defy'),collarUsed:false,phoenixUsed:false,time:0,zoneT:0,kills:0};
 for(const p of PL){plRunInit(p);movesReset(p,true)}
 let k=0;for(const ty of RD.party){if((RD.bank[ty]||0)>0){RD.bank[ty]--;const o=PL[k++%PL.length];RUN.buds.push({type:ty,x:o.x,y:o.y,a:Math.random()*6,cd:0,z:0,own:o.ix})}}
 RD.party=[];RD.stats.runs++;if(PL.length>1)RD.stats.coopRuns=(RD.stats.coopRuns||0)+1;for(const p of PL)RD.charRun[p.char]=1;rdSave();rdNextChamber();}
function rdArena(biome){RUN.obst=[];const n=2+((Math.random()*3)|0)+(PL.length>2?1:0);
 for(let i=0;i<n;i++){const w=14+((Math.random()*22)|0),h=10+((Math.random()*10)|0),x=22+Math.random()*(W-44-w),y=38+Math.random()*(H-70-h);
  if(Math.hypot(x+w/2-W/2,y+h/2-H/2)>34&&y+h<H-44)RUN.obst.push({x,y,w,h,biome,s:Math.random()});}
 PL.forEach((p,i)=>{p.x=W/2+(i-(PL.length-1)/2)*18;p.y=H-26;p.vx=p.vy=0;p.ax=0;p.ay=-1;p.land=.62+i*.08;p.cheer=0;p.swing=0;p.castA=0;p.selfieA=0;
  if(p.down){p.down=false;p.revT=0;p.hp=rdStats(p).maxHp*.3;p.inv=1}})}
function foeScale(){const ch=RUN.chamber;return{hp:1+.30*(ch-1)+.2*(RD.pact.hide||0),dmg:1+.09*(ch-1)+.15*(RD.pact.thorns||0),sp:1+.12*(RD.pact.rush||0)};}
function spawnFoe(kind,x,y,elite){const d=FOES[kind],sc=foeScale();
 const e={kind,x,y,hp:d.hp*sc.hp*(elite?2.6:1),max:d.hp*sc.hp*(elite?2.6:1),sp:d.sp*sc.sp*(0.9+Math.random()*.2),dmg:d.dmg*sc.dmg,r:d.r*(elite?1.35:1),
  elite:!!elite,t:Math.random()*2,cd:1+Math.random(),hitCd:0,burn:0,burnDps:0,chill:0,root:0,face:1,flash:0,state:0,sx:x,sy:y,bt:0,born:.5,yaw:0};
 RUN.enemies.push(e);RD.seen[kind]=1;return e;}
function spawnBoss(ix){const d=BOSSES[ix],sc=foeScale(),co=1+.75*(PL.length-1);
 const e={kind:'boss',bossIx:ix,x:W/2,y:52,hp:d.hp*(1+.12*RUN.heat)*co,max:d.hp*(1+.12*RUN.heat)*co,sp:d.sp,dmg:d.dmg*sc.dmg,r:d.r,
  elite:false,t:0,cd:2,hitCd:0,burn:0,burnDps:0,chill:0,root:0,face:1,flash:0,bt:3,phase:1,state:0,tx:W/2,ty:52,born:.8,yaw:0};
 RUN.enemies.push(e);RUN.boss=e;RD.seen[d.id]=1;RD.seenN[d.id]=(RD.seenN[d.id]||0)+1;bossSay(e,'intro');snd(110,.6,55,'sawtooth',.09);return e;}
let say2T=0,say2Txt='';
function say2(s,t=3){say2Txt=s;say2T=t;}
function rdNextChamber(){RUN.chamber++;RUN.phase='fight';RUN.doors=[];RUN.projs=[];RUN.eprojs=[];RUN.pickups=[];RUN.pods=[];RUN.zones=[];RUN.hazards=[];RUN.acts=[];RUN.podDropped=false;for(const p of PL)movesReset(p,false);
 const ch=RUN.chamber,biome=ch<=4?0:ch<=8?1:2;RUN.biome=biome;rdArena(biome);RUN.echo=null;RD.stats.maxCh=Math.max(RD.stats.maxCh||0,ch);for(const p of PL)p.lowSaid=false;
 if(ch===5)chatter('vault',true);else if(ch===9)chatter('core',true);else if(ch!==4&&ch!==8&&ch!==12)chatter('start');
 if(ch===4||ch===8||ch===12){spawnBoss(ch/4-1);RUN.zoneT=2.4;return}
 /* the cartridge's budget (4 + chamber), plus a share for every extra keeper */
 const pool=BIOMES[biome].pool,budget=4+ch+((RD.pact.swarm||0)*2)+Math.round((PL.length-1)*(2+ch*.5)),eliteCh=ch===3||ch===7||ch===10;
 let spent=0,guard=0;const wlist=[];
 while(spent<budget&&guard++<60){const k=pool[(Math.random()*pool.length)|0],cost=k==='grub'?1:k==='wisp'||k==='shade'?2:3;
  if(spent+cost>budget+1)continue;spent+=cost;wlist.push({k,elite:eliteCh&&spent>=budget-1});}
 const cut=Math.max(1,Math.ceil(wlist.length*.55));
 wlist.slice(0,cut).forEach(s2=>spawnFoe(s2.k,26+Math.random()*(W-52),36+Math.random()*(H*.45),s2.elite));
 RUN.wave2=wlist.length>cut?wlist.slice(cut):null;
 RUN.elite=eliteCh;RUN.zoneT=2;if(eliteCh)say2('AN ELITE GUARDS THIS CHAMBER',2);}
function chamberCleared(){RUN.phase='doors';RD.stats.chambers++;if(RUN.chamber<12)echoRoll(!!RUN.boss);if(!RUN.boss)chatter('clear');for(const p of PL)if(!p.down)p.cheer=1.1;
 if(!RUN.podDropped){RUN.pods.push({type:PODW[RUN.biome][(Math.random()*6)|0],x:W/2+R(-16,16),y:H/2});RUN.podDropped=true;ftext(W/2,H/2-16,'A SPROUT WAS HIDING HERE!','#a8f080')}
 if(RD.keepEq){const who=(KEEPS.find(k=>k.id===RD.keepEq)||{}).who;if(who)RD.keepXp[who]=(RD.keepXp[who]||0)+1}
 let heal=mir('mend')*3+(RUN.boons.pass.find(p=>p.id==='rain')?rdBoonVal(RUN.boons.pass.find(p=>p.id==='rain')):0);
 if(heal)rdHeal(heal);
 if(RUN.boss){bossDown(RUN.boss)}
 const ch=RUN.chamber;
 if(ch>=12){rdEscape();return}
 const kinds=['boon','boon','petals','dew','fruit','heart','shop','fountain','honey'];
 const pick=()=>kinds[(Math.random()*kinds.length)|0];let a=pick(),b=pick();if(b===a)b=pick();
 if(ch===3||ch===7||ch===11)a='boon';
 RUN.doors=[{kind:a,x:W/2-38,y:26},{kind:b,x:W/2+38,y:26}].map(d=>({...d,god:GODIDS[(Math.random()*GODIDS.length)|0],hold:0}));
 rdSave();}
function bossDown(e){RD.stats.bosses++;RUN.keys++;if(PL.length>1)RD.stats.coopBoss=(RD.stats.coopBoss||0)+1;const heat=RUN.heat,paid=RD.bounty[BOSSES[e.bossIx].id]||0,L=lead();
 let bonus=0;if(heat>paid){bonus=25*(heat-paid);RD.bounty[BOSSES[e.bossIx].id]=heat}
 RUN.dew+=40+bonus;say2(BOSSES[e.bossIx].s+' FALLEN!',3.2);
 ftext(L.x,L.y-16,'+1 KEY','#f8d030');if(bonus)ftext(L.x,L.y-26,'+'+bonus+' BOUNTY DEW','#7fd0e8');
 if(hasKeep('flower'))for(const p of alive())p.hp=rdStats(p).maxHp;
 RUN.boss=null;snd(392,.15);later(()=>snd(523,.15),130);later(()=>snd(659,.15),260);later(()=>snd(784,.4),390);}
function doorReward(d){snd(660,.08,990);
 if(d.kind==='boon'){RUN.boonFrom='door';boonOffer=genOffer(d.god);uiSel=0;state='boon';return}
 if(d.kind==='shop'){shopItems=genShop();uiSel=0;state='shop';return}
 if(d.kind==='petals'){const n=40+((Math.random()*30)|0);RUN.petals+=n;say2('+'+n+' PETALS',2)}
 if(d.kind==='dew'){const n=20+((Math.random()*15)|0);RUN.dew+=n;say2('+'+n+' MOONDEW',2)}
 if(d.kind==='fruit'){applyFruit()}
 if(d.kind==='heart'){RUN.bonusMax=(RUN.bonusMax||0)+25;rdHeal(25);say2('+25 MAX HEALTH (RUN)',2)}
 if(d.kind==='honey'){RUN.honey++;say2('+1 HONEY',2.5)}
 if(d.kind==='fountain'){for(const p of alive())rdHeal(rdStats(p).maxHp*.35,p);say2('THE FOUNTAIN MENDS YOU',2)}
 rdNextChamber();state='run';}
function genShop(){const all=[
 {n:'A BOON',d:'Random god, chosen now',p:150,act:()=>{RUN.boonFrom='shop';boonOffer=genOffer();uiSel=0;state='boon'}},
 {n:'SUNFRUIT',d:'Level up a random boon',p:100,act:()=>applyFruit()},
 {n:'BIG HEAL',d:'Restore 40% health',p:60,act:()=>{for(const p of alive())rdHeal(rdStats(p).maxHp*.4,p);say2('PATCHED UP',2)}},
 {n:'HONEY',d:'For gifts at the Hearth',p:80,act:()=>{RUN.honey++;say2('+1 HONEY',2)}},
 {n:'OLD KEY',d:'Unlocks weapons & doors above',p:120,act:()=>{RUN.keys++;say2('+1 KEY',2)}},
 {n:'PETAL PURSE',d:'+90 petals, somehow profit',p:50,act:()=>{RUN.petals+=90;say2('+90 PETALS',2)}}];
 const out=[];while(out.length<3){const it=all.splice((Math.random()*all.length)|0,1)[0];if(it)out.push(it)}return out;}
function runTally(){RD.stats.honeyFound=(RD.stats.honeyFound||0)+RUN.honey;RD.stats.maxBank=Math.max(RD.stats.maxBank||0,RUN.buds.length)}
function rdDie(){runTally();const by=RUN.boss?BOSSES[RUN.boss.bossIx].id:'deep';RD.diedTo[by]=(RD.diedTo[by]||0)+1;RD.stats.deaths++;RD.lastRun={chamber:RUN.chamber,kills:RUN.kills,dew:RUN.dew,petals:RUN.petals,heat:RUN.heat,by,spr:bankBuds()};RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey;RUN=null;rdSave();overT=0;state='over';snd(196,.5,49,'sawtooth',.08);}
function rdEscape(){runTally();RD.stats.heatEsc=Math.max(RD.stats.heatEsc||0,RUN.heat);for(const p of PL)RD.charEsc[p.char]=(RD.charEsc[p.char]||0)+1;RD.stats.escapes++;RD.lastRun={chamber:12,kills:RUN.kills,dew:RUN.dew,petals:RUN.petals,heat:RUN.heat,spr:bankBuds()};RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey;
 if(RD.stats.escapes===1)say2('FIRST ESCAPE!',5);
 RUN=null;rdSave();overT=0;state='win';snd(523,.15);later(()=>snd(659,.15),140);later(()=>snd(784,.15),280);later(()=>snd(1046,.5),420);}
function rdAbandon(){if(RUN){runTally();bankBuds();RD.dew+=RUN.dew;RD.keys+=RUN.keys;RD.honey+=RUN.honey}RUN=null;rdSave();state='hub';}

/* ---------------- the Hearth (hub) ---------------- */
const STATIONS=[{id:'mirror',n:'MIRROR OF DEW',l:'MIRROR',x:28*HK},{id:'arm',n:'ARMORY',l:'ARMORY',x:71*HK},{id:'keep',n:'KEEPSAKE SHELF',l:'SHELF',x:114*HK},{id:'codex',n:'CODEX',l:'CODEX',x:157*HK},{id:'heat',n:'HEAT GATE',l:'HEAT',x:200*HK}];
const NPCPOS={ERIN:[88,-100],LOUIE:[120,-46],RANGER:[188,-54],MARCUS:[206,-106],SCOUT:[34,-50]};
const HUBNPC={};
const NPCSPD={ERIN:32,LOUIE:46,RANGER:36,MARCUS:27,SCOUT:38};
const BED={x:41*HK,y:H-84},DOOR={x:W/2,y:H-13},BOARD={x:W/2+58,y:H-20};
function charUnlocked(id){if(id==='WILL')return true;if(id==='ERIN')return(RD.gift.ERIN||0)>=3;
 if(id==='LOUIE')return(RD.stats.budsBanked||0)>=20;if(id==='MARCUS')return(RD.stats.deaths||0)>=8;return false}
function charLockTxt(id){if(id==='ERIN')return 'GIVE ERIN HONEY AT THE HEARTH: '+(RD.gift.ERIN||0)+'/3';
 if(id==='LOUIE')return 'BANK SPROUTS FROM RUNS: '+(RD.stats.budsBanked||0)+'/20';
 if(id==='MARCUS')return 'HE TAKES OVER AFTER 8 DEATHS: '+(RD.stats.deaths||0)+'/8';return ''}
/* CHOOSE YOUR KEEPER — every joined keeper picks at once; dive when all are ready */
function charsEnter(){for(const p of PL){p.csel=Math.max(0,CHARS.findIndex(c=>c.id===(RD.chars[p.ix]||'WILL')));if(!charUnlocked(CHARS[p.csel].id))p.csel=0;p.ready=false}diveT=0;state='chars'}
function charsUpdate(dt){const np=pollJoin();if(np){np.csel=0;np.ready=false;snd(784,.08,1175);joinMsg='PLAYER '+(np.ix+1)+' JOINED';joinT=2}
 for(const p of PL.slice()){const d=p.dev;
  if(!p.ready){if(d.pr.down||d.pr.right||d.rp==='down'){p.csel=(p.csel+1)%CHARS.length;snd(520,.04)}if(d.pr.up||d.pr.left||d.rp==='up'){p.csel=(p.csel+CHARS.length-1)%CHARS.length;snd(520,.04)}
   if(d.pr.a){const c=CHARS[p.csel];if(charUnlocked(c.id)){p.char=c.id;RD.chars[p.ix]=c.id;p.ready=true;snd(784,.1);later(()=>snd(1175,.2),90)}else snd(140,.09)}
   else if(d.pr.b||d.pr.start&&PL.length===1&&false){if(p.ix===0){state='hub';return}dropPlayer(p);snd(330,.06)}}
  else if(d.pr.b){p.ready=false;diveT=0;snd(330,.05)}}
 if(PL.length&&PL.every(p=>p.ready)){diveT+=dt;if(diveT>(PL.length>1?.7:.05)){rdSave();rdStartRun();state='run'}}else diveT=0}
const NPCROUTE={
 ERIN:[[88,-100],[76,-84,1],[24,-112,1],[88,-100]],
 LOUIE:[[120,-46],'P3',[96,-64],[64,-44],'P3'],
 RANGER:[[188,-54],[168,-78],[196,-96],[188,-54]],
 MARCUS:[[206,-106],[196,-64],[172,-116],[206,-106]],
 SCOUT:[[34,-50],[140,-130,1],[52,-84,1],[34,-50]]};
function hubNpcReset(){for(const who of NPCS){const hx2=NPCPOS[who][0]*HK,hy=H+NPCPOS[who][1];
 const route=NPCROUTE[who].map(pt=>pt==='P3'?'P3':{x:pt[0]*HK,y:H+pt[1],act:!!pt[2]});
 HUBNPC[who]={x:hx2,y:hy,hx:hx2,hy,route,ri:0,jx:0,jy:0,act:0,wait:.3+Math.random()*.8,yaw:0,mv:0}}}
function hubEnter(){PL.forEach((p,i)=>{p.x=W/2+(i-(PL.length-1)/2)*20;p.y=H/2+16;p.vx=p.vy=0;p.down=false;p.ax=0;p.ay=1;p.dashT=0;p.inv=0;p.swing=0;p.castA=0;p.cheer=0;p.land=0;p.hurt=0;movesReset(p,true);p.char=RD.chars[p.ix]||'WILL';if(!charUnlocked(p.char))p.char='WILL'});hubNpcReset();state='hub';}
function movePlayer(p,dt,spd){let mx=p.dev.mx,my=p.dev.my;const l=Math.hypot(mx,my);
 const sp=spd*(rdStats(p).speedMul);
 if(l>0){const k=Math.min(1,l)/l;p.vx=mx*k*sp;p.vy=my*k*sp;p.fx=mx!==0?Math.sign(mx):p.fx;p.fy=my;p.anim+=dt*8*Math.min(1,l);p.mv=1}
 else{p.vx*=Math.max(0,1-dt*10);p.vy*=Math.max(0,1-dt*10);p.mv=0}
 p.x+=p.vx*dt;p.y+=p.vy*dt;
 p.x=Math.max(13,Math.min(W-13,p.x));p.y=Math.max(32,Math.min(H-11,p.y));
 if(RUN)for(const o of RUN.obst){const nx=Math.max(o.x,Math.min(p.x,o.x+o.w)),ny=Math.max(o.y,Math.min(p.y,o.y+o.h));
  const dx=p.x-nx,dy=p.y-ny,d=Math.hypot(dx,dy);if(d<7&&d>0){p.x=nx+dx/d*7;p.y=ny+dy/d*7}else if(d===0){p.y=o.y-7}}}
function hubTarget(p){let best=null,bd=17*17;
 for(const s of STATIONS){const d=(p.x-s.x)**2+(p.y-38)**2;if(d<bd){bd=d;best={kind:'station',id:s.id,n:s.n,x:s.x,y:38}}}
 for(const who of NPCS){const n2=HUBNPC[who],x=n2.x,y=n2.y;const d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best={kind:'npc',who,n:who,x,y}}}
 const db2=(p.x-BED.x)**2+(p.y-BED.y)**2;if(db2<bd){bd=db2;best={kind:'sprouts',n:'SPROUT LEDGER',x:BED.x,y:BED.y}}
 const dq=(p.x-BOARD.x)**2+(p.y-BOARD.y)**2;if(dq<bd){bd=dq;best={kind:'board',n:"KEEPER'S BOARD",x:BOARD.x,y:BOARD.y}}
 const d=(p.x-DOOR.x)**2+(p.y-DOOR.y)**2;if(d<bd)best={kind:'descend',n:'THE ROOT DOOR — DESCEND',x:DOOR.x,y:DOOR.y};
 return best;}
function hubUpdate(dt){if(pressed('sel')){rdSave();menuSel=0;state='menu';return}
 const np=pollJoin();if(np){np.x=W/2+R(-20,20);np.y=H/2+30;np.char=RD.chars[np.ix]||'WILL';if(!charUnlocked(np.char))np.char='WILL';snd(784,.08,1175);joinMsg='PLAYER '+(np.ix+1)+' JOINED';joinT=2.5}
 for(const p of PL){movePlayer(p,dt,84);aimVec(p)}
 for(const who of NPCS){const n=HUBNPC[who];if(!n)continue;
  if(n.act>0)n.act-=dt;n.mv=0;
  if(n.wait>0){n.wait-=dt;continue}
  let rp=n.route[n.ri],tx2,ty2;
  if(rp==='P3'){let q=PL[0],bd=1e9;for(const p of PL){const d=(p.x-n.x)**2+(p.y-n.y)**2;if(d<bd){bd=d;q=p}}tx2=q?q.x:n.hx;ty2=q?q.y:n.hy}else{tx2=rp.x+n.jx;ty2=rp.y+n.jy}
  const dx=tx2-n.x,dy=ty2-n.y,d=Math.hypot(dx,dy);
  if(d<(rp==='P3'?12:3)){n.act=rp!=='P3'&&rp.act?1.4:0;
   n.wait=who==='MARCUS'&&n.ri===0?1.2+Math.random()*1.4:.5+Math.random()*1.3;
   n.ri=(n.ri+1)%n.route.length;n.jx=R(-6,6);n.jy=R(-3,3)}
  else{const sp=NPCSPD[who]||32;n.x+=dx/d*sp*dt;n.y+=dy/d*sp*dt;n.yaw=Math.atan2(dx,dy);n.mv=1}}
 for(let i=0;i<NPCS.length;i++)for(let j=i+1;j<NPCS.length;j++){const a=HUBNPC[NPCS[i]],c=HUBNPC[NPCS[j]];if(!a||!c)continue;
  const dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy);if(d>0&&d<22){const push=(22-d)/2,ux=dx/d,uy=dy/d;a.x-=ux*push;a.y-=uy*push;c.x+=ux*push;c.y+=uy*push}}
 for(const who of NPCS){const n=HUBNPC[who];if(n){if(n.y>H-36)n.y=H-36;if(n.y<46)n.y=46;n.x=Math.max(12,Math.min(W-12,n.x))}}
 for(const p of PL){const t=hubTarget(p);p.hubT=t;
  if(t&&p.dev.pr.a){snd(520,.05);
   if(t.kind==='descend'){charsEnter();return}
   if(t.kind==='sprouts'){sprPage=0;uiSel=0;state='sprouts';return}
   if(t.kind==='board'){boardSel=0;state='board';return}
   if(t.kind==='npc'){talkNPC=t.who;uiSel=0;const n0=HUBNPC[t.who];if(n0)n0.yaw=Math.atan2(p.x-n0.x,p.y-n0.y);
    talkEv=storyNext(t.who);if(talkEv){talkLine=0;talkWho=talkEv.lines[0][0];talkTxt=talkEv.lines[0][1];RD.flags['met_'+t.who]=1;state='talk';return}talkWho=t.who;
    talkStart=RD.flags['met_'+t.who]?(RD.lineIx[t.who]||1)%LINES[t.who].length:0;
    RD.flags['met_'+t.who]=1;talkLine=0;talkTxt=LINES[t.who][talkStart];RD.lineIx[t.who]=talkStart+1;rdSave();
    const n=HUBNPC[t.who];if(n)n.yaw=Math.atan2(p.x-n.x,p.y-n.y);
    state='talk';return}
   uiSel=0;codexPage=0;heatSel=0;state=t.id;return}}}
function talkUpdate(){
 /* a story beat: A pages, B skips to the end (and still pays out) */
 if(talkEv){if(pressed('b')){storyFinish(talkEv);talkEv=null;state='hub';snd(330,.05);return}
  if(pressed('a')){talkLine++;if(talkLine>=talkEv.lines.length){storyFinish(talkEv);talkEv=null;state='hub'}else{talkWho=talkEv.lines[talkLine][0];talkTxt=talkEv.lines[talkLine][1];snd(520,.04)}}return}
 if(pressed('b')){state='hub';snd(330,.05);return}
 if(pressed('start')&&RD.honey>0&&talkNPC){const who=talkNPC,k=KEEPS.find(k=>k.who===who);
  RD.honey--;RD.gift[who]=(RD.gift[who]||0)+1;if(k&&!RD.keeps[k.id]){RD.keeps[k.id]=1;RD.keepXp[who]=RD.keepXp[who]||0;talkTxt=who+' gave you a keepsake: '+k.n+'! Equip it at the shelf.';snd(784,.12);later(()=>snd(1175,.25),110)}
  else{RD.dew+=5;talkTxt=who+' presses 5 Moondew into your hand. "For the road down."'}rdSave();return}
 if(pressed('a')){const L=LINES[talkNPC];talkLine++;
  if(talkStart+talkLine>=L.length){state='hub'}else{talkTxt=L[talkStart+talkLine];snd(520,.04)}return}}
function mirrorUpdate(){uiSel=nav(uiSel,MIRROR.length);
 if(pressed('a')){const m=MIRROR[uiSel],rank=mir(m.id);
  if(rank>=m.max){snd(140,.08)}else{const c=m.cost[rank];if(RD.dew>=c){RD.dew-=c;RD.mirror[m.id]=rank+1;rdSave();snd(784,.1);later(()=>snd(1175,.2),100)}else snd(140,.08)}}
 if(pressed('b')||pressed('start'))state='hub';}
function armUpdate(){const ids=Object.keys(WEAPONS);uiSel=nav(uiSel,ids.length);
 if(pressed('a')){const id=ids[uiSel],w=WEAPONS[id];
  if(RD.weapons.includes(id)){RD.weapon=id;rdSave();snd(660,.08,990)}
  else if(RD.keys>=w.cost){RD.keys-=w.cost;RD.weapons.push(id);RD.weapon=id;rdSave();snd(784,.12);later(()=>snd(1175,.25),110)}else snd(140,.08)}
 if(pressed('b')||pressed('start'))state='hub';}
function keepUpdate(){uiSel=nav(uiSel,KEEPS.length);
 if(pressed('a')){const k=KEEPS[uiSel];
  if(RD.keeps[k.id]){RD.keepEq=RD.keepEq===k.id?'':k.id;rdSave();snd(660,.08,990)}else snd(140,.08)}
 if(pressed('b')||pressed('start'))state='hub';}
function codexUpdate(){if(pressed('left')){codexPage=Math.max(0,codexPage-1);snd(520,.04)}if(pressed('right')){codexPage=Math.min(3,codexPage+1);echoSel=0;snd(520,.04)}
 if(codexPage===3){const found=ECHOES.filter(e=>RD.echo[e.id]);if(found.length){echoSel=nav(echoSel,found.length);if(pressed('a')){echoRead=found[echoSel];echoT=0;state='echo';return}}if(pressed('b')||pressed('start'))state='hub';return}
 if(pressed('b')||pressed('a')||pressed('start'))state='hub';}
function boardUpdate(){const L=openMissions();if(L.length)boardSel=nav(boardSel,L.length);if(pressed('b')||pressed('a')||pressed('start'))state='hub'}
function heatUpdate(){if(RD.stats.escapes<1){if(pressed('a')||pressed('b')||pressed('start'))state='hub';return}
 heatSel=nav(heatSel,PACT.length);const p=PACT[heatSel],cur=RD.pact[p.id]||0;
 if(pressed('right')&&cur<p.max){RD.pact[p.id]=cur+1;rdSave();snd(660,.06,880)}
 if(pressed('left')&&cur>0){RD.pact[p.id]=cur-1;rdSave();snd(440,.06)}
 if(pressed('b')||pressed('start'))state='hub';}
let boonT=0;
function boonUpdate(dt){boonT+=dt;uiSel=nav(uiSel,boonOffer.length);
 if(pressed('a')&&boonOffer.length&&boonT>.35){const b=boonOffer[uiSel];takeBoon(b);boonOffer=[];boonT=0;boonReturn();}}
function shopUpdate(){uiSel=nav(uiSel,shopItems.length+1);
 if(pressed('a')){if(uiSel===shopItems.length){rdNextChamber();state='run';return}
  const it=shopItems[uiSel];
  if(it.sold){snd(140,.08)}else if(RUN.petals>=it.p){RUN.petals-=it.p;it.sold=true;snd(700,.08,1100);it.act()}else snd(140,.08)}
 else if(pressed('b')){rdNextChamber();state='run'}}
function pauseUpdate(){if(pressed('b')){if(pausePage===1){pausePage=0}else state='run';return}
 if(pausePage===1){if(pressed('a')||pressed('start'))pausePage=0;return}
 pauseSel=nav(pauseSel,5);
 if(pressed('start')){state='run';return}
 if(pressed('a')){if(pauseSel===0)state='run';else if(pauseSel===1)pausePage=1;
  else if(pauseSel===2){setReturn='pause';uiSel=0;state='set'}
  else if(pauseSel===3){rdAbandon();hubEnter()}else{rdAbandon();menuSel=0;state='title'}}}

/* ---------------- intro cinematic ---------------- */
let rdCineT=0,rdCineIx=0,rdCineDest='hub';
function startCine(dest){rdCineIx=0;rdCineT=0;rdCineDest=dest;state='cine';snd(392,.3,196,'triangle',.05)}
function endCine(){RD.flags.cineSeen=1;rdSave();if(rdCineDest==='hub')hubEnter();else{menuSel=0;state='menu'}}
function cineUpdate(dt){rdCineT+=dt;const sc=RDCINE[rdCineIx];
 if(pressed('start')||pressed('sel')){endCine();return}
 if(pressed('a')){const seg=sc.d/sc.lines.length,cur=Math.min(sc.lines.length-1,Math.floor(rdCineT/seg));
  if(cur<sc.lines.length-1)rdCineT=(cur+1)*seg+.01;
  else{rdCineIx++;rdCineT=0;if(rdCineIx>=RDCINE.length){endCine();return}}}
 if(rdCineT>=sc.d){rdCineIx++;rdCineT=0;if(rdCineIx>=RDCINE.length)endCine()}}

/* ---------------- sprouts: the shared currency ---------------- */
const budCount=ty=>(RUN&&RUN.buds)?RUN.buds.filter(b=>b.type===ty).length:0;
const bankTotal=()=>Object.values(RD.bank).reduce((a,b)=>a+b,0);
function bankBuds(){if(!RUN||!RUN.buds)return 0;let n=0;for(const b of RUN.buds){RD.bank[b.type]=(RD.bank[b.type]||0)+1;n++}RD.stats.budsBanked=(RD.stats.budsBanked||0)+n;RUN.buds=[];return n}
let sprPage=0;
function sproutsUpdate(){const rows=sprPage===0?6:TRADES.length+SELLS.length;
 if(pressed('right')||pressed('left')){sprPage=sprPage?0:1;uiSel=0;snd(520,.05);return}
 uiSel=nav(uiSel,rows);
 if(pressed('a')){if(sprPage===0){const ty=uiSel;
   const inP=RD.party.filter(x=>x===ty).length;
   if(inP>0&&(RD.party.length<=inP||inP>=(RD.bank[ty]||0))){RD.party.splice(RD.party.lastIndexOf(ty),1);snd(440,.05)}
   else if(RD.party.length<3&&(RD.bank[ty]||0)>inP){RD.party.push(ty);snd(784,.06)}
   else snd(160,.08,0,'sawtooth',.05);rdSave()}
  else if(uiSel<TRADES.length){const tr=TRADES[uiSel];
   if((RD.bank[tr.g[0]]||0)>=tr.g[1]){RD.bank[tr.g[0]]-=tr.g[1];RD.bank[tr.t[0]]=(RD.bank[tr.t[0]]||0)+tr.t[1];snd(784,.08);later(()=>snd(1175,.15),90)}
   else snd(160,.08,0,'sawtooth',.05);rdSave()}
  else{const s=SELLS[uiSel-TRADES.length];
   if((RD.bank[s.ty]||0)>=1){RD.bank[s.ty]--;RD.dew+=s.dew;snd(980,.07,1470)}
   else snd(160,.08,0,'sawtooth',.05);rdSave()}}
 if(pressed('b')||pressed('start')){state='hub';rdSave()}}

/* ---------------- combat ---------------- */
function burst(x,y,c,n=6,sp=36){if(!RUN)return;for(let i=0;i<n;i++)RUN.parts.push({x,y,vx:R(-sp,sp),vy:R(-sp,sp),z:R(5,13),vz:R(8,sp*1.2),life:R(.25,.55),c});}
function ftext(x,y,txt,c){if(RUN)RUN.texts.push({x,y,txt,c:c||'#fff',t:.8});}
function collide(e,rr){e.x=Math.max(11+rr,Math.min(W-11-rr,e.x));e.y=Math.max(30+rr,Math.min(H-9-rr,e.y));
 for(const o of RUN.obst){const nx=Math.max(o.x,Math.min(e.x,o.x+o.w)),ny=Math.max(o.y,Math.min(e.y,o.y+o.h));
  const dx=e.x-nx,dy=e.y-ny,d=Math.hypot(dx,dy);if(d<rr&&d>0){e.x=nx+dx/d*rr;e.y=ny+dy/d*rr}}}
function aimVec(p){let ax=p.ax||0,ay=p.ay===undefined?1:p.ay;const mx=p.dev.mx,my=p.dev.my,l=Math.hypot(mx,my);
 if(l>0){ax=mx/l;ay=my/l;p.ax=ax;p.ay=ay}return[ax,ay];}
/* nearest standing keeper: who a foe hunts */
function tgt(e){let best=null,bd=1e12;for(const p of PL){if(p.down)continue;const d=(p.x-e.x)**2+(p.y-e.y)**2;if(d<bd){bd=d;best=p}}return best||PL[0]}
function hitEnemy(e,dmg,src,kx,ky,p){if(e.hp<=0)return;p=p||lead();const s=rdStats(p);let crit=Math.random()<s.crit;
 if(e.kind==='crab'&&e.state===1&&src!=='burn'&&src!=='heavy'&&src!=='super')dmg*=.35;
 if(src==='atk'&&e.kind==='boss'&&RUN.boons.pass.find(p=>p.id==='heavy'))dmg*=1+rdBoonVal(RUN.boons.pass.find(p=>p.id==='heavy'))/100;
 if(hasDuo('mudslide')&&e.chill>0)dmg*=1.3;
 dmg*=crit?2:1;e.hp-=dmg;e.flash=.12;if(src!=='super'&&src!=='reflect')meterGain(p,dmg*.22);
 if(kx){e.x+=kx;e.y+=ky;collide(e,e.r)}
 ftext(e.x+R(-4,4),e.y-e.r-4,Math.round(dmg)+(crit?'!':''),crit?'#ffd94d':src==='cast'||src==='special'?'#b0e0f8':src==='super'?'#ffb040':'#ffffff');
 burst(e.x,e.y,FOES[e.kind]?FOES[e.kind].c:'#fff',crit?7:4,30);snd(crit?900:520+Math.random()*80,.03);
 if(src==='atk'&&RUN.boons.atk){const g=RUN.boons.atk.god;
  if(g==='EMBER'){e.burn=3;e.burnDps=Math.max(e.burnDps,dmg*.22*(RUN.boons.pass.find(p=>p.id==='firewall')?1.6:1))}
  if(g==='DEW')e.chill=Math.max(e.chill,2.5);
  if(g==='ZIP'&&Math.random()<.28){let best=null,bd=70*70;for(const o of RUN.enemies)if(o!==e&&o.hp>0){const d=(o.x-e.x)**2+(o.y-e.y)**2;if(d<bd){bd=d;best=o}}
   if(best){best.hp-=dmg*.45;best.flash=.12;ftext(best.x,best.y-10,Math.round(dmg*.45),'#fff8a0');burst(best.x,best.y,'#f0d020',4,26);RUN.bolts=RUN.bolts||[];RUN.bolts.push({x:e.x,y:e.y,x2:best.x,y2:best.y,t:.14});if(best.hp<=0)killEnemy(best)}}
  if(g==='LEAF'&&Math.random()<.2)rdHeal(1,p);
  if(g==='PEB'){e.x+= (kx||0)*1.6;e.y+=(ky||0)*1.6;collide(e,e.r)}}
 if(e.hp<=0)killEnemy(e);}
function killEnemy(e){if(e.dead)return;e.dead=true;e.hp=0;RD.stats.kills++;RUN.kills++;
 if(e.kind==='boss'){const id=BOSSES[e.bossIx].id;RD.bossK[id]=(RD.bossK[id]||0)+1;bossSay(e,'down')}else{RD.killK[e.kind]=(RD.killK[e.kind]||0)+1;if(e.elite)RD.stats.elites=(RD.stats.elites||0)+1}burst(e.x,e.y,'#e8e4f5',10,44);snd(240,.12,90,'triangle',.06);
 if(e.kind==='boss'){for(const o of RUN.enemies)if(o!==e)o.hp=Math.min(o.hp,0),o.dead=true;RUN.enemies=RUN.enemies.filter(o=>o===e||!o.dead);RUN.enemies.splice(RUN.enemies.indexOf(e),1);
  RUN.pods.push({type:PODW[RUN.biome][(Math.random()*6)|0],x:e.x-6,y:e.y},{type:PODW[RUN.biome][(Math.random()*6)|0],x:e.x+6,y:e.y});RUN.podDropped=true;ftext(e.x,e.y-14,'SPROUT PODS!','#a8f080');RUN.shake=5;return}
 const ix=RUN.enemies.indexOf(e);if(ix>=0)RUN.enemies.splice(ix,1);
 const fortune=RUN.boons.pass.find(p=>p.id==='fortune')?1+rdBoonVal(RUN.boons.pass.find(p=>p.id==='fortune'))/100:1;
 const np=Math.round((2+Math.random()*3)*(e.elite?4:1)*fortune)+Math.min(3,budCount(4));
 for(let i=0;i<np;i++)RUN.pickups.push({kind:'petal',val:1,x:e.x+R(-5,5),y:e.y+R(-5,5),vx:R(-24,24),vy:R(-24,24)});
 if(Math.random()<.25*(hasKeep('jar')?1.35:1))RUN.pickups.push({kind:'dew',val:e.elite?6:2,x:e.x,y:e.y,vx:R(-16,16),vy:R(-16,16)});
 if(Math.random()<.06)RUN.pickups.push({kind:'heart',val:10,x:e.x,y:e.y,vx:0,vy:0});
 if(Math.random()<.02)RUN.pickups.push({kind:'honey',val:1,x:e.x,y:e.y,vx:0,vy:0});
 if(hasDuo('clover')&&Math.random()<.16)RUN.pickups.push({kind:'heart',val:8,x:e.x+R(-8,8),y:e.y+R(-6,6),vx:0,vy:0});
 if(e.elite||Math.random()<.25){RUN.pods.push({type:PODW[RUN.biome][(Math.random()*6)|0],x:e.x,y:e.y});RUN.podDropped=true;ftext(e.x,e.y-12,'SPROUT POD!','#a8f080');snd(1046,.07,1568)}}
function damagePlayer(p,n){if(!RUN||p.down||p.inv>0||p.dashT>0)return;const s=rdStats(p);
 const peb=RUN.buds&&(RUN.buds.find(b=>b.type===1&&b.cd<=0&&b.own===p.ix)||RUN.buds.find(b=>b.type===1&&b.cd<=0));
 if(peb){peb.cd=15;p.inv=.55;ftext(p.x,p.y-16,'PEB BLOCKED!','#dce2ea');burst(p.x,p.y,'#dce2ea',6,30);snd(520,.08,760);return}
 let d=n*(1-s.armor)*(p.armT>0?.5:1);
 p.hp-=d;p.inv=.55;p.hurt=.25;if(p.hp>0&&p.hp<s.maxHp*.3&&!p.lowSaid&&CHATTER[p.char]){p.lowSaid=true;sub(p.char,CHATTER[p.char].low[0],2.6,PCOL[p.ix])}p.charging=false;meterGain(p,d*.9);RUN.shake=Math.min(5,2.5);burst(p.x,p.y,'#ff7a6b',7,36);snd(170,.15,70,'sawtooth',.07);
 if(RUN.buds&&RUN.buds.length&&Math.random()<.3){let i=RUN.buds.length-1;for(let j=i;j>=0;j--)if(RUN.buds[j].own===p.ix){i=j;break}const lb=RUN.buds.splice(i,1)[0];ftext(p.x,p.y-20,TYPES[lb.type].n+' SCATTERED!','#f8a0c8');snd(340,.1,180)}
 if(hasKeep('charm')){for(const e of RUN.enemies.slice())if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+9)hitEnemy(e,9,'reflect',0,0,p)}
 if(p.hp<=0){
  /* co-op: a teammate still standing means you are only down, not out */
  if(PL.some(q=>q!==p&&!q.down)){p.hp=0;p.down=true;p.revT=0;p.dashT=0;p.zoom=null;p.dive=0;p.spA=0;p.supA=0;say2((PL.length>1?'P'+(p.ix+1)+' ':'')+'IS DOWN - STAND OVER THEM!',2.4);snd(196,.3,98,'sawtooth',.06);return}
  if(RUN.revives>0){RUN.revives--;p.hp=s.maxHp*.5;p.inv=2;say2('DEATH DEFIED!',3);burst(p.x,p.y,'#ffd94d',16,50);snd(784,.2);later(()=>snd(1175,.4),140)}
  else if(hasDuo('phoenix')&&!RUN.phoenixUsed){RUN.phoenixUsed=true;p.hp=s.maxHp*.4;p.inv=2;say2('PHOENIX BLOOM!',3);burst(p.x,p.y,'#f07830',16,50)}
  else if(hasKeep('collar')&&!RUN.collarUsed){RUN.collarUsed=true;p.hp=s.maxHp*.2;p.inv=2;say2('LOUIE HAULS YOU BACK!',3);burst(p.x,p.y,'#f8a0c8',14,46)}
  else rdDie();}}
function doAttack(p){const w=WEAPONS[RD.weapon],s=rdStats(p),[ax,ay]=aimVec(p),isLou=p.char==='LOUIE';p.atkCd=w.rate*(isLou?.72:1);
 noise(.045,.14,2400);p.combo=(p.combo+1)%(w.dmg.length);
 const base=w.dmg[p.combo]*s.dmgMul*s.atkMul*(isLou?.85:1);p.swing=Math.max(.3,w.rate*1.1);p.swingD=p.swing;
 if(w.proj){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*w.proj,vy:ay*w.proj,dmg:base,kind:'arrow',r:2,life:1.1,o:p});snd(740,.05,1200);return}
 let hit=false;for(const e of RUN.enemies.slice()){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);
  if(d<(isLou?Math.max(18,w.range-6):w.range)+e.r){const dot=(dx/(d||1))*ax+(dy/(d||1))*ay;if(dot>Math.cos(w.arc/2)||d<12){hitEnemy(e,base,'atk',(dx/(d||1))*(w.kb||40)*.06,(dy/(d||1))*(w.kb||40)*.06,p);hit=true}}}
 if(hit)snd(300,.05,180);
 if(hit&&p.char==='WILL'&&p.combo===2){burst(p.x,p.y-8,'#ffffff',10,34);ftext(p.x,p.y-24,'SELFIE!','#fff3b0');snd(1400,.06,2000,'square',.04);p.selfie=.18;p.selfieA=.6;
  for(const e of RUN.enemies.slice())if(Math.hypot(e.x-p.x,e.y-p.y)<34){e.root=Math.max(e.root,.5);hitEnemy(e,4,'sig',0,0,p)}}
 p.slashT=.12;p.slashAng=Math.atan2(ay,ax);}
function doDash(p){if(p.dashCharges<=0||p.dashT>0)return;const[ax,ay]=aimVec(p);
 p.dashCharges--;p.dashT=.15;p.dashRegen=.95;p.inv=Math.max(p.inv,.24);
 p.vx=ax*310;p.vy=ay*310;noise(.1,.16,1600);burst(p.x,p.y,'#a8d8ff',5,20);
 const b=RUN.boons.dash;if(!b)return;const g=b.god,v=rdBoonVal(b);
 if(g==='EMBER')RUN.zones.push({x:p.x,y:p.y,t:2.2,r:13,dps:v*1.6,friendly:true});
 if(g==='DEW'){for(const e of RUN.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<34)e.chill=Math.max(e.chill,2);RUN.rings=RUN.rings||[];RUN.rings.push({x:p.x,y:p.y,r:34,t:.3,c:'#7fd0e8'})}
 if(g==='ZIP'){let best=null,bd=95*95;for(const e of RUN.enemies){const d=(e.x-p.x)**2+(e.y-p.y)**2;if(d<bd){bd=d;best=e}}
  if(best){best.hp-=v*1.4;best.flash=.12;ftext(best.x,best.y-10,Math.round(v*1.4),'#fff8a0');burst(best.x,best.y,'#f0d020',6,30);RUN.bolts=RUN.bolts||[];RUN.bolts.push({x:p.x,y:p.y,x2:best.x,y2:best.y,t:.14});if(best.hp<=0)killEnemy(best)}}
 if(g==='PEB')p.armT=1.2;
 if(g==='LEAF')rdHeal(2+v*.12,p);
 if(g==='LUCKY'&&Math.random()<.35){p.dashCharges++;p.dashRegen=0}}
function doCast(p){const s=rdStats(p);if(p.castAmmo<=0||p.castCd>0)return;const[ax,ay]=aimVec(p);
 p.castAmmo--;p.castCd=.35;p.castRegenT=3.2/s.castRegen;snd(880,.07,1320,'triangle',.06);p.castA=.45;
 const god=RUN.boons.cast?RUN.boons.cast.god:'',mul=s.castMul;
 if(!god){const ch=p.char||'WILL';
  if(!RUN.sigShown){RUN.sigShown=1;say2(SIG[ch].n+'!',1.3)}
  if(ch==='WILL'){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*300,vy:ay*300,dmg:16*mul,kind:'laser',r:5,life:.8,o:p});burst(p.x,p.y,'#ffffff',5,26);snd(1200,.09,2400,'square',.05)}
  else if(ch==='ERIN')RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*165,vy:ay*165,dmg:14*mul,kind:'towel',r:9,life:.45,o:p});
  else if(ch==='LOUIE'){for(const e of RUN.enemies.slice())if(Math.hypot(e.x-p.x,e.y-p.y)<37){hitEnemy(e,10*mul,'sig',0,0,p);const dd=Math.hypot(e.x-p.x,e.y-p.y)||1;e.x+=(e.x-p.x)/dd*16;e.y+=(e.y-p.y)/dd*16;collide(e,e.r)}burst(p.x,p.y,'#f8a0c8',14,42);snd(180,.16,90,'sawtooth',.09);RUN.rings=RUN.rings||[];RUN.rings.push({x:p.x,y:p.y,r:37,t:.3,c:'#f8a0c8'})}
  else{RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*265,vy:ay*265,dmg:13*mul,kind:'jet',r:4,life:.9,o:p});snd(300,.1,700,'sawtooth',.04)}
  return}
 const nearest=(rad)=>{let best=null,bd=rad*rad;for(const e of RUN.enemies){const d=(e.x-p.x)**2+(e.y-p.y)**2;if(d<bd){bd=d;best=e}}return best};
 if(god==='ZIP'){const sorted=RUN.enemies.slice().sort((a,b)=>((a.x-p.x)**2+(a.y-p.y)**2)-((b.x-p.x)**2+(b.y-p.y)**2)).slice(0,3);
  for(const e of sorted){e.hp-=26*mul;e.flash=.15;ftext(e.x,e.y-12,Math.round(26*mul),'#fff8a0');burst(e.x,e.y,'#f0d020',7,34);RUN.bolts=RUN.bolts||[];RUN.bolts.push({x:e.x,y:e.y,sky:1,t:.18});if(e.hp<=0)killEnemy(e)}if(!sorted.length)snd(200,.08);return}
 if(god==='PEB'){const t=nearest(140);const x=t?t.x:p.x+ax*62,y=t?t.y:p.y+ay*62;
  RUN.hazards.push({x,y,t:.45,t0:.45,r:27,dmg:30*mul,from:'player',o:p});return}
 if(god==='LEAF'){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*215,vy:ay*215,dmg:16*mul,kind:'vine',r:3,life:1,o:p});return}
 if(god==='DEW'){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*185,vy:ay*185,dmg:15*mul,kind:'wave',r:8,life:.9,pierce:99,o:p});return}
 if(god==='EMBER'){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*225,vy:ay*225,dmg:20*mul,kind:'fire',r:4,life:1,o:p});return}
 if(god==='LUCKY'){RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*235,vy:ay*235,dmg:(6+Math.random()*58)*mul,kind:'wild',r:3,life:1,o:p});return}
 RUN.projs.push({x:p.x+ax*8,y:p.y+ay*8,vx:ax*230,vy:ay*230,dmg:18*mul,kind:'thorn',r:3,life:1,o:p});}
function projHit(p,e){const o=p.o||lead();
 if(p.kind==='fire'){for(const q of RUN.enemies.slice())if(Math.hypot(q.x-e.x,q.y-e.y)<32){q.burn=3;q.burnDps=Math.max(q.burnDps,p.dmg*.3);hitEnemy(q,q===e?p.dmg:p.dmg*.6,'cast',0,0,o)}burst(e.x,e.y,'#f07830',10,40);return true}
 hitEnemy(e,p.dmg,'cast',0,0,o);
 if(p.kind==='vine'){e.root=Math.max(e.root,1.6);RUN.pickups.push({kind:'heart',val:6,x:e.x+R(-6,6),y:e.y+R(-4,4),vx:0,vy:0})}
 if(p.kind==='wave'){e.chill=Math.max(e.chill,2.5);const d=Math.hypot(e.x-o.x,e.y-o.y)||1;e.x+=(e.x-o.x)/d*14;e.y+=(e.y-o.y)/d*14;collide(e,e.r)}
 if(p.kind==='towel'){e.root=Math.max(e.root,.35);const d=Math.hypot(e.x-o.x,e.y-o.y)||1;e.x+=(e.x-o.x)/d*20;e.y+=(e.y-o.y)/d*20;collide(e,e.r)}
 if(p.kind==='jet')e.chill=Math.max(e.chill,1.5);
 return (p.kind==='laser'||p.kind==='jet')?false:p.kind!=='wave';}

function foeMove(e,dt,tx,ty,sp){const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy)||1;
 const step=Math.min(d,sp*dt*(e.chill>0?.55:1));e.x+=dx/d*step;e.y+=dy/d*step;e.face=dx>0?1:-1;if(d>1)e.yaw=Math.atan2(dx,dy);e.mv=1;collide(e,e.r);return d;}
function touchHit(e,dmg){for(const p of PL){if(p.down)continue;const d=Math.hypot(p.x-e.x,p.y-e.y);
  if(d<e.r+7&&e.hitCd<=0&&p.inv<=0&&p.dashT<=0){e.hitCd=.85;const kx=(p.x-e.x)/(d||1)*90,ky=(p.y-e.y)/(d||1)*90;p.vx+=kx;p.vy+=ky;damagePlayer(p,dmg);if(!RUN)return}}}
function rdUpdFoe(e,dt){e.flash=Math.max(0,e.flash-dt);e.hitCd-=dt;e.cd-=dt;e.mv=0;if(e.born>0){e.born-=dt;return}
 if(e.burn>0){e.burn-=dt;e.hp-=e.burnDps*dt;if(Math.random()<dt*6)RUN.parts.push({x:e.x+R(-4,4),y:e.y,vx:0,vy:0,z:10,vz:22,life:.35,c:'#f07830',ng:1});
  if(e.hp<=0){killEnemy(e);return}}
 if(e.chill>0)e.chill-=dt;if(e.root>0){e.root-=dt;return}
 const T=tgt(e),d=Math.hypot(T.x-e.x,T.y-e.y),B=FOES[e.kind].b;
 if(B==='chase')foeMove(e,dt,T.x,T.y,e.sp);
 else if(B==='shoot'){if(d>105)foeMove(e,dt,T.x,T.y,e.sp);else if(d<70)foeMove(e,dt,e.x+(e.x-T.x),e.y+(e.y-T.y),e.sp);
  e.yaw=Math.atan2(T.x-e.x,T.y-e.y);
  if(e.cd<=0&&d<125){e.cd=1.9;e.spit=.25;const a=Math.atan2(T.y-e.y,T.x-e.x);RUN.eprojs.push({x:e.x,y:e.y,vx:Math.cos(a)*118,vy:Math.sin(a)*118,dmg:e.dmg,r:3});snd(340,.05,220)}}
 else if(B==='orbit'){const a=Math.atan2(e.y-T.y,e.x-T.x)+dt*.9,nx=T.x+Math.cos(a)*56,ny=T.y+Math.sin(a)*56;foeMove(e,dt,nx,ny,e.sp*1.4);
  if(e.cd<=0){e.cd=2.4;const an=Math.atan2(T.y-e.y,T.x-e.x);RUN.eprojs.push({x:e.x,y:e.y,vx:Math.cos(an)*125,vy:Math.sin(an)*125,dmg:e.dmg,r:3})}}
 else if(B==='shield'){e.t+=dt;e.state=(e.t%3.4)<2.2?1:0;foeMove(e,dt,T.x,T.y,e.sp*(e.state?0.7:1.25))}
 else if(B==='blink'){foeMove(e,dt,T.x,T.y,e.sp);
  if(e.cd<=0&&d>26){e.cd=2.3;burst(e.x,e.y,'#6a5a96',6,24);const a=Math.atan2(e.y-T.y,e.x-T.x);e.x=T.x+Math.cos(a)*20;e.y=T.y+Math.sin(a)*20;collide(e,e.r);burst(e.x,e.y,'#6a5a96',6,24);snd(980,.07,340)}}
 else if(B==='charge'){const st=e.state;
  if(st===0){foeMove(e,dt,T.x,T.y,e.sp);if(d<74&&e.cd<=0){e.state=1;e.t=.45}}
  if(st===1){e.t-=dt;e.x+=R(-.7,.7);e.yaw=Math.atan2(T.x-e.x,T.y-e.y);if(e.t<=0){e.state=2;e.t=.42;const a=Math.atan2(T.y-e.y,T.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a);snd(220,.08,110)}}
  if(st===2){e.t-=dt;e.x+=e.sx*175*dt;e.y+=e.sy*175*dt;e.mv=1;collide(e,e.r);if(e.t<=0){e.state=0;e.cd=1.3}}}
 /* touch damage */
 touchHit(e,e.dmg);}
function updBoss(e,dt){e.flash=Math.max(0,e.flash-dt);e.hitCd-=dt;e.cd-=dt;e.mv=0;if(e.born>0){e.born-=dt;return}e.bt-=dt;
 if(e.burn>0){e.burn-=dt;e.hp-=e.burnDps*dt;if(e.hp<=0){killEnemy(e);return}}
 if(e.chill>0)e.chill-=dt;if(e.root>0){e.root-=dt;return}
 const frac=e.hp/e.max;e.phase=frac>.66?1:frac>.33?2:3;if(e.phase>(e.phSaid||1)){e.phSaid=e.phase;bossSay(e,'p'+e.phase)}
 const T=tgt(e);
 const radial=n=>{for(let i=0;i<n;i++){const a=i/n*6.283+e.t;RUN.eprojs.push({x:e.x,y:e.y,vx:Math.cos(a)*95,vy:Math.sin(a)*95,dmg:e.dmg*.8,r:3})}snd(180,.15,90,'sawtooth',.06)};
 const aimed=(n,sp)=>{const base=Math.atan2(T.y-e.y,T.x-e.x);for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.22;RUN.eprojs.push({x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:e.dmg*.85,r:3})}};
 if(e.bossIx===0){ /* Grub Mother */
  if(e.state===1){e.t-=dt;e.x+=R(-1,1);e.yaw=Math.atan2(T.x-e.x,T.y-e.y);if(e.t<=0){e.state=2;e.t=.5;const a=Math.atan2(T.y-e.y,T.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a)}}
  else if(e.state===2){e.t-=dt;e.x+=e.sx*165*dt;e.y+=e.sy*165*dt;e.mv=1;collide(e,e.r);if(e.t<=0)e.state=0}
  else{foeMove(e,dt,T.x,T.y,e.sp);
   if(e.bt<=0){e.bt=e.phase===1?7:5;const adds=RUN.enemies.length-1;
    if(Math.random()<.5&&adds<4){for(let i=0;i<2;i++)spawnFoe('grub',e.x+R(-14,14),e.y+R(-10,10),false);say2('SHE CALLS HER CHILDREN',1.6)}
    else if(e.phase>=2)radial(10);else{e.state=1;e.t=.5}}}}
 else if(e.bossIx===1){ /* Drowned King */
  if(e.state===1){e.t-=dt;if(e.t<=0){e.x=e.tx;e.y=e.ty;e.state=0;RUN.shake=4;RUN.hazards.push({x:e.x,y:e.y,t:.05,t0:.05,r:26,dmg:e.dmg,from:'foe',instant:true});burst(e.x,e.y,'#7fd0e8',12,44);snd(120,.25,60,'sawtooth',.08)}}
  else{foeMove(e,dt,T.x,T.y,e.sp*.7);
   if(e.bt<=0){e.bt=e.phase===3?4.2:5.6;const roll=Math.random();
    if(roll<.45){e.state=1;e.t=.7;e.tx=T.x;e.ty=T.y;e.lx=e.x;e.ly=e.y;say2('HE LEAPS!',1)}
    else if(roll<.75)radial(12);else{for(let i=0;i<2;i++)spawnFoe(Math.random()<.5?'wisp':'crab',e.x+R(-18,18),e.y+R(-12,12),false)}}}}
 else{ /* Hollow Keeper */
  if(e.state===1){e.t-=dt;e.yaw=Math.atan2(T.x-e.x,T.y-e.y);if(e.t<=0){e.state=2;e.t=.34;const a=Math.atan2(T.y-e.y,T.x-e.x);e.sx=Math.cos(a);e.sy=Math.sin(a);snd(140,.1,70,'sawtooth',.07)}}
  else if(e.state===2){e.t-=dt;e.x+=e.sx*265*dt;e.y+=e.sy*265*dt;e.mv=1;collide(e,e.r);
   for(const p of PL){if(!p.down&&Math.hypot(p.x-e.x,p.y-e.y)<e.r+8&&p.inv<=0){damagePlayer(p,e.dmg*1.1);if(!RUN)return}}
   if(e.t<=0)e.state=0}
  else{foeMove(e,dt,T.x,T.y,e.sp*(e.phase===3?1.3:1));
   if(e.bt<=0){e.bt=e.phase===3?2.6:3.6;const roll=Math.random();
    if(roll<.4){e.state=1;e.t=.42;say2('IT WEARS YOUR FACE — DASH!',1.2)}
    else if(roll<.7)aimed(e.phase>=2?5:3,135);
    else if(e.phase>=2&&RUN.enemies.length<3){spawnFoe('shade',e.x+R(-16,16),e.y+R(-12,12),false)}
    else radial(9)}}}
 if(RUN)touchHit(e,e.dmg);}
function runUpdate(dt){RUN.time+=dt;if(RUN.zoneT>0)RUN.zoneT-=dt;
 for(const p of PL)if(p.dev.pr.start){pauseSel=0;pausePage=0;state='pause';rdSave();return}
 if(RUN.shake>0)RUN.shake*=Math.max(0,1-dt*7);if(RUN.flash>0)RUN.flash-=dt;if(RUN.banner){RUN.banner.t-=dt;if(RUN.banner.t<=0)RUN.banner=null}
 if(RUN.sub){RUN.sub.t-=dt;if(RUN.sub.t<=0)RUN.sub=null}for(const q of RUN.subQ)q.d-=dt;{const q=RUN.subQ.find(q=>q.d<=0);if(q){RUN.subQ.splice(RUN.subQ.indexOf(q),1);sub(q.who,q.txt,q.t,q.c)}}
 RUN.mwT-=dt;if(RUN.mwT<=0){RUN.mwT=1;missionWatch()}
 if(RUN.echo)for(const p of PL)if(!p.down&&Math.hypot(p.x-RUN.echo.x,p.y-RUN.echo.y)<12){echoTake();return}
 /* a super stops the room for a beat before it lands */
 if(RUN.freeze>0){RUN.freeze-=dt;for(const p of PL)if(p.supA>0)p.supA-=dt*.5;if(RUN.freeze<=0&&RUN.freezeP){const fp=RUN.freezeP;RUN.freezeP=null;superFire(fp)}return}
 const zipSp=1+.07*budCount(3);
 /* keepers */
 for(const p of PL){
  if(p.swing>0)p.swing-=dt;if(p.hurt>0)p.hurt-=dt;if(p.castA>0)p.castA-=dt;if(p.selfie>0)p.selfie-=dt;if(p.selfieA>0)p.selfieA-=dt;if(p.cheer>0)p.cheer-=dt;if(p.land>0)p.land-=dt;
  if(p.down){p.vx=p.vy=0;let near=false;for(const q of PL)if(q!==p&&!q.down&&Math.hypot(q.x-p.x,q.y-p.y)<20)near=true;
   if(near){p.revT+=dt;if(p.revT>=2.2){RD.stats.revives=(RD.stats.revives||0)+1;chatter('rev',true);p.down=false;p.revT=0;p.hp=rdStats(p).maxHp*.3;p.inv=1.5;burst(p.x,p.y,'#a8f080',14,46);say2((PL.length>1?'P'+(p.ix+1)+' ':'')+'IS BACK UP!',1.6);snd(523,.1);later(()=>snd(784,.2),110)}}
   else p.revT=Math.max(0,p.revT-dt*.6);
   continue}
  const s=rdStats(p);
  if(p.atkCd>0)p.atkCd-=dt;if(p.castCd>0)p.castCd-=dt;if(p.inv>0)p.inv-=dt;
  if(p.armT>0)p.armT-=dt;if(p.slashT>0)p.slashT-=dt;
  aimVec(p);
  if(p.dashT>0){p.dashT-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;collide(p,6);p.trail.push({x:p.x,y:p.y,t:.22,ax:p.ax||0,ay:p.ay===undefined?1:p.ay});RUN.parts.push({x:p.x,y:p.y,vx:R(-8,8),vy:R(-8,8),z:6,vz:10,life:.25,c:'#ffe9a8'})}
  else if(!(p.dive>0))movePlayer(p,dt,92*s.speedMul*zipSp*(p.charging&&p.chg>.15?.55:1));
  if(p.dashRegen>0){p.dashRegen-=dt;if(p.dashRegen<=0&&p.dashCharges<s.dashCharges){p.dashCharges++;if(p.dashCharges<s.dashCharges)p.dashRegen=.95}}
  if(p.castRegenT>0){p.castRegenT-=dt;if(p.castRegenT<=0){const mx=1+(hasKeep('stone')?1:0);if(p.castAmmo<mx){p.castAmmo++;if(p.castAmmo<mx)p.castRegenT=3.2/s.castRegen}}}
  const synth=RUN.boons.pass.find(q=>q.id==='synth');if(synth)p.hp=Math.min(s.maxHp,p.hp+rdBoonVal(synth)*.2*dt);
  /* dash: the dedicated button, or the cartridge's double-tap on a digital direction */
  const dv=p.dev;if(dv.pr.dash)doDash(p);
  if(dv.id.slice(0,2)!=='gp'||dv.dpad)for(const d of['left','right','up','down'])if(dv.pr[d]){if(p.dtap[d]!==undefined&&RUN.time-p.dtap[d]<.27&&dv.id!=='touch')doDash(p);p.dtap[d]=RUN.time}
  movesInput(p,dt,dv);
  if(dv.pr.b&&!(p.dive>0)&&!p.zoom)doCast(p);
  for(const tr of p.trail)tr.t-=dt;p.trail=p.trail.filter(tr=>tr.t>0)}
 /* sprout buddies: each bud trails the keeper who picked it up */
 const chainIx={};
 for(let i=0;i<RUN.buds.length;i++){const b=RUN.buds[i];let ow=PL[b.own];if(!ow||ow.down){ow=lead();b.own=ow.ix}
  const ci=chainIx[b.own]||0;chainIx[b.own]=ci+1;let an=ow;if(ci>0){for(let j=i-1;j>=0;j--)if(RUN.buds[j].own===b.own){an=RUN.buds[j];break}}
  const bx=-(ow.ax||0)*10,by=-(ow.ay===undefined?1:ow.ay)*10;
  const tx2=an.x+(ci===0?bx:Math.cos(i*2.4)*9),ty2=an.y+(ci===0?by:Math.sin(i*2.4)*7+4),dd=Math.hypot(tx2-b.x,ty2-b.y);
  b.mv=dd>2;if(dd>2){const sp=dd>52?210:125;b.x+=(tx2-b.x)*Math.min(1,dt*sp/Math.max(dd,1));b.y+=(ty2-b.y)*Math.min(1,dt*sp/Math.max(dd,1));b.yaw=Math.atan2(tx2-b.x,ty2-b.y)}
  b.a+=dt;b.fx=tx2>=b.x?1:-1;if(b.cd>0)b.cd-=dt;if(b.acd>0)b.acd-=dt;
  if(b.acd===undefined)b.acd=0;
  if(b.acd<=0&&RUN.enemies.length){let best=null,bd=b.type===1?17:88;for(const e of RUN.enemies){const ed=Math.hypot(e.x-b.x,e.y-b.y);if(ed<bd){bd=ed;best=e}}
   if(best){const dx=best.x-b.x,dy=best.y-b.y,dl=Math.hypot(dx,dy)||1,erin=ow.char==='ERIN';b.fx=dx>=0?1:-1;b.yaw=Math.atan2(dx,dy);b.hop=.2;
    if(b.type===1){hitEnemy(best,erin?3:2,'bud',0,0,ow);burst(best.x,best.y-4,'#c8ccd4',3,18);b.acd=1.5;snd(300,.04,180,'square',.012)}
    else{const cfgs={0:{dmg:3,kind:'fire',sp:135,cd:2.2,r:2,c:'#f07830'},2:{dmg:2,kind:'bud',sp:120,cd:2.6,r:2,c:'#48a0f0'},3:{dmg:1,kind:'bud',sp:190,cd:1.1,r:1,c:'#f0d020'},4:{dmg:2,kind:'bud',sp:150,cd:2,r:2,c:'#58c048'},5:{dmg:Math.random()<.18?6:2,kind:'bud',sp:150,cd:1.8,r:2,c:'#ffd94d'}};const cf=cfgs[b.type];
     RUN.projs.push({x:b.x,y:b.y,vx:dx/dl*cf.sp,vy:dy/dl*cf.sp,dmg:cf.dmg*(erin?1.5:1),kind:cf.kind,r:cf.r,life:1.1,o:ow,c:cf.c,small:1});b.acd=cf.cd;burst(b.x,b.y,cf.c,2,14);snd(660,.03,330,'square',.01)}}}
  if(b.hop>0)b.hop-=dt}
 if(budCount(2)>0){RUN.dewT+=dt;if(RUN.dewT>4){RUN.dewT=0;const db=RUN.buds.find(b=>b.type===2);for(const p of alive())if(p.hp<rdStats(p).maxHp){rdHeal(1,p);if(db)RUN.parts.push({x:db.x,y:db.y,vx:0,vy:0,z:10,vz:14,life:.5,c:'#48a0f0',ng:1})}}}
 for(const pd of RUN.pods){if(pd.got)continue;for(const p of PL){if(p.down||pd.got)continue;if(Math.hypot(p.x-pd.x,p.y-pd.y)<12){pd.got=true;
  if(RUN.buds.length<6){RUN.buds.push({type:pd.type,x:pd.x,y:pd.y,a:Math.random()*6,cd:0,z:0,own:p.ix});ftext(pd.x,pd.y-14,TYPES[pd.type].n+' JOINED!','#a8f080');snd(880,.07,1320)}
  else{RUN.petals+=2;ftext(pd.x,pd.y-14,'STRING FULL +2','#f8c8e0')}}}}
 RUN.pods=RUN.pods.filter(pd=>!pd.got);
 /* flame zones */
 for(const z of RUN.zones){z.t-=dt;for(const e of RUN.enemies)if(Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){e.burn=Math.max(e.burn,.4);e.burnDps=Math.max(e.burnDps,z.dps)}}
 RUN.zones=RUN.zones.filter(z=>z.t>0);
 /* wildfire duo */
 if(hasDuo('wildfire')){RUN.duoT=(RUN.duoT||0)-dt;if(RUN.duoT<=0){RUN.duoT=2;for(const e of RUN.enemies.slice())if(e.burn>0){e.hp-=14;e.flash=.12;burst(e.x,e.y,'#f0d020',4,26);RUN.bolts=RUN.bolts||[];RUN.bolts.push({x:e.x,y:e.y,sky:1,t:.18});if(e.hp<=0)killEnemy(e)}}}
 /* hazards (boulderfalls, king slams) */
 for(const h of RUN.hazards){h.t-=dt;if(h.t<=0&&!h.done){h.done=true;burst(h.x,h.y,h.from==='player'?'#98a0b0':'#7fd0e8',12,44);snd(130,.2,60,'sawtooth',.07);RUN.shake=Math.max(RUN.shake,2.5);
  RUN.rings=RUN.rings||[];RUN.rings.push({x:h.x,y:h.y,r:h.r,t:.3,c:h.from==='player'?'#dce2ea':'#7fd0e8'});
  if(h.from==='player'){for(const e of RUN.enemies.slice())if(Math.hypot(e.x-h.x,e.y-h.y)<h.r+e.r)hitEnemy(e,h.dmg,'cast',0,0,h.o)}
  else for(const p of PL){if(!p.down&&Math.hypot(p.x-h.x,p.y-h.y)<h.r+6&&p.inv<=0&&p.dashT<=0){damagePlayer(p,h.dmg);if(!RUN)return}}}}
 RUN.hazards=RUN.hazards.filter(h=>!h.done);
 updateActs(dt);
 /* foes */
 for(const e of RUN.enemies.slice()){if(e.hp<=0)continue;if(e.dazed>0)e.dazed-=dt;if(e.kind==='boss')updBoss(e,dt);else rdUpdFoe(e,dt);if(!RUN)return}
 /* projectiles */
 for(const p of RUN.projs){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  for(const e of RUN.enemies.slice()){if(e.born>0)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+p.r){if(projHit(p,e))p.life=0;break}}}
 RUN.projs=RUN.projs.filter(p=>p.life>0&&p.x>-8&&p.x<W+8&&p.y>20&&p.y<H+8);
 for(const p of RUN.eprojs){p.x+=p.vx*dt;p.y+=p.vy*dt;
  for(const q of PL){if(q.down)continue;if(Math.hypot(q.x-p.x,q.y-p.y)<p.r+6&&q.inv<=0&&q.dashT<=0){p.life=0;damagePlayer(q,p.dmg);if(!RUN)return;break}}}
 RUN.eprojs=RUN.eprojs.filter(p=>p.life!==0&&p.x>-8&&p.x<W+8&&p.y>20&&p.y<H+8);
 /* pickups drift to the nearest standing keeper */
 const mag=budCount(3)>0?88:48;
 for(const p of RUN.pickups){const q=tgt(p),d=Math.hypot(q.x-p.x,q.y-p.y);if(q.down)continue;
  if(d<mag){p.vx+=(q.x-p.x)*8*dt*8;p.vy+=(q.y-p.y)*8*dt*8}
  p.vx*=Math.max(0,1-dt*4);p.vy*=Math.max(0,1-dt*4);p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(d<10){p.got=true;if(p.kind==='petal'){RUN.petals+=p.val;if(Math.random()<.3)snd(1200,.03,1600,'square',.02)}
   else if(p.kind==='dew'){RUN.dew+=p.val;say2('+'+p.val+' MOONDEW',1.2);snd(980,.06,1470)}
   else if(p.kind==='heart'){rdHeal(p.val,q);ftext(q.x,q.y-12,'+'+p.val,'#a8f080')}
   else if(p.kind==='honey'){RUN.honey+=p.val;say2('+1 HONEY',1.5)}}}
 RUN.pickups=RUN.pickups.filter(p=>!p.got);
 /* doors / clear */
 if(RUN.phase==='fight'&&RUN.enemies.length===0){
  if(RUN.wave2&&RUN.wave2.length){const w2=RUN.wave2;RUN.wave2=null;
   for(const s2 of w2)spawnFoe(s2.k,26+Math.random()*(W-52),36+Math.random()*(H*.45),s2.elite);
   say2('THE DEEP STIRS - MORE RISE',1.6);snd(160,.25,70,'sawtooth',.06)}
  else{chamberCleared();if(!RUN)return}}
 else if(RUN.phase==='doors'){for(const d of RUN.doors){let on=false;for(const p of PL)if(!p.down&&Math.hypot(p.x-d.x,p.y-(d.y+8))<13)on=true;
   /* solo: step in, like the cartridge. Co-op: hold the doorway a beat so nobody picks by accident */
   if(on){d.hold+=dt;if(PL.length===1||d.hold>.6){doorReward(d);return}}else d.hold=Math.max(0,d.hold-dt*2)}}
 /* fx */
 for(const q of RUN.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.z=Math.max(0,(q.z||0)+(q.vz||0)*dt);if(!q.ng)q.vz=(q.vz||0)-140*dt;q.life-=dt}RUN.parts=RUN.parts.filter(q=>q.life>0);
 if(RUN.parts.length>260)RUN.parts.splice(0,RUN.parts.length-260);
 for(const t of RUN.texts){t.y-=16*dt;t.t-=dt}RUN.texts=RUN.texts.filter(t=>t.t>0);
 if(RUN.bolts){for(const b of RUN.bolts)b.t-=dt;RUN.bolts=RUN.bolts.filter(b=>b.t>0)}
 if(RUN.rings){for(const b of RUN.rings)b.t-=dt;RUN.rings=RUN.rings.filter(b=>b.t>0)}}

/* ---------------- title / menu / settings ---------------- */
let menuSel=0,setReturn='title';
function menuUpdate(){menuSel=nav(menuSel,3);
 if(pressed('a')||pressed('start')){snd(660,.06,990);
  if(menuSel===0)hubEnter();
  else if(menuSel===1)startCine('menu');
  else{setReturn='menu';uiSel=0;state='set'}}
 else if(pressed('b'))state='title'}
function setUpdate(){uiSel=nav(uiSel,3);const lr=(pressed('right')?1:0)-(pressed('left')?1:0);
 if(lr||pressed('a')){let touched=true;
  if(uiSel===0)RD.set.mus=lr?Math.max(0,Math.min(10,RD.set.mus+lr)):(RD.set.mus>=10?0:RD.set.mus+1);
  else if(uiSel===1)RD.set.sfx=lr?Math.max(0,Math.min(10,RD.set.sfx+lr)):(RD.set.sfx>=10?0:RD.set.sfx+1);
  else if(pressed('a'))RD.set.shake=!RD.set.shake;else touched=false;
  if(touched){rdSave();snd(660,.05,880)}}
 if(pressed('b')||pressed('start')){snd(440,.05);state=setReturn}}
function titleUpdate(){const d=pressedBy('a')||pressedBy('start');
 if(d){audioWake();rdMusStart();snd(660,.08,990);
  /* whoever presses first holds the lantern: they are player 1 */
  if(!PL.length)joinPlayer(d);
  if(!RD.flags.cineSeen)startCine('hub');else{menuSel=0;state='menu'}}}
function gameUpdate(dt){time+=dt;
 if(say2T>0)say2T-=dt;if(joinT>0)joinT-=dt;
 switch(state){
 case 'title':titleUpdate();return;
 case 'menu':menuUpdate();return;
 case 'set':setUpdate();return;
 case 'sprouts':sproutsUpdate();return;
 case 'cine':cineUpdate(dt);return;
 case 'hub':hubUpdate(dt);return;
 case 'talk':talkUpdate();return;
 case 'chars':charsUpdate(dt);return;
 case 'mirror':mirrorUpdate();return;
 case 'arm':armUpdate();return;
 case 'keep':keepUpdate();return;
 case 'codex':codexUpdate();return;
 case 'heat':heatUpdate();return;
 case 'board':boardUpdate();return;
 case 'echo':echoUpdate(dt);return;
 case 'boon':boonUpdate(dt);return;
 case 'shop':if(!RUN){state='hub';return}shopUpdate();return;
 case 'pause':if(!RUN){hubEnter();return}pauseUpdate();return;
 case 'run':if(!RUN){hubEnter();return}runUpdate(dt);return;
 case 'over':case 'win':overT+=dt;if(overT>.8&&(pressed('a')||pressed('start')))hubEnter();return;
 }}
