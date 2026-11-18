/* ================================================================
   FIELD ENGINE (Fable, v5.1) — the adventure sectors, rebuilt.
   Every sector outside Sunkeep is now a hand-drawn, scrolling tile
   map instead of one flat screen of scattered props:
     · your pouch sprouts WALK WITH YOU as a squad (like the latest
       Sprouts): B throws one at the cursor, hold B whistles them
       back, SELECT picks which kind goes next
     · thrown sprouts break nodes into pellets, carry pellets and
       TREASURES home to the Lantern beacon (weight vs. strength,
       PEB counts double), build bridges, and clear TYPE GATES
       (boulders=PEB, fire=EMBER, vines=LEAF, sparks=ZIP, blooms=DEW)
     · wild buddies live in the tall grass and are visible; ALPHAS
       guard the best treasure; TRAINERS spot you on the road
     · ledges hop one way; routes join edge to edge (the Lantern
       Gate is still fast travel)
     · KING BIBI holds the valley roads behind IRON DOME posts
   The old walker (worldUpdate/wDrawWorld) still runs Sunkeep Base.
   Hooks: wEnterSector builds W4.fld; worldUpdate/wDrawWorld hand
   over to fUpdate/fDraw while W4.fld is set.
   ================================================================ */
const FT=16;
const FBIO={
 MEADOW:{g:'#5fa544',g2:'#4f9239',g3:'#3b7430',a:'#a6e06a',p:'#d9c08a',p2:'#c2a670',w:'#3f8fd0',w2:'#8fd0f4',w3:'#2e6fae',c:'#a39272',c2:'#7a6a50',c3:'#54483a',t1:'#2c6e36',t2:'#3f9a46',t3:'#86d86c',tk:'#6b4a2b',fl:['#f078c0','#ffd94d','#ffffff'],tg:['#2f6a2c','#4fb04a','#9ae070'],tree:'oak'},
 TOWN:{g:'#66a84a',g2:'#56963f',g3:'#447c34',a:'#b0e474',p:'#cfc8b8',p2:'#aaa392',w:'#3f8fd0',w2:'#8fd0f4',w3:'#2e6fae',c:'#a39272',c2:'#7a6a50',c3:'#54483a',t1:'#2c6e36',t2:'#3f9a46',t3:'#86d86c',tk:'#6b4a2b',fl:['#f078c0','#ffd94d','#ffffff'],tg:['#2f6a2c','#4fb04a','#9ae070'],tree:'oak'},
 WASTES:{g:'#bd8850',g2:'#a8733f',g3:'#8a5a2e',a:'#e6ba78',p:'#dcb680',p2:'#c09860',w:'#e2541e',w2:'#ffc050',w3:'#a83410',c:'#94603e',c2:'#6e4530',c3:'#4a2c1e',t1:'#4e6a30',t2:'#6c8a40',t3:'#b0c868',tk:'#6b4a2b',fl:['#f0d020','#ffffff'],tg:['#96662e','#d0a040','#f0d070'],tree:'cactus'},
 SHORE:{g:'#e6d59a',g2:'#d6c386',g3:'#bca96c',a:'#fff2c0',p:'#cdb680',p2:'#b49c66',w:'#3aa0d8',w2:'#b4e8f8',w3:'#2878b8',c:'#9aa08c',c2:'#7c8270',c3:'#585e50',t1:'#2a7a44',t2:'#48b060',t3:'#98e488',tk:'#8a6a42',fl:['#f078c0','#ffffff','#7fd0e8'],tg:['#4e8e50',"#78c070",'#c0f0a0'],tree:'palm'},
 GLOOM:{g:'#3d3760',g2:'#342f55',g3:'#262244',a:'#7a6ab8',p:'#5c5484',p2:'#4a4370',w:'#2a1e5a',w2:'#8a6ae0',w3:'#1c1440',c:'#4e486c',c2:'#38324e',c3:'#241f36',t1:'#70347e',t2:'#a050b0',t3:'#e8a0f4',tk:'#cfc8dc',fl:['#7ee7ff','#b090e8'],tg:['#241f44','#5a48a0','#9a80e0'],tree:'shroom'},
 PEAK:{g:'#e4eef6',g2:'#d2deec',g3:'#b4c6da',a:'#ffffff',p:'#b8a890',p2:'#a09078',w:'#6ab8e8',w2:'#e0f6ff',w3:'#4a90c8',c:'#8e9cb0',c2:'#6a788e',c3:'#465264',t1:'#28564a',t2:'#3a7a5c',t3:'#f4faff',tk:'#5a4030',fl:['#a8c8ff'],tg:['#a4b8cc','#cadcee','#ffffff'],tree:'pine'}};
/* who the trainers are (overworld looks). The fighter cast drops in; King Bibi is the villain. */
const FLOOK={
 KISS:{skin:'#f4f0ea',hair:'#17141c',top:'#17141c',legs:'#2a2630',star:1},
 MAMA:{skin:'#c98a5e',hair:'#3a2418',top:'#d04878',legs:'#3a4a6a',big:1,shades:1},
 DEREK:{skin:'#e8b088',hair:'#8a5f30',top:'#a03a2e',legs:'#3c4a66',cap:'#2a6ad0',beard:1},
 'DOME GUARD':{skin:'#d8a070',hair:'#3a3a30',top:'#5a6a3a',legs:'#3e4a2c',helm:'#4a5a34'},
 'KING BIBI':{skin:'#e0aa84',hair:'#c8c8ce',top:'#1e2c5a',legs:'#17203e',crown:1,tie:'#58a0f0',sc:1.25}};
const FMEADOW=[
 ['.::S""""""..,..','.::.','###############'],['.::.""""""""..M','.::.','#.....R....A..#'],
 ['.::."p"""""""..','.::.','#..R.......2..#'],['.::."""""""""..','.::.','#.............#'],
 ['.::.""""""""...','.::.','#...,....R....#'],['.::."""""""..,.','.::.','#.............#'],
 ['.::::::::::::::','.::.','#..P..........#'],['...............','.::.','##x####---#####'],
 ['..~~~~~~~~~~...','.:::',':::............'],['.~~~~~~~~~~~~..','.::.','..""""""""""...'],
 ['.~~~~....~~~~..','.::.','.""""""""""""..'],['.~~~~.1..bbbb::',':::.','.""""""",""""..'],
 ['.~~~~....~~~~..','.::.','..""""""""""...'],['.~~~~~~~~~~~~..','.::.','...............'],
 ['..~~~~~~~~~~...','.::.','...T.......T...'],['...............','.::.','...............'],
 ['.T..W....T...,.','.::.','.R....""""""...'],['....T..B...W...','.::.','.....""""""""..'],
 ['.W.....T.......','.::.','..B..""""""""..'],['...T.....B..T..','.::.','......""""""...'],
 ['.......,.......','.::.','...T...........'],['..T..W.....T...','.::.','..........W....'],
 ['...............','.::.','...............']];
