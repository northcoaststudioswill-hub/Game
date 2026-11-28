/* =====================================================================
   ROOTDEEP 64 — models & scenes
   The same cast, rebuilt as chunky low-poly figures from the colours of
   their Sprouts sprites (Will's acorn cap and teal coat, Erin's red hair
   and purple dress, Marcus's blue cap, beard and orange shirt, Ranger's
   brim hat, Scout's green hood and goggles, Louie the shiba), the six
   sprout types from Sprouts' TYPES table, Rootdeep's six foes and three
   bosses, and the Hearth and the three biomes as real rooms.
   ===================================================================== */
'use strict';
const MESH={},ROOM={};let TEXGLOW=null;
const K='#282038',SKIN='#f8dcb0',BOOT='#583828';
function buildMeshes(){let b;
 b=new MB();b.quad([-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0],'#ffffff',0,0,0,[0,0,1,0,1,1,0,1]);MESH.quad=b.done();
 {const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32);TEXGLOW=mkTex(c,true)}
 b=new MB();for(let i=0;i<14;i++){const a0=i/14*6.2832,a1=(i+1)/14*6.2832;b.p(0,0,0,0,1,0,[1,1,1]);b.p(Math.cos(a1),0,Math.sin(a1),0,1,0,[1,1,1]);b.p(Math.cos(a0),0,Math.sin(a0),0,1,0,[1,1,1])}MESH.disc=b.done();
 b=new MB();for(let i=0;i<20;i++){const a0=i/20*6.2832,a1=(i+1)/20*6.2832,r=.84;
  b.quad([Math.cos(a1)*r,0,Math.sin(a1)*r],[Math.cos(a1),0,Math.sin(a1)],[Math.cos(a0),0,Math.sin(a0)],[Math.cos(a0)*r,0,Math.sin(a0)*r],'#ffffff')}MESH.ring=b.done();
 /* slash arc: a fan in front (+z) of the keeper */
 b=new MB();for(let i=0;i<8;i++){const a0=-1+i/8*2,a1=-1+(i+1)/8*2,r=.5,f0=[.4,.4,.4],f1=[1,1,1];
  b.quad([Math.sin(a0)*r,0,Math.cos(a0)*r],[Math.sin(a0),0,Math.cos(a0)],[Math.sin(a1),0,Math.cos(a1)],[Math.sin(a1)*r,0,Math.cos(a1)*r],f0,f1,f1,f0)}MESH.arc=b.done();
 b=new MB();b.box(0,0,0,1,1,1,'#ffffff');MESH.cube=b.done();
 b=new MB();b.sph(0,0,0,1,1,1,8,6,'#ffffff');MESH.sph=b.done();
 b=new MB();b.cyl(0,0,0,1,1,1,8,'#ffffff');MESH.cyl=b.done();
 b=new MB();b.cyl(0,0,0,1,0,1,6,'#ffffff');MESH.cone=b.done();
 buildCast();buildFoes();buildBuds();buildProps()}

/* ---------- the cast ---------- */
const CAST={};
function buildCast(){let b;
 CAST.WILL=human({top:'#30a898',top2:'#78e0c8',pant:'#2a8a7c',belt:'#583828',head:b=>{b.sph(0,6.4,-.2,5.5,3.9,5.4,8,5,'#9a5a2c','#c88848');b.box(0,5.5,4.7,7.2,1,3.2,'#9a5a2c','#c88848');b.sph(0,10,0,.9,.9,.9,5,3,'#c88848')}});
 CAST.ERIN=human({dress:1,top:'#9070d0',top2:'#c0a8f0',pant:SKIN,sleeve:'#9070d0',sleeve2:'#c0a8f0',head:b=>{b.sph(0,5.6,-1.1,5.7,5.4,5.3,8,6,'#b84828','#e87848');b.box(0,1.2,-3.8,8.4,7.6,2.6,'#b84828','#e87848');b.box(-4.6,3,1,1.5,5.5,3,'#b84828','#e87848');b.box(4.6,3,1,1.5,5.5,3,'#b84828','#e87848')}});
 CAST.MARCUS=human({top:'#e88020',top2:'#f8c060',pant:'#3a3a48',sleeve:'#e8e0d0',sleeve2:'#ffffff',head:b=>{b.sph(0,6.5,-.2,5.4,3.8,5.3,8,5,'#284878','#5080b8');b.box(0,5.6,4.9,7.4,1,3.6,'#284878');b.box(0,1.9,3.5,6.6,3,2.8,'#704828','#8a6038');b.box(-4,3,2,1.4,3.6,2.6,'#704828');b.box(4,3,2,1.4,3.6,2.6,'#704828')}});
 CAST.RANGER=human({top:'#506838',top2:'#88a060',pant:'#583828',belt:'#282038',skin:'#e8c098',head:b=>{b.cyl(0,6.7,0,8.2,8.2,.9,10,'#c8a060','#e8c888');b.cyl(0,7.4,0,4.6,3.9,3.6,8,'#c8a060','#e8c888');b.cyl(0,7.5,0,4.7,4.6,1.1,8,'#c03030')}});
 CAST.SCOUT=human({top:'#b89858',top2:'#e0c888',pant:'#8a7040',noeyes:1,head:b=>{b.sph(0,5.2,-.7,5.8,5.6,5.5,8,6,'#3c8840','#78c870');b.box(-2,4.7,4.5,2.6,2.3,.9,'#e0f8ff');b.box(2,4.7,4.5,2.6,2.3,.9,'#e0f8ff');b.box(0,4.7,4.4,1.6,.8,.7,K);b.box(-2,4.6,4.9,1,1.2,.4,K);b.box(2,4.6,4.9,1,1.2,.4,K)}});
 /* Louie: quadruped. body / head / leg / tail */
 const L={},o='#e89040',e='#fff0d8',k='#30201c';
 b=new MB();b.box(0,0,0,7.6,5.8,11,o,'#f0a050');b.box(0,-2.4,.6,6,1.4,9,e);b.box(0,-.4,5,6.4,4.6,2,e);L.body=b.done();
 b=new MB();b.box(0,0,1,6.4,5.6,5.6,o,'#f0a050');b.box(0,-1.1,4.6,3.6,2.9,3,e);b.box(0,-.2,6.2,1.5,1.2,.9,k);b.box(-2.9,-1,2.2,.9,2.4,3,e);b.box(2.9,-1,2.2,.9,2.4,3,e);
 b.box(-1.7,1,3.9,1,1.4,.5,k);b.box(1.7,1,3.9,1,1.4,.5,k);
 b.cyl(-2.2,2.6,.2,1.5,0,3,4,o,k);b.cyl(2.2,2.6,.2,1.5,0,3,4,o,k);L.head=b.done();
 b=new MB();b.box(0,-2.3,0,1.9,4.6,1.9,o);b.box(0,-4.2,.2,2,.9,2.2,e);L.leg=b.done();
 b=new MB();b.sph(0,2,-1,1.7,2.4,2.4,6,4,o,e);b.sph(0,3.6,.4,1.4,1.4,1.6,5,3,e);L.tail=b.done();
 CAST.LOUIE=L;
 /* weapons, held in the right hand, pointing +z */
 b=new MB();b.box(0,0,5.6,.9,2.2,9.8,'#f8b8d4','#ffffff');b.box(0,0,.6,3.4,1.2,1,'#ffd94d');b.box(0,0,-.6,1,1,2.2,BOOT);MESH.blade=b.done();
 b=new MB();b.box(0,0,3,1.2,1.2,10,'#7a4a28');b.box(0,0,8.2,5.4,5.4,4.8,'#5a4030','#8a6a48');b.box(0,0,8.2,5.8,2,5,'#3a2c22');MESH.maul=b.done();
 b=new MB();b.box(0,3.4,1.6,.9,4,.9,'#6e8a3a');b.box(0,-3.4,1.6,.9,4,.9,'#6e8a3a');b.box(0,0,2.6,1.1,3.6,1,'#8aa850');b.box(0,0,.6,.3,10.4,.3,'#e8e0d0');MESH.bow=b.done();
 /* shadow crown for the Hollow Keeper */
 b=new MB();for(let i=0;i<5;i++){const a=i/5*6.2832;b.cyl(Math.cos(a)*3.4,0,Math.sin(a)*3.4,1,0,4,4,'#0c0a12','#e8e4f5')}MESH.crown=b.done()}
