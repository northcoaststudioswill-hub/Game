/* ================================================================
   THORNWATCH v4 — THE LOOK
   Will, Nov 17: "The art needs a full rework." This file owns how
   the garden is painted and how sprites sit on it.
   - One outline style for the whole cast: twOL() gives any sprite a
     1px dark outline at its drawn size, so towers, keepers and
     creeps all read against the lawn. The sprite data itself is
     still the ported Sprouts / Rootdeep art (handoff rule 12).
   - The board is painted, not tiled: a mown lawn, a path with a
     real edge, a wall, a hedge of bramble, lanterns at the bends,
     and a palette per garden. Night is the day board under a blue
     dark with warm light pooled round the Heart and the lanterns.
   Gameplay never reads pixels from here; pure dressing.
   ================================================================ */
const TWPALS=[
 /* Erin's Garden: spring lawn, warm dirt */
 {ga:'#64c05e',gb:'#5ab657',blade:'#3f9a4a',lite:'#98e080',dirt:'#dcb97a',dirtD:'#c09a5e',dirtL:'#f0d6a0',edge:'#7e5a34',
  night:'rgba(16,18,62,.42)',stone:false},
 /* The Long Beds: late-summer gold, tilled rows */
 {ga:'#93bc52',gb:'#88b14b',blade:'#5f8f36',lite:'#c4de78',dirt:'#d0a064',dirtD:'#b0824a',dirtL:'#e6c088',edge:'#6a4628',
  night:'rgba(30,16,60,.42)',stone:false},
 /* The Crossroads: old stone under a cold dusk */
 {ga:'#4f9a7a',gb:'#488f71',blade:'#2f6e58',lite:'#7cc8a0',dirt:'#aeaabc',dirtD:'#8884a0',dirtL:'#cccada',edge:'#4a4660',
  night:'rgba(14,8,48,.46)',stone:true}];
const _twOLc=new Map();
function twOL(src,w,h){if(!src)return src;w=Math.round(w);h=Math.round(h);
 let m=_twOLc.get(src);if(!m){m={};_twOLc.set(src,m)}
 const k=w+'x'+h;if(m[k])return m[k];
 const c=document.createElement('canvas');c.width=w+2;c.height=h+2;
 try{const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  const s=document.createElement('canvas');s.width=w;s.height=h;const sx=s.getContext('2d');
  sx.imageSmoothingEnabled=false;sx.drawImage(src,0,0,w,h);
  sx.globalCompositeOperation='source-in';sx.fillStyle='#1c1428';sx.fillRect(0,0,w,h);
  x.drawImage(s,0,1);x.drawImage(s,2,1);x.drawImage(s,1,0);x.drawImage(s,1,2);
  x.drawImage(src,1,1,w,h)}catch(e){}
 m[k]=c;return c}
function twSpr(src,x,y,w,h){if(!src)return;g.drawImage(twOL(src,w,h),Math.round(x)-1,Math.round(y)-1)}
/* where the lanterns stand: one at each bend, set just off the path */
function twLampSpots(map){const out=[];const paths=TWMAPS[map-1].paths;
 for(let pi=0;pi<paths.length;pi++){const P=twPathPts(map,pi);
  for(let i=1;i<P.pts.length-1;i++){const a=P.pts[i-1],b=P.pts[i],c=P.pts[i+1];
   const ox=Math.sign(b.x-a.x)-Math.sign(c.x-b.x),oy=Math.sign(b.y-a.y)-Math.sign(c.y-b.y);
   const lx=b.x+ox*13,ly=b.y+oy*13;
   if(lx>8&&lx<W-8&&!out.some(o=>Math.abs(o.x-lx)<6&&Math.abs(o.y-ly)<6))out.push({x:lx,y:ly})}}
 return out}
let _twBrd={h:-1};
function twBoardCv(night,map){map=map||TWMAP;const bt=twBoardTop(),bh=twBoardBot()-bt;
 if(_twBrd.h!==H)_twBrd={h:H};
 const dkey=map+'d',nkey=map+'n';
 if(!_twBrd[dkey])_twBrd[dkey]=twPaintDay(map,bt,bh);
 if(!night)return _twBrd[dkey];
 if(!_twBrd[nkey])_twBrd[nkey]=twPaintNight(map,bt,bh,_twBrd[dkey]);
 return _twBrd[nkey]}
