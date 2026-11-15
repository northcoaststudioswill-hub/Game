
/* ============================================================
   NORTH COAST KNOCKOUT  -  cartridge 2 for the Pocket Lantern
   A 2D one-on-one fighter. Everything is drawn in code:
   CH = roster, ST = stages, MV = normal moves, SPC/SUP = specials/supers.
   ============================================================ */
window.KO_CART=function(A){
const g0=A.g,W=240,snd=A.snd,noise=A.noise,keys=A.keys,pressed=A.pressed,mk=A.mk,flip=A.flip;
let g=g0; // current drawing target: the screen, or the offscreen world layer while it is being zoomed
const wc=document.createElement('canvas'),wg=wc.getContext('2d');
const tc=document.createElement('canvas');tc.width=320;tc.height=300;const tg=tc.getContext('2d'); // scratch layer for the white hit-flash
const r=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
/* ALT: GBA-style 5x7 pixel font (replaces the system monospace). Same advance widths as before, so layouts don't move.
   sc 1/2 = 1px glyph pixels (2 = bold), 3 = 1.5px, 4 = 2px, 5 = 2.5px. Glyphs are cached per colour as tiny canvases. */
const PFC='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 !?.,\'"-+=:;/()[]#%*|&_<>@$',PFB=[18842895918,16694887983,15603893806,16694953519,33321092159,1108837439,32801457710,18842895921,15170932878,6754148636,18560947505,33320633377,18842572657,18842703473,15621211694,1108854319,23946905134,18561353263,16660235326,4433514655,15621211697,4648912433,19182306865,18834663985,4433521201,33321787935,15623448110,15170932932,33357578798,16660251151,8891181448,15620127807,15621129292,2216829471,15621113390,6728664622,0,4299296900,4299440686,6643777536,2287992832,2180,330,458752,139432064,32537600,207624384,2287999168,1109533200,8726317192,2290360450,15101659214,15309480206,11105828170,27684643443,720353952,4433514628,23946401062,33285996544,8726284424,2290622594,15097067054,4819720132];
const PFS={1:1,2:1,3:1.5,4:2,5:2.5},PFA={1:6,2:6.6,3:9,4:11.4,5:15},FS={1:10,2:11,3:15,4:19,5:25},_pf=new Map();
function pfAtlas(c){let a=_pf.get(c);if(a)return a;a=document.createElement('canvas');a.width=PFC.length*6;a.height=7;const x=a.getContext('2d');x.fillStyle=c;
 for(let i=0;i<PFC.length;i++){const b=PFB[i];for(let k=0;k<35;k++)if(Math.floor(b/Math.pow(2,k))%2)x.fillRect(i*6+k%5,(k/5)|0,1,1)}_pf.set(c,a);return a}
function pfRun(s,x,y,sc,c){const a=pfAtlas(c),p=PFS[sc],adv=PFA[sc],sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
 for(let i=0;i<s.length;i++){if(s[i]===' ')continue;let k=PFC.indexOf(s[i].toUpperCase());if(k<0)k=PFC.indexOf('?');
  const gx=x+i*adv+(adv-5*p)/2;g.drawImage(a,k*6,0,5,7,gx,y,5*p,7*p);if(sc===2)g.drawImage(a,k*6,0,5,7,gx+.5,y,5*p,7*p)}g.imageSmoothingEnabled=sm}
function setF(sc){}
function tw(s,sc=2){return Math.ceil(String(s).length*PFA[sc]);}
/* test hook: when TBX is an array, every text box drawn is recorded (in logical pixels) so a test can check for overlaps */
let TBON=false,TBX=null,TBL=[];
function text(s,x,y,sc=2,c='#fff',sh='#181020'){s=String(s);const w=tw(s,sc),p=PFS[sc],oy=y+Math.round((FS[sc]*.8-7*p)/2);if(TBX){const m=g.getTransform();TBX.push({s,x:(m.a*x+m.e)/2,y:(m.d*y+m.f)/2,w:w*m.a/2,h:FS[sc]*.8*m.d/2,sq:Math.abs(m.a-2)>.01&&Math.abs(m.a-4)>.01})}
 if(sh){const o=Math.max(1,p*.75);for(const[dx,dy]of[[-o,0],[o,0],[0,-o],[0,o],[o,o],[-o,o],[o,-o],[-o,-o]])pfRun(s,x+dx,oy+dy,sc,sh);pfRun(s,x+o,oy+o+p*.5,sc,sh)}
 pfRun(s,x,oy,sc,c);}
function ctext(s,y,sc=2,c,sh){const w=tw(s,sc);if(w>W-6){g.save();g.translate(3,0);g.scale((W-6)/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round((W-w)/2),y,sc,c,sh);}
/* draw the world at 1x into an offscreen layer, then blow up the bottom-centre of it by z (crisp, no seams) */
function world(fn,z,ox=0,oy=0){if(wc.width!==480||wc.height!==H*2){wc.width=480;wc.height=H*2}
 g=wg;g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;try{fn()}finally{g=g0}
 const sw=W/z,sh=H/z;g.imageSmoothingEnabled=false;g.drawImage(wc,Math.round(W-sw),Math.round((H-sh)*2),Math.round(sw*2),Math.round(sh*2),ox,oy,W,H);}
const SW=336,K='#101018',PI=Math.PI,GR=2100,JV=470,LV=1.22,BS=1.25,WS=1.12; // BS: body scale (heads stay 1x, so fighters read as tall GBA-style sprites)
let H=200,F=172,cam=48,Z=1;
const zMax=()=>cl((H-40)/125,1,GFX?2.05:1.75); // ALT: closer camera (FABLE: closer again)
/* FABLE graphics pass: GFX=1 is the new look (cel-shaded sprites with cool shadows and a rim light, GBA colour treatment on the
   stages, a closer camera, the new HUD). GFX=0 draws everything the way it was. Visual only: no timing, reach or hitbox changes. */
const GFX=1;
const tone=(h,kr,kg,kb,ad)=>{const n=parseInt(h.slice(1),16),f=(v,k)=>('0'+Math.round(cl(v*k+ad,0,255)).toString(16)).slice(-2);return'#'+f(n>>16,kr)+f(n>>8&255,kg)+f(n&255,kb)};
const _sh=new Map(),dk=c=>{let v=_sh.get(c);if(!v){v=GFX&&c[0]==='#'&&c.length===7?tone(c,.6,.58,.7,0):shade(c,.66);_sh.set(c,v)}return v},lt=c=>{let v=_sh.get('L'+c);if(!v){v=GFX&&c[0]==='#'&&c.length===7?tone(c,1.2,1.17,1.06,12):shade(c,1.22);_sh.set('L'+c,v)}return v};
const R=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v,pick=a=>a[(Math.random()*a.length)|0];
function shade(h,k){const n=parseInt(h.slice(1),16),f=v=>('0'+Math.round(cl(v*k,0,255)).toString(16)).slice(-2);return'#'+f(n>>16)+f(n>>8&255)+f(n&255);}
function mtext(s,cx,y,sc,c,sh){text(s,Math.round(cx-tw(s,sc)/2),y,sc,c,sh);}
function disc(x,y,rad,c){for(let d=-rad;d<=rad;d++){const w=Math.round(Math.sqrt(rad*rad-d*d));r(c,x-w,y+d,2*w+1,1)}}
function ring(x,y,rad,c){for(let a=0;a<24;a++){const t=a/24*2*PI;r(c,Math.round(x+Math.cos(t)*rad),Math.round(y+Math.sin(t)*rad),1,1)}}
function heart(x,y,c,s=1){r(c,x-3*s,y-2*s,2*s,2*s);r(c,x+1*s,y-2*s,2*s,2*s);r(c,x-3*s,y-1*s,6*s,2*s);r(c,x-2*s,y+1*s,4*s,1*s);r(c,x-1*s,y+2*s,2*s,1*s);}

/* ---------- saved bits ---------- */
let SV={diff:0,clear:{},w:0,l:0,rule:0,tr:{}};
try{const s=JSON.parse(localStorage.getItem('ncko-v1')||'null');if(s)SV=Object.assign(SV,s)}catch(e){}
const store=()=>{try{localStorage.setItem('ncko-v1',JSON.stringify(SV))}catch(e){}};

/* ---------- heads (pixel art, facing right) ---------- */
const HD={
will:['...k.kk.kkk.k...','..kHkhHkhHhkHk..','.kHhhHhhhHhhhHk.','khhHdhhHhdhHhhhk','kHhdhhHdhhhHdhhk','khhhHhhhhHhhhdhk','khdhhsssssshhhk.','.khhssssssssshk.','.khsgggssgggshk.','.kggwewggwewggk.','.khsgggssgggshk.','.kbssssSsssssbk.','.kbbssssssssbbk.','.kbbbbmmmmbbbbk.','..kbbbbbbbbbbk..','...kkkkkkkkkk...'],
erin:['.....kkkkkk.....','...kkHHHhhhkk...','..khHHhhhhhhhk..','.khHhhhhhhhhhhk.','.khhhhhhhhhhhhhk','khhhhhhhssssshhk','khhhhhhssssssshk','khhhhhhsessesshk','khhhhhhssssssshk','.khhhhhsrssrsshk','.khhhhhssmmmsshk','..khhhhhkssskhk.','...kkkkk.kkk.k..'],
louie:['..k........k....','.kok......kok...','.kook....kook...','.koeokkkkoeok...','.kooooooooook...','kooeoooooeoook..','kookkoooookkok..','koooooooooooook.','koeeeoooeeeeeek.','keeeeeeeeeeeennk','keeeeeeeeeeeeek.','.keeeeeemmmeek..','..kkeeeeeeekk...','....kkkkkkk.....'],
chrome:['....kkkkkkkk....','...kCCcCCcccck..','..kCcCccCcccCck.','.kcCccccccccccck','.kckkkkkkkkkkkck','.kckvvvvvvvvvkck','.kckvvlvvvlvvkck','.kckvlvlvlvlvkck','.kckvvvvvvvvvkck','.kckvlvvvvvlvkck','.kckvvlllllvvkck','.kckvvvvvvvvvkck','.kckkkkkkkkkkkck','..kcccccccccck..','...kkddddddkk...','.....kkkkkk.....'],
bibi:['....kkkkkkkk....','..kkwwwwwwWWkk..','.kwwwwWwwwwwWWk.','.kwwWwwwwwwwwWk.','kwWwsssssssswWWk','kwWssssssssssWWk','kWsbbbbssbbbbsWk','kWsswessssewssWk','kSsssssSSsssssSk','.ksSsssSSsssSsk.','.ksSssSssSssSsk.','.kSssmmmmmmssSk.','.kSSssssssssSSk.','..kSSSssssSSSk..','...kkSSSSSSkk...','.....kkkkkk.....'],
kiss:['...kkkkkkk....','..khhhhhhhk...','.khhhhhhhhhk..','.khhhhhhhhhk..','khhssssssshk..','khssssssssssk.','khsswessswesk.','khssssssssssk.','.ksssssssspppk','.kssssssssppk.','..kssssssssk..','...kssssssk...','....kkkkkk....','..............'],
marcus:['...kkkkkkk....','..kcCCcccck...','.kcCcccccccck.','.kcccccbbbbbbk','.khffffffffk..','.khfkkffkkfk..','.kfffffffffk..','.krfffffffrk..','.krrfffffrrk..','.krrrwwwwrrk..','.krrrrrrrrrk..','..krrrrrrrk...','...kkkkkkk....','..............'],
mama:['...kkkkkkk....','..kddDddddk...','.kddDddddddddk','kdddddddddddk.','kddddsssssddk.','kdddsssssssdk.','kdddsesssesdk.','kddyssssssssk.','kdddsstttttsk.','kdddsssttsssk.','kddddkssssk...','kddddkkkkk....','kdddddk.......','.kkkkk........']};
HD.ruby=['..k..........kk...','.khk..kkkk..khhk..','.kGgk.khHhkkggGk..','.kggkkhHhhhhkgk...','..kkhhhhhhhhhkk...','..khHhhhhhhhhhk...','.khhhhhsssshhhhk..','.khhhhssssssshhk..','khhhhSsssssssshk..','khhhSsseessseesk..','khhhSssewsssewsk..','khhkSrsssssssrssk.','.khkSsssssssssssk.','.khhkSssssmmsssk..','..khkSSssswwsssk..','...kkkSSssssSkk...','.....kkkSSSkk.....','.......kkkk.......'];

/* FLOW PROS, Marcus's company (Cleveland). The colours are a placeholder until Will sends the real logo or a photo of the truck:
   change them here and his cap, hoodie and the truck all follow. */
const FP={main:'#1c64c8',lite:'#5a9cf0',dark:'#124a98',paint:'#f4f4f0'};
/* ---------- roster ---------- */
const CH=[
{id:'will',n:'WILL',tag:'THE DEVELOPER',pal:{k:K,h:'#5e3c22',H:'#9a6a3c',d:'#3e2614',s:'#f0c8a0',S:'#d8a880',g:'#1c161c',w:'#d8e8ee',e:'#3a78b0',b:'#8a5630',m:'#c06858'},
 skin:'#f0c8a0',top:'#24222c',arm:'#24222c',fore:'#f0c8a0',pant:'#d83030',shin:'#f0c8a0',shoe:'#f4f4f4',bg:'#3a6ea8',spd:78,pow:1,cdT:4.2,stage:6,
 sp:'SELFIE FLASH',sp2:'MAZEL TOV LASER',su:'HASBARA',su1:'BIKE LANE',fin:'SELFIE-ALITY',ft:'photo',win:['SHIPPED IT.','GG. PUSHING TO MAIN.','THAT WAS A FEATURE, NOT A BUG.']},
{id:'erin',n:'ERIN',tag:'KEEPER OF THE GARDEN',pal:{k:K,h:'#74482c',H:'#a06c40',y:'#c89a62',s:'#f6d2b4',e:'#3c6478',r:'#f0a8a0',m:'#c85868'},
 skin:'#f6d2b4',top:'#2e8a58',arm:'#2e8a58',fore:'#2e8a58',pant:'#3a5a90',shin:'#3a5a90',shoe:'#f4f4f4',bg:'#58a868',spd:82,pow:.96,cdT:2.6,stage:2,
 sp:'TOWEL WHIP',sp2:'HIDE AND SEEK',su:'LOUIE AIRLINES',su1:'SPROUT STAMPEDE',fin:'GARDEN-ALITY',ft:'flowers',win:['A SLOW DAY IS STILL A GOOD DAY.','NICE AND STEADY.','GO WATER YOURSELF.']},
{id:'louie',n:'LOUIE',tag:'EVOLVED SHIBA. EST 2018',pal:{k:'#30201c',o:'#e89040',e:'#fff0d8',n:'#201418',m:'#c05860'},
 skin:'#fff0d8',top:'#e89040',arm:'#e89040',fore:'#e89040',pant:'#e89040',shin:'#e89040',shoe:'#fff0d8',bg:'#d87830',spd:96,pow:.95,cdT:2.6,stage:1,
 th:9,sn:8,ls:.8,rch:.9,tl:13,tw:12,
 sp:'ZOOM ZOOM ZOOM',sp2:'TURBO ZOOM',su:'JUDGEMENT',fin:'BORK-ALITY',ft:'blast',win:['WOOF.','IS IT PATE TIME?','MUCH VICTORY. VERY GOOD BOY.']},
{id:'chrome',n:'LIL BOTTIE',tag:'CLANKER GUNS. CHAIN STUN.',pal:{k:K,c:'#aab2c0',C:'#e4eaf2',d:'#3a4050',v:'#101420',l:'#40a0ff'},
 skin:'#c8d0dc',top:'#b8c0cc',arm:'#b8c0cc',fore:'#a0a8b6',pant:'#1c1c24',shin:'#1c1c24',shoe:'#0c0c12',bg:'#7050a0',spd:70,pow:1.08,cdT:2,stage:7,
 aw:5,tw:13,rch:1.05,
 sp:'CLANKER GUNS',sp2:'CHAIN STUN',su:'NUKE THE DATA CENTER',su1:'AIR SUPPORT',fin:'LATTE-ALITY',ft:'rocket',win:['CLANK CLANK.','SMILE.EXE COMPLETE.','YOU JUST GOT CHAINED.']},
{id:'bibi',n:'KING BIBI',tag:'PRIME MINISTER. AGAIN.',pal:{k:K,w:'#f0f0f4',W:'#b0b0bc',s:'#e6b48e',S:'#c48e68',b:'#3a343e',e:'#241c20',m:'#8a4840'},
 skin:'#e6b48e',top:'#24304c',arm:'#24304c',fore:'#24304c',pant:'#24304c',shin:'#24304c',shoe:'#121216',bg:'#3a5a9a',spd:72,pow:1.08,cdT:2.6,stage:8,
 sp:'RED LINE',sp2:'IRON DOME',su:'WAR CRIMINAL',su1:'COALITION',fin:'FILIBUSTER-ALITY',ft:'sleep',win:['I ALWAYS COME BACK.','NEXT QUESTION.','THE COALITION HOLDS.']},
{id:'kiss',n:'CORBIN',tag:'CAN I GET A KISS MAN',pal:{k:K,h:'#1c1410',s:'#b07850',w:'#ffffff',e:'#201410',p:'#f05888'},
 skin:'#b07850',top:'#d83c8c',arm:'#d83c8c',fore:'#d83c8c',pant:'#d83c8c',shin:'#c02030',shoe:'#c02030',bg:'#f078a8',spd:80,pow:1,cdT:2.2,stage:4,
 sp:'CAN I GET A KISS',sp2:'SNEAKY KISS',su:'007',fin:'SMOOCH-ALITY',ft:'love',win:['CAN I GET A KISS?','CAN I GET A KISS?','...CAN I GET A KISS?']},
{id:'marcus',n:'MARCUS',tag:'PLUMBING BOSS. ALL GAS, BRO.',pal:{k:K,c:FP.main,C:FP.lite,b:FP.dark,h:'#5a3a22',f:'#f0c8a0',r:'#7a5030',w:'#ffffff'},
 skin:'#f0c8a0',top:FP.main,arm:FP.main,fore:'#f0c8a0',pant:'#28324a',shin:'#28324a',shoe:'#6a4424',bg:'#d06818',spd:84,pow:1.05,cdT:2.4,stage:0,
 sp:'DAB CLOUD',sp2:'DOUBLE OR NOTHING',su:'THE FINAL BET',su1:'DEREK PULLS UP',fin:'FLUSH-ALITY',ft:'flush',win:['BRO.','BUILT DIFFERENT, BRO.','I HAD MONEY ON THAT, BRO.']},
{id:'mama',n:'MAMA',tag:'RUNS ON NO SLEEP',pal:{k:K,d:'#2e1e1a',D:'#4e342a',s:'#e8b890',e:'#281c18',y:'#f8d030',t:'#ffffff'},
 skin:'#e8b890',top:'#7a2434',arm:'#7a2434',fore:'#7a2434',pant:'#34486c',shin:'#34486c',shoe:'#3a2a24',bg:'#983848',spd:80,pow:1.02,cdT:2.2,stage:3,
 sp:'BOTTLE TOSS',sp2:'MOM VOICE',su:'RUBY TEMPER TANTRUM',su1:'YUKON',fin:'NAPTIME-ALITY',ft:'sleep',win:['SHHH. NAP TIME.','I HAVE BEEN UP SINCE 4.','USE YOUR INSIDE FISTS.']}];
HD.louie2=['................','................','....kkkkkkkkk...','kkkkoooooooookk.','koeeeooooooeeek.'].concat(HD.louie.slice(5));
CH.forEach(c=>{c.head=mk(HD[c.id],c.pal);if(HD[c.id+'2'])c.head2=mk(HD[c.id+'2'],c.pal);c.headL=flip(c.head);for(const k of['top','arm','fore','pant','shin','skin','shoe'])c[k+'D']=shade(c[k],.72);});
const cix=id=>CH.findIndex(c=>c.id===id);
/* ALT: dialogue. Pre-fight banter on the VS screen (PAIR for set matchups, else each fighter's INTRO), more win quotes,
   and barks mid-fight (on a 4-hit combo, and once when low). Written in the cast's canon voices; all invented, flag to Will. */
const INTRO={
 will:["LET ME JUST PUSH THIS FIRST.","I BUILT THIS GAME. I KNOW THE FRAME DATA.","QUICK MATCH, THEN BACK TO WORK.","MAZEL TOV. YOU'RE ABOUT TO LOSE."],
 marcus:["BRO. I'VE GOT A GUY. THE GUY IS ME.","SEE ONE, SEND ONE, BRO.","DAP ME UP BEFORE I DESTROY YOU, BRO.","I'VE SEEN BETTER FIGHTERS IN THE POND, BRO."],
 chrome:["HELLO. I AM HERE TO HELP. MOSTLY WITH PUNCHING.","RUNNING FIGHT.EXE...","CONTEXT WINDOW: FULL OF YOUR MISTAKES.","I MIGHT JUST HIT MY RATE LIMIT. ON YOUR FACE."],
 mama:["I HAVE BEEN UP SINCE 4.","DON'T MAKE ME TURN THIS YUKON AROUND.","RUBY. MOMMY'S BUSY."]};
const PAIR={
 'marcus>will':["WILL. YOU'RE SUCH A J. LOVE YOU, BRO.","STILL GONNA BEAT YOU, MARCUS."],
 'will>marcus':["MARCUS. NO WRENCHES THIS TIME.","BRO. THE WRENCH IS PART OF ME."],
 'chrome>will':["HI WILL. I WROTE YOU A HANDOFF.","I'LL READ IT AFTER I WIN."],
 'will>chrome':["BOTTIE. STAY IN YOUR CONTEXT WINDOW.","I HAVE NO CONTEXT. ONLY FISTS."],
 'marcus>chrome':["A ROBOT? BRO, I'VE GOT A GUY FOR THAT.","PLEASE RATE THIS BEATDOWN FROM 1 TO 5."],
 'chrome>marcus':["SCANNING... 100% BRO DETECTED.","BRO. EVEN THE ROBOT KNOWS."],
 'marcus>louie':["THE DOG? BRO, HE'S THE ONLY ONE I RESPECT.","WOOF."],
 'will>louie':["LOUIE. BUDDY. PLEASE GO EASY.","*ZOOM ZOOM ZOOM*"],
 'will>bibi':["SHALOM. LET'S KEEP IT CIVIL.","NEXT QUESTION."],
 'chrome>bibi':["FACT CHECK: PENDING.","I DON'T DO FACT CHECKS."],
 'marcus>bibi':["BRO. NICE SUIT. WHO'S YOUR GUY?","I AM MY OWN GUY."],
 'will>mama':["MAMA. WE DON'T HAVE TO DO THIS.","I'VE BEEN UP SINCE 4. WE DO."],
 'mama>will':["WILL. WATCH THE BABY FOR FIVE MINUTES.","AFTER THIS ROUND. MAYBE."]};
const BARK={
 will:{combo:["CTRL+Z THAT!","HOTFIX INCOMING!","SHIP IT!"],hurt:["THAT'S A BUG.","WHO APPROVED THAT PR?"]},
 marcus:{combo:["BRO. BRO. BRO.","BUILT DIFFERENT!","WRITE IT DOWN, BRO!"],hurt:["THAT'S REPORTABLE, BRO.","I'M FINE. I'M GREAT."]},
 chrome:{combo:["BEEP BOOP. MOSTLY BOOP.","PROCESSING... PROCESSED.","CLANK CLANK CLANK."],hurt:["ERROR 404: DIGNITY","PLEASE RATE THIS RESPONSE."]}};
CH[cix('will')].win.push('PATCH NOTES: YOU LOST.','WORKS ON MY MACHINE.','MERGED. CLOSED. NEXT TICKET.');
CH[cix('marcus')].win.push('READ MY REVIEWS, BRO. FIVE STARS.','I LET YOU HAVE ONE HIT. STRATEGY.','TELL EVERYONE IT WAS CLOSE, BRO.');
CH[cix('chrome')].win.push('TASK COMPLETE. WANT A SUMMARY?','HANDOFF UPDATED: YOU LOST.','RATE LIMIT REACHED. FOR YOU.');
const banter=(a,b)=>PAIR[a.id+'>'+b.id]||[pick(INTRO[a.id]||a.win),pick(INTRO[b.id]||b.win)];
const wrapT=(s_,n)=>{const out=[];let l='';for(const w of s_.split(' ')){if((l+' '+w).trim().length>n){out.push(l);l=w}else l=(l+' '+w).trim()}if(l)out.push(l);return out};
function bubble(lines,x,y,right,col){const w=Math.max(...lines.map(l=>tw(l,1)))+8,h=lines.length*10+5,bx=right?x-w:x;r(K,bx,y,w,h);r('#ffffff',bx+1,y+1,w-2,h-2);r('#ffffff',right?x-14:x+10,y-3,4,4);r(K,right?x-15:x+9,y-4,1,4);
 lines.forEach((l,i)=>text(l,bx+4,y+3+i*10,1,col||'#201828',null))}

/* ---------- poses: [hipX,hipY,lean, backFootX,Y, frontFootX,Y, backHandX,Y, frontHandX,Y, headX,headY] ---------- */
const p=(hx,hy,ln,bfx,bfy,ffx,ffy,bhx,bhy,fhx,fhy,hdx=0,hdy=0)=>[hx,hy,ln,bfx,bfy,ffx,ffy,bhx,bhy,fhx,fhy,hdx,hdy];
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const PS={
 st:p(0,19,.1,-7,0,7,0,6,1,10,4),st2:p(0,18.4,.12,-7,0,7,0,6,0,10,3),
 w1:p(0,19,.12,-4,2,7,0,6,1,10,4),w2:p(1,19,.14,-5,0,10,2,6,0,9,3),
 cr:p(0,11,.3,-8,0,8,0,6,-3,10,0),jr:p(0,20,.05,-3,1,3,2,3,-8,7,-6),jt:p(0,19,.25,-5,7,6,9,4,-6,9,-3),
 p1w:p(0,19,.1,-7,0,7,0,5,-4,3,-2),p1:p(3,19,.25,-7,0,8,0,4,-4,16,0),
 p2w:p(1,19,.15,-7,0,7,0,1,-3,8,-2),p2:p(4,19,.35,-7,0,8,0,16,-1,6,-3),
 p3w:p(-1,19,0,-7,0,7,0,5,-4,-3,-3),p3:p(6,18,.42,-8,0,10,0,2,-6,16,1),
 kw:p(-1,20,-.1,-6,0,6,9,5,-4,8,-2),k:p(-2,20,-.38,-6,0,21,19,2,-6,6,-4),
 sww:p(-1,10,.1,-7,0,8,0,2,-8,6,-4),sw:p(-3,9,-.35,-7,0,22,1,-5,-11,4,-8),
 upw:p(0,10,.35,-8,0,8,0,6,-3,7,-9),up:p(3,21,-.08,-6,0,7,1,3,-6,8,13),
 jp:p(0,19,.4,-6,6,4,9,3,-6,13,-9),jk:p(0,19,-.25,-7,9,17,5,3,-5,7,-3),
 hh:p(-3,19,-.38,-8,0,5,0,-2,-7,3,-8,-2,0),hl:p(-2,17,.55,-8,0,6,0,6,-8,8,-9,1,-1),
 bl:p(-1,19,-.05,-8,0,6,0,8,3,10,5),cbl:p(-1,11,.2,-8,0,8,0,8,2,10,4),
 kn:p(0,19,-.2,-5,3,7,6,-5,3,-3,7),lie:p(0,19,0,-2,1,3,0,-2,-9,2,-10),
 dz1:p(-2,18,-.15,-6,0,6,0,1,-12,3,-12,-1,0),dz2:p(2,18,.25,-6,0,6,0,3,-12,5,-12,1,-1),
 win1:p(0,20,0,-5,0,5,0,-5,12,6,12),win2:p(0,21,0,-5,1,5,1,-6,13,7,13),
 cast:p(2,19,.2,-7,0,8,0,3,-6,15,1),castw:p(-1,19,0,-7,0,7,0,4,-5,2,-3),
 thr:p(3,19,.3,-7,0,8,0,13,0,14,2),sup:p(0,20,-.15,-8,0,8,0,-6,10,8,11),
 run:p(4,13,.95,-11,3,9,2,8,-9,12,-7),
 beam:p(1,18,.18,-8,0,8,0,13,-1,15,0),pln:p(0,8,1.4,-17,6,-15,10,-11,5,11,7),whip:p(5,18,.4,-8,0,10,0,2,-6,16,-2),
 dsf:p(3,17,.5,-9,1,9,1,6,-6,11,-3),dsb:p(-2,19,-.25,-6,3,6,2,4,-5,8,-2),
 self:p(0,19,-.12,-7,0,7,0,5,-4,3,9,-3,0),selfw:p(-1,19,.12,-7,0,7,0,5,-4,13,3,1,0),
 ewb:p(-3,19,-.2,-8,0,6,0,4,-4,-6,-2),ew1:p(-1,19,-.1,-7,0,7,0,2,-6,4,14),ew2:p(5,17,.45,-8,0,10,0,2,-6,14,-6),ewl:p(3,12,.5,-8,0,9,0,2,-4,15,-10),
 bitew:p(-1,19,-.1,-7,0,7,0,4,-5,6,-4,-2,1),bite:p(4,18,.6,-8,0,9,0,2,-8,6,-9,6,-3),loaf:p(3,7,1.3,-6,0,5,0,4,-8,6,-9,3,-4)};

/* ---------- normal moves (seconds / pixels). l: h=high m=mid l=low o=overhead ---------- */
const MV={
 fk:{w:'kw',p:'k',su:.13,ac:.1,rc:.22,d:8,x:6,x2:33,y:14,y2:30,hs:.34,kb:110,l:'m'},
 p1:{w:'p1w',p:'p1',su:.07,ac:.08,rc:.12,d:4,x:4,x2:27,y:30,y2:42,hs:.3,kb:60,l:'h',nx:'p2'},
 p2:{w:'p2w',p:'p2',su:.07,ac:.08,rc:.14,d:5,x:4,x2:29,y:30,y2:42,hs:.32,kb:70,l:'h',nx:'p3'},
 p3:{w:'p3w',p:'p3',su:.1,ac:.09,rc:.26,d:8,x:4,x2:31,y:26,y2:42,hs:.3,kb:210,l:'m',big:1},
 k:{w:'kw',p:'k',su:.13,ac:.1,rc:.22,d:8,x:6,x2:33,y:14,y2:30,hs:.34,kb:110,l:'m'},
 up:{w:'upw',p:'up',su:.12,ac:.1,rc:.36,d:12,x:2,x2:22,y:14,y2:52,la:[50,250],l:'m',cr:1,big:1},
 sw:{w:'sww',p:'sw',su:.14,ac:.1,rc:.32,d:7,x:6,x2:33,y:0,y2:10,la:[30,150],l:'l',cr:1},
 jp:{w:'jp',p:'jp',su:.06,ac:.4,rc:0,d:7,x:0,x2:22,y:4,y2:26,hs:.36,kb:60,l:'o',air:1},
 jk:{w:'jk',p:'jk',su:.07,ac:.4,rc:0,d:9,x:2,x2:27,y:0,y2:18,hs:.38,kb:90,l:'o',air:1}};
const WORDS=['POW!','BONK!','OOF!','WHAM!','BAP!','YIKES!','THWACK!'];
/* per-fighter tweaks to the shared moves above (prop, say = callout, lg = lunge speed) */
const MVO={
 louie:{k:{w:'bitew',p:'bite',su:.09,x:8,x2:30,y:22,y2:42,d:9,hs:.36,kb:100,bite:1},sw:{w:'cr',p:'loaf',su:.1,ac:.26,rc:.22,d:8,x:-6,x2:20,y:0,y2:16,la:[60,170],l:'l',cr:1,lg:320,say:'NEED MORE LOAF'}},
 erin:{up:{say:'BEAN DIP!',d:13}},
 kiss:{up:{say:'CAN I GET A KISS?'},sw:{say:'CAN I GET A KISS?'}},
 marcus:{k:{prop:'wrench',x2:38,d:9,su:.15,kb:140},up:{prop:'plunger'},sw:{snake:1,x2:50,su:.16,rc:.36,d:7},p3:{say:'BRO!'}},
 mama:{k:{prop:'bag',x2:37,d:9,su:.15}}};
const DEFN={fk:'FWD HEAVY',p:'COMBO',k:'HEAVY',up:'LAUNCHER',sw:'SWEEP',thr:'THROW',jk:'AIR ATTACK'},KISS='CAN I GET A KISS';
const MN={
 will:{fk:'FORCE PUSH',p:'QUICK COMMIT',k:'SNEAKER KICK',up:'HOTFIX',sw:'MERGE CONFLICT',thr:'CODE REVIEW',jk:'STAGE DIVE'},
 erin:{fk:'TRELLIS SPIN',p:'SASSY SLAP',k:'GARDEN KICK',up:'BEAN DIP',sw:'WEED PULL',thr:'HUG IT OUT',jk:'FLYING FLOP'},
 louie:{fk:'ZOOMIE TACKLE',p:'PAW PAW PAW',k:'CHOMP',up:'SNOOT BOOP',sw:'NEED MORE LOAF',thr:'TACKLE HUG',jk:'ZOOM POUNCE'},
 chrome:{fk:'ROCKET FIST',p:'CLANK JAB',k:'SERVO KICK',up:'UPLINK',sw:'LOW BATTERY',thr:'FACTORY RESET',jk:'DROPKICK.EXE'},
 bibi:{p:'TALKING POINTS',k:'PODIUM KICK',up:'POLL BUMP',sw:'SWEEPING REFORM',thr:'COALITION DEAL',jk:'COMEBACK TOUR'},
 kiss:{p:KISS,k:KISS,up:KISS,sw:KISS,thr:KISS,jk:KISS},
 marcus:{fk:'DAP UP',p:'BRO JAB',k:'PIPE WRENCH',up:'PLUNGER POP',sw:'SNAKE THE DRAIN',thr:'BRO HUG',jk:'CANNONBALL, BRO'},
 mama:{p:'MOM SLAP',k:'DIAPER BAG',up:'BURP CLOTH',sw:'TOY ON THE FLOOR',thr:'TIME OUT',jk:'STROLLER SLAM'}};
/* ALT: each of the five has their own stance, walk and attack shapes (PSO) and moves (MVO). Others use the shared set. */
const PSO={};
/* FABLE: each fighter stands and walks their own way (idle and walk only; attacks, timing and hitboxes are shared and unchanged).
   STN = [hipX,hipY,lean, backFootX,frontFootX, backHandX,Y, frontHandX,Y, headX,headY, bounce]. Set STANCES=0 to switch them all off. */
const STANCES=1,STN={
 will:[0,19,.17,-7,7,3,-6,9,-2,1,0,.6],     // loose and a bit slouched, hands low
 erin:[0,19,.04,-5,6,5,2,9,5,0,0,1.3],      // boxer: upright, guard high, light on her feet
 louie:[1,15.5,.42,-9,9,7,-4,12,-1,2,-1,.8],// low and coiled, ready to zoom
 chrome:[0,19.4,0,-6,6,6,-7,9,-7,0,0,.25],  // stiff, forearms level, barely moves
 bibi:[0,19.4,-.03,-5,5,-3,-10,8,3,0,0,.4], // one hand behind his back, one making a point
 kiss:[0,19,.13,-6,7,1,-3,11,2,1,0,.9],     // leaning in, one arm reaching
 marcus:[-1,19,-.07,-9,8,2,-9,9,-7,0,0,.6], // chest out, wide base, fists low
 mama:[0,19,.05,-6,6,-1,-11,9,2,0,0,.6]};   // hand on her hip
if(STANCES)for(const id in STN){const[hx,hy,ln,bf,ff,bx,by,fx_,fy,hdx,hdy,bn]=STN[id];
 PSO[id]={st:p(hx,hy,ln,bf,0,ff,0,bx,by,fx_,fy,hdx,hdy),st2:p(hx,hy-bn,ln+.02,bf,0,ff,0,bx,by-.8,fx_,fy-.9,hdx,hdy),
  w1:p(hx,hy,ln+.02,-4,2,7,0,bx,by,fx_,fy,hdx,hdy),w2:p(hx+1,hy,ln+.04,-5,0,10,2,bx,by-1,fx_-1,fy-1,hdx,hdy)}}
CH.forEach(c=>{c.ps=Object.assign({},PS,PSO[c.id]||{});});
CH.forEach(c=>{c.mv={};for(const k in MV)c.mv[k]=Object.assign({},MV[k],(MVO[c.id]||{})[k],{key:k});c.mn=Object.assign({},DEFN,MN[c.id])});

/* ---------- game state ---------- */
const G={sa:2,zp:0,hv:null,mc:0,scr:'title',t:0,mi:0,mode:'arc',cur:0,p1:0,p2:2,stage:0,ladder:[],li:0,f:[],fx:[],pt:[],phase:'intro',pT:0,round:1,timer:60,hs:0,freeze:0,slow:0,shake:0,flash:0,banner:null,fin:null,scrT:0,said:0,cont:9,ctrl:0};
/* FABLE: house rules for Quick Fight and Training (title menu: RULES), and the rules Trials fight under */
const RULES=[['NORMAL',{}],['TURBO',{turbo:1}],['MOON GRAVITY',{moon:1}],['BIG HEADS',{big:1}],['GLASS CANNON',{glass:1}],['METER MADNESS',{meter:1}],['SUDDEN DEATH',{sd:1}],['CHAOS',{turbo:1,moon:1,big:1,meter:1}]];
const MU=()=>G.mut||{},grv=()=>MU().moon?GR*.45:GR,oneRound=()=>G.mode==='surv'||G.mode==='trial';
/* FABLE: TRIALS. One-round fights with a goal. Clear = win with the goal met (a star); GOLD = also finish on 70+ health
   (or the trial's own gold rule). q is the tally kept during the fight (G.tq). Names are invented: flag to Will. */
const TRIALS=[
 {id:'t01',n:'FIRST COMMIT',p1:'will',p2:'louie',lv:0,goal:'WIN THE ROUND',ok:q=>1},
 {id:'t02',n:'COMBO CLASS',p1:'erin',p2:'kiss',lv:0,goal:'LAND A 4-HIT COMBO',ok:q=>q.combo>=4,pr:q=>'BEST COMBO '+q.combo+'/4'},
 {id:'t03',n:'PARRY SCHOOL',p1:'will',p2:'chrome',lv:0,goal:'PARRY 2 HITS (TAP BACK LATE)',ok:q=>q.parry>=2,pr:q=>'PARRIES '+q.parry+'/2'},
 {id:'t04',n:'ALL BITE',p1:'louie',p2:'marcus',lv:0,goal:'WIN USING ONLY B ATTACKS',ok:q=>!q.other,pr:q=>q.other?'USED SOMETHING ELSE':'ONLY B SO FAR'},
 {id:'t05',n:'WALL STREET',p1:'marcus',p2:'bibi',lv:0,goal:'BOUNCE THEM OFF THE WALL',ok:q=>q.wall>=1,pr:q=>'WALL BOUNCES '+q.wall+'/1'},
 {id:'t06',n:'HUG IT OUT',p1:'erin',p2:'mama',lv:1,goal:'LAND 3 THROWS (FWD + A UP CLOSE)',ok:q=>q.thr>=3,pr:q=>'THROWS '+q.thr+'/3'},
 {id:'t07',n:'SPEED RUN',p1:'louie',p2:'kiss',lv:1,goal:'WIN WITH 40 ON THE CLOCK',ok:q=>q.clock>=40,pr:()=>'CLOCK '+Math.ceil(G.timer)},
 {id:'t08',n:'UNTOUCHABLE',p1:'chrome',p2:'will',lv:1,goal:'WIN ON 80+ HEALTH',ok:q=>q.hp>=80,pr:()=>'HEALTH '+Math.ceil(G.f[0].hp)},
 {id:'t09',n:'FULL SEND',p1:'mama',p2:'marcus',lv:1,mut:{meter:1},goal:'LAND A FULL-METER SUPER',ok:q=>q.sup>=1,pr:q=>'FULL SUPERS '+q.sup+'/1'},
 {id:'t10',n:'MOON LANDING',p1:'will',p2:'chrome',lv:1,mut:{moon:1},goal:'LAND 3 AIR ATTACKS ON THE MOON',ok:q=>q.air>=3,pr:q=>'AIR HITS '+q.air+'/3'},
 {id:'t11',n:'HEAD GAMES',p1:'bibi',p2:'kiss',lv:1,mut:{big:1,turbo:1},goal:'WIN: BIG HEADS, TURBO',ok:q=>1},
 {id:'t12',n:'JUGGLER',p1:'marcus',p2:'louie',lv:1,goal:'LAND A 6-HIT COMBO',ok:q=>q.combo>=6,pr:q=>'BEST COMBO '+q.combo+'/6'},
 {id:'t13',n:'GLASS JAW',p1:'kiss',p2:'bibi',lv:2,mut:{glass:1},goal:'WIN: EVERY HIT COUNTS DOUBLE',ok:q=>1},
 {id:'t14',n:'SUDDEN DEATH',p1:'mama',p2:'marcus',lv:2,mut:{sd:1},goal:'FIRST HIT WINS',ok:q=>1,gold:q=>q.clock>=52,gt:'GOLD: WIN WITH 52 ON THE CLOCK'},
 {id:'t15',n:'PARRY MASTER',p1:'erin',p2:'chrome',lv:2,goal:'PARRY 5 HITS',ok:q=>q.parry>=5,pr:q=>'PARRIES '+q.parry+'/5'},
 {id:'t16',n:'FINAL EXAM',p1:'will',p2:'louie',lv:2,mut:{turbo:1},goal:'BEAT LOUIE ON HARD, TURBO',ok:q=>1}];
const trStars=()=>TRIALS.reduce((n,t)=>n+((SV.tr||{})[t.id]||0),0);
const RK={3:'NICE!',5:'SWEET!',7:'SAVAGE!',9:'UNREAL!!'};
/* FABLE: LAST LANTERN. Under 25 health a fighter's lantern flares: embers rise off them, their hits do 15% more and their meter
   creeps up by itself. A comeback, not a reversal. LAST=0 switches it off. */
const LAST=1,lastL=f=>LAST&&f.hp>0&&f.hp<25&&!MU().sd&&G.mode!=='train';
const sfx={
 hit:b=>{noise(b?.12:.07,.55,b?600:1100,'lowpass');snd(b?90:150,.1,45,'square',.09);snd(b?55:75,b?.22:.12,28,'sine',b?.5:.3)},
 blk:()=>{snd(320,.04,210,'triangle',.09);noise(.03,.18,3200)},
 wh:()=>noise(.05,.1,1700,'bandpass'),
 thud:()=>{noise(.09,.4,300,'lowpass');snd(70,.12,35,'sine',.3)},
 ui:()=>snd(520,.04),ok:()=>snd(660,.08,990),no:()=>snd(160,.1,110)};

/* ---------- drawing the rig ---------- */
function seg(x0,y0,x1,y1,w,c){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))),h=w/2;g.fillStyle=c;
 for(let i=0;i<=n;i++){g.fillRect(Math.round(x0+(x1-x0)*i/n-h),Math.round(-(y0+(y1-y0)*i/n)-h),w,w)}}
