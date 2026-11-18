/* ================================================================
   CLANKAWATCH v4 — MENUS
   Will, Nov 18: "I can't start a new game and manage saves, also
   the whole menu system needs a rework."
   Title -> FILES -> MAIN MENU. Everything else hangs off the menu.
     FILES      three save files. A plays one (an empty one is a
                new game). SELECT erases one, after asking.
                File 1 is the save the game always had.
     MAIN MENU  six entries, no scrolling. Each says what it is
                and shows its own status on the right.
     OPTIONS    sound, shake, change file, swap cartridge.
     ALMANAC    how to play, controls, the drone guide, and LORE:
                pages about the valley, taken from the other
                Pocket Lantern games. They open as nights are held.
   One frame for every screen (twFrame) so they look like one game.
   ================================================================ */
function twFrame(title,hint,right){r('#14101e',0,0,W,H);r('#241b40',0,0,W,24);r('#f8d030',0,24,W,1);
 text(title,6,5,2,'#fff8e0');if(right)text(right,W-6-tw(right,2),5,2,'#f8d030');
 r('#0d0a18',0,H-18,W,18);r('#2c2450',0,H-18,W,1);if(hint)text(hint,6,H-13,1,'#b8b0d8')}
/* ---------- save files ---------- */
let TWFILES=null;
function twSlotRead(i){try{const s=localStorage.getItem(TWKEYS[i]);if(!s)return null;return Object.assign(TWDEF(),JSON.parse(s))}catch(e){return null}}
function twWith(S,fn){const o=TW;TW=S;try{return fn()}finally{TW=o}}
function twSlotInfo(i){const S=twSlotRead(i);if(!S||!(S.plays>0||S.made||S.introSeen||twWith(S,twStarPoints)>0))return null;
 return twWith(S,()=>{const f=twFrontier(),done=twClearedCount()>=26;
  return{where:done?'ALL THREE GARDENS HELD':TWMAPS[f.map-1].name+' · NIGHT '+f.night,stars:twStarPoints(),drops:TW.drops,held:[1,2,3].filter(m=>twMapCleared(m)).length,perks:TW.perks.length,long:TW.endlessBest||0}})}
function twFilesOpen(){let cur=0;try{cur=+(localStorage.getItem('thornwatch-slot')||0)||0}catch(e){}
 TWFILES={sel:Math.max(0,Math.min(2,cur)),erase:null,note:''};state='g5file'}
function twSlotPick(i){TWSLOT=i;TW=twSlotRead(i)||TWDEF();TW.made=1;try{localStorage.setItem('thornwatch-slot',String(i))}catch(e){}
 twSave();twSyncSet();TWMenuSel=0;TWNOTE='';state='g5menu'}
function twFilesInput(){const u=TWFILES;if(!u){state='g5title';return}
 if(u.erase){if(pressed('left')||pressed('right')){u.erase.yes=!u.erase.yes;snd(520,.03)}
  if(pressed('b')){u.erase=null;snd(330,.05);return}
  if(pressed('a')){if(u.erase.yes){try{localStorage.removeItem(TWKEYS[u.sel])}catch(e){}
    if(TWSLOT===u.sel)TW=TWDEF();u.note='FILE '+(u.sel+1)+' ERASED.';snd(220,.2,110)}else snd(330,.05);
   u.erase=null}
  return}
 if(pressed('up')){u.sel=(u.sel+2)%3;u.note='';snd(520,.03)}
 if(pressed('down')){u.sel=(u.sel+1)%3;u.note='';snd(520,.03)}
 if(pressed('b')){TWFILES=null;state='g5title';snd(330,.05);return}
 if(pressed('sel')){if(twSlotInfo(u.sel)){u.erase={yes:false};snd(160,.08)}else{u.note='THAT FILE IS EMPTY.';snd(160,.06)}return}
 if(pressed('a')||pressed('start')){snd(660,.06);const i=u.sel;TWFILES=null;twSlotPick(i)}}
