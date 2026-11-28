/* =====================================================================
   ROOTDEEP 64 — online play
   Built on the artifact page's `room` capability: everyone with the page
   open can find each other. No server of ours, no app store.

   One player HOSTS: their copy runs the whole game, exactly as couch
   co-op does. Friends JOIN: their copy runs no rules at all. It sends its
   controller / keyboard / touch input to the host, and draws the host's
   game from a snapshot the host streams ~15 times a second.

   Each player's own keeper moves on their own screen straight away (the
   host takes their position), so walking and dashing never feel laggy.
   Hits, damage, enemies and menus come from the host, so there's a small
   delay on those for remote players.

   Rooms (each one carries one presence object of up to 4 KiB):
     lobby            hosts advertise {g:{c,n,s}} so others can list games
     <code>           host: {c: snapshot}  · joiners: {i: inputs}
     <code>.f         host: {f: projectiles, pickups, text, sounds...}
     <code>.m         host: {m: save summary, menu screen, markers}
   ===================================================================== */
'use strict';
const NET={room:null,user:null,host:false,client:false,code:'',rooms:{},peer:'',hostPeer:null,
 seq:0,nid:0,sq:[],sendT:0,metaT:0,lastMeta:'',inputs:{},
 snapAt:0,core:null,fx:null,meta:null,seen:{t:0,r:0,b:0,s:0},err:'',games:[],names:{},saved:null,mk:{},leaveT:0,joinedAt:0,status:''};
const KINDS=['grub','spitter','beetle','shade','crab','wisp','puffcap','shardling','mite','bonehound','boss'];
const PKINDS=['arrow','thorn','fire','wave','vine','wild','laser','jet','towel','bud'];
const PICK=['petal','dew','heart','honey'];
const DKINDS=['boon','petals','dew','fruit','heart','shop','fountain','honey'];
const STNAMES={hub:'IN THE HEARTH',talk:'IN THE HEARTH',chars:'PICKING KEEPERS',run:'IN THE DEEP',pause:'IN THE DEEP',boon:'IN THE DEEP',shop:'IN THE DEEP',echo:'IN THE DEEP',over:'BETWEEN RUNS',win:'BETWEEN RUNS'};
const r1=v=>Math.round(v),r2=v=>Math.round(v*100)/100,c100=v=>Math.round((v||0)*100);

/* ---------------- connect ---------------- */
async function netInit(){if(NET.room!==null)return NET.room;NET.room=false;
 try{if(!window.claude||!window.claude.use){NET.err='Online play works when the game is opened on claude.ai.';return false}
  const room=await window.claude.use('room');if(!room){NET.err='Online play isn\'t available in this view. Sign in to claude.ai and open the shared game page.';return false}
  NET.room=room;try{NET.user=await window.claude.use('user')}catch(e){}
  room.onPeers(ch=>{NET.games=[];for(const p of ch.peers){if(p.sameTab)NET.peer=p.peer;const g=p.presence&&p.presence.g;
    if(g&&typeof g.c==='string'&&/^[a-z0-9]{4,8}$/.test(g.c)&&!p.sameTab)NET.games.push({code:g.c,n:+g.n||1,s:String(g.s||'').slice(0,24),by:p.by,peer:p.peer})}
   netNames(NET.games.map(g=>g.by).filter(Boolean))},e=>{NET.err='Online play stopped: '+e.code});
  return room}catch(e){NET.err='Online play isn\'t available here.';return false}}
async function netNames(ids){if(!NET.user||!ids.length)return;try{const ps=await NET.user.profiles(ids);for(const id of ids)NET.names[id]=(ps[id]&&ps[id].name)||''}catch(e){}}
const gameName=g=>((g.by&&NET.names[g.by])||'A KEEPER').toUpperCase().slice(0,18)+"'S GAME";
async function netJoinRooms(code){const R=NET.room;NET.code=code;
 NET.rooms.c=await R.join(code);NET.rooms.f=await R.join(code+'.f');NET.rooms.m=await R.join(code+'.m');}
async function netLeave(){const rooms=NET.rooms;NET.rooms={};
 /* put this copy back the way it was first, then close the rooms */
 if(NET.client){RD=NET.saved||RD;RUN=null;PL.length=0;menuDev=null;state='title'}
 if(NET.host){for(const p of PL.slice())if(p.dev.net)dropPlayer(p);for(const k in DEV)if(DEV[k].net)delete DEV[k]}
 NET.host=NET.client=false;NET.code='';NET.core=NET.fx=NET.meta=null;NET.inputs={};NET.status='';
 for(const k in rooms){try{await rooms[k].leave()}catch(e){}}
 if(NET.room)try{await NET.room.presence({g:null})}catch(e){}}

/* ---------------- host ---------------- */
async function netHost(){const R=await netInit();if(!R)return false;
 const code=Array.from({length:5},()=>'abcdefghjkmnpqrstuvwxyz23456789'[(Math.random()*31)|0]).join('');
 try{await netJoinRooms(code)}catch(e){NET.err='Couldn\'t open a game room ('+(e&&e.code||'error')+').';return false}
 NET.host=true;NET.client=false;NET.status='HOSTING';
 /* joiners' input arrives in their presence on the game room */
 NET.rooms.c.onPeers(ch=>{const seenPeers=new Set();for(const p of ch.peers){if(p.sameTab)continue;seenPeers.add(p.peer);const i=p.presence&&p.presence.i;if(Array.isArray(i))NET.inputs[p.peer]={i:i.slice(0,4),at:performance.now()}}
  for(const k in NET.inputs)if(!seenPeers.has(k)){delete NET.inputs[k];for(const id in DEV)if(DEV[id].net&&DEV[id].peer===k)DEV[id].live=false}});
 return true}
