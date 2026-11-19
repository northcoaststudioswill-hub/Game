#!/usr/bin/env python3
"""Builds SECOND CHANCE into one self-contained file: second-chance/index.html.

src/shell.html holds the page; /*@include file*/ lines pull in the scripts
(Three.js r160 is vendored in src/vendor/ and inlined, so the game runs offline).

  python3 second-chance/build.py
  python3 second-chance/build.py --fragment OUT   -> also writes OUT without the <html>/<head>/<body>
        wrapper, for hosts that add their own page skeleton.
"""
import re, sys, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')

def include(m):
    text = (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n')
    assert '</script' not in text.lower(), m.group(1) + ' contains a closing script tag'
    return text

page = re.sub(r'/\*@include ([\w./-]+)\*/', include, shell)
(root / 'index.html').write_text(page, encoding='utf8')
print('second-chance/index.html', len(page.encode('utf8')), 'bytes')
if '--fragment' in sys.argv:
    out = pathlib.Path(sys.argv[sys.argv.index('--fragment') + 1])
    frag = re.sub(r'<!doctype html>\n|</?html[^>]*>\n?|</?head>\n?|</?body>\n?|<meta charset[^>]*>\n|<meta name="viewport"[^>]*>\n', '', page, flags=re.I)
    out.write_text(frag, encoding='utf8')
    print(out, len(frag.encode('utf8')), 'bytes')
