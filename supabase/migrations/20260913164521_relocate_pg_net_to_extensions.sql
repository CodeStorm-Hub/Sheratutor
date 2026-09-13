-- Relocate pg_net extension from public to extensions schema
-- Resolves Supabase lint: 0014_extension_in_public
drop extension if exists pg_net;
create extension if not exists pg_net schema extensions;