/* the host's pollInput: one virtual device per remote controller */
function netPoll(){if(!NET.host)return;const now=performance.now();
 for(const peer in NET.inputs){const pk=NET.inputs[peer];for(const e of pk.i){if(!Array.isArray(e)||e.length<4)continue;const lid=String(e[0]).slice(0,6);if(!/^(kb1|kb2|touch|gp[0-7])$/.test(lid))continue;
   const key='n:'+peer+':'+lid;let d=DEV[key];if(!d){d=DEV[key]=mkDev(lid,'ONLINE');d.net=true;d.peer=peer}
   d.live=now-pk.at<5000;d.mx=clamp(+e[1]||0,-1,1);d.my=clamp(+e[2]||0,-1,1);const bits=e[3]|0;BTN.forEach((b,j)=>d.cur[b]=!!(bits&(1<<j)));
   d.pos=Number.isFinite(e[4])&&Number.isFinite(e[5])?[clamp(e[4],0,W),clamp(e[5],0,H)]:null}}}
/* remote keepers walk on their own screens: take their position when they're free to move */
function netHostAfter(dt){if(!NET.host)return;
 for(const p of PL.slice()){const d=p.dev;if(!d.net)continue;if(!d.live&&PL.length>1){dropPlayer(p);joinMsg='PLAYER '+(p.ix+1)+' WENT OFFLINE';joinT=2.5;continue}
  const free=(state==='hub'||state==='run'||state==='talk')&&!p.down&&!(p.dive>0)&&!p.zoom&&!(RUN&&RUN.freeze>0)&&!(p.land>0);
  if(free&&d.pos){const dx=d.pos[0]-p.x,dy=d.pos[1]-p.y;if(Math.hypot(dx,dy)<60){p.x=d.pos[0];p.y=d.pos[1];if(RUN)collide(p,6)}}}
 NET.sendT-=dt;if(NET.sendT<=0){NET.sendT=1/15;netSend()}
 NET.metaT-=dt;if(NET.metaT<=0){NET.metaT=.25;netSendMeta()}}
function cue(kind,args){if(!NET.host)return;NET.sq.push([++NET.nid,kind,...Array.from(args).map(a=>typeof a==='number'?r2(a):a)]);if(NET.sq.length>14)NET.sq.shift()}
const tag=o=>o._n||(o._n=++NET.nid);
/* keep a snapshot under the 4 KiB presence limit by thinning the least important lists */
function fit(obj,lists){let s=JSON.stringify(obj);for(const k of lists){while(s.length>3900&&obj[k]&&obj[k].length){obj[k].length=Math.floor(obj[k].length*.7);s=JSON.stringify(obj)}}return s.length<=3990?obj:null}
function pRec(p){const s=rdStats(p),t=[p.swing,p.swingD,p.castA,p.selfie,p.selfieA,p.hurt,p.cheer,p.land,p.chg,p.heavyA,p.dive,p.diveL,p.spA,p.supA,p.dashT,p.revT,p.inv,p.armT,p.slashT,p.reviving].map(c100);
 const fl=(p.down?1:0)|(p.charging?2:0)|(p.ready?4:0)|(p.dev.net?8:0);
 return[p.ix,CHARS.findIndex(c=>c.id===p.char),r1(p.x),r1(p.y),c100(p.ax),c100(p.ay===undefined?1:p.ay),r1(p.hp),r1(s.maxHp),fl,r1(p.meter||0),p.dashCharges||0,s.dashCharges,p.castAmmo||0,1+(hasKeep('stone')?1:0),
  Math.round(clamp(1-(p.spCd||0)/(mv(p).spCd||6),0,1)*100),p.combo||0,p.csel||0,p.downs||0,Math.round(((p.slashAng||0)*180/Math.PI)),Math.round(92*s.speedMul*(1+.07*budCount(3))),
  p.dev.net?p.dev.peer+':'+p.dev.id:p.dev.id,p.hubT?String(p.hubT.n).slice(0,30):'',t,p.cmb||0,c100(p.cmbT)]}
function eRec(e){const fl=(e.elite?1:0)|(e.burn>0?2:0)|(e.chill>0?4:0)|(e.root>0?8:0)|(e.dazed>0?16:0)|(e.flash>0?32:0)|(e.mv?64:0)|(e.spit>0?128:0)|(e.wind?256:0);
 const r=[tag(e),KINDS.indexOf(e.kind),r1(e.x),r1(e.y),Math.round(e.hp/e.max*100),Math.round((e.yaw||0)*57.3),fl,c100(e.born),e.state|0,Math.round(e.r*10)];
 if(e.kind==='boss')r.push(e.bossIx,c100(e.t),r1(e.tx||0),r1(e.ty||0),r1(e.lx||0),r1(e.ly||0),r1(e.hp),r1(e.max));else r.push(r1(e.z||0));return r}
