-- Real job queue (docs/review §5.3): api/submissions/route.ts's after()
-- dispatch was an explicit stopgap for pgmq, "so a crashed request can't
-- silently drop a submission stuck in QUEUED." This installs pgmq and three
-- SECURITY DEFINER wrapper functions in `public` (already PostgREST-exposed)
-- rather than relying on the pgmq_public schema-exposure toggle, which is a
-- project API-settings change outside what migrations can automate.
create extension if not exists pgmq;

select pgmq.create('grading_queue');

create or replace function public.enqueue_grading_job(p_submission_id uuid)
returns bigint
language sql
security definer
set search_path = public
as $$
  select pgmq.send('grading_queue', jsonb_build_object('submissionId', p_submission_id));
$$;

grant execute on function public.enqueue_grading_job(uuid) to authenticated;

create or replace function public.read_grading_jobs(p_qty int, p_vt int)
returns setof pgmq.message_record
language sql
security definer
set search_path = public
as $$
  select * from pgmq.read('grading_queue', p_vt, p_qty);
$$;

create or replace function public.archive_grading_job(p_msg_id bigint)
returns boolean
language sql
security definer
set search_path = public
as $$
  select pgmq.archive('grading_queue', p_msg_id);
$$;

-- read_grading_jobs/archive_grading_job intentionally have no grant to
-- authenticated/anon — only service_role (which bypasses grants entirely)
-- can call them, so only the server-side worker route can drain the queue.

-- Production cron activation (not applied here — needs the deployed app's
-- real URL, which Supabase's hosted pg_cron/pg_net cannot reach on
-- localhost during development):
--
-- create extension if not exists pg_cron;
-- select cron.schedule(
--   'process-grading-queue',
--   '*/15 * * * * *', -- every 15s (pg_cron 1.4+ six-field syntax)
--   $$
--     select net.http_post(
--       url := 'https://<production-domain>/api/internal/process-grading-queue',
--       headers := jsonb_build_object('x-worker-secret', '<INTERNAL_WORKER_SECRET value>'),
--       body := '{}'::jsonb
--     );
--   $$
-- );
