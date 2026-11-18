/* ================================================================
   SPROUTS IN 3D (cartridge 1): the big story beats, shown the way a
   64-bit console would have shown them. Real-time, low-poly, a colour
   at every corner, fog, one sun and a lamp or two.

   This is a small software renderer. Triangles are filled into a
   240-pixel-wide buffer with a depth buffer, dithered down to 15-bit
   colour, then scaled up soft. No WebGL, no textures, no assets.

   Everything in this file is named c3... or C3... (the console, Rootdeep,
   Sproutwild and Clankawatch share one scope).

   Parts: 1 the renderer, 2 shapes, 3 the valley, 4 the cast and props,
   5 the scenes, 6 playing a scene.
   ================================================================ */

/* ---------- 1. the renderer ---------- */
const c3W=240,c3NEAR=.25,c3DTH=[0,4,1,5,6,2,7,3,1,5,0,4,7,3,6,2];
let c3H=0,c3cv=null,c3cx=null,c3im=null,c3px=null,c3zb=null,c3stat={tris:0};
function c3Size(h){if(c3H===h&&c3px)return;c3H=h;if(typeof document!=='undefined'){c3cv=c3cv||document.createElement('canvas');c3cv.width=c3W;c3cv.height=h;c3cx=c3cv.getContext('2d');c3im=c3cx.createImageData(c3W,h);c3px=new Uint32Array(c3im.data.buffer)}else c3px=new Uint32Array(c3W*h);c3zb=new Float32Array(c3W*h)}
const c3HEX={};
function c3C(h){if(typeof h!=='string')return h;let c=c3HEX[h];if(!c){const n=parseInt(h.slice(1),16);c=c3HEX[h]=[n>>16,(n>>8)&255,n&255]}return c}
const c3Mix=(a,b,k)=>{a=c3C(a);b=c3C(b);return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]};
const c3Sm=(a,b,x)=>{const k=Math.max(0,Math.min(1,(x-a)/(b-a)));return k*k*(3-2*k)},c3Lp=(a,b,k)=>a+(b-a)*k;
const c3Hs=(x,y,k)=>{let n=Math.imul((x|0)+k*131,374761393)^Math.imul((y|0)+k*17,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};

/* a mesh: positions, normals, colours and glow per corner; triangles as (a, b, c, mode, alpha).
   mode 0 solid, 1 added light, 2 see-through; +8 = seen from both sides */
function c3New(){return{p:[],n:[],c:[],e:[],t:[]}}
let c3M=c3New(),c3X=[1,0,0,0,0,1,0,0,0,0,1,0],c3XS=[];
function c3Push(){c3XS.push(c3X)}
function c3Pop(){c3X=c3XS.pop()}
function c3Mul(b){const a=c3X;c3X=[a[0]*b[0]+a[1]*b[4]+a[2]*b[8],a[0]*b[1]+a[1]*b[5]+a[2]*b[9],a[0]*b[2]+a[1]*b[6]+a[2]*b[10],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3],
 a[4]*b[0]+a[5]*b[4]+a[6]*b[8],a[4]*b[1]+a[5]*b[5]+a[6]*b[9],a[4]*b[2]+a[5]*b[6]+a[6]*b[10],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7],
 a[8]*b[0]+a[9]*b[4]+a[10]*b[8],a[8]*b[1]+a[9]*b[5]+a[10]*b[9],a[8]*b[2]+a[9]*b[6]+a[10]*b[10],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]]}
function c3T(x,y,z){c3Mul([1,0,0,x,0,1,0,y,0,0,1,z])}
function c3RY(a){const c=Math.cos(a),s=Math.sin(a);c3Mul([c,0,s,0,0,1,0,0,-s,0,c,0])}
function c3RX(a){const c=Math.cos(a),s=Math.sin(a);c3Mul([1,0,0,0,0,c,-s,0,0,s,c,0])}
function c3RZ(a){const c=Math.cos(a),s=Math.sin(a);c3Mul([c,-s,0,0,s,c,0,0,0,0,1,0])}
function c3S(x,y,z){c3Mul([x,0,0,0,0,y,0,0,0,0,z,0])}
function c3V(x,y,z,nx,ny,nz,c,e){const m=c3X,M=c3M,i=M.p.length/3;M.p.push(m[0]*x+m[1]*y+m[2]*z+m[3],m[4]*x+m[5]*y+m[6]*z+m[7],m[8]*x+m[9]*y+m[10]*z+m[11]);
 const a=m[0]*nx+m[1]*ny+m[2]*nz,b=m[4]*nx+m[5]*ny+m[6]*nz,d=m[8]*nx+m[9]*ny+m[10]*nz,l=Math.hypot(a,b,d)||1;M.n.push(a/l,b/l,d/l);M.c.push(c[0],c[1],c[2]);M.e.push(e||0);return i}
/* a triangle, turned so its face agrees with the normal at its first corner */
function c3F(a,b,c,mode,al){const M=c3M,p=M.p,n=M.n,ux=p[b*3]-p[a*3],uy=p[b*3+1]-p[a*3+1],uz=p[b*3+2]-p[a*3+2],vx=p[c*3]-p[a*3],vy=p[c*3+1]-p[a*3+1],vz=p[c*3+2]-p[a*3+2];
 if((uy*vz-uz*vy)*n[a*3]+(uz*vx-ux*vz)*n[a*3+1]+(ux*vy-uy*vx)*n[a*3+2]<0){const q=b;b=c;c=q}M.t.push(a,b,c,mode||0,al===undefined?1:al)}
function c3Q(a,b,c,d,mode,al){c3F(a,b,c,mode,al);c3F(a,c,d,mode,al)}

/* the camera and the light */
let c3CE=[0,0,0],c3CR=[1,0,0],c3CU=[0,1,0],c3CF=[0,0,1],c3FL=200,c3EN=null;
function c3Cam(ex,ey,ez,tx,ty,tz,fov){if(C3GR)ey=Math.max(ey,c3G(ex,ez)+.4);let fx=tx-ex,fy=ty-ey,fz=tz-ez,l=Math.hypot(fx,fy,fz)||1;fx/=l;fy/=l;fz/=l;let rx=-fz,rz=fx;l=Math.hypot(rx,rz)||1;rx/=l;rz/=l;
 c3CE=[ex,ey,ez];c3CF=[fx,fy,fz];c3CR=[rx,0,rz];c3CU=[-rz*fy,rz*fx-rx*fz,rx*fy];c3FL=(c3W/2)/Math.tan((fov||60)*Math.PI/360)}
const C3ENV={
 night:{sky:['#050818','#16204a'],amb:[.2,.24,.4],sun:[.2,.24,.38],sd:[-.45,.75,-.5],fog:'#0b1230',fn:16,ff:80,stars:1},
 dusk:{sky:['#3a3c80','#f0a070'],amb:[.5,.42,.5],sun:[.8,.5,.34],sd:[.75,.35,-.2],fog:'#c88878',fn:22,ff:95,stars:.3},
 dawn:{sky:['#5870c0','#f8c890'],amb:[.56,.5,.52],sun:[.85,.62,.42],sd:[.7,.4,-.3],fog:'#f0c0a0',fn:22,ff:100},
 day:{sky:['#3a86e0','#c8e8f8'],amb:[.6,.64,.7],sun:[.72,.7,.6],sd:[.35,.8,.45],fog:'#c0def0',fn:26,ff:110},
 gold:{sky:['#f08838','#f8e098'],amb:[.74,.62,.42],sun:[.95,.8,.45],sd:[.3,.7,.5],fog:'#f8d890',fn:24,ff:100}};
function c3Env(a,b,k){const A=C3ENV[a],B=C3ENV[b||a];k=k||0;const m=(p,q)=>[c3Lp(p[0],q[0],k),c3Lp(p[1],q[1],k),c3Lp(p[2],q[2],k)];
 c3EN={sky:[c3Mix(A.sky[0],B.sky[0],k),c3Mix(A.sky[1],B.sky[1],k)],amb:m(A.amb,B.amb),sun:m(A.sun,B.sun),sd:m(A.sd,B.sd),fog:c3Mix(A.fog,B.fog,k),fn:c3Lp(A.fn,B.fn,k),ff:c3Lp(A.ff,B.ff,k),stars:c3Lp(A.stars||0,B.stars||0,k),lamps:[]};
 const l=Math.hypot(...c3EN.sd);c3EN.sd=c3EN.sd.map(v=>v/l);return c3EN}
function c3Lamp(x,y,z,col,R,k){const c=c3C(col);c3EN.lamps.push([x,y,z,c[0]/255*k,c[1]/255*k,c[2]/255*k,R*R])}

/* sky: a gradient down to the horizon, stars that hold still as the camera turns, a moon */
const C3STAR=[];for(let i=0;i<90;i++){const a=c3Hs(i,3,1)*6.283,y=.06+c3Hs(i,5,2)*.9,q=Math.sqrt(1-y*y);C3STAR.push([Math.cos(a)*q,y,Math.sin(a)*q,c3Hs(i,7,3)])}
function c3Sky(t){const E=c3EN,H=c3H,px=c3px,f=c3CF,pit=Math.asin(Math.max(-1,Math.min(1,f[1]))),yh=H/2+Math.tan(pit)*c3FL,z=E.sky[0],h=E.sky[1],fg=E.fog,span=c3FL*.85;
 for(let y=0;y<H;y++){let r,g,b;if(y>=yh){r=fg[0];g=fg[1];b=fg[2]}else{const k=Math.max(0,Math.min(1,(yh-y)/span)),q=Math.sqrt(k);r=h[0]+(z[0]-h[0])*q;g=h[1]+(z[1]-h[1])*q;b=h[2]+(z[2]-h[2])*q;if(k<.12){const u=1-k/.12;r+=(fg[0]-r)*u*.6;g+=(fg[1]-g)*u*.6;b+=(fg[2]-b)*u*.6}}
  const d=c3DTH[(y&3)*4],d2=c3DTH[(y&3)*4+1],d3=c3DTH[(y&3)*4+2],d4=c3DTH[(y&3)*4+3],o=y*c3W,pk=q=>(255<<24)|(Math.min(255,b+q)&248)<<16|(Math.min(255,g+q)&248)<<8|(Math.min(255,r+q)&248),c0=pk(d),c1=pk(d2),c2=pk(d3),c4=pk(d4);
  for(let x=0;x<c3W;x+=4){px[o+x]=c0;px[o+x+1]=c1;px[o+x+2]=c2;px[o+x+3]=c4}}
 if(E.stars>0)for(const s of C3STAR){const zc=s[0]*f[0]+s[1]*f[1]+s[2]*f[2];if(zc<.1)continue;const x=(c3W/2+(s[0]*c3CR[0]+s[2]*c3CR[2])*c3FL/zc)|0,y=(H/2-(s[0]*c3CU[0]+s[1]*c3CU[1]+s[2]*c3CU[2])*c3FL/zc)|0;
  if(x<0||y<0||x>=c3W||y>=H||y>=yh-2)continue;const v=(120+s[3]*135)*E.stars*(.75+.25*Math.sin(t*2+s[3]*40))|0;px[y*c3W+x]=(255<<24)|v<<16|v<<8|(v*.92|0)}
 c3zb.fill(0)}
function c3Moon(dx,dy,dz,rad,col){const f=c3CF,l=Math.hypot(dx,dy,dz),x0=dx/l,y0=dy/l,z0=dz/l,zc=x0*f[0]+y0*f[1]+z0*f[2];if(zc<.15)return;const c=c3C(col),cx=c3W/2+(x0*c3CR[0]+z0*c3CR[2])*c3FL/zc,cy=c3H/2-(x0*c3CU[0]+y0*c3CU[1]+z0*c3CU[2])*c3FL/zc,R=rad*c3FL/200;
 for(let y=Math.max(0,(cy-R)|0);y<=Math.min(c3H-1,cy+R);y++)for(let x=Math.max(0,(cx-R)|0);x<=Math.min(c3W-1,cx+R);x++){const q=(x-cx)*(x-cx)+(y-cy)*(y-cy);if(q<=R*R){const k=((x-cx+R*.35)*(x-cx+R*.35)+(y-cy+R*.2)*(y-cy+R*.2))<R*R*.9?1:.82;c3px[y*c3W+x]=(255<<24)|(c[2]*k&248)<<16|(c[1]*k&248)<<8|(c[0]*k&248)}}}

