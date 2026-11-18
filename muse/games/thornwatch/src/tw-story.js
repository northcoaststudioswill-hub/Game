/* ================================================================
   THORNWATCH v4 — THE STORY
   Will, Nov 17: "Story and cut-scenes are missing. There should be
   real cut-scenes with our characters, and lore."
   One scene player for the whole cartridge. A scene is a painted
   garden, a few of the cast standing in it, and lines said one
   voice at a time: A for the next line, START to skip.
     intro   the first PLAY (and INTRO on the menu)
     g2 g3   the first time a garden is opened
     b1-b3   the first time a garden's last night begins
     w1-w3   the first time a garden is held
   Each plays once (TW.seen) and never blocks a replay of the night.
   Lore (Will, Nov 18): the enemy is lil Bottie. He sends swarms of
   AI data drones to scrape the gardens' light for "training". He
   is a voice at the edge until the last garden, where he sends a
   drone built to look like him. King Bibi sends a letter, not a
   visit. Sproutwild's own Bottie story (the Data Center, the Peak)
   is not changed or contradicted here. No move names are used or
   invented here (handoff rule 12). Louie's lines are 43 characters
   or fewer (rule 11).
   Lines marked KEPT are v3.4's own, unchanged.
   ================================================================ */
const TWPLATE={LOUIE:'#8a5a3a',WILL:'#3a6ad8',ERIN:'#3f9e4d',MARCUS:'#e07840','KING BIBI':'#1e2c5a',BOTTIE:'#2a5a6a'};
const TWSTORY={
intro:[
 {map:1,bg:'dusk',props:['sleep'],cast:[['LOUIE',176]],lines:[
  ['',"Sunkeep. Erin's Garden, behind the Great Lantern."],
  ['','The Lantern is dark. The light that is left is in the Garden Heart.'],
  ['LOUIE','Sprouts are asleep. I watch the fence.']]},            /* KEPT */
 {map:1,bg:'night',props:['eyes','bottiefar'],cast:[['ERIN',118],['LOUIE',162]],lines:[
  ['LOUIE','Grr. Lights in the dark. They hum.'],
  ['BOTTIE','bzzt! THAT IS MY LIGHT. I need it for my feed. Hand it over!'],
  ['BOTTIE','Do you know who I am? I am the NUMBA ONE CLANKA.'],
  ['ERIN','Bottie. He broke what fed him. Now his drones come for our light.']]},
 {map:1,bg:'night',props:['eyes','march'],cast:[['WILL',92],['ERIN',124],['MARCUS',156],['LOUIE',196]],lines:[
  ['LOUIE','WOOF! WOOF! THE SWARM IS COMING!'],
  ['WILL','Keepers! Take your places!'],                           /* KEPT */
  ['MARCUS','Garden duty. I hate it here.']]},                     /* KEPT */
 {map:1,bg:'dawn',props:['heart'],cast:[['ERIN',96],['MARCUS',132]],lines:[
  ['ERIN','They want the Heart. Each drone that gets there takes some light.'],
  ['ERIN','Plant by day. Hold every garden.'],                     /* KEPT */
  ['MARCUS','Bro. You plant. I supervise.']]}],
b1:[
 {map:1,bg:'night',props:['eyes','thorn'],cast:[['ERIN',112],['MARCUS',144],['LOUIE',188]],lines:[
  ['LOUIE','Sniff... the ground is shaking.'],
  ['ERIN','That is a Harvester. It does not scrape a garden. It mows it.'],
  ['MARCUS','He sent a combine. To a back garden. Normal guy.'],
  ['ERIN','Spend it all tonight. Petals you save are worth nothing at dawn.']]}],
w1:[
 {map:1,bg:'dawn',props:['heart'],cast:[['WILL',96],['ERIN',128],['LOUIE',176]],lines:[
  ['','The Harvester grinds to a stop at the fence. The Heart is still lit.'],
  ['WILL','We held it. For the garden.']]},
 {map:1,bg:'dawn',props:['letter'],cast:[['ERIN',104],['MARCUS',140]],lines:[
  ['','At dawn a letter comes over the wall. It has a royal seal.'],
  ['KING BIBI','Citizens. I am told the drones have reached THE LONG BEDS.'],
  ['KING BIBI','The Dome keeps you in. It does not keep them out. I am told.'],
  ['KING BIBI','I would go myself. I am very busy being safe.'],
  ['MARCUS',"He wrote a whole letter to say he's not coming."],
  ['ERIN','Then we go. The Long Beds feed half of Sunkeep.']]}],
g2:[
 {map:2,bg:'dusk',props:[],cast:[['ERIN',104],['MARCUS',140],['LOUIE',186]],lines:[
  ['','The Long Beds. Row on row, and a longer flight for the swarm.'],
  ['ERIN','A longer path gives us longer to hit them. Use all of it.'],
  ['LOUIE','Sniff sniff. Shields? And something drills.'],
  ['MARCUS','Great. He shipped an update.']]}],
b2:[
 {map:2,bg:'night',props:['eyes','maw','bottiefar'],cast:[['WILL',100],['ERIN',132],['MARCUS',164],['LOUIE',202]],lines:[
  ['LOUIE','GRR. Big mouth. It eats the rows!'],
  ['ERIN','The Scraper. It swallows what we planted. Hurt it and bits spill out.'],
  ['BOTTIE','bzzt! STOP BREAKING MY DRONES. It is not stealing. It is training!'],
  ['MARCUS','It is stealing, bro.'],
  ['BOTTIE','NUMBA. ONE. CLANKA. Say it!'],
  ['WILL','Later. Eyes on the path.']]}],
w2:[
 {map:2,bg:'dawn',props:['heart'],cast:[['ERIN',104],['MARCUS',140],['LOUIE',186]],lines:[
  ['','The Scraper powers down. The rows are a mess, but they are ours.'],
  ['ERIN','Every swarm is bigger than the last. He is learning from each one.'],
  ['LOUIE','Two roads ahead. Both hum.'],
  ['ERIN','The Crossroads. If it falls, both roads lead here.']]}],
g3:[
 {map:3,bg:'dusk',props:[],cast:[['WILL',92],['ERIN',124],['MARCUS',156],['LOUIE',198]],lines:[
  ['','The Crossroads. Old stone, two gates, one Heart.'],
  ['WILL','They come from both sides. Watch for the gate that glows.'],
  ['MARCUS',"Two gates. Twice the work. I'm putting in for overtime."],
  ['ERIN','Split your sprouts. A wall on one road is a door on the other.']]}],
b3:[
 {map:3,bg:'night',props:['eyes','bottie'],cast:[['ERIN',124],['MARCUS',156],['LOUIE',198]],lines:[
  ['BOTTIE','bzzt! ENOUGH. Nobody out-clanks the numba one clanka!'],
  ['BOTTIE','So I built a bigger me. A MADDER me. Oops in advance.'],
  ['MARCUS','He made a bigger him. Of course he did.']]},
 {map:3,bg:'night',props:['eyes','prime'],cast:[['WILL',100],['ERIN',132],['LOUIE',190]],lines:[
  ['LOUIE','WOOF! BIG BOTTIE! VERY BIG!'],
  ['ERIN','Bottie Prime. It runs hotter when it is hurt. Do not let up.'],
  ['WILL','Everything we have. For the garden.']]}],
w3:[
 {map:3,bg:'dawn',props:['heart','bottiefar'],cast:[['WILL',92],['ERIN',124],['MARCUS',156],['LOUIE',198]],lines:[
  ['','Prime goes dark. The last drones drift back over the wall, one by one.'],
  ['BOTTIE','bzzt. FINE. Keep your light. I am STILL the numba one clanka.'],
  ['BOTTIE',"I'll be at the Peak. Do not visit."],
  ['MARCUS','Numba one. Out of one.'],
  ['ERIN','Three gardens, still lit. He will send more. He always does.'],
  ['LOUIE','Woof. I will keep watch.'],
  ['','THE LONG NIGHT is open. How long can you hold?']]}]};
