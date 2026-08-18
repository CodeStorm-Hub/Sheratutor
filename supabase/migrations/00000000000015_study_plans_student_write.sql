-- study_plans previously had select-only RLS (it was designed for a future
-- service-role-written AI job). The dashboard's new "generate my study plan"
-- action runs as the authenticated student, not service role, so it needs
-- insert/update rights scoped to their own student_id — same ownership
-- check as the existing select policy.
create policy study_plans_insert_own on public.study_plans
  for insert to authenticated
  with check (student_id in (select id from public.student_profiles where user_id = (select auth.uid())));

create policy study_plans_update_own on public.study_plans
  for update to authenticated
  using (student_id in (select id from public.student_profiles where user_id = (select auth.uid())));
