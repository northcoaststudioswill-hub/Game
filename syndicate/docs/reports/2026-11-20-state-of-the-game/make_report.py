import json, html, re
SP='/tmp/claude-0/-home-user-Game/ec27baf5-f3b8-57f7-af40-c684bcac1d26/scratchpad'
OLD='/home/user/Game/syndicate/docs/reports/2026-11-19-state-of-the-game/index.html'
NEW='/home/user/Game/syndicate/docs/reports/2026-11-20-state-of-the-game/index.html'
d=json.load(open(SP+'/gamedata.json')); E=html.escape
CN={c['id']:c['name'] for c in d['classes']}
ranks=[r['name'] for r in d['ranks']]
def kind(a): return a['id'].split('_')[1]
def fam(a):
    k=kind(a); c=a['cls']
    if k=='basic': return {'fighter':'sword','rogue':'dual','cleric':'blunt','sorcerer':'kindle','warlock':'drink'}.get(c)
    return {'spear':'spear','axe':'axe','halberd':'halberd','hammer':'blunt','pick':'blunt','flail':'chain' if c=='druid' else 'blunt','axes':'dual','rapier':'rapier','chain':'chain','staff':'staff' if c in('cleric','druid') else 'pyre','frost':'frost','spark':'arc','acid':'gnaw'}.get(k)
WF={'spear':'The {w}, Thrown','sword':'Legs, Then the Skull','blunt':'Left the {w} in Them','dual':'Twenty Holes','rapier':'Through the Heart, and Twisted','chain':'A Short Leash','staff':'Swept and Staved','axe':'Buried to the Breastbone','halberd':'Hooked and Pinned','kindle':'A Lamp With a Face','drink':'Every Drop of Them','frost':'Snapped Off, Piece by Piece','arc':'Grounded Through the Spikes','gnaw':'Nothing Left to Bury','pyre':'The {w} Made a Pyre'}
WF2={'sword':'Run Through and Held Up','axe':'Limb by Limb','blunt':'Knees First','spear':'Staked to the Sand','dual':'Hamstrung, Then the Throat','rapier':'Thirty Little Holes'}
FAMNAME={'axe':'heavy','hammer':'heavy','pick':'heavy','spear':'pole','halberd':'pole','staff':'pole','rapier':'fence','axes':'dual','chain':'swing','flail':'swing'}
THIRD={'sword':'Spinning backhand','dual':'Crossed double cut','fence':'Lunging flèche','heavy':'Two-handed overhead slam','swing':'Twice round the head, then let go','staff':'Butt up, then the crown','spear':'Overhead skewer','halberd':'Low hooking sweep','mace':'Leaping smash'}
IDLE={'heavy':'Shoulder roll','dual':'Flips both blades','pole':'Twirls it','fence':'Twirls it','swing':'Lets the head swing','orb':'Juggles the light','sword':'Twirls it','mace':'Twirls it'}
def anims(a):
    k=kind(a); c=a['cls']; caster=a.get('type')!='melee'
    if caster: return ('Cast, release, and a third-bolt pattern ('+{'sorcerer':'fan of three','warlock':'heavy shoving blast','cleric':'pair','druid':'pair'}.get(c,'pair')+')', 'Juggles the light', 4)
    f=FAMNAME.get(k) or ('dual' if c=='rogue' else '')
    if k=='staff': t=THIRD['staff']
    elif k=='halberd': t=THIRD['halberd']
    elif k in('spear',): t=THIRD['spear']
    elif f in THIRD: t=THIRD[f]
    elif c=='fighter': t=THIRD['sword']
    elif c=='cleric': t=THIRD['mace']
    else: t='Shared jump-chop'
    idle=IDLE.get(f) or IDLE.get('sword')
    return (t, idle, 6)
