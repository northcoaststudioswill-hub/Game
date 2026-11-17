/* ================================================================
   THE LOOP, MADE TO MAKE SENSE (Fable, v5.5)
   Why sprouts can take buddies: sprouts are Lantern light with legs.
   Since the Lantern cracked the wild buddies have gone DIM. Sprouts
   that latch on to a tired buddy BLOOM on it: they carry the light
   back, it remembers, it joins you. Nothing is thrown like a ball
   and no sprout is used up.
   Who gathers what:
     sprouts  carry wood, stone, berries and treasure home (and every
              four deliveries the Lantern grows a new sprout)
     buddies  fetch what sprouts cannot: ORE veins, FIBER thickets,
              and wilds you beat drop the same
     at home  both work the stations; the bench turns ore/fiber into
              gear (SEED POUCH = a bigger squad)
   The opening is played, not read: wake at the dark Lantern, pluck
   three glowing seeds, throw them at berries, they feed the Lantern,
   it stirs, dim buddies creep to the light, you greet one, and the
   south road opens. Louie is a dog again: he runs ahead to whatever
   is next, you pet him, he says one thing. The Lantern is the hub
   (plans, level, travel). You leave Sunkeep on foot by the south road.
   ================================================================ */
if(SW.res.fiber==null)SW.res.fiber=0;if(SW.res.ore==null)SW.res.ore=0;if(!SW.pouch)SW.pouch=8;
if(SW.quest>=2||SW.tendDone)SW.lit=1;
WCHOICE[0].x=166;WCHOICE[0].y=232;WCHOICE[1].x=240;WCHOICE[1].y=212;WCHOICE[2].x=310;WCHOICE[2].y=236; /* v9.2: well apart, below the road, clear of the Lantern steps */
const WSEEDPOS={0:[206,126],2:[240,134],4:[274,126]};
const wLit=()=>!!SW.lit||SW.quest>=2;
const wOp=()=>SW.quest>=2?3:SW.lit?2:(SW.seeds&&SW.seeds.length)?0:1;
function wQuestText(){const op=wOp();
 if(op===0)return opGoal0();
 if(op===1)return'A: throw sprouts at the berries';
 if(op===2)return'Greet one of the dim buddies';
 if(SW.quest===2)return W4.fld?'A: throw sprouts at a wild buddy':'Take the south road to the Meadow';
 return WQUEST[SW.quest]}
function wNextGoal(){const op=wOp(),F=W4.bf;
 if(op===0){const p=WSEEDPOS[SW.seeds[0]];return{x:p[0]-14,y:p[1]+4,label:'Woof! It glows. Pluck it!'}}
 if(op===1){const it=F&&F.items.find(i=>i.op);return it?{x:it.x-14,y:it.y+8,label:'Berries! Face them. Press A.'}:{x:226,y:108,label:'Good sprouts.'}}
 if(op===2)return{x:206,y:204,label:'Dim, not mean. Say hello.'};
 if(SW.quest===2)return{x:228,y:(W4.wh||520)-40,label:'This way! The south road.'};
 if(!SW.buildings.some(b=>b.k==='cottage'))return{x:150,y:230,label:'Good spot for a cottage. START, BUILD.'};
 if(!plCrops()&&!SW.buildings.some(b=>b.k==='bed'))return{x:226,y:340,label:'Empty plot! Press A on it. Grow berries.'};
 if(wBaseReady())return{x:226,y:104,label:'The Lantern is ready to grow!'};
 return null}
function wLouieTip(){const tips=[
 'Four things carried home and the Lantern grows a new sprout. That is how you get more of us. Them. Woof.',
 'Sprouts carry wood, stone and berries. ORE and FIBER need a buddy: find a vein or a thicket and press A.',
 'Buddies you leave at home go to work. Check the Lantern board to see who is good at what.',
 'A SEED POUCH from the bench lets more sprouts walk with you. It wants FIBER.',
 'Kin sprouts bloom best: LEAF sprouts on LEAF buddies. Tire the buddy out first.',
 'Hold B and they all come running. I taught them that. Mostly.',
 'The Lantern can send you to any Lantern post you have lit. The south road is nicer, though.',
 'A sleeping ALPHA guards the good stuff. Wake it only if your buddy is ready.',
 'King Bibi says the dome is temporary. I am a dog and even I do not believe him.'];
 SW.talkN.LOUIE=(SW.talkN.LOUIE||0)+1;return tips[(SW.talkN.LOUIE-1)%tips.length]}
