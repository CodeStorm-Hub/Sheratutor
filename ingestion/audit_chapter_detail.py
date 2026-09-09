import fitz
import json
import re
from pathlib import Path

doc = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")
cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")
raw_figs_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn")
ver_figs_base = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn")

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

def audit_chapter(ch_no):
    ch_info = CHAPTERS[ch_no - 1]
    start_p, end_p, title = ch_info[1], ch_info[2], ch_info[3]
    ch_str = f"ch_{ch_no:02d}"
    
    raw_figs = sorted([f.name for f in (raw_figs_base / ch_str).glob("*.png")]) if (raw_figs_base / ch_str).exists() else []
    ver_figs = sorted([f.name for f in (ver_figs_base / ch_str).glob("*.png")]) if (ver_figs_base / ch_str).exists() else []
    
    print(f"\n{'='*70}")
    print(f"CHAPTER {ch_no:02d}: {title}")
    print(f"Pages: {start_p:03d} to {end_p:03d} ({end_p - start_p + 1} pages)")
    print(f"Raw Figures Detected: {len(raw_figs)}")
    print(f"Verified Figures: {len(ver_figs)}")
    print(f"{'='*70}")
    
    # Check page by page
    for pno in range(start_p, end_p + 1):
        pf = cache_dir / f"page_{pno:04d}.json"
        if not pf.exists():
            print(f"  [MISSING PAGE FILE] Page {pno:03d}")
            continue
        data = json.loads(pf.read_text(encoding="utf-8"))
        figs = [d["figure_id"] for d in data.get("diagrams", [])]
        md = data.get("markdown", "")
        
        # Search for figure mentions
        mentions = re.findall(r"(চিত্র[\s\:\-\d\.]+)", md)
        
        # Check for typical OCR anomalies in this page
        anomalies = []
        if "শস্তি" in md: anomalies.append("শস্তি -> শক্তি")
        if "বিকিয়া" in md or "বিত্রিয়া" in md: anomalies.append("OCR error in বিক্রিয়া")
        if "অনূ" in md: anomalies.append("অনূ -> অণু")
        if "পেনট্রোলিয়াম" in md: anomalies.append("পেনট্রোলিয়াম -> পেট্রোলিয়াম")
        if "আযামোনিয়া" in md: anomalies.append("আযামোনিয়া -> অ্যামোনিয়া")
        if "“ES" in md: anomalies.append("“ES -> শক্তিক্রম")
        if "BA" in md and "নীলের" in md: anomalies.append("BA -> দ্রবণ")
        
        fig_str = f"Figs: {len(figs)}" if figs else "No figs"
        anomaly_str = f" | Alerts: {', '.join(anomalies)}" if anomalies else ""
        print(f"  Page {pno:03d}: {len(md):4d} chars | {fig_str:<15} | Mentions: {mentions[:2]}{anomaly_str}")

if __name__ == "__main__":
    import sys
    ch = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    audit_chapter(ch)
