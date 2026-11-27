// screenshots of the field engine: node render-field.js <built html> <out dir>
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const out=process.argv[3];
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(1200);
await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();S.intro=1;S.quest=5;S.tendDone=true;S.tendStage=4;F.giveMon('CINDERCAP',9);for(const [t,n] of [['EMBER',4],['PEB',3],['DEW',3],['LEAF',3],['ZIP',2]])F.giveBud(t,n);S.badges=['A','B','C'];F.enter('MEADOW');F.fld().npcs.forEach(n=>{if(n.team)S.fl[n.fk]=1})});
const shot=async n=>{await p.waitForTimeout(350);await p.locator('#screen').screenshot({path:out+'/'+n+'.png'})};
const key=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(60)};
const at=async(x,y,d)=>p.evaluate(([x,y,d])=>{const F=window.__g.SWF();F.setPos(x,y);if(d)F.fld().dir=d},[x,y,d]);
await shot('f1_meadow_start');
await key('up',1500);await shot('f2_meadow_road');
await at(15*16+8,12*16+10,[-1,0]);await p.waitForTimeout(200);for(let i=0;i<6;i++){await key('b',60);await p.waitForTimeout(140)}await p.waitForTimeout(1500);await shot('f3_bridge_work');
await p.waitForTimeout(6000);await shot('f4_bridge_done');
await at(22*16+8,9*16+10,[0,-1]);await p.waitForTimeout(300);for(let i=0;i<4;i++){await key('b',60);await p.waitForTimeout(140)}await p.waitForTimeout(1200);await shot('f5_boulder');
await at(7*16,12*16+8,[1,0]);await key('b',60);await p.waitForTimeout(200);await key('b',60);await p.waitForTimeout(200);await key('b',60);await p.waitForTimeout(2500);await shot('f6_carry');
for(const id of ['TOWN','WASTES','SHORE','GLOOM','PEAK']){await p.evaluate(id=>window.__g.SWF().enter(id),id);await p.waitForTimeout(3300);await shot('s_'+id)}
await p.evaluate(()=>{const F=window.__g.SWF();F.enter('GLOOM');F.setPos(15*16+8,6*16)});await key('up',300);await key('a',80);await shot('f7_bibi');
const st=await p.evaluate(()=>{const F=window.__g.SWF(),f=F.fld();return{state:F.state(),sq:f.sq.length,items:f.items.length}});
console.log(st,errs.length?errs.slice(0,6):'no page errors');await b.close()})();