function limb(a,b,c,w,c1,c2){seg(a[0],a[1],b[0],b[1],w+2,K);seg(b[0],b[1],c[0],c[1],w+2,K);seg(a[0],a[1],b[0],b[1],w,dk(c1));seg(b[0],b[1],c[0],c[1],w,dk(c2));
 seg(a[0]-.5,a[1]+.5,b[0]-.5,b[1]+.5,w-1,c1);seg(b[0]-.5,b[1]+.5,c[0]-.5,c[1]+.5,w-1,c2);seg(a[0],a[1]+w/2-1,b[0],b[1]+w/2-1,1,lt(c1));}
function ik(a,t,l1,l2,bend){let dx=t[0]-a[0],dy=t[1]-a[1],d=Math.hypot(dx,dy)||.001;const m=l1+l2-.01;if(d>m){dx*=m/d;dy*=m/d;d=m}
 const a0=Math.atan2(dy,dx),a1=Math.acos(cl((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),an=a0+bend*a1;return[[a[0]+Math.cos(an)*l1,a[1]+Math.sin(an)*l1],[a[0]+dx,a[1]+dy]];}
const B=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(-y-h),w,h)}; // rect with y-up coords, (x,y)=bottom-left
/* ---------- ALT rig v3: GBA-style sprite renderer ----------
   Same skeleton and poses as before (so timing, reach and hitboxes don't change). What changed is how a body is drawn:
   - every part is a shaped, tapered piece (capsules with rounded joints, a torso with chest and shoulders, real fists and shoes)
     with three tones lit from the front and above;
   - the figure is drawn at 1x into small layers (back limbs / body / front arm), snapped to whole pixels, and each layer gets
     ONE outline around its silhouette, like a sprite artist would draw it, instead of an outline on every stroke;
   - finished sprites are cached by pose, so most frames are a single drawImage. */
const SPW=128,SPH=124,SPX=64,SPY=112,SPO='#141018';
const spMk=()=>{const c=document.createElement('canvas');c.width=SPW;c.height=SPH;return c};
const SPL=[spMk(),spMk(),spMk()],SPLX=SPL.map(c=>c.getContext('2d',{willReadFrequently:true}));
const SPCACHE=new Map();
let VX=null;
const vcol=c=>{VX.fillStyle=c};
function vcirc(x,y,r,col){if(r<=0)return;vcol(col);VX.beginPath();VX.arc(x,y,r,0,7);VX.fill()}
function vcap(a,b,r0,r1,col){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1e-3,nx=-dy/d,ny=dx/d;vcol(col);VX.beginPath();
 VX.moveTo(a[0]+nx*r0,a[1]+ny*r0);VX.lineTo(b[0]+nx*r1,b[1]+ny*r1);VX.lineTo(b[0]-nx*r1,b[1]-ny*r1);VX.lineTo(a[0]-nx*r0,a[1]-ny*r0);VX.closePath();VX.fill();vcirc(a[0],a[1],r0,col);vcirc(b[0],b[1],r1,col)}
function vpoly(pts,col){vcol(col);VX.beginPath();VX.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)VX.lineTo(pts[i][0],pts[i][1]);VX.closePath();VX.fill()}
/* a lit limb: dark base, mid tone nudged toward the light (front, up), a thin highlight */
function vlimb(a,b,r0,r1,col,hl){vcap(a,b,r0,r1,dk(col));const o=GFX?1.05:.75,i_=GFX?1.2:.85;vcap([a[0]+o,a[1]+o],[b[0]+o,b[1]+o],Math.max(.6,r0-i_),Math.max(.6,r1-i_),col);
 if(hl!==0){const o2=Math.min(r0,r1)*.55;vcap([a[0]+o2,a[1]+o2],[b[0]+o2,b[1]+o2],Math.max(.5,r0*(GFX?.34:.28)),Math.max(.5,r1*(GFX?.3:.24)),lt(col))}}
const lerp2=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];
/* snap a layer to whole pixels and give it one outline around its silhouette */
function spBake(i){const x=SPLX[i],d=x.getImageData(0,0,SPW,SPH),p=d.data,n=SPW*SPH,on=new Uint8Array(n);
 for(let k=0;k<n;k++){if(p[k*4+3]>=110){on[k]=1;p[k*4+3]=255}else p[k*4+3]=0}
 const ol=[17,16,24];for(let k=0;k<n;k++){if(on[k])continue;const xx=k%SPW;if((xx>0&&on[k-1])||(xx<SPW-1&&on[k+1])||(k>=SPW&&on[k-SPW])||(k<n-SPW&&on[k+SPW])){p[k*4]=ol[0];p[k*4+1]=ol[1];p[k*4+2]=ol[2];p[k*4+3]=255}}
 if(GFX)for(let k=SPW;k<n-SPW;k++){if(!on[k])continue;const q=k*4;
   if(!on[k-SPW]){p[q]=Math.min(255,p[q]*1.22+16);p[q+1]=Math.min(255,p[q+1]*1.2+14);p[q+2]=Math.min(255,p[q+2]*1.1+8)}
   else if(!on[k+SPW]){p[q]*=.7;p[q+1]*=.68;p[q+2]*=.82}}
 x.putImageData(d,0,0)}
/* per-character outfits: colours and extras on the shared figure */
const OUT={
 will:{torso:[5.2,5.6,5.6,5.4],sleeve:.5,shorts:1,socks:'#f4f4f4'},
 erin:{torso:[5,3.9,4.6,4.3],hair:'#74482c',hairEnd:'#c89a62',hairLen:13,thin:.85},
 marcus:{torso:[5.2,5.1,5.6,5.5],hood:1,cuffs:1,bulk:1,boots:1},
 louie:{torso:[5.6,6,6.4,5.8],dog:1,bulk:1.1},
 chrome:{torso:[6.4,7,7.4,7.2],puffer:1,mech:1,bulk:1.15},
 bibi:{torso:[5.4,5.6,6,6.2],suit:1},
 kiss:{torso:[5,4.8,5.4,5.4],cape:1},
 mama:{torso:[5.2,4.4,5,4.8],hair:'#2e1e1a',hairLen:10,thin:.9}};
function rig(c,P,o){o=o||{};const U=OUT[c.id]||{torso:[5,5,5.4,5.2]},bulk=U.bulk||1,thin=U.thin||1;
 const ls=c.ls||1,hip=[P[0]*BS,P[1]*ls*BS],tl=(c.tl||13)*BS,sh=[hip[0]+Math.sin(P[2])*tl,hip[1]+Math.cos(P[2])*tl];
 const th=(c.th||11)*BS,sn=(c.sn||10)*BS,ua=8*BS,fa=8*BS,sway=o.sway||0;
 const bl=ik([hip[0]-1.5,hip[1]],[P[3]*BS,P[4]*BS+2],th,sn,1),fl=ik([hip[0]+1.5,hip[1]],[P[5]*BS,P[6]*BS+2],th,sn,1);
 const BRT=[sh[0]-1,sh[1]-2],FRT=[sh[0]+1,sh[1]-2];
 const ba=ik(BRT,[sh[0]+P[7]*BS,sh[1]+P[8]*BS],ua,fa,-1),fr=ik(FRT,[sh[0]+P[9]*BS,sh[1]+P[10]*BS],ua,fa,-1);
 const hI=o.head||c.head,hw2=hI.width,hh2=hI.height,nk=[sh[0]+1+P[11]*BS,sh[1]+2+P[12]*BS];
 const hx0=Math.round(nk[0]-hw2/2),hy0=Math.round(-nk[1]-hh2+1),htop=-hy0,hd=[nk[0],nk[1]+hh2/2-1];
 const ax=Math.cos(P[2]),ay=-Math.sin(P[2]),tp=k=>lerp2(hip,sh,k),at=(k,d)=>{const q=tp(k);return[q[0]+ax*d,q[1]+ay*d]};
 const ph=((G.t*6)|0)%4,key=c.id+'|'+P.map(v=>Math.round(v*4)).join(',')+'|'+(o.head?1:0)+'|'+Math.round(sway*3)+'|'+ph;
 let spr=SPCACHE.get(key);
 if(!spr){
  const sk=c.skin,arm=c.arm,fore=c.fore,top=c.top,pant=c.pant,shin=c.shin,shoe=c.shoe;
  const ar=(GFX?2.85:2.2)*bulk*thin,lr=(GFX?3.45:2.8)*bulk*thin,fz=GFX?1.2:1;
  const fist=(e,dir,col)=>{if(U.mech){vpoly([[e[0]-2.5*fz,e[1]-2.5*fz],[e[0]+3.5*fz,e[1]-2.5*fz],[e[0]+3.5*fz,e[1]+2.5*fz],[e[0]-2.5*fz,e[1]+2.5*fz]],'#3a4050');vcirc(e[0]+.5,e[1]+.5,1.6*fz,'#5a6272');if(GFX)vcirc(e[0]+1.2,e[1]+1.2,.9,'#9aa2b0');return}
   if(U.dog){vcirc(e[0]+.5,e[1],2.6*fz,'#e0c8a8');vcirc(e[0]+1,e[1]+.5,2*fz,'#fff0d8');return}
   vcirc(e[0]+.5,e[1],2.7*fz,dk(col));vcirc(e[0]+1,e[1]+.6,2.05*fz,col);vcirc(e[0]+1.6,e[1]+1.3,.9*fz,lt(col))};
  const footF=(k0,col)=>{const e=k0[1];if(U.dog){vcap([e[0]-2,e[1]-1],[e[0]+3.5*fz,e[1]-1.2],2.4*fz,2*fz,'#c87830');vcap([e[0]-1.5,e[1]-.5],[e[0]+3.5*fz,e[1]-.7],1.7*fz,1.4*fz,'#fff0d8');return}
   const h_=(U.boots?2.8:2.3)*(GFX?1.35:1),fx=GFX?1.5:0;vpoly([[e[0]-3.5-fx*.4,e[1]-3],[e[0]+5.5+fx,e[1]-3],[e[0]+6+fx,e[1]-1.2],[e[0]+3+fx*.6,e[1]+h_],[e[0]-3-fx*.4,e[1]+h_]],dk(col));
   vpoly([[e[0]-2.8-fx*.4,e[1]-2.2],[e[0]+5+fx,e[1]-2.2],[e[0]+5.2+fx,e[1]-1],[e[0]+2.6+fx*.6,e[1]+h_-.8],[e[0]-2.6-fx*.4,e[1]+h_-.8]],col);
   if(GFX)vpoly([[e[0]+1.5,e[1]-.6],[e[0]+4.6+fx,e[1]-.9],[e[0]+2.8+fx*.6,e[1]+h_-1.2],[e[0]+1,e[1]+h_-1.2]],lt(col));
   vpoly([[e[0]-3.5-fx*.4,e[1]-3],[e[0]+5.5+fx,e[1]-3],[e[0]+5.5+fx,e[1]-2.2],[e[0]-3.5-fx*.4,e[1]-2.2]],U.boots?'#2a1a10':'#c8c8d0')};
  const armDraw=(rt,el,wr,c1,c2,back)=>{const d_=back?dk:x=>x;
   if(U.puffer){vlimb(rt,el,ar*1.5,ar*1.25,d_('#c8d0dc'));vlimb(el,wr,ar*.8,ar*.7,d_('#5a6272'));vcirc(el[0],el[1],ar*.9,d_('#3a4050'));vcirc(el[0]+.4,el[1]+.4,ar*.5,d_('#8a92a0'))}
   else if(U.dog){vlimb(rt,el,ar*1.2,ar,d_('#e89040'));vlimb(el,wr,ar*.95,ar*.8,d_('#e89040'));vcap(lerp2(el,wr,.2),lerp2(el,wr,.95),ar*.4,ar*.35,d_('#fff0d8'))}
   else{vlimb(rt,el,ar*1.1,ar*.95,d_(c1));vlimb(el,wr,ar*.9,ar*.7,d_(c2));
    if(U.sleeve){vlimb(rt,lerp2(rt,el,U.sleeve+.1),ar*1.25,ar*1.1,d_(top),0)}
    if(U.cuffs)vcap(lerp2(el,wr,.78),lerp2(el,wr,.9),ar*.95,ar*.95,d_(dk(c2)))}
   fist(wr,1,d_(U.puffer?'#d0d8e4':sk))};
  const legDraw=(k0,root,back)=>{const d_=back?dk:x=>x,kn=k0[0],an=k0[1];
   if(U.dog){vlimb(root,kn,lr*1.25,lr*.95,d_('#e89040'));vlimb(kn,an,lr*.85,lr*.6,d_('#e89040'));vcirc(kn[0]-1,kn[1],1.2,d_('#f8b070'))}
   else{vlimb(root,kn,lr*1.05,lr*.85,d_(pant));vlimb(kn,an,lr*.8,lr*.62,d_(shin));
    if(U.shorts){vlimb(root,lerp2(root,kn,.82),lr*1.14,lr*1.04,d_(pant));vcap(lerp2(root,kn,.15),lerp2(root,kn,.8),.55,.55,d_('#f4f4f4'))}
    if(U.socks)vcap(lerp2(kn,an,.82),lerp2(kn,an,.98),lr*.68,lr*.62,d_(U.socks));
    if(U.mech){vcirc(kn[0]+.5,kn[1],2.4,d_('#3a4050'));vcirc(kn[0]+.8,kn[1]+.3,1.4,d_('#8a92a0'))}
    if(U.boots)vcap(lerp2(kn,an,.82),lerp2(kn,an,.95),lr*.72,lr*.72,d_('#2a2a34'))}
   footF(k0,d_(shoe))};
  // ---- layer 0: behind the body (hair, cape, tail, back arm, back leg)
  SPLX.forEach(x=>{x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,SPW,SPH);x.setTransform(1,0,0,-1,SPX,SPY)});
  VX=SPLX[0];
  if(U.cape){const cx=hip[0]-10-sway*6,cy=hip[1]-8+Math.sin(ph)*1;vpoly([[sh[0]-3,sh[1]],[sh[0]+1,sh[1]-1],[cx+2,cy],[cx-4,cy-2]],'#a01828');vpoly([[sh[0]-2,sh[1]-1],[sh[0],sh[1]-2],[cx+1,cy+1],[cx-3,cy]],'#d02030')}
  if(U.dog){const wg=[0,1,0,-1][ph],tx=hip[0]-8,ty=hip[1]+3+wg;vcirc(tx,ty,5,'#c87830');vcirc(tx+.6,ty+.6,4,'#e89040');vcirc(tx+1,ty+.4,2.2,'#fff0d8');vcirc(tx+1.4,ty+.6,1,'#e89040')}
  if(U.hair){const top_=htop-7,len=U.hairLen,sw_=-sway*3+[0,.6,0,-.6][ph],x0=hx0+(GFX?3.5:5),x1=sh[0]-(GFX?8.5:4)+sw_,y1=sh[1]-len-(GFX?2:0),L=[],R=[];
   for(let i=0;i<=8;i++){const k=i/8,cx=x0+(x1-x0)*k+Math.sin(k*4.5+ph*.5)*1.1,cy=top_+(y1-top_)*k,w=GFX?5.2*(1-k*.42):4.6*(1-k*.55);L.push([cx-w,cy]);R.push([cx+w*.7,cy])}
   const pts=L.concat(R.reverse());vpoly(pts,dk(U.hair));vpoly(pts.map(([x,y])=>[x+.7,y+.3]),U.hair);vcap([x0+1,top_-1],[x1+.5,y1+2],.6,.5,lt(U.hair));
   if(U.hairEnd){const e=L[8],f_=L[6];vpoly([[e[0],e[1]],[e[0]+4,e[1]],[f_[0]+5,f_[1]],[f_[0]+1,f_[1]]],U.hairEnd)}}
  if(U.mech){for(let i=0;i<6;i++){const sx=hx0+3+i*1.7,ex=sh[0]-9+i*2-sway*4,ey=sh[1]-12-(i%3)*3;vcap([sx,htop-6],[ex,ey],1,.9,i%2?'#1e1618':'#2e2224')}}
  armDraw(BRT,ba[0],ba[1],c.arm,c.fore,1);legDraw(bl,[hip[0]-1.5,hip[1]],1);
  // ---- layer 1: body (front leg, torso, neck, collar bits)
  VX=SPLX[1];
  legDraw(fl,[hip[0]+1.5,hip[1]],0);
  if(U.hood){const q=at(.96,-3.6);vcirc(q[0],q[1]+1,4.6,dk(top));vcirc(q[0]+.6,q[1]+1.4,3.4,top)}
  {const w=GFX?U.torso.map(v=>v*1.14):U.torso,pts=(e,cut)=>{const W_=t=>t<.35?w[0]+(w[1]-w[0])*t/.35:t<.7?w[1]+(w[2]-w[1])*(t-.35)/.35:w[2]+(w[3]-w[2])*(t-.7)/.3,L=[],R=[];
    for(let i=0;i<=8;i++){const t=i/8,ww=(W_(t)+e)*(t>.86?1-(t-.86)*1.6:1);L.push(at(t,-ww));R.push(at(t,ww*(cut||1)))}return L.concat(R.reverse())};
   vpoly(pts(.3),dk(top));vpoly(pts(0).map(([x,y])=>[x+.8,y+.3]),top);vpoly(pts(-2.4,.95).map(([x,y])=>[x+2.2,y+.6]),lt(top));vpoly(pts(-2.4,.95).map(([x,y])=>[x+1.6,y+.3]),top);
   vcap(at(.02,-w[0]+.5),at(.02,w[0]-.5),1.6,1.6,U.dog?'#e89040':pant)}
  if(U.dog){vpoly([at(.08,1),at(.08,U.torso[0]-.5),at(.8,U.torso[2]-.5),at(.95,1.5),at(.6,.8)],'#fff0d8')}
  if(U.puffer){for(const t of[.18,.36,.54,.72]){vcap(at(t,-U.torso[1]+.8),at(t,U.torso[1]-.8),.55,.55,'#8a92a0')}vcap(at(.04,.6),at(.97,.6),.5,.5,'#3a4050');vcirc(at(.99,.2)[0],at(.99,.2)[1],2.6,'#1c1c24')}
  if(U.suit){vpoly([at(1,-1.5),at(1,2.5),at(.62,.8)],'#f4f4f0');vpoly([at(.95,.4),at(.95,1.4),at(U.tieLen||.45,1.2),at((U.tieLen||.45)-.05,.6)],U.tie||'#3a6ad0')}
  if(c.id==='marcus'){for(const d_ of[1.2,3]){vcap(at(.95,d_),at(.72,d_),.45,.45,'#f4f4f4')}vpoly([at(.35,-1),at(.35,5),at(.12,5.6),at(.12,-1.4)],dk(top));{const q=at(.7,2.4);vcirc(q[0],q[1]-.6,1.5,'#ffffff');vcirc(q[0],q[1]+1,.8,'#ffffff')}}
  if(U.cyb){const q=at(.56,2);vcirc(q[0],q[1],3,'#141018');vcirc(q[0],q[1],2.3,'#40e880');vcirc(q[0]+.3,q[1]+.3,1.1,'#e0ffe8');vcap(at(.3,-3),at(.3,4),.5,.5,'#8a92a0');vcap(at(.84,-3.4),at(.84,-1),.6,.6,'#8a92a0')}
  if(c.id==='will'){vcap(at(.96,-1),at(.96,2.5),1,1,sk);const g_=at(.62,1.8);vcirc(g_[0],g_[1],1,'#f8d030')}
  if(c.id==='erin')vcap(at(.06,-U.torso[0]+.4),at(.06,U.torso[0]-.4),1.1,1.1,dk(top));
  vcap([sh[0]+1,sh[1]-1],[nk[0],nk[1]+1],1.7,1.5,U.mech?'#5a6272':U.dog?'#e89040':sk);
  if(U.dog){vcap([sh[0]-3.5,sh[1]+1],[sh[0]+4.5,sh[1]+1.3],1.3,1.3,'#c02028');vcirc(sh[0]+2.5,sh[1]-.8,1,'#d8b040')}
  if(U.puffer){const a2=at(.86,0);for(let i=0;i<5;i++)vcirc(a2[0]-3+i*1.6,a2[1]+1-Math.abs(i-2)*1.4,.8,'#e8ecf4');const p_=at(.58,.5);vcirc(p_[0],p_[1],2.2,'#dcdce8');vcirc(p_[0]+1.6,p_[1]+.4,1.6,'#dcdce8')}
  // ---- layer 2: the front arm
  VX=SPLX[2];armDraw(FRT,fr[0],fr[1],c.arm,c.fore,0);
  [0,1,2].forEach(spBake);
  spr=spMk();const sx=spr.getContext('2d');SPL.forEach(L=>sx.drawImage(L,0,0));
  if(SPCACHE.size>400)SPCACHE.delete(SPCACHE.keys().next().value);SPCACHE.set(key,spr)}
 // the finished sprite, then the head on its neck, then props
 g.drawImage(spr,-SPX,-SPY);
 const bigH=MU().big&&(G.scr==='fight'||G.scr==='pause');
 if(bigH){const s_=1.7;g.drawImage(hI,Math.round(nk[0]-hw2*s_/2),Math.round(-nk[1]-hh2*s_+2),Math.round(hw2*s_),Math.round(hh2*s_))}else g.drawImage(hI,hx0,hy0);
 if(c.id==='chrome'&&!bigH){B(K,hx0-2,hd[1]-3,4,7);B('#3a4050',hx0-1,hd[1]-2,2,5);B(K,hx0+hw2-2,hd[1]-3,4,7);B('#3a4050',hx0+hw2-1,hd[1]-2,2,5)}
 if(o.daze){for(let i=0;i<3;i++){const a=G.t*6+i*2.1;B('#f8e060',hd[0]+Math.cos(a)*8,htop+2+Math.sin(a)*2,2,2)}}
 if(o.zz){text('Z',Math.round(hd[0]+6),Math.round(-htop-12-((G.t*8)%8)),1,'#b0d0ff')}
 const hx=fr[1][0],hy=fr[1][1];
 if(o.prop==='phone'){B(K,hx+1,hy-2,5,8);B('#30303c',hx+2,hy-1,3,6);B('#80d0ff',hx+2,hy+1,3,3)}
 if(o.prop==='cup'){B(K,hx,hy,7,9);B('#f4f4f4',hx+1,hy+1,5,7);B('#8a5a34',hx+1,hy+2,5,3);B('#e0e0e0',hx+1,hy+7,5,1)}
 if(o.prop==='thumb'){B(K,hx,hy-6,4,6);B(c.skin,hx+1,hy-5,2,5)}
 if(o.prop==='point'){B(K,hx+1,hy-1,6,3);B(c.skin,hx+2,hy,4,1)}
 if(o.prop==='bottle'){B(K,hx,hy+1,5,8);B('#f4f4f4',hx+1,hy+2,3,5);B('#f0a0b8',hx+1,hy+7,3,1)}
 if(o.prop==='wrench'){seg(hx,hy,hx+11,hy+9,4,K);seg(hx,hy,hx+11,hy+9,2,'#a8b0bc');B(K,hx+8,hy+6,8,8);B('#c8d0dc',hx+9,hy+7,6,6);B(K,hx+12,hy+9,4,2)}
 if(o.prop==='plunger'){seg(hx,hy-2,hx+1,hy+15,4,K);seg(hx,hy-2,hx+1,hy+15,2,'#c89050');B(K,hx-3,hy+14,10,7);B('#c02838',hx-2,hy+15,8,5);B('#f05868',hx-2,hy+18,8,1)}
 if(o.prop==='bag'){seg(hx,hy,hx+6,hy-6,2,K);B(K,hx+1,hy-16,14,11);B('#7ab8d8',hx+2,hy-15,12,9);B('#f8f8f8',hx+5,hy-11,6,2);B('#f8d030',hx+7,hy-14,2,2)}
 if(o.prop==='diagram'){B(K,hx-1,hy-1,14,17);B('#f4f2e8',hx,hy,12,15);disc(Math.round(hx+6),Math.round(-hy-5),4,K);disc(Math.round(hx+6),Math.round(-hy-5),3,'#2a2a2a');B(K,hx+5,hy+10,2,3);B('#f8a030',hx+6,hy+13,1,1);B('#e02020',hx+1,hy+8,10,2)}
 if(o.prop==='pen'){B(K,hx,hy,4,9);B('#d0d0e0',hx+1,hy+1,2,6);B('#60d8ff',hx+1,hy+7,2,1)}
 return{hand:[hx,hy],head:hd,sh,foot:fl[1],top:htop};}

/* ---------- fighters ---------- */
function mkF(ci,x,face,cpu){return{c:CH[ci],ci,x,y:0,vx:0,vy:0,face,cpu,hp:100,hpG:100,meter:0,st:'idle',t:0,at:0,mv:null,did:0,con:0,stun:0,cd:0,inv:0,combo:0,comboT:0,jug:0,bnc:0,rot:0,pose:PS.st.slice(),ph:R(0,6),
 I:{l:0,r:0,u:0,d:0,pa:0,pb:0,px:0,py:0,ps:0},fl:0,scl:1,wantFin:0,bk:0,cr:0,low:0,la:-9,lb:-9,buf:0,wins:0,sqz:1,dash:0,say:null,o:null,ait:0,aiB:0,aiR:0,aiLow:0,fired:0,did2:0,daze:0,fp:'dz1',fr:0,noc:0,hide:0,tr:[],wb:0,rank:null};}
function set(f,st){f.st=st;f.t=0;if(st!=='atk'&&st!=='jump')f.mv=null;f.dash=0;}
function atk(f,k){const m=f.c.mv[k];f.at=0;f.did=0;f.con=0;f.buf=0;f.vx=m.lg?f.face*m.lg:k==='p3'?f.face*90:k==='k'?f.face*40:0;set(f,'atk');f.mv=m;if(m.say)f.say=[m.say,.9];sfx.wh();}
const fb=(f,x,x2,y,y2)=>{const a=f.x+f.face*x,b=f.x+f.face*x2;return{x0:Math.min(a,b),x1:Math.max(a,b),y0:f.y+y,y1:f.y+y2}};
function strikeMv(f){const m=f.mv;if(!m||f.did)return;if(f.at>=m.su&&f.at<m.su+m.ac){const res=tryHit(f,f.o,fb(f,m.x*BS,m.x2*BS*(f.c.rch||1),m.y*BS,m.y2*BS),m,f.face);if(res){f.did=1;f.con=1}}}
function spark(x,y,c,n=6,sp=90){for(let i=0;i<n;i++){const a=R(0,2*PI),s=R(sp*.3,sp);G.pt.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,ay:-200,t:R(.15,.35),c,s:R(1,3)|0})}}
function dust(x,n){for(let i=0;i<n;i++)G.pt.push({x:x+R(-9,9),y:1,vx:R(-55,55),vy:R(8,34),ay:-70,t:R(.18,.34),c:i%2?'#d8d0c0':'#b8b0a0',s:2})}
function word(s,x,y,c){G.pt.push({x,y,vx:R(-10,10),vy:36,ay:0,t:.7,c,s:0,txt:s})}
function tryHit(a,v,b,m,dir){
 /* FABLE: IRON DOME is a counter. While the dome is up (0.1 to 0.56 s of the cast) anything blockable that touches King Bibi is
    intercepted: no damage, meter for him, and an attacker within reach is hit back for 8 and launched. Whiff it and he is open. */
 if(v.st==='cast'&&v.spc&&v.spc.dome&&v.t>=.1&&v.t<.56&&!m.unb&&!(b.x1<v.x-18||b.x0>v.x+18||b.y1<v.y||b.y0>v.y+62)){
  const cx=v.x-dir*16,cy=v.y+34;v.meter=Math.min(100,v.meter+10);G.hs=.15;G.hv=a;G.shake=Math.max(G.shake,.14);G.sa=2;G.flash=Math.max(G.flash,.035);
  G.pt.push({x:cx,y:cy,vx:0,vy:0,ay:0,t:.2,t0:.2,c:'#fff',s:0,burst:1,big:1,rot:R(0,PI/4),cool:1});spark(cx,cy,'#80e8ff',12,140);word('INTERCEPTED!',v.x,v.y+88,'#80e8ff');snd(1320,.05,1980,'square',.06);snd(1980,.14,2640,'triangle',.07);
  if(!v.cpu&&G.tq)G.tq.parry++;
  if(Math.abs(a.x-v.x)<92&&!m.sup&&a.inv<=0&&a.st!=='ko'&&a.st!=='down'){a.mv=null;a.dash=0;const c0=v.combo;tryHit(v,a,{x0:a.x-9,x1:a.x+9,y0:a.y,y1:a.y+55},{d:8,la:[170,210],l:'m',big:1,unb:1},v.x<=a.x?1:-1);v.combo=c0}
  return 3}
 if(v.inv>0||v.st==='down'||v.st==='getup'||v.st==='ko'||v.st==='thrown'||v.st==='win'||v.st==='fin'||(v.st==='super'&&v.t<.5))return 0;
 if(v.st==='knock'&&v.jug>=3)return 0;
 const low=v.st==='crouch'||(v.st==='blk'&&v.cr)||(v.st==='atk'&&v.mv&&v.mv.cr),hh=low?38:55;
 if(b.x1<v.x-8||b.x0>v.x+8||b.y1<v.y||b.y0>v.y+hh)return 0;
 const cx=cl((Math.max(b.x0,v.x-8)+Math.min(b.x1,v.x+8))/2,v.x-8,v.x+8),cy=cl((Math.max(b.y0,v.y)+Math.min(b.y1,v.y+hh))/2,v.y+2,v.y+hh);
 const canB=!m.unb&&v.y===0&&(v.st==='blk'||((v.st==='idle'||v.st==='walk'||v.st==='crouch')&&(v.bk||v.dummy===2)));
 /* FABLE: PARRY. Tap back just before a hit lands (within .13 s) and any blockable hit is turned away: no chip, no pushback,
    meter for you, and an attacker who is up close is left wide open. The cpu only does it now and then (aiPar). */
 if(canB&&v.dummy!==2&&G.t-(v.tbk||-9)<.13&&(!v.cpu||v.aiPar)){v.tbk=-9;v.aiPar=0;v.vx=0;v.mv=null;set(v,v.cr?'crouch':'idle');v.inv=Math.max(v.inv,.14);v.meter=Math.min(100,v.meter+12);
  const near=Math.abs(a.x-v.x)<78&&!m.sup&&(a.st==='atk'||a.st==='jump'||a.st==='cast');
  if(near){a.mv=null;a.vx=-dir*70;if(a.y>0){a.vy=210}else{a.stun=.44;a.low=0;a.daze=0;set(a,'hit')}}
  G.hs=.15;G.hv=near?a:v;G.shake=Math.max(G.shake,.1);G.sa=1.5;G.flash=Math.max(G.flash,.035);{const px=v.x-dir*15;G.pt.push({x:px,y:cy,vx:0,vy:0,ay:0,t:.2,t0:.2,c:'#fff',s:0,burst:1,rot:R(0,PI/4),cool:1});spark(px,cy,'#80e8ff',10,130);spark(px,cy,'#ffffff',5,80)}
  word('PARRY!',v.x,v.y+84,'#80e8ff');snd(1320,.05,1980,'square',.06);snd(1980,.14,2640,'triangle',.07);noise(.04,.25,5000,'highpass');if(!v.cpu&&G.tq)G.tq.parry++;return 3}
 if(canB&&(v.cr?m.l!=='o':m.l!=='l')){v.stun=.2+(m.big?.08:0);v.vx=dir*Math.min(150,Math.abs(m.kb||80)+50);set(v,'blk');v.hp=Math.max(1,v.hp-(m.chip||0));
  a.meter=Math.min(100,a.meter+2);v.meter=Math.min(100,v.meter+3);spark(cx,cy,'#a0d0ff',5,70);sfx.blk();G.hs=.06;G.hv=v;G.shake=Math.max(G.shake,.06);G.sa=1;if(v.x<=14||v.x>=SW-14)a.vx-=dir*70;return 2}
 const inC=v.st==='hit'||v.st==='knock';a.combo=inC?a.combo+1:1;a.comboT=1.3;if(RK[a.combo]){a.rank=[RK[a.combo],1.1];snd(660+a.combo*60,.07,990+a.combo*60,'square',.05)}
 if(!a.cpu&&G.tq){const q=G.tq;q.combo=Math.max(q.combo,a.combo);if(m.thr)q.thr++;if(a.st==='jump'&&m.air)q.air++;if(!(m.key==='k'||m.key==='sw'||m.key==='jk'))q.other=1}if(a.combo===4&&BARK[a.c.id]&&Math.random()<.75)a.say=[pick(BARK[a.c.id].combo),1.1];
 const d=m.d*(a.c.pow||1)*Math.max(.35,Math.pow(.86,a.combo-1))*(G.phase==='go'?1:0)*(MU().glass?2:1)*(lastL(a)?1.15:1);
 v.hp=Math.max(G.mode==='train'?1:0,v.hp-d);if(v.hp<30&&v.hp>0&&!v.lowSaid&&BARK[v.c.id]){v.lowSaid=1;v.say=[pick(BARK[v.c.id].hurt),1.3]}a.cdmg=(a.combo>1?(a.cdmg||0):0)+d;if(!m.sup)a.meter=Math.min(100,a.meter+m.d*1.25);v.meter=Math.min(100,v.meter+m.d*.8);
 const was=v.st;v.mv=null;v.dash=0;v.daze=m.daze?m.hs:0;
 if(v.hp<=0||m.la||v.y>0||was==='knock'||was==='dizzy'){const la=m.la||[80,170],k=v.hp<=0?1.3:1;v.vx=dir*la[0]*k*1.12;v.vy=la[1]*1.3*LV*(v.hp<=0?1.1:1);v.y=Math.max(v.y,1);v.bnc=0;if(was!=='knock')v.wb=0;v.jug=(was==='knock'?v.jug:0)+1;set(v,'knock')}
 else{v.stun=m.hs;v.vx=dir*m.kb*1.35;v.low=m.y2<26?1:0;set(v,'hit')}
 const big=m.big||m.la||m.sup;G.hs=m.sup?.1:big?.13:.075;G.hv=v;v.fl=big?.07:.035;G.sa=big?3:1.5;if(big)G.zp=Math.max(G.zp,.07);G.shake=Math.max(G.shake,big?.24:.12);G.pt.push({x:cx,y:cy,vx:0,vy:0,ay:0,t:.17,t0:.17,c:'#ffffff',s:0,burst:1,big:!!big,rot:R(0,PI/4)});spark(cx,cy,'#fff8c0',big?8:4,big?130:90);spark(cx,cy,'#f8a030',3,60);sfx.hit(big);
 if(v.x<=14||v.x>=SW-14)a.vx-=dir*60;return 1;}

