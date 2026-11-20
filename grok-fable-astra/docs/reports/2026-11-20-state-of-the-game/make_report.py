#!/usr/bin/env python3
"""Builds index.html for the Grok Fable Astra State of the Game report.
Same inspection-sheet layout as the Guttercrown report so the two read side by side.
Counts come from the running build (window.__gfa) on 20 November 2026; grades are judgment."""
import html, os
HERE = os.path.dirname(os.path.abspath(__file__))
PTS = {'A': 4, 'A−': 3.7, 'B+': 3.3, 'B': 3, 'B−': 2.7, 'C+': 2.3, 'C': 2, 'C−': 1.7, 'D': 1}

# (group, [(grade, name, priority, evidence, raise-it)])
GRADES = [
 ('Play', [
  ('B', 'Movement and platforming', 'High', 'Double jump, a poop boost that costs a charge (one per jump, three charges to start), a dash, a prompt hook and three forms. 387 platforms. A scripted climb of Meme Mountain with real key presses landed 41 of 44 jumps first time; the other three were bounce pads throwing the test off.', 'Nobody has played it by hand since the boost replaced free flight. Play the eight towers and the mountain on a pad and tune boost height, hook range and air control by feel.'),
  ('C+', 'Combat', 'Medium', 'One blaster, seven enemy types, kill streaks, a meme shot that makes enemies dance, and cast assists. It works and it is funny, but enemies only walk at you.', 'Give each enemy one behaviour of its own (a charge, a ranged shot, a shield) and make two or three places need the blaster.'),
  ('B+', 'Boss and endings', 'Medium', 'THE ALGORITHM has attack phases and the cast can assist. Beating it starts ROT x1000, the Last Grass, then Meme Mountain at x1,000,000 and the first post. The whole chain ran start to finish by script today with no errors.', 'The boss dies quickly to a full blaster. Give it a second form, and make the mountain summit a short fight or a choice, not only a touch.'),
  ('A−', 'Exploring and collecting', 'Low', '26 named places, 67 tokens, 17 drops, 12 prompt fragments, 15 buddies, 240 aura orbs, hats and implants. Something is always in view.', 'A map screen that marks what is left in each place, so the last few 67s are a hunt and not a chore.'),
  ('B', 'Missions and fetch quests', 'Medium', 'A mission dispenser, a Slop Pass, eight guest towers with a fetch item at the top of each, and six random world events.', 'Missions repeat a few shapes. Add a timed race and a no-boost challenge on each tower.'),
 ]),
 ('World and writing', [
  ('A−', 'Writing and jokes', 'Low', 'About 250 lines of dialogue plus barks, a group chat, pop-up ads and a title ticker. The voice is consistent: dry, specific, never explains the joke.', 'Internet jokes date fast. Mark the lines tied to this year’s memes so they are easy to swap.'),
  ('B+', 'The crossover cast', 'Medium', 'Fifteen characters you can talk to, each with a place, a quest and a tower. They sound like themselves from their own games.', 'Give each one a second scene after their quest is done, so the world changes when you help.'),
  ('B', 'Story', 'Medium', 'Chapters, cutscenes and three escalating endings. It holds together as a joke about escalation. There is no character arc and it does not need one.', 'One recurring thread between the acts (the group chat is the obvious place) so the six hours feel like one story.'),
  ('B+', 'The Red String Arc', 'Medium', 'A parody shrine, 17 drops, a 34-platform climb, a secret island with an invented council, and Simulation Space where you build your own way out. No real people, groups or claims are used.', 'Have someone outside the studio read it cold before release. Parody of this subject needs a second pair of eyes.'),
 ]),
 ('Presentation', [
  ('A−', 'Look', 'Low', 'Loud on purpose and consistent about it: rainbow shaders, checkerboards, emoji as scenery, signs with jokes on both sides. It reads instantly in a screenshot.', 'A setting to reduce flashing and fast colour changes. This is also a safety item; see Release.'),
  ('B+', 'The hero', 'Low', 'A shader-glitched figure with too many hands that re-renders itself with a new file name and seed, and three forms to change into.', 'Let the player lock a look they like, and show the seed on the pause screen so it can be shared.'),
  ('B', 'Buddies and sprouts', 'Low', 'Fifteen buddies and 18 wild sprouts rebuilt in 3D from the Sproutwild art, with a rewritten follow and idle animation, plus Ribbert the frog.', 'They follow but do nothing. One small ability each (fetch an orb, point at a 67) would make collecting them matter.'),
  ('B−', 'Screen layout', 'High', 'Quest list, compass, rating, chat, ads, toasts and a video panel share the screen. Today’s capture showed the x1,000,000 banner covering the quest list (fixed) and the mountain’s quest row missing from the short list (open).', 'Decide what the player must see in each mode and hide the rest. On a phone, the jokes should never cover the next platform.'),
  ('I', 'Sound and music', 'High', 'Synth music per zone and effects for most actions, all generated in code. It has only ever run in a silent test browser. Nobody has heard it.', 'Listen to it on a phone and on speakers. Until then it has no grade.'),
 ]),
 ('Platform', [
  ('B−', 'Phone', 'High', 'Touch stick, look area and nine buttons. Layouts were checked by script at an iPhone 13 size. It has never run on a real phone.', 'Play ten minutes on a real phone. Check button reach, text size and whether the frame rate holds in the plaza.'),
  ('I', 'Controller', 'High', 'Every action is mapped (A, B, X, Y, both bumpers, both triggers, D-pad, View). No pad was connected to the test browser, so none of it has been pressed.', 'Plug in a pad and play the first tower. Until then it has no grade.'),
  ('C', 'Performance', 'High', 'One scene holds the whole world: 387 platforms, hundreds of sprites, shader materials. The test browser draws without a graphics card and is too slow to tell us anything about a phone.', 'Measure frames per second on a mid-range phone in the plaza, on Meme Mountain and during ROT x1000. Add a low-detail setting if it drops.'),
  ('B', 'Saving', 'Low', 'Progress saves on the device and Continue restores it; tested by script. One save slot.', 'Version the save so old saves survive updates, and add a reset button in the menu.'),
 ]),
 ('Under the hood', [
  ('C−', 'Code health', 'Medium', 'One 395 KB file, 2,630 very long lines, 350 functions. Fourteen acts were each added by wrapping earlier functions: 43 wrap chains. Today a height limit from the flight act silently capped every jump on the mountain.', 'Before adding more, fold the wrap chains into the functions they wrap and split the file by act. Every new act makes the next bug of this kind more likely.'),
  ('C', 'Testing', 'High', 'Each act was checked by a browser script that plays it, on desktop and phone sizes. Those scripts are not in the repo, and there is no single run-everything check.', 'Move the scripts into the repo and add one command that plays boss to ending. It would have caught today’s jump cap in a minute.'),
 ]),
 ('Release', [
  ('D', 'Release readiness', 'High', 'The title uses another company’s product name. One guest character uses a real politician’s nickname. The game strobes with no warning and no setting. Nothing has run on real hardware. Emoji art depends on the player’s device.', 'Work through the release blockers below in order. None is hard; all of them have to happen before this is sold or promoted.'),
 ]),
]