function twDrawFiles(){const u=TWFILES||{sel:0};twFrame('CHOOSE A FILE','A: PLAY · SEL: ERASE · B: TITLE');
 const ch=Math.min(66,Math.floor((H-24-18-20)/3)),y0=30;
 for(let i=0;i<3;i++){const y=y0+i*(ch+4),sel=u.sel===i,inf=twSlotInfo(i);
  r(sel?'#f8d030':'#2c2450',8,y,W-16,ch);r(sel?'#2c2450':'#1b1630',9,y+1,W-18,ch-2);
  text('FILE '+(i+1),14,y+5,2,sel?'#fff8e0':'#c8c0d8');
  if(inf){text(inf.where,14,y+19,1,'#7fd4f8');
   g.drawImage(TWSTAR,14,y+ch-15,9,9);text(String(inf.stars),26,y+ch-14,1,'#f8d030');
   const s2='GARDENS HELD '+inf.held+'/3'+(inf.long?' · LONG NIGHT '+inf.long:'');text(s2,52,y+ch-14,1,'#c8c0d8');
   for(let m=0;m<3;m++)r(m<inf.held?'#a8e078':'#3a3454',W-44+m*10,y+7,8,8);
   if(TWSLOT===i&&TW&&TW.made){const l='LAST PLAYED';text(l,W-50-tw(l,1),y+7,1,'#a8e078')}}
  else{text('NEW GAME',14,y+19,1,'#a8e078');if(ch>44)text('Night one. One mad clanka.',14,y+ch-14,1,'#8f86c8')}}
 if(u.note)ctext(u.note,H-32,1,'#ffd94d',null);
 if(u.erase){r('rgba(8,6,16,.8)',0,0,W,H);const bw=196,bx=(W-bw)/2,by=Math.round(H/2)-34;
  r('#f8d030',bx,by,bw,68);r('#2a1420',bx+1,by+1,bw-2,66);
  ctext('ERASE FILE '+(u.sel+1)+'?',by+8,2,'#ff6a5e');ctext('Stars and upgrades: gone.',by+25,1,'#e8e4f8',null);
  const yes=u.erase.yes;r(!yes?'#f8d030':'#3a3454',bx+22,by+42,66,16);r(yes?'#ff6a5e':'#3a3454',bx+108,by+42,66,16);
  text('KEEP IT',bx+31,by+45,2,!yes?'#14101e':'#c8c0d8',null);text('ERASE',bx+123,by+45,2,yes?'#14101e':'#c8c0d8',null)}}
/* ---------- the main menu ---------- */
function twHubItems(){const f=twFrontier(),done=twClearedCount()>=26,fresh=twStarPoints()===0&&!TW.introSeen,long=twMapCleared(3);
 return[
  {n:fresh?'NEW WATCH':'CONTINUE',st:done?'ALL HELD':'G'+f.map+' NIGHT '+f.night,d:fresh?"Night one in Erin's Garden.":TWMAPS[f.map-1].name+', night '+f.night+'.'},
  {n:'GARDENS',st:twStarPoints()+' STARS',d:'Any garden and night you opened.'},
  {n:'THE LANTERN',st:TW.drops+' DROPS',d:'Spend Sun Drops on upgrades.'},
  {n:'THE LONG NIGHT',st:long?(TW.endlessBest?'BEST '+TW.endlessBest:'OPEN'):'LOCKED',lock:!long,d:long?'No dawn. How long can you hold?':'Hold all three gardens first.'},
  {n:'ALMANAC',st:twLoreOpen()+'/'+TWLORE.length+' LORE',d:'How to play, drones, and lore.'},
  {n:'OPTIONS',st:'FILE '+(TWSLOT+1),d:'Sound, shake, files, cartridge.'}]}
function twHubInput(){const n=6;
 if(pressed('up')){TWMenuSel=(TWMenuSel+n-1)%n;TWNOTE='';snd(520,.03)}
 if(pressed('down')){TWMenuSel=(TWMenuSel+1)%n;TWNOTE='';snd(520,.03)}
 if(pressed('b')){twFilesOpen();snd(330,.05);return}
 if(!(pressed('a')||pressed('start')))return;
 const i=TWMenuSel;
 if(i===0){snd(660,.06);const f=twFrontier();TWSTART={map:f.map,mode:'s',night:f.night};
  if(!TW.introSeen)twIntroStart('play');else twNewRun(f.map,'s',f.night)}
 else if(i===1){TWMAPUI={map:1,mode:'s',night:1,focus:'night'};twMapUiSync();state='g5map';snd(590,.04)}
 else if(i===2){TWUPGUI={sel:0,msg:'',msgT:0};state='g5upg';snd(590,.04)}
 else if(i===3){if(twMapCleared(3)){snd(660,.06);twNewRun(1,'e',1)}else{TWNOTE='LOCKED. HOLD ALL THREE GARDENS.';snd(160,.08)}}
 else if(i===4){TWHOW={page:0,from:'menu'};snd(590,.04)}
 else twOpenSet('menu')}
