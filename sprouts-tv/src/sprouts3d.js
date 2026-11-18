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
const c3W=320,C3REF=240,c3NEAR=.25,c3DTH=[0,4,1,5,6,2,7,3,1,5,0,4,7,3,6,2];
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
 c3CE=[ex,ey,ez];c3CF=[fx,fy,fz];c3CR=[rx,0,rz];c3CU=[-rz*fy,rz*fx-rx*fz,rx*fy];c3FL=(C3REF/2)/Math.tan((fov||60)*Math.PI/360)}
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
function c3Seen(c,R){const dx=c[0]-c3CE[0],dy=c[1]-c3CE[1],dz=c[2]-c3CE[2],zc=dx*c3CF[0]+dy*c3CF[1]+dz*c3CF[2];if(zc<-R)return false;if(zc<R*1.2)return true; /* it reaches the camera: always in */
 const xc=dx*c3CR[0]+dz*c3CR[2],yc=dx*c3CU[0]+dy*c3CU[1]+dz*c3CU[2],k=(zc+R)/c3FL;
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
 h=c3Lp(.45,h,c3Sm(4.5,8.5,Math.hypot(x-10,z+18))); /* level ground for the old arch */
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
 C3TREES=[];for(let k=0;k<420&&C3TREES.length<150;k++){const x=X0+2+c3Hs(k,1,21)*(X1-X0-4),z=Z0+2+c3Hs(k,2,22)*(Z1-Z0-4),r=Math.hypot(x,z);if(r<7.5||x>35||c3RivD(x,z)<3.4||(Math.abs(z)<1.8&&x>-16&&x<22)||(Math.abs(x)<1.8&&Math.abs(z)<16)||Math.hypot(x-C3DR[0],z-C3DR[1])<4||Math.hypot(x+11,z-5)<8||Math.hypot(x-10,z+8)<5.5||Math.hypot(x-10,z+18)<4.5||Math.hypot(x+6,z-11)<4.6||(Math.abs(z)<2&&x<-3&&x>-9))continue;
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
 if(!o.sit)c3Shadow(x,y,z,o.lie?.7:.44);c3Push();c3T(x,y+bob,z);c3RY(ang);if(o.lie){c3T(0,.3,0);c3RX(-1.5708)}
 for(const s of[-1,1]){c3Push();c3T(s*.13,.36,0);c3RX(o.sit?-1.25+s*.08:s*sw);c3Box(-.1,-.36,-.11,.1,0,.13,bt,o.legs||o.coat);c3Pop()}
 if(o.kind==='erin')c3Cyl(6,.36,.2,.24,.84,o.coat,o.coatL);else c3Cyl(6,.27,.21,.3,.84,o.coat,o.coatL);
 for(const s of[-1,1]){c3Push();c3T(s*.3,.78,0);c3RZ(s*.2);c3RX(-s*sw+(o.arm&&s>0?-o.arm:0)+(o.arms?-o.arms:0));c3Box(-.07,-.4,-.07,.07,0,.07,o.coat,o.coatL);c3Box(-.065,-.5,-.065,.065,-.4,.065,sk);c3Pop()}
 c3T(0,1.12,0);c3RX(-(o.up||0));c3Ball(.3,.28,.29,c3Mix(sk,'#d8a880',.5),sk,8,5);
 c3Box(-.17,-.04,.255,-.09,.07,.295,C3K);c3Box(.09,-.04,.255,.17,.07,.295,C3K);
 if(o.kind==='erin'){c3Ball(.33,.3,.32,o.cap,o.capL,8,3,0,.52,1);c3Push();c3T(0,-.04,-.14);c3Ball(.32,.34,.24,o.cap,o.capL,7,4);c3Pop();c3Box(-.33,-.2,-.1,-.25,.12,.14,o.cap);c3Box(.25,-.2,-.1,.33,.12,.14,o.cap)}
 else if(o.kind==='ranger'){c3Ball(.3,.3,.3,o.cap,o.capL,8,3,0,.55,1);c3Cyl(8,.52,.5,.06,.1,o.cap,o.capL);c3Cyl(8,.31,.3,.1,.17,'#c03030','#e05050');c3Box(-.3,-.12,-.26,.3,.04,-.1,'#583828')}
 else{c3Ball(.325,.3,.315,o.cap,o.capL,8,3,0,.5,1);c3Box(-.24,.02,.18,.24,.07,.5,o.cap,o.capL);if(o.kind==='marcus'){c3Box(-.2,-.24,.16,.2,-.1,.3,'#704828');c3Box(-.26,-.22,-.05,-.19,-.02,.26,'#704828');c3Box(.19,-.22,-.05,.26,-.02,.26,'#704828')}else c3Box(-.3,-.12,-.26,.3,.04,-.1,'#583828')}
 c3Pop()}
const c3Look=()=>{const c=STY.cap[meta.eq.cap],t=STY.coat[meta.eq.coat];return{cap:c[1],capL:c[2],coat:t[1],coatL:t[2],kind:'will'}};
const C3ERIN={cap:'#b84828',capL:'#e87848',coat:'#9070d0',coatL:'#c0a8f0',kind:'erin'},C3MARC={cap:'#284878',capL:'#5080b8',coat:'#e88020',coatL:'#f8c060',kind:'marcus'},C3RANG={cap:'#a88040',capL:'#e8c888',coat:'#506838',coatL:'#88a060',skin:'#e8c098',kind:'ranger'},C3DEREK={cap:'#1c4a98',capL:'#2a6ad0',coat:'#7a2a20',coatL:'#a03a2e',legs:'#3c4a66',skin:'#e8b088',kind:'marcus'};
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
function c3Van(who,rip,t,o){o=o||{};const V=o.pos||C3VAN,x=V[0],z=V[1],y=c3G(x,z)+(o.yo||0),W1='#c8ccd8',W2='#f4f6fa',K='#181420';c3Shadow(x,c3G(x,z),z,2.3);c3Push();c3T(x,y,z);c3RY(V[2]);if(o.tilt)c3RZ(o.tilt);
 c3Box(-2,.45,-.9,1.1,2.1,.9,W1,W2);c3Box(1.1,.45,-.86,2,1.3,.86,W1,W2);c3Box(1.1,1.3,-.82,1.55,2,.82,'#5888b8','#a8d0f0');c3Box(1.98,.8,-.7,2.03,1,.7,'#f8e060','#fff8a0',.6);c3Box(1.95,.45,-.9,2.06,.62,.9,'#383048');
 for(const s of[-1,1]){c3Box(-2.01,1,s*.9-.012,1.11,1.22,s*.9+.012,'#1c4a98','#2a6ad0');c3Box(1.2,1.38,s*.86-.01,1.5,1.9,s*.86+.01,'#5888b8','#a8d0f0')}
 c3Box(-1.25,.55,.5,.25,1.95,.915,K,'#241c30');c3Box(-1.25,.5,.9,.25,.58,1.12,'#383048','#686078');c3Box(-2.35,.55,.92,-1.25,1.95,.99,W1,W2);c3Box(-2.3,1,.99,-1.3,1.22,1.0,'#1c4a98','#2a6ad0');
 for(const wx of[-1.35,1.25])for(const s of[-1,1]){c3Push();c3T(wx,.42,s*.82);c3RX(s*1.5708);c3Cyl(8,.42,.42,-.1,.14,K,'#383048',0,1);c3Cyl(6,.2,.2,.14,.16,'#888098','#b0a8c0',0,1);c3Pop()}
 c3Box(-1.8,2.1,-.55,.9,2.2,-.4,'#a87040','#c89050');c3Box(-1.8,2.1,.1,.9,2.2,.25,'#a87040','#c89050');for(let k=0;k<5;k++)c3Box(-1.7+k*.62,2.1,-.55,-1.62+k*.62,2.17,.25,'#a87040');c3Box(-1.9,2.2,-.3,1,2.34,-.14,'#b86838','#e89860');
 if(who===3){const h1=o.hit||0,h2=o.hit2||0;c3Person(-.12,.72,-.1,Object.assign({},C3MARC,{y:.3,sit:1,arms:.9+h1*.6,up:-.1+h1*.25}));c3Person(-.88,.72,.15,Object.assign(c3Look(),{y:.3+(o.jump||0),sit:1,arms:.9+h2*.6,up:-.1+h2*.25}));
  const rx=h2>h1?-.86:-.1;c3Push();c3T(rx,1.02+Math.max(h1,h2)*.12,1.08);c3Cyl(6,.09,.06,0,.12,'#70c8b0','#c0fff0',.5,1);c3Cyl(6,.035,.035,.12,.36,'#a8e8d8','#e8fff8',.5,1);c3Pop();if(Math.max(h1,h2)>.2&&Math.max(h1,h2)<.95)c3Glow(rx+.12,1.1,1.14,.22,'#ff9040',.8)}
 else if(who){const hit=o.hit||0;if(who===1)c3Person(-.12,.72,o.mturn||0,Object.assign({},C3MARC,{y:.3,sit:1,arm:o.marm||0,up:.05}));
  c3Person(-.88,.72,.15,Object.assign({},C3DEREK,{y:.3,sit:1,arms:1.1+hit*.5,up:-.1+hit*.25}));
  c3Push();c3T(-.86,1.02+hit*.12,1.08);c3Cyl(6,.09,.06,0,.12,'#70c8b0','#c0fff0',.5,1);c3Cyl(6,.035,.035,.12,.36,'#a8e8d8','#e8fff8',.5,1);c3Pop();if(hit>.2&&hit<.95)c3Glow(-.74,1.1,1.14,.22,'#ff9040',.8)}
 c3Pop();
 if(rip>0){const n=[Math.sin(V[2]),Math.cos(V[2])],ax=[Math.cos(V[2]),-Math.sin(V[2])];for(let k=0;k<9;k++){const q=(t*.22+k*.111)%1,r0=(.35+q*1.3)*rip,sx=-.6+Math.sin(k*2.4)*.7;
   c3Puff(x+ax[0]*sx+n[0]*(1+q*1.6)+Math.sin(t+k)*.2,y+1.3+q*2.6,z+ax[1]*sx+n[1]*(1+q*1.6)+Math.cos(t*.8+k)*.2,r0,.42*(1-q)*Math.min(1,rip))}}}
const c3VanAt=(side,along,h)=>{const a=C3VAN[2];return[C3VAN[0]+Math.sin(a)*side+Math.cos(a)*along,h,C3VAN[1]+Math.cos(a)*side-Math.sin(a)*along]};
/* Marcus's hot tub: a barrel, hot water, and the Embers that heat it */
const C3TUB=[-9.6,2.6];
function c3Tub(t,full){const x=C3TUB[0],z=C3TUB[1],y=c3G(x,z);c3Shadow(x,y,z,1.7);c3Push();c3T(x,y,z);c3Cyl(10,1.25,1.4,0,1.05,'#6a4428','#c89050');c3Cyl(10,1.42,1.42,.3,.4,'#383048','#686078');c3Cyl(10,1.44,1.44,.75,.85,'#383048','#686078');
 if(full){c3Disc(0,.98,0,1.3,[120,190,240],.85,2);for(let k=0;k<5;k++){const q=(t*.35+k*.2)%1;c3Puff(Math.sin(k*2.1)*.7,1.2+q*2.2,Math.cos(k*1.7)*.7,.35+q*.5,.34*(1-q))}}c3Pop();
 if(full)for(let k=0;k<7;k++){const a=k*.9+.3;c3Sprout(x+Math.cos(a)*1.75,z+Math.sin(a)*1.75,0,{ang:Math.atan2(-Math.cos(a),-Math.sin(a)),hop:Math.abs(Math.sin(t*5+k))*.06});c3Glow(x+Math.cos(a)*1.75,y+.3,z+Math.sin(a)*1.75,.5,'#ff9040',.3)}}
/* moonblooms in Erin's garden. open 0 to 1: each one a little after the last */
function c3Moonblooms(open,t){const gx=C3GA[0],gz=C3GA[1],y=c3G(gx,gz);for(let k=0;k<10;k++){const fx=gx-3.2+(k%5)*1.55+((k/5)|0)*.5,fz=gz-1.6+((k/5)|0)*1.9+(k%2)*.3,o=c3Sm(k*.08,k*.08+.25,open);c3Push();c3T(fx,y+.14,fz);c3Box(-.02,0,-.02,.02,.5,.02,'#2c8030');c3T(0,.56,0);c3Ball(.07+o*.13,.09+o*.05,.07+o*.13,c3Mix('#6878a8','#a8c8ff',o),c3Mix('#8898c8','#ffffff',o),6,3,o*.9);c3Pop();if(o>.05)c3Glow(fx,y+.72,fz,.3+o*.45+Math.sin(t*2+k)*.04,'#a8c8ff',.42*o)}}
/* a squirrel: s is its size (the dream one is as big as a house) */
function c3Squirrel(x,y,z,ang,s,t){c3Push();c3T(x,y,z);c3RY(ang);c3S(s,s,s);const D='#7a4a22',L='#c88848';c3Push();c3T(0,.3,0);c3Ball(.2,.28,.24,D,L,7,4);c3Pop();c3Push();c3T(0,.66,.1);c3Ball(.17,.16,.18,D,L,7,4);c3Box(-.11,0,.13,-.05,.07,.17,C3K);c3Box(.05,0,.13,.11,.07,.17,C3K);c3Box(-.03,-.07,.15,.03,-.02,.2,'#fff0d8');for(const q of[-1,1]){c3Push();c3T(q*.1,.12,0);c3Cyl(3,.05,0,0,.12,D,L,0,1);c3Pop()}c3Pop();
 let py=.2,pz=-.2;for(let k=0;k<5;k++){c3Push();c3T(0,py,pz);c3Ball(.15+k*.02,.15,.15,D,'#e8b070',6,3);c3Pop();py+=.17;pz+=k<2?-.1:.07+Math.sin(t*3)*.02}
 for(const q of[-1,1])c3Box(q*.12-.04,0,.02,q*.12+.04,.1,.2,D);c3Pop()}
/* the big red button. down 0 to 1 */
function c3Button(x,z,down){const y=c3G(x,z);c3Push();c3T(x,y,z);c3Cyl(8,.62,.55,0,.22,'#383048','#686078',0,1);c3Cyl(8,.5,.5,.22,.28,'#f8d030','#f8e060',0,1);c3Cyl(8,.42,.36,.28,.28+.3*(1-down*.8),'#a01828','#f04050',.25,1);c3Pop()}
/* a puff of road dust */
function c3Dust(x,z,rad,al){c3Push();c3T(x,c3G(x,z)+rad*.5,z);c3Ball(rad,rad*.6,rad,[176,150,110],[226,206,170],6,3,.2,0,1,2,al);c3Pop()}
/* a berry as big as a boulder, for dreams */
function c3Berry(x,y,z,s,t){c3Push();c3T(x,y,z);c3RY(t);c3Ball(s,s*.95,s,'#a01838','#f06080',7,4,.25);c3T(0,s*.95,0);c3Box(-s*.06,0,-s*.06,s*.06,s*.3,s*.06,'#2c6030');c3Pop()}
/* three long gouges in the ground by the Lantern, and one across its plinth. k: how much of them shows */
function c3Marks(k){for(let i=0;i<3;i++){const x0=-2.5+i*.42,z0=-1.9+i*.12,len=1.7*k;c3Push();c3T(x0,c3G(x0,z0)+.03,z0);c3RY(-.5);c3Box(-.09,0,0,.09,.03,len,'#241810','#3c2a20');c3Box(-.14,0,len*.1,-.09,.05,len*.9,'#6a4c38');c3Pop()}
 if(k>.6){c3Push();c3T(-1.05,.3,-.75);c3RY(-.95);c3RZ(.5);c3Box(-.03,0,0,.03,.5*(k-.6)/.4,.02,'#2a2238');c3Pop()}}
/* the Flow Pros key: a brass ring, a shaft and two teeth */
function c3Key(x,y,z,s,t,lay){c3Push();c3T(x,y,z);c3RY(t);if(lay)c3RZ(1.45);c3S(s,s,s);const a='#a87818',b='#f8d858';c3Push();c3T(0,.42,0);c3RX(1.5708);c3Cyl(8,.26,.26,-.05,.05,a,b,.35);c3Cyl(8,.13,.13,-.06,.06,'#3a2c10','#3a2c10');c3Pop();c3Box(-.05,-.5,-.04,.05,.2,.04,a,b,.35);c3Box(.05,-.5,-.04,.24,-.4,.04,a,b,.35);c3Box(.05,-.3,-.04,.18,-.22,.04,a,b,.35);c3Pop();c3Glow(x,y,z,s*.9,'#ffd860',.35+.15*Math.sin(t*3))}
/* Erin's garden: a fence, three beds, flowers. dug: the far bed is turned over */
const C3GA=[10,-8];
function c3Garden(t,dug){const gx=C3GA[0],gz=C3GA[1],y=c3G(gx,gz);c3Push();c3T(gx,y,gz);
 for(let k=0;k<22;k++){const u=k/22*4,sd=u|0,f=u-sd,px=sd===0?-4+f*8:sd===1?4:sd===2?4-f*8:-4,pz=sd===0?-3:sd===1?-3+f*6:sd===2?3:3-f*6;if(sd===2&&f>.38&&f<.62)continue;c3Box(px-.07,0,pz-.07,px+.07,.75,pz+.07,'#6a4428','#c89050')}
 c3Box(-4,.5,-3.04,4,.58,-2.96,'#a87040','#c89050');c3Box(-4.04,.5,-3,-3.96,.58,3,'#a87040','#c89050');c3Box(3.96,.5,-3,4.04,.58,3,'#a87040','#c89050');
 for(let b=0;b<3;b++){const bx=-2.6+b*2.6;c3Box(bx-1,.0,-1.9,bx+1,.14,1.3,'#5a3820','#8a5a3a');if(b===2&&dug){for(let k=0;k<5;k++){c3Push();c3T(bx-.6+k*.3,.14,-1.2+((k*7)%4)*.5);c3Ball(.22,.12,.2,'#5a3820','#a87850',5,2);c3Pop()}continue}
  for(let k=0;k<6;k++){const fx=bx-.6+(k%2)*1.2,fz=-1.5+((k/2)|0)*1.1,sw=Math.sin(t*2+k+b)*.05,C=[['#ffffff','#f8d040'],['#f85888','#f8a0c8'],['#f8c020','#f8e060']][(k+b)%3];c3Box(fx-.02+sw,.14,fz-.02,fx+.02+sw,.6,fz+.02,'#2c8030');c3Push();c3T(fx+sw*2,.66,fz);c3Ball(.13,.09,.13,C[0],C[1],6,3);c3Pop()}}
 c3Box(2.9,0,2.2,3.5,.4,2.8,'#a87040','#e8c888');c3Pop()}
/* the job site across the pond road: sawhorses, a board, a padlock. open 0 to 1 swings it aside */
const C3JS=[-6,0];
function c3Jobsite(open,t){const x=C3JS[0],z=C3JS[1],y=c3G(x,z);c3Push();c3T(x,y,z+1.6);c3RY(-open*1.5);c3T(0,0,-1.6);
 for(const s of[-1,1]){c3Box(-.08,0,s*1.5-.08,.08,.95,s*1.5+.08,'#583018','#a87040');c3Box(-.3,0,s*1.5-.06,.3,.08,s*1.5+.06,'#583018')}
 for(let k=0;k<6;k++)c3Box(-.05,.55,-1.5+k*.5,.05,.85,-1+k*.5,k%2?'#f4f6fa':'#e86820',k%2?'#ffffff':'#f89040');
 c3Box(-.07,.95,-.7,.07,1.5,.7,'#1c4a98','#2a6ad0');c3Box(-.09,1.1,-.5,.09,1.18,.5,'#f4f6fa','#ffffff');c3Box(-.09,1.26,-.35,.09,1.34,.35,'#f4f6fa','#ffffff');
 if(open<.05){c3Box(-.12,.36,-.1,.12,.56,.1,'#a87818','#f8d858',.3);c3Box(-.1,.56,-.07,.1,.66,.07,'#686078')}c3Pop()}
/* the old arch at Willow Falls, the cliff and the water behind it. lit: the lantern cut into it glows */
const C3AR=[10,-18];
function c3Arch(lit,t){const x=C3AR[0],z=C3AR[1],y=c3G(x,z)-.1,S1='#585c70',S2='#a0a8bc';
 c3Box(3,-.5,-27.5,19,8.5,-25.5,'#383048','#585068');c3Box(3,8.5,-27.7,19,9,-25.3,'#28705c','#38907c');
 for(let k=0;k<5;k++){const q=(t*.9+k*.2)%1,fx=11.4+k*.75;c3Box(fx,-.4,-25.45,fx+.6,8.4,-25.4,'#5898e8','#c8e8ff',.5);c3Box(fx+.1,8.2-q*8.4,-25.38,fx+.45,8.2-q*8.4+1.1,-25.34,'#e0f8ff','#ffffff',.9)}
 for(let k=0;k<4;k++)c3Puff(11.6+k*.9+Math.sin(t+k),.1+((t*.5+k*.3)%1)*.8,-24.9,.5,.3);
 c3Push();c3T(x,y,z);c3RY(.35);
 c3Box(-2.3,0,-.5,-1.3,4,.5,S1,S2);c3Box(1.3,0,-.5,2.3,4,.5,S1,S2);c3Box(-2.6,4,-.6,2.6,4.9,.6,S1,S2);c3Box(-1.3,3.4,-.45,-.7,4,.45,S1,S2);c3Box(.7,3.4,-.45,1.3,4,.45,S1,S2);c3Box(-1.3,0,-.5,1.3,3.9,-.3,'#2c2840','#3c3854');
 c3Box(-2.6,4.9,-.62,-.8,5.05,.62,'#2c7848','#3c9858');c3Box(1.5,2.2,.5,2.32,2.35,.56,'#3c9858');
 const sc=c3Mix('#c8a040','#ffe070',lit);c3Box(-.3,4.2,.6,.3,4.75,.66,sc,sc,.4+lit*.6);for(let i=0;i<8;i++){const a=i*.7854;c3Box(Math.cos(a)*.5-.06,4.47+Math.sin(a)*.34-.05,.6,Math.cos(a)*.5+.06,4.47+Math.sin(a)*.34+.05,.65,sc,sc,.4+lit*.6)}
 /* the carving: a lantern in the middle, sprouts to the left, buddies to the right */
 const C='#8890a8',C2='#c0c8dc',lg=c3Mix('#585070','#f8e060',lit);c3Box(-.1,.4,-.3,.1,1.9,-.2,C,C2);c3Box(-.34,1.9,-.3,.34,2.6,-.18,C,C2);c3Box(-.24,2,-.18,.24,2.5,-.14,lg,lg,lit);c3Box(-.46,2.6,-.3,.46,2.76,-.18,C,C2);
 for(let i=0;i<3;i++){const sx=-1.08+i*.34,sy=.4+(i%2)*.25;c3Box(sx-.13,sy,-.3,sx+.13,sy+.3,-.2,C,C2);c3Box(sx-.025,sy+.3,-.3,sx+.025,sy+.52,-.22,C2);c3Box(sx-.02,sy+.5,-.3,sx+.12,sy+.56,-.22,C2)}
 c3Box(.5,.4,-.3,1.18,1.3,-.18,C,C2);c3Box(.58,1.3,-.3,.8,1.62,-.18,C,C2);c3Box(.94,1.3,-.3,1.12,1.55,-.18,C,C2);c3Box(.62,.95,-.18,.7,1.05,-.15,'#2c2840');c3Box(.9,.95,-.18,.98,1.05,-.15,'#2c2840');
 c3Pop();if(lit>0)c3Glow(x+Math.sin(.35)*.2,y+2.25,z+.3,.7+lit*.9,'#ffe890',.5*lit)}
const c3ArchAt=(side,front,h)=>{const a=.35;return[C3AR[0]+Math.cos(a)*side+Math.sin(a)*front,h,C3AR[1]-Math.sin(a)*side+Math.cos(a)*front]};
/* glowing mushrooms for the hollow */
function c3Shrooms(x,z,t){for(let k=0;k<9;k++){const a=k*2.1,rr=2.6+(k%4)*1.1,mx=x+Math.cos(a)*rr,mz=z+Math.sin(a)*rr*.8,my=c3G(mx,mz);c3Push();c3T(mx,my,mz);c3Cyl(5,.05,.04,0,.22,'#d0f8ff','#d0f8ff',.6);c3T(0,.22,0);c3Ball(.17,.1,.17,'#2890a8','#90f0f8',6,2,.7,.5,1);c3Pop();c3Glow(mx,my+.25,mz,.5+.08*Math.sin(t*2+k),'#60d8e8',.3)}}
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
/* Thornback's hollow: dark, green, lit by mushrooms and the shard under his chin */
/* the sky Louie dreams in: pink and gold, no ground to speak of */
function c3Dream(t){c3Env('gold');c3EN.sky=[c3C('#f078c0'),c3C('#f8e098')];c3EN.fog=c3C('#f8c8a8');c3EN.fn=14;c3EN.ff=60;c3EN.amb=[.8,.7,.7];for(let k=0;k<9;k++)c3Puff(-16+k*5+((t*.8)%5),3.4+(k%3)*1.1,-3+(k%4)*2.2,1.6+(k%3)*.5,.5)}
const C3HO=[-6,11],c3HoAt=(dx,dz)=>[C3HO[0]+dx,C3HO[1]+dz];
function c3Hollow(t){c3Env('night');c3EN.fog=c3C('#081818');c3EN.amb=[.26,.4,.36];c3EN.fn=5;c3EN.ff=24;c3EN.sky=[c3C('#040c10'),c3C('#0a2020')];c3EN.stars=0;c3Lamp(C3HO[0]+1.2,1,C3HO[1]+1.6,'#ffd860',4.5,1.7+Math.sin(t*3)*.1);c3Shrooms(C3HO[0],C3HO[1],t);
 for(let k=0;k<11;k++){if(k===1||k===2)continue;const a=k*.571+.2,rr=6.2+(k%3)*1.3;c3Tree(C3HO[0]+Math.cos(a)*rr,C3HO[1]+Math.sin(a)*rr,4+(k%4)*.7,k*3+1)}}
const C3A_LAKE=Math.atan2(C3TW[1],C3TW[0]),C3A_DOOR=Math.atan2(C3DR[1],C3DR[0]);
const C3SCN={
 /* EASTER EGG: the van at dusk. Marcus calls it "see one, send one" */
 sesh:[
  {d:6.5,cap:['MARCUS',"Long day, bro. You know the rule. See one, send one."],f(t,u){c3Env('dusk');const e=c3VanAt(7.5-u,3.2,2.3),g2=c3VanAt(.4,-.3,1.1),d=c3VanAt(2,-2.3,0),l=c3VanAt(2.6,.9,0);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],52);c3Lamp(g2[0],1.6,g2[2],'#ffd890',3.5,.9);c3Van(3,.3,t);c3Person(d[0],d[2],C3VAN[2]-1.9,Object.assign({},C3DEREK,{up:.1}));c3Dog(l[0],l[2],C3VAN[2]+2.6,{sit:1})}},
  {d:7,k:3.8,cap:['MARCUS',"*kkhhh* ...That's seeing one. Now you send one, bro."],f(t,u){const hit=c3Sm(.4,1.8,t)*(1-c3Sm(2.4,3,t)),rip=c3Sm(2.3,3.4,t);c3Env('dusk');const e=c3VanAt(4.2-u*.4,-.2,1.5),g2=c3VanAt(0,-.4,1.25);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],50);c3Lamp(g2[0],1.6,g2[2],'#ffd890',3.5,.9);c3Van(3,.25+rip*1.1,t,{hit});
    c3Cue('r1',()=>{c3At(()=>noise(1.3,.12,1800,'bandpass'),500);c3At(()=>{noise(.12,.3,900);c3At(()=>noise(.1,.25,800),160)},2400)})}},
  {d:7.5,k:4.6,cap:['',"Will sends one. Will at once regrets how big a one he sent."],f(t,u){const hit=c3Sm(.4,2,t)*(1-c3Sm(2.6,3.1,t)),rip=c3Sm(2.5,3.6,t),cough=t>3.1&&t<5.2?Math.abs(Math.sin(t*11))*.12:0;c3Env('dusk');const e=c3VanAt(3.6,-1.5,1.4),g2=c3VanAt(0,-.85,1.3);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],44);c3Lamp(g2[0],1.6,g2[2],'#ffd890',3.5,.9);c3Van(3,.3+rip*1.5,t,{hit2:hit,jump:cough});
    c3Cue('r2',()=>{c3At(()=>noise(1.5,.12,1800,'bandpass'),500);for(let k=0;k<5;k++)c3At(()=>noise(.11,.3,800+k*60),3100+k*330)})}},
  {d:7.5,cap:['MARCUS',"Bro. What if the Lantern is just, like... a really big dab rig."],f(t,u){c3Env('night');c3Moon(-.2,.8,.4,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',9,2);const b=c3VanAt(4.2,.4,0);c3Cam(b[0]+2.6,4.6-u*.6,b[2]+4.6,b[0]-.6,.4,b[2],50);c3Lantern(1,4);c3Van(0,.25,t);
    c3Person(b[0],b[2],.9,Object.assign({},C3MARC,{lie:1,arm:1.4+Math.sin(t*1.5)*.3}));c3Person(b[0]+1.1,b[2]-.9,.9,Object.assign(c3Look(),{lie:1}));c3Person(b[0]-1.1,b[2]+.9,.9,Object.assign({},C3DEREK,{lie:1}));c3Dog(b[0]+2,b[2]-2,2.2,{sit:1,up:.4});c3Sprout(b[0]+1.1+.42,b[2]-.9+.52,2,{y:c3G(b[0],b[2])+.5,hop:Math.abs(Math.sin(t*2))*.05,noSh:1})}},
  {d:5.5,cap:['DEREK',"...Bro."],f(t,u){c3Env('night');c3Moon(-.2,.8,.4,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',9,2+Math.sin(t*2)*.3);c3Cam(-9,1.1,4.5,0,3.4-u*.3,0,40+u*4);c3Lantern(1+Math.sin(t*2)*.15,4);c3House(6.2,-5.4,-.5,1);for(let k=0;k<4;k++)c3Puff(-.4+k*.3+Math.sin(t+k)*.3,4.4+((t*.4+k*.25)%1)*2.2,0,.5+k*.12,.22)}}],
 /* EASTER EGG: the van by day. Marcus and Derek have a job */
 job:[
  {d:5.5,cap:['',"A quiet morning at the Lantern."],f(t,u){c3Env('dawn','day',.6);c3Cam(6.5-u*.5,2.2,8.5,0,1.6,1,54);c3Lantern(.5,2,{force:1});c3House(6.2,-5.4,-.5,0);c3Soil();c3Person(-1.5,5.6,.4,Object.assign({},C3ERIN,{}));c3Ring(t,7);c3Cue('en',()=>{for(let k=0;k<5;k++)c3At(()=>snd(70+k*14,.9,90+k*16,'sawtooth',.03+k*.012),1400+k*800)})}},
  {d:7,k:4.2,cap:['MARCUS',"FLOW PROS, BABY! WE GOT A JOB!"],f(t,u){const vx=-24+t*8,vz=Math.sin(t*3)*.25;c3Env('day');c3Cam(6.5,2,8.5,Math.max(-6,Math.min(6,vx)),1.2,0,58);c3Lantern(.5,2,{force:1});c3Soil();c3q.shake=vx>-8&&vx<10?.9:0;
    c3Van(1,vx>-14?1.1:0,t,{pos:[vx,vz+1.2,-1.5708+.02],yo:Math.abs(Math.sin(t*9))*.08,marm:2.6});for(let k=0;k<6;k++){const dx=vx-2.6-k*1.5;if(dx>-24)c3Dust(dx,1.2+Math.sin(k*2)*.8,.5+k*.18,.4-k*.05)}
    const sc=vx>-7;c3Person(-1.5,5.6,sc?2.6:.4,Object.assign({},C3ERIN,{arm:sc?2.8:0,arms:sc?2.4:0}));for(let k=0;k<7;k++){const a=k*.9,fx=Math.cos(a)*2.2,fz=3.6+Math.sin(a)*.8,jump=sc?Math.min(1,(vx+7)/4):0;c3Sprout(fx,fz+jump*1.6,k,{hop:sc?Math.abs(Math.sin(jump*3.14))*1.3:0,ang:a})}
    c3Cue('vr',()=>{c3At(()=>{for(let k=0;k<5;k++)c3At(()=>snd(150,.5,110,'sawtooth',.09),k*380);noise(2.4,.2,300,'lowpass')},1700);c3At(()=>{snd(440,.12);c3At(()=>snd(440,.3),160)},2500)})}},
  {d:6.5,cap:['DEREK',"What's the job?"],f(t,u){const vx=2+t*2.4,vz=.6+Math.sin(t*1.3)*.3;c3Env('day');c3Cam(vx+3.6,1.5,vz+3.3,vx+.2,1.25,vz+.6,54);c3q.shake=.5;c3Van(1,1,t,{pos:[vx,vz,-1.5708+.05],yo:Math.abs(Math.sin(t*9))*.07,hit:.5+.5*Math.sin(t*2)});for(let k=0;k<5;k++)c3Dust(vx-2.6-k*1.4,vz+Math.sin(k*2)*.6,.5+k*.18,.36-k*.05);c3Cue('v2',()=>{for(let k=0;k<6;k++)c3At(()=>snd(150,.6,120,'sawtooth',.06),k*900)})}},
  {d:7.5,k:4.4,cap:['MARCUS',"No idea, bro. Guy said \"it's leaking.\" Didn't say what. Didn't say where. SEND IT."],f(t,u){const vx=6+t*3.2,air=c3Sm(3,3.5,t)*(1-c3Sm(4.1,4.5,t)),vz=1.6+Math.sin(t*.9)*.5;c3Env('day');c3Cam(C3DR[0]-6.5,2.2+u,C3DR[1]+6.5,Math.min(C3DR[0]-1,vx),1.3+air,vz,56);c3Door(1,.5,t);c3q.shake=air>0&&t>4.4?1:.3;
    if(vx<C3DR[0]+1.5)c3Van(1,1,t,{pos:[vx,vz,-1.5708+.1],yo:air*1.3+Math.abs(Math.sin(t*9))*.06,tilt:air*.25,marm:2.8});for(let k=0;k<5;k++)if(vx-2.6-k*1.4<C3DR[0])c3Dust(vx-2.6-k*1.4,vz,.5+k*.2,.36-k*.05);
    c3Cue('v3',()=>{for(let k=0;k<3;k++)c3At(()=>snd(160,.7,130,'sawtooth',.06),k*900);c3At(()=>snd(300,.5,900,'sine',.05),3000);c3At(()=>noise(.4,.35,200,'lowpass'),4500)})}},
  {d:6.5,cap:['ERIN',"...They do know the pond is the other way."],f(t,u){c3Env('day');c3Cam(-5.5+u*.5,1.7,7.8,1.5,1.3,3.5,50);c3Lantern(.5,2,{force:1});c3Soil();c3Person(-1.5,5.6,1.5,Object.assign({},C3ERIN,{}));c3Dog(2.2+Math.sin(t*7)*.3,4.6,1.5708,{walk:t,up:.2});for(let k=0;k<4;k++)c3Dust(4+k*2.4+t*.6,1.2,.9+k*.2,.3*(1-u)-k*.04);
    for(let k=0;k<7;k++){const a=k*.9;c3Sprout(Math.cos(a)*2.2,5.2+Math.sin(a)*.8,k,{ang:k===3?t*9:1.5,hop:k===3?0:Math.abs(Math.sin(t*5+k))*.08})}c3Cue('bk',()=>{c3At(()=>bark(),500);c3At(()=>bark(),1300)})}}],
 /* EASTER EGG: the tenth scratch behind the ears */
 zoomies:[
  {d:5.5,cap:['',"It starts, as it always does, with no warning at all."],f(t,u){c3Env('day');c3Cam(3.6,1.1,8.6,1,.8,5.6,44);c3Lantern(.5,2,{force:1});c3Soil();c3Person(1.7,5.9,2.6,Object.assign(c3Look(),{up:-.1}));c3Dog(.4,6.4,1.2+(t>3.6?Math.sin(t*40)*.3:0),{sit:t<3.6,up:t>2.2?.35:0})}},
  {d:7,cap:['LOUIE',"ARF ARF ARF ARF ARF ARF ARF"],f(t,u){const a=t*4.6,rr=5.2+Math.sin(t*2)*.8,lx=Math.cos(a)*rr,lz=Math.sin(a)*rr*.85+1;c3Env('day');c3Cam(9+Math.sin(t*.7),6,10.5,0,1.2,1,56);c3Lantern(.5,2,{force:1});c3House(6.2,-5.4,-.5,0);c3Soil();c3Person(1.7,5.9,a+2,Object.assign(c3Look(),{up:0}));
    c3Dog(lx,lz,Math.atan2(-Math.sin(a),Math.cos(a)*.85),{walk:t*2.2});for(let k=1;k<6;k++){const b=a-k*.28;c3Dust(Math.cos(b)*rr,Math.sin(b)*rr*.85+1,.3+k*.1,.34-k*.05)}
    for(let k=0;k<9;k++){const b=k*.7;c3Sprout(Math.cos(b)*3,1+Math.sin(b)*2.6,k,{ang:a+1.57-b,hop:Math.abs(Math.sin(t*6+k))*.1})}c3Cue('zb',()=>{for(let k=0;k<9;k++)c3At(()=>bark(),k*650)})}},
  {d:6.5,k:3.2,cap:['',"Eleven sprouts down. No injuries. Several complaints."],f(t,u){const lz=-9+t*7.5,hit=lz>1;c3Env('day');c3Cam(.6,.7,9.5,0,1,2,58);c3Lantern(.5,2,{force:1});if(lz<11)c3Dog(.2,lz,0,{walk:t*2.2,y:c3G(.2,lz)+(lz>6?Math.sin(Math.min(1,(lz-6)/3.5)*3.14)*1.6:0)});
    for(let k=0;k<11;k++){const sx=-2.6+k*.52,sz=3.2+(k%3)*.5,q=Math.max(0,Math.min(1,(lz-sz+.5)/3));c3Sprout(sx+(k-5)*q*.35,sz+q*1.2,k,{hop:Math.sin(q*3.14)*1.8,ang:q*9+k,noSh:q>0&&q<1})}
    if(lz>6&&lz<10)c3q.shake=1;c3Cue('zc',()=>{c3At(()=>{for(let k=0;k<6;k++)c3At(()=>snd(500+k*90,.07,250,'triangle'),k*70)},1500)})}},
  {d:6,cap:['',"And then, just as suddenly, it is over."],f(t,u){c3Env('day','dusk',.4);c3Cam(2.6-u*.4,.9,7.6,.4,.5,5.4,44);c3Lantern(.5,2,{force:1});c3Soil();c3Push();c3T(.4,c3G(.4,5.6)+.25,5.6);c3RZ(1.45);c3Dog(0,0,1.57,{y:0});c3Pop();c3Sprout(.5,5.3,3,{y:c3G(.4,5.6)+.5,noSh:1,hop:Math.abs(Math.sin(t*1.5))*.04});
    c3q.label=[1.1,1.3+((t*.3)%1)*.6,5.6,'z Z',"#b0c8f8",1]}}],
 /* EASTER EGG: five Embers thrown in the pond. Marcus has an idea */
 hottub:[
  {d:7,cap:['',"Five Embers into the pond. Five Embers straight back out. Marcus watched all of it."],f(t,u){c3Env('day');c3Cam(-7.5,2.2+u*.5,-1.5+u,-11.5,.6,4.5,54);c3Van(0,.3,t);c3Person(-8.6,1.2,-1,Object.assign({},C3MARC,{arm:2.9,up:-.05}));
    for(let k=0;k<5;k++){const q=(t*.6+k*.2)%1,x=-11.6+q*1.4-k*.25,z=4.4-q*1.2+k*.35;c3Sprout(x,z,0,{y:c3G(x,z),hop:Math.sin(q*3.14)*1.1,ang:1});if(q<.3)c3Puff(-11.6-k*.25,.5+q*2,4.4+k*.35,.3+q,.5*(1-q/.3))}c3Cue('ss',()=>{for(let k=0;k<5;k++)c3At(()=>noise(.25,.2,3000),300+k*650)})}},
  {d:7,cap:['MARCUS',"Bro. Hot sprouts. Cold water. I'm not a scientist. But I AM a plumber."],f(t,u){c3Env('day');c3Cam(-4.8,1.9,-2,-8.8,1,2.2,50);c3Van(0,.3,t);c3Tub(t,0);c3Person(-8.2,1.6,.7,Object.assign({},C3MARC,{arm:2.5+Math.sin(t*6)*.3,arms:Math.max(0,Math.sin(t*3))*.8}));for(let k=0;k<5;k++)c3Sprout(-7.4+k*.45,2.9+(k%2)*.4,0,{ang:-1.2,hop:Math.abs(Math.sin(t*6+k))*.1})}},
  {d:8,k:4,cap:['MARCUS',"Hot tub's open. Don't tell Erin. ...Erin's right behind me, isn't she."],f(t,u){const E2=c3Sm(2.6,4,t);c3Env('day','dusk',.5);c3Cam(-4.6-u*.4,2.6,-2.6,-10,1,3,52);c3Tub(t,1);const y=c3G(C3TUB[0],C3TUB[1]);
    c3Person(C3TUB[0]+.35,C3TUB[1]-.1,.9,Object.assign({},C3MARC,{y:y-.05,sit:1,arm:E2>.5?0:2.7,up:.1}));c3Person(C3TUB[0]-.5,C3TUB[1]+.2,.9,Object.assign({},C3DEREK,{y:y-.05,sit:1}));c3Dog(C3TUB[0]+.1,C3TUB[1]+.7,.9,{y:y+.45,sit:1,up:.2});
    c3Person(c3Lp(-15.5,-11.7,E2),c3Lp(1.5,3.3,E2),1.3,Object.assign({},C3ERIN,{walk:E2<1?t:0,arms:E2>=1?.5:0}));c3Cue('er',()=>c3At(()=>snd(220,.3,165,'sine',.12),3900))}}],
 /* EASTER EGG: Erin, in her garden, at dusk */
 moon:[
  {d:6.5,cap:['ERIN',"Stay a minute, Will. They only do this at dusk."],f(t,u){c3Env('dusk');c3Cam(C3GA[0]+6.5-u,2.4,C3GA[1]+7,C3GA[0],.9,C3GA[1],52);c3Garden(t,0);c3Moonblooms(0,t);c3Person(C3GA[0]-.8,C3GA[1]+3.6,Math.PI,Object.assign({},C3ERIN,{arm:u<.5?2.2:0}));c3Person(C3GA[0]+.5,C3GA[1]+3.8,Math.PI,c3Look());c3Dog(C3GA[0]+1.6,C3GA[1]+4.2,Math.PI,{sit:1})}},
  {d:9,k:6.5,cap:['',"One by one the moonblooms open, and the garden turns the colour of the Lantern on a good night."],f(t,u){const o=c3Sm(.6,6.4,t);c3Env('dusk','night',o);c3Cam(C3GA[0]+2.8-u*1.2,1.1+u*.5,C3GA[1]+4.6-u,C3GA[0]-.4,.7,C3GA[1],46);c3Lamp(C3GA[0],1.4,C3GA[1],'#a8c8ff',6,1.6*o);c3Garden(t,0);c3Moonblooms(o,t);c3Cue('mb',()=>{for(let k=0;k<10;k++)c3At(()=>snd(660+k*55,.5,880+k*55,'sine',.035),700+k*520)})}},
  {d:7.5,cap:['ERIN',"Every evening. Whether anyone is watching or not. I like that about them."],f(t,u){c3Env('night');c3Moon(-.3,.6,-.7,13,'#e8ecff');c3Cam(C3GA[0]-5.5+u,3+u*.6,C3GA[1]+8.5,C3GA[0],.8,C3GA[1]+1,54);c3Lamp(C3GA[0],1.4,C3GA[1],'#a8c8ff',7,1.7);c3Garden(t,0);c3Moonblooms(1,t);
    c3Person(C3GA[0]-.8,C3GA[1]+3.6,Math.PI,Object.assign({},C3ERIN,{sit:1,y:c3G(C3GA[0],C3GA[1]+3.6)-.28}));c3Person(C3GA[0]+.5,C3GA[1]+3.8,Math.PI,Object.assign(c3Look(),{sit:1,y:c3G(C3GA[0],C3GA[1]+3.8)-.28}));c3Dog(C3GA[0]+1.6,C3GA[1]+4.2,Math.PI,{sit:1});for(let k=0;k<7;k++)c3Sprout(C3GA[0]-3+k*.9,C3GA[1]+4.9+(k%2)*.4,k,{ang:Math.PI,hop:0})}}],
 /* EASTER EGG: bothering Old Thornback five times */
 slide:[
  {d:6.5,cap:['',"Old Thornback sleeps like a boulder. The sprouts have noticed he is shaped like one, too."],f(t,u){c3Env('day');c3Cam(-.5-u,2.4,9.5,-5.6,1.2,3.6,50);c3Lantern(.6,4);c3Soil();c3Thorn(-6,3.4,1.9,{t,up:0});for(let k=0;k<8;k++)c3Sprout(-3.2+k*.38,5.6+(k%3)*.35,k,{ang:-1.9,hop:Math.abs(Math.sin(t*4+k))*.08});c3q.label=[-4.6,2.9+((t*.3)%1)*.5,4.4,'z Z','#b0c8f8',1]}},
  {d:8,cap:['',"It is a very good slide."],f(t,u){c3Env('day');c3Cam(-2.2,2.2+u*.4,8.6,-6,1.3,3.4,50);c3Thorn(-6,3.4,1.9,{t,up:0});const gy=c3G(-6,3.4),ax=Math.cos(1.9),az=-Math.sin(1.9);
    for(let k=0;k<9;k++){const q=(t*.42+k*.111)%1,sx=-1.9+q*3.8,h=Math.max(0,1.95*(1-(sx/1.9)*(sx/1.9)))+.1;c3Sprout(-6+ax*sx,3.4+az*sx+.2,k,{y:gy+h,ang:q*12*(q>.5?1:0)+1.2,noSh:1,hop:0})}
    c3Dog(-3.2,5.8,-1.6,{sit:1,up:.2});c3Cue('wh',()=>{for(let k=0;k<8;k++)c3At(()=>snd(500,.25,1100,'triangle',.04),k*800)})}},
  {d:7,k:3,cap:['THORNBACK',"...I am awake, you know. Go again."],f(t,u){const up=c3Sm(1,2.2,t)*.45;c3Env('day');c3Cam(-2.8+u*.4,1.2,7.2,-5,1.2,4.6,44);c3Thorn(-6,3.4,1.9,{t,up});for(let k=0;k<7;k++){const a=k*.5;c3Sprout(-3.6+Math.cos(a)*.9+k*.12,5.9+Math.sin(a)*.5,k,{ang:-2.2,hop:t>3?Math.abs(Math.sin(t*9+k))*.35:0})}c3Cue('tb',()=>c3At(()=>snd(100,.6,75,'sine',.25),1100))}}],
 /* EASTER EGG: the end of the pier, after dark, once the North Light burns */
 bessie:[
  {d:7,cap:['',"Late, at the end of the pier, Louie finds something looking back at him."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.2,.5,-.85,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,2.6);c3Cam(47.2+u*.6,1.5,-7.2,50.2,.5,-11.6,50);c3Tower(1.4);c3Pier(7);c3Dog(50.9,-10.75,-2.4,{y:C3WL+.45,sit:1});c3Bessie(48.9,-13.4,.75,.16+u*.06,t)}},
  {d:7.5,k:4.5,cap:['LOUIE',"...Grr. ...Arf?"],f(t,u){const rs=c3Sm(.8,4.2,t),L=C3LAMP();c3Env('night');c3Moon(.2,.5,-.85,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,2.6);c3Cam(52.6,.9,-8.2,49.6,1.2+rs*1.6,-12.6,56);c3Tower(1.4);c3Pier(7);c3Dog(50.9,-10.75,-2.4,{y:C3WL+.45,sit:rs>.5,up:.2+rs*.5});c3Bessie(48.9,-13.4,.75,.2+rs*.8,t);if(rs>0&&rs<1)c3q.shake=.4;c3Cue('bs',()=>{c3At(()=>snd(60,2.4,44,'sine',.25),800);c3At(()=>bark(),3300)})}},
  {d:7.5,k:3.6,cap:['',"She is very large, and very old, and it turns out she only wanted to say hello."],f(t,u){const dn=c3Sm(.5,3.2,t),L=C3LAMP();c3Env('night');c3Moon(.2,.5,-.85,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,2.6);c3Cam(53.4,1.3,-9.2,50.2,1,-11.7,48);c3Pier(7);c3Dog(50.9,-10.75,-2.4,{y:C3WL+.45,sit:1,up:.35});c3Bessie(49.9,-12.3,.75,1-dn*.62,t);if(t>3.3&&t<3.9)for(let k=0;k<3;k++)c3Glow(50.6,1.2+k*.25,-11.2,.25,'#f85888',.6);c3Cue('bp',()=>c3At(()=>{snd(880,.08,1320,'triangle',.07);c3At(()=>snd(1320,.2),90)},3300))}},
  {d:7,cap:['',"Louie has a new friend. He will not be telling the squirrels."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.2,.5,-.85,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,2.6);c3Cam(45.6-u,3+u,-5.4,51,.8,-11.6,54);c3Tower(1.4);c3Pier(7);c3Dog(50.9,-10.75,-2.4,{y:C3WL+.45,walk:t});c3Bessie(48.9-u*5,-13.8-u*3,-2.2,.5-u*.35,t);const ba=t*.7;c3Beam(L[0],L[1],L[2],L[0]+Math.cos(ba)*60,L[1]-1,L[2]+Math.sin(ba)*60,.3,2.2,'#ffe9a0',.45)}}],
 /* EASTER EGG: the fifth scratch. Louie dreams of squirrels */
 dream:[
  {d:5.5,cap:['',"Louie dreams."],f(t,u){c3Cam(2.8-u*.3,1,8,.4,.5,5.6,44);c3Night(t,1,{alone:1});c3Push();c3T(.4,c3G(.4,5.6)+.25,5.6);c3RZ(1.45);c3Dog(0,0,1.57,{y:0,walk:t>2?t*.6:0});c3Pop();c3q.label=[1.1,1.3+((t*.3)%1)*.6,5.6,'z Z',"#b0c8f8",1]}},
  {d:8,cap:['',"In the dream the squirrel is enormous, and slow, and has it coming."],f(t,u){c3Dream(t);const lx=-9+t*2.6;c3Cam(lx+5,7.4,9,lx+3.5,6.4,0,56);c3Dog(lx,0,1.5708,{y:6+Math.sin(t*5)*.25,walk:t*1.6});c3Squirrel(lx+6+t*.3,5.2+Math.sin(t*2)*.4,-1,1.5708,3.2,t);for(let k=0;k<7;k++)c3Berry(-10+k*6.5+Math.sin(k*3)*2,5+((k*37)%5)-1.5+Math.sin(t+k)*.4,-5-(k%3)*3,1+(k%3)*.5,t*.4+k)}},
  {d:6.5,k:2.6,cap:['LOUIE',"...Woof?"],f(t,u){const turn=c3Sm(.6,2.4,t);c3Dream(t);c3Cam(-2.5,6.3,10.5-u,5.5,9+turn*2,0,60);c3Dog(-1,3,1.2,{y:6.1,sit:turn>.6,up:.4*turn});c3Squirrel(8,4,-1.5,1.5708-turn*2.9,7.5,t);for(let k=0;k<4;k++)c3Berry(-6+k*5,10+k,-7,1.2,t*.4+k);c3Cue('sq',()=>c3At(()=>snd(80,1.2,50,'sine',.25),700))}},
  {d:6.5,cap:['',"He wakes. It was only a dream. Probably."],f(t,u){c3Cam(4.8-u*.4,1.5,8.6,.2,2.3,2,50);c3Night(t,1,{alone:1});c3Dog(.4,5.6,3.4,{sit:1,up:.55});c3Squirrel(.3,4.38,.3,.6,1,t);c3Cue('wk',()=>c3At(()=>bark(),500))}}],
 /* EASTER EGG: the red button comes home */
 button:[
  {d:6.5,cap:['',"It says DO NOT PRESS. Everyone agrees that is very clear."],f(t,u){c3Env('day');c3Cam(4.4-u*.5,1.6,8.2,2.2,.5,5.4,46);c3Lantern(.5,2,{force:1});c3Button(2.2,5.4,0);for(let k=0;k<8;k++){const a=k*.785;c3Sprout(2.2+Math.cos(a)*1.5,5.4+Math.sin(a)*1.3,k,{ang:Math.atan2(-Math.cos(a),-Math.sin(a)),hop:0})}c3q.label=[2.2,1.25,5.4,'DO NOT PRESS','#f8e060',1]}},
  {d:6.5,k:3.6,cap:['LOUIE',"Boop."],f(t,u){const w=c3Sm(.2,2.4,t),dn=c3Sm(2.9,3.1,t);c3Env('day');c3Cam(4.2,1,7.4,2.3,.5,5.5,42);c3Button(2.2,5.4,dn);c3Dog(2.2,7.6-w*1.55,Math.PI,{walk:w<1?t:0,up:-.35*c3Sm(2.2,2.9,t)});for(let k=0;k<5;k++){const a=k*.785+3.4;c3Sprout(2.2+Math.cos(a)*1.5,5.4+Math.sin(a)*1.3,k,{ang:Math.atan2(-Math.cos(a),-Math.sin(a)),hop:dn>=1?Math.abs(Math.sin(t*9+k))*.3:0})}c3Cue('bp',()=>c3At(()=>{snd(900,.05);c3At(()=>snd(300,.12,200),60)},2950))}},
  {d:8,k:4.6,cap:['',"Nothing happens. Far to the north, something that was asleep rolls over."],f(t,u){const hm=c3Sm(2.6,3.2,t)*(1-c3Sm(4,5,t));c3Env('day','dusk',.3);c3EN.ff=170;c3EN.fn=40;c3Cam(3.5,1.5+u*.8,13-u,-3,6+u,-30,52);c3Lantern(.5,2,{force:1});c3Button(2.2,5.4,.9);c3Dog(2.2,6.6,Math.PI,{sit:1,up:.3});c3Peak(hm,t);if(t>3&&t<3.4)c3q.tear=1;c3Cue('hm',()=>c3At(()=>{snd(55,1.6,58,'sawtooth',.06);noise(.25,.2,2400)},2700))}},
  {d:6.5,cap:['MARCUS',"Bro. Did your dog just... nah. Nah. It's fine. It's probably fine."],f(t,u){c3Env('day','dusk',.3);c3Cam(6.4,1.5,8.6,2.2,1,5.6,48);c3Lantern(.5,2,{force:1});c3Button(2.2,5.4,.9);c3Dog(2.2,6.6,2.4,{sit:1,up:.2});c3Person(3.9,6.6,-1.2,Object.assign({},C3MARC,{arm:1.2}));c3Person(3.3,7.9,-.6,Object.assign(c3Look(),{up:.1}))}}],
 /* the first shard comes home, and something left marks by the Lantern */
 marks:[
  {d:7,k:3.2,cap:['',"The shard clicks back into place. The Lantern coughs, flickers, and glows a little brighter."],f(t,u){const q=c3Sm(.3,2,t),k=c3Sm(2,2.3,t),fl=k&&t<3.4?.45+.4*Math.sin(t*31):k?.62:.25;c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6.5,1.2*fl+.2);c3Cam(3.4-u*.6,1.5+u*.5,5-u*.5,0,1.5+u*.7,0,58);c3Lantern(fl,k>=1?1:0,{force:1});c3Soil();
    const sx=Math.cos(.785)*1.02,sz=Math.sin(.785)*1.02,x=c3Lp(3,sx,q),z=c3Lp(4.4,sz,q);if(q<1){c3Shard(x,.9+Math.sin(q*3.14)*1.1,z,.5,t,1);for(let i=0;i<4;i++){const b=i*1.57+t*2;c3Sprout(x+Math.cos(b)*.5,z+Math.sin(b)*.5,i,{y:c3G(x,z),hop:Math.abs(Math.sin(t*8+i))*.12})}}else c3Ring(t,6,1);
    if(t>2&&t<2.5)c3q.flash=(1-(t-2)/.5)*.7;c3Cue('cl',()=>c3At(()=>{snd(523,.12);c3At(()=>snd(659,.12),120);c3At(()=>snd(784,.3),240)},2000))}},
  {d:6,cap:['ERIN',"One down, Will! Feel that? The soil's warming up already."],f(t,u){c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6.5,1);c3Cam(-3.4+u*.4,1.5,3.2,-1.2,1.25,6.1,48);c3Lantern(.62,1);c3Soil();c3Person(-1.5,6.1,2.7,Object.assign({},C3ERIN,{arm:2.4+Math.sin(t*8)*.3}));c3Dog(.3,6.9,2.5,{walk:t});c3Person(1.7,5.9,Math.PI+.25,c3Look());c3Ring(t,6,1)}},
  {d:7,k:2.4,cap:['RANGER',"Before you celebrate, come look at this. Something left marks by the lantern. Big ones."],f(t,u){c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6.5,1);c3Cam(-6.2+u*.6,1.7,-4.6,-1.9,.5,-1.1,50);c3Lantern(.62,1);c3Marks(c3Sm(.4,2.2,t));c3Person(-3.9,-1.3,1.5,Object.assign({},C3RANG,{arm:1.3,up:-.2}));c3Cue('mk',()=>c3At(()=>snd(150,.5,90,'sawtooth',.06),600))}},
  {d:6.5,cap:['ERIN',"So it didn't just crack. Something cracked it. Keep your eyes open out there."],f(t,u){c3Env('dusk','night',u*.5);c3Lamp(0,3.1,0,'#ffd890',6.5,1);c3Cam(1.5,3.4+u*.6,-7.5-u,-1.4,.6,-1,54);c3Lantern(.62,1);c3House(6.2,-5.4,-.5,1);c3Marks(1);c3Person(-3.3,-2.4,1.2,Object.assign({},C3RANG,{}));c3Person(-2.6,-3.6,.5,Object.assign({},C3ERIN,{up:-.15}));c3Person(-1.2,-3.9,-.1,Object.assign(c3Look(),{up:-.15}));c3Dog(-.2,-3.2,-.6,{up:-.3})}}],
 /* Erin's garden has its five gardeners, and the far bed gives something up */
 key:[
  {d:6.5,cap:['',"Five gardeners at work, and the far bed is turned over for the first time in years."],f(t,u){c3Env('day');const a=.9+u*.5;c3Cam(C3GA[0]+Math.cos(a)*9,3.6-u*.8,C3GA[1]+Math.sin(a)*9,C3GA[0],.8,C3GA[1],56);c3Garden(t,1);
    c3Person(C3GA[0]-1.2,C3GA[1]+1.6,.9,Object.assign({},C3ERIN,{}));c3Person(C3GA[0]+.2,C3GA[1]+4.6-u*1.6,Math.PI,Object.assign(c3Look(),{walk:u<1?t:0}));c3Dog(C3GA[0]+1.2,C3GA[1]+5-u*1.4,Math.PI,{walk:u<1?t:0});
    for(let k=0;k<5;k++)c3Sprout(C3GA[0]-2.9+k*1.25,C3GA[1]-.4+(k%2)*.7,[4,2,4,0,5][k],{ang:k,hop:Math.abs(Math.sin(t*7+k*1.4))*.14})}},
  {d:6.5,k:3.6,cap:['ERIN',"That is not a bulb."],f(t,u){const out=c3Sm(2.2,3,t),bx=C3GA[0]+2.6,bz=C3GA[1]-.6,y0=c3G(bx,bz);c3Env('day');c3Cam(bx+2.6-u*.4,1.25,bz+3.2,bx,.45+out*.5,bz,50);c3Garden(t,1);
    for(let k=0;k<3;k++){const a=2.3+k*.9;c3Sprout(bx+Math.cos(a)*.55,bz+Math.sin(a)*.55,[4,2,4][k],{ang:-a+1.57,hop:out<1?Math.abs(Math.sin(t*12+k))*.1:Math.abs(Math.sin(t*6+k))*.25})}
    c3Key(bx,y0+.1+out*.95+(out>=1?Math.sin(t*3)*.04:0),bz,.8,out>=1?t*1.5:.6,out<.3);if(out>0&&out<1)for(let k=0;k<5;k++)c3Puff(bx+Math.cos(k*1.3)*.4*out,y0+.2+out*.4,bz+Math.sin(k*1.3)*.4*out,.16,.5*(1-out));
    c3Cue('pk',()=>{c3At(()=>{snd(300,.08,200);c3At(()=>snd(784,.1),350);c3At(()=>snd(1175,.25),470)},2200)})}},
  {d:7,cap:['ERIN',"FLOW PROS. That's Marcus's. He closed the pond road for a job, then lost the key."],f(t,u){const ex=C3GA[0]-.6,ez=C3GA[1]+1.2;c3Env('day');c3Cam(ex+1.5+u*.3,1.45,ez+2.9,ex-.1,1.3,ez,46);c3Garden(t,1);
    c3Person(ex,ez,.5,Object.assign({},C3ERIN,{arm:2.5}));c3Key(ex+.42,c3G(ex,ez)+1.6,ez+.25,.42,t*1.2);c3Person(ex+1.7,ez+.4,-1.2,Object.assign(c3Look(),{up:.15}));c3Dog(ex+1.4,ez+1.6,-2.2,{sit:1,up:.2})}},
  {d:6.5,cap:['',"Out west, past the crystal, a job site has been 'in progress' for a week."],f(t,u){c3Env('day');c3Cam(-.5-u*1.2,1.5+u*.5,-2.6,-8,1.1,3.5,54);c3Lantern(.4,0,{force:1});c3Jobsite(0,t);c3Van(0,.5,t)}}],
 /* a crowd of sprouts wakes Old Thornback */
 thorn:[
  {d:7.5,k:4,cap:['',"Old Thornback blinks awake. Tucked under his chin, glowing softly, is the last sun shard."],f(t,u){const up=c3Sm(2.2,4,t)*.7,H=C3HO;c3Cam(H[0]+6.8-u*1.5,2.4-u*.5,H[1]+6.2-u,H[0]+.5,1.2,H[1]+.5,54);c3Hollow(t);c3Thorn(H[0],H[1],.9,{t,up});
    for(let k=0;k<12;k++){const a=k*.9,on=k<7,q=Math.max(0,up-.3)*1.6,fall=Math.max(0,1-q*1.4);c3Sprout(H[0]+Math.cos(a)*(on?.9+q*3:3)+(on?0:.0),H[1]+Math.sin(a)*(on?1.1+q*3:2.8),k,{y:on?c3G(H[0],H[1])+(1.9-.5*Math.cos(a)*Math.cos(a))*fall:undefined,hop:Math.abs(Math.sin(t*8+k))*.15,noSh:on&&fall>.3,ang:a})}
    c3Cue('wk',()=>c3At(()=>snd(90,.9,140,'sine',.2),2200))}},
  {d:7,cap:['THORNBACK',"...Oh. Oh no. Is this yours? The nights got so cold. I only wanted the warm."],f(t,u){const H=C3HO;c3Cam(H[0]+3.6+u*.3,1.3,H[1]+4.2,H[0]+1.3,1.25,H[1]+1.5,46);c3Hollow(t);c3Thorn(H[0],H[1],.9,{t,up:.7+Math.sin(t*1.5)*.05});c3Shard(H[0]+1.45,c3G(H[0],H[1])+.45,H[1]+1.55,.5,t,1)}},
  {d:7,cap:['THORNBACK',"I must have squeezed too tight. I heard a crack, and I ran. I'm sorry, little keeper."],f(t,u){const H=C3HO;c3Cam(H[0]+5.2-u*.5,2.8,H[1]+8.2,H[0]+1.2,1,H[1]+1.4,52);c3Hollow(t);c3Thorn(H[0],H[1],.9,{t,up:.7-c3Sm(.5,3,t)*.5});c3Person(H[0]+3.6,H[1]+4.4,-2.4,Object.assign(c3Look(),{up:.2}));c3Dog(H[0]+4.7,H[1]+3.8,-2.3,{sit:1,up:.2});for(let k=0;k<6;k++)c3Sprout(H[0]+2.6+(k%3)*.5,H[1]+5.2+((k/3)|0)*.5,k,{ang:-2.4})}},
  {d:7,cap:['THORNBACK',"I was set to guard that light, long ago. I have forgotten who asked me. Or why."],f(t,u){const H=C3HO;c3Cam(H[0]+4.4-u*.4,.9,H[1]+4.6-u*.3,H[0]+.8,1.9,H[1]+.8,50);c3Hollow(t);c3Thorn(H[0],H[1],.9,{t,up:.3+c3Sm(.5,3,t)*.7})}},
  {d:6.5,cap:['ERIN',"A guardian. So the old stories were true. I wish I remembered the rest of them."],f(t,u){c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6,1.2);c3Cam(-3.6+u*.4,1.5,3.4,-1.2,1.25,6.2,48);c3Lantern(.75,3);c3House(6.2,-5.4,-.5,1);c3Soil();c3Person(-1.5,6.1,2.6,Object.assign({},C3ERIN,{up:.1}));c3Dog(.3,6.9,2.4,{sit:1});c3Thorn(-2,15-u*4,Math.PI,{t,up:.6})}},
  {d:6.5,cap:['ERIN',"He wasn't stealing it. He was freezing. Will... there's room by the lantern, isn't there?"],f(t,u){c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6,1.2);c3Cam(6.5,2.6,9.5-u,-2.5,1.2,4.5,54);c3Lantern(.75,3);c3Soil();c3Person(-1.5,6.1,3.4,Object.assign({},C3ERIN,{arm:u>.4?2.2:0}));c3Dog(.3,6.9,3.6,{sit:1});c3Thorn(-6,11-c3Sm(0,1,u)*7.6,Math.PI-.2,{t,up:.5})}},
  {d:6,cap:['',"Thornback pads off toward the Lantern Field. Carry the shard home."],f(t,u){const H=C3HO,sx=H[0]+.6,sz=H[1]+1.2;c3Cam(H[0]+5+u,2.4+u,H[1]+6.5,sx,.6,sz,54);c3Hollow(t);c3Shard(sx,c3G(sx,sz)+.7+Math.sin(t*2)*.08,sz,.8,t,1);for(let k=0;k<8;k++){const a=k*.785+t*.3;c3Sprout(sx+Math.cos(a)*1.3,sz+Math.sin(a)*1.1,k,{ang:-a-1.57,hop:Math.abs(Math.sin(t*6+k))*.16})}c3Person(H[0]+3.4,H[1]+3.2,-2.3,c3Look());c3Dog(H[0]+4.4,H[1]+2.6,-2.2,{})}}],
 /* the old arch behind the willows */
 arch:[
  {d:7.5,cap:['',"Behind the willows stands an arch of old stone, older than any path in the valley."],f(t,u){const e=c3ArchAt(-7+u*3,10-u*2,2.2+u*.6);c3Env('dusk','day',.5);c3Cam(e[0],e[1],e[2],C3AR[0],2.6,C3AR[1],56);c3Arch(0,t);const w=c3ArchAt(-.8,6.5-u*2.4,0),l=c3ArchAt(.9,7-u*2.4,0);c3Person(w[0],w[2],Math.PI+.35,Object.assign(c3Look(),{walk:u<1?t:0,up:.2}));c3Person(w[0]-1.3,w[2]+.4,Math.PI+.35,Object.assign({},C3ERIN,{walk:u<1?t:0,up:.2}));c3Dog(l[0],l[2],Math.PI+.35,{walk:u<1?t:0})}},
  {d:7,cap:['ERIN',"Look at the carving, Will. A lantern. Sprouts. And big creatures beside them. Buddies."],f(t,u){const e=c3ArchAt(-1.4+u*2.6,3.4,1.5),g2=c3ArchAt(-.6+u*1.2,0,1.3);c3Env('dusk','day',.5);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],44);c3Arch(0,t)}},
  {d:7,cap:['ERIN',"There are words. '...promised to sprouts and buddies. Keep the...' The rest is worn away."],f(t,u){const e=c3ArchAt(2.6,4.6,1.6),g2=c3ArchAt(-.4,0,1.7),w=c3ArchAt(-.2,2.2,0),r2=c3ArchAt(.9,2.4,0);c3Env('dusk','day',.5);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],50);c3Arch(0,t);c3Person(w[0],w[2],Math.PI+.35,Object.assign({},C3ERIN,{arm:2.2,up:.25}));c3Person(r2[0],r2[2],Math.PI+.2,Object.assign(c3Look(),{up:.3}))}},
  {d:7,k:3,cap:['ERIN',"And here, under the sun: SUN KEEP. Is that an order, or a name?"],f(t,u){const lit=c3Sm(1,2.6,t),e=c3ArchAt(.3,5.2-u*.5,3.2),g2=c3ArchAt(0,0,4.1),L=c3ArchAt(0,.7,3.72);c3Env('dusk','day',.5);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],40);c3Arch(lit,t);c3q.label=[L[0],L[1],L[2],'SUN KEEP','#f8e060',c3Sm(1.6,2.8,t)];c3Cue('sk',()=>c3At(()=>snd(220,.9,330,'sine',.12),1100))}},
  {d:7,cap:['ERIN',"Our house sits on stones just like these. Somebody kept this light before us."],f(t,u){c3Env('dusk');c3Lamp(0,3.1,0,'#ffd890',6,1.3);c3Cam(13.5-u,2.4,2.5,5.6,.9,-4.6,50);c3House(6.2,-5.4,-.5,1);c3Lantern(.9,4);for(let k=0;k<7;k++)c3Box(4.4+k*.55,c3G(4.4+k*.55,-3.9)-.05,-3.95-(k%2)*.1,4.9+k*.55,c3G(4.4+k*.55,-3.9)+.2+(k%3)*.05,-3.6,'#585c70','#a0a8bc')}},
  {d:5.5,cap:['LOUIE',"Woof."],f(t,u){const d=c3ArchAt(.6,3,0),e=c3ArchAt(3.6,7,1.3);c3Env('dusk');c3Cam(e[0],e[1],e[2],d[0],.9,d[2],40);c3Arch(1,t);c3Dog(d[0],d[2],Math.PI+.8,{sit:1,up:.35});c3Cue('wf',()=>c3At(()=>bark(),700))}},
  {d:7,cap:['',"Erin starts calling the Lantern Field 'Sunkeep'. It sticks."],f(t,u){const e=c3ArchAt(-5-u*2,9+u*2,3+u*1.5),wp=c3ArchAt(1.5+Math.cos(t*.6)*1.2,1.5,2.4+Math.sin(t*1.1)*.4);c3Env('dusk','night',u*.8);c3Cam(e[0],e[1],e[2],C3AR[0],2.4,C3AR[1],56);c3Arch(1,t);c3Lamp(C3AR[0],2.4,C3AR[1]+1,'#ffd890',4,1);if(u>.35)c3Wisp(wp[0],wp[1],wp[2],t,c3Sm(.35,.7,u))}}],
 /* the first time Will meets Marcus: the Flow Pros van by the Dew Pond */
 van:[
  {d:6.5,cap:['',"By the Dew Pond sits a van. FLOW PROS. The windows are fogged from the inside."],f(t,u){c3Env('day');c3Cam(1.5-u*1.5,2.6,-5.5+u*1.5,-8,1.2,5.5,56);c3Lantern(.4,0,{force:1});c3Jobsite(1,t);c3Van(0,.55,t);
    const x=-.5-u*4.6,z=-.2+u*2.2;c3Person(x,z,-1.15,Object.assign(c3Look(),{walk:t}));c3Dog(x+.2,z-1.1,-1.15,{walk:t})}},
  {d:6.5,k:3.5,cap:['DEREK',"*kkhhh* ...Hoo. Okay. That's the one, Marcus."],f(t,u){const hit=c3Sm(.4,1.8,t)*(1-c3Sm(2.4,3,t)),rip=c3Sm(2.3,3.4,t);c3Env('day');const e=c3VanAt(4.4-u*.5,-.9,1.5),g2=c3VanAt(0,-.6,1.25);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],52);
    c3Van(1,.25+rip*1.1,t,{hit});c3Cue('rp',()=>{c3At(()=>noise(1.3,.12,1800,'bandpass'),500);c3At(()=>{noise(.12,.3,900);c3At(()=>noise(.1,.25,800),160);c3At(()=>noise(.14,.3,1000),330)},2400)})}},
  {d:6.5,cap:['MARCUS',"Bro. BRO. Will! Perfect timing. Derek. Derek. It's Will."],f(t,u){c3Env('day');const e=c3VanAt(6.4,2.6,1.9),g2=c3VanAt(.6,-.3,1.2),w=c3VanAt(3.1+Math.max(0,1-t)*1.5,.5,0),l=c3VanAt(3.4+Math.max(0,1-t)*1.5,1.5,0);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],54);
    c3Van(1,.7,t,{marm:2.3+Math.sin(t*9)*.3,mturn:-.2});c3Person(w[0],w[2],C3VAN[2]+Math.PI,Object.assign(c3Look(),{walk:t<1?t:0}));c3Dog(l[0],l[2],C3VAN[2]+Math.PI,{walk:t<1?t:0,sit:t>=1.4});c3Cue('dp',()=>c3At(()=>{snd(330,.06);c3At(()=>snd(440,.08),80)},300))}},
  {d:7,cap:['MARCUS',"Business idea. A lazy river. Around the WHOLE valley. Dews as lifeguards."],f(t,u){c3Env('day');const m=c3VanAt(2.2,.2,0),w=c3VanAt(4.2,2.2,0),l=c3VanAt(3.3,2.6,0),e=c3VanAt(5.3,-.5,1.2);c3Cam(e[0]+u*.3,e[1],e[2],m[0],1.05,m[2],50);
    c3Van(2,.6,t);c3Person(m[0],m[2],C3VAN[2]+.25,Object.assign({},C3MARC,{arm:2.6+Math.sin(t*5)*.3,arms:Math.max(0,Math.sin(t*2.5))*1.2}));c3Person(w[0],w[2],C3VAN[2]+Math.PI+.4,c3Look());c3Dog(l[0],l[2],C3VAN[2]+Math.PI+.2,{sit:1})}},
  {d:7,cap:['MARCUS',"Waterslide off the Lantern. Marcus Waterworks, bro. Derek's in. Derek?"],f(t,u){c3Env('day');c3Cam(-9.4+u*.4,2.4,4.9,0,2.1,0,52);c3Lantern(.4,0,{force:1});c3House(6.2,-5.4,-.5,0);
    c3Van(2,.6,t);c3Person(-5.6,2.6,2.05,Object.assign({},C3MARC,{arm:2.2+Math.sin(t*4)*.15}));c3Person(-5.3,4.2,2.05,Object.assign(c3Look(),{up:.2}));c3Dog(-4.2,4.6,2.05,{sit:1,up:.2})}},
  {d:6.5,k:5,cap:['DEREK',"I'm in. I drive the van. That's my whole part."],f(t,u){const hit=c3Sm(3,4.2,t);c3Env('day');const e=c3VanAt(3.6,-1.2,1.35),g2=c3VanAt(0,-.85,1.3),l=c3VanAt(1.9,-1.9,0);c3Cam(e[0],e[1],e[2],g2[0],g2[1],g2[2],46);
    c3Van(2,.5+hit*.8,t,{hit});c3Dog(l[0],l[2],C3VAN[2]+2.4,{sit:1,up:t>4.6&&t<5?-.3:.15});c3Cue('ac',()=>c3At(()=>{noise(.1,.3,3000);spSay('ACHOO!',2)},4600))}}],
 /* a new game: the Lantern whole, the crack, the morning after */
 dawn:[
  {d:7,cap:['',"For as long as anyone can remember, the Great Lantern has kept this valley warm and bright."],f(t,u){const a=.9+u*.8;c3Cam(Math.cos(a)*11,3.4+u*1.2,Math.sin(a)*11,0,2.5,0,58);c3Night(t,1,{alone:1});c3Ring(t,8)}},
  {d:7,k:2.4,cap:['',"Last night it cracked. Four sun shards flew off into the wild, and the nights are getting longer."],f(t,u){const k=c3Sm(1.1,1.25,t),L=1-k*.82;c3Cam(4.5-u*1.5,2.4+u*2.6,9+u*5,0,3+u*1.5,0,62);c3Night(t,L,{alone:1,n:k?0:4});if(k<1)c3Ring(t,8);
    c3Cue('ck',()=>c3At(()=>{noise(.5,.35,900,'lowpass');snd(1400,.5,90,'sawtooth',.08)},1100));if(t>1.1&&t<1.5)c3q.flash=1-(t-1.1)/.4;
    if(t>1.1)[[1,-.25],[-.1,-1],[-1,.2],[.2,1]].forEach(([dx,dz],i)=>{const q=Math.min(1,(t-1.1)/(3.4+i*.5)),d=q*46;if(q<1){const sy=v=>3.1+Math.sin(v*3.14)*13-v*2;c3Shard(dx*d,sy(q),dz*d,1,t+i,1);for(let j=1;j<5;j++){const v=Math.max(0,q-j*.02);c3Glow(dx*v*46,sy(v),dz*v*46,.9-j*.15,'#ffd860',.4-j*.07)}}})}},
  {d:5.5,cap:['',"This morning the new keeper walked in from the south road."],f(t,u){c3Env('dawn');c3Cam(-7.5+u*1.5,3.2,14.5-u,0,1.7,5,56);c3Lamp(0,3.1,0,'#ffd890',5,.5);c3Lantern(.25,0,{force:1});c3House(6.2,-5.4,-.5,0);c3Soil();
    const z=15-u*7.4;c3Person(.2,z,Math.PI,Object.assign(c3Look(),{walk:u<1?t:0}));c3Person(-1.5,5.6,.2,Object.assign({},C3ERIN,{arm:u>.5?2.4+Math.sin(t*9)*.4:0}));c3Dog(1.4,c3Lp(5.8,6.6,c3Sm(.5,1,u)),.1,{sit:u<.5,walk:u>=.5&&u<1?t:0})}}],
 /* the fourth shard comes home */
 blaze:[
  {d:5.5,k:3.3,cap:['',"The last shard slides home."],f(t,u){const k=c3Sm(2.6,3,t);c3Env('night','gold',k*.35);const L=.8+k*1.6;c3Lamp(0,3.1,0,'#ffd890',7.5+k*6,2.2*L);c3Moon(-.5,.42,-.75,13,'#e8ecff');c3Cam(3.6-u*.8,1.5+u*.7,5.2-u*.6,0,1.6+u*.8,0,60);c3Lantern(L,k>=1?4:3);c3Soil();
    const sx=Math.cos(.785+3*1.5708)*1.02,sz=Math.sin(.785+3*1.5708)*1.02,q=c3Sm(.4,2.6,t),x=c3Lp(3.2,sx,q),z=c3Lp(4.6,sz,q),y=.9+Math.sin(q*3.14)*1.1+(1-q)*.0;if(q<1){c3Shard(x,y,z,.5,t,1);for(let i=0;i<5;i++){const b=i*1.256+t*2;c3Sprout(x+Math.cos(b)*.5,z+Math.sin(b)*.5,i*2,{y:c3G(x,z),hop:Math.abs(Math.sin(t*8+i))*.12})}}
    else{c3q.flash=Math.max(0,1-(t-2.6)/.7);c3Ring(t,10,1)}c3Cue('bl',()=>c3At(()=>{snd(523,.12);c3At(()=>snd(784,.12),120);c3At(()=>snd(1046,.4),240)},2600))}},
  {d:7.5,cap:['',"The Great Lantern blazes, and the whole valley turns gold."],f(t,u){c3Env('night','gold',.35+u*.65);const a=2.2-u*1.5,rr=9+u*9;c3Cam(Math.cos(a)*rr,3+u*8,Math.sin(a)*rr,0,2.6,0,60);c3Lamp(0,3.1,0,'#ffd890',16,3.2);c3Lantern(2.4,4);c3House(6.2,-5.4,-.5,1);c3Soil();
    c3Person(1.7,5.9,Math.PI+.25,Object.assign(c3Look(),{up:.3,arm:2.6+Math.sin(t*8)*.3}));c3Person(-1.5,6.1,Math.PI-.25,Object.assign({},C3ERIN,{up:.3,arm:2.6+Math.cos(t*8)*.3}));c3Person(-3.6,5.2,Math.PI-.6,Object.assign({},C3MARC,{up:.3,arm:2.8}));c3Dog(.3,6.9+Math.sin(t*3)*.3,Math.PI,{walk:t,up:.3});c3Thorn(-6.5,2,1.7,{t,up:1});c3Ring(t,12,1);
    for(let k=0;k<8;k++){const b=k*.785+t*.4;c3Glow(Math.cos(b)*(3+k*.6),3+((t*1.3+k*.7)%5),Math.sin(b)*(3+k*.6),.35,'#fff0a0',.5)}}}],
 /* the Lantern is whole and the arch has been read: the skip turns out to be a call */
 call:[
  {d:7,cap:['',"Night. The Great Lantern is whole again. And still, once a night, it skips."],f(t,u){const a=1.05+u*.75;c3Cam(Math.cos(a)*12.5,3.2+u*.8,Math.sin(a)*12.5,0,2.3,0,58);c3Night(t,1)}},
  {d:5.5,k:3.6,cap:['LOUIE',"Grr...?"],f(t,u){const dip=t>1.2&&t<2?.12+.1*Math.sin(t*70):1,L=dip*(1+c3Sm(2.3,3.6,t)*.9);c3Cam(3.8-u*.6,2.2,6.4-u*1.2,0,2.9,0,54);c3Night(t,L,{up:.4});if(t>1.2&&t<2)c3q.tear=1;
    c3Cue('sk',()=>c3At(()=>{snd(90,.5,60,'sawtooth',.06);noise(.3,.2,2400)},1200));c3Cue('hm',()=>c3At(()=>snd(220,1.6,440,'sine',.05),2300))}},
  {d:8,k:7,cap:['',"This time the light does not settle. It gathers. It turns, slowly, like something looking."],f(t,u){const k=c3Sm(0,1.2,t),a=c3Lp(1.5,C3A_DOOR,c3Sm(.8,7,t));c3Cam(-8.5+u*1.5,7.5,6.5,9,2.2,-1,60);c3Night(t,1.9,{up:.5});const p=c3Dir(a,70,4);c3BeamTo(p[0],p[1],p[2],k);c3Cue('bm',()=>snd(330,2.5,660,'sine',.04))}},
  {d:7.5,k:6.3,cap:['',"East of the orchard the beam crosses old stone. A carved sun wakes. A hidden door grinds open."],f(t,u){const gl=c3Sm(.8,2,t),op=c3Sm(2.6,6.2,t);c3Env('night');c3Lamp(C3DR[0]-1.5,2,C3DR[1],'#ffd890',5,1.6*gl);c3Moon(-.5,.42,-.75,13,'#e8ecff');
    c3Cam(12.5+u*1.2,1.7+u*.5,8.2-u*1.4,C3DR[0],1.7,C3DR[1],56);c3Door(op,gl,t);const p=[C3DR[0]-.3,1.5,C3DR[1]];c3BeamTo(p[0],p[1],p[2],c3Sm(.2,1,t),.5);
    if(op>0&&op<1){c3q.shake=.8;for(let k=0;k<6;k++){const q=(t*1.3+k*.37)%1;c3Disc(C3DR[0]-.6-q*.8,.3+q*.9,C3DR[1]+(k%2?1:-1)*(1.1+q*.4),.3+q*.4,[190,180,160],.3*(1-q))}}
    c3Cue('dr',()=>{c3At(()=>{snd(784,.15);c3At(()=>snd(1175,.3),120)},900);[0,1,2].forEach(k=>c3At(()=>noise(1.3,.3,160,'lowpass'),2600+k*1100))})}},
  {d:8.5,k:7.5,cap:['',"Then it runs the length of the Crooked River, out to the Wending Lake."],f(t,u){const e=u*u*(3-2*u),x=c3Lp(5,39,e),z=c3Lp(-5.5,-12.5,e)+Math.sin(e*5)*1.2,y=6.2-e*1.8+Math.sin(e*3.14)*1.4;c3Env('night');c3Moon(.9,.3,-.3,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);
    c3Cam(x,y,z,x+11,y-2.4,z-1.8+Math.cos(e*5)*.8,66);c3Lantern(1.9,4);const L=C3LAMP();c3BeamTo(L[0],L[1],L[2],1,1.8);c3Tower(0);c3Pier(0);c3Glow(L[0],L[1],L[2],2.2,'#ffe890',.5);c3Cue('fl',()=>{for(let k=0;k<8;k++)c3At(()=>noise(1.2,.07,500,'lowpass'),k*1000)})}},
  {d:8,k:6,cap:['',"On a rock in the lake stands a second lantern, long dark. For one breath, it answers."],f(t,u){const an=Math.max(0,1-Math.abs(t-5.2)/.7);c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');const L=C3LAMP();c3Lamp(L[0],L[1],L[2],'#ffd890',6,1.2+an*2);
    c3Cam(46.5-u*1.2,.7+u*.5,-4.5+u*.8,L[0],L[1]-2.2,L[2],58);c3Tower(an*.9);c3Pier(0);c3BeamTo(L[0],L[1],L[2],1,1.8);c3Glow(L[0],L[1],L[2],2+an*3,'#ffe890',.45+an*.4);c3Wisp(L[0]+Math.cos(t*.9)*1.6,L[1]+.2+Math.sin(t*1.7)*.3,L[2]+Math.sin(t*.9)*1.6,t);
    c3Bessie(50,-3.5-u*3,.2,0,t);c3Cue('an',()=>c3At(()=>{snd(660,.5,990,'sine',.07);c3At(()=>snd(990,.9,660,'sine',.05),200)},4700))}},
  {d:6.5,cap:['THORNBACK',"Two lights. I remember now. One to keep. One to call."],f(t,u){c3Cam(.6-u*.5,1.3,2.2+u*.3,-5.4,1.5,3.3,50);c3Night(t,1.9,{thorn:c3Sm(0,1.4,t),up:.45});const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1);c3Cue('th',()=>snd(110,.5,80,'sine',.25))}},
  {d:6.5,cap:['ERIN',"So that's the skip. It has been calling every night, and nobody ever answered."],f(t,u){c3Cam(-3.1+u*.4,1.5,2.6,-1.2,1.2,6.2,50);c3Night(t,1.9,{thorn:1,up:.45});const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1)}},
  {d:6,cap:['',"By morning the beam is gone. The door east of the orchard is still open."],f(t,u){c3Env('night','dawn',c3Sm(0,.8,u));c3Cam(-15+u*2,9.5+u*1.5,11,10,1.5,-2,60);c3Lamp(0,3.1,0,'#ffd890',7.5,2*(1-u*.7));c3Lantern(1.6-u*.8,4);c3House(6.2,-5.4,-.5,u<.5);c3Soil();c3Door(1,.6,t);const p=c3Dir(C3A_LAKE,70,5);c3BeamTo(p[0],p[1],p[2],1-c3Sm(.1,.75,u))}}],
 /* the first walk out onto the North Coast */
 coast:[
  {d:7.5,cap:['',"Past the door the trees stop. Sand. Wind. The Wending Lake, with no far side."],f(t,u){c3Env('day');c3Cam(35.5-u*.6,1.1+u*3.6,-1.2+u*1.2,50,2.6-u*.6,-9,60);c3Tower(0);c3Pier(0);
    const x=37.5+u*4.2;c3Person(x,-3,1.2,Object.assign(c3Look(),{walk:t,up:.1}));c3Dog(x+1.1,-4.1,1.2,{walk:t});for(let k=0;k<9;k++)c3Sprout(x-1-(k%3)*.55-((k/3)|0)*.5,-2.6-(k%3)*.5+((k/3)|0)*.3,k,{ang:1.2,hop:Math.abs(Math.sin(t*9+k))*.08});c3Cue('wv',()=>{for(let k=0;k<7;k++)c3At(()=>noise(1.2,.06,700,'lowpass'),k*1000)})}},
  {d:7.5,cap:['',"On a rock stands the NORTH LIGHT. Its lamp room is dark, and its lens lies cold at its foot."],f(t,u){c3Env('day');const a=2.2-u*.9,L=C3LAMP();c3Cam(C3TW[0]+Math.cos(a)*16,2.4+u*3,C3TW[1]+Math.sin(a)*16,C3TW[0],5,C3TW[1],58);c3Tower(0);c3Pier(0);
    c3Lens(C3TW[0]-1.9,c3G(C3TW[0]-1.9,C3TW[1]+1.5)+.5,C3TW[1]+1.5,.6,0,t);c3Wisp(L[0]+Math.cos(t*1.1)*1.5,L[1]+Math.sin(t*1.9)*.3,L[2]+Math.sin(t*1.1)*1.5,t,.7)}},
  {d:6.5,cap:['LOUIE',"...Woof?"],f(t,u){c3Env('day');c3Cam(40.6,1.5,1.2,50,.2,-5.2,54);c3Tower(0);c3Pier(0);c3Dog(44.4,-2.6,2.2,{sit:1,up:.1});c3Person(43.3,-1.2,2.2,Object.assign(c3Look(),{}));c3Bessie(56-u*7,-4.5-u*1.5,-1.9,0,t);c3Cue('bs',()=>c3At(()=>{snd(70,1.4,50,'sine',.2);bark()},1500))}},
  {d:6.5,cap:['',"The pier is out. But sprouts can build, and a lens can be carried home to a light that still burns."],f(t,u){c3Env('day','dusk',u*.5);c3Cam(41-u,2.4,3.5,49.5,2.6,-9,56);c3Tower(0);c3Pier(0);c3Person(43.6,-2.2,2.1,Object.assign(c3Look(),{up:.2}));c3Dog(44.5,-1.5,2.1,{sit:1});for(let k=0;k<9;k++)c3Sprout(42.4+(k%3)*.6,-.8-((k/3)|0)*.6,k,{ang:2.1,hop:Math.abs(Math.sin(t*5+k*1.7))*.1});
    c3Lens(C3TW[0]-1.9,c3G(C3TW[0]-1.9,C3TW[1]+1.5)+.5,C3TW[1]+1.5,.6,0,t)}}],
 /* the lens comes home to the Lantern */
 relight:[
  {d:7.5,k:5.1,cap:['',"That night the Lantern warms the lens until it glows. The wisp who visits each night steps inside."],f(t,u){const lit=c3Sm(1,4.6,t),wy=c3Lp(6,1.25,c3Sm(1.5,5,t));c3Cam(3.2-u*.7,1.5,5.4-u*.8,.2,1.5,1.4,56);c3Night(t,1.5,{up:.1});c3Lens(.2,1.25+Math.sin(t*2)*.05,1.9,.5,lit,t);if(t<5.1)c3Wisp(.2+Math.cos(t*2)*(1-lit)*1.2,wy,1.9+Math.sin(t*2)*(1-lit)*1.2,t);c3Cue('wm',()=>c3At(()=>snd(440,1.5,880,'sine',.05),1500))}},
  {d:7,k:6.3,cap:['',"She was the North Light's last flame, waiting for a keeper to carry her home."],f(t,u){const e=c3Sm(1,6.2,t),L=C3LAMP(),x=c3Lp(.2,L[0],e),y=c3Lp(1.3,L[1],e)+Math.sin(e*3.14)*5,z=c3Lp(1.9,L[2],e);c3Cam(-7,6.5,7,12,3.5,-3,60);c3Night(t,1.9,{up:.5,thorn:1});c3BeamTo(L[0],L[1],L[2],1,1.8);c3Lens(x,y,z,.5,1,t);c3Cue('go',()=>c3At(()=>snd(520,2.2,1560,'triangle',.05),1000))}},
  {d:8,k:6.5,cap:['',"The North Light opens its eye. Out in the water, something very old lifts its head to look."],f(t,u){const lit=c3Sm(.6,2.2,t),L=C3LAMP(),a=3.3-u*1.1,ba=t*.7;c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',9,3*lit);
    c3Cam(C3TW[0]+Math.cos(a)*14,1.6+u*2.2,C3TW[1]+Math.sin(a)*14,C3TW[0]-1,5,C3TW[1]+1,60);c3Tower(lit*1.4);c3Pier(7);if(lit>.2)c3Beam(L[0],L[1],L[2],L[0]+Math.cos(ba)*60,L[1]-1,L[2]+Math.sin(ba)*60,.3,2.2,'#ffe9a0',.5*lit);
    c3Bessie(C3TW[0]-7,C3TW[1]+7.5,2.4,c3Sm(3,6.5,t),t);if(t>.6&&t<1.2)c3q.flash=(1-(t-.6)/.6)*.8;c3Cue('nl',()=>{c3At(()=>{snd(392,.2);c3At(()=>snd(587,.2),150);c3At(()=>snd(784,.6),300)},600);c3At(()=>snd(60,2.2,45,'sine',.25),3200)})}},
  {d:6.5,cap:['MARCUS',"BRO. There is a lake monster. Nobody else name her. She's Bessie. I called it."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.6,.5,-.6,13,'#e8ecff');c3Lamp(L[0],L[1],L[2],'#ffd890',12,3);c3Lamp(44.5,1.6,-3,'#ffd890',3,1);
    c3Cam(42.6+u*.4,1.35,-.4,48.5,2.2,-5.5,52);c3Tower(1.4);c3Pier(7);c3Person(44.2,-2.6,2.3,Object.assign({},C3MARC,{arm:2.2+Math.sin(t*10)*.25,up:.3}));c3Person(45.4,-1.5,2.2,Object.assign(c3Look(),{up:.3}));c3Dog(43.4,-3.5,2.3,{sit:1,up:.3});
    c3Bessie(C3TW[0]-7,C3TW[1]+7.5,2.4,1,t);const ba=t*.7+5.6;c3Beam(L[0],L[1],L[2],L[0]+Math.cos(ba)*60,L[1]-1,L[2]+Math.sin(ba)*60,.3,2.2,'#ffe9a0',.5)}},
  {d:8,cap:['',"Two lights, talking across the valley. The Lantern does not skip that night."],f(t,u){const L=C3LAMP();c3Env('night');c3Moon(.3,.5,-.8,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);c3Lamp(L[0],L[1],L[2],'#ffd890',9,3);
    c3Cam(-17+u*4,13+u*2,15,22,1,-6,62);c3Lantern(1.9,4);c3House(6.2,-5.4,-.5,1);c3Soil();c3Tower(1.4);c3Door(1,.5,t);c3BeamTo(L[0],L[1],L[2],1,1.6);c3Beam(L[0],L[1],L[2],C3LT[0],C3LT[1]+.5,C3LT[2],.3,1.6,'#ffe9a0',.5)}},
  {d:7.5,k:4,cap:['THORNBACK',"Keep. Call. And a third thing, under the mountain. It hummed. I did not like it."],f(t,u){const hm=c3Sm(2.2,3.4,t)*(1-c3Sm(5.6,6.8,t));c3Env('night');c3EN.ff=150;c3EN.fn=30;c3Moon(-.75,.4,-.5,13,'#e8ecff');c3Lamp(0,3.1,0,'#ffd890',7.5,2.6);
    c3Cam(-2.4+u*.5,1.4,9.6,-5.2,3.2-u*.3,-8,52);c3Lantern(1.9,4);c3Soil();c3Thorn(-5.2,3.2,3.05,{t,up:1});c3Peak(hm,t);c3Cue('hu',()=>c3At(()=>snd(55,2.8,58,'sawtooth',.05),2200))}}]};

