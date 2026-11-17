/* ================================================================
   PACING (v8.5): nothing you are told disappears before you can read it
   - A message stays up for at least its reading time. Anything said
     while it is up waits its turn (a queue), and anything said during
     a scene waits until the scene is over.
   - Scenes and the cottage cinematic wait until the message on screen
     (and any waiting behind it) has been read, then start.
   - The catch cinematic is the reward for the catch, so it does not
     wait; it only clears a stale "Latched on" line.
   ================================================================ */
function swReadT(s){return 1.4+String(s).length*.055}
function swSay(s,t){s=String(s);const need=Math.max(t||2.2,swReadT(s));W4.msgQ=W4.msgQ||[];
 if(W4.msgT>0&&W4.msg===s){W4.msgT=Math.max(W4.msgT,need*.6);return}            /* already on screen */
 if(W4.msgQ.some(q=>q.s===s))return;                                           /* already waiting */
 if(W4.scene||(W4.fld&&W4.fld.dlg)||W4.talk||(W4.quips&&W4.quips.length)||W4.scPend&&W4.scPend.length||(W4.msgT>0&&time-(W4.msgAt||0)<(W4.msgMin||0))){if(W4.msgQ.length<5)W4.msgQ.push({s,t:need});return}
 W4.msg=s;W4.msgT=need;W4.msgAt=time;W4.msgMin=Math.min(need,1.2+s.length*.045)}
function swBusy(){return W4.msgT>0||(W4.msgQ&&W4.msgQ.length)}
/* called every world frame (scAuto): next message, then a waiting scene */
function swMsgPump(){if(W4.ringPend&&state==='g4world'){const m=W4.ringPend;W4.ringPend=null;swSay(m,3.6);swSnd(784,.12,1568)}{const F=W4.fld;if(F&&F.dlgPend&&!F.dlg&&!W4.scene&&!swBusy()){F.dlg=F.dlgPend;F.dlgPend=null;return}}
 if(W4.scene||(W4.fld&&W4.fld.dlg)||W4.talk||(W4.quips&&W4.quips.length))return;W4.msgQ=W4.msgQ||[];
 if(W4.msgT>0)return;
 if(W4.scPend&&W4.scPend.length){const p=W4.scPend.shift();if(p.dab)dabGo();else scGo(p.steps,p.done);return} /* v8.9: a waiting scene goes before messages not yet shown */
 if(W4.msgQ.length){const q=W4.msgQ.shift();W4.msg=q.s;W4.msgT=q.t;W4.msgAt=time;W4.msgMin=Math.min(q.t,1.2+q.s.length*.045);return}
 if(false){const p=W4.scPend.shift();if(p.dab)dabGo();else scGo(p.steps,p.done)}}
function scStart(steps,done){if(SCOFF){for(const s of steps)if(s.fn)s.fn();if(done)done();return}
 W4.scPend=W4.scPend||[];const sig=scSig(steps);
 if((W4.scene&&W4.scene.sig===sig)||W4.scPend.some(p=>p.sig===sig))return;       /* the same scene is already playing or waiting */
 if(W4.scene||swBusy()||W4.scPend.length){W4.scPend.push({steps,done,sig});return} /* waits its turn, in order */
 scGo(steps,done)}
function scSig(steps){return steps.map(s=>(s.who||'')+(s.txt||'')).join('|')}
function scGo(steps,done){W4.scene={steps,i:-1,t:0,x:P3.x,y:P3.y,done,sig:scSig(steps)};W4.talk=null;W4.quips=[];W4.quipQ=[];scNext()}
function dabStart(){SW.lessons.scDab=1;if(!(typeof KO!=='undefined'&&KO&&KO._)){scDab();return}
 W4.scPend=W4.scPend||[];if(W4.scPend.some(p=>p.dab))return;
 if(W4.scene||swBusy()||W4.scPend.length){W4.scPend.push({dab:1,sig:'dab'});return}dabGo()}
function dabGo(){W4.dabC=0;W4.talk=null;W4.quips=[];W4.quipQ=[];state='g4dab';swSave()}
function wCineMon(sp,sub){if(W4.msg&&/Latched|SHOOK|Fill the bar/i.test(W4.msg))W4.msgT=0;W4.cine={kind:'mon',id:sp,sub:sub||'',t:0};state='g4cine';swSnd(523,.1,784)}
/* the Ranger's barrier on the roads to the Hollow and Squire's Woods, until the first Sigil (v8.5) */
function fBarrierDraw(F){if(SW.badges.length>=1)return;for(const e of F.exits){if(e.to!=='HOLLOW'&&e.to!=='SQUIRE')continue;const x=e.tx*FT,y=e.ty*FT;
 r('#5a3a1e',x+1,y+2,3,13);r('#5a3a1e',x+12,y+2,3,13);
 for(let i=0;i<2;i++){const by=y+4+i*6;r('#f4ecd8',x-1,by,18,3);for(let k=0;k<18;k+=6)r('#c84030',x-1+k,by,3,3)}
 r('#14101e',x+5,y-6,6,6);r('#ffd94d',x+6,y-5,4,4)}}
/* field dialogue (Erin, trainers) waits for the message on screen too */
function fTalk(F,who,lines,after){const d={who,lines,i:0,after};if(!SCOFF&&swBusy()&&!F.dlg){F.dlgPend=d;return}F.dlgPend=null;F.dlg=d}
/* v8.7: after the cottage and the first crop, the game points you at the Ranger's gym */
function scGymCheck(){if(SCOFF||W4.fld||W4.sector!=='BASE'||SW.quest<5||SW.badges.length||SW.lessons.scGym||state!=='g4world'||!SW.buildings.some(b=>b.k==='cottage'))return; /* v8.9: cottage and a crop are enough (the garden lesson can come after) */ /* queued right away: it plays as soon as the crop line has been read */SW.lessons.scGym=1;
 scStart([{who:'ERIN',txt:'Sunkeep has a roof and a garden. Now the real work: the dark out there.'},
  {who:'MARCUS',txt:'Every place has an ALPHA, bro. Biggest, darkest buddy around. Ours sleeps behind the boulder wall.'},
  {who:'ERIN',txt:'Bring an alpha the light and it gives up a SIGIL. Four Sigils, and King Bibi lowers the dome.'},
  {who:'MARCUS',txt:'Meadow alpha is Lv'+FMAPS.MEADOW.key.A.lv+'. Battle wilds with SELECT till your lead is Lv'+FMAPS.MEADOW.key.A.lv+'. Then throw sprouts. See one, light one.'}],()=>swSave())}
function wGymGoal(){if(SW.quest<5||SW.badges.length)return null;const L=Math.max(0,...SW.party.map(m=>m.lv));
 const T=Math.max(...WGYMS[0].team.map(t=>t[1]))+1;return L<T?'Ranger gym, north road: train to Lv'+T+' (SELECT)':"Lantern Town (north road): win the Ranger's Sigil"}
