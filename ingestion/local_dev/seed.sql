insert into subjects (code, name_en, name_bn, level, subject_group) values
  ('SSC-PHY', 'Physics', 'পদার্থবিজ্ঞান', 'SSC', 'SCIENCE'),
  ('SSC-CHEM', 'Chemistry', 'রসায়ন', 'SSC', 'SCIENCE'),
  ('SSC-MATH', 'Mathematics', 'গণিত', 'SSC', 'GENERAL'),
  ('SSC-ENG', 'English', 'ইংরেজি', 'SSC', 'GENERAL')
on conflict (code) do nothing;

insert into curriculum_versions (subject_id, edition_year, language_tag, is_active)
select s.id, 2026, lang.tag::language_tag, true
from subjects s
cross join (values ('bn'), ('en')) as lang(tag)
where s.code in ('SSC-PHY', 'SSC-CHEM', 'SSC-MATH', 'SSC-ENG')
on conflict (subject_id, edition_year, language_tag) do nothing;

insert into chapters (subject_id, chapter_no, title_en, title_bn)
select s.id, 3, 'Force and Motion', 'বল ও গতি'
from subjects s where s.code = 'SSC-PHY'
on conflict (subject_id, chapter_no) do nothing;

insert into rubrics (chapter_id, version, title, criteria_json)
select
  c.id, 1, 'Newton''s Second Law — numerical CQ',
  '[
    {"step_name": "Formula Statement", "max_step_marks": 2, "matching_rules": "States F = ma correctly."},
    {"step_name": "Unit Conversion", "max_step_marks": 2, "matching_rules": "Correctly converts mass to kg."},
    {"step_name": "Substitution & Calculation", "max_step_marks": 4, "matching_rules": "Correct numerical force in Newtons."},
    {"step_name": "Final Answer with Unit", "max_step_marks": 2, "matching_rules": "States final answer with SI unit (N)."}
  ]'::jsonb
from chapters c join subjects s on s.id = c.subject_id
where s.code = 'SSC-PHY' and c.chapter_no = 3
on conflict do nothing;

insert into question_papers (subject_id, title, paper_type, total_marks, is_public_template)
select s.id, 'Force and Motion — Quick Check', 'CQ', 10, true
from subjects s where s.code = 'SSC-PHY'
on conflict do nothing;

insert into questions (question_paper_id, chapter_id, rubric_id, question_number, question_text_bn, question_text_en, max_marks)
select qp.id, c.id, r.id, 1,
  'একটি বস্তুর ভর ৫০০ গ্রাম। এর উপর ১০ N বল প্রয়োগ করলে ত্বরণ নির্ণয় কর।',
  'A body has a mass of 500 grams. Find its acceleration when a force of 10 N is applied.',
  10
from question_papers qp
join subjects s on s.id = qp.subject_id and s.code = 'SSC-PHY'
join chapters c on c.subject_id = s.id and c.chapter_no = 3
join rubrics r on r.chapter_id = c.id and r.version = 1
where qp.title = 'Force and Motion — Quick Check'
on conflict do nothing;
