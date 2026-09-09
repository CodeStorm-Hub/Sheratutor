#!/usr/bin/env python3
"""
Uploads all 407 extracted NCTB Chemistry diagram crops to Supabase Storage.
Bucket: 'curriculum-assets'
Path format: chemistry/{bn,en}/ch_{XX}/p{YYY}_fig_{ZZ}.png
"""

import os
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not sb_url or not sb_key:
    print("Error: Supabase credentials missing in .env")
    sys.exit(1)

supabase = create_client(sb_url, sb_key)
bucket_name = "curriculum-assets"

figures_dir = Path(__file__).parent / "output/figures/chemistry"
all_files = sorted(list(figures_dir.rglob("*.png")))

print(f"Found {len(all_files)} figure files to upload to Supabase bucket '{bucket_name}'...")

def upload_single_file(file_path: Path) -> tuple[str, bool, str]:
    # Relative path from chemistry/
    rel_path = file_path.relative_to(figures_dir)
    storage_path = f"chemistry/{rel_path}"
    
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        
        # Upload with upsert=True
        supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": "image/png", "upsert": "true"}
        )
        pub_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        return (storage_path, True, pub_url)
    except Exception as e:
        return (storage_path, False, str(e))

success_count = 0
fail_count = 0
uploaded_urls = {}

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(upload_single_file, f): f for f in all_files}
    for idx, future in enumerate(as_completed(futures), start=1):
        storage_path, success, info = future.result()
        if success:
            success_count += 1
            uploaded_urls[storage_path] = info
            if success_count % 50 == 0 or success_count == len(all_files):
                print(f"[{idx}/{len(all_files)}] Uploaded {success_count} diagrams successfully...")
        else:
            fail_count += 1
            print(f"[{idx}/{len(all_files)}] Failed to upload {storage_path}: {info}")

print(f"\nUpload complete!")
print(f"Total uploaded: {success_count}/{len(all_files)}")
print(f"Failures: {fail_count}")

# Save uploaded URLs map
output_map_path = figures_dir / "uploaded_supabase_urls.json"
import json
with open(output_map_path, "w", encoding="utf-8") as f:
    json.dump({
        "total_files": len(all_files),
        "success_count": success_count,
        "bucket": bucket_name,
        "base_cdn_url": f"{sb_url}/storage/v1/object/public/{bucket_name}",
        "urls": uploaded_urls
    }, f, indent=2)

print(f"URL map saved to {output_map_path}")