def cell(x): return '<td>'+x+'</td>'
rows=[]
for a in d['arms']:
    f=fam(a); w=a['wname']; fins=[WF[f].format(w=w)] if f in WF else []
    if f in WF2: fins.append(WF2[f])
    price = 'Starter' if not a.get('coin') and not a.get('deed') else ('Deed: '+{'breaker':'break a guard','heavy':'land heavies'}.get(a.get('deed'),a.get('deed') or '') if a.get('deed') else str(a['coin'])+' coin, '+ranks[a.get('rank',0)])
    if a.get('rank',0)>=4 and a.get('coin'): price=str(a['coin'])+' coin, '+ranks[a['rank']]
    melee=a.get('type')=='melee'
    spd=round((a.get('wind') or 0)+(a.get('rec') or 0),2)
    reach=str(a.get('range')) if melee else ('bolt '+str(a.get('speed') or '')).strip()
    dice='{}d{}'.format(*a['dmg']) if a.get('dmg') else ''
    th,idle,n=anims(a)
    rows.append((a['cls'],'<tr><td><b>'+E(w)+'</b><br><span class="hint">'+CN[a['cls']]+'</span></td>'+cell(E(price))+cell(dice)+cell(f'{spd:.2f}s')+cell(reach+(' · '+str(a['arc'])+'°' if a.get('arc') else ''))+cell(str(a.get('pz') or '1.0'))
        +cell('<b>'+E(a['prop'][0])+'</b> '+E(a['prop'][1]) if a.get('prop') else '—')+cell('<b>'+E(a['trait']['name'])+'</b> '+E(a['trait']['text']))
        +cell(E(a.get('heavy') or '—')+'<br><span class="hint">Mastered: '+E((a.get('sig') or {}).get('name') or a.get('master') or '—')+'</span>')+cell('<br>'.join(E(x) for x in fins) or '—')+'</tr>', a, th, idle, n, len(fins)))
order=['fighter','rogue','sorcerer','cleric','druid','warlock']
rows.sort(key=lambda r: order.index(r[0]))
WT='<div class="scroll"><table class="wide"><thead><tr><th>Weapon</th><th>How you get it</th><th>Dice</th><th>Swing time</th><th>Reach · arc</th><th>Posture</th><th>Property (since the 19th)</th><th>Temper (new)</th><th>Heavy blow</th><th>Weapon finishers</th></tr></thead><tbody>'+''.join(r[1] for r in rows)+'</tbody></table></div>'
AT='<div class="scroll"><table class="wide"><thead><tr><th>Weapon</th><th>Combo</th><th>Third blow</th><th>Charged heavy</th><th>Mastered heavy</th><th>Idle flourish</th><th>Finishers</th><th>Unique animations</th></tr></thead><tbody>'
for c,_,a,th,idle,n,nf in rows:
    melee=a.get('type')=='melee'
    AT+='<tr><td><b>'+E(a['wname'])+'</b></td><td>'+('3 blows' if melee else 'Cast and release')+'</td><td>'+E(th)+'</td><td>'+E(a.get('heavy') or '—')+'</td><td>'+E((a.get('sig') or {}).get('name') or '—')+'</td><td>'+E(idle)+'</td><td class="num">'+str(nf)+'</td><td class="num">'+str(n+nf)+'</td></tr>'
AT+='</tbody></table></div>'
# class finishers
CF=''
for c in d['classes']:
    ms=sorted(c['mortals'],key=lambda m:(m['rank'],m['name']))
    CF+='<details'+(' open' if c['id']=='fighter' else '')+'><summary><b>'+E(c['name'])+'</b> · '+str(len(ms))+' finishers</summary><div class="scroll"><table><thead><tr><th>Opens at</th><th>Finisher</th><th>Word</th><th>What happens</th></tr></thead><tbody>'+''.join('<tr><td class="nowrap">'+E(ranks[m['rank']])+'</td><td><b>'+E(m['name'] or '')+'</b>'+(' <span class="chip c-own">new</span>' if m['rank']==4 and m['id'] in ('breaker','strings','boil','penance','thorns','marionette') else '')+'</td><td class="nowrap">'+E(m.get('word') or '')+'</td><td>'+E(m.get('desc') or '')+'</td></tr>' for m in ms)+'</tbody></table></div></details>'
totalClass=sum(len(c['mortals']) for c in d['classes'])
# classes in depth
def nm(id_):
    for c in d['classes']:
        for a in d['abilities'][c['id']]:
            if a['id']==id_: return a['name']
    return id_