function twPaintDay(map,bt,bh){
 const cv=document.createElement('canvas');cv.width=W;cv.height=bh;const x=cv.getContext('2d');
 const pal=TWPALS[map-1];
 let seed=4242+map*977;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 const F=(c,px,py,fw,fh)=>{x.fillStyle=c;x.fillRect(Math.round(px),Math.round(py),fw,fh)};
 const paths=TWMAPS[map-1].paths.map((_,i)=>twPathPts(map,i));
 const dp=(px,py)=>twDistM(map,px,py+bt);
 const hpp=twHeartM(map),hx=hpp.x,hy=hpp.y-bt;
 const nearHeart=(px,py,rad)=>{const a=px-hx,b=py-hy;return a*a+b*b<rad*rad};
 /* the lawn: mown in a soft checker, then blades and light flecks */
 for(let ty=0;ty*16<bh;ty++)for(let tx=0;tx<15;tx++)F((tx+ty)%2?pal.ga:pal.gb,tx*16,ty*16,16,16);
 for(let i=0;i<bh*1.3;i++){const gx=(rnd()*W)|0,gy=(rnd()*bh)|0;
  if(rnd()<.65){F(pal.blade,gx,gy,1,2);F(pal.blade,gx+1,gy-1,1,1)}else F(pal.lite,gx,gy,2,1)}
 /* The Long Beds: tilled rows between the lanes */
 if(map===2){for(let i=0;i<7;i++){const by=14+((rnd()*(bh-34))|0),bx=22+((rnd()*150)|0),bw=34+((rnd()*26)|0);
   let ok=true;for(let sx=bx;sx<=bx+bw;sx+=6)if(dp(sx,by+3)<15||nearHeart(sx,by+3,26))ok=false;
   if(!ok)continue;
   F('#6a4628',bx-1,by-1,bw+2,8);F('#8a5e38',bx,by,bw,6);F('#a87848',bx,by,bw,1);
   for(let sx=bx+3;sx<bx+bw-2;sx+=6){F('#3f8a3c',sx,by+1,2,3);F('#7cd060',sx,by+1,1,1);F('#5a3a22',sx,by+4,2,1)}}}
 /* the wall at the back: Sunkeep stone */
 const WH=9;
 F('#6f6a78',0,0,W,WH+1);F('#b9b4c2',0,0,W,WH-1);F('#dcd8e4',0,0,W,2);
 for(let row=0;row<2;row++)for(let bx=row*5-2;bx<W;bx+=11)F('#8c8798',bx,2+row*4,1,3);
 F('#8c8798',0,5,W,1);F('rgba(10,20,14,.22)',0,WH+1,W,2);
 for(let i=0;i<9;i++){const ix=(rnd()*W)|0,il=3+((rnd()*5)|0);F('#3f8a4a',ix,WH-il,2,il+2);F('#6cc070',ix,WH-il,1,1);F('#3f8a4a',ix+2,WH-il+2,1,il-1)}
 /* the fence at the front: Sprouts' own fence tile */
 for(let fx=0;fx<W;fx+=16)x.drawImage(TWTL.fence,fx,bh-16);
 F('rgba(10,20,14,.20)',0,bh-17,W,1);
 /* the path: dark edge, dirt, then wear and pebbles */
 const segs=[];
 for(const P of paths)for(let i=1;i<P.pts.length;i++){const a=P.pts[i-1],b=P.pts[i],last=i===P.pts.length-1;
  segs.push({x0:Math.min(a.x,b.x),x1:Math.max(a.x,last?hx:b.x),y0:Math.min(a.y,b.y)-bt,y1:Math.max(a.y,b.y)-bt})}
 for(const s of segs)F(pal.edge,s.x0-10,s.y0-10,s.x1-s.x0+20,s.y1-s.y0+20);
 for(const s of segs)F(pal.dirtD,s.x0-9,s.y0-9,s.x1-s.x0+18,s.y1-s.y0+18);
 for(const s of segs)F(pal.dirt,s.x0-8,s.y0-7,s.x1-s.x0+16,s.y1-s.y0+15);
 const onDirt=(px,py)=>segs.some(s=>px>=s.x0-7&&px<=s.x1+6&&py>=s.y0-6&&py<=s.y1+6);
 if(pal.stone){for(let py=0;py<bh;py++)for(let px=0;px<W;px++){if(!onDirt(px,py))continue;
   const row=(py/6)|0;if(py%6===0||(px+row*5)%10===0)F(pal.dirtD,px,py,1,1);
   else if(py%6===1&&(px+row*5)%10>1)F(pal.dirtL,px,py,1,1)}}
 else{for(let i=0;i<bh*2.2;i++){const px=(rnd()*W)|0,py=(rnd()*bh)|0;if(!onDirt(px,py))continue;
   const k=rnd();if(k<.45)F(pal.dirtD,px,py,2,1);else if(k<.75)F(pal.dirtL,px,py,1,1);
   else{F(pal.edge,px,py,2,2);F(pal.dirtL,px,py,1,1)}}}
 /* grass creeps over the path edge so it isn't a ruler line */
 for(let i=0;i<bh*3;i++){const px=(rnd()*W)|0,py=(rnd()*bh)|0,d=dp(px,py);
  if(d>8.5&&d<11.5&&py>WH+1&&py<bh-16){F(pal.blade,px,py,1,2);if(rnd()<.5)F(pal.ga,px+1,py,1,1)}}
 /* the Heart's bed: soil in a ring of pale stones */
 for(let dy=-15;dy<=15;dy++)for(let dx=-15;dx<=15;dx++){const d=Math.sqrt(dx*dx+dy*dy*1.25);
  if(d<15)F(d>12.6?'#5a3a24':((dx+dy*3)%5===0?'#75492c':'#8a5a3a'),hx+dx,hy+dy,1,1)}
 for(let i=0;i<14;i++){const a=i/14*6.283,sx=hx+Math.cos(a)*14,sy=hy+Math.sin(a)*12.5;
  F('#6f6a78',sx-2,sy-1,4,3);F('#cfcbd8',sx-2,sy-1,3,2);F('#f0eef4',sx-2,sy-1,1,1)}
 /* flowers in drifts, not confetti */
 const FC=[['#ffffff','#f8d040'],['#f85888','#ffd0e0'],['#f8c020','#a05818'],['#a8c8ff','#ffffff'],['#e878c8','#fff0a0']];
 for(let c=0;c<11;c++){const cx=12+((rnd()*(W-24))|0),cy=WH+8+((rnd()*(bh-WH-34))|0),col=FC[(rnd()*FC.length)|0],n=3+((rnd()*4)|0);
  for(let i=0;i<n;i++){const gx=cx+((rnd()*18)|0)-9,gy=cy+((rnd()*12)|0)-6;
   if(dp(gx,gy)<13||nearHeart(gx,gy,20)||gy<WH+4||gy>bh-20)continue;
   F('#2f7a3c',gx,gy+1,1,2);F(col[0],gx-1,gy,3,1);F(col[0],gx,gy-1,1,3);F(col[1],gx,gy,1,1)}}
 /* a few stones */
 for(let i=0;i<6;i++){const gx=10+((rnd()*(W-20))|0),gy=WH+8+((rnd()*(bh-WH-34))|0);
  if(dp(gx,gy)<14||nearHeart(gx,gy,22))continue;
  F('rgba(10,20,14,.25)',gx-2,gy+2,6,1);F('#77727f',gx-2,gy-1,5,3);F('#b9b4c2',gx-2,gy-1,4,2);F('#e4e0ec',gx-1,gy-1,2,1)}
 /* trees: round crowns with a lit side and a ground shadow */
 const tree=(px,py)=>{if(dp(px,py)<22||nearHeart(px,py,30))return;
  F('rgba(10,20,14,.26)',px-9,py+8,18,3);F('#4a3020',px-1,py+4,3,6);
  for(let dy=-9;dy<=7;dy++)for(let dx=-9;dx<=9;dx++){const d=Math.sqrt(dx*dx+dy*dy*1.15);
   if(d<9.4)F(d>8?'#17442f':(dx+dy<-5?'#58c06c':(dx+dy<2?'#2f8a50':'#226a40')),px+dx,py+dy,1,1)}
  F('#8ce090',px-4,py-5,2,1);F('#8ce090',px-2,py-6,2,1);F('#17442f',px+3,py+1,2,1);F('#17442f',px-3,py+3,1,1)};
 tree(226,WH+12);tree(12,bh-30);tree(228,Math.round(bh*.36));if(map!==1)tree(14,Math.round(bh*.5));
 /* lantern posts at the bends (lit by the night painter) */
 for(const L of twLampSpots(map)){const lx=L.x,ly=L.y-bt;
  F('rgba(10,20,14,.25)',lx-2,ly+3,5,1);F('#3a2c24',lx,ly-4,1,7);F('#3a2c24',lx-2,ly-9,5,6);F('#e8dcc0',lx-1,ly-8,3,4);F('#3a2c24',lx-1,ly-10,3,1)}
 /* the swarm's side: black cable creeping down the edge, a signal gate where the path comes in */
 for(let py=WH;py<bh-14;py++){const wv=3+Math.round(Math.sin(py*.37)*1.5+Math.sin(py*.11+map)*1.5);
  F('#161a26',0,py,wv,1);if(py%3===0)F('#2e3648',wv-1,py,1,1);if(py%9===4){F('#3e4a60',wv,py,2,1)}
  if(py%11===5)F('#57b8ff',1,py,1,1)}
 for(const P of paths){const ey=P.pts[0].y-bt;
  for(let dy=-20;dy<=20;dy++){const wv=Math.abs(dy)>16?10:Math.abs(dy)>11?14:12;
   F('#161a26',0,ey+dy,wv,1);F('#3e4a60',wv-1,ey+dy,1,1);if(Math.abs(dy)===16||Math.abs(dy)===20)F('#3e4a60',0,ey+dy,wv,1)}
  for(let dy=-9;dy<=9;dy++)F('#070910',0,ey+dy,11,1);
  F('#57b8ff',10,ey-14,2,2);F('#57b8ff',10,ey+13,2,2);F('#e8384f',5,ey-18,2,1);F('#57b8ff',3,ey+18,1,1);
  F('#8a94a8',12,ey-23,1,4);F('#ff5040',12,ey-24,1,1)}
 /* the other gardens are deeper in: more of his junk has landed */
 const gr=TWMAPS[map-1].grade;
 for(let i=0;i<gr*4;i++){const bx=18+((rnd()*(W-40))|0),by=WH+10+((rnd()*(bh-WH-40))|0);
  if(dp(bx,by)<16||nearHeart(bx,by,26))continue;
  F('rgba(10,20,14,.25)',bx-4,by+3,9,1);F('#20242e',bx-4,by-2,9,5);F('#5c6478',bx-3,by-1,7,3);F('#8a94a8',bx-3,by-1,4,1);
  F('#20242e',bx-6,by-3,3,1);F('#20242e',bx+4,by+2,3,1);F(i%2?'#57b8ff':'#3a4050',bx+1,by,2,1)}
 return cv}
