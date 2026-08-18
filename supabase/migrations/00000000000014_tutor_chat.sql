-- ============================================================================
-- AI Tutor Chat persistence. Two modes share one session table:
--   'rubric'  — scoped to one grading_results criterion, opened from the
--               "বুঝিয়ে বলো" panel on a submission's rubric breakdown.
--   'general' — free-form subject Q&A from the standalone /dashboard/tutor
--               page, not tied to a graded submission.
-- context_json freezes the prompt inputs (questionText/studentAnswerChunk/
-- rubricFailureReason for rubric mode, subjectId/chapterId for general mode)
-- at session-creation time so history stays coherent even if the underlying
-- rubric or curriculum content changes later.
-- ============================================================================

create table public.tutor_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  submission_id uuid references public.exam_submissions (id) on delete cascade,
  question_id uuid references public.questions (id) on delete cascade,
  rubric_step_index int,
  mode text not null check (mode in ('rubric', 'general')),
  title text,
  context_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One session per (student, submission, question, rubric step) — reused
-- across sheet re-opens instead of forking a new conversation every time.
create unique index tutor_chat_sessions_rubric_key
  on public.tutor_chat_sessions (student_id, submission_id, question_id, rubric_step_index)
  where mode = 'rubric';

create index idx_tutor_chat_sessions_student_general
  on public.tutor_chat_sessions (student_id, updated_at desc)
  where mode = 'general';

create table public.tutor_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tutor_chat_sessions (id) on delete cascade,
  role text not null check (role in ('student', 'tutor')),
  content text not null,
  safety_category text not null default 'none',
  created_at timestamptz not null default now()
);

create index idx_tutor_chat_messages_session on public.tutor_chat_messages (session_id, created_at);

-- Rate-limit lookup: count today's student-authored messages across all of
-- one student's sessions. Index matches that access pattern directly.
create index idx_tutor_chat_messages_role_created on public.tutor_chat_messages (role, created_at);

alter table public.tutor_chat_sessions enable row level security;
alter table public.tutor_chat_sessions force row level security;
alter table public.tutor_chat_messages enable row level security;
alter table public.tutor_chat_messages force row level security;

create policy tutor_chat_sessions_select_own on public.tutor_chat_sessions
  for select to authenticated
  using (student_id in (select id from public.student_profiles where user_id = (select auth.uid())));

create policy tutor_chat_sessions_insert_own on public.tutor_chat_sessions
  for insert to authenticated
  with check (student_id in (select id from public.student_profiles where user_id = (select auth.uid())));

create policy tutor_chat_sessions_update_own on public.tutor_chat_sessions
  for update to authenticated
  using (student_id in (select id from public.student_profiles where user_id = (select auth.uid())));

create policy tutor_chat_messages_select_own on public.tutor_chat_messages
  for select to authenticated
  using (
    exists (
      select 1 from public.tutor_chat_sessions s
      where s.id = tutor_chat_messages.session_id
        and s.student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
    )
  );

create policy tutor_chat_messages_insert_own on public.tutor_chat_messages
  for insert to authenticated
  with check (
    exists (
      select 1 from public.tutor_chat_sessions s
      where s.id = tutor_chat_messages.session_id
        and s.student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
    )
  );
