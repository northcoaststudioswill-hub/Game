#!/usr/bin/env python3
"""Builds index.html for the Grok Fable Astra State of the Game, Version 31.
Same inspection-sheet layout as the Version 14 report (kept unchanged in ../2026-11-20-state-of-the-game/),
so the two read side by side. Counts come from the running build (window.__gfa) on 20 November 2026; grades are judgment."""
import html, os
HERE = os.path.dirname(os.path.abspath(__file__))
PTS = {'A': 4, 'A−': 3.7, 'B+': 3.3, 'B': 3, 'B−': 2.7, 'C+': 2.3, 'C': 2, 'C−': 1.7, 'D+': 1.3, 'D': 1}
OLD_URL = 'https://claude.ai/artifact/PBfsy6Vtm7wvySHNGfBTUh'
GAME_URL = 'https://claude.ai/artifact/HeBBfxtQ7BCxjN6DNrLWDS'

# (group, [(grade, was-at-v14 or None, name, priority, evidence, raise-it)])
GRADES = [
 ('Play', [
  ('A−', 'B', 'Movement and platforming', 'High', 'Double jump, a poop boost per jump on charges, a dash, a swinging grapple that only catches grapple points and ring tops, a ground slam, and a held Lag Spike that slows the world. 462 platforms. Mount Skill Issue has no checkpoints and was climbed end to end by a scripted climber; Swing-O-Rama was swung end to end.', 'Nobody has played any of it by hand. Tune swing momentum, slam speed and the mountain gaps on a real pad.'),
  ('B−', 'C+', 'Combat', 'High', 'Every playable character has their own blast, a special on Y and a move on B; twelve item-box power-ups; pit gates, reply-guy fights and the boss. Enemies still mostly walk at you.', 'Give enemies two or three behaviours each, so the new kits have something to be clever against.'),
  ('B+', 'B+', 'Boss and endings', 'Medium', 'Unchanged since Version 14: the Algorithm, ROT x1000, the Last Grass, Meme Mountain, the First Post. Still the strongest single run of the game.', 'A short scene where the cast you have played as shows up at the First Post.'),
  ('A', 'A−', 'Exploring and collecting', 'Low', '33 named places plus four pocket worlds and a sky course. On top of the old 67s, drops, fragments and buddies: 16 rings to thread, 12 NPC looks, 12 NPC words, 60 item boxes, 74 codex entries, 99 checklist goals.', 'A map screen with what is left in each place. The collection is now big enough that players will need it.'),
  ('A−', 'B', 'Side content', 'Medium', 'Nine gates in the pit, a coalition of runaway chairs, the Recount-O-Matic, David\'s loans and prophecies, ten podcast episodes and a personal audit, the giant debate, the livestream, the loosh pumps, the facility, the maze, the nuked patch, the pile-on.', 'Tie two or three of these into the main story so they are not all optional detours.'),
  ('A−', None, 'Playable cast and squad', 'Medium', 'Nine characters unlock by finishing their quest and fetching their tower item. Pick four in the pause menu, swap with Z / D-pad right / 🎭. Each has a model, a passive, a blast, a special, a B move, and three have their own dash.', 'Let each character say something when you swap to them, and give the squad a reason to swap mid-fight.'),
 ]),
 ('World and writing', [
  ('A−', 'A−', 'Writing and jokes', 'Low', 'The voice has held across 17 more versions: dry, specific, never explains the joke. Bobby\'s audit reads your real save; the Pile-On\'s cycle ends on the timeline cancelling the colour beige.', 'Mark the lines tied to this year\'s memes so they are easy to swap later.'),
  ('A−', 'B+', 'The crossover cast', 'Low', 'Lore conversations in each character\'s voice from the other games, Kael in his Guttercrown model, David as the Oracle on a gold throne, Bessie, Marc, the Hum, and all nine playable.', 'Second scenes after each quest, so the world changes when you help.'),
  ('B', 'B', 'Story', 'Medium', 'The spine is the same three escalating endings. Most of what was added is side content with its own small story.', 'One thread through the new places, for example the Hum and the facility leading into the Meme Mountain ending.'),
  ('B−', None, 'Satire and parody', 'High', 'Parodies under new names: Bobby Screwdriver, Byron Pains, Big Eth, the Scroll Farm\'s loosh company, the facility. Funny and on-target about the attention economy and pile-ons.', 'The targets are recognisable real people. Fine for a free joke page; get a second opinion before anything is sold. See the content section.'),
 ]),
 ('Presentation', [
  ('A−', 'A−', 'Look', 'Low', 'Still loud on purpose and consistent: the nuked, glitching Sprout Patch, the phone wall with live feeds, the gold throne, the giant.', 'A reduce-flashing setting. This is also a safety item.'),
  ('A−', 'B+', 'NPC, the hero', 'Low', 'He has a name now, twelve looks earned around the world (chrome with clinking feet, gold with orbiting 67s, a headset, a beanie…) and twelve words he learns from the checklist.', 'Show the current look in his floating name tag straight away; it only updates on his next re-render.'),
  ('B+', 'B', 'Buddies, sprouts and Louie', 'Low', 'Louie is a rig with legs, tail and ears; one follower at a time; twelve throwable sprouts that fetch seeds, hit enemies and grab floating 67s.', 'Give caught buddies one small job each.'),
  ('C+', 'B−', 'Screen layout', 'High', 'More on screen than ever: item slot, follower chip, debt chip, lag bar, mountain chip, pit chip, quest list, toasts, compass, ads. On a phone the right column now holds five touch buttons.', 'Decide what each mode needs and hide the rest. Test on a phone first.'),
  ('I', 'I', 'Sound and music', 'High', 'Still generated in code and still never heard.', 'Listen to it on a phone and on speakers.'),
 ]),
 ('Platform', [
  ('B−', 'B−', 'Phone', 'High', 'New touch buttons for throw, squad, lag and power-ups; the pause menu fits at phone width. Never run on a real phone.', 'Ten minutes on a real phone.'),
  ('I', 'I', 'Controller', 'High', 'Every button is now mapped, including RB grapple, held LT, B and the D-pad. No pad has ever been plugged in.', 'Plug one in.'),
  ('C−', 'C', 'Performance', 'High', 'One 628 KB file, 1,697 colliders, 462 platforms, live canvas screens at the Scroll Farm and podcast, a 34-person crowd, three pocket worlds in the sky. Unmeasured.', 'Measure frames per second on a mid-range phone; add a low-detail setting; only update far-away areas when near.'),
  ('B', 'B', 'Saving', 'Low', 'Saves on the device; about thirty new fields since Version 14 default safely on old saves. Still one slot and no version number.', 'Version the save.'),
 ]),
 ('Under the hood', [
  ('D+', 'C−', 'Code health', 'High', 'Thirty acts layered on each other and 121 wrapped-function chains. Three bugs today came from that: the mountain jump cap, grapple points placed 1,800 m up, and two name clashes.', 'Stop and refactor before the next big feature: fold the wrap chains, split by act.'),
  ('C', 'C', 'Testing', 'High', 'About twenty scripted play-throughs exist and caught most of today\'s bugs. They live in a scratchpad, not the repo.', 'Move them into the repo with one command to run them.'),
 ]),
 ('Release', [
  ('D', 'D', 'Release readiness', 'High', 'All the Version 14 blockers remain (title, King Bibi, flashing, emoji licences, no hardware test), plus three parodies of real people.', 'Work the release list below in order.'),
 ]),
]

