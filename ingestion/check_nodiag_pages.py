import json

# Check cached markdown for page 7, 13, 58 in chemistry_bn
for p in [7, 13, 58]:
    cache_file = f"/home/syed/workspace/Sheratutor/ingestion/cache/chemistry_bn/page_{p:04d}.json"
    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            d = json.load(f)
            print(f"=== Bengali Page {p} ===")
            print(d.get("markdown", "")[:250].strip())
            print("...\n")
    except Exception as e:
        print(f"Page {p} not in cache: {e}")
