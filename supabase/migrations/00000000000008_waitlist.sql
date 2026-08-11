-- Phase 1 deliverable per the roadmap: a waitlist landing page, launched
-- before the product exists. It already collects minors' contact data
-- (docs/review §2.1 — "put a consent notice on the landing page now"), so
-- it gets the same PDPA-aware consent fields as student_profiles, not an
-- afterthought bolted on later.
create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  education_board public.education_board,
  exam_type public.exam_type,
  target_exam_year int,
  referral_source text,
  is_minor boolean not null default true,
  guardian_consent_acknowledged boolean not null default false,
  consent_notice_version text not null default 'v1',
  created_at timestamptz not null default now(),
  unique (phone)
);

alter table public.waitlist_signups enable row level security;

-- Public insert-only (the landing page form runs unauthenticated). No select
-- policy for anon/authenticated — reads go through the service role only, so
-- one waitlist signup can never enumerate another's phone/email.
create policy waitlist_signups_insert_public on public.waitlist_signups
  for insert to anon, authenticated
  with check (
    guardian_consent_acknowledged = true or is_minor = false
  );