const FMAPS={
 MEADOW:{rows:['TThhTTTTTTTTTTTTTeeTTTTTTTTTTTTTTTTT'].concat(FMEADOW.map(p=>'T'+p[0]+p[1]+p[2]+'T'),['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT']),
  key:{e:{k:'exit',to:'TOWN'},h:{k:'exit',to:'BASE'},p:{k:'bud',type:1},P:{k:'bud',type:3},
   1:{k:'tre',n:'ACORN CROWN',w:3,petal:40},2:{k:'tre',n:'RUSTY FLOW PROS WRENCH',w:5,petal:60,res:['ingot',2]},
   A:{k:'alpha',sp:'BLOOMBOAR',lv:8,guards:'2'},
   M:{k:'npc',who:'KISS',dir:[1,0],team:[['ZIPWIG',4],['PEBBLIT',4]],prize:30,
    pre:['KISS: Hey. Keeper. One question.','Do your buddies even battle? Every single time, I ask. Let us find out.'],
    win:'KISS: ...Okay. One MORE question. Later.',lose:'KISS: That answers that.',after:'One question: did you try throwing sprouts at that boulder wall? PEB kinds crack rock.'}}},
 TOWN:{rows:[
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T............HHHH............T',
  'T............HHHH............T',
  'T..HHH.......HGHH......HHH...T',
  'T..HcH........::.......HcH...T',
  'T...:.........::........:....T',
  's::::::::::::::::::::::::::::w',
  's::::::::::::::::::::::::::::w',
  'T.....,.......::.....,.......T',
  'T..~~~~.......::......HHH....T',
  'T..~~~~..n....::...m..HcH....T',
  'T..~~~~.......::.......:.....T',
  'T.............::::::::::.....T',
  'T...,.........::.............T',
  'T..B......T...::...T.....B...T',
  'T.............::.............T',
  'TTTTTTTTTTTTT.S:.TTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTeeTTTTTTTTTTTTTT'],
  key:{e:{k:'exit',to:'MEADOW'},w:{k:'exit',to:'WASTES'},s:{k:'exit',to:'SHORE'},c:{k:'door'},
   n:{k:'npc',who:'PIP',ask:1},m:{k:'npc',who:'ELDER',ask:1}}},
 WASTES:{rows:[
  'TTTTTTTTTTTTTTTTTTTTkkTTTTTTTTTT',
  'T###......""""".....::....HHHH.T',
  'T##.......""""""..##DD##..HGHH.T',
  'T#...R....""""".....::.....::..T',
  'T.........,.........::::::::...T',
  'T..~~~~~~.......M...::.........T',
  'T..~~~~~~~~.........::...""""..T',
  'T..~~.2.bbb.........::.""""""..T',
  'T..~~~~~~~~.........::.""""""..T',
  'T...................::..""""...T',
  'e:S:::::::::::::::::::.........T',
  'e:::::::::::::::::::::..Q......T',
  'T.........W.........::.........T',
  'T..####f####....R...::...T.....T',
  'T..#.......#........::.........T',
  'T..#..1..P.#...""""""::..B.....T',
  'T..#.......#..""""""::....##x##T',
  'T..#########..""""""::....#...#T',
  'T...........W.......::....#.3.#T',
  'T....T..............::....#####T',
  'T...................::.........T',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  key:{e:{k:'exit',to:'TOWN'},k:{k:'exit',to:'PEAK'},D:{k:'dome',flag:'bibi'},P:{k:'bud',type:3},
   1:{k:'tre',n:"DEREK'S COOLER",w:4,petal:70,res:['berry',6]},2:{k:'tre',n:'MOLTEN GEODE',w:6,petal:90,res:['ingot',3]},3:{k:'tre',n:'MYSTERY GLASSWARE',w:3,petal:55},
   M:{k:'npc',who:'DOME GUARD',dir:[1,0],team:[['MAGMOSS',9],['BOULDERHOUND',9]],prize:60,
    pre:["DOME GUARD: Halt. King's orders: the dome stays up till the valley is safe.",'Papers. Sprouts. Snacks. All of it, on the ground.'],
    win:'DOME GUARD: The dome stays up. The King says it is temporary. He sits in the Gloom.',lose:'DOME GUARD: See? Not safe. Move along.',after:'The IRON DOME only drops for the King. Find him in GLOOM HOLLOW.'},
   Q:{k:'npc',who:'DEREK',dir:[-1,0],prop:'truck',team:[['CINDERCAP',8],['DRIZZLET',8]],prize:50,
    pre:['DEREK: Yo! The Flow Pros truck died. Again.','Battle me while I wait on Marcus? Loser buys the beer.'],
    win:'DEREK: Ha! Okay, okay. Beer is on me. Do not tell Marcus about the truck.',lose:'DEREK: You owe me a cold one, keeper.',after:'Marcus runs the gym up the road. Tell him the truck is, uh, fine.'}}},
 SHORE:{rows:[
  'TTTTTTTTggTTTTTTTTTTTTTTTTTTTTTT',
  'T.HHHH..::....""""""......T....T',
  'T.HGHH..::...""""""""..........T',
  'T..::...::....""""""....####v##T',
  'T..:::::::..............#.....#T',
  'T.......::....,.........#..1..#T',
  'T...T...::..............#P....#T',
  'T.......::..............#######T',
  'T.......::.....................T',
  'T.......::......M..............T',
  'T.......:::::::::::::::::::::S:e',
  'T.......:::::::::::::::::::::::e',
  'T..""""....................T...T',
  'T.""""""..####d#####...........T',
  'T.""""""..#........#....B......T',
  'T..""""...#..2..Q..#...........T',
  'T.........#........#.....W.....T',
  'T...R.....##########...........T',
  'T..............................T',
  'T~~~~~~~~~bbb~~~~~~~~~~~~~~~~~~T',
  'T~~~~~~~~...3..~~~~~~~~~~~~~~~~T',
  'T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T'],
  key:{e:{k:'exit',to:'TOWN'},g:{k:'exit',to:'GLOOM'},P:{k:'bud',type:4},Q:{k:'bud',type:5},
   1:{k:'tre',n:"MAMA'S YUKON KEYS",w:2,petal:60},2:{k:'tre',n:'PEARL THE SIZE OF LOUIE',w:5,petal:120},3:{k:'tre',n:'MESSAGE IN A BOTTLE',w:2,petal:50,res:['berry',4]},
   M:{k:'npc',who:'MAMA',dir:[0,1],prop:'yukon',team:[['TIDEBUD',13],['BLOOMBOAR',13]],prize:90,
    pre:['MAMA: I have been up since four, keeper.','Parked the Yukon on the sand. Now I am parking YOU.'],
    win:'MAMA: Hm. Good. Now go eat something, you look thin.',lose:'MAMA: Bed. Now. Try again when you are rested.',after:'If you find my keys out here, I will make it worth your while.'}}},
 GLOOM:{rows:[
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T....A.....HHHHHHHH......."""".T',
  'T..2.......HHHHHHHH......""""""T',
  'T..........HHHHHHHH......."""".T',
  'T#####z####....K........T......T',
  'T.........#...::::.............T',
  'T.""""....#....::....TT....W...T',
  'T""""""...T....::..............T',
  'T.""""....T....::::::::::......T',
  'T.........T..M..........:..T...T',
  'T...TT..................:......T',
  'T.......~~~~~~..........:..""".T',
  'T..R...~~~~~~~~....::::::."""".T',
  'T......~~~.1.~~....:.......""".T',
  'T......~~~bbb~~....:...........T',
  'T.......~~...~~....:....T......T',
  'T..................:...........T',
  'T...""""...........:...........T',
  'T..""""""..........:S..........T',
  'T...""""...........:...........T',
  'TTTTTTTTTTTTTTTTTTTeTTTTTTTTTTTT'],fort:[15,4],
  key:{e:{k:'exit',to:'SHORE'},
   1:{k:'tre',n:'LANTERN SHARD',w:4,petal:150},2:{k:'tre',n:"KING BIBI'S SPARE CROWN",w:6,petal:200,res:['ingot',4]},
   A:{k:'alpha',sp:'AURICORN',lv:22,guards:'2'},
   M:{k:'npc',who:'DOME GUARD',dir:[1,0],team:[['BOULDERHOUND',16],['VOLTHARE',16]],prize:110,
    pre:['DOME GUARD: The King is not receiving visitors.','Or criticism. Or keepers. Turn around.'],
    win:'DOME GUARD: ...He is going to be so mad at me.',lose:"DOME GUARD: The dome stays up, keeper. King's orders.",after:'He is right up the road. Do not say I let you through.'},
   K:{k:'npc',who:'KING BIBI',dir:[0,1],boss:1,flag:'bibi',team:[['BOULDERHOUND',18],['MAGMOSS',18],['AURICORN',19]],prize:300,
    pre:['Ah. The little keeper. Sit. I have brought a chart.',
     'This is the Lantern. This is the night the robot nuked the Data Center. I drew it myself. With a marker.',
     'When the light went out, I raised the dome. Somebody had to. Wild buddies, glitches, chrome. No thank you.',
     'You say the valley is safe again? Prove it. Then perhaps the dome comes down. Perhaps.'],
    win:'KING BIBI: ...Fine. FINE. The dome comes down. Order is restored. I was always going to do this.',lose:'KING BIBI: See? Not safe. The dome stays. Temporarily.',
    after:'The Peak road is open. Bottie is up there. Go unplug that robot, keeper. And knock first.'}}},
 PEAK:{rows:[
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T.....HHHH.....................T',
  'T.....HGHH........""""....2....T',
  'T......::........."""".........T',
  'T......::::::::::::::::::::....T',
  'T####---##########x#######::###T',
  'T.........................::...T',
  'T..""""......R............::...T',
  'T..""""""..........:::::::::...T',
  'T...""""...........::..........T',
  'T##################::##---#####T',
  'T..................::..........T',
  'T...W..............::...###z###T',
  'T..........""""....::...#.....#T',
  'T.........""""""...::...#..1..#T',
  'T..........""""....::...#######T',
  'T...R..............::..........T',
  'T.............M....::......B...T',
  'T..................:S..........T',
  'T..................::..........T',
  'TTTTTTTTTTTTTTTTTTTeeTTTTTTTTTTT'],
  key:{e:{k:'exit',to:'WASTES'},
   1:{k:'tre',n:'FROZEN MIXTAPE',w:4,petal:140},2:{k:'tre',n:"FIRST KEEPER'S BOOT",w:6,petal:220,res:['ingot',4]},
   M:{k:'npc',who:'KISS',dir:[1,0],team:[['VOLTHARE',22],['BOULDERHOUND',22]],prize:140,
    pre:['KISS: Keeper. One question.','How did you get past the dome? ...Do not answer. Battle.'],
    win:'KISS: No further questions.',lose:'KISS: I have several follow-up questions.',after:'The gym is up top. ZIP sprouts open the spark gate, by the way.'}}}};
const FGATE={x:{type:1,n:'BOULDER WALL'},f:{type:0,n:'FIRE WALL'},v:{type:4,n:'THORN VINES'},z:{type:3,n:'SPARK GATE'},d:{type:2,n:'THIRSTY BLOOM'}};
if(!SW.fl)SW.fl={};if(SW.selType==null)SW.selType=0;
const fTile=(F,tx,ty)=>(tx<0||ty<0||tx>=F.w||ty>=F.h)?'T':F.t[ty][tx];
function fBuild(id,from){const M=FMAPS[id],rows=M.rows,h=rows.length,w=rows[0].length;
 const F={id,w,h,t:[],items:[],gates:[],sites:[],buds:[],npcs:[],exits:[],sq:[],alphas:[],domes:[],doors:[],grass:[],gym:null,start:{x:w*8,y:h*8},bl:{},t0:0,t:null,dir:[0,-1],bio:FBIO[id]||FBIO.MEADOW,cv:null,dist:null};
 F.t=[];W4.nodes=[];W4.wilds=[];W4.loose=[];W4.treasure=null;W4.decor=[];W4.fol=[];W4.bushes=null;
 const raw=(x,y)=>(x<0||y<0||x>=w||y>=h)?'T':rows[y][x],siteAt={};
 for(let y=0;y<h;y++){const row=[];
  for(let x=0;x<w;x++){const c=rows[y][x]||'T',cx=x*FT+8,cy=y*FT+10;let gch=c;
   if(!'.,:"T#~-=H'.includes(c)){
    let np=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(':eswkgSG'.includes(raw(x+dx,y+dy))&&raw(x+dx,y+dy)!=='G')np++;
    gch=np>=2||c==='S'||c==='G'||c==='c'?':':'.';
    const K=M.key&&M.key[c],fk=id+':'+c+x+'_'+y;
    if(c==='S')F.start={x:cx,y:cy+2};
    else if(c==='G')F.gym={x:cx,y:cy,tx:x,ty:y};
    else if(c==='W'||c==='R'||c==='B'){const k=c==='W'?'tree':c==='R'?'rock':'bush';W4.nodes.push({k,x:cx,y:cy,got:false,hp:k==='bush'?6:15,max:k==='bush'?6:15})}
    else if(FGATE[c]){const gt={x:cx,y:cy,tx:x,ty:y,type:FGATE[c].type,n:FGATE[c].n,c,hp:12,max:12,open:!!SW.fl[fk],fk};F.gates.push(gt);F.bl[x+','+y]=gt}
    else if(c==='b'){gch='~';siteAt[x+','+y]=1}
    else if(K&&K.k==='tre'){if(!SW.fl[fk])F.items.push({k:'tre',n:K.n,w:K.w,petal:K.petal||0,res:K.res,x:cx,y:cy,car:[],fk,ch:c,ix:F.items.length})}
    else if(K&&K.k==='bud')F.buds.push({type:K.type,x:cx,y:cy});
    else if(K&&K.k==='alpha'){if(!SW.fl[fk])F.alphas.push({sp:K.sp,lv:K.lv,x:cx,y:cy,guards:K.guards,fk})}
    else if(K&&K.k==='npc')F.npcs.push(Object.assign({x:cx,y:cy,hx:cx,hy:cy,fk:K.flag||fk},K));
    else if(K&&K.k==='exit'){gch=':';F.exits.push({to:K.to,tx:x,ty:y,x:cx,y:cy})}
    else if(K&&K.k==='dome'){gch=':';const dm={x:cx,y:cy,tx:x,ty:y,flag:K.flag,dome:1};F.domes.push(dm);F.bl[x+','+y]=dm}
    else if(K&&K.k==='door'){F.doors.push({x:cx,y:cy,tx:x,ty:y})}}
   if(gch==='"')F.grass.push([x,y]);
   row.push(gch)}
  F.t.push(row)}
 /* bridge sites: neighbouring b tiles are one job */
 {const seen={};for(const k in siteAt){if(seen[k])continue;const tiles=[],st=[k];seen[k]=1;
   while(st.length){const [x,y]=st.pop().split(',').map(Number);tiles.push([x,y]);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k2=(x+dx)+','+(y+dy);if(siteAt[k2]&&!seen[k2]){seen[k2]=1;st.push(k2)}}}
   const fk=id+':b'+k,site={tiles,hp:tiles.length*5,max:tiles.length*5,x:tiles.reduce((a,t)=>a+t[0],0)/tiles.length*FT+8,y:tiles.reduce((a,t)=>a+t[1],0)/tiles.length*FT+8,done:!!SW.fl[fk],fk};
   if(site.done)for(const [x,y] of tiles)F.t[y][x]='=';
   F.sites.push(site)}}
 for(const it of F.items){const al=F.alphas.find(a=>a.guards===it.ch);if(al)it.guard=al}
 if(M.fort)F.fort={x:M.fort[0]*FT,y:M.fort[1]*FT};
 const sec=wSector(id);
 if(sec.table&&F.grass.length)for(let i=0;i<4;i++)W4.wilds.push(fSpawnWild(F,sec));
 /* where you arrive: the exit that leads back where you came from, else the beacon */
 const ex=from&&F.exits.find(e=>e.to===from);
 if(ex){const ix=ex.tx<=0?1:ex.tx>=w-1?-1:0,iy=ex.ty<=0?1:ex.ty>=h-1?-1:0;P3.x=ex.x+ix*FT*1.5;P3.y=ex.y+iy*FT*1.5;F.dir=[ix,iy||(ix?0:-1)]}
 else{P3.x=F.start.x+FT;P3.y=F.start.y}
 P3.ax=F.dir[0];P3.ay=F.dir[1];W4.part={x:P3.x-12,y:P3.y+4};
 F.arrive=ex?{x:P3.x,y:P3.y}:null;F.t0=0;fSpotsBuild(F);lou.x=P3.x-16;lou.y=P3.y+8;W4.fetch=null;fFlow(F);fSync(F,true);return F}
function fSpawnWild(F,sec){const [gx,gy]=F.grass[(Math.random()*F.grass.length)|0];
 /* levels climb with distance from the Lantern post; until your first catch, wilds stay at the lowest level */
 const d0=Math.hypot(gx*FT+8-F.start.x,gy*FT+10-F.start.y),fr=Math.min(1,d0/400),lvl=SW.quest<3?sec.lv[0]:sec.lv[0]+((Math.random()*(1+(sec.lv[1]-sec.lv[0])*fr))|0);
 return{sp:wPickFromTable(sec),lv:Math.min(sec.lv[1],lvl),x:gx*FT+8,y:gy*FT+10,tx:gx*FT+8,ty:gy*FT+10,t:Math.random()*2}}
function fBlocked(F,tx,ty){const o=F.bl[tx+','+ty];return!!o&&(o.dome?!SW.fl[o.flag]:!o.open)}
function fWalkTile(F,tx,ty){if(F.base)return tx>=0&&ty>=0&&tx<F.w&&ty<F.h&&!wSolidAt(tx*FT+8,ty*FT+8);const c=fTile(F,tx,ty);return'.,:"='.includes(c)&&!fBlocked(F,tx,ty)}
function fSolid(F,x,y){if(F.base)return wSolidAt(x,y);const tx=Math.floor(x/FT),ty=Math.floor(y/FT);
 if(!fWalkTile(F,tx,ty))return true;
 for(const nd of W4.nodes)if(!nd.got&&Math.abs(x-nd.x)<7&&Math.abs(y-nd.y)<6)return true;
 return false}
function fBox(F,x,y){return fSolid(F,x-4,y-1)||fSolid(F,x+4,y-1)||fSolid(F,x-4,y+3)||fSolid(F,x+4,y+3)}
/* the way home: steps to the beacon from every walkable tile (carriers walk downhill on this) */
function fFlow(F){const d=new Array(F.w*F.h).fill(-1),sx=Math.floor(F.start.x/FT),sy=Math.floor(F.start.y/FT),q=[[sx,sy]];d[sy*F.w+sx]=0;
 for(let i=0;i<q.length;i++){const [x,y]=q[i];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;
   if(nx<0||ny<0||nx>=F.w||ny>=F.h||d[ny*F.w+nx]>=0||!fWalkTile(F,nx,ny))continue;d[ny*F.w+nx]=d[y*F.w+x]+1;q.push([nx,ny])}}
 F.dist=d}
const fDist=(F,x,y)=>{const tx=Math.floor(x/FT),ty=Math.floor(y/FT);return(tx<0||ty<0||tx>=F.w||ty>=F.h)?-1:F.dist[ty*F.w+tx]};
/* the squad IS the pouch: every sprout you own walks with you (up to 24 on the field) */
function fSync(F,fresh){const want=TYPES.map(t=>SW.buds[t.n]||0);let tot=want.reduce((a,b)=>a+b,0);
const cap=Math.min(24,SW.pouch||8);
 while(tot>cap){const i=want.indexOf(Math.max(...want));want[i]--;tot--}
 for(let ty=0;ty<TYPES.length;ty++){let have=F.sq.filter(s=>s.type===ty);
  while(have.length>want[ty]){const s=have.find(s2=>s2.st==='follow')||have[0];fDrop(F,s);F.sq.splice(F.sq.indexOf(s),1);have=F.sq.filter(s2=>s2.type===ty)}
  for(let i=have.length;i<want[ty];i++)F.sq.push({type:ty,x:P3.x+(Math.random()*20-10),y:P3.y+6+Math.random()*10,z:fresh?0:8,st:'follow',a:Math.random()*9,t:0,stuck:0})}}
