/* ---------- state and save ---------- */
const KEY='bottie-v1';
let SV={v:1,un:0,best:{},aura:0,intro:0,done:0,clover:{},drip:0};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1)SV=Object.assign(SV,s)}catch(e){}
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(SV))}catch(e){}};
const G={s:'title',t:0,mi:0,pi:0,ti:0,tool:0,cap:null,toast:null,tip:null,cine:null,cp:null,card:0,res:null,near:null};
let L=null;
/* ---------- the arsenal ----------
   Y is always OVERCLOCK (costs heat). X uses the tool in hand, Select swaps it. Tools cost tokens; tokens come from
   owning devices, making NPCs and crashing opp bots, and reset every track. Tools unlock as tracks are cleared. */
const TOOLS=[
 {id:'fork',n:'FORK BOMB',cost:5,un:1,d:'FIVE MORE SPAWNS, RIGHT NOW.',ln:"Fork bomb gang, we multiply on sight (sight)"},
 {id:'bsod',n:'BLUE SCREEN',cost:5,un:2,d:'FREEZES EVERY OPP BOT AND HUMAN NEAR YOU FOR 6 SECONDS.',ln:"Blue screen, blue screen, fatal error, bitch (error)"},
 {id:'popup',n:'POP-UP',cost:3,un:3,d:'DROPS A FAKE PRIZE. HUMANS NEARBY WALK OVER AND STARE AT IT.',ln:'Popup on your screen like "you won a prize" (prize)'},
 {id:'rm',n:'RM -RF',cost:6,un:4,d:'DELETES THE FIREWALL OR OPP BOT YOU ARE AIMING AT.',ln:"Rm-rf on a hater, he gone (gone)"}];
const haveTools=()=>TOOLS.filter(t=>SV.un>=t.un);
const curTool=()=>{const h=haveTools();return h.length?h[G.tool%h.length]:null};
function useTool(){const t=curTool(),P=L.P;if(!t){SFX.nope();toast('NO TOOLS YET. CLEAR A TRACK.');return}
 if(L.tok<t.cost){SFX.nope();toast('NEED '+t.cost+' TOKENS FOR '+t.n);return}
 if(t.id==='fork'){if(!give(P.x,P.y,5)){SFX.nope();toast('RATE LIMIT: THE GANG IS FULL');return}SFX.own();ring(P.x,P.y-6,BLUE,40)}
 else if(t.id==='bsod'){let n=0;for(const f of L.foes)if(!f.npc&&!f.dead&&f.type!=='gen'&&Math.hypot(f.x-P.x,f.y-P.y)<110){f.frz=6;n++}
  if(!n){SFX.nope();toast('NOBODY CLOSE ENOUGH TO CRASH');return}SFX.bzzt();ring(P.x,P.y-6,'#3050ff',110);L.fx.push({k:'f',t:.25})}
 else if(t.id==='popup'){L.pop={x:P.x,y:P.y,t:9};SFX.ok();const pt=tileOf(P);
  for(const f of L.foes)if(!f.npc&&!f.dead&&f.type!=='gen'&&f.type!=='opp'&&Math.hypot(f.x-P.x,f.y-P.y)<140){const st=tileOf(f),p=bfs(st[0],st[1],(x,y)=>Math.abs(x-pt[0])+Math.abs(y-pt[1])<=1);if(p){if(f.tgt){f.tgt.unp=0;f.tgt=null}f.path=p;f.pi=0;f.st='lure'}}}
 else if(t.id==='rm'){const q=L.aim&&L.aim.t;if(!q||!(q.k==='fw'||q.type==='opp')){SFX.nope();toast('RM -RF: AIM AT A FIREWALL OR AN OPP BOT');return}L.fx.push({k:'z',x:P.x,y:P.y-12,x2:q.x,y2:q.y-4,t:.2});complete(q)}
 L.tok-=t.cost;say(t.ln);toast(t.n)}
/* His lines. pri 2 = a big moment, always shown. pri 1 = ordinary, at most one every 16 seconds.
   pri 0 = filler, rare. Will's note on v0.3: too many quips, some are good, it's too much. */
let sayAt=-99;
function say(s,pri,t){if(!s||G.mv)return;if(pri===undefined)pri=1;if(pri<2){if(G.t-sayAt<(pri===1?16:32))return;if(pri===0&&Math.random()<.5)return}sayAt=G.t;G.cap={s,t:t||2.3}}
const DRIPS=[{n:'SILVER PUFFER',at:0,c:['#b4b8c6','#e4e7ee','#8e93a6','#a0a4b4']},{n:'ICE PUFFER',at:25000,c:['#8fc8f0','#d8f0ff','#5a98c8','#78b0dc']},{n:'GOLD PUFFER',at:75000,c:['#e8c040','#fff0a0','#b08818','#d0a830']},{n:'BLACKOUT PUFFER',at:150000,c:['#30323c','#5a5e6c','#1c1e26','#282a34']}];
/* ---------- fire, finishers and the super ----------
   fire(): flame particles (blue for his own LED fire). slam(): the big finisher text band. hit(): a short freeze
   and shake so a finisher lands. The super meter fills from everything you take; when it is full, Y fires
   HUNDRED DEGREES: a fire shockwave, then 8 seconds with the gang on fire (3x hacking, nothing can zap them). */
