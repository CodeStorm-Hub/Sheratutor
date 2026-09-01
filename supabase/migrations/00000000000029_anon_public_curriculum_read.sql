-- ============================================================================
-- Migration 0029: Allow anon role to read public curriculum and public templates
-- ============================================================================

drop policy if exists subjects_select_anon on public.subjects;
create policy subjects_select_anon on public.subjects for select to anon using (true);

drop policy if exists chapters_select_anon on public.chapters;
create policy chapters_select_anon on public.chapters for select to anon using (true);

drop policy if exists curriculum_versions_select_anon on public.curriculum_versions;
create policy curriculum_versions_select_anon on public.curriculum_versions for select to anon using (true);

drop policy if exists curriculum_chunks_select_anon on public.curriculum_chunks;
create policy curriculum_chunks_select_anon on public.curriculum_chunks for select to anon using (true);

drop policy if exists question_papers_select_anon on public.question_papers;
create policy question_papers_select_anon on public.question_papers for select to anon using (is_public_template = true);

drop policy if exists questions_select_anon on public.questions;
create policy questions_select_anon on public.questions for select to anon using (
  exists (
    select 1 from public.question_papers qp
    where qp.id = questions.question_paper_id
      and qp.is_public_template = true
  )
);
