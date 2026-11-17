/* ================================================================
   THE LOWER MEADOW (v8.5): the Meadow was too small and everything in
   Erin's walk happened in one corner. The Meadow now runs 14 rows
   further south: a big field where your first catch waits, a pond
   for water bugs, and a rocky corner where the buried PEB sprout is.
   The lessons are a walk apart, and Erin takes a breath between them.
   ================================================================ */
{const R=FMAPS.MEADOW.rows,W=R[0].length;
 /* the old buried PEB by the start goes; it lives in the rocks now */
 R[3]=R[3].replace('p','"');
 const g=[];for(let y=0;y<15;y++){const row=[];for(let x=0;x<W;x++)row.push(x===0||x===W-1?'T':'.');g.push(row)}
 const put=(x,y,c)=>{if(y>=0&&y<15&&x>0&&x<W-1)g[y][x]=c},box=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)put(x,y,c)};
 box(17,0,18,13,':');                                   /* the road keeps going south */
 box(4,2,12,7,'"');box(5,1,10,1,'"');                    /* the big field: your first catch */
 box(3,9,8,12,'~');box(4,8,7,8,'~');                     /* the pond */
 box(23,3,31,7,'"');                                     /* the east field */
 for(const [x,y] of [[25,1],[28,9],[31,10],[34,11],[33,8],[26,12]])put(x,y,'R');
 /* v9.8: the buried PEB moved up beside the east field, on Erin's route */
 for(const [x,y] of [[3,1],[14,3],[21,2],[33,3],[12,10],[22,12],[14,13],[2,6]])put(x,y,'W');
 for(const [x,y] of [[10,0],[15,9],[25,9],[20,6]])put(x,y,'B');
 for(const [x,y] of [[6,0],[13,6],[20,10],[29,2],[10,13],[31,13]])put(x,y,',');
 box(8,0,16,0,':');box(19,8,29,8,':');                  /* v9.2: dirt paths off the road to the big field and to the rocks, so Erin walks you on a path */
 const rows=g.map(r=>r.join(''));
 const wall='T'.repeat(17)+'kk'+'T'.repeat(W-19);
 FMAPS.MEADOW.rows=R.slice(0,R.length-1).concat(rows.slice(0,14),[wall]);
 {const M=FMAPS.MEADOW.rows,set=(x,y,c)=>{M[y]=M[y].slice(0,x)+c+M[y].slice(x+1)};set(27,15,'p');set(29,15,'R');set(26,16,'R');set(30,14,'R')}}
FSPOTS.MEADOW=(FSPOTS.MEADOW||[]).concat([[33,36,'ore'],[11,36,'fiber']]);
/* the lesson buddy waits in the big field, a walk from the start */
function ewTame(F){let wd=W4.wilds.find(w=>w.tame);if(wd)return wd;const sec=wSector(F.id),tx=28*FT,ty=19*FT, /* v9.8: the field east of the road, beside the buried PEB */
  gr=F.grass.slice().sort((a,b)=>Math.hypot(a[0]*FT-tx,a[1]*FT-ty)-Math.hypot(b[0]*FT-tx,b[1]*FT-ty))[0]||F.grass[0];
 if(!gr)return null;wd=fSpawnWild(F,sec);wd.x=wd.tx=gr[0]*FT+8;wd.y=wd.ty=gr[1]*FT+10;wd.lv=sec.lv[0];wd.tame=1;W4.wilds.push(wd);return wd}
/* ---- Erin walks around water and walls (v8.6): a tile path, recomputed every second ---- */
function ewBFS(F,s,g){const W=F.w,H=F.h;if(s[0]<0||s[1]<0||s[0]>=W||s[1]>=H)return null;
 /* v9.2: a cheapest path, not a shortest one: dirt roads cost 1, grass 4, so Erin keeps to the paths */
 const N=W*H,cost=new Float32Array(N).fill(1e9),prev=new Int32Array(N).fill(-2),st=s[1]*W+s[0],gl=g[1]*W+g[0],bk=[[st]];cost[st]=0;prev[st]=-1;
 const off=(nx,ny)=>F.base&&nx*FT+8>=150&&nx*FT+8<=330&&ny*FT+10>=318&&ny*FT+10<=400; /* at Sunkeep she walks round the garden */
 for(let c0=0;c0<bk.length;c0++){const B=bk[c0];if(!B)continue;for(let bi=0;bi<B.length;bi++){const c=B[bi];if(cost[c]!==c0)continue;
  if(c===gl){const path=[];let k=c;while(prev[k]!==-1){path.unshift([(k%W)*FT+8,((k/W)|0)*FT+10]);k=prev[k]}return path}
  const x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;
   if(!fWalkTile(F,nx,ny)||off(nx,ny))continue;const w=F.base?1:(fTile(F,nx,ny)===':'?1:4),nc=c0+w;if(nc<cost[n]){cost[n]=nc;prev[n]=c;(bk[nc]=bk[nc]||[]).push(n)}}}}
 return null}
