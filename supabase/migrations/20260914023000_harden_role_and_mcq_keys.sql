-- Harden profile role updates, strip anon access to MCQ keys, privatize
-- user-generated public templates, and document Auth leaked-password setting.

-- 1) Prevent authenticated users from escalating profiles.role
create or replace function private.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
begin
  if tg_op = 'UPDATE'
     and new.role is distinct from old.role
     and jwt_role is distinct from 'service_role' then
    raise exception 'profiles.role cannot be changed by this role';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_role_escalation on public.profiles;
create trigger trg_prevent_profile_role_escalation
  before update on public.profiles
  for each row
  execute function private.prevent_profile_role_escalation();

-- Column-level: authenticated may update identity fields, not role.
revoke update on table public.profiles from authenticated;
grant update (full_name, phone, updated_at) on table public.profiles to authenticated;

-- 2) Anon must not read MCQ answer keys via PostgREST
revoke select on table public.questions from anon;
grant select (
  id,
  question_paper_id,
  chapter_id,
  rubric_id,
  question_number,
  question_text_bn,
  question_text_en,
  max_marks,
  answer_region_json,
  created_at,
  question_type,
  stimulus_bn,
  stimulus_en,
  sub_questions_json,
  mcq_options_json
) on table public.questions to anon;

-- 3) User-generated papers should not be public templates (seed templates keep public flag when created_by is null)
update public.question_papers
set is_public_template = false
where is_public_template = true
  and created_by_user_id is not null;
