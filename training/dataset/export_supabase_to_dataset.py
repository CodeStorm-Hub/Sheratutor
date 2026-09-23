#!/usr/bin/env python3
"""
SheraTutor: Export Supabase Questions & Rubrics to Multi-Mistake Fine-Tuning Dataset.

This script:
1. Connects to Supabase to fetch NCTB questions and their versioned rubrics (criteria_json).
2. Uses Google Gemini API (with rotating free-tier keys) to synthesize 5 realistic student
   answer variants per question corresponding to realistic error categories:
   - FULL_MARKS
   - CALCULATION_ERROR (with consequential marking / ধারাবাহিক গণনা)
   - UNIT_CONVERSION
   - FORMULA_RECALL
   - CONCEPTUAL_MISCONCEPTION
3. Formats each (Question + Rubric + Student Answer -> RubricEvaluationSchema JSON)
   into standard ChatML format for Unsloth Qwen 2.5 training.
4. Splits output into train and validation JSONL files.

Usage:
  python3 training/dataset/export_supabase_to_dataset.py --limit 5  # Quick test
  python3 training/dataset/export_supabase_to_dataset.py            # Full run
"""

import os
import sys
import json
import re
import time
import argparse
import random
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Try importing supabase and google-genai
try:
    from supabase import create_client, Client
except ImportError:
    print("Error: 'supabase' package is required. Install via: pip install supabase")
    sys.exit(1)

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: 'google-genai' package is required. Install via: pip install google-genai")
    sys.exit(1)

# Find and load web/.env.local
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
ENV_LOCAL_PATH = WORKSPACE_ROOT / "web" / ".env.local"
if ENV_LOCAL_PATH.exists():
    load_dotenv(ENV_LOCAL_PATH)
else:
    load_dotenv()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Collect all available Gemini API keys for seamless rotation
GEMINI_KEYS = [
    os.environ.get("GEMINI_API_KEY", ""),
    os.environ.get("GEMINI_API_KEY_SECONDARY", ""),
    os.environ.get("GEMINI_API_KEY_QUAT", ""),
    os.environ.get("GEMINI_API_KEY_QUIN", ""),
    os.environ.get("GCP_API_KEY", ""),
]
GEMINI_KEYS = [k.strip() for k in GEMINI_KEYS if k and k.strip()]

if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"Error: Missing Supabase credentials in {ENV_LOCAL_PATH}")
    sys.exit(1)

if not GEMINI_KEYS:
    print("Error: No Gemini API keys found in environment or .env.local")
    sys.exit(1)

print(f"[*] Initialized with {len(GEMINI_KEYS)} rotating Gemini API key(s).")

class KeyRotator:
    def __init__(self, keys: List[str]):
        self.keys = keys
        self.index = 0

    def get_client(self) -> genai.Client:
        key = self.keys[self.index % len(self.keys)]
        self.index += 1
        return genai.Client(api_key=key)

rotator = KeyRotator(GEMINI_KEYS)

SYSTEM_PROMPT_EVALUATOR = (
    "You are an expert Bangladeshi SSC/HSC board examiner and AI grading engine for SheraTutor. "
    "Your task is to evaluate a student's transcribed exam answer against the provided NCTB rubric. "
    "Verify all mathematical derivations step-by-step for numerical accuracy. "
    "If a student makes an early calculation error but uses correct subsequent logic, award consequential partial credit (ধারাবাহিক গণনা). "
    "Write deduction_summary_bn in natural, encouraging Bengali suitable for high school students. "
    "Output ONLY a raw, valid JSON object conforming exactly to the RubricEvaluationSchema."
)

