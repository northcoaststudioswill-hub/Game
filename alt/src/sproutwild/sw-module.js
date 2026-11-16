/* ================================================================
   CARTRIDGE 3: SPROUTWILD — a GBA-style creature collector in the
   Sprouts universe. Catch wildsprouts, build Sunkeep Base with their
   labor, earn the four Sigils from keeper gyms. Sectors, not an open
   world — the Lantern loads one valley pocket at a time.
   Save key: 'sproutwild-v1'. Never touches Sprouts' or Rootdeep's.
   Controls: D-pad move · A interact/confirm · B cancel/run-back ·
   START menu. In battle: A advances text.
   ================================================================ */
let SW=null,SW_HAD_QUEST=false;
const SWDEF=()=>({party:[],box:[],badges:[],res:{wood:0,stone:0,petal:30,berry:2,ingot:0},
 buds:{EMBER:0,PEB:0,DEW:0,ZIP:0,LEAF:0,LUCKY:0},orbs:0,tonics:1,buildings:[],seen:{},caught:{},uidN:1,intro:0,sector:'BASE',gymDone:{},playT:0,
 baseLv:1,hearts:0,heartsTotal:0,keeper:'WILL',visited:{},talkN:{},quest:0,unlocked:{},champion:0,tutSeen:0,tools:{axe:0,pick:0},stam:100,tended:0,tendDone:false,day:1,asks:{},askDone:0,treasures:0,lessons:{},crew:[],trioSeeded:0,bottieSeen:0,bottieBeat:0,tendStage:0,plucked:0,trioPlucked:[],followers:[],cmdMode:'buddy'});
try{const s=localStorage.getItem('sproutwild-v1');
 if(s){const j=JSON.parse(s);SW=Object.assign(SWDEF(),j);SW_HAD_QUEST=('quest' in j)}
 else SW=SWDEF();}
catch(e){SW=SWDEF()}
if(!SW.res)SW.res=SWDEF().res; if(!SW.buildings)SW.buildings=[];
if(!SW.baseLv)SW.baseLv=1; if(SW.hearts===undefined)SW.hearts=0; if(SW.heartsTotal===undefined)SW.heartsTotal=0;
if(!SW.keeper)SW.keeper='WILL'; if(!SW.visited)SW.visited={}; if(!SW.talkN)SW.talkN={};if(!SW.buds)SW.buds={EMBER:2,PEB:1,DEW:1,ZIP:0,LEAF:2,LUCKY:0};
 if(!SW.tools)SW.tools={axe:0,pick:0}; if(SW.stam==null)SW.stam=100;
 if(SW.tended==null)SW.tended=0; if(SW.tendDone==null)SW.tendDone=SW.quest>=2||!!(SW.party&&SW.party.length);
 if(!SW.asks)SW.asks={}; if(!SW.day)SW.day=1; if(SW.askDone==null)SW.askDone=0; if(SW.treasures==null)SW.treasures=0; if(!SW.lessons)SW.lessons={};
 if(!SW.crew)SW.crew=[];
 if(SW.tendStage==null)SW.tendStage=SW.tendDone?4:0;if(SW.plucked==null)SW.plucked=0;if(!SW.trioPlucked)SW.trioPlucked=[];if(!SW.followers)SW.followers=[];if(!SW.cmdMode)SW.cmdMode='buddy';
 for(const b of SW.buildings)b.workers=[]; /* buddies are battle-only now: base jobs belong to sprouts */
 /* sprouts are EARNED, never given: no starter crew grant (v4.0) */
if(!SW.unlocked)SW.unlocked={}; if(SW.champion===undefined)SW.champion=0;
try{if(!localStorage.getItem('sw-mig3')){for(const b of SW.buildings){b.gx+=6;b.gy+=4}localStorage.setItem('sw-mig3','1')}}catch(e){}
if(SW.intro){const hasCot=SW.buildings.some(b=>b.k==='cottage'),hasBed=SW.buildings.some(b=>b.k==='bed'),
 wildCaught=Object.keys(SW.caught||{}).length>1,talked=(SW.talkN&&SW.talkN.LOUIE)>0||SW.quest>0;
 SW.quest=(SW.badges.length||SW.champion||(hasCot&&hasBed&&wildCaught))?5:
  !talked?0:!SW.party.length?1:!wildCaught?2:!hasCot?3:!hasBed?4:5}
function swSave(){try{localStorage.setItem((WSLOTS&&WSLOTS[wSlot])||'sproutwild-v1',JSON.stringify(SW))}catch(e){}}
let W4={sector:'BASE',nodes:[],prodT:0,msg:'',msgT:0,stepAcc:0,grassT:0,grace:0,placeK:null,cursor:{x:5,y:3},assignB:-1,partyMode:'view',gymQueue:null,dayT:40,askWho:null,treasure:null};
function swSay(s,t){W4.msg=s;W4.msgT=t||2.2}
function swSnd(f,d,f2){snd(f||660,d||.06,f2)}
/* ---------- sprites: same outline pipeline as the other carts ---------- */
const SWSPR=(rows,pal)=>{const img=mk(rows,pal),hit=mkW(rows),sil=mkSil(rows,'#14101e');
 return{img,hit,ol:mkOl(img,sil),hol:mkOl(hit,sil),w:rows[0].length,h:rows.length,ow:rows[0].length+2,oh:rows.length+2};};