function netSend(){if(!NET.rooms.c)return;const q=++NET.seq;
 const c={q,st:state,ow:(PL.find(p=>p.dev===menuDev)||{ix:-1}).ix,sT:r2(stateT),P:PL.map(pRec)};
 if(say2T>0)c.s2=[say2Txt,r2(say2T)];if(joinT>0)c.jm=[joinMsg,r2(joinT)];
 if(state==='hub'||state==='talk')c.N=NPCS.map(w=>{const n=HUBNPC[w];return n?[r1(n.x),r1(n.y),Math.round((n.yaw||0)*57.3),n.mv?1:0,n.act>0?1:0,r1(n.hx)]:[0,0,0,0,0,0]});
 if(state==='cine')c.ci=[rdCineIx,r2(rdCineT)];if(state==='ep'&&EPI)c.ep=[EPI.i,EPI.b,r2(EPI.t),EPI.K];if(state==='over'||state==='win')c.ov=r2(overT);if(state==='chars')c.dv=r2(diveT);
 if(RUN){c.R=[RUN.chamber,RUN.biome,RUN.phase==='doors'?1:RUN.phase==='fight'?0:2,r2(RUN.time),RUN.petals,RUN.dew,RUN.keys,RUN.heat,r2(RUN.zoneT),r2(RUN.flash||0),r2(RUN.freeze||0),RUN.freezeP?RUN.freezeP.ix:-1,RUN.elite?1:0,RUN.wave2?RUN.wave2.length:0,r2(RUN.shake||0)];
  c.E=RUN.enemies.map(eRec);c.dg=dunNet();c.O=RUN.obst.map(o=>[r1(o.x),r1(o.y),r1(o.w),r1(o.h),r2(o.s)]);
  c.D=RUN.doors.map(d=>[DKINDS.indexOf(d.kind),GODIDS.indexOf(d.god),r2(d.hold),d.by?d.by.ix:-1,d.boss?1:0,r1(d.x),r1(d.y)]);
  if(RUN.banner)c.bn=[RUN.banner.txt,RUN.banner.who,RUN.banner.c,r2(RUN.banner.t)];if(RUN.sub)c.sb=[RUN.sub.who,RUN.sub.txt,r2(RUN.sub.t),RUN.sub.c];
  if(RUN.echo)c.ec=[r1(RUN.echo.x),r1(RUN.echo.y)];
  if(RUN.relic)c.rl=[r1(RUN.relic.x),r1(RUN.relic.y),RELICS.findIndex(r=>r.id===RUN.relic.id),RUN.relic.read?1:0];
  if(RUN.qitem)c.qi=[r1(RUN.qitem.x),r1(RUN.qitem.y),CHARS.findIndex(x=>x.id===RUN.qitem.char),RUN.qitem.step];
  if(RUN.engine)c.en=[r1(RUN.engine.x),r1(RUN.engine.y),RUN.engine.used?1:0];if(RUN.split)c.sp=r2(RUN.split.t);if(RUN.twins)c.tw=r2(RUN.twins.t);
  if(RUN.ghostNpc)c.gh=[r1(RUN.ghostNpc.x),r1(RUN.ghostNpc.y),r2(RUN.ghostNpc.t),RUN.ghostNpc.line,r2(RUN.ghostNpc.out||0)]}
 const cc=fit(c,['E']);if(cc)NET.rooms.c.presence({c:cc}).catch(()=>{});
 const f={q,sq:NET.sq.slice()};
 if(RUN){f.pr=RUN.projs.slice(-40).map(p=>[PKINDS.indexOf(p.kind),r1(p.x),r1(p.y),r1(p.vx),r1(p.vy),p.small?1:0,p.c||0]);
  f.ep=RUN.eprojs.slice(-40).map(p=>[r1(p.x),r1(p.y),r1(p.vx),r1(p.vy)]);
  f.pk=RUN.pickups.slice(-30).map(p=>[PICK.indexOf(p.kind),r1(p.x),r1(p.y)]);f.pd=RUN.pods.map(p=>[p.type,r1(p.x),r1(p.y)]);
  f.bd=RUN.buds.map(b=>[b.type,r1(b.x),r1(b.y),Math.round((b.yaw||0)*57.3),b.own,c100(b.hop),b.cd>0?1:0,b.mv?1:0]);
  f.tx=RUN.texts.slice(-10).map(t=>[tag(t),r1(t.x),r1(t.y),String(t.txt).slice(0,32),t.c,r2(t.t)]);
  f.rg=(RUN.rings||[]).slice(-6).map(g=>[tag(g),r1(g.x),r1(g.y),r1(g.r),r2(g.t),g.c]);f.bl=(RUN.bolts||[]).slice(-6).map(b=>[tag(b),r1(b.x),r1(b.y),r1(b.x2||0),r1(b.y2||0),b.sky?1:0,r2(b.t)]);
  f.zn=RUN.zones.map(z=>[r1(z.x),r1(z.y),r1(z.r)]);f.hz=RUN.hazards.map(h=>[r1(h.x),r1(h.y),r1(h.r),r2(h.t),r2(h.t0||.45),h.from==='player'?1:0,h.instant?1:0]);
  f.ac=RUN.acts.map(a=>{const d=a.delay>0?r2(a.delay):0;switch(a.k){case'bike':return[0,r1(a.x),r1(a.y),r1(a.vx),r1(a.vy),d];case'sprout':return[1,r1(a.x),r1(a.y),r1(a.vx),r1(a.vy),d,a.type];
   case'judge':return[2,r1(a.x),r1(a.y),r2(a.t),d];case'geyser':return[3,r1(a.x),r1(a.y),d,r2(a.life)];case'cloud':return[4,r1(a.x),r1(a.y),r2(a.s),r2(a.life)];
   case'leash':return[5,a.o?a.o.ix:0,a.e?tag(a.e):0,r1(a.x2),r1(a.y2),r2(a.t),r2(a.t0)];}return null}).filter(Boolean)}
 const ff=fit(f,['pk','ep','pr','tx','bd','ac']);if(ff)NET.rooms.f.presence({f:ff}).catch(()=>{});}
