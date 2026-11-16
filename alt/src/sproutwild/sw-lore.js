/* ================================================================
   THE STORY, TOLD A LITTLE MORE (v8.9): Will asked for more explaining
   in the intro and more scenes with the cast about the villain.
   - The intro is 8 short slides (one voice each, A to go on): the
     Lantern, the sprouts, the dim buddies, KING BIBI and his IRON DOME,
     why a dark valley suits him, Erin's hope and Marcus's plan.
   - Marcus mentions Bibi when the Lantern wakes.
   - The Elder tells you about the domes on your first visit to
     Lantern Town.
   - After Bottie shows up, Erin and Marcus talk about King Bibi.
   ================================================================ */
WSTORY.length=0;WSTORY.push(
 {sc:0,who:'',t:'The Great Lantern hung over the valley and everything grew. Then, one night, it cracked.'},
 {sc:1,who:'',t:'Its light fell as seeds, and the seeds grew legs: SPROUTS, the little plant folk.'},
 {sc:3,who:'',t:"Without the light the valley's wild BUDDIES went dim. Sprouts can carry the light back to them."},
 {sc:5,who:'KING BIBI',t:'Citizens. For thirty years I have warned you: the light is weeks away. Hence, my IRON DOME.',acc:'#1e2c5a'},
 {sc:5,who:'',t:"King Bibi walled the valley's roads with IRON DOME posts. 'Temporary,' he said. They never came down."},
 {sc:5,who:'KING BIBI',t:'A dark valley needs a strong king. Stay home. Stay dim. Trust the dome.',acc:'#1e2c5a'},
 {sc:2,who:'ERIN',t:'One patch of soil at Sunkeep still grows, keeper. Light the Lantern and his domes lose their grip.'},
 {sc:4,who:'MARCUS',t:"Four gyms, four Sigils, bro. Each one opens a road. Then we knock on the King's dome. I supervise."});
/* first visit to Lantern Town: the Elder explains what the domes did */
function loreTown(){const F=W4.fld;if(!F||F.id!=='TOWN'||SW.lessons.scTown||W4.scene||state!=='g4world'||(W4.banner&&W4.banner.t>0))return;
 SW.lessons.scTown=1;scStart([
  {who:'ELDER',txt:'Welcome to Lantern Town, keeper. We were the brightest street in the valley once.'},
  {who:'ELDER',txt:'Then King Bibi put up his IRON DOMES. Roads shut. Trade stopped. The light stopped.'},
  {who:'ELDER',txt:"The Ranger kept our one road open, the one you walked in on. Win her Sigil and she'll open more."}],()=>swSave())}
/* after Bottie's visit: Erin and Marcus on the King */
function loreBibi(){if(W4.fld||W4.sector!=='BASE'||!SW.bottieSeen||SW.lessons.scBibi||W4.scene||state!=='g4world')return;
 W4.bibiT=(W4.bibiT||0)+1;if(W4.bibiT<90)return;SW.lessons.scBibi=1;scStart([
  {who:'ERIN',txt:"That robot gives me the creeps. And it isn't even the worst thing out there."},
  {who:'MARCUS',txt:"King Bibi, bro. Thirty years of 'the light is weeks away.' Weeks."},
  {who:'ERIN',txt:"Every road he domes off is a road the light can't reach. A dark valley keeps him king."},
  {who:'MARCUS',txt:'Four Sigils and we walk right up to his dome. I do the talking, you do the battling. Dap me up.'}],()=>swSave())}
