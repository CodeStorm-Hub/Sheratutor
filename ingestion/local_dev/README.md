# local_dev — no-root, no-API-key ingestion path

Everything here exists because this environment had no root access (blocks
`apt install postgresql-18-pgvector`) and no `GOOGLE_GENAI_API_KEY`. It's
what was actually used to prove the RAG pipeline works — see
`RAG_TEST_RESULTS.md` for the results.

**The userspace-Postgres fallback (`db.py`/`schema.sql`/`seed.sql`/
`ingest_local.py`) has been removed.** Supabase is the only database this
project targets now — all real data lives in the actual Supabase project
(`qjottictwewysfcjirma`), written via the Supabase MCP's `execute_sql`/
`apply_migration` tools or the app's own Supabase clients. The schema to use
is `supabase/migrations/*.sql`.

## Files

- `ocr_and_embed.py` — OCR (`surya-ocr==0.14.7`) + embed (`bge-m3` via
  Ollama) a page range, emit `insert_chunks.sql`. This is what actually ran.
- `insert_chunks.sql` / `sql_parts/` — its output: 12 ready-to-apply SQL
  statements (7 already applied to the live project, 5 remaining).
- `ocr_output.json` — raw OCR'd text + embeddings, for inspection without
  re-running anything.

## Applying the remaining 5 chunks

`sql_parts/stmt_08.sql` through `stmt_12.sql` are ready. Apply each via the
Supabase MCP's `execute_sql` (or `psql`/`supabase db execute` against a real
connection string once you have one) — same pattern as the first 7, see
`RAG_TEST_RESULTS.md` for exactly what that looked like.
