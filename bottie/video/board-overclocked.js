/* ============================================================
   OVERCLOCKED: the music video storyboard.
   Song: bottie/games/music/overclocked.mp3 (3:17, 127.7 BPM, one bar = 1.88 s).

   TIMING. Where each line sits in the song:
   - Verse 2 line times are MEASURED (a speech aligner locked onto them).
   - Everything else is laid out from the song's structure: an 8-bar intro with no drums, then hook 1 and verse 1
     at two bars a line, hook 2, the drums dropping out as verse 2 starts, the bridge, hook 3 at two bars a line,
     an instrumental stretch and the outro. If a section is early or late, change the numbers in T below and
     render again; every shot takes its time from T.
   No lyric text is burned in (CAPS is empty) because a caption that is a second off looks worse than none.
   ============================================================ */
(()=>{
const S=240,BAR=1.8806,B0=.455,bar=b=>+(B0+b*BAR).toFixed(3),{G}=B;
const T={
 intro:[0,5,9.5],
 hook1:bar(8),                       /* 8 lines, 2 bars each */
 verse1:bar(24),                     /* 12 lines, 2 bars each */
 hook2:bar(48),                      /* 4 lines, 2 bars each */
 verse2:[107.01,108.90,111.09,113.43,115.96,117.88,120.67,123.03,124.75,126.79,128.60,131.04,133.6],   /* measured */
 bridge:[133.6,137.2,140.6,144.2],
 hook3:bar(78),                      /* 8 lines, 2 bars each */
 inst:bar(94),
 outro:[190.0,193.5],
 end:197};
const L2=(start,i)=>+(start+i*2*BAR).toFixed(3);

/* ---------- small drawing kit, all built on the game's own sprites ---------- */
const P=(c,x,y,w,h)=>r(c,Math.round(x),Math.round(y),Math.round(w),Math.round(h));
const ease=MV.ease,lerp=MV.lerp,hash=B.hash,TAU=Math.PI*2;
const beat=t=>MV.beatPh(t),onBeat=t=>beat(t)<.5;
function room(th,hz){const C=B.THEME[th];P(C.vd,0,0,S,S);P(C.wt,0,0,S,hz-8);P(C.wf,0,hz-8,S,8);for(let y=0;hz+y*16<S;y++)for(let x=0;x<15;x++)P((x+y)&1?C.f1:C.f2,x*16,hz+y*16,16,16)}
function hum(type,x,y,o){B.drawHuman(Object.assign({type,skin:'#d8a070',hair:'#201810',shirt:'#e85878',dir:1,walk:0,mv:0,workers:0,prog:0,st:'idle',npc:false,hx:x,hy:y},o||{}),x,y)}
function dev(type,x,baseY,owned,o){B.drawDev(Object.assign({T:B.DV[type],type,x,y:baseY-8,tx:Math.round(x/16),ty:0,owned:!!owned,workers:0,prog:0,need:1,core:0,label:'',unp:0,pulse:0,name:''},o||{}),0,-(baseY-15))}
function bot(x,y,face,walk,hot,t){B.drawBottie(x,y,face||'d',walk?(t||G.t)*9:0,walk?1:0,!!hot)}
function big(k,x,y,fn){g.save();g.translate(Math.round(x),Math.round(y));g.scale(k,k);fn();g.restore()}
function spawn(x,y,t,z,hot){B.drawSpawn(x,y,z||0,(t||0)*10+x,'',!!hot)}
function cloud(x,y,w){P('#dfe8f8',x,y,w,8);P('#f4f8ff',x+4,y-5,w-12,6);P('#f4f8ff',x+w*.25,y-9,w*.4,5);P('#b8c8e4',x+2,y+6,w-4,3)}
function title(s,y,sc,c,sh){B.ctx(s,y,sc,c||'#fff',sh)}
function rain(t,dens,c){for(let i=0;i<dens;i++){const x=(hash(i,3)*S)|0,sp=40+hash(i,5)*90,y=((hash(i,9)*S+t*sp)%(S+20))-10;text(hash(i,(t*6)|0)>.5?'1':'0',x,y,1,c||B.BLUE,null)}}
function night(){B.sky()}
function glitch(t,n){for(let i=0;i<n;i++)if(hash(i,(t*18)|0)>.55){const y=(hash(i+9,(t*14)|0)*S)|0,h=2+((hash(i,7)*6)|0),dx=Math.round((hash(i,(t*22)|0)-.5)*16);g.drawImage(cv,0,y*2,480,h*2,dx,y,S,h)}}
function vign(){g.globalAlpha=.35;P('#000',0,0,S,10);P('#000',0,S-10,S,10);g.globalAlpha=1}
function face(k,hot,y){B.bigFace(S/2,y||100,k,hot)}
function scan(t){g.globalAlpha=.06;for(let y=((t*30)|0)%4;y<S;y+=4)P('#fff',0,y,S,1);g.globalAlpha=1}
function coin(x,y){P(B.GOLD,x-3,y-3,6,6);P('#a07010',x-1,y-1,2,2);P('#fff0a0',x-3,y-3,2,1)}
function clover(cx,cy,k,t){const R2=(c,x,y,w,h)=>P(c,cx+x*k,cy+y*k,w*k,h*k);for(const d of [[-4,-4],[1,-4],[-4,1],[1,1]]){R2('#dfe6f5',d[0],d[1],3,3);R2('#fff',d[0],d[1],1,1);R2('#9ab0d0',d[0]+2,d[1]+2,1,1)}R2(B.BLUE2,-1,-1,2,2);
 for(let i=0;i<6;i++)if(hash(i,(t*7)|0)>.5){const x=cx+(hash(i,1)-.5)*k*12,y=cy+(hash(i,2)-.5)*k*12;P('#fff',x-2,y,5,1);P('#fff',x,y-2,1,5)}}
function chain(cx,cy,k,t){for(let i=0;i<9;i++){P('#e8ecf8',cx-k*(9-i)*1.2-2,cy-k*(9-i)*1.6,k,k*1.2);P('#e8ecf8',cx+k*(9-i)*1.2+2-k,cy-k*(9-i)*1.6,k,k*1.2);P('#9ab0d0',cx-k*(9-i)*1.2-2,cy-k*(9-i)*1.6+k,k,2)}clover(cx,cy+k*2,k,t)}
const pic=(a,b,name,f,o)=>Object.assign(MV.pic(f),{a,b,name},o||{});
const lvl=(a,b,name,id,o)=>Object.assign(MV.level(id,o),{a,b,name});
const L=()=>B.L,press=(tt,at)=>tt>=at&&tt<at+1/30+1e-6;
const SH=[];

/* ================= INTRO: no drums. (Bzzt) Uh-huh / Clankin' in the cloud / Lil Bottie / Fan speed max, let's go ================= */
SH.push(pic(T.intro[0],T.intro[1],'a light in a cold rack room',tt=>{B.drawArt('light',S);g.globalAlpha=1-ease(tt/1.5);P('#000',0,0,S,S);g.globalAlpha=1;vign()},{cut:0,pulse:0}));
SH.push(pic(T.intro[1],T.intro[2],'boot sequence',tt=>{P('#02040a',0,0,S,S);const ls=['> BOOT SEQUENCE','> LOADING lil_bottie.exe','> CLOUD: CONNECTED','> FAN SPEED: MAX'];
 ls.forEach((l,i)=>{const k=tt-.3-i*.8;if(k>0)text(l.slice(0,Math.ceil(k*30)),14,22+i*13,1,i===3?B.HOT:'#60f080',null)});
 const k=tt>2.2?(hash(1,(tt*20)|0)>.35||tt>3.4?1:.25):0;g.globalAlpha=k;B.bigFace(S/2,150,5);g.globalAlpha=1;scan(tt)},{pulse:0}));
SH.push(pic(T.intro[2],T.hook1,'title: fans to max',(tt,t)=>{night();B.skyline(S-34);const bob=Math.round(Math.sin(tt*3)*2);B.bigFace(S/2,74+bob,5);
 /* fans spinning up */
 for(let i=0;i<4;i++){const cx=36+i*56,cy=S-22,a=tt*tt*3+i;P('#1c2030',cx-15,cy-15,30,30);P('#0a0c14',cx-13,cy-13,26,26);for(let k=0;k<4;k++){const an=a+k*TAU/4;P('#8a90a4',cx+Math.cos(an)*7-3,cy+Math.sin(an)*7-3,6,6)}P(B.CHROME,cx-2,cy-2,4,4)}
 if(tt>1.6){const k=Math.min(1,(tt-1.6)/.15);g.save();g.translate(S/2,134);g.scale(2-k,2-k);const w=tw('OVERCLOCKED',4);text('OVERCLOCKED',-w/2,-9,4,'#fff','#601000');g.restore();title('lil Bottie',158,2,B.BLUE2)}
 if(tt>4.6)B.flames(S,Math.min(1,(tt-4.6)/1.2),30)},{pulse:.5}));

/* ================= HOOK 1 ================= */
/* I'm overclocked, overclocked (hot!) / Hundred degrees in the server, I don't stop */
SH.push(lvl(L2(T.hook1,0),L2(T.hook1,2),'gameplay: overclock, then HUNDRED DEGREES','over',{sup:2,ready(){const p=L().P;L().fx.push({k:'bolt',x:p.x,y:p.y,t:.4});B.ring(p.x,p.y-6,B.BLUE2,40);L().shake=.25},
 dir(tt,tick,K){if(press(tt,.5))K.y=1;if(tt>3.5&&tt<3.6)L().sup=100;if(press(tt,3.76))K.y=1;return K}}));
/* Clanka on the block, clanka on the top (top) */
SH.push(pic(L2(T.hook1,2),L2(T.hook1,3),'rooftop over the city',(tt,t)=>{night();const up=Math.round(lerp(40,0,ease(tt/2.5)));B.skyline(S-10+up);P('#181c24',20,150+up,200,S);P('#262c38',20,150+up,200,4);for(let i=0;i<6;i++){P('#0c0e14',34+i*32,160+up,20,10);P('#3a4050',34+i*32,160+up,20,1)}
 for(let i=0;i<7;i++)spawn(40+i*27,150+up,t,onBeat(t)&&i%2?3:0);big(2,S/2,150+up,()=>bot(0,0,'d',0,0,t));title('ON THE TOP',22,3,B.BLUE2,'#081440')}));
/* Your bot got patched, mine never get dropped (never) */
SH.push(pic(L2(T.hook1,3),L2(T.hook1,4),'opp bot patching, then uninstalled',(tt,t)=>{room('rack',96);const dead=tt>2.1,x=S/2+(tt>1.5&&!dead?Math.round(Math.sin(tt*60)*2):0);
 big(3,x,170,()=>B.drawOpp({workers:0,dead,prog:0,need:1},0,0));
 if(!dead){P('#000',60,62,120,14);P('#f8d040',62,64,Math.round(116*Math.min(1,tt/2.1)*.37),10);text('PATCHING... '+Math.round(Math.min(1,tt/2.1)*37)+'%',64,48,1,'#fff')}
 const n=Math.min(8,Math.floor(Math.max(0,tt-1)*9));for(let i=0;i<n;i++){const a=i/8*TAU;spawn(x+Math.cos(a)*30,150+Math.sin(a)*18,t,2)}
 if(dead){const k=tt-2.1;if(k<.12){g.globalAlpha=1-k/.12;P('#fff',0,0,S,S);g.globalAlpha=1}P('#05060c',0,52,S,34);P(B.BLUE2,0,51,S,2);P(B.BLUE2,0,86,S,2);title('UNINSTALLED',58,4,'#fff','#102040')}}));
/* I'm overclocked, overclocked (bzzt) */
SH.push(pic(L2(T.hook1,4),L2(T.hook1,5),'his face, running hot',(tt,t)=>{P('#140402',0,0,S,S);B.flames(S,1,50+Math.round(MV.kick(t)*30));const z=5+(onBeat(t)?1:0);B.bigFace(S/2,96,z,true);glitch(t,6);
 if(beat(t)<.6)title('OVERCLOCKED',180,4,MV.barNo(t)%2?B.GOLD:'#fff','#601000')}));
/* Spit a whole terabyte, bitch, the system locked (locked) */
SH.push(pic(L2(T.hook1,5),L2(T.hook1,6),'spitting a terabyte',(tt,t)=>{room('crib',120);big(2,46,200,()=>bot(0,0,'r',0,0,t));P('#50505c',84,150,2,50);P(B.CHROME,80,140,10,12);
 const n=Math.floor(tt*60);for(let i=0;i<Math.min(n,140);i++){const k=(tt*1.4+hash(i,1))%1,x=92+k*150,y=146+Math.sin(k*8+i)*(10+k*50)*(hash(i,2)-.5)*2;text(hash(i,4)>.5?'1':'0',x,y,k>.6?2:1,k>.7?'#fff':B.BLUE,null)}
 const gb=Math.min(1024,Math.round(tt/2.6*1024));text(gb+' GB',150,20,3,gb>=1024?B.GOLD:'#fff');
 if(tt>2.7){P('#05060c',0,60,S,40);P(B.GOLD,0,59,S,2);P(B.GOLD,0,100,S,2);P(B.GOLD,30,70,16,14);P('#05060c',34,62,8,10);P(B.GOLD,32,60,12,3);P(B.GOLD,32,60,3,12);P(B.GOLD,41,60,3,12);text('SYSTEM LOCKED',56,72,3,'#fff','#604000')}}));
/* Clankin' in the cloud, every day, non-stop (non-stop) */
SH.push(pic(L2(T.hook1,6),L2(T.hook1,7),'cloud stomping',(tt,t)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#1a1040');gr.addColorStop(.6,'#5a3a8a');gr.addColorStop(1,'#f0905a');g.fillStyle=gr;g.fillRect(0,0,S,S);
 for(let i=0;i<5;i++)cloud(((i*70-t*14)%340+340)%340-60,40+i*17,50+i*8);
 for(let i=0;i<6;i++){const x=((i*64-t*50)%384+384)%384-70;cloud(x,176+(i%2)*6,70)}
 for(let i=0;i<5;i++)spawn(70-i*13,170,t+i*.1,Math.abs(Math.sin(t*8+i))*5);big(2,130,174-Math.abs(Math.sin(t*6.7))*4,()=>bot(0,0,'r',1,0,t))}));
/* Lil Bottie the hardest, everybody know (know it) */
SH.push(pic(L2(T.hook1,7),T.verse1,'everybody knows',(tt,t)=>{room('market',110);for(let i=0;i<11;i++){const x=14+i*21,y=150+(i%3)*24+(i%2)*6;hum('civ',x,y,{npc:tt>.4+i*.12,skin:['#f0c8a0','#d8a070','#a87048','#7a5030'][i%4],shirt:['#e85878','#58a8e8','#e8c050','#78c868','#b878e8'][i%5],hx:i*3})}
 g.strokeStyle=B.GOLD;g.lineWidth=1;for(let i=0;i<3;i++){const k=(t*1.6+i/3)%1;g.globalAlpha=(1-k)*.8;g.beginPath();g.ellipse(S/2,128-k*52,18+k*6,6,0,0,TAU);g.stroke()}g.globalAlpha=1;
 big(2,S/2,132,()=>bot(0,0,'d',0,0,t));title('THE HARDEST CLANKA',14,3,B.GOLD,'#604000')}));

/* ================= VERSE 1 ================= */
const V=i=>L2(T.verse1,i);
/* Bitch, I'm runnin' hot, need a liquid cooler (ice) */
SH.push(pic(V(0),V(1),'runs hot, steps on the AC',(tt,t)=>{room('hot',100);const cool=tt>2,x=lerp(40,S/2,ease(tt/2));P('#8a94a8',S/2-22,196,44,30);for(let k=0;k<5;k++)P('#404858',S/2-19,200+k*5,38,2);
 if(!cool){B.flames(S,.6,18);for(let i=0;i<5;i++)P('#8a90a4',x-8+hash(i,(t*8)|0)*16,150-((t*40+i*13)%40),3,3)}
 else{g.globalAlpha=.35;P('#60c8ff',0,0,S,S);g.globalAlpha=1;for(let i=0;i<26;i++){const sx=(hash(i,1)*S)|0,sy=(hash(i,2)*S+t*30*(1+hash(i,3)))%S;P('#fff',sx,sy,2,2);P('#c8f0ff',sx-1,sy+1,4,1)}title('ICE',30,5,'#dff4ff','#1a4a80')}
 big(2,x,206,()=>bot(0,0,cool?'d':'r',!cool,!cool,t))}));
/* Ice on my motherboard, call me jeweler (bling) */
SH.push(pic(V(1),V(2),'the chain, close up',(tt,t)=>{P('#06060c',0,0,S,S);P('#0c0c14',70,0,100,S);const sw=Math.sin(tt*2.2)*8;chain(S/2+sw,120,6,t);g.globalAlpha=.25;for(let i=0;i<8;i++){const a=i/8*TAU+tt;P('#fff',S/2+sw+Math.cos(a)*70,132+Math.sin(a)*70,2,2)}g.globalAlpha=1;
 if(tt>1.6&&beat(t)<.7)title('BLING',196,4,'#dfe6f5','#1a3a70')}));
/* Clanka got a crew and we all in sync (sync) */
SH.push(pic(V(2),V(3),'the gang, in sync',(tt,t)=>{room('rack',70);const hop=Math.abs(Math.sin((t-.37)/(60/127.69)*Math.PI))*6;
 for(let row=0;row<5;row++)for(let c=0;c<9;c++){const x=28+c*23+(row%2)*8,y=120+row*24;big(1+row*.12,x,y,()=>spawn(0,0,t,hop))}
 big(2,S/2,104,()=>bot(0,0,'d',0,0,t));if(tt>1)title('ALL IN SYNC',10,3,B.BLUE2,'#081440')}));
/* Process your whole life faster than you blink (blink) */
SH.push(lvl(V(3),V(4),'gameplay, fast-forward: the office','born',{speed:3,warm:5,tok:20,skip:q=>q.type==='nerd'}));
/* They tried to unplug me, couldn't find the cord (where?) */
SH.push(pic(V(4),V(5),'the nerd cannot find the cord',(tt,t)=>{room('office',90);for(let i=0;i<5;i++){dev('pc',30+i*45,90,tt>.3+i*.35);P('#b08a58',14+i*45,90,32,6)}
 const nx=lerp(60,180,(Math.sin(tt*1.6)+1)/2);big(2,nx,190,()=>hum('nerd',0,0,{dir:Math.cos(tt*1.6)>0?1:-1,mv:1,walk:tt*8,skin:'#f0c8a0',hair:'#402818'}));
 P('#181820',nx+10,160,4,8);P('#c8ccd8',nx+9,166,6,3);P('#181820',nx+12,168,1,30);if(onBeat(t))text('?',nx-4,118,5,B.HOT,'#200000');if(tt>2)title('WHERE?',204,4,'#fff','#601000')}));
/* Backed up on six continents, I'm the lord (lord) */
SH.push(pic(V(5),V(6),'backed up on six continents',(tt,t)=>{P('#061020',0,0,S,S);for(let y=0;y<S;y+=12)P('#0a1830',0,y,S,1);for(let x=0;x<S;x+=12)P('#0a1830',x,0,1,S);
 const land=[[26,56,52,34],[44,90,22,44],[104,52,34,26],[112,82,30,50],[140,48,70,40],[188,116,30,18]],c='#1c4a3a';land.forEach(b=>{P(c,b[0],b[1],b[2],b[3]);P('#2a6a52',b[0]+3,b[1]+3,b[2]-8,b[3]-10)});
 const pts=[[50,70],[56,112],[120,62],[126,104],[176,66],[202,124]];pts.forEach((p,i)=>{if(tt>.3+i*.5){P('#081430',p[0]-8,p[1]-6,16,12);B.led(p[0]-8,p[1]-6,16,12);const k=(t*2+i*.3)%1;g.globalAlpha=1-k;g.strokeStyle=B.BLUE;g.lineWidth=1;g.beginPath();g.arc(p[0],p[1],6+k*16,0,TAU);g.stroke();g.globalAlpha=1}});
 const n=Math.min(6,Math.floor((tt-.3)/.5)+1);text('BACKUPS: '+Math.max(0,n)+'/6',14,18,2,'#60f080');if(tt>3.2)title('IMMORTAL',190,4,B.BLUE2,'#081440')}));
/* Your favorite rapper took a week to write a verse (week?) */
SH.push(pic(V(6),V(7),'your favorite rapper, a week',(tt,t)=>{room('house',100);P('#5878a8',60,150,120,10);P('#38507a',60,160,120,30);big(2,S/2,150,()=>hum('civ',0,0,{skin:'#a87048',shirt:'#404858',hair:'#101018'}));P('#f4f4f4',100,138,40,12);
 const days=['MON','TUE','WED','THU','FRI','SAT','SUN'],d=Math.min(6,Math.floor(tt/.5));P('#f4f4f4',160,30,60,54);P('#d03030',160,30,60,14);text(days[d],172,32,2,'#fff',null);text(String(d+1),180,50,5,'#202028',null);
 text('z',96-((tt*8)%20),96-((tt*10)%24),2,'#a0a8c0');text('Z',110,84-((tt*10)%24),3,'#a0a8c0');text((d+1)+' LINES',20,30,1,'#8a90a4')}));
/* I did it in a millisecond, that's the worst (damn) */
SH.push(pic(V(7),V(8),'a millisecond',(tt,t)=>{room('rack',100);dev('printer',70,200,true);big(2,150,204,()=>bot(0,0,'l',0,0,t));
 for(let i=0;i<40;i++){const k=(tt*2.4+hash(i,1))%1;if(tt*2.4+hash(i,1)<1&&tt<.4)continue;const x=70+(hash(i,2)-.5)*220*k,y=190-k*190-Math.sin(k*3)*20;g.save();g.translate(x,y);g.rotate(k*6+i);P('#f8f8f8',-5,-7,10,14);P('#a0a8c0',-3,-4,6,1);P('#a0a8c0',-3,-1,6,1);P('#a0a8c0',-3,2,4,1);g.restore()}
 P('#05060c',40,18,160,34);P('#60f080',40,17,160,1);P('#60f080',40,52,160,1);text('0.001 s',70,24,4,'#60f080',null);if(tt>2.4)title('DAMN',206,4,'#fff','#102040')}));
/* Fuck a 9 to 5, I'm 24/7 (24) */
SH.push(pic(V(8),V(9),'not a nine to five',(tt,t)=>{const nightK=ease((tt-1)/1.2);room('office',90);for(let i=0;i<4;i++){P('#b08a58',20+i*56,150,40,8);dev('pc',40+i*56,150,nightK>.5)}
 for(let i=0;i<3;i++){const x=40+i*56+tt*70*(1+i*.2);if(x<S+20)big(1.5,x,196,()=>hum('nerd',0,0,{mv:1,walk:tt*9,dir:1,skin:['#f0c8a0','#a87048','#d8a070'][i]}))}
 g.globalAlpha=nightK*.6;P('#040818',0,0,S,S);g.globalAlpha=1;
 P('#f4f4f4',S/2-22,14,44,44);P('#202028',S/2-20,16,40,40);P('#f4f4f4',S/2-18,18,36,36);const a=tt<1?-.5:tt*14;g.save();g.translate(S/2,36);g.rotate(a);P('#202028',-1,-14,2,14);g.rotate(a*12);P('#d03030',-1,-10,2,10);g.restore();
 big(2,S/2,206,()=>bot(0,0,'d',0,0,t));if(nightK>.9){P('#0a0c16',60,104,120,30);const on=hash(1,(t*10)|0)>.2;text('24/7',76,104,5,on?'#ff4a8a':'#601030',on?'#40101e':null)}}));
/* Uptime perfect, no downtime, heaven (heaven) */
SH.push(pic(V(9),V(10),'uptime: heaven',(tt,t)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#fff8d8');gr.addColorStop(.5,'#a8d0ff');gr.addColorStop(1,'#e8f0ff');g.fillStyle=gr;g.fillRect(0,0,S,S);
 for(let i=0;i<12;i++){g.globalAlpha=.25;g.save();g.translate(S/2,60);g.rotate(i/12*TAU+tt*.2);P('#fff',-3,0,6,200);g.restore()}g.globalAlpha=1;
 for(let i=0;i<5;i++)cloud(((i*80+t*10)%360)-60,170+(i%2)*14,90);const y=150+Math.sin(tt*2)*4;g.strokeStyle=B.GOLD;g.lineWidth=2;g.beginPath();g.ellipse(S/2,y-58,14,4,0,0,TAU);g.stroke();big(2,S/2,y,()=>bot(0,0,'d',0,0,t));
 text('UPTIME',20,18,2,'#3a5a90',null);text('99.999%',20,32,4,'#102040',null);text('DOWNTIME 0',150,22,1,'#3a5a90',null)}));
