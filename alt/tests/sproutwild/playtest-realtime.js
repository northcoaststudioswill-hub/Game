// playtest: fresh save, real time, phone-shaped screen, the new A-throws controls
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:430,height:932}});const p=await c.newPage();p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FILE'))console.log('CONSOLE',m.text().slice(0,300))});
const out=process.argv[3];await p.goto('file://'+process.argv[2]);await p.waitForTimeout(600);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="4"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(4300);
const key=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms||70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(110)};
let n=0;const t0=Date.now();const shot=async l=>{n++;await p.locator('#screen').screenshot({path:out+'/q'+String(n).padStart(2,'0')+'_'+l+'.png'});
 const st=await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta(),nr=F.near(),f=F.fld()||F.bf();return{op:F.op(),near:nr&&nr.txt,aim:f&&f.aimLab,quip:(window.__q=0,null),buds:Object.values(S.buds).reduce((a,b)=>a+b,0),res:S.res.berry+'b '+S.res.wood+'w',party:S.party.map(m=>m.sp)}});console.log(n,l,Math.round((Date.now()-t0)/1000)+'s',JSON.stringify(st))};
// walk toward a point with real key holds, the way a thumb would
const walk=async(x,y)=>{for(let i=0;i<60;i++){const q=await p.evaluate(()=>window.__g.SWF().pos());const dx=x-q.x,dy=y-q.y;if(Math.hypot(dx,dy)<7)return;await key(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'),Math.min(400,Math.max(60,Math.max(Math.abs(dx),Math.abs(dy))*11)))}};
await key('a');await p.waitForTimeout(300);await key('a');for(let i=0;i<3;i++){await p.waitForTimeout(900);await key('a')}
await p.waitForTimeout(2500);await shot('wake');await p.waitForTimeout(3500);await shot('wake2');
for(let i=0;i<3;i++){const b0=await p.evaluate(()=>{const b=window.__g.SWF().bf().buds[0];return b&&[b.x,b.y]});if(!b0)break;await walk(b0[0],b0[1]+14);await key('up',80);if(i===0)await shot('seed');await key('a');await p.waitForTimeout(500)}
await p.waitForTimeout(1200);await shot('three');
// go to the berries the way Louie points: just walk at them and press A when the pill says so
const it=await p.evaluate(()=>{const i=window.__g.SWF().bf().items.find(i=>i.op);return[i.x,i.y]});await walk(it[0]+50,it[1]+4);await key('left',90);await p.waitForTimeout(400);await shot('berries_aim');
await p.evaluate(()=>{window.__g.keys.a=1});await p.waitForTimeout(900);await p.evaluate(()=>{window.__g.keys.a=0});await p.waitForTimeout(700);await shot('berries_thrown');
await p.waitForTimeout(7000);await shot('carrying');
for(let i=0;i<6;i++){if(await p.evaluate(()=>!!window.__g.SWF().meta().lit))break;await p.waitForTimeout(2500)}await p.waitForTimeout(1500);await shot('lit');await p.waitForTimeout(3000);await shot('buddies_walk_in');
await walk(240,188);await key('up',80);await p.waitForTimeout(300);await shot('greet');await key('a');await p.waitForTimeout(400);await key('a');await p.waitForTimeout(1200);await shot('joined');await key('a');await p.waitForTimeout(2500);await shot('after_join');
await walk(240,300);await walk(240,440);await p.evaluate(()=>{window.__g.keys.down=1});await p.waitForTimeout(1800);await p.evaluate(()=>{window.__g.keys.down=0});await p.waitForTimeout(1500);await shot('meadow');
await key('up',1300);await p.waitForTimeout(400);await shot('meadow_road');
// a bush, then a tree by hand, then swap in a LUMBER buddy, then a wild
let o=await p.evaluate(()=>{const F=window.__g.SWF(),n=F.nodes().filter(n=>n.k==='bush').sort((a,b)=>Math.hypot(a.x-F.pos().x,a.y-F.pos().y)-Math.hypot(b.x-F.pos().x,b.y-F.pos().y))[0];return[n.x,n.y]});
await p.evaluate(([x,y])=>window.__g.SWF().setPos(x+4,y+38),o);await key('up',60);await p.waitForTimeout(500);await shot('bush_aim');
await p.evaluate(()=>{window.__g.keys.a=1});await p.waitForTimeout(800);await p.evaluate(()=>{window.__g.keys.a=0});await p.waitForTimeout(3000);await shot('bush_work');await p.waitForTimeout(9000);await shot('berries_home');
o=await p.evaluate(()=>{const F=window.__g.SWF(),n=F.nodes().filter(n=>n.k==='tree'&&!n.got).sort((a,b)=>Math.hypot(a.x-F.pos().x,a.y-F.pos().y)-Math.hypot(b.x-F.pos().x,b.y-F.pos().y))[0];return[n.x,n.y]});
await p.evaluate(([x,y])=>window.__g.SWF().setPos(x,y+17),o);await key('up',60);await p.waitForTimeout(300);await shot('tree_prompt');
await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();F.giveMon('FERNFANG',6);S.party.unshift(S.party.pop())});await p.waitForTimeout(400);await shot('tree_buddy_prompt');await key('a');await p.waitForTimeout(1500);await shot('buddy_chopping');await p.waitForTimeout(2500);await shot('timber');
await key('down',250);await key('up',60);await p.waitForTimeout(400);await shot('log_aim');await p.evaluate(()=>{window.__g.keys.a=1});await p.waitForTimeout(700);await p.evaluate(()=>{window.__g.keys.a=0});await p.waitForTimeout(2500);await shot('log_carried');
o=await p.evaluate(()=>{const F=window.__g.SWF(),w=F.wilds()[0];return[w.x,w.y]});await p.evaluate(([x,y])=>window.__g.SWF().setPos(x-6,y+50),o);await key('up',60);await p.waitForTimeout(400);await shot('wild_aim');
await b.close()})();
