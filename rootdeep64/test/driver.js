/* Play driver for reviewers: opens the real build and takes input commands over HTTP.
   Game time only moves while a command runs (frame-stepped at 60 fps), so thinking between
   moves costs nothing. It exposes NO game state: you see only what a player sees.

   start:  node test/driver.js --port 9101 [--w 960 --h 540] [--mobile] [--out DIR]
   send:   curl -s localhost:9101 -d '{"cmd":"tap","key":"KeyZ"}'

   commands (POST a JSON object, or {"cmd":"seq","steps":[...]} to run several in order):
     {"cmd":"down","key":"KeyD"}            {"cmd":"up","key":"KeyD"}
     {"cmd":"tap","key":"KeyZ","ms":50}      press, hold ms, release
     {"cmd":"hold","keys":["KeyD","KeyW"],"ms":400}
     {"cmd":"wait","ms":500}                 let the game run with nothing pressed (beyond what is held)
     {"cmd":"shot","name":"x"}               saves OUT/x.png, returns its path
     {"cmd":"pad","i":0,"axes":[1,0],"buttons":[0]}   virtual controller i (0-3): stick + pressed button indices
          buttons: 0 A, 1 B, 2 X, 3 Y, 4/5/6/7 shoulders+triggers, 8 Select, 9 Start, 12-15 d-pad U/D/L/R
     {"cmd":"touch","type":"touchStart|touchMove|touchEnd","points":[{"x":100,"y":400,"id":1}]}
     {"cmd":"tapAt","x":800,"y":450}         a quick touch at a screen point (for on-screen buttons)
     {"cmd":"log"}                           console errors so far
     {"cmd":"reload"}                        reload the page (save data is kept)
     {"cmd":"quit"} */
const {chromium}=require('playwright');const http=require('http');const path=require('path');const fs=require('fs');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i<0?d:(process.argv[i+1]===undefined||process.argv[i+1].startsWith('--')?true:process.argv[i+1])};
const PORT=+arg('port',9101),VW=+arg('w',960),VH=+arg('h',540),MOBILE=!!arg('mobile',false),OUT=arg('out',path.join(__dirname,'shots','play-'+PORT));
fs.mkdirSync(OUT,{recursive:true});
(async()=>{const br=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const cx=await br.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:1,hasTouch:MOBILE,isMobile:MOBILE});const pg=await cx.newPage();
 await pg.addInitScript(()=>{let q=[],t=0;window.requestAnimationFrame=cb=>{q.push(cb);return q.length};
  window.__advance=n=>{for(let i=0;i<n;i++){const c=q;q=[];t+=1000/60;for(const f of c)f(t)}};
  const pads=[0,1,2,3].map(i=>null);window.__vpad=(i,axes,buttons)=>{pads[i]={id:'virtual pad '+i,index:i,connected:true,mapping:'standard',axes:[axes[0]||0,axes[1]||0,0,0],buttons:Array.from({length:17},(_,b)=>({pressed:buttons.includes(b),value:buttons.includes(b)?1:0}))}};
  navigator.getGamepads=()=>pads});
 const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 const url='file://'+path.join(__dirname,'..','index.html');await pg.goto(url);await pg.evaluate(()=>__advance(2));
 const cdp=await cx.newCDPSession(pg);
 const step=ms=>pg.evaluate(n=>__advance(n),Math.max(1,Math.round(ms/(1000/60))));
 async function run(c){switch(c.cmd){
  case 'down':await pg.keyboard.down(c.key);await step(17);return'ok';
  case 'up':await pg.keyboard.up(c.key);await step(17);return'ok';
  case 'tap':await pg.keyboard.down(c.key);await step(c.ms||50);await pg.keyboard.up(c.key);await step(34);return'ok';
  case 'hold':for(const k of c.keys)await pg.keyboard.down(k);await step(c.ms||300);for(const k of c.keys)await pg.keyboard.up(k);await step(17);return'ok';
  case 'wait':await step(c.ms||300);return'ok';
  case 'shot':{const f=path.join(OUT,(c.name||('s'+Date.now()))+'.png');await pg.screenshot({path:f});return f}
  case 'pad':await pg.evaluate(a=>__vpad(a.i,a.axes||[0,0],a.buttons||[]),c);await step(c.ms||17);return'ok';
  case 'touch':await cdp.send('Input.dispatchTouchEvent',{type:c.type,touchPoints:(c.points||[]).map(p=>({x:p.x,y:p.y,id:p.id||1}))});await step(17);return'ok';
  case 'tapAt':await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x,y:c.y,id:9}]});await step(50);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await step(34);return'ok';
  case 'log':return errs.slice(-30);
  case 'reload':await pg.goto(url);await pg.evaluate(()=>__advance(2));return'ok';
  case 'seq':{const r=[];for(const s of c.steps)r.push(await run(s));return r}
  case 'quit':setTimeout(async()=>{await br.close();process.exit(0)},50);return'bye';
  default:return'unknown cmd'}}
 let chain=Promise.resolve();
 http.createServer((rq,rs)=>{let b='';rq.on('data',d=>b+=d);rq.on('end',()=>{chain=chain.then(async()=>{let out;try{out=await run(JSON.parse(b||'{}'))}catch(e){out='ERROR '+e.message}rs.end(JSON.stringify(out)+'\n')})})}).listen(PORT,()=>console.log('driver on '+PORT+' shots in '+OUT))})();