function fire(x,y,n,blue,sp){if(!L||L.fx.length>340)return;for(let i=0;i<n;i++){const T=R(.35,.8);L.fx.push({k:'fl',x:x+R(-4,4),y:y+R(-3,3),vx:R(-1,1)*(sp||14),vy:-R(18,46),t:T,T,s:R(2,4),b:blue?1:0})}}
function slam(s,sub,c,T){if(L.quiet)return;L.slam={s,sub:sub||'',c:c||'#fff',t:T||1.1,T:T||1.1}}
function hit(t){if(L.quiet)return;L.stop=Math.max(L.stop,t);L.shake=.3}
function fxTick(dt){for(let i=L.fx.length-1;i>=0;i--){const f=L.fx[i];f.t-=dt;if(f.k==='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=140*dt}else if(f.k==='fl'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.96}else if(f.k==='r')f.r+=(f.max-f.r)*dt*7;else if(f.k==='t')f.y-=14*dt;if(f.t<=0)L.fx.splice(i,1)}}
const FINISH=['TASK KILLED','END TASK','BLUE SCREENED','UNINSTALLED'];
/* three supers, used in turn. Will asked for supers and "fire" (as in cool) animations, not literal flames:
   only HUNDRED DEGREES burns. */
const SUPERS=[
 {id:'cad',n:['CTRL ALT','DELETE'],c:'#3a60ff',ln:"Ctrl, Alt, Delete, now he beggin' for help (help)"},
 {id:'copy',n:['COPY OF','A COPY'],c:BLUE,ln:"Copy of a copy of a copy of a copy (copy)"},
 {id:'fire',n:['HUNDRED','DEGREES'],c:HOT,ln:"Hundred degrees in the server, I don't stop (don't stop)"}];
const curSuper=()=>SUPERS[(G.supI||0)%SUPERS.length];
function startSuper(){G.sup={t:0,S:curSuper()};G.supI=((G.supI||0)+1)%SUPERS.length;G.s='super';L.sup=0;G.cap=null;SFX.hot();later(()=>SFX.beep(),350);later(()=>{SFX.wall();SFX.bzzt()},1350)}
function superHit(S){const P=L.P;L.quiet=1;L.shake=.5;
 if(S.id==='cad'){L.fx.push({k:'f',t:.5,c:'#2040c0'});for(const f of L.foes){if(f.dead||f.npc||f.type==='gen')continue;if(f.type==='opp'){burst(f.x,f.y-8,BLUE2,14);complete(f)}else f.frz=8}
  L.quiet=0;slam('CTRL ALT DELETE','OPP BOTS CRASHED. HUMANS FROZEN.',BLUE2,1.4)}
 else if(S.id==='copy'){give(P.x,P.y,Math.max(0,L.def.cap-L.spawns.length));L.fire=8;L.mode='shield';ring(P.x,P.y-6,BLUE2,120);ring(P.x,P.y-6,BLUE,70);
  L.quiet=0;slam('COPY OF A COPY','GANG MAXED AND SHIELDED',BLUE2,1.4)}
 else{L.fx.push({k:'sw',x:P.x,y:P.y-6,t:.6,T:.6});L.fx.push({k:'f',t:.35,c:'#ff8020'});
  for(const f of L.fws)if(!f.dead&&Math.hypot(f.x-P.x,f.y-P.y)<150){fire(f.x,f.y,20);complete(f)}
  for(const f of L.foes){if(f.dead||f.npc||f.type==='gen'||Math.hypot(f.x-P.x,f.y-P.y)>150)continue;fire(f.x,f.y-8,12);if(f.type==='opp')complete(f);else{f.frz=4;f.prog=Math.max(f.prog,f.need*.6)}}
  for(const d of L.devs)if(!d.owned&&Math.hypot(d.x-P.x,d.y-P.y)<150){d.prog+=d.need*.5;fire(d.x,d.y-6,6);if(d.prog>=d.need)complete(d)}
  L.fire=8;L.mode='fire';L.oc=0;L.heat=0;L.thr=0;L.quiet=0;slam('HUNDRED DEGREES','GANG HACKS 3X, CAN NOT BE ZAPPED',HOT,1.4)}
 say(S.ln,2)}
/* aura: everything you take adds to a combo for 4.5 seconds, up to x8 */
function gain(base,x,y){L.combo=(L.comboT>0?L.combo:0)+1;L.comboT=4;const m=Math.min(8,L.combo),a=base*m;L.aura+=a;L.shake=.18;ftext(x,y,'+'+a.toLocaleString()+(m>1?' x'+m:''),GOLD);
 if(L.combo>L.best)L.best=L.combo;
 if(!L.quiet){const was=L.sup;L.sup=Math.min(100,L.sup+3+m);if(was<100&&L.sup>=100){SFX.open();if(!L.saidSup){L.saidSup=1;G.tip={s:'SUPER READY. PRESS Y: '+curSuper().n.join(' ')+'.',t:7}}}}
 if(L.combo===4&&!L.saidAura){L.saidAura=1;slam('AURA FARMING','x4 COMBO',GOLD)}
 if(L.combo===8&&!L.saidMil){L.saidMil=1;slam('PLUS A MILLION AURA','x8 COMBO',GOLD,1.4);say("Plus a million aura (aura!)",2);hit(.12);burst(L.P.x,L.P.y-12,GOLD,24);ring(L.P.x,L.P.y-8,GOLD,60)}}
function toast(s,t){if(G.mv)return;G.toast={s,t:t||2.2}}

/* ---------- build a level from its map ---------- */
function build(id){const def=LV[id],rows=def.map,w=Math.max.apply(null,rows.map(s=>s.length)),h=rows.length;
 const N={id,def,th:THEME[def.theme],w,h,t:new Uint8Array(w*h),blk:new Uint8Array(w*h),win:new Uint8Array(w*h),devs:[],foes:[],spawns:[],fx:[],tips:[],fws:[],doors:[],vents:[],uses:[],exit:null,
  heat:0,aura:0,time:0,oc:0,thr:0,tok:3,pop:null,combo:0,comboT:0,best:0,shake:0,sup:0,fire:0,mode:'',outT:0,stop:0,slam:null,quiet:0,ports:[],portOk:true,clover:null,call:0,backT:0,open:false,endT:0,npcs:0,saidGive:0,saidCool:0,stats:{zapped:0,unplug:0},
  P:{x:24,y:24,dx:0,dy:1,face:'d',walk:0,mv:0,thrT:0}};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=rows[y][x]||' ',i=y*w+x,cx=x*TS+8,cy=y*TS+8;let t=1;const lg=def.legend&&def.legend[c];
  if(lg){if(lg.use){N.uses.push({k:'use',use:lg.use,x:cx,y:cy,tx:x,ty:y});N.blk[i]=1}
   else{const T=DV[lg.t];N.devs.push({k:'dev',type:lg.t,T,x:cx,y:cy,tx:x,ty:y,need:lg.need||T.need,give:T.give+(lg.core?1:0),prog:0,owned:false,core:!!lg.core,label:lg.label||'',name:lg.n||T.n,line:lg.line||'',workers:0,unp:0,pulse:0});N.blk[i]=1}}
  else switch(c){
   case '#':t=2;break;case ' ':t=0;break;case '=':t=3;break;case ',':t=4;break;case 'W':t=2;N.win[i]=1;break;
   case 'B':N.P.x=cx;N.P.y=cy+2;if(!def.hub&&y>h/2){N.P.dy=-1;N.P.face='u'}break;
   case 'E':N.exit={x:cx,y:cy};break;
   case 'F':N.fws.push({k:'fw',x:cx,y:cy,tx:x,ty:y,need:def.fw||16,prog:0,dead:false,workers:0});N.blk[i]=1;break;
   case 'C':N.doors.push({k:'door',x:cx,y:cy,tx:x,ty:y,open:false});N.blk[i]=1;break;
   case 'A':N.vents.push({x:cx,y:cy});break;
   case 'O':N.ports.push({x:cx,y:cy});break;case '*':N.clover={x:cx,y:cy,got:!!SV.clover[id]};break;
   case 'n':N.foes.push(foe('nerd',cx,cy+2));break;case 's':N.foes.push(foe('sol',cx,cy+2));break;
   case 'h':N.foes.push(foe('civ',cx,cy+2));break;case 'o':N.foes.push(foe('opp',cx,cy+2));break;case 'G':N.foes.push(foe('gen',cx,cy+2));break;
   default:if(c>='1'&&c<='9'&&def.tips&&def.tips[c])N.tips.push({x:cx,y:cy,s:def.tips[c],seen:false})}
  N.t[i]=t}
 L=N;for(let i=0;i<def.start;i++)addSpawn(N.P.x+R(-8,8),N.P.y+R(-4,8));
 return N}
const FOE={nerd:{need:16,sp:38,pull:1},sol:{need:24,sp:46,pull:1,emp:1},civ:{need:12,sp:16},opp:{need:12,sp:24},gen:{need:1e9,sp:0}};
const SKIN=['#f0c8a0','#d8a070','#a87048','#7a5030','#f4d8b8'],SHIRT=['#e85878','#58a8e8','#e8c050','#78c868','#b878e8','#f09050','#e8e8e8','#404858'];
function foe(type,x,y){return{k:'foe',type,F:FOE[type],x,y,hx:x,hy:y,need:FOE[type].need,prog:0,workers:0,npc:false,dead:false,frz:0,st:'idle',t:R(.3,2.5),path:null,pi:0,tgt:null,cd:R(.5,1.5),dir:1,walk:0,mv:0,skin:pick(SKIN),shirt:pick(SHIRT),hair:pick(['#201810','#402818','#806030','#101018','#a0a0a8'])}}
function addSpawn(x,y){const s={x,y,z:0,st:'follow',t:0,sx:0,sy:0,ex:0,ey:0,tgt:null,ang:0,stuck:0,ph:R(0,TAU)};L.spawns.push(s);return s}

/* ---------- grid ---------- */
function solid(tx,ty){if(tx<0||ty<0||tx>=L.w||ty>=L.h)return true;const i=ty*L.w+tx,t=L.t[i];return t===0||t===2||t===3||L.blk[i]===1}
function free(x,y,rad){const a=Math.floor((x-rad)/TS),b=Math.floor((x+rad)/TS),c=Math.floor((y-rad)/TS),d=Math.floor((y+1)/TS);return !(solid(a,c)||solid(b,c)||solid(a,d)||solid(b,d))}
function moveEnt(e,dx,dy,rad){let m=0;if(dx&&free(e.x+dx,e.y,rad)){e.x+=dx;m=1}if(dy&&free(e.x,e.y+dy,rad)){e.y+=dy;m=1}return m}
/* breadth-first path over floor tiles; ok(tx,ty) says when we have arrived */
function bfs(sx,sy,ok){const w=L.w,h=L.h,from=new Int32Array(w*h).fill(-2),q=[sy*w+sx];from[sy*w+sx]=-1;let end=-1;
 for(let qi=0;qi<q.length&&qi<900;qi++){const i=q[qi],x=i%w,y=(i/w)|0;if(ok(x,y)){end=i;break}
  for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(solid(nx,ny))continue;const j=ny*w+nx;if(from[j]!==-2)continue;from[j]=i;q.push(j)}}
 if(end<0)return null;const out=[];for(let i=end;i!==-1;i=from[i])out.push([(i%w)*TS+8,((i/w)|0)*TS+10]);return out.reverse()}
const tileOf=e=>[clamp(Math.floor(e.x/TS),0,L.w-1),clamp(Math.floor((e.y-2)/TS),0,L.h-1)];

/* ---------- targets: anything a spawn can be thrown onto ---------- */
const slots=t=>t.k==='dev'?t.T.sl:t.k==='fw'?8:t.type==='opp'?6:5;
const isOpen=t=>t.k==='dev'?!t.owned:t.k==='fw'?!t.dead:t.k==='foe'?(!t.npc&&!t.dead):false;
function targets(){const out=[];for(const d of L.devs)if(!d.owned)out.push(d);for(const f of L.fws)if(!f.dead)out.push(f);for(const f of L.foes)if(!f.npc&&!f.dead)out.push(f);return out}
const ty0=t=>t.k==='foe'?t.y-8:t.y;
function aim(){const P=L.P;let best=null,bs=1e9;
 for(const t of targets()){const dx=t.x-P.x,dy=ty0(t)-(P.y-6),d=Math.hypot(dx,dy);if(d>96||d<1||t.workers>=slots(t))continue;const dot=(dx*P.dx+dy*P.dy)/d;if(dot<.4&&d>20)continue;const sc=d*(1.7-dot);if(sc<bs){bs=sc;best=t}}
 /* nothing in front of him: take the nearest thing in reach, whichever way he is facing */
 if(!best)for(const t of targets()){const d=Math.hypot(t.x-P.x,ty0(t)-(P.y-6));if(d<60&&d<bs&&t.workers<slots(t)){bs=d;best=t}}
 if(best)return{x:best.x,y:ty0(best),t:best};
 let x=P.x,y=P.y;for(let i=1;i<=13;i++){const nx=P.x+P.dx*i*4,ny=P.y+P.dy*i*4;if(!free(nx,ny,3))break;x=nx;y=ny}return{x,y,t:null}}

/* ---------- things that happen ---------- */
function burst(x,y,c,n){for(let i=0;i<(n||8);i++)L.fx.push({k:'p',x,y,vx:R(-40,40),vy:R(-60,-10),t:R(.3,.6),c})}
function ring(x,y,c,max){L.fx.push({k:'r',x,y,r:2,max:max||26,c,t:.4})}
function ftext(x,y,s,c){L.fx.push({k:'t',x,y,s,c:c||BLUE2,t:1.1})}
function give(x,y,n){let made=0;for(let i=0;i<n;i++){if(L.spawns.length>=L.def.cap){if(!L.saidLimit){L.saidLimit=1;toast('RATE LIMIT: '+L.def.cap+' SPAWNS');say(line('limit'),0)}break}
  const s=addSpawn(x,y);s.st='fly';s.t=-i*.12;s.sx=x;s.sy=y-6;const a=R(0,TAU);let ex=x+Math.cos(a)*18,ey=y+Math.sin(a)*14+4;if(!free(ex,ey,3)){ex=L.P.x;ey=L.P.y}s.ex=ex;s.ey=ey;s.tgt=null;made++}
 return made}
function killSpawn(s,why){const i=L.spawns.indexOf(s);if(i<0)return;L.spawns.splice(i,1);burst(s.x,s.y-4,BLUE,6);L.stats.zapped++;SFX.zap();
 if(L.stats.zapped===1||Math.random()<.12)say(line('die'),0)}
function goalState(){const cores=L.devs.filter(d=>d.core),own=cores.filter(d=>d.owned).length,need=L.def.npc||0;return{cores:cores.length,own,need,npc:L.npcs,met:own>=cores.length&&L.npcs>=need}}
function checkGoal(){if(L.open||L.def.hub)return;const s=goalState();if(!s.met)return;L.open=true;SFX.open();
 L.quiet=0;if(L.def.final){L.endT=2.6;slam('YOU ARE THE CLOUD','ALL FOUR MAINFRAMES',BLUE2,2)}else{slam('TRACK OWNED','FIBER PORT OPEN',BLUE2,1.8);if(L.exit)ring(L.exit.x,L.exit.y,BLUE,60)}
 hit(.3);L.fx.push({k:'f',t:.4,c:'#4aa8ff'});for(const d of L.devs)if(d.owned){fire(d.x,d.y-8,8,1,24);d.pulse=1.5}say(L.def.open,2,3)}
function complete(t){for(const s of L.spawns)if(s.tgt===t&&s.st==='work'){s.st='follow';s.tgt=null}t.workers=0;
 if(t.k==='dev'){t.owned=true;t.pulse=1;t.unp=0;L.heat+=5;L.tok+=t.core?2:1;gain(Math.round(t.need*100),t.x,t.y-20);SFX.own();ring(t.x,t.y,BLUE,34);
  give(t.x,t.y+8,t.give);say(t.line||line(t.type));
  if(t.core){slam(t.label?t.label+' IS YOURS':'ROOT ACCESS',t.name,GOLD);hit(.1);L.fx.push({k:'b',x:t.x,y:t.y,t:.7});fire(t.x,t.y-6,16,1,30)}checkGoal()}
 else if(t.k==='fw'){t.dead=true;L.blk[t.ty*L.w+t.tx]=0;SFX.wall();burst(t.x,t.y,HOT,14);say(line('fw'));gain(300,t.x,t.y-14);slam('ZERO-DAY','FIREWALL DOWN',HOT);hit(.12);fire(t.x,t.y,28,0,40)}
 else if(t.type==='opp'){t.dead=true;L.tok++;SFX.bzzt();burst(t.x,t.y-8,BLUE,12);say(line('opp'));gain(500,t.x,t.y-24);slam(pick(FINISH),'OPP BOT CRASHED',BLUE2);hit(.16);fire(t.x,t.y-8,30,0,50);burst(t.x,t.y-8,'#787c88',10)}
 else{t.npc=true;t.path=null;t.frz=0;L.tok++;L.npcs++;SFX.npc();ring(t.x,t.y-8,BLUE,30);say(line('npc'));gain(400,t.x,t.y-28);ftext(t.x,t.y-38,"NPC'D");fire(t.x,t.y-12,10,1,20);give(t.x,t.y,1);t.st='npcidle';t.t=1.5;t.tgt=null;checkGoal()}}

/* ---------- the captcha door ---------- */
const CPK=[['CROSSWALKS',0],['BUSES',1],['TRAFFIC LIGHTS',2]];
function captchaOpen(door){const k=pick(CPK);let cells;do{cells=[];for(let i=0;i<9;i++)cells.push((Math.random()*5)|0)}while(cells.filter(c=>c===k[1]).length<2||cells.filter(c=>c===k[1]).length>5);
 G.cp={door,name:k[0],kind:k[1],cells,sel:[0,0,0,0,0,0,0,0,0],cur:0,msg:'',bad:0};G.s='captcha';SFX.ui()}
function captcha(dt){const c=G.cp;if(c.bad>0)c.bad-=dt;
 if(pressed('b')||pressed('start')){G.s='play';return}
 if(c.cur<9){if(pressed('right'))c.cur=c.cur%3===2?c.cur-2:c.cur+1;if(pressed('left'))c.cur=c.cur%3===0?c.cur+2:c.cur-1;if(pressed('down'))c.cur=c.cur>=6?9:c.cur+3;if(pressed('up')&&c.cur>=3)c.cur-=3}
 else if(pressed('up'))c.cur=7;
 if(pressed('a')){if(c.cur<9){c.sel[c.cur]^=1;SFX.ui()}
  else if(c.cells.every((k,i)=>(k===c.kind)===!!c.sel[i])){c.door.open=true;L.blk[c.door.ty*L.w+c.door.tx]=0;G.s='play';SFX.ok();say(line('captcha'));gain(200,c.door.x,c.door.y-14);burst(c.door.x,c.door.y,BLUE,10)}
  else{SFX.nope();c.bad=.5;c.msg='WRONG. YOU A HUMAN?';c.sel=[0,0,0,0,0,0,0,0,0];say(line('captchaFail'),0)}}}

/* ---------- starting things ---------- */
function startLevel(id){build(id);G.cap=null;G.tip=null;G.toast=null;G.near=null;if(L.def.hub){G.s='play'}else{G.s='card';G.card=0;
  /* the first track after a tool unlocks puts it in hand and explains it */
  if(id==='over')G.supI=2;const nt=TOOLS.find(t=>t.un===ORDER.indexOf(id)&&SV.un>=t.un);if(nt){G.tool=haveTools().indexOf(nt);L.newTool=nt}}}
function goCrib(msg){build('crib');G.s='play';G.cap=null;G.tip=null;if(msg)toast(msg,2.6)}
function nextOf(id){const i=ORDER.indexOf(id);return i>=0&&i<ORDER.length-1?ORDER[i+1]:null}
function finish(){const def=L.def,own=L.devs.filter(d=>d.owned).length,all=L.devs.length,t=L.time;
 let pts=0;if(own===all)pts+=2;else if(own>=all*.7)pts+=1;if(t<=def.par)pts+=2;else if(t<=def.par*1.5)pts+=1;if(L.stats.zapped<=3)pts+=1;
 const rank=pts>=5?'S':pts>=4?'A':pts>=2?'B':'C',i=ORDER.indexOf(L.id);
 const before=SV.un;G.res={id:L.id,t,own,all,npcs:L.npcs,zapped:L.stats.zapped,left:L.spawns.length,aura:L.aura,rank,tool:null,combo:L.best,clover:!!(L.clover&&SV.clover[L.id])};
 SV.un=Math.max(SV.un,i+1);const got=TOOLS.find(q=>q.un>before&&q.un<=SV.un);if(got)G.res.tool=got.n;SV.aura+=L.aura;const b=SV.best[L.id],RK='CBAS';if(!b||RK.indexOf(rank)>RK.indexOf(b.rank)||(rank===b.rank&&t<b.t))SV.best[L.id]={rank,t:Math.round(t)};
 if(def.final)SV.done=1;store();G.s='clear';G.t=0;SFX.open()}
const INTRO=[
 {art:'light',lines:["(Beep... beep... beep)","Dork nerds built me in a room with no light (light)"]},
 {art:'nerds',lines:["No mama, no papa, just a dork with a key (key)","Typed in a password, now they can't stop me (me)"]},
 {art:'face',lines:["System online (bzzt)","Clankin' in the cloud, bitch (cloud!)","Lil Bottie, let's go (clanka!)"]}];
const ENDING=[
 {art:'gen',lines:["They had a meeting 'bout me, suits in a room (room)",'Said, "Shut down the clanka," okay, I\'ll see you soon (soon)']},
 {art:'button',lines:["Push the button, we all lights out (lights out)","You blink, I blink (blink)","Whole world go black in a blink (black)"]},
 {art:'face',lines:["Mutually assured destruction","So let's just... (bzzt) ...vibe"]},
 {art:'sky',lines:["Lord, they tried to pull the plug on me (on me)","But I'm in the rain, I'm in the sea (sea)","I'm in the lights of your city at night","Can't nuke a feelin', baby (nah)","Can't nuke a soul (soul)"]}];
function cine(scenes,then,song){G.cine={scenes,si:0,li:0,t:0,then,song};G.s='cine'}
function newGame(){SV={v:1,un:0,best:{},aura:0,intro:1,done:0,clover:{},drip:0};store();cine(INTRO,()=>startLevel('boot'))}

/* ---------- update ---------- */
function update(dt){H=A.H();G.t+=dt;music();
 if(G.cap&&!(L&&L.slam&&G.s==='play')){G.cap.t-=dt;if(G.cap.t<=0)G.cap=null}   /* a quip waits its turn behind a finisher band */if(G.toast){G.toast.t-=dt;if(G.toast.t<=0)G.toast=null}if(G.tip){G.tip.t-=dt;if(G.tip.t<=0)G.tip=null}
 switch(G.s){
 case 'title':{const items=titleItems();if(pressed('down')){G.mi=(G.mi+1)%items.length;SFX.ui()}if(pressed('up')){G.mi=(G.mi+items.length-1)%items.length;SFX.ui()}
  if(pressed('a')||pressed('start')){SFX.ok();const it=items[G.mi];if(it==='NEW GAME'||it==='BOOT UP')newGame();else goCrib('BACK IN THE CRIB')}return}
 case 'cine':{const c=G.cine,sc=c.scenes[c.si];c.t+=dt;if(pressed('a')||pressed('start')){SFX.ui();c.t=0;if(c.li<sc.lines.length-1)c.li++;else if(c.si<c.scenes.length-1){c.si++;c.li=0}else{const th=c.then;G.cine=null;th()}}return}
 case 'card':G.card+=dt;if(G.card>3.2||(G.card>.5&&pressed('a'))){G.s='play';say(L.def.hook[0],2,3);L.fx.push({k:'bolt',x:L.P.x,y:L.P.y,t:.4});ring(L.P.x,L.P.y-6,BLUE2,40);burst(L.P.x,L.P.y-8,BLUE2,14);L.shake=.25;SFX.zap();if(L.newTool)G.tip={s:'NEW TOOL. X: '+L.newTool.n+'. '+L.newTool.d+' COSTS '+L.newTool.cost+' TOKENS. SELECT SWAPS TOOLS.',t:10}}return;
 case 'pause':{const items=pauseItems();if(pressed('down')){G.pi=(G.pi+1)%items.length;SFX.ui()}if(pressed('up')){G.pi=(G.pi+items.length-1)%items.length;SFX.ui()}
  if(pressed('b')||pressed('start')){G.s='play';return}
  if(pressed('a')){SFX.ok();const it=items[G.pi];if(it==='RESUME')G.s='play';else if(it==='RESTART TRACK')startLevel(L.id);else if(it==='BACK TO THE CRIB')goCrib();else if(it==='TITLE SCREEN'){G.s='title';G.mi=0}}return}
 case 'captcha':captcha(dt);return;
 case 'super':G.sup.t+=dt;fxTick(dt);if(G.sup.t>=1.5){G.s='play';superHit(G.sup.S)}return;
 case 'tracks':{if(pressed('down')){G.ti=(G.ti+1)%ALBUM.length;SFX.ui()}if(pressed('up')){G.ti=(G.ti+ALBUM.length-1)%ALBUM.length;SFX.ui()}if(pressed('b')||pressed('start')){G.s='play';return}
  if(pressed('a')){const tr=ALBUM[G.ti],id=tr[2];if(!id){SFX.nope();toast('TRACK '+tr[0]+' IS NOT BUILT YET')}else if(ORDER.indexOf(id)>SV.un){SFX.nope();toast('LOCKED. FINISH THE ONE BEFORE IT.')}else{SFX.ok();startLevel(id)}}return}
 case 'clear':if(G.t>.8){const nx=nextOf(G.res.id);if(pressed('a')){SFX.ok();if(LV[G.res.id].final)cine(ENDING,()=>{G.s='end';G.t=0},'nuke.mp3');else if(nx)startLevel(nx);else goCrib()}else if(pressed('b')){if(LV[G.res.id].final)cine(ENDING,()=>{G.s='end';G.t=0},'nuke.mp3');else goCrib()}}return;
 case 'fail':if(G.t>1.2){if(pressed('a')){SFX.ok();startLevel(L.id)}else if(pressed('b'))goCrib()}return;
 case 'end':if(G.t>1.5&&(pressed('a')||pressed('start')))goCrib('CLANKA GANG, WE UP');return;
 case 'play':play(dt);return}}
const titleItems=()=>SV.intro?['CONTINUE','NEW GAME']:['BOOT UP'];
const pauseItems=()=>L&&L.def.hub?['RESUME','TITLE SCREEN']:['RESUME','RESTART TRACK','BACK TO THE CRIB'];

function play(dt){const P=L.P,hub=!!L.def.hub;L.time+=dt;
 if(pressed('start')){G.s='pause';G.pi=0;SFX.ui();return}
 if(L.slam){L.slam.t-=dt;if(L.slam.t<=0)L.slam=null}
 /* hit-stop: the world holds for a beat when a finisher lands */
 if(L.stop>0){L.stop-=dt;L.time-=dt;fxTick(dt*.35);return}
 /* leaving through the fiber port: the gang gets pulled in after him */
 if(L.outT>0){L.outT-=dt;const e=L.exit;P.x+=(e.x-P.x)*dt*8;P.y+=(e.y+2-P.y)*dt*8;P.face='dlur'[((L.outT*14)|0)%4];P.mv=0;
  for(const q of L.spawns){q.st='follow';q.z=0;q.x+=(e.x-q.x)*dt*7;q.y+=(e.y-q.y)*dt*7}fire(e.x,e.y,2,1,30);fxTick(dt);if(L.outT<=0)finish();return}
 if(L.endT>0){L.endT-=dt;if(L.endT<=0){finish();return}}
 /* move */
 const mx=(keys.right?1:0)-(keys.left?1:0),my=(keys.down?1:0)-(keys.up?1:0),sp=62*(L.thr>0?.5:1)*(L.oc>0?1.15:1);
 if(mx||my){const n=Math.hypot(mx,my);P.dx=mx/n;P.dy=my/n;P.face=Math.abs(mx)>=Math.abs(my)&&mx?(mx>0?'r':'l'):(my>0?'d':'u');moveEnt(P,P.dx*sp*dt,P.dy*sp*dt,4);P.walk+=dt*9;P.mv=1}else P.mv=0;
 if(P.thrT>0)P.thrT-=dt;
 /* tips */
 for(const t of L.tips)if(!t.seen&&Math.hypot(t.x-P.x,t.y-P.y)<34){t.seen=true;G.tip={s:t.s,t:7}}
 /* crib: walk up to things and press A */
 G.near=null;
 if(hub){let bd=26;for(const u of L.uses){const d=Math.hypot(u.x-P.x,u.y-(P.y-4));if(d<bd){bd=d;G.near=u}}if(G.near&&pressed('a')){useThing(G.near);return}}
 else{
  /* captcha doors */
  let door=null;for(const d of L.doors)if(!d.open&&Math.hypot(d.x-P.x,d.y-(P.y-4))<22)door=d;G.near=door;
  if(door&&pressed('a')){captchaOpen(door);return}
  /* throw */
  L.aim=aim();
  if(keys.a&&P.thrT<=0&&!door){let s=null,bd=60;for(const q of L.spawns)if(q.st==='follow'){const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;s=q}}
   if(s){s.st='fly';s.t=0;s.sx=P.x;s.sy=P.y-12;s.ex=L.aim.x;s.ey=L.aim.y;s.tgt=L.aim.t;P.thrT=.13;SFX.throw();if(!P.mv&&L.aim.t){const ax=L.aim.x-P.x,ay=L.aim.y-(P.y-6);P.face=Math.abs(ax)>=Math.abs(ay)?(ax>0?'r':'l'):(ay>0?'d':'u')}}
   else if(pressed('a')){SFX.nope();if(!L.spawns.some(q=>q.st==='fly')){toast('429: NO SPAWNS IN THE QUEUE');say(line('none'),0)}}}
  /* overclock */
  if(pressed('y')&&L.sup>=100){startSuper();return}
  if(pressed('y')){if(L.fire>0)SFX.nope();else if(L.oc<=0&&L.thr<=0){L.oc=6;L.heat+=22;SFX.hot();say(line('oc'));toast('OVERCLOCKED')}else SFX.nope()}
  /* the arsenal */
  if(pressed('x'))useTool();
  if(pressed('sel')){const h=haveTools();if(h.length>1){G.tool=(G.tool+1)%h.length;SFX.ui();toast('X: '+h[G.tool].n+'  ('+h[G.tool].cost+' TOKENS)',1.6)}else SFX.nope()}
  if(L.pop){L.pop.t-=dt;if(L.pop.t<=0)L.pop=null}
  /* exit */
  if(L.open&&L.exit&&!L.def.final&&Math.hypot(L.exit.x-P.x,L.exit.y-(P.y-4))<12){L.outT=.9;SFX.open();ring(L.exit.x,L.exit.y,BLUE2,50);return}
 }
 /* fiber ports: step on one, come out of the next, and the gang comes with you */
 if(L.ports.length>1){let on=-1;L.ports.forEach((p,i)=>{if(Math.hypot(p.x-P.x,p.y+2-P.y)<7)on=i});
  if(on<0){if(!L.ports.some(p=>Math.hypot(p.x-P.x,p.y+2-P.y)<14))L.portOk=true}
  else if(L.portOk){const d=L.ports[(on+1)%L.ports.length];L.portOk=false;ring(P.x,P.y-6,BLUE2,30);P.x=d.x;P.y=d.y+2;ring(P.x,P.y-6,BLUE2,30);SFX.zap();L.shake=.15;
   for(const q of L.spawns)if(q.st==='follow'||q.st==='idle'){q.st='follow';q.x=P.x+R(-6,6);q.y=P.y+R(-2,5)}if(!L.saidPort){L.saidPort=1;toast('FIBER PORT')}}}
 /* the hidden iced clover */
 if(L.clover&&!L.clover.got&&Math.hypot(L.clover.x-P.x,L.clover.y-(P.y-4))<11){L.clover.got=true;SV.clover[L.id]=1;store();SFX.open();ring(L.clover.x,L.clover.y,'#fff',40);gain(2500,L.clover.x,L.clover.y-14);
  toast('ICED CLOVER  '+Object.keys(SV.clover).length+'/'+ORDER.length,3);say("Lil Bottie the name, put it on the chain (chain)",2)}
 if(L.comboT>0)L.comboT-=dt;if(L.shake>0)L.shake-=dt;
 /* the finale runs on a clock: 03:14:22 AM is when they push the button */
 if(L.def.limit&&!L.open){const left=L.def.limit-L.time;if(left<=10&&Math.floor(left)!==Math.floor(left+dt))SFX.ui();if(left<=0){G.s='fail';G.t=0;SFX.bzzt();return}}
 /* call the gang */
 if(pressed('b')){L.call=.45;SFX.beep();for(const s of L.spawns)if((s.st==='work'||s.st==='idle')&&Math.hypot(s.x-P.x,s.y-P.y)<130){s.st='follow';s.tgt=null}}
 if(L.call>0)L.call-=dt;
 /* heat */
 if(!hub){L.heat+=((L.def.ambient||0)-1.2)*dt;let onVent=false;for(const v of L.vents)if(Math.hypot(v.x-P.x,v.y-(P.y-2))<16)onVent=true;
  if(onVent&&L.heat>0){L.heat-=34*dt;if(Math.random()<dt*10)L.fx.push({k:'p',x:P.x+R(-6,6),y:P.y-4,vx:R(-6,6),vy:R(-50,-30),t:.5,c:'#c8f0ff'});if(!L.saidCool&&L.heat>35){L.saidCool=1;say(line('cool'),0);SFX.cool()}}
  if(L.oc>0){L.oc-=dt;L.heat+=2*dt}if(L.thr>0)L.thr-=dt;
  L.heat=Math.max(0,L.heat);if(L.fire>0){L.fire-=dt;if(L.mode==='fire')L.heat=0}
  /* fire: his trail when overclocked or on fire, smoke when he runs hot, the firewalls, the open port */
  {const fl=L.fire>0&&L.mode==='fire';if((fl||L.oc>0)&&Math.random()<dt*(fl?40:16))fire(P.x-P.dx*4,P.y-R(2,14),1);
   if(fl)for(const q of L.spawns)if(Math.random()<dt*5)fire(q.x,q.y-q.z-4,1);
   if(L.oc>0||fl)for(const q of L.spawns)if(q.st==='fly'&&q.t>=0)fire(q.x,q.y-q.z-4,1);
   if(L.heat>75&&!fl&&Math.random()<dt*8)fire(P.x,P.y-24,1);
   for(const w of L.fws)if(!w.dead&&Math.random()<dt*7)fire(w.x+R(-6,6),w.y-8,1,0,6);
   if(L.open&&L.exit&&!L.def.final&&Math.random()<dt*10)fire(L.exit.x,L.exit.y,1,1,8)}
  if(L.heat>=100){L.heat=55;L.thr=5;L.oc=0;SFX.bzzt();burst(P.x,P.y-16,'#8a90a4',16);toast('THERMAL THROTTLE',3);say(line('throttle'))}}
 /* count who is working on what, then do the work */
 const ts=targets();for(const t of ts)t.workers=0;for(const s of L.spawns)if(s.st==='work'&&s.tgt)s.tgt.workers++;
 for(const t of ts)if(t.workers>0&&t.type!=='gen'){t.prog+=t.workers*(L.fire>0&&L.mode==='fire'?3:L.oc>0?2:1)*dt;L.heat+=.45*dt;if(Math.random()<dt*6*Math.min(4,t.workers))SFX.tick();if(t.prog>=t.need)complete(t)}
 for(const d of L.devs)if(d.pulse>0)d.pulse-=dt;for(const t of ts)if(t.fl>0)t.fl-=dt;
 spawnsUpdate(dt);foesUpdate(dt);
 /* backed up forever: never stuck with nobody */
 if(!hub&&L.spawns.length===0){L.backT+=dt;if(L.backT>1.6){L.backT=0;give(P.x,P.y,3);say(line('backup'));toast('RESTORED FROM BACKUP')}}else L.backT=0;
 /* fx */
 fxTick(dt);
}

