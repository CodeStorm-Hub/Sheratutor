import json
import re
from pathlib import Path
from collections import Counter

cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")

all_words = Counter()
for pfile in sorted(cache_dir.glob("page_*.json")):
    d = json.loads(pfile.read_text(encoding="utf-8"))
    md = d.get("markdown", "")
    # extract bengali words
    words = re.findall(r"[\u0980-\u09FF]+", md)
    for w in words:
        all_words[w] += 1

# Check words containing known error stems
print("Words with 'শস্ত' or 'শন্ত':")
for w, count in all_words.items():
    if ("শস্ত" in w or "শন্ত" in w) and not "প্রশান্ত" in w and not "শান্ত" in w:
        print(f"  {w}: {count}")

print("\nWords with 'ইলেক':")
for w, count in all_words.items():
    if "ইলেক" in w and "ইলেকট্রন" not in w:
        print(f"  {w}: {count}")

print("\nWords with 'বিক্' or 'বিক':")
for w, count in all_words.items():
    if "বিক্" in w or ("বিক" in w and "বিক্রিয়" not in w and "বিক্রয়" not in w and "বিকাশ" not in w and "বিকিরণ" not in w and "বিকৃত" not in w and "বিকাল" not in w):
        if "বিক্র" not in w:
            print(f"  {w}: {count}")

print("\nWords with 'মোনিয়া':")
for w, count in all_words.items():
    if "মোনিয়া" in w:
        print(f"  {w}: {count}")

print("\nWords with 'রোলিয়াম':")
for w, count in all_words.items():
    if "রোলিয়াম" in w:
        print(f"  {w}: {count}")
