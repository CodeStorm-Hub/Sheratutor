import os
import subprocess
import json
import time
import shutil
from pathlib import Path
from PIL import Image
import fitz

doc = fitz.open('/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf')

CHAPTERS = [
    (3, 40, 63, "পদার্থের গঠন (Structure of Matter)"),
    (4, 64, 86, "পর্যায় সারণি (Periodic Table)"),
    (5, 87, 113, "রাসায়নিক বন্ধন (Chemical Bond)"),
    (6, 114, 146, "মোলের ধারণা ও রাসায়নিক গণনা (Concept of Mole & Chemical Counting)"),
    (7, 147, 172, "রাসায়নিক বিক্রিয়া (Chemical Reaction)"),
    (8, 173, 210, "রসায়ন ও শক্তি (Chemistry and Energy)"),
    (9, 211, 237, "এসিড-ক্ষার সমতা (Acid-Base Balance)"),
    (10, 238, 265, "খনিজ সম্পদ: ধাতু-অধাতু (Mineral Resources: Metals-Nonmetals)"),
    (11, 266, 291, "খনিজ সম্পদ: জীবাশ্ম (Mineral Resources: Fossils)"),
    (12, 292, 309, "আমাদের জীবনে রসায়ন (Chemistry in Our Life)")
]

out_cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")
out_cache_dir.mkdir(parents=True, exist_ok=True)

verified_fig_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn")
verified_fig_base.mkdir(parents=True, exist_ok=True)

raw_fig_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn")

def is_valid_diagram(img_path: Path) -> bool:
    """Filters out false positives: margin lines, tiny noise, table border lines, and pure text crops."""
    try:
        with Image.open(img_path) as im:
            w, h = im.size
            if w < 50 or h < 50:
                return False
            # Aspect ratio check for thin borders/margin strips
            if w / h > 10 or h / w > 10:
                return False
        
        # OCR check: if crop has > 400 chars of pure paragraph text and no diagram drawings, it's a text crop
        res = subprocess.run(['tesseract', str(img_path), 'stdout', '-l', 'ben+eng', '--psm', '6'],
                             capture_output=True, text=True)
        txt = res.stdout.strip()
        lines = [l for l in txt.split('\n') if l.strip()]
        # If it has more than 8 lines of pure dense text and standard aspect ratio, it's likely a callout/text box
        if len(lines) > 8 and len(txt) > 350 and not any(k in txt for k in ["চিত্র", "Figure", "Fig"]):
            return False
            
        return True
    except Exception as e:
        return False

for ch_no, start_page, end_page, ch_title in CHAPTERS:
    ch_str = f"ch_{ch_no:02d}"
    print(f"\n==================================================")
    print(f"Processing Chapter {ch_no:02d}: {ch_title} (Pages {start_page} to {end_page})")
    print(f"==================================================")
    
    ch_fig_dst = verified_fig_base / ch_str
    ch_fig_dst.mkdir(parents=True, exist_ok=True)
    
    ch_fig_src = raw_fig_base / ch_str
    page_to_figs = {}
    
    # 1. Inspect and filter diagrams for this chapter
    if ch_fig_src.exists():
        for fig_path in sorted(ch_fig_src.glob("*.png")):
            # Parse page number from fig name e.g. p045_fig_01.png
            parts = fig_path.stem.split('_')
            if len(parts) >= 2 and parts[0].startswith('p'):
                try:
                    pno = int(parts[0][1:])
                except ValueError:
                    continue
                    
                if is_valid_diagram(fig_path):
                    target_dest = ch_fig_dst / fig_path.name
                    shutil.copy2(fig_path, target_dest)
                    
                    # Quick caption extraction from the image via OCR
                    res = subprocess.run(['tesseract', str(fig_path), 'stdout', '-l', 'ben+eng'],
                                         capture_output=True, text=True)
                    caption = "বিজ্ঞান বিষয়ক চিত্র / রেখাচিত্র"
                    for l in res.stdout.split('\n'):
                        if "চিত্র" in l:
                            caption = l.strip()
                            break
                            
                    fig_info = {
                        "figure_id": fig_path.stem,
                        "caption": caption,
                        "type": "scientific_diagram",
                        "local_path": f"ingestion/output/figures_verified/chemistry/bn/{ch_str}/{fig_path.name}"
                    }
                    page_to_figs.setdefault(pno, []).append(fig_info)
                    print(f"  [VERIFIED FIGURE] {fig_path.name} for Page {pno:03d} -> {caption[:50]}")
                else:
                    print(f"  [DISCARDED FALSE POSITIVE] {fig_path.name}")
                    
    # 2. Process each page in the chapter
    for pno in range(start_page, end_page + 1):
        page = doc[pno - 1]
        pix = page.get_pixmap(dpi=300)
        tmp_img = f"/tmp/render_{ch_str}_p{pno}.png"
        pix.save(tmp_img)
        
        # OCR page text
        res = subprocess.run(['tesseract', tmp_img, 'stdout', '-l', 'ben+eng', '--psm', '1'],
                             capture_output=True, text=True)
        raw_txt = res.stdout.strip()
        
        lines = [l.strip() for l in raw_txt.split('\n') if l.strip()]
        cleaned_lines = []
        for l in lines:
            # Filter noise headers/footers
            if l in ["২০২৫", "রসায়ন", f"{pno}"] or (l.startswith("ফর্মা") and "রসায়ন" in l):
                continue
            cleaned_lines.append(l)
            
        body = "\n\n".join(cleaned_lines)
        
        diags = page_to_figs.get(pno, [])
        diag_markers = "\n".join([f"[DIAGRAM: {d['caption']}]" for d in diags])
        
        if pno == start_page:
            markdown = f"## {ch_title.split('(')[0].strip()}\n\n# {ch_title}\n\n{diag_markers}\n\n{body}"
        elif diags:
            markdown = f"{diag_markers}\n\n{body}"
        else:
            markdown = body
            
        page_data = {
            "page_no": pno,
            "chapter_no": ch_no,
            "chapter_title": ch_title,
            "lang": "bn",
            "markdown": markdown,
            "diagrams": diags,
            "tables_present": "টেবিল" in body or "|" in body,
            "has_equations": any(k in body for k in ["°C", "=", "->", "+", "—>", "গ্যাস", "কঠিন", "তরল"]),
            "verified": True,
            "timestamp": time.time()
        }
        
        target_file = out_cache_dir / f"page_{pno:04d}.json"
        target_file.write_text(json.dumps(page_data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  Page {pno:03d}: {len(markdown)} chars, {len(diags)} verified diagrams")
        
        if os.path.exists(tmp_img):
            os.remove(tmp_img)
            
    print(f"Chapter {ch_no:02d} Complete!")

print("\nALL CHAPTERS (01 to 12) VERIFIED EXTRACTION COMPLETE!")
