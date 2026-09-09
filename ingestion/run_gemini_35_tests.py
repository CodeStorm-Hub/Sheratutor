#!/usr/bin/env python3
import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from supabase import create_client

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GCP_API_KEY") or os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

test_queries = [
    {
        "id": 1,
        "query": "রাদারফোর্ডের পরমাণু মডেলের প্রস্তাবনা ও সীমাবদ্ধতাগুলো কী কী?",
        "topic": "অধ্যায় ৩ (পদার্থের গঠন), পৃষ্ঠা ৪৭ ও ৪৮"
    },
    {
        "id": 2,
        "query": "পর্যায় সারণিতে পর্যায়বৃত্ত ধর্ম যেমন পারমাণবিক ব্যাসার্ধ এবং আয়নীকরণ শক্তি কীভাবে পরিবর্তিত হয়?",
        "topic": "অধ্যায় ৪ (পর্যায় সারণি), পৃষ্ঠা ৭৬ ও ৭৭"
    },
    {
        "id": 3,
        "query": "ড্রাই সেল বা শুষ্ক কোষ কীভাবে তৈরি হয় এবং এর অ্যানোড ও ক্যাথোডে কী রাসায়নিক বিক্রিয়া ঘটে?",
        "topic": "অধ্যায় ৮ (রসায়ন ও শক্তি), পৃষ্ঠা ২০০"
    }
]

output_md_lines = [
    "# SheraTutor: AI Grounded Verification Test Report (`gemini-3.5-flash-lite`)",
    "",
    "পূর্বের ৩টি টেস্ট কুয়েরিতে **`gemini-3.5-flash-lite`** ও **`gemini-embedding-2`** ভিত্তিক RAG পাইপলাইন থেকে সরাসরি জেনারেট হওয়া **অরিজিনাল এআই রেসপন্স (Full Verbatim Responses)** নিচে দেওয়া হলো:",
    "",
    "- **মডেল**: `gemini-3.5-flash-lite`",
    "- **এমবেডিং মডেল**: `gemini-embedding-2` (1024-dimensional multimodal vectors)",
    "- **SDK**: Official `google-genai` Python SDK",
    "- **ডাটাবেজ ও সার্চ**: Supabase `match_curriculum_chunks_global` (Hybrid Vector + Keyword Matching)",
    "- **কনফিগারেশন**: `temperature=0.2`, `max_output_tokens=2048`",
    "- **সিলেবাস**: NCTB নবম-দশম শ্রেণির রসায়ন (Class 9-10 / SSC Chemistry)",
    "",
    "---",
    ""
]

print("Starting tests with gemini-3.5-flash-lite...")

for t in test_queries:
    qid = t["id"]
    query = t["query"]
    topic = t["topic"]
    
    print(f"\n{'='*60}")
    print(f"[*] Running Test {qid}: {query}")
    print(f"[*] Topic: {topic}")
    print(f"{'='*60}")
    
    start_time = time.time()
    
    # 1. Embed query with gemini-embedding-2
    embed_resp = client.models.embed_content(
        model="gemini-embedding-2",
        contents=query,
        config={"output_dimensionality": 1024}
    )
    q_vec = embed_resp.embeddings[0].values
    
    # 2. Supabase Search
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
    
    for m in matches:
        p_ref = m.get("source_book_page_ref")
        ch_no = m.get("chapter_no")
        ch_title = m.get("chapter_title")
        diags = m.get("diagram_image_urls") or []
        chunk_txt = m.get("content_chunk", "")
        context_chunks.append(f"--- অধ্যায় {ch_no} ({ch_title}), পৃষ্ঠা {p_ref} ---\n{chunk_txt}\n")
        if diags:
            for d in diags:
                diag_list.append(d)
                
    # 3. Prompting
    ctx_str = "\n".join(context_chunks)
    diag_str = json.dumps(diag_list, ensure_ascii=False, indent=2)
    
    prompt = f"""তুমি সেরাটিউটর (SheraTutor) এর একজন জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত বিশেষজ্ঞ রসায়ন শিক্ষক।
শিক্ষার্থীদের রসায়ন সংক্রান্ত প্রশ্নের উত্তর সর্বদা প্রদত্ত NCTB পাঠ্যবইয়ের সঠিক তথ্যসূত্রের (Ground Truth Context) ভিত্তিতে সহজ, প্রাঞ্জল ও শিক্ষণীয় বাংলায় উপস্থাপন করবে।

নিয়মাবলী:
1. তথ্য সম্পূর্ণ পাঠ্যবইয়ের আলোকে সঠিক ও নির্ভুল হতে হবে। কোনো বিভ্রান্তিকর বা অপ্রাসঙ্গিক তথ্য দেওয়া যাবে না।
2. রাসায়নিক সংকেত, আয়ন ও সমীকরণ স্পষ্ট LaTeX / KaTeX ফরম্যাটে উপস্থাপন করবে (যেমন $NH_3$, $HCl$, $Zn \\rightarrow Zn^{{2+}} + 2e^-$)।
3. পয়েন্ট আকারে মূল তত্ত্ব, উপকরণ, বিক্রিয়া, পর্যবেক্ষণ বা সীমাবদ্ধতা সাজাবে।
4. প্রাসঙ্গিক ডায়াগ্রামের লিঙ্ক থাকলে উপযুক্ত ক্যাপশন সহ উত্তরটিতে এমবেড করবে: ![ক্যাপশন](ছবির_লিঙ্ক)।

প্রশ্ন:
"{query}"

পাঠ্যবইয়ের তথ্যসূত্র:
{ctx_str}

প্রাসঙ্গিক চিত্রসমূহ:
{diag_str}

সরাসরি শিক্ষার্থীর উপযোগী সুন্দর ও গোছানো উত্তর দাও:"""

    resp = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=2048
        )
    )
    
    elapsed = time.time() - start_time
    ans_text = resp.text
    word_count = len(ans_text.split())
    
    print(f"--> Done in {elapsed:.2f}s | Word Count: {word_count}")
    
    output_md_lines.append(f"# **টেস্ট {qid} এর মূল এআই রেসপন্স (Test {qid} Original Response)**")
    output_md_lines.append(f"> **কুয়েরি:** *\"{query}\"*  ")
    output_md_lines.append(f"> **তথ্যসূত্র:** NCTB রসায়ন, {topic}  ")
    output_md_lines.append(f"> **মডেল:** `gemini-3.5-flash-lite` | **রেসপন্স টাইম:** `{elapsed:.2f}s` | **শব্দ সংখ্যা:** `{word_count}`")
    output_md_lines.append("")
    output_md_lines.append(ans_text)
    output_md_lines.append("")
    output_md_lines.append("---")
    output_md_lines.append("")
    
    time.sleep(1)

out_file_path = "/home/syed/workspace/Sheratutor/test-query-ai-response-gemini-3-5-flash-lite.md"
with open(out_file_path, "w", encoding="utf-8") as f:
    f.write("\n".join(output_md_lines))

print(f"\n[SUCCESS] All 3 tests completed with gemini-3.5-flash-lite and saved to {out_file_path}!")
