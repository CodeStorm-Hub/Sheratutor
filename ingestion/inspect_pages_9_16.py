import fitz
from PIL import Image
import os

doc_bn = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")
doc_en = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_en.pdf")

os.makedirs("/tmp/inspect_p9_16", exist_ok=True)

# Render full pages 9 to 16 for both bn and en
for p in range(9, 17):
    # page is 1-indexed, so load_page(p - 1)
    p_bn = doc_bn.load_page(p - 1)
    pix_bn = p_bn.get_pixmap(dpi=150)
    pix_bn.save(f"/tmp/inspect_p9_16/full_bn_p{p:02d}.png")
    
    p_en = doc_en.load_page(p - 1)
    pix_en = p_en.get_pixmap(dpi=150)
    pix_en.save(f"/tmp/inspect_p9_16/full_en_p{p:02d}.png")

print("Rendered full pages 9 to 16 to /tmp/inspect_p9_16/")

# Check cropped figures details for pages 9 to 16
for lang in ['bn', 'en']:
    print(f"\n=================== {lang.upper()} CROPS (p9-p16) ===================")
    ch_dir = f"/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/{lang}/ch_01"
    files = sorted([f for f in os.listdir(ch_dir) if any(f"p0{p:02d}" in f for p in range(9, 17))])
    for f in files:
        fpath = os.path.join(ch_dir, f)
        with Image.open(fpath) as img:
            w, h = img.size
        print(f"{f}: {w}x{h} px")