function twDrawHub(){const its=twHubItems(),rh=H>=260?24:H>=220?20:17,pw=W-24,px=12,ph=its.length*rh+40,py=Math.max(30,Math.round((H-ph)/2)-2);
 ctext('CLANKAWATCH',py-24<4?4:py-24,3,'#7fd4f8');
 r('#f8d030',px-1,py-1,pw+2,ph+2);r('#17122a',px,py,pw,ph);
 for(let i=0;i<its.length;i++){const it=its[i],y=py+5+i*rh,sel=TWMenuSel===i;
  if(sel){r('#2c2450',px+3,y-2,pw-6,rh-2);r('#f8d030',px+3,y-2,2,rh-2)}
  text(it.n,px+12,y+Math.round((rh-16)/2),2,it.lock?(sel?'#b8b0d8':'#8f86c8'):(sel?'#fff8e0':'#c8c0d8'));
  text(it.st,px+pw-8-tw(it.st,1),y+Math.round((rh-14)/2)+1,1,it.lock?'#a49cc0':'#f8d030')}
 const dy=py+ph-30;r('#2c2450',px+6,dy,pw-12,1);
 const d=TWNOTE||its[TWMenuSel].d;text(d,px+8,dy+5,1,TWNOTE?'#ff6a5e':'#e8e4f8');
 text('A: CHOOSE · B: FILES',px+8,dy+17,1,'#8f86c8')}
/* ---------- options ---------- */
function twOpenSet(from){TWSETUI={sel:0,from};state='g5set';snd(590,.04)}
function twSetRows(){const rows=[['MUSIC',TWSET.mus,0],['SOUND',TWSET.sfx,0],['SCREEN SHAKE',TWSET.shake?1:0,1]];
 if(TWSETUI&&TWSETUI.from==='menu'){rows.push(['CHANGE FILE','FILE '+(TWSLOT+1),2]);rows.push(['SWAP CARTRIDGE','',2])}return rows}
function twSetInput(){const u=TWSETUI;if(!u){state='g5menu';return}const n=twSetRows().length;
 if(pressed('up')){u.sel=(u.sel+n-1)%n;snd(520,.03)}
 if(pressed('down')){u.sel=(u.sel+1)%n;snd(520,.03)}
 let ch=false;const d=pressed('right')?1:pressed('left')?-1:0;
 if(d&&u.sel===0){TWSET.mus=Math.max(0,Math.min(10,TWSET.mus+d));ch=true}
 if(d&&u.sel===1){TWSET.sfx=Math.max(0,Math.min(10,TWSET.sfx+d));ch=true}
 if(d&&u.sel===2){TWSET.shake=!TWSET.shake;ch=true}
 if(pressed('a')){if(u.sel===2){TWSET.shake=!TWSET.shake;ch=true}
  else if(u.sel===3){TWSETUI=null;twFilesOpen();snd(590,.04);return}
  else if(u.sel===4){TWSETUI=null;snd(330,.06);eject();return}}
 if(ch){twApplySet();snd(660,.03)}
 if(pressed('b')||pressed('start')){const f=u.from;TWSETUI=null;snd(330,.05);state=f==='pause'?'g5play':'g5menu'}}
function twDrawSet(){const u=TWSETUI||{sel:0};twFrame('OPTIONS',u.sel<3?'◀ ▶ CHANGE · B: BACK':'A: GO · B: BACK');
 twSetRows().forEach((rw,i)=>{const y=40+i*26,sel=u.sel===i;
  if(sel){r('#2c2450',8,y-4,W-16,22);r('#f8d030',8,y-4,2,22)}
  text(rw[0],18,y,2,sel?'#fff8e0':'#c8c0d8');
  if(rw[2]===0){for(let pp=0;pp<10;pp++)r(pp<rw[1]?'#f8d030':'#3a3454',158+pp*7,y+2,5,9)}
  else if(rw[2]===1)text(rw[1]?'ON':'OFF',158,y,2,rw[1]?'#a8e078':'#ff6a5e');
  else if(rw[1])text(rw[1],W-14-tw(rw[1],1),y+2,1,'#f8d030')})}
/* ---------- lore: the valley, as the other Pocket Lantern games tell it ----------
   Every fact here is from another cartridge's own text (LORE.md lists the sources). `at` is how many
   nights must be held, on any garden, before the page opens. */
