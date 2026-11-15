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
 mk('BESSLING',2,38,12,12,10,{WATERING:2,FORTUNE:1},[[1,'tackle'],[1,'bubblesnap'],[5,'shellup'],[8,'lakewake'],[12,'tideslam'],[16,'tidalsurge']],'A lake serpent pup. Fishermen swear they saw it. Nobody believes them.','#3aa0a8');
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
 const rows=[['LEGEND',L.lore],['JOBS',Object.entries(s2.work).map(([k2,v])=>k2+' '+v).join(' · ')],
  ['MOVES',s2.learn.filter(([lv])=>lv<=5).map(([,m])=>WMOVES[m].n).join(' · ')],['LEARNS',L.sig?WMOVES[L.sig].n+' · Lv8 · only it':'']];
 let yy=174;rows.forEach(([lab,val],i)=>{const at=1.3+i*.45,lines=swWrap(val,W-62).slice(0,2);if(tick(at))swSnd(660+i*90,.04,880+i*90);
  if(t>=at){const a=Math.min(1,(t-at)/.2);g.globalAlpha=a;text(lab,8,yy,1,T.l,null);lines.forEach((l,j)=>text(l,56,yy+j*10,1,'#e8e4f4',null));g.globalAlpha=1}yy+=lines.length*10+4});
 const st=[['HP',s2.hp,44],['ATK',s2.atk,16],['DEF',s2.def,16],['SPD',s2.spd,14]];
 st.forEach(([lab,v,mx],i)=>{const at=3.1+i*.08;if(t<at)return;const k=Math.min(1,(t-at)/.35),bx=8+(i%2)*116,by=H-42+((i/2)|0)*11;
  text(lab,bx,by,1,'#a8a4c0',null);r('#2a2838',bx+26,by+1,60,5);r(T.c,bx+26,by+1,Math.round(60*Math.min(1,v/mx)*k),5);text(''+v,bx+90,by,1,'#ffffff',null)});
 if(tick(3.1))swSnd(523,.12,784);
 if(t>3.6){r('#14121e',0,H-18,W,18);const a='A  BEFRIEND',b='B  SEE THE OTHERS';text(a,8,H-13,1,'#7ee787',null);text(b,W-8-tw(b,1),H-13,1,'#a89ec2',null)}
 else{const s='A  SKIP';text(s,W-8-tw(s,1),H-13,1,'#5a5870',null)}}
/* ---------------- the Data Center: where buddies beyond three are kept ---------------- */
WBUILD.push({k:'datacenter',n:'DATA CENTER',cost:{wood:10,stone:6,ingot:2},max:1,d:'A humming box of Lantern light. Keeps up to 12 more buddies. Without one you can only have three.'});
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