/* ---------- SWCHR: Sproutwild character art (v4.0; Sprouts' CHR untouched) ---------- */
const SWCHR={
 WILL:SWSPR(['....ssssssss....','..sshhhhhhhhss..','.shHHhhhhhhHHhs.','.shhhhhhhhhhhhs.','.sffffffffffffs.','.sfkfffffffkffs.','.sffffffffffffs.','..sffffffffffs..','...sffffffffs...','..ssttttttttss..','.sfttttttttttfs.','.sftTttttttTffs.','..sTttttttttTs..','...tttttttttt...','...spppppppps...','...sppssppps....','...sppssppps....','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"h": "#6b4423", "H": "#8a5f30", "f": "#e8b088", "F": "#c98a5e", "t": "#2e8f86", "T": "#1f6a63", "l": "#57b8ac", "p": "#2c3242", "w": "#e8e4da", "k": "#141018"}),
 ERIN:SWSPR(['....ssssssss....','..sshhhhhhhhss..','.shHHhhhhhhHHhs.','.shhhhhhhhhhhhs.','.shffffffffffhs.','.shfkfffffkffhs.','.shffffffffffhs.','.shffffffffffhs.','..shffffffffhs..','..ssttttttttss..','.sfttttttttttfs.','.sfTttttttttTfs.','..sTttttttttTs..','...tttttttttt...','...spppppppps...','...sppssppps....','...sppssppps....','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"h": "#b45a28", "H": "#d07c3a", "f": "#f0bc94", "F": "#d09a6e", "t": "#e8dcc0", "T": "#c4b294", "p": "#3a4a6a", "w": "#f0ece2", "k": "#141018"}),
 MARCUS:SWSPR(['....ssssssss....','..sshhhhhhhhss..','.shHhhhhhhhHHhs.','.shhhhhhhhhhhhs.','.sffffffffffffs.','.sfkfffffffkffs.','.sffffffffffffs.','..sffffffkkffs..','...sffffffffs...','..ssttttttttss..','.sfttwwwwwwttfs.','.sfttwwwwwwttfs.','..sTttttttttTs..','...tttttttttt...','...spppppppps...','...sppssppps....','...sppssppps....','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"h": "#1c1c22", "H": "#34343e", "f": "#d09a6e", "F": "#b07c4e", "t": "#26262e", "T": "#17171c", "w": "#e8e4da", "p": "#4a4a55", "k": "#141018"}),
 RANGER:SWSPR(['....ssssssss....','..ssccccccccss..','.sccccccccccccc.','.ssccccccccccss.','..sffffffffffs..','.sfkfffffffkffs.','.sffffffffffffs.','..sffffffffffs..','...sffffffffs...','..ssvvvvvvvvss..','.sfvttvvvvttvfs.','.sfvttvvvvttvfs.','..sVvvvvvvvvVs..','...vvvvvvvvvv...','...spppppppps...','...sppssppps....','...sppssppps....','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"c": "#3f7a34", "C": "#2f5c26", "f": "#e0a878", "F": "#c08454", "v": "#b89a68", "V": "#967c4e", "t": "#4a7a3e", "p": "#5a4632", "w": "#3a2e20", "k": "#141018"}),
 SCOUT:SWSPR(['....ssssssss....','..sshhhhhhhhss..','.shHHhhhhhhHHhs.','.shhhhhhhhhhhhs.','.shffffffffffhs.','.shfkfffffkffhs.','.shffffffffffhs.','..sffffffffffs..','..ssrrrrrrrrss..','..ssttttttttss..','.sfttttttttttfs.','.sfTttttttttTfs.','..sTttttttttTs..','...tttttttttt...','...spppppppps...','...sppssppps....','...sppssppps....','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"h": "#6a4a9e", "H": "#8668bc", "f": "#c89878", "F": "#a87c58", "r": "#d05848", "t": "#4a3a6e", "T": "#372a54", "p": "#2c3242", "w": "#e8e4da", "k": "#141018"}),
 PIP:SWSPR(['....ssssssss....','..ssccccccccss..','.sccccccccccccc.','..ssffffffffss..','.sfkfffffffkffs.','.sfffFffffFfffs.','.sffffffffffffs.','..sffffffffffs..','..ssttttttttss..','.sfttttttttttfs.','.sfTttttttttTfs.','..stttttttttts..','...spppppppps...','...sppssppps....','...sppssppps....','..sswwsswwss....'],{"c": "#f0c020", "C": "#d0a018", "f": "#f0bc94", "F": "#d09a6e", "t": "#f07830", "T": "#d05c1c", "p": "#3a6ab0", "w": "#f0ece2", "k": "#141018"}),
 ELDER:SWSPR(['....ssssssss....','..ssggggggggss..','.sggggggggggggs.','.sffffffffffffs.','.sfkfffffffkffs.','.sfggggggggggfs.','.sggggggggggggs.','.sgggGggggGgggs.','..sgggggggggs...','..ssrrrrrrrrssw.','.sfrrrrrrrrrfsw.','.sfRrrrrrrrrRsw.','..srrrrrrrrrrsw.','...rrrrrrrrrrsw.','...srrrrrrrrssw.','...srrrssrrsssw.','...srrrssrrsssw.','...srrrssrrsssw.','...srrrssrrsssw.','..sssssssssssw..'],{"g": "#c8c8ce", "G": "#a2a2ac", "f": "#d8a070", "F": "#bc8452", "r": "#7a5a3a", "R": "#5e442a", "w": "#8a6a48", "k": "#141018"}),
 BOTTIE:SWSPR(['......ssssssss......','....ssccccccccss....','...scLLccccccLLcs...','..scLccccccccccLcs..','..scvvvvvvvvvvvcs...','..scvbbvvvvbbvvcs...','..scvvvvvvvvvvvcs...','...scvvbbbbvvvcs....','...scvvbvvvbvcs.....','....scvvvvvvcs......','..nnssssssssssnn....','..nnsppppppppsnn....','..nnsppggggppsnn....','...nspppgeegppsn....','...nsppppggppsn.....','....sppppppppps.....','....sPPppppppPPs....','....sppppppppps.....','....sddddddddds.....','....sdddsddddds.....','....sdddsddddds.....','....sdddsddddds.....','...ssccssccsss......','....................'],{"c": "#c8ccd4", "C": "#8a909c", "L": "#eef0f4", "v": "#101018", "b": "#57b8ff", "n": "#14100c", "p": "#d4d8de", "P": "#9aa0aa", "g": "#f0d060", "e": "#58c048", "d": "#1c1c22", "k": "#141018"})};
SWCHR.ERIN={ol:CH.ERIN,ow:18,oh:21};SWCHR.MARCUS={ol:CH.MARCUS,ow:18,oh:21}; /* Will's call: the original Sprouts models for Erin + Marcus */
function wChar(who,x,y,w2){const cs=SWCHR[who];if(!cs)return;const h2=Math.round(w2*cs.oh/cs.ow);g.drawImage(cs.ol,Math.round(x-w2/2),Math.round(y-h2+2),w2,h2)}
/* ---------- tiny UI helpers (own prefix; carts share a scope) ---------- */
let swSel=0;
function swNav(n){if(pressed('down')){swSel=(swSel+1)%n;swSnd(520,.04)}if(pressed('up')){swSel=(swSel-1+n)%n;swSnd(520,.04)}return swSel}
function wGridNav(cols,n){let s=swSel;
 if(pressed('right'))s=(s+1)%n;
 else if(pressed('left'))s=(s-1+n)%n;
 else if(pressed('down')){s=swSel+cols;if(s>=n)s=swSel%cols}
 else if(pressed('up')){s=swSel-cols;if(s<0)s=(swSel%cols)+cols*Math.floor((n-1-(swSel%cols))/cols)}
 if(s!==swSel){swSel=s;swSnd(520,.04)}}
function swWrap(s,n){const words=String(s).split(' '),lines=[];let cur='';
 for(const w of words){if(tw(cur+' '+w,1)>n&&cur){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w}
 if(cur)lines.push(cur);return lines}
function swRows(items,sel,desc){const rh=items.length>10?11:items.length>6?13:16,y0=26;
 items.forEach((it,i)=>{const y=y0+i*rh,on=i===sel;
  r(on?'#f8e060':'#241c38',10,y,W-20,rh-2);r(on?'#fff3b0':'#2e2450',11,y+1,W-22,rh-4);
  const bw=it.b?tw(it.b,1):0,atxt=bw?wFit(it.a,Math.max(36,W-44-bw-10)):wFit(it.a,W-44);
  text(atxt,17,y+2,1,on?'#281c30':'#e8e4f5',null);
  if(it.b)text(it.b,10+W-27-bw,y+2,1,on?'#7a5a18':'#a89ec2',null);});
 if(desc){r('#0d0a18',8,H-34,W-16,22);
  swWrap(desc,214).slice(0,2).forEach((l,j)=>text(l,13,H-30+j*10,1,'#c8c0d8',null));}}
function swShell(title,sub){r('#14101c',0,0,W,H);r('#1d2b18',0,0,W,20);
 text(title,8,5,1,'#ffd94d',null);if(sub)text(sub,W-10-tw(sub,1),5,1,'#a8c898',null);
 r('#3a5a30',0,20,W,1)}
/* ---------- types & moves ---------- */
const WT=['EMBER','PEB','DEW','ZIP','LEAF','LUCKY'];
const WBEATS={0:[4,3],1:[3,0],2:[0,1],3:[2,4],4:[2,1],5:[]};
function wMult(atkT,defTypes){let m=1;for(const d of defTypes){
 if((WBEATS[atkT]||[]).includes(d))m*=1.6;else if((WBEATS[d]||[]).includes(atkT))m*=.625}return m}
const WMOVES={
 tackle:{n:'TACKLE',t:-1,p:35,acc:100,d:'A reliable body slam.'},
 headbutt:{n:'HEADBUTT',t:-1,p:50,acc:95,d:'All forehead, no regrets.'},
 quicknip:{n:'QUICK NIP',t:-1,p:30,acc:100,pri:1,d:'Strikes first. Small but sudden.'},
 warcry:{n:'WAR CRY',t:-1,p:0,acc:100,eff:'atkup',d:'Raise own ATTACK.'},
 shellup:{n:'SHELL UP',t:-1,p:0,acc:100,eff:'defup',d:'Raise own DEFENSE.'},
 embershot:{n:'EMBER JAB',t:0,p:40,acc:100,d:'A jab wreathed in sparks.'},
 flameburst:{n:'FLAME BURST',t:0,p:65,acc:90,d:'A rolling ball of fire.'},
 rocktoss:{n:'ROCK TOSS',t:1,p:45,acc:95,d:'Lobs a respectable boulder.'},
 boulderbash:{n:'BOULDER BASH',t:1,p:70,acc:85,d:'The whole hill, delivered.'},
 magmaburst:{n:'MAGMA BURST',t:0,p:100,acc:85,d:'A cap-sized eruption.'},
 tidalsurge:{n:'TIDAL SURGE',t:2,p:100,acc:85,d:'The tide, weaponized.'},
 thornstorm:{n:'THORNSTORM',t:4,p:100,acc:85,d:'The garden says no.'},
 bubblesnap:{n:'BUBBLE SNAP',t:2,p:40,acc:100,d:'A bubble pops like a whip.'},
 tideslam:{n:'TIDE SLAM',t:2,p:65,acc:90,d:'A wave with opinions.'},
 sparknip:{n:'SPARK NIP',t:3,p:40,acc:100,d:'A static-charged nibble.'},
 voltrush:{n:'VOLT RUSH',t:3,p:60,acc:95,d:'Becomes lightning, briefly.'},
 vinelash:{n:'VINE LASH',t:4,p:45,acc:100,d:'A vine that stings.'},
 sporepuff:{n:'SPORE PUFF',t:4,p:30,acc:95,eff:'atkdn',d:'Musty spores. Lowers foe ATTACK.'},
 fortunefang:{n:'FORTUNE FANG',t:5,p:45,acc:95,crit:1,d:'Crits often. Lucky teeth.'},
 luckystar:{n:'LUCKY STAR',t:5,p:55,acc:90,crit:1,d:'A star falls. It aims.'}};
/* ================================================================
   SPECIES — wild kin of the six sprout types. stats are bases;
   growth per level: HP +4, ATK +2, DEF +2, SPD +1.
   work: the Pal-style base skill (skill name -> level).
   ================================================================ */
const WSPECIES=[
 {id:'CINDERCAP',t:[0],hp:30,atk:12,def:10,spd:9,catch:.55,work:{KINDLING:1},
  learn:[[1,'tackle'],[1,'embershot'],[6,'warcry'],[10,'flameburst'],[14,'headbutt']],
  d:'A mushroom imp with a smoldering cap. Warms anything it sits on.',
  spr:[".........ss...yy........","........srrs.ywwy.......",".......srrrrs.yy........","......sroooors..........",".....srooccoors.........","....sroooooooors........","...sroocoooocoors.......","...sroooooooors.........","..srrfrrrrrrfrrs........","..sccccccccccccs........","..sckkccccckkcs.........","..sccccccccccccs........","...scckwwkcccs..........","....sbbbbbbbs...........","...fsbbbbbbbsf..........","...fsbbbbbbbsf..........","....sbbbbbbbs...........",".....ff..ff.............","....sffs.sffs...........","........................"],
  pal:{s:'#3a1428',r:'#c23b1e',o:'#f07830',y:'#f8d040',c:'#f8e8c8',b:'#e0b890',k:'#241018',f:'#a02818',w:'#ffffff'}},
 {id:'MAGMOSS',t:[0,4],hp:42,atk:13,def:14,spd:5,catch:.4,work:{KINDLING:1,PLANTING:1},
  learn:[[1,'tackle'],[1,'embershot'],[7,'vinelash'],[12,'flameburst'],[16,'shellup']],
  d:'A mossy boulder, somehow warm. Smells like a campfire.',
  spr:["......ssssss........","....ssggggggss......","...sgglggglggdgs....","..sgggggggddggggs...","..sgdgglgggggdggs...","...ssssssssssss.....","..srrrrrrrrrrrrs....",".srrrkrrrrrrrkrrs...",".srrrrrrrrrrrrrrs...",".srrorrrrrrrrorrs...",".sreeerrrrrreeerrs..","..srrrrrrrrrrrrs....","...ssssssssssss.....","....ss..ss..ss......","...sss..ss..sss.....","...................."],
  pal:{g:'#58c048',d:'#3a7d2e',l:'#8fd45e',r:'#9a6c48',e:'#75522f',o:'#f8a030',k:'#20202a',w:'#ffffff'}},
 {id:'PEBBLIT',t:[1],hp:34,atk:11,def:13,spd:8,catch:.55,work:{QUARRY:1},
  learn:[[1,'tackle'],[1,'rocktoss'],[6,'shellup'],[11,'headbutt'],[15,'boulderbash']],
  d:'A pebble pup. Fetches rocks. Is a rock. Conflicted but happy.',
  spr:["...ss........ss.....","..sggs......sggs....","..sgdgs....sgdgs....","...ssssssssssss.....","..sggggggggggggs....",".sgglggggggggddgs...",".sggggggggggggggs...",".sggkgggggggggkggs..",".sggggcccccgggggs...","..ssgcckkkccccgss...","....scccccccgs......","....sggggggggs......",".....sggggggs.......","......ssssss........",".....ss....ss.......","....ssss..ssss......"],
  pal:{g:'#98a0b0',d:'#6e7889',l:'#c3ccd9',c:'#e8ecf2',k:'#20202a',w:'#ffffff'}},
 {id:'BOULDERHOUND',t:[1],hp:44,atk:14,def:15,spd:6,catch:.35,work:{QUARRY:2},
  learn:[[1,'rocktoss'],[1,'headbutt'],[8,'shellup'],[13,'boulderbash'],[17,'warcry']],
  d:'Half hound, half hillside. Loyal to whoever feeds it gravel.',
  spr:["...ss........ss.....","..sggs......sggs....","..sgdgs....sgdgs....","...sssggggggssss....","..sgllggggggddgs....",".sgggggggggggggggs..",".sggddggggggddgggs..",".sggkgggggggggkggs..",".sggggcccccggggggs..","..ssgcckkkcccggss...","....srrrrrrrggs.....","....sggggggggs......","...sggggggggggs.....","...sggssssssggs.....","....ss..ss..ss......","...sss..ss..sss....."],
  pal:{g:'#7c8698',d:'#565f6e',l:'#aab4c4',c:'#dfe5ee',r:'#a33b2e',k:'#20202a',w:'#ffffff'}},
 {id:'DRIZZLET',t:[2],hp:28,atk:11,def:9,spd:11,catch:.55,work:{WATERING:1},
  learn:[[1,'tackle'],[1,'bubblesnap'],[6,'quicknip'],[11,'tideslam']],
  d:'A rain droplet that never landed. Perpetually delighted about it.',
  spr:[".....sls........sls.....","....sllbs......sblls....","....sbbbs......sbbbs....",".....sbs..ss....sbs.....","....sbbbbbbbbsbbs.......","...sbbbbbbbbbbbbbs......","...sbkbbbllbbbkbbbs....","...sbbbbbbppbbbbs.......","....sbbbbbbbbbs.........",".....swwwwwwws..........","....sbwwwwwwbs....sbls..","....sbwwwwwwbs...sbbbs..","....sbbbbbbbbs....sbs...",".....sbbbbbs............","....sbb...bbs...........","....sbs...sbs...........","...sdds...sdds..........","........................","........................","........................"],
  pal:{s:'#14283e',b:'#48a0f0',d:'#2a68b8',l:'#a8d8f8',w:'#eaf6ff',k:'#101c2c',p:'#f0a0b8'}},
 {id:'TIDEBUD',t:[2,4],hp:38,atk:13,def:12,spd:8,catch:.4,work:{WATERING:2,PLANTING:1},
  learn:[[1,'bubblesnap'],[1,'vinelash'],[8,'sporepuff'],[13,'tideslam'],[16,'shellup']],
  d:'A bud that photosynthesizes underwater. Ahead of its time.',
  spr:["......g..g..........",".....gg..gg.........","......gggg..........",".......ss...........","......slls..........",".....sllbbs.........","....sllbbbbbs.......","....slbbbbbbbs......","...sbbbbbbbbbbds....","...sbkbbbbbbkbds....","..gsbbbbbbbbbbdsg...","..ggsbbbbbbbbdsgg...","....sbbbccbbbds.....",".....ssbbbbss.......","......ssssss........","...................."],
  pal:{b:'#48a0f0',d:'#2b6cb8',l:'#9fd0ff',g:'#58c048',e:'#3a7d2e',c:'#d8f2fc',k:'#20202a',w:'#ffffff'}},
 {id:'ZIPWIG',t:[3],hp:26,atk:12,def:8,spd:14,catch:.5,work:{CHARGE:1},
  learn:[[1,'quicknip'],[1,'sparknip'],[7,'tackle'],[12,'voltrush']],
  d:'A beetle full of static. Do not pet it near water. Or at all.',
  spr:["....s........s......","....ss......ss......",".....s..ss..s.......","......ssssss........","...ssyyyyyyyyss.....","..syyyllllydddyys...","..syyyyyydyyyydds...",".syykyyyydyyykydys..",".syyyyyyydyyyyyyds..",".ssyyyyyydyyyyyss...","..s.syyyydyyys.s....","...s.s.ssss.s.s.....","....s.s....s.s......","....................","....................","...................."],
  pal:{y:'#f0d020',d:'#c8a410',l:'#ffe970',k:'#20202a',w:'#ffffff'}},
 {id:'VOLTHARE',t:[3],hp:36,atk:14,def:10,spd:15,catch:.35,work:{CHARGE:2},
  learn:[[1,'sparknip'],[1,'quicknip'],[9,'headbutt'],[14,'voltrush'],[18,'warcry']],
  d:'A hare that outruns its own thunder. The crack comes later.',
  spr:[".....yy....yy.......",".....yy....yy.......",".....ydy..ydy.......",".....ydy..ydy.......","......yyyyyy........","....ssyyyyyyss......","...syyylllyydys.....","...sykyyyyyykys.....","..syyyyyyyyyyyds....","..syyykcckyyyyds....","..syyyccccyyyyds....","...syccccccyds......","...syyyyyyyyss......","....syyyyyyys.......","....ss..yy.ss.......","...ssss....ssss....."],
  pal:{y:'#f0d020',d:'#c8a410',l:'#ffe970',c:'#fff6d8',k:'#20202a',w:'#ffffff'}},
 {id:'FERNFANG',t:[4],hp:32,atk:13,def:10,spd:11,catch:.5,work:{PLANTING:1},
  learn:[[1,'tackle'],[1,'vinelash'],[7,'sporepuff'],[12,'quicknip'],[15,'headbutt']],
  d:'A fern with fangs. Gardeners respect it. Fingers fear it.',
  spr:["...sggs........sggs.....","..sgllgs......sgllgs....","..sgglgssssssglgggs.....",".sggggggggggggggggs.....",".sgddgdgdgdgdgddgs.....","..sgggggggggggggs.......","...sgccccccccgs.........","...sgckcccckcgs.........","....scckkkkccs..........","....scccccccs....sgls...",".....sgggggs....sgggs...","....sgggggggs....sgs....","....sgggggggs...........",".....sggggs.............","....sgg..ggs............","....sgs..sgs............","...sdds...sdds..........","........................","........................","........................"],
  pal:{s:'#14301a',g:'#58c048',d:'#2f7a2e',l:'#a0e888',c:'#f0e8c8',k:'#0e1c10',w:'#ffffff'}},
 {id:'BLOOMBOAR',t:[4],hp:46,atk:15,def:13,spd:6,catch:.35,work:{PLANTING:2},
  learn:[[1,'vinelash'],[1,'headbutt'],[8,'shellup'],[14,'sporepuff'],[17,'warcry']],
  d:'A boar wearing a whole flower bed. Pollinators follow it like royalty.',
  spr:[".....ssssssss.......","...ssggggggggss.....","..sggpglggplgpggs...","..sgggggggggggggs...",".sgggggggggggggggs..",".sgggggggggggggdgs..",".sggkgggggggggkgdgs.","..sgggccccccgggdgs..","..sggckcccckcggdgs..","...sggccccccgggs....","...sgggwwwwgggs.....","....sggggggggs......","....sggggggggs......",".....ss.ss.ss.......","....sss.ss.sss......","...................."],
  pal:{g:'#7a5230',d:'#5a3a20',l:'#9a6c40',p:'#f078c0',w:'#ffffff',k:'#20202a',c:'#c89878'}},
 {id:'CLOVERIMP',t:[5],hp:30,atk:13,def:10,spd:12,catch:.45,work:{FORTUNE:1},
  learn:[[1,'quicknip'],[1,'fortunefang'],[8,'warcry'],[13,'luckystar']],
  d:'It finds lost things. It lost them in the first place, but still.',
  spr:[".......g.g..........","......ggggg.........",".......ggg..........","....ssssssssss......","..sspllppppddpss....",".spllppppppdddps....",".spkppppppppkpdps...",".spppppppppppddps...","..sppppwwppppdps....","..sppppppppppdss....","...sppppppppps......","...spp.dd.pps.......","....spppppps........",".....ssssss.........","....ss....ss........","...ssss..ssss......."],
  pal:{p:'#f078c0',d:'#c05296',l:'#ffb0dc',g:'#58c048',e:'#3a7d2e',k:'#20202a',w:'#ffffff'}},
 {id:'AURICORN',t:[5],hp:40,atk:15,def:12,spd:13,catch:.22,work:{FORTUNE:2},
  learn:[[1,'fortunefang'],[1,'quicknip'],[10,'luckystar'],[15,'headbutt'],[19,'warcry']],
  d:'A golden foal seen at dusk, mostly by people who needed to see it.',
  spr:["........y...........","........yy..........",".......syy..........","....ssssssss........","...sddlyyllls.......","..sddlloooools......","..sdokooooookos.....","..sdowooooowods.....",".ssdooooooooodss....",".s.sooooooooos.s....","....soo..ooos.......","....ss....ss........","....ss....ss........","...ssss..ssss.......","....................","...................."],
  pal:{o:'#f8d878',d:'#d8a848',l:'#fff0b0',y:'#ffd94d',k:'#20202a',w:'#ffffff'}},
 {id:'EMBERCAP',t:[0],hp:52,atk:19,def:14,spd:11,catch:.15,work:{KINDLING:2},
  learn:[[1,'tackle'],[1,'embershot'],[6,'warcry'],[10,'flameburst'],[14,'headbutt'],[17,'magmaburst']],
  d:'The cap is a tiny volcano now. It naps in the kiln.',
  spr:["........syyys...........",".......sywwwys..........","......ssyyyyss..........",".....srrrrrrrrs.........","....srrylrrryrrs........","...srrylrrrrlrrys.......","...srrrrrrrrrrrrs.......","..srrryrrrrryrrrrs......","..sccccccccccccccs......","..sckkccccccckkcs.......","...scccccccccccs........","....scckwwkcccs.........","....sbbbbbbbbb s........","..ffsbbbbbbbbbsff.......","....sbbbbbbbbs..........","....sbbbbbbbbs..........",".....ff....ff...........","....sffs..sffs..........","........................"],
  pal:{s:'#2c0e1c',r:'#8e2413',o:'#d84a28',y:'#f8d040',c:'#f8e0bc',b:'#d8a878',k:'#1c0a10',l:'#f07830',w:'#ffffff'}},
 {id:'TIDESTAG',t:[2],hp:48,atk:17,def:13,spd:13,catch:.15,work:{WATERING:2},
  learn:[[1,'tackle'],[1,'bubblesnap'],[6,'quicknip'],[11,'tideslam'],[17,'tidalsurge']],
  d:'Its antlers are coral. Small fish follow it on land, confused.',
  spr:["..sls...sls...sls...sls.",".sllbs.sllbs.sllbs.slbbs",".sbbbs.sbbbs.sbbbs.sbbs.","..sbs...sbs...sbs...sbs.","...sbbbbbbbbbbbbbbbs....","..sbkbbbbbbbbbbbkbbbs...","..sbbbbbbbppbbbbbbbs....","...sbbbbbbbbbbbbbbs.....","..sffbbbbbbbbbbffbs.....","....swwwwwwwwws.........","...sbwwwwwwwwbs...sbls..","...sbwwwwwwwwbs..sbbbs..","...sbbbbbbbbbbbs..sbs...","....sbbbbbbbbbs.........","....sbb....bbs..........","....sbb....bbs..........","...sdds....sdds.........","........................","........................","........................"],
  pal:{s:'#10223a',b:'#3a8ad8',d:'#20508e',l:'#8fcbf8',w:'#eaf6ff',k:'#0c1626',f:'#dff2ff'}},
 {id:'FERNHOWL',t:[4],hp:50,atk:19,def:13,spd:14,catch:.15,work:{PLANTING:2},
  learn:[[1,'tackle'],[1,'vinelash'],[7,'sporepuff'],[12,'quicknip'],[15,'headbutt'],[18,'thornstorm']],
  d:'It howls at the moon and the garden grows an inch out of respect.',
  spr:["..sggs....ss....sggs....",".sgllgs..sgggs..sgllgs..",".sggggsssggggsssgggggs..","sgggggggggggggggggggggs.","sgddggggggggggggggddgs..",".sgggggggggggggggggs....","..sggccccccccccggs......","..sgckkcccccckkcgs......","...sgccckkcccgs.......","...sgcccccccccgs.......","....sgdgdgdggs...sgls...","...sggggggggggs.sgggs...","...sggggggggggs..sgs....","....sggggggggs..........","....sggg..gggs..........","....sgg....ggs..........","....sgg....ggs..........","...sdds....sdds.........","........................","........................"],
  pal:{s:'#0f2814',g:'#4cb040',d:'#256b24',l:'#98e078',c:'#f0e8c8',k:'#0a180c',w:'#ffffff'}}];
const WEVO={CINDERCAP:'EMBERCAP',DRIZZLET:'TIDESTAG',FERNFANG:'FERNHOWL'};
/* ================================================================
   FABLE (v5): THE BUDDY RENDERER. Every buddy is drawn from shapes
   (blobs, limbs, polygons) at 2x detail, then baked the way a sprite
   artist would finish it: hard pixels, a lit top edge, a shaded
   underside, one dark outline. The old letter-grid art (s.spr) is
   kept as the fallback. Design space is 24x24, feet near y=23, and
   every buddy FACES LEFT (the battle flips yours to face right).
   D.b = shaded blob, D.e = flat ellipse, D.l = limb, D.p = polygon.
   ================================================================ */
const SWB_S=2,SWB_W=24,SWB_H=24;
function swbTone(h,kr,kg,kb,ad){const n=parseInt(h.slice(1),16),f=(v,k)=>('0'+Math.round(Math.max(0,Math.min(255,v*k+ad))).toString(16)).slice(-2);return'#'+f(n>>16,kr)+f(n>>8&255,kg)+f(n&255,kb)}
const swbDk=c=>swbTone(c,.62,.6,.72,0),swbLt=c=>swbTone(c,1.18,1.16,1.08,14);
function swbMake(fn){const S=SWB_S,w=SWB_W*S,h=SWB_H*S,mkc=(W_,H_)=>{const c=document.createElement('canvas');c.width=W_;c.height=H_;return c};
 const c=mkc(w,h),x=c.getContext('2d',{willReadFrequently:true});x.setTransform(S,0,0,S,0,0);
 const D={e(cx,cy,rx,ry,col){x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,Math.max(.2,rx),Math.max(.2,ry),0,0,7);x.fill()},
  b(cx,cy,rx,ry,col){D.e(cx,cy,rx,ry,swbDk(col));D.e(cx-rx*.1,cy-ry*.13,rx*.87,ry*.85,col);D.e(cx-rx*.36,cy-ry*.42,rx*.3,ry*.22,swbLt(col))},
  p(pts,col){x.fillStyle=col;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);x.closePath();x.fill()},
  l(x1,y1,x2,y2,wd,col){x.strokeStyle=col;x.lineWidth=wd;x.lineCap='round';x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke()},
  r(x_,y_,w_,h_,col){x.fillStyle=col;x.fillRect(x_,y_,w_,h_)},
  eye(cx,cy,rr=1.6,look=-.45){D.e(cx,cy,rr,rr*1.15,'#ffffff');D.e(cx+look,cy+.15,rr*.62,rr*.8,'#1c1420');D.r(cx+look-.75,cy-.8,.7,.7,'#ffffff')}};
 fn(D);x.setTransform(1,0,0,1,0,0);
 const d=x.getImageData&&x.getImageData(0,0,w,h),hit=mkc(w,h),ol=mkc(w+2*S,h+2*S),hol=mkc(w+2*S,h+2*S);
 if(d&&d.data){const q=d.data,n=w*h,on=new Uint8Array(n);
  for(let k=0;k<n;k++){if(q[k*4+3]>=120){on[k]=1;q[k*4+3]=255}else q[k*4+3]=0}
  for(let k=w;k<n-w;k++){if(!on[k])continue;const i=k*4;if(!on[k-w]){q[i]=Math.min(255,q[i]*1.16+14);q[i+1]=Math.min(255,q[i+1]*1.14+12);q[i+2]=Math.min(255,q[i+2]*1.08+8)}else if(!on[k+w]||!on[Math.min(n-1,k+2*w)]){q[i]*=.74;q[i+1]*=.72;q[i+2]*=.84}}
  x.putImageData(d,0,0);
  const hx=hit.getContext('2d'),hd=hx.createImageData(w,h);for(let k=0;k<n;k++){hd.data[k*4]=hd.data[k*4+1]=hd.data[k*4+2]=255;hd.data[k*4+3]=on[k]?255:0}hx.putImageData(hd,0,0);
  const sil=mkc(w,h),sx=sil.getContext('2d'),sd=sx.createImageData(w,h);for(let k=0;k<n;k++){sd.data[k*4]=20;sd.data[k*4+1]=16;sd.data[k*4+2]=30;sd.data[k*4+3]=on[k]?255:0}sx.putImageData(sd,0,0);
  for(const[cv,top]of[[ol,c],[hol,hit]]){const ox=cv.getContext('2d');for(let dx=-S;dx<=S;dx++)for(let dy=-S;dy<=S;dy++)if(Math.abs(dx)+Math.abs(dy)<=S+1)ox.drawImage(sil,S+dx,S+dy);ox.drawImage(top,S,S)}}
 return{img:c,hit,ol,hol,w:SWB_W,h:SWB_H,ow:SWB_W+2,oh:SWB_H+2,fable:1}}
const SWBUD={
CINDERCAP(D){const cr='#f8e8c8',rd='#d8402a',og='#f8902c';
 D.l(9,21,9,22.5,2.4,'#e0c090');D.l(15,21,15,22.5,2.4,'#e0c090');D.b(12,17.5,5.2,4.6,cr);D.l(7,17,5.5,18.5,1.6,cr);D.l(17,17,18.5,18.5,1.6,cr);
 D.p([[12,.5],[9.8,5],[14.2,5]],'#f8c030');D.p([[12,2.2],[10.9,5],[13.1,5]],'#fff0a0');
 D.b(12,9.5,9,5.8,rd);D.e(12,13.6,8.4,1.6,'#8e2416');D.e(7.5,9,1.6,1.3,og);D.e(13,6.6,1.9,1.4,og);D.e(17,10,1.4,1.1,og);
 D.eye(9.6,17,1.7);D.eye(14.2,17,1.7);D.r(11.2,19.6,1.6,.8,'#8a3a30')},
MAGMOSS(D){const rk='#9a6c48',ms='#58b848';
 D.l(7,21,7,22.6,3,'#75522f');D.l(17,21,17,22.6,3,'#75522f');D.b(12,15,9.5,7.5,rk);
 D.l(6,14,9,16.5,.9,'#f8902c');D.l(9,16.5,8,19,.9,'#f8902c');D.l(16,13,18,16,.9,'#f8902c');D.l(18,16,16.5,18.5,.9,'#ffd060');
 D.b(12,8.5,8.5,3.8,ms);D.e(6,10.5,2.2,1.6,ms);D.e(17.5,10.8,2.4,1.6,ms);D.e(11.5,11,2,1.4,ms);
 D.l(12,6,12,2.5,1,'#3a7d2e');D.e(10.3,2.6,2,1.1,'#8fd45e');D.e(13.8,2.2,2,1.1,'#8fd45e');
 D.eye(8.8,15,1.5);D.eye(14.6,15,1.5);D.r(8,13,2,.7,'#5a3a20');D.r(13.8,13,2,.7,'#5a3a20');D.r(10.8,18,2.4,.8,'#5a3a20')},
PEBBLIT(D){const g1='#a8b0c0';
 D.l(8,20,8,22.5,2.6,g1);D.l(15,20,15,22.5,2.6,g1);D.b(12.5,17,6,4.5,g1);D.l(19,15.5,21.5,12.5,1.8,g1);D.e(21.8,12,1.6,1.4,'#c8d0dc');
 D.p([[5,7],[3.2,2.5],[8,5]],'#7c8698');D.p([[14,5],[18.5,2.5],[17,7.5]],'#7c8698');D.b(10.5,10.5,6.6,5.6,g1);D.e(8.5,13.2,3.2,2.2,'#e8ecf2');
 D.eye(7.6,9.6,1.6);D.eye(13,9.6,1.6);D.e(7.2,12.4,1,.8,'#2a2a34');D.r(7.4,14.2,2,.7,'#6a3a40');D.e(13.5,6.5,1.4,1,'#c8d0dc')},
BOULDERHOUND(D){const g1='#7c8698';
 D.l(8,18,7.5,22.5,2.6,'#565f6e');D.l(17.5,18,18,22.5,2.6,'#565f6e');D.l(10.5,18,10.5,22.5,2.6,g1);D.l(15,18,15,22.5,2.6,g1);D.b(13.5,14.5,8,5,g1);
 D.p([[9,10],[11,6.5],[13,10]],'#aab4c4');D.p([[12.5,9.5],[15,5.5],[17,9.5]],'#aab4c4');D.p([[16.5,10],[19,7],[20.5,11]],'#aab4c4');D.l(21,13,23,10.5,1.6,g1);
 D.p([[3.5,8.5],[3,4.5],[6.5,7.5]],'#565f6e');D.p([[8,7.5],[10.5,4.5],[10,9]],'#565f6e');D.b(6.5,11.5,5,4.4,g1);
 D.e(3.6,13,2.6,1.8,'#dfe5ee');D.e(2,12.4,.9,.7,'#2a2a34');D.eye(5.4,10.6,1.5);D.r(3,14.4,2,.6,'#6a3a40');D.l(8.5,15.5,11,15.8,1.4,'#c03828')},
DRIZZLET(D){const b1='#48a0f0';
 D.l(8,5,5.5,2.2,.9,b1);D.e(5.2,1.9,1.3,1.3,'#a8d8f8');D.l(15,4.5,17.8,2,.9,b1);D.e(18.1,1.7,1.3,1.3,'#a8d8f8');
 D.l(5.5,16,3,17.5,1.8,b1);D.l(18.5,16,21,17.5,1.8,b1);D.l(9.5,21.5,9,22.8,2,'#2a68b8');D.l(14.5,21.5,15,22.8,2,'#2a68b8');
 D.p([[12,2],[5.6,13],[18.4,13]],b1);D.b(12,15.5,7,6.5,b1);D.e(12,18,4.6,3.4,'#d8f0ff');D.e(9.6,6.5,1,2,'#a8d8f8');
 D.eye(9.4,12.6,1.8);D.eye(14.8,12.6,1.8);D.e(12,15.6,1.2,.8,'#c04060');D.e(7.2,14.6,1,.6,'#f0a0b8');D.e(17,14.6,1,.6,'#f0a0b8')},
TIDEBUD(D){const b1='#58a8f0',lf='#58c048';
 D.e(12,21.5,9,2,'#3a9a48');D.e(12,21,8,1.5,lf);D.p([[3,17],[1,12.5],[7,15]],lf);D.p([[21,17],[23,12.5],[17,15]],lf);
 D.b(12,14.5,7.5,6.5,b1);D.e(12,17.5,4.5,3,'#d8f2fc');D.l(12,8,12,4,1.1,'#3a7d2e');D.e(9.8,4,2.4,1.4,lf);D.e(14.4,3.4,2.4,1.4,'#8fd45e');D.e(12,2.6,1.2,1.2,'#f8a0c8');
 D.eye(9.2,12.8,1.7);D.eye(14.8,12.8,1.7);D.r(11.2,15.6,1.6,.7,'#2b5c98')},
ZIPWIG(D){const y1='#f0d020';
 for(const[x1,x2]of[[5,2.5],[6,3],[8,5.5],[19,21.5],[18,21],[16,18.5]])D.l(x1,18,x2,21.5,.9,'#3a3020');
 D.l(10,5.5,7.5,2,.8,'#3a3020');D.l(14,5.5,16.5,2,.8,'#3a3020');D.e(7.3,1.8,1.2,1.2,'#fff070');D.e(16.7,1.8,1.2,1.2,'#fff070');
 D.b(12,14,8.5,6.8,y1);D.l(12,9,12,20.5,.9,'#a88810');D.p([[7.5,11],[9.8,13.4],[8.2,13.4],[10,17],[6.6,13.8],[8.2,13.8]],'#ffffff');
 D.b(12,8,4.6,3.4,'#4a3c28');D.eye(10.3,8,1.3);D.eye(13.7,8,1.3)},
VOLTHARE(D){const y1='#f0d020',cr='#fff6d8';
 D.p([[8,9],[6,1],[9,3.5],[8.5,.5],[11.5,8]],y1);D.p([[13,8],[15.5,.5],[15.5,4],[18.5,1.5],[16.5,9]],y1);
 D.l(8,20.5,5.5,22.5,2.6,y1);D.l(16,20.5,18.5,22.5,2.6,y1);D.e(18.5,18,2,2,cr);D.b(12,17,5.8,5,y1);D.e(12,18.5,3.4,3,cr);
 D.b(12,10.5,5.6,4.6,y1);D.e(8,12.5,1.3,.9,'#f8a030');D.e(16,12.5,1.3,.9,'#f8a030');
 D.eye(9.6,10.2,1.6);D.eye(14.4,10.2,1.6);D.e(12,12.4,.8,.6,'#3a3020');D.r(11.3,13.4,1.4,.6,'#8a4030')},
FERNFANG(D){const g1='#58c048',dg='#2f7a2e';
 D.l(11,19,10,22.6,2.2,dg);D.l(15.5,19,16.5,22.6,2.2,g1);D.l(18,16,22.5,12,2.2,g1);D.e(22.3,10.6,1.8,2.8,'#8fd45e');D.b(13.5,15.5,5.5,4.6,g1);
 D.p([[9,7],[8,1],[12,5.5]],'#8fd45e');D.p([[11,6],[12.5,.5],[14.5,6]],g1);D.p([[13.5,6.5],[17,2],[16.5,8]],dg);
 D.b(8.5,10.5,5.6,4.4,g1);D.e(5.5,12.6,3.2,2,'#f0e8c8');D.p([[3.5,13.5],[4.2,15.8],[5,13.5]],'#ffffff');D.p([[6,13.8],[6.7,16],[7.4,13.8]],'#ffffff');
 D.eye(7.4,9.6,1.6);D.l(9.5,16,7.5,17.5,1.6,g1)},
BLOOMBOAR(D){const br='#8a5c36';
 D.l(8,18,8,22.6,2.6,'#5a3a20');D.l(18,18,18,22.6,2.6,'#5a3a20');D.l(11,18.5,11,22.6,2.6,br);D.l(15.5,18.5,15.5,22.6,2.6,br);D.l(21.5,13,23,11.5,1,br);
 D.b(13.5,14.5,8.2,5.6,br);D.b(13.5,9.6,6.6,2.8,'#58b848');
 for(const[fx,fy,c]of[[9,8,'#f078c0'],[12.5,6.6,'#f8d040'],[16,7.6,'#ffffff'],[18.5,9.4,'#f078c0']]){D.e(fx,fy,1.6,1.4,c);D.e(fx,fy,.6,.6,'#f8a030')}
 D.p([[6.5,9.5],[7.5,6.5],[9,10]],'#5a3a20');D.b(6,13.5,4.8,4.4,br);D.e(2.6,15,2.2,1.8,'#c89878');D.r(1.6,14.6,.7,.9,'#5a3a20');D.r(3,14.6,.7,.9,'#5a3a20');
 D.p([[4,16.5],[2.5,19],[5.2,17.4]],'#fff8e0');D.eye(5.6,12.4,1.4)},
CLOVERIMP(D){const pk='#f078c0';
 D.l(9.5,20.5,9,22.6,2.2,'#c05296');D.l(14.5,20.5,15,22.6,2.2,'#c05296');D.l(17,18,21,15,1.2,pk);D.p([[20,13],[23,14],[21.5,16.5]],'#c05296');
 D.b(12,17,4.8,4.4,pk);D.l(7.5,16.5,5.5,14.5,1.4,pk);D.l(16.5,16.5,18.5,14.5,1.4,pk);D.p([[5.5,8],[2,5],[6.5,11]],pk);D.p([[18.5,8],[22,5],[17.5,11]],pk);
 D.b(12,10.5,6.2,5,pk);D.l(12,5.5,12,3.5,.9,'#3a7d2e');for(const[cx,cy]of[[10.6,2.4],[13.4,2.4],[12,1],[12,3.6]])D.e(cx,cy,1.4,1.2,'#58c048');
 D.eye(9.4,10.4,1.7);D.eye(14.6,10.4,1.7);D.p([[10.6,13],[12,14.4],[13.4,13]],'#8a2a60');D.r(11.5,13,1,.8,'#ffffff')},
AURICORN(D){const gd='#f8d878',dk='#d8a848';
 D.l(8.5,17,8,22.6,1.8,dk);D.l(17.5,17,18,22.6,1.8,dk);D.l(11,17.5,11,22.6,1.8,gd);D.l(15.5,17.5,15.5,22.6,1.8,gd);for(const lx of[8,11,15.5,18])D.r(lx-1,21.6,2,1.2,'#fff8e0');
 D.l(20,13,22.5,16.5,1.8,'#fff0b0');D.b(13.5,14,6.8,4.4,gd);D.l(8.5,13,7,8.5,3,gd);D.p([[7.5,5],[9,2.8],[9,6]],dk);D.p([[5.5,5],[4.5,.3],[7,4.6]],'#ffd94d');
 D.b(6,7.5,3.8,3.2,gd);D.e(3.4,8.8,2,1.5,'#fff0b0');D.l(8.5,6,10.5,12,1.6,'#fff0b0');D.eye(5.6,7.2,1.3);D.r(2.6,9.4,.7,.6,'#a06a30')},
EMBERCAP(D){const cr='#f8e0bc',rd='#a02c18',lv='#f8902c';
 D.l(8.5,21,8,22.8,3,'#d8a878');D.l(15.5,21,16,22.8,3,'#d8a878');D.b(12,17.5,6.4,5,cr);D.l(6.5,17,4,19.5,2,cr);D.l(17.5,17,20,19.5,2,cr);
 D.e(10,1.6,1.2,1.2,'#f8c030');D.e(13.6,.9,1,1,'#f8902c');D.p([[2,13],[8,3.5],[16,3.5],[22,13]],rd);D.b(12,11,10.4,4,rd);D.e(12,14,9.6,1.6,'#5e160c');
 D.e(12,3.6,4,1.4,'#fff0a0');D.l(9.5,4,8.5,8,1.4,lv);D.l(14.5,4,16,9.5,1.4,lv);D.l(12,4,12,6.5,1.2,'#ffd060');
 D.eye(9.4,17,1.8);D.eye(14.6,17,1.8);D.r(8,15,2.4,.8,'#8a5a40');D.r(13.6,15,2.4,.8,'#8a5a40');D.p([[10.6,19.4],[12,20.6],[13.4,19.4]],'#8a3a30')},
TIDESTAG(D){const b1='#3a8ad8',dk='#20508e';
 D.l(8.5,17,8,22.6,1.9,dk);D.l(17.5,17,18,22.6,1.9,dk);D.l(11,17.5,11,22.6,1.9,b1);D.l(15.5,17.5,15.5,22.6,1.9,b1);
 D.e(20.5,12.5,1.6,1.6,'#eaf6ff');D.b(13.5,14,7,4.6,b1);D.e(13.5,16,5,2,'#eaf6ff');D.l(8.5,13,7,8.5,3.2,b1);
 for(const[x1,y1,x2,y2]of[[6,5.5,4,1],[4.8,3,2.5,2.2],[7.5,5.5,10,1],[9,3,11.5,2.6],[9.4,2,8.6,.3]])D.l(x1,y1,x2,y2,1.1,'#f08898');
 D.b(6,8,3.8,3.2,b1);D.e(3.4,9.2,2,1.5,'#8fcbf8');D.eye(5.6,7.6,1.3);D.r(2.6,9.8,.7,.6,dk)},
FERNHOWL(D){const g1='#4cb040',dg='#256b24';
 D.l(9,18,8.5,22.6,2.4,dg);D.l(18,18,18.5,22.6,2.4,dg);D.l(11.5,18.5,11.5,22.6,2.4,g1);D.l(16,18.5,16,22.6,2.4,g1);
 D.p([[19,14],[23.5,9],[22,16]],'#98e078');D.l(19.5,15,22,12,2,g1);D.b(14,14.5,7.2,4.8,g1);D.e(11.5,16.5,3.5,1.6,'#c8f0a8');
 for(const[px,py]of[[10,10],[12,8.5],[14,8.6],[16,9.6]])D.p([[px-1.4,py+2],[px,py-3],[px+1.4,py+2]],'#98e078');
 D.p([[4.5,7],[4,2.5],[7.2,6]],dg);D.p([[8,6.2],[10.5,2.5],[10.5,7.5]],dg);D.b(7,10,4.8,4,g1);
 D.p([[1,11.5],[5,10],[5,13.6]],'#f0e8c8');D.e(1.4,11.4,.8,.7,'#1c2a1c');D.p([[3,13.2],[3.6,14.8],[4.2,13.2]],'#ffffff');D.eye(6.2,9.4,1.4)}};
for(const s of WSPECIES){const w=Math.max(...s.spr.map(r2=>r2.length));s.spr=s.spr.map(r2=>r2.padEnd(w,'.'));s._old=SWSPR(s.spr,s.pal);s._spr=SWBUD[s.id]?swbMake(SWBUD[s.id]):s._old}
function wSp(id){return WSPECIES.find(s=>s.id===id)}
function wStats(m){const s=wSp(m.sp);return{max:s.hp+10+(m.lv-1)*4,atk:s.atk+(m.lv-1)*2,def:s.def+(m.lv-1)*2,spd:s.spd+(m.lv-1)}}
function wXpNext(lv){return Math.round(8*Math.pow(lv,1.5))}
function wMovesAt(sp,lv){const out=[];for(const [l,mid] of sp.learn)if(lv>=l&&!out.includes(mid))out.push(mid);return out.slice(-4)}
function wMakeMon(spId,lv){const m={uid:SW.uidN++,sp:spId,lv,xp:0,moves:wMovesAt(wSp(spId),lv)};m.hp=wStats(m).max;return m}

/* ================================================================
   SECTORS, GYMS, BUILDINGS
   ================================================================ */
const WSECTORS=[
 {id:'BASE',n:'SUNKEEP BASE',sub:'Home. Build it up.',req:0,pal:{g:'#548c40',g2:'#477a35',a:'#8fd45e'}},
 {id:'MEADOW',n:'VERDANT MEADOW',sub:'The road to town. Wilds rustle both sides.',req:0,lv:[2,5],gym:-1,pal:{g:'#5da244',g2:'#4c8a38',a:'#c4ec8a'},
  table:[['CINDERCAP',3],['PEBBLIT',3],['FERNFANG',3],['DRIZZLET',2],['ZIPWIG',2]]},
 {id:'TOWN',n:'LANTERN TOWN',sub:'The road ends. Ranger keeps the gym.',req:0,gym:0,pal:{g:'#639a48',g2:'#548239',a:'#ffd94d'}},
 {id:'WASTES',n:'EMBER WASTES',sub:'Hot rocks, hotter tempers.',req:1,lv:[6,10],gym:1,pal:{g:'#a06a34',g2:'#8a5a2c',a:'#f0a050'},
  table:[['CINDERCAP',3],['MAGMOSS',2],['PEBBLIT',2],['BOULDERHOUND',2],['ZIPWIG',2]]},
 {id:'SHORE',n:'DEWMIST SHORE',sub:'Tide pools and tall reeds.',req:2,lv:[10,15],gym:2,pal:{g:'#86ac60',g2:'#77994f',a:'#7fd0e8'},
  table:[['DRIZZLET',3],['TIDEBUD',3],['FERNFANG',2],['CLOVERIMP',2]]},
 {id:'GLOOM',n:'GLOOM HOLLOW',sub:'The dark between the roots.',req:3,lv:[14,19],gym:-1,pal:{g:'#443e63',g2:'#3a3460',a:'#b090e8'},
  table:[['MAGMOSS',2],['TIDEBUD',2],['BLOOMBOAR',2],['VOLTHARE',2],['AURICORN',1]]},
 {id:'PEAK',n:'ZEPHYR PEAK',sub:'Thin air, fast things.',req:3,lv:[17,23],gym:3,pal:{g:'#7c8fa3',g2:'#6a7d94',a:'#e8f4ff'},
  table:[['VOLTHARE',3],['BOULDERHOUND',2],['BLOOMBOAR',2],['AURICORN',1]]}];
function wSector(id){return WSECTORS.find(s=>s.id===id)}
const WKEEPERS={
 WILL:{pas:'Lantern Charm: catch +15%',act:'SELFIE FLASH',actD:'Dazzled foe: ATK down, loses a turn.'},
 ERIN:{pas:'Green Hands: +1 yield, heal wins',act:'TOWEL WHIP',actD:'Damage + the foe loses its turn.'},
 MARCUS:{pas:'Drill Sergeant: hits +12%',act:'HYDRO JET',actD:'A pressurized DEW blast.'}};
const WTALK={PIP:['A wild ZIPWIG chased me home once. It just wanted my sandwich, I think.','When I grow up I want a whole FORTUNE sprout. They bring luck AND snacks.','The gym leader? That is Ranger. He is tough but he shares his berries.'],
 ELDER:['Lantern Town was three tents and a dream when I was your size, keeper.','A good base is a garden and a workshop at once. Tend both.','The Sigils are old promises. Ranger keeps the first, down at the gym.'],WILL:["I catalog every sprout in this valley. Twice.","The Lantern chose us. No pressure or anything.","If Marcus asks, I was absolutely working."],
ERIN:["The beds grow better when someone sings. I sing.","Louie has a route. Always trust the route.","A tidy base is a happy base. Mostly."],
MARCUS:["I'm not an NPC. I'm between protagonists.","Your form is terrible. The sprouts respect it anyway.","Hydro Jet solves most problems. The rest are personal."]};
function wNpcList(){if(W4.sector==='TOWN')return[{who:'PIP',x:168,y:214},{who:'ELDER',x:312,y:214}];
 const spots={ERIN:{x:90,y:120},MARCUS:{x:390,y:120},WILL:{x:84,y:428}};
 return Object.keys(spots).filter(w2=>w2!==SW.keeper).map(w2=>({who:w2,x:spots[w2].x,y:spots[w2].y}))}
const WSECSUB={BASE:'Your home — build it anywhere',TOWN:'Lanterns lit. Doors open.',MEADOW:'Wildsprouts live in the tall grass',WASTES:'Hot winds. EMBER kinds thrive here',SHORE:'Mist, shells and DEW kinds',HOLLOW:'Dark, quiet, and LUCKY',PEAK:'High winds. ZIP kinds race here'};
const WGYMS=[
 {sec:'TOWN',leader:'RANGER',sig:'VERDANT SIGIL',prize:80,team:[['FERNFANG',7],['BLOOMBOAR',8]],
  pre:["RANGER: So you want the Verdant Sigil.","My buddies grew up in this meadow. Show me yours can keep up."],
  win:"RANGER: Ha! Grown strong. The Verdant Sigil is yours.",lose:"RANGER: The meadow is patient. Come back stronger."},
 {sec:'WASTES',leader:'MARCUS',sig:'EMBER SIGIL',prize:120,team:[['CINDERCAP',16],['MAGMOSS',17]],
  pre:["MARCUS: A gym. They gave ME a gym. Incredible.","Lose gracefully. Or don't. I respect either, barely."],
  win:"MARCUS: Fine. FINE. Take the sigil. Tell no one I smiled.",lose:"MARCUS: Predictable. The wastes remain undefeated and unimpressed."},
 {sec:'SHORE',leader:'ERIN',sig:'TIDE SIGIL',prize:160,team:[['DRIZZLET',21],['TIDEBUD',22]],
  pre:["ERIN: Keeper versus keeper, love.","My tide buddies have been training for this. No mercy, okay?"],
  win:"ERIN: You earned that one. Tide Sigil, officially yours.",lose:"ERIN: The tide always comes back. So will you. Heal up at base."},
 {sec:'PEAK',leader:'SCOUT',sig:'VOLT SIGIL',prize:220,team:[['ZIPWIG',26],['VOLTHARE',27]],
  pre:["SCOUT: Field notes say you're fast. Field notes lie.","The peak gym tests one thing: can you catch lightning twice?"],
  win:"SCOUT: Updating my notes: you CAN. Volt Sigil earned.",lose:"SCOUT: Noted: lightning wins this round. Rest and return."},
 {sec:'PEAK',leader:'THE FIRST KEEPER',crown:1,prize:300,team:[['AURICORN',31],['VOLTHARE',32],['BLOOMBOAR',31],['EMBERCAP',34]],
  pre:['You lit the valley back to life, little keeper.','I am what the Lantern remembers. Show me your light.'],
  win:'The Lantern flares gold above the clouds. FIRST KEEPER — the valley is yours.',
  lose:'The light dims... but embers remember. Return stronger.'},
 {sec:'PEAK',leader:'BOTTIE',sig:'CLANK SIGIL',prize:300,crown:1,team:[['VOLTHARE',33],['AURICORN',34],['EMBERCAP',36]],pre:['BOTTIE: bzzt. You actually clanked up here, gang.','BOTTIE: The crown was cute. THIS is the real final trend.'],win:'BOTTIE: ...beep. Fine. The feed bows — the light is yours, keeper.',lose:'BOTTIE: bzzt. Called it. Come back trending, keeper.'}];
function wGymIx(sec){if(sec.id==='PEAK'&&SW.gymDone[4]&&SW.bottieSeen)return 5;
 return(sec.id==='PEAK'&&SW.badges.length>=4&&SW.gymDone[3])?4:sec.gym}
const WBUILD=[
 {k:'cottage',n:'COTTAGE',cost:{wood:8},max:1,d:'A roof for your buddies. With it, buddies left at home work the base. Sleep here to skip the night.'},
 {k:'bed',n:'GARDEN BED',cost:{wood:6,stone:2},skill:['PLANTING','WATERING'],yields:'berry',d:'A DEW or LEAF sprout grows berries over time.'},
 {k:'nursery',n:'BUDDY NURSERY',cost:{wood:6,stone:2},skill:['PLANTING','WATERING'],max:2,d:'Plant a sprout (3 BERRY). Tend it, watch it grow, harvest a buddy.'},
 {k:'kiln',n:'KILN',cost:{stone:8,wood:4},skill:['KINDLING','CHARGE'],yields:'ingot',d:'An EMBER or ZIP sprout smelts ingots over time.'},
 {k:'quarry',n:'QUARRY PIT',cost:{wood:8},skill:['QUARRY'],yields:'stone',d:'A PEB sprout hauls stone over time.'},
 {k:'bench',n:'TINKER BENCH',cost:{wood:10,ingot:1},max:1,d:'Unlocks brewing at the Cottage: Tonics and supplies.'},
 {k:'pen',n:'SPROUT PEN',cost:{wood:12,ingot:2},d:'Room for the crew. Each pen raises sprout crew capacity by 2.'},
 {k:'sawmill',n:'SAWMILL',cost:{wood:10,stone:4},yields:'wood',skill:['PLANTING'],d:'LEAF sprouts mill WOOD from the grove.',max:2,lock:1,price:15},
 {k:'statue',n:'LANTERN STATUE',cost:{stone:8,ingot:2},d:'Gratitude hearts drop far more often.',max:1,lock:1,price:25}];
function wBuildDef(k){return WBUILD.find(b=>b.k===k)}
function wWorkerCap(){return 2+(SW.baseLv-1)*2+SW.buildings.filter(b=>b.k==='pen').length*2}
const WBASEMS={1:[['build:cottage','Build a Cottage'],['crop:1','Grow a crop on a garden plot'],['buddies:3','Have 3 buddies'],['build:kiln','Build a Kiln (ore makes ingots)']],
 2:[['build:datacenter','Build a Data Center'],['buddies:5','Have 5 buddies'],['sigils:1','Earn 1 Sigil'],['build:bench','Build a Tinker Bench']]};
function wMissionDone(key){const [k,v]=key.split(':');
 if(k==='build')return SW.buildings.some(b=>b.k===v);
 if(k==='crop')return plCrops()>=+v||SW.buildings.some(b=>b.k==='bed');
 if(k==='buddies')return SW.party.length+SW.box.length>=+v;
 if(k==='workers')return wAssignedCount()>=+v;
 if(k==='species')return Object.keys(SW.caught).length>=+v;
 if(k==='sigils')return SW.badges.length>=+v;
 if(k==='hearts')return SW.heartsTotal>=+v;return false}
function wBaseReady(){const ms=WBASEMS[SW.baseLv];return!!ms&&ms.every(([key])=>wMissionDone(key))}
function wPlot(){return{c0:0,c1:22,r0:0,r1:23}}
function wCellFree(gx,gy){const x=wCellX(gx),y=wCellY(gy),cx=x+10,cy=y+10;
 if(gx<0||gx>22||gy<0||gy>23)return false;
 if(x>172&&x<290&&y<112)return false;
 if(cx>218&&cx<262&&cy>100)return false; /* the lane from the Lantern to the south road stays clear */
 if(cx>284&&cx<340&&cy>150&&cy<204)return false; /* the camp fire */
 if(cx>158&&cx<322&&cy>324&&cy<392)return false; /* the garden: nothing builds on the plots */
 for(const b of W4.bushes||[])if(Math.hypot(cx-b.x,cy-b.y)<18)return false;
 if(SW.quest<2&&Math.hypot(cx-240,cy-296)<52)return false;
 for(const np of wNpcList())if(Math.hypot(cx-np.x,cy-np.y)<16)return false;
 for(const nd of W4.nodes)if(!nd.got&&Math.hypot(cx-nd.x,cy-nd.y)<17)return false;
 if(SW.buildings.some(b=>b.gx===gx&&b.gy===gy))return false;
 return true}
const WSKILLTYPE={KINDLING:0,QUARRY:1,WATERING:2,CHARGE:3,PLANTING:4,FORTUNE:5};
function wCrewCap(){return 4+(SW.baseLv-1)*2+SW.buildings.filter(b=>b.k==='pen').length*2}
function wCrewAt(bi){return SW.crew.filter(c=>c.job===bi)}
function wCrewSetJob(c,job){c.job=job;const ci=SW.crew.indexOf(c);
 if(c.atPatch&&job!==-1){c.atPatch=false;if(W4.patchBuds)for(const pb of W4.patchBuds)
  if(pb.crew&&pb.crewIx===ci){pb.crew=false;pb.type=-1;pb.age=-8;pb.dlv=0;pb.mode='soil';pb.item=false;pb.pend=null;pb.seedTy=null;pb.by=null;pb.x=pb.sx;pb.y=pb.sy}}
 else if(!c.atPatch&&job===-1&&W4.patchBuds){const spot=W4.patchBuds.find(pb=>pb.type<0&&!pb.crop);
  if(spot){c.atPatch=true;spot.type=c.type;spot.age=31;spot.stage=2;spot.dlv=3;spot.crew=true;spot.crewIx=ci;spot.mode='soil';spot.x=spot.sx;spot.y=spot.sy}}
 swSave()}
function wAssignedCount(){return SW.crew.filter(c=>c.job!==-1).length}
function wJobWork(dt){if(W4.sector!=='BASE')return;if(!W4.jobPos)W4.jobPos=[];
 SW.crew.forEach((c,ci)=>{if(c.job!==-2&&c.job!==-3)return;const kind=c.job===-2?'tree':'rock';
  let jp=W4.jobPos[ci];if(!jp){jp=W4.jobPos[ci]={x:240,y:300,nd:null,t:0}}
  if(!jp.nd||jp.nd.got){jp.nd=(W4.nodes||[]).find(n2=>n2.k===kind&&!n2.got)||null}
  if(!jp.nd){ /* no work standing: wait by the patch, on duty */
   if(wMoveTo(jp,224+ci*14,330,26,dt,3)){} return}
  const nd=jp.nd;
  if(wMoveTo(jp,nd.x+(ci%2?8:-8),nd.y+6,30,dt,7))return;
  jp.t-=dt;
  if(jp.t<=0){jp.t=.55;nd.hp-=1;W4.floats.push({x:nd.x,y:nd.y-16,txt:'.',t:.3,c:'#ffffff'});
   if(nd.hp<=0){nd.got=true;c.wxp=(c.wxp||0)+2;wGather(nd);jp.nd=null}}})}
function wSeedRand(seed){let s=seed||7;return()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff}}
function wSectorSeed(id){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))&0xffff;return h+11}
const WW=480,WH=360;
const wCellX=gx=>10+gx*20, wCellY=gy=>38+gy*20;
const WCHOICE=[{sp:'CINDERCAP',x:184,y:302},{sp:'DRIZZLET',x:240,y:286},{sp:'FERNFANG',x:296,y:302}];

function wCamUpdate(tx,ty){W4.cam=W4.cam||{x:0,y:0};if(!W4.fld&&ty<240)ty-=Math.min(60,(240-ty)*.7); /* near the Great Lantern the view leans up to take it in */
 W4.cam.x=Math.max(0,Math.min(WW-W,tx-W/2));W4.cam.y=Math.max(W4.fld?0:-44,Math.min((W4.wh||360)-H,ty-H/2))}
function wGrassPatches(){return[{x:36,y:70,w:76,h:44},{x:368,y:64,w:78,h:46},{x:60,y:200,w:84,h:48},{x:330,y:210,w:88,h:50},{x:196,y:140,w:80,h:44},{x:392,y:140,w:64,h:40},{x:150,y:262,w:90,h:46}]}
function wInitPatch(){if(W4.patchBuds&&W4.patchBuds.length)return; /* the patch is alive — never reseed it */
 W4.patchBuds=WPLOTS.slice(0,wPlotCount()).map(([x,y])=>({sx:x,sy:y,x,y,type:-1,age:-4,stage:0,mode:'soil',item:false,tx:0,ty:0,dlv:0,seedTy:null,by:null,forPlot:null,bush:null,itemTy:0,t:0}));
 for(let ci=0;ci<SW.crew.length;ci++){const c=SW.crew[ci];if(c.job===-1&&c.atPatch!==false){const spot=W4.patchBuds.find(pb=>pb.type<0&&!pb.crop);
   if(spot){c.atPatch=true;spot.type=c.type;spot.age=31;spot.stage=2;spot.dlv=3;spot.crew=true;spot.crewIx=ci;spot.mode='soil'}else c.atPatch=false}}
 if(!SW.trioSeeded){SW.trioSeeded=1;[0,2,4].filter(ty=>!(SW.trioPlucked||[]).includes(ty)).forEach((ty,i)=>{const pb=W4.patchBuds[i];if(pb){pb.type=ty;pb.age=31;pb.stage=2;pb.dlv=1}});swSave()}}
function wEnterSector(id){W4.sector=id;SW.sector=id;const sec=wSector(id);W4.ww=WW;W4.wh=id==='BASE'?520:360;
 W4.nodes=[];
 if(id!=='BASE'&&sec.table){const rnd=wSeedRand(wSectorSeed(id));
  const kinds=['tree','tree','tree','rock','rock','bush','tree','rock','bush'];
  kinds.forEach((k,i)=>{let x,y,tries=0;
   do{x=24+rnd()*(WW-48);y=52+rnd()*(WH-110);tries++}while(tries<11&&(wGrassPatches().some(p=>x>p.x-10&&x<p.x+p.w+10&&y>p.y-10&&y<p.y+p.h+10)
    ||(sec.gym>=0&&Math.hypot(x-WW/2,y-66)<32)||Math.hypot(x-WW/2,y-(W4.wh-24))<30));
   W4.nodes.push({k,x,y,got:false,hp:k==='bush'?6:15,max:k==='bush'?6:15});});}
 else if(id==='BASE'){W4.nodes=[['tree',70,96],['tree',408,104],['tree',58,300],['tree',420,310],
  ['rock',120,478],['rock',366,478],['bush',150,392]].map(([k,x,y])=>({k,x,y,got:false,hp:k==='bush'?6:15,max:k==='bush'?6:15}))}
 W4.decor=[];{const dr=wSeedRand(wSectorSeed(id)+7);
  for(let i=0;i<26;i++){const edge=i%3;let x,y;
   if(edge===0){x=16+dr()*(WW-32);y=18+dr()*20}
   else if(edge===1){x=12+dr()*18;y=44+dr()*(WH-70)}
   else{x=WW-30+dr()*18;y=44+dr()*(WH-70)}
   if(sec.gym>=0&&y<48&&Math.abs(x-WW/2)<58)continue;
   if(id==='BASE'&&((Math.abs(x-WW/2)<26)||y>W4.wh-100||(y<96&&Math.abs(x-WW/2)<44)))continue;
   W4.decor.push({k:'tree',x,y,s:.8+dr()*.5})}
  const dk={MEADOW:'flower',WASTES:'cactus',SHORE:'shell',GLOOM:'shroom',PEAK:'snowrock'}[id];
  if(id==='TOWN')W4.decor.push({k:'house',x:64,y:96,s:1},{k:'house',x:352,y:96,s:1});
  if(dk)for(let i=0;i<9;i++){const x=26+dr()*(WW-52),y=54+dr()*(WH-90);
   if(wGrassPatches().some(p2=>x>p2.x&&x<p2.x+p2.w&&y>p2.y&&y<p2.y+p2.h))continue;
   W4.decor.push({k:dk,x,y,s:.7+dr()*.6})}}
 W4.wilds=[];W4.wildCd=0;W4.items=null;
 W4.bushes=id==='BASE'?[{x:150,y:354,type:0,fruit:2,rg:0},{x:330,y:354,type:2,fruit:2,rg:0},{x:240,y:408,type:4,fruit:2,rg:0}]:null;
 if(W4.patchBuds)for(const q of W4.patchBuds)q.by=null;
 wFolSync();
 if(id==='BASE'&&SW.tendDone)wInitPatch();else if(!SW.tendDone)W4.patchBuds=null;
 W4.loose=[];
 if(sec.table){const lr=wSeedRand(wSectorSeed(id)+99);const ln=1+(lr()<.5?1:0);
  for(let li=0;li<ln;li++){const lsp=sec.table[(lr()*sec.table.length)|0][0];
   let lx=0,ly=0,tr=0;
   do{lx=40+lr()*(WW-80);ly=70+lr()*(WH-130);tr++}while(tr<12&&(W4.nodes.some(n=>Math.hypot(lx-n.x,ly-n.y)<28)
    ||wGrassPatches().some(gp=>lx>gp.x-6&&lx<gp.x+gp.w+6&&ly>gp.y-6&&ly<gp.y+gp.h+6)
    ||Math.hypot(lx-WW/2,ly-(W4.wh-24))<30||(sec.gym>=0&&Math.hypot(lx-WW/2,ly-66)<36)));
   W4.loose.push({type:wSp(lsp).t[0],x:lx,y:ly,hx:lx,hy:ly})}}
 W4.treasure=null;{const tr2=wSeedRand(wSectorSeed(id)+131);let tx=0,ty=0,tr3=0;
  do{tx=36+tr2()*(WW-72);ty=64+tr2()*(WH-120);tr3++}while(tr3<12&&(W4.nodes.some(n=>Math.hypot(tx-n.x,ty-n.y)<26)
   ||wGrassPatches().some(gp=>tx>gp.x-6&&tx<gp.x+gp.w+6&&ty>gp.y-6&&ty<gp.y+gp.h+6)
   ||Math.hypot(tx-WW/2,ty-(W4.wh-24))<30||Math.hypot(tx-240,ty-100)<34||Math.hypot(tx-240,ty-296)<44||Math.hypot(tx-240,ty-350)<30));
  W4.treasure={x:tx,y:ty}}
 if(sec.table)for(let i=0;i<3;i++){const p=wGrassPatches()[i%wGrassPatches().length];
  W4.wilds.push(wSpawnWild(sec,p.x+p.w/2+(i*13)%17-8,p.y+p.h/2+(i*7)%11-5))}
 P3.x=id==='BASE'?WW/2-20:WW/2-30;P3.y=id==='BASE'?292:W4.wh-30;P3.ax=0;P3.ay=-1;W4.grassT=0;W4.grace=1.2;
 W4.part={x:P3.x-14,y:P3.y+6};W4.cam=null;wCamUpdate(P3.x,P3.y);
 if(id==='BASE'){lou.x=WW/2-56;lou.y=290}
 {const fr0=W4.from;W4.fld=FMAPS[id]?fBuild(id,fr0):null;W4.from=null;W4.bf=W4.fld?null:fBaseBuild();if(W4.fld)wCamUpdate(P3.x,P3.y);else wBaseArrive(fr0)}
 if(!SW.visited[sec.id]){SW.visited[sec.id]=1;W4.banner={txt:sec.n,sub:WSECSUB[sec.id]||'',t:3}}
 swSave()}
/* ---------- base production: workers turn time into resources ---------- */
function wProdTick(){SW.buildings.forEach((b,bi)=>{const def=wBuildDef(b.k);if(!def.yields)return;
  const crew=wCrewAt(bi);if(!crew.length)return;
  const affT=def.skill.map(sk=>WSKILLTYPE[sk]);
  const prod=crew.find(c=>affT.includes(c.type));
  for(const c of crew)c.wxp=(c.wxp||0)+1;
  let amt=0;
  if(prod)amt=2+Math.min(2,((prod.wxp||0)/6)|0);
  else if(Math.random()<.5)amt=1;
  if(amt&&crew.some(c=>c.type===5))amt+=1;
  if(amt&&SW.keeper==='ERIN')amt+=1;
  if(!amt)return;
  SW.res[def.yields]+=amt;
  if(Math.random()<(SW.buildings.some(bb=>bb.k==='statue')?.85:.5)&&(W4.groundHearts||[]).length<8){W4.groundHearts=W4.groundHearts||[];
   W4.groundHearts.push({x:wCellX(b.gx)+4+Math.random()*10,y:wCellY(b.gy)+20+Math.random()*6})}
  if(W4.sector==='BASE')W4.floats.push({x:wCellX(b.gx)+10,y:wCellY(b.gy)+12,txt:'+'+amt+' '+def.yields.toUpperCase(),t:1.4,c:'#ffd94d'})});
 swSave()}
W4.floats=[];
/* ================================================================
   WORLD (sectors + base share one walker)
   ================================================================ */
function wSolidAt(x,y){const sec=wSector(W4.sector);
 if(W4.sector==='BASE'&&W4.baseArrive&&y>(W4.wh||520)-17&&Math.abs(x-240)<34)return true; /* just arrived from the road: let go once before it takes you back */
 if(W4.sector==='BASE'&&x>196&&x<284&&y<86)return true; /* the Great Lantern's trunk */
 if(x<10||x>WW-10||y<28||y>(W4.wh||360)-10)return true;
 if(W4.sector==='TOWN'&&((x>58&&x<136&&y>88&&y<134)||(x>346&&x<424&&y>88&&y<134)))return true;
 for(const nd of W4.nodes)if(!nd.got&&Math.abs(x-nd.x)<10&&Math.abs(y-nd.y)<8)return true;
 for(const d of(W4.decor||[])){if(d.k==='tree'&&Math.abs(x-d.x)<7&&y>d.y-3&&y<d.y+8)return true;
  if(d.k==='snowrock'&&Math.abs(x-d.x)<9&&y>d.y-4&&y<d.y+7)return true}
 if(sec.gym>=0&&x>WW/2-36&&x<WW/2+36&&y<70)return true;
 if(W4.sector==='BASE')for(const b of SW.buildings){const bx=wCellX(b.gx),by=wCellY(b.gy);
  if(x>bx-2&&x<bx+22&&y>by-2&&y<by+22)return true}
 return false}
function wSproutInfo(px,py){ /* the catch-all: any sprout can be asked what it is */
 for(const f of (W4.fol||[]))if(f.mode!=='away'&&Math.hypot(px-f.x,py-f.y)<16)return{k:'sproutinfo',txt:'ASK',x:f.x,y:f.y,
  msg:TYPES[f.type].n+' SPROUT · '+(f.mode==='haul'?'hauling a find home!':f.mode&&f.mode[0]==='b'?'working the patch — it hauls finds home on the road':'following you — it hauls finds home')};
 {const wd=(W4.wilds||[]).find(w2=>Math.hypot(px-w2.x,py-w2.y)<17);
  if(wd)return{k:'wild',wd,txt:'BATTLE '+wd.sp+' Lv'+wd.lv,x:wd.x,y:wd.y}}
 if(W4.sector==='BASE'&&W4.patchBuds)for(const pb of W4.patchBuds)if(pb.type<0&&Math.hypot(px-pb.x,py-pb.y)<15)
  return{k:'plot',pb,txt:pb.crop?(pb.ripe?'HARVEST '+WCROPS[pb.crop].n:WCROPS[pb.crop].n+' · growing · A changes it'):pb.seedTy!=null?TYPES[pb.seedTy].n+' SEED · A changes this plot':'EMPTY PLOT · choose what grows'};
 if(W4.sector==='BASE'&&W4.patchBuds)for(const pb of W4.patchBuds)if(pb.type>=0&&pb.stage<2&&Math.hypot(px-pb.x,py-pb.y)<15)
  return{k:'sproutinfo',txt:'ASK',x:pb.x,y:pb.y,msg:TYPES[pb.type].n+' SPROUT · still growing — grown sprouts work'};
 if(W4.sector==='BASE'&&W4.patchBuds)for(const pb of W4.patchBuds)if(pb.type>=0&&pb.stage>=2&&Math.hypot(px-pb.x,py-pb.y)<15)
  return{k:'sproutinfo',txt:'ASK',x:pb.x,y:pb.y,msg:TYPES[pb.type].n+' SPROUT · '+(pb.mode==='fetch'?'off to pick fruit':pb.mode==='plant'?'carrying a berry to plant':pb.mode==='carry'?'hauling fruit to the Lantern':pb.mode==='back'?'heading back to its plot':'works the garden from this plot')};
 if(W4.sector==='BASE'){let pi=0;for(let ci=0;ci<SW.crew.length;ci++){const c=SW.crew[ci];if(c.job===-1&&!c.atPatch&&pi<6){
   if(Math.hypot(px-(196+pi*18),py-132)<15)return{k:'sproutinfo',txt:'ASK',x:196+pi*18,y:132,msg:TYPES[c.type].n+' SPROUT · grown crew — give it a job at a building'};pi++}}
  for(const b of SW.buildings){const bx=wCellX(b.gx),by=wCellY(b.gy);const here=wCrewAt(SW.buildings.indexOf(b));
   for(let wi=0;wi<here.length;wi++)if(Math.hypot(px-(bx+6+wi*10),py-(by+22))<14)
    return{k:'sproutinfo',txt:'ASK',x:bx+6+wi*10,y:by+22,msg:TYPES[here[wi].type].n+' SPROUT · working the '+wBuildDef(b.k).n+' · skill '+(here[wi].wxp||0)}}}
 return null}
function wNear(){const sec=wSector(W4.sector),px=P3.x+P3.ax*13,py=P3.y+P3.ay*13;
 {const ex=wNearExtra(px,py);if(ex)return ex}
 if(W4.sector==='BASE'&&louPetOK()&&Math.hypot(P3.x+(P3.ax||0)*12-lou.x,P3.y+(P3.ay||0)*12-lou.y)<14)return{k:'louie',txt:'PET LOUIE'}; /* facing him, standing still: that is a pet */
 const aimT=!!(W4.bf&&(W4.bf.sq.length||(W4.bf.pf&&W4.bf.pf.length))&&fAim(W4.bf).tg);
 if(W4.loose)for(const lb of W4.loose)if(Math.hypot(px-lb.x,py-lb.y)<17)return{k:'wildpluck',lb,txt:'PLUCK '+TYPES[lb.type].n+' SPROUT'};
 if(W4.sector==='BASE'&&W4.patchBuds)for(const pb of W4.patchBuds)
  if(pb.type>=0&&pb.stage>=2&&Math.hypot(px-pb.x,py-pb.y)<17)return{k:'pluck',pb,txt:'PLUCK '+TYPES[pb.type].n+' SPROUT'};
 for(const nd of W4.nodes)if(!nd.got&&nd.k!=='bush'&&!(W4.bf&&pfBest(W4.bf,nd))&&Math.hypot(px-nd.x,py-nd.y)<17)
  return{k:'node',nd,txt:wNodeLabel(nd)};
 if(W4.sector==='BASE'&&SW.tendStage>=3&&W4.tend&&W4.tend.buds)for(const tb of W4.tend.buds)
  if(tb.st==='grown'&&Math.hypot(px-tb.x,py-tb.y)<18)return{k:'tendpluck',b:tb,txt:'PLUCK '+TYPES[tb.type].n+' SPROUT'};
 if(false&&W4.sector==='BASE'&&SW.quest<=1&&!SW.tendDone&&Math.hypot(px-240,py-352)<26)return{k:'patch',txt:SW.tendStage===0?'WATER THE SEEDS':SW.tendStage>=3?'PLUCK THE GROWN ONES':'THE SPROUT PATCH'};
 if(W4.sector==='BASE'&&SW.quest===1&&SW.tendDone&&!SW.party.length)for(const c of WCHOICE)
   if(Math.hypot(px-c.x,py-c.y)<24)return{k:'choice',sp:c.sp,txt:'GREET '+c.sp};
 if(sec.gym>=0&&Math.hypot(px-WW/2,py-66)<20)return{k:'gym',txt:'GYM'};
 if(W4.sector!=='BASE'&&Math.hypot(px-WW/2,py-(W4.wh-22))<17)return{k:'sign',txt:'LANTERN GATE'};
 if(W4.sector==='BASE'){for(const b of SW.buildings){const bx=wCellX(b.gx)+10,by=wCellY(b.gy)+12;
   if(Math.hypot(px-bx,py-by)<18)return{k:'bld',b,txt:wBuildDef(b.k).n}}
  if(Math.hypot(px-WW/2,py-74)<24)return{k:'lantern',txt:'THE GREAT LANTERN'}}
 if(aimT)return null;
 if(W4.sector==='BASE'&&(Math.hypot(px-lou.x,py-lou.y)<17||louPetOK()))return{k:'louie',txt:'PET LOUIE'}; /* Louie and people come last: they follow you about and must never take the button from what you are facing */
 for(const np of wNpcList())if(Math.hypot(px-np.x,py-np.y)<16)return{k:'npc',who:np.who,txt:'TALK TO '+np.who}; /* people last: they wander, and must never steal the button from what you are facing */
 const si=wSproutInfo(px,py);if(si)return si; return null}
const WTOOLCOST=[{w:6,s:3,i:0},{w:14,s:8,i:2},{w:24,s:14,i:5}];
function wToolCost(tool,lv){const c=WTOOLCOST[lv];return tool==='axe'?c:{w:c.s,s:c.w,i:c.i}}
function wSwing(nd){if(W4.swingCd>0)return;W4.swingCd=.22;
 if(SW.stam<5){if(W4.msgT<=0)swSay('Winded! Catch your breath a moment.',1.6);swSnd(140,.07);return}
 SW.stam-=5;W4.stamT=0;
 const dmg=nd.k==='tree'?3+SW.tools.axe*2:nd.k==='rock'?3+SW.tools.pick*2:1; /* by hand a tree takes 5 swings; a buddy with the skill is still far quicker */
 nd.hp-=dmg;nd.shake=.25;
 W4.floats.push({x:nd.x,y:nd.y-14,txt:'-'+dmg,t:.7,c:'#ffe8b0'});
 swSnd(nd.k==='rock'?180:nd.k==='tree'?240:520,.05,nd.k==='bush'?760:120);
 if(nd.hp<=0)wGather(nd)}
function wGather(nd){nd.got=true;
 if(nd.k==='tree'){SW.res.wood+=2+(SW.tools.axe>=3?1:0);swSay('+2 WOOD',1.2);swSnd(220,.07,140)}
 if(nd.k==='rock'){SW.res.stone+=2+(SW.tools.pick>=3?1:0);swSay('+2 STONE',1.2);swSnd(160,.07,110)}
 if(nd.k==='bush'){SW.res.berry+=1;if(Math.random()<.3)SW.res.petal+=3;swSay('+1 BERRY',1.2);swSnd(520,.06,760)}
 swSave()}
let lou={x:60,y:120};
function worldUpdate(dt){if(W4.scene){scTick(dt);return}scAuto();if(W4.fld){fUpdate(dt);return}const sec=wSector(W4.sector);
 SW.playT+=dt;
 if(W4.grace>0)W4.grace-=dt;
 W4.swingCd=Math.max(0,(W4.swingCd||0)-dt);W4.stamT=(W4.stamT||0)+dt;
 if(SW.stam<100&&W4.stamT>1)SW.stam=Math.min(100,SW.stam+7*dt);
 for(const nd of W4.nodes)if(nd.shake>0)nd.shake-=dt;
 if(SW.quest<5)wQuestTick();
 if(W4.banner&&W4.banner.t>0)W4.banner.t-=dt;
 if(W4.sector==='BASE'&&W4.groundHearts&&W4.groundHearts.length){const keep=[];
  for(const h of W4.groundHearts){if(Math.hypot(P3.x-h.x,P3.y-h.y)<11){SW.hearts++;SW.heartsTotal++;
   W4.floats.push({x:h.x,y:h.y-8,txt:'+1',t:1.2,c:'#f078c0'});swSave()}else keep.push(h)}W4.groundHearts=keep}
 if(W4.msgT>0)W4.msgT-=dt;
 if(W4.tossFx){W4.tossFx.t-=dt;if(W4.tossFx.t<=0)W4.tossFx=null}
 if(W4.cmdT&&W4.cmdT.nd.got)W4.cmdT=null;
 for(const f of W4.floats)f.t-=dt;W4.floats=W4.floats.filter(f=>f.t>0);
 if(W4.talk){const tk=W4.talk;
  if(pressed('b'))W4.talk=null;
  else if(pressed('a')){if(tk.page===0)tk.page=1;
   else{const who=tk.who;W4.talk=null;if(['WILL','ERIN','MARCUS'].includes(who)){SW.keeper=who;swSay(who+' takes the lantern!',2);swSnd(784,.09,1175);swSave()}}}
  return}
 const sp=78;let mx=0,my=0;
 if(pressed('left'))W4.lastDir='left';if(pressed('right'))W4.lastDir='right';
 if(pressed('up'))W4.lastDir='up';if(pressed('down'))W4.lastDir='down';
 const LD=W4.lastDir;
 if(LD==='left'&&keys.left)mx=-1;else if(LD==='right'&&keys.right)mx=1;
 else if(LD==='up'&&keys.up)my=-1;else if(LD==='down'&&keys.down)my=1;
 else if(keys.left)mx=-1;else if(keys.right)mx=1;else if(keys.up)my=-1;else if(keys.down)my=1;
 if(mx||my){P3.ax=mx;P3.ay=my;P3.anim=(P3.anim||0)+dt*8;
  const nx=P3.x+mx*sp*dt,ny=P3.y+my*sp*dt;
  if(!wSolidAt(nx,P3.y))P3.x=nx;if(!wSolidAt(P3.x,ny))P3.y=ny;
  if(sec.table&&!sec.gymDone){const inG=wGrassPatches().some(p=>P3.x>p.x&&P3.x<p.x+p.w&&P3.y>p.y&&P3.y<p.y+p.h);
   if(inG){W4.grassT+=dt;if(W4.grassT>.35){W4.grassT=0;
     if(W4.grace<=0&&Math.random()<.16*(1+wDark()*.6)&&W4.wilds.length<5&&!W4.wilds.some(w2=>w2.reveal!=null&&Math.hypot(w2.x-P3.x,w2.y-P3.y)<40)){
      const wd=wSpawnWild(sec,P3.x+16,P3.y+8);wd.reveal=12;wd.hx=wd.x;wd.hy=wd.y;W4.wilds.push(wd);
      W4.floats.push({x:wd.x,y:wd.y-16,txt:'!',t:1.1,c:'#ffd94d'});swSnd(520,.07,760);return}}}}}
 wCamUpdate(P3.x,P3.y);
 for(const b of SW.buildings)if(b.k==='nursery'&&b.crop){const rate=1+(wCrewAt(SW.buildings.indexOf(b)).length?1:0);
  b.crop.t+=dt*rate;const ns=b.crop.t<25?1:b.crop.t<50?2:3;
  if(ns!==b.crop.stage){b.crop.stage=ns;
   if(ns===3&&W4.sector==='BASE'){W4.floats.push({x:wCellX(b.gx)+10,y:wCellY(b.gy)-4,txt:'READY!',t:1.6,c:'#7ee787'});swSnd(784,.08,1175)}}}
 if(W4.wilds&&sec.table){for(const wd of W4.wilds){wd.t-=dt;
   if(wd.reveal!=null){wd.reveal-=dt;if(wd.reveal<=0){wd.gone=true;continue}}
   if(wd.t<=0){const ps=wGrassPatches(),pp=ps[(Math.random()*ps.length)|0];
    wd.tx=pp.x+6+Math.random()*(pp.w-12);wd.ty=pp.y+6+Math.random()*(pp.h-12);wd.t=2.5+Math.random()*3;
    if(wd.reveal!=null){wd.tx=wd.hx+(Math.random()*26-13);wd.ty=wd.hy+(Math.random()*18-9)}}
   const dx=wd.tx-wd.x,dy=wd.ty-wd.y,d=Math.hypot(dx,dy);
   if(d>3){wd.x+=dx/d*13*dt;wd.y+=dy/d*13*dt}}
  /* wilds never ambush (v4.7): battles are ACTIVATED — A on a wild, or a sprout thrown at it */
  for(let wi=W4.wilds.length-1;wi>=0;wi--)if(W4.wilds[wi].gone)W4.wilds.splice(wi,1);
  if(W4.wildCd>0){W4.wildCd-=dt;if(W4.wildCd<=0&&W4.wilds.length<3)W4.wilds.push(wSpawnWild(sec))}}
 {const lead=SW.party.find(m=>m.hp>0);
  if(lead){W4.part=W4.part||{x:P3.x-14,y:P3.y+6};
   if(W4.cmdT&&!W4.cmdT.nd.got){const nd=W4.cmdT.nd,dx=nd.x-W4.part.x,dy=nd.y-W4.part.y,d=Math.hypot(dx,dy);
    if(d<7){W4.cmdWork={nd,t:0};W4.cmdT=null}
    else{W4.part.x+=dx/d*100*dt;W4.part.y+=dy/d*100*dt}}
   if(W4.cmdWork){const cw=W4.cmdWork,nd=cw.nd;
    if(nd.got)W4.cmdWork=null;
    else{W4.part.x=nd.x;W4.part.y=nd.y+9;cw.t-=dt;
     if(cw.t<=0){cw.t=.34;nd.hp-=2;nd.shake=.25;W4.floats.push({x:nd.x,y:nd.y-14,txt:'-2',t:.7,c:'#ffe8b0'});swSnd(240,.04,140);
      if(nd.hp<=0){wNodeDrop(nd);W4.cmdWork=null}}}}
   else{const dx=P3.x-W4.part.x,dy=(P3.y+8)-W4.part.y,d=Math.hypot(dx,dy);
    if(d>17){W4.part.x+=dx/d*68*dt;W4.part.y+=dy/d*68*dt}}}}
 if(W4.sector==='BASE'){if(W4.petCd>0)W4.petCd-=dt;
  wLouTick(dt);
  if(!W4.amb)W4.amb=[0,1,3,4].map(i=>({type:i,x:60+i*100,y:150+((i*67)%220),tx:0,ty:0,t:i}));
  for(const a of W4.amb){a.t-=dt;
   if(a.t<0){a.tx=26+Math.random()*(WW-52);a.ty=70+Math.random()*((W4.wh||360)-110);a.t=2+Math.random()*3}
   const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d>2){a.x+=dx/d*11*dt;a.y+=dy/d*11*dt}}}
 if(W4.sector==='BASE'&&SW.quest===1&&!SW.tendDone)wTendUpdate(dt);
 wJobWork(dt);
 W4.dayT=(W4.dayT||0)+dt;if(W4.dayT>=300){W4.dayT-=300;SW.day=(SW.day||1)+1;swSave();
  if(SW.bottieSeen&&!SW.bottieBeat&&W4.sector==='BASE'&&SW.party.some(m=>m.hp>0)&&Math.random()<.3){wStartRaid();return}}
 if(!SW.bottieSeen&&SW.badges.length>=1&&SW.quest>=5&&W4.sector==='BASE'&&!W4.talk&&!W4.sayT){W4.botT=0;W4.botPhase=0;W4.botPage=0;state='g4bottie';swSnd(98,.35,65);return}
 if(wDark()>.5&&SW.lessons&&!SW.lessons.night){SW.lessons.night=1;swSay('Night falls. Wild buddies grow bolder out there.',2.6);swSave()}
 if(W4.bushes)for(const b of W4.bushes)if(b.fruit<2){b.rg+=dt;if(b.rg>12){b.rg=0;b.fruit++}}
 if(W4.sector==='BASE'&&SW.tendDone&&W4.patchBuds)wPatchUpdate(dt);
 wFolUpdate(dt);
 if(W4.loose)for(const lb of W4.loose){lb.x=lb.hx+Math.sin(time*.6+lb.hy*.8)*7;lb.y=lb.hy+Math.cos(time*.5+lb.hx*.6)*5}
 if(W4.treasure&&Math.hypot(P3.x-W4.treasure.x,P3.y-W4.treasure.y)<11){const tx2=W4.treasure.x,ty2=W4.treasure.y;W4.treasure=null;SW.treasures=(SW.treasures||0)+1;wTreasureReward(tx2,ty2)}
 W4.near=wNear();
 if(pressed('a')&&W4.near){const n=W4.near;
  if(n.k==='fbud')wPluckSeed(n.b);
  else if(n.k==='node')wNodeAct(n.nd);
  else if(n.k==='sign'){if(W4.sector==='BASE'&&SW.quest===2&&!SW.gateSeen){SW.gateSeen=1;W4.gatePage=0;state='g4gate';swSave()}
   else{swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}}
  else if(n.k==='gym'){if(SW.quest<5)swSay(WGYMS[sec.gym].leader+': "Easy, keeper. Set up camp and catch a buddy first — then we battle."',3.4);
   else{W4.gymIx=wGymIx(sec);W4.gymPage=0;swSel=0;state='g4gym'}}
  else if(n.k==='choice'){W4.choiceSp=n.sp;state='g4choice'}
  else if(n.k==='wild'){const wd=n.wd;W4.wilds.splice(W4.wilds.indexOf(wd),1);W4.wildCd=18;
   wEngage('WILD '+wd.sp+'!',()=>wStartWildAt(wd.sp,wd.lv))}
 else if(n.k==='plot'){if(n.pb.crop&&n.pb.ripe)plHarvest(n.pb);else{W4.plotPb=n.pb;swSel=n.pb.crop==='berry'?1:n.pb.crop==='fiber'?2:0;state='g4plot'}}
 else if(n.k==='sproutinfo'){W4.floats.push({x:n.x,y:n.y-16,txt:n.msg,t:2.2,c:'#cfe0b8'});swSnd(660,.05,880)}
  else if(n.k==='wildpluck'){const lb=n.lb;W4.loose.splice(W4.loose.indexOf(lb),1);
   if(SW.followers.length<4){SW.followers.push(lb.type);wFolSync();
    W4.floats.push({x:lb.x,y:lb.y-14,txt:TYPES[lb.type].n+' SPROUT FOLLOWS YOU!',t:1.6,c:'#7ee787'});
    if(SW.lessons&&!SW.lessons.fol){SW.lessons.fol=1;swSay('It follows you! Wild sprouts haul finds back to Sunkeep.',3)}swSnd(880,.06,1175)}
   else{SW.buds[TYPES[lb.type].n]=(SW.buds[TYPES[lb.type].n]||0)+1;
    W4.floats.push({x:lb.x,y:lb.y-14,txt:'+1 '+TYPES[lb.type].n+' SPROUT (train full)',t:1.4,c:'#7ee787'});swSnd(880,.06,1175)}
   swSave()}
  else if(n.k==='pluck'){if(n.pb.forPlot)n.pb.forPlot.by=null;if(n.pb.bush)n.pb.bush=null;SW.buds[TYPES[n.pb.type].n]=(SW.buds[TYPES[n.pb.type].n]||0)+1;
  W4.floats.push({x:n.pb.x,y:n.pb.y-14,txt:'+1 '+TYPES[n.pb.type].n+' SPROUT',t:1.4,c:'#7ee787'});
  n.pb.type=-1;n.pb.age=-6;n.pb.mode='soil';n.pb.item=false;n.pb.dlv=0;n.pb.seedTy=null;n.pb.by=null;n.pb.forPlot=null;n.pb.bush=null;n.pb.x=n.pb.sx;n.pb.y=n.pb.sy;
  swSnd(880,.06,1175);swSave()}
 else if(n.k==='tendpluck'){const ty2=n.b.type;SW.buds[TYPES[ty2].n]=(SW.buds[TYPES[ty2].n]||0)+1;SW.plucked=(SW.plucked||0)+1;SW.trioPlucked.push(ty2);
  W4.tend.buds.splice(W4.tend.buds.indexOf(n.b),1);
  W4.floats.push({x:n.b.x,y:n.b.y-14,txt:'+1 '+TYPES[ty2].n+' SPROUT',t:1.4,c:'#7ee787'});swSnd(880,.06,1175);
  if(SW.plucked===1)swSay('LOUIE: A plucked sprout rides with you. Toss it at a buddy!',2.8);
  if(SW.plucked>=2){SW.tendDone=true;SW.tendStage=4;W4.tend.active=false;wInitPatch();
   swSay('LOUIE: You grew those yourself, keeper. That is how sprouts work.',3.4);swSnd(784,.12,1175)}
  swSave()}
 else if(n.k==='patch'){if(SW.quest===0){swSay('Louie first — he is waiting by the path, and he watches this patch.',2.2);return}wStartTend()}
  else if(n.k==='npc'){if(n.who==='PIP'||n.who==='ELDER')wOpenAsk(n.who);else{W4.talk={who:n.who,page:0};SW.talkN[n.who]=(SW.talkN[n.who]||0)+1}}
  else if(n.k==='louie')wLouTalk();
  else if(n.k==='lantern'){if(!wLit())swSay('The Great Lantern is dark and cracked. It is hungry for anything that grows.',3.2);else{swSel=0;state='g4lamp'}}
  else if(n.k==='bld'){const b=n.b;
   if(b.k==='cottage'){swSel=0;state='g4cot'}
   else if(b.k==='nursery'){W4.nurB=SW.buildings.indexOf(b);swSel=0;state='g4nur'}
   else if(b.k==='bench'){swSel=0;state='g4tools'}
   else if(b.k==='datacenter'){swSel=0;state='g4party'}
   else if(wBuildDef(b.k).yields){W4.assignB=SW.buildings.indexOf(b);swSel=0;state='g4assign'}
   else swSay(wBuildDef(b.k).n+' — '+wBuildDef(b.k).d,3)}
  return}
 fBaseTick(dt);
 if(pressed('start')){swSel=0;state='g4pause'}}
function wDrawTree(x,y,s){
 r('#3c2a16',x-6*s,y-1*s,12*s,3*s);
 r('#5a3d22',x-2.5*s,y-13*s,5*s,13*s);r('#7d5a36',x-2.5*s,y-13*s,2*s,13*s);r('#4a3520',x+1*s,y-13*s,1.5*s,13*s);
 r('#5a3d22',x-6*s,y-9*s,4*s,2*s);r('#5a3d22',x+2*s,y-10*s,4*s,2*s);
 r('#1e4018',x-15*s,y-30*s,30*s,17*s);
 r('#26511f',x-13*s,y-33*s,26*s,17*s);r('#2e5a26',x-10*s,y-36*s,20*s,12*s);
 r('#35702c',x-7*s,y-35*s,12*s,7*s);r('#58c048',x-5*s,y-34*s,7*s,4*s);
 r('#26511f',x-14*s,y-22*s,7*s,6*s);r('#26511f',x+7*s,y-23*s,8*s,7*s);
 r('#ffd94d',x-8*s,y-27*s,2*s,2*s);r('#ffd94d',x+6*s,y-29*s,2*s,2*s);r('#f8e8a0',x+1*s,y-25*s,2*s,2*s);
 r('#e04838',x-3*s,y-29*s,2*s,2*s)}
function wDrawNode(nd){const x=nd.x+(nd.shake>0?Math.sin(time*70)*1.5:0),y=nd.y;
 if(nd.k==='tree'){r('rgba(0,0,0,.20)',x-11,y+3,22,4);wDrawTree(x,y+4,1.15)}
 else if(nd.k==='rock'){r('rgba(0,0,0,.20)',x-12,y+4,24,4);
  r('#3f4654',x-13,y-6,26,12);r('#565f6e',x-11,y-9,22,13);r('#6e7889',x-8,y-12,16,9);
  r('#98a0b0',x-6,y-11,9,4);r('#c3ccd9',x-5,y-10,5,2);
  r('#3f4654',x+2,y-6,2,6);r('#3f4654',x-4,y-3,2,3);
  r('#58c048',x-9,y-2,5,2);r('#35702c',x+6,y-1,4,2)}
 else{r('#1e4018',x-12,y-6,24,10);r('#26511f',x-11,y-9,22,11);r('#2e5a26',x-8,y-12,16,8);r('#58c048',x-5,y-11,6,3);
  r('#e04838',x-5,y-6,3,3);r('#ffffff',x-4,y-6,1,1);r('#e04838',x+3,y-4,3,3);r('#ffffff',x+4,y-4,1,1);
  r('#f078c0',x-1,y-8,2,2);r('#e04838',x+6,y-7,2,2)}}
function wDrawHouse(x,y){r('rgba(0,0,0,.18)',x-2,y+42,68,4);
 r('#e8dcc0',x,y+12,64,32);r('#d8c8a8',x,y+36,64,8);
 r('#8a6a48',x,y+12,64,4);r('#8a6a48',x,y+40,64,4);r('#8a6a48',x,y+12,4,32);r('#8a6a48',x+60,y+12,4,32);r('#8a6a48',x+30,y+12,4,32);
 r('#9a9aa2',x+48,y-5,9,9);r('#7c7c86',x+48,y-5,9,3);
 r('#7a2e22',x-5,y+2,74,12);r('#8a3a2a',x-5,y+2,74,4);r('#5a241c',x-5,y+12,74,2);
 r('#5a4632',x+27,y+26,10,18);r('#3a2a1c',x+28,y+27,8,17);r('#ffd94d',x+34,y+35,2,2);
 r('#d8c8a8',x+7,y+20,11,10);r('#7ec8e8',x+9,y+22,7,6);
 r('#d8c8a8',x+45,y+20,11,10);r('#ffd94d',x+47,y+22,7,6);r('#fff3b0',x+48,y+23,3,3)}
function wDrawDecor(d){const x=d.x,y=d.y,s=d.s||1;
 if(d.k==='house'){wDrawHouse(x,y);return}
 if(d.k==='tree')wDrawTree(x,y,s);
 else if(d.k==='flower'){r('#35702c',x-1,y-5,2,6);r('#f078c0',x-3,y-9,6,5);r('#fff3b0',x-1,y-7,2,2)}
 else if(d.k==='cactus'){r('#26511f',x-3,y-16*s,6,16*s);r('#35702c',x-3,y-16*s,3,16*s);r('#58c048',x-2,y-15*s,1,14*s);
  r('#26511f',x-7,y-11*s,3,6*s);r('#26511f',x+4,y-13*s,3,8*s);r('#f078c0',x-2,y-19*s,4,3);r('#fff3b0',x-1,y-18*s,2,1)}
 else if(d.k==='shell'){r('#e8d0c8',x-5,y-3,10,5);r('#f8e8e0',x-4,y-4,8,3);r('#f0b8d8',x-3,y-4,6,2);r('#ffffff',x-1,y-3,2,1)}
 else if(d.k==='shroom'){r('#d8cbb2',x-1,y-4,3,5);r('#5e3580',x-6,y-9,12,6);r('#7a4a9e',x-6,y-9,12,3);r('#c9a0ff',x-3,y-7,2,2);r('#c9a0ff',x+2,y-8,2,2);r('#ffffff',x,y-6,1,1)}
 else if(d.k==='snowrock'){r('#565f6e',x-8,y-5,16,9);r('#6e7889',x-7,y-6,14,8);r('#ffffff',x-6,y-8,12,4);r('#dfeefc',x-4,y-7,6,2)}}
function wBakeGround(){const sec=wSector(W4.sector),pal=sec.pal,wh=W4.wh||360;
 const cv=document.createElement('canvas');cv.width=WW;cv.height=wh;const b=cv.getContext('2d');
 const R=(c,x,y,w,h)=>{b.fillStyle=c;b.fillRect(x,y,w,h)};
 R(pal.g,0,0,WW,wh);
 b.globalAlpha=.20;for(let tx=0;tx<WW/20;tx++)for(let ty=0;ty<wh/20;ty++)if((tx+ty)%2)R(pal.g2,tx*20,ty*20,20,20);b.globalAlpha=1;
 const rnd=wSeedRand(wSectorSeed(sec.id));
 for(let i=0;i<200;i++){const x=rnd()*WW,y=rnd()*wh;
  if(i%23===0){R(pal.a,x,y-2,1,3);R(pal.a,x+2,y-1,1,2)}
  else if(i%31===0){R('#f078c0',x,y,2,2);R('#ffffff',x+1,y-1,1,1)}
  else if(i%43===0){R('#8fd45e',x,y,1,2);R('#8fd45e',x+2,y+1,1,1);R('#8fd45e',x-2,y+1,1,1)}
  else R(i%3?pal.g2:pal.a,x,y,2,2)}
 if(sec.id==='BASE'){const pc=6+Math.min(2,SW.buildings.filter(b=>b.k==='bed').length);
  R('#8a6a48',162,330,156,3);R('#8a6a48',162,384,156,3);R('#8a6a48',162,330,3,57);R('#8a6a48',315,330,3,57);
  for(let fx=162;fx<=315;fx+=22){R('#6e5233',fx,327,4,7);R('#6e5233',fx,381,4,7)}
  const PL=[[208,348],[240,348],[272,348],[208,374],[240,374],[272,374],[176,361],[304,361]];
  for(let i2=0;i2<pc;i2++){const[px3,py3]=PL[i2];R('#6a4a2c',px3-11,py3-6,22,13);R('#7d5a36',px3-11,py3-6,22,2);R('#5a3d24',px3-8,py3-1,16,2);R('#5a3d24',px3-8,py3+3,16,2)}}
 const rnd2=wSeedRand(wSectorSeed(sec.id)+7);
 for(let i=0;i<6;i++){const px2=rnd2()*(WW-60),py2=44+rnd2()*(wh-90);
  b.globalAlpha=.13;R(pal.g2,px2,py2,46,26);R(pal.g2,px2+9,py2-6,28,38);b.globalAlpha=1}
 /* biome dressing: each sector's ground tells you where you are */
 if(sec.id==='WASTES'){b.globalAlpha=.16;for(let i=0;i<26;i++)R('#e8c898',rnd2()*450+8,rnd2()*300+24,7+(i%3)*3,1);
  b.globalAlpha=.9;const bx2=60+rnd2()*300,by2=90+rnd2()*180;
  R('#e8e0cc',bx2,by2,9,2);R('#e8e0cc',bx2+2,by2-2,2,2);R('#e8e0cc',bx2+6,by2-2,2,2);R('#e8e0cc',bx2+3,by2+2,3,1);b.globalAlpha=1}
 if(sec.id==='SHORE'){b.globalAlpha=.20;R('#5a7a8c',0,wh-34,480,14);b.globalAlpha=.8;
  for(let i=0;i<12;i++)R(i%2?'#f0e0d0':'#e8b8c8',rnd2()*460+6,rnd2()*290+20,2,1);b.globalAlpha=1}
 if(sec.id==='GLOOM'){for(let i=0;i<7;i++){b.globalAlpha=.13;R('#06040f',rnd2()*430+10,rnd2()*290+20,30+rnd2()*36,16+rnd2()*18)}
  b.globalAlpha=.85;for(let i=0;i<14;i++){const px2=rnd2()*460+6,py2=rnd2()*300+22;
   R('#8fe8e0',px2,py2,1,2);R('#b090e8',px2-1,py2-1,3,1)}b.globalAlpha=1}
 if(sec.id==='PEAK'){for(let i=0;i<8;i++){b.globalAlpha=.20;R('#ffffff',rnd2()*430+10,rnd2()*290+20,24+rnd2()*30,10+rnd2()*12)}
  b.globalAlpha=.9;for(let i=0;i<16;i++)R('#ffffff',rnd2()*470+3,rnd2()*310+16,1,1);b.globalAlpha=1}
 if(sec.id==='MEADOW'||sec.id==='BASE'||sec.id==='TOWN'){for(let i=0;i<9;i++){const px2=rnd2()*450+10,py2=rnd2()*300+22;
   R(['#f0b8d8','#f8e060','#ffffff'][i%3],px2,py2,1,2);R(['#f0b8d8','#f8e060','#ffffff'][i%3],px2-1,py2+1,3,1);R('#3f7a2e',px2,py2+2,1,1)}}
 if(sec.table){b.globalAlpha=.38;for(let py2=44;py2<wh-16;py2+=18)R('#8a7a52',WW/2-8,py2,16,18);b.globalAlpha=1}
 if(sec.id==='TOWN'){b.globalAlpha=.55;for(let px2=0;px2<WW;px2+=20)R('#77683f',px2,196,20,18);for(let py2=70;py2<wh-24;py2+=20)R('#77683f',WW/2-9,py2,18,20);b.globalAlpha=1;
  for(let px2=4;px2<WW;px2+=16)R('#8a7a52',px2,193,6,2)}
 if(sec.id==='BASE'){b.globalAlpha=.5;for(let py2=74;py2<wh-24;py2+=20)R('#77683f',WW/2-9,py2,18,20);b.globalAlpha=1;
  for(let px2=176;px2<304;px2+=16)for(let py2=10;py2<86;py2+=12)R((px2+py2)%32?'#9a8f7a':'#8a7f6a',px2,py2,15,11);
  R('#6e6350',174,7,132,3);R('#6e6350',174,85,132,3)}
 W4.groundCv=cv;W4.groundFor=sec.id+'x'+wh}
function wDrawWorld(){if(W4.fld){fDraw();return}const sec=wSector(W4.sector),pal=sec.pal;
 const cam=W4.cam||{x:0,y:0};
 r('#0c120a',0,0,W,H);
 g.save();g.translate(-cam.x,-cam.y);
 if(W4.groundFor!==sec.id+'x'+(W4.wh||360))wBakeGround();
 g.drawImage(W4.groundCv,0,0);
 W4.front=[];for(const d of(W4.decor||[])){
  if(d.k==='tree'||d.k==='snowrock'){if(d.y>P3.y)W4.front.push(['d',d]);else wDrawDecor(d)}
  else wDrawDecor(d)}
 for(const p of wGrassPatches())if(sec.table){r('#2f6629',p.x,p.y,p.w,p.h);
  const gr=wSeedRand(wSectorSeed(sec.id)+p.x*3+p.y);
  for(let i=0;i<p.w*1.7;i++){const gx=p.x+gr()*p.w,gy=p.y+gr()*p.h,bh=3+((gr()*3)|0);
   r(gr()<.22?'#7ec850':'#58c048',gx,gy,1,bh);if(gr()<.1)r('#a8e078',gx,gy,1,1)}
  for(let i=0;i<4;i++)r('#ffd94d',p.x+((i*37)%p.w),p.y+((i*23)%p.h),1,1)}
 if(sec.table){
  for(let py2=86;py2<(W4.wh||360)-30;py2+=92){const sx2=(py2%184<92)?WW/2-17:WW/2+14;
   r('#4a3a24',sx2,py2,3,10);r('#ffd23f',sx2-1,py2-3,5,4);r('#fff3b0',sx2,py2-2,3,2)}}
 if(sec.id==='SHORE'){r('#3a7ab8',0,WH-18,WW,18);for(let i=0;i<16;i++)r('#b0e0f8',(i*31+((time*14)|0)%31)%WW,WH-12+((i*7)%6),9,1)}
 if(sec.id==='GLOOM')r('rgba(10,6,24,.32)',0,0,WW,WH);
 if(sec.id==='PEAK')for(let i=0;i<40;i++)r('#ffffff',(i*47)%WW,20+((i*29)%(WH-30)),2,1);
 for(const nd of W4.nodes)if(!nd.got){
  if((nd.k==='tree'||nd.k==='rock')&&nd.y>P3.y)W4.front.push(['n',nd]);else wDrawNode(nd)}
  if(W4.bushes)for(const b of W4.bushes){r('#3f7a34',b.x-9,b.y-5,18,10);r('#4c8a3e',b.x-7,b.y-8,14,6);r('#5da244',b.x-4,b.y-10,8,4);
   for(let fi=0;fi<b.fruit;fi++)r(TYPES[b.type].d,b.x-5+fi*6,b.y-3,4,4)}
 for(const wd of(W4.wilds||[])){const spr=wSp(wd.sp)._spr,bob=Math.sin(time*4+wd.x)*1;
  if(wd.reveal!=null||Math.hypot(P3.x-wd.x,P3.y-wd.y)<30)text('!',Math.round(wd.x)-1,Math.round(wd.y)-24+((time*2.4)|0)%2,1,'#ffd94d','#14101e');
  r('rgba(0,0,0,.22)',wd.x-8,wd.y-1,16,3);
  g.drawImage(spr.ol,Math.round(wd.x)-11,Math.round(wd.y)-18+bob,22,Math.round(22*spr.oh/spr.ow))}
 if(sec.gym>=0){const gx=WW/2-32,gy=26,gl0=WGYMS[wGymIx(sec)],gc=TYPES[wSp(gl0.team[0][0]).t[0]].d;
  r('rgba(0,0,0,.20)',gx-6,gy+40,76,4);
  r('#e8dcc0',gx,gy+6,64,34);r('#d8c8a8',gx,gy+34,64,6);
  r('#8a6a48',gx+3,gy+10,5,30);r('#8a6a48',gx+56,gy+10,5,30);r('#6e5236',gx+3,gy+10,5,3);r('#6e5236',gx+56,gy+10,5,3);
  r('#7a2e22',gx+14,gy-4,36,5);r('#7a2e22',gx+7,gy+1,50,5);r('#8a3a2a',gx-4,gy+6,72,5);r('#5a241c',gx-4,gy+11,72,2);
  r(gc,gx+12,gy+13,4,16);r(gc,gx+48,gy+13,4,16);r('#ffffff',gx+12,gy+15,4,2);r('#ffffff',gx+48,gy+15,4,2);
  r('#d8c8a8',gx+20,gy+14,9,9);r('#7ec8e8',gx+22,gy+16,5,5);r('#d8c8a8',gx+35,gy+14,9,9);r('#7ec8e8',gx+37,gy+16,5,5);
  r('#ffd23f',gx+25,gy+21,14,19);r('#3a2a1c',gx+27,gy+23,10,17);r('#ffd94d',gx+35,gy+31,2,2);
  const gl=gl0;text(gl.crown?'CHAMPION':gl.sig,gx+32-tw(gl.crown?'CHAMPION':gl.sig,1)/2,gy+14,1,'#7a2e22',null);
  if(SWCHR[gl.leader])wChar(gl.leader,WW/2,82,26);
  else if(CH[gl.leader])g.drawImage(CH[gl.leader],WW/2-9,58,18,21);
  else if(gl.crown){r('#ffd94d',WW/2-4,58,8,10);r('#fff2b0',WW/2-3,59,6,5);r('#8a5a28',WW/2-1,68,2,5)}
  r('rgba(10,14,8,.55)',WW/2-tw(gl.leader,1)/2-2,79,tw(gl.leader,1)+4,9);
  text(gl.leader,WW/2-tw(gl.leader,1)/2,80,1,'#fff',null)}
 if(W4.sector==='BASE'&&SW.quest<=1&&!SW.tendDone){
  r('#6a4a2c',196,336,88,30);r('#7d5a36',196,336,88,4);
  r('#5a3d24',204,346,72,3);r('#5a3d24',204,356,72,3);
  for(const it2 of ((W4.tend&&W4.tend.active)?W4.tend.items:(W4.items||WTENDITEMS.map(([x,y])=>({x,y,taken:false,regrow:0}))))){
   if(!it2.taken){r('#c93a2e',it2.x-2,it2.y-2,5,5);r('#7ec850',it2.x,it2.y-4,2,2)}
   else if(it2.regrow>0&&it2.regrow<5)r('#7ec850',it2.x-1,it2.y-1,2,2)}
  if(W4.tend&&W4.tend.active){if(SW.tendStage===1&&!W4.tend.buds.length){for(let mi=0;mi<3;mi++){const mx=212+mi*24;r('#5a3d24',mx,346,10,5);r('#8a6a42',mx+2,344,6,3);const dp=((time*3+mi)|0)%2;r('#7ec8f8',mx+3,340+dp*2,2,3);r('#7ec8f8',mx+6,341+dp*2,2,2)}}
   for(const b2 of W4.tend.buds){if(b2.y>P3.y)continue;
   drawBud({x:Math.round(b2.x),y:Math.round(b2.y)+2,type:b2.type,stage:b2.stage||0,z:0,a:b2.type*1.3,mv:b2.st==='go'||b2.st==='carry',st:'idle',fx:1});
   if(b2.item){r('#c93a2e',Math.round(b2.x)-2,Math.round(b2.y)-12,5,5);r('#7ec850',Math.round(b2.x),Math.round(b2.y)-14,2,2)}}}
  else for(let mi=0;mi<3;mi++){const mx=212+mi*24;r('#5a3d24',mx,346,10,5);r('#8a6a42',mx+2,344,6,3);r('#3d2c1a',mx+4,343,2,2)}}
 if(W4.sector==='BASE'){
  for(let py2=120;py2<W4.wh-60;py2+=92){const sx2=(py2%184<92)?WW/2-17:WW/2+14;
   r('#4a3a24',sx2,py2,3,10);r('#ffd23f',sx2-1,py2-3,5,4);r('#fff3b0',sx2,py2-2,3,2)}
 {let pi=0;for(let ci=0;ci<SW.crew.length;ci++){const c=SW.crew[ci];if(c.job===-1&&!c.atPatch&&pi<6){
   drawBud({x:196+pi*18,y:134+Math.round(Math.sin(time*2+ci)*0.7),type:c.type,stage:2,z:0,a:ci*.9+1,mv:false,st:'idle',fx:1});pi++}}}
 if(W4.sector==='BASE'){
  for(const it2 of ((W4.tend&&W4.tend.active)?W4.tend.items:[])) {
   if(!it2.taken){r('#c93a2e',it2.x-2,it2.y-2,5,5);r('#7ec850',it2.x,it2.y-4,2,2)}
   else if(it2.regrow>0&&it2.regrow<5)r('#7ec850',it2.x-1,it2.y-1,2,2)}
  if(W4.patchBuds)for(const pb of W4.patchBuds){
   if(pb.type<0){r('#5a3d24',pb.sx-5,pb.sy,11,4);r('#8a6a42',pb.sx-3,pb.sy-1,7,2);r('#3d2c1a',pb.sx-1,pb.sy-2,2,2);if(pb.crop)plDraw(pb);else if(pb.seedTy!=null)r(TYPES[pb.seedTy].d,pb.sx-1,pb.sy-4,3,3);continue}
   if(pb.y<=P3.y)wDrawPatchBud(pb)}} /* front-layer buds draw after the player, below */
  r('#a87948',30,W4.wh-58,138,3);r('#a87948',312,W4.wh-58,138,3);
  for(let fx2=30;fx2<=168;fx2+=23)r('#8a6a48',fx2,W4.wh-62,3,11);
  for(let fx2=312;fx2<=450;fx2+=23)r('#8a6a48',fx2,W4.wh-62,3,11);
  for(const h of(W4.groundHearts||[])){r('#f078c0',h.x-3,h.y-2,3,3);r('#f078c0',h.x,h.y-2,3,3);
   r('#f078c0',h.x-2,h.y+1,5,2);r('#f078c0',h.x-1,h.y+3,3,1)}
  if(W4.sector==='BASE')wShrine();
  for(const b of SW.buildings)if(wCellY(b.gy)+18<=P3.y)wDrawBuilding(b);
  {const sid=W4.sector,pm=(sid==='PEAK'?8:sid==='SHORE'?0:6);
   for(let i2=0;i2<pm;i2++){const sd=i2*47.3+sid.length*13;
    if(sid==='PEAK'){const px2=((sd*7+time*9*(1+i2%3))%(WW+16))-8,py2=((sd*3+time*16)%(W4.wh+10))-5;r('rgba(255,255,255,.85)',Math.round(px2),Math.round(py2),1,1)}
    else if(sid==='GLOOM'){const px2=sd%(WW-20)+10,py2=W4.wh-((time*7+i2*53)%(W4.wh-30))-16;r('rgba(140,240,225,.5)',Math.round(px2+Math.sin(time+i2)*3),Math.round(py2),1,1)}
    else if(sid==='WASTES'){const px2=((sd*11+time*46)%(WW+30))-15,py2=(sd*5)%(W4.wh-40)+30;r('rgba(232,200,150,.5)',Math.round(px2),Math.round(py2),3,1)}
    else{const px2=((sd*9+time*11)%(WW+14))-7,py2=((sd*4+time*6)%(W4.wh-50))+24;r(i2%2?'rgba(240,184,216,.75)':'rgba(255,255,255,.7)',Math.round(px2+Math.sin(time*1.4+i2*2)*3),Math.round(py2),2,1)}}}
  for(const np of wNpcList()){r('rgba(0,0,0,.25)',np.x-7,np.y-1,14,3);
   fChibi(Math.round(np.x),Math.round(np.y)+3,FLOOK[np.who]||FLOOK.WILL,np.dir||[0,1],!!np.mv);
   if(Math.hypot(P3.x-np.x,P3.y-np.y)<70&&wOp()>=3&&!(W4.quips||[]).some(q=>q.who===np.who)){r('rgba(10,14,8,.55)',np.x-tw(np.who,1)/2-2,np.y+2,tw(np.who,1)+4,9);
   text(np.who,np.x-tw(np.who,1)/2,np.y+3,1,'#ffe8b0',null)}}
  louDraw();
  if(Math.hypot(P3.x-lou.x,P3.y-lou.y)<70&&wOp()>=3&&!(W4.quips||[]).some(q=>q.who==='LOUIE')){r('rgba(10,14,8,.55)',Math.round(lou.x)-tw('LOUIE',1)/2-2,Math.round(lou.y)+6,tw('LOUIE',1)+4,9);
  text('LOUIE',Math.round(lou.x)-tw('LOUIE',1)/2,Math.round(lou.y)+7,1,'#ffe8b0',null)}
  if(W4.louLead)text('!',Math.round(lou.x)-1,Math.round(lou.y)-17,2,'#ffd94d',null)
  if(SW.quest===1&&SW.tendDone&&!SW.party.length)for(const c of WCHOICE){const spr=wSp(c.sp)._spr,bob=Math.sin(time*3+c.x)*1;
   r('rgba(0,0,0,.22)',c.x-8,c.y-1,16,3);
   g.drawImage(spr.ol,Math.round(c.x)-13,Math.round(c.y)-spr.oh+4+Math.round(bob),spr.ow,spr.oh);
   if(c===WCHOICE.slice().sort((a,b)=>Math.hypot(a.x-P3.x,a.y-P3.y)-Math.hypot(b.x-P3.x,b.y-P3.y))[0]){r('rgba(10,14,8,.55)',c.x-tw(c.sp,1)/2-2,c.y+3,tw(c.sp,1)+4,9);
   text(c.sp,c.x-tw(c.sp,1)/2,c.y+4,1,'#ffe8b0',null)}}}
 if(W4.sector==='BASE'&&W4.jobPos)SW.crew.forEach((c,ci)=>{if(c.job!==-2&&c.job!==-3)return;const jp=W4.jobPos[ci];if(!jp)return;
  drawBud({x:Math.round(jp.x),y:Math.round(jp.y)+2,type:c.type,stage:2,z:0,a:ci*1.71,mv:!!(jp.nd&&Math.hypot(jp.x-jp.nd.x,jp.y-jp.nd.y)>7),st:'idle',fx:1});
  const sw2=Math.sin(time*7+ci)>0;
  if(c.job===-2){r('#8a6a48',Math.round(jp.x)+3,Math.round(jp.y)-10+(sw2?0:1),1,5);r('#c8ccd4',Math.round(jp.x)+1,Math.round(jp.y)-12+(sw2?0:1),4,2)}
  else{r('#8a6a48',Math.round(jp.x)+3,Math.round(jp.y)-10+(sw2?0:1),1,5);r('#c8ccd4',Math.round(jp.x),Math.round(jp.y)-12+(sw2?0:1),6,1)}});
 {const lead=SW.party.find(m=>m.hp>0);
  scWorldFx();if(W4.bf&&W4.bf.pf){for(const b of W4.bf.pf)pfDraw(b)}
  else if(lead&&W4.part){const spr=wSp(lead.sp)._spr,bob=Math.sin(time*5)*1;
   r('rgba(0,0,0,.22)',W4.part.x-8,W4.part.y-1,16,3);
   g.drawImage(spr.ol,Math.round(W4.part.x)-13,Math.round(W4.part.y)-spr.oh+4+Math.round(bob),spr.ow,spr.oh)}}
 if(W4.tossFx){const tf=W4.tossFx,ld=SW.party.find(m=>m.hp>0);
  r('#ffd23f',tf.x-5,tf.y-1,10,2);r('#ffd23f',tf.x-1,tf.y-5,2,10);
  if(ld){const ls=wSp(ld.sp)._spr;g.drawImage(ls.ol,Math.round(tf.x)-7,Math.round(tf.y)-17,14,Math.round(14*ls.oh/ls.ow))}}
 if(W4.bf){fSqDraw(W4.bf,false);wkDraw(false)}
 wHero(P3.x,P3.y);
 if(W4.sector==='BASE'&&W4.patchBuds)for(const pb of W4.patchBuds)if(pb.type>=0&&pb.y>P3.y)wDrawPatchBud(pb);
 if(W4.tend&&W4.tend.active)for(const b2 of W4.tend.buds){if(b2.y<=P3.y)continue;
  drawBud({x:Math.round(b2.x),y:Math.round(b2.y)+2,type:b2.type,stage:b2.stage||0,z:0,a:b2.type*1.3,mv:b2.st==='go'||b2.st==='carry',st:'idle',fx:1});
  if(b2.item){r('#c93a2e',Math.round(b2.x)-2,Math.round(b2.y)-12,5,5);r('#7ec850',Math.round(b2.x),Math.round(b2.y)-14,2,2)}}
 if(W4.sector==='BASE')for(const b of SW.buildings)if(wCellY(b.gy)+18>P3.y)wDrawBuilding(b);
 if(W4.bf){fSqDraw(W4.bf,true);wkDraw(true);fRing(W4.bf)}
 for(const f of W4.floats){const ft=wFit(f.txt,190),cx0=W4.cam?W4.cam.x:0;
  const fx2=Math.max(cx0+tw(ft,1)/2+3,Math.min(cx0+W-tw(ft,1)/2-3,f.x));
  text(ft,Math.round(fx2-tw(ft,1)/2),Math.round(f.y-(1.4-f.t)*8),1,f.c,null)}
 for(const [fk,fo] of (W4.front||[])){if(fk==='n')wDrawNode(fo);else wDrawDecor(fo)}
 if(W4.sector==='PEAK'&&SW.bottieSeen&&!SW.bottieBeat){wChar('BOTTIE',300,124+Math.round(Math.sin(time*1.7)*2),22);
  if(Math.hypot(P3.x-300,P3.y-120)>34){r('rgba(10,14,8,.55)',300-tw('BOTTIE',1)/2-2,126,tw('BOTTIE',1)+4,9);text('BOTTIE',300-tw('BOTTIE',1)/2,127,1,'#7ee7ff',null)}}
 if(W4.loose)for(const lb of W4.loose){drawBud({x:Math.round(lb.x),y:Math.round(lb.y)+2,type:lb.type,stage:2,z:0,a:lb.x*.31,mv:true,st:'idle',fx:1});
  if(((time*2)|0)%2)r('#fff3b0',Math.round(lb.x)+6,Math.round(lb.y)-9,2,2)}
 if(W4.treasure){const tx3=W4.treasure.x,ty3=W4.treasure.y+Math.sin(time*2.4)*1.5,pl=2+Math.round(Math.sin(time*5)*1);
  r('#ffd23f',Math.round(tx3)-1,Math.round(ty3)-5-pl,2,10+pl*2);r('#ffd23f',Math.round(tx3)-5-pl,Math.round(ty3)-1,10+pl*2,2);
  r('#fff3b0',Math.round(tx3)-1,Math.round(ty3)-1,2,2)}
 for(const nd of W4.nodes)if(!nd.got&&nd.hp<nd.max){r('#00000088',nd.x-11,nd.y-30,22,4);r('#7ee787',nd.x-10,nd.y-29,Math.round(20*Math.max(0,nd.hp)/nd.max),2)}
 if(wDark()>0){const dk=wDark();
  r('rgba(255,116,40,'+(0.10*Math.max(0,1-Math.abs((W4.dayT||0)-207)/22)).toFixed(3)+')',P3.x-W,P3.y-H,W*2,H*2);
  r('rgba(10,12,48,'+(dk*.5).toFixed(3)+')',P3.x-W,P3.y-H,W*2,H*2);
  if(dk>.15&&W4.sector==='BASE'){r('rgba(255,190,80,'+(dk*.05).toFixed(3)+')',196,40,88,88);
   r('rgba(255,190,80,'+(dk*.10).toFixed(3)+')',214,58,52,52);
   r('rgba(255,200,100,'+(dk*.24).toFixed(3)+')',227,71,26,26)}}
 wQuipDraw();g.restore();
 fxAtmos();wHud();
 if(W4.talk){const tk=W4.talk,line=tk.page===0?WTALK[tk.who][(SW.talkN[tk.who]-1)%3]:'Hand over the lantern?';
  uiSay(tk.who,line,null,tk.page===0?'A  MORE · B  BYE':'A  BECOME '+tk.who+' · B  NO')}}

function wDrawBuilding(b){const x=wCellX(b.gx),y=wCellY(b.gy);
 if(b.k==='cottage'){r('rgba(0,0,0,.18)',x-2,y+18,24,3);
  r('#e8dcc0',x+1,y+8,18,12);r('#8a6a48',x+1,y+8,18,2);r('#8a6a48',x+1,y+18,18,2);
  r('#7a2e22',x-1,y+2,22,7);r('#8a3a2a',x-1,y+2,22,3);r('#5a241c',x-1,y+8,22,1);
  r('#9a9aa2',x+14,y-2,4,5);
  r('#5a4632',x+8,y+12,5,8);r('#ffd94d',x+11,y+15,1,1);
  r('#ffd94d',x+3,y+11,4,4);r('#fff3b0',x+4,y+12,2,2)}
 else if(b.k==='bed'){r('#5a4030',x,y+9,20,10);r('#6e5236',x,y+9,20,3);
  r('#4a3524',x+2,y+13,16,1);r('#4a3524',x+2,y+16,16,1);
  r('#58c048',x+3,y+5,2,5);r('#58c048',x+9,y+4,2,6);r('#7ec850',x+15,y+5,2,5);
  r('#f078c0',x+15,y+3,3,3)}
 else if(b.k==='nursery'){r('#5a4030',x,y+9,20,10);r('#6e5236',x,y+9,20,3);
  g.globalAlpha=.26;r('#b0e0f8',x+2,y+1,16,9);g.globalAlpha=1;r('#e8f6ff',x+4,y+2,5,2);
  if(b.crop){const cs=wSp(b.crop.sp)._spr;
   if(b.crop.stage===1){r('#58c048',x+9,y+3,2,5);r('#58c048',x+7,y+2,6,2)}
   else if(b.crop.stage===2)g.drawImage(cs.ol,x+3,y-3,13,Math.round(13*cs.oh/cs.ow));
   else{g.drawImage(cs.ol,x+1,y-6,17,Math.round(17*cs.oh/cs.ow));
    if(((time*1.4)|0)%2)text('!',x+8,y-16,1,'#ffd94d',null)}}}
 else if(b.k==='kiln'){r('#8a4a3a',x+2,y+5,16,14);r('#a85a44',x+2,y+5,16,3);
  r('#7c3a2c',x+2,y+11,16,1);r('#7c3a2c',x+2,y+15,16,1);
  r('#4c5466',x+6,y,8,6);r('#3f4654',x+6,y,8,2);
  r('#2b2118',x+7,y+12,6,7);const f=((time*6)|0)%2;r(f?'#f07830':'#f8a030',x+8,y+13,4,5);r('#ffd94d',x+9,y+15,2,3)}
 else if(b.k==='quarry'){r('#4c5466',x,y+7,20,12);r('#3f4654',x+2,y+9,16,8);
  r('#6e7889',x+3,y+3,7,6);r('#98a0b0',x+4,y+4,4,2);
  r('#6e7889',x+12,y+5,6,5);r('#565f6e',x+13,y+10,5,4)}
 else if(b.k==='bench'){r('#8a5a28',x,y+9,20,4);r('#a87948',x,y+9,20,2);
  r('#5a4030',x+2,y+13,3,6);r('#5a4030',x+15,y+13,3,6);
  r('#ffd94d',x+4,y+5,3,3);r('#b0e0f8',x+12,y+6,6,2);r('#c8ccd4',x+9,y+4,2,4)}
 else if(b.k==='sawmill'){r('#8a5a28',x+1,y+13,18,5);r('#6e4520',x+1,y+16,18,2);
   r('#a87948',x+3,y+8,5,5);r('#8a5a28',x+4,y+9,3,3);
   g.beginPath();g.arc(x+14,y+8,6,0,7);g.fillStyle='#c8ccd4';g.fill();
   g.beginPath();g.arc(x+14,y+8,2,0,7);g.fillStyle='#7c8698';g.fill();
   r('#5a3a18',x+12,y+13,4,5)}
  else if(b.k==='statue'){r('#8a7f6a',x+3,y+15,14,4);r('#9a8f7a',x+5,y+12,10,3);r('#6e6350',x+8,y+6,4,6);
   g.globalAlpha=.3;r('#ffd94d',x+6,y,8,7);g.globalAlpha=1;
   r('#ffd23f',x+7,y+1,6,6);r('#fff2b0',x+8,y+2,4,4)}
  else if(b.k==='pen'){r('#8a6a48',x,y+4,2,14);r('#8a6a48',x+9,y+4,2,14);r('#8a6a48',x+18,y+4,2,14);
   r('#a87948',x,y+8,20,2);r('#a87948',x,y+14,20,2);
   r('#f8d878',x+4,y+15,5,2);r('#f8d878',x+12,y+16,6,2)}
 {const cw=wCrewAt(SW.buildings.indexOf(b));
  for(let i=0;i<Math.min(2,cw.length);i++)drawBud({x:x+6+i*10,y:y+22,type:cw[i].type,stage:2,z:0,a:i*1.7+SW.buildings.indexOf(b)*.9,mv:true,st:'idle',fx:1})}
 const bnm=wBuildDef(b.k).n.split(' ')[0];
 r('rgba(10,14,8,.55)',x+10-tw(bnm,1)/2-2,y+20,tw(bnm,1)+4,9);
 text(bnm,x+10-tw(bnm,1)/2,y+21,1,'rgba(255,255,255,.85)',null)}

/* ================================================================
   BATTLES — turn-based, GBA layout. Party HP persists between fights.
   ================================================================ */
function baseUpdate(){if(pressed('a')||pressed('b'))state='g4world'}
function drawBase(){swShell('SUNKEEP BASE — LEVEL '+SW.baseLv,'RING THE LANTERN');
 const ms=WBASEMS[SW.baseLv];let y=38;
 if(!ms){text('The base is fully grown (for now).',16,y,1,'#cfe0b8',null);y+=13}
 else{for(const[key,label]of ms){const dn=wMissionDone(key);
   text((dn?'[x] ':'[ ] ')+label,16,y,1,dn?'#9fe08a':'#ffffff',null);y+=12}
  y+=2;text('Reward: +2 worker slots · new plans at the Lantern',16,y,1,'#ffd94d',null);y+=13}
 text('Gratitude collected: '+SW.heartsTotal+'  (♥'+SW.hearts+' on hand)',16,y,1,'#f0b8d8',null);y+=13;
 text('Sprout crew: '+SW.crew.length+' sprouts · '+wAssignedCount()+' working (buddies fight; sprouts work)',16,y,1,'#a8e078',null);
 text('Tools: AXE Lv'+SW.tools.axe+' · PICKAXE Lv'+SW.tools.pick+'    Stamina '+Math.round(SW.stam)+'/100',16,y+13,1,'#cfe0b8',null);
 text('Garden: sprouts pick fruit, plant seeds in empty plots,',16,y+26,1,'#a8e078',null);
 text('and haul the rest home. Plots grow the new sprouts.',16,y+37,1,'#a8e078',null);
 text('Followers: '+SW.followers.length+' wild sprouts — they work the patch at home,',16,y+48,1,'#a8e078',null);
 text('trail you on the road, and haul finds back to Sunkeep.',16,y+59,1,'#a8e078',null);
 /* moved below the patch lines (v4.5) */
 ctext('A/B: BACK',H-16,1,'#8fa383',null)}
function toolsUpdate(){const rows=['axe','pick','assign','jobs','leave'];swNav(5);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='leave'){state='g4world';return}
  if(r2==='assign'){W4.assignB=SW.buildings.findIndex(b=>b.k==='bench');swSel=0;state='g4assign';return}
  if(r2==='jobs'){swSel=0;state='g4jobs';return}
  const lv=SW.tools[r2];
  if(lv>=3){swSnd(140,.08);swSay('That tool is masterwork already.',1.6);return}
  const c=wToolCost(r2,lv);
  if(SW.res.wood<c.w||SW.res.stone<c.s||(SW.res.ingot||0)<c.i){swSnd(140,.08);swSay('Not enough: needs '+c.w+' wood, '+c.s+' stone'+(c.i?', '+c.i+' ingot':'')+'.',2.2);return}
  SW.res.wood-=c.w;SW.res.stone-=c.s;SW.res.ingot=(SW.res.ingot||0)-c.i;SW.tools[r2]++;
  swSnd(660,.08,990);swSay((r2==='axe'?'AXE':'PICKAXE')+' Lv'+(lv+1)+'! '+(r2==='axe'?'Trees':'Rocks')+' fall in '+Math.ceil(15/(lv+2))+' hits now.',2.4);swSave()}}
function drawTools(){swShell('TINKER BENCH','CRAFT · UPGRADE · B: DONE');
 const rows=['axe','pick'].map(tl=>{const lv=SW.tools[tl],c=lv>=3?null:wToolCost(tl,lv);
  return{a:(tl==='axe'?'AXE':'PICKAXE')+' Lv'+lv,b:lv>=3?'MASTERWORK · dmg '+(1+lv):'dmg '+(1+lv)+' · '+(lv?'UP ':'CRAFT ')+c.w+'W '+c.s+'S'+(c.i?' '+c.i+'I':'')}});
 rows.push({a:'ASSIGN WORKERS',b:'help at the bench'});
 rows.push({a:'SPROUT JOBS',b:'axe & pick crews'});
 rows.push({a:'LEAVE',b:''});
 const tl2=['axe','pick'][Math.min(swSel,1)];
 swRows(rows,swSel,'Bare hands: 1 dmg — 15 hits a tree, and every hit costs stamina. Each tool level is +1 dmg; Lv3 also yields +1 per node. With your '+(tl2==='axe'?'axe':'pickaxe')+', a 15-hit node takes '+Math.ceil(15/(1+SW.tools[tl2]))+' hits.')}
function jobsUpdate(){swNav(Math.max(1,SW.crew.length));
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const c=SW.crew[swSel];if(!c)return;
  if(c.job>=0){swSay('That sprout works a building — reassign it there.',1.8);swSnd(140,.07);return}
  wCrewSetJob(c,c.job===-1?-2:c.job===-2?-3:-1);
  swSay(TYPES[c.type].n+' sprout: '+(c.job===-2?'AXE job — it will work the grove.':c.job===-3?'PICK job — it will work the rocks.':'no job — resting in the soil.'),2);swSnd(660,.06,990);swSave()}}
function drawJobs(){swShell('SPROUT JOBS','A: CYCLE JOB · B: DONE');
 if(!SW.crew.length){ctext('No crew yet. Grow sprouts at the patch —',60,1,'#a8c898',null);ctext('three deliveries earns a sprout into the crew.',74,1,'#a8c898',null);return}
 const jl=c=>c.job>=0?'works '+wBuildDef(SW.buildings[c.job].k).n:c.job===-2?'AXE JOB':c.job===-3?'PICK JOB':'resting';
 swRows(SW.crew.map(c=>({a:TYPES[c.type].n+' SPROUT · sk'+(c.wxp||0),b:jl(c)})),swSel,'Tool sprouts chop and mine base nodes. Felling earns skill.')}
const WCINELINE={WILL:'Back on the tools. Let’s build something that lasts.',ERIN:'My turn. A gentler hand — and a faster one.',MARCUS:'Fine. Watch how it’s done. Barely trying, by the way.'};
function wCineKeeper(who){W4.cine={kind:'keeper',id:who,t:0};state='g4cine';swSnd(523,.1,784)}
function wCineMon(sp,sub){W4.cine={kind:'mon',id:sp,sub:sub||'',t:0};state='g4cine';swSnd(523,.1,784)}
function swCineUpdate(){if(!W4.cine){state='g4world';return}W4.cine.t+=1/60;
 if(pressed('a')||pressed('b')||W4.cine.t>3.2){W4.cine=null;state='g4world'}}
function swDrawCine(){const cn=W4.cine;if(!cn)return;
 r('#0a0d18',0,0,W,H);for(let i=0;i<30;i++)r(i%3?'#2a3350':'#3d4a75',(i*67)%W,(i*41)%(H-90),2,2);
 const fl=.5+.5*Math.sin(time*2.2);g.globalAlpha=.16+.08*fl;r('#ffd23f',W/2-30,44,60,60);g.globalAlpha=1;
 if(cn.kind==='keeper'){wChar(cn.id,W/2,118+Math.round(Math.sin(time*2)*1.5),52);
  text(cn.id,W/2-tw(cn.id,3)/2,128,3,'#ffd23f',null);
  swWrap(WCINELINE[cn.id]||'',200).slice(0,2).forEach((l,j)=>ctext(l,156+j*12,1,'#e8f4d8',null))}
 else{const spr=wSp(cn.id)._spr;g.drawImage(spr.ol,W/2-spr.ow*2,96-spr.oh*2,Math.round(spr.ow*4),Math.round(spr.oh*4));
  text(cn.id,W/2-tw(cn.id,3)/2,128,3,'#ffd23f',null);
  ctext('joined you!',150,1,'#7ee787',null);
  if(cn.sub)swWrap(cn.sub,200).slice(0,2).forEach((l,j)=>ctext(l,166+j*11,1,'#a8c898',null))}
 ctext('A: CONTINUE',H-24,1,'#7a9a68',null)}
function wConfirm(txt,yes){W4.confirm={txt,yes,back:state};state='g4confirm'}
function confirmUpdate(){if(pressed('a')){const cf=W4.confirm;W4.confirm=null;if(cf)cf.yes()}
 else if(pressed('b')){const b2=W4.confirm?W4.confirm.back:'g4world';W4.confirm=null;state=b2}}
const WBOTTPAGES=['BOTTIE: bzzt. CLANK. Look at this little light show, gang.',
 'BOTTIE: I run the feed up there. Every spark of this valley’s light trends through ME.',
 'BOTTIE: You relight that Lantern, keeper, and the whole sky watches. I intend to collect.',
 'BOTTIE: Grow strong. Clank up to the PEAK when you’re ready. I’ll be smiling.',
 'LOUIE: ...woof. (He does NOT like him. At all.)'];
function bottieUpdate(dt){W4.botT=(W4.botT||0)+dt;
 if(W4.botPhase===0&&W4.botT>=2.6){W4.botPhase=1;W4.botPage=0;swSnd(160,.25,80)}
 else if(W4.botPhase===1&&pressed('a')){W4.botPage++;swSnd(660,.05);
  if(W4.botPage>=WBOTTPAGES.length){W4.botPhase=2;W4.botT=0;swSnd(392,.2,784)}}
 else if(W4.botPhase===2&&W4.botT>=1.1){SW.bottieSeen=1;swSave();state='g4world';
  swSay('Whatever that was... it came from the sky. Louie is still growling.',3)}}
function drawBottie(){const ph=W4.botPhase||0,bt=W4.botT||0;
 r('#1a2438',0,0,W,H);for(let i=0;i<40;i++)r(i%4?'#3d4a75':'#5a6c9e',(i*53)%W,(i*37)%(H-120),2,2);
 r('#2c4a26',0,H-70,W,70);r('#386030',0,H-70,W,3);
 r('#5a4632',W/2-52,H-96,104,26);r('#6e5840',W/2-52,H-96,104,4);
 g.globalAlpha=.25+.1*Math.sin(time*3);r('#ffd23f',W/2-16,H-138,32,32);g.globalAlpha=1;
 r('#ffd23f',W/2-9,H-131,18,18);r('#fff3b0',W/2-5,H-127,10,10);
 let by;if(ph===0){const k=Math.min(1,bt/2.6);by=-60+(H-64)*k*k}
 else if(ph===1)by=H-124+Math.sin(time*1.8)*2;else by=(H-124)-300*bt;
 if(ph===0){r('rgba(126,231,255,.5)',W/2-1,Math.max(0,by-46),2,34);r('rgba(126,231,255,.3)',W/2-8,Math.max(0,by-30),1,20);r('rgba(126,231,255,.3)',W/2+7,Math.max(0,by-30),1,20);
  if(((time*6)|0)%2)text('bzzt',W/2+26,Math.max(8,by-20),1,'#7ee7ff',null)}
 wChar('BOTTIE',W/2,by+52,46);
 if(ph===1&&bt<.3){r('#cbb98a',W/2-26,H-66,10,3);r('#cbb98a',W/2+16,H-66,10,3);r('#cbb98a',W/2-4,H-70,8,3)}
 g.drawImage(LOU.l[0],W/2-104,H-84,26,13);
 const sx=P3.x,sy=P3.y,sax=P3.ax,say2=P3.ay,san=P3.anim;P3.ax=0;P3.ay=1;P3.anim=0;
 drawPlayerSpr(W/2+92,H-70,1.3);P3.x=sx;P3.y=sy;P3.ax=sax;P3.ay=say2;P3.anim=san;
 if(ph===1){r('#0d0a18',10,H-56,W-20,46);r('#7ee7ff',10,H-56,W-20,1);
  swWrap(WBOTTPAGES[W4.botPage||0],W-40).slice(0,3).forEach((l,j)=>text(l,16,H-50+j*11,1,'#e8f4ff',null));
  text('A: NEXT',W-10-tw('A: NEXT',1),H-17,1,'#7a9a68',null)}}
function drawConfirm(){r('rgba(6,8,6,.72)',0,0,W,H);
 r('#0d100c',26,64,W-52,92);r('#f8e060',26,64,W-52,2);r('#f8e060',26,154,W-52,2);r('#f8e060',26,64,2,92);r('#f8e060',W-28,64,2,92);
 ctext('ARE YOU SURE?',82,2,'#ffd23f',null);
 swWrap(W4.confirm?W4.confirm.txt:'',W-76).slice(0,2).forEach((l,j)=>ctext(l,106+j*12,1,'#e8f4d8',null));
 ctext('A: YES · B: NO',138,1,'#a8c898',null)}
function keeperUpdate(){swNav(3);
 if(pressed('b')){swSel=0;state='g4pause';return}
 if(pressed('a')){const who=['WILL','ERIN','MARCUS'][swSel];
  if(who===SW.keeper){state='g4world';return}
  wConfirm('Switch keeper to '+who+'? ('+WKEEPERS[who].act+')',()=>{SW.keeper=who;swSnd(784,.09,1175);swSave();wCineKeeper(who)})}}
function drawKeeper(){swShell('CHOOSE YOUR KEEPER','OTHERS STAY HOME');
 ['WILL','ERIN','MARCUS'].forEach((who,i)=>{const y=30+i*48,on=i===swSel;
  r(on?'#f8e060':'#241c38',10,y,W-20,44);r(on?'#fff3b0':'#2e2450',11,y+1,W-22,42);
  if(who==='WILL'){const sx=P3.x,sy=P3.y;drawPlayerSpr(30,y+34,1.5);P3.x=sx;P3.y=sy}
  else if(SWCHR[who])wChar(who,30,y+40,28);
  text(who+(SW.keeper===who?' · PLAYING':''),52,y+6,2,on?'#281c30':'#e8e4f5',null);
  text(WKEEPERS[who].pas,52,y+22,1,on?'#5a4a28':'#a89ec2',null);
  text('MOVE: '+WKEEPERS[who].act,52,y+33,1,on?'#5a4a28':'#a89ec2',null)});
 const who=['WILL','ERIN','MARCUS'][swSel];
 r('#0d0a18',8,H-30,W-16,20);text(WKEEPERS[who].actD,13,H-25,1,'#c8c0d8',null)}
function wNextGoal(){
 if(SW.quest<5){const q=SW.quest;
  if(q===0)return{x:lou.x,y:lou.y,label:'That is me! Talk to me any time, boss.'};
  if(q===1)return SW.tendDone?{x:240,y:296,label:'They grew up! Walk up to one in the clearing and press A to befriend it.'}:SW.tendStage>=3?{x:240,y:352,label:'The grown sprouts at the patch! Walk up and press A to PLUCK two.'}:{x:240,y:352,label:'The SPROUT PATCH, south of the clearing! Water the seeds — sprouts grow by carrying.'};
  if(q===2)return{x:WW/2,y:(W4.wh||360)-40,label:'The Lantern Gate! In the Meadow, walk into a wandering buddy — weaken it, then toss a sprout!'};
  if(q===3)return{x:240,y:300,label:'Build the COTTAGE anywhere open — START, then BUILD, then place it.'};
  return{x:240,y:300,label:'Build a GARDEN BED on any open ground. Meadow trees have the wood.'}}
 if(!SW.buildings.some(b=>b.k==='cottage'))return{x:240,y:300,label:'Build a COTTAGE first — START menu, then BUILD. Any open ground works. Woof.'}
 if(wBaseReady())return{x:WW/2,y:70,label:'The missions are done! Ring the Great Lantern — the plot grows!'};
 if(SW.crew.length&&!wAssignedCount()&&SW.buildings.length)return{x:wCellX(SW.buildings[0].gx)+10,y:wCellY(SW.buildings[0].gy)+30,label:'Give a sprout a job — walk to a building and press A. Sprouts work; buddies fight.'};
 if(SW.badges.length<4)return{x:WW/2,y:(W4.wh||360)-40,label:'Adventure! The Lantern Gate leads to sectors and gyms.'};
 return{x:WW/2,y:70,label:'Home sweet home. Everything is built, boss.'}}
function wLouieTip(){const tips=[
 'Weakened wilds are far easier to command. Soften first, bud second — and kin buds command best.',
 'Workers drop gratitude hearts while they produce. Walk over them!',
 'A SPROUT PEN raises how many buddies can hold jobs.',
 'Erin keeps the garden singing. Marcus keeps the gyms humble.',
 'Every keeper fights differently — try the KEEPER move in battle.',
 'First-of-a-kind buildings burst gratitude. Collect them all!',
 'The Lantern Gate at the south of home carries you anywhere the light reaches.','Bare hands take 15 hits a tree. A Tinker Bench crafts the AXE and PICKAXE — and levels them up.',
 'Sprouts grow in the patch soil, like the old garden. Pluck a grown one — a tossed sprout commands a buddy.',
 'Pluck a WILD sprout and it follows you, hauling finds home to Sunkeep all on its own.','SELECT swaps command. SPROUT mode: B throws us at work — we bring it back!',
 'Leave a grown bud in the patch and it works: fetching, carrying, even bringing back wild buds.',
 'Folks in town always need something. Pip, the Elder, even me — check our ASKS. Petals pay the bills.',
 'A gold sparkle in the grass is a buried TREASURE. Walk into it. Night makes wild buddies bolder, mind.',
 'Wilds never jump you. Walk up and press A to battle — or throw a sprout at one to start it!'];
 SW.talkN.LOUIE=(SW.talkN.LOUIE||0)+1;return tips[(SW.talkN.LOUIE-1)%tips.length]}
function wLampRows(){const rows=[];
 if(wBaseReady())rows.push({act:'ring',label:'RING THE LANTERN'});
 rows.push({act:'board',label:'BASE BOARD'});
 if(!SW.unlocked.sawmill)rows.push({act:'sawmill',label:'SAWMILL PLANS',price:15});
 if(!SW.unlocked.statue)rows.push({act:'statue',label:'STATUE PLANS',price:25});
 rows.push({act:'leave',label:'LEAVE'});return rows}
function lampUpdate(){const rows=wLampRows();swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const rw=rows[swSel];
  if(rw.act==='ring'){wConfirm('Ring the Great Lantern? Sunkeep grows to LV'+(SW.baseLv+1)+' — more crew room, new plans.',()=>{SW.baseLv++;swSnd(880,.14,1318);
   swSay('The Great Lantern blazes brighter — BASE LEVEL '+SW.baseLv+'!',3);swSave();state='g4world'});return}
  else if(rw.act==='board')state='g4base';
  else if(rw.act==='rest'){for(const m of SW.party)m.hp=wStats(m).max;SW.stam=100;swSnd(880,.1,1175);swSay('The light mends everyone. Buddies fully rested.',2.6);swSave();state='g4world'}
  else if(rw.act==='travel'){W4.mapRO=0;swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}
  else if(rw.act==='leave')state='g4world';
  else{if(SW.hearts>=rw.price){SW.hearts-=rw.price;SW.unlocked[rw.act]=1;swSnd(784,.1,1175);
    swSay('Plans pinned up! '+(rw.act==='sawmill'?'SAWMILL':'LANTERN STATUE')+' is in the BUILD menu now.',3);swSave();swSel=0}
   else{swSnd(140,.08);swSay('Not enough hearts — happy workers drop gratitude at busy buildings.',2.4)}}}}
function lampDraw(){const rows=wLampRows();
 swShell('BASE LANTERN','hearts '+SW.hearts);
 swRows(rows.map(rw=>({a:rw.label,b:rw.price?'♥ '+rw.price:''})),swSel,
  wBaseReady()?'The missions are done — ring it and grow!':'Gratitude, well spent. Plans unlock new buildings.')}
function louUpdate(){const rows=['SHOW ME THE WAY','ANY TIPS, LOUIE?','PET LOUIE','ANY ASKS?','BYE'];swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='SHOW ME THE WAY'){W4.louTarget=wNextGoal();W4.louMode='guide';state='g4world';swSay('Louie dashes off — follow him!',2)}
  else if(r2==='ANY TIPS, LOUIE?'){W4.louTip=wLouieTip()}
  else if(r2==='ANY ASKS?'){wOpenAsk('LOUIE')}
  else if(r2==='PET LOUIE'){if(W4.petCd>0)W4.louTip='Louie is all petted out (for now).';
   else{W4.petCd=120;SW.hearts++;SW.heartsTotal++;W4.louTip='You pet Louie. He is delighted. +1 gratitude';swSnd(988,.06,1318);swSave()}}
  else state='g4world'}}