function rdSummary(){const fl={};for(const k in RD.flags)if(/^(mt_|cineSeen|bloom)/.test(k))fl[k]=1;
 return{dew:RD.dew,keys:RD.keys,honey:RD.honey,mirror:RD.mirror,weapons:RD.weapons,weapon:RD.weapon,keeps:RD.keeps,keepEq:RD.keepEq,keepXp:RD.keepXp,pact:RD.pact,bank:RD.bank,party:RD.party,gift:RD.gift,
  stats:RD.stats,msn:RD.msn,echo:RD.echo,relic:RD.relic,chSeen:RD.chSeen,kq:RD.kq,kqFound:RD.kqFound,kqDone:RD.kqDone,ghost:RD.ghost,bossK:RD.bossK,killK:RD.killK,diedTo:RD.diedTo,charEsc:RD.charEsc,seen:RD.seen,bs:Object.keys(RD.boonSeen).length,flags:fl,lastRun:RD.lastRun?Object.assign({},RD.lastRun):null,chars:RD.chars}}
function netSendMeta(){if(!NET.rooms.m)return;
 const ui={uiSel,menuSel,pauseSel,pausePage,pauseConfirm,codexPage,heatSel,boardSel,echoSel,sprPage,buyAsk,giftAsk,setReturn,offerGod,boonQuote,
  boon:state==='boon'?boonOffer:null,shop:state==='shop'?shopItems.map(i=>({n:i.n,d:i.d,p:i.p,sold:!!i.sold})):null,
  talk:state==='talk'?[talkNPC,talkWho,talkTxt,talkLine,talkStart,talkEv?talkEv.lines.length:0,talkEv&&talkEv.rew||null]:null,
  echo:echoRead?echoRead.id:null,boons:RUN?RUN.boons:null};
 const mk={};if(state==='hub')for(const w of NPCS){const e=storyNext(w);if(e)mk[w]=e.mission?'?':'!'}
 const m={rd:rdSummary(),ui,mk};let s=JSON.stringify(m);
 if(s.length>3900){m.rd.seen={};m.rd.killK={};m.rd.lastRun=m.rd.lastRun&&{chamber:m.rd.lastRun.chamber,kills:m.rd.lastRun.kills,dew:m.rd.lastRun.dew,biome:m.rd.lastRun.biome};s=JSON.stringify(m)}
 if(s===NET.lastMeta||s.length>3990)return;NET.lastMeta=s;NET.rooms.m.presence({m}).catch(()=>{})}
/* the host's lobby card */
let lobbyT=0;
function netAdvertise(dt){if(!NET.host||!NET.room)return;lobbyT-=dt;if(lobbyT>0)return;lobbyT=2;NET.room.presence({g:{c:NET.code,n:PL.length,s:STNAMES[state]||''}}).catch(()=>{})}

/* ---------------- join ---------------- */
async function netJoin(code){const R=await netInit();if(!R)return false;
 try{await netJoinRooms(code)}catch(e){NET.err='Couldn\'t join that game ('+(e&&e.code||'error')+').';return false}
 NET.saved=RD;RD=Object.assign(RDDEF(),{set:NET.saved.set});NET.client=true;NET.host=false;NET.core=NET.fx=NET.meta=null;NET.joinedAt=performance.now();NET.status='JOINING';
 PL.length=0;RUN=null;state='hub';
 NET.rooms.c.onPeers(ch=>{let h=null;for(const p of ch.peers)if(!p.sameTab&&p.presence&&p.presence.c)h=p;
  if(h){NET.hostPeer=h.peer;if(h.presence.c!==NET.core){NET.core=h.presence.c;NET.snapAt=performance.now();netApplyCore()}}
  else if(NET.hostPeer&&ch.left.some(p=>p.peer===NET.hostPeer))netLost('THE HOST LEFT THE GAME')});
 NET.rooms.f.onPeers(ch=>{for(const p of ch.peers)if(!p.sameTab&&p.presence&&p.presence.f&&p.presence.f!==NET.fx){NET.fx=p.presence.f;netApplyFx()}});
 NET.rooms.m.onPeers(ch=>{for(const p of ch.peers)if(!p.sameTab&&p.presence&&p.presence.m&&p.presence.m!==NET.meta){NET.meta=p.presence.m;netApplyMeta()}});
 return true}
function netLost(msg){netLeave();joinMsg=msg;joinT=4;menuSel=0;state='menu'}
/* what this client sends: every local controller, its buttons, and where its keeper is */
let sentAt=0,lastSent='';const HOLDMIN=90,holdUntil={};
function netClientSend(){if(!NET.client||!NET.rooms.c)return;const now=performance.now(),out=[];
 for(const id of['kb1','kb2','touch','gp0','gp1','gp2','gp3']){const d=DEV[id];if(!d||!d.live)continue;if(id==='touch'&&!touchSeen)continue;if(id==='kb2'&&!kb2On&&!KEYS.Comma)continue;
  let bits=0;BTN.forEach((b,j)=>{const k=id+b;if(d.cur[b]&&!d.prev2?.[b])holdUntil[k]=now+HOLDMIN;if(d.cur[b]||now<(holdUntil[k]||0))bits|=1<<j});d.prev2=Object.assign({},d.cur);
  const mine=PL.find(p=>p.dk===NET.peer+':'+id);out.push(mine&&mine.pred?[id,r2(d.mx),r2(d.my),bits,r1(mine.x),r1(mine.y)]:[id,r2(d.mx),r2(d.my),bits]);if(out.length>=4)break}
 const s=JSON.stringify(out);if(s!==lastSent||now-sentAt>250){lastSent=s;sentAt=now;NET.rooms.c.presence({i:out}).catch(()=>{})}}