/* one triangle into the buffer: colours run smoothly corner to corner, depth is tested per pixel */
function c3Ras(x0,y0,w0,r0,g0,b0,x1,y1,w1,r1,g1,b1,x2,y2,w2,r2,g2,b2,mode,al){
 const area=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);if(area>-1e-4&&area<1e-4)return;const inv=1/area,ax=y2-y0,bx=y1-y0,ay=x1-x0,by=x2-x0;
 const wdx=((w1-w0)*ax-(w2-w0)*bx)*inv,wdy=((w2-w0)*ay-(w1-w0)*by)*inv,rdx=((r1-r0)*ax-(r2-r0)*bx)*inv,rdy=((r2-r0)*ay-(r1-r0)*by)*inv,
  gdx=((g1-g0)*ax-(g2-g0)*bx)*inv,gdy=((g2-g0)*ay-(g1-g0)*by)*inv,bdx=((b1-b0)*ax-(b2-b0)*bx)*inv,bdy=((b2-b0)*ay-(b1-b0)*by)*inv;
 let ya=y0,yb=y1,yc=y2,xa=x0,xb=x1,xc=x2,q;if(yb<ya){q=ya;ya=yb;yb=q;q=xa;xa=xb;xb=q}if(yc<ya){q=ya;ya=yc;yc=q;q=xa;xa=xc;xc=q}if(yc<yb){q=yb;yb=yc;yc=q;q=xb;xb=xc;xc=q}
 const H=c3H,W=c3W,px=c3px,zb=c3zb,ys=Math.max(0,Math.ceil(ya-.5)),ye=Math.min(H-1,Math.ceil(yc-.5)-1),hl=yc-ya;if(hl<=0)return;c3stat.tris++;
 for(let y=ys;y<=ye;y++){const yy=y+.5,xl0=xa+(xc-xa)*(yy-ya)/hl,xr0=yy<yb?(yb-ya>0?xa+(xb-xa)*(yy-ya)/(yb-ya):xb):(yc-yb>0?xb+(xc-xb)*(yy-yb)/(yc-yb):xb);
  let xs=xl0<xr0?xl0:xr0,xe=xl0<xr0?xr0:xl0;xs=Math.max(0,Math.ceil(xs-.5));xe=Math.min(W-1,Math.ceil(xe-.5)-1);if(xe<xs)continue;
  const fx=xs+.5-x0,fy=yy-y0;let w=w0+fx*wdx+fy*wdy,r=r0+fx*rdx+fy*rdy,g=g0+fx*gdx+fy*gdy,b=b0+fx*bdx+fy*bdy,i=y*W+xs;const dr=(y&3)*4;
  if(mode===0)for(let x=xs;x<=xe;x++,i++){if(w>zb[i]){zb[i]=w;const d=c3DTH[dr+(x&3)];let R=r+d,G=g+d,B=b+d;R=R<0?0:R>255?255:R;G=G<0?0:G>255?255:G;B=B<0?0:B>255?255:B;px[i]=(255<<24)|(B&248)<<16|(G&248)<<8|(R&248)}w+=wdx;r+=rdx;g+=gdx;b+=bdx}
  else if(mode===1)for(let x=xs;x<=xe;x++,i++){if(w>zb[i]){const p=px[i],d=c3DTH[dr+(x&3)];let R=(p&255)+(r>0?r*al:0)+d,G=((p>>8)&255)+(g>0?g*al:0)+d,B=((p>>16)&255)+(b>0?b*al:0)+d;R=R>255?255:R;G=G>255?255:G;B=B>255?255:B;px[i]=(255<<24)|(B&248)<<16|(G&248)<<8|(R&248)}w+=wdx;r+=rdx;g+=gdx;b+=bdx}
  else for(let x=xs;x<=xe;x++,i++){if(w>zb[i]){const p=px[i],d=c3DTH[dr+(x&3)],pr=p&255,pg=(p>>8)&255,pb=(p>>16)&255;let R=pr+(r-pr)*al+d,G=pg+(g-pg)*al+d,B=pb+(b-pb)*al+d;R=R<0?0:R>255?255:R;G=G<0?0:G>255?255:G;B=B<0?0:B>255?255:B;px[i]=(255<<24)|(B&248)<<16|(G&248)<<8|(R&248)}w+=wdx;r+=rdx;g+=gdx;b+=bdx}}}
let c3DS=null;
/* draw a mesh: every corner is moved in front of the camera, lit and fogged once; then its triangles are filled.
   Solid ones first, then light and glass, so those blend over what is behind them. */
function c3Draw(M,pass){const n=M.p.length/3;if(!n)return;let S=M._s;if(!S||S.length<n*8){if(M===c3D&&c3DS&&c3DS.length>=n*8)S=c3DS;else{S=new Float32Array((n+512)*8);if(M===c3D)c3DS=S}M._s=S}
 const E=c3EN,P=M.p,N=M.n,C=M.c,EM=M.e,ce=c3CE,R=c3CR,U=c3CU,F=c3CF,fl=c3FL,hw=c3W/2,hh=c3H/2,amb=E.amb,sun=E.sun,sd=E.sd,fog=E.fog,fn=E.fn,fr=1/(E.ff-E.fn),L=E.lamps;
 if(pass!==1||!M._lit){M._lit=1;for(let i=0;i<n;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2],dx=x-ce[0],dy=y-ce[1],dz=z-ce[2],xc=dx*R[0]+dz*R[2],yc=dx*U[0]+dy*U[1]+dz*U[2],zc=dx*F[0]+dy*F[1]+dz*F[2],o=i*8;
  const nx=N[i*3],ny=N[i*3+1],nz=N[i*3+2],e0=EM[i],e=e0>1?1:e0;let lr=amb[0],lg=amb[1],lb=amb[2],d=nx*sd[0]+ny*sd[1]+nz*sd[2];if(d>0){lr+=sun[0]*d;lg+=sun[1]*d;lb+=sun[2]*d}
  for(let k=0;k<L.length;k++){const l=L[k],ax=l[0]-x,ay=l[1]-y,az=l[2]-z,q=ax*ax+ay*ay+az*az;if(q>l[6]*90)continue;let nd=(nx*ax+ny*ay+nz*az)/Math.sqrt(q+.001);if(nd<.25)nd=.25;const a=nd/(1+q/l[6]);lr+=l[3]*a;lg+=l[4]*a;lb+=l[5]*a}
  let r=C[i*3]*(e+(1-e)*lr),g=C[i*3+1]*(e+(1-e)*lg),b=C[i*3+2]*(e+(1-e)*lb),f=(zc-fn)*fr;f=f<0?0:f>1?1:f;if(e0>1)f=0;else if(e>0)f*=1-e*.6;
  r+=(fog[0]-r)*f;g+=(fog[1]-g)*f;b+=(fog[2]-b)*f;
  S[o]=xc;S[o+1]=yc;S[o+2]=zc;S[o+3]=r>255?255:r;S[o+4]=g>255?255:g;S[o+5]=b>255?255:b;if(zc>c3NEAR){const w=1/zc;S[o+6]=hw+xc*fl*w;S[o+7]=hh-yc*fl*w}}}
 const T=M.t,W=c3W,H=c3H;
 for(let k=0;k<T.length;k+=5){const md=T[k+3],mode=md&7;if(pass===0?mode!==0:mode===0)continue;const a=T[k]*8,b=T[k+1]*8,c=T[k+2]*8,za=S[a+2],zb=S[b+2],zc=S[c+2],al=T[k+4];
  if(za>c3NEAR&&zb>c3NEAR&&zc>c3NEAR){const x0=S[a+6],y0=S[a+7],x1=S[b+6],y1=S[b+7],x2=S[c+6],y2=S[c+7];
   if((x0<0&&x1<0&&x2<0)||(x0>W&&x1>W&&x2>W)||(y0<0&&y1<0&&y2<0)||(y0>H&&y1>H&&y2>H))continue;
   if(!(md&8)&&(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0)>=0)continue;
   c3Ras(x0,y0,1/za,S[a+3],S[a+4],S[a+5],x1,y1,1/zb,S[b+3],S[b+4],S[b+5],x2,y2,1/zc,S[c+3],S[c+4],S[c+5],mode,al)}
  else if(za>c3NEAR||zb>c3NEAR||zc>c3NEAR){ /* crosses the near plane: cut it there */
   const V=[a,b,c],o=[];for(let i=0;i<3;i++){const p=V[i],q=V[(i+1)%3],zp=S[p+2],zq=S[q+2];if(zp>c3NEAR)o.push([S[p],S[p+1],zp,S[p+3],S[p+4],S[p+5]]);
    if((zp>c3NEAR)!==(zq>c3NEAR)){const u=(c3NEAR-zp)/(zq-zp);o.push([S[p]+(S[q]-S[p])*u,S[p+1]+(S[q+1]-S[p+1])*u,c3NEAR,S[p+3]+(S[q+3]-S[p+3])*u,S[p+4]+(S[q+4]-S[p+4])*u,S[p+5]+(S[q+5]-S[p+5])*u])}}
   for(const v of o){const w=1/v[2];v[6]=hw+v[0]*fl*w;v[7]=hh-v[1]*fl*w;v[2]=w}
   for(let i=1;i+1<o.length;i++){const p=o[0],q=o[i],s=o[i+1];if(!(md&8)&&(q[6]-p[6])*(s[7]-p[7])-(s[6]-p[6])*(q[7]-p[7])>=0)continue;c3Ras(p[6],p[7],p[2],p[3],p[4],p[5],q[6],q[7],q[2],q[3],q[4],q[5],s[6],s[7],s[2],s[3],s[4],s[5],mode,al)}}}}
/* is a ball of this size anywhere in the picture? (generous: it only has to rule out what is plainly off screen) */
function c3Seen(c,R){const dx=c[0]-c3CE[0],dy=c[1]-c3CE[1],dz=c[2]-c3CE[2],zc=dx*c3CF[0]+dy*c3CF[1]+dz*c3CF[2];if(zc<-R)return false;const xc=dx*c3CR[0]+dz*c3CR[2],yc=dx*c3CU[0]+dy*c3CU[1]+dz*c3CU[2],k=(zc+R)/c3FL;
 return Math.abs(xc)<=k*c3W/2+R*1.5&&Math.abs(yc)<=k*c3H/2+R*1.5}
function c3Show(solid,clear){for(const m of solid)if(!m.bc||c3Seen(m.bc,m.br)){m._lit=0;c3Draw(m,0)}for(const m of clear){m._lit=0;c3Draw(m,0)}for(const m of clear)c3Draw(m,1)}

/* ---------- 2. shapes ---------- */
function c3Box(x0,y0,z0,x1,y1,z1,c,c2,e,mode,al){c=c3C(c);c2=c2?c3C(c2):c;const f=(nx,ny,nz,P)=>{const i=P.map(p=>c3V(p[0],p[1],p[2],nx,ny,nz,p[1]===y1?c2:c,e));c3Q(i[0],i[1],i[2],i[3],mode,al)};
 f(0,1,0,[[x0,y1,z0],[x0,y1,z1],[x1,y1,z1],[x1,y1,z0]]);f(0,-1,0,[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]]);f(0,0,1,[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]);
 f(0,0,-1,[[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[x1,y0,z0]]);f(1,0,0,[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]]);f(-1,0,0,[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]])}
/* a tube, cone or prism round the Y axis: n sides, radius r0 at y0 and r1 at y1 */
function c3Cyl(n,r0,r1,y0,y1,c,c2,e,flat,off,mode,al){c=c3C(c);c2=c2?c3C(c2):c;const sl=(r0-r1)/(y1-y0||1),o=off||0,B=[],Tp=[];
 for(let i=0;i<=n;i++){const a=i/n*6.2832+o,ca=Math.cos(a),sa=Math.sin(a);if(flat){const am=(i+.5)/n*6.2832+o,cm=Math.cos(am),sm=Math.sin(am);
   if(i<n){const a2=(i+1)/n*6.2832+o,c2a=Math.cos(a2),s2a=Math.sin(a2),v0=c3V(r0*ca,y0,r0*sa,cm,sl,sm,c,e),v1=c3V(r0*c2a,y0,r0*s2a,cm,sl,sm,c,e),v2=c3V(r1*c2a,y1,r1*s2a,cm,sl,sm,c2,e),v3=c3V(r1*ca,y1,r1*sa,cm,sl,sm,c2,e);if(r1>0)c3Q(v0,v1,v2,v3,mode,al);else c3F(v0,v1,v3,mode,al)}}
  else{B.push(c3V(r0*ca,y0,r0*sa,ca,sl,sa,c,e));Tp.push(c3V(r1*ca,y1,r1*sa,ca,sl,sa,c2,e))}}
 if(!flat)for(let i=0;i<n;i++){if(r1>0)c3Q(B[i],B[i+1],Tp[i+1],Tp[i],mode,al);else c3F(B[i],B[i+1],Tp[i],mode,al)}
 if(r1>0){const m=c3V(0,y1,0,0,1,0,c2,e),R=[];for(let i=0;i<n;i++){const a=i/n*6.2832+o;R.push(c3V(r1*Math.cos(a),y1,r1*Math.sin(a),0,1,0,c2,e))}for(let i=0;i<n;i++)c3F(m,R[i],R[(i+1)%n],mode,al)}}