NEW = [
 ('16:41', 'Louie animates properly; followers stay for a little while', 'Louie rebuilt as a rig; buddies, sprouts and Louie follow for 45 seconds; the stuck pet prompt fixed.'),
 ('17:17', 'NPC, the Warp Ring, three new places, Kael from the pit, a codex', 'The hero is named NPC. The Warp Ring. The North Light, the Lamp Market Pit, the Data Center. The Aura Maze and the Sprout Patch. Kael in his Guttercrown model. A pause menu with collection, codex, cast and controls. Lore dialogue. The first collision pass.'),
 ('17:22', 'The Sprout Patch after the nuke; David as the Oracle', 'The patch becomes a war-torn, glitching crater from lil Bottie\'s missed nuke, with his recording. David in his Guttercrown look and voice.'),
 ('17:32', 'David\'s gold, giant throne and aura loans', 'A 15 m gold throne, a gold pile, aura loans at 67% a minute.'),
 ('17:34', 'David, the oracle who is better than everyone', 'Prophecies that give real directions and roast the cast.'),
 ('18:03', 'The Scroll Farm', 'A wall of live fake-video phones and the loosh farm run by LOOSH & CO.'),
 ('18:27', 'Item boxes, power-ups, solid buildings', 'Sixty boxes, twelve power-ups from the other games, and a collision pass over every large building.'),
 ('18:31', 'Bobby Screwdriver\'s podcast studio', 'Ten episodes and an audit of your real save.'),
 ('21:36', 'The Idiot Debate and the NPC Livestream', 'Byron Pains, forty feet tall; six NPC streamers.'),
 ('21:42', 'The facility under the Peak; playing as the cast', 'Sixteen runners on hamster wheels; nine playable characters.'),
 ('21:49', 'Squad switching, Election Night, Mount Skill Issue', 'Pick four and swap; King Bibi\'s chairs and recounts; a no-checkpoint mountain.'),
 ('21:53', 'NPC\'s wardrobe and words', 'Twelve looks and twelve words.'),
 ('22:14', 'A swinging grapple, solid rings, Swing-O-Rama', 'The hook stops cheesing platforming; rings become solid and threadable; a course in the sky.'),
 ('22:18', 'A moveset for every playable character', 'Blasts and specials from their canon.'),
 ('22:27', 'RB grapples; the form switcher is gone', 'Frog, rock and cloud removed. Grapple heights fixed.'),
 ('22:30', 'LT lag spike; B slams and yells', 'Hold to slow the world; slam down from the air.'),
 ('22:32', 'B moves and dashes for the cast', 'Nine B moves and three dashes.'),
 ('22:51', 'The Pile-On', 'A cancel-culture stage with a phone-headed mob.'),
]
OLDCOMMITS = [('06:11','A 3D brain-rot adventure'),('06:40','The North Coast cast crosses over'),('06:58','A story, places to explore, buddies and sprouts'),('07:08','More rot, more moments with the cast'),('07:22','Missions, the Slop Pass, a checklist and hats'),('07:30','Flight, the sky, The Cloud and sixty-seven 67s'),('11:21','The slop economy, chrome, memes and generated levels'),('11:30','Smoother buddies, and Ribbert the based frog'),('11:38','The Fringe'),('11:47','The Smart Home and the social rating'),('11:52','ROT x1000'),('12:14','The Red String Arc'),('12:43','The outer ring, controller support and three new moves'),('12:43','Escape the deliberate glitch glyphs'),('12:58','Poop boost charges and Meme Mountain'),('13:20','Meme Mountain jump fix, box art, sell sheet and report')]

