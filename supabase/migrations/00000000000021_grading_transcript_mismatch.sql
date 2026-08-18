-- docs/review §3 mitigation #3 (scoped): evaluateRubricFlow's optional
-- image-grounded cross-check produces transcript_mismatch_detected/_note.
-- Stored as its own columns rather than folded into rubric_breakdown_json
-- so the existing array-of-criteria shape there stays unchanged.
alter table public.grading_results
  add column transcript_mismatch_detected boolean not null default false,
  add column transcript_mismatch_note text;