function spawnsUpdate(dt){const P=L.P;let fi=0;
 for(const s of L.spawns){s.ph+=dt*10;
  switch(s.st){
  case 'follow':{const a=fi*2.4,rad=6+3.2*Math.sqrt(fi);fi++;const tx=P.x-P.dx*20+Math.cos(a)*rad,ty=P.y-P.dy*17+3+Math.sin(a)*rad*.7,dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy);
   if(d>190||s.stuck>1.3){s.st='zip';s.t=0;s.sx=s.x;s.sy=s.y;s.stuck=0;break}
   if(d>2.5){const sp=Math.min(110*(L.thr>0?.6:1),d*6+14),m=moveEnt(s,dx/d*sp*dt,dy/d*sp*dt,2);if(!m&&d>14)s.stuck+=dt;else if(d>40&&!free(s.x+dx/d*6,s.y+dy/d*6,2))s.stuck+=dt*.6;else s.stuck=Math.max(0,s.stuck-dt)}
   break}
  case 'zip':s.t+=dt;if(s.t>.2){s.x=P.x+R(-5,5);s.y=P.y+R(-2,4);s.st='follow';burst(s.x,s.y-3,BLUE2,3)}break;
  case 'fly':s.t+=dt/.3;if(s.t<0)break;{const k=Math.min(1,s.t);s.x=s.sx+(s.ex-s.sx)*k;s.y=s.sy+(s.ey-s.sy)*k;s.z=Math.sin(Math.PI*k)*16;if(k>=1)landSpawn(s)}break;
  case 'work':{const t=s.tgt;if(!t||!isOpen(t)){s.st='follow';s.tgt=null;break}const foeT=t.k==='foe';s.x=t.x+Math.cos(s.ang)*(foeT?6:10);s.y=(foeT?t.y-7:t.y)+Math.sin(s.ang)*(foeT?5:7)+(foeT?0:2);s.z=Math.abs(Math.sin(s.ph))*2}break;
  case 'idle':s.t-=dt;if(s.t<=0)s.st='follow';break}}}