/* a ball or egg: c at the bottom, c2 at the top; lo and hi cut it (0 to 1, bottom to top) */
function c3Ball(rx,ry,rz,c,c2,S,Rg,e,lo,hi,mode,al){c=c3C(c);c2=c2?c3C(c2):c;S=S||7;Rg=Rg||5;lo=lo||0;hi=hi===undefined?1:hi;const I=[];
 for(let j=0;j<=Rg;j++){const u=lo+(hi-lo)*j/Rg,ph=(u-.5)*Math.PI,cp=Math.cos(ph),sp=Math.sin(ph),col=[c[0]+(c2[0]-c[0])*u,c[1]+(c2[1]-c[1])*u,c[2]+(c2[2]-c[2])*u],row=[];
  for(let i=0;i<=S;i++){const a=i/S*6.2832,x=cp*Math.cos(a),z=cp*Math.sin(a);row.push(c3V(rx*x,ry*sp,rz*z,x/rx,sp/ry,z/rz,col,e))}I.push(row)}
 for(let j=0;j<Rg;j++)for(let i=0;i<S;i++){const a=I[j][i],b=I[j][i+1],d=I[j+1][i+1],f=I[j+1][i],bot=lo+(hi-lo)*j/Rg<=.001,top=lo+(hi-lo)*(j+1)/Rg>=.999;if(bot)c3F(f,a,d,mode,al);else if(top)c3F(a,b,f,mode,al);else c3Q(a,b,d,f,mode,al)}}
/* a soft light that always faces the camera: bright in the middle, nothing at the rim */
function c3Glow(x,y,z,rad,col,al){col=c3C(col);const m=c3X,wx=m[0]*x+m[1]*y+m[2]*z+m[3],wy=m[4]*x+m[5]*y+m[6]*z+m[7],wz=m[8]*x+m[9]*y+m[10]*z+m[11],M=c3M,R=c3CR,U=c3CU,i0=M.p.length/3,K=[0,0,0];
 M.p.push(wx,wy,wz);M.n.push(0,1,0);M.c.push(col[0],col[1],col[2]);M.e.push(2);
 for(let i=0;i<8;i++){const a=i/8*6.2832,ca=Math.cos(a)*rad,sa=Math.sin(a)*rad;M.p.push(wx+R[0]*ca+U[0]*sa,wy+U[1]*sa,wz+R[2]*ca+U[2]*sa);M.n.push(0,1,0);M.c.push(K[0],K[1],K[2]);M.e.push(2)}
 for(let i=0;i<8;i++)M.t.push(i0,i0+1+i,i0+1+(i+1)%8,9,al===undefined?1:al)}
/* a flat round patch on the ground: shadows and ripples */
function c3Disc(x,y,z,rad,col,al,mode,rz){col=c3C(col);const m=c3V(x,y,z,0,1,0,col,0),R=[];for(let i=0;i<8;i++){const a=i/8*6.2832;R.push(c3V(x+Math.cos(a)*rad,y,z+Math.sin(a)*(rz||rad),0,1,0,col,0))}for(let i=0;i<8;i++)c3M.t.push(m,R[i],R[(i+1)%8],(mode||2)|8,al)}
/* a shaft of light from one point to another: two crossed blades, bright at the root */
function c3Beam(x0,y0,z0,x1,y1,z1,w0,w1,col,al){col=c3C(col);const far=[col[0]*.55,col[1]*.55,col[2]*.55],dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.hypot(dx,dy,dz)||1,ax=-dz/l,az=dx/l,M=c3M;
 const q=(ox,oy,oz)=>{const i=M.p.length/3;[[x0,y0,z0,w0,col],[x1,y1,z1,w1,far]].forEach(([x,y,z,w,c])=>{for(const s of[-1,1]){M.p.push(x+ox*w*s,y+oy*w*s,z+oz*w*s);M.n.push(0,1,0);M.c.push(c[0],c[1],c[2]);M.e.push(2)}});M.t.push(i,i+1,i+3,9,al,i,i+3,i+2,9,al)};
 q(ax,0,az);q(0,1,0)}

/* ---------- 3. the valley ---------- */
const c3Nz=(x,z)=>Math.sin(x*.31+z*.17)*.5+Math.sin(x*.13-z*.29+1.7)*.5+Math.sin(x*.71+z*.53+.6)*.2;
const C3RIV=[[13,-22],[19,-14.5],[27,-12],[36,-11.5],[47,-11]],C3WL=-.32,C3TW=[55,-12],C3DR=[20.5,3.2];
function c3RivD(x,z){let b=1e9;for(let i=0;i<C3RIV.length-1;i++){const ax=C3RIV[i][0],az=C3RIV[i][1],dx=C3RIV[i+1][0]-ax,dz=C3RIV[i+1][1]-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz))),d=Math.hypot(x-ax-dx*t,z-az-dz*t);if(d<b)b=d}return b}
/* height of the ground: a flat green bowl round the Lantern, hills all about, the Crooked River cutting east to the lake */
function c3ValH(x,z){const r=Math.hypot(x,z*1.1),hill=c3Sm(15,30,r)*(1-c3Sm(25,34,x));let h=hill*(5.2+c3Nz(x,z)*2.4)+c3Nz(x*.9,z*.9)*.05+.08;
 if(x>32)h+=c3Sm(32,38,x)*(.3+c3Nz(x*1.1,z*1.1)*.22); /* dunes */
 const d=c3RivD(x,z);h*=c3Sm(1.2,7,d);if(d<2.2)h=Math.min(h,-.75*(1-d/2.2)+.02);
 h=c3Lp(h,-1.1,c3Sm(45,50,x));
 {const dp=Math.hypot(x+14,z-6);if(dp<5)h=Math.min(h,.1-.8*(1-(dp/5)*(dp/5)))} /* the Dew Pond */
 const dl=Math.hypot(x-C3TW[0],z-C3TW[1]);if(dl<4.6)h=Math.max(h,1.25*(1-(dl/4.6)*(dl/4.6))-.3);
 return h}
let C3VAL=null,C3TREES=[],C3GR=null;const C3GX=-36,C3GZ=-40,C3GC=2,C3GW=53,C3GH=36;
function c3G(x,z){if(!C3GR)return Math.max(C3WL,c3ValH(x,z));let fx=(x-C3GX)/C3GC,fz=(z-C3GZ)/C3GC;fx=Math.max(0,Math.min(C3GW-1.001,fx));fz=Math.max(0,Math.min(C3GH-1.001,fz));const i=fx|0,j=fz|0;fx-=i;fz-=j;
 const a=C3GR[j*C3GW+i],b=C3GR[j*C3GW+i+1],c=C3GR[(j+1)*C3GW+i],d=C3GR[(j+1)*C3GW+i+1];let h;if((i+j)&1)h=fx+fz<=1?a+(b-a)*fx+(c-a)*fz:d+(c-d)*(1-fx)+(b-d)*(1-fz);else h=fx>=fz?a+(b-a)*fx+(d-b)*fz:a+(d-c)*fx+(c-a)*fz;return Math.max(C3WL,h)}
function c3Tree(x,z,h,k){const y=c3G(x,z),d=['#1c5038','#184838','#285020','#122c28'][k%4],l=['#3c9858','#38907c','#58a040','#285c44'][k%4];c3Push();c3T(x,y-.1,z);c3Cyl(5,.2*h/3,.13*h/3,0,h*.42,'#3c2414','#6a4428');
 if(k%3===0){c3Cyl(6,h*.34,0,h*.3,h*.72,d,l);c3Cyl(6,h*.25,0,h*.58,h*1.05,d,l)}else{c3T(0,h*.68,0);c3Ball(h*.34,h*.36,h*.34,d,l,6,4)}c3Pop()}
function c3BuildValley(){const CH={},CS=13,pick=(x,z)=>{const k=Math.floor((x-C3GX)/CS)+','+Math.floor((z-C3GZ)/CS);c3M=CH[k]||(CH[k]=c3New());return c3M};c3M=c3New();const X0=C3GX,X1=68,Z0=C3GZ,Z1=30,cs=C3GC,nx=(X1-X0)/cs,nz=(Z1-Z0)/cs,I=[],GR=new Float32Array(C3GW*C3GH);c3X=[1,0,0,0,0,1,0,0,0,0,1,0];C3GR=null;
 for(let j=0;j<=nz;j++){const row=[];for(let i=0;i<=nx;i++){const x=X0+i*cs,z=Z0+j*cs,h=c3ValH(x,z),e=.5,hx=c3ValH(x+e,z)-c3ValH(x-e,z),hz=c3ValH(x,z+e)-c3ValH(x,z-e),d=c3RivD(x,z);
   let c=c3Mix('#4cb050','#2c7848',c3Sm(.5,5,h));c=c3Mix(c,'#285c44',c3Sm(4,7.5,h));const sand=Math.max(c3Sm(3.4,1.4,d)*(h<.8?1:0),c3Sm(36,42,x));c=c3Mix(c,'#d8c088',sand);if(h<C3WL-.1)c=c3Mix(c,'#3a6890',.7);
   GR[j*C3GW+i]=h;const v=.9+c3Hs(i,j,9)*.2;row.push([x,h,z,-hx,2*e,-hz,[c[0]*v,c[1]*v,c[2]*v]])}I.push(row)}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const M=pick(X0+i*cs+1,Z0+j*cs+1),vc=M._vc||(M._vc={}),V=(a,b)=>{const k=b*C3GW+a;if(vc[k]===undefined){const q=I[b][a];vc[k]=c3V(q[0],q[1],q[2],q[3],q[4],q[5],q[6],0)}return vc[k]},a=V(i,j),b=V(i+1,j),c=V(i,j+1),d=V(i+1,j+1);
  if((i+j)&1){c3F(a,c,b);c3F(b,c,d)}else{c3F(a,c,d);c3F(a,d,b)}}
 C3GR=GR;
 /* the paths that cross at the Lantern, and the soil below it */
 const strip=(ax,az,bx,bz,w,col)=>{const n=Math.ceil(Math.hypot(bx-ax,bz-az)/1.5),dx=bx-ax,dz=bz-az,l=Math.hypot(dx,dz),px=-dz/l*w,pz=dx/l*w;let pa=null;for(let k=0;k<=n;k++){const x=ax+dx*k/n,z=az+dz*k/n,c=c3C(col),v=.92+c3Hs(k,ax,4)*.16,cc=[c[0]*v,c[1]*v,c[2]*v],A=[x+px,c3G(x+px,z+pz)+.05,z+pz],B=[x-px,c3G(x-px,z-pz)+.05,z-pz];if(pa){pick(x,z);const i0=c3V(...pa[0],0,1,0,pa[2],0),i1=c3V(...pa[1],0,1,0,pa[2],0),i2=c3V(...B,0,1,0,cc,0),i3=c3V(...A,0,1,0,cc,0);c3Q(i0,i1,i2,i3)}pa=[A,B,cc]}};
 strip(-15,0,C3DR[0]-.5,C3DR[1]*.9,.8,'#d8b878');strip(0,-14,0,-1.6,.8,'#d8b878');strip(0,1.6,0,15,.8,'#d8b878');
 pick(0,3);c3Box(-2.6,.02,2.2,2.6,.16,4.6,'#6e4428','#8a5a3a');
 /* trees: thick on the hills, a few in the bowl, none on the paths, the river or the sand */
 C3TREES=[];for(let k=0;k<420&&C3TREES.length<150;k++){const x=X0+2+c3Hs(k,1,21)*(X1-X0-4),z=Z0+2+c3Hs(k,2,22)*(Z1-Z0-4),r=Math.hypot(x,z);if(r<7.5||x>35||c3RivD(x,z)<3.4||(Math.abs(z)<1.8&&x>-16&&x<22)||(Math.abs(x)<1.8&&Math.abs(z)<16)||Math.hypot(x-C3DR[0],z-C3DR[1])<4||Math.hypot(x+11,z-5)<8)continue;
  if(r<15&&c3Hs(k,3,23)>.22)continue;const h=2.6+c3Hs(k,4,24)*2.2;C3TREES.push([x,z,h]);pick(x,z);c3Tree(x,z,h,k)}
 /* rocks on the lighthouse island and along the river */
 for(let k=0;k<26;k++){const a=c3Hs(k,5,31)*6.28,rr=1.5+c3Hs(k,6,32)*2.6,x=k<12?C3TW[0]+Math.cos(a)*rr:C3RIV[1+k%3][0]+(c3Hs(k,7,33)-.5)*9,z=k<12?C3TW[1]+Math.sin(a)*rr:C3RIV[1+k%3][1]+(c3Hs(k,8,34)-.5)*5,s=.25+c3Hs(k,9,35)*.4;pick(x,z);c3Push();c3T(x,c3G(x,z)+s*.3,z);c3RY(a);c3Ball(s*1.3,s,s,'#484058','#8088a0',5,3);c3Pop()}
 C3VAL=Object.values(CH).filter(M=>M.t.length).map(M=>{const n=M.p.length/3;let cx=0,cy=0,cz=0,R=0;for(let i=0;i<n;i++){cx+=M.p[i*3];cy+=M.p[i*3+1];cz+=M.p[i*3+2]}cx/=n;cy/=n;cz/=n;for(let i=0;i<n;i++)R=Math.max(R,Math.hypot(M.p[i*3]-cx,M.p[i*3+1]-cy,M.p[i*3+2]-cz));
  return{p:new Float32Array(M.p),n:new Float32Array(M.n),c:new Float32Array(M.c),e:new Float32Array(M.e),t:M.t,bc:[cx,cy,cz],br:R}});c3M=c3New();return C3VAL}
