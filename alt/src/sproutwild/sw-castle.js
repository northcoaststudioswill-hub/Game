/* ================================================================
   THE FIRST ALPHA LIVES IN THE CASTLE (v9.5). Will: the flow to the
   first alpha was bad; it should be in Squire's Woods, which should
   have a castle.
   - The Meadow is the training ground: no alpha behind its boulder
     wall any more (the wall, the ore and the buried PEB stay).
   - Squire's Woods opens once Sunkeep has its cottage and a crop.
     Its walls are drawn as a castle: grey brick, battlements, round
     corner towers with arrow slits, a gatehouse over the thorn gate,
     a flagstone courtyard. STONESQUIRE, the castle's own gatehouse
     come alive, is the first alpha (Lv7) and gives the first Sigil.
   - Crooked Hollow (Lv6 to 9) is the road after the first Sigil.
   - BLOOMBOAR moves to the Ember Wastes, guarding the glassware.
   ================================================================ */
/* the Meadow: no alpha; its old spot is grass */
{const R=FMAPS.MEADOW.rows;for(let y=0;y<R.length;y++)if(R[y].includes('A'))R[y]=R[y].replace('A','.');delete FMAPS.MEADOW.key.A}
/* the Wastes: BLOOMBOAR in front of the walled pocket in the south-east */
{const R=FMAPS.WASTES.rows;R[14]=R[14].slice(0,27)+'A'+R[14].slice(28);FMAPS.WASTES.key.A={k:'alpha',sp:'BLOOMBOAR',lv:12,guards:'3'}}
/* Squire's Woods: first after the Meadow; the Hollow after the first Sigil */
FMAPS.SQUIRE.key.A.lv=7;
{const R=FMAPS.SQUIRE.rows;R[4]=R[4].slice(0,12)+'.'+R[4].slice(13)} /* the tree that hid the Lantern post */
{const sq=wSector('SQUIRE'),ho=wSector('HOLLOW');sq.req=0;sq.lv=[3,6];sq.sub='An old castle in the woods. Its gatehouse is awake.';ho.req=1;ho.lv=[6,9]}
WSECSUB.SQUIRE='The castle in the woods. Wilds Lv3 to 6.';
/* which roads are shut, and what the sign says */
function wBarred(to){return to==='SQUIRE'?SW.quest<5:to==='HOLLOW'?SW.badges.length<1:false}
function wBarredSay(to){return to==='SQUIRE'?"RANGER'S BARRIER: Squire's Woods is wild. Build Sunkeep a cottage and grow a crop first.":"RANGER'S BARRIER: Crooked Hollow is darker still. Win a Sigil from the castle alpha in Squire's Woods first."}
/* after the cottage and the first crop: the castle */
function scGymCheck(){wStoryBeats();if(SCOFF||W4.fld||W4.sector!=='BASE'||SW.quest<5||!SW.lessons.scDab||SW.badges.length||SW.lessons.scGym||state!=='g4world'||!SW.buildings.some(b=>b.k==='cottage'))return;SW.lessons.scGym=1;
 const L=FMAPS.SQUIRE.key.A.lv;
 scStart([{who:'ERIN',txt:'Sunkeep has a roof and a garden. Now the real work: the dark out there.'},
  {who:'MARCUS',txt:"Every place has an ALPHA, bro. Biggest, darkest buddy around. Ours moved into the old castle in Squire's Woods."},
  {who:'ERIN',txt:"South through the Meadow. Bring the alpha the light and it gives up a SIGIL. Four Sigils, and King Bibi lowers the dome."},
  {who:'MARCUS',txt:'Castle alpha is Lv'+L+'. Battle wilds with SELECT on the way till your lead is Lv'+(L-1)+'. See one, light one.'},
  {who:'ERIN',txt:'And it is made of stone. Water and leaves wear stone down. A DEW or LEAF buddy from the woods will help.'}],()=>swSave())}
