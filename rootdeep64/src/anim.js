/* =====================================================================
   ROOTDEEP 64 — character animation
   The models are deliberately simple; the motion is not. Every keeper
   and NPC is a jointed rig (pelvis, chest, head, shoulders, elbows,
   hips, knees, weapon wrist) posed procedurally each frame:

   - a target pose is built from what the character is doing (run cycle
     driven by real ground speed, three-hit combo, signature casts,
     dash, flinch, fall, revive, cheer, drop-in, NPC habits);
   - every joint chases its target on a slightly under-damped spring, so
     moves get anticipation, overshoot and settle for free and blend
     into each other without popping;
   - facing turns on a spring too, and the body banks into the turn and
     leans with acceleration;
   - feet are grounded from the leg pose, so squats, lunges and the run
     bob stay planted instead of floating.

   Nothing here touches game rules: it reads state, it never writes it.
   ===================================================================== */
'use strict';
const ANIM=new Map();let ADT=0;
const HIP=6.3,THIGH=3,SHIN=3.35;
const PK=['ry','rz','rp','rr','sq','tw','pt','cx','cy','cz','hx','hy','hz','lsx','lsy','lsz','le','rsx','rsy','rsz','re','lhx','lhz','lk','rhx','rhz','rk','wx','tx','tz','fl','fr','bl','br'];
const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const eOut=t=>1-(1-t)*(1-t)*(1-t);
const wrapA=a=>((a+Math.PI)%6.2832+6.2832)%6.2832-Math.PI;
function aState(id,x,z,yaw){let S=ANIM.get(id);if(!S){S={x,z,yaw,yv:0,sp:0,acc:0,ph:Math.random()*6,t:Math.random()*20,seed:Math.random()*6,cur:{},vel:{},still:0,init:false,posed:false,step:0};for(const k of PK){S.cur[k]=0;S.vel[k]=0}ANIM.set(id,S)}return S}
/* measure real motion: speed and acceleration come from where the character actually went */
function aStep(S,x,z,yawT,dt,snap){
 if(dt>0){const d=Math.hypot(x-S.x,z-S.z);let v=d/dt;if(d>45||!S.init)v=0;
  const ps=S.sp;S.sp=lerp(S.sp,v,clamp(dt*14,0,1));S.acc=lerp(S.acc,clamp((S.sp-ps)/dt,-900,900),clamp(dt*9,0,1));
  if(S.sp>4)S.ph+=dt*(3.6+S.sp*.078);S.t+=dt;S.still=S.sp<4?S.still+dt:0;
  if(!S.init){S.yaw=yawT;S.yv=0}else{const df=wrapA(yawT-S.yaw),k=snap?900:300,dm=snap?52:30;S.yv+=(df*k-S.yv*dm)*dt;S.yaw+=S.yv*dt}
  S.init=true}
 if(dt>0||!S.init){S.x=x;S.z=z}}
function aSpring(S,P,dt,k,d){if(!S.posed){for(const key of PK){S.cur[key]=P[key];S.vel[key]=0}S.posed=true;return}
 if(dt<=0)return;const n=dt>.02?2:1,h=dt/n;
 for(let i=0;i<n;i++)for(const key of PK){const soft=key==='tx'||key==='tz'||key==='hz',kk=soft?110:k,dd=soft?9:d;
  let v=S.vel[key];const c=S.cur[key];v+=((P[key]-c)*kk-v*dd)*h;S.vel[key]=v;S.cur[key]=c+v*h}}
const zeroPose=()=>{const P={};for(const k of PK)P[k]=0;return P};
/* blend a set of joint targets into the pose by weight */
function ov(P,w,T){if(w<=0)return;for(const k in T)P[k]=lerp(P[k],T[k],w)}
/* a planted squat: knees fold to twice the hip angle so the feet stay under the body */
function squat(T,h){T.lhx=h;T.rhx=h;T.lk=h*2;T.rk=h*2;return T}

