-- The landing waitlist form now asks whether the person signing up is the
-- student themselves or a parent / legal guardian filling it in on the
-- student's behalf. Persist that choice so early-access outreach can address
-- guardians correctly and so PDPA 2026 guardian-consent records stay
-- attributable. Existing rows predate the question, so default to 'student'.
alter table public.waitlist_signups
  add column if not exists signup_role text not null default 'student'
    check (signup_role in ('student', 'guardian'));
