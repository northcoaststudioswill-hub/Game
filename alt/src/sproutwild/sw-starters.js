/* ================================================================
   STARTERS, THE REVEAL, AND THE DATA CENTER (v7.0)
   The three first partners are creatures out of north-east Ohio lore.
   They are stronger than common buddies, good at two jobs each, learn
   a move nobody else gets, and never appear in the wild.
     CUYAPUP   EMBER  the Cuyahoga, "crooked river", which caught fire
     BESSLING  DEW    South Bay Bessie, the Lake Erie monster
     GRASSKIN  LEAF   the Grassman, Ohio's woods-walker
   Greeting one plays a short reveal: silhouette, flash, name, then
   its legend, type, jobs, moves and stats, one line at a time.
   The DATA CENTER is a building that stores buddies beyond three.
   ================================================================ */
Object.assign(WMOVES,{
 riverfire:{n:'RIVER FIRE',t:0,p:55,acc:100,d:'The river is on fire. Again.'},
 lakewake:{n:'LAKE WAKE',t:2,p:55,acc:100,d:'Something big just moved under the water.'},
 bigstomp:{n:'BIG STOMP',t:4,p:55,acc:100,d:'A footprint people will argue about.'}});
const WSTARTERS={
 CUYAPUP:{tag:'THE BURNING RIVER PUP',lore:'Born the night the crooked river caught fire.',sig:'riverfire'},
 BESSLING:{tag:"THE LAKE MONSTER'S PUP",lore:'Pup of the great lake serpent. Reward still out.',sig:'lakewake'},
 GRASSKIN:{tag:'THE LITTLE GRASSMAN',lore:'A shaggy woods-walker of the eastern hills.',sig:'bigstomp'}};
