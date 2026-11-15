/* ================================================================
   IN-GAME SCENES (v6.3)
   Short camera moves with a caption, played in the world itself:
   the Lantern waking the garden, and the first look at the Meadow.
   A moves a caption on, START skips the lot. The world holds still
   while one plays.
   ================================================================ */
let SCOFF=false;
function scStart(steps,done){if(SCOFF){for(const s of steps)if(s.fn)s.fn();if(done)done();return}W4.scene={steps,i:-1,t:0,x:P3.x,y:P3.y,done};W4.talk=null;W4.quips=[];W4.quipQ=[];scNext()}
function scNext(){const sc=W4.scene;sc.i++;sc.t=0;const st=sc.steps[sc.i];
 if(!st){W4.scene=null;if(sc.done)sc.done();if(!W4.fld)wCamUpdate(P3.x,P3.y);return}if(st.fn)st.fn()}
function scTick(dt){const sc=W4.scene,st=sc.steps[sc.i];sc.t+=dt;
 const tx=st.x==null?P3.x:st.x,ty=st.y==null?P3.y:st.y,k=Math.min(1,dt*3.4);sc.x+=(tx-sc.x)*k;sc.y+=(ty-sc.y)*k;
 for(const f of W4.floats)f.t-=dt;W4.floats=W4.floats.filter(f=>f.t>0);
 if(!W4.fld){if(wOp()===2)for(const c of WCHOICE){c.x=-200;c.y=-200}wCamUpdate(sc.x,sc.y);if(W4.patchBuds&&SW.tendDone)wPatchUpdate(dt)}
 if(pressed('start')){for(let j=sc.i+1;j<sc.steps.length;j++)if(sc.steps[j].fn)sc.steps[j].fn();sc.i=sc.steps.length;scNext();return}
 if(st.txt){if(sc.t>.45&&pressed('a')){swSnd(660,.04,880);scNext()}}else if(sc.t>=(st.hold||1.2))scNext()}
function scDraw(){const sc=W4.scene,st=sc.steps[sc.i];if(!st)return;
 r('#0a0e08',0,0,W,12);r('#0a0e08',0,H-12,W,12);
 const who=st.who&&st.who===SW.keeper?(SW.keeper==='WILL'?'ERIN':'WILL'):st.who; /* nobody narrates to themselves */
 if(st.txt)uiSay(who,st.txt,sc.t*55,'A  NEXT · START  SKIP',st.acc);}
/* the Lantern wakes: look up at it, then down to the garden as the soil stirs */
function scWake(){SW.beats=SW.beats||{};SW.beats.lit=1;const pop=()=>{wInitPatch();for(const pb of W4.patchBuds||[])if(pb.type>=0){for(let i=0;i<5;i++)W4.floats.push({x:pb.x+(Math.random()*14-7),y:pb.y-4-Math.random()*12,txt:'*',t:.5+Math.random()*.6,c:TYPES[pb.type].l})}swSnd(784,.12,1568)};
 scStart([
  {x:240,y:70,hold:1.9,fn:()=>{for(const c of WCHOICE){c.x=-200;c.y=-200}W4.wake=3;W4.banner=null;swSnd(523,.35,1046)}},
  {x:240,y:70,who:'ERIN',txt:'The Great Lantern is awake. Your berries did that.'},
  {x:240,y:352,hold:1.5},
  {x:240,y:352,hold:1.1,fn:pop},
  {x:240,y:352,who:'ERIN',txt:'This is the GARDEN. The Lantern\'s light wakes sprouts in the soil here.'},
  {x:240,y:352,who:'ERIN',txt:'Those first three were seeds it kept safe. From now on, new sprouts grow here.'},
  {x:240,y:352,who:'ERIN',txt:'Walk up to a grown one and press A to pluck it. It joins your squad.'},
  {x:240,y:352,who:'MARCUS',txt:'Every four things they carry home, the Lantern grows one more. Free sprouts, bro.'},
  {who:'MARCUS',txt:'Light reached the wilds too. Three buddies incoming. Pick one. I would pick the blue one. Hydro.'}
 ],()=>{W4.choiceT=0;W4.banner={txt:'THE LANTERN STIRS',sub:'Pluck sprouts in the garden to the south',t:3.5}})}