CAST = [('🔧','Marcus','Fixes the job site; Golden Wrench','fires 50% faster','Pipe Wrench: hits stun','🚐 Derek Pulls Up','💨 Dab Cloud','—'),
 ('🌻','Erin','Sunkeep garden; Giant Seed','a brain cell every 30 s','Seed Shot: sprouts bonk','🐄 Stampede','🌿 Hide','—'),
 ('⚙️','Kael','Clanker Yard valves; Bell of Eleven','one extra boost per jump','Hooked Blade sweep','🔔 Eleven','🪝 Sling Knife','Breach'),
 ('⏳','David','Hour Garden; Stopped Watch','+25% aura, faster Borrowed Time','Hourglass Shot: slows','⏳ The Sand Runs Out','🕛 Midnight','—'),
 ('🎤','King Bibi','3 elections; Podium Microphone','nearby enemies stop to listen','Microphone Shot','🎤 Filibuster','❓ Next Question','—'),
 ('🤖','lil Bottie','Beat him; the Missing 1%','fires twice as fast','Clanker Guns, in pairs','☢️ Nuke the Data Center','⛓️ Chain Stun','Boost Thrusters'),
 ('🐕','Louie','Pet him; the Legendary Ball','fast, high jumps, pulls orbs','Bork knockback','👀 Judgement','🦷 Chomp','Turbo Zoom'),
 ('🚐','Derek','Listen 4 times; the van door','shrugs off a hit every 20 s','Car Keys knockback','🚐 The Van','🤷 ...Bro','—'),
 ('🧑‍💻','Will','Light the Lantern; 6 fragments','all cells back every 45 s','Selfie Laser','🛠️ Ship a Hotfix','🦕 Bessie','—')]