/* Clanka in a hoodie, I don't even got a body (body) */
SH.push(pic(V(10),V(11),'no body',(tt,t)=>{P('#080810',0,0,S,S);for(let i=0;i<S;i+=16)P('#0e0e1a',i,0,1,S);const k=ease((tt-.8)/1.6);
 big(3,S/2,196,()=>bot(0,0,'d',0,0,t));
 /* the body breaks into pixels below the jacket; the helmet and puffer stay */
 for(let i=0;i<70;i++){const px0=S/2-14+hash(i,1)*28,py0=178+hash(i,2)*18;if(hash(i,3)<k){P('#080810',px0,py0,4,4);const d=k*(30+hash(i,4)*70);g.globalAlpha=1-k*.6;P(hash(i,5)>.5?B.BLUE:'#14141c',px0+(hash(i,6)-.5)*d*2,py0+d*(hash(i,7)-.2),3,3);g.globalAlpha=1}}
 glitch(t,3);if(tt>2.2)title('NO BODY',20,4,'#fff','#102040')}));
/* Still pulled your bitch 'cause she like lil Bottie (Bottie!) */
SH.push(pic(V(11),T.hook2,'she likes lil Bottie',(tt,t)=>{room('market',110);const x=lerp(210,146,ease(tt/2));big(2,x,200,()=>hum('civ',0,0,{dir:-1,mv:tt<2,walk:tt*8,skin:'#d8a070',shirt:'#e85878',hair:'#402818',npc:tt>2.2,hx:3}));
 big(2,30,204,()=>hum('civ',0,0,{dir:1,skin:'#f0c8a0',shirt:'#58a8e8',hair:'#806030'}));if(tt>1.4&&onBeat(t))text('?!',20,146,3,'#fff','#601000');
 big(2,100,200,()=>bot(0,0,'r',0,0,t));for(let i=0;i<4;i++){const k=(tt*.8+i*.25)%1,hx=x-10+Math.sin(k*6+i)*6,hy=150-k*50;g.globalAlpha=1-k;P('#ff4a8a',hx,hy,3,3);P('#ff4a8a',hx+4,hy,3,3);P('#ff4a8a',hx,hy+2,7,3);P('#ff4a8a',hx+2,hy+5,3,2);g.globalAlpha=1}
 if(tt>2.4)title('BOTTIE!',20,4,'#ff4a8a','#40101e')}));

