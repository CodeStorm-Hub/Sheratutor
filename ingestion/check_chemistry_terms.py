import json
import re
from pathlib import Path
from collections import Counter

cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")

all_words = Counter()
for pfile in sorted(cache_dir.glob("page_*.json")):
    d = json.loads(pfile.read_text(encoding="utf-8"))
    md = d.get("markdown", "")
    words = re.findall(r"[\u0980-\u09FF]+", md)
    for w in words:
        all_words[w] += 1

terms_to_check = [
    ("নাইট্র", ["নাইক"]),
    ("হাইড্রো", ["হাইন", "হাইদ"]),
    ("অক্সি", ["অকষি"]),
    ("সালফ", ["সালক", "শালফ"]),
    ("ফসফ", ["পসফ"]),
    ("ক্যালসি", ["ক্যালশি", "ক্যালচি"]),
    ("ম্যাগনেসি", ["ম্যাগনেশি"]),
    ("অ্যালুমিনি", ["আযালুমিনি", "আ্যালুমিনি"]),
    ("পটাশি", ["পটাশি"]),
    ("সোডি", ["সোডি"]),
    ("ক্লোর", ["ক্নোর", "ক্লোৰ"]),
    ("ব্রোমি", ["ব্রোমি"]),
    ("আয়োডি", ["আযোডি", "আয়োডি"]),
    ("জারণ", ["জারন"]),
    ("বিজারণ", ["বিজারন"]),
    ("পর্যায়", ["পর্যায়", "পর্্যায়"]),
    ("সারণি", ["সারনি", "সারণী", "শারনি"]),
    ("যোজনী", ["যোজনী", "যোজনি", "যোজ্যতা"]),
    ("গলনাঙ্ক", ["গলনাংক", "গলনাষ্ক"]),
    ("স্ফুটনাঙ্ক", ["স্ফুটনাংক", "স্খুটনাঙ্ক"]),
    ("বাষ্পীভবন", ["বাস্পীভবন"]),
    ("উদ্বায়ী", ["উদ্বায়ি"]),
    ("ঊর্ধ্বপাতন", ["উর্ধপাতন", "উর্ধ্বপাতন"]),
    ("সান্দ্রতা", ["সান্দ্রতা"]),
    ("পাতন", ["পাতন"])
]

for label, err_stems in terms_to_check:
    matches = {}
    for w, count in all_words.items():
        if any(stem in w for stem in err_stems):
            matches[w] = count
    if matches:
        print(f"Check {label}:")
        for k, v in matches.items():
            print(f"  {k}: {v}")