function drawLou(){swShell('LOUIE','BASE GUIDE · GOOD BOY');
 swRows([{a:'SHOW ME THE WAY',b:'he leads, you follow'},{a:'ANY TIPS, LOUIE?',b:'wisdom, barked'},
  {a:'PET LOUIE',b:'+1 gratitude (sometimes)'},{a:'ANY ASKS?',b:'the valley needs things'},{a:'BYE',b:''}],swSel,W4.louTip||'He knows every corner of Sunkeep. Ask him anything.')}
function wFit(s,n){if(tw(s,1)<=n)return s;let o=s;while(o.length&&tw(o+'…',1)>n)o=o.slice(0,-1);return o+'…'}
const WQUEST=['Talk to Louie','Choose your first buddy','Catch a wild buddy','COTTAGE (START, BUILD): a roof for buddies','Garden: press A on a plot, grow BERRIES'];
function wQuestTick(){
 if(SW.quest===3&&SW.buildings.some(b=>b.k==='cottage'&&!b.con)){SW.quest=4;
  swSay('A roof over Sunkeep! Now grow BERRIES on a garden plot.',3.4);swSnd(784,.09,1175);swSave()}
 else if(SW.quest===4&&(plCrops()>0||SW.buildings.some(b=>b.k==='bed'))){SW.quest=5;
  swSay('Sunkeep stands! The valley is yours, keeper — the gyms await.',3.8);swSnd(784,.09,1175);swSave()}}