function twPaintNight(map,bt,bh,day){
 const nc=document.createElement('canvas');nc.width=W;nc.height=bh;const nx=nc.getContext('2d');
 nx.drawImage(day,0,0);nx.fillStyle=TWPALS[map-1].night;nx.fillRect(0,0,W,bh);
 const hpp=twHeartM(map);
 /* moonlight on the path: the fight happens here, so it must stay the brightest ground */
 {const mk2=document.createElement('canvas');mk2.width=W;mk2.height=bh;const mx=mk2.getContext('2d');mx.fillStyle='#ced6ff';
  for(const P of TWMAPS[map-1].paths.map((_,i)=>twPathPts(map,i)))for(let i=1;i<P.pts.length;i++){const a=P.pts[i-1],b=P.pts[i],last=i===P.pts.length-1;
   const x0=Math.min(a.x,b.x),x1=Math.max(a.x,last?hpp.x:b.x),y0=Math.min(a.y,b.y)-bt,y1=Math.max(a.y,b.y)-bt;
   mx.fillRect(x0-8,y0-7,x1-x0+16,y1-y0+15)}
  nx.globalAlpha=.2;nx.drawImage(mk2,0,0);nx.globalAlpha=1}
 const pool=(px,py,rad,col)=>{try{const gr=nx.createRadialGradient(px,py,1,px,py,rad);
   gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');nx.fillStyle=gr;nx.fillRect(px-rad,py-rad,rad*2,rad*2)}catch(e){}};
 nx.globalCompositeOperation='lighter';
 pool(hpp.x,hpp.y-bt,52,'rgba(255,150,110,.34)');
 for(const L of twLampSpots(map))pool(L.x,L.y-bt-6,30,'rgba(255,196,96,.30)');
 for(const pth of TWMAPS[map-1].paths.map((_,i)=>twPathPts(map,i)))pool(4,pth.pts[0].y-bt,28,'rgba(70,150,255,.26)');
 nx.globalCompositeOperation='source-over';
 for(const L of twLampSpots(map)){const lx=Math.round(L.x),ly=Math.round(L.y-bt);
  nx.fillStyle='#ffd94d';nx.fillRect(lx-1,ly-8,3,4);nx.fillStyle='#fff8d0';nx.fillRect(lx,ly-7,1,2)}
 /* eyes in the bramble mouth */
 for(const pth of TWMAPS[map-1].paths.map((_,i)=>twPathPts(map,i))){const ey=Math.round(pth.pts[0].y-bt);
  nx.fillStyle='#57b8ff';nx.fillRect(3,ey-3,1,1);nx.fillRect(6,ey-3,1,1);nx.fillRect(2,ey+4,1,1);nx.fillRect(5,ey+4,1,1)}
 return nc}
