-- The landing waitlist form now offers "University Admission" alongside SSC and
-- HSC so admission-test aspirants can register their interest. The waitlist
-- Examination field is backed by the shared public.exam_type enum, so extend the
-- enum with an 'ADMISSION' member. student_profiles.exam_type and subjects.level
-- reuse the same type but their own forms keep offering only SSC / HSC.
alter type public.exam_type add value if not exists 'ADMISSION';