/* the river and the lake: one sheet of water whose colour shifts corner by corner */
function c3Water(t,night){const cs=6,X0=-24,X1=74,Z0=-42,Z1=30,nx=Math.ceil((X1-X0)/cs),nz=Math.ceil((Z1-Z0)/cs),I=[],a=c3C(night?'#12244e':'#2c74cc'),b=c3C(night?'#28488a':'#78b8f8');
 for(let j=0;j<=nz;j++){const row=[];for(let i=0;i<=nx;i++){const x=X0+i*cs,z=Z0+j*cs,k=.5+.5*Math.sin(t*1.3+x*.9+z*1.7)*Math.sin(t*.8+z*.6-x*.4);row.push(c3V(x,C3WL+Math.sin(t*1.1+x+z)*.02,z,0,1,0,[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k],.25))}I.push(row)}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++)c3Q(I[j][i],I[j+1][i],I[j+1][i+1],I[j][i+1],2,.82)}

/* ---------- 4. the cast and the props ---------- */
const C3K=[40,32,56];
function c3Shadow(x,y,z,rad){c3Disc(x,y+.04,z,rad,[0,0,0],.3)}
/* a person: big head, small body, the way the sprites are. o: cap, capL, coat, coatL, kind, walk, up, arm */
function c3Person(x,z,ang,o){const y=o.y!==undefined?o.y:c3G(x,z),wk=o.walk?1:0,sw=Math.sin((o.walk||0)*9)*.6*wk,bob=Math.abs(Math.sin((o.walk||0)*9))*.05*wk,sk=c3C(o.skin||'#f8dcb0'),bt='#583828';
 if(!o.sit)c3Shadow(x,y,z,.44);c3Push();c3T(x,y+bob,z);c3RY(ang);
 for(const s of[-1,1]){c3Push();c3T(s*.13,.36,0);c3RX(o.sit?-1.25+s*.08:s*sw);c3Box(-.1,-.36,-.11,.1,0,.13,bt,o.legs||o.coat);c3Pop()}
 if(o.kind==='erin')c3Cyl(6,.36,.2,.24,.84,o.coat,o.coatL);else c3Cyl(6,.27,.21,.3,.84,o.coat,o.coatL);
 for(const s of[-1,1]){c3Push();c3T(s*.3,.78,0);c3RZ(s*.2);c3RX(-s*sw+(o.arm&&s>0?-o.arm:0)+(o.arms?-o.arms:0));c3Box(-.07,-.4,-.07,.07,0,.07,o.coat,o.coatL);c3Box(-.065,-.5,-.065,.065,-.4,.065,sk);c3Pop()}
 c3T(0,1.12,0);c3RX(-(o.up||0));c3Ball(.3,.28,.29,c3Mix(sk,'#d8a880',.5),sk,8,5);
 c3Box(-.17,-.04,.255,-.09,.07,.295,C3K);c3Box(.09,-.04,.255,.17,.07,.295,C3K);
 if(o.kind==='erin'){c3Ball(.33,.3,.32,o.cap,o.capL,8,3,0,.52,1);c3Push();c3T(0,-.04,-.14);c3Ball(.32,.34,.24,o.cap,o.capL,7,4);c3Pop();c3Box(-.33,-.2,-.1,-.25,.12,.14,o.cap);c3Box(.25,-.2,-.1,.33,.12,.14,o.cap)}
 else{c3Ball(.325,.3,.315,o.cap,o.capL,8,3,0,.5,1);c3Box(-.24,.02,.18,.24,.07,.5,o.cap,o.capL);if(o.kind==='marcus'){c3Box(-.2,-.24,.16,.2,-.1,.3,'#704828');c3Box(-.26,-.22,-.05,-.19,-.02,.26,'#704828');c3Box(.19,-.22,-.05,.26,-.02,.26,'#704828')}else c3Box(-.3,-.12,-.26,.3,.04,-.1,'#583828')}
 c3Pop()}
const c3Look=()=>{const c=STY.cap[meta.eq.cap],t=STY.coat[meta.eq.coat];return{cap:c[1],capL:c[2],coat:t[1],coatL:t[2],kind:'will'}};
const C3ERIN={cap:'#b84828',capL:'#e87848',coat:'#9070d0',coatL:'#c0a8f0',kind:'erin'},C3MARC={cap:'#284878',capL:'#5080b8',coat:'#e88020',coatL:'#f8c060',kind:'marcus'},C3DEREK={cap:'#1c4a98',capL:'#2a6ad0',coat:'#7a2a20',coatL:'#a03a2e',legs:'#3c4a66',skin:'#e8b088',kind:'marcus'};
/* a sprout: a round body in its own colours, two eyes, a stem with a leaf, a bud or a flower */
function c3Sprout(x,z,type,o){o=o||{};const T=TYPES[type%TYPES.length],y=(o.y!==undefined?o.y:c3G(x,z))+(o.hop||0),st=o.stage===undefined?2:o.stage;
 if(!o.noSh)c3Shadow(x,y-(o.hop||0),z,.2);c3Push();c3T(x,y,z);c3RY(o.ang||0);if(o.s)c3S(o.s,o.s,o.s);
 c3Push();c3T(0,.21,0);if(type%TYPES.length===1)c3Box(-.19,-.2,-.19,.19,.19,.19,T.d,T.c);else c3Ball(.2,.21,.2,T.d,c3Mix(T.c,T.l,.35),7,4);c3Pop();
 c3Box(-.11,.2,.165,-.05,.3,.2,C3K);c3Box(.05,.2,.165,.11,.3,.2,C3K);c3Box(-.02,.4,-.02,.02,.6,.02,'#2c6030');
 if(st===0){const a=c3V(0,.6,0,0,1,0,c3C('#70d850'),0),b=c3V(.16,.66,.04,0,1,0,c3C('#70d850'),0),c=c3V(.1,.6,-.1,0,1,0,c3C('#48a838'),0);c3M.t.push(a,b,c,8,1)}
 else if(st===1){c3T(0,.64,0);c3Ball(.06,.08,.06,'#c8b030','#f8f0a0',5,3)}
 else{c3T(0,.66,0);c3Ball(.12,.07,.12,FL[0],FL[1],6,3);c3T(0,.05,0);c3Ball(.04,.04,.04,'#f8d040','#f8d040',4,2)}
 c3Pop()}
/* Louie */
function c3Dog(x,z,ang,o){o=o||{};const y=o.y!==undefined?o.y:c3G(x,z),O='#e89040',Cm='#fff0d8',wk=o.walk?Math.sin(o.walk*11)*.5:0,sit=o.sit?1:0;
 c3Shadow(x,y,z,.5);c3Push();c3T(x,y+(o.walk?Math.abs(Math.sin(o.walk*11))*.04:0),z);c3RY(ang);
 [[-.14,.26,1],[.14,.26,-1],[-.14,-.26,-1],[.14,-.26,1]].forEach(([lx,lz,s])=>{c3Push();c3T(lx,sit&&lz<0?.2:.34,lz);c3RX(wk*s);c3Box(-.06,sit&&lz<0?-.2:-.34,-.06,.06,0,.07,Cm,O);c3Pop()});
 c3Push();c3T(0,.5,-.02);c3RX(-sit*.55);c3Ball(.22,.2,.42,Cm,O,7,4);c3Pop();
 c3Push();c3T(0,.6+sit*.2,-.44+sit*.1);c3Ball(.1,.14,.12,Cm,Cm,5,3);c3Pop();
 c3T(0,.74+sit*.2,.34+sit*-.08);c3RX(-(o.up||0));c3Cyl(6,.2,.19,-.2,-.1,BAN||'#e03040');c3Ball(.21,.2,.21,c3Mix(O,Cm,.4),O,7,4);c3Box(-.085,-.11,.14,.085,0,.34,Cm);c3Box(-.035,-.03,.33,.035,.03,.37,C3K);
 c3Box(-.14,.02,.17,-.08,.08,.2,C3K);c3Box(.08,.02,.17,.14,.08,.2,C3K);
 for(const s of[-1,1]){c3Push();c3T(s*.13,.14,-.02);c3Cyl(3,.085,0,0,.17,O,Cm,0,1);c3Pop()}
 c3Pop()}
/* Old Thornback: a great red dome with a sleepy head. up: 0 asleep to 1 looking up */
function c3Thorn(x,z,ang,o){o=o||{};const y=c3G(x,z),br=1+Math.sin((o.t||0)*1.4)*.025,up=o.up||0;c3Shadow(x,y,z,2.2);c3Push();c3T(x,y,z);c3RY(ang);
 c3Push();c3T(0,.95*br,0);c3Ball(1.5,1.05*br,1.9,'#7a2030','#f07878',9,5);c3Pop();
 for(let k=0;k<9;k++){const a=k*.7+.4,rr=.6+(k%3)*.35;c3Push();c3T(Math.cos(a)*rr,1.9*br-rr*rr*.42,Math.sin(a)*rr*1.2);c3Ball(.15,.1,.15,'#c8a030','#f8d858',5,2);c3Pop()}
 for(const s of[-1,1])for(const f of[-1,1]){c3Push();c3T(s*1.05,.28,f*1.15);c3Ball(.36,.3,.4,'#7a2030','#b83848',5,3);c3Pop()}
 c3T(0,.7+up*.55,1.85);c3RX(-up*.5);c3Ball(.62,.52,.6,'#b83848','#f07878',8,4);c3Box(-.4,.02,.46,-.2,.02+.13*(.25+up*.75),.56,'#ffffff');c3Box(.2,.02,.46,.4,.02+.13*(.25+up*.75),.56,'#ffffff');
 c3Box(-.33,.02,.52,-.26,.02+.1*(.25+up*.75),.58,C3K);c3Box(.26,.02,.52,.33,.02+.1*(.25+up*.75),.58,C3K);c3Box(-.22,-.28,.44,.22,-.22,.6,'#f8f0d0');c3Pop()}
/* a wild buddy seen from the Lantern: a shape at the edge of the light */
function c3Buddy(x,z,ang,k){const y=c3G(x,z),P=[['#983818','#f07830'],['#4c5466','#98a0b0'],['#2050a8','#48a0f0'],['#806008','#f0d020'],['#286028','#58c048'],['#902868','#f078c0']][k%6];c3Shadow(x,y,z,.5);c3Push();c3T(x,y,z);c3RY(ang);
 c3Push();c3T(0,.42,0);c3Ball(.45,.42,.5,P[0],P[1],7,4);c3Pop();c3T(0,.86,.2);c3Ball(.32,.3,.32,P[0],P[1],7,4);for(const s of[-1,1]){c3Push();c3T(s*.2,.2,0);c3Cyl(4,.1,0,0,.26+k%2*.12,P[1],P[0],0,1);c3Pop()}
 c3Box(-.17,0,.27,-.09,.1,.31,C3K);c3Box(.09,0,.27,.17,.1,.31,C3K);c3Pop()}
