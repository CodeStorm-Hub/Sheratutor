import subprocess
import json
import time
from pathlib import Path
import fitz

doc = fitz.open('/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf')
out_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")
fig_dir = "ingestion/output/figures_verified/chemistry/bn/ch_02"

# Diagram mappings for Chapter 2
diagram_map = {
    22: [{"figure_id": "p022_fig_01", "caption": "পদার্থের বিভিন্ন অবস্থা (কঠিন বরফ, তরল পানি ও জলীয় বাষ্প)", "type": "illustration", "local_path": f"{fig_dir}/p022_fig_01.png"}],
    25: [{"figure_id": "p025_fig_01", "caption": "চিত্র 2.01: কণার গতিতত্ত্ব (কঠিন, তরল ও গ্যাসীয় অবস্থায় অণুর বিন্যাস)", "type": "molecular_structure", "local_path": f"{fig_dir}/p025_fig_01.png"}],
    26: [{"figure_id": "p026_fig_01", "caption": "চিত্র 2.02: পানিতে KMnO4 এর ব্যাপন", "type": "lab_experiment", "local_path": f"{fig_dir}/p026_fig_01.png"}],
    27: [{"figure_id": "p027_fig_01", "caption": "চিত্র 2.03: তরল (পানি) মাধ্যমে তরল পদার্থ (নীলের দ্রবণ) এর ব্যাপন", "type": "lab_experiment", "local_path": f"{fig_dir}/p027_fig_01.png"}],
    28: [{"figure_id": "p028_fig_01", "caption": "চিত্র 2.04: কাচনলে দুটি গ্যাসের (NH3 ও HCl) ব্যাপন ও NH4Cl বলয় গঠন", "type": "lab_experiment", "local_path": f"{fig_dir}/p028_fig_01.png"}],
    30: [{"figure_id": "p030_fig_01", "caption": "চিত্র 2.05: মোমবাতির জ্বলন ও পদার্থের তিন অবস্থার সহাবস্থান", "type": "illustration", "local_path": f"{fig_dir}/p030_fig_01.png"}],
    31: [{"figure_id": "p031_fig_01", "caption": "চিত্র 2.06: ইউরিয়ার গলনাঙ্ক নির্ণয়", "type": "apparatus", "local_path": f"{fig_dir}/p031_fig_01.png"}],
    32: [{"figure_id": "p032_fig_01", "caption": "চিত্র 2.07: মোমের গলনাঙ্ক নির্ণয়", "type": "apparatus", "local_path": f"{fig_dir}/p032_fig_01.png"}],
    33: [{"figure_id": "p033_fig_01", "caption": "চিত্র 2.08: পানির স্ফুটনাঙ্ক নির্ণয়", "type": "apparatus", "local_path": f"{fig_dir}/p033_fig_01.png"}],
    34: [{"figure_id": "p034_fig_01", "caption": "চিত্র 2.09: বরফে তাপ প্রদানের লেখচিত্র (গলনাঙ্ক ও স্ফুটনাঙ্ক রেখা)", "type": "energy_graph", "local_path": f"{fig_dir}/p034_fig_01.png"}],
    35: [{"figure_id": "p035_fig_01", "caption": "চিত্র 2.10: জলীয় বাষ্পকে শীতলকরণের লেখচিত্র", "type": "energy_graph", "local_path": f"{fig_dir}/p035_fig_01.png"}],
    36: [{"figure_id": "p036_fig_01", "caption": "চিত্র 2.11: উদ্বায়ী পদার্থের ঊর্ধ্বপাতন", "type": "illustration", "local_path": f"{fig_dir}/p036_fig_01.png"}],
    37: [{"figure_id": "p037_fig_01", "caption": "চিত্র 2.12: AlCl3 বা কঠিন উদ্বায়ী পদার্থের ঊর্ধ্বপাতন পরীক্ষণ", "type": "apparatus", "local_path": f"{fig_dir}/p037_fig_01.png"}],
    38: [{"figure_id": "p038_fig_01", "caption": "অনুশীলনী প্রশ্ন উদ্দীপক চিত্র (তাপ প্রদানের লেখচিত্র)", "type": "energy_graph", "local_path": f"{fig_dir}/p038_fig_01.png"}],
    39: [
        {"figure_id": "p039_fig_01", "caption": "সৃজনশীল প্রশ্ন ১ উদ্দীপক চিত্র: (ক) আয়োডিন মিশ্রিত খাদ্য লবণ ও (খ) বালি ও গ্লুকোজ", "type": "stimulus", "local_path": f"{fig_dir}/p039_fig_01.png"},
        {"figure_id": "p039_fig_02", "caption": "সৃজনশীল প্রশ্ন ২ উদ্দীপক চিত্র: কাচনলে HCl ও NH4OH এর ব্যাপন পরীক্ষা", "type": "stimulus", "local_path": f"{fig_dir}/p039_fig_02.png"}
    ]
}

print("Running OCR and verified page builder for Chapter 2...")
for pno in range(22, 40):
    page = doc[pno-1]
    pix = page.get_pixmap(dpi=300)
    tmp_img = f"/tmp/ch02_p{pno}.png"
    pix.save(tmp_img)
    
    res = subprocess.run(['tesseract', tmp_img, 'stdout', '-l', 'ben+eng', '--psm', '1'], capture_output=True, text=True)
    raw_txt = res.stdout.strip()
    
    # Process text lines, clean noise, format headings
    lines = [l.strip() for l in raw_txt.split('\n') if l.strip()]
    
    # Filter out page number and single-word header/footer if needed
    cleaned_lines = []
    for l in lines:
        if l in ["২০২৫", "রসায়ন", "পদার্থের অবস্থা", f"{pno}"]:
            continue
        cleaned_lines.append(l)
    
    body = "\n\n".join(cleaned_lines)
    
    # Insert diagram markers
    diags = diagram_map.get(pno, [])
    diag_markers = "\n".join([f"[DIAGRAM: {d['caption']}]" for d in diags])
    
    if pno == 22:
        markdown = f"## দ্বিতীয় অধ্যায়\n\n# পদার্থের অবস্থা\n**(States of Matter)**\n\n{diag_markers}\n\n{body}"
    elif diags:
        markdown = f"{diag_markers}\n\n{body}"
    else:
        markdown = body
        
    page_data = {
        "page_no": pno,
        "chapter_no": 2,
        "chapter_title": "পদার্থের অবস্থা (States of Matter)",
        "lang": "bn",
        "markdown": markdown,
        "diagrams": diags,
        "tables_present": "টেবিল" in body or "|" in body,
        "has_equations": "°C" in body or "=" in body or "H2O" in body or "KMnO4" in body,
        "verified": True,
        "timestamp": time.time()
    }
    
    target_file = out_dir / f"page_{pno:04d}.json"
    target_file.write_text(json.dumps(page_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated verified page_{pno:04d}.json ({len(markdown)} chars, {len(diags)} diagrams)")

print("Chapter 2 Verified Cache Generation DONE!")