const WSTARTART={
CUYAPUP(D){const fur='#5c4238',cr='#f0d8b0',og='#f8902c';
 D.l(17.5,18.5,21.5,13.5,2.4,fur);D.p([[21.4,14],[19.6,10],[21.6,11.4],[22.6,8.6],[23.4,13.4]],og);D.p([[21.6,13.2],[21.2,11.2],[22.6,12]],'#ffe070');
 D.l(9,20.5,9,22.6,2.4,'#40302a');D.l(15,20.5,15,22.6,2.4,'#40302a');D.b(12.5,16.6,6.2,4.6,fur);D.e(11.4,18.2,3.6,2.3,cr);D.e(15,14.6,1.6,.8,'#8a6aa8');
 D.p([[8.6,5.6],[7.2,1.4],[9.8,3.2],[10.8,.6],[12.2,5.2]],og);D.p([[9.6,5.4],[9.4,3],[11,4.4]],'#ffe070');
 D.e(5,5.8,1.4,1.3,fur);D.e(12.8,5.4,1.4,1.3,fur);D.b(9,9.6,5.6,4.8,fur);D.e(7,11.3,3.1,2.1,cr);D.e(5.5,10.5,.9,.7,'#2a1a1a');
 D.eye(7.1,8.8,1.5);D.eye(11.4,8.8,1.5);D.r(6.2,12.4,1.8,.6,'#8a4a40')},
BESSLING(D){const tl='#3aa0a8',dk='#287880',cr='#c8f0e8';
 D.p([[20,17],[23.6,13.2],[22.6,18.6]],tl);D.p([[9,20],[5.4,22.8],[10.6,22]],dk);D.p([[17,20.6],[20,23],[21,20.4]],dk);
 D.b(14,18,7,4.2,tl);D.e(13,19.8,5,1.9,cr);
 D.p([[11.6,14],[13,11.4],[14.4,14]],'#ffe070');D.p([[15.2,14.4],[16.4,12.4],[17.6,14.6]],'#ffe070');
 D.l(9.6,16.4,7.6,8,3.6,tl);D.l(9.2,16,7.6,9.4,1.4,cr);D.b(6.6,6.2,3.9,3.2,tl);D.e(4.1,7.3,2,1.4,cr);
 D.p([[6.8,3.4],[8,.8],[9.4,3.4]],'#ffe070');D.eye(5.8,5.6,1.5);D.eye(8.8,5.5,1.2);D.r(3.4,8,1.6,.6,dk)},
GRASSKIN(D){const fur='#6a8c3a',dk='#4a6a2a',fc='#e0c090';
 D.e(8.4,22.6,2.8,1.2,'#4a3a22');D.e(15.6,22.6,2.8,1.2,'#4a3a22');
 D.l(6,14,4.4,19.6,2.6,fur);D.l(18,14,19.8,19.6,2.6,fur);D.b(12,15.6,7,6.6,fur);
 D.p([[6.4,17.6],[5,21],[7.8,20]],dk);D.p([[17.6,17.6],[19,21],[16.2,20]],dk);D.p([[10,20],[12,22.6],[14,20]],dk);
 D.b(12,8.2,5.8,5,fur);D.e(11,9.5,3.8,3,fc);D.r(7.8,7,6.4,1,'#3a5220');
 D.eye(9.3,8.9,1.4);D.eye(12.8,8.9,1.4);D.r(10,11.3,2.4,.7,'#6a3a30');
 D.l(12,3.6,12,1.4,.9,'#3a7d2e');D.e(10.2,1.6,2,1.1,'#8fd45e');D.e(13.8,1.4,2,1.1,'#8fd45e')}};
{const fb=["..ss..",".sggs.","sggggs",".sggs."],mk=(id,t,hp,atk,def,spd,work,learn,d,c)=>{const s={id,t:[t],hp,atk,def,spd,catch:.3,work,learn,d,spr:fb.slice(),pal:{s:'#14101e',g:c},starter:1};
  s._old=SWSPR(s.spr,s.pal);s._spr=swbMake(WSTARTART[id]);WSPECIES.push(s)};
 mk('CUYAPUP',0,34,14,10,12,{KINDLING:2,WATERING:1},[[1,'tackle'],[1,'embershot'],[5,'quicknip'],[8,'riverfire'],[12,'flameburst'],[16,'magmaburst']],'A river pup with a tail that never goes out. Leaves a rainbow sheen on puddles.','#f8902c');
 mk('BESSLING',2,38,14,12,10,{WATERING:2,FORTUNE:1},[[1,'tackle'],[1,'bubblesnap'],[5,'shellup'],[8,'lakewake'],[12,'tideslam'],[16,'tidalsurge']],'A lake serpent pup. Fishermen swear they saw it. Nobody believes them.','#3aa0a8');
 mk('GRASSKIN',4,40,14,12,8,{PLANTING:2,QUARRY:1},[[1,'tackle'],[1,'vinelash'],[5,'warcry'],[8,'bigstomp'],[12,'headbutt'],[16,'thornstorm']],'A knee-high Grassman. Hides behind trees it is wider than.','#6a8c3a');
 WCHOICE[0].sp='CUYAPUP';WCHOICE[1].sp='BESSLING';WCHOICE[2].sp='GRASSKIN';
 Object.assign(WBLURB,{CUYAPUP:'Fast and fierce. Runs the kiln and waters the garden.',BESSLING:'Tough and lucky. The best waterer there is.',GRASSKIN:'The strongest of the three. Plants, chops and hauls stone.'})}
/* ---------------- the reveal ---------------- */
function choiceUpdate(){const full=(W4.revT||0)>3.6;
 if(pressed('b')){W4.revT=null;state='g4world';return}
 if(pressed('a')){if(!full){W4.revT=4;return}const sp=W4.choiceSp;W4.revT=null;state='g4world';wBefriend(sp)}}