/* ---------- 6. playing a scene ---------- */
/* the scenes in the order the story meets them, for the Collection's SCENES page; seen ones are remembered across saves */
const C3LIST=[['dawn','THE CRACK','The night the Lantern cracked, and the morning after.'],['marks','THE MARKS','The first shard comes home, and Ranger finds something.'],['key','THE KEY','What the gardeners turned up in the far bed.'],['van','FLOW PROS','Marcus, Derek, a van by the Dew Pond, and a business idea.'],['thorn','THORNBACK','A crowd of sprouts wakes the guardian of the light.'],['blaze','THE BLAZE','The fourth shard comes home.'],['arch','SUN KEEP','The old arch behind the willows.'],['call','THE CALL','The night the Lantern stopped skipping and started pointing.'],['coast','THE COAST','The first walk out to the Wending Lake.'],['relight','NORTH LIGHT','The lens comes home, and the second lantern burns.'],['sesh','SEE ONE SEND ONE','Found at the van after dark.'],['job','THE JOB','Found at the van in the morning.'],['dream','SQUIRREL','Found the night after Louie has been scratched five times.'],['zoomies','ZOOMIES','Found by scratching Louie ten times.'],['button','DO NOT PRESS','Found by bringing home a certain treasure.'],['hottub','HOT TUB','Found by throwing Embers where they do not belong.'],['moon','MOONBLOOMS','Found with Erin, in her garden, as the light goes.'],['slide','THE SLIDE','Found by bothering someone very large.'],['bessie','HELLO','Found at the end of the pier, late.']];
const C3HID=C3LIST.findIndex(q=>q[0]==='sesh');
const c3SeenScene=k=>!!(meta.scn&&meta.scn[k]);
function c3Play(key,done){const S=C3SCN[key];if(!S){if(done)done();return}if(!c3SeenScene(key)){meta.scn=meta.scn||{};meta.scn[key]=1;try{save()}catch(e){}}c3q={key,S,i:0,t:0,done:done||null,cue:{},sched:[],ff:0,go:0,label:null,flash:0,tear:0,shake:0,tt:0};state='c3'}
const c3TextLen=s=>s.length/34+2.8;
/* sounds inside a shot run on the shot's own clock, so they stay with the picture and die with the shot */
function c3At(fn,ms){if(c3q)c3q.sched.push([c3q.t+ms/1000,fn])}
function c3End(){const f=c3q&&c3q.done;c3q=null;state='play';if(f)f();if(state==='play')persist()}
function c3Next(q){q.i++;q.t=0;q.cue={};q.sched=[];q.ff=0;q.go=0;if(q.i>=q.S.length)c3End()}
/* A: if the words or the shot's key moment (k) are still to come, the shot runs forward five times as fast to that
   point, holds a beat, and moves on. A again goes straight on. Start leaves the scene. Left alone it plays itself. */