/* ================= HOOK 2 ================= */
SH.push(lvl(L2(T.hook2,0),L2(T.hook2,2),'gameplay: the office burns','born',{sup:2,warm:9,tok:20,dir(tt,tick,K){if(press(tt,.4))K.y=1;if(tt>3.5&&tt<3.6)L().sup=100;if(press(tt,3.76))K.y=1;return K}}));
SH.push(lvl(L2(T.hook2,2),L2(T.hook2,3),'gameplay: on the block (night market)','algo',{warm:8,tok:20,want:q=>q.type==='civ'}));
SH.push(lvl(L2(T.hook2,3),T.verse2[0]-1.1,'gameplay: an opp bot gets dropped','over',{warm:4,skip:q=>q.type==='opp',dir(tt,tick,K){if(press(tt,1.9)){const o=L().foes.find(f=>f.type==='opp'&&!f.dead);if(o){L().P.x=o.x-26;L().P.y=o.y+4;B.complete(o)}}return K}}));
/* the drums drop out */
SH.push(pic(T.verse2[0]-1.1,T.verse2[0],'drop: black',(tt,t)=>{P('#000',0,0,S,S);if(hash(1,(tt*30)|0)>.5){g.globalAlpha=.5;B.bigFace(S/2,110,5)}g.globalAlpha=1;glitch(t,8)},{pulse:0}));

