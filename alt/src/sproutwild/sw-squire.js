/* ================================================================
   SQUIRE'S WOODS (v8.3): the Meadow's south road no longer dead-ends
   Old woods south of the Meadow, after the Chagrin valley's Squire's
   Castle: a stone gatehouse Feargus Squire built in the 1890s for a
   castle he never finished. People say his wife still walks the
   ruin at night with a lantern. Wilds Lv6-9, a river to bridge, and
   the ruin behind thorn vines only LEAF sprouts can clear.
     LANTERNWISP  the lady with the lantern, a shy light sprite
     STONESQUIRE  the gatehouse itself, awake; it sleeps on the ruin's
                  treasure as the area's alpha
   ================================================================ */
const WSQUIREART={
LANTERNWISP(D){const bd='#e6e0f6',sh='#c8bfe6';
 D.p([[7.5,13],[9,21.5],[11,18.5],[12.5,22],[14,18.5],[16,21],[16.5,13]],sh);
 D.b(12,11.5,6.2,6.6,bd);D.e(12,15.2,4.6,2.2,sh);
 D.eye(10.2,10.6,1.35);D.eye(13.8,10.6,1.35);D.e(12,13.4,1,.55,'#9a7ab8');
 D.l(16.5,13.5,19.4,10.2,.9,'#6a4a2a');D.e(20.4,12.2,3.2,3.2,'rgba(255,224,110,.35)');
 D.r(19.1,10.4,2.6,3.6,'#3a3040');D.r(19.6,11,1.6,2.4,'#ffd94d');D.r(19.3,9.6,2.2,.9,'#3a3040')},
STONESQUIRE(D){const st='#8c909c',lt='#a8acb6',dk='#5e626e';
 D.r(6.5,19.5,3.4,3.5,dk);D.r(14.1,19.5,3.4,3.5,dk);
 D.r(5.5,9,13,11.5,st);D.r(5.5,9,13,1.2,lt);D.r(8,12.5,3,2,dk);D.r(13,15,3,2,dk);
 D.r(6.5,2.6,11,7,lt);D.r(6.5,1,2.4,2,lt);D.r(10.8,1,2.4,2,lt);D.r(15.1,1,2.4,2,lt);
 D.r(7.5,5,9,1.8,'#2a2a34');D.r(9,5.3,1.6,1.1,'#ffd94d');D.r(13.4,5.3,1.6,1.1,'#ffd94d');
 D.e(9,20.2,3.2,1.1,'#58b848');D.e(15.5,9.3,2.4,.9,'#58b848');
 D.r(16.5,11,4.6,6.4,'#c0a050');D.r(17.4,12,2.8,4.4,'#8a6a2a')}};
{const fb=["..ss..",".sggs.","sggggs",".sggs."],mk=(o,c)=>{o.spr=fb.slice();o.pal={s:'#14101e',g:c};o._old=SWSPR(o.spr,o.pal);o._spr=swbMake(WSQUIREART[o.id]);WSPECIES.push(o)};
 mk({id:'LANTERNWISP',t:[0,5],hp:32,atk:12,def:9,spd:15,catch:.4,work:{KINDLING:1,FORTUNE:1},learn:[[1,'tackle'],[1,'embershot'],[6,'quicknip'],[9,'fortunefang'],[14,'flameburst']],
  d:'A pale light that walks the old gatehouse at night. Some say she is still waiting for the castle to be finished.'},'#e6e0f6');
 mk({id:'STONESQUIRE',t:[1],hp:54,atk:15,def:17,spd:6,catch:.22,work:{QUARRY:2},learn:[[1,'tackle'],[1,'rocktoss'],[1,'headbutt'],[12,'boulderbash']],
  d:'The gatehouse of a castle that was never built. It got tired of waiting and stood up.'},'#8c909c')}
