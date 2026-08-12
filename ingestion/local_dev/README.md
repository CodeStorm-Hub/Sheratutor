# local_dev — no-root, no-API-key ingestion path

Everything here exists because this environment had no root access (blocks
`apt install postgresql-18-pgvector`) and no `GOOGLE_GENAI_API_KEY`. It's
what was actually used to prove the RAG pipeline works — see
`RAG_TEST_RESULTS.md` for the results.

**As of the Supabase MCP being connected, `db.py`/`schema.sql`/`seed.sql`
(the userspace-Postgres fallback) are superseded** — all real data now lives
in the actual Supabase project, loaded via the MCP's `execute_sql`/
`apply_migration` tools instead. They're kept for reference (e.g. fully
offline dev with no Supabase project at all) but the migrations to use are
`supabase/migrations/*.sql`, not `schema.sql`.

## Files

- `ocr_and_embed.py` — OCR (`surya-ocr==0.14.7`) + embed (`bge-m3` via
  Ollama) a page range, emit `insert_chunks.sql`. This is what actually ran.
- `insert_chunks.sql` / `sql_parts/` — its output: 12 ready-to-apply SQL
  statements (7 already applied to the live project, 5 remaining).
- `ocr_output.json` — raw OCR'd text + embeddings, for inspection without
  re-running anything.
- `db.py` / `schema.sql` / `seed.sql` — the userspace-Postgres fallback
  (double-precision-array cosine similarity instead of pgvector's HNSW),
  used only before the Supabase MCP was connected. See the file header in
  `schema.sql` for why it exists and what changes when moving to real
  pgvector (nothing about the logic — only the column type and index).
- `ingest_local.py` — same idea as `ocr_and_embed.py` but written against
  the userspace-Postgres path (`db.py`) instead of emitting SQL. Superseded
  by `ocr_and_embed.py` once the target became the real Supabase project.

## Applying the remaining 5 chunks

`sql_parts/stmt_08.sql` through `stmt_12.sql` are ready. Apply each via the
Supabase MCP's `execute_sql` (or `psql`/`supabase db execute` against a real
connection string once you have one) — same pattern as the first 7, see
`RAG_TEST_RESULTS.md` for exactly what that looked like.