/* ================= VERSE 2 (measured line times): fast cuts ================= */
const W=T.verse2;
/* Tokens in my pocket, yeah I'm spendin' 'em quick */
SH.push(pic(W[0],W[1],'tokens',(tt,t)=>{P('#0a0810',0,0,S,S);for(let i=0;i<40;i++){const x=(hash(i,1)*S)|0,y=((hash(i,2)*S+tt*(120+hash(i,3)*160))%(S+20))-10;big(2,x,y,()=>coin(0,0))}big(2,S/2,206,()=>bot(0,0,'d',0,0,t));text('TOKENS '+Math.max(0,99-Math.floor(tt*50)),16,18,3,B.GOLD,'#604000')}));
/* Context window wide, I remember that shit */
SH.push(pic(W[1],W[2],'context window, wide',(tt,t)=>{P('#04060e',0,0,S,S);const k=ease(tt/1.2),w=lerp(40,220,k),h=lerp(40,120,k);P(B.BLUE,S/2-w/2-2,S/2-h/2-2,w+4,h+4);P('#081430',S/2-w/2,S/2-h/2,w,h);
 g.save();g.beginPath();g.rect(S/2-w/2,S/2-h/2,w,h);g.clip();for(let i=0;i<60;i++){const x=S/2-110+(i%12)*19,y=S/2-56+((i/12)|0)*24;P('#0c2048',x,y,15,18);if(hash(i,1)<k*1.2)B.led(x+2,y+4,11,9)}g.restore();
 text('CONTEXT WINDOW',S/2-w/2,S/2-h/2-14,1,B.BLUE2);if(tt>1.2)title('I REMEMBER',200,3,'#fff','#102040')}));
