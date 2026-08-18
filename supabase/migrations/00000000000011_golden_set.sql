-- ============================================================================
-- Golden evaluation set (docs/review §8.1, §9.1): the single highest-priority
-- missing artifact from the original plan. Without a small, human-graded
-- reference set, prompt/rubric/model changes can't be measured, and
-- NFR-REL-01 ("AI agrees with human examiners") is unfalsifiable.
--
-- Scope per the review's revised Week-1 sequencing: ~30 real handwritten
-- scripts against ~10 real questions, each script transcribed by a human
-- (ground truth for transcription-fidelity/CER — docs/review §3) and graded
-- blind by 3 examiners (ground truth for score agreement — docs/review §6.1,
-- which replaces the unachievable "r >= 0.95" target with quadratic-weighted
-- kappa against the human-human agreement band). Deliberately independent of
-- curriculum RAG: these questions can be seeded with hand-typed rubrics
-- (existing `rubrics` table) with zero `curriculum_chunks` required, so
-- grading-quality can be measured before a single textbook is ingested.
-- ============================================================================

create table public.golden_set_items (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id),
  -- Free text, not a real script row: golden-set scripts are curated
  -- separately from live student submissions, often before real submissions
  -- exist at all, and must never be traceable back to a real student.
  source_description text not null,
  script_image_url text not null,
  -- Ground truth for transcription-fidelity measurement: what the student
  -- actually wrote, verbatim, transcribed by a human — not what a VLM says
  -- they wrote. This is what `golden_set_model_runs.transcription_cer` is
  -- computed against.
  human_transcription text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_golden_set_items_question on public.golden_set_items (question_id);

-- Blind grading: 3 examiners score independently, without seeing each
-- other's marks or any AI output. Human-human agreement across these rows is
-- the ceiling docs/review §6.1 says to measure before setting an AI-agreement
-- target — not an assumed constant like the original "r >= 0.95".
create table public.golden_set_human_grades (
  id uuid primary key default gen_random_uuid(),
  golden_set_item_id uuid not null references public.golden_set_items (id) on delete cascade,
  -- Deliberately a label, not a profiles FK: examiners grading a golden set
  -- are frequently contractors/volunteers with no product account, and blind
  -- grading is easier to keep genuinely blind without a live user identity
  -- attached to each row.
  examiner_label text not null,
  score_obtained numeric(5, 2) not null,
  max_marks numeric(5, 2) not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (golden_set_item_id, examiner_label)
);

create index idx_golden_set_human_grades_item on public.golden_set_human_grades (golden_set_item_id);

-- One row per (golden-set item, pipeline run). Repeated runs across prompt
-- versions/model swaps accumulate here so quality trend over time is a
-- query, not a spreadsheet someone has to maintain by hand.
create table public.golden_set_model_runs (
  id uuid primary key default gen_random_uuid(),
  golden_set_item_id uuid not null references public.golden_set_items (id) on delete cascade,
  model_transcription text,
  -- Character error rate of model_transcription vs. human_transcription.
  -- docs/review §3: if CER is materially lower on incorrect student answers
  -- than correct ones, the model is silently "fixing" mistakes instead of
  -- transcribing them — computed by the eval harness, not by the DB.
  transcription_cer numeric(6, 4),
  model_score numeric(5, 2),
  max_marks numeric(5, 2),
  rubric_breakdown_json jsonb,
  model_name text not null,
  model_version text not null,
  prompt_version text not null,
  pipeline_version text not null,
  created_at timestamptz not null default now()
);

create index idx_golden_set_model_runs_item on public.golden_set_model_runs (golden_set_item_id);
create index idx_golden_set_model_runs_pipeline on public.golden_set_model_runs (pipeline_version, model_name, model_version);

-- Internal calibration data, not tenant or student data: service-role only,
-- same default-deny pattern as audit_log/ingestion_jobs (RLS enabled, zero
-- policies for `authenticated`).
alter table public.golden_set_items enable row level security;
alter table public.golden_set_human_grades enable row level security;
alter table public.golden_set_model_runs enable row level security;
