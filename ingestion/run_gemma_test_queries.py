#!/usr/bin/env python3
import os
import json
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GCP_API_KEY") or os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

test_queries = [
    {
        "id": 0,
        "query": "কাচনলে অ্যামোনিয়া ও হাইড্রোক্লোরিক এসিডের ব্যাপন পরীক্ষা কীভাবে করে?",
        "topic": "Chapter 2 (Ammonia & HCl Diffusion Experiment)"
    },
    {
        "id": 1,
        "query": "রাদারফোর্ডের পরমাণু মডেলের প্রস্তাবনা ও সীমাবদ্ধতাগুলো কী কী?",
        "topic": "Chapter 3 (Rutherford Model & Limitations)"
    },
    {
        "id": 2,
        "query": "পর্যায় সারণিতে পর্যায়বৃত্ত ধর্ম যেমন পারমাণবিক ব্যাসার্ধ এবং আয়নীকরণ শক্তি কীভাবে পরিবর্তিত হয়?",
        "topic": "Chapter 4 (Periodic Properties: Radius & Ionization)"
    },
    {
        "id": 3,
        "query": "ড্রাই সেল বা শুষ্ক কোষ কীভাবে তৈরি হয় এবং এর অ্যানোড ও ক্যাথোডে কী রাসায়নিক বিক্রিয়া ঘটে?",
        "topic": "Chapter 8 (Dry Cell Construction & Reactions)"
    }
]

def call_gemma_31b_with_retry(prompt_text, max_retries=4):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt_text}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 2048
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"  [Retry Warning] Attempt {attempt+1} failed: {e}. Sleeping 4s...")
            time.sleep(4)
            
    raise RuntimeError("Failed after maximum retries")

all_responses = []

for item in test_queries:
    q_id = item["id"]
    query = item["query"]
    topic = item["topic"]
    
    print(f"\n{'='*75}")
    print(f"[*] RUNNING QUERY {q_id}: {query}")
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
        
    # 2. Supabase Search (Top 1-2 chunks)
    rpc_res = supabase.rpc("match_curriculum_chunks_global", {
        "query_embedding": q_vec,
        "p_subject_code": "SSC-CHEM",
        "p_language_tag": "bn",
        "match_count": 2,
        "p_model_name": "gemini-embedding-2",
        "p_model_version": "v1",
        "query_text": query
    }).execute()
    
    matches = rpc_res.data or []
    context_chunks = []
    diag_list = []
    for idx, m in enumerate(matches, 1):
        p_ref = m.get("source_book_page_ref")
        ch_no = m.get("chapter_no")
        ch_title = m.get("chapter_title")
        diags = m.get("diagram_image_urls") or []
        # Keep snippet focused to stay well within 16K TPM
        chunk_txt = m.get('content_chunk', '')[:1200]
        context_chunks.append(f"--- অধ্যায় {ch_no} ({ch_title}), পৃষ্ঠা {p_ref} ---\n{chunk_txt}\n")
        if diags:
            for d in diags:
                diag_list.append(d)
                
    # 3. Prompt for Gemma 4 31B
    prompt = f"""তুমি সেরাটিউটর (SheraTutor) এর একজন জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত বিশেষজ্ঞ রসায়ন শিক্ষক।
শিক্ষার্থীদের রসায়ন সংক্রান্ত প্রশ্নের উত্তর সর্বদা প্রদত্ত NCTB পাঠ্যবইয়ের সঠিক তথ্যসূত্রের (Ground Truth Context) ভিত্তিতে সহজ, প্রাঞ্জল ও সমৃদ্ধ বাংলায় উপস্থাপন করবে।

নিয়মাবলী:
1. তথ্য সম্পূর্ণ পাঠ্যবইয়ের আলোকে সঠিক ও নির্ভুল হতে হবে।
2. রাসায়নিক সমীকরণ এবং গাণিতিক চিহ্ন স্পষ্ট LaTeX ফরম্যাটে উপস্থাপন করবে (যেমন $NH_3$, $HCl$, $Zn \\rightarrow Zn^{{2+}} + 2e^-$)।
3. পয়েন্ট আকারে মূল তত্ত্ব, উপকরণ, বিক্রিয়া, পর্যবেক্ষণ বা সীমাবদ্ধতা সাজাবে।
4. প্রাসঙ্গিক ডায়াগ্রামের লিঙ্ক থাকলে তা অন্তর্ভুক্ত করবে: ![ক্যাপশন](ছবির_লিঙ্ক)।

প্রশ্ন:
"{query}"

পাঠ্যবইয়ের তথ্যসূত্র:
{''.join(context_chunks)}

প্রাসঙ্গিক চিত্রসমূহ:
{json.dumps(diag_list, ensure_ascii=False, indent=2)}

সরাসরি শিক্ষার্থীর উপযোগী সুন্দর ও গোছানো উত্তর দাও:"""

    print("--> Calling gemma-4-31b-it...")
    ai_ans = call_gemma_31b_with_retry(prompt)
    print("\n--- GEMMA 4 31B RESPONSE ---")
    print(ai_ans)
    
    all_responses.append({
        "id": q_id,
        "query": query,
        "topic": topic,
        "response": ai_ans,
        "word_count": len(ai_ans.split()),
        "char_count": len(ai_ans)
    })
    
    time.sleep(3) # Pacing between calls

with open("/home/syed/workspace/Sheratutor/ingestion/gemma_test_responses.json", "w", encoding="utf-8") as f:
    json.dump(all_responses, f, ensure_ascii=False, indent=2)

print(f"\n{'='*75}")
print("[SUCCESS] All 4 queries completed with gemma-4-31b-it and saved!")
print(f"{'='*75}")
