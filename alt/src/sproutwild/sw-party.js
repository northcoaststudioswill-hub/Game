/* ================================================================
   THE PARTY IN THE FIELD (v6.2)
   Up to three buddies walk with you outside Sunkeep, and the A button
   sends them like sprouts: the ring locks on to a tree, a rock, an ore
   vein or a fiber thicket, and the buddy best at that job goes. Several
   can work at once. B calls them back with the sprouts.
   Open-field capture: throw sprouts at a wild buddy and they latch on
   and glow. Enough of them (kin count double) and it blooms and joins
   you right there; too few, or a bad roll, and it shakes them off and
   the fight starts.
   Field buddies are drawn at three quarters size so the screen breathes.
   ================================================================ */
const PSC=.75;
function pfSync(F){const alive=(F.base?SW.party.slice(0,1):SW.party).filter(m=>m.hp>0);F.pf=(F.pf||[]).filter(b=>alive.includes(b.m));
 for(const m of alive)if(!F.pf.some(b=>b.m===m))F.pf.push({m,x:P3.x+(Math.random()*16-8),y:P3.y+12,st:'follow',fx:1,mv:false,t:0})}
function pfJob(o){return o.k==='tree'||o.k==='rock'||o.k==='ore'||o.k==='fiber'?o.k:null}
function pfSkill(m,job){const sk=wkSkills({kind:'b',ref:m});
 if(job==='tree')return sk.LUMBERING||.5;if(job==='rock')return sk.QUARRY||.5;
 if(job==='ore')return(sk.QUARRY||sk.KINDLING)?2:1;if(job==='fiber')return(sk.PLANTING||sk.WATERING)?2:1;return 0}
function pfBest(F,o){const job=pfJob(o);if(!job||!F.pf)return null;let best=null,bl=0;
 for(const b of F.pf)if(b.st==='follow'){const l=pfSkill(b.m,job);if(l>bl){bl=l;best=b}}return best}
function pfSend(F,b,o){b.st='go';b.tg=o;b.job=pfJob(o);b.t=0;swSnd(520,.07,880);
 if(b.job==='ore'||b.job==='fiber'){if(!SW.lessons.fetch){SW.lessons.fetch=1;swSay('Buddies fetch what sprouts cannot: ORE and FIBER. The bench turns them into gear.',4)}}}
function pfTick(F,dt){pfSync(F);const n=F.pf.filter(b=>b.st==='follow').length;let i=0;
 for(const b of F.pf){b.mv=false;
  const go=(x,y,v,arr)=>{const dx=x-b.x,dy=y-b.y,d=Math.hypot(dx,dy);if(d<=arr)return true;const s=Math.min(d*5,v);b.x+=dx/d*s*dt;b.y+=dy/d*s*dt;b.mv=d>3;if(Math.abs(dx)>1)b.fx=dx<0?-1:1;return false};
  if(b.st==='follow'){const k=i++,bx=-F.dir[0],by=-F.dir[1],lx=-by,ly=bx,lat=n===1?0:(k%2?7:-7);
   const back=n===1?18:18+k*15,tx=P3.x+bx*back+lx*lat,ty=P3.y+4+by*back+ly*lat;go(tx,ty,110,3);continue}
  if(b.st==='ret'){if(go(P3.x,P3.y+8,130,22))b.st='follow';continue}
  const o=b.tg;if(!o||o.got){b.st='ret';continue}
  if(b.st==='go'){if(go(o.x+(b.x<o.x?-10:10),o.y+8,120,4)){b.st='work';b.t=0}continue}
  if(b.st==='work'){b.t+=dt;b.mv=((time*8+b.x)|0)%2===0;b.fx=b.x<o.x?1:-1;o.shake=.12;
   if(((b.t*4)|0)!==(((b.t-dt)*4)|0)){fSpark(o.x+(Math.random()*14-7),o.y-8-Math.random()*8,'#fff3b0');swSnd(b.job==='rock'||b.job==='ore'?180:260,.03,120)}
   if(b.job==='tree'||b.job==='rock'){o.hp-=(4+pfSkill(b.m,b.job)*4)*dt;if(o.hp<=0&&!o.got){wNodeDrop(o);b.st='ret'}}
   else if(b.t>=2.2){o.got=true;const q=1+pfSkill(b.m,b.job);SW.res[b.job]=(SW.res[b.job]||0)+q;
    W4.floats.push({x:o.x,y:o.y-20,txt:'+'+q+' '+b.job.toUpperCase()+' · '+b.m.sp,t:2,c:'#ffd94d'});swSnd(784,.08,1175);swSave();b.st='ret'}}}}
