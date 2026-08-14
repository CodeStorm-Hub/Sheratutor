-- ============================================================================
-- Migration 0013: Curriculum Enrichment & Hybrid Search
-- ============================================================================

-- 1. Add chunk classification, parent linking for CQs, and section metadata
alter table public.curriculum_chunks
  add column if not exists chunk_type text not null default 'theory'
    check (chunk_type in ('theory', 'worked_example', 'cq_stimulus', 'cq_subquestion', 'table')),
  add column if not exists parent_chunk_id uuid references public.curriculum_chunks (id) on delete set null,
  add column if not exists section_no text,
  add column if not exists section_title text,
  add column if not exists fts_doc tsvector generated always as (to_tsvector('simple', content_chunk)) stored;

-- 2. Indexes for hierarchy and fast FTS
create index if not exists idx_curriculum_chunks_parent
  on public.curriculum_chunks (parent_chunk_id)
  where parent_chunk_id is not null;

create index if not exists idx_curriculum_chunks_type
  on public.curriculum_chunks (chunk_type);

create index if not exists idx_curriculum_chunks_fts
  on public.curriculum_chunks using gin (fts_doc);

-- 3. Update match_curriculum_chunks for Hybrid Retrieval + Metadata
create or replace function public.match_curriculum_chunks(
  query_embedding extensions.vector(1024),
  p_chapter_id uuid,
  p_language_tag public.language_tag,
  match_count int default 5,
  p_model_name text default 'bge-m3',
  p_model_version text default 'v1',
  query_text text default null
)
returns table (
  chunk_id uuid,
  content_chunk text,
  chunk_type text,
  parent_chunk_id uuid,
  section_no text,
  section_title text,
  official_rubric_rules jsonb,
  source_book_page_ref text,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with dense_search as (
    select
      cc.id as chunk_id,
      cc.content_chunk,
      cc.chunk_type,
      cc.parent_chunk_id,
      cc.section_no,
      cc.section_title,
      cc.official_rubric_rules,
      cc.source_book_page_ref,
      1 - (ce.embedding <=> query_embedding) as similarity,
      row_number() over (order by ce.embedding <=> query_embedding) as dense_rank
    from public.curriculum_chunks cc
    join public.chunk_embeddings ce on ce.chunk_id = cc.id
    join public.curriculum_versions cv on cv.id = cc.curriculum_version_id
    where cc.chapter_id = p_chapter_id
      and cv.language_tag = p_language_tag
      and cv.is_active
      and ce.model_name = p_model_name
      and ce.model_version = p_model_version
    limit (match_count * 2)
  ),
  sparse_search as (
    select
      cc.id as chunk_id,
      row_number() over (order by ts_rank_cd(cc.fts_doc, plainto_tsquery('simple', coalesce(query_text, ''))) desc) as sparse_rank
    from public.curriculum_chunks cc
    join public.curriculum_versions cv on cv.id = cc.curriculum_version_id
    where cc.chapter_id = p_chapter_id
      and cv.language_tag = p_language_tag
      and cv.is_active
      and query_text is not null
      and cc.fts_doc @@ plainto_tsquery('simple', query_text)
    limit (match_count * 2)
  ),
  combined as (
    select
      d.chunk_id,
      d.content_chunk,
      d.chunk_type,
      d.parent_chunk_id,
      d.section_no,
      d.section_title,
      d.official_rubric_rules,
      d.source_book_page_ref,
      d.similarity,
      -- Reciprocal Rank Fusion (k=60)
      (1.0 / (60 + d.dense_rank)) + coalesce(1.0 / (60 + s.sparse_rank), 0.0) as rrf_score
    from dense_search d
    left join sparse_search s on s.chunk_id = d.chunk_id
  )
  select
    chunk_id,
    content_chunk,
    chunk_type,
    parent_chunk_id,
    section_no,
    section_title,
    official_rubric_rules,
    source_book_page_ref,
    similarity
  from combined
  order by rrf_score desc
  limit match_count;
$$;

grant execute on function public.match_curriculum_chunks(extensions.vector, uuid, public.language_tag, int, text, text, text)
  to authenticated, service_role;