let BT=null;
function wAliveParty(){return SW.party.filter(m=>m.hp>0)}
function wSetupBattle(){BT.phase='intro';BT.t=0;BT.log=[];BT.after=null;BT.myStage={atk:0,def:0};BT.foeStage={atk:0,def:0};
 BT.shake=0;BT.orbT=-1;BT.keeperUsed=false;BT.foeRoot=false;BT.dazzle=false;state='g4battle';
 swSay('',0)}
function wEngage(label,fn){W4.engage={t:0,label,fn};state='g4engage';swSnd(196,.16,98)}
function engageUpdate(dt){const e=W4.engage;if(!e){state='g4world';return}
 e.t+=dt;if(e.t>=.55){W4.engage=null;e.fn()}}
function engageDraw(){wDrawWorld();const e=W4.engage;if(!e)return;
 const k=Math.min(1,(e.t||0)/.4),bh=Math.round(H*.5*k);
 r('#0a0812',0,0,W,bh);r('#0a0812',0,H-bh,W,bh);
 if(k>=1){r('#14101e',0,H/2-13,W,26);ctext(e.label,H/2-6,2,'#ffd94d',null)}}
function wStartWild(){const sec=wSector(W4.sector);let tot=0;for(const [id,w] of sec.table)tot+=w;
 let roll=Math.random()*tot,pick=sec.table[0][0];for(const [id,w] of sec.table){roll-=w;if(roll<=0){pick=id;break}}
 const lv=sec.lv[0]+((Math.random()*(sec.lv[1]-sec.lv[0]+1))|0);
 wStartWildAt(pick,lv)}