function wLouTalk(){if(!(W4.petCd>0)){W4.petCd=18;if(Math.random()<.5){SW.hearts++;SW.heartsTotal++;W4.floats.push({x:lou.x,y:lou.y-16,txt:'+1 ♥',t:1.2,c:'#f078c0'})}}
 swSnd(988,.06,1318);const g2=wNextGoal();wQuip('LOUIE',g2?g2.label:wLouieTip(),true);swSave()}
/* Louie runs ahead to whatever is next and waits for you; with nothing to show he just keeps you company */
function wLouTick(dt){if(W4.petCd>0)W4.petCd-=dt;const g2=wNextGoal();let tx=lou.x,ty=lou.y;const dp=Math.hypot(P3.x-lou.x,P3.y-lou.y);
 if(g2){const dg=Math.hypot(g2.x-lou.x,g2.y-lou.y);W4.louLead=dg>8?1:2;if(dg>8&&dp<96){tx=g2.x;ty=g2.y}else if(dp>150){tx=P3.x;ty=P3.y}}
 else{W4.louLead=0;if(dp>30){tx=P3.x-12;ty=P3.y+6}}
 const dx=tx-lou.x,dy=ty-lou.y,d=Math.hypot(dx,dy);W4.louMv=d>2;if(d>2){const v=Math.min(d*6,g2?92:70);lou.x+=dx/d*v*dt;lou.y+=dy/d*v*dt}}
function wPluckSeed(b){const F=W4.bf,tn=TYPES[b.type].n;F.buds.splice(F.buds.indexOf(b),1);SW.seeds=SW.seeds.filter(t=>t!==b.type);SW.buds[tn]=(SW.buds[tn]||0)+1;
 W4.floats.push({x:b.x,y:b.y-16,txt:'A '+tn+' SPROUT!',t:1.6,c:TYPES[b.type].l});swSnd(880,.07,1320);
 if(!SW.seeds.length)SW.quest=Math.max(SW.quest,1);
 swSave()}
function wLanternWake(){SW.lit=1;Object.assign(SW.lessons,{seed:1,folbase:1,folhaul:1,fol:1,cmd:1}); /* the old one-line lessons are covered by Erin and Marcus now */
 SW.tendDone=true;SW.tendStage=4;SW.plucked=2;SW.trioPlucked=[];SW.quest=Math.max(SW.quest,1);scWake();
 swSave()}
/* every delivery feeds the Lantern: four make a sprout. The opening's berries wake it. */
function wOnDeliver(F,it){SW.light=(SW.light||0)+(it.k==='tre'?3:1);
 if(SW.light>=4&&wBudTotal()<40&&wLit()){SW.light-=4;const c=it.car&&it.car[0],ty=c?c.type:(Math.random()*5)|0,tn=TYPES[ty].n;SW.buds[tn]=(SW.buds[tn]||0)+1;
  if(F.base)scSeed(ty);W4.floats.push({x:F.start.x,y:F.start.y-44,txt:'THE LANTERN GROWS A '+tn+' SPROUT!',t:2.4,c:TYPES[ty].l});swSnd(988,.1,1480)}
 if(F.base&&it.op){SW.fedN=(SW.fedN||0)+1;if(SW.fedN>=2&&!SW.lit)wLanternWake()}}
function wBefriend(sp){SW.party=[wMakeMon(sp,5)];SW.seen[sp]=1;SW.caught[sp]=1;SW.quest=2;swSave();
 wCineMon(sp,'Your sprouts bloomed on it. It remembers the light.')}
function wBaseArrive(from){const F=W4.bf;P3.x=240;P3.ax=0;P3.ay=-1;P3.y=from==='MEADOW'?(W4.wh||520)-38:SW.lit?152:170;
 lou.x=P3.x-24;lou.y=P3.y+8;W4.part={x:P3.x+16,y:P3.y+6};for(const s of F.sq){s.x=P3.x+(Math.random()*24-12);s.y=P3.y+10+Math.random()*10}
 if(SW.quest<2&&!SW.lit){if(!SW.seeds)SW.seeds=[0,2,4];
  F.buds=SW.seeds.map(ty=>({type:ty,x:WSEEDPOS[ty][0],y:WSEEDPOS[ty][1],glow:1}));
  for(let i=(SW.fedN||0);i<3;i++)F.items.push({k:'pel',res:'berry',n:1,w:1,x:196+i*16,y:208+(i%2)*6,car:[],op:1})}
 if(SW.quest<2){W4.banner=null;SW.visited.BASE=1}
 wCastInit();W4.talk=null;
 W4.baseArrive=from?{x:P3.x,y:P3.y}:null;
 W4.cam=null;wCamUpdate(P3.x,P3.y)}