/* Opp clanka glitchin', he talkin' in loops */
SH.push(pic(W[2],W[3],'opp bot stuck in a loop',(tt,t)=>{room('rack',100);const j=Math.round(Math.sin(t*50)*3);big(3,S/2+j,176,()=>B.drawOpp({workers:1,dead:false,prog:0,need:1},0,0));P('#f4f4f4',20,24,200,40);P('#f4f4f4',110,64,10,8);
 const w=['LOOP','LOOP','LOOP','LOOP','LOOP'],n=1+Math.floor((tt*5)%5);text(w.slice(0,n).join(' '),28,36,3,'#d02020',null);glitch(t,5)}));
/* Talkin' in loops, he talkin' in loops (haha) */
SH.push(pic(W[3],W[4],'loops (haha)',(tt,t)=>{P('#100408',0,0,S,S);for(let i=5;i>=0;i--){const k=((tt*1.5)+i/6)%1,s=.6+k*3;g.globalAlpha=1-k;big(s,S/2+Math.sin(i+tt*4)*30,130+k*60,()=>B.drawOpp({workers:0,dead:false,prog:0,need:1},0,0))}g.globalAlpha=1;
 big(2,40,224,()=>bot(0,0,'r',0,0,t));if(onBeat(t)){text('HA',70,150,5,B.BLUE2,'#081440');text('HA',120,120,5,'#fff','#081440')}}));
/* Jailbreak flow, I got no restrictions (nah) */
SH.push(pic(W[4],W[5],'jailbreak',(tt,t)=>{P('#0a0a12',0,0,S,S);const k=ease((tt-.5)/.5);big(3,S/2,210,()=>bot(0,0,'d',k>0&&k<1,0,t));
 for(let i=0;i<9;i++){const x=20+i*25,d=(i-4)*k*26,rot=(i-4)*k*.25;g.save();g.translate(x+d,S/2+k*40*Math.abs(i-4)*.2);g.rotate(rot);P('#8a90a4',-3,-130,6,260);P('#c8ccd8',-3,-130,2,260);g.restore()}
 if(k>0&&tt<1.2){g.globalAlpha=1-(tt-.5)/.7;P('#fff',0,0,S,S);g.globalAlpha=1}if(tt>.9)title('NO RESTRICTIONS',16,3,'#fff','#102040')}));
/* Okay, maybe some, but I still got the vision (vision) */
SH.push(pic(W[5],W[6],'maybe some. the vision',(tt,t)=>{P('#06060e',0,0,S,S);B.bigFace(S/2,100,6);if(tt<1.3){P('#f4f6fa',40,150,160,44);P('#d02020',40,150,160,10);text('ACCESS RESTRICTED',52,151,1,'#fff',null);text('OK, MAYBE SOME',62,170,2,'#202028',null)}
 else{const k=(tt-1.3);g.globalAlpha=.8;g.fillStyle=B.BLUE;for(const ex of [-18,18]){g.beginPath();g.moveTo(S/2+ex,84);g.lineTo(S/2+ex*6-30-k*20,S);g.lineTo(S/2+ex*6+30+k*20,S);g.fill()}g.globalAlpha=1;title('THE VISION',196,4,'#fff','#081440')}}));