CL=''
for c in d['classes']:
    abil=d['abilities'][c['id']]; spend=[a['name'] for a in abil if a.get('spend')]
    race=[]; earned=[x['move']['name'] for x in d['earned'] if x['cls']==c['id'] and x.get('move')]
    st=c['stats']; e=c.get('edge') or {}
    CL+='<div class="card cls"><h3>'+E(c['name'])+' <span class="hint">'+E(c.get('role') or '')+'</span></h3><table class="kv"><tbody>'
    CL+='<tr><th>Resource</th><td>'+E(c['res'])+' · hit die d'+str(c['hitDie'])+' · primary '+c['primary'].upper()+'</td></tr>'
    CL+='<tr><th>Scores</th><td class="num">'+' '.join(k.upper()+' '+str(v) for k,v in st.items())+'</td></tr>'
    CL+='<tr><th>Edge</th><td><b>'+E(e.get('name',''))+'.</b> '+E(e.get('desc',''))+'</td></tr>'
    CL+='<tr><th>Starts with</th><td>'+E(', '.join(nm(x) for x in c['start']))+'</td></tr>'
    CL+='<tr><th>Level 2</th><td>'+E(', '.join(nm(x) for x in c['l2']))+'</td></tr>'
    CL+='<tr><th>Ultimate</th><td>'+E(nm(c['ult']))+'</td></tr>'
    CL+='<tr><th>Trainer</th><td>'+E(', '.join(nm(x) for x in c['extra']))+'</td></tr>'
    CL+='<tr><th>Spends the edge</th><td>'+E(', '.join(spend) or '—')+'</td></tr>'
    CL+='<tr><th>Earned at 10 wins</th><td>'+E(', '.join(earned) or '—')+'</td></tr>'
    CL+='<tr><th>Subclasses</th><td>'+E(', '.join(c['subs']))+'</td></tr>'
    CL+='<tr><th>Finishers</th><td class="num">'+str(len(c['mortals']))+' of its own, plus the weapon, situational and random ones</td></tr></tbody></table></div>'
