/* =====================================================================
   ROOTDEEP 64 — combat effects
   What makes a hit feel like a hit. All of it is presentation: the rules
   only add a few timers (hit-stop, slow motion, launch height, combo
   count). Effects that a remote player needs are rebuilt on their side
   from what they already receive (a foe starting to flash = a hit; a foe
   vanishing = a death), so online play gets them too.

   - hit-stop: the whole fight freezes for a few hundredths of a second
     on contact (longer on heavies, crits and kills)
   - slow motion on the last kill of a room and on a boss going down
   - weapon trails that follow the real blade tip through every swing
   - an impact star and a spray of sparks thrown away from the hitter
   - foes recoil from hits, get launched by heavies and finishers, and
     tumble away spinning when they die instead of popping out
   - a camera punch on big hits; a combo counter per keeper
   ===================================================================== */
'use strict';
let HSTOP=0,SLOWT=0;
const SLOWK=.3;
/* how long the fight holds still on contact */
function hitStop(src,crit,kill){if(src!=='atk'&&src!=='heavy'&&src!=='special'&&src!=='super'&&src!=='sig'&&src!=='cast')return;
 let t=src==='heavy'?.085:src==='super'?.05:src==='cast'?.02:.038;if(crit)t+=.03;if(kill)t+=.03;HSTOP=Math.min(.12,Math.max(HSTOP,t));
 if(src==='heavy'||(crit&&kill))CAM.punch=Math.max(CAM.punch||0,.05)}
function slowMo(t){SLOWT=Math.max(SLOWT,t)}

/* ---------------- sparks, stars, death tumbles ---------------- */
function fxList(){if(!RUN)return null;return RUN.fx||(RUN.fx=[])}
function hitFx(x,y,h,dx,dz,crit,big,col){const L=fxList();if(!L)return;const n=crit||big?11:6;
 L.push({k:'star',x,y,h,t:crit||big?.14:.09,t0:crit||big?.14:.09,s:crit||big?20:11,c:crit?'#ffe27a':'#ffffff'});
 for(let i=0;i<n;i++){const a=Math.atan2(dz,dx)+R(-.9,.9),sp=R(70,crit||big?190:130);
  L.push({k:'spark',x,y,h,vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,vy:R(20,90),t:R(.18,.32),t0:.32,c:i%3?(col||'#fff3c0'):'#ffffff'})}
 if(L.length>160)L.splice(0,L.length-160)}
function deathFx(e){const L=fxList();if(!L)return;let dx=0,dz=1,bd=1e9;
 for(const p of PL){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd&&d>.1){bd=d;dx=(e.x-p.x)/d;dz=(e.y-p.y)/d}}
 L.push({k:'die',kind:e.kind,x:e.x,y:e.y,yaw:e.yaw||0,dx,dz,elite:e.elite,r:e.r,t:0,spin:R(-1,1)>0?1:-1})}
function bigFx(x,y,col){const L=fxList();if(!L)return;for(let i=0;i<3;i++)L.push({k:'ring',x,y,r:30+i*22,t:.45+i*.12,t0:.45+i*.12,c:col||'#ffffff'});
 L.push({k:'star',x,y,h:14,t:.4,t0:.4,s:120,c:'#ffffff'});for(let i=0;i<26;i++){const a=R(0,6.28),sp=R(60,240);L.push({k:'spark',x,y,h:12,vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,vy:R(40,160),t:R(.3,.6),t0:.6,c:i%2?col||'#ffd94d':'#ffffff'})}}
function fxUpdate(dt){const L=RUN&&RUN.fx;if(!L)return;
 for(const f of L){if(f.k==='spark'){f.x+=f.vx*dt;f.y+=f.vz*dt;f.h=Math.max(0,f.h+f.vy*dt);f.vy-=320*dt;f.vx*=1-dt*3;f.vz*=1-dt*3;f.t-=dt}
  else if(f.k==='die'){f.t+=dt;if(f.t>=.5&&!f.done){f.done=true;const c=(FOES[f.kind]||{}).c||'#e8e4f5';
    for(let i=0;i<10;i++){const a=R(0,6.28),sp=R(50,150);L.push({k:'spark',x:f.x+f.dx*28,y:f.y+f.dz*28,h:6,vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,vy:R(30,110),t:R(.2,.4),t0:.4,c:i%2?c:'#ffffff'})}
    L.push({k:'ring',x:f.x+f.dx*28,y:f.y+f.dz*28,r:16,t:.3,t0:.3,c:c})}}
  else f.t-=dt}
 RUN.fx=L.filter(f=>f.k==='die'?f.t<.5:f.t>0)}
function fxDraw(){const L=RUN&&RUN.fx;if(!L)return;
 for(const f of L){
  if(f.k==='star'){const u=1-f.t/f.t0,s=f.s*(u<.3?u/.3:1-(u-.3)*.9);sprite(f.x,f.h,f.y,Math.max(1,s),hex(f.c),.6*(1-u*.6),true);sprite(f.x,f.h,f.y,s*.3,[1,1,1],.9,true)}
  else if(f.k==='spark'){const a=clamp(f.t/f.t0*1.4,0,1);for(let j=0;j<3;j++)sprite(f.x-f.vx*.008*j,f.h-f.vy*.008*j,f.y-f.vz*.008*j,2.6-j*.6,hex(f.c),a*(1-j*.25),true)}
  else if(f.k==='ring'){const u=1-f.t/f.t0;mPush();mT(f.x,.7,f.y);mS(f.r*(.3+.9*u));drawT(MESH.ring,{c:hex(f.c),a:(1-u)*.9,unlit:true,glow:true});mPop()}
  else if(f.k==='die'){const u=clamp(f.t/.5,0,1);drawFoe({kind:f.kind,x:f.x+f.dx*28*Math.sin(u*1.57),y:f.y+f.dz*28*Math.sin(u*1.57),yaw:f.yaw,elite:f.elite,r:f.r,flash:u<.15?1:0,born:0,dyT:u,spin:f.spin,state:0,hp:0,max:1})}}}

/* ---------------- weapon trails ---------------- */
/* a point on the held weapon, in world space, from the current draw matrix */
function wpt(x,y,z){const m=RN.m;return[m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]]}
function trailSample(S,len){const now=time;S.tips=S.tips||[];S.tips.push({a:wpt(0,0,1.5),b:wpt(0,0,len),t:now});while(S.tips.length&&now-S.tips[0].t>.16)S.tips.shift()}
function trailDraw(S,col){const T=S.tips;if(!T||T.length<2)return;const c=hex(col),now=time;
 for(let i=1;i<T.length;i++){const p=T[i-1],q=T[i],fa=clamp(1-(now-p.t)/.16,0,1),fb=clamp(1-(now-q.t)/.16,0,1);if(fa<=0&&fb<=0)continue;
  const ca=[c[0]*fa,c[1]*fa,c[2]*fa],cb=[c[0]*fb,c[1]*fb,c[2]*fb],wa=[fa*.9,fa*.9,fa*.9],wb=[fb*.9,fb*.9,fb*.9];
  ribbon(p.a,p.b,q.b,q.a,ca,ca,cb,cb);
  /* a hot white edge along the blade tip */
  const ea=[lerp(p.a[0],p.b[0],.8),lerp(p.a[1],p.b[1],.8),lerp(p.a[2],p.b[2],.8)],eb=[lerp(q.a[0],q.b[0],.8),lerp(q.a[1],q.b[1],.8),lerp(q.a[2],q.b[2],.8)];
  ribbon(ea,p.b,q.b,eb,wa,wa,wb,wb)}
 if(now-T[T.length-1].t>.16)T.length=0}