NEXT = [
 ('Play it on real hardware', 'Ten minutes on a phone and ten on a controller: sound, frame rate, button reach, boost and hook feel. Two grades are blank until this happens.'),
 ('Release blockers', 'Clear or change the title. Rename King Bibi or cut him. Add a flashing warning and a reduce-flashing setting. Ship a fixed emoji set.'),
 ('Keep the tests', 'Move the play-through scripts into the repo and add one command that runs boss to ending.'),
 ('Tune the platforming', 'With boost charges in, replay all eight towers, the red string climb and the mountain. Fix any jump that now needs luck.'),
 ('Tidy the code, then add more', 'Fold the wrap chains, split by act, then return to content: enemy behaviours, a map screen, a second scene per guest.'),
]

AREAS = [
 ('Prompt Plaza', 'Hub', 'Grok, Fable and Astra; the portal; the chaos button'),
 ('Ohio Badlands', 'Zone', 'Grok’s relic; ratio the hallucinations'),
 ('The Delve Woods', 'Zone', 'Fable’s relic; find the lost pages'),
 ('Six-Finger Nebula', 'Zone', 'Astra’s relic; climb the floaty stairs'),
 ('The For-You Page', 'Sky arena', 'The boss fight with THE ALGORITHM'),
 ('Sunkeep', 'Crossover', 'Will, Erin and Louie; light the Great Lantern'),
 ('Flow Pros Job Site', 'Crossover', 'Marcus and Derek; drive the van; fix the leaks'),
 ('The Clanker Yard', 'Crossover', 'lil Bottie and Kael; close the valves'),
 ('The Hour Garden', 'Crossover', 'David, Oracle of Time; Borrowed Time'),
 ('The Press Conference', 'Crossover', 'King Bibi at the podium'),
 ('The Meme Graveyard', 'Side', 'Dead memes and their headstones'),
 ('The Unrendered Zone', 'Side', 'The part nobody finished'),
 ('The Content Farm', 'Side', 'Grow content; harvest engagement'),
 ('The Comment Section', 'Side', 'Comments float past; do not read them'),
 ('The Last Grass', 'Story', 'Touch it to end the game. Twice.'),
 ('The Cloud', 'Sky', 'Four server cores; the first boost upgrade'),
 ('The Slop Factory', 'Economy', 'Slop-O-Matic, Mount Dataset, generated slop maps'),
 ('Chrome Alley', 'Economy', 'Dr. Chromewell sells seven implants'),
 ('The Aura Farm', 'Economy', 'Pose on stage; grow aura crops'),
 ('The Fringe', 'Satire', 'Carl, Lord Grindset, $SLOP coin, gas-station sushi'),
 ('The Smart Home', 'Satire', 'A social rating, a backup of you, robot dogs'),
 ('The Cue-Anon Shrine', 'Red String', 'Seventeen drops, pins and the Red String Path'),
 ('The Secret Island', 'Red String', 'The files, the vault, the Council of Eleven'),
 ('Simulation Space', 'Red String', 'Generate your own platforms to get out'),
 ('The Corrupted Sector', 'Outer ring', 'A glitched area rebuilt from a new seed each visit'),
 ('Eight fetch towers', 'Outer ring', 'Pipe Dream, The Beanstalk, The Clockwork, The Valve Stacks, The Poll Tower, The Loading Bars, Doghouse Heights, The Door Stack'),
 ('Meme Mountain', 'Finale', '44 platforms, four checkpoints, the first post'),
]