WSECTORS.splice(3,0,{id:'SQUIRE',n:"SQUIRE'S WOODS",sub:'An old stone gatehouse. A light moves in it at night.',req:0,lv:[6,9],gym:-1,pal:{g:'#5a8a4a',g2:'#4c7a40',a:'#e8d890'},
 table:[['LANTERNWISP',5],['PEBBLIT',3],['DRIZZLET',2],['FERNFANG',2],['MELONKIN',1]]});
WSECSUB.SQUIRE='Old stones in the woods. Wilds Lv6 to 9.';
FBIO.SQUIRE=Object.assign({},FBIO.MEADOW,{g:'#5a8a4a',g2:'#4c7a40',g3:'#365e34',a:'#e8d890',p:'#c4ae84',p2:'#a8926a',t1:'#24502e',t2:'#357a40',t3:'#68b05a'});
FSPOTS.SQUIRE=[[21,11,'ore'],[3,4,'fiber'],[27,14,'ore'],[4,16,'fiber']];
/* 30 x 20. k: back to the Meadow. #: the ruin's walls; v: thorn vines (LEAF sprouts); b: river to bridge */
FMAPS.SQUIRE={rows:[
"TTTTTTTTTTTTTTkkTTTTTTTTTTTTTT",
"T..W..........::...#########.T",
"T.\"\"\"\"\"\"\".....::...#.A.1..R#.T",
"T.\"\"\"\"\"\"\"\"....::...#.......#WT",
"T.\"\"\"\"\"\"\"\"..W.::...#..,..q.#.T",
"T..\"\"\"\"\"\".....::...#R......#.T",
"T....,......S.::...#.......#.T",
"T..W..........::...#.......#.T",
"T....B........::...####v####.T",
"T~~~~~~~~~::::::::::::::::...T",
"T.......~~....::........,..W.T",
"T..W....~~....::.............T",
"T.......~~....::....\"\"\"\"\"\"\"..T",
"T.::::::bb::::::...\"\"\"\"\"\"\"\"..T",
"T.\"\"\"\"..~~....::...\"\"\"\"\"\"\"\"..T",
"T\"\"\"\"\"..~~..W.::....\"\"\"\"\"\"...T",
"T\"\"\"\"\"..~~....::..........R..T",
"T.\"\"\"...~~..B.::...W....B....T",
"T....W..~~....::........,....T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
 key:{k:{k:'exit',to:'MEADOW'},q:{k:'bud',type:2},
  1:{k:'tre',n:"SQUIRE'S LANTERN",w:4,petal:80,res:['ingot',3]},A:{k:'alpha',sp:'STONESQUIRE',lv:12,guards:'1'}}};
/* the Meadow's south road now leads here */
FMAPS.MEADOW.key.k={k:'exit',to:'SQUIRE'};
{const R=FMAPS.MEADOW.rows,y=R.length-1;R[y]=R[y].slice(0,17)+'kk'+R[y].slice(19)}
/* the first visit, one voice at a time: the area banner, then Louie, then the note */
function sqArrive(F){if(!F||F.id!=='SQUIRE'||SW.lessons.squire)return;
 if((W4.banner&&W4.banner.t>0)||W4.scene)return;F.sqT=(F.sqT||0)+1/60;
 if(!F.sqLou){F.sqLou=1;F.sqT=0;louSay('SNIFF... OLD STONES.',2.2);return}
 if(F.sqT>2.4){SW.lessons.squire=1;swSay("A gatehouse for a castle nobody finished. THORN VINES: LEAF sprouts clear them.",3.6)}}
/* v8.4: near the Meadow's south road (after the first catch, before your first visit) Louie points the way */
function sqHint(F){if(!F||F.id!=='MEADOW'||SW.quest<3||(SW.visited&&SW.visited.SQUIRE)||SW.lessons.sqHint||W4.scene||(W4.banner&&W4.banner.t>0))return;
 if(P3.y>17*16&&Math.abs(P3.x-(17*16+16))<70){SW.lessons.sqHint=1;louSay('SNIFF! OLD STONES, SOUTH!',2.8);swSnd(600,.05,420)}}