PLACES_NEW = [('The North Light','Sprouts / Pocket Lantern','A lake you can walk on, a lighthouse to climb and relight, Bessie the streaming lake monster.'),
 ('The Lamp Market Pit','Guttercrown','Marc the bookie and nine timed gate fights for a brass crown.'),
 ('The Data Center under the Peak','Sproutwild','Five overheating racks, the Hum, and a STAFF ONLY door.'),
 ('The facility under the Peak','original','Sixteen people on hamster wheels powering the Simulation Core; Foreman.exe.'),
 ('The Aura Maze','pocket world','Eight shards in the dead ends, the Aura Core in the middle.'),
 ('The Sprout Patch (formerly)','pocket world · Guttercrown easter egg','Nuked by lil Bottie, glitching in the simulation; twelve sprouts, four golden seeds, a recording.'),
 ('The Scroll Farm','original','A wall of live fake videos; LOOSH & CO. farms the scrollers\' feelings.'),
 ('Bobby Screwdriver\'s Studio','parody','Ten episodes in the other chair; an audit of your real save.'),
 ('The Idiot Debate','parody','Byron Pains, forty feet tall, in an endless shouting match.'),
 ('The NPC Livestream','original','Six NPC streamers performing for gifts.'),
 ('King Bibi\'s Election Night','crossover','Elections every 35 s, a runaway coalition of chairs, the Recount-O-Matic.'),
 ('Mount Skill Issue','original','46 ledges, no checkpoints, no boost, no grapple, wind near the top.'),
 ('Swing-O-Rama','sky course','Twelve grapple points and six rings, 205 m up.'),
 ('The Pile-On','parody','Big Eth on stage, a phone-headed mob, the Cancel-O-Meter.'),
 ('The Warp Ring','hub','Fourteen pads to everything above, plus a roulette.')]

BUGS = [
 ('c-good','Fixed today','Every jump on Meme Mountain was capped by an old flight ceiling.','Capture script'),
 ('c-good','Fixed today','Louie\'s fetch prompt followed him around and covered every other prompt (the "pet prompt that never goes away").','Your report'),
 ('c-good','Fixed today','The two swing lines out of the plaza had their grapple points 1,800 m up.','Test'),
 ('c-good','Fixed today','Two new variables clashed with old ones (CHR, CH) and stopped the game loading until renamed.','Syntax check'),
 ('c-good','Fixed today','The Peak\'s collider pushed you off the fifth rack; crowd barks crashed for new characters without lines.','Tests'),
 ('c-crit','Fix first','The title uses "Grok", another company\'s product name.','Title'),
 ('c-crit','Fix first','King Bibi is a real politician\'s nickname.','Build text'),
 ('c-crit','Fix first','Three parodies of real people (Bobby Screwdriver, Byron Pains, Big Eth) are recognisable.','Build text'),
 ('c-crit','Fix first','Fast flashing and strobing, with no warning and no setting.','Seen in capture'),
 ('c-crit','Check','Emoji art comes from the player\'s device; some sets are not licensed for packaging or ads.','Build code'),
 ('c-warn','Check','Never run on a real phone or controller; sound never heard; frame rate never measured.','Test method'),
 ('c-warn','Check','Balance tuned only against scripted bots: the mountain, swing feel, specials, loan interest.','Test method'),
 ('c-warn','Unconfirmed','Repaying a loan at David\'s desk; the prompt at lil Bottie\'s hologram.','Test coverage'),
 ('c-warn','Visible','NPC\'s floating name tag shows a new look only after his next re-render.','Seen in capture'),
 ('c-warn','Visible','The Meme Mountain quest row does not appear in the short quest list.','Seen in capture'),
 ('','Docs','The box art, sell sheet and the Version 14 report describe the removed forms and none of the 17 versions since.','Repo'),
 ('','Code','121 wrapped-function chains across thirty acts; three of today\'s bugs came from layering.','Build code'),
 ('','Code','The test scripts are not in the repo.','Repo'),
]

