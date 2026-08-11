-- ============================================================================
-- Question papers, questions
-- ============================================================================

create type public.paper_type as enum ('MCQ', 'CQ', 'MIXED');
create type public.difficulty as enum ('EASY', 'MEDIUM', 'HARD', 'BOARD_STANDARD');

create table public.question_papers (
  id uuid primary key default gen_random_uuid(),
  -- nullable: system-seeded/AI-generated public templates have no human author.
  created_by_user_id uuid references public.profiles (id),
  -- nullable: a B2C student's personal mock paper has no institution.
  institution_id uuid references public.institutions (id) on delete cascade,
  subject_id uuid not null references public.subjects (id),
  title text not null,
  paper_type public.paper_type not null,
  difficulty public.difficulty not null default 'BOARD_STANDARD',
  total_marks int not null,
  is_public_template boolean not null default false,
  -- Answer-sheet convention: every generated paper gets a printable answer
  -- block with a QR code encoding {paper_id, question layout regions}. This is
  -- what lets OCR route a scanned page to the right question and (for B2B
  -- batch scans) the right student, instead of leaving question/answer
  -- mapping as an unsolved CV problem (docs/review §4).
  answer_sheet_qr_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create index idx_question_papers_institution on public.question_papers (institution_id);
create index idx_question_papers_subject on public.question_papers (subject_id);
create unique index idx_question_papers_qr on public.question_papers (answer_sheet_qr_token);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  question_paper_id uuid not null references public.question_papers (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id),
  rubric_id uuid references public.rubrics (id),
  question_number int not null,
  question_text_bn text,
  question_text_en text,
  max_marks numeric(5, 2) not null,
  -- Printed region on the answer sheet this question's response must occupy,
  -- as normalized page coordinates. Populated at paper-PDF generation time.
  answer_region_json jsonb,
  created_at timestamptz not null default now(),
  unique (question_paper_id, question_number)
);

create index idx_questions_paper on public.questions (question_paper_id);
create index idx_questions_chapter on public.questions (chapter_id);

-- ============================================================================
-- Exam submissions, pages, grading results, corrections
-- ============================================================================

create type public.submission_type as enum ('MOBILE_PHOTO', 'WEB_UPLOAD', 'BATCH_SCAN');
create type public.submission_status as enum (
  'QUEUED', 'OCR_PROCESSING', 'EVALUATING', 'COMPLETED', 'FAILED'
);

create table public.exam_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  question_paper_id uuid not null references public.question_papers (id),
  -- Denormalized for RLS + reporting: every tenant-scoped table carries its
  -- own institution_id rather than requiring a multi-hop join to enforce
  -- isolation (docs/review §7.9 — the FR-AUTH-03 "100% cross-tenant block"
  -- requirement is a single missed join away from a real leak otherwise).
  institution_id uuid references public.institutions (id),
  submission_type public.submission_type not null,
  status public.submission_status not null default 'QUEUED',
  attempt_count int not null default 0,
  error_detail text,
  -- Grading is an async job (docs/review §5.3), never a synchronous request.
  -- The idempotency key lets the enqueue endpoint be called safely on retry
  -- without double-billing inference or double-writing results.
  idempotency_key text not null unique,
  total_score_obtained numeric(6, 2),
  max_possible_score numeric(6, 2),
  submitted_at timestamptz not null default now(),
  evaluated_at timestamptz
);

create index idx_exam_submissions_student on public.exam_submissions (student_id);
create index idx_exam_submissions_institution on public.exam_submissions (institution_id);
create index idx_exam_submissions_status on public.exam_submissions (status) where status not in ('COMPLETED', 'FAILED');

create table public.submission_pages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.exam_submissions (id) on delete cascade,
  institution_id uuid references public.institutions (id),
  page_number int not null,
  original_image_url text not null,
  processed_image_url text,
  ocr_raw_text text,
  ocr_latex_structured text,
  -- Transcription-fidelity guardrail (docs/review §3): VLMs silently "correct"
  -- handwritten errors instead of transcribing verbatim, which is invisible to
  -- score-correlation metrics and inverts the grading promise. We store a
  -- confidence/flag pair so a fidelity check can run independent of grading.
  transcription_confidence numeric(3, 2),
  student_flagged_mismatch boolean not null default false,
  created_at timestamptz not null default now(),
  unique (submission_id, page_number)
);

create index idx_submission_pages_submission on public.submission_pages (submission_id);

create table public.grading_results (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.exam_submissions (id) on delete cascade,
  question_id uuid not null references public.questions (id),
  institution_id uuid references public.institutions (id),
  score_obtained numeric(5, 2) not null,
  max_marks numeric(5, 2) not null,
  rubric_breakdown_json jsonb not null, -- criteria_evaluations array, see FR-EVAL-02
  explanation_summary_bn text,
  explanation_summary_en text,
  human_verified boolean not null default false,
  -- Provenance (docs/review §7.12): without this, after any model swap you
  -- cannot tell which scores came from which model, cannot selectively
  -- re-grade, and cannot answer a school asking why a mark changed.
  model_name text not null,
  model_version text not null,
  prompt_version text not null,
  rubric_version_id uuid references public.rubrics (id),
  pipeline_version text not null,
  -- Cost telemetry (docs/review §8.2) — "free forever" is unfalsifiable
  -- without a per-script cost figure.
  input_tokens int,
  output_tokens int,
  vision_pages int,
  est_cost_usd numeric(10, 6),
  created_at timestamptz not null default now(),
  unique (submission_id, question_id)
);

create index idx_grading_results_submission on public.grading_results (submission_id);
create index idx_grading_results_institution on public.grading_results (institution_id);

-- Teacher override → calibration data. FR-EVAL-03 describes a "calibration
-- queue" that didn't exist anywhere in the original schema; this is arguably
-- the most valuable proprietary dataset in the whole product (expert
-- corrections on real Bangla scripts) and it needs a first-class home
-- (docs/review §7.14).
create table public.grading_corrections (
  id uuid primary key default gen_random_uuid(),
  grading_result_id uuid not null references public.grading_results (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id),
  original_score numeric(5, 2) not null,
  corrected_score numeric(5, 2) not null,
  rubric_step text,
  reason text,
  created_at timestamptz not null default now()
);

create index idx_grading_corrections_result on public.grading_corrections (grading_result_id);

-- Append-only audit log for anything that assigns or changes a mark.
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  detail_json jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_log_entity on public.audit_log (entity_type, entity_id);