function drawChoice(){const sp=W4.choiceSp,s2=wSp(sp),spr=s2._spr,T=TYPES[s2.t[0]],L=WSTARTERS[sp]||{tag:'FIRST PARTNER',lore:s2.d},K='#07060c';
 if(W4.revT==null||W4.revSp!==sp){W4.revT=0;W4.revSp=sp;swSnd(110,.5,55)}const t0=W4.revT;W4.revT+=1/60;const t=W4.revT,tick=(at)=>t0<at&&t>=at;
 r(K,0,0,W,H);
 /* light behind it */
 const k0=Math.min(1,t/.6),cx=W/2,cy=76;g.globalAlpha=.5*k0;r(T.d,0,22,W,108);g.globalAlpha=1;
 if(t>.6)uiRays(cx,cy,150,12,T.l,.16+.05*Math.sin(time*3));
 /* it slides in as a shadow, then the flash shows its colours */
 const sc=4,w=spr.ow*sc,h=spr.oh*sc,slide=t<.6?(1-k0)*(1-k0)*150:0,bob=t>.6?Math.round(Math.sin(time*2.4)*2):0,x=Math.round(cx-w/2+slide),y=Math.round(cy-h/2+bob);
 r('rgba(0,0,0,.35)',cx-34,cy+h/2-8,68,7);
 if(t<.6){g.drawImage(spr.hol,x,y,w,h);g.globalCompositeOperation='source-atop';g.globalCompositeOperation='source-over';g.globalAlpha=.86;r(K,x,y,w,h);g.globalAlpha=1;g.drawImage(spr.hol,x,y,w,h);g.globalAlpha=.9;g.fillStyle=K;g.globalAlpha=1}
 else g.drawImage(spr.ol,x,y,w,h);
 if(t<.6){g.globalAlpha=.93;r(K,0,22,W,108);g.globalAlpha=1;g.globalAlpha=.25;g.drawImage(spr.hol,x,y,w,h);g.globalAlpha=1}
 if(tick(.6)){swSnd(880,.25,1760);swSnd(220,.3,110)}
 if(t>=.6&&t<.9){g.globalAlpha=1-(t-.6)/.3;r('#ffffff',0,0,W,H);g.globalAlpha=1}
 /* letterbox and name */
 r(K,0,0,W,22);r(K,0,130,W,H-130);r(T.c,0,22,W,1);r(T.c,0,130,W,1);
 if(t>=.75){const sh=t<1.05?Math.round((1.05-t)*14*Math.sin(t*90)):0;g.save();g.translate(W/2,136+sh);g.scale(2,2);text(sp,-tw(sp,1)/2,0,1,'#ffffff',null);g.restore();ctext(L.tag,158,1,T.l)}
 if(tick(.75))swSnd(330,.2,165);
 text('FIRST PARTNER',6,7,1,'#8a86a0',null);const tn=WT[s2.t[0]];text(tn,W-6-tw(tn,1),7,1,T.l,null);
 /* the facts, one line at a time */
 const rows=[['LEGEND',L.lore],['PICK IF',WBLURB[sp]||''],['JOBS',Object.entries(s2.work).map(([k2,v])=>k2+' '+v).join(' · ')],
  ['OWN MOVE',L.sig?WMOVES[L.sig].n+' at Lv8':''],['GROWS TO',WEVO[sp]?WEVO[sp]+' at Lv16':'']];
 let yy=172;rows.forEach(([lab,val],i)=>{const at=1.3+i*.36,lines=swWrap(val,W-70).slice(0,2);if(tick(at))swSnd(660+i*90,.04,880+i*90);
  if(t>=at){const a=Math.min(1,(t-at)/.2);g.globalAlpha=a;text(lab,8,yy,1,T.l,null);lines.forEach((l,j)=>text(l,64,yy+j*10,1,'#e8e4f4',null));g.globalAlpha=1}yy+=lines.length*10+4});
 const st=[['HP',s2.hp,44],['ATK',s2.atk,16],['DEF',s2.def,16],['SPD',s2.spd,14]];
 st.forEach(([lab,v,mx],i)=>{const at=3.1+i*.08;if(t<at)return;const k=Math.min(1,(t-at)/.35),bx=8+(i%2)*116,by=H-42+((i/2)|0)*11;
  text(lab,bx,by,1,'#a8a4c0',null);r('#2a2838',bx+26,by+1,60,5);r(T.c,bx+26,by+1,Math.round(60*Math.min(1,v/mx)*k),5);text(''+v,bx+90,by,1,'#ffffff',null)});
 if(tick(3.1))swSnd(523,.12,784);
 if(t>3.6){r('#14121e',0,H-18,W,18);const a='A  BEFRIEND',b='B  SEE THE OTHERS';text(a,8,H-13,1,'#7ee787',null);text(b,W-8-tw(b,1),H-13,1,'#a89ec2',null)}
 else{const s='A  SKIP';text(s,W-8-tw(s,1),H-13,1,'#5a5870',null)}}
