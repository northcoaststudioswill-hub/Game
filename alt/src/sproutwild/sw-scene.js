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
 const who=st.who&&st.who===SW.keeper&&!st.self?(SW.keeper==='WILL'?'ERIN':'WILL'):st.who; /* nobody narrates to themselves */
 if(st.txt)uiSay(who,st.txt,sc.t*55,'A  NEXT · START  SKIP',st.acc);}
/* the Lantern wakes: look up at it, then down to the garden as the soil stirs */
function scWake(){SW.beats=SW.beats||{};SW.beats.lit=1;const pop=()=>{wInitPatch();for(const pb of W4.patchBuds||[])if(pb.type>=0){for(let i=0;i<5;i++)W4.floats.push({x:pb.x+(Math.random()*14-7),y:pb.y-4-Math.random()*12,txt:'*',t:.5+Math.random()*.6,c:TYPES[pb.type].l})}swSnd(784,.12,1568)};
 scStart([
  {x:240,y:70,hold:1.9,fn:()=>{for(const c of WCHOICE){c.x=-200;c.y=-200}W4.wake=3;W4.banner=null;swSnd(523,.35,1046)}},
  {x:240,y:70,who:'ERIN',txt:'The Great Lantern is awake. Your berries did that.'},
  {x:240,y:352,hold:1.5},
  {x:240,y:352,hold:1.1,fn:pop},
  {x:240,y:352,who:'ERIN',txt:'This is the GARDEN. From now on, new sprouts grow here.'},
  {x:240,y:352,who:'ERIN',txt:'Walk up to a grown one and press A to pluck it. It joins your squad.'},
  {who:'MARCUS',txt:'Light reached the wilds too. Three buddies incoming. Pick one. I would pick the blue one. Hydro.'}
 ],()=>{W4.choiceT=0;W4.banner={txt:'THE LANTERN STIRS',sub:'Pluck sprouts in the garden to the south',t:3.5}})}
/* first steps in the Meadow: where buddies live, and what A does out here */
function scMeadow(F){SW.lessons.scMeadow=1;const sec=wSector(W4.sector);
 if(!W4.wilds.length&&F.grass.length)W4.wilds.push(fSpawnWild(F,sec));
 const far=(o)=>Math.hypot(o.x-P3.x,o.y-P3.y),wd=W4.wilds.slice().sort((a,b)=>far(a)-far(b))[0],
  tr=W4.nodes.filter(n=>!n.got&&n.k==='tree').sort((a,b)=>far(a)-far(b))[0],st=[];
 if(wd){st.push({x:wd.x,y:wd.y,hold:1.3},{x:wd.x,y:wd.y,who:'LOUIE',txt:'Woof! A wild buddy. They live in the tall grass.'},
  {x:wd.x,y:wd.y,who:'LOUIE',txt:'Face it and press A to throw sprouts. Enough of them and it blooms and joins you.'},
  {x:wd.x,y:wd.y,who:'LOUIE',txt:'Too strong to catch? Walk right up and press A to battle it instead.'})}
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
 else if(op===2){if(WCHOICE[1].y>0&&WCHOICE[1].y<190){t=WCHOICE.slice().sort((a,b)=>Math.hypot(a.x-P3.x,a.y-P3.y)-Math.hypot(b.x-P3.x,b.y-P3.y))[0];off=40}}
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
  if(wOp()>=3&&!SW.lessons.loop&&SW.quest<=2){if(SCOFF)SW.lessons.loop=1;else{W4.loopT=0;state='g4loop';return}}
  if(wHasRoof()&&!SW.lessons.scDab&&W4.sector==='BASE'&&wOp()>=3&&!(W4.cons&&W4.cons.length)){W4.dabT=(W4.dabT||0)+1;if(W4.dabT>50){if(SCOFF)SW.lessons.scDab=1;else dabStart();return}}
  if(SW.quest===4&&SW.lessons.scDab&&!SW.lessons.scPlot&&W4.sector==='BASE'&&!(W4.cons&&W4.cons.length)){W4.plotT=(W4.plotT||0)+1;if(W4.plotT>60){scPlots();return}}
  if(SW.quest===3&&!SW.lessons.scBuild&&W4.sector==='BASE'&&SW.lessons.scSend){SW.beats.caught=1;W4.buildT=(W4.buildT||0)+1;if(W4.buildT>40){scBuild();return}}
  if(wOp()===0&&!SW.beats.wake){SW.beats.wake=1;SW.beats.first=1;scIntro();return}
  if(wOp()===1&&!SW.beats.three){SW.beats.three=1;SW.beats.carry=1;SW.beats.first=1;scBerries();return}
  if(wOp()===2)SW.beats.lit=1;if(SW.party.length&&!SW.lessons.scSend&&wOp()>=3&&W4.sector==='BASE'){W4.sendT=(W4.sendT||0)+1;if(W4.sendT>45)scSend()}}
 const F=W4.fld;if(F&&F.id==='MEADOW'&&!SW.lessons.scMeadow&&SW.quest>=2){F.scT=(F.scT||0)+1;if(F.scT>20)scMeadow(F)}}
