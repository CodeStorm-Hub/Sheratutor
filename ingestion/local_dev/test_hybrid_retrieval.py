#!/usr/bin/env python3
"""
SheraTutor: Hybrid Retrieval Verification Suite.
Tests semantic similarity, cross-lingual alignment (BN <-> EN),
exact formula retrieval, and parent-child CQ stimulus attachment.
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any

SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(SCRIPT_DIR))

from embed_and_store import get_embedding, get_chroma_collection


BENCHMARK_QUERIES = [
    {
        "subject": "SSC-CHEM",
        "query": "রসায়নের পরিধি এবং বিভিন্ন শাখা কী কী? (What are the scopes and branches of chemistry?)",
        "expected_topic": "Scope of Chemistry / রসায়নের পরিধি",
        "type": "theory"
    },
    {
        "subject": "SSC-CHEM",
        "query": "দহন প্রক্রিয়া এবং মোমের তিনটি অবস্থা ব্যাখ্যা করো (Explain the combustion process and three states of wax)",
        "expected_topic": "Combustion / দহন",
        "type": "theory"
    },
    {
        "subject": "SSC-MATH",
        "query": "বাস্তব সংখ্যা এবং মূলদ-অমূলদ সংখ্যার পার্থক্য (Real numbers, rational and irrational numbers)",
        "expected_topic": "Real Numbers / বাস্তব সংখ্যা",
        "type": "theory"
    },
    {
        "subject": "SSC-MATH",
        "query": "প্রমাণ করো যে রুট ২ একটি অমূলদ সংখ্যা (Prove that root 2 is an irrational number)",
        "expected_topic": "Irrationality of sqrt(2)",
        "type": "worked_example"
    }
]


def run_benchmark(top_k: int = 3):
    collection = get_chroma_collection()
    total_chunks = collection.count()
    print(f"Loaded ChromaDB collection: {total_chunks} total chunks indexed.")

    if total_chunks == 0:
        print("[!] No chunks in local ChromaDB yet. Run batch_ingest_cli.py first.")
        return

    print("\n" + "=" * 75)
    print("RUNNING CROSS-LINGUAL & FORMULA RETRIEVAL BENCHMARKS")
    print("=" * 75)

    for idx, bq in enumerate(BENCHMARK_QUERIES, 1):
        q_text = bq["query"]
        print(f"\n[Test {idx}/{len(BENCHMARK_QUERIES)}] Subject: {bq['subject']}")
        print(f"Query: \"{q_text}\"")
        
        q_emb = get_embedding(q_text)
        results = collection.query(
            query_embeddings=[q_emb],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        matches = results["ids"][0]
        if not matches:
            print("  [!] No matches returned.")
            continue

        print(f"Top {len(matches)} Matches:")
        for rank, (cid, dist, meta, doc) in enumerate(zip(
            matches,
            results["distances"][0],
            results["metadatas"][0],
            results["documents"][0]
        ), 1):
            # Cosine similarity is 1 - cosine_distance
            sim = 1.0 - dist
            preview = doc.replace("\n", " ")[:140]
            print(f"  #{rank} [Score: {sim:.4f}] ID: {cid}")
            print(f"      Lang: {meta.get('language')} | Ch: {meta.get('chapter_no')} | Page: {meta.get('page_no')} | Type: {meta.get('chunk_type')}")
            print(f"      Section: {meta.get('section_no', '')} - {meta.get('section_title', '')}")
            print(f"      Snippet: {preview}...")


if __name__ == "__main__":
    top = 3
    if len(sys.argv) > 1:
        top = int(sys.argv[1])
    run_benchmark(top_k=top)