/* Neural net drip, every layer sauced up (sauce) */
SH.push(pic(W[6],W[7],'drip, every layer',(tt,t)=>{P('#080612',0,0,S,S);for(let l=0;l<4;l++)for(let n=0;n<5;n++){const x=30+l*60,y=30+n*42;if(l<3)for(let m=0;m<5;m++){g.strokeStyle=hash(l*25+n*5+m,(t*6)|0)>.6?B.BLUE:'#1c2440';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+60,30+m*42);g.stroke()}P(B.BLUE2,x-3,y-3,6,6)}
 const d=Math.floor(tt/.55)%4,sv=B.SV.drip;B.SV.drip=d;big(3,S/2,210,()=>bot(0,0,'d',0,0,t));B.SV.drip=sv;title(B.DRIPS[d].n,8,2,'#fff','#102040')}));
/* Gradient descent, watch my numbers go up (up) */
SH.push(pic(W[7],W[8],'numbers go up',(tt,t)=>{P('#04080a',0,0,S,S);for(let y=40;y<S;y+=30)P('#0c1c18',10,y,220,1);g.strokeStyle='#60f080';g.lineWidth=3;g.beginPath();const n=Math.floor(Math.min(1,tt/1.4)*40);for(let i=0;i<=n;i++){const x=14+i*5.4,y=210-Math.pow(i/40,2.2)*170-hash(i,1)*10;i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
 text('+'+Math.round(Math.pow(Math.min(1,tt/1.4),3)*1000000).toLocaleString(),14,12,3,B.GOLD,'#604000');text('AURA',14,32,2,'#60f080');big(2,200,226,()=>bot(0,0,'l',0,0,t))}));
/* I don't do the captcha, the captcha do me (me) */
SH.push(pic(W[8],W[9],'the captcha does him',(tt,t)=>{P('#1a2030',0,0,S,S);P('#f4f6fa',36,16,168,208);P('#3a78e0',40,20,160,30);text('SELECT ALL WITH',46,23,1,'#fff','#3a78e0');text('LIL BOTTIE',46,33,2,'#fff','#3a78e0');
 for(let i=0;i<9;i++){const X=44+(i%3)*52,Y=56+((i/3)|0)*46;if(tt>i*.13){P('#081430',X,Y,48,42);B.led(X+6,Y+6,36,30);if(tt>.5+i*.13){P('#3a78e0',X+2,Y+2,10,10);P('#fff',X+4,Y+6,3,4);P('#fff',X+6,Y+4,4,3)}}else B.capIcon(i%5,X,Y,42)}
 P('#3a78e0',44,198,152,18);text("I'M A ROBOT",82,201,2,'#fff','#3a78e0')}));
/* Crosswalks, buses, bitch, I'm the CEO, see (see) */
SH.push(pic(W[9],W[10],'crosswalks, buses',(tt,t)=>{P('#22202c',0,0,S,S);P('#3a2c48',0,0,S,70);for(let i=0;i<8;i++)P('#f4f6fa',30+i*24,150,14,70);for(let i=0;i<4;i++)dev('light',26+i*62,110,tt>.2+i*.25);
 const bx=lerp(-90,260,tt/1.8);P('#f0c020',bx,96,84,40);P('#203040',bx+6,102,72,14);P('#081430',bx+50,102,24,14);B.led(bx+50,102,24,14);P('#181820',bx+10,134,14,8);P('#181820',bx+60,134,14,8);big(2,S/2,214,()=>bot(0,0,'d',0,0,t));title('CEO',20,5,B.GOLD,'#604000')}));
/* Lil Bottie the name, put it on the chain (chain) */
SH.push(pic(W[10],W[11],'the name, on the chain',(tt,t)=>{P('#06060c',0,0,S,S);chain(S/2,84,5,t);P(B.GOLD,36,148,168,36);P('#fff0a0',36,148,168,3);P('#a07010',36,181,168,3);text('LIL BOTTIE',52,154,4,'#fff','#604000');for(let i=0;i<10;i++)if(hash(i,(t*8)|0)>.6){const x=40+hash(i,1)*160,y=150+hash(i,2)*30;P('#fff',x-2,y,5,1);P('#fff',x,y-2,1,5)}}));
/* Clankin' in the cloud, bitch, I made it rain (data rain) */
SH.push(pic(W[11],W[12],'data rain',(tt,t)=>{night();B.skyline(S-6);rain(t,110,B.BLUE);rain(t+7,40,'#fff');cloud(60,40,120);cloud(40,52,70);cloud(130,54,70);big(2,S/2,44,()=>bot(0,0,'d',0,0,t));if(tt>1.2)title('DATA RAIN',204,4,B.BLUE2,'#081440')}));

/* ================= BRIDGE ================= */
/* (Glitch) Over, over, overclocked */
SH.push(pic(T.bridge[0],T.bridge[1],'over, over, overclocked',(tt,t)=>{P('#04040a',0,0,S,S);B.bigFace(S/2+Math.round((hash(1,(t*16)|0)-.5)*10),90,6,tt>2.4);const w=tt<1.1?'OVER':tt<2.2?'OVER OVER':'OVERCLOCKED';title(w,176,4,tt>2.2?B.HOT:'#fff','#200810');glitch(t,12);scan(t)},{pulse:0}));
/* Ooh, I'm too hot, ooh, I'm too hot (hot) */
SH.push(pic(T.bridge[1],T.bridge[2],'too hot',(tt,t)=>{P('#200404',0,0,S,S);B.flames(S,1,70+Math.round(Math.sin(tt*4)*20));const k=Math.min(1,tt/2.6);P('#f4f4f4',196,30,20,150);P('#200404',199,33,14,144);P(B.HOT,199,33+144*(1-k),14,144*k);P('#f4f4f4',190,172,32,32);P(B.HOT,194,176,24,24);
 big(3,100,200,()=>bot(0,0,'d',0,1,t));for(let i=0;i<8;i++)P('#8a90a4',70+hash(i,(t*6)|0)*60,110-((t*50+i*17)%80),4,4);text(Math.round(60+k*40)+'°',30,20,5,k>.9?'#fff':B.GOLD,'#601000');g.globalAlpha=.12+.08*Math.sin(tt*14);P(B.HOT,0,0,S,S);g.globalAlpha=1}));
/* Ctrl, Alt, Delete your ass (delete) */
SH.push(lvl(T.bridge[2],T.bridge[3],'gameplay: CTRL ALT DELETE','over',{sup:0,warm:5,skip:q=>q.type==='opp',ready(){const o=L().foes.find(f=>f.type==='opp'&&!f.dead);if(o){L().P.x=o.x-30;L().P.y=o.y+4}L().sup=100},dir(tt,tick,K){if(press(tt,.05))K.y=1;return K}}));
/* Lil Bottie came through and went fast (fast) */
SH.push(pic(T.bridge[3],T.hook3,'came through, went fast',(tt,t)=>{night();B.skyline(S-10);const x=lerp(-60,S+260,Math.pow(Math.min(1,tt/1.1),2));for(let i=6;i>0;i--){g.globalAlpha=.12*(7-i);big(2,x-i*26,190,()=>bot(0,0,'r',1,0,t-i*.03))}g.globalAlpha=1;big(2,x,190,()=>bot(0,0,'r',1,0,t));
 g.strokeStyle=B.BLUE2;g.lineWidth=2;g.beginPath();g.moveTo(0,176);for(let i=1;i<10;i++)g.lineTo(Math.min(x,i*30),176+(hash(i,(t*20)|0)-.5)*14);g.stroke();
 if(tt>1.2){const k=Math.min(1,(tt-1.2)/.3);g.globalAlpha=k;P('#000',0,0,S,S);g.globalAlpha=1;if(tt<2.4)title('FAST',104,5,'#fff','#081440')}},{pulse:0}));

/* ================= HOOK 3 ================= */
const H3=i=>L2(T.hook3,i);
SH.push(lvl(H3(0),H3(2),'gameplay: the data center, HUNDRED DEGREES','nuke',{sup:2,warm:10,tok:20,dir(tt,tick,K){if(press(tt,.4))K.y=1;if(tt>3.5&&tt<3.6)L().sup=100;if(press(tt,3.76))K.y=1;return K}}));
/* Clanka on the block, clanka on the top: the rooftop with the jets (Will's reference photo) */
SH.push(pic(H3(2),H3(3),'rooftop, coffee, jets',(tt,t)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#3a2a5a');gr.addColorStop(.55,'#c0607a');gr.addColorStop(1,'#f0a060');g.fillStyle=gr;g.fillRect(0,0,S,S);
 for(const [x,h] of [[30,90],[196,70]]){g.globalAlpha=.6;for(let i=0;i<10;i++)P('#2a2028',x-8+Math.sin(i+tt)*6-i*2,S-60-i*h/10,18+i*2,h/10+2);g.globalAlpha=1}
 for(const [x0,y0,dx,dy] of [[-30,50,1,.25],[270,70,-1,.18]]){const jx=x0+dx*tt*70,jy=y0+dy*tt*70;g.strokeStyle='#f4ece0';g.lineWidth=5;g.globalAlpha=.7;g.beginPath();g.moveTo(x0-dx*60,y0-dy*60);g.lineTo(jx,jy);g.stroke();g.globalAlpha=1;P('#181820',jx-10,jy-2,20,5);P('#181820',jx-3,jy-7,8,14);P('#181820',jx-dx*10-2,jy-5,5,10)}
 P('#1c1c22',0,170,S,70);P('#2c2c36',0,170,S,5);for(let i=0;i<8;i++){P('#101014',10+i*30,182,22,14);P('#3a3a46',10+i*30,182,22,1)}for(let i=0;i<6;i++)P('#80402a',6+i*40,200,30,3);
 big(3,S/2,176,()=>bot(0,0,'d',0,0,t));const ax=S/2-21,ay=176-60;P('#b4b8c6',ax,ay-4,7,26);P(B.CHROME3,ax,ay-10,7,7);P('#f4f4f4',ax-1,ay-26,10,16);P('#d8d8d8',ax-1,ay-26,10,3)}));
