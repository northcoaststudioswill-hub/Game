/* ============================================================
   MUSIC VIDEO MODE
   A square (240 x 240) animation drawn with the game's own art and, for the
   gameplay shots, the game's own rules played by a small director bot.
   MV.frame(t) draws the picture for song time t. It is deterministic: the
   render page (bottie/video/) seeds Math.random per shot, so the same time
   always gives the same frame. The storyboard for each song is a list of
   shots: {a, b, init, step, draw}. Timings come from bottie/video/*.json,
   measured from the song itself.
   The game never calls any of this; only the render page does.
   ============================================================ */
const MV=(()=>{
 const PV=A.prev||{},S=240;let SH=[],CAPS=[],KICKS=[],BEAT=.4706,BEAT0=0,cur=-1,lt=-1,st=null;
 const ease=k=>k<0?0:k>1?1:k*k*(3-2*k),lerp=(a,b,k)=>a+(b-a)*k;
 const beatPh=t=>((t-BEAT0)/BEAT%1+1)%1,barNo=t=>Math.floor((t-BEAT0)/(BEAT*4));
 /* how hard the last kick is still hitting, 1 -> 0 */
 function kick(t){let k=0;for(const x of KICKS){if(x>t)break;const d=t-x;if(d<.22)k=Math.max(k,1-d/.22)}return k}
 function setKeys(o){for(const k in keys)keys[k]=0;for(const k in o)keys[k]=o[k]}
 function endStep(){for(const k in keys)PV[k]=keys[k]}

 /* ---- the director: plays a level the way a person would ---- */
 function botKeys(tick,o){const P=L.P,K={};o=o||{};
  const tileOf=e=>[clamp(Math.floor(e.x/TS),0,L.w-1),clamp(Math.floor((e.y-2)/TS),0,L.h-1)];
  const pathTo=(tx,ty,adj)=>{const s=tileOf(P);return bfs(s[0],s[1],(x,y)=>adj?Math.abs(x-tx)+Math.abs(y-ty)<=1:(x===tx&&y===ty))};
  const go=(x,y)=>{const dx=x-P.x,dy=y-P.y;if(Math.abs(dx)>1.5)K[dx>0?'right':'left']=1;if(Math.abs(dy)>1.5)K[dy>0?'down':'up']=1};
  const follow=p=>{if(!p||!p.length)return;const i=p.length>1?1:0,ax=Math.abs(p[i][0]-P.x),ay=Math.abs(p[i][1]-P.y);if(i&&ax>2&&ay>2&&Math.abs(p[0][0]-P.x)+Math.abs(p[0][1]-P.y)>6)go(p[0][0],p[0][1]);else go(p[i][0],p[i][1])};
  const fo=L.spawns.filter(s=>s.st==='follow').length;
  for(const d of L.doors)if(!d.open&&Math.hypot(d.x-P.x,d.y-(P.y-4))<26){d.open=true;L.blk[d.ty*L.w+d.tx]=0;burst(d.x,d.y,BLUE,10);ring(d.x,d.y,BLUE2,24)}
  if(L.heat>80&&L.vents.length){let bp=null;for(const v of L.vents){const p=pathTo(Math.floor(v.x/TS),Math.floor(v.y/TS));if(p&&(!bp||p.length<bp.length))bp=p}if(bp){if(bp.length>1)follow(bp);return K}}
  let best=null,bl=1e9;const cands=targets().filter(q=>q.type!=='gen').concat(L.doors.filter(d=>!d.open));
  for(const q of cands){if(o.skip&&o.skip(q))continue;const tx=q.k==='foe'?Math.floor(q.x/TS):q.tx,ty=q.k==='foe'?Math.floor((q.y-2)/TS):q.ty,p=pathTo(tx,ty,true);if(!p)continue;const len=p.length+(o.want&&o.want(q)?-6:0);if(len<bl){bl=len;best={q,p}}}
  if(best){const q=best.q,d=Math.hypot(q.x-P.x,(q.k==='foe'?q.y-8:q.y)-(P.y-6));
   if(q.k==='door'||d>44||best.p.length>4)follow(best.p.length>1?best.p:[[q.x,q.y+2]]);
   else{const a=aim();if(a.t!==q&&tick%6<2)go(q.x,q.k==='foe'?q.y:q.y+4);if(fo>0)K.a=1}}
  return K}
 /* one step of real gameplay; supers play out in full */
 function gameStep(dt,K){setKeys(K||{});
  if(G.s==='super'){G.sup.t+=dt;fxTick(dt);if(G.sup.t>=1.5){G.s='play';superHit(G.sup.S)}}
  else if(G.s==='play')play(dt);else if(G.s==='clear'||G.s==='fail'||G.s==='captcha'||G.s==='pause')G.s='play';
  G.t+=dt;endStep()}
 /* a gameplay shot. o.setup() after the level is built, o.dir(tt,tick) returns extra keys or does things at set times */
 function level(id,o){o=o||{};let tick=0;return{
  init(){SV.un=5;SV.drip=o.drip||0;G.mv=1;build(id);G.s='play';G.cap=G.toast=G.tip=null;G.supI=o.sup||0;L.tok=o.tok===undefined?12:o.tok;tick=0;L.def=Object.assign({},L.def,{limit:0});if(o.setup)o.setup();
   /* warm: play this many seconds before the shot starts, so it opens in the thick of it */
   for(let w=0;w<(o.warm||0);w+=1/30){tick++;gameStep(1/30,o.auto===false?{}:botKeys(tick,o))}if(o.ready)o.ready()},
  step(dt,tt){for(let n=0;n<(o.speed||1);n++){tick++;let K=o.auto===false?{}:botKeys(tick,o);if(o.dir){const x=o.dir(tt,tick,K);if(x)K=x}gameStep(dt,K)}},
  draw(tt){drawWorld();drawSlam();if(G.s==='super')drawOverlay();if(o.over)o.over(tt)}}}
 /* a drawn shot: just a picture as a function of time */
 const pic=f=>({init(){G.mv=1;G.s='mv'},step(){},draw:f});

 function load(sb){SH=sb.shots;CAPS=sb.caps||[];KICKS=sb.kicks||[];BEAT=sb.beat||BEAT;BEAT0=sb.beat0||0;cur=-1;lt=-1}
 function caption(t){const c=CAPS.find(c=>t>=c.a&&t<c.b);if(!c)return;const ls=wrap(c.s,S-20,2),h=ls.length*13+6,y=S-h-6,k=Math.min(1,(t-c.a)*10);
  g.globalAlpha=.82*k;r('#04060e',0,y,S,h);g.globalAlpha=k;r(BLUE,0,y,S,1);ls.forEach((l,i)=>{const w=tw(l,2);text(l,Math.round((S-w)/2),y+4+i*13,2,'#fff','#04060e')});
  if(c.ad&&t-c.a>(c.b-c.a)*.55){const w=tw(c.ad,2);g.globalAlpha=1;text(c.ad,Math.round((S-w)/2),y-14,2,BLUE2,'#04060e')}g.globalAlpha=1}
 function frame(t){H=S;G.mv=1;const dt=1/30;let i=SH.findIndex(s=>t>=s.a&&t<s.b);if(i<0)i=SH.length-1;const sh=SH[i];
  if(i!==cur||t<lt-1e-6){cur=i;if(A.seed)A.seed(1000+i*77);sh.init();st=sh.a;lt=sh.a}
  while(st+dt<=t+1e-6){sh.step(dt,st-sh.a);st+=dt}lt=t;
  const tt=t-sh.a,kk=kick(t),z=1+.025*kk*(sh.pulse===undefined?1:sh.pulse);
  G.t=t;g.save();r('#04050a',0,0,S,S);g.translate(S/2,S/2);g.scale(z,z);g.translate(-S/2,-S/2);sh.draw(tt,t);g.restore();
  /* cut flash at the start of a shot */
  if(tt<.1&&sh.cut!==0){g.globalAlpha=(1-tt/.1)*.5;r('#fff',0,0,S,S);g.globalAlpha=1}
  if(sh.cap!==0)caption(t)}
 return{frame,load,level,pic,kick,beatPh,barNo,ease,lerp,S,get shots(){return SH},boards:{}}})();
