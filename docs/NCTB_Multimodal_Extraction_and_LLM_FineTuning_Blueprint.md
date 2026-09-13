# NCTB Multimodal Extraction & LLM Fine-Tuning Blueprint
## Comprehensive Guide for Extracting Text, Images & Structured Data from Bangladesh NCTB Textbooks for LLM/VLM Training

> **Target Curriculum:** National Curriculum and Textbook Board (NCTB) Secondary (Class 9–10 / SSC) & Higher Secondary (Class 11–12 / HSC)  
> **Target Models:** Text LLMs (Continual Pre-training, Reasoning SFT) & Vision-Language Models (VLM Fine-Tuning)  
> **Source Documents:** Bilingual NCTB Textbooks (Bangla & English Versions)  
> **Repository Reference:** `SheraTutor / ingestion`

---

## 1. Executive Summary: Moving Beyond Full-Page OCR

The initial ingestion pipeline in SheraTutor successfully solved full-corpus RAG indexing for Class 9–10 Chemistry (608 physical pages) using `pdftoppm` rendering coupled with NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct`). 

However, **training and fine-tuning an LLM/VLM requires fundamentally different data characteristics than RAG search**:
- **RAG** requires dense semantic chunks for text retrieval.
- **LLM Pre-training / SFT** requires clean, coherent discourse structure, high-fidelity LaTeX equations, verbatim mathematical proofs, and chain-of-thought solutions.
- **Multimodal VLM Training** requires **physically cropped, high-resolution diagram files** paired with precise bounding boxes, callouts, and targeted scientific explanations.

### Critical Limitations of the "Full-Page VLM Prompt" Approach
1. **No Physical Image Assets:** Full-page VLMs output textual placeholders (`[DIAGRAM] Caption: ...`), but produce no cropped image files for training vision models (LLaVA, Qwen2.5-VL).
2. **Autoregressive Loops on Sparse Pages:** Large vision models frequently enter repetition token loops on short/sparse pages (repeating headers 40+ times).
3. **Scrambled Reading Order:** Multi-column layouts and sidebars in textbook pages are frequently merged out-of-order by naive raster OCR.
4. **Hallucinated Content:** Prompts requesting exercises can cause the model to hallucinate fake `[STIMULUS]` MCQs on normal prose pages.

---

## 2. The Recommended Architecture: "Segment-First, Transcribe-Second"

Top frontier labs (DeepSeek, Qwen, OpenDataLab) decouple document processing into three specialized, deterministic stages:

```
                            NCTB Bilingual PDF Textbooks
                                         │
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ STAGE 1: High-Precision Layout Segmentation   │
                 │ - Tool: MinerU (Magic-PDF) or IBM Docling     │
                 │ - Identifies columns, text blocks, reading order│
                 │ - Physical crop of all diagrams, graphs, charts│
                 └───────────────────────┬───────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
  [Text Blocks]                  [Diagram Crops]                 [Tables & Formulas]
  - Reading order preserved      - High-res PNGs/SVGs            - Native LaTeX math
  - Clean Bangla / English       - Bounding box [x, y, w, h]     - Clean Markdown / JSON
         │                               │                               │
         └───────────────────────────────┼───────────────────────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ STAGE 2: Multimodal Enrichment Engine          │
                 │ - Feed cropped diagrams to Qwen2.5-VL / NIM    │
                 │ - Extract all Bengali/English labels & callouts│
                 │ - Generate pedagogical questions & explanations│
                 └───────────────────────┬───────────────────────┘
                                         │
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │ STAGE 3: Dataset Formatting & Tokenization    │
                 │ 1. Continual Pre-Training (CPT) Corpus (JSONL)│
                 │ 2. Math & Science CoT Reasoning SFT Dataset   │
                 │ 3. Creative Question (সৃজনশীল) 4-Tier SFT     │
                 │ 4. Multimodal Vision VLM Dataset (ShareGPT4V) │
                 └───────────────────────────────────────────────┘