COMMITS = [('06:11','A 3D brain-rot adventure','Hub, three zones, relics, boss, HUD, music'),('06:40','The North Coast cast crosses over','Sunkeep, Flow Pros, Clanker Yard, Hour Garden, press conference, the van'),('06:58','A story, places to explore, buddies and sprouts','Cutscenes, side areas, 15 buddies, the glitchy hero'),('07:08','More rot, more moments with the cast','Barks, group chat, chaos button, ads, streaks'),('07:22','Missions, the Slop Pass, a checklist and hats','Mission dispenser, pass, checklist, hats'),('07:30','Flight, the sky, The Cloud and sixty-seven 67s','Poop flight, clouds, server cores, 67 tokens'),('11:21','The slop economy, chrome, memes and generated levels','Factory, implants, aura farm, memes, slop maps'),('11:30','Smoother buddies, and Ribbert the based frog','Buddy animation rewrite, Ribbert'),('11:38','The Fringe','Satire of online archetypes'),('11:47','The Smart Home and the social rating','Rating, backup self, robot dogs'),('11:52','ROT x1000','The second ending'),('12:14','The Red String Arc','Shrine, drops, island, Simulation Space'),('12:43','The outer ring, controller support and three new moves','Fetch towers, Corrupted Sector, events, dash, hook, forms, controller'),('12:43','Escape the deliberate glitch glyphs','Publishing fix'),('12:58','Poop boost charges and Meme Mountain','Boost replaces flight; the third ending'),('13:40','Jump cap fix, box art, sell sheet and this report','Mountain jump fix, banner fix, marketing and report')]

