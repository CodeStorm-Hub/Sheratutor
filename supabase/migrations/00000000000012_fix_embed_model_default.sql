-- Corrects 00000000000010_provider_pivot.sql: nvidia/llama-3.2-nv-embedqa-1b-v2
-- was chosen from third-party documentation without checking NVIDIA's live
-- /v1/models catalog and returns HTTP 410 (retired 2026-05-18). Verified
-- live 2026-08-13: nvidia/llama-nemotron-embed-1b-v2 is available, 2048-dim
-- native, and truncates to 1024 via the `dimensions` request param — matches
-- web/src/ai/genkit.ts and ingestion/ingest.py.

create or replace function public.match_curriculum_chunks(
  query_embedding extensions.vector(1024),
  p_chapter_id uuid,
  p_language_tag public.language_tag,
  match_count int default 5,
  p_model_name text default 'nvidia/llama-nemotron-embed-1b-v2',
  p_model_version text default 'v2'
)
returns table (
  chunk_id uuid,
  content_chunk text,
  official_rubric_rules jsonb,
  source_book_page_ref text,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    cc.id as chunk_id,
    cc.content_chunk,
    cc.official_rubric_rules,
    cc.source_book_page_ref,
    1 - (ce.embedding <=> query_embedding) as similarity
  from public.curriculum_chunks cc
  join public.chunk_embeddings ce on ce.chunk_id = cc.id
  join public.curriculum_versions cv on cv.id = cc.curriculum_version_id
  where cc.chapter_id = p_chapter_id
    and cv.language_tag = p_language_tag
    and cv.is_active
    and ce.model_name = p_model_name
    and ce.model_version = p_model_version
  order by ce.embedding <=> query_embedding
  limit match_count;
$$;
