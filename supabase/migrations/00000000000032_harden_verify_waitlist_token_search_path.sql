-- Pin verify_waitlist_token's search_path (Supabase linter 0011).
-- It stays SECURITY DEFINER + anon-executable BY DESIGN: an unauthenticated
-- visitor clicking the emailed verification link calls this through the anon
-- role to flip email_verified on a row it otherwise cannot write. The
-- function only matches on an unguessable uuid token and only sets the
-- verified flag, so the surface is intentionally narrow — the concrete
-- hardening the linter wants here is a fixed search_path.

create or replace function public.verify_waitlist_token(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_already_verified boolean;
begin
  select id, email_verified into v_id, v_already_verified
  from public.waitlist_signups
  where verify_token = p_token;

  if v_id is null then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  if v_already_verified then
    return jsonb_build_object('success', true, 'reason', 'already_verified');
  end if;

  update public.waitlist_signups
  set email_verified = true, verified_at = now()
  where id = v_id;

  return jsonb_build_object('success', true, 'reason', 'verified_now');
end;
$$;

revoke all on function public.verify_waitlist_token(uuid) from public;
grant execute on function public.verify_waitlist_token(uuid) to anon, authenticated, service_role;
