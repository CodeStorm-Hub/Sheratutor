-- Migration: Activate pg_cron schedule for the grading queue worker
create extension if not exists pg_net;
create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'process-grading-queue') then
    perform cron.unschedule('process-grading-queue');
  end if;
end $$;

select cron.schedule(
  'process-grading-queue',
  '*/30 * * * * *',
  $$
    select net.http_post(
      url := 'https://sheratutor.vercel.app/api/internal/process-grading-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-worker-secret', 'REDACTED_WORKER_SECRET'
      ),
      body := '{}'::jsonb
    );
  $$
);