/* a seed of light arcs from the Lantern to you when it grows a sprout */
function scSeed(ty){(W4.seedFx=W4.seedFx||[]).push({t:0,ty})}
function scWorldFx(){scArrow();scDabFx();if(!W4.seedFx)return;for(const fx of W4.seedFx){fx.t+=1/60;const k=Math.min(1,fx.t/1.1),x=240+(P3.x-240)*k,y=40+(P3.y-8-40)*k-Math.sin(k*3.1416)*46,T=TYPES[fx.ty];
  for(let i=1;i<5;i++){const k2=Math.max(0,k-i*.035),x2=240+(P3.x-240)*k2,y2=40+(P3.y-8-40)*k2-Math.sin(k2*3.1416)*46;g.globalAlpha=.6-i*.12;r(T.l,Math.round(x2),Math.round(y2),2,2)}
  g.globalAlpha=1;r('#ffffff',Math.round(x)-2,Math.round(y)-2,5,5);r(T.c,Math.round(x)-1,Math.round(y)-1,3,3)}
 W4.seedFx=W4.seedFx.filter(fx=>fx.t<1.1)}
/* ---------------- raising a building (v6.4) ----------------
   Placing a building no longer pops it into being: a scaffold goes up,
   your sprouts hop on it with hammers, base buddies walk over to help,
   and it rises over a few seconds. More helpers, faster build. */
function scConStart(b,def,first){W4.cons=W4.cons||[];W4.cons.push({b,def,first,t:0,need:9+Object.values(def.cost||{}).reduce((a,v)=>a+v,0)*.45});b.con=1;
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
 if(hh>0){const sv=g.save.bind(g);sv();g.beginPath();g.rect(x-12,y+20-hh,46,hh+2);g.clip();if(b.k==='datacenter')dcDraw(b);else wDrawBuilding0(b);g.restore()}
 /* scaffold poles and planks */
 r('#8a6a48',x-6,y-12,2,32);r('#8a6a48',x+24,y-12,2,32);r('#a8865c',x-7,y+18-hh,34,2);r('#a8865c',x-7,y-2,34,1);
 /* three sprouts on the job */
 const F=W4.bf,ts=F?F.sq.slice(0,3).map(s=>s.type):[0,2,4];
 ts.forEach((ty,i)=>{const T=TYPES[ty],sx=x-4+i*13,hop=((time*6+i*2)|0)%2,sy=y+18-hh-6-hop*2;
  r(K,sx-1,sy-1,6,7);r(T.c,sx,sy,4,5);r(T.l,sx+1,sy,2,1);
  const sw2=((time*8+i)|0)%2;r('#8a6a48',sx+4,sy-3+sw2,1,4);r('#c8ccd4',sx+3,sy-4+sw2,3,2)});
 const pct=Math.round(k*100)+'%';r('rgba(10,14,8,.75)',x+10-tw(pct,1)/2-2,y-24,tw(pct,1)+4,9);text(pct,x+10-tw(pct,1)/2,y-23,1,'#ffd94d',null)}
/* ---------------- the cottage party (v7.1) ----------------
   The first roof at Sunkeep gets celebrated properly: Marcus brings
   out the rig, heats it, rips it, yells his line, and hands it over. */