/* ---------- foes & bosses ---------- */
const FOE={};
function buildFoes(){let b;
 b=new MB();b.sph(0,3.6,-4,3.2,3,3.4,7,5,'#8858c8','#b890f0');b.sph(0,4.2,0,4.2,4,4,8,5,'#8858c8','#b890f0');b.sph(0,3.8,3.8,3.6,3.5,3.4,7,5,'#8858c8','#c8a8f8');
 b.box(-1.5,4.4,7,1.1,1.5,.6,'#241a30');b.box(1.5,4.4,7,1.1,1.5,.6,'#241a30');for(const z of[-4,0,3.5]){b.box(-3,.6,z,1.3,1.2,1.3,'#5a3a78');b.box(3,.6,z,1.3,1.2,1.3,'#5a3a78')}FOE.grub=b.done();
 b=new MB();b.cyl(0,0,0,1.7,1.2,7.5,6,'#3a7028','#58a038');b.sph(-3.4,2.2,0,3.2,.9,1.8,6,4,'#58a038');b.sph(3.4,2.2,0,3.2,.9,1.8,6,4,'#58a038');b.sph(0,.6,0,3,1.1,3,6,3,'#3a7028');FOE.spitterBody=b.done();
 b=new MB();b.sph(0,0,0,3.8,3.5,3.8,8,6,'#7ac74f','#a8e063');b.sph(0,-.2,3,2,1.8,1.4,6,4,'#e8ffd0');b.box(-2,1.8,2.6,1,1.2,.6,'#241a30');b.box(2,1.8,2.6,1,1.2,.6,'#241a30');b.cyl(0,3,0,1.4,0,2.6,5,'#a8e063');FOE.spitterHead=b.done();
 b=new MB();b.sph(0,4.4,-.6,6,4.2,7,8,6,'#6e5226','#a87f3f');b.box(0,7.4,-.6,.7,2.6,11,'#4a3517');b.sph(0,3.2,6.4,3.2,2.7,2.7,7,5,'#4a3517','#6e5226');
 b.box(-1.5,3.6,8.8,1,1.1,.6,'#181020');b.box(1.5,3.6,8.8,1,1.1,.6,'#181020');
 b.xf(0,4.4,8,-.9,0,0).cyl(0,0,0,1.2,0,6.5,5,'#e8e0d0','#ffffff').rst();
 for(const z of[-4,0,4]){b.box(-5.6,1,z,2.4,1.1,1.2,'#4a3517');b.box(5.6,1,z,2.4,1.1,1.2,'#4a3517')}FOE.beetle=b.done();
 b=new MB();b.sph(0,0,0,2.3,3.8,2.3,6,5,'#3a2c58','#6a5a96');b.box(-1,1.6,2,1.1,1.4,.6,'#f8e060');b.box(1,1.6,2,1.1,1.4,.6,'#f8e060');b.cyl(-1,3.2,.6,.3,.1,3,4,'#3a2c58');b.cyl(1,3.2,.6,.3,.1,3,4,'#3a2c58');FOE.shade=b.done();
 b=new MB();b.quad([0,-3,0],[8,-4.4,0],[9.4,3.4,0],[0,2.6,0],'#3a2c58','#6a5a96','#8a7ab6','#6a5a96');b.quad([0,-3,0],[0,2.6,0],[9.4,3.4,0],[8,-4.4,0],'#3a2c58','#6a5a96','#8a7ab6','#6a5a96');FOE.wing=b.done();
 b=new MB();b.sph(0,3.6,0,6.6,3.1,5,8,5,'#3f7f9f','#60b8f8');b.cyl(-2.2,5.6,3,.5,.5,2.6,4,'#3f7f9f');b.cyl(2.2,5.6,3,.5,.5,2.6,4,'#3f7f9f');b.sph(-2.2,8.6,3,1.1,1.1,1.1,5,3,'#181020');b.sph(2.2,8.6,3,1.1,1.1,1.1,5,3,'#181020');
 for(const z of[-2.6,0,2.6]){b.box(-6.8,1.2,z,3,1,1,'#3f7f9f');b.box(6.8,1.2,z,3,1,1,'#3f7f9f')}FOE.crab=b.done();
 b=new MB();b.sph(0,0,1.8,2.9,2.3,3.2,6,4,'#3f7f9f','#8ad0ff');b.box(0,1,5,1,.9,2.6,'#60b8f8');b.box(0,-1,5,1,.9,2.6,'#60b8f8');FOE.claw=b.done();
 b=new MB();b.sph(0,0,0,3.3,3.9,3.3,7,5,'#f07830','#f8a040');b.cyl(0,2.4,0,2.5,0,6,6,'#f8a040','#f8d030');b.sph(0,-.3,1.8,1.6,1.8,1.6,5,4,'#fff3b0');FOE.wisp=b.done();
 /* The Grub Mother: one segment, drawn five times */
 b=new MB();b.sph(0,8.5,0,10,8.5,6.2,9,6,'#7a52a8','#a87fd0');b.cyl(0,15.6,0,1.9,0,5,5,'#4a2c5c','#e8d8f8');b.box(-8.6,1,0,2.4,2,2.4,'#4a2c5c');b.box(8.6,1,0,2.4,2,2.4,'#4a2c5c');FOE.momSeg=b.done();
 b=new MB();b.sph(0,8,0,9,8,7,9,6,'#7a52a8','#c8a8f0');b.box(-3.6,10,6.2,2.4,3.2,1,'#1c1428');b.box(3.6,10,6.2,2.4,3.2,1,'#1c1428');b.box(-3.2,10.6,6.8,.9,1,.5,'#ffffff');b.box(4,10.6,6.8,.9,1,.5,'#ffffff');
 b.xf(-4.4,4,6,.5,.4,0).cyl(0,0,0,1.5,0,6,5,'#4a2c5c','#e8d8f8').rst();b.xf(4.4,4,6,.5,-.4,0).cyl(0,0,0,1.5,0,6,5,'#4a2c5c','#e8d8f8').rst();FOE.momHead=b.done();
 /* The Drowned King */
 b=new MB();b.cyl(0,0,0,12,9,12,10,'#3f8a9a','#5fb8c8');b.sph(0,12,0,9,7,9,10,6,'#5fb8c8','#8adce8');b.sph(0,5,7.4,7,5,3.6,8,5,'#bdeffb','#e6fbff');
 b.box(-3.4,14,7.2,2.6,3.4,1,'#ffffff');b.box(3.4,14,7.2,2.6,3.4,1,'#ffffff');b.box(-3.4,13.6,7.8,1.2,1.6,.5,'#102028');b.box(3.4,13.6,7.8,1.2,1.6,.5,'#102028');
 b.cyl(0,17.6,0,6.2,6.6,2.2,10,'#c8a020','#f8d030');for(let i=0;i<5;i++){const a=i/5*6.2832+.3;b.cyl(Math.cos(a)*5.8,19.6,Math.sin(a)*5.8,1.3,0,4,4,'#f8d030','#fff3b0')}
 for(let i=0;i<6;i++){const a=i/6*6.2832;b.sph(Math.cos(a)*11.6,1.6,Math.sin(a)*11.6,2.6,1.8,2.6,5,3,'#3f8a9a','#5fb8c8')}FOE.king=b.done()}