/* the Great Lantern: stone plinth with four sockets, a post, a glass cage, a red roof. L is how bright it burns */
function c3Lantern(L,n,o){o=o||{};const lit=n>0||o.force,gl=lit?c3Mix('#705838','#fff0a0',Math.min(1,L)):c3C('#4a3a30');
 c3Cyl(8,1.5,1.3,0,.22,'#585068','#888098',0,1);c3Cyl(8,1.2,1.05,.22,.62,'#686078','#b0a8c0',0,1);
 for(let i=0;i<4;i++){const a=i*1.5708+.785,x=Math.cos(a)*1.02,z=Math.sin(a)*1.02;c3Push();c3T(x,.62,z);c3RY(-a);c3Box(-.13,0,-.13,.13,.1,.13,i<n?'#f8d030':'#504860',i<n?'#fff8a0':'#504860',i<n?.9:0);c3Pop()}
 c3Box(-.17,.62,-.17,.17,2.5,.17,'#382818','#684830');c3Box(-.75,2.42,-.75,.75,2.56,.75,'#282038','#383048');
 for(const [sx,sz] of[[-1,-1],[1,-1],[1,1],[-1,1]])c3Box(sx*.68-.06,2.56,sz*.68-.06,sx*.68+.06,3.6,sz*.68+.06,'#282038');
 c3Box(-.6,2.6,-.6,.6,3.56,.6,gl,gl,lit?Math.min(1,.35+L*.65):0);
 c3Box(-.95,3.6,-.95,.95,3.74,.95,'#782828','#c04848');c3Push();c3T(0,3.74,0);c3Cyl(4,1.02,.12,0,.62,'#a03838','#e06060',0,1,.785);c3T(0,.66,0);c3Ball(.13,.13,.13,'#c04848','#f07070',5,3);c3Pop();
 if(lit&&L>0){c3Glow(0,3.08,0,1.5+L*1.3,'#ffe890',.5*Math.min(1.4,L));c3Glow(0,3.08,0,.8,'#fff8d0',.6*Math.min(1.2,L))}}
function c3House(x,z,ang,lit){const y=c3G(x,z);c3Push();c3T(x,y,z);c3RY(ang);c3Box(-1.7,0,-1.3,1.7,1.7,1.3,'#b89868','#e8d8b8');c3Box(-1.9,1.7,-1.5,1.9,1.82,1.5,'#782828','#a03838');
 const a=c3C('#a03838'),b=c3C('#e06060'),v=[[-1.9,1.82,-1.5],[1.9,1.82,-1.5],[1.9,1.82,1.5],[-1.9,1.82,1.5],[-1.9,2.9,0],[1.9,2.9,0]];
 let i=[c3V(...v[3],0,.7,.7,a),c3V(...v[2],0,.7,.7,a),c3V(...v[5],0,.7,.7,b),c3V(...v[4],0,.7,.7,b)];c3Q(i[0],i[1],i[2],i[3]);i=[c3V(...v[1],0,.7,-.7,a),c3V(...v[0],0,.7,-.7,a),c3V(...v[4],0,.7,-.7,b),c3V(...v[5],0,.7,-.7,b)];c3Q(i[0],i[1],i[2],i[3]);
 i=[c3V(...v[0],-1,0,0,c3C('#e8d8b8')),c3V(...v[3],-1,0,0,c3C('#e8d8b8')),c3V(...v[4],-1,0,0,c3C('#e8d8b8'))];c3F(i[0],i[1],i[2]);i=[c3V(...v[2],1,0,0,c3C('#e8d8b8')),c3V(...v[1],1,0,0,c3C('#e8d8b8')),c3V(...v[5],1,0,0,c3C('#e8d8b8'))];c3F(i[0],i[1],i[2]);
 c3Box(-.3,0,1.3,.3,1.05,1.36,'#583018','#8a5a3a');for(const s of[-1,1])c3Box(s*1-.3,.7,1.3,s*1+.3,1.25,1.35,lit?'#f8e060':'#88d0f8',lit?'#fff8a0':'#c8e8f8',lit?1:.2);c3Box(.9,2.2,-.6,1.25,3.3,-.25,'#686078','#888098');c3Pop()}
/* the North Light: an old stone tower on its rock. lit: 0 dark to 1 burning */
function c3Tower(lit,o){o=o||{};const x=C3TW[0],z=C3TW[1],y=c3G(x,z)-.15,gl=c3Mix('#1c2238','#fff4b0',Math.min(1,lit));c3Push();c3T(x,y,z);
 c3Cyl(8,2.1,1.9,0,.5,'#484058','#686078',0,1);c3Cyl(8,1.55,1.05,.5,7.6,'#585c70','#b0b4c4');c3Cyl(8,1.4,1.32,2.6,3.3,'#7a3038','#a04848');c3Cyl(8,1.2,1.14,5.2,5.8,'#7a3038','#a04848');
 c3Cyl(8,1.5,1.5,7.6,7.85,'#383048','#585068',0,1);for(let i=0;i<8;i++){const a=i/8*6.2832+.39;c3Box(Math.cos(a)*1.42-.05,7.85,Math.sin(a)*1.42-.05,Math.cos(a)*1.42+.05,8.25,Math.sin(a)*1.42+.05,'#383048')}
 c3Cyl(8,.82,.82,7.85,9.05,gl,gl,lit>0?Math.min(1,.3+lit*.7):.08,1);for(let i=0;i<8;i++){const a=i/8*6.2832;c3Box(Math.cos(a)*.86-.045,7.85,Math.sin(a)*.86-.045,Math.cos(a)*.86+.045,9.05,Math.sin(a)*.86+.045,'#282038')}
 c3Cyl(8,1.12,.1,9.05,10.1,'#5a2028','#a04848',0,1);c3Push();c3T(0,10.16,0);c3Ball(.14,.14,.14,'#c8a040','#f8e060',5,3);c3Pop();
 c3Push();c3RY(-1.2);c3Box(-.36,.5,1.42,.36,1.75,1.62,'#282038','#3c2a20');c3Box(-.5,1.75,1.4,.5,1.9,1.64,'#8088a0');c3Box(-.12,2.0,1.5,.12,2.24,1.56,'#f8d040','#f8d040',lit>.5?1:.1);c3Pop();
 for(let i=0;i<3;i++){const a=.6+i*2.1;c3Box(Math.cos(a)*1.33-.1,3.9+i*.9,Math.sin(a)*1.33-.1,Math.cos(a)*1.33+.1,4.3+i*.9,Math.sin(a)*1.33+.1,'#181c30')}
 c3Pop();if(lit>0){c3Glow(x,y+8.45,z,1.2+lit*2.4,'#ffe890',.55*Math.min(1.3,lit));c3Glow(x,y+8.45,z,.7,'#fff8d0',.7*Math.min(1,lit))}}
const C3LAMP=()=>[C3TW[0],c3G(C3TW[0],C3TW[1])-.15+8.45,C3TW[1]];
/* the old pier: stumps from the beach toward the rock; n planks laid on them */
function c3Pier(n){for(let k=0;k<7;k++){const u=k/6,x=c3Lp(47.2,52.4,u),z=c3Lp(-9.2,-11.4,u);for(const s of[-1,1]){c3Push();c3T(x+s*.12,C3WL-.5,z+s*.5);c3Cyl(5,.11,.09,0,.75+c3Hs(k,s,5)*.25,'#3c2414','#6a4428');c3Pop()}
  if(k<n){c3Push();c3T(x,C3WL+.38,z);c3RY(.4);c3Box(-.5,0,-.55,.5,.07,.55,'#8a6030','#c89050');c3Pop()}}}
/* the lens of the North Light: a cut crystal. lit: 0 cold to 1 full of light */
function c3Lens(x,y,z,s,lit,t){const c=c3Mix('#6888b0','#fff4b0',lit),c2=c3Mix('#c0d8f0','#ffffff',lit);c3Push();c3T(x,y,z);c3RY(t*.8);c3S(s,s,s);c3Cyl(6,.02,.5,-.55,0,c,c2,.25+lit*.75,1);c3Cyl(6,.5,.02,0,.55,c2,c,.25+lit*.75,1);c3Pop();
 if(lit>0)c3Glow(x,y,z,s*(1+lit*1.6),'#ffe890',.6*lit);else c3Glow(x,y,z,s*.9,'#a8c8ff',.18+.1*Math.sin(t*3))}
function c3Wisp(x,y,z,t,k){c3Glow(x,y,z,.9+Math.sin(t*4)*.12,'#f8e896',.5*(k===undefined?1:k));c3Glow(x,y,z,.36,'#ffffff',.8*(k===undefined?1:k));c3Push();c3T(x,y,z);c3Ball(.13,.16,.13,'#f8e060','#ffffff',5,3,1);c3Pop()}
function c3Shard(x,y,z,s,t,e){c3Push();c3T(x,y,z);c3RY(t*3);c3RZ(.3);c3S(s,s,s);c3Cyl(4,.02,.3,-.55,-.1,'#906008','#f8d030',e===undefined?.9:e,1);c3Cyl(4,.3,.02,-.1,.55,'#f8d030','#fff8a0',e===undefined?.9:e,1);c3Pop();c3Glow(x,y,z,s*1.5,'#ffd860',.45)}
/* the stone door east of the orchard: two slabs with a sun cut across them. open 0 to 1, glow 0 to 1 */
function c3Door(open,glow,t){const x=C3DR[0],z=C3DR[1],y=c3G(x-1,z);c3Push();c3T(x,y-.1,z);c3RY(-.14);
 c3Box(-.2,0,-3.6,1.6,3.5,-1.25,'#484058','#686078');c3Box(-.2,0,1.25,1.6,3.5,3.6,'#484058','#686078');c3Box(-.3,2.75,-1.4,1.6,3.75,1.4,'#585068','#8088a0');c3Box(-.34,3.75,-3.8,1.7,4.0,3.8,'#2c7848','#3c9858');
 for(const s of[-1,1]){c3Push();c3T(0,0,s*open*1.12);c3Box(-.12,0,s>0?0:-1.22,.1,2.75,s>0?1.22:0,'#6c7488','#a0a8bc');
  const sc=c3Mix('#585070','#ffe070',glow),e=glow,cy=1.55;for(let i=0;i<8;i++){const a=i*.7854+.3927,cz=Math.cos(a)*.56,yy=cy+Math.sin(a)*.56;if(cz*s>0)c3Box(-.17,yy-.07,cz-.07,-.12,yy+.07,cz+.07,sc,sc,e)}
  c3Box(-.17,cy-.27,s>0?0:-.27,-.12,cy+.27,s>0?.27:0,sc,sc,e);c3Pop()}
 c3Box(.12,0,-1.24,1.5,2.75,1.24,'#0c0a14','#0c0a14');
 c3Pop();if(glow>0)c3Glow(x-.4,y+1.5,z,1.2+glow*1.2,'#ffd860',.4*glow)}
/* BESSIE: humps in the water, and a long neck when she chooses to look. rise 0 to 1 */
function c3Bessie(x,z,ang,rise,t){c3Push();c3T(x,C3WL,z);c3RY(ang);const D='#143c44',L2='#3c8c84';
 for(let k=0;k<3;k++){const h=.35+.25*Math.sin(t*1.1-k*.9);c3Push();c3T(0,h*.5-.3,-1.4-k*1.7);c3Ball(.7,.6,1.0,D,L2,7,4);c3Pop();c3Disc(0,.03,-1.4-k*1.7,1.3+.2*Math.sin(t*2+k),[200,230,255],.16,2,1.7)}
 if(rise>0){let px=0,py=-.5,pz=0,a=1.25;for(let k=0;k<7;k++){const r=.42-k*.035,len=.62*rise;c3Push();c3T(px,py,pz);c3RX(1.5708-a);c3Cyl(6,r,r-.035,0,len+.05,D,L2);c3Pop();py+=Math.sin(a)*len;pz+=Math.cos(a)*len;a+=(k<3?.06:-.3)}
  c3T(px,py+.1,pz+.2);c3RX(.25-rise*.5);c3Ball(.42,.34,.6,D,L2,7,4);c3Box(-.33,.06,.2,-.25,.18,.34,'#f8f0a0','#f8f0a0',.9);c3Box(.25,.06,.2,.33,.18,.34,'#f8f0a0','#f8f0a0',.9);}
 c3Pop()}