const TWLORE=[
 {t:'THE GREAT LANTERN',from:'SPROUTS',at:0,x:'Will keeps the Great Lantern. Once he walked the whole valley for four sun shards to light it again. Erin\'s Garden grows in its shadow, behind the wall.'},
 {t:'THE BIG RED BUTTON',from:'SPROUTWILD',at:0,x:'Under the Peak hummed the Data Center, the machine that keeps the valley running. It had a big red button. Do not press. Bottie pressed it. The Lantern cracked and went dark.'},
 {t:'SPROUTS',from:'SPROUTWILD',at:2,x:'When the Lantern cracked, its light fell as seeds, and the seeds grew legs. That is a sprout. Six kinds: EMBER, PEB, DEW, ZIP, LEAF and LUCKY. They carry the light. That is why a drone cannot hold one.'},
 {t:'THE IRON DOME',from:'SPROUTWILD',at:4,x:'When the light went out King Bibi raised the Iron Dome and shut the roads. Temporarily, he says. It has been temporary for years. It keeps people in. Drones come over the top.'},
 {t:'OLD THORNBACK',from:'SPROUTS',at:7,x:'Old Thornback has slept in his hollow since before Erin was born. This watch was once named for him. He slept through the whole swarm. Louie checks on him. Do not wake him.'},
 {t:"ERIN'S FARM STAND",from:'PATCH & PLATE',at:10,x:'What grows in the Long Beds goes to Erin\'s farm stand: plant it, cook it, serve it. The whole valley is hungry. That is why the Scraper went for the rows first.'},
 {t:'ROOTDEEP',from:'ROOTDEEP',at:13,x:'Under every garden the roots go down, past the grubs and the beetles, to the Hearth. The Drillers are trying to get there. Nothing of Bottie\'s has come back up.'},
 {t:'BESSIE',from:'SPROUTWILD',at:16,x:'There is something in Wending Lake. The valley calls her Bessie. On a still night you can hear her from the Crossroads. The drones go round the lake. All of them.'},
 {t:'THE LUCK BUG',from:'SPROUTWILD',at:19,x:'A ladybug is the valley\'s luck bug. LUCKY sprouts grow where one has landed. Marcus says he has a guy who can get you one. Derek. He pulls up. On time. Every time.'},
 {t:'NUMBA ONE CLANKA',from:'KNOCKOUT',at:26,x:'In the ring they call him LIL BOTTIE: clanker guns, chain stun. He has no context, only fists. He lost the gardens. He is still the numba one clanka. Ask him. He will tell you. At length.'}];
function twLoreOpen(){const c=twClearedCount();return TWLORE.filter(e=>c>=e.at).length}
function twDrawLore(i){const e=TWLORE[i],open=twClearedCount()>=e.at;
 ctext('LORE '+(i+1)+' OF '+TWLORE.length,34,1,'#8f86c8',null);
 if(!open){ctext('? ? ?',64,3,'#4a4270');ctext('Hold '+e.at+' nights to read this page.',92,1,'#c8c0d8',null);
  ctext('You have held '+twClearedCount()+'.',106,1,'#8f86c8',null);return}
 ctext(e.t,48,2,'#f8d030');
 const tag='FROM '+e.from,twd=tw(tag,1)+10;r('#2a5a6a',Math.round((W-twd)/2),65,twd,12);ctext(tag,67,1,'#e4f6ff',null);
 const ls=wrapPx(e.x,W-28,1);ls.forEach((l,k)=>text(l,14,86+k*12,1,'#e8e4f8'))}

