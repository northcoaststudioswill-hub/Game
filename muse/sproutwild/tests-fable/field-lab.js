// Field engine checks (Fable v5.1): node field-lab.js <built html>
// Drives the real page in headless Chromium, stepping the game's own update() so results do not depend on frame timing.
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(900);
const res=await p.evaluate(()=>{const G=window.__g,F=G.SWF(),S=F.meta(),out=[];
 const ok=(n,c,x)=>out.push((c?'PASS ':'FAIL ')+n+(x!==undefined?'  ['+x+']':''));
 const step=(n,keys)=>{for(let i=0;i<n;i++){for(const k in G.keys)G.keys[k]=0;if(keys)for(const k of keys)G.keys[k]=1;G.update(1/30);for(const k in G.keys)G.prev[k]=G.keys[k]}for(const k in G.keys)G.keys[k]=0;G.update(1/30);for(const k in G.keys)G.prev[k]=0};
 const tap=k=>{step(1,[k]);step(1)};
 const T=16,at=(tx,ty,d)=>{F.setPos(tx*T+8,ty*T+10);const f2=F.fld();if(d)f2.dir=d;for(const s of f2.sq)if(s.st==='follow'){s.x=F.pos().x;s.y=F.pos().y+6}};
 const fight=()=>{for(let n=0;n<300&&F.state()==='g4battle';n++){const bt=F.bt();if(bt.foe)bt.foe.hp=Math.min(bt.foe.hp,1);S.party[0].hp=200;if(bt.phase==='moves')tap(['right','down','left','up'][n%4]);tap('a');step(3)}};
 try{
 S.intro=1;S.quest=5;S.tendDone=true;S.tendStage=4;S.fl={};S.badges=[];S.buds={EMBER:4,PEB:0,DEW:3,ZIP:0,LEAF:3,LUCKY:0};S.res={wood:0,stone:0,petal:0,berry:0,ingot:0};
 F.giveMon('CINDERCAP',30);F.enter('MEADOW');let f=F.fld();
 ok('meadow is a field map',!!f&&f.w===36&&f.h===25,f&&f.w+'x'+f.h);
 step(3);ok('the pouch walks with you as a squad',f.sq.length===10,f.sq.length);
 f.npcs.forEach(n=>{if(n.team)S.fl[n.fk]=1});
 /* throw + whistle */
 at(17,20,[0,-1]);step(20);tap('b');step(4);ok('B throws a sprout',f.sq.some(s=>s.st==='fly'||s.st==='idle'),f.sq.map(s=>s.st).join(','));
 step(30);ok('a thrown sprout waits where it lands',f.sq.filter(s=>s.st==='idle'||s.st==='ret').length>=1);
 at(17,14,[0,-1]);step(2);const before=f.sq.filter(s=>s.st==='follow').length;
 at(17,19,[0,-1]);step(40,['b']);step(40);ok('holding B whistles them back',f.sq.every(s=>s.st==='follow'),f.sq.map(s=>s.st).join(','));
 /* bridge */
 at(15,12,[-1,0]);step(15);for(let i=0;i<6;i++){tap('b');step(5)}
 ok('sprouts take the bridge job',f.sq.filter(s=>s.st==='work').length>=4,f.sq.filter(s=>s.st==='work').length);
 step(600);const site=f.sites[0];ok('the bridge gets built',site.done&&f.t[12][10]==='=',site.hp);
 /* carry the island treasure home (weight 3) */
 step(40,['b']);step(20);at(10,12,[-1,0]);step(15);
 const tre=f.items.find(i=>i.n==='ACORN CROWN');tap('b');step(20);
 ok('one sprout cannot lift weight 3',tre&&tre.car.length===1&&Math.abs(tre.x-(7*T+8))<1,tre&&tre.car.length);
 tap('b');step(6);tap('b');step(900);
 ok('three sprouts carry it to the beacon',S.fl[tre.fk]===1&&S.res.petal>=40,S.res.petal);
 ok('carriers come back after delivery',f.sq.every(s=>s.st!=='carry'));
 /* type gate */
 step(40,['b']);step(30);at(22,9,[0,-1]);step(15);tap('b');step(30);const gate=f.gates[0];
 ok('wrong kind bounces off the boulder wall',!gate.open&&gate.hp===gate.max,gate.hp);
 at(5,4,[0,-1]);step(4);const bud=f.buds.find(q=>q.type===1);F.setPos(bud.x,bud.y+12);f.dir=[0,-1];step(3);tap('a');step(3);
 ok('plucking a buried PEB sprout adds it to the squad',S.buds.PEB===1&&f.sq.some(s=>s.type===1),S.buds.PEB);
 at(22,9,[0,-1]);step(40,['b']);step(30);at(22,9,[0,-1]);step(10);tap('b');step(500);
 ok('a PEB sprout cracks the boulder wall',gate.open,gate.hp);
 at(22,9,[0,-1]);step(60,['up']);ok('the keeper can walk through the opened gate',F.pos().y<8*T+6,Math.round(F.pos().y));
 /* ledge */
 at(28,7,[0,1]);step(30,['down']);ok('ledges hop down',F.pos().y>9*T,Math.round(F.pos().y));
 at(28,9,[0,-1]);step(30,['up']);ok('ledges do not climb',F.pos().y>8*T+8,Math.round(F.pos().y));
 /* node -> pellet -> home */
 step(40,['b']);step(40);const w0=S.res.wood;const nd=F.nodes().find(n=>n.k==='tree'&&!n.got);F.setPos(nd.x+2,nd.y+22);f.dir=[0,-1];step(15);for(let i=0;i<5;i++){tap('b');step(5)}step(1500);
 ok('sprouts fell a tree and haul the log home',nd.got&&S.res.wood>w0,S.res.wood);
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
 ok('beating king bibi sets the flag',S.fl.bibi===1,F.state());
 F.enter('WASTES');at(20,3,[0,-1]);for(let i=0;i<80&&F.fld().id==='WASTES';i++)step(1,['up']);ok('the dome is down: the peak road is open',F.fld().id==='PEAK',F.fld().id);
 /* every sector builds and draws */
 for(const id of ['MEADOW','TOWN','WASTES','SHORE','GLOOM','PEAK']){F.enter(id);step(5);G.draw()}
 ok('all six sectors build, update and draw',true);
 /* Sunkeep: same squad, same orders, loot goes to the Lantern */
 S.bottieSeen=1;S.bottieBeat=1;F.enter('BASE');step(5);G.draw();const bf=F.bf();ok('sunkeep has the squad too',!F.fld()&&!!bf&&bf.sq.length>0,bf&&bf.sq.length);
 {const nd=F.nodes().find(n=>n.k==='tree'),w1=S.res.wood;F.setPos(nd.x,nd.y+26);step(2,['up']);for(const q of bf.sq){q.x=F.pos().x;q.y=F.pos().y+8;q.st='follow'}step(10);
  for(let i=0;i<5;i++){tap('b');step(5)}ok('B throws at home',bf.sq.filter(q=>q.st==='work'||q.st==='fly').length>=3,bf.sq.map(q=>q.st).join(','));
  step(1800);G.draw();ok('sprouts fell a Sunkeep tree and carry the log to the Lantern',nd.got&&S.res.wood>w1,S.res.wood-w1);
  step(40,['b']);step(60);ok('whistle works at home',bf.sq.every(q=>q.st==='follow'),bf.sq.map(q=>q.st).join(','))}
 /* Palworld-style work: buddies at home pick jobs by skill, goods are carried to the Lantern */
 {S.box=[];S.party=S.party.slice(0,1);S.craftQ=[];S.buildings=[];S.crew=[];F.build('kiln',4,8);F.build('bench',8,8);F.build('quarry',14,8);
  const fire=F.giveMon('CINDERCAP',5,true),rock=F.giveMon('PEBBLIT',5,true),zip=F.giveMon('ZIPWIG',5,true);step(3);const wk=F.wk();
  ok('box buddies become base workers',wk.length===3,wk.length);
  ok('species bring their own work skills',F.wkSkills(wk[0]).KINDLING>=1&&F.wkSkills(wk[1]).QUARRY>=1&&F.wkSkills(wk[2]).HANDIWORK>=1,JSON.stringify(wk.map(w=>F.wkSkills(w))));
  F.dayT(20);F.setPos(60,460);const i0=S.res.ingot,s0=S.res.stone;step(240);
  const kiln=S.buildings[0],quarry=S.buildings[2];
  ok('the fire buddy picks the kiln, the rock buddy the quarry',wk[0].task&&wk[0].task.b===kiln&&wk[1].task&&wk[1].task.b===quarry,(wk[0].task&&wk[0].task.k)+','+(wk[1].task&&wk[1].task.k));
  step(2400);G.draw();ok('buildings make goods and workers haul them to the Lantern',S.res.ingot>i0&&S.res.stone>s0,(S.res.ingot-i0)+' ingot, '+(S.res.stone-s0)+' stone');
  S.res.berry=9;const t0=S.tonics;S.craftQ.push({id:'tonic',need:12,done:0});step(1500);
  ok('the CRAFT buddy builds the bench queue',S.tonics===t0+1&&S.craftQ.length===0,S.tonics-t0);
  S.box=[];step(3);S.craftQ.push({id:'tonic',need:12,done:0});F.setPos(10+8*20+10,38+8*20+24);step(500);
  ok('with no crafter you can build it by hand at the bench',S.craftQ.length===0,S.craftQ.length&&S.craftQ[0].done);
  S.box=[fire];step(3);F.dayT(250);step(200);ok('workers sleep at night',F.wk()[0].task&&F.wk()[0].task.k==='sleep',F.wk()[0].task&&F.wk()[0].task.k);F.dayT(20)}
 }catch(e){out.push('FAIL crashed: '+e.message)}
 return out});
console.log(res.join('\n'));const fails=res.filter(l=>l.startsWith('FAIL')).length;
console.log(errs.length?'PAGE ERRORS: '+errs.slice(0,5).join(' | '):'no page errors');console.log(fails?fails+' FAILED':'ALL '+res.length+' PASS');await b.close();process.exit(fails||errs.length?1:0)})();