/* specials: fired once at t=.2 of the cast */
const ent=o=>{const e=Object.assign({x:0,y:0,vx:0,vy:0,ay:0,w:4,h:8,hits:1,re:0,life:3,t:0,delay:0},o);G.fx.push(e);return e};
const edge=f=>f.face>0?cam+W/2-W/(2*Z)-40:cam+W/2+W/(2*Z)+40;
const selfie=f=>{G.flash=.16;snd(1800,.03,0,'square',.05);noise(.04,.3,3000);tryHit(f,f.o,fb(f,8,118,4,52),{d:3,hs:.95,kb:10,l:'m',daze:1},f.face)};
/* S1 = Select, S2 = Forward + Select.  fire: when fn runs.  melee: a hitbox [x,x2,y,y2] open from fire to t1.  dash: the fighter becomes the attack. */
const S1={
 will:{T:.56,fire:.2,prop:'phone',fn:selfie},
 erin:{T:1.0,fire:0,seq:[{t:0,vx:70,pose:'castw'},{t:.1,vx:20,pose:'whip',w:'h',box:[8,62,16,42],mv:{d:5,hs:.4,kb:30,l:'m',chip:1}},{t:.24,vx:-110,pose:'ewb'},{t:.34,vx:0,pose:'ew1',w:'r'},
  {t:.44,vx:150,pose:'ew2',w:'o',box:[10,58,0,52],mv:{d:6,hs:.42,kb:30,l:'o',chip:1}},{t:.6,vx:60,pose:'ewl',w:'l',box:[8,58,0,14],mv:{d:5,hs:.42,kb:40,l:'l',chip:1}},
  {t:.76,vx:40,pose:'whip',w:'f',box:[8,68,12,46],mv:{d:10,la:[170,230],l:'m',big:1,chip:1},say:'SNAP!'}],fn:()=>{}},
 louie:{T:.72,fire:0,head2:1,dash:{v:330,t0:.1,t1:.5,y:0,box:[-6,18,4,40],mv:{d:10,la:[150,190],l:'m',big:1,chip:1}},fn:f=>{f.say=['ZOOM ZOOM ZOOM',.7];snd(520,.08,300,'sawtooth',.08)}},
 chrome:{T:.6,fire:.16,pose:'beam',fn:f=>{for(let i=0;i<3;i++)ent({k:'bullet',o:f,x:f.x+f.face*24,y:36-(i%2)*3,vx:f.face*380,delay:i*.09,w:5,h:5,dir:f.face,mv:{d:3.6,hs:.26,kb:45,l:'m',chip:.5}})}},
 bibi:{T:.62,fire:.24,prop:'diagram',fn:f=>{f.say=['A CLEAR RED LINE.',1];ent({k:'redline',o:f,x:f.x+f.face*16,x0:f.x+f.face*16,y:0,vx:f.face*330,w:6,h:8,life:.5,pass:1,dir:f.face,mv:{d:9,hs:.4,kb:150,l:'l',chip:1}});snd(900,.25,300,'sawtooth',.05)}},
 kiss:{T:.5,fire:.2,fn:f=>{ent({k:'heart',o:f,x:f.x+f.face*20,y:34,vx:f.face*118,w:5,h:9,mv:{d:7,hs:.75,kb:20,l:'m',daze:1,chip:1}});f.say=['CAN I GET A KISS?',1.3];snd(880,.12,1320,'sine',.08)}},
 marcus:{T:.62,fire:.24,prop:'pen',fn:f=>{f.say=['BRO.',.7];ent({k:'cloud',o:f,x:f.x+f.face*28,y:18,vx:f.face*58,w:15,h:30,life:2.2,pass:1,dir:f.face,mv:{d:4,hs:1.05,kb:10,l:'m',daze:1,chip:1}});noise(.5,.2,900,'lowpass')}},
 mama:{T:.5,fire:.2,prop:'bottle',fn:f=>{const d=Math.abs(f.o.x-f.x);ent({k:'bottle',o:f,x:f.x+f.face*12,y:44,vx:f.face*cl(d/.8,60,240),vy:190,ay:-532,w:5,h:8,mv:{d:8,hs:.34,kb:70,l:'m',chip:1}});sfx.wh()}}};
const S2={
 will:{T:.95,fire:.4,pose:'beam',charge:1,fn:f=>{ent({k:'laser',o:f,x:f.x+f.face*132,y:30,w:112,h:12,hits:3,rehit:.11,pass:1,life:.42,dir:f.face,mv:{d:4.6,hs:.32,kb:130,l:'m',chip:1}});f.say=['MAZEL TOV!',1.1];G.shake=.2;snd(180,.45,900,'sawtooth',.09);snd(1400,.4,500,'square',.04)}},
 erin:{T:1.2,fire:.02,hide:1,fn:f=>{ent({k:'bush',o:f,x:f.x,y:0,life:.95});noise(.2,.2,2500,'bandpass')}},
 louie:{T:.9,fire:0,head2:1,pose:'pln',dash:{v:300,t0:.16,t1:.62,y:30,box:[-8,24,-8,16],mv:{d:11,la:[140,200],l:'o',big:1,chip:1}},fn:f=>{f.say=['TURBO ZOOM',.8];snd(200,.5,620,'sawtooth',.07)}},
 chrome:{T:.58,fire:.18,pose:'whip',chain:1,melee:{t1:.36,box:[8,70,18,40],mv:{d:5,hs:1,kb:10,l:'m',daze:1,chip:1}},fn:f=>{snd(900,.2,200,'sawtooth',.06);noise(.15,.25,4000)}},
 bibi:{T:.7,fire:.1,dome:1,fn:f=>{f.say=['IRON DOME.',.6];ent({k:'dome',o:f,x:f.x,y:0,life:.5});snd(300,.5,1200,'sine',.07);noise(.3,.2,3000,'bandpass')}},
 kiss:{T:.62,fire:0,dash:{v:250,t0:.12,t1:.42,y:0,box:[-4,18,4,46],mv:{d:7,hs:.9,kb:10,l:'m',daze:1,unb:1}},fn:f=>{f.say=['CAN I GET A KISS?',.9]}},
 marcus:{T:.85,fire:.06,gamble:1,fn:f=>{f.say=['DOUBLE OR NOTHING!',.8];snd(1200,.05)}},
 mama:{T:.6,fire:.2,voice:1,melee:{t1:.42,box:[6,76,6,50],mv:{d:5,hs:.85,kb:60,l:'m',daze:1,chip:1}},fn:f=>{f.say=['EXCUSE ME?!',.9];snd(700,.3,350,'square',.08)}}};
function startSpecial(f,n){f.sq=0;f.sh=0;f.gres=undefined;f.cd=f.c.cdT;f.sn=n===2?2:1;f.spc=(f.sn===2?S2:S1)[f.c.id];set(f,'cast');f.fired=0;f.did2=0;f.leash=0;f.vx=0;}
function castUpd(f,dt){const s=f.spc;
 if(s.seq){const o=f.o;f.vx*=Math.exp(-6*dt);s.seq.forEach((q,i)=>{if(f.t>=q.t&&!(f.sq>>i&1)){f.sq|=1<<i;if(q.vx!==undefined)f.vx=f.face*q.vx;if(q.say)f.say=[q.say,.6];if(q.box)noise(.05,.3,4000,'highpass')}
  if(q.box&&f.t>=q.t&&f.t<q.t+.1&&!(f.sh>>i&1)&&tryHit(f,o,fb(f,q.box[0],q.box[1],q.box[2],q.box[3]),q.mv,f.face)){f.sh|=1<<i;snd(2200,.03,0,'square',.05)}})}
 if(s.hide){const o=f.o;f.vx=0;
  if(f.t>=.22&&f.t<.82&&!f.hide){f.hide=1;f.inv=Math.max(f.inv,.7);snd(500,.15,250,'triangle',.06)}
  if(f.t>=.82&&f.hide){f.hide=0;f.x=cl(o.x-o.face*24,12,SW-12);f.face=o.x>=f.x?1:-1;f.y=0;f.say=['FOUND YOU!',.8];snd(880,.08);G.later.push([.08,()=>snd(1320,.12)]);spark(f.x,30,'#fff8c0',8,90)}
  if(f.t>=.86&&f.t<1&&!f.did2&&tryHit(f,o,fb(f,-2,28,8,48),{d:11,la:[150,220],l:'m',big:1,unb:1},f.face))f.did2=1}
 if(s.gamble&&f.t>=.45){if(f.gres===undefined){f.gres=Math.random()<.55;
   if(!f.gres){f.say=['...NOTHING, BRO',1.1];snd(220,.35,90,'sawtooth',.06);f.vx=-f.face*70;f.vy=285;f.y=1;f.bnc=1;f.jug=1;set(f,'knock');return}
   f.say=['DOUBLE!',.7];snd(880,.08);snd(1320,.18,0,'square',.04)}
  if(f.t<.74){f.dash=1;f.vx=f.face*340;if(!f.did2&&tryHit(f,f.o,fb(f,-4,22,8,50),{d:16,la:[220,230],l:'m',big:1,chip:2},f.face)){f.did2=1;f.vx=0;f.t=.74}}else{f.dash=0;f.vx*=.7}}
 if(s.dash){const d=s.dash;if(f.t>=d.t0&&f.t<d.t1){f.dash=1;f.vx=f.face*d.v;f.y+=(d.y-f.y)*Math.min(1,dt*18);if(((G.t*40)|0)%2)G.pt.push({x:f.x-f.face*12,y:f.y+R(6,30),vx:-f.face*40,vy:0,ay:0,t:.2,c:'#ffffff',s:1,w:8});
   if(!f.did2&&tryHit(f,f.o,fb(f,d.box[0],d.box[1],d.box[2]+(d.y?30:0),d.box[3]+(d.y?30:0)),d.mv,f.face)){f.did2=1;f.vx=0;f.t=d.t1}}
  else{f.dash=0;f.vx*=.7;if(f.t>=d.t1)f.y=Math.max(0,f.y-260*dt)}}
 if(!f.fired&&f.t>=s.fire){f.fired=1;s.fn&&s.fn(f)}
 if(s.melee&&f.fired&&!f.did2&&f.t<s.melee.t1){const b=s.melee.box;if(tryHit(f,f.o,fb(f,b[0],b[1],b[2],b[3]),s.melee.mv,f.face))f.did2=1}
 if(s.leash&&f.leash&&!f.did2&&f.t<.4){const len=Math.min(92,(f.t-.2)*700);if(tryHit(f,f.o,fb(f,8,len,24,40),{d:6,hs:.55,kb:-330,l:'m',chip:1},f.face))f.did2=1}
 if(f.t>=s.T){f.y=0;set(f,'idle')}}
/* supers */
const SUP={
 will:f=>{ent({k:'bike',o:f,x:edge(f),y:0,vx:f.face*310,w:16,h:28,pass:1,life:2.5,dir:f.face,mv:{d:25,la:[210,230],l:'m',sup:1,chip:5}});snd(1200,.1,1600,'sine',.1);G.later.push([.12,()=>snd(1200,.1,1600,'sine',.1)])},
 erin:f=>{for(let i=0;i<6;i++)ent({k:'sprout',o:f,x:edge(f),y:0,vx:f.face*235,delay:i*.15,n:i,w:5,h:13,life:3,dir:f.face,mv:{d:6.5,hs:.3,kb:40,l:'m',sup:1,chip:1}})},
 louie:f=>{ent({k:'judge',o:f,x:f.o.x,y:0,delay:.3,w:14,h:58,hits:4,rehit:.2,pass:1,life:1.25,dir:f.face,mv:{d:6,hs:.3,kb:40,l:'m',sup:1,unb:1}});snd(80,1.2,40,'sawtooth',.08)},
 chrome:f=>{for(let j=0;j<2;j++)ent({k:'jet',o:f,x:edge(f)-f.face*j*50,y:104+j*14,vx:f.face*420,life:2,delay:j*.1});
  for(let i=0;i<6;i++)ent({k:'boom',o:f,x:f.x+f.face*(44+i*36),y:0,delay:.45+i*.11,w:17,h:44,life:.32,pass:1,dir:f.face,mv:{d:9,la:[60,220],l:'m',sup:1,chip:2}});noise(.9,.25,500,'lowpass')},
 bibi:f=>{f.say=['MY COALITION, ASSEMBLE',1.2];for(let i=0;i<5;i++)ent({k:'suit',o:f,x:edge(f),y:0,vx:f.face*250,delay:i*.16,n:i,w:8,h:34,life:3,dir:f.face,mv:{d:5,hs:.3,kb:40,l:'m',sup:1,chip:1}})},
 kiss:f=>{for(let i=0;i<7;i++)ent({k:'heart',o:f,x:f.x+f.face*16,y:20+(i%3)*8,vx:f.face*210,delay:i*.13,w:5,h:9,dir:f.face,mv:{d:5,hs:.3,kb:30,l:'m',sup:1,chip:1}});f.say=['CAN I GET A KISS? x7',1.6]},
 marcus:f=>{f.say=['BRO, I GOT AN IDEA',1.2];for(let i=0;i<6;i++)ent({k:'geyser',o:f,x:f.x+f.face*(34+i*32),y:0,delay:.3+i*.12,w:9,h:60,life:.42,pass:1,dir:f.face,mv:{d:8,la:[50,240],l:'m',sup:1,chip:2}});noise(.9,.25,700,'lowpass')},
 mama:f=>{ent({k:'baby',o:f,x:edge(f),y:0,vx:f.face*135,w:7,h:12,pass:1,life:5,dir:f.face,mv:{d:23,la:[40,250],l:'l',sup:1,chip:4}});f.say=['GO GET EM, BEAN!',1.4]}};
function startSuper(f){const lv1=!!f.c.su1&&f.meter<100;f.lv1=lv1;if(!lv1&&!f.cpu&&G.tq)G.tq.sup++;f.meter=lv1?f.meter-50:0;set(f,'super');f.inv=1;f.fired=0;f.vx=0;f.mv=null;
 if(!lv1&&CINE[f.c.id]){CINE[f.c.id](f);return}
 G.freeze=.6;G.banner=f.c.id==='louie'?null:{s:lv1?f.c.su1:f.c.su,t:1.5,c:f.c};snd(220,.5,880,'sawtooth',.07);snd(330,.5,1320,'square',.04);}
function superUpd(f){if(!f.fired&&f.t>=.08){f.fired=1;(f.lv1?SUP1:SUP)[f.c.id](f)}
 if(f.rideE){if(G.fx.includes(f.rideE))return;f.rideE=null;f.hide=0;f.x=f.rideX;f.inv=.3;set(f,'idle');return}if(f.t>=(f.c.id==='kiss'||f.c.id==='bibi'?1.2:.9))set(f,'idle');}
/* ALT: half-meter supers. BIKE LANE: a lane paints itself, Will rides through it with Louie in the basket. */
const SUP1={will:f=>{f.rideX=f.x;f.hide=1;f.inv=2.2;const e=ent({k:'bike',o:f,x:f.x-f.face*10,y:0,vx:f.face*340,w:16,h:30,pass:1,life:1.7,dir:f.face,mv:{d:14,la:[200,230],l:'m',sup:1,chip:3}});f.rideE=e;
 ent({k:'lane',o:f,x:f.x,x0:f.x-f.face*14,y:0,dir:f.face,life:1.6,bike:e});snd(1200,.1,1600,'sine',.1);G.later.push([.14,()=>snd(1200,.1,1600,'sine',.1)]);f.say=['DING DING',.8]},
 /* YUKON: Mama backs the big white Yukon in (reverse beeper and all) and yells about it */
 mama:f=>{f.rideX=f.x;f.hide=1;f.inv=2.6;const e=ent({k:'yukon',o:f,x:f.x-f.face*96,y:0,vx:f.face*235,w:30,h:36,pass:1,life:2.6,dir:f.face,mv:{d:15,la:[230,220],l:'m',sup:1,chip:3},say:pick(YQ)});f.rideE=e;
  for(let i=0;i<7;i++)G.later.push([i*.26,()=>snd(1040,.09,0,'square',.05)])}};
SUP1.erin=f=>SUP.erin(f);SUP1.chrome=f=>SUP.chrome(f);/* DEREK PULLS UP: Derek drives the Flow Pros truck through whoever is in front of Marcus; beer cans and paraphernalia fall out the back */
SUP1.marcus=f=>{ent({k:'fptruck',o:f,x:edge(f)-f.face*30,y:0,vx:f.face*330,w:32,h:36,pass:1,life:2.6,dir:f.face,mv:{d:15,la:[230,220],l:'m',sup:1,chip:3}});f.say=['DEREK. PULL UP.',1.1];
 snd(330,.18,330,'square',.07);snd(415,.18,415,'square',.06);G.later.push([.24,()=>{snd(330,.3,330,'square',.07);snd(415,.3,415,'square',.06)}]);noise(1,.2,220,'lowpass')};SUP1.bibi=f=>SUP.bibi(f);
const YQ=['I DID NOT SEE YOU!!','WHO PARKS LIKE THAT?!','BACKUP CAMERA SAID FINE','I HAVE PICKUP AT 3!!','MOVE!!! MOVE!!!'];
/* ---------- ALT: HASBARA, Will's full-meter super ----------
   A ZZZ-style cinematic: an S-rank cut-in, Will at the command desk plotting the hasbara, the opponent's mind flips,
   then they hit themselves (4 x 4.5 + 12 = 30, can't be blocked). The clock and everyone else stop for all of it. */
const HSB=[.6,1.85,2.45,3.8],HSBHIT=[2.6,2.88,3.12,3.32,3.62];
const CINE={will:f=>startHasbara(f),mama:f=>startTantrum(f),erin:f=>cnStart(f,'lou'),chrome:f=>cnStart(f,'nuk'),marcus:f=>cnStart(f,'bet'),bibi:f=>cnStart(f,'war')};
function startHasbara(f){const v=f.o;G.cine={kind:'has',t:0,f,v,hits:0,dmg:0,tick:0,last:-9};f.vx=0;v.vx=0;v.vy=0;v.y=0;v.mv=null;v.dash=0;v.daze=0;set(v,'idle');G.banner=null;
 snd(330,.3,660,'square',.06);snd(495,.3,990,'square',.04);noise(.2,.3,2000,'bandpass')}
function cineUpd(dt){if(CN[G.cine.kind])return cnUpd(dt);if(G.cine.kind==='rby')return rbyUpd(dt);const C=G.cine,f=C.f,v=C.v,t0=C.t;C.t+=dt;const t=C.t,cross=a=>t0<a&&t>=a;
 if(cross(.22)){snd(880,.15,1760,'square',.05);noise(.15,.4,600,'lowpass');G.shake=.2;G.sa=3}
 if(cross(HSB[0])){noise(.1,.2,3000);snd(220,.1,110,'sine',.2)}
 if(t>HSB[0]&&t<HSB[1]-.2&&(C.tick-=dt)<=0){C.tick=R(.04,.08);noise(.012,.12,4500,'highpass')}
 if(cross(HSB[1]-.2)){snd(1320,.08);G.later.push([.08,()=>snd(1760,.12,0,'square',.04)])}
 if(cross(HSB[1])){snd(150,.6,600,'sawtooth',.05);snd(300,.6,75,'triangle',.06)}
 while(C.hits<HSBHIT.length&&t>=HSBHIT[C.hits]){hsbHit(C,C.hits===HSBHIT.length-1);C.hits++}
 v.t+=dt;for(let i=G.pt.length-1;i>=0;i--){const q=G.pt[i];q.t-=dt;q.vy+=(q.ay||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0)G.pt.splice(i,1)}
 if(t>=HSB[3]){G.cine=null;f.inv=.3;set(f,'idle')}}
function hsbHit(C,last){const v=C.v,f=C.f,d=last?12:4.5,dir=v.x>=f.x?1:-1;v.hp=Math.max(G.mode==='train'?1:0,v.hp-d);C.dmg+=d;C.last=C.t;
 const cx=v.x+v.face*3,cy=v.y+48;G.pt.push({x:cx,y:cy,vx:0,vy:0,ay:0,t:.2,t0:.2,c:'#fff',s:0,burst:1,big:last,rot:R(0,PI/4)});spark(cx,cy,'#fff8c0',last?10:5,last?140:90);
 G.pt.push({x:cx+R(-6,6),y:cy+16,vx:0,vy:44,ay:0,t:.6,c:last?'#f85040':'#f8e060',s:0,txt:'-'+Math.round(d)});
 sfx.hit(last);G.shake=last?.4:.14;G.sa=last?5:2;v.fl=last?.08:.035;
 if(last){v.vx=dir*170;v.vy=270*LV;v.y=1;v.jug=1;v.bnc=0;set(v,'knock');G.zp=Math.max(G.zp,.1);G.flash=.08;word('SELF OWN!',v.x,v.y+92,'#f8e060')}
 else{set(v,'hit');v.stun=.3;v.daze=.4;v.low=0}}
/* ---------- ALT: RUBY TEMPER TANTRUM, Mama's full-meter super ----------
   Cut-in, then Ruby (the bean) says NO and grows into a green-flickering giant, stomps twice, throws a toy car,
   and lets out a WAAAAH shockwave: 5 + 5 + 6 + 14 = 30, can't be blocked. Then she shrinks back and giggles. */
const RUBYPAL={'k': '#141018', 'h': '#5a3a24', 'H': '#8a5a34', 's': '#f4cfb0', 'S': '#dcae8c', 'e': '#2a1c18', 'w': '#ffffff', 'g': '#a8e0a0', 'G': '#6ab070', 'm': '#c86060', 'r': '#f4a0a0'};
let RUBY=null,RUBYG=null;const rubyImg=gr=>gr?(RUBYG||(RUBYG=mk(HD.ruby,Object.assign({},RUBYPAL,{k:K,s:'#9ad870',S:'#6cae50',r:'#c8f0a0',m:'#3a6a28'})))):(RUBY||(RUBY=mk(HD.ruby,Object.assign({},RUBYPAL,{k:K}))));
const RBY=[.6,1.8,4.0,4.45],RBYHIT=[[2.2,5,'NO NAP!'],[2.6,5,'MINE!'],[3.12,6,''],[3.62,14,'WAAAAAAH!']];
function startTantrum(f){const v=f.o;G.cine={kind:'rby',t:0,f,v,hits:0,dmg:0,last:-9,line:''};f.vx=0;v.vx=0;v.vy=0;v.y=0;v.mv=null;v.dash=0;set(v,'idle');G.banner=null;
 snd(392,.25,784,'square',.06);snd(523,.3,1046,'square',.04);noise(.2,.3,1500,'bandpass')}
function rbyUpd(dt){const C=G.cine,f=C.f,v=C.v,t0=C.t;C.t+=dt;const t=C.t,cross=a=>t0<a&&t>=a;
 if(cross(.22)){snd(880,.15,1760,'square',.05);G.shake=.2;G.sa=3}
 if(cross(RBY[0]+.15)){snd(300,.2,200,'triangle',.08)}
 if(t>RBY[0]+.45&&t<RBY[1]&&((t*10)|0)!==((t0*10)|0)){noise(.08,.35,180,'lowpass');G.shake=.12;G.sa=3}
 if(cross(RBY[1]-.15)){snd(110,.5,55,'sawtooth',.1);noise(.4,.4,300,'lowpass')}
 while(C.hits<RBYHIT.length&&t>=RBYHIT[C.hits][0]){const[,d,line]=RBYHIT[C.hits],last=C.hits===RBYHIT.length-1;C.hits++;
  const dir=v.x>=f.x?1:-1;v.hp=Math.max(G.mode==='train'?1:0,v.hp-d);C.dmg+=d;C.last=t;if(line)C.line=line;
  const cx=v.x,cy=v.y+30;G.pt.push({x:cx,y:cy,vx:0,vy:0,ay:0,t:.2,t0:.2,c:'#fff',s:0,burst:1,big:last,rot:R(0,PI/4)});dust(v.x,10);spark(cx,cy,'#fff8c0',8,120);
  G.pt.push({x:cx+R(-6,6),y:cy+30,vx:0,vy:44,ay:0,t:.6,c:last?'#f85040':'#f8e060',s:0,txt:'-'+d});sfx.hit(last);sfx.thud();G.shake=last?.5:.3;G.sa=last?6:4;v.fl=.05;
  if(last){v.vx=dir*200;v.vy=280*LV;v.y=1;v.jug=1;v.bnc=0;set(v,'knock');G.flash=.08;snd(600,.6,200,'sawtooth',.08)}else{set(v,'hit');v.stun=.3;v.daze=.4;v.low=0}}
 v.t+=dt;for(let i=G.pt.length-1;i>=0;i--){const q=G.pt[i];q.t-=dt;q.vy+=(q.ay||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0)G.pt.splice(i,1)}
 if(t>=RBY[3]){G.cine=null;f.inv=.3;set(f,'idle')}}
/* Ruby: a toddler in a pink hoodie, black leggings and white sneakers. x,y = feet (screen), s = scale */
function drawRuby(x,y,s,o){o=o||{};const gr=!!o.green,SK=gr?'#9ad870':'#f4cfb0',HO=gr?'#c0a0c8':'#f0a0c8',HL=gr?'#d4c0dc':'#f8c4dc',HD_=gr?'#a088b0':'#dc84b0';g.save();g.translate(Math.round(x),Math.round(y));g.scale(s,s);
 const lu=o.lift>0?4:0,ru=o.lift<0?4:0;
 r(K,-7,-11-lu,6,10);r(K,1,-11-ru,6,10);r('#1c1c22',-6,-10-lu,4,8);r('#1c1c22',2,-10-ru,4,8);
 r(K,-8,-3-lu,8,4);r(K,1,-3-ru,8,4);r('#f4f4f4',-7,-2-lu,6,2);r('#f4f4f4',2,-2-ru,6,2);r('#f0b0c8',-7,-3-lu,2,1);r('#f0b0c8',2,-3-ru,2,1);r('#c02868',-3,-2-lu,1,1);r('#c02868',6,-2-ru,1,1);
 r(K,-9,-23,18,13);r(HO,-8,-22,16,11);r(HL,-8,-22,16,2);r(HD_,-8,-13,16,2);r('#c86898',0,-22,1,10);r(HD_,-6,-17,5,3);if(gr){r(SK,-8,-14,3,2);r(SK,5,-20,3,2)}
 if(o.armsUp){r(K,-13,-33,5,13);r(K,8,-33,5,13);r(HO,-12,-32,3,11);r(HO,9,-32,3,11);r(SK,-12,-34,3,3);r(SK,9,-34,3,3)}
 else{r(K,-12,-22,5,11);r(K,7,-22,5,11);r(HO,-11,-21,3,9);r(HO,8,-21,3,9);r(SK,-11,-13,3,2);r(SK,8,-13,3,2)}
 g.drawImage(rubyImg(gr),-9,-40);
 if(o.wail){r(K,-1,-27,6,4);r('#7a1830',0,-26,4,2)}
 if(o.glow){r('#f8f080',-3,-31,2,1);r('#f8f080',3,-31,2,1)}
 g.restore()}
const toyCar=(x,y)=>{r(K,x-6,y-5,12,7);r('#e02828',x-5,y-4,10,5);r('#ffffff',x-3,y-3,2,2);r('#ffffff',x+1,y-3,2,2);r(K,x-2,y-2,1,1);r(K,x+2,y-2,1,1);r(K,x-5,y+1,3,3);r(K,x+2,y+1,3,3)};
/* the giant on the stage (drawn in the world layer, behind the fighters) */
function rbyWorld(){const C=G.cine,t=C.t,v=C.v,f=C.f;if(t<RBY[1])return;const side=v.x>=f.x?1:-1,rx=Math.round(cl(v.x+side*34,30,SW-30)-cam);
 let s=4;if(t>=RBY[2])s=Math.max(1,4-(t-RBY[2])/(RBY[3]-RBY[2])*3);
 const nx=RBYHIT.find(h=>h[0]>t),lift=nx&&nx[0]-t<.18&&nx[0]-t>0&&nx[1]===5?(nx===RBYHIT[0]?1:-1):0;
 drawRuby(rx,F+2,s,{lift,armsUp:t>2.8&&t<3.1,wail:t>3.45&&t<RBY[2],glow:t<RBY[2],green:t<RBY[2]&&((t*8)|0)%3===0});
 if(t>2.98&&t<3.13){const k=(t-2.98)/.15,vx=Math.round(v.x-cam);toyCar(Math.round(rx+(vx-rx)*k),Math.round(F-150+(110)*k-Math.sin(k*PI)*30))}
 if(t>3.45&&t<RBY[2]){const k=(t-3.45)/(RBY[2]-3.45);for(let i=0;i<3;i++){const rr=Math.round(20+((k*160+i*40)%120));ring(rx,F-130,rr,i%2?'#ffffff':'#f8e060');ring(rx,F-130,rr+1,i%2?'#ffffff':'#f8e060')}}}
