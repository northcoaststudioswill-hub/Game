#!/usr/bin/env python3
"""Builds the Thornwatch console file from source.

  backups/...v3.7_2026-11-16_BACKUP.html   the frozen v3.7 build. Read-only. It is used as the
                                           shell: the page, the music and the other three
                                           cartridges come from it unchanged.
  src/*.js                                 Thornwatch (cartridge 4), in the order listed in PARTS.

The build cuts the old Thornwatch module out of the shell and puts the source files in its place.
All files share the console's one script scope, so every Thornwatch name is TW/tw-prefixed.

Run:    python3 build.py           -> Sprouts+Rootdeep+Sproutwild+Thornwatch.html
Check:  python3 build.py --v37     -> rebuilds from src/v37/tw-module.js and confirms the result is
                                      byte-identical to the frozen v3.7 file (proves the cut is clean)
"""
import hashlib, pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent
SHELL = here / 'backups/Sprouts+Rootdeep+Sproutwild+Thornwatch-v3.7_2026-11-16_BACKUP.html'
OUT = here / 'Sprouts+Rootdeep+Sproutwild+Thornwatch.html'
PARTS = ['tw-creeps.js', 'tw-module.js', 'tw-look.js', 'tw-story.js', 'tw-motes.js']
START = '/* ================================================================\n   CARTRIDGE 4: THORNWATCH'
END = '/* ---------- loop ---------- */'
V37_MD5 = '9b879390975751c7426542bee1b1e11f'


def die(msg):
    sys.exit('build: ' + msg)


def code(path):
    js = path.read_text(encoding='utf8')
    if '</script' in js.lower():
        die(f'{path.name} must not contain a closing script tag')
    return js


shell = SHELL.read_text(encoding='utf8')
if hashlib.md5(shell.encode('utf8')).hexdigest() != V37_MD5:
    die('the frozen v3.7 shell has changed; it must never be edited')
if shell.count(START) != 1 or shell.count(END) != 1:
    die('shell markers not found exactly once')
a, b = shell.index(START), shell.index(END)

if '--v37' in sys.argv:
    out = shell[:a] + code(here / 'src/v37/tw-module.js') + shell[b:]
    ok = hashlib.md5(out.encode('utf8')).hexdigest() == V37_MD5
    print('v3.7 round trip:', 'identical' if ok else 'DIFFERENT')
    sys.exit(0 if ok else 1)

module = '\n'.join(code(here / 'src' / p).rstrip() for p in PARTS if (here / 'src' / p).exists()) + '\n\n'
# one script scope: a function declared twice silently overrides the first
names = re.findall(r'^function\s+([A-Za-z0-9_$]+)', module, re.M)
dupes = sorted({n for n in names if names.count(n) > 1})
if dupes:
    die('duplicate function names: ' + ', '.join(dupes))
rest = shell[:a] + shell[b:]
clash = sorted(n for n in set(names) if re.search(r'^function\s+' + re.escape(n) + r'\(', rest, re.M))
if clash:
    die('names already used by another cartridge: ' + ', '.join(clash))
html = shell[:a] + module + shell[b:]
# v4: the game is called CLANKAWATCH now (Will, Nov 18). The folder, file and save key keep the old name.
for old, new in [('></canvas>Thornwatch</button>', '></canvas>Clankawatch</button>'),
                 ('<title>Sprouts + Rootdeep + Sproutwild + Thornwatch', '<title>Sprouts + Rootdeep + Sproutwild + Clankawatch')]:
    if html.count(old) != 1:
        die('rename: expected one of ' + old)
    html = html.replace(old, new)
OUT.write_text(html, encoding='utf8')
print(OUT.name, len(html.encode('utf8')), 'bytes', hashlib.md5(html.encode('utf8')).hexdigest())