function drawFoe(e){const k=e.kind,fl=e.flash>0?.75:0,rise=e.born>0?clamp(1-e.born/.5,0,1):1;
 let o={add:fl};if(e.chill>0)o={add:fl,c:[.62,.85,1.25]};
 const x=e.x,z=e.y,hov=Math.sin(time*3+e.x*.5);
 /* rising out of the ground */
 const sink=(1-rise);
 if(k==='boss'){drawBoss(e,o);return}
 const sc=(e.elite?1.38:1)*1.15;
 shadow(x,z,e.r*1.25);
 mPush();mT(x,-sink*12,z);mRY(e.yaw||0);mS(sc);
 if(k==='grub'){const sq=1+Math.sin(time*9+e.x)*.08*(e.mv?1:.3);mS(1/sq,sq,sq);draw(FOE.grub,o)}
 else if(k==='spitter'){draw(FOE.spitterBody,o);mT(0,8.6+hov*.4,.6);if(e.spit>0){e.spit-=.016;mS(1.25,.8,1.25)}mRX(-.15);draw(FOE.spitterHead,o)}
 else if(k==='beetle'){if(e.state===1){mT(R(-.5,.5),0,-1.5);mRX(.18)}else if(e.state===2)mRX(-.12);draw(FOE.beetle,e.state===1?{add:fl+.25*(.5+.5*Math.sin(time*40)),c:o.c}:o)}
 else if(k==='shade'){mT(0,9+hov*1.2,0);draw(FOE.shade,o);const fp=Math.sin(time*16+e.x)*.7;
  mPush();mT(1.2,1,-.6);mRY(-.3);mRZ(fp*.6);draw(FOE.wing,o);mPop();mPush();mS(-1,1,1);gl.frontFace(gl.CW);mT(1.2,1,-.6);mRY(-.3);mRZ(fp*.6);draw(FOE.wing,o);gl.frontFace(gl.CCW);mPop()}
 else if(k==='crab'){mT(0,Math.abs(Math.sin(time*8+e.x))*.6,0);draw(FOE.crab,o);
  for(const s of[-1,1]){mPush();mT(s*6.4,4.2,3.2);mRY(s*-.5+Math.sin(time*5+s)*.2);draw(FOE.claw,o);mPop()}
  if(e.state===1){mT(0,4,0);mS(e.r+5.5);drawT(MESH.sph,{c:[.74,.94,1],a:.34+.08*Math.sin(time*6),unlit:true})}}
 else if(k==='wisp'){mT(0,7+hov*1.4,0);mRY(time*2);const fs=1+Math.sin(time*13+e.x)*.1;mS(fs,2-fs,fs);draw(FOE.wisp,{unlit:true,add:fl,c:o.c})}
 mPop();
 if(k==='wisp')sprite(x,8.5+hov*1.4,z,26,hex('#f8a040'),.3,true);
 if(e.burn>0)sprite(x+R(-2,2),10*sc+R(0,4),z,7,hex('#f8a040'),.8,true);
 if(e.root>0){mPush();mT(x,.4,z);mS(e.r+3);drawT(MESH.ring,{c:hex('#58c048'),a:.8,unlit:true});mPop()}
 if(e.elite)sprite(x,(k==='shade'||k==='wisp'?19:14)*sc+1.5+hov*.5,z,4.5,hex('#f8d030'),1,true)}
function drawBoss(e,o){const x=e.x,z=e.y,ix=e.bossIx,rise=e.born>0?clamp(1-e.born/.8,0,1):1;
 if(ix===0){shadow(x,z,17);mPush();mT(x,-(1-rise)*20,z);mRY(e.yaw||0);
  if(e.state===1)mT(R(-.8,.8),0,-3);
  const w=time*(e.mv?9:3);
  for(let i=3;i>=0;i--){mPush();mT(Math.sin(w+i*1.1)*1.4,Math.abs(Math.sin(w+i*.9))*1.2,-8-i*8.6);mS(1-i*.07);draw(FOE.momSeg,o);mPop()}
  mT(0,Math.abs(Math.sin(w))*1.2,2);draw(FOE.momHead,e.state===1?{add:(o.add||0)+.2,c:o.c}:o);mPop();return}
 if(ix===1){let px=x,pz=z,py=0;
  if(e.state===1){const t=clamp(1-e.t/.7,0,1);px=lerp(e.lx,e.tx,t);pz=lerp(e.ly,e.ty,t);py=Math.sin(t*3.14159)*70;
   mPush();mT(e.tx,.5,e.ty);mS(26);drawT(MESH.ring,{c:hex('#ff7a6b'),a:.5+.4*Math.sin(time*22),unlit:true});mPop();
   mPush();mT(e.tx,.45,e.ty);mS(26*t);drawT(MESH.disc,{c:hex('#ff7a6b'),a:.22,unlit:true});mPop();
   shadow(e.tx,e.ty,6+12*t)}
  else shadow(x,z,15);
  mPush();mT(px,py-(1-rise)*24,pz);mRY(e.yaw||0);const sq=1+Math.sin(time*4)*.04;mS(1/sq,sq,1/sq);draw(FOE.king,o);mPop();return}
 /* The Hollow Keeper: Will's own model, hollowed out */
 shadow(x,z,9);
 if(e.state===1){mPush();mT(x,.5,z);mS(12+8*Math.sin(time*30));drawT(MESH.ring,{c:hex('#e8e4f5'),a:.7,unlit:true});mPop()}
 const gh=e.state===2;
 drawCast('WILL',x,z,e.yaw||0,{id:'hollow',scale:1.55,c:e.chill>0?[.4,.5,.9]:[.3,.27,.42],add:(o.add||0)+(e.state===1?.25:.04),crown:1,weapon:'blade',dash:gh,wind:e.state===1,hurt:e.flash>0?1-e.flash/.12:-1,y:-(1-rise)*30});
 sprite(x-2.6,27,z+7,3,[1,1,1],.9,true);sprite(x+2.6,27,z+7,3,[1,1,1],.9,true)}

/* ---------- sprouts ---------- */
const BUD=[],PODM=[];
function buildBuds(){for(let t=0;t<6;t++){const T=TYPES[t],b=new MB();
  if(t===1)b.box(0,3.1,0,5.6,5.6,5.6,T.d,T.c);else b.sph(0,3.2,0,3.3,3.3,3.3,7,5,T.d,T.c);
  b.sph(-.9,5,1.6,1.3,.9,1,4,3,T.l);
  b.box(-1.3,3.1,3,.9,1.6,.6,'#181020');b.box(1.3,3.1,3,.9,1.6,.6,'#181020');
  b.cyl(0,6,0,.4,.3,2.6,4,'#2c6030');b.sph(1.3,8.8,0,1.7,.5,1,5,3,'#58c048');b.sph(-1.3,8.6,0,1.7,.5,1,5,3,'#3c8840');
  if(t===3){b.box(-4,3.6,0,1.6,2.4,.5,'#ffffff');b.box(4,3.6,0,1.6,2.4,.5,'#ffffff')}
  if(t===4){b.sph(-3.6,3.4,0,1.5,2,.8,5,3,T.d,T.c);b.sph(3.6,3.4,0,1.5,2,.8,5,3,T.d,T.c)}
  if(t===5){b.box(2,4.6,2.6,.8,.8,.4,'#ffffff');b.box(-2.2,2,2.4,.7,.7,.4,'#ffffff')}
  if(t===0)b.cyl(0,8.4,0,1.1,0,2.4,5,'#f8c070','#fff3b0');
  BUD.push(b.done());
  const p=new MB();p.sph(0,.4,0,4.6,1.7,4.6,7,3,'#3a2415','#5a3820');p.sph(0,2.4,0,2.3,2,2.3,6,4,T.d,T.c);p.cyl(0,4,0,.4,.3,2.6,4,'#2c6030');p.sph(1.2,6.6,0,1.6,.5,.9,5,3,'#58c048');PODM.push(p.done())}}
function drawBud(t,x,z,yaw,hop,sc){mPush();mT(x,hop||0,z);mRY(yaw||0);if(sc)mS(sc);draw(BUD[t]);mPop()}
function shadow(x,z,r){mPush();mT(x,.35,z);mS(r,1,r*.92);drawT(MESH.disc,{c:BLACK,a:.36,unlit:true});mPop()}

/* ---------- props & rooms ---------- */
const PROP={};
function rdTile(base,f1,f2,planks,v){const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d');
 x.fillStyle=base;x.fillRect(0,0,32,32);let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
 if(planks){for(let i=0;i<10;i++){x.fillStyle=i%2?f1:f2;x.fillRect((rnd()*30)|0,(rnd()*30)|0,2+rnd()*2,2)}
  x.fillStyle='rgba(0,0,0,.22)';x.fillRect(0,15,32,1);x.fillRect(0,31,32,1);x.fillRect(9,0,1,15);x.fillRect(23,16,1,15);
  x.fillStyle='rgba(255,255,255,.05)';x.fillRect(0,1,32,1);x.fillRect(0,17,32,1);return c}
 for(const sy of[0,16])for(const sx of[0,16]){
  x.fillStyle='rgba(255,255,255,.05)';x.fillRect(sx,sy,16,1);x.fillRect(sx,sy,1,16);
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(sx,sy+15,16,1);x.fillRect(sx+15,sy,1,16);
  for(let i=0;i<4;i++){x.fillStyle=i%2?f1:f2;x.fillRect(sx+2+((rnd()*12)|0),sy+2+((rnd()*12)|0),2,1)}}
 x.fillStyle='rgba(0,0,0,.20)';x.fillRect(0,0,32,1);x.fillRect(0,0,1,32);
 if(v===1){x.fillStyle='rgba(0,0,0,.13)';x.fillRect(3,5,13,8);x.fillRect(18,19,11,9);x.fillStyle='rgba(255,255,255,.05)';x.fillRect(19,4,9,6)}
 if(v===2){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(6,3,1,7);x.fillRect(7,9,5,1);x.fillRect(22,18,1,8);x.fillRect(19,25,4,1);x.fillStyle=f1;x.fillRect(24,6,2,2)}
 return c}
