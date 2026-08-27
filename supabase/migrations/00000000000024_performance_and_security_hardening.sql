-- 00000000000024_performance_and_security_hardening.sql

-- 1. Covering indexes for unindexed foreign keys (eliminates lock contention and speeds joins)
CREATE INDEX IF NOT EXISTS idx_exam_submissions_qp ON public.exam_submissions(question_paper_id);
CREATE INDEX IF NOT EXISTS idx_grading_results_qid ON public.grading_results(question_id);
CREATE INDEX IF NOT EXISTS idx_grading_results_rubric ON public.grading_results(rubric_version_id);
CREATE INDEX IF NOT EXISTS idx_tutor_chat_sessions_sub ON public.tutor_chat_sessions(submission_id);
CREATE INDEX IF NOT EXISTS idx_tutor_chat_sessions_q ON public.tutor_chat_sessions(question_id);
CREATE INDEX IF NOT EXISTS idx_weakness_logs_chapter ON public.weakness_logs(chapter_id);
CREATE INDEX IF NOT EXISTS idx_rubrics_created_by ON public.rubrics(created_by);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_grading_corrections_teacher ON public.grading_corrections(teacher_id);
CREATE INDEX IF NOT EXISTS idx_submission_pages_inst ON public.submission_pages(institution_id);

-- 2. Add Mistake Taxonomy & Math Verification columns to grading_results
ALTER TABLE public.grading_results 
  ADD COLUMN IF NOT EXISTS mistake_category varchar(50) DEFAULT 'NONE',
  ADD COLUMN IF NOT EXISTS arithmetic_verified boolean DEFAULT false;

-- 3. Security hardening: Revoke public execution of internal helper functions
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;

-- 4. Explicit RLS policies for service-only tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_log' AND policyname = 'service_role_audit_log_all') THEN
    CREATE POLICY "service_role_audit_log_all" ON public.audit_log TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'golden_set_items' AND policyname = 'service_role_golden_items_all') THEN
    CREATE POLICY "service_role_golden_items_all" ON public.golden_set_items TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'golden_set_human_grades' AND policyname = 'service_role_golden_grades_all') THEN
    CREATE POLICY "service_role_golden_grades_all" ON public.golden_set_human_grades TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'golden_set_model_runs' AND policyname = 'service_role_golden_runs_all') THEN
    CREATE POLICY "service_role_golden_runs_all" ON public.golden_set_model_runs TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ingestion_jobs' AND policyname = 'service_role_ingestion_jobs_all') THEN
    CREATE POLICY "service_role_ingestion_jobs_all" ON public.ingestion_jobs TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
