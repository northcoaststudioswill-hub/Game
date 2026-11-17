/* ================================================================
   BRING THE LIGHT (v9.1): Will's design. No gyms, no trainer battles.
   You battle wild buddies and ALPHAS to cleanse the dark and show them
   the light. Each of the four alphas, once it has the light, gives up
   a SIGIL. Four Sigils and King Bibi lowers his IRON DOME; then Bottie,
   once and for all. Sprouts matter in battle: a throw that does not
   bloom still burns away some of the dark.
     BLOOMBOAR (Meadow)          VERDANT SIGIL   opens the Hollow, Squire's Woods, the Wastes
     PYTHORN   (Crooked Hollow)  ROOT SIGIL   \
     STONESQUIRE (Squire's Woods) STONE SIGIL  /  two Sigils open the Shore, three Gloom Hollow
     AURICORN  (Gloom Hollow)    GOLD SIGIL      the King will see you
   ================================================================ */
const WASIG={BLOOMBOAR:{n:'VERDANT SIGIL',c:'#7ec850',d:'#3a8a32'},PYTHORN:{n:'ROOT SIGIL',c:'#c89058',d:'#6a4a2a'},
 STONESQUIRE:{n:'STONE SIGIL',c:'#c8ccd4',d:'#6e7280'},AURICORN:{n:'GOLD SIGIL',c:'#f8e060',d:'#b07808'}};
/* the Meadow alpha is the first real test: a little gentler */
FMAPS.MEADOW.key.A.lv=6; /* simulated: every starter at Lv6 with a Lv4 buddy wins 3/3 */
/* an alpha given the light gives up its Sigil */
function alphaSigil(sp){const S=WASIG[sp];if(!S||SW.badges.includes(S.n))return;SW.badges.push(S.n);W4.sigilQ={sp,n:SW.badges.length};swSave()}
/* trainers talk now; the King lowers the dome for four Sigils */
const WTRTALK={KISS:[['KISS: Hey. Keeper. One question.','Three thousand years ago this valley was promised to sprouts and buddies. Who keeps a promise that long?'],'KISS: The light, I guess. Bring it back and ask me again.'],
 DEREK:[['DEREK: Yo! The Flow Pros truck died. Again.','Wild buddies chased me off the road. Your sprouts calm them down? Wild.'],'Tell Marcus the truck is, uh, fine.'],
 MAMA:[['MAMA: I have been up since four, keeper.','The buddies on this beach used to bring me shells. Now they hiss. Bring them the light, will you?'],'MAMA: And eat something. You look thin.'],
 'DOME GUARD':[["DOME GUARD: Halt. King's orders: the dome stays up till the valley is safe.",'Bring the light to the four alphas. Four Sigils, and the King might listen.'],'The IRON DOME only drops for the King. He sits in the Gloom.']};
function fChallenge(F,np){
 if(np.boss){if(SW.badges.length>=4&&(SW.shown||0)<WSHOWN){fTalk(F,'KING BIBI',['KING BIBI: Four Sigils! Splendid. Splendid. But I looked out the window.','The buddies out there are still wild, keeper. '+(SW.shown||0)+' calmed. I need '+WSHOWN+' before I drop a single bolt.']);return}
  if(SW.badges.length>=4){fTalk(F,'KING BIBI',['KING BIBI: Four Sigils. Four alphas, lit. ...The buddies are calm again?','Fine. FINE. The dome comes down. Order is restored. I was always going to do this.',"Bottie is up the Peak road. Go unplug that robot, keeper. And knock first."],()=>{SW.fl[np.fk]=1;SW.fl.bibi=1;swSave();if(SCOFF){swSay('The IRON DOME flickers out across the valley. The Peak road is open!',3.4);return}W4.domeT=0;W4.domeP=0;state='g4dome';swSnd(523,.3,1046)})}
  else fTalk(F,'KING BIBI',['KING BIBI: Ah. The little keeper. Sit. I have brought a chart.','This is the Lantern. This is the night the robot nuked the Data Center. I drew it myself. With a marker.','The valley was promised to sprouts and buddies three thousand years ago. Then: dark. So: dome.','Bring the light to the four alphas. Four Sigils, and the dome comes down. You have '+SW.badges.length+'.']);return}
 const t=WTRTALK[np.who]||[np.pre||['...'],np.after||'...'];fTalk(F,np.who,t[0].concat([t[1]]),()=>{SW.fl[np.fk]=1;swSave()})}
