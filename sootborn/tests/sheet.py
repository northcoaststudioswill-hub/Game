import sys
from PIL import Image
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]; h = int(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols; sh = Image.new('RGB', (cols * w, rows * h), (0, 0, 0))
for i, im in enumerate(ims): sh.paste(im.resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
sh.save(out, quality=88)