WSIGOPEN[1]={a:'ROADS',b:'OPEN',sub:'',end:'One Sigil. Crooked Hollow is open, east of the Meadow, and so is the road past Lantern Town.'};
/* ---- the castle, drawn over the ruin's walls ---- */
function castleBake(F,b,B,R,is){if(F.id!=='SQUIRE')return;let x0=1e9,y0=1e9,x1=-1,y1=-1;
 for(let ty=0;ty<F.h;ty++)for(let tx=0;tx<F.w;tx++)if(F.t[ty][tx]==='#'){x0=Math.min(x0,tx);y0=Math.min(y0,ty);x1=Math.max(x1,tx);y1=Math.max(y1,ty)}if(x1<0)return;
 const ST='#8c909c',LT='#a8acb6',DK='#5e626e',K='#14101e';
 /* courtyard flagstones */
 for(let ty=y0+1;ty<y1;ty++)for(let tx=x0+1;tx<x1;tx++){if(F.t[ty][tx]==='#')continue;const x=tx*FT,y=ty*FT;R('#9a9488',x,y,FT,FT);R('#867f74',x,y+7,FT,1);R('#867f74',x+((ty%2)?4:11),y,1,7);R('#867f74',x+((ty%2)?11:4),y+8,1,8);if((tx*7+ty*3)%5===0){R('#58b848',x+3,y+12,2,1);R('#58b848',x+10,y+5,1,2)}}
 /* walls: brick, battlements on the outside top edge */
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){if(F.t[ty][tx]!=='#')continue;const x=tx*FT,y=ty*FT;
  R(ST,x,y,FT,FT);for(let row=0;row<4;row++){R(DK,x,y+row*4+3,FT,1);R(DK,x+((row+tx)%2?3:10),y+row*4,1,3)}
  if(ty===y0||ty===y1){R(LT,x,y,FT,2);for(let i=0;i<FT;i+=6){R(K,x+i+3,y-3,3,3);R(LT,x+i,y-3,3,3)}}
  if(tx===x0||tx===x1){R(LT,x+(tx===x0?0:FT-2),y,2,FT)}
  R('rgba(0,0,0,.18)',x,y+FT-1,FT,1)}
 /* round corner towers with arrow slits and pennants */
 for(const [tx,ty] of [[x0,y0],[x1,y0],[x0,y1],[x1,y1]]){const cx=tx*FT+8,cy=ty*FT+6;
  R(K,cx-11,cy-12,22,24);R(ST,cx-10,cy-11,20,22);R(LT,cx-10,cy-11,20,3);R(DK,cx-10,cy+9,20,2);
  for(let i=-10;i<10;i+=5){R(K,cx+i+2,cy-15,3,3);R(LT,cx+i,cy-15,3,3)}
  R(K,cx-1,cy-4,2,6);R('#ffd94d',cx-1,cy-3,1,3);
  R('#5a3d22',cx+6,cy-26,1,12);R('#a33b2e',cx+7,cy-26,6,4);R('#c84030',cx+7,cy-26,6,1)}
 /* the gatehouse over the thorn gate */
 for(let tx=x0;tx<=x1;tx++)if(F.t[y1][tx]==='v'||(F.t[y1][tx]!=='#'&&tx>x0&&tx<x1)){const x=tx*FT,y=y1*FT;
  R(K,x-5,y-9,6,25);R(ST,x-4,y-8,4,23);R(K,x+FT-1,y-9,6,25);R(ST,x+FT,y-8,4,23);
  R(K,x-5,y-12,FT+10,5);R(LT,x-4,y-11,FT+8,3);R(DK,x+2,y-6,FT-4,1);break}}
/* first visit to Squire's Woods: the castle, shown, with Louie on what to do (replaces the old one-liner) */
function sqArrive(F){if(!F||F.id!=='SQUIRE'||SW.lessons.squire)return;if((W4.banner&&W4.banner.t>0)||W4.scene||swBusy())return;
 if(SCOFF){SW.lessons.squire=1;return}F.sqT=(F.sqT||0)+1/60;if(F.sqT<.8)return;SW.lessons.squire=1;
 const gx=23*FT+8,gy=8*FT+6,al=(F.alphas||[])[0],ax=al?al.x:21*FT+8,ay=al?al.y+10:44;
 scStart([{hold:.4},{x:gx,y:gy-20,hold:1.4},
  {x:gx,y:gy-20,who:'',txt:"Squire's castle. Somebody started building it long ago and never finished. The dark moved in instead."},
  {x:ax,y:ay,hold:1.0},{x:ax,y:ay,who:'LOUIE',txt:'Grrr... the ALPHA. Stone all the way through. Water and leaves wear it down. Woof.'},
  {x:gx,y:gy,who:'LOUIE',txt:'THORN VINES on the gate. LEAF sprouts clear them: face the gate and press A.'},{hold:.3}],()=>swSave())}
/* in any wild area: Louie sniffs out the castle road, and points you at the Lantern post the first time you are hurt */
function sqHint(F){if(!F||W4.scene||state!=='g4world'||(W4.banner&&W4.banner.t>0))return;
 if(F.id==='MEADOW'&&SW.quest>=5&&SW.badges.length<1&&!(SW.visited&&SW.visited.SQUIRE)&&!SW.lessons.sqHint&&P3.y>17*16&&Math.abs(P3.x-(17*16+16))<70){SW.lessons.sqHint=1;louSay('SNIFF! A CASTLE, SOUTH!',2.8);swSnd(600,.05,420)}
 const ld=SW.party[0];if(!SW.lessons.post&&ld&&ld.hp>0&&ld.hp<wStats(ld).max*.5&&!swBusy()&&F.start){SW.lessons.post=1;if(SCOFF)return;
  scStart([{x:F.start.x,y:F.start.y,hold:1.0},{x:F.start.x,y:F.start.y,who:'LOUIE',txt:"Hurt? This is a LANTERN POST. Walk up to it and press A: it heals your buddies."},
   {x:F.start.x,y:F.start.y,who:'LOUIE',txt:'Press A there again and it sends you home, or to any post you have lit. Woof.'},{hold:.3}],()=>swSave())}}
/* road signs in the Meadow, so you always know which way is which: [tile x, tile y, what it says] */
const FSIGNS={MEADOW:[[4,6,'HOME: SUNKEEP. The garden, the cottage, the Great Lantern.'],[19,2,"NORTH: LANTERN TOWN. The Elder, the Ranger's lodge, the road beyond."],
 [33,11,'EAST: CROOKED HOLLOW. Darker woods. The Ranger lets you in once you hold a Sigil.'],[16,35,"SOUTH: SQUIRE'S WOODS. An old castle, and an alpha awake inside it."]]};
function fSignsDraw(F){for(const [tx,ty] of FSIGNS[F.id]||[]){const x=tx*FT+8,y=ty*FT+12,K='#14101e';
 r('rgba(0,0,0,.22)',x-5,y+1,10,3);r(K,x-1,y-12,3,13);r('#8a6a48',x,y-11,1,12);
 r(K,x-8,y-17,17,8);r('#c49a62',x-7,y-16,15,6);r('#a87948',x-7,y-12,15,2);r('#5a3d22',x-5,y-14,11,1)}}