/* the gym buildings are lodges now; the Peak's is Bottie's tower and the last battle */
const WLODGE={TOWN:"RANGER: No battles at my lodge, keeper. Bring the light to the Meadow's alpha. That is the real test.",
 WASTES:"MARCUS: Gym's closed, bro. I'm in lighting now. Go light up some alphas.",SHORE:'ERIN: No battles here. Every alpha you bring the light to gives up a Sigil.'};
function gymTalk(sec){if(sec.id==='PEAK'){if(SW.badges.length>=4&&SW.fl.bibi){W4.gymIx=5;W4.gymPage=0;swSel=0;state='g4gym'}else swSay("BOTTIE'S TOWER. A sign: NO VISITORS WITHOUT FOUR SIGILS. bzzt.",3);return}
 swSay(WLODGE[sec.id]||'The lodge is quiet.',3.4)}
/* sprouts matter in battle: a throw that does not bloom still burns away some of the dark */
function wLightBurn(nS){const foe=BT.foe,mx=wStats(foe).max,kin=wKinship(BT.tossIx||0,foe.sp)>1?2:1,d=Math.max(1,Math.round(mx*.05*nS*kin));if(foe.hp>1){foe.hp=Math.max(1,foe.hp-d);return d}return 0}
/* goals: the alphas are the way */
const WNEXT=['Light the Meadow ALPHA (boulder wall)','Next ALPHA: the Hollow or Squire\'s','Next ALPHA: the Hollow or Squire\'s','Light the Gloom Hollow ALPHA','Show King Bibi 4 Sigils (Gloom)']; /* v9.2: short enough for the goal bar */
function wGymGoal(){if(SW.quest<5)return null;if(SW.fl.bibi)return SW.bottieBeat?null:"Bottie's tower is on the Peak. End this.";
 const n=SW.badges.length;if(n>=4&&(SW.shown||0)<WSHOWN)return'Calm '+WSHOWN+' wild buddies ('+(SW.shown||0)+'/'+WSHOWN+')';if(n===0){const L=Math.max(0,...SW.party.map(m=>m.lv)),A=FMAPS.MEADOW.key.A.lv;if(L<A)return'ALPHA is Lv'+A+': train to Lv'+A+' (SELECT)'}return WNEXT[Math.min(n,4)]}
/* v9.2 LIGHT SHOWN: every wild buddy you calm (a battle won or a bloom) counts.
   The King wants a calm valley, not just four Sigils: WSHOWN calmed buddies.
   Every 10 the Great Lantern grows a ring (a little celebration and +3 hearts). */
const WSHOWN=20;
/* each ring gives the keeper a gift (v9.2: what Erin and Marcus used to give as keepers) */
const WRING={1:'GREEN HANDS, +1 from every harvest.',2:'WARM LIGHT, buddies heal a little after each win.',3:'BIG HEART, buddies hit 12% harder.'};
function wShowLight(){SW.shown=(SW.shown||0)+1;const n=SW.shown;
 if(n%10===0){SW.hearts=(SW.hearts||0)+3;SW.heartsTotal=(SW.heartsTotal||0)+3;const gift=WRING[n/10]||'+3 hearts',m=n+' buddies shown the light! The Great Lantern grows a ring: '+gift;if(state==='g4world'){swSay(m,3.6);swSnd(784,.12,1568)}else W4.ringPend=m} /* v9.4: said in a battle, it waits till you are back out */
 else if(W4.floats)W4.floats.push({x:P3.x,y:P3.y-30,txt:'LIGHT SHOWN '+n,t:1.6,c:'#ffd94d'})}