SYNTHESIS_PROMPT_TEMPLATE = """
You are creating training data for SheraTutor's automated exam grading AI for Bangladeshi secondary (SSC) students.

QUESTION:
{question_text}
Maximum Marks: {max_marks}

OFFICIAL NCTB MARKING RUBRIC:
{rubric_criteria}

Generate a realistic handwritten-style student response and the corresponding ground-truth grading evaluation for the specific error category: **{error_category}**.

ERROR CATEGORY DEFINITION:
- FULL_MARKS: The student solves the question completely correctly with proper formulas, steps, units, and clear Bengali explanation.
- CALCULATION_ERROR: The student identifies the correct formula and substitutes values properly, but makes an arithmetic/calculation slip (e.g. 15 * 4 = 50). Apply consequential marking (ধারাবাহিক গণনা): award marks for the formula and correct subsequent method, only penalizing the calculation step.
- UNIT_CONVERSION: The student forgets or bungles a unit conversion (e.g. grams to kg, km/h to m/s, or cm to m) but otherwise follows the right procedure.
- FORMULA_RECALL: The student misremembers or writes an incorrect formula (e.g. missing an exponent or sign), losing the formula mark.
- CONCEPTUAL_MISCONCEPTION: The student misapplies a core scientific/mathematical principle or uses an entirely irrelevant law.

You must respond with a JSON object with two top-level keys:
1. "student_answer": A realistic student answer written in natural Bengali with LaTeX math equations (e.g. inline \\( ... \\) or display \\[ ... \\]), reflecting the specified error mode.
2. "evaluation": The ground-truth RubricEvaluationSchema JSON object containing:
   - "question_id": "{question_id}"
   - "max_marks": {max_marks}
   - "score_obtained": <number>
   - "criteria_evaluations": [
       {{
         "step_name": "<name of step from rubric>",
         "max_step_marks": <number>,
         "awarded_marks": <number>,
         "status": "MATCHED" | "PARTIAL" | "MISSING" | "INCORRECT",
         "observation": "<specific reason in Bengali explaining the mark>",
         "cited_rubric_rule": "<relevant rubric step>"
       }}
     ]
   - "deduction_summary_bn": "<warm, constructive explanation in Bengali describing what was right and why marks were deducted>"
   - "deduction_summary_en": "<plain English summary>"
   - "grounding_confidence": 0.95
   - "transcript_mismatch_detected": false
   - "mistake_category": "{error_category}"
   - "arithmetic_verified": true

Output ONLY valid JSON.
"""

def generate_student_variant(
    question_id: str,
    question_text: str,
    max_marks: float,
    rubric_criteria: Any,
    error_category: str,
    max_retries: int = 4
) -> Optional[Dict[str, Any]]:
    prompt = SYNTHESIS_PROMPT_TEMPLATE.format(
        question_id=question_id,
        question_text=question_text,
        max_marks=max_marks,
        rubric_criteria=json.dumps(rubric_criteria, ensure_ascii=False, indent=2),
        error_category=error_category,
    )

    models_to_try = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]
    for attempt in range(max_retries):
        model_name = models_to_try[attempt % len(models_to_try)]
        try:
            client = rotator.get_client()
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                )
            )

            raw_text = response.text.strip()
            # Clean markdown codeblocks if present
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            cleaned_text = raw_text.strip()
            try:
                data = json.loads(cleaned_text, strict=False)
            except json.JSONDecodeError:
                # Repair unescaped LaTeX backslashes inside JSON strings
                repaired = re.sub(r'\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})', r'\\\\', cleaned_text)
                data = json.loads(repaired, strict=False)

            if "student_answer" in data and "evaluation" in data:
                return data
            else:
                print(f"[!] Malformed output structure on attempt {attempt+1}, retrying...")

        except Exception as e:
            wait_time = (attempt + 1) * 3
            print(f"[!] Gemini generation error ({e}). Backing off {wait_time}s...")
            time.sleep(wait_time)

    return None

def build_chatml_record(
    question_text: str,
    max_marks: float,
    rubric_criteria: Any,
    student_answer: str,
    evaluation: Dict[str, Any]
) -> Dict[str, Any]:
    user_prompt = (
        f"QUESTION (max {max_marks} marks): {question_text}\n\n"
        f"OFFICIAL RUBRIC: {json.dumps(rubric_criteria, ensure_ascii=False)}\n\n"
        f"STUDENT'S TRANSCRIBED ANSWER (verbatim, including any errors):\n{student_answer}"
    )

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT_EVALUATOR},
            {"role": "user", "content": user_prompt},
            {"role": "assistant", "content": json.dumps(evaluation, ensure_ascii=False)}
        ]
    }

