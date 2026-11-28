/* =====================================================================
   ROOTDEEP 64 — engine
   A tiny WebGL renderer built for one look: late-90s cartridge 3D.
   Low internal resolution stretched soft, Gouraud vertex lighting,
   vertex-colour gradients, bilinear low-res textures, distance fog,
   blob shadows. No libraries; everything is drawn from code.
   ===================================================================== */
'use strict';
const cv=document.getElementById('gl'),hudCv=document.getElementById('hud'),stage=document.getElementById('stage');
const gl=cv.getContext('webgl',{antialias:false,alpha:false,depth:true,preserveDrawingBuffer:false})||cv.getContext('experimental-webgl');
const hx=hudCv.getContext('2d');
const R=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
function hex(c){if(Array.isArray(c))return c;const n=parseInt(c.slice(1),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
function shade(c,k){c=hex(c);return[c[0]*k,c[1]*k,c[2]*k]}
function mix3(a,b,t){a=hex(a);b=hex(b);return[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]}

/* ---------- matrices (column-major) ---------- */
function m4(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
function m4mul(a,b,o){
 const a0=a[0],a1=a[1],a2=a[2],a3=a[3],a4=a[4],a5=a[5],a6=a[6],a7=a[7],a8=a[8],a9=a[9],a10=a[10],a11=a[11],a12=a[12],a13=a[13],a14=a[14],a15=a[15];
 for(let i=0;i<4;i++){const b0=b[i*4],b1=b[i*4+1],b2=b[i*4+2],b3=b[i*4+3];
  o[i*4]=a0*b0+a4*b1+a8*b2+a12*b3;o[i*4+1]=a1*b0+a5*b1+a9*b2+a13*b3;o[i*4+2]=a2*b0+a6*b1+a10*b2+a14*b3;o[i*4+3]=a3*b0+a7*b1+a11*b2+a15*b3}
 return o}
function m4persp(fov,asp,n,f){const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o}
function m4look(e,c,u){let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;
 let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;
 const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
 return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])}

/* ---------- mesh builder ---------- */
function MB(){this.v=[];this.m=null}
MB.prototype.xf=function(tx,ty,tz,rx,ry,rz){ /* local transform for the shapes that follow */
 rx=rx||0;ry=ry||0;rz=rz||0;const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
 /* R = Ry * Rx * Rz */
 this.m=[cy*cz+sy*sx*sz,cx*sz,-sy*cz+cy*sx*sz, -cy*sz+sy*sx*cz,cx*cz,sy*sz+cy*sx*cz, sy*cx,-sx,cy*cx, tx,ty,tz];return this};
MB.prototype.rst=function(){this.m=null;return this};
MB.prototype.p=function(x,y,z,nx,ny,nz,c,u,v){const m=this.m;
 if(m){const X=m[0]*x+m[3]*y+m[6]*z+m[9],Y=m[1]*x+m[4]*y+m[7]*z+m[10],Z=m[2]*x+m[5]*y+m[8]*z+m[11];
  const NX=m[0]*nx+m[3]*ny+m[6]*nz,NY=m[1]*nx+m[4]*ny+m[7]*nz,NZ=m[2]*nx+m[5]*ny+m[8]*nz;x=X;y=Y;z=Z;nx=NX;ny=NY;nz=NZ}
 this.v.push(x,y,z,nx,ny,nz,c[0],c[1],c[2],u||0,v||0)};
MB.prototype.quad=function(a,b,c,d,ca,cb,cc,cd,uv){ /* a,b,c,d counter-clockwise; flat normal */
 const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];
 let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
 ca=hex(ca);cb=cb?hex(cb):ca;cc=cc?hex(cc):ca;cd=cd?hex(cd):ca;uv=uv||[0,0,0,0,0,0,0,0];
 const P=(q,c,i)=>this.p(q[0],q[1],q[2],nx,ny,nz,c,uv[i*2],uv[i*2+1]);
 P(a,ca,0);P(b,cb,1);P(c,cc,2);P(a,ca,0);P(c,cc,2);P(d,cd,3);return this};