function c3Update(dt){const q=c3q;if(!q){state='play';return}if(pressed('start')){snd(330,.06);c3End();return}
 const sh=q.S[q.i],need=Math.max(sh.cap[1].length/34,sh.k||0);
 if(pressed('a')||pressed('b')){if(q.ff||q.go>0||q.t>=need){snd(440,.04);c3Next(q);return}q.ff=1}
 const k=q.ff?5:1;q.t+=dt*k;q.tt+=dt*k;
 if(q.ff&&q.t>=need){q.ff=0;q.go=.45}
 if(q.sched.length){const due=q.sched.filter(e=>e[0]<=q.t);if(due.length){q.sched=q.sched.filter(e=>e[0]>q.t);for(const e of due)try{e[1]()}catch(err){}}}
 if(q.go>0){q.go-=dt;if(q.go<=0){c3Next(q);return}}
 if(q.t>=Math.max(sh.d,c3TextLen(sh.cap[1])))c3Next(q)}
/* hold: a shot's own clock stops at its length, so a scene that has finished moving waits there for its words */
function c3Frame(q,top,h){const sh=q.S[q.i],t=q.t;c3Size(h);if(!C3VAL)c3BuildValley();q.flash=0;q.tear=0;q.shake=0;q.label=null;c3D=c3M=c3New();c3X=[1,0,0,0,0,1,0,0,0,0,1,0];c3XS=[];c3stat.tris=0;
 let pre=[];const sky=c3Sky,moon=c3Moon;c3Moon=(...a)=>pre.push(a); /* the moon is painted on the sky, so it waits for the sky */
 try{sh.f(t,Math.min(1,t/sh.d))}finally{c3Moon=moon}
 if(q.shake){const k=q.shake*.06;c3CE[0]+=Math.sin(q.tt*71)*k;c3CE[1]+=Math.sin(q.tt*93)*k}
 sky(q.tt);for(const a of pre)moon(...a);const night=c3EN.sky[0][2]<60,WM=c3M=c3New();c3Water(q.tt,night);c3M=c3D;c3Show(C3VAL,[WM,c3D]);
 const px=c3px;if(q.tear){for(let k=0;k<5;k++){const y0=((q.tt*97+k*53)|0)%(h-8),hh=3+k*2,dx=((k%2?1:-1)*(4+k*3));for(let y=y0;y<y0+hh&&y<h;y++){const o=y*c3W;if(dx>0)px.copyWithin(o+dx,o,o+c3W-dx);else px.copyWithin(o,o-dx,o+c3W)}}}
 if(c3cx)c3cx.putImageData(c3im,0,0)}