function wNearExtra(px,py){const F=W4.bf;if(!F)return null;for(const b of F.buds)if(Math.hypot(px-b.x,py-b.y)<18)return{k:'fbud',b,txt:'PLUCK'};return null}
/* leaving Sunkeep on foot */
function wBaseEdge(){const A=W4.baseArrive;if(A&&(!(keys.up||keys.down||keys.left||keys.right)||Math.hypot(P3.x-A.x,P3.y-A.y)>48))W4.baseArrive=null;
 if(!W4.baseArrive&&P3.y>(W4.wh||520)-17&&Math.abs(P3.x-240)<34){
  if(SW.quest<2){P3.y-=10;swSay(SW.lit?'Greet a buddy first. The wilds are no place to walk alone.':'It is dark out there. Wake the Lantern first.',2.8);swSnd(140,.08)}
  else fTravel('MEADOW','BASE')}}
function wLampRows(){const rows=[];
 if(wBaseReady())rows.push({act:'ring',label:'GROW THE LANTERN'});
 rows.push({act:'travel',label:'TRAVEL BY LANTERN LIGHT'},{act:'board',label:'WORK BOARD'});
 if(!SW.unlocked.sawmill)rows.push({act:'sawmill',label:'SAWMILL PLANS',price:15});
 if(!SW.unlocked.statue)rows.push({act:'statue',label:'STATUE PLANS',price:25});
 rows.push({act:'leave',label:'LEAVE'});return rows}
function lampDraw(){const rows=wLampRows();swShell('THE GREAT LANTERN','♥ '+SW.hearts+' · light '+(SW.light||0)+'/4');
 swRows(rows.map(rw=>({a:rw.label,b:rw.price?'♥ '+rw.price:rw.act==='travel'?'any lit post':''})),swSel,
  wBaseReady()?'The missions are done. Let it grow!':'Everything carried home feeds it. Four deliveries grow a sprout. Hearts buy plans.')}
function wTrailhead(){const x=268,y=(W4.wh||520)-30,K='#14101e';r('rgba(0,0,0,.25)',x-3,y+1,10,3);r(K,x,y-18,4,20);r('#8a6238',x+1,y-17,2,18);r(K,x-12,y-22,28,11);r('#b0834e',x-11,y-21,26,9);r('#d0a468',x-11,y-21,26,2);
 text('SOUTH',x-9,y-20,1,K,null);r(K,x-2,y-9,8,5);r('#b0834e',x-1,y-8,6,3);r(K,x+1,y-4,2,3)}
