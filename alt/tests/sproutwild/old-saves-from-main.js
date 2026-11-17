const { chromium } = require('playwright');const sl=ms=>new Promise(r=>setTimeout(r,ms));const fs=require('fs');
// Usage: node alt/tests/sproutwild/old-saves-from-main.js   (run from the repo root; needs the `main` branch locally)
// Builds three saves with main's copy of the game, then continues each one in the working build and reports errors.
const path=require('path'),os=require('os'),cp=require('child_process');
const OLD=path.join(os.tmpdir(),'pocket-lantern-main.html');fs.writeFileSync(OLD,cp.execSync('git show main:alt/games/pocket-lantern-alt.html',{maxBuffer:1<<28}));
const NEW=process.argv[2]||path.resolve(__dirname,'../../games/pocket-lantern-alt.html');
const boot=async(p,f)=>{await p.goto('file://'+f+'?dev');await sl(700);await p.evaluate(()=>{document.querySelector('.cart[data-i="4"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await sl(3200)};
const key=async(p,k)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await sl(70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await sl(150)};
const SETS={
 mid_tutorial:"S.intro=1;S.lit=1;S.tendDone=true;S.tendStage=4;S.bwalk=2;S.quest=3;S.walk2=4;S.buds.LEAF=4;F.giveMon('BESSLING',5);F.giveMon('PEBBLIT',2);F.enter('MEADOW')",
 home_with_crops:"S.intro=1;S.lit=1;S.tendDone=true;S.tendStage=4;S.bwalk=2;S.walk2=10;S.walk3=7;S.quest=5;S.res.wood=9;S.plotCrop={0:'berry',3:'fiber'};F.giveMon('BESSLING',7);F.giveMon('DRIZZLET',5);F.build('cottage',4,6);F.build('kiln',11,13);F.enter('BASE')",
 one_sigil:"S.intro=1;S.lit=1;S.tendDone=true;S.tendStage=4;S.bwalk=2;S.walk2=10;S.walk3=7;S.quest=5;S.badges=['STONE SIGIL'];S.shown=6;F.giveMon('BESSLING',9);F.giveMon('FERNFANG',6);F.giveMon('PEBBLIT',5);F.build('cottage',4,6);F.build('datacenter',8,6);F.enter('BASE')"};
(async()=>{const b=await chromium.launch();let bad=0;
for(const [name,set] of Object.entries(SETS)){
 const c1=await b.newContext({viewport:{width:430,height:932}});const p1=await c1.newPage();await boot(p1,OLD);for(let i=0;i<4;i++){await key(p1,'a');await sl(200)}
 await p1.evaluate(set=>{const F=window.__g.SWF(),S=F.meta();eval(set)},set).catch(e=>console.log('set failed',name,e.message.slice(0,120)));await sl(1500);
 const json=await p1.evaluate(()=>window.__g.ev('JSON.stringify(SW)'));await c1.close();
 const c2=await b.newContext({viewport:{width:430,height:932}});const p2=await c2.newPage();const errs=[];p2.on('pageerror',e=>errs.push((e.stack||e.message).split('\n').slice(0,6).join(' | ').slice(0,700)));
 await boot(p2,NEW);await p2.evaluate(j=>{window.__j=j;return window.__g.ev('localStorage.setItem((WSLOTS&&WSLOTS[0])||"sproutwild-v1",window.__j);wSlot=0;0')},json);await p2.reload();await sl(500);await boot(p2,NEW);
 if(!(await p2.evaluate(()=>!!window.__g))){console.log('FAIL '+name+'  the game did not start. ERR '+JSON.stringify(errs.slice(0,3)));bad++;await c2.close();continue}for(let i=0;i<10;i++){const st=await p2.evaluate(()=>window.__g.ev('state'));if(st==='g4world'||st==='g4intro')break;await key(p2,'a');await sl(600)}
 await sl(2500);for(let i=0;i<10;i++){if(!(await p2.evaluate(()=>window.__g.ev('!!W4.scene||!!(W4.fld&&W4.fld.dlg)'))))break;await key(p2,'a');await sl(500)}
 for(const k of ['up','left','down','right']){await p2.evaluate(k=>{window.__g.keys[k]=1},k);await sl(500);await p2.evaluate(k=>{window.__g.keys[k]=0},k)}
 const info=await p2.evaluate(()=>window.__g.ev("JSON.stringify({state,sec:W4.sector,q:SW.quest,w2:SW.walk2,party:SW.party.map(m=>m.sp+m.lv),goal:wQuestText(),plots:(W4.patchBuds||[]).length,crops:plCrops(),plotCropLeft:Object.keys(SW.plotCrop||{}).length,bld:SW.buildings.map(b=>b.k),sigHome:SW.sigHome,keys:Object.keys(localStorage).length})"));
 console.log((errs.length?'FAIL ':'PASS ')+name+'  '+info+(errs.length?'  ERR '+JSON.stringify(errs.slice(0,2)):''));bad+=errs.length?1:0;await c2.close()}
console.log(bad?bad+' saves broke':'all old saves load');await b.close()})();