/* On a slow device the picture is worked out every other frame (the last one is shown again in between); words and
   input still run every frame. It switches on above about 26 ms a frame and off again below 11. */
function c3DrawScene(){const q=c3q;r('#06050c',0,0,W,H);if(!q)return;const top=0,bot=42,h=Math.max(60,H-top-bot),sh=q.S[q.i]; /* TV: the picture starts at the top edge and is as tall as the handheld's, and wider */q.fn=(q.fn||0)+1;
 if(!q.half||q.fn%2||q.shot!==q.i||c3H!==h){const t0=typeof performance!=='undefined'?performance.now():0;c3Frame(q,top,h);q.shot=q.i;if(t0){const ms=performance.now()-t0;q.ms=q.ms===undefined||q.fn<3?ms:q.ms*.9+ms*.1;if(q.fn>8){if(q.ms>26)q.half=1;else if(q.ms<11)q.half=0}}}
 g.imageSmoothingEnabled=true;g.drawImage(c3cv,0,0,c3W,h,-UIX,top,TVW,h);g.imageSmoothingEnabled=false;
 if(q.flash>0)r('rgba(255,248,220,'+Math.min(1,q.flash).toFixed(2)+')',0,top,W,h);
 if(q.label){const L=q.label,dx=L[0]-c3CE[0],dy=L[1]-c3CE[1],dz=L[2]-c3CE[2],zc=dx*c3CF[0]+dy*c3CF[1]+dz*c3CF[2];if(zc>.5){const sx=c3W/2+(dx*c3CR[0]+dz*c3CR[2])*c3FL/zc,sy=c3H/2-(dx*c3CU[0]+dy*c3CU[1]+dz*c3CU[2])*c3FL/zc;g.globalAlpha=Math.max(0,Math.min(1,L[5]===undefined?1:L[5]));text(L[3],Math.round(sx-UIX-tw(L[3],2)/2),Math.round(top+sy-5),2,L[4]||'#f8e060','#181020');g.globalAlpha=1}}
 const fi=q.i===0?Math.max(0,1-q.t/.6):0;if(fi>0)r('rgba(6,5,12,'+fi.toFixed(2)+')',0,top,W,h);
 const who=sh.cap[0],s=sh.cap[1],ls=wrapPx(s,228),n=Math.floor(q.t*34);let c=0,y=H-bot+5;
 if(who){const w=tw(who)+10;r(WHO[who]||'#c8c0d8',6,H-bot-9,w,13);text(who,11,H-bot-9,2,'#181020',null)}
 ls.slice(0,3).forEach((l,k)=>{text(l.slice(0,Math.max(0,n-c)),6,y+k*13,2,who?'#fff8e0':'#d8d4e8',null);c+=l.length+1});
 text((q.i+1)+' / '+q.S.length,4-UIX,1,1,'#d8d4e8','#181020');rtext('START: SKIP',236+UIX,1,1,'#d8d4e8','#181020');
 if(q.ff){text('>>',224,H-13,1,'#f8e060',null)}else if(n>=s.length&&((time*3)|0)%2){r('#f8e060',229,H-9,5,3);r('#f8e060',230,H-6,3,1);r('#f8e060',231,H-5,1,1)}}

