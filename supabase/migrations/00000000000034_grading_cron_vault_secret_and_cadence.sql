-- Reschedule the grading-queue worker cron.
--
--   1. Secret: read ONLY from Vault (seeded in migration 033). The previous
--      definition (migrations 027 / 030) carried a literal fallback secret
--      right in cron.job.command. Now, if the Vault lookup is null the header
--      is simply absent and the worker route 401s (fail-closed) instead of
--      authenticating with a hard-coded string.
--
--   2. Cadence: '*/30 * * * * *' (6-field, intended "every 30s") was actually
--      firing ~every 30 MINUTES on this instance (cron.job_run_details showed
--      293 runs across 6 days). A plain 5-field '* * * * *' is parsed
--      reliably, so a submitted answer sheet is picked up within ~60s.
--
-- NOTE: this migration touches pg_net + an external URL + the worker secret,
-- so an automated apply may be refused. Apply it with `supabase db push` or
-- from the SQL editor.

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
  '* * * * *',
  $CRON$
    select net.http_post(
      url := 'https://sheratutor.tech/api/internal/process-grading-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-worker-secret', (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'internal_worker_secret' limit 1
        )
      ),
      body := '{}'::jsonb
    );
  $CRON$
);
