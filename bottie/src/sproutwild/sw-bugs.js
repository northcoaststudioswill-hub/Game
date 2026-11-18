/* ================================================================
   BUGS (v7.9)
   Bugs live out in the field areas: some in the grass, some by the
   water, some in the trees, some only at night. Face one and press A:
   a sprout catches it. Caught bugs go in the BUG JAR (START menu),
   where each can be turned into a resource, or sold to PIP in Lantern
   Town for petals. All eight come from valley summers.
   ================================================================ */
const WBUGS=[
 {id:'LADYBUG',hab:'grass',c:'#e04838',c2:'#14101e',yield:['berry',2],val:4,w:5,lore:"The valley's luck bug. Gardens love it."},
 {id:'WOOLLY BEAR',hab:'grass',c:'#3a2414',c2:'#d8902c',yield:['fiber',2],val:6,w:4,lore:'Vermilion throws it a festival. Its stripes forecast winter.'},
 {id:'LIGHTNING BUG',hab:'grass',night:1,fly:1,c:'#3a3a28',c2:'#fff3b0',yield:['light',1],val:8,w:5,lore:'Summer nights in the valley. Feeds a spark to the Lantern.'},
 {id:'MAYFLY',hab:'water',fly:1,c:'#b8a868',c2:'#f0e8c8',yield:['fiber',1],val:3,w:5,lore:'The Wending Lake swarms with them every June. Lives a single day.'},
 {id:'CICADA',hab:'tree',fly:1,c:'#4a6a3a',c2:'#d8e8f0',yield:['wood',3],val:10,w:3,lore:'Sleeps underground seventeen years, then sings all summer.'},
 {id:'HELLGRAMMITE',hab:'water',c:'#3a2c22',c2:'#8a6a48',yield:['ore',1],val:14,w:2,lore:'A river monster in miniature. Lives under Crooked River stones.'},
 {id:'LUNA MOTH',hab:'tree',night:1,fly:1,c:'#a8e8b8',c2:'#e8fff0',yield:['fiber',4],val:25,w:1,lore:'Pale green, out only at night. Its silk is like moonlight.'},
 {id:'MANTIS',hab:'grass',c:'#7ec850',c2:'#3a7d2e',yield:['heart',1],val:18,w:1,lore:'Bows to everyone. The Lantern likes its manners.'}];
const WBUGRES={berry:'BERRY',fiber:'FIBER',wood:'WOOD',ore:'ORE',light:'LANTERN LIGHT',heart:'HEART'};
function bgSp(id){return WBUGS.find(b=>b.id===id)}
/* where each habitat is on this map */
function bgSpots(F,hab){F.bgH=F.bgH||{};if(F.bgH[hab])return F.bgH[hab];let L=[];
 if(hab==='grass')L=F.grass.map(([x,y])=>[x*FT+8,y*FT+8]);
 else if(hab==='water'){for(let y=1;y<F.h-1;y++)for(let x=1;x<F.w-1;x++)if(fWalkTile(F,x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>fTile(F,x+a,y+b)==='~'))L.push([x*FT+8,y*FT+8])}
 else L=W4.nodes.filter(n=>n.k==='tree').map(n=>[n.x+(Math.random()<.5?-14:14),n.y-6]);
 return F.bgH[hab]=L}
let WNOBUG=false;
function bgTick(F,dt){if(WNOBUG){W4.bugs=[];return}W4.bugs=W4.bugs||[];if(W4.bugsFor!==F){W4.bugs=[];W4.bugsFor=F;W4.bugCd=.5}
 const night=wDark()>.4,cap=F.id==='HOLLOW'?4:3;
 W4.bugCd=(W4.bugCd||0)-dt;if(W4.bugCd<=0&&W4.bugs.length<cap){W4.bugCd=14+Math.random()*10;
  const pool=WBUGS.filter(b=>(!b.night||night)&&bgSpots(F,b.hab).length);let tot=pool.reduce((a,b)=>a+b.w,0),roll=Math.random()*tot,pick=null;for(const b of pool){roll-=b.w;if(roll<=0){pick=b;break}}
  if(pick){const S=bgSpots(F,pick.hab),[hx,hy]=S[(Math.random()*S.length)|0];if(Math.hypot(hx-P3.x,hy-P3.y)>60)W4.bugs.push({sp:pick.id,x:hx,y:hy,hx,hy,wx:hx,wy:hy,t:0,ph:Math.random()*6})}}
 for(const bg of W4.bugs){const s=bgSp(bg.sp);if(s.night&&!night){bg.gone=1;continue}bg.t-=dt;
  if(bg.t<=0){bg.t=s.fly?.6+Math.random():1.5+Math.random()*2;const rr=s.fly?22:10;bg.wx=bg.hx+(Math.random()*2-1)*rr;bg.wy=bg.hy+(Math.random()*2-1)*rr*.7}
  const dx=bg.wx-bg.x,dy=bg.wy-bg.y,d=Math.hypot(dx,dy),v=s.fly?26:7;if(d>1){bg.x+=dx/d*Math.min(d,v*dt);bg.y+=dy/d*Math.min(d,v*dt);bg.fx=dx<0?-1:1}}
 W4.bugs=W4.bugs.filter(b=>!b.gone)}
