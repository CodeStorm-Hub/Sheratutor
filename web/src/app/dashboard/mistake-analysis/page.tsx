import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/PageHeader';
import { mistakePatterns as defaultMistakes } from '@/data/mockData';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export default async function MistakeAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', user!.id)
    .maybeSingle();

  const { data: weaknesses } = await supabase
    .from('weakness_logs')
    .select('*, chapters(title_en, subjects(name_en))')
    .eq('student_id', profile?.id ?? '')
    .order('weakness_score', { ascending: false });

  const dynamicMistakes = (weaknesses && weaknesses.length > 0)
    ? weaknesses.map((w, idx) => ({
        type: `${w.chapters?.title_en || 'Topic'} gap`,
        subject: w.chapters?.subjects?.name_en || 'Physics',
        count: `${Math.round(Number(w.weakness_score) * 10)} mistakes`,
        color: (idx === 0 ? 'coral' : idx === 1 ? 'sun' : 'mint') as 'coral' | 'sun' | 'mint',
      }))
    : defaultMistakes;

  return (
    <>
      <PageHeader
        title="Mistake analysis"
        description="Patterns from your assessments, turned into your next advantage."
      >
        <button type="button" className="primary-btn">
          Download report <ArrowUpRight size={15} />
        </button>
      </PageHeader>

      <div className="mistakes">
        <div className="mistake-summary">
          <div>
            <span>MARKS RECOVERABLE</span>
            <strong>+18</strong>
            <p>in your next Physics test</p>
          </div>
          <div className="mistake-orbit">
            <b>76%</b>
            <small>conceptual</small>
          </div>
        </div>

        {dynamicMistakes.map((x, i) => (
          <article className="mistake-row" key={`${x.type}-${i}`}>
            <span className={`mistake-dot ${x.color}`} />
            <div>
              <b>{x.type}</b>
              <small>
                {x.subject} · {x.count}
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
