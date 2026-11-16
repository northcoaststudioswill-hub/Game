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
 put(30,10,'p');                                         /* the buried PEB, among the rocks */
 for(const [x,y] of [[3,1],[14,3],[21,2],[33,3],[12,10],[22,12],[14,13],[2,6]])put(x,y,'W');
 for(const [x,y] of [[10,0],[15,9],[25,9],[20,6]])put(x,y,'B');
 for(const [x,y] of [[6,0],[13,6],[20,10],[29,2],[10,13],[31,13]])put(x,y,',');
 const rows=g.map(r=>r.join(''));
 const wall='T'.repeat(17)+'kk'+'T'.repeat(W-19);
 FMAPS.MEADOW.rows=R.slice(0,R.length-1).concat(rows.slice(0,14),[wall])}
FSPOTS.MEADOW=(FSPOTS.MEADOW||[]).concat([[33,36,'ore'],[11,36,'fiber']]);
/* the lesson buddy waits in the big field, a walk from the start */
function ewTame(F){let wd=W4.wilds.find(w=>w.tame);if(wd)return wd;const sec=wSector(F.id),tx=8*FT,ty=29*FT,
  gr=F.grass.slice().sort((a,b)=>Math.hypot(a[0]*FT-tx,a[1]*FT-ty)-Math.hypot(b[0]*FT-tx,b[1]*FT-ty))[0]||F.grass[0];
 if(!gr)return null;wd=fSpawnWild(F,sec);wd.x=wd.tx=gr[0]*FT+8;wd.y=wd.ty=gr[1]*FT+10;wd.lv=sec.lv[0];wd.tame=1;W4.wilds.push(wd);return wd}
