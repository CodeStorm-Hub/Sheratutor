#!/usr/bin/env python3
"""
Downloads all 2026 Class 9-10 textbooks (both Bangla and English versions)
from NCTB (https://nctb.gov.bd/pages/static-pages/695b99afc4774958d7b70612)
into the ingestion/textbooks directory.
"""

import os
import sys
import time
import ssl
import json
import urllib.request
import hashlib
from typing import Dict, Any, List

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEXTBOOKS_DIR = os.path.join(SCRIPT_DIR, "textbooks")
TARGETS_FILE = os.path.expanduser(
    "/home/kratzer/.gemini/antigravity-ide/brain/0a5673da-8d2f-4903-bba1-ed19f80a8449/scratch/all_targets.json"
)

def download_file(url: str, dest_path: str, expected_size: int, ctx: ssl.SSLContext, max_retries: int = 3) -> bool:
    part_path = dest_path + ".part"
    for attempt in range(1, max_retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            t0 = time.time()
            with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
                status = resp.status
                if status != 200:
                    raise RuntimeError(f"HTTP {status}")
                
                downloaded = 0
                with open(part_path, "wb") as f:
                    while True:
                        chunk = resp.read(1024 * 1024)
                        if not chunk:
                            break
                        f.write(chunk)
                        downloaded += len(chunk)
            
            elapsed = max(time.time() - t0, 0.001)
            mb = downloaded / (1024 * 1024)
            speed = mb / elapsed

            # Verify size
            if expected_size and downloaded != expected_size:
                print(f"    [!] Size mismatch on attempt {attempt}: got {downloaded}, expected {expected_size}")
                time.sleep(2)
                continue

            # Verify PDF magic header
            with open(part_path, "rb") as f:
                header = f.read(5)
                if not header.startswith(b"%PDF-"):
                    print(f"    [!] Invalid PDF magic bytes: {header}")
                    time.sleep(2)
                    continue

            os.rename(part_path, dest_path)
            print(f"    -> Complete: {mb:.1f} MB in {elapsed:.1f}s ({speed:.1f} MB/s)")
            return True
        except Exception as e:
            print(f"    [!] Attempt {attempt}/{max_retries} failed: {e}")
            if os.path.exists(part_path):
                try:
                    os.remove(part_path)
                except OSError:
                    pass
            time.sleep(2)
    return False

def main():
    os.makedirs(TEXTBOOKS_DIR, exist_ok=True)
    ctx = ssl._create_unverified_context()

    with open(TARGETS_FILE, "r", encoding="utf-8") as f:
        targets: List[Dict[str, Any]] = json.load(f)

    total = len(targets)
    print(f"Found {total} textbook targets.")

    success_count = 0
    skipped_count = 0
    failed: List[Dict[str, Any]] = []

    for idx, t in enumerate(targets, 1):
        fname = t["filename"]
        expected_size = t.get("size", 0)
        dest_path = os.path.join(TEXTBOOKS_DIR, fname)
        version_label = t["version"].upper()
        name = t["name_en"] if t["version"] == "en" else t["name_bn"]

        print(f"[{idx}/{total}] [{t['sl']}] [{version_label}] {fname}")

        # Check existing
        if os.path.exists(dest_path):
            cur_size = os.path.getsize(dest_path)
            if cur_size == expected_size and expected_size > 0:
                print(f"    -> Already exists and verified ({cur_size / (1024*1024):.1f} MB). Skipping.")
                skipped_count += 1
                success_count += 1
                continue
            else:
                print(f"    -> Size mismatch (existing {cur_size} vs expected {expected_size}). Re-downloading.")

        download_url = t["egov"] + "/download"
        ok = download_file(download_url, dest_path, expected_size, ctx)
        if ok:
            success_count += 1
        else:
            failed.append(t)

    print("\n" + "=" * 60)
    print(f"Download Summary:")
    print(f"  Total targets: {total}")
    print(f"  Existing/Skipped: {skipped_count}")
    print(f"  Successfully Downloaded: {success_count - skipped_count}")
    print(f"  Total Verified: {success_count}/{total}")
    if failed:
        print(f"  Failed: {len(failed)}")
        for f in failed:
            print(f"    - [{f['sl']}] {f['version']} : {f['filename']} ({f['egov']})")
        sys.exit(1)
    else:
        print("  All 57 textbooks successfully downloaded and verified!")

if __name__ == "__main__":
    main()