NEXT = [('Play it on real hardware','A phone and a pad: sound, frame rate, button reach, swing and slam feel. Three grades are blank until this happens.'),
 ('Settings, with a flashing toggle','Volume, reduce flashing, camera sensitivity, invert-Y, low detail. It is also the safety fix for the strobing.'),
 ('Keep the tests','Move the scripts into the repo with one command that plays boss to ending and every area.'),
 ('Refactor before more features','Fold the wrap chains, split the file by act. The next feature will cost less afterwards.'),
 ('Release blockers','Title, King Bibi, the three real-person parodies, emoji, flashing warning, then refresh the box art and sell sheet.')]

def esc(s): return html.escape(s, quote=False)
def cls(g): return {'A':'g-a','B':'g-b','C':'g-c','D':'g-d','I':'g-i'}[g[0]]
allg=[g for _,rows in GRADES for g in rows];graded=[g for g in allg if g[0]!='I'];gpa=sum(PTS[g[0]] for g in graded)/len(graded);overall=min(PTS,key=lambda k:abs(PTS[k]-gpa))
oldg=[g for g in allg if g[1] and g[1]!='I'];oldgpa=sum(PTS[g[1]] for g in oldg)/len(oldg)
cnt=lambda L:sum(1 for g in allg if g[0][0]==L)
def was(g,o):
  if o is None: return '<span class="was">new since v14</span>'
  if o=='I' or g=='I': return '<span class="was">= '+o+'</span>' if o==g else '<span class="was">was '+o+'</span>'
  d=PTS[g]-PTS[o];return '<span class="was'+(' up' if d>0 else ' down' if d<0 else '')+'">'+('= ' if d==0 else ('▲ was ' if d>0 else '▼ was '))+(o if d else o)+'</span>'
cards=''
for group,rows in GRADES:
  cards+='<h3>'+esc(group)+'</h3><div class="gcards">'
  for g,o,name,pr,ev,rec in rows:
    cards+=f'<div class="gcard"><div class="gtop"><div class="glet {cls(g)}">{g}</div><div><b class="gname">{esc(name)}</b><div class="gmeta">{was(g,o)} <span class="chip pr-{pr.lower()}">{pr} priority</span></div></div></div><p class="gev">{esc(ev)}</p><p class="grec"><b>Raise it:</b> {esc(rec)}</p></div>'
  cards+='</div>\n'
