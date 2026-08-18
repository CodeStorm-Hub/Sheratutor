-- ============================================================================
-- Provider pivot (2026-08-13): no Google GenAI key available. Retrieval now
-- defaults to NVIDIA NIM's llama-3.2-nv-embedqa-1b-v2 (free, one of the few
-- embedding models with documented Bengali support) instead of
-- gemini-embedding-001. The app (web/src/ai/flows/retrieve-grounding.ts) now
-- always passes p_model_name/p_model_version explicitly, but the SQL
-- defaults are updated too so an ad-hoc `select * from
-- match_curriculum_chunks(...)` without those args does something sensible
-- rather than silently querying for a model that will never have rows again.
-- ============================================================================

create or replace function public.match_curriculum_chunks(
  query_embedding extensions.vector(1024),
  p_chapter_id uuid,
  p_language_tag public.language_tag,
  match_count int default 5,
  p_model_name text default 'nvidia/llama-3.2-nv-embedqa-1b-v2',
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