BUGS = [
 ('c-good','Fixed today','Every jump on Meme Mountain was cut to under a metre by an old flight ceiling at height 260. The mountain was unclimbable in the 12:58 build. Fixed and re-tested with a full scripted climb.','Found by the capture script'),
 ('c-good','Fixed today','The “ROT x1,000,000” banner was wider than the screen and covered the quest list.','Seen in capture'),
 ('c-crit','Fix first','The title uses “Grok”, another company’s AI product name. “Fable” and “Astra” are also names in use for games and AI products.','Title and box art'),
 ('c-crit','Fix first','“King Bibi” is a real head of government’s nickname. He is kept to a podium and election jokes, but a real politician in a product is a decision to make on purpose.','Build text'),
 ('c-crit','Fix first','Fast flashing and colour cycling with no warning and no setting, strongest in ROT x1000 and on Meme Mountain.','Seen in capture'),
 ('c-crit','Check','Emoji are drawn with the player’s own system font, so the art differs by device, and some emoji sets are not licensed for use in packaging or ads.','Build code'),
 ('c-warn','Check','Never run on a real phone or with a real controller. Sound never heard.','Test method'),
 ('c-warn','Check','Frame rate unmeasured. One scene holds every area at once.','Build code'),
 ('c-warn','Check','Completion time (five to seven hours) is an estimate from content counts, not a timed play.','Estimate'),
 ('c-warn','Visible','On Meme Mountain the “Climb Meme Mountain” row does not appear in the short quest list; older quests show instead. The compass does point the way.','Seen in capture'),
 ('c-warn','Visible','Floating labels (the hero’s file name, place names) can overlap each other and the hero at some camera angles.','Seen in capture'),
 ('c-warn','Check','The boost changed how high you can get. Floating 67s and drops were given hook pads by rule, but no one has collected all of them since.','Design change'),
 ('','Code','43 wrap chains: later acts replace earlier functions and call the old one. Order matters and nothing checks it.','Build code'),
 ('','Code','The play-through scripts live outside the repo and will be lost with the session that wrote them.','Repo'),
 ('','Code','The published page loads three.js from a CDN; the bundled copy in the folder is only a fallback.','Build head'),
]

def esc(s): return html.escape(s, quote=False)
def cls(g): return {'A':'g-a','B':'g-b','C':'g-c','D':'g-d','I':'g-i'}[g[0]]

allg = [g for _, rows in GRADES for g in rows]
graded = [g for g in allg if g[0] != 'I']
gpa = sum(PTS[g[0]] for g in graded) / len(graded)
overall = min(PTS, key=lambda k: abs(PTS[k] - gpa))
cnt = lambda L: sum(1 for g in allg if g[0][0] == L)

cards = ''
for group, rows in GRADES:
    cards += f'<h3>{esc(group)}</h3><div class="gcards">'
    for g, name, pr, ev, rec in rows:
        cards += (f'<div class="gcard"><div class="gtop"><div class="glet {cls(g)}">{g}</div><div><b class="gname">{esc(name)}</b>'
                  f'<div class="gmeta"><span class="was">first graded</span> <span class="chip pr-{pr.lower()}">{pr} priority</span></div></div></div>'
                  f'<p class="gev">{esc(ev)}</p><p class="grec"><b>Raise it:</b> {esc(rec)}</p></div>')
    cards += '</div>\n'

phases = ''.join(f'<div class="phase"{" style=\"border-bottom:0\"" if i==len(NEXT)-1 else ""}><div class="n">{i+1}</div><div><h3>{esc(t)}</h3><p>{esc(p)}</p></div></div>' for i,(t,p) in enumerate(NEXT))
areas = ''.join(f'<tr><td class="nowrap"><b>{esc(a)}</b></td><td>{esc(k)}</td><td>{esc(w)}</td></tr>' for a,k,w in AREAS)
bugs = ''.join(f'<tr><td><span class="sev {c}">{esc(l)}</span></td><td>{esc(t)}</td><td>{esc(s)}</td></tr>' for c,l,t,s in BUGS)
log = ''.join(f'<tr><td class="num nowrap">{t}</td><td><b>{esc(n)}</b></td><td>{esc(w)}</td></tr>' for t,n,w in COMMITS)

# commits per hour, drawn to one scale
hours = list(range(6, 14)); per = {h: sum(1 for t,_,_ in COMMITS if int(t[:2]) == h) for h in hours}
W, H, L, B, T = 640, 200, 40, 30, 16; bw = (W - L - 10) / len(hours); mx = max(per.values()); sc = (H - B - T) / mx
svg = f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Commits per hour on 20 November, 6 am to 2 pm">'
for v in range(0, mx + 1):
    y = H - B - v * sc
    svg += f'<line x1="{L}" x2="{W-10}" y1="{y:.1f}" y2="{y:.1f}" stroke="var(--line)" stroke-width="1"/><text x="{L-8}" y="{y+4:.1f}" text-anchor="end" font-size="11" fill="var(--muted)">{v}</text>'