function fDrop(F,s){if(s.st==='carry'&&s.tg&&s.tg.car){const i=s.tg.car.indexOf(s);if(i>=0)s.tg.car.splice(i,1)}s.tg=null}
const fStr=it=>it.car.reduce((a,s)=>a+(s.type===1?2:1),0);
function fAim(F){ /* the cursor sits ahead of you and locks on to the nearest thing sprouts can work: a wide cone in front, plus anything right beside you */
 let x=P3.x+F.dir[0]*52,y=P3.y+F.dir[1]*52,best=1e9,tg=null,kind=null;
 const tryT=(o,k)=>{if(!wTutAim(o,k))return; /* v9.8: in Erin's lessons only the thing she is showing you */const vx=o.x-P3.x,vy=o.y-P3.y,al=vx*F.dir[0]+vy*F.dir[1],off=Math.abs(vx*F.dir[1]-vy*F.dir[0]),d=Math.hypot(vx,vy);
  let sc=1e9;if(al>-2&&al<92&&off<16+al*.42)sc=al+off*1.3;if(d<26)sc=Math.min(sc,d*.8);if(sc<1e9){if(k==='bug')sc*=.6;else if(k==='wild')sc*=.75;else if(k==='bwork')sc*=1.1}if(sc<best){best=sc;tg=o;kind=k}};
 for(const g2 of F.gates)if(!g2.open)tryT(g2,'gate');
 for(const s of F.sites)if(!s.done)tryT(s,'site');
 {const b0=best;let full=null;for(const it of F.items)if(!it.done&&!(it.guard&&F.alphas.includes(it.guard))){if(fStr(it)+F.sq.filter(q=>q.st==='fly'&&q.aim&&q.aim.tg===it).reduce((a,q)=>a+(q.type===1?2:1),0)>=it.w){full=full||it;continue}tryT(it,'item')}
  if(!tg&&full&&best===b0){const sv=best;tryT(full,'item');if(tg===full){tg=null;kind=null;best=sv;F.aimFull=full}}else F.aimFull=null}
 for(const nd of W4.nodes)if(!nd.got&&nd.k==='bush')tryT(nd,'node'); /* sprouts pick berries; trees and rocks are buddy work */
 for(const wd of W4.wilds)if(!wd.cap)tryT(wd,'wild');
 if(W4.fld)for(const bg of W4.bugs||[])tryT(bg,'bug');
 if(F.pf){for(const nd of W4.nodes)if(!nd.got&&nd.k!=='bush'&&pfBest(F,nd))tryT(nd,'bwork');for(const sp of F.spots||[])if(!sp.got&&pfBest(F,sp))tryT(sp,'bwork')}
 if(tg){x=tg.x;y=tg.y}
 else{let n=0;while(n++<10&&!fWalkTile(F,Math.floor(x/FT),Math.floor(y/FT))){x-=F.dir[0]*5;y-=F.dir[1]*5}}
 /* which kind goes: what the target needs, else what suits it; SELECT overrides for a few seconds */
 let pref=null,need=-1;
 if(kind==='gate')pref=[tg.type];else if(kind==='item')pref=tg.w>=3?[1,0,5,3,4,2]:[3,5,0,4,2,1];else if(kind==='node')pref=[2,4,5,0,3,1];else if(kind==='site')pref=[1,0,4,3,5,2];else if(kind==='bug')pref=[3,2,4,0,5,1];
 else if(kind==='wild'){const t0=wSp(tg.sp).t[0];pref=[t0].concat([0,1,2,3,4,5].filter(t=>t!==t0))}
 if(pref){const sq=F.sq.filter(s=>s.st==='follow'),have=pref.find(t=>sq.some(s=>s.type===t));if(have===undefined){if(pref.length===1)need=pref[0]}else if(!(F.manT>0)||pref.length===1)SW.selType=have}
 return{x,y,tg,kind,need,buddy:kind==='bwork'?pfBest(F,tg):null}}
function fThrow(F,quiet){const aim=fAim(F),cand=F.sq.filter(s=>s.st==='follow'&&Math.hypot(s.x-P3.x,s.y-P3.y)<70);
 if(aim.need>=0){if(!quiet){swSnd(200,.06);W4.floats.push({x:aim.tg.x,y:aim.tg.y-22,txt:'NEEDS '+TYPES[aim.need].n+' SPROUTS',t:1.4,c:'#ffd94d'})}return false}
 if(!aim.tg)return false;
 if(aim.kind==='bwork'){if(aim.buddy){pfSend(F,aim.buddy,aim.tg);return true}return false}
 if(!cand.length){if(!quiet){swSnd(240,.05);W4.floats.push({x:P3.x,y:P3.y-18,txt:F.sq.length?'B CALLS THEM BACK':'NO SPROUTS WITH YOU',t:1.2,c:'#e88'})}return false}
 const want=SW.selType;cand.sort((a,b)=>((a.type===want?0:1)-(b.type===want?0:1))||(Math.hypot(a.x-P3.x,a.y-P3.y)-Math.hypot(b.x-P3.x,b.y-P3.y)));
 const s=cand[0];s.st='fly';s.sx=P3.x;s.sy=P3.y-6;s.tx=aim.x+(Math.random()*6-3);s.ty=aim.y+(Math.random()*6-3);s.t=0;s.aim=aim;swSnd(520,.07,940);return true}
function fLand(F,s){const a=s.aim||{};s.z=0;s.aim=null;
 const near=(o,r2)=>o&&Math.hypot(o.x-s.x,o.y-s.y)<(r2||24);
 let tg=a.tg,kind=a.kind;
 if(!tg){for(const it of F.items)if(!it.done&&near(it,18)){tg=it;kind='item'}
  if(!tg)for(const nd of W4.nodes)if(!nd.got&&nd.k==='bush'&&near(nd,18)){tg=nd;kind='node'}}
 if(kind==='bug'){s.st='ret';if((W4.bugs||[]).includes(tg)&&Math.hypot(tg.x-s.x,tg.y-s.y)<26)bgCatch(tg);else W4.floats.push({x:s.x,y:s.y-14,txt:'IT FLEW OFF!',t:1,c:'#e88'});return}
 if(kind==='wild'&&W4.wilds.includes(tg)){if(wBuddyFull()){wFullSay();s.st='ret';return}pfLatch(F,s,tg);return}
 if(kind==='gate'){if(tg.open){s.st='idle';s.t=0;return}
  if(tg.type!==s.type){s.st='ret';W4.floats.push({x:tg.x,y:tg.y-20,txt:tg.n+' — NEEDS '+TYPES[tg.type].n+' SPROUTS',t:1.6,c:'#ffd94d'});swSnd(200,.06);return}}
 if(kind==='item'&&tg.guard&&F.alphas.includes(tg.guard)){s.st='ret';W4.floats.push({x:tg.x,y:tg.y-20,txt:'THE ALPHA GUARDS IT!',t:1.4,c:'#e88'});return}
 if(tg&&kind){s.tg=tg;s.kind=kind;s.wt=0;
  if(kind==='item'){s.st='carry';if(!tg.car.includes(s))tg.car.push(s)}else s.st='work';return}
 if(fSolid(F,s.x,s.y)){s.st='ret';return}
 s.st='idle';s.t=0}
function fSpark(x,y,c){W4.floats.push({x,y,txt:'*',t:.35,c:c||'#ffffff'})}
function fBudDraw(o){const x=Math.round(o.x),y=Math.round(o.y),T=TYPES[o.type],sw=Math.round(Math.sin(time*3+o.x)*1);
 if(o.glow){const fl=.5+.5*Math.sin(time*4+o.x);g.globalAlpha=.18+.14*fl;r(T.l,x-9,y-14,19,18);g.globalAlpha=.3+.2*fl;r('#fff3b0',x-5,y-11,11,12);g.globalAlpha=1}
 r('#5a3820',x-4,y,9,3);r('#3d2c1a',x-3,y+1,7,1);r('#2c6030',x,y-6,1,6);r(T.c,x-3+sw,y-9,3,3);r(T.c,x+1+sw,y-10,3,3);r(T.l,x-2+sw,y-9,1,1);
 if(((time*2+o.x)|0)%2)r('#fff3b0',x+5,y-12,1,1)}
function fDeliver(F,it){wOnDeliver(F,it);it.done=true;
 if(it.k==='tre'){SW.fl[it.fk]=1;SW.treasures=(SW.treasures||0)+1;SW.res.petal+=it.petal;if(it.res)SW.res[it.res[0]]=(SW.res[it.res[0]]||0)+it.res[1];
  F.got={n:it.n,t:3.2,txt:'+'+it.petal+' PETALS'+(it.res?' · +'+it.res[1]+' '+it.res[0].toUpperCase():'')};swSnd(784,.14,1568)}
 else{SW.res[it.res]=(SW.res[it.res]||0)+it.n;W4.floats.push({x:F.start.x,y:F.start.y-26,txt:'+'+it.n+' '+it.res.toUpperCase(),t:1.6,c:'#ffd94d'});swSnd(1175,.06,1568)}
 for(const s of it.car){s.st='ret';s.tg=null}it.car=[];F.items.splice(F.items.indexOf(it),1);swSave()}
function fSquad(F,dt){const flw=F.sq.filter(s=>s.st==='follow');let fi=0;
 for(const s of F.sq){const T=TYPES[s.type],sp=T.sp*1.25;s.mv=false;
  if(s.st==='latch'){pfLatchPos(F,s,dt);continue}
  if(s.z>0&&s.st!=='fly')s.z=Math.max(0,s.z-40*dt);
  if(s.st==='follow'||s.st==='ret'){let tx=P3.x,ty=P3.y;
   if(s.st==='follow'){const i=fi++,row=(i/4)|0,col=i%4,bx=-F.dir[0],by=-F.dir[1],lx=-by,ly=bx,back=(F.pf&&F.pf.length?32:16)+row*10,lat=(col-1.5)*11+((row%2)?5:0);
    tx=P3.x+bx*back+lx*lat;ty=P3.y+2+by*back+ly*lat}
   const dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy);
   if(s.st==='ret'&&d<26){s.st='follow';continue}
   if(d>3){const v=Math.min(d*6,d>50?sp*1.6:sp),nx=s.x+dx/d*v*dt,ny=s.y+dy/d*v*dt,x0=s.x,y0=s.y;
    if(!fSolid(F,nx,s.y))s.x=nx;if(!fSolid(F,s.x,ny))s.y=ny;
    const moved=Math.abs(s.x-x0)+Math.abs(s.y-y0)>.01; /* a blocked axis is not movement: a sprout pinned on a wall gives up and flies home */
    s.mv=d>5;s.stuck=moved&&d<110?0:s.stuck+dt;
    if(s.stuck>.8){s.stuck=0;s.st='fly';s.sx=s.x;s.sy=s.y;s.tx=P3.x-F.dir[0]*10;s.ty=P3.y+2-F.dir[1]*10;s.t=0;s.aim={home:1}}}
   continue}
  if(s.st==='fly'){s.t+=dt;const k=Math.min(1,s.t/.42);s.x=s.sx+(s.tx-s.sx)*k;s.y=s.sy+(s.ty-s.sy)*k;s.z=Math.sin(k*Math.PI)*18;
   if(k>=1){if(s.aim&&s.aim.home){s.z=0;s.aim=null;s.st='follow'}else fLand(F,s)}continue}
  if(s.st==='idle'){s.t+=dt;
   /* an idle sprout picks up nearby work by itself, like the garden sprouts do */
   if(s.t>.5){const it=F.items.find(i2=>!i2.done&&!(i2.guard&&F.alphas.includes(i2.guard))&&Math.hypot(i2.x-s.x,i2.y-s.y)<30);
    if(it){s.st='carry';s.tg=it;s.kind='item';it.car.push(s);continue}
    if(Math.hypot(P3.x-s.x,P3.y-s.y)<34||s.t>3.5)s.st='ret'}
   continue}
  if(s.st==='work'){const tg=s.tg,k=s.kind;
   const gone=!tg||(k==='node'&&tg.got)||(k==='gate'&&tg.open)||(k==='site'&&tg.done);
   if(gone){s.st='idle';s.t=0;s.tg=null;continue}
   let gx=tg.x,gy=tg.y;
   if(k==='site'){ /* stand on the bank nearest to the job */
    gx=s.x;gy=s.y;if(Math.hypot(tg.x-s.x,tg.y-s.y)>tg.tiles.length*8+20){gx=tg.x;gy=tg.y}}
   const dx=gx-s.x,dy=gy-s.y,d=Math.hypot(dx,dy),reach=k==='site'?2:13;
   if(d>reach){const nx=s.x+dx/d*sp*dt,ny=s.y+dy/d*sp*dt;if(!fSolid(F,nx,s.y))s.x=nx;if(!fSolid(F,s.x,ny))s.y=ny;s.mv=true;
    s.wt+=dt*.5;if(s.wt<.5)continue}
   s.wt+=dt;s.mv=((time*6+s.a)|0)%2===0;
   if(s.wt>=.5){s.wt=0;const pw=(k==='node'&&((tg.k==='rock'&&s.type===1)||(tg.k==='tree'&&s.type===4)||(tg.k==='bush'&&s.type===2)))?2:1;
    tg.hp-=pw;tg.shake=.2;fSpark(tg.x+(Math.random()*12-6),tg.y-10-(Math.random()*8),T.l);if(Math.random()<.3)swSnd(k==='node'&&tg.k==='rock'?180:260,.03,120);
    if(tg.hp<=0){
     if(k==='node'){tg.got=true;const y2=WNODEY[tg.k];F.items.push({k:'pel',res:y2[0],n:y2[1]+1,w:tg.k==='bush'?1:tg.k==='tree'?2:3,x:tg.x,y:tg.y,car:[]});if(F.base)fFlow(F);swSnd(220,.08,140)}
     else if(k==='gate'){tg.open=true;SW.fl[tg.fk]=1;fFlow(F);F.cv=null;W4.floats.push({x:tg.x,y:tg.y-18,txt:tg.n+' CLEARED!',t:1.8,c:'#7ee787'});swSnd(660,.12,1320);swSave()}
     else{tg.done=true;SW.fl[tg.fk]=1;for(const [x,y] of tg.tiles)F.t[y][x]='=';fFlow(F);F.cv=null;W4.floats.push({x:tg.x,y:tg.y-14,txt:'BRIDGE BUILT!',t:1.8,c:'#7ee787'});swSnd(660,.12,1320);swSave()}}}
   continue}
  if(s.st==='carry'){const it=s.tg;if(!it||it.done){s.st='idle';s.t=0;s.tg=null;continue}
   const i=it.car.indexOf(s),n=Math.max(1,it.car.length),an=i/n*6.283+1,gx=it.x+Math.cos(an)*8,gy=it.y+Math.sin(an)*5+2;
   const dx=gx-s.x,dy=gy-s.y,d=Math.hypot(dx,dy);if(d>2){const v=Math.min(d*8,sp*1.3);s.x+=dx/d*v*dt;s.y+=dy/d*v*dt}s.mv=!!it.moving}}}