/* ---------------- two-legged cast ---------------- */
function humanPose(kind,S,o){const P=zeroPose(),t=S.t,sd=S.seed,br=Math.sin(t*2.1+sd);
 const w=clamp(S.sp/34,0,1),rf=clamp((S.sp-40)/50,0,1),q=1-w,armed=!!o.weapon;
 /* idle: breathing, weight shifting, eyes wandering */
 P.cx=.035*br;P.lsz=.07+.025*br;P.rsz=.07+.025*br;P.le=.22;P.re=.22;P.lsx=.04;P.rsx=.04;
 P.rr=.03*Math.sin(t*.8+sd);P.cz=-.03*Math.sin(t*.8+sd);P.hx=.03*Math.sin(t*1.3+sd);P.lhz=.05;P.rhz=.05;
 P.hy=Math.sin(t*.45+sd)*.28+Math.sin(t*.17+sd*2)*.18;
 if(armed){P.rsx=.38;P.re=1.05;P.rsz=.16;P.wx=-.45+.04*br}
 /* habits: who they are when nobody is asking them anything */
 const who=o.npc;
 if(who==='MARCUS'){ov(P,q,{lsx:.72,rsx:.78,lsz:-.5,rsz:-.56,le:1.95,re:1.85,cx:-.09,hz:.13,rhx:.1+Math.max(0,Math.sin(t*7))*.1,rk:.2+Math.max(0,Math.sin(t*7))*.2,rr:.05})}
 else if(who==='ERIN'){ov(P,q,{lsx:.42,rsx:.42,lsz:-.34,rsz:-.34,le:1.02,re:1.02,rr:.06*Math.sin(t*1.1),cz:-.05*Math.sin(t*1.1),hz:.08*Math.sin(t*.9)});
  if(o.act)ov(P,q,squat({cx:.62,lsx:.95+Math.sin(t*6)*.18,rsx:.95-Math.sin(t*6)*.18,le:.5,re:.5,lsz:-.1,rsz:-.1,hx:.3,hy:0},.95))}
 else if(who==='SCOUT'){const up=ss(.72,.9,Math.sin(t*.6+sd));ov(P,q,{lsx:.95,le:1.5,lsz:-.2,rsx:.82,re:1.62,rsz:-.3+Math.sin(t*(o.act?26:17))*.09*(1-up),hx:lerp(.36,-.1,up),hy:lerp(.12,P.hy*1.6,up),cx:.1})}
 else if(who==='RANGER'){ov(P,q,{rsz:.72,re:1.75,rsx:-.15,lsx:.06,lhz:.16,rhz:.16,hy:Math.sin(t*.55+sd)*.75,cy:Math.sin(t*.55+sd)*.2,cx:-.05})}
 if(o.talk){const g=Math.sin(t*4.6),g2=Math.sin(t*3.1+1);
  if(who==='MARCUS')ov(P,1,{lsx:.5,rsx:.5,lsz:.55+.2*g,rsz:.55+.2*g,le:1.5,re:1.5,hz:.2*g2,hx:.06*g,cx:-.1,cz:.04*g2});
  else ov(P,1,{lsx:.55+.35*Math.max(0,g),le:1.25-.4*Math.max(0,g),rsx:.5+.35*Math.max(0,-g),re:1.25-.4*Math.max(0,-g),lsz:.2,rsz:.2,hx:.1*Math.sin(t*6.2),hz:.1*g2,cy:.08*g2})}
 if(o.look!==undefined&&o.look!==null){const rel=wrapA(o.look-S.yaw);P.hy=lerp(P.hy,clamp(rel,-1.15,1.15)*.8,q);P.cy+=clamp(rel,-1,1)*.2*q;if(!who||who==='SCOUT')P.hx=lerp(P.hx,0,q)}
 /* locomotion: one cycle, walk to run, driven by distance covered */
 if(w>0){const s=Math.sin(S.ph),c=Math.cos(S.ph),amp=lerp(.42,1,rf)*w,kn=lerp(.6,1.55,rf);
  P.lhx=s*amp;P.rhx=-s*amp;P.lk=(.12+Math.max(0,c)*kn)*w;P.rk=(.12+Math.max(0,-c)*kn)*w;P.lhz=P.rhz=.03;
  P.lsx=lerp(P.lsx,-s*amp*.95,w);P.le=lerp(P.le,lerp(.4,1.35,rf)+Math.max(0,-s)*.3,w);P.lsz=lerp(P.lsz,.12,w);
  P.rsx=lerp(P.rsx,(armed?.32:0)+s*amp*(armed?.4:.95),w);P.re=lerp(P.re,armed?1.2:lerp(.4,1.35,rf)+Math.max(0,s)*.3,w);P.rsz=lerp(P.rsz,.12,w);
  P.rp+=lerp(.05,.2,rf)*w;P.pt=s*.2*amp;P.cy=lerp(P.cy,-s*.34*amp,w);P.cz=lerp(P.cz,c*.05,w);P.cx=lerp(P.cx,.04,w);
  P.hx=lerp(P.hx,-.1*rf,w);P.hy*=q;P.rr=lerp(P.rr,clamp(-S.yv*.045,-.4,.4),w);
  if(armed)P.wx=-.45+s*.12*w}
 /* inertia: lean into speeding up, rock back on stopping; the head trails the body */
 const ia=clamp(S.acc*.0009,-.2,.24);P.rp+=ia;P.hx-=ia*.9;P.cx+=ia*.4;
 /* ---- actions ---- */
 if(o.atk>=0){const a=o.atk,wind=1-ss(0,.1,a),hit=ss(.05,.3,a),rec=ss(.58,1,a),W=1-rec,wk=o.weapon||'blade';
  if(wk==='bow'){const dr=ss(0,.22,a),rel=ss(.22,.32,a);
   ov(P,W,{rsx:1.5,re:.04,rsy:.55,rsz:.1,lsx:1.3,lsy:-.3,le:lerp(.3,2.1,dr)*(1-rel)+.7*rel,lsz:.1,cy:-.6,pt:-.25,hy:.55,hx:0,rp:-.08*rel,lhx:.35,rhx:-.35,lk:.2,rk:.15,wx:-.2})}
  else if(wk==='maul'||o.combo===2){const up=1-eOut(hit),big=wk==='maul'?1:.8,jump=Math.sin(clamp(a/.3,0,1)*3.14159);
   /* finisher: leap, both hands overhead, bring it down, sink into the landing */
   const land=ss(.26,.36,a)*(1-ss(.4,.8,a));
   ov(P,W,Object.assign(squat({},land*.75),{rsx:lerp(.5,3.05,up),lsx:lerp(.55,2.95,up),re:lerp(.1,.95,up),le:lerp(.25,1.05,up),rsz:-.2,lsz:-.34,rsy:0,
    cx:lerp(.62,-.42,up),cy:0,pt:0,rp:lerp(.24,-.12,up),hx:lerp(.1,-.3,up),hy:0,wx:lerp(.55,-.95,up),ry:jump*4.6*big,sq:.12*up*jump-.24*land*big}));
   if(land<=0&&a<.3){P.lhx=lerp(P.lhx,.6,W*jump);P.lk=lerp(P.lk,1.3,W*jump);P.rhx=lerp(P.rhx,-.2,W*jump);P.rk=lerp(P.rk,.9,W*jump)}}
  else{const dir=o.combo===1?1:-1,sw=lerp(1.3,-1.2,eOut(hit))*dir;
   /* cut across the body: wind out to one side, whip through, let the shoulders carry past */
   ov(P,W,{rsx:1.42,rsy:sw,re:.1+.55*wind,rsz:.08,cy:sw*.62,pt:sw*.24,rp:.17*hit,cx:.08,hy:-sw*.32,hx:0,
    lsx:-.55*hit,lsz:.55,le:.75,lsy:0,lhx:.48*hit,lk:.42*hit,rhx:-.42*hit,rk:.22,lhz:.1,rhz:.12,wx:.12,rr:-sw*.05})}}
 if(o.cast>=0){const a=o.cast,fire=ss(.1,.26,a),rec=ss(.62,1,a),W=1-rec;
  if(kind==='ERIN'){const f=eOut(fire); /* TOWEL WHIP: crack it from over the shoulder */
   ov(P,W,{rsx:lerp(3,.85,f),re:lerp(1.3,0,fire),rsy:lerp(.7,-.55,f),cy:lerp(.55,-.5,f),pt:lerp(.2,-.2,f),cx:lerp(-.22,.32,f),lsx:-.75,lsz:.6,le:.5,lhx:.5,lk:.34,rhx:-.42,rk:.2,rp:.14*fire,hy:lerp(-.3,.3,f),wx:lerp(-.9,.4,f)})}
  else if(kind==='MARCUS'){ /* HYDRO JET: brace like it's a fire hose */
   ov(P,W,Object.assign(squat({},.58),{lsx:1.12,rsx:1.12,le:.38,re:.32,lsz:-.32,rsz:-.3,lhz:.38,rhz:.38,rp:-.24*fire,cx:-.12,cz:Math.sin(t*46)*.035*fire,cy:Math.sin(t*38)*.03*fire,hx:.16,hy:0,wx:.3}))}
  else{ /* MAZEL TOV LASER (and god casts): gather at the chest, drive both palms out, ride the recoil */
   ov(P,W,{lsx:lerp(.95,1.52,fire),rsx:lerp(.95,1.52,fire),le:lerp(1.95,.04,fire),re:lerp(1.95,.04,fire),lsz:lerp(.12,-.34,fire),rsz:lerp(.12,-.34,fire),
    rp:lerp(.12,-.27,fire),cx:lerp(.22,-.14,fire),cy:0,lhx:.46,rhx:-.46,lk:.32,rk:.26,hx:.12,hy:0,sq:.07*fire,wx:.5})}}
 if(o.charge>=0){const c=o.charge; /* coiling up for the heavy */
  ov(P,c,squat({rsx:-.9,re:.9,rsy:.5,cy:.55,pt:.2,cx:.26,lsx:.7,le:1.2,hx:-.1,cz:Math.sin(t*52)*.025*c,wx:-.8},.5))}
 if(o.heavy>=0){const a=o.heavy,hit=ss(.04,.24,a),W=1-ss(.6,1,a);
  if(kind==='MARCUS'){const sw=lerp(1.5,-1.45,eOut(hit)); /* PIPE WRENCH: both hands, everything he has */
   ov(P,W,{rsx:1.4,rsy:sw,re:.1,rsz:0,lsx:1.3,lsy:sw*.6,lsz:-.4,le:.5,cy:sw*.75,pt:sw*.3,rp:.2*hit,cx:.1,hy:-sw*.3,lhx:.62*hit,lk:.5*hit,rhx:-.5*hit,rk:.25,wx:.1})}
  else{const k=eOut(hit); /* SNEAKER KICK / GARDEN KICK: chamber the knee, snap it out, lean away to balance */
   ov(P,W,{rhx:lerp(-.5,1.68,k),rk:lerp(1.7,.04,hit),rhz:.1,lhx:-.12,lk:.26,rp:-.3*hit,cx:-.16,cy:-.42*hit,pt:-.5*hit,lsx:-.6,lsz:.82,le:.4,rsx:.7,rsz:.5,re:1,hx:.12,hy:.2*hit,wx:-.7})}}
 if(o.sp>=0){const a=o.sp;
  if(kind==='ERIN'){const W=1-ss(.85,1,a),thr=ss(.4,.52,a),yank=ss(.56,.68,a); /* LEASH LASSO: twirl, throw, haul */
   ov(P,W*(1-thr),{rsx:2.75,re:.3,rsy:Math.sin(t*26)*.6,rsz:.2+Math.cos(t*26)*.32,cy:.2,lsx:.4,le:.8,hx:-.1});
   ov(P,W*thr*(1-yank),{rsx:1.45,re:0,rsy:0,cy:-.35,rp:.18,lsx:-.5,lhx:.5,rhx:-.4,lk:.3});
   ov(P,W*yank,{rsx:.9,re:1.65,lsx:.9,le:1.65,lsz:-.25,rsz:-.25,rp:-.32,cx:-.26,lhx:.52,rhx:-.42,lk:.35,rk:.2,hx:.1})}
  else if(kind==='MARCUS'){const W=ss(0,.12,a)*(1-ss(.75,1,a)); /* DAB CLOUD: he dabs. Of course he dabs. */
   ov(P,W,{lsx:1.95,le:2.05,lsz:-.78,rsx:2.2,rsz:1.02,re:0,rsy:0,hx:.46,hy:.56,cz:-.2,cy:.26,lhz:.2,rhz:.2,rp:.05,wx:.9})}
  else{const W=ss(0,.14,a)*(1-ss(.75,1,a)); /* SELFIE FLASH: phone up, chin out, foot pop */
   ov(P,W,{lsx:2.35,le:.35,lsz:.26,lsy:.26,rsx:.3,re:1.9,rsz:.92,hz:-.28,hy:.3,cz:.12,cy:.2,rp:-.13,rk:1.15,rhx:-.08,cx:-.1})}}
 if(o.sup>=0){const a=o.sup,gather=1-ss(.36,.5,a),burst2=ss(.4,.52,a)*(1-ss(.82,1,a)),hop=Math.sin(clamp((a-.4)/.4,0,1)*3.14159);
  /* super: pull everything in, then let it go */
  ov(P,gather*ss(0,.1,a),squat({lsx:.9,rsx:.9,le:2,re:2,lsz:-.4,rsz:-.4,cx:.42,hx:.3,cz:Math.sin(t*58)*.03,sq:-.1,wx:-.5},.72));
  if(kind==='ERIN')ov(P,burst2,{rsx:1.5,re:0,rsz:0,lsx:1.9,le:2.3,lsz:-.3,cx:-.1,hx:-.2,ry:2.4*hop,lhx:.4,rhx:-.3,lk:.3,sq:.08});       /* whistle, and point */
  else if(kind==='WILL')ov(P,burst2,{rsx:1.5,re:0,rsy:lerp(1.1,-.6,ss(.4,.7,a)),lsx:.3,le:1.8,lsz:.9,cy:lerp(.5,-.3,ss(.4,.7,a)),hx:-.1,ry:2.4*hop,lhz:.25,rhz:.25,sq:.08,wx:.2}); /* wave it through */
  else ov(P,burst2,{lsx:2.8,rsx:2.8,lsz:.8,rsz:.8,le:0,re:0,cx:-.36,hx:-.46,ry:3.4*hop,sq:.16,lhz:.2,rhz:.2,wx:-.4})}
 if(o.dive>=0){const a=o.dive,h=Math.sin(a*3.14159);P.ry+=13*h;
  if(kind==='MARCUS')ov(P,1,{lhx:1.7,rhx:1.7,lk:2.3,rk:2.3,lsx:1.3,rsx:1.3,le:1.6,re:1.6,cx:.6,hx:.4,rp:a*5.6,wx:.5}); /* CANNONBALL, BRO */
  else ov(P,1,{rp:1.28*ss(.08,.55,a),lsz:1.32,rsz:1.32,lsx:.3,rsx:.3,le:0,re:0,lhx:-.3,rhx:-.3,lk:.2,rk:.2,hx:-.62,sq:.1,wx:.4})} /* STAGE DIVE / FLYING FLOP */
 if(o.diveL>=0){const W=1-ss(.3,1,o.diveL);ov(P,W,Object.assign(squat({},.9),{sq:-.3,cx:.42,lsz:.9,rsz:.9,lsx:.2,rsx:.2,hx:.2,rp:.1}))}
 if(o.selfie>=0){const W=1-ss(.72,1,o.selfie),pop=ss(0,.18,o.selfie); /* SELFIE FLASH: arm up, head tilt, foot pop */
  ov(P,W*pop,{lsx:2.55,le:.55,lsz:.36,lsy:.3,hz:-.3,hy:.36,hx:-.12,cz:.13,cy:.3,rk:1.25,rhx:-.1,rsx:.2,re:.9,rsz:.5,rp:-.05})}
 if(o.hurt>=0){const W=1-ss(.35,1,o.hurt);ov(P,W,Object.assign(squat({},.4),{cx:-.56,hx:-.46,lsz:1.02,rsz:1.02,lsx:-.42,rsx:-.42,le:.5,re:.5,rp:-.3,sq:-.14,hy:.2}))}
 if(o.help)ov(P,1,squat({cx:.56,lsx:1.02+Math.sin(t*9)*.26,rsx:1.02+Math.sin(t*9)*.26,le:.3,re:.3,lsz:-.2,rsz:-.2,hx:.32,hy:0,wx:1.2},1.05));
 if(o.wind)ov(P,1,squat({rsx:-1.05,re:.85,rsy:.5,cx:.36,rp:.16,cy:.52,pt:.2,lsx:.7,le:1.1,hx:-.2,wx:-.9},.72));
 if(o.cheer>=0){const a=o.cheer,W=1-ss(.86,1,a),h=Math.abs(Math.sin(a*3.14159*2));
  ov(P,W,{ry:5.2*h,lsx:2.85,rsx:2.95,lsz:.36,rsz:.3,le:.2+.5*(1-h),re:.15,hx:-.3,hy:0,lhx:.55*h,rhx:.3*h,lk:1.1*h,rk:.8*h,sq:.1*h-.16*(1-h)*(1-h),cx:-.12,wx:-.6,rp:0})}
 if(o.land>=0){const a=o.land,fall=1-ss(0,.42,a),hitG=ss(.4,.48,a)*(1-ss(.5,1,a));
  P.ry+=85*fall*fall;if(fall>0)ov(P,1,{lsz:1.1,rsz:1.1,lsx:.3,rsx:.3,lk:.5,rk:.7,lhx:.3,rhx:.1,sq:.14});
  ov(P,hitG,Object.assign(squat({},.85),{sq:-.3,cx:.4,lsz:.8,rsz:.8,hx:.2}))}
 if(o.dash)ov(P,1,{rp:1.02,sq:.24,rsx:2.9,re:0,rsy:0,rsz:.05,lsx:-1.1,le:.2,lsz:.3,lhx:-.55,rhx:-.22,lk:.5,rk:.95,hx:-.72,hy:0,cx:0,cy:0,pt:0,wx:.35,ry:-1});
 if(o.down)ov(P,1,{rp:-1.52,ry:2.5,lsz:1.2,rsz:1.08,lsx:-.2,rsx:-.1,le:.4,re:.7,lhx:.1,rhx:-.05,lhz:.26,rhz:.2,lk:.1,rk:.55,hy:.5,hx:-.1,cx:0,cy:0,pt:0,sq:0,wx:1.3});
 return P}
