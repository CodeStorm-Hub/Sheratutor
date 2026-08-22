import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { BarChart } from '@/components/BarChart';
import { subjects } from '@/data/mockData';
import { ChevronRight, Upload } from 'lucide-react';
import { submissionStatusLabel } from '@/lib/submission-status';

export default async function SubmissionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', user!.id)
    .maybeSingle();

  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('*, question_papers(title, total_marks, subjects(name_en))')
    .eq('student_id', profile?.id ?? '')
    .order('submitted_at', { ascending: false })
    .limit(10);

  const latest = submissions?.[0];
  const latestScore = latest?.total_score_obtained ?? 82;
  const latestMax = latest?.max_possible_score ?? 100;
  const latestTitle =
    latest?.question_papers?.title || 'Physics Model Test Examination';

  return (
    <>
      <PageHeader
        title="Your results"
        description="Every practice session, made visible."
      >
        <Link href="/dashboard/upload" className="primary-btn">
          <Upload size={15} /> Upload answer sheet
        </Link>
      </PageHeader>

      <div className="results-grid">
        <article className="result-feature">
          <Tag color="mint">LATEST ASSESSMENT</Tag>
          <h2>{latestTitle}</h2>
          <div className="result-number">
            {latestScore}
            <span>/{latestMax}</span>
          </div>
          <p>+9 marks from your previous assessment</p>
          {latest ? (
            <Link
              href={`/dashboard/submissions/${latest.id}`}
              className="dark-wide"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              See full result <ChevronRight size={15} />
            </Link>
          ) : (
            <Link
              href="/dashboard/upload"
              className="dark-wide"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              Submit a paper <ChevronRight size={15} />
            </Link>
          )}
        </article>

        <article className="score-history">
          <h3>Score history</h3>
          <BarChart />
        </article>

        <article className="subject-ranks">
          <h3>Subject performance</h3>
          {subjects.map((x) => (
            <div key={x.subject}>
              <span>{x.subject}</span>
              <i>
                <em style={{ width: `${x.value}%` }} />
              </i>
              <b>{x.value}%</b>
            </div>
          ))}
        </article>
      </div>

      {/* Submissions List */}
      <section style={{ marginTop: 32 }}>
        <div className="section-heading" style={{ padding: '0 0 16px 0' }}>
          <div>
            <h2>Past Assessments</h2>
            <p>Your complete submission and grading history.</p>
          </div>
        </div>

        {(!submissions || submissions.length === 0) ? (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: 16,
              background: '#fff',
              color: 'var(--muted)',
            }}
          >
            No submissions recorded yet. Upload an answer sheet to get your first board-style grade!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/submissions/${s.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  background: '#fff',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <b style={{ fontSize: 14, display: 'block' }}>
                    {s.question_papers?.subjects?.name_en || 'Subject'} —{' '}
                    {s.question_papers?.title || 'Practice Paper'}
                  </b>
                  <small style={{ color: 'var(--muted)', fontSize: 11 }}>
                    Submitted on{' '}
                    {new Date(s.submitted_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Tag color={s.status === 'COMPLETED' ? 'mint' : 'sun'}>
                    {submissionStatusLabel(s.status).toUpperCase()}
                  </Tag>
                  <strong style={{ fontFamily: 'Space Mono', fontSize: 16 }}>
                    {s.total_score_obtained != null
                      ? `${s.total_score_obtained}/${s.max_possible_score}`
                      : '—'}
                  </strong>
                  <ChevronRight size={16} color="#69718c" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