function fItems(F,dt){for(const it of F.items.slice()){it.moving=false;if(!it.car.length)continue;
  const st=fStr(it);if(st<it.w)continue;
  const tx=Math.floor(it.x/FT),ty=Math.floor(it.y/FT),d0=F.dist[ty*F.w+tx];
  if(d0<0){it.block=1;continue}it.block=0;
  if(Math.hypot(it.x-F.start.x,it.y-F.start.y)<10){fDeliver(F,it);continue}
  let bx=F.start.x,by=F.start.y;
  if(d0>0){let bd=d0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=F.w||ny>=F.h)continue;const d2=F.dist[ny*F.w+nx];if(d2>=0&&d2<bd){bd=d2;bx=nx*FT+8;by=ny*FT+10}}}
  const dx=bx-it.x,dy=by-it.y,d=Math.hypot(dx,dy),v=Math.min(54,26+(st-it.w)*7);
  if(d>.5){it.x+=dx/d*v*dt;it.y+=dy/d*v*dt;it.moving=true}}}
function fNear(F){const px=P3.x+F.dir[0]*11,py=P3.y+F.dir[1]*11,in2=(o,r2)=>Math.hypot(px-o.x,py-o.y)<(r2||17);
 for(const b of F.buds)if(in2(b))return{k:'bud',b,txt:'PLUCK '+TYPES[b.type].n+' SPROUT'};
 for(const np of F.npcs)if(in2(np,18))return{k:'npc',np,txt:np.team&&!SW.fl[np.fk]?'BATTLE '+np.who:'TALK'};
 for(const al of F.alphas)if(in2(al,22))return{k:'alpha',al,txt:'CHALLENGE ALPHA '+al.sp};
 for(const sg of (FSIGNS[F.id]||[]))if(!in2(F.start,18)&&in2({x:sg[0]*FT+8,y:sg[1]*FT+10},14))return{k:'road',msg:sg[2],txt:'READ SIGN'}; /* v9.5: road signs (the Lantern post always wins) */
 for(const wd of W4.wilds)if(SW.quest>=3&&in2(wd)&&!wd.cap&&!pfCan(F,wd))return{k:'wild',wd,txt:'BATTLE '+wd.sp+' Lv'+wd.lv+(F.sq.length?' · too strong to catch':'')};
 if(F.gym&&in2(F.gym,18))return{k:'gym',txt:W4.sector==='PEAK'?'TOWER':'LODGE'};
 for(const dr of F.doors)if(in2(dr,14))return{k:'door',txt:'KNOCK'};
 if(in2(F.start,18))return{k:'sign',txt:'LANTERN POST · REST, TRAVEL'};
 for(const nd of W4.nodes)if(!nd.got&&nd.k!=='bush'&&in2(nd)&&!pfBest(F,nd)&&!(F.pf||[]).some(b=>b.tg===nd))return{k:'node',nd,txt:'CHOP BY HAND'.replace('CHOP',nd.k==='rock'?'MINE':'CHOP')};
 for(const dm of F.domes)if(!SW.fl[dm.flag]&&in2(dm,22))return{k:'info',txt:'LOOK',msg:"IRON DOME · by order of KING BIBI. 'Temporary.' It has been temporary for years."};
 if(louPetOK()&&!fAim(F).tg)return{k:'louie',txt:'PET LOUIE'}; /* last: he must never take A from a throw */
 return null}
function fTalk(F,who,lines,after){F.dlg={who,lines,i:0,after}}
function fTrainer(F,np){const q=np.team.map(([sp,lv])=>wMakeMon(sp,lv));
 BT={mode:'trainer',tn:np,gym:-1,queue:q.slice(1),aiIx:SW.party.findIndex(m=>m.hp>0)};if(BT.aiIx<0)BT.aiIx=0;
 BT.foe=q[0];const isNew=!SW.seen[BT.foe.sp];SW.seen[BT.foe.sp]=1;wSetupBattle();
 BT.log=[{txt:np.who+' sent out '+BT.foe.sp+'!'}];if(isNew)BT.log.push({txt:'NEW! '+BT.foe.sp+' was added to the Field Guide.'});BT.after='menu';swSnd(330,.15,220)}
function fChallenge(F,np){if(!SW.party.some(m=>m.hp>0)){fTalk(F,np.who,['You have no buddy fit to battle. Rest at Sunkeep first.']);return}
 fTalk(F,np.who,np.pre,()=>wEngage(np.who+(np.boss?' — THE KING':''),()=>fTrainer(F,np)))}
function fTravel(to,from){if(!FMAPS[to]&&to!=='BASE')return;const s=wSector(to);
 if(s&&SW.badges.length<s.req){swSay('The road to '+s.n+' is closed — it needs '+s.req+' Sigil'+(s.req>1?'s':'')+'.',2.6);swSnd(140,.09);
  P3.x-=W4.fld.dir[0]*10;P3.y-=W4.fld.dir[1]*10;return}
 W4.from=from;wEnterSector(to);state='g4world'}
function fUpdate(dt){const F=W4.fld,sec=wSector(W4.sector);
 SW.playT+=dt;W4.prodT+=dt;if(W4.prodT>=25){W4.prodT=0;wProdTick()}
 if(W4.grace>0)W4.grace-=dt;W4.swingCd=Math.max(0,(W4.swingCd||0)-dt);W4.stamT=(W4.stamT||0)+dt;
 if(SW.stam<100&&W4.stamT>1)SW.stam=Math.min(100,SW.stam+7*dt);
 for(const nd of W4.nodes)if(nd.shake>0)nd.shake-=dt;
 for(const g2 of F.gates)if(g2.shake>0)g2.shake-=dt;
 if(SW.quest<5)wQuestTick();
 if(W4.banner&&W4.banner.t>0)W4.banner.t-=dt;if(W4.msgT>0)W4.msgT-=dt;
 for(const f of W4.floats)f.t-=dt;W4.floats=W4.floats.filter(f=>f.t>0);
 W4.dayT=(W4.dayT||0)+dt;if(W4.dayT>=300){W4.dayT-=300;SW.day=(SW.day||1)+1;swSave()}
 if(wDark()>.5&&SW.lessons&&!SW.lessons.night){SW.lessons.night=1;swSay('Night falls. Wild buddies grow bolder out there.',2.6);swSave()}
 F.t0+=dt;if(F.got){F.got.t-=dt;if(F.got.t<=0)F.got=null}
 fSync(F);
 if(F.dlg){if(pressed('a')||pressed('b')){F.dlg.i++;swSnd(660,.04);if(F.dlg.i>=F.dlg.lines.length){const fn=F.dlg.after;F.dlg=null;if(fn)fn()}}return}
 if(F.spot){const sp2=F.spot,np=sp2.np;sp2.t+=dt;
  if(sp2.t>.6){const dx=P3.x-np.x,dy=P3.y-np.y,d=Math.hypot(dx,dy);
   if(d>20){np.x+=dx/d*70*dt;np.y+=dy/d*70*dt;np.mv=true}else{np.mv=false;F.spot=null;fChallenge(F,np)}}
  return}
 if(F.hop){const hp=F.hop;hp.t+=dt;const k=Math.min(1,hp.t/.28);P3.y=hp.sy+(hp.ty-hp.sy)*k;F.hopZ=Math.sin(k*Math.PI)*9;if(k>=1){F.hop=null;F.hopZ=0}
  fSquad(F,dt);return}
 /* move: eight ways, facing follows the last direction pressed */
 let mx=(keys.right?1:0)-(keys.left?1:0),my=(keys.down?1:0)-(keys.up?1:0);
 if(pressed('left'))F.dir=[-1,0];if(pressed('right'))F.dir=[1,0];if(pressed('up'))F.dir=[0,-1];if(pressed('down'))F.dir=[0,1];
 if(mx||my){if(!((F.dir[0]&&F.dir[0]===mx)||(F.dir[1]&&F.dir[1]===my)))F.dir=mx?[mx,0]:[0,my];
  P3.ax=F.dir[0];P3.ay=F.dir[1];P3.anim=(P3.anim||0)+dt*8;
  const l=Math.hypot(mx,my),sp=84,nx=P3.x+mx/l*sp*dt,ny=P3.y+my/l*sp*dt;
  if(my<0&&fTile(F,Math.floor(P3.x/FT),Math.floor((P3.y-9)/FT))==='-'){const ty=Math.floor((P3.y-9)/FT)-1;
   if(SW.gear&&SW.gear.rope&&fWalkTile(F,Math.floor(P3.x/FT),ty)){F.hop={t:0,sy:P3.y,ty:ty*FT+10};swSnd(520,.07,780);return}
   if(!(SW.gear&&SW.gear.rope)&&!(W4.msgT>0)){swSay('A ledge. With a CLIMBING ROPE from the bench you could get up here.',2.6)}}
  if(my>0&&fTile(F,Math.floor(P3.x/FT),Math.floor((P3.y+7)/FT))==='-'){const ty=Math.floor((P3.y+7)/FT)+1;
   if(fWalkTile(F,Math.floor(P3.x/FT),ty)){F.hop={t:0,sy:P3.y,ty:ty*FT+8};swSnd(440,.06,660);return}}
  const exAt=(x,y)=>{const e=F.exits.find(e2=>e2.tx===Math.floor(x/FT)&&e2.ty===Math.floor(y/FT));if(e&&wBarred(e.to)){if(!(W4.msgT>0))swSay(wBarredSay(e.to),3.4);return true}return!!(F.arrive&&e)}; /* just arrived: the way back is shut until you let go once */
  if(!fBox(F,nx,P3.y)&&!exAt(nx,P3.y))P3.x=nx;if(!fBox(F,P3.x,ny)&&!exAt(P3.x,ny))P3.y=ny}
 /* leaving by the edge of the map */
 /* an exit only fires once you have stepped away from where you came in: holding the stick across a border must not bounce you back */
 if(F.arrive&&(!(keys.up||keys.down||keys.left||keys.right)||Math.hypot(P3.x-F.arrive.x,P3.y-F.arrive.y)>48))F.arrive=null;
 if(!F.arrive){const tx=Math.floor(P3.x/FT),ty=Math.floor(P3.y/FT),ex=F.exits.find(e=>e.tx===tx&&e.ty===ty);if(ex){fTravel(ex.to,F.id);return}}
 /* trainers who have not battled you yet watch the road */
 if(W4.grace<=0)for(const np of F.npcs)if(np.team&&!SW.fl[np.fk]&&!np.boss){const dx=P3.x-np.x,dy=P3.y-np.y,al=dx*np.dir[0]+dy*np.dir[1],off=Math.abs(dx*np.dir[1]-dy*np.dir[0]);
  if(al>6&&al<FT*5.5&&off<11&&SW.quest>=3&&SW.party.some(m=>m.hp>0)){F.spot={np,t:0};swSnd(880,.1,1320);return}}
 /* wild buddies wander their grass */
 if(sec.table){for(const wd of W4.wilds){if((wd.lat&&wd.lat.length)||wd.cap||wd.tame){wd.mv=false;continue}wd.t-=dt;
   if(wd.t<=0){const gt=F.grass.filter(g2=>Math.abs(g2[0]*FT-wd.x)<70&&Math.abs(g2[1]*FT-wd.y)<70),pk=gt[(Math.random()*gt.length)|0];
    if(pk){wd.tx=pk[0]*FT+8;wd.ty=pk[1]*FT+10}wd.t=1.5+Math.random()*3}
   const dx=wd.tx-wd.x,dy=wd.ty-wd.y,d=Math.hypot(dx,dy);wd.mv=d>2;if(d>2){wd.x+=dx/d*16*dt;wd.y+=dy/d*16*dt;wd.fx=dx<0?-1:1}}
  if(W4.wildCd>0){W4.wildCd-=dt;if(W4.wildCd<=0&&W4.wilds.length<3&&F.grass.length)W4.wilds.push(fSpawnWild(F,sec))}}
 /* your lead buddy walks at your side */
 pfTick(F,dt);pfWildTick(F,dt);bgTick(F,dt);ewTick(F,dt);
 fSquad(F,dt);fItems(F,dt);fLouTick(F,dt);
 W4.near=fNear(F);
 if(pressed('a')&&W4.near&&!wTutNear(W4.near)){wTutHint();W4.near=null}
 if(pressed('a')&&W4.near){const n=W4.near;
  if(n.k==='bud'){F.buds.splice(F.buds.indexOf(n.b),1);const tn=TYPES[n.b.type].n;SW.buds[tn]=(SW.buds[tn]||0)+1;
   W4.floats.push({x:n.b.x,y:n.b.y-16,txt:tn+' SPROUT JOINS THE SQUAD!',t:1.6,c:'#7ee787'});swSnd(880,.06,1175);swSave()}
  else if(n.k==='spot')fFetch(F,n.sp);
  else if(n.k==='node')wNodeAct(n.nd);
  else if(n.k==='wild'){const wd=n.wd;W4.wilds.splice(W4.wilds.indexOf(wd),1);W4.wildCd=14;wEngage('WILD '+wd.sp+'!',()=>wStartWildAt(wd.sp,wd.lv))}
  else if(n.k==='alpha'){const al=n.al;if(!SW.party.some(m=>m.hp>0)){swSay('No buddy fit to battle.',1.6);return}
   wEngage('ALPHA '+al.sp+'!',()=>{wStartWildAt(al.sp,al.lv);BT.log.unshift({txt:'The ALPHA '+al.sp+' rears up — it is huge!'});
    BT.onEnd=(won,bt)=>{if(bt.foe.hp<=0||bt.orbOk){SW.fl[al.fk]=1;const i=F.alphas.indexOf(al);if(i>=0)F.alphas.splice(i,1);swSay('The alpha has the light again. Its treasure is unguarded!',3);alphaSigil(al.sp);swSave()}}})}
  else if(n.k==='npc'){const np=n.np;
   if(np.ask)wOpenAsk(np.who);
   else if(np.team&&!SW.fl[np.fk])fChallenge(F,np);
   else fTalk(F,np.who,[np.after||'...'])}
  else if(n.k==='gym'){gymTalk(sec)} /* v9.1: lodges talk; only Bottie's tower is a battle */
  else if(n.k==='louie')wLouTalk();
  else if(n.k==='road'){swSay(n.msg,3.6);swSnd(520,.04,660)}
  else if(n.k==='door')swSay(['Nobody home. A sprout waves from the window.','Locked. It smells like berry pie in there.','A note: GONE TO THE GYM. BACK NEVER.'][(F.t0*7|0)%3],2.2);
  else if(n.k==='sign'){const hurt=SW.party.some(m=>m.hp<wStats(m).max);for(const m of SW.party)m.hp=wStats(m).max;if(hurt){swSnd(880,.1,1175);for(let i=0;i<10;i++)W4.floats.push({x:P3.x+(Math.random()*30-15),y:P3.y-10-Math.random()*20,txt:'+',t:.8+Math.random()*.5,c:'#7ee787'});swSay('The Lantern light mends your buddies. Press A again to travel.',3);swSave();return} /* v8.8: a rest is its own moment; the map opens on the next press */W4.mapRO=0;swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}
  else if(n.k==='info'){swSay(n.msg,2.6);swSnd(660,.05,880)}
  return}
 fCommand(F,dt);
 if(pressed('start')){swSel=0;state='g4pause'}}
