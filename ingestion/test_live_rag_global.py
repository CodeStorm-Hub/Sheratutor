#!/usr/bin/env python3
import os
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

supabase = create_client(sb_url, sb_key)

query = "কাচনলে অ্যামোনিয়া ও হাইড্রোক্লোরিক এসিডের ব্যাপন পরীক্ষা কীভাবে করে?"
print(f"Executing Live Multimodal RAG Search...")
print(f"Query: \"{query}\"\n")

# Embed query with gemini-embedding-2
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={gemini_key}"
req = urllib.request.Request(
    url,
    data=json.dumps({
        "content": {"parts": [{"text": query}]},
        "output_dimensionality": 1024
    }).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    q_vec = json.loads(resp.read().decode("utf-8"))["embedding"]["values"]

# Call RPC
res = supabase.rpc("match_curriculum_chunks_global", {
    "query_embedding": q_vec,
    "p_subject_code": "SSC-CHEM",
    "p_language_tag": "bn",
    "match_count": 3,
    "p_model_name": "gemini-embedding-2",
    "p_model_version": "v1",
    "query_text": query
}).execute()

for idx, match in enumerate(res.data, start=1):
    print(f"Rank {idx}: Chapter {match['chapter_no']} ({match['chapter_title']}) | Page {match['source_book_page_ref']}")
    print(f"  Similarity: {match['similarity']:.4f}")
    if match.get('diagram_image_urls'):
        print(f"  Diagram URLs ({len(match['diagram_image_urls'])}): {match['diagram_image_urls']}")
    print(f"  Snippet: {match['content_chunk'][:160].replace(chr(10), ' ')}...\n")
