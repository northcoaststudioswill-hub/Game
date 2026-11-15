// first screens at phone size with a ~12% wider font than the dev machine, to catch text that only clips on a phone
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:664}});const p=await c.newPage();p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FILE'))console.log('CONSOLE',m.text().slice(0,300))});
await p.addInitScript(()=>{const d=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'font');Object.defineProperty(CanvasRenderingContext2D.prototype,'font',{set(v){d.set.call(this,String(v).replace(/(\d+)px/,(m,n)=>(+n*1.12)+'px'))},get(){return d.get.call(this)}})});
const out=process.argv[3];await p.goto('file://'+process.argv[2]);await p.waitForTimeout(600);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(4200);
const key=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms||70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(110)};
let n=0;const shot=async l=>{n++;await p.locator('#screen').screenshot({path:out+'/w'+String(n).padStart(2,'0')+'_'+l+'.png'})};
await shot('title');await key('a');await p.waitForTimeout(300);await shot('files');await key('a');
for(let i=0;i<6;i++){await p.waitForTimeout(700);if(i==0)await shot('story'+i);await key('a')}
await p.waitForTimeout(1500);await shot('wake');await p.waitForTimeout(3500);await shot('wake2');
await p.evaluate(()=>{const F=window.__g.SWF(),b=F.bf().buds[0];F.setPos(b.x,b.y+13)});await key('up',100);await key('a');await p.waitForTimeout(500);await shot('pluck');
await p.evaluate(()=>{const F=window.__g.SWF();for(const b of F.bf().buds.slice()){F.setPos(b.x,b.y+13)}});
await p.evaluate(()=>{const F=window.__g.SWF();F.setPos(F.louie().x+13,F.louie().y)});await key('left',100);await key('a');await p.waitForTimeout(400);await shot('louie_says');
await key('start');await p.waitForTimeout(300);await shot('pause');for(let i=0;i<7;i++)await key('down');await key('a');await p.waitForTimeout(500);await shot('saved_title');await key('a');await p.waitForTimeout(300);await shot('files_continue');
await key('sel');await p.waitForTimeout(300);await shot('erase_confirm');await key('b');await key('a');await p.waitForTimeout(800);await shot('continued');
await b.close()})();