/* box centred on (x,y,z); c = colour, c2 = optional top colour (vertex gradient) */
MB.prototype.box=function(x,y,z,w,h,d,c,c2){const a=w/2,b=h/2,e=d/2;c=hex(c);c2=c2?hex(c2):c;const dk=shade(c,.82);
 const x0=x-a,x1=x+a,y0=y-b,y1=y+b,z0=z-e,z1=z+e;
 this.quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],c,c,c2,c2);   /* front +z */
 this.quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],c,c,c2,c2);   /* back */
 this.quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],c,c,c2,c2);   /* right */
 this.quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],c,c,c2,c2);   /* left */
 this.quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],c2,c2,c2,c2); /* top */
 this.quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],dk,dk,dk,dk); /* bottom */
 return this};
/* cylinder / cone: base centre (x,y,z), radii r0 (bottom) r1 (top), smooth sides */
MB.prototype.cyl=function(x,y,z,r0,r1,h,seg,c,c2,nocap){c=hex(c);c2=c2?hex(c2):c;const sl=(r0-r1)/h;
 for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
  const n0=1/Math.hypot(1,sl),A=[x+c0*r0,y,z+s0*r0],B=[x+c1*r0,y,z+s1*r0],C=[x+c1*r1,y+h,z+s1*r1],D=[x+c0*r1,y+h,z+s0*r1];
  this.p(A[0],A[1],A[2],c0*n0,sl*n0,s0*n0,c);this.p(C[0],C[1],C[2],c1*n0,sl*n0,s1*n0,c2);this.p(B[0],B[1],B[2],c1*n0,sl*n0,s1*n0,c);
  this.p(A[0],A[1],A[2],c0*n0,sl*n0,s0*n0,c);this.p(D[0],D[1],D[2],c0*n0,sl*n0,s0*n0,c2);this.p(C[0],C[1],C[2],c1*n0,sl*n0,s1*n0,c2);
  if(!nocap){if(r1>0.01){this.p(x,y+h,z,0,1,0,c2);this.p(C[0],C[1],C[2],0,1,0,c2);this.p(D[0],D[1],D[2],0,1,0,c2)}
   if(r0>0.01){const k=shade(c,.8);this.p(x,y,z,0,-1,0,k);this.p(A[0],A[1],A[2],0,-1,0,k);this.p(B[0],B[1],B[2],0,-1,0,k)}}}
 return this};
/* ellipsoid centred on (x,y,z); colour runs c (bottom) -> c2 (top) */
MB.prototype.sph=function(x,y,z,rx,ry,rz,seg,rings,c,c2){c=hex(c);c2=c2?hex(c2):c;
 const P=(i,j)=>{const th=i/seg*6.2832,ph=j/rings*3.14159,sp=Math.sin(ph),nx=Math.cos(th)*sp,ny=Math.cos(ph),nz=Math.sin(th)*sp;
  return[x+nx*rx,y+ny*ry,z+nz*rz,nx,ny,nz,mix3(c,c2,(ny+1)/2)]};
 const E=q=>this.p(q[0],q[1],q[2],q[3],q[4],q[5],q[6]);
 for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const a=P(i,j),b=P(i+1,j),d=P(i,j+1),e=P(i+1,j+1);
  if(j>0){E(a);E(b);E(d)}if(j<rings-1){E(b);E(e);E(d)}}
 return this};
MB.prototype.done=function(){const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.v),gl.STATIC_DRAW);
 return{buf,n:this.v.length/11}};

/* ---------- shader ---------- */
const VS=`attribute vec3 aP,aN,aC;attribute vec2 aU;
uniform mat4 uVP,uM;uniform vec3 uL,uAmb,uLc,uAdd,uTint;uniform vec2 uFog;uniform float uLit;
varying vec3 vC;varying vec2 vU;varying float vF;
void main(){vec4 w=uM*vec4(aP,1.);gl_Position=uVP*w;
 vec3 n=normalize(mat3(uM)*aN);float d=max(dot(n,uL),0.);
 vec3 lit=mix(vec3(1.),uAmb+uLc*d,uLit);
 vC=aC*uTint*lit+uAdd;vU=aU;
 vF=clamp((gl_Position.w-uFog.x)/(uFog.y-uFog.x),0.,1.);}`;
