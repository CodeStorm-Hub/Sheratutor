-- Migration 029: Waitlist double opt-in schema update & domain cutover for pg_cron

-- 1. Make phone optional and drop its unique constraint
alter table public.waitlist_signups alter column phone drop not null;
alter table public.waitlist_signups drop constraint if exists waitlist_signups_phone_key;

-- 2. Backfill any existing null-email rows before adding not null & unique constraints
update public.waitlist_signups
set email = 'migrated_' || replace(id::text, '-', '') || '@sheratutor.tech'
where email is null or email = '';

alter table public.waitlist_signups alter column email set not null;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'waitlist_signups_email_key'
  ) then
    alter table public.waitlist_signups add constraint waitlist_signups_email_key unique (email);
  end if;
end $$;

-- 3. Add double opt-in verification columns
alter table public.waitlist_signups
  add column if not exists email_verified boolean not null default false,
  add column if not exists verify_token uuid not null default gen_random_uuid(),
  add column if not exists verified_at timestamptz;

-- 4. Create indexes for performance
create index if not exists idx_waitlist_signups_verify_token on public.waitlist_signups (verify_token);
create index if not exists idx_waitlist_signups_email on public.waitlist_signups (email);

-- 5. Create secure function to verify token
create or replace function public.verify_waitlist_token(p_token uuid)
returns jsonb
language plpgsql
security definer
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

-- Grant execution of verify function to anon & authenticated
grant execute on function public.verify_waitlist_token(uuid) to anon, authenticated, service_role;

-- 6. Reschedule pg_cron grading worker to sheratutor.tech
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
      url := 'https://sheratutor.tech/api/internal/process-grading-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-worker-secret', coalesce(
          (select decrypted_secret from vault.decrypted_secrets where name = 'internal_worker_secret' limit 1),
          '16715429445cfb805329db5d2377fe116895b1e17deffdfd'
        )
      ),
      body := '{}'::jsonb
    );
  $$
);