/* ---------------- the Data Center: where buddies beyond three are kept ---------------- */
WBUILD.push({k:'datacenter',n:'DATA CENTER',cost:{stone:8,ingot:2},max:1,d:'Stores 12 more buddies. Without it you can keep only three.'});
function wHasDC(){return SW.buildings.some(b=>b.k==='datacenter'&&!b.con)}
function wBuddyCap(){return wHasDC()?15:3}
let WNOCAP=false;
function wBuddyFull(){return!WNOCAP&&SW.party.length+SW.box.length>=wBuddyCap()}
function wFullSay(){if(time>(W4.fullAt||0)){W4.fullAt=time+6;swSay(wHasDC()?'The Data Center is full.':'No room for another buddy. Build a DATA CENTER at Sunkeep to keep more than three.',3.4);swSnd(200,.08,140)}}
function dcDraw(b){const x=wCellX(b.gx),y=wCellY(b.gy),K='#14101e',t=time;
 r('rgba(0,0,0,.24)',x-4,y+17,30,5);r(K,x-2,y-6,24,27);r('#5a6478',x-1,y-5,22,25);r('#7c88a0',x-1,y-5,22,2);r('#3e4656',x-1,y+17,22,3);
 for(let i=0;i<3;i++){const yy=y-1+i*6;r(K,x+2,yy,16,5);r('#20242e',x+3,yy+1,14,3);
  r(((t*3+i*1.7)|0)%3?'#7ee787':'#1d5a2a',x+4,yy+2,2,1);r(((t*5+i)|0)%4?'#ffd94d':'#6a5a1a',x+8,yy+2,2,1);r(((t*2+i*2.3)|0)%2?'#58a0f0':'#1e3a66',x+12,yy+2,3,1)}
 r(K,x+9,y-12,2,7);r('#c8ccd4',x+9,y-11,1,5);g.globalAlpha=.5+.5*Math.sin(t*4);r('#fff3b0',x+8,y-14,3,3);g.globalAlpha=1;
 const n=SW.box.length;if(n){const s=''+n,lw=tw(s,1);r(K,x+10-lw/2-2,y+20,lw+4,9);text(s,x+10-lw/2,y+21,1,'#7ee787',null)}}
