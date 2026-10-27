import sys, glob, os
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; fs = sorted(glob.glob(src + '/*.jpg')); w, h, g, cols = 640, 360, 10, 4
rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (cols * (w + g), max(1, rows) * (h + g)), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    x = (i % cols) * (w + g); y = (i // cols) * (h + g); S.paste(Image.open(f).resize((w, h)), (x, y)); d.text((x + 6, y + 6), os.path.basename(f), fill='magenta')
S.save(out, quality=85)
