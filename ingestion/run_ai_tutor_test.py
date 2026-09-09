#!/usr/bin/env python3
"""
End-to-end RAG AI Tutor test using:
- Supabase Vector DB (Postgres pgvector with RRF)
- gemini-embedding-2 (1024 dimensions)
- google-genai SDK with gemini-2.5-flash
"""

import os
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GCP_API_KEY") or os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = genai.Client(api_key=GEMINI_API_KEY)

query = "কাচনলে অ্যামোনিয়া ও হাইড্রোক্লোরিক এসিডের ব্যাপন পরীক্ষা কীভাবে করে?"

print(f"==================================================")
print(f"1. Query: \"{query}\"")
print(f"==================================================")

# Step 1: Embed query with gemini-embedding-2 (1024 dim)
print("\n--> Embedding query with gemini-embedding-2 (1024-dim)...")
embed_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={GEMINI_API_KEY}"
req = urllib.request.Request(
    embed_url,
    data=json.dumps({
        "content": {"parts": [{"text": query}]},
        "output_dimensionality": 1024
    }).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    q_vec = json.loads(resp.read().decode("utf-8"))["embedding"]["values"]

print(f"--> Query vector created (dimensions: {len(q_vec)})")

# Step 2: Supabase Hybrid RAG Search (Dense + FTS + RRF)
print("\n--> Querying Supabase Hybrid RAG (match_curriculum_chunks_global)...")
rpc_res = supabase.rpc("match_curriculum_chunks_global", {
    "query_embedding": q_vec,
    "p_subject_code": "SSC-CHEM",
    "p_language_tag": "bn",
    "match_count": 3,
    "p_model_name": "gemini-embedding-2",
    "p_model_version": "v1",
    "query_text": query
}).execute()

retrieved_docs = rpc_res.data or []
print(f"--> Retrieved {len(retrieved_docs)} curriculum chunks from Supabase:")

context_texts = []
diagram_references = []

for idx, match in enumerate(retrieved_docs, start=1):
    sim = match.get("similarity", 0.0)
    page = match.get("source_book_page_ref")
    ch_no = match.get("chapter_no")
    ch_title = match.get("chapter_title")
    diagrams = match.get("diagram_image_urls") or []
    
    print(f"  [{idx}] Chapter {ch_no} ({ch_title}), Page {page} | Similarity: {sim:.4f} | Diagrams: {len(diagrams)}")
    
    context_texts.append(
        f"--- পাঠ্যবই তথ্যসূত্র: অধ্যায় {ch_no} ({ch_title}), পৃষ্ঠা {page} ---\n{match.get('content_chunk')}\n"
    )
    if diagrams:
        for d in diagrams:
            diagram_references.append({
                "page": page,
                "url": d.get("url") if isinstance(d, dict) else d,
                "caption": d.get("caption") if isinstance(d, dict) else ""
            })

# Step 3: Construct System Prompt & Tutor Instruction
system_instruction = """তুমি সেরাটিউটর (SheraTutor) এর একজন দক্ষ ও আন্তরিক জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত রসায়ন শিক্ষক।
শিক্ষার্থীদের রসায়ন সংক্রান্ত প্রশ্নের উত্তর সর্বদা প্রদত্ত NCTB পাঠ্যবইয়ের সঠিক তথ্যসূত্রের (Ground Truth Context) ভিত্তিতে সহজ, প্রাঞ্জল ও সমৃদ্ধ বাংলায় উপস্থাপন করবে।

নিয়মাবলী:
1. তথ্য সম্পূর্ণ পাঠ্যবইয়ের আলোকে সঠিক হতে হবে। মনগড়া বা পাঠ্যবহির্ভূত অপ্রাসঙ্গিক তথ্য দেবে না।
2. বৈজ্ঞানিক সমীকরণ এবং গাণিতিক মানগুলো স্পষ্ট LaTeX ফরম্যাটে উপস্থাপন করবে (যেমন $NH_3$, $HCl$, $NH_4Cl$, $M = 17$ ইত্যাদি)।
3. পরীক্ষার ক্ষেত্রে পয়েন্ট আকারে:
   - পরীক্ষার নাম ও উদ্দেশ্য
   - প্রয়োজনীয় উপকরণ
   - কার্যপ্রণালী
   - রাসায়নিক বিক্রিয়া ও পর্যবেক্ষণ
   - বৈজ্ঞানিক ব্যাখ্যা ও সিদ্ধান্ত
   সুন্দরভাবে তুলে ধরবে।
4. যদি কোনো প্রাসঙ্গিক ডায়াগ্রাম/চিত্রের ইউআরএল (URL) পাঠ্যসূত্রে পাওয়া যায়, তবে তা অবশ্যই উত্তরে সুন্দরভাবে এম্বেড করে ব্যাখ্যা করবে: ![ক্যাপশন](ছবির_লিঙ্ক)।
"""

prompt = f"""শিক্ষার্থীর প্রশ্ন:
"{query}"

নিচে ডাটাবেজ থেকে সংগৃহীত NCTB রসায়ন পাঠ্যবইয়ের প্রাসঙ্গিক অংশ দেওয়া হলো:
{''.join(context_texts)}

সংগৃহীত প্রাসঙ্গিক চিত্রসমূহ:
{json.dumps(diagram_references, ensure_ascii=False, indent=2)}

উপরোক্ত পাঠ্যবইয়ের তথ্যের ভিত্তিতে শিক্ষার্থীর প্রশ্নের একটি চমৎকার, পূর্ণাঙ্গ ও শিক্ষণীয় উত্তর প্রস্তুত করো।"""

# Step 4: Call Gemini API
print("\n--> Generating response with Gemini API (gemini-2.5-flash)...")
response = ai_client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.3,
    )
)

print("\n==================================================")
print("              GEMINI AI TUTOR RESPONSE            ")
print("==================================================")
print(response.text)
print("==================================================")