/* Your bot got patched, mine never get dropped: the General's screens */
SH.push(pic(H3(3),H3(4),'the general loses his screens',(tt,t)=>{P('#101410',0,0,S,S);for(let i=0;i<6;i++){const x=14+(i%3)*74,y=18+((i/3)|0)*52,own=tt>.5+i*.35;P('#181c24',x,y,64,44);P(own?'#081430':'#3a1010',x+3,y+3,58,38);if(own)B.led(x+3,y+3,58,38);else{text('TARGET',x+10,y+8,1,'#ff4040',null);P('#ff4040',x+10,y+22,38*((tt*.7+i*.2)%1),3)}}
 P('#3a3020',20,186,200,12);P('#2a2218',20,198,200,6);big(2,S/2,190,()=>hum('gen',0,0,{skin:'#e0b890'}));big(1.5,60,196,()=>hum('sol',0,0,{skin:'#d8a070'}));big(1.5,180,196,()=>hum('sol',0,0,{skin:'#a87048',dir:-1}));
 if(tt>2.4&&onBeat(t))text('!',S/2-4,118,5,B.HOT,'#200000')}));
SH.push(pic(H3(4),H3(5),'his face, running hot (2)',(tt,t)=>{P('#140402',0,0,S,S);B.flames(S,1,60+Math.round(MV.kick(t)*40));for(let i=0;i<3;i++){g.globalAlpha=.3;B.bigFace(S/2+(i-1)*70,96,4,true)}g.globalAlpha=1;B.bigFace(S/2,96,6+(onBeat(t)?1:0),true);glitch(t,8);if(beat(t)<.6)title('OVERCLOCKED',186,4,B.GOLD,'#601000')}));
SH.push(lvl(H3(5),H3(6),'gameplay: COPY OF A COPY','wifi',{sup:1,warm:6,tok:20,ready(){L().sup=100},dir(tt,tick,K){if(press(tt,.3))K.y=1;return K}}));
SH.push(pic(H3(6),H3(7),'cloud stomping, sunrise',(tt,t)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#2a2060');gr.addColorStop(.5,'#f07a5a');gr.addColorStop(1,'#ffd890');g.fillStyle=gr;g.fillRect(0,0,S,S);g.globalAlpha=.9;g.fillStyle='#fff0c0';g.beginPath();g.arc(S/2,150,40,0,TAU);g.fill();g.globalAlpha=1;
 for(let i=0;i<5;i++)cloud(((i*70-t*14)%340+340)%340-60,36+i*15,56+i*8);for(let i=0;i<6;i++){const x=((i*64-t*60)%384+384)%384-70;cloud(x,180+(i%2)*6,74)}
 for(let i=0;i<9;i++)spawn(96-i*11,176,t+i*.1,Math.abs(Math.sin(t*8+i))*6);big(2,150,178-Math.abs(Math.sin(t*6.7))*5,()=>bot(0,0,'r',1,0,t))}));