/* ---------------- the Great Lantern: an old tree cradling a cracked lantern ---------------- */
function wShrine(){const lx=240,K='#14101e',lit=wLit(),fl=.5+.5*Math.sin(time*2.2),dk=wDark(),B=FBIO.MEADOW;
 r('#1c4426',0,-50,WW,52);for(let x=4;x<WW;x+=22)if(Math.abs(x-lx)>58)fTree(B,x+((x*7)%9),2+((x*5)%7),x);
 /* the trunk */
 r(K,lx-43,-34,86,118);r('#5a3d22',lx-42,-34,84,116);r('#7a5630',lx-42,-34,20,116);r('#8a6238',lx-40,-34,6,116);r('#3c2816',lx+22,-34,20,116);
 for(let i=0;i<7;i++){r('#3c2816',lx-30+i*9,-30+((i*17)%30),1,22+((i*7)%20));r('#7a5630',lx-26+i*9,-10+((i*13)%40),1,14)}
 /* roots */
 for(const [rx,ry,rw,rh] of [[-66,70,30,14],[-52,62,22,12],[36,70,30,14],[30,62,22,12]]){r(K,lx+rx-1,ry-1,rw+2,rh+2);r('#5a3d22',lx+rx,ry,rw,rh);r('#7a5630',lx+rx,ry,rw,3)}
 /* crown */
 for(const [cx,cy,w,h] of [[-86,-50,172,30],[-98,-30,70,30],[28,-30,70,30],[-60,-58,120,14]]){r(K,lx+cx-1,cy-1,w+2,h+2);r(B.t1,lx+cx,cy,w,h);r(B.t2,lx+cx,cy,w-10,h-9);r(B.t3,lx+cx+8,cy+3,Math.round(w/3),3);r(B.t3,lx+cx+Math.round(w/2),cy+9,Math.round(w/5),2)}
 /* the hollow and the lantern in it */
 r(K,lx-25,2,50,76);r('#150e08',lx-24,3,48,74);r('#24180e',lx-24,3,48,6);
 if(lit){uiRays(lx,36,70+Math.round(fl*8),10,'#ffd94d',.10+dk*.06);g.globalAlpha=.16+.08*fl+dk*.12;r('#ffd94d',lx-36,-4,72,86);g.globalAlpha=.24+.1*fl;r('#ffd94d',lx-22,8,44,62);g.globalAlpha=1}
 r(K,lx-1,3,2,9);r('#8a909c',lx-1,3,1,9);
 r(K,lx-15,10,30,50);r('#7a2e22',lx-16,10,32,6);r('#a84a36',lx-16,10,32,2);r('#3c2a16',lx-14,16,28,42);
 if(lit){r('#ffd94d',lx-11,19,22,36);r('#fff3b0',lx-8,23,16,28);r('#ffffff',lx-4,28,8,16)}
 else{r('#2a2438',lx-11,19,22,36);r('#3a3350',lx-11,19,22,4);r('#4a4468',lx-9,21,4,2)}
 r(K,lx-2,19,2,12);r(K,lx-1,30,7,2);r(K,lx+5,31,2,13);r(K,lx-7,43,13,2);r(K,lx-8,44,2,11); /* the crack never quite heals */
 r('#3c2a16',lx-14,36,28,2);r('#7a2e22',lx-16,56,32,5);r('#5a241c',lx-16,59,32,2);
 /* dais */
 r('rgba(0,0,0,.28)',lx-38,90,76,5);r(K,lx-36,78,72,13);r('#8a7f6a',lx-35,79,70,11);r('#b8b09c',lx-35,79,70,2);r('#6e6350',lx-35,87,70,3);for(let i=0;i<5;i++)r('#6e6350',lx-22+i*14,81,1,6);
 for(const [bx,c] of [[lx-40,'#2e8f86'],[lx+33,'#c0602a']]){const wv=Math.round(Math.sin(time*2+bx)*1);r(K,bx-1,18,9,26);r(c,bx,19,7,23+wv);r(artShade(c,.3),bx,19,2,23+wv);r('#ffd94d',bx+2,25,3,5)}
 {const lab=lit?'LV'+SW.baseLv:'DARK',lw=tw(lab,1)+6;r(K,lx-lw/2,91,lw,10);r(lit?'#ffd23f':'#5a5670',lx-lw/2+1,92,lw-2,8);text(lab,Math.round(lx-lw/2+3),93,1,K,null)}
 if(W4.wake>0){W4.wake-=1/60;const k=Math.min(1,W4.wake/3);uiRays(lx,36,260,14,'#fff3b0',.25*k);g.globalAlpha=.5*k*k;r('#ffffff',lx-260,-60,520,640);g.globalAlpha=1}
 /* the camp fire the workers rest around */
 {const cx=312,cy=178,f=((time*9)|0)%3;r('rgba(0,0,0,.25)',cx-10,cy+1,20,4);for(const [sx,sy] of [[-9,0],[-6,3],[0,4],[6,3],[9,0],[-6,-3],[6,-3]]){r(K,cx+sx-2,cy+sy-2,5,5);r('#8a92a4',cx+sx-1,cy+sy-1,3,3)}
  r('#5a3d22',cx-6,cy-1,12,3);r('#3c2a16',cx-4,cy-3,8,2);
  if(lit){r('#e2541e',cx-4,cy-9-f,8,8+f);r('#ffb040',cx-3,cy-7-f,6,6+f);r('#fff3b0',cx-1,cy-4,3,3);g.globalAlpha=.10+dk*.22+.03*f;r('#ffb040',cx-34,cy-26,68,48);r('#ffb040',cx-22,cy-34,44,62);g.globalAlpha=1}}
 wTrailhead()}
