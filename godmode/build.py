#!/usr/bin/env python3
"""Builds GODMODE.EXE into one self-contained file: godmode/index.html.

src/shell.html holds the page; /*@include file*/ lines pull in the scripts
(Three.js r160 is vendored in src/vendor/ and inlined, so the game runs offline).

  python3 godmode/build.py                    -> godmode/index.html
  python3 godmode/build.py --fragment OUT     -> also writes OUT without the
        <html>/<head>/<body> wrapper, for hosts that add their own page skeleton.
"""
import re, sys, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')

def include(m):
    text = (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n')
    assert '</script' not in text.lower(), m.group(1) + ' contains a closing script tag'
    return text

body = re.sub(r'/\*@include ([\w./-]+)\*/', include, shell)
HEAD = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="theme-color" content="#070a18">\n')
page = HEAD + body.replace('<!--BODY-->', '</head>\n<body>') + '\n</body>\n</html>\n'
(root / 'index.html').write_text(page, encoding='utf8')
print('godmode/index.html', len(page.encode('utf8')), 'bytes')
if '--fragment' in sys.argv:
    out = pathlib.Path(sys.argv[sys.argv.index('--fragment') + 1])
    out.write_text(body.replace('<!--BODY-->', ''), encoding='utf8')
    print(out, 'written')
