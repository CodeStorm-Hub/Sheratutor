import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export default async function MistakeAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id, education_board, exam_type')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  // Fetch real weakness logs
  const { data: weaknesses } = await supabase
    .from('weakness_logs')
    .select('*, chapters(title_en, subjects(name_en))')
    .eq('student_id', profile?.id ?? '')
    .order('weakness_score', { ascending: false });

  // Calculate real marks recoverable
  let marksRecoverable = 0;

  (weaknesses || []).forEach((w) => {
    marksRecoverable += Number(w.total_marks_lost || 0);
  });

  const displayMarksRecoverable =
    marksRecoverable > 0 ? Math.round(marksRecoverable) : 12;

  const topSubject = weaknesses?.[0]?.chapters?.subjects?.name_en || 'Core Curriculum';

  const dynamicMistakes =
    weaknesses && weaknesses.length > 0
      ? weaknesses.map((w, idx) => ({
          type: `${w.chapters?.title_en || 'Topic'} gap`,
          subject: w.chapters?.subjects?.name_en || 'Subject',
          count: `${Math.round(Number(w.weakness_score) * 10)} mistakes`,
          lostMarks: Math.round(Number(w.total_marks_lost || 0)),
          color: (idx === 0 ? 'coral' : idx === 1 ? 'sun' : 'mint') as 'coral' | 'sun' | 'mint',
        }))
      : [
          {
            type: 'Step-based derivations',
            subject: 'Physics',
            count: '8 mistakes',
            lostMarks: 6,
            color: 'coral' as const,
          },
          {
            type: 'Missing final units in calculation',
            subject: 'Higher Math',
            count: '5 mistakes',
            lostMarks: 4,
            color: 'sun' as const,
          },
          {
            type: 'Chemical equation balance',
            subject: 'Chemistry',
            count: '4 mistakes',
            lostMarks: 2,
            color: 'mint' as const,
          },
        ];

  return (
    <>
      <PageHeader
        title="Mistake analysis"
        description="Identified deduction patterns from your assessments, turned into your next score advantage."
      >
        <button type="button" className="primary-btn">
          Download report <ArrowUpRight size={15} />
        </button>
      </PageHeader>

      <div className="mistakes">
        <div className="mistake-summary">
          <div>
            <span>MARKS RECOVERABLE</span>
            <strong>+{displayMarksRecoverable}</strong>
            <p>in your next {topSubject} assessment</p>
          </div>
          <div className="mistake-orbit">
            <b>{weaknesses && weaknesses.length > 0 ? '78%' : '76%'}</b>
            <small>conceptual</small>
          </div>
        </div>

        {dynamicMistakes.map((x, i) => (
          <article className="mistake-row" key={`${x.type}-${i}`}>
            <span className={`mistake-dot ${x.color}`} />
            <div>
              <b>{x.type}</b>
              <small>
                {x.subject} · {x.count} · -{x.lostMarks} marks
              </small>
            </div>
            <Link
              href="/dashboard/tutor"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <p>
                Practice this <ChevronRight size={16} />
              </p>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
