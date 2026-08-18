-- Question-paper generator (FR-GEN-01): questions/rubrics previously had no
-- authenticated-role insert policy at all (only select) — writes were
-- ingestion/service-role only. Self-generated practice papers need students
-- to insert their own questions/rubrics, scoped to papers they created.
create policy questions_insert_own_paper on public.questions
  for insert to authenticated
  with check (
    exists (
      select 1 from public.question_papers qp
      where qp.id = questions.question_paper_id
        and qp.created_by_user_id = (select auth.uid())
    )
  );

create policy rubrics_insert_own on public.rubrics
  for insert to authenticated
  with check (created_by = (select auth.uid()));
