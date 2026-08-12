# Curriculum ingestion

Turns an NCTB textbook PDF into RAG-searchable `curriculum_chunks` +
`chunk_embeddings` rows. See `docs/review/SSC_Phase_Technical_Review.md` §1,
§3, §5.1, §7.2 for the reasoning behind every choice below, and
`local_dev/RAG_TEST_RESULTS.md` for a full end-to-end run against the live
Supabase project.

## Status: proven end-to-end against the live Supabase project

Ran the full pipeline for real — OCR → chunk → embed → store → retrieve —
against Supabase project `SheraTutor` (ap-south-1, ref
`qjottictwewysfcjirma`), not a mock. 7 chunks from `physics_en.pdf` pages
42-47 (Chapter 2, "Motion" — distance/displacement/speed/velocity) are live
in `curriculum_chunks`/`chunk_embeddings`, indexed by the real HNSW index,
and a test query ("What is the difference between speed and velocity?")
returns correctly ranked, genuinely relevant results (top hit: 0.68 cosine
similarity, literally the speed-vs-velocity passage). Full detail and the
query/response pair in `local_dev/RAG_TEST_RESULTS.md`.

**What differs from the originally-planned pipeline, and why:**

| Planned (`ingest.py`) | What actually ran | Why |
|---|---|---|
| marker-pdf (Surya, bundled) | `surya-ocr==0.14.7` directly | Current `surya-ocr` (0.22.1) moved to a llama.cpp-backed VLM architecture requiring an external `llama-server` binary — too heavy for this environment. 0.14.7 is the last version with the classic `DetectionPredictor`/`RecognitionPredictor` two-stage API, which is what marker itself calls under the hood anyway. |
| Ollama VLM for `--use_llm` correction | None — base Surya OCR only | No vision-capable Ollama model was available locally, and none was needed: these are machine-typeset textbook pages, not handwriting, so the transcription-fidelity risk that motivates VLM correction (docs/review §3) doesn't apply here. |
| `gemini-embedding-001` (production default) | `bge-m3` via Ollama, local | No `GOOGLE_GENAI_API_KEY` in this environment. bge-m3 is the other finalist docs/review §7.2 named for benchmarking — using it here isn't a fallback, it's the real comparison point. Produces exactly 1024 dims, matching `chunk_embeddings.embedding`'s column type with no truncation. |
| `execute_sql`/`apply_migration` via Supabase MCP, not `psycopg2` | Same effect, different transport | No direct DB password is exposed by the MCP (by design) — schema and data both went through the MCP's SQL execution tools instead of a local Postgres client. |

Two real migration bugs were caught and fixed by actually running the DDL
against Postgres (not just reading it): `current_date` isn't `IMMUTABLE`, so
`is_minor` couldn't be a `GENERATED ALWAYS AS STORED` column as originally
written; and an ambiguous `id` reference in a two-table join subquery. Both
fixes are in `supabase/migrations/00000000000002_core.sql`.

## Source material

`textbooks/` holds the 8-book vertical-slice scope (Physics, Chemistry,
Mathematics, English — bn+en) — the descoped set from the review, not the
hand-off guide's original 66-book target. PDFs are `.gitignore`d (large
binaries); `textbooks/SOURCE_MANIFEST.tsv` + `download_gdrive.sh` re-fetch
them. `textbooks/CHECKSUMS.sha256` pins what was actually ingested. All 8
were downloaded and verified as valid PDFs; only `physics_en.pdf` pages
42-47 have been OCR'd and loaded so far.

**Licensing note:** these are pulled from a third-party mirror of NCTB's
free, government-published PDFs, adequate for internal RAG-grounding during
the pilot. Before any B2B commercial launch, the NCTB licensing conversation
flagged in the review (§2.2) needs to land — this is a real legal dependency,
not a formality.

## Running it (production path, once `GOOGLE_GENAI_API_KEY` is available)

```bash
pip install -r requirements.txt
cp .env.example .env   # fill in Supabase + Gemini credentials

python ingest.py \
  --pdf textbooks/physics_en.pdf \
  --subject-code SSC-PHY \
  --language en \
  --chapter-no 3   # matches the seeded "Force and Motion" chapter
```

Each run is tracked in the `ingestion_jobs` table (checksum + status +
attempt_count), so a killed or failed run resumes instead of silently
re-processing or silently skipping. Check status with:

```sql
select source_pdf_path, status, chunks_produced, error_detail
from ingestion_jobs order by created_at desc;
```

## Running it (what was actually used here — no API key, no root)

`local_dev/ocr_and_embed.py` — same shape as `ingest.py`, minus the Gemini
dependency: `surya-ocr==0.14.7` for OCR, `bge-m3` via local Ollama for
embeddings, and it writes a `.sql` file of INSERT statements instead of
writing directly (no direct DB credentials available in this environment —
apply the output via the Supabase MCP's `execute_sql`, or `psql`/`supabase db
execute` once you have a connection string). See `local_dev/README.md`.

## Where this runs

- **Vertical slice (one book):** the Google Colab CLI is fine here —
  `colab new --gpu T4`, `colab exec -f ingest.py`. Interactive, fast to
  iterate, and the workload is small enough that Colab's undisclosed
  session/idle limits don't matter.
- **Full 8-book (then 66-book) run:** move off Colab. Colab's own FAQ states
  usage limits are deliberately unpublished and variable, and continuous
  long-running use on the free tier risks account restriction — exactly the
  workload a multi-hour, multi-book ingestion run is. Use a spot GPU box
  (L4/A100 on any cloud) instead; at current pricing the full run costs
  roughly $30-80 one time, not "free" once you count the engineering time
  spent working around Colab's limits.

## Known gaps (next steps, not yet built)

- Only 7 of the ~2,700 total pages across all 8 books are loaded. The
  remaining 5 pre-OCR'd/pre-embedded chunks for this same page range sit in
  `local_dev/insert_chunks.sql`, ready to apply — the rest of each book needs
  a real batch run, not one-page-at-a-time.
- `run_marker()` / `ocr_and_embed.py` process one PDF at a time; add
  `--num_chunks`/`--chunk_idx` sharding for multi-machine parallel ingestion
  once volume justifies it.
- Chapter boundaries are matched by `--chapter-no` supplied on the CLI, not
  detected from the PDF's own table of contents — fine for the single seeded
  chapter, needs real TOC parsing before ingesting a whole book unattended.
- No transcription-fidelity check on ingestion output specifically (that
  guardrail lives in the grading pipeline, `src/ai/schemas/transcription.ts`
  — curriculum ingestion is machine-printed text, not handwriting, so the
  silent-correction risk is much lower here, but garbled OCR on dense
  equation-heavy pages is still worth spot-checking before trusting a chapter).
- Embedding model choice (bge-m3 vs. gemini-embedding-001) hasn't actually
  been benchmarked against each other on a real Bangla retrieval set —
  bge-m3 was used here because it's what was available, not because it won a
  comparison. Do that comparison before committing to one for production.
