const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(1200);
const st=await p.evaluate(()=>{const F=window.__g.SWF();F.giveMon('CINDERCAP',6);F.giveMon('PEBBLIT',5);F.enter('MEADOW');F.forceWild('FERNFANG',5);return F.state()});
await p.waitForTimeout(2600);await p.locator('#screen').screenshot({path:process.argv[3]+'/battle1.png'});
for(let i=0;i<3;i++){await p.keyboard.press('z').catch(()=>{});await p.evaluate(()=>{const e=document.querySelector('#bA');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}));setTimeout(()=>e.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1})),90)});await p.waitForTimeout(700)}
await p.locator('#screen').screenshot({path:process.argv[3]+'/battle2.png'});
await p.evaluate(()=>{const F=window.__g.SWF();F.enter('MEADOW')});await p.waitForTimeout(900);await p.locator('#screen').screenshot({path:process.argv[3]+'/meadow.png'});
console.log(st,errs.length?errs.slice(0,3):'no page errors');await b.close()})();