/* first steps in the Meadow: where buddies live, and what A does out here */
function scMeadow(F){SW.lessons.scMeadow=1;const sec=wSector(W4.sector);
 if(!W4.wilds.length&&F.grass.length)W4.wilds.push(fSpawnWild(F,sec));
 const far=(o)=>Math.hypot(o.x-P3.x,o.y-P3.y),wd=W4.wilds.slice().sort((a,b)=>far(a)-far(b))[0],
  tr=W4.nodes.filter(n=>!n.got&&n.k==='tree').sort((a,b)=>far(a)-far(b))[0],st=[];
 if(wd){st.push({x:wd.x,y:wd.y,hold:1.3},{x:wd.x,y:wd.y,who:'LOUIE',txt:'Woof! A wild buddy. They live in the tall grass.'},
  {x:wd.x,y:wd.y,who:'LOUIE',txt:'Face it and press A to throw sprouts. Enough of them and it blooms and joins you.'},
  {x:wd.x,y:wd.y,who:'LOUIE',txt:'Too few and it fights. Or walk right up and press A to battle it yourself.'})}
 if(tr&&SW.party.length&&!SW.lessons.scSend){SW.lessons.scSend=1;st.push({x:tr.x,y:tr.y,hold:1.1},{x:tr.x,y:tr.y,who:'LOUIE',txt:'Trees and rocks are buddy work. Face one and press A: your buddy goes.'},
  {x:tr.x,y:tr.y,who:'LOUIE',txt:'The ring shows who is going. B calls everyone back.'})}
 if(st.length){st.push({hold:.5});scStart(st,()=>swSave())}}
/* right after your first buddy joins: what A does with a buddy at your side */
function scSend(){SW.lessons.scSend=1;const far=(o)=>Math.hypot(o.x-P3.x,o.y-P3.y),tr=W4.nodes.filter(n=>!n.got&&n.k!=='bush').sort((a,b)=>far(a)-far(b))[0];if(!tr)return;
 const nm=SW.party[0].sp;scStart([{x:tr.x,y:tr.y,hold:1.2},
  {x:tr.x,y:tr.y,who:'MARCUS',txt:"That's my guy! "+nm+' rolls with you now. Buddies do the heavy lifting.'},
  {x:tr.x,y:tr.y,who:'MARCUS',txt:'Face a tree or a rock, press A. Ring locks on, '+nm+' goes. See one, send one.'},
  {x:tr.x,y:tr.y,who:'MARCUS',txt:'Then throw sprouts at what drops. They carry it home. You just point, bro.'},{hold:.5}],()=>swSave())}
/* nobody stands on top of you */
function scSpread(){for(const c of W4.cast||[]){const dx=c.x-P3.x,dy=c.y-P3.y,d=Math.hypot(dx,dy);if(d<24){const ux=d>.5?dx/d:1,uy=d>.5?dy/d:0;c.x+=ux*(24-d)*.5;c.y+=uy*(24-d)*.5}}}
/* the opening is told in captions, one at a time, with the field left clear */
function scIntro(){scStart([{hold:.9},{who:'ERIN',txt:"You're up! Look: the roots under the Great Lantern are glowing."},
  {x:240,y:128,hold:1.1},{x:240,y:128,who:'MARCUS',txt:'Bro. Seeds. Use the D-pad to walk up to one, then press A. See one, pluck one.'},{hold:.4}])}
function scBerries(){const it=W4.bf.items.find(i=>i.op)||{x:212,y:208};scStart([{hold:.5},{who:'ERIN',txt:'They follow you! Those are sprouts.'},
  {x:it.x+14,y:it.y,hold:1.1},{x:it.x+14,y:it.y,who:'MARCUS',txt:'Berries, bro. Face them and press A. Your sprouts haul them to the Lantern. I supervise.'},
  {x:it.x+14,y:it.y,who:'ERIN',txt:'Hold B and they all come back to you.'},{hold:.4}])}
/* one bouncing arrow on the thing to do next. If it is off screen, the arrow sits on the screen edge and points the way. */
function scTri(x,y,d){const K='#14101e',C='#ffd94d';x=Math.round(x);y=Math.round(y);
 if(d==='d'){r(K,x-7,y-1,15,5);r(K,x-5,y+4,11,4);r(K,x-3,y+8,7,3);r(K,x-1,y+11,3,2);r(C,x-6,y,13,3);r(C,x-4,y+3,9,3);r(C,x-2,y+6,5,3);r(C,x,y+9,1,2)}
 else if(d==='u'){r(K,x-7,y+7,15,5);r(K,x-5,y+3,11,4);r(K,x-3,y,7,3);r(K,x-1,y-2,3,2);r(C,x-6,y+8,13,3);r(C,x-4,y+5,9,3);r(C,x-2,y+2,5,3);r(C,x,y-1,1,3)}
 else{const s2=d==='l'?-1:1;for(let n=0;n<4;n++){const h=13-n*4,xx=x+s2*n*3-(s2<0?2:0);r(K,xx-1,y-(h>>1)-1,5,h+2)}for(let n=0;n<4;n++){const h=13-n*4,xx=x+s2*n*3-(s2<0?2:0);r(C,xx,y-(h>>1),3,h)}}}