```

---

## 3. Tooling Evaluation & Comparison

| Feature | Current Pipeline (`nim_batch_ingest.py`) | **MinerU (Magic-PDF)** *(Top Recommendation)* | **IBM Docling** *(Best for Layout/Tables)* | **Qwen2.5-VL Grounding** *(Best Cloud/API)* |
| :--- | :--- | :--- | :--- | :--- |
| **Diagram Extraction** | Text description only (`[DIAGRAM]`) | **Automatic high-res image crops** to `images/` | **Native image export** with bounding boxes | Outputs `[ymin, xmin, ymax, xmax]` coordinates |
| **Formula Handling** | VLM LaTeX transcription | Dedicated Math Formula Recognition (MFR) | Embedded LaTeX math parsing | Excellent multilingual LaTeX |
| **Table Accuracy** | Markdown tables (can drop cells) | Dedicated TableMaster model | **Exports directly to Pandas / JSON / Markdown** | Markdown |
| **Multi-Column Order** | Frequently scrambled | **SOTA layout reading order** | **Semantic section tree** | Layout-dependent |
| **Bangla Conjuncts** | High (Llama-3.2 vision) | High (Surya / PaddleOCR backend) | High (EasyOCR / RapidOCR) | Outstanding (Qwen native tokenizer) |
| **Cost / Speed** | API limits / 429 timeouts | **100% Local (GPU/CPU) & Free** | **100% Local (CPU/GPU) & Free** | Open weights or cheap API |

---

## 4. Subject-by-Subject Extraction Specifications

NCTB books feature different structural patterns depending on the subject. The extraction pipeline should apply tailored rules per subject:

### 4.1 Physics (পদার্থবিজ্ঞান)
- **Visual Targets:** Circuit diagrams, ray optics diagrams, kinematics graphs ($s$-$t$, $v$-$t$ curves), free-body force diagrams, vernier caliper / screw gauge measurements.
- **Formulas:** Kinematics ($v = u + at$, $s = ut + \frac{1}{2}at^2$), Newton's laws ($F = ma$), work & power, waves, and optics.
- **Special Rule:** Convert Bengali digits inside equations to Arabic digits ($০-৯ \to 0-9$) using Unicode normalization:
  ```python
  BN_DIGIT_MAP = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
  # Keeps Bengali numbers in narrative text, standardizes LaTeX formulas
  ```

### 4.2 Chemistry (রসায়ন)
- **Visual Targets:** Experimental apparatus setups (fractional distillation, gas collection), atomic Bohr/Rutherford models, 2D covalent/ionic crystal structures.
- **Equations & Data:**
  - Chemical equations with state symbols: $\text{CaCO}_3\text{(s)} \xrightarrow{\Delta} \text{CaO(s)} + \text{CO}_2\text{(g)}$
  - Thermochemical values: $\Delta H = -890\text{ kJ/mol}$
  - Periodic table: Do not extract as loose text. Extract as structured JSON with `atomic_number`, `symbol`, `group`, `period`, and `mass`.

### 4.3 General & Higher Mathematics (সাধারণ গণিত ও উচ্চতর গণিত)
- **Visual Targets:** Geometric figures (circles, triangles, cyclic quadrilaterals), Cartesian coordinate graphs, Venn diagrams, vectors.
- **Reasoning Structure:** Extract theorems into standard mathematical discourse:
  - **সাধারণ নির্বাচন (General Enunciation)**
  - **বিশেষ নির্বাচন (Particular Enunciation)**
  - **অঙ্কন (Construction)**
  - **প্রমাণ (Step-by-Step Proof)**

### 4.4 Biology (জীববিজ্ঞান)
- **Visual Targets:** Cell organelles, human digestive/circulatory system, plant anatomy, cell division (Mitosis/Meiosis stages).
- **Enrichment Task:** Each diagram must be cropped, then processed by a VLM to generate a key-value mapping of all labeled callouts in authentic Bengali:
  ```json
  {
    "diagram": "mitosis_anaphase.png",
    "callouts": {
      "অপত্য ক্রোমোজোম": "Daughter chromosome moving to opposite poles",
      "সেন্ট্রোমিয়ার": "Centromere leading the movement",
      "স্পিন্ডল তন্তু": "Spindle fibers contracting"
    }
  }
  ```

### 4.5 Bangladesh & Global Studies (বাংলাদেশ ও বিশ্বপরিচয়)
- **Visual Targets:** Maps of Bangladesh, historical photographs, statistical demographic tables.
- **Text Structure:** Chronological historical events, constitutional frameworks, social studies topics. Focus on clean hierarchical markdown (`#`, `##`, `###`).