/* ---------- 7. the house, inside ----------
   The room is drawn live in the same 3D as the scenes: a cutaway seen from the south, like a doll's house. The game
   underneath is unchanged (Will walks the same 11 by 7 tiles, the desk is where it was, the four corners are the four
   jobs); only the picture is new. One unit is one tile. The house grows more furniture as it is upgraded. */
function c3Proj(x,y,z){const dx=x-c3CE[0],dy=y-c3CE[1],dz=z-c3CE[2],zc=dx*c3CF[0]+dy*c3CF[1]+dz*c3CF[2];if(zc<.2)return null;return[c3W/2+(dx*c3CR[0]+dz*c3CR[2])*c3FL/zc,c3H/2-(dx*c3CU[0]+dy*c3CU[1]+dz*c3CU[2])*c3FL/zc]}
function c3Room(t,night,up,J){const WALL='#d8c8a0',WAL2='#f0e4c4',WD='#6a4428',WL='#c89050';
 for(let i=0;i<11;i++)c3Box(i,-.2,0,i+1,0,7,i%2?'#8a5a34':'#946238',i%2?'#b88048':'#c08850');
 c3Box(-.3,0,-.3,11.3,3.3,0,WALL,WAL2);c3Box(-.3,0,0,0,3.3,7,'#c8b890',WAL2);c3Box(11,0,0,11.3,3.3,7,'#c8b890',WAL2);
 c3Box(0,0,0,11,.85,.05,'#7a4c28','#a87040');c3Box(0,0,0,.05,.85,7,'#7a4c28','#a87040');c3Box(10.95,0,0,11,.85,7,'#7a4c28','#a87040');
 c3Box(-.3,-.2,7,4.5,.35,7.25,'#383048','#585068');c3Box(6.5,-.2,7,11.3,.35,7.25,'#383048','#585068');c3Box(4.6,0,6.35,6.4,.03,7,'#3c8840','#78c870');
 /* windows, and what is hung between them */
 for(const wx of[1.5,8.2]){c3Box(wx-.1,1.4,0,wx+1.4,2.7,.06,WD,WL);const pc=night?'#283868':'#88d0f8',p2=night?'#101838':'#c8e8ff';c3Box(wx,1.5,.05,wx+1.3,2.6,.09,pc,p2,night?.5:.9);c3Box(wx+.62,1.5,.08,wx+.68,2.6,.11,WD);c3Box(wx,2.02,.08,wx+1.3,2.08,.11,WD);
  if(night)c3Box(wx+.9,2.25,.09,wx+1.05,2.4,.1,'#e8ecff','#e8ecff',1);c3Box(wx-.22,1.35,.06,wx+.06,2.75,.12,'#a03838','#e06060');c3Box(wx+1.24,1.35,.06,wx+1.52,2.75,.12,'#a03838','#e06060')}
 c3Box(3.5,1.7,0,4.4,2.5,.06,WD,WL);c3Box(3.58,1.78,.05,4.32,2.42,.08,'#f8e8b0');c3Box(3.84,1.9,.07,4.06,2.24,.1,'#f8d030','#fff8a0',.6);c3Box(3.78,2.24,.07,4.12,2.3,.1,'#c04848');
 c3Box(6.6,1.7,0,7.5,2.5,.06,WD,WL);c3Box(6.68,1.78,.05,7.42,2.42,.08,'#b0e0f8');c3Box(6.85,1.9,.07,7.25,2.15,.1,'#e89040');c3Box(6.9,2.02,.09,7.02,2.12,.11,'#fff0d8');
 /* the desk */
 c3Box(4.6,.72,.2,6.4,.82,1,'#8a5a34','#c89050');for(const dx of[4.68,6.24])for(const dz of[.28,.86])c3Box(dx,0,dz,dx+.08,.72,dz+.08,WD);c3Box(4.95,.82,.4,5.5,.85,.8,'#f4f0e0','#ffffff');c3Box(5.9,.82,.45,6.2,.92,.75,'#a02838','#e23b5e');
 c3Box(4.75,.82,.3,4.85,1.15,.4,'#383048');c3Box(4.66,1.15,.22,4.94,1.3,.48,night?'#f8e060':'#c8b060',night?'#fff8a0':'#e8d080',night?1:.2);c3Box(5.25,0,1.15,5.75,.42,1.6,WD,WL);c3Box(5.25,.42,1.5,5.75,.95,1.6,WD,WL);
 /* pickers: shelves, jars, crates of berries */
 c3Box(.15,0,.08,2.3,.1,.55,WD);c3Box(.15,.9,.08,2.3,.98,.55,WD,WL);c3Box(.15,1.6,.08,2.3,1.68,.5,WD,WL);c3Box(.15,0,.08,.23,1.68,.55,WD);c3Box(2.22,0,.08,2.3,1.68,.55,WD);
 for(let k=0;k<5;k++){const jx=.35+k*.4;c3Box(jx,.98,.18,jx+.26,1.32,.44,['#e83860','#f0a020','#9070b8','#e83860','#58a058'][k],'#ffffff')}
 for(let c=0;c<Math.min(3,1+((J[0]+2)/3|0));c++){const cx=.5+c*.95,cz=1.05+(c%2)*.25;c3Box(cx,0,cz,cx+.75,.5,cz+.6,'#8a5a34','#c89050');for(let b=0;b<4;b++){c3Push();c3T(cx+.2+(b%2)*.34,.56,cz+.17+((b/2)|0)*.26);c3Ball(.15,.14,.15,'#a01838','#f06080',5,3);c3Pop()}}
 /* florists: a bench of pots */
 c3Box(8,.7,.1,10.8,.8,.75,'#8a5a34','#c89050');c3Box(8.05,0,.15,8.15,.7,.7,WD);c3Box(10.65,0,.15,10.75,.7,.7,WD);
 for(let k=0;k<5;k++){const fx=8.3+k*.55,C=[['#ffffff','#f8d040'],['#f85888','#f8a0c8'],['#f8c020','#f8e060'],['#a8c8ff','#ffffff'],['#f85888','#f8a0c8']][k];c3Push();c3T(fx,.8,.42);c3Cyl(6,.12,.16,0,.22,'#a05030','#d07848',0,1);c3Box(-.015,.22,-.015,.015,.55+(k%2)*.1,.015,'#2c8030');c3T(0,.6+(k%2)*.1,0);c3Ball(.13,.09,.13,C[0],C[1],6,3);c3Pop()}
 c3Push();c3T(10.4,0,1.6);c3Cyl(6,.22,.28,0,.4,'#a05030','#d07848',0,1);c3T(0,.4,0);c3Cyl(5,.05,.04,0,.7,'#3c2414','#6a4428');c3T(0,.95,0);c3Ball(.42,.5,.42,'#286838','#58a868',6,4);c3Pop();
 /* Louie's corner: rug, bed, bowl, ball, hoop */
 c3Box(.5,0,4.5,3.4,.03,6.3,'#2850a0','#4878d0');c3Box(.7,.03,4.7,3.2,.04,6.1,'#3868c0','#78a8f0');c3Push();c3T(1.1,0,5.9);c3Cyl(8,.5,.5,0,.16,'#a03838','#e06060');c3Cyl(8,.36,.36,.16,.2,'#f8e8d0','#fff8e8',0,1);c3Pop();
 c3Push();c3T(2.1,0,6.5);c3Cyl(8,.2,.24,0,.12,'#60b8f8','#a8d8ff',0,1);c3Pop();c3Push();c3T(2.9,.16,5.2);c3Ball(.16,.16,.16,'#c02848','#f8e060',6,4);c3Pop();
 c3Box(3.1,0,4.6,3.18,1.3,4.68,WD);c3Push();c3T(3.14,1.3,4.64);c3RX(1.5708);c3Cyl(8,.3,.3,-.03,.03,'#f08030','#f8c060');c3Cyl(8,.22,.22,-.04,.04,WALL,WALL);c3Pop();
 /* the middle: a round rug and cushions */
 c3Disc(5.55,.03,3.85,1.75,[176,64,56],1,2,1.05);c3Disc(5.55,.035,3.85,1.4,[240,168,104],1,2,.82);c3Disc(5.55,.04,3.85,.5,[248,224,96],1,2,.3);
 for(const [qx,qz,c] of[[4.5,3.3,'#9070d0'],[6.6,4.4,'#58a058'],[6.5,3.2,'#e88020']]){c3Push();c3T(qx,.1,qz);c3Ball(.3,.12,.3,c,'#ffffff',6,3);c3Pop()}
 /* beds along the east wall: one more for each time the house was made bigger */
 for(let b=0;b<=Math.min(3,up);b++){const bz=4.1+b*.72;if(bz>6.4)break;c3Box(9.2,0,bz,10.9,.3,bz+.6,WD,WL);c3Box(9.25,.3,bz+.04,10.85,.42,bz+.56,'#f0e0c0','#ffffff');c3Box(9.25,.42,bz+.04,10.2,.46,bz+.56,['#60b8f8','#f85888','#58a058','#f8c020'][b],'#ffffff');c3Box(10.45,.42,bz+.12,10.8,.5,bz+.48,'#ffffff')}
 if(up>=1){c3Push();c3T(.5,0,3.2);c3Cyl(6,.2,.26,0,.36,'#a05030','#d07848',0,1);c3T(0,.36,0);c3Ball(.3,.4,.3,'#286838','#78c870',6,4);c3Pop()}
 if(up>=2){c3Box(8.3,0,2.2,8.4,1.5,3.3,WD);c3Box(8.3,0,2.2,8.75,.08,3.3,WD);for(let k=0;k<3;k++){c3Box(8.3,.45+k*.5,2.2,8.75,.5+k*.5,3.3,WD,WL);for(let q=0;q<5;q++)c3Box(8.42,.5+k*.5-.42,2.3+q*.19,8.7,.5+k*.5-.02-(q%2)*.05,2.45+q*.19,RAINBOW[(q+k)%6])}}
 /* the fire on the west wall */
 c3Box(0,0,3.3,.5,1.5,4.4,'#585068','#888098');c3Box(0,1.5,3.2,.62,1.62,4.5,'#383048','#686078');c3Box(.3,.05,3.55,.52,.95,4.15,'#181020');
 {const f=.75+.25*Math.sin(t*11);c3Push();c3T(.42,.1,3.85);c3Cyl(5,.2,0,0,.5*f,'#f08030','#f8e060',1,1);c3Pop();c3Glow(.5,.4,3.85,.8+f*.3,'#ffb050',.45)}
 /* the lamp over the middle */
 c3Box(5.52,2.75,3.5,5.58,3.3,3.56,'#383048');c3Box(5.3,2.45,3.3,5.8,2.78,3.76,night?'#f8e060':'#d8c060',night?'#fff8a0':'#f0e090',night?1:.3);if(night)c3Glow(5.55,2.6,3.53,1.5,'#ffe890',.4)}