function scArrow(){if(W4.scene||!W4.bf||W4.fld)return;const op=wOp(),cam=W4.cam||{x:0,y:0};let t=null,off=22;
 if(op===0)t=W4.bf.buds[0];else if(op===1)t=W4.bf.items.find(i=>i.op&&!i.car.length&&!i.done);
 else if(op===2){if(WCHOICE[1].y>0&&WCHOICE[1].y<190){t=WCHOICE[1];off=40}}
 else if(SW.quest===2)t={x:240,y:(W4.wh||520)-14,gate:1};
 if(op===0&&wBudTotal()===0){const lw=tw('YOU',1);r('#14101e',P3.x-lw/2-3,P3.y-34,lw+6,10);text('YOU',P3.x-lw/2,P3.y-33,1,'#ffd94d',null)}
 if(!t)return;const sx=t.x-cam.x,sy=t.y-off-cam.y,cx=Math.max(14,Math.min(W-14,sx)),cy=Math.max(46,Math.min(H-40,sy)),edge=cx!==sx||cy!==sy,b=Math.sin(time*6)*2;
 if(!edge){if(op<2){const p=1+((time*2)%1)*6,a=1-((time*2)%1);g.globalAlpha=.7*a;r('#fff3b0',t.x-6-p,t.y+3,12+p*2,1);r('#fff3b0',t.x-6-p,t.y-9-p,12+p*2,1);r('#fff3b0',t.x-6-p,t.y-9-p,1,12+p);r('#fff3b0',t.x+5+p,t.y-9-p,1,12+p);g.globalAlpha=1}
  if(!t.gate)scTri(t.x,t.y-off+b,'d');return}
 const d=sy>H-40?'d':sx<14?'l':sx>W-14?'r':'u';scTri(cx+cam.x+(d==='l'?-b:d==='r'?b:0),cy+cam.y+(d==='d'?b:d==='u'?-b:0),d)}
function scBuild(){SW.lessons.scBuild=1;SW.beats.caught=1;const nm=(SW.party[SW.party.length-1]||{}).sp||'It';
 scStart([{hold:.6},{who:'MARCUS',txt:'AYYY! You caught one! Never doubted you once. Dap me up.'},
  {x:150,y:236,hold:1.1},{x:150,y:236,who:'MARCUS',txt:'Buddies need a roof, bro. Press START, pick BUILD, then COTTAGE. Costs 8 wood. This spot is nice.'},
  {x:150,y:236,who:'MARCUS',txt:'Short on wood? Send a buddy at trees. Sprouts carry the logs home. Teamwork. I supervise.'},
  {who:'ERIN',txt:'Only your lead buddy walks with you here. The others wait at home. Give them a roof and they get to work.'},{hold:.4}],()=>swSave())}
function scAuto(){if(!W4.fld&&W4.bf){scSpread();SW.beats=SW.beats||{};
  if(SW.quest===3&&!SW.lessons.scBuild&&W4.sector==='BASE'&&SW.lessons.scSend){SW.beats.caught=1;W4.buildT=(W4.buildT||0)+1;if(W4.buildT>40){scBuild();return}}
  if(wOp()===0&&!SW.beats.wake){SW.beats.wake=1;SW.beats.first=1;scIntro();return}
  if(wOp()===1&&!SW.beats.three){SW.beats.three=1;SW.beats.carry=1;SW.beats.first=1;scBerries();return}
  if(wOp()===2)SW.beats.lit=1;if(SW.party.length&&!SW.lessons.scSend&&wOp()>=3&&W4.sector==='BASE'){W4.sendT=(W4.sendT||0)+1;if(W4.sendT>45)scSend()}}
 const F=W4.fld;if(F&&F.id==='MEADOW'&&!SW.lessons.scMeadow&&SW.quest>=2){F.scT=(F.scT||0)+1;if(F.scT>20)scMeadow(F)}}