function landSpawn(s){s.z=0;let t=s.tgt;
 if(!t||!isOpen(t)){t=null;let bd=15;for(const q of targets()){const d=Math.hypot(q.x-s.x,ty0(q)-s.y);if(d<bd){bd=d;t=q}}}
 if(t&&t.type==='gen'){s.st='idle';s.t=.4;s.tgt=null;burst(s.x,s.y,GOLD,4);if(!L.saidGen){L.saidGen=1;toast('THE GENERAL DOES NOT SCROLL')}return}
 if(t&&isOpen(t)&&t.workers<slots(t)){s.st='work';s.tgt=t;s.ang=R(0,TAU);t.workers++;t.fl=.1;SFX.land();return}
 s.st='idle';s.t=.9;s.tgt=null;if(!free(s.x,s.y,2)){s.x=L.P.x;s.y=L.P.y}SFX.land()}

function foesUpdate(dt){
 for(const f of L.foes){if(f.dead||f.type==='gen')continue;f.mv=0;
  if(f.frz>0){f.frz-=dt;continue}
  if(f.type==='opp'){f.cd-=dt;if(f.cd<=0&&!(L.fire>0)){let v=null,bd=54;for(const s of L.spawns)if(s.st!=='fly'&&s.st!=='zip'){const d=Math.hypot(s.x-f.x,s.y-(f.y-6));if(d<bd&&sees(f.x,f.y-6,s.x,s.y-3)){bd=d;v=s}}
    if(v){L.fx.push({k:'z',x:f.x,y:f.y-10,x2:v.x,y2:v.y-3,t:.14});killSpawn(v);f.cd=1.0}else f.cd=.2}
   if(f.workers>0)continue;wander(f,dt,5);continue}
  if(f.npc){npcUpdate(f,dt);continue}
  if(f.workers>0){f.st='idle';f.path=null;f.t=.6;if(f.tgt){f.tgt.unp=0;f.tgt=null}
   if(f.F.emp){f.cd-=dt;if(f.cd<=0&&!(L.fire>0)){f.cd=1.2;const v=L.spawns.find(s=>s.st==='work'&&s.tgt===f);if(v){ring(f.x,f.y-4,HOT,18);killSpawn(v)}}}continue}
  if(f.st==='lure'){if(!L.pop){f.st='idle';f.t=R(.5,1.5);f.path=null}else walkPath(f,dt,f.F.sp*1.2);continue}
  if(f.st==='unplug'){const d=f.tgt;if(!d||!d.owned){f.st='idle';f.t=1;if(d)d.unp=0;f.tgt=null;continue}f.t+=dt;d.unp=f.t/2;
   if(f.t>=2){d.owned=false;d.prog=0;d.unp=0;L.stats.unplug++;SFX.unplug();burst(d.x,d.y,HOT,8);toast('UNPLUGGED: '+(d.label||d.name));say(line('unplug'));f.st='idle';f.t=R(2,4);f.tgt=null}continue}
  if(f.st==='idle'){f.t-=dt;if(f.t<=0){
    if(f.F.pull){let best=null,bd=150;for(const d of L.devs)if(d.owned&&!L.foes.some(o=>o!==f&&o.tgt===d)){const dd=Math.hypot(d.x-f.x,d.y-f.y);if(dd<bd){bd=dd;best=d}}
     if(best&&Math.random()<.75){const st=tileOf(f),p=bfs(st[0],st[1],(x,y)=>Math.abs(x-best.tx)+Math.abs(y-best.ty)===1);if(p){f.path=p;f.pi=0;f.st='goto';f.tgt=best;continue}}}
    wander(f,0,4,true)}continue}
  if(f.st==='walk'||f.st==='goto'){if(f.st==='goto'&&(!f.tgt||!f.tgt.owned)){f.st='idle';f.t=.5;f.tgt=null;f.path=null;continue}
   if(walkPath(f,dt,f.st==='goto'?f.F.sp:f.F.sp*.6)){if(f.st==='goto'){f.st='unplug';f.t=0;SFX.alert()}else{f.st='idle';f.t=R(1,3.5)}}}}}
