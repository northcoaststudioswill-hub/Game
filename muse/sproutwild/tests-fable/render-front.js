// screenshots of the opening hour: node render-front.js <built html> <out dir>
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const out=process.argv[3];await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(1500);
const shot=async n=>{await p.locator('#screen').screenshot({path:out+'/'+n+'.png'})};
const key=async(k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms||70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(80)};
await shot('t0_title');await key('a');
await p.waitForTimeout(600);await shot('t0_title');await key('a');
for(let i=0;i<6;i++){await p.waitForTimeout(3000);await shot('t'+(i+1)+'_story');await key('a')}
await p.waitForTimeout(900);await shot('u1_base');
await key('up',900);await shot('u2_base_lantern');
await p.evaluate(()=>{const F=window.__g.SWF();F.setPos(240,372)});await key('down',200);await shot('u3_patch');
await key('start');await p.waitForTimeout(200);await shot('u4_menu');await key('b');
await p.evaluate(()=>{const F=window.__g.SWF(),S=F.meta();S.quest=5;S.tendDone=true;S.tendStage=4;F.giveMon('DRIZZLET',5);F.build('cottage',4,6);F.build('bed',16,8);F.give('wood',20);for(const [t,n] of [['EMBER',3],['DEW',2],['LEAF',2]])F.giveBud(t,n);F.enter('BASE');F.setPos(150,200)});
await p.waitForTimeout(600);await shot('u5_base_built');
await key('start');await key('down');await key('down');await key('a');await p.waitForTimeout(200);await shot('u6_build_menu');await key('b');await key('b');
await p.evaluate(()=>{const F=window.__g.SWF();F.setPos(96,128)});await key('left',120);await key('a');await p.waitForTimeout(250);await shot('u7_talk');await key('b');
await p.evaluate(()=>{const S=window.__g.SWF().meta();S.badges=['VERDANT SIGIL'];S.bottieSeen=0});await p.waitForTimeout(4200);await shot('u8_bottie');
console.log(errs.length?errs.slice(0,6):'no page errors');await b.close()})();