/* ---------------- starter evolutions at Lv16 (v7.2) ---------------- */
const WSTARTEVO={
CUYAFLARE(D){const fur='#4e362e',cr='#f0d8b0',og='#f8902c',yl='#ffe070',dk='#34241e';
 D.l(17,17,22,10,2.8,fur);D.p([[22,10.6],[19.4,5],[21.8,7],[23.2,3],[23.8,10]],og);D.p([[22,9.6],[21.4,7.2],[23,8]],yl);
 D.l(9,19.5,8.6,22.6,2.8,dk);D.l(15.5,19.5,16,22.6,2.8,dk);D.p([[15,9.6],[16.6,6],[17.6,10]],og);D.p([[17,11.4],[19.2,8.4],[19.2,12.6]],og);
 D.b(12.5,15,6.6,6,fur);D.e(11.4,16.6,3.8,3.6,cr);D.l(7,13.5,4.6,16.6,2,fur);D.l(17.6,13.5,19.2,16.6,2,fur);D.e(15.4,12.4,1.8,.8,'#8a6aa8');
 D.p([[8.2,3.8],[6.8,.4],[9.4,2],[10.6,0],[11.4,2],[12.8,.6],[12.8,4]],og);D.p([[9.6,3.8],[9.4,1.8],[10.8,3],[11.6,1.8],[11.8,3.8]],yl);
 D.e(5.2,4.4,1.4,1.3,fur);D.e(13.4,4.2,1.4,1.3,fur);D.b(9.4,7.6,5.4,4.6,fur);D.e(7.4,9.2,3,2,cr);D.e(5.8,8.4,.9,.7,'#1a1010');
 D.eye(7.6,6.9,1.4);D.eye(11.6,6.9,1.4);D.l(6.2,5.2,8.8,5.9,.7,'#1a1010');D.l(13,5.2,10.6,5.9,.7,'#1a1010');D.r(6.4,10.2,2,.6,'#8a4a40')},
BESSIE(D){const tl='#2e8c98',dk='#1f6670',cr='#c8f0e8',yl='#ffe070';
 D.p([[19,17],[23.8,11],[22.4,18.4]],tl);D.b(19.6,16.8,3,2.4,tl);D.p([[8.6,20],[4.4,23],[10.6,22.4]],dk);D.p([[17,21],[20.4,23.4],[21,20.6]],dk);
 D.b(15,18.6,7.6,3.8,tl);D.e(14,20.7,5.6,1.5,cr);
 D.p([[12,15.2],[13.4,11.8],[14.8,15.2]],yl);D.p([[15.6,15.2],[17,12.4],[18.4,15.6]],yl);D.p([[19,14.8],[20.2,12.8],[21.2,15.2]],yl);
 D.l(9.4,17,6.6,6,4,tl);D.l(9,16.4,6.6,7.6,1.5,cr);D.b(5.8,4.6,4.4,3.2,tl);D.e(3,5.6,2.4,1.5,cr);
 D.p([[6.2,2],[7.6,.2],[9,2.2]],yl);D.p([[8.6,2.6],[10.2,.9],[10.6,3.4]],yl);D.eye(5,4,1.4);D.eye(8,3.9,1.1);D.r(2,6.7,2.4,.6,dk)},
GRASSMAN(D){const fur='#5a7a30',dk='#3e5a22',fc='#e0c090';
 D.e(7.6,22.8,3.2,1.2,'#4a3a22');D.e(16.4,22.8,3.2,1.2,'#4a3a22');D.l(9,18,8.4,22,3.4,fur);D.l(15,18,15.6,22,3.4,fur);
 D.l(5.4,10,3,18.4,3,fur);D.l(18.6,10,21,18.4,3,fur);D.e(3,19,1.6,1.4,dk);D.e(21,19,1.6,1.4,dk);D.b(12,13,7.6,7.4,fur);
 D.p([[6.6,16],[5.4,20],[8.2,18.6]],dk);D.p([[17.4,16],[18.6,20],[15.8,18.6]],dk);D.p([[10,18.4],[12,21.4],[14,18.4]],dk);D.p([[8,9.6],[10,12.4],[12,9.8]],dk);
 D.b(12,5.6,5,4.4,fur);D.e(11.4,6.7,3.4,2.6,fc);D.r(8.4,4.6,6,1,'#2a4218');D.eye(9.8,6.3,1.2);D.eye(13,6.3,1.2);D.r(10.2,8.4,2.4,.7,'#6a3a30');
 D.l(12,2.6,12,1,.9,'#3a7d2e');D.e(9.6,1.6,2.2,1.1,'#8fd45e');D.e(14,1.4,2.2,1.1,'#8fd45e')}};
{const fb=["..ss..",".sggs.","sggggs",".sggs."],ev=(from,id,hp,atk,def,spd,work,d,c)=>{const b=wSp(from),s={id,t:b.t.slice(),hp,atk,def,spd,catch:.1,work,learn:b.learn.slice(),d,spr:fb.slice(),pal:{s:'#14101e',g:c},starter:1};
  s._old=SWSPR(s.spr,s.pal);s._spr=swbMake(WSTARTEVO[id]);WSPECIES.push(s);WEVO[from]=id};
 ev('CUYAPUP','CUYAFLARE',54,21,14,16,{KINDLING:3,WATERING:2},'The river burns wherever it swims. It thinks this is normal.','#f8902c');
 ev('BESSLING','BESSIE',60,18,18,13,{WATERING:3,FORTUNE:2},'The lake monster herself. The reward was never claimed.','#2e8c98');
 ev('GRASSKIN','GRASSMAN',64,21,17,10,{PLANTING:3,QUARRY:2},'Seven feet of moss and manners. Leaves very large footprints.','#5a7a30');
 Object.assign(WBLURB,{CUYAPUP:'Fast hitter. Runs the kiln.',BESSLING:'Tough and lucky. Waters.',GRASSKIN:'Strongest. Plants, chops.'})}
