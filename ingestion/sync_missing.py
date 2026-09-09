import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(sb_url, sb_key)

# We can query all objects in curriculum-assets
res = supabase.postgrest.from_("storage.objects").select("name").eq("bucket_id", "curriculum-assets").execute()
uploaded_names = set([r["name"] for r in res.data]) if res.data else set()

figures_dir = Path(__file__).parent / "output/figures/chemistry"
all_files = sorted(list(figures_dir.rglob("*.png")))

missing = []
for f in all_files:
    rel = f.relative_to(figures_dir)
    storage_path = f"chemistry/{rel}"
    if storage_path not in uploaded_names:
        missing.append((f, storage_path))

print(f"Total on disk: {len(all_files)}, Found in DB: {len(uploaded_names)}, Missing: {len(missing)}")

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
        print(f"Failed {sp}: {e}")

res_final = supabase.postgrest.from_("storage.objects").select("name").eq("bucket_id", "curriculum-assets").execute()
print(f"Final count in bucket: {len(res_final.data)} / {len(all_files)}")