/* the cartridge's three slab variants, laid 2x2 into one repeating 64px texture, brightened for lighting */
function roomTex(base,f1,f2,planks,gain){const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');
 [[0,0,0],[32,0,1],[0,32,2],[32,32,0]].forEach(q=>x.drawImage(rdTile(base,f1,f2,planks,q[2]),q[0],q[1]));
 const d=x.getImageData(0,0,64,64);for(let i=0;i<d.data.length;i+=4){d.data[i]=Math.min(255,d.data[i]*gain);d.data[i+1]=Math.min(255,d.data[i+1]*gain);d.data[i+2]=Math.min(255,d.data[i+2]*gain)}x.putImageData(d,0,0);return mkTex(c)}
function buildRoom(key,base,f1,f2,planks,wall,gain,open){const tex=roomTex(base,f1,f2,planks,gain);const b=new MB(),G=20;
 /* floor: a vertex-lit grid, pooled bright in the middle and falling to gloom at the edges */
 const lum=(x,z)=>{const dx=(x-W/2)/(W*.62),dz=(z-H*.52)/(H*.66),d=Math.sqrt(dx*dx+dz*dz);const v=clamp(1.12-d*d*.62,.2,1.12)+Math.sin(x*.21+z*.13)*.04;return[v,v,v*1.02]};
 const x0=open?-200:0,x1=open?W+200:W,z0=open?-160:20,z1=open?H+160:H+4;
 for(let z=z0;z<z1;z+=G)for(let x=x0;x<x1;x+=G){const X=Math.min(x+G,x1),Z=Math.min(z+G,z1);
  b.quad([x,0,Z],[X,0,Z],[X,0,z],[x,0,z],lum(x,Z),lum(X,Z),lum(X,z),lum(x,z),[x/32,Z/32,X/32,Z/32,X/32,z/32,x/32,z/32])}
 if(!open){const wc=hex(wall),lo=shade(wc,1.9),hi=shade(wc,.75),top=shade(wc,.5),HN=48,HS=30;
  const wq=(a,b2,c,d,u0,u1,hh)=>b.quad(a,b2,c,d,lo,lo,hi,hi,[u0,hh/32,u1,hh/32,u1,0,u0,0]);
  wq([0,0,22],[W,0,22],[W,HN,22],[0,HN,22],0,W/32,HN);                    /* north */
  wq([6,0,H+4],[6,0,22],[6,HS,22],[6,HS,H+4],0,H/32,HS);                  /* west  */
  wq([W-6,0,22],[W-6,0,H+4],[W-6,HS,H+4],[W-6,HS,22],0,H/32,HS);          /* east  */
  b.quad([-60,HN,22],[W+60,HN,22],[W+60,HN,-70],[-60,HN,-70],top);        /* ledges fading into fog */
  b.quad([-70,HS,H+4],[6,HS,H+4],[6,HS,22],[-70,HS,22],top);b.quad([W-6,HS,H+4],[W+70,HS,H+4],[W+70,HS,22],[W-6,HS,22],top);
  /* buttresses, so the walls are not just planes */
  for(const x of[W*.2,W*.5,W*.8]){b.box(x,HN/2,23,10,HN,5,shade(wc,1.5),shade(wc,.6))}
  for(const z of[H*.36,H*.72]){b.box(7.5,HS/2,z,4,HS,9,shade(wc,1.5),shade(wc,.6));b.box(W-7.5,HS/2,z,4,HS,9,shade(wc,1.5),shade(wc,.6))}
  b.box(W/2,2,H+7,W,4,7,shade(wc,1.3),shade(wc,.9))}
 ROOM[key]={tex,mesh:b.done()}}
