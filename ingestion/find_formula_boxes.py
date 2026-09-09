import subprocess
from pathlib import Path
from PIL import Image

ver_figs_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn")

print(f"{'Ch':<4} | {'Figure ID':<15} | {'Size':<12} | {'Aspect':<6} | {'Sample OCR / Description'}")
print("-" * 80)

candidates_for_review = []

for ch in range(1, 13):
    ch_str = f"ch_{ch:02d}"
    ch_dir = ver_figs_base / ch_str
    if not ch_dir.exists(): continue
    for fpath in sorted(ch_dir.glob("*.png")):
        im = Image.open(fpath)
        w, h = im.size
        aspect = round(w / h, 2)
        res = subprocess.run(["tesseract", str(fpath), "stdout", "-l", "ben+eng"], capture_output=True, text=True)
        txt = res.stdout.strip().replace("\n", " ")[:60]
        
        # Check if it looks like a formula / single line equation box
        is_formula_candidate = False
        if aspect > 2.5 and h < 450:
            is_formula_candidate = True
        if any(eq in txt for eq in ["<", ">", "—>", "->", "=", "1s", "2s", "mol", "গ্রাম", "অংশ"]):
            is_formula_candidate = True
            
        status = "[FORMULA/TEXT?]" if is_formula_candidate else "[OK DIAGRAM]"
        if is_formula_candidate:
            candidates_for_review.append((ch, fpath.name, (w, h), aspect, txt))
        # print first 50
        # print(f"{ch:<4} | {fpath.stem:<15} | {str((w,h)):<12} | {aspect:<6} | {status} {txt}")

print(f"Total candidates flagged as formula/callout boxes: {len(candidates_for_review)}")
for c in candidates_for_review:
    print(f"Ch {c[0]:02d} | {c[1]:<16} | {str(c[2]):<12} | ar={c[3]:<4} | {c[4]}")
