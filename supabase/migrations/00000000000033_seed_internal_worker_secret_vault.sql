-- Seed a strong random worker secret into Supabase Vault, generated inside
-- the database so the value never appears in a migration or a client call.
-- The pg_cron grading job (migration 034) reads ONLY this — the previous
-- cron definition carried a literal fallback secret in cron.job.command,
-- readable by anyone with cron-schema access.
--
-- AFTER this deploys, set the Vercel env var INTERNAL_WORKER_SECRET to the
-- same value so POST /api/internal/process-grading-queue authenticates:
--   select decrypted_secret from vault.decrypted_secrets
--   where name = 'internal_worker_secret';
-- To rotate later: vault.update_secret(...) here + update the Vercel env together.

do $$
declare v_new text;
begin
  if not exists (select 1 from vault.secrets where name = 'internal_worker_secret') then
    v_new := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
    perform vault.create_secret(
      v_new,
      'internal_worker_secret',
      'x-worker-secret for POST /api/internal/process-grading-queue. Must equal Vercel env INTERNAL_WORKER_SECRET; rotate both together.'
    );
  end if;
end $$;