phases=''.join(f'<div class="phase"{" style=\"border-bottom:0\"" if i==len(NEXT)-1 else ""}><div class="n">{i+1}</div><div><h3>{esc(t)}</h3><p>{esc(p)}</p></div></div>' for i,(t,p) in enumerate(NEXT))
newrows=''.join(f'<tr><td class="num nowrap">{t}</td><td><b>{esc(n)}</b></td><td>{esc(w)}</td></tr>' for t,n,w in NEW)
places=''.join(f'<tr><td class="nowrap"><b>{esc(a)}</b></td><td>{esc(k)}</td><td>{esc(w)}</td></tr>' for a,k,w in PLACES_NEW)
cast=''.join(f'<tr><td class="nowrap">{e} <b>{esc(n)}</b></td><td>{esc(u)}</td><td>{esc(p)}</td><td>{esc(b)}</td><td>{esc(s)}</td><td>{esc(bm)}</td><td>{esc(d)}</td></tr>' for e,n,u,p,b,s,bm,d in CAST)
bugs=''.join(f'<tr><td><span class="sev {c}">{esc(l)}</span></td><td>{esc(t)}</td><td>{esc(s)}</td></tr>' for c,l,t,s in BUGS)
allc=[(t,n,False) for t,n in OLDCOMMITS]+[(t,n,True) for t,n,_ in NEW];log=''.join(f'<tr><td class="num nowrap">{t}</td><td>{"<b>"+esc(n)+"</b>" if new else esc(n)}</td><td>{"since v14" if new else "up to v14"}</td></tr>' for t,n,new in allc)
hours=list(range(6,24));per={h:[0,0] for h in hours}
for t,n,new in allc: per[int(t[:2])][1 if new else 0]+=1
W,H,L,B,T=760,210,34,30,16;bw=(W-L-10)/len(hours);mx=max(a+b for a,b in per.values());sc=(H-B-T)/mx
svg=f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Commits per hour on 20 November, 6 am to midnight. Gold: up to Version 14. Green: since.">'
for v in range(0,mx+1):
  y=H-B-v*sc;svg+=f'<line x1="{L}" x2="{W-10}" y1="{y:.1f}" y2="{y:.1f}" stroke="var(--line)" stroke-width="1"/><text x="{L-8}" y="{y+4:.1f}" text-anchor="end" font-size="11" fill="var(--muted)">{v}</text>'
for i,h in enumerate(hours):
  x=L+i*bw+4;a,b=per[h];w=bw-8
  if a: svg+=f'<rect x="{x:.1f}" y="{H-B-a*sc:.1f}" width="{w:.1f}" height="{a*sc:.1f}" rx="2" fill="var(--c4)"/>'
  if b: svg+=f'<rect x="{x:.1f}" y="{H-B-(a+b)*sc:.1f}" width="{w:.1f}" height="{b*sc:.1f}" rx="2" fill="var(--gold)"/>'
  if a+b: svg+=f'<text x="{x+w/2:.1f}" y="{H-B-(a+b)*sc-5:.1f}" text-anchor="middle" font-size="11" fill="var(--ink)">{a+b}</text>'
  if h%2==0: svg+=f'<text x="{x+w/2:.1f}" y="{H-10}" text-anchor="middle" font-size="11" fill="var(--ink2)">{h}:00</text>'