function drawHuman(M,S,o,dr){const c=S.cur,sq=clamp(c.sq,-.5,.6),sy=1+sq,sx=1/Math.sqrt(sy);
 /* plant the lower foot on the floor */
 const rl=THIGH*Math.cos(c.lhx)+SHIN*Math.cos(c.lhx-c.lk),rr=THIGH*Math.cos(c.rhx)+SHIN*Math.cos(c.rhx-c.rk);
 const flat=Math.abs(c.rp)>.75?0:1,gy=(Math.max(rl,rr)-(THIGH+SHIN))*flat;
 mT(0,c.ry+gy,0);mRY(c.tw);
 /* the second cut of the blade combo is a full spinning backhand */
 if(o.atk>=0&&o.combo===1&&o.weapon==='blade')mRY(-ss(.04,.42,o.atk)*6.2832);
 mRX(c.rp);mRZ(c.rr);mS(sx,sy,sx);
 mT(0,HIP,0);mRY(c.pt);draw(M.pelvis,dr);
 for(const s of[-1,1]){const hx2=s<0?c.lhx:c.rhx,hz2=s<0?c.lhz:c.rhz,kn=s<0?c.lk:c.rk;
  mPush();mT(s*2.1,0,0);mRZ(s*hz2);mRX(-hx2);draw(M.thigh,dr);mT(0,-THIGH,0);mRX(Math.max(0,kn));draw(M.shin,dr);mPop()}
 mT(0,2.4,0);mRY(c.cy-c.pt);mRX(c.cx);mRZ(c.cz);draw(M.chest,dr);
 for(const s of[-1,1]){const L=s<0,ax=L?c.lsx:c.rsx,ay=L?c.lsy:c.rsy,az=L?c.lsz:c.rsz,el=L?c.le:c.re;
  mPush();mT(s*5.6,4.2,0);mRZ(s*az);mRY(ay);mRX(-ax);draw(M.uarm,dr);mT(0,-3,0);mRX(-Math.max(0,el));draw(M.farm,dr);
  if(!L&&o.weapon){mT(0,-2.9,0);mRX(o.weapon==='bow'?1.2+c.wx:.2+c.wx);draw(MESH[o.weapon],dr);if(o.trail&&!XRAY&&o.weapon!=='bow')trailSample(S,o.weapon==='maul'?12:11)}
  if(L&&o.phone){mT(0,-3.6,.6);draw(MESH.phone);mT(0,0,.5);draw(MESH.phoneLit,{unlit:true,add:.3})}
  mPop()}
 mT(0,5,0);mRY(c.hy);mRX(c.hx);mRZ(c.hz);draw(M.head,dr);
 if(o.crown){mT(0,9.4,0);draw(MESH.crown,{unlit:true})}}

