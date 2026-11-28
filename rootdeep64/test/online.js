/* Online play test: two real copies of the game, one hosting and one joining, talking through a
   stand-in for the artifact platform's `room` capability (relayed here with network-like delay).
   Saves frames to test/shots/online-*.png.   usage: node test/online.js */
const {chromium}=require('playwright');const path=require('path');
const DELAY=+(process.env.NET_DELAY||60);
(async()=>{const out=path.join(__dirname,'shots');require('fs').mkdirSync(out,{recursive:true});
 const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pages=[];let fails=0;const errs=[];
 const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL ')+m);if(!c)fails++};
 /* the stand-in room: every page keeps the peers it has heard of; the relay fans messages out with a delay */
 const mock=()=>{const tab='t'+Math.random().toString(36).slice(2,8);const rooms={};const hs={};
  function R(name){if(rooms[name])return rooms[name];const st={peers:{},ph:[],self:{peer:tab,by:'u'+tab,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:{},updatedAt:Date.now()}};
   st.peers[tab]=st.self;const fire=(chg)=>{const peers=Object.values(st.peers);for(const h of st.ph)setTimeout(()=>h(Object.assign({peers},chg)),0)};
   const api={name,emit:async()=>{},on:()=>()=>{},connected:()=>true,onConnection:h=>{setTimeout(()=>h(true),0);return()=>{}},
    presence:async patch=>{const p=Object.assign({},st.self.presence);for(const k in patch){if(patch[k]===null)delete p[k];else p[k]=patch[k]}if(JSON.stringify(p).length>4096)throw{code:'invalid_argument'};
     st.self=Object.assign({},st.self,{presence:Object.freeze(p),updatedAt:Date.now()});st.peers[tab]=st.self;fire({joined:[],left:[],updated:[st.self]});window.__relay(JSON.stringify({room:name,from:tab,type:'p',presence:p}))},
    peers:()=>Object.values(st.peers),onPeers:h=>{st.ph.push(h);setTimeout(()=>h({peers:Object.values(st.peers),joined:Object.values(st.peers),left:[],updated:[]}),0);return()=>{}},
    leave:async()=>{delete rooms[name];window.__relay(JSON.stringify({room:name,from:tab,type:'l'}))}};
   st.api=api;st.fire=fire;rooms[name]=st;window.__relay(JSON.stringify({room:name,from:tab,type:'j'}));return st}
  window.__mockRecv=(s)=>{const m=JSON.parse(s);const st=rooms[m.room];if(!st||m.from===tab)return;
   if(m.type==='l'){const p=st.peers[m.from];delete st.peers[m.from];if(p)st.fire({joined:[],left:[p],updated:[]});return}
   const fresh=!st.peers[m.from];const p={peer:m.from,by:'u'+m.from,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:Object.freeze(m.presence||(st.peers[m.from]||{}).presence||{}),updatedAt:Date.now()};
   st.peers[m.from]=p;st.fire({joined:fresh?[p]:[],left:[],updated:fresh?[]:[p]});
   if(m.type==='j'&&!m.echo)window.__relay(JSON.stringify({room:m.room,from:tab,type:'p',presence:st.self.presence,echo:1}))};
  const lobby=R('lobby').api;const room=Object.assign({},lobby,{join:async n=>R(n).api,sendToClaudeSession:async()=>({to:'pane'}),canSendToClaudeSession:async()=>'off'});
  const user={profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{name:i.slice(-3)==='hst'?'Will':'Keeper '+i.slice(-3)}])),id:async()=>'u'+tab,me:async()=>({id:'u'+tab})};
  window.claude={use:async n=>n==='room'?room:n==='user'?user:null}};
 const mk=async(name,w,h)=>{const pg=await br.newPage({viewport:{width:w,height:h}});pg.on('pageerror',e=>errs.push(name+': '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(name+': '+m.text())});
  await pg.exposeBinding('__relay',(src,msg)=>{for(const o of pages)if(o!==pg)setTimeout(()=>o.evaluate(s=>window.__mockRecv&&window.__mockRecv(s),msg).catch(()=>{}),DELAY)});
  await pg.addInitScript(mock);pages.push(pg);await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(400);
  await pg.evaluate(()=>{localStorage.clear();rdLoad();RD.flags.cineSeen=1});return pg};
 const A=await mk('host',960,540),B=await mk('friend',932,430);
 const tap=async(pg,k,ms=70)=>{await pg.keyboard.down(k);await pg.waitForTimeout(ms);await pg.keyboard.up(k);await pg.waitForTimeout(120)};
 const ev=(pg,f,a)=>pg.evaluate(f,a);
 /* host: title -> menu -> PLAY ONLINE -> HOST */
 await tap(A,'Enter');await tap(A,'KeyS');await tap(A,'KeyZ');await A.waitForTimeout(400);
 let s=await ev(A,()=>({st:state,room:!!NET.room}));ok(s.st==='online'&&s.room,'host: PLAY ONLINE opens the online screen ('+s.st+')');
 await tap(A,'KeyZ');await A.waitForTimeout(800);s=await ev(A,()=>({st:state,host:NET.host,code:NET.code}));ok(s.st==='hub'&&s.host&&s.code,'host: HOST A GAME opens a room ('+s.code+') and goes to the Hearth');
 await A.waitForTimeout(2500);
 /* friend: finds it in the list and joins */
 await tap(B,'Enter');await tap(B,'KeyS');await tap(B,'KeyZ');await B.waitForTimeout(700);
 s=await ev(B,()=>onlineItems().map(i=>i.t));ok(s.some(t=>/^JOIN .+'S GAME/.test(t)),'friend: the host\'s game is listed by name: '+s.join(' | '));
 await tap(B,'KeyS');await tap(B,'KeyZ');await B.waitForTimeout(1500);
 s=await ev(B,()=>({client:NET.client,core:!!NET.core,st:state,pl:PL.length}));ok(s.client&&s.core&&s.st==='hub','friend: joined and is drawing the host\'s Hearth ('+JSON.stringify(s)+')');
 await B.screenshot({path:path.join(out,'online-1-friend-joined.png')});
 /* friend presses A: their keeper appears in the host's party */
 await tap(B,'KeyZ');await B.waitForTimeout(900);
 s=await ev(A,()=>PL.map(p=>p.ix+':'+(p.dev.net?'net':p.dev.id)));ok(s.length===2&&s[1].endsWith('net'),'host: the friend joined the party as P2 ('+s+')');
 s=await ev(B,()=>PL.map(p=>p.ix+(p.mine?'*':'')));ok(s.includes('1*'),'friend: sees both keepers and knows which one is theirs ('+s+')');
 /* the friend walks: it moves on their screen at once, and the host follows */
 const b0=await ev(B,()=>{const p=PL.find(q=>q.mine);return[p.x,p.y]});await B.keyboard.down('KeyD');await B.waitForTimeout(150);
 const b1=await ev(B,()=>{const p=PL.find(q=>q.mine);return[p.x,p.y]});await B.waitForTimeout(500);await B.keyboard.up('KeyD');await B.waitForTimeout(600);
 ok(b1[0]-b0[0]>5,'friend: their keeper moves on their own screen straight away (+'+Math.round(b1[0]-b0[0])+' in 0.15 s)');
 const hx2=await ev(A,()=>PL[1].x),fx2=await ev(B,()=>PL.find(q=>q.mine).x);ok(Math.abs(hx2-fx2)<8&&hx2-b0[0]>20,'host: sees the friend where the friend is (host '+Math.round(hx2)+', friend '+Math.round(fx2)+')');
 /* into the deep together */
 await ev(A,()=>{__rd.RDF.depart()});await A.waitForTimeout(1500);
 s=await ev(B,()=>({st:state,ch:RUN&&RUN.chamber,foes:RUN&&RUN.enemies.length,pl:PL.length}));ok(s.st==='run'&&s.ch===1&&s.foes>0,'friend: follows the host into chamber 1 and sees the foes ('+JSON.stringify(s)+')');
 await ev(A,()=>{for(const e of RUN.enemies){e.sp=0;e.dmg=0}const e=RUN.enemies[0];const p=PL[1];e.x=p.x;e.y=p.y-20;e.born=0});await A.waitForTimeout(400);
 const hp0=await ev(A,()=>{window.__e0=RUN.enemies[0];return __e0.hp});await ev(B,()=>{const p=PL.find(q=>q.mine);p.ax=0;p.ay=-1});
 for(let i=0;i<4;i++)await tap(B,'KeyZ',60);await A.waitForTimeout(400);const hp1=await ev(A,()=>Math.max(0,__e0.hp));
 ok(hp1<hp0,'the friend\'s attacks land on the host ('+Math.round(hp0)+' -> '+Math.round(hp1)+')');
 await tap(B,'KeyX');await B.waitForTimeout(250);s=await ev(B,()=>RUN.projs.length+RUN.texts.length);ok(s>0,'friend: sees casts and damage numbers ('+s+')');
 await B.screenshot({path:path.join(out,'online-2-friend-in-run.png')});await A.screenshot({path:path.join(out,'online-3-host-in-run.png')});
 /* the friend pauses: it's their pause menu on the host */
 await tap(B,'Enter');await A.waitForTimeout(500);s=await ev(A,()=>({st:state,own:(PL.find(p=>p.dev===menuDev)||{}).ix}));ok(s.st==='pause'&&s.own===1,'the friend can pause; the pause menu is theirs ('+JSON.stringify(s)+')');
 await B.waitForTimeout(500);await B.screenshot({path:path.join(out,'online-4-friend-paused.png')});
 await tap(A,'KeyZ');s=await ev(A,()=>state);ok(s==='pause','the host can\'t drive the friend\'s pause menu');
 await tap(B,'Enter');await A.waitForTimeout(400);s=await ev(A,()=>state);ok(s==='run','the friend resumes');
 /* a boon screen on the friend's side */
 await ev(A,()=>{__rd.RDF.clearRoom();menuDev=PL[1].dev;__rd.RDF.forceBoon('ZIP');menuDev=PL[1].dev});await B.waitForTimeout(900);
 s=await ev(B,()=>({st:state,n:boonOffer.length,g:offerGod}));ok(s.st==='boon'&&s.n===3&&s.g==='ZIP','friend: sees the boon cards ('+JSON.stringify(s)+')');
 await B.screenshot({path:path.join(out,'online-5-friend-boon.png')});
 await B.waitForTimeout(300);await tap(B,'KeyZ');await A.waitForTimeout(500);s=await ev(A,()=>({st:state,b:[RUN.boons.atk,RUN.boons.cast,RUN.boons.dash,...RUN.boons.pass].filter(Boolean).length}));ok(s.st==='run'&&s.b===1,'the friend picks the boon for the party');
 /* the friend leaves */
 await B.keyboard.down('KeyQ');await B.waitForTimeout(1900);await B.keyboard.up('KeyQ');await B.waitForTimeout(800);
 s=await ev(B,()=>({st:state,client:NET.client,dew:RD.dew}));ok(!s.client&&s.st==='menu','friend: holding Select leaves the online game, back to their own menu ('+JSON.stringify(s)+')');
 await A.waitForTimeout(6500);s=await ev(A,()=>PL.length);ok(s===1,'host: the friend\'s keeper leaves the party ('+s+' left)');
 console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].slice(0,10).join('\n'):'no console errors');console.log(fails?fails+' FAILED':'ALL GREEN');await br.close();process.exit(fails||errs.length?1:0)})();