/* ---------------- the client draws the host's game ---------------- */
const fakeDev={};function devFor(dk){if(!fakeDev[dk]){const lid=dk.includes(':')?dk.split(':').pop():dk;fakeDev[dk]={id:lid,label:dk.includes(':')?'ONLINE':lid==='touch'?'TOUCH':lid.slice(0,2)==='gp'?'PAD':'KEYS',cur:{},pr:{},mx:0,my:0,live:true}}return fakeDev[dk]}
const ENT={};
function netApplyCore(){const c=NET.core;if(!c||typeof c!=='object')return;
 if(state!==c.st&&c.st==='run'&&RUN&&RUN.chamber!==(c.R&&c.R[0]))for(const p of PL)p.pred=false;
 state=String(c.st);stateT=+c.sT||0;
 /* keepers */
 const keep=new Set();for(const r of c.P||[]){const ix=r[0];keep.add(ix);let p=PL.find(q=>q.ix===ix);
  if(!p){p={ix,trail:[],x:r[2],y:r[3],anim:0};PL.push(p);PL.sort((a,b)=>a.ix-b.ix)}
  p.char=(CHARS[r[1]]||CHARS[0]).id;p.tx=r[2];p.ty=r[3];p.ax=r[4]/100;p.ay=r[5]/100;p.hp=r[6];p.ns={maxHp:r[7],dashCharges:r[11],speedMul:1,dmgMul:1,atkMul:1,castMul:1,crit:0,armor:0,castRegen:1,healMul:1};
  const fl=r[8];p.down=!!(fl&1);p.charging=!!(fl&2);p.ready=!!(fl&4);p.meter=r[9];p.dashCharges=r[10];p.castAmmo=r[12];p.spCd=(1-r[14]/100)*(mv(p).spCd||6);p.combo=r[15];p.csel=r[16];p.downs=r[17];p.slashAng=r[18]/57.3;p.spd=r[19];
  p.cmb=r[23]|0;p.cmbT=(r[24]|0)/100;p.dk=String(r[20]);p.dev=devFor(p.dk);p.hubT=r[21]?{n:r[21]}:null;
  const T=r[22]||[];['swing','swingD','castA','selfie','selfieA','hurt','cheer','land','chg','heavyA','dive','diveL','spA','supA','dashT','revT','inv','armT','slashT','reviving'].forEach((k,j)=>p[k]=(T[j]||0)/100);
  p.mine=p.dk.startsWith(NET.peer+':');
  if(p.mine&&!p.pred&&!p.down){p.x=p.tx;p.y=p.ty;p.pred=true}}
 for(let i=PL.length-1;i>=0;i--)if(!keep.has(PL[i].ix))PL.splice(i,1);
 menuDev=(PL.find(p=>p.ix===c.ow)||{}).dev||null;
 if(c.s2){say2Txt=c.s2[0];say2T=c.s2[1]}if(c.jm){joinMsg=c.jm[0];joinT=c.jm[1]}
 if(c.N)NPCS.forEach((w,i)=>{const a=c.N[i];if(!a)return;const n=HUBNPC[w]||(HUBNPC[w]={x:a[0],y:a[1],route:[],ri:0});n.tx=a[0];n.ty=a[1];n.yaw=a[2]/57.3;n.mv=a[3];n.act=a[4];n.hx=a[5]});
 if(c.ci){rdCineIx=c.ci[0];rdCineT=c.ci[1]}if(c.ep){if(!EPI||EPI.i!==c.ep[0])EPI=epBuild(c.ep[0],c.ep[3]);EPI.b=Math.min(c.ep[1],EPI.beats.length-1);EPI.t=c.ep[2]}else if(state!=='ep')EPI=null;if(c.ov!==undefined)overT=c.ov;if(c.dv!==undefined)diveT=c.dv;
 if(!c.R){RUN=null;return}
 const R0=c.R;if(!RUN||RUN.chamber!==R0[0])RUN={enemies:[],projs:[],eprojs:[],pickups:[],pods:[],buds:[],texts:[],parts:[],rings:[],bolts:[],zones:[],hazards:[],acts:[],doors:[],obst:[],boons:{atk:null,cast:null,dash:null,pass:[]},subQ:[]};if(c.dg)dunNetApply(c.dg);
 Object.assign(RUN,{chamber:R0[0],biome:R0[1],phase:['fight','doors','idle'][R0[2]],time:R0[3],petals:R0[4],dew:R0[5],keys:R0[6],heat:R0[7],zoneT:R0[8],flash:R0[9],freeze:R0[10],elite:!!R0[12],wave2:R0[13]?{length:R0[13]}:null,shake:R0[14]});
 RUN.freezeP=PL.find(p=>p.ix===R0[11])||null;
 RUN.obst=(c.O||[]).map(o=>({x:o[0],y:o[1],w:o[2],h:o[3],s:o[4]}));
 RUN.doors=(c.D||[]).map(d=>({kind:DKINDS[d[0]]||'boon',god:GODIDS[d[1]]||'EMBER',hold:d[2],by:PL.find(p=>p.ix===d[3])||null,boss:!!d[4],x:d[5],y:d[6]}));
 const ids=new Set(),list=[];RUN.boss=null;
 for(const r of c.E||[]){const id=r[0];ids.add(id);let e=ENT[id];if(!e){e=ENT[id]={x:r[2],y:r[3]}}
  Object.assign(e,{kind:KINDS[r[1]]||'grub',_x:r[2],_y:r[3],hp:r[4],max:100,yaw:r[5]/57.3,elite:!!(r[6]&1),burn:r[6]&2?1:0,chill:r[6]&4?1:0,root:r[6]&8?1:0,dazed:r[6]&16?1:0,flash:r[6]&32?.1:0,mv:r[6]&64?1:0,spit:r[6]&128?.2:0,wind:!!(r[6]&256),z:r[1]===6?0:(r[10]||0),born:r[7]/100,state:r[8],r:r[9]/10});
  if(e.kind==='boss'){Object.assign(e,{bossIx:r[10],t:r[11]/100,tx:r[12],ty:r[13],lx:r[14],ly:r[15],hp:r[16],max:r[17]});RUN.boss=e}
  list.push(e)}
 for(const k in ENT)if(!ids.has(+k)){const e=ENT[k];if(RUN&&e.kind!=='boss'&&e.chamber===RUN.chamber)deathFx(e);delete ENT[k]}for(const e of list)e.chamber=RUN.chamber;RUN.enemies=list;
 RUN.banner=c.bn?{txt:c.bn[0],who:c.bn[1],c:c.bn[2],t:c.bn[3]}:null;RUN.sub=c.sb?{who:c.sb[0],txt:c.sb[1],t:c.sb[2],c:c.sb[3]}:null;
 RUN.echo=c.ec?{x:c.ec[0],y:c.ec[1]}:null;
 RUN.relic=c.rl&&RELICS[c.rl[2]]?{x:c.rl[0],y:c.rl[1],id:RELICS[c.rl[2]].id,read:!!c.rl[3]}:null;
 RUN.qitem=c.qi&&CHARS[c.qi[2]]?{x:c.qi[0],y:c.qi[1],char:CHARS[c.qi[2]].id,step:c.qi[3]}:null;
 RUN.engine=c.en?{x:c.en[0],y:c.en[1],used:!!c.en[2]}:null;RUN.split=c.sp!==undefined&&RUN.engine?Object.assign(RUN.split||{},{t:c.sp,x:RUN.engine.x,y:RUN.engine.y}):null;RUN.twins=c.tw!==undefined?{t:c.tw}:null;
 for(const p of PL)p.engineNear=!!(RUN.engine&&!RUN.split&&RUN.phase==='doors'&&Math.hypot(p.x-RUN.engine.x,p.y-RUN.engine.y)<20);
 RUN.ghostNpc=c.gh?Object.assign(RUN.ghostNpc||{},{x:c.gh[0],y:c.gh[1],t:c.gh[2],line:c.gh[3],out:c.gh[4]}):null;
 for(const p of PL)p.relicNear=!!(RUN.relic&&RUN.phase==='doors'&&!p.down&&Math.hypot(p.x-RUN.relic.x,p.y-RUN.relic.y)<18)}