/* v9.4: the dome comes down, as a cinematic. A pages through, B skips */
const WDOME=[{who:'KING BIBI',t:'...Lower it. All of it. Yes, the whole thing. I am sure. Mostly.',acc:'#1e2c5a'},
 {who:'',t:'The IRON DOME flickers, thins, and folds away into the dawn. The roads of the valley are open.'},
 {who:'BOTTIE',t:'bzzt. ...The dome is down? Uh oh. I mean: COME AT ME, GANG.',acc:'#2a5a6a'},
 {who:'ERIN',t:"That's it, keeper. Bottie's tower is up the Peak road. Let's finish this."}];
function domeUpdate(dt){W4.domeT=(W4.domeT||0)+dt;if(pressed('b')){state='g4world';swSay('The Peak road is open!',2.6);return}
 if(pressed('a')&&W4.domeT>.6){W4.domeP=(W4.domeP||0)+1;W4.domeT=Math.min(W4.domeT,3);swSnd(660,.05);if(W4.domeP>=WDOME.length){state='g4world';swSay('The Peak road is open!',2.6)}}}
function drawDome(){const p=Math.min(W4.domeP||0,WDOME.length-1),S=WDOME[p],gy=H-78,t=(W4.domeP?3:0)+(W4.domeT||0);ox=0;oy=0;
 const dawn=Math.min(1,Math.max(0,(t-1.6)/2));uiSky(dawn<.5?['#0c0a20','#241f44','#3d3760','#5a4a80']:['#2a3a6a','#7a6aa0','#e0a080','#f8d8a0'],gy);if(dawn<.5)uiStars(30,gy-30,5);
 uiHills(gy,20,dawn<.5?'#241f36':'#4a4a6a',1.9,1.5);r(dawn<.5?'#262244':'#3f5a3a',0,gy,W,H);
 const rad=Math.round(96*Math.max(0,1-t/2.4));
 if(g.beginPath&&rad>2){g.save();g.beginPath();g.rect(0,0,W,gy);g.clip();g.globalAlpha=.2*(rad/96)+.05;g.fillStyle='#58a0f0';g.beginPath();g.arc(W/2,gy,rad,0,6.3);g.fill();
  g.globalAlpha=.8;g.strokeStyle='#b0e0f8';g.lineWidth=1;g.beginPath();g.arc(W/2,gy,rad,0,6.3);g.stroke();g.restore();g.globalAlpha=1}
 if(t<3.2)for(let i=0;i<18;i++){const k=Math.min(1,t/2.4),a=i*.35+.2,rd=rad+k*40+((i*13)%20);const x=Math.round(W/2+Math.cos(a+Math.PI)*rd),y=Math.round(gy-Math.abs(Math.sin(a))*rd);if(y<gy){g.globalAlpha=Math.max(0,1-t/3.2);r(i%2?'#b0e0f8':'#fff3b0',x,y,2,2);g.globalAlpha=1}}
 if(dawn>0)uiRays(W/2,gy-10,140,10,'#ffd94d',.08*dawn);
 fFort(W/2,gy+8);fChibi(W/2,gy+18,FLOOK['KING BIBI'],[0,1],false);fChibi(W/2-40,gy+16,FLOOK['DOME GUARD'],[0,1],false);fChibi(W/2+40,gy+16,FLOOK['DOME GUARD'],[0,1],false);
 if(p===2){const by=Math.round(gy*.30+Math.sin(time*1.4)*2);g.globalAlpha=.14+.06*Math.sin(time*5);r('#7ee7ff',W-66,by-30,40,34);g.globalAlpha=1;wChar('BOTTIE',W-46,by,30)}
 if(p===3)fChibi(W/2-80,gy+18,Object.assign({},FLOOK.ERIN,{sc:2}),[1,0],false);
 r('#000000',0,0,W,9);ctext('THE DOME COMES DOWN',1,1,'#ffd94d',null);
 if(t>1||p>0)uiSay(S.who,S.t,(p===0?t-1:W4.domeT)*60,'A  NEXT · B  SKIP',S.acc)}
