import json
from pathlib import Path
from PIL import Image

raw_figs_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn")
ver_figs_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn")
cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")

CHAPTERS = [
    (1, 6, 21, "রসায়নের ধারণা (Concepts of Chemistry)"),
    (2, 22, 39, "পদার্থের অবস্থা (States of Matter)"),
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

for ch_no, start_p, end_p, title in CHAPTERS:
    ch_str = f"ch_{ch_no:02d}"
    raw_dir = raw_figs_base / ch_str
    ver_dir = ver_figs_base / ch_str
    
    raw_files = sorted([f.name for f in raw_dir.glob("*.png")]) if raw_dir.exists() else []
    ver_files = sorted([f.name for f in ver_dir.glob("*.png")]) if ver_dir.exists() else []
    discarded = set(raw_files) - set(ver_files)
    
    print(f"\n========================================================")
    print(f"CHAPTER {ch_no:02d}: {title}")
    print(f"  Raw: {len(raw_files)} | Verified: {len(ver_files)} | Discarded: {len(discarded)}")
    if discarded:
        print(f"  Discarded list: {sorted(discarded)}")
    
    # Check captions stored in verified cache
    for pno in range(start_p, end_p + 1):
        pf = cache_dir / f"page_{pno:04d}.json"
        if pf.exists():
            d = json.loads(pf.read_text(encoding="utf-8"))
            for fig in d.get("diagrams", []):
                print(f"    Page {pno:03d} | {fig['figure_id']} | Caption: {fig['caption'][:60]}")
