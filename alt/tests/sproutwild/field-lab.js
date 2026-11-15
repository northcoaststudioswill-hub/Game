// Field engine checks (Fable v5.1): node field-lab.js <built html>
// Drives the real page in headless Chromium, stepping the game's own update() so results do not depend on frame timing.
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="4"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(900);
const res=await p.evaluate(()=>{const G=window.__g,F=G.SWF(),S=F.meta(),out=[];F.noScenes(true);F.noCap(true);
 const ok=(n,c,x)=>out.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  ['+x+']':''));
 const step=(n,keys)=>{for(let i=0;i<n;i++){for(const k in G.keys)G.keys[k]=0;if(keys)for(const k of keys)G.keys[k]=1;G.update(1/30);for(const k in G.keys)G.prev[k]=G.keys[k]}for(const k in G.keys)G.keys[k]=0;G.update(1/30);for(const k in G.keys)G.prev[k]=0};
 const tap=k=>{step(1,[k]);step(1)};
 const T=16,at=(tx,ty,d)=>{F.setPos(tx*T+8,ty*T+10);const f2=F.fld();if(d)f2.dir=d;for(const s of f2.sq)if(s.st==='follow'){s.x=F.pos().x;s.y=F.pos().y+6}};
 const fight=()=>{for(let n=0;n<600&&F.state()==='g4battle';n++){const bt=F.bt();if(bt.foe)bt.foe.hp=Math.min(bt.foe.hp,1);S.party[0].hp=200;if(bt.phase==='moves')tap(['right','down','left','up'][n%4]);tap('a');step(3)}};
 try{
 /* the opening, played: seeds, berries, the Lantern stirs, a buddy joins, the road opens */
 {S.intro=1;F.enter('BASE');step(3);const bf=F.bf();
  ok('a new game wakes at the dark Lantern with three glowing seeds',F.op()===0&&bf.buds.length===3&&!S.lit,F.op());
  step(200);ok('Erin and Marcus are there and talk you through it',F.npcs().length===2&&S.beats&&S.beats.wake===1,JSON.stringify(S.beats));
  for(let i=0;i<60;i++)step(1,['down']);ok('the south road is closed before the Lantern wakes',!F.fld());
  for(let n=0;n<3;n++){const b=bf.buds[0];F.setPos(b.x,b.y+13);step(2,['up']);tap('a');step(4)}
  ok('plucking them gives a squad of three',bf.sq.length===3&&F.op()===1,bf.sq.length);
  for(let n=0;n<3;n++){const it=bf.items.find(i=>i.op&&!i.car.length);if(!it)break;F.setPos(it.x+40,it.y+2);step(2,['left']);for(const q of bf.sq)if(q.st==='follow'){q.x=F.pos().x+8;q.y=F.pos().y}step(4);tap('a');step(20)}
  step(500);ok('thrown sprouts carry the berries home and the Lantern stirs',!!S.lit&&F.op()===2,S.fedN);
  F.setPos(240,170);step(2,['up']);step(2);ok('dim buddies come to the light',F.near()&&F.near().k==='choice',F.near()&&F.near().k);
  tap('a');step(4);tap('a');step(10);tap('a');step(10);ok('greeting one makes it your first buddy',S.party.length===1&&S.quest===2,S.quest);
  F.setPos(F.louie().x+13,F.louie().y);step(2,['left']);const st0=F.state();tap('a');step(3);ok('Louie is a dog, not a menu',F.state()==='g4world',F.state());
  F.setPos(240,470);for(let i=0;i<60&&!F.fld();i++)step(1,['down']);ok('now the south road leads to the Meadow',F.fld()&&F.fld().id==='MEADOW',F.state()+' pos='+JSON.stringify(F.pos())+' q='+S.quest+' sec='+S.sector)}
 S.intro=1;S.quest=5;S.lit=1;S.pouch=24;S.tendDone=true;S.tendStage=4;S.fl={};S.badges=[];S.buds={EMBER:4,PEB:0,DEW:3,ZIP:0,LEAF:3,LUCKY:0};S.res={wood:0,stone:0,petal:0,berry:0,ingot:0};
 F.giveMon('CINDERCAP',30);F.enter('MEADOW');let f=F.fld();
 ok('meadow is a field map',!!f&&f.w===36&&f.h===25,f&&f.w+'x'+f.h);
 step(3);ok('the pouch walks with you as a squad',f.sq.length===10,f.sq.length);
 f.npcs.forEach(n=>{if(n.team)S.fl[n.fk]=1});
 /* throw + whistle */
 at(17,20,[0,-1]);step(20);tap('a');step(4);ok('with nothing locked on, A throws nothing',f.sq.every(s=>s.st==='follow'),f.sq.map(s=>s.st).join(','));
 {const bs=F.nodes().find(n=>n.k==='bush');F.setPos(bs.x,bs.y+34);f.dir=[0,-1];for(const q of f.sq){q.x=F.pos().x;q.y=F.pos().y+8}step(4);tap('a');step(4);ok('A throws a sprout at what the ring locked on',f.sq.some(s=>s.st==='fly'||s.st==='work'),f.sq.map(s=>s.st).join(','));ok('the right kind steps up by itself (DEW for berries)',S.selType===2,S.selType)}
 at(17,14,[0,-1]);step(2);const before=f.sq.filter(s=>s.st==='follow').length;
 at(17,19,[0,-1]);for(const it of f.items)it.car=[];for(const q of f.sq){q.tg=null;q.st='idle';q.t=0;q.x=F.pos().x+30;q.y=F.pos().y+4}step(40,['b']);step(40);ok('holding B whistles them back',f.sq.every(s=>s.st==='follow'),f.sq.map(s=>s.st).join(','));
 /* bridge */
 at(15,12,[-1,0]);step(15);for(let i=0;i<6;i++){tap('a');step(5)}
 ok('sprouts take the bridge job',f.sq.filter(s=>s.st==='work').length>=4,f.sq.filter(s=>s.st==='work').length);
 step(600);const site=f.sites[0];ok('the bridge gets built',site.done&&f.t[12][10]==='=',site.hp);
 /* carry the island treasure home (weight 3) */
 step(40,['b']);step(20);at(10,12,[-1,0]);step(15);
 const tre=f.items.find(i=>i.n==='ACORN CROWN');tap('a');step(20);
 ok('one sprout cannot lift weight 3',tre&&tre.car.length===1&&Math.abs(tre.x-(7*T+8))<1,tre&&tre.car.length);
 tap('a');step(6);tap('a');step(900);
 ok('three sprouts carry it to the beacon',S.fl[tre.fk]===1&&S.res.petal>=40,S.res.petal);
 ok('carriers come back after delivery',f.sq.every(s=>s.st!=='carry'));
 /* type gate */
 step(40,['b']);step(30);at(22,9,[0,-1]);step(15);tap('a');step(30);const gate=f.gates[0];
 ok('wrong kind bounces off the boulder wall',!gate.open&&gate.hp===gate.max,gate.hp);
 at(5,4,[0,-1]);step(4);const bud=f.buds.find(q=>q.type===1);F.setPos(bud.x,bud.y+12);f.dir=[0,-1];step(3);tap('a');step(3);
 ok('plucking a buried PEB sprout adds it to the squad',S.buds.PEB===1&&f.sq.some(s=>s.type===1),S.buds.PEB);
 at(22,9,[0,-1]);step(40,['b']);step(30);at(22,9,[0,-1]);step(10);tap('a');step(500);
 ok('a PEB sprout cracks the boulder wall',gate.open,gate.hp);
 at(22,9,[0,-1]);step(60,['up']);ok('the keeper can walk through the opened gate',F.pos().y<8*T+6,Math.round(F.pos().y));
 /* ledge */
 at(28,7,[0,1]);step(30,['down']);ok('ledges hop down',F.pos().y>9*T,Math.round(F.pos().y));
 at(28,9,[0,-1]);step(30,['up']);ok('ledges do not climb',F.pos().y>8*T+8,Math.round(F.pos().y));
 /* node -> pellet -> home */
 step(40,['b']);step(40);const w0=S.res.wood;const nd=F.nodes().find(n=>n.k==='tree'&&!n.got);F.setPos(nd.x+2,nd.y+16);f.dir=[0,-1];for(const q of f.sq){q.x=F.pos().x;q.y=F.pos().y+8}step(6);
 ok('sprouts do not target trees; the ring offers a buddy instead',!f.sq.some(q=>q.st==='work')&&!F.near(),F.near()&&F.near().txt);
 F.giveMon('FERNFANG',8);S.party.unshift(S.party.pop());step(3);step(30);G.draw();ok('the ring locks on and offers the LUMBER buddy',f.aimLab==='SEND FERNFANG · CHOP',f.aimLab);
 tap('a');step(200);ok('the buddy fells the tree and it drops a log',nd.got&&f.items.some(i=>i.res==='wood'),nd.hp);
 {const lg=f.items.find(i=>i.res==='wood');F.setPos(lg.x,lg.y+30);f.dir=[0,-1];for(const q of f.sq){q.x=F.pos().x;q.y=F.pos().y+8;q.st='follow'}step(6);for(let i=0;i<3;i++){tap('a');step(6)}step(1500)}
 ok('sprouts carry the log home',S.res.wood>w0,S.res.wood);S.party.push(S.party.shift());
 /* alpha guards its treasure */
 const al=f.alphas[0],gt=f.items.find(i=>i.guard);ok('an alpha guards the plateau treasure',!!al&&!!gt);
 /* walking off the edge travels; arriving puts you by the matching exit */
 at(17,1,[0,-1]);for(let i=0;i<40&&F.fld().id==='MEADOW';i++)step(1,['up']);f=F.fld();ok('north edge of the meadow leads to town',f.id==='TOWN',f.id);
 ok('you arrive at the town south gate',F.pos().y>14*T,Math.round(F.pos().y));
 at(27,6,[1,0]);step(40,['right']);ok('roads need sigils',F.fld().id==='TOWN');
 S.badges=['A','B','C'];at(27,6,[1,0]);for(let i=0;i<40&&F.fld().id==='TOWN';i++)step(1,['right']);f=F.fld();ok('with sigils the east road opens',f.id==='WASTES',f.id);
 /* trainers spot you */
 const dg=f.npcs.find(n=>n.who==='DEREK');step(50);at(21,11,[0,1]);step(2);ok('a trainer spots you on the road',!!f.spot||!!f.dlg);
 step(60);for(let i=0;i<4;i++){tap('a');step(4)}step(40);ok('...and battles you',F.state()==='g4battle'&&F.bt().mode==='trainer',F.state());
 fight();
 ok('beating a trainer pays and is remembered',S.fl[dg.fk]===1&&F.state()==='g4world',F.state());
 /* the dome and the king */
 f=F.fld();at(20,3,[0,-1]);step(60,['up']);ok('the iron dome blocks the peak road',F.fld().id==='WASTES'&&F.pos().y>2*T+12,Math.round(F.pos().y));
 F.enter('GLOOM');f=F.fld();const kb=f.npcs.find(n=>n.boss);F.setPos(kb.x,kb.y+14);f.dir=[0,-1];step(3);tap('a');step(3);
 ok('king bibi talks before he fights',!!f.dlg&&f.dlg.who==='KING BIBI');
 for(let i=0;i<5;i++){tap('a');step(4)}step(40);
 fight();
 ok('beating king bibi sets the flag',S.fl.bibi===1,F.state()+' '+(F.bt()?F.bt().phase+' ai'+F.bt().aiIx+' foe'+F.bt().foe.sp+':'+F.bt().foe.hp+' q'+(F.bt().queue||[]).length+' hp'+S.party.map(m=>m.hp).join('/')+' log:'+JSON.stringify((F.bt().log||[]).slice(-1)):''));
 F.enter('WASTES');at(20,3,[0,-1]);for(let i=0;i<80&&F.fld().id==='WASTES';i++)step(1,['up']);ok('the dome is down: the peak road is open',F.fld().id==='PEAK',F.fld().id);
 /* swarming: sprouts bloom on a tired buddy; none are used up */
 {F.enter('MEADOW');S.buds={EMBER:2,PEB:0,DEW:0,ZIP:0,LEAF:4,LUCKY:0};step(3);const b0=S.buds.LEAF,box0=S.box.length+S.party.length;S.quest=2;F.forceWild('FERNFANG',3);
  for(let i=0;i<30&&F.bt().phase!=='menu';i++){tap('a');step(4)}F.bt().foe.hp=1;tap('right');tap('a');step(3);
  ok('SWARM opens the sprout picker',F.bt().phase==='budpick',F.bt().phase);
  for(let i=0;i<6&&F.bt().phase==='budpick';i++){tap('a');step(3)}step(70);for(let i=0;i<20&&F.state()==='g4battle';i++){tap('a');step(6)}
  ok('the swarm blooms and the buddy joins',S.party.length+S.box.length===box0+1,S.party.length+S.box.length-box0);
  ok('no sprout is used up',S.buds.LEAF===b0&&S.buds.EMBER===2,JSON.stringify(S.buds));S.quest=5}
 /* buddies fetch ore and fiber */
 {F.enter('MEADOW');const sp=F.spots().find(q=>q.k==='fiber'),f0=S.res.fiber||0;F.setPos(sp.x,sp.y+24);F.fld().dir=[0,-1];step(3);tap('a');step(260);
  ok('the lead buddy fetches FIBER from a thicket',(S.res.fiber||0)>=f0+2&&sp.got,(S.res.fiber||0)-f0)}
 /* the pouch limits the squad; four deliveries grow a sprout */
 {S.pouch=8;S.buds={EMBER:6,PEB:0,DEW:6,ZIP:0,LEAF:0,LUCKY:0};step(3);ok('the seed pouch caps the squad',F.fld().sq.length===8,F.fld().sq.length);S.pouch=24;step(3)}
 /* the south road joins Sunkeep and the Meadow */
 {S.bottieSeen=1;F.enter('MEADOW');at(2,2,[0,-1]);for(let i=0;i<60&&F.fld();i++)step(1,['up']);ok('the meadow north-west gate leads home to the south gate of Sunkeep',!F.fld()&&F.pos().y>440,Math.round(F.pos().y));
  for(let i=0;i<90&&!F.fld();i++)step(1,['down']);ok('...and Sunkeep south road leads back out',F.fld()&&F.fld().id==='MEADOW')}
 /* gear and services found by playing on */
 {S.gear={};F.enter('MEADOW');at(28,9,[0,-1]);step(30,['up']);ok('no rope: ledges still do not climb',F.pos().y>8*T+8);
  S.gear={rope:1};at(28,9,[0,-1]);step(40,['up']);ok('with a CLIMBING ROPE you climb the ledge',F.pos().y<8*T,Math.round(F.pos().y));
  S.party[0].hp=1;F.enter('BASE');F.setPos(240,92);step(3,['up']);step(2);tap('a');step(3);
  ok('the Great Lantern opens as the hub',F.state()==='g4lamp',F.state()+' near='+JSON.stringify(F.near()&&F.near().txt)+' pos='+JSON.stringify(F.pos())+' talk='+JSON.stringify(F.talk())+' q='+S.quest+' lit='+S.lit);tap('a');step(3);ok('resting in the light heals the party',S.party[0].hp>1,S.party[0].hp)}
 /* the party in the field, and open-field capture */
 {S.party=[];F.giveMon('FERNFANG',8);F.giveMon('PEBBLIT',8);F.giveMon('DRIZZLET',8);F.enter('MEADOW');step(40);const f2=F.fld();
  ok('three party buddies walk with you',f2.pf.length===3&&f2.pf.every(b=>b.st==='follow'),f2.pf.length);
  const tr=F.nodes().find(n=>n.k==='tree'&&!n.got),rk=F.nodes().find(n=>n.k==='rock'&&!n.got);
  F.setPos(tr.x,tr.y+20);f2.dir=[0,-1];step(20);tap('a');step(4);const fb=f2.pf.find(b=>b.m.sp==='FERNFANG');
  ok('A sends the LUMBER buddy to the tree',fb.st==='go'||fb.st==='work',fb.st);
  F.setPos(rk.x,rk.y+20);f2.dir=[0,-1];step(20);tap('a');step(4);const pbb=f2.pf.find(b=>b.m.sp==='PEBBLIT');
  const pj=pbb.tg;ok('...and the MINE buddy to the nearest rock work, at the same time',(pbb.st==='go'||pbb.st==='work')&&(pj.k==='rock'||pj.k==='ore')&&(fb.st==='go'||fb.st==='work'),pbb.st+' '+fb.st+' '+(pj&&pj.k));
  step(400);ok('both jobs finish',tr.got&&pj.got,tr.hp+' '+pj.got);
  /* capture: enough kin sprouts latch on and it blooms */
  S.buds={EMBER:0,PEB:0,DEW:0,ZIP:0,LEAF:8,LUCKY:0};S.pouch=24;step(5);W4wilds=F.wilds();const before=S.party.length+S.box.length;
  const wd=W4wilds[0];W4wilds.splice(1);wd.sp='FERNFANG';wd.lv=3;wd.t=99;wd.tx=wd.x;wd.ty=wd.y;F.setPos(wd.x,wd.y+30);f2.dir=[0,-1];for(const q of f2.sq){q.x=F.pos().x;q.y=F.pos().y+6;q.st='follow'}step(4);
  for(const sp of f2.spots)sp.got=true;for(const n of F.nodes())n.got=true;step(2);for(let i=0;i<5;i++){tap('a');step(6)}step(60);G.draw();
  ok('thrown sprouts latch on to the wild',(wd.lat||[]).length>=3||!!wd.cap,(wd.lat||[]).length+' st='+F.state()+' spot='+!!f2.spot+' dlg='+!!f2.dlg+' inW='+F.wilds().includes(wd)+' d='+Math.round(Math.hypot(wd.x-F.pos().x,wd.y-F.pos().y))+' aim='+f2.aimLab+' sq='+f2.sq.map(q=>q.st).join(','));
  for(let i=0;i<200&&F.state()==='g4world';i++)step(1);for(let i=0;i<8&&F.state()!=='g4world';i++){tap('a');step(4)}
  ok('it is caught in the open field, or turns to fight',S.party.length+S.box.length===before+1||F.state()==='g4battle'||(F.bt&&F.bt()),S.party.length+S.box.length-before);
  if(F.state()==='g4battle'){for(let n=0;n<300&&F.state()==='g4battle';n++){const bt=F.bt();if(bt.foe)bt.foe.hp=Math.min(bt.foe.hp,1);S.party[0].hp=200;tap('a');step(3)}}
  S.party=S.party.slice(0,1)}
 /* every sector builds and draws */
 for(const id of ['MEADOW','TOWN','WASTES','SHORE','GLOOM','PEAK']){F.enter(id);step(5);G.draw()}
 ok('all six sectors build, update and draw',true);
 /* Sunkeep: same squad, same orders, loot goes to the Lantern */
 S.bottieSeen=1;S.bottieBeat=1;F.enter('BASE');step(5);G.draw();const bf=F.bf();ok('sunkeep has the squad too',!F.fld()&&!!bf&&bf.sq.length>0,bf&&bf.sq.length);
 {const nd=F.nodes().find(n=>n.k==='bush'),w1=S.res.berry;F.setPos(nd.x,nd.y+30);step(2,['up']);for(const q of bf.sq){q.x=F.pos().x;q.y=F.pos().y+8;q.st='follow'}step(10);
  for(let i=0;i<4;i++){tap('a');step(5)}ok('sprouts are thrown at home too',bf.sq.filter(q=>q.st==='work'||q.st==='fly').length>=3,bf.sq.map(q=>q.st).join(','));
  step(1800);G.draw();ok('sprouts pick a Sunkeep berry bush and carry the berries to the Lantern',nd.got&&S.res.berry>w1,S.res.berry-w1);
  step(40,['b']);step(60);ok('whistle works at home',bf.sq.every(q=>q.st==='follow'),bf.sq.map(q=>q.st).join(','))}
 /* Palworld-style work: buddies at home pick jobs by skill, goods are carried to the Lantern */
 {S.box=[];S.party=S.party.slice(0,1);S.craftQ=[];S.buildings=[];S.crew=[];F.build('kiln',4,8);F.build('bench',8,8);F.build('quarry',14,8);
  const fire=F.giveMon('CINDERCAP',5,true),rock=F.giveMon('PEBBLIT',5,true),zip=F.giveMon('ZIPWIG',5,true);step(3);const wk=F.wk();
  ok('box buddies become base workers',wk.length===3,wk.length);
  S.res.ore=6;step(120);ok('without a cottage, home buddies only wait',wk.every(w=>!w.task||w.task.k==='idle'),wk.map(w=>w.task&&w.task.k).join());F.build('cottage',18,12);step(60);ok('with a roof they find work',wk.some(w=>w.task&&w.task.k!=='idle'),wk.map(w=>w.task&&w.task.k).join());
  ok('species bring their own work skills',F.wkSkills(wk[0]).KINDLING>=1&&F.wkSkills(wk[1]).QUARRY>=1&&F.wkSkills(wk[2]).HANDIWORK>=1,JSON.stringify(wk.map(w=>F.wkSkills(w))));
  F.dayT(20);F.setPos(60,460);S.res.ore=0;step(300);ok('the kiln sits idle without ore',!(S.buildings[0].prog>0),S.buildings[0].prog);S.res.ore=6;const i0=S.res.ingot,s0=S.res.stone;step(240);
  const kiln=S.buildings[0],quarry=S.buildings[2];
  let seenK=false,seenQ=false;for(let i=0;i<700;i++){step(1);if(wk[0].task&&wk[0].task.b===kiln)seenK=true;if(wk[1].task&&wk[1].task.b===quarry)seenQ=true}
  ok('the fire buddy picks the kiln, the rock buddy the quarry',seenK&&seenQ,(wk[0].task&&wk[0].task.k)+','+(wk[1].task&&wk[1].task.k));
  step(2400);G.draw();ok('smelting uses up ore',S.res.ore<6,S.res.ore);ok('buildings make goods and workers haul them to the Lantern',S.res.ingot>i0&&S.res.stone>s0,(S.res.ingot-i0)+' ingot, '+(S.res.stone-s0)+' stone');
  S.res.berry=9;const t0=S.tonics;S.craftQ.push({id:'tonic',need:12,done:0});step(1500);
  ok('the CRAFT buddy builds the bench queue',S.tonics===t0+1&&S.craftQ.length===0,S.tonics-t0);
  S.box=[];step(3);S.craftQ.push({id:'tonic',need:12,done:0});F.setPos(10+8*20+10,38+8*20+24);step(500);
  ok('with no crafter you can build it by hand at the bench',S.craftQ.length===0,S.craftQ.length&&S.craftQ[0].done);
  S.box=[fire];step(3);F.dayT(250);step(200);ok('workers sleep at night',F.wk()[0].task&&F.wk()[0].task.k==='sleep',F.wk()[0].task&&F.wk()[0].task.k);F.dayT(20)}
 /* save files: new, continue, erase, and nothing touches the other files */
 {S.quest=5;S.day=9;F.setRes('wood',77);F.start();ok('START > title',F.state()==='g4title');
  tap('a');step(2);tap('down');tap('a');step(3);
  ok('an empty file starts a NEW GAME',F.state()==='g4intro'&&F.meta().quest===0&&!F.meta().party.length&&F.meta().res.wood===0,F.state());
  tap('b');step(5);ok('...which begins at the Lantern',F.state()==='g4world'&&F.op()===0,F.op());
  F.meta().day=4;tap('start');for(let i=0;i<7;i++)tap('down');tap('a');step(3);ok('SAVE AND QUIT returns to the title',F.state()==='g4title',F.state());
  tap('a');step(2);tap('a');step(4);ok('CONTINUE loads that file back',F.state()==='g4world'&&F.meta().day===4&&F.op()===0,F.meta().day);
  const f1=JSON.parse(localStorage.getItem('sproutwild-v1'));ok('file 1 is untouched by playing file 2',f1.quest===5&&f1.day===9&&f1.res.wood===77,f1.day);
  tap('start');for(let i=0;i<7;i++)tap('down');tap('a');step(3);tap('a');step(2);tap('sel');step(2);tap('a');step(2);
  ok('SELECT erases a file after asking',localStorage.getItem('sproutwild-s2')===null);
  tap('up');tap('a');step(5);ok('file 1 continues where it was',F.state()==='g4world'&&F.meta().day===9&&F.meta().res.wood===77,F.meta().day);
  localStorage.setItem('sproutwild-s3','{"intro":1,"party":[{"sp":"NOPE","lv":3}],"box":"x","sector":"NOWHERE","quest":9,"buildings":[{"k":"castle"}],"res":null}');
  tap('start');for(let i=0;i<7;i++)tap('down');tap('a');step(3);tap('a');step(2);tap('down');tap('down');tap('a');step(8);G.draw();
  ok('a damaged save loads safely',F.state()==='g4world'&&F.meta().sector==='BASE'&&F.meta().party.length===0&&F.meta().buildings.length===0,F.state()+' '+F.meta().quest)}
 /* v7.0: starters and the Data Center */
 {const st=F.starters();ok('the three starters are the Ohio trio',st.join()==='CUYAPUP,BESSLING,GRASSKIN',st.join());
  const sp=F.species(),tb=JSON.stringify(sp.map(x=>x.id));ok('starters exist as species with two jobs each',st.every(id=>{const x=sp.find(q=>q.id===id);return x&&Object.keys(x.work).length===2&&x.starter}),tb.slice(-60));
  F.noCap(false);S.buildings=[];S.box=[];S.party=S.party.slice(0,1);ok('one buddy: room for more',!F.buddyFull());
  while(S.party.length+S.box.length<3)F.giveMon('PEBBLIT',3);ok('three buddies and no Data Center: full',F.buddyFull(),S.party.length+S.box.length);
  F.build('datacenter',6,12);ok('a Data Center makes room',!F.buddyFull());F.noCap(true)}
 /* v7.0: garden plots grow what you choose */
 {S.buildings=[];S.box=[];S.plotCrop={};F.build('cottage',18,12);F.enter('BASE');step(5);const pl=F.plots();
  ok('the garden bed building is retired',!F.builds().includes('bed')&&F.builds().includes('datacenter'),F.builds().join());
  const ix=pl.findIndex(q=>q.type<0);ok('there is an empty plot to plan',ix>=0,pl.map(q=>q.type).join());
  F.plotSet(ix,'berry');const b0=S.res.berry;ok('a plot can be set to berries',pl[ix].crop==='berry'&&S.plotCrop[ix]==='berry');
  F.dayT(20);F.setPos(60,460);for(let i=0;i<1500&&!pl[ix].ripe;i++)step(1);ok('berries ripen on the plot',pl[ix].ripe===true,Math.round(pl[ix].cg||0)+' type'+pl[ix].type+' seed'+pl[ix].seedTy+' crop'+pl[ix].crop+' same'+(F.plots()===pl)+' crew'+pl[ix].crew+' mode'+pl[ix].mode+' st'+F.state()+' q'+S.quest);
  F.giveMon('PEBBLIT',4,true);for(let i=0;i<1500&&S.res.berry<=b0;i++)step(1);ok('a home buddy harvests and the berries reach the Lantern',S.res.berry>b0,S.res.berry+' vs '+b0);
  ok('no sprout seed takes a crop plot',pl[ix].type<0&&pl[ix].seedTy==null);
  F.plotSet(ix,null);ok('the plot can go back to sprouts',!pl[ix].crop&&S.plotCrop[ix]===undefined)}
 }catch(e){out.push('FAIL crashed: '+e.message)}
 return out});
console.log(res.join('\n'));const fails=res.filter(l=>l.startsWith('FAIL')).length;
console.log(errs.length?'PAGE ERRORS: '+errs.slice(0,5).join(' | '):'no page errors');console.log(fails?fails+' FAILED':'ALL '+res.length+' PASS');await b.close();process.exit(fails||errs.length?1:0)})();