/* squad orders, shared by the field and Sunkeep: SELECT picks the kind, B throws, hold B whistles */
function fCommand(F,dt){if(F.manT>0)F.manT-=dt;
 if(pressed('sel')&&W4.fld){const a=fAim(F),wd=a.kind==='wild'&&a.tg;if(wd&&wTutStage()&&!SCOFF){wTutHint()}else if(wd&&SW.quest>=3&&!wd.cap&&!(wd.lat&&wd.lat.length)&&Math.hypot(wd.x-P3.x,wd.y-P3.y)<64&&SW.party.some(m=>m.hp>0)){W4.wilds.splice(W4.wilds.indexOf(wd),1);W4.wildCd=14;wEngage('WILD '+wd.sp+'!',()=>wStartWildAt(wd.sp,wd.lv));return}}
 if(pressed('sel')){let i=SW.selType;for(let n=0;n<TYPES.length;n++){i=(i+1)%TYPES.length;if(F.sq.some(s=>s.type===i))break}
  SW.selType=i;F.manT=4;swSnd(660,.06,990);W4.floats.push({x:P3.x,y:P3.y-20,txt:TYPES[i].n+' SPROUTS UP NEXT',t:1.2,c:TYPES[i].l})}
 if(!keys.a&&F.aT>8)F.aT=0;
 if(pressed('a')&&!W4.near&&wTutStage()&&!fAim(F).tg){W4.tutOff=1;const raw=fAim(F);W4.tutOff=0;if(raw.tg){wTutHint();F.aT=9}} /* v9.8: something Erin hasn't shown you yet */
 if(keys.a&&!W4.near&&!(F.aT>8)){if(pressed('a')){fThrow(F);F.aT=.26}else{F.aT=(F.aT||0)-dt;if(F.aT<=0){fThrow(F,true);F.aT=.2}}}
 if(keys.b){F.bHold=(F.bHold||0)+dt;const wr=Math.min(84,14+F.bHold*150);F.whistle=wr;if(((F.bHold*10)|0)%3===0)swSnd(900+wr*9,.03);
  for(const s of F.sq)if(s.st!=='follow'&&s.st!=='fly'&&s.st!=='ret'&&Math.hypot(s.x-P3.x,s.y-P3.y)<wr){fDrop(F,s);s.st='ret'}
  if(F.pf)pfRecall(F,wr)}
 else{F.bHold=0;F.whistle=0}}
/* Sunkeep keeps its own walker and layout, but the squad, throwing, carrying and the way home all run on the field engine */
function fBaseBuild(){const w=Math.ceil(WW/FT),h=Math.ceil((W4.wh||520)/FT),F={id:'BASE',base:1,w,h,t:[],items:[],gates:[],sites:[],buds:[],npcs:[],exits:[],sq:[],alphas:[],domes:[],doors:[],grass:[],gym:null,start:{x:240,y:100},bl:{},t0:0,dir:[0,1],bio:FBIO.MEADOW,cv:null,dist:null};
 for(let y=0;y<h;y++)F.t.push(new Array(w).fill('.'));fFlow(F);fSync(F,true);return F}
function fBaseTick(dt){const F=W4.bf;if(!F)return;if(P3.ax||P3.ay)F.dir=[P3.ax,P3.ay];
 F.ft=(F.ft||0)-dt;if(F.ft<=0){F.ft=2;fFlow(F)}
 if(F.got){F.got.t-=dt;if(F.got.t<=0)F.got=null}
 fSync(F);pfTick(F,dt);fSquad(F,dt);fItems(F,dt);wkTick(dt);scConTick(dt);plTick(dt);
 for(const nd of W4.nodes)if(nd.got&&nd.k!=='bush'){nd.rg=(nd.rg||0)+dt;if(nd.rg>=(nd.k==='tree'?75:90)){nd.got=false;nd.hp=nd.max;nd.rg=0;nd.wkBy=null;for(let i=0;i<8;i++)W4.floats.push({x:nd.x+(Math.random()*16-8),y:nd.y-4-Math.random()*16,txt:'*',t:.5+Math.random()*.5,c:'#a0e888'});if(!SW.lessons.regrow){SW.lessons.regrow=1;swSay('Trees and rocks at Sunkeep grow back. Your buddies will keep at it.',3)}}} /* Sunkeep's grove and stones come back */wCastTick(dt);bwTick(dt);seedGrow(dt);fCommand(F,dt);wBaseEdge()}
function fSqDraw(F,front){for(const o of F.sq){if((o.y>P3.y)!==front)continue;drawBud({x:Math.round(o.x),y:Math.round(o.y)+2,type:o.type,stage:2,z:o.z||0,a:o.a,mv:!!o.mv,st:o.st==='idle'?'idle':'follow',fx:1});
  if(o.st==='work'&&o.mv)r('#ffffff',Math.round(o.x)+4,Math.round(o.y)-9,2,2)}
 if(!front){for(const it of F.items)fItemDraw(it);for(const b of F.buds)fBudDraw(b)}}
function fRing(F){if(F.sq.length||(F.pf&&F.pf.length)){const a=fAim(F),T=a.kind==='bwork'&&a.buddy?TYPES[wSp(a.buddy.m.sp).t[0]]:TYPES[a.need>=0?a.need:SW.selType],ph=((time*6)|0)%2,ax=Math.round(a.x),ay=Math.round(a.y);
  if(a.tg){const c=a.need>=0?'#e04838':T.l,rr=a.kind==='site'?14:11;
   for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){r('#14101e',ax+sx*(rr+ph)-2,ay-6+sy*(rr-2+ph)-2,5,5);r(c,ax+sx*(rr+ph)-1,ay-6+sy*(rr-2+ph)-1,3,1);r(c,ax+sx*(rr+ph)-(sx<0?1:-1),ay-6+sy*(rr-2+ph)-1,1,3)}
   for(let i=1;i<5;i++){const k=i/5,px=P3.x+(a.x-P3.x)*k,py=P3.y-6+(a.y-P3.y+6)*k-Math.sin(k*Math.PI)*12;r('rgba(255,255,255,.6)',Math.round(px),Math.round(py),1,1)}
   const lab=a.kind==='bwork'?'SEND '+a.buddy.m.sp+' · '+(a.tg.k==='tree'?'CHOP':a.tg.k==='rock'?'MINE':'GET '+a.tg.k.toUpperCase()):a.need>=0?'NEEDS '+TYPES[a.need].n:a.kind==='bug'?'CATCH '+a.tg.sp:a.kind==='wild'?(wBuddyFull()?'No room for more buddies · build a BUDDY BARN':pfCan(F,a.tg)?'CATCH · needs '+pfNeed(a.tg)+(Math.hypot(a.tg.x-P3.x,a.tg.y-P3.y)<64?(SW.quest>=3?' · SELECT: fight':''):' sprouts'):'Lv'+a.tg.lv+' · needs '+pfNeed(a.tg)+' sprouts · walk up to battle'):a.kind==='gate'?a.tg.n:a.kind==='site'?'BUILD BRIDGE':a.kind==='node'?'PICK BERRIES':(a.tg.k==='tre'?a.tg.n:a.tg.res.toUpperCase())+' · weight '+a.tg.w;
   F.aimLab=lab;F.aimNeed=a.need>=0}
  else{F.aimLab=null;r('rgba(255,255,255,.35)',ax-1,ay-1,2,2)}}else F.aimLab=null;
 if(F.whistle){g.strokeStyle='rgba(255,244,180,.8)';g.lineWidth=1;g.beginPath();g.arc(P3.x,P3.y-2,F.whistle,0,7);g.stroke();
  g.strokeStyle='rgba(255,244,180,.35)';g.beginPath();g.arc(P3.x,P3.y-2,F.whistle*.7,0,7);g.stroke()}}
if(SW.followers&&SW.followers.length){for(const ty of SW.followers)SW.buds[TYPES[ty].n]=(SW.buds[TYPES[ty].n]||0)+1;SW.followers=[];swSave()} /* old follower trains join the pouch */