---

## 5. Dataset Formats for LLM / VLM Fine-Tuning

Once extraction and enrichment are complete, compile the data into three standard dataset formats:

### Format 1: Continual Pre-Training (CPT) Dataset
Used to adapt open-weights models (e.g., Llama-3, Qwen2.5, DeepSeek) to the Bengali educational domain.

**File:** `cpt_nctb_corpus.jsonl`
```json
{
  "text": "# অধ্যায় ৪: পদার্থের অবস্থা\n\n## ৪.১ কণার গতিতত্ত্ব\nকণার গতিতত্ত্ব অনুসারে সকল পদার্থই ক্ষুদ্র ক্ষুদ্র কণা দ্বারা গঠিত। এই কণাগুলো সর্বদা গতিশীল অবস্থায় থাকে...",
  "metadata": {
    "subject": "SSC-CHEM",
    "language": "bn",
    "class": "9-10",
    "chapter": 4,
    "source_pdf": "chemistry_bn.pdf"
  }
}
```

---

### Format 2: Supervised Fine-Tuning (SFT) Reasoning Dataset (DeepSeek-R1 / Qwen-Math Style)
Used to train the LLM to think step-by-step and show its work before providing the final answer.

**File:** `sft_reasoning_pairs.jsonl`
```json
{
  "system": "You are SheraTutor, an AI tutor specialized in Bangladesh NCTB curriculum.",
  "subject": "physics",
  "language": "bn",
  "prompt": "একটি 500 g ভরের বস্তুর উপর 10 N বল 4 সেকেন্ড ধরে প্রযুক্ত হলো। বস্তুটির ভরবেগের পরিবর্তন ও ত্বরণ কত?",
  "thought": "প্রদত্ত উপাত্ত:\n- ভর, m = 500 g = 0.5 kg\n- প্রযুক্ত বল, F = 10 N\n- সময়, t = 4 s\n\nসূত্রাবলী:\n1. ত্বরণ, a = F / m\n2. ভরবেগের পরিবর্তন, Δp = F * t (বলের ঘাত = ভরবেগের পরিবর্তন)\n\nগণনা:\n- ত্বরণ a = 10 / 0.5 = 20 m/s²\n- ভরবেগের পরিবর্তন Δp = 10 * 4 = 40 kg·m/s",
  "response": "বস্তুটির প্রয়োজনীয় মানগুলো নিচে নির্ণয় করা হলো:\n\n1. **ত্বরণ:** \n$$a = \\frac{F}{m} = \\frac{10\\text{ N}}{0.5\\text{ kg}} = 20\\text{ m/s}^2$$\n\n2. **ভরবেগের পরিবর্তন:**\n$$\\Delta p = F \\times t = 10\\text{ N} \\times 4\\text{ s} = 40\\text{ kg}\\cdot\\text{m/s}$$\n\nঅতএব, বস্তুটির ত্বরণ **20 m/s²** এবং ভরবেগের পরিবর্তন **40 kg·m/s**।"
}
```

---

### Format 3: NCTB Creative Question (সৃজনশীল প্রশ্ন) 4-Tier SFT Dataset
The standardized examination format across all secondary boards in Bangladesh.

