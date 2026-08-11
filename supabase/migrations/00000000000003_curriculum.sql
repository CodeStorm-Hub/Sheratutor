-- ============================================================================
-- Curriculum: subjects, chapters, versioned NCTB content chunks, versioned embeddings
-- ============================================================================

create type public.subject_group as enum ('GENERAL', 'SCIENCE', 'HUMANITIES', 'BUSINESS');
create type public.language_tag as enum ('bn', 'en');

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_bn text not null,
  level public.exam_type not null,
  subject_group public.subject_group not null,
  created_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  chapter_no int not null,
  title_en text not null,
  title_bn text not null,
  weightage_description text,
  created_at timestamptz not null default now(),
  unique (subject_id, chapter_no)
);

create index idx_chapters_subject on public.chapters (subject_id);

-- A book edition/printing of the NCTB curriculum. NCTB revises curricula;
-- without this we can't deprecate superseded content (docs/review §7.1).
create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  edition_year int not null,
  language_tag public.language_tag not null,
  is_active boolean not null default true,
  source_pdf_checksum text,
  notes text,
  created_at timestamptz not null default now(),
  unique (subject_id, edition_year, language_tag)
);

create index idx_curriculum_versions_active
  on public.curriculum_versions (subject_id, language_tag)
  where is_active;

-- The raw, extracted text/LaTeX chunk. Embedding-model-agnostic on purpose —
-- see chunk_embeddings below. This is what lets us re-embed with a new model
-- without an ALTER on the largest table in the system (docs/review §7.2).
create table public.curriculum_chunks (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete cascade,
  content_chunk text not null,
  content_format text not null default 'markdown', -- markdown | latex | json
  official_rubric_rules jsonb,
  source_book_page_ref text,
  diagram_image_urls text[] not null default '{}',
  chunk_index int not null,
  created_at timestamptz not null default now()
);

create index idx_curriculum_chunks_chapter on public.curriculum_chunks (chapter_id);
create index idx_curriculum_chunks_version on public.curriculum_chunks (curriculum_version_id);

-- Embeddings live in their own table, keyed by (chunk, model, model_version).
-- This lets two embedding models run side-by-side during a migration/benchmark
-- (e.g. BGE-M3 vs gemini-embedding-001, see docs/review §7.2) and lets us cut
-- over without touching curriculum_chunks at all.
create table public.chunk_embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id uuid not null references public.curriculum_chunks (id) on delete cascade,
  model_name text not null,
  model_version text not null,
  -- 1024 dims fits BGE-M3 (self-hostable, explicit Bengali coverage) without
  -- truncation; re-validate against whichever model wins the retrieval benchmark.
  embedding extensions.vector(1024) not null,
  created_at timestamptz not null default now(),
  unique (chunk_id, model_name, model_version)
);

-- HNSW, not IVFFlat: robust to changing data, no separate "train" step.
-- Partial index scoped per (model_name, model_version) since a query only
-- ever searches within one embedding generation at a time.
create index idx_chunk_embeddings_hnsw
  on public.chunk_embeddings
  using hnsw (embedding extensions.vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create index idx_chunk_embeddings_model on public.chunk_embeddings (model_name, model_version);

-- Rubrics get their own versioned table (not buried in a jsonb column on
-- embeddings or duplicated onto questions — docs/review §7.4). A rubric can be
-- corrected after grading has already happened against an earlier version;
-- grading_results below cites rubric_version_id so we can prove which version
-- produced which mark.
create table public.rubrics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  version int not null default 1,
  title text not null,
  criteria_json jsonb not null, -- [{step_name, max_step_marks, matching_rules}]
  is_active boolean not null default true,
  superseded_by uuid references public.rubrics (id),
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index idx_rubrics_chapter_active on public.rubrics (chapter_id) where is_active;
