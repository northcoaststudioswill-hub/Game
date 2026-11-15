// plays the new opening from a fresh save: title -> Lantern -> seeds -> berries -> first buddy -> south road -> first swarm
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});p.on('pageerror',e=>console.log('PAGEERR',e.message));
const out=process.argv[3];await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);
await p.evaluate(()=>{const e=document.querySelector('.cart[data-i="2"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))});await p.waitForTimeout(900);
await p.evaluate(()=>{const G=window.__g,F=G.SWF();window.T=0;window.MSG=[];let last='';
 window.step=(n,keys)=>{for(let i=0;i<n;i++){for(const k in G.keys)G.keys[k]=0;if(keys)for(const k of keys)G.keys[k]=1;G.update(1/30);for(const k in G.keys)G.prev[k]=G.keys[k];window.T+=1/30}for(const k in G.keys)G.keys[k]=0;G.update(1/30);for(const k in G.keys)G.prev[k]=0;window.T+=1/30};
 window.tap=k=>{step(1,[k]);step(2)};
 window.walk=(x,y,max)=>{for(let i=0;i<(max||900);i++){const q=F.pos(),dx=x-q.x,dy=y-q.y;if(Math.hypot(dx,dy)<5)return true;step(1,[Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')])}return false};
 window.face=d=>step(2,[d])});
let n=0;const ev=f=>p.evaluate(f);
const shot=async(label)=>{n++;await ev(()=>window.__g.draw());await p.locator('#screen').screenshot({path:out+'/'+String(n).padStart(2,'0')+'_'+label+'.png'});
 const st=await ev(()=>{const F=window.__g.SWF(),S=F.meta(),nr=F.near();return{t:Math.round(window.T),state:F.state(),op:F.op(),quest:S.quest,pos:[Math.round(F.pos().x),Math.round(F.pos().y)],near:nr&&nr.txt,buds:wtot(S),party:S.party.map(m=>m.sp+m.lv),res:S.res};function wtot(S){return Object.values(S.buds).reduce((a,b)=>a+b,0)}});console.log(n,label,JSON.stringify(st))};
for(let i=0;i<12;i++){const s=await ev(()=>window.__g.SWF().state());if(s==='g4world')break;if(i===2||i===7)await shot('intro'+i);await ev(()=>{step(40);tap('a')})}
await ev(()=>step(20));await shot('wake_at_lantern');
await ev(()=>step(90));await shot('louie_points');
for(let i=0;i<3;i++){await ev(()=>{const F=window.__g.SWF(),b=F.bf().buds[0];walk(b.x,b.y+13);face('up');});if(i===0)await shot('seed_prompt');await ev(()=>{tap('a');step(20)})}
await shot('three_sprouts');
await ev(()=>{const F=window.__g.SWF(),it=F.bf().items.find(i=>i.op);walk(it.x+44,it.y+2);face('left')});await shot('aim_berries');
await ev(()=>{for(let i=0;i<3;i++){tap('b');step(12)}});await shot('thrown');
await ev(()=>step(150));await shot('carrying');
for(let i=0;i<8;i++){const lit=await ev(()=>!!window.__g.SWF().meta().lit);if(lit)break;await ev(()=>{const F=window.__g.SWF(),it=F.bf().items.find(i=>i.op&&!i.car.length);if(it){walk(it.x+44,it.y+2);face('left');tap('b');}step(120)})}
await ev(()=>step(10));await shot('lantern_stirs');await ev(()=>step(150));await shot('buddies_arrive');
await ev(()=>{walk(240,170);face('up')});await shot('greet_prompt');
await ev(()=>{tap('a');step(10)});await shot('buddy_card');await ev(()=>{tap('a');step(40)});await shot('joined');await ev(()=>{tap('a');step(60)});await shot('after_join');
await ev(()=>{walk(240,300,400);walk(240,480,500)});await shot('south_road');
await ev(()=>{for(let i=0;i<60&&!window.__g.SWF().fld();i++)step(1,['down']);step(30)});await shot('meadow_arrive');
await ev(()=>{const F=window.__g.SWF(),w=F.wilds()[0];window.W0=w.sp;});
await ev(()=>{const F=window.__g.SWF();for(let i=0;i<1500&&F.state()==='g4world';i++){const w=F.wilds().slice().sort((a,b)=>Math.hypot(a.x-F.pos().x,a.y-F.pos().y)-Math.hypot(b.x-F.pos().x,b.y-F.pos().y))[0];const q=F.pos(),dx=w.x-q.x,dy=w.y+10-q.y;step(1,[Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')]);const nr=F.near();if(nr&&nr.k==='wild'){tap('a');break}}step(40)});await shot('wild_engaged');
await ev(()=>{for(let i=0;i<8;i++){tap('a');step(8)}});await shot('battle_menu');
await ev(()=>{const F=window.__g.SWF();for(let i=0;i<40&&F.state()==='g4battle';i++){const bt=F.bt();if(bt.phase==='menu'){if(bt.foe.hp<bt.foe.hp*2&&i>6)break;tap('a')}else if(bt.phase==='moves'){tap('right');tap('a')}else tap('a');step(6)}});await shot('weakened');
await ev(()=>{const F=window.__g.SWF();for(let i=0;i<30;i++){const bt=F.bt();if(!bt)break;if(bt.phase==='menu'){tap('right');tap('a');step(4);break}tap('a');step(6)}});await shot('swarm_pick');
await ev(()=>{tap('a');step(20)});await shot('swarm_fly');await ev(()=>step(30));await shot('swarm_bloom');
await ev(()=>{const F=window.__g.SWF();for(let i=0;i<20&&F.state()==='g4battle';i++){tap('a');step(10)}step(30)});await shot('after_catch');
await ev(()=>{const F=window.__g.SWF(),sp=F.spots()[1];F.setPos(sp.x+4,sp.y+26);face('up');step(4)});await shot('fiber_spot');
await ev(()=>{tap('a');step(60)});await shot('buddy_fetching');await ev(()=>step(120));await shot('fetched');
await b.close()})();
