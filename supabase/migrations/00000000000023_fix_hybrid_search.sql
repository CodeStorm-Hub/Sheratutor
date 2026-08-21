-- Migration 0023: Fix Hybrid Search (RRF with Union)
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
      cc.content_chunk,
      cc.chunk_type,
      cc.parent_chunk_id,
      cc.section_no,
      cc.section_title,
      cc.official_rubric_rules,
      cc.source_book_page_ref,
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
  combined_ids as (
    select chunk_id from dense_search
    union
    select chunk_id from sparse_search
  ),
  combined as (
    select
      coalesce(d.chunk_id, s.chunk_id) as chunk_id,
      coalesce(d.content_chunk, s.content_chunk) as content_chunk,
      coalesce(d.chunk_type, s.chunk_type) as chunk_type,
      coalesce(d.parent_chunk_id, s.parent_chunk_id) as parent_chunk_id,
      coalesce(d.section_no, s.section_no) as section_no,
      coalesce(d.section_title, s.section_title) as section_title,
      coalesce(d.official_rubric_rules, s.official_rubric_rules) as official_rubric_rules,
      coalesce(d.source_book_page_ref, s.source_book_page_ref) as source_book_page_ref,
      coalesce(d.similarity, 0.0) as similarity,
      coalesce(1.0 / (60 + d.dense_rank), 0.0) + coalesce(1.0 / (60 + s.sparse_rank), 0.0) as rrf_score
    from combined_ids c
    left join dense_search d on d.chunk_id = c.chunk_id
    left join sparse_search s on s.chunk_id = c.chunk_id
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