function ewGo(F,E,tx,ty,v,go){const key=Math.round(tx/8)+','+Math.round(ty/8);
 if(E.pk!==key||!E.path||(E.pt=(E.pt||0)+1)>60){E.pk=key;E.pt=0;E.path=ewBFS(F,[Math.floor(E.x/FT),Math.floor(E.y/FT)],[Math.floor(tx/FT),Math.floor(ty/FT)])}
 while(E.path&&E.path.length>1&&Math.hypot(E.path[0][0]-E.x,E.path[0][1]-E.y)<5)E.path.shift();
 if(!E.path||E.path.length<=1)return go(tx,ty,v);
 go(E.path[0][0],E.path[0][1],v);return Math.max(5,Math.hypot(tx-E.x,ty-E.y))}
/* ---- after the tour, three things you do yourself (v8.6): chop, carry, catch a bug ---- */
function ew3Tick(F,dt,E,dp,go){const w3=SW.walk3;E.t=(E.t||0)+dt;
 if(E.rest>0){E.rest-=dt;E.mv=false;E.dir=[P3.x>E.x?1:-1,0];return}
 const talk=(lines,next,rest)=>{E.t=0;fTalk(F,'ERIN',lines,()=>{SW.walk3=next;if(rest)E.rest=rest;if(next>=7)E.leave=1;swSave()})};
 const lead=(x,y,lines,next)=>{if(dp>80&&Math.hypot(P3.x-x,P3.y-y)>Math.hypot(E.x-x,E.y-y)+20){E.mv=false;E.wait=1;E.dir=[P3.x>E.x?1:-1,0];return}E.wait=0;
  if(ewGo(F,E,x,y,62,go)<4){E.mv=false;E.dir=[P3.x>E.x?1:-1,0];if(dp<70)talk(lines,next)}};
 const nm=(SW.party[0]&&SW.party[0].sp)||'Your buddy';
 if(w3===1){if(!E.tree||E.tree.got){E.tree=W4.nodes.filter(n=>n.k==='tree'&&!n.got).sort((a,b)=>Math.hypot(a.x-P3.x,a.y-P3.y)-Math.hypot(b.x-P3.x,b.y-P3.y))[0]||null}
  if(!E.tree){SW.walk3=4;return}const p=ewNear(F,E.tree.x+22,E.tree.y+10);
  lead(p.x,p.y,["ERIN: One more thing before you build a home. Homes need wood, and buddies get it.","ERIN: Face this tree and press A. "+nm+" goes and chops it."],2);return}
 E.mv=false;E.dir=[P3.x>E.x?1:-1,0];
 if(w3===2){if(!E.tree||E.tree.got){talk(["ERIN: Timber! See the logs? Throw sprouts at them. They carry them home to Sunkeep."],3);return}
  if(E.t>45)talk(["ERIN: Stand facing the tree and press A. The ring shows SEND "+nm+"."],2);return}
 if(w3===3){const left=F.items.some(i=>!i.done&&i.res==='wood'&&!(i.car&&i.car.length));if(!left||E.t>60) /* every log has sprouts on it */{talk(["ERIN: That's how Sunkeep grows. Buddies chop and mine. Sprouts carry it all home."],4,3)}return}
 if(w3===4){if(typeof WNOBUG!=='undefined'&&WNOBUG){SW.walk3=6;return}
  let bg=E.bug&&(W4.bugs||[]).includes(E.bug)?E.bug:null;
  if(!bg){const sp=bgSpots(F,'grass').map(([x,y])=>[x,y,Math.hypot(x-P3.x,y-P3.y)]).filter(q=>q[2]>40&&q[2]<200).sort((a,b)=>a[2]-b[2]);if(!sp.length){SW.walk3=6;return}
   const [hx,hy]=sp[Math.min(sp.length-1,(Math.random()*4)|0)];bg={sp:'LADYBUG',x:hx,y:hy,hx,hy,wx:hx,wy:hy,t:0,ph:0};W4.bugs=W4.bugs||[];W4.bugs.push(bg);E.bug=bg}
  E.bugs0=Object.values(SW.bugs||{}).reduce((a,v)=>a+v,0);
  const p=ewNear(F,bg.x+24,bg.y+2);lead(p.x,p.y,["ERIN: Look, a ladybug! The valley's luck bug.","ERIN: Face it and press A. A sprout catches it for your jar."],5);return}
 if(w3===5){const n=Object.values(SW.bugs||{}).reduce((a,v)=>a+v,0);
  if(n>(E.bugs0||0)){talk(["ERIN: Into your jar! Bugs turn into berries, fiber, even light for the Lantern.","ERIN: The jar is in the START menu, under BUG JAR."],6,2);return}
  if(!E.bug||!(W4.bugs||[]).includes(E.bug)){SW.walk3=4;return}if(E.t>50)talk(["ERIN: Face the ladybug and press A. Quick, before it flies!"],5);return}
 if(w3===6){talk(["ERIN: You're getting the hang of this. Head home when you're ready.","ERIN: Marcus wants to build you a cottage. Don't let him pick the paint."],7);return}}