/* a puff of cloud: see-through, soft */
function c3Puff(x,y,z,rad,al){c3Push();c3T(x,y,z);c3Ball(rad,rad*.8,rad,[214,222,230],[255,255,255],6,3,.55,0,1,2,al);c3Pop()}
/* the Flow Pros van, side door open toward local +z. who: draw Marcus and Derek sitting in the door (1 both, 2 Derek only).
   rip 0 to 1: how big the cloud is */
const C3VAN=[-8.5,6.2,2.55];
function c3Van(who,rip,t,o){o=o||{};const x=C3VAN[0],z=C3VAN[1],y=c3G(x,z),W1='#c8ccd8',W2='#f4f6fa',K='#181420';c3Shadow(x,y,z,2.3);c3Push();c3T(x,y,z);c3RY(C3VAN[2]);
 c3Box(-2,.45,-.9,1.1,2.1,.9,W1,W2);c3Box(1.1,.45,-.86,2,1.3,.86,W1,W2);c3Box(1.1,1.3,-.82,1.55,2,.82,'#5888b8','#a8d0f0');c3Box(1.98,.8,-.7,2.03,1,.7,'#f8e060','#fff8a0',.6);c3Box(1.95,.45,-.9,2.06,.62,.9,'#383048');
 for(const s of[-1,1]){c3Box(-2.01,1,s*.9-.012,1.11,1.22,s*.9+.012,'#1c4a98','#2a6ad0');c3Box(1.2,1.38,s*.86-.01,1.5,1.9,s*.86+.01,'#5888b8','#a8d0f0')}
 c3Box(-1.25,.55,.5,.25,1.95,.915,K,'#241c30');c3Box(-1.25,.5,.9,.25,.58,1.12,'#383048','#686078');c3Box(-2.35,.55,.92,-1.25,1.95,.99,W1,W2);c3Box(-2.3,1,.99,-1.3,1.22,1.0,'#1c4a98','#2a6ad0');
 for(const wx of[-1.35,1.25])for(const s of[-1,1]){c3Push();c3T(wx,.42,s*.82);c3RX(s*1.5708);c3Cyl(8,.42,.42,-.1,.14,K,'#383048',0,1);c3Cyl(6,.2,.2,.14,.16,'#888098','#b0a8c0',0,1);c3Pop()}
 c3Box(-1.8,2.1,-.55,.9,2.2,-.4,'#a87040','#c89050');c3Box(-1.8,2.1,.1,.9,2.2,.25,'#a87040','#c89050');for(let k=0;k<5;k++)c3Box(-1.7+k*.62,2.1,-.55,-1.62+k*.62,2.17,.25,'#a87040');c3Box(-1.9,2.2,-.3,1,2.34,-.14,'#b86838','#e89860');
 if(who){const hit=o.hit||0;if(who===1)c3Person(-.12,.72,o.mturn||0,Object.assign({},C3MARC,{y:.3,sit:1,arm:o.marm||0,up:.05}));
  c3Person(-.88,.72,.15,Object.assign({},C3DEREK,{y:.3,sit:1,arms:1.1+hit*.5,up:-.1+hit*.25}));
  c3Push();c3T(-.86,1.02+hit*.12,1.08);c3Cyl(6,.09,.06,0,.12,'#70c8b0','#c0fff0',.5,1);c3Cyl(6,.035,.035,.12,.36,'#a8e8d8','#e8fff8',.5,1);c3Pop();if(hit>.2&&hit<.95)c3Glow(-.74,1.1,1.14,.22,'#ff9040',.8)}
 c3Pop();
 if(rip>0){const n=[Math.sin(C3VAN[2]),Math.cos(C3VAN[2])],ax=[Math.cos(C3VAN[2]),-Math.sin(C3VAN[2])];for(let k=0;k<9;k++){const q=(t*.22+k*.111)%1,r0=(.35+q*1.3)*rip,sx=-.6+Math.sin(k*2.4)*.7;
   c3Puff(x+ax[0]*sx+n[0]*(1+q*1.6)+Math.sin(t+k)*.2,y+1.3+q*2.6,z+ax[1]*sx+n[1]*(1+q*1.6)+Math.cos(t*.8+k)*.2,r0,.42*(1-q)*Math.min(1,rip))}}}
const c3VanAt=(side,along,h)=>{const a=C3VAN[2];return[C3VAN[0]+Math.sin(a)*side+Math.cos(a)*along,h,C3VAN[1]+Math.cos(a)*side-Math.sin(a)*along]};
/* a far mountain, north of everything. hum: a cold light at its foot */
function c3Peak(hum,t){c3Push();c3T(-8,0,-74);c3Cyl(7,24,6.5,0,34,'#0c1024','#2c3466',.55,1,.3);c3Cyl(7,6.5,0,34,46,'#5860a0','#c8d0f0',.6,1,.3);c3T(15,0,6);c3Cyl(6,15,0,0,22,'#0c1024','#20284c',.55,1);c3Pop();if(hum>0){c3Glow(-8,27,-62,7+Math.sin(t*9)*.8,'#60c8ff',.45*hum);c3Glow(-8,27,-62,2.4,'#d0f0ff',.7*hum)}}

/* ---------- 5. the scenes ----------
   A scene is a list of shots. A shot has a length d (seconds), a caption (who, text) and f(t,u): t is seconds into
   the shot, u runs 0 to 1 across it. f sets the light and the camera and puts the cast on the stage. */
let c3q=null,c3D=null;
const c3Cue=(k,fn)=>{if(c3q&&!c3q.cue[k]){c3q.cue[k]=1;try{fn()}catch(e){}}};
const c3Ring=(t,n,hop)=>{for(let k=0;k<(n||10);k++){const a=k*.9+.4,rr=2.3+(k%3)*.55;c3Sprout(Math.cos(a)*rr,2.6+Math.sin(a)*rr*.5+1.2,k,{ang:Math.atan2(-Math.cos(a)*rr,-(2.6+Math.sin(a)*rr*.5+1.2)),hop:hop?Math.abs(Math.sin(t*6+k*1.3))*.3*hop:0})}};
function c3Soil(){for(let k=0;k<7;k++)c3Sprout(-2.1+k*.7,3+((k*7)%5)*.3,k,{stage:k%3,noSh:1,y:-.12,s:.8})}
/* everyone who stands at the Lantern on a night scene */
function c3Night(t,L,o){o=o||{};c3Env('night');const fl=L*(1+Math.sin(t*9)*.04);c3Lamp(0,3.1,0,'#ffd890',7.5,2.3*fl);c3Moon(-.5,.42,-.75,13,'#e8ecff');c3Lantern(fl,o.n===undefined?4:o.n);c3House(6.2,-5.4,-.5,1);c3Lamp(6.2,1,-3.6,'#ffd890',2.2,.7);c3Soil();
 if(!o.alone){c3Person(1.7,5.9,Math.PI+.25,Object.assign(c3Look(),{up:o.up||.25}));c3Person(-1.5,6.1,Math.PI-.25,Object.assign({},C3ERIN,{up:o.up||.25}));c3Dog(.3,6.9,Math.PI,{sit:1,up:.3});
  c3Thorn(-6,3.4,1.9,{t,up:o.thorn||0});for(let k=0;k<6;k++){const a=-.5+k*.62+(k>2?.9:0),rr=7.6+(k%2)*.7;c3Buddy(Math.cos(a)*rr,Math.sin(a)*rr*.8-1,Math.atan2(-Math.cos(a),-Math.sin(a)),k)}}}