function buildProps(){let b;
 buildRoom('hub','#38262e','#423038','#2a1a20',true,'#46303a',2.5);
 buildRoom('burrows','#312226','#423038','#241619',false,'#3a2430',2.7);
 buildRoom('vault','#1a2a3a','#263c52','#121e2a',false,'#1d3448',3.1);
 buildRoom('core','#33191c','#472523','#221013',false,'#48201c',2.9);
 buildRoom('garden','#1c3a16','#2a5220','#12280e',false,'#14230f',2.6,true);
 /* debris */
 b=new MB();b.sph(0,1.6,0,3.4,2.4,2.8,6,4,'#3a3048','#6a5e80');b.sph(2.6,1,1.4,1.8,1.3,1.6,5,3,'#3a3048','#55496b');PROP.rock=b.done();
 b=new MB();for(const[x,z,r]of[[0,0,0],[1.6,.6,.5],[-1.4,.8,-.5],[.4,-1.4,.3]])b.xf(x,0,z,r*.4,0,r*.5).cyl(0,0,0,.7,0,5.4,4,'#3a7a20','#8ade40').rst();PROP.tuft=b.done();
 b=new MB();b.xf(0,0,0,.2,0,.25).cyl(0,0,0,2.2,0,9,5,'#2a9a8c','#b8fff0').rst();b.xf(2.4,0,1,-.3,0,-.4).cyl(0,0,0,1.5,0,5.5,5,'#2a9a8c','#b8fff0').rst();PROP.shard=b.done();
 b=new MB();b.box(0,.6,0,7,1.2,1.4,'#e8e0d0');b.sph(-3.6,.7,0,1.2,1,1.4,5,3,'#e8e0d0');b.sph(3.6,.7,0,1.2,1,1.4,5,3,'#e8e0d0');PROP.bone=b.done();
 b=new MB();b.sph(0,1.2,0,2.6,1.8,2.2,6,4,'#5a2010','#f07830');b.sph(.6,2.4,.2,1,.8,1,5,3,'#f8d030');PROP.ember=b.done();
 b=new MB();b.cyl(0,0,0,3.2,1.6,13,6,'#2a1a14','#5a4030');b.cyl(1,0,3,1.4,.6,7,5,'#2a1a14','#5a4030');PROP.stalag=b.done();
 /* obstacle: unit block with a lighter cap; scaled per obstacle */
 b=new MB();b.box(0,.42,0,1,.84,1,'#b8a8c0','#ffffff');b.box(0,.92,0,.9,.16,.9,'#ffffff');b.box(.2,1.05,.1,.36,.12,.4,'#e0d8e8');PROP.block=b.done();
 /* pickups */
 b=new MB();for(let i=0;i<5;i++){const a=i/5*6.2832;b.sph(Math.cos(a)*2,0,Math.sin(a)*2,1.7,.6,1.7,5,3,'#f070a8','#ffc0dc')}b.sph(0,.3,0,1.2,.8,1.2,5,3,'#ffd94d');PROP.petal=b.done();
 b=new MB();b.sph(0,0,0,2.3,2.3,2.3,6,5,'#4aa8d0','#bfeeff');b.cyl(0,1.4,0,1.9,0,3.4,6,'#7fd0e8','#e6f7ff');PROP.dew=b.done();
 b=new MB();b.sph(-1.5,1.2,0,2,2,1.5,6,4,'#d83868','#ff88a8');b.sph(1.5,1.2,0,2,2,1.5,6,4,'#d83868','#ff88a8');b.xf(0,.6,0,3.14159,0,0).cyl(0,0,0,3.3,0,3.6,6,'#f85888','#d83868').rst();PROP.heart=b.done();
 b=new MB();b.cyl(0,-2,0,2.6,2.6,4,6,'#c8842a','#f8b840');b.cyl(0,2,0,2.9,2.9,1,6,'#8a5a20');PROP.honey=b.done();
 /* reward door: frame takes the god's colour as a tint */
 b=new MB();b.box(-10,12,0,3.4,24,5,'#b8b8b8','#ffffff');b.box(10,12,0,3.4,24,5,'#b8b8b8','#ffffff');b.box(0,25,0,24,3.6,5.6,'#d8d8d8','#ffffff');b.cyl(0,26.6,2,2.6,0,4,4,'#ffffff');PROP.doorFrame=b.done();
 b=new MB();b.box(0,11.6,-1.2,17,23.2,1.4,'#0d0916','#241a38');PROP.doorDark=b.done();
 /* the Hearth's stations */
 b=new MB();b.box(0,10,0,10,17,1.8,'#6a4a22','#a8804a');b.box(0,10.3,.7,7.2,13.6,1,'#78b8d0','#e8fbff');b.box(-1.6,13.5,1.3,1.6,4,.3,'#ffffff');b.box(0,.9,0,7,1.8,5,'#6a4a22');PROP.mirror=b.done();
 b=new MB();b.box(0,1,0,13,2,5,'#5a3418','#7a4a28');b.box(-5.6,7,-1,1.2,12,1.2,'#5a3418');b.box(5.6,7,-1,1.2,12,1.2,'#5a3418');b.box(0,12,-1,12.4,1.2,1.2,'#7a4a28');
 b.box(0,9.5,.6,1.5,13,.8,'#c8d0e0','#ffffff');b.box(0,4,.6,4.6,1,1.2,'#f8c040');b.box(0,2.8,.6,1.2,2,1.2,'#7a4a28');
 b.xf(-3.6,6,.4,0,0,.5).box(0,0,0,1,9,1,'#7a4a28').rst();b.xf(3.6,6,.4,0,0,-.5).box(0,0,0,.8,9,.8,'#8aa850').rst();PROP.arm=b.done();
 b=new MB();for(const y of[1,6.5,12])b.box(0,y,0,14,1.2,5,'#6a4028','#8a5a38');b.box(-6.6,6.5,0,1.2,13,5,'#5a3418');b.box(6.6,6.5,0,1.2,13,5,'#5a3418');
 b.box(-3.4,8.4,.4,2.6,2.6,2.2,'#e88ab0');b.box(1,8.2,.4,2.2,2.2,2.2,'#8ac8e8');b.box(4.2,8,.4,1.6,1.8,1.6,'#98a0b0');b.box(-2.6,2.8,.4,2.4,2.4,2.2,'#c8586a');b.sph(2.6,3.2,.4,1.6,1.6,1.6,5,4,'#f8b840');PROP.keep=b.done();
 b=new MB();b.box(0,4,0,3,8,3,'#5a3418','#7a4a28');b.box(0,.6,0,7,1.2,6,'#5a3418');b.xf(0,9,.5,.6,0,0).box(0,0,0,10,1.6,7.6,'#7a2848','#a03a5c').box(0,.9,0,8.6,.5,6.4,'#f8f0d8').box(0,1.2,0,.4,.3,6.4,'#a03a5c').rst();PROP.codex=b.done();
 b=new MB();b.cyl(0,6,0,3.4,5.6,3.4,8,'#2c2028','#5a4a50');b.cyl(0,0,0,4.4,1.4,6,6,'#2c2028','#4a3428');b.cyl(0,9,0,4.8,4.8,.6,8,'#1a1014');PROP.heat=b.done();
 /* furniture */
 b=new MB();b.box(0,2.2,0,30,4.4,15,'#4a2c18','#6a4428');b.box(0,4.3,0,27,.9,12,'#2c1a0e','#3a2415');PROP.bed=b.done();
 b=new MB();b.cyl(0,0,0,2.8,3.6,5,6,'#8a4420','#b86a38');b.sph(0,8.6,0,4.6,4,4.6,7,5,'#2c7028','#68d050');b.sph(2.4,11.4,.6,2.6,2.2,2.6,6,4,'#3c8840','#78e060');PROP.plant=b.done();
 b=new MB();b.box(0,3.4,0,9,6.8,8,'#6a4428','#9a6838');b.box(0,3.4,0,9.4,1.2,8.4,'#4a2c18');b.box(0,6.9,0,9.4,.6,8.4,'#4a2c18');PROP.crate=b.done();
 b=new MB();b.box(0,6.4,0,17,1.2,9,'#6a4028','#8a5a38');for(const[x,z]of[[-7,-3.4],[7,-3.4],[-7,3.4],[7,3.4]])b.box(x,3,z,1.3,6,1.3,'#5a3a20');b.cyl(3,7,0,.7,.7,2.6,5,'#f8f0d8');PROP.table=b.done();
 b=new MB();b.box(0,5,0,1.8,10,1.8,'#3a2c22','#5a4030');b.cyl(0,10,0,1.6,2.6,2,5,'#2c2028');PROP.torch=b.done();
 /* the Great Lantern */
 b=new MB();b.box(0,5,0,7.4,8,7.4,'#f8c050','#fff2b0');PROP.lampGlass=b.done();
 b=new MB();b.box(0,9.8,0,9.4,1.6,9.4,'#4a3010','#6e4a20');b.box(0,.4,0,9.4,1.4,9.4,'#4a3010','#6e4a20');for(const[x,z]of[[-4,-4],[4,-4],[-4,4],[4,4]])b.box(x,5,z,1.2,9,1.2,'#6e4a20');b.cyl(0,10.4,0,3,0,3.4,4,'#6e4a20','#8a5f28');PROP.lampFrame=b.done();
 b=new MB();b.box(0,14,0,2.6,28,2.6,'#4a3010','#6e4a20');b.box(0,.8,0,7,1.6,7,'#4a3010');PROP.post=b.done();
 /* the Root Door: a hatch in the floor */
 b=new MB();b.box(0,.9,-8,26,1.8,3,'#5a3a20','#7a5030');b.box(0,.9,8,26,1.8,3,'#5a3a20','#7a5030');b.box(-11.6,.9,0,3,1.8,16,'#5a3a20','#7a5030');b.box(11.6,.9,0,3,1.8,16,'#5a3a20','#7a5030');
 for(let i=0;i<4;i++)b.box(0,-1.5-i*2.2,5-i*3.2,20,1.4,3.4,'#2c1a10','#4a3020');PROP.hatch=b.done();
 b=new MB();b.quad([-10,0,6.6],[10,0,6.6],[10,0,-6.6],[-10,0,-6.6],'#04100e');PROP.hatchDark=b.done();
 /* the big door of the intro's last scene */
 b=new MB();b.box(-27,40,0,10,80,10,'#241226','#3a2440');b.box(27,40,0,10,80,10,'#241226','#3a2440');b.box(0,84,0,66,12,11,'#2c1830','#44284a');b.box(0,39,-3,44,78,2,'#0c0612','#180a1c');b.box(0,36,-1.6,5,20,1.4,'#3d2b12','#6a4a20');b.box(0,36,-.8,2,3.4,.6,'#ffd94d');PROP.bigDoor=b.done();
 b=new MB();b.box(0,.3,0,112,.6,34,'#c8a04a');b.box(0,.5,0,106,.6,28,'#46222f','#552a3a');b.box(0,.7,0,60,.5,10,'#6a3448');PROP.rug=b.done()}

/* ---------- camera ---------- */
const CAM={x:W/2,z:H/2,d:1,init:false};
function camFollow(pts,solo,dt,fill){ /* frame the room; lean toward the keepers */
 let cx=W/2,cz=H*.5,sp=0;if(pts.length){cx=0;cz=0;for(const p of pts){cx+=p.x;cz+=p.y}cx/=pts.length;cz/=pts.length;for(const p of pts)sp=Math.max(sp,Math.abs(p.x-cx)/(W*.5),Math.abs(p.y-cz)/(H*.5))}
 const f=fill!==undefined?fill:clamp((solo?.56:.66)+sp*.5,.56,.98);
 const tx=lerp(W/2,cx,clamp(1.06-f,0,.6)*1.6),tz=lerp(H*.46,cz,clamp(1.06-f,0,.6)*1.5);
 const k=CAM.init?clamp(dt*3.2,0,1):1;CAM.x=lerp(CAM.x,tx,k);CAM.z=lerp(CAM.z,tz,k);CAM.d=lerp(CAM.d,f,k);CAM.init=true;
 const fov=.72,pitch=.8,halfW=(W*.5+16)*CAM.d,halfH=(H*.5+26)*CAM.d;
 /* distance that fits the framed width and depth at this aspect */
 const dW=halfW/(Math.tan(fov/2)*RN.asp),dH=halfH*Math.sin(pitch)/Math.tan(fov/2)*1.16;const D=Math.max(dW,dH)+30;
 let sx=0,sy=0;if(RUN&&RD.set.shake&&RUN.shake>.05){sx=R(-RUN.shake,RUN.shake)*.6;sy=R(-RUN.shake,RUN.shake)*.6}
 if(window.__cam){setCam(window.__cam[0],window.__cam[1],.5);return}
 setCam([CAM.x+sx,Math.sin(pitch)*D+sy,CAM.z+Math.cos(pitch)*D+8],[CAM.x+sx,4+sy,CAM.z+2],fov)}

