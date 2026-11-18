// the first minutes at an iPhone-shaped screen, real time, real key timing
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:430,height:932}});const p=await c.newPage();p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FILE'))console.log('CONSOLE',m.text().slice(0,300))});
const out=process.argv[3];await p.goto('file://'+process.argv[2]);await p.waitForTimeout(600);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="4"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(4300);
const key=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms||70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(110)};
let n=0;const shot=async l=>{n++;await p.locator('#screen').screenshot({path:out+'/p'+String(n).padStart(2,'0')+'_'+l+'.png'})};
console.log('H',await p.evaluate(()=>document.querySelector('canvas').height/2));
await shot('title');await key('a');await p.waitForTimeout(300);await shot('files');await key('a');
for(let i=0;i<3;i++){await p.waitForTimeout(2600);await shot('story'+i);await key('a')}
await p.waitForTimeout(1700);await shot('wake_erin');await p.waitForTimeout(2600);await shot('wake_louie');await p.waitForTimeout(2400);await shot('wake_marcus');
await p.evaluate(()=>{const F=window.__g.SWF(),b=F.bf().buds[0];F.setPos(b.x,b.y+13)});await key('up',100);await shot('pluck_prompt');await key('a');await p.waitForTimeout(900);await shot('first_sprout');
for(let i=0;i<2;i++){await p.evaluate(()=>{const F=window.__g.SWF(),b=F.bf().buds[0];F.setPos(b.x,b.y+13)});await key('up',100);await key('a');await p.waitForTimeout(300)}
await p.waitForTimeout(900);await shot('three_marcus');
await p.evaluate(()=>{const F=window.__g.SWF(),it=F.bf().items.find(i=>i.op);F.setPos(it.x+42,it.y+2)});await key('left',120);await p.waitForTimeout(3200);await shot('aim_erin');
for(let i=0;i<3;i++){await key('b',60);await p.waitForTimeout(350)}await p.waitForTimeout(1800);await shot('carrying');
await p.waitForTimeout(9000);await shot('lit');await p.waitForTimeout(3500);await shot('lit2');
await p.evaluate(()=>{const F=window.__g.SWF();F.setPos(F.louie().x+13,F.louie().y)});await key('left',100);await key('a');await p.waitForTimeout(500);await shot('louie_bubble');
await key('start');await p.waitForTimeout(300);await shot('pause');await key('b');
await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();S.quest=5;S.tutSeen=1;F.giveMon('DRIZZLET',6);F.giveBud('LEAF',3);F.enter('MEADOW');F.forceWild('FERNFANG',5)});await p.waitForTimeout(900);await shot('battle_intro');
for(let i=0;i<3;i++){await key('a');await p.waitForTimeout(350)}await shot('battle_menu');await key('a');await p.waitForTimeout(300);await shot('battle_moves');
await b.close()})();
