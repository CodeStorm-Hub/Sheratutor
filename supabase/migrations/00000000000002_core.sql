-- ============================================================================
-- Core: institutions, profiles, roles
-- ============================================================================

create type public.user_role as enum ('STUDENT', 'TEACHER', 'INST_ADMIN', 'GOVT_ADMIN');
create type public.education_board as enum (
  'DHAKA', 'RAJSHAHI', 'COMILLA', 'BARISAL', 'SYLHET',
  'CHITTAGONG', 'JESSORE', 'DINAJPUR', 'MYMENSINGH', 'MADRASAH', 'TECHNICAL'
);
create type public.exam_type as enum ('SSC', 'HSC');
create type public.academic_group as enum ('SCIENCE', 'HUMANITIES', 'BUSINESS_STUDIES');
create type public.institution_type as enum ('COACHING', 'SCHOOL', 'GOVT_BOARD');
create type public.subscription_tier as enum ('TRIAL', 'BASIC', 'PREMIUM', 'ENTERPRISE');

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type public.institution_type not null,
  brand_logo_url text,
  primary_color_hex text,
  subscription_tier public.subscription_tier not null default 'TRIAL',
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profile table keyed 1:1 to auth.users. Supabase Auth owns credentials;
-- we never store password hashes here (see docs/review — anti-pattern in the original ERD).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text unique,
  role public.user_role not null default 'STUDENT',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  education_board public.education_board,
  exam_type public.exam_type,
  academic_group public.academic_group,
  target_exam_year int,
  overall_momentum_score numeric(5, 2) not null default 0,
  -- PDPA 2026: anyone under 18 is a "child"; verifiable guardian consent required.
  date_of_birth date,
  is_minor boolean generated always as (
    date_of_birth is not null and date_of_birth > (current_date - interval '18 years')
  ) stored,
  guardian_phone text,
  guardian_consent_at timestamptz,
  guardian_consent_method text, -- e.g. 'SMS_OTP'
  training_data_opt_in boolean not null default false, -- separate, unbundled, default OFF
  training_data_opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_minor_requires_consent check (
    is_minor = false or guardian_consent_at is not null
  )
);

create table public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  institution_id uuid not null references public.institutions (id) on delete cascade,
  department text,
  designation text,
  created_at timestamptz not null default now()
);

create index idx_teacher_profiles_institution on public.teacher_profiles (institution_id);
create index idx_student_profiles_user on public.student_profiles (user_id);

-- updated_at trigger helper, reused everywhere
create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_institutions_updated_at before update on public.institutions
  for each row execute function private.set_updated_at();
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger trg_student_profiles_updated_at before update on public.student_profiles
  for each row execute function private.set_updated_at();

-- Auto-create a profile row when a new auth.users row appears
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.phone);
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Security-definer helper: is the current user staff (teacher/admin) of a given institution?
-- Lives in `private` (never exposed to PostgREST) and checks auth.uid() explicitly inside.
create or replace function private.is_institution_staff(target_institution_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.teacher_profiles tp
    where tp.institution_id = target_institution_id
      and tp.user_id = (select auth.uid())
  );
$$;

-- `private` is not in PostgREST's exposed-schema list, so this is never reachable via
-- client .rpc() regardless of grants. Grant to `authenticated` because RLS policies
-- evaluate as the calling role and need EXECUTE to invoke it; revoke from anon/public
-- as defense-in-depth against direct SQL connections.
revoke execute on function private.is_institution_staff(uuid) from public, anon;
grant execute on function private.is_institution_staff(uuid) to authenticated;

create or replace function private.current_role()
returns public.user_role
language sql
security definer
stable
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

revoke execute on function private.current_role() from public, anon;
grant execute on function private.current_role() to authenticated;
