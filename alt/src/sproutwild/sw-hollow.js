/* ================================================================
   CROOKED HOLLOW (v7.0): a second wild area before the gym
   Old woods east of the Meadow, reached by the east road. Wilds are
   Lv4-7, so it is where a team grows up before facing the Ranger.
   Two creatures from valley lore live only here:
     MELONKIN  the melon-headed folk of the Hollow woods
     PYTHORN   the Peninsula Python, loose since a 1944 circus wreck;
               it sleeps on the Hollow's treasure as the area's guardian.
   ================================================================ */
const WHOLLOWART={
MELONKIN(D){const sk='#e8e0c8',gn='#58b848',dg='#2e7d32';
 D.l(10,20.5,10,22.6,2,sk);D.l(14,20.5,14,22.6,2,sk);D.l(8.8,17.5,7,19.6,1.4,sk);D.l(15.2,17.5,17,19.6,1.4,sk);D.b(12,18,3.6,3.2,sk);
 D.b(12,9.2,8.4,7.2,gn);D.l(8,3.8,7,14.4,1,dg);D.l(12,2.4,12,16,1,dg);D.l(16,3.8,17,14.4,1,dg);D.l(12,2.2,13.2,.6,1.1,'#6a4a2a');
 D.e(11,11,4.6,3.4,'#f0ead8');D.eye(9.2,10.6,1.5);D.eye(13,10.6,1.5);D.r(10.2,13,2,.6,'#6a3a30')},
PYTHORN(D){const gn='#5a8a3a',lt='#7aaa50',yl='#e8d878';
 D.l(20,18.5,22.8,14.4,1.8,gn);D.b(13,19.2,8.4,3.6,gn);D.e(13,20.6,5.8,1.1,yl);D.b(12,15.4,6.6,3,lt);D.e(12,16.4,4.4,.9,yl);
 D.p([[8,13.4],[9,11.2],[10,13.4]],'#3a5a22');D.p([[12,12.8],[13,10.6],[14,12.8]],'#3a5a22');D.p([[16,13.6],[17,11.6],[18,13.6]],'#3a5a22');
 D.l(9,14,7,7.4,3.4,gn);D.l(8.6,13.4,6.9,8.6,1.2,yl);D.b(6.6,6,3.9,2.9,gn);D.e(4.2,6.8,1.9,1.2,lt);
 D.eye(5.9,5.3,1.4);D.eye(8.6,5.2,1.1);D.l(3,7.2,1.4,8,.6,'#e04838');D.l(1.4,8,.6,7.4,.5,'#e04838')}};
{const fb=["..ss..",".sggs.","sggggs",".sggs."],mk=(o,c)=>{o.spr=fb.slice();o.pal={s:'#14101e',g:c};o._old=SWSPR(o.spr,o.pal);o._spr=swbMake(WHOLLOWART[o.id]);WSPECIES.push(o)};
 mk({id:'MELONKIN',t:[4,5],hp:30,atk:10,def:9,spd:13,catch:.45,work:{PLANTING:1,FORTUNE:1},learn:[[1,'tackle'],[1,'vinelash'],[5,'sporepuff'],[8,'fortunefang'],[13,'headbutt']],
  d:'A melon-headed sprite of the old woods. Shy. Nobody goes looking for it twice.'},'#58b848');
 mk({id:'PYTHORN',t:[4],hp:46,atk:15,def:12,spd:9,catch:.25,work:{PLANTING:2},learn:[[1,'headbutt'],[1,'vinelash'],[1,'rocktoss'],[10,'sporepuff'],[14,'thornstorm']],
  d:'It slipped off a circus train in 1944 and never stopped growing.'},'#5a8a3a')}
WSECTORS.splice(2,0,{id:'HOLLOW',n:'CROOKED HOLLOW',sub:'Old woods east of the Meadow. Something is watching.',req:1,lv:[4,7],gym:-1,pal:{g:'#4a8a48',g2:'#3e7a40',a:'#8cc86a'},
 table:[['MELONKIN',5],['FERNFANG',2],['ZIPWIG',2],['PEBBLIT',2],['DRIZZLET',1]]});
WSECSUB.HOLLOW='Old woods. Wilds Lv4 to 7.';
FBIO.HOLLOW=Object.assign({},FBIO.MEADOW,{g:'#4a8a48',g2:'#3e7a40',g3:'#2e5e34',a:'#8cc86a',p:'#bfa67a',p2:'#a48a62',t1:'#1f5230',t2:'#2f7a3c',t3:'#62b858'});
FSPOTS.HOLLOW=[[26,12,'ore'],[11,16,'fiber'],[12,12,'fiber'],[20,7,'ore']];
FMAPS.HOLLOW={rows:["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "T..W....\"\"\"\"\"\"\"\"....W.....R..T", "T......\"\"\"\"\"\"\"\"\"\"......R.....T", "T..W...\"\"\"\"\"\"\"\"\"\"..W.....1.A.T", "T.......\"\"\"\"\"\"\"\"........,....T", "T...,.........::.............T", "T.W...........::....W...W....T", "T.............::.............T", "T....B........::......\"\"\"\"\"\".T", "m:::::::::::::S:::::::\"\"\"\"\"\"pT", "m:::::::::::::::..B...\"\"\"\"\"\"\"T", "T.....W.......::......\"\"\"\"\"\".T", "T.............::.....,.......T", "T..~~~~~~.....::........R....T", "T.~~~~~~~~....:::::::::::::..T", "T.~~~~~~~~..............W.:..T", "T..~~~~~~....W....\"\"\"\"\"...:..T", "T.........,......\"\"\"\"\"\"\"..q..T", "T...W.....B......\"\"\"\"\"\"\"...R.T", "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
 key:{m:{k:'exit',to:'MEADOW'},p:{k:'bud',type:5},q:{k:'bud',type:2},
  1:{k:'tre',n:'CIRCUS TRUNK',w:4,petal:60,res:['ingot',2]},A:{k:'alpha',sp:'PYTHORN',lv:11,guards:'1'}}};
/* the Meadow's east road now leads here */
FMAPS.MEADOW.key.j={k:'exit',to:'HOLLOW'};
{const R=FMAPS.MEADOW.rows;for(const y of [9,10]){R[y]=R[y].slice(0,R[y].length-1)+'j'}R[9]=R[9].slice(0,20)+':'.repeat(R[9].length-21)+'j'}
