# The report card: every feature graded, with the evidence and what to do next. My judgment from the code, the build and scripted runs.
GR = [
 # (group, feature, grade, was (19 Nov, out of 5 -> letter) or '', evidence, recommendation, priority)
 ('Fighting','Core combat feel','A−','A−','Three-blow combos with a weapon-specific third blow, charged heavies, directional dodges, perfect dodge and parry, posture breaks, flinches on big hits. Zero script errors across every simulated career.','Hand-play it on a controller and tune the pause on impact and the input buffer by feel: nothing here has been judged by a human hand since the edge went in.','High'),
 ('Fighting','Finishers',  'A',  '',f'{gTotal} distinct endings: {totalClass} by class, {totalWF} by weapon, 5 situational, 3 random events, plus the pit itself. Picked in a clear order, and you can set a favourite.','Rewrite the older finishers joint by joint, as the six new Underboss ones were. Add a “not the same one twice running” rule so long careers stay fresh.','Medium'),
 ('Fighting','Gore and dismemberment','A−','',f'Ten parts can come off (arms, forearms, hands, legs, shins, head). Stumps keep bleeding. Crits crack skulls and open bellies. Blood paints the floor in the shape of the wound instead of hanging in the air. Only opponents lose parts.','Add a gore setting (full, reduced, off) before anyone outside the studio plays: it costs little and widens the audience. Wounds on the body itself, not only the floor, are the next step up.','Medium'),
 ('Fighting','Weapons',  'A−','',f'{nArms} weapons, each with a property and a temper, a heavy, a mastery signature and an idle flourish. A seeded tournament now shows every bought weapon is a real sidegrade.','Give the remaining weapons that share a swing set a third blow of their own, and a hit sound per weapon family. Keep the tournament as a regression check after every balance change.','Medium'),
 ('Fighting','Classes and the edge','B+','',f'Six classes, each with its own scores, resource and edge meter, a spender move and two upgrades. {nab} class moves on offer plus moves for your people, earned moves and David’s gifts.','Grow the edge into a short tree (four to six nodes per class) that pulls subclasses apart, so two fighters of the same class can play differently.','Medium'),
 ('Fighting','Stances','B−','','14 stances (8 standing, 6 floating) chosen at the Guildmaster. They run in bouts without errors.','Nobody has seen them move at bout distance. Look at them in play; if they don’t read, give each a small trade-off (reach for guard, speed for posture) so the choice matters.','Low'),
 ('Fighting','Opponent behaviour','B','','Opponents react, dodge, guard, parry, race for crowd flasks and use their own tempers and edge. Named fighters have their own tuning.','Give the gate fighters one or two signature patterns each (a feint, a grab, a move they always open with) so they are learnt, not only out-statted. The computer plays casters poorly; their bouts may feel easier than they test.','High'),
 ('Fighting','Balance','B','','Six classes all within 0–2 deaths per career; weapons even within each class after today’s pass. All measured by the game playing itself.','Get real play numbers: a hidden log of deaths, bout times and weapon use per run that you can read after a playtest. Consider an easy and a hard setting once the middle is right.','High'),
 ('Progression','Levels, ranks and mastery','A−','A−','Nine Guild ranks, ten levels, five mastery ranks per weapon, kits, charms, sets, pasts and natures. Every layer pays off in the pit.','Show the next unlock on the pre-fight card, so every bout points at something.','Low'),
 ('Progression','Money and side games','B+','','Marc’s Table, Sir Dedrick III’s dice ring, loans, raids, the Fence, scouting, the crowd. Careers end with 600–1,300 coin spare.','Coin piles up late. Add one late sink worth saving for (a house upgrade, a bought favour from the throne) and pay out less from raids after rank 5.','Medium'),
 ('Progression','Home','B','','A room to furnish, with beds, a dummy, stove, cauldron and strongbox that each do something.','Let it show your career: trophies from the gates, a severed-part shelf from your best finishers, the crown once you hold it.','Low'),
 ('World and story','World and writing','A','A−','103 Codex entries, 24 street events tailored to class, people and situation, and a voice that is consistently its own.','Keep it. Cut where a line repeats across many events.','Low'),
 ('World and story','Story through the middle','C+','C',"The Hour Garden now uses your own fallen, David’s debt sits on the top line once signed, and the intro shows the spikes. Gates 4–6 are still mostly standalone fighters.",'Put the royals or a rival on the ladder in the middle: one scene each at gates 4, 5 and 6 that changes what happens at the crown. This is the biggest story gap.','High'),
 ('World and story','Cinematics and endings','A−','A−','A full intro film, four filmed endings with lines that change with what you did, a last-night montage.','Add a short film at the midpoint (the crown fight is the only big set piece after the intro).','Medium'),
 ('Presentation','3D look','B+','B+','Warm, readable and consistent: real lighting and shadows, low-poly figures, a lamp-lit market.','A pass on faces and hands, the parts the kill camera now looks at most. One key-art scene for the box and store page.','Medium'),
 ('Presentation','Animation','B','','A fuller skeleton (hips, elbows, wrists, knees, ankles, neck), flinches, a sprawl for every fall, joint-breaking finishers.','Older finishers and all guests still share base swings. Rework the most-seen ones first: the class basics and the three most common finishers.','Medium'),
 ('Presentation','Camera','B','','The kill camera stays side-on and rises over the killer.','Add a closer bout camera option. Stances, flourishes and new joints are invisible from the current distance.','Medium'),
 ('Presentation','Menus','B','B','Big-tile Guildmaster and Fence, a rebuilt pre-fight card, three save pages, a menu-size slider.','Still dense. Cap every menu at one screen on a phone, and move rarely used options behind one “more” tile.','Medium'),
 ('Presentation','Onboarding','C+','C','Pip now fetches you to each new place as it opens.','Nine prep slots and four currencies still land early. Open them one bout at a time over the undercard, each with a one-line reason to care.','High'),
 ('Presentation','Sound and music','Incomplete','','A sound engine and music exist, plus a bell on the Toll and vendor calls. I can’t hear the build, so this isn’t graded.','Listen through a full bout and a finisher on headphones and list what’s missing; finishers in particular need their own sounds.','Medium'),
 ('Platform','Phone','B−','','Touch controls, a layout that keeps buttons apart (tested at iPhone size), menu-size slider.','Play a full career on a real iPhone in Safari. Emulation is not a phone.','High'),
 ('Platform','Controller','C+','','Full controller support in code, including shoulder buttons in the Tailor.','Untested on hardware. One hour with a real pad will find most of what’s wrong.','High'),
 ('Platform','Performance','B','','Market stutter and intro pop-in fixed. Tests run in software rendering, which is slower than any real device.','Measure frame time on a mid-range phone during a gibbet or grate finisher, the heaviest scenes.','Medium'),
 ('Under the hood','Stability','A−','B','Zero script errors across six full careers and every weapon tournament bout. 51 automated tests.','Run the test suite on every push automatically instead of by hand.','Medium'),
 ('Under the hood','Code health','B−','B−','Clear one-file-per-system layout; patches layered on patches (four separate tuning files now).','Fold tune.js to tune4.js into one data table of numbers. It will make the next balance pass ten minutes, not an hour.','Medium'),
 ('Under the hood','Saves','B+','','Three save pages, career and guest careers kept apart.','Add an export/import code so a save can move between phone and desktop.','Low'),
 ('Extras','Guest List','B','','Nine guests with their own bodies, moves, ultimates and finishers, careers and spars. Paused. Unbalanced on purpose.','Keep it private. It names real people, including a head of government, and should never ship in a public build.','—'),
 ('Release','Release readiness','D+','D','The game is deep and stable. What stands between it and strangers: rule-book names that may need a licence check, real people in the Guest List, untested hardware, no gore setting.','Make a public build flag that strips the Guest List, rename anything borrowed from a rule book, add the gore setting, and test on real devices.','High'),
]
GP = {'A+':4.3,'A':4.0,'A−':3.7,'B+':3.3,'B':3.0,'B−':2.7,'C+':2.3,'C':2.0,'C−':1.7,'D+':1.3,'D':1.0,'F':0}
graded=[g for g in GR if g[2] in GP]; gpa=sum(GP[g[2]] for g in graded)/len(graded)
def letter(v):
    for k,x in sorted(GP.items(), key=lambda t:-t[1]):
        if v>=x-0.15: return k
    return 'F'
