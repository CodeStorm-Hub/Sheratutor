-- Extensions
create extension if not exists pgcrypto with schema extensions;
create extension if not exists vector with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- Private schema for security-definer helpers (never exposed via PostgREST —
-- it isn't in the API's exposed-schema list, so client .rpc() can never reach
-- it regardless of grants below).
create schema if not exists private;
revoke all on schema private from public, anon;
-- `authenticated` needs USAGE (in addition to each function's own EXECUTE
-- grant, set per-function in 00000000000002_core.sql) because RLS policies
-- evaluate as the calling role, and calling a schema-qualified function
-- requires USAGE on its schema even when EXECUTE is granted on the function
-- itself — a missing USAGE grant here would make every policy that calls a
-- private.* helper fail with "permission denied for schema private".
grant usage on schema private to authenticated;
