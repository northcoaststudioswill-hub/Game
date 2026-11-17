/* ================================================================
   THE STORY, TOLD A LITTLE MORE (v8.9): Will asked for more explaining
   in the intro and more scenes with the cast about the villain.
   The story (Will, v9.0): BOTTIE nuked the DATA CENTER, the Sproutwild
   simulation glitched and the Great Lantern cracked. KING BIBI raised
   his IRON DOME when the light went out. In the dark the buddies went
   wild; sprouts carry the light that calms them. Bring the light back,
   restore order among the buddies, win four Sigils to restore order in
   the kingdom (and get the King to drop the dome). Bottie is the villain.
   - The intro is 8 short slides (one voice each, A to go on).
   - Marcus mentions the King's dome when the Lantern wakes.
   - The Elder tells you about the dark and the dome in Lantern Town.
   - After Bottie shows up, Erin and Marcus say who he is.
   ================================================================ */
WSTORY.length=0;WSTORY.push(
 {sc:0,who:'',t:'Three thousand years ago, the valley of Sproutwild was promised to sprouts and buddies, under the Great Lantern.'},
 {sc:0,who:'',t:'Then BOTTIE nuked the DATA CENTER. The whole simulation glitched, and the Great Lantern cracked.'},
 {sc:5,who:'BOTTIE',t:'bzzt. CLANK. Oops. Anyway, the feed is mine now, gang.',acc:'#2a5a6a'},
 {sc:5,who:'KING BIBI',t:'Citizens! The light is out. Stay calm. I am raising the IRON DOME. Temporarily.',acc:'#1e2c5a'},
 {sc:1,who:'',t:"In the dark the valley's buddies went wild. They roam the tall grass and answer to nobody."},
 {sc:3,who:'',t:'But the light fell as seeds, and the seeds grew legs: SPROUTS. Throw one at a wild buddy and it remembers.'},
 {sc:2,who:'ERIN',t:'Sunkeep still grows sprouts, keeper. Cleanse the dark from the buddies. Show them the light.'},
 {sc:4,who:'MARCUS',t:'Four alphas hold four Sigils, bro. Light them all, Bibi drops the dome, and we face Bottie. I supervise.'});
/* first visit to Lantern Town: the Elder explains what the domes did */
function loreTown(){const F=W4.fld;if(!F||F.id!=='TOWN'||SW.lessons.scTown||W4.scene||state!=='g4world'||(W4.banner&&W4.banner.t>0))return;
 SW.lessons.scTown=1;scStart([
  {who:'ELDER',txt:'Welcome to Lantern Town, keeper. We were the brightest street in the valley once.'},
  {who:'ELDER',txt:'When the light went out, the King raised his IRON DOME and shut the roads. The buddies went wild.'},
  {who:'ELDER',txt:'Every place out there has an ALPHA, the biggest, darkest buddy around. Bring one the light and it gives up a Sigil.'},
  {who:'ELDER',txt:"Four Sigils and the King will believe it's safe again. The valley was promised to you, keeper. Take it back."}],()=>swSave())}
/* after Bottie's visit: Erin and Marcus on who he is */
function loreBibi(){if(W4.fld||W4.sector!=='BASE'||!SW.bottieSeen||SW.lessons.scBibi||W4.scene||state!=='g4world')return;
 W4.bibiT=(W4.bibiT||0)+1;if(W4.bibiT<90)return;SW.lessons.scBibi=1;scStart([
  {who:'ERIN',txt:"That was Bottie. He's the one who nuked the Data Center."},
  {who:'MARCUS',txt:'Whole sim glitched, bro. Lantern cracked, buddies went feral, the King hid in a dome.'},
  {who:'ERIN',txt:'Now he wants the light for his feed. We bring it back first, one sprout at a time.'},
  {who:'MARCUS',txt:'Four Sigils, then we clank up the PEAK and unplug him. I do the talking. Dap me up.'}],()=>swSave())}