def gcls(g): return 'g-a' if g.startswith('A') else 'g-b' if g.startswith('B') else 'g-c' if g.startswith('C') else 'g-d' if g[0] in 'DF' else 'g-i'
def mv(now,was):
    if not was: return '<span class="was">first graded</span>'
    if was not in GP or now not in GP: return ''
    d=GP[now]-GP[was]
    return '<span class="was up">▲ from '+was+'</span>' if d>0 else '<span class="was down">▼ from '+was+'</span>' if d<0 else '<span class="was">= '+was+'</span>'
groups=[]
for g in GR:
    if g[0] not in groups: groups.append(g[0])
dist={}
for g in graded: dist[g[2][0]]=dist.get(g[2][0],0)+1
GRADES='<section id="grades">\n<h2>Report card</h2>\n<p>Every part of the game graded on one scale, with the evidence for the grade and what would raise it. These are my judgment from the code, the live build and scripted runs, not a measurement. Where the 19 November report scored the same thing (out of 5) it is shown as a letter: 4.5 is A−, 4 is B+, 3.5 is B, 3 is B−, 2.5 is C.</p>\n'
GRADES+='<div class="tiles five"><div class="tile"><b>'+letter(gpa)+'</b><span>overall, '+f'{gpa:.2f}'+' on a 4-point scale</span></div>'+''.join('<div class="tile"><b>'+str(dist.get(k,0))+'</b><span>'+k+' grades</span></div>' for k in 'ABC')+'<div class="tile"><b>'+str(dist.get('D',0))+'</b><span>D grade: release readiness</span></div></div>\n'
for grp in groups:
    rows=[g for g in GR if g[0]==grp]
    GRADES+='<h3>'+E(grp)+'</h3><div class="gcards">'
    for (_,f,gr,was,ev,rec,pr) in rows:
        GRADES+='<div class="gcard"><div class="gtop"><div class="glet '+gcls(gr)+'">'+E(gr if gr!='Incomplete' else 'I')+'</div><div><b class="gname">'+E(f)+'</b><div class="gmeta">'+mv(gr,was)+(' <span class="chip pr-'+pr.lower()+'">'+pr+' priority</span>' if pr!='—' else '')+'</div></div></div><p class="gev">'+E(ev)+'</p><p class="grec"><b>Raise it:</b> '+E(rec)+'</p></div>'
    GRADES+='</div>\n'
