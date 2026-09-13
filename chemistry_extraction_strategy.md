# Chemistry BN/EN — Extraction Strategy for the Embedding Vector Database

Based on a complete page-by-page visual review of both `chemistry_bn.pdf` and `chemistry_en.pdf` (620 pages total — every page read directly with vision, zero OCR, zero Gemini API calls, rendered locally with pymupdf) plus a direct inspection of the live Supabase `curriculum_chunks`/`chunk_embeddings` tables and the ingestion/retrieval code.

## What the visual review established

- Both books: 310 pages, no text layer, machine-typeset (Adobe Illustrator), scanned as image-only PDFs.
- **+5 page offset** (PDF page = printed page + 5) confirmed exact across all 12 chapters, both languages.
- BN and EN are page-for-page 1:1 parallel translations — same chapter boundaries, same page breaks, same figure positions.
- Consistent per-chapter template: cover photo → learning-objective box → numbered sections with figures/tables → recurring callout boxes (**Individual Task, Experiment, Do It Yourself, MCQ, Creative Question**) → end-of-chapter exercises.
- Recurring noise on nearly every page: rotated year mark in the margin (২০২৪/২০২৫), "Forma-NN, Chemistry Class-9-10" printer's signature, running header (subject + page number) — all in fixed page positions.
- **11 genuine source-textbook defects** found (not ingestion artifacts): duplicate/mislabeled figure numbers (Ch.2, Ch.5, Ch.10), a BN/EN factual mismatch (94 vs 98 elements, Ch.3), an EN-only physics typo (Ch.3), a genuine number gap in the figure sequence (Ch.4 skips 4.03/4.04), a stale in-text figure cross-reference (Ch.5), a bond-energy value error present in both languages (Ch.8), and a translation error, methanol vs methanal (Ch.11). All confirmed by direct page inspection, cross-checked against sub-agent claims (two of which — a "missing pages" and a "duplicate pages" report — turned out to be false positives on manual verification).
- **OCR/vision-difficulty ranking**: Ch.1/2/9/12 easy (prose-dominated); Ch.3/4/7/10 medium; **Ch.5, 6, 8, 11 require a real vision model** — electron-dot atomic diagrams (Ch.5), stacked-fraction molarity math (Ch.6), labeled electrochemistry apparatus (Ch.8), and skeletal structural formulas for benzene/naphthalene (Ch.11) have no text-OCR-recoverable representation at all.

## What the DB/code review established