const C3LT=[0,3.08,0];
function c3BeamTo(x,y,z,k,w){c3Beam(C3LT[0],C3LT[1],C3LT[2],x,y,z,.28,w||1.5,'#ffe9a0',.5*k);c3Beam(C3LT[0],C3LT[1],C3LT[2],x,y,z,.1,(w||1.5)*.4,'#fff8d8',.5*k)}
const c3Dir=(a,len,up)=>[C3LT[0]+Math.cos(a)*len,C3LT[1]+(up||0),C3LT[2]+Math.sin(a)*len];
const C3A_LAKE=Math.atan2(C3TW[1],C3TW[0]),C3A_DOOR=Math.atan2(C3DR[1],C3DR[0]);
const C3SCN={
 /* the first time Will meets Marcus: the Flow Pros van by the Dew Pond */
 van:[
  {d:6.5,cap:['',"By the Dew Pond sits a van. FLOW PROS. The windows are fogged from the inside."],f(t,u){c3Env('day');c3Cam(1.5-u*1.5,2.6,-5.5+u*1.5,-8,1.2,5.5,56);c3Lantern(.4,0,{force:1});c3Van(0,.55,t);
    const x=-.5-u*4.6,z=-.2+u*2.2;c3Person(x,z,-1.15,Object.assign(c3Look(),{walk:t}));c3Dog(x+.2,z-1.1,-1.15,{walk:t})}},
  {d:6.5,cap:['DEREK',"*kkhhh* ...Hoo. Okay. That's the one, Marcus."],f(t,u){const hit=c3Sm(.4,1.8,t)*(1-c3Sm(2.4,3,t)),rip=c3Sm(2.3,3.4,t);c3Env('day');const e=c3VanAt(4.4-u*.5,-.9,1.5),g2=c3VanAt(0,-.6,1.25);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],52);
    c3Van(1,.25+rip*1.1,t,{hit});c3Cue('rp',()=>{later(()=>noise(1.3,.12,1800,'bandpass'),500);later(()=>{noise(.12,.3,900);later(()=>noise(.1,.25,800),160);later(()=>noise(.14,.3,1000),330)},2400)})}},
  {d:6.5,cap:['MARCUS',"Bro. BRO. Will! Perfect timing. Derek. Derek. It's Will."],f(t,u){c3Env('day');const e=c3VanAt(6.4,2.6,1.9),g2=c3VanAt(.6,-.3,1.2),w=c3VanAt(3.1+Math.max(0,1-t)*1.5,.5,0),l=c3VanAt(3.4+Math.max(0,1-t)*1.5,1.5,0);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],54);
    c3Van(1,.7,t,{marm:2.3+Math.sin(t*9)*.3,mturn:-.2});c3Person(w[0],w[2],C3VAN[2]+Math.PI,Object.assign(c3Look(),{walk:t<1?t:0}));c3Dog(l[0],l[2],C3VAN[2]+Math.PI,{walk:t<1?t:0,sit:t>=1.4});c3Cue('dp',()=>later(()=>{snd(330,.06);later(()=>snd(440,.08),80)},300))}},
  {d:7,cap:['MARCUS',"Business idea. A lazy river. Around the WHOLE valley. Dews as lifeguards."],f(t,u){c3Env('day');const m=c3VanAt(2.2,.2,0),w=c3VanAt(4.2,2.2,0),l=c3VanAt(3.3,2.6,0),e=c3VanAt(5.3,-.5,1.2);c3Cam(e[0]+u*.3,e[1],e[2],m[0],1.05,m[2],50);
    c3Van(2,.6,t);c3Person(m[0],m[2],C3VAN[2]+.25,Object.assign({},C3MARC,{arm:2.6+Math.sin(t*5)*.3,arms:Math.max(0,Math.sin(t*2.5))*1.2}));c3Person(w[0],w[2],C3VAN[2]+Math.PI+.4,c3Look());c3Dog(l[0],l[2],C3VAN[2]+Math.PI+.2,{sit:1})}},
  {d:7,cap:['MARCUS',"Waterslide off the Lantern. Marcus Waterworks, bro. Derek's in. Derek?"],f(t,u){c3Env('day');c3Cam(-9.4+u*.4,2.4,4.9,0,2.1,0,52);c3Lantern(.4,0,{force:1});c3House(6.2,-5.4,-.5,0);
    c3Van(2,.6,t);c3Person(-5.6,2.6,2.05,Object.assign({},C3MARC,{arm:2.2+Math.sin(t*4)*.15}));c3Person(-5.3,4.2,2.05,Object.assign(c3Look(),{up:.2}));c3Dog(-4.2,4.6,2.05,{sit:1,up:.2})}},
  {d:6.5,cap:['DEREK',"I'm in. I drive the van. That's my whole part."],f(t,u){const hit=c3Sm(3,4.2,t);c3Env('day');const e=c3VanAt(3.6,-1.2,1.35),g2=c3VanAt(0,-.85,1.3),l=c3VanAt(1.9,-1.9,0);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],46);
    c3Van(2,.5+hit*.8,t,{hit});c3Dog(l[0],l[2],C3VAN[2]+2.4,{sit:1,up:t>4.6&&t<5?-.3:.15});c3Cue('ac',()=>later(()=>{noise(.1,.3,3000);spSay('ACHOO!',2)},4600))}}],
 /* a new game: the Lantern whole, the crack, the morning after */
 dawn:[
  {d:7,cap:['',"For as long as anyone can remember, the Great Lantern has kept this valley warm and bright."],f(t,u){const a=.9+u*.8;c3Cam(Math.cos(a)*11,3.4+u*1.2,Math.sin(a)*11,0,2.5,0,58);c3Night(t,1,{alone:1});c3Ring(t,8)}},
  {d:7,cap:['',"Last night it cracked. Four sun shards flew off into the wild, and the nights are getting longer."],f(t,u){const k=c3Sm(1.1,1.25,t),L=1-k*.82;c3Cam(4.5-u*1.5,2.4+u*2.6,9+u*5,0,3+u*1.5,0,62);c3Night(t,L,{alone:1,n:k?0:4});if(k<1)c3Ring(t,8);
    c3Cue('ck',()=>later(()=>{noise(.5,.35,900,'lowpass');snd(1400,.5,90,'sawtooth',.08)},1100));if(t>1.1&&t<1.5)c3q.flash=1-(t-1.1)/.4;
    if(t>1.1)[[1,-.25],[-.1,-1],[-1,.2],[.2,1]].forEach(([dx,dz],i)=>{const q=Math.min(1,(t-1.1)/(3.4+i*.5)),d=q*46;if(q<1){const sy=v=>3.1+Math.sin(v*3.14)*13-v*2;c3Shard(dx*d,sy(q),dz*d,1,t+i,1);for(let j=1;j<5;j++){const v=Math.max(0,q-j*.02);c3Glow(dx*v*46,sy(v),dz*v*46,.9-j*.15,'#ffd860',.4-j*.07)}}})}},
  {d:5.5,cap:['',"This morning the new keeper walked in from the south road."],f(t,u){c3Env('dawn');c3Cam(-7.5+u*1.5,3.2,14.5-u,0,1.7,5,56);c3Lamp(0,3.1,0,'#ffd890',5,.5);c3Lantern(.25,0,{force:1});c3House(6.2,-5.4,-.5,0);c3Soil();
    const z=15-u*7.4;c3Person(.2,z,Math.PI,Object.assign(c3Look(),{walk:u<1?t:0}));c3Person(-1.5,5.6,.2,Object.assign({},C3ERIN,{arm:u>.5?2.4+Math.sin(t*9)*.4:0}));c3Dog(1.4,c3Lp(5.8,6.6,c3Sm(.5,1,u)),.1,{sit:u<.5,walk:u>=.5&&u<1?t:0})}}],
 /* the fourth shard comes home */
 blaze:[
  {d:5.5,cap:['',"The last shard slides home."],f(t,u){const k=c3Sm(2.6,3,t);c3Env('night','gold',k*.35);const L=.8+k*1.6;c3Lamp(0,3.1,0,'#ffd890',7.5+k*6,2.2*L);c3Moon(-.5,.42,-.75,13,'#e8ecff');c3Cam(3.6-u*.8,1.5+u*.7,5.2-u*.6,0,1.6+u*.8,0,60);c3Lantern(L,k>=1?4:3);c3Soil();
    const sx=Math.cos(.785+3*1.5708)*1.02,sz=Math.sin(.785+3*1.5708)*1.02,q=c3Sm(.4,2.6,t),x=c3Lp(3.2,sx,q),z=c3Lp(4.6,sz,q),y=.9+Math.sin(q*3.14)*1.1+(1-q)*.0;if(q<1){c3Shard(x,y,z,.5,t,1);for(let i=0;i<5;i++){const b=i*1.256+t*2;c3Sprout(x+Math.cos(b)*.5,z+Math.sin(b)*.5,i*2,{y:c3G(x,z),hop:Math.abs(Math.sin(t*8+i))*.12})}}
    else{c3q.flash=Math.max(0,1-(t-2.6)/.7);c3Ring(t,10,1)}c3Cue('bl',()=>later(()=>{snd(523,.12);later(()=>snd(784,.12),120);later(()=>snd(1046,.4),240)},2600))}},
  {d:7.5,cap:['',"The Great Lantern blazes, and the whole valley turns gold."],f(t,u){c3Env('night','gold',.35+u*.65);const a=2.2-u*1.5,rr=9+u*9;c3Cam(Math.cos(a)*rr,3+u*8,Math.sin(a)*rr,0,2.6,0,60);c3Lamp(0,3.1,0,'#ffd890',16,3.2);c3Lantern(2.4,4);c3House(6.2,-5.4,-.5,1);c3Soil();
    c3Person(1.7,5.9,Math.PI+.25,Object.assign(c3Look(),{up:.3,arm:2.6+Math.sin(t*8)*.3}));c3Person(-1.5,6.1,Math.PI-.25,Object.assign({},C3ERIN,{up:.3,arm:2.6+Math.cos(t*8)*.3}));c3Person(-3.6,5.2,Math.PI-.6,Object.assign({},C3MARC,{up:.3,arm:2.8}));c3Dog(.3,6.9+Math.sin(t*3)*.3,Math.PI,{walk:t,up:.3});c3Thorn(-6.5,2,1.7,{t,up:1});c3Ring(t,12,1);
    for(let k=0;k<8;k++){const b=k*.785+t*.4;c3Glow(Math.cos(b)*(3+k*.6),3+((t*1.3+k*.7)%5),Math.sin(b)*(3+k*.6),.35,'#fff0a0',.5)}}}],
 /* the Lantern is whole and the arch has been read: the skip turns out to be a call */
 call:[
  {d:7,cap:['',"Night. The Great Lantern is whole again. And still, once a night, it skips."],f(t,u){const a=1.05+u*.75;c3Cam(Math.cos(a)*12.5,3.2+u*.8,Math.sin(a)*12.5,0,2.3,0,58);c3Night(t,1)}},
  {d:5.5,cap:['LOUIE',"Grr...?"],f(t,u){const dip=t>1.2&&t<2?.12+.1*Math.sin(t*70):1,L=dip*(1+c3Sm(2.3,3.6,t)*.9);c3Cam(3.8-u*.6,2.2,6.4-u*1.2,0,2.9,0,54);c3Night(t,L,{up:.4});if(t>1.2&&t<2)c3q.tear=1;
    c3Cue('sk',()=>later(()=>{snd(90,.5,60,'sawtooth',.06);noise(.3,.2,2400)},1200));c3Cue('hm',()=>later(()=>snd(220,1.6,440,'sine',.05),2300))}},
  {d:8,cap:['',"This time the light does not settle. It gathers. It turns, slowly, like something looking."],f(t,u){const k=c3Sm(0,1.2,t),a=c3Lp(1.5,C3A_DOOR,c3Sm(.8,7,t));c3Cam(-8.5+u*1.5,7.5,6.5,9,2.2,-1,60);c3Night(t,1.9,{up:.5});const p=c3Dir(a,70,4);c3BeamTo(p[0],p[1],p[2],k);c3Cue('bm',()=>snd(330,2.5,660,'sine',.04))}},
  {d:7.5,cap:['',"East of the orchard the beam crosses old stone. A carved sun wakes. A hidden door grinds open."],f(t,u){const gl=c3Sm(.8,2,t),op=c3Sm(2.6,6.2,t);c3Env('night');c3Lamp(C3DR[0]-1.5,2,C3DR[1],'#ffd890',5,1.6*gl);c3Moon(-.5,.42,-.75,13,'#e8ecff');
    c3Cam(12.5+u*1.2,1.7+u*.5,8.2-u*1.4,C3DR[0],1.7,C3DR[1],56);c3Door(op,gl,t);const p=[C3DR[0]-.3,1.5,C3DR[1]];c3BeamTo(p[0],p[1],p[2],c3Sm(.2,1,t),.5);
    if(op>0&&op<1){c3q.shake=.8;for(let k=0;k<6;k++){const q=(t*1.3+k*.37)%1;c3Disc(C3DR[0]-.6-q*.8,.3+q*.9,C3DR[1]+(k%2?1:-1)*(1.1+q*.4),.3+q*.4,[190,180,160],.3*(1-q))}}
    c3Cue('dr',()=>{later(()=>{snd(784,.15);later(()=>snd(1175,.3),120)},900);later(()=>noise(3.4,.3,160,'lowpass'),2600)})}},
  {d:8.5,cap:['',"Then it runs the length of the Crooked River, out to the Wending Lake."],f(t,u){const e=u*u*(3-2*u),x=c3Lp(5,39,e),z=c3Lp(-5.5,-12.5,e)+Math.sin(e*5)*1.2,y=6.2-e*1.8+Math.sin(e*3.14)*1.4;c3Env('night');c3Moon(.9,.3,-.3,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);
    c3Cam(x,y,z,x+11,y-2.4,z-1.8+Math.cos(e*5)*.8,66);c3Lantern(1.9,4);const L=C3LAMP();c3BeamTo(L[0],L[1],L[2],1,1.8);c3Tower(0);c3Pier(0);c3Glow(L[0],L[1],L[2],2.2,'#ffe890',.5);c3Cue('fl',()=>noise(8,.07,500,'lowpass'))}},
  {d:8,cap:['',"On a rock in the lake stands a second lantern, long dark. For one breath, it answers."],f(t,u){const an=Math.max(0,1-Math.abs(t-5.2)/.7);c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');const L=C3LAMP();c3Lamp(L[0],L[1],L[2],'#ffd890',6,1.2+an*2);
    c3Cam(46.5-u*1.2,.7+u*.5,-4.5+u*.8,L[0],L[1]-2.2,L[2],58);c3Tower(an*.9);c3Pier(0);c3BeamTo(L[0],L[1],L[2],1,1.8);c3Glow(L[0],L[1],L[2],2+an*3,'#ffe890',.45+an*.4);c3Wisp(L[0]+Math.cos(t*.9)*1.6,L[1]+.2+Math.sin(t*1.7)*.3,L[2]+Math.sin(t*.9)*1.6,t);
    c3Bessie(50,-3.5-u*3,.2,0,t);c3Cue('an',()=>later(()=>{snd(660,.5,990,'sine',.07);later(()=>snd(990,.9,660,'sine',.05),200)},4700))}},
  {d:6.5,cap:['THORNBACK',"Two lights. I remember now. One to keep. One to call."],f(t,u){c3Cam(.6-u*.5,1.3,2.2+u*.3,-5.4,1.5,3.3,50);c3Night(t,1.9,{thorn:c3Sm(0,1.4,t),up:.45});const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1);c3Cue('th',()=>snd(110,.5,80,'sine',.25))}},
  {d:6.5,cap:['ERIN',"So that's the skip. It has been calling every night, and nobody ever answered."],f(t,u){c3Cam(-3.1+u*.4,1.5,2.6,-1.2,1.2,6.2,50);c3Night(t,1.9,{thorn:1,up:.45});const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1)}},
  {d:6,cap:['',"By morning the beam is gone. The door east of the orchard is still open."],f(t,u){c3Env('night','dawn',c3Sm(0,.8,u));c3Cam(-15+u*2,9.5+u*1.5,11,10,1.5,-2,60);c3Lamp(0,3.1,0,'#ffd890',7.5,2*(1-u*.7));c3Lantern(1.6-u*.8,4);c3House(6.2,-5.4,-.5,u<.5);c3Soil();c3Door(1,.6,t);const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1-c3Sm(.1,.75,u))}}],
 /* the first walk out onto the North Coast */
 coast:[
  {d:7.5,cap:['',"Past the door the trees stop. Sand. Wind. The Wending Lake, with no far side."],f(t,u){c3Env('day');c3Cam(35.5-u*.6,1.1+u*3.6,-1.2+u*1.2,50,2.6-u*.6,-9,60);c3Tower(0);c3Pier(0);
    const x=37.5+u*4.2;c3Person(x,-3,1.2,Object.assign(c3Look(),{walk:t,up:.1}));c3Dog(x+1.1,-4.1,1.2,{walk:t});for(let k=0;k<9;k++)c3Sprout(x-1-(k%3)*.55-((k/3)|0)*.5,-2.6-(k%3)*.5+((k/3)|0)*.3,k,{ang:1.2,hop:Math.abs(Math.sin(t*9+k))*.08});c3Cue('wv',()=>noise(7,.06,700,'lowpass'))}},
  {d:7.5,cap:['',"On a rock stands the NORTH LIGHT. Its lamp room is dark, and its lens lies cold at its foot."],f(t,u){c3Env('day');const a=2.2-u*.9,L=C3LAMP();c3Cam(C3TW[0]+Math.cos(a)*16,2.4+u*3,C3TW[1]+Math.sin(a)*16,C3TW[0],5,C3TW[1],58);c3Tower(0);c3Pier(0);
    c3Lens(C3TW[0]-1.9,c3G(C3TW[0]-1.9,C3TW[1]+1.5)+.5,C3TW[1]+1.5,.6,0,t);c3Wisp(L[0]+Math.cos(t*1.1)*1.5,L[1]+Math.sin(t*1.9)*.3,L[2]+Math.sin(t*1.1)*1.5,t,.7)}},
  {d:6.5,cap:['LOUIE',"...Woof?"],f(t,u){c3Env('day');c3Cam(40.6,1.5,1.2,50,.2,-5.2,54);c3Tower(0);c3Pier(0);c3Dog(44.4,-2.6,2.2,{sit:1,up:.1});c3Person(43.3,-1.2,2.2,Object.assign(c3Look(),{}));c3Bessie(56-u*7,-4.5-u*1.5,-1.9,0,t);c3Cue('bs',()=>later(()=>{snd(70,1.4,50,'sine',.2);bark()},1500))}},
  {d:6.5,cap:['',"The pier is out. But sprouts can build, and a lens can be carried home to a light that still burns."],f(t,u){c3Env('day','dusk',u*.5);c3Cam(41-u,2.4,3.5,49.5,2.6,-9,56);c3Tower(0);c3Pier(0);c3Person(43.6,-2.2,2.1,Object.assign(c3Look(),{up:.2}));c3Dog(44.5,-1.5,2.1,{sit:1});for(let k=0;k<9;k++)c3Sprout(42.4+(k%3)*.6,-.8-((k/3)|0)*.6,k,{ang:2.1,hop:Math.abs(Math.sin(t*5+k*1.7))*.1});
    c3Lens(C3TW[0]-1.9,c3G(C3TW[0]-1.9,C3TW[1]+1.5)+.5,C3TW[1]+1.5,.6,0,t)}}],
 /* the lens comes home to the Lantern */
 relight:[
  {d:7.5,cap:['',"That night the Lantern warms the cold lens until it holds a light of its own. The wisp steps inside."],f(t,u){const lit=c3Sm(1,4.6,t),wy=c3Lp(6,1.25,c3Sm(1.5,5,t));c3Cam(3.2-u*.7,1.5,5.4-u*.8,.2,1.5,1.4,56);c3Night(t,1.5,{up:.1});c3Lens(.2,1.25+Math.sin(t*2)*.05,1.9,.5,lit,t);if(t<5.1)c3Wisp(.2+Math.cos(t*2)*(1-lit)*1.2,wy,1.9+Math.sin(t*2)*(1-lit)*1.2,t);c3Cue('wm',()=>later(()=>snd(440,1.5,880,'sine',.05),1500))}},
  {d:7,cap:['',"She was the North Light's last flame, waiting for a keeper to carry her home."],f(t,u){const e=c3Sm(1,6.2,t),L=C3LAMP(),x=c3Lp(.2,L[0],e),y=c3Lp(1.3,L[1],e)+Math.sin(e*3.14)*5,z=c3Lp(1.9,L[2],e);c3Cam(-7,6.5,7,12,3.5,-3,60);c3Night(t,1.9,{up:.5,thorn:1});c3BeamTo(L[0],L[1],L[2],1,1.8);c3Lens(x,y,z,.5,1,t);c3Cue('go',()=>later(()=>snd(520,2.2,1560,'triangle',.05),1000))}},
  {d:8,cap:['',"The North Light opens its eye. Out in the water, something very old lifts its head to look."],f(t,u){const lit=c3Sm(.6,2.2,t),L=C3LAMP(),a=3.3-u*1.1,ba=t*.7;c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',9,3*lit);
    c3Cam(C3TW[0]+Math.cos(a)*14,1.6+u*2.2,C3TW[1]+Math.sin(a)*14,C3TW[0]-1,5,C3TW[1]+1,60);c3Tower(lit*1.4);c3Pier(7);if(lit>.2)c3Beam(L[0],L[1],L[2],L[0]+Math.cos(ba)*60,L[1]-1,L[2]+Math.sin(ba)*60,.3,2.2,'#ffe9a0',.5*lit);
    c3Bessie(C3TW[0]-7,C3TW[1]+7.5,2.4,c3Sm(3,6.5,t),t);if(t>.6&&t<1.2)c3q.flash=(1-(t-.6)/.6)*.8;c3Cue('nl',()=>{later(()=>{snd(392,.2);later(()=>snd(587,.2),150);later(()=>snd(784,.6),300)},600);later(()=>snd(60,2.2,45,'sine',.25),3200)})}},
  {d:6.5,cap:['MARCUS',"BRO. There is a lake monster. Nobody else name her. She's Bessie. I called it."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,3);c3Lamp(44.5,1.6,-3,'#ffd890',3,1);
    c3Cam(42.6+u*.4,1.35,-.4,48.5,2.2,-5.5,52);c3Tower(1.4);c3Pier(7);c3Person(44.2,-2.6,2.3,Object.assign({},C3MARC,{arm:2.2+Math.sin(t*10)*.25,up:.3}));c3Person(45.4,-1.5,2.2,Object.assign(c3Look(),{up:.3}));c3Dog(43.4,-3.5,2.3,{sit:1,up:.3});
    c3Bessie(C3TW[0]-7,C3TW[1]+7.5,2.4,1,t);const ba=t*.7+5.6;c3Beam(L[0],L[1],L[2],L[0]+Math.cos(ba)*60,L[1]-1,L[2]+Math.sin(ba)*60,.3,2.2,'#ffe9a0',.5)}},
  {d:8,cap:['',"Two lights, talking across the valley. The Lantern does not skip that night."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.3,.5,-.8,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);c3Lamp(L[0],L[1],L[2],'#ffd890',9,3);
    c3Cam(-17+u*4,13+u*2,15,22,1,-6,62);c3Lantern(1.9,4);c3House(6.2,-5.4,-.5,1);c3Soil();c3Tower(1.4);c3Door(1,.5,t);c3BeamTo(L[0],L[1],L[2],1,1.6);c3Beam(L[0],L[1],L[2],C3LT[0],C3LT[1]+.5,C3LT[2],.3,1.6,'#ffe9a0',.5)}},
  {d:7.5,cap:['THORNBACK',"Keep. Call. And a third thing, under the mountain. It hummed. I did not like it."],f(t,u){const hm=c3Sm(2.2,3.4,t)*(1-c3Sm(5.6,6.8,t));c3Env('night');c3EN.ff=150;c3EN.fn=30;c3Moon(-.75,.4,-.5,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);
    c3Cam(-2.4+u*.5,1.4,9.6,-5.2,3.2-u*.3,-8,52);c3Lantern(1.9,4);c3Soil();c3Thorn(-5.2,3.2,3.05,{t,up:1});c3Peak(hm,t);c3Cue('hu',()=>later(()=>snd(55,2.8,58,'sawtooth',.05),2200))}}]};

