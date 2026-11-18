#!/usr/bin/env python3
"""Contact sheet of screenshots: python3 tests/sheet.py <glob> <out.png> [cols] [shrink]"""
import glob, sys
from PIL import Image
fs = sorted(glob.glob(sys.argv[1])); cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4; k = int(sys.argv[4]) if len(sys.argv) > 4 else 2
ims = [Image.open(f).convert('RGB') for f in fs]; w, h = ims[0].size
sh = Image.new('RGB', (w * cols, h * ((len(ims) + cols - 1) // cols)))
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * w, (i // cols) * h))
sh.resize((sh.width // k, sh.height // k), Image.NEAREST).save(sys.argv[2]); print(len(ims), 'shots ->', sys.argv[2])
