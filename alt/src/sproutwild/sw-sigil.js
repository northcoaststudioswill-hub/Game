/* ================================================================
   THE FIRST SIGIL (v8.8): a big moment gets a cinematic in the
   fighter's style. Marcus cuts in, the Verdant Sigil slams down, and
   the roads the Ranger kept shut open: east to Crooked Hollow, south
   to Squire's Woods. About 4.5 s; A skips after 1.2 s.
   ================================================================ */
/* v9.1: one cinematic for each alpha's Sigil; what it opens depends on how many you hold */
const WSIGOPEN=[null,{a:'ROADS',b:'OPEN',sub:'',end:"The roads are open. Crooked Hollow is east of the Meadow, Squire's Woods south."},
 {a:'SHORE ROAD',b:'OPEN',sub:'Lantern Town, the south-east road',end:'Two Sigils. The Shore road from Lantern Town is open.'},
 {a:'GLOOM HOLLOW',b:'OPEN',sub:'past the Shore',end:'Three Sigils. Gloom Hollow is open, past the Shore. Its alpha waits.'},
 {a:'THE KING',b:'WILL SEE YOU',sub:'Gloom Hollow. Bring your Sigils.',end:'Four Sigils. King Bibi will see you in Gloom Hollow.'}];
function sigilCheck(){if(W4.sigilQ&&SCOFF){W4.sigilQ=0;return}if(!W4.sigilQ||state!=='g4world'||W4.scene||swBusy())return;const Q=typeof W4.sigilQ==='object'?W4.sigilQ:{sp:'BLOOMBOAR',n:1};W4.sigilQ=0;W4.sigQ=Q;
 if(!(typeof KO!=='undefined'&&KO&&KO._)){swSay(WSIGOPEN[Math.min(4,Q.n)].end,3.6);return}
 W4.sigC=0;state='g4sigil';swSnd(110,.4,55);swSnd(880,.12,1760)}
function sigilUpdate(dt){const t0=W4.sigC||0;W4.sigC=t0+dt;const t=W4.sigC,at=a=>t0<a&&t>=a;
 if(at(.9)){swSnd(140,.7,50);swSnd(1200,.1,300)}if(at(1.5))swSnd(523,.1,523);if(at(1.75))swSnd(784,.14,784);
 if(at(3.0)){swSnd(110,.3,55);swSnd(880,.12,1760)}if(at(3.4)){swSnd(988,.1,988);swSnd(1319,.45,1319)}
 if((pressed('a')&&t>1.2)||pressed('start'))W4.sigC=Math.max(t,4.6);
 if(W4.sigC>=4.6){W4.sigC=null;state='g4world';swSay(WSIGOPEN[Math.min(4,(W4.sigQ||{n:1}).n)].end,3.6)}}