/* ---------------- drawing ---------------- */
function fBake(F){const B=F.bio,cv=document.createElement('canvas');cv.width=F.w*FT;cv.height=F.h*FT;const b=cv.getContext('2d');if(!b||!b.fillRect){F.cv=cv;return}
 const R=(c,x,y,w,h)=>{b.fillStyle=c;b.fillRect(x,y,w,h)},rnd=wSeedRand(wSectorSeed(F.id)+3);
 const is=(x,y,set)=>set.includes(fTile(F,x,y));
 for(let ty=0;ty<F.h;ty++)for(let tx=0;tx<F.w;tx++){const c=F.t[ty][tx],x=tx*FT,y=ty*FT;
  {const nz=Math.sin(tx*.55+F.w)+Math.sin(ty*.7+1.3)+Math.sin((tx+ty)*.33),dkT=nz>.7;R(dkT?B.g2:B.g,x,y,FT,FT);for(let i=0;i<5;i++)R(dkT?B.g:B.g2,x+((rnd()*13)|0),y+((rnd()*14)|0),3,2);
   for(let i=0;i<2;i++){const ux=x+1+((rnd()*12)|0),uy=y+2+((rnd()*11)|0);R(B.g3,ux,uy+1,1,2);R(B.g3,ux+2,uy+1,1,2);R(B.a,ux+1,uy,1,2)}}
  if(c===','){for(let i=0;i<3;i++){const fx=x+2+((rnd()*11)|0),fy=y+3+((rnd()*10)|0);R(B.fl[i%B.fl.length],fx,fy,2,2);R('#ffffff',fx,fy,1,1);R(B.g3,fx,fy+2,1,2)}}
  else if(c===':'){R(B.p,x,y,FT,FT);for(let i=0;i<4;i++)R(B.p2,x+((rnd()*13)|0),y+((rnd()*14)|0),2,1);
   if(F.id==='TOWN'){R(B.p2,x,y+7,FT,1);R(B.p2,x+((ty%2)?4:11),y,1,7);R(B.p2,x+((ty%2)?11:4),y+8,1,8)}
   if(!is(tx,ty-1,':='))for(let i=0;i<FT;i+=2)R(B.g2,x+i,y,2,1+((rnd()*2)|0));
   if(!is(tx,ty+1,':='))for(let i=0;i<FT;i+=2)R(B.g2,x+i,y+FT-1-((rnd()*2)|0),2,2);
   if(!is(tx-1,ty,':='))for(let i=0;i<FT;i+=2)R(B.g2,x,y+i,1+((rnd()*2)|0),2);
   if(!is(tx+1,ty,':='))for(let i=0;i<FT;i+=2)R(B.g2,x+FT-1-((rnd()*2)|0),y+i,2,2);
   {const pe=B._pe||(B._pe=artShade(B.p2,-.28));if(!is(tx,ty-1,':='))R(pe,x,y+2,FT,1);if(!is(tx,ty+1,':='))R(pe,x,y+FT-3,FT,1);if(!is(tx-1,ty,':='))R(pe,x+2,y,1,FT);if(!is(tx+1,ty,':='))R(pe,x+FT-3,y,1,FT);if(rnd()<.3){const qx=x+4+((rnd()*8)|0),qy=y+4+((rnd()*8)|0);R(pe,qx,qy,3,2);R(artShade(B.p,.25),qx,qy,2,1)}}}
  else if(c==='"'){R(B.tg[0],x,y,FT,FT);for(let i=0;i<14;i++){const gx=x+((rnd()*15)|0),gy=y+((rnd()*12)|0),gh=3+((rnd()*3)|0);R(B.tg[1],gx,gy,1,gh);if(rnd()<.4)R(B.tg[2],gx,gy,1,1)}}
  else if(c==='~'||c==='='){R(B.w,x,y,FT,FT);for(let i=0;i<2;i++)R(B.w3,x+((rnd()*12)|0),y+3+((rnd()*10)|0),4,1);
   if(!is(tx,ty-1,'~=')){R(B.c3,x,y,FT,3);R(B.w3,x,y+3,FT,2)}
   if(!is(tx-1,ty,'~=')){R('#14101e',x,y,1,FT);R(B.w3,x+1,y,1,FT);R(B.w2,x+3,y+2,1,FT-4)}if(!is(tx+1,ty,'~=')){R('#14101e',x+FT-1,y,1,FT);R(B.w3,x+FT-2,y,1,FT);R(B.w2,x+FT-4,y+2,1,FT-4)}
   if(!is(tx,ty+1,'~=')){R('#14101e',x,y+FT-1,FT,1);R(B.w2,x+2,y+FT-4,FT-4,1)}if(!is(tx,ty-1,'~='))R(B.w2,x+2,y+7,FT-4,1);
   if(c==='='){const horiz=is(tx-1,ty,'=.,:"')&&is(tx+1,ty,'=.,:"');R('#5a3d22',x,y+(horiz?2:0),horiz?FT:FT,horiz?12:FT);
    if(horiz){for(let i=0;i<FT;i+=4){R('#a87948',x+i,y+2,3,12);R('#c49a62',x+i,y+2,3,2)}R('#6b4a2b',x,y+1,FT,2);R('#6b4a2b',x,y+13,FT,2)}
    else{for(let i=0;i<FT;i+=4){R('#a87948',x+2,y+i,12,3);R('#c49a62',x+2,y+i,12,1)}R('#6b4a2b',x+1,y,2,FT);R('#6b4a2b',x+13,y,2,FT)}}}
  else if(c==='#'){const face=!is(tx,ty+1,'#');
   if(face){R(B.c2,x,y,FT,FT);R(B.c,x,y,FT,5);R(B.a,x,y,FT,1);for(let i=0;i<4;i++)R(B.c3,x+1+i*4+((rnd()*2)|0),y+6+((rnd()*3)|0),1,5+((rnd()*4)|0));R(B.c3,x,y+FT-2,FT,2)}
   else{R(B.c,x,y,FT,FT);for(let i=0;i<3;i++)R(B.c2,x+((rnd()*13)|0),y+((rnd()*13)|0),2,1);if(!is(tx,ty-1,'#'))R(B.a,x,y,FT,1)}
   if(!is(tx-1,ty,'#'))R(B.c3,x,y,1,FT);if(!is(tx+1,ty,'#'))R(B.c3,x+FT-1,y,1,FT)}
  else if(c==='-'){R(B.c2,x,y+8,FT,6);R(B.c,x,y+7,FT,2);R(B.c3,x,y+13,FT,2);for(let i=0;i<4;i++)R(B.c3,x+2+i*4,y+10,1,3);R('rgba(0,0,0,.18)',x,y+15,FT,1)}
  else if(c==='T'){R('rgba(0,0,0,.24)',x-4,y+9,26,6);R('rgba(0,0,0,.24)',x+1,y+15,18,2)}}
 /* v9.2 look pass: soft edges. Tall grass ends in ragged tufts, ponds get round corners and reeds, roads get flowers */
 const gr=(x,y)=>'.,'.includes(fTile(F,x,y));
 for(let ty=0;ty<F.h;ty++)for(let tx=0;tx<F.w;tx++){const c=F.t[ty][tx],x=tx*FT,y=ty*FT;
  if(c==='"'){const T=B.tg;
   if(!is(tx,ty-1,'"')){for(let i=0;i<FT;i+=2){const d=(rnd()*4)|0;R(B.g,x+i,y,2,d);if(rnd()<.6){const h=2+((rnd()*4)|0);R(T[0],x+i,y-h+2,1,h);R(T[1],x+i,y-h+2,1,1)}}}
   if(!is(tx,ty+1,'"')){for(let i=0;i<FT;i+=2){const d=(rnd()*3)|0;R(B.g,x+i,y+FT-d,2,d);R('rgba(0,0,0,.14)',x+i,y+FT,2,1)}}
   if(!is(tx-1,ty,'"')){for(let i=0;i<FT;i+=2){const d=(rnd()*4)|0;R(B.g,x,y+i,d,2);if(rnd()<.5)R(T[1],x-1,y+i,1,2)}}
   if(!is(tx+1,ty,'"')){for(let i=0;i<FT;i+=2){const d=(rnd()*4)|0;R(B.g,x+FT-d,y+i,d,2);if(rnd()<.5)R(T[1],x+FT,y+i,1,2)}}}
  else if(c==='~'){const corner=(dx,dy)=>!is(tx+dx,ty,'~=')&&!is(tx,ty+dy,'~=')&&!is(tx+dx,ty+dy,'~='),put=(px,py)=>R(B.g,x+px,y+py,1,1);
   for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]])if(corner(dx,dy)){for(let k=0;k<4;k++)for(let j=0;j<4-k;j++){if(k+j>4)continue;const px=dx<0?j:FT-1-j,py=dy<0?k:FT-1-k;if(j<3-k||k===0&&j<3)put(px,py)}
     const ox=dx<0?0:FT-5,oy=dy<0?0:FT-5;R('#14101e',x+ox+(dx<0?3:1),y+oy+(dy<0?1:3),1,1);R('#14101e',x+ox+(dx<0?2:2),y+oy+(dy<0?2:2),1,1);R('#14101e',x+ox+(dx<0?1:3),y+oy+(dy<0?3:1),1,1)}}
  else if(gr(tx,ty)){
   /* reeds where grass meets water */
   for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]])if(fTile(F,tx+dx,ty+dy)==='~'&&rnd()<.55){const rx=x+(dx>0?FT-4:dx<0?2:3+((rnd()*9)|0)),ry=y+(dy>0?FT-7:dy<0?1:4+((rnd()*6)|0));R('#2e6a2a',rx,ry,1,6);R('#3f8a38',rx+2,ry+1,1,5);R('#8a5a28',rx,ry-1,1,2)}
   /* flowers along the road */
   if((is(tx-1,ty,':')||is(tx+1,ty,':')||is(tx,ty-1,':')||is(tx,ty+1,':'))&&rnd()<.35){const fx=x+2+((rnd()*11)|0),fy=y+3+((rnd()*10)|0),fc=B.fl[((rnd()*B.fl.length)|0)];R(B.g3,fx,fy+2,1,2);R(fc,fx-1,fy,3,2);R('#fff3b0',fx,fy,1,1)}}}
 castleBake(F,b,B,R,is); /* v9.5: Squire's castle */
 F.cv=cv}
function fTree(B,x,y,s){ /* x,y = base centre */
 const k=B.tree;
 if(k==='cactus'){r('#14101e',x-4,y-19,8,20);r(B.t1,x-3,y-18,6,18);r(B.t2,x-3,y-18,2,18);r('#14101e',x-9,y-13,5,8);r(B.t1,x-8,y-12,3,6);r(B.t1,x-6,y-8,3,2);r('#14101e',x+4,y-16,5,9);r(B.t1,x+5,y-15,3,7);r(B.t1,x+3,y-10,3,2);if(s%3===0)r('#f078c0',x-1,y-20,2,2);return}
 if(k==='palm'){r('#14101e',x-2,y-18,5,19);r(B.tk,x-1,y-17,3,17);for(let i=0;i<4;i++)r('#6b4a2b',x-1,y-15+i*4,3,1);
  r('#14101e',x-13,y-24,27,9);r(B.t1,x-12,y-21,10,4);r(B.t1,x+3,y-21,10,4);r(B.t2,x-9,y-23,8,3);r(B.t2,x+2,y-23,8,3);r(B.t3,x-6,y-24,5,2);r(B.t3,x+2,y-24,5,2);r(B.t1,x-13,y-18,3,2);r(B.t1,x+11,y-18,3,2);r('#8a5a28',x-1,y-19,3,3);return}
 if(k==='shroom'){r('#14101e',x-3,y-13,7,14);r(B.tk,x-2,y-12,5,12);r('#a8a0c0',x+1,y-12,2,12);
  r('#14101e',x-12,y-24,25,13);r(B.t1,x-11,y-18,23,6);r(B.t2,x-10,y-21,21,5);r(B.t2,x-7,y-23,15,3);r(B.t3,x-6,y-22,3,2);r(B.t3,x+3,y-19,3,2);r(B.t3,x-9,y-17,2,2);
  if(((time*1.5+s)|0)%2)r('#7ee7ff',x+7,y-22,1,1);return}
 if(k==='pine'){r('#14101e',x-2,y-5,5,6);r(B.tk,x-1,y-4,3,5);
  r('#14101e',x-11,y-12,23,9);r(B.t1,x-10,y-11,21,7);r('#14101e',x-8,y-19,17,9);r(B.t2,x-7,y-18,15,7);r('#14101e',x-5,y-26,11,9);r(B.t2,x-4,y-25,9,7);
  r(B.t3,x-8,y-11,6,2);r(B.t3,x+3,y-11,5,2);r(B.t3,x-5,y-18,5,2);r(B.t3,x-2,y-25,5,2);return}
 r('#14101e',x-3,y-9,7,10);r(B.tk,x-2,y-8,5,8);r('#8a6238',x-2,y-8,2,8);
 r('#14101e',x-12,y-23,25,13);r('#14101e',x-9,y-29,19,8);
 r(B.t1,x-11,y-22,23,11);r(B.t2,x-11,y-22,19,8);r(B.t2,x-8,y-28,17,7);r(B.t3,x-7,y-27,8,3);r(B.t3,x-9,y-21,5,2);r(B.t3,x+2,y-23,4,2);
 if(s%4===0){r('#e04838',x+4,y-18,2,2);r('#e04838',x-6,y-16,2,2)}}
function fChibi(x,y,L,dir,mv){const s=L.sc||1,P=(c,a,b,w,h)=>r(c,Math.round(x+a*s),Math.round(y+b*s),Math.ceil(w*s),Math.ceil(h*s));
 const st=mv?((time*8)|0)%2:0,bob=mv?0:Math.round(Math.sin(time*2+x*.3)*.6),K='#14101e',dk=L.top2||K;
 r('rgba(0,0,0,.25)',Math.round(x-6*s),y-1,Math.ceil(12*s),3);
 P(K,-6,-23+bob,12,19);P(K,-5,-5,10,5);
 P(L.legs,-4,-5,3,4-(st?1:0));P(L.legs,1,-5,3,4-(mv&&!st?1:0));P('#2a2228',-4,-1-(st?1:0),3,1);P('#2a2228',1,-1-(mv&&!st?1:0),3,1);
 P(L.top,-5,-12+bob,10,7);P(L.skin,-6,-11+bob,1,4);P(L.skin,5,-11+bob,1,4);P(K,-5,-6+bob,10,1);
 if(L.tie){P('#f4f0ea',-1,-12+bob,2,3);P(L.tie,-1,-11+bob,2,4)}
 if(L.big)P(L.hair,-7,-21+bob,14,6);
 P(L.skin,-5,-21+bob,10,9);P(L.hair,-5,-22+bob,10,dir[1]<0?9:3);
 if(dir[1]>=0){const e0=dir[0]<0?-4:dir[0]>0?0:-3,e1=dir[0]<0?-1:dir[0]>0?3:2;
  if(L.shades){P(K,e0-1,-17+bob,3,2);P(K,e1-1,-17+bob,3,2);P(K,-4,-17+bob,8,1)}
  else{P(K,e0,-17+bob,1,2);P(K,e1,-17+bob,1,2)}
  if(L.star){P(K,e0-1,-18+bob,3,1);P(K,e0,-19+bob,1,4)}
  if(L.beard)P(L.hair,-4,-14+bob,8,2)}
 if(L.cap){P(L.cap,-5,-23+bob,10,3);P(L.cap,dir[0]<0?-8:dir[0]>0?4:-5,-21+bob,dir[0]?4:10,1)}
 if(L.helm){P(L.helm,-6,-23+bob,12,4);P('#2e3a20',-6,-20+bob,12,1)}
 if(L.crown){P('#b07808',-5,-25+bob,10,3);P('#ffd94d',-5,-26+bob,2,4);P('#ffd94d',-1,-27+bob,2,5);P('#ffd94d',3,-26+bob,2,4);P('#ffd94d',-5,-24+bob,10,2);P('#e04838',-1,-24+bob,2,1)}}