function wStartWildAt(pick,lv){
 BT={mode:'wild',foe:wMakeMon(pick,lv),aiIx:SW.party.findIndex(m=>m.hp>0)};
 if(BT.aiIx<0)BT.aiIx=0;
 const isNew=!SW.seen[pick];SW.seen[pick]=1;wSetupBattle();BT.log=[{txt:'A wild '+pick+' appeared!'}];
 if(isNew)BT.log.push({txt:'NEW! '+pick+' was added to the Field Guide.'});
 if(!SW.tutSeen){SW.tutSeen=1;BT.log.push({txt:'Wild buddies went dim when the Lantern cracked. Tire it out, then SWARM: your sprouts carry the light back to it.'},{txt:'Kin sprouts bloom best. No sprout is used up — shaken ones just sit out the fight.'})}
 BT.after='menu';swSnd(392,.12,262)}
function wStartGym(gi,rematch){const g=WGYMS[gi];
 BT={mode:'gym',gym:gi,rematch:!!rematch,queue:g.team.map(([sp,lv])=>wMakeMon(sp,lv+(rematch?4:0))),aiIx:SW.party.findIndex(m=>m.hp>0)};
 if(BT.aiIx<0)BT.aiIx=0;BT.foe=BT.queue.shift();
 const isNew=!SW.seen[BT.foe.sp];SW.seen[BT.foe.sp]=1;wSetupBattle();
 BT.log=g.pre.map(t=>({txt:t})).concat([{txt:g.leader+' sent out '+BT.foe.sp+'!'}]);
 if(isNew)BT.log.push({txt:'NEW! '+BT.foe.sp+' was added to the Field Guide.'});BT.after='menu';swSnd(330,.15,220)}
function btCur(){return SW.party[BT.aiIx]}
function btSay(txt,after){BT.log.push({txt});if(after)BT.after=after}
function wDamage(att,def,move,aSt,dSt){const A=wStats(att).atk*(1+.25*(aSt.atk||0)),D=Math.max(1,wStats(def).def*(1+.25*(dSt.def||0)));
 let mult=1,stab=1;if(move.t>=0){mult=wMult(move.t,wSp(def.sp).t);if(wSp(att.sp).t.includes(move.t))stab=1.25}
 const crit=Math.random()<(move.crit?.22:.06)?1.5:1;
 let dmg=Math.max(1,Math.round(move.p*(A/D)*(0.32+att.lv*0.05)*stab*mult*crit*(0.85+Math.random()*0.3)/1.4));
 if(SW.keeper==='MARCUS'&&SW.party.includes(att))dmg=Math.max(1,Math.round(dmg*1.12));
 if(!SW.badges.length&&SW.party.includes(def))dmg=Math.min(dmg,Math.ceil(wStats(def).max*.45)); /* before the first Sigil nothing takes more than 45% in one hit */
 return{dmg,mult,crit:crit>1}}
function wDoMove(att,def,move,aSt,dSt,who){ /* returns log lines, applies damage */
 if(move.p===0){if(move.eff==='atkup'){aSt.atk=Math.min(3,(aSt.atk||0)+1);return[att.sp+"'s ATTACK rose!"]}
  if(move.eff==='defup'){aSt.def=Math.min(3,(aSt.def||0)+1);return[att.sp+"'s DEFENSE rose!"]}
  if(move.eff==='atkdn'){dSt.atk=Math.max(-3,(dSt.atk||0)-1)}}
 if(Math.random()*100>move.acc)return[att.sp+' used '+move.n+' — it missed!'];
 const r=wDamage(att,def,move,aSt,dSt);def.hp=Math.max(0,def.hp-r.dmg);
 const lines=[att.sp+' used '+move.n+'!'];
 if(r.crit)lines.push('A critical hit!');
 if(r.mult>1)lines.push("It's super effective!");
 if(r.mult<1){lines.push("It's not very effective...");if(att===SW.party[BT.aiIx]&&!SW.lessons.swap&&SW.party.some((m,i)=>i!==BT.aiIx&&m.hp>0)){SW.lessons.swap=1;lines.push('Tip: BUDDY swaps in someone whose moves hit harder.')}}
 if(move.eff==='atkdn'&&def.hp>0){dSt.atk=Math.max(-3,(dSt.atk||0)-1);lines.push(def.sp+"'s ATTACK fell!")}
 return lines}
function wFoeMove(){const mv=WMOVES[BT.foe.moves[(Math.random()*BT.foe.moves.length)|0]];return mv}
function wResolveTurn(myMove){const me=btCur(),foe=BT.foe;
 const foeMove=wFoeMove();
 const mySpd=wStats(me).spd,foeSpd=wStats(foe).spd;
 const meFirst=myMove.pri?true:foeMove.pri?false:mySpd+(Math.random()*4)>=foeSpd;
 const order=meFirst?['me','foe']:['foe','me'];BT.log=[];
 for(const who of order){
  if(BT.phase==='over')break;
  if(who==='me'&&me.hp>0&&foe.hp>0){for(const l of wDoMove(me,foe,myMove,BT.myStage,BT.foeStage))BT.log.push({txt:l});BT.shake=2;
   if(foe.hp<=0){wFoeDown();break}}
  if(who==='foe'&&foe.hp>0&&me.hp>0){for(const l of wDoMove(foe,me,foeMove,BT.foeStage,BT.myStage))BT.log.push({txt:l});BT.shake=1;
   if(me.hp<=0){wMineDown();break}}}
 if(BT.log.length===0)BT.log.push({txt:'...'});
 if(!BT.after)BT.after='menu';BT.phase='msg'}