function drawSigil(){const KC=KO._,C=KC.CH,M=C[C.findIndex(c=>c.id==='marcus')],t=W4.sigC||0,cy=Math.round(H/2),K='#141018';ox=0;oy=0;
 const Q=W4.sigQ||{sp:'BLOOMBOAR',n:1},SG=WASIG[Q.sp]||WASIG.BLOOMBOAR,OP=WSIGOPEN[Math.min(4,Q.n)],ORD=['FIRST','SECOND','THIRD','FOURTH'][Math.min(3,Q.n-1)],WD=SG.n.split(' ');
 const disc=(x,y,rr,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,rr,0,7);g.fill()},
  lines=(x,y,col,n)=>{g.save();g.translate(x,y);for(let i=0;i<n;i++){g.rotate(6.283/n+.07*Math.sin(i*7));const d0=40+((i*37+time*400)%60);r(col,d0,-1,220,i%3?2:4)}g.restore()},
  slam=(s,y,sc,c,t1)=>{if(t<t1)return;const k=Math.min(1,(t-t1)/.12),z=1+(1-k)*1.4,sh=t-t1<.25?Math.round(Math.sin(t*120)*3):0;g.save();g.translate(W/2+sh,y);g.scale(z,z);const w=tw0(s,sc);text0(s,-w/2+2,2,sc,K,null);text0(s,-w/2,0,sc,c,null);g.restore()};
 if(t<.9){/* Marcus cuts in on a slanted band */const e=Math.min(1,t/.18),sl=Math.round((1-e)*W);r('#0c0810',0,0,W,H);
  g.save();g.translate(W/2,cy);g.rotate(-.3);r('#2e6a2a',-W+sl*1.5,-66,W*2,24);r('#2e6a2a',-W-sl*1.5,42,W*2,24);r('#7ec850',-W-sl,-36,W*2,72);r(K,-W+sl,-32,W*2,4);r(K,-W+sl,28,W*2,4);g.restore();
  const img=M.head,S_=5,hw=img.width*S_,hh=img.height*S_,px=Math.round(W/2-hw/2+(1-e)*130),py=Math.round(cy-hh/2-18);
  g.imageSmoothingEnabled=false;r(K,px-5,py-5,hw+10,hh+10);r('#ffffff',px-3,py-3,hw+6,hh+6);r('#2e6a2a',px,py,hw,hh);g.drawImage(img,px,py,hw,hh);
  if(t>.22){ctext0(ORD,py+hh+12,4,'#ffffff',K);ctext0('SIGIL!',py+hh+30,4,'#f8e060',K);ctext0(Q.n>=4?'ALL FOUR, BRO  -  MARCUS':'THAT IS MY GUY  -  MARCUS',py+hh+52,1,'#f8e060',null)}
  if(t<.05)r('#ffffff',0,0,W,H);return}
 if(t<3.0){/* the sigil slams down */const u=t-.9;r('#0e1a0c',0,0,W,H);g.save();g.translate(W/2,cy);g.rotate(-.3);for(let i=-12;i<12;i++)r('#16260f',-W,i*28+((time*40)%28),W*2,12);g.restore();
  lines(W/2,cy-30,'rgba(126,200,80,.45)',34);lines(W/2,cy-30,'rgba(255,255,255,.16)',17);
  const k=Math.min(1,u/.35),sc=(1-k)*2.2+1+(u>.35&&u<.5?Math.sin(u*60)*.06:0),sp=time*1.2;
  g.save();g.translate(W/2,cy-30);g.scale(sc,sc);g.rotate(Math.sin(sp)*.12);
  for(let i=6;i>0;i--)disc(0,0,30+i*5,'rgba(248,224,96,'+(.05*k).toFixed(3)+')');
  g.fillStyle=K;g.beginPath();g.moveTo(0,-36);g.lineTo(30,0);g.lineTo(0,36);g.lineTo(-30,0);g.closePath();g.fill();
  g.fillStyle='#f8e060';g.beginPath();g.moveTo(0,-31);g.lineTo(25,0);g.lineTo(0,31);g.lineTo(-25,0);g.closePath();g.fill();
  g.fillStyle=SG.d;g.beginPath();g.moveTo(0,-24);g.lineTo(18,0);g.lineTo(0,24);g.lineTo(-18,0);g.closePath();g.fill();
  g.fillStyle=SG.c;g.beginPath();g.ellipse(0,0,6,15,.5,0,7);g.fill();r(SG.d,-1,-12,2,24);g.restore();
  slam(WD[0],cy+40,4,'#ffffff',1.5);slam('SIGIL',cy+72,5,'#f8e060',1.75);
  if(u>1.4)ctext0(Q.n===1?"The Ranger's barriers are down":'An alpha has the light again',cy+104,1,'#cfe0b8',null);
  if(u<.14)r('rgba(255,255,255,'+(1-u/.14).toFixed(2)+')',0,0,W,H);return}
 {/* what opens */const u=t-3.0;r('#0c1420',0,0,W,H);lines(W/2,cy,'rgba(248,224,96,.25)',30);
  if(Q.n>1){slam(OP.a,cy-30,tw0(OP.a,5)>W-16?4:5,'#ffffff',3.0);slam(OP.b,cy+8,tw0(OP.b,5)>W-16?4:5,SG.c,3.2);if(u>.6)ctext0(OP.sub,cy+48,1,'#cfe0b8',null);if(u>1.2)ctext0('A  CONTINUE',H-14,1,'#8a86a0',null);if(u<.1)r('rgba(255,255,255,'+(1-u/.1).toFixed(2)+')',0,0,W,H);return}
  slam('ROADS',cy-70,5,'#ffffff',3.0);slam('OPEN',cy-34,5,'#7ec850',3.2);
  const k=Math.min(1,u/.5),ax=Math.round(W/2+10+k*60);
  r(K,W/2-2,cy+4,ax-W/2+4,10);r('#f8e060',W/2,cy+6,ax-W/2,6);g.fillStyle='#f8e060';g.beginPath();g.moveTo(ax,cy);g.lineTo(ax+14,cy+9);g.lineTo(ax,cy+18);g.closePath();g.fill();
  const ay=Math.round(cy+20+k*50);r(K,W/2-48,cy+18,10,ay-cy-16);r('#f8e060',W/2-46,cy+20,6,ay-cy-20);g.beginPath();g.moveTo(W/2-52,ay);g.lineTo(W/2-43,ay+14);g.lineTo(W/2-34,ay);g.closePath();g.fill();
  if(u>.45){text0('EAST',ax-16,cy-14,1,'#ffffff',K);text0('CROOKED HOLLOW',Math.min(W-tw0('CROOKED HOLLOW',1)-6,ax-40),cy+24,1,'#f8e060',K);
   text0('SOUTH',W/2-30,ay+20,1,'#ffffff',K);text0("SQUIRE'S WOODS",W/2-30,ay+32,1,'#f8e060',K)}
  if(u>1.2)ctext0('A  CONTINUE',H-14,1,'#8a86a0',null);
  if(u<.1)r('rgba(255,255,255,'+(1-u/.1).toFixed(2)+')',0,0,W,H)}}
