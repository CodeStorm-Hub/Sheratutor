-- Add support for NCTB Board CQ and MCQ structured data in questions table
alter table public.questions
  add column question_type varchar(10) default 'CQ',
  add column stimulus_bn text,
  add column stimulus_en text,
  add column sub_questions_json jsonb,
  add column mcq_options_json jsonb,
  add column mcq_correct_option text;
