import os
import json
from pathlib import Path
from PIL import Image

figures_dir = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry")
all_pngs = sorted(list(figures_dir.rglob("*.png")))

CHAPTER_TITLES = {
    0: ("Front Matter & Index", "ভূমিকা ও সূচিপত্র"),
    1: ("Concepts of Chemistry", "রসায়নের ধারণা"),
    2: ("States of Matter", "পদার্থের অবস্থা"),
    3: ("Structure of Matter", "পদার্থের গঠন"),
    4: ("Periodic Table", "পর্যায় সারণি"),
    5: ("Chemical Bonds", "রাসায়নিক বন্ধন"),
    6: ("Concept of Mole and Chemical Calculation", "মোলের ধারণা ও রাসায়নিক গণনা"),
    7: ("Chemical Reactions", "রাসায়নিক বিক্রিয়া"),
    8: ("Chemistry and Energy", "রসায়ন ও শক্তি"),
    9: ("Acid-Base Balance", "এসিড-ক্ষার সমতা"),
    10: ("Mineral Resources: Metal-Nonmetal", "খনিজ সম্পদ: ধাতু-অধাতু"),
    11: ("Mineral Resources: Fossils", "খনিজ সম্পদ: জীবাশ্ম"),
    12: ("Chemistry in Our Life", "আমাদের জীবনে রসায়ন"),
}

records = []
for p in all_pngs:
    rel = p.relative_to(figures_dir)
    # rel is like: bn/ch_01/p006_fig_01.png
    parts = rel.parts
    lang = parts[0]
    ch_str = parts[1]
    ch_no = int(ch_str.replace("ch_", ""))
    fname = parts[2]
    
    # parse page and fig idx
    # format: p006_fig_01.png
    try:
        page_str = fname.split("_")[0].replace("p", "")
        page_no = int(page_str)
        fig_idx = int(fname.split("_")[2].replace(".png", ""))
    except:
        page_no = 0
        fig_idx = 0
        
    try:
        with Image.open(p) as img:
            w, h = img.size
    except:
        w, h = 0, 0
        
    titles = CHAPTER_TITLES.get(ch_no, ("General", "সাধারণ"))
    cdn_url = f"https://qjottictwewysfcjirma.supabase.co/storage/v1/object/public/curriculum-assets/chemistry/{rel}"
    
    records.append({
        "id": f"chem_{lang}_ch{ch_no:02d}_{fname.replace('.png', '')}",
        "lang": lang,
        "chapter_no": ch_no,
        "chapter_title_en": titles[0],
        "chapter_title_bn": titles[1],
        "page_no": page_no,
        "fig_idx": fig_idx,
        "filename": fname,
        "width": w,
        "height": h,
        "aspect_ratio": round(w / h, 2) if h > 0 else 1.0,
        "cdn_url": cdn_url,
        "local_path": str(p),
    })

print(f"Compiled metadata for {len(records)} figures.")
bn_count = sum(1 for r in records if r["lang"] == "bn")
en_count = sum(1 for r in records if r["lang"] == "en")
print(f"Bengali: {bn_count}, English: {en_count}")

out_path = figures_dir / "all_407_figures_metadata.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"Saved to {out_path}")