function scDab(){SW.lessons.scDab=1;const pal=SW.keeper==='MARCUS'?'WILL':'MARCUS',me=SW.keeper||'WILL',c=(W4.cast||[]).find(q=>q.who===pal);
 const put=()=>{if(c){c.x=P3.x+26;c.y=P3.y+2;c.tx=c.x;c.ty=c.y;c.dir=[-1,0];c.mv=false;c.t=30}P3.ax=1;P3.ay=0;W4.dab={x:P3.x+13,y:P3.y+3,ph:0,t:0,puffs:[]}},
  ph=n=>()=>{if(W4.dab){W4.dab.ph=n;W4.dab.t=0}if(n===1)swSnd(180,.9,420);if(n===2||n===4){swSnd(140,.5,60);swSnd(900,.08,300)}};
 scStart([{hold:.9,fn:put},
  {who:pal,txt:'A ROOF! We built a HOUSE, bro. You know what this calls for.'},
  {hold:1.9,fn:ph(1)},
  {hold:1.5,fn:ph(2)},
  {who:pal,txt:'SEE ONE, SEND ONE, MY J!!!'},
  {hold:1.0,fn:ph(3)},
  {hold:1.6,fn:ph(4)},
  {who:me,self:1,txt:'*cough* ...send one. *cough*'},
  {who:'LOUIE',txt:'(sneezes) Woof.'},
  {who:pal,txt:"That's my guy. Dap me up. Waterpark is next, bro."},
  {hold:.5,fn:()=>{if(W4.dab)W4.dab.ph=5}}],()=>{W4.dab=null;if(c)c.t=0;swSave()})}
function scDabFx(){const d=W4.dab;if(!d)return;d.t+=1/60;const x=Math.round(d.x),y=Math.round(d.y),K='#14101e',t=d.t;
 /* the rig: base, can, neck, mouthpiece, banger */
 r('rgba(0,0,0,.25)',x-5,y+1,11,3);r(K,x-4,y-3,9,5);r('#9ad8e8',x-3,y-2,7,3);r('#d8f4fc',x-3,y-2,7,1);
 r(K,x-2,y-11,5,9);r('#b8e8f4',x-1,y-10,3,8);r('#58b8d8',x-1,y-5-((time*6)|0)%2,3,3);
 r(K,x-1,y-17,3,7);r('#d8f4fc',x,y-16,1,6);
 r(K,x+3,y-9,5,2);r('#c8ccd4',x+3,y-8,4,1);r(K,x+6,y-12,4,4);const hot=d.ph===1?Math.min(1,t/1.6):d.ph>=2&&d.ph<5?.6:0;
 r(hot>.8?'#fff3b0':hot>.4?'#f8902c':hot>0?'#a85a3a':'#c8ccd4',x+7,y-11,2,2);
 if(d.ph===1){const f=((time*14)|0)%2;r('#58a0f0',x+11,y-13+f,2,3);r('#fff3b0',x+10,y-11,2,1);r(K,x+12,y-10,3,6);r('#e04838',x+13,y-9,1,4)} /* torch */
 /* who is hitting it: partner on the right (ph 2), you on the left (ph 4) */
 const src=d.ph===2?[x+12,y-18]:d.ph===4?[x-12,y-18]:null;
 if(src&&t<1.3&&((t*30)|0)!==(((t-1/60)*30)|0))for(let i=0;i<(d.ph===4?3:2);i++)d.puffs.push({x:src[0]+Math.random()*6-3,y:src[1],vx:(d.ph===2?1:-1)*(4+Math.random()*10),vy:-8-Math.random()*10,r:2+Math.random()*2,t:0});
 for(const p of d.puffs){p.t+=1/60;p.x+=p.vx/60;p.y+=p.vy/60;p.vx*=.985;p.r+=5/60;const a=Math.max(0,.75-p.t*.28);g.globalAlpha=a;const rr=Math.round(p.r);r('#eef4f0',Math.round(p.x)-rr,Math.round(p.y)-rr,rr*2,rr*2);r('#ffffff',Math.round(p.x)-rr+1,Math.round(p.y)-rr,rr,1);g.globalAlpha=1}
 d.puffs=d.puffs.filter(p=>p.t<2.6)}