for i, h in enumerate(hours):
    x = L + i * bw + 6; v = per[h]
    if v: svg += f'<rect x="{x:.1f}" y="{H-B-v*sc:.1f}" width="{bw-12:.1f}" height="{v*sc:.1f}" rx="3" fill="var(--gold)"/><text x="{x+(bw-12)/2:.1f}" y="{H-B-v*sc-5:.1f}" text-anchor="middle" font-size="12" fill="var(--ink)">{v}</text>'
    svg += f'<text x="{x+(bw-12)/2:.1f}" y="{H-10}" text-anchor="middle" font-size="11" fill="var(--ink2)">{h}:00</text>'
svg += '</svg>'

CSS = open(os.path.join(HERE, 'sheet.css'), encoding='utf8').read()
shots = [('title','The title screen','Five sticker claims and a ticker. The controls for all three inputs are listed here.'),('hub-hud','Prompt Plaza','The hub with the full screen layout: brain cells, aura, data, rating, quests, compass.'),('boss','THE ALGORITHM','The first ending. A pyramid with one eye, on the For-You Page.'),('cloud','The Cloud','Server racks, stepping clouds and some of the sixty-seven 67s.'),('factory','The Slop Factory','The Slop-O-Matic turns dumped data into generated platform levels.'),('flow','Flow Pros Job Site','Marcus and Derek’s van. You can drive it.'),('cue','The Cue-Anon Shrine','Where the Red String Arc starts.'),('glitch','The Corrupted Sector','Rebuilt from a new seed on every visit.'),('rot1000','ROT x1000','The second ending: the filter comes off and the whole world recolours.'),('mm','Meme Mountain','The third ending, at x1,000,000. The banner fits the screen after today’s fix.')]
figs = ''.join(f'<figure><img src="img/{f}.jpg" alt="{esc(t)}: {esc(c)}" loading="lazy"><figcaption><b>{esc(t)}.</b> {esc(c)}</figcaption></figure>' for f,t,c in shots)

