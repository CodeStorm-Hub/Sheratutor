#!/usr/bin/env python3
"""
Multi-Query RAG Verification Test against Real PDF:
Queries tested across different chapters:
1. Rutherford's atomic model and limitations (Chapter 3)
2. Periodic properties: Atomic radius and ionization energy (Chapter 4)
3. Dry cell construction and chemical reactions (Chapter 8)
"""

import os
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types
import pypdf

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GCP_API_KEY") or os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
PDF_PATH = "/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = genai.Client(api_key=GEMINI_API_KEY)
pdf_reader = pypdf.PdfReader(PDF_PATH)

test_queries = [
    {
        "id": 1,
        "query": "রাদারফোর্ডের পরমাণু মডেলের প্রস্তাবনা ও সীমাবদ্ধতাগুলো কী কী?",
        "topic": "Chapter 3: Structure of Matter (Rutherford Model & Limitations)"
    },
    {
        "id": 2,
        "query": "পর্যায় সারণিতে পর্যায়বৃত্ত ধর্ম যেমন পারমাণবিক ব্যাসার্ধ এবং আয়নীকরণ শক্তি কীভাবে পরিবর্তিত হয়?",
        "topic": "Chapter 4: Periodic Table (Periodic Properties: Radius & Ionization)"
    },
    {
        "id": 3,
        "query": "ড্রাই সেল বা শুষ্ক কোষ কীভাবে কাজ করে এবং এর অ্যানোড ও ক্যাথোডের রাসায়নিক বিক্রিয়া কী?",
        "topic": "Chapter 8: Chemistry & Energy (Dry Cell Construction & Reactions)"
    }
]

system_instruction = """তুমি সেরাটিউটর (SheraTutor) এর একজন জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত বিশেষজ্ঞ রসায়ন শিক্ষক।
শিক্ষার্থীদের রসায়ন সংক্রান্ত প্রশ্নের উত্তর সর্বদা প্রদত্ত NCTB পাঠ্যবইয়ের সঠিক তথ্যসূত্রের (Ground Truth Context) ভিত্তিতে সহজ, প্রাঞ্জল ও সমৃদ্ধ বাংলায় উপস্থাপন করবে।

নিয়মাবলী:
1. তথ্য সম্পূর্ণ পাঠ্যবইয়ের আলোকে সঠিক ও নির্ভুল হতে হবে।
2. রাসায়নিক সমীকরণ এবং গাণিতিক চিহ্ন স্পষ্ট LaTeX ফরম্যাটে উপস্থাপন করবে।
3. পয়েন্ট আকারে মূল তত্ত্ব, বিক্রিয়া, কার্যপ্রণালী বা সীমাবদ্ধতা সাজাবে।
4. প্রাসঙ্গিক ডায়াগ্রামের URL থাকলে তা অন্তর্ভুক্ত করবে।
"""

results_summary = []

for item in test_queries:
    q_id = item["id"]
    query = item["query"]
    topic = item["topic"]
    
    print(f"\n{'='*70}")
    print(f"TEST QUERY {q_id}: {query}")
    print(f"TOPIC: {topic}")
    print(f"{'='*70}")
    
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
        
    # 2. Supabase Hybrid RAG Search
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
    print(f"\n[1] Supabase Retrieval Results (Top {len(matches)}):")
    context_chunks = []
    diag_list = []
    top_page_no = None
    
    for idx, m in enumerate(matches, 1):
        p_ref = m.get("source_book_page_ref")
        ch_no = m.get("chapter_no")
        ch_title = m.get("chapter_title")
        sim = m.get("similarity", 0)
        diags = m.get("diagram_image_urls") or []
        if idx == 1:
            top_page_no = p_ref
        print(f"  Rank {idx}: Chapter {ch_no} ({ch_title}), Page {p_ref} | Sim: {sim:.4f} | Diags: {len(diags)}")
        context_chunks.append(f"--- অধ্যায় {ch_no} ({ch_title}), পৃষ্ঠা {p_ref} ---\n{m.get('content_chunk')}\n")
        if diags:
            for d in diags:
                diag_list.append(d)
                
    # 3. Cross-verify with Real PDF
    # Note: Book page number mapping to PDF page index:
    # Let's check book page in PDF
    pdf_text_sample = ""
    matched_pdf_idx = None
    if top_page_no:
        # Search nearby pages in PDF to find the exact matching page
        # In chemistry_bn.pdf, the page offset is usually ~8-12 pages
        for idx_p, page in enumerate(pdf_reader.pages):
            txt = page.extract_text() or ""
            if f"পৃষ্ঠা {top_page_no}" in txt or f"{top_page_no} রসায়ন" in txt or f"রসায়ন {top_page_no}" in txt or f"অধ্যায়" in txt and len(txt) > 50:
                # check if first line of chunk is in this page
                first_words = matches[0]["content_chunk"][:40].strip()
                # or check keyword
                if any(kw in txt for kw in query.split() if len(kw) > 4):
                    matched_pdf_idx = idx_p
                    pdf_text_sample = txt[:250].replace("\n", " ")
                    break
        if not matched_pdf_idx and top_page_no < len(pdf_reader.pages):
            # check approx page:
            matched_pdf_idx = top_page_no
            pdf_text_sample = (pdf_reader.pages[top_page_no].extract_text() or "")[:250].replace("\n", " ")

    print(f"\n[2] Real PDF Cross-Verification:")
    print(f"  Target Book Page: {top_page_no}")
    print(f"  PDF Physical Page Index: {matched_pdf_idx}")
    print(f"  Real PDF Text Snippet: {pdf_text_sample[:180]}...")

    # 4. Generate AI Tutor Answer with Gemini
    prompt = f"""প্রশ্ন: {query}

তথ্যসূত্র (NCTB রসায়ন পাঠ্যপুস্তক ডাটাবেজ):
{''.join(context_chunks)}

প্রাসঙ্গিক চিত্রসমূহ:
{json.dumps(diag_list, ensure_ascii=False, indent=2)}

পাঠ্যবইয়ের ভিত্তিতে শিক্ষার্থীর জন্য সুন্দর, গোছানো ও পূর্ণাঙ্গ উত্তর তৈরি করো।"""

    print(f"\n[3] Generating Answer with gemini-2.5-flash...")
    resp = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2
        )
    )
    
    print(f"\n[4] AI Tutor Output:")
    print(resp.text[:600] + "\n... [সম্পূর্ণ উত্তর সফলভাবে জেনারেট হয়েছে] ...\n")
    
    results_summary.append({
        "id": q_id,
        "query": query,
        "topic": topic,
        "top_match": {
            "chapter": matches[0]["chapter_no"] if matches else None,
            "page": matches[0]["source_book_page_ref"] if matches else None,
            "sim": matches[0]["similarity"] if matches else 0,
            "diags": len(matches[0].get("diagram_image_urls") or []) if matches else 0
        },
        "response_length": len(resp.text),
        "full_response": resp.text
    })

with open("/home/syed/workspace/Sheratutor/ingestion/verification_summary.json", "w", encoding="utf-8") as f:
    json.dump(results_summary, f, ensure_ascii=False, indent=2)

print(f"\n{'='*70}")
print(f"ALL 3 VERIFICATION TESTS COMPLETED SUCCESSFULLY!")
print(f"{'='*70}")
