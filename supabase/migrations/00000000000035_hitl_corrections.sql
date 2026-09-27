-- ============================================================================
-- HITL (Human-in-the-Loop) Corrections Queue for Ambiguous NCTB Evaluations
-- ============================================================================

create table if not exists public.hitl_corrections (
  id uuid primary key default gen_random_uuid(),
  question_id text,
  question_type text not null,
  question_topic_id text not null,
  student_answer text not null,
  stem_context text,
  textbook_context text,
  llm_output jsonb not null,
  score numeric(5, 2),
  ambiguity_reason text not null,
  status text not null default 'PENDING_REVIEW', -- PENDING_REVIEW, RESOLVED, DISCARDED
  reviewer_id uuid references public.profiles (id),
  human_score numeric(5, 2),
  human_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hitl_corrections_status on public.hitl_corrections (status);
create index if not exists idx_hitl_corrections_topic on public.hitl_corrections (question_topic_id);
create index if not exists idx_hitl_corrections_created on public.hitl_corrections (created_at desc);

alter table public.hitl_corrections enable row level security;

-- Service role has full access; authenticated staff/teachers can select and update
create policy "hitl_corrections_service_all" on public.hitl_corrections
  for all to service_role using (true) with check (true);

create policy "hitl_corrections_authenticated_select" on public.hitl_corrections
  for select to authenticated using (true);