OUT = f'''<title>Grok Fable Astra State of the Game</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
{CSS}
</style>
<main>

<header style="display:flex;flex-direction:column;gap:12px">
  <div class="meta">North Coast Studios · 20 November 2026 · first report, for Version 14 of the live build, with a report card</div>
  <h1>Grok Fable Astra<br>State of the Game</h1>
  <p class="lede">Grok Fable Astra went from nothing to a complete 3D platform adventure in one day: 26 places, 15 guest characters, three endings that escalate from a boss to a mountain of memes, and a moveset that now has to be earned. It is funnier and larger than a one-day game should be. It has also never been played by a person on real hardware, and it cannot be sold under its current name.</p>
  <p class="meta">Sources: the live build and the Game repo (<code>grok-fable-astra/</code> on <code>claude/festive-hawking-dorqg0</code>). Counts were read out of the running game by script; screenshots are from scripted runs, not hand play. Grades are judgment, not measurement.</p>
</header>

<section id="grades">
<h2>Report card</h2>
<p>Every part of the game on one scale, with the evidence for the grade and what would raise it. These are my judgment from the code, the live build and scripted runs. “I” means incomplete: the part exists but has never been checked the only way that counts.</p>
<div class="tiles five"><div class="tile"><b>{overall}</b><span>overall, {gpa:.2f} on a 4-point scale</span></div><div class="tile"><b>{cnt('A')}</b><span>A grades</span></div><div class="tile"><b>{cnt('B')}</b><span>B grades</span></div><div class="tile"><b>{cnt('C')+cnt('D')}</b><span>C and D grades</span></div><div class="tile"><b>{cnt('I')}</b><span>incomplete: sound, controller</span></div></div>
{cards}
<h3>What to do next, in order</h3>
<div>{phases}</div>
</section>

<section>
<h2>Where it stands</h2>
<div class="tiles"><div class="tile"><b>26</b><span>named places plus the mountain</span></div><div class="tile"><b>387</b><span>platforms</span></div><div class="tile"><b>15</b><span>characters to talk to</span></div><div class="tile"><b>63</b><span>checklist goals</span></div><div class="tile"><b>67</b><span>67 tokens</span></div><div class="tile"><b>3</b><span>endings, in a row</span></div><div class="tile"><b>16</b><span>commits in about 7½ hours</span></div><div class="tile"><b>395 KB</b><span>one file</span></div></div>
<h3>What exists</h3>
<div class="scroll"><table><tr><th>Place</th><th>Kind</th><th>What is there</th></tr>{areas}</table></div>
<h3>What that means</h3>
<p>The game is content-complete for a first release: there is a start, a middle with far more side content than the main path needs, and an ending that pays off. The main path (three relics, the boss, the grass, the mountain) is about an hour. Everything else is optional, and that is where the estimated five to seven hours comes from.</p>
</section>

<section>
<h2>Frames from today’s build</h2>
<div class="shots">{figs}</div>
</section>

<section>
<h2>How the ending is layered</h2>
<p>The last hour is one joke told three times, each bigger. Each step was run by script today.</p>
<div class="flow">
<div class="step"><div class="k">1</div><div><p><b>Three relics open the portal.</b> One each from the Ohio Badlands, the Delve Woods and the Six-Finger Nebula.</p></div></div>
<div class="step"><div class="k">2</div><div><p><b>THE ALGORITHM.</b> A boss fight in a sky arena. The cast can assist.</p></div></div>
<div class="step"><div class="k">3</div><div><p><b>ROT x1000.</b> Winning removes the filter. The counter runs up to a thousand and the whole world recolours.</p></div></div>
<div class="step"><div class="k">4</div><div><p><b>The Last Grass.</b> Touching grass ends ROT x1000. The grass turns out to be a meme too.</p></div></div>
<div class="step"><div class="k">5</div><div><p><b>Meme Mountain, x1,000,000.</b> A 150-metre spiral of 44 platforms: moving, rising, blinking, bouncing and orbiting, with four checkpoints. Falling returns you to the last one. One boost per jump.</p></div></div>
<div class="step"><div class="k">6</div><div><p><b>The first post.</b> It says “first”. The rot drops to x1 and the credits roll.</p></div></div>
</div>
</section>

<section>
<h2>Moves and controls</h2>
<p>Flight was replaced today. Holding jump used to let you fly for seconds and skip most platforming. It now fires one short burst per jump and spends a charge.</p>
<div class="scroll"><table><tr><th>Move</th><th>Keyboard</th><th>Controller</th><th>What it does</th></tr>
<tr><td><b>Jump</b></td><td>Space</td><td>A</td><td>Double jump. A third jump is an unlock.</td></tr>
<tr><td><b>Poop boost</b></td><td>Hold Space in the air</td><td>Hold A</td><td>One burst of about five metres per jump. Three charges, refilling one every four seconds. More from The Cloud, Cloud Lungs and all 67s.</td></tr>
<tr><td><b>Dash</b></td><td>Shift</td><td>LB</td><td>A short burst forward, on the ground or in the air.</td></tr>
<tr><td><b>Prompt hook</b></td><td>G</td><td>LT</td><td>Pulls you to the nearest platform ahead, up to 34 metres above.</td></tr>
<tr><td><b>Transform</b></td><td>T</td><td>RB</td><td>Frog (jump higher, extra jump), Grok Rock (fast, heavy, cannot boost), Cloud (glide).</td></tr>
<tr><td><b>Blast</b></td><td>F or click</td><td>X or RT</td><td>The blaster. Every fifth shot can be a meme.</td></tr>
<tr><td><b>Yap</b></td><td>E</td><td>B</td><td>Talk and interact.</td></tr>
<tr><td><b>Pose</b></td><td>R</td><td>Y</td><td>Farm aura. Pays more on the stage.</td></tr>
</table></div>
<p class="hint">On a phone the same moves are on-screen buttons. Measured today by script: a standing jump with a boost rises 8.6 metres, against about 3 without.</p>
</section>

<section>
<h2>Content to decide on before release</h2>
<div class="flag"><h3>The title</h3><p>“Grok” is the name of another company’s AI product, and the game’s rock mascot shares it. As a free joke page that is parody. As a boxed product with that word on the front, it is a trademark question someone qualified should answer. “Fable” and “Astra” are also in use by a game series and by AI products. A fallback title should be ready.</p></div>
<div class="flag"><h3>King Bibi</h3><p>This is a real politician’s nickname. In this game he stands at a podium, says “Prime Minister. Again.” and runs a poll tower; there are no war or security jokes. That is a careful version of a choice that still needs making on purpose: keep, rename, or cut.</p></div>
<div class="flag" style="border-left-color:var(--warn)"><h3>David</h3><p>The Guttercrown report flagged David Roseinberg as reading like an antisemitic caricature. Here he appears as David, Oracle of Time, with clocks and Borrowed Time only, and none of the gold, debt or homeland material. If his name and look change in Guttercrown, change them here to match.</p></div>
<div class="flag" style="border-left-color:var(--warn)"><h3>The Fringe and the Red String Arc</h3><p>The edgy material is satire of invented characters and online types: a crypto guru, a hustle lord, an anonymous poster called “C”, an invented Council of Eleven with cartoon evils. There are no slurs, no real groups, nothing sexual, and no real conspiracy claims repeated. The frog is an original character, Ribbert, not the well-known cartoon frog, which belongs to its artist.</p></div>
</section>

<section>
<h2>Succeeding</h2>
<ul>
<li><b>The joke lands in one frame.</b> A watermark on the hero, a seed in its name tag, a sign that says the grass is not grass. Nobody needs it explained.</li>
<li><b>Escalation with an end.</b> Boss, x1000, x1,000,000, then one quiet line. The game knows when to stop.</li>
<li><b>Density.</b> There is a collectible, a sign or a character in every direction from every spot.</li>
<li><b>The guest cast.</b> Fifteen characters from other games each get a place and a voice, and the van is fun to drive.</li>
<li><b>A real moveset now.</b> With flight capped, the dash, hook and forms have jobs, and the towers and mountain are built around them.</li>
<li><b>It runs clean.</b> No script errors in any scripted run today, on desktop or phone sizes, across all three endings.</li>
</ul>
</section>

<section>
<h2>Lacking</h2>
<ul>
<li><b>A human player.</b> Every check so far is a script. Feel, difficulty, sound and frame rate are unknown.</li>
<li><b>A clear name and cast for release.</b> See the content section. This is the item that blocks selling it.</li>
<li><b>A calm mode.</b> No way to reduce flashing, and the loudest parts are at the end where a player is most invested.</li>
<li><b>Enemies worth fighting.</b> Combat is a way to collect data cubes, not a challenge.</li>
<li><b>A map.</b> Twenty-six places and a compass that points at one thing at a time.</li>
<li><b>Code that can keep growing.</b> Today’s jump bug came from act six reaching into act fourteen. There will be more like it.</li>
</ul>
</section>

<section>
<h2>Known bugs and risks</h2>
<div class="scroll"><table><tr><th>Level</th><th>Issue</th><th>Source</th></tr>{bugs}</table></div>
</section>

<section>
<h2>Ideas: unfinished, missing, unexplored</h2>
<div class="grid2">
<div class="card"><h3>Unfinished</h3><ul><li>Buddies follow you and do nothing else.</li><li>The Slop Pass has tiers but no last reward worth chasing.</li><li>Forms change movement; nothing in the world reacts to which form you are in.</li></ul></div>
<div class="card"><h3>Missing</h3><ul><li>Settings: flashing, sound volume, detail level, camera speed.</li><li>A map and a per-place count of what is left.</li><li>A photo mode. This game is made to be screenshotted.</li></ul></div>
<div class="card"><h3>Unexplored</h3><ul><li>A daily seed for the Corrupted Sector with a shared best time.</li><li>Sharing a hero seed as a link.</li><li>A speedrun timer for boss to first post.</li></ul></div>
<div class="card"><h3>Small, high value</h3><ul><li>Show the boost charges all the time, not only after one is spent.</li><li>Put the mountain’s quest row at the top of the list.</li><li>A one-line warning before ROT x1000 starts.</li></ul></div>
</div>
</section>

<section>
<h2>Development timeline</h2>
<p>The whole game is one day’s work: sixteen commits between 6:11 am and about 1:40 pm on 20 November by the repo’s clock, with a gap from 7:30 to 11:21.</p>
<div class="scroll">{svg}</div>
<div class="scroll"><table><tr><th>Time</th><th>Commit</th><th>What it added</th></tr>{log}</table></div>
</section>

</main>
'''
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf8').write(OUT)
print('wrote', len(OUT), 'bytes; overall', overall, f'{gpa:.2f}', 'A', cnt('A'), 'B', cnt('B'), 'C', cnt('C'), 'D', cnt('D'), 'I', cnt('I'))