function rbyDraw(){const C=G.cine,t=C.t,f=C.f,cy=Math.round(H/2);
 if(t<RBY[0]){const e=Math.min(1,t/.18),sl=Math.round((1-e)*W);r('#120810',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.3);
  r('#983848',-W+sl*1.5,-66,W*2,24);r('#983848',-W-sl*1.5,42,W*2,24);r('#f8a0c8',-W-sl,-36,W*2,72);r('#141018',-W+sl,-32,W*2,4);r('#141018',-W+sl,28,W*2,4);
  for(let i=0;i<70;i++){const px=-W+((i*29+t*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.22)',Math.round(px),py,3,3)}g.restore();
  const S_=Math.max(3,Math.min(6,Math.floor(H/50))),hd=rubyImg(),hw=hd.width*S_,hh=hd.height*S_,px=Math.round(W/2-hw/2+(1-e)*130),py=Math.round(cy-hh/2-12+(t>.22&&t<.3?R(-3,3):0));
  g.imageSmoothingEnabled=false;r('#141018',px-5,py-5,hw+10,hh+10);r('#ffffff',px-3,py-3,hw+6,hh+6);r('#f0a0c8',px,py,hw,hh);g.drawImage(hd,px,py,hw,hh);
  const bx=px+hw-2,by=py-6;disc(bx,by,12,'#141018');disc(bx,by,10,'#f8e040');text('S',bx-6,by-8,4,'#141018',null);
  if(t>.22){ctext('RUBY TEMPER',py+hh+12,4,'#ffffff','#141018');ctext('TANTRUM',py+hh+30,4,'#f8e060','#141018');ctext('SUPER  -  '+f.c.n,py+hh+52,1,'#f8a0c8',null)}
  if(t<.05)r('#ffffff',0,0,W,H);return}
 if(t<RBY[1]){const k=(t-RBY[0])/(RBY[1]-RBY[0]),s=k<.3?3:3+Math.min(1,(k-.3)/.7)*5,sh=k>.3?R(-2,2)*s/3:0;r('#1a1020',0,0,W,H);
  for(let i=0;i<9;i++)r('#24142c',0,Math.round(H*.7)+i*9,W,4);r('#3a2a20',0,Math.round(H*.86),W,H);
  drawRuby(W/2+sh,Math.round(H*.86)+(s>3?Math.round((s-3)*2):0),s,{armsUp:k>.55,glow:k>.4,green:k>.3&&((t*10)|0)%2===0,lift:k>.6?(((t*6)|0)%2?1:-1):0});
  if(k<.3){const s_='NO.';r(K,W/2+16,Math.round(H*.86)-140,tw(s_,3)+10,22);r('#ffffff',W/2+17,Math.round(H*.86)-139,tw(s_,3)+8,20);text(s_,W/2+21,Math.round(H*.86)-137,3,'#201828',null)}
  if(k>.8)ctext('RUBY SMASH!!',22,4,'#80ff60','#102010');if(k>.35)for(let i=0;i<6;i++){const xx=(i*41+11)%W;r('#120810',xx,Math.round(H*.86),2,Math.round((k-.35)*30))}return}
 text('TEMPER TANTRUM',6,30,2,'#f8a0c8');if(C.dmg>0){const tot='-'+C.dmg;text(tot,W-6-tw(tot,3),28,3,'#f85040')}
 if(C.line&&t-C.last<.6&&t<RBY[2]){const s_=C.line,w=tw(s_,3);r(K,Math.round(W/2-w/2-5),48,w+10,22);r('#ffffff',Math.round(W/2-w/2-4),49,w+8,20);text(s_,Math.round(W/2-w/2),51,3,'#c01848',null)}
 if(t>=RBY[2]&&t>RBY[2]+.15)ctext('hehe.',58,2,'#f8a0c8','#141018');
 if(C.hits>=RBYHIT.length&&t-C.last<.05)r('#ffffff',0,0,W,H)}

/* ---------- ALT: cinematic supers built on one frame: CN[kind] = {T (end), hits [[t, dmg, line]], full(t), draw(C), world(C)} ---------- */
function cnStart(f,kind){const v=f.o;G.cine={kind,t:0,f,v,hits:0,dmg:0,last:-9,line:''};f.vx=0;v.vx=0;v.vy=0;v.y=0;v.mv=null;v.dash=0;set(v,'idle');G.banner=null;if(CN[kind].init)CN[kind].init(G.cine);
 snd(392,.25,784,'square',.06);snd(588,.3,1176,'square',.04);noise(.2,.3,1800,'bandpass')}
function cnUpd(dt){const C=G.cine,K_=CN[C.kind],f=C.f,v=C.v,t0=C.t;C.t+=dt;const t=C.t;if(f.say&&(f.say[1]-=dt)<=0)f.say=null;if(t0<.22&&t>=.22){snd(880,.15,1760,'square',.05);G.shake=.2;G.sa=3}
 if(K_.sfx)K_.sfx(C,t0,t);
 while(C.hits<K_.hits.length&&t>=K_.hits[C.hits][0]){const[,d,line]=K_.hits[C.hits],last=C.hits===K_.hits.length-1;C.hits++;const dir=v.x>=f.x?1:-1;
  v.hp=Math.max(G.mode==='train'?1:0,v.hp-d);C.dmg+=d;C.last=t;if(line)C.line=line;const cx=v.x,cy=v.y+32;
  G.pt.push({x:cx,y:cy,vx:0,vy:0,ay:0,t:.2,t0:.2,c:'#fff',s:0,burst:1,big:last,rot:R(0,PI/4)});spark(cx,cy,K_.spark||'#fff8c0',8,120);G.pt.push({x:cx+R(-6,6),y:cy+30,vx:0,vy:44,ay:0,t:.6,c:last?'#f85040':'#f8e060',s:0,txt:'-'+d});
  sfx.hit(last);G.shake=last?.5:.22;G.sa=last?6:3;v.fl=.05;
  if(last){v.vx=dir*200;v.vy=280*LV;v.y=1;v.jug=1;v.bnc=0;set(v,'knock');G.flash=.08}else{set(v,'hit');v.stun=.32;v.daze=.4;v.low=0}}
 v.t+=dt;for(let i=G.pt.length-1;i>=0;i--){const q=G.pt[i];q.t-=dt;q.vy+=(q.ay||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0)G.pt.splice(i,1)}
 if(t>=K_.T){G.cine=null;f.inv=.3;set(f,'idle')}}
/* the gacha cut-in every full super opens with */
function cnCutIn(t,img,bgc,band,l1,l2,sub){const cy=Math.round(H/2),e=Math.min(1,t/.18),sl=Math.round((1-e)*W);r('#0c0810',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.3);
 r(bgc,-W+sl*1.5,-66,W*2,24);r(bgc,-W-sl*1.5,42,W*2,24);r(band,-W-sl,-36,W*2,72);r('#141018',-W+sl,-32,W*2,4);r('#141018',-W+sl,28,W*2,4);
 for(let i=0;i<70;i++){const px=-W+((i*29+t*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.22)',Math.round(px),py,3,3)}g.restore();
 const S_=Math.max(3,Math.min(6,Math.floor(H/50))),hw=img.width*S_,hh=img.height*S_,px=Math.round(W/2-hw/2+(1-e)*130),py=Math.round(cy-hh/2-14+(t>.22&&t<.3?R(-3,3):0));
 g.imageSmoothingEnabled=false;r('#141018',px-5,py-5,hw+10,hh+10);r('#ffffff',px-3,py-3,hw+6,hh+6);r(bgc,px,py,hw,hh);g.drawImage(img,px,py,hw,hh);
 const bx=px+hw-2,by=py-6;disc(bx,by,12,'#141018');disc(bx,by,10,'#f8e040');text('S',bx-6,by-8,4,'#141018',null);
 if(t>.22){ctext(l1,py+hh+12,4,'#ffffff','#141018');if(l2)ctext(l2,py+hh+30,4,'#f8e060','#141018');ctext(sub,py+hh+(l2?52:34),1,'#f8e060',null)}
 g.save();g.globalAlpha=.3;g.translate(Math.round((t/.6)*(W+140))-70,0);g.rotate(.3);r('#ffffff',-8,-40,12,H+80);g.restore();if(t<.05)r('#ffffff',0,0,W,H)}
function cnHud(C,label){text(label,6,30,2,'#f8e060');if(C.dmg>0){const tot='-'+C.dmg;text(tot,W-6-tw(tot,3),28,3,'#f85040')}
 if(C.line&&C.t-C.last<.6){const s_=C.line,w=tw(s_,3);r(K,Math.round(W/2-w/2-5),48,w+10,22);r('#ffffff',Math.round(W/2-w/2-4),49,w+8,20);text(s_,Math.round(W/2-w/2),51,3,'#c01848',null)}
 if(C.hits>=CN[C.kind].hits.length&&C.t-C.last<.05)r('#ffffff',0,0,W,H)}
const poseAt=(ci,x,y,P,sc,o)=>{g.save();g.translate(Math.round(x),Math.round(y));g.scale(sc,sc);const j=rig(CH[ci],P,o||{});g.restore();return j};
/* Louie as a paper airplane: his ears are the wings. x,y screen, d = direction, s = scale */
function drawPlane(x,y,d,s,tilt){const lo=CH[cix('louie')],tri=(pts,col)=>{g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fillStyle=col;g.fill()};
 g.save();g.translate(Math.round(x),Math.round(y));g.scale(d*s,s);g.rotate(tilt||0);
 tri([-16,-2,6,-1,-14,-15],K);tri([-14,-3,4,-2,-12,-13],'#e89040');tri([-12,-4,0,-3,-11,-10],'#f8c8a0');
 tri([-17,0,9,0,-14,6],K);tri([-15,1,7,1,-13,5],'#ffffff');r('#d8d8e0',-13,2,18,1);
 tri([-15,2,6,2,-19,13],K);tri([-14,3,4,3,-17,11],'#e89040');tri([-12,4,0,4,-14,9],'#fff0d8');
 disc(-18,-1,3,K);disc(-18,-1,2,'#e89040');
 g.drawImage(lo.head2||lo.head,3,-12);g.restore()}
const CN={
 /* ERIN: LOUIE AIRLINES. Louie folds into a paper airplane, ears for wings; Erin throws him; he loops the opponent and dives in. */
 lou:{T:3.7,hits:[[2.0,5,'ZOOM!'],[2.3,5,'ZOOM ZOOM!'],[2.6,5,''],[2.95,15,'BORK!!']],spark:'#f8a0c8',full:t=>t<1.5,
  sfx:(C,t0,t)=>{if(t0<.6&&t>=.6)snd(660,.2,880,'triangle',.06);if(t0<1.3&&t>=1.3){noise(.4,.3,3000,'bandpass');snd(500,.5,1500,'sine',.06)}if(t>1.5&&t<2.9&&((t*8)|0)!==((t0*8)|0))snd(900+((t*8)|0)%4*120,.04,0,'triangle',.03)},
  draw(C){const t=C.t,f=C.f,cy=Math.round(H/2);if(t<.6)return cnCutIn(t,f.c.head,f.c.bg,'#a8e8a0','LOUIE','AIRLINES','SUPER  -  '+f.c.n);
   if(t<1.5){const k=(t-.6)/.9;for(let i=0;i<H;i+=6)r(i<H*.5?'#7ab8f0':'#9ad0f8',0,i,W,6);for(let i=0;i<5;i++){const cx=((i*67-t*80)%(W+60)+W+60)%(W+60)-30,cy2=30+i*37%120;r('#ffffff',Math.round(cx),cy2,34,8);r('#ffffff',Math.round(cx)+6,cy2-5,20,6)}
    r('#58a858',0,Math.round(H*.86),W,H);const base=Math.round(H*.86);poseAt(cix('erin'),58,base,k<.6?PS.castw:PS.p3,2.4,{});
    const px=k<.6?120:120+(k-.6)/.4*190,py=k<.6?base-150:base-150-(k-.6)/.4*90;drawPlane(px,py,1,k<.6?3:3-(k-.6)*3,-(k>.6?.3:0));
    ctext(k<.6?'PREPARE FOR TAKEOFF':'WHEEEEE!',20,3,'#ffffff','#2a5a90');return}
   cnHud(C,'LOUIE AIRLINES');if(t>3.05)ctext('GOOD BOY.',72,3,'#f8a0c8','#141018')},
  world(C){const t=C.t,f=C.f,v=C.v;if(t<1.5)return;const vx=v.x,u=Math.min(1,(t-1.5)/1.45);let x,y,tilt=0;
   if(u<.25){const k=u/.25;x=f.x+(vx-f.x)*k;y=40+Math.sin(k*PI)*30}else if(u<.85){const k=(u-.25)/.6,a=k*4*PI;x=vx+Math.cos(a)*34*(1-k*.4);y=46+Math.sin(a)*22;tilt=Math.sin(a)*.4}else{const k=(u-.85)/.15;x=vx;y=46-k*14;tilt=.5}
   if(t<3.1){for(let i=1;i<6;i++){const hx_=Math.round(x-cam-(i*6)*(x>=vx?1:-1)),hy_=F-Math.round(y)+i*2;if(((t*20+i)|0)%2)heart(hx_,hy_,i%2?'#f85888':'#f8a0c8')}drawPlane(x-cam,F-y,x<vx?1:-1,1.4,tilt)}
   else{const lx=Math.round(vx-cam+(v.x>=f.x?-26:26)),ly=F;g.save();g.translate(lx,ly);g.scale(1.3,1.3);g.drawImage(CH[cix('louie')].head,-7,-16);g.restore();if(((t*10)|0)%2)heart(lx,ly-26,'#f85888')}}},
 /* LIL BOTTIE: NUKE THE DATA CENTER. The bodega (I MIGHT JUST HIT MY RATE LIMIT), the data center on fire with him waving
    on the roof in a spotlight, walking away from the explosion, then the blast wave hits the stage. */
 nuk:{T:4.4,hits:[[3.55,5,''],[3.75,5,''],[4.0,20,'DELETED.']],spark:'#f8a030',full:t=>t<3.3,
  sfx:(C,t0,t)=>{if(t0<1.2&&t>=1.2){snd(220,.3,110,'square',.08)}if(t0<1.6&&t>=1.6)noise(.6,.3,500,'lowpass');if(t0<2.5&&t>=2.5){noise(1.2,.5,200,'lowpass');snd(60,1.2,30,'sawtooth',.12)}if(t0<3.3&&t>=3.3)noise(.8,.5,300,'lowpass')},
  draw(C){const t=C.t,f=C.f,ci=cix('chrome');if(t<.6)return cnCutIn(t,f.c.head,f.c.bg,'#40a0ff','NUKE THE','DATA CENTER','SUPER  -  '+f.c.n);
   if(t<1.6){const k=(t-.6)/1;r('#2a2418',0,0,W,H);const sh0=Math.round(H*.22);
    for(let row=0;row<4;row++){const y=sh0+row*34;r('#5a5048',0,y+26,W,4);for(let i=0;i<22;i++){const col=['#e8c020','#d83828','#3878d8','#38a048','#e87818','#a040c0'][(i*7+row*3)%6];r(col,4+i*11,y+6+(i*5%3),9,20);r('#ffffff',6+i*11,y+10,5,3)}}
    r('#1a2a3a',W-70,10,62,40);r('#0a0a10',W-68,12,58,36);const tvs=k<.55?['I MIGHT','JUST HIT MY','RATE LIMIT']:['RATE','LIMIT','REACHED'];if(k<.55||((t*6)|0)%2)tvs.forEach((l,i)=>text(l,W-66,15+i*11,1,'#ff3030',null));
    r('#b8b0a0',0,Math.round(H*.86),W,H);for(let i=0;i<W;i+=16)r('#a8a090',i,Math.round(H*.86),1,H);
    const j=poseAt(ci,90,Math.round(H*.86),PS.st,2.6,{prop:k<.7?'cup':null});
    if(k>=.55){g.save();g.translate(90,Math.round(H*.86));g.scale(2.6,2.6);const h=j.head;B('#101420',h[0]-4,h[1]-4,9,8);const rd='#ff3030';B(rd,h[0]-3,h[1]+2,1,1);B(rd,h[0]-2,h[1]+1,1,1);B(rd,h[0]+2,h[1]+1,1,1);B(rd,h[0]+3,h[1]+2,1,1);B(rd,h[0]-2,h[1]-2,5,1);g.restore()}
    if(k>.75)ctext('...OKAY.',24,3,'#ff3030','#140808');return}
   if(t<2.5){const k=(t-1.6)/.9;for(let i=0;i<H;i+=4)r(i<H*.6?'#0c1028':'#14182c',0,i,W,4);for(let i=0;i<40;i++)r(i%3?'#f8d070':'#80a0ff',(i*53)%W,Math.round(H*.62)+(i*29)%Math.round(H*.3),1,1);
    const bx=40,bw=160,by=Math.round(H*.42),bh=Math.round(H*.38);r(K,bx-1,by-1,bw+2,bh+2);r('#2a2a34',bx,by,bw,bh);for(let yy=by+8;yy<by+bh-8;yy+=10)for(let xx=bx+6;xx<bx+bw-6;xx+=9)r(((xx*7+yy*3+((t*8)|0))%5)?'#3a90ff':'#40ff90',xx,yy,5,2);
    text('DATA CENTER',bx+bw/2-33,by+bh-12,1,'#c8d0dc',null);
    for(let i=0;i<14;i++){const fx=bx+4+i*11,fh=8+((i*13+((t*20)|0))%14);r('#f86818',fx,by-fh,8,fh);r('#f8c030',fx+2,by-fh+3,4,fh-3);r('#fff0a0',fx+3,by-4,2,4)}
    for(let i=0;i<6;i++){const sx=bx+10+i*28,sy=by-30-((t*30+i*20)%60);disc(sx,Math.round(sy),8+i%3*2,'rgba(40,36,44,.85)')}
    g.save();g.globalAlpha=.22;g.fillStyle='#fff8d0';g.beginPath();g.moveTo(W-20,0);g.lineTo(W/2-14,by);g.lineTo(W/2+14,by);g.closePath();g.fill();g.restore();
    g.save();g.globalAlpha=.4;g.fillStyle='#fff8d0';g.beginPath();g.ellipse(W/2,by,16,4,0,0,7);g.fill();g.restore();
    poseAt(ci,W/2,by,p(0,19,0,-7,0,7,0,5,-6,6+Math.sin(t*12)*2,13),1.1,{});
    const fe=12;r(K,fe,H-30,40,14);r('#c02020',fe+1,H-29,38,12);r(((t*6)|0)%2?'#4080ff':'#2040a0',fe+6,H-33,6,4);r(((t*6)|0)%2?'#2040a0':'#4080ff',fe+26,H-33,6,4);disc(fe+8,H-16,4,K);disc(fe+32,H-16,4,K);
    ctext(k<.5?'DELETING...':'rm -rf /data',20,2,'#40ff90','#081008');return}
   if(t<3.3){const k=(t-2.5)/.8,sh_=Math.round(R(-3,3)*(1-k));for(let i=0;i<H;i+=4){const u=i/H;r(u<.4?'#3a2a50':u<.7?'#a05048':'#e88840',0,i,W,4)}
    const tx=W/2-26+sh_,ty=Math.round(H*.25),tw2=52,th2=Math.round(H*.5);r('#3a3848',tx,ty,tw2,th2);for(let yy=ty+6;yy<ty+th2;yy+=8)for(let xx=tx+4;xx<tx+tw2-4;xx+=8)r('#8a8070',xx,yy,4,4);
    const R_=Math.round(20+k*90);disc(W/2+sh_,ty+20,R_,'#f86818');disc(W/2+sh_,ty+20,Math.round(R_*.7),'#f8c030');disc(W/2+sh_,ty+20,Math.round(R_*.35),'#fff8c0');
    for(let i=0;i<24;i++){const a=i*.9,d_=R_*(.8+(i%5)*.12);r(i%3?'#2a2028':'#5a4040',Math.round(W/2+Math.cos(a)*d_)+sh_,Math.round(ty+20+Math.sin(a)*d_*.7),3+i%3,3)}
    r('#2a2a30',0,Math.round(H*.8),W,H);for(let i=0;i<5;i++)r('#f4f4f0',i*56+((t*40)|0)%56,Math.round(H*.88),24,2);
    poseAt(ci,W/2+14,Math.round(H*.97),((t*7)|0)%2?PS.w1:PS.w2,2.8,{});ctext('NUKE THE DATA CENTER',14,3,'#ffffff','#401008');return}
   cnHud(C,'NUKE THE DATA CENTER')},
  world(C){const t=C.t,v=C.v;if(t<3.3)return;const k=Math.min(1,(t-3.3)/.8),vx=Math.round(v.x-cam);
   for(let i=0;i<18;i++){const x=(i*37+((t*120)|0))%W,y=Math.round(((i*53+t*200)%(F+40))-30);r(i%3?'#5a4040':'#2a2028',x,y,3,3)}
   if(k<1){const R_=Math.round(10+k*130);ring(vx,F-30,R_,'#f8c030');ring(vx,F-30,R_+2,'#f86818')}}},
 /* MARCUS: THE FINAL BET (Will's idea; staging and every line but TIME TO REMOVE THE J are invented). He plays an insane 12-leg UFC
    parlay with the rent on it. The slip fills leg by leg, the last leg is a one-punch knockout in the octagon, the parlay hits,
    and the winnings land on the opponent: 5 + 5 + 20 = 30. Against Will he says TIME TO REMOVE THE J; anyone else gets a smart remark. */
 bet:{T:4.5,hits:[[3.55,5,'CHA-'],[3.78,5,'CHING!'],[4.05,20,'PAID.']],spark:'#60d880',full:t=>t<3.3,
  init(C){C.say=C.v.c.id==='will'?'TIME TO REMOVE THE J.':pick(BETQ)},
  sfx:(C,t0,t)=>{if(t>.7&&t<1.7&&((t*11)|0)!==((t0*11)|0))snd(620+(((t*11)|0)%12)*45,.04,0,'square',.04);if(t0<2.2&&t>=2.2){sfx.hit(1);noise(.3,.4,500,'lowpass');G.shake=.3;G.sa=4}
   if(t0<2.62&&t>=2.62){snd(523,.1);G.later.push([.1,()=>snd(659,.1)]);G.later.push([.2,()=>snd(784,.1)]);G.later.push([.3,()=>snd(1047,.35,0,'square',.06)])}
   if(t>2.7&&t<3.3&&((t*14)|0)!==((t0*14)|0))snd(1700+R(0,700),.03,0,'triangle',.03);if(t0<3.3&&t>=3.3)C.f.say=[C.say,2.4]},
  draw(C){const t=C.t,f=C.f,ci=cix('marcus');if(t<.6)return cnCutIn(t,f.c.head,f.c.bg,'#38a048','THE FINAL','BET','SUPER  -  '+f.c.n);
   if(t<1.7){const k=(t-.6)/1.1,n=12,shown=Math.min(n,Math.floor(k*13.5));r('#0c1810',0,0,W,H);for(let i=0;i<H;i+=10)r('#102418',0,i,W,4);
    const px=100,py=Math.round(H*.2),pw=130,ph=Math.round(H*.6),rh=(ph-52)/n;r(K,px-4,py-4,pw+8,ph+8);r('#3a3a48',px-3,py-3,pw+6,ph+6);r('#0c141c',px,py,pw,ph);r('#38a048',px,py,pw,14);text('UFC PARLAY  12 LEGS',px+5,py+2,1,'#ffffff',null);
    for(let i=0;i<n;i++){const y=Math.round(py+18+i*rh),hit=i<shown;if(i===shown&&((t*12)|0)%2)r('#1c3040',px+2,y-1,pw-4,Math.max(8,rh|0));text('LEG '+(i<9?'0':'')+(i+1),px+6,y,1,hit?'#e8f0f4':'#607080',null);if(hit){text('HIT',px+pw-6-tw('HIT',1),y,1,'#60ff90',null);r('#60ff90',px+56,y+4,pw-90,1)}}
    r('#1c2830',px,py+ph-32,pw,32);text('STAKE',px+6,py+ph-29,1,'#f8a0a0',null);text('THE RENT',px+pw-6-tw('THE RENT',1),py+ph-29,1,'#f8a0a0',null);text('PAYS',px+6,py+ph-17,2,'#f8e060',null);text('$4,800,000',px+pw-6-tw('$4,800,000',2),py+ph-17,2,'#f8e060',null);
    poseAt(ci,50,Math.round(H*.93),PS.selfw,2.6,{prop:'phone'});bubble(wrapT(C.say,14),6,Math.round(H*.07),0,'#201828');return}
   if(t<2.6){const k=(t-1.7)/.9,hit=t>=2.2,fy=Math.round(H*.74),sh_=hit&&t<2.35?Math.round(R(-3,3)):0;r('#140c1c',0,0,W,H);
    for(let i=0;i<90;i++){const cx=(i*37)%W,cy2=Math.round(H*.2)+(i*23)%Math.round(H*.3);r(['#3a3048','#4a3858','#2a2438'][i%3],cx,cy2+((((t*6+i)|0)%2)&&hit?-2:0),5,6)}
    for(let i=0;i<4;i++){g.save();g.globalAlpha=.16;g.fillStyle='#fff8d0';g.beginPath();g.moveTo(30+i*60,0);g.lineTo(W/2-50+i*34,fy);g.lineTo(W/2-20+i*34,fy);g.closePath();g.fill();g.restore()}
    r('#2a2a34',14+sh_,fy,W-28,Math.round(H*.16));r('#3a3a48',20+sh_,fy,W-40,4);for(let i=0;i<=8;i++){r('#8a8a98',20+sh_+i*((W-40)/8),fy-34,2,36)}r('#8a8a98',20+sh_,fy-34,W-40,2);r('#8a8a98',20+sh_,fy-18,W-40,1);
    const man=(x,col,pose)=>{const y=fy+6;disc(x,y-44,6,K);disc(x,y-44,5,'#e0b090');r(K,x-6,y-38,12,20);r('#e0b090',x-5,y-37,10,12);r(col,x-5,y-26,10,8);r(K,x-6,y-18,5,18);r(K,x+1,y-18,5,18);r('#e0b090',x-5,y-18,3,17);r('#e0b090',x+2,y-18,3,17);
     if(pose===1){r(K,x+4,y-36,20,6);r('#e0b090',x+5,y-35,14,4);r('#c02020',x+18,y-37,7,8)}else{r(K,x+4,y-34,8,6);r('#c02020',x+7,y-33,6,6)}};
    man(W/2-30+sh_+(hit?10:Math.round(Math.sin(t*20)*2)),'#e07a20',hit?1:0);
    if(!hit){g.save();g.translate(W/2+30,0);g.scale(-1,1);man(Math.round(Math.sin(t*17)*2),'#3060c0',0);g.restore()}
    else{const kk=(t-2.2)/.4,bx=W/2+30+kk*70,by=fy-30-Math.sin(Math.min(1,kk)*PI)*50;g.save();g.translate(Math.round(bx),Math.round(by));g.rotate(kk*5);disc(0,0,7,K);disc(0,0,6,'#e0b090');r(K,-6,6,12,20);r('#3060c0',-5,16,10,8);g.restore();
     for(let i=0;i<8;i++){const a=i*PI/4+t;r(i%2?'#f8a030':'#ffffff',Math.round(W/2+Math.cos(a)*(10+kk*30)),Math.round(fy-38+Math.sin(a)*(10+kk*30)),3,3)}}
    ctext('LEG 12 OF 12',Math.round(H*.05),3,'#ffffff','#141018');ctext(hit?'KNOCKOUT!!':'COME ON. COME ON.',Math.round(H*.05)+18,hit?4:2,hit?(((t*12)|0)%2?'#f85040':'#f8e060'):'#c8c0d8','#141018');return}
   if(t<3.3){const k=(t-2.6)/.7,amt='$'+Math.round(Math.min(1,k*1.5)*4800000).toLocaleString('en-US');bgStripes('#0c3018','#145024');
    for(let i=0;i<46;i++){const x=(i*53)%W,y=Math.round(((i*71+t*(150+i%5*30))%(H+20))-10);r(K,x-1,y-1,10,7);r(i%4?'#60d880':'#f8d030',x,y,8,5);r('#208040',x+3,y+1,2,3)}
    ctext('PARLAY HITS!',Math.round(H*.1),4,((t*10)|0)%2?'#f8e060':'#ffffff','#103010');ctext(amt,Math.round(H*.1)+22,4,'#60ff90','#082008');
    poseAt(ci,W/2,Math.round(H*.96),mix(PS.win1,PS.win2,.5+.5*Math.sin(t*14)),3,{});{const L=wrapT(C.say,22);L.forEach((l,i)=>ctext(l,Math.round(H*.1)+46+i*12,2,'#ffffff','#103010'))}return}
   cnHud(C,'THE FINAL BET')},
  world(C){const t=C.t,v=C.v;if(t<3.3)return;const vx=Math.round(v.x-cam);
   for(let i=0;i<26;i++){const x=vx+((i*29)%84)-42,y=Math.round((((t-3.3)*300+i*41)%(F+30))-20);if(i%3){disc(x,y,3,K);disc(x,y,2,'#f8d030');r('#fff0a0',x-1,y-1,1,1)}else{r(K,x-5,y-3,10,7);r('#60d880',x-4,y-2,8,5);r('#208040',x-1,y-1,2,3)}}
   if(t>4.05){const n=Math.min(5,1+((t-4.05)*14)|0);for(let i=0;i<n;i++){r(K,vx-14,F-7-i*5,28,6);r('#60d880',vx-13,F-6-i*5,26,4);r('#f8d030',vx-2,F-6-i*5,4,4)}}}},
 /* KING BIBI: WAR CRIMINAL (Will's idea; staging and lines are invented). The secret data center: his super soldier Lil Bottie comes
    online. He becomes FENTANYAHU. The two of them level the whole entire city (buildings only). The blast reaches the stage: 5 + 5 + 20 = 30.
    FENTANYAHU is his own character (Will's note), built on the android-meme family he comes from: a cyborg Bibi with a half-metal
    face, a red eye and a reactor in his chest. He pops up, scans, and is the giant marching through the city firing his eye. Ben Gvir and
    Donald Trump celebrate next to Bibi in the foreground of the city scene, each with a line in a speech bubble and no name tags.
    None of them is a fighter; they are drawn with the shared rig. */
 war:{T:5.5,hits:[[4.5,5,''],[4.75,5,''],[5.0,20,'NO COMMENT.']],spark:'#f86818',full:t=>t<4.3,
  init(C){WARQ[0]=pick(GVIRQ)},
  sfx:(C,t0,t)=>{if(t>.6&&t<1.6&&((t*4)|0)!==((t0*4)|0))snd(880,.1,660,'square',.045);if(t0<1.25&&t>=1.25){snd(140,.35,560,'sawtooth',.07);noise(.2,.3,2500,'bandpass')}
   if(t0<1.6&&t>=1.6){snd(110,.8,440,'sawtooth',.09);snd(55,.8,110,'sine',.2)}if(t>2.5&&t<4.3&&((t*8)|0)!==((t0*8)|0)){noise(.12,.45,260,'lowpass');snd(70,.14,35,'sine',.25);G.shake=.14;G.sa=3}if(t0<4.3&&t>=4.3)noise(.8,.5,300,'lowpass')},
  draw(C){const t=C.t,f=C.f,ci=cix('bibi'),bo=cix('chrome');if(t<.6)return cnCutIn(t,f.c.head,f.c.bg,'#b01818','WAR','CRIMINAL','SUPER  -  '+f.c.n);
   if(t<1.6){const k=(t-.6)/1,on=k>.62,base=Math.round(H*.9);r('#080a12',0,0,W,H);
    for(let c=0;c<8;c++){const x=4+c*30;if(x>W/2-40&&x<W/2+14)continue;r('#141826',x,Math.round(H*.16),24,base-Math.round(H*.16));for(let yy=Math.round(H*.18);yy<base-6;yy+=7)for(let xx=x+3;xx<x+21;xx+=6)r(((xx*5+yy*3+((t*9)|0))%7)?(on?'#a01818':'#2060c0'):(on?'#ff4040':'#40ff90'),xx,yy,4,2)}
    const tx=W/2-30,ty=Math.round(H*.22),tw_=60,th=base-ty;r(K,tx-3,ty-6,tw_+6,th+6);r('#3a4050',tx-2,ty-5,tw_+4,6);r(on?'#3a1418':'#12303a',tx,ty,tw_,th);for(let i=0;i<9;i++){const by=ty+th-((t*50+i*31)%th);r(on?'#ff8080':'#80e0ff',tx+6+(i*13)%48,Math.round(by),2,2)}
    const j=poseAt(bo,W/2,base-2,PS.st,2.5,{});{g.save();g.translate(W/2,base-2);g.scale(2.5,2.5);const h=j.head;B('#101420',h[0]-4,h[1]-4,9,8);const rd=on?'#ff3030':'#40a0ff';B(rd,h[0]-3,h[1]+1,2,2);B(rd,h[0]+2,h[1]+1,2,2);if(on)B(rd,h[0]-2,h[1]-2,5,1);g.restore()}
    r('rgba(160,220,255,.14)',tx,ty,10,th);r('#3a4050',tx-2,base-2,tw_+4,6);
    poseAt(ci,30,base+4,k>.4?PS.cast:PS.castw,1.5,{});r(K,40,base-22,16,26);r('#2a3040',41,base-21,14,24);r(k>.4&&((t*10)|0)%2?'#ff4040':'#801818',45,base-18,6,5);
    if(on&&((t*8)|0)%2)r('rgba(255,30,30,.14)',0,0,W,H);
    ctext('THE SECRET DATA CENTER',Math.round(H*.04),2,'#c8d0dc','#141018');if(k>.3)ctext('SUPER SOLDIER LIL BOTTIE',Math.round(H*.04)+13,2,on?'#ff4040':'#80e0ff','#141018');if(on)ctext('ONLINE.',Math.round(H*.04)+27,3,'#ff4040','#200808');return}
   if(t<2.5){const k=(t-1.6)/.9,base=Math.round(H*.97),up=Math.min(1,k/.35),fy=base+Math.round((1-up)*(1-up)*190);for(let i=0;i<H;i+=6)r(((i/6+((t*12)|0))|0)%2?'#1c0c2c':'#102c14',0,i,W,6);
    for(let i=0;i<14;i++){const a=i/14*2*PI+t*2;g.save();g.globalAlpha=.25;g.fillStyle=i%2?'#b0ff60':'#c060ff';g.beginPath();g.moveTo(W/2+20,base-70);g.lineTo(W/2+20+Math.cos(a)*400,base-70+Math.sin(a)*400);g.lineTo(W/2+20+Math.cos(a+.12)*400,base-70+Math.sin(a+.12)*400);g.closePath();g.fill();g.restore()}
    for(let i=0;i<3;i++)ring(W/2+20,base-90,Math.round(((t*90+i*40)%130)),i%2?'#b0ff60':'#c060ff');
    drawX(FENTY,W/2+24,fy,foldP(up>=1?t:0),3.4);if(up>=1){const ex=W/2+24+18,ey=fy-196,sw=Math.round(Math.sin(t*7)*60);g.save();g.globalAlpha=.55;g.fillStyle='#ff3030';g.beginPath();g.moveTo(ex,ey);g.lineTo(ex-150,ey+40+sw);g.lineTo(ex-150,ey+52+sw);g.closePath();g.fill();g.restore();disc(ex,ey,3,'#ffd8d8')}
    poseAt(ci,30,base,PS.cast,1.6,{});
    ctext(k<.3?'AND THEN...':'HE POPS UP',Math.round(H*.05),2,'#ffffff','#141018');if(k>=.3){ctext('FENTANYAHU',Math.round(H*.05)+14,5,((t*12)|0)%2?'#ff5040':'#ffffff','#300808');ctext('FENT REACTOR: ONLINE',Math.round(H*.05)+42,1,'#60ff90','#082008')}return}
   if(t<4.3){const k=(t-2.5)/1.8,sh_=Math.round(R(-2,2)),gy=Math.round(H*.86);for(let i=0;i<H;i+=4){const u=i/H;r(u<.25?'#2a1838':u<.5?'#6a2840':u<.7?'#c05038':'#f08838',0,i,W,4)}
    const BL=[[6,18,70],[26,22,110],[50,16,84],[68,26,140],[96,18,96],[116,24,124],[142,16,76],[160,22,104],[184,20,132],[206,18,88],[224,16,64]];
    BL.forEach(([x,w,h],i)=>{const kk=cl((k*1.5-i*.07),0,1),hh=Math.round(h*(1-kk*.82)),tilt=kk>0&&kk<1?Math.round(R(-1,1)):0;r('#1c1828',x+sh_+tilt,gy-hh,w,hh);for(let yy=gy-hh+5;yy<gy-4;yy+=8)for(let xx=x+3;xx<x+w-3;xx+=6)r(kk>0?'#f86818':'#f8d070',xx+sh_,yy,2,3);
     if(kk>0&&kk<1){const ex=x+w/2+sh_,ey=gy-hh;disc(Math.round(ex),ey,Math.round(6+kk*12),'#f86818');disc(Math.round(ex),ey,Math.round(3+kk*8),'#f8c030');disc(Math.round(ex),ey-8,Math.round(2+kk*3),'#fff8c0')}
     if(kk>.2)for(let s_=0;s_<3;s_++)disc(Math.round(x+w/2+sh_+s_*5-5),Math.round(gy-hh-12-((t*40+s_*17+i*9)%50)),5+s_,'rgba(40,32,44,.8)')});
    r('#141018',0,gy,W,H-gy);
    {const bx=((t-2.5)*190)%(W+60)-30,by=Math.round(H*.22+Math.sin(t*5)*8);poseAt(bo,Math.round(bx),by+40,PS.jk,1.3,{});const lx=Math.round(bx+18);if(((t*16)|0)%2){r('#ff3030',lx,by+22,3,gy-by-22);r('#ffb0b0',lx+1,by+22,1,gy-by-22);disc(lx+1,gy-2,7,'#f8c030')}}
    {const fx_=W-70+Math.round(Math.sin(t*3)*6);drawX(FENTY,fx_,gy+6,foldP(t*1.4),2.8);if(((t*14)|0)%2){const ex=fx_+15,ey=gy+6-162,tx=30+((t*90)%110);g.save();g.strokeStyle='#ff3030';g.lineWidth=3;g.beginPath();g.moveTo(ex,ey);g.lineTo(tx,gy-30);g.stroke();g.strokeStyle='#ffd8d8';g.lineWidth=1;g.beginPath();g.moveTo(ex,ey);g.lineTo(tx,gy-30);g.stroke();g.restore();disc(Math.round(tx),gy-30,6,'#f8c030')}}
    {const fb=H-3,jy=Math.round(Math.abs(Math.sin(t*11))*9),ty=Math.round(Math.abs(Math.sin(t*7+1))*4),tp=((t*6)|0)%2?PS.p1:PS.st;
     poseAt(ci,18,fb,PS.bl,1.5,{});drawX(GVIR,52,fb-jy,mix(PS.win1,PS.win2,.5+.5*Math.sin(t*22)),1.5);drawX(TRUMP,90,fb-ty,k>.5?tp:PS.st,1.5);
     for(let i=0;i<18;i++){const x=30+(i*23)%76,y=Math.round(fb-96+((i*31+t*90)%84));r(['#f8e060','#60d8ff','#f85888','#ffffff'][i%4],x,y,2,2)}
     if(k>.08&&k<.52)bubble(wrapT(WARQ[0],15),30,fb-128,0,'#201828');if(k>=.54)bubble(wrapT(WARQ[1],15),70,fb-128,0,'#201828')}
    ctext('THE WHOLE',Math.round(H*.03),3,'#ffffff','#401008');ctext('ENTIRE CITY',Math.round(H*.03)+16,4,'#f8e060','#401008');return}
   cnHud(C,'WAR CRIMINAL')},
  world(C){const t=C.t,v=C.v;if(t<4.3)return;const k=Math.min(1,(t-4.3)/.8),vx=Math.round(v.x-cam);
   for(let i=0;i<22;i++){const x=(i*37+((t*130)|0))%W,y=Math.round(((i*53+t*210)%(F+40))-30);r(i%3?'#5a4040':'#2a2028',x,y,3+i%3,3)}
   if(t<5.1&&((t*16)|0)%2){r('#ff3030',vx-1,0,3,F);r('#ffb0b0',vx,0,1,F)}
   if(k<1){const R_=Math.round(10+k*130);ring(vx,F-30,R_,'#f8c030');ring(vx,F-30,R_+2,'#f86818')}}}};
/* extras for the cinematics: characters who appear in scenes but are not fighters */
const mkX=(id,grid,pal,cols)=>{const c=Object.assign({id,head:mk(grid,pal)},cols);for(const k of['top','arm','fore','pant','shin','skin','shoe'])c[k+'D']=shade(c[k],.72);return c};
const GVIR=mkX('gvir',['.....kkkkkk.....','...kkccccCCkk...','..kccccccccCCk..','.khhccccccCChhk.','.khhhhhhhhhhhhk.','khhsssssssssshhk','khsssssssssssshk','ksgggggssgggggsk','ksglelgssglelgsk','ksgggggssgggggsk','ksssssSSSssssssk','kbssttttttttssbk','kbbsmmmmmmmmsbbk','.kbbbssssssbbbk.','..kkbbbbbbbbkk..','....kkkkkkkk....'],
 {k:K,c:'#f8f8f8',C:'#c8ccd8',h:'#2a2220',s:'#e8b890',S:'#c89068',g:'#1c1c24',l:'#d8e8f0',e:'#241c20',t:'#ffffff',m:'#8a3030',b:'#6a5448'},{skin:'#e8b890',top:'#f4f4f4',arm:'#f4f4f4',fore:'#f4f4f4',pant:'#1c1c28',shin:'#1c1c28',shoe:'#121216'});
const FENTY=mkX('fenty',['....kkkkkkkk....','..kkwwwwwwWWkk..','.kwwwwWwwwwwWWk.','.kwwWwwwwwwwwWk.','kwWwsssskccccWWk','kwWssssskcccccWk','kWsbbbbskcdccdck','kWsswesskcrrrcck','kSsssssSkcrRrcck','.ksSsssSkccccck.','.ksSssSskcdccck.','.kSssmmmkggggck.','.kSSsssskccccCk.','..kSSSsskcccCk..','...kkSSSkCCkk...','.....kkkkkk.....'],
 {k:K,w:'#f0f0f4',W:'#b0b0bc',s:'#e6b48e',S:'#c48e68',b:'#3a343e',e:'#241c20',m:'#8a4840',c:'#aab2c0',C:'#6a7280',d:'#3a4050',r:'#ff3030',R:'#ffd8d8',g:'#2a2a34'},{skin:'#8a92a0',top:'#24304c',arm:'#24304c',fore:'#8a92a0',pant:'#24304c',shin:'#5a6272',shoe:'#2a2a34'});
const TRUMP=mkX('trump',['...kkkkkkkkkk...','.kkyyyyyyyyyykk.','kyyyYyyyyyyYyyyk','kyYyyyyyyyyyyYyk','kyyyyyyyyyssssyk','kyysssssssssssyk','kysbbbssssbbbsyk','kswwessssswwessk','kssssssSSsssssSk','.ksSsssSSsssSsk.','.kssssmmmmssssk.','.kSsssmttmsssSk.','.kSSssssssssSSk.','..kSSSssssSSSk..','...kkSSSSSSkk...','.....kkkkkk.....'],
 {k:K,y:'#f0c040',Y:'#d89820',s:'#f0a868',S:'#d08848',b:'#e8c060',w:'#fce0c0',e:'#3060a0',m:'#b05040',t:'#ffffff'},{skin:'#f0a868',top:'#1c2440',arm:'#1c2440',fore:'#1c2440',pant:'#1c2440',shin:'#1c2440',shoe:'#121216'});
OUT.trump={torso:[6.4,7,7.4,7.2],suit:1,bulk:1.15,tie:'#d82020',tieLen:.2};
/* what the two of them say while the city comes down: [Ben Gvir, Trump]. Ben Gvir's lines are things he has really said, in English
   as reported (Sheikh Jarrah, Oct 2022: "We're the landlords here, remember that"; Temple Mount visit: "We are in charge here").
   Trump's line is invented and Will likes it: keep. */
const GVIRQ=["WE'RE THE LANDLORDS HERE. REMEMBER THAT.","WE ARE IN CHARGE HERE."],WARQ=[GVIRQ[0],"BEAUTIFUL. WE'LL BUILD A RESORT."];
OUT.gvir={torso:[6.2,6.8,7,6.8],bulk:1.15};OUT.fenty={torso:[5.8,6,6.6,6.6],suit:1,cyb:1,bulk:1.1};
const drawX=(c,x,y,P,sc)=>{g.save();g.translate(Math.round(x),Math.round(y));g.scale(sc,sc);rig(c,P,{});g.restore()};
/* the droid: bolt upright, forearms level, a stiff two-frame march and a servo twitch */
const foldP=t=>{const st=((t*3)|0)%2,tw_=((t*9)|0)%5===0?1:0;return p(st?1:0,19.4,0,st?-4:-7,st?2:0,st?9:6,st?0:2,6,-7+tw_,9,-7-tw_)};
const BETQ=["I DON'T GAMBLE, BRO. I INVEST.","TWELVE LEGS. I'VE GOT A GUY FOR EACH.","THE HOUSE ALWAYS WINS. I'M THE HOUSE.","BRO. YOUR WHOLE CAREER IS THE UNDER."];
function startThrow(f){const o=f.o;set(f,'throw');f.vx=0;f.did=0;o.vx=0;o.mv=null;set(o,'thrown');sfx.wh();}

/* ---------- control: shared by player and cpu ---------- */
function ctl(f,dt){const I=f.I,o=f.o,c=f.c;f.t+=dt;if(f.hide&&f.st!=='cast'&&f.st!=='super'&&f.st!=='fin'&&!f.rideE)f.hide=0;if(f.landT>0)f.landT-=dt;if(f.cd>0)f.cd-=dt;if(f.inv>0)f.inv-=dt;if(f.comboT>0)f.comboT-=dt;if(f.say&&(f.say[1]-=dt)<=0)f.say=null;if(f.rank&&(f.rank[1]-=dt)<=0)f.rank=null;
 const neutral=f.st==='idle'||f.st==='walk'||f.st==='crouch';
 if(neutral)f.face=o.x>=f.x?1:-1;
 const fw=f.face>0?I.r:I.l,bk=f.face>0?I.l:I.r;f.bk=bk;
 if(I.pa){f.la=G.t;f.buf=.2}if(I.pb)f.lb=G.t;if(f.buf>0)f.buf-=dt;
 let dsh=0;if(fw&&!f.pfw){if(G.t-(f.tfw||-9)<.26)dsh=1;f.tfw=G.t}if(bk&&!f.pbk){if(G.t-(f.tbk||-9)<.26)dsh=-1;f.tbk=G.t}f.pfw=fw;f.pbk=bk;
 if(G.phase==='finish'&&f===G.win&&o.st==='dizzy'&&(I.ps||I.px||I.py)&&f.y===0&&(neutral||f.st==='cast')){f.wantFin=1;return}
 const supIn=f.meter>=(c.su1?50:100)&&G.phase==='go'&&I.ps;
 if(supIn&&f.y===0&&(neutral||(f.st==='atk'&&f.at<.15))){startSuper(f);return}
 switch(f.st){
 case'idle':case'walk':case'crouch':
  f.cr=I.d?1:0;
  if((I.px||I.py)&&f.cd<=0){startSpecial(f,I.py?2:1);break}
  if(dsh&&!f.cpu&&!I.d&&!I.u&&!I.pa&&!I.pb){set(f,'dash');f.dd=dsh;f.vx=f.face*dsh*(dsh>0?250:215);snd(260,.05,420,'square',.03);break}
  if(I.d){f.vx=0;if(f.st!=='crouch')set(f,'crouch');if(I.pa)atk(f,'up');else if(I.pb)atk(f,'sw');break}
  if(I.u){f.vy=JV;f.vx=fw?f.face*c.spd*1.6:bk?-f.face*c.spd*1.35:0;set(f,'jump');f.y=.01;snd(300,.06,520,'square',.03);break}
  if(I.pa){if(fw&&Math.abs(o.x-f.x)<30&&o.y===0&&(o.st==='idle'||o.st==='walk'||o.st==='crouch'||o.st==='blk'))startThrow(f);else atk(f,'p1');break}
  if(I.pb){atk(f,fw&&c.mv.fk.own?'fk':'k');break}
  if(fw){f.vx=f.face*c.spd*WS;if(f.st!=='walk')set(f,'walk')}else if(bk){f.vx=-f.face*c.spd*.8*WS;if(f.st!=='walk')set(f,'walk')}else{f.vx=0;if(f.st!=='idle')set(f,'idle')}
  break;
 case'jump':f.vy-=grv()*(f.vy<0?1.15:1)*dt;f.y+=f.vy*dt;
  if(f.mv){f.at+=dt;strikeMv(f)}else if(I.pa||I.pb){f.mv=c.mv[I.pa?'jp':'jk'];f.at=0;f.did=0;f.con=0;sfx.wh()}
  if(f.y<=0){f.y=0;f.vy=0;f.vx=0;f.mv=null;set(f,'idle');f.landT=.07;dust(f.x,4);snd(110,.06,60,'sine',.15)}break;
 case'atk':{const m=f.mv;f.at+=dt;f.vx*=Math.exp(-10*dt);strikeMv(f);
  if(m.key==='up'&&f.con&&f.at>m.su+m.ac*.5&&I.u){f.mv=null;f.vy=JV*1.1;f.vx=f.face*c.spd*1.3;set(f,'jump');f.y=.01;f.jc=1;snd(420,.06,700,'square',.03);break} // ALT: launcher jump-cancel on hit
  if(m.nx&&f.con&&f.buf>0&&f.at>m.su+m.ac){atk(f,m.nx);break}
  if(f.at>=m.su+m.ac+m.rc){f.mv=null;set(f,m.cr&&I.d?'crouch':'idle')}break}
 case'dash':if(f.t>.07){if(I.pa){atk(f,'p1');break}if(I.pb){atk(f,'k');break}if((I.px||I.py)&&f.cd<=0){startSpecial(f,I.py?2:1);break}}if(f.t>.2){f.vx=0;set(f,'idle')}break;
 case'hit':f.vx*=Math.exp(-9*dt);if(f.daze>0)f.daze-=dt;if(f.t>=f.stun){f.daze=0;set(f,'idle')}break;
 case'blk':f.vx*=Math.exp(-9*dt);if(f.t>=f.stun)set(f,f.cr?'crouch':'idle');break;
 case'knock':f.vy-=grv()*dt;f.y+=f.vy*dt;
  if(f.y<=0&&f.vy<0){f.y=0;dust(f.x,10);if(!f.bnc&&f.vy<-285){f.bnc=1;f.vy=-f.vy*.3;f.vx*=.5;f.y=.01;sfx.thud();G.shake=Math.max(G.shake,.16);G.sa=3}else{f.vx=0;f.vy=0;sfx.thud();set(f,f.hp<=0?'ko':'down')}}break;
 case'down':f.vx=0;if(f.t>.42)set(f,'getup');break;
 case'getup':if(f.t>.22){f.inv=.25;f.jug=0;set(f,'idle')}break;
 case'cast':castUpd(f,dt);break;
 case'super':superUpd(f);break;
 case'throw':o.x=cl(f.x+f.face*18,12,SW-12);o.y=6;
  if(f.t>=.22&&!f.did){f.did=1;o.st='idle';o.y=0;tryHit(f,o,{x0:o.x-9,x1:o.x+9,y0:0,y1:55},{d:10,la:[170,200],l:'m',unb:1,big:1,thr:1},f.face)}
  if(f.t>=.5)set(f,'idle');break;
 case'thrown':if(o.st!=='throw'){f.y=0;set(f,'idle')}break;
 case'dizzy':case'win':case'ko':case'fin':f.vx=0;break;}
}
function readKeys(f){const I=f.I;I.l=keys.left;I.r=keys.right;I.u=keys.up;I.d=keys.down;I.pa=pressed('a');I.pb=pressed('b');I.px=pressed('x');I.py=pressed('y');I.ps=pressed('sel');}
function zero(f){const I=f.I;for(const k in I)I[k]=0;}
/* ---------- cpu ---------- */
function ai(f,dt){const I=f.I,o=f.o,lv=aiLv(),d=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=f.face>0?'l':'r';
 I.pa=I.pb=I.ps=I.px=I.py=0;f.ait-=dt;const spx=()=>{I[Math.random()<.5?'px':'py']=1};
 if(G.phase==='finish'){I.l=I.r=I.u=I.d=0;if(G.pT>.9&&f.ait<=0){f.ait=.3;if(Math.random()<.5)I.ps=1;else if(d>26)I[fw]=1;else I.pa=1}return}
 const incoming=G.fx.some(e=>e.o===o&&e.mv&&e.delay<=0&&e.hits>0&&Math.abs(e.x-f.x)<e.w+46&&(e.k!=='thumb'||e.y<150));
 const threat=(o.st==='atk'&&d<50&&o.at<o.mv.su+o.mv.ac)||(o.st==='jump'&&o.mv&&d<40)||(o.st==='cast'&&d<100&&o.t<.3)||incoming;
 if(threat&&!f.aiR){f.aiR=1;const pb=[.22,.5,.82][lv];if(Math.random()<pb){f.aiB=.34;f.aiPar=Math.random()<[0,.1,.25][lv];const m=o.mv;f.aiLow=m&&m.l==='l'?Math.random()<[.3,.6,.9][lv]:m&&m.l==='o'?0:(Math.random()<.15?1:0);
   const baby=G.fx.find(e=>e.o===o&&e.k==='baby');if(baby&&Math.random()<[.3,.6,.9][lv])f.aiLow=1}}
 if(!threat)f.aiR=0;
 if(f.aiB>0){f.aiB-=dt;I.l=I.r=I.u=0;I[bk]=1;I.d=f.aiLow?1:0;return}
 if(f.st==='atk'&&f.con&&f.mv&&f.mv.nx&&f.at>f.mv.su+f.mv.ac-.02&&!f.aiC){f.aiC=1;if(Math.random()<[.35,.65,.92][lv])I.pa=1}
 if(f.st!=='atk')f.aiC=0;
 if(f.st==='atk'&&f.con&&f.mv&&f.mv.key==='up'){if(f.aiJ===undefined)f.aiJ=Math.random()<[.25,.6,.9][lv];if(f.aiJ){I.u=1;I[fw]=1}}else{f.aiJ=undefined;if(f.st==='jump'&&f.jc)I.u=0} // ALT: cpu follows its launcher up
 if(f.st==='jump'&&!f.mv&&f.vy<30&&d<52&&Math.random()<[.4,.7,.95][lv]){I.pb=1;return}
 if(f.ait>0)return;
 f.ait=[.34,.21,.12][lv]*R(.6,1.4);I.l=I.r=I.u=I.d=0;const q=Math.random(),agg=[.75,.9,1][lv];
 if(f.c.su1&&f.meter>=50&&f.meter<100&&d<150&&q<.07&&(o.st==='idle'||o.st==='walk'||o.st==='atk')){I.ps=1;return}
 if(f.meter>=100&&d<170&&q<.5&&(o.st==='idle'||o.st==='walk'||o.st==='atk'||o.st==='hit')){I.ps=1;return}
 if(o.st==='down'||o.st==='getup'||o.st==='knock'){if(d>46)I[fw]=1;else if(q<.3)I[bk]=1;return}
 if(Math.random()>agg){if(q<.5)I[bk]=1;return}
 if(d>96){if(q<.5)I[fw]=1;else if(q<.78&&f.cd<=0)spx();else if(q<.9){I[fw]=1;I.u=1}else I[fw]=1}
 else if(d>46){if(q<.42)I[fw]=1;else if(q<.56&&d<54)I.pb=1;else if(q<.7&&f.cd<=0)spx();else if(q<.84){I.u=1;I[fw]=1}else if(q<.92)I[bk]=1;else I[fw]=1}
 else{if(q<.38)I.pa=1;else if(q<.58)I.pb=1;else if(q<.68){I.d=1;I.pb=1}else if(q<.78){I.d=1;I.pa=1}else if(q<.88&&d<30){I[fw]=1;I.pa=1}else if(q<.94&&f.cd<=0)spx();else I[bk]=1}
}

/* ---------- effects / projectiles ---------- */
function fxUpd(dt){for(let i=G.fx.length-1;i>=0;i--){const e=G.fx[i],a=e.o,v=a.o;
  if(e.delay>0){e.delay-=dt;if(e.delay>0)continue;if(e.track)e.x=cl(v.x+R(-14,14),14,SW-14);if(e.k==='thumb')e.vy=-560;if(e.k==='boom'){sfx.hit(1);G.shake=Math.max(G.shake,.15)}if(e.k==='sprout')snd(700+e.n*80,.05);if(e.k==='geyser'){noise(.25,.35,1500);G.shake=Math.max(G.shake,.12)}}
  if(e.k==='fptruck'&&(e.cT=(e.cT||0)-dt)<=0){e.cT=.04;const d_=e.dir||1;G.pt.push({x:e.x-d_*36,y:R(12,26),vx:-d_*R(10,110),vy:R(30,130),ay:-520,t:R(.45,.85),c:'#c8d0d8',s:2,junk:(Math.random()*6)|0,rot:R(0,6)})}
  if(e.k==='dome')e.x=a.x;
  if(e.mv&&e.hits>0){const dm=G.fx.find(q=>q.k==='dome'&&q.o!==e.o);if(dm&&Math.abs(e.x-dm.x)<36&&e.y<70&&!['judge','wind','boom','geyser','laser','redline','suit','sprout','bike'].includes(e.k)){e.hits=0;e.life=0;spark(e.x,e.y+4,'#a0e0ff',8,90);snd(1500,.05,600,'square',.04)}} // ALT: Iron Dome eats projectiles
  if(e.k==='judge'){e.x=v.x;if(e.hits>0&&e.re<=.02)G.shake=Math.max(G.shake,.1)}
  e.t+=dt;e.vy+=e.ay*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.life-=dt;e.re-=dt;
  if(e.k==='thumb'&&e.y<=0&&e.vy<0){e.y=0;e.vy=0;e.life=.3;G.shake=Math.max(G.shake,.2);sfx.thud();if(e.hits>0){const res=tryHit(a,v,{x0:e.x-e.w,x1:e.x+e.w,y0:0,y1:40},e.mv,a.face);e.hits=0}}
  if(e.k==='word'&&e.y<=0){e.life=0;spark(e.x,4,e.col,5,60)}
  if(e.k==='bottle'&&e.y<=0){e.life=0;spark(e.x,3,'#ffffff',6,70)}
  if(e.mv&&e.hits>0&&e.re<=0&&e.k!=='thumb'){const res=tryHit(a,v,{x0:e.x-e.w,x1:e.x+e.w,y0:e.y,y1:e.y+e.h},e.mv,e.dir||(e.vx>0?1:e.vx<0?-1:a.face));
   if(res){if(e.k==='fptruck'){e.say='ON TIME. EVERY TIME.';G.shake=.3;G.sa=4;sfx.thud()}if(e.k==='yukon'){e.say='MOTHERFUCKER!!!';G.shake=.3;G.sa=4;sfx.thud()}e.hits--;e.re=e.rehit||.3;if(e.hits<=0&&!e.pass){e.life=0;spark(e.x,e.y+4,e.k==='bullet'?'#f8a030':e.k==='heart'?'#f85888':'#f8e060',6,70)}}}
  if(e.k==='thumb'&&e.vy<0&&e.hits>0){const res=tryHit(a,v,{x0:e.x-e.w,x1:e.x+e.w,y0:e.y,y1:e.y+e.h},e.mv,a.face);if(res)e.hits=0}
  if(e.life<=0||e.x<-120||e.x>SW+120)G.fx.splice(i,1);}
 for(let i=G.pt.length-1;i>=0;i--){const q=G.pt[i];q.t-=dt;q.vy+=(q.ay||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0)G.pt.splice(i,1)}}
function fxDraw(e){if(e.delay>0){if(e.k==='thumb'){const x=Math.round(e.x-cam);if(((G.t*12)|0)%2)r('rgba(0,0,0,.35)',x-12,F-1,24,3);text('!',x-2,F-60,3,'#f85040')}return}
 const x=Math.round(e.x-cam),y=F-Math.round(e.y),t=e.t,d=e.dir||(e.vx>=0?1:-1);
 switch(e.k){
 case'cloud':{const a=Math.min(1,e.life/.5);for(let k=0;k<6;k++){const px=x+Math.round(Math.sin(k*2.1+t*2)*8),py=y-8-k*5-Math.round(t*4);disc(px,py,6+(k%3)*2,'rgba(200,200,214,'+(.75*a)+')');disc(px-2,py-2,3,'rgba(240,240,250,'+(.8*a)+')')}break}
 case'geyser':{const k=t/.42,hg=Math.round(Math.min(64,t*520));r('#6a6a74',x-9,y-4,18,4);r('#9a9aa4',x-9,y-4,18,1);r('#2860c8',x-6,y-4-hg,12,hg);r('#78b8ff',x-4,y-4-hg,8,hg);r('#e0f4ff',x-1,y-4-hg,2,hg);for(let i=0;i<5;i++)disc(x+Math.round(Math.sin(i*1.7+t*20)*7),y-4-hg+Math.round(Math.cos(i*2.3)*3),2+(i%2),k<.8?'#e0f4ff':'#a8d8ff');break}
 case'toilet':{r(K,x-12,y-36,22,18);r('#e8e8f0',x-11,y-35,20,16);r('#c8c8d4',x-11,y-22,20,2);r(K,x-14,y-20,28,20);r('#f4f4f8',x-13,y-19,26,18);r('#60b8f8',x-10,y-19,20,3);r('#d0d0dc',x-6,y-3,12,3);break}
 case'judge':break;
 case'cup':r(K,x-4,y-10,8,11);r('#f4f4f4',x-3,y-9,6,9);r('#8a5a34',x-3,y-7,6,4);r('#d8d8d8',x-4,y-10,8,2);r('rgba(138,90,52,.5)',x-d*9,y-6,5,2);break;
 case'heart':heart(x,y-5,K,1.34);heart(x,y-5,((t*10)|0)%2?'#f85888':'#ff90b0');r('#ffffff',x-2,y-7,1,1);break;
 case'bullet':r(K,x-5,y-4,10,4);r('#f8d030',x-4,y-3,8,2);r('#fff8c0',x+d*2-1,y-3,3,2);r('rgba(248,160,48,.6)',x-d*12-3,y-3,7,1);break;
 case'laser':{const x0=Math.round(e.o.x-cam)+d*26,L=220,yy=y-6,fl=((t*40)|0)%2,x1=d>0?x0:x0-L;r('rgba(64,120,255,.35)',x1,yy-8,L,16);r('#3878f0',x1,yy-5,L,10);r(fl?'#a8d8ff':'#78b8ff',x1,yy-3,L,6);r('#ffffff',x1,yy-1,L,2);disc(x0,yy,8,'#a8d8ff');disc(x0,yy,5,'#ffffff');
  for(let i=0;i<12;i++){const sx=x0+d*((i*37+t*500)%L),sy=yy+((i*13)%17)-8;r(i%3?'#f8e060':'#ffffff',sx,sy,2,2);if(i%4===0){r('#f8e060',sx-2,sy,6,2);r('#f8e060',sx,sy-2,2,6)}}break}
 case'pew':r('#fff8c0',x-5,y-3,10,2);r('#f8d030',x-d*9,y-3,6,2);r('#f8a030',x-d*14,y-3,4,1);break;
 case'bottle':{const s=((t*10)|0)%2;r(K,x-3,y-10,6,10);r('#f8f8f8',x-2,y-9,4,8);r('#e8d8c0',x-2,y-(s?5:7),4,3);r('#f0a0b8',x-2,y-10,4,2);break}
 case'thumb':{r('rgba(0,0,0,.3)',x-12,F-1,24,3);r(K,x-13,y-36,26,22);r('#e8c098',x-12,y-35,24,20);for(let i=0;i<3;i++)r('#c8a078',x-12,y-30+i*5,24,1);r(K,x-5,y-15,10,15);r('#e8c098',x-4,y-15,8,14);r('#f8e0c8',x-3,y-4,6,2);r('#34466e',x-13,y-44,26,8);r('#5878b4',x-13,y-41,26,1);break}
 case'bush':{const sh_=e.o.hide?Math.round(Math.sin(t*40)):0;r(K,x-13+sh_,y-17,26,17);r('#2c7a38',x-12+sh_,y-16,24,16);r('#48a050',x-10+sh_,y-15,8,6);r('#48a050',x+2+sh_,y-13,8,6);r('#2c7a38',x-6+sh_,y-20,12,5);r(K,x-7+sh_,y-21,14,1);
  if(e.o.hide){const v_=e.o.o,n_=Math.min(3,1+((t-.22)/.2|0));if(t>.22){const s_='1... 2... 3...'.slice(0,n_*5),vx=Math.round(v_.x-cam),tx_=cl(vx-12,4,W-4-tw('1... 2... 3...',2));text(s_,tx_,F-Math.round(v_.y)-84,2,'#ffffff')}}break}
 case'fptruck':{g.save();g.translate(x,y);g.scale(d,1);const bob=((G.t*14)|0)%2;
  B(K,-40,6+bob,66,36);B(FP.paint,-39,7+bob,64,34);B('#d8d8d4',-39,7+bob,64,4);B(FP.main,-39,15+bob,64,7);B(FP.lite,-39,21+bob,64,1);B('#ffffff',-39,38+bob,64,2);
  B(K,26,6+bob,17,26);B(FP.paint,26,7+bob,16,24);B(K,28,19+bob,13,12);B('#1c2430',29,20+bob,11,10);B('#46586a',29,27+bob,11,2);B(FP.main,26,12+bob,16,4);
  B(K,31,21+bob,7,9);B('#e8b890',32,21+bob,5,6);B('#3a2a20',32,21+bob,5,2);B('#101018',32,24+bob,5,2);B(FP.main,31,27+bob,7,3);B(FP.lite,34,27+bob,4,1);
  B('#fff4c0',41,10+bob,2,4);B('#e02020',-40,10+bob,2,6);B(K,-41,8+bob,3,30);B('#3a3a44',-40,9+bob,1,28);B('#a8a8b0',-39,6+bob,82,1);
  {const lx=-26,ly=27+bob;disc(lx,-ly,5,'#ffffff');disc(lx,-ly,4,FP.main);B('#ffffff',lx-1,ly-2,2,4);B('#ffffff',lx-2,ly-2,4,2)}
  for(const wx of[-24,30]){disc(wx,-7,9,K);disc(wx,-7,7,'#2a2a30');disc(wx,-7,3,'#b8b8c0')}
  for(let i=0;i<3;i++)B('rgba(200,200,210,.5)',-48-i*7-((G.t*60)|0)%6,3+i*2,5,3);
  g.restore();mtext('FLOW PROS',x+d*-2,y-37-bob,1,FP.dark,null);
  if(e.say){const w=tw(e.say,1),bx=cl(x-w/2,2,W-w-8),by=y-62;r(K,bx,by,w+6,13);r('#ffffff',bx+1,by+1,w+4,11);text(e.say,bx+3,by+1,1,'#201828',null)}break}
 case'yukon':{g.save();g.translate(x,y);g.scale(d,1);
  B(K,-38,7,76,21);B('#f4f4f0',-37,8,74,19);B('#cfd0cc',-37,8,74,5);B('#ffffff',-37,24,74,2);B('#9a9a98',-37,13,74,1);
  B(K,-31,27,60,14);B('#f4f4f0',-30,28,58,12);B('#1c2430',-28,29,17,9);B('#1c2430',-9,29,17,9);B('#1c2430',10,29,16,9);B('#46586a',-27,36,15,2);
  g.drawImage(CH[cix('mama')].headL,-26,-44);B('#1c2430',-28,29,17,2);
  B('#e02020',34,13,3,10);B(((G.t*8)|0)%2?'#ffffff':'#fff4c0',34,18,3,3);B('#fff4c0',-38,16,3,4);B('#a8a8b0',-38,10,2,5);B(K,-27,41,52,2);B('#a8a8b0',-25,42,48,1);
  for(const wx of[-23,23]){disc(wx,-8,9,K);disc(wx,-8,7,'#2a2a30');disc(wx,-8,3,'#b8b8c0');B('#d0d0d4',wx-1,7,2,1)}
  if(((G.t*20)|0)%2)B('rgba(200,200,200,.6)',38,4,4,3);g.restore();
  if(e.say){const s_=e.say,w=tw(s_,1),bx=Math.round(x-w/2-3),by=y-64;r(K,bx,by,w+6,13);r('#ffffff',bx+1,by+1,w+4,11);r('#ffffff',x-1,by+12,3,3);text(s_,bx+3,by+1,1,s_[0]==='M'&&s_.length>14?'#c01818':'#201828',null)}break}
 case'lane':{const b=e.bike,bx=b&&G.fx.includes(b)?b.x:e.bx||e.x;e.bx=bx;const x0=Math.round(e.x0-cam),x1=Math.round(bx-cam),lo=Math.min(x0,x1),hi=Math.max(x0,x1);g.globalAlpha=Math.min(1,e.life*2);r('#2e8a40',lo,F+3,hi-lo,8);r('#58c068',lo,F+3,hi-lo,1);for(let q=lo;q<hi;q+=8)r('#f4f4f4',q,F+11,4,1);for(let q=Math.ceil((e.x0-cam-lo)%40);q<hi-lo;q+=40){const px=lo+q;r('#f4f4f4',px,F+6,3,3);r('#f4f4f4',px+7,F+6,3,3);r('#f4f4f4',px+2,F+5,6,1)}g.globalAlpha=1;break}
 case'redline':{const x0=Math.round(e.x0-cam),a_=Math.min(1,e.life*4);g.globalAlpha=a_;const lo=Math.min(x0,x),hi=Math.max(x0,x);r('rgba(255,60,60,.35)',lo,F-6,hi-lo,9);r('#e01828',lo,F-4,hi-lo,4);r('#ff8080',lo,F-4,hi-lo,1);r('#ffffff',x-1,F-6,3,8);g.globalAlpha=1;break}
 case'dome':{const a_=Math.min(1,e.life*3);g.globalAlpha=.85*a_;for(let i=0;i<=40;i++){const th=PI*i/40,rr=30;r(i%5?'#a0e0ff':'#ffffff',Math.round(x+Math.cos(th)*rr),Math.round(y-Math.sin(th)*rr*1.1),2,2)}for(let i=1;i<4;i++){const th=PI*i/4;r('rgba(160,224,255,.35)',Math.round(x+Math.cos(th)*30)-1,Math.round(y-Math.sin(th)*33),3,Math.round(Math.sin(th)*33))}for(let i=0;i<3;i++){const k=((t*3+i/3)%1);r('#ffffff',x-14+i*14,Math.round(y-36-k*60),1,6);r('#f8e060',x-14+i*14,Math.round(y-30-k*60),1,2)}g.globalAlpha=1;break}
 case'suit':{const b=((t*14+e.n)|0)%2,ti=['#c02030','#3a6ad0','#f0c020','#2a8a48','#8a3ab0'][e.n%5],sk=['#e6b48e','#d8a070','#f0c8a0','#c89070','#e8bc98'][e.n%5],hr=['#3a2c24','#9a9aa0','#2a2020','#6a5040','#1c1c1c'][e.n%5];g.save();g.translate(x,y);g.scale(d*1.5,1.5);
  B(K,-4,0,4,10);B(K,1,0,4,10);B('#1c2438',-3+(b?1:0),1,2,8);B('#1c2438',2-(b?1:0),1,2,8);B(K,-5,9,11,12);B('#24304c',-4,10,9,10);B('#f4f4f4',-1,15,3,5);B(ti,0,12,1,7);
  B(K,-4,20,9,9);B(sk,-3,21,7,7);B(hr,-3,26,7,2);B(K,2,23,1,2);B(K,5,4,7,7);B('#6a4424',6,5,5,5);B('#c8a040',8,10,1,1);g.restore();break}
 case'bike':{const wb=11,sp=t*14;for(const s of[-1,1]){const wx=x+s*wb;ring(wx,y-8,8,'#16161c');ring(wx,y-8,7,'#16161c');for(let k=0;k<4;k++){const a=sp+k*PI/2;r('#c0c0c8',Math.round(wx+Math.cos(a)*4),Math.round(y-8+Math.sin(a)*4),1,1)}r('#888890',wx,y-8,1,1)}
  g.save();g.translate(x,y);g.scale(d,1);{const a=t*18,ped=ph=>[(1+4*Math.cos(a+ph))/BS,(8+4*Math.sin(a+ph)-2)/BS];const bf=ped(PI),ff=ped(0);rig(CH[0],p(-2.4,17.6,.32,bf[0],bf[1],ff[0],ff[1],6,-10,6.5,-11,1,0),{})}
  seg(-11,8,-2,18,2,'#f4f4f4');seg(-2,18,8,18,2,'#f4f4f4');seg(-2,18,1,8,2,'#f4f4f4');seg(8,18,1,8,2,'#f4f4f4');seg(8,18,11,8,2,'#f4f4f4');seg(-11,8,1,8,1,'#f4f4f4');seg(8,18,9,23,1,'#16161c');B('#16161c',6,23,6,2);B('#16161c',-6,20,7,2);seg(-2,18,-3,21,1,'#16161c');B('#16161c',-16,16,8,1);B(K,10,15,12,9);B('#a87038',11,16,10,7);B('#c89050',11,22,10,1);for(let i=0;i<3;i++)B('#7a5028',13+i*3,16,1,6);g.drawImage(CH[2].head,9,-37);g.restore();
  for(let k=0;k<3;k++)r('rgba(255,255,255,.5)',x-d*(22+k*9),y-6-k*7,8,1);break}
 case'sprout':{const c=['#f07830','#48a0f0','#f0d020','#98a0b0','#58c048','#f078c0'][e.n%6],b=Math.abs(Math.sin(t*14+e.n))*4;r(K,x-4,y-9-b,8,9);r(c,x-3,y-8-b,6,7);r(K,x-2+(d>0?1:0),y-6-b,1,2);r(K,x+(d>0?2:1),y-6-b,1,2);r('#2c6030',x,y-11-b,1,2);r('#f8a0c8',x-1,y-14-b,3,3);r('#f8d040',x,y-13-b,1,1);break}
 case'word':text(e.s,Math.round(x-e.w),y-12,2,e.col,K);break;
 case'boom':{const k=t/.32,rad=Math.round(6+k*16);disc(x,y-10-Math.round(k*10),rad,k<.5?'#fff8c0':'#f8a030');disc(x,y-10-Math.round(k*10),Math.max(1,rad-5),k<.5?'#f8d030':'#c84818');if(k>.5)disc(x,y-12-Math.round(k*16),Math.max(1,rad-9),'#483838');break}
 case'jet':{const yy=F-e.y;for(let k=1;k<9;k++)r('rgba(255,240,220,'+(.5-k*.05)+')',x-d*(10+k*12)-5,yy-1-(k&1),10,3+(k>>2));g.save();g.translate(x,yy);g.scale(d,1);r('#2a2a34',-12,-2,24,4);r('#2a2a34',10,-1,5,2);r('#2a2a34',-8,-6,6,4);r('#2a2a34',-4,2,10,3);r('#4a4a58',2,-3,5,1);g.restore();break}
 case'wind':{const x0=Math.round(e.o.x-cam)+d*10;for(let k=0;k<14;k++){const yy=F-6-((k*37)%34),off=((t*420+k*53)%200);r('rgba(255,255,255,'+(.25+((k*7)%5)*.12)+')',x0+d*off-(d<0?16:0),yy,16+(k%3)*6,1)}mtext('PSSSHHH',x0+d*60,F-56,2,'#e0f0ff');break}
 case'finger':{g.save();g.translate(x,y);g.scale(d,1);r(K,-71,-31,118,28);r('#f0c4a0',-70,-30,116,26);r('#d8a888',-70,-8,116,4);r('#fbe0c8',-70,-30,116,3);r(K,46,-27,6,20);r('#f0c4a0',44,-26,7,18);r('#fbe6dc',36,-28,12,8);r('#c8c8d4',-30,-31,7,28);r('#eeeef6',-30,-31,7,3);for(let k=0;k<5;k++)r('rgba(240,196,160,.35)',-78-k*8,-29+k,8,24-k*2);g.restore();break}
 case'baby':{const s=((t*8)|0)%2;g.save();g.translate(x,y);g.scale(d,1);r(K,-8,-9,13,8);r('#f8c8d8',-7,-8,11,6);r('#f0a0b8',-5,-7,1,1);r('#f0a0b8',-2,-5,1,1);r('#f0a0b8',1,-7,1,1);r(K,3,-13,9,9);r('#f6d2b4',4,-12,7,7);r('#a87848',5,-13,4,2);r(K,9,-9,1,1);r('#f0a0a0',8,-7,2,1);r('#f6d2b4',s?-8:-6,-2,3,2);r('#f6d2b4',s?4:2,-2,3,2);g.restore();break}}}

/* ---------- stages ---------- */
function sky(cols,y0,y1){const n=cols.length,h=(y1-y0)/n;cols.forEach((c,i)=>{const y=Math.floor(y0+i*h);r(c,0,y,W,Math.ceil(h)+1);if(i){g.fillStyle=c;for(let x=0;x<W;x+=2)g.fillRect(x,y-1,1,1);for(let x=1;x<W;x+=4)g.fillRect(x,y-3,1,1);g.fillStyle=cols[i-1];for(let x=1;x<W;x+=2)g.fillRect(x,y,1,1);for(let x=0;x<W;x+=4)g.fillRect(x,y+2,1,1)}});}
function tree(x,b,h,rad,c1,c2,tr='#5a4030'){r(tr,x-1,b-h,3,h);disc(x,b-h,rad,c1);disc(x-(rad>>1),b-h-(rad>>1),rad>>1,c2);}
const ST=[
{n:'THE LIVING ROOM',d(t){const X=x=>Math.round(x-cam);
 r('#dcd3c4',0,0,W,F);r('#e8e1d4',0,0,W,Math.max(0,F-120));r('#c8beae',0,Math.max(0,F-120),W,1);
 let x=X(6);r('#7a746a',x,F-98,64,56);r('#141826',x+3,F-95,58,50);r('#7a746a',x+31,F-95,2,50);r('#7a746a',x+3,F-70,58,2);for(let i=0;i<7;i++)r('#d6d2ca',x+2,F-97+i*3,60,2);
 for(let i=0;i<10;i++){if(((t*2+i)|0)%3)r('#ffd870',x+7+(i*13)%52,F-66+(i*7)%19,1,1)}
 x=X(108);r('#c02838',x-22,F-7,44,6);r('#f0e8e8',x-18,F-5,36,1);r('#5a3a24',x-1,F-12,3,6);for(let y=0;y<98;y++){const w=Math.round(2+y*.36+(y%14)*.9);r(y%14<3?'#f2f6ee':(y%3?'#b4c2aa':'#9cae94'),x-w,F-108+y,w*2,1)}r('#fff4c0',x-1,F-112,3,4);r('#fff4c0',x-2,F-111,5,2);
 for(let i=0;i<46;i++){const yy=6+(i*37)%90,w=Math.round(2+yy*.36+(yy%14)*.9),xx=((i*53)%(w*2-1))-w+1;if(((t*3+i*1.7)|0)%4)r(i%3?'#ffc840':'#fff0b0',x+xx,F-108+yy,2,2)}
 x=X(160);r('#0a0a10',x,F-108,116,64);r('#161824',x+2,F-106,112,58);for(let i=0;i<8;i++){if(((t*3+i)|0)%3)r('#6a5a38',x+8+(i*11)%22,F-96+(i*17)%44,1,1)}r('rgba(255,255,255,.04)',x+60,F-106,30,58);r('#0a0a10',x+52,F-44,12,3);
 r('#4a3a2c',x-4,F-42,108,3);r('#e2d9c4',x-2,F-39,104,36);r('#bdb298',x-2,F-4,104,1);r('#cfc5ad',x+2,F-35,24,29);r('#cfc5ad',x+76,F-35,24,29);for(let i=0;i<3;i++){r('#cfc5ad',x+30,F-35+i*10,42,8);r('#3a3028',x+49,F-32+i*10,4,1)}r('#3a3028',x+22,F-22,1,3);r('#3a3028',x+79,F-22,1,3);
 x=X(282);r('rgba(90,120,255,.2)',x-16,F-72,34,72);r('rgba(120,150,255,.25)',x-6,F-72,14,72);r('#22242c',x,F-76,1,74);r('#a8c0ff',x+1,F-72,1,66);r('#22242c',x-3,F-2,8,2);
 x=X(300);for(let i=0;i<5;i++){r('#b08050',x+i*10,F-8-i*8,60,2);r('#d2cab8',x+i*10,F-6-i*8,60,6)}for(let i=0;i<5;i++){r('#201c1c',x+3+i*10,F-36-i*8,1,28)}for(let i=0;i<44;i++)r('#201c1c',x+i,F-36-Math.round(i*.8),2,2);
 r('#a8743c',0,F,W,H-F);r('#8a5c2c',0,F,W,1);for(let i=1;i<6;i++)r('#946432',0,F+i*6,W,1);for(let i=0;i<9;i++)r('#946432',X(i*44+(i%2)*20),F,1,H-F);
 x=X(56);r('#efeadc',x,F+4,224,H-F-4);r('#d8d2c2',x,F+4,224,1);for(let i=0;i<30;i++)r('#2a2a30',x+6+(i*15)%212,F+7+((i*5)%3)*6,2,2);}},
{n:'THE BACKYARD',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.5);
 sky(['#c4d4dc','#ccdadf','#d6e0e2','#e0e6e4'],0,F);
 tree(Xf(40),F-30,60,26,'#2e6a3a','#3e8048');tree(Xf(120),F-30,70,30,'#2a6034','#3a7a44');tree(Xf(215),F-30,62,28,'#30703c','#48884c');tree(Xf(275),F-30,74,24,'#2a6034','#3a7a44');
 let x=X(-10);r('#b4a888',x,F-70,60,70);for(let i=0;i<10;i++)r('#a09474',x,F-66+i*7,60,1);r('#8a7a5a',x,F-72,62,3);
 x=X(40);r('#6a4c3a',x,F-36,70,36);for(let i=0;i<70;i+=4)r('#5a3e2e',x+i,F-36,1,36);r('#7a5a46',x,F-38,70,3);for(let i=0;i<70;i+=3)r('#7a5a46',x+i,F-46+((i/3)&1)*2,2,8);
 x=X(110);r('#ece6d4',x,F-58,140,58);for(let i=0;i<8;i++)r('#d4ccb8',x,F-52+i*7,140,1);r('#f6f2e6',x,F-62,140,5);r('#8a6a5a',x-4,F-66,150,5);r('#ffffff',x+96,F-50,40,50);r('#d8d4c8',x+98,F-48,36,48);for(let i=0;i<6;i++)r('#c4c0b4',x+98,F-42+i*8,36,1);
 x=X(250);for(let i=0;i<24;i++){r('#f4f4f0',x+i*5,F-40,4,40);r('#f4f4f0',x+i*5+1,F-42,2,2)}r('#dcdcd4',x,F-30,120,2);r('#dcdcd4',x,F-12,120,2);
 x=X(132);ring(x,F-9,8,'#16161c');ring(x+24,F-9,8,'#16161c');r('#f4f4f4',x,F-10,12,1);r('#f4f4f4',x+12,F-20,1,11);r('#f4f4f4',x+12,F-20,12,1);r('#f4f4f4',x+23,F-22,1,13);r('#16161c',x+8,F-22,8,2);r('#16161c',x+21,F-24,5,1);r('#e03030',x-3,F-17,3,2);
 r('#4c9a48',0,F,W,H-F);r('#3a8440',0,F,W,2);for(let i=0;i<40;i++){const gx=X((i*47)%SW),gy=F+3+(i*13)%(H-F-3);r(i%4?'#3a8440':'#f4f4e8',gx,gy,i%4?2:1,1)}}},
{n:'THE FRONT LAWN',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.4);
 sky(['#5aa0e0','#6cacE6','#84bcec','#a4d0f2'],0,F);disc(Xf(70),F-100,9,'#ffffff');disc(Xf(84),F-98,7,'#ffffff');disc(Xf(60),F-97,6,'#ffffff');disc(Xf(230),F-112,8,'#f4f8fc');disc(Xf(244),F-110,6,'#f4f8fc');
 tree(X(10),F-10,74,24,'#4a9a3c','#68b84c');tree(X(322),F-10,70,22,'#4a9a3c','#68b84c');
 let x=X(40);r('#8a7a6a',x-4,F-78,150,30);for(let i=0;i<10;i++)r('#7a6a5c',x-4+((i*31)%140),F-76+(i%4)*7,10,2);r('#c4b898',x,F-50,70,42);for(let i=0;i<6;i++)r('#b0a484',x,F-46+i*7,70,1);
 r('#e8e2cc',x+12,F-42,34,22);r('#5a6a7a',x+14,F-40,30,18);r('#e8e2cc',x+28,F-40,2,18);r('#e8e2cc',x+7,F-42,5,22);r('#e8e2cc',x+46,F-42,5,22);
 r('#c4b898',x+70,F-84,84,76);for(let i=0;i<11;i++)r('#b0a484',x+70,F-80+i*7,84,1);for(let i=0;i<42;i++){r('#6a5a4a',x+70+i,F-84-i,2,3);r('#6a5a4a',x+153-i,F-84-i,2,3);r('#c4b898',x+72+i,F-82-i,84-2*i-2>0?84-2*i-2:0,2)}
 r('#e8e2cc',x+100,F-98,24,18);r('#5a6a7a',x+105,F-96,14,14);
 r('#b0aca0',x+74,F-52,78,44);for(let i=0;i<14;i++)r('#989488',x+76+((i*23)%70),F-50+((i*11)%40),8,3);r('#f0ead8',x+82,F-48,18,40);r('#5a6a7a',x+86,F-44,10,22);r('#e8e2cc',x+116,F-44,28,24);r('#5a6a7a',x+118,F-42,24,20);r('#e8e2cc',x+129,F-42,2,20);
 r('#909088',x+78,F-8,26,4);for(let i=0;i<8;i++)disc(x+6+i*20,F-10,5,i%2?'#2e7038':'#3a8444');
 x=X(210);r('#a84c38',x,F-60,130,54);for(let i=0;i<8;i++)r('#8e3c2c',x,F-56+i*7,130,1);r('#6a4838',x-4,F-70,140,11);r('#7e5a46',x-4,F-70,140,2);r('#f0ece4',x+16,F-46,20,18);r('#5a6a7a',x+18,F-44,16,14);r('#f4f4f0',x+60,F-44,40,38);
 r('#4c9a40',0,F-8,W,8);r('#62b050',0,F-8,W,1);r('#c8c4b8',0,F,W,H-F);r('#b0aca0',0,F,W,1);r('#a8a498',0,F+10,W,1);for(let i=0;i<6;i++)r('#a8a498',X(i*64+20),F,1,10);for(let i=0;i<30;i++)r('#bcb8ac',X((i*41)%SW),F+2+(i*7)%(H-F-2),2,1);}},
{n:'THE TRAIL',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.5),Xb=x=>Math.round(x-cam*.25);
 sky(['#dfe6e8','#e4eaea','#e8eeea'],0,F);
 r('#6e9a50',0,F-50,W,50);for(let i=0;i<5;i++){const x=Xb(20+i*70);r('#e8e4dc',x,F-64,34,16);r('#7a5a50',x-2,F-70,38,7);r('#5a6a7a',x+6,F-58,6,6);r('#5a6a7a',x+20,F-58,6,6)}
 r('#7aa858',0,F-48,W,48);r('#8a6a48',Xf(60),F-40,90,14);
 for(let i=0;i<14;i++){const x=Xf(i*31+((i*17)%11)),h=90+((i*29)%50);r(i%3?'#4a4038':'#5a5046',x,F-h,i%3?2:3,h);for(let k=0;k<5;k++){const yy=F-h+10+k*14,l=10+((i+k)*7)%12;for(let q=0;q<l;q++)r('#4a4038',x+(k%2?q:-q),yy-Math.round(q*.7),1,1);if((i+k)%2)disc(x+(k%2?l:-l),yy-Math.round(l*.7),3,'rgba(150,200,90,.7)')}}
 let x=X(0);r('#3a5a50',x,F-12,80,12);r('#587a70',x,F-12,80,2);for(let i=0;i<8;i++)r(i%2?'#a8a8a0':'#c4c4bc',x+70+((i*5)%14),F-12+i*2-2,12,3);for(let i=0;i<4;i++)r('rgba(255,255,255,.3)',x+6+((t*10+i*20)%60),F-8+i*2,8,1);
 r('#7ac050',0,F-10,W,10);for(let i=0;i<50;i++)r(i%2?'#5aa040':'#96d868',X((i*29)%SW),F-9+(i*5)%8,2,1);
 r('#6a4630',0,F,W,H-F);r('#4a3020',0,F,W,1);for(let i=0;i<60;i++)r(i%3?'#573a26':'#84603e',X((i*37)%SW),F+2+(i*11)%(H-F-2),2,1);
 for(let i=0;i<4;i++){const tx=X(30+i*90);r('#3a322c',tx,F-150,4,150);r('#4a4038',tx,F-150,1,150)}}},
{n:'THE OVERPASS',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.4);
 sky(['#5a80b8','#6a90c4','#80a4d0','#9cbadc','#bcd0e0','#dce0d0','#f4e8a8'],0,F-20);r('#f4e8a8',0,F-22,W,22);
 for(let i=0;i<4;i++){const x=Xf(40+i*70)-((t*3)|0)%4;r('#e8e0c8',x,F-74+(i%2)*6,26,3);r('#f4ecd8',x+6,F-76+(i%2)*6,14,2)}
 for(let i=0;i<7;i++)tree(Xf(i*52+8),F-28,10+((i*7)%8),7,'#1c2c20','#24382a','#1c2c20');
 const by=F-52;r('#3a3a40',0,by,W,6);r('#4a4a52',0,by,W,1);r('#2a2a30',0,by-3,W,1);for(let i=0;i<6;i++){const x=Xf(i*64+20);r('#2e2e34',x,by+6,5,28);r('#2a2a30',x-2,by+6,9,2)}
 for(let i=0;i<8;i++){const x=Xf(i*46+10);r('#22222a',x,by-22,1,22);r('#22222a',x,by-22,5,1)}
 for(let i=0;i<3;i++){const x=((t*(30+i*14)+i*120)%(W+60))-30;r('#1c1c24',i%2?W-x:x,by-9,i?10:18,6);r('#f8e060',i%2?W-x-1:x+(i?10:18),by-5,1,1)}
 r('#2c4a30',0,F-24,W,24);r('#3a5c3a',0,F-24,W,2);let x=X(214);r('#5a4a44',x,F-40,30,16);r('#4878a8',x+6,F-38,10,14);r('#3a3030',x-2,F-42,34,3);r('#22222a',x+30,F-58,1,36);r('#22222a',x+30,F-58,44,1);r('#22222a',x+74,F-58,1,36);
 x=X(80);r('#3868a8',x,F-28,30,7);
 r('#4a7a44',0,F-8,W,8);r('#427040',0,F,W,H-F);r('#35603a',0,F,W,1);for(let i=0;i<40;i++)r(i%5?'#35603a':'#d8d8b0',X((i*43)%SW),F+2+(i*7)%10,2,1);
 const ry=Math.min(H-8,F+14);r('#5a564e',0,ry,W,H-ry);for(let i=0;i<12;i++)r('#3a2c20',X(i*30)-2,ry+2,10,4);r('#b8b8c0',0,ry+1,W,2);r('#78787e',0,ry+3,W,1);}},
{n:'THE GAS STATION',d(t){const X=x=>Math.round(x-cam);
 r('#e4e6ea',0,0,W,F);for(let i=0;i<SW;i+=4)r('#d0d2d8',X(i),0,1,F);r('#c8ccd0',0,Math.max(0,F-124),W,3);
 let x=X(170);r('#a8b048',x,F-128,70,14);r('#868c30',x,F-116,70,2);
 r('#8a7a68',0,F-34,W,34);r('#6a5c4c',0,F-36,W,3);for(let j=0;j<5;j++)for(let i=0;i<14;i++){const sx=X(i*26+(j%2)*13),sy=F-33+j*7;r(['#9a8a74','#7a6a58','#a89880','#6e6050'][(i*3+j*5)%4],sx,sy,24,6)}
 x=X(40);r('#22222a',x,F-70,6,70);r('#2a2a34',x-12,F-96,30,28);r('#c84818',x-9,F-92,24,8);text('AIR',x-7,F-93,1,'#ffe8c0',null);for(let i=0;i<4;i++)r('#50505c',x-8,F-80+i*3,22,1);
 for(let i=0;i<10;i++)r('#16161c',x-16-(i%2)*3,F-64+i*4,3,5);r('#16161c',x-16,F-24,2,22);for(let i=0;i<30;i++)r('#16161c',x-14+i,F-3+Math.round(Math.sin(i*.5)*1),2,1);r('#22222a',x-8,F-4,22,4);
 x=X(250);r('#3a6a34',x,F-22,3,22);for(let i=0;i<6;i++){const a=i-2.5;for(let q=0;q<14;q++)r(i%2?'#3a7a3a':'#2e6030',x+1+Math.round(a*q*.5),F-22-q+Math.round(Math.abs(a)*q*.25),2,1)}
 x=X(-30);r('#5a564e',x,F-60,50,60);r('#48443c',x+46,F-60,4,60);
 r('#c4c0b4',0,F,W,H-F);r('#a8a498',0,F,W,1);for(let i=0;i<6;i++)r('#a8a498',X(i*70+10),F,1,12);r('#e0c020',0,Math.min(H-9,F+12),W,4);r('#b89818',0,Math.min(H-9,F+12)+4,W,1);r('#58544c',0,Math.min(H-9,F+12)+5,W,30);}},
{n:'THE FITTING ROOMS',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.5);
 r('#f0eee8',0,0,W,F);const cy=Math.max(0,F-112);r('#dcdad2',0,0,W,cy);for(let i=0;i<9;i++){const x=Xf(i*44);r('#c4c2ba',x,0,1,cy);r('#ffffff',x+8,Math.max(0,cy-10),26,5)}for(let j=0;j<4;j++)r('#c4c2ba',0,cy-j*12,W,1);
 let x=Xf(10);r('#e4e0d8',x,F-104,92,60);text('Fitting Rooms',x+8,F-98,1,'#8a8478',null);r('#c8c4bc',x,F-80,92,1);r('#b8b0a4',x+8,F-72,24,72);r('#b8b0a4',x+54,F-72,24,72);r('#8a8478',x+10,F-70,20,70);r('#8a8478',x+56,F-70,20,70);
 x=Xf(200);r('#2e8a48',x,F-104,30,34);r('#f4f4e8',x+4,F-100,22,8);text('5',x+10,F-92,3,'#f4f4e8',null);r('#e0e0e0',x+14,F-112,1,8);
 x=Xf(290);r('#22a050',x,F-100,26,12);text('EXIT',x+2,F-100,1,'#ffffff',null);
 for(let k=0;k<4;k++){const rx=X(20+k*84),cols=k%2?['#22222a','#f4f4f4','#3a4a6a','#22222a','#8a8a94']:['#d8b0c0','#f4f4f4','#a8c0d8','#e0d0e8','#c8a0b0'];r('#b8b8c0',rx,F-52,60,2);r('#b8b8c0',rx+2,F-52,2,52);r('#b8b8c0',rx+56,F-52,2,52);for(let i=0;i<13;i++){const c=cols[(i+k)%5];r('#888890',rx+5+i*4,F-51,1,3);r(c,rx+4+i*4,F-48,3,24+((i*7+k)%3)*3);r(shade(c.length===7?c:'#888888',.8),rx+6+i*4,F-48,1,24)}}
 r('#b0aca4',0,F,W,H-F);r('#98948c',0,F,W,1);for(let i=0;i<9;i++)r('#a4a098',X(i*40),F,1,H-F);r('#a4a098',0,F+12,W,1);r('rgba(255,255,255,.15)',0,F+2,W,3);}},
{n:'THE ROOFTOP',d(t){const X=x=>Math.round(x-cam),Xf=x=>Math.round(x-cam*.3);
 sky(['#5a4a80','#6c5088','#84588c','#a0608c','#c06c80','#e08468','#f0a060','#f8c070'],0,F);
 for(let i=0;i<5;i++){const x=Xf(20+i*66);r('rgba(240,170,150,.5)',x,F-96+(i%3)*14,40,3);r('rgba(250,190,160,.4)',x+8,F-99+(i%3)*14,22,3)}
 for(let j=0;j<2;j++){const x=((t*(34+j*10)+j*150)%(W+160))-80,jx=j?W-x:x,d=j?-1:1,y=F-104+j*22;for(let k=1;k<12;k++)r('rgba(255,235,215,'+(.55-k*.045)+')',jx-d*(8+k*11)-5,y-1+(k>>1),11,2+(k>>2));r('#2a2630',jx-9,y-1,18,3);r('#2a2630',jx-d*6-2,y-5,5,4);r('#2a2630',jx-3,y+2,8,2)}
 for(let i=0;i<3;i++){const x=Xf(30+i*120);for(let k=0;k<9;k++)disc(x+Math.round(Math.sin(k*.9+t*.4)*4)+k*2,F-22-k*8,4+(k>>1),'rgba(50,40,50,.55)')}
 for(let i=0;i<24;i++){const x=Xf(i*18),h=8+((i*13)%16);r('#2a2434',x,F-12-h,14,h+12);if(i%2)r('#f8d878',x+3+((i*5)%6),F-10-((i*7)%h),1,1)}
 let x=X(20);r('#2c2a34',x,F-44,120,44);r('#3a3844',x,F-44,120,2);r('#1c1a24',x+8,F-30,52,24);for(let i=0;i<8;i++)r('#34323e',x+10,F-28+i*3,48,1);r('#3a3844',x+70,F-36,40,8);for(let i=0;i<10;i++){r('#b05838',x+4+i*12,F-4-(i%3),8,2)}
 x=X(170);r('#34323e',x,F-30,90,30);r('#44424e',x,F-32,90,3);r('#22202a',x+10,F-24,30,18);ring(x+25,F-15,7,'#3a3844');r('#3a3844',x+18+((t*20)|0)%2,F-16,14,1);r('#22202a',x+56,F-56,6,26);r('#44424e',x+54,F-58,10,3);
 x=X(280);r('#2c2a34',x,F-60,56,60);r('#3a3844',x,F-62,56,3);for(let i=0;i<4;i++)r('#1c1a24',x+6+i*12,F-52,8,40);
 r('#3c3a46',0,F,W,H-F);r('#56545e',0,F,W,2);for(let i=0;i<9;i++)r('#2e2c38',X(i*42),F+2,1,H-F);for(let i=0;i<20;i++)r('#34323e',X((i*53)%SW),F+4+(i*7)%(H-F-4),6,1);}},
{n:'THE PODIUM',d(t){const X=x=>Math.round(x-cam);
 r('#101a22',0,0,W,F);r('#1a3634',0,Math.max(0,F-150),W,150);
 for(let i=0;i<12;i++){const x=X(i*34-8);r('#22444a',x,F-150,14,150);r('#b8943c',x+14,F-150,1,150)}
 {const cx=X(168);for(let a=0;a<72;a++){const th=a/72*2*PI;r(a%6?'#c8a040':'#f0d070',Math.round(cx+Math.cos(th)*36),Math.round(F-108+Math.sin(th)*36),2,2)}}
 for(const sx of[60,276]){const bx=X(sx);for(let y=0;y<F-10;y+=2){const w=Math.round(3+y*.16);r('rgba(255,240,200,.05)',bx-w,y,w*2,2)}}
 let x=X(168);r('#0c1618',x-62,F-58,124,58);r('#2a5648',x-60,F-56,120,20);r('#c8a040',x-60,F-57,120,1);r('#36685a',x-42,F-36,84,36);r('#c8a040',x-42,F-37,84,1);
 r('#101010',x-13,F-54,26,24);r('#5a3a24',x-12,F-53,24,22);r('#c8a040',x-12,F-53,24,2);r('#7a5434',x-8,F-48,16,12);r('#202020',x-1,F-62,1,9);r('#404048',x-2,F-65,3,4);
 if(((t*1.5)|0)%2)r('#f84040',x+10,F-51,1,1);
 for(let i=0;i<10;i++){const x2=X(i*38-12);r('#2a1e18',x2,F-16,30,16);r('#5a4030',x2,F-16,30,2);r('#e8e0c8',x2+10,F-13,10,3);r('#18120e',x2+3,F-27,7,11)}
 r('#24405c',0,F,W,H-F);r('#1c344c',0,F,W,1);for(let i=1;i<6;i++)r('#203a54',0,F+i*6,W,1);for(let i=0;i<9;i++)r('#2c4c6c',X(i*42+10),F+2,1,H-F);}}];