let TWCINE=null;
function twStoryPlay(key,then,dest){const sc=TWSTORY[key];if(!sc){if(then)then();return}
 TWCINE={key,scenes:sc,scene:0,line:0,t:0,st:0,dest:dest||key,then};state='g5cine';snd(392,.12,196)}
/* plays a scene once; returns true if it took over (the caller returns and `then` resumes it) */
function twStoryGate(key,cond,then){if(!cond||!TWSTORY[key])return false;
 if(!TW.seen)TW.seen={};if(TW.seen[key])return false;
 twStoryPlay(key,then);return true}
function twIntroStart(dest){twStoryPlay('intro',()=>{
  if(dest==='play'||dest==='sel'){const s=TWSTART||{map:1,mode:'s',night:1};twNewRun(s.map,s.mode,s.night)}
  else state='g5menu'},dest)}
function twIntroEnd(){const c=TWCINE;TWCINE=null;if(!c){state='g5menu';return}
 if(!TW.seen)TW.seen={};TW.seen[c.key]=1;if(c.key==='intro')TW.introSeen=true;twSave();
 if(c.then)c.then();else state='g5menu'}
function twStoryLineLen(){const sc=TWCINE.scenes[TWCINE.scene];return sc.lines[TWCINE.line][1].length}
function twIntroUpdate(dt){if(!TWCINE){state='g5menu';return}
 TWCINE.t+=dt;TWCINE.st+=dt;
 if(pressed('start')||pressed('sel')){twIntroEnd();return}
 if(pressed('a')){const sc=TWCINE.scenes[TWCINE.scene];
  if(TWCINE.t*46<twStoryLineLen()&&TWCINE.t>.12){TWCINE.t=99;return} /* first press finishes the line */
  if(TWCINE.t<.12)return; /* mash guard: a press carried in from the last screen cannot eat a line */
  TWCINE.t=0;snd(520,.03);
  if(TWCINE.line<sc.lines.length-1)TWCINE.line++;
  else if(TWCINE.scene<TWCINE.scenes.length-1){TWCINE.scene++;TWCINE.line=0;TWCINE.st=0}
  else twIntroEnd()}}
