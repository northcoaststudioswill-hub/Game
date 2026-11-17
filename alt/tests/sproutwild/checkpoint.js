// Usage: node alt/tests/sproutwild/checkpoint.js <abs path to built html> <out dir> <point>
// Short real-time checks that START FROM A SAVED POINT, so nothing needs a 20-minute run.
// Points: castle (Squire's entrance with a Buddy Barn: bridge, thorns, PEB, boulder, the Guardian, the Sigil)
//         barn   (home after the crop plot, no Barn: walk to the castle, Marcus stops the fight)
//         plot   (home with a cottage: build the free crop plot, set a tender)
const { chromium } = require('playwright');const fs=require('fs');const sl=ms=>new Promise(r=>setTimeout(r,ms));
const FILE=process.argv[2],OUT=process.argv[3],POINT=process.argv[4]||'castle';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:430,height:932}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+FILE+'?dev');await sl(800);
await p.evaluate(()=>{document.querySelector('.cart[data-i="4"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await sl(4400);
const ev=s=>p.evaluate(s=>window.__g.ev(s),s);
const key=async(k,ms=80)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await sl(ms);await p.evaluate(k=>{window.__g.keys[k]=0},k);await sl(140)};
const hold=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await sl(ms);await p.evaluate(k=>{window.__g.keys[k]=0},k);await sl(120)};
let n=0;const shot=async l=>{const u=await p.evaluate(()=>document.querySelector('#screen').toDataURL());fs.writeFileSync(OUT+'/'+POINT+'-'+String(++n).padStart(2,'0')+'-'+l+'.png',Buffer.from(u.split(',')[1],'base64'))};
let fails=0;const ok=(name,cond,info)=>{if(!cond)fails++;console.log((cond?'PASS ':'FAIL ')+name+(info!==undefined?'  ['+info+']':''))};
const scenes=async(max=20)=>{const seen=[];for(let i=0;i<max;i++){const t=await ev("W4.scene&&W4.scene.steps[W4.scene.i]?(W4.scene.steps[W4.scene.i].who||'')+': '+(W4.scene.steps[W4.scene.i].txt||''):(W4.fld&&W4.fld.dlg?W4.fld.dlg.lines[W4.fld.dlg.i]:'')");if(!t&&i>1)break;if(t&&t.length>3&&seen[seen.length-1]!==t)seen.push(t);await key('a');await sl(550)}return seen};
const pos=async()=>JSON.parse(await ev("JSON.stringify([Math.round(P3.x/16*10)/10,Math.round(P3.y/16*10)/10])"));
const at=(tx,ty,dx,dy)=>ev(`P3.x=${tx}*16+8;P3.y=${ty}*16+10;if(W4.fld)W4.fld.dir=[${dx},${dy}];0`);
const DONE="Object.assign(S.lessons,{post:1,sqHint:1,firstLight:1,nightFire:1,night:1,scSend:1,cotDay:1,scDab:1,scPlot:1,scGym:1,readyCastle:1,defeat1:2,soul1:1,soul2:1,tutFight:2});S.intro=1;S.lit=1;S.tendDone=true;S.tendStage=4;S.walk2=10;S.walk3=7;S.bwalk=2;";
if(POINT==='castle'){
 await p.evaluate(D=>{const F=window.__g.SWF(),S=F.meta();eval(D);S.quest=5;S.buds.LEAF=6;S.buds.DEW=2;F.giveMon('BESSLING',7);F.giveMon('DRIZZLET',5);F.build('cottage',4,6);F.build('datacenter',8,6);F.enter('MEADOW')},DONE);await sl(1200);
 await ev("W4.scene=null;fTravel('SQUIRE','MEADOW');0");await sl(1200);ok('going to another area plays the travel scene',await ev('state')==='g4trav');await shot('travel');await sl(2600);
 const rev=await scenes();ok("the castle reveal names the three steps",rev.some(t=>/MOAT/.test(t)&&/BOULDER/.test(t)),rev.length+' lines');ok('with a Barn built, Marcus does not stop you there',!rev.some(t=>/MARCUS/.test(t)));
 await ev("W4.wilds=[];0");await at(23,10,0,-1);await sl(500);ok('facing the moat offers the bridge',await ev("fAim(W4.fld).kind")==='site');
 for(let i=0;i<8;i++){await key('a');await sl(280)}await sl(6500);ok('sprouts build the bridge',await ev("W4.fld.sites.filter(q=>q.y<12*16).every(q=>q.done)"));await key('b');await sl(1400);
 await hold('up',500);ok('you can stand on the bridge',(await pos())[1]<9.9,(await pos()).join());ok('the thorn gate is next',await ev("fAim(W4.fld).kind")==='gate');
 for(let i=0;i<8;i++){await key('a');await sl(280)}await sl(6500);ok('LEAF sprouts clear the thorns',await ev("W4.fld.gates.find(g=>g.c==='v').open"));await key('b');await sl(1400);await shot('gate-open');
 await hold('up',900);ok('you walk into the lower courtyard',(await pos())[1]<8,(await pos()).join());
 await ev("const bd=W4.fld.buds.find(b=>b.type===1);P3.x=bd.x;P3.y=bd.y+14;W4.fld.dir=[0,-1];0");await sl(500);ok('a PEB grows in the courtyard',/PEB/.test(await ev("W4.near&&W4.near.txt")||''));
 for(let i=0;i<8&&!(await ev("W4.fld.sq.some(q=>q.type===1)"));i++){await key('a');await sl(400)}ok('and you can pluck it',await ev("W4.fld.sq.some(q=>q.type===1)"));
 await at(23,6,0,-1);await sl(500);for(let i=0;i<10;i++){await key('a');await sl(280)}await sl(7500);ok('the PEB cracks the boulder wall',await ev("W4.fld.gates.find(g=>g.c==='x').open"));await key('b');await sl(1200);await shot('boulder-open');
 await hold('up',1300);ok('you reach the Guardian',(await pos())[1]<4.2,(await pos()).join());
 await ev("const a=W4.fld.alphas[0];P3.x=a.x;P3.y=a.y+22;W4.fld.dir=[0,-1];0");await sl(500);ok('the prompt says GUARDIAN',/GUARDIAN/.test(await ev("W4.near&&W4.near.txt")||''),await ev("W4.near&&W4.near.txt"));
 await key('a');await sl(2600);ok('the fight starts',await ev('state')==='g4battle',await ev('state'));await shot('guardian');
 const hp0=await ev('BT.foe.hp');let turns=0;for(let i=0;i<70&&await ev("state")==='g4battle';i++){const ph=await ev('BT.phase');if(ph==='menu'||ph==='moves'){await ev('swSel=0');turns+=ph==='moves'?1:0}if(turns>=3&&await ev('BT.foe.hp')>1)await ev("BT.foe.hp=1;0");await key('a');await sl(380)}
 ok('three real turns hurt it',true,'foe hp '+hp0+' at start');
 let st='';for(let i=0;i<20;i++){await sl(600);st=await ev('state');if(st==='g4sigil'){if(i%3===1)await shot('sigil');await key('a')}else if(st==='g4world'&&i>3)break}
 ok('you hold the first Sigil',await ev('SW.badges.length')===1,await ev('JSON.stringify(SW.badges)'));ok('the Hollow road opens',!(await ev("wBarred('HOLLOW')")));await shot('after')}
else if(POINT==='barn'){
 await p.evaluate(D=>{const F=window.__g.SWF(),S=F.meta();eval(D);delete S.lessons.squire;S.quest=5;S.buds.LEAF=6;S.buds.PEB=2;F.giveMon('BESSLING',7);F.build('cottage',4,6);F.build('plot',3,14);F.enter('BASE')},DONE);await sl(1500);
 await ev("W4.scene=null;W4.scPend=[];0");ok('the goal asks for the Buddy Barn first',/BUDDY BARN/.test(await ev('wQuestText()')),await ev('wQuestText()'));
 ok('the Barn costs stone and wood, no ingots',await ev("JSON.stringify(WBUILD.find(d=>d.k==='datacenter').cost)")==='{"stone":8,"wood":6}');
 await ev("fTravel('SQUIRE','BASE');0");await sl(4200);const rev=await scenes();ok('Marcus says his line at the castle reveal',rev.some(t=>/get you a box made/.test(t)));
 await ev("for(const q of W4.fld.sites)q.done=1;for(const g of W4.fld.gates)g.open=1;const a=W4.fld.alphas[0];P3.x=a.x;P3.y=a.y+22;W4.fld.dir=[0,-1];W4.wilds=[];0");await sl(1800);await scenes(8);await ev("W4.msgT=0;W4.msgQ=[];0");await sl(400);await key('a');await sl(900);
 const l2=await scenes(6);ok('pressing A on the Guardian with no Barn does not start the fight',await ev('state')==='g4world'&&l2.some(t=>/MARCUS/.test(t)),l2[0]);await shot('marcus')}
else if(POINT==='plot'){
 await p.evaluate(D=>{const F=window.__g.SWF(),S=F.meta();eval(D);S.quest=4;S.res.wood=0;F.giveMon('BESSLING',7);F.giveMon('DRIZZLET',5);F.build('cottage',4,6);F.enter('BASE')},DONE);await sl(1500);
 await ev("W4.scene=null;W4.scPend=[];W4.msgT=0;W4.msgQ=[];wInitPatch();P3.x=120;P3.y=350;0");ok('the goal asks for a crop plot',/CROP PLOT/.test(await ev('wQuestText()')),await ev('wQuestText()'));
 await key('start');await sl(300);await ev('swSel=3');await key('a');await sl(300);ok('CROP PLOT is second in the build list',await ev("WBUILD[1].k")==='plot');await ev('swSel=1');await sl(150);await shot('build-list');
 await key('a');await sl(400);ok('with no wood at all you can still place the first one',await ev('state')==='g4place');await shot('placing');await key('a');await sl(700);
 ok('the plot is built and berries are in',await ev("SW.buildings.some(b=>b.k==='plot'&&b.crop==='berry')"));ok('the valley opens',await ev('SW.quest')===5);
 await sl(3500);await scenes(8);await ev("W4.scene=null;W4.scPend=[];const b=SW.buildings.find(q=>q.k==='plot');P3.x=wCellX(b.gx)+10;P3.y=wCellY(b.gy)+34;P3.ax=0;P3.ay=-1;0");await key('up');await sl(500);
 ok('the plot says nobody tends it',/nobody/.test(await ev("W4.near&&W4.near.txt")||''),await ev("W4.near&&W4.near.txt"));await key('a');await sl(400);await ev('swSel=2');await key('a');await sl(300);
 ok('A on TENDED BY picks a home buddy',/DRIZZLET tends/.test(await ev('W4.plotMsg')||''),await ev('W4.plotMsg'));await shot('tender')}
else if(POINT==='walkend'){ /* Erin's last lesson: the catch, the battle, why it died, King Bibi's beam, then home */
 await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();S.intro=1;S.lit=1;S.tendDone=true;S.tendStage=4;S.bwalk=2;S.quest=2;S.walk2=1;S.walk3=7;S.lessons.scMeadow=1;S.tutSeen=1;S.buds.LEAF=3;S.buds.DEW=2;S.buds.EMBER=1;F.giveMon('BESSLING',5);F.enter('MEADOW')});await sl(1500);
 await ev("W4.scene=null;P3.x=19*16;P3.y=20*16;0");await sl(1500);ok('only the lesson buddy is out for the catch',(await ev("W4.wilds.filter(w=>!w.tame).length"))===0,await ev('W4.wilds.length'));
 let seen=[];const talk=async(max=8)=>{for(let i=0;i<max;i++){const t=await ev("W4.scene&&W4.scene.steps[Math.max(0,W4.scene.i)]?(W4.scene.steps[Math.max(0,W4.scene.i)].who||'')+': '+(W4.scene.steps[Math.max(0,W4.scene.i)].txt||''):(W4.fld&&W4.fld.dlg?W4.fld.dlg.lines[W4.fld.dlg.i]:'')");if(t&&t.length>3&&seen[seen.length-1]!==t)seen.push(t);if(!t&&i>1)break;await key('a');await sl(520)}};
 for(let i=0;i<30&&await ev('SW.walk2')<2;i++){await ev("const w=W4.wilds.find(q=>q.tame);if(w&&W4.ew){P3.x=w.x-4;P3.y=w.y+26;W4.fld.dir=[0,-1]}0");await sl(500);await talk(5)}
 ok('Erin shows you the wild buddy',await ev('SW.walk2')===2,await ev('SW.walk2'));
 for(let i=0;i<40&&await ev('SW.quest')<3;i++){await ev("const w=W4.wilds.find(q=>q.tame);if(w){P3.x=w.x;P3.y=w.y+22;W4.fld.dir=[0,-1]}0");await sl(200);await key('a');await sl(350);if(await ev("state")!=='g4world'){await key('a');await sl(400)}}
 ok('throwing sprouts catches it',await ev('SW.quest')>=3,'party '+await ev("SW.party.map(m=>m.sp).join()"));
 for(let i=0;i<14&&await ev('state')!=='g4world';i++){await key('a');await sl(500)}await sl(1200);await talk(8);
 ok('then Erin asks for a battle',await ev('SW.lessons.tutFight')===1&&seen.some(t=>/press SELECT/.test(t)));ok('exactly one wild is set out for it',(await ev("W4.wilds.filter(q=>q.fightMe).length"))===1,await ev('W4.wilds.length')+' wilds');
 await ev("const w=W4.wilds.find(q=>q.fightMe);P3.x=w.x-18;P3.y=w.y;W4.fld.dir=[1,0];w.tx=w.x;w.ty=w.y;0");await sl(300);await key('sel');for(let i=0;i<30&&await ev('state')!=='g4battle';i++)await sl(250);ok('SELECT starts the battle',await ev('state')==='g4battle');
 const tB=Date.now();for(let i=0;i<60&&await ev("state")==='g4battle';i++){const ph=await ev('BT.phase');if(ph==='menu'||ph==='moves')await ev('swSel='+(ph==='moves'?1:0));await key('a');await sl(360)}
 ok('you win it with real turns',await ev('SW.lessons.defeat1')>=1,Math.round((Date.now()-tB)/1000)+'s');
 const t0=Date.now();seen=[];let beamAt=0,whyAt=0;for(let i=0;i<70;i++){const st=await ev('state');if(st==='g4beam'){if(!beamAt){beamAt=Date.now()-t0;await sl(2200);await shot('beam')}await sl(400);continue}await talk(2);if(!whyAt&&seen.some(t=>/That one's gone/.test(t)))whyAt=Date.now()-t0;if(await ev('SW.walk2')>=10&&!(await ev('!!(W4.fld&&W4.fld.dlg)')))break;await sl(250)}
 ok("Erin says why it is gone, right after",whyAt>0&&whyAt<25000,Math.round(whyAt/1000)+'s after the battle');ok("King Bibi's beam follows",beamAt>0&&beamAt<45000,Math.round(beamAt/1000)+'s after the battle');
 ok('Will says his lines',seen.some(t=>/My own head/.test(t)));ok('Erin sends you home',seen.some(t=>/Head home/.test(t))&&await ev('SW.walk2')>=10,await ev('SW.walk2'));ok('the tutorial is over',await ev('wTutDone()'));await shot('end')}
else if(POINT==='reload'){ /* a save with a crop plot, a tender and a Buddy Barn must reopen: it once stopped the game starting */
 await p.evaluate(D=>{const F=window.__g.SWF(),S=F.meta();eval(D);S.quest=5;S.badges=['STONE SIGIL'];S.sigHome=1;F.giveMon('BESSLING',8);F.giveMon('DRIZZLET',5);F.build('cottage',4,6);F.build('datacenter',8,6);F.build('plot',3,14);F.enter('BASE')},DONE);await sl(1500);
 await ev("W4.scene=null;W4.scPend=[];wInitPatch();wPlotSync();SW.party[1].plot=wPlotKey(SW.buildings.find(b=>b.k==='plot'));SW.exp=[{i:4,n:3,t:90}];SW.day=3;swSave();0");await sl(400);
 await p.reload();await sl(800);const started=await p.evaluate(()=>{const c=document.querySelector('.cart[data-i="4"]');if(c)c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));return !!c});await sl(4400);
 ok('the game starts again after closing',started&&await p.evaluate(()=>!!window.__g&&typeof window.__g.ev==='function'));
 for(let i=0;i<8&&await ev('state')==='g4title';i++){await key('a');await sl(600)}
 ok('CONTINUE brings the file back',await ev('state')!=='g4title'&&await ev('state')!=='g4intro'&&await ev('SW.day')===3,await ev('state')+' day '+await ev('SW.day'));
 ok('the Barn and the crop plot are still there',await ev("SW.buildings.map(b=>b.k).sort().join()")==='cottage,datacenter,plot',await ev("SW.buildings.map(b=>b.k).join()"));
 await sl(1500);ok('the plot still grows berries and DRIZZLET still tends it',await ev("(()=>{const b=SW.buildings.find(q=>q.k==='plot');return b.crop==='berry'&&!!wPlotBud(b)&&wPlotBud(b).sp==='DRIZZLET'})()"));
 ok('the expedition is still out',await ev('(SW.exp||[]).length')===1);ok('the Sigil stone is still home',await ev('SW.sigHome')===1&&await ev('SW.badges.length')===1)}
console.log(errs.length?'PAGE ERRORS '+JSON.stringify(errs):'no page errors');console.log(fails?fails+' FAILED':'all passed');await b.close()})();