function wFoeDown(){const me=btCur(),foe=BT.foe;BT.log.push({txt:foe.sp+' fainted!'});
 if(BT.mode==='wild'){const dk=[0,1].includes(wSp(foe.sp).t[0])?'ore':'fiber';SW.res[dk]=(SW.res[dk]||0)+1;
  BT.log.push({txt:'It dropped '+dk.toUpperCase()+'. (+1)'})}
 const gain=Math.round((5+foe.lv*3)*(BT.mode==='gym'||BT.mode==='raid'||BT.mode==='trainer'?1.5:1));
 me.xp+=gain;BT.log.push({txt:me.sp+' gained '+gain+' XP!'});
 let need=wXpNext(me.lv);
 while(me.xp>=need&&me.lv<40){me.xp-=need;me.lv++;const ns=wStats(me);me.hp=Math.min(ns.max,me.hp+4);
  BT.log.push({txt:me.sp+' grew to Lv '+me.lv+'!'});
  const now=wMovesAt(wSp(me.sp),me.lv);
  for(const mid of now)if(!me.moves.includes(mid))BT.log.push({txt:me.sp+' learned '+WMOVES[mid].n+'!'});
  me.moves=now;need=wXpNext(me.lv)}
 const evoTo=WEVO[me.sp];
 if(evoTo&&me.lv>=16){const oldMax=wStats(me).max;me.sp=evoTo;const newMax=wStats(me).max;
  me.hp=Math.min(newMax,me.hp+newMax-oldMax);me.moves=wMovesAt(wSp(me.sp),me.lv);
  SW.seen[evoTo]=1;SW.caught[evoTo]=1;
  BT.log.push({txt:'What? Your buddy is evolving!'},{txt:'It evolved into '+evoTo+'!'});swSnd(523,.12,1046)}
 if((BT.mode==='gym'||BT.mode==='raid'||BT.mode==='trainer')&&BT.queue.length){const nw=!SW.seen[BT.queue[0].sp];BT.foe=BT.queue.shift();SW.seen[BT.foe.sp]=1;
  BT.foeStage={atk:0,def:0};BT.log.push({txt:(BT.mode==='raid'?'BOTTIE':BT.mode==='trainer'?BT.tn.who:WGYMS[BT.gym].leader)+' sent out '+BT.foe.sp+'!'});if(nw)BT.log.push({txt:'NEW! '+BT.foe.sp+' was added to the Field Guide.'});
  BT.after='menu';BT.phase='msg';return}
 if(BT.mode==='gym'){const g=WGYMS[BT.gym];
  if(g.crown){SW.gymDone[BT.gym]=1;if(BT.gym===5)SW.bottieBeat=1;if(!BT.rematch)SW.champion=1}
  else if(!BT.rematch){SW.badges.push(g.sig);SW.gymDone[BT.gym]=1}
  SW.res.petal+=g.prize;
  BT.log.push({txt:g.win},{txt:BT.rematch?'Rematch won! +'+g.prize+' petals.':(g.crown?'The crown of light is yours! +'+g.prize+' petals.':'You earned the '+g.sig+'! +'+g.prize+' petals.')});
  BT.won=true;BT.after='endwin';BT.phase='msg';return}
 if(BT.mode==='trainer'){const np=BT.tn;SW.fl[np.fk]=1;SW.res.petal+=np.prize;BT.log.push({txt:np.win},{txt:'You won! +'+np.prize+' petals.'});
  if(np.boss)BT.log.push({txt:'The IRON DOME flickers out across the valley. The roads are open!'});
  BT.won=true;BT.after='endwin';BT.phase='msg';return}
 if(BT.mode==='raid'){SW.res.petal+=50;BT.log.push({txt:'RAID REPELLED! Bottie clanks off, dropping petals. (+50)'});
  BT.won=true;BT.after='endwin';BT.phase='msg';return}
 BT.won=true;BT.after='endwin';BT.phase='msg'}
function wStartRaid(){const pool=['CINDERCAP','FERNFANG','PEBBLIT','DRIZZLET','ZIPWIG','BLOOMBOAR','VOLTHARE','TIDEBUD'];
 const avg=SW.party.length?Math.round(SW.party.reduce((a2,m)=>a2+m.lv,0)/SW.party.length):8;
 const lv=Math.max(8,Math.min(30,avg+2)),team=[0,1].map(i2=>wMakeMon(pool[(Math.random()*pool.length)|0],lv+i2));
 BT={mode:'raid',gym:-1,queue:team.slice(1),aiIx:SW.party.findIndex(m=>m.hp>0)};
 if(BT.aiIx<0)BT.aiIx=0;BT.foe=team[0];SW.seen[BT.foe.sp]=1;wSetupBattle();
 BT.log=[{txt:'The sky CLANKS overhead —'},{txt:'BOTTIE: bzzt. Nice base, keeper. The feed wants its cut.'},{txt:'BOTTIE sent out '+BT.foe.sp+'!'}];
 BT.after='menu';swSnd(196,.25,98)}
function wMineDown(){BT.log.push({txt:btCur().sp+' fainted!'});
 if(wAliveParty().length){BT.after='forceswitch';BT.forced=true;BT.phase='msg'}
 else{BT.log.push({txt:'You have no buddies left...'});
  if(BT.mode==='gym')BT.log.push({txt:WGYMS[BT.gym].lose});
  if(BT.mode==='trainer')BT.log.push({txt:BT.tn.lose});
  if(BT.mode==='raid')BT.log.push({txt:'BOTTIE: bzzt. The feed always collects. (He trashed the place.)'});
  BT.after='blackout';BT.phase='msg'}}
function wBlackout(){const lost=Math.floor(SW.res.petal*.1);SW.res.petal-=lost;
 for(const m of SW.party)m.hp=wStats(m).max;
 BT=null;wEnterSector('BASE');state='g4world';swSay('You rushed back to Sunkeep Base. (-'+lost+' petals)',3.5);swSave()}
function wBattleEnd(){const won=BT&&BT.won,cb=BT&&BT.onEnd,bt0=BT;BT=null;W4.grassT=0;W4.grace=2.5;
 if(won&&SW.keeper==='ERIN')for(const m of SW.party)if(m.hp>0)m.hp=Math.min(wStats(m).max,m.hp+Math.ceil(wStats(m).max*.15));
 state='g4world';if(cb)cb(!!won,bt0);swSave()}
function wKeeperMove(){if(BT.keeperUsed){swSnd(140,.08);return}
 BT.keeperUsed=true;const foe=BT.foe;BT.log=[];BT.t=0;BT.phase='msg';BT.shake=2;
 if(SW.keeper==='WILL'){BT.foeStage.atk=Math.max(-3,BT.foeStage.atk-1);BT.dazzle=true;
  BT.log.push({txt:'WILL used SELFIE FLASH!'},{txt:foe.sp+' is dazzled! Its ATK fell.'});BT.after='keeperfoe'}
 else if(SW.keeper==='ERIN'){const r2=wDamage(btCur(),foe,{n:'TOWEL WHIP',p:34,t:-1,acc:100},BT.myStage,BT.foeStage);
  foe.hp=Math.max(0,foe.hp-r2.dmg);BT.foeRoot=true;
  BT.log.push({txt:'ERIN used TOWEL WHIP! ('+r2.dmg+')'},{txt:foe.sp+' is tangled in the towel!'});
  if(foe.hp<=0)wFoeDown();else BT.after='keeperfoe'}
 else{const r2=wDamage(btCur(),foe,{n:'HYDRO JET',p:46,t:2,acc:100},BT.myStage,BT.foeStage);
  foe.hp=Math.max(0,foe.hp-r2.dmg);
  BT.log.push({txt:'MARCUS used HYDRO JET! ('+r2.dmg+')'});
  if(foe.hp<=0)wFoeDown();else BT.after='keeperfoe'}}
function battleUpdate(dt){if(!BT){state='g4world';return}BT.t+=dt;if(BT.phase==='menu'&&BT._lp!=='menu')swSel=0;BT._lp=BT.phase; /* the battle menu always opens on FIGHT */if(BT.shake>0)BT.shake=Math.max(0,BT.shake-dt*6);
 if(BT.phase==='intro'){if(BT.t>.7){BT.phase='msg'}return}
 if(BT.phase==='msg'){
  if((pressed('a')&&BT.t>.25)||BT.t>2.6){BT.t=0;BT.log.shift();
   if(!BT.log.length){const a=BT.after;BT.after=null;
    if(a==='menu'){BT.phase='menu';swSel=0}
    else if(a==='keeperfoe'){const foe2=BT.foe;
     if(BT.foeRoot){BT.foeRoot=false;BT.log=[{txt:foe2.sp+' is tangled and cannot move!'}];BT.after='menu';BT.phase='msg';BT.t=0}
     else if(BT.dazzle){BT.dazzle=false;BT.log=[{txt:foe2.sp+' is too dazzled to aim!'}];BT.after='menu';BT.phase='msg';BT.t=0}
     else{const lines=wDoMove(foe2,btCur(),wFoeMove(),BT.foeStage,BT.myStage);BT.log=lines.map(x=>({txt:x}));BT.phase='msg';BT.t=0;
      if(btCur().hp<=0)wMineDown();else BT.after='menu'}}
    else if(a==='forceswitch'){BT.phase='party';swSel=Math.max(0,SW.party.findIndex(m=>m.hp>0))}
    else if(a==='endwin')wBattleEnd();
    else if(a==='blackout')wBlackout();
    else BT.phase='menu'}}
  return}
 if(BT.phase==='menu'){const opts=BT.mode==='wild'?['FIGHT','SPROUT','KEEPER','BUDDY','RUN']:BT.mode==='raid'?['FIGHT','KEEPER','BUDDY','RUN']:['FIGHT','KEEPER','BUDDY'];
  wGridNav(2,opts.length);
  if(pressed('a')){const o=opts[swSel];
   if(o==='FIGHT'){BT.phase='moves';swSel=0}
   else if(o==='KEEPER')wKeeperMove();
   else if(o==='SPROUT'){if(wBuddyFull()){BT.log=[{txt:wHasDC()?'The Data Center is full.':'No room for another buddy. Build a DATA CENTER at Sunkeep first.'}];BT.after='menu';BT.phase='msg';BT.t=0}else if(wBudTotal()<=0){BT.log=[{txt:'No sprouts with you. Pluck some, or carry things home so the Lantern grows more.'}];BT.after='menu';BT.phase='msg';BT.t=0}
    else{BT.phase='budpick';swSel=0}}
   else if(o==='BUDDY'){const ok=SW.party.findIndex((m,i)=>i!==BT.aiIx&&m.hp>0);if(ok<0){swSnd(140,.08);BT.noSwap=1.6}else{BT.phase='party';swSel=ok;BT.partyFrom='menu'}}
   else if(o==='RUN'){if(Math.random()<.7){if(BT.mode==='raid'){const lost=Math.min(15,SW.res.petal);SW.res.petal-=lost;BT.log=[{txt:'You fled — Bottie trashed the place on his way out. (-'+lost+' petals)'}]}else BT.log=[{txt:'Got away safely!'}];BT.after='endwin';BT.phase='msg';BT.t=0}
    else{BT.log=[{txt:"Couldn't escape!"}];BT.after=null;BT.phase='msg';BT.t=0;
     const lines=wDoMove(BT.foe,btCur(),wFoeMove(),BT.foeStage,BT.myStage);
     BT.log=lines.map(t=>({txt:t})).concat(BT.log);
     if(btCur().hp<=0)wMineDown();else BT.after='menu'}}
   return}
  return}
 if(BT.phase==='budpick'){const list=TYPES.map((t2,i)=>i).filter(i=>(SW.buds[TYPES[i].n]||0)>0&&!(BT.dz&&BT.dz[i]));
  if(!list.length){BT.phase='menu'}
  else{wGridNav(2,list.length);
   if(pressed('b')){BT.phase='menu';swSel=0;return}
   if(pressed('a')){wThrowBud(list[swSel]);return}}
  return}
 if(BT.phase==='moves'){const me=btCur();wGridNav(2,me.moves.length);
  if(pressed('b')){BT.phase='menu';swSel=0;return}
  if(pressed('a')){const mv=WMOVES[me.moves[swSel]];BT.phase='msg';BT.t=0;wResolveTurn(mv);return}
  return}
 if(BT.phase==='party'){const list=SW.party;
  swNav(list.length);
  if(pressed('b')&&!BT.forced&&BT.partyFrom==='menu'){BT.phase='menu';return}
  if(pressed('a')){const ix=swSel,m=list[ix];
   if((ix===BT.aiIx&&!BT.forced)||m.hp<=0){swSnd(140,.08);return}
   BT.aiIx=ix;BT.myStage={atk:0,def:0};
   if(BT.forced){BT.forced=false;BT.phase='menu';BT.log=[];return}
   BT.log=[{txt:'Go, '+m.sp+'!'}];BT.phase='msg';BT.t=0;
   const lines=wDoMove(BT.foe,m,wFoeMove(),BT.foeStage,BT.myStage);
   BT.log=BT.log.concat(lines.map(t=>({txt:t})));
   if(m.hp<=0)wMineDown();else BT.after='menu'}
  return}
 if(BT.phase==='orb'){BT.orbT-=dt;
  if(BT.orbT<=0){if(BT.orbOk){const foe=BT.foe;SW.caught[foe.sp]=1;
     if(SW.quest===2){SW.quest=3;swSave();later(()=>swSay('First catch! Now build your buddy a home — a COTTAGE (START · BUILD).',3.6),1600)}
     if(SW.party.length<3)SW.party.push(foe);else SW.box.push(foe);
     BT.log=[{txt:'The '+TYPES[BT.tossIx||0].n+' sprouts bloom on '+foe.sp+'. It remembers the Lantern light!'},{txt:SW.party.includes(foe)?foe.sp+' joined your buddies.':foe.sp+' now works for you — sent to your base box.'}];
     BT.after='endwin';BT.phase='msg';BT.t=0}
    else{BT.dz=BT.dz||{};BT.dz[BT.tossIx||0]=1;BT.log=[{txt:BT.foe.sp+' shook the sprouts off! They sit out the rest of this fight.'}];BT.phase='msg';BT.t=0;
     const lines=wDoMove(BT.foe,btCur(),wFoeMove(),BT.foeStage,BT.myStage);
     BT.log=BT.log.concat(lines.map(t=>({txt:t})));
     if(btCur().hp<=0)wMineDown();else BT.after='menu'}}
  return}}
function wLerpC(a,b,k){const pa=[1,3,5].map(i=>parseInt(a.substr(i,2),16)),pb=[1,3,5].map(i=>parseInt(b.substr(i,2),16));
 return'rgb('+pa.map((v,i)=>Math.round(v+(pb[i]-v)*k)).join(',')+')'}
function wThrowBud(ix){const bn=TYPES[ix].n,nS=Math.max(1,Math.min(5,SW.buds[bn]||1));BT.tossN=nS;const foe=BT.foe,frac=foe.hp/wStats(foe).max;
 const p=Math.min(.96,Math.max(.05,wSp(foe.sp).catch*(1.55-frac*.95)*wKinship(ix,foe.sp)*(SW.keeper==='WILL'?1.15:1)));
 BT.tossIx=ix;BT.orbOk=SW.quest===2?true:Math.random()<1-Math.pow(1-p*.6,nS); /* the intro catch cannot fail */
 BT.orbT=2.9;BT.phase='orb';swSnd(880,.08,1320);swSave()}
function wDrawBattle(){const sec=wSector(W4.sector),pal=sec?sec.pal:{g:'#5da244',g2:'#4c8a38',a:'#c4ec8a'};
 const HY=H*0.40,sky=sec&&sec.id==='WASTES'?['#f2b95e','#f9deb0']:sec&&sec.id==='GLOOM'?['#17122a','#241b40']:sec&&sec.id==='PEAK'?['#cfe4f2','#eef6fb']:['#8fd0f0','#d8f2fc'];
 for(let i=0;i<5;i++)r(wLerpC(sky[0],sky[1],i/4),0,Math.floor(HY*i/5),W,Math.ceil(HY/5)+1);
 if(sec&&sec.id==='GLOOM'){const sr=wSeedRand(99);for(let i=0;i<26;i++)r('#ffffff',sr()*W,sr()*HY*.8,1,1);
  r('#e8e4ff',W-42,12,10,10);r('#c9c2f0',W-40,14,6,6)}
 else{const sx3=W-52,sy3=14;r('#ffd94d',sx3,sy3,16,16);r('#fff3b0',sx3+3,sy3+3,10,10);
  const cx1=((time*7)%(W+70))-35,cx2=((time*5+140)%(W+90))-45;
  g.globalAlpha=.75;r('#ffffff',cx1,16,34,6);r('#ffffff',cx1+7,11,20,6);r('#ffffff',cx2,30,28,5);r('#ffffff',cx2+6,26,16,5);g.globalAlpha=1}
 {const rr=wSeedRand(wSectorSeed(sec?sec.id:'MEADOW')+55);
  g.globalAlpha=.35;r('#1e4018',0,HY-9,W,9);
  for(let i=0;i<12;i++){const rx2=rr()*W,rh2=5+rr()*9;r('#1e4018',rx2,HY-9-rh2,10+rr()*16,rh2)}g.globalAlpha=1}
 {const tr=wSeedRand(wSectorSeed(sec?sec.id:'MEADOW')+31);
  for(let i=0;i<9;i++){const tx2=tr()*W,ts=10+tr()*8;
   r('#2c5426',tx2,HY-12-ts*.4,ts,ts*.7);r('#2c5426',tx2+3,HY-16-ts*.4,ts-6,5);r('#4a3520',tx2+ts/2-1,HY-4,2,4)}}
 r(pal.g,0,HY,W,H-HY);
 {const gr2=wSeedRand(wSectorSeed(sec?sec.id:'MEADOW')+77);
  for(let i=0;i<46;i++){const gx2=gr2()*W,gy2=HY+6+gr2()*Math.max(8,H-HY-66);
   if(i%9===0){r('#f078c0',gx2,gy2,2,2);r('#ffffff',gx2+1,gy2-1,1,1)}
   else r(gr2()<.5?pal.g2:pal.a,gx2,gy2,1,3)}}
 const foe=BT.foe,me=btCur(),fspr=wSp(foe.sp)._spr,mspr=wSp(me.sp)._spr;
 const fsh=BT.shake===2?Math.sin(time*60)*2:0,msh=BT.shake===1?Math.sin(time*60)*2:0;
 const FGx=W*0.70,FGy=H*0.36,MGx=W*0.27,MGy=H*0.60;
 const fw=fspr.ow*3.4,fh=fspr.oh*3.4,mw2=mspr.ow*3.2,mh2=mspr.oh*3.2;
 r('rgba(0,0,0,.18)',FGx-40,FGy-1,80,6);r('rgba(0,0,0,.18)',MGx-40,MGy-1,80,6);
 r('#8a7a52',FGx-46,FGy-3,92,7);r(pal.g2,FGx-42,FGy-6,84,6);r(pal.g,FGx-36,FGy-7,72,3);
 r('#8a7a52',MGx-46,MGy-3,92,7);r(pal.g2,MGx-42,MGy-6,84,6);r(pal.g,MGx-36,MGy-7,72,3);
 for(let i=0;i<7;i++){r(pal.a,FGx-38+i*12,FGy-9,1,3);r(pal.a,MGx-34+i*11,MGy-9,1,3)}
 g.drawImage(fspr.ol,FGx-fw/2+fsh,FGy-fh+Math.round(Math.sin(time*2.2)*1.5),fw,fh);
 {const mx_=Math.round(MGx-mw2/2+msh),my_=Math.round(MGy-mh2+Math.round(Math.sin(time*2.2+1.3)*1.5));if(mspr.fable){g.save();g.translate(mx_+mw2,my_);g.scale(-1,1);g.drawImage(mspr.ol,0,0,mw2,mh2);g.restore()}else g.drawImage(mspr.ol,mx_,my_,mw2,mh2)};
 if(BT.phase==='orb'){const t=1.5-BT.orbT,k=Math.min(1,t/1.1),
   ox=(MGx+12)+(FGx-(MGx+12))*k,oy=(MGy-30)+((FGy-12)-(MGy-30))*k-Math.sin(k*Math.PI)*H*0.16;
for(let i=0;i<(BT.tossN||1);i++)drawBud({x:Math.round(k>=1?FGx+(i-((BT.tossN||1)-1)/2)*11:ox-i*12*(1-k)),y:Math.round(k>=1?FGy-18-(i%2)*14:oy+(i%2)*5)+4,type:BT.tossIx||0,stage:2,z:k>=1?((time*10+i)|0)%2*2:7,a:i+1,mv:k>=1,st:'idle',fx:1});
  if(k>=1&&BT.orbOk)for(let i=0;i<8;i++){const a=i*.785+time*4;r(i%2?'#fff3b0':TYPES[BT.tossIx||0].l,Math.round(FGx+Math.cos(a)*(20+t*8)),Math.round(FGy-24+Math.sin(a)*(14+t*6)),2,2)}}
 /* info boxes */
 const fmax=wStats(foe).max;
 r('#282838',4,4,108,30);r('#f8f4e0',6,6,104,26);r(TYPES[wSp(foe.sp).t[0]].d,6,6,4,26);
 text(foe.sp+'  Lv'+foe.lv,14,10,1,'#282838',null);
 r('#282838',14,22,92,5);r('#e04838',14,22,92,3);r(foe.hp/fmax>.5?'#58c048':foe.hp/fmax>.25?'#f8c030':'#e04838',14,22,Math.round(92*foe.hp/fmax),3);
 const mmax=wStats(me).max,mby=Math.min(H-92,MGy+8);
 r('#282838',W-112,mby-2,108,34);r('#f8f4e0',W-110,mby,104,30);r(TYPES[wSp(me.sp).t[0]].d,W-110,mby,4,30);
 text(me.sp+'  Lv'+me.lv,W-102,mby+4,1,'#282838',null);
 r('#282838',W-102,mby+14,88,5);r(me.hp/mmax>.5?'#58c048':me.hp/mmax>.25?'#f8c030':'#e04838',W-102,mby+14,Math.round(88*me.hp/mmax),3);
 text('HP '+me.hp+'/'+mmax,W-102,mby+21,1,'#585868',null);
 /* bottom panel */
 r('#f8f4e0',0,H-56,W,56);r('#282838',0,H-56,W,3);r('#ffd23f',0,H-53,W,1);
 if(BT.phase==='msg'||BT.phase==='intro'||BT.phase==='orb'){
  const cur=BT.log[0];const txt2=BT.phase==='orb'?'...':cur?cur.txt:'';
  swWrap(txt2,224).slice(0,2).forEach((l,j)=>text(l,10,H-46+j*11,1,'#282838',null));
  if(BT.phase==='msg')text('▼',W-16,H-20,1,'#a33b2e',null)}
 else if(BT.phase==='party'){text('CHOOSE A PARTNER (B: back)',10,H-50,1,'#282838',null);
  SW.party.forEach((m,i)=>{const on=i===swSel;
   text((on?'▶ ':'  ')+m.sp+' Lv'+m.lv+'  HP '+m.hp+'/'+wStats(m).max,10,H-38+i*11,1,m.hp<=0?'#a03828':on?'#a33b2e':'#282838',null)})}
 else if(BT.phase==='moves'){const mv=btCur().moves;
  mv.forEach((mid,i)=>{const m=WMOVES[mid],col=i%2,row=(i/2)|0,x=10+col*112,y=H-50+row*20,on=i===swSel;
   if(on)r('#f8e060',x-3,y-3,106,15);
   text(m.n,x,y,1,'#282838',null);
   text(m.t>=0?WT[m.t]:'—',x+62,y,1,TYPES[m.t]?TYPES[m.t].d:'#585868',null);
   text('PW '+m.p,x+88,y,1,'#585868',null)});
  const cur=WMOVES[mv[swSel]];text(cur.d,10,H-11,1,'#585868',null)}
 else if(BT.phase==='budpick'){text('SWARM WITH WHICH?  (kin blooms best)',10,H-50,1,'#282838',null);
  TYPES.map((t2,i)=>i).filter(i=>(SW.buds[TYPES[i].n]||0)>0&&!(BT.dz&&BT.dz[i])).forEach((ix,j)=>{const kin=wKinship(ix,BT.foe.sp);
   const tag=kin===1.5?'KIN!':kin===1.25?'STRONG':kin===.75?'WEAK':'';
   const col=j%2,row=(j/2)|0,x=8+col*116,y=H-36+row*13,on=j===swSel;
   if(on)r('#f8e060',x-3,y-2,112,12);
   text((on?'▶ ':'  ')+TYPES[ix].n+' x'+SW.buds[TYPES[ix].n]+(tag?'  '+tag:''),x,y,1,on?'#a33b2e':'#282838',null)})}
 else{const opts=BT.mode==='wild'?['FIGHT','SPROUT x'+wBudTotal(),'KEEPER','BUDDY','RUN']:BT.mode==='raid'?['FIGHT','KEEPER','BUDDY','RUN']:['FIGHT','KEEPER','BUDDY'];
  swWrap('What will '+me.sp+' do?',104).slice(0,3).forEach((l,j)=>text(l,10,H-50+j*11,1,'#282838',null));
  opts.forEach((o,i)=>{const col=i%2,row=(i/2)|0,x=122+col*58,y=H-50+row*14,on=i===swSel;
   if(on)r('#f8e060',x-3,y-2,56,12);
   const used=o==='KEEPER'&&BT.keeperUsed;
   text(used?'KEEPER·':o.startsWith('SPROUT')?'SWARM':o.split(' ')[0],x,y,1,used?'#98988a':'#282838',null);
   if(o.startsWith('SPROUT '))text('x'+wBudTotal(),x+40,y,1,'#585868',null)})}}

/* ================================================================
   FRONT END + MENUS
   ================================================================ */
function wCostStr(c){return Object.entries(c).map(([k,v])=>v+' '+k.toUpperCase()).join(' + ')}
function wCanPay(c){return Object.entries(c).every(([k,v])=>SW.res[k]>=v)}
function wPay(c){for(const [k,v] of Object.entries(c))SW.res[k]-=v}
function g4StartTitle(){state='g4title';P3.x=W/2;P3.y=H/2}
const WINTRO=["The Great Lantern cracked, and its light fell as seeds.",
 "The seeds grow as SPROUTS — the Lantern's little plant folk, who work, carry, and grow in its soil.",
 "ERIN: A year the Lantern's been dark, keeper. The valley is forgetting what light feels like.",
 "Toss a sprout at a wild BUDDY and it takes command. Buddies fight for you; sprouts keep your home.",
 "MARCUS: Relight it, don't relight it — I'll be at my gym either way. Unimpressed, as ever.",
 "But high above the clouds, something chrome turns a smiling face toward the valley... bzzt."];
function wPickFromTable(sec){const tot=sec.table.reduce((a,e)=>a+e[1],0);let roll=Math.random()*tot;
 for(const [id,w] of sec.table){roll-=w;if(roll<=0)return id}return sec.table[0][0]}
function wSpawnWild(sec,x,y){const p=wGrassPatches()[(Math.random()*wGrassPatches().length)|0];
 return{sp:wPickFromTable(sec),lv:sec.lv[0]+((Math.random()*(sec.lv[1]-sec.lv[0]+1))|0),
  x:x!==undefined?x:p.x+p.w/2,y:y!==undefined?y:p.y+p.h/2,tx:0,ty:0,t:Math.random()*2}}
function wBefriend(sp){SW.party=[wMakeMon(sp,5)];SW.seen[sp]=1;SW.caught[sp]=1;SW.quest=2;
 swSave();wCineMon(sp,'Your plucked sprouts ride in your pouch — toss one in battle to command a wild buddy!')}
const WTENDITEMS=[[64,112],[414,120],[52,316],[426,326],[150,380]];
const WPLOTS=[[208,348],[240,348],[272,348],[208,374],[240,374],[272,374],[176,361],[304,361]];
function wPlotCount(){return 6+Math.min(2,SW.buildings.filter(b=>b.k==='bed').length)}
function wPickBush(){const bs=(W4.bushes||[]).filter(b=>b.fruit>0);if(!bs.length)return null;
 const cnt=[0,0,0,0,0,0];for(const q of W4.patchBuds||[])if(q.type>=0)cnt[q.type]++;
 bs.sort((a,b)=>cnt[a.type]-cnt[b.type]);return bs[0]}
function wMoveTo(o,tx,ty,sp,dt,arr){const dx=tx-o.x,dy=ty-o.y,d=Math.hypot(dx,dy);if(d<arr)return true;
 if(d>1){o.x+=dx/d*sp*dt;o.y+=dy/d*sp*dt}return false}
function wPatchYield(pb){pb.dlv=(pb.dlv||0)+1;
 if(pb.dlv>=3&&!pb.crew&&SW.crew.length<wCrewCap()){const ty=pb.type;SW.crew.push({type:ty,dlv:3,wxp:0,job:-1,atPatch:true});
  pb.crew=true;pb.crewIx=SW.crew.length-1;pb.pend={txt:TYPES[ty].n+' SPROUT GREW UP — CREW!',c:'#7ee787'};
  swSay('A '+TYPES[ty].n+' sprout joined your crew!',2.6);swSnd(784,.12,1175);swSave();return}
 const r2=Math.random(),F=(txt,c)=>{pb.pend={txt,c}};
 const bud=()=>{const bt2=(Math.random()*5)|0;SW.buds[TYPES[bt2].n]=(SW.buds[TYPES[bt2].n]||0)+1;F('sprout brought a '+TYPES[bt2].n+' SPROUT!','#7ee787')};
 if(pb.type===0){if(r2<.3){SW.res.ingot++;F('EMBER sprout smelted an INGOT!','#ffd23f')}else if(r2<.6){SW.res.wood++;F('+1 WOOD','#e8d8a8')}else{SW.res.berry++;F('+1 BERRY','#f0b8d8')}}
 else if(pb.type===1){if(r2<.45){SW.res.stone++;F('+1 STONE','#c8ccd4')}else if(r2<.75){SW.res.wood++;F('+1 WOOD','#e8d8a8')}else{SW.res.berry++;F('+1 BERRY','#f0b8d8')}}
 else if(pb.type===2){if(r2<.5){SW.res.berry++;F('+1 BERRY','#f0b8d8')}else if(r2<.75){SW.res.petal+=2;F('+2 PETALS','#f0b8d8')}else{SW.res.wood++;F('+1 WOOD','#e8d8a8')}}
 else if(pb.type===4){if(r2<.3)bud();else if(r2<.65){SW.res.berry++;F('+1 BERRY','#f0b8d8')}else if(r2<.85){SW.res.petal+=2;F('+2 PETALS','#f0b8d8')}else{SW.res.wood++;F('+1 WOOD','#e8d8a8')}}
 else{if(r2<.15)bud();else if(r2<.4){SW.res.wood++;F('+1 WOOD','#e8d8a8')}else if(r2<.55){SW.res.petal+=2;F('+2 PETALS','#f0b8d8')}else{SW.res.berry++;F('+1 BERRY','#f0b8d8')}}
 swSnd(880,.05,1175);swSave()}
function wFolYield(ty){const r2=Math.random();
 if(ty===0)return r2<.3?['ingot',1,'+1 INGOT','#ffd23f']:['wood',1,'+1 WOOD','#e8d8a8'];
 if(ty===1)return r2<.5?['stone',1,'+1 STONE','#c8ccd4']:['wood',1,'+1 WOOD','#e8d8a8'];
 if(ty===2)return r2<.55?['berry',1,'+1 BERRY','#f0b8d8']:['petal',2,'+2 PETALS','#f0b8d8'];
 if(ty===3)return['petal',3,'+3 PETALS','#f0b8d8'];
 if(ty===4)return r2<.3?['petal',2,'+2 PETALS','#f0b8d8']:['berry',1,'+1 BERRY','#f0b8d8'];
 return r2<.25?['tonic',1,'+1 TONIC','#7ee7ff']:['petal',5,'+5 PETALS','#f0b8d8']}
function wClaimItem(ent){let best=null,bd=1e12;for(const it of W4.items||[])
 if(!it.taken&&(!it.by||it.by===ent)){const d=Math.hypot(it.x-ent.x,it.y-ent.y);if(d<bd){bd=d;best=it}}
 if(best)best.by=ent;return best}
function wFolSync(){for(const f of (W4.fol||[]))if(['fly','seek','work','bring'].includes(f.mode)){f.mode='follow';f.item=null;f.z=0}
 const old=W4.fol||[];W4.fol=(SW.followers||[]).map((ty,i)=>{const o=old[i];if(o&&o.type===ty)return o;
 return{type:ty,x:P3.x,y:P3.y+10+i*4,mode:'follow',t:0,haulT:14+i*7+Math.random()*10,item:null,mv:false}})}
const WNODEY={tree:['wood',2],rock:['stone',2],bush:['berry',1]};
function wTreasureReward(x,y){const rr=Math.random();
 if(rr<.45){const pp=12+((Math.random()*15)|0);SW.res.petal+=pp;W4.floats.push({x,y:y-12,txt:'TREASURE! +'+pp+' PETALS',t:1.8,c:'#ffd23f'})}
 else if(rr<.70){const bt3=(Math.random()*5)|0;SW.buds[TYPES[bt3].n]=(SW.buds[TYPES[bt3].n]||0)+2;W4.floats.push({x,y:y-12,txt:'TREASURE! +2 '+TYPES[bt3].n+' SPROUTS',t:1.8,c:'#ffd23f'})}
 else if(rr<.90){SW.tonics++;W4.floats.push({x,y:y-12,txt:'TREASURE! +1 TONIC',t:1.8,c:'#ffd23f'})}
 else{SW.res.ingot++;W4.floats.push({x,y:y-12,txt:'TREASURE! +1 INGOT',t:1.8,c:'#ffd23f'})}
 swSnd(1046,.09,1568);swSave()}
