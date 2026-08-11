-- ============================================================================
-- Row Level Security. Every policy wraps auth.uid() in a `select` so it's
-- evaluated once per statement instead of once per row (100x+ difference at
-- scale — docs/review §7.10), and every tenant table gets `force row level
-- security` so table owners can't accidentally bypass it in a service role
-- misconfiguration.
-- ============================================================================

alter table public.institutions enable row level security;
alter table public.institutions force row level security;
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.student_profiles enable row level security;
alter table public.student_profiles force row level security;
alter table public.teacher_profiles enable row level security;
alter table public.teacher_profiles force row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.curriculum_versions enable row level security;
alter table public.curriculum_chunks enable row level security;
alter table public.chunk_embeddings enable row level security;
alter table public.rubrics enable row level security;
alter table public.question_papers enable row level security;
alter table public.question_papers force row level security;
alter table public.questions enable row level security;
alter table public.exam_submissions enable row level security;
alter table public.exam_submissions force row level security;
alter table public.submission_pages enable row level security;
alter table public.submission_pages force row level security;
alter table public.grading_results enable row level security;
alter table public.grading_results force row level security;
alter table public.grading_corrections enable row level security;
alter table public.audit_log enable row level security;
alter table public.weakness_logs enable row level security;
alter table public.weakness_logs force row level security;
alter table public.study_plans enable row level security;
alter table public.study_plans force row level security;
alter table public.ingestion_jobs enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: users see and edit their own row
-- ---------------------------------------------------------------------------
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- student_profiles: student owns their profile; institution staff who share
-- an exam relationship can view (needed for B2B cohort analytics)
-- ---------------------------------------------------------------------------
create policy student_profiles_select_own on public.student_profiles
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy student_profiles_update_own on public.student_profiles
  for update to authenticated
  using (user_id = (select auth.uid()));

create policy student_profiles_insert_own on public.student_profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- institutions / teacher_profiles: staff see their own institution only
-- ---------------------------------------------------------------------------
create policy institutions_select_staff on public.institutions
  for select to authenticated
  using ((select private.is_institution_staff(id)));

create policy teacher_profiles_select_same_institution on public.teacher_profiles
  for select to authenticated
  using ((select private.is_institution_staff(institution_id)));

-- ---------------------------------------------------------------------------
-- Curriculum content: readable by any authenticated user (it's the shared
-- grounding corpus, not tenant data). Writes are service-role only (ingestion
-- pipeline), so no insert/update/delete policy is defined for authenticated.
-- ---------------------------------------------------------------------------
create policy subjects_select_all on public.subjects for select to authenticated using (true);
create policy chapters_select_all on public.chapters for select to authenticated using (true);
create policy curriculum_versions_select_all on public.curriculum_versions for select to authenticated using (true);
create policy curriculum_chunks_select_all on public.curriculum_chunks for select to authenticated using (true);
create policy chunk_embeddings_select_all on public.chunk_embeddings for select to authenticated using (true);
create policy rubrics_select_all on public.rubrics for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- question_papers / questions: creator or same-institution staff, or public
-- templates. Public templates (is_public_template) are the B2C mock-exam pool.
-- ---------------------------------------------------------------------------
create policy question_papers_select on public.question_papers
  for select to authenticated
  using (
    is_public_template
    or created_by_user_id = (select auth.uid())
    or (institution_id is not null and (select private.is_institution_staff(institution_id)))
  );

create policy question_papers_insert on public.question_papers
  for insert to authenticated
  with check (
    created_by_user_id = (select auth.uid())
    and (institution_id is null or (select private.is_institution_staff(institution_id)))
  );

create policy questions_select on public.questions
  for select to authenticated
  using (
    exists (
      select 1 from public.question_papers qp
      where qp.id = questions.question_paper_id
        and (
          qp.is_public_template
          or qp.created_by_user_id = (select auth.uid())
          or (qp.institution_id is not null and (select private.is_institution_staff(qp.institution_id)))
        )
    )
  );

-- ---------------------------------------------------------------------------
-- exam_submissions / submission_pages / grading_results: this is the tenant
-- isolation FR-AUTH-03 is actually about — competing coaching centers must
-- never see each other's student data. institution_id is denormalized onto
-- every one of these tables specifically so this policy is a single indexed
-- lookup, not a multi-hop join (docs/review §7.9).
-- ---------------------------------------------------------------------------
create policy exam_submissions_select on public.exam_submissions
  for select to authenticated
  using (
    student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
    or (institution_id is not null and (select private.is_institution_staff(institution_id)))
  );

create policy exam_submissions_insert on public.exam_submissions
  for insert to authenticated
  with check (
    student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
  );

create policy submission_pages_select on public.submission_pages
  for select to authenticated
  using (
    exists (
      select 1 from public.exam_submissions es
      join public.student_profiles sp on sp.id = es.student_id
      where es.id = submission_pages.submission_id
        and (
          sp.user_id = (select auth.uid())
          or (submission_pages.institution_id is not null
              and (select private.is_institution_staff(submission_pages.institution_id)))
        )
    )
  );

create policy grading_results_select on public.grading_results
  for select to authenticated
  using (
    exists (
      select 1 from public.exam_submissions es
      join public.student_profiles sp on sp.id = es.student_id
      where es.id = grading_results.submission_id
        and (
          sp.user_id = (select auth.uid())
          or (grading_results.institution_id is not null
              and (select private.is_institution_staff(grading_results.institution_id)))
        )
    )
  );

-- Teachers may override scores for their own institution's submissions
-- (FR-EVAL-03). This is an UPDATE-via-trigger pattern in the app layer, not
-- a raw UPDATE grant, but the base select policy plus service-role writes
-- from the API cover the read side; the write path goes through a Genkit
-- server action using the service role after an authorization check.
create policy grading_corrections_select on public.grading_corrections
  for select to authenticated
  using (
    exists (
      select 1 from public.grading_results gr
      where gr.id = grading_corrections.grading_result_id
        and gr.institution_id is not null
        and (select private.is_institution_staff(gr.institution_id))
    )
  );

-- ---------------------------------------------------------------------------
-- weakness_logs / study_plans: student-owned only
-- ---------------------------------------------------------------------------
create policy weakness_logs_select_own on public.weakness_logs
  for select to authenticated
  using (
    student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
  );

create policy study_plans_select_own on public.study_plans
  for select to authenticated
  using (
    student_id in (select id from public.student_profiles where user_id = (select auth.uid()))
  );

-- ingestion_jobs: internal/service-role only, no authenticated-role policy
-- (RLS enabled with zero policies for `authenticated` = default-deny).