/* ---------- scenes ---------- */
function drawRoomMesh(key,c){const r=ROOM[key];mPush();draw(r.mesh,{tex:r.tex,c:c||WHITE});mPop()}
function prop(m,x,y,z,ry,s,o){mPush();mT(x,y,z);if(ry)mRY(ry);if(s)mS(s);draw(m,o);mPop()}
function torch(x,z){prop(PROP.torch,x,0,z);const fl=Math.sin(time*9+x);sprite(x,14+fl*.4,z,7+fl,hex('#f8a040'),.95,true);sprite(x,14.5,z,26,hex('#f07830'),.22+.04*fl,true)}
function lantern(x,y,z,s){mPush();mT(x,y,z);mS(s||1);draw(PROP.lampFrame);draw(PROP.lampGlass,{unlit:true,add:.12+.06*Math.sin(time*7)});mPop();
 sprite(x,y+5*(s||1),z,46*(s||1),hex('#ffd94d'),.26+.05*Math.sin(time*2),true)}
function keeperOpts(p,run){const isL=p.char==='LOUIE';
 let help=false;if(run&&!p.down)for(const q of PL)if(q!==p&&q.down&&Math.hypot(q.x-p.x,q.y-p.y)<20)help=true;
 return{id:'p'+p.ix,weapon:run&&!isL?RD.weapon:null,combo:p.combo,nosit:run,
  atk:run&&p.swing>0?1-p.swing/(p.swingD||.3):-1,cast:run&&p.castA>0?1-p.castA/.45:-1,selfie:run&&p.selfieA>0?1-p.selfieA/.6:-1,
  hurt:run&&p.hurt>0?1-p.hurt/.25:-1,dash:run&&p.dashT>0,down:run&&p.down,cheer:run&&p.cheer>0?1-p.cheer/1.1:-1,land:run&&p.land>0?Math.max(0,1-p.land/.62):-1,help,
  add:p.hurt>0?.6:0,c:p.armT>0?[.8,.85,1]:null}}
function drawKeeper(p,run){const yaw=Math.atan2(p.ax||0,p.ay===undefined?1:p.ay);
 shadow(p.x,p.y,p.char==='LOUIE'?7:6.2);
 /* player ring, in their colour: the 4-player couch needs to know who is who */
 if(PL.length>1||run){mPush();mT(p.x,.5,p.y);mS(8.6);drawT(MESH.ring,{c:hex(PCOL[p.ix]),a:p.down?.35:.85,unlit:true});mPop()}
 if(run)for(const tr of p.trail){const a=tr.t/.22;drawCastGhost(p,tr,a)}
 const ko=keeperOpts(p,run);if(run&&p.inv>0&&p.dashT<=0&&!p.down&&!(p.land>0)&&((time*14)|0)%2)ko.hide=true;
 const S=drawCast(p.char,p.x,p.y,yaw,ko);
 /* a puff of dust each time a foot comes down at a run */
 if(run&&state==='run'&&S.sp>60&&!p.down){const st=Math.floor(S.ph/3.14159);if(st!==S.step){S.step=st;RUN.parts.push({x:p.x-(p.ax||0)*3,y:p.y-(p.ay||0)*3,vx:R(-7,7),vy:R(-7,7),z:1.5,vz:9,life:.28,c:'#6a5c6c',ng:1})}}
 if(run&&p.down){mPush();mT(p.x,.6,p.y);mS(20*clamp(p.revT/2.2,0.02,1));drawT(MESH.disc,{c:hex('#a8f080'),a:.3,unlit:true});mPop();
  mPush();mT(p.x,.55,p.y);mS(20);drawT(MESH.ring,{c:hex('#a8f080'),a:.5+.3*Math.sin(time*6),unlit:true});mPop()}
 if(run&&p.slashT>0&&!WEAPONS[RD.weapon].proj){const w=WEAPONS[RD.weapon],rg=p.char==='LOUIE'?Math.max(18,w.range-6):w.range;
  mPush();mT(p.x,9,p.y);mRY(yaw);mS(rg,1,rg);mRY((w.arc-2)*.0);drawT(MESH.arc,{c:hex(RUN.boons.atk?GODS[RUN.boons.atk.god].l:'#eaffea'),a:.85*p.slashT/.12,unlit:true,glow:true,nocull:true});mPop()}
 if(run&&p.selfie>0)sprite(p.x,16,p.y,90*(p.selfie/.18),[1,1,1],.8*p.selfie/.18,true)}
function drawCastGhost(p,tr,a){sprite(tr.x,10,tr.y,15,hex(PCOL[p.ix]),.3*a,true)}
function sceneHub(dt){setLight([.3,.9,.45],[.78,.66,.52],[.5,.42,.44]);setFog('#120a12',430,820);
 camFollow(PL,false,dt,PL.length<2?.8:.92);frameBegin();
 drawRoomMesh('hub');
 /* rug + stations along the back wall */
 prop(PROP.rug,W/2,0,H-44);
 for(const s of STATIONS){const locked=s.id==='heat'&&RD.stats.escapes<1;prop(PROP[s.id],s.x,0,29,0,1.15,locked?{c:[.4,.4,.45]}:null);shadow(s.x,31,8);
  if(s.id==='heat'&&!locked){const fl=Math.sin(time*10);sprite(s.x,15+fl*.5,29,9+fl,hex('#f8d030'),.95,true);sprite(s.x,16,29,30,hex('#f07830'),.3,true)}
  if(s.id==='mirror')sprite(s.x,12,31,22,hex('#a8d8e8'),.14+.05*Math.sin(time*2),true)}
 lantern(W/2,50,H*.42,1.5);
 torch(12,40);torch(W-12,40);torch(12,H*.62);torch(W-12,H*.62);
 /* sprout bed with everything you have banked */
 prop(PROP.bed,BED.x,0,BED.y-6,0,1.08);
 {const flat=[];for(let ty=0;ty<6;ty++)for(let i=0;i<(RD.bank[ty]||0);i++)flat.push(ty);
  flat.slice(0,10).forEach((ty,i)=>drawBud(ty,BED.x-11+(i%5)*5.6,BED.y-9+((i/5)|0)*6.4,Math.sin(time+i)*.4,5+Math.abs(Math.sin(time*3+i*1.3))*.6,.62))}
 prop(PROP.plant,22*HK,0,H-80);prop(PROP.plant,196*HK,0,H-126);prop(PROP.plant,70*HK,0,H-122,1);prop(PROP.plant,102*HK,0,H-128,2);
 prop(PROP.table,30*HK,0,H-62,.1);prop(PROP.crate,216*HK,0,H-80,.3);prop(PROP.crate,205*HK,0,H-118,-.2);prop(PROP.crate,180*HK,0,H-70,.1,.8);
 /* the Root Door */
 prop(PROP.hatch,DOOR.x,0,DOOR.y);mPush();mT(DOOR.x,-8.5,DOOR.y);draw(PROP.hatchDark,{unlit:true});mPop();
 sprite(DOOR.x,2,DOOR.y,44,hex('#58f0c0'),.3+.1*Math.sin(time*3),true);
 for(const who of NPCS){const n=HUBNPC[who];if(!n)continue;shadow(n.x,n.y,who==='LOUIE'?7:6);
  let lk=null,nd=70;for(const p of PL){const d=Math.hypot(p.x-n.x,p.y-n.y);if(d<nd){nd=d;lk=Math.atan2(p.x-n.x,p.y-n.y)}}
  drawCast(who,n.x,n.y,n.yaw||0,{id:'n'+who,npc:who,act:n.act>0,talk:state==='talk'&&talkNPC===who,look:lk,happy:nd<44});
  if(n.act>0)sprite(n.x,27+Math.sin(time*8)*1,n.y,4,hex('#fff3b0'),1,true)}
 for(const p of PL)drawKeeper(p,false);
 frameEnd()}
