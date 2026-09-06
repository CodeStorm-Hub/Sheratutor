# Walkthrough: Ground-Truth Multimodal Textbook Ingestion & Verification

This document details the diagnosis, architectural overhaul, benchmark verification, and active execution of the full sequential corpus ingestion for **NCTB Secondary Chemistry (English & Bangla editions)** across all 12 chapters (PDF Pages 6 to 309).

---

## 1. Audit of the Initial Attempt (58 / 67 Flawed Pages)

A comprehensive audit of the earlier run revealed that 58 out of 67 cached pages in `ingestion/cache/chemistry_en/` suffered from critical mismatches:

| Mismatch Category | Root Cause | Impact on Data |
| :--- | :--- | :--- |
| **Cross-Chapter Prompt Regurgitation** | The static prompt in `textbook_prompts.py` hardcoded concrete examples from Chapter 2 (`Fig 2.05: Burning of Wax`, `2.5 Burning of a Candle`, `Liquid Wax`, `Solid Wax`, `বুনসেন বার্নার`, `টেস্টটিউব`). | Llama-3.2-11b memorized these few-shot tokens and inserted wax candle diagrams and sections into Chapters 3 and 4 (e.g. Pages 43, 50, 57, 64, 65, 67, 70). |
| **Cross-Lingual Contamination** | The static prompt instructed the model to preserve Bengali conjuncts (`যুক্তবর্ণ`) even while transcribing `chemistry_en.pdf`. | English pages had massive Bengali contamination (up to 964 Bengali characters per page, e.g. Page 6, 10, 32, 43, 67). |
| **Degenerative Repetition Loops** | On complex diagrams without text captions, greedy decoding with presence penalty caused autoregressive looping. | Page 49 repeated `চিত্র ৩.০৩` 34 times; Page 34 repeated a 6-line caption 14 times. |
| **Weak Verification Check** | `verify_chapter()` used a loose regex `(?:Fig|চিত্র)` that counted repetitive tags and foreign figures as valid passes. | Chapters 1, 2, and 3 were falsely marked `PASSED` despite severe internal contamination. |

---

## 2. Engineered Solution & Architecture Upgrades

### A. Dynamic, Language-Pure, and Chapter-Scoped Prompts
Implemented `build_textbook_prompt(subject, lang, ch_no, ch_title)` in `ingestion/prompts/textbook_prompts.py`:
- **Strict Language Isolation**:
  - When `lang == "en"`, the prompt enforces: *"This is strictly an ENGLISH VERSION textbook. Transcribe ALL content in English. Absolutely NEVER output any Bengali script or Bengali characters (\\u0980-\\u09FF)."* All few-shot examples and tags (`[STIMULUS]`, `(a), (b), (c), (d)`) are 100% English.
  - When `lang == "bn"`, the prompt enforces authentic Bengali transcription with Bengali tags (`[উদ্দীপক]`, `(ক), (খ), (গ), (ঘ)`).
- **Dynamic Chapter Scoping**:
  - Automatically bounds section numbering to `ch_no.*` and figure numbers to Chapter `ch_no`.
- **Zero Concrete Domain Keywords**:
  - Eliminated all mentions of wax, candle, bunsen burner, and specific section numbers from prompt templates.

### B. Pre-Cache Programmatic Quality Gate
Added `clean_and_validate_markdown(markdown, lang, ch_no)` to `ingestion/nim_batch_ingest.py`:
- Checks language purity (`0` Bengali characters allowed in English edition).
- Rejects sections or figures from foreign chapters.
- Automatically collapses consecutive duplicate lines (eliminating autoregressive loops).
- Invalidates and re-extracts any cached file failing these constraints.

### C. Adaptive Model Escalation
- `extract_with_nim` now uses 2500 max tokens and clean decoding parameters.
- If an ambiguous or dense vector diagram fails 11B validation, the pipeline automatically escalates to `meta/llama-3.2-90b-vision-instruct`.

### D. Hardened Chapter Verification Gate
`verify_chapter()` now checks:
1. **100% Page Coverage**: Assert `persisted_pages == set(range(start_p, end_p + 1))`.
2. **Zero Foreign Sections**: Assert no `X.Y` where `X != ch_no`.
3. **Zero Foreign Figures**: Assert no `Fig X.YY` where `X != ch_no`.
4. **Zero Bengali in English**: Assert 0 Bengali characters in English corpus.
5. If any condition fails, the chapter is marked `FAILED` and halts.

---

## 3. Empirical Revalidation Benchmark Results

Before launching the full run, the updated pipeline was benchmarked on the most severely failing pages:

```
=== REVALIDATION BENCHMARK RESULTS ===

1. EN Page 043 (Ch 3: Structure of Matter - previously 623 Bengali chars & Chapter 2 wax section)
   - Status: PASSED & VERIFIED CLEAN
   - Bengali Characters: 0
   - Foreign Sections: 0
   - Section Captured: 3.1 Symbols of Elements (Verbatim English)

2. EN Page 049 (Ch 3: Structure of Matter - previously 34x repetition loop of Bohr diagram)
   - Status: PASSED & VERIFIED CLEAN
   - Bengali Characters: 0
   - Repetition Loops: 0 (1 max line occurrence)
   - Bohr model theory cleanly extracted

3. BN Page 006 (Ch 1: রসায়নের ধারণা - Bengali edition title page)
   - Status: PASSED & VERIFIED CLEAN
   - Bengali Characters: 1688 (100% authentic Bengali script)
   - Foreign Sections: 0

4. BN Page 030 (Ch 2: পদার্থের অবস্থা - Candle burning diagram & text side-by-side)
   - Status: PASSED & VERIFIED CLEAN
   - Bengali Characters: 1661
   - Figures & Callouts: Fully captured
   - Repetition Loops: 0
```

---

## 4. Current Ingestion Status (`/goal` Sequential Run)

- **Database State**: Fully purged and reset for `SSC-CHEM` (EN & BN).
- **Disk Cache**: Corrupted files purged from `ingestion/cache/chemistry_en/` and `ingestion/cache/chemistry_bn/`.
- **Active Process**: `ingestion/run_chemistry_sequential.py` (Background Task ID `task-1186`).
- **Live Progress**:
  - `[Page 006]` Extracted & verified 755 chars in 10.46s (Zero Bengali characters, 100% English).
  - Persisted to Supabase Chapter 1.
  - Actively processing Chapter 1 (Pages 6 to 21) under the hardened verification gate.
