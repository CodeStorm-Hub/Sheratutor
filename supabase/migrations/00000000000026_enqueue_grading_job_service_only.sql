-- 00000000000026_enqueue_grading_job_service_only.sql
--
-- Closes Supabase security linter 0029 for `public.enqueue_grading_job`.
--
-- 00000000000025 added an ownership guard so a signed-in caller could only
-- enqueue their own submission, but the linter flags *any* SECURITY DEFINER
-- function reachable by `authenticated` via /rest/v1/rpc. The only caller
-- (api/submissions/route.ts) now invokes it with the service-role client
-- right after creating the submission under the user's own RLS session, so
-- `authenticated` no longer needs EXECUTE at all.
--
-- The auth.uid() guard from migration 25 is kept as defense-in-depth: it is a
-- no-op for service_role (auth.uid() IS NULL) and would still reject a stray
-- authenticated call if the grant were ever re-added.

REVOKE EXECUTE ON FUNCTION public.enqueue_grading_job(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_grading_job(uuid) FROM anon;