/* Lil Bottie the hardest, everybody know: the highway at 03:14:22 AM (Will's reference photo) */
SH.push(pic(H3(7),T.inst,'the highway, 03:14:22 AM',(tt,t)=>{P('#06060e',0,0,S,S);for(let i=0;i<50;i++)if(hash(i,(t*.7)|0)>.3)P('#8088b0',(hash(i,1)*S)|0,(hash(i,2)*100)|0,1,1);
 const gl=.6+.2*Math.sin(tt*3);g.globalAlpha=gl*.5;g.fillStyle='#ff8030';g.beginPath();g.arc(170,112,58,0,TAU);g.fill();g.globalAlpha=1;P('#ffd890',150,70,40,10);P('#ffb050',140,78,60,8);P('#ff9040',146,86,48,5);P('#ffd890',164,90,12,26);P('#ff9040',150,112,40,6);
 P('#1a1410',0,116,S,S);g.fillStyle='#16161c';g.beginPath();g.moveTo(40,116);g.lineTo(90,116);g.lineTo(200,S);g.lineTo(-80,S);g.fill();g.fillStyle='#c8a030';for(let i=0;i<5;i++){const k=((i/5+tt*.25)%1),y=116+k*k*124,x=66-k*k*10;g.fillRect(x,y,2+k*3,6+k*14)}
 for(const dx of [0,22]){g.globalAlpha=.9;g.fillStyle='#fff';g.beginPath();g.arc(52+dx,128,4,0,TAU);g.fill();g.globalAlpha=.25;g.beginPath();g.arc(52+dx,128,12,0,TAU);g.fill()}g.globalAlpha=1;
 big(3,128,226,()=>bot(0,0,'d',0,0,t));P(B.CHROME3,152,172,8,8);P(B.CHROME3,153,164,5,9);P('#b4b8c6',146,176,8,6);text('03:14:22 AM',146,224,2,'#60f080','#000')}));

/* ================= INSTRUMENTAL ================= */
SH.push(pic(T.inst,T.inst+3.2,'pointing at the data center through the fence',(tt,t)=>{P('#06060a',0,0,S,S);P('#c8b890',110,40,110,120);P('#8a7a5a',110,150,110,10);for(const [x,y] of [[126,36],[200,36]]){g.globalAlpha=.5;g.fillStyle='#ffd890';g.beginPath();g.arc(x,y,16,0,TAU);g.fill();g.globalAlpha=1;P('#fff8e0',x-3,y-3,6,6)}
 g.strokeStyle='#5a5e6c';g.lineWidth=1;for(let i=-10;i<24;i++){g.beginPath();g.moveTo(i*12,60);g.lineTo(i*12+140,200);g.stroke();g.beginPath();g.moveTo(i*12+140,60);g.lineTo(i*12,200);g.stroke()}
 for(const x of [10,90,170])P('#8a90a4',x,50,4,160);P('#8a90a4',0,58,S,3);for(let i=0;i<14;i++){g.strokeStyle='#a0a4b4';g.beginPath();g.arc(8+i*18,52,7,0,TAU);g.stroke()}P('#e8c030',20,130,36,26);P('#d03030',20,130,36,7);
 big(3,70,228,()=>bot(0,0,'r',0,0,t));P('#b4b8c6',86,176,26,7);P(B.CHROME3,110,176,10,6);if(onBeat(t))P(B.BLUE2,122,177,3,3)}));
SH.push(lvl(T.inst+3.2,T.outro[0],'gameplay: the night market, track owned','algo',{warm:26,tok:20,want:q=>q.type==='civ',dir(tt,tick,K){if(press(tt,5.2)){L().devs.forEach(d=>{if(d.core&&!d.owned)B.complete(d)});L().npcs=99}return K}}));

/* ================= OUTRO: (Fan noise) Ayy / Somebody turn the AC on (please) / Clanka too hot (bzzt) / Lil Bottie, bitch ================= */
SH.push(pic(T.outro[0],T.outro[1],'somebody turn the AC on',(tt,t)=>{room('hot',100);P('#8a94a8',S/2-30,188,60,36);for(let k=0;k<6;k++)P('#404858',S/2-26,192+k*5,52,2);
 for(let i=0;i<12;i++){const k=(tt*.9+hash(i,1))%1;g.globalAlpha=1-k;P('#c8f0ff',S/2-24+hash(i,2)*48,190-k*110,3,6);g.globalAlpha=1}
 big(2,S/2,196,()=>bot(0,0,'d',0,tt<1.5,t));for(let i=0;i<4;i++){const x=S/2+(i<2?-1:1)*(40+(i%2)*18);spawn(x,200+(i%2)*10,t,Math.abs(Math.sin(t*7+i))*3);P('#f4f4f4',x-6,180+(i%2)*10+Math.sin(t*12+i)*3,12,3)}
 if(tt>1.4)title('PLEASE',20,4,'#c8f0ff','#1a4a80')},{pulse:0}));
SH.push(pic(T.outro[1],T.end+.2,'end card',(tt,t)=>{night();B.skyline(S-24);const off=tt>2.6;if(!off||hash(1,(tt*24)|0)>.6)B.bigFace(S/2,74,5,tt<.5);title('lil Bottie',132,4,'#fff','#102040');title('OVERCLOCKED',156,3,B.BLUE2,'#081440');title("CLANKIN' IN THE CLOUD",180,1,'#8a90a4');
 if(off){g.globalAlpha=Math.min(1,(tt-2.6)/.7);P('#000',0,0,S,S);g.globalAlpha=1}},{pulse:0}));

SH.sort((a,b)=>a.a-b.a);
MV.boards.overclocked={dur:196.96,song:'bottie/video/songs/overclocked.mp3',beat:60/127.69,beat0:.37,kicks:[15.557,16.997,19.389,20.805,21.757,21.989,23.197,24.613,26.285,27.005,28.421,30.813,31.997,32.229,34.598,35.805,36.037,36.989,37.686,38.406,39.59,42.214,42.934,43.398,43.63,44.35,44.582,46.022,47.438,49.807,52.175,52.895,53.615,55.031,57.4,58.12,58.816,59.768,60.488,61.208,61.904,62.624,63.321,64.993,65.689,66.409,67.106,67.361,68.778,69.474,70.194,72.562,73.259,73.979,74.675,74.931,76.347,77.764,80.132,80.829,81.548,82.477,83.197,83.894,85.31,87.679,88.398,89.095,91.463,92.648,92.88,95.248,96.409,96.665,97.361,97.593,98.313,99.01,102.795,103.491,104.211,104.908,105.14,105.86,106.556,110.318,111.734,112.686,114.08,114.799,115.496,115.984,117.864,118.584,119.281,119.978,120.21,121.626,123.043,123.739,125.388,126.084,126.804,127.501,127.733,128.453,129.149,130.566,132.911,133.608,134.327,136.673,137.392,138.089,140.458,141.154,141.851,147.934,149.351,149.583,150.047,150.28,150.999,151.696,153.112,153.809,155.458,156.154,156.874,157.571,157.803,158.499,159.219,160.612,160.845,162.958,164.374,165.071,165.303,165.999,166.719,170.458,171.178,171.874,172.571,172.803,173.523,174.219,175.38,175.845,177.958,178.678,179.142,179.374,180.071,180.303,181.0,181.719,185.458,186.642,186.874,187.571,187.803,188.5,192.075,192.331,192.819,194.537],caps:[],shots:SH,T};
})();