/* ---------- music: tiny chiptune sequencer ---------- */
const N=n=>440*Math.pow(2,(n-69)/12);
const SONG={
 fight:{bpm:148,bass:[45,45,57,45,45,57,45,55,41,41,53,41,41,53,41,52,43,43,55,43,43,55,43,50,40,40,52,40,40,52,44,47],
  lead:[76,0,76,74,76,0,81,0,79,0,76,0,74,76,0,0,77,0,77,76,77,0,81,0,84,0,81,0,77,0,0,0,79,0,79,77,79,0,83,0,86,0,83,0,79,0,0,0,76,0,80,0,83,0,88,0,86,0,83,0,80,0,76,0],drum:'k.h.s.h.k.k.s.hh'},
 menu:{bpm:104,bass:[45,0,52,0,45,0,52,0,41,0,48,0,41,0,48,0,36,0,43,0,36,0,43,0,43,0,50,0,43,0,47,0],
  lead:[69,72,76,81,76,72,69,72,76,81,84,81,76,72,76,0,65,69,72,77,72,69,65,69,72,77,81,77,72,69,72,0,64,67,72,76,72,67,64,67,72,76,79,76,72,67,72,0,67,71,74,79,74,71,67,71,74,79,83,79,74,71,74,0],drum:'k...h...k.h.h...'}};