/* ---------------- buddies fetch what sprouts cannot ---------------- */
const FSPOTS={MEADOW:[[26,4,'ore'],[8,23,'fiber'],[32,23,'fiber']],WASTES:[[6,4,'ore'],[14,19,'ore'],[29,12,'fiber']],SHORE:[[5,8,'fiber'],[22,17,'fiber'],[28,13,'ore']],GLOOM:[[28,10,'ore'],[3,16,'fiber']],PEAK:[[10,6,'ore'],[28,16,'ore'],[5,12,'fiber']]};
function fSpotsBuild(F){F.spots=[];for(const [tx,ty,k] of FSPOTS[F.id]||[])if('.,'.includes(fTile(F,tx,ty)))F.spots.push({k,x:tx*FT+8,y:ty*FT+10,got:false,shake:0})}
function fSpotDraw(sp){const x=Math.round(sp.x+(sp.shake>0?Math.sin(time*60)*1.5:0)),y=Math.round(sp.y),K='#14101e';if(sp.shake>0)sp.shake-=1/60;
 r('rgba(0,0,0,.24)',x-10,y+2,22,4);
 if(sp.k==='ore'){r(K,x-11,y-10,22,15);r('#5c6675',x-10,y-9,20,13);r('#8a92a4',x-10,y-9,13,6);r('#c3ccd9',x-8,y-8,6,2);for(const [ox2,oy2] of [[-6,-3],[2,-6],[5,0],[-2,1]]){r(K,x+ox2-1,y+oy2-1,5,5);r('#f0a030',x+ox2,y+oy2,3,3);r('#fff3b0',x+ox2,y+oy2,1,1)}}
 else{r(K,x-10,y-14,20,19);r('#2c6e36',x-9,y-13,18,17);for(let i=0;i<5;i++){r('#86d86c',x-8+i*4,y-12+((i*5)%6),2,12);r('#d8f0a0',x-8+i*4,y-12+((i*5)%6),1,3)}r('#c8b070',x-6,y-2,12,2);r('#e8d8a0',x-6,y-2,12,1)}
 if(!sp.got&&((time*2)|0)%2){r('#fff3b0',x+9,y-15,1,3);r('#fff3b0',x+8,y-14,3,1)}}
function fFetch(F,sp){const lead=SW.party.find(m=>m.hp>0);if(!lead){swSay('That is a job for a buddy, and yours needs rest.',2.4);return}
 W4.fetch={sp,ph:0,t:0};swSnd(520,.07,880);if(!SW.lessons.fetch){SW.lessons.fetch=1;swSay('Buddies fetch what sprouts cannot: ORE and FIBER. The bench turns them into gear.',4)}}
/* Louie in the field: keeps up, and herds stray sprouts back like he does in the garden */
function fLouTick(F,dt){const stray=F.sq.find(s=>s.st==='idle'&&s.t>2.5&&Math.hypot(s.x-P3.x,s.y-P3.y)>44);let tx=P3.x-F.dir[0]*22+F.dir[1]*14,ty=P3.y+6-F.dir[1]*22;
 if(stray){tx=stray.x;ty=stray.y;if(Math.hypot(tx-lou.x,ty-lou.y)<10){stray.st='ret';W4.floats.push({x:lou.x,y:lou.y-12,txt:'WOOF!',t:.8,c:'#ffe8b0'});swSnd(700,.05,500)}}
 const dx=tx-lou.x,dy=ty-lou.y,d=Math.hypot(dx,dy);W4.louMv=d>5;if(d>5){const v=Math.min(d*5,stray?130:100);lou.x+=dx/d*v*dt;lou.y+=dy/d*v*dt}if(d>260){lou.x=P3.x;lou.y=P3.y+8}}
function fLouDraw(){const x=Math.round(lou.x),y=Math.round(lou.y),f=W4.louMv?((time*8)|0)%2:((time*2)|0)%2;r('rgba(0,0,0,.22)',x-9,y+4,18,3);g.drawImage(f?LOU.l[0]:LOU.l[1],x-12,y-6,24,12)}
/* ---------------- gear ---------------- */
WRECIPES.splice(1,0,{id:'pouch',n:'SEED POUCH',cost:{fiber:4,wood:4},need:18,d:'+4 sprouts can walk with you (to 24). FIBER comes from thickets and beaten wilds: buddy work.'});
/* ================================================================
   v5.7 — after the first catch (found by playing on)
   ================================================================ */
if(!SW.gear)SW.gear={};
/* v8.0: the mission names are set in sw-module.js; the old worker missions are gone */
function wWorkerCount(){return SW.crew.filter(c=>c.job!==-1).length+SW.party.slice(1).length+SW.box.length}
function wMissionDone(key){const [k,v]=key.split(':');
 if(k==='build')return SW.buildings.some(b=>b.k===v);
 if(k==='crop')return plCrops()>=+v||SW.buildings.some(b=>b.k==='bed'); /* v8.7: these two were missing here, so Sunkeep Lv1 could never finish */
 if(k==='buddies')return SW.party.length+(SW.box||[]).length>=+v;
 if(k==='workers')return wWorkerCount()>=+v;
 if(k==='species')return Object.keys(SW.caught).length>=+v;
 if(k==='sigils')return SW.badges.length>=+v;
 if(k==='hearts')return SW.heartsTotal>=+v;return false}