const FS=`precision mediump float;uniform sampler2D uT;uniform vec3 uFogC;uniform float uA;
varying vec3 vC;varying vec2 vU;varying float vF;
void main(){vec4 t=texture2D(uT,vU);gl_FragColor=vec4(mix(vC*t.rgb,uFogC,vF),uA*t.a);}`;
const RN={m:m4(),stack:[],vp:m4(),tq:[],eye:[0,0,0],right:[1,0,0],up:[0,1,0],fogC:[0,0,0],fog:[300,700],w:320,h:240,asp:4/3,ok:!!gl};
let U={},prog=null,texWhite=null,curTex=null;
function glInit(){if(!gl)return;
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
 prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));
 ['aP','aN','aC','aU'].forEach((n,i)=>gl.bindAttribLocation(prog,i,n));gl.linkProgram(prog);gl.useProgram(prog);
 for(const n of['uVP','uM','uL','uAmb','uLc','uAdd','uTint','uFog','uLit','uT','uFogC','uA'])U[n]=gl.getUniformLocation(prog,n);
 for(let i=0;i<4;i++)gl.enableVertexAttribArray(i);
 texWhite=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texWhite);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.uniform1i(U.uT,0)}
/* bilinear, mip-mapped, repeating: the N64 texture look */
function mkTex(canvas,clampEdge){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);
 gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 const w=clampEdge?gl.CLAMP_TO_EDGE:gl.REPEAT;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,w);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,w);curTex=null;return t}

