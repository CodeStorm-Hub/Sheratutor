-- Vector similarity search scoped to (chapter, language, active curriculum
-- version, active embedding model). SECURITY DEFINER + search_path pinned
-- since it reads across curriculum_chunks/chunk_embeddings/curriculum_versions,
-- which authenticated users can already select directly — this just saves a
-- round-trip and keeps the HNSW query plan server-side.
create or replace function public.match_curriculum_chunks(
  query_embedding extensions.vector(1024),
  p_chapter_id uuid,
  p_language_tag public.language_tag,
  match_count int default 5,
  p_model_name text default 'gemini-embedding-001',
  p_model_version text default '001'
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
-- NOT search_path = '' here: the pgvector <=> operator lives in the
-- `extensions` schema (see 00000000000001_extensions.sql), and operator
-- resolution — unlike schema-qualified table references — respects
-- search_path. An empty path resolves relations fine but breaks `<=>`
-- lookup entirely. security invoker (not definer) makes the usual
-- search_path-hijack privilege-escalation risk moot here anyway.
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

grant execute on function public.match_curriculum_chunks(extensions.vector, uuid, public.language_tag, int, text, text)
  to authenticated, service_role;