TOP=[('Play it by hand on a real phone and a real controller','Every number in this report comes from the game playing itself. One evening of real play will reprice every grade above.','Low','Highest'),
 ('Put story in the middle of the ladder','A royal or rival scene at gates 4, 5 and 6 that pays off at the crown. Lifts the lowest creative grade.','Medium','High'),
 ('Stagger what opens early','Open the prep slots and currencies one bout at a time over the undercard.','Low','High'),
 ('Make a public build','Strip the Guest List behind a flag, add a gore setting, rename borrowed rule-book names. Turns D+ into B.','Medium','High'),
 ('Give gate fighters signature patterns','A feint, a grab or a known opener for each named fighter, so the climb is learnt.','Medium','High'),
 ('Log real play','A hidden per-run log of deaths, bout length and weapon use to read after playtests.','Low','High'),
 ('A closer bout camera','So stances, flourishes and the new joints can actually be seen.','Low','Medium'),
 ('Rewrite the most-seen finishers','Class basics and the three most common endings, joint by joint.','High','Medium'),
 ('One balance table','Fold the four tuning files into one table of numbers.','Low','Medium'),
 ('A sound pass by ear','Finishers, the gibbet, the grate and every weapon family need their own sounds.','Medium','Medium')]
GRADES+='<h3>What to do next, in order</h3><p class="hint">Ordered by how much each raises the grades above for the work it takes.</p><div class="scroll"><table><thead><tr><th>#</th><th>Do this</th><th>Why</th><th>Effort</th><th>Payoff</th></tr></thead><tbody>'+''.join('<tr><td class="num">'+str(i+1)+'</td><td><b>'+E(a)+'</b></td><td>'+E(b)+'</td><td>'+E(c)+'</td><td>'+E(dd)+'</td></tr>' for i,(a,b,c,dd) in enumerate(TOP))+'</tbody></table></div>\n</section>\n'
GCSS='''.gcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:12px;margin-bottom:8px}
.gcard{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px;min-width:0}
.gtop{display:flex;gap:12px;align-items:center;margin-bottom:8px}
.glet{flex:none;width:52px;height:52px;border-radius:8px;display:grid;place-items:center;font-family:var(--display);font-size:26px;font-weight:700;color:#141210}
.g-a{background:var(--c3)}.g-b{background:var(--c1)}.g-c{background:var(--c4)}.g-d{background:var(--c8)}.g-i{background:var(--line);color:var(--ink)}
.gname{font-size:16px}.gmeta{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;font-size:12px}
.was{color:var(--muted)}.was.up{color:var(--c3)}.was.down{color:var(--c8)}
.chip.pr-high{background:color-mix(in srgb,var(--c8) 22%,transparent)}.chip.pr-medium{background:color-mix(in srgb,var(--c4) 22%,transparent)}.chip.pr-low{background:color-mix(in srgb,var(--c7) 18%,transparent)}
.gev{font-size:13.5px;margin:0 0 8px;color:var(--ink2)}.grec{font-size:13.5px;margin:0}
'''