function pfRecall(F,wr){for(const b of F.pf||[])if(b.st!=='follow'&&Math.hypot(b.x-P3.x,b.y-P3.y)<wr+30)b.st='ret'}
function pfDraw(b,feet){const spr=wSp(b.m.sp)._spr,w=Math.round(spr.ow*PSC),h=Math.round(spr.oh*PSC),bob=b.mv?((time*8+b.x)|0)%2:0,X=Math.round(b.x),Y=Math.round(b.y);
 r('rgba(0,0,0,.22)',X-6,Y-1,12,3);
 if(b.fx>0&&spr.fable){g.save();g.translate(X+Math.round(w/2),Y-h+2-bob);g.scale(-1,1);g.drawImage(spr.ol,0,0,w,h);g.restore()}else g.drawImage(spr.ol,X-Math.round(w/2),Y-h+2-bob,w,h);
 if(b.st==='work'){const T=TYPES[wSp(b.m.sp).t[0]];r('#14101e',X-3,Y-h-6,7,7);r(T.c,X-2,Y-h-5,5,5)}
 if(feet)feet(b.x,b.y)}
/* ---------------- open-field capture ---------------- */
function pfNeed(wd){return 1+wd.lv}
function pfPin(wd){const F=W4.fld;return F&&F.pf&&F.pf.some(b=>b.st==='follow'&&Math.hypot(b.x-wd.x,b.y-wd.y)<70)?1:0}
function pfCan(F,wd){if(wBuddyFull())return false;const ty=wSp(wd.sp).t;return F.sq.filter(s=>s.st==='follow'||s.st==='latch').reduce((a,s)=>a+(ty.includes(s.type)?2:1),0)+pfPin(wd)>=pfNeed(wd)}
function pfStr(wd){const ty=wSp(wd.sp).t;return(wd.lat||[]).reduce((a,s)=>a+(ty.includes(s.type)?2:1),0)+((wd.lat||[]).length?pfPin(wd):0)}
function pfLatch(F,s,wd){wd.lat=wd.lat||[];if(!wd.lat.includes(s))wd.lat.push(s);s.st='latch';s.tg=wd;s.lt=0;wd.lt=0;wd.mv=false;
 if(wd.lat.length===1){swSnd(660,.06,990);if(!SW.lessons.fswarm){SW.lessons.fswarm=1;swSay('Latched on! Fill the bar and it blooms.',2.4)}}}
function pfWildTick(F,dt){for(const wd of W4.wilds.slice()){
 if(wd.cap){wd.cap.t+=dt;const t=wd.cap.t;
  if(t>=2.3){W4.wilds.splice(W4.wilds.indexOf(wd),1);W4.wildCd=14;for(const s of wd.lat||[]){s.st='ret';s.tg=null}
   if(wd.cap.ok){const m=wMakeMon(wd.sp,wd.lv);SW.seen[wd.sp]=1;SW.caught[wd.sp]=1;if(SW.party.length<3)SW.party.push(m);else SW.box.push(m);
    if(SW.quest===2){SW.quest=3}swSave();wCineMon(wd.sp,SW.party.includes(m)?'It bloomed right there in the grass and walks with you now.':'It bloomed in the grass. It is waiting at Sunkeep.')}
   else{for(const s of wd.lat||[])s.z=10;swSnd(200,.12,120);wEngage(wd.sp+' BROKE FREE!',()=>wStartWildAt(wd.sp,wd.lv))}}
  continue}
 if(!wd.lat||!wd.lat.length)continue;
 wd.lat=wd.lat.filter(s=>s.st==='latch'&&s.tg===wd);if(!wd.lat.length){wd.lt=0;continue}
 wd.lt=(wd.lt||0)+dt;const str=pfStr(wd),need=pfNeed(wd);
 if(str>=need&&wd.lt>1){const sp=wSp(wd.sp),p=Math.max(.2,Math.min(.9,.3+.12*(str-need)+(sp.catch||.4)*.4));
  wd.cap={t:0,ok:SW.quest<3||Math.random()<p}; /* the first catch always blooms */ /* the first catch is kind */swSnd(523,.12,784)}
 else if(wd.lt>3.6&&SW.quest<3){for(const s of wd.lat){s.st='ret';s.tg=null;s.z=10}wd.lat=[];wd.lt=0;W4.floats.push({x:wd.x,y:wd.y-24,txt:'IT SHOOK THEM OFF! THROW MORE.',t:1.8,c:'#ffd94d'});swSnd(300,.08,200)}
 else if(wd.lt>3.6){ /* it shakes them off and turns on you */
  for(const s of wd.lat){s.st='ret';s.tg=null;s.z=10}wd.lat=[];W4.wilds.splice(W4.wilds.indexOf(wd),1);W4.wildCd=14;
  wEngage(wd.sp+' SHOOK THEM OFF!',()=>wStartWildAt(wd.sp,wd.lv))}}}
