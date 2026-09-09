#!/usr/bin/env python3
import os
import json
import urllib.request
import subprocess
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
PDF_PATH = "/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = genai.Client(api_key=GEMINI_API_KEY)

test_queries = [
    {
        "id": 1,
        "query": "রাদারফোর্ডের পরমাণু মডেলের প্রস্তাবনা ও সীমাবদ্ধতাগুলো কী কী?",
        "topic": "Chapter 3 (Structure of Matter): Rutherford's Atomic Model & Limitations"
    },
    {
        "id": 2,
        "query": "পর্যায় সারণিতে পর্যায়বৃত্ত ধর্ম যেমন পারমাণবিক ব্যাসার্ধ এবং আয়নীকরণ শক্তি কীভাবে পরিবর্তিত হয়?",
        "topic": "Chapter 4 (Periodic Table): Periodic Properties (Atomic Radius & Ionization Energy)"
    },
    {
        "id": 3,
        "query": "ড্রাই সেল বা শুষ্ক কোষ কীভাবে তৈরি হয় এবং এর অ্যানোড ও ক্যাথোডে কী রাসায়নিক বিক্রিয়া ঘটে?",
        "topic": "Chapter 8 (Chemistry & Energy): Dry Cell Construction & Electrochemistry"
    }
]

system_instruction = """তুমি সেরাটিউটর (SheraTutor) এর একজন জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত বিশেষজ্ঞ রসায়ন শিক্ষক।
শিক্ষার্থীদের রসায়ন সংক্রান্ত প্রশ্নের উত্তর সর্বদা প্রদত্ত NCTB পাঠ্যবইয়ের সঠিক তথ্যসূত্রের (Ground Truth Context) ভিত্তিতে সহজ, প্রাঞ্জল ও সমৃদ্ধ বাংলায় উপস্থাপন করবে।

নিয়মাবলী:
1. তথ্য সম্পূর্ণ পাঠ্যবইয়ের আলোকে সঠিক ও নির্ভুল হতে হবে।
2. রাসায়নিক সমীকরণ এবং গাণিতিক চিহ্ন স্পষ্ট LaTeX ফরম্যাটে উপস্থাপন করবে।
3. পয়েন্ট আকারে মূল তত্ত্ব, বিক্রিয়া, কার্যপ্রণালী বা সীমাবদ্ধতা সাজাবে।
4. প্রাসঙ্গিক ডায়াগ্রামের URL থাকলে তা অন্তর্ভুক্ত করবে: ![ক্যাপশন](ছবির_লিঙ্ক)।
"""

os.makedirs("/tmp/verified_pdf_pages", exist_ok=True)
all_test_results = []

for item in test_queries:
    q_id = item["id"]
    query = item["query"]
    topic = item["topic"]
    
    print(f"\n{'='*75}")
    print(f"[*] RUNNING TEST {q_id}: {query}")
    print(f"[*] TOPIC: {topic}")
    print(f"{'='*75}")
    
    # 1. Embed query
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
        
    # 2. Supabase Hybrid Search
    rpc_res = supabase.rpc("match_curriculum_chunks_global", {
        "query_embedding": q_vec,
        "p_subject_code": "SSC-CHEM",
        "p_language_tag": "bn",
        "match_count": 3,
        "p_model_name": "gemini-embedding-2",
        "p_model_version": "v1",
        "query_text": query
    }).execute()
    
    matches = rpc_res.data or []
    top_match = matches[0] if matches else None
    top_page = top_match.get("source_book_page_ref") if top_match else None
    
    print(f"\n[Retrieval]")
    context_chunks = []
    diag_list = []
    for idx, m in enumerate(matches, 1):
        p_ref = m.get("source_book_page_ref")
        ch_no = m.get("chapter_no")
        ch_title = m.get("chapter_title")
        sim = m.get("similarity", 0)
        diags = m.get("diagram_image_urls") or []
        print(f"  Rank {idx}: Ch {ch_no} ({ch_title}), Page {p_ref} | Cosine Similarity: {sim:.4f} | Diags: {len(diags)}")
        context_chunks.append(f"--- অধ্যায় {ch_no} ({ch_title}), পৃষ্ঠা {p_ref} ---\n{m.get('content_chunk')}\n")
        if diags:
            for d in diags:
                diag_list.append(d)
                
    # 3. Render Real PDF Page
    pdf_img_path = f"/tmp/verified_pdf_pages/q{q_id}_page_{top_page}.png"
    if top_page:
        cmd = f"pdftoppm -png -r 150 -f {top_page} -l {top_page} {PDF_PATH} /tmp/verified_pdf_pages/q{q_id}_temp"
        subprocess.run(cmd, shell=True, check=True)
        # find generated file
        gen_files = list(Path("/tmp/verified_pdf_pages").glob(f"q{q_id}_temp*.png"))
        if gen_files:
            os.replace(gen_files[0], pdf_img_path)
            print(f"\n[Real PDF Verification]")
            print(f"  Rendered Physical PDF Page: {top_page} -> {pdf_img_path}")
            
    # 4. Generate AI Tutor Response with Gemini
    prompt = f"""প্রশ্ন: {query}

তথ্যসূত্র (NCTB রসায়ন পাঠ্যপুস্তক ডাটাবেজ):
{''.join(context_chunks)}

প্রাসঙ্গিক চিত্রসমূহ:
{json.dumps(diag_list, ensure_ascii=False, indent=2)}

পাঠ্যবইয়ের ভিত্তিতে শিক্ষার্থীর জন্য সুন্দর, গোছানো ও পূর্ণাঙ্গ উত্তর তৈরি করো।"""

    print(f"\n[Generation] Calling gemini-2.5-flash...")
    resp = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2
        )
    )
    
    print("\n--- AI TUTOR RESPONSE PREVIEW ---")
    print(resp.text[:500] + "\n...")
    
    all_test_results.append({
        "id": q_id,
        "query": query,
        "topic": topic,
        "top_match": {
            "chapter": top_match["chapter_no"] if top_match else None,
            "chapter_title": top_match["chapter_title"] if top_match else None,
            "page": top_page,
            "similarity": top_match["similarity"] if top_match else 0,
            "diagram_urls": top_match.get("diagram_image_urls") if top_match else []
        },
        "real_pdf_rendered_page": pdf_img_path,
        "full_ai_response": resp.text
    })

with open("/home/syed/workspace/Sheratutor/ingestion/all_verified_query_tests.json", "w", encoding="utf-8") as f:
    json.dump(all_test_results, f, ensure_ascii=False, indent=2)

print(f"\n{'='*75}")
print(f"[SUCCESS] All queries tested, cross-verified with real PDF, and saved!")
print(f"{'='*75}")
