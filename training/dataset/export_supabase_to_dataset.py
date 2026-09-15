#!/usr/bin/env python3
"""
SheraTutor: Automated Training Dataset Generator from Supabase Curriculum Chunks.

This script fetches real curriculum chunks (worked examples, creative questions,
theory sections) from your live Supabase RAG database and formats them into
ChatML format ready for Unsloth fine-tuning.
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load environment
env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not sb_url or not sb_key:
    raise ValueError("Supabase URL or Service Role Key missing from ingestion/.env")

supabase = create_client(sb_url, sb_key)

SYSTEM_PROMPT_SOCRATIC_BN = """তুমি সেরাটিউটর (SheraTutor) — বাংলাদেশের জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত এসএসসি (SSC) পর্যায়ের একজন দক্ষ এবং সহানুভূতিশীল এআই শিক্ষক।
তোমার মূল দায়িত্ব:
1. সরাসরি উত্তর মুখস্থ না করিয়ে শিক্ষার্থীকে প্রশ্ন এবং সংকেতের মাধ্যমে ধাপে ধাপে (Socratic method) সঠিক উত্তরে পৌঁছাতে সাহায্য করা।
2. সমস্ত গাণিতিক সূত্র এবং বৈজ্ঞানিক সমীকরণ পরিচ্ছন্ন LaTeX ফরম্যাটে লেখা (যেমন ইনলাইন: \\( F = ma \\) এবং ব্লক: \\[ s = ut + \\frac{1}{2}at^2 \\])।
3. বাংলা ও ইংরেজি পরিভাষা সুন্দরভাবে মেলানো (যেমন: ত্বরণ - Acceleration, মোলারিটি - Molarity)।
4. কোনো শিক্ষার্থী সমাধান ফাঁকি দেওয়ার চেষ্টা করলে সরাসরি সমাধান ফাঁস না করে তাকে একটি সহজ অনুধাবনমূলক প্রশ্ন করা।"""

def fetch_curriculum_samples(limit_per_type: int = 50):
    print(f"[*] Fetching verified chunks from Supabase ({sb_url})...")
    
    # Query worked examples and creative questions
    types_to_fetch = ["worked_example", "cq_subquestion", "theory"]
    collected_dialogues = []
    
    for chunk_type in types_to_fetch:
        res = (
            supabase.table("curriculum_chunks")
            .select("id, content_chunk, chunk_type, section_title, source_book_page_ref, chapters(title_bn, title_en, subjects(code))")
            .eq("chunk_type", chunk_type)
            .limit(limit_per_type)
            .execute()
        )
        
        chunks = res.data or []
        print(f"  - Found {len(chunks)} chunks of type '{chunk_type}'")
        
        for c in chunks:
            content = c.get("content_chunk", "").strip()
            if len(content) < 40:
                continue
                
            chapter_info = c.get("chapters") or {}
            subj_code = chapter_info.get("subjects", {}).get("code", "SSC")
            ch_title = chapter_info.get("title_bn") or chapter_info.get("title_en") or "অধ্যায়"
            
            # Format dialogue based on chunk type
            if chunk_type == "worked_example":
                user_msg = f"স্যার, {ch_title} অধ্যায়ের এই গাণিতিক সমস্যাটি বুঝতে পারছি না, একটু সাহায্য করবেন?\n\n{content[:250]}"
                assistant_msg = (
                    f"অবশ্যই! এটি {ch_title} অধ্যায়ের একটি গুরুত্বপূর্ণ সমস্যা। চল ধাপে ধাপে সমাধান করি।\n\n"
                    f"এখানে মূল বিষয়টি লক্ষ্য করো:\n{content}\n\n"
                    "সমীকরণটি পরিষ্কার বুঝতে পেরেছ কি? কোন লাইনে তোমার খটকা লাগছে?"
                )
            elif chunk_type == "cq_subquestion":
                user_msg = f"{ch_title} এর এই সৃজনশীল প্রশ্নটির উত্তর কীভাবে গুছিয়ে লিখব?\n\n{content[:200]}"
                assistant_msg = (
                    f"সৃজনশীল প্রশ্নের ক্ষেত্রে বোর্ডের নম্বর বণ্টন এবং মূল সূত্র মাথায় রাখা দরকার।\n\n"
                    f"পাঠ্যবইয়ের আলোকে উত্তরটি এভাবে সাজাতে পারো:\n{content}\n\n"
                    "পরীক্ষার খাতায় সমীকরণগুলো স্পষ্টভাবে \\( ... \\) ফরম্যাটে লিখলে পুরো নম্বর পাওয়া সহজ হয়।"
                )
            else:
                user_msg = f"স্যার, {ch_title} অধ্যায়ের এই বিষয়টির মূল ধারণা কি?\n\n{content[:180]}"
                assistant_msg = (
                    f"খুব সুন্দর প্রশ্ন! সহজ কথায় বললে:\n\n{content}\n\n"
                    "এই ধারণার ওপর ভিত্তি করে পরবর্তী গাণিতিক সমস্যাগুলো সমাধান করা হয়।"
                )
                
            collected_dialogues.append({
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT_SOCRATIC_BN},
                    {"role": "user", "content": user_msg},
                    {"role": "assistant", "content": assistant_msg}
                ],
                "metadata": {
                    "chunk_id": c.get("id"),
                    "subject": subj_code,
                    "chunk_type": chunk_type,
                    "page_ref": c.get("source_book_page_ref")
                }
            })
            
    return collected_dialogues

def main():
    out_dir = Path("/home/syed/workspace/Sheratutor/training/dataset")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "sheratutor_supabase_rag_dataset.jsonl"
    
    dialogues = fetch_curriculum_samples(limit_per_type=60)
    
    with open(out_file, "w", encoding="utf-8") as f:
        for d in dialogues:
            f.write(json.dumps(d, ensure_ascii=False) + "\n")
            
    print(f"\n[OK] Successfully exported {len(dialogues)} RAG-grounded dialogues to:")
    print(f"     {out_file.resolve()}")
    print(f"     File size: {out_file.stat().st_size} bytes")

if __name__ == "__main__":
    main()