function twBottieSpr(){try{if(typeof SWCHR!=='undefined'&&SWCHR.BOTTIE&&SWCHR.BOTTIE.ol)return SWCHR.BOTTIE.ol}catch(e){}return TWBOTTIE}
function twBottieH(w){try{if(typeof SWCHR!=='undefined'&&SWCHR.BOTTIE&&SWCHR.BOTTIE.ol)return Math.round(w*SWCHR.BOTTIE.oh/SWCHR.BOTTIE.ow)}catch(e){}return Math.round(w*14/12)}
/* he is mad: a red anger mark that pulses over his head */
function twMad(x,y){const p=((time*5)|0)%2;r('#ff5040',x,y+p,2,5);r('#ff5040',x+4,y+p,2,5);r('#ff5040',x-1,y+1+p,8,1);r('#ff5040',x-1,y+3+p,8,1)}
function twStorySpr(who){return who==='WILL'?twHeroSpr(0):who==='ERIN'?CH.ERIN:who==='MARCUS'?CH.MARCUS:who==='BOTTIE'?twBottieSpr():null}
function twStoryBox(){return{x:8,y:H-70,w:W-16,h:50}}
function twStoryWrap(sp,txt){const B=twStoryBox();return wrapPx(txt,sp?B.w-58:B.w-18,2)}
/* every line must fit its box in three rows, and Louie stays short */
function twStoryAudit(){const bad=[];
 for(const k in TWSTORY)for(const sc of TWSTORY[k])for(const ln of sc.lines){
  const w=twStoryWrap(ln[0],ln[1]);if(w.length>3)bad.push(k+': '+w.length+' rows: '+ln[1]);
  if(ln[0]==='LOUIE'&&ln[1].length>43)bad.push(k+': Louie '+ln[1].length+' chars: '+ln[1]);
  if(ln[0]&&!TWPLATE[ln[0]])bad.push(k+': no plate for '+ln[0])}
 return bad}