const seenId=new Set();
function netApplyFx(){const f=NET.fx;if(!f||!RUN)return netCues(f);
 RUN.projs=(f.pr||[]).map(p=>({kind:PKINDS[p[0]]||'bud',x:p[1],y:p[2],vx:p[3],vy:p[4],small:p[5],c:p[6]||null}));
 RUN.eprojs=(f.ep||[]).map(p=>({x:p[0],y:p[1],vx:p[2],vy:p[3]}));
 RUN.pickups=(f.pk||[]).map(p=>({kind:PICK[p[0]]||'petal',x:p[1],y:p[2]}));RUN.pods=(f.pd||[]).map(p=>({type:p[0],x:p[1],y:p[2]}));
 const ob={};for(const b of RUN.buds)ob[b.k]=b;
 RUN.buds=(f.bd||[]).map((b,i)=>{const o=ob[i+':'+b[0]]||{x:b[1],y:b[2],a:i};return Object.assign(o,{k:i+':'+b[0],type:b[0],tx:b[1],ty:b[2],yaw:b[3]/57.3,own:b[4],hop:b[5]/100,cd:b[6],mv:b[7]})});
 RUN.zones=(f.zn||[]).map(z=>({x:z[0],y:z[1],r:z[2]}));RUN.hazards=(f.hz||[]).map(h=>({x:h[0],y:h[1],r:h[2],t:h[3],t0:h[4],from:h[5]?'player':'foe',instant:!!h[6]}));
 RUN.acts=(f.ac||[]).map(a=>{switch(a[0]){case 0:return{k:'bike',x:a[1],y:a[2],vx:a[3],vy:a[4],delay:a[5]};case 1:return{k:'sprout',x:a[1],y:a[2],vx:a[3],vy:a[4],delay:a[5],type:a[6]};
  case 2:return{k:'judge',x:a[1],y:a[2],t:a[3],delay:a[4]};case 3:return{k:'geyser',x:a[1],y:a[2],delay:a[3],life:a[4]};case 4:return{k:'cloud',x:a[1],y:a[2],s:a[3],life:a[4]};
  case 5:return{k:'leash',o:PL.find(p=>p.ix===a[1])||PL[0],e:ENT[a[2]]||null,x2:a[3],y2:a[4],t:a[5],t0:a[6]}}return null}).filter(Boolean);
 for(const t of f.tx||[])if(!seenId.has('t'+t[0])){seenId.add('t'+t[0]);RUN.texts.push({x:t[1],y:t[2],txt:String(t[3]),c:t[4],t:t[5]})}
 for(const g of f.rg||[])if(!seenId.has('r'+g[0])){seenId.add('r'+g[0]);RUN.rings.push({x:g[1],y:g[2],r:g[3],t:g[4],c:g[5]})}
 for(const b of f.bl||[])if(!seenId.has('b'+b[0])){seenId.add('b'+b[0]);RUN.bolts.push({x:b[1],y:b[2],x2:b[3],y2:b[4],sky:!!b[5],t:b[6]})}
 netCues(f)}
