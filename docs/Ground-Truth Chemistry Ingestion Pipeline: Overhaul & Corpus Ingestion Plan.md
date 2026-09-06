# Ground-Truth Chemistry Ingestion Pipeline: Overhaul & Corpus Ingestion Plan

## Overview
During the previous run, an automated audit revealed that 58 out of 67 cached pages in `ingestion/cache/chemistry_en/` suffered from severe anomalies: Bengali text contamination, prompt token regurgitation (e.g. Chapter 2 wax candle diagrams inserted into Chapters 3 and 4), repetitive degenerative loops (e.g. Bohr figure tag repeated 34 times), and synthetic heading inventions.

This plan details the complete review of `ingestion/`, full structural analysis of both `chemistry_en.pdf` and `chemistry_bn.pdf`, the architectural fix (dynamic language-locked and chapter-scoped prompts, automated quality validation gates), empirical test verification on previously failing pages, and the clean execution protocol for ingesting both full editions (PDF Pages 6 to 309, 12 chapters each).

---

## 1. Codebase Architecture Review (`ingestion/`)

| File | Current Role | Deficiencies Identified | Required Modifications |
| :--- | :--- | :--- | :--- |
| `ingestion/prompts/textbook_prompts.py` | Static OCR prompts for subjects | Hardcoded Chapter 2 examples (`Fig 2.05: Burning of Wax`, `2.5 Burning of a Candle`, `Liquid Wax`, `Solid Wax`, `বুনসেন বার্নার`, `টেস্টটিউব`). Static prompts lack language awareness and chapter context, causing the 11B model to recite prompt tokens. | Replace static strings with `build_textbook_prompt(subject, lang, ch_no, ch_title)` dynamically injecting strict language rules, chapter boundary constraints, and abstract formatting templates without topic-specific keywords. |
| `ingestion/nim_batch_ingest.py` | Helper functions for rendering, NIM API calls, chunking, embedding, Supabase writes | `extract_with_nim` uses a static 1500 max_tokens limit, `presence_penalty=0.15` (which interacts poorly with greedy decoding on repetitive vision tokens), and lacks automatic re-extraction when an output fails quality checks. | Upgrade `extract_with_nim` to 2500 max tokens, clean decoding parameters, and add automatic model escalation (fallback to `meta/llama-3.2-90b-vision-instruct` if 11B fails extraction quality gate). |
| `ingestion/run_chemistry_sequential.py` | Sequential chapter pipeline & verification gate | 1. Extraction does not validate language purity or chapter scope before caching.<br>2. `verify_chapter` used a naive regex `(?:Fig\|চিত্র)` that counted hallucinated figures from foreign chapters and repetitive loop tokens as valid passes.<br>3. Flawed cache was accepted blindly on restart. | 1. Implement inline page validator (`validate_page_markdown`).<br>2. Harden `verify_chapter` to require 100% page coverage, 0 foreign-chapter figures, 0 foreign-language characters, and de-duplicated figures.<br>3. Add automatic purge of invalid cache. |

---

## 2. PDF Structural Analysis: Both BN & EN Editions Page-by-Page

Both `chemistry_en.pdf` and `chemistry_bn.pdf` were analyzed page-by-page. Both documents share an identical 310-page layout and a 1-to-1 page correspondence:

- **Total PDF Pages**: 310 pages
- **Front Matter (Pages 1–5)**:
  - Page 1: Cover Page
  - Page 2: Editorial Board & Publication metadata
  - Page 3–4: Preface (ভূমিকা / Preface)
  - Page 5: **Table of Contents** (সূচিপত্র) — defines the exact 12 chapters and starting page numbers.
- **Back Matter (Page 310)**: Back cover / National anthem / NCTB publication emblem.
- **Core Curriculum Pages**: **PDF Pages 6 to 309** (304 pages total per edition).

### Chapter Mapping Matrix (Identical for EN & BN)

| Ch # | Chapter Title (English) | Chapter Title (Bangla) | Printed Pages | PDF Page Range | Total Pages | Key Visual & Layout Elements |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | Concepts of Chemistry | রসায়নের ধারণা | 1–16 | **6–21** | 16 | Hazard symbols table, scientific method flowcharts, exercise CQ (p. 21). |
| **2** | States of Matter | পদার্থের অবস্থা | 17–34 | **22–39** | 18 | Kinetic theory diagrams, candle burning (p. 30), heating/cooling curves, diffusion experiments. |
| **3** | Structure of Matter | পদার্থের গঠন | 35–58 | **40–63** | 24 | Rutherford/Bohr atomic models (pp. 48–49), electron configurations, isotopes, energy shell diagrams. |
| **4** | Periodic Table | পর্যায় সারণি | 59–81 | **64–86** | 23 | Full 2-page periodic table spread (pp. 68–69), group/period properties, electronegativity trends. |
| **5** | Chemical Bond | রাসায়নিক বন্ধন | 82–108 | **87–113** | 27 | Lewis dot structures, ionic/covalent lattice diagrams, metallic bonding electron sea. |
| **6** | Concept of Mole & Chemical Calculation | মোলের ধারণা ও রাসায়নিক গণনা | 109–141 | **114–146** | 33 | Stoichiometric calculation tables, molar volume graphs, percentage composition equations. |
| **7** | Chemical Reactions | রাসায়নিক বিক্রিয়া | 142–167 | **147–172** | 26 | Exothermic/endothermic energy diagrams, redox transfer diagrams, reaction classification tables. |
| **8** | Chemistry and Energy | রসায়ন ও শক্তি | 168–205 | **173–210** | 38 | Electrochemical cells (Galvanic/Electrolytic), battery apparatus drawings, bond energy tables. |
| **9** | Acid-Base Balance | এসিড-ক্ষার সমতা | 206–232 | **211–237** | 27 | pH scale color charts, acid rain environmental graphics, neutralization titration curves. |
| **10** | Mineral Resources: Metal-Nonmetal | খনিজ সম্পদ: ধাতু-অধাতু | 233–260 | **238–265** | 28 | Blast furnace cross-sections, metallurgical extraction flowcharts, alloy composition tables. |
| **11** | Mineral Resources: Fossils | খনিজ সম্পদ: জীবাশ্ম | 261–286 | **266–291** | 26 | Fractional distillation column diagrams, polymer reaction mechanisms, organic nomenclature tables. |
| **12** | Chemistry in Our Lives | আমাদের জীবনে রসায়ন | 287–304 | **292–309** | 18 | Household chemicals (bleach, vinegar, baking soda) production schemes, environmental impact charts. |