- **Chemistry BN is the one clean reference run**: 304 chunks = 304 real content pages, single embedding model (`gemini-embedding-2`), sampled text matches the source exactly.
- **Chemistry EN is provably bad**: 922 chunks but 2,718 embeddings across 3 different embedding models (`bge-m3`, `gemini-embedding-2`, `nvidia/llama-nemotron-embed-vl-1b-v2`) stacked from separate pipeline runs that never cleaned up after each other. Worse, sampled content contains a **hallucinated caption loop** — a chunk lists "Fig 9.6/9.7/9.8" then repeats the same three captions as "Fig 9.9" through "Fig 9.13," when the real chapter only has Figs 9.01–9.04.
- Root cause: every embed script (`ingest.py`, `nim_batch_ingest.py`, `generate_and_store_gemini_embeddings.py`) does a bare `INSERT` with no cleanup of a prior model's rows; only `local_dev/embed_and_store.py` has a real upsert, and even that only dedupes same-model reruns.
- **Retrieval is currently safe** despite the mess: both `match_curriculum_chunks` and `match_curriculum_chunks_global` filter `WHERE model_name = ... AND model_version = ...` before the vector similarity ordering, and the caller always passes `gemini-embedding-2`/`v1` — so today's answers aren't scored against incompatible vectors. The stale rows are dead weight, not active corruption (except for Chemistry EN's actual bad content, which is a separate, real problem).

## What the image/figure pipeline review established

- Figures are extracted by a **separate, disconnected crop tool** — it scans each rendered page for any visually distinct image region and saves it as `p{page}_fig_{n}.png`, independent of the text-extraction pass. For Chemistry this produced 407 raw crops across both languages, uploaded to the `curriculum-assets` Supabase bucket and linked via `curriculum_chunks.diagram_image_urls`.
- **This crop tool badly over-triggers**: verified by direct inspection, Chemistry BN Ch.1 alone has raw crops that are a genuine figure (`p009_fig_01.png`, Fig 1.01), a **plain paragraph of body text with zero image content** (`p009_fig_02.png`), and **broken mid-cell table fragments** (`p010_fig_01/02.png`). Full-page decorative covers (front/back matter) are also captured as "figures."
- **Good news: this was already fixed, for one book.** A hand-verified subset (`figures_verified/`, 171 of 215 raw Chemistry-BN crops) correctly excludes exactly this class of garbage while correctly keeping legitimate multi-crop cases (e.g., 8 separate GHS hazard-pictogram icons spread across pp.18–20). This verified set — not the raw one — is what's actually wired into the live, clean Chemistry-BN DB rows via `ingest_verified_chemistry_supabase.py`.
- **The gap**: this verification pass exists only for Chemistry BN. Chemistry EN and both Physics editions are still linked to the raw, uncurated crop set, meaning their `diagram_image_urls` almost certainly carry the same class of garbage on top of Chemistry EN's already-confirmed bad text.

## Recommended extraction strategy

### 1. Method
Vision-model page reads, not OCR, for both languages — this is the only approach validated end-to-end (Chemistry BN) and the only one that can capture Ch.5/6/8/11-style diagrams at all. Reuse the exact process from this review: render each page to PNG (150dpi via pymupdf is legible), read directly with a vision-capable model, no OCR/text-extraction fallback step for pages containing diagrams.

### 2. Per-page structured output
Extract each page into a schema populating the existing `curriculum_chunks.chunk_type` values properly instead of defaulting everything to `theory`:
- `theory` — prose sections
- `worked_example` — the numbered `Example`/`উদাহরণ` boxes
- `cq_stimulus` / `cq_subquestion` — Creative Question stems and parts
- `table` — numbered tables, kept as structured rows not flattened prose
- New/expanded handling needed for **callout boxes** (Individual Task, Experiment, Do It Yourself) as their own tagged type, since they're pedagogically distinct and consistently marked with icons/headers in the source.

### 3. Known-quirks handling (don't build logic that assumes a clean source)
- Hardcode the +5 offset per book; verify it independently for Physics/Math rather than assuming it transfers.
- Link diagrams to chunks by **page position + reading order**, never by parsed figure number — the source has real numbering gaps and cross-edition mismatches (items above) that would break any numbering-based join.
- Crop/mask the fixed-position noise regions (year mark corner, printer's signature, running header) before the page reaches the vision model, rather than regex-stripping OCR text afterward.

### 4. Images/figures/diagrams — tie crop to caption in the same pass
Replace the two-stage process (blind crop tool → separate manual audit, which is what Chemistry BN needed) with a single tied step: **when the vision model reads a page and transcribes a চিত্র/Fig caption, have it return the crop region for that specific figure in the same call.** This produces correct captions and correct crops from one source of truth instead of a naive object-detector needing a human pass to remove paragraph/table-fragment garbage afterward.
- Never link full-page decorative covers (front/back matter) as `diagram_image_urls` on content chunks.
- Extend the Chemistry-BN verified-crop treatment to Chemistry EN and both Physics editions — via this tied method, not by repeating the manual audit.
- The `curriculum-assets` bucket already holds both raw and verified crops at predictable paths, so this is a targeted regenerate-and-relink job per book, not a full re-upload.

### 5. Errata layer, not silent correction
Keep ingested text faithful to what's printed per language (don't harmonize BN's "94 elements" to match EN's "98," don't silently fix Ch.8's bond-energy typo in the chunk itself). Maintain a small `(book, chapter, page) → correction` override table that the tutor-answer layer consults at query time for the ~4 factual errors that could actively mislead a student (Ch.3 element count, Ch.3 n=1 typo, Ch.8 bond energy, Ch.11 methanol/methanal).

### 6. Pipeline hygiene, to stop the stacking bug from recurring
- Standardize on **one embedding model** going forward (`gemini-embedding-2`, matching the proven-clean Chemistry BN run). Retire the multi-model benchmarking pattern in production tables — do that in a scratch table if still needed.
- Before any re-ingestion run: **delete or supersede** existing `curriculum_chunks`/`chunk_embeddings` rows for that (subject, language, edition) rather than appending. Promote `local_dev/embed_and_store.py`'s `ON CONFLICT ... DO UPDATE` pattern everywhere, plus an explicit cleanup of any other model's leftover rows.
- Add a lightweight automated acceptance check before any new extraction goes live: chunk-count vs. expected-page-count parity (Chemistry BN's 304/304 is the bar), and a repeated-caption/n-gram check to catch hallucination loops like the one found in Chemistry EN — this specific failure mode would have been caught automatically rather than requiring a manual spot-check.

### 7. Priority order
1. **Chemistry EN, Physics BN, Physics EN** — re-ingest now; confirmed bad content and/or stacked embedding models.
2. **Mathematics, English** — first-time ingestion, same method from day one, no legacy cleanup needed.
3. **Chemistry BN** — leave untouched; use as the golden reference to validate every pipeline change against before trusting a re-ingest of anything else.
