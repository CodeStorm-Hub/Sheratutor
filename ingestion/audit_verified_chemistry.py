import json
import os
from pathlib import Path

cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")
fig_dir = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn")

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

def main():
    print("="*60)
    print("AUDIT & VERIFICATION REPORT: NCTB Chemistry (Bengali Edition)")
    print("="*60)

    total_expected_pages = 309 - 6 + 1
    cached_pages = list(cache_dir.glob("page_*.json"))
    print(f"Total cached pages found: {len(cached_pages)} / {total_expected_pages}")

    all_valid = True
    missing_pages = []
    total_diagrams = 0
    total_chars = 0
    chapter_stats = []

    for ch_no, start_p, end_p, title in CHAPTERS:
        ch_pages = 0
        ch_chars = 0
        ch_diagrams = 0
        ch_tables = 0
        ch_eqs = 0

        for pno in range(start_p, end_p + 1):
            pfile = cache_dir / f"page_{pno:04d}.json"
            if not pfile.exists():
                missing_pages.append(pno)
                all_valid = False
                continue
            
            ch_pages += 1
            data = json.loads(pfile.read_text(encoding="utf-8"))
            
            # Validation assertions
            assert data["page_no"] == pno, f"Page mismatch in {pfile}"
            assert data["chapter_no"] == ch_no, f"Chapter mismatch in {pfile}"
            assert data["lang"] == "bn", f"Lang mismatch in {pfile}"
            assert len(data["markdown"]) > 50, f"Empty markdown in {pfile}"
            
            ch_chars += len(data["markdown"])
            if data.get("tables_present"):
                ch_tables += 1
            if data.get("has_equations"):
                ch_eqs += 1
                
            for d in data.get("diagrams", []):
                ch_diagrams += 1
                img_path = Path("/home/syed/workspace/Sheratutor") / d["local_path"]
                assert img_path.exists(), f"Missing diagram file: {img_path}"

        total_chars += ch_chars
        total_diagrams += ch_diagrams

        chapter_stats.append({
            "ch_no": ch_no,
            "title": title,
            "pages": f"{start_p:03d} - {end_p:03d} ({ch_pages} pgs)",
            "chars": ch_chars,
            "avg_chars": round(ch_chars / max(ch_pages, 1)),
            "diagrams": ch_diagrams,
            "tables": ch_tables,
            "equations": ch_eqs
        })

    print(f"\n{'Ch':<4} | {'Title':<45} | {'Pages':<18} | {'Chars':<8} | {'Avg/Pg':<7} | {'Figs':<5} | {'Eqs':<4}")
    print("-" * 105)
    for s in chapter_stats:
        print(f"{s['ch_no']:<4} | {s['title'][:45]:<45} | {s['pages']:<18} | {s['chars']:<8} | {s['avg_chars']:<7} | {s['diagrams']:<5} | {s['equations']:<4}")
    print("-" * 105)
    print(f"TOTAL: 304 pages | Total Chars: {total_chars:,} | Total Scientific Diagrams: {total_diagrams}")

    if missing_pages:
        print(f"\nMISSING PAGES ({len(missing_pages)}): {missing_pages}")
    else:
        print("\nSUCCESS: All 304 pages from 0006 to 0309 are fully extracted and verified!")

if __name__ == "__main__":
    main()
