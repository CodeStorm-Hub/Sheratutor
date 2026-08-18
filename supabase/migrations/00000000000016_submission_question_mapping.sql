-- Question-region mapping (docs/review §4, B2C option: student declares which
-- question a page answers at upload time). Nullable so legacy/undeclared
-- submissions keep grading every question against every page, unchanged.
alter table public.submission_pages
  add column question_id uuid references public.questions (id);

create index idx_submission_pages_question on public.submission_pages (question_id);
