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
FMAPS.MEADOW.key.A.lv=7;
/* an alpha given the light gives up its Sigil */
function alphaSigil(sp){const S=WASIG[sp];if(!S||SW.badges.includes(S.n))return;SW.badges.push(S.n);W4.sigilQ={sp,n:SW.badges.length};swSave()}
/* trainers talk now; the King lowers the dome for four Sigils */
const WTRTALK={KISS:[['KISS: Hey. Keeper. One question.','Three thousand years ago this valley was promised to sprouts and buddies. Who keeps a promise that long?'],'KISS: The light, I guess. Bring it back and ask me again.'],
 DEREK:[['DEREK: Yo! The Flow Pros truck died. Again.','Wild buddies chased me off the road. Your sprouts calm them down? Wild.'],'Tell Marcus the truck is, uh, fine.'],
 MAMA:[['MAMA: I have been up since four, keeper.','The buddies on this beach used to bring me shells. Now they hiss. Bring them the light, will you?'],'MAMA: And eat something. You look thin.'],
 'DOME GUARD':[["DOME GUARD: Halt. King's orders: the dome stays up till the valley is safe.",'Bring the light to the four alphas. Four Sigils, and the King might listen.'],'The IRON DOME only drops for the King. He sits in the Gloom.']};
function fChallenge(F,np){
 if(np.boss){if(SW.badges.length>=4){fTalk(F,'KING BIBI',['KING BIBI: Four Sigils. Four alphas, lit. ...The buddies are calm again?','Fine. FINE. The dome comes down. Order is restored. I was always going to do this.',"Bottie is up the Peak road. Go unplug that robot, keeper. And knock first."],()=>{SW.fl[np.fk]=1;SW.fl.bibi=1;swSay('The IRON DOME flickers out across the valley. The Peak road is open!',3.4);swSnd(523,.3,1046);swSave()})}
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
const WNEXT=['Meadow ALPHA (behind the boulder wall): bring it the light','Bring the light to an ALPHA: Crooked Hollow or Squire\'s Woods','Next ALPHA: Crooked Hollow or Squire\'s Woods','Gloom Hollow ALPHA (Town, the Shore, then Gloom)','King Bibi waits in Gloom Hollow: show him 4 Sigils'];
function wGymGoal(){if(SW.quest<5)return null;if(SW.fl.bibi)return SW.bottieBeat?null:"Bottie's tower is on the Peak. End this.";
 const n=SW.badges.length;if(n===0){const L=Math.max(0,...SW.party.map(m=>m.lv));if(L<8)return'Meadow ALPHA is Lv7: train to Lv8 (SELECT)'}return WNEXT[Math.min(n,4)]}
