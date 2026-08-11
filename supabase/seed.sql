-- Seed: the 4-subject / 8-book vertical-slice scope (docs/review §9.2 — the
-- hand-off guide's 66-book target is descoped to Physics/Chemistry/Math/English
-- per the original AI-strategy doc, which correctly identifies these as the
-- subjects with objective, verifiable rubrics; Humanities/Commerce follow once
-- grading is proven).

insert into public.subjects (code, name_en, name_bn, level, subject_group) values
  ('SSC-PHY', 'Physics', 'পদার্থবিজ্ঞান', 'SSC', 'SCIENCE'),
  ('SSC-CHEM', 'Chemistry', 'রসায়ন', 'SSC', 'SCIENCE'),
  ('SSC-MATH', 'Mathematics', 'গণিত', 'SSC', 'GENERAL'),
  ('SSC-ENG', 'English', 'ইংরেজি', 'SSC', 'GENERAL')
on conflict (code) do nothing;

-- One curriculum_version per (subject, language) = 8 books total.
insert into public.curriculum_versions (subject_id, edition_year, language_tag, is_active, notes)
select s.id, 2026, lang.tag::public.language_tag, true, 'Vertical-slice seed'
from public.subjects s
cross join (values ('bn'), ('en')) as lang(tag)
where s.code in ('SSC-PHY', 'SSC-CHEM', 'SSC-MATH', 'SSC-ENG')
on conflict (subject_id, edition_year, language_tag) do nothing;

-- ---------------------------------------------------------------------------
-- One real end-to-end vertical-slice example: Physics chapter, rubric, and a
-- mock question paper — using the SRS's own FR-EVAL-02 worked example
-- (Newton's Second Law, unit-conversion deduction) so the upload -> grade ->
-- review flow has something genuine to click through, not placeholder text.
-- ---------------------------------------------------------------------------

insert into public.chapters (subject_id, chapter_no, title_en, title_bn, weightage_description)
select s.id, 3, 'Force and Motion', 'বল ও গতি', 'Newton''s laws of motion; commonly examined via CQ.'
from public.subjects s where s.code = 'SSC-PHY'
on conflict (subject_id, chapter_no) do nothing;

insert into public.rubrics (chapter_id, version, title, criteria_json, is_active)
select
  c.id,
  1,
  'Newton''s Second Law — numerical CQ',
  '[
    {"step_name": "Formula Statement", "max_step_marks": 2, "matching_rules": "States F = ma correctly with correct variable definitions."},
    {"step_name": "Unit Conversion", "max_step_marks": 2, "matching_rules": "Correctly converts mass to kg (divide grams by 1000) before substitution."},
    {"step_name": "Substitution & Calculation", "max_step_marks": 4, "matching_rules": "Substitutes converted values and arrives at the numerically correct force in Newtons."},
    {"step_name": "Final Answer with Unit", "max_step_marks": 2, "matching_rules": "States the final answer with correct SI unit (N)."}
  ]'::jsonb,
  true
from public.chapters c
join public.subjects s on s.id = c.subject_id
where s.code = 'SSC-PHY' and c.chapter_no = 3
on conflict do nothing;

insert into public.question_papers (created_by_user_id, subject_id, title, paper_type, difficulty, total_marks, is_public_template)
select null, s.id, 'Force and Motion — Quick Check', 'CQ', 'BOARD_STANDARD', 10, true
from public.subjects s where s.code = 'SSC-PHY'
on conflict do nothing;

insert into public.questions (question_paper_id, chapter_id, rubric_id, question_number, question_text_bn, question_text_en, max_marks)
select
  qp.id,
  c.id,
  r.id,
  1,
  'একটি বস্তুর ভর ৫০০ গ্রাম। এর উপর ১০ N বল প্রয়োগ করলে ত্বরণ নির্ণয় কর।',
  'A body has a mass of 500 grams. Find its acceleration when a force of 10 N is applied.',
  10
from public.question_papers qp
join public.subjects s on s.id = qp.subject_id and s.code = 'SSC-PHY'
join public.chapters c on c.subject_id = s.id and c.chapter_no = 3
join public.rubrics r on r.chapter_id = c.id and r.version = 1
where qp.title = 'Force and Motion — Quick Check'
on conflict do nothing;