function netCues(f){for(const s of f.sq||[])if(!seenId.has('s'+s[0])){seenId.add('s'+s[0]);if(performance.now()-NET.joinedAt<1500)continue;try{if(s[1]==='n')noise(...s.slice(2));else snd(...s.slice(2))}catch(e){}}
 if(seenId.size>4000)seenId.clear()}
function netApplyMeta(){const m=NET.meta;if(!m||typeof m!=='object')return;
 if(m.rd){const set=RD.set;RD=Object.assign(RDDEF(),m.rd,{set});RD.boonSeen={};for(let i=0;i<(m.rd.bs|0);i++)RD.boonSeen['b'+i]=1;for(const k of['msn','echo','bossK','killK','diedTo','charEsc','seenN','godMet'])RD[k]=RD[k]||{}}
 const u=m.ui||{};for(const k of['uiSel','menuSel','pauseSel','pausePage','pauseConfirm','codexPage','heatSel','boardSel','echoSel','sprPage','buyAsk'])if(typeof u[k]==='number')NETUI[k](u[k]);
 giftAsk=!!u.giftAsk;setReturn=u.setReturn||'title';offerGod=u.offerGod||'EMBER';boonQuote=String(u.boonQuote||'');
 if(Array.isArray(u.boon))boonOffer=u.boon;if(Array.isArray(u.shop))shopItems=u.shop;
 if(Array.isArray(u.talk)){[talkNPC,talkWho,talkTxt,talkLine,talkStart]=u.talk;talkEv=u.talk[5]?{lines:{length:u.talk[5]},rew:u.talk[6]}:null}
 echoRead=u.echo?(ECHOES.find(e=>e.id===u.echo)||(RELICS.find(r=>r.id===u.echo)?Object.assign({relic:true},RELICS.find(r=>r.id===u.echo)):null)):null;echoT=1;if(RUN&&u.boons)RUN.boons=u.boons;NET.mk=m.mk||{}}
const NETUI={uiSel:v=>uiSel=v,menuSel:v=>menuSel=v,pauseSel:v=>pauseSel=v,pausePage:v=>pausePage=v,pauseConfirm:v=>pauseConfirm=v,codexPage:v=>codexPage=v,heatSel:v=>heatSel=v,boardSel:v=>boardSel=v,echoSel:v=>echoSel=v,sprPage:v=>sprPage=v,buyAsk:v=>buyAsk=v};
/* every frame on a client: ease everything toward the host, run my own keeper locally, let effects play out */
function netClientFrame(dt){if(!NET.client)return;time+=dt;stateT+=dt;if(say2T>0)say2T-=dt;if(joinT>0)joinT-=dt;
 const k=Math.min(1,dt*14),run=!!RUN&&(state==='run');
 for(const p of PL){p.trail=p.trail||[];if(run&&p.dashT>0)p.trail.push({x:p.x,y:p.y,t:.22});for(const tr of p.trail)tr.t-=dt;p.trail=p.trail.filter(tr=>tr.t>0);if(p.cmbT>0)p.cmbT-=dt}
 if(run)fxUpdate(dt);
 for(const p of PL){for(const t of['swing','castA','selfie','selfieA','hurt','cheer','land','heavyA','diveL','spA','supA','dashT','inv','armT','slashT','reviving'])if(p[t]>0)p[t]-=dt;
  if(p.mine&&p.pred&&!p.down&&!(p.dive>0)&&(state==='hub'||state==='run'||state==='talk'))netPredict(p,dt);
  else{p.x+=(p.tx-p.x)*k;p.y+=(p.ty-p.y)*k}}
 for(const w of NPCS){const n=HUBNPC[w];if(n&&n.tx!==undefined){n.x+=(n.tx-n.x)*k;n.y+=(n.ty-n.y)*k}}
 if(!RUN)return;
 for(const e of RUN.enemies){e.x+=(e._x-e.x)*k;e.y+=(e._y-e.y)*k;if(e.kind==='boss'&&e.state>0&&e.t>0)e.t-=dt}
 for(const b of RUN.buds){b.x+=(b.tx-b.x)*k;b.y+=(b.ty-b.y)*k;b.a=(b.a||0)+dt}
 for(const p of RUN.projs){p.x+=p.vx*dt;p.y+=p.vy*dt}for(const p of RUN.eprojs){p.x+=p.vx*dt;p.y+=p.vy*dt}
 for(const a of RUN.acts){if(a.delay>0){a.delay-=dt;continue}if(a.vx){a.x+=a.vx*dt;a.y+=a.vy*dt}if(a.t!==undefined&&a.k==='judge')a.t+=dt;if(a.k==='leash')a.t-=dt}
 for(const t of RUN.texts){t.y-=16*dt;t.t-=dt}RUN.texts=RUN.texts.filter(t=>t.t>0);
 for(const g of RUN.rings)g.t-=dt;RUN.rings=RUN.rings.filter(g=>g.t>0);for(const b of RUN.bolts)b.t-=dt;RUN.bolts=RUN.bolts.filter(b=>b.t>0);
 for(const q of RUN.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.z=Math.max(0,(q.z||0)+(q.vz||0)*dt);if(!q.ng)q.vz=(q.vz||0)-140*dt;q.life-=dt}RUN.parts=RUN.parts.filter(q=>q.life>0).slice(-200);
 if(run&&RUN.shake>0)RUN.shake*=Math.max(0,1-dt*7)}