function bgCatch(bg){const s=bgSp(bg.sp);W4.bugs.splice(W4.bugs.indexOf(bg),1);SW.bugs=SW.bugs||{};const first=!SW.bugs[bg.sp]&&!(SW.bugSeen&&SW.bugSeen[bg.sp]);
 SW.bugs[bg.sp]=(SW.bugs[bg.sp]||0)+1;SW.bugSeen=SW.bugSeen||{};SW.bugSeen[bg.sp]=1;
 for(let i=0;i<6;i++)W4.floats.push({x:bg.x+(Math.random()*10-5),y:bg.y-6-Math.random()*8,txt:'*',t:.5,c:s.c2});
 W4.floats.push({x:bg.x,y:bg.y-18,txt:(first?'NEW BUG: ':'')+bg.sp+'!',t:1.8,c:'#fff3b0'});swSnd(900,.06,1400);swSnd(1400,.1,1400);
 if(first)swSay(bg.sp+': '+s.lore,3.6);
 if(!SW.lessons.bugJar){SW.lessons.bugJar=1;W4.bugTip=1}swSave()}
function bgDraw(bg){const s=bgSp(bg.sp),x=Math.round(bg.x),fl=((time*14+bg.ph)|0)%2,y=Math.round(bg.y-(s.fly?5+Math.sin(time*5+bg.ph)*2:0)),K='#14101e';
 if(s.fly){r('rgba(0,0,0,.18)',x-2,Math.round(bg.y)+1,5,1)}
 if(bg.sp==='LIGHTNING BUG'){const gl=.5+.5*Math.sin(time*4+bg.ph);g.globalAlpha=.25+.4*gl;r('#fff3b0',x-3,y-2,7,6);g.globalAlpha=1}
 if(bg.sp==='WOOLLY BEAR'||bg.sp==='HELLGRAMMITE'){const w=bg.sp==='HELLGRAMMITE'?6:7;r(K,x-4,y-2,w+2,4);r(s.c,x-3,y-1,w,2);r(s.c2,x-1,y-1,3,2);if(fl)r(s.c,x-4,y+1,1,1);return}
 if(bg.sp==='MANTIS'){r(K,x-1,y-6,3,8);r(s.c,x,y-5,1,6);r(s.c,x+1,y-6,2,1);r(s.c2,x-2,y-3,2,1);r(s.c2,x+1,y-3,2,1);return}
 r(K,x-2,y-2,5,4);r(s.c,x-1,y-1,3,2);
 if(bg.sp==='LADYBUG'){r(s.c2,x,y-1,1,1);r(s.c2,x-1,y,1,1)}
 if(s.fly){const wc=bg.sp==='LUNA MOTH'?s.c:s.c2,a=fl?1:2;r(wc,x-1-a-1,y-2-(fl?1:0),2,2);r(wc,x+2+a-1,y-2-(fl?1:0),2,2)}
 if(((time*1.2+bg.ph)%3)<.12)r('#ffffff',x+2,y-3,1,1)}
/* the jar */
function jarRows(){return WBUGS.map(b=>({b,n:(SW.bugs||{})[b.id]||0,seen:(SW.bugSeen||{})[b.id]}))}
function jarUpdate(){const rows=jarRows();swNav(rows.length+1);
 if(pressed('b')){state='g4pause';swSel=2;return}
 const row=rows[swSel];if(swSel===rows.length){if(pressed('a')){state='g4pause';swSel=2}return}
 if(pressed('a')){if(!row.n){swSnd(140,.08);return}row.n--;SW.bugs[row.b.id]--;const [k,q]=row.b.yield;
  if(k==='light'){SW.light=(SW.light||0)+q*2;if(SW.light>=4&&wLit()&&W4.bf){SW.light-=4;const tn=TYPES[(Math.random()*5)|0].n;SW.buds[tn]=(SW.buds[tn]||0)+1;jarSay('The Lantern drank the light and grew a '+tn+' sprout!',2.6)}else jarSay('The Lantern glows a little brighter.',1.8)}
  else if(k==='heart'){SW.hearts++;SW.heartsTotal++;jarSay('+1 gratitude heart.',1.6)}
  else{SW.res[k]=(SW.res[k]||0)+q;jarSay('+'+q+' '+WBUGRES[k]+'.',1.6)}swSnd(784,.08,1175);swSave()}
 if(pressed('sel')){if(!row.n){swSnd(140,.08);return}if(W4.sector!=='TOWN'){swSnd(140,.08);jarSay('PIP buys bugs in Lantern Town.',2);return}
  row.n--;SW.bugs[row.b.id]--;SW.res.petal+=row.b.val;jarSay('PIP paid '+row.b.val+' petals for a '+row.b.id+'. You have '+SW.res.petal+'.',1.8);swSnd(988,.08,1319);swSave()}}
function drawJar(){const rows=jarRows(),tot=rows.reduce((a,r2)=>a+r2.n,0),seen=rows.filter(r2=>r2.seen).length;swShell('BUG JAR',seen+' of '+WBUGS.length+' found');
 swRows(rows.map(r2=>({a:r2.seen?r2.b.id+(r2.n?' x'+r2.n:''):'???',b:r2.seen?'+'+r2.b.yield[1]+' '+(r2.b.yield[0]==='light'?'LIGHT':WBUGRES[r2.b.yield[0]])+' · '+r2.b.val+'✿':(r2.b.night?'at night · ':'')+(r2.b.hab==='water'?'by water':r2.b.hab==='tree'?'in trees':'in grass')})).concat([{a:'BACK',b:''}]),swSel,
  W4.jarMsg&&time-W4.jarMsgAt<3?W4.jarMsg:swSel<rows.length?(rows[swSel].seen?rows[swSel].b.lore+' A: use one'+(W4.sector==='TOWN'?' · SELECT: sell to PIP':' · sell to PIP in town'):'Not found yet. Throw a sprout at a bug to catch it.'):(tot+' bugs in the jar.'))}

/* v8.1: what A and SELECT did shows in the jar's footer (swSay only shows in the world, behind this menu) */
function jarSay(s,t){swSay(s,t);W4.jarMsg=s;W4.jarMsgAt=time}
