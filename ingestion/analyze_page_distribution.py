import json
from pathlib import Path

manifest_path = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/chemistry_multimodal_master_catalog.json")
with open(manifest_path, "r", encoding="utf-8") as f:
    items = json.load(f)

bn_pages = set()
en_pages = set()

bn_fig_count = 0
en_fig_count = 0

for it in items:
    if it.get("bn_asset_path"):
        bn_pages.add(it["page_no"])
        bn_fig_count += 1
    if it.get("en_asset_path"):
        en_pages.add(it["page_no"])
        en_fig_count += 1

all_pages = set(range(1, 311))

bn_no_diag_pages = sorted(list(all_pages - bn_pages))
en_no_diag_pages = sorted(list(all_pages - en_pages))

print(f"Total Pages per book: 310")
print(f"Bengali figures: {bn_fig_count} across {len(bn_pages)} unique pages. Pages without diagrams: {len(bn_no_diag_pages)}")
print(f"English figures: {en_fig_count} across {len(en_pages)} unique pages. Pages without diagrams: {len(en_no_diag_pages)}")

print(f"\nSample Bengali pages with NO diagrams (first 15): {bn_no_diag_pages[:15]}")
print(f"Sample English pages with NO diagrams (first 15): {en_no_diag_pages[:15]}")
