-- docs/review §3 mitigation #2/#4 groundwork: TranscriptionSchema.uncertain_spans
-- was already produced by transcribePageFlow but silently dropped instead of
-- persisted. Store it so low-confidence spans can be surfaced to the student.
alter table public.submission_pages
  add column ocr_uncertain_spans jsonb;