const BKEY=['burrows','vault','core'];
const BLIGHT=[[[.3,.9,.45],[.74,.6,.56],[.46,.4,.46],'#0e080e'],[[.25,.9,.4],[.5,.68,.86],[.34,.44,.56],'#060c14'],[[.3,.85,.45],[.95,.58,.4],[.5,.36,.34],'#120606']];
const DEBBY=[['rock','tuft','stalag'],['rock','bone','shard'],['rock','ember','shard']];
function sceneRun(dt){const B=RUN.biome,L=BLIGHT[B];setLight(L[0],L[1],L[2]);setFog(L[3],420,800);
 camFollow(alive(),PL.length<2,state==='run'?dt:0);frameBegin();
 drawRoomMesh(BKEY[B]);
 /* debris, seeded per chamber like the cartridge */
 for(let i=0;i<12;i++){const dx=(i*97+RUN.chamber*31)%(W-30)+15,dz=42+((i*57+RUN.chamber*19)%(H-66)),k=DEBBY[B][i%3];
  if(k==='stalag'){prop(PROP.stalag,i%2?10+(i*7)%6:W-10-(i*5)%6,0,dz,i);continue}
  prop(PROP[k],dx,0,dz,i*1.7,k==='rock'?.8+(i%3)*.25:1,k==='ember'||k==='shard'?{unlit:k==='ember',add:k==='ember'?.1+.1*Math.sin(time*4+i):0}:null)}
 /* biome ambience */
 for(let i=0;i<9;i++){const px=(i*67+RUN.chamber*31)%(W-30)+15,pz=36+((i*41+RUN.chamber*17)%(H-52));
  if(B===1){mPush();mT(px,.3,pz);mS(7+((i*5)%6),1,5+((i*3)%5));drawT(MESH.disc,{c:hex('#7fd0e8'),a:.16+.07*Math.sin(time*2+i),unlit:true});mPop()}
  else if(B===2){mPush();mT(px,.3,pz);mRY(i*1.3);mS(9,1,1.6);drawT(MESH.disc,{c:hex('#f07830'),a:.5+.3*Math.sin(time*4+i*1.7),unlit:true,glow:true});mPop();
   const t=(time*.4+i*.37)%1;sprite(px+Math.sin(time+i)*3,t*40,pz,2.2,hex('#f8a040'),(1-t)*.8,true)}
  else if(i<5){const t=(time*.12+i*.23)%1;sprite(px,30-t*30,pz,1.4,hex('#c8b8d8'),.35*(1-t),true)}}
 torch(12,36);torch(W-12,36);
 for(const o of RUN.obst){const hh=13+o.s*9;mPush();mT(o.x+o.w/2,0,o.y+o.h/2);mS(o.w,hh,o.h);draw(PROP.block,{c:B===1?[.3,.5,.66]:B===2?[.5,.26,.26]:[.5,.38,.5]});mPop();shadow(o.x+o.w/2,o.y+o.h/2+2,Math.max(o.w,o.h)*.62)}
 for(const z of RUN.zones){mPush();mT(z.x,.4,z.y);mS(z.r);drawT(MESH.disc,{c:hex('#f07830'),a:.42+.12*Math.sin(time*9),unlit:true,glow:true});mPop();sprite(z.x+R(-4,4),5+R(0,5),z.y,8,hex('#f8a040'),.7,true)}
 for(const h of RUN.hazards){const c=hex(h.from==='player'?'#dce2ea':'#ff7a6b');mPush();mT(h.x,.5,h.y);mS(h.r);drawT(MESH.ring,{c,a:.55+.35*Math.sin(time*16),unlit:true});mPop();
  if(h.from==='player'&&!h.instant){const t=clamp(h.t/(h.t0||.45),0,1);mPush();mT(h.x,t*150+7,h.y);mRY(time*5);mS(9,8,9);draw(MESH.sph,{c:[.6,.63,.7]});mPop();shadow(h.x,h.y,4+(1-t)*10)}}
 if(RUN.rings)for(const g of RUN.rings){const t=1-g.t/.3;mPush();mT(g.x,.6,g.y);mS(g.r*(.3+.7*t));drawT(MESH.ring,{c:hex(g.c),a:1-t,unlit:true,glow:true});mPop()}
 /* reward doors, set into the north wall */
 if(RUN.phase==='doors')for(const d of RUN.doors){const gc=hex(d.kind==='boon'?GODS[d.god].c:'#b8b0cc');
  prop(PROP.doorDark,d.x,0,26);prop(PROP.doorFrame,d.x,0,27,0,1,{c:gc,add:.08+.06*Math.sin(time*4+d.x)});
  sprite(d.x,13,29,40,gc,.26+.1*Math.sin(time*4+d.x),true);
  mPush();mT(d.x,.45,d.y+9);mS(12);drawT(MESH.ring,{c:gc,a:.7,unlit:true});mPop();
  if(d.hold>0){mPush();mT(d.x,.5,d.y+9);mS(12*clamp(d.hold/.6,0,1));drawT(MESH.disc,{c:gc,a:.4,unlit:true});mPop()}}
 for(const pd of RUN.pods){const bob=Math.sin(time*3+pd.x);prop(PODM[pd.type],pd.x,0,pd.y,time*.6,1.25);sprite(pd.x,5,pd.y,24+bob*3,hex('#a8f080'),.3+.1*bob,true)}
 for(const p of RUN.pickups){const bob=Math.sin(time*5+p.x)*1.2;shadow(p.x,p.y,2.6);
  prop(PROP[p.kind]||PROP.petal,p.x,(p.kind==='petal'?3.2:5)+bob,p.y,time*3+p.x,p.kind==='petal'?.75:1,p.kind==='dew'?{add:.12}:null);
  if(p.kind==='dew')sprite(p.x,5+bob,p.y,13,hex('#7fd0e8'),.3,true)}
 for(const e of RUN.enemies)drawFoe(e);
 for(const b of RUN.buds){shadow(b.x,b.y,3);drawBud(b.type,b.x,b.y,b.yaw||0,(b.mv?Math.abs(Math.sin(time*10+b.a*3))*1.8:0)+(b.hop>0?Math.sin(b.hop/.2*3.14)*4:0),b.cd>0&&b.type===1?.8:1)}
 for(const p of PL)drawKeeper(p,true);
 /* projectiles */
 const PC={arrow:'#b0f090',thorn:'#b0f090',fire:'#f07830',wave:'#7fd0e8',vine:'#58c048',wild:'#f078c0',laser:'#ffd94d',jet:'#7fd0e8',towel:'#f8f0d8',bud:'#ffffff'};
 for(const p of RUN.projs){const c=hex(p.c||PC[p.kind]||'#ffffff'),yaw=Math.atan2(p.vx,p.vy),y=p.small?7:10;
  if(p.kind==='laser'){mPush();mT(p.x,y,p.y);mRY(yaw);mS(3,3,26);draw(MESH.cube,{c:[1,.95,.6],unlit:true,add:.3});mPop();sprite(p.x,y,p.y,20,c,.5,true);sprite(p.x-p.vx*.04,y,p.y-p.vy*.04,13,[1,1,1],.4,true)}
  else if(p.kind==='jet'){mPush();mT(p.x,y,p.y);mRY(yaw);mS(2.6,2.6,22);draw(MESH.cube,{c:[.6,.9,1],unlit:true,add:.2});mPop();sprite(p.x,y,p.y,13,c,.5,true);sprite(p.x-p.vx*.05,y,p.y-p.vy*.05,9,c,.35,true)}
  else if(p.kind==='towel'){mPush();mT(p.x,y,p.y);mRY(yaw+Math.sin(time*40)*.5);mS(17,1.2,6);draw(MESH.cube,{c:[1,.97,.88]});mPop()}
  else if(p.kind==='wave'){mPush();mT(p.x,y-4,p.y);mRY(yaw);mS(15,1,10);drawT(MESH.arc,{c,a:.85,unlit:true,nocull:true});mPop();sprite(p.x,y,p.y,17,c,.4,true)}
  else if(p.kind==='fire'){sprite(p.x,y,p.y,p.small?7:13,c,.95,true);sprite(p.x,y,p.y,p.small?3:6,hex('#f8d030'),1,true)}
  else if(p.kind==='arrow'||p.kind==='thorn'||p.kind==='vine'){mPush();mT(p.x,y,p.y);mRY(yaw);mS(1.3,1.3,10);draw(MESH.cube,{c,unlit:true});mPop()}
  else{sprite(p.x,y,p.y,p.small?5:10,c,.95,true);if(!p.small)sprite(p.x,y,p.y,20,c,.3,true)}}
 for(const p of RUN.eprojs){mPush();mT(p.x,8,p.y);mS(3.2);draw(MESH.sph,{c:[1,.48,.42],unlit:true,add:.15});mPop();sprite(p.x,8,p.y,15,hex('#ff7a6b'),.4,true);shadow(p.x,p.y,2.4)}
 if(RUN.bolts)for(const b of RUN.bolts){const n=5;let x0=b.x,z0=b.y,y0=b.sky?150:10;const x1=b.sky?b.x:b.x2,z1=b.sky?b.y:b.y2,y1=10;
  for(let i=1;i<=n;i++){const t=i/n,x=lerp(x0,x1,t)+(i<n?R(-5,5):0),y=lerp(b.sky?150:10,y1,t),z=lerp(z0,z1,t)+(i<n?R(-5,5):0);sprite((x+x0)/2,(y+y0)/2,(z+z0)/2,b.sky?7:5,hex('#fff8a0'),1,true,b.sky?34:5);sprite(x,y,z,6,hex('#fff8a0'),1,true);x0=x;z0=z;y0=y}}
 for(const q of RUN.parts)sprite(q.x,(q.z||6),q.y,2.6,hex(q.c),clamp(q.life*3,0,1),true);
 frameEnd()}