---

## 3. Proposed Changes & Technical Architecture

### Component 1: Dynamic Prompt Builder (`ingestion/prompts/textbook_prompts.py`)
Replace static prompt constants with `build_textbook_prompt(subject, lang, ch_no, ch_title)`:
- **Strict Language Isolation**:
  - For `lang == "en"`: `"This is an ENGLISH edition textbook. Transcribe ONLY in English. Absolutely ZERO Bengali characters (\\u0980-\\u09FF) are allowed."`
  - For `lang == "bn"`: `"This is a BENGALI edition textbook. Transcribe in authentic Bengali verbatim."`
- **Dynamic Chapter Scoping**:
  - Inject active Chapter Number and Title: `"You are transcribing Chapter {ch_no}: '{ch_title}'. All sections MUST strictly start with '{ch_no}.'. NEVER transcribe or hallucinate sections, figures, or topics from other chapters."`
- **Zero Hardcoded Examples**:
  - Remove all concrete words (wax, candle, bunsen burner) from few-shot instructions. Use abstract grammar rules: `[চিত্র / DIAGRAM]\nCaption: Fig <Ch>.<No>: <Exact printed title>\nCallouts: <Labels>\nDescription: <Summary>`.

### Component 2: Page-Level Programmatic Quality Gate (`ingestion/nim_batch_ingest.py` & `ingestion/run_chemistry_sequential.py`)
Implement `validate_page_markdown(markdown, lang, ch_no)` before caching or database persistence:
1. **Language Check**:
   - If `lang == "en"` and `len(re.findall(r'[\u0980-\u09ff]', markdown)) > 0`: **REJECT**.
2. **Foreign Chapter Check**:
   - Find all `## X.Y` or `Fig X.Y`. If `X != ch_no` (and `X in 1..12`): **REJECT**.
3. **Repetitive Loop Check**:
   - If any figure tag or sentence is repeated > 2 times: **REJECT or CLAMP**.
4. **Adaptive Retry / Model Escalation**:
   - If 11B fails validation twice, automatically escalate the page to `meta/llama-3.2-90b-vision-instruct`.

### Component 3: Hardened Chapter Verification Gate (`verify_chapter`)
Audit database records for each completed chapter:
- **100% Page Coverage**: Assert `persisted_pages == set(range(start_p, end_p + 1))`.
- **Zero Language Leaks**: Assert `count(bengali_chars) == 0` for English corpus.
- **Zero Foreign Figures**: Assert every figure captured matches `ch_no`.
- **Zero Empty Chunks**: Assert chunk char counts meet content thresholds.

### Component 4: Clean Slate Reset
1. Purge flawed cache: `rm -rf ingestion/cache/chemistry_en/*`.
2. Clear Supabase tables for `SSC-CHEM` (English curriculum version `1a6b7188-1d70-42d5-a0a8-9d19f02d5d58`):
   - Delete from `chunk_embeddings`
   - Delete from `curriculum_chunks`

---

## 4. Verification & Testing Plan

### Step 1: Unit Test the Dynamic Prompt & Quality Gate
Run a benchmark test on the top 4 worst-performing pages from earlier:
- **Page 43 (EN)**: Verify 0 Bengali characters, exact `3.3 Symbols of Elements` transcription.
- **Page 49 (EN)**: Verify 0 repetitive loops, clean Bohr model transcription.
- **Page 64 (EN)**: Verify Periodic table introduction without Chapter 2 wax candle hallucinations.
- **Page 30 (BN)**: Verify authentic Bengali transcription for Chapter 2 candle burning in the Bengali edition.

### Step 2: Test Chapter 1 Full Ingestion (Pages 6–21)
Run Chapter 1 under the updated pipeline, verify the gate passes with 100% coverage, 0 anomalies, and review Supabase records.

### Step 3: Launch Full Sequential Corpus Ingestion
Once verified, execute:
1. **English Edition (`chemistry_en.pdf`)**: Chapters 1 through 12 (PDF Pages 6 to 309).
2. **Bangla Edition (`chemistry_bn.pdf`)**: Chapters 1 through 12 (PDF Pages 6 to 309).
Each chapter verified and audited before proceeding to the next.