function fProp(k,x,y){if(k==='truck'){ /* the Flow Pros truck, hood up */
  r('rgba(0,0,0,.25)',x-2,y-2,44,5);r('#14101e',x-1,y-23,42,22);r('#f4f0ea',x,y-22,26,16);r('#2a6ad0',x,y-12,26,3);r('#2a6ad0',x+26,y-16,14,10);r('#9ad0f4',x+28,y-15,8,5);
  r('#17141c',x+4,y-6,7,6);r('#17141c',x+28,y-6,7,6);r('#8a909c',x+6,y-4,3,2);r('#8a909c',x+30,y-4,3,2);
  text('FLOW',x+3,y-21,1,'#2a6ad0',null);text('PROS',x+3,y-11,1,'#ffffff',null);
  const sm=(time*1.2)%1;r('rgba(200,200,210,'+(.6-sm*.6).toFixed(2)+')',x+36,y-22-sm*12,3+sm*4,3+sm*4);
  r('#c8ccd4',x-8,y-3,3,4);r('#e04838',x-8,y-2,3,1);r('#c8ccd4',x-12,y-1,4,3)}
 else if(k==='yukon'){r('rgba(0,0,0,.25)',x-2,y-2,40,5);r('#14101e',x-1,y-20,38,19);r('#2c3242',x,y-19,36,13);r('#9ad0f4',x+3,y-17,9,5);r('#9ad0f4',x+14,y-17,9,5);r('#9ad0f4',x+25,y-17,7,5);
  r('#4a5266',x,y-10,36,2);r('#17141c',x+4,y-6,7,6);r('#17141c',x+25,y-6,7,6);r('#ffd94d',x+34,y-10,2,2)}}
function fHouse(x,y,gymSec){ /* x,y = door centre */
 if(gymSec){const sec=gymSec,gl=WGYMS[wGymIx(sec)],gc=TYPES[wSp(gl.team[0][0]).t[0]].d,gx=x-32,gy=y-46;
  r('rgba(0,0,0,.22)',gx-4,gy+42,72,5);r('#14101e',gx-5,gy-5,74,48);
  r('#e8dcc0',gx,gy+8,64,34);r('#d0c0a0',gx,gy+36,64,6);r('#8a6a48',gx+3,gy+12,5,30);r('#8a6a48',gx+56,gy+12,5,30);
  r('#7a2e22',gx+12,gy-4,40,6);r('#8a3a2a',gx+4,gy+2,56,6);r('#9a4634',gx-4,gy+8,72,5);r('#5a241c',gx-4,gy+13,72,2);
  r(gc,gx+12,gy+16,4,16);r(gc,gx+48,gy+16,4,16);r('#ffffff',gx+12,gy+18,4,2);r('#ffffff',gx+48,gy+18,4,2);
  r('#ffd23f',gx+24,gy+22,16,20);r('#3a2a1c',gx+26,gy+24,12,18);r('#ffd94d',gx+35,gy+33,2,2);
  const lab=W4.sector==='PEAK'?"BOTTIE'S TOWER":gl.leader+"'S LODGE",lw=tw(lab,1)+8;r('#14101e',x-lw/2-1,gy+1,lw+2,12);r('#f8f4e0',x-lw/2,gy+2,lw,10);text(lab,x-lw/2+4,gy+3,1,'#7a2e22',null);return}
 const hx=x-24,hy=y-38;r('rgba(0,0,0,.22)',hx-2,hy+35,52,5);r('#14101e',hx-3,hy-3,54,40);
 r('#e8dcc0',hx,hy+12,48,24);r('#d0c0a0',hx,hy+31,48,5);
 r('#4a6ab0',hx+6,hy-2,36,6);r('#5a7ac0',hx+2,hy+3,44,5);r('#6a8ad0',hx-2,hy+8,52,5);r('#34508c',hx-2,hy+12,52,2);
 r('#8a6a48',hx+18,hy+20,12,16);r('#5a3d22',hx+20,hy+22,8,14);r('#ffd94d',hx+26,hy+29,1,2);
 r('#d0c0a0',hx+4,hy+17,10,10);r('#9ad0f4',hx+6,hy+19,6,6);r('#d0c0a0',hx+34,hy+17,10,10);r('#9ad0f4',hx+36,hy+19,6,6);
 if(wDark()>.3){r('#ffd94d',hx+6,hy+19,6,6);r('#ffd94d',hx+36,hy+19,6,6)}}
function fFort(x,y){ /* x,y = bottom centre of the gate */
 const w=128,h=58,X=x-w/2,Y=y-h,fl=.5+.5*Math.sin(time*3);
 r('rgba(0,0,0,.3)',X-2,y-2,w+4,6);r('#14101e',X-2,Y+8,w+4,h-6);
 r('#5c6675',X,Y+10,w,h-10);r('#7c8698',X,Y+10,w,3);for(let i=0;i<8;i++)for(let j=0;j<4;j++)r('#4c5466',X+((j%2)*8)+i*16,Y+18+j*10,15,1);
 for(let i=0;i<8;i++){r('#14101e',X+i*16+1,Y+3,12,9);r('#7c8698',X+i*16+2,Y+4,10,8);r('#98a0b0',X+i*16+2,Y+4,10,2)}
 for(const tx of [X-4,X+w-20]){r('#14101e',tx-1,Y-13,26,h+13);r('#6a7284',tx,Y-12,24,h+12);r('#98a0b0',tx,Y-12,24,3);r('#14101e',tx+8,Y+2,8,12);r('#ffd94d',tx+9,Y+3,6,10);
  r('#14101e',tx+3,Y-30,18,19);r('#1e2c5a',tx+4,Y-29,16,6);r('#f4f0ea',tx+4,Y-23,16,5);r('#1e2c5a',tx+4,Y-18,16,6);r('#58a0f0',tx+10,Y-22,4,3)}
 r('#14101e',x-15,y-31,30,31);r('#2a2416',x-13,y-29,26,29);r('#3c3424',x-13,y-29,26,3);for(let i=0;i<5;i++)r('#17141c',x-11+i*5,y-25,2,25);
 g.globalAlpha=.25+.2*fl;r('#58a0f0',X+2,Y-6,w-4,4);g.globalAlpha=1;
 const lab='KING BIBI',lw=tw(lab,1)+8;r('#14101e',x-lw/2-1,y-45,lw+2,12);r('#ffd94d',x-lw/2,y-44,lw,10);text(lab,x-lw/2+4,y-43,1,'#1e2c5a',null)}
function fGate(g2){const x=Math.round(g2.x+(g2.shake>0?Math.sin(time*60)*1.5:0)),y=Math.round(g2.y),T=TYPES[g2.type];
 r('rgba(0,0,0,.25)',x-8,y+2,16,3);
 if(g2.c==='x'){r('#14101e',x-9,y-13,18,17);r('#7c8698',x-8,y-8,9,11);r('#98a0b0',x-8,y-8,9,3);r('#6a7284',x+1,y-12,7,15);r('#98a0b0',x+1,y-12,7,3);r('#dce2ea',x-6,y-7,3,1);r('#4c5466',x-3,y-1,2,3);r('#4c5466',x+4,y-5,1,4)}
 else if(g2.c==='f'){for(let i=0;i<4;i++){const h=9+((time*9+i*3)|0)%5,fx=x-8+i*4;r('#e2541e',fx,y+2-h,4,h);r('#ffb040',fx+1,y+3-h*.7,2,h*.7);r('#fff3b0',fx+1,y,2,2)}r('#4a2c1e',x-8,y+1,16,3)}
 else if(g2.c==='v'){r('#14101e',x-9,y-14,18,18);r('#286028',x-8,y-13,16,16);for(let i=0;i<5;i++){r('#58c048',x-7+i*3,y-12+((i*5)%9),2,7);r('#b0f090',x-7+i*3,y-12+((i*5)%9),1,2)}r('#e04838',x-4,y-6,2,2);r('#e04838',x+3,y-10,2,2)}
 else if(g2.c==='z'){r('#14101e',x-9,y-16,5,19);r('#14101e',x+4,y-16,5,19);r('#806008',x-8,y-15,3,17);r('#806008',x+5,y-15,3,17);r('#f0d020',x-8,y-15,3,3);r('#f0d020',x+5,y-15,3,3);
  for(let i=0;i<3;i++){const zy=y-12+i*5,ph=((time*16+i)|0)%2;r('#fff8a0',x-5,zy+ph,4,1);r('#ffffff',x-1,zy+1-ph,3,1);r('#fff8a0',x+2,zy+ph,3,1)}}
 else{r('#14101e',x-7,y-13,14,17);r('#8a6a42',x-6,y-8,12,11);r('#6b4a2b',x-6,y-2,12,5);r('#a08050',x-4,y-12,8,5);r('#c8b070',x-2,y-13,4,2);r('#4a3520',x-1,y-5,2,4);
  if(((time*2)|0)%2)r('#7fd0e8',x+5,y-14,1,2)}
 /* which sprout it wants, like a signpost */
 const by=y-22+Math.round(Math.sin(time*3)*1);r('#14101e',x-4,by-1,8,8);r(T.d,x-3,by,6,6);r(T.c,x-2,by+1,4,4);r(T.l,x-2,by+1,2,1);
 if(g2.hp<g2.max){r('#00000088',x-9,y+6,18,3);r('#7ee787',x-8,y+7,Math.round(16*Math.max(0,g2.hp)/g2.max),1)}}
function fItemDraw(it){const x=Math.round(it.x),y=Math.round(it.y)-(it.car.length&&it.moving?3+((time*8)|0)%2:0);
 r('rgba(0,0,0,.25)',Math.round(it.x)-6,Math.round(it.y)+2,12,3);
 if(it.k==='pel'){if(it.res==='wood'){r('#14101e',x-7,y-6,14,9);r('#8a5a2c',x-6,y-5,12,7);r('#c49a62',x-6,y-5,3,7);r('#a87948',x-5,y-3,1,3);r('#6b4a2b',x-1,y-5,1,7)}
  else if(it.res==='stone'){r('#14101e',x-6,y-7,12,10);r('#98a0b0',x-5,y-6,10,8);r('#dce2ea',x-4,y-6,5,2);r('#4c5466',x+1,y-1,3,2)}
  else{r('#14101e',x-4,y-7,8,9);r('#c93a2e',x-3,y-5,6,6);r('#f0786a',x-2,y-4,2,2);r('#58c048',x-1,y-7,3,2)}}
 else{const pl=((time*3)|0)%2,v=it.ix%3;r('#14101e',x-7,y-11,14,14);
  if(v===0){r('#ffd23f',x-6,y-7,12,9);r('#fff3b0',x-6,y-7,12,2);r('#b07808',x-6,y-1,12,3);r('#ffd23f',x-6,y-10,3,3);r('#ffd23f',x-1,y-10,3,3);r('#ffd23f',x+4,y-10,2,3);r('#e04838',x-1,y-5,2,2)}
  else if(v===1){r('#8a909c',x-6,y-10,12,12);r('#c8ccd4',x-5,y-9,5,5);r('#48a0f0',x-2,y-6,5,5);r('#b0e0f8',x-1,y-5,2,2);r('#5c6675',x+3,y-10,3,4)}
  else{r('#a05ab0',x-6,y-9,12,11);r('#e090f0',x-5,y-8,4,3);r('#ffd94d',x-1,y-4,3,3);r('#70347e',x-6,y,12,2)}
  if(pl){r('#ffffff',x+6,y-13,1,3);r('#ffffff',x+5,y-12,3,1)}else{r('#fff3b0',x-9,y-6,1,3);r('#fff3b0',x-10,y-5,3,1)}}
 if(it.car.length||it.guard){const st=fStr(it),ok=st>=it.w,lab=it.block?'NO WAY HOME':st+'/'+it.w;
  const lw=tw(lab,1)+4;r(ok&&!it.block?'#1d5a2a':'#5a1d1d',x-lw/2,y-23,lw,9);text(lab,x-lw/2+2,y-22,1,'#ffffff',null)}}