/* ---------------- Louie ---------------- */
function louiePose(S,o){const P=zeroPose(),t=S.t,sd=S.seed,w=clamp(S.sp/30,0,1),rf=clamp((S.sp-50)/45,0,1),q=1-w;
 /* idle: wagging, panting, the occasional head tilt; he sits if you make him wait */
 P.tz=Math.sin(t*(o.happy?17:7))*(o.happy?.75:.35);P.tx=.2;P.hx=Math.sin(t*1.7+sd)*.05+(o.happy?Math.sin(t*15)*.035:0);
 P.hz=ss(.8,.95,Math.sin(t*.5+sd))*.42;P.hy=Math.sin(t*.4+sd)*.3;
 const sit=o.nosit?0:ss(1.1,1.7,S.still);
 if(sit>0)ov(P,sit,{rp:-.5,ry:-1.9,bl:1.25,br:1.25,fl:-.5,fr:-.5,hx:.42+P.hx,tx:-.3});
 if(o.look!==undefined&&o.look!==null){const rel=wrapA(o.look-S.yaw);P.hy=lerp(P.hy,clamp(rel,-1.1,1.1)*.85,q)}
 if(o.talk)ov(P,1,{hz:.35*Math.sin(t*2.2),hx:-.15+Math.sin(t*9)*.05,ry:Math.abs(Math.sin(t*5))*1.2*(Math.sin(t*1.3)>.2?1:0)});
 if(w>0){const ph=S.ph*1.25,s=Math.sin(ph),A=lerp(.7,.98,rf)*w;
  /* trot on diagonals, opening up into a gallop */
  P.fl=lerp(s,Math.sin(ph),rf)*A;P.fr=lerp(-s,Math.sin(ph-.55),rf)*A;P.bl=lerp(-s,Math.sin(ph+2.7),rf)*A;P.br=lerp(s,Math.sin(ph+2.15),rf)*A;
  P.ry=lerp(Math.abs(s)*.6,(.5+.5*Math.sin(ph+1.2))*2.6,rf)*w;P.rp=lerp(0,Math.sin(ph+2.4)*.2,rf)*w;P.sq=Math.sin(ph+.6)*.08*rf*w;
  P.hx=-P.rp*.8-.08*w;P.hy*=q;P.hz*=q;P.tx=lerp(P.tx,-.55,w);P.tz=Math.sin(t*10)*.22;P.rr=clamp(-S.yv*.05,-.4,.4)*w}
 const ia=clamp(S.acc*.0008,-.2,.22);P.rp+=ia;P.hx-=ia;
 if(o.atk>=0){const a=o.atk,lunge=ss(0,.18,a)*(1-ss(.34,1,a)),snap=ss(.1,.26,a),W=1-ss(.6,1,a); /* the bite: rear, pounce, snap */
  ov(P,W,{rz:6.5*lunge,hx:lerp(-.6,.38,snap),fl:.95*lunge,fr:.8*lunge,bl:-.65*lunge,br:-.55*lunge,sq:.2*lunge,ry:1.6*lunge,rp:-.1*lunge,tx:-.6,hy:0,hz:0})}
 if(o.cast>=0){const a=o.cast,cr=ss(0,.14,a)*(1-ss(.14,.26,a)),bark=ss(.14,.26,a)*(1-ss(.62,1,a)); /* THE BOOF: play-bow, then the whole dog goes into it */
  ov(P,Math.max(cr,bark),{rp:.42*cr-.32*bark,fl:.6*cr-.3*bark,fr:.6*cr-.3*bark,bl:-.2*bark,br:-.2*bark,hx:.3*cr-.95*bark,sq:-.16*cr+.22*bark,ry:2.4*bark,tx:-.7,hy:0,hz:0})}
 if(o.charge>=0)ov(P,o.charge,{rp:.36,fl:.6,fr:.6,bl:.3,br:.3,ry:-1.2,hx:-.3,tz:Math.sin(t*26)*.6,sq:-.1});
 if(o.heavy>=0){const a=o.heavy,lunge=ss(0,.16,a)*(1-ss(.36,1,a)),snap=ss(.08,.24,a),W=1-ss(.6,1,a); /* CHOMP */
  ov(P,W,{rz:9.5*lunge,hx:lerp(-.95,.55,snap),fl:1.1*lunge,fr:1*lunge,bl:-.8*lunge,br:-.7*lunge,sq:.26*lunge,ry:3.2*lunge,rp:-.16*lunge,tx:-.8,hy:0,hz:0})}
 if(o.sup>=0){const a=o.sup,W=ss(0,.12,a)*(1-ss(.84,1,a)); /* JUDGEMENT: he sits, and he howls */
  ov(P,W,{rp:-.56,ry:-1.9,bl:1.25,br:1.25,fl:-.56,fr:-.56,hx:-.72+Math.sin(t*30)*.04,hy:0,hz:0,sq:.08*Math.sin(t*20),tz:Math.sin(t*22)*.8,tx:.6})}
 if(o.dive>=0){const h=Math.sin(o.dive*3.14159);ov(P,1,{fl:1.3,fr:1.2,bl:-1.3,br:-1.2,ry:11*h,sq:.22,hx:lerp(-.5,.4,o.dive),rp:lerp(-.3,.4,o.dive),tx:-1,hy:0,hz:0})} /* ZOOM POUNCE */
 if(o.diveL>=0){const W=1-ss(.3,1,o.diveL);ov(P,W,{sq:-.3,ry:-1.6,fl:.5,fr:.5,bl:.5,br:.5,hx:.3})}
 if(o.hurt>=0){const W=1-ss(.35,1,o.hurt);ov(P,W,{ry:3,rp:-.3,hx:-.5,fl:.6,fr:.6,bl:-.6,br:-.6,sq:-.12,tx:.9})}
 if(o.help)ov(P,1,{hx:.5+Math.sin(t*10)*.22,rp:.2,tz:Math.sin(t*18)*.8});
 if(o.cheer>=0){const a=o.cheer,W=1-ss(.86,1,a),h=Math.abs(Math.sin(a*3.14159*2));ov(P,W,{ry:6.5*h,tw:ss(0,.86,a)*12.566,fl:.7*h,fr:.7*h,bl:-.5*h,br:-.5*h,sq:.12*h-.14*(1-h),hx:-.3});P.tz=Math.sin(t*20)*.8}
 if(o.land>=0){const a=o.land,fall=1-ss(0,.42,a),hitG=ss(.4,.48,a)*(1-ss(.5,1,a));P.ry+=85*fall*fall;if(fall>0)ov(P,1,{fl:.9,fr:.9,bl:-.9,br:-.9});ov(P,hitG,{sq:-.3,ry:-1.6,fl:.5,fr:.5,bl:.5,br:.5})}
 if(o.dash)ov(P,1,{fl:1.38,fr:1.3,bl:-1.38,br:-1.3,ry:1,sq:.26,hx:-.22,tx:-1,rp:0,hy:0,hz:0});
 if(o.down)ov(P,1,{rr:1.45,ry:-3.4,fl:.3,fr:-.2,bl:.2,br:-.3,hx:.2,hy:0,hz:0,tz:0,tx:-.4,rp:0,sq:0});
 return P}