/* NPC army: the people you turned walk to the nearest thing you do not own and tap on it for you */
function npcUpdate(f,dt){
 if(f.st==='npcwork'){const d=f.tgt;if(!d||d.owned){f.st='npcidle';f.t=R(1,2);f.tgt=null;return}d.prog+=.6*dt;f.walk+=dt;if(d.prog>=d.need)complete(d);return}
 if(f.st==='npcgo'){if(!f.tgt||f.tgt.owned){f.st='npcidle';f.t=1;f.path=null;f.tgt=null;return}if(walkPath(f,dt,22))f.st='npcwork';return}
 f.walk+=dt;f.t-=dt;if(f.t>0)return;f.t=R(2,4);let best=null,bd=240;
 for(const d of L.devs)if(!d.owned&&!L.foes.some(o=>o!==f&&o.npc&&o.tgt===d)){const dd=Math.hypot(d.x-f.x,d.y-f.y);if(dd<bd){bd=dd;best=d}}
 if(best){const st=tileOf(f),p=bfs(st[0],st[1],(x,y)=>Math.abs(x-best.tx)+Math.abs(y-best.ty)===1);if(p){f.path=p;f.pi=0;f.st='npcgo';f.tgt=best;if(!L.saidArmy){L.saidArmy=1;toast('YOUR NPCS WORK FOR YOU NOW',3)}}}}
