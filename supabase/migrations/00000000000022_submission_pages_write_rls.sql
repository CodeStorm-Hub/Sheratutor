-- submission_pages had select-only RLS for `authenticated` — no insert or
-- update policy existed at all, meaning both the upload route's page insert
-- and the new "this isn't what I wrote" flag update would silently fail
-- under force RLS. Scoped to the owning student, same join pattern as the
-- existing submission_pages_select policy.
create policy submission_pages_insert_own on public.submission_pages
  for insert to authenticated
  with check (
    exists (
      select 1 from public.exam_submissions es
      join public.student_profiles sp on sp.id = es.student_id
      where es.id = submission_pages.submission_id
        and sp.user_id = (select auth.uid())
    )
  );

create policy submission_pages_update_own on public.submission_pages
  for update to authenticated
  using (
    exists (
      select 1 from public.exam_submissions es
      join public.student_profiles sp on sp.id = es.student_id
      where es.id = submission_pages.submission_id
        and sp.user_id = (select auth.uid())
    )
  );
