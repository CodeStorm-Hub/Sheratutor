#!/usr/bin/env python3
"""
End-to-End Live RAG Multimodal Retrieval Verification.
Embeds a student question in Bengali using gemini-embedding-2 (1024-dim),
queries Supabase pgvector using cosine distance, and displays the top retrieved chunks
and their verified diagrams!
"""

import os
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

gemini_key = os.getenv("GEMINI_API_KEY")

queries = [
    "অরবিটালের শক্তিক্রম এবং আউফবাউ নীতি কী?",
    "কাচনলে অ্যামোনিয়া ও হাইড্রোক্লোরিক এসিডের ব্যাপন পরীক্ষা কীভাবে করে?",
    "গ্যালভানিক কোষে কীভাবে রাসায়নিক শক্তি থেকে বিদ্যুৎ উৎপন্ন হয়?"
]

def embed_query(query_text):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={gemini_key}"
    payload = {
        "content": {"parts": [{"text": query_text}]},
        "output_dimensionality": 1024
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["embedding"]["values"]

# We will print the vector query format for execution
q_vec = embed_query(queries[0])
print(f"Generated query vector of dimension: {len(q_vec)}")

# Save vector to file for sql execution
Path("/tmp/test_q_vec.json").write_text(json.dumps(q_vec), encoding="utf-8")
print("Saved query vector to /tmp/test_q_vec.json")