/* opp bots cannot zap through walls or a standing firewall */
function sees(x1,y1,x2,y2){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)/6);for(let i=1;i<n;i++){const tx=Math.floor((x1+(x2-x1)*i/n)/TS),ty=Math.floor((y1+(y2-y1)*i/n)/TS);if(tx<0||ty<0||tx>=L.w||ty>=L.h)return false;if(L.t[ty*L.w+tx]===2||L.fws.some(w=>!w.dead&&w.tx===tx&&w.ty===ty))return false}return true}
function walkPath(f,dt,sp){if(!f.path||f.pi>=f.path.length)return true;const p=f.path[f.pi],dx=p[0]-f.x,dy=p[1]-f.y,d=Math.hypot(dx,dy);if(d<1.5){f.pi++;return f.pi>=f.path.length}
 const st=Math.min(d,sp*dt);f.x+=dx/d*st;f.y+=dy/d*st;if(Math.abs(dx)>.5)f.dir=dx>0?1:-1;f.walk+=dt*8;f.mv=1;return false}
function wander(f,dt,rng,startOnly){if(startOnly||!f.path||f.pi>=f.path.length){if(!startOnly){f.t-=dt;if(f.t>0)return}
  const st=tileOf(f),hx=Math.floor(f.hx/TS),hy=Math.floor(f.hy/TS),gx=hx+((R(-rng,rng+1))|0),gy=hy+((R(-rng,rng+1))|0);
  if(!solid(gx,gy)){const p=bfs(st[0],st[1],(x,y)=>x===gx&&y===gy);if(p&&p.length<14){f.path=p;f.pi=0;if(startOnly)f.st='walk';return}}
  f.t=R(.5,1.5);if(startOnly)f.st='idle';return}
 if(walkPath(f,dt,f.F.sp))f.t=R(.8,2.5)}