/* past the opening the strip shows the next thing the base needs, so there is always a direction */
function wQuestText(){const op=wOp();
 if(op===0)return opGoal0();
 if(op===1)return'A: throw sprouts at the berries';
 if(op===2)return'Greet one of the dim buddies';
 if(SW.quest===2)return W4.fld?'A: throw sprouts at a wild buddy':'Take the south road to the Meadow';
 if(!W4.fld&&wHasRoof()&&wDark()>.7)return'Night: sleep in the cottage to skip it';
 if(SW.quest===4&&!W4.fld&&W4.patchBuds&&!W4.patchBuds.some(q=>q.type<0&&!q.crop))return'Garden full: pluck a sprout, then grow BERRIES'; /* v8.9 */
 if(SW.quest<5)return(W4.fld&&SW.quest>=3?'At Sunkeep: ':'')+WQUEST[SW.quest];
 if(W4.fld){const ld=SW.party.find(m=>m.hp>0),sec=wSector(W4.sector);
  if(!ld||ld.hp<wStats(ld).max*.25)return'Your buddy is hurt: rest at a Lantern post';
  if(sec.gym>=0&&!SW.gymDone[sec.gym])return'The '+WGYMS[sec.gym].leader+' gym is here: win the '+WGYMS[sec.gym].sig;
  if(SW.quest>=5&&(W4.fld.alphas||[]).some(a=>Math.hypot(a.x-P3.x,a.y-P3.y)<130))return'ALPHA nearby: it guards treasure'}
 if(W4.fld){const gg=wGymGoal();if(gg)return gg} /* v8.7: in the field the next big goal is the gym */
 const ms=WBASEMS[SW.baseLv];if(!ms)return SW.badges.length<4?'Earn the Sigils. Free the roads.':'';
 const nx=ms.find(([k2])=>!wMissionDone(k2));return nx?(W4.fld?'Home: ':'Sunkeep Lv'+SW.baseLv+': ')+wMissionHint(nx):(W4.fld?'At Sunkeep: ask':'Ask')+' the Great Lantern to grow'}
function wLampRows(){const rows=[];
 if(wBaseReady())rows.push({act:'ring',label:'GROW THE LANTERN'});
 rows.push({act:'rest',label:'REST IN THE LIGHT'},{act:'travel',label:'TRAVEL BY LANTERN LIGHT'},{act:'board',label:'WORK BOARD'});
 if(!SW.unlocked.sawmill)rows.push({act:'sawmill',label:'SAWMILL PLANS',price:15});
 if(!SW.unlocked.statue)rows.push({act:'statue',label:'STATUE PLANS',price:25});
 rows.push({act:'leave',label:'LEAVE'});return rows}
function lampDraw(){const rows=wLampRows();swShell('THE GREAT LANTERN','♥ '+SW.hearts+' · light '+(SW.light||0)+'/4');
 swRows(rows.map(rw=>({a:rw.label,b:rw.price?'♥ '+rw.price:rw.act==='travel'?'posts you have lit':rw.act==='rest'?'heals everyone':''})),swSel,
  wBaseReady()?'The missions are done. Let it grow!':'Everything carried home feeds it. Four deliveries grow a sprout. Hearts buy plans.')}
/* the cottage: a bed and a tonic shelf (sprouts are grown by the Lantern, never bought) */
function cotUpdate(){const rows=['SLEEP','BUY TONIC','LEAVE'];swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='SLEEP'){for(const m of SW.party.concat(SW.box))m.hp=wStats(m).max;SW.stam=100;const night=(W4.dayT||0)>150;if(night){W4.dayT=0;SW.day=(SW.day||1)+1}W4.sleepFx=1.6;swSay(night?'You slept until morning. Day '+SW.day+'. Everyone is rested and back at work.':'A quick nap. Everyone is rested.',2.6);swSnd(523,.3,262);swSave();state='g4world'}
  else if(r2==='LEAVE')state='g4world';
  else if(SW.res.petal>=25){SW.res.petal-=25;SW.tonics++;swSay('Bought a Tonic. Tonics: '+SW.tonics,1.4);swSave()}else{swSnd(140,.08);swSay('Needs 25 petals. The bench can make them from berries.',2)}}}
