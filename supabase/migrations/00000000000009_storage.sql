-- Private bucket for uploaded script images. Never public — these are
-- photographs of minors' handwriting and academic work (PDPA-sensitive,
-- docs/review §2.1); access goes through signed URLs generated server-side
-- after an RLS-equivalent authorization check, not a public bucket URL.
insert into storage.buckets (id, name, public)
values ('submission-pages', 'submission-pages', false)
on conflict (id) do nothing;

-- Path convention: {student_id}/{submission_id}/{page_number}.{ext}
-- A student may only write into their own prefix.
create policy submission_pages_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'submission-pages'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy submission_pages_storage_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'submission-pages'
    and (
      (select auth.uid())::text = (storage.foldername(name))[1]
      or (select private.current_role()) in ('TEACHER', 'INST_ADMIN', 'GOVT_ADMIN')
    )
  );