**File:** `sft_creative_questions.jsonl`
```json
{
  "subject": "chemistry",
  "stimulus": "পাত্র 'A'-তে 250 mL 0.1 M HCl দ্রবণ এবং পাত্র 'B'-তে 250 mL 0.1 M NaOH দ্রবণ রয়েছে।",
  "questions": {
    "a": "মোলার দ্রবণ কাকে বলে?",
    "b": "তাপমাত্রার সাথে মোলারিটির পরিবর্তন ঘটে কেন ব্যাখ্যা করো।",
    "c": "পাত্র 'A'-এর দ্রবণে কত গ্রাম HCl দ্রবীভূত আছে নির্ণয় করো।",
    "d": "উভয় পাত্রের দ্রবণ একত্রে মিশ্রিত করলে মিশ্রণের প্রকৃতি কেমন হবে? গাণিতিকভাবে বিশ্লেষণ করো।"
  },
  "answers": {
    "a": "একটি নির্দিষ্ট তাপমাত্রায় এক লিটার দ্রবণের মধ্যে যদি এক মোল দ্রবীভূত থাকে, তবে তাকে মোলার দ্রবণ বলে।",
    "b": "মোলারিটি দ্রবণের আয়তনের উপর নির্ভরশীল। তাপমাত্রা পরিবর্তিত হলে দ্রবণের আয়তন প্রসারিত বা সংকুচিত হয়, ফলে দ্রবণে দ্রবের ঘনমাত্রা বা মোলারিটি পরিবর্তিত হয়।",
    "c": "আমরা জানি, $w = \\frac{SMV}{1000} = \\frac{0.1 \\times 36.5 \\times 250}{1000} = 0.9125\\text{ g}$...",
    "d": "যেহেতু HCl এবং NaOH সমমোলীয় অনুপাতে (1:1) বিক্রিয়া করে প্রশমিত হয়, তাই মিশ্রণটি সম্পূর্ণ নিরপেক্ষ হবে এবং pH হবে 7..."
  }
}
```

---

### Format 4: Multimodal Vision-Language Dataset (ShareGPT4V / LLaVA Format)
Used to fine-tune open vision models (LLaVA-NeXT, Qwen2.5-VL) on NCTB scientific diagrams.

**File:** `vlm_diagram_conversations.json`
```json
[
  {
    "id": "phys_bn_ch3_fig_3_04",
    "image": "images/physics/bn/fig_3_04_action_reaction.png",
    "conversations": [
      {
        "from": "human",
        "value": "<image>\nচিত্রটিতে প্রদর্শিত ঘটনাটি নিউটনের কোন গতিসূত্রকে নির্দেশ করে? ক্রিয়া ও প্রতিক্রিয়া বলের সম্পর্ক ব্যাখ্যা করো।"
      },
      {
        "from": "gpt",
        "value": "চিত্রটি নিউটনের গতির তৃতীয় সূত্র নির্দেশ করে: 'প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে।'\n\nযখন ব্যক্তিটি নৌকা থেকে তীরে লাফ দেয়, তখন সে নৌকার উপর পেছনের দিকে একটি বল প্রয়োগ করে (ক্রিয়া বল, $F_1$)। একই মুহূর্তে নৌকাটি ব্যক্তির উপর সামনের দিকে সমান ও বিপরীতমুখী বল প্রয়োগ করে (প্রতিক্রিয়া বল, $F_2$)। ফলে ব্যক্তি তীরে পৌঁছাতে সক্ষম হয় এবং নৌকাটি পেছনের দিকে সরে যায়।"
      }
    ]
  }
]
```

---

## 6. Concrete Implementation Scripts

### Script 1: Extracting All Embedded Diagrams as Physical Images
```python
# ingestion/extract_diagram_crops.py
import os
from pathlib import Path
import fitz  # PyMuPDF

def extract_pdf_images(pdf_path: str, output_dir: str, subject: str, lang: str):
    doc = fitz.open(pdf_path)
    out_path = Path(output_dir) / subject / lang
    out_path.mkdir(parents=True, exist_ok=True)
    
    extracted_count = 0
    catalog = []
    
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_no = page_idx + 1
        images = page.get_images(full=True)
        
        for img_idx, img_info in enumerate(images):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            img_bytes = base_image["image"]
            ext = base_image["ext"]
            w, h = base_image["width"], base_image["height"]
            
            # Filter out tiny decorative lines, icons, page dividers
            if w < 120 or h < 120:
                continue
                
            filename = f"{subject}_{lang}_p{page_no:03d}_fig{img_idx:02d}.{ext}"
            filepath = out_path / filename
            filepath.write_bytes(img_bytes)
            
            catalog.append({
                "subject": subject,
                "language": lang,
                "page": page_no,
                "file_path": str(filepath),
                "width": w,
                "height": h
            })
            extracted_count += 1
            
    print(f"[{subject}-{lang}] Extracted {extracted_count} high-res diagram assets to {out_path}")
    return catalog

if __name__ == "__main__":
    extract_pdf_images("ingestion/textbooks/chemistry_bn.pdf", "dataset/images", "chemistry", "bn")
```