/* my keeper, on my screen, right now: the same walk and dash the host runs */
function netPredict(p,dt){const d=DEV[p.dk.split(':').pop()];if(!d)return;
 if(p.ldash>0){p.ldash-=dt;p.x+=p.lvx*dt;p.y+=p.lvy*dt}
 else{const l=Math.hypot(d.mx,d.my),sp=(state==='run'?p.spd||92:84)*(p.charging&&p.chg>.15?.55:1);if(l>0){const q=Math.min(1,l)/l;p.x+=d.mx*q*sp*dt;p.y+=d.my*q*sp*dt;p.ax=d.mx/l;p.ay=d.my/l;p.mv=1}else p.mv=0;
  if(state==='run'&&d.pr.dash&&p.dashCharges>0){p.ldash=.15;const a=Math.hypot(p.ax,p.ay)||1;p.lvx=p.ax/a*310;p.lvy=p.ay/a*310}}
 p.x=clamp(p.x,13,W-13);p.y=clamp(p.y,32,H-11);
 if(RUN&&state==='run')for(const o of RUN.obst){const nx=clamp(p.x,o.x,o.x+o.w),ny=clamp(p.y,o.y,o.y+o.h),dx=p.x-nx,dy=p.y-ny,dd=Math.hypot(dx,dy);if(dd<7&&dd>0){p.x=nx+dx/dd*7;p.y=ny+dy/dd*7}else if(dd===0)p.y=o.y-7}
 /* the host had to move me (a new room, a knockback it won't forget): follow it */
 const ex=p.tx-p.x,ey=p.ty-p.y;if(Math.hypot(ex,ey)>60){p.x=p.tx;p.y=p.ty}}

/* ---------------- the PLAY ONLINE screen ---------------- */
let onSel=0;
function onlineItems(){const L=[{t:'HOST A GAME',a:'host'}];for(const g of NET.games.slice(0,6))L.push({t:'JOIN '+gameName(g),b:g.n+'/4 · '+(g.s||''),a:'join',g});L.push({t:'BACK',a:'back'});return L}
async function onlineUpdate(){const L=onlineItems();onSel=nav(onSel,L.length);if(onSel>=L.length)onSel=L.length-1;
 if(pressed('b')){state='menu';return}
 if(!pressed('a'))return;const it=L[onSel];snd(660,.06,990);
 if(it.a==='back'){state='menu';return}
 if(!NET.room){NET.err=NET.err||'Online play isn\'t available here.';return}
 if(it.a==='host'){NET.status='OPENING...';if(await netHost())hubEnter()}
 else if(it.a==='join'&&it.g){NET.status='JOINING...';if(!(await netJoin(it.g.code))){state='online'}}}
function drawOnline(){screenShell('PLAY ONLINE',NET.host?'HOSTING '+NET.code.toUpperCase():'FRIENDS WITH THIS PAGE OPEN');
 if(!NET.room){wrapPx(NET.err||'Connecting...',270,1).forEach((l,i)=>ctext(l,80+i*14,1,'#c8c0d8',null));footer(btnName(lead0(),'b')+': BACK');return}
 const L=onlineItems();rowsDraw2(L.map(x=>({a:x.t,b:x.b||''})),onSel,onSel===0?'Your game: anyone with this page open can join you. They play with their own controller, keyboard or phone, and the run counts on your save.':L[onSel].a==='join'?'Join this game. You play in their world; your own save stays as it is.':'');
 if(L.length===2)ctext('NO GAMES OPEN RIGHT NOW',VH-80,1,'#8d84a8',null);if(NET.err)ctext(NET.err.slice(0,60),VH-94,1,'#ff9a8a',null);
 footer(btnName(lead0(),'a')+': CHOOSE    '+btnName(lead0(),'b')+': BACK')}
/* the line at the top while you're online, and the client's "press A" / leave prompts */
function hudNet(){if(!NET.host&&!NET.client)return;
 if(NET.host){const n=new Set(PL.filter(p=>p.dev.net).map(p=>p.dev.peer)).size;text('ONLINE · '+NET.code.toUpperCase()+(n?' · '+n+' FRIEND'+(n>1?'S':''):' · WAITING FOR FRIENDS'),8,VH-14,1,'rgba(168,240,128,.85)','#120a18')}
 else{const age=performance.now()-NET.snapAt,mine=PL.some(p=>p.mine);
  text(NET.core?(age>800?'ONLINE · LAGGING...':'ONLINE · '+NET.code.toUpperCase()):'CONNECTING TO THE HOST...',8,VH-14,1,age>800?'#ff9a8a':'rgba(168,240,128,.85)','#120a18');
  if(NET.core&&!mine&&state!=='cine'&&state!=='ep')banner('PRESS A TO JOIN THE PARTY',VH*.38);
  if(NET.leaveT>0)banner('HOLD TO LEAVE THE ONLINE GAME...',VH*.5)}}
/* a client leaves by holding Select (keyboard Q / Esc) or the touch START for 1.5 s */
function netClientLeaveCheck(dt){if(!NET.client)return;let held=false;for(const id in DEV){const d=DEV[id];if(d.cur.sel||(id==='touch'&&d.cur.start))held=true}
 NET.leaveT=held?NET.leaveT+dt:0;if(NET.leaveT>1.5){NET.leaveT=0;netLost('YOU LEFT THE ONLINE GAME')}}