def main():
    parser = argparse.ArgumentParser(description="Export Supabase Questions and Rubrics to Training Dataset.")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of questions to process (for testing).")
    parser.add_argument("--val-split", type=float, default=0.1, help="Validation split ratio (default: 0.1).")
    parser.add_argument("--output-dir", type=str, default="training/dataset", help="Output directory.")
    args = parser.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("[*] Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Query questions with their active rubrics
    query = supabase.table("questions").select(
        "id, question_text_bn, question_text_en, max_marks, rubrics(id, criteria_json)"
    )
    if args.limit:
        query = query.limit(args.limit)

    res = query.execute()
    questions = res.data or []
    print(f"[*] Retrieved {len(questions)} question(s) from Supabase.")

    if not questions:
        print("[!] No questions found in Supabase.")
        return

    error_categories = [
        "FULL_MARKS",
        "CALCULATION_ERROR",
        "UNIT_CONVERSION",
        "FORMULA_RECALL",
        "CONCEPTUAL_MISCONCEPTION",
    ]

    all_records = []
    success_count = 0
    total_target = len(questions) * len(error_categories)

    print(f"[*] Starting multi-mistake synthesis (Target: ~{total_target} samples)...")

    for q_idx, q in enumerate(questions):
        q_id = q["id"]
        q_text = q.get("question_text_bn") or q.get("question_text_en") or ""
        max_marks = float(q.get("max_marks", 3.0))

        rubrics_data = q.get("rubrics")
        if isinstance(rubrics_data, list) and rubrics_data:
            rubric_criteria = rubrics_data[0].get("criteria_json", [])
        elif isinstance(rubrics_data, dict):
            rubric_criteria = rubrics_data.get("criteria_json", [])
        else:
            rubric_criteria = [
                {"step_name": "উত্তর উপস্থাপনা ও যৌক্তিকতা", "max_step_marks": max_marks, "matching_rules": "সম্পূর্ণ সঠিক সমাধান"}
            ]

        print(f"\n[{q_idx + 1}/{len(questions)}] Processing Question {q_id[:8]} (Max: {max_marks})...")

        for category in error_categories:
            print(f"  -> Synthesizing mode: {category}...", end=" ", flush=True)
            synth_res = generate_student_variant(
                question_id=q_id,
                question_text=q_text,
                max_marks=max_marks,
                rubric_criteria=rubric_criteria,
                error_category=category,
            )

            if synth_res:
                record = build_chatml_record(
                    question_text=q_text,
                    max_marks=max_marks,
                    rubric_criteria=rubric_criteria,
                    student_answer=synth_res["student_answer"],
                    evaluation=synth_res["evaluation"],
                )
                all_records.append(record)
                success_count += 1
                print("✓")
            else:
                print("✗ (Failed after retries)")

            # Polite spacing to respect rate limits
            time.sleep(0.5)

    print(f"\n[*] Total samples successfully synthesized: {len(all_records)}")

    # Shuffle and split into train and val
    random.seed(42)
    random.shuffle(all_records)

    val_count = max(1, int(len(all_records) * args.val_split))
    val_records = all_records[:val_count]
    train_records = all_records[val_count:]

    train_path = out_dir / "sheratutor_rubric_train.jsonl"
    val_path = out_dir / "sheratutor_rubric_val.jsonl"

    with open(train_path, "w", encoding="utf-8") as f:
        for r in train_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    with open(val_path, "w", encoding="utf-8") as f:
        for r in val_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"[✓] Train dataset saved to: {train_path} ({len(train_records)} samples)")
    print(f"[✓] Val dataset saved to:   {val_path} ({len(val_records)} samples)")

if __name__ == "__main__":
    main()