const M={next:0,step:0,song:'',mg:null,nb:null};
function mnote(ac,type,f,t,d,v,f2){const o=ac.createOscillator(),ga=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);ga.gain.setValueAtTime(v,t);ga.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(ga);ga.connect(M.mg);o.start(t);o.stop(t+d+.02);}
function mnoise(ac,t,d,v,hp){if(!M.nb){const n=ac.sampleRate*.2|0;M.nb=ac.createBuffer(1,n,ac.sampleRate);const ch=M.nb.getChannelData(0);for(let i=0;i<n;i++)ch[i]=Math.random()*2-1}
 const q=ac.createBufferSource(),f=ac.createBiquadFilter(),ga=ac.createGain();q.buffer=M.nb;f.type='highpass';f.frequency.value=hp;ga.gain.setValueAtTime(v,t);ga.gain.exponentialRampToValueAtTime(.001,t+d);q.connect(f);f.connect(ga);ga.connect(M.mg);q.start(t);q.stop(t+d+.02);}
const musName=()=>(G.scr==='fight'||G.scr==='pause'||G.scr==='vs')?'fight':'menu';
/* ALT: tracks tagged 'ko-bottie' (or 'ko-<fighter id>', 'ko-stage-<n>') play in fights with that opponent / fighter / stage. Otherwise 'ko'. */
const tagId=c=>c.id==='chrome'?'bottie':c.id;
function koMus(){if(G.scr==='fight'||G.scr==='pause'||G.scr==='vs'||G.scr==='tower'){for(const tg of['ko-'+tagId(CH[G.p2]),'ko-'+tagId(CH[G.p1]),'ko-stage-'+G.stage])if(A.hasTracks(tg))return tg}return'ko'}
function musTick(){try{const ac=A.ac(),vol=A.meta().mus;if(!ac||ac.state!=='running')return;if(A.hasTracks(koMus()))return;
 if(!M.mg){M.mg=ac.createGain();M.mg.connect(ac.destination)}M.mg.gain.value=Math.pow(vol/10,2)*.5*(G.scr==='pause'?.4:1);if(!vol)return;
 const nm=musName();if(nm!==M.song){M.song=nm;M.step=0;M.next=ac.currentTime+.08}if(M.next<ac.currentTime-.2)M.next=ac.currentTime+.05;
 const s=SONG[nm],sd=60/s.bpm/4;
 while(M.next<ac.currentTime+.14){const i=M.step,t=M.next;const b=(i&1)?0:s.bass[(i>>1)%s.bass.length],l=s.lead[i%s.lead.length],dr=s.drum[i%s.drum.length];
  if(b)mnote(ac,'triangle',N(b),t,sd*1.8,.22);if(l)mnote(ac,'square',N(l),t,sd*(nm==='menu'?1.6:1.1),.05);
  if(dr==='k')mnote(ac,'sine',130,t,.11,.3,40);else if(dr==='s')mnoise(ac,t,.09,.12,1500);else if(dr==='h')mnoise(ac,t,.03,.05,6000);
  M.next+=sd;M.step++}}catch(e){}}

/* ---------- match flow ---------- */
function startMatch(){const a=mkF(G.p1,SW/2-48,1,false),b=mkF(G.p2,SW/2+48,-1,true);a.o=b;b.o=a;G.f=[a,b];G.round=1;G.scr='fight';
 G.mut=G.mode==='trial'?(G.trial.mut||{}):(G.mode==='vs'||G.mode==='train')?RULES[SV.rule||0][1]:{};G.tq=G.mode==='trial'?{combo:0,parry:0,wall:0,thr:0,sup:0,air:0,other:0,clock:0,hp:0}:null;startRound();
 if(G.mode==='surv'&&G.surv){a.hp=a.hpG=G.surv.hp}if(G.mode==='train'){b.dummy=G.dmy===2?0:G.dmy===1?2:1;G.timer=99}}
function startRound(){G.f.forEach((f,i)=>{const w=f.wins,m=f.meter;Object.assign(f,mkF(f.ci,SW/2+(i?48:-48),i?-1:1,f.cpu),{o:f.o,wins:w,meter:m})});if(MU().sd)G.f.forEach(f=>{f.hp=f.hpG=1});G.koF=0;G.fx=[];G.pt=[];G.phase='intro';G.pT=0;G.timer=60;G.said=0;G.hs=G.freeze=G.slow=0;G.fin=null;G.banner=null;G.win=null;G.zp=0;G.cine=null;cam=SW/2-W/2;Z=1;}
function buildLadder(){const rest=CH.map((c,i)=>i).filter(i=>i!==G.p1),boss=G.p1===cix('louie')?cix('will'):cix('louie');const o=rest.filter(i=>i!==boss);for(let i=o.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[o[i],o[j]]=[o[j],o[i]]}o.push(boss);G.ladder=o;G.li=0;}
function nextArcade(){G.p2=G.ladder[G.li];G.stage=CH[G.p2].stage;G.scr='tower';G.scrT=0;}
/* ALT: survival = one-round fights back to back; your health carries over (+30 after each win); the cpu sharpens every 4 wins */
function nextSurv(){const o=CH.map((c,i)=>i).filter(i=>i!==G.p1&&i!==G.p2);G.p2=pick(o);G.stage=CH[G.p2].stage;G.scr='vs';G.scrT=0;}
const aiLv=()=>G.op?2:G.mode==='trial'?G.trial.lv:G.mode==='surv'&&G.surv?Math.min(2,SV.diff+((G.surv.n/4)|0)):G.mode==='train'?Math.max(1,SV.diff):SV.diff;
function sim(dt,ctrl){const[a,b]=G.f;
 for(const f of G.f){const can=ctrl===2||(ctrl===1&&f===G.win);if(!can||f.dummy)zero(f);else if(f.cpu)ai(f,dt);else readKeys(f);ctl(f,dt)}
 for(const f of G.f){f.x+=f.vx*dt;
  /* FABLE: WALL BOUNCE. A hard launch into the edge of the stage bounces them back off it once per combo, still juggle-able. */
  if(f.st==='knock'&&!f.wb&&!f.noc&&f.y>8&&Math.abs(f.vx)>150&&(f.x<=12||f.x>=SW-12)&&(G.phase==='go'||G.phase==='ko')){const sd=f.x<=12?1:-1;f.wb=1;f.vx=sd*Math.abs(f.vx)*.42;f.vy=Math.max(f.vy,300);f.bnc=0;
   G.hs=.1;G.hv=f;G.shake=Math.max(G.shake,.22);G.sa=3;f.fl=.05;spark(f.x-sd*6,f.y+30,'#fff8c0',10,140);dust(f.x,6);word('WALL!',f.x+sd*44,f.y+56,'#f8e060');sfx.thud();noise(.08,.4,700,'lowpass');if(!f.o.cpu&&G.tq)G.tq.wall++}
  if(!f.noc)f.x=cl(f.x,12,SW-12)}
 if(a.y<24&&b.y<24&&a.st!=='thrown'&&b.st!=='thrown'&&a.st!=='throw'&&b.st!=='throw'&&!a.dash&&!b.dash&&a.st!=='fin'&&b.st!=='fin'){const dx=b.x-a.x,ad=Math.abs(dx);if(ad<18){const push=(18-ad)/2,s=dx>=0?1:-1;a.x=cl(a.x-s*push,12,SW-12);b.x=cl(b.x+s*push,12,SW-12)}}
 if(Math.abs(b.x-a.x)>214&&!a.noc&&!b.noc){const m=(a.x+b.x)/2,s=b.x>a.x?1:-1;a.x=m-s*107;b.x=m+s*107}
 fxUpd(dt);
 for(const f of G.f){const v=f.o;if(v.st!=='hit'&&v.st!=='knock'&&v.st!=='down'&&v.st!=='thrown'&&f.comboT<=0)f.combo=0;f.hpG+=(f.hp-f.hpG)*Math.min(1,dt*4)}}
function target(f){const t=f.t,S=f.c.ps;
 if(G.cine&&G.cine.kind==='has'&&f===G.cine.v&&G.cine.t>=HSB[2]&&f.st!=='knock'){const C=G.cine,since=C.t-C.last,nx=HSBHIT[C.hits]||9;return since<.09?S.self:nx-C.t<.14?S.selfw:S.dz1}
 switch(f.st){
 case'idle':{if(f.landT>0)return mix(S.st,S.cr,.55);const q=Math.floor((G.t+f.ph)*8)/8;return mix(S.st,S.st2,.5-.5*Math.cos(q*6))}
 case'walk':{const u=Math.floor(((t*3.2)%1)*8)/8;return u<.5?mix(S.st,S.w1,Math.sin(u*2*PI)):mix(S.st,S.w2,Math.sin((u-.5)*2*PI))}
 case'crouch':case'getup':return S.cr;
 case'jump':if(f.mv)return f.at<f.mv.su*.5?S.jt:S[f.mv.p];return f.vy>40?S.jr:S.jt;
 case'atk':{const m=f.mv;if(!m)return S.st;return f.at<m.su*.6?S[m.w]:f.at<m.su+m.ac+.04?S[m.p]:(m.cr?S.cr:S.st)}
 case'hit':return f.low?S.hl:S.hh;
 case'blk':return f.cr?S.cbl:S.bl;
 case'knock':case'thrown':return S.kn;
 case'down':case'ko':return S.lie;
 case'dizzy':return mix(S.dz1,S.dz2,.5+.5*Math.sin(G.t*5));
 case'win':return mix(S.win1,S.win2,.5+.5*Math.sin(G.t*9));
 case'cast':{const sp=f.spc||{};if(sp.seq){let ps='castw';for(const q of sp.seq)if(t>=q.t&&q.pose)ps=q.pose;return S[ps]}if(sp.hide)return t<.22?S.cr:t>=.82?S.p3:S.st;if(sp.dash)return f.dash||t<sp.dash.t0?S[sp.pose||'run']:S.st;return t<Math.min(.14,sp.fire*.7)?S.castw:S[sp.pose||'cast']}
 case'dash':return f.dd>0?S.dsf:S.dsb;
 case'throw':return S.thr;
 case'super':return S.sup;
 case'fin':return S[f.fp]||S.dz1;}
 return S.st;}
const SNAP={atk:1,hit:1,blk:1,dash:1,cast:1,throw:1,super:1,idle:1,walk:1,win:1,dizzy:1};
function animate(dt){for(const f of G.f){for(let i=f.tr.length-1;i>=0;i--)if((f.tr[i].t-=dt)<=0)f.tr.splice(i,1);
  if((f.dash||f.st==='dash')&&!f.hide&&(f.trT=(f.trT||0)-dt)<=0){f.trT=.03;f.tr.push({x:f.x,y:f.y,face:f.face,P:f.pose.slice(),t:.17})}
  const T=target(f),k=SNAP[f.st]?1:Math.min(1,dt*40);for(let i=0;i<T.length;i++)f.pose[i]+=(T[i]-f.pose[i])*k;
  let rt=0;if(f.st==='knock'||f.st==='thrown')rt=PI*.42;else if(f.st==='down'||f.st==='ko')rt=PI/2;else if(f.st==='getup')rt=PI/2*Math.max(0,1-f.t/.22);else if(f.st==='fin')rt=f.fr;
  f.rot+=(rt-f.rot)*Math.min(1,dt*(rt>f.rot?14:20));}}
function decide(){const[a,b]=G.f;G.win=null;if(a.hp<=0&&b.hp<=0)return;G.win=a.hp>b.hp?a:b.hp>a.hp?b:null;}
function startFinisher(w){const l=w.o;w.wantFin=0;G.phase='finisher';G.pT=0;G.fin={w,l,type:w.c.ft,st:0,fl:[]};set(w,'super');w.face=l.x>=w.x?1:-1;set(l,'fin');l.fp='dz1';l.fr=0;G.banner={s:w.c.fin,t:2.6,c:w.c,fin:1};snd(110,.6,55,'sawtooth',.1);snd(220,.5,880,'square',.04);}
function finUpd(dt){const F_=G.fin,w=F_.w,l=F_.l,t=G.pT;w.t+=dt;
 if(t>.7&&!F_.st){F_.st=1;G.shake=.3;sfx.hit(1);
  switch(F_.type){
   case'blast':l.noc=1;l.vx=w.face*380;l.vy=300;l.fp='kn';l.fr=PI*.4;word('BORK!',w.x+w.face*20,50,'#f8e060');snd(420,.3,180,'sawtooth',.12);break;
   case'rocket':l.vy=40;l.fp='win1';word('TOO MUCH CAFFEINE!',l.x,60,'#f8e060');break;
   case'squash':ent({k:'thumb',o:w,x:l.x,y:170,vy:-600,w:13,h:30,hits:0,life:2});break;
   case'sleep':l.fp='lie';l.fr=PI/2;break;
   case'photo':G.flash=.3;snd(1800,.03,0,'square',.05);set(w,'win');break;
   case'love':l.vy=22;l.fp='win1';break;
   case'flowers':l.fp='win1';break;
   case'flush':ent({k:'toilet',o:w,x:l.x,y:0,life:4});l.fp='kn';word('FLUSHED, BRO',l.x,78,'#a8d8ff');noise(1.1,.3,1200,'bandpass');break;}}
 if(F_.st){
  if(F_.type==='blast'){l.vy-=GR*.5*dt;l.x+=l.vx*dt;l.y+=l.vy*dt;l.fr+=dt*9}
  if(F_.type==='rocket'){l.vy+=700*dt;l.y+=l.vy*dt;l.x+=Math.sin(G.t*60)*1.2;if(((G.t*30)|0)%2)G.pt.push({x:l.x+R(-4,4),y:l.y,vx:R(-20,20),vy:-80,ay:0,t:.4,c:'#8a5a34',s:2})}
  if(F_.type==='squash'&&t>.95){if(l.sqz>.3){l.sqz=.22;G.shake=.3;sfx.thud()}}
  if(F_.type==='love'){l.y+=l.vy*dt;if(Math.random()<dt*14)G.pt.push({x:l.x+R(-16,16),y:l.y+R(0,44),vx:R(-8,8),vy:30,ay:0,t:1,c:'#f85888',s:0,heart:1})}
  if(F_.type==='flush'){l.fr+=dt*14;l.scl=Math.max(0,1-(t-.75)/1.1);l.y=l.scl*14;if(l.scl<=0)l.hide=1}
  if(F_.type==='flowers'&&F_.fl.length<16&&Math.random()<dt*14){F_.fl.push({dx:R(-11,11),dy:R(2,58),c:pick(['#f8a0c8','#f8d040','#a070e8','#60b8f8','#ffffff']),t:G.t});snd(R(700,1200),.04)}}
 if(t>3.4){G.phase='post';G.pT=0;G.fin.done=1;if(w.st!=='win')set(w,'win')}}
function endMatch(){const won=G.win&&!G.win.cpu;if(won)SV.w++;else SV.l++;
 if(G.mode==='trial'){const T=G.trial,q=G.tq;q.clock=Math.ceil(G.timer);q.hp=Math.round(G.f[0].hp);const ok=!!(won&&T.ok(q)),gold=ok&&(T.gold?T.gold(q):q.hp>=70);
  G.tres={ok,gold,won,was:(SV.tr||{})[T.id]||0};if(ok){SV.tr=SV.tr||{};SV.tr[T.id]=Math.max(SV.tr[T.id]||0,gold?2:1)}store();G.scr='tres';G.scrT=0;G.mi=ok?1:0;return}
 if(G.mode==='surv'&&G.surv){if(won){G.surv.n++;SV.surv=Math.max(SV.surv||0,G.surv.n);G.surv.hp=Math.min(100,Math.round(G.f[0].hp)+30);store();nextSurv();return}
  store();G.scr='res';G.scrT=0;G.mi=0;G.won=false;return}
 if(G.mode==='arc'&&won){G.li++;if(G.li>=G.ladder.length){SV.clear[CH[G.p1].id]=Math.max(SV.clear[CH[G.p1].id]||0,SV.diff+1);store();G.scr='ending';G.scrT=0;return}store();nextArcade();return}
 store();G.scr='res';G.scrT=0;G.mi=0;G.cont=9.99;G.won=won;}
function fightUpd(dt){const[a,b]=G.f;
 if(pressed('start')&&G.phase==='go'&&!G.cine){G.scr='pause';G.mi=0;sfx.ui();return}
 G.pT+=dt;if(G.koF>0)G.koF-=dt;if(G.flash>0)G.flash-=dt;if(G.zp>0)G.zp=Math.max(0,G.zp-dt*.35);for(const f of G.f)if(f.fl>0)f.fl-=dt;if(G.shake>0)G.shake-=dt;if(G.banner&&(G.banner.t-=dt)<=0)G.banner=null;
 for(let i=G.later.length-1;i>=0;i--)if((G.later[i][0]-=dt)<=0){G.later[i][1]();G.later.splice(i,1)}
 if(G.cine){cineUpd(dt);animate(dt);return}
 if(G.freeze>0){G.freeze-=dt;animate(dt);return}
 if(G.hs>0){G.hs-=dt;return}
 const sdt=dt*(G.slow>0?.3:1)*(MU().turbo&&G.phase==='go'?1.3:1);if(G.slow>0)G.slow-=dt;
 switch(G.phase){
 case'intro':if(!G.said){G.said=1;snd(392,.12);G.later.push([.14,()=>snd(523,.2)])}if(G.pT>1.0&&G.said<2){G.said=2;snd(784,.08);snd(1047,.3,0,'square',.05);noise(.2,.2,800,'lowpass')}sim(sdt,0);if(G.pT>1.5){G.phase='go';G.pT=0}break;
 case'go':sim(sdt,2);G.timer-=sdt;
  if(G.mode==='train'){G.timer=99;for(const f of G.f){if(f.hp<100&&(f.st==='idle'||f.st==='walk'||f.st==='crouch'||f.st==='blk')&&f.t>.5&&f.o.comboT<=0)f.hp=Math.min(100,f.hp+80*sdt);f.hp=Math.max(1,f.hp);if(!f.cpu&&f.meter<100&&f.st!=='super')f.meter=Math.min(100,f.meter+30*sdt)}}
  if(MU().meter)for(const f of G.f)if(f.st!=='super')f.meter=Math.min(100,f.meter+22*sdt);
  for(const f of G.f)if(lastL(f)){if(f.st!=='super')f.meter=Math.min(100,f.meter+6*sdt);if(!f.llS){f.llS=1;word('LAST LANTERN!',f.x,f.y+92,'#f8a030');snd(196,.5,392,'sawtooth',.06);snd(392,.5,784,'triangle',.06);G.flash=Math.max(G.flash,.03)}
   if((f.llT=(f.llT||0)-sdt)<=0){f.llT=.05;G.pt.push({x:f.x+R(-9,9),y:f.y+R(4,56),vx:R(-10,10),vy:R(34,70),ay:0,t:R(.3,.5),c:pick(['#f8e060','#f8a030','#fff0c0']),s:Math.random()<.3?2:1})}}
  if(a.hp<=0||b.hp<=0){G.phase='ko';G.pT=0;G.slow=.8;decide();G.koF=.5;G.hs=Math.max(G.hs,.26);G.shake=.4;G.sa=5;snd(200,.7,40,'sawtooth',.12);noise(.4,.4,500,'lowpass')}
  else if(G.timer<=0){G.timer=0;G.phase='post';G.pT=0;decide();G.time=1;if(G.win){G.win.wins++;if(G.win.y===0)set(G.win,'win')}snd(600,.3,200)}break;
 case'ko':sim(sdt,0);{const l=G.win?G.win.o:null;
  if(G.pT>1.5&&a.y===0&&b.y===0&&(!l||l.st==='ko')){G.time=0;if(!G.win){G.phase='post';G.pT=0}else{G.win.wins++;if(G.win.wins>=2||oneRound()){G.phase='finish';G.pT=0;set(l,'dizzy');l.daze=9;snd(150,.4,300,'sawtooth',.08)}else{G.phase='post';G.pT=0;if(G.win.y===0)set(G.win,'win')}}}}break;
 case'finish':{const w=G.win,l=w.o;sim(sdt,1);
  if(w.wantFin&&l.st==='dizzy'){startFinisher(w);break}
  if(l.st==='dizzy'&&G.pT>3.4){l.vx=-l.face*40;l.vy=155;l.y=1;set(l,'knock')}
  if(l.st==='ko'&&w.y===0&&(w.st==='idle'||w.st==='walk')){G.phase='post';G.pT=0;set(w,'win')}}break;
 case'finisher':finUpd(dt);fxUpd(dt);break;
 case'post':sim(sdt,0);if(G.win&&G.win.y===0&&(G.win.st==='idle'||G.win.st==='walk'))set(G.win,'win');
  if(G.pT>(G.fin?1.6:2.4)){const over=G.f.some(f=>f.wins>=2)||oneRound();if(over)endMatch();else{if(G.win)G.round++;startRound()}}break;}
 animate(dt);
 if(G.phase!=='finisher'){const mid=(a.x+b.x)/2,zt=cl((W-10)/(Math.abs(a.x-b.x)+66),1,zMax());Z+=(zt-Z)*Math.min(1,dt*5);const hw=W/(2*Z);cam+=(cl(mid,hw,SW-hw)-W/2-cam)*Math.min(1,dt*8)}}
G.later=[];

/* ---------- drawing ---------- */
function drawF(f){if(f.hide)return;const c=f.c,P=f.pose,shk=G.hs>0&&f===G.hv?(((G.t*90)|0)%2?2:-2):0,x=Math.round(f.x-cam)+shk,sy=F-Math.round(f.y);
 const sw=Math.max(4,(GFX?15:12)-f.y/6)|0;if(GFX){r('rgba(8,4,24,.5)',x-sw+2,F-2,sw*2-4,1);r('rgba(8,4,24,.5)',x-sw,F-1,sw*2,2);r('rgba(8,4,24,.5)',x-sw+3,F+1,sw*2-6,1)}else r('rgba(0,0,0,.28)',x-sw,F-1,sw*2,3);
 const fl=f.fl>0,gs=g;let ox=x,oy=sy;
 if(fl){g=tg;tg.setTransform(1,0,0,1,0,0);tg.clearRect(0,0,tc.width,tc.height);tg.setTransform(2,0,0,2,0,0);tg.imageSmoothingEnabled=false;ox=80;oy=130}
 g.save();g.translate(ox,oy);g.scale(f.face*f.scl,f.sqz*f.scl);
 if(f.rot>.01){const hy=P[1]*(c.ls||1)*BS,lift=hy+(4-hy)*Math.min(1,f.rot/(PI/2));g.translate(0,-lift);g.rotate(-f.rot);g.translate(0,hy)}
 const o={sway:cl(f.vx/200*f.face,-1,1),daze:f.st==='dizzy'||(f.st==='hit'&&f.daze>0),zz:G.fin&&G.fin.type==='sleep'&&G.fin.st&&f===G.fin.l};
 const sp=f.st==='cast'?f.spc:null;
 if(sp){if(sp.prop&&(!f.fired||sp.prop==='phone'||sp.prop==='point'))o.prop=sp.prop;if(sp.head2&&c.head2)o.head=c.head2}
 if(f.st==='atk'&&f.mv&&f.mv.prop)o.prop=f.mv.prop;
 if(G.fin&&G.fin.type==='photo'&&f===G.fin.w)o.prop='phone';
 if(G.cine&&f===G.cine.f)o.prop=G.cine.kind==='rby'?'point':G.cine.kind==='has'?'phone':G.cine.kind==='nuk'?'cup':null;
 const j=rig(c,P,o),hx=j.hand[0],hy=j.hand[1];
 if(sp){const t=f.t;
  if(sp.leash&&f.leash&&t<.44){const len=Math.min(92,(t-.2)*700);B('#b8e020',hx,hy-1,4,4);for(let i=0;i<len-hx;i+=2)B('#2a2a30',hx+3+i,hy+Math.round(Math.sin(i*.3+G.t*30)*1),2,1);B('#c8c8d0',len,hy-1,3,3)}
  if(c.id==='erin'&&f.sn===1&&sp.seq){let q=null;for(const s_ of sp.seq)if(t>=s_.t)q=s_;const w=q&&q.w,k=q?cl((t-q.t)/.1,0,1):0,L=w==='f'?64:w==='h'?54:w==='o'||w==='l'?52:w==='r'?22:14,P_=[];
   for(let i=0;i<=L;i+=2){const u=i/L;let x,y;
    if(w==='h'||w==='f'){if(i>L*(.25+k*.75))break;x=hx+2+i;y=hy+Math.sin(i*.2+t*30)*(1-k)*4}
    else if(w==='o'){const a_=PI*.55*(1-k)-.35*k;x=hx+Math.cos(a_)*i;y=hy+Math.sin(a_)*i}
    else if(w==='l'){const a_=-.9*(1-k)-.12*k;x=hx+Math.cos(a_)*i;y=Math.max(1,hy+Math.sin(a_)*i)}
    else if(w==='r'){x=hx-2-i*.35;y=hy+i}else{x=hx+1+Math.sin(t*8+u*3)*1.5*u;y=hy-i}
    P_.push([x,y,i])}
   for(const[x,y]of P_)B(K,x-1,y-2,3,4);for(const[x,y,i]of P_)B(i%10<3?'#58a8e0':'#f4f4f4',x,y-1,2,2);
   if(q&&q.box&&k>.55&&P_.length){const e=P_[P_.length-1];B('#ffffff',e[0],e[1]-4,2,9);B('#ffffff',e[0]-4,e[1],10,2);B('#fff0a0',e[0]-1,e[1]-1,4,3)}}
  if(sp.chain&&t>.1&&t<.44){const len=cl((t-.1)*460,0,66);for(let i=0;i<len;i+=4){B(K,hx+4+i,hy-2+Math.round(Math.sin(i*.4+G.t*40)),4,4);B(i%8?'#f8d030':'#fff0a0',hx+5+i,hy-1+Math.round(Math.sin(i*.4+G.t*40)),2,2)}if(t>.18)for(let i=0;i<5;i++)B(i%2?'#60d8ff':'#ffffff',hx+len+R(-6,8),hy+R(-9,9),2,2)}
  if(sp.air&&f.fired&&t<.4){for(let i=0;i<9;i++){const off=((t*300+i*19)%56);B('rgba(255,255,255,.75)',hx+6+off,hy-12+((i*7)%26),10+(i%3)*4,1)}}
  if(sp.voice&&f.fired&&t<.46){const k=(t-.2)/.26;for(let n=0;n<3;n++){const rr=12+n*18+k*14;for(let a=-5;a<=5;a++)B(n%2?'#f8e060':'#ffffff',j.head[0]+8+Math.cos(a*.14)*rr,j.head[1]-2+Math.sin(a*.14)*rr,2,2)}}
  if(sp.charge&&!f.fired){const n=2+((t*30)|0)%4;disc(Math.round(hx+6),Math.round(-hy),n+1,'#60b8ff');disc(Math.round(hx+6),Math.round(-hy),n-1,'#ffffff')}
  if(c.id==='chrome'&&f.sn===1&&f.fired&&t<.46&&((G.t*30)|0)%2){B('#fff8c0',hx+8,hy-2,6,5);B('#f8a030',hx+13,hy-1,4,3)}
  if(sp.gamble&&t<.45){const w=Math.max(1,Math.round(Math.abs(Math.cos(t*28))*4)),cy=j.head[1]+14+Math.round(Math.sin(t/.45*PI)*16);B(K,j.head[0]-w-1,cy-1,2*w+3,8);B('#f8d030',j.head[0]-w,cy,2*w+1,6);B('#fff0a0',j.head[0]-w,cy+4,1,1)}}
 /* ALT: motion smear from the windup spot to the strike, on the active frames (GBA-style) */
 if((f.st==='atk'||f.st==='jump')&&f.mv){const m=f.mv,kick=(m.key==='k'||m.key==='sw'||m.key==='jk'||m.foot)&&!m.bite&&!m.prop,tip=m.bite?[j.head[0]+8,j.head[1]-2]:kick?j.foot:j.hand;
  if(f.at<m.su*.6)f.wtip=tip.slice();
  else if(f.wtip&&f.at<m.su*.6+.075){const a=f.wtip,b=tip,L=k=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k],p1=L(.35),p2=L(.7),col=m.big?'#fff0a8':'#ffffff';
   g.globalAlpha=.55;seg(a[0],a[1],b[0],b[1],2,col);g.globalAlpha=.75;seg(p1[0],p1[1],b[0],b[1],4,col);g.globalAlpha=.9;seg(p2[0],p2[1],b[0],b[1],m.big?7:5,col);g.globalAlpha=1}}
 if(f.st==='atk'&&f.mv&&f.mv.rocket&&f.at>f.mv.su*.6&&f.at<f.mv.su+f.mv.ac+.08){const m=f.mv,k=Math.min(1,(f.at-m.su*.6)/(m.su*.4+.02)),ex=Math.round((m.x2*BS-j.hand[0])*k),hx_=j.hand[0],hy_=j.hand[1];for(let i=0;i<ex;i+=3){B(K,hx_+i,hy_-1,3,3);B('#8a92a0',hx_+i,hy_,2,1)}B(K,hx_+ex-2,hy_-4,10,9);B('#c8d0dc',hx_+ex-1,hy_-3,8,7);B('#ffffff',hx_+ex+4,hy_+1,2,2);if(((G.t*30)|0)%2){B('#f8a030',hx_+ex-6,hy_-2,4,5);B('#fff0a0',hx_+ex-5,hy_-1,2,3)}}
 if(f.st==='atk'&&f.mv){const m=f.mv,on=f.at>=m.su&&f.at<m.su+m.ac+.04;
  if(m.bite&&on){const h=j.head;B(K,h[0]+6,h[1]-6,9,9);for(let i=0;i<4;i++){B('#ffffff',h[0]+7+i*2,h[1]+1,1,2);B('#ffffff',h[0]+8+i*2,h[1]-5,1,2)}}
  if(m.snake&&f.at>m.su*.6){const len=Math.round(cl((f.at-m.su*.6)/(m.su*.4+m.ac),0,1)*m.x2*BS);for(let i=0;i<len;i+=2){B(K,8+i,0,3,4);B(i%6<3?'#a8a8b4':'#d0d0dc',8+i,1,2,2)}B(K,7+len,-1,6,6);B('#f8d030',8+len,0,4,4)}}
 g.restore();
 if(fl){tg.setTransform(1,0,0,1,0,0);tg.globalCompositeOperation='source-atop';tg.fillStyle='#ffffff';tg.fillRect(0,0,tc.width,tc.height);tg.globalCompositeOperation='source-over';g=gs;g.drawImage(tc,x-80,sy-130,160,150)}
 if(G.fin&&G.fin.type==='flowers'&&f===G.fin.l)for(const q of G.fin.fl){const k=Math.min(1,(G.t-q.t)*6),fx_=x+Math.round(q.dx),fy=sy-Math.round(q.dy);r('#2c8a38',fx_,fy,1,Math.round(3*k));if(k>=1){r(q.c,fx_-1,fy-3,3,3);r('#f8d040',fx_,fy-2,1,1)}}
 if(f.say){const s=f.say[0],w=tw(s,1),hw_=W/(2*Z),bx=cl(x-w/2-3,W/2-hw_+2,Math.max(W/2-hw_+2,W/2+hw_-w-8)),by=sy-78;r(K,bx,by,w+6,13);r('#ffffff',bx+1,by+1,w+4,11);r('#ffffff',cl(x-1,bx+2,bx+w),by+12,3,2);text(s,bx+3,by+1,1,'#201828',null)}}