/* fit the room to the screen: back away until all of it is between the top bar and the bottom strip, then centre it */
const C3HF={};
function c3HomeFit(){if(C3HF[c3H])return C3HF[c3H];const asp=c3H/c3W,ratio=Math.max(.6,Math.min(1.2,.5+(asp-.7)*1.15)),b0=22,b1=c3H-36;let out=[20,ratio,0];
 for(let b=10;b<46;b+=.4){c3Cam(5.5,b*ratio,b,5.5,.7,3.1,38);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,ok=true;for(const x of[-.3,11.3])for(const y of[-.2,3.3])for(const z of[-.3,7.25]){const q=c3Proj(x,y,z);if(!q){ok=false;continue}x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])}
  if(ok&&x0>=1&&x1<=c3W-1&&y1-y0<=b1-b0){out=[b,ratio,Math.round((b0+b1)/2-(y0+y1)/2)];break}}
 return C3HF[c3H]=out}
function c3HomeDraw(){const t=time,night=dayT/DAYLEN>.7,X0=RX,Z0=RY,wx=v=>(v-X0)/16,wz=v=>(v-Z0)/16,J=home.jobs,up=home.up|0;
 c3Size(H);c3D=c3M=c3New();c3X=[1,0,0,0,0,1,0,0,0,0,1,0];c3XS=[];c3stat.tris=0;
 const E=c3Env(night?'night':'day');E.sky=[[14,10,22],[14,10,22]];E.fog=[14,10,22];E.fn=60;E.ff=200;E.stars=0;E.amb=night?[.34,.32,.4]:[.62,.58,.54];E.sun=night?[.14,.14,.2]:[.5,.46,.4];E.sd=[.25,.8,.55];const l=Math.hypot(.25,.8,.55);E.sd=E.sd.map(v=>v/l);
 if(night){c3Lamp(5.55,2.5,3.5,'#ffd890',5,1.5);c3Lamp(4.8,1.3,.6,'#ffd890',2,.7)}c3Lamp(.7,.6,3.85,'#ffa050',night?3.2:2,night?1.1:.5);
 const px=wx(P.x),pz=wz(P.y),fit=c3HomeFit(),DY=fit[2],cx=5.5+(px-5.5)*.12;c3Cam(cx,fit[0]*fit[1],fit[0],cx,.7,3.1,38);
 c3Room(t,night,up,J);
 for(const q of resid)c3Sprout(wx(q.x),wz(q.y),q.type,{y:0,stage:2,ang:q.mv?(q.fx>0?1.5708:-1.5708):0,hop:q.mv?Math.abs(Math.sin(t*9+q.a))*.1:0});
 c3Dog(wx(LO.x),wz(LO.y)+.3,LO.fx>0?1.5708:-1.5708,{y:0,sit:LO.st==='sit',walk:LO.mv?t:0});
 c3Person(px,pz,Math.atan2(P.dx,P.dy),Object.assign(c3Look(),{y:0,walk:P.mv?P.anim:0}));
 c3Sky(t);c3Show([],[c3D]);if(c3cx)c3cx.putImageData(c3im,0,0);
 r('#0e0a16',0,0,TVW,H);g.imageSmoothingEnabled=true;g.drawImage(c3cv,0,0,c3W,c3H,0,DY,TVW,H);g.imageSmoothingEnabled=false;const c3P=(x,y,z)=>{const q=c3Proj(x,y,z);if(q)q[1]+=DY;return q};
 /* over the picture: the four jobs, Louie's bubbles, hearts, and the strip at the bottom */
 [['PICKERS '+J[0],1.9,1.9,1.9],['FLORISTS '+J[1],9.2,1.9,1.6],['TRAINERS '+J[2],1.9,1.5,5.4],['RESTING '+(homeTotal()-J[0]-J[1]-J[2]),5.55,1.2,3.85]].forEach(([n,lx,ly,lz])=>{const q=c3P(lx,ly,lz);if(q){const w=tw(n,1);text(n,Math.round(Math.max(2,Math.min(TVW-w-2,q[0]-w/2))),Math.round(q[1]),1,'#fff8e0','#181020')}});
 {const q=c3P(wx(LO.x),1.25,wz(LO.y)+.3);if(q){const x=Math.round(q[0]),y=Math.round(q[1]);if(LO.say&&LO.say.t>0){const s2=LO.say.s,w2=tw(s2,2)+8,bx=Math.max(2,Math.min(TVW-w2-2,Math.round(x-w2/2)));r('#181020',bx-1,y-17,w2+2,16);r('#ffffff',bx,y-16,w2,14);text(s2,bx+4,y-15,2,'#281c30',null)}
   else if(petOK&&state==='play'){const by=y-12+(((time*3)|0)%2);r('#181020',x-6,by-1,13,11);r('#ffffff',x-5,by,11,9);r('#f85888',x-3,by+2,2,2);r('#f85888',x+1,by+2,2,2);r('#f85888',x-3,by+3,6,2);r('#f85888',x-2,by+5,4,1);r('#f85888',x-1,by+6,2,1)}}}
 for(const p of parts){const q=c3P(wx(p.x),p.gh?1.1:.3,wz(p.y));if(!q)continue;const x=Math.round(q[0]),y=Math.round(q[1]-(1-p.life)*10);if(p.gh===2){r(p.c,x-2,y-1,2,2);r(p.c,x+1,y-1,2,2);r(p.c,x-2,y,5,2);r(p.c,x-1,y+2,3,1);r(p.c,x,y+3,1,1)}else r(p.c,x,y,2,2)}
 if(state==='play'){const fy=H-50,st=homeAt();box(0,fy,TVW,31,'rgba(24,16,32,.92)');g.save();g.translate(UX,0);ctext(st?st.t:!resid.length?'NOBODY LIVES HERE YET. TRY THE DESK':'LIVING HERE '+homeTotal()+' / '+homeCap(),fy+2,2,st?'#f8e060':'#fff8e0');ctext('DESK   BEDS   PANTRY   FIRE      WALK DOWN TO LEAVE',fy+17,1,'#a098b0');g.restore();
  for(const h of HST){const q=c3P(h.p[0],h.p[1],h.p[2]);if(!q)continue;const on=h===st,x=Math.round(q[0]),y=Math.round(q[1])-8+(on?Math.round(Math.sin(time*6)*1.5):0);if(on){if(((time*3)|0)%3)text('!',x-2,y,3,'#f8e060')}else{r('#181020',x-2,y+4,5,5);r('#f8e060',x-1,y+5,3,3)}}}}