/* ---------- gardens (was "NIGHTS"): one garden at a time, with its picture ---------- */
function twDrawMap(){const u=TWMAPUI||{map:1,mode:'s',night:1,focus:'night'};
 twFrame('GARDENS','A: PLAY · B: BACK',twStarPoints()+' STARS');
 const tall=H>=250,fy=k=>u.focus===k;
 let y=30;r(fy('map')?'#2c2450':'#1b1630',8,y,W-16,tall?92:34);if(fy('map'))r('#f8d030',8,y,2,tall?92:34);
 const nm=TWMAPS[u.map-1].name;ctext(nm,y+4,2,'#fff8e0');text('◀',14,y+4,2,fy('map')?'#f8d030':'#4a4270');text('▶',W-22,y+4,2,fy('map')?'#f8d030':'#4a4270');
 let st=0;for(let n=1;n<=TWMAPS[u.map-1].nights;n++)st+=TW.stars[u.map+'s'+n]||0;
 ctext(TWMAPS[u.map-1].sub+' · '+st+'/'+(TWMAPS[u.map-1].nights*3)+' STARS',y+19,1,'#c8c0d8',null);
 if(tall){const cv=twBoardCv(false,u.map),pw=132;
  r('#f8d030',Math.round((W-pw)/2)-1,y+33,pw+2,54);g.drawImage(cv,0,Math.round(cv.height*.02),cv.width,Math.round(cv.height*.84),Math.round((W-pw)/2),y+34,pw,52)}
 y+=tall?98:40;
 const md=TWMODES.find(m2=>m2[0]===u.mode);r(fy('mode')?'#2c2450':'#1b1630',8,y,W-16,30);if(fy('mode'))r('#f8d030',8,y,2,30);
 ctext(md[1],y+3,2,'#fff8e0');text('◀',14,y+3,2,fy('mode')?'#f8d030':'#4a4270');text('▶',W-22,y+3,2,fy('mode')?'#f8d030':'#4a4270');
 ctext(u.mode==='h'?'TOUGHER DRONES · DOUBLE DROPS':u.mode==='a'?'THE NIGHTS, REMIXED':'THE GARDEN AS PLANTED',y+18,1,'#c8c0d8',null);
 y+=36;
 const N=TWMAPS[u.map-1].nights,fr=twFrontierIn(u.map,u.mode),pw2=21,gap=2,tot=N*pw2+(N-1)*gap,sx=Math.round((W-tot)/2);
 r(fy('night')?'#2c2450':'#1b1630',8,y,W-16,44);if(fy('night'))r('#f8d030',8,y,2,44);
 text('NIGHT '+u.night+(u.night===N?' · BOSS':''),14,y+3,1,'#f8d030');
 for(let n=1;n<=N;n++){const px=sx+(n-1)*(pw2+gap),un=n<=fr,s3=TW.stars[u.map+u.mode+n]||0,cur=n===u.night;
  r(cur?'#f8d030':'#3a3454',px,y+15,pw2,24);r(cur?'#3a2f66':'#171226',px+1,y+16,pw2-2,22);
  text(String(n),px+(n<10?8:5),y+17,1,un?'#fff8e0':'#6a628a');
  if(un)for(let s2=0;s2<3;s2++)r(s2<s3?'#f8d030':'#4a4270',px+3+s2*6,y+30,4,4);
  else text('×',px+8,y+27,1,'#6a628a')}
 if(TWNOTE)ctext(TWNOTE,Math.min(y+50,H-32),1,'#ff6a5e',null)}
function twDrawUpg(){const u=TWUPGUI||{sel:0,msg:''};twFrame('THE LANTERN','A: BUY · B: BACK',TW.drops+' DROPS');
 text('Stars pay Sun Drops. Spend them here.',8,29,1,'#b8b0d8');
 for(let i=0;i<8;i++){const pk=TWPERKS[i],cx=6+(i%2)*116,cy=42+((i/2)|0)*34,own=TW.perks.indexOf(pk.id)>=0,sel=u.sel===i;
  r(sel?'#f8d030':'#2c2450',cx,cy,112,31);r(sel?'#2c2450':'#1b1630',cx+1,cy+1,110,29);
  text(pk.n,cx+5,cy+3,1,own?'#a8e078':'#fff8e0');text(pk.fx,cx+5,cy+12,1,'#c8c0d8');
  text(own?'YOURS':pk.cost+' DROPS',cx+5,cy+21,1,own?'#a8e078':(TW.drops>=pk.cost?'#f8d030':'#ff9a8a'))}
 if(u.msg)ctext(u.msg,H-32,1,'#ffd94d',null)}
/* widths of everything the menus print, for tests/menus.js */
function twMenuAudit(){const bad=[],chk=(s,sc,max,w)=>{if(tw(s,sc)>max)bad.push(w+': '+tw(s,sc)+'>'+max+': '+s)};
 for(const it of twHubItems()){chk(it.d,1,W-40,'hub desc');if(tw(it.n,2)+tw(it.st,1)>W-24-28)bad.push('hub row: '+it.n+' / '+it.st)}
 for(const e of TWLORE){chk(e.t,2,W-8,'lore title');if(wrapPx(e.x,W-28,1).length>9)bad.push('lore too long: '+e.t)}
 for(const pk of TWPERKS){chk(pk.n,1,104,'perk');chk(pk.fx,1,104,'perk fx')}
 for(const m of TWMAPS){chk(m.name,2,W-56,'garden');chk(m.sub+' · 30/30 STARS',1,W-20,'garden sub')}
 return bad}
