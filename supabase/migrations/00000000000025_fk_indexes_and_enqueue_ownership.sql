-- 00000000000025_fk_indexes_and_enqueue_ownership.sql
--
-- Follow-up to 00000000000024. Two advisor findings that survived that pass:
--
-- 1. Five foreign keys still had no covering index (Supabase performance
--    linter 0001). Cheap to add, and they matter once these tables grow:
--    cascade deletes and join filters currently seq-scan the child table.
--
-- 2. `public.enqueue_grading_job` is SECURITY DEFINER and granted to
--    `authenticated` (intentionally — api/submissions/route.ts calls it with
--    the student's own session). But it never checked that the caller owns
--    the submission it enqueues, so any signed-in user could push an
--    arbitrary submission UUID onto the grading queue (Supabase security
--    linter 0029). Add an ownership guard; service_role (auth.uid() IS NULL)
--    still bypasses it so the worker path is unchanged.

-- 1. Covering indexes for the remaining unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_curriculum_version
  ON public.ingestion_jobs (curriculum_version_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_subject
  ON public.ingestion_jobs (subject_id);
CREATE INDEX IF NOT EXISTS idx_question_papers_created_by
  ON public.question_papers (created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_questions_rubric
  ON public.questions (rubric_id);
CREATE INDEX IF NOT EXISTS idx_rubrics_superseded_by
  ON public.rubrics (superseded_by);

-- 2. Ownership guard on the grading-queue enqueue wrapper
CREATE OR REPLACE FUNCTION public.enqueue_grading_job(p_submission_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_msg_id bigint;
BEGIN
  -- A signed-in caller may only enqueue a submission they own. service_role
  -- (auth.uid() IS NULL) skips this check — that is the worker/cron path.
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.exam_submissions s
    JOIN public.student_profiles sp ON sp.id = s.student_id
    WHERE s.id = p_submission_id
      AND sp.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not authorized to enqueue grading for submission %', p_submission_id
      USING ERRCODE = '42501';
  END IF;

  SELECT pgmq.send('grading_queue', jsonb_build_object('submissionId', p_submission_id))
    INTO v_msg_id;
  RETURN v_msg_id;
END;
$$;

-- grant is unchanged from 00000000000018 (kept explicit for clarity)
GRANT EXECUTE ON FUNCTION public.enqueue_grading_job(uuid) TO authenticated;