function drawLouie(M,S,o,dr){const c=S.cur,sq=clamp(c.sq,-.5,.6),sz=1+sq,sx=1/Math.sqrt(sz);
 mT(0,6.6+c.ry,0);mRY(c.tw);mT(0,0,c.rz);mRZ(c.rr);mRX(c.rp);mS(sx,sx,sz);
 draw(M.body,dr);
 mPush();mT(0,2.4,6.4);mRY(c.hy);mRX(c.hx);mRZ(c.hz);draw(M.head,dr);mPop();
 mPush();mT(0,1.6,-6.4);mRX(c.tx);mRZ(c.tz);draw(M.tail,dr);mPop();
 for(const[lx,lz,k]of[[-2.6,4,'fl'],[2.6,4,'fr'],[-2.6,-4,'bl'],[2.6,-4,'br']]){mPush();mT(lx,-2.2,lz);mRX(-c[k]);draw(M.leg,dr);mPop()}}

/* ---------------- one entry point ---------------- */
function drawCast(kind,x,z,yaw,o){o=o||{};const dt=o.frozen?0:ADT,id=o.id||(kind+'@'+Math.round(x)+','+Math.round(z));
 const fast=o.atk>=0||o.cast>=0||o.hurt>=0||o.land>=0||o.heavy>=0||o.sp>=0||o.sup>=0||o.dive>=0||o.diveL>=0||!!o.dash,S=aState(id,x,z,yaw);
 aStep(S,x,z,yaw,dt,o.atk>=0||o.cast>=0||o.heavy>=0||o.sp>=0||o.dive>=0||!!o.dash);
 const lou=kind==='LOUIE',P=lou?louiePose(S,o):humanPose(kind,S,o);
 aSpring(S,P,dt,fast?1100:260,fast?44:21);
 if(o.hide)return S;
 const dr=(o.c||o.add)?{c:o.c,add:o.add}:null;
 mPush();mT(x,o.y||0,z);mRY(S.yaw);if(o.scale)mS(o.scale);
 if(lou)drawLouie(CAST.LOUIE,S,o,dr);else drawHuman(CAST[kind]||CAST.WILL,S,o,dr);
 mPop();if(!XRAY&&S.tips&&S.tips.length)trailDraw(S,o.trailC||'#ffffff');return S}
