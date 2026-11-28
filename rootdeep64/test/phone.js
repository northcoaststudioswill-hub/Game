/* Phone check: iPhone-sized touch viewports, portrait and landscape. usage: node test/phone.js */
const {chromium}=require('playwright');const path=require('path');
(async()=>{const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const out=path.join(__dirname,'shots');require('fs').mkdirSync(out,{recursive:true});const errs=[];
 for(const[name,w,h]of[['portrait',430,932],['landscape',932,430]]){
  const cx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true,isMobile:true});const pg=await cx.newPage();
  pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(500);
  await pg.screenshot({path:path.join(out,'phone-'+name+'-title.png')});
  await pg.tap('.tb[data-b=a]');await pg.waitForTimeout(200);await pg.tap('.tb[data-b=start]');await pg.waitForTimeout(300);
  let s=await pg.evaluate(()=>__rd.RDF.state());console.log(name,'after A + START:',s.state,'device',s.players[0]&&s.players[0].dev);
  await pg.evaluate(()=>{rdStartRun();state='run'});await pg.waitForTimeout(900);await pg.screenshot({path:path.join(out,'phone-'+name+'-run.png')});
  await pg.evaluate(()=>{__rd.RDF.forceBoon('DEW')});await pg.waitForTimeout(300);await pg.screenshot({path:path.join(out,'phone-'+name+'-boon.png')});await cx.close()}
 console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');await br.close()})();