nab=sum(len(v) for v in d['abilities'].values())
# stances, rings, race moves
races=', '.join(E(r['name'])+' ('+E(x['move']['name'])+')' for r in d['races'] for x in d['race'] if x['race']==r['id'] and x.get('move'))
nArms=len(d['arms'])
melee=sum(1 for a in d['arms'] if a.get('type')=='melee')
totalWF=sum(r[6] for r in rows)
SIT=[('Put Out Like a Lamp','They are crawling','Stamped out, twice'),('With Their Own Arm','They have lost an arm','You pick it up and beat them with it'),('Along the Wall','They are near the wall','Run into the stone and dragged along it'),('On the Last Breath','You are under 15% health','A swaying headbutt, then you sink to a knee'),('A Piece for Every Stand','The crowd is at 90 hype or more','Forearms, shins, then the head, one cut at a time')]
RND=[('A Gift From the Stands','The crowd throws a blade; you catch it and take the head'),('The Gibbet Comes Down','You back off; the chain gives; the cage drops on them'),('Something Under the Grate','Near a floor grate: hands drag them across the sand and under')]
ENV=[('On the Spikes','Near a spike wall','Each class has its own name: Shield-Rushed, Walked Backwards, Blown, Cast Out, Thrown by the Roots, Dragged There by Something'),('Into the Fire','Near a vent','Held Down in the Vent, Tripped into the Vent, Fed to the Fire, Purified, Given Back to the Deep, A Small Offering')]
def t3(rows_,hd): return '<div class="scroll"><table><thead><tr>'+''.join('<th>'+h+'</th>' for h in hd)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+E(x)+'</td>' for x in r)+'</tr>' for r in rows_)+'</tbody></table></div>'
def fig(src,cap): return '<figure><img src="img5/'+src+'.jpg" alt="'+E(cap)+'" loading="lazy"><figcaption>'+cap+'</figcaption></figure>'
gTotal=totalClass+totalWF+len(SIT)+len(RND)+2
NEWSEC=f'''
<section>
<h2>Since the 19 November report</h2>
<p>53 commits since the report went out at 9:21 pm on 19 November. The work went in four directions: how fights end, how each class and weapon plays, presentation and menus, and a hidden roster of guests from the other North Coast games. The 19 November report is kept in full below, unchanged.</p>
<div class="tiles six">
<div class="tile"><b>53</b><span>commits since the last report</span></div>
<div class="tile"><b>{gTotal}</b><span>distinct finishers, from {totalClass} class finishers to random events</span></div>
<div class="tile"><b>{nArms}</b><span>weapons, every one with a property and a temper</span></div>
<div class="tile"><b>{nab}</b><span>class moves on offer, plus race, earned and gift moves</span></div>
<div class="tile"><b>6</b><span>class edges, each with a spender and two upgrades</span></div>
<div class="tile"><b>14</b><span>stances: 8 standing, 6 floating</span></div>
</div>
<div class="grid2">
<div class="card"><h3>Fighting</h3><ul>
<li>A second finisher for every melee weapon family, and finishers for every caster weapon, which had none.</li>
<li>Six late class finishers at Underboss that bend joints the wrong way.</li>
<li>Five situational finishers chosen by how the bout ended, and three random events.</li>
<li>A class mechanic for every calling: the edge, five pips under the stamina bar, with a move that spends it all and two upgrades.</li>
<li>Twelve new trainer moves, six of them edge spenders.</li>
<li>Every weapon has a temper on top of its property; druid beast shapes have their own.</li>
<li>Every third basic bolt is the calling's own: a fan, a heavy blast or a pair.</li>
<li>The crowd throws a healing flask when it loves you, and a hurt opponent races you for it.</li>
</ul></div>
<div class="card"><h3>Bodies, gore and animation</h3><ul>
<li>A fuller skeleton: hips, elbows, wrists, knees, ankles and neck.</li>
<li>Forearms, shins and the off hand can come off; stumps keep bleeding.</li>
<li>Crits crack skulls (blunt) and open bellies (blades).</li>
<li>Heavy hits snap the head round and throw the hands.</li>
<li>Blood paints the floor in the shape of the wound instead of hanging in the air.</li>
<li>New third blows for heavy weapons, flails, staves, longsword, mace and halberd; an idle flourish for every weapon.</li>
<li>Every downed body falls into its own sprawl.</li>
<li>The kill camera stays side-on and rises over the killer.</li>
</ul></div>
<div class="card"><h3>Presentation and menus</h3><ul>
<li>Three save pages; Marc's Table playable from the title.</li>
<li>Guildmaster front page as big tiles, like the Fence; the pre-fight card rebuilt with a last-stop row (potion, stew, tonic).</li>
<li>Menu size slider; character builder set in the pit.</li>
<li>Pip fetches you for each new place; vendors call out.</li>
<li>Sir Dedrick III's dice ring in the market.</li>
<li>Robes fixed; sorcerers and warlocks hover on eleven named rings; stances for everyone.</li>
<li>Market stutter fixed; intro pop-in fixed.</li>
</ul></div>
<div class="card"><h3>Story</h3><ul>
<li>The Hour Garden uses your own fallen as its souls, and the contract is offered again if you lose there.</li>
<li>Once you have signed, the top line says how many souls you owe David.</li>
<li>The intro's spike shot shows bodies on the spikes.</li>
<li>24 street events tailored to class, people and situation.</li>
</ul></div>
</div>
<div class="shots">{fig('class-finishers','<b>Late class finishers.</b> Bent the Wrong Way, Every String Cut, Boiled in the Skin, Made to Pray, Grown Through, Danced to Death.')}{fig('melee-alternates','<b>Second weapon finishers.</b> Run through and held up, limb by limb, knees first, staked, hamstrung, thirty holes.')}{fig('events','<b>Random events.</b> A blade from the stands, and the gibbet comes down.')}{fig('grate','<b>Something Under the Grate.</b>')}{fig('caster-frost','<b>Frost.</b> Frozen solid, then snapped apart without blood.')}{fig('third-blows','<b>Third blows.</b> Longsword backhand, leaping mace, halberd hook.')}{fig('blood','<b>Blood by wound.</b> Stab line, spiked ring, blunt spatter, slash fan.')}{fig('sprawl','<b>Sprawl.</b> No two bodies fall the same way.')}{fig('edge-hud','<b>The edge.</b> A rogue’s Openings, three of five.')}{fig('edge-sheet','<b>Edge upgrades</b> on the Character page.')}{fig('armoury','<b>A weapon’s temper</b> in the Armoury.')}{fig('trainer','<b>New moves</b> at the trainer.')}{fig('stances','<b>Standing stances.</b>')}{fig('floating-stances','<b>Floating stances.</b>')}{fig('intro-spikes','<b>The intro’s spike shot</b> (row 9).')}</div>
</section>

<section>
<h2>Finishers, all of them</h2>
<p>When a bout ends, the game picks one ending in this order. A guest's own finisher always wins. Next, the pit itself: die near a spike wall or a vent and that is usually what kills you. Then a situational finisher, if the bout ended in one of its situations, or now and then a random event. Then, six times in ten (four if you picked a favourite), a finisher for the weapon in your hand. Otherwise, a finisher of your class.</p>
<div class="tiles five"><div class="tile"><b>{totalClass}</b><span>class finishers</span></div><div class="tile"><b>{totalWF}</b><span>weapon finishers across {nArms} weapons</span></div><div class="tile"><b>5</b><span>situational</span></div><div class="tile"><b>3</b><span>random events</span></div><div class="tile"><b>2 × 6</b><span>environmental, named per class</span></div></div>
<h3>By class</h3><p class="hint">Opened by Guild rank. You can set a favourite at the Guildmaster.</p>{CF}
<h3>Weapon finishers</h3><p class="hint">Six weapon families have two endings, picked half the time each. Casters' weapons got theirs in this update.</p>
{t3([(k, WF[k].replace('{w}','weapon'), WF2.get(k,'—')) for k in ['sword','axe','blunt','spear','dual','rapier','chain','staff','halberd','kindle','drink','frost','arc','gnaw','pyre']],['Family','First ending','Second ending'])}
<h3>Situational</h3>{t3(SIT,['Finisher','When','What happens'])}
<h3>Random events</h3>{t3(RND,['Event','What happens'])}
<h3>Environmental</h3>{t3(ENV,['Finisher','When','Names by class'])}
</section>

<section>
<h2>Weapons in depth</h2>
<p>{nArms} weapons, {melee} melee and {nArms-melee} cast. Each has the property it had on the 19th, and a temper added in this update that changes how a fight with it goes. Swing time is wind-up plus recovery; reach is in pit units (a fighter is about 32 across); posture is how hard it breaks a guard (1.0 is normal).</p>
{WT}
<h3>Animations per weapon</h3><p class="hint">The combo is three blows. The third blow is the weapon's own where named. Every weapon has a charged heavy blow and, at mastery 5, a signature version. "Unique animations" counts the combo, third blow, heavy, mastered heavy, idle flourish and its finishers.</p>
{AT}
<h3>Druid beast shapes</h3>{t3([(b['name'], '{}d{}'.format(*b['dmg']), b.get('trait') or '') for b in d['beast']],['Attack','Dice','Temper'])}
<h3>Upgrades</h3>
{t3([('Buy it','The Fence. Coin and a Guild rank, or a deed for some (break a guard, land heavies).'),('Mastery','Use it in the pit. Ranks at 0, 40, 110, 220 and 380 mastery: Unfamiliar, Handy, Practised, Deadly, Master. Each rank adds 3% to basic and heavy blows; Master unlocks the signature heavy.'),('Honing','The Fence’s grinder: three times, 60, 130 and 220 coin, +1 to every blow with that weapon.'),('Grade of steel','Runed Edge (110 coin, +2 damage) and Syndicate Relic (240 coin, +4), for whatever you carry.'),('Skins','Weapon skins from the Tailor change the colour and glow, not the numbers.')],['Upgrade','How it works'])}
</section>

<section>
<h2>Classes in depth</h2>
<p>Every class now has six layers: its own scores and resource, the edge, a starting kit, a level-2 pair, an ultimate, and a trainer list that includes a move that spends the edge. On top of that come a move for your people, a move earned at ten wins, and David's gift if you sign.</p>
<div class="classes">{CL}</div>
<h3>The edge</h3>
{t3([(c['edge']['name'], c['name'], c['edge']['desc']) for c in d['classes'] if c.get('edge')],['Edge','Class','How it fills and pays'])}
<p class="hint">Upgrades on the Character page: Ready (level 3, 150 coin): start every bout with two pips. Deep (level 6, 400 coin): every payout half again as big. Opponents of level 7 and up start with two pips.</p>
<h3>Moves from your people</h3><p>{races}. Each costs 200 coin at the trainer.</p>
<h3>Stances and rings</h3><p>Standing: {E(', '.join(d['stances']['ground']))}. Floating, for sorcerers and warlocks on a ring: {E(', '.join(d['stances']['floating']))}. Rings: {E(', '.join(r['name'] for r in d['rings']))}.</p>
</section>

<section>
<h2>Balance, measured</h2>
<p>Each figure is a simulated career: the game plays itself through the ladder until the run ends, and I count deaths. The computer plays casters worse than a person does, so treat these as a floor on difficulty, not a ceiling.</p>
<div class="scroll"><table><thead><tr><th>Build</th><th>Fighter</th><th>Rogue</th><th>Sorcerer</th><th>Warlock</th><th>Change</th></tr></thead><tbody>
<tr><td>19 Nov</td><td>1 in 40</td><td>—</td><td>hard (you reported it)</td><td>—</td><td>Before the sorcerer pass</td></tr>
<tr><td>Sorcerer eased</td><td>—</td><td>—</td><td>0–2 in 34–43</td><td>—</td><td>Mage Armour ward, +10% health</td></tr>
<tr><td>Edge added</td><td>0 in 34</td><td>0 in 34</td><td>1 in 39</td><td>1 in 40</td><td>New class mechanic</td></tr>
<tr><td>Gore and new moves</td><td>0 in 34</td><td>0 in 34</td><td>0 in 34</td><td>0 in 34</td><td>Too easy</td></tr>
<tr><td>Edge trimmed</td><td>0 in 34</td><td>0 in 34</td><td>1 in 38</td><td>2 in 42</td><td>Momentum 4%, Debt 3%, Overcharge +45%</td></tr>
<tr><td>Weapon tempers</td><td>1 in 36</td><td>1 in 37</td><td>1 in 41</td><td>4 in 42</td><td>Opponents get tempers too</td></tr>
<tr><td>Latest</td><td>0 in 34</td><td>2 in 41</td><td>1 in 39</td><td>2 in 41</td><td>Beast tempers, bolt rhythm, flasks</td></tr>
<tr><td>Weapon pass</td><td>1 in 40</td><td>2 in 46</td><td>0 in 34</td><td>2 in 41</td><td>Slow and cold weapons raised (cleric 1–4 in 38–44, druid 0 in 34)</td></tr>
</tbody></table></div>
<p>The pit is back near where it was on the 19th. The warlock swings between two and four deaths and may be slightly hard. The new layers have only been measured by the game playing itself; your playtest is the real check.</p>
<h3 style="margin-top:1.4em">Weapon tournament</h3>
<p>Every weapon fought the same tougher opponent (level 5, health ×1.6) in seeded bouts. Before: five bouts each. After: twelve bouts for the weapons that moved, since five is too few to trust. Wins / bouts, then average seconds to win.</p>
<div class="scroll"><table><thead><tr><th>Weapon</th><th>Before</th><th>After</th><th>What changed</th></tr></thead><tbody>
<tr><td>Bell-Hammer (cleric)</td><td>1/5 · 37 s</td><td>7/12 · 32 s</td><td>20% quicker, 2d8, heavy blows +15%</td></tr>
<tr><td>Pick (cleric)</td><td>1/5 · 48 s</td><td>6/12 · 26 s</td><td>20% quicker, 2d6, heavy blows +15%</td></tr>
<tr><td>Hammer (fighter)</td><td>2/5 · 33 s</td><td>8/12 · 29 s</td><td>15% quicker, 2d7, heavy blows +10%</td></tr>
<tr><td>Hammer (druid)</td><td>2/5 · 20 s</td><td>5/5 · 18 s</td><td>15% quicker, 2d7, heavy blows +10%</td></tr>
<tr><td>Axes (druid)</td><td>2/5 · 19 s</td><td>10/12 · 18 s</td><td>1d8</td></tr>
<tr><td>Frost (sorcerer)</td><td>3/5 · 58 s</td><td>4/5 · 27 s</td><td>1d8, faster bolt</td></tr>
<tr><td>Frost (warlock)</td><td>3/5 · 39 s</td><td>4/5 · 36 s</td><td>1d8</td></tr>
<tr><td>Acid (warlock)</td><td>2/5 · 31 s</td><td>7/12 · 25 s</td><td>1d8</td></tr>
<tr><td>Flails (fighter, cleric)</td><td>4/5, 3/5</td><td>4/5, 4/5</td><td>10% quicker</td></tr>
<tr><td>Druid staff</td><td>5/5 · 14 s</td><td>11/12 · 17 s</td><td>8% slower (it was the outlier)</td></tr>
</tbody></table></div>
<p>Starter weapons sit at 9/12, so every bought weapon is now a sidegrade rather than a trap. Iron Beatrix, Dolly, the Collector and the Queen carry these weapons, so their damage was offset (−5 to −8%) to keep the gates where they were. Without that, the cleric stalled at Beatrix.</p>
</section>

<section>
<h2>The Guest List</h2>
<p>A hidden roster (tap the crown five times on the title, type <code>louie</code>, or hold both shoulder buttons): nine people from the other North Coast games, each with their own body, moves, cinematic ultimate and finisher, playable as a career or sparred with your own fighter. Paused for now in favour of the main game.</p>
{t3([(g['name'], g['race']+' · '+g['title'], ', '.join(x for x in g['moves'] if x), g.get('ult') or '', g.get('fin') or '') for g in d['guests']],['Guest','People · title','Moves','Ultimate','Finisher'])}
<div class="shots">{fig('guests','<b>The line-up.</b>')}{fig('kael','<b>Kael Brennick</b>, rebuilt from Sootborn’s 3D cadet.')}{fig('kael-finishers','<b>Kael’s finishers</b> with Sootborn’s cut-ins.')}{fig('guest-fx','<b>Cinematic ultimates.</b> Hasbara, Louie’s side-eye, and others.')}</div>
</section>

<section>
<h2>Still to do</h2>
<ul>
<li><b>Older finishers:</b> every body now sprawls with the new joints, but their own choreography has not been rewritten move by move.</li>
<li><b>Stances in motion:</b> they run in bouts without errors; the bout camera is too far out to judge how they look. Needs a look in play.</li>
<li><b>Edge tree:</b> two upgrades so far; a deeper tree is not built.</li>
<li><b>Balance:</b> weapons are now even within each class by the tournament; the warlock may still be slightly hard. Everything here is measured by the game playing itself.</li>
<li><b>Devices:</b> iPhone Safari menu size and a physical controller still need real hardware.</li>
<li><b>Guest List (paused):</b> bespoke swing animations, separate rigs, richer cinematic art, guest story and dialogue.</li>
</ul>
</section>
'''
s=open(OLD).read()
s=s.replace('<title>Guttercrown State of the Game</title>','<title>Guttercrown State of the Game</title>',1)
a=s.index('<header'); b=s.index('</header>')+len('</header>')
HDR=f'''<header style="display:flex;flex-direction:column;gap:12px">
  <div class="meta">North Coast Studios × E Concepts · updated 20 November 2026 for Version 147 of the live build · the 19 November report is kept in full below</div>
  <h1>Guttercrown<br>State of the Game</h1>
  <p class="lede">Since the last report Guttercrown's fighting has gone much deeper: {gTotal} distinct ways to end a bout, a temper for every one of its {nArms} weapons, a class mechanic for every calling, joints that bend and break, and blood that paints the sand. The pit is close to the difficulty it had on the 19th. The tables below come straight from the build.</p>
  <p class="meta">Sources: the live build and the Game repo (<code>syndicate/</code> on <code>claude/wonderful-euler-4hchee</code>). Tables were read out of the running game by script; screenshots are from scripted runs, not hand play. Difficulty figures are simulated careers.</p>
</header>'''
OLDHDR=s[a:b]
s=s[:a]+HDR+NEWSEC+'\n<div class="divider"><span>The 19 November report, unchanged</span></div>\n'+OLDHDR.replace('<h1>Guttercrown<br>State of the Game</h1>','<h1 style="font-size:34px">19 November</h1>',1)+s[b:]
s=s.replace('src="img2/','src="img2/').replace('</style>','''table.wide{min-width:1080px}table.wide th,table.wide td{font-size:13px}
.tiles.six{grid-template-columns:repeat(3,1fr)}.tiles.five{grid-template-columns:repeat(5,1fr)}@media (max-width:640px){.tiles.six,.tiles.five{grid-template-columns:repeat(2,1fr)}}
.num{font-variant-numeric:tabular-nums;text-align:right}
.nowrap{white-space:nowrap}
details{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:10px 12px}
details summary{cursor:pointer;font-family:var(--display);font-size:19px;letter-spacing:.02em}
details[open] summary{margin-bottom:8px}
details .scroll{border:0}
.classes{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}
.cls h3{margin-bottom:6px}
table.kv th{width:9.5em;font-size:13px;text-transform:none;letter-spacing:0;color:var(--muted);white-space:normal}
table.kv td{font-size:13.5px}
.divider{display:flex;align-items:center;gap:12px;color:var(--gold);font-family:var(--display);font-size:20px;text-transform:uppercase;letter-spacing:.06em}
.divider::before,.divider::after{content:"";flex:1;height:1px;background:var(--gold);opacity:.5}
code{font-size:.92em}
</style>''',1)
open(NEW,'w').write(s); print(len(s))
