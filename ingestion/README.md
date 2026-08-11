# Curriculum ingestion

Turns an NCTB textbook PDF into RAG-searchable `curriculum_chunks` +
`chunk_embeddings` rows. See `docs/review/SSC_Phase_Technical_Review.md` §1,
§3, §5.1, §7.2 for the reasoning behind every choice below.

## Source material

`textbooks/` holds the 8-book vertical-slice scope (Physics, Chemistry,
Mathematics, English — bn+en) — the descoped set from the review, not the
hand-off guide's original 66-book target. PDFs are `.gitignore`d (large
binaries); `textbooks/SOURCE_MANIFEST.tsv` + `download_gdrive.sh` re-fetch
them. `textbooks/CHECKSUMS.sha256` pins what was actually ingested.

**Licensing note:** these are pulled from a third-party mirror of NCTB's
free, government-published PDFs, adequate for internal RAG-grounding during
the pilot. Before any B2B commercial launch, the NCTB licensing conversation
flagged in the review (§2.2) needs to land — this is a real legal dependency,
not a formality.

## Running it

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

- `run_marker()` shells out per-PDF; add `--num_chunks`/`--chunk_idx`
  sharding for multi-machine parallel ingestion once volume justifies it.
- Chapter boundaries are matched by `--chapter-no` supplied on the CLI, not
  detected from the PDF's own table of contents — fine for the single seeded
  chapter, needs real TOC parsing before ingesting a whole book unattended.
- No transcription-fidelity check on ingestion output specifically (that
  guardrail lives in the grading pipeline, `src/ai/schemas/transcription.ts`
  — curriculum ingestion is machine-printed text, not handwriting, so the
  silent-correction risk is much lower here, but garbled OCR on dense
  equation-heavy pages is still worth spot-checking before trusting a chapter).