function pfLatchPos(F,s,dt){const wd=s.tg;if(!wd||!W4.wilds.includes(wd)){s.st='ret';s.tg=null;return}const i=(wd.lat||[]).indexOf(s),n=Math.max(1,(wd.lat||[]).length),a=i/n*6.283+time*1.5;
 const rr=wd.cap?Math.max(2,10-wd.cap.t*5):10;s.x=wd.x+Math.cos(a)*rr;s.y=wd.y-4+Math.sin(a)*rr*.6;s.z=4+((time*10+i)|0)%2*2;s.mv=true}
function pfWildDraw(o,feet){const spr=wSp(o.sp)._spr,w=Math.round(spr.ow*PSC),h=Math.round(spr.oh*PSC),bob=o.mv?((time*8)|0)%2:0,X=Math.round(o.x),Y=Math.round(o.y);
 let sc=1,white=false;const c=o.cap;
 if(c){const t=c.t;if(t<1.8)white=((t*5)|0)%3===0;if(t>=1.8&&c.ok)sc=Math.max(0,1-(t-1.8)/.45);if(t>=1.8&&!c.ok)white=false}
 else if(o.lat&&o.lat.length){white=((time*4)|0)%4===0;const k=Math.min(1,pfStr(o)/pfNeed(o));
  r('#14101e',X-11,Y-h-9,22,4);r(k>=1?'#7ee787':'#ffd94d',X-10,Y-h-8,Math.round(20*k),2)}
 if(c||(o.lat&&o.lat.length)){const fl=.5+.5*Math.sin(time*8);g.globalAlpha=.18+.15*fl;r('#fff3b0',X-w/2-4,Y-h-2,w+8,h+6);g.globalAlpha=1;if(c)uiRays(X,Y-h/2,30+c.t*30,8,'#fff3b0',.18)}
 if(c&&c.t>=1.8&&c.ok){for(let i=0;i<12;i++){const a=i*.52+c.t*4,rad=6+(c.t-1.8)*80;r(i%2?'#fff3b0':'#7ee787',Math.round(X+Math.cos(a)*rad),Math.round(Y-h/2+Math.sin(a)*rad*.7),2,2)}}
 if(sc<=0)return;const ww=Math.max(1,Math.round(w*sc)),hh=Math.max(1,Math.round(h*sc));
 r('rgba(0,0,0,.22)',X-6,Y-1,12,3);const img=white&&spr.hol?spr.hol:spr.ol;
 if(o.fx>0&&spr.fable){g.save();g.translate(X+Math.round(ww/2),Y-hh+2-bob);g.scale(-1,1);g.drawImage(img,0,0,ww,hh);g.restore()}else g.drawImage(img,X-Math.round(ww/2),Y-hh+2-bob,ww,hh);
 if(!c&&Math.hypot(o.x-P3.x,o.y-P3.y)<90){const lt=(Math.hypot(o.x-P3.x,o.y-P3.y)<56?o.sp+' ':'')+'Lv'+o.lv,lw=tw(lt,1);r('rgba(10,14,8,.7)',X-lw/2-2,Y+3,lw+4,9);text(lt,X-lw/2,Y+4,1,'#ffe8b0',null)}
 if(!c&&feet)feet(o.x,o.y)}