svg+='</svg>'
shots=[('north','The North Light','A lake you can walk on and a lighthouse.'),('pit','The Lamp Market Pit','Marc takes bets in aura.'),('dc','The Data Center','Racks to cool, a mountain that hums.'),('facility','The facility','Sixteen people on hamster wheels.'),('patch','The Sprout Patch (formerly)','Nuked, glitching, twelve survivors.'),('scroll','The Scroll Farm','A wall of live fake videos.'),('bobby','The Screwdriver Podcast','Guest transactions on the big screen.'),('debate','The Idiot Debate','Forty feet of "no, YOU\'RE the idiots".'),('elect','Election Night','The coalition, the results board, the Recount-O-Matic.'),('mountain','Mount Skill Issue','No checkpoints.'),('swing','Swing-O-Rama','Grapple points and rings, 205 m up.'),('pile','The Pile-On','The Cancel-O-Meter and the mob.'),('kael','Kael','Ported from the Guttercrown pit.'),('throne','David\'s throne','The biggest chair in the game.'),('plane','Shiba Plane','Louie\'s ears as wings.'),('looks','NPC\'s looks','Six of the twelve.'),('squad','The squad','Pick four in the pause menu.'),('codex','The codex','74 entries.')]
figs=''.join(f'<figure><img src="img/{f}.jpg" alt="{esc(t)}: {esc(c)}" loading="lazy"><figcaption><b>{esc(t)}.</b> {esc(c)}</figcaption></figure>' for f,t,c in shots)
CSS=open(os.path.join(HERE,'sheet.css'),encoding='utf8').read()
OUT=f'''<title>Grok Fable Astra State of the Game v31</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
{CSS}
.was.up{{color:var(--c3)}}.was.down{{color:var(--c8)}}
</style>
<main>
<header style="display:flex;flex-direction:column;gap:12px">
  <div class="meta">North Coast Studios · 20 November 2026 · updated for Version 31 of the live build · the Version 14 report is kept unchanged: <a href="{OLD_URL}" target="_blank" rel="noopener">read it here</a></div>
  <h1>Grok Fable Astra<br>State of the Game</h1>
  <p class="lede">Since Version 14 the game has roughly doubled. It gained eighteen places and pocket worlds, a playable cast of nine with full movesets, a squad, a swinging grapple, item boxes, a wardrobe for NPC and a codex. It is now as much a collect-a-thon as a joke. It has still never been played by a person on real hardware, it still cannot be sold under its name, and its code is getting harder to change safely.</p>
  <p class="meta">Sources: the live build (<a href="{GAME_URL}" target="_blank" rel="noopener">Version 31</a>) and the Game repo (<code>grok-fable-astra/</code> on <code>claude/festive-hawking-dorqg0</code>). Counts were read out of the running game by script; screenshots are from scripted runs, not hand play. Grades are judgment, not measurement.</p>
</header>
<section id="grades">
<h2>Report card</h2>
<p>The same scale as the Version 14 report, with the old grade beside each one. “I” means incomplete: it exists, but has never been checked the only way that counts.</p>
<div class="tiles five"><div class="tile"><b>{overall}</b><span>overall, {gpa:.2f} on a 4-point scale (v14: {oldgpa:.2f} on the same rows)</span></div><div class="tile"><b>{cnt('A')}</b><span>A grades</span></div><div class="tile"><b>{cnt('B')}</b><span>B grades</span></div><div class="tile"><b>{cnt('C')+cnt('D')}</b><span>C and D grades</span></div><div class="tile"><b>{cnt('I')}</b><span>incomplete: sound, controller</span></div></div>
{cards}
<h3>What to do next, in order</h3>
<div>{phases}</div>
</section>
<section>
<h2>Where it stands</h2>
<div class="tiles"><div class="tile"><b>33</b><span>named places, plus 4 pocket worlds and a sky course</span></div><div class="tile"><b>9</b><span>playable characters, plus NPC</span></div><div class="tile"><b>99</b><span>checklist goals</span></div><div class="tile"><b>74</b><span>codex entries</span></div><div class="tile"><b>462</b><span>platforms</span></div><div class="tile"><b>60</b><span>item boxes, 12 power-ups</span></div><div class="tile"><b>34</b><span>commits in one day</span></div><div class="tile"><b>628 KB</b><span>one file</span></div></div>
</section>
<section>
<h2>Since Version 14</h2>
<p>Eighteen versions, from 4:41 pm to 10:51 pm by the repo's clock.</p>
<div class="scroll"><table><tr><th>Time</th><th>Version</th><th>What it added</th></tr>{newrows}</table></div>
<h3>New places</h3>
<div class="scroll"><table><tr><th>Place</th><th>From</th><th>What is there</th></tr>{places}</table></div>
</section>
<section>
<h2>Frames from today's build</h2>
<div class="shots">{figs}</div>
</section>
<section>
<h2>The playable cast</h2>
<p>Unlocked by finishing the character's quest and fetching their item from their fetch tower (Will: the Lantern and six fragments). Four at a time in the squad; swap with Z, D-pad right or 🎭.</p>
<div class="scroll"><table class="wide"><tr><th>Character</th><th>Unlock</th><th>Passive</th><th>Blast (X / F)</th><th>Special (Y / R)</th><th>B move</th><th>Dash (LB)</th></tr>{cast}</table></div>
</section>
<section>
<h2>Controls now</h2>
<div class="scroll"><table><tr><th>Action</th><th>Keyboard</th><th>Controller</th><th>Phone</th></tr>
<tr><td>Jump · 💩 boost</td><td>Space (hold)</td><td>A (hold)</td><td>JUMP</td></tr><tr><td>Blast</td><td>F / click</td><td>X / RT</td><td>BLAST</td></tr><tr><td>Yap · slam (air) · yell or character move (ground)</td><td>E</td><td>B</td><td>prompt button</td></tr>
<tr><td>Pose · character special</td><td>R</td><td>Y</td><td>😎</td></tr><tr><td>Dash</td><td>Shift</td><td>LB</td><td>⏩</td></tr><tr><td>Grapple (swing)</td><td>G</td><td>RB</td><td>🪝</td></tr>
<tr><td>Lag Spike (hold)</td><td>X</td><td>LT</td><td>🐌</td></tr><tr><td>Throw a sprout</td><td>C</td><td>D-pad ↓</td><td>🌱</td></tr><tr><td>Power-up</td><td>V</td><td>D-pad ←</td><td>item slot</td></tr><tr><td>Switch character</td><td>Z</td><td>D-pad →</td><td>🎭</td></tr>
<tr><td>Borrowed Time</td><td>Q</td><td>D-pad ↑</td><td>⏳</td></tr><tr><td>Pause menu</td><td>M / Tab</td><td>Start</td><td>☰</td></tr></table></div>
<p class="hint">The frog, rock and cloud forms were removed in Version 28; the squad replaced them.</p>
</section>
<section>
<h2>Content decisions made along the way</h2>
<div class="flag"><h3>Real people</h3><p>Three parodies under invented names: Bobby Screwdriver (a money-roast podcaster), Byron Pains (a giant debate podcaster) and Big Eth of the h7h7 Podcast (a cancel-culture pile-on). None uses real allegations or anyone's background; each satirises a format. They are still recognisable, which matters if this is sold.</p></div>
<div class="flag"><h3>David</h3><p>He has his Guttercrown personality, look, resurrection contract, gold, aura loans and a giant throne, but no surname. The Guttercrown backstory (an expelled family, a stolen homeland, a puppet king) was left out because together with a Jewish-coded name it is an antisemitic caricature. The same recommendation applies to Guttercrown itself.</p></div>
<div class="flag"><h3>The Scroll Farm</h3><p>Asked for with real nationalities running the bot farms; built with an invented company, LOOSH &amp; CO., a subsidiary of the Algorithm, because real nationalities secretly harvesting people is a real-world conspiracy theory.</p></div>
<div class="flag" style="border-left-color:var(--warn)"><h3>King Bibi and the title</h3><p>Unchanged from Version 14: a real politician's nickname kept to podium-and-elections jokes, and a title that uses another company's product name.</p></div>
</section>
<section>
<h2>Known bugs and risks</h2>
<div class="scroll"><table><tr><th>Level</th><th>Issue</th><th>Source</th></tr>{bugs}</table></div>
</section>
<section>
<h2>Development timeline</h2>
<p>Every commit to the game, 6:11 am to 10:51 pm. Orange is up to Version 14; gold is everything since.</p>
<div class="scroll">{svg}</div>
<details><summary>All 34 commits</summary><div class="scroll"><table><tr><th>Time</th><th>Commit</th><th></th></tr>{log}</table></div></details>
</section>
</main>
'''
open(os.path.join(HERE,'index.html'),'w',encoding='utf8').write(OUT)
print('wrote',len(OUT),'overall',overall,f'{gpa:.2f}','old',f'{oldgpa:.2f}','A',cnt('A'),'B',cnt('B'),'C',cnt('C'),'D',cnt('D'),'I',cnt('I'))