/* ---------------- the cottage party, as a cinematic (v7.1) ----------------
   Full screen, in the style of the fighter's super cut-ins and finishers:
   portrait cut-in on a slanted band, the rig heating up, Marcus's rip with
   his line slammed on screen a piece at a time, Will's turn, the dap, and
   a rank splash. Uses the fighter's own Will and Marcus art. A skips. */
function dabStart(){SW.lessons.scDab=1;if(!(typeof KO!=='undefined'&&KO&&KO._)){scDab();return}W4.dabC=0;W4.talk=null;W4.quips=[];W4.quipQ=[];state='g4dab';swSave()}
function dabUpdate(dt){const t0=W4.dabC||0;W4.dabC=t0+dt;const t=W4.dabC,at=a=>t0<a&&t>=a;
 if(at(.02)){swSnd(110,.4,55);swSnd(880,.12,1760)}if(at(.25))swSnd(330,.2,165);
 if(at(1.0))swSnd(180,1.5,480);if(at(2.45))swSnd(988,.1,1319);
 if(at(2.6)){swSnd(140,.7,50);swSnd(1200,.1,300)}for(const a of [3.0,3.35,3.7])if(at(a))swSnd(a>3.6?150:220,.16,70);
 if(at(4.3)){swSnd(110,.3,55);swSnd(880,.12,1760)}if(at(4.9))swSnd(140,.7,50);for(const a of [5.2,5.45,5.7])if(at(a))swSnd(320,.07,180);
 if(at(6.0)){swSnd(523,.1,523);swSnd(784,.14,784)}if(at(6.5)){swSnd(988,.1,988);swSnd(1319,.45,1319)}
 if((pressed('a')&&t>1.2)||pressed('start'))W4.dabC=Math.max(t,8.3);
 if(W4.dabC>=8.3){W4.dabC=null;state='g4world'}}
function dabRig(x,y,sc,hot,torch){g.save();g.translate(x,y);g.scale(sc,sc);const K='#14101e';
 r('rgba(0,0,0,.3)',-6,1,13,3);r(K,-5,-4,11,6);r('#9ad8e8',-4,-3,9,4);r('#d8f4fc',-4,-3,9,1);
 r(K,-3,-13,7,10);r('#b8e8f4',-2,-12,5,9);r('#58b8d8',-2,-6-((time*6)|0)%2,5,3);r('#eaf8fc',-2,-12,1,6);
 r(K,-2,-21,5,9);r('#d8f4fc',-1,-20,3,8);r(K,4,-10,6,3);r('#c8ccd4',4,-9,5,1);r(K,8,-14,5,5);
 r(hot>.85?'#fff3b0':hot>.45?'#f8902c':hot>0?'#a85a3a':'#c8ccd4',9,-13,3,3);
 if(hot>.45){g.globalAlpha=.35+.2*Math.sin(time*20);r('#f8902c',7,-15,7,7);g.globalAlpha=1}
 if(torch){const f=((time*16)|0)%2;r('#58a0f0',13,-16+f,3,4);r('#fff3b0',12,-13,3,2);r(K,15,-12,4,8);r('#e04838',16,-11,2,6);r('#c8ccd4',15,-13,4,2)}
 g.restore()}