/* ---------------- "how Sunkeep works": one card, once, right after your first buddy ---------------- */
function loopUpdate(){W4.loopT=(W4.loopT||0)+1/30;if((pressed('a')||pressed('start'))&&W4.loopT>.8){swSnd(660,.06,990);W4.loopT=0;if(!W4.loopP){W4.loopP=1;return}W4.loopP=0;SW.lessons.loop=1;state='g4world';swSave()}}
function drawLoop(){if(W4.loopP){drawLoop2();return}const K='#0c1410',t=W4.loopT||0,rows=[['1','THROW','A throws sprouts at berries, logs and wild buddies.','#f8902c'],['2','CARRY','They carry it all home. The Lantern grows more sprouts.','#58a0f0'],
  ['3','CATCH','Enough sprouts on a wild buddy and it joins you.','#7ee787'],['4','BUILD','Buddies you leave home do the work. Build Sunkeep up.','#ffd94d'],['5','SIGILS','Win the four gyms to open the roads.','#f078c0']];
 ox=0;oy=0;r(K,0,0,W,H);r('#ffd94d',0,22,W,1);ctext('HOW SUNKEEP WORKS',8,1,'#ffd94d');
 rows.forEach(([n,h,d,c],i)=>{const at=.15+i*.18;if(t<at)return;const y=34+i*46,k=Math.min(1,(t-at)/.2),xo=Math.round((1-k)*40);g.globalAlpha=k;
  r('#14101e',8+xo,y,22,22);r(c,10+xo,y+2,18,18);text(n,16+xo,y+7,1,'#14101e',null);text(h,38+xo,y+2,1,c,null);swWrap(d,W-50).slice(0,3).forEach((l,j)=>text(l,38+xo,y+14+j*10,1,'#e8f4d8',null));g.globalAlpha=1});
 if(t>1.2){r('#14121e',0,H-18,W,18);const s='A  GOT IT';text(s,W-8-tw(s,1),H-13,1,'#7ee787',null)}}
/* the top-bar counters explain themselves the first time each one matters */
function hudTips(){const L=SW.lessons;if(W4.scene||state!=='g4world'||W4.msgT>0||wOp()<3)return;
 if(SW.res.wood>0&&!L.hW){L.hW=1;swSay('♣ at the top is WOOD. Buildings cost wood.',3.2)}
 else if(SW.res.stone>0&&!L.hS){L.hS=1;swSay('◆ at the top is STONE. Bigger buildings need it.',3.2)}
 else if(W4.sector==='TOWN'&&!L.hP){L.hP=1;swSay('✿ at the top is PETALS: money for town and the cottage.',3.4)}
 else if(SW.hearts>0&&!L.hH&&!W4.fld){L.hH=1;swSay('♥ are gratitude hearts. The Great Lantern trades plans for them.',3.4)}}
function drawLoop2(){const t=W4.loopT||0;ox=0;oy=0;r('#0c1410',0,0,W,H);r('#ffd94d',0,22,W,1);ctext('YOUR FIRST THREE SPROUTS',8,1,'#ffd94d');
 [0,2,4].forEach((ty,i)=>{const at=.1+i*.2;if(t<at)return;const T=TYPES[ty],y=40+i*62,k=Math.min(1,(t-at)/.2);g.globalAlpha=k;
  g.save();g.translate(26,y+30);g.scale(2,2);drawBud({x:0,y:0,type:ty,stage:2,z:0,a:ty,mv:false,st:'follow',fx:1});g.restore();
  text(T.n,52,y+4,1,T.l,null);swWrap(WKINDS[ty].good,W-62).slice(0,2).forEach((l,j)=>text(l,52,y+16+j*10,1,'#e8f4d8',null));g.globalAlpha=1});
 if(t>.7){ctext('More kinds are out in the wild. Each has its own job.',H-36,1,'#a8c898');r('#14121e',0,H-18,W,18);const s='A  GOT IT';text(s,W-8-tw(s,1),H-13,1,'#7ee787',null)}}
