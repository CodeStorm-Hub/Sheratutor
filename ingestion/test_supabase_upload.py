import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(sb_url, sb_key)

test_file = Path(__file__).parent / "output/figures/chemistry/bn/ch_01/p006_fig_01.png"
storage_path = "chemistry/bn/ch_01/p006_fig_01.png"

print(f"Uploading {test_file.name} to Supabase bucket 'curriculum-assets' at {storage_path}...")
with open(test_file, "rb") as f:
    res = supabase.storage.from_("curriculum-assets").upload(
        path=storage_path,
        file=f.read(),
        file_options={"content-type": "image/png", "upsert": "true"}
    )

public_url = supabase.storage.from_("curriculum-assets").get_public_url(storage_path)
print(f"Upload successful! Public URL: {public_url}")
