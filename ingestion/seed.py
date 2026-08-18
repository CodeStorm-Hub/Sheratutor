import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env")

url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase = create_client(url, key)

# Create subject
subject = supabase.table("subjects").upsert({
    "code": "SSC-PHY",
    "name_en": "Physics",
    "name_bn": "পদার্থবিজ্ঞান",
    "level": "SSC",
    "subject_group": "SCIENCE"
}, on_conflict="code").execute()

subject_id = subject.data[0]["id"]

# Create curriculum version
version = supabase.table("curriculum_versions").upsert({
    "subject_id": subject_id,
    "edition_year": 2026,
    "language_tag": "en",
    "is_active": True
}, on_conflict="subject_id,edition_year,language_tag").execute()

# Create chapter 3
chapter = supabase.table("chapters").upsert({
    "subject_id": subject_id,
    "chapter_no": 3,
    "title_en": "Force",
    "title_bn": "বল"
}, on_conflict="subject_id,chapter_no").execute()

print("Seeded successfully!")
