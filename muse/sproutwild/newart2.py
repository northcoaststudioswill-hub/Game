#!/usr/bin/env python3
"""Sproutwild character art (v4.0) — SWCHR sprites, previewed before patching.
16 wide x 20 tall humans (PIP shorter, BOTTIE 20x24). 's' = outline, 'k' = eyes."""
from PIL import Image

def rows(*lines): return list(lines)

CHAR = {}

CHAR['WILL'] = dict(pal={'h': '#6b4423', 'H': '#8a5f30', 'f': '#e8b088', 'F': '#c98a5e',
                         't': '#2e8f86', 'T': '#1f6a63', 'l': '#57b8ac', 'p': '#2c3242', 'w': '#e8e4da'},
spr=rows(
"....ssssssss....",
"..sshhhhhhhhss..",
".shHHhhhhhhHHhs.",
".shhhhhhhhhhhhs.",
".sffffffffffffs.",
".sfkfffffffkffs.",
".sffffffffffffs.",
"..sffffffffffs..",
"...sffffffffs...",
"..ssttttttttss..",
".sfttttttttttfs.",
".sftTttttttTffs.",
"..sTttttttttTs..",
"...tttttttttt...",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['ERIN'] = dict(pal={'h': '#b45a28', 'H': '#d07c3a', 'f': '#f0bc94', 'F': '#d09a6e',
                         't': '#e8dcc0', 'T': '#c4b294', 'p': '#3a4a6a', 'w': '#f0ece2'},
spr=rows(
"....ssssssss....",
"..sshhhhhhhhss..",
".shHHhhhhhhHHhs.",
".shhhhhhhhhhhhs.",
".shffffffffffhs.",
".shfkfffffkffhs.",
".shffffffffffhs.",
".shffffffffffhs.",
"..shffffffffhs..",
"..ssttttttttss..",
".sfttttttttttfs.",
".sfTttttttttTfs.",
"..sTttttttttTs..",
"...tttttttttt...",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['MARCUS'] = dict(pal={'h': '#1c1c22', 'H': '#34343e', 'f': '#d09a6e', 'F': '#b07c4e',
                           't': '#26262e', 'T': '#17171c', 'w': '#e8e4da', 'p': '#4a4a55'},
spr=rows(
"....ssssssss....",
"..sshhhhhhhhss..",
".shHhhhhhhhHHhs.",
".shhhhhhhhhhhhs.",
".sffffffffffffs.",
".sfkfffffffkffs.",
".sffffffffffffs.",
"..sffffffkkffs..",
"...sffffffffs...",
"..ssttttttttss..",
".sfttwwwwwwttfs.",
".sfttwwwwwwttfs.",
"..sTttttttttTs..",
"...tttttttttt...",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['RANGER'] = dict(pal={'c': '#3f7a34', 'C': '#2f5c26', 'f': '#e0a878', 'F': '#c08454',
                           'v': '#b89a68', 'V': '#967c4e', 't': '#4a7a3e', 'p': '#5a4632', 'w': '#3a2e20'},
spr=rows(
"....ssssssss....",
"..ssccccccccss..",
".sccccccccccccc.",
".ssccccccccccss.",
"..sffffffffffs..",
".sfkfffffffkffs.",
".sffffffffffffs.",
"..sffffffffffs..",
"...sffffffffs...",
"..ssvvvvvvvvss..",
".sfvttvvvvttvfs.",
".sfvttvvvvttvfs.",
"..sVvvvvvvvvVs..",
"...vvvvvvvvvv...",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['SCOUT'] = dict(pal={'h': '#6a4a9e', 'H': '#8668bc', 'f': '#c89878', 'F': '#a87c58',
                          'r': '#d05848', 't': '#4a3a6e', 'T': '#372a54', 'p': '#2c3242', 'w': '#e8e4da'},
spr=rows(
"....ssssssss....",
"..sshhhhhhhhss..",
".shHHhhhhhhHHhs.",
".shhhhhhhhhhhhs.",
".shffffffffffhs.",
".shfkfffffkffhs.",
".shffffffffffhs.",
"..sffffffffffs..",
"..ssrrrrrrrrss..",
"..ssttttttttss..",
".sfttttttttttfs.",
".sfTttttttttTfs.",
"..sTttttttttTs..",
"...tttttttttt...",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['PIP'] = dict(pal={'c': '#f0c020', 'C': '#d0a018', 'f': '#f0bc94', 'F': '#d09a6e',
                        't': '#f07830', 'T': '#d05c1c', 'p': '#3a6ab0', 'w': '#f0ece2'},
spr=rows(
"....ssssssss....",
"..ssccccccccss..",
".sccccccccccccc.",
"..ssffffffffss..",
".sfkfffffffkffs.",
".sfffFffffFfffs.",
".sffffffffffffs.",
"..sffffffffffs..",
"..ssttttttttss..",
".sfttttttttttfs.",
".sfTttttttttTfs.",
"..stttttttttts..",
"...spppppppps...",
"...sppssppps....",
"...sppssppps....",
"..sswwsswwss...."))

CHAR['ELDER'] = dict(pal={'g': '#c8c8ce', 'G': '#a2a2ac', 'f': '#d8a070', 'F': '#bc8452',
                          'r': '#7a5a3a', 'R': '#5e442a', 'w': '#8a6a48'},
spr=rows(
"....ssssssss....",
"..ssggggggggss..",
".sggggggggggggs.",
".sffffffffffffs.",
".sfkfffffffkffs.",
".sfggggggggggfs.",
".sggggggggggggs.",
".sgggGggggGgggs.",
"..sgggggggggs...",
"..ssrrrrrrrrssw.",
".sfrrrrrrrrrfsw.",
".sfRrrrrrrrrRsw.",
"..srrrrrrrrrrsw.",
"...rrrrrrrrrrsw.",
"...srrrrrrrrssw.",
"...srrrssrrsssw.",
"...srrrssrrsssw.",
"...srrrssrrsssw.",
"...srrrssrrsssw.",
"..sssssssssssw.."))

CHAR['BOTTIE'] = dict(pal={'c': '#c8ccd4', 'C': '#8a909c', 'L': '#eef0f4', 'v': '#101018',
                           'b': '#57b8ff', 'n': '#14100c', 'p': '#d4d8de', 'P': '#9aa0aa',
                           'g': '#f0d060', 'e': '#58c048', 'd': '#1c1c22'},
spr=rows(
"......ssssssss......",
"....ssccccccccss....",
"...scLLccccccLLcs...",
"..scLccccccccccLcs..",
"..scvvvvvvvvvvvcs...",
"..scvbbvvvvbbvvcs...",
"..scvvvvvvvvvvvcs...",
"...scvvbbbbvvvcs....",
"...scvvbvvvbvcs.....",
"....scvvvvvvcs......",
"..nnssssssssssnn....",
"..nnsppppppppsnn....",
"..nnsppggggppsnn....",
"...nspppgeegppsn....",
"...nsppppggppsn.....",
"....sppppppppps.....",
"....sPPppppppPPs....",
"....sppppppppps.....",
"....sddddddddds.....",
"....sdddsddddds.....",
"....sdddsddddds.....",
"....sdddsddddds.....",
"...ssccssccsss......",
"...................."))

def validate():
    for name, ch in CHAR.items():
        pal = ch['pal']; spr = ch['spr']
        w = len(spr[0])
        for r in spr:
            assert len(r) == w, (name, 'ragged', r)
            for px in r:
                assert px in pal or px in 'sk.', (name, 'bad char', px)
    print('art valid:', {k: (len(v['spr'][0]), len(v['spr'])) for k, v in CHAR.items()})

def sheet():
    scale = 8; pad = 14
    W = sum(len(c['spr'][0]) for c in CHAR.values()) * scale + pad * (len(CHAR) + 1)
    H = 24 * scale + pad * 2 + 12
    img = Image.new('RGB', (W, H), (24, 28, 20))
    x = pad
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    for name, ch in CHAR.items():
        spr, pal = ch['spr'], ch['pal']
        for yy, row in enumerate(spr):
            for xx, px in enumerate(row):
                if px == '.': continue
                col = '#14101e' if px in 'sk' else pal[px]
                d.rectangle([x + xx * scale, pad + yy * scale, x + xx * scale + scale - 1, pad + yy * scale + scale - 1], fill=col)
        d.text((x, H - 12), name, fill=(240, 240, 240))
        x += len(spr[0]) * scale + pad
    img.save('/tmp/charsheet.png')
    print('sheet saved')

if __name__ == '__main__':
    validate(); sheet()