/* a seed of light arcs from the Lantern to you when it grows a sprout */
function scSeed(ty){(W4.seedFx=W4.seedFx||[]).push({t:0,ty})}
function scWorldFx(){scArrow();if(!W4.seedFx)return;for(const fx of W4.seedFx){fx.t+=1/60;const k=Math.min(1,fx.t/1.1),x=240+(P3.x-240)*k,y=40+(P3.y-8-40)*k-Math.sin(k*3.1416)*46,T=TYPES[fx.ty];
  for(let i=1;i<5;i++){const k2=Math.max(0,k-i*.035),x2=240+(P3.x-240)*k2,y2=40+(P3.y-8-40)*k2-Math.sin(k2*3.1416)*46;g.globalAlpha=.6-i*.12;r(T.l,Math.round(x2),Math.round(y2),2,2)}
  g.globalAlpha=1;r('#ffffff',Math.round(x)-2,Math.round(y)-2,5,5);r(T.c,Math.round(x)-1,Math.round(y)-1,3,3)}
 W4.seedFx=W4.seedFx.filter(fx=>fx.t<1.1)}
/* ---------------- raising a building (v6.4) ----------------
   Placing a building no longer pops it into being: a scaffold goes up,
   your sprouts hop on it with hammers, base buddies walk over to help,
   and it rises over a few seconds. More helpers, faster build. */
function scConStart(b,def,first){W4.cons=W4.cons||[];W4.cons.push({b,def,first,t:0,need:4.2});b.con=1;
 for(const w of W4.wk||[]){w.task={k:'idle',x:wCellX(b.gx)+10+(Math.random()*40-20),y:wCellY(b.gy)+28+Math.random()*6,t:4.5}}}
function scConTick(dt){if(!W4.cons||!W4.cons.length)return;const F=W4.bf;
 for(const c of W4.cons){const x=wCellX(c.b.gx)+10,y=wCellY(c.b.gy)+10,help=(W4.wk||[]).filter(w=>Math.hypot(w.x-x,w.y-y-18)<40).length;
  c.t+=dt*(1+help*.35);c.b.con=Math.max(0,1-c.t/c.need);
  if(((c.t*5)|0)!==(((c.t-dt)*5)|0)){fSpark(x+(Math.random()*28-14),y-4-Math.random()*16,'#ffe8b0');swSnd(220+Math.random()*80,.03,140)}
  if(c.t>=c.need){c.b.con=0;delete c.b.con;
   for(let i=0;i<14;i++)W4.floats.push({x:x+(Math.random()*36-18),y:y-Math.random()*24,txt:'*',t:.4+Math.random()*.6,c:i%2?'#fff3b0':'#7ee787'});
   if(c.first){SW.hearts+=3;SW.heartsTotal+=3}W4.floats.push({x,y:y-26,txt:c.def.n+' BUILT!'+(c.first?' +3 ♥':''),t:2.2,c:'#ffd94d'});
   swSnd(784,.09,1175);swSave()}}
 W4.cons=W4.cons.filter(c=>c.t<c.need)}
function scConDraw(b){if(!(W4.cons||[]).some(c=>c.b===b)){delete b.con;wDrawBuilding0(b);return}const x=wCellX(b.gx),y=wCellY(b.gy),k=1-b.con,K='#14101e',hh=Math.round(30*k);
 r('rgba(0,0,0,.24)',x-4,y+17,30,5);
 /* the building rises out of the ground */
 if(hh>0){const sv=g.save.bind(g);sv();g.beginPath();g.rect(x-12,y+20-hh,46,hh+2);g.clip();wDrawBuilding0(b);g.restore()}
 /* scaffold poles and planks */
 r('#8a6a48',x-6,y-12,2,32);r('#8a6a48',x+24,y-12,2,32);r('#a8865c',x-7,y+18-hh,34,2);r('#a8865c',x-7,y-2,34,1);
 /* three sprouts on the job */
 const F=W4.bf,ts=F?F.sq.slice(0,3).map(s=>s.type):[0,2,4];
 ts.forEach((ty,i)=>{const T=TYPES[ty],sx=x-4+i*13,hop=((time*6+i*2)|0)%2,sy=y+18-hh-6-hop*2;
  r(K,sx-1,sy-1,6,7);r(T.c,sx,sy,4,5);r(T.l,sx+1,sy,2,1);
  const sw2=((time*8+i)|0)%2;r('#8a6a48',sx+4,sy-3+sw2,1,4);r('#c8ccd4',sx+3,sy-4+sw2,3,2)});
 const pct=Math.round(k*100)+'%';r('rgba(10,14,8,.75)',x+10-tw(pct,1)/2-2,y-24,tw(pct,1)+4,9);text(pct,x+10-tw(pct,1)/2,y-23,1,'#ffd94d',null)}