/* jointed mesh set for a two-legged character */
function human(o){const m={},sk=o.skin||SKIN,sl=o.sleeve||o.top,sl2=o.sleeve2||o.top2||o.top;let b;
 b=new MB();if(o.dress)b.cyl(0,-4.1,0,6,4.2,5.7,8,o.top,o.top2);else{b.box(0,1.2,0,8.2,2.6,5,o.pant);if(o.belt)b.box(0,2.2,0,8.6,1.1,5.4,o.belt)}m.pelvis=b.done();
 b=new MB();if(o.dress)b.cyl(0,-.7,0,4.3,3.8,5.7,8,o.top,o.top2);else b.box(0,2.5,0,8.4,5,5.2,o.top,o.top2);m.chest=b.done();
 b=new MB();b.box(0,-1.5,0,2.6,3.3,2.7,sl,sl2);m.uarm=b.done();
 b=new MB();b.box(0,-1.2,0,2.4,2.7,2.5,sl,sl2);b.sph(0,-2.9,0,1.6,1.6,1.6,6,4,sk);m.farm=b.done();
 b=new MB();b.box(0,-1.5,0,3,3.3,3.3,o.pant,o.pant2||o.pant);m.thigh=b.done();
 b=new MB();b.box(0,-1.2,0,2.8,2.8,3.1,o.pant);b.box(0,-2.5,.5,3.3,1.7,4.3,o.boot||BOOT);m.shin=b.done();
 b=new MB();b.sph(0,4.6,0,5,4.8,4.8,8,6,shade(sk,.86),sk);
 if(!o.noeyes){b.box(-1.9,4.5,4.5,1.2,1.8,.7,K);b.box(1.9,4.5,4.5,1.2,1.8,.7,K)}
 o.head(b);m.head=b.done();return m}
