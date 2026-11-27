# Sproutwild v4.3 — the three starters + their evolutions, redrawn bigger (24 wide)
# and with actual character design: Cindercap the fire-cap imp, Drizzlet the
# water fawn, Fernfang the fern wolf. PIL previews before anything ships.
from PIL import Image

ART = {
# ---------------- CINDERCAP: a mushroom imp wearing a living ember cap -------
"CINDERCAP": dict(pal={'s':'#3a1428','r':'#c23b1e','o':'#f07830','y':'#f8d040','c':'#f8e8c8','b':'#e0b890','k':'#241018','f':'#a02818','w':'#ffffff'}, rows=[
".........ss...yy........",
"........srrs.ywwy.......",
".......srrrrs.yy........",
"......sroooors..........",
".....srooccoors.........",
"....sroooooooors........",
"...sroocoooocoors.......",
"...sroooooooors.........",
"..srrfrrrrrrfrrs........",
"..sccccccccccccs........",
"..sckkccccckkcs.........",
"..sccccccccccccs........",
"...scckwwkcccs..........",
"....sbbbbbbbs...........",
"...fsbbbbbbbsf..........",
"...fsbbbbbbbsf..........",
"....sbbbbbbbs...........",
".....ff..ff.............",
"....sffs.sffs...........",
"........................",
]),
# ---------------- EMBERCAP: the cap becomes a little volcano -----------------
"EMBERCAP": dict(pal={'s':'#2c0e1c','r':'#8e2413','o':'#d84a28','y':'#f8d040','c':'#f8e0bc','b':'#d8a878','k':'#1c0a10','l':'#f07830','w':'#ffffff'}, rows=[
"........syyys...........",
".......sywwwys..........",
"......ssyyyyss..........",
".....srrrrrrrrs.........",
"....srrylrrryrrs........",
"...srrylrrrrlrrys.......",
"...srrrrrrrrrrrrs.......",
"..srrryrrrrryrrrrs......",
"..sccccccccccccccs......",
"..sckkccccccckkcs.......",
"...scccccccccccs........",
"....scckwwkcccs.........",
"....sbbbbbbbbb s........",
"..ffsbbbbbbbbbsff.......",
"....sbbbbbbbbs..........",
"....sbbbbbbbbs..........",
".....ff....ff...........",
"....sffs..sffs..........",
"........................",
]),
# ---------------- DRIZZLET: a water fawn with droplet antlers ----------------
"DRIZZLET": dict(pal={'s':'#14283e','b':'#48a0f0','d':'#2a68b8','l':'#a8d8f8','w':'#eaf6ff','k':'#101c2c','p':'#f0a0b8'}, rows=[
".....sls........sls.....",
"....sllbs......sbl ls....".replace(' ',''),
"....sbbbs......sbbbs....",
".....sbs..ss....sbs.....",
"....sbbbbbbbbsbbs.......",
"...sbbbbbbbbbbbbbs......",
"...sbkbbbllbbbkbbbs.....".replace(".....","...."),
"...sbbbbbbppbbbbs.......",
"....sbbbbbbbbbs.........",
".....swwwwwwws..........",
"....sbwwwwwwbs....sbls..",
"....sbwwwwwwbs...sbbbs..",
"....sbbbbbbbbs....sbs...",
".....sbbbbbs............",
"....sbb...bbs...........",
"....sbs...sbs...........",
"...sdds...sdds..........",
"........................",
"........................",
"........................",
]),
# ---------------- TIDESTAG: the fawn grown into a wave-antlered stag ---------
"TIDESTAG": dict(pal={'s':'#10223a','b':'#3a8ad8','d':'#20508e','l':'#8fcbf8','w':'#eaf6ff','k':'#0c1626','f':'#dff2ff'}, rows=[
"..sls...sls...sls...sls.",
".sllbs.sllbs.sllbs.slbbs",
".sbbbs.sbbbs.sbbbs.sbbs.",
"..sbs...sbs...sbs...sbs.",
"...sbbbbbbbbbbbbbbbs....",
"..sbkbbbbbbbbbbbkbbbs...",
"..sbbbbbbbppbbbbbbbs....",
"...sbbbbbbbbbbbbbbs.....",
"..sffbbbbbbbbbbffbs.....",
"....swwwwwwwwws.........",
"...sbwwwwwwwwbs...sbls..",
"...sbwwwwwwwwbs..sbbbs..",
"...sbbbbbbbbbbbs..sbs...",
"....sbbbbbbbbbs.........",
"....sbb....bbs..........",
"....sbb....bbs..........",
"...sdds....sdds.........",
"........................",
"........................",
"........................",
]),
# ---------------- FERNFANG: a wolf pup in a fern mane -------------------------
"FERNFANG": dict(pal={'s':'#14301a','g':'#58c048','d':'#2f7a2e','l':'#a0e888','c':'#f0e8c8','k':'#0e1c10','w':'#ffffff'}, rows=[
"...sggs........sggs.....",
"..sgllgs......sgllgs....",
"..sgglgssssssglgggs.....",
".sggggggggggggggggs.....",
".sgddgdgdgdgdgddgs.....",
"..sgggggggggggggs.......",
"...sgccccccccgs.........",
"...sgckcccckcgs.........",
"....scckkkkccs..........",
"....scccccccs....sgls...",
".....sgggggs....sgggs...",
"....sgggggggs....sgs....",
"....sgggggggs...........",
".....sggggs.............",
"....sgg..ggs............",
"....sgs..sgs............",
"...sdds...sdds..........",
"........................",
"........................",
"........................",
]),
# ---------------- FERNHOWL: the pup grown into a fern-maned wolf -------------
"FERNHOWL": dict(pal={'s':'#0f2814','g':'#4cb040','d':'#256b24','l':'#98e078','c':'#f0e8c8','k':'#0a180c','w':'#ffffff'}, rows=[
"..sggs....ss....sggs....",
".sgllgs..sgggs..sgllgs..",
".sggggsssggggsssgggggs..",
"sgggggggggggggggggggggs.",
"sgddggggggggggggggddgs..",
".sgggggggggggggggggs....",
"..sggccccccccccggs......",
"..sgckkcccccckkcgs......",
"...sgccc kkcc cgs.......".replace(" ",""),
"...sgcccccccc cgs.......".replace(' ',''),
"....sgdgdgdggs...sgls...",
"...sggggggggggs.sgggs...",
"...sggggggggggs..sgs....",
"....sggggggggs..........",
"....sggg..gggs..........",
"....sgg....ggs..........",
"....sgg....ggs..........",
"...sdds....sdds.........",
"........................",
"........................",
]),
}

def render(rows, pal, scale=6):
    h = len(rows); w = max(len(r) for r in rows)
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch in pal:
                c = pal[ch]; px[x, y] = tuple(int(c[i:i+2], 16) for i in (1, 3, 5)) + (255,)
    return img.resize((w * scale, h * scale), Image.NEAREST)

if __name__ == '__main__':
    ids = list(ART)
    cell = 24 * 6 + 16
    sheet = Image.new('RGBA', (cell * 3, cell * 2 + 40), (91, 162, 68, 255))
    for i, sid in enumerate(ids):
        a = ART[sid]
        sheet.alpha_composite(render(a['rows'], a['pal']), ((i % 3) * cell + 8, (i // 3) * cell + 8))
    sheet.convert('RGB').save('/tmp/starters3.png')
    print('preview:', ids)