function sceneTitle(dt){setLight([.3,.9,.45],[.5,.44,.6],[.26,.22,.36]);setFog('#07050e',180,560);
 const a=time*.12,cx=W/2,cz=H*.6;setCam([cx+Math.sin(a)*120,74,cz+Math.cos(a)*150],[cx,30,cz-20],.8);frameBegin();
 drawRoomMesh('burrows',[.7,.66,.9]);
 prop(PROP.bigDoor,cx,0,40,0,.8);sprite(cx,30,48,90,hex('#58f0c0'),.2+.06*Math.sin(time*3),true);
 lantern(cx,70,cz-20,1.6);
 for(let i=0;i<10;i++)prop(i%3?PROP.rock:PROP.stalag,(i*83)%(W-40)+20,0,60+(i*47)%(H-80),i,1+(i%3)*.4);
 shadow(cx,cz,6);drawCast('WILL',cx,cz,3.14159,{id:'title',weapon:'blade'});
 for(let i=0;i<3;i++){const t=TYPES.length?(i*2)%6:0;drawBud(t,cx-12+i*12,cz+14+(i%2)*4,3.14,Math.abs(Math.sin(time*3+i))*1.4)}
 for(let i=0;i<14;i++){const t=(time*.08+i*.19)%1;sprite((i*61)%W,90-t*90,(i*37)%H,1.6,hex('#c8b8d8'),.4*(1-t),true)}
 frameEnd()}
function sceneCine(dt){const sc=RDCINE[rdCineIx],tt=rdCineT,cx=W/2;
 if(sc.bg==='garden'||sc.bg==='crack'){setLight([.2,.9,.4],[.62,.64,.6],[.58,.6,.56]);setFog('#0a140c',260,640);
  setCam([cx+Math.sin(tt*.2)*14,58,H*.5+150-tt*3],[cx,20,H*.5],.7);frameBegin();drawRoomMesh('garden');
  for(let i=0;i<46;i++)prop(PROP.tuft,(i*47)%(W+160)-80,0,(i*31)%(H+80)-10,i,1.2+(i%3)*.4);
  for(let i=0;i<5;i++)prop(PROP.plant,-30+(i*91)%(W+60),0,20+(i*53)%70,i,1.4);
  prop(PROP.post,cx,0,H*.5-26);lantern(cx,28,H*.5-26,1.5);
  sprite(W+40,150,-120,26,[.91,.9,.96],.9,false);
  if(sc.bg==='crack'){const n=Math.min(11,2+Math.floor(tt*3));for(let k=0;k<n;k++){mPush();mT(cx-3+((k*7)%5)*2-4,.4,H*.5-16+k*7);mRY(k*.9);mS(5,1,4);drawT(MESH.disc,{c:[.01,.02,.03],a:1,unlit:true});mPop()}
   if(tt>1){mPush();mT(cx,-30,H*.5-10);mS(3,60,3);drawT(MESH.cube,{c:hex('#ffd94d'),a:.3+.1*Math.sin(time*5),unlit:true,glow:true});mPop()}}
  shadow(cx-36,H*.5+20,6);drawCast('WILL',cx-36,H*.5+20,.6,{id:'cW',look:sc.bg==='crack'?3.3:1.3});shadow(cx+30,H*.5+22,6);drawCast('ERIN',cx+30,H*.5+22,-.5,{id:'cE',npc:'ERIN',talk:sc.bg==='crack'&&tt>3,look:-1.4});
  shadow(cx-4,H*.5+34,7);drawCast('LOUIE',cx-4+(sc.bg==='crack'?Math.sin(Math.min(tt,1.4)*9)*3:0),H*.5+34,sc.bg==='crack'?3.4:.3,{id:'cL',happy:sc.bg!=='crack',nosit:sc.bg==='crack',talk:sc.bg==='crack'&&tt<3})}
 else if(sc.bg==='hearth'){setLight([.3,.9,.45],[.78,.66,.52],[.5,.42,.44]);setFog('#120a12',430,820);
  setCam([cx+Math.sin(tt*.25)*20,70,H+60],[cx,12,H-60],.62);frameBegin();drawRoomMesh('hub');
  for(const s of STATIONS)prop(PROP[s.id],s.x,0,29,0,1.15);lantern(cx,50,H*.42,1.5);torch(12,40);torch(W-12,40);
  prop(PROP.hatch,DOOR.x,0,DOOR.y);mPush();mT(DOOR.x,-8.5,DOOR.y);draw(PROP.hatchDark,{unlit:true});mPop();sprite(DOOR.x,2,DOOR.y,44,hex('#58f0c0'),.3+.1*Math.sin(time*3),true);
  [['ERIN',36],['LOUIE',80],['MARCUS',124],['SCOUT',168],['RANGER',206]].forEach(q=>{shadow(q[1]*HK,H-58,6);drawCast(q[0],q[1]*HK,H-58,(cx-q[1]*HK)*.004,{id:'h'+q[0],npc:q[0],look:Math.atan2(cx-q[1]*HK,24),talk:sc.lines[Math.min(sc.lines.length-1,Math.floor(tt/(sc.d/sc.lines.length)))][0]===q[0]})});
  shadow(cx,H-34,6);drawCast('WILL',cx,H-34,3.14159,{id:'hW'})}
 else{setLight([.3,.9,.45],[.5,.44,.6],[.26,.22,.36]);setFog('#05030a',200,520);
  setCam([cx+40,46,H+40],[cx,34,60],.7);frameBegin();drawRoomMesh('burrows',[.6,.56,.8]);
  for(let i=0;i<12;i++)prop(PROP.rock,(i*53)%W,0,40+(i*37)%(H-50),i,1.2);
  prop(PROP.bigDoor,cx,0,46,0,.8);sprite(cx,34,56,110,hex('#a8f080'),.25+.1*Math.sin(time*3),true);
  const wz=Math.max(70,H-10-tt*22);shadow(cx,wz,6);drawCast('WILL',cx,wz,3.14159,{id:'cD',weapon:'blade'})}
 frameEnd()}
function drawScene(dt){ADT=(state==='pause'||state==='boon'||state==='shop'||(state==='set'&&setReturn==='pause'))?0:dt;
 if(state==='title'||state==='menu'||(state==='set'&&setReturn!=='pause'))return sceneTitle(dt);
 if(state==='cine')return sceneCine(dt);
 if(state==='chars')return sceneChars(dt);
 if(RUN&&(state==='run'||state==='pause'||state==='boon'||state==='shop'||state==='set'))return sceneRun(dt);
 if(state==='over'||state==='win')return sceneTitle(dt);
 return sceneHub(dt)}
