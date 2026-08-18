-- Postgres grants EXECUTE to PUBLIC by default on new functions. The
-- previous migration only added the intended grant (enqueue -> authenticated)
-- without revoking the implicit PUBLIC grant on all three, leaving
-- read_grading_jobs/archive_grading_job callable by anon/authenticated via
-- PostgREST RPC — able to drain and archive the grading queue with no auth.
-- Lock all three down to only what's intended: enqueue for authenticated
-- users, read/archive for service_role only (which bypasses grants anyway).
revoke execute on function public.enqueue_grading_job(uuid) from public, anon;
revoke execute on function public.read_grading_jobs(int, int) from public, anon, authenticated;
revoke execute on function public.archive_grading_job(bigint) from public, anon, authenticated;