function fDraw(){const F=W4.fld,B=F.bio,sec=wSector(W4.sector),mw=F.w*FT,mh=F.h*FT;
 const cx=mw<=W?(mw-W)/2:Math.max(0,Math.min(mw-W,(W4.scene||P3).x-W/2)),cy=mh<=H?(mh-H)/2:Math.max(-30,Math.min(mh-H+16,(W4.scene||P3).y-H/2-4)); /* v9.2: the top row and its exits scroll clear of the HUD */
 W4.cam={x:cx,y:cy};
 r(B.t1,0,0,W,H);g.save();g.translate(-Math.round(cx),-Math.round(cy));
 if(!F.cv)fBake(F);if(F.cv&&F.cv.width)g.drawImage(F.cv,0,0);
 const x0=Math.max(0,Math.floor(cx/FT)-1),x1=Math.min(F.w-1,Math.ceil((cx+W)/FT)+1),y0=Math.max(0,Math.floor(cy/FT)-1),y1=Math.min(F.h-1,Math.ceil((cy+H)/FT)+2);
 const D=[];
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const c=F.t[ty][tx],x=tx*FT,y=ty*FT;
  if(c==='~'){const ph=((time*2+tx*1.7+ty*2.3)|0)%4;if(ph<2){r(B.w2,x+3+ph*5,y+5+((tx*7+ty*3)%6),4,1);if(F.id==='WASTES'&&ph===0)r('#fff3b0',x+8,y+9,2,2)}}
  else if(c==='T')D.push([y+13,0,tx,ty])}
 /* flat things under everyone */
 for(const s of F.sites)if(!s.done){const k=1-s.hp/s.max;for(const [tx,ty] of s.tiles){const x=tx*FT,y=ty*FT;
   r('#6b4a2b',x+1,y+1,2,14);r('#6b4a2b',x+13,y+1,2,14);r('#c8b070',x+2,y+3,12,1);r('#c8b070',x+2,y+12,12,1);
   const n=Math.round(k*4);for(let i=0;i<n;i++)r('#a87948',x+2+i*3,y+4,2,8)}
  if(((time*2)|0)%2)text('!',Math.round(s.x)-1,Math.round(s.y)-14,1,'#ffd94d','#14101e');
  if(s.hp<s.max){r('#00000088',s.x-12,s.y+9,24,3);r('#7ee787',s.x-11,s.y+10,Math.round(22*(1-s.hp/s.max)),1)}}
 for(const ex of F.exits){const ph=((time*3)|0)%2,dx=ex.tx<=0?-1:ex.tx>=F.w-1?1:0,dy=ex.ty<=0?-1:ex.ty>=F.h-1?1:0;
  r('#fff3b0',Math.round(ex.x-1+dx*ph*2),Math.round(ex.y-3+dy*ph*2),3,3)}
 /* everything standing, sorted by feet */
 for(const nd of W4.nodes)if(!nd.got)D.push([nd.y+4,1,nd]);
 for(const g2 of F.gates)if(!g2.open)D.push([g2.y+3,2,g2]);
 for(const dm of F.domes)if(!SW.fl[dm.flag])D.push([dm.y+3,3,dm]);
 for(const it of F.items)D.push([it.y+2,4,it]);
 for(const b of F.buds)D.push([b.y,5,b]);
 for(const wd of W4.wilds)D.push([wd.y,6,wd]);
 for(const al of F.alphas)D.push([al.y+4,7,al]);
 for(const np of F.npcs)D.push([np.y,8,np]);
 for(const s of F.sq)D.push([s.y,9,s]);
 if(F.gym)D.push([F.gym.y-6,10,F.gym]);
 for(const dr of F.doors)D.push([dr.y-6,11,dr]);
 D.push([F.start.y-2,12]);
 if(F.fort)D.push([F.fort.y-4,15,F.fort]);
 for(const pb of F.pf||[])D.push([pb.y,13,pb]);
 D.push([P3.y+1,14]);for(const sp of F.spots)D.push([sp.y+3,17,sp]);D.push([lou.y+5,16]);for(const bg of W4.bugs||[])D.push([bg.y+1,18,bg]);if(W4.ew&&W4.ewFor===F)D.push([W4.ew.y,19]);
 D.sort((a,b)=>a[0]-b[0]);
 const feet=(x,y)=>{if(fTile(F,Math.floor(x/FT),Math.floor(y/FT))==='"'){const sx=Math.round(x);r(B.tg[1],sx-5,y-3,1,5);r(B.tg[2],sx-5,y-3,1,1);r(B.tg[1],sx-1,y-2,1,4);r(B.tg[1],sx+3,y-4,1,6);r(B.tg[2],sx+3,y-4,1,1);r(B.tg[0],sx-6,y+1,13,2)}};
 for(const d of D){const k=d[1],o=d[2];
  if(k===0)fTree(B,o*FT+8+((o*7+d[3]*5)%5)-2,d[3]*FT+14,o*7+d[3]*13);
  else if(k===1)wDrawNode(o);
  else if(k===2)fGate(o);
  else if(k===3){const x=Math.round(o.x),y=Math.round(o.y),fl=.5+.5*Math.sin(time*5+o.x);
   r('#14101e',x-8,y-22,16,26);g.globalAlpha=.35+.25*fl;r('#58a0f0',x-8,y-20,16,22);g.globalAlpha=1;r('#b0e0f8',x-8,y-20+((time*20)|0)%20,16,1);
   r('#5c6675',x-8,y-22,3,26);r('#5c6675',x+5,y-22,3,26);r('#c8ccd4',x-8,y-22,3,3);r('#c8ccd4',x+5,y-22,3,3);r('#ffd94d',x-1,y-12,2,2);r('#ffd94d',x-2,y-11,4,1)}
  else if(k===4)fItemDraw(o);
  else if(k===5)fBudDraw(o);
  else if(k===6)pfWildDraw(o,feet);
  else if(k===7){const spr=wSp(o.sp)._spr,w2=Math.round(spr.ow*1.5),h2=Math.round(spr.oh*1.5),X=Math.round(o.x),Y=Math.round(o.y)+4,br=Math.round(Math.sin(time*1.6)*1.5);
   r('rgba(0,0,0,.28)',X-14,Y-2,28,5);const aLit=typeof WASIG!=='undefined'&&WASIG[o.sp]&&SW.badges.includes(WASIG[o.sp].n),aImg=aLit?spr.ol:(wDarkImg(spr)||spr.ol); /* v9.4: an alpha is darkest of all until it has the light */
   if(!aLit){g.globalAlpha=.16+.08*Math.sin(time*2.4);r('#5a1a6a',X-w2/2-6,Y-h2-4,w2+12,h2+8);g.globalAlpha=1}g.drawImage(aImg,X-w2/2,Y-h2+2-br,w2,h2+br);if(!aLit){wDarkHaze(X-6,Y,h2,7);wDarkHaze(X+6,Y,h2,11)}
   r('#14101e',X-13,Y-h2-9,26,9);text('ALPHA',X-tw('ALPHA',1)/2,Y-h2-8,1,'#ff7a6a',null);
   const zz=((time*1.5)|0)%3;text('z',X+10+zz*2,Y-h2+4-zz*3,1,'#d8e8c8',null)}
  else if(k===8){const done=!o.team||SW.fl[o.fk];if(o.prop)fProp(o.prop,o.hx+12,o.hy+2);
   if(FLOOK[o.who])fChibi(Math.round(o.x),Math.round(o.y)+2,FLOOK[o.who],o.dir||[0,1],!!o.mv);

   if(F.spot&&F.spot.np===o&&F.spot.t<.7)text('!',Math.round(o.x)-2,Math.round(o.y)-34,2,'#ffd94d','#14101e');
   else if(!done&&!o.ask&&((time*2)|0)%2)r('#e04838',Math.round(o.x)-1,Math.round(o.y)-30*(FLOOK[o.who]&&FLOOK[o.who].sc||1),3,3);
   if(Math.hypot(P3.x-o.x,P3.y-o.y)<44&&!F.dlg){const lw=tw(o.who,1)+4;r('rgba(10,14,8,.6)',o.x-lw/2,o.y+5,lw,9);text(o.who,Math.round(o.x-lw/2+2),Math.round(o.y+6),1,o.boss?'#ffd94d':'#ffe8b0',null)}}
  else if(k===9){drawBud({x:Math.round(o.x),y:Math.round(o.y)+2,type:o.type,stage:2,z:o.z||0,a:o.a,mv:!!o.mv,st:o.st==='idle'?'idle':'follow',fx:1});
   if(o.st==='work'&&o.mv)r('#ffffff',Math.round(o.x)+4,Math.round(o.y)-9,2,2);if(!(o.z>0))feet(o.x,o.y+2)}
  else if(k===10)fHouse(o.x,o.y,sec);
  else if(k===11)fHouse(o.x,o.y);
  else if(k===12){const gx=Math.round(F.start.x),gy=Math.round(F.start.y)+2,fl=.5+.5*Math.sin(time*2.4);
   r('rgba(0,0,0,.25)',gx-13,gy-1,26,5);r('#14101e',gx-12,gy-6,24,9);r('#8a909c',gx-11,gy-5,22,7);r('#c8ccd4',gx-11,gy-5,22,2);r('#5c6675',gx-11,gy,22,2);
   r('#14101e',gx-3,gy-30,6,26);r('#6b4a2b',gx-2,gy-29,4,25);r('#8a6238',gx-2,gy-29,1,25);
   r('#14101e',gx-7,gy-41,14,13);g.globalAlpha=.25+.2*fl;r('#ffd94d',gx-12,gy-46,24,22);g.globalAlpha=1;
   r('#3c2a16',gx-6,gy-40,12,11);r('#ffd94d',gx-4,gy-38,8,7);r('#fff3b0',gx-2,gy-37,4,5);r('#ffffff',gx-1,gy-36,2,2);r('#7a2e22',gx-7,gy-42,14,3)}
  else if(k===13)pfDraw(o,feet);
  else if(k===16)fLouDraw();
  else if(k===17)fSpotDraw(o);
  else if(k===18)bgDraw(o);
  else if(k===19)ewDraw();
  else if(k===15)fFort(o.x,o.y);
  else if(k===14){const hz=F.hopZ||0;wHero(P3.x,P3.y-hz);if(!hz)feet(P3.x,P3.y+2)}}
 for(const nd of W4.nodes)if(!nd.got&&nd.hp<nd.max){r('#00000088',nd.x-11,nd.y-30,22,4);r('#7ee787',nd.x-10,nd.y-29,Math.round(20*Math.max(0,nd.hp)/nd.max),2)}
 if(!F.dlg&&!F.spot)fRing(F);
 for(const f of W4.floats){const ft=wFit(f.txt,200),fx2=Math.max(cx+tw(ft,1)/2+3,Math.min(cx+W-tw(ft,1)/2-3,f.x));
  text(ft,Math.round(fx2-tw(ft,1)/2),Math.round(f.y-(1.4-Math.min(1.4,f.t))*8),1,f.c,'#14101e')}
 /* weather motes */
 {const sid=F.id,pm=sid==='PEAK'?10:sid==='SHORE'?0:6;for(let i=0;i<pm;i++){const sd=i*47.3;
   if(sid==='PEAK')r('rgba(255,255,255,.9)',Math.round(cx+((sd*7+time*14*(1+i%3))%(W+16))-8),Math.round(cy+((sd*3+time*22)%(H+10))-5),1,1);
   else if(sid==='GLOOM')r('rgba(140,240,225,.6)',Math.round(cx+(sd*5)%W+Math.sin(time+i)*4),Math.round(cy+H-((time*8+i*53)%H)),1,1);
   else if(sid==='WASTES')r('rgba(240,200,140,.55)',Math.round(cx+((sd*11+time*52)%(W+30))-15),Math.round(cy+(sd*5)%H),3,1);
   else r(i%2?'rgba(240,184,216,.8)':'rgba(255,255,255,.75)',Math.round(cx+((sd*9+time*11)%(W+14))-7+Math.sin(time*1.4+i*2)*3),Math.round(cy+((sd*4+time*6)%H)),2,1)}}
 const dk=Math.max(wDark()*.5,F.id==='GLOOM'?.34:0);
 if(dk>0){r('rgba(10,12,48,'+dk.toFixed(3)+')',cx,cy,W,H);
  const lg=(x,y,rr,a)=>{g.globalAlpha=a;r('#ffd98a',x-rr,y-rr*.6,rr*2,rr*1.2);r('#ffd98a',x-rr*.6,y-rr,rr*1.2,rr*2);g.globalAlpha=1};
  lg(Math.round(F.start.x),Math.round(F.start.y)-30,20,dk*.22);lg(Math.round(P3.x),Math.round(P3.y)-6,22,dk*.14)}
 fBarrierDraw(F);louBubDraw();g.restore();
 fxAtmos();wHud();
 if(F.got){const a=Math.min(1,F.got.t*2);g.globalAlpha=a;r('#14101e',20,H/2-26,200,44);r('#ffd23f',20,H/2-26,200,2);r('#ffd23f',20,H/2+16,200,2);
  ctext('TREASURE HOME!',H/2-21,1,'#ffd94d',null);ctext(wFit(F.got.n,190),H/2-9,2,'#ffffff',null);ctext(F.got.txt,H/2+6,1,'#7ee787',null);g.globalAlpha=1}
 if(F.dlg){const dl=F.dlg,L=FLOOK[dl.who];uiSay(dl.who,dl.lines[dl.i].replace(dl.who+': ',''),null,'A  NEXT',L&&L.crown?'#1e2c5a':null)}}
