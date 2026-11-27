# Builds the two published pages from the same commit, each stamped with it:
#   dist/underground-syndicate.html  the game players open (https://claude.ai/artifact/6jAxeQpoBi67Qr8hWHKBqa)
#   dist/workshop.html               the private character editor (https://claude.ai/artifact/BmRUpPhwc9k3iCuudjLm2x)
# Always publish both together after a change, so the Workshop shows what the game has (compare the build stamps).
# Usage: python3 tools/build_artifact.py
import pathlib
src = pathlib.Path(__file__).resolve().parent.parent
out = src / 'dist'
out.mkdir(exist_ok=True)
html = (src / 'index.html').read_text()
body = html.split('<body>')[1].split('<script src=')[0]
css = (src / 'style.css').read_text()
import subprocess, datetime
_c = subprocess.run(['git', '-C', str(src), 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True).stdout.strip()
_d = subprocess.run(['git', '-C', str(src), 'status', '--porcelain', '--', 'js', 'style.css', 'index.html'], capture_output=True, text=True).stdout.strip()
_t = subprocess.run(['git', '-C', str(src), 'log', '-1', '--format=%cd', '--date=format:%d %b %Y, %H:%M UTC'], capture_output=True, text=True).stdout.strip()
stamp = '<script>window.BUILD = ' + __import__('json').dumps({'commit': _c + ('+' if _d else ''), 'date': _t}) + ';</script>\n'
js = '\n'.join('<script>\n' + (src / 'js' / f).read_text() + '\n</script>' for f in ['core.js', 'data.js', 'lore.js', 'music.js', 'sound.js', 'gfx.js', 'models.js', 'world.js', 'places.js', 'life.js', 'fight.js', 'cine.js', 'ui.js', 'crew.js', 'mark.js', 'mark2.js', 'mark3.js', 'meet.js', 'room.js', 'deeds.js', 'arms.js', 'realm.js', 'board.js', 'kits.js', 'story.js', 'home.js', 'market.js', 'ledger.js', 'oracle.js', 'cellar.js', 'climb.js', 'raid.js', 'gear.js', 'home2.js', 'prep.js', 'classes.js', 'crowd.js', 'tune.js', 'ascent.js', 'flavor.js', 'flavor2.js', 'flavor3.js', 'guide.js', 'armsrace.js', 'tune2.js', 'moves.js', 'ladder.js', 'pause.js', 'garden.js', 'debts.js', 'loans.js', 'roster.js', 'tidy.js', 'builder.js', 'knuckle.js', 'knives.js', 'traits.js', 'finale.js', 'events2.js', 'moves2.js', 'icons.js', 'rings.js', 'dice.js', 'moves3.js', 'tune3.js', 'menus2.js', 'stance.js', 'saves.js', 'eggs.js', 'perf.js', 'finish2.js', 'edge.js', 'depth.js', 'arms2.js', 'crowd2.js', 'tune4.js', 'lights.js', 'cloud.js', 'look_edits.js', 'looks.js', 'main.js'])
page = ('<title>Guttercrown</title>\n'
        '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Crimson+Pro:wght@400;600&family=Grenze+Gotisch:wght@600;800;900&display=swap" rel="stylesheet">\n'
        '<style>\n' + css + '\n</style>\n' + body + stamp +
        '<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>\n' + js + '\n')
(out / 'underground-syndicate.html').write_text(page)
print(len(page))

# the Workshop: a separate private artifact, the same code plus the editor; the game above never contains it
ws_js = js.replace("<script>\n" + (src / 'js' / 'looks.js').read_text() + "\n</script>", "<script>\n" + (src / 'js' / 'looks.js').read_text() + "\n</script>\n<script>\n" + (src / 'js' / 'workshop.js').read_text() + "\n</script>")
assert ws_js != js
wpage = ('<title>Guttercrown Workshop</title>\n'
        '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Crimson+Pro:wght@400;600&family=Grenze+Gotisch:wght@600;800;900&display=swap" rel="stylesheet">\n'
        '<style>\n' + css + '\n</style>\n' + body + stamp + '<script>window.WORKSHOP_ONLY = 1;</script>\n'
        '<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>\n' + ws_js + '\n')
(out / 'workshop.html').write_text(wpage)
print('workshop', len(wpage))