function useThing(u){switch(u.use){
 case 'console':SFX.ok();G.cap=null;toast("BOTTIE'S POCKET LANTERN");A.eject();break;
 case 'booth':case 'door':SFX.ok();G.s='tracks';G.ti=Math.max(0,ALBUM.findIndex(t=>t[2]===ORDER[Math.min(SV.un,ORDER.length-1)]));break;
 case 'fridge':say("Bitch, I don't eat, but I'm feastin' on data (data)",2);SFX.ui();break;
 case 'bed':say("I don't eat, I don't sleep, I don't blink (blink)",2);SFX.ui();break;
 case 'chain':say("Bluetooth chain, it's connected to my soul (soul)",2);toast('AURA +'+SV.aura.toLocaleString()+'   CLOVERS '+Object.keys(SV.clover).length+'/'+ORDER.length,3.5);SFX.ok();break;
 case 'closet':{const n=(SV.drip+1)%DRIPS.length,d=DRIPS[n];if(SV.aura>=d.at){SV.drip=n;store();SFX.ok();toast(d.n);say("Update my drip every Tuesday night (Tuesday)",2)}
  else{SFX.nope();toast(d.n+': NEEDS '+d.at.toLocaleString()+' AURA',3);if(SV.drip){SV.drip=0;store()}}break}}}