---

### Script 2: Using IBM Docling for Clean Layout, Text & Tables
```python
# ingestion/docling_nctb_parser.py
from pathlib import Path
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.datamodel.base_models import InputFormat

def parse_nctb_book(pdf_path: str, output_dir: str):
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    pipeline_options = PdfPipelineOptions()
    pipeline_options.images_scale = 2.0
    pipeline_options.generate_picture_images = True  # Automatically crops all figures!
    
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
        }
    )
    
    print(f"Parsing {pdf_path} with Docling...")
    result = converter.convert(pdf_path)
    doc = result.document
    
    # 1. Save Full Document Markdown
    md_content = doc.export_to_markdown()
    (out_dir / "textbook_clean.md").write_text(md_content, encoding="utf-8")
    
    # 2. Save Cropped Pictures
    img_dir = out_dir / "figures"
    img_dir.mkdir(exist_ok=True)
    for idx, pic in enumerate(doc.pictures):
        pic.image.save(img_dir / f"figure_{idx:03d}.png")
        
    print(f"Successfully exported Markdown and {len(doc.pictures)} figures to {output_dir}")

if __name__ == "__main__":
    parse_nctb_book("ingestion/textbooks/chemistry_bn.pdf", "dataset/docling_output/chemistry_bn")
```

---

## 7. Quality Assurance & Normalization Gates

Based on the failure modes documented in `SheraTutor: End-to-End RAG Ingestion Pipeline Report`, the following automated filters must be applied to all extracted text before training:

1. **Devanagari (Hindi) Rejection Gate:**
   OCR and vision models trained predominantly on Hindi sometimes output Devanagari script for ambiguous Bengali characters.
   ```python
   HINDI_REGEX = re.compile(r"[\u0900-\u0963\u0966-\u097F]")
   assert not HINDI_REGEX.search(text), "Devanagari character detected in Bengali dataset!"
   ```

2. **Cycle Loop Collapsing Gate:**
   Eliminates repeating n-gram loops caused by vision model degeneration:
   ```python
   # Multi-line cycle loop collapsing (k from 1 to 40)
   # Implemented in ingestion/nim_batch_ingest.py:lines 206-234
   ```

3. **LaTeX Math Delimiter Balancing:**
   Verify every `$` and `$$` delimiter is properly closed:
   ```python
   assert text.count("$") % 2 == 0, "Unbalanced LaTeX inline math delimiters ($)!"
   ```

4. **Stimulus Hallucination Pruning:**
   Strip fake `**[STIMULUS]**` or `**[উদ্দীপক]**` injected into standard prose pages. Only allow exercise tags on pages within the verified chapter exercise page ranges.

---

## 8. Recommended Execution Roadmap

1. **Step 1: Test MinerU / Docling on 1 Book (e.g. `chemistry_bn.pdf`)**
   - Run local extraction to generate cleanly cropped figures and Markdown.
   - Verify that equations are formatted as LaTeX and figures are saved as individual PNGs.
2. **Step 2: Batch Extract All Available Subjects**
   - Physics (BN & EN)
   - Chemistry (BN & EN)
   - Mathematics (BN & EN)
   - Biology (BN & EN)
3. **Step 3: Enrich Cropped Diagrams via Targeted VLM Inference**
   - Send each cropped PNG to Qwen2.5-VL / Llama-3.2-Vision to generate descriptive captions, Bengali callout dictionaries, and 3 high-quality educational questions.
4. **Step 4: Generate Training Splits**
   - `cpt_train.jsonl` (Domain pre-training)
   - `sft_reasoning.jsonl` (Chain-of-thought math/physics)
   - `sft_cq.jsonl` (NCTB 4-tier creative questions)
   - `vlm_multimodal.json` (Figure-grounded visual dialogue)
