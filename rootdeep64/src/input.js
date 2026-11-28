/* =====================================================================
   ROOTDEEP 64 — input
   Controller first. Every pad, the keyboard (two layouts) and the touch
   overlay are "devices". A device that presses A joins as the next
   player (up to 4). Menus listen to every device at once.

   Pad:   stick / d-pad move · A attack · B or X cast · any shoulder or
          trigger dash · START pause · double-tap the d-pad also dashes
   Keys1: WASD or arrows · Z/J/Space attack · X/K cast · Shift/L dash ·
          Enter pause  (arrows + , . / become player 2 once they join)
   Touch: left thumb stick · A · B · DASH · START
   ===================================================================== */
'use strict';
const BTN=['a','b','dash','start','sel','left','right','up','down'];
function mkDev(id,label){const d={id,label,mx:0,my:0,cur:{},prev:{},pr:{},live:true,rep:0,repDir:''};for(const b of BTN){d.cur[b]=false;d.prev[b]=false;d.pr[b]=false}return d}
const DEV={kb1:mkDev('kb1','KEYS'),kb2:mkDev('kb2','KEYS 2'),touch:mkDev('touch','TOUCH')};
const KEYS={};let kb2On=false,touchSeen=false,anyInput=false;
window.addEventListener('keydown',e=>{KEYS[e.code]=true;anyInput=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Slash','Enter'].includes(e.code))e.preventDefault();audioWake()});
window.addEventListener('keyup',e=>{KEYS[e.code]=false});
window.addEventListener('blur',()=>{for(const k in KEYS)KEYS[k]=false});

/* ---- touch overlay ---- */
const TS={id:-1,ox:0,oy:0,x:0,y:0,btn:{},latch:{}};
function touchInit(){const zone=document.getElementById('stickzone'),nub=document.getElementById('nub'),base=document.getElementById('stickbase');
 const woke=()=>{touchSeen=true;anyInput=true;document.body.classList.add('touch');audioWake()};
 const mv=t=>{let dx=t.clientX-TS.ox,dy=t.clientY-TS.oy;const l=Math.hypot(dx,dy),mx=44;if(l>mx){dx=dx/l*mx;dy=dy/l*mx}TS.x=dx/mx;TS.y=dy/mx;nub.style.transform='translate('+dx+'px,'+dy+'px)'};
 /* floating stick: it centres wherever the thumb lands */
 const st=e=>{woke();for(const t of e.changedTouches){if(TS.id<0){TS.id=t.identifier;TS.ox=t.clientX;TS.oy=t.clientY;const rc=zone.getBoundingClientRect();base.style.left=(t.clientX-rc.left)+'px';base.style.top=(t.clientY-rc.top)+'px';base.classList.add('on');mv(t)}}e.preventDefault()};
 const move=e=>{for(const t of e.changedTouches)if(t.identifier===TS.id)mv(t);e.preventDefault()};
 const end=e=>{for(const t of e.changedTouches)if(t.identifier===TS.id){TS.id=-1;TS.x=TS.y=0;nub.style.transform='';base.classList.remove('on');base.style.left='';base.style.top=''}e.preventDefault()};
 zone.addEventListener('touchstart',st,{passive:false});zone.addEventListener('touchmove',move,{passive:false});zone.addEventListener('touchend',end,{passive:false});zone.addEventListener('touchcancel',end,{passive:false});
 for(const el of document.querySelectorAll('[data-b]')){const b=el.dataset.b;
  const on=e=>{woke();TS.btn[b]=true;TS.latch[b]=true;el.classList.add('on');e.preventDefault()},off=e=>{TS.btn[b]=false;el.classList.remove('on');e.preventDefault()};
  el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off,{passive:false});el.addEventListener('touchcancel',off,{passive:false})}
 if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch')}

function axis(v){return Math.abs(v)<.22?0:v}
function pollInput(dt){
 const K=KEYS,k1=DEV.kb1,k2=DEV.kb2,two=kb2On;
 /* keyboard 1 (owns the arrows too until a second keyboard player joins) */
 let l=K.KeyA||(!two&&K.ArrowLeft),r=K.KeyD||(!two&&K.ArrowRight),u=K.KeyW||(!two&&K.ArrowUp),d=K.KeyS||(!two&&K.ArrowDown);
 k1.mx=(r?1:0)-(l?1:0);k1.my=(d?1:0)-(u?1:0);
 k1.cur={a:!!(K.KeyZ||K.KeyJ||K.Space),b:!!(K.KeyX||K.KeyK),dash:!!(K.ShiftLeft||K.KeyL||K.KeyC||(!two&&K.ShiftRight)),start:!!(K.Enter||K.KeyP),sel:!!(K.KeyQ||K.Escape),left:!!l,right:!!r,up:!!u,down:!!d};
 /* keyboard 2 */
 l=K.ArrowLeft;r=K.ArrowRight;u=K.ArrowUp;d=K.ArrowDown;
 k2.mx=two?(r?1:0)-(l?1:0):0;k2.my=two?(d?1:0)-(u?1:0):0;
 k2.cur={a:!!K.Comma,b:!!(two&&K.Period),dash:!!(two&&(K.Slash||K.ShiftRight)),start:!!(two&&K.Backspace),sel:false,left:!!(two&&l),right:!!(two&&r),up:!!(two&&u),down:!!(two&&d)};
 /* touch */
 const t=DEV.touch;t.mx=axis(TS.x);t.my=axis(TS.y);
 const L=TS.latch;/* a tap shorter than one frame still counts */
 t.cur={a:!!(TS.btn.a||L.a),b:!!(TS.btn.b||L.b),dash:!!(TS.btn.dash||L.dash),start:!!(TS.btn.start||L.start),sel:false,left:TS.x<-.5,right:TS.x>.5,up:TS.y<-.5,down:TS.y>.5};
 TS.latch={};
 /* gamepads */
 const pads=navigator.getGamepads?navigator.getGamepads():[];
 for(let i=0;i<pads.length&&i<8;i++){const p=pads[i],id='gp'+i;if(!p){if(DEV[id])DEV[id].live=false;continue}
  const dv=DEV[id]||(DEV[id]=mkDev(id,'PAD '+(i+1)));dv.live=true;const B=n=>!!(p.buttons[n]&&(p.buttons[n].pressed||p.buttons[n].value>.5));
  let mx=axis(p.axes[0]||0),my=axis(p.axes[1]||0);const dl=B(14),dr=B(15),du=B(12),dd=B(13);
  if(dl||dr)mx=(dr?1:0)-(dl?1:0);if(du||dd)my=(dd?1:0)-(du?1:0);
  dv.mx=mx;dv.my=my;dv.dpad=dl||dr||du||dd;
  dv.cur={a:B(0),b:B(1)||B(2),dash:B(4)||B(5)||B(6)||B(7)||B(3),start:B(9),sel:B(8),left:mx<-.5,right:mx>.5,up:my<-.5,down:my>.5};
  if(B(0)||B(9))anyInput=true}
 for(const id in DEV){const dv=DEV[id];for(const b of BTN){dv.pr[b]=dv.cur[b]&&!dv.prev[b];dv.prev[b]=dv.cur[b]}
  /* menu auto-repeat on held directions */
  const dir=dv.cur.up?'up':dv.cur.down?'down':dv.cur.left?'left':dv.cur.right?'right':'';
  if(dir&&dir===dv.repDir){dv.rep-=dt;if(dv.rep<=0){dv.rep=.13;dv.rp=dir}else dv.rp=''}else{dv.repDir=dir;dv.rep=.38;dv.rp=''}}}
/* merged menu input: any device */
function pressed(b){for(const id in DEV){const d=DEV[id];if(d.pr[b])return true;if(d.rp===b&&(b==='up'||b==='down'))return true}return false}
function pressedBy(b){for(const id in DEV)if(DEV[id].pr[b])return DEV[id];return null}
function nav(i,n){if(pressed('down')){snd(520,.04);return(i+1)%n}if(pressed('up')){snd(520,.04);return(i+n-1)%n}return i}

/* ---- players ---- */
const PL=[];const PCOL=['#ffd94d','#58c8f8','#f878a8','#8ae060'];
function devPlayer(dev){return PL.find(p=>p.dev===dev)}
function joinPlayer(dev){if(PL.length>=4||devPlayer(dev))return null;if(dev.id==='kb2')kb2On=true;
 const p={ix:PL.length,dev,char:'WILL',x:W/2,y:H/2,vx:0,vy:0,fx:1,fy:0,ax:0,ay:1,anim:0,ready:false,csel:0,hp:100,down:false,inv:0,dashT:0,swing:0};
 PL.push(p);return p}
function dropPlayer(p){const i=PL.indexOf(p);if(i<=0)return;PL.splice(i,1);PL.forEach((q,j)=>q.ix=j);if(p.dev.id==='kb2')kb2On=false}
/* a device nobody is using yet pressed A: let it in */
function pollJoin(){for(const id in DEV){const d=DEV[id];if(!d.live)continue;
  if(id==='kb2'){if(KEYS.Comma&&!DEV.kb2.prev._j&&!devPlayer(d)&&PL.length&&PL.length<4){DEV.kb2.prev._j=true;return joinPlayer(d)}DEV.kb2.prev._j=!!KEYS.Comma;continue}
  if((d.pr.a||d.pr.start)&&!devPlayer(d)&&PL.length<4){d.pr.a=false;d.pr.start=false;return joinPlayer(d)}}
 return null}
