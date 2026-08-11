-- ============================================================================
-- Weakness tracking, study plans
-- ============================================================================

create table public.weakness_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id),
  weakness_score numeric(3, 2) not null default 0 check (weakness_score between 0 and 1),
  total_questions_attempted int not null default 0,
  total_marks_lost numeric(6, 2) not null default 0,
  last_updated timestamptz not null default now(),
  -- The original ERD modeled this as a log by name but a state table by
  -- description, with no uniqueness constraint — duplicate rows and a
  -- non-deterministic dashboard. One row per (student, chapter); upsert on
  -- every new grading result (docs/review §7.6).
  unique (student_id, chapter_id)
);

create index idx_weakness_logs_student on public.weakness_logs (student_id);
create index idx_weakness_logs_score on public.weakness_logs (student_id, weakness_score desc);

create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  daily_schedule_json jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_study_plans_student_active on public.study_plans (student_id) where is_active;

-- ============================================================================
-- Curriculum ingestion jobs — replaces "run it in a Colab notebook and hope"
-- with a resumable, auditable job table (docs/review §5.1). Colab session
-- limits are undisclosed/variable and continuous long-running use risks
-- account restriction, so the 8-book (then 66-book) ingestion run belongs on
-- real batch infra, tracked here, not left to notebook state.
-- ============================================================================

create type public.ingestion_status as enum ('PENDING', 'RUNNING', 'DONE', 'FAILED', 'SKIPPED');

create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id),
  curriculum_version_id uuid references public.curriculum_versions (id),
  source_pdf_path text not null,
  source_pdf_checksum text,
  page_range_start int,
  page_range_end int,
  status public.ingestion_status not null default 'PENDING',
  attempt_count int not null default 0,
  error_detail text,
  chunks_produced int not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_ingestion_jobs_status on public.ingestion_jobs (status) where status in ('PENDING', 'FAILED');
create unique index idx_ingestion_jobs_dedupe on public.ingestion_jobs (source_pdf_checksum, page_range_start, page_range_end)
  where source_pdf_checksum is not null;
