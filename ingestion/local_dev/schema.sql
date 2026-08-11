-- ============================================================================
-- Local-dev mirror of the RAG-relevant subset of supabase/migrations/.
--
-- WHY THIS FILE EXISTS: the sandbox has no root access, so pgvector cannot
-- be installed into the system Postgres cluster (postgresql-18-pgvector is
-- in apt but /usr/share/postgresql/18/extension is root-owned). This mirrors
-- the real schema on a userspace Postgres 18 instance, with the embedding
-- column stored as `double precision[]` and cosine similarity computed in
-- SQL instead of via pgvector's HNSW index. Same data model, same
-- (model_name, model_version)-keyed embedding table, same retrieval
-- contract — only the storage/index strategy differs. Swap back to the real
-- supabase/migrations/*.sql (vector(1024) + HNSW) once Supabase is
-- authenticated; nothing about the ingestion or retrieval *logic* changes,
-- only the column type and index.
-- ============================================================================

create extension if not exists pgcrypto;

create type language_tag as enum ('bn', 'en');

create table subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_bn text not null,
  level text not null,
  subject_group text not null
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  chapter_no int not null,
  title_en text not null,
  title_bn text not null,
  unique (subject_id, chapter_no)
);

create table curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  edition_year int not null,
  language_tag language_tag not null,
  is_active boolean not null default true,
  unique (subject_id, edition_year, language_tag)
);

create table curriculum_chunks (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters (id) on delete cascade,
  curriculum_version_id uuid not null references curriculum_versions (id) on delete cascade,
  content_chunk text not null,
  content_format text not null default 'markdown',
  official_rubric_rules jsonb,
  source_book_page_ref text,
  chunk_index int not null,
  created_at timestamptz not null default now()
);

create table chunk_embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id uuid not null references curriculum_chunks (id) on delete cascade,
  model_name text not null,
  model_version text not null,
  dims int not null,
  embedding double precision[] not null,
  created_at timestamptz not null default now(),
  unique (chunk_id, model_name, model_version)
);

create table rubrics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters (id) on delete cascade,
  version int not null default 1,
  title text not null,
  criteria_json jsonb not null,
  is_active boolean not null default true
);

create table question_papers (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id),
  title text not null,
  paper_type text not null,
  total_marks int not null,
  is_public_template boolean not null default true
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  question_paper_id uuid not null references question_papers (id) on delete cascade,
  chapter_id uuid not null references chapters (id),
  rubric_id uuid references rubrics (id),
  question_number int not null,
  question_text_bn text,
  question_text_en text,
  max_marks numeric(5, 2) not null
);

create table ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id),
  curriculum_version_id uuid references curriculum_versions (id),
  source_pdf_path text not null,
  source_pdf_checksum text,
  page_range_start int,
  page_range_end int,
  status text not null default 'PENDING',
  attempt_count int not null default 0,
  error_detail text,
  chunks_produced int not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (source_pdf_checksum, page_range_start, page_range_end)
);

-- Brute-force cosine similarity search, functionally identical contract to
-- supabase/migrations/00000000000007_retrieval_fn.sql's match_curriculum_chunks
-- (same inputs/outputs), just computed without an ANN index. Fine at the
-- <1000-chunk scale of a single-chapter vertical slice; would need pgvector's
-- HNSW (or ivfflat) before this scales to a full 8-book corpus.
create or replace function match_curriculum_chunks(
  query_embedding double precision[],
  p_chapter_id uuid,
  p_language_tag language_tag,
  match_count int default 5,
  p_model_name text default 'bge-m3',
  p_model_version text default 'ollama-latest'
)
returns table (
  chunk_id uuid,
  content_chunk text,
  official_rubric_rules jsonb,
  source_book_page_ref text,
  similarity double precision
)
language plpgsql
stable
as $$
begin
  return query
  select
    cc.id,
    cc.content_chunk,
    cc.official_rubric_rules,
    cc.source_book_page_ref,
    (
      (select sum(a * b) from unnest(ce.embedding) with ordinality as t1(a, i)
                          join unnest(query_embedding) with ordinality as t2(b, j) on i = j)
      /
      (sqrt((select sum(a * a) from unnest(ce.embedding) a)) *
       sqrt((select sum(b * b) from unnest(query_embedding) b)))
    ) as similarity
  from curriculum_chunks cc
  join chunk_embeddings ce on ce.chunk_id = cc.id
  join curriculum_versions cv on cv.id = cc.curriculum_version_id
  where cc.chapter_id = p_chapter_id
    and cv.language_tag = p_language_tag
    and cv.is_active
    and ce.model_name = p_model_name
    and ce.model_version = p_model_version
  order by similarity desc
  limit match_count;
end;
$$;
