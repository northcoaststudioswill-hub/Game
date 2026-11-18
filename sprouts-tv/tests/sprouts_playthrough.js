/* SPROUTS TV copy of alt/tests/sprouts_playthrough.js (Nov 18 2026): same checks, run against the standalone build. */
/* Sprouts story run: plays a new game from the first scene to the relit North Light and prints every story beat in the
   order the game fires it (scenes, what people say, the mission arrow, cards, toasts, nightfall), stamped with the day
   and how far through the day it happened. Read the output to check the story is told in order.
   The autopilot from sprouts_soak.js follows the arrow through the real controls. It cannot finish every ask, so when
   the arrow has not changed for 18 game-seconds the script helps (carries the item home, opens the gate, or counts the
   ask as done) and prints "(helped: ...)". Those lines are the script, not the game.
   Run from the repo root:  node sprouts-tv/tests/sprouts_playthrough.js [build.html] [last day=16]     (several minutes) */
const { chromium } = require('playwright');
const path=require('path');const BUILD=path.resolve(process.argv[2]||path.join(__dirname,'../games/sprouts-tv.html'));
(async()=>{const browser=await chromium.launch();const page=await browser.newPage({viewport: { width: 640, height: 360 }});const errs=[];page.on('pageerror',e=>errs.push(e.message));
await page.goto('file://'+BUILD+'?dev');await page.waitForTimeout(500);
/* TV: no cartridge to pick */
const E=s=>page.evaluate(s=>__g.ev(s),s);for(let i=0;i<60&&(await E('state'))!=='menu';i++){await page.keyboard.press('Enter',{delay:70});await page.waitForTimeout(200)}
await E(`window.__T=[];window.__tl=m=>{window.__T.push('D'+day+' '+String(Math.round(dayT/DAYLEN*100)).padStart(3)+'%  '+m)};
 {const o=c3Play;c3Play=function(k,d){__tl('3D     <'+k+'> '+C3SCN[k].map(s=>s.cap?(s.cap[0]?s.cap[0]+': ':'')+s.cap[1]:'').join(' / '));return o.apply(this,arguments)}}
 {const o=playScene;playScene=function(k,d){if(k.slice(0,2)!=='3:'){const q=typeof SCN[k]==='function'?SCN[k]():SCN[k];__tl('2D     <'+k+'> '+q.map(s=>(s[2]?s[2]+': ':'')+s[0]).join(' / '))}return o.apply(this,arguments)}}
 {const o=talk;talk=function(n,m){const r=o.apply(this,arguments);if(state==='talk'&&dlg)__tl('TALK   '+dlg.name+': '+dlg.pages.map(p=>p.join(' ')).join(' | '));return r}}
 {const o=endDay;endDay=function(){__tl('---- NIGHT / EVENING REPORT ----');return o.apply(this,arguments)}}
 void 0`);
await E(`init();live=true;persist(true);c3Play('dawn',()=>playScene('open',()=>talk(npcs[0])));window.__bot={log:[],bad:[],seen:{},stuck:0,lx:0,ly:0};void 0`);
  const runA = secs => E(`(()=>{const B=window.__bot,K=__g.keys,PR=__g.prev,dt=1/30;
   const press=k=>{K[k]=1};const inv=()=>{const bad=m=>{if(B.bad.length<40&&!B.bad.includes(m))B.bad.push(m)};
     for(const b of buds){if(!isFinite(b.x)||!isFinite(b.y))bad('bud NaN '+b.st);
       if(['carry','fight','work'].includes(b.st)&&(!b.tgt||!b.tgt.on.includes(b)))bad('bud '+b.st+' not on its target ('+(b.tgt&&(b.tgt.kind+':'+(b.tgt.sub||'')))+')');
       if(b.st==='seek'&&!b.tgt)bad('seek without target');
       if(['follow','idle'].includes(b.st)&&!free(b.x,b.y,b.type===2)&&tileAt(b.x,b.y)!==GT)bad('bud '+b.st+' inside tile '+tileAt(b.x,b.y)+' type '+b.type+' at '+(b.x>>4)+','+(b.y>>4))}
     for(const o of [...items,...foes,...gates,...bugs,...plots,DIG])for(const b of o.on){if(b.dead)bad('dead bud on '+o.kind);if(b.tgt!==o)bad('on-list mismatch '+o.kind+':'+(o.sub||'')+' bud '+b.st)}
     for(const it of items)if(it.alive&&(!isFinite(it.x)||!isFinite(it.y)))bad('item NaN');
     if(!free(P.x,P.y,false)&&!inHome)bad('player in wall '+tileAt(P.x,P.y));
     if(!isFinite(cam.x))bad('cam NaN');if(crewCount()>capNow()+12)bad('over cap '+crewCount()+'/'+capNow());
     for(const q of wbuds)if(!isFinite(q.x)||(!free(q.x,q.y,false)&&!q.path))bad('buddy in wall '+q.id)};
   for(let f=0;f<${secs}*30;f++){for(const k in K)K[k]=0;
    if(msg&&msgT>0&&B.lm!==msg){B.lm=msg;__tl('SAY    '+msg)}for(const q of toasts)if(!q._l){q._l=1;__tl('TOAST  '+q.s)}if(state==='card'&&B.lc!==card){B.lc=card;__tl('CARD   '+card.title)}if(!B.seen[state]){B.seen[state]=1;B.log.push('d'+day+' '+Math.round(dayT)+'s state '+state)}
    if(['cine','talk','card','dayend','win','hop','c3','pan','hsel'].includes(state)){if(f%8===0)press('a')}
    else if(state==='travel'||state==='house'||state==='build'||state==='pause'||state==='map'){if(f%8===0)press('b')}
    else if(state==='play'){let o=objective();if(o&&/BLOOMED/.test(o.text)&&sprouts.filter(inSoil).length<3){const q=nearBerry();o={text:'FETCH BERRIES FIRST',x:q.x,y:q.y}}
      if(o){const key=o.text.replace(/\\d+ \\/ \\d+/,'');if(B.cur!==key){B.cur=key;__tl('ARROW  '+o.text);B.log.push('d'+day+' '+Math.round(dayT)+'s '+o.text+' (crew '+buds.length+')')}
       if(inHome){press('down')}
       else{const d=Math.hypot(o.x-P.x,o.y-P.y);
        if(f%15===0||!B.path){B.path=pathTo(P.x,P.y,o.x,o.y,false);if(!B.path){/* walk toward the nearest reachable tile */let best=null,bd=1e9;for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){if(fieldL[ty*MW+tx]<0)continue;const dd=Math.hypot(tx*16+8-o.x,ty*16+8-o.y);if(dd<bd&&pathTo(P.x,P.y,tx*16+8,ty*16+8,false)){bd=dd;best=[tx,ty]}}B.path=best?pathTo(P.x,P.y,best[0]*16+8,best[1]*16+8,false):[]}}
        const talkO=/^TALK|^DONE|PET LOUIE/.test(o.text),pluckO=/PLUCK/.test(o.text),near=!talkO&&!pluckO&&d<46;let wp=B.path&&B.path[0];while(wp&&Math.hypot(wp.x-P.x,wp.y-P.y)<5){B.path.shift();wp=B.path[0]}
        if(near&&d>16){const dx=o.x-P.x,dy=o.y-P.y;P.dx=dx/d;P.dy=dy/d;if(f%4<2)press('a')}
        else if(talkO&&d<22){const dx=o.x-P.x,dy=o.y-P.y;P.dx=dx/d;P.dy=dy/d;if(f%20===10)press('a')}
        else if(pluckO&&o.x===SOIL.x&&o.y===SOIL.y&&/BLOOMED/.test(o.text)){if(d<40)press('up')}
        else if(pluckO&&d<12){if(f%10===0)press('a')}
        else if(!talkO&&!pluckO&&d<=16){if(f%6===0)press('a')}
        else if(wp){const dx=wp.x-P.x,dy=wp.y-P.y;if(dx>2)press('right');else if(dx<-2)press('left');if(dy>2)press('down');else if(dy<-2)press('up')}
        if(f%240===0&&buds.some(b=>b.st==='idle'))B.whistle=45;if(B.whistle>0){B.whistle--;press('b')}
        if(f%30===0){if(Math.hypot(P.x-B.lx,P.y-B.ly)<2&&d>30){B.stuck++;B.side=18;B.sd=(B.sd||0)+1}B.lx=P.x;B.ly=P.y}if(B.side>0){B.side--;const k=[['up'],['down'],['left'],['right']][B.sd%4];K.up=K.down=K.left=K.right=0;press(k[0])}}}}
    try{__g.update(dt)}catch(e){if(B.bad.length<40)B.bad.push('THROW '+e.message+' @'+state);}
    for(const k in K)PR[k]=K[k];if(f%30===0&&state==='play')inv();if(f%300===0){try{__g.draw()}catch(e){B.bad.push('DRAW '+e.message)}}}
   return JSON.stringify({day,dayT:Math.round(dayT),state,crew:buds.length,soil:sprouts.length,shards,deliv:run.delivered,petals:meta.petals,stuck:B.stuck,ms:npcs.map(n=>n.name[0]+(n.st==='done'?'done':n.mi))})})()`);


const assist=()=>E(`(()=>{const o=objective(),home=(it)=>{it.x=HX;it.y=HY+12;it.w=1;it.on.length=0;const b=mkBud(1,2,HX,HY+14);b.tgt=it;b.st='carry';it.on.push(b)};
 const n=tracked(),m=n&&n.st==='active'?n.ms[n.mi]:null,id=m&&!(coastObj()||keyObj())?m.id:'';let did='';
 if(!o){dayT=Math.max(dayT,DAYLEN*.97);return 'none: on to the night'}
 if(/UNLOCK THE POND/.test(o.text)){const j=coastGate('jobsite');P.x=j.x;P.y=j.y+24;did='walked to the job site gate'}
 else if(/BUILD THE OLD PIER/.test(o.text)){openGate(coastGate('northPier'),true);did='pier built'}
 else if(/CARRY THE LENS/.test(o.text)){home(items.find(i=>i.alive&&i.sub==='lens'));did='lens carried home'}
 else if(/FOLLOW THE BEAM/.test(o.text)){P.x=71*16;P.y=20*16+8;did='walked through the sun door'}
 else if(/ORCHARD BRIDGE/.test(o.text)){openGate(gates[5],true);did='bridge built'}
 else if(/SOMETHING OLD/.test(o.text)){P.x=KEEP.x;P.y=KEEP.y+20;P.dx=0;P.dy=-1;P.mv=false;doA(true);did='read the arch'}
 else if(id==='r1'){openGate(gates[0],true);did='bramble burned'}else if(id==='r3'){openGate(gates[1],true);did='crystal smashed'}
 else if(id==='e12'){const k=items.find(i=>i.alive&&i.sub==='key');if(k){home(k);did='key carried home'}}
 else if(id==='e8'||id==='m2'){let it=items.find(i=>i.alive&&i.sub==='shard'&&(id!=='m2'||i.isle))||items.find(i=>i.alive&&i.sub==='shard');if(it){home(it);did='a shard carried home'}else{const e=foes.find(e=>e.alive&&e.boss);if(e){e.hp=.01;const b=mkBud(0,2,e.x,e.y);b.tgt=e;b.st='fight';e.on.push(b);did='Thornback woken'}}}
 else if(id==='r4'){const e=foes.find(e=>e.alive&&e.boss);if(e){e.hp=.01;const b=mkBud(0,2,e.x,e.y);b.tgt=e;b.st='fight';e.on.push(b);did='Thornback woken'}}
 else if(m&&!/^TALK|^DONE/.test(o.text)){m.get=()=>m.goal;did='counted '+m.id+' as done'}
 else if(/^TALK|^DONE/.test(o.text)){const q=npcs.find(n=>o.text.endsWith(n.name));if(q){P.x=q.x;P.y=q.y+14;P.dx=0;P.dy=-1;P.mv=false;if(state==='play')talk(q);did='walked to '+q.name}}
 else {dayT=Math.max(dayT,DAYLEN*.97);did='other ('+o.text+'): on to the night'}
 __tl('  (helped: '+did+')');return did})()`);
let last,key='',since=0;const MAXD=+(process.argv[3]||16);
while((await E('day'))<=MAXD){last=JSON.parse(await runA(6));const k=await E(`(()=>{const o=objective();return state+'|'+(o?o.text.replace(/\\d+ \\/ \\d+/,''):'-')+'|'+shards})()`);
 if(k===key)since+=6;else{key=k;since=0}
 if(since>=18&&(await E('state'))==='play'){await assist();since=0}
 if(await E(`run.lit&&npcs.every(n=>n.st==='done')`))break;}
console.log((await E('window.__T.join("\\n")')));console.log(JSON.stringify(last));console.log('BAD',await E('JSON.stringify(window.__bot.bad)'),errs);await browser.close()})();
