import fitz
import os
from PIL import Image

for lang in ['bn', 'en']:
    print(f"\n====================== {lang.upper()} CROPS PAGES 9-16 ======================")
    ch_dir = f"/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/{lang}/ch_01"
    files = sorted([f for f in os.listdir(ch_dir) if any(f"p0{p:02d}" in f for p in range(9, 17))])
    
    for f in files:
        fpath = os.path.join(ch_dir, f)
        with Image.open(fpath) as img:
            w, h = img.size
            # calculate average color or check if it's mostly text/white
            # Let's see aspect ratio and dimensions
            print(f"{f} -> size: {w}x{h} (aspect: {w/h:.2f})")
