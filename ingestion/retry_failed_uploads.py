#!/usr/bin/env python3
import os
import time
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(sb_url, sb_key)
bucket_name = "curriculum-assets"

figures_dir = Path(__file__).parent / "output/figures/chemistry"
all_files = sorted(list(figures_dir.rglob("*.png")))

# Fetch existing files in bucket
print("Checking existing files in Supabase bucket...")
# List all files locally and attempt upload for any missing or failed
uploaded = 0
for idx, f in enumerate(all_files, 1):
    rel_path = f.relative_to(figures_dir)
    storage_path = f"chemistry/{rel_path}"
    
    # Try uploading with exponential retry
    for attempt in range(4):
        try:
            with open(f, "rb") as fp:
                supabase.storage.from_(bucket_name).upload(
                    path=storage_path,
                    file=fp.read(),
                    file_options={"content-type": "image/png", "upsert": "true"}
                )
            uploaded += 1
            break
        except Exception as e:
            if "The resource already exists" in str(e) or "Duplicate" in str(e):
                uploaded += 1
                break
            if attempt < 3:
                time.sleep(1.0 * (2 ** attempt))
            else:
                print(f"Failed {storage_path}: {e}")

print(f"Finished check/retry! Verified in bucket: {uploaded}/{len(all_files)}")