function twStoryLetter(x,y,sc){ /* King Bibi's letter: cream envelope, red seal */
 r('rgba(0,0,0,.3)',x+2,y+sc*9,sc*14,2);r('#241b30',x-1,y-1,sc*14+2,sc*9+2);r('#f4ead2',x,y,sc*14,sc*9);
 for(let i=0;i<7;i++){r('#c8b890',x+i*sc,y+i*sc*.6,sc,1);r('#c8b890',x+sc*13-i*sc,y+i*sc*.6,sc,1)}
 r('#c02838',x+sc*6,y+sc*4,sc*2,sc*2);r('#e86070',x+sc*6,y+sc*4,sc,sc)}
function twDrawIntro(){if(!TWCINE){r('#14101e',0,0,W,H);return}
 const C=TWCINE,sc=C.scenes[C.scene],ln=sc.lines[C.line],sp=ln[0],map=sc.map||1,night=sc.bg==='night';
 const bt=twBoardTop(),bb=twBoardBot(),gy=Math.min(bb-30,H-96); /* the ground line the cast stands on */
 r('#14101e',0,0,W,H);g.drawImage(twBoardCv(night,map),0,bt);
 if(sc.bg==='dusk'){r('rgba(70,26,74,.26)',0,bt,W,bb-bt);r('rgba(248,140,60,.10)',0,bt,W,bb-bt)}
 else if(sc.bg==='dawn'){r('rgba(255,214,130,.13)',0,bt,W,bb-bt)}
 else r('rgba(6,4,16,.16)',0,bt,W,bb-bt);
 const P=sc.props||[],has=k=>P.indexOf(k)>=0,ent=twPathPts(map,0).pts[0].y;
 if(has('sleep')){for(let i=0;i<3;i++){const tx=40+i*26;r('rgba(0,0,0,.28)',tx-7,gy+2,14,3);twSpr(TWTOW[[0,2,4][i]][0],tx-8,gy-16,16,20);
   if(((time*1.2+i)|0)%2)text('z',tx+7,gy-24-((time*4+i*3)|0)%4,1,'#e8e4f8')}}
 if(has('eyes')){for(let i=0;i<7;i++){const ex=3+(i*5)%13,ey=ent-22+(i*13)%44;
   if(((time*.8+i*.37)%3)>.25){r('#57b8ff',ex,ey,1,1);r('#57b8ff',ex+3,ey,1,1)}}}
 const big=has('thorn')?'boss':has('maw')?'maw':has('prime')?'prime':null;
 if(big){const sz=TWCSZ[big],bw=sz[0]*2,bh2=sz[1]*2,bx=Math.round(-bw*.5+Math.min(1,C.st*.45)*bw*.62),by=ent-bh2+8+Math.round(Math.sin(time*2)*1.5);
  r('rgba(0,0,0,.35)',bx+4,by+bh2-2,bw-8,4);g.drawImage(twOL(TWCREEP[big],bw,bh2),bx,by);
}
 if(has('march')){for(let i=0;i<5;i++){const d=((C.st*9+i*15)%70),p=twPathPos(d,(i%3-1)*2,0),k=i%3===1?'dart':'std',z=TWCSZ[k];
   r('rgba(0,0,0,.3)',Math.round(p.x)-z[0]/2,Math.round(p.y)+2,z[0],2);
   g.drawImage(twOL(TWCREEP[k],z[0],z[1]),Math.round(p.x)-z[0]/2-1,Math.round(p.y)-z[1]-1+Math.round(Math.sin(d*.45)*.7))}}
 if(has('heart')){const hp=twHeartM(map);g.globalAlpha=.16+.06*Math.sin(time*3);r('#f85888',hp.x-17,hp.y-17,34,34);g.globalAlpha=1;
  g.drawImage(twOL(TWHEART,20,22),hp.x-11,hp.y-14)}
 if(has('bottie')||has('bottiefar')){const far=has('bottiefar'),bw=far?20:30,bh2=twBottieH(bw),bx=far?12:24,by=(far?ent-18:gy+1)-bh2+Math.round(Math.sin(time*2.2)*1.5);
  r('rgba(0,0,0,.3)',bx+2,(far?ent-18:gy+1)+1,bw-4,2);g.drawImage(twOL(twBottieSpr(),bw,bh2),bx-1,by-1);
  if(!far){r('#3a3a48',bx+bw+3,gy-10,6,4);r(((time*2)|0)%2?'#ff5040':'#a02820',bx+bw+4,gy-13,4,4)} /* the button */
  twMad(bx+bw-4,by-7)}
 if(has('letter'))twStoryLetter(178,gy-34+Math.round(Math.sin(time*2.4)*2),2);
 /* the cast: 2x, outlined, the speaker steps forward and the rest wait */
 for(const a of (sc.cast||[])){const who=a[0],ax=a[1],talk=who===sp,hop=talk?Math.round(Math.abs(Math.sin(C.t*9))*(C.t<.5?2:0)):0;
  if(who==='LOUIE'){const lp=typeof LOU!=='undefined'&&LOU&&LOU.l&&LOU.l[0];
   if(lp){r('rgba(0,0,0,.28)',ax-17,gy+1,34,3);g.drawImage(twOL(lp,40,26),ax-21,gy-25-hop)}
   else drawDog({x:ax,y:gy,fx:-1,mv:0,st:'sit',alert:night?1:0,say:null});
   if(talk&&/WOOF|GRR|!/.test(ln[1])&&((time*4)|0)%2)text('!',ax+16,gy-36,2,'#f8d030')}
  else{const spr=twStorySpr(who);r('rgba(0,0,0,.28)',ax-10,gy+1,20,3);if(spr)g.drawImage(twOL(spr,24,28),ax-13,gy-27-hop)}}
 /* letterbox + the line */
 r('#0a0818',0,0,W,bt);r('#0a0818',0,bb,W,H-bb);r('#f8d030',0,bt-1,W,1);
 const B=twStoryBox();r('#0a0818',B.x-2,B.y-2,B.w+4,B.h+4);r('#f8d030',B.x-1,B.y-1,B.w+2,B.h+2);r('#f4ead2',B.x,B.y,B.w,B.h);r('#e4d6b4',B.x,B.y+B.h-3,B.w,3);
 let tx=B.x+9;
 if(sp){r('#241b30',B.x+5,B.y+7,40,38);r(TWPLATE[sp]||'#8f86c8',B.x+6,B.y+8,38,36);r('rgba(255,255,255,.14)',B.x+6,B.y+8,38,12);
  if(sp==='LOUIE'){const lp=typeof LOU!=='undefined'&&LOU&&LOU.l&&LOU.l[0];if(lp)g.drawImage(twOL(lp,30,20),B.x+9,B.y+19)}
  else if(sp==='KING BIBI')twStoryLetter(B.x+11,B.y+17,2);
  else if(sp==='BOTTIE'){const bh3=Math.min(32,twBottieH(26));g.drawImage(twOL(twBottieSpr(),26,bh3),B.x+11,B.y+10+Math.round((32-bh3)/2));twMad(B.x+34,B.y+10)}
  else{const spr=twStorySpr(sp);if(spr)g.drawImage(twOL(spr,24,28),B.x+12,B.y+12)}
  const nw=tw(sp,1)+8;r('#241b30',B.x+4,B.y-7,nw+2,13);r(TWPLATE[sp]||'#8f86c8',B.x+5,B.y-6,nw,11);text(sp,B.x+9,B.y-5,1,'#ffffff',null);
  tx=B.x+52}
 const shown=ln[1].slice(0,Math.max(0,Math.floor(C.t*46))),full=twStoryWrap(sp,ln[1]);
 let used=0;const rows=Math.min(3,full.length),y0=B.y+Math.round((B.h-rows*13)/2);
 for(let i=0;i<rows;i++){const part=full[i].slice(0,Math.max(0,shown.length-used));used+=full[i].length+1;
  if(part)text(part,sp?tx:Math.round((W-tw(full[i],2))/2),y0+i*13,2,sp?'#241b30':'#4a3a6a',null)}
 if(C.t*46>=ln[1].length&&((time*2.5)|0)%2)r('#241b30',B.x+B.w-10,B.y+B.h-10,5,3);
 ctext('A: NEXT · START: SKIP',H-13,1,'#8f86c8',null)}