function drawCot(){swShell('COTTAGE','✿ '+SW.res.petal);
 swRows([{a:'SLEEP',b:(W4.dayT||0)>150?'until morning':'a quick nap'},{a:'BUY TONIC',b:'25 petals'},{a:'LEAVE',b:''}],swSel,'Home buddies living here: '+Math.max(0,SW.party.length-1+SW.box.length)+'. Sleeping skips the night, when nobody works. Tonics x'+SW.tonics+'.')}
/* the nook (was "nursery"): dim buddies follow berries and light in; nothing is grown from a sprout */
{const nd=wBuildDef('nursery');nd.n='LANTERN NOOK';nd.d='Leave berries in the light and a dim buddy of the kind you choose follows them in. Tenders bring it sooner.'}
function drawNur(){const b=SW.buildings[W4.nurB];if(!b)return;swShell('LANTERN NOOK','BERRY '+SW.res.berry+' · INGOT '+SW.res.ingot);
 const lab=r2=>r2.replace('PLANT','LURE').replace('GROWING','COMING').replace('HARVEST','WELCOME IT IN').replace('CLEAR BED','PUT THE BERRIES AWAY').replace('WORKERS','TENDERS').replace(/stage (\d)\/3/,'$1/3 of the way');
 swRows(wNurRows(b).map(r2=>({a:lab(r2),b:r2.startsWith('PLANT')?'a dim buddy':r2==='HARVEST'?(b.crop&&b.crop.stage>=3?'it is at the door':'not here yet'):''})),swSel,
  'Dim buddies follow berries and light. It takes about a minute; a tender (WATER or PLANT) halves it.')}
/* the keeper's guide, rewritten for how the game works now */
WGUIDE.length=0;WGUIDE.push(
 ['SPROUTS','Sprouts are Lantern light with','legs. They walk with you.','A throws one at whatever the','ring has locked on to. The','right kind steps up by itself.','Hold B to call them back.','They pick, carry and build.'],
 ['TREES AND ROCKS','Sprouts do not chop. A buddy','with LUMBER (leaf kinds) fells','trees; one with MINE (rock','kinds) cracks rock. Press A','next to one. You can do it by','hand, slowly. Sprouts carry','what falls.'],
 ['THE LANTERN','Everything carried to a Lantern','feeds it: wood, stone, berries,','treasure. Four deliveries and','it grows a new sprout. The','Great Lantern at home also','heals you, sells plans and','sends you to posts you lit.'],
 ['BUDDIES','Wild buddies went dim when','the Lantern cracked. Walk up','and press A to battle, or','throw a sprout at one. Tire','it out, then SWARM: kin','sprouts bloom best. No sprout','is ever used up.'],
 ['ORE AND FIBER','Sprouts cannot get these.','Find a vein or a thicket and','press A: your lead buddy','fetches it. Beaten wilds drop','them too. The bench turns','them into a SEED POUCH, a','CLIMBING ROPE, better tools.'],
 ['SUNKEEP AT WORK','Buddies you leave at home','work the buildings by skill:','KINDLE, WATER, PLANT, MINE,','LUMBER, CRAFT, HAUL, LUCK.','What they make must be','carried to the Lantern. The','work board shows who is who.'],
 ['GATES AND GEAR','Boulders want PEB sprouts,','fire EMBER, vines LEAF, sparks','ZIP, dry blooms DEW. Ledges','hop down only, until you own','a CLIMBING ROPE. Heavy loot','needs more sprouts: PEB','counts double.'],
 ['THE VALLEY','Bottie nuked the Data Center','and the Lantern cracked. KING','BIBI raised his IRON DOME and','shut the roads. Four gyms','hold four Sigils: win them,','restore order, and the King','opens the way to the Peak.']);
/* gear: ore finally matters */
WRECIPES.splice(2,0,{id:'rope',n:'CLIMBING ROPE',cost:{fiber:6,ore:2},need:20,d:'Climb ledges from below. Opens shortcuts and high ground in every sector.'});
{const kd=wBuildDef('kiln');kd.d='Smelts ORE into ingots. Needs a KINDLE worker, and ore: buddies fetch it from veins.'}
/* ================================================================
   v6.0 — who does what, from Will's notes
   Sprouts pick berries and carry. Trees and rocks are felled by a
   buddy with the skill (LUMBER for trees: leaf kinds; MINE for
   rocks: rock kinds), or by you, slowly, by hand. What a buddy
   fells drops as a log or stone for the sprouts to carry home.
   ================================================================ */
