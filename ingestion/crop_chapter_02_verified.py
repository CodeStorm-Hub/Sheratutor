import fitz
from PIL import Image
from pathlib import Path
import shutil

doc = fitz.open('/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf')
src_dir = Path('/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn/ch_02')
dst_dir = Path('/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn/ch_02')
dst_dir.mkdir(parents=True, exist_ok=True)

# 1. Direct copy of clean standalone figures
clean_figs = [
    'p022_fig_01.png', # Cover illustration
    'p025_fig_02.png', # Particle model
    'p026_fig_01.png', # KMnO4 diffusion
    'p027_fig_01.png', # Ink diffusion
    'p028_fig_01.png', # NH3 & HCl gas diffusion
    'p030_fig_01.png', # Candle burning
    'p034_fig_01.png', # Heating curve of ice
    'p035_fig_01.png', # Cooling curve of water vapor
    'p036_fig_01.png', # Sublimation schematic
    'p037_fig_01.png', # Sublimation apparatus
    'p038_fig_01.png', # MCQ heating curve
    'p039_fig_01.png', # Two beakers (iodine/salt, sand/glucose)
    'p039_fig_02.png'  # Diffusion tube CQ stimulus
]

for f in clean_figs:
    s = src_dir / f
    if s.exists():
        # Rename p025_fig_02 to p025_fig_01 in verified dir to keep clean indexing
        target_name = 'p025_fig_01.png' if f == 'p025_fig_02.png' else f
        shutil.copy2(s, dst_dir / target_name)
        print(f"Copied {f} -> {target_name}")

# 2. Precision recrop for figures that had embedded text:
# Page 31: Urea melting apparatus (left side only + caption)
p31 = doc[30]
# Page 31 apparatus is located in bottom-left
# Let's crop x: 40..270, y: 350..660 in pts
clip_p31 = fitz.Rect(40, 360, 275, 660)
pix31 = p31.get_pixmap(clip=clip_p31, dpi=300)
pix31.save(str(dst_dir / 'p031_fig_01.png'))
print("Cropped clean p031_fig_01.png (Urea melting point apparatus)")

# Page 32: Wax melting apparatus (left side only + caption)
p32 = doc[31]
clip_p32 = fitz.Rect(40, 160, 250, 640)
pix32 = p32.get_pixmap(clip=clip_p32, dpi=300)
pix32.save(str(dst_dir / 'p032_fig_01.png'))
print("Cropped clean p032_fig_01.png (Wax melting point apparatus)")

# Page 33: Water boiling apparatus (apparatus only + caption)
p33 = doc[32]
clip_p33 = fitz.Rect(70, 180, 450, 670)
pix33 = p33.get_pixmap(clip=clip_p33, dpi=300)
pix33.save(str(dst_dir / 'p033_fig_01.png'))
print("Cropped clean p033_fig_01.png (Water boiling point apparatus)")

print("Chapter 2 verified figures cropping complete!")
