// makes saves with older builds (as a real player would have), then boots the current build with each and reports errors
const { chromium } = require('playwright');const fs=require('fs');
const NEW=process.argv[2];
async function boot(p,file){await p.goto('file://'+file);await p.waitForTimeout(600);await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(2600)}
const key=async(p,k,ms)=>{await p.evaluate(k=>{window.__g.keys[k]=1},k);await p.waitForTimeout(ms||70);await p.evaluate(k=>{window.__g.keys[k]=0},k);await p.waitForTimeout(100)};
(async()=>{const b=await chromium.launch();const saves={};
 const mk=async(name,file,fn)=>{const c=await b.newContext({viewport:{width:390,height:664}});const p=await c.newPage();await boot(p,file);for(let i=0;i<9;i++){await key(p,'a');await p.waitForTimeout(150)}await p.waitForTimeout(500);if(fn)await p.evaluate(fn);await p.waitForTimeout(600);saves[name]=await p.evaluate(()=>localStorage.getItem('sproutwild-v1'));await c.close()};
 await mk('v50_just_started',__dirname+'/old/v50.html',null);
 await mk('v50_midgame_meadow',__dirname+'/old/v50.html',()=>{const F=window.__g.SWF(),S=F.meta();S.quest=5;S.tendDone=true;S.tendStage=4;F.giveMon('CINDERCAP',8);F.giveMon('PEBBLIT',6,true);F.build('cottage',4,6);F.build('bed',8,8);S.followers=[0,4];S.crew.push({type:2,dlv:3,wxp:4,job:1});F.giveBud('EMBER',2);F.enter('MEADOW')});
 await mk('v51_town',__dirname+'/old/v51.html',()=>{const F=window.__g.SWF(),S=F.meta();S.quest=5;S.tendDone=true;S.tendStage=4;F.giveMon('DRIZZLET',9);F.giveBud('DEW',3);F.enter('TOWN')});
 await mk('v54_base_work',__dirname+'/old/v54.html',()=>{const F=window.__g.SWF(),S=F.meta();S.quest=5;S.tendDone=true;S.tendStage=4;F.giveMon('DRIZZLET',9);F.giveMon('ZIPWIG',5,true);F.build('bench',8,8);S.craftQ=[{id:'tonic',need:12,done:3}];F.enter('BASE')});
 await mk('v54_mid_tutorial',__dirname+'/old/v54.html',()=>{const F=window.__g.SWF(),S=F.meta();S.quest=1;S.tendStage=2;F.enter('BASE')});
 saves.none=null;saves.garbage='{"party":[{"sp":"NOPE","lv":3,"hp":5}],"sector":"HOLLOW","quest":7}';
 for(const name in saves){const c=await b.newContext({viewport:{width:390,height:664}});const p=await c.newPage();const errs=new Set();p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FILE'))errs.add(m.text().slice(0,260))});p.on('pageerror',e=>errs.add('PAGE '+e.message));
  await p.addInitScript(s=>{if(s!=null)localStorage.setItem('sproutwild-v1',s)},saves[name]);await boot(p,NEW);
  await p.locator('#screen').screenshot({path:__dirname+'/old/'+name+'_1title.png'});
  for(let i=0;i<4;i++){await key(p,'a');await p.waitForTimeout(350)}await p.waitForTimeout(900);await p.locator('#screen').screenshot({path:__dirname+'/old/'+name+'_2after.png'});
  for(const k of ['up','left','down','right','b','start','down','a','b','b','sel','a']){await key(p,k,160);await p.waitForTimeout(120)}
  const st=await p.evaluate(()=>{const F=window.__g.SWF();return F.state()+' '+F.meta().sector+' H='+document.querySelector('#screen canvas, canvas').height/2});
  console.log(name.padEnd(22),st,errs.size?[...errs].join(' || '):'no errors');await c.close()}
 await b.close()})();
