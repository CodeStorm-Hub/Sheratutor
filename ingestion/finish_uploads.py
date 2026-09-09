import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(sb_url, sb_key)

step_output = Path("/home/syed/.gemini/antigravity/brain/f428beae-0d17-41f0-9ee8-6ac0868b0493/.system_generated/steps/835/output.txt")
existing_names = set()
if step_output.exists():
    text = step_output.read_text(encoding="utf-8")
    for match in re.finditer(r'"name":"([^"]+)"', text):
        existing_names.add(match.group(1))

figures_dir = Path(__file__).parent / "output/figures/chemistry"
all_files = sorted(list(figures_dir.rglob("*.png")))

missing = []
for f in all_files:
    rel = f.relative_to(figures_dir)
    storage_path = f"chemistry/{rel}"
    if storage_path not in existing_names:
        missing.append((f, storage_path))

print(f"Total on disk: {len(all_files)}, Found in storage: {len(existing_names)}, Missing: {len(missing)}")

for f, sp in missing:
    try:
        with open(f, "rb") as fp:
            supabase.storage.from_("curriculum-assets").upload(
                path=sp,
                file=fp.read(),
                file_options={"content-type": "image/png", "upsert": "true"}
            )
        print(f"Uploaded: {sp}")
    except Exception as e:
        print(f"Failed: {sp} - {e}")

print("Done sync!")