function wThrowTarget(){const LD=W4.lastDir||'down',fx=LD==='left'?-1:LD==='right'?1:0,fy=LD==='up'?-1:LD==='down'?1:0;let tx=P3.x+fx*46,ty=P3.y+fy*46,kind=null,nd=null,bd=26*26;
 for(const n2 of W4.nodes||[])if(!n2.got){const d=(n2.x-tx)*(n2.x-tx)+(n2.y-ty)*(n2.y-ty);if(d<bd){bd=d;tx=n2.x;ty=n2.y;kind='node';nd=n2}}
 if(W4.treasure){const d=(W4.treasure.x-tx)*(W4.treasure.x-tx)+(W4.treasure.y-ty)*(W4.treasure.y-ty);if(d<bd){bd=d;tx=W4.treasure.x;ty=W4.treasure.y;kind='treasure';nd=null}}
 for(const h of W4.groundHearts||[]){const d=(h.x-tx)*(h.x-tx)+(h.y-ty)*(h.y-ty);if(d<bd){bd=d;tx=h.x;ty=h.y;kind='heart';nd=h}}
 for(const wd of W4.wilds||[]){const d=(wd.x-tx)*(wd.x-tx)+(wd.y-ty)*(wd.y-ty);if(d<bd){bd=d;tx=wd.x;ty=wd.y;kind='wild';nd=wd}}
 return{x:tx,y:ty,kind,nd}}
function wThrowSprout(){const cand=(W4.fol||[]).filter(f=>['follow','b_rest','return'].includes(f.mode));
 if(!cand.length){swSnd(240,.05);W4.floats.push({x:P3.x,y:P3.y-16,txt:'NO SPROUTS WITH YOU',t:1.2,c:'#e88'});return}
 cand.sort((a,b)=>Math.hypot(a.x-P3.x,a.y-P3.y)-Math.hypot(b.x-P3.x,b.y-P3.y));
 const f=cand[0],tg=wThrowTarget();
 f.mode='fly';f.sx=f.x;f.sy=f.y;f.tx=tg.x;f.ty=tg.y;f.tgtKind=tg.kind;f.tgtNode=tg.nd;f.t=0;f.item=null;f.z=0;
 W4.tossFx={x:tg.x,y:tg.y,t:.45};swSnd(500,.1,900)}
function wDrawPatchBud(pb){drawBud({x:Math.round(pb.x),y:Math.round(pb.y)+3,type:pb.type,stage:pb.stage,z:0,a:pb.sx*.37+pb.sy,mv:pb.mode==='fetch'||pb.mode==='carry',st:'idle',fx:1});
 if(pb.item){r('#c93a2e',Math.round(pb.x)-2,Math.round(pb.y)-13,5,5);r('#7ec850',Math.round(pb.x),Math.round(pb.y)-15,2,2)}
 if(pb.stage===2&&pb.mode==='soil'&&((time*2)|0)%2)r('#fff3b0',Math.round(pb.x)+5,Math.round(pb.y)-10,2,2)}
function wDrawFol(f){drawBud({x:Math.round(f.x),y:Math.round(f.y)+2,type:f.type,stage:2,z:f.z||0,a:f.type*1.7,mv:!!f.mv||f.mode==='haul',st:'follow',fx:1});
 if(f.item)r(f.item[3],Math.round(f.x)-2,Math.round(f.y)-13,4,4)}
function wFolCredit(f,y2,sx,sy){if(!y2)return;
 if(y2[0]==='bud'){const bt2=(Math.random()*5)|0;SW.buds[TYPES[bt2].n]=(SW.buds[TYPES[bt2].n]||0)+1}
 else if(y2[0]==='tonic')SW.tonics=(SW.tonics||0)+1;else SW.res[y2[0]]=(SW.res[y2[0]]||0)+y2[1];
 W4.floats.push({x:sx,y:sy,txt:y2[2]+(sx===WW/2&&sy>W4.wh-60?' — sprout mail!':''),t:1.8,c:y2[3]});swSnd(1175,.06,1568);swSave()}
function wFolUpdate(dt){if(!W4.fol||!W4.fol.length)return;
 const atBase=W4.sector==='BASE',wild=!!wSector(W4.sector).table;let prev={x:P3.x,y:P3.y};
 if(atBase)for(const f of W4.fol){if(f.mode==='follow'||f.mode==='return'){f.mode='b_rest';f.t=1+Math.random()*4;f.bx=202+W4.fol.indexOf(f)*24}
  else if(f.mode==='haul')f.mode='b_carry'}
 if(!atBase)for(const f of W4.fol)if(f.mode&&f.mode[0]==='b')f.mode='follow';
 for(const f of W4.fol){
  if(f.mode==='away'){f.t-=dt;if(f.t<=0){f.mode='return';f.x=WW/2;f.y=W4.wh-24}continue}
  if(f.mode==='haul'){if(wMoveTo(f,WW/2,W4.wh-24,64,dt,10)){wFolCredit(f,f.item,WW/2,W4.wh-46);
    f.item=null;f.mode='away';f.t=6+Math.random()*5;f.haulT=20+Math.random()*16}continue}
  if(f.mode==='fly'){f.t+=dt;const k=Math.min(1,f.t/.45);f.x=f.sx+(f.tx-f.sx)*k;f.y=f.sy+(f.ty-f.sy)*k;f.z=Math.sin(k*Math.PI)*16;f.mv=false;
   if(k>=1){f.z=0;f.mode='seek'}continue}
  if(f.mode==='seek'){
   const hitW=(W4.wilds||[]).find(wd=>Math.hypot(f.x-wd.x,f.y-wd.y)<20||Math.hypot((f.tx||f.x)-wd.x,(f.ty||f.y)-wd.y)<20);
   if(hitW){W4.wilds.splice(W4.wilds.indexOf(hitW),1);W4.wildCd=18;f.mode='follow';f.item=null;f.tgtKind=null;f.tgtNode=null;
    wEngage('WILD '+hitW.sp+'!',()=>wStartWildAt(hitW.sp,hitW.lv));continue}
   if(f.tgtKind==='node'&&f.tgtNode&&!f.tgtNode.got){f.mode='work';f.wt=0}
   else if(f.tgtKind==='treasure'&&W4.treasure){f.item=['treasure'];f.mode='bring'}
   else if(f.tgtKind==='heart'&&f.tgtNode){f.item=['heart',f.tgtNode];f.mode='bring'}
   else f.mode='bring';
   continue}
  if(f.mode==='work'){const nd=f.tgtNode;
   if(!nd||nd.got)f.mode='bring';
   else{f.mv=true;if(Math.hypot(f.x-nd.x,f.y-nd.y)>8)wMoveTo(f,nd.x,nd.y,84,dt,6);
    else{f.wt=(f.wt||0)+dt;nd.shake=.2;if(f.wt>=.42){f.wt=0;nd.hp--;if(nd.hp<=0){nd.got=true;const yn=WNODEY[nd.k];f.item=['node',yn[0],yn[1]];f.mode='bring'}}}}
   continue}
  if(f.mode==='bring'){f.mv=true;
   if(wMoveTo(f,P3.x,P3.y,88,dt,11)){
    if(f.item){if(f.item[0]==='node'){SW.res[f.item[1]]=(SW.res[f.item[1]]||0)+f.item[2];W4.floats.push({x:P3.x,y:P3.y-16,txt:'+'+f.item[2]+' '+f.item[1].toUpperCase()+' — brought to you!',t:1.7,c:'#ffd94d'})}
     else if(f.item[0]==='treasure'){if(W4.treasure){W4.treasure=null;SW.treasures=(SW.treasures||0)+1;wTreasureReward(P3.x,P3.y)}}
     else if(f.item[0]==='heart'){const hi=(W4.groundHearts||[]).indexOf(f.item[1]);if(hi>=0){W4.groundHearts.splice(hi,1);SW.hearts++;SW.heartsTotal++;W4.floats.push({x:P3.x,y:P3.y-16,txt:'+1 ♥ — brought to you!',t:1.6,c:'#f0b8d8'})}}}
    f.item=null;f.tgtKind=null;f.tgtNode=null;f.mode=(W4.sector==='BASE')?'b_rest':'follow';if(f.mode==='b_rest'){f.bx=f.bx||216;f.t=1}
    swSnd(1175,.06,1568);swSave()}
   continue}
  if(f.mode&&f.mode[0]==='b'){ /* home: work the patch like a patch sprout */
   if(f.mode==='b_rest'){f.mv=false;f.t-=dt;
    const busy=W4.fol.filter(x2=>x2.mode==='b_fetch'||x2.mode==='b_carry'||x2.mode==='b_plant').length;
    if(f.t<=0&&busy<2){const b=wPickBush();if(!b){f.t=1.5}else{f.bush=b;f.mode='b_fetch';
     if(SW.lessons&&!SW.lessons.folbase){SW.lessons.folbase=1;swSay('Home again — your followers get to work at the patch.',3)}}}}
   else if(f.mode==='b_fetch'){f.mv=true;const b=f.bush;
    if(!b){f.mode='b_rest';f.t=1}
    else if(wMoveTo(f,b.x,b.y,46,dt,7)){
     if(b.fruit>0){b.fruit--;f.item=['',0,'','#c93a2e'];f.itemTy=b.type;f.bush=null;
      const plot=(W4.patchBuds||[]).find(q=>q.type<0&&q.seedTy==null&&!q.by&&!q.crop);
      if(plot){plot.by=f;f.forPlot=plot;f.mode='b_plant'}else f.mode='b_carry'}
     else{f.bush=null;f.mode='b_rest';f.t=1}}}
   else if(f.mode==='b_plant'){f.mv=true;const pl=f.forPlot;
    if(!pl){f.item=null;f.mode='b_carry'}
    else if(wMoveTo(f,pl.sx,pl.sy,46,dt,6)){pl.seedTy=f.itemTy;pl.age=-7;pl.by=null;f.forPlot=null;f.item=null;
     W4.floats.push({x:pl.sx,y:pl.sy-14,txt:'PLANTED!',t:1.4,c:'#a0e888'});swSnd(660,.06,990);f.mode='b_back'}}
   else if(f.mode==='b_carry'){f.mv=true;if(wMoveTo(f,240,100,46,dt,9)){const y2=(f.item&&f.item[0])?f.item:wFolYield(f.type);wFolCredit(f,y2,240,84);f.item=null;f.mode='b_back'}}
   else if(f.mode==='b_back'){f.mv=true;if(wMoveTo(f,f.bx||216,332,46,dt,4)){f.mode='b_rest';f.t=2+Math.random()*5}}
   continue}
  const dx=prev.x-f.x,dy=prev.y-f.y,d=Math.hypot(dx,dy);f.mv=d>15;
  if(d>15){const sp=d>44?120:80;f.x+=dx/d*sp*dt;f.y+=dy/d*sp*dt}
  if(f.mode==='return'&&d<17)f.mode='follow';
  if(f.mode==='follow'&&wild){f.haulT-=dt;if(f.haulT<=0){f.item=wFolYield(f.type);f.mode='haul';
   if(SW.lessons&&!SW.lessons.folhaul){SW.lessons.folhaul=1;swSay('Your '+TYPES[f.type].n+' sprout is hauling a find home to Sunkeep!',3)}}}
  prev={x:f.x,y:f.y}}}
function wPatchUpdate(dt){let workers=0;
 for(const pb of W4.patchBuds)if(pb.mode==='fetch'||pb.mode==='carry'||pb.mode==='plant')workers++;
 for(const pb of W4.patchBuds){
  if(pb.type<0){if(pb.seedTy!=null){pb.age+=dt;
    if(pb.age>=0){pb.type=pb.seedTy;pb.seedTy=null;pb.age=0;pb.stage=0;pb.mode='soil';
     W4.floats.push({x:pb.sx,y:pb.sy-12,txt:'POP!',t:1,c:'#7ee787'});swSnd(880,.05,1175)}}
   continue}
  pb.age+=dt;pb.stage=pb.age<12?0:pb.age<30?1:2;
  if(pb.stage<2)continue;
  const spd=pb.type===3?54:36;
  if(pb.mode==='soil'){pb.t=(pb.t||0)-dt;
   if(workers<2&&pb.t<=0){pb.t=.5;const bush=wPickBush();
    if(bush){const plot=W4.patchBuds.find(q=>q.type<0&&q.seedTy==null&&!q.by&&!q.crop);
     if(plot){plot.by=pb;pb.forPlot=plot}else pb.forPlot=null;
     pb.bush=bush;pb.mode='fetch';workers++}}}
  else if(pb.mode==='fetch'){const b=pb.bush;
   if(!b){pb.mode='soil';if(pb.forPlot){pb.forPlot.by=null;pb.forPlot=null}}
   else if(wMoveTo(pb,b.x,b.y,spd,dt,7)){
    if(b.fruit>0){b.fruit--;pb.item=true;pb.itemTy=b.type;pb.bush=null;pb.mode=pb.forPlot?'plant':'carry'}
    else{pb.bush=null;if(pb.forPlot){pb.forPlot.by=null;pb.forPlot=null}pb.mode='soil'}}}
  else if(pb.mode==='plant'){const pl=pb.forPlot;
   if(!pl){pb.item=false;pb.mode='carry'}
   else if(wMoveTo(pb,pl.sx,pl.sy,spd,dt,6)){pl.seedTy=pb.itemTy;pl.age=-7;pl.by=null;pb.forPlot=null;pb.item=false;
    W4.floats.push({x:pl.sx,y:pl.sy-14,txt:'PLANTED!',t:1.4,c:'#a0e888'});swSnd(660,.06,990);
    if(SW.lessons&&!SW.lessons.seed){SW.lessons.seed=1;swSay('Planted! A fruit seed grows a new sprout in the garden.',2.8)}
    pb.mode='back'}}
  else if(pb.mode==='carry'){if(wMoveTo(pb,240,100,spd,dt,9)){pb.item=false;pb.mode='back';wPatchYield(pb)}}
  else if(pb.mode==='back'){if(wMoveTo(pb,pb.sx,pb.sy,spd,dt,4)){pb.mode='soil';pb.t=.3+Math.random()*.6;
   if(pb.pend){W4.floats.push({x:pb.x,y:pb.y-14,txt:pb.pend.txt,t:1.6,c:pb.pend.c});pb.pend=null}}}}}
function wDark(){const t2=W4.dayT||0;
 if(t2<185)return 0; if(t2<225)return (t2-185)/40*.75; if(t2<282)return .75+(t2-225)/57*.25;
 return Math.max(0,1-(t2-282)/18)}
const WASKSP=['CINDERCAP','MAGMOSS','PEBBLIT','BOULDERHOUND','DRIZZLET','TIDEBUD','ZIPWIG','FERNFANG','BLOOMBOAR'];
function wGenAsk(who){const r2=Math.random();
 if(r2<.4){const ty=(Math.random()*5)|0,n=2+((Math.random()*2)|0);return{kind:'buds',type:ty,n,rw:10+n*7,bonus:Math.random()<.25}}
 if(r2<.7){const rs=['wood','stone','berry'][(Math.random()*3)|0],n=4+((Math.random()*5)|0);return{kind:'res',res:rs,n,rw:8+n*3,bonus:Math.random()<.25}}
 const sp=WASKSP[(Math.random()*WASKSP.length)|0];return{kind:'catch',sp,base:SW.caught[sp]||0,rw:26,bonus:Math.random()<.3}}
function wAskText(a){return a.kind==='buds'?'Bring '+a.n+' '+TYPES[a.type].n+' sprouts. Pluck them from the patch, or win them in the wild.':
 a.kind==='res'?'Bring '+a.n+' '+a.res.toUpperCase()+'. '+({berry:'Sprouts pick berries from bushes.',wood:'Buddies chop trees; sprouts carry the logs.',stone:'Buddies crack rocks; sprouts carry the stone.',ore:'Buddies dig ore from veins.',fiber:'Buddies pull fiber from thickets.',ingot:'A kiln smelts ore into ingots.'}[a.res]||'Sunkeep provides.'):
 'Catch a '+a.sp+'. Weaken it in the grass, then command it with a sprout.'}
function wAskHave(a){return a.kind==='buds'?(SW.buds[TYPES[a.type].n]||0):a.kind==='res'?SW.res[a.res]:((SW.caught[a.sp]||0)>a.base?'CAUGHT!':'not yet')}
function wAskReady(a){return a.kind==='catch'?(SW.caught[a.sp]||0)>a.base:(wAskHave(a)>=a.n)}
function wOpenAsk(who){swSel=0;if(!SW.asks)SW.asks={};if(!SW.asks[who])SW.asks[who]=wGenAsk(who);
 SW.talkN[who]=(SW.talkN[who]||0)+1;W4.askWho=who;swSel=0;state='g4ask'}
function askUpdate(){swNav(2);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const who=W4.askWho,a=SW.asks[who];
  if(swSel===1||!a){state='g4world';return}
  if(!wAskReady(a)){swSnd(140,.08);return}
  if(a.kind==='buds')SW.buds[TYPES[a.type].n]-=a.n;else if(a.kind==='res')SW.res[a.res]-=a.n;
  SW.res.petal+=a.rw;if(a.bonus)SW.tonics++;SW.askDone=(SW.askDone||0)+1;SW.asks[who]=null;
  swSay(who+': "Ask complete! +'+a.rw+' petals'+(a.bonus?' and a TONIC':'')+'."',2.8);swSnd(784,.1,1318);
  state='g4world';swSave()}}
function drawAsk(){const who=W4.askWho,a=SW.asks[who];swShell(who+' · ASK','THE VALLEY ASKS');
 if(!a){ctext('Nothing needed right now. Check back soon.',80,1,'#a8c898',null);return}
 const lines=(WTALK[who]||['Woof. (He mostly wants pets.)']);
 const q=swWrap('"'+lines[(SW.talkN[who]||0)%lines.length]+'"',214).slice(0,3);
 q.forEach((L,i)=>ctext(L,32+i*11,1,'#a8c898',null));
 const wl=swWrap(wAskText(a),214),wy=32+q.length*11+10;
 wl.forEach((L,i)=>ctext(L,wy+i*11,1,'#ffffff',null));
 ctext('You have: '+wAskHave(a)+' · Reward: '+a.rw+' petals'+(a.bonus?' + TONIC':''),wy+wl.length*11+6,1,'#ffd94d',null);
 const rows=[wAskReady(a)?(a.kind==='catch'?'CLAIM REWARD':'DELIVER'):'NOT READY YET','LEAVE'];
 rows.forEach((rw2,i)=>{const y=H-58+i*22,on=i===swSel;
  r(on?'#f8e060':'#241c38',30,y,W-60,18);r(on?'#fff3b0':'#2e2450',31,y+1,W-62,16);
  text(rw2,38,y+5,1,on?'#281c30':'#e8e4f5',null)})}
const WLESSONS={
 start:{title:'WELCOME, KEEPER',pages:[
  ['You keep the Great Lantern. Its light','grows SPROUTS — little plant folk that','live in the soil patch south of here.'],
  ['Sprouts WORK: grown ones fetch, carry,','and run your base. Or PLUCK one — a','sprout in your pouch catches buddies.'],
  ['BUDDIES are the wild creatures. Toss a','sprout at one in battle to command it.','Buddies FIGHT. Sprouts WORK. Remember','that and Sunkeep makes sense. Louie first.']]},
 patch:{title:'THE SPROUT PATCH',pages:[
  ['These three sprouts are yours. Press A','and they wake, fetch apples, and carry','them back to the Lantern on their heads.'],
  ['Every delivery grows them. At three,','they grow UP and join your CREW — your','home workforce. The patch keeps','sprouting more. Pluck one for your pouch.'],
  ['After tending, wild BUDDIES gather in','the clearing — the Lantern light draws','them. Pick your first fighting partner','there. Sprouts work. Buddies fight.']]}};
function wLesson(key){W4.lesson={key,pages:WLESSONS[key].pages,i:0};state='g4lesson'}
function lessonUpdate(){const L=W4.lesson;if(!L){state='g4world';return}
 if(pressed('a')){L.i++;if(L.i>=L.pages.length){const k=L.key;W4.lesson=null;state='g4world';if(k==='patch')wStartTendGo()}}
 else if(pressed('b')){const k=L.key;W4.lesson=null;state='g4world';if(k==='patch')wStartTendGo()}}
function drawLesson(){const L=W4.lesson;if(!L)return;swShell(WLESSONS[L.key].title,'PAGE '+(L.i+1)+'/'+L.pages.length);
 r('#0d100c',10,40,W-20,H-86);r('#3f5a34',10,40,W-20,2);r('#3f5a34',10,H-48,W-20,2);r('#3f5a34',10,40,2,H-86);r('#3f5a34',W-12,40,2,H-86);
 r('#f8e060',14,44,3,3);r('#f8e060',W-17,44,3,3);r('#f8e060',14,H-52,3,3);r('#f8e060',W-17,H-52,3,3);
 L.pages[L.i].forEach((ln,j)=>ctext(ln,56+j*15,1,'#e8f4d8',null));
 ctext('A: '+(L.i<L.pages.length-1?'NEXT':'BEGIN')+' · B: SKIP',H-24,1,'#a8c898',null)}
const WGUIDE=[
 ['SPROUTS & BUDDIES','SPROUTS are the little plant','folk of the Lantern. They live','at Sunkeep and WORK your base.','BUDDIES are the wild creatures','— they FIGHT for you. A tossed','sprout commands a buddy.'],
 ['THE PATCH & CREW','Sprouts grow in the patch soil,','stage by stage: baby, sprout,','grown. Grown ones fetch and','carry on their own. Three','deliveries grows one into your','CREW. Pluck one for your pouch','instead — pouches catch buddies.','Wild sprouts, plucked, follow','you and haul finds home.'],
 ['CATCHING BUDDIES','Weaken a wild buddy first —','hurt buddies listen better.','Then SPROUT, pick a type, and','throw. Kinship matters: same','type listens best. Winning a','fight leaves a sprout behind.'],
 ['YOUR BASE','START, then BUILD — anywhere','at Sunkeep. SPROUTS take jobs','at buildings and produce —','each kind has its gift. Give','one the AXE or PICK job at the','Tinker Bench. Buddies fight.'],
 ['COMMANDING SPROUTS','SELECT swaps your command:','BUDDY — B sends your lead','buddy to work a node. SPROUT','— B THROWS a sprout from','your train. It fetches, works,','and brings things back to','you. Hold B to whistle all','your sprouts back to you.'],
 ['GATHERING & TOOLS','Trees and rocks take 15 hits;','bushes take 6. Every swing','costs stamina — rest at the','Cottage. The Tinker Bench','crafts the AXE and PICKAXE.','Level them up to Lv3.'],
 ['GYMS & SIGILS','Four gyms, four Sigils:','Ranger, Marcus, Erin, Scout.','Then the First Keeper waits','at the Peak — and past him,','something chrome. Gym buddies','cannot be caught.'],
 ['THE VALLEY','Pip, the Elder, and Louie hold','ASKS — small jobs that pay.','A gold sparkle is a buried','TREASURE: walk into it. Days','turn to night, and wild','buddies grow bolder.']];
function guideUpdate(){if(pressed('b')){state='g4pause';swSel=6;return}
 if(pressed('right')||pressed('a')){if(W4.guidePage<WGUIDE.length-1){W4.guidePage++;swSnd(660,.04)}else swSnd(140,.06)}
 if(pressed('left')){if(W4.guidePage>0){W4.guidePage--;swSnd(660,.04)}else swSnd(140,.06)}}
function drawGuide(){const pg=WGUIDE[W4.guidePage||0];swShell("KEEPER'S GUIDE",'PAGE '+(W4.guidePage+1)+'/'+WGUIDE.length);
 r('#0d100c',10,40,W-20,H-86);r('#3f5a34',10,40,W-20,2);r('#3f5a34',10,H-48,W-20,2);r('#3f5a34',10,40,2,H-86);r('#3f5a34',W-12,40,2,H-86);
 r('#f8e060',14,44,3,3);r('#f8e060',W-17,44,3,3);r('#f8e060',14,H-52,3,3);r('#f8e060',W-17,H-52,3,3);
 text(pg[0],14,34,2,'#ffd94d',null);
 pg.slice(1).forEach((ln,j)=>text(ln,14,62+j*14,1,'#e8f4d8',null));
 ctext('◀ ▶: TURN PAGE · B: BACK',H-24,1,'#a8c898',null)}
function wStartTend(){ /* A at the patch: water the seeds, then watch them grow */
 if(SW.tendStage===0){SW.tendStage=1;W4.tend={active:true,stage:1,t:0,items:WTENDITEMS.map(([x,y])=>({x,y,taken:false,by:null,regrow:0})),buds:[]};
  swSay('LOUIE: Seeds drink first. Even Lantern seeds start thirsty.',2.8);swSnd(392,.1,523);swSave();return}
 if(SW.tendStage>=3){swSay('LOUIE: Pluck the grown ones, keeper — walk up and press A.',2.4);return}
 swSay('LOUIE: They grow by carrying. Watch them work!',2.2)}
function wTendUpdate(dt){const td=W4.tend;if(!td||!td.active)return;
 if(td.stage===1){td.t+=dt;if(td.buds.length)for(const b of td.buds)b.age+=dt;
  if(!td.buds.length&&td.t>=1.2){td.buds=[0,2,4].map((ty,i)=>({type:ty,x:216+i*24,y:344,st:'wait',item:false,dlv:0,stage:0,age:-0.45*i,tgt:null}));
   W4.floats.push({x:240,y:326,txt:'POP!',t:1,c:'#7ee787'});swSay('LOUIE: Sprouts! They grow in the Lantern soil — watch them.',2.8);swSnd(880,.07,1175)}
  if(td.t>=5&&td.buds.length){td.stage=2;SW.tendStage=2;for(const b of td.buds)b.st='go';
   swSay('LOUIE: They fetch apples to the Lantern. Carrying grows them!',3)}return}
 if(td.stage>=3){ /* all grown: carriers finish, then everyone settles home */
  for(const b of td.buds){
   if(b.st==='carry'){const dx=240-b.x,dy=100-b.y,d=Math.hypot(dx,dy);
    if(d<9){b.item=false;b.st='grown'}else{b.x+=dx/d*44*dt;b.y+=dy/d*44*dt}continue}
   if(b.st==='grown'){const hx=216+td.buds.indexOf(b)*24,hy=344,dx=hx-b.x,dy=hy-b.y,d=Math.hypot(dx,dy);
    if(d>=4){b.x+=dx/d*44*dt;b.y+=dy/d*44*dt}}}
  return}
 for(const i2 of td.items)if(i2.taken&&i2.regrow>0){i2.regrow-=dt;if(i2.regrow<=0)i2.taken=false}
 if(td.buds.length&&td.buds.every(x2=>x2.age>=14)){td.stage=3;SW.tendStage=3;
   for(const b of td.buds)if(b.st==='go'||b.st==='rest')b.st='grown';
   swSay('LOUIE: GROWN! Pluck two for your pouch — walk up, press A.',3.2);swSnd(784,.1,1175);swSave()}
 for(const b of td.buds){b.age+=dt;b.stage=b.age<6?0:b.age<14?1:2; /* they grow by AGE, together */
  if(b.st==='rest'&&td.items.some(i2=>!i2.taken&&!i2.by))b.st='go';
  if(b.st==='rest'||b.st==='grown'||b.st==='wait')continue;
  let tx,ty;
  if(b.st==='go'){if(!b.tgt){const it=td.items.find(i2=>!i2.taken&&(!i2.by||i2.by===b));if(it){it.by=b;b.tgt=it}}
   if(!b.tgt){b.st='rest';continue}
   tx=b.tgt.x;ty=b.tgt.y;
   if(Math.hypot(tx-b.x,ty-b.y)<6){b.tgt.taken=true;b.tgt.by=null;b.tgt.regrow=12;b.tgt=null;b.item=true;b.st='carry'}}
  else{tx=240;ty=100;
   if(Math.hypot(tx-b.x,ty-b.y)<9){b.item=false;SW.tended++;SW.res.berry++;b.dlv++;
    W4.floats.push({x:240,y:84,txt:'+1 GROWTH',t:1.4,c:'#7ee787'});swSnd(880,.07,1175);
    if(b.age>=14){b.st='grown';b.x=216+td.buds.indexOf(b)*24;b.y=344}else b.st='go';
    if(td.buds.every(x2=>x2.age>=14)){td.stage=3;SW.tendStage=3;swSay('LOUIE: GROWN! Pluck two for your pouch — walk up, press A.',3.2);swSnd(784,.1,1175)}
    swSave()}}
  if(b.st==='go'||b.st==='carry'){const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);if(d>2){b.x+=dx/d*44*dt;b.y+=dy/d*44*dt}}}}
const WBLURB={CINDERCAP:'Bold and warm-hearted. Your hardest hitter — and it can work the kiln.',
 DRIZZLET:'Quick and gentle. Fastest feet of the three, and a natural garden waterer.',
 FERNFANG:'Sturdy and loyal. The tank of the trio — built for planting and long fights.'};
const WGATEPAGES=[
 'Woof! Stop a second, keeper — see this arch? This is the LANTERN GATE.',
 'Step in and the Lantern light carries you: the Meadow road, Lantern Town, and every corner of the valley.',
 'Roads past town need Sigils — win them from the gyms and the whole valley opens. Now let us go catch you a buddy!'];
function gateUpdate(){if(pressed('b')){state='g4world';return}
 if(pressed('a')||pressed('start')){W4.gatePage=(W4.gatePage||0)+1;swSnd(660,.05);
  if(W4.gatePage>=WGATEPAGES.length){swSel=Math.max(0,WSECTORS.findIndex(s=>s.id==='MEADOW'));state='g4map'}}}
function drawGate(){wDrawWorld();
 r('rgba(6,8,14,.45)',0,0,W,H);
 const lf=((time*2)|0)%2;g.drawImage(lf?LOU.l[0]:LOU.l[1],18,H-58,30,15);
 r('#0d0a18',10,H-44,W-20,36);r('#ffd23f',10,H-44,W-20,1);
 text('LOUIE',14,H-54,1,'#f07830',null);
 swWrap(WGATEPAGES[Math.min(W4.gatePage||0,WGATEPAGES.length-1)],W-64).slice(0,3).forEach((l,j)=>text(l,52,H-40+j*11,1,'#e8f4d8',null));
 for(let i=0;i<WGATEPAGES.length;i++)r(i===(W4.gatePage||0)?'#ffd23f':'#3a4a30',14+i*8,H-16,5,3);
 text('A: NEXT · B: LATER',W-10-tw('A: NEXT · B: LATER',1),H-17,1,'#7a9a68',null)}
function choiceUpdate(){if(pressed('b')){state='g4world'}
 else if(pressed('a')){const sp=W4.choiceSp;state='g4world';wBefriend(sp)}}
function drawChoice(){const sp=W4.choiceSp,s2=wSp(sp),spr=s2._spr;
 swShell(sp,WT[s2.t[0]]+' · LV 5 · FIRST PARTNER');
 r('#1d2b18',10,34,68,68);r('#ffd23f',10,34,68,2);
 g.drawImage(spr.ol,44-spr.ow*1.5,86-spr.oh*1.5,Math.round(spr.ow*3),Math.round(spr.oh*3));
 swWrap(WBLURB[sp]||'',132).slice(0,3).forEach((l,j)=>text(l,86,42+j*11,1,'#ffffff',null));
 text('HP'+s2.hp+' ATK'+s2.atk+' DEF'+s2.def+' SPD'+s2.spd,86,80,1,'#ffd94d',null);
 swWrap(s2.d,214).slice(0,2).forEach((l,j)=>text(l,13,112+j*11,1,'#cfe0b8',null));
 text('WORK: '+Object.entries(s2.work).map(([k,v])=>k+' '+v).join(', '),13,140,1,'#a8c898',null);
 text('MOVES: '+s2.learn.filter(([lv])=>lv<=5).map(([,m])=>WMOVES[m].n).join(', '),13,152,1,'#a8c898',null);
 if(WEVO[sp])text('EVOLVES AT LV16: '+WEVO[sp],13,164,1,'#f0b8d8',null);
 r('#0d0a18',8,H-24,W-16,16);
 text('A: BEFRIEND '+sp,13,H-20,1,'#7ee787',null);
 text('B: KEEP LOOKING',W-13-tw('B: KEEP LOOKING',1),H-20,1,'#a89ec2',null)}
const WBUDSP=['CINDERCAP','PEBBLIT','DRIZZLET','ZIPWIG','FERNFANG','CLOVERIMP'];
function wBudTotal(){return TYPES.reduce((a,t2)=>a+(SW.buds[t2.n]||0),0)}
function wKinship(budIx,foeSp){const ft=wSp(foeSp).t;
 if(ft.includes(budIx))return 1.5;
 if(ft.some(f=>(WBEATS[budIx]||[]).includes(f)))return 1.25;
 if(ft.some(f=>(WBEATS[f]||[]).includes(budIx)))return .75;
 return 1}
function wPickStarter(i){const sp=['CINDERCAP','DRIZZLET','FERNFANG'][i];
 SW.party=[wMakeMon(sp,5)];SW.intro=1;SW.seen[sp]=1;SW.caught[sp]=1;
 lou.x=WW/2-56;lou.y=W4.wh-70;wEnterSector('BASE');state='g4world';
 swSay('Welcome! START: menu · BUILD a Cottage!',3.6);swSave()}
function titleUpdate(){if(pressed('a')){swSnd(784,.09);
 if(!SW.intro){W4.introPage=0;state='g4intro'}else{wEnterSector(SW.sector||'BASE');state='g4world'}}}
function swDrawTitle(){r('#101408',0,0,W,H);
 for(let i=0;i<40;i++)r(i%3?'#1d2b18':'#2a3d20',(i*53)%W,(i*37)%(H-30),2,2);
 const bob=Math.sin(time*2)*3;
 text('SPROUTWILD',W/2-tw('SPROUTWILD',3)/2,26+bob,3,'#a8e078',null);
 text('A LANTERN VALLEY TALE',W/2-tw('A LANTERN VALLEY TALE',1)/2,52+bob,1,'#d8e8c8',null);
 const trio=['CINDERCAP','VOLTHARE','AURICORN'];
 trio.forEach((id,i)=>{const s=wSp(id)._spr,b2=Math.sin(time*3+i*2)*2;
  g.drawImage(s.ol,34+i*78,86+b2,s.ow*2.4,s.oh*2.4)});
 if(SW.intro)ctext('SIGILS '+SW.badges.length+'/4 · PARTNERS '+SW.party.length+' · BOX '+SW.box.length,128,1,'#a8c898',null);
 if(((time*1.4)|0)%2)ctext('PRESS A',H-30,2,'#ffd94d',null);
 ctext('CATCH · BUILD · BATTLE',H-14,1,'#7a9a68',null)}