/* ---------- matrix stack ---------- */
const _t=m4(),_r=m4();
function mId(){RN.m.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
function mPush(){RN.stack.push(new Float32Array(RN.m))}
function mPop(){RN.m.set(RN.stack.pop())}
function mT(x,y,z){const m=RN.m;m[12]+=m[0]*x+m[4]*y+m[8]*z;m[13]+=m[1]*x+m[5]*y+m[9]*z;m[14]+=m[2]*x+m[6]*y+m[10]*z}
function mS(x,y,z){const m=RN.m;if(y===undefined)y=z=x;m[0]*=x;m[1]*=x;m[2]*=x;m[4]*=y;m[5]*=y;m[6]*=y;m[8]*=z;m[9]*=z;m[10]*=z}
function mRY(a){const c=Math.cos(a),s=Math.sin(a);_r.set([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]);_t.set(RN.m);m4mul(_t,_r,RN.m)}
function mRX(a){const c=Math.cos(a),s=Math.sin(a);_r.set([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]);_t.set(RN.m);m4mul(_t,_r,RN.m)}
function mRZ(a){const c=Math.cos(a),s=Math.sin(a);_r.set([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]);_t.set(RN.m);m4mul(_t,_r,RN.m)}

/* ---------- frame ---------- */
const WHITE=[1,1,1],BLACK=[0,0,0];
let lightDir=[.35,.8,.48],lightCol=[.75,.72,.68],ambCol=[.42,.4,.46];
function setLight(dir,col,amb){const l=Math.hypot(dir[0],dir[1],dir[2]);lightDir=[dir[0]/l,dir[1]/l,dir[2]/l];lightCol=col;ambCol=amb}
function setFog(c,near,far){RN.fogC=hex(c);RN.fog=[near,far]}
function setCam(eye,tgt,fov){const p=m4persp(fov,RN.asp,4,1400),v=m4look(eye,tgt,[0,1,0]);m4mul(p,v,RN.vp);RN.eye=eye;
 RN.right=[v[0],v[4],v[8]];RN.up=[v[1],v[5],v[9]];RN.fwd=[-v[2],-v[6],-v[10]]}
function frameBegin(){gl.viewport(0,0,cv.width,cv.height);gl.clearColor(RN.fogC[0],RN.fogC[1],RN.fogC[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.useProgram(prog);gl.uniformMatrix4fv(U.uVP,false,RN.vp);gl.uniform3fv(U.uL,lightDir);gl.uniform3fv(U.uAmb,ambCol);gl.uniform3fv(U.uLc,lightCol);
 gl.uniform3fv(U.uFogC,RN.fogC);gl.uniform2f(U.uFog,RN.fog[0],RN.fog[1]);gl.disable(gl.BLEND);gl.depthMask(true);RN.tq.length=0;mId();RN.stack.length=0;curMesh=null}
let curMesh=null;
function _issue(mesh,M,o){
 if(curMesh!==mesh){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buf);gl.vertexAttribPointer(0,3,gl.FLOAT,false,44,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,44,12);
  gl.vertexAttribPointer(2,3,gl.FLOAT,false,44,24);gl.vertexAttribPointer(3,2,gl.FLOAT,false,44,36);curMesh=mesh}
 gl.uniformMatrix4fv(U.uM,false,M);
 const c=o&&o.c||WHITE,f=o&&o.add||0;gl.uniform3f(U.uTint,c[0],c[1],c[2]);
 if(typeof f==='number')gl.uniform3f(U.uAdd,f,f,f);else gl.uniform3f(U.uAdd,f[0],f[1],f[2]);
 gl.uniform1f(U.uLit,o&&o.unlit?0:1);gl.uniform1f(U.uA,o&&o.a!==undefined?o.a:1);
 const tx=o&&o.tex||texWhite;if(curTex!==tx){gl.bindTexture(gl.TEXTURE_2D,tx);curTex=tx}
 gl.drawArrays(gl.TRIANGLES,0,mesh.n)}
/* opaque: drawn now with the current matrix */
function draw(mesh,o){_issue(mesh,RN.m,o)}
/* translucent / additive: queued, drawn after everything solid */
function drawT(mesh,o){RN.tq.push({mesh,M:new Float32Array(RN.m),o:o||{}})}
function frameEnd(){gl.enable(gl.BLEND);gl.depthMask(false);
 for(const q of RN.tq){if(q.o.glow){gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.uniform3f(U.uFogC,0,0,0)}else{gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform3fv(U.uFogC,RN.fogC)}
  if(q.o.nocull)gl.disable(gl.CULL_FACE);_issue(q.mesh,q.M,q.o);if(q.o.nocull)gl.enable(gl.CULL_FACE)}
 gl.depthMask(true);gl.disable(gl.BLEND);gl.uniform3fv(U.uFogC,RN.fogC)}
/* camera-facing sprite quad (needs MESH.quad from models.js) */
const _bb=m4();
function sprite(x,y,z,s,c,a,glow,sy){const r=RN.right,u=RN.up,f=RN.fwd,h=sy||s;
 _bb.set([r[0]*s,r[1]*s,r[2]*s,0,u[0]*h,u[1]*h,u[2]*h,0,-f[0],-f[1],-f[2],0,x,y,z,1]);
 RN.tq.push({mesh:MESH.quad,M:new Float32Array(_bb),o:{c:c,a:a===undefined?1:a,unlit:true,glow:!!glow,nocull:true,tex:TEXGLOW}})}
/* world -> HUD (virtual) coordinates */
function project(x,y,z){const m=RN.vp,w=m[3]*x+m[7]*y+m[11]*z+m[15];if(w<=0.01)return null;
 return{x:((m[0]*x+m[4]*y+m[8]*z+m[12])/w*.5+.5)*VW,y:(1-((m[1]*x+m[5]*y+m[9]*z+m[13])/w*.5+.5))*VH,w}}

/* ---------- layout: 3D canvas at cartridge resolution, HUD crisp on top ---------- */
let VW=400,VH=300,hudS=1,portrait=false;
const IRES=240; /* internal vertical resolution, like a 240p console */
function layout(){const bw=window.innerWidth,bh=window.innerHeight;portrait=bh>bw*1.15;
 let w=bw,h=bh;if(portrait){h=Math.min(bw,Math.round(bh*.56));}
 stage.style.width=w+'px';stage.style.height=h+'px';
 document.body.classList.toggle('portrait',portrait);
 RN.asp=w/h;RN.h=IRES;RN.w=Math.min(520,Math.round(IRES*RN.asp));cv.width=RN.w;cv.height=RN.h;
 const dpr=Math.min(2,window.devicePixelRatio||1);hudCv.width=Math.round(w*dpr);hudCv.height=Math.round(h*dpr);
 VH=300;VW=VH*RN.asp;if(VW<300){VW=300;VH=VW/RN.asp}hudS=hudCv.height/VH}
window.addEventListener('resize',layout);window.addEventListener('orientationchange',()=>setTimeout(layout,120));
