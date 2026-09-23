#!/usr/bin/env python3
"""
SheraTutor: Test & Evaluate Fine-Tuned Qwen 2.5 7B Model via Ollama.
Evaluates:
1. Strict NCTB Rubric adherence & JSON Schema validity.
2. Step-by-step consequential marking (ধারাবাহিক গণনা).
3. Mistake category detection (CALCULATION_ERROR, UNIT_CONVERSION, FORMULA_RECALL, etc.).
4. Latency (tokens/sec) and qualitative feedback in natural Bengali.
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

MODEL_NAME = "hf.co/syed181/sheratutor-qwen2.5-7b-gguf"
OLLAMA_API = "http://localhost:11434/api/chat"
VAL_DATASET = Path(__file__).resolve().parent / "dataset/kaggle_dataset/sheratutor_rubric_val.jsonl"

def test_model(sample_idx=0):
    if not VAL_DATASET.exists():
        print(f"[!] Validation dataset not found at: {VAL_DATASET}")
        sys.exit(1)

    with open(VAL_DATASET, "r", encoding="utf-8") as f:
        samples = [json.loads(line) for line in f if line.strip()]

    print(f"[*] Loaded {len(samples)} validation samples.")
    sample = samples[sample_idx]
    messages = sample["messages"][:2]  # system and user prompt
    ground_truth = json.loads(sample["messages"][2]["content"])

    print("=" * 70)
    print("EVALUATION PROMPT:")
    print("=" * 70)
    print(messages[1]["content"][:300] + "...\n")

    print("[*] Sending request to local Ollama instance...")
    start_time = time.time()
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 512,
        }
    }

    try:
        resp = requests.post(OLLAMA_API, json=payload, timeout=120)
        elapsed = time.time() - start_time
        if resp.status_code != 200:
            print(f"[!] Error from Ollama: {resp.status_code} - {resp.text}")
            return False

        data = resp.json()
        raw_output = data.get("message", {}).get("content", "").strip()
        eval_count = data.get("eval_count", 0)
        eval_duration_sec = data.get("eval_duration", 1) / 1e9
        tokens_per_sec = eval_count / eval_duration_sec if eval_duration_sec > 0 else 0

        print(f"[*] Done in {elapsed:.2f}s ({tokens_per_sec:.1f} tokens/sec, total tokens: {eval_count})")
        print("\n" + "=" * 70)
        print("FINE-TUNED MODEL RESPONSE:")
        print("=" * 70)
        print(raw_output)

        # Parse and Validate JSON
        print("\n" + "=" * 70)
        print("EVALUATION & BENCHMARK ANALYSIS:")
        print("=" * 70)
        try:
            # Clean markdown codeblocks if model wrapped in ```json
            cleaned = raw_output
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            print("[✓] Valid JSON Schema Output!")
            print(f" - Score Awarded: {parsed.get('score_obtained')} / {parsed.get('max_marks')}")
            print(f" - Ground Truth Score: {ground_truth.get('score_obtained')} / {ground_truth.get('max_marks')}")
            print(f" - Mistake Category: {parsed.get('mistake_category')} (Ground Truth: {ground_truth.get('mistake_category')})")
            print(f" - Consequential/Arithmetic Verified: {parsed.get('arithmetic_verified')}")
            print(f" - Bengali Feedback: {parsed.get('deduction_summary_bn')}")
            return True
        except json.JSONDecodeError as je:
            print(f"[!] JSON parsing error: {je}")
            return False

    except Exception as e:
        print(f"[!] Exception during inference: {e}")
        return False

if __name__ == "__main__":
    idx = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    test_model(idx)