function drawDab(){const KC=KO._,C=KC.CH,mi=C.findIndex(c=>c.id==='marcus'),wi=C.findIndex(c=>c.id==='will'),M=C[mi],Wl=C[wi],t=W4.dabC||0,cy=Math.round(H/2),K='#141018';ox=0;oy=0;
 const disc=(x,y,rr,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,rr,0,7);g.fill()},
  stripes=(a,b)=>{r(a,0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.3);for(let i=-12;i<12;i++)r(b,-W,i*28+((time*40)%28),W*2,12);g.restore()},
  lines=(x,y,col,n)=>{g.save();g.translate(x,y);for(let i=0;i<n;i++){g.rotate(6.283/n+.07*Math.sin(i*7));const d0=46+((i*37+time*400)%60);r(col,d0,-1,220,i%3?2:4)}g.restore()},
  puff=(x,y,rr,a)=>{if(a<=0)return;g.globalAlpha=a;disc(x,y,rr,'#dfe8e2');disc(x-rr*.25,y-rr*.25,rr*.7,'#ffffff');g.globalAlpha=1},
  slam=(s,y,sc,c,t1)=>{if(t<t1)return;const k=Math.min(1,(t-t1)/.12),z=sc*(1+(1-k)*1.4),sh=t-t1<.25?Math.round(Math.sin(t*120)*3):0;g.save();g.translate(W/2+sh,y);g.scale(z/sc,z/sc);const w=tw0(s,sc);text0(s,-w/2+2,2,sc,K,null);text0(s,-w/2,0,sc,c,null);g.restore()},
  cut=(tt,c,img,band,l1,l2,sub,right)=>{const e=Math.min(1,tt/.18),sl=Math.round((1-e)*W);r('#0c0810',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(right?.3:-.3);
   r(c.bg,-W+sl*1.5,-66,W*2,24);r(c.bg,-W-sl*1.5,42,W*2,24);r(band,-W-sl,-36,W*2,72);r(K,-W+sl,-32,W*2,4);r(K,-W+sl,28,W*2,4);
   for(let i=0;i<70;i++){const px=-W+((i*29+tt*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.22)',Math.round(px),py,3,3)}g.restore();
   const S_=5,hw=img.width*S_,hh=img.height*S_,px=Math.round(W/2-hw/2+(right?-1:1)*(1-e)*130),py=Math.round(cy-hh/2-18+(tt>.22&&tt<.3?Math.sin(tt*200)*3:0));
   g.imageSmoothingEnabled=false;r(K,px-5,py-5,hw+10,hh+10);r('#ffffff',px-3,py-3,hw+6,hh+6);r(c.bg,px,py,hw,hh);g.drawImage(img,px,py,hw,hh);
   const bx=px+hw-2,by=py-6;disc(bx,by,12,K);disc(bx,by,10,'#f8e040');text0('S',bx-6,by-8,4,K,null);
   if(tt>.22){ctext0(l1,py+hh+12,4,'#ffffff',K);if(l2)ctext0(l2,py+hh+30,4,'#f8e060',K);ctext0(sub,py+hh+52,1,'#f8e060',null)}
   g.save();g.globalAlpha=.3;g.translate(Math.round((tt/.6)*(W+140))-70,0);g.rotate(.3);r('#ffffff',-8,-40,12,H+80);g.restore();if(tt<.05)r('#ffffff',0,0,W,H)};
 if(t<1.0)cut(t,M,M.head,'#f8c030','ROOF','RAISED','CELEBRATION  -  MARCUS',false);
 else if(t<2.6){const u=(t-1.0)/1.6,hot=Math.min(1,u*1.15);stripes('#10141c','#18202c');
  KC.poser(wi,46,H-44,1,Wl.ps.st,2.3);KC.poser(mi,W-46,H-44,-1,M.ps.st,2.3);
  for(let i=4;i>0;i--)disc(W/2+22,cy-22,10+i*7*hot,'rgba(248,144,44,'+(.06*hot).toFixed(3)+')');
  dabRig(W/2-6,cy+34,4,hot,u<.92);
  const bw=120,bx=Math.round(W/2-bw/2);r(K,bx-2,36,bw+4,12);r('#2a2838',bx,38,bw,8);r(hot>=1?'#fff3b0':'#f8902c',bx,38,Math.round(bw*hot),8);
  ctext0(hot>=1?(((time*8)|0)%2?'READY':''):'HEATING THE RIG',22,2,hot>=1?'#fff3b0':'#f8e060',K);
  if(t<1.12)r('rgba(255,255,255,'+(1-(t-1)/.12).toFixed(2)+')',0,0,W,H)}
 else if(t<4.3){const u=t-2.6,sh=u<.5?Math.round(Math.sin(t*90)*3):0;r('#0c1420',0,0,W,H);lines(60,cy-40,'rgba(56,136,224,.5)',34);lines(60,cy-40,'rgba(255,255,255,.18)',17);
  g.save();g.translate(14+sh,cy-118);g.scale(7,7);g.imageSmoothingEnabled=false;g.drawImage(M.head,0,0);g.restore();
  for(let i=0;i<26;i++){const b=u*1.15-i*.045;if(b<=0)continue;const k=Math.min(1,b),x=96+k*(60+((i*53)%150)),y=cy-70+Math.sin(i*2.3)*26-k*((i*17)%60)+b*6;puff(x,y,6+k*(10+(i*7)%16),Math.max(0,.85-b*.42))}
  slam('SEE ONE,',cy+26,4,'#ffffff',3.0);slam('SEND ONE,',cy+58,4,'#f8e060',3.35);slam('MY J!!!',cy+94,5,'#f85040',3.7);
  if(u<.14)r('rgba(255,255,255,'+(1-u/.14).toFixed(2)+')',0,0,W,H)}
 else if(t<5.9){const u=t-4.3;if(u<.62)cut(u,Wl,Wl.headL||Wl.head,'#58a0f0','YOUR','TURN','WILL  -  '+Wl.tag,true);
  else{const v=u-.62;r('#0c1420',0,0,W,H);lines(W-60,cy-40,'rgba(255,255,255,.2)',30);
   g.save();g.translate(W-14-(Wl.head.width*7),cy-118);g.scale(7,7);g.imageSmoothingEnabled=false;g.drawImage(Wl.headL||Wl.head,0,0);g.restore();
   for(let i=0;i<34;i++){const b=v*1.3-i*.03;if(b<=0)continue;const k=Math.min(1,b),x=W-96-k*(50+((i*47)%170)),y=cy-66+Math.sin(i*1.9)*30-k*((i*13)%70)+b*8;puff(x,y,7+k*(12+(i*5)%20),Math.max(0,.9-b*.4))}
   const cg=(s,x,y,t1)=>{if(t<t1)return;const k=Math.min(1,(t-t1)/.1),w=tw0(s,2);g.save();g.translate(x,y);g.rotate((x<W/2?-1:1)*.12);g.scale(1+(1-k),1+(1-k));r(K,-w/2-5,-3,w+10,20);r('#ffffff',-w/2-4,-2,w+8,18);text0(s,-w/2,1,2,'#c01848',null);g.restore()};
   cg('*COUGH*',70,cy+30,5.2);cg('*COUGH*',150,cy+62,5.45);cg('*COUGH!!*',96,cy+96,5.7)}}
 else{const u=t-5.9;stripes('#3a2a08','#5a4010');lines(W/2,cy+10,'rgba(248,224,96,.25)',26);
  KC.poser(wi,W/2-62,H-40,1,u<.1?Wl.ps.st:Wl.ps.p3,2.2);KC.poser(mi,W/2+62,H-40,-1,u<.1?M.ps.st:M.ps.p3,2.2);
  if(u>.1&&u<.55){const k=(u-.1)/.45;for(let i=0;i<8;i++){const a=i*.785;for(let d=6;d<10+k*30;d+=3)r(i%2?'#f8a030':'#ffffff',Math.round(W/2+Math.cos(a)*d),Math.round(H-128+Math.sin(a)*d),3,3)}}
  slam('DAP.',H-176,5,'#ffffff',6.05);
  if(u>.6){const k=Math.min(1,(u-.6)/.15),rr=Math.round(26*(2-k));disc(W/2,44,rr+3,K);disc(W/2,44,rr,'#f8e040');const z=5*(2-k);g.save();g.translate(W/2,44);g.scale(z/5,z/5);text0('S',-tw0('S',5)/2,-13,5,K,null);g.restore();
   if(u>.8){ctext0('SESH RANK',78,2,'#f8e060',K);ctext0('COTTAGE COMPLETE',94,2,'#ffffff',K)}if(u>1.3)ctext0('LOUIE: (sneezes)',H-22,1,'#f0d8b0',null)}
  for(let i=0;i<10;i++)puff(((i*61+time*14)%(W+60))-30,30+((i*37)%(H-80)),10+(i*7)%14,.16);
  if(u<.1)r('rgba(255,255,255,'+(1-u/.1).toFixed(2)+')',0,0,W,H)}
 r('#000000',0,0,W,8);r('#000000',0,H-8,W,8);if(t>1.2&&t<7.6){const s='A  SKIP';text0(s,W-6-tw0(s,1),H-7,1,'#6a6880',null)}}