function wLeadSkill(kind){const lead=SW.party.find(m=>m.hp>0);if(!lead)return 0;const sk=wkSkills({kind:'b',ref:lead});return(kind==='tree'?sk.LUMBERING:sk.QUARRY)||0}
function wNodeLabel(nd){const lead=SW.party.find(m=>m.hp>0),v=nd.k==='tree'?'CHOP':'MINE';return wLeadSkill(nd.k)?'SEND '+lead.sp+' TO '+v:v+' BY HAND'}
function wNodeDrop(nd){nd.got=true;const F=W4.fld||W4.bf,y2=WNODEY[nd.k];if(!F)return;F.items.push({k:'pel',res:y2[0],n:y2[1]+1,w:nd.k==='tree'?2:3,x:nd.x,y:nd.y,car:[]});if(F.base)fFlow(F);
 W4.floats.push({x:nd.x,y:nd.y-18,txt:nd.k==='tree'?'TIMBER! Sprouts can carry it.':'CRACKED! Sprouts can carry it.',t:1.8,c:'#ffd94d'});swSnd(220,.1,120)}
function wNodeAct(nd){const lv=wLeadSkill(nd.k);
 if(lv){if(W4.fld)W4.fetch={nd,ph:0,t:0,lv};else W4.cmdT={nd};swSnd(520,.07,880);return}
 wSwing(nd);if(!SW.lessons['hand'+nd.k]){SW.lessons['hand'+nd.k]=1;swSay(nd.k==='tree'?'By hand it is slow. A buddy with LUMBER (leaf kinds) fells a tree in moments.':'By hand it is slow. A buddy with MINE (rock kinds) cracks rock in moments.',4)}}
function fFetchTick(F,dt,lead){const fe=W4.fetch;if(!fe)return false;const pt=W4.part=W4.part||{x:P3.x,y:P3.y},sp=fe.sp||fe.nd;
 const go=(x,y,arr)=>{const dx=x-pt.x,dy=y-pt.y,d=Math.hypot(dx,dy);if(d<arr)return true;pt.x+=dx/d*120*dt;pt.y+=dy/d*120*dt;pt.mv=true;pt.fx=dx<0?-1:1;return false};
 if(fe.ph===0){if(go(sp.x,sp.y+9,8))fe.ph=1}
 else if(fe.ph===1){fe.t+=dt;pt.mv=((time*8)|0)%2===0;sp.shake=.1;if(((fe.t*4)|0)!==(((fe.t-dt)*4)|0)){fSpark(sp.x+(Math.random()*14-7),sp.y-8-Math.random()*8,'#fff3b0');swSnd(fe.nd?(sp.k==='rock'?180:260):(sp.k==='ore'?180:300),.03,120)}
  if(fe.nd){sp.hp-=(5+fe.lv*4)*dt;if(sp.hp<=0||sp.got){if(!sp.got)wNodeDrop(sp);fe.ph=2}}
  else if(fe.t>=2.2){sp.got=true;fe.ph=2}}
 else if(go(P3.x,P3.y+6,16)){if(!fe.nd){const wk=wSp(lead.sp).work||{},good=sp.k==='ore'?(wk.QUARRY||wk.KINDLING):(wk.PLANTING||wk.WATERING),n=2+(good?1:0);
   SW.res[sp.k]=(SW.res[sp.k]||0)+n;W4.floats.push({x:P3.x,y:P3.y-22,txt:'+'+n+' '+sp.k.toUpperCase()+' — '+lead.sp+' fetched it!'+(good?' (good at this)':''),t:2.2,c:'#ffd94d'});swSnd(784,.08,1175);swSave()}
  W4.fetch=null}
 return true}
/* mission lines say where the materials come from when you are short (v7.7) */
function wMissionHint(nx){const [key,lab]=nx,[k,v]=key.split(':');
 if(k==='build'&&v==='kiln'&&!wCanPay(wBuildDef('kiln').cost))return'Kiln: 8 stone, 4 wood (rocks, trees)';
 if(k==='build'&&v==='datacenter'&&(SW.res.ingot||0)<2)return(SW.buildings.some(b=>b.k==='kiln')?'Buddy Barn: 2 ingots. Ore veins, then kiln':'Buddy Barn: needs a kiln for ingots');
 if(k==='buddies'&&wBuddyFull())return'Buddies: build a Buddy Barn for room';
 if(k==='crop'&&W4.patchBuds&&!W4.patchBuds.some(q=>q.type<0&&!q.crop))return'Garden full: pluck a sprout, then grow BERRIES'; /* v8.9 */
 return lab}