/* ---------- 6. playing a scene ---------- */
/* the scenes in the order the story meets them, for the Collection's SCENES page; seen ones are remembered across saves */
const C3LIST=[['dawn','THE CRACK','The night the Lantern cracked, and the morning after.'],['van','FLOW PROS','Marcus, Derek, a van by the Dew Pond, and a business idea.'],['blaze','THE BLAZE','The fourth shard comes home.'],['call','THE CALL','The night the Lantern stopped skipping and started pointing.'],['coast','THE COAST','The first walk out to the Wending Lake.'],['relight','NORTH LIGHT','The lens comes home, and the second lantern burns.']];
const c3SeenScene=k=>!!(meta.scn&&meta.scn[k]);
function c3Play(key,done){const S=C3SCN[key];if(!S){if(done)done();return}if(!c3SeenScene(key)){meta.scn=meta.scn||{};meta.scn[key]=1;try{save()}catch(e){}}c3q={key,S,i:0,t:0,done:done||null,cue:{},flash:0,tear:0,shake:0,tt:0};state='c3'}
const c3TextLen=s=>s.length/34+2.3;
function c3End(){const f=c3q&&c3q.done;c3q=null;state='play';if(f)f();if(state==='play')persist()}
function c3Update(dt){const q=c3q;if(!q){state='play';return}q.t+=dt;q.tt+=dt;const sh=q.S[q.i];if(pressed('start')){snd(330,.06);c3End();return}
 const typed=q.t*34>=sh.cap[1].length,nxt=()=>{q.i++;q.t=0;q.cue={};if(q.i>=q.S.length)c3End()};
 if(pressed('a')||pressed('b')){if(!typed)q.t=Math.max(q.t,sh.cap[1].length/34);else{snd(440,.04);nxt()}return}
 if(q.t>=Math.max(sh.d,c3TextLen(sh.cap[1])))nxt()}
/* hold: a shot's own clock stops at its length, so a scene that has finished moving waits there for its words */
function c3Frame(q,top,h){const sh=q.S[q.i],t=q.t;c3Size(h);if(!C3VAL)c3BuildValley();q.flash=0;q.tear=0;q.shake=0;c3D=c3M=c3New();c3X=[1,0,0,0,0,1,0,0,0,0,1,0];c3XS=[];c3stat.tris=0;
 let pre=[];const sky=c3Sky,moon=c3Moon;c3Moon=(...a)=>pre.push(a); /* the moon is painted on the sky, so it waits for the sky */
 try{sh.f(t,Math.min(1,t/sh.d))}finally{c3Moon=moon}
 if(q.shake){const k=q.shake*.06;c3CE[0]+=Math.sin(q.tt*71)*k;c3CE[1]+=Math.sin(q.tt*93)*k}
 sky(q.tt);for(const a of pre)moon(...a);const night=c3EN.sky[0][2]<60,WM=c3M=c3New();c3Water(q.tt,night);c3M=c3D;c3Show(C3VAL,[WM,c3D]);
 const px=c3px;if(q.tear){for(let k=0;k<5;k++){const y0=((q.tt*97+k*53)|0)%(h-8),hh=3+k*2,dx=((k%2?1:-1)*(4+k*3));for(let y=y0;y<y0+hh&&y<h;y++){const o=y*c3W;if(dx>0)px.copyWithin(o+dx,o,o+c3W-dx);else px.copyWithin(o,o-dx,o+c3W)}}}
 if(c3cx)c3cx.putImageData(c3im,0,0)}
/* On a slow device the picture is worked out every other frame (the last one is shown again in between); words and
   input still run every frame. It switches on above about 26 ms a frame and off again below 11. */
function c3DrawScene(){const q=c3q;r('#06050c',0,0,W,H);if(!q)return;const top=10,bot=50,h=Math.max(60,H-top-bot),sh=q.S[q.i];q.fn=(q.fn||0)+1;
 if(!q.half||q.fn%2||q.shot!==q.i||c3H!==h){const t0=typeof performance!=='undefined'?performance.now():0;c3Frame(q,top,h);q.shot=q.i;if(t0){const ms=performance.now()-t0;q.ms=q.ms===undefined||q.fn<3?ms:q.ms*.9+ms*.1;if(q.fn>8){if(q.ms>26)q.half=1;else if(q.ms<11)q.half=0}}}
 g.imageSmoothingEnabled=true;g.drawImage(c3cv,0,0,c3W,h,0,top,W,h);g.imageSmoothingEnabled=false;
 if(q.flash>0)r('rgba(255,248,220,'+Math.min(1,q.flash).toFixed(2)+')',0,top,W,h);
 const fi=q.i===0?Math.max(0,1-q.t/.6):0;if(fi>0)r('rgba(6,5,12,'+fi.toFixed(2)+')',0,top,W,h);
 const who=sh.cap[0],s=sh.cap[1],ls=wrapPx(s,228),n=Math.floor(q.t*34);let c=0,y=H-bot+5;
 if(who){const w=tw(who)+10;r(WHO[who]||'#c8c0d8',6,H-bot-9,w,13);text(who,11,H-bot-9,2,'#181020',null)}
 ls.slice(0,3).forEach((l,k)=>{text(l.slice(0,Math.max(0,n-c)),6,y+k*13,2,who?'#fff8e0':'#d8d4e8',null);c+=l.length+1});
 text((q.i+1)+' / '+q.S.length,4,0,1,'#585070',null);rtext('START: SKIP',236,0,1,'#585070',null);
 if(n>=s.length&&((time*3)|0)%2){r('#f8e060',229,H-9,5,3);r('#f8e060',230,H-6,3,1);r('#f8e060',231,H-5,1,1)}}