/* ---------- 8. TV: the title ----------
   The camera circles the Lantern at night while the name drops in. Drawn across the whole screen. */
const C3TITLE={d:1e9,cap:['',''],f(t){const a=.6+t*.07;c3Cam(Math.cos(a)*12.5,3.6+Math.sin(t*.23)*.5,Math.sin(a)*12.5,0,2.9,0,56);c3Night(t,1);c3Ring(t,8);
 c3Person(-1.6,4.4,.15,Object.assign(c3Look(),{up:.15}));c3Person(-3,4.1,.3,Object.assign({},C3ERIN));c3Dog(-.4,4.9,.1,{sit:1,up:.2})}};
function c3TitleDraw(t){const q={key:'title',S:[C3TITLE],i:0,t,tt:t,cue:{},sched:[],flash:0,tear:0,shake:0,label:null},was=c3q;c3q=q;try{c3Frame(q,0,TVH)}finally{c3q=was}
 g.imageSmoothingEnabled=true;g.drawImage(c3cv,0,0,c3W,TVH,0,0,TVW,TVH);g.imageSmoothingEnabled=false;
 if(t<.8)r('rgba(7,6,12,'+(1-t/.8).toFixed(2)+')',0,0,TVW,TVH);
 /* the name, twice the size of anything else in the game, one letter at a time */
 const T='SPROUTS',sc=2,wT=tw(T,5)*sc;let cx=Math.round((TVW-wT)/2);g.save();
 for(let i=0;i<T.length;i++){const k=Math.max(0,Math.min(1,(t-.5-i*.12)/.35)),b=k<1?0:Math.max(0,Math.sin((t-.85-i*.12)*9))*Math.max(0,1-(t-.85-i*.12)*1.6)*6,y=Math.round(-60+(14+60)*k-b);
  if(k>0){g.save();g.translate(cx,y);g.scale(sc,sc);text(T[i],1.5,1.5,5,'#281408',null);text(T[i],0,0,5,'#f8e060','#783010');g.restore()}cx+=tw(T[i],5)*sc}
 g.restore();
 if(t>1.9){g.globalAlpha=Math.min(1,(t-1.9)/.5);const s2='A POCKET LANTERN GAME',w2=tw(s2,2);text(s2,Math.round((TVW-w2)/2),70,2,'#fff8e0','#181020');g.globalAlpha=1}
 if(t>2.6&&((t*1.6)|0)%2){const s3=padSeen?'PRESS START':'PRESS ENTER',w3=tw(s3,3);text(s3,Math.round((TVW-w3)/2),TVH-44,3,'#ffffff','#181020')}
 if(t>2.6){text('NORTH COAST STUDIOS',6,TVH-12,1,'#a098b0','#181020');rtext('F: FULL SCREEN',TVW-6,TVH-12,1,'#a098b0','#181020')}}