/* FABLE HUD: slanted health bars with a red damage trail, framed portraits, a timer plate, diamond round marks, a segmented meter */
function bar2(x,w,f,side){const y=5,a=Math.round(w*f.hpG/100),b=Math.round(w*f.hp/100),low=f.hp<=30,fl=((G.t*6)|0)%2;
 for(let i=0;i<8;i++){const o=side>0?-((7-i)>>1):((7-i)>>1);r(K,x-2+o,y-1+i+0,w+4,1)}
 for(let i=0;i<6;i++){const o=side>0?-((6-i)>>1):((6-i)>>1),yy=y+i,xa=side>0?x+w-a:x,xb=side>0?x+w-b:x;
  r(i<1?'#3a1420':'#280c18',x+o,yy,w,1);r(i<2?'#ff8070':'#d82838',xa+o,yy,a,1);
  r(low?(fl?(i<2?'#ffb0a0':'#f04848'):(i<2?'#ffd0a0':'#f87048')):i<1?'#fffbd0':i<3?'#ffe040':i<5?'#f8b020':'#d88010',xb+o,yy,b,1)}
 for(let k=1;k<4;k++){const xx=x+Math.round(w*k/4);r('rgba(16,8,24,.35)',xx,y,1,6)}}
function hud2(){const[a,b]=G.f;
 for(let i=0;i<27;i++)r(i<24?'rgba(12,8,28,'+(.62-i*.012).toFixed(3)+')':'rgba(12,8,28,.2)',0,i,W,1);
 bar2(23,80,a,1);bar2(137,80,b,-1);
 for(const[f,x,img]of[[a,1,a.c.head],[b,219,b.c.headL]]){r(K,x,1,20,20);r(lt(f.c.bg),x+1,2,18,18);r(dk(f.c.bg),x+2,3,17,17);r(f.c.bg,x+2,3,16,16);g.drawImage(img,x+2+((16-f.c.head.width)>>1),4);r('rgba(255,255,255,.18)',x+2,3,16,1)}
 text(a.c.n,24,14,1,'#ffffff');text(b.c.n,217-tw(b.c.n,1),14,1,'#ffffff');
 for(let i=0;i<2;i++)for(const[on,cx]of[[i<a.wins,97-i*8],[i<b.wins,143+i*8]]){const cy=19;r(K,cx-1,cy-3,3,7);r(K,cx-2,cy-2,5,5);r(K,cx-3,cy-1,7,3);r(on?'#ffe040':'#3a3050',cx,cy-2,1,5);r(on?'#ffe040':'#3a3050',cx-1,cy-1,3,3);r(on?'#ffe040':'#3a3050',cx-2,cy,5,1);if(on)r('#fffbd0',cx,cy-1,1,1)}
 r(K,105,0,30,15);r('#f8c030',106,0,28,14);r('#a06810',107,1,26,12);r('#181024',108,1,24,11);
 const tm=Math.ceil(G.timer);mtext(tm<10?'0'+tm:''+tm,120,2,3,tm<=10&&((G.t*4)|0)%2?'#f85040':'#ffe860',null);
 const my=H-9;for(const[f,x,s]of[[a,5,1],[b,W-5-70,-1]]){const w=Math.round(70*f.meter/100),full=f.meter>=100,fl=((G.t*8)|0)%2;
  r(K,x-2,my-2,74,9);r('#4a4468',x-1,my-1,72,7);r('#141024',x,my,70,5);
  for(let i=0;i<5;i++)r(full?(fl?'#ffffff':'#60e8ff'):i<1?'#a0e0ff':i<3?'#3898f0':'#2060c0',s>0?x:x+70-w,my+i,w,1);
  for(let k=1;k<10;k++)r('rgba(8,4,24,.55)',x+k*7,my,1,5);if(f.c.su1)r('#ffffff',x+35,my-1,1,7);
  if(!full&&f.c.su1&&f.meter>=50)text(s>0?f.c.su1+' (SELECT)':f.c.su1,s>0?x+2:x+70-tw(f.c.su1,1)-2,my-12,1,'#a8e0ff');
  if(full)text(s>0?(f.c.su1?f.c.su+'! (SELECT)':'SUPER! (SELECT)'):'SUPER!',s>0?x+2:x+70-tw('SUPER!',1)-2,my-12,1,fl?'#f8e060':'#ffffff');
  const px=s>0?x+75:x-11;r(K,px,my-2,9,9);r('#4a4468',px+1,my-1,7,7);r(f.cd<=0?'#60e880':'#203828',px+2,my,5,5);if(f.cd>0)r('#60e880',px+2,my+5-Math.round(5*(1-f.cd/f.c.cdT)),5,Math.round(5*(1-f.cd/f.c.cdT)));else r('#c8ffd0',px+2,my,5,1)}
 hudText(a,b)}
function bar(x,w,f,side){const y=5;r(K,x-1,y-1,w+2,9);r('#501820',x,y,w,7);const a=Math.round(w*f.hpG/100),b=Math.round(w*f.hp/100),c=f.hp>30?'#f8d030':((G.t*6)|0)%2?'#f04040':'#f87060';
 if(side>0){r('#ffffff',x+w-a,y,a,7);r(c,x+w-b,y,b,7);r('rgba(255,255,255,.35)',x+w-b,y,b,2)}else{r('#ffffff',x,y,a,7);r(c,x,y,b,7);r('rgba(255,255,255,.35)',x,y,b,2)}}
function hud(){const[a,b]=G.f;if(GFX){hud2();return}
 r('rgba(0,0,0,.35)',0,0,W,27);bar(21,84,a,1);bar(135,84,b,-1);
 r(K,2,2,18,18);r(a.c.bg,3,3,16,16);g.drawImage(a.c.head,3+((16-a.c.head.width)>>1),4);r(K,220,2,18,18);r(b.c.bg,221,3,16,16);g.drawImage(b.c.headL,221+((16-b.c.head.width)>>1),4);
 text(a.c.n,22,14,1,'#ffffff');text(b.c.n,219-tw(b.c.n,1),14,1,'#ffffff');
 for(let i=0;i<2;i++){r(K,98-i*7,16,6,6);r(i<a.wins?'#f8d030':'#403850',99-i*7,17,4,4);r(K,136+i*7,16,6,6);r(i<b.wins?'#f8d030':'#403850',137+i*7,17,4,4)}
 const tm=Math.ceil(G.timer);mtext(tm<10?'0'+tm:''+tm,120,3,3,tm<=10&&((G.t*4)|0)%2?'#f85040':'#f8e060');
 const my=H-9;for(const[f,x,s]of[[a,5,1],[b,W-5-70,-1]]){r(K,x-1,my-1,72,7);r('#28203c',x,my,70,5);if(f.c.su1)r('#ffffff',x+35,my-1,1,7);const w=Math.round(70*f.meter/100),full=f.meter>=100,c=full?(((G.t*8)|0)%2?'#ffffff':'#60d8ff'):'#3888e0';r(c,s>0?x:x+70-w,my,w,5);
  if(!full&&f.c.su1&&f.meter>=50)text(s>0?f.c.su1+' (SELECT)':f.c.su1,s>0?x+2:x+70-tw(f.c.su1,1)-2,my-11,1,'#a8e0ff');
  if(full)text(s>0?(f.c.su1?f.c.su+'! (SELECT)':'SUPER! (SELECT)'):'SUPER!',s>0?x+2:x+70-tw('SUPER!',1)-2,my-11,1,((G.t*6)|0)%2?'#f8e060':'#ffffff');
  const px=s>0?x+74:x-9;r(K,px,my-1,7,7);r(f.cd<=0?'#60d880':'#304838',px+1,my,5,5);if(f.cd>0)r('#60d880',px+1,my+5-Math.round(5*(1-f.cd/f.c.cdT)),5,Math.round(5*(1-f.cd/f.c.cdT)))}
 hudText(a,b)}
function hudText(a,b){
 const hy0=G.mode==='trial'?41:30;for(const f of G.f)if(f.combo>=2&&f.comboT>0){const s=f.combo+' HITS';text(s,f===a?6:W-6-tw(s,2),hy0,2,'#f8e060');if(G.mode==='train'){const d=Math.round(f.cdmg||0)+' DMG';text(d,f===a?6:W-6-tw(d,1),42,1,'#ffffff')}}
 for(const f of G.f)if(f.rank){const s=f.rank[0],y=(G.mode==='train'?52:42)+(G.mode==='trial'?12:0);text(s,f===a?6:W-6-tw(s,2),y,2,((G.t*10)|0)%2?'#ffffff':'#60d8ff')}
 if(G.mode==='trial'&&G.tq){const T=G.trial,s=T.pr?T.pr(G.tq):T.goal,done=T.pr&&T.ok(Object.assign({},G.tq,{clock:Math.ceil(G.timer),hp:Math.round(a.hp)}));r('rgba(0,0,0,.45)',0,27,W,11);ctext(s,28,1,done?'#60d880':'#f8e060')}
 if(G.mode==='train'){const s='DUMMY: '+DMY[G.dmy||0]+'  (START)';text(s,W-4-tw(s,1),30,1,'#a8e0ff')}}
function judgeEyes(e){const op=e.delay>0?1-e.delay/.3:1,y=30,h=30,sl=Math.max(1,Math.round(5*op));r('rgba(60,10,10,'+(.4*op)+')',0,0,W,H);r(K,0,y-1,W,h+2);r('#e89040',0,y,W,h);r('#fff0d8',0,y+h-9,W,9);
 const d=e.o.face>0?1:-1;for(const cx of[72,168]){for(let i=0;i<26;i++)r('#5a3010',cx-28+i*2,y+3+Math.round(Math.abs(i-13)*-.25+3*(d>0?i/26:1-i/26)),3,3);
  r(K,cx-28,y+10,56,10);r('#fff0d8',cx-26,y+12,52,sl+1);r(K,cx+d*13-5,y+12,10,sl+1);r('#c02020',cx+d*13-2,y+12,3,Math.min(2,sl))}
 r('#201418',114,y+h-11,12,6);r('rgba(0,0,0,.6)',0,y+h+2,W,22);ctext('JUDGEMENT',y+h+4,4,'#f8e060','#601010')}
const cineFull=()=>CN[G.cine.kind]?CN[G.cine.kind].full(G.cine.t):G.cine.kind==='rby'?G.cine.t<RBY[1]:G.cine.t<HSB[2];
function fightDraw(){if(G.cine&&cineFull()){hsbDraw();return}fightDraw0();if(G.cine)hsbDraw()}
/* FABLE: GBA colour treatment for stages. The stage is drawn at 1x into its own layer, then every pixel gets more contrast and
   saturation, is dimmed a little (more toward the top and the bottom) so the fighters stand out, and is snapped to a 15-bit
   palette with a 4x4 ordered dither, the way a GBA background looks. About 73,000 pixels a frame. */
const sc1=document.createElement('canvas'),sg1=sc1.getContext('2d',{willReadFrequently:true});
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>Math.round((v/16-.5)*5)),SQ=new Uint8Array(280),SLUTS=new Map();
for(let i=0;i<280;i++)SQ[i]=cl((i-8)>>3,0,31);
/* one lookup table per brightness level: 15-bit colour in -> treated, packed colour out */
function stageLut(dim){let L=SLUTS.get(dim);if(L)return L;L=new Uint32Array(32768);const bb=dim<.97?Math.min(.1,(.97-dim)*.29):.02,
  f=(v,l,k)=>{const c=cl(((l+(v-l)*1.22)-128)*1.16+122,0,255)*k;return(cl(c,0,255)>>3)*8+4};
 for(let i=0;i<32768;i++){const r_=(i&31)*8+4,g_=((i>>5)&31)*8+4,b_=((i>>10)&31)*8+4,l=(r_*77+g_*150+b_*29)>>8;L[i]=0xff000000|(f(b_,l,dim+bb)<<16)|(f(g_,l,dim)<<8)|f(r_,l,dim)}
 SLUTS.set(dim,L);return L}
function stageLayer(fn){if(!GFX){fn();return}if(sc1.width!==W||sc1.height!==H){sc1.width=W;sc1.height=H}
 const gs=g,tb=TBX;g=sg1;TBX=null;sg1.setTransform(1,0,0,1,0,0);sg1.imageSmoothingEnabled=false;try{fn()}finally{g=gs;TBX=tb}
 const d=sg1.getImageData(0,0,W,H),p=new Uint32Array(d.data.buffer);let q=0;
 for(let y=0;y<H;y++){const du=F-y,dim=du<0?.8:du<8?.86:du>64?Math.max(.58,Math.round((.97-(du-64)*.0042)*40)/40):.97,L=stageLut(dim),by=(y&3)*4;
  for(let x=0;x<W;x++,q++){const v=p[q],t=BAY[by+(x&3)]+8;p[q]=L[SQ[(v&255)+t]|(SQ[((v>>8)&255)+t]<<5)|(SQ[((v>>16)&255)+t]<<10)]}}
 sg1.putImageData(d,0,0);g.drawImage(sc1,0,0,W,H)}
/* FABLE: the K.O. impact frame. For half a second the stage is replaced by speed lines in the winner's colour, bursting from the loser. */
function koLines(){const w=G.win||G.f[0],l=w.o,cx=Math.round(l.x-cam),cy=F-34-Math.round(l.y),c1=w.c.bg,c2=shade(w.c.bg,.45),n=30,sd=((G.t*24)|0);
 r(c2,0,0,W,H);for(let i=0;i<n;i++){const a0=i/n*2*PI+((sd*7+i*13)%10)*.012,dw=.05+((sd+i*5)%4)*.018,r0=26+((sd*3+i*11)%9)*5,R1=320;
  g.fillStyle=i%3===0?'#ffffff':i%3===1?c1:lt(c1);g.beginPath();g.moveTo(cx+Math.cos(a0)*R1,cy+Math.sin(a0)*R1);g.lineTo(cx+Math.cos(a0+dw)*R1,cy+Math.sin(a0+dw)*R1);g.lineTo(cx+Math.cos(a0+dw/2)*r0,cy+Math.sin(a0+dw/2)*r0);g.fill()}
 r('rgba(255,255,255,'+Math.max(0,(G.koF-.38)*5).toFixed(2)+')',0,0,W,H)}
function fightDraw0(){const[a,b]=G.f;
 world(()=>{
 if(G.koF>0)koLines();else stageLayer(()=>ST[G.stage].d(G.t));
 /* ALT: GBA-style grade, stage only: stepped dark bands at the top, a grounding band on the floor */
 if(!GFX)for(let i=0;i<6;i++)r('rgba(16,8,32,'+(.16-i*.026).toFixed(3)+')',0,i*6,W,6);
 if(G.cine&&G.cine.kind==='rby')rbyWorld();
 if(G.cine&&CN[G.cine.kind]&&CN[G.cine.kind].world)CN[G.cine.kind].world(G.cine);
 if(!GFX&&!(G.koF>0)){r('rgba(16,8,32,.16)',0,F+1,W,H-F);r('rgba(16,8,32,.12)',0,F+5,W,H-F)}
 if(G.freeze>0||(G.phase==='finisher'&&G.pT<3.4&&!(G.fin.type==='photo'&&G.fin.st)))r('rgba(10,6,24,.6)',0,0,W,H);
 for(const e of G.fx)if(e.k==='jet'||e.k==='wind')fxDraw(e);
 for(const f of G.f)for(const q of f.tr){g.save();g.globalAlpha=.5*q.t/.17;g.translate(Math.round(q.x-cam),F-Math.round(q.y));g.scale(q.face,1);rig(f.c,q.P,{});g.restore()}
 const first=(a.st==='atk'||a.st==='cast'||a.st==='super'||a.st==='throw')?b:a;drawF(first);drawF(first.o);
 for(const e of G.fx)if(e.k!=='jet'&&e.k!=='wind')fxDraw(e);
 for(const q of G.pt){const x=Math.round(q.x-cam),y=F-Math.round(q.y);if(q.txt){if(!(G.koF>0))mtext(q.txt,x,y,2,q.c,K)}else if(q.burst){const k=1-q.t/q.t0,R0=q.big?17:11,rr=R0*(.35+k*.8);for(let i=0;i<8;i++){const an=i*PI/4+q.rot,l=rr*(i%2?.62:1);for(let s_=rr*.35;s_<l;s_+=1.5)r(q.cool?(i%2?'#40c8ff':'#e0f8ff'):i%2?'#f8a030':(k<.5?'#ffffff':'#fff0a0'),Math.round(x+Math.cos(an)*s_)-1,Math.round(y-Math.sin(an)*s_)-1,2,2)}if(k<.55)disc(x,y,Math.max(1,Math.round((1-k/.55)*R0*.5)),k<.25?'#ffffff':'#fff8c0')}
 else if(q.star){const n=Math.round(q.star*(1.2-q.t*4));r('#ffffff',x-n,y-1,n*2,2);r('#ffffff',x-1,y-n,2,n*2);r('#f8e060',x-(n>>1),y-(n>>1),n,n);r('#ffffff',x-1,y-1,3,3)}else if(q.heart)heart(x,y,q.c);else if(q.junk!==undefined){const j=q.junk;if(j<3){r(K,x-2,y-3,5,7);r(j===1?'#e8c020':j===2?'#d83828':'#c8d0d8',x-1,y-2,3,5);r('#ffffff',x-1,y-2,3,1);r(j?'#ffffff':'#3060c0',x-1,y,3,1)}else if(j===3){r(K,x-1,y-3,4,7);r('#f85040',x,y-1,2,4);r('#c8d0d8',x,y-2,2,1)}else if(j===4){r(K,x-1,y-4,3,9);r('#2a2a34',x,y-3,1,7);r('#60ff90',x,y-3,1,1)}else{r(K,x-2,y-4,5,9);r('#80d8c0',x-1,y-3,3,3);r('#80d8c0',x,y,1,3);r('#60b0a0',x-1,y+2,3,2)}}else r(q.c,x,y,q.w||q.s||1,q.s||1)}
 },Z+G.zp,G.shake>0?Math.round(R(-G.sa,G.sa)):0,G.shake>0?Math.round(R(-G.sa,G.sa)):0);
 {const jd=G.fx.find(e=>e.k==='judge');if(jd)judgeEyes(jd)}
 if(G.flash>0)r('rgba(255,255,255,'+Math.min(1,G.flash*7)+')',0,0,W,H);
 if(G.fin&&G.fin.type==='photo'&&G.fin.st&&G.flash<=0){r('#f4f0e4',0,0,W,26);r('#f4f0e4',0,0,14,H);r('#f4f0e4',W-14,0,14,H);r('#f4f0e4',0,H-40,W,40);ctext('BEST FRIENDS 4EVER',H-30,2,'#3a3040',null);ctext('#NOFILTER  #GG',H-17,1,'#8a8090',null);return}
 if((G.cine&&GFX)||G.op){r('#0c0810',0,0,W,24);r('#0c0810',0,H-22,W,22);r('#f8e060',0,24,W,1);r('#f8e060',0,H-23,W,1)}else hud();
 const cy=Math.round(H*.36);
 if(G.phase==='intro'){if(G.pT<1.0)ctext(G.mode==='arc'?'FIGHT '+(G.li+1)+'  -  ROUND '+G.round:G.mode==='trial'?G.trial.n:G.mode==='surv'?'SURVIVAL  -  FIGHT '+(G.surv.n+1):G.mode==='train'?'TRAINING':'ROUND '+G.round,cy,4,'#f8e060','#602010');else ctext('FIGHT!',cy-4,5,((G.t*14)|0)%2?'#ffffff':'#f85040','#601010')}
 if(G.phase==='ko'&&G.pT<1.5){const s_=1+Math.max(0,.16-G.pT)*9;g.save();g.translate(W/2,cy+6);g.scale(s_,s_);g.translate(-W/2,-cy-6);ctext(G.win?'K.O.':'DOUBLE K.O.',cy-4,5,'#f85040','#400808');g.restore()}
 if(G.phase==='finish'){ctext("FINISH 'EM!",cy-6,5,((G.t*8)|0)%2?'#f85040':'#f8e060','#400808');if(!G.win.cpu&&((G.t*3)|0)%2)ctext('PRESS X, Y OR SELECT',cy+24,2,'#ffffff')}
 if(G.phase==='post'&&G.pT>.3){if(G.fin){ctext(G.win.c.fin+'!',cy-4,4,'#f8a0c8','#501030')}else if(!G.win)ctext(G.time?'TIME UP - DRAW':'DRAW',cy,4,'#c8c0d8');else{ctext(G.win.c.n+' WINS',cy-6,4,'#f8e060','#602010');if(G.time)ctext('TIME UP',cy+18,2,'#c8c0d8');else if(G.win.hp>=100)ctext('FLAWLESS!',cy+18,2,'#60d8ff')}}
 if(G.banner){const bn=G.banner,k=Math.min(1,(bn.fin?2.6:1.5)-bn.t>0?((bn.fin?2.6:1.5)-bn.t)*8:0),y=bn.fin?cy-8:Math.round(H*.3);r('rgba(0,0,0,.6)',0,y-3,W,bn.fin?30:24);r(bn.c.bg,0,y-3,Math.round(W*k),2);r(bn.c.bg,W-Math.round(W*k),y+(bn.fin?25:19),Math.round(W*k),2);ctext(bn.s+(bn.fin?'!':''),y+(bn.fin?2:1),bn.fin?4:3,'#ffffff',bn.c.bg)}}

/* ALT: level select thumbnails (each stage drawn once into its own little canvas) */
let THUMB=null;
function stageThumbs(){if(THUMB&&THUMB.h===H)return THUMB.c;const c=[],sv=g,sc=cam;
 for(let i=0;i<ST.length;i++){const cv2=document.createElement('canvas');cv2.width=480;cv2.height=H*2;const x=cv2.getContext('2d');x.setTransform(2,0,0,2,0,0);x.imageSmoothingEnabled=false;g=x;cam=48;try{stageLayer(()=>ST[i].d(0))}catch(e){}g=sv;c.push(cv2)}
 cam=sc;THUMB={h:H,c};return c}
function stageGrid(){const th=stageThumbs(),tw2=70,thh=40,gx=(W-3*tw2-2*6)/2,gy=Math.max(48,Math.round(H*.36));r('rgba(10,6,24,.55)',0,gy-6,W,3*(thh+6)+8);
 for(let i=0;i<ST.length;i++){const x=Math.round(gx+(i%3)*(tw2+6)),y=gy+((i/3)|0)*(thh+6),on=i===G.stage;r(on?'#f8e060':K,x-2,y-2,tw2+4,thh+4);
  g.imageSmoothingEnabled=false;g.drawImage(th[i],0,Math.max(0,(F-104)*2),480,232,x,y,tw2,thh);if(!on)r('rgba(10,6,24,.35)',x,y,tw2,thh)}}
/* ALT: arcade tower (Mortal Kombat style). Your marker climbs to the next opponent, then a short scene for them. */
const TOWERLINE={louie:'LOUIE SMELLS FEAR.',marcus:'MARCUS HAS A GUY.',erin:'ERIN IS NOT HAVING IT.',chrome:'LOADING LIL BOTTIE...',bibi:'KING BIBI IS NOT DONE.',kiss:'CORBIN WANTS A KISS.',mama:'MAMA RUNS ON NO SLEEP.',will:'WILL IS PUSHING TO MAIN.'};
function towerDraw(){const t=G.scrT,L=G.ladder,n=L.length,me=CH[G.p1];
 for(let i=0;i<H;i+=4)r(i%8?'#1a1028':'#20142e',0,i,W,4);
 const top=30,bot=Math.round(H*.6),step=(bot-top)/n,tx=W/2-14;
 r('#2c2238',tx-14,top-10,56,bot-top+20);for(let y=top-10;y<bot+10;y+=8)for(let x=tx-14;x<tx+42;x+=12)r('#382a46',x+((y/8)%2?6:0),y,10,6);
 for(const fx of[tx-22,tx+48]){const fl=((G.t*12)|0)%3;r('#5a3a24',fx,bot-30,4,10);r('#f8a030',fx-1+fl%2,bot-36-fl,6,6);r('#fff0a0',fx+1,bot-34,2,3)}
 text('ARCADE',6,6,2,'#f8e060');const fl='FIGHT '+(G.li+1)+' OF '+n;text(fl,W-6-tw(fl,1),9,1,'#c8c0d8');
 for(let i=0;i<n;i++){const c=CH[L[i]],y=Math.round(bot-(i+1)*step),done=i<G.li,cur=i===G.li;
  r(cur&&((G.t*6)|0)%2?'#f8e060':K,tx-1,y-1,22,22);r(done?'#3a3040':c.bg,tx,y,20,20);g.drawImage(c.head,tx+1,y+1);
  if(done){g.globalAlpha=.6;r('#101018',tx,y,20,20);g.globalAlpha=1;r('#e02020',tx+2,y+9,16,2);r('#e02020',tx+9,y+2,2,16)}
  if(i===n-1)text('BOSS',tx+26,y+6,1,'#f85040');}
 const from=G.li>0?G.li-1:-1,k=Math.min(1,t/1.1),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,fy=from<0?bot+4:bot-(from+1)*step,toY=bot-(G.li+1)*step,my=Math.round(fy+(toY-fy)*e);
 r(K,tx-30,my-1,22,22);r(me.bg,tx-29,my,20,20);g.drawImage(me.head,tx-28,my+1);r('#f8e060',tx-8,my+9,5,2);
 const by=Math.round(H*.64),bh=H-by-14;if(t<1.2)return;const k2=Math.min(1,(t-1.2)/.25),opp=CH[G.p2],x0=Math.round(W*(1-k2));
 g.save();g.translate(x0,0);r(K,0,by-2,W,bh+4);r(shade(opp.bg,.5),0,by,W,bh);for(let i=0;i<W;i+=10)r(shade(opp.bg,.42),i+((G.t*30)|0)%10,by,4,bh);
 g.save();g.translate(10,by+8);g.scale(2,2);g.drawImage(opp.head,0,0);g.restore();
 const tt=t-1.2,cx=W/2+30,gy=by+bh-8;
 switch(opp.id){
  case'louie':{const b=Math.abs(Math.sin(tt*6))*30;disc(Math.round(cx+Math.sin(tt*2)*30),Math.round(gy-6-b),5,K);disc(Math.round(cx+Math.sin(tt*2)*30),Math.round(gy-6-b),4,'#c8f040');break}
  case'marcus':{g.save();g.translate(cx,by+bh/2);g.rotate(tt*8);r(K,-14,-3,28,6);r('#a8b0bc',-13,-2,26,4);r(K,10,-6,8,12);r('#c8d0dc',11,-5,6,10);g.restore();break}
  case'erin':{for(let i=0;i<8;i++){const h_=Math.min(30,Math.max(0,(tt*40-i*6)));const x=W/2-10+i*14;r('#2c8a38',x,gy-h_,2,h_);if(h_>=30){r(['#f8a0c8','#f8d040','#a070e8','#60b8f8'][i%4],x-2,gy-h_-3,6,5);r('#f8d040',x,gy-h_-2,2,2)}}break}
  case'chrome':{const w_=120,p_=Math.min(1,tt/1.6);r(K,W/2-30,by+bh/2-6,w_+4,12);r('#101420',W/2-28,by+bh/2-4,w_,8);r('#40a0ff',W/2-28,by+bh/2-4,Math.round(w_*p_),8);if(((G.t*4)|0)%2)r('#a0e0ff',W/2-26+Math.round(w_*p_),by+bh/2-3,2,6);break}
  case'bibi':{r(K,cx-12,gy-26,24,26);r('#5a3a24',cx-11,gy-25,22,24);r('#c8a040',cx-11,gy-25,22,2);if(((G.t*7)|0)%4===0){r('#ffffff',cx-40+((G.t*97)|0)%80,by+6,4,4)}break}
  case'kiss':{for(let i=0;i<6;i++){const y=gy-((tt*40+i*14)%(bh-6));g.save();g.translate(Math.round(W/2-20+i*16),Math.round(y));heart(0,0,'#f85888');g.restore()}break}
  case'mama':{const x=Math.round(-60+((tt*140)%(W+120)));r(K,x-1,gy-17,58,15);r('#f4f4f0',x,gy-16,56,13);r('#1c2430',x+6,gy-15,12,5);r('#1c2430',x+22,gy-15,12,5);disc(x+10,gy-2,4,K);disc(x+44,gy-2,4,K);break}
  case'will':{for(let i=0;i<5;i++){const y=Math.round(by+6+((i*12-tt*30)%60+60)%60);text(['FIX: EVERYTHING','PUSH --FORCE','MERGE MAIN','WIP','SHIP IT'][i],W/2-14,y,1,'#80ff90',null)}break}}
 const line=TOWERLINE[opp.id]||opp.tag;text(line,10,by+bh-12,1,'#ffffff');text(opp.n,52,by+10,2,'#ffffff');g.restore()}