function wIntroDone(){SW.intro=1;wEnterSector('BASE');state='g4world';
 swSave();
 SW.lessons.start=1}
function introUpdate(){W4.introT=(W4.introT||0)+1/60;
 if(pressed('b')){wIntroDone();return}
 if(pressed('a')||pressed('start')){W4.introPage=(W4.introPage||0)+1;W4.introT=0;swSnd(660,.05);
 if(W4.introPage>=6)wIntroDone()}}
function swDrawIntro(){const p=Math.min(W4.introPage||0,5),tt=W4.introT||0;ox=0;oy=0;
 r('#0a1208',0,0,W,H);
 for(let i=0;i<36;i++)r(i%4?'#22331a':'#31481f',(i*61)%W,(i*29)%Math.max(10,H-140),2,2);
 const gy=H-64,lx=W/2,ly=gy;
 r('#14250f',0,gy,W,H-gy);r('#1d3519',0,gy,W,3);
 for(let i=0;i<20;i++){const sx=(i*47+((tt*7+i*3)%13))%W,sy=(tt*24+i*53)%Math.max(20,gy-30);
  if(p>0&&i%3===0)continue;r('#ffd23f',sx,sy,2,2)}
 if(p===1){for(let i=0;i<5;i++){if(tt<i*.3)continue;if(typeof drawBud==='function')drawBud({x:lx-70+i*34,y:gy-2,type:i,stage:i%3,z:0,a:i*1.3,mv:true,st:'idle',fx:1})}}
 if(p>=3){[['CINDERCAP',lx-78],['PEBBLIT',lx-48],['DRIZZLET',lx+30],['ZIPWIG',lx+58],['FERNFANG',lx-14]].forEach(([id,px],i)=>{
  if(tt<i*.35)return;const spr=wSp(id)._spr;
  g.drawImage(spr.ol,px,gy-16,17,Math.round(17*spr.oh/spr.ow))})}
 if(p>=2){wChar('ERIN',lx+92,gy,20);wChar('MARCUS',lx+112,gy,20);
  g.drawImage(LOU.l[0],lx-104,gy-12,22,11);
  const sx2=P3.x,sy2=P3.y,sax=P3.ax,say3=P3.ay,san=P3.anim;P3.ax=0;P3.ay=1;P3.anim=0;
  drawPlayerSpr(lx-88,gy-2,1.25);P3.x=sx2;P3.y=sy2;P3.ax=sax;P3.ay=say3;P3.anim=san}
 if(p>=4){['#58c048','#f07830','#48a0f0','#f0d020'].forEach((c,i)=>{const gx2=lx-45+i*30,gy2=ly-118+Math.sin(time*2+i)*2;
  r(c,gx2+3,gy2,4,3);r(c,gx2+1,gy2+3,8,4);r(c,gx2+3,gy2+7,4,3);r('#ffffff',gx2+4,gy2+3,2,2)})}
 r('#6b4a2b',lx-2,ly-44,4,44);r('#3c2a16',lx-6,ly-46,12,4);
 const fl=p===0&&(tt%0.9<0.1);
 g.globalAlpha=.22+0.06*Math.sin(time*3);r('#ffd23f',lx-13,ly-71,26,26);g.globalAlpha=1;
 r(fl?'#fff3b0':'#ffd23f',lx-8,ly-66,16,16);r('#fff3b0',lx-5,ly-63,10,10);
 if(fl){r('#ffffff',lx-20,ly-60,40,2);r('#ffffff',lx-1,ly-72,2,24)}
 r('#0d0a18',10,H-52,W-20,42);r('#ffd23f',10,H-52,W-20,1);
 swWrap(WINTRO[p],W-40).slice(0,3).forEach((l,j)=>text(l,16,H-46+j*11,1,'#e8f4d8',null));
 if(p===5){r('rgba(10,14,30,.85)',0,0,W,54);wChar('BOTTIE',lx+118,52,22);
  if(((time*2)|0)%2)r('#7ee7ff',lx+104,14,2,2);else r('#7ee7ff',lx+134,20,2,2)}
 for(let i=0;i<6;i++)r(i===p?'#ffd23f':'#3a4a30',16+i*8,H-16,5,3);
 text('A: NEXT · B: SKIP',W-10-tw('A: NEXT · B: SKIP',1),H-17,1,'#7a9a68',null)}
function starterUpdate(){const opts=['CINDERCAP','DRIZZLET','FERNFANG'];swNav(3);
 if(pressed('a'))wPickStarter(swSel)}
function drawStarter(){swShell('CHOOSE YOUR FIRST PARTNER','');
 const opts=['CINDERCAP','DRIZZLET','FERNFANG'];
 opts.forEach((id,i)=>{const s=wSp(id),y=30+i*40,on=i===swSel;
  r(on?'#f8e060':'#241c38',10,y,W-20,36);r(on?'#fff3b0':'#2e2450',11,y+1,W-22,34);
  g.drawImage(s._spr.ol,18,y+6,s._spr.ow*1.6,s._spr.oh*1.6);
  text(id+' · '+s.t.map(t=>WT[t]).join('/'),52,y+5,1,on?'#281c30':'#e8e4f5',null);
  text('WORK: '+Object.keys(s.work).join(', '),52,y+16,1,on?'#5a4a28':'#a89ec2',null);
  text('HP '+s.hp+' ATK '+s.atk+' DEF '+s.def+' SPD '+s.spd,52,y+26,1,on?'#5a4a28':'#a89ec2',null)});
 const s=wSp(opts[swSel]);
 r('#0d0a18',8,H-34,W-16,22);swWrap(s.d,214).slice(0,2).forEach((l,j)=>text(l,13,H-30+j*10,1,'#c8c0d8',null))}
function mapUpdate(){swNav(WSECTORS.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const s=WSECTORS[swSel];
  if(s.id!=='BASE'&&SW.quest<2){swSnd(140,.09);swSay('Wake the Lantern and greet a buddy first.',2.4);return}
  if(SW.badges.length<s.req){swSnd(140,.09);swSay('Locked — needs '+s.req+' Sigils.',1.6);return}
  if(W4.mapRO){swSnd(140,.09);swSay('This is only the map. Travel from a Lantern post, or the Great Lantern at home.',2.8);return}
  if(s.id!=='BASE'&&!SW.visited[s.id]){swSnd(140,.09);swSay('You have not lit a post there yet. Walk the road first.',2.6);return}
  wEnterSector(s.id);state='g4world'}}
function drawMap(){swShell('SECTORS','SIGILS '+SW.badges.length+'/4');
 swRows(WSECTORS.map(s=>({a:s.n+(W4.sector===s.id?' · HERE':''),
  b:SW.badges.length<s.req?'NEEDS '+s.req+' SIGIL'+(s.req>1?'S':''):(s.id!=='BASE'&&!SW.visited[s.id])?'no post lit yet':s.gym>=0?(SW.gymDone[s.gym]?'SIGIL ✓':'GYM'):'lit'})),
  swSel,WSECTORS[swSel].sub+' Wilds Lv '+(WSECTORS[swSel].lv?WSECTORS[swSel].lv.join('-'):'—')+'.')}
function swPauseUpdate(){const rows=['BUDDIES','BUDDY GUIDE','BUILD','SECTORS','BASE','KEEPER','GUIDE','RESUME'];swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='BUDDIES'){swSel=0;state='g4party'}
  else if(r2==='BUDDY GUIDE'){swSel=0;state='g4dex'}
  else if(r2==='BUILD'){if(W4.sector!=='BASE'){swSay('Building happens at Sunkeep Base.',1.8);state='g4world'}else{swSel=0;state='g4build'}}
  else if(r2==='SECTORS'){W4.mapRO=1;swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}
  else if(r2==='BASE'){state='g4base'}
  else if(r2==='KEEPER'){swSel=['WILL','ERIN','MARCUS'].indexOf(SW.keeper);state='g4keeper'}
  else if(r2==='GUIDE'){W4.guidePage=0;state='g4guide'}
  else state='g4world'}}
function drawPause(){swShell('KEEPER MENU','');
 swRows([{a:'BUDDIES',b:SW.party.length+(SW.party.length===1?' buddy':' buddies')},{a:'BUDDY GUIDE',b:Object.keys(SW.caught).length+'/'+WSPECIES.length+' caught'},
  {a:'BUILD',b:W4.sector==='BASE'?'at base':'go to base'},{a:'MAP',b:'travel is by Lantern'},
  {a:'WORK BOARD',b:'Sunkeep Lv'+SW.baseLv},{a:'KEEPER',b:SW.keeper},{a:'GUIDE',b:'how everything works'},{a:'RESUME',b:''}],swSel,'Sprouts '+wBudTotal()+' (pouch '+(SW.pouch||8)+') · Tonics '+SW.tonics+' · Berry '+SW.res.berry+' · Ingot '+SW.res.ingot+' · Ore '+(SW.res.ore||0)+' · Fiber '+(SW.res.fiber||0))}
function partyUpdate(){swNav(Math.max(1,SW.party.length+1));
 if(pressed('b')){state='g4pause';swSel=0;return}
 if(pressed('a')){if(swSel===SW.party.length){swSel=0;state='g4box';return}
  const m=SW.party[swSel];
  if(swSel>0){SW.party.splice(swSel,1);SW.party.unshift(m);swSel=0;
   swSay(m.sp+' leads your buddies now! It walks with you and opens battles.',2.2);swSnd(784,.09,1175);swSave()}
  else if(SW.tonics>0&&m.hp<wStats(m).max){SW.tonics--;m.hp=Math.min(wStats(m).max,m.hp+25);swSay(m.sp+' recovered 25 HP.',1.5);swSnd(880,.07,1175);swSave()}
  else swSnd(140,.08)}
 if(pressed('start')&&SW.party.length>1&&swSel<SW.party.length){const m=SW.party.splice(swSel,1)[0];SW.box.push(m);
  swSay(m.sp+' moved to the base box.',1.5);swSel=0;swSave()}}
function drawParty(){swShell('BUDDIES','START: send to box');
 const items=SW.party.map((m,i)=>{const st=wStats(m);return{a:(i===0?'★ ':'')+m.sp+' Lv'+m.lv,b:'HP '+m.hp+'/'+st.max+(i===0?' · LEADER':'')}});
 items.push({a:'— BASE BOX —',b:SW.box.length+' buddies'});
 const m=SW.party[Math.min(swSel,SW.party.length-1)];
 swRows(items,swSel,m?wSp(m.sp).t.map(t=>WT[t]).join('/')+' · Moves: '+m.moves.map(x=>WMOVES[x].n).join(', ')+'. Work: '+Object.entries(wSp(m.sp).work).map(([k,v])=>k+' '+v).join(', ')+'.'+(m.wxp?' Work XP '+m.wxp+' (skill +'+Math.min(3,((m.wxp||0)/3)|0)+').':'')+' XP to next: '+Math.max(0,wXpNext(m.lv)-m.xp)+(swSel===0?'. A: use Tonic.':'. A: make leader.'):'Buddies resting at base.')}
function boxUpdate(){swNav(Math.max(1,SW.box.length));
 if(pressed('b')){state='g4party';swSel=0;return}
 if(pressed('a')&&SW.box.length){if(SW.party.length>=3){swSnd(140,.08);swSay('Your buddy crew is full (3).',1.4);return}
  const m=SW.box.splice(swSel,1)[0];SW.party.push(m);swSay(m.sp+' joined your buddies.',1.5);swSel=0;swSave()}}
function drawBox(){swShell('BASE BOX','A: bring to party');
 if(!SW.box.length){ctext('No buddies at base yet.',60,1,'#a8c898',null);return}
 swRows(SW.box.map(m=>({a:m.sp+' Lv'+m.lv,b:'HP '+m.hp+'/'+wStats(m).max})),swSel,'Caught buddies live here. Production workers are picked from the box.')}
function dexUpdate(){swNav(WSPECIES.length);if(pressed('b')){state='g4pause';swSel=0}}
function drawDex(){swShell('BUDDY GUIDE','');
 swRows(WSPECIES.map(s=>({a:SW.seen[s.id]?(SW.caught[s.id]?'● ':'○ ')+s.id:'???',b:SW.seen[s.id]?s.t.map(t=>WT[t]).join('/'):''})),
  swSel,SW.seen[WSPECIES[swSel].id]?WSPECIES[swSel].d+' Work: '+Object.keys(WSPECIES[swSel].work).join(', ')+'.':'Not yet seen. Keep exploring.')}
function buildUpdate(){swNav(WBUILD.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const def=WBUILD[swSel];
  if(def.lock&&!SW.unlocked[def.k]){swSnd(140,.08);swSay('Plans for sale at the Great Lantern — gratitude hearts only.',2.2);return}
  const owned=SW.buildings.filter(b=>b.k===def.k).length;
  if(def.max&&owned>=def.max){swSnd(140,.08);swSay('Already standing.',1.4);return}
  if(!wCanPay(def.cost)){swSnd(140,.08);swSay('Not enough: '+wCostStr(def.cost),1.6);return}
  W4.placeK=def.k;W4.cursor={x:Math.max(0,Math.min(22,Math.round((P3.x-20)/20))),y:Math.max(0,Math.min(23,Math.round((P3.y-38)/20)+2))};state='g4place'}}
function drawBuild(){swShell('BUILD','♣'+SW.res.wood+' ◆'+SW.res.stone+' ingot '+SW.res.ingot);
 swRows(WBUILD.map(d2=>{if(d2.lock&&!SW.unlocked[d2.k])return{a:'???',b:'♥ '+d2.price+' · Great Lantern'};
   const owned=SW.buildings.filter(b=>b.k===d2.k).length;
   return{a:d2.n+(owned?' x'+owned:''),b:wCanPay(d2.cost)?wCostStr(d2.cost):wCostStr(d2.cost)+' ✗'}}),
  swSel,(WBUILD[swSel].lock&&!SW.unlocked[WBUILD[swSel].k])
   ?'A mysterious blueprint. The Lantern sells these plans.'
   :WBUILD[swSel].d+' Cost: '+wCostStr(WBUILD[swSel].cost)+'.')}
function placeUpdate(){const c=W4.cursor;
 if(pressed('left'))c.x=Math.max(0,c.x-1);if(pressed('right'))c.x=Math.min(22,c.x+1);
 if(pressed('up'))c.y=Math.max(0,c.y-1);if(pressed('down'))c.y=Math.min(23,c.y+1);
 wCamUpdate(wCellX(c.x)+10,wCellY(c.y)+10);
 if(pressed('b')){state='g4build';return}
 if(pressed('a')){if(!wCellFree(c.x,c.y)){swSnd(140,.08);swSay('No room there \u2014 the Lantern, sign and sprouts need their space.',1.8);return}
  const def=wBuildDef(W4.placeK);wPay(def.cost);
  const firstOfKind=!SW.buildings.some(b=>b.k===def.k);
  const nb={k:def.k,gx:c.x,gy:c.y,workers:[]};SW.buildings.push(nb);scConStart(nb,def,firstOfKind);
  swSnd(523,.08,784);swSave();state='g4world'}}
function drawPlace(){wDrawWorld();const cam=W4.cam||{x:0,y:0};
 g.save();g.translate(-cam.x,-cam.y);
 g.globalAlpha=.10;for(let gx=0;gx<=22;gx++)for(let gy=0;gy<=23;gy++){const ox=wCellX(gx),oy=wCellY(gy);r('#ffffff',ox,oy,20,1);r('#ffffff',ox,oy,1,20)}g.globalAlpha=1;
 const c=W4.cursor,x=wCellX(c.x),y=wCellY(c.y),ok=wCellFree(c.x,c.y),cc=ok?'#7ee787':'#f07878';
 r(ok?'rgba(126,231,135,.25)':'rgba(240,120,120,.25)',x,y,20,20);
 r(cc,x,y,20,1);r(cc,x,y+19,20,1);r(cc,x,y,1,20);r(cc,x+19,y,1,20);
 g.restore();
 uiPill('PLACE '+wBuildDef(W4.placeK).n+'  ·  B  BACK',H-30,'A')}
function cotUpdate(){const hasBench=SW.buildings.some(b=>b.k==='bench');
 const rows=['SLEEP','BUY SPROUT · 12p','BUY TONIC · 25p','LEAVE'];swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='SLEEP'){for(const m of SW.party.concat(SW.box))m.hp=wStats(m).max;SW.stam=100;const night=(W4.dayT||0)>150;if(night){W4.dayT=0;SW.day=(SW.day||1)+1}W4.sleepFx=1.6;swSay(night?'You slept until morning. Day '+SW.day+'. Everyone is rested and back at work.':'A quick nap. Everyone is rested.',2.6);swSnd(523,.3,262);swSave();state='g4world'}
  else if(r2==='LEAVE'){state='g4world'}
  else if(!hasBench&&r2.startsWith('BREW')){swSnd(140,.08);swSay('Needs a TINKER BENCH built first.',1.8)}
  else if(r2.startsWith('BUY SPROUT')){if(SW.res.petal>=12){SW.res.petal-=12;const bn=TYPES[(Math.random()*5)|0].n;SW.buds[bn]++;swSay('A '+bn+' sprout joins your pouch! Sprouts: '+wBudTotal(),1.6);swSave()}else{swSnd(140,.08);swSay('Needs 12 petals.',1.4)}}
  else if(r2.startsWith('BREW')){if(wCanPay({berry:3})){wPay({berry:3});SW.tonics++;swSay('Brewed a Tonic. Tonics: '+SW.tonics,1.6);swSave()}else{swSnd(140,.08);swSay('Needs 3 BERRY.',1.6)}}
  else if(r2.startsWith('BUY TONIC')){if(SW.res.petal>=25){SW.res.petal-=25;SW.tonics++;swSay('Bought a Tonic. Tonics: '+SW.tonics,1.4);swSave()}else{swSnd(140,.08);swSay('Needs 25 petals.',1.4)}}}}
function drawCot(){swShell('COTTAGE','PETALS '+SW.res.petal);
 const hasBench=SW.buildings.some(b=>b.k==='bench');
 swRows([{a:'SLEEP',b:(W4.dayT||0)>150?'until morning':'a quick nap'},
  {a:'BUY SPROUT',b:'12 petals · a random sprout joins'},
  {a:'BUY TONIC',b:'25 petals'},{a:'LEAVE',b:''}],swSel,'Home buddies live here: '+Math.max(0,SW.party.length-1+SW.box.length)+'. Sleeping skips the night, when nobody works. Sprouts x'+wBudTotal()+' · Tonics x'+SW.tonics+'.')}
const WNURPLANT=[['EMBER','CINDERCAP',3],['PEB','PEBBLIT',3],['DEW','DRIZZLET',3],['ZIP','ZIPWIG',3],['LEAF','FERNFANG',3],['LUCKY','CLOVERIMP',5]];
function wNurRows(b){if(!b.crop)return WNURPLANT.map(e=>'PLANT '+e[0]+' · '+e[2]+' BERRY').concat(['WORKERS','LEAVE']);
 return['GROWING: '+b.crop.kind+' — '+(b.crop.stage>=3?'READY!':'stage '+b.crop.stage+'/3'),'HARVEST','CLEAR BED','WORKERS','LEAVE']}
function nurUpdate(){const b=SW.buildings[W4.nurB];if(!b){state='g4world';return}
 const rows=wNurRows(b);swNav(rows.length);
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){const r2=rows[swSel];
  if(r2==='LEAVE'){state='g4world'}
  else if(r2==='WORKERS'){W4.assignB=W4.nurB;swSel=0;state='g4assign'}
  else if(r2.startsWith('PLANT')){const e=WNURPLANT.find(x2=>r2.includes(x2[0]));
   const cost=e[0]==='LUCKY'?{berry:5,ingot:1}:{berry:e[2]};
   if(wCanPay(cost)){wPay(cost);b.crop={kind:e[0],sp:e[1],t:0,stage:1};swSay('Berries set out for a '+e[0]+' kind. A tender brings it sooner.',2.4);swSnd(784,.07);swSave()}
   else{swSnd(140,.08);swSay('Needs '+e[2]+' BERRY'+(e[0]==='LUCKY'?' + 1 INGOT':'')+'.',1.8)}}
  else if(r2.startsWith('GROWING')){swSnd(660,.05);swSay('A dim '+b.crop.kind+' buddy is on its way: '+b.crop.stage+'/3.',2)}
  else if(r2==='HARVEST'){if(!b.crop||b.crop.stage<3){swSnd(140,.08);swSay('Nobody at the door yet.',1.6)}
   else{const m=wMakeMon(b.crop.sp,1);SW.seen[m.sp]=1;SW.caught[m.sp]=1;
    if(SW.party.length<3)SW.party.push(m);else SW.box.push(m);
    
    swSay(m.sp+' followed the light in. It is with you now.',2.4);swSnd(784,.09,1175);b.crop=null;swSave()}}
  else if(r2==='CLEAR BED'){b.crop=null;swSay('Bed cleared.',1.2);swSave()}}}
function drawNur(){const b=SW.buildings[W4.nurB];if(!b)return;
 swShell('SPROUT NURSERY','BERRY '+SW.res.berry+' · INGOT '+SW.res.ingot);
 swRows(wNurRows(b).map(r2=>({a:r2,b:r2.startsWith('PLANT')?'grows a buddy':r2==='HARVEST'?(b.crop&&b.crop.stage>=3?'buddy + 2 buds':'not ready'):r2==='WORKERS'?'tenders grow it faster':''})),swSel,
  'Sprouts, grown at home — the Sunkeep way. A sprout takes about a minute to grow; a tender halves it.')}
function assignUpdate(){const b=SW.buildings[W4.assignB];if(!b){state='g4world';return}
 const bi=W4.assignB,here=wCrewAt(bi),others=SW.crew.filter(c=>c.job!==bi);
 const total=here.length+others.length;swNav(Math.max(1,total));
 if(pressed('b')){state='g4world';return}
 if(pressed('a')){if(swSel<here.length){wCrewSetJob(here[swSel],-1);swSay('Sprout unassigned — it heads home to the patch.',1.6);return}
  const c=others[swSel-here.length];if(!c)return;
  if(here.length>=2){swSnd(140,.08);swSay('This building has 2 sprouts already.',1.6);return}
  wCrewSetJob(c,bi);const def=wBuildDef(b.k),fits=def.skill&&def.skill.some(sk=>WSKILLTYPE[sk]===c.type);
  swSay(TYPES[c.type].n+' sprout now works the '+def.n+(fits?' — a great fit!':'.'),1.7);swSnd(784,.07);swSave()}}
function drawAssign(){const b=SW.buildings[W4.assignB];if(!b)return;const def=wBuildDef(b.k);
 swShell(def.n+' — SPROUT CREW','CREW '+SW.crew.length+' · WORKING '+wAssignedCount());
 const here=wCrewAt(W4.assignB),others=SW.crew.filter(c=>c.job!==W4.assignB);
 const tn=c=>TYPES[c.type].n+' SPROUT';
 const items=here.map(c=>({a:'● '+tn(c),b:'A: unassign · skill '+(c.wxp||0)}))
  .concat(others.map(c=>({a:'○ '+tn(c),b:c.job>=0?'works the '+wBuildDef(SW.buildings[c.job].k).n:'free · '+(def.skill&&def.skill.some(sk=>WSKILLTYPE[sk]===c.type)?'GREAT FIT':'can help')})));
 if(!items.length){ctext('No sprouts in your crew yet.',60,1,'#a8c898',null);ctext('Grow them at the patch — sprouts that deliver',74,1,'#a8c898',null);ctext('3 times join the crew and work your base.',88,1,'#a8c898',null);return}
 swRows(items,swSel,def.d)}
function gymUpdate(){const g=WGYMS[W4.gymIx],done=SW.gymDone[W4.gymIx];
 if(W4.gymPage===undefined)W4.gymPage=0;
 if(pressed('a')){if(W4.gymPage<1){W4.gymPage++;return}
  wConfirm('Challenge '+g.leader+'?',()=>wEngage(g.leader+' — '+g.sig,()=>wStartGym(W4.gymIx,!!done)));W4.gymPage=0;return}
 if(pressed('b')){W4.gymPage=0;state='g4world'}}
function drawGym(){const g=WGYMS[W4.gymIx],done=SW.gymDone[W4.gymIx];
 r('#f8f4e0',8,H-58,W-16,50);r('#282838',8,H-58,W-16,3);
 const line=W4.gymPage===0?g.pre[0]:g.pre[1];
 swWrap(line,218).slice(0,2).forEach((l,j)=>text(l,14,H-48+j*11,1,'#282838',null));
 text(done?'A: REMATCH (+4 Lv) · B: LEAVE':'A: BATTLE (team Lv'+g.team[0][1]+'+) · B: LEAVE',14,H-20,1,'#a33b2e',null)}
/* ================================================================
   DISPATCH + TEST HOOKS
   ================================================================ */
function g4Update(dt){switch(state){
 case 'g4title':titleUpdate();return;
 case 'g4intro':introUpdate();return;
 case 'g4starter':starterUpdate();return;
 case 'g4world':worldUpdate(dt);return;
 case 'g4map':mapUpdate();return;
 case 'g4pause':swPauseUpdate();return;
 case 'g4base':baseUpdate();return;
 case 'g4keeper':keeperUpdate();return;
 case 'g4lou':louUpdate();return;
 case 'g4choice':choiceUpdate();return;
 case 'g4gate':gateUpdate();return;
 case 'g4lamp':lampUpdate();return;
 case 'g4party':partyUpdate();return;
 case 'g4box':boxUpdate();return;
 case 'g4dex':dexUpdate();return;
 case 'g4build':buildUpdate();return;
 case 'g4place':placeUpdate();return;
 case 'g4plot':plotUpdate();return;
 case 'g4dab':dabUpdate(dt);return;
 case 'g4loop':loopUpdate();return;
 case 'g4cot':cotUpdate();return;
 case 'g4nur':nurUpdate();return;
 case 'g4tools':toolsUpdate();return;
 case 'g4ask':askUpdate();return;
 case 'g4lesson':lessonUpdate();return;
 case 'g4guide':guideUpdate();return;
 case 'g4assign':assignUpdate();return;
 case 'g4jobs':jobsUpdate();return;
 case 'g4confirm':confirmUpdate();return;
 case 'g4cine':swCineUpdate();return;
 case 'g4bottie':bottieUpdate(dt);return;
 case 'g4gym':gymUpdate();return;
 case 'g4engage':engageUpdate(dt);return
  case 'g4battle':battleUpdate(dt);return}}
function g4Draw(){ox=0;oy=0; /* Sprouts' camera globals: drawBud subtracts them; Sprouts recomputes them on its own frames */
 switch(state){
 case 'g4title':swDrawTitle();return;
 case 'g4intro':swDrawIntro();return;
 case 'g4starter':drawStarter();return;
 case 'g4map':drawMap();return;
 case 'g4pause':drawPause();return;
 case 'g4base':drawBase();return;
 case 'g4keeper':drawKeeper();return;
 case 'g4lou':drawLou();return;
 case 'g4choice':drawChoice();return;
 case 'g4lamp':lampDraw();return;
 case 'g4party':drawParty();return;
 case 'g4box':drawBox();return;
 case 'g4dex':drawDex();return;
 case 'g4build':drawBuild();return;
 case 'g4plot':drawPlot();return;
 case 'g4dab':drawDab();return;
 case 'g4loop':drawLoop();return;
 case 'g4cot':drawCot();return;
 case 'g4nur':drawNur();return;
 case 'g4tools':drawTools();return;
 case 'g4ask':drawAsk();return;
 case 'g4lesson':drawLesson();return;
 case 'g4guide':drawGuide();return;
 case 'g4assign':drawAssign();return;
 case 'g4jobs':drawJobs();return;
 case 'g4confirm':drawConfirm();return;
 case 'g4cine':swDrawCine();return;
 case 'g4bottie':drawBottie();return;
 case 'g4engage':engageDraw();return;
  case 'g4battle':wDrawBattle();return;
 default:if(state==='g4gate'){drawGate();return}wDrawWorld();if(state==='g4place')drawPlace();if(state==='g4gym')drawGym();return}}
const SWF={lst:()=>louSt(),louPet:()=>louPetOK(),noScenes:v=>{SCOFF=v},plots:()=>W4.patchBuds,plotSet:(i,c)=>plSet(W4.patchBuds[i],c),builds:()=>WBUILD.map(b=>b.k),noCap:v=>{WNOCAP=v},buddyFull:()=>wBuddyFull(),starters:()=>WCHOICE.map(c=>c.sp),scene:()=>W4.scene?{i:W4.scene.i,n:W4.scene.steps.length,txt:W4.scene.steps[W4.scene.i].txt||''}:null,pf:()=>(W4.fld||W4.bf||{}).pf,op:()=>wOp(),spots:()=>W4.fld&&W4.fld.spots,wk:()=>{wkSync();return W4.wk},wkSkills:w=>wkSkills(w),craftQ:()=>SW.craftQ,bf:()=>W4.bf,fld:()=>W4.fld,travel:(to,from)=>{W4.from=from;wEnterSector(to);state='g4world'},state:()=>state,start:()=>g4StartTitle(),meta:()=>SW,bt:()=>BT,
 species:()=>WSPECIES,
 starter:(i)=>wPickStarter(i),
 enter:(id)=>{wEnterSector(id);state='g4world'},
 give:(k,n)=>{SW.res[k]=(SW.res[k]||0)+n;swSave()},
 giveMon:(sp,lv,toBox)=>{const m=wMakeMon(sp,lv);if(toBox||SW.party.length>=3)SW.box.push(m);else SW.party.push(m);SW.seen[sp]=1;SW.caught[sp]=1;swSave();return m},
 forceWild:(sp,lv)=>wStartWildAt(sp,lv),
 gym:(i,rematch)=>wStartGym(i,!!rematch),
 build:(k,gx,gy)=>{const b={k,gx,gy,workers:[]};SW.buildings.push(b);swSave();return b},
 assignFirst:(bi)=>{const b=SW.buildings[bi],def=wBuildDef(b.k);const aff=def.skill?def.skill.map(sk=>WSKILLTYPE[sk]):[];let c=SW.crew.find(c2=>c2.job<0&&aff.includes(c2.type))||SW.crew.find(c2=>c2.job<0);if(!c){SW.crew.push({type:aff.length?aff[0]:4,dlv:3,wxp:0,job:-1});c=SW.crew[SW.crew.length-1]}wCrewSetJob(c,bi);return true}, /* test hook: deploys a crew sprout (grows a fitting one if none is free) */
 tick:(n)=>{for(let i=0;i<n;i++)wProdTick()},
 setRes:(k,v)=>{SW.res[k]=v;swSave()},
 orbs:(n)=>{SW.orbs=n;swSave()},buds:()=>SW.buds,giveBud:(tn,n)=>{SW.buds[tn]=(SW.buds[tn]||0)+(n||1);swSave()},
 pos:()=>({x:P3.x,y:P3.y}),setPos:(x,y)=>{P3.x=x;P3.y=y},
 nodes:()=>W4.nodes,near:()=>W4.near,
 keeper:()=>SW.keeper,base:()=>({lv:SW.baseLv,ready:wBaseReady(),hearts:SW.hearts,ht:SW.heartsTotal}),
 louie:()=>({x:lou.x,y:lou.y,mode:W4.louMode||'follow',target:W4.louTarget}),
 npcs:()=>wNpcList(),talk:()=>W4.talk,banner:()=>W4.banner,groundHearts:()=>W4.groundHearts||[],
 plot:()=>wPlot(),cursor:()=>W4.cursor,setKeeper:(k)=>{SW.keeper=k;swSave()},
 stam:(v)=>{if(v!=null)SW.stam=v;return SW.stam},tools:()=>SW.tools,tend:()=>{SW.tended=6;SW.tendDone=true;SW.tendStage=4;SW.plucked=2;SW.trioPlucked=[0,2];SW.buds.EMBER=(SW.buds.EMBER||0)+1;SW.buds.DEW=(SW.buds.DEW||0)+1;wInitPatch();swSave()},tendState:()=>({tended:SW.tended,done:!!SW.tendDone,stage:SW.tendStage,plucked:SW.plucked}),tendBuds:()=>W4.tend?W4.tend.buds:null,patch:()=>W4.patchBuds,loose:()=>W4.loose,ask:(who)=>SW.asks?SW.asks[who]||null:null,dayT:(v)=>{if(v!=null)W4.dayT=v;return W4.dayT},treasure:()=>W4.treasure,lesson:()=>W4.lesson,guidePage:()=>W4.guidePage,bottie:()=>({seen:SW.bottieSeen,beat:SW.bottieBeat}),raid:()=>wStartRaid(),gymIx:()=>wGymIx(wSector(W4.sector)),cine:()=>W4.cine,confirm:()=>W4.confirm,botState:()=>({ph:W4.botPhase,pg:W4.botPage}),crew:()=>SW.crew,followers:()=>SW.followers,fol:()=>W4.fol,cmdMode:()=>SW.cmdMode,items:()=>W4.items,bushes:()=>W4.bushes,engage:()=>W4.engage,addCrew:(ty)=>{SW.crew.push({type:ty,dlv:3,wxp:0,job:-1});swSave()},quest:()=>SW.quest,moves:()=>WMOVES,species:()=>WSPECIES,sel:()=>swSel,cam:()=>W4.cam,part:()=>W4.part,wilds:()=>W4.wilds};