/* ALT: HASBARA's screens */
function hsbDraw(){if(CN[G.cine.kind])return CN[G.cine.kind].draw(G.cine);if(G.cine.kind==='rby')return rbyDraw();const C=G.cine,t=C.t,f=C.f,v=C.v,cy=Math.round(H/2);
 if(t<HSB[0]){const e=Math.min(1,t/.18),sl=Math.round((1-e)*W);
  r('#08060e',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.32);
  r('#3a6ea8',-W+sl*1.5,-66,W*2,24);r('#3a6ea8',-W-sl*1.5,42,W*2,24);r('#f8e040',-W-sl,-36,W*2,72);r('#141018',-W+sl,-32,W*2,4);r('#141018',-W+sl,28,W*2,4);
  for(let i=0;i<70;i++){const px=-W+((i*29+t*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.25)',Math.round(px),py,3,3)}g.restore();
  const S_=Math.max(3,Math.min(6,Math.floor(H/50))),hd=f.c.head,hw=hd.width*S_,hh=hd.height*S_,px=Math.round(W/2-hw/2+(1-e)*130),py=Math.round(cy-hh/2-12+(t>.22&&t<.3?R(-3,3):0));
  g.imageSmoothingEnabled=false;r('#141018',px-5,py-5,hw+10,hh+10);r('#ffffff',px-3,py-3,hw+6,hh+6);r(f.c.bg,px,py,hw,hh);g.drawImage(hd,px,py,hw,hh);
  const bx=px+hw-2,by=py-6;disc(bx,by,12,'#141018');disc(bx,by,10,'#f8e040');text('S',bx-6,by-8,4,'#141018',null);
  for(let i=0;i<5;i++){const a=t*4+i*1.26,rr=hw*.78,sx=Math.round(W/2+Math.cos(a)*rr),sy=Math.round(cy-12+Math.sin(a)*rr*.6);r('#fff8c0',sx-1,sy-3,2,7);r('#fff8c0',sx-3,sy-1,7,2)}
  if(t>.22){ctext('HASBARA',py+hh+16,5,'#ffffff','#141018');ctext('SUPER  -  '+f.c.n,py+hh+42,1,'#f8e060',null)}
  g.save();g.globalAlpha=.3;g.translate(Math.round((t/HSB[0])*(W+140))-70,0);g.rotate(.3);r('#ffffff',-8,-40,12,H+80);g.restore();
  if(t<.05)r('#ffffff',0,0,W,H);return}
 if(t<HSB[1]){hsbDesk(t-HSB[0],HSB[1]-HSB[0],f,v);return}
 if(t<HSB[2]){hsbMind(t-HSB[1],v);return}
 for(let i=0;i<10;i++){const yy=Math.round((i*37+t*900)%H);r('rgba(255,255,255,.2)',0,yy,6+(i%3)*4,1);r('rgba(255,255,255,.2)',W-6-(i%3)*4,(yy+H/2)%H,6+(i%3)*4,1)}
 text('HASBARA',6,30,2,'#f8e060');const tot='-'+Math.round(C.dmg);if(C.dmg>0)text(tot,W-6-tw(tot,3),28,3,'#f85040');
 if(C.hits>=HSBHIT.length&&t-C.last<.05)r('#ffffff',0,0,W,H)}
function hsbDesk(tt,T,f,v){const k=tt/T,z=1+k*.08;g.save();g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);
 const sc=2,base=H-6,deskY=Math.round(base-24*sc),mw=66,mh=52,my=Math.max(70,Math.round(base-98-mh)),top=Math.max(14,my-70),mx=[8,87,166];
 r('#070a10',0,0,W,H);
 r('#0c1622',8,top,W-16,my-top-12);for(let i=0;i<12;i++)r('#12304a',8+i*19,top,1,my-top-12);for(let j=0;j*15<my-top-12;j++)r('#12304a',8,top+j*15,W-16,1);
 for(let i=0;i<10;i++)if(((tt*5+i)|0)%2)r('#40ff90',20+(i*37)%200,top+4+(i*17)%Math.max(8,my-top-20),2,2);
 text('COMMAND',Math.round(W/2-tw('COMMAND',1)/2),top-11,1,'#4a8a7a',null);
 mx.forEach((x,i)=>{r('#202834',x-2,my-2,mw+4,mh+4);r('#060a0e',x,my,mw,mh);r('#202834',x+mw/2-3,my+mh+2,6,8);g.globalAlpha=.8+.2*Math.sin(tt*30+i*2);
  if(i===0){text('IDF',x+3,my+3,1,'#40ff90',null);text('HASBARA',x+3,my+13,1,'#40ff90',null);text('DESK',x+3,my+23,1,'#40ff90',null);for(let j=0;j<2;j++)r('#2a8a5a',x+3,my+36+j*7,Math.round(8+((tt*60+j*17)%50)),3)}
  if(i===1){const hd=v.c.head,hS=2;g.imageSmoothingEnabled=false;g.drawImage(hd,Math.round(x+mw/2-hd.width),my+5,hd.width*hS,hd.height*hS);const rr=15+Math.round(Math.sin(tt*10)*2);ring(x+mw/2,my+19,rr,'#ff4040');ring(x+mw/2,my+19,rr+1,'#ff4040');r('#ff4040',x+2,my+19,8,1);r('#ff4040',x+mw-10,my+19,8,1);text('TARGET',x+3,my+mh-10,1,'#ff6060',null)}
  if(i===2){const L=['THREAD','TALKING PTS','POSTING...','SHIFTING'],n=Math.min(L.length,1+Math.floor(k*5));for(let j=0;j<n;j++)text(L[j],x+3,my+3+j*10,1,j===n-1&&k<.86?'#ffffff':'#40c0ff',null);r('#163040',x+3,my+mh-8,mw-6,4);r('#40c0ff',x+3,my+mh-8,Math.round((mw-6)*Math.min(1,k*1.15)),4)}
  g.globalAlpha=1});
 if(k>.84){const s_='SENT!';r('#062010',mx[2]+9,my+15,mw-18,17);r('#40ff90',mx[2]+10,my+16,mw-20,15);text(s_,Math.round(mx[2]+mw/2-tw(s_,2)/2),my+18,2,'#062010',null)}
 r('#3a3a48',0,deskY,W,1);r('#2a2a34',0,deskY+1,W,5);r('#16161e',0,deskY+6,W,H-deskY);
 const wx=Math.round(W*.2),kx=wx+11*sc;r('#0a0a0e',kx-2,deskY-3,30*sc/2+16,4);r('#2a2a34',kx-1,deskY-2,30*sc/2+14,2);for(let i=0;i<10;i++)if(((tt*24+i*3)|0)%4===0)r('#40ff90',kx+i*(3+sc/2),deskY-2,2,1);
 g.save();g.translate(wx,base);g.scale(sc,sc);
 B('#24242e',-14,0,3,32);B('#24242e',-14,15,18,3);B('#3a3a48',-14,17,18,1);
 const typ=((tt*16)|0)%2,j=rig(CH[0],p(-4,12,.42,8,0,12,0,9+typ*1.5,-5,12-typ*1.5,-4.5+typ,1,0),{}),h=j.head,hw=CH[0].head.width/2;
 B(K,h[0]-hw+1,h[1]+7,hw*2-2,2);B(K,h[0]-hw-2,h[1]-4,5,8);B('#3a3a48',h[0]-hw-1,h[1]-3,3,6);seg(h[0]-hw,h[1]-4,h[0]+2,h[1]-9,1,K);B('#40ff90',h[0]+2,h[1]-10,2,2);
 g.restore();g.restore()}
function hsbMind(tt,v){const cy=Math.round(H/2);r('#1a0a2a',0,0,W,H);
 for(let i=0;i<20;i++){g.save();g.translate(W/2,cy);g.rotate(i/20*2*PI+tt*1.5);r(i%2?'#2a1240':'#3a1a58',0,-4,W,8);g.restore()}
 const S_=Math.max(4,Math.min(7,Math.floor(H/42))),hd=v.c.head,hw=hd.width*S_,hh=hd.height*S_,px=Math.round(W/2-hw/2+(tt<.25?R(-3,3):0)),py=Math.round(cy-hh/2-4);
 g.imageSmoothingEnabled=false;r('#ffffff',px-3,py-3,hw+6,hh+6);r(v.c.bg,px,py,hw,hh);g.drawImage(hd,px,py,hw,hh);
 for(const ex of[px+hw*.33,px+hw*.67]){const ey=py+hh*.52;disc(Math.round(ex),Math.round(ey),Math.round(S_*2.6),'#ffffff');for(let i=0;i<34;i++){const a=i*.42+tt*14,rr=i*S_*.075;r(i%2?'#7a2ab0':'#141018',Math.round(ex+Math.cos(a)*rr)-1,Math.round(ey+Math.sin(a)*rr)-1,3,3)}}
 ctext(tt<.3?'WAIT...':'WHO IS THE BAD GUY?',py-24,2,'#ffffff','#1a0a2a');ctext('MIND: RECALIBRATED',py+hh+10,2,'#f8e060','#1a0a2a')}

/* ---------- menus ---------- */
const tresItems=()=>G.tres&&G.tres.ok&&G.ti<TRIALS.length-1?['RETRY','NEXT TRIAL','TRIALS','TITLE']:['RETRY','TRIALS','TITLE'];
/* ---------- FABLE: the opening movie ----------
   Plays when the cartridge boots (A, B or Start skips it), to the menu song. A studio card, a roll call of all eight fighters, four
   clips of real fights run by the engine (two cpus on HARD, with specials and half-meter supers fired on cue), a cut from every
   fighter's ultimate, then the cast rushing together and the title. Nothing in it is saved or counted. */
const OPO=['will','erin','louie','chrome','marcus','bibi','kiss','mama'],OP_ROLL=2.2,OP_CARD=1.15,OP_CLIPS=OP_ROLL+8*OP_CARD,OP_END=3.8;
/* a short bio for each roll-call card (invented from what the handoffs say about each of them; Will can rewrite) */
const OPBIO={will:'BUILT THIS GAME. STILL LOSES AT IT.',erin:'GROWS THE FOOD. RUNS THE STAND. ENDS THE FIGHT.',louie:'EVOLVED SHIBA, EST 2018. GOOD BOY. BAD NEWS.',chrome:'RAPPER. ROBOT. ONE BAD DAY FROM A DATA CENTER.',
 marcus:"OWNS FLOW PROS. HAS A GUY. THE GUY IS HIM.",bibi:'PRIME MINISTER. AGAIN. AND AGAIN.',kiss:'ONE QUESTION. EVERY SINGLE TIME.',mama:'UP SINCE 4. DRIVES A YUKON. FEAR HER.'};
const opFree=a=>a.st==='idle'||a.st==='walk'||a.st==='blk'||a.st==='crouch'||a.st==='atk'||a.st==='dash';
const opHalf=(a,b)=>{a.meter=60;if(opFree(a))startSuper(a)},opUlt=sk=>(a,b)=>{a.meter=100;set(a,'idle');a.y=0;startSuper(a);if(G.cine&&sk)G.cine.t=sk};
/* clips: real fights first (specials and half-meter supers on cue), then one cut from every fighter's ultimate (ult: seconds into it) */
const OPC=[{a:'will',b:'louie',st:6,len:2.7,ev:[[.25,(a,b)=>startSpecial(a,2)],[1.3,(a,b)=>startSpecial(b,1)]]},
 {a:'erin',b:'chrome',st:2,len:2.7,ev:[[.2,(a,b)=>startSpecial(a,1)],[1.4,(a,b)=>startSpecial(b,1)]]},
 {a:'marcus',b:'bibi',st:8,len:2.7,ev:[[.2,(a,b)=>startSpecial(b,1)],[.85,opHalf]]},
 {a:'mama',b:'kiss',st:3,len:2.7,ev:[[.2,(a,b)=>startSpecial(b,1)],[.85,opHalf]]},
 {a:'will',b:'marcus',st:0,len:1.7,u:1,ev:[[.02,opUlt(.75)]]},{a:'erin',b:'chrome',st:1,len:1.7,u:1,ev:[[.02,opUlt(.7)]]},
 {a:'louie',b:'will',st:4,len:1.7,u:1,ev:[[.02,opUlt(0)]]},{a:'chrome',b:'bibi',st:7,len:1.7,u:1,ev:[[.02,opUlt(1.65)]]},
 {a:'marcus',b:'will',st:5,len:1.9,u:1,ev:[[.02,opUlt(1.75)]]},{a:'bibi',b:'erin',st:8,len:2.3,u:1,ev:[[.02,opUlt(2.2)]]},
 {a:'kiss',b:'mama',st:3,len:1.7,u:1,ev:[[.02,opUlt(0)]]},{a:'mama',b:'louie',st:2,len:1.7,u:1,ev:[[.02,opUlt(1.0)]]}];
{let t=OP_CLIPS;for(const c of OPC){c.t0=t;t+=c.len}}
const OP_FIN=OPC[OPC.length-1].t0+OPC[OPC.length-1].len,OP_T=OP_FIN+OP_END,opClip=t=>{let i=0;while(i<OPC.length-1&&t>=OPC[i+1].t0)i++;return i};
function opEnd(){G.op=null;G.f=[];G.fx=[];G.pt=[];G.cine=null;G.koF=0;G.banner=null;G.mode='arc';G.scr='title';G.mi=0;G.scrT=0}
function opUpd(dt){const O=G.op;if(pressed('a')||pressed('start')||pressed('b')){sfx.ok();opEnd();return}
 O.t+=dt;const t=O.t;
 if(t>=OP_CLIPS&&t<OP_FIN){const ci=opClip(t),c=OPC[ci],ct=t-c.t0;
  if(O.clip!==ci){O.clip=ci;O.ev=0;G.p1=cix(c.a);G.p2=cix(c.b);G.stage=c.st;G.mode='arc';startMatch();G.scr='op';const[a,b]=G.f;a.cpu=true;if(c.u)b.dummy=1;a.x=SW/2-44;b.x=SW/2+44;G.phase='go';G.pT=0;cam=SW/2-W/2;Z=1.4}
  const[a,b]=G.f;while(O.ev<c.ev.length&&ct>=c.ev[O.ev][0]){try{c.ev[O.ev][1](a,b)}catch(e){}O.ev++}
  for(const f of G.f)f.hp=Math.max(f.hp,45);fightUpd(dt);G.scr='op'}
 if(t>=OP_T)opEnd()}
function opDraw(){const O=G.op,t=O.t,cy=Math.round(H/2);
 if(t<OP_ROLL){r('#08060c',0,0,W,H);const k=Math.min(1,t/.7),gl=6+Math.round(Math.sin(t*5)*1.5);for(let i=4;i>0;i--)disc(W/2,cy-22,gl+i*5,'rgba(248,192,48,'+(.05*k).toFixed(3)+')');disc(W/2,cy-22,gl,'#f8c030');disc(W/2,cy-22,gl-3,'#fff0a8');r(K,W/2-5,cy-10,10,3);r('#6a4424',W/2-4,cy-9,8,2);
  if(t>.4)ctext('NORTH COAST STUDIOS',cy+6,2,'#f8e060','#201008');if(t>.9)ctext('PRESENTS',cy+20,1,'#c8c0d8',null);r('rgba(8,6,12,'+Math.max(0,1-t/.5).toFixed(2)+')',0,0,W,H);if(t>OP_ROLL-.25)r('rgba(255,255,255,'+((t-OP_ROLL+.25)*4).toFixed(2)+')',0,0,W,H);return}
 if(t<OP_CLIPS){const i=Math.min(7,((t-OP_ROLL)/OP_CARD)|0),u=((t-OP_ROLL)/OP_CARD)-i,ci=cix(OPO[i]),c=CH[ci],left=i%2===0,e=Math.min(1,u/.16);
  bgStripes(shade(c.bg,.4),shade(c.bg,.58));g.save();g.translate(W/2,cy-36);g.rotate(left?-.22:.22);r(K,-W,-44,W*3,88);r(c.bg,-W,-40,W*3,80);for(let k=0;k<60;k++)r('rgba(255,255,255,.13)',-W+((k*31+t*300)%(W*3)),-36+(k*17)%72,10,2);g.restore();
  const hx=left?Math.round(-90+e*150):Math.round(W+90-e*150);g.save();g.translate(hx,cy-36-45);g.scale(5,5);g.drawImage(left?c.head:c.headL,-(c.head.width>>1),0);g.restore();
  poser(ci,left?W-58:58,H-26,left?-1:1,u<.32?idleP(0,ci):u<.4?c.ps.p3w:u<.62?c.ps.p3:u<.68?c.ps.kw:u<.88?c.ps.k:c.ps.st,3);
  if(u>.4&&u<.5){const sx=left?W-58-52:58+52,sy=H-26-112;for(let k=0;k<8;k++){const a=k*PI/4;for(let d_=6;d_<22;d_+=2)r(k%2?'#f8a030':'#ffffff',Math.round(sx+Math.cos(a)*d_),Math.round(sy+Math.sin(a)*d_),2,2)}}
  r('rgba(0,0,0,.5)',0,cy+22,W,58);ctext(c.n,cy+25,4,'#ffffff',K);ctext(c.tag,cy+44,1,'#f8e060',null);if(u>.2)wrapT(OPBIO[c.id]||'',34).forEach((l,k)=>ctext(l,cy+56+k*10,1,'#ffffff',null));
  if(u<.07)r('rgba(255,255,255,'+(1-u/.07).toFixed(2)+')',0,0,W,H);return}
 if(t<OP_FIN){const ci=opClip(t),c=OPC[ci],ct=t-c.t0;if(!G.f.length){r(K,0,0,W,H);return}
  fightDraw();const A_=G.f[0].c;
  if(c.u){r('rgba(8,4,16,.72)',0,H-24,W,24);r(A_.bg,0,H-24,W,2);ctext(A_.n+':  '+A_.su,H-18,2,'#f8e060',null)}else{ctext(A_.n+'  VS  '+G.f[1].c.n,H-17,2,'#f8e060',null);ctext(ST[G.stage].n,7,1,'#c8c0d8',null)}
  if(ct<.1)r('rgba(255,255,255,'+(1-ct/.1).toFixed(2)+')',0,0,W,H);if(ct>c.len-.1)r('rgba(255,255,255,'+((ct-c.len+.1)/.1).toFixed(2)+')',0,0,W,H);return}
 const u=t-OP_FIN;
 if(u<1.1){const k=Math.min(1,u/.85),kk=1-(1-k)*(1-k);r('#0c0810',0,0,W,H);for(let i=0;i<40;i++){const y=(i*37)%H,x=((i*53+u*900)%(W+80))-40;r(i%2?'#3a2850':'#5a3a70',i%4<2?x:W-x,y,26,1)}
  for(let i=0;i<8;i++){const c=CH[cix(OPO[i])],side=i%2,row=i>>1,x=side?Math.round(W+40-kk*(W/2+22)):Math.round(-40+kk*(W/2+22)),y=cy-104+row*50;g.save();g.translate(x,y);g.scale(3,3);g.drawImage(side?c.headL:c.head,-(c.head.width>>1),0);g.restore()}
  if(k>=1){disc(W/2,cy,Math.round((u-.85)*400),'#ffffff')}return}
 {const v=u-1.1,s_=1+Math.max(0,.22-v)*10;bgStripes('#1a1030','#24163e');for(let i=0;i<30;i++)r(['#f85888','#f8e060','#60d880','#60b8f8'][i%4],(i*37+v*20*(1+i%3))%W,(i*53+v*46*(1+i%2))%H,2,2);
  g.save();g.translate(W/2,cy-40);g.scale(s_,s_);g.translate(-W/2,-(cy-40));r('rgba(248,80,64,.14)',0,cy-62,W,50);ctext('NORTH COAST',cy-60,3,'#f8e060','#603010');ctext('KNOCKOUT',cy-45,5,'#f85040','#400808');ctext('KNOCKOUT',cy-46,5,'#ffb060',null);r('#f8e060',40,cy-16,160,1);g.restore();
  r('rgba(0,0,0,.4)',0,H-10,W,10);for(let i=0;i<8;i++){const ci=cix(OPO[i]);poser(ci,17+i*29.5,H-6,i<4?1:-1,v>.5+i*.06?CH[ci].ps.win1:idleP(i,ci),1)}
  if(v>.9&&((G.t*3)|0)%2)ctext('PRESS A',cy+2,2,'#ffffff',K);if(v<.12)r('rgba(255,255,255,'+(1-v/.12).toFixed(2)+')',0,0,W,H)}}
const pauseItems=()=>G.mode==='trial'?['RESUME','RESTART TRIAL','MOVE LIST','HOW TO PLAY','QUIT TO TITLE']:G.mode==='train'?['RESUME','DUMMY: '+DMY[G.dmy||0],'MOVE LIST','HOW TO PLAY','QUIT TO TITLE']:['RESUME','MOVE LIST','HOW TO PLAY','QUIT TO TITLE'];
const nav=(i,n)=>{if(pressed('down')){sfx.ui();return(i+1)%n}if(pressed('up')){sfx.ui();return(i+n-1)%n}return i};
const DIFF=['EASY','NORMAL','HARD'],DMY=['STAND','BLOCK','CPU'];
const titleItems=()=>['ARCADE','SURVIVAL','TRIALS','QUICK FIGHT','TRAINING','RULES: '+RULES[SV.rule||0][0],'DIFFICULTY: '+DIFF[SV.diff],'HOW TO PLAY','SWAP CARTRIDGE'];
const trStart=i=>{const T=TRIALS[i];G.ti=i;G.trial=T;G.mode='trial';G.p1=cix(T.p1);G.p2=cix(T.p2);G.stage=T.st!==undefined?T.st:CH[G.p2].stage;G.scr='vs';G.scrT=0};
function bgStripes(c1,c2){r(c1,0,0,W,H);g.fillStyle=c2;const o=(G.t*12)%24;for(let i=-H;i<W+24;i+=24){g.beginPath();g.moveTo(i+o,0);g.lineTo(i+o+10,0);g.lineTo(i+o+10-H*.6,H);g.lineTo(i+o-H*.6,H);g.fill()}}
function poser(ci,x,y,face,pose,sc=1){g.save();g.translate(x,y);g.scale(face*sc,sc);rig(CH[ci],pose,{});g.restore();}
const idleP=(ph,ci)=>{const S=ci===undefined?PS:CH[ci].ps;return mix(S.st,S.st2,.5-.5*Math.cos((G.t+ph)*6))};
function selMove(){let c=G.cur%4,rw=(G.cur/4)|0;if(pressed('right')){c=(c+1)%4;sfx.ui()}if(pressed('left')){c=(c+3)%4;sfx.ui()}if(pressed('down')||pressed('up')){rw=1-rw;sfx.ui()}G.cur=rw*4+c;}
function menuUpd(dt){G.scrT+=dt;
 switch(G.scr){
 case'title':{const it=titleItems();G.mi=nav(G.mi,it.length);
  const lab=it[G.mi];
  if(lab.startsWith('DIFF')&&(pressed('left')||pressed('right'))){SV.diff=(SV.diff+(pressed('right')?1:2))%3;store();sfx.ui()}
  if(lab.startsWith('RULES')&&(pressed('left')||pressed('right'))){SV.rule=((SV.rule||0)+(pressed('right')?1:RULES.length-1))%RULES.length;store();sfx.ui()}
  if(pressed('a')||pressed('start')){sfx.ok();const md={ARCADE:'arc',SURVIVAL:'surv','QUICK FIGHT':'vs',TRAINING:'train'}[lab];
   if(md){G.mode=md;G.scr='sel';G.pick=0;G.scrT=0}else if(lab==='TRIALS'){G.scr='trials';G.scrT=0;G.ti=Math.min(G.ti||0,TRIALS.length-1)}else if(lab.startsWith('RULES')){SV.rule=((SV.rule||0)+1)%RULES.length;store()}else if(lab.startsWith('DIFF')){SV.diff=(SV.diff+1)%3;store()}else if(lab==='HOW TO PLAY'){G.scr='how';G.back='title'}else A.eject()}break}
 case'op':opUpd(dt);break;
 case'how':if(pressed('a')||pressed('b')||pressed('start')){sfx.ui();G.scr=G.back}break;
 case'trials':G.ti=nav(G.ti||0,TRIALS.length);if(pressed('b')){sfx.no();G.scr='title';break}if(pressed('a')||pressed('start')){sfx.ok();trStart(G.ti)}break;
 case'tres':{const it=tresItems();G.mi=nav(G.mi,it.length);if(G.scrT>.4&&(pressed('a')||pressed('start'))){sfx.ok();const s=it[G.mi];if(s==='RETRY')trStart(G.ti);else if(s==='NEXT TRIAL')trStart(G.ti+1);else if(s==='TRIALS'){G.scr='trials';G.scrT=0}else{G.scr='title';G.mi=0}}break}
 case'sel':selMove();
  if(pressed('x')||pressed('y')){sfx.ui();G.mc=G.cur;G.scr='moves';G.back='sel';G.scrT=0;break}
  if(pressed('b')){sfx.no();if(G.pick===1){G.pick=0;G.cur=G.p1}else G.scr='title';break}
  if(pressed('a')||pressed('start')){sfx.ok();snd(330,.15,660,'sawtooth',.05);
   if(G.pick===0){G.p1=G.cur;if(G.mode==='arc'){buildLadder();nextArcade()}else if(G.mode==='surv'){G.surv={n:0,hp:100};nextSurv()}else{G.pick=1;G.cur=(G.cur+2)%8}}
   else{G.p2=G.cur;G.stage=CH[G.p2].stage;G.scr='stage';G.scrT=0}}break;
 case'stage':if(pressed('right')){G.stage=(G.stage+1)%ST.length;sfx.ui()}if(pressed('left')){G.stage=(G.stage+ST.length-1)%ST.length;sfx.ui()}if(pressed('down')){G.stage=(G.stage+3)%ST.length;sfx.ui()}if(pressed('up')){G.stage=(G.stage+ST.length-3)%ST.length;sfx.ui()}
  if(pressed('b')){sfx.no();G.scr='sel';G.pick=1;G.cur=G.p2}if(pressed('a')||pressed('start')){sfx.ok();G.scr='vs';G.scrT=0}break;
 case'tower':if(G.scrT>3.4||(G.scrT>.4&&(pressed('a')||pressed('start')))){G.scr='vs';G.scrT=0}break;
 case'vs':if(G.scrT<.02)G.bant=banter(CH[G.p1],CH[G.p2]);if(G.scrT>3.6||(G.scrT>.5&&(pressed('a')||pressed('start'))))startMatch();break;
 case'pause':{const it=pauseItems();G.mi=nav(G.mi,it.length);if(pressed('start')||pressed('b')){G.scr='fight';break}
  if(it[G.mi].startsWith('DUMMY')&&(pressed('a')||pressed('left')||pressed('right'))){G.dmy=((G.dmy||0)+(pressed('left')?2:1))%3;const b=G.f[1];b.dummy=G.dmy===2?0:G.dmy===1?2:1;b.cpu=true;sfx.ui();break}
  if(pressed('a')){sfx.ok();if(it[G.mi]==='RESUME')G.scr='fight';else if(it[G.mi]==='MOVE LIST'){G.mc=G.p1;G.scr='moves';G.back='pause'}else if(it[G.mi]==='HOW TO PLAY'){G.scr='how';G.back='pause'}else if(it[G.mi]==='RESTART TRIAL')trStart(G.ti);else{G.scr='title';G.mi=0}}break} case'moves':if(G.scrT>.2&&(pressed('a')||pressed('b')||pressed('x')||pressed('y')||pressed('start'))){sfx.ui();G.scr=G.back;G.scrT=0}break;
 case'res':{const arc=G.mode==='arc';if(arc&&!G.won){G.cont-=dt;if(G.cont<=0||pressed('b')){G.scr='title';G.mi=0;break}if(pressed('a')||pressed('start')){sfx.ok();G.scr='vs';G.scrT=0}break}
  G.mi=nav(G.mi,3);if(pressed('a')||pressed('start')){sfx.ok();if(G.mi===0&&G.mode==='surv'){G.surv={n:0,hp:100};nextSurv()}else if(G.mi===0){G.scr='vs';G.scrT=0}else if(G.mi===1){G.scr='sel';G.pick=0;G.cur=G.p1}else{G.scr='title';G.mi=0}}break}
 case'ending':if(G.scrT>2&&(pressed('a')||pressed('start'))){sfx.ok();G.scr='title';G.mi=0}break;}
}
function list(items,y,i,sc=2,gap=13){items.forEach((s,k)=>{const on=k===i;if(on){const w=tw(s,sc);r('rgba(0,0,0,.45)',Math.round((W-w)/2)-12,y+k*gap-1,w+24,gap)}ctext((on?'> ':'')+s+(on?' <':''),y+k*gap,sc,on?'#f8e060':'#d8d0e8')})}
function grid(y0){for(let i=0;i<8;i++){const c=CH[i],x=14+(i%4)*54,y=y0+((i/4)|0)*42,on=i===G.cur,lock=G.pick===1&&i===G.p1&&false;
  r(K,x-1,y-1,50,38);r(on?c.bg:shade(c.bg,.45),x,y,48,36);r('rgba(0,0,0,.25)',x,y+26,48,10);
  g.save();g.translate(x+24,y+3);g.scale(1.6,1.6);g.globalAlpha=on?1:.75;g.drawImage(c.head,-(c.head.width>>1),0);g.restore();
  const nm=c.n.length>8?c.n.split(' ').pop():c.n,w=tw(nm,1);text(nm,x+24-(w>>1),y+26,1,on?'#ffffff':'#b8b0c8');
  if(SV.clear[c.id])r('#f8d030',x+42,y+2,4,4);
  if(G.pick===1&&i===G.p1){r('#3888e0',x,y,11,9);text('P1',x+1,y-1,1,'#ffffff',null)}
  if(on){const cc=G.pick?'#f85040':'#60d8ff',b=((G.t*6)|0)%2;r(cc,x-2-b,y-2-b,52+2*b,2);r(cc,x-2-b,y+36+b,52+2*b,2);r(cc,x-2-b,y-2-b,2,40+2*b);r(cc,x+48+b,y-2-b,2,40+2*b)}}}
function menuDraw(){const cy=H/2;
 switch(G.scr){
 case'title':{bgStripes('#1a1030','#24163e');const top=Math.max(4,Math.round((H-176)/3));
  r('rgba(248,80,64,.12)',0,top+2,W,50);ctext('NORTH COAST',top+4,3,'#f8e060','#603010');ctext('KNOCKOUT',top+19,5,'#f85040','#400808');ctext('KNOCKOUT',top+18,5,'#ffb060',null);r('#f8e060',40,top+48,160,1);
  const fy=H-6;r('rgba(0,0,0,.4)',0,fy-2,W,8);const ps=H>=220?2:1;poser(0,ps>1?40:26,fy,1,mix(idleP(0,0),PS.p1,Math.max(0,Math.sin(G.t*2))**8),ps);poser(2,ps>1?200:214,fy,-1,mix(idleP(2,2),PS.k,Math.max(0,Math.sin(G.t*2+2))**8),ps);
  list(titleItems(),top+54,G.mi,2,12);
  if(top+54+titleItems().length*12<H-56){ctext('WINS '+SV.w+'  LOSSES '+SV.l,H-52,1,'#8a80a8');if(SV.surv||trStars())ctext((SV.surv?'STREAK '+SV.surv:'')+(SV.surv&&trStars()?'  ':'')+(trStars()?'STARS '+trStars():''),H-41,1,'#8a80a8')}break}
 case'how':{r('#141024',0,0,W,H);const y0=Math.max(4,Math.round((H-182)/2));ctext('HOW TO FIGHT',y0,3,'#f8e060');
  const L=[['D-PAD','WALK / JUMP / CROUCH'],['TAP TAP','DASH FORWARD / BACK'],['HOLD BACK','BLOCK (DOWN+BACK = LOW)'],['TAP BACK','PARRY, JUST BEFORE A HIT'],['A','LIGHT   A,A,A = COMBO'],['B','HEAVY'],['DOWN + A','LAUNCHER (+UP: CHASE)'],['DOWN + B','LOW SWEEP'],['FWD + A','THROW (UP CLOSE)'],['X','SPECIAL 1'],['Y','SPECIAL 2'],['SELECT','SUPER (FULL METER)']];
  L.forEach(([k,v],i)=>{const y=y0+22+i*12;text(k,86-tw(k,1),y,1,'#60d8ff');text(v,94,y,1,'#e8e0f0')});ctext("WIN 2 ROUNDS, THEN FINISH 'EM WITH X, Y OR SELECT",y0+24+L.length*12,1,'#f8a0c8');break}
 case'sel':{bgStripes('#101828','#182238');const y0=Math.max(18,Math.round((H-150)/2)+16);ctext(G.pick?'CHOOSE YOUR OPPONENT':'CHOOSE YOUR FIGHTER',y0-15,2,G.pick?'#f85040':'#60d8ff');grid(y0);
  const c=CH[G.cur],iy=y0+86;r('rgba(0,0,0,.4)',0,iy-2,W,H-iy+2);ctext(c.n,iy,3,'#ffffff',c.bg);ctext(c.tag,iy+17,1,'#c8c0d8');
  if(H-iy>80)poser(G.cur,120,H-6,1,idleP(1,G.cur),H-iy>150?2:1);
  if(H-iy>46){ctext('X '+c.sp+'   Y '+c.sp2,iy+29,1,'#60d880');ctext('SUPER: '+(c.su1?c.su1+' / '+c.su:c.su),iy+40,1,'#60d8ff')}
  if(H-iy>60)ctext('X OR Y: MOVE LIST',iy+52,1,'#f8e060');break}
 case'stage':{const sc=cam;cam=48+Math.sin(G.t*.5)*40;world(()=>stageLayer(()=>ST[G.stage].d(G.t)),zMax());cam=sc;r('rgba(0,0,0,.55)',0,8,W,34);ctext('CHOOSE THE STAGE',11,1,'#c8c0d8');ctext('< '+ST[G.stage].n+' >',22,3,'#f8e060');stageGrid();
  if(((G.t*2)|0)%2)ctext('A: FIGHT    B: BACK',H-16,1,'#ffffff');break}
 case'op':opDraw();break;
 case'tower':towerDraw();break;
 case'trials':{bgStripes('#101c24','#162a30');const n=TRIALS.length,rows=Math.max(5,Math.min(n,((H-104)/12)|0)),top=cl((G.ti||0)-(rows>>1),0,n-rows),T=TRIALS[G.ti||0],st=(SV.tr||{});
  ctext('TRIALS',6,4,'#f8e060','#603010');ctext('STARS '+trStars()+' / '+n*2,26,1,'#c8c0d8');
  for(let k=0;k<rows;k++){const i=top+k,t=TRIALS[i],y=40+k*12,on=i===G.ti,v=st[t.id]||0;if(on)r('rgba(0,0,0,.5)',6,y-1,W-12,12);
   text((i<9?'0':'')+(i+1),10,y,1,on?'#f8e060':'#8a80a8');text(t.n,30,y,2,on?'#ffffff':'#c8c0d8');
   for(let s_=0;s_<2;s_++){const x=W-34+s_*12;r(K,x-1,y+1,9,9);r(v>s_?(s_?'#f8d030':'#d8dce8'):'#30283c',x,y+2,7,7);if(v>s_)r('#ffffff',x+1,y+3,2,2)}}
  const by=44+rows*12;r('rgba(0,0,0,.5)',0,by,W,H-by);g.drawImage(CH[cix(T.p1)].head,12,by+5);g.drawImage(CH[cix(T.p2)].headL,W-12-CH[cix(T.p2)].head.width,by+5);
  ctext(CH[cix(T.p1)].n+'  VS  '+CH[cix(T.p2)].n,by+3,1,'#ffffff');ctext(DIFF[T.lv]+(T.mut?'  +  '+Object.keys(T.mut).map(k=>({turbo:'TURBO',moon:'MOON',big:'BIG HEADS',glass:'GLASS',meter:'METER',sd:'SUDDEN DEATH'})[k]).join(', '):''),by+13,1,'#a8e0ff');
  ctext(T.goal,by+26,1,'#f8e060');ctext(T.gt||'GOLD: FINISH ON 70+ HEALTH',by+37,1,'#f8d030');if(((G.t*2)|0)%2)ctext('A: FIGHT    B: BACK',by+50,1,'#ffffff');break}
 case'tres':{const T=G.trial,R_=G.tres,c=CH[G.p1];bgStripes(R_.ok?'#102a1c':'#2a1014',R_.ok?'#183a26':'#3a181c');const top=Math.max(6,cy-80);
  g.save();g.translate(120,top);g.scale(3,3);g.drawImage(c.head,-(c.head.width>>1),0);g.restore();
  ctext(T.n,top+48,3,'#ffffff');ctext(R_.ok?(R_.gold?'GOLD!':'CLEARED!'):'NOT YET',top+64,4,R_.ok?(R_.gold?'#f8d030':'#60d880'):'#f85040');
  for(let s_=0;s_<2;s_++){const x=106+s_*18,y=top+88,on=R_.ok&&(s_===0||R_.gold);r(K,x-1,y-1,13,13);r(on?(s_?'#f8d030':'#d8dce8'):'#30283c',x,y,11,11);if(on)r('#ffffff',x+2,y+2,3,3)}
  ctext(R_.ok?(R_.gold?'"'+c.win[0]+'"':(T.gt||'GOLD: FINISH ON 70+ HEALTH')):(R_.won?'YOU WON, BUT: '+T.goal:T.goal),top+106,1,'#e8e0f0');
  list(tresItems(),top+122,G.mi,2,12);break}
 case'vs':{const a=CH[G.p1],b=CH[G.p2],k=Math.min(1,G.scrT*4);r(a.bg,0,0,W/2,H);r(b.bg,W/2,0,W/2,H);g.fillStyle=shade(a.bg,.6);for(let i=0;i<H;i+=8)g.fillRect(0,i,W/2,3);g.fillStyle=shade(b.bg,.6);for(let i=4;i<H;i+=8)g.fillRect(W/2,i,W/2,3);
  r(K,118,0,4,H);const hy=Math.round(cy-50);
  g.save();g.translate(Math.round(-70+k*130),hy);g.scale(4,4);g.drawImage(a.head,-(a.head.width>>1),0);g.restore();g.save();g.translate(Math.round(W+70-k*130),hy);g.scale(4,4);g.drawImage(b.headL,-(b.head.width>>1),0);g.restore();
  mtext(a.n,60,hy+62,3,'#ffffff');mtext(b.n,180,hy+62,3,'#ffffff');
  if(G.bant&&G.scrT>.7)bubble(wrapT(G.bant[0],26),8,Math.round(cy+38),0,'#201828');if(G.bant&&G.scrT>1.8)bubble(wrapT(G.bant[1],26),W-8,Math.round(cy+38+(wrapT(G.bant[0],26).length*10+14)),1,'#601818');
  if(G.scrT>.3){disc(120,Math.round(cy),15,K);disc(120,Math.round(cy),13,'#f8e060');mtext('VS',120,Math.round(cy)-8,3,'#c02020','#ffffff')}
  r('rgba(0,0,0,.55)',0,H-22,W,22);ctext(G.mode==='trial'?G.trial.goal:(G.mode==='arc'?'FIGHT '+(G.li+1)+' OF '+G.ladder.length+'   ':'')+ST[G.stage].n,H-17,1,'#f8e060');break}
 case'pause':fightDraw();r('rgba(10,6,24,.72)',0,0,W,H);ctext('PAUSED',cy-44,4,'#f8e060');list(pauseItems(),cy-14,G.mi);break;
 case'moves':{const c=CH[G.mc],n=c.mn;r('#141024',0,0,W,H);const L=[['A, A, A',n.p],['B',n.k],...(c.mv.fk.own?[['FWD + B',n.fk]]:[]),['DOWN + A',n.up],['DOWN + B',n.sw],['FWD + A',n.thr],['AIR B',n.jk],['X',c.sp],['Y',c.sp2],...(c.su1?[['SEL 1/2',c.su1],['SEL FULL',c.su]]:[['SELECT',c.su]]),['FINISHER',c.fin]],y0=Math.max(4,Math.round((H-28-L.length*13)/2));
  r(c.bg,0,y0-2,W,22);g.drawImage(c.head,8,y0+2);ctext(c.n+'  MOVE LIST',y0+3,2,'#ffffff',shade(c.bg,.5));
  L.forEach(([k,v],i)=>{const y=y0+26+i*13;text(k,74-tw(k,1),y,1,i>=6?'#f8e060':'#60d8ff');text(v,82,y,1,'#e8e0f0')});break}
 case'res':{const w=G.won,c=CH[w?G.p1:G.p2];bgStripes(shade(c.bg,.35),shade(c.bg,.45));const top=Math.max(6,cy-74);
  g.save();g.translate(120,top);g.scale(3,3);g.drawImage(c.head,-(c.head.width>>1),0);g.restore();ctext(w?'YOU WIN!':'YOU LOSE',top+46,4,w?'#f8e060':'#f85040');ctext('"'+c.win[(SV.w+SV.l)%c.win.length]+'"',top+68,1,'#ffffff');
  if(G.mode==='surv'&&G.surv){ctext('SURVIVED '+G.surv.n+(G.surv.n===1?' FIGHT':' FIGHTS'),top+82,3,'#ffffff');ctext('BEST STREAK '+(SV.surv||0),top+100,1,'#f8e060');list(['TRY AGAIN','NEW FIGHTER','TITLE'],top+114,G.mi,2,12)}
  else if(G.mode==='arc'&&!w){ctext('CONTINUE?  '+Math.max(0,G.cont|0),top+88,3,'#ffffff');ctext('A: REMATCH    B: GIVE UP',top+110,1,'#c8c0d8')}else list(['REMATCH','NEW FIGHTERS','TITLE'],top+86,G.mi,2,12);break}
 case'ending':{const c=CH[G.p1];bgStripes('#302010','#40300c');const top=Math.max(4,cy-78);ctext('CHAMPION OF',top,2,'#ffffff');ctext('THE NORTH COAST',top+13,3,'#f8e060','#603010');
  poser(G.p1,120,top+92,1,mix(PS.win1,PS.win2,.5+.5*Math.sin(G.t*9)),1.5);for(let i=0;i<24;i++){const x=(i*37+G.t*20*(1+i%3))%W,y=(i*53+G.t*40*(1+i%2))%H;r(['#f85888','#f8e060','#60d880','#60b8f8'][i%4],x,y,2,2)}
  ctext(c.n+' BEAT EVERYONE ON '+DIFF[SV.diff],top+100,1,'#ffffff');ctext('"'+c.win[0]+'"',top+113,1,'#f8c8e0');ctext('A NORTH COAST STUDIOS PRODUCTION',top+130,1,'#a898c8');if(G.scrT>2&&((G.t*2)|0)%2)ctext('PRESS A',top+144,2,'#ffffff');break}}
}

/* ---------- cartridge label ---------- */
(()=>{const a=document.getElementById('cartArt2');if(!a||!a.getContext)return;const x=a.getContext('2d');x.fillStyle='#402058';x.fillRect(0,0,40,26);x.fillStyle='#f08040';x.fillRect(0,0,40,9);x.fillStyle='#f8c060';x.fillRect(0,9,40,4);x.fillStyle='#2c2438';x.fillRect(0,22,40,4);
 x.drawImage(CH[0].head,3,8);x.drawImage(CH[2].headL,21,8);x.fillStyle='#fff';x.fillRect(18,3,1,5);x.fillRect(20,3,1,5);x.fillRect(19,5,1,1);x.fillStyle='#f8e060';x.fillRect(17,13,6,2)})();

return{
 start(){G.scr='op';G.op={t:0,clip:-1,ev:0};G.mi=0;G.scrT=0;G.t=0},
 mus:()=>koMus(),
 paused:()=>G.scr==='pause'||G.scr==='moves',
 update(dt){H=A.H();F=H-28;G.t+=dt;musTick();if(G.op&&G.scr!=='op')G.op=null;if(G.scr==='fight')fightUpd(dt);else menuUpd(dt);
  const rd=G.scr==='fight'&&G.f[0]&&G.f[0].meter>=(G.f[0].c.su1?50:100)&&G.phase==='go';if(rd!==G.rd){G.rd=rd;const e=document.getElementById('bSel');if(e)e.classList.toggle('ready',rd)}},
 draw(){H=A.H();F=H-28;if(G.scr==='fight')fightDraw();else menuDraw()},
 _:{G,CH,ST,SV,PS,RBY,CN,TRIALS,RULES,trStart,endMatch,opEnd,OP_T,nextSurv,poser,mix,startHasbara,HSB,tb:{rec:()=>{TBX=[]},get:()=>{const t=TBX;TBX=null;return t}},S1,S2,SUP,rig,tryHit,startMatch,startSuper,startSpecial,startFinisher,set,get cam(){return cam},set cam(v){cam=v}}};
};
